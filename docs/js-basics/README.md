# javascript 基础

## 什么是javascript？
`JavaScript` 是一门用来与网页交互的脚本语言，包含以下三个组成部分
- `ECMAScript` 就是我们常常说的 JS
- 文档对象模型(DOM):提供与网页内容交互的方法和接口
- 浏览器对象模型(BOM):提供与浏览器交互的方法和接口，也叫做WebApi

## 基本数据类型
- String 字符串
- Number 数字
- Boolean 布尔值
- null
- undefined
- Symbol

### String
```js
let str = 'bigham';
str[1] = 'B';
console.log(str); // bigham
```
可以通过字面量快速创建一个字符串变量，字符串是不可变的，一旦被创建就无法被改变，上面试图改变字符串的第一个字符，但是是无效的。
如果要想修改某个变量中的字符串值，必须先销毁原来的字符串，然后将包含新值的另一个字符串保存到该变量，如 下所示:
```js
let str = 'bigham';
str = 'hello ' + str;
console.log(str); // 'hello bigham';
```
`String`函数可以把任何类型的值转为对应的字符串形式，`String(xxx)` 的意思就是调用`xxx.toString()` 并返回值
```js
String(1234); // 等价于 (1234).toString()，返回'1234'
String({}); // 等价于 ({}).toString()，返回'[object Object]'
String([1,2]) // 等价于 ([1,2]).toString()，返回'1,2'
String(Function) // 等价于 Function.toString()，返回'function Function() { [native code] }'
```

### Number
如果我们想声明一个变量的值是3，最直接的方法就像下面
```js
let num = 3;
// 当然也可以使用parseInt来转换表示一个数字
let num = parseInt(3); // parseInt的第二个参数默认使用10进值
```
整数也可以使用八进制，八进制指的是，第一个数字必须是零(0)，然后是相应的八进制数字(数值 0~7)
```js
let octalNum1 = 070; // 八进制的56
```
但是最好不要用八进制表示一个整数，严格模式下 `scrict mode`就禁止使用0开头表示八进制，很多eslint使用的规则默认禁止使用八进制
#### 数字精度问题
一个很经典的问题， `0.1 + 0.2` 等于多少
```js
if (0.1 + 0.2) { // 永远都为false 0.1+0.2=0.300 000 000 000 000 04
    // do something
}
```
这里检测两个数值之和是否等于 0.3。如果两个数值分别是 0.05 和 0.25，或者 0.15 和 0.15，那没问题，因此在计算小数的时候，为了避免精度偏差，可以转为整数，然后除于倍数
```js
(0.1 * 10 + 0.2 * 10) / 10; // 0.3
```
#### NaN & Infinity
`NaN` 和 `Infinity`, 都是`number`类型, 需要注意的是，NaN 和任何number类型做运算结果都是NaN，且NaN不等于NaN
```js
NaN + 1; // NaN
NaN / 2; // Nan
NaN == NaN; // false
```
### Boolean
boolean指的是`true`和`false`,  js中任何值都可以通过Boolean函数转为布尔值，其中只需要那些会会被转为false即可，剩下的都是true
```js
// 布尔为false的所有场景
Boolean(NaN);
Boolean(0);
Boolean(-0);
Boolean(false);
Boolean('');
Boolean(undefined);
Boolean(null);
// 反之都是true
...
```
### undefined
`javascript` 中会得到值为 `undefined` 有下面三种情况
- 主动把 `undefined` 赋值给变量
- 函数没有返回值，那么函数执行得到的值为 `undefined`
- 声明一个变量，但是没有给初始值
```js
let a = undefined;
let b = (function () {})();
let c;
```
需要注意的是，`undefined` 是window的一个属性，它是只读的，不能被重写
```js
'undefined' in window; // true;
window.undefined; // undefined
window.undefined = 123; // 重写无效，值还是undefined
```
### null
除非手动把 `null` 赋值给一个变量，否则任何情况下都不会出现值为 `null`的情况。`null`最大的作用可以脱离一个变量的引用关系，
可以主动让`javascript` 垃圾回收机制回收这个值的引用
```js
let a = {name: 'bigham'};
a = null;// 会切断变量a与其之前引用值{name: 'bigham'}之间的关系，使{name: 'bigham'}能被回收
```
::: tip
`typeof null === 'object'`, 因此使用`typeof`操作符判断是否`object`类型时需要注意`null`的情况，比较安全判断是`object`类型
`xxx && typeof xxx === 'object'`(非空)
:::

### Symbol
`symbol` 类型是`es6`推出的一种基础类型, 旨在有一种永远不会重复的值，symbol返回的值和任何值都不会相等
```js
Symbol(1) != Symbol(1); // true
```
## 作用域和函数参数
### 作用域
全局上下文是顶层上下文，在浏览器中，全局上下文指的是window所在的那层，而window对象是当前上下文context，通过var定义的全局变量和函数都会成为window上面的属性，而let和const不会。
每个函数被执行的时候都会创建变量对象的一个作用域链(scope chain)，这个作用域链决定了各级上下文中的代码在访问变量和函数时的顺序，用代码来解析下
```js
var age = 20;
var size = 'large';
function changeInfo() {
    let age = 30;
    console.log(age); // 30, 因为在changeInfo函数的上下文中能找到age
    console.log(size); 
    // 'large', 因为在changeInfo函数的上下文中没找到size，
    // 只能继续往上层上下文查找，直到全局上下文window所在的那层
    // console.log(innerAge)
    // innerAge is not define, 报错，因为innerAge变量只存在inner函数所在的上下文，不能向下访问
    function inner() {
        let innerAge = 20;
        console.log(age); 
        // 100, 因为在inner函数的上下文中找不到到age，所以只能向上层上下文changeInfo函数查找
        // 然后在找到了changeInfo中定义的age，一旦找到了就不会继续向上找，所以不是window上的age
        console.log(innerAge)
        // 20, 因为在当前inner函数的上下文就找了innerAge
        console.log(size);
        // large, 因为在inner函数的上下文中找不到到age，所以只能向上层上下文changeInfo函数查找
        // 然后在changeInfo函数上下文也没有找到，只能继续向上层作用域查找，最后在window上找到size变量
    }
    
    inner();
}
changeInfo();
console.log(color); // 'blue' 因为我们在全局上下午上，所以只能访问最近的color
console.log(innerAge); // innerAge is not define, 报错，因为innerAge变量只存在inner函数所在的上下文，不能向下访问
```
我们用图来表示下作用域链, 涉及了三个上下文

```js
window
|____age
|____size
|____changeInfo()
        |____age
        |____inner()
                |____innerAge
```
- 全局上下文window上有个age、size变量和changeInfo函数。
- changeInfo()的局部上下文中，有age和inner函数，在changeInfo中可以访问到age、inner和size，如果要访问window上age需要通过window.age访问，因为就近原则changeInfo()函数的上下文就能访问到自己的age，就不会继续往上找。
- inner()函数局部上下文中能访问到innerAge、和其他所有上下文中的变量，因为它们都是父上下文关系，会传递给inner()。
::: danger
子上下文能访问父上下文中的变量，但是父上下文不能访问子上下文中的变量，因为它们是局部的，只能向上不能向下，所以`console.log(innerAge)会报错`
:::

### 函数的入参
所有函数的参数都是按值传递的，不是按照引用传递的，意思是函数外面的值会被复制到函数声明的形参中，函数的入参是值的复制。
```js
// 基本类型的实参
const n = 10;
function tens (num) {
    num *= 10;
    return num
}
tens(n);
console.log(n);
// 10, 没有变化，说明不是按照引用传递的的，如果是按照引用传递那么变量n应该变成100，但是并没有
// 在tens函数内部，参数 num的值*10，但这不会影响函数外部的原始变量 n。tens函数参数 num 和变量 n互不干扰

// 引用类型的实参
const info = {
    name: 'bigham',
}
function changeName (obj) {
    obj.name = 'qiuqiu';
    obj = null;
}
changeName(info); 
console.log(info); 
// {name: 'qiuqiu'}, 因为把info复制给obj, obj修改了name, info也会也会被修改, 最后obj变成了null, 
// 但是info还是{name: 'qiuqiu'}, 如果是按照引用那么info应该变成了null
// changeName函数可以理解成这样, obj = info，这里就是值的复制
function changeName() {
    let obj;
    obj = info;
    obj.name = 'qiuqiu';
    obj = null;
}
```
上面的 `tens` 和 `changeName`运行起来没有报错，我们知道通过`const` 声明的变量是不能被重写的，如果是按照引用传递的明显就说不通了