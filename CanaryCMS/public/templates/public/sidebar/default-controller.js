/* global requirejs, $ */
define(["util-package"], function(util) {
    var self = {
        config: {
            name: "sidebar/default-controller",
            debug: false,
            widget_list_selector: "[name='widget-list']",
            interval_tick: 0,
        }
    };
    return $.extend(self, {
        init: function(init_params) {
            self.__logger = util.logger.get_logger(self);
            self.__logger.log("init[init_params]", init_params);
            self.__init_params = init_params;
            self.__templater = util.templater.get_templater(self);
            self._init_widget_list();
        },
        _init_widget_list: function() {
            self.__logger.log("_init_widget_list");
            var $widget_list = util.selector.select(self.__init_params.selector_prefix + self.config.widget_list_selector);
            $widget_list.empty();
            var out = self.__init_params.widgets.length;
            self.__init_params.widgets.forEach(function(widget_config) {
                self.__templater.http_get(widget_config.template.directory, function($template) {
                    $template.attr("name", "widget-" + widget_config.id);
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
                        $widget_list.append(widget_config.__$template);
                        widget_config.__controller.init($.extend(widget_config, {
                            selector_prefix: self.__init_params.selector_prefix + "[name='widget-" + widget_config.id + "'] ",
                        }));
                    });
                }
            }, self.config.interval_tick);
        },
    });
});