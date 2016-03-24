var http = require('http');
var fs = require('fs');
var url = require('url');

var port = 8081;
// Create a server
http.createServer( function (request, response) {  
   // Parse the request containing file name
   var pathname = url.parse(request.url).pathname;
   // Print the name of the file for which request is made.
   console.log("Received request for: " + pathname);
   //var img = null;
   // Read the requested file content from file system
   fs.readFile(pathname.substr(1), function (err, data) {
      
      if (err) {
         console.log(err);
         // HTTP Status: 404 : NOT FOUND
         // Content Type: text/plain
         response.writeHead(404, {'Content-Type': 'text/html'});
      }else{	
          var contentType;
          if(pathname.indexOf(".htm") > -1 || pathname.indexOf(".html") > -1 || pathname.indexOf(".txt") > -1){
            contentType = "text/html";
          }else if(pathname.indexOf(".css") > -1){
            contentType = "text/css";
          }else if(pathname.indexOf(".js") > -1){
            contentType = "text/javascript";
          }else if(pathname.indexOf(".ttf") > -1){
            contentType = "font/opentype";
          }else if(pathname.indexOf(".woff") > -1){
            contentType = "application/x-font-woff";
          }else if(pathname.indexOf(".gif") > -1 || pathname.indexOf(".png") > -1 || pathname.indexOf(".jpg") > -1){
            contentType = "image/gif";
            //img = fs.readFileSync(pathname);
          }
          
         //Page found	  
         // HTTP Status: 200 : OK
         // Content Type: text/plain
         response.writeHead(200, {'Content-Type': contentType, 'Content-Length': data.length});	
         
         // Write the content of the file to response body
         response.write(data.toString());
      }
      // Send the response body
      response.end();
   });   
}).listen(port);

// Console will print the message
console.log('Server running at http://127.0.0.1:' + port + '/');