var https = require('https');
// https.globalAgent.options.secureProtocol = 'SSLv3_method';

// the scraper that does the dirty work ie. convert the pages into JSON
var scraper = require('./scraper.js');

var Logic = function() {};

// roar lion roar
var host = 'https://ssol.columbia.edu';

/**
 * @api {get} /auth/login Authenticates and exchanges for sessionToken
 * @apiName login
 * @apiGroup auth
 *
 * @apiParam {String} username User's UNI
 * @apiParam {String} password User's password
 *
 * @apiSuccess {String} sessionToken Token for the session.
 */
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

/**
 * @api {get} /academic/schedule Authenticates and exchanges for sessionToken
 * @apiName schedule
 * @apiGroup academic
 *
 * @apiParam {String} sessionToken User's session token
 *
 * @apiSuccess {Object} classes user's classes
 */
Logic.prototype.academicSchedule = function(req, res) {
  var request = require('request');
  var j = request.jar();
  var cookiespoof = require('./cookiespoof.js');
  j = cookiespoof.spoof(req.param('sessionToken'), req.param('creation'));

  var queryString = {
    p_r_id: 'RUBBISH',
    p_t_id: '1',
    'tran[1]_entry': 'student',
    'tran[1]_tran_name': 'ssch'
  };

  request({
    url: host + "/cgi-bin/ssol/" + req.param('sessionToken'),
    jar: j,
    qs: queryString
  }, function(err, resp, body) {
    if (err) {
      throw err;
    }
    var message = scraper.formatSchedule(body);
    res.status(200).send(message);
  });
};

/**
 * @api {get} /academic/search_class Authenticates and exchanges for sessionToken
 * @apiName search_class
 * @apiGroup academic
 *
 * @apiParam {String} sessionToken User's session token
 * @apiParam {String} keyword Search keyword
 * @apiParam {String} term Term within which to search. yyyyt, eg. 20143 for 2014 fall. 20141 for 2014 spring.
 * @apiParam {String} page page to start searching. Defaults to 0.
 * @apiParam {String} offset for paginating. seriously stupid system.
 *
 * @apiSuccess {Object} searchClasses classes matching keyword
 */
Logic.prototype.academicSearchClass = function(req, res) {
  var request = require('request');
  var j = request.jar();
  var cookiespoof = require('./cookiespoof.js');
  j = cookiespoof.spoof(req.param('sessionToken'), req.param('creation'));

  var pageNumber = parseInt(req.param('page'));
  pageNumber = typeof pageNumber === 'number' ? pageNumber : 0;

  var searchClass = function() {
    var queryString = {
      p_r_id: 'RSWfBeAx9UHLPe9Zzgv8OR',
      p_t_id: '1',
      'tran[1]_entry': 'student',
      'tran[1]_page': pageNumber.toString(),
      'tran[1]_offs': req.param('offset'),
      'tran[1]_tran_name': 'sregs',
      'tran[1]_ss': req.param('keyword'),
      'tran[1]_act': 'Search Class'
    };

    request({
      url: host + "/cgi-bin/ssol/" + req.param('sessionToken'),
      jar: j,
      qs: queryString
    }, function(err, resp, body) {
      if (err) {
        throw err;
      }
      var message = scraper.formatSearchClassResult(body, pageNumber);
      res.status(200).send(message);
    });
  };

  var selectTerm = function(term, termLiteral) {
    var queryString = {
      p_r_id: 'RUBBISH',
      p_t_id: '1',
      'tran[1]_entry': 'student',
      'tran[1]_tran_name': 'sregb',
      'tran[1]_term_id': term,
      'tran[1]_act': 'Continue with ' + termLiteral + '  Registration'
    }

    request({
      url: host + "/cgi-bin/ssol/" + req.param('sessionToken'),
      jar: j,
      qs: queryString
    }, searchClass);
  }

  selectTerm(req.param('term'), req.param('termLiteral'));
}

module.exports = new Logic();
