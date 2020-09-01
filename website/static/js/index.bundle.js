!(function (t, s) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = s())
    : 'function' == typeof define && define.amd
    ? define(s)
    : ((t = 'undefined' != typeof globalThis ? globalThis : t || self).Virchual = s());
})(this, function () {
  'use strict';
  function t(t, s = 100) {
    let i;
    return (...h) => {
      clearTimeout(i),
        (i = setTimeout(
          () =>
            requestAnimationFrame(() => {
              (i = null), t(...h);
            }),
          s,
        ));
    };
  }
  function s(t) {
    t && (t.stopImmediatePropagation(), t.stopPropagation(), t.preventDefault());
  }
  class i {
    constructor() {
      this.t = [];
    }
    s(t, s, i, h = {}) {
      t.split(' ').forEach(t => {
        i && i.addEventListener(t, s, h), this.t.push({ event: t, i: s, h: i, o: h });
      });
    }
    l(t, s) {
      t.split(' ').forEach(t => {
        this.t = this.t.filter(i => {
          i && i.event === t && i.h === s && this.u(i);
        });
      });
    }
    v(t, ...s) {
      this.t.forEach(i => {
        i.h || i.event.split('.')[0] !== t || i.i(...s);
      });
    }
    m() {
      this.t.forEach(this.u), (this.t = []);
    }
    u(t) {
      t.h && t.h.removeEventListener(t.event, t.i, t.o);
    }
  }
  class h {
    constructor(s, { event: i }) {
      (this.frame = s), (this.p = !1), (this.g = i), (this.M = { _: this._.bind(this), A: t(this.A.bind(this), 1), T: this.T.bind(this) });
    }
    mount() {
      this.g.s('touchstart mousedown', this.M._, this.frame),
        this.g.s('touchmove mousemove', this.M.A, this.frame, { passive: !1 }),
        this.g.s('touchend touchcancel mouseleave mouseup dragend', this.M.T, this.frame);
    }
    _(t) {
      s(t), this.p || ((this.B = this.k(t, {})), (this.$ = this.B), this.g.v('dragstart', this.$));
    }
    A(t) {
      s(t),
        this.B &&
          ((this.$ = this.k(t, this.B)),
          this.p ? (s(t), this.g.v('drag', this.$)) : this.D(this.$) && (this.g.v('drag', this.$), (this.p = !0)));
    }
    D({ offset: t }) {
      return (180 * Math.atan(Math.abs(t.y) / Math.abs(t.x))) / Math.PI < 45;
    }
    T() {
      (this.B = null), this.p && (this.I(this.$), (this.p = !1));
    }
    I(t) {
      const s = t.j.x;
      Math.abs(s) > 0 && this.g.v('dragend', this.$);
    }
    k(t, s) {
      const { timeStamp: i, touches: h } = t,
        { clientX: e, clientY: n } = h ? h[0] : t,
        { x: o = e, y: r = n } = s.N || {},
        c = { x: e - o, y: n - r },
        a = i - (s.time || 0),
        l = { x: c.x / a, y: c.y / a };
      return { offset: c, j: l, N: { x: e, y: n }, time: i, control: l.x < 0 ? 'next' : 'prev' };
    }
  }
  function e(t, { S: s, C: i }) {
    const h = document.createElement(t);
    return (h.className = s), (h.innerHTML = i || ''), h;
  }
  function n(t) {
    t && t.parentElement && t.parentElement.removeChild(t);
  }
  function o(t, s) {
    t && t.appendChild(s);
  }
  function r(t, s) {
    t && t.firstChild && s && t.insertBefore(s, t.firstChild);
  }
  function c(t, s, i = !1) {
    i ? t.classList.remove(s) : t.classList.add(s);
  }
  function a(t, s) {
    console.log('ficken', s - t + 1, s, t);
    return Array(s - t + 1)
      .fill(0)
      .map((s, i) => t + i);
  }
  function l(t, s) {
    return t > s ? 0 : t < 0 ? s : t;
  }
  const u = () => {};
  function d(t, s, i, h) {
    return 0 === t ? t !== s : !(t !== i - 1) && s + 1 < h;
  }
  function v(t, s, i) {
    return s - i + t;
  }
  class f {
    constructor(t, s, i = {}) {
      (this.O = t),
        (this.X = s),
        (this.q = i),
        (this.F = 0),
        (this.P = t.querySelector('.virchual__pagination')),
        (this.q = Object.assign({ bullets: 5, diameter: 16 }, i)),
        (this.U = Math.floor(this.q.bullets / 2));
    }
    V() {
      const t = this.q.bullets,
        s = this.q.diameter;
      (this.P = e('div', { S: 'virchual__pagination' })),
        (this.P.style.width = t * s + 'px'),
        (this.P.style.height = s + 'px'),
        a(0, Math.min(t, this.X) - 1).forEach(s => {
          const i = d(s, s, t, this.X),
            h = this.Y(s, { G: i, H: s === this.F });
          o(this.P, h);
        }),
        o(this.O, this.P);
    }
    next() {
      this.I(1);
    }
    prev() {
      this.I(-1);
    }
    I(t) {
      const s = this.q.bullets;
      this.F = l(this.F + t, this.X - 1);
      const i = ((h = this.F), (e = this.U), (n = this.X), h - Math.max(h - e, 0) + Math.max(h - (-1 + n - e), 0));
      var h, e, n;
      const o = i === this.U && this.F > this.U,
        r = o ? (1 === t ? 0 : s - 1) : -1;
      if (
        ([].slice.call(this.P.querySelectorAll('span')).forEach((s, h) => {
          this.J({ K: s, index: h, sign: t, L: o, R: r, W: i });
        }),
        o)
      ) {
        const h = -1 + s - r,
          e = d(h, v(h, this.F, i), s, this.X),
          n = this.Y(h, { G: e });
        this.Z(t, n);
      }
    }
    J({ K: t, index: s, W: i, sign: h, L: e, R: o }) {
      if (o === s) return n(t);
      const r = d((s -= e ? h : 0), v(s, this.F, i), this.q.bullets, this.X);
      this.tt(t, { G: r, H: s === i, position: e ? s * this.q.diameter : void 0 });
    }
    Y(t, { H: s, G: i } = {}) {
      const h = e('span', { S: 'virchual__pagination-bullet' });
      return this.tt(h, { H: s, G: i, position: t * this.q.diameter }), h;
    }
    tt(t, { H: s, G: i, position: h }) {
      c(t, 'virchual__pagination-bullet--active', !s),
        c(t, 'virchual__pagination-bullet--edge', !i),
        null != h && (t.style.transform = `translateX(${h}px)`);
    }
    Z(t, s) {
      (1 === t ? o : r)(this.P, s);
    }
  }
  class m {
    constructor(t, s, i) {
      (this.frame = s),
        (this.q = i),
        (this.st = !1),
        (this.H = !1),
        (this.it = !1),
        'string' != typeof t ? ((this.P = t), (this.C = this.P.innerHTML), (this.st = !0)) : (this.C = t);
    }
    set(t, s) {
      (this[t] = s), (this.it = !0);
    }
    V() {
      const t = e('div', { S: 'virchual__slide', C: this.C });
      return this.tt(t), t;
    }
    mount(t = !1) {
      this.st
        ? this.it && this.update()
        : ((this.P = this.V()), (this.st = !0), this.P.addEventListener('transitionend', this.ht), (t ? r : o)(this.frame, this.P));
    }
    unmount() {
      (this.st = !1), n(this.P);
    }
    translate(t, { easing: s, done: i } = {}) {
      (this.ht = i || u),
        (this.P.style.transition = `transform ${this.q.speed}ms ${s ? this.q.easing : 'ease'}`),
        (this.P.style.transform = `translate3d(calc(${this.position}% + ${Math.round(t)}px), 0, 0)`);
    }
    update() {
      (this.it = !1), this.tt(this.P);
    }
    tt(t) {
      c(t, 'virchual__slide--active', !this.H), (t.style.transform = `translate3d(${this.position}%, 0, 0)`);
    }
  }
  function p(t, s, i) {
    return [...a(s - i, s - 1).map(s => g(t, s)), t[s], ...a(s + 1, s + i).map(s => g(t, s))];
  }
  function g(t, s) {
    if (0 === t.length) return;
    const i = s < 0,
      h = s > t.length - 1,
      e = i || h,
      n = h ? -1 : 1,
      o = Math.max(Math.floor(Math.abs(s) / t.length), 1);
    return e && (s += n * o * t.length), t[s];
  }
  class x {
    constructor(t, s) {
      (this.imports = t),
        (this.q = s),
        (this.controls = [].slice.call(t.et.O.querySelectorAll('.virchual__control'))),
        t.g.s('destroy', () => {}),
        (this.nt = this.ot.bind(this)),
        this.mount();
    }
    mount() {
      this.controls.forEach(t => this.imports.g.s('click', this.nt, t));
    }
    ot(t) {
      s(t), 'prev' !== t.target.closest('button').dataset.controls ? this.imports.et.next() : this.imports.et.prev();
    }
  }
  class b {
    constructor(t, s) {
      (this.imports = t), (this.q = s), (this.q = Object.assign({ threshold: 300 }, s)), this.imports.et.mount();
    }
  }
  return class extends class {
    constructor(t, s = {}) {
      let h;
      (this.O = t),
        (this.q = s),
        (this.F = 0),
        (this.slides = []),
        (this.rt = !1),
        (this.frame = this.O.querySelector('.virchual__frame')),
        (function (t) {
          if (!t) throw new Error('Invalid element');
        })(this.frame),
        (this.F = 0),
        (this.q = Object.assign({ slides: [], speed: 200, ct: 150, at: 0.6, lt: 600, easing: 'ease-out', ut: !0, window: 1 }, s)),
        (this.g = new i()),
        (this.M = { ot: this.ot.bind(this), dt: this.dt.bind(this), vt: this.vt.bind(this) });
      const e = this.q.slides;
      (h = 'function' == typeof e ? e() : e),
        (this.slides = this.ft()),
        (this.slides = this.slides.concat((h || []).map(t => new m(t, this.frame, this.q)))),
        (this.ut = new f(this.O, this.slides.length)),
        this.ut.V();
    }
    register(t, s) {
      new t({ et: this, g: this.g }, s);
    }
    mount() {
      this.g.v('mounted'), this.pt(), this.gt(), new h(this.frame, { event: this.g }).mount();
    }
    disable() {}
    enable() {}
    s(t, s) {
      this.g.s(t, s);
    }
    l(t) {
      this.g.l(t);
    }
    prev() {
      this.I('prev');
    }
    next() {
      this.I('next');
    }
    m() {
      this.g.m(), this.g.v('destroy');
    }
    I(t) {
      this.slides[this.F].translate(-100, {
        easing: !0,
        done: () => {
          this.rt = !1;
        },
      });
      const s = 'prev' === t ? -1 : 1;
      (this.F = l(this.F + 1 * s, this.slides.length - 1)),
        this.pt({ control: t }),
        ('prev' === t ? this.ut.prev.bind(this.ut) : this.ut.next.bind(this.ut))();
    }
    ft() {
      return [].slice.call(this.frame.querySelectorAll('div')).map(t => new m(t, this.frame, this.q));
    }
    pt({ control: t } = {}) {
      const s = this.slides[this.F],
        i = a(0, this.slides.length - 1),
        h = this.q.window,
        e = p(i, this.F, h);
      p(i, this.F, h + 1).forEach(i => {
        const n = this.slides[i];
        i === this.F ? s.set('isActive', !0) : s.set('isActive', !1);
        const o = e.indexOf(i);
        if (o < 0) return n.unmount();
        n.set('position', -100 * (h - o));
        const r = 'prev' === t || (null == t && this.slides[0].st && o - h < 0);
        n.mount(r);
      });
    }
    gt() {
      this.g.s('drag', this.M.dt), this.g.s('dragend', this.M.vt), this.g.s('click', this.M.ot, this.frame, { capture: !0 });
    }
    ot(t) {
      this.rt && s(t);
    }
    dt(t) {
      this.rt = !0;
      const s = p(a(0, this.slides.length - 1), this.F, this.q.window),
        i = 'prev' === t.control ? 1 : -1;
      s.forEach(s => {
        const h = this.slides[s],
          e = i * Math.abs(t.offset.x);
        h.translate(e);
      });
    }
    vt(t) {
      this.I(t.control);
    }
  } {
    constructor(t, s = {}) {
      super(t, s), (this.O = t), (this.q = s), this.register(x, { isEnabled: !0 }), this.register(b, { threshold: 300 });
    }
  };
});
