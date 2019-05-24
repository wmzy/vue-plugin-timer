# vue plugin timer

> An easy way to use setTimeout and setInterval.

## Install

```bash
npm i vue-plugin-timer
```

## Usage
```js
import Vue from 'vue';
import Timer from 'vue-plugin-timer';

Vue.use(Timer);
```

Then in Vue lifecycle hooks, use `this.$setTimeout` `this.$setInterval` `this.$clearTimeout` `this.$clearInterval` replace the methods of `window`.

All timers will be cleared when component destroyed.

```html
<script>
export default {
  props: ['message'],
  mounted() {
    // use window.setTimeout
    this.timer = window.setTimeout(() => console.log(this.message), 60 * 1000);
    // use vue-plugin-timer
    this.$setTimeout(() => console.log(this.message), 60 * 1000);
  },
  destroyed() {
    window.clearTimeout(this.timer);
  }
}
</script>
```

## License

Copyright © 2018-present wmzy. This source code is licensed under the MIT
license found in the [LICENSE.txt](https://github.com/wmzy/vue-plugin-timer/blob/master/LICENSE.txt)
file.
