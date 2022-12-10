const url = require("url");

module.exports = update = (request, response) => {
    const parsedUrl = url.parse(request.url,true);    
    const query = parsedUrl.query;
    const nick = query.nick;
    const game = query.game;
    console.log(nick);
    console.log(game);
    response.writeHead(200, {
        'Content-Type' : 'text/event-stream',
        'Cache-Control' : 'no-cache',
        'Connection' : 'keep-alive'
        });
        var sseId = (new Date()).toLocaleTimeString();
       
        setInterval(function() {
        writeServerSendEvent(response, sseId, (new Date()).toLocaleTimeString());
        }, sendInterval);
       
        writeServerSendEvent(response, sseId, (new Date()).toLocaleTimeString());
}

function writeServerSendEvent(response, sseId, data) {
    response.write('id: ' + sseId + '\n');
    response.write("data: new server event " + data + '\n\n');
}

var sendInterval = 5000;