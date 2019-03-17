var express = require('express');
var router = express.Router();
var fs = require('fs');

var image_path = "./public/resources/images/";
/* GET style page. */
/*
router.get('/', function(req, res, next) {
  res.render('style', { title: 'Style' });
});

module.exports = router;
*/

module.exports = router;
router.get('/', function(req, res, next) {
	  fs.readFile('style.html', function(error, data) {
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
	console.log(imgUrl);
	if(imgUrl == ''){
		res.send({result:false});
	}else{

		res.send({result:true});
	}


});

router.post('/send_loadImgList', function(req, res, next) {

      fs.readdir(image_path, function(err, items) {
         if(err) {
            res.send({result:false});
         } else {
            // console.log(items);
            res.send({result:true, imgList:items});
         }
      });

});

