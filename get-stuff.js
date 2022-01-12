#!/usr/bin/env node

var http = require('http');

async function getStuff(cb) {

    const postData = JSON.stringify({"command":"getdatapointvalue","data":{"sessionID":"i0Y2I0E8ddcWP78F3nwrpn5svt96xG8","uid":"all"}});

    var request = http.request({
        host: 'home.uph.am',
        path: '/api.cgi',
        port: 4444,
        method: 'POST',
        headers: {
            "Cookie": "Intesis-Webserver={%22sessionID%22:%22i0Y2I0E8ddcWP78F3nwrpn5svt96xG8%22}'",
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    }, function (response) {
        var reply = '';
        response.on('data', function (chunk) {
            reply += chunk;
        });

        response.on('end', function () {
            return cb(reply);
        });
    });

    request.write(postData);
    request.end();
}

getStuff(text => {
    const data = JSON.parse(text);
    // todo: get stuff from the data here

    console.log(JSON.stringify(data, null, 2));
});