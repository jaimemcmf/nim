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
                    register(request, response);
                    
            }
    }
});

server.listen(8005);
