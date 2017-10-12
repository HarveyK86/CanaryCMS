/* global $ */
define(["util/logger"], function(logger) {
    var self = {
        config: {
            name: "cache",
            debug: false,
            interval_tick: 0,
        }
    };
    var inst = $.extend(self, {
        init: function() {
            self.__logger = logger.get_logger(self);
            self.__logger.log("init");
            self.__cache = {};
            self.__pending = {};
        },
        get: function(url, callback) {
            self.__logger.log("get[url, callback]", [url, callback]);
            if (self.__cache[url]) {
                self.__logger.log("get returning cached", self.__cache[url]);
                callback(self.__cache[url]);
            } else if (self.__pending[url]) {
                var interval = setInterval(function() {
                    if (!self.__pending[url]) {
                        clearInterval(interval);
                        self.__logger.log("get returning cached after pending", self.__cache[url]);
                        callback(self.__cache[url]);
                    }
                }, self.config.interval_tick);
            } else {
                self.__pending[url] = true;
                $.get({
                    url: url,
                    success: function(response) {
                        self.__cache[url] = response;
                        self.__pending[url] = false;
                        self.__logger.log("get returning", self.__cache[url]);
                        callback(self.__cache[url]);
                    },
                });
            }
        },
    });
    inst.init();
    return inst;
});