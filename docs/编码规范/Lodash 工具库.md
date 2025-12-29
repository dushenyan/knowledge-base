`lodash` 是一个实用的 JavaScript 工具库，提供了大量的函数来处理数组、对象、字符串等数据类型，能帮助开发者更高效地编写代码，提高代码的可读性和可维护性。以下介绍前端最常用的一些 `lodash` API 及其写法示例。

这些是 `lodash` 前端常用的 API，通过合理使用它们，可以让开发工作更加高效。

### 快捷方式使用
[bilibili](https://player.bilibili.com/player.html?bvid=BV1my4y1S7jC)

在官网下打开调试工具

```javascript
_.isData(new Data()) 
```

### 安装
在前端项目中，可以使用 `pnpm` 来安装 `lodash`：

```bash
pnpm add lodash
```

### 常用 API 示例
#### 1. `_.cloneDeep`：深拷贝对象或数组
深拷贝会递归复制对象或数组的所有属性和元素，返回一个新的独立对象或数组。

```javascript
import _ from 'lodash';

const original = { a: 1, b: { c: 2 } };
const cloned = _.cloneDeep(original);

cloned.b.c = 3;
console.log(original.b.c); // 输出: 2
console.log(cloned.b.c);   // 输出: 3
```

#### 2. `_.debounce`：防抖函数
防抖函数会在事件停止触发一段时间后才执行回调函数，常用于处理频繁触发的事件，如输入框输入、窗口缩放等。

```vue
<template>
  <input v-model="inputValue" @input="handleInput" placeholder="输入内容" />
</template>
<script setup lang="ts">
import { ref } from 'vue';
import _ from 'lodash';

const inputValue = ref('');

const handleInput = _.debounce(() => {
  console.log('输入内容:', inputValue.value);
}, 300);
</script>

```

#### 3. `_.throttle`：节流函数
节流函数会在一定时间间隔内只执行一次回调函数，常用于限制某些操作的执行频率，如滚动事件、点击事件等。

```javascript
<template>
  <button @click="handleClick">点击我</button>
</template>
<script setup lang="ts">
import _ from 'lodash';

const handleClick = _.throttle(() => {
  console.log('按钮被点击了');
}, 1000);
</script>

```

#### 4. `_.get`：安全获取对象属性
`_.get` 可以安全地获取对象的属性，避免因属性不存在而报错。

```javascript
import _ from 'lodash';

const obj = { a: { b: { c: 1 } } };
const value = _.get(obj, 'a.b.c');
console.log(value); // 输出: 1

const nonExistentValue = _.get(obj, 'x.y.z', '默认值');
console.log(nonExistentValue); // 输出: 默认值
```

#### 5. `_.forEach`：遍历数组或对象
`_.forEach` 可以遍历数组或对象的每个元素或属性。

```javascript
import _ from 'lodash';

const arr = [1, 2, 3];
_.forEach(arr, (value, index) => {
  console.log(`索引 ${index} 的值是: ${value}`);
});

const obj = { a: 1, b: 2, c: 3 };
_.forEach(obj, (value, key) => {
  console.log(`属性 ${key} 的值是: ${value}`);
});
```

#### 6. `_.map`：转换数组元素
`_.map` 可以对数组的每个元素进行转换，返回一个新的数组。

```javascript
import _ from 'lodash';

const arr = [1, 2, 3];
const newArr = _.map(arr, (value) => value * 2);
console.log(newArr); // 输出: [2, 4, 6]
```



