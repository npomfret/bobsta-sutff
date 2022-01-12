#!/usr/bin/env node

var http = require('http');

function makeRequest(method, body, host, path, port, headers = {}, cb) {
    let postData;
    if (method === "POST") {
        postData = JSON.stringify(body);
    }
    if (method === "POST") {
        headers["Content-Length"] = Buffer.byteLength(postData);
    }
    var request = http.request({
        host: host,
        path: path,
        port: port,
        method: method,
        headers: headers
    }, function (response) {
        var reply = '';
        response.on('data', function (chunk) {
            reply += chunk;
        });

        response.on('end', function () {
            return cb(reply);
        });
    });

    if (method === "POST") {
        request.write(postData);
    }
    request.end();
}

function getStuff(cb) {
    const body = {
        "command": "getdatapointvalue",
        "data": {"sessionID": "Ji9g8gqkewM2131Z791667Z9iayowaE", "uid": "all"}
    };

    const headers = {
        "Cookie": "Intesis-Webserver={%22sessionID%22:%22Ji9g8gqkewM2131Z791667Z9iayowaE%22}'",
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    makeRequest('POST', body, 'home.uph.am', '/api.cgi', 4444, headers, cb);
}

getStuff(text => {
    const data = JSON.parse(text);
    // todo: get stuff from the data here

    console.log(JSON.stringify(data, null, 2));
});