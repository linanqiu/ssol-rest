var https = require('https');
https.globalAgent.options.secureProtocol = 'SSLv3_method';

// the scraper that does the dirty work ie. convert the pages into JSON
var scraper = require('./scraper.js');

var Logic = function() {};

// roar lion roar
var host = 'https://ssol.columbia.edu';

Logic.prototype.authLogin = function(req, res) {
  var request = require('request');
  var j = request.jar();
  
  var getSessionToken = function(err, resp, body) {
    if (err) {
      throw err;
    }
    var creation;
    var sessionToken;
    for (path in j['_jar']['store']['idx']['ssol.columbia.edu']) {
      creation = j['_jar']['store']['idx']['ssol.columbia.edu'][path]['test']['creation'];
      sessionToken = path.replace('\/cgi-bin\/ssol\/', '');
    }
    sessionObject = {
      sessionToken: sessionToken,
      creation: creation,
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
    request.post(host + "/cgi-bin/ssol/" + sessionObject['sessionToken'], {
      form: formData
    }, function(err, resp, body) {
      if (err) {
        throw err;
      }
      res.status(200).send({
        sessionToken: sessionObject['sessionToken']
      });
    });
  }

  request({
    url: host,
    jar: j
  }, getSessionToken);
};

Logic.prototype.academicSchedule = function(req, res) {
  var request = require('request');
  var j = request.jar();
  var cookiespoof = require('./cookiespoof.js');
  j = cookiespoof.spoof(req.param('sessionToken'), req.param('creation'));

  request({
    url: host + "/cgi-bin/ssol/" + req.param('sessionToken') + '?p%.5Fr%.5Fid=RUBBISH&p%.5Ft%.5Fid=1&tran%.5B1%.5D%.5Fentry=student&tran%.5B1%.5D%.5Ftran%.5Fname=ssch',
    jar: j
  }, function(err, resp, body) {
    if (err) {
      throw err;
    }
    var message = scraper.formatSchedule(body);
    res.status(200).send(message);
  });
};

module.exports = new Logic();