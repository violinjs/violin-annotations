/**
 * @ClassAnnotation()
 * @AnotherClassAnnotation()
 */
class A {

    /**
     * @public
     * @ConstructorAnnotations()
     */
    constructor() {

        /**
         * @private
         * @PropertyAnnotation()
         */
        this.prop = null;

        /**
         * @private
         * @PropertyAnnotation()
         */
        this.prop2 = null;

        /**
         * @MethodAnnotation()
         */
        this.method2 = function () {

        };
    }

    /**
     * @MethodAnnotation(a=4, b={})
     * @AnotherMethodAnnotation()
     */
    method() {

    }

    /**
     * @AnotherMethodAnnotation()
     */
    method1(a = 5, ...b) {

    }

    /**
     * @PropertyAnnotation()
     */
    get a() {
        return this.prop;
    }

    /**
     * @AnotherPropertyAnnotation()
     */
    set a(prop) {
        this.prop = prop;
        return true;
    }

    /**
     * @PropertyAnnotation()
     */
    get b() {
        return 1;
    }

    /**
     * @public
     */
    set c(c) {
        this._c = c;
    }

    /**
     * @AnotherMethodAnnotation()
     */
    get() {

    }

    /**
     * @AnotherMethodAnnotation()
     */
    set() {

    }
}

module.exports = A;