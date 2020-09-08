/**
 * A root class name.
 */
const ROOT = 'virchual';
const SLIDE = `${ROOT}__slide`;
const PAGINATION = `${ROOT}__pagination`;
const PAGINATION_BULLET = `${PAGINATION}-bullet`;

/**
 * The definition table of all classes for elements.
 * They might be modified by options.
 */
export const ELEMENT_CLASSES = {
  slide: SLIDE,
  slideActive: `${SLIDE}--active`,
  pagination: PAGINATION,
  paginationBullet: PAGINATION_BULLET,
  paginationBulletActive: `${PAGINATION_BULLET}--active`,
  paginationBulletEdge: `${PAGINATION_BULLET}--edge`,
};
