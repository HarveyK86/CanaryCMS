/* global $ */
define([], function() {
    var self = {
        config: {
            debug: true,
        }
    };
    return $.extend(self, {
        init: function(init_params) {
            self._log("init[init_params]", init_params);
            self.__init_params = init_params;
            self._init_template();
        },
        _init_template: function() {
            self._log("_init_template");
            var $header = $(self.__init_params.selector);
            if (!$header.length) {
                console.error("Could not locate " + self.__init_params.selector);
                return;
            }
            $.get({
                url: "/static/public/" + self.__init_params.template.file,
                success: function(response) {
                    var $template = $(response);
                    $header.empty();
                    $header.append($template);
                }
            });
        },
        _log: function(message, args) {
            if (self.config.debug) {
                if (args) {
                    console.info(message, args);
                } else {
                    console.info(message);
                }
            }
        }
    });
});