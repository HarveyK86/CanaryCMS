/* global requirejs, $, s */
requirejs(["util-package", "service/config"], function(util, config) {
    var self = {
        config: {
            name: "index",
            debug: false,
            title_tag_selector: "title",
            title_tag_delimiter: " | ",
            title_tag_suffix: "Powered by CanaryCMS",
            header_slot_selector: "#header-slot",
            page_slot_selector: "#page-slot",
            sidebar_slot_selector_suffix: "-sidebar-slot",
            footer_slot_selector: "#footer-slot",
        }
    };
    var inst = $.extend(self, {
        init: function() {
            self.__logger = util.logger.get_logger(self);
            config.api_get(function(init_params) {
                self.__init_params = init_params;
                self.__logger.log("init", self.__init_params);
                self.__templater = util.templater.get_templater(self);
                self._init_header_slot();
                self._init_page_slot();
                self._init_sidebar_slots();
                self._init_footer_slot();
            });
        },
        _init_header_slot: function() {
            self.__logger.log("_init_header_slot");
            var $header_slot = util.selector.select(self.config.header_slot_selector);
            $header_slot.empty();
            self.__templater.http_get(self.__init_params.header.template.directory, function($template) {
                $header_slot.append($template);
                requirejs([self.__init_params.header.controller.file], function(header) {
                    header.init($.extend(self.__init_params.header, {
                        selector_prefix: self.config.header_slot_selector + " ",
                    }));
                });
            });
        },
        _init_page_slot: function() {
            self.__logger.log("_init_page_slot");
            var $page_slot = util.selector.select(self.config.page_slot_selector);
            var init_page = function() {
                $page_slot.empty();
                if (util.query.has_hash()) {
                    var hash = util.query.get_hash();
                    self.__init_params.header.pages.forEach(function(page_config) {
                        if (hash === "#" + s.slugify(page_config.name)) {
                            self.__templater.http_get(page_config.template.directory, function($template) {
                                $page_slot.append($template);
                                requirejs([page_config.controller.file], function(page) {
                                    self.__page = page.init($.extend(page_config, {
                                        selector_prefix: self.config.page_slot_selector + " ",
                                    }));
                                });
                                var $title_tag = util.selector.select(self.config.title_tag_selector);
                                $title_tag.empty();
                                $title_tag.append(page_config.name + self.config.title_tag_delimiter + self.config.title_tag_suffix);
                            });
                        }
                    });
                } else {
                    util.query.set_hash("#" + s.slugify(self.__init_params.header.pages[0].name));
                }
            };
            util.listener.add_onhashchange(self.config.name, function() {
                if (self.__page) self.__page.destroy();
                init_page();
            });
            init_page();
            var data = $page_slot.data();
            self.__col = data.col;
            self.__max_width = data.maxWidth;
        },
        _init_sidebar_slots: function() {
            self.__logger.log("_init_sidebar_slots");
            ["left", "right"].forEach(function(side) {
                self._init_sidebar_slot(side, self.__init_params[side + "_sidebar"]);
            });
            if (self.__max_width) {
                util.selector.select(self.config.page_slot_selector).addClass(self.__col + "-" + self.__max_width);
            }
        },
        _init_sidebar_slot: function(side, sidebar_config) {
            self.__logger.log("_init_sidebar_slot[side, sidebar_config]", [side, sidebar_config]);
            var $sidebar_slot = util.selector.select("#" + side + self.config.sidebar_slot_selector_suffix);
            $sidebar_slot.empty();
            if (sidebar_config) {
                var data = $sidebar_slot.data();
                $sidebar_slot.addClass(data.col + "-" + data.width);
                if (self.__max_width) self.__max_width -= data.width;
                self.__templater.http_get(sidebar_config.template.directory, function($template) {
                    $sidebar_slot.append($template);
                    requirejs([sidebar_config.controller.file], function(sidebar) {
                        sidebar.init($.extend(sidebar_config, {
                            selector_prefix: "#" + side + self.config.sidebar_slot_selector_suffix + " ",
                        }));
                    });
                });
            } else {
                $sidebar_slot.remove();
            }
        },
        _init_footer_slot: function() {
            self.__logger.log("_init_footer_slot");
            var $footer_slot = util.selector.select(self.config.footer_slot_selector);
            $footer_slot.empty();
            self.__templater.http_get(self.__init_params.footer.template.directory, function($template) {
                $footer_slot.append($template);
                requirejs([self.__init_params.footer.controller.file], function(footer) {
                    footer.init($.extend(self.__init_params.footer, {
                        selector_prefix: self.config.footer_slot_selector + " ",
                    }));
                });
            });
        },
    });
    inst.init();
});