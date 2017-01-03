import { error } from '@hybrids/debug';

export default function classList(node, expr, ...classNames) {
  if (!classNames.length) {
    return ({ type: globalType, changelog }) => {
      const list = expr.get();
      if (typeof list !== 'object') {
        error('[@hybrids/engine] class: "%s" must be an object: "%s"', expr.evaluate, typeof list);
      }
      const isArray = Array.isArray(list);

      switch (globalType) {
        case 'modify':
          Object.keys(changelog).forEach((key) => {
            switch (changelog[key].type) {
              case 'delete':
                node.classList.remove(isArray ? changelog[key].oldValue : key);
                break;
              default:
                if (isArray) {
                  if (changelog[key].oldValue) node.classList.remove(changelog[key].oldValue);
                  node.classList.add(list[key]);
                } else if (list[key]) {
                  node.classList.add(key);
                } else {
                  node.classList.remove(key);
                }
            }
          });
          break;
        default:
          Object.keys(list).forEach((key) => {
            if (isArray) {
              node.classList.add(list[key]);
            } else if (list[key]) {
              node.classList.add(key);
            } else {
              node.classList.remove(key);
            }
          });
      }
    };
  }

  return () => {
    const value = expr.get();

    classNames.forEach((name) => {
      if (value) {
        node.classList.add(name);
      } else {
        node.classList.remove(name);
      }
    });
  };
}
