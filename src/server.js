var WebSocketServer = new require('ws');
const https = require('https');
const fs = require('fs');

var clients = {};
var offers = [];

// WebSocket-сервер на порту 8081
const server = https.createServer({
    cert: fs.readFileSync(__dirname + '/cert.pem'),
    key: fs.readFileSync(__dirname + '/key.pem')
}, function (req, res) {
    // fs.readFile(__dirname + '/index.html', function (err, data) {
    //     res.writeHead(200, { 'Content-Type': 'text/html', 'Content-Length': data.length });
    //     res.write(data);
    //     res.end();
    // });

    if (req.url === '/') {
        fs.readFile(__dirname + '/index.html', function(err, data) {
            if (err){
                throw err;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data); 
            res.end();
            return;
        });
    } else if (req.url === '/socket.js') {
        fs.readFile(__dirname + '/public/socket.js', function (err, data) {
            if (err) { throw err; }
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            res.write(data);
            res.end();
            return;
        });
    }
    else if (req.url === '/main.js') {
        fs.readFile(__dirname + '/public/main.js', function (err, data) {
            if (err) { throw err; }
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            res.write(data);
            res.end();
            return;
        });
    }

});

const webSocketServer = new WebSocketServer.Server({ server });

// var webSocketServer = new WebSocketServer.Server({ port: 9000 });

webSocketServer.on('connection', function (ws) {

    var id = Math.random();
    clients[id] = ws;

    ws.on('message', function (response) {

        let message = JSON.parse(response);

        switch (message.type) {
            case "video-offer":
                offers.push({ id, ...message });
                break;

            case "delete-offer":
                offers = offers.filter(value => {
                    return value.id !== message.id;
                });
            default:
                break;
        }

        for (var key in clients) {
            clients[key].send(JSON.stringify({ type: "video-offer", offers }));
        }
    });

    ws.on('close', function () {
        console.log('соединение закрыто ' + id);
        offers = offers.filter(function (value, index, arr) {
            return value.id !== id;
        });

    });

});

server.listen(8000, "10.0.11.47");