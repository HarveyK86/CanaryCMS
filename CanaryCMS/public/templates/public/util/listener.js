/* global $ */
define(["util/logger"], function(logger) {
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
            self.__onhashchange = {};
            self.__onquerychange = {};
        },
        add_onhashchange: function(key, onhashchange) {
            self.__logger.log("add_onhashchange[key, onhashchange]", [key, onhashchange]);
            self.__onhashchange[key] = onhashchange;
        },
        add_onquerychange: function(key, onquerychange) {
            self.__logger.log("add_onquerychange[key, onquerychange]", [key, onquerychange]);
            self.__onquerychange[key] = onquerychange;
        },
        hashchanged: function() {
            for (var key in self.__onhashchange) {
                self.__onhashchange[key]();
            }
        },
        querychanged: function(params) {
            for (var key in self.__onquerychange) {
                self.__onquerychange[key](params);
            }
        },
    });
    inst.init();
    return inst;
});