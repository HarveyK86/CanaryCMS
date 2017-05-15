/* global $, URLSearchParams */
define([
    "util/logger",
    "util/listener"
], function(
    logger,
    listener
) {
    var self = {
        config: {
            name: "querier",
            debug: false,
        }
    };
    var inst = $.extend(self, {
        init: function() {
            self.__logger = logger.get_logger(self);
            self.__logger.log("init");
        },
        has_hash: function() {
            self.__logger.log("has_hash");
            var has = window.location.hash ? true : false;
            self.__logger.log("has_hash returning", has);
            return has;
        },
        get_hash: function() {
            self.__logger.log("get_hash");
            var full = window.location.hash;
            var split = full.split("?");
            var hash = split[0];
            self.__logger.log("get_hash returning", hash);
            return hash;
        },
        set_hash: function(hash, fire_events) {
            self.__logger.log("set_hash[hash, fire_events]", [hash, fire_events]);
            var has = self.has_hash();
            if (!has || self.get_hash() != hash) {
                var full = window.location.hash;
                var split = full.split("?");
                var query = split[1];
                if (query) {
                    full = hash + "?" + query;
                } else { 
                    full = hash;
                }
                window.location.hash = full;
                if (fire_events !== false) {
                    listener.hashchanged();
                }
            }
        },
        has_param: function(param, url_params) {
            self.__logger.log("has_param[param, url_params]", [param, url_params]);
            if (!url_params) url_params = self._get_url_params();
            var has = url_params.has(param);
            self.__logger.log("has_param returning", has);
            return has;
        },
        get_param: function(param, default_value, url_params) {
            self.__logger.log("get_param[param, default_value, url_params]", [param, default_value, url_params]);
            if (!url_params) url_params = self._get_url_params();
            var value;
            if (self.has_param(param, url_params)) {
                value = url_params.get(param);
            } else {
                value = default_value;
            }
            self.__logger.log("get_param returning", value);
            return value;
        },
        set_param: function(param, value, fire_events, url_params) {
            self.__logger.log("set_param[param, value, fire_events, params]", [param, value, fire_events, url_params]);
            if (!url_params) url_params = self._get_url_params();
            var has = self.has_param(param, url_params);
            if (!has || self.get_param(param, url_params) != value.toString()) {
                var hash = self.get_hash();
                if (has) {
                    url_params.set(param, value);
                } else {
                    url_params.append(param, value);
                }
                var query = url_params.toString();
                query = query.replace(/undefined=&/g, "");
                window.location.hash = hash + "?" + query;
                if (fire_events !== false) {
                    listener.querychanged(param);
                }
            }
        },
        _get_url_params: function() {
            self.__logger.log("_get_url_params");
            var full = window.location.hash;
            var split = full.split("?");
            var query = split[1];
            var url_params = new URLSearchParams("?" + query);
            self.__logger.log("_get_url_params returning", url_params);
            return url_params;
        },
    });
    inst.init();
    return inst;
});