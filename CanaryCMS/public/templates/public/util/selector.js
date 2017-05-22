/* global $ */
define(["util/logger"], function(logger) {
    var self = {
        config: {
            name: "selector",
            debug: false,
        }
    };
    var inst = $.extend(self, {
        init: function() {
            self.__logger = logger.get_logger(self);
            self.__logger.log("init");
        },
        select: function(selector) {
            self.__logger.log("select[selector]", selector);
            var $element = $(selector);
            if (!$element.length) {
                console.error("Could not locate " + selector);
                return;
            } else if ($element.length != 1) {
                console.error("Multiple versions of " + selector + " located");
                return;
            }
            return $element;
        },
    });
    inst.init();
    return inst;
});