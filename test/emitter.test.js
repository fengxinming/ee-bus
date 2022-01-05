import { Emitter, Event, create } from '../src/index';

describe('测试事件对象', () => {
  it('测试参数配置', () => {
    const emitter1 = new Emitter({ event: false });
    const emitter2 = create();
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
    emitter1.on(['event1', 'event2', 'event3', null], () => {
      i += 2;
    });
    emitter1.emit('event1'); // 2
    emitter1.emit('event2'); // 4
    emitter1.emit('event3'); // 6
    emitter1.emit('event4'); // 6
    expect(i).toBe(6);

    emitter1.on('event4', () => {
      i++;
    });
    emitter1.emit('event4'); // 7
    expect(i).toBe(7);

    emitter1.on(null, () => {
      i++;
    });
    emitter1.emit(null); // 7
    expect(i).toBe(7);

    emitter1.on('event5');
    emitter1.emit('event5'); // 7
    expect(i).toBe(7);

    emitter1.once(['event1', 'event2', 'event3'], () => {
      i += 4;
    });
    emitter1.emit('event1'); // 13
    emitter1.emit('event2'); // 19
    emitter1.emit('event3'); // 25
    expect(i).toBe(25);

    emitter1.once('event4', () => {
      i += 2;
    });
    emitter1.emit('event4'); // 28
    expect(i).toBe(28);

    expect(emitter1.emit('event1')).toBe(1); // 30

    emitter1.off('event1');
    expect(emitter1.emit('event1')).toBe(0); // 30

    emitter1.off('event2', null);
    emitter1.emit('event2'); // 32
    expect(i).toBe(32);

    emitter1.insertOnce(0, 'event2', null);

    emitter1.off(['event2', 'event3', 'event']);
    emitter1.emit('event2');
    emitter1.emit('event3');
    expect(i).toBe(32);

    emitter1.off();
    emitter1.emit('event1');
    emitter1.emit('event2');
    emitter1.emit('event3');
    emitter1.emit('event4');
    expect(i).toBe(32);
  });

  it('测试阻止事件广播', () => {
    const emitter2 = create();
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
    emitter1.on('event1', fn); // 1
    emitter1.on('event1', fn); // 1
    emitter1.on('event1', fn); // 1
    emitter1.emit('event1', 'hello'); // 3
    expect(i).toBe(3);

    emitter1.off('event1', fn);
    emitter1.off('event1', fn2);
    emitter1.emit('event1', 'hello'); // 5
    expect(i).toBe(5);

    const emitter2 = create();
    emitter2.on('event-before', fn2); // 7
    emitter2.on('event-before', fn2); // 9
    emitter2.on('event-before', fn2); // 11
    emitter2.on('event-before', fn2); // 13
    emitter2.on('event-before', fn2); // 15
    emitter2.insert(1, 'event-before', (evt) => {
      evt.stopImmediatePropagation();
    });
    emitter2.emit('event-before', 'hello');
    expect(i).toBe(7);
  });
});
