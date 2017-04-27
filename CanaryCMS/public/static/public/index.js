/* global requirejs, $, s */
requirejs(["util/logger", "util/parser"], function(logger, parser) {
    var self = {
        config: {
            name: "index",
            debug: false,
            template_prefix: "/static/public/",
        }
    };
    var inst = $.extend(self, {
        init: function() {
            self.__logger = logger.get_logger(self);
            $.get({
                url: "config",
                success: function(response_array) {
                    parser.parse_response_array(response_array, function(parsed_array) {
                        self.__init_params = parsed_array[0];
                        self.__logger.log("init", self.__init_params);
                        self._init_header();
                        self._init_page();
                        self._init_sidebars();
                        self._init_footer();
                    });
                },
            });
        },
        _init_header: function() {
            self.__logger.log("_init_header");
            var selector = "#header";
            var $header = $(selector);
            if ($header.length) {
                $.get({
                    url: self.config.template_prefix + self.__init_params.header.template.file,
                    success: function(response) {
                        var $template = $(response);
                        $header.empty();
                        $header.append($template);
                        requirejs([self.__init_params.header.controller.file], function(header) {
                            header.init(self.__init_params.header);
                        });
                    },
                });
            } else {
                console.error("Could not locate " + selector);
            }
        },
        _init_page: function() {
            self.__logger.log("_init_page");
            var selector = "#page";
            var $page = $(selector);
            if ($page.length) {
                var data = $page.data();
                self.__col = data.col;
                self.__max_width = data.maxWidth;
                var init_page = function() {
                    $page.empty();
                    if (window.location.hash) {
                        self.__init_params.header.pages.forEach(function(page_config) {
                            if (window.location.hash === "#" + s.slugify(page_config.name)) {
                                $.get({
                                    url: self.config.template_prefix + page_config.template.file,
                                    success: function(response) {
                                        var $template = $(response);
                                        $page.append($template);
                                        requirejs([page_config.controller.file], function(page) {
                                            page.init($.extend(page_config, {
                                                template_prefix: self.config.template_prefix,
                                            }));
                                        });
                                    },
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
        },
        _init_sidebars: function() {
            ["left", "right"].forEach(function(side) {
                self.__logger.log("_init_sidebars", side);
                var selector = "#" + side + "-sidebar";
                var $sidebar = $(selector);
                if ($sidebar.length) {
                    if (self.__init_params[side + "_sidebar"]) {
                        var data = $sidebar.data();
                        var width = data.width;
                        $sidebar.addClass(data.col + "-" + width);
                        if (self.__max_width) self.__max_width -= width;
                        $.get({
                            url: self.config.template_prefix + self.__init_params[side + "_sidebar"].template.file,
                            success: function(response) {
                                var $template = $(response);
                                $sidebar.empty();
                                $sidebar.append($template);
                                requirejs([self.__init_params[side + "_sidebar"].controller.file], function(sidebar) {
                                    sidebar.init($.extend(self.__init_params[side + "_sidebar"], {
                                        template_prefix: self.config.template_prefix,
                                        side: side,
                                    }));
                                });
                            },
                        });
                    } else {
                        $sidebar.remove();
                    }
                } else {
                    console.error("Could not locate " + selector);
                }
            });
            if (self.__max_width) {
                var selector = "#page";
                var $page = $(selector);
                if ($page.length) {
                    $page.addClass(self.__col + "-" + self.__max_width);
                } else {
                    console.error("Could not locate " + selector);
                }
            }
        },
        _init_footer: function() {
            self.__logger.log("_init_footer");
            var selector = "#footer";
            var $footer = $(selector);
            if ($footer.length) {
                $.get({
                    url: self.config.template_prefix + self.__init_params.footer.template.file,
                    success: function(response) {
                        var $template = $(response);
                        $footer.empty();
                        $footer.append($template);
                        requirejs([self.__init_params.footer.controller.file], function(footer) {
                            footer.init(self.__init_params.footer);
                        });
                    },
                });
            } else {
                console.error("Could not locate " + selector);
            }
        },
    });
    inst.init();
});