/**
 * Prefix of an error massage.
 */
const MESSAGE_PREFIX: string = '[VIRCHUAL]';

/**
 * Display an error message on the browser console.
 *
 * @param message - An error message.
 */
export function error(message: string) {
  console.error(`${MESSAGE_PREFIX} ${message}`);
}

/**
 * Check existence of the given object and throw an error if it doesn't.
 *
 * @throws {Error}
 *
 * @param subject - A subject to be confirmed.
 * @param message - An error message.
 */
export function exist(subject: any, message: string) {
  if (!subject) {
    throw new Error(message);
  }
}
