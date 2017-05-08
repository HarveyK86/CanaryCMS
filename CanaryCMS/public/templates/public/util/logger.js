/* global $ */
define([], function() {
    var self = {
        config: {
            name: "logger",
            debug: false,
            debug_override: false,
            args_override: false,
        }
    };
    var inst = $.extend(self, {
        init: function() {
            self._log(self, "init");
        },
        get_logger: function(other) {
            self._log(self, "get_logger[other]", other);
            var logger = {
                log: function(message, args) {
                    self._log(other, message, args);
                }
            };
            self._log(self, "get_logger returning", logger);
            return logger;
        },
        _log: function(obj, message, args) {
            if (self.config.debug_override || obj.config.debug) {
                if (!self.config.args_override && args) {
                    console.info(obj.config.name, message, args);
                } else {
                    console.info(obj.config.name, message);
                }
            }
        },
    });
    inst.init();
    return inst;
});