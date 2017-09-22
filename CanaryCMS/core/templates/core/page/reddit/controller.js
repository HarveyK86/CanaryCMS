/* global requirejs, $ */
define(["util-package", "service/reddit"], function(util, reddit) {
    return {
        init: function(init_params) {
            var self = {
                config: {
                    name: "page/reddit/controller",
                    debug: false,
                    templates: {
                        reddit_post_template: {
                            selector: "#reddit-post-template",
                            attribute: "__reddit_post",
                        },
                    },
                    reddit_post_list_selector: "[name='reddit-post-list']",
                    paginator_slot_selector: "[name='paginator-slot']",
                }
            };
            var inst = $.extend(self, {
                _init: function(init_params) {
                    self.__logger = util.logger.get_logger(self);
                    self.__logger.log("init[init_params]", init_params);
                    self.__init_params = init_params;
                    self.__templater = util.templater.get_templater(self);
                    self.__templater.init_templates();
                    self._init_paginator_slot(function() {
                        util.listener.add_onquerychange(self.config.name, function(params) {
                            if (self.__paginator && (
                                    params.includes(self.__paginator.get_before_key()) ||
                                    params.includes(self.__paginator.get_after_key()) ||
                                    params.includes(self.__paginator.get_page_size_key())
                                )) {
                                self._init_reddit_post_list();
                            }
                        });
                        self._init_reddit_post_list();
                    });
                },
                destroy: function() {
                    self.__logger.log("destroy");
                    util.listener.remove_listeners(self.config.name);
                    if (self.__paginator) self.__paginator.destroy();
                    ["__logger", "__init_params", "__templater", "__paginator"].forEach(function(element) {
                        self[element] = undefined;
                    });
                },
                _init_paginator_slot: function(callback) {
                    self.__logger.log("_init_paginator_slot[callback]", callback);
                    var $paginator_slot = util.selector.select(self.__init_params.selector_prefix + self.config.paginator_slot_selector);
                    $paginator_slot.empty();
                    if (self.__init_params.paginator) {
                        self.__templater.http_get(self.__init_params.paginator.template.directory, function($template) {
                            $paginator_slot.append($template);
                            requirejs([self.__init_params.paginator.controller.file], function(paginator) {
                                self.__paginator = paginator.init($.extend(self.__init_params.paginator, {
                                    selector_prefix: self.__init_params.selector_prefix,
                                }));
                                callback();
                            });
                        });
                    } else {
                        callback();
                    }
                },
                _init_reddit_post_list: function() {
                    self.__logger.log("_init_reddit_post_list");
                    var $reddit_post_list = util.selector.select(self.__init_params.selector_prefix + self.config.reddit_post_list_selector);
                    $reddit_post_list.empty();
                    var before;
                    var after;
                    var page_size;
                    var count;
                    if (self.__paginator) {
                        before = util.query.get_param(self.__paginator.get_before_key(), self.__paginator.get_default_before());
                        after = util.query.get_param(self.__paginator.get_after_key(), self.__paginator.get_default_after());
                        page_size = parseInt(util.query.get_param(self.__paginator.get_page_size_key(), self.__paginator.get_default_page_size()), 10);
                        count = parseInt(util.query.get_param(self.__paginator.get_count_key(), self.__paginator.get_default_count()), 10);
                    }
                    reddit.api_get(self.__init_params.template.parameters.subreddit, before, after, page_size, count, function(reddit_post_configs, paginator_before, paginator_after) {
                        if (self.__paginator) {
                            util.query.set_param(self.__paginator.get_paginator_before_key(), paginator_before);
                            util.query.set_param(self.__paginator.get_paginator_after_key(), paginator_after);
                        }
                        reddit_post_configs.forEach(function(reddit_post_config) {
                            $reddit_post_list.append(self.__templater.render(self.config.templates.reddit_post_template, {
                                reddit_post: $.extend(reddit_post_config, {
                                    "class": self.__init_params.template.parameters.class,
                                }),
                            }));
                        });
                    });
                },
            });
            inst._init(init_params);
            return inst;
        }
    };
});