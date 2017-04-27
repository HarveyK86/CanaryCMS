/* global $, _ */
define([], function() {
    var self = {
        config: {
            debug: false,
            templates: [{
                selector: "[name='post-template']",
                attribute: "post",
            }],
            post_container_selector: "[name='post-container']",
        }
    };
    return $.extend(self, {
        init: function(init_params) {
            self._log("init[init_params]", init_params);
            self.__init_params = init_params;
            self._init_templates();
            self._init_post_container();
        },
        _init_templates: function() {
            self._log("_init_templates");
            self.config.templates.forEach(function(template_config) {
                var selector = self.__init_params.selector_prefix + template_config.selector;
                var $template = $(selector);
                if (!$template.length) {
                    console.error("Could not locate " + selector);
                    return;
                } else if ($template.length != 1) {
                    console.error("Multiple versions of " + selector + " located");
                    return;
                }
                var html = $template.html();
                self[template_config.attribute] = _.template(html);
            });
        },
        _init_post_container: function() {
            self._log("_init_post_container");
            var selector = self.__init_params.selector_prefix + self.config.post_container_selector;
            var $post_container = $(selector);
            if (!$post_container.length) {
                console.error("Could not locate " + selector);
                return;
            } else if ($post_container.length != 1) {
                console.error("Multiple versions of " + selector + " located");
                return;
            }
            var html = self.post({
                post: self.__init_params,
            });
            var $html = $(html);
            $post_container.append($html);
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