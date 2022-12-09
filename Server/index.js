const http =   require ("http");
const fs =     require ("fs");
const url =    require ("url");
const crypto = require ("crypto");
const register = require ("./modules/register")

const server = http.createServer( (request, response)  => {
    const preq = url.parse(request.url,true);
    const pathname = preq.pathname;
    console.log(request.method + "    " + pathname);
    switch(request.method){
        case 'POST':
            switch(pathname){
                case '/register':
                    let msg = register(request, response);
                    console.log(msg);
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.write(""+msg);
                    response.end();
            }
    }
});

server.listen(8005);
