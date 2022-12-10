const http =   require ("http");
const fs =     require ("fs");
const url =    require ("url");
const crypto = require ("crypto");
const register = require ("./modules/register")
const ranking = require ("./modules/ranking")
const join = require ("./modules/join");
const update = require("./modules/update");


const server = http.createServer( (request, response)  => {
    const preq = url.parse(request.url,true);
    const pathname = preq.pathname;
    console.log(request.method + "    " + pathname);
    switch(request.method){
        case 'POST':
            switch(pathname){
                case '/register':
                    register(request, response);
                    break;
                case '/ranking':
                    ranking(request, response);
                    break;
                case '/join':
                    join(request, response);
                    break;
            }
            break;
        case 'GET':
            if(request.headers.accept && request.headers.accept == 'text/event-stream'){
                if('/update' == pathname){
                    update(request, response);
                }
            }    
    }
});
server.listen(8005);
