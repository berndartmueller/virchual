/**
 * Check existence of the given object and throw an error if it doesn't.
 *
 * @throws {Error}
 *
 * @param subject - A subject to be confirmed.
 * @param message - An error message.
 */
export function assert(subject: any, message: string) {
  if (!subject) {
    throw new Error(message);
  }
}
