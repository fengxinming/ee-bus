declare type Options = {
  event: boolean
}
export declare class Emitter {
  constructor(opts?: Options)

  insert(
    eventName: string | string[] | object, 
    index: number, 
    fn: Function, 
    once?: boolean
  ): this

  on(
    eventName: string | string[] | object, 
    fn: Function, 
    once?: boolean
  ): this

  addListener(
    eventName: string | string[] | object, 
    fn: Function, 
    once?: boolean
  ): this

  once(
    eventName: string | string[] | object, 
    fn: Function
  ): this

  off(
    eventName: '*' | string | string[] | object, 
    fn: '*' | Function
  ): this

  removeListener(
    eventName: '*' | string | string[] | object, 
    fn: '*' | Function
  ): this

  removeAllListeners(
    eventName?: string
  ): this

  emit(
    eventName: '*' | string, 
    ...args: any
  ): boolean

  trigger(
    eventName: string, 
    ...args: any
  ): boolean

  attach(
    fn: Function, 
    once?: boolean
  ): this

  detach(fn: Function): this
}

export declare class Event {
  constructor(
    type: string, 
    target: Emitter, 
    currentTarget: Emitter
  )

  stopImmediatePropagation(): void
}
