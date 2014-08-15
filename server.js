var express = require('express');
var fs = require('fs');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');
var https = require('https');
var tough = require('tough-cookie');
https.globalAgent.options.secureProtocol = 'SSLv3_method';

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var host = 'https://ssol.columbia.edu';

var jarTemplate = {
	"_jar": {
		"store": {
			"idx": {
				"ssol.columbia.edu": {
					"/cgi-bin/ssol/LOGIN_URL": {
						"test": {
							"key": "test",
							"value": "on",
							"path": "/cgi-bin/ssol/LOGIN_URL",
							"secure": true,
							"creation": "DATE",
							"hostOnly": true,
							"domain": "ssol.columbia.edu",
							"lastAccessed": "DATE"
						}
					}
				}
			}
		}
	}
};

// gets the loginToken
app.get('/auth/login', function(req, res) {
	var request = require('request');
	var j = request.jar();

	var getSessionToken = function(err, resp, body) {
		if (err) {
			throw err;
		}
		$ = cheerio.load(body);

		var creation;
		var sessionToken;

		for(path in j['_jar']['store']['idx']['ssol.columbia.edu']) {
			creation = j['_jar']['store']['idx']['ssol.columbia.edu'][path]['test']['creation'];
			sessionToken = path.replace('\/cgi-bin\/ssol\/', '');
		}

		sessionObject = {
			sessionToken: sessionToken,
			creation: creation,
		};

		var cookieTemp = JSON.parse(JSON.stringify(jarTemplate['_jar']['store']['idx']));
		var pathTemp = '/cgi-bin/ssol/' + sessionObject['sessionToken'];
		cookieTemp['ssol.columbia.edu'][pathTemp] = cookieTemp['ssol.columbia.edu']['/cgi-bin/ssol/LOGIN_URL'];
		delete cookieTemp['ssol.columbia.edu']['/cgi-bin/ssol/LOGIN_URL'];
		cookieTemp['ssol.columbia.edu'][pathTemp]['test']['path'] = pathTemp;
		cookieTemp['ssol.columbia.edu'][pathTemp]['test']['creation'] = sessionObject['creation'];
		cookieTemp['ssol.columbia.edu'][pathTemp]['test']['lastAccessed'] = sessionObject['creation'];

		j = {
			"_jar": {
				"store": {
					"idx": cookieTemp
				}
			}
		};

		var formData = {
			p_r_id: sessionObject['sessionToken'],
			p_t_id: 1,
			jsen: 'Y',
			'tran[1]_tran_name': "slin",
			u_id: req.param('username'),
			u_pw: req.param('password'),
			submit: "Continue",
			reset: "Clear"
		};

		request.post(host + "/cgi-bin/ssol/" + sessionObject['sessionToken'], {form: formData}, function(err, resp, body) {
			if (err) {
				throw err;
			}
			res.status(200).send({
				sessionToken: sessionObject['sessionToken']
			});
		});
	}

	request({url: host, jar: j}, getSessionToken);
});

// gets schedule
app.get('/academic/schedule', function(req, res) {
	var request = require('request');
	var j = request.jar();

	var cookieTemp = JSON.parse(JSON.stringify(jarTemplate['_jar']['store']['idx']));
	var pathTemp = '/cgi-bin/ssol/' + req.param('sessionToken');
	cookieTemp['ssol.columbia.edu'][pathTemp] = cookieTemp['ssol.columbia.edu']['/cgi-bin/ssol/LOGIN_URL'];
	delete cookieTemp['ssol.columbia.edu']['/cgi-bin/ssol/LOGIN_URL'];
	cookieTemp['ssol.columbia.edu'][pathTemp]['test']['path'] = pathTemp;
	cookieTemp['ssol.columbia.edu'][pathTemp]['test']['creation'] = req.param('creation');
	cookieTemp['ssol.columbia.edu'][pathTemp]['test']['lastAccessed'] = req.param('creation');

	j = {
		"_jar": {
			"store": {
				"idx": cookieTemp
			}
		}
	};

	request({url: host + "/cgi-bin/ssol/" + req.param('sessionToken') + '?p%.5Fr%.5Fid=RUBBISH&p%.5Ft%.5Fid=1&tran%.5B1%.5D%.5Fentry=student&tran%.5B1%.5D%.5Ftran%.5Fname=ssch', jar: j}, function(err, resp, body) {
		if (err) {
			throw err;
		}
		res.status(200).send(body);
	});
});

var port = Number(process.env.PORT || 5000);

app.listen(port);
exports = module.exports = app;