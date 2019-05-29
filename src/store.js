import * as cache from './cache';

const metaMap = new WeakMap();
const _ = (h, v) => v;

function getMeta(Model) {
  let meta = metaMap.get(Model);
  if (!meta) {
    meta = {
      get: new Set(),
      set: new Set(),
    };
    metaMap.set(Model, meta);
  }
  return meta;
}

export function observe(Model, callbacks = {}) {
  const meta = getMeta(Model);

  if (callbacks.get) {
    meta.get.add((id) => {
      const result = callbacks.get(id);
      if (result !== undefined) {
        cache.set(Model, id, _, result, true);
      }
    });
  }

  if (callbacks.set) meta.set.add(callbacks.set);

  return () => {
    meta.get.delete(callbacks.get);
    meta.set.delete(callbacks.set);
  };
}

export function isReady() {
  return true;
}

export function get(Model, id) {
  const model = cache.get(Model, id, _);

  if (model === undefined) {
    const meta = getMeta(Model);
    meta.get.forEach(cb => cb(id));
    return cache.get(Model, id, _);
  }

  return model;
}
