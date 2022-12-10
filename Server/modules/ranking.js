const crypto = require ("crypto")
const fs = require ("fs");

module.exports = ranking = (request, response) => {
    let body = "";
    request
        .on('data', (chunk) => { body += chunk;  })
        .on('end', () => {
            try {
                query = JSON.parse(body);
                if( query.group == 'undefined') {
                    response.writeHead(400, {'Content-Type': 'application/json'});
                    response.write('{"error": "Undefined group"}');
                    response.end();
                    return;
               }else if(query.size == 'undefined'){
                    response.writeHead(400, {'Content-Type': 'application/json'});
                    response.write('{"error": "Undefined size"}');
                    response.end();
                    return;
               }else if(typeof query.group != "number"){
                    response.writeHead(400, {'Content-Type': 'application/json'});
                    response.write('{"error": "Invalid group \'' + query.group + '\'"}');
                    response.end();
                    return;
               }else if(typeof query.size != "number"){
                    response.writeHead(400, {'Content-Type': 'application/json'});
                    response.write('{"error": "Invalid size \'' + query.size + '\'"}');
                    response.end();
                    return;
               }else{
                const hash = crypto.createHash('md5').update(query.group + '_' + query.size).digest('hex');
                console.log(hash);
                fs.readFile("db.json", (err, data) => {
                    let exists = false;
                    if(err) throw err;
                    let json = JSON.parse(data);
                    json.classifications.forEach(i => {
                        if(i.hash == hash){
                            exists = true;
                            response.writeHead(200, {'Content-Type': 'application/json'});
                            response.write('{"ranking":' + JSON.stringify(i.ranking) + '}');
                            response.end();
                            return;
                        }
                    });
                    if(!exists){
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.write('{"ranking": [] }');
                        response.end();
                        return;
                    }
                    response.end();
                    return;
                });
               }
            }
            catch(err) {  /* erros de JSON */ }
        })
        .on('error', (err) => { console.log(err.message); });
    }
    