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
    var self = {
        config: {
            name: "footer/default",
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
            self.__logger = logger.get_logger(self);
            self.__logger.log("init[init_params]", init_params);
            self.__init_params = init_params;
            self.__templater = templater.get_templater(self);
            self.__templater.init_templates();
            self._init_footer_container();
        },
        _init_footer_container: function() {
            self.__logger.log("_init_footer_container");
            var $footer_container = selector.select(self.config.footer_container_selector);
            $footer_container.empty();
            var $html = self.__templater.render(self.config.templates.footer_template, {
                footer: self.__init_params,
            });
            $footer_container.append($html);
        },
    });
});