/* global $ */
define(["util/logger", "util/parser"], function(logger, parser) {
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
        api_get: function(callback) {
            self.__logger.log("api_get[callback]", callback);
            $.get({
                url: self.config.api_url,
                success: function(response_array) {
                    parser.parse_response_array(response_array, function(post_configs) {
                        self.__logger.log("api_get returning", post_configs);
                        callback(post_configs);
                    });
                },
            });
        },
    });
    inst.init();
    return inst;
});