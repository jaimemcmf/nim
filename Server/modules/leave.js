const fs = require('fs');
const crypto = require('crypto');

module.exports = leave = (request, response) => {
    let body = '';
    request
        .on('data', (chunk) => { body += chunk;  })
        .on('end', () => {
            console.log("Entrie");
               try{
                query = JSON.parse(body);
                if(query.nick == 'undefined' || query.password == 'undefined' || query.game == 'undefined'){
                    response.writeHead(400, {'Content-Type': 'application/json'});
                    response.write('{"error": "One of the request fields is undefined"}');
                    response.end();
                    return;
                }else{
                    fs.readFile('db.json', (err, data) => {
                        if(err)  throw err;
                        let json = JSON.parse(data);
                        console.log(json.user);
                        let exists = false;
                        let hash = crypto.createHash('md5').update(query.password).digest('hex');
                        const users = json.user;
                        users.forEach(i => {
                            console.log(i.nick + "  " + i.pass);
                            console.log(i);
                            if(i.nick == query.nick && i.pass == hash){
                                exists = true;
                            } 
                        });
                        if(!exists){ // Caso utilizador não exista ou as credenciais estejam mal
                            response.writeHead(401, {'Content-Type': 'application/json'});
                            response.write('{"error": "User registered with a different password"}');
                            response.end();
                            return;
                        }else{
                            let inGame = false;
                            let games = json.paired;
                            games.forEach(i => {
                                if(i.game == query.game){
                                    inGame = true;
                                    i.win = true;
                                    if(i.turn == query.nick) i.winner = i.next;
                                    else i.winner = i.turn;
                                    console.log("Desistiu");
                                    fs.writeFile("db.json", JSON.stringify(json), (err => {
                                        if(err) throw err;
                                        console.log("data written to file");
                                        }));
                                }
                            });
                            if(!inGame){ // Caso o jogo não exista
                                response.writeHead(401, {'Content-Type': 'application/json'});
                                response.write('{"error": "Not In Game"}');
                                response.end();
                                return;
                            }else{
                                response.writeHead(200, {'Content-Type': 'application/json'});
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