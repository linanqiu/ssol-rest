// create a cookie jar from the cookie jar template
var jarTemplate =  {
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

var CookieSpoof = function() {};

CookieSpoof.prototype.spoof = function spoof(sessionToken, creation) {
  var cookieTemp = JSON.parse(JSON.stringify(jarTemplate['_jar']['store']['idx']));
  var pathTemp = '/cgi-bin/ssol/' + sessionToken;
  cookieTemp['ssol.columbia.edu'][pathTemp] = cookieTemp['ssol.columbia.edu']['/cgi-bin/ssol/LOGIN_URL'];
  delete cookieTemp['ssol.columbia.edu']['/cgi-bin/ssol/LOGIN_URL'];
  cookieTemp['ssol.columbia.edu'][pathTemp]['test']['path'] = pathTemp;
  cookieTemp['ssol.columbia.edu'][pathTemp]['test']['creation'] = creation;
  cookieTemp['ssol.columbia.edu'][pathTemp]['test']['lastAccessed'] = creation;
  j = {
    "_jar": {
      "store": {
        "idx": cookieTemp
      }
    }
  };

  return j;
}

module.exports = new CookieSpoof();