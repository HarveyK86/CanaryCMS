/* global $, _ */
define(["util/logger"], function(logger) {
    var self = {
        config: {
            name: "page/placeholder",
            debug: false,
            templates: [{
                selector: "#page-name-template",
                attribute: "page_name",
            }],
            page_name_selector: "#page-name",
        }
    };
    return $.extend(self, {
        init: function(init_params) {
            self.__logger = logger.get_logger(self);
            self.__logger.log("init[init_params]", init_params);
            self.__init_params = init_params;
            self._init_templates();
            self._init_page_name();
        },
        _init_templates: function() {
            self.__logger.log("_init_templates");
            self.config.templates.forEach(function(template_config) {
                var $template = $(template_config.selector);
                if (!$template.length) {
                    console.error("Could not locate " + template_config.selector);
                    return;
                }
                var html = $template.html();
                self[template_config.attribute] = _.template(html);
            });
        },
        _init_page_name: function() {
            self.__logger.log("_init_page_name");
            var $page_name = $(self.config.page_name_selector);
            if (!$page_name.length) {
                console.error("Could not locate " + self.config.page_name_selector);
                return;
            }
            $page_name.empty();
            var html = self.page_name({
                page_name: self.__init_params.name
            });
            var $html = $(html);
            $page_name.append($html);
        },
    });
});