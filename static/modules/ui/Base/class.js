
//Class是一个类继承库，本身是一个类，直接new会调用init作为构造函数
var Class = function() {};
//空的init方法
Class.prototype={
    constructor : Class,
    init : function(){},
    //给所有类添加一个方法，函数强制在本作用域下调用，相当于es5的Object.bind函数
    proxy : function(fn) {
        var self = this;
        return function() {
            return fn.apply(self, arguments);
        }
    }
};
//因为Class在创造子类是需要仅仅需要一个带有prototype的实例，这里运行init不需要，这是一个开关
var initing=true;
//正则.test接受一个不是字符串的参数将会自动调用器toString方法，函数的toString方法返回式函数体字符串。
var fnTest = /xyz/.test(function() {xyz;}) ? /\b_super\b/ : /.*/;
/**
 * 返回一个新的类继承自本类，并提供两个参数用于扩展
 * @param  {object} prop         扩展实例方法，只能扩展方法，属性可以在init中定义，init是构造函数使用
 * @param  {object} staticMethod 扩展类静态方法或属性
 * @return {class}              返回一个新的类继承自本类
 */
Class.extend = function(prop, staticMethod) {
    var _super = this.prototype;

    // 将Class实例化，原型继承基础,这里我们只希望得到一个纯洁的带有原型没有实例属性的对象，所以，我们不需要运行其init
    initing=false;
    var prototype = new this();
    initing=true;
    //将实例扩展函数拷贝到类的原型上
    for (var name in prop) {
        // 检查实例扩展函数否是函数，和超类被覆盖函数是否也是函数是
        prototype[name] = typeof prop[name] == "function" &&
            //fnTest.test(prop[name])是检测覆盖函数中是否有_super单词
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
            (function(name, fn) {
                return function() {
                    //先保存起来本来对象的_super方法
                    var tmp = this._super;

                    // Add a new ._super() method that is the same method
                    // but on the super-class
                    // 短暂将超类被覆盖方法赋值给本对象的_super，在覆盖方法中直接访问超类同名方法
                    this._super = _super[name];

                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);
                    //将对象本来的_super方法还原
                    this._super = tmp;

                    return ret;
                };
            })(name, prop[name]) :
            prop[name];
    }

    // 返回类的实际构造函数
    function SubClass() {
        // 所有继承自Class的类都会自动调用init方法,就是默认将init方法当作构造函数调用
        if (initing&&this.init){
            this.init.apply(this, arguments);
        }
    }

    // 原型继承
    SubClass.prototype = prototype;
    SubClass.prototype.constructor=SubClass;
    SubClass.prototype.parent=this;

    // 一定要将export静态方法复制给子类
    SubClass.extend = arguments.callee;

    //绑定静态属性或方法
    if (typeof staticMethod === 'object') {
        for (var name in staticMethod) {
            //规定不能重写extend方法
            if (name !== 'extend') {
                SubClass[name] = staticMethod[name];
            } else {
                throw new Error('can not rewrite the extend method');
            }

        }
    };

    return SubClass;
};

module.exports=Class;