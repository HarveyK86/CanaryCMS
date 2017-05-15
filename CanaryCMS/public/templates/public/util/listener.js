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
            var current = self.__onhashchange;
            window.onhashchange = function() {
                if (current) current();
                onhashchange();
            };
        },
        add_onquerychange: function(onquerychange) {
            self.__logger.log("add_onquerychange[onquerychange]", onquerychange);
            var current = self.__onquerychange;
            self.__onquerychange = function(param) {
                if (current) current(param);
                onquerychange(param);
            };
        },
        hashchanged: function() {
            if (self.__onhashchange) self.__onhashchange();
        },
        querychanged: function(param) {
            if (self.__onquerychange) self.__onquerychange(param);
        },
    });
    inst.init();
    return inst;
});