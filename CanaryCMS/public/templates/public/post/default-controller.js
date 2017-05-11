/* global requirejs, $ */
define([
    "util/logger",
    "util/templater",
    "util/selector"
], function(
    logger,
    templater,
    selector
) {
    return {
        init: function(init_params) {
            var self = {
                config: {
                    name: "post/default-controller",
                    debug: false,
                    templates: {
                        post_template: {
                            selector: "[name='post-template']",
                            attribute: "__post",
                        },
                    },
                    post_container_selector: "[name='post-container']",
                    videos_selector: "[name='videos']",
                    categories_selector: "[name='categories']",
                    interval_tick: 0,
                }
            };
            var inst = $.extend(self, {
                _init: function(init_params) {
                    self.__logger = logger.get_logger(self);
                    self.__logger.log("_init[init_params]", init_params);
                    self.__init_params = init_params;
                    self.__templater = templater.get_templater(self);
                    self.__templater.init_templates(self.__init_params.selector_prefix);
                    self._init_post_container();
                    self._init_videos();
                    self._init_categories();
                },
                _init_post_container: function() {
                    self.__logger.log("_init_post_container");
                    var $post_container = selector.select(self.__init_params.selector_prefix + self.config.post_container_selector);
                    $post_container.empty();
                    var $html = self.__templater.render(self.config.templates.post_template, {
                        post: self.__init_params,
                    });
                    $post_container.append($html);
                },
                _init_videos: function() {
                    self.__logger.log("_init_videos");
                    var $videos = selector.select(self.__init_params.selector_prefix + self.config.videos_selector);
                    var out = self.__init_params.videos.length;
                    $videos.empty();
                    if (out) {
                        self.__init_params.videos.forEach(function(video_config) {
                            self.__templater.http_get(video_config.template.directory, function($template) {
                                $template.attr("name", "video-" + video_config.id);
                                video_config.__$template = $template;
                                requirejs([video_config.controller.file], function(controller) {
                                    video_config.__controller = controller;
                                    out--;
                                });
                            });
                        });
                        var interval = setInterval(function() {
                            if (out == 0) {
                                clearInterval(interval);
                                self.__init_params.videos.forEach(function(video_config) {
                                    $videos.append(video_config.__$template);
                                    video_config.__controller.init($.extend(video_config, {
                                        selector_prefix: self.__init_params.selector_prefix + " [name='video-" + video_config.id + "'] ",
                                    }));
                                });
                            }
                        }, self.config.interval_tick);
                    }
                },
                _init_categories: function() {
                    self.__logger.log("_init_categories");
                    var $categories = selector.select(self.__init_params.selector_prefix + self.config.categories_selector);
                    var out = self.__init_params.categories.length;
                    if (out) {
                        $categories.empty();
                        self.__init_params.categories.forEach(function(category_config) {
                            self.__templater.http_get(category_config.template.directory, function($template) {
                                $template.attr("name", "category-" + category_config.id);
                                category_config.__$template = $template;
                                requirejs([category_config.controller.file], function(controller) {
                                    category_config.__controller = controller;
                                    out--;
                                });
                            });
                        });
                        var interval = setInterval(function() {
                            if (out === 0) {
                                clearInterval(interval);
                                self.__init_params.categories.forEach(function(category_config) {
                                    $categories.append(category_config.__$template);
                                    category_config.__controller.init($.extend(category_config, {
                                        selector_prefix: self.__init_params.selector_prefix + " [name='category-" + category_config.id + "'] ",
                                    }));
                                });
                            }
                        }, self.config.interval_tick);
                    }
                },
            });
            inst._init(init_params);
            return inst;
        }
    };
});