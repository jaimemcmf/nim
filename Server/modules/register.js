const fs = require ("fs");
var message = '{}';
module.exports = register = (request, response) => {
    let body = "";
    request
    .on('data', (chunk) => { body += chunk;  })
    .on('end', () => {
           try {
              query = JSON.parse(body);
              if( query.nick == 'undefined' || query.password == 'undefined') {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.write('{"error": "User or password is not defined"}');
                response.end();
                return;
         
              }
              else {
                fs.readFile("db.json", (err, data) => {
                    if(err) throw err;
                    let json = JSON.parse(data);
                    console.log(json);
                    const users = json.user;
                    users.forEach(i => {
                        console.log(i.nick + "  " + i.pass);
                        console.log(i);
                        if(i.nick == query.nick && i.pass != query.pass){
                            console.log("exiting 1");
                            response.writeHead(200, {'Content-Type': 'application/json'});
                            response.write('{"error": "User registered with a different password"}');
                            response.end();
                            return;
                        } 
                        else if(i.nick == query.nick && i.pass == query.pass){
                            console.log("exiting 5");
                            response.writeHead(200, {'Content-Type': 'application/json'});
                            response.write('{}');
                            response.end();
                            return;
                        } 
                    }); 
                        let newUser = '{"nick":"' + query.nick + '","pass":"' + query.pass + '"}';
                        json["user"].push(newUser);
                        fs.writeFile("../db.json", JSON.stringify(json), (err => {
                            if(err) throw err;
                            console.log("data written to file");
                        }));
                })
              }
              
              
            }
           catch(err) {  /* erros de JSON */ }
    })
    .on('error', (err) => { console.log(err.message); });
    console.log("Message is -> " + message);

}