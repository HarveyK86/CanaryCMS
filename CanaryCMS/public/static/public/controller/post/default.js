/* global $ */
define(["util/logger", "util/templater"], function(logger, templater) {
    var self = {
        config: {
            name: "post/default",
            debug: false,
            templates: {
                post_template: {
                    selector: "[name='post-template']",
                    attribute: "__post",
                },
            },
            post_container_selector: "[name='post-container']",
        }
    };
    return $.extend(self, {
        init: function(init_params) {
            self.__logger = logger.get_logger(self);
            self.__logger.log("init[init_params]", init_params);
            self.__init_params = init_params;
            self.__templater = templater.get_templater(self);
            self.__templater.init_templates(self.__init_params.selector_prefix);
            self._init_post_container();
        },
        _init_post_container: function() {
            self.__logger.log("_init_post_container");
            var selector = self.__init_params.selector_prefix + self.config.post_container_selector;
            var $post_container = $(selector);
            if (!$post_container.length) {
                console.error("Could not locate " + selector);
                return;
            } else if ($post_container.length != 1) {
                console.error("Multiple versions of " + selector + " located");
                return;
            }
            var $html = self.__templater.render(self.config.templates.post_template, {
                post: self.__init_params,
            });
            $post_container.append($html);
        },
    });
});