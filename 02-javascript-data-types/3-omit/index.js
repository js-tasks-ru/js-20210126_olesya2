/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  let tempArray = [];
  Object.entries(obj).forEach(([key, value]) => {
    if (!fields.includes(key)) {
      tempArray.push([key, value]);
    }
  })
  return Object.fromEntries(tempArray);
};
