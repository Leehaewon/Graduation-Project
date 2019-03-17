import numpy as np
import tensorflow as tf
import os

data_dir = "C:/Users/hjc/Desktop/transfer/transfer/StyleTransfer_DeepLearning/vgg16/"
path_graph_def = "vgg16.tfmodel"

class VGG16:
    tensor_name_input_image = "images:0"
    
    tensor_name_dropout = 'dropout/random_uniform:0'
    tensor_name_dropout1 = 'dropout_1/random_uniform:0'
    
    layer_names = ['conv1_1/conv1_1', 'conv1_2/conv1_2',
               'conv2_1/conv2_1', 'conv2_2/conv2_2',
               'conv3_1/conv3_1', 'conv3_2/conv3_2', 'conv3_3/conv3_3',
               'conv4_1/conv4_1', 'conv4_2/conv4_2', 'conv4_3/conv4_3',
               'conv5_1/conv5_1', 'conv5_2/conv5_2', 'conv5_3/conv5_3']
    
    def __init__(self):
        self.graph = tf.Graph()
        with self.graph.as_default():
            path = os.path.join(data_dir, path_graph_def)
            with tf.gfile.FastGFile(path,'rb') as file:
                graph_def = tf.GraphDef()
                
                graph_def.ParseFromString(file.read())
                
                tf.import_graph_def(graph_def, name='')
                
            self.input = self.graph.get_tensor_by_name(self.tensor_name_input_image)
            
            self.layer_tensors = [self.graph.get_tensor_by_name(name + ":0") for name in self.layer_names]
    
    def get_layer_tensors(self, layer_ids):
        return [self.layer_tensors[idx] for idx in layer_ids]
    
    def get_layer_names(self,layer_ids):
        return [self.layer_names[idx] for idx in layer_ids]
    
    def get_all_layer_names(self, startswith=None):
        names = [op.name for op in self.graph.get_operations()]
        
        if startswith is not None:
            names = [name for name in names if name.startswith(startswith)]
        
        return names
    
    def create_feed_dict(self, image):
        image = np.expand_dims(image, axis=0)
        if False:
            dropout_fix = 1.0
            feed_dict = {self.tensor_name_input_image: image,
                        self.tensor_name_dropout: [[dropout_fix]],
                        self.tensor_name_dropout1: [[dropout_fix]]}
        else:
            feed_dict = {self.tensor_name_input_image: image}
        
        return feed_dict
    