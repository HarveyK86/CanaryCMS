/* global $ */
define([
    "util/logger",
    "util/templater",
    "util/selector"
], function(
    logger,
    templater,
    selector
) {
    return {
        init: function(init_params) {
            var self = {
                config: {
                    name: "widget/default-controller",
                    debug: false,
                    templates: {
                        widget_template: {
                            selector: "[name='widget-template']",
                            attribute: "__widget",
                        },
                    },
                    widget_container_selector: "[name='widget-container']",
                }
            };
            var inst = $.extend(self, {
                _init: function(init_params) {
                    self.__logger = logger.get_logger(self);
                    self.__logger.log("init[init_params]", init_params);
                    self.__init_params = init_params;
                    self.__templater = templater.get_templater(self);
                    self.__templater.init_templates(self.__init_params.selector_prefix);
                    self._init_widget_container();
                },
                _init_widget_container: function() {
                    self.__logger.log("_init_widget_container");
                    var $widget_container = selector.select(self.__init_params.selector_prefix + self.config.widget_container_selector);
                    $widget_container.empty();
                    var $html = self.__templater.render(self.config.templates.widget_template, {
                        widget: self.__init_params,
                    });
                    $widget_container.append($html);
                },
            });
            inst._init(init_params);
            return inst;
        },
    };
});