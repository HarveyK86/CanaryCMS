/* global $, s */
define([
    "util/logger",
    "util/templater",
    "util/selector",
    "util/listener"
], function(
    logger,
    templater,
    selector, listener
) {
    var self = {
        config: {
            name: "header/default",
            debug: false,
            templates: {
                page_template: {
                    selector: "#page-template",
                    attribute: "__page",
                },
            },
            pages_selector: "#pages",
        }
    };
    return $.extend(self, {
        init: function(init_params) {
            self.__logger = logger.get_logger(self);
            self.__logger.log("init[init_params]", init_params);
            self.__init_params = init_params;
            self.__templater = templater.get_templater(self);
            self.__templater.init_templates();
            listener.add_onhashchange(self._init_pages);
            self._init_pages();
        },
        _init_pages: function() {
            self.__logger.log("_init_pages");
            var $pages = selector.select(self.config.pages_selector);
            $pages.empty();
            self.__init_params.pages.forEach(function(page_config) {
                var slug = s.slugify(page_config.name);
                var $html = self.__templater.render(self.config.templates.page_template, {
                    page: $.extend(page_config, {
                        active: window.location.hash === "#" + slug,
                        slug: slug,
                    }),
                });
                $pages.append($html);
            });
        },
    });
});