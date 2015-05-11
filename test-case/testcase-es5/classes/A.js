/**
 * Test class
 * @constructor
 * @ns.ClassAnnotation("a=b", 0, d=0.5, s="string = \"{}\"", t={"a", "b{}", {"d"}, {}}, i=0, j="quote = \"b\\\"")
 * @AnotherAnnotation()
 * @MethodAnnotation()
 */
function A() {

}

/**
 * Test property
 * @type {String}
 * @PropertyAnnotation() @AnotherPropertyAnnotation("test inline")
 */
A.prototype.a = null;

/** @PropertyAnnotation() */
A.prototype.b = null;

/**
 * Test method
 * @MethodAnnotation()
 */
A.prototype.c = function () {
	var a = {};
}

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