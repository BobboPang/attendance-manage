import cv2
import face_recognition
from flask import Flask, Response

app = Flask(__name__)

camera = cv2.VideoCapture(0)

# 加载示例图像并编码
known_image = face_recognition.load_image_file("known_person.jpg")
known_encoding = face_recognition.face_encodings(known_image)[0]


def detect_faces(frame):
    # 将图像从 BGR 转换为 RGB
    rgb_frame = frame[:, :, ::-1]

    # 检测图像中的所有面部特征
    face_locations = face_recognition.face_locations(rgb_frame)

    # 对每个面部特征进行编码
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

    # 遍历每个检测到的面部特征
    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
        # 比较面部特征与已知的面部特征
        matches = face_recognition.compare_faces([known_encoding], face_encoding)

        # 如果匹配，返回 True
        if matches[0]:
            # 在图像中标记面部特征
            print("match!")
            cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)

            # 弹出窗口
            cv2.imshow('Alert', frame)
            cv2.waitKey(0)
            cv2.destroyWindow('Alert')

    return frame


def generate_frames():
    while True:
        # 读取当前视频帧
        success, frame = camera.read()

        if not success:
            break
        else:
            # 检测面部特征并返回标记的图像
            frame = detect_faces(frame)

            # 将标记的帧返回给 Flask 应用
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/')
def index():
    # 将视频流嵌入 HTML 页面
    return """<html>
                <head>
                    <title>Face Detection</title>
                </head>
                <body>
                    <h1>Face Detection</h1>
                    <img src="/video_feed">
                </body>
            </html>"""


@app.route('/video_feed')
def video_feed():
# 从生成器函数中获取标记的视频帧
    return Response(generate_frames(),mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)