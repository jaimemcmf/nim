
const url = require("url");
const fs = require('fs');

module.exports = update = (request, response) => {
    const parsedUrl = url.parse(request.url,true);    
    const query = parsedUrl.query;
    const nick = query.nick;
    const game = query.game;
    console.log("nick: "+nick);
    console.log("game" + game);
    response.writeHead(200, {'Content-type':'text/event-stream', 'Access-Control-Allow-Origin': '*'});
    send(response, nick, game);
}

function send(res, nick, game){
    let body;
    fs.readFile('db.json', (err, data) => {
        if(err) throw err;
        let json = JSON.parse(data);
        let flag = false;
        let rack, changed, changed2;
        let turn, next, win, winner;
        let pairedGame;
        let index, first;
        let cont = 0;
        json.paired.forEach(i => {
            console.log("Entry => Game: " + i.game + " Turn: " + i.turn + " Next: " + i.next + " Rack "+  i.rack);
            console.log("game " + game + "  nick  " +  nick);
            if(i.game == game && (i.turn == nick || i.next == nick)){
                flag = true;
                rack = i.rack;
                turn = i.turn;
                next = i.next;
                win = i.win;
                winner = i.next;
                changed = i.changed;
                changed2 = i.changed2;
                first = i.first;
                pairedGame = i;
                index = cont;
            }
            cont++;
        });
        console.log("Rack: " + rack + " turn: " + turn + " next: " + next + " changed: " + changed + " changed2: " +  changed2 + "  winner: " + winner);
        if((nick == first && changed2 == 1) || (nick != first && changed == 1) || win){
            if(nick == first){
                pairedGame.changed2 = 0;
                changed2 = 0;
            } else {
                pairedGame.changed = 0;
                changed = 0;
            }
            let colSum = 0;
            rack.forEach(i => {
                colSum += i;
            });
            console.log(win +  "    " + colSum);
            if(win || colSum == 0){
                console.log("AQUI");
                let h1 = false;
                json.classifications.forEach(i => {
                    if(i.hash == game){
                        h1 = true;
                        let p1 = false;
                        let p2 = false;
                        i.ranking.forEach(j => {
                            if(j.nick == winner){
                                j.victories = j.victories + 1;
                                console.log("jgames antes:" + j.games);
                                j.games = j.games + 1;
                                console.log("jgames depois:" + j.games);
                                p1 = true;
                                console.log("entrei p1");
                            }else if(j.nick == turn){
                                j.games = j.games + 1;
                                p2 = true;
                                console.log("entrei p2");
                            }
                        });
                        if(!p1){
                            i['ranking'].push({"nick":winner,"victories":1, "games":1});
                        }
                        if(!p2){
                            i['ranking'].push({"nick":turn,"victories":0, "games":1});
                        }
                    }
                });
                console.log(h1);
                if(!h1){
                    json['classifications'].push({"hash":game, "ranking":[{"nick":winner,"victories":1, "games":1}, {"nick":turn,"victories":0, "games":1}]});
                }
                delete json.paired[index];
                json.paired.splice(index, 1);
                if(changed == 0 && changed2 == 0){
                    fs.writeFile("db.json", JSON.stringify(json), (err => {
                        if(err) throw err;
                        console.log("data written to file");
                    }));
                }
                body = {winner:winner};
                res.write("data: " + JSON.stringify(body) + "\n\n");
                res.end();
                return;
            } else {
                fs.writeFile("db.json", JSON.stringify(json), (err => {
                    if(err) throw err;
                    console.log("data written to file");
                }));
                body = {turn:turn, rack:rack};
                res.write("data: " + JSON.stringify(body) + "\n\n");
                setTimeout(() => send(res, nick, game), 2000);
            }
        }else{
            setTimeout(() => send(res, nick, game), 2000);
        }
    })
}