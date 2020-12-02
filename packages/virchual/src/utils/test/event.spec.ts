/**
 * @jest-environment jsdom
 */

import { Event } from '../event';
import { spy } from 'sinon';

describe('Event#', () => {
  let events: Event;

  beforeEach(() => {
    events = new Event();
  });

  describe('on()', () => {
    it('should invoke event handler', () => {
      const fn = spy();

      events.on('test', fn);

      events.emit('test');

      expect(fn.calledOnce).toBeTruthy();
    });

    it('should not invoke event handler with different event name', () => {
      const fn = spy();

      events.on('test', fn);

      events.emit('foo');

      expect(fn.notCalled).toBeTruthy();
    });

    it('should invoke event handler for multiple registered events', () => {
      const fn = spy();

      events.on('a b', fn);

      events.emit('a');
      events.emit('b');

      expect(fn.callCount).toBe(2);
    });

    it('should invoke event handler registered with map', () => {
      const fnA = spy();
      const fnB = spy();

      events.on({ a: fnA, b: fnB });

      events.emit('a');

      expect(fnA.calledOnce).toBeTruthy();
      expect(fnB.notCalled).toBeTruthy();
    });

    it('should invoke event handler registered on DOM element', () => {
      window.document.body.innerHTML = `
        <button id="btn"></button
      `;
      const button = window.document.querySelector('#btn');
      const fn = spy();

      events.on('click', fn, button);

      button.dispatchEvent(new window.Event('click'));

      expect(fn.calledOnce).toBeTruthy();
    });
  });

  describe('off()', () => {
    it('should unregister events', () => {
      const fn = spy();

      events.on('a', fn);
      events.off('a', fn);
      events.emit('a');

      expect(fn.notCalled).toBeTruthy();
    });

    it('should unregister DOM events', () => {
      window.document.body.innerHTML = `
        <button id="btn"></button
      `;
      const button = window.document.querySelector('#btn');
      const fn = spy();

      events.on('click', fn, button);
      events.off('click', fn, button);
      button.dispatchEvent(new window.Event('click'));

      expect(fn.notCalled).toBeTruthy();
    });
  });

  describe('destroy()', () => {
    it('should unregister events', () => {
      const fn = spy();

      events.on('a', fn);
      events.destroy();
      events.emit('a');

      expect(fn.notCalled).toBeTruthy();
    });

    it('should unregister DOM events', () => {
      window.document.body.innerHTML = `
        <button id="btn"></button
      `;
      const button = window.document.querySelector('#btn');
      const fn = spy();

      events.on('click', fn, button);
      events.destroy();
      button.dispatchEvent(new window.Event('click'));

      expect(fn.notCalled).toBeTruthy();
    });
  });
});
