var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET guide page. */
/*
router.get('/', function(req, res, next) {
  res.render('guide', { title: 'guide' });
});

module.exports = router;
*/

router.get('/', function(req, res, next) {	
  fs.readFile('guide.html', function(error, data) {
		if(error) {
			console.log(error);
		} else {
			res.writeHead(200);
			res.end(data);
		}
	});
});

module.exports = router;