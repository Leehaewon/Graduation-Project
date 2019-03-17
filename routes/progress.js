var express = require('express');
var router = express.Router();
var fs = require('fs');

var save_path = "./public/resources/selectedimages/";
var transfercode_path = "./StyleTransfer_DeepLearning/";

/* GET home page. */
/*
router.get('/', function(req, res, next) {
  res.render('mask', { title: 'mask' });
});
*/

router.get('/', function(req, res, next) {	
  fs.readFile('progress.html', function(error, data) {
		if(error) {
			console.log(error);
		} else {
			res.writeHead(200);
			res.end(data);
		}
	});
});

router.post('/send_startAction', function(req, res, next) {

	console.log("send_start");
	var content_imgUrl = save_path+'content_image.jpg';
	var style_imgUrl = save_path+'style_image.jpg';

	var flag = true;
	
	var spawn = require('child_process').spawn;
	var py = spawn('python', [ transfercode_path+"st_c1.py" , 'content_image.jpg', 'style_image.jpg' ]);

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


module.exports = router;
