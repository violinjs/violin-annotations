var path = require("path");

var Reader = require(path.join(__dirname, "reader", "Reader.js"));


/**
 * This class represents an annotation parser
 * @constructor
 */
function Parser() {

}

/**
 *
 * @param {String} filename
 * @param {Callable} callback
 */
Parser.prototype.parseFile = function (filename, callback) {
    if (typeof filename !== "string") {
        throw new Error("Filename should be a String");
    }
    if (typeof callback !== "function") {
        throw new Error("Callback should be a Function");
    }

    var reader = new Reader(filename);
    reader.read(function (annotations) {
        console.log(annotations);
    });
};

module.exports = Parser;