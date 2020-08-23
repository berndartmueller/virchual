/**
 * Convert HTML string to DOM node.
 *
 * @param html - HTML string.
 *
 * @return A created node.
 */
export function domify(html: string): HTMLElement {
  const div = document.createElement('div');

  div.innerHTML = html;

  return div.firstChild as HTMLElement;
}

/**
 * Remove a given element from a DOM tree.
 *
 * @param elms - Element(s) to be removed.
 */
export function remove(element: HTMLElement) {
  if (element && element.parentElement) {
    element.parentElement.removeChild(element);
  }
}

/**
 * Append a child to a given element.
 *
 * @param parent - A parent element.
 * @param child  - An element to be appended.
 */
export function append(parent: HTMLElement, child: HTMLElement) {
  if (parent) {
    parent.appendChild(child);
  }
}

/**
 * Prepend an element to parent.
 *
 * @param element- An element to prepend.
 * @param element - A reference element.
 */
export function prepend(parent: HTMLElement, element: HTMLElement) {
  if (parent && parent.firstChild && element) {
    parent.insertBefore(element, parent.firstChild);
  }
}
