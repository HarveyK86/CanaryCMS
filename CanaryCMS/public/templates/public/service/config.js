/* global $ */
define(["util-package"], function(util) {
    var self = {
        config: {
            name: "service/config",
            debug: false,
            api_url: "config",
        }
    };
    var inst = $.extend(self, {
        init: function() {
            self.__logger = util.logger.get_logger(self);
            self.__logger.log("init");
        },
        api_get: function(callback) {
            self.__logger.log("api_get[callback]", callback);
            util.cache.get(self.config.api_url, function(response_array) {
                util.parser.parse_response_array(response_array, function(parsed_array) {
                    var config = parsed_array[0];
                    self.__logger.log("api_get returning", config);
                    callback(config);
                });
            });
        },
    });
    inst.init();
    return inst;
});