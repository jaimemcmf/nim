const fs = require ("fs");
var message;
module.exports = register = (request, response) => {
    let body = "";
    request
    .on('data', (chunk) => { body += chunk;  })
    .on('end', () => {
           try {
              query = JSON.parse(body);
              if( query.nick == 'undefined' || query.password == 'undefined') message = '{"error": "User or password is not defined"}';
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
                            message = '{"error": "User registered with a different password"}';
                        } 
                        else if(i.nick == query.nick && i.pass == query.pass){
                            console.log("exiting 5");
                            message = '{}';
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
    return message;
}