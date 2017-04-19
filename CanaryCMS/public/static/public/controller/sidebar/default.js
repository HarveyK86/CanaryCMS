/* global $, _ */
define([], function() {
    var self = {
        config: {
            debug: false,
            templates: [{
                selector: "#sidebar-name-template",
                attribute: "sidebar_name",
            }],
            sidebar_name_selector: "#sidebar-name",
        }
    };
    return $.extend(self, {
        init: function(init_params) {
            self._log("init[init_params]", init_params);
            self.__init_params = init_params;
            self._init_templates();
            self._init_sidebar_name();
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
        _init_sidebar_name: function() {
            self._log("_init_sidebar_name");
            var $sidebar_name = $(self.config.sidebar_name_selector);
            if (!$sidebar_name.length) {
                console.error("Could not locate " + self.config.sidebar_name_selector);
                return;
            }
            $sidebar_name.empty();
            var html = self.sidebar_name({
                sidebar_name: self.__init_params.name
            });
            var $html = $(html);
            $sidebar_name.append($html);
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