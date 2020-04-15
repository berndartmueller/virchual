/**
 * Utility functions for outputting logs.
 *
 * @author    Naotoshi Fujita
 * @copyright Naotoshi Fujita. All rights reserved.
 */
/**
 * Display an error message on the browser console.
 *
 * @param {string} message - An error message.
 */
export declare function error(message: any): void;
/**
 * Check existence of the given object and throw an error if it doesn't.
 *
 * @throws {Error}
 *
 * @param {*}      subject - A subject to be confirmed.
 * @param {string} message - An error message.
 */
export declare function exist(subject: any, message: any): void;
