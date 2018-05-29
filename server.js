//
// # SimpleServer
//
//
var http = require('http');
var path = require('path');
var express = require('express');

var bodyParser = require('body-parser');
var session = require('express-session');


//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var app = express();
var server = http.createServer(app);

app.set('views', __dirname + '/client');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(session({
 secret: '~g!y@e#o$m%s^o&n*G+Y_E)O(M*S&O^N%',
 resave: false,
 saveUninitialized: true
}));

app.use(express.static( path.resolve(__dirname, 'client') ));
app.use(express.static( path.resolve(__dirname, '/upload') )); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

var router = require('./router/main')(app);

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
