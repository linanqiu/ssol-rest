ssol-rest
=========

REST API wrapper for SSOL

Test it out at [http://immense-anchorage-9037.herokuapp.com](http://immense-anchorage-9037.herokuapp.com/)

## Quick Start

Get yourself a `sessionToken` first by sending a `POST` request to

```shell
localhost:5000/auth/login
```

with the parameters

```js
{
    username: YOURUNI,
    password: YOURPASSWORD
}
```

It should return something like this

```js
{"sessionToken":"rAnDoMtOkEn"}
```

Then use the one of the method we have so far

```shell
localhost:5000academic/schedule?sessionToken=rAnDoMtOkEn
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
}]
```

## Methods

### Auth

#### POST auth/login

Parameters:

- `username`: User's UNI
- `password`: User's password

Output:

- `sessionToken`: User's session token

### Academic

#### GET academic/schedule

Parameters:

- `sessionToken`: User's session token obtained from login

Output:

- Array of classes

#### GET academic/search_class

Parameters:

- `sessionToken`: User's session token obtained from login
- `keyword`: Search keyword
- `term`: The term to search in. 2014 Fall will be `20143`, 2014 Spring will be `20141` and so on.
- `page` (optional): Which page to start on. Must be used simultaneously with `offset`
- `offset`: some stupid number to keep CUIT's linked list in check.

Output:

- Array of classes
- `currentPage`: current page
- `nextPage`: the number to put in the next REST request for the next page of results. If this is 0, this means there's no next page.
- `offset`: the number to put in the next REST request as well. Just chuck it in. If 0, no next page.

## Disclaimer

I really need to authenticate using HTTPS. I whacked this out in an afternoon. Don't blame me. I'm getting sleepy. Goodnight.
