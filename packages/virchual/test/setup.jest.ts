import { cleanDOM } from './utils/dom';

function isBrowser() {
  return global['window'] != null;
}

function isNode() {
  return !isBrowser();
}

function getWindow(): Window {
  return (global as unknown) as Window;
}

// browser env
if (isBrowser()) {
  // eslint-disable-next-line no-empty
} else if (isNode()) {
}

beforeEach(() => {
  if (isBrowser()) {
    const window = getWindow();

    cleanDOM(window);
  }
});
