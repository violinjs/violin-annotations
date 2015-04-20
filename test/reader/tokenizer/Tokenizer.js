var assert = require("assert"),
    should = require("should"),
    path = require("path"),
    util = require("util");

var Tokenizer = require(path.join(
    __dirname, "..", "..", "..", "src",
    "reader", "tokenizer", "Tokenizer.js"));

var HELLO = "Hello",
    WORLD = "world",
    EXCL = "!",
    HELLO_WORLD = util.format("%s \n%s %s", HELLO, WORLD, EXCL),
    SPACES = "\"Hello world\"";

describe("reader.tokenizer.Tokenizer", function () {

    describe("#constructor()", function () {
        it("should throw an error if the parameter is not a string", function () {
            (function () {
                new Tokenizer("string");
            }).should.not.throw;

            (function () {
                new Tokenizer(0);
            }).should.throw;
        });
    });

    describe("#nextToken()", function () {

        it("should return a string", function () {
            var tokenizer = new Tokenizer(HELLO_WORLD);
            tokenizer.nextToken().should.be.a.string;
        });

        it("should return the next token", function () {
            var tokenizer = new Tokenizer(HELLO_WORLD);
            tokenizer.nextToken().should.be.equal(HELLO);
            tokenizer.nextToken().should.be.equal(WORLD);
            tokenizer.nextToken().should.be.equal(EXCL);
        });

        it("should return an empty string if all tokens have been found", function () {
            var tokenizer = new Tokenizer(HELLO_WORLD);
            while (tokenizer.hasMoreTokens()) {
                tokenizer.nextToken();
            }
            tokenizer.nextToken().should.be.equal("");
        });

        it("should return a string with spaces with it is between spaces", function () {
            var tokenizer = new Tokenizer(SPACES);
            tokenizer.nextToken().should.be.equal(SPACES);
        });
    });

    describe("#hasMoreToken()", function () {

        it("should return a boolean", function () {
            var tokenizer = new Tokenizer("");
            tokenizer.hasMoreTokens().should.be.a.boolean;
        })

        it("should return true if the string to tokenize is empty", function () {
            var tokenizer = new Tokenizer("");
            tokenizer.hasMoreTokens().should.be.false;
        });

        it("should return false if the string has more tokens", function () {
            var tokenizer = new Tokenizer(HELLO_WORLD);
            tokenizer.hasMoreTokens().should.be.true;
        });

        it("should return true if the string has no more token", function () {
            var tokenizer = new Tokenizer(HELLO_WORLD);
            while (tokenizer.hasMoreTokens()) {
                tokenizer.nextToken();
            }
            tokenizer.hasMoreTokens().should.be.false;
        });
    });
});