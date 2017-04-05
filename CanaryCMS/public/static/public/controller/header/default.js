/* global $, _, s */
define([], function() {
    var self = {
        config: {
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
            self._log("init[init_params]", init_params);
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
            self._log("_init_templates");
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
            self._log("_init_pages");
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
        _log: function(message, args) {
            if (self.config.debug) {
                if (args) {
                    console.info(message, args);
                } else {
                    console.info(message);
                }
            }
        }
    });
});