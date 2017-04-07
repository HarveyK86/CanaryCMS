/* global $, _ */
define(["util/parser"], function(parser) {
    var self = {
        config: {
            debug: false,
            templates: [{
                selector: "#post-template",
                attribute: "post",
            }],
            posts_selector: "#posts",
        }
    };
    return $.extend(self, {
        init: function(init_params) {
            self._log("init[init_params]", init_params);
            self.__init_params = init_params;
            self._init_templates();
            self._init_posts();
        },
        _init_templates: function() {
            self._log("_init_templates");
            self.config.templates.forEach(function(template_config) {
                var $template = $(template_config.selector);
                if (!$template.length) {
                    console.error("Could not locate " + template_config.selector);
                    return;
                }
                var html = $template.html();
                self[template_config.attribute] = _.template(html);
            });
        },
        _init_posts: function() {
            self._log("_init_posts");
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
                        parsed_array.forEach(function(post) {
                            var html = self.post({
                                post: post
                            });
                            var $html = $(html);
                            $posts.append($html);
                        });
                    });
                }
            });
        },
        _log: function(message, args) {
            if (self.config.debug) {
                if (args) {
                    console.info(message, args);
                } else {
                    console.info(message);
                }
            }
        }
    });
});