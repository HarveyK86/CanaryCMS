/* global $, s */
define(["util-package"], function(util) {
    var self = {
        config: {
            name: "header/default-controller",
            debug: false,
            templates: {
                header_template: {
                    selector: "#header-template",
                    attribute: "__header",
                },
                page_template: {
                    selector: "#page-template",
                    attribute: "__page",
                },
            },
            header_container_selector: "#header-container",
            pages_selector: "#pages",
        }
    };
    return $.extend(self, {
        init: function(init_params) {
            self.__logger = util.logger.get_logger(self);
            self.__logger.log("init[init_params]", init_params);
            self.__init_params = init_params;
            self.__templater = util.templater.get_templater(self);
            self.__templater.init_templates();
            util.listener.add_onhashchange(self.config.name, self._init_pages);
            self._init_header_container();
            self._init_pages();
        },
        _init_header_container: function() {
            self.__logger.log("_init_header_container");
            self.__templater.render_to_container(
                self.config.templates.header_template,
                self.config.header_container_selector, {
                    header: self.__init_params,
                }
            );
        },
        _init_pages: function() {
            self.__logger.log("_init_pages");
            var $pages = util.selector.select(self.config.pages_selector);
            $pages.empty();
            self.__init_params.pages.forEach(function(page_config) {
                var slug = s.slugify(page_config.name);
                $pages.append(self.__templater.render(
                    self.config.templates.page_template, {
                        page: $.extend(page_config, {
                            active: util.query.get_hash() === "#" + slug,
                            slug: slug,
                        }),
                    }
                ));
            });
        },
    });
});