/* global $ */
define(["util-package"], function(util) {
    return {
        init: function(init_params) {
            var self = {
                config: {
                    name: "widget/default-controller",
                    debug: false,
                    templates: {
                        widget_template: {
                            selector: "#widget-template",
                            attribute: "__widget",
                        },
                    },
                    widget_template_container_selector: "[name='widget-template-container']",
                }
            };
            var inst = $.extend(self, {
                _init: function(init_params) {
                    self.__logger = util.logger.get_logger(self);
                    self.__logger.log("_init[init_params]", init_params);
                    self.__init_params = init_params;
                    self.__templater = util.templater.get_templater(self);
                    self.__templater.init_templates();
                    self._init_widget_template_container();
                },
                _init_widget_template_container: function() {
                    self.__logger.log("_init_widget_template_container");
                    self.__templater.render_to_container(
                        self.config.templates.widget_template,
                        self.__init_params.selector_prefix + self.config.widget_template_container_selector, {
                            widget: self.__init_params,
                        }
                    );
                },
            });
            inst._init(init_params);
            return inst;
        },
    };
});