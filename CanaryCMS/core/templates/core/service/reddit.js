/* global $ */
define(["util-package"], function(util) {
    var self = {
        config: {
            name: "service/reddit",
            debug: false,
            api_url: "https://www.reddit.com/r/"
        }
    };
    var inst = $.extend(self, {
        init: function() {
            self.__logger = util.logger.get_logger(self);
            self.__logger.log("init");
        },
        api_get: function(subreddit, before, after, page_size, count, callback) {
            self.__logger.log("api_get[subreddit, before, after, page_size, count, callback]", [subreddit, before, after, page_size, count, callback]);
            var url = self.config.api_url + subreddit + ".json";
            if (page_size) {
                url += "?count=" + count + "&limit=" + page_size;
                if (before) url += "&before=" + before;
                if (after) url += "&after=" + after;
            }
            util.cache.get(url, function(response) {
                var reddit_response = util.parser.parse_reddit_response(response);
                self.__logger.log("api_get returning", [reddit_response.reddit_posts, reddit_response.before, reddit_response.after]);
                callback(reddit_response.reddit_posts, reddit_response.before, reddit_response.after);
            });
        },
    });
    inst.init();
    return inst;
});