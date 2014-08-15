var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var app = express();

var options = {
	url: 'https://ssol.columbia.edu',
	headers: {
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.68 Safari/537.36'
	},
	secureProtocol: 'SSLv3_method'
};

app.get('/getLoginUrl', function(req, res) {
	request(options, function(err, resp, body) {
		if (err) {
			throw err;
		}
		$ = cheerio.load(body);
		res.send($("[name=p_r_id]").attr('value'));
	});
});

var port = Number(process.env.PORT || 5000);

app.listen(port);
exports = module.exports = app;