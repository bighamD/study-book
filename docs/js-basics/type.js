// nlog(n)
function quickSort(arr) {
    if (arr.length <= 1) return arr;
    return [...quickSort(arr.filter(v => v < arr[0])), arr[0], ...quickSort(arr.filter(v => v > arr[0]))]
}

console.log(quickSort([1, 0, 2,8, 5, 6,2,3,9,6]))

Function.prototype._call = function(context, ...rest) {
    context = context || window;
    context._fn = this;
    const ret = context._fn(...rest);
    delete context._fn;
    return ret;
}

Function.prototype._apply = function(context, rest) {
    context = context || window;
    context._fn = this;
    const ret = context._fn(...rest);
    delete context._fn;
    return ret;
}

function add(a, b, c) {

    console.log(a, b, c, this)
    this.name = 1;
    this.age = 3;
}

Function.prototype._bind = function(context, ...rest) {
    const _this = this;
    const bind =  function (...args) {
        if (this instanceof bind) { // 说明bind函数 是通过new来调用， 那么context是当前bind的this，与context无关
            // _this.call(this, ...rest, ...args)
            // this.__proto__ = _this.prototype;
            // return this;
            return new _this(...rest, ...args);
        } else {
            return _this.call(context, ...rest, ...args);
        }
    }
    return bind;
}

var a = add._bind({}, [1,2,3])

new a()




 function concurrence(tasks, max = 3) {
    const copys = [...tasks];
    // 当有一个promise失败的时候清空队列，不继续执行剩余task
    const clearOnrejected = p => p().catch(e => {
        copys.length = 0;
        throw e;
    })
    // 一个promise成功后继续从队列剩余执行
    const run = async () => {
        while(copys.length) {
            console.log('rest:', copys.length)
            const task = copys.shift();
            // await task();
            await clearOnrejected(task);
            await run();
        }
    }
    const taksPoll = [];
    // 最多同时有max个promise在跑
    while(max--) {
        taksPoll.push(run());
    }
    return Promise.all(taksPoll);
}


var fns = Array.from({length: 10}).map((v, i) => {
    return () => new Promise((rs,rj) => {
        setTimeout(() => {
            i == 5 && rj(i);
            rs(i)
        }, 300)
    })
})

concurrence(fns, 3)


