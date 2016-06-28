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
---

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
```
var foo = function bar() {
    bar(); // 正常运行
}
bar(); // 出错：ReferenceError（IE8及以下不会报改错）
```

#### 2.2 this



### call and apply
