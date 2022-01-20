/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  let arr = path.split('.');


  return function getter(obj) {
    let result = obj;

    if (!Object.keys(obj).length) {
      return;
    }

    for (let item of arr) {
      result = result[item];
    }

    return result;
  };
}
