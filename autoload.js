var path = require("path");

module.exports = function (autoloader) {
    autoloader.namespace("violin.annotations", path.join(__dirname, "src"));
};