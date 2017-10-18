/* global $ */
define(["util-package"], function(util) {
    return {
        init: function(init_params) {
            var self = {
                config: {
                    name: "category/default-controller",
                    debug: false,
                    templates: {
                        category_template: {
                            selector: "#category-template",
                            attribute: "__category",
                        },
                    },
                    category_template_container_selector: "[name='category-template-container']",
                }
            };
            var inst = $.extend(self, {
                _init: function(init_params) {
                    self.__logger = util.logger.get_logger(self);
                    self.__logger.log("_init[init_params]", init_params);
                    self.__init_params = init_params;
                    self.__templater = util.templater.get_templater(self);
                    self.__templater.init_templates();
                    self._init_category_template_container();
                },
                _init_category_template_container: function() {
                    self.__logger.log("_init_category_template_container");
                    self.__templater.render_to_container(
                        self.config.templates.category_template,
                        self.__init_params.selector_prefix + self.config.category_template_container_selector, {
                            category: $.extend(self.__init_params, {
                                add_url: self.__init_params.filter_key ? true : false,
                                url: util.query.get_hash() + "?" + self.__init_params.filter_key + "=" + self.__init_params.name,
                            }),
                        }
                    );
                },
            });
            inst._init(init_params);
            return inst;
        },
    };
});