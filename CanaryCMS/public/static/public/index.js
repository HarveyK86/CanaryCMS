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
                    var init_page = function() {
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
                    var onhashchange = window.onhashchange;
                    window.onhashchange = function() {
                        if (onhashchange) onhashchange();
                        init_page();
                    };
                    init_page();
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