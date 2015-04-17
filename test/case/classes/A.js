/**
 * Test class
 * @constructor
 * @c.ConstructorAnnotation("a=b", 0, d=0.5, s="string = \"{}\"", t={"a", "b{}", {"d"}, {}}, i=0)
 * @AnotherAnnotation()
 */
function A() {

}

A.prototype = {

    /**
     * Test property
     * @type {String}
     * @PropertyAnnotation() @AnotherPropertyAnnotation("test inline")
     */
    a: null,

    /** @PropertyAnnotation() */
    b: true,

    /**
     * Test method
     * @MethodAnnotation()
     */
    c: function () {
        var a = {};
    }
};

/**
 * Test method
 * @MethodAnnotation()
 */
A.prototype.d = function () {

};

/**
 * Test method
 * @MethodAnnotation()
 * @AnotherMethodAnnotation(5)
 */
A.prototype.e = function () {

};

/**
 * Test external property
 * @type {boolean}
 * @PropertyAnnotation()
 */
A.prototype.f = true;

module.exports = A;