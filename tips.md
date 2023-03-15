在使用 KNeighborsClassifier 进行拟合时，X_train 必须是一个二维数组，其中每行表示一个样本的特征向量，每列表示一个特征维度。而 y_train 必须是一个一维数组，其中每个元素表示对应样本的类别标签。

在人脸识别的场景中，X_train 应该是一个包含所有已知人脸的嵌入向量的二维数组，每行代表一个人脸的嵌入向量，y_train 应该是一个对应的一维数组，每个元素表示对应人脸的标签（例如人名）。

如果没有预先计算好的embeddings.pickle文件，可以使用人脸检测器和嵌入模型对每个人脸图像进行处理，将处理后的嵌入向量作为X_train，对应的标签作为y_train。具体步骤如下：

加载人脸检测器和嵌入模型。

加载人脸图像数据集，并使用人脸检测器检测每张图像中的人脸位置。

对于每个检测到的人脸位置，使用嵌入模型生成对应的嵌入向量，并将其添加到X_train中，同时将对应的标签添加到y_train中。

重复步骤3，直到处理完所有人脸图像。

使用KNN或其他分类器对X_train和y_train进行训练和拟合。
