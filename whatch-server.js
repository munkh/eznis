var fs = require('fs')
    , url = require('url')
    , http = require('http')
    , path = require('path')
    , express = require('express')
    , app = express()
    , server = http.createServer(app)
    , root = __dirname;
app.use(express.logger('dev'));
app.use(express.static(root));
server.listen(8080);
