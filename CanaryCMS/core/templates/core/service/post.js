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
        api_get: function(categories, filter, page, page_size, callback) {
            self.__logger.log("api_get[categories, filter, page, page_size, callback]", [categories, filter, page, page_size, callback]);
            var url = self.config.api_url;
            if (categories && categories.length) url += "?categories=" + categories.toString();
            if (filter) {
                if (!categories || !categories.length) {
                    url += "?";
                } else {
                    url += "&";
                }
                url += "filter=" + filter;
            }
            if (page && page_size) {
                if ((!categories || !categories.length) && !filter) {
                    url += "?";
                } else {
                    url += "&";
                }
                url += "page=" + page + "&page-size=" + page_size;
            }
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
                    self.__logger.log("api_get returning", [post_response.posts, post_response.count]);
                    callback(post_response.posts, post_response.count);
                });
            });
        },
        api_get_single: function(post_id, callback) {
            self.__logger.log("api_get_single[post_id, callback]", [post_id, callback]);
            var url = self.config.api_url;
            if (post_id) url += "/" + post_id;
            util.cache.get(url, function(response_array) {
                util.parser.parse_response_array(response_array, function(post_responses) {
                    var post_response = post_responses[0];
                    self.__logger.log("api_get_single returning", post_response);
                    callback(post_response);
                });
            });
        }
    });
    inst.init();
    return inst;
});