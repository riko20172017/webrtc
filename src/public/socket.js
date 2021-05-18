let socket = new WebSocket("ws://localhost:9000/");
let offerId;
socket.onopen = function (e) {
    console.log("[open] Соединение установлено");
    //   socket.send("Меня зовут Джон");
};

socket.onmessage = function (event) {
    const message = JSON.parse(event.data);
    console.log(message);

    switch (message.type) {
        case "video-offer":
            let list = document.getElementById("offer-list");
            list.innerHTML = "";

            message.offers.forEach((i) => {
                let el = document.createElement('li');

                el.innerHTML = offerId = i.id;
                list.appendChild(el);
            })

            break;
        default:
            break;
    }
};

socket.onclose = function (event) {
    if (event.wasClean) {
        console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
    } else {
        // например, сервер убил процесс или сеть недоступна
        // обычно в этом случае event.code 1006
        console.log('[close] Соединение прервано');
    }
};

socket.onerror = function (error) {
    console.log(`[error] ${error.message}`);
};