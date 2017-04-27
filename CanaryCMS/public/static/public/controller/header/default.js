/* global $, _, s */
define(["util/logger"], function(logger) {
    var self = {
        config: {
            name: "header/default",
            debug: false,
            templates: [{
                selector: "#page-template",
                attribute: "page",
            }],
            pages_selector: "#pages",
        }
    };
    return $.extend(self, {
        init: function(init_params) {
            self.__logger = logger.get_logger(self);
            self.__logger.log("init[init_params]", init_params);
            self.__init_params = init_params;
            self._init_templates();
            var onhashchange = window.onhashchange;
            window.onhashchange = function() {
                if (onhashchange) onhashchange();
                self._init_pages();
            };
            self._init_pages();
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
        _init_pages: function() {
            self.__logger.log("_init_pages");
            var $pages = $(self.config.pages_selector);
            if (!$pages.length) {
                console.error("Could not locate " + self.config.pages_selector);
                return;
            }
            $pages.empty();
            self.__init_params.pages.forEach(function(page_config) {
                var slug = s.slugify(page_config.name);
                var html = self.page({
                    page: $.extend(page_config, {
                        active: window.location.hash === "#" + slug,
                        slug: slug,
                    }),
                });
                var $html = $(html);
                $pages.append($html);
            });
        },
    });
});