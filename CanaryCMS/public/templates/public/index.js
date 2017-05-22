/* global requirejs, $, s */
requirejs(["util-package", "service/config"], function(util, config) {
    var self = {
        config: {
            name: "index",
            debug: false,
        }
    };
    var inst = $.extend(self, {
        init: function() {
            self.__logger = util.logger.get_logger(self);
            config.api_get(function(init_params) {
                self.__init_params = init_params;
                self.__logger.log("init", self.__init_params);
                self.__templater = util.templater.get_templater(self);
                self._init_header();
                self._init_page();
                self._init_sidebars();
                self._init_footer();
            });
        },
        _init_header: function() {
            self.__logger.log("_init_header");
            var $header = util.selector.select("#header");
            $header.empty();
            self.__templater.http_get(self.__init_params.header.template.directory, function($template) {
                $header.append($template);
                requirejs([self.__init_params.header.controller.file], function(header) {
                    header.init(self.__init_params.header);
                });
            });
        },
        _init_page: function() {
            self.__logger.log("_init_page");
            var $page = util.selector.select("#page");
            var init_page = function() {
                $page.empty();
                if (util.query.has_hash()) {
                    var hash = util.query.get_hash();
                    self.__init_params.header.pages.forEach(function(page_config) {
                        if (hash === "#" + s.slugify(page_config.name)) {
                            self.__templater.http_get(page_config.template.directory, function($template) {
                                $page.append($template);
                                requirejs([page_config.controller.file], function(page) {
                                    page.init(page_config);
                                });
                            });
                        }
                    });
                } else {
                    util.query.set_hash("#" + s.slugify(self.__init_params.header.pages[0].name));
                }
            };
            util.listener.add_onhashchange(self.config.name, init_page);
            init_page();
            var data = $page.data();
            self.__col = data.col;
            self.__max_width = data.maxWidth;
        },
        _init_sidebars: function() {
            self.__logger.log("_init_sidebars");
            ["left", "right"].forEach(function(side) {
                self._init_sidebar(side, self.__init_params[side + "_sidebar"]);
            });
            if (self.__max_width) {
                util.selector.select("#page").addClass(self.__col + "-" + self.__max_width);
            }
        },
        _init_sidebar: function(side, sidebar_config) {
            self.__logger.log("_init_sidebar[side, sidebar_config]", [side, sidebar_config]);
            var $sidebar = util.selector.select("#" + side + "-sidebar");
            $sidebar.empty();
            if (sidebar_config) {
                var data = $sidebar.data();
                $sidebar.addClass(data.col + "-" + data.width);
                if (self.__max_width) self.__max_width -= data.width;
                self.__templater.http_get(sidebar_config.template.directory, function($template) {
                    $sidebar.append($template);
                    requirejs([sidebar_config.controller.file], function(sidebar) {
                        sidebar.init(sidebar_config);
                    });
                });
            } else {
                $sidebar.remove();
            }
        },
        _init_footer: function() {
            self.__logger.log("_init_footer");
            var $footer = util.selector.select("#footer");
            $footer.empty();
            self.__templater.http_get(self.__init_params.footer.template.directory, function($template) {
                $footer.append($template);
                requirejs([self.__init_params.footer.controller.file], function(footer) {
                    footer.init(self.__init_params.footer);
                });
            });
        },
    });
    inst.init();
});