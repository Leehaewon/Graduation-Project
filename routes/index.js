var express = require('express');
var router = express.Router();
var fs = require('fs');

var multer = require('multer');

var image_path = "./public/resources/images/";

var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		console.log(image_path);
		cb(null, image_path);
	},
	filename: function(req, file, cb) {
		console.log(file);
		cb(null, file.originalname);
	}
});

var upload = multer({storage: storage});

/* GET home, index page. */
/*
router.get('/', function(req, res, next) {	
  res.render('index', { title: 'Express' });
});

module.exports = router;
*/


// html 위치로 변경해주기 
router.get('/', function(req, res, next) {	
	var ua = req.headers['user-agent'], $ = {};
	if (/mobile/i.test(ua)){
		fs.readFile('mobile-index.html', function(error, data) {
			if(error) {
				console.log(error);
			} else {
				res.writeHead(200);
				res.end(data);
			}
		});
	}
	else{
		fs.readFile('index.html', function(error, data) {
			if(error) {
				console.log(error);
			} else {
				res.writeHead(200);
				res.end(data);
			}
		});
	}
});

router.post('/send_mobile_img', upload.single('uploadImg'), function(req, res, next) {
	var file = req.file;
	var originalname = file.originalname;
	var size = file.size;

	if(!file) {
		console.log("No file received");
	} else {
		fs.readFile('mobile-success.html', function(error, data) {
			if(error) {
				console.log(error);
			} else {
		console.log("file received");
				res.writeHead(200);
				res.end(data);
			}
		});
	}
});




module.exports = router;






























/*
router.post('/send_img', upload.single('loadImg'), function(req, res, next) {
	console.log("send_img start!!!");
	fs.readFile(req.file.uploadImg.path, function(error, data){
		if(error)
			throw error;
		else{
			var filePath = "http://localhost:3000/resources/images/" + req.files.uploadImg.name;
			fs.writeFile(filePath, data, function(error){
				if(error)
					throw error;
				else
					console.log(filePath + " success!!!");
					res.send({result:true});
			});
		}
	});
})
*/
