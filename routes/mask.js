var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var segmentationcode_path = "./StyleTransfer_Segmentation/segmentation.py";
var save_path = "./public/resources/selectedimages/content_image";
var image_path = "./public/resources/images/";
var select_image_path = "./public/resources/selectedimages/";

var befor_imgUrl ="";
/* GET home page. */
/*
router.get('/', function(req, res, next) {
  res.render('mask', { title: 'mask' });
});
*/

router.get('/', function(req, res, next) {
	befor_imgUrl="";
  fs.readFile('mask.html', function(error, data) {
		if(error) {
			console.log(error);
		} else {
			res.writeHead(200);
			res.end(data);
		}
	});
});

router.post('/send_imgUrl', function(req, res, next) {

	var imgUrl = req.body.imgUrl;
	befor_imgUrl = imgUrl;
	console.log(imgUrl);

	if(imgUrl == ''){
		res.send({result:false});
	}else{
		var inputStream = fs.createReadStream(image_path+imgUrl);
			//var outputStream = fs.createWriteStream(save_path+path.parse(imgUrl).ext);
			var outputStream = fs.createWriteStream(save_path+'.jpg');
			inputStream.pipe(outputStream);
			res.send({result:true});
	}


});

router.post('/send_maskImgUrl', function(req, res, next) {

	var imgDataUrl = req.body.imgDataUrl;

	var flag = true;
	
	var spawn = require('child_process').spawn;
	var py = spawn('python', [ segmentationcode_path , imgDataUrl]);

	py.stdout.on('data', function(data) {
		console.log("data : "+data.toString());
	});

	py.stdout.on('end', function() {
		console.log("finish");
		res.send({result:flag});
	});

	py.stderr.on('data', function(data) {
		console.log("error : "+data);
	 	flag = false;
	 	res.send({result:flag});
	 });


});

router.post('/check_imgUrl', function(req, res, next) {

		console.log(befor_imgUrl);
			if(befor_imgUrl == ''){
				res.send({result:false});
			}else{
				res.send({result:true, imgUrl:befor_imgUrl});
			}


});

router.post('/delete_img', function(req, res, next) {
	
	fs.readdir(select_image_path, function(err, items) {
         if(err) {
            res.send({result:false});
         } else {
         	for(var i=0;i<items.length;i++) {
         		console.log(items[i]);
         		fs.unlink(select_image_path+items[i], function(error) {
         			if(error) {
         				console.log(error);
         			}
         		});
         	}
            res.send({result:true});
         }
      });
     
});

router.post('/delete_maskImg', function(req, res, next) {

	fs.unlink(select_image_path+'content_object.jpg', function(error) {
         if(error) {
         	console.log(error);
         	res.send({result:false});
         }
    });

    fs.unlink(select_image_path+'content_background.jpg', function(error) {
         if(error) {
         	console.log(error);
         	res.send({result:false});
         }
    });

    fs.unlink(select_image_path+'send_image.jpg', function(error) {
         if(error) {
         	console.log(error);
         	res.send({result:false});
         }
    });
	
	res.send({result:true});
});


module.exports = router;
