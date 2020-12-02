/**
 * @jest-environment jsdom
 */

import { createElement, remove, append } from '../dom';

describe('Utils/DOM#', () => {
  describe('createElement()', () => {
    it('should create <div> element', () => {
      const div = createElement('div');

      expect(div.tagName).toBe('DIV');
      expect(div.className).toBe('');
    });

    it('should create <div> element with css class names', () => {
      const div = createElement('div', { classNames: 'foo bar' });

      expect(div.tagName).toBe('DIV');
      expect(div.className).toBe('foo bar');
    });

    it('should create <div> element with css class names and html children', () => {
      const div = createElement('div', { classNames: 'foo bar', html: '<span>test</span>' });

      expect(div.tagName).toBe('DIV');
      expect(div.className).toBe('foo bar');
      expect(div.innerHTML).toBe('<span>test</span>');
    });
  });

  describe('remove()', () => {
    it('should remove DOM element', () => {
      document.body.innerHTML = `
        <div id="wrapper">
          <span id="remove"></span>
        </div>
      `;
      const div = document.body.querySelector('#wrapper');
      const span = document.body.querySelector('#remove');

      remove(span);

      expect(div.querySelector('#remove')).toBeNull();
    });
  });

  describe('append()', () => {
    it('should append DOM element', () => {
      const div = createElement('div');
      const span = createElement('span');

      append(div, span);

      expect(div.querySelector('span')).toBeTruthy();
    });
  });
});
