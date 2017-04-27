/* global $,  */
define(["util/logger", "util/templater"], function(logger, templater) {
    var self = {
        config: {
            name: "widget/default",
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
    return $.extend(self, {
        init: function(init_params) {
            self.__logger = logger.get_logger(self);
            self.__logger.log("init[init_params]", init_params);
            self.__init_params = init_params;
            self.__templater = templater.get_templater(self);
            self.__templater.init_templates(self.__init_params.selector_prefix);
            self._init_widget_container();
        },
        _init_widget_container: function() {
            self.__logger.log("_init_widgets");
            var selector = self.__init_params.selector_prefix + self.config.widget_container_selector;
            var $widget_container = $(selector);
            if (!$widget_container.length) {
                console.error("Could not locate " + selector);
                return;
            } else if($widget_container.length != 1) {
                console.error("Multiple versiosn of " + selector + " located");
                return;
            }
            var $html = self.__templater.render(self.config.templates.widget_template, {
                widget: self.__init_params,
            });
            $widget_container.append($html);
        },
    });
});