/* global $ */
define([
    "util/logger",
    "util/templater",
    "util/selector",
    "util/listener",
    "util/querier"
], function(
    logger,
    templater,
    selector,
    listener,
    querier
) {
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
            paginator_container_selector: "#paginator-container",
            default_item_count: "0",
            default_start_page: "1",
            default_page_size: "5",
        }
    };
    return $.extend(self, {
        init: function(init_params) {
            self.__logger = logger.get_logger(self);
            self.__logger.log("init[init_params]", init_params);
            self.__init_params = init_params;
            self.__templater = templater.get_templater(self);
            self.__templater.init_templates();
            listener.add_onquerychange(function(param) {
                self._init_paginator_container();
            });
            self._init_paginator_container();
        },
        _init_paginator_container: function() {
            self.__logger.log("_init_paginator_container");
            var $paginator_container = selector.select(self.config.paginator_container_selector);
            $paginator_container.empty();
            var $html = self.__templater.render(self.config.templates.paginator_template, {
                paginator: self.__init_params,
                prefix: querier.get_hash(),
                count: parseInt(querier.get_param("count", self.config.default_item_count), 10),
                page: parseInt(querier.get_param("page", self.config.default_start_page), 10),
                size: parseInt(querier.get_param("size", self.config.default_page_size), 10),
            });
            $paginator_container.append($html);
        },
        get_default_start_page: function() {
            self.__logger.log("get_default_start_page");
            var default_start_page = self.config.default_start_page;
            self.__logger.log("get_default_start_page returning", default_start_page);
            return default_start_page;
        },
        get_default_page_size: function() {
            self.__logger.log("get_default_page_size");
            var default_page_size = self.config.default_page_size;
            self.__logger.log("get_default_page_size returning", default_page_size);
            return default_page_size;
        },
    });
});