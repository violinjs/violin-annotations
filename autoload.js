var path = require("path");

module.exports = function (autoloader) {
    autoloader.registerNamespace("violin.annotations", path.join(__dirname, "src"));
};