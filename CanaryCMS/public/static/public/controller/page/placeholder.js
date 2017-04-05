/* global $, _ */
define([], function() {
    var self = {
        config: {
            debug: false,
            templates: [{
                selector: "#name-template",
                attribute: "name",
            }],
            name_selector: "#name",
        }
    };
    return $.extend(self, {
        init: function(init_params) {
            self._log("init[init_params]", init_params);
            self.__init_params = init_params;
            self._init_templates();
            self._init_name();
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
        _init_name: function() {
            self._log("_init_name");
            var $name = $(self.config.name_selector);
            if (!$name.length) {
                console.error("Could not locate " + self.config.name_selector);
                return;
            }
            $name.empty();
            var html = self.name({
                name: self.__init_params.name
            });
            var $html = $(html);
            $name.append($html);
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