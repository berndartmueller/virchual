import { each } from './object';
import { toArray } from './utils';

/**
 * Find the first element matching the given selector.
 * Be aware that all selectors after a space are ignored.
 *
 * @param elm       - An ancestor element.
 * @param selector  - DOMString.
 *
 * @return A found element or null.
 */
export function find(elm: HTMLElement | ParentNode, selector: string): HTMLElement {
  return elm ? elm.querySelector(selector.split(' ')[0]) : null;
}

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
 * Insert an element before the reference element.
 *
 * @param element- An element to be inserted.
 * @param ref - A reference element.
 */
export function before(element: HTMLElement, ref: HTMLElement) {
  if (element && ref && ref.parentElement) {
    ref.parentElement.insertBefore(element, ref);
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

/**
 * Apply styles to the given element.
 *
 * @param elm     - An element where styles are applied.
 * @param styles  - Object containing styles.
 */
export function applyStyle(elm: HTMLElement, styles: any) {
  if (elm) {
    each(styles, (value, prop) => {
      if (value !== null) {
        elm.style[prop] = value;
      }
    });
  }
}

/**
 * Add or remove classes to/from the element.
 * This function is for internal usage.
 *
 * @param elm     - An element where classes are added.
 * @param classes - Class names being added.
 * @param remove  - Whether to remove or add classes.
 */
function addOrRemoveClasses(elm: HTMLElement, classes: string | string[], remove: boolean) {
  if (elm) {
    toArray(classes).forEach(name => {
      if (name) {
        elm.classList[remove ? 'remove' : 'add'](name);
      }
    });
  }
}

/**
 * Add classes to the element.
 *
 * @param elm     - An element where classes are added.
 * @param classes - Class names being added.
 */
export function addClass(elm: HTMLElement, classes: string | string[]) {
  addOrRemoveClasses(elm, classes, false);
}

/**
 * Remove a class from the element.
 *
 * @param elm     - An element where classes are removed.
 * @param classes - A class name being removed.
 */
export function removeClass(elm: HTMLElement, classes: string | string[]) {
  addOrRemoveClasses(elm, classes, true);
}
