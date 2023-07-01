const crypto = require ("crypto")
const fs = require ("fs");
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Content-Type': "application/json"}

module.exports = ranking = (request, response) => {
    let body = "";
    request
        .on('data', (chunk) => { body += chunk;  })
        .on('end', () => {
            try {
                query = JSON.parse(body);
                if( query.group == 'undefined' || query.nick == 'undefined' || query.password == 'undefined' || query.size == 'undefined') {
                    response.writeHead(400, headers);
                    response.write('{"error": "One of the request fields is undefined"}');
                    response.end();
                    return;
               }else if(typeof query.group != 'number' || typeof query.nick != 'string' || typeof query.password != 'string' || typeof query.size != 'number'){
                    response.writeHead(400, headers);
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
                        let index = 0;
                        json.joining.forEach(i => {
                            if(i.game == hash){
                                exists = true;
                                let rack = [];
                                for(j=1; j<=query.size; j++) rack[j-1] = j;
                                json['paired'].push({"game":hash, "size":query.size, "first":i.nick, "changed":1, "changed2":1, "turn":i.nick, "next":query.nick, "rack":rack, "win":false});
                                delete json.joining[index];
                                json.joining.splice(index, 1);
                                fs.writeFile("db.json", JSON.stringify(json), (err => {
                                    if(err) throw err;
                                    console.log("data written to file");
                                }));
                                
                                response.writeHead(200, headers);
                                response.write('{\"game\": \"' + hash + '\"}');
                                response.end();
                                return;
                            }
                            index++;
                        });
                        if(!exists){
                            json["joining"].push({"game":hash,"nick":query.nick});
                            fs.writeFile("db.json", JSON.stringify(json), (err => {
                            if(err) throw err;
                            console.log("data written to file");
                            }));
                            response.writeHead(200, headers);
                            response.write('{\"game\": \"' + hash + '\"}');
                            response.end();
                            return; 
                        }
                    })
                }
            }
            catch(err) {console.log(err)}
        })
        .on('error', (err) => { console.log(err.message); });
}