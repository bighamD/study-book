# ES6
## ES6是什么？
`ES6`指`ECMAScript2015`, 2015年6月发布的`ECMAScript`标准，`ES7`对应ES2016, `ES8`对应ES2017, 目前每年都会迭代一个ES版本。
而`ES6`是最大改动的一个版本，包含了很多新的特性、包括语法糖`class`、箭头函数、模版字符串、异步编程解决方案`Promise`等等。而`ES6`之后的版本改动的特性都比较少(很多都是新增语法糖)，
所以着重关注`ES6`。
>[阮一峰ES6入门](https://es6.ruanyifeng.com/#README)
## let & const
`let` 和 `const` 都是新增的声明变量操作符，类似于`var`，但是跟`var`有比较大的区别。
### let 和 var
`let`和`var`的异同：
- 相同点
    - 声明变量的时候可以不赋初始值，此时默认值是`undefined`
- 差异点
    1. 在同一个作用域，var可以多次声明，let只能被声明一次
    2. 在顶层作用域window的上下文中，使用var声明的变量会变成全局变量，而let声明的变量不会挂载到window上
    3. let不存在变量提升, `let`不能在声明前使用只在, let命令所在的代码块内有效
    4. let会开辟一个块作用域
```js
{
    let a = 1;
    var b = 2;
}
console.log(b); // 2
console.log(a); // ReferenceError: a is not define
// let会和花括号{}形成一个块作用域，在{}使用let声明的变量也只能在这个块能访问到，而var不存在块作用域

var c = 1;
let d = 2;
window.c; // 1
window.d; // undefined, let声明的变量不会被挂载在window上
```
### `let` 和 `const`的差别
`const` 是单词 `constant` 的缩写，`const`声明的变量必须要有初始值，且不能被重写。其他用法保持一致

## 迭代器iterator
```js
for (let v for ['a', 'b', 'c']) {
    console.log(v);
}
// a
// b
// c
```

我们知道数组`Array`可以使用`for of `的语法可以遍历数组，`Map`,`Set`也可以，但是对象不能用这个语法，原因是对象没有实现`Iterable` 接口，即实例上没有定义`Symbol.iterator`方法。
其中`Symbol.iterator`调用返回一个可迭代对象，可迭代对象每次调用`next()`，都会返回一个`IteratorResult`，`IteratorResult`包含两个属性：`done` 和 `value`, `done`是一个布尔值，表示
下次是否还能再调用next()取得下一个值。`value`表示这次迭代的值，如果`done`为`true`，`value`为`undefined`。
```js
// 可迭代对象
let arr = ['foo', 'bar'];
// 迭代器工厂函数
console.log(arr[Symbol.iterator]); // f values() { [native code] }
// 迭代器
let iter = arr[Symbol.iterator](); console.log(iter); // ArrayIterator {}
// 执行迭代
console.log(iter.next()); // { done: false, value: 'foo' } 
console.log(iter.next()); // { done: false, value: 'bar' } 
console.log(iter.next()); // { done: true, value: undefined }
```
*给对象实现一个自定义`Iterable`接口*
```js
class Iterator {
    constructor(...rest) {
        this.childs = rest;
    }
    [Symbol.iterator]() {
        let childs = this.childs;
        let len = this.childs.length;
        let idx = 0;
        return {
            next () {
                if (idx < len) {
                    return {
                        done: false,
                        value: childs[idx++]
                    }
                }
                return {
                    done: true,
                    value: undefined
                }
            }
        }
    }
}
let obj = new Iterator('foo', 'biz', 'bar');

for (let v of obj) {
    console.log(v);
}
// 'foo';
// 'biz';
// 'bar';

let it = obj[Symbol.iterator]();
it.next(); // {done: false, value: 'foo'}
it.next(); // {done: false, value: 'biz'}
it.next(); // {done: false, value: 'bar'}
it.next(); // {done: true, value: undefined}
```
上面如果给对象原型定义`Symbol.iterator`接口，也可以直接使用`for of`。

## generator生成器

生成器是一个灵活的结构，在一个函数块内可以暂停和恢复代码执行的能力。生成器函数名称前面加一个 `*` 来表示。
```js
function * genertatorFn() {
    console.log('start');
    yield 1;
    yield 2;
}
let gen = genertatorFn();
gen.next(); // 'start'， {done:false, value:1}
gen.next(); // {done:false, value:1}
gen.next(); // {done:true, value:undefined}
```
上面调用生成器函数会返回生成器对象，`genertatorFn()`并立刻不会输出`start`，只是为了初始化一个生成器对象。调用`next`方法返回的值跟迭代器类似，包含两个属性：`done` 和 `value`。
`yield`关键字可以让生成器停止和开始执行，也是生成器最有用的地方。生成器函数在遇到 `yield` 关键字之前会正常执行。遇到这个关键字后，执行会停止，函数作用域的状态会被保留。
停止执行的生 成器函数只能通过在生成器对象上调用 `next()`方法来恢复执行, 此时的 `yield` 关键字有点像函数的中间返回语句。上面`gen`对象已经实现了`[Symbol.iterator]`接口，因此可以
直接使用`for of`来遍历生成器。
```js
function * genertatorFn() {
    yield 1;
    yield 2;
    yield 3;
}
for(let i of genertatorFn()) {
    console.log(i);
    // 1 2 3
}
```
:::tip
`gen[Symbol.iterator]() === gen`, gen的迭代器接口调用后返回自己
:::

## Promise

### finally实现
`finally`特性
- resolved状态的Promise，如果finally回调抛出错误或者返回一个rejected的Promise, 则以此为终态Promise，否则返回以原来resolved值Promise
- rejected状态的Promise，如果finally回调抛出错误或者返回一个rejected的Promise, 则以此为终态Promise，否则返回以原来rejected值新的Promise
- pending状态的Promise不会执行finally回调
```js
// 因为Promise的then会对cb进行try-catch, 如果cb抛出错误, then只会返回这个为reason的rejected Promise
Promise.prototype._finally = function (cb) {
    return this.then(
        res => Promise.resolve(cb()).then(() => res),
        err => Promise.resolve(cb()).then(reason => { throw reason})
    );
}
```

