/* global $ */
define([], function() {
    var self = {
        config: {
            name: "logger",
            debug: false,
            debug_override: false,
        }
    };
    return $.extend(self, {
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
                if (args) {
                    console.info(obj.config.name, message, args);
                } else {
                    console.info(obj.config.name, message);
                }
            }
        },
    });
});