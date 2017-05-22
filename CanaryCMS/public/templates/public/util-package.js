define([
    "util/cache",
    "util/listener",
    "util/logger",
    "util/parser",
    "util/query",
    "util/selector",
    "util/templater"
], function(
    cache,
    listener,
    logger,
    parser,
    query,
    selector,
    templater
) {
    return {
        cache: cache,
        listener: listener,
        logger: logger,
        parser: parser,
        query: query,
        selector: selector,
        templater: templater,
    };
});