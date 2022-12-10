const crypto = require ("crypto")
const fs = require ("fs");
var message = '{}';
module.exports = register = (request, response) => {
    let body = "";
    request
    .on('data', (chunk) => { body += chunk;  })
    .on('end', () => {
           try {
              query = JSON.parse(body);
              if( query.nick == 'undefined' || query.password == 'undefined' || typeof query.nick != "string" || typeof query.pass != "string") {
                response.writeHead(400, {'Content-Type': 'application/json'});
                response.write('{"error": "User or password is not defined"}');
                response.end();
                return;
              }
              else {
                let json;
                fs.readFile("db.json", (err, data) => {
                    const hash = crypto.createHash('md5').update(query.pass).digest('hex');
                    let exists = false;
                    if(err) throw err;
                    json = JSON.parse(data);
                    console.log(json);
                    const users = json.user;
                    users.forEach(i => {
                        console.log(i.nick + "  " + i.pass);
                        console.log(i);
                        if(i.nick == query.nick && i.pass != hash){
                            response.writeHead(401, {'Content-Type': 'application/json'});
                            response.write('{"error": "User registered with a different password"}');
                            response.end();
                            exists = true;
                            return;
                        } 
                        else if(i.nick == query.nick && i.pass == hash){
                            response.writeHead(200, {'Content-Type': 'application/json'});
                            response.write('{}');
                            response.end();
                            exists = true;
                            return;
                        } 
                    });
                    if(!exists){
                        json["user"].push({"nick":query.nick,"pass":hash});
                        fs.writeFile("db.json", JSON.stringify(json), (err => {
                            if(err) throw err;
                            console.log("data written to file");
                            }));
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.write('{}');
                        response.end();
                        return; 
                    }
                    response.end();
                    return;
                })
              }
            }
           catch(err) {  /* erros de JSON */ }
    })
    .on('error', (err) => { console.log(err.message); });
    console.log("Message is -> " + message);

}