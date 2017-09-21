/* global requirejs, $ */
define(["util-package"], function(util) {
    return {
        init: function(init_params) {
            var self = {
                config: {
                    name: "post/default-controller",
                    debug: false,
                    templates: {
                        post_template: {
                            selector: "#post-template",
                            attribute: "__post",
                        },
                    },
                    post_template_container_selector: "[name='post-template-container']",
                    video_list_selector: "[name='video-list']",
                    category_list_selector: "[name='category-list']",
                    interval_tick: 0,
                }
            };
            var inst = $.extend(self, {
                _init: function(init_params) {
                    self.__logger = util.logger.get_logger(self);
                    self.__logger.log("_init[init_params]", init_params);
                    self.__init_params = init_params;
                    self.__templater = util.templater.get_templater(self);
                    self.__templater.init_templates();
                    self._init_post_template_container();
                    self._init_video_list();
                    self._init_category_list();
                },
                _init_post_template_container: function() {
                    self.__logger.log("_init_post_template_container");
                    self.__templater.render_to_container(
                        self.config.templates.post_template,
                        self.__init_params.selector_prefix + self.config.post_template_container_selector, {
                            post: self.__init_params,
                        }
                    );
                },
                _init_video_list: function() {
                    self.__logger.log("_init_video_list");
                    var $video_list = util.selector.select(self.__init_params.selector_prefix + self.config.video_list_selector);
                    $video_list.empty();
                    var out = self.__init_params.videos.length;
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
                                    $video_list.append(video_config.__$template);
                                    video_config.__controller.init($.extend(video_config, {
                                        selector_prefix: self.__init_params.selector_prefix + "[name='video-" + video_config.id + "'] ",
                                    }));
                                });
                            }
                        }, self.config.interval_tick);
                    }
                },
                _init_category_list: function() {
                    self.__logger.log("_init_category_list");
                    var out = self.__init_params.categories.length;
                    if (out) {
                        var $category_list = util.selector.select(self.__init_params.selector_prefix + self.config.category_list_selector);
                        $category_list.empty();
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
                                    $category_list.append(category_config.__$template);
                                    category_config.__controller.init($.extend(category_config, {
                                        selector_prefix: self.__init_params.selector_prefix + "[name='category-" + category_config.id + "'] ",
                                        filter_key: self.__init_params.filter_key,
                                        default_filter: self.__init_params.default_filter,
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