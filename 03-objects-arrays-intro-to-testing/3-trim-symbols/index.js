/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  let arrFromString = string.split('');
  let trimmedString = '';

  if (size === 0 || !string) {
    return '';
  } else if (size === undefined) {
    return string;
  }

  for (let i = 0; i < arrFromString.length; i++) {
    if (arrFromString[i] !== arrFromString[i - size] || arrFromString[i] !== arrFromString[i - 1]) {
      trimmedString += arrFromString[i];
    }
  }

  return trimmedString;
}
