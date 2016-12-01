/**
 * Static HTTP Server
 *
 * Create a static file server instance to serve files
 * and folder in the './public' folder
 */

// modules
var hostname = "192.168.88.242"
var static = require( 'node-static' ),
    port = 8080,
    http = require( 'http' );

// config
var file = new static.Server( './public', {
    cache: 3600,
    gzip: true
} );

// server
var server = http.createServer( function ( request, response ) {
    request.addListener('end', function () {
        file.serve(request, response, function (err, result) {
            if (err) { // There was an error serving the file
                console.error("Error serving " + request.url + " - " + err.message);

                // Respond to the client
                response.writeHead(err.status, err.headers);
                response.end();
            }
        });
    }).resume();
}).listen( port,hostname );
console.log('Listening on '+hostname+':'+port);

server.on('request',function(req,res){
    var timeNow = new Date().toLocaleTimeString();
    console.log(timeNow+' -- '+req.method+' ['+res.statusCode+']: '+req.url);
});
server.on('request',function(req,res){
    if (req.method == 'POST') {
        console.log("POST");
        var body = '';
        req.on('data', function (data) {
            body += data;
            console.log("Partial body: " + body);
        });
        req.on('end', function () {
            console.log("Body: " + body);
        });
        //res.writeHead(200, {'Content-Type': 'text/html'});
        //res.end('post received');
        console.log('post received');
    }
});

/*
Example usage global
# serve up the current directory
$ static
serving "." at http://127.0.0.1:8080

# serve up a different directory
$ static public
serving "public" at http://127.0.0.1:8080

# specify additional headers (this one is useful for development)
$ static -H '{"Cache-Control": "no-cache, must-revalidate"}'
serving "." at http://127.0.0.1:8080

# set cache control max age
$ static -c 7200
serving "." at http://127.0.0.1:8080

# expose the server to your local network
$ static -a 0.0.0.0
serving "." at http://0.0.0.0:8080

# show help message, including all options
$ static -h
*/
