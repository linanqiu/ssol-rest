var cheerio = require('cheerio');

var Scraper = function() {};

Scraper.prototype.formatSchedule = function(body) {
  $ = cheerio.load(body);
  var classes = [];
  var rows = $('#Content > table:nth-child(4) tr').each(function(i, elem) {
    if ($(this).find('[bgcolor="#eeeeee"]').length > 0) {
      try {
        var scheduleClass = {};
        $(this).find('td').each(function(j, element) {
          var elementTexts = $(element).html().split('&#xA0;');
          switch (j) {
            case 0:
            scheduleClass['dept'] = elementTexts[0];
            scheduleClass['courseCode'] = elementTexts[1];
            scheduleClass['section'] = elementTexts[3].substring(0, 3);
            scheduleClass['fullName'] = $(element).find('font').text();
            break;
            case 1:
            scheduleClass['grading'] = elementTexts[1].replace(/[^0-9\.]/g, '');
            break;
            case 2:
            scheduleClass['instructorName'] = (elementTexts[0] + " " + elementTexts[1].split('<br>')[0]).trim();
            scheduleClass['instructorEmail'] = $(element).find('a').text();
            break;
            case 3:
            scheduleClass['day'] = elementTexts[0].trim().split(' ');
            break;
            case 4:
            scheduleClass['time'] = elementTexts[0].split('<br>')[0];
            scheduleClass['room'] = elementTexts[0].split('<br>')[1];
            scheduleClass['building'] = elementTexts[1];
            break;
            case 5:
            scheduleClass['startDate'] = elementTexts[0].split('<br>')[0];
            scheduleClass['endDate'] = elementTexts[0].split('<br>')[1];
            break;
            default:
            break;
          }
        });
classes.push(scheduleClass);
} catch (err) {
        // stupid classes that have two time slots. let's just discard the second one.
        console.log(err);
      }
    }
  });
return classes;
}

Scraper.prototype.formatSearchClassResult = function(body, page) {
  $ = cheerio.load(body);

  var returnObject = {};
  var classes = [];

  $('.cls2').each(addClass(true));
  $('.cls0').each(addClass(true));
  $('.cls1').each(addClass(false));

  function addClass(addable) {
    return function(i, elem) {
      var searchClass = {};
      searchClass['addable'] = addable;

      $(this).find('td').each(function(j, element) {
        switch(j) {
          case 0:
          try{
            searchClass['callNumber'] = $(element).find('input').attr('value');
          } catch (err) {
            searchClass['callNumber'] = "";
          }
          break;
          case 1:
          try {
            searchClass['dept'] = $(element).html().toString().split("<br>")[0].split(' ')[0];
            searchClass['courseCode'] = $(element).html().toString().split("<br>")[0].split(' ')[1];
            searchClass['section'] = $(element).html().toString().split("<br>")[0].split(' ')[2].replace('sec:', '');
            searchClass['fullName'] = $(element).find('font').text().trim();
          } catch (err) {
            console.log(err);
          }
          break;
          case 2:
          try {
            searchClass['instructorName'] = $(element).text().trim().replace(/\s{2,}/g, ' ');
          } catch (err) {
            searchClass['instructorName'] = "";
          }
          break;
          case 3:
            searchClass['day'] = $(element).text().trim().split(/\s{1,}/g);
          break;
          case 4:
          try {
            searchClass['time'] = $(element).html().toString().split('<br>')[0];
            var location = $(element).html().toString().split('<br>')[1].trim().split('  ');
            searchClass['building'] = location[0];
            searchClass['room'] = location[1];
          } catch (err) {
            searchClass['time'] = "";
            searchClass['building'] = "";
            searchClass['room'] = "";
          }
          break;
          case 5:
          try { 
            searchClass['startDate'] = $(element).html().toString().split('<br>')[0];
            searchClass['endDate'] = $(element).html().toString().split('<br>')[1];
          } catch (err) {
            searchClass['startDate'] = "";
            searchClass['endDate'] = "";
          }
          break;
          case 6:
          try{
            searchClass['status'] = $(element).text();
          } catch (err) {
            searchClass['status'] = "";
          }
          break;
          default:
          break;
        }
      });

      classes.push(searchClass);
    };
  };

  var nextPage = 0;
  var offset = 0;

  $('.navLink').find('a').each(function(i, elem) {
    if($(elem).text().toLowerCase().indexOf('next') > -1) {
      nextPage = $(elem).attr('href').match(/page\=([0-9]+)/)[1];
      offset = $(elem).attr('href').match(/offs\=([0-9A-z]+)/)[1];
    }
  });

  returnObject['classes'] = classes;
  returnObject['currentPage'] = page;
  returnObject['nextPage'] = nextPage;
  returnObject['offset'] = offset;

  return returnObject;


};

module.exports = new Scraper();