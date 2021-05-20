export default class Event {
  constructor(type, target, currentTarget) {
    this.type = type;
    this.target = target;
    this.currentTarget = currentTarget;
    this._immediatePropagation = true;
  }

  stopImmediatePropagation() {
    this._immediatePropagation = false;
  }
}
