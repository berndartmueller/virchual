import { each } from './object';
import { toArray } from './utils';

/**
 * Create an element with some optional attributes.
 *
 * @param tag   - A tag name.
 * @param attrs - An object any attribute pairs of name and value.
 *
 * @return A created element.
 */
export function create(tag: string, attrs: object): HTMLElement {
  const elm = document.createElement(tag);
  each(attrs, (value, key) => elm.setAttribute(key, value));

  return elm;
}

/**
 * Convert HTML string to DOM node.
 *
 * @param html - HTML string.
 *
 * @return A created node.
 */
export function domify(html: string): HTMLElement {
  const div = create('div', {});
  div.innerHTML = html;

  return div.firstChild as HTMLElement;
}

/**
 * Remove a given element from a DOM tree.
 *
 * @param elms - Element(s) to be removed.
 */
export function remove(elms: HTMLElement | HTMLElement[]) {
  toArray(elms).forEach(elm => {
    if (elm && elm.parentElement) {
      elm.parentElement.removeChild(elm);
    }
  });
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
