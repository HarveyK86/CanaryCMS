/* global $, _ */
define(["util/logger"], function(logger) {
    var self = {
        config: {
            name: "widget/default",
            debug: false,
            templates: [{
                selector: "[name='widget-template']",
                attribute: "widget",
            }],
            widget_container_selector: "[name='widget-container']",
        }
    };
    return $.extend(self, {
        init: function(init_params) {
            self.__logger = logger.get_logger(self);
            self.__logger.log("init[init_params]", init_params);
            self.__init_params = init_params;
            self._init_templates();
            self._init_widget_container();
        },
        _init_templates: function() {
            self.__logger.log("_init_templates");
            self.config.templates.forEach(function(template_config) {
                var selector = self.__init_params.selector_prefix + template_config.selector;
                var $template = $(selector);
                if (!$template.length) {
                    console.error("Could not locate " + selector);
                    return;
                } else if ($template.length != 1) {
                    console.error("Multiple versions of " + selector + " located");
                    return;
                }
                var html = $template.html();
                self[template_config.attribute] = _.template(html);
            });
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
            var html = self.widget({
                widget: self.__init_params,
            });
            var $html = $(html);
            $widget_container.append($html);
        },
    });
});