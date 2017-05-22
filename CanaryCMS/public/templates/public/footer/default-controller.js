/* global $ */
define(["util-package"], function(util) {
    var self = {
        config: {
            name: "footer/default-controller",
            debug: false,
            templates: {
                footer_template: {
                    selector: "#footer-template",
                    attribute: "__footer",
                },
            },
            footer_container_selector: "#footer-container",
        }
    };
    return $.extend(self, {
        init: function(init_params) {
            self.__logger = util.logger.get_logger(self);
            self.__logger.log("init[init_params]", init_params);
            self.__init_params = init_params;
            self.__templater = util.templater.get_templater(self);
            self.__templater.init_templates();
            self._init_footer_container();
        },
        _init_footer_container: function() {
            self.__logger.log("_init_footer_container");
            self.__templater.render_to_container(
                self.config.templates.footer_template,
                self.config.footer_container_selector, {
                    footer: self.__init_params,
                }
            );
        },
    });
});