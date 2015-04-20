var assert = require("assert"),
    should = require("should"),
    path = require("path");

var Reader = require(path.join(__dirname, "..", "..", "src", "reader", "Es5Reader.js"));

const TEST_FILE = path.join(__dirname, "..", "testcase", "classes", "A.js");

describe("reader.Es5Reader", function () {

    describe("#read()", function () {
        it('should return an array', function (done) {
            var reader = new Reader(TEST_FILE);
            reader.read(function (err, annotations) {
                annotations.should.be.an.Array;
                done();
            });
        });

        it("should read all annotations in a file", function (done) {
            var reader = new Reader(TEST_FILE);
            reader.read(function (err, annotations) {
                annotations.length.should.be.exactly(7)
                done();
            });
        });
    });
});