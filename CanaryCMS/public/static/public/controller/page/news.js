/* global requirejs, $ */
define(["util/logger", "util/parser"], function(logger, parser) {
    var self = {
        config: {
            name: "page/news",
            debug: false,
            posts_selector: "#posts",
        }
    };
    return $.extend(self, {
        init: function(init_params) {
            self.__logger = logger.get_logger(self);
            self.__logger.log("init[init_params]", init_params);
            self.__init_params = init_params;
            self._init_posts();
        },
        _init_posts: function() {
            self.__logger.log("_init_posts");
            var $posts = $(self.config.posts_selector);
            if (!$posts.length) {
                console.error("Could not locate " + self.config.posts_selector);
                return;
            }
            $posts.empty();
            $.get({
                url: "post",
                success: function(response_array) {
                    parser.parse_response_array(response_array, function(parsed_array) {
                        parsed_array.forEach(function(post_config) {
                            $.get({
                                url: self.__init_params.template_prefix + post_config.template.file,
                                success: function(response) {
                                    var $template = $(response);
                                    $template.attr("id", "post-" + post_config.id);
                                    $posts.append($template);
                                    requirejs([post_config.controller.file], function(post) {
                                        post.init($.extend(post_config, {
                                            selector_prefix: "#post-" + post_config.id + " ",
                                        }));
                                    });
                                },
                            });
                        });
                    });
                }
            });
        },
    });
});