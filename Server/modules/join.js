const crypto = require ("crypto")
const fs = require ("fs");

module.exports = ranking = (request, response) => {
    let body = "";
    request
        .on('data', (chunk) => { body += chunk;  })
        .on('end', () => {
            try {
                query = JSON.parse(body);
                if( query.group == 'undefined' || query.nick == 'undefined' || query.password == 'undefined' || query.size == 'undefined') {
                    response.writeHead(400, {'Content-Type': 'application/json'});
                    response.write('{"error": "One of the request fields is undefined"}');
                    response.end();
                    return;
               }else if(typeof query.group != 'number' || typeof query.nick != 'string' || typeof query.password != 'string' || typeof query.size != 'number'){
                    response.writeHead(400, {'Content-Type': 'application/json'});
                    response.write('{"error": "One of the reqquest fields is invalid"}');
                    response.end();
                    return;
                }else{
                    const hash = crypto.createHash('md5').update(query.group + '_' + query.size).digest('hex');
                    console.log(hash);
                    fs.readFile("db.json", (err, data) => {
                        let exists = false;
                        if(err) throw err;
                        let json = JSON.parse(data);
                        json.joining.forEach(i => {
                            if(i.game == hash){
                                exists = true;
                                response.writeHead(200, {'Content-Type': 'application/json'});
                                response.write('{"game": ' + hash + '}');
                                response.end();
                                return;
                            }
                        });
                        if(!exists){
                            json["joining"].push({"game":hash,"first":{"nick":query.nick, "size":query.size}});
                            fs.writeFile("db.json", JSON.stringify(json), (err => {
                            if(err) throw err;
                            console.log("data written to file");
                            }));
                            response.writeHead(200, {'Content-Type': 'application/json'});
                            response.write('{"game": ' + hash + '}');
                            response.end();
                            return; 
                        }
                    })
                }
            }
            catch(err) {  /* erros de JSON */ }
        })
        .on('error', (err) => { console.log(err.message); });
}