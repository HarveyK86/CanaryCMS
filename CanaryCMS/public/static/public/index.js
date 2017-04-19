/* global requirejs, $, s */
requirejs(["util/parser"], function(parser) {
    $.get({
        url: "config",
        success: function(response_array) {
            parser.parse_response_array(response_array, function(parsed_array) {
                var config = parsed_array[0];
                if (false) console.error(config);
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
                var maxWidth;
                if ($page.length) {
                    var data = $page.data();
                    maxWidth = data.maxWidth;
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
                                    });
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
                ["left", "right"].forEach(function(side) {
                    selector = "#" + side + "-sidebar";
                    var $sidebar = $(selector);
                    if ($sidebar.length) {
                        if (config[side + "_sidebar"]) {
                            var data = $sidebar.data();
                            var width = data.width;
                            $sidebar.addClass("col-xs-" + width);
                            if (maxWidth) maxWidth -= width;
                            $.get({
                                url: template_prefix + config[side + "_sidebar"].template.file,
                                success: function(response) {
                                    var $template = $(response);
                                    $sidebar.empty();
                                    $sidebar.append($template);
                                    requirejs([config[side + "_sidebar"].controller.file], function(sidebar) {
                                        sidebar.init($.extend(config[side + "_sidebar"], {
                                            side: side,
                                        }));
                                    });
                                }
                            });
                        } else {
                            $sidebar.remove();
                        }
                    } else {
                        console.error("Could not locate " + selector);
                    }
                });
                if (maxWidth) {
                    $page.addClass("col-xs-" + maxWidth);
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