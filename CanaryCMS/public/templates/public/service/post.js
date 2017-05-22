/* global $ */
define(["util-package"], function(util) {
    var self = {
        config: {
            name: "service/post",
            debug: false,
            api_url: "post",
        }
    };
    var inst = $.extend(self, {
        init: function() {
            self.__logger = util.logger.get_logger(self);
            self.__logger.log("init");
        },
        api_get: function(categories, page, page_size, callback) {
            self.__logger.log("api_get[categories, page, page_size, callback]", [categories, page, page_size, callback]);
            var url = self.config.api_url + "?categories=" + categories.toString();
            if (page && page_size) url += "&page=" + page + "&page-size=" + page_size;
            util.cache.get(url, function(response_array) {
                util.parser.parse_response_array(response_array, function(post_responses) {
                    var post_response = post_responses[0];
                    post_response.posts.sort(function(a, b) {
                        var a_epoch_time = parseInt(a.created_datetime.epoch_time, 10);
                        var b_epoch_time = parseInt(b.created_datetime.epoch_time, 10);
                        var result = 0;
                        if (a_epoch_time < b_epoch_time) {
                            result = 1;
                        } else if (b_epoch_time > a_epoch_time) {
                            result = -1;
                        }
                        return result;
                    });
                    self.__logger.log("api_get returning", post_response.posts);
                    callback(post_response.posts, post_response.count);
                });
            });
        },
    });
    inst.init();
    return inst;
});