import {
  Emitter as IEmitter,
  EmitterOptions,
  EventHandlers as IEventHandlers
} from '../types';
import Event, {
  forEachEvent,
  EventHandler
} from './event';
import { isFunction, isObject, forOwn, emptyOwn } from '@ali/iot-cloud-util';

function addListener(
  emitter: Emitter,
  eventName: string | string[],
  fn: (evt?: Event, ...args: any[]) => any,
  ctx: any,
  once: boolean,
  index?: number
): void {
  if (!isFunction(fn)) {
    console.warn(`Expect a function to bind "${eventName}" event, but got a ${typeof fn}`);
    return;
  }

  forEachEvent(eventName, fn, (listener, name) => {
    let ehs = emitter.e_[name];
    if (!ehs) {
      ehs = [];
      emitter.e_[name] = ehs;
    }

    const eh = new EventHandler(listener, once, ctx || emitter);
    if (index === undefined) {
      ehs[ehs.length] = eh;
    }
    else {
      ehs.splice(index, 0, eh);
    }
  });
}

function removeListener(
  emitter: Emitter,
  eventName: any | any[],
  fn?: (evt?: Event, ...args: any[]) => any,
): void {
  if (!isFunction(fn)) {
    console.warn(`Expect a function to bind "${eventName}" event, but got a ${typeof fn}`);
    return;
  }

  forEachEvent(eventName, fn, (listener, name) => {
    const listeners = emitter.e_[name];
    for (let i = 0, len = listeners.length; i < len; i++) {
      if (listeners[i].fn === listener) {
        listeners.splice(i, 1);
        break;
      }
    }
  });
}

class Emitter implements IEmitter {
  opts: EmitterOptions;
  e_: IEventHandlers;

  constructor(opts?: EmitterOptions) {
    this.e_ = Object.create(null);
    this.opts = opts || {};
  }

  on(
    eventName: any | any[],
    fn: (evt?: Event, ...args: any[]) => any,
    ctx?: any,
  ): this {
    addListener(this, eventName, fn, ctx, false);
    return this;
  }

  once(
    eventName: any | any[],
    fn: (evt?: Event, ...args: any[]) => any,
    ctx?: any,
  ): this {
    addListener(this, eventName, fn, ctx, true);
    return this;
  }

  insert(
    index: number,
    eventName: any | any[],
    fn: (evt?: Event, ...args: any[]) => any,
    ctx?: any
  ) {
    addListener(this, eventName, fn, ctx, false, index);
    return this;
  }

  insertOnce(
    index: number,
    eventName: any | any[],
    fn: (evt?: Event, ...args: any[]) => any,
    ctx?: any
  ) {
    addListener(this, eventName, fn, ctx, true, index);
    return this;
  }

  off(
    eventName?: any | any[],
    fn?: (evt?: Event, ...args: any[]) => any,
  ) {
    const len = arguments.length;
    switch (len) {
      case 0:
        emptyOwn(this.e_);
        break;
      case 1:
        forEachEvent(eventName, fn, (listener, name) => {
          const els = this.e_[name];
          if (els) {
            els.length = 0;
          }
        });
        break;
      default:
        removeListener(this, eventName, fn);
    }
    return this;
  }

  emit(
    eventName?: any,
    ...args: any[]
  ): number {
    let evt: Event = null as any;
    if (this.opts.event !== false) {
      args.unshift(evt = new Event(eventName, this, this));
    }

    let i = 0;
    const els = this.e_[eventName];
    if (!els) {
      return i;
    }
    let len = els.length;
    for (i = 0; i < len;) {
      const { fn, once, ctx } = els[i];
      // 执行事件回调函数
      fn.apply(ctx, args);

      if (once) {
        els.splice(i, 1);
        len--;
      }
      else {
        i++;
      }

      // 试图阻止当前事件广播
      if (evt && evt.immediatePropagation === false) {
        break;
      }
    }
    return i;
  }
}

export function create(opts: EmitterOptions) {
  return new Emitter(opts);
}

export {
  Emitter,
  Event,
  isFunction,
  isObject,
  forOwn,
  emptyOwn
};
