var nodemailer = require('nodemailer');
var fs = require('fs');

var result_image_path = "./public/resources/selectedimages/result_image.jpg";



/*
var mailOptions = {
	from: 'lhnw7662@naver.com',
	to: 'lhnw7662@naver.com',
	subject: 'Sending Result Image to Email',
	attachments: [
	{
		filename: 'result_image.jpg',
		content: fs.createReadStream(result_image_path)
	}]
};
*/
var transporter = nodemailer.createTransport({
	service: 'naver',
	auth: {
		user: 'lhnw7662@naver.com',
		pass: 'Wkwmdska^^#'
	}
});

var mailOptions = {
	from: 'lhnw7662@naver.com',
	to: 'lhnw7662@naver.com',
	subject: 'Sending Result Image to Email',
	attachments: [
	{
		filename: 'result_image.jpg',
		path: result_image_path
	}]
};

transporter.sendMail(mailOptions, function(error, info) {
		if(error) {
			console.log(error);
		} else {
			console.log("Email sent: "+info.response);
		}
	});
