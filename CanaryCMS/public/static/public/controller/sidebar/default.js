/* global requirejs, $ */
define(["util/logger", "util/templater"], function(logger, templater) {
    var self = {
        config: {
            name: "sidebar/default",
            debug: false,
            widgets_selector: "#widgets",
            interval_tick: 0,
        }
    };
    return $.extend(self, {
        init: function(init_params) {
            self.__logger = logger.get_logger(self);
            self.__logger.log("init[init_params]", init_params);
            self.__init_params = init_params;
            self.__templater = templater.get_templater(self);
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
            var out = self.__init_params.widgets.length;
            self.__init_params.widgets.forEach(function(widget_config) {
                self.__templater.http_get(widget_config.template.file, function($template) {
                    $template.attr("id", "widget-" + widget_config.id);
                    widget_config.__$template = $template;
                    requirejs([widget_config.controller.file], function(controller) {
                        widget_config.__controller = controller;
                        out--;
                    });
                });
            });
            var interval = setInterval(function() {
                if (out === 0) {
                    clearInterval(interval);
                    self.__init_params.widgets.forEach(function(widget_config) {
                        $widgets.append(widget_config.__$template);
                        widget_config.__controller.init($.extend(widget_config, {
                            selector_prefix: "#widget-" + widget_config.id + " ",
                        }));
                    });
                }
            }, self.config.interval_tick);
        },
    });
});