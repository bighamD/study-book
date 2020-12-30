---
title: Webpack
date: 2020-11-19T08:04:24.984Z
permalink: /build-tools/webpack
categories:
    - 工具链
tags:
    - webpack
author:
    name: bigham
lastmod: 2020-11-20 16:02:51
slug: webpack
---

# webpack
## 什么是webpack
`webapck` 本质上是一个打包工具, 当`webpack` 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 `bundle`,
并且提供多种运行环境的代码,比如代码可以在浏览器执行或者 `node`环境执行。

下面是 `webpack` 打包各种资源 (图片、css、js) 的一个概念图:


:::tip 适用对象
现在主流的前端框架都基于 `webpack` 开发了各自的脚手架，如 `@vue/lci`、 `react-create-app`
:::

## webpack的优势
- `webpack`是以 `commonjs` 书写脚本，对 `AMD/CMD` 支持也十分友好，方便旧项目迁移
- 定制化程度低、扩展性强、开发者可以自行编写写 `loader` 和 `plugin` 来控制打包流程
- 官方持续维护, 推陈出新
- 社区开源插件丰富，用户量大 <a href="https://npmcharts.com/compare/webpack?minimal=true">
		<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bff997771c6146758d31724c7a29a05b~tplv-k3u1fbpfcp-zoom-1.image">
	</a>
::: danger 注意
- webpack是在node环境执行，webpack的相关文件只能使用Commonjs、AMD/CMD规范编写
- 使用es6 module编写的plugin、loader、webpack.config.js等必须转为Commonjs格式
:::
## webpack的核心概念

- 入口(entry)
- 输出(output)
- loader
- 插件(plugins)

### 入口(entry)
入口起点(entry point)指示 `webpack` 应该使用哪个模块，来作为构建其内部依赖图的开始, 给定入口文件后，`webpack` 会找出有哪些模块和库是与入口文件（直接和间接）依赖的。

接下来我们看一个 entry 配置的最简单例子：

```js
// main.js
import { add } from './utils.js';
console.log(add(1, 2));

// utils.js
export const add = (a, b) => a + b;

// webpack.config.js
module.exports = {
  entry: {
      app: './src/main.js'
  }
};

// 如上配置后，webpack会解析utils.js是app.js的依赖，最终util.js会被打包到bundle中
```

### 输出
配置 `output` 选项可以控制打包资源的文件名格式，输出路径等

```js
// output配置项必须为一个对象
module.export = {
    entry: {
        app: './src/app.js'
    },
    output: {
        filename: '[name].js', // 这个格式的意思以入口的名字作为输出的文件名，比如上面配置entry中的键值 `app`, 输入的文件为app.js
        path: './dist', // 打包后的资源的输出的绝对路径，比如app.js的存放路径则为 /dist/app.js
    }
};
```

### loader
webpack 只能处理 js、 mjs 模块，当你的入口有依赖了其他类型的文件，如app.js `@import 'index.css'`,如果没有处理css的loader，webpack 构建将会出现错误，导致打包失败。
loader 可以将文件从不同的语言的文件转为javascript，比如 css-loader 可以把css转为js，url-loader 可以图片转为base64，等等。

用 css-loader 处理CSS文件，用style-loader 处理css-loader返回的结果：

```bash
npm install css-loader -D
npm install url-loader -D 
```
:::warning -D 和 -S的区别
- -D 加入到开发依赖devDependencies，只与打包过程有关的都应该加入到开发依赖
- -S 加入到生产依赖dependencies，比如vue、vuex、element-ui
:::
```js
// webpack.config.js
module.export = {
    entry: {
        app: './src/app.js'
    },
    output: {
        filename: '[name].js', // 这个格式的意思以入口的名字作为输出的文件名，比如上面配置entry中的键值 `app`, 输入的文件为app.js
        path: './dist', // 打包后的资源的输出的绝对路径，比如app.js的存放路径则为 /dist/app.js
    }，
    module: {
        rules: [
            {
                test: /\.css$/, // 对每个.css文件使用css-loader
                // 当只需要一个loader处理的时候use的值可以配置为字符串
                // ues: 'css-loader',
                use: [
                    {
                        loader: 'css-loadr'
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif)$/, // .png、.jpg、.gif文件都会经过url-loader处理
                use: 'url-loader'
            }
        ]
    }
};
```
### plugins(插件)
插件目的在于解决 loader 无法实现的其他事，插件的作用主要是可以对编译过程的资源进行操作，比如一些优化、裁剪、拆包、控制输出日志等，都可以通过 plugin 实现。
webpack 附带了各种内置插件，可以通过 webpack.[plugin-name] 访问这些插件。因为插件是一个构造函数或者class，使用的时候必须要搭配 new 操作符。

```js
// webpack.config.js
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.export = {
    entry: {
        app: './src/app.js'
    },
    output: {
        filename: '[name].js', // 这个格式的意思以入口的名字作为输出的文件名，比如上面配置entry中的键值 `app`, 输入的文件为app.js
        path: './dist', // 打包后的资源的输出的绝对路径，比如app.js的存放路径则为 /dist/app.js
    }，
    module: {
        rules: [
            {
                test: /\.css$/, // 对每个.css文件使用css-loader
                // 当只需要一个loader处理的时候use的值可以配置为字符串
                // ues: 'css-loader',
                use: [
                    {
                        loader: 'css-loadr'
                    }
                ]
            },
            {
                test: /\.html$/, // .html文件都会经过url-loader处理
                use: 'url-loader',
                options: {
                    limit: 1024 * 10
                }
            }
        ]
    },
    plugins: [ // 配置为一个数组，可以多次使用相同的插件
        // definePlugin的作用是，可以定义编译过程中的环境变量， 比如IS_PRD可以直接在app.js使用
        new webpack.DefinePlugin({
            IS_PRD: JSON.stringfy(process.env.NODE_ENV),
        }),
        // 该插件的作用是可以把编译生成的文件js、css通过创建对应的script标签、link标签分别插入到body和head尾部
        new HtmlWebpackPlugin(),
    ]
};
```

## 上手案例
讲完了 webpack 的基本概念我们来做一个稍微复杂小案例感受下

做完这个案例能学到啥？:tada: :100:
- webpack的基本配置
- 编写一个url-loader 能把图片转为绝对路径或者base64编码 (webpack 只能处理js、mjs文件)
- 编写一个html-webpack-plugin 能把打包的文件通过script标签插入到body尾部, 免去手动插入html文件过程

::: tip 案例目的
- 创建img标签，引用本地图片，通过 `appendChild` 至 `<body>`, 对于小于 `10kb` 的图片转换为 `base64` 编码
- 将打包生成的bundle，插入到 `<body>` 尾部
:::

### init webpack project
```bash
mkdir webpack-demo # 创建目录
cd webpack-demo
npm init -y # 初始化package.json
npm i webpack@4.44.2 webpack-cli -D # 安装webpack, 我在写这个文章的时候webpack已经更新到5.0.1，此案例基于4.44.2

# 目录结构
.
|____my-html-webpack-plguin.js // 自定义插件
|____index.html // 模版
|____my-url-loader.js // 自定义loader
|____package-lock.json
|____package.json
|____webpack.config.js
|____src
| |____below-limit.png (8kb)
| |____over-limit.png  (20kb)
| |____main.js // 入口文件
```


### package.json
```json
{
  "name": "webpack-demo",
  "version": "1.0.0",
  "description": "",
  "keywords": [],
  "author": "",
  "license": "ISC",
  "main": "index.js",
  "scripts": {
    "build": "webpack --config webpack.config.js", // 打包
    // watch模式，监听文件变化，当跟入口有关的依赖修改后会重新编译，不需要手动npm run build
    "watch": "webpack --config webpack.config.js --watch" 
  },
  "dependencies": {
    "loader-utils": "^2.0.0",
    "webpack": "^4.44.2",
    "webpack-cli": "^4.2.0"
  },
  "devDependencies": {
    "mime-types": "^2.1.27"
  }
}

```
### webpack.config.js

```js
const path = require('path');
const HtmlWebpackPlugin = require('./my-html-webpack-plguin')
module.exports = {
    mode: 'development', // 不压缩代码
    devtool: 'inline-cheap-module-souce-map', // 修改bundle的代码格式，方便我们查看打包结果
    entry: {
        app: './src/main.js'
    },
    output: {
        path: path.resolve('./dist'),
        filename: '[name].[chunkhash:8].js', // 每次修改重新编译会生成随机hashid， 比如app.b625a2b4.js, 主要是为了处理浏览器缓存问题，文件内容变化后，能够请求到新的文件
        publicPath: './',
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: path.resolve('./my-url-loader.js'), // 如果是自己编写的loader，需要提供绝对路径
                        options: {
                            limit: 1024 * 10 // 当图片小于10kb则返回base64编码
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin()
    ]
}
```

来看下入口文件main.js的内容
```js
const image = require('./below-limit.png');
const image2 = require('./over-limit.png');
const img = document.createElement('img');
const img2 = document.createElement('img');

img.setAttribute('src', image);
img2.setAttribute('src', image2);

document.body.appendChild(img);
document.body.appendChild(img2);
```
因为webpack不能处理png这种类型文件，需要额外的 loader 处理，接下来编写一个能处理图片的 loader
### Loader
先了解url-loader的作用
- 生成文件 [file].png 到输出目录
- 文件size大于 limit的时候, 输出到输出目录并返回 public URL (一个相对路径)
- 文件size小于 limit的时候, 输出到输出目录并返回 data URL(base64编码)


**my-url-loader的实现**
```js
// loader就是一个函数，当前this绑定了此次编译过程中提供的compiler作为当前上下文（context）,第一个参数是要处理文件的字符串或者buffer
// 因为loader必须要返回字符串或者buffer， url-loader 会根据limit设置和图片大小输出bas464字符串或者路径字符串
const { getOptions, interpolateName } = require('loader-utils') // 处理loader上下文的工具库
const mime = require('mime-types') // 获取文件的mime类型
const path = require('path')

function myUrlLoader (content) { // 图片的的字符串格式是buffer
    const { limit } = getOptions(this); // 获取当前options配置
    const context = this.rootContext; // 当前的cwd
    const name = '[name].[ext]'; // 指定生成图片的文件名格式

    // 生成图片的路径
    const url = interpolateName(this, name, {
      context,
      content,
    });
    
    // __webpack_public_path__ 指向配置中 output.publicPath 的值，比如此配置的value是 './'
    const publicPath = `__webpack_public_path__ + ${JSON.stringify(url)}`; 

    // 如果limit大于要处理的图片，那么应该转为base64格式
    if (shouldTransform(limit, content.toString().length)) {
        // this.resourcePath指的是当前的图片绝对路径
        const mimeType = mime.contentType(path.extname(this.resourcePath))
        const base64 = JSON.stringify(`data:${mimeType};base64,${content.toString('base64')}`);
        return `module.exports=${base64}`
    }
    // emitFile(name: string, content: Buffer|string, sourceMap: {...})
    this.emitFile(url, content, null, {}); // 发射图片到输出目录
    return `module.exports = ${publicPath}` // 使用module.exports或者exports暴露，否则require拿到的是undefined
}

function shouldTransform(limit, size) {
    return +limit >= size;
}

module.exports = myUrlLoader;
module.exports.raw = true; // 当使用base64转码的时候 需要设置raw=true
```
有个这个loader就可以正确处理图片类型了，返回路径或者base64编码，
我们来看下dist输出目录
```js
.
|____over-limit.png
|____app.ba735j.js

// 输出了一张over-limit.png图片，因为图片的size 20kb大于limit
// below-limit则被解析成base64编码，不生成图片
// 输出了入口文件main.js打包后的bundle app.js
```

现在我们只要新建一个index.html把app.js引入，在浏览器打开就可以看到两张图片，在控制台审查下dom元素，
可以看出有两个img标签分别是引用本地和base64编码的:

```html
<html lang="en"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script src="./app.js"></script>
    <img src="data:image/png;base64,wPw0ypZh6Pgg1edGfWml4DVPkuzj1UhAGRgC1EHMA+dFhlicko6....">
    <img src="./64a5fd3e.png">
</body></html>
```
### Plugin
上面我们已经能正确处理图片资源，但是有个问题我每次修改然后重新，想预览都要自己创建一个html文件，引入app.xxxxxx.js。
把入口生成的相关bundle自动插入到 `</body>` 前，这个工作完全可以交给plugin去做，接下来我们就实现一个
类似功能的插件。

**先了解下plugin的知识：**
- webpack的plugin是一个构造函数或者 `class`
- 原型上必须定义 `apply` 方法，第一个参数是 `compiler`
- 指定一个触及到compiler.hooks上的一个钩子
- 如果是使用是异步钩子，必须要调用webpack 提供的callback告知这个钩子事件执行完毕

**同步钩子和异步钩子**
```js
compiler.hooks.emit.tap('MyPlugin', (compiler) => {
  console.log('以异步方式触及 run 钩子。')
})

// 异步必须要调用webpack 提供的callback
compiler.hooks.run.tapAsync('MyPlugin', (compiler， callback) => {
    console.log('以具有延迟的异步方式触及 run 钩子')
    callback()
})
```
**准备一个index.html模版：**

```html
<!-- 将index.html文件存放在项目根目录，跟src目录同级` -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
</body>
</html>
```
#### html-webpack-plugin实现
```js
const fs = require('fs');
const path = require('path');
const BODY_RE = /<\/body>/gi;

const templatePath = path.join(__dirname, './index.html')
let templateContent = fs.readFileSync(templatePath).toString();

module.exports = class HtmlWebpackPlugin {
    apply(compiler) {
        compiler.hooks.emit.tap('HtmlWebpackPlugin', compilation => {
            // 获取webpack配置中entry对象配置打包后的文件名(这个案例只考虑spa，单入口场景)
            const entry = Object.keys(compilation.options.entry)[0];
            const publicPath = compilation.options.output.publicPath;
            // 获取这次打包生成所以chunk信息，打包生成的每个文件都叫做chunk，app.js就是一个chunk
            const entryChunks = compilation.entrypoints.get(entry).chunks[0].files; // 获取的是一个数组[app.e559fs6.js]
            // 把获取到chunks通过script标签追加至 `<body>` 尾部
            const extraScript = entryChunks.reduce((ret, chunk) => {
                return ret + `<script src=\"${publicPath}${chunk}\" ></script>\n`;
            }, '');
            // 替换extraScript字符串至body
            templateContent = templateContent.replace(BODY_RE, ($1) => extraScript + $1);

            // 把index.html文件加入assets中
            compilation.assets['index.html'] = {
                source: () => templateContent,
                size: () => templateContent.length
            }
        })
    }
}
```
至此我们的 `html-webpack-plugin` 已经实现好了, 每次修改入口相关文件后会自动更新index.html，在终端输入 `npm run watch` 试试。

