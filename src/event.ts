import {
  Event as IEvent,
  EventHandler as IEventHandler
} from '../types';

export default class Event implements IEvent {
  type: any;
  target: any;
  currentTarget: any;
  immediatePropagation: boolean;

  constructor(type: any, target: any, currentTarget: any) {
    this.type = type;
    this.target = target;
    this.currentTarget = currentTarget;
    this.immediatePropagation = true;
  }

  stopImmediatePropagation() {
    this.immediatePropagation = false;
  }
}

export class EventHandler implements IEventHandler {
  fn: (evt?: IEvent, ...args: any[]) => any;
  once: boolean;
  ctx: any;

  constructor(
    fn: (evt?: IEvent, ...args: any[]) => any,
    once: boolean,
    ctx: any
  ) {
    this.fn = fn;
    this.once = once;
    this.ctx = ctx;
  }
}

const { isArray } = Array;
export function forEachEvent(
  events: any | any[],
  fn: any,
  cb: (
    listener: any,
    name: any,
  ) => void
) {
  if (isArray(events)) {
    events.forEach((eventName) => {
      if (!eventName) {
        console.warn(`Unknown event name "${eventName}"`);
        return;
      }
      cb(fn, eventName);
    });
  }
  else {
    if (!events) {
      console.warn(`Unknown event name "${events}"`);
      return;
    }
    cb(fn, events);
  }
}
