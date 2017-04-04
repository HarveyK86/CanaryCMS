/* global $, _ */
define([], function() {
    var self = {
        config: {
            debug: false,
            models: [
                "header",
                "template",
                "controller",
                "footer",
            ],
            model_arrays: {
                "pages": "page"
            },
            interval_tick: 10,
        }
    };
    return $.extend(self, {
        parse_response_array: function(response_array, callback) {
            self._log("parse_response_array[response_array, callback]", [response_array, callback]);
            var out = 0;
            var parsed_array = [];
            var interval;
            for (var index = 0; index < response_array.length; index++) {
                out++;
                self._parse_response_item(index, response_array[index], function(parsed_index, parsed_item) {
                    parsed_array[parsed_index] = parsed_item;
                    out--;
                });
            }
            interval = setInterval(function() {
                if (out === 0) {
                    clearInterval(interval);
                    self._log("parse_response_array returning", parsed_array);
                    callback(parsed_array);
                }
            }, self.config.interval_tick);
        },
        _parse_response_item: function(index, response_item, callback) {
            self._log("_parse_response_item[index, response_item, callback]", [index, response_item, callback]);
            var out = 0;
            var parsed_item = {};
            var interval;
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
                } else {
                    parsed_item[field] = response_item.fields[field];
                }
            }
            interval = setInterval(function() {
                if (out === 0) {
                    clearInterval(interval);
                    self._log("_parse_response_item returning", parsed_item);
                    callback(index, parsed_item);
                }
            }, self.config.interval_tick);
        },
        _parse_field_item: function(field, field_item, callback) {
            self._log("_parse_field_item[field, field_item, callback]", [field, field_item, callback]);
            $.get({
                url: field + "/" + field_item,
                success: function(response_array) {
                    self.parse_response_array(response_array, function(parsed_array) {
                        self._log("_parse_field_item returning", parsed_array[0]);
                        callback(field, parsed_array[0]);
                    });
                }
            });
        },
        _parse_field_array: function(field, field_array, callback) {
            self._log("_parse_field_array[field, field_array, callback]", [field, field_array, callback]);
            var out = 0;
            var parsed_array = [];
            var interval;
            for (var index = 0; index < field_array.length; index++) {
                out++;
                self._parse_field_array_item(index, self.config.model_arrays[field], field_array[index], function(parsed_index, parsed_array_item) {
                    parsed_array[parsed_index] = parsed_array_item;
                    out--;
                });
            }
            interval = setInterval(function() {
                if (out === 0) {
                    clearInterval(interval);
                    self._log("_parse_field_array returning", parsed_array);
                    callback(field, parsed_array);
                }
            }, self.config.interval_tick);
        },
        _parse_field_array_item: function(index, model, field_array_item, callback) {
            self._log("_parse_field_array_item[index, model, field_array_item, callback]", [index, model, field_array_item, callback]);
            $.get({
                url: model + "/" + field_array_item,
                success: function(response_array) {
                    self.parse_response_array(response_array, function(parsed_array) {
                        self._log("_parse_field_array_item returning", parsed_array[0]);
                        callback(index, parsed_array[0]);
                    });
                }
            });
        },
        _log: function(message, args) {
            if (self.config.debug) {
                if (args) {
                    console.info(message, args);
                } else {
                    console.info(message);
                }
            }
        }
    });
});