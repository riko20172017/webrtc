var WebSocketServer = new require('ws');

// подключённые клиенты
var clients = {};
var offers = [];

// WebSocket-сервер на порту 8081
var webSocketServer = new WebSocketServer.Server({
    port: 9000
});
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