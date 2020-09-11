import { PREV, NEXT } from './constants';

export type Sign = 1 | -1;
export type Direction = typeof PREV | typeof NEXT;
export type identity = <T extends unknown>(arg?: T) => T | void;
