/**
 * Iterate an object like Array.forEach.
 * IE doesn't support forEach of HTMLCollection.
 *
 * @param obj       - An object.
 * @param callback  - A function handling each value. Arguments are value, property and index.
 */
export function each(obj: object, callback: Function) {
  Object.keys(obj).some((key, index) => {
    return callback(obj[key], key, index);
  });
}
