import cv2
import numpy as np
from flask import Flask, Response, render_template, request, jsonify
from sklearn.neighbors import KNeighborsClassifier
import os
import pickle
#其中包含人脸图像的特征向量。特征向量是从人脸图像中提取的一组数值，用于描述人脸的某些关键特征，如眼睛、鼻子、嘴巴等的位置、形状、大小等信息。这些特征向量通常被用于人脸识别、人脸验证、人脸聚类等应用中，它们可以作为人脸图像的一种紧凑的表示方式，使得人脸图像可以更容易地进行处理和比较。
#在这个示例中，我们使用了OpenCV中提供的深度学习模型（如FaceNet）来计算人脸图像的特征向量，并将这些特征向量存储在embeddings列表中。这些特征向量将被用作训练数据，以训练一个分类器，该分类器可以根据新的人脸图像来预测该人脸属于哪个用户。
app = Flask(__name__)
camera = cv2.VideoCapture(0)
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
embedder = cv2.dnn.readNetFromTorch('nn4.small2.v1.t7')

if os.path.exists("embeddings.pickle"):
    with open("embeddings.pickle", "rb") as f:
        data = pickle.load(f)
    X_train, y_train = data["embeddings"], data["labels"]
else:
    X_train = np.empty(shape=(0, 128))
    y_train = np.empty(shape=(0,), dtype=np.int32)

clf = KNeighborsClassifier(n_neighbors=3, metric="euclidean")



def detect_face(img):
    print(img.shape)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # clf.fit(X_train, y_train)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4,minSize=(80,80))
    return faces


def generate_frames():
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            faces = detect_face(frame)
            for (x, y, w, h) in faces:
                face = frame[y:y+h, x:x+w]
                faceBlob = cv2.dnn.blobFromImage(face, 1.0 / 255, (96, 96), (0, 0, 0), swapRB=True, crop=False)
                embedder.setInput(faceBlob)
                vec = embedder.forward()
                cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 255, 255), 2)
                cv2.imshow('Face Recognition', frame)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
                # preds = clf.predict_proba(vec)[0]
                # j = np.argmax(preds)
                # proba = preds[j]
                # if proba > 0.7:
                #     name = clf.classes_[j]
                #     cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 255, 255), 2)
                #     cv2.putText(frame, name, (x, y), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
                #     cv2.imshow('Face Recognition', frame)
                #     if cv2.waitKey(1) & 0xFF == ord('q'):
                #         break
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/add_face', methods=['POST'])
def add_face():
    name = request.form['name']
    embeddings = []
    for i in range(3):
        success, frame = camera.read()
        if not success:
            break
        else:
            faces = detect_face(frame)
            if len(faces) != 1:
                continue
            (x, y, w, h) = faces[0]
        face = frame[y:y+h, x:x+w]
        faceBlob = cv2.dnn.blobFromImage(face, 1.0 / 255, (96, 96), (0, 0, 0), swapRB=True, crop=False)
        embedder.setInput(faceBlob)
        vec = embedder.forward()
        embeddings.append(vec.flatten())
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
        cv2.putText(frame, name, (x, y), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.imshow('Add Face', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
        if len(embeddings) == 3:
            X_train.append(np.mean(embeddings, axis=0))
            y_train.append(name)
            clf.fit(X_train, y_train)
            data = {"embeddings": X_train, "labels": y_train}
            with open("embeddings.pickle", "wb") as f:
                pickle.dump(data, f)
            return jsonify({'success': True})
        else:
            return jsonify({'success': False})

if __name__ == '__main__':
    app.run(debug=True)