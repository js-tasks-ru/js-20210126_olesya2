/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  const tempArray = [];

  Object.entries(obj).forEach(([key, value]) => {
    if (fields.includes(key)) {
      tempArray.push([key, value]);
    }
  })
  return Object.fromEntries(tempArray);
};

// filter
/* const pick3 = (obj, ...fields) => {
  const tempArray = Object.entries(obj).filter(([key]) => fields.includes(key));

  return Object.fromEntries(tempArray);
}; */

// reduce
/* const pick4 = (obj, ...fields) => {
  const tempArray = Object.entries(obj).reduce((acc, [key, value]) => {
    if (fields.includes(key)) {
      acc.push([key, value]);
    }
    return acc;
  }, []);
  return Object.fromEntries(tempArray);
}; */

// forEach
/* const pick2 = (obj, ...fields) => {
  const tempArray = [];
  Object.entries(obj).forEach(([key, value]) => {
    fields.forEach((el) => {
      if (key === el) {
        tempArray.push([key, value]);
      }
    })
  })
  return Object.fromEntries(tempArray);
}; */
