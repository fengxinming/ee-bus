# ee-bus

## Installation

```bash
npm i ee-bus --save
```

## Usage

```js
import Emitter from 'ee-bus'

const emitter = new Emitter() // const emitter = Emitter.create()

// listen to an event
emitter.on('foo', e => console.log('foo', e) )
emitter.once('foo', e => console.log('foo', e) )

// listen to all events
function attachment() { console.log(type, e) }
emitter.attach(attachment)

// unlisten to all events
emitter.detach(attachment);

// fire an event
emitter.emit('foo', { a: 'b' })

// clearing all events
emitter.off('foo', '*')
emitter.removeAllListeners('foo')
emitter.off('*')
emitter.removeAllListeners()

// working with handler references:
function onFoo() {}
emitter.on('foo', onFoo)   // listen
emitter.off('foo', onFoo)  // unlisten
```

## Options

### new Emitter(opts?: object)

* opts
  * event (boolean)：事件监听函数的第一个参数是否是 [Event](#Class:Event) 对象

## Class:Emitter

### addListener

`on` 方法的别名


### attach

附加一个全局回调，触发任意事件都会执行该回调

**Since**
* 1.0.0

**Arguments**
* fn (function)：回调函数
* [once]：是否只执行一次

**Returns**
* (this)：返回当前对象


### detach

移除一个全局回调，触发任意事件都会执行该回调

**Since**
* 1.0.0

**Arguments**
* fn (function)：`attach` 方法传入的回调函数

**Returns**
* (this)：返回当前对象


### emit

移除所有事件

**Since**
* 1.0.0

**Arguments**
* eventName ('\*' | string)：触发指定事件，'\*' 表示触发所有事件
* [...args] (any)：透传到事件监听函数中的数据，不限个数，不限类型

**Returns**
* (boolean)：是否触发过事件


### off

移除自定义事件

**Since**
* 1.0.0

**Arguments**
* eventName ('\*' | string | string[] | object)：数组和对象表示一次移除多个事件，'\*' 表示移除所有事件
* fn ('*' | function)：触发事件后的监听函数，'\*' 表示移除所有跟 `eventName` 相关事件

**Returns**
* (this)：返回当前对象


### on

绑定自定义事件

**Since**
* 1.0.0

**Arguments**
* eventName (string | string[] | object)：数组和对象表示一次绑定多个事件
* fn (function)：触发事件后的监听函数
* [once]：是否只执行一次

**Returns**
* (this)：返回当前对象


### once

跟 `on` 方法类似，但只触发一次事件回调

**Since**
* 1.0.0

**Arguments**
* eventName (string | string[] | object)：数组和对象表示一次绑定多个事件
* fn (function)：触发事件后的监听函数

**Returns**
* (this)：返回当前对象


### removeAllListeners

移除所有事件

**Since**
* 1.0.0

**Arguments**
* [eventName] (string)：如果不为空，将移除所有跟 `eventName` 相关事件；如果为空，将移除所有事件

**Returns**
* (this)：返回当前对象


### removeListener

`off` 方法的别名


### trigger

`emit` 方法的别名


## Class:Emitter.Event

```ts
class Event {
  constructor(
    type: string, 
    target: Emitter, 
    currentTarget: Emitter
  )

  stopImmediatePropagation(): void
}
```

### stopImmediatePropagation

阻止监听同一事件的其它事件监听函数被调用

**Since**
* 1.0.0

**Example**

```js
import Emitter from '@ali/iot-cloud-emitter'

const emitter = new Emitter()
emitter.on('click', (evt) => {
  console.log('我是第一个监听函数');
})
emitter.on('click', (evt) => {
  console.log('我是第二个监听函数');
  // 执行stopImmediatePropagation方法
  evt.stopImmediatePropagation();
})
emitter.on('click', (evt) => {
  // 该监听函数排在上个函数后面，不会被执行
  console.log('我是第三个监听函数');
})
emitter.emit('click')
```
