/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const sortedArr = [...arr];

  switch (param) {
    case 'asc':
      return sorting(arr, 1);
    case 'desc':
      return sorting(arr, -1);
    default:
      return arr;
  }

  function sorting(array, direction) {
    return sortedArr.sort((a, b) => direction * a.localeCompare(b, 'ru-en', { caseFirst: 'upper' }))
  }
}
