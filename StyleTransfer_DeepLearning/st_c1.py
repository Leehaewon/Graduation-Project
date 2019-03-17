
# coding: utf-8

# In[1]:


#%matplotlib inline
import matplotlib.pyplot as plt
import tensorflow as tf
import numpy as np
import PIL.Image
import sys
import requests
import cv2 as cv

# In[2]:


import json
#import requests
import os

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# In[3]:


import vgg16


# In[4]:

URL = "http://localhost:3000/result"

def load_image(filename, max_size=None):
    image = PIL.Image.open(filename)
    
    if max_size is not None:
        factor = max_size / np.max(image.size)
        size = np.array(image.size) *factor
        size = size.astype(int)
        image = image.resize(size,PIL.Image.LANCZOS)
    
    return np.float32(image)


# In[5]:


def save_image(image,filename):
    image = np.clip(image,0.0, 255.0)
    image = image.astype(np.uint8)
    with open(filename,'wb') as file:
        PIL.Image.fromarray(image).save(file,'jpeg')


# In[6]:


def plot_image_big(image):
    image = np.clip(image,0.0,255.0)
    image = image.astype(np.uint8)
    display(PIL.Image.fromarray(image))


# In[7]:


def plot_images(content_image, style_image, mixed_image,isMask=None):
    fig, axes = plt.subplots(1,3,figsize=(10,10))
    fig.subplots_adjust(hspace=0.1,wspace=0.1)
    smooth = True
    
    if smooth:
        interpolation = 'sinc'
    else:
        interpolation = 'nearest'
    
    comment=[]
    if isMask == None:
        comment.append("Content")
        comment.append("Mixed")
        comment.append("Style")
    else:
        comment.append("Mask1")
        comment.append("Mask2")
        comment.append("Mask3")
    
    ax = axes.flat[0]
    ax.imshow(content_image / 255.0,interpolation=interpolation)
    ax.set_xlabel(comment[0])
    
    ax = axes.flat[1]
    ax.imshow(mixed_image / 255.0,interpolation=interpolation)
    ax.set_xlabel(comment[1])
    
    ax = axes.flat[2]
    ax.imshow(style_image / 255.0,interpolation=interpolation)
    ax.set_xlabel(comment[2])
    
    for ax in axes.flat:
        ax.set_xticks([])
        ax.set_yticks([])
        
    plt.show()
    
    


# In[8]:

'''
def cur_progress(step):
    url = "http://localhost:3000/result"
    data = {'msg': step}
    headers = {'Content-type':'application/json','Accept':'text/plain'}
    r = requests.post(url,data=json.dumps(data),headers=headers)

'''

# In[9]:


def mean_squared_error(a,b):
    return tf.reduce_mean(tf.square(a-b))


# In[10]:


def create_content_loss(session, model, content_image, layer_ids):
    feed_dict = model.create_feed_dict(image=content_image)
    layers = model.get_layer_tensors(layer_ids)
    values = session.run(layers,feed_dict=feed_dict) 

    with model.graph.as_default():
        layer_losses = []
        
        for value,layer in zip(values,layers):
            value_const = tf.constant(value)
            
            loss = mean_squared_error(layer, value_const)           
            layer_losses.append(loss)
        total_loss = tf.reduce_mean(layer_losses)
    return total_loss


# In[11]:


def gram_matrix(tensor):
    shape = tensor.get_shape()
    num_channels = int(shape[3])
    matrix = tf.reshape(tensor,shape=[-1,num_channels])
    
    gram = tf.matmul(tf.transpose(matrix),matrix)
    return gram


# In[12]:


def create_style_loss(session,model, style_image, layer_ids):
    feed_dict = model.create_feed_dict(image=style_image)
    layers = model.get_layer_tensors(layer_ids)
    with model.graph.as_default():
        gram_layers = [gram_matrix(layer) for layer in layers]
        values= session.run(gram_layers,feed_dict=feed_dict)
        layer_losses =[]
        for value, gram_layer in zip(values,gram_layers):
            value_const = tf.constant(value)  
            loss = mean_squared_error(gram_layer, value_const)
            layer_losses.append(loss)
        total_loss = tf.reduce_mean(layer_losses)
    return total_loss


# In[13]:


def style_transfer(content_image, style_image, mask_image,final_image,
                   content_layer_ids, style_layer_ids,
                   weight_content, weight_style, num_iterations, step_size):
        
    model = vgg16.VGG16()
    session = tf.InteractiveSession(graph=model.graph)
    
    print("Content layers:")
    print(model.get_layer_names(content_layer_ids))
    print()
    
    print("Style layers:")
    print(model.get_layer_names(style_layer_ids))
    print()
    
    
    loss_content = create_content_loss(session=session,
                                       model=model,
                                       content_image=content_image,
                                       layer_ids=content_layer_ids)
    
    loss_style = create_style_loss(session=session,
                                  model=model,
                                  style_image=style_image,
                                  layer_ids=style_layer_ids)

    
    adj_content = tf.Variable(1e-10, name='adj_content')
    adj_style = tf.Variable(1e-10, name='adj_style')
    
    session.run([adj_content.initializer,
                 adj_style.initializer])
    
    update_adj_content = adj_content.assign(1.0/(loss_content+1e-10))
    update_adj_style = adj_style.assign(1.0/(loss_style+1e-10))
    
    loss_combined = weight_content * adj_content * loss_content +                     weight_style * adj_style * loss_style
    
    gradient = tf.gradients(loss_combined, model.input)
    

    
    run_list = [gradient, update_adj_content, update_adj_style]
    


    mixed_image = np.random.rand(*content_image.shape) + 128

    if mask_image is not None:
        mixed_image *= mask_image
        
    if final_image is not None:
        mixed_image=final_image    

    #plot_image_big(mixed_image)
    
    for i in range(num_iterations):
        feed_dict = model.create_feed_dict(image=mixed_image)
        
        grad, adj_content_val, adj_style_val = session.run(run_list,feed_dict=feed_dict)
       
        grad = np.squeeze(grad)
        step_size_scaled = step_size / (np.std(grad) + 1e-8)
        
        if mask_image is not None:
            mixed_image -= grad * step_size_scaled * mask_image
        else:
            mixed_image -= grad * step_size_scaled
        
        mixed_image = np.clip(mixed_image, 0.0, 255.0)
        
        print(".", end="")
        
        if (i % 33 == 0 ) or (i == num_iterations -1):
            print()
            print("Iteration:",i)
            
            msg = "Weight Adj. for Content: {0:.2e}, Style: {1:.2e}"
            print(msg.format(adj_content_val, adj_style_val))
            
            #plot_images(content_image=content_image,style_image=style_image,mixed_image=mixed_image)            
           
    print()
    print("Transfer Finishi")
    #plot_image_big(mixed_image)
    
    session.close()
    
    return mixed_image


# In[14]:


content_name = sys.argv[1]

content_filename = 'C:/Users/hjc/Desktop/transfer/transfer/public/resources/selectedimages/'+content_name
content_image = load_image(content_filename, max_size =None)
#plot_image_big(content_image)

nHeight, nWidth = content_image.shape[:2]

if nHeight > 500 and nWidth > 500 :
    if(nHeight > nWidth) : rate = 450/nHeight
    else                 : rate = 450/nWidth
    content_image = cv.resize(content_image, (int(nWidth*rate), int(nHeight*rate)))

# In[15]:


style_name = sys.argv[2]
style_filename = 'C:/Users/hjc/Desktop/transfer/transfer/public/resources/selectedimages/'+style_name
style_image = load_image(style_filename, max_size=300)
#plot_image_big(style_image)


# In[302]:
mask_character_filename = 'C:/Users/hjc/Desktop/transfer/transfer/public/resources/selectedimages/content_object.jpg'
mask_background_filename = 'C:/Users/hjc/Desktop/transfer/transfer/public/resources/selectedimages/content_background.jpg'

is_mask_exist = os.path.exists(mask_character_filename)


if(is_mask_exist):

    mask_character_image = load_image(mask_character_filename,max_size=None)

    mask_background_image = load_image(mask_background_filename,max_size=None)

    #plot_images(mask1_image, mask3_image, mask2_image,1)

    mask_character_image /= 255
    mask_background_image /= 255

    

# In[303]:


    character_image = content_image * mask_character_image
#plot_image_big(character_image)


# In[308]:
style_layer_ids = list(range(13))

if(is_mask_exist):
    content_layer_ids = [4]
    background_img = style_transfer(content_image=content_image,
                         style_image=style_image,
                         mask_image=mask_background_image,final_image=None,
                         content_layer_ids=content_layer_ids,
                         style_layer_ids=style_layer_ids,
                         weight_content=10.0,
                         weight_style=10.0,
                         num_iterations=50,
                         step_size=10.0)

    print('finish background')

    # In[309]:

    #plot_image_big(result_image)


# In[310]:

content_layer_ids = [7]
final_iteration_num = 10
final_step_size = 3.0
final_content_weight = 10.0

if(is_mask_exist):
    result_image = character_image + background_img    
else:
    result_image = None
    final_iteration_num = 200
    final_step_size = 10.0
    final_content_weight = 3.0    
    content_layer_ids = [4]

final_img = style_transfer(content_image=content_image,
                     style_image=style_image,
                     mask_image=None,final_image=result_image,
                     content_layer_ids=content_layer_ids,
                     style_layer_ids=style_layer_ids,
                     weight_content=final_content_weight,
                     weight_style=10.0,
                     num_iterations=final_iteration_num,
                     step_size=final_step_size)
save_image(final_img,"result.jpg")
save_image(final_img,"C:/Users/hjc/Desktop/transfer/transfer/public/resources/selectedimages/result_image.jpg")

# flag = True
# headers = {'Content-Type': 'application/json; charset=utf-8'}
# data = {'result':flag}
# #response = requests.post(URL, headers=headers, data=data)
# #response = requests.get(URL, headers=headers, data=data)
# response = requests.get(URL, headers=headers)
# print(response.status_code)
