interface Emitter {
  /**
   * 绑定一个或多个自定义事件
   *
   * @param {any | any[]} eventName
   * @param {function} fn
   * @param {boolean|undefined} once
   * @returns {Emitter}
   */
  on(
    eventName: any | any[],
    fn: (evt?: Event, ...args: any[]) => any,
    ctx?: any,
  ): this;

  /**
   * 绑定一个或多个自定义事件，但是只绑定一次
   *
   * @param {any|any[]} eventName
   * @param {function} fn
   * @param {any} ctx
   * @returns {Emitter}
   */
  once(
    eventName: any | any[],
    fn: (evt?: Event, ...args: any[]) => any,
    ctx?: any,
  ): this;

  /**
   * 绑定一个或多个自定义事件并指定事件回调在具体的位置
   *
   * @param {number} index
   * @param {any|any[]} eventName
   * @param {function} fn
   * @param {boolean|undefined} once
   * @returns {Emitter}
   */
  insert(
    index: number,
    eventName: any | any[],
    fn: (evt?: Event, ...args: any[]) => any,
    ctx?: any
  ): this;

  /**
   * 绑定一个或多个自定义事件并指定事件回调在具体的位置，但是只绑定一次
   *
   * @param {number} index
   * @param {any|any[]} eventName
   * @param {function} fn
   * @param {boolean|undefined} once
   * @returns {Emitter}
   */
  insertOnce(
    index: number,
    eventName: any | any[],
    fn: (evt?: Event, ...args: any[]) => any,
    ctx?: any
  ): this;

  /**
   * 解绑一个或多个自定义事件
   *
   * .off(eventName, fn) 解绑指定事件;
   *
   * .off(eventName) 解绑 eventName 相关的所有事件;
   *
   * .off() 解绑所有事件.
   *
   * @param {any|any[]} eventName
   * @param {function} fn
   * @returns {Emitter}
   */
  off(
    eventName?: any | any[],
    fn?: (evt?: Event, ...args: any[]) => any,
  ): this;

  /**
   * 触发事件，并返回触发了该事件的多少个回调
   *
   * @param {any} eventName
   * @param {...any[]} args
   * @returns {number}
   */
  emit(
    eventName?: any,
    ...args: any[]
  ): number;
}

type EmitterConstructor = new (opts?: EmitterOptions) => Emitter;

interface EmitterOptions {
  [key: string]: any;
  event?: boolean;
}

interface Event {
  type: any;
  target: any;
  currentTarget: any;
  immediatePropagation: boolean;

  /**
   * 阻止监听同一事件的其它事件监听器被调用
   */
  stopImmediatePropagation(): void;
}

type EventConstructor = new (
    type: any,
    target: any,
    currentTarget: any
  ) => Event;

interface EventHandler {
  fn: (evt?: Event, ...args: any[]) => any;
  once: boolean;
  ctx: any;
}

type EventHandlerConstructor = new (
    fn: (evt?: Event, ...args: any[]) => any,
    once: boolean,
    ctx: any
  ) => EventHandler;

interface EventHandlers {
  [eventName: string]: EventHandler[];
}

export {
  Emitter,
  EmitterConstructor,
  EmitterOptions,
  Event,
  EventConstructor,
  EventHandler,
  EventHandlerConstructor,
  EventHandlers
};

export { isFunction, isObject, forOwn, emptyOwn } from 'celia';
