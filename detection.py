import cv2
import numpy as np
import pickle
import os
import face_recognition
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import LabelEncoder

face_cascade = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")

def detect_faces(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    return faces, gray

def recognize_faces(frame, faces, gray, clf, le):
    for (x, y, w, h) in faces:
        roi_gray = gray[y:y+h, x:x+w]
        roi_gray = cv2.resize(roi_gray, (96, 96))
        vec = roi_gray.flatten()
        vec = vec.reshape(1, -1)
        vec /= 255.0
        prediction = clf.predict(vec)
        name = le.inverse_transform(prediction)[0]
        cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 255, 255), 2)
        cv2.putText(frame, name, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)

def main():
    if not os.path.exists("embeddings.pickle"):
        X_train = np.empty((0, 9216))
        y_train = np.empty(0, dtype=int)
    else:
        with open("embeddings.pickle", "rb") as f:
            X_train, y_train, le = pickle.load(f)
    if os.path.exists("embeddings.pickle"):
        data = pickle.loads(open("embeddings.pickle", "rb").read())
        le = data["le"]
        labels = le.classes_
        embeddings = data["embeddings"]

        # 训练KNN分类器
        clf = KNeighborsClassifier(n_neighbors=3, metric="euclidean")
        clf.fit(embeddings, labels)

    else:
        X_train = np.array(X_train)
        y_train = np.array(y_train)

        # 将标签转化为数字编码
        le = LabelEncoder()
        y_train = le.fit_transform(y_train)

        # 计算每个人脸的128维嵌入
        embeddings = face_recognition.face_encodings(X_train)

        # 保存标签编码器和人脸嵌入到文件中
        data = {"le": le, "embeddings": embeddings}
        f = open("embeddings.pickle", "wb")
        f.write(pickle.dumps(data))
        f.close()

        # 训练KNN分类器
        clf = KNeighborsClassifier(n_neighbors=3, metric="euclidean")
        clf.fit(embeddings, y_train)

    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()
        faces, gray = detect_faces(frame)
        recognize_faces(frame, faces, gray, clf, le)
        cv2.imshow("Video", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
