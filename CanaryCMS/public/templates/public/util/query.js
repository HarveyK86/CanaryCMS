/* global $, URLSearchParams */
define(["util/listener", "util/logger"], function(listener, logger) {
    var self = {
        config: {
            name: "query",
            debug: false,
        }
    };
    var inst = $.extend(self, {
        init: function() {
            self.__logger = logger.get_logger(self);
            self.__logger.log("init");
            self.__full = "#";
            window.onhashchange = function() {
                if (window.location.hash != self.__full) {
                    if (self.get_hash() != self.get_hash(self.__full)) {
                        listener.hashchanged();
                    } else {
                        var changed_params = self._get_changed_params(self._get_params(self.__full), self._get_params());
                        if (changed_params.length) {
                            listener.querychanged(changed_params);
                        }
                    }
                    self.__full = window.location.hash;
                }
            };
        },
        has_hash: function() {
            self.__logger.log("has_hash");
            var has = self.get_hash() ? true : false;
            self.__logger.log("has_hash returning", has);
            return has;
        },
        get_hash: function(full) {
            self.__logger.log("get_hash[full]", full);
            var hash = self._get_location(full)[0];
            self.__logger.log("get_hash returning", hash);
            return hash;
        },
        set_hash: function(hash) {
            self.__logger.log("set_hash[hash]", hash);
            var location = self._get_location();
            if (hash != location[0]) {
                location[0] = hash;
                self._set_location(location);
                listener.hashchanged();
            }
        },
        has_param: function(param) {
            self.__logger.log("has_param[param]", param);
            var has = self.get_param(param) ? true : false;
            self.__logger.log("has_param returning", has);
            return has;
        },
        get_param: function(param, default_value) {
            self.__logger.log("get_param[param, default_value]", [param, default_value]);
            var params = self._get_location()[1];
            var value;
            if (params) value = params.get(param);
            if (!value) value = default_value;
            self.__logger.log("get_param returning", value);
            return value;
        },
        set_param: function(param, value) {
            self.__logger.log("set_param[param, value]", [param, value]);
            var location = self._get_location();
            var params = location[1];
            var current_value;
            if (params) current_value = params.get(param);
            if (value != current_value) {
                if (!params) {
                    params = new URLSearchParams();
                    location[1] = params;
                }
                params.set(param, value);
                self._set_location(location);
                listener.querychanged([param]);
            }
        },
        _has_params: function() {
            self.__logger.log("_has_params");
            var has = self._get_params().toString ? true : false;
            self.__logger.log("_has_params returning", has);
            return has;
        },
        _get_params: function(full) {
            self.__logger.log("_get_params[full]", full);
            var params = self._get_location(full)[1];
            self.__logger.log("_get_params returning", params);
            return params;
        },
        _set_params: function(params) {
            self.__logger.log("_set_params[params]", params);
            var location = self._get_location();
            var changed_params = self._get_changed_params(location[1], params);
            if (changed_params.length) {
                location[1] = params;
                self._set_location(location);
                listener.onquerychange(changed_params);
            }
        },
        _get_changed_params: function(from_params, to_params) {
            self.__logger.log("_get_changed_params[from_params, to_params]", [from_params, to_params]);
            var changed_params = [];
            if (from_params) {
                for (var param of from_params.keys()) {
                    if (!to_params.has(param) || to_params.get(param) != from_params.get(param)) {
                        changed_params.push(param);
                    }
                }
            }
            for (var param of to_params.keys()) {
                if (!from_params || !from_params.has(param)) {
                    changed_params.push(param);
                }
            }
            self.__logger.log("_get_changed_params returning", changed_params);
            return changed_params;
        },
        _get_location: function(full) {
            self.__logger.log("_get_location[full]", full);
            if (!full) full = window.location.hash;
            var location = full.split("?");
            if (location[1]) location[1] = new URLSearchParams("?" + location[1]);
            self.__logger.log("_get_location returning", location);
            return location;
        },
        _set_location: function(location) {
            self.__logger.log("_set_location[location]", location);
            var params = location[1];
            if (params) {
                params = "?" + params.toString();
            } else {
                params = "";
            }
            self.__full = location[0] + params;
            window.location.hash = self.__full;
        },
    });
    inst.init();
    return inst;
});