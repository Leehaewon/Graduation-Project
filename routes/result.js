var express = require('express');
var router = express.Router();
var fs = require('fs');
var nodemailer = require('nodemailer');

var save_path = "./public/resources/selectedimages/";
var result_image_path = "./public/resources/selectedimages/result_image.jpg";

/* GET home page. */
/*
router.get('/', function(req, res, next) {
  res.render('result', { title: 'Result' });
});
*/

router.get('/', function(req, res, next) {	

  	fs.readFile('result.html', function(error, data) {
		if(error) {
			console.log(error);
		} else {
			res.writeHead(200);
			res.end(data);
		}
	});

});

router.post('/check_imgUrl', function(req, res, next) {
	befor_imgUrl = 'result_image.jpg';
	console.log(befor_imgUrl);
			if(befor_imgUrl == ''){
				res.send({result:false});
			}else{
				res.send({result:true, imgUrl:befor_imgUrl});
			}
});

router.post('/delete_img', function(req, res, next) {
	
	fs.readdir(save_path, function(err, items) {
         if(err) {
            res.send({result:false});
         } else {
         	for(var i=0;i<items.length;i++) {
         		console.log(items[i]);
         		fs.unlink(save_path+items[i], function(error) {
         			if(error) {
         				console.log(error);
         			}
         		});
         	}
            res.send({result:true});
         }
      });
     
});

router.post('/send_email', function(req, res, next) {
	var emailaddress = req.body.emailAddress;
	console.log("emailaddress : "+emailaddress);
	var transporter = nodemailer.createTransport({
		service: 'naver',
		auth: {
			user: 'lhnw7662@naver.com',
			pass: 'Wkwmdska^^#'
		}
	});

	var mailOptions = {
		from: 'lhnw7662@naver.com',
		to: emailaddress,
		subject: '[project KLAC] 사진을 메일로 받아보세요!',
		attachments: [
		{
			filename: 'result_image.jpg',
			path: result_image_path
		}]
	};

	transporter.sendMail(mailOptions, function(error, info) {
		if(error) {
			console.log(error);
			res.send({result:false});
		} else {
			console.log("Email sent: "+info.response);
			res.send({result:true});
		}
	});
})

module.exports = router;
