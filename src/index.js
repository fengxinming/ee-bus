import isFunction from 'celia/es/isFunction';
import isObject from 'celia/es/isObject';
import forOwn from 'celia/es/forOwn';
import forEach from 'celia/es/forEach';
import Event from './Event';

const SEPARATOR_RE = /[\s,]+/;
const WILDCARD = '*';


const { isArray } = Array;
const { each } = forEach;

function eachEvents(events, fn, cb) {
  if (isArray(events)) {
    each(events, 0, events.length, (name) => {
      cb(fn, name);
    });
  }
  else if (isObject(events)) {
    forOwn(events, cb);
  }
  else if (events) {
    String(events)
      .split(SEPARATOR_RE)
      .forEach((name) => {
        cb(fn, name);
      });
  }
}

function removeListener(listeners, listener) {
  if (listeners) {
    for (let i = 0, len = listeners.length; i < len; i++) {
      if (listeners[i].fn === listener) {
        listeners.splice(i, 1);
        break;
      }
    }
  }
}

function applyListener(listeners, evt, args) {
  let len = listeners.length;
  for (let i = 0; i < len;) {
    const { fn, once } = listeners[i];
    fn.apply(this, args);
    if (once) {
      listeners.splice(i, 1);
      len--;
    }
    else {
      i++;
    }

    // 试图阻止当前事件广播
    if (evt && evt._immediatePropagation === false) {
      break;
    }
  }

  return len > 0;
}

function on(emitter, eventName, fn, once, handle) {
  eachEvents(eventName, fn, (listener, name) => {
    if (name === WILDCARD || !isFunction(listener)) {
      return;
    }

    let els = emitter.__own_listeners__[name];
    if (!els) {
      els = [];
      emitter.__own_listeners__[name] = els;
    }

    handle(els, {
      fn: listener, once
    });
  });

  return emitter;
}

export default class Emitter {
  constructor(opts) {
    this.__own_listeners__ = Object.create(null);
    this.__attachment_listeners__ = [];
    this.opts = opts || {};
  }

  /**
   * 绑定一个或多个自定义事件并指定事件回调在具体的位置
   *
   * @param {string|array|object|'*'} eventName
   * @param {number} index
   * @param {function} fn
   * @param {boolean|undefined} once
   */
  insert(eventName, index, fn, once) {
    return on(this, eventName, fn, !!once, (listeners, listener) => {
      listeners.splice(index, 0, listener);
    });
  }

  /**
   * 绑定一个或多个自定义事件
   *
   * @param {string|array|object|*} eventName
   * @param {function} fn
   * @param {boolean|undefined} once
   */
  on(eventName, fn, once) {
    return on(this, eventName, fn, !!once, (listeners, listener) => {
      listeners[listeners.length] = listener;
    });
  }

  /**
   * 绑定一个或多个自定义事件，但是只绑定一次
   *
   * @param {string|array|object|*} eventName
   * @param {function} fn
   */
  once(eventName, fn) {
    return this.on(eventName, fn, true);
  }

  /**
   * 挂载监听函数，任何事件触发时都会触发该监听
   *
   * @param {function} fn
   * @param {boolean|undefined} once
   */
  attach(fn, once) {
    if (isFunction(fn)) {
      const { __attachment_listeners__ } = this;
      __attachment_listeners__[__attachment_listeners__.length] = { fn, once: !!once };
    }
    return this;
  }

  /**
   * 解绑一个或多个自定义事件
   *
   * .off(eventName, fn) 解绑指定事件;
   *
   * .off(eventName, '*') 解绑 eventName 相关的所有事件;
   *
   * .off('*') 解绑所有事件.
   *
   * @param {string|array|object|'*'} eventName
   * @param {function|'*'} fn
   */
  off(eventName, fn) {
    eachEvents(eventName, fn, (listener, name) => {
      if (!name) {
        return this;
      }
      else if (name === WILDCARD) {
        this.__own_listeners__ = Object.create(null);
      }
      else if (listener === WILDCARD) {
        delete this.__own_listeners__[name];
      }
      else if (isFunction(listener)) {
        removeListener(this.__own_listeners__[name], listener);
      }
    });
    return this;
  }

  /**
   * 移除所有的事件
   *
   * @param {string=} eventName
   */
  removeAllListeners(eventName) {
    return this.off(eventName || WILDCARD, WILDCARD);
  }

  /**
   * 挂载监听函数，任何事件触发时都会触发该监听
   *
   * @param {function} fn
   */
  detach(fn) {
    if (isFunction(fn)) {
      removeListener(this.__attachment_listeners__, fn);
    }
    else if (fn === WILDCARD) {
      this.__attachment_listeners__ = [];
    }
    return this;
  }

  /**
   * 触发事件
   *
   * @param {string} eventName
   * @param {...any} args
   */
  emit(eventName, ...args) {
    let evt;
    if (this.opts.event !== false) {
      args.unshift(evt = new Event(eventName, this, this));
    }

    let ret = false;
    if (eventName === WILDCARD) {
      forOwn(this.__own_listeners__, (els) => {
        // eslint-disable-next-line no-bitwise
        ret |= applyListener(els, evt, args);
      });
    }
    else {
      const els = this.__own_listeners__[eventName];
      if (els) {
        ret = applyListener(els, evt, args);
      }
      else {
        return false;
      }
    }

    // 触发全局匹配事件
    applyListener(this.__attachment_listeners__, evt, args);
    return !!ret;
  }
}

Emitter.prototype.addListener = Emitter.prototype.on;
Emitter.prototype.removeListener = Emitter.prototype.off;
Emitter.prototype.trigger = Emitter.prototype.emit;

Emitter.Event = Event;
Emitter.create = function (opts) {
  return new Emitter(opts);
};
