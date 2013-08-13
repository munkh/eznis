var fs = require('fs')
    , url = require('url')
    , http = require('http')
    , path = require('path')
    , express = require('express')
    , app = express()
    , server = http.createServer(app)
    , io = require('socket.io').listen(server)
    , root = __dirname;

app.use(express.logger('dev'));

app.use(function (req, res, next) {



    console.info("FUUUUCK" + req.url );
    var file = url.parse(req.url).pathname
        , mode = 'stylesheet';
    if (file[file.length - 1] == '/') {
        file += 'index.html';
        mode = 'reload';
    }
    createWatcher(file, mode);
    next();
});

app.use(express.static(root));

var watchers = {};

function createWatcher (file, event) {
    var absolute = path.join(root, file);
    console.log('absolute' + file);
    if (watchers[absolute]) {
        return;
    }

    fs.watchFile(absolute, function (curr, prev) {
        if (curr.mtime !== prev.mtime) {
            console.log('socket fire' + file);
            io.sockets.emit(event, file);
        }
    });

    watchers[absolute] = true;
}

server.listen(8080);
