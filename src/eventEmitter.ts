import { EventEmitter } from 'node:events';

const emitter = new EventEmitter();

type AnyFunction = (...args: any) => void;

type Config<T> = { listener: T; isOnce?: boolean; };

type AbstractEventMap = {
  [key: string]: Array<AnyFunction>;
}

class MyEventEmitter<EventMap extends AbstractEventMap> {
  private map = new Map<keyof EventMap, Array<Config<AnyFunction>>>();
  private maxListeners = 10;

  on = <Event extends keyof EventMap>(event: Event, listener: (...args: EventMap[Event]) => void): this => {
    return this.subscribeInternal(event, { listener });
  }

  once = <Event extends keyof EventMap>(event: Event, listener: (...args: EventMap[Event]) => void): this => {
    return this.subscribeInternal(event, { listener, isOnce: true });
  }

  emit = <Event extends keyof EventMap>(event: Event, ...payload: EventMap[Event]): boolean => {
    const value = this.map.get(event);
    if (!value) return false;

    value.forEach(config => {
      config.listener(...payload);
      if (config.isOnce) this.off(event, config.listener);
    });

    return true;
  }

  off = <Event extends keyof EventMap>(event: Event, listener: (...args: EventMap[Event]) => void): this => {
    const value = this.map.get(event);
    if (!value) return this;

    const idx = value.findIndex(x => x.listener === listener);
    if (idx !== -1) value.splice(idx, 1);
    if (!value.length) this.map.delete(event);
    return this;
  }

  addListener = this.on;
  removeListener = this.off;

  removeAllListeners = <Event extends keyof EventMap>(event: Event): this => {
    const value = this.map.get(event);
    if (!value) return this;

    this.map.delete(event);
    return this;
  }

  setMaxListeners = (num: number): this => {
    this.maxListeners = num;
    return this;
  }

  private subscribeInternal<Event extends keyof EventMap>(event: Event, config: Config<AnyFunction>): this {
    const value = this.map.get(event) || [];
    value.push(config);
    this.map.set(event, value);

    this.checkMaxListeners(event);
    return this;
  }

  private checkMaxListeners<Event extends keyof EventMap>(event: Event): void {
    const value = this.map.get(event) || [];
    if (isFinite(this.maxListeners) && this.maxListeners > 0 && value.length > this.maxListeners) {
      queueMicrotask(() => {
        console.warn('MAX LISTENERS REACHED', event);
      });
    }
  }

  getMaxListeners = (): number => {
    return this.maxListeners;
  }

  listeners = <Event extends keyof EventMap>(event: Event): Array<EventMap[Event]> => {
    const value = this.map.get(event) || [];
    return value.map(x => x.listener as unknown as EventMap[Event]);
  }
}
