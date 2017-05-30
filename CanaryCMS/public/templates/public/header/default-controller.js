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
            body_selector: "body",
            header_template_container_selector: "[name='header-template-container']",
            page_list_selector: "[name='page-list']",
        }
    };
    return $.extend(self, {
        init: function(init_params) {
            self.__logger = util.logger.get_logger(self);
            self.__logger.log("init[init_params]", init_params);
            self.__init_params = init_params;
            self.__templater = util.templater.get_templater(self);
            self.__templater.init_templates();
            self._init_body();
            self._init_header_template_container();
            util.listener.add_onhashchange(self.config.name, self._init_page_list);
            self._init_page_list();
        },
        _init_body: function() {
            self.__logger.log("_init_body");
            if (self.__init_params.template.parameters.fixed === true) {
                var $body = util.selector.select(self.config.body_selector);
                $body.addClass("fixed-header");
            }
        },
        _init_header_template_container: function() {
            self.__logger.log("_init_header_template_container");
            self.__templater.render_to_container(
                self.config.templates.header_template,
                self.__init_params.selector_prefix + self.config.header_template_container_selector, {
                    header: self.__init_params,
                }
            );
        },
        _init_page_list: function() {
            self.__logger.log("_init_page_list");
            var $page_list = util.selector.select(self.__init_params.selector_prefix + self.config.page_list_selector);
            $page_list.empty();
            self.__init_params.pages.forEach(function(page_config) {
                var slug = s.slugify(page_config.name);
                $page_list.append(self.__templater.render(self.config.templates.page_template, {
                    page: $.extend(page_config, {
                        active: util.query.get_hash() === "#" + slug,
                        slug: slug,
                    }),
                }));
            });
        },
    });
});