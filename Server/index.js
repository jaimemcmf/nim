const http =   require ("http");
const fs =     require ("fs");
const url =    require ("url");
const crypto = require ("crypto");
const register = require ("./modules/register")
const ranking = require ("./modules/ranking")
const join = require ("./modules/join");
const update = require("./modules/update");
const leave = require("./modules/leave");
const notify = require("./modules/notify");


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
                case '/leave':
                    leave(request, response);
                    break;
                case '/notify':
                    notify(request, response);
                    break;
                default:
                    response.writeHead(404);
                    response.write("{}");
                    response.end();
                    break;
            }
            break;
        case 'GET':
            if(request.headers.accept && request.headers.accept == 'text/event-stream'){
                if('/update' == pathname){
                    update(request, response);
                    break;
                }
            }else{
                response.writeHead(404);
                response.write("{}");
                response.end();
                break;
            }   
        default:
            response.writeHead(404);
            response.write("{}");
            response.end();
            break;

    }
});
server.listen(8005);
