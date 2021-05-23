import Emitter from '../src/index';
import Event from '../src/Event';

describe('测试事件对象', () => {
  it('测试参数配置', () => {
    const emitter1 = new Emitter({ event: false });
    const emitter2 = Emitter.create();
    emitter1.on('testevent', (evt) => {
      expect(evt instanceof Event).toBe(false);
    });
    emitter1.emit('testevent');

    emitter2.on('testevent', (evt) => {
      expect(evt instanceof Event).toBe(true);
    });
    emitter2.emit('testevent');
  });

  it('测试多事件绑定', () => {
    const emitter1 = new Emitter({ event: false });
    let i = 0;
    emitter1.on(['event1', 'event2', 'event3'], () => {
      i += 2;
    });
    emitter1.on('event4');
    emitter1.emit('event1');
    emitter1.emit('event2');
    emitter1.emit('event3');
    emitter1.emit('event4');
    expect(i).toBe(6);

    const fn = () => {
      i += 3;
    };
    emitter1.on({
      event1: fn,
      event2: fn,
      event3: fn
    });

    emitter1.once('event1 event2 event3', () => {
      i += 4;
    });
    emitter1.emit('event1');
    emitter1.emit('event2');
    emitter1.emit('event3');
    expect(i).toBe(33);

    expect(emitter1.emit('event1')).toBe(true);
    emitter1.emit('event2');
    emitter1.emit('event3');
    expect(i).toBe(48);

    emitter1.removeAllListeners('event1');
    expect(emitter1.emit('event1')).toBe(false);
    emitter1.emit('event2');
    emitter1.emit('event3');
    expect(i).toBe(58);

    emitter1.off();
    emitter1.emit('event1');
    emitter1.emit('event2');
    emitter1.emit('event3');
    expect(i).toBe(68);

    emitter1.off([null]);
    emitter1.emit('event1');
    emitter1.emit('event2');
    emitter1.emit('event3');
    expect(i).toBe(78);

    emitter1.off('event2');
    emitter1.emit('event1');
    emitter1.emit('event2');
    emitter1.emit('event3');
    expect(i).toBe(88);

    emitter1.off('event2', null);
    emitter1.emit('event1');
    emitter1.emit('event2');
    emitter1.emit('event3');
    expect(i).toBe(98);

    emitter1.off('event2', fn);
    emitter1.emit('event1');
    emitter1.emit('event2');
    emitter1.emit('event3');
    expect(i).toBe(105);

    emitter1.off('event4', fn);
    emitter1.emit('event1');
    emitter1.emit('event2');
    emitter1.emit('event3');
    expect(i).toBe(112);

    emitter1.removeAllListeners();
    emitter1.emit('event1');
    emitter1.emit('event2');
    emitter1.emit('event3');
    expect(i).toBe(112);
  });

  it('测试全局事件触发', () => {
    const emitter1 = new Emitter({ event: false });
    const emitter2 = Emitter.create();
    let i = 0;
    const fn = () => {
      i++;
    };
    emitter1.attach();
    emitter1.attach(fn);
    emitter1.attach(fn);
    expect(emitter1.emit('*')).toBe(false);
    expect(i).toBe(2);

    emitter1.detach(fn);
    emitter1.emit('*');
    expect(i).toBe(3);

    emitter2.attach(fn);
    emitter2.attach(fn);
    emitter2.emit('*');
    expect(i).toBe(5);

    emitter2.detach();
    emitter2.detach('*');
    emitter2.emit('*');
    expect(i).toBe(5);
  });

  it('测试通配符', () => {
    const emitter1 = new Emitter({ event: false });
    let i = 0;
    emitter1.attach(() => {
      i++;
    });
    emitter1.on('event1,event2, event3', () => {
      i += 3;
    });
    expect(emitter1.emit('event1')).toBe(true);
    emitter1.emit('event2');
    emitter1.emit('event3');
    expect(i).toBe(12);

    expect(emitter1.emit('@event1')).toBe(false);
    expect(i).toBe(12);

    emitter1.emit('*');
    expect(i).toBe(22);
  });

  it('测试阻止事件广播', () => {
    const emitter2 = Emitter.create();
    let i = 0;
    emitter2.on('stopImmediatePropagation', () => {
      i++;
    });
    emitter2.on('stopImmediatePropagation', (evt) => {
      i += 2;
      evt.stopImmediatePropagation();
    });
    emitter2.on('stopImmediatePropagation', () => {
      i += 3;
    });

    emitter2.emit('stopImmediatePropagation');
    expect(i).toBe(3);
  });

  it('测试重复事件绑定', () => {
    const emitter1 = new Emitter({ event: false });
    let i = 0;
    const fn = (arg) => {
      i++;
      expect(arg).toBe('hello');
    };
    const fn2 = () => {
      i += 2;
    };
    emitter1.on('event1', fn);
    emitter1.on('event1', fn);
    emitter1.on('event1', fn);
    emitter1.emit('event1', 'hello');
    expect(i).toBe(3);

    emitter1.off('event1', fn);
    emitter1.emit('event1', 'hello');
    expect(i).toBe(5);

    const emitter2 = Emitter.create();
    emitter2.on('event-before', fn2);
    emitter2.on('event-before', fn2);
    emitter2.on('event-before', fn2);
    emitter2.on('event-before', fn2);
    emitter2.on('event-before', fn2);
    emitter2.insert('event-before', 1, (evt) => {
      evt.stopImmediatePropagation();
    });
    emitter2.emit('event-before', 'hello');
    expect(i).toBe(7);
  });
});
