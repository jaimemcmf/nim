const fs = require('fs');
const crypto = require('crypto');
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Content-Type': "application/json"
}

module.exports = leave = (request, response) => {
    let body = '';
    request
        .on('data', (chunk) => { body += chunk;  })
        .on('end', () => {
            console.log("Entrie");
            console.log(JSON.parse(body));
               try{
                query = JSON.parse(body);
                console.log(query);
                console.log("SERVER PASS" + typeof query.password)
                let passvar = query.password;
                let nickvar = query.nick;
                let gamevar = query.game;
                if(query.nick == 'undefined' || query.password == 'undefined' || query.game == 'undefined' || typeof query.password != typeof "string"){
                    response.writeHead(400, headers);
                    response.write('{"error": "One of the request fields is undefined"}');
                    response.end();
                    return;
                }else{
                    fs.readFile('db.json', (err, data) => {
                        if(err)  throw err;
                        let json = JSON.parse(data);
                        console.log(json.user);
                        let exists = false;
                        const hash = crypto.createHash('md5').update(passvar).digest('hex');
                        console.log("HASH   " + hash);
                        const users = json.user;
                        users.forEach(i => {
                            console.log(i.nick + "  " + i.password);
                            console.log(i);
                            if(i.nick == nickvar && i.password == hash){
                                exists = true;
                            } 
                        });
                        if(!exists){ // Caso utilizador não exista ou as credenciais estejam mal
                            response.writeHead(401, headers);
                            response.write('{"error": "User registered with a different password"}');
                            response.end();
                            return;
                        }else{
                            let inGame = false;
                            let games = json.paired;
                            games.forEach(i => {
                                if(i.game == gamevar){
                                    inGame = true;
                                    i.win = true;
                                    if(i.turn != nickvar){
                                        let temp = i.turn;
                                        i.turn = i.next;
                                        i.next = temp;
                                    }
                                    i.changed = 1;
                                    i.changed2 = 1;
                                    console.log("Desistiu");
                                    fs.writeFile("db.json", JSON.stringify(json), (err => {
                                        if(err) throw err;
                                        console.log("data written to file");
                                        }));
                                }
                            });
                            if(!inGame){ // Caso o jogo não exista
                                response.writeHead(401, headers);
                                response.write('{"error": "Not In Game"}');
                                response.end();
                                return;
                            }else{
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