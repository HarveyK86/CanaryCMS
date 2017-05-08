/* global $, _ */
define([
    "util/logger",
    "util/selector"
], function(
    logger,
    selector
) {
    var self = {
        config: {
            name: "templater",
            debug: false,
            url_prefix: "/public/",
            url_suffix: "/view.html",
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
                http_get: function(template_directory, callback) {
                    return self._http_get(other, template_directory, callback);
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
            var $template = selector.select(selector_prefix + template_config.selector);
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
        _http_get: function(other, template_directory, callback) {
            self.__logger.log("_http_get[other, template_directory, callback]", [other, template_directory, callback]);
            $.get({
                url: self.config.url_prefix + template_directory + self.config.url_suffix,
                success: function(response) {
                    var $template = $(response);
                    self.__logger.log("_http_get returning", $template);
                    callback($template);
                },
            });
        },
    });
    inst.init();
    return inst;
});