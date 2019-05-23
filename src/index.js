const errorMessage = 'Can not use before component created or after destroyed!';

export default {
  install(Vue) {
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
          this.$clear(i);
        }
        store.delete(this);
      }
    });

    Vue.prototype.$interval = function $interval(...params) {
      const set = store.get(this);
      if (!set) throw new Error(errorMessage);

      const id = window.setInterval(...params);
      set.add(id);
      return id;
    };

    Vue.prototype.$polling = function $polling(func, interval, ...rest) {
      const self = this;
      let id;
      (async function polling() {
        await func(...rest);
        const set = store.get(self);
        if (!set) return;
        set.delete(id);
        id = window.setTimeout(polling, interval);
        set.add(id);
      })();
      return () => id;
    };

    Vue.prototype.$timeout = function $timeout(func, ...rest) {
      const set = store.get(this);
      if (!set) throw new Error(errorMessage);

      const id = window.setTimeout((...params) => {
        set.delete(id);
        func(...params);
      }, ...rest);
      set.add(id);
      return id;
    };

    Vue.prototype.$clear = function $timeout(id) {
      const set = store.get(this);
      if (!set) return;

      if (typeof id === 'function') id = id();

      window.clearTimeout(id);
      set.delete(id);
    };
  }
};
