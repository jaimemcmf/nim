const fs = require('fs');
const crypto = require('crypto');
module.exports = notify = (request, response) => {
    let body = "";
    request
    .on('data', (chunk) => { body += chunk;  })
    .on('end', () => {
        try {
            query = JSON.parse(body);
            if(query.nick == 'undefined' || query.password == 'undefined' || query.game == 'undefined' || query.stack =='undefined' || query.pieces == 'undefined'){
                response.writeHead(400, {'Content-Type': 'application/json'});
                response.write('{"error": "One of the request fields is undefined"}');
                response.end();
                return;
            }else{
                fs.readFile('db.json', (err, data) => {
                    if(err)  throw err;
                    let json = JSON.parse(data);
                    let exists = false;
                    let hash = crypto.createHash('md5').update(query.password).digest('hex');
                    const users = json.user;
                    users.forEach(i => {
                        if(i.nick == query.nick && i.password == hash) exists = true;
                    });
                    if(!exists){
                        response.writeHead(401, {'Content-Type': 'application/json'});
                        response.write('{"error": "User registered with a different password"}');
                        response.end();
                        return;
                    }else{
                        let valid = false;
                        let flag = false;
                        let games = json.paired;
                        games.forEach(i => {
                            if(i.game == query.game && i.turn == query.nick){
                                valid = true;
                                if(query.stack < 0 || query.stack >= i.size || query.pieces >= i.rack[query.stack] || query.pieces < 0){
                                    response.writeHead(401, {'Content-Type': 'application/json'});
                                    response.write('{ "error": "invalid number of pieces" }');
                                    response.end();
                                    flag = true;
                                    return;
                                }else{
                                    let temp = i.turn;
                                    i.turn = i.next;
                                    i.next = temp;
                                    i.rack[query.stack] = query.pieces;
                                    i.pieces = query.pieces;
                                    i.stack = query.stack;
                                    i.changed = 1;
                                    fs.writeFile("db.json", JSON.stringify(json), (err => {
                                        if(err) throw err;
                                        console.log("data written to file");
                                    }));
                                }
                            }
                        });
                        if(!valid && !flag){
                            response.writeHead(401, {'Content-Type': 'application/json'});
                            response.write('{"error": "played in wrong turn or not a paired game"}');
                            response.end();
                            return;
                        }else if(valid && !flag){
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