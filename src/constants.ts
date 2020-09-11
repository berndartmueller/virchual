/**
 * A root class name.
 */
const ROOT = 'virchual';
const SLIDE = `${ROOT}__slide`;
const PAGINATION = `${ROOT}__pagination`;
const PAGINATION_BULLET = `${PAGINATION}-bullet`;

export const PREV = 'prev';
export const NEXT = 'next';

/**
 * The definition table of all classes for elements.
 * They might be modified by options.
 */
export const ELEMENT_CLASSES = {
  _frame: `${ROOT}__frame`,
  _slide: SLIDE,
  _slideActive: `${SLIDE}--active`,
  _pagination: PAGINATION,
  _paginationBullet: PAGINATION_BULLET,
  _paginationBulletActive: `${PAGINATION_BULLET}--active`,
  _paginationBulletEdge: `${PAGINATION_BULLET}--edge`,
};
