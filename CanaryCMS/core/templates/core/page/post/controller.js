/* global requirejs, $ */
define(["util-package", "service/post"], function(util, post) {
    return {
        init: function(init_params) {
            var self = {
                config: {
                    name: "page/post/controller",
                    debug: true,
                    post_slot_selector: "[name='post-slot']",
                    post_key: "p",
                    default_post: null,
                }
            };
            var inst = $.extend(self, {
                _init: function(init_params) {
                    self.__logger = util.logger.get_logger(self);
                    self.__logger.log("_init[init_params", init_params);
                    self.__init_params = init_params;
                    self.__templater = util.templater.get_templater(self);
                    self._init_post_slot();
                },
                destroy: function() {
                    self.__logger.log("destroy");
                    ["__logger", "__init_params", "__templater"].forEach(function(element) {
                        self[element] = undefined;
                    });
                },
                _init_post_slot: function() {
                    self.__logger.log("_init_post_slot");
                    var $post_slot = util.selector.select(self.__init_params.selector_prefix + self.config.post_slot_selector);
                    $post_slot.empty();
                    var post_id = parseInt(util.query.get_param(self.config.post_key, self.config.default_post), 10);
                    post.api_get_single(post_id, function(post_config) {
                        self.__templater.http_get(post_config.template.directory, function($template) {
                            $template.attr("name", "post-" + post_config.id);
                            requirejs([post_config.controller.file], function(controller) {
                                $post_slot.append($template);
                                controller.init($.extend(post_config, {
                                    selector_prefix: self.__init_params.selector_prefix + "[name='post-" + post_config.id + "'] ",
                                }));
                            });
                        });
                    });
                },
            });
            inst._init(init_params);
            return inst;
        }
    };
});