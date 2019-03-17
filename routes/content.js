var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var image_path = "./public/resources/images/";
var save_path = "./public/resources/selectedimages/style_image";
var select_image_path = "./public/resources/selectedimages/";

var befor_imgUrl ="";


/* GET content page. */
/*
router.get('/', function(req, res, next) {
  res.render('content', { title: 'content' });
});

module.exports = router;
*/

router.get('/', function(req, res, next) {
	befor_imgUrl="";
  fs.readFile('content.html', function(error, data) {
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

	if(imgUrl == ''){
		res.send({result:false});
	}else{

			var inputStream = fs.createReadStream(image_path+imgUrl);
			var outputStream = fs.createWriteStream(save_path+path.parse(imgUrl).ext);
			inputStream.pipe(outputStream);
			res.send({result:true});
	}


});

router.post('/check_imgUrl', function(req, res, next) {

		console.log(befor_imgUrl);
			if(befor_imgUrl == ''){
				res.send({result:false});
			}else{
				res.send({result:true, imgUrl:befor_imgUrl});
			}


});

router.post('/send_loadImgList', function(req, res, next) {

      fs.readdir(image_path, function(err, items) {
         if(err) {
            res.send({result:false});
         } else {
            res.send({result:true, imgList:items});
         }
      });

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


module.exports = router;