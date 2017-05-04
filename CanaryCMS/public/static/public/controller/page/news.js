/* global requirejs, $ */
define([
    "util/logger",
    "util/templater",
    "util/selector",
    "service/post"
], function(
    logger,
    templater,
    selector,
    post
) {
    var self = {
        config: {
            name: "page/news",
            debug: false,
            posts_selector: "#posts",
            interval_tick: 0,
        }
    };
    return $.extend(self, {
        init: function(init_params) {
            self.__logger = logger.get_logger(self);
            self.__logger.log("init[init_params]", init_params);
            self.__init_params = init_params;
            self.__templater = templater.get_templater(self);
            self._init_posts();
        },
        _init_posts: function() {
            self.__logger.log("_init_posts");
            var $posts = selector.select(self.config.posts_selector);
            $posts.empty();
            post.api_get(function(post_configs) {
                var out = post_configs.length;
                post_configs.forEach(function(post_config) {
                    self.__templater.http_get(post_config.template.file, function($template) {
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
});