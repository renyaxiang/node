var Crawler = require("crawler");
var PostService = require('./services/spider');

var c = new Crawler({
    maxConnections : 10,
    jQuery: {
        name: 'cheerio',
        options: {
            normalizeWhitespace: true,
            xmlMode: true,
            decodeEntities: false
        }
    },
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            console.log($("title").text());
        }
        done();
    }
});

c.queue([{
    uri: 'https://cnodejs.org/?tab=good',
    callback: function (err, res, done) {
        if(err){
            console.log(err);
        }else{
            var $ = res.$;
            var i = 1;
            $('.cell').each(function(){
                var author = $(this).find('.user_avatar img').attr('title');
                var title = $(this).find('.topic_title').attr('title');
                var path = $(this).find('.topic_title').attr('href');
                var uri = 'https://cnodejs.org' + path;
                
                c.queue([{
                    uri: uri,
                    callback: function(err, res, done){
                        if(err){
                            console.log(err);
                        }else{
                            var $ = res.$;
                            var content = $('.topic_content .markdown-text').html();
                            PostService.addPost(author, title, content, function(err, result){
                                if(err){
                                    console.log(err);
                                    return;
                                }
                                console.log('inserted' + i++);
                            });
                        }
                        done();  
                    }
                }]);

            });
        }
        done();
    }
}]);
