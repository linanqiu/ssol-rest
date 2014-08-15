ssol-rest
=========

REST API wrapper for SSOL

Test it out at [http://immense-anchorage-9037.herokuapp.com](http://immense-anchorage-9037.herokuapp.com/)

## Quick Start

Get yourself a `sessionToken` first

```shell
http://immense-anchorage-9037.herokuapp.com/auth/login?username=YOURUNI&password=PASSWORD
```

It should return something like this

```js
{"sessionToken":"rAnDoMtOkEn"}
```

Then use the only method we have so far

```shell
http://immense-anchorage-9037.herokuapp.com/academic/schedule?sessionToken=rAnDoMtOkEn
```

which should return you a list of courses you're currently taking for the term

```js
[{
    "dept": " COMS",
    "courseCode": "W3261",
    "section": "001",
    "fullName": "COMPUTER SCIENCE THEORY",
    "grading": "3.00",
    "instructorName": "Alfred Aho",
    "instructorEmail": "ava2@columbia.edu",
    "day": ["Mo", "We"],
    "time": "1:10pm-2:25pm",
    "room": "833",
    "building": "MUDD",
    "startDate": "09/02/14",
    "endDate": "12/08/14"
}, {
    "dept": " COMS",
    "courseCode": "W4111",
    "section": "001",
    "fullName": "INTRODUCTION TO DATABASES",
    "grading": "3.00",
    "instructorName": "Alexandros Biliris",
    "instructorEmail": "ab2264@columbia.edu",
    "day": ["Tu"],
    "time": "1:10pm-3:40pm",
    "room": "RTBA",
    "building": "",
    "startDate": "09/02/14",
    "endDate": "12/08/14"
}, {
    "dept": " COMS",
    "courseCode": "W4261",
    "section": "001",
    "fullName": "INTRO TO CRYPTOGRAPHY",
    "grading": "3.00",
    "instructorName": "Tal Malkin",
    "instructorEmail": "tm2118@columbia.edu",
    "day": ["Tu", "Th"],
    "time": "11:40am-12:55pm",
    "room": "633",
    "building": "MUDD",
    "startDate": "09/02/14",
    "endDate": "12/08/14"
}, {
    "dept": " COMS",
    "courseCode": "W4705",
    "section": "001",
    "fullName": "NATURAL LANGUAGE PROCESSI",
    "grading": "3.00",
    "instructorName": "Michael Collins",
    "instructorEmail": "mc3354@columbia.edu",
    "day": ["Tu", "Th"],
    "time": "4:10pm-5:25pm",
    "room": "RTBA",
    "building": "",
    "startDate": "09/02/14",
    "endDate": "12/08/14"
}, {
    "dept": " CSEE",
    "courseCode": "W3827",
    "section": "001",
    "fullName": "FUNDAMENTALS OF COMPUTER",
    "grading": "3.00",
    "instructorName": "Martha Kim",
    "instructorEmail": "mak2191@columbia.edu",
    "day": ["Tu", "Th"],
    "time": "10:10am-11:25am",
    "room": "501",
    "building": "SCHERMERHORN",
    "startDate": "09/02/14",
    "endDate": "12/08/14"
}, {
    "dept": " ECON",
    "courseCode": "W4911",
    "section": "000",
    "fullName": "SEMINAR-MICROECONOMIC THE",
    "grading": "0.00",
    "instructorName": "Susan Elmes",
    "instructorEmail": "se5@columbia.edu",
    "day": [""],
    "time": "",
    "room": "",
    "building": "",
    "startDate": "09/01/14",
    "endDate": "12/30/14"
}, {
    "dept": " HUMA",
    "courseCode": "W1121",
    "section": "003",
    "fullName": "MASTERPIECES OF WESTERN A",
    "grading": "3.00",
    "instructorName": "Lindsay Cook",
    "instructorEmail": "lsc2140@columbia.edu",
    "day": ["Mo", "We"],
    "time": "8:40am-9:55am",
    "room": "608",
    "building": "SCHERMERHORN",
    "startDate": "09/02/14",
    "endDate": "12/08/14"
}, {
    "dept": " PHED",
    "courseCode": "C1001",
    "section": "047",
    "fullName": "PHYSICAL ED: INTRO TO FIT",
    "grading": "1.00",
    "instructorName": "",
    "instructorEmail": "",
    "day": ["Tu", "Th"],
    "time": "12:00pm-12:50pm",
    "room": "RTBA",
    "building": "",
    "startDate": "09/02/14",
    "endDate": "12/08/14"
}, {
    "dept": " QMSS",
    "courseCode": "G4063",
    "section": "001",
    "fullName": "DATA VISUALIZATION",
    "grading": "4.00",
    "instructorName": "",
    "instructorEmail": "",
    "day": ["Th"],
    "time": "6:10pm-8:00pm",
    "room": "516",
    "building": "HAMILTON",
    "startDate": "09/02/14",
    "endDate": "12/08/14"
}]
```
