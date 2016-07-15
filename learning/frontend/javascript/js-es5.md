## ES5 语法总结

### 1. Object

#### 1.1 usage and properties

##### 1.1.1 数字(值类型)转换字符串(对象)
```
2..toString();
2 .toString();
(2).toString();
```
---

##### 1.1.2 对象属性删除
```
var obj = {
    bar: 1,
    foo: 2,
    baz: 3
};
delete obj.baz;
```
---
##### 1.1.3 对象中的key设置
```
var test = {
    'case': 'I am a keyword, so I must be notated as a string',
    delete: 'I am a keyword, so me too' // ES5之前 raises SyntaxError
};
```
---

#### 1.2 prototype

##### 1.2.1 ```Bar.prototype = Foo.prototype``` 共享双方属性，任何一方更改都会影响

##### 1.2.2 ```Bar.prototype = new Foo()``` Foo.prototype有更改，不会受影响

##### 1.2.3 ```Bar.prototype = Foo``` (NOT USE)
使用这样的赋值方式， Bar.prototype指向的是 Function.prototype而不是 Foo.prototype


#### 1.3 hasOwnProperty 查找属性不会访问原型链

```
// Poisoning Object.prototype
Object.prototype.bar = 1;
var foo = {goo: undefined};

foo.bar; // 1
'bar' in foo; // true

foo.hasOwnProperty('bar'); // false
foo.hasOwnProperty('goo'); // true
```
---

### 2. Function

#### 2.1 函数声明

##### 2.1.1 命名函数赋值给一个变量
```js
var foo = function bar() {
    bar(); // 正常运行
}
bar(); // 出错：ReferenceError（IE8及以下不会报改错）
```

#### 2.2 this

##### 2.2.1 指向全局（window）```ES5 注意: 在严格模式下（不存在全局变量。 这种情况下 this 将会是 undefined。```
1. 全局范围使用
2. 函数内使用 ``` foo() ```


##### 2.2.2 指向调用对象
1. test.foo() 指向test
2. new foo() 指向新创建的对象

##### 2.2.3 显示设置this
1. foo中的this指向了bar

```
function foo(a, b, c) {}

var bar = {};
foo.apply(bar, [1, 2, 3]); // 数组将会被扩展
foo.call(bar, 1, 2, 3); // 传递到foo的参数是：a = 1, b = 2, c = 3
```

##### 2.2.4 别名变量设置this
```
Foo.method = function() {
    var that = this;
    function test() {
        // 使用 that 来指向 Foo 对象
    }
    test();
}
```

##### 2.2.5 方法赋值(函数别名)
1. 方法赋值给test后，this将不再指向someObject
```
var test = someObject.methodTest;
test();
```

2. 当 method 被调用时，this 将会指向 Bar 的实例对象

```
function Foo() {}
Foo.prototype.method = function() {};
function Bar() {}
Bar.prototype = Foo.prototype;

new Bar().method();
```

#### 2.3 闭包(闭包的创建依赖于函数,ES5前只有函数拥有作用域)
##### 2.3.1 demo
```
function Counter(start) {
  var count = start;
  return {
    increment: function() {
      count++;
    },
    get: function() {
      return count;
    }
  }
}
var foo = Counter(4);
foo.increment();
foo.get(); // 5
```

#### 2.4 引用
##### 2.4.1 自执行匿名函数(避免引用错误)

外部的匿名函数会立即执行，并把 i 作为它的参数，此时函数内 e 变量就拥有了 i 的一个拷贝。
```
for(var i = 0; i < 10; i++) {
    (function(e) {
        setTimeout(function() {
            console.log(e);  
        }, 1000);
    })(i);
}
```
```
for(var i = 0; i < 10; i++) {
    setTimeout((function(e) {
        return function() {
            console.log(e);
        }
    })(i), 1000)
}
```

#### 2.5 arguments
arguments 变量不是一个数组（Array）。 尽管在语法上它有数组相关的属性 length，但它不从 Array.prototype 继承，实际上它是一个对象（Object）。无法对 arguments 变量使用标准的数组方法，比如 push, pop 或者 slice。 虽然使用 for 循环遍历也是可以的

##### 2.5.1 更好的使用数组方法，最好把它转化为一个真正的数组。
Array.prototype.slice.call(arguments);


#### 2.6 构造函数

#### 2.7 作用域和命名空间

##### 当访问函数内的 foo 变量时，JavaScript 会按照下面顺序查找：
1. 当前作用域内是否有 var foo 的定义。
2. 函数形式参数是否有使用 foo 名称的。
3. 函数自身是否叫做 foo。
4. 回溯到上一级作用域，然后从 #1 重新开始。

### call and apply
