## ES5 语法总结

### 1. Object

##### 1.1 数字(值类型)转换字符串(对象)
```
2..toString();
2 .toString();
(2).toString();
```
---

##### 1.2 对象属性删除
```
var obj = {
    bar: 1,
    foo: 2,
    baz: 3
};
delete obj.baz;
```
---
##### 1.3 对象中的key设置
```
var test = {
    'case': 'I am a keyword, so I must be notated as a string',
    delete: 'I am a keyword, so me too' // ES5之前 raises SyntaxError
};
```
---
### 2. prototype
