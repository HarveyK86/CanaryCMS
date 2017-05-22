/* global requirejs, $ */
define(["util-package", "service/post"], function(util, post) {
    return {
        init: function(init_params) {
            var self = {
                config: {
                    name: "page/category/controller",
                    debug: false,
                    posts_selector: "#posts",
                    paginator_selector: "#paginator",
                    interval_tick: 0,
                }
            };
            var inst = $.extend(self, {
                _init: function(init_params) {
                    self.__logger = util.logger.get_logger(self);
                    self.__logger.log("_init[init_params]", init_params);
                    self.__init_params = init_params;
                    self.__templater = util.templater.get_templater(self);
                    self._init_paginator(function() {
                        util.listener.add_onquerychange(self.config.name, function(params) {
                            if (params.includes(self.__paginator.get_page_key()) ||
                                params.includes(self.__paginator.get_page_size_key())) {
                                self._init_posts();
                            }
                        });
                        self._init_posts();
                    });
                },
                _init_paginator: function(callback) {
                    self.__logger.log("_init_paginator[callback]");
                    var $paginator = util.selector.select(self.config.paginator_selector);
                    $paginator.empty();
                    if (self.__init_params.paginator) {
                        self.__templater.http_get(self.__init_params.paginator.template.directory, function($template) {
                            $paginator.append($template);
                            requirejs([self.__init_params.paginator.controller.file], function(paginator) {
                                paginator.init(self.__init_params.paginator);
                                self.__paginator = paginator;
                                callback();
                            });
                        });
                    } else {
                        callback();
                    }
                },
                _init_posts: function() {
                    self.__logger.log("_init_posts");
                    var $posts = util.selector.select(self.config.posts_selector);
                    $posts.empty();
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
                                $template.attr("id", "post-" + post_config.id);
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
                                    $posts.append(post_config.__$template);
                                    post_config.__controller.init($.extend(post_config, {
                                        selector_prefix: "#post-" + post_config.id + " ",
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