/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  let omittedObj;
  let entries = Object.entries(obj);

  let omittedEntries = entries.filter(entry => {
    return fields.indexOf(entry[0]) === -1;
  });

  omittedObj = Object.fromEntries(omittedEntries);

  return omittedObj;
};
