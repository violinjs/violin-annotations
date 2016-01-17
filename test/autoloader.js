var path = require("path");

var Autoloader = require("violin-autoloader"),
    autoloader = new Autoloader();

global.ROOT = path.join(__dirname, "..");

autoloader.namespace("violin.annotations", path.join(__dirname, "..", "src"));
autoloader.namespace("tests", path.join(ROOT, "test-case", "testcase-es5", "autoloader"));

autoloader.register();