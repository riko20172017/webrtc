const express = require('express');
const app = new express();

app.get('/', function(request, response){
    response.sendFile(__dirname + "/index.html");
});

app.use(express.static(__dirname + '/public'));

app.listen(8000);