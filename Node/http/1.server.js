const http = require('http');
const url = require('url');

const server = http.createServer((request, response) => {
    console.log(request.method);
    console.log(request.url);
    response.write('开始');
    response.end('结束');
});

let port = 2000;
server.listen(port, () => {
    console.log(`server start ${port}`)
});
server.on('error', (err) => {
    if (err.errno === 'EADRINUSE') {
        server.listen(++port);
    }
});
