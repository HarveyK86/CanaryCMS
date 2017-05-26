/* global $ */
define(["util-package"], function(util) {
    return {
        init: function(init_params) {
            var self = {
                config: {
                    name: "paginator/reddit/controller",
                    debug: false,
                    templates: {
                        reddit_paginator_template: {
                            selector: "#reddit-paginator-template",
                            attribute: "__reddit_paginator",
                        },
                    },
                    reddit_paginator_template_container_selector: "[name='reddit-paginator-template-container']",
                    before_key: "b",
                    default_beforee: null,
                    paginator_before_key: "pb",
                    default_paginator_before: null,
                    after_key: "a",
                    default_after: null,
                    paginator_after_key: "pa",
                    default_paginator_after: null,
                    page_size_key: "s",
                    default_page_size: "10",
                    count_key: "c",
                    default_count: 0,
                }
            };
            var inst = $.extend(self, {
                _init: function(init_params) {
                    self.__logger = util.logger.get_logger(self);
                    self.__logger.log("_init[init_params]", init_params);
                    self.__init_params = init_params;
                    self.__templater = util.templater.get_templater(self);
                    self.__templater.init_templates();
                    self._init_reddit_paginator_template_container();
                    util.listener.add_onquerychange(self.config.name, function(params) {
                        if (params.includes(self.config.paginator_before_key) ||
                            params.includes(self.config.paginator_after_key)) {
                            self._init_reddit_paginator_template_container();
                        }
                    });
                },
                destroy: function() {
                    self.__logger.log("destroy");
                    util.listener.remove_listeners(self.config.name);
                    ["__logger", "__init_params", "__templater"].forEach(function(element) {
                        self[element] = undefined;
                    });
                },
                _init_reddit_paginator_template_container: function() {
                    self.__logger.log("_init_reddit_paginator_template_container");
                    var paginator_before = util.query.get_param(self.config.paginator_before_key, self.config.default_paginator_before);
                    var paginator_after = util.query.get_param(self.config.paginator_after_key, self.config.default_paginator_after);
                    var page_size = parseInt(util.query.get_param(self.config.page_size_key, self.config.default_page_size), 10);
                    var count = parseInt(util.query.get_param(self.config.count_key, self.config.default_count), 10);
                    self.__templater.render_to_container(
                        self.config.templates.reddit_paginator_template,
                        self.__init_params.selector_prefix + self.config.reddit_paginator_template_container_selector, {
                            paginator: $.extend(self.__init_params, {
                                url_prefix: util.query.get_hash(),
                                before_key: self.config.before_key,
                                before: paginator_before,
                                after_key: self.config.after_key,
                                after: paginator_after,
                                is_first_page: count === 0,
                                is_last_page: paginator_after == self.config.default_after,
                                page_size_key: self.config.page_size_key,
                                page_size: page_size,
                                count_key: self.config.count_key,
                                before_count: (count === 0) ? 0 : count - page_size,
                                after_count: count + page_size,
                            }),
                        }
                    );
                },
                get_before_key: function() {
                    self.__logger.log("get_before_key returning", self.config.before_key);
                    return self.config.before_key;
                },
                get_default_before: function() {
                    self.__logger.log("get_default_before returning", self.config.default_before);
                    return self.config.default_before;
                },
                get_paginator_before_key: function() {
                    self.__logger.log("get_paginator_before_key returning", self.config.paginator_before_key);
                    return self.config.paginator_before_key;
                },
                get_default_paginator_before: function() {
                    self.__logger.log("get_default_paginator_before returning", self.config.default_paginator_before);
                    return self.config.default_paginator_before;
                },
                get_after_key: function() {
                    self.__logger.log("get_after_key returning", self.config.after_key);
                    return self.config.after_key;
                },
                get_default_after: function() {
                    self.__logger.log("get_default_after returning", self.config.default_after);
                    return self.config.default_after;
                },
                get_paginator_after_key: function() {
                    self.__logger.log("get_paginator_after_key returning", self.config.paginator_after_key);
                    return self.config.paginator_after_key;
                },
                get_default_paginator_after: function() {
                    self.__logger.log("get_default_paginator_after returning", self.config.default_paginator_after);
                    return self.config.default_paginator_after;
                },
                get_page_size_key: function() {
                    self.__logger.log("get_page_size_key returning", self.config.page_size_key);
                    return self.config.page_size_key;
                },
                get_default_page_size: function() {
                    self.__logger.log("get_default_page_size returning", self.config.default_page_size);
                    return self.config.default_page_size;
                },
                get_count_key: function() {
                    self.__logger.log("get_count_key returning", self.config.count_key);
                    return self.config.count_key;
                },
                get_default_count: function() {
                    self.__logger.log("get_default_count returning", self.config.default_count);
                    return self.config.default_count;
                },
            });
            inst._init(init_params);
            return inst;
        }
    };
});