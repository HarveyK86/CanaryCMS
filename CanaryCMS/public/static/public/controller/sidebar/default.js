/* global requirejs, $ */
define(["util/logger"], function(logger) {
    var self = {
        config: {
            name: "sidebar/default",
            debug: false,
            widgets_selector: "#widgets",
        }
    };
    return $.extend(self, {
        init: function(init_params) {
            self.__logger = logger.get_logger(self);
            self.__logger.log("init[init_params]", init_params);
            self.__init_params = init_params;
            self._init_widgets();
        },
        _init_widgets: function() {
            self.__logger.log("_init_widgets");
            var $widgets = $(self.config.widgets_selector);
            if (!$widgets.length) {
                console.error("Could not locate " + self.config.widgets_selector);
                return;
            }
            $widgets.empty();
            self.__init_params.widgets.forEach(function(widget_config) {
                $.get({
                    url: self.__init_params.template_prefix + widget_config.template.file,
                    success: function(response) {
                        var $template = $(response);
                        $template.attr("id", "widget-" + widget_config.id);
                        $widgets.append($template);
                        requirejs([widget_config.controller.file], function(widget) {
                            widget.init($.extend(widget_config, {
                                selector_prefix: "#widget-" + widget_config.id + " ",
                            }));
                        });
                    },
                });
            });
        },
    });
});