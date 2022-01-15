/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  let pickedObj;
  let entries = Object.entries(obj);

  let pickedEntries = entries.filter(entry => {
    return fields.indexOf(entry[0]) >= 0;
  });

  pickedObj = Object.fromEntries(pickedEntries);

  return pickedObj;
};
