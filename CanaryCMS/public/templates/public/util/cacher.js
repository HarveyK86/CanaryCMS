/* global $ */
define([
    "util/logger"
], function(
    logger
) {
    var self = {
        config: {
            name: "cacher",
            debug: false,
        }
    };
    var inst = $.extend(self, {
        init: function() {
            self.__logger = logger.get_logger(self);
            self.__logger.log("init");
            self.__cache = {};
        },
        get: function(url, callback) {
            self.__logger.log("get[url, callback]", [url, callback]);
            if (self.__cache[url]) {
                var response = self.__cache[url];
                self.__logger.log("get returning cached", response);
                callback(response);
            } else {
                $.get({
                    url: url,
                    success: function(response) {
                        self.__cache[url] = response;
                        self.__logger.log("get returning", response);
                        callback(response);
                    },
                });
            }
        },
    });
    inst.init();
    return inst;
});