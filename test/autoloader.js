var path = require("path");

var Autoloader = require("violin-autoloader"),
    autoloader = new Autoloader();

require(path.join(__dirname, "..", "autoload.js"))(autoloader);
autoloader.registerNamespace("tests", path.join(__dirname, "testcase", "autoloader"));

autoloader.register(function () {

});