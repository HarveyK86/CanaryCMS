/* global $ */
define([
    "util/logger",
    "util/querier",
    "util/parser",
    "util/cacher"
], function(
    logger,
    querier,
    parser,
    cacher
) {
    var self = {
        config: {
            name: "service/post",
            debug: false,
            api_url: "post",
        }
    };
    var inst = $.extend(self, {
        init: function() {
            self.__logger = logger.get_logger(self);
            self.__logger.log("init");
        },
        api_get: function(categories, page, size, callback) {
            self.__logger.log("api_get[categories, page, size, callback]", [categories, page, size, callback]);
            cacher.get(self.config.api_url + "?categories=" + categories.toString() + "&page=" + page + "&size=" + size, function(response_array) {
                parser.parse_response_array(response_array, function(post_responses) {
                    var post_response = post_responses[0];
                    querier.set_param("count", post_response.count);
                    post_response.posts.sort(function(a, b) {
                        var a_epoch_time = parseInt(a.created_datetime.epoch_time, 10);
                        var b_epoch_time = parseInt(b.created_datetime.epoch_time, 10);
                        var result = 0;
                        var a_before_b = -1;
                        var b_before_a = 1;
                        if (a_epoch_time < b_epoch_time) {
                            result = b_before_a;
                        } else if (b_epoch_time > a_epoch_time) {
                            result = a_before_b;
                        }
                        return result;
                    });
                    self.__logger.log("api_get returning", post_response.posts);
                    callback(post_response.posts);
                });
            });
        },
    });
    inst.init();
    return inst;
});