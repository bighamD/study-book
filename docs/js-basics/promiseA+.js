// PromiseA+ https://www.ituring.com.cn/article/66566

const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
const PENDING = 'pengding';
const isFun = fn => typeof fn === 'function';
let uuid = 0;


const isPending = status => status === PENDING;
class MyPromise {
    constructor(excetor) {
        this.status = PENDING;
        this.id = `$${uuid++}`;
        this.value = undefined;
        this.reason = undefined;
        this.onFulilledCallbacks = [];
        this.onRejectedCallbacks = [];
        this.init(excetor);
    }
    init(excetor) {
        const reject = (reason) => setTimeout(() => {
            if (isPending(this.status)) {
                this.status = REJECTED;
                this.reason = reason;
                this.onRejectedCallbacks.forEach(cb => cb(this.reason));
                this.onRejectedCallbacks.length = 0;
            }
        });

        const resolve = v => {
            if (v instanceof MyPromise) {
                return v.then(resolve, reject);
            }
            setTimeout(() => {
                if (isPending(this.status)) {
                    this.status = FULFILLED;
                    this.value = v;
                    this.onFulilledCallbacks.forEach(cb => cb(this.value));
                    this.onFulilledCallbacks.length = 0;
                }
            })
        };

        try {
            excetor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }
    resolvePromise(promise, x, resolve, reject) {
        if (promise === x) { // 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
            return reject(TypeError('Chaining cycle detected for promise #<myPromise>'));
        }
        if (x instanceof MyPromise) { // 
            // 如果x是MyPromise对象，直接递归解析即刻，直到被resolve或reject
            // 如果x是pengding状态，那么这个promise也会一直处于pending
                x.then(
                    y => {
                        this.resolvePromise(promise, y, resolve, reject)
                    },
                    reject
                )

        } else if (x && typeof x === 'object' || typeof x === 'function') {
            // thenable对象，非null对象或函数，有属性then

            // 下面这种情况会递归溢出, 原生Promise没有处理这种场景，导致主任务一直被挂起
            /**
             * new MyPromise(rs => rs(10)).then(() => {
                    var then = {
                        then: (rs) => {
                            rs(then)
                        }
                    }
                    return then;
                })
             */

             /** 多次调用问题
              *  
              * new MyPromise(rs => rs(10)).then(() => {
                    var then = {
                        then: (rs, rj) => {
                            rs('ok')
                            rj('fail')
                        }
                    }
                    return then;
                })
              */
            try {
                let then = x.then;
                if (isFun(then)) {
                    then.call(
                        x,
                        y => x !== y && this.resolvePromise(promise, y, resolve, reject),
                        r => x !== r && reject(r)
                    );
                } else { // 如果then不是一个函数，那么直接resolve x
                    resolve(x);
                }
            } catch (error) { // 如果取x.then或者then函数报错
                x !== error && reject(error)
            }
        } else {
            resolve(x);
        }
    }
    then(onFulfilled, onRejected) {
        let newPromise = null;
        onFulfilled = isFun(onFulfilled) ? onFulfilled : s => s;
        onRejected = isFun(onRejected) ? onRejected : s => { throw s };

        const wrapper = (handler, value) => {
            return newPromise = new MyPromise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        let promiseLike = handler(value);
                        this.resolvePromise(newPromise, promiseLike, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                })
            })
        }

        if (this.status === FULFILLED) {
            return wrapper(onFulfilled, this.value);
        } else if (this.status === REJECTED) {
           return wrapper(onRejected, this.reason);
        } else {
            return newPromise = new MyPromise((resolve, reject) => {
                this.onFulilledCallbacks.push(
                    (value) => {
                        try {
                            let promiseLike = onFulfilled(value);
                            this.resolvePromise(newPromise, promiseLike, resolve, reject);
                        } catch (error) {
                            reject(error)
                        }
                    }
                );

                this.onRejectedCallbacks.push(
                    (reason) => {
                        try {
                            let promiseLike = onRejected(reason);
                            this.resolvePromise(newPromise, promiseLike, resolve, reject);
                        } catch (error) {
                            reject(error)
                        }
                    }
                );
            });
        }
    }
}


MyPromise.deferred = function () {
    let deferred = {}

    deferred.promise = new MyPromise((resolve, reject) => {
        deferred.resolve = resolve
        deferred.reject = reject
    })
    return deferred
}


module.exports = MyPromise;
