var path = require("path");

var Autoloader = require("violin-autoloader"),
    autoloader = new Autoloader();

global.ROOT = path.join(__dirname, "..");

require(path.join(ROOT, "autoload.js"))(autoloader);
autoloader.registerNamespace("tests", path.join(ROOT, "test-case", "testcase-es5", "autoloader"));

autoloader.register(function () {

});