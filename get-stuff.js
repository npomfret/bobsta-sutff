#!/usr/bin/env node

var http = require('http');
var zlib = require("zlib");

function makeRequest(method, body, host, path, port, headers = {}, cb) {
    let postData;
    if (method === "POST") {
        postData = JSON.stringify(body);
    }
    if (method === "POST") {
        headers["Content-Length"] = Buffer.byteLength(postData);
    }

    var buffer = [];

    var request = http.request({
        host: host,
        path: path,
        port: port,
        method: method,
        headers: headers
    }, function (response) {
        let encoding = response.headers["content-encoding"];
        if (encoding === "gzip") {
            let gunzip = zlib.createGunzip();
            response.pipe(gunzip);

            gunzip.on('data', function (data) {
                buffer.push(data.toString())
            }).on("end", function () {
                cb(buffer.join(""));
            }).on("error", function (e) {
                console.error(e);
            })
        } else {
            let reply = '';
            response.on('data', function (chunk) {
                reply += chunk;
            });

            response.on('end', function () {
                return cb(reply);
            });
        }
    });

    if (method === "POST") {
        request.write(postData);
    }
    request.end();
}

function getRawData() {
    const sessionID = "Ji9g8gqkewM2131Z791667Z9iayowaE";

    const body = {
        "command": "getdatapointvalue",
        "data": {"sessionID": sessionID, "uid": "all"}
    };

    const headers = {
        "Cookie": `Intesis-Webserver={%22sessionID%22:%22${sessionID}%22}'`,
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    return new Promise((resolve, reject) => {
        makeRequest('POST', body, 'home.uph.am', '/api.cgi', 4444, headers, (text) => {
            resolve(JSON.parse(text))
        });
    });
}

function getMetaData() {
    return new Promise((resolve, reject) => {
        makeRequest('GET', undefined, 'home.uph.am', '/js/data/data.json', 4444, undefined, (text) => {
            resolve(JSON.parse(text));
        });
    })
}

async function go() {
    const metaData = await getMetaData();
    const signals = metaData.signals.uid;

    const rawData = await getRawData();
    for (let item of rawData.data.dpval) {
        // enrich the data here
        const meta = signals[item.uid.toString()];
        const name = meta ? meta[0] : "unknown";
        item.name = name;
        console.log(JSON.stringify(item, null, 2));
    }
}

go();