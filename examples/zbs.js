var Crawler = require("crawler");
var SpiderService = require('./services/spider');

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
    uri: 'https://zb.oschina.net/',
    callback: function (err, res, done) {
        if(err){
            console.log(err);
        }else{
            var $ = res.$;
            var len = parseInt($('.z-page a:last-child').prev().text());
            var num = 1
            for(var i= 1 ; i <= len; i++){
                var uri = 'https://zb.oschina.net/projects?p=' + i;
                c.queue([{
                    uri: uri,
                    callback: function(err, res, done){
                        if(err){
                            console.log(err);
                        }else{
                            var $ = res.$;
                            
                            $('.pof-list-item').each(function(){
                                var project = $(this).find('.user-title').text().trim().substring(13);
                                var category = $(this).find('.user-tags span').last().text(); 
                                var status = $(this).find('.user-title span').text().replace(/[\[|\]]/g,'');
                                var price = $(this).find('.project-price').text().trim();
                                var amt = price == '竞标报价' ? 0 : parseInt(price.replace(',', ''));
                                var skill = $(this).find('.skill').text().trim(); 
                                var mode = $(this).find('.user-tags span').first().text();
                                var create_at = new Date($(this).find('.box-aw .box-fl span:last-child').text().trim().replace('发布于', ''));
                                SpiderService.addZb(project, category, status, amt, skill, mode, create_at, function(err, result){
                                    if(err){
                                        return console.log(err);
                                    }
                                    console.log('successed: ' + num++);
                                });
                            });
                        }
                        done();  
                    }
                }]);
            }
            
            $('.cell').each(function(){
                var author = $(this).find('.user_avatar img').attr('title');
                var title = $(this).find('.topic_title').attr('title');
                var path = $(this).find('.topic_title').attr('href');
                var uri = 'https://cnodejs.org' + path;
                
                

            });
        }
        done();
    }
}]);
