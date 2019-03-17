// controller.js

var fs = require('fs');

exports.send_imgUrl = function(req, res){
	var imgUrl = req.body;
console.log(imgUrl);

res.send({result:true});

};

exports.get_style = function(req, res){

	console.log('gggggggggggggggggggggg');
	  fs.readFile('style.html', function(error, data) {
			if(error) {
				console.log(error);
			} else {
				res.writeHead(200);
				res.end(data);
			}
		});

};
