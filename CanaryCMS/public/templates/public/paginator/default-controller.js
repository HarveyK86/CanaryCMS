/* global $ */
define(["util-package"], function(util) {
    var self = {
        config: {
            name: "paginator/default-controller",
            debug: false,
            templates: {
                paginator_template: {
                    selector: "#paginator-template",
                    attribute: "__paginator",
                },
            },
            paginator_template_container_selector: "[name='paginator-template-container']",
            page_key: "p",
            default_page: "1",
            page_size_key: "s",
            default_page_size: "5",
            item_count_key: "c",
            default_item_count: "0",
        }
    };
    return $.extend(self, {
        init: function(init_params) {
            self.__logger = util.logger.get_logger(self);
            self.__logger.log("init[init_params]", init_params);
            self.__init_params = init_params;
            self.__templater = util.templater.get_templater(self);
            self.__templater.init_templates();
            self._init_paginator_template_container();
            util.listener.add_onquerychange(self.config.name, function(params) {
                self._init_paginator_template_container();
            });
        },
        _init_paginator_template_container: function() {
            self.__logger.log("_init_paginator_template_container");
            var page = parseInt(util.query.get_param(self.config.page_key, self.config.default_page), 10);
            var page_size = parseInt(util.query.get_param(self.config.page_size_key, self.config.default_page_size), 10);
            var item_count = parseInt(util.query.get_param(self.config.item_count_key, self.config.default_item_count), 10);
            var max_page = Math.ceil(item_count / page_size);
            self.__templater.render_to_container(
                self.config.templates.paginator_template,
                self.__init_params.selector_prefix + self.config.paginator_template_container_selector, {
                    paginator: $.extend(self.__init_params, {
                        url_prefix: util.query.get_hash(),
                        page_key: self.config.page_key,
                        page: page,
                        max_page: max_page,
                        is_first_page: page == 1,
                        is_last_page: page == max_page,
                        page_size_key: self.config.page_size_key,
                        page_size: page_size,
                        item_count_key: self.config.item_count_key,
                        item_count: item_count,
                    }),
                }
            );
        },
        get_page_key: function() {
            self.__logger.log("get_page_key returning", self.config.page_key);
            return self.config.page_key;
        },
        get_default_page: function() {
            self.__logger.log("get_default_page returning", self.config.default_page);
            return self.config.default_page;
        },
        get_page_size_key: function() {
            self.__logger.log("get_page_size_key returning", self.config.page_size_key);
            return self.config.page_size_key;
        },
        get_default_page_size: function() {
            self.__logger.log("get_default_page_size returning", self.config.default_page_size);
            return self.config.default_page_size;
        },
        get_item_count_key: function() {
            self.__logger.log("get_item_count_key returning", self.config.item_count_key);
            return self.config.item_count_key;
        },
        get_default_item_count: function() {
            self.__logger.log("get_default_item_count returning", self.config.default_item_count);
            return self.config.default_item_count;
        },
    });
});