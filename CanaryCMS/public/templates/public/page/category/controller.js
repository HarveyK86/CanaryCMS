/* global requirejs, $ */
define(["util-package", "service/post"], function(util, post) {
    return {
        init: function(init_params) {
            var self = {
                config: {
                    name: "page/category/controller",
                    debug: false,
                    post_list_selector: "[name='post-list']",
                    paginator_slot_selector: "[name='paginator-slot']",
                    interval_tick: 0,
                }
            };
            var inst = $.extend(self, {
                _init: function(init_params) {
                    self.__logger = util.logger.get_logger(self);
                    self.__logger.log("_init[init_params]", init_params);
                    self.__init_params = init_params;
                    self.__templater = util.templater.get_templater(self);
                    self._init_paginator_slot(function() {
                        util.listener.add_onquerychange(self.config.name, function(params) {
                            if (params.includes(self.__paginator.get_page_key()) ||
                                params.includes(self.__paginator.get_page_size_key())) {
                                self._init_post_list();
                            }
                        });
                        self._init_post_list();
                    });
                },
                _init_paginator_slot: function(callback) {
                    self.__logger.log("_init_paginator_slot[callback]");
                    var $paginator_slot = util.selector.select(self.__init_params.selector_prefix + self.config.paginator_slot_selector);
                    $paginator_slot.empty();
                    if (self.__init_params.paginator) {
                        self.__templater.http_get(self.__init_params.paginator.template.directory, function($template) {
                            $paginator_slot.append($template);
                            requirejs([self.__init_params.paginator.controller.file], function(paginator) {
                                paginator.init($.extend(self.__init_params.paginator, {
                                    selector_prefix: self.__init_params.selector_prefix,
                                }));
                                self.__paginator = paginator;
                                callback();
                            });
                        });
                    } else {
                        callback();
                    }
                },
                _init_post_list: function() {
                    self.__logger.log("_init_post_list");
                    var $post_list = util.selector.select(self.__init_params.selector_prefix + self.config.post_list_selector);
                    $post_list.empty();
                    var start_page;
                    var page_size;
                    if (self.__paginator) {
                        start_page = parseInt(util.query.get_param(self.__paginator.get_page_key(), self.__paginator.get_default_page()), 10);
                        page_size = parseInt(util.query.get_param(self.__paginator.get_page_size_key(), self.__paginator.get_default_page_size()), 10);
                    }
                    post.api_get(self.__init_params.template.parameters.categories, start_page, page_size, function(post_configs, post_count) {
                        if (self.__paginator) util.query.set_param(self.__paginator.get_item_count_key(), post_count);
                        var out = post_configs.length;
                        post_configs.forEach(function(post_config) {
                            self.__templater.http_get(post_config.template.directory, function($template) {
                                $template.attr("name", "post-" + post_config.id);
                                post_config.__$template = $template;
                                requirejs([post_config.controller.file], function(controller) {
                                    post_config.__controller = controller;
                                    out--;
                                });
                            });
                        });
                        var interval = setInterval(function() {
                            if (out === 0) {
                                clearInterval(interval);
                                post_configs.forEach(function(post_config) {
                                    $post_list.append(post_config.__$template);
                                    post_config.__controller.init($.extend(post_config, {
                                        selector_prefix: self.__init_params.selector_prefix + "[name='post-" + post_config.id + "'] ",
                                    }));
                                });
                            }
                        }, self.config.interval_tick);
                    });
                },
            });
            inst._init(init_params);
            return inst;
        }
    };
});