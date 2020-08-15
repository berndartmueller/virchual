/**
 * Some utility functions related with Object, supporting IE.
 *
 * @author    Naotoshi Fujita
 * @copyright Naotoshi Fujita. All rights reserved.
 */

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

/**
 * Return values of the given object as an array.
 * IE doesn't support Object.values.
 *
 * @param obj - An object.
 *
 * @return An array containing all values of the given object.
 */
export function values(obj: object): Array<any> {
  return Object.keys(obj).map(key => obj[key]);
}

/**
 * Check if the given subject is object or not.
 *
 * @param subject - A subject to be verified.
 *
 * @return True if object, false otherwise.
 */
export function isObject(subject: any): boolean {
  return typeof subject === 'object';
}

/**
 * Merge two objects deeply.
 *
 * @param to   - An object where "from" is merged.
 * @param from - An object merged to "to".
 *
 * @return A merged object.
 */
export function merge({ ...to }: object, from: object): object {
  each(from, (value, key) => {
    if (isObject(value)) {
      if (!isObject(to[key])) {
        to[key] = {};
      }

      to[key] = merge(to[key], value);
    } else {
      to[key] = value;
    }
  });

  return to;
}

/**
 * Assign all properties "from" to "to" object.
 *
 * @param to   - An object where properties are assigned.
 * @param from - An object whose properties are assigned to "to".
 *
 * @return An assigned object.
 */
export function assign(to: any, from: any): object {
  to._s = from;

  Object.keys(from).forEach(key => {
    if (!to[key]) {
      Object.defineProperty(to, key, Object.getOwnPropertyDescriptor(from, key) as any);
    }
  });

  return to;
}
