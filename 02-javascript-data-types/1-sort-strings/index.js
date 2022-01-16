/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  let arrCopy = arr.slice().sort(sortArray);
  return param === 'asc' ? arrCopy : arrCopy.reverse();
}

function sortArray(a, b) {
  if (a.toLowerCase() === b.toLowerCase() && a > b) {
    return 1;
  } else if (a.toLowerCase() === b.toLowerCase() && a < b) {
    return -1;
  } else {
    return a.localeCompare(b, ['ru', 'en']);
  }
}
