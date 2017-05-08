/* global $ */
define(["util/logger", "util/parser"], function(logger, parser) {
    var self = {
        config: {
            name: "service/config",
            debug: false,
            api_url: "config",
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
                    parser.parse_response_array(response_array, function(parsed_array) {
                        var config = parsed_array[0];
                        self.__logger.log("api_get returning", config);
                        callback(config);
                    });
                },
            });
        },
    });
    inst.init();
    return inst;
});