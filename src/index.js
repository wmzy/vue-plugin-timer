export default function install(Vue) {
  if (!window) {
    // eslint-disable-next-line no-console
    console.warn('[vue-plugin-timer] only work in browser');
    return;
  }

  const store = new WeakMap();

  Vue.mixin({
    beforeCreate: function initTimerSet() {
      store.set(this, new Set());
    },
    destroyed: function clear() {
      for (const i of store.get(this)) {
        this.$clearTimeout(i);
      }
    }
  });

  Vue.prototype.$setInterval = function $setInterval(...params) {
    const set = store.get(this);
    const id = window.setInterval(...params);
    set.add(id);
    return id;
  };

  Vue.prototype.$setTimeout = function $setTimeout(func, ...rest) {
    const set = store.get(this);
    const id = window.setTimeout((...params) => {
      set.delete(id);
      func(...params);
    }, ...rest);
    set.add(id);
    return id;
  };

  function $clearTimeout(id) {
    const set = store.get(this);
    if (!set) return;

    if (typeof id === 'function') id = id();

    try {
      window.clearTimeout(id);
    } catch (e) {
      window.clearInterval(id);
    }
    set.delete(id);
  }

  Vue.prototype.$clearTimeout = Vue.prototype.$clearInterval = $clearTimeout;

  Vue.prototype.$polling = function $polling(func, interval, ...rest) {
    const self = this;
    let id;
    (async function polling() {
      await func(...rest);
      const set = store.get(self);
      set.delete(id);
      id = window.setTimeout(polling, interval);
      set.add(id);
    })();
    return () => this.$clearTimeout(id);
  };
}
