/* global $ */
define(["util/logger", "util/templater"], function(logger, templater) {
    var self = {
        config: {
            name: "page/placeholder",
            debug: false,
            templates: {
                page_name_template: {
                    selector: "#page-name-template",
                    attribute: "__page_name",
                }
            },
            page_name_selector: "#page-name",
        }
    };
    return $.extend(self, {
        init: function(init_params) {
            self.__logger = logger.get_logger(self);
            self.__logger.log("init[init_params]", init_params);
            self.__init_params = init_params;
            self.__templater = templater.get_templater(self);
            self.__templater.init_templates();
            self._init_page_name();
        },
        _init_page_name: function() {
            self.__logger.log("_init_page_name");
            var $page_name = $(self.config.page_name_selector);
            if (!$page_name.length) {
                console.error("Could not locate " + self.config.page_name_selector);
                return;
            }
            $page_name.empty();
            var $html = self.__templater.render(self.templates.page_name_template, {
                page_name: self.__init_params.name
            });
            $page_name.append($html);
        },
    });
});