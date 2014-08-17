var cheerio = require('cheerio');

var Scraper = function() {};

Scraper.prototype.formatSchedule = function formatSchedule(body) {
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

module.exports = new Scraper();