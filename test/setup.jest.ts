import { cleanDOM } from './utils/dom';

function isBrowser() {
  return global['window'] != null;
}

function isNode() {
  return !isBrowser();
}

function getWindow(): Window {
  return (global as any) as Window;
}

// browser env
if (isBrowser()) {
  // tslint:disable-next-line: no-empty
} else if (isNode()) {
}

beforeEach(() => {
  if (isBrowser()) {
    const window = getWindow();

    cleanDOM(window);
  }
});
