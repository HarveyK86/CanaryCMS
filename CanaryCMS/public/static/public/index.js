/* global requirejs, $, s */
requirejs(["util/parser"], function(parser) {
    $.get({
        url: "config",
        success: function(response_array) {
            parser.parse_response_array(response_array, function(parsed_array) {
                var config = parsed_array[0];
                var selector = "#header";
                var $header = $(selector);
                var template_prefix = "/static/public/";
                if ($header.length) {
                    $.get({
                        url: template_prefix + config.header.template.file,
                        success: function(response) {
                            var $template = $(response);
                            $header.empty();
                            $header.append($template);
                            requirejs([config.header.controller.file], function(header) {
                                header.init(config.header);
                            });
                        }
                    });
                } else {
                    console.error("Could not locate " + selector);
                }
                selector = "#page";
                var $page = $(selector);
                if ($page.length) {
                    var onhashchange = function() {
                        $page.empty();
                        if (window.location.hash) {
                            config.header.pages.forEach(function(page_config) {
                                if (window.location.hash === "#" + s.slugify(page_config.name)) {
                                    $.get({
                                        url: template_prefix + page_config.template.file,
                                        success: function(response) {
                                            var $template = $(response);
                                            $page.append($template);
                                            requirejs([page_config.controller.file], function(page) {
                                                page.init(page_config);
                                            });
                                        }
                                    })
                                }
                            });
                        }
                    };
                    window.onhashchange = function() {
                        onhashchange();
                    };
                    onhashchange();
                } else {
                    console.error("Could not locate " + selector);
                }
                selector = "#footer";
                var $footer = $(selector);
                if ($footer.length) {
                    $.get({
                        url: template_prefix + config.footer.template.file,
                        success: function(response) {
                            var $template = $(response);
                            $footer.empty();
                            $footer.append($template);
                            requirejs([config.footer.controller.file], function(footer) {
                                footer.init(config.footer);
                            });
                        }
                    });
                } else {
                    console.error("Could not locate " + selector);
                }
    
            });
        }
    });
});