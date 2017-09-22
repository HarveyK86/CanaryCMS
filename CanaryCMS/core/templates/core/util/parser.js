/* global $, _ */
define(["util/cache", "util/logger"], function(cache, logger) {
    var self = {
        config: {
            name: "parser",
            debug: false,
            models: [
                "style",
                "header",
                "left_sidebar",
                "right_sidebar",
                "paginator",
                "footer",
                "user",
                "template",
                "controller",
            ],
            model_arrays: {
                "widgets": "widget",
                "pages": "page",
                "posts": "post",
                "videos": "video",
                "categories": "category",
            },
            date_suffix: "datetime",
            parameters_field: "parameters",
            interval_tick: 0,
        }
    };
    var inst = $.extend(self, {
        init: function() {
            self.__logger = logger.get_logger(self);
            self.__logger.log("init");
        },
        parse_response_array: function(response_array, callback) {
            self.__logger.log("parse_response_array[response_array, callback]", [response_array, callback]);
            var out = 0;
            var parsed_array = [];
            for (var index = 0; index < response_array.length; index++) {
                out++;
                self._parse_response_item(index, response_array[index], function(parsed_index, parsed_item) {
                    parsed_array[parsed_index] = parsed_item;
                    out--;
                });
            }
            var interval = setInterval(function() {
                if (out === 0) {
                    clearInterval(interval);
                    self.__logger.log("parse_response_array returning", parsed_array);
                    callback(parsed_array);
                }
            }, self.config.interval_tick);
        },
        parse_reddit_response: function(reddit_response) {
            self.__logger.log("parse_reddit_response[reddit_response]", reddit_response);
            var parsed_array = [];
            for (var index = 0; index < reddit_response.data.children.length; index++) {
                parsed_array[index] = self._parse_reddit_response_item(reddit_response.data.children[index]);
            }
            var parsed_response = {
                before: reddit_response.data.before,
                reddit_posts: parsed_array,
                after: reddit_response.data.after,
            };
            self.__logger.log("parse_reddit_response returning", parsed_response);
            return parsed_response;
        },
        _parse_response_item: function(index, response_item, callback) {
            self.__logger.log("_parse_response_item[index, response_item, callback]", [index, response_item, callback]);
            var out = 0;
            var parsed_item = {
                id: response_item.pk,
            };
            for (var field in response_item.fields) {
                if (_.contains(self.config.models, field)) {
                    out++;
                    self._parse_field_item(field, response_item.fields[field], function(parsed_field, parsed_field_item) {
                        parsed_item[parsed_field] = parsed_field_item;
                        out--;
                    });
                } else if (_.has(self.config.model_arrays, field)) {
                    out++;
                    self._parse_field_array(field, response_item.fields[field], function(parsed_field, parsed_field_array) {
                        parsed_item[parsed_field] = parsed_field_array;
                        out--;
                    });
                } else if (field.endsWith(self.config.date_suffix)) {
                    out++;
                    self._parse_field_date(field, response_item.fields[field], function(parsed_field, parsed_field_date) {
                        parsed_item[parsed_field] = parsed_field_date;
                        out--;
                    });
                } else if (field === self.config.parameters_field) {
                    if (response_item.fields[field]) {
                        parsed_item[field] = JSON.parse(response_item.fields[field]);
                    }
                } else {
                    parsed_item[field] = response_item.fields[field];
                }
            }
            var interval = setInterval(function() {
                if (out === 0) {
                    clearInterval(interval);
                    self.__logger.log("_parse_response_item returning", parsed_item);
                    callback(index, parsed_item);
                }
            }, self.config.interval_tick);
        },
        _parse_reddit_response_item: function(reddit_response_item) {
            self.__logger.log("_parse_reddit_response_item[reddit_response_item] returning", [reddit_response_item, reddit_response_item.data]);
            return reddit_response_item.data;
        },
        _parse_field_item: function(field, field_item, callback) {
            self.__logger.log("_parse_field_item[field, field_item, callback]", [field, field_item, callback]);
            if (field_item) {
                cache.get(field + "/" + field_item, function(response_array) {
                    self.parse_response_array(response_array, function(parsed_array) {
                        self.__logger.log("_parse_field_item returning", parsed_array[0]);
                        callback(field, parsed_array[0]);
                    });
                });
            } else {
                callback(field);
            }
        },
        _parse_field_array: function(field, field_array, callback) {
            self.__logger.log("_parse_field_array[field, field_array, callback]", [field, field_array, callback]);
            var out = 0;
            var parsed_array = [];
            for (var index = 0; index < field_array.length; index++) {
                out++;
                self._parse_field_array_item(index, self.config.model_arrays[field], field_array[index], function(parsed_index, parsed_array_item) {
                    parsed_array[parsed_index] = parsed_array_item;
                    out--;
                });
            }
            var interval = setInterval(function() {
                if (out === 0) {
                    clearInterval(interval);
                    parsed_array.sort(function(a, b) {
                        var a_priorty = parseFloat(a.priority);
                        var b_priorty = parseFloat(b.priority);
                        var result = 0;
                        if (a_priorty) {
                            if (b_priorty) {
                                if (a_priorty < b_priorty) {
                                    result = -1;
                                } else if (b_priorty < a_priorty) {
                                    result = 1;
                                }
                            } else {
                                result = -1;
                            }
                        } else if (b_priorty) {
                            result = 1;
                        }
                        return result;
                    });
                    self.__logger.log("_parse_field_array returning", parsed_array);
                    callback(field, parsed_array);
                }
            }, self.config.interval_tick);
        },
        _parse_field_array_item: function(index, model, field_array_item, callback) {
            self.__logger.log("_parse_field_array_item[index, model, field_array_item, callback]", [index, model, field_array_item, callback]);
            cache.get(model + "/" + field_array_item, function(response_array) {
                self.parse_response_array(response_array, function(parsed_array) {
                    self.__logger.log("_parse_field_array_item returning", parsed_array[0]);
                    callback(index, parsed_array[0]);
                });
            });
        },
        _parse_field_date: function(field, field_date, callback) {
            self.__logger.log("_parse_field_date[field, field_item, callback]", [field, field_date, callback]);
            cache.get(self.config.date_suffix + "/" + encodeURIComponent(field_date), function(response_array) {
                self.parse_response_array(response_array, function(parsed_array) {
                    self.__logger.log("_parse_field_date returning", parsed_array[0]);
                    callback(field, parsed_array[0]);
                });
            });
        },
    });
    inst.init();
    return inst;
});