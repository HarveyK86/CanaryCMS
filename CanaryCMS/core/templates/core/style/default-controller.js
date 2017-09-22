/* global $ */
define(["util/logger"], function(logger) {
    var self = {
        config: {
            name: "style/default-controller",
            debug: false,
        }
    };
    return $.extend(self, {
        init: function(init_params) {
            self.__logger = logger.get_logger(self);
            self.__logger.log("init[init_params]", init_params);
            self.__init_params = init_params;
        },
    });
});