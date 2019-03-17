import sys
import cv2 as cv
import numpy as np
import base64
import PIL.Image

BACKGROUND      = 1
UNKNOWN         = 0
OBJECT          = 255
BLACK           = (0, 0, 0)
KERNEL_SIZE     = 3
PATH            = "./public/resources/selectedimages/"
MAX_SIZE        = 450

def point(x, y):
    return tuple(np.add(x, y))

inputImg = cv.imread(PATH + "content_image.jpg")
nHeight, nWidth = inputImg.shape[:2]

inString = sys.argv[1]
info, in_base64_string = inString.split(',')
#n_base64_string += '=' * ((4 -len(in_base64_string) % 4) % 4)
maskImg = np.fromstring(base64.b64decode(in_base64_string), np.uint8)
maskImg = cv.imdecode(maskImg, cv.IMREAD_GRAYSCALE)
maskImg = cv.resize(maskImg, (nWidth, nHeight), interpolation=cv.IMREAD_GRAYSCALE)

if nHeight > 500 and nWidth > 500 :
    if(nHeight > nWidth) : rate = MAX_SIZE/nHeight
    else                 : rate = MAX_SIZE/nWidth
    nWidth = int(nWidth * rate)
    nHeight = int(nHeight * rate)
    inputImg = cv.resize(inputImg, (nWidth, nHeight))
    maskImg = cv.resize(maskImg, (nWidth, nHeight))
    cv.imwrite(PATH + "content_image.jpg", inputImg)

cv.rectangle(maskImg, point((0,0), (0, 0)), point((nWidth-1, nHeight-1), (0, 0)), BACKGROUND, 3)

for x in range(0,nHeight):
    for y in range(0,nWidth):
        pix = maskImg[x,y]
        if pix < 50                     : maskImg[x,y] = BACKGROUND
        elif 50 <= pix and pix <= 200   : maskImg[x,y] = UNKNOWN
        elif 200 < pix                  : maskImg[x,y] = OBJECT
        else    : print (pix)

markers = maskImg.astype('int32')
markers = cv.watershed(inputImg, markers)

segImg = markers.astype('uint8')

edge = cv.Canny(segImg, 50, 200)
cv.rectangle(edge, point((0,0), (0, 0)), point((nWidth-1, nHeight-1), (0, 0)), 0, 3)
kernel = np.ones((KERNEL_SIZE, KERNEL_SIZE), np.uint8)
dilation = cv.dilate(edge, kernel, iterations=1)

sendImg = cv.copyMakeBorder(inputImg,0,0,0,0,cv.BORDER_REPLICATE)

for x in range(0,nHeight-1):
    for y in range(0,nWidth-1):
        if segImg[x, y] == BACKGROUND :
            b = sendImg.item(x, y, 0) - 100
            g = sendImg.item(x, y, 1) - 100
            r = sendImg.item(x, y, 2) - 100
            if b<0 : b=0
            if g<0 : g=0
            if r<0 : r=0
            sendImg[x, y] = [b, g, r]

for x in range(0,nHeight-1):
    for y in range(0,nWidth-1):
        if dilation[x,y] > 230 :
            sendImg[x, y] = BLACK

cv.imwrite(PATH + "send_image.jpg", sendImg)
segImg = cv.cvtColor(segImg, cv.COLOR_GRAY2BGR)
cv.imwrite(PATH + "content_object.jpg", segImg)
segImg = cv.bitwise_not(segImg)
cv.imwrite(PATH + "content_background.jpg", segImg)

exit()