/* global $ */
define([
    "util/logger",
    "util/parser",
    "util/cacher"
], function(
    logger,
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
        api_get: function(categories, callback) {
            self.__logger.log("api_get[categories, callback]", [categories, callback]);
            cacher.get(self.config.api_url + "?categories=" + categories.toString(), function(response_array) {
                parser.parse_response_array(response_array, function(post_configs) {
                    post_configs.sort(function(a, b) {
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
                    self.__logger.log("api_get returning", post_configs);
                    callback(post_configs);
                });
            });
        },
    });
    inst.init();
    return inst;
});