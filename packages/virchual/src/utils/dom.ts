export function createElement(tagName: string, { classNames, html }: { classNames?: string; html?: string } = {}) {
  const element = document.createElement(tagName);

  if (classNames) {
    element.className = classNames;
  }

  element.innerHTML = html || '';

  return element;
}

/**
 * Remove a given element from a DOM tree.
 *
 * @param elms - Element(s) to be removed.
 */
export function remove(element: Element) {
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

/**
 * Add or remove css class to given element.
 *
 * @param element Element to add class tp.
 * @param klass CSS classname.
 * @param remove Remove class instead of adding.
 */
export function addOrRemoveClass(element: HTMLElement, klass: string, remove = false) {
  if (!remove) {
    element.classList.add(klass);

    return;
  }

  element.classList.remove(klass);
}

/**
 * Iterate over given HTML elements.
 *
 * @param elements HTML elements to iterate through.
 * @param callback Callback function called on each element.
 */
export function each(nodes: NodeList | HTMLCollection, callback: (value: HTMLElement, index: number) => void) {
  const elements = [].slice.call(nodes) as HTMLElement[];

  elements.forEach(callback);
}

/**
 * Map over given HTML elements.
 *
 * @param elements HTML elements to iterate through.
 * @param callback Callback function called on each element.
 */
export function map(nodes: NodeList | HTMLCollection, callback: (value: HTMLElement, index: number) => unknown) {
  const elements = [].slice.call(nodes) as HTMLElement[];

  return elements.map(callback);
}
