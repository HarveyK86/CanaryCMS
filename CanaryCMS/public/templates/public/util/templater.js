/* global $, _ */
define(["util/cache", "util/logger", "util/selector"], function(cache, logger, selector) {
    var self = {
        config: {
            name: "templater",
            debug: false,
            url_prefix: "/public/",
            style_suffix: "/style.css",
            templates_suffix: "/templates.html",
            view_suffix: "/view.html",
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
                init_templates: function() {
                    self._init_templates(other);
                },
                render: function(template_config, params) {
                    return self._render(other, template_config, params);
                },
                render_to_container: function(template_config, container_selector, params) {
                    return self._render_to_container(other, template_config, container_selector, params);
                },
                http_get: function(template_directory, callback) {
                    return self._http_get(other, template_directory, callback);
                },
            };
            self.__logger.log("get_templater returning", templater);
            return templater;
        },
        _init_templates: function(other) {
            self.__logger.log("_init_templates[other]", other);
            for (var template in other.config.templates) {
                self._init_template(other, other.config.templates[template]);
            }
        },
        _init_template: function(other, template_config) {
            self.__logger.log("_init_template[other, template_config]", [other, template_config]);
            other[template_config.attribute] = _.template(selector.select(template_config.selector).html());
        },
        _render: function(other, template_config, params) {
            self.__logger.log("_render[template_config, params]", [template_config, params]);
            var $html = $(other[template_config.attribute](params));
            self.__logger.log("_render returning", $html);
            return $html;
        },
        _render_to_container: function(other, template_config, container_selector, params) {
            self.__logger.log("_render_to_container[other, template_config, container_selector, params]", [other, template_config, container_selector, params]);
            var $container = selector.select(container_selector);
            $container.empty();
            $container.append(self._render(other, template_config, params));
        },
        _http_get: function(other, template_directory, callback) {
            self.__logger.log("_http_get[other, template_directory, callback]", [other, template_directory, callback]);
            var $link = $("link[name='" + template_directory + "']");
            var $head = selector.select("head");
            if (!$link.length) {
                $link = $("<link>");
                $link.attr("rel", "stylesheet");
                $link.attr("name", template_directory);
                $link.attr("href", self.config.url_prefix + template_directory + self.config.style_suffix);
                $head.append($link);
            }
            cache.get(self.config.url_prefix + template_directory + self.config.templates_suffix, function(response) {
                var $templates = $(response);
                $templates.find("script").each(function() {
                    var $template = $(this)[0];
                    if (!$("script#" + $template.id).length) {
                        $head.append($template);
                    }
                });
            });
            cache.get(self.config.url_prefix + template_directory + self.config.view_suffix, function(response) {
                var $view = $(response);
                self.__logger.log("_http_get returning", $view);
                setTimeout(function() {
                    callback($view);
                }, 0);
            });
        },
    });
    inst.init();
    return inst;
});