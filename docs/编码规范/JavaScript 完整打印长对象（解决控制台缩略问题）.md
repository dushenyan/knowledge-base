# 教程：JavaScript 完整打印长对象（解决控制台缩略问题）

> 话题引入  是因为我在将JSON格式时候 需要去除键值的双引号 直接打印能去除掉 但是打印出长对象时候会只显示浅层（2-3）层

在开发中，我们经常遇到控制台打印复杂 / 长对象时内容被缩略（比如显示 `[Object]`、截断数组、隐藏深层嵌套属性）的问题。本教程将提供**跨环境（Node.js/ 浏览器）** 的解决方案，并封装成通用工具函数，让你一键打印完整对象。

## 一、核心问题分析

控制台默认缩略对象的原因：

1. 性能优化：避免打印超大型对象时卡顿；
2. 可读性妥协：默认只展示浅层（通常 2-3 层）属性；
3. 规则限制：不同环境（Node.js/ 浏览器）的默认打印配置不同。

## 二、分场景解决方案

### 场景 1：Node.js 环境

Node.js 内置 `util` 模块可精准控制对象打印规则，是最推荐的方式。

#### 方式 1：临时配置打印（单次生效）

```javascript
// 1. 引入 Node.js 内置的 util 模块
const util = require('util');

// 2. 定义一个测试用的长对象（模拟你的业务对象）
const longObject = {
  basicInfo: { name: '张三', age: 25 },
  address: {
    province: '广东省',
    city: '深圳市',
    detail: { street: '科技园路', number: '100号' }
  },
  hobbies: ['编程', '阅读', '运动', ...Array(20).fill('测试元素')] // 长数组
};

// 3. 完整打印对象（关键配置）
console.log(util.inspect(longObject, {
  depth: null,        // 嵌套层级：null = 无限层级（替代旧版的 Infinity）
  colors: true,       // 带颜色输出（提升可读性）
  maxArrayLength: null, // 数组最大展示长度：null = 完整展示
  maxStringLength: null, // 字符串最大展示长度：null = 完整展示
  showHidden: false   // 是否显示不可枚举属性（按需开启）
}));
```

#### 方式 2：全局配置（所有打印生效）

如果希望整个项目的 `console.log` 都默认打印完整对象，可全局修改配置：

```javascript
const util = require('util');

// 全局修改 util 打印默认配置
util.inspect.defaultOptions = {
  ...util.inspect.defaultOptions, // 保留原有配置
  depth: null,
  maxArrayLength: null,
  colors: true
};

// 后续所有 console.log 都会按此规则打印
console.log(longObject); // 直接打印即可，无需再传配置
```

### 场景 2：浏览器环境

浏览器控制台通过 `console.dir()` 替代 `console.log`，并配置层级实现完整打印。

```javascript
// 1. 测试用长对象（和上面一致）
const longObject = {
  basicInfo: { name: '张三', age: 25 },
  address: {
    province: '广东省',
    city: '深圳市',
    detail: { street: '科技园路', number: '100号' }
  },
  hobbies: ['编程', '阅读', '运动', ...Array(20).fill('测试元素')]
};

// 2. 完整打印（关键：depth: Infinity 表示无限层级）
console.dir(longObject, {
  depth: Infinity, // 无限嵌套层级
  showHidden: false, // 是否显示不可枚举属性
  colors: true // 部分浏览器支持颜色
});

// 补充：也可以直接在控制台输入变量名（手动操作）
// 比如在浏览器控制台输入 longObject 并回车，会显示可展开的完整结构
```

### 场景 3：通用兜底方案（JSON.stringify）

适合简单对象（无函数、无 undefined 属性），跨环境通用，但会丢失特殊类型属性：

```javascript
const longObject = { /* 你的对象 */ };

// JSON.stringify(对象, 替换函数, 缩进空格)
console.log(JSON.stringify(longObject, null, 2));
// 优点：格式规整、跨环境；缺点：丢失函数/undefined/Symbol 等属性
```

## 三、封装跨环境通用工具函数（推荐）

为了不用重复写配置，这里封装一个 `printFullObject` 函数，自动适配 Node.js/ 浏览器环境：

```javascript
/**
 * 跨环境完整打印长对象（解决控制台缩略问题）
 * @param {any} obj - 要打印的对象/数组/基本类型
 * @param {string} [title] - 可选：打印标题（方便区分日志）
 */
function printFullObject(obj, title = '完整对象打印') {
  // 分隔线（提升日志可读性）
  const separator = '==============================';
  
  // 场景1：Node.js 环境
  if (typeof process !== 'undefined' && process.versions?.node) {
    const util = require('util');
    console.log(`\n${separator} ${title} ${separator}`);
    console.log(util.inspect(obj, {
      depth: null,
      colors: true,
      maxArrayLength: null,
      maxStringLength: null
    }));
    console.log(`${separator} 打印结束 ${separator}\n`);
  } 
  // 场景2：浏览器环境
  else if (typeof window !== 'undefined') {
    console.log(`\n${separator} ${title} ${separator}`);
    console.dir(obj, { depth: Infinity, colors: true });
    console.log(`${separator} 打印结束 ${separator}\n`);
  } 
  // 兜底：JSON.stringify
  else {
    console.log(`\n${separator} ${title} ${separator}`);
    console.log(JSON.stringify(obj, null, 2));
    console.log(`${separator} 打印结束 ${separator}\n`);
  }
}

// ---------------------- 使用示例 ----------------------
// 1. 定义测试长对象
const testLongObj = {
  user: {
    id: 1001,
    info: {
      name: '李四',
      profile: {
        phone: '13800138000',
        email: 'test@example.com',
        tags: ['VIP', '新用户', '高消费', ...Array(15).fill('标签')]
      }
    }
  },
  list: Array(30).fill().map((_, i) => ({ id: i, value: `项${i}` }))
};

// 2. 调用函数打印
printFullObject(testLongObj, '用户详情长对象');
```

### 使用说明：

1. Node.js 环境：直接引入 / 定义该函数即可使用；
2. 浏览器环境：将函数复制到控制台 / 项目代码中，调用即可；
3. 可自定义 `title` 参数，方便在日志中区分不同对象。

## 四、注意事项

1. 打印超大型对象（比如包含十万级数组的对象）时，即使配置了完整打印，也可能导致控制台卡顿，建议按需打印关键属性；
2. `JSON.stringify` 不适合复杂对象：会丢失函数、undefined、Symbol、循环引用的属性；
3. Node.js 中 `util.inspect` 的 `showHidden: true` 会显示对象的原型链、不可枚举属性，按需开启即可。

## 五、总结

1. 优先使用封装的 `printFullObject` 函数，跨环境无需重复配置；
2. Node.js 环境首选 `util.inspect`（保留所有属性类型），浏览器环境首选 `console.dir({ depth: Infinity })`；
3. 简单对象可兜底用 `JSON.stringify`，但注意特殊属性丢失问题。

通过以上方法，你可以彻底解决控制台打印长对象被缩略的问题，提升开发调试效率。