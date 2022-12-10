
const url = require("url");
const fs = require('fs');

module.exports = update = (request, response) => {
    const parsedUrl = url.parse(request.url,true);    
    const query = parsedUrl.query;
    const nick = query.nick;
    const game = query.game;
    console.log("nick: "+nick);
    console.log("game" + game);
    let flag = false;
    let rack;
    let turn, next, win, winner, pieces;
    fs.readFile('db.json', (err, data) => {
        if(err) throw err;
        let json = JSON.parse(data);
        json.paired.forEach(i => {
            console.log("Entry => Game: " + i.game + " Turn: " + i.turn + " Next: " + i.next + " Rack "+  i.rack);
            if(i.game == game && (i.turn == nick || i.next == nick)){
                flag = true;
                rack = i.rack;
                turn = i.turn;
                next = i.next;
                win = i.win;
                winner = i.winner;
                pieces = i.pieces;
            }
        });
        console.log("Rack: " + rack + " turn: " + turn + " next: " + next);
        response.writeHead(200, {'Content-type':'text/event-stream', 'Access-Control-Allow-Origin': '*'});
        let body = {rack:rack, turn:turn, next:next, win:win, winner:winner, pieces:pieces};
        send(response, JSON.stringify(body));
        
    })
}

function send(res, data){
    res.write("data: " + data + "\n\n");
    setTimeout(() => send(res, data), 5000)
}