<font style="color:rgb(51, 51, 51);">Rollup是一款基于</font>`ESModule`<font style="color:rgb(51, 51, 51);">模块规范实现的</font>`JavaScript打包工具`<font style="color:rgb(51, 51, 51);">，在前端社区中赫赫有名，同时也在Vite的架构体系中发挥着重要作用。不仅是Vite生产环境下的打包工具，其插件机制也被Vite所兼容，可以说是Vite的构建基石。</font>

+ <font style="color:rgb(51, 51, 51);">Rollup的存在并不是为了取代webpack，仅仅是弥补webpack的一些不足，webpack和rollup各有各的应用场景.</font>
+ <font style="color:rgb(51, 51, 51);">专注以ESModule打包/自动treeshaking,更准确的来说rollup是小而美的打包工具</font>

# 快速体验
#### **对于浏览器:**
<font style="color:rgb(51, 51, 51);">(作为</font>`<script src="xxx.js">`<font style="color:rgb(51, 51, 51);">引入使用)</font>

 rollup main.js --file bundle.js --format iife

<font style="color:rgb(51, 51, 51);">将目标文件 main.js 编译为 自执行函数(iife)格式 生成 </font>`bundle.js`![](https://cdn.nlark.com/yuque/0/2025/webp/1427114/1743671384149-4533ceea-3e96-485d-84af-41ebe1084d9e.webp)<font style="color:rgb(51, 51, 51);"> 将编译的文件 </font>`bundle.js`<font style="color:rgb(51, 51, 51);"> 引入 </font>`index.html `<font style="color:rgb(51, 51, 51);">中使用：</font>![](https://cdn.nlark.com/yuque/0/2025/webp/1427114/1743671384089-c8ecce94-ec8e-4941-b217-0728bef66a7d.webp)

#### **对于Node.js**
```plain
# 编译为一个 CommonJS 模块 ('cjs')  
rollup main.js --file bundle.js --format cjs
```

![](https://cdn.nlark.com/yuque/0/2025/webp/1427114/1743671384345-e03b83b1-e262-4dcc-9217-dca4ce399423.webp)

#### **对于浏览器 和 Node.js**
<font style="color:rgb(51, 51, 51);">UMD格式(兼容格式)</font>

```plain
# UMD 格式需要一个包名  
rollup main.js --file bundle.js --format umd --name "myBundle"
```

![](https://cdn.nlark.com/yuque/0/2025/webp/1427114/1743671384167-207a0f13-ead7-4524-8e06-67866e633df2.webp)

## 一、本地安装
<font style="color:rgb(51, 51, 51);">首先，创建一个空的文件夹，然后使用</font>`pnpm init -y`

<font style="color:rgb(51, 51, 51);">新建一个项目，此时，打开项目会发现多了一个</font>`package.json`<font style="color:rgb(51, 51, 51);">文件。</font>

```plain
{
  "name": "rollup-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "rollup -c -w",
    "build": "rollup -c"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "packageManager": "pnpm@10.7.1",
  "dependencies": {
    "rollup": "^4.39.0"
  }
}
```

<font style="color:rgb(51, 51, 51);">接着，继续安装 rollup 依赖，命令如下。</font>

npm i rollup

<font style="color:rgb(51, 51, 51);">新增 src/index.js 和 src/util.js 和rollup.config.js 三个文件，目录结构如下所示。</font>

```plain
.
├── package.json
├── pnpm-lock.yaml
├── rollup.config.js
└── src
    ├── index.js
    └── util.js
```

<font style="color:rgb(51, 51, 51);">其中，index.js 和 util.js 和rollup.config.js 文件的内容分别如下。</font>

```plain
// src/index.js
import { add } from "./util";
console.log(add(1, 2));

// src/util.js
export const add = (a, b) => a + b;

export const multi = (a, b) => a * b;

// rollup.config.js
// 以下注释是为了能使用 VSCode 的类型提示
/**
 * @type { import('rollup').RollupOptions }
 */
const buildOptions = {
  input: ["src/index.js"],
  output: {
    // 产物输出目录
    dir: "dist/es",
    // 产物格式
    format: "esm",
  },
};
export default buildOptions;
```

<font style="color:rgb(51, 51, 51);">然后，在package.json中加入如下的构建脚本。</font>

```plain
{
  // rollup 打包命令，`-c` 表示使用配置文件中的配置
  "build": "rollup -c"
}
```

<font style="color:rgb(51, 51, 51);">接着，在终端执行一下npm run build，可以看到如下的命令行信息。</font>

![](https://cdn.nlark.com/yuque/0/2025/png/1427114/1743671384689-c9913ee9-c8ea-49c0-9e5f-6f06952217f1.png)

<font style="color:rgb(51, 51, 51);">接下来，我们打开dist/es 目录查看一下产物的内容。</font>

```plain
const add = (a, b) => a + b;
console.log(add(1, 2));
```

<font style="color:rgb(51, 51, 51);">可以发现，util.js中的multi方法并没有被打包到产物中，这是因为 Rollup 具有天然的 Tree Shaking 功能，可以分析出未使用到的模块并自动擦除。</font>

<font style="color:rgb(51, 51, 51);">所谓 Tree Shaking(摇树)，也是计算机编译原理中DCE(Dead Code Elimination，即消除无用代码) 技术的一种实现。</font>

<font style="color:rgb(51, 51, 51);">由于 ES 模块依赖关系是确定的，和运行时状态无关。</font>

<font style="color:rgb(51, 51, 51);">因此 Rollup 可以在编译阶段分析出依赖关系，对 AST 语法树中没有使用到的节点进行删除，从而实现 Tree Shaking。</font>

## 配置文件说明
1. `rollup 配置文件`<font style="color:rgb(51, 51, 51);">是</font>`可选的`<font style="color:rgb(51, 51, 51);">，但它们非常强大和方便，因此</font>`推荐使用`<font style="color:rgb(51, 51, 51);">；</font>
2. `配置文件``是`<font style="color:rgb(51, 51, 51);">一个</font>`ES模块`<font style="color:rgb(51, 51, 51);">, 它</font>`导出一个默认对象`<font style="color:rgb(51, 51, 51);">；(也可以使用 </font>`require`<font style="color:rgb(51, 51, 51);"> 和 </font>`module.exports`<font style="color:rgb(51, 51, 51);"> 编写</font>`CommonJS 模块的配置文件`<font style="color:rgb(51, 51, 51);">，但是应该将</font>`文件扩展名更改为 .cjs`<font style="color:rgb(51, 51, 51);">。)</font>
3. `配置文件`<font style="color:rgb(51, 51, 51);"> 通常为：</font>`rollup.config.js`<font style="color:rgb(51, 51, 51);"> 或 </font>`rollup.config.mjs`<font style="color:rgb(51, 51, 51);">；并</font>`位于项目的根目录中`<font style="color:rgb(51, 51, 51);">;</font>

<font style="color:rgb(51, 51, 51);">配置文件，其中包含所需的选项：</font>

```plain
// rollup.config.js
export default {
  input: "./src/main.js",      // 入口
  output: { // 必需的 出口
    file: './dist/bundle.js', // 打包后生成的文件路径及文件名
    format: 'cjs' // 模块格式
  },     
}
```

## 二、常用配置解读
### 2.1 多产物配置
<font style="color:rgb(51, 51, 51);">在打包 JavaScript 类库的场景中，我们通常需要对外暴露出不同格式的产物供他人使用，不仅包括 ESM，也需要包括诸如CommonJS、UMD等格式，保证良好的兼容性。那么，同一份入口文件，如何让 Rollup 给我们打包出不一样格式的产物呢？为了实现这一需求，我们基于上述的配置文件来进行如下修改。</font>

```plain
// rollup.config.js
/**
 * @type { import('rollup').RollupOptions }
 */
const buildOptions = {
  input: ["src/index.js"],
  // 将 output 改造成一个数组
  output: [
    {
      dir: "dist/es",
      format: "esm",
    },
    {
      dir: "dist/cjs",
      format: "cjs",
    },
  ],
};

export default buildOptions;
```

<font style="color:rgb(51, 51, 51);">从代码中可以看到，我们将output属性配置成一个数组，数组中每个元素都是一个描述对象，决定了不同产物的输出行为。</font>

### 2.2 多入口配置
<font style="color:rgb(51, 51, 51);">除了多产物配置，Rollup 中也支持多入口配置，而且通常情况下两者会被结合起来使用。接下来，就让我们继续改造之前的配置文件，将 input 设置为一个数组或者一个对象，如下所示。</font>

```plain
{
  input: ["src/index.js", "src/util.js"]
}
// 或者
{
  input: {
    index: "src/index.js",
    util: "src/util.js",
  },
}
```

<font style="color:rgb(51, 51, 51);">然后，再次执行npm run build。可以发现，所有入口的不同格式产物已经成功输出。</font>

![](https://cdn.nlark.com/yuque/0/2025/png/1427114/1743671384868-d48c2fae-e5bd-4bed-b3be-26d4b757d9e1.png)

<font style="color:rgb(51, 51, 51);">如果不同入口对应的打包配置不一样，我们也可以使用默认的配置来导出一个配置数组，如下所示。</font>

```plain
// rollup.config.js

/**
 * @type { import('rollup').RollupOptions }
 */
const buildIndexOptions = {
  input: ["src/index.js"],
  output: [
    // 省略 output 配置
  ],
};
/**
 * @type { import('rollup').RollupOptions }
 */
const buildUtilOptions = {
  input: ["src/util.js"],
  output: [
    // 省略 output 配置
  ],
};

export default [buildIndexOptions, buildUtilOptions];
```

<font style="color:rgb(51, 51, 51);">如果是比较复杂的打包场景(如 Vite 源码本身的打包)，我们需要将项目的代码分成几个部分，用不同的 Rollup 配置分别打包。</font>

### 2.3 自定义output配置
<font style="color:rgb(51, 51, 51);">前面我们提到了input的使用，主要用来声明入口，可以配置成字符串、数组或者对象，使用比较简单。而output与之相对，用来配置输出的相关信息，常用的</font>[配置项](https://cn.rollupjs.org/configuration-options/)<font style="color:rgb(51, 51, 51);">如下。</font>

```plain
output: {
  // 产物输出目录
  dir: path.resolve(__dirname, 'dist'),
  // 以下三个配置项都可以使用这些占位符:
  // 1. [name]: 去除文件后缀后的文件名
  // 2. [hash]: 根据文件名和文件内容生成的 hash 值
  // 3. [format]: 产物模块格式，如 es、cjs
  // 4. [extname]: 产物后缀名(带`.`)
  // 入口模块的输出文件名
  entryFileNames: `[name].js`,
  // 非入口模块(如动态 import)的输出文件名
  chunkFileNames: 'chunk-[hash].js',
  // 静态资源文件输出文件名
  assetFileNames: 'assets/[name]-[hash][extname]',
  // 产物输出格式，包括`amd`、`cjs`、`es`、`iife`、`umd`、`system`
  format: 'cjs',
  // 是否生成 sourcemap 文件
  sourcemap: true,
  // 如果是打包出 iife/umd 格式，需要对外暴露出一个全局变量，通过 name 配置变量名
  name: 'MyBundle',
  // 全局变量声明
  globals: {
    // 项目中可以直接用`$`代替`jquery`
    jquery: '$'
  }
}
```

### 2.4 依赖 external
<font style="color:rgb(51, 51, 51);">对于某些第三方包，有时候我们不想让 Rollup 进行打包，也可以通过 external 进行外部化，配置如下。</font>

```javascript
import { fileURLToPath } from 'node:url';

// 1.获取当前目录
export default {
  /* ..., */
  // 为 <currentdir>/package.json 生成绝对路径
  external: [fileURLToPath(new URL('package.json', import.meta.url))]
};

// 2.导入 package.json
import pkg from './package.json' with { type: 'json' };

export default {
  // Mark package dependencies as "external". Rest of configuration
  // omitted.
  external: Object.keys(pkg.dependencies)
};
```

<font style="color:rgb(51, 51, 51);">在 SSR 构建或者使用 ESM </font>[CDN](https://cloud.tencent.com/product/cdn?from_column=20065&from=20065)<font style="color:rgb(51, 51, 51);"> 的场景中，这个配置将非常有用</font>

### 2.5 接入插件
<font style="color:rgb(51, 51, 51);">在Rollup的日常使用中，我们难免会遇到一些Rollup本身不支持的场景，比如兼容CommonJS打包、注入环境变量、配置路径别名、压缩产物代码等等。这个时候就需要我们引入相应的Rollup插件了。接下来以一个具体的场景为例带大家熟悉一下Rollup插件的使用。</font>

<font style="color:rgb(51, 51, 51);">虽然Rollup能够打包输出出CommonJS格式的产物，但对于输入给Rollup的代码并不支持CommonJS，仅仅支持ESM。你可能会说，那我们直接在项目中统一使用ESM规范就可以了啊，这有什么问题呢？需要注意的是，我们不光要考虑项目本身的代码，还要考虑第三方依赖。目前为止，还是有不少第三方依赖只有CommonJS格式产物而并未提供ESM产物，比如项目中用到lodash时，打包项目会出现这样的报错：</font>

![](https://cdn.nlark.com/yuque/0/2025/png/1427114/1743671384738-c0d9f55a-d2f3-446d-b689-ea64e4d839e3.png)

<font style="color:rgb(51, 51, 51);">所以，我们需要引入额外的插件去解决这个问题，我们需要安装两个核心的插件包。</font>

pnpm i @rollup/plugin-node-resolve @rollup/plugin-commonjs 

<font style="color:rgb(51, 51, 51);">关于这两个插件包的说明如下：</font>

+ `@rollup/plugin-node-resolve`<font style="color:rgb(51, 51, 51);">是为了允许我们加载第三方依赖，rollup默认只能以文件路径的形式加载模块，否则像import React from ‘react’ 的依赖导入语句将不会被 Rollup 识别。</font>
+ `@rollup/plugin-commonjs `<font style="color:rgb(51, 51, 51);">的作用是将 CommonJS 格式的代码转换为 ESM 格式 在rollup中导入commonjs模块默认是不支持的.</font>

<font style="color:rgb(51, 51, 51);">然后，我们在配置文件中导入这些插件，相关的配置如下：</font>

```plain
// rollup.config.js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

/**
 * @type { import('rollup').RollupOptions }
 */
export default {
  input: ["src/index.js"],
  output: [
    {
      dir: "dist/es",
      format: "esm",
    },
    {
      dir: "dist/cjs",
      format: "cjs",
    },
  ],
  // 通过 plugins 参数添加插件
  plugins: [resolve(), commonjs()],
};
```

<font style="color:rgb(51, 51, 51);">现在，我们以lodash这个只有 CommonJS 产物的第三方包为例测试一下。</font>

npm i lodash

<font style="color:rgb(51, 51, 51);">然后，在</font>`src/index.js `<font style="color:rgb(51, 51, 51);">加入如下的代码。</font>

```plain
import { merge } from "lodash";
console.log(merge);
```

<font style="color:rgb(51, 51, 51);">然后，执行 </font>`npm run build`<font style="color:rgb(51, 51, 51);">命令，就可以发现产物已经正常生成了，如下图所示。</font>

![](https://cdn.nlark.com/yuque/0/2025/png/1427114/1743671384995-8c934a8d-3804-4388-baa4-711c889cab66.png)

<font style="color:rgb(51, 51, 51);">在Rollup配置文件中，plugins除了可以与output配置在同一级，也可以配置在output参数里面。</font>

```plain
// rollup.config.js
import { terser } from 'rollup-plugin-terser'
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  output: {
    // 加入 terser 插件，用来压缩代码
    plugins: [terser()]
  },
  plugins: [resolve(), commonjs()]
}
```

<font style="color:rgb(51, 51, 51);">需要注意的是，output.plugins中配置的插件是有一定限制的，只有使用Output 阶段相关钩子的插件才能够放到这个配置中，大家可以去</font>[这个站点](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fgithub.com%2Frollup%2Fawesome%23output&objectId=2290438&objectType=1&isNewArticle=undefined)<font style="color:rgb(51, 51, 51);">查看 Rollup 的 Output 插件列表。这里也给大家分享其它一些比较常用的 Rollup 插件库：</font>

+ `@rollup/plugin-json`<font style="color:rgb(51, 51, 51);">： 支持.json的加载，并配合rollup的Tree Shaking机制去掉未使用的部分，进行按需打包。</font>
+ `@rollup/plugin-babel`<font style="color:rgb(51, 51, 51);">：在 Rollup 中使用 Babel 进行 JS 代码的语法转译。</font>
+ `@rollup/plugin-typescript2`<font style="color:rgb(51, 51, 51);">: 支持使用 TypeScript 开发。</font>
+ `@rollup/plugin-alias`<font style="color:rgb(51, 51, 51);">：支持别名配置。</font>
+ `@rollup/plugin-replace`<font style="color:rgb(51, 51, 51);">：在 Rollup 进行变量字符串的替换。</font>
+ `rollup-plugin-visualizer`<font style="color:rgb(51, 51, 51);">: 对 Rollup 打包产物进行分析，自动生成产物体积可视化分析图。</font>
+ `rollup-plugin-livereload`<font style="color:rgb(51, 51, 51);">: </font>

## 三、JavaScript API
<font style="color:rgb(51, 51, 51);">我们通过Rollup的配置文件结合rollup -c完成了 Rollup 的打包过程，但有些场景下我们需要基于 Rollup 定制一些打包过程，配置文件就不够灵活了，这时候我们需要用到对应 JavaScript API 来调用 Rollup，主要分为rollup.rollup和rollup.watch两个 API，接下来我们以具体的例子来学习一下。</font>

<font style="color:rgb(51, 51, 51);">首先是</font>`rollup.rollup`<font style="color:rgb(51, 51, 51);">，用来一次性地进行 Rollup 打包，可以新建一个build.js文件，内容如下。</font>

```plain
// build.js
const rollup = require("rollup");

// 常用 inputOptions 配置
const inputOptions = {
  input: "./src/index.js",
  external: [],
  plugins:[]
};

const outputOptionsList = [
  // 常用 outputOptions 配置
  {
    dir: 'dist/es',
    entryFileNames: `[name].[hash].js`,
    chunkFileNames: 'chunk-[hash].js',
    assetFileNames: 'assets/[name]-[hash][extname]',
    format: 'es',
    sourcemap: true,
    globals: {
      lodash: '_'
    }
  }
  // 省略其它的输出配置
];

async function build() {
  let bundle;
  let buildFailed = false;
  try {
    // 1. 调用 rollup.rollup 生成 bundle 对象
    bundle = await rollup.rollup(inputOptions);
    for (const outputOptions of outputOptionsList) {
      // 2. 拿到 bundle 对象，根据每一份输出配置，调用 generate 和 write 方法分别生成和写入产物
      const { output } = await bundle.generate(outputOptions);
      await bundle.write(outputOptions);
    }
  } catch (error) {
    buildFailed = true;
    console.error(error);
  }
  if (bundle) {
    // 最后调用 bundle.close 方法结束打包
    await bundle.close();
  }
  process.exit(buildFailed ? 1 : 0);
}

build();
```

<font style="color:rgb(51, 51, 51);">让我们来解释一下上面的代码：</font>

+ <font style="color:rgb(51, 51, 51);">通过 rollup.rollup方法，传入 inputOptions，生成 bundle 对象；</font>
+ <font style="color:rgb(51, 51, 51);">调用 bundle 对象的 generate 和 write 方法，传入outputOptions，分别完成产物和生成和磁盘写入。</font>
+ <font style="color:rgb(51, 51, 51);">调用 bundle 对象的 close 方法来结束打包。</font>

<font style="color:rgb(51, 51, 51);">接着，执行node build.js命令。这样，我们就可以完成了以编程的方式来调用 Rollup 打包的过程。除了通过rollup.rollup完成一次性打包，我们也可以通过rollup.watch来完成watch模式下的打包，即每次源文件变动后自动进行重新打包。你可以新建watch.js文件，配置如下。</font>

```plain
// watch.js
const rollup = require("rollup");

const watcher = rollup.watch({
  // 和 rollup 配置文件中的属性基本一致，只不过多了`watch`配置
  input: "./src/index.js",
  output: [
    {
      dir: "dist/es",
      format: "esm",
    },
    {
      dir: "dist/cjs",
      format: "cjs",
    },
  ],
  watch: {
    exclude: ["node_modules/**"],
    include: ["src/**"],
  },
});

// 监听 watch 各种事件
watcher.on("restart", () => {
  console.log("重新构建...");
});

watcher.on("change", (id) => {
  console.log("发生变动的模块id: ", id);
});

watcher.on("event", (e) => {
  if (e.code === "BUNDLE_END") {
    console.log("打包信息:", e);
  }
});
```

<font style="color:rgb(51, 51, 51);">现在，我们可以通过执行node watch.js开启 Rollup 的 watch 打包模式，当你改动一个文件后可以看到如下的日志，说明 Rollup 自动进行了重新打包，并触发相应的事件回调函数。</font>

```plain
发生生变动的模块id: /xxx/src/index.js
重新构建...
打包信息: {
  code: 'BUNDLE_END',
  duration: 10,
  input: './src/index.js',
  output: [
    // 输出产物路径
  ],
  result: {
    cache: { /* 产物具体信息 */ },
    close: [AsyncFunction: close],
    closed: false,
    generate: [AsyncFunction: generate],
    watchFiles: [
      // 监听文件列表
    ],
    write: [AsyncFunction: write]
  }
}
```

<font style="color:rgb(51, 51, 51);">基于如上的两个 JavaScript API 我们可以很方便地在代码中调用 Rollup 的打包流程，相比于配置文件有了更多的操作空间，你可以在代码中通过这些 API 对 Rollup 打包过程进行定制，甚至是二次开发。</font>

## 构建库以及整个应用程序
```plain
// 库
lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'MyLib',
      // 将添加适当的扩展名后缀
      formats: ['es', 'iife'],
      fileName: (format) => `my-lib.${format}.js`,
    },
```

```plain
// 应用程序
outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
```

## rollup 配置选项说明
<font style="color:rgb(51, 51, 51);">配置文件的配置选项主要分为： </font>`核心功能`<font style="color:rgb(51, 51, 51);">,</font>`进阶功能`<font style="color:rgb(51, 51, 51);">, </font>`慎用选项`<font style="color:rgb(51, 51, 51);">,</font>`实验选项`<font style="color:rgb(51, 51, 51);">,</font>`观察选项`<font style="color:rgb(51, 51, 51);">,</font>`废弃选项`<font style="color:rgb(51, 51, 51);">; 具体的配置文件的配置选项说明可以查看中文官网： </font>[配置选项](https://link.juejin.cn?target=https%3A%2F%2Fwww.rollupjs.com%2Fconfiguration-options%2F)<font style="color:rgb(51, 51, 51);"> rollup 配置文件基本结构： </font>![](https://cdn.nlark.com/yuque/0/2025/webp/1427114/1743671384828-eeb7a20a-2ead-45d0-9434-8f82b38a29aa.webp)<font style="color:rgb(51, 51, 51);"> rollup配置文件，支持 </font>`单文件(单个)配置`<font style="color:rgb(51, 51, 51);"> 或 </font>`多文件(多个)配置`<font style="color:rgb(51, 51, 51);">;</font>

```plain
// rollup.config.js

// 可以是数组（即多个输入源）
export default {
    // 核心输入选项
    external,
    input, // 有条件地需要
    plugins,

    // 进阶输入选项
    cache,
    logLevel,
    makeAbsoluteExternalsRelative,
    maxParallelFileOps,
    onLog,
    onwarn,
    preserveEntrySignatures,
    strictDeprecations,

    // 危险区域
    acorn,
    acornInjectPlugins,
    context,
    moduleContext,
    preserveSymlinks,
    shimMissingExports,
    treeshake,

    // 实验性
    experimentalCacheExpiry,
    experimentalLogSideEffects,
    experimentalMinChunkSize,
    perf,

    // 必需（可以是数组，用于描述多个输出）
    output: {
        // 核心输出选项
        dir,
        file,
        format,
        globals,
        name,
        plugins,

        // 进阶输出选项
        assetFileNames,
        banner,
        chunkFileNames,
        compact,
        dynamicImportInCjs,
        entryFileNames,
        extend,
        externalImportAssertions,
        footer,
        generatedCode,
        hoistTransitiveImports,
        inlineDynamicImports,
        interop,
        intro,
        manualChunks,
        minifyInternalExports,
        outro,
        paths,
        preserveModules,
        preserveModulesRoot,
        sourcemap,
        sourcemapBaseUrl,
        sourcemapExcludeSources,
        sourcemapFile,
        sourcemapFileNames,
        sourcemapIgnoreList,
        sourcemapPathTransform,
        validate,

        // 危险区域
        amd,
        esModule,
        exports,
        externalLiveBindings,
        freeze,
        indent,
        noConflict,
        sanitizeFileName,
        strict,
        systemNullSetters,

        // 实验性
        experimentalMinChunkSize
    },

    watch: {
        buildDelay,
        chokidar,
        clearScreen,
        exclude,
        include,
        skipWrite
    }
};
```

1. <font style="color:rgb(51, 51, 51);">创建 Rollup配置文件：项目</font>`根目录创建``rollup.config.js`<font style="color:rgb(51, 51, 51);"> 文件, 根据需要并定义如上相关配置;</font>
2. <font style="color:rgb(51, 51, 51);">完成相关操作后，Rollup 可以在项目的根目录中运行;</font>

<font style="color:rgb(51, 51, 51);">安装完成后，Rollup 可以在项目的根目录中运行： </font>`npx rollup --config`<font style="color:rgb(51, 51, 51);"> 或使用 Yarn: </font>`yarn rollup --config`<font style="color:rgb(51, 51, 51);">，这是用配置文件方式执行(需要定义配置文件);</font>

## Rollup兼容性
+ <font style="color:rgb(51, 51, 51);">Rollup 可以通过插件 </font>`导入现有的CommonJS模块`<font style="color:rgb(51, 51, 51);">。</font>
+ <font style="color:rgb(51, 51, 51);">发布 ES 模块。 为了确保你的 ES 模块可以立即被处理 CommonJS 的工具，例如 Node.js 和 webpack 使用，你可以使用 Rollup 编译成 UMD 或 CommonJS 格式，然后在 </font>`package.json`<font style="color:rgb(51, 51, 51);"> 文件中使用 </font>`main`<font style="color:rgb(51, 51, 51);"> 属性指向编译后的版本。如果你的 </font>`package.json`<font style="color:rgb(51, 51, 51);"> 文件还有一个 </font>`module`<font style="color:rgb(51, 51, 51);"> 字段，那么像 Rollup 和 </font>[webpack 2+](https://link.juejin.cn?target=https%3A%2F%2Fwebpack.js.org%2F)<font style="color:rgb(51, 51, 51);"> 这样的可感知 ES 模块的工具将直接 </font>[导入 ES 模块版本](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Frollup%2Frollup%2Fwiki%2Fpkg.module)<font style="color:rgb(51, 51, 51);">。</font>

## 命令行标志以及使用
### 命令行标志
<font style="color:rgb(51, 51, 51);">终端命令行使用标志的含义，上述我们经常使用：</font>`rollup --config --bundleConfigAsCjs`<font style="color:rgb(51, 51, 51);">, </font>`rollup -c --bundleConfigAsCjs`<font style="color:rgb(51, 51, 51);">,</font><font style="color:rgb(51, 51, 51);"> 许多选项都有等效的命令行标志。这些情况下，如果你正在使用配置文件(</font>`rollup.config.js`<font style="color:rgb(51, 51, 51);">),则此处传递的任何参数都将覆盖配置文件。即 </font>`命令行传递的参数优先级更高，能覆盖配置文件中的定义。`

```plain
rollup -c, --config <filename> 使用此配置文件  
（如果使用参数但未指定值，则默认为 rollup.config.js）  
-d, --dir <dirname> 用于块的目录（如果不存在，则打印到 stdout）  
-e, --external <ids> 排除模块 ID 的逗号分隔列表  
-f, --format <format> 输出类型（amd、cjs、es、iife、umd、system）  
-g, --globals <pairs> `moduleID:Global` 对的逗号分隔列表  
-h, --help 显示此帮助消息  
-i, --input <filename> 输入（替代 <entry file>）  
-m, --sourcemap 生成源映射（`-m inline` 为内联映射）  
-n, --name <name> UMD 导出的名称  
-o, --file <output> 单个输出文件（如果不存在，则打印到 stdout）  
-p, --plugin <plugin> 使用指定的插件（可重复）  
-v, --version 显示版本号  
-w, --watch 监视产物文件并在更改时重新构建  
--amd.autoId 基于块名称生成 AMD ID  
--amd.basePath <prefix> 要预先添加到自动生成的 AMD ID 的路径  
--amd.define <name> 在 `define` 位置使用的函数  
--amd.forceJsExtensionForImports 在 AMD 导入中使用 `.js` 扩展名  
--amd.id <id> AMD 模块的 ID（默认为匿名）  
--assetFileNames <pattern> 发布资源的名称模式  
--banner <text> 在产物顶部插入的代码（位于包装器之外）  
--chunkFileNames <pattern> 发布次要块的名称模式  
--compact 缩小包装器代码  
--context <variable> 指定顶级 `this` 值  
--no-dynamicImportInCjs 将外部动态 CommonJS 导入编写为 require  
--entryFileNames <pattern> 发布入口块的名称模式  
--environment <values> 传递给配置文件的设置（请参阅示例）  
--no-esModule 不添加 __esModule 属性  
--exports <mode> 指定导出模式（auto、default、named、none）  
--extend 扩展由 --name 定义的全局变量  
--no-externalImportAssertions 在 "es" 输出中省略导入断言  
--no-externalLiveBindings 不生成支持实时绑定的代码  
--failAfterWarnings 如果生成的构建产生警告，则退出并显示错误  
--filterLogs <filter> 过滤日志信息  
--footer <text> 在产物底部插入的代码（位于包装器之外）  
--no-freeze 不冻结命名空间对象  
--generatedCode <preset> 使用哪些代码特性（es5/es2015）  
--generatedCode.arrowFunctions 在生成的代码中使用箭头函数  
--generatedCode.constBindings 在生成的代码中使用 "const"  
--generatedCode.objectShorthand 在生成的代码中使用简写属性  
--no-generatedCode.reservedNamesAsProps 始终引用保留名称作为 props  
--generatedCode.symbols 在生成的代码中使用符号  
--no-hoistTransitiveImports 不将中转导入提升到入口块中  
--no-indent 不缩进结果  
--inlineDynamicImports 使用动态导入时创建单次打包  
--no-interop 不包括交互操作块  
--intro <text> 在产物顶部插入的代码（位于包装器内部）  
--logLevel <level> 要显示哪种类型的日志  
--no-makeAbsoluteExternalsRelative 不规范化外部导入  
--maxParallelFileOps <value> 并行读取的文件数  
--minifyInternalExports 强制或禁用内部导出的缩小  
--noConflict 为 UMD 全局生成 noConflict 方法  
--outro <text> 在产物底部插入的代码（位于包装器内部）  
--perf 显示性能计时  
--no-preserveEntrySignatures 避免入口点的门面块  
--preserveModules 保留模块结构  
--preserveModulesRoot 将保留的模块放置在根路径下的此路径下  
--preserveSymlinks 解析文件时不要跟随符号链接  
--no-sanitizeFileName 不要替换文件名中的无效字符  
--shimMissingExports 为丢失的导出创建卡扣变量  
--silent 不打印警告  
--sourcemapBaseUrl <url> 使用给定的基本 URL 发出绝对源映射 URL  
--sourcemapExcludeSources 在源映射中不包括源代码  
--sourcemapFile <file> 指定源映射的包位置  
--sourcemapFileNames <pattern> 编译后 sourcemap 的命名模式  
--stdin=ext 指定用于标准输入的文件扩展名  
--no-stdin 不要从 stdin 读取 "-"  
--no-strict 不在生成的模块中发出 `"use strict";`  
--strictDeprecations 抛出有关不推荐使用的功能的错误  
--no-systemNullSetters 不要将空的 SystemJS setter 替换为 `null`  
--no-treeshake 禁用除屑优化  
--no-treeshake.annotations 忽略纯调用注释  
--treeshake.correctVarValueBeforeDeclaration 在声明之前将变量取消优化  
--treeshake.manualPureFunctions <names> 手动将函数声明为纯函数  
--no-treeshake.moduleSideEffects 假设模块没有副作用  
--no-treeshake.propertyReadSideEffects 忽略属性访问副作用  
--no-treeshake.tryCatchDeoptimization 不要关闭 try-catch-tree-shaking  
--no-treeshake.unknownGlobalSideEffects 假设未知的全局变量不会抛出异常  
--validate 验证输出  
--waitForBundleInput 等待打包输入文件  
--watch.buildDelay <number> 节流观察重建  
--no-watch.clearScreen 重建时不要清除屏幕  
--watch.exclude <files> 排除要观察的文件  
--watch.include <files> 限制观察到指定文件  
--watch.onBundleEnd <cmd> 在 "BUNDLE_END" 事件上运行的 Shell 命令  
--watch.onBundleStart <cmd> 在 "BUNDLE_START" 事件上运行的 Shell 命令  
--watch.onEnd <cmd> 在 "END" 事件上运行的 Shell 命令  
--watch.onError <cmd> 在 "ERROR" 事件上运行的 Shell 命令  
--watch.onStart <cmd> 在 "START" 事件上运行的 Shell 命令  
--watch.skipWrite 在监视时不要将文件写入磁盘
```

### 命令行参数使用说明
`**以下命令行标志仅通过命令行界面可用。所有其他标志都对应并覆盖其配置文件等效项。**`

`**--bundleConfigAsCjs**`<font style="color:rgb(51, 51, 51);">： 此选项将强制将你的配置转译为CommonJS。 这允许你在配置中使用CommonJS常用的变量/方法，例如</font>`__dirname`<font style="color:rgb(51, 51, 51);">或</font>`require.resolve`<font style="color:rgb(51, 51, 51);">,即使配置本身是作为ES模块编写的。</font>

`**--environment <values>**`<font style="color:rgb(51, 51, 51);">：通过 </font>`process.ENV`<font style="color:rgb(51, 51, 51);">传递其他设置到配置文件。</font>

<font style="color:rgb(51, 51, 51);">通过命令行参数传递参数，在项目文件中可以获取到传递过来的变量。</font>

rollup -c --environment INCLUDE_DEPS,BUILD:production

![](https://cdn.nlark.com/yuque/0/2025/webp/1427114/1743671385306-b725de8d-df70-484c-b6a6-f62650537ed9.webp)

`其他命令行标识，请查看文档!!`[click here](https://link.juejin.cn?target=https%3A%2F%2Fwww.rollupjs.com%2Fcommand-line-interface%2F%23environment-values)

## 遇到的问题
1. <font style="color:rgb(51, 51, 51);">如果配置文件为：</font>`rollup.config.js`<font style="color:rgb(51, 51, 51);"> 采用 </font>`ES模块方式编写`<font style="color:rgb(51, 51, 51);">, </font>`打包编译`<font style="color:rgb(51, 51, 51);">命令使用 </font>`rollup --config`<font style="color:rgb(51, 51, 51);"> 或 </font>`rollup -c`<font style="color:rgb(51, 51, 51);">,则会 </font>`报错`<font style="color:rgb(51, 51, 51);">;</font>

**<font style="color:rgb(51, 51, 51);">原因：</font>**`Node会尝试将配置文件使用CommonJS模块方式进行加载`<font style="color:rgb(51, 51, 51);">,</font>`即使它可能是一个ES模块`<font style="color:rgb(51, 51, 51);">(export default{} 方式)，</font>`除非在命令行中使用``--bundleConfigAsCjs`<font style="color:rgb(51, 51, 51);"> 或 </font>`--configPlugin`<font style="color:rgb(51, 51, 51);"> 选项，否则 Rollup 将直接使用 Node 导入该文件。</font>

![](https://cdn.nlark.com/yuque/0/2025/webp/1427114/1743671385397-404aeac7-116f-4953-b46b-216e89288bd5.webp)

**<font style="color:rgb(51, 51, 51);">解决方式：</font>****<font style="color:rgb(51, 51, 51);">方式一：</font>**<font style="color:rgb(51, 51, 51);"> 将配置文件由 </font>`rollup.config.js`<font style="color:rgb(51, 51, 51);"> 改为 </font>`rollup.config.mjs`<font style="color:rgb(51, 51, 51);">; </font>![](https://cdn.nlark.com/yuque/0/2025/webp/1427114/1743671385462-eadec871-55e9-4ded-8ebd-cf5e4cd1d363.webp)

**<font style="color:rgb(51, 51, 51);">方式二：</font>**`package.json`<font style="color:rgb(51, 51, 51);">方式的，在 </font>`package.json`<font style="color:rgb(51, 51, 51);"> 中，添加 </font>`type: "module"`<font style="color:rgb(51, 51, 51);">; </font>![](https://cdn.nlark.com/yuque/0/2025/webp/1427114/1743671385533-593b60d3-8eea-4f10-9050-c7756fb780fb.webp)

**<font style="color:rgb(51, 51, 51);">方式三：</font>**<font style="color:rgb(51, 51, 51);"> 根据实际情况，</font>`增加命令行参数 --bundleConfigAsCjs 或 --configPlugin`<font style="color:rgb(51, 51, 51);">;</font>`--bundleConfigAsCjs`<font style="color:rgb(51, 51, 51);">: </font>`此选项将强制将你的配置转译为 CommonJS 。`![](https://cdn.nlark.com/yuque/0/2025/webp/1427114/1743671386178-bc0d18e1-2b74-4cc5-b9dd-1953332522bb.webp)

`**rollup的配置文件也可以采用CommonJS模块方式编写**`**<font style="color:rgb(51, 51, 51);">，但是</font>**`**应该把文件扩展名更改为**`**<font style="color:rgb(51, 51, 51);">: </font>**`**.cjs**`**<font style="color:rgb(51, 51, 51);">;</font>**![](https://cdn.nlark.com/yuque/0/2025/webp/1427114/1743671386002-c0fbd655-ed8a-43ca-9305-9f779231c2af.webp)

**<font style="color:rgb(51, 51, 51);">要注意，如果使用 ES模块方式编写配置文件</font>****<font style="color:rgb(51, 51, 51);">请注意，使用原生 Node ES模块 时存在一些注意事项，因为 Rollup 将遵循 Node ESM 语义。</font>**

**<font style="color:rgb(51, 51, 51);">原生 Node ES 模块时的注意事项：</font>**

<font style="color:rgb(51, 51, 51);">获取当前目录： </font>

+ <font style="color:rgb(51, 51, 51);">__dirname</font>

<font style="color:rgb(51, 51, 51);">在原生ES模块中不支持。</font>

+ <font style="color:rgb(51, 51, 51);">建议使用 fileURLToPath</font>

```plain
// rollup.config.js
import {fileURLToPath} from "node:url"
export default {
  ...,
  external: [
  // 当前所在目录下得绝对路径
  fileURLToPath(new URL('src/some-file.js', import.meta.url))
  ]
}
```

+ <font style="color:rgb(51, 51, 51);">导入 package.json。</font>
    - <font style="color:rgb(51, 51, 51);">对于 Node 17.5+ 可以使用导入断言 </font>![](https://cdn.nlark.com/yuque/0/2025/webp/1427114/1743671385808-ad7ff805-fb18-489b-8ebb-92733226bd85.webp)
    - <font style="color:rgb(51, 51, 51);">对于node旧版本,可以使用 </font>`createRequire`![](https://cdn.nlark.com/yuque/0/2025/webp/1427114/1743671386250-7f706337-81ab-42ea-abc4-f9b21d32094a.webp)
1. <font style="color:rgb(51, 51, 51);">为什么有rollup -w命令行 还需要插件rollup-plugin-livereload</font>

`rollup -w`<font style="color:rgb(51, 51, 51);"> 和 </font>`rollup-plugin-livereload`<font style="color:rgb(51, 51, 51);"> 虽然都涉及文件监听，但功能定位不同，需结合使用以提升开发体验：</font>

### 1. **功能差异**
+ `**rollup -w**`**<font style="color:rgb(51, 51, 51);">（监听模式）</font>**<font style="color:rgb(51, 51, 51);">仅监听源文件变化并重新打包，但不会自动刷新浏览器。需手动刷新页面才能看到更新后的效果.</font>
+ `**rollup-plugin-livereload**`<font style="color:rgb(51, 51, 51);">在文件变化时自动刷新浏览器页面（LiveReload），无需手动操作。通常需配合开发服务器（如 </font>`rollup-plugin-serve`<font style="color:rgb(51, 51, 51);">）使用.</font>

### 2. **典型使用场景**
+ <font style="color:rgb(51, 51, 51);">开发环境配置示例</font>

<font style="color:rgb(51, 51, 51);">需同时启用监听和自动刷新：</font>

```plain
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
  plugins: [
    serve({ open: true, port: 8080 }), // 启动本地服务器
    livereload(),                      // 监听文件变化并刷新浏览器
  ],
  watch: { exclude: 'node_modules/**' } // 等同于 rollup -w
};
```

<font style="color:rgb(51, 51, 51);">这样修改代码后，浏览器会自动刷新以展示最新打包结果。</font>

### 3. **为何需要两者配合？**
+ `**rollup -w**`**<font style="color:rgb(51, 51, 51);"> 的局限性</font>**<font style="color:rgb(51, 51, 51);">仅重新生成打包文件（如 </font>`dist/bundle.js`<font style="color:rgb(51, 51, 51);">），但若页面未刷新，浏览器仍运行旧代码。</font>
+ `**livereload**`**<font style="color:rgb(51, 51, 51);"> 的补充作用</font>**<font style="color:rgb(51, 51, 51);">监听打包后文件（如 </font>`dist/`<font style="color:rgb(51, 51, 51);"> 目录），触发浏览器刷新，确保运行最新代码。</font>

### 4. **其他注意事项**
+ <font style="color:rgb(51, 51, 51);">性能优化</font>

<font style="color:rgb(51, 51, 51);">生产环境应移除</font>`livereload`<font style="color:rgb(51, 51, 51);">和</font>`serve`<font style="color:rgb(51, 51, 51);">插件，仅保留</font>`rollup -w`<font style="color:rgb(51, 51, 51);">用于开发监听</font>

+ <font style="color:rgb(51, 51, 51);">插件协同</font>

<font style="color:rgb(51, 51, 51);">若使用热更新（HMR）替代 LiveReload，需搭配</font>`@rollup/plugin-hot`<font style="color:rgb(51, 51, 51);">，但配置更复杂。</font>

<font style="color:rgb(51, 51, 51);">总结：</font>`rollup -w`<font style="color:rgb(51, 51, 51);"> 负责代码重打包，</font>`livereload`<font style="color:rgb(51, 51, 51);"> 负责浏览器刷新，两者协作实现高效开发流程。</font>

<font style="color:rgb(51, 51, 51);"></font>

## <font style="color:rgb(51, 51, 51);">参考链接</font>
[构建打包工具Rollup.js入门指南](https://mp.weixin.qq.com/s?__biz=MzIyMDc3NTEyNA==&mid=2247483960&idx=1&sn=9bb76d296ba15e9b1412442b3de3f4d3&chksm=96ea6479218c23fb715f0f433a5ae6e9c918787b19397bd7640eae4948de6cbcf8c5ed42c857#rd)

[Rollup常用配置](https://mp.weixin.qq.com/s?__biz=MzAwMTY0NTQ0OQ==&mid=2653059704&idx=1&sn=00e8302fa1f917f9501b7702a17a11a7&chksm=80e8f6b7b3dd9e3eb6541824dba527e5b83eff9c1090606fe36db42faad562e884b450abf2b4#rd)

[Rollup：模块打包利器与实战解析-CSDN博客](https://blog.csdn.net/handsomezhanghui/article/details/109355504)

[使用 Rollup 创建具有 CommonJS 和 ESM 支持的 NPM 包-PHP中文网](https://www.php.cn/faq/1048752.html)

[使用 npm · rollup.js 中文文档 · 看云](https://www.kancloud.cn/yunye/rollup/327467)

[深入理解 Rollup 的插件机制--vite-腾讯云开发者社区-腾讯云](https://cloud.tencent.com/developer/article/2359560?from=15425)

[Rollup系列之安装和入门_rollup离线安装-CSDN博客](https://blog.csdn.net/weixin_44072254/article/details/146774733)

[Rollup 的使用指南](https://mp.weixin.qq.com/s?__biz=MzIyOTY0MTc2MA==&mid=2247484720&idx=1&sn=fe4ea5be1dd4a3b9d860beeda2f8cd42&chksm=e99eb2b12fc4e3b55a4a7d934008b212f47e6f206d832bbcda48db896785a4968eda56ef7ff5#rd)

[Rollup](https://cn.rollupjs.org/faqs/#why-isnt-node-resolve-a-built-in-feature)

