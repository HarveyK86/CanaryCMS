/* global $, _ */
define(["util/logger"], function(logger) {
    var self = {
        config: {
            name: "templater",
            debug: false,
        }
    };
    var inst = $.extend(self, {
        init: function() {
            self.__logger = logger.get_logger(self);
            self.__logger.log("init");
        },
        get_templater: function(other) {
            self.__logger.log("get_templater[other]", other);
            var templater = {
                init_templates: function(selector_prefix) {
                    self._init_templates(other, selector_prefix);
                },
                render: function(template_config, selector_prefix) {
                    return self._render(other, template_config, selector_prefix);
                },
            };
            self.__logger.log("get_templater returning", templater);
            return templater;
        },
        _init_templates: function(other, selector_prefix) {
            self.__logger.log("_init_templates[other, selector_prefix]", [other, selector_prefix]);
            if (!selector_prefix) selector_prefix = "";
            for (var template in other.config.templates) {
                self._init_template(other, other.config.templates[template], selector_prefix);
            }
        },
        _init_template: function(other, template_config, selector_prefix) {
            self.__logger.log("_init_template[other, template_config]", [other, template_config]);
            var selector = selector_prefix + template_config.selector;
            var $template = $(selector);
            if (!$template.length) {
                console.error("Could not locate " + selector);
                return;
            } else if (!$template.length > 1) {
                console.error("Multiple occurances of " + selector + " located");
                return;
            }
            var html = $template.html();
            other[template_config.attribute] = _.template(html);
        },
        _render: function(other, template, params) {
            self.__logger.log("_render[template, params]", [template, params]);
            var html = other[template.attribute](params);
            var $html = $(html);
            self.__logger.log("_render returning", $html);
            return $html;
        },
    });
    inst.init();
    return inst;
});