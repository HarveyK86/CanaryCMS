/* global requirejs, $ */
requirejs(["util/parser"], function(parser) {
    $.get({
        url: "config",
        success: function(response_array) {
            parser.parse_response_array(response_array, function(parsed_array) {
                var config = parsed_array[0];
                requirejs([config.header.controller.file], function(header) {
                    header.init($.extend(config.header, {
                        selector: "#header",
                    }));
                });
            });
        }
    });
});