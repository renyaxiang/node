/**
 * @author xiangry <xiangrenya@gmail.com>
 */

var http = require('http');
var config = reuire('../config');
var querystring = require('querystring');

module.exports = function(options){
    var opts = {
       host: config.api_host,
       port: config.api_port,
       method: options.type.toUpperCase(),
       headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Safari/537.36'
        },
       path: options.url
    };
    
    var req = http.request(options, function(res){
        var body = '';
        
        res.on('data', function(chunk) {
           body += chunk;
        });

        res.on('end', function() {
         console.log(body);
         if(typeof options.success == 'function'){
             options.success(body);
         }
        });
    });

    req.on('error', function(err) {
        console.error(`请求遇到问题: ${e.message}`);
        if(typeof options.error == 'function'){
            options.error(err);
        }
    });
    
    if(options.data){
        if(opts.type == 'GET'){
            
        }
        if(opts.type == 'POST'){
            opts.data = querystring.stringify(options.data);
            req.write(opts.data);    
        }
    }

    req.end();
}