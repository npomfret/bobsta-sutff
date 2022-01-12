#!/usr/bin/env node

// only use standard stuff so we don't need npm
const http = require('http');
const zlib = require("zlib");

const HOST = 'home.uph.am';
const PORT = 4444;

function makeRequest(method, body, host, path, port, headers = {}, cb) {
    return new Promise((resolve, reject) => {
        let postData;
        if (method === "POST") {
            postData = JSON.stringify(body);
        }
        if (method === "POST") {
            headers["Content-Length"] = Buffer.byteLength(postData);
        }

        let buffer = [];

        let request = http.request({
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
                    resolve(buffer.join(""));
                }).on("error", function (e) {
                    console.error(e);// todo: reject
                });
            } else {
                let reply = '';
                response.on('data', function (chunk) {
                    reply += chunk;
                });

                response.on('end', function () {
                    return resolve(reply);
                });

                // todo: reject errors
            }
        });

        if (method === "POST") {
            request.write(postData);
        }

        request.end();
    });
}

async function getRawData(sessionId) {
    const body = {
        "command": "getdatapointvalue",
        "data": {"sessionID": sessionId, "uid": "all"}
    };

    const headers = {
        "Cookie": `Intesis-Webserver={%22sessionID%22:%22${sessionId}%22}'`,
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    const text = await makeRequest('POST', body, HOST, '/api.cgi', PORT, headers);
    return JSON.parse(text);
}

async function getMetaData() {
    const text = await makeRequest('GET', undefined, HOST, '/js/data/data.json', PORT, undefined)
    return JSON.parse(text);
}

async function login() {
    const body = {"command": "login", "data": {"username": "admin", "password": "Bobsta"}};
    const text = await makeRequest('POST', body, HOST, '/api.cgi', PORT, {});
    return JSON.parse(text);
}

async function go() {
    const response = await login();
    const sessionId = response.data.id.sessionID;

    const metaData = await getMetaData();
    const signals = metaData.signals.uid;

    const rawData = await getRawData(sessionId);
    for (let item of rawData.data.dpval) {
        // enrich the data here
        const meta = signals[item.uid.toString()];
        item.name = meta ? meta[0] : "unknown";
        console.log(JSON.stringify(item));
    }
}

go();