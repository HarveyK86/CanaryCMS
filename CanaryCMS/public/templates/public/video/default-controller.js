/* global $ */
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
                    name: "video/default-controller",
                    debug: false,
                    templates: {
                        video_template: {
                            selector: "[name='video-template']",
                            attribute: "__video",
                        },
                    },
                    video_container_selector: "[name='video-container']",
                }
            };
            var inst = $.extend(self, {
                _init: function(init_params) {
                    self.__logger = logger.get_logger(self);
                    self.__logger.log("_init[init_params]", init_params);
                    self.__init_params = init_params;
                    self.__templater = templater.get_templater(self);
                    self.__templater.init_templates(self.__init_params.selector_prefix);
                    self._init_video_container();
                },
                _init_video_container: function() {
                    self.__logger.log("_init_video_container");
                    var $video_container = selector.select(self.__init_params.selector_prefix + self.config.video_container_selector);
                    $video_container.empty();
                    var $html = self.__templater.render(self.config.templates.video_template, {
                        video: self.__init_params,
                    });
                    $video_container.append($html);
                },
            });
            inst._init(init_params);
            return inst;
        },
    };
});