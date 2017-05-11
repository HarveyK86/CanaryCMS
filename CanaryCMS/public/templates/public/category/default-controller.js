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
    return {
        init: function(init_params) {
            var self = {
                config: {
                    name: "category/default-controller",
                    debug: false,
                    templates: {
                        category_template: {
                            selector: "[name='category-template']",
                            attribute: "__category",
                        },
                    },
                    category_container_selector: "[name='category-container']",
                }
            };
            var inst = $.extend(self, {
                _init: function(init_params) {
                    self.__logger = logger.get_logger(self);
                    self.__logger.log("_init[init_params]", init_params);
                    self.__init_params = init_params;
                    self.__templater = templater.get_templater(self);
                    self.__templater.init_templates(self.__init_params.selector_prefix);
                    self._init_category_container();
                },
                _init_category_container: function() {
                    self.__logger.log("_init_category_container");
                    var $category_container = selector.select(self.__init_params.selector_prefix + self.config.category_container_selector);
                    $category_container.empty();
                    var $html = self.__templater.render(self.config.templates.category_template, {
                        category: self.__init_params,
                    });
                    $category_container.append($html);
                },
            });
            inst._init(init_params);
            return inst;
        },
    };
});