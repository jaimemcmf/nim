const fs = require('fs');
const crypto = require('crypto');
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Content-Type': "application/json"
}
module.exports = notify = (request, response) => {
    let body = "";
    console.log(request);
    request
    .on('data', (chunk) => { body += chunk;  })
    .on('end', () => {
        console.log("BODY2" + body);
        try {
            query = JSON.parse(body);
            console.log("NOTIFY  " + query);
            let nickvar = query.nick;
            let passvar = query.password;
            let gamevar = query.game;
            let stackvar = query.stack;
            let piecesvar = query.pieces;
            if(query.nick == 'undefined' || query.password == 'undefined' || query.game == 'undefined' || query.stack =='undefined' || query.pieces == 'undefined'){
                response.writeHead(400, headers);
                response.write('{"error": "One of the request fields is undefined"}');
                response.end();
                return;
            }else{
                fs.readFile('db.json', (err, data) => {
                    if(err)  throw err;
                    let json = JSON.parse(data);
                    let exists = false;
                    let hash = crypto.createHash('md5').update(passvar).digest('hex');
                    const users = json.user;
                    users.forEach(i => {
                        if(i.nick == nickvar && i.password == hash) exists = true;
                    });
                    if(!exists){
                        response.writeHead(401, headers);
                        response.write('{"error": "User registered with a different password"}');
                        response.end();
                        return;
                    }else{
                        let valid = false;
                        let flag = false;
                        let games = json.paired;
                        games.forEach(i => {
                            if(i.game == gamevar && i.turn == nickvar){
                                valid = true;
                                if(stackvar < 0 || stackvar >= i.size || piecesvar >= i.rack[stackvar] || piecesvar < 0){
                                    response.writeHead(401, headers);
                                    response.write('{ "error": "invalid number of pieces" }');
                                    response.end();
                                    flag = true;
                                    return;
                                }else{
                                    let temp = i.turn;
                                    i.turn = i.next;
                                    i.next = temp;
                                    i.rack[stackvar] = piecesvar;
                                    i.changed = 1;
                                    i.changed2 = 1;
                                    fs.writeFile("db.json", JSON.stringify(json), (err => {
                                        if(err) throw err;
                                        console.log("data written to file");
                                    }));
                                }
                            }
                        });
                        if(!valid && !flag){
                            response.writeHead(401, headers);
                            response.write('{"error": "played in wrong turn or not a paired game"}');
                            response.end();
                            return;
                        }else if(valid && !flag){
                            response.writeHead(200, headers);
                            response.write('{}');
                            response.end();
                            return;
                        }
                    }
                });
            }
        }catch(err) {console.log}
    })
    .on('error', (err) => { console.log(err.message); });
}