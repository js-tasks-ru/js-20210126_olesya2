/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const pathArray = path.split('.');

  return function getter(obj) {
    let result = obj;

    const findDeep = (currentValue, index) => {
      if (!currentValue) {
        result = currentValue;
        return;
      }

      if (index < pathArray.length) {
        const key = pathArray[index];
        findDeep(currentValue[key], index + 1);
      } else {
        result = currentValue;
      }
    };

    findDeep(obj, 0);
    return result;
  }
}
