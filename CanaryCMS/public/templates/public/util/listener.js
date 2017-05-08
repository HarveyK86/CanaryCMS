/* global $ */
define([
    "util/logger"
], function(
    logger
) {
    var self = {
        config: {
            name: "listener",
            debug: false,
        }
    };
    var inst = $.extend(self, {
        init: function() {
            self.__logger = logger.get_logger(self);
            self.__logger.log("init");
        },
        add_onhashchange: function(onhashchange) {
            self.__logger.log("add_onhashchange[onhashchange]", onhashchange);
            var current = window.onhashchange;
            window.onhashchange = function() {
                if (current) current();
                onhashchange();
            };
        },
    });
    inst.init();
    return inst;
});