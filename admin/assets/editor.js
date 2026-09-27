//#region node_modules/svelte/src/internal/shared/utils.js
var e = Array.isArray, t = Array.prototype.indexOf, n = Array.prototype.includes, r = Array.from, i = Object.defineProperty, a = Object.getOwnPropertyDescriptor, o = Object.getOwnPropertyDescriptors, s = Object.prototype, c = Array.prototype, l = Object.getPrototypeOf, u = Object.isExtensible;
function d(e) {
	return typeof e == "function";
}
var f = () => {};
function p(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function m() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
function h(e, t) {
	if (Array.isArray(e)) return e;
	if (t === void 0 || !(Symbol.iterator in e)) return Array.from(e);
	let n = [];
	for (let r of e) if (n.push(r), n.length === t) break;
	return n;
}
var g = 1024, _ = 2048, v = 4096, y = 8192, b = 16384, x = 32768, S = 1 << 25, C = 65536, w = 1 << 19, T = 1 << 20, ee = 1 << 25, te = 65536, ne = 1 << 21, E = 1 << 22, re = 1 << 23, ie = Symbol("$state"), ae = Symbol("component"), oe = Symbol("legacy props"), se = Symbol(""), ce = Symbol("attributes"), le = Symbol("class"), ue = Symbol("style"), de = Symbol("text"), fe = Symbol("form reset"), pe = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), me = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml"), he = {}, ge = Symbol("uninitialized"), _e = "http://www.w3.org/1999/xhtml", ve = "http://www.w3.org/2000/svg", ye = "http://www.w3.org/1998/Math/MathML";
function be() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function xe(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Se() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var Ce = !1;
function we(e) {
	Ce = e;
}
var Te;
function Ee(e) {
	if (e === null) throw xe(), he;
	return Te = e;
}
function De() {
	return Ee(/* @__PURE__ */ ln(Te));
}
function D(e) {
	if (Ce) {
		if (/* @__PURE__ */ ln(Te) !== null) throw xe(), he;
		Te = e;
	}
}
function Oe(e = 1) {
	if (Ce) {
		for (var t = e, n = Te; t--;) n = /* @__PURE__ */ ln(n);
		Te = n;
	}
}
function ke(e = !0) {
	for (var t = 0, n = Te;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ ln(n);
		e && n.remove(), n = i;
	}
}
function Ae(e) {
	if (!e || e.nodeType !== 8) throw xe(), he;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function je(e) {
	return e === this.v;
}
function Me(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Ne(e) {
	return !Me(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function Pe() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Fe(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Ie(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Le() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Re(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function ze() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Be(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Ve() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function O() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function He() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Ue() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/internal/shared/clone.js
var k = [];
function We(e, t = !1, n = !1) {
	return Ge(e, /* @__PURE__ */ new Map(), "", k, null, n);
}
function Ge(t, n, r, i, a = null, o = !1) {
	if (typeof t == "object" && t) {
		var c = n.get(t);
		if (c !== void 0) return c;
		if (t instanceof Map) return new Map(t);
		if (t instanceof Set) return new Set(t);
		if (e(t)) {
			var u = Array(t.length);
			n.set(t, u), a !== null && n.set(a, u);
			for (var d = 0; d < t.length; d += 1) {
				var f = t[d];
				d in t && (u[d] = Ge(f, n, r, i, null, o));
			}
			return u;
		}
		if (l(t) === s) {
			u = {}, n.set(t, u), a !== null && n.set(a, u);
			for (var p of Object.keys(t)) u[p] = Ge(t[p], n, r, i, null, o);
			return u;
		}
		if (t instanceof Date) return t.getTime(), structuredClone(t);
		if (typeof t.toJSON == "function" && !o) return Ge(t.toJSON(), n, r, i, t);
	}
	if (t instanceof EventTarget) return t;
	try {
		return structuredClone(t);
	} catch {
		return t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var Ke = null;
function qe(e) {
	Ke = e;
}
function Je(e, t = !1, n) {
	Ke = {
		p: Ke,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: qn,
		l: null
	};
}
function Ye(e) {
	var t = Ke, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) Sn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, Ke = t.p, Xe(e);
}
function Xe(e = {}) {
	return i(e, ae, { value: !0 }), e;
}
function Ze() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Qe = [];
function $e() {
	var e = Qe;
	Qe = [], p(e);
}
function et(e) {
	if (Qe.length === 0 && !Nt) {
		var t = Qe;
		queueMicrotask(() => {
			t === Qe && $e();
		});
	}
	Qe.push(e);
}
function tt() {
	for (; Qe.length > 0;) $e();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var nt = ~(_ | v | g);
function rt(e, t) {
	e.f = e.f & nt | t;
}
function it(e) {
	e.f & 512 || e.deps === null ? rt(e, g) : rt(e, v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function at(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= te, at(t.deps));
}
function ot(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), at(e.deps), rt(e, g);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var st = !1;
function ct(e) {
	var t = st;
	try {
		return st = !1, [e(), st];
	} finally {
		st = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
function lt(e, t) {
	if (t) {
		let t = document.body;
		e.autofocus = !0, et(() => {
			document.activeElement === t && e.focus();
		});
	}
}
function ut(e) {
	Ce && /* @__PURE__ */ cn(e) !== null && un(e);
}
var dt = !1;
function ft() {
	dt || (dt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[fe]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function pt(e) {
	var t = Wn, n = qn;
	Kn(null), Jn(null);
	try {
		return e();
	} finally {
		Kn(t), Jn(n);
	}
}
function mt(e, t, n, r = n) {
	e.addEventListener(t, () => pt(n));
	let i = e[fe];
	e[fe] = i ? () => {
		i(), r(!0);
	} : () => r(!0), ft();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function ht(e, t, n, r) {
	let i = Ze() ? yt : St;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = qn, c = gt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				hn(e, s);
			}
			_t();
		}
	}
	var d = vt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ xt(e))).then(u).catch((e) => hn(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), _t();
	}) : f();
}
function gt() {
	var e = qn, t = Wn, n = Ke, r = kt;
	return function(i = !0) {
		Jn(e), Kn(t), qe(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function _t(e = !0) {
	Jn(null), Kn(null), qe(null), e && kt?.deactivate();
}
function vt() {
	var e = qn, t = e.b, n = kt, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function yt(e) {
	var t = 2 | _;
	return qn !== null && (qn.f |= w), {
		ctx: Ke,
		deps: null,
		effects: null,
		equals: je,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: ge,
		wv: 0,
		parent: qn,
		ac: null
	};
}
var bt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function xt(e, t, n) {
	let r = qn;
	r === null && Pe();
	var i = void 0, a = Jt(ge), o = !Wn, s = /* @__PURE__ */ new Set();
	return Tn(() => {
		var t = qn, n = m();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== pe && n.reject(e);
			}).finally(_t);
		} catch (e) {
			n.reject(e), _t();
		}
		var c = kt;
		if (o) {
			if (t.f & 32768) var l = vt();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(bt);
			else for (let e of s.values()) e.reject(bt);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== bt && (c.activate(), t ? (a.f |= re, Xt(a, t)) : (a.f & 8388608 && (a.f ^= re), Xt(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), bn(() => {
		for (let e of s) e.reject(bt);
	}), new Promise((e) => {
		function t(n) {
			function r() {
				n === i ? e(a) : t(i);
			}
			n.then(r, r);
		}
		t(i);
	});
}
/*#__NO_SIDE_EFFECTS__*/
function A(e) {
	let t = /* @__PURE__ */ yt(e);
	return Xn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function St(e) {
	let t = /* @__PURE__ */ yt(e);
	return t.equals = Ne, t;
}
function Ct(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Mn(t[n]);
	}
}
function wt(e) {
	var t, n = qn, r = e.parent;
	if (!Hn && r !== null && e.v !== ge && r.f & 24576) return be(), e.v;
	Jn(r);
	try {
		e.f &= ~te, Ct(e), t = cr(e);
	} finally {
		Jn(n);
	}
	return t;
}
function Tt(e) {
	var t = wt(e);
	if (!e.equals(t) && (e.wv = ar(), (!kt?.is_fork || e.deps === null) && (kt === null ? e.v = t : (kt.capture(e, t, !0), At?.capture(e, t, !0)), e.deps === null))) {
		rt(e, g);
		return;
	}
	Hn || (jt === null ? it(e) : (yn() || kt?.is_fork) && jt.set(e, t));
}
function Et(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && pt(() => {
		t.ac.abort(pe), t.ac = null;
	}), t.fn !== null && (t.teardown = f), dr(t, 0), An(t));
}
function Dt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && fr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var Ot = null, kt = null, At = null, jt = null, Mt = null, Nt = !1, Pt = !1, Ft = null, It = null, Lt = 0, j = 1, Rt = class e {
	id = j++;
	#e = !1;
	linked = !0;
	#t = null;
	#n = null;
	async_deriveds = /* @__PURE__ */ new Map();
	current = /* @__PURE__ */ new Map();
	previous = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = /* @__PURE__ */ new Set();
	#a = 0;
	#o = /* @__PURE__ */ new Map();
	#s = null;
	#c = [];
	#l = [];
	#u = /* @__PURE__ */ new Set();
	#d = /* @__PURE__ */ new Set();
	#f = /* @__PURE__ */ new Map();
	#p = /* @__PURE__ */ new Set();
	is_fork = !1;
	#m = !1;
	constructor() {
		Ot === null ? Ot = this : (Ot.#n = this, this.#t = Ot), Ot = this;
	}
	#h() {
		if (this.is_fork) return !0;
		for (let n of this.#o.keys()) {
			for (var e = n, t = !1; e.parent !== null;) {
				if (this.#f.has(e)) {
					t = !0;
					break;
				}
				e = e.parent;
			}
			if (!t) return !0;
		}
		return !1;
	}
	skip_effect(e) {
		this.#f.has(e) || this.#f.set(e, {
			d: [],
			m: []
		}), this.#p.delete(e);
	}
	unskip_effect(e, t = (e) => this.schedule(e)) {
		var n = this.#f.get(e);
		if (n) {
			this.#f.delete(e);
			for (var r of n.d) rt(r, _), t(r);
			for (r of n.m) rt(r, v), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, Lt++ > 1e3 && (this.#x(), Bt());
		for (let e of this.#u) this.#d.delete(e), rt(e, _), this.schedule(e);
		for (let e of this.#d) rt(e, v), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = Ft = [], r = [], i = It = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Gt(e), this.#h() || this.discard(), t;
		}
		if (kt = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (Ft = null, It = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Wt(e, t);
			i.length > 0 && kt.#g();
			return;
		}
		let o = this.#v();
		if (o) {
			this.#b(r), this.#b(n), o.#y(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), At = this, Ht(r), Ht(n), At = null, this.#s?.resolve();
		var s = kt;
		if (this.#a === 0 && (this.#c.length === 0 || s !== null) && this.#x(), this.#c.length > 0) {
			if (s !== null) {
				let e = s;
				e.#c.push(...this.#c.filter((t) => !e.#c.includes(t)));
			} else s = this;
		}
		s !== null && (M.clear(), s.#g());
	}
	#_(e, t, n) {
		e.f ^= g;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= g : i & 4 ? t.push(r) : or(r) && (i & 16 && this.#d.add(r), fr(r));
				var o = r.first;
				if (o !== null) {
					r = o;
					continue;
				}
			}
			for (; r !== null;) {
				var s = r.next;
				if (s !== null) {
					r = s;
					break;
				}
				r = r.parent;
			}
		}
	}
	#v() {
		for (var e = this.#t; e !== null;) {
			if (!e.is_fork) {
				for (let [t, [, n]] of this.current) if (e.current.has(t) && !n) return e;
			}
			e = e.#t;
		}
		return null;
	}
	#y(e) {
		for (let [t, n] of e.current) !this.previous.has(t) && e.previous.has(t) && this.previous.set(t, e.previous.get(t)), this.current.set(t, n);
		for (let [t, n] of e.async_deriveds) {
			let e = this.async_deriveds.get(t);
			e && n.promise.then(e.resolve).catch(e.reject);
		}
		e.async_deriveds.clear(), this.transfer_effects(e.#u, e.#d);
		let t = (e) => {
			var n = e.reactions;
			if (n !== null && !(e.f & 2 && !(e.f & 6144))) for (let e of n) {
				var r = e.f;
				if (r & 2) t(e);
				else {
					var i = e;
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), rt(i, _), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), kt = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) ot(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== ge && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), jt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		kt = this;
	}
	deactivate() {
		kt = null, jt = null;
	}
	flush() {
		try {
			Pt = !0, kt = this, this.#g();
		} finally {
			Lt = 0, Mt = null, Ft = null, It = null, Pt = !1, kt = null, jt = null, M.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(bt);
		this.#x(), this.#s?.resolve();
	}
	register_created_effect(e) {
		this.#l.push(e);
	}
	increment(e, t) {
		if (this.#a += 1, e) {
			let e = this.#o.get(t) ?? 0;
			this.#o.set(t, e + 1);
		}
	}
	decrement(e, t) {
		if (--this.#a, e) {
			let e = this.#o.get(t) ?? 0;
			e === 1 ? this.#o.delete(t) : this.#o.set(t, e - 1);
		}
		this.#m || (this.#m = !0, et(() => {
			this.#m = !1, this.linked && this.flush();
		}));
	}
	transfer_effects(e, t) {
		for (let t of e) this.#u.add(t);
		for (let e of t) this.#d.add(e);
		e.clear(), t.clear();
	}
	oncommit(e) {
		this.#r.add(e);
	}
	ondiscard(e) {
		this.#i.add(e);
	}
	settled() {
		return (this.#s ??= m()).promise;
	}
	static ensure() {
		if (kt === null) {
			let t = kt = new e();
			!Pt && !Nt && et(() => {
				t.#e || t.flush();
			});
		}
		return kt;
	}
	apply() {
		jt = null;
	}
	schedule(e) {
		if (Mt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (Ft !== null && t === qn && (Wn === null || !(Wn.f & 2))) return;
			if (n & 96) {
				if (!(n & 1024)) return;
				t.f ^= g;
			}
		}
		this.#c.push(t);
	}
	#x() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? Ot = e : t.#t = e, this.linked = !1;
		}
	}
};
function zt(e) {
	var t = Nt;
	Nt = !0;
	try {
		var n;
		for (e && (kt !== null && !kt.is_fork && kt.flush(), n = e());;) {
			if (tt(), kt === null) return n;
			kt.flush();
		}
	} finally {
		Nt = t;
	}
}
function Bt() {
	try {
		ze();
	} catch (e) {
		hn(e, Mt);
	}
}
var Vt = null;
function Ht(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && or(r) && (Vt = /* @__PURE__ */ new Set(), fr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Pn(r), Vt?.size > 0)) {
				M.clear();
				for (let e of Vt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Vt.has(n) && (Vt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || fr(n);
					}
				}
				Vt.clear();
			}
		}
		Vt = null;
	}
}
function Ut(e) {
	kt.schedule(e);
}
function Wt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), rt(e, g);
		for (var n = e.first; n !== null;) Wt(n, t), n = n.next;
	}
}
function Gt(e) {
	rt(e, g);
	for (var t = e.first; t !== null;) Gt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Kt = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Map(), qt = !1;
function Jt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: je,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function N(e, t) {
	let n = Jt(e, t);
	return Xn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Yt(e, t = !1, n = !0) {
	let r = Jt(e);
	return t || (r.equals = Ne), r;
}
function P(e, t, n = !1) {
	return Wn !== null && (!Gn || Wn.f & 131072) && Ze() && Wn.f & 4325394 && (Yn === null || !Yn.has(e)) && He(), Xt(e, n ? en(t) : t, It);
}
function Xt(e, t, n = null) {
	if (!e.equals(t)) {
		Hn ? M.set(e, t) : M.has(e) || M.set(e, e.v);
		var r = Rt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && wt(t), jt === null && it(t);
		}
		e.wv = ar(), $t(e, _, n), Ze() && qn !== null && qn.f & 1024 && !(qn.f & 96) && ($n === null ? er([e]) : $n.push(e)), !r.is_fork && Kt.size > 0 && !qt && Zt();
	}
	return t;
}
function Zt() {
	qt = !1;
	for (let e of Kt) {
		e.f & 1024 && rt(e, v);
		let t;
		try {
			t = or(e);
		} catch {
			t = !0;
		}
		t && fr(e);
	}
	Kt.clear();
}
function Qt(e) {
	P(e, e.v + 1);
}
function $t(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Ze(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === qn)) {
			var l = (c & _) === 0;
			if (l && rt(s, t), c & 131072) Kt.add(s);
			else if (c & 2) {
				var u = s;
				jt?.delete(u), c & 65536 || (c & 512 && (qn === null || !(qn.f & 2097152)) && (s.f |= te), $t(u, v, n));
			} else if (l) {
				var d = s;
				c & 16 && Vt !== null && Vt.add(d), n === null ? Ut(d) : n.push(d);
			}
		}
	}
}
function en(t) {
	if (typeof t != "object" || !t || ie in t || ae in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ N(0), u = null, d = rr, f = (e) => {
		if (rr === d) return e();
		var t = Wn, n = rr;
		Kn(null), ir(d);
		var r = e();
		return Kn(t), ir(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ N(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && Ve();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ N(n.value, u);
				return r.set(t, e), e;
			}) : P(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ N(ge, u));
					r.set(t, e), Qt(o);
				}
			} else P(n, ge), Qt(o);
			return !0;
		},
		get(e, n, i) {
			if (n === ie) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ N(en(s ? e[n] : ge), u)), r.set(n, o)), o !== void 0) {
				var c = B(o);
				return c === ge ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			var n = Reflect.getOwnPropertyDescriptor(e, t);
			if (n && "value" in n) {
				var i = r.get(t);
				i && (n.value = B(i));
			} else if (n === void 0) {
				var a = r.get(t), o = a?.v;
				if (a !== void 0 && o !== ge) return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return n;
		},
		has(e, t) {
			if (t === ie) return !0;
			var n = r.get(t), i = n !== void 0 && n.v !== ge || Reflect.has(e, t);
			return (n !== void 0 || qn !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ N(i ? en(e[t]) : ge, u)), r.set(t, n)), B(n) === ge) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ N(ge, u)), r.set(d + "", p)) : P(p, ge);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ N(void 0, u)), P(c, en(n)), r.set(t, c));
			else {
				l = c.v !== ge;
				var m = f(() => en(n));
				P(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && P(g, _ + 1);
				}
				Qt(o);
			}
			return !0;
		},
		ownKeys(e) {
			B(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== ge;
			});
			for (var [n, i] of r) i.v !== ge && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			O();
		}
	});
}
var tn, nn, rn, an;
function on() {
	if (tn === void 0) {
		tn = window, nn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		rn = a(t, "firstChild").get, an = a(t, "nextSibling").get, u(e) && (e[le] = void 0, e[ce] = null, e[ue] = void 0, e.__e = void 0), u(n) && (n[de] = void 0);
	}
}
function sn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function cn(e) {
	return rn.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function ln(e) {
	return an.call(e);
}
function F(e, t) {
	if (!Ce) return /* @__PURE__ */ cn(e);
	var n = /* @__PURE__ */ cn(Te);
	if (n === null) n = Te.appendChild(sn());
	else if (t && n.nodeType !== 3) {
		var r = sn();
		return n?.before(r), Ee(r), r;
	}
	return t && pn(n), Ee(n), n;
}
function I(e, t = !1) {
	if (!Ce) {
		var n = /* @__PURE__ */ cn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ ln(n) : n;
	}
	if (t) {
		if (Te?.nodeType !== 3) {
			var r = sn();
			return Te?.before(r), Ee(r), r;
		}
		pn(Te);
	}
	return Te;
}
function L(e, t = !1) {
	if (!Ce) return /* @__PURE__ */ cn(e);
	var n = F(e, t);
	return D(e), n;
}
function R(e, t = 1, n = !1) {
	let r = Ce ? Te : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ ln(r);
	if (!Ce) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = sn();
			return r === null ? i?.after(a) : r.before(a), Ee(a), a;
		}
		pn(r);
	}
	return Ee(r), r;
}
function un(e) {
	e.textContent = "";
}
function dn() {
	return !1;
}
function fn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function pn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function mn(e) {
	var t = qn;
	if (t === null) return Wn.f |= re, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	hn(e, t);
}
function hn(e, t) {
	if (!(t !== null && t.f & 16384)) {
		for (; t !== null;) {
			if (t.f & 128 && !(t.f & 33570816)) {
				if (!(t.f & 32768)) throw e;
				try {
					t.b.error(e);
					return;
				} catch (t) {
					e = t;
				}
			}
			t = t.parent;
		}
		throw e;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function gn(e) {
	qn === null && (Wn === null && Re(e), Le()), Hn && Ie(e);
}
function _n(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function vn(e, t) {
	var n = qn;
	n !== null && n.f & 8192 && (e |= y);
	var r = {
		ctx: Ke,
		deps: null,
		nodes: null,
		f: e | _ | 512,
		first: null,
		fn: t,
		last: null,
		next: null,
		parent: n,
		b: n && n.b,
		prev: null,
		teardown: null,
		wv: 0,
		ac: null
	};
	kt?.register_created_effect(r);
	var i = r;
	if (e & 4) Ft === null ? Rt.ensure().schedule(r) : Ft.push(r);
	else if (t !== null) {
		try {
			fr(r);
		} catch (e) {
			throw Mn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= C));
	}
	if (i !== null && (i.parent = n, n !== null && _n(i, n), Wn !== null && Wn.f & 2 && !(e & 64))) {
		var a = Wn;
		(a.effects ??= []).push(i);
	}
	return r;
}
function yn() {
	return Wn !== null && !Gn;
}
function bn(e) {
	let t = vn(8, null);
	return rt(t, g), t.teardown = e, t;
}
function xn(e) {
	gn("$effect");
	var t = qn.f;
	if (!Wn && t & 32 && Ke !== null && !Ke.i) {
		var n = Ke;
		(n.e ??= []).push(e);
	} else return Sn(e);
}
function Sn(e) {
	return vn(4 | T, e);
}
function Cn(e) {
	Rt.ensure();
	let t = vn(64 | w, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Fn(t, () => {
			Mn(t), n(void 0);
		}) : (Mn(t), n(void 0));
	});
}
function wn(e) {
	return vn(4, e);
}
function Tn(e) {
	return vn(E | w, e);
}
function En(e, t = 0) {
	return vn(8 | t, e);
}
function z(e, t = [], n = [], r = []) {
	ht(r, t, n, (t) => {
		vn(8, () => {
			e(...t.map(B));
		});
	});
}
function Dn(e, t = 0) {
	return vn(16 | t, e);
}
function On(e) {
	return vn(32 | w, e);
}
function kn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Hn, r = Wn;
		Un(!0), Kn(null);
		try {
			t.call(null);
		} catch (t) {
			hn(t, e.parent);
		} finally {
			Un(n), Kn(r);
		}
	}
}
function An(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && pt(() => {
			e.abort(pe);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Mn(n, t), n = r;
	}
}
function jn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Mn(t), t = n;
	}
}
function Mn(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Nn(e.nodes.start, e.nodes.end), n = !0), e.f |= S, An(e, t && !n), dr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	kn(e), e.f ^= S, e.f |= b;
	var i = e.parent;
	i !== null && i.first !== null && Pn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Nn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ ln(e);
		e.remove(), e = n;
	}
}
function Pn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Fn(e, t, n = !0) {
	var r = [];
	e.f |= 256, In(e, r, !0);
	var i = () => {
		n && Mn(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function In(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= y;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				In(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Ln(e) {
	e.f &= -257, Rn(e, !0);
}
function Rn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= y, e.f & 1024 || (rt(e, _), Rt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Rn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function zn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ ln(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Bn = null, Vn = !1, Hn = !1;
function Un(e) {
	Hn = e;
}
var Wn = null, Gn = !1;
function Kn(e) {
	Wn = e;
}
var qn = null;
function Jn(e) {
	qn = e;
}
var Yn = null;
function Xn(e) {
	Wn !== null && (Yn ??= /* @__PURE__ */ new Set()).add(e);
}
var Zn = null, Qn = 0, $n = null;
function er(e) {
	$n = e;
}
var tr = 1, nr = 0, rr = nr;
function ir(e) {
	rr = e;
}
function ar() {
	return ++tr;
}
function or(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~te), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (or(a) && Tt(a), a.wv > e.wv) return !0;
		}
		t & 512 && jt === null && rt(e, g);
	}
	return !1;
}
function sr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Yn !== null && Yn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? sr(a, t, !1) : t === a && (n ? rt(a, _) : a.f & 1024 && rt(a, v), Ut(a));
	}
}
function cr(e) {
	var t = Zn, n = Qn, r = $n, i = Wn, a = Yn, o = Ke, s = Gn, c = rr, l = e.f;
	Zn = null, Qn = 0, $n = null, Wn = l & 96 ? null : e, Yn = null, qe(e.ctx), Gn = !1, rr = ++nr, e.ac !== null && (pt(() => {
		e.ac.abort(pe);
	}), e.ac = null);
	try {
		e.f |= ne;
		var u = e.fn, d = u();
		e.f |= x;
		var f = lr(e);
		if (Ze() && $n !== null && !Gn && f !== null && !(e.f & 6146)) for (var p = 0; p < $n.length; p++) sr($n[p], e);
		if (i !== null && i !== e) {
			if (nr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = nr;
			if (t !== null) for (let e of t) e.rv = nr;
			$n !== null && (r === null ? r = $n : r.push(...$n));
		}
		return e.f & 8388608 && (e.f ^= re), d;
	} catch (t) {
		return lr(e), mn(t);
	} finally {
		e.f ^= ne, Zn = t, Qn = n, $n = r, Wn = i, Yn = a, qe(o), Gn = s, rr = c;
	}
}
function lr(e) {
	var t = e.deps, n = kt?.is_fork;
	if (Zn !== null) {
		var r;
		if (n || dr(e, Qn), t !== null && Qn > 0) for (t.length = Qn + Zn.length, r = 0; r < Zn.length; r++) t[Qn + r] = Zn[r];
		else e.deps = t = Zn;
		if (yn() && e.f & 512) for (r = Qn; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && Qn < t.length && (dr(e, Qn), t.length = Qn);
	return t;
}
function ur(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (Zn === null || !n.call(Zn, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512, s.f &= ~te), s.v !== ge && it(s), s.ac !== null && pt(() => {
			s.ac.abort(pe), s.ac = null, rt(s, _);
		}), Et(s), dr(s, 0);
	}
}
function dr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) ur(e, n[r]);
}
function fr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		rt(e, g);
		var n = qn, r = Vn;
		qn = e, Vn = !(t & 96);
		try {
			t & 16777232 ? jn(e) : An(e), kn(e);
			var i = cr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = tr;
		} finally {
			Vn = r, qn = n;
		}
	}
}
async function pr() {
	await Promise.resolve(), zt();
}
function B(e) {
	var t = !!(e.f & 2);
	if (Bn?.add(e), Wn !== null && !Gn && !(qn !== null && qn.f & 16384) && (Yn === null || !Yn.has(e))) {
		var r = Wn.deps;
		if (Wn.f & 2097152) e.rv < nr && (e.rv = nr, Zn === null && r !== null && r[Qn] === e ? Qn++ : Zn === null ? Zn = [e] : Zn.push(e));
		else {
			Wn.deps ??= [], n.call(Wn.deps, e) || Wn.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [Wn] : n.call(i, Wn) || i.push(Wn);
		}
	}
	if (Hn && M.has(e)) return M.get(e);
	if (t) {
		var a = e;
		if (Hn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || hr(a)) && (o = wt(a)), M.set(a, o), o;
		}
		var s = !(a.f & 512) && !Gn && Wn !== null && (Vn || !!(Wn.f & 512)), c = (a.f & x) === 0;
		or(a) && (s && (a.f |= 512), Tt(a)), s && !c && (Dt(a), mr(a));
	}
	if (jt?.has(e)) return jt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function mr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (Dt(t), mr(t));
}
function hr(e) {
	if (e.v === ge) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (M.has(t) || t.f & 2 && hr(t)) return !0;
	return !1;
}
function gr(e) {
	var t = Gn;
	try {
		return Gn = !0, e();
	} finally {
		Gn = t;
	}
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var _r = ["touchstart", "touchmove"];
function vr(e) {
	return _r.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var yr = Symbol("events"), br = /* @__PURE__ */ new Set(), xr = /* @__PURE__ */ new Set();
function Sr(e) {
	if (!Ce) return;
	e.removeAttribute("onload"), e.removeAttribute("onerror");
	let t = e.__e;
	t !== void 0 && (e.__e = void 0, queueMicrotask(() => {
		e.isConnected && e.dispatchEvent(t);
	}));
}
function Cr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Or.call(t, e), !e.cancelBubble) return pt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? et(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function wr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = Cr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && bn(() => {
		t.removeEventListener(e, o, a);
	});
}
function V(e, t, n) {
	(t[yr] ??= {})[e] = n;
}
function Tr(e) {
	for (var t = 0; t < e.length; t++) br.add(e[t]);
	for (var n of xr) n(e);
}
var Er = null, Dr = !1;
function Or(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	Er = e, Dr || (Dr = !0, setTimeout(() => {
		Dr = !1, Er = null;
	}));
	var s = 0, c = Er === e && e[yr];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[yr] = t;
			return;
		}
		var u = a.indexOf(t);
		if (u === -1) return;
		l <= u && (s = l);
	}
	if (o = a[s] || e.target, o !== t) {
		i(e, "currentTarget", {
			configurable: !0,
			get() {
				return o || n;
			}
		});
		var d = Wn, f = qn;
		Kn(null), Jn(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[yr]?.[r];
					h != null && (!o.disabled || e.target === o) && h.call(o, e);
				} catch (e) {
					p ? m.push(e) : p = e;
				}
				if (e.cancelBubble) break;
				s++, o = s < a.length ? a[s] : null;
			}
			if (p) {
				for (let e of m) queueMicrotask(() => {
					throw e;
				});
				throw p;
			}
		} finally {
			e[yr] = t, delete e.currentTarget, Kn(d), Jn(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var kr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Ar(e) {
	return kr?.createHTML(e) ?? e;
}
function jr(e) {
	var t = fn("template");
	return t.innerHTML = Ar(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function Mr(e, t) {
	var n = qn;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function H(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (Ce) return Mr(Te, null), Te;
		i === void 0 && (i = jr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ cn(i)));
		var t = r || nn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ cn(t), s = t.lastChild;
			Mr(o, s);
		} else Mr(t, t);
		return t;
	};
}
function Nr(e = "") {
	if (!Ce) {
		var t = sn(e + "");
		return Mr(t, t), t;
	}
	var n = Te;
	return n.nodeType === 3 ? pn(n) : (n.before(n = sn()), Ee(n)), Mr(n, n), n;
}
function Pr() {
	if (Ce) return Mr(Te, null), Te;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = sn();
	return e.append(t, n), Mr(t, n), e;
}
function U(e, t) {
	if (Ce) {
		var n = qn;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = Te), De();
		return;
	}
	e !== null && e.before(t);
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function Fr(e) {
	let t = 0, n = Jt(0), r;
	return () => {
		yn() && (B(n), En(() => (t === 0 && (r = gr(() => e(() => Qt(n)))), t += 1, () => {
			et(() => {
				--t, t === 0 && (r?.(), r = void 0, Qt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Ir = C | w;
function Lr(e, t, n, r) {
	new Rr(e, t, n, r);
}
var Rr = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = Ce ? Te : null;
	#n;
	#r;
	#i;
	#a = null;
	#o = null;
	#s = null;
	#c = null;
	#l = 0;
	#u = 0;
	#d = !1;
	#f = /* @__PURE__ */ new Set();
	#p = /* @__PURE__ */ new Set();
	#m = null;
	#h = Fr(() => (this.#m = Jt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = qn;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = qn.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Dn(() => {
			if (Ce) {
				let e = this.#t;
				De();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, Ir), Ce && (this.#e = Te);
	}
	#g() {
		try {
			this.#a = On(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		et(r), t && (this.#s = On(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				Se();
				return;
			}
			t = !0, n && Ue(), this.#s !== null && Fn(this.#s, () => {
				this.#s = null;
			}), this.#S(() => {
				this.#b();
			});
		};
		return {
			reset: r,
			invoke_onerror: () => {
				try {
					n = !0, this.#n.onerror?.(e, r), n = !1;
				} catch (e) {
					hn(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = On(() => e(this.#e)), et(() => {
			var e = this.#c = document.createDocumentFragment(), t = sn(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
				try {
					return On(() => this.#r(t));
				} catch (e) {
					try {
						this.error(e), n = !0;
					} catch (e) {
						hn(e, this.#i.parent);
					}
					return null;
				}
			}), this.#a === null) {
				this.#c = null, n && this.#x(kt);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, Fn(this.#o, () => {
				this.#o = null;
			}), this.#x(kt));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = On(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				zn(this.#a, e);
				let t = this.#n.pending;
				this.#o = On(() => t(this.#e));
			} else this.#x(kt);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		ot(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = qn, n = Wn, r = Ke;
		Jn(this.#i), Kn(this.#i), qe(this.#i.ctx);
		try {
			return Rt.ensure(), e();
		} finally {
			Jn(t), Kn(n), qe(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Fn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, et(() => {
			this.#d = !1, this.#m && Xt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), B(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		kt?.is_fork ? (this.#a && kt.skip_effect(this.#a), this.#o && kt.skip_effect(this.#o), this.#s && kt.skip_effect(this.#s), kt.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (Mn(this.#a), null), this.#o &&= (Mn(this.#o), null), this.#s &&= (Mn(this.#s), null), Ce && (Ee(this.#t), Oe(), Ee(ke()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return On(() => {
						var r = qn;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return hn(e, this.#i.parent), null;
				}
			}));
		};
		et(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				hn(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => hn(e, this.#i && this.#i.parent)) : n(t);
		});
	}
}, zr = !0;
function W(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[de] ??= e.nodeValue) && (e[de] = n, e.nodeValue = `${n}`);
}
function Br(e, t) {
	return Hr(e, t);
}
var Vr = /* @__PURE__ */ new Map();
function Hr(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	on();
	var l = void 0, u = Cn(() => {
		var u = n ?? t.appendChild(sn());
		Lr(u, { pending: () => {} }, (t) => {
			Je({});
			var n = Ke;
			if (o && (n.c = o), a && (i.$$events = a), Ce && Mr(t, null), zr = s, l = e(t, i) || Xe(), zr = !0, Ce && (qn.nodes.end = Te, Te === null || Te.nodeType !== 8 || Te.data !== "]")) throw xe(), he;
			Ye();
		}, c);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!d.has(r)) {
					d.add(r);
					var i = vr(r);
					for (let e of [t, document]) {
						var a = Vr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Vr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Or, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(r(br)), xr.add(f), () => {
			for (var e of d) for (let n of [t, document]) {
				var r = Vr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Or), r.delete(e), r.size === 0 && Vr.delete(n)) : r.set(e, i);
			}
			xr.delete(f), u !== n && u.parentNode?.removeChild(u);
		};
	});
	return Ur.set(l, u), l;
}
var Ur = /* @__PURE__ */ new WeakMap(), Wr = class {
	anchor;
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ new Map();
	#n = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = !0;
	constructor(e, t = !0) {
		this.anchor = e, this.#i = t;
	}
	#a = (e) => {
		if (this.#e.has(e)) {
			var t = this.#e.get(e), n = this.#t.get(t);
			if (n) Ln(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Ln(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (Mn(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						zn(r, t), t.append(sn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else Mn(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Fn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (Mn(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = kt, r = dn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = sn();
				i.append(a), this.#n.set(e, {
					effect: On(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, On(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else Ce && (this.anchor = Te), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function G(e, t, n = !1) {
	var r;
	Ce && (r = Te, De());
	var i = new Wr(e), a = n ? C : 0;
	function o(e, t) {
		if (Ce) {
			var n = Ae(r);
			if (e !== parseInt(n.substring(1))) {
				var a = ke();
				Ee(a), i.anchor = a, we(!1), i.ensure(e, t), we(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	Dn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Gr(e, t) {
	return t;
}
function Kr(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		Fn(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					qr(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = i.length === 0 && n !== null && e.pending.size === 0;
		if (l) {
			var u = n, d = u.parentNode;
			un(d), d.append(u), e.items.clear();
		}
		qr(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function qr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ee, zn(a, document.createDocumentFragment())) : Mn(t[i], n);
	}
}
var Jr;
function Yr(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = Ce ? Ee(/* @__PURE__ */ cn(u)) : u.appendChild(sn());
	}
	Ce && De();
	var d = null, f = /* @__PURE__ */ St(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Zr(v, p, c, n, a), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ee, $r(d, null, c)) : Ln(d) : Fn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: Dn(() => {
			p = B(f);
			var e = p.length;
			let t = !1;
			Ce && Ae(c) === "[!" != (e === 0) && (c = ke(), Ee(c), we(!1), t = !0);
			for (var r = /* @__PURE__ */ new Set(), u = kt, v = dn(), y = 0; y < e; y += 1) {
				Ce && Te.nodeType === 8 && Te.data === "]" && (c = Te, t = !0, we(!1));
				var b = p[y], x = a(b, y), S = h ? null : l.get(x);
				S ? (S.v && Xt(S.v, b), S.i && Xt(S.i, y), v && u.unskip_effect(S.e)) : (S = Qr(l, h ? c : Jr ??= sn(), b, x, y, o, n, i), h || (S.e.f |= ee), l.set(x, S)), r.add(x);
			}
			if (e === 0 && s && !d && (h ? d = On(() => s(c)) : (d = On(() => s(Jr ??= sn())), d.f |= ee)), e > r.size && Fe("", "", ""), Ce && e > 0 && Ee(ke()), !h) {
				if (m.set(u, r), v) {
					for (let [e, t] of l) r.has(e) || u.skip_effect(t.e);
					u.oncommit(g), u.ondiscard(_);
				} else g(u);
			}
			t && we(!0), B(f);
		}),
		flags: n,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, Ce && (c = Te);
}
function Xr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Zr(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = Xr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Ln(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= ee, _ === l) $r(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), ei(e, d, _), ei(e, _, y), $r(_, y, n), d = _, p = [], m = [], l = Xr(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) $r(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					ei(e, S.prev, C.next), ei(e, d, S), ei(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), $r(_, l, n), ei(e, _.prev, _.next), ei(e, _, d === null ? e.effect.first : d.next), ei(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Xr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Xr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (qr(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Xr(l.next);
		var T = w.length;
		if (T > 0) {
			var te = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < T; v += 1) w[v].nodes?.a?.fix();
			}
			Kr(e, w, te);
		}
	}
	o && et(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Qr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Jt(n) : /* @__PURE__ */ Yt(n, !1, !1) : null, l = o & 2 ? Jt(i) : null;
	return {
		v: c,
		i: l,
		e: On(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function $r(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ ln(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function ei(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
function K(e, t, n = !1, r = !1, i = !1, a = !1) {
	var o = e, s = "";
	if (n) {
		var c = e;
		Ce && (o = Ee(/* @__PURE__ */ cn(c)));
	}
	z(() => {
		var e = qn;
		if (s === (s = t() ?? "")) {
			Ce && De();
			return;
		}
		if (n && !Ce) {
			e.nodes = null, c.innerHTML = s, s !== "" && Mr(/* @__PURE__ */ cn(c), c.lastChild);
			return;
		}
		if (e.nodes !== null && (Nn(e.nodes.start, e.nodes.end), e.nodes = null), s !== "") {
			if (Ce) {
				for (var a = Te.data, l = De(), u = l; l !== null && (l.nodeType !== 8 || l.data !== "");) u = l, l = /* @__PURE__ */ ln(l);
				if (l === null) throw xe(), he;
				Mr(Te, u), o = Ee(l);
				return;
			}
			var d = fn(r ? "svg" : i ? "math" : "template", r ? ve : i ? ye : void 0);
			d.innerHTML = s;
			var f = r || i ? d : d.content;
			if (Mr(/* @__PURE__ */ cn(f), f.lastChild), r || i) for (; /* @__PURE__ */ cn(f);) o.before(/* @__PURE__ */ cn(f));
			else o.before(f);
		}
	});
}
//#endregion
//#region node_modules/svelte/src/internal/client/timing.js
var ti = () => performance.now(), ni = {
	tick: (e) => requestAnimationFrame(e),
	now: () => ti(),
	tasks: /* @__PURE__ */ new Set()
};
//#endregion
//#region node_modules/svelte/src/internal/client/loop.js
function ri() {
	let e = ni.now();
	ni.tasks.forEach((t) => {
		t.c(e) || (ni.tasks.delete(t), t.f());
	}), ni.tasks.size !== 0 && ni.tick(ri);
}
function ii(e) {
	let t;
	return ni.tasks.size === 0 && ni.tick(ri), {
		promise: new Promise((n) => {
			ni.tasks.add(t = {
				c: e,
				f: n
			});
		}),
		abort() {
			ni.tasks.delete(t);
		}
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/transitions.js
function ai(e, t) {
	pt(() => {
		e.dispatchEvent(new CustomEvent(t));
	});
}
function oi(e) {
	if (e === "float") return "cssFloat";
	if (e === "offset") return "cssOffset";
	if (e.startsWith("--")) return e;
	let t = e.split("-");
	return t.length === 1 ? t[0] : t[0] + t.slice(1).map((e) => e[0].toUpperCase() + e.slice(1)).join("");
}
function si(e) {
	let t = {}, n = e.split(";");
	for (let e of n) {
		let [n, r] = e.split(":");
		if (!n || r === void 0) break;
		let i = oi(n.trim());
		t[i] = r.trim();
	}
	return t;
}
var ci = (e) => e;
function li(e, t, n, r) {
	var i = !!(e & 1), a = !!(e & 2), o = i && a, s = !!(e & 4), c = o ? "both" : i ? "in" : "out", l, u = t.inert, d = t.style.overflow, f, p;
	function m() {
		return pt(() => l ??= n()(t, r?.() ?? {}, { direction: c }));
	}
	var h = {
		is_global: s,
		in() {
			if (t.inert = u, !i) {
				p?.abort(), p?.reset?.();
				return;
			}
			a || f?.abort(), f = ui(t, m(), p, 1, () => {
				ai(t, "introstart");
			}, () => {
				ai(t, "introend"), f?.abort(), f = l = void 0, t.style.overflow = d;
			});
		},
		out(e) {
			if (!a) {
				e?.(), l = void 0;
				return;
			}
			t.inert = !0, p = ui(t, m(), f, 0, () => {
				ai(t, "outrostart");
			}, () => {
				ai(t, "outroend"), e?.();
			});
		},
		stop: () => {
			f?.abort(), p?.abort();
		}
	}, g = qn;
	if ((g.nodes.t ??= []).push(h), i && zr) {
		var _ = s;
		if (!_) {
			for (var v = g.parent; v && v.f & 65536;) for (; (v = v.parent) && !(v.f & 16););
			_ = !v || !!(v.f & 32768);
		}
		_ && wn(() => {
			gr(() => h.in());
		});
	}
}
function ui(e, t, n, r, i, a) {
	var o = r === 1, s = !1;
	if (d(t)) {
		var c;
		return et(() => {
			s || (c = ui(e, t({ direction: o ? "in" : "out" }), n, r, i, a));
		}), {
			abort: () => {
				s = !0, c?.abort();
			},
			deactivate: () => c.deactivate(),
			reset: () => c.reset(),
			t: () => c.t()
		};
	}
	if (n?.deactivate(), !t?.duration && !t?.delay) return i(), a(), {
		abort: f,
		deactivate: f,
		reset: f,
		t: () => r
	};
	let { delay: l = 0, css: u, tick: p, easing: m = ci } = t;
	var h, g = () => 1 - r;
	return et(() => {
		if (!s) {
			var c = [];
			if (o && n === void 0 && (p && p(0, 1), u)) {
				var d = si(u(0, 1));
				c.push(d, d);
			}
			h = e.animate(c, {
				duration: l,
				fill: "forwards"
			}), h.onfinish = () => {
				h.cancel(), i();
				var o = n?.t() ?? 1 - r;
				n?.abort();
				var s = r - o, c = t.duration * Math.abs(s), l = [];
				if (c > 0) {
					var d = !1;
					if (u) for (var f = Math.ceil(c / (1e3 / 60)), _ = 0; _ <= f; _ += 1) {
						var v = o + s * m(_ / f), y = si(u(v, 1 - v));
						l.push(y), d ||= y.overflow === "hidden";
					}
					d && (e.style.overflow = "hidden"), g = () => {
						var e = h.currentTime;
						return o + s * m(e / c);
					}, p && ii(() => {
						if (h.playState !== "running") return !1;
						var e = g();
						return p(e, 1 - e), !0;
					});
				}
				h = e.animate(l, {
					duration: c,
					fill: "forwards"
				}), h.onfinish = () => {
					g = () => r, p?.(r, 1 - r), a();
				};
			};
		}
	}), {
		abort: () => {
			s = !0, h && (h.cancel(), h.effect = null, h.onfinish = f);
		},
		deactivate: () => {
			a = f;
		},
		reset: () => {
			r === 0 && p?.(1, 0);
		},
		t: () => g()
	};
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
var di = [..." 	\n\r\f\xA0\v﻿"];
function fi(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || di.includes(r[o - 1])) && (s === r.length || di.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function pi(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function mi(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function hi(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(mi)), i && c.push(...Object.keys(i).map(mi));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = mi(e.substring(l, u).trim());
							if (!c.includes(p)) {
								f !== ";" && d++;
								var m = e.substring(l, d).trim();
								n += " " + m + ";";
							}
						}
						l = d + 1, u = -1;
					}
				}
			}
		}
		return r && (n += pi(r)), i && (n += pi(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function q(e, t, n, r, i, a) {
	var o = e[le];
	if (Ce || o !== n || o === void 0) {
		var s = fi(n, r, a);
		(!Ce || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[le] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function gi(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function _i(e, t, n, r) {
	var i = e[ue];
	if (Ce || i !== t) {
		var a = hi(t, r);
		(!Ce || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[ue] = t;
	} else r && (Array.isArray(r) ? (gi(e, n?.[0], r[0]), gi(e, n?.[1], r[1], "important")) : gi(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var vi = Symbol("is custom element"), yi = Symbol("is html"), bi = me ? "link" : "LINK", xi = me ? "progress" : "PROGRESS";
function J(e) {
	if (Ce) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					X(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					X(e, "checked", null), e.checked = r;
				}
			}
		};
		e[fe] = n, et(n), ft();
	}
}
function Y(e, t) {
	var n = Ci(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === xi) && (e.value = t ?? "");
}
function Si(e, t) {
	var n = Ci(e);
	n.checked !== (n.checked = t ?? void 0) && (e.checked = t);
}
function X(e, t, n, r) {
	var i = Ci(e);
	Ce && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === bi) || i[t] !== (i[t] = n) && (t === "loading" && (e[se] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Ti(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function Ci(e) {
	return e[ce] ??= {
		[vi]: e.nodeName.includes("-"),
		[yi]: e.namespaceURI === _e
	};
}
var wi = /* @__PURE__ */ new Map();
function Ti(e) {
	var t = e.getAttribute("is") || e.nodeName, n = wi.get(t);
	if (n) return n;
	wi.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.add(s);
		i = l(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function Ei(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	mt(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = Di(e) ? Oi(a) : a, n(a), kt !== null && r.add(kt), await pr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (Ce && e.defaultValue !== e.value || gr(t) == null && e.value) && (n(Di(e) ? Oi(e.value) : e.value), kt !== null && r.add(kt)), En(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = kt;
			if (r.has(i)) return;
		}
		Di(e) && n === Oi(e.value) || e.type === "date" && !n && !e.value || n !== e.value && (e.value = n ?? "");
	});
}
function Di(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function Oi(e) {
	return e === "" ? null : +e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function ki(e, t) {
	return e === t || e?.[ie] === t;
}
function Ai(e = Xe(), t, n, r) {
	var i = Ke.r, a = qn;
	return wn(() => {
		var o, s;
		return En(() => {
			o = s, s = r?.() || [], gr(() => {
				ki(n(...s), e) || (t(e, ...s), o && ki(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && ki(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function ji(e, t, n, r) {
	var i = !0, o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ yt(r), B(u)) : (l && (l = !1, c = s ? gr(r) : r), c);
	let f;
	if (o) {
		var p = ie in e || oe in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = ct(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Be(t), f(m)));
	var g = i ? () => {
		var n = e[t];
		return n === void 0 ? d() : (l = !0, n);
	} : () => {
		var n = e[t];
		return n !== void 0 && (c = void 0), n === void 0 ? c : n;
	};
	if (i && !(n & 4)) return g;
	if (f) {
		var _ = e.$$legacy;
		return (function(e, t) {
			return arguments.length > 0 ? ((!i || !t || _ || h) && f(t ? g() : e), e) : g();
		});
	}
	var v = !1, y = (n & 1 ? yt : St)(() => (v = !1, g()));
	o && B(y);
	var b = qn;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? B(y) : i && o ? en(e) : e;
			return P(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return Hn && v || b.f & 16384 ? y.v : B(y);
	});
}
var Mi = {
	lang: "nb",
	strings: {
		"nav.toFront": "Til forsiden",
		"nav.toLightTheme": "Bytt til lyst tema",
		"nav.toDarkTheme": "Bytt til mørkt tema",
		"nav.menu": "Meny",
		"nav.closeMenu": "Lukk menyen",
		"nav.dismissAnnouncement": "Lukk kunngjøringen",
		"nav.submenuFor": "Undermeny for {label}",
		"nav.toTop": "Til toppen",
		"nav.toTopFull": "Til toppen av siden",
		"lightbox.prev": "Forrige bilde",
		"lightbox.next": "Neste bilde",
		"lightbox.close": "Lukk",
		"footer.readMore": "Les mer",
		"footer.newsletter.subscribe": "Meld på",
		"footer.newsletter.success": "Takk, du er påmeldt!",
		"footer.newsletter.emailPlaceholder": "din@epost.no",
		"footer.newsletter.emailLabel": "E-postadresse",
		"footer.newsletter.invalidEmail": "Skriv inn en gyldig e-postadresse.",
		"footer.newsletter.sendFailed": "Kunne ikke sende akkurat nå. Prøv igjen senere.",
		"footer.newsletter.missingTarget": "Nyhetsbrevet mangler mottaker eller endepunkt.",
		"footer.newsletter.mailtoSubject": "Nyhetsbrev-påmelding",
		"footer.newsletter.mailtoBody": "Meld på nyhetsbrevet: {email}",
		"gallery.prevImages": "Forrige bilder",
		"gallery.nextImages": "Neste bilder",
		"gallery.prevImage": "Forrige bilde",
		"gallery.nextImage": "Neste bilde",
		"gallery.imageN": "Bilde {n}",
		"video.unknownUrl": "Ukjent videolenke (YouTube og Vimeo støttes)",
		"video.emptyHint": "Lim inn en YouTube- eller Vimeo-lenke i Egenskaper",
		"share.share": "Del på {service}",
		"share.email": "Del på e-post",
		"share.copy": "Kopier lenke",
		"share.copied": "Kopiert!",
		"shop.addToCart": "Legg i handlekurv",
		"shop.added": "Lagt i kurven!",
		"shop.memberPrice": "Medlem: {price}",
		"shop.cart": "Handlekurv",
		"shop.cartEmpty": "Handlekurven er tom.",
		"shop.total": "Sum",
		"shop.checkout": "Til kassen",
		"shop.close": "Lukk",
		"shop.remove": "Fjern varen",
		"shop.increase": "Flere",
		"shop.decrease": "Færre",
		"shop.name": "Navn",
		"shop.email": "E-post",
		"shop.phone": "Telefon",
		"shop.comment": "Kommentar",
		"shop.sendOrder": "Send bestilling",
		"shop.orderSubject": "Bestilling fra {site}",
		"shop.orderSent": "Takk! Bestillingen er sendt.",
		"shop.orderDraft": "E-postutkastet er åpnet - send det for å fullføre bestillingen.",
		"shop.fillRequired": "Fyll ut navn og en gyldig e-postadresse.",
		"shop.sendFailed": "Kunne ikke sende akkurat nå. Prøv igjen senere.",
		"shop.missingTarget": "Kassen mangler mottaker eller endepunkt.",
		"shop.vippsHint": "Betaling: Vipps til {number}.",
		"shop.quickView": "Vis produktet",
		"shop.payWithVipps": "Betal med Vipps",
		"shop.vippsUnavailable": "Betaling er ikke satt opp for denne siden ennå.",
		"countdown.days": "dager",
		"countdown.hours": "timer",
		"countdown.minutes": "minutter",
		"countdown.seconds": "sekunder",
		"render.missingPlugin": "Blokktypen '{type}' er ikke tilgjengelig (mangler plugin eller nyere Urd?)",
		"map.larger": "Vis større kart",
		"map.mapTitle": "Kart",
		"map.openOsm": "Åpne kartet på OpenStreetMap",
		"form.choose": "Velg …",
		"form.invalidChoice": "Velg et av alternativene",
		"form.invalidDate": "Skriv en gyldig dato",
		"form.invalidEmail": "Skriv en gyldig e-postadresse",
		"form.noRecipient": "Skjemaet mangler mottakeradresse.",
		"form.required": "{label} må fylles ut",
		"form.send": "Send",
		"form.sendFailed": "Kunne ikke sende akkurat nå. Prøv igjen senere.",
		"form.subjectDefault": "Henvendelse fra nettsiden",
		"form.thanks": "Takk! Meldingen er sendt.",
		"form.yes": "Ja",
		"calendar.addGoogle": "Legg til i Google",
		"calendar.addGoogleTitle": "Legger kalenderen til i din egen Google Kalender",
		"calendar.all": "Alle",
		"calendar.dateLine": "{wd} {d}. {m}",
		"calendar.empty": "Ingen kommende arrangementer",
		"calendar.inDays.one": "Om {n} dag",
		"calendar.inDays.other": "Om {n} dager",
		"calendar.more": "+{n}",
		"calendar.next": "Neste arrangement",
		"calendar.nextMonth": "Neste måned",
		"calendar.prevMonth": "Forrige måned",
		"calendar.signup": "Meld deg på",
		"calendar.signupTitle": "Åpner påmeldingssiden arrangøren har lagt i arrangementets beskrivelse",
		"calendar.subscribe": "Abonner",
		"calendar.subscribeMulti": "Abonner (kalender)",
		"calendar.subscribeTitle": "Åpner kalender-appen din og legger til kalenderen der, så nye og endrede arrangementer følger med automatisk",
		"calendar.timeAt": "kl. {time}",
		"calendar.today": "I dag!",
		"calendar.tomorrow": "I morgen"
	},
	dates: {
		months: [
			"januar",
			"februar",
			"mars",
			"april",
			"mai",
			"juni",
			"juli",
			"august",
			"september",
			"oktober",
			"november",
			"desember"
		],
		monthsShort: [
			"jan",
			"feb",
			"mar",
			"apr",
			"mai",
			"jun",
			"jul",
			"aug",
			"sep",
			"okt",
			"nov",
			"des"
		],
		weekdays: [
			"mandag",
			"tirsdag",
			"onsdag",
			"torsdag",
			"fredag",
			"lørdag",
			"søndag"
		],
		weekdaysShort: [
			"man",
			"tir",
			"ons",
			"tor",
			"fre",
			"lør",
			"søn"
		]
	}
}, Ni = [
	"nb",
	"nn",
	"en-GB",
	"se",
	"tr"
], Pi = /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/, Fi = {
	nb: [
		"no",
		"nor",
		"nb",
		"nob"
	],
	nn: ["nn", "nno"],
	se: [
		"se",
		"sme",
		"smj",
		"sma"
	],
	tr: ["tr", "tur"],
	"en-GB": ["en", "eng"]
};
function Ii(e) {
	let t = String(e ?? "").trim().toLowerCase();
	for (let [e, n] of Object.entries(Fi)) if (n.some((e) => t === e || t.startsWith(`${e}-`))) return e;
	return null;
}
function Li(e) {
	return Ni.includes(String(e ?? ""));
}
function Ri(e) {
	let t = [];
	if (!Array.isArray(e)) return ["languages must be a list"];
	for (let n of e) {
		if (!n || typeof n != "object" || Array.isArray(n)) {
			t.push("languages: every entry must be an object");
			continue;
		}
		let e = String(n.code ?? "");
		Pi.test(e) ? Li(e) && t.push(`languages: '${e}' is built into Urd and cannot be overridden`) : t.push(`languages: '${e}' is not a valid language code`), (typeof n.name != "string" || !n.name.trim()) && t.push(`languages/${e}: name is missing (the language's own name)`);
		for (let r of ["site", "admin"]) n[r] !== void 0 && typeof n[r] != "boolean" && t.push(`languages/${e}: ${r} must be a boolean`);
		n.site !== !0 && n.admin !== !0 && t.push(`languages/${e}: must cover site, admin or both`);
	}
	return t;
}
function zi(e) {
	let t = Ii(e);
	if (t) return t;
	let n = String(e ?? "").trim();
	return Pi.test(n) ? n : "nb";
}
async function Bi(e, t) {
	try {
		return await (await import(
			/* @vite-ignore */
			"/assets/urd/language-packs.js"
)).loadPackStrings(e, t);
	} catch {
		return null;
	}
}
({ ...Mi.strings });
var Vi = {
	lang: "nb",
	dict: {}
};
function Hi(e, t) {
	if (!t) return e;
	let n = e;
	for (let [e, r] of Object.entries(t)) n = n.replaceAll(`{${e}}`, String(r));
	return n;
}
function Z(e, t) {
	return Hi(Vi.dict[e] ?? e, t);
}
function Ui(e) {
	let t = `api.${e?.code}`;
	return e?.code && Vi.dict[t] !== void 0 ? Hi(Vi.dict[t], e) : e?.error ?? null;
}
function Wi() {
	return Vi.lang;
}
function Gi() {
	let e = null;
	try {
		e = localStorage.getItem("urd-admin-lang");
	} catch {}
	if (e) return zi(e);
	for (let e of navigator.languages ?? [navigator.language]) {
		let t = Ii(e);
		if (t) return t;
	}
	return "en-GB";
}
var Ki;
new Promise((e) => {
	Ki = e;
});
async function qi(e = Gi()) {
	let t = async (e) => (await import(
		/* @vite-ignore */
		`/assets/urd/locales/admin/${e}.js`
)).default.strings;
	Vi.lang = zi(e);
	let n = Li(Vi.lang);
	try {
		Object.assign(Vi.dict, await t("nb")), n && Vi.lang !== "nb" && Object.assign(Vi.dict, await t(Vi.lang));
	} catch {}
	if (!n) {
		let e = await Bi(Vi.lang, "admin");
		e ? Object.assign(Vi.dict, e) : Vi.lang = "nb";
	}
	return Ki(Vi.lang), Vi.lang;
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region node_modules/svelte/src/transition/index.js
function Ji(e) {
	let t = e - 1;
	return t * t * t + 1;
}
function Yi(e) {
	let t = typeof e == "string" && e.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
	return t ? [parseFloat(t[1]), t[2] || "px"] : [e, "px"];
}
function Xi(e, { delay: t = 0, duration: n = 400, easing: r = Ji, x: i = 0, y: a = 0, opacity: o = 0 } = {}) {
	let s = getComputedStyle(e), c = +s.opacity, l = s.transform === "none" ? "" : s.transform, u = c * (1 - o), [d, f] = Yi(i), [p, m] = Yi(a);
	return {
		delay: t,
		duration: n,
		easing: r,
		css: (e, t) => `
			transform: ${l} translate(${(1 - e) * d}${f}, ${(1 - e) * p}${m});
			opacity: ${c - u * t}`
	};
}
//#endregion
//#region src/lib/draftStore.js
function Zi(e, t, n, r) {
	if (r) {
		let t = localStorage.getItem(r);
		if (t !== null) {
			if (localStorage.getItem(e) === null) try {
				localStorage.setItem(e, t);
			} catch {}
			localStorage.getItem(e) !== null && localStorage.removeItem(r);
		}
	}
	let i = t(), a = JSON.stringify(i), o = JSON.parse(a), s = localStorage.getItem(e);
	if (s) try {
		o = JSON.parse(s);
	} catch {
		localStorage.removeItem(e);
	}
	return {
		get data() {
			return o;
		},
		save() {
			let t = JSON.stringify(o);
			if (t === a) return localStorage.removeItem(e), !0;
			try {
				return localStorage.setItem(e, t), !0;
			} catch (e) {
				return n?.(e), !1;
			}
		},
		reset() {
			return localStorage.removeItem(e), o = JSON.parse(a), o;
		},
		replace(e) {
			return o = e, o;
		},
		amendBaseline(e) {
			let t = JSON.parse(a);
			e(t), a = JSON.stringify(t);
		},
		hasDraft() {
			return localStorage.getItem(e) !== null;
		}
	};
}
//#endregion
//#region ../template/assets/engine/0.7.4/anchored.js
function Qi(e = globalThis) {
	let t = e?.HTMLElement?.prototype, n = e?.CSS;
	return !!(t && "popover" in t && typeof t.showPopover == "function" && typeof n?.supports == "function" && n.supports("anchor-name: --urd") && n.supports("position-try-fallbacks: flip-block"));
}
var $i = 0;
function ea(e = "urd-pop") {
	return $i += 1, `--${e}-${$i}`;
}
function ta(e, t) {
	let n = e?.closest?.(".panel-body, .block-menu-body");
	n && (t ? n.style.setProperty("anchor-name", "--urd-pane") : n.style.removeProperty("anchor-name"));
}
//#endregion
//#region src/lib/ColorPicker.svelte
var na = /* @__PURE__ */ H("<button type=\"button\" class=\"cp-eye svelte-zxiloo\"><svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 2l4 4-3 3-4-4 3-3z\"></path><path d=\"M15 5L4 16l-1 5 5-1L19 9\"></path></svg></button>"), ra = /* @__PURE__ */ H("<input type=\"number\" min=\"0\" max=\"255\" class=\"svelte-zxiloo\"/>"), ia = /* @__PURE__ */ H("<button type=\"button\"></button>"), aa = /* @__PURE__ */ H("<span class=\"cp-label svelte-zxiloo\"> <!></span> <span class=\"cp-tokens svelte-zxiloo\"></span>", 1), oa = /* @__PURE__ */ H("<span class=\"cp-saved svelte-zxiloo\"><button type=\"button\" class=\"cp-token svelte-zxiloo\"></button> <button type=\"button\" class=\"cp-del svelte-zxiloo\">×</button></span>"), sa = /* @__PURE__ */ H("<span class=\"cp-tokens svelte-zxiloo\"></span>"), ca = /* @__PURE__ */ H("<button type=\"button\" class=\"cp-token svelte-zxiloo\"></button>"), la = /* @__PURE__ */ H("<span class=\"cp-label svelte-zxiloo\"> </span> <span class=\"cp-tokens svelte-zxiloo\"></span>", 1), ua = /* @__PURE__ */ H("<div class=\"cp-sv svelte-zxiloo\"><span class=\"cp-cursor svelte-zxiloo\"></span></div> <input class=\"cp-hue svelte-zxiloo\" type=\"range\" min=\"0\" max=\"360\" step=\"1\"/> <input class=\"cp-alpha svelte-zxiloo\" type=\"range\" min=\"0\" max=\"100\" step=\"1\"/> <span class=\"cp-row svelte-zxiloo\"><span class=\"cp-preview svelte-zxiloo\"></span> <input class=\"cp-hex svelte-zxiloo\" spellcheck=\"false\"/> <!></span> <span class=\"cp-row cp-rgb svelte-zxiloo\"></span> <!> <span class=\"cp-label cp-label-row svelte-zxiloo\"> <button type=\"button\" class=\"cp-add svelte-zxiloo\">+</button></span> <!> <!>", 1), da = /* @__PURE__ */ H("<button type=\"button\" class=\"cp-clear svelte-zxiloo\">×</button>"), fa = /* @__PURE__ */ H("<div class=\"cp-pop cp-anchored svelte-zxiloo\" popover=\"auto\"><!></div>"), pa = /* @__PURE__ */ H("<div class=\"cp-pop svelte-zxiloo\"><!></div>"), ma = /* @__PURE__ */ H("<span class=\"cp svelte-zxiloo\"><button type=\"button\"></button> <!> <!></span>");
function ha(e, t) {
	Je(t, !0);
	let n = (e) => {
		var t = ua(), n = I(t), a = L(n), o = R(n, 2);
		J(o);
		var s = R(o, 2);
		J(s);
		var c = R(s, 2), l = F(c), u = R(l, 2);
		J(u);
		var d = R(u, 2), f = (e) => {
			var t = na();
			z((e) => X(t, "title", e), [() => Z("cp.eyedropper")]), V("click", t, be), U(e, t);
		};
		G(d, (e) => {
			ye && e(f);
		}), D(c);
		var p = R(c, 2);
		Yr(p, 22, () => [
			"R",
			"G",
			"B"
		], (e) => e, (e, t, n) => {
			var r = ra();
			J(r), z((e) => {
				X(r, "title", t), Y(r, e);
			}, [() => _e(B(n))]), V("change", r, (e) => ve(B(n), e.target.value)), U(e, r);
		}), D(p);
		var v = R(p, 2), y = (e) => {
			var t = aa(), n = I(t), a = F(n, !0), o = R(a), s = (e) => {
				var t = Nr();
				z((e) => W(t, e), [() => Z("cp.linkedSuffix", { token: m() })]), U(e, t);
			}, c = /* @__PURE__ */ A(() => m());
			G(o, (e) => {
				B(c) && e(s);
			}), D(n);
			var l = R(n, 2);
			Yr(l, 21, i, ([e, t]) => e, (e, t) => {
				var n = /* @__PURE__ */ A(() => h(B(t), 2));
				let i = () => B(n)[0], a = () => B(n)[1];
				var o = ia();
				let s;
				z((e) => {
					s = q(o, 1, "cp-token svelte-zxiloo", null, s, { active: r() === i() }), _i(o, `background: ${a() ?? ""}`), X(o, "title", e);
				}, [() => Z("cp.tokenTitle", { name: i() })]), V("click", o, () => me(i(), a())), U(e, o);
			}), D(l), z((e) => W(a, e), [() => Z("cp.themeColors")]), U(e, t);
		};
		G(v, (e) => {
			i().length && e(y);
		});
		var b = R(v, 2), x = F(b), S = R(x);
		D(b);
		var ne = R(b, 2), E = (e) => {
			var t = sa();
			Yr(t, 20, () => B(_), (e) => e, (e, t) => {
				var n = oa(), r = F(n), i = R(r, 2);
				D(n), z((e) => {
					_i(r, `background: ${t ?? ""}`), X(r, "title", t), X(i, "title", e);
				}, [() => Z("cp.removeSaved")]), V("click", r, () => xe(t)), V("click", i, () => Ce(t)), U(e, n);
			}), D(t), U(e, t);
		};
		G(ne, (e) => {
			B(_).length && e(E);
		});
		var re = R(ne, 2), ie = (e) => {
			var t = la(), n = I(t), r = L(n, !0), i = R(n, 2);
			Yr(i, 20, () => B(g), (e) => e, (e, t) => {
				var n = ca();
				z(() => {
					_i(n, `background: ${t ?? ""}`), X(n, "title", t);
				}), V("click", n, () => xe(t)), U(e, n);
			}), D(i), z((e) => W(r, e), [() => Z("common.recent")]), U(e, t);
		};
		G(re, (e) => {
			B(g).length && e(ie);
		}), z((e, t, r, i, c) => {
			_i(n, `background-image: linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent); background-color: hsl(${B(C) ?? ""}, 100%, 50%)`), _i(a, `left: ${B(w) * 100}%; top: ${(1 - B(T)) * 100}%`), Y(o, B(C)), Y(s, e), X(s, "title", t), _i(s, `background: linear-gradient(to right, transparent, ${r ?? ""}), repeating-conic-gradient(rgb(255 255 255 / 35%) 0 25%, rgb(0 0 0 / 35%) 0 50%) 0 0 / 10px 10px`), _i(l, `background: ${B(te) ?? ""}`), Y(u, B(te)), W(x, `${i ?? ""} `), X(S, "title", c);
		}, [
			() => Math.round(B(ee) * 100),
			() => Z("cp.alpha"),
			() => ae(),
			() => Z("cp.saved"),
			() => Z("cp.saveTitle")
		]), V("pointerdown", n, he), V("input", o, (e) => {
			P(C, Number(e.target.value), !0), se();
		}), V("input", s, (e) => {
			P(ee, Number(e.target.value) / 100), se();
		}), V("change", u, ge), V("click", S, Se), U(e, t);
	}, r = ji(t, "value", 3, "#000000"), i = ji(t, "tokens", 19, () => []), a = ji(t, "label", 19, () => Z("cp.pickColor")), o = ji(t, "allowClear", 3, !1), s = "urd-recent-colors", c = "urd-saved-colors", l = Qi(), u = ea("urd-cp"), d = u.slice(2), f = /* @__PURE__ */ N(null), p = () => {
		let e = i().find(([e]) => e === r());
		return e ? e[1] : r();
	}, m = () => i().find(([e]) => e === r())?.[0] ?? null, g = /* @__PURE__ */ N(en([])), _ = /* @__PURE__ */ N(en([])), v = "", y = "", b = /* @__PURE__ */ N(null), x = /* @__PURE__ */ N(!1), S = /* @__PURE__ */ N(en({
		top: 0,
		left: 0
	})), C = /* @__PURE__ */ N(0), w = /* @__PURE__ */ N(0), T = /* @__PURE__ */ N(1), ee = /* @__PURE__ */ N(1), te = /* @__PURE__ */ N("#000000");
	function ne(e) {
		let t = /^#?([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(String(e).trim());
		if (!t) return null;
		let n = parseInt(t[1], 16), r = t[2] ? parseInt(t[2], 16) / 255 : 1;
		return [
			n >> 16 & 255,
			n >> 8 & 255,
			n & 255,
			r
		];
	}
	let E = (e, t, n) => "#" + [
		e,
		t,
		n
	].map((e) => e.toString(16).padStart(2, "0")).join("");
	function re(e, t, n) {
		e /= 255, t /= 255, n /= 255;
		let r = Math.max(e, t, n), i = r - Math.min(e, t, n), a = 0;
		return i && (a = r === e ? (t - n) / i % 6 : r === t ? (n - e) / i + 2 : (e - t) / i + 4, a *= 60, a < 0 && (a += 360)), [
			a,
			r ? i / r : 0,
			r
		];
	}
	function ie(e, t, n) {
		let r = n * t, i = r * (1 - Math.abs(e / 60 % 2 - 1)), a = n - r, [o, s, c] = e < 60 ? [
			r,
			i,
			0
		] : e < 120 ? [
			i,
			r,
			0
		] : e < 180 ? [
			0,
			r,
			i
		] : e < 240 ? [
			0,
			i,
			r
		] : e < 300 ? [
			i,
			0,
			r
		] : [
			r,
			0,
			i
		];
		return [
			Math.round((o + a) * 255),
			Math.round((s + a) * 255),
			Math.round((c + a) * 255)
		];
	}
	function ae() {
		return E(...ie(B(C), B(w), B(T)));
	}
	function oe() {
		let e = ae();
		return B(ee) >= .995 ? e : e + Math.round(B(ee) * 255).toString(16).padStart(2, "0");
	}
	function se() {
		P(te, oe(), !0), y = B(te), t.onchange?.(B(te));
	}
	function ce(e) {
		let t = ne(e);
		return t ? (((e) => {
			var t = h(e, 3);
			P(C, t[0], !0), P(w, t[1], !0), P(T, t[2], !0);
		})(re(t[0], t[1], t[2])), P(ee, t[3], !0), P(te, oe(), !0), !0) : !1;
	}
	function le() {
		ce(p()) || ce("#000000"), v = r(), y = "";
		try {
			let e = JSON.parse(localStorage.getItem(s) ?? "[]");
			P(g, Array.isArray(e) ? e : [], !0);
		} catch {
			P(g, [], !0);
		}
		try {
			let e = JSON.parse(localStorage.getItem(c) ?? "[]");
			P(_, Array.isArray(e) ? e : [], !0);
		} catch {
			P(_, [], !0);
		}
	}
	function ue(e) {
		e.newState === "open" ? (le(), ta(B(b), !0), P(x, !0)) : B(x) && (ta(B(b), !1), P(x, !1), fe());
	}
	function de() {
		le();
		let e = B(b).getBoundingClientRect(), t = B(b).closest(".panel-body")?.getBoundingClientRect(), n = t ? t.right : window.innerWidth, r = Math.max(8, Math.min(e.right - 236, n - 236 - 8)), i = e.bottom + 380 + 8 > window.innerHeight ? Math.max(8, e.top - 380 - 8) : e.bottom + 6;
		P(S, {
			top: i,
			left: r
		}, !0), P(x, !0);
	}
	function fe() {
		if (y && y !== v) {
			let e = [y, ...B(g).filter((e) => e !== y)].slice(0, 8);
			localStorage.setItem(s, JSON.stringify(e));
		}
	}
	function pe() {
		if (l) {
			B(f)?.hidePopover();
			return;
		}
		P(x, !1), fe();
	}
	function me(e, n) {
		ce(n), P(te, n, !0), t.onchange?.(e);
	}
	function he(e) {
		let t = e.currentTarget;
		t.setPointerCapture(e.pointerId);
		let n = (e) => {
			let n = t.getBoundingClientRect();
			P(w, Math.min(1, Math.max(0, (e.clientX - n.left) / n.width)), !0), P(T, 1 - Math.min(1, Math.max(0, (e.clientY - n.top) / n.height))), se();
		};
		n(e);
		let r = (e) => n(e), i = () => {
			t.removeEventListener("pointermove", r), t.removeEventListener("pointerup", i);
		};
		t.addEventListener("pointermove", r), t.addEventListener("pointerup", i);
	}
	function ge(e) {
		ce(e.target.value) ? se() : P(te, ae(), !0);
	}
	function _e(e) {
		return (ne(ae()) ?? [
			0,
			0,
			0
		])[e];
	}
	function ve(e, t) {
		let n = ne(ae()) ?? [
			0,
			0,
			0
		];
		n[e] = Math.min(255, Math.max(0, Number(t) || 0)), ((e) => {
			var t = h(e, 3);
			P(C, t[0], !0), P(w, t[1], !0), P(T, t[2], !0);
		})(re(...n)), se();
	}
	let ye = typeof window < "u" && "EyeDropper" in window;
	async function be() {
		try {
			ce((await new window.EyeDropper().open()).sRGBHex) && se();
		} catch {}
	}
	function xe(e) {
		ce(e) && se();
	}
	function Se() {
		let e = oe();
		B(_).includes(e) || (P(_, [e, ...B(_)].slice(0, 12), !0), localStorage.setItem(c, JSON.stringify(We(B(_)))));
	}
	function Ce(e) {
		P(_, B(_).filter((t) => t !== e), !0), localStorage.setItem(c, JSON.stringify(We(B(_))));
	}
	xn(() => {
		if (!B(x)) return;
		let e = () => pe();
		if (window.addEventListener("blur", e), l) return () => window.removeEventListener("blur", e);
		let t = (e) => {
			B(b) && !B(b).contains(e.target) && pe();
		}, n = (e) => {
			e.key === "Escape" && pe();
		};
		return document.addEventListener("pointerdown", t, !0), document.addEventListener("keydown", n, !0), () => {
			document.removeEventListener("pointerdown", t, !0), document.removeEventListener("keydown", n, !0), window.removeEventListener("blur", e);
		};
	});
	var we = ma(), Te = F(we);
	let Ee;
	var De = R(Te, 2), Oe = (e) => {
		var n = da();
		z((e, t) => {
			X(n, "title", e), X(n, "aria-label", t);
		}, [() => Z("cp.clearTitle"), () => Z("cp.clear")]), V("click", n, () => t.onchange?.("")), U(e, n);
	};
	G(De, (e) => {
		o() && r() && e(Oe);
	});
	var ke = R(De, 2), Ae = (e) => {
		var t = fa(), r = F(t), i = (e) => {
			n(e);
		};
		G(r, (e) => {
			B(x) && e(i);
		}), D(t), Ai(t, (e) => P(f, e), () => B(f)), z(() => {
			X(t, "id", d), _i(t, `position-anchor: ${u ?? ""}`);
		}), wr("toggle", t, ue), V("click", t, (e) => e.preventDefault()), U(e, t);
	}, je = (e) => {
		var t = pa(), r = F(t);
		n(r), D(t), z(() => _i(t, `top: ${B(S).top ?? ""}px; left: ${B(S).left ?? ""}px`)), V("click", t, (e) => e.preventDefault()), U(e, t);
	};
	G(ke, (e) => {
		l ? e(Ae) : B(x) && e(je, 1);
	}), D(we), Ai(we, (e) => P(b, e), () => B(b)), z((e, t, n) => {
		Ee = q(Te, 1, "cp-swatch svelte-zxiloo", null, Ee, {
			linked: e,
			"cp-empty": o() && !r()
		}), _i(Te, `background: ${t ?? ""}${l ? `; anchor-name: ${u}` : ""}`), X(Te, "title", n), X(Te, "popovertarget", l ? d : void 0), X(Te, "aria-label", a());
	}, [
		() => m(),
		() => r() ? p() : "transparent",
		() => m() ? Z("cp.linkedTitle", {
			label: a(),
			token: m()
		}) : a()
	]), V("click", Te, function(...e) {
		(l ? void 0 : () => B(x) ? pe() : de())?.apply(this, e);
	}), U(e, we), Ye();
}
Tr([
	"pointerdown",
	"input",
	"change",
	"click"
]);
//#endregion
//#region ../template/assets/engine/0.7.4/imageTools.js
var ga = 1600, _a = .82, va = .6, ya = 15e6;
async function ba(e, t = ga) {
	if (Sa(e)) return Ca(await e.text());
	let n = await createImageBitmap(e), r = Math.min(1, t / Math.max(n.width, n.height)), i = Math.round(n.width * r), a = Math.round(n.height * r), o = document.createElement("canvas");
	o.width = i, o.height = a, o.getContext("2d").drawImage(n, 0, 0, i, a), n.close();
	let s = (e) => new Promise((t) => o.toBlob(t, "image/webp", e)), c = await s(_a);
	return c.size > 4e5 && (c = await s(va)), {
		dataUrl: await new Promise((e) => {
			let t = new FileReader();
			t.onload = () => e(t.result), t.readAsDataURL(c);
		}),
		bytes: c.size,
		width: i,
		height: a
	};
}
var xa = "image/svg+xml";
function Sa(e) {
	return e.type === xa || /\.svg$/i.test(e.name || "");
}
function Ca(e) {
	let t = String(e ?? "");
	if (!/<svg[\s>]/i.test(t)) throw Error("Invalid SVG");
	if (/<\s*script[\s>]/i.test(t) || /<\s*foreignObject[\s>]/i.test(t) || /\son[a-z]+\s*=/i.test(t) || /javascript:/i.test(t)) throw Error("The SVG contains scripts or event handlers and cannot be used");
	let n = new Blob([t]).size, r = `data:${xa};base64,${btoa(unescape(encodeURIComponent(t)))}`, i = t.match(/<svg\b[^>]*>/i)?.[0] ?? "", a = i.match(/viewBox\s*=\s*["']\s*([-\d.]+(?:[\s,]+[-\d.]+){3})\s*["']/i)?.[1]?.split(/[\s,]+/).map(Number);
	return {
		dataUrl: r,
		bytes: n,
		width: a?.length === 4 ? a[2] : Number.parseFloat(i.match(/\bwidth\s*=\s*["']?([\d.]+)/i)?.[1]) || 0,
		height: a?.length === 4 ? a[3] : Number.parseFloat(i.match(/\bheight\s*=\s*["']?([\d.]+)/i)?.[1]) || 0
	};
}
function wa(e, t, n = .04) {
	let r = String(e ?? "");
	if (!t || !(t.width > 0) || !(t.height > 0)) return r;
	let i = r.match(/<svg\b[^>]*>/i)?.[0];
	if (!i) return r;
	let a = (e) => Math.round(e * 1e3) / 1e3, o = Math.max(t.width, t.height) * Math.max(0, n), s = a(t.x - o), c = a(t.y - o), l = a(t.width + 2 * o), u = a(t.height + 2 * o), d = i.replace(/\sviewBox\s*=\s*["'][^"']*["']/i, "").replace(/\swidth\s*=\s*["'][^"']*["']/i, "").replace(/\sheight\s*=\s*["'][^"']*["']/i, "").replace(/<svg\b/i, `<svg viewBox="${s} ${c} ${l} ${u}" width="${l}" height="${u}"`);
	return r.replace(i, d);
}
function Ta(e) {
	let t = String(e ?? "").match(/<svg\b[^>]*>/i)?.[0] ?? "", n = t.match(/viewBox\s*=\s*["']\s*([-\d.]+(?:[\s,]+[-\d.]+){3})\s*["']/i)?.[1]?.split(/[\s,]+/).map(Number);
	if (n?.length === 4 && n.every(Number.isFinite)) return n;
	let r = Number.parseFloat(t.match(/\bwidth\s*=\s*["']?([\d.]+)/i)?.[1]), i = Number.parseFloat(t.match(/\bheight\s*=\s*["']?([\d.]+)/i)?.[1]);
	return r > 0 && i > 0 ? [
		0,
		0,
		r,
		i
	] : null;
}
function Ea(e) {
	let t = e || "";
	if (/^data:image\/svg\+xml[;,]/.test(t)) return "svg";
	let n = t.match(/^data:audio\/([a-z0-9.+-]+)[;,]/i)?.[1]?.toLowerCase();
	if (n) return {
		mpeg: "mp3",
		mp3: "mp3",
		mp4: "m4a",
		"x-m4a": "m4a",
		aac: "aac",
		wav: "wav",
		"x-wav": "wav",
		ogg: "ogg",
		webm: "webm",
		flac: "flac"
	}[n] ?? "mp3";
	let r = t.match(/^data:video\/([a-z0-9.+-]+)[;,]/i)?.[1]?.toLowerCase();
	return r ? r === "webm" ? "webm" : "mp4" : "webp";
}
function Da(e, t = "image") {
	return e.replace(/\.[^.]+$/, "").toLowerCase().replaceAll("æ", "ae").replaceAll("ø", "o").replaceAll("å", "a").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || t;
}
function Oa(e) {
	let t = 5381;
	for (let n = 0; n < e.length; n++) t = (t << 5) + t + e.charCodeAt(n) >>> 0;
	return t.toString(16).padStart(8, "0");
}
//#endregion
//#region ../template/assets/engine/0.7.4/glyphs.js
var ka = "urd-recent-glyphs", Aa = "urd-recent-icons", ja = [
	["glyphCat.symbols", "★ ☆ ✦ ✧ ✩ ✪ ✫ ✭ ✮ ✯ ✵ ✳ ✴ ❖ ❋ ✿ ❀ ❁ ✾ ❃ ☘ ◆ ◇ ● ○ ◎ ■ □ ▣ ▲ △ ▼ ▽ ⬡ ⬢ ♦ ♠ ♣ ♥ ♡ ✓ ✔ ✕ ✖ ✗ ✘ ✚ ✜ ☀ ☾ ♪ ♫ ♬ ☮ ☯ ⚜ ⚓ ⚡ ☂ ✂ ✏ ✒ ✉ ☎ ⌛ ⏳ ♻ ⚠ ☑ ⚙ § © ® ™ ° ± × ÷ ∞ ≈ ≠ ≤ ≥ € £ ¥ • ‣ ⁂"],
	["glyphCat.arrows", "→ ← ↑ ↓ ↔ ↕ ↗ ↘ ↙ ↖ ⇒ ⇐ ⇑ ⇓ ⇔ ➜ ➤ ➔ ↩ ↪ ⤴ ⤵ ↺ ↻ ⟲ ⟳ « » ‹ ›"],
	["glyphCat.smileys", "😀 😃 😄 😁 😆 😅 😂 🙂 😉 😊 😇 🥰 😍 🤩 😘 😋 😜 🤪 😎 🥳 😏 😌 😴 🤔 🤗 🤭 🙃 😢 😭 😤 😡 🤯 😱 🥺 😬 🤓 🫠 🫡 🫶"],
	["glyphCat.people", "👍 👎 👏 🙌 🤝 👋 ✌ 🤘 🤞 💪 🙏 👀 🧠 👶 🧒 🧑 🧓 👥 👤 🗣 🏃 🚶 🧍 💃 🕺 🧑‍🤝‍🧑"],
	["glyphCat.nature", "🌞 🌝 🌙 ⭐ 🌟 ✨ ☁ 🌈 🔥 💧 🌊 ❄ ⛄ 🌸 🌼 🌻 🌹 🌷 🌱 🌲 🌳 🍀 🍁 🍂 🐝 🦋 🐶 🐱 🐦 🦉 🐟 🐢 🌍 🏔 🏕"],
	["glyphCat.food", "☕ 🍵 🥤 🍺 🍷 🥂 🍰 🎂 🧁 🍪 🍩 🍕 🌮 🍔 🍟 🥗 🍎 🍊 🍋 🍇 🍓 🫐 🥕 🌽 🍞 🥐 🧀 🍿 🍦 🍫"],
	["glyphCat.activity", "⚽ 🏀 🏐 🎾 🏓 🏸 ⛷ 🏂 🚴 🏊 🎮 🎲 ♟ 🎯 🎳 🎣 🥾 ⛺ 🎪 🎭 🎨 🎬 🎤 🎧 🎸 🎹 🥁 🎻 📚 ✈ 🚗 🚲 ⛵ 🚀 🏋 🧘"],
	["glyphCat.objects", "💡 🔔 📣 📢 📌 📍 📅 ⏰ 🔑 🔒 🔓 🛠 🔧 🔨 🧰 📦 📫 📧 📱 💻 🖥 🖨 📷 📸 🎥 📺 🔍 🔎 📎 📏 📐 📝 📄 📋 📁 💾 🧾 💰 💳 🪙 🎁 🎈 🎉 🎊 🏆 🥇 🥈 🥉 🏅 🚩 🏁 🔗 🧭 🗺 🧲 🧪 🔬 🔭 💊 🩺 🛡 🕯 🪧 🖼"],
	["glyphCat.hearts", "❤ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💗 💓 💕 💖 💘 💝 💞 💟"]
];
function Ma(e, t) {
	return [t, ...(Array.isArray(e) ? e : []).filter((e) => e !== t)].slice(0, 16);
}
var Na = (e) => {
	try {
		let t = JSON.parse(localStorage.getItem(e) ?? "[]");
		return Array.isArray(t) ? t : [];
	} catch {
		return [];
	}
}, Pa = (e, t, n) => {
	let r = Ma(t, n);
	try {
		localStorage.setItem(e, JSON.stringify(r));
	} catch {}
	return r;
};
function Fa() {
	return Na(ka);
}
function Ia(e) {
	return Pa(ka, Fa(), e);
}
function La() {
	return Na(Aa);
}
function Ra(e) {
	return Pa(Aa, La(), e);
}
//#endregion
//#region ../template/assets/engine/0.7.4/icons.js
var za = "fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"", Ba = "fill=\"currentColor\" stroke=\"none\"", Va = {
	facebook: {
		label: "Facebook",
		labelKey: "icon.facebook",
		body: "<path d=\"M15.5 4H13a3.5 3.5 0 0 0-3.5 3.5V10H7v3.2h2.5V20h3.2v-6.8h2.5l.55-3.2h-3.05V7.8c0-.5.4-.8.9-.8h1.9z\"/>"
	},
	instagram: {
		label: "Instagram",
		labelKey: "icon.instagram",
		body: "<rect x=\"3.5\" y=\"3.5\" width=\"17\" height=\"17\" rx=\"4.5\"/><circle cx=\"12\" cy=\"12\" r=\"3.8\"/><circle cx=\"16.9\" cy=\"7.1\" r=\"1.1\" fill=\"currentColor\" stroke=\"none\"/>"
	},
	x: {
		label: "X (Twitter)",
		labelKey: "icon.x",
		body: "<path d=\"M5 4h3.8l4 5.4L17.4 4h2.4l-5.9 6.9L20.5 20h-3.8l-4.3-5.8L7.4 20H5l6.3-7.4z\"/>",
		fill: !0
	},
	linkedin: {
		label: "LinkedIn",
		labelKey: "icon.linkedin",
		body: "<circle cx=\"4.8\" cy=\"4.8\" r=\"1.7\"/><path d=\"M3.3 9.2h3v11h-3z\"/><path d=\"M9.7 20.2v-11h3v1.6a3.9 3.9 0 0 1 3.3-1.8c2.6 0 4.4 1.8 4.4 4.9v6.3h-3.1v-5.7c0-1.6-.7-2.6-2-2.6-1.4 0-2.5 1-2.5 2.7v5.6z\"/>"
	},
	youtube: {
		label: "YouTube",
		labelKey: "icon.youtube",
		body: "<rect x=\"2.8\" y=\"5.7\" width=\"18.4\" height=\"12.6\" rx=\"3.6\"/><path d=\"M10.2 9.3l5 2.7-5 2.7z\" fill=\"currentColor\" stroke=\"none\"/>"
	},
	tiktok: {
		label: "TikTok",
		labelKey: "icon.tiktok",
		body: "<path d=\"M13.8 5v9.3a3.9 3.9 0 1 1-3.9-3.9\"/><path d=\"M13.8 5c.5 2.9 2.6 4.8 5.6 5v3.1c-2.1-.1-4-.8-5.6-2\"/>"
	},
	whatsapp: {
		label: "WhatsApp",
		labelKey: "icon.whatsapp",
		body: "<path d=\"M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5z\"/><path d=\"M9.2 8.4l1 2-.8 1a7.3 7.3 0 0 0 3.2 3.2l1-.8 2 1c-.3 1.3-1.2 1.9-2.4 1.7-2.9-.5-5.2-2.8-5.7-5.7-.2-1.2.4-2.1 1.7-2.4z\"/>"
	},
	snapchat: {
		label: "Snapchat",
		labelKey: "icon.snapchat",
		body: "<path d=\"M12 3.2c-2.9 0-4.9 2.1-4.9 5v2.1c-.8.3-1.7.3-2.5.1.3 1 1.1 1.8 2.2 2-.4 1.4-1.5 2.5-3 2.8 1 1.2 2.6 1.9 4.3 1.8.9 1.2 2.3 1.9 3.9 1.9s3-.7 3.9-1.9c1.7.1 3.3-.6 4.3-1.8-1.5-.3-2.6-1.4-3-2.8 1.1-.2 1.9-1 2.2-2-.8.2-1.7.2-2.5-.1V8.2c0-2.9-2-5-4.9-5z\"/>"
	},
	pinterest: {
		label: "Pinterest",
		labelKey: "icon.pinterest",
		body: "<path d=\"M9.2 20.5c.4-1.6 1.4-5.6 1.9-7.6\"/><path d=\"M10.4 14.2c.4.9 1.4 1.5 2.6 1.5 2.6 0 4.4-2.2 4.4-5a5.4 5.4 0 1 0-10.4 2.1\"/>"
	},
	spotify: {
		label: "Spotify",
		labelKey: "icon.spotify",
		body: "<circle cx=\"12\" cy=\"12\" r=\"8.8\"/><path d=\"M7.6 9.6c3-.9 6.6-.6 9.1.9\"/><path d=\"M8 12.5c2.5-.7 5.4-.4 7.5.8\"/><path d=\"M8.5 15.2c2-.5 4.2-.3 5.9.7\"/>"
	},
	discord: {
		label: "Discord",
		labelKey: "icon.discord",
		body: "<path d=\"M8 3.9c-1.6.3-3.1.9-4.5 1.7-1.5 3.2-2.1 6.6-1.7 10a12.7 12.7 0 0 0 5 2.6l1-1.9a11 11 0 0 0 8.4 0l1 1.9a12.7 12.7 0 0 0 5-2.6c.4-3.4-.2-6.8-1.7-10A14 14 0 0 0 16 3.9l-.6 1.4a15 15 0 0 0-6.8 0z\"/><circle cx=\"9.3\" cy=\"11.5\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"14.7\" cy=\"11.5\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/>"
	},
	github: {
		label: "GitHub",
		labelKey: "icon.github",
		body: "<path d=\"M12 2.8a9.2 9.2 0 0 0-2.9 17.9c.5.1.6-.2.6-.4v-1.7c-2.6.6-3.1-1.1-3.1-1.1-.4-1.1-1-1.4-1-1.4-.9-.6 0-.6 0-.6.9.1 1.4 1 1.4 1 .8 1.4 2.2 1 2.7.8.1-.6.3-1 .6-1.3-2-.2-4.2-1-4.2-4.5 0-1 .4-1.8 1-2.5-.1-.2-.4-1.2.1-2.4 0 0 .8-.3 2.5.9a8.8 8.8 0 0 1 4.6 0c1.7-1.2 2.5-.9 2.5-.9.5 1.2.2 2.2.1 2.4.6.7 1 1.5 1 2.5 0 3.5-2.2 4.3-4.2 4.5.3.3.6.9.6 1.8v2.6c0 .2.1.5.6.4A9.2 9.2 0 0 0 12 2.8z\"/>",
		fill: !0
	},
	mail: {
		label: "Email",
		labelKey: "icon.mail",
		body: "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2.5\"/><path d=\"M3.5 7l8.5 6 8.5-6\"/>"
	},
	phone: {
		label: "Phone",
		labelKey: "icon.phone",
		body: "<path d=\"M21.2 16.9v2.6a1.8 1.8 0 0 1-2 1.8 18 18 0 0 1-7.8-2.8 17.7 17.7 0 0 1-5.4-5.4A18 18 0 0 1 3.2 5.2a1.8 1.8 0 0 1 1.8-2h2.6a1.8 1.8 0 0 1 1.8 1.5c.1.9.3 1.7.6 2.5a1.8 1.8 0 0 1-.4 1.9l-1.1 1.1a14.4 14.4 0 0 0 5.4 5.4l1.1-1.1a1.8 1.8 0 0 1 1.9-.4c.8.3 1.6.5 2.5.6a1.8 1.8 0 0 1 1.5 1.8z\"/>"
	},
	smartphone: {
		label: "Mobile",
		labelKey: "icon.smartphone",
		body: "<rect x=\"7\" y=\"2.8\" width=\"10\" height=\"18.4\" rx=\"2.5\"/><line x1=\"10.8\" y1=\"18.2\" x2=\"13.2\" y2=\"18.2\"/>"
	},
	chat: {
		label: "Speech bubble",
		labelKey: "icon.chat",
		body: "<path d=\"M20.8 12a8.5 8.5 0 0 1-12.4 7.5L4 20.6l1.1-4.2A8.5 8.5 0 1 1 20.8 12z\"/>"
	},
	send: {
		label: "Send",
		labelKey: "icon.send",
		body: "<path d=\"M21 3.5L10.4 14.1\"/><path d=\"M21 3.5l-6.8 17-3.8-6.4L4 10.3z\"/>"
	},
	globe: {
		label: "Website",
		labelKey: "icon.globe",
		body: "<circle cx=\"12\" cy=\"12\" r=\"8.8\"/><path d=\"M3.2 12h17.6\"/><path d=\"M12 3.2c2.4 2.4 3.6 5.4 3.6 8.8s-1.2 6.4-3.6 8.8c-2.4-2.4-3.6-5.4-3.6-8.8S9.6 5.6 12 3.2z\"/>"
	},
	rss: {
		label: "RSS feed",
		labelKey: "icon.rss",
		body: "<path d=\"M4.5 11a8.5 8.5 0 0 1 8.5 8.5\"/><path d=\"M4.5 5.5a14 14 0 0 1 14 14\"/><circle cx=\"5.5\" cy=\"18.5\" r=\"1.3\" fill=\"currentColor\" stroke=\"none\"/>"
	},
	"map-pin": {
		label: "Map pin",
		labelKey: "icon.map-pin",
		body: "<path d=\"M12 21.5s7-6.2 7-11.3A7 7 0 1 0 5 10.2c0 5.1 7 11.3 7 11.3z\"/><circle cx=\"12\" cy=\"10\" r=\"2.6\"/>"
	},
	map: {
		label: "Map",
		labelKey: "icon.map",
		body: "<path d=\"M9 4L3.5 6v14L9 18l6 2 5.5-2V4L15 6z\"/><path d=\"M9 4v14\"/><path d=\"M15 6v14\"/>"
	},
	home: {
		label: "Home",
		labelKey: "icon.home",
		body: "<path d=\"M4 10.5l8-7 8 7V20a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 20z\"/><path d=\"M9.5 21.5V14h5v7.5\"/>"
	},
	clock: {
		label: "Clock",
		labelKey: "icon.clock",
		body: "<circle cx=\"12\" cy=\"12\" r=\"8.8\"/><path d=\"M12 7v5l3.2 2\"/>"
	},
	calendar: {
		label: "Calendar",
		labelKey: "icon.calendar",
		body: "<rect x=\"3.5\" y=\"5\" width=\"17\" height=\"16\" rx=\"2.5\"/><path d=\"M3.5 10h17\"/><path d=\"M8 2.8V7\"/><path d=\"M16 2.8V7\"/>"
	},
	heart: {
		label: "Heart",
		labelKey: "icon.heart",
		body: "<path d=\"M12 20.5S3.5 15.4 3.5 9.5A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8.5 2.5c0 5.9-8.5 11-8.5 11z\"/>"
	},
	star: {
		label: "Star",
		labelKey: "icon.star",
		body: "<path d=\"M12 3.5l2.7 5.4 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L3.3 9.8l6-.9z\"/>"
	},
	check: {
		label: "Check",
		labelKey: "icon.check",
		body: "<path d=\"M4.5 12.8L9.5 18 19.5 6.5\"/>"
	},
	cross: {
		label: "Cross",
		labelKey: "icon.cross",
		body: "<path d=\"M6 6l12 12\"/><path d=\"M18 6L6 18\"/>"
	},
	plus: {
		label: "Plus",
		labelKey: "icon.plus",
		body: "<path d=\"M12 5v14\"/><path d=\"M5 12h14\"/>"
	},
	info: {
		label: "Info",
		labelKey: "icon.info",
		body: "<circle cx=\"12\" cy=\"12\" r=\"8.8\"/><path d=\"M12 11v5.5\"/><line x1=\"12\" y1=\"7.8\" x2=\"12\" y2=\"7.8\"/>"
	},
	question: {
		label: "Question",
		labelKey: "icon.question",
		body: "<circle cx=\"12\" cy=\"12\" r=\"8.8\"/><path d=\"M9.4 9.2A2.7 2.7 0 0 1 12 7.4c1.5 0 2.7 1 2.7 2.4 0 1.8-2.7 2-2.7 4\"/><line x1=\"12\" y1=\"16.8\" x2=\"12\" y2=\"16.8\"/>"
	},
	warning: {
		label: "Warning",
		labelKey: "icon.warning",
		body: "<path d=\"M12 4L2.8 19.5h18.4z\"/><path d=\"M12 10v4\"/><line x1=\"12\" y1=\"16.8\" x2=\"12\" y2=\"16.8\"/>"
	},
	zap: {
		label: "Lightning",
		labelKey: "icon.zap",
		body: "<path d=\"M13 2.8L4.5 13.5H11l-1 7.7 8.5-10.7H12z\"/>"
	},
	sun: {
		label: "Sun",
		labelKey: "icon.sun",
		body: "<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7\"/>"
	},
	moon: {
		label: "Moon",
		labelKey: "icon.moon",
		body: "<path d=\"M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z\"/>"
	},
	leaf: {
		label: "Leaf",
		labelKey: "icon.leaf",
		body: "<path d=\"M5 19C5 9 11 4.5 20 4.5c0 9-4.5 15-13 14.5z\"/><path d=\"M5 19c2-5.5 5.5-9 10-11\"/>"
	},
	music: {
		label: "Music",
		labelKey: "icon.music",
		body: "<circle cx=\"7\" cy=\"17.5\" r=\"2.8\"/><circle cx=\"17\" cy=\"15.5\" r=\"2.8\"/><path d=\"M9.8 17.5V6.5l10-2v11\"/>"
	},
	camera: {
		label: "Camera",
		labelKey: "icon.camera",
		body: "<path d=\"M3.5 8.5A1.5 1.5 0 0 1 5 7h2.5l1.7-2.3h5.6L16.5 7H19a1.5 1.5 0 0 1 1.5 1.5V18a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 18z\"/><circle cx=\"12\" cy=\"13\" r=\"3.4\"/>"
	},
	image: {
		label: "Image",
		labelKey: "icon.image",
		body: "<rect x=\"3.5\" y=\"4.5\" width=\"17\" height=\"15\" rx=\"2.5\"/><circle cx=\"8.8\" cy=\"9.3\" r=\"1.6\"/><path d=\"M20.5 15.5l-4.7-4.7-9.3 8.7\"/>"
	},
	document: {
		label: "Document",
		labelKey: "icon.document",
		body: "<path d=\"M13.5 3H6.8A1.8 1.8 0 0 0 5 4.8v14.4A1.8 1.8 0 0 0 6.8 21h10.4a1.8 1.8 0 0 0 1.8-1.8V8.5z\"/><path d=\"M13.5 3v5.5H19\"/><path d=\"M8.5 13h7M8.5 16.5h7\"/>"
	},
	"shopping-bag": {
		label: "Shopping bag",
		labelKey: "icon.shopping-bag",
		body: "<path d=\"M5.5 8h13l-1 12a1.8 1.8 0 0 1-1.8 1.5H8.3A1.8 1.8 0 0 1 6.5 20z\"/><path d=\"M8.8 10.5V7a3.2 3.2 0 0 1 6.4 0v3.5\"/>"
	},
	cart: {
		label: "Cart",
		labelKey: "icon.cart",
		body: "<circle cx=\"9.3\" cy=\"19.3\" r=\"1.5\"/><circle cx=\"17.3\" cy=\"19.3\" r=\"1.5\"/><path d=\"M3 4.5h2.4l2.3 10.6a1.8 1.8 0 0 0 1.8 1.4h7.6a1.8 1.8 0 0 0 1.8-1.4L20.8 8H6.1\"/>"
	},
	gift: {
		label: "Gift",
		labelKey: "icon.gift",
		body: "<rect x=\"3.5\" y=\"8\" width=\"17\" height=\"4\"/><path d=\"M5 12v8.5h14V12\"/><path d=\"M12 8v12.5\"/><path d=\"M12 8s-4.5.3-5.5-1.8C5.8 4.7 7.8 3.3 9.3 4.4 10.8 5.5 12 8 12 8z\"/><path d=\"M12 8s4.5.3 5.5-1.8c.7-1.5-1.3-2.9-2.8-1.8C13.2 5.5 12 8 12 8z\"/>"
	},
	wrench: {
		label: "Wrench",
		labelKey: "icon.wrench",
		body: "<path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z\"/>"
	},
	lock: {
		label: "Lock",
		labelKey: "icon.lock",
		body: "<rect x=\"5\" y=\"10.5\" width=\"14\" height=\"10\" rx=\"2\"/><path d=\"M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3\"/>"
	},
	search: {
		label: "Search",
		labelKey: "icon.search",
		body: "<circle cx=\"10.8\" cy=\"10.8\" r=\"6.8\"/><path d=\"M15.8 15.8L21 21\"/>"
	},
	user: {
		label: "Person",
		labelKey: "icon.user",
		body: "<circle cx=\"12\" cy=\"8\" r=\"4\"/><path d=\"M4.5 20.5a7.5 7.5 0 0 1 15 0\"/>"
	},
	users: {
		label: "People",
		labelKey: "icon.users",
		body: "<circle cx=\"9\" cy=\"8.5\" r=\"3.5\"/><path d=\"M2.8 20a6.2 6.2 0 0 1 12.4 0\"/><path d=\"M16 5.4a3.5 3.5 0 0 1 0 6.2\"/><path d=\"M17.8 14.6a6.2 6.2 0 0 1 3.4 5.4\"/>"
	},
	"thumbs-up": {
		label: "Thumbs up",
		labelKey: "icon.thumbs-up",
		body: "<path d=\"M3.5 10.5H7v10H3.5z\"/><path d=\"M7 19.5V11l4.2-5.6a1.7 1.7 0 0 1 3 1.4l-.9 3.7h4.8a2 2 0 0 1 2 2.4l-1.2 5.5a2 2 0 0 1-2 1.6H8.6\"/>"
	},
	"arrow-right": {
		label: "Arrow right",
		labelKey: "icon.arrow-right",
		body: "<path d=\"M4 12h16\"/><path d=\"M13.5 5.5L20 12l-6.5 6.5\"/>"
	},
	"arrow-left": {
		label: "Arrow left",
		labelKey: "icon.arrow-left",
		body: "<path d=\"M20 12H4\"/><path d=\"M10.5 5.5L4 12l6.5 6.5\"/>"
	},
	"arrow-up": {
		label: "Arrow up",
		labelKey: "icon.arrow-up",
		body: "<path d=\"M12 20V4\"/><path d=\"M5.5 10.5L12 4l6.5 6.5\"/>"
	},
	"arrow-down": {
		label: "Arrow down",
		labelKey: "icon.arrow-down",
		body: "<path d=\"M12 4v16\"/><path d=\"M5.5 13.5L12 20l6.5-6.5\"/>"
	},
	"external-link": {
		label: "External link",
		labelKey: "icon.external-link",
		body: "<path d=\"M9.5 5H5.8A1.8 1.8 0 0 0 4 6.8v11.4A1.8 1.8 0 0 0 5.8 20h11.4a1.8 1.8 0 0 0 1.8-1.8v-3.7\"/><path d=\"M13.5 4H20v6.5\"/><path d=\"M20 4l-9 9\"/>"
	},
	download: {
		label: "Download",
		labelKey: "icon.download",
		body: "<path d=\"M12 3.5v11\"/><path d=\"M6.5 9l5.5 5.5L17.5 9\"/><path d=\"M4 20.5h16\"/>"
	},
	share: {
		label: "Share",
		labelKey: "icon.share",
		body: "<circle cx=\"6\" cy=\"12\" r=\"2.6\"/><circle cx=\"17.5\" cy=\"5.5\" r=\"2.6\"/><circle cx=\"17.5\" cy=\"18.5\" r=\"2.6\"/><path d=\"M8.4 10.8l6.8-4M8.4 13.2l6.8 4\"/>"
	}
}, Ha = [
	["iconCat.social", [
		"facebook",
		"instagram",
		"x",
		"linkedin",
		"youtube",
		"tiktok",
		"whatsapp",
		"snapchat",
		"pinterest",
		"spotify",
		"discord",
		"github"
	]],
	["iconCat.communication", [
		"mail",
		"phone",
		"smartphone",
		"chat",
		"send",
		"globe",
		"rss"
	]],
	["iconCat.placeTime", [
		"map-pin",
		"map",
		"home",
		"clock",
		"calendar"
	]],
	["iconCat.symbols", [
		"heart",
		"star",
		"check",
		"cross",
		"plus",
		"info",
		"question",
		"warning",
		"zap",
		"sun",
		"moon",
		"leaf",
		"music",
		"camera",
		"image",
		"document",
		"shopping-bag",
		"cart",
		"gift",
		"wrench",
		"lock",
		"search",
		"user",
		"users",
		"thumbs-up"
	]],
	["iconCat.arrows", [
		"arrow-right",
		"arrow-left",
		"arrow-up",
		"arrow-down",
		"external-link",
		"download",
		"share"
	]]
];
function Ua(e) {
	let t = typeof e == "string" ? Va[e] : null;
	return t ? `<svg viewBox="0 0 24 24" width="100%" height="100%" ${t.fill ? Ba : za} aria-hidden="true" focusable="false">${t.body}</svg>` : null;
}
//#endregion
//#region src/lib/GlyphPicker.svelte
var Wa = /* @__PURE__ */ H("<button type=\"button\"><span class=\"gp-svg svelte-15ln1c3\"></span></button>"), Ga = /* @__PURE__ */ H("<button type=\"button\" class=\"gp-cell svelte-15ln1c3\"> </button>"), Ka = /* @__PURE__ */ H("<div class=\"gp-group svelte-15ln1c3\"> </div> <div class=\"gp-grid svelte-15ln1c3\"><!> <!></div>", 1), qa = /* @__PURE__ */ H("<div class=\"gp-group svelte-15ln1c3\"> </div> <div class=\"gp-grid svelte-15ln1c3\"></div>", 1), Ja = /* @__PURE__ */ H("<button type=\"button\"> </button>"), Ya = /* @__PURE__ */ H("<div class=\"gp-group svelte-15ln1c3\"> </div> <button type=\"button\" class=\"ghost gp-upload svelte-15ln1c3\"> </button> <input type=\"file\" accept=\"image/*\" hidden=\"\"/> <p class=\"gp-hint svelte-15ln1c3\"> </p>", 1), Xa = /* @__PURE__ */ H("<!> <!> <!> <!>", 1), Za = /* @__PURE__ */ H("<img class=\"gp-own svelte-15ln1c3\"/>"), Qa = /* @__PURE__ */ H("<span class=\"gp-svg svelte-15ln1c3\"></span>"), $a = /* @__PURE__ */ H("<div class=\"gp-pop gp-anchored svelte-15ln1c3\" popover=\"auto\"><!></div>"), eo = /* @__PURE__ */ H("<div class=\"gp-pop svelte-15ln1c3\"><!></div>"), to = /* @__PURE__ */ H("<span class=\"gp svelte-15ln1c3\"><button type=\"button\" class=\"gp-swatch svelte-15ln1c3\"><!></button> <!></span>");
function no(e, t) {
	Je(t, !0);
	let n = (e) => {
		var n = Xa(), a = I(n), o = (e) => {
			var t = Ka(), n = I(t), r = L(n, !0), a = R(n, 2), o = F(a);
			Yr(o, 16, () => B(d), (e) => e, (e, t) => {
				var n = Wa();
				let r;
				var a = F(n);
				K(a, () => Ua(t), !0), D(a), D(n), z((e) => {
					r = q(n, 1, "gp-cell gp-cell-icon svelte-15ln1c3", null, r, { active: t === i() }), X(n, "title", e);
				}, [() => Z(Va[t].labelKey)]), V("click", n, () => C(t)), U(e, n);
			}), Yr(R(o, 2), 16, () => B(u), (e) => e, (e, t) => {
				var n = Ga(), r = L(n, !0);
				z(() => W(r, t)), V("click", n, () => S(t)), U(e, n);
			}), D(a), z((e) => W(r, e), [() => Z("common.recent")]), U(e, t);
		};
		G(a, (e) => {
			(B(u).length || B(d).length) && e(o);
		});
		var s = R(a, 2), c = (e) => {
			var t = Pr();
			Yr(I(t), 17, () => Ha, ([e, t]) => e, (e, t) => {
				var n = /* @__PURE__ */ A(() => h(B(t), 2));
				let r = () => B(n)[0], a = () => B(n)[1];
				var o = qa(), s = I(o), c = L(s, !0), l = R(s, 2);
				Yr(l, 20, a, (e) => e, (e, t) => {
					var n = Wa();
					let r;
					var a = F(n);
					K(a, () => Ua(t), !0), D(a), D(n), z((e) => {
						r = q(n, 1, "gp-cell gp-cell-icon svelte-15ln1c3", null, r, { active: t === i() }), X(n, "title", e);
					}, [() => Z(Va[t].labelKey)]), V("click", n, () => C(t)), U(e, n);
				}), D(l), z((e) => W(c, e), [() => Z(r())]), U(e, o);
			}), U(e, t);
		};
		G(s, (e) => {
			t.onicon && e(c);
		});
		var l = R(s, 2);
		Yr(l, 17, () => ja, ([e, t]) => e, (e, t) => {
			var n = /* @__PURE__ */ A(() => h(B(t), 2));
			let i = () => B(n)[0], a = () => B(n)[1];
			var o = qa(), s = I(o), c = L(s, !0), l = R(s, 2);
			Yr(l, 20, () => a().split(" "), (e) => e, (e, t) => {
				var n = Ja();
				let i;
				var a = L(n, !0);
				z(() => {
					i = q(n, 1, "gp-cell svelte-15ln1c3", null, i, { active: t === r() }), W(a, t);
				}), V("click", n, () => S(t)), U(e, n);
			}), D(l), z((e) => W(c, e), [() => Z(i())]), U(e, o);
		});
		var f = R(l, 2), p = (e) => {
			var t = Ya(), n = I(t), r = L(n, !0), i = R(n, 2), a = L(i, !0), o = R(i, 2);
			Ai(o, (e) => P(m, e), () => B(m));
			var s = L(R(o, 2), !0);
			z((e, t, n) => {
				W(r, e), W(a, t), W(s, n);
			}, [
				() => Z("gp.ownIcon"),
				() => Z("gp.upload"),
				() => Z("gp.uploadHint")
			]), V("click", i, () => B(m).click()), V("change", o, w), U(e, t);
		};
		G(f, (e) => {
			t.onimage && e(p);
		}), U(e, n);
	}, r = ji(t, "value", 3, "★"), i = ji(t, "icon", 3, null), a = ji(t, "image", 3, null), o = ji(t, "label", 19, () => Z("gp.pickGlyph")), s = Qi(), c = ea("urd-gp"), l = c.slice(2), u = /* @__PURE__ */ N(en([])), d = /* @__PURE__ */ N(en([])), f = /* @__PURE__ */ N(null), p = /* @__PURE__ */ N(null), m = /* @__PURE__ */ N(null), g = /* @__PURE__ */ N(!1), _ = /* @__PURE__ */ N(en({
		top: 0,
		left: 0
	}));
	function v() {
		P(u, Fa(), !0), P(d, t.onicon ? La().filter((e) => Va[e]) : [], !0);
	}
	function y(e) {
		P(g, e.newState === "open"), ta(B(f), B(g)), B(g) && v();
	}
	function b() {
		s && B(p)?.hidePopover(), P(g, !1);
	}
	function x() {
		v();
		let e = B(f).getBoundingClientRect(), t = Math.max(8, Math.min(e.right - 292, window.innerWidth - 292 - 8)), n = e.bottom + 380 + 8 > window.innerHeight ? Math.max(8, e.top - 380 - 8) : e.bottom + 6;
		P(_, {
			top: n,
			left: t
		}, !0), P(g, !0);
	}
	function S(e) {
		Ia(e), t.onpick?.(e), b();
	}
	function C(e) {
		Ra(e), t.onicon?.(e), b();
	}
	async function w(e) {
		let n = e.target.files?.[0];
		if (e.target.value = "", !n) return;
		let r = await ba(n, 256);
		t.onimage?.(r.dataUrl), b();
	}
	xn(() => {
		if (!B(g)) return;
		let e = () => b();
		if (window.addEventListener("blur", e), s) return () => window.removeEventListener("blur", e);
		let t = (e) => {
			B(f) && !B(f).contains(e.target) && P(g, !1);
		}, n = (e) => {
			e.key === "Escape" && P(g, !1);
		}, r = (e) => {
			B(f) && e.target instanceof Node && !B(f).contains(e.target) && P(g, !1);
		};
		return document.addEventListener("pointerdown", t, !0), document.addEventListener("keydown", n, !0), document.addEventListener("scroll", r, !0), () => {
			window.removeEventListener("blur", e), document.removeEventListener("pointerdown", t, !0), document.removeEventListener("keydown", n, !0), document.removeEventListener("scroll", r, !0);
		};
	});
	var T = to(), ee = F(T), te = F(ee), ne = (e) => {
		var t = Za();
		z((e) => {
			X(t, "src", a()), X(t, "alt", e);
		}, [() => Z("gp.ownIcon")]), U(e, t);
	}, E = (e) => {
		var t = Qa();
		K(t, () => Ua(i()), !0), D(t), U(e, t);
	}, re = (e) => {
		var t = Nr();
		z(() => W(t, r() || "★")), U(e, t);
	};
	G(te, (e) => {
		a() ? e(ne) : i() && Va[i()] ? e(E, 1) : e(re, -1);
	}), D(ee);
	var ie = R(ee, 2), ae = (e) => {
		var t = $a(), r = F(t), i = (e) => {
			n(e);
		};
		G(r, (e) => {
			B(g) && e(i);
		}), D(t), Ai(t, (e) => P(p, e), () => B(p)), z(() => {
			X(t, "id", l), _i(t, `position-anchor: ${c ?? ""}`);
		}), wr("toggle", t, y), U(e, t);
	}, oe = (e) => {
		var t = eo(), r = F(t);
		n(r), D(t), z(() => _i(t, `top: ${B(_).top ?? ""}px; left: ${B(_).left ?? ""}px`)), U(e, t);
	};
	G(ie, (e) => {
		s ? e(ae) : B(g) && e(oe, 1);
	}), D(T), Ai(T, (e) => P(f, e), () => B(f)), z(() => {
		X(ee, "title", o()), X(ee, "aria-label", o()), X(ee, "popovertarget", s ? l : void 0), _i(ee, s ? `anchor-name: ${c}` : void 0);
	}), V("click", ee, function(...e) {
		(s ? void 0 : () => B(g) ? P(g, !1) : x())?.apply(this, e);
	}), U(e, T), Ye();
}
Tr(["click", "change"]);
//#endregion
//#region src/lib/previewBridge.js
function ro(e, t = {}) {
	let n = (e) => {
		if (e.origin !== location.origin) return;
		let n = e.data;
		n?.type === "urd-edit" && t.onEdit?.(n), n?.type === "urd-move" && t.onMove?.(n), n?.type === "urd-grow" && t.onGrow?.(n), n?.type === "urd-delete" && t.onDelete?.(n), n?.type === "urd-add-section" && t.onAddSection?.(n), n?.type === "urd-move-section" && t.onMoveSection?.(n), n?.type === "urd-delete-section" && t.onDeleteSection?.(n), n?.type === "urd-section-size" && t.onSectionSize?.(n), n?.type === "urd-undo" && t.onUndo?.(n), n?.type === "urd-select-section" && t.onSelectSection?.(n), n?.type === "urd-select-block" && t.onSelectBlock?.(n), n?.type === "urd-block-menu" && t.onBlockMenu?.(n), n?.type === "urd-plugin-blocks" && t.onPluginBlocks?.(n), n?.type === "urd-ready" && t.onReady?.(n), n?.type === "urd-navigate" && t.onNavigate?.(n), n?.type === "urd-add-block" && t.onAddBlock?.(n), n?.type === "urd-add-blocks" && t.onAddBlocks?.(n), n?.type === "urd-request-block" && t.onRequestBlock?.(n), n?.type === "urd-move-block-section" && t.onMoveBlockSection?.(n), n?.type === "urd-mobile-reset" && t.onMobileReset?.(n), n?.type === "urd-mobile-order" && t.onMobileOrder?.(n), n?.type === "urd-review-done" && t.onReviewDone?.(n), n?.type === "urd-block-flag" && t.onBlockFlag?.(n), n?.type === "urd-collection-edit" && t.onCollectionEdit?.(n), n?.type === "urd-collection-add" && t.onCollectionAdd?.(n), n?.type === "urd-nav-width" && t.onNavWidth?.(n), n?.type === "urd-save-template" && t.onSaveTemplate?.(n), n?.type === "urd-sticky-group" && t.onStickyGroup?.(n), n?.type === "urd-sticky-dock" && t.onStickyDock?.(n), n?.type === "urd-delete-template" && t.onDeleteTemplate?.(n), n?.type === "urd-apply-layout" && t.onApplyLayout?.(n);
	};
	window.addEventListener("message", n);
	let r = (t) => e.contentWindow?.postMessage(t, location.origin);
	return {
		sendSection(e, t) {
			r({
				type: "urd-preview",
				pageId: e,
				section: t
			});
		},
		sendPage(e, t) {
			r({
				type: "urd-preview-full",
				pageId: e,
				page: t
			});
		},
		sendSite(e) {
			r({
				type: "urd-site",
				site: e
			});
		},
		sendChrome(e) {
			r({
				type: "urd-chrome",
				visible: e
			});
		},
		sendPlugins(e) {
			r({
				type: "urd-plugins",
				enabled: e
			});
		},
		sendCollections(e) {
			r({
				type: "urd-collections",
				collections: e
			});
		},
		sendTemplates(e) {
			r({
				type: "urd-templates",
				templates: e
			});
		},
		sendInsertTemplate(e) {
			r({
				type: "urd-insert-template",
				id: e
			});
		},
		sendViewport(e) {
			r({
				type: "urd-viewport",
				mode: e
			});
		},
		sendZoom(e) {
			r({
				type: "urd-zoom",
				scale: e
			});
		},
		sendCloseMenus() {
			r({ type: "urd-close-menus" });
		},
		sendDuplicate() {
			r({ type: "urd-duplicate" });
		},
		sendShowGrid(e) {
			r({
				type: "urd-show-grid",
				visible: e
			});
		},
		sendShowGuides(e) {
			r({
				type: "urd-show-guides",
				visible: e
			});
		},
		sendAdminTheme(e) {
			r({
				type: "urd-admin-theme",
				colors: e
			});
		},
		sendSelect(e) {
			r({
				type: "urd-select",
				blockId: e
			});
		},
		sendPlaceBlock(e) {
			r({
				type: "urd-place-block",
				block: e
			});
		},
		sendAttention(e, t) {
			r({
				type: "urd-attention",
				sectionId: e,
				needed: t
			});
		},
		sendScrollSection(e) {
			r({
				type: "urd-scroll-section",
				sectionId: e
			});
		},
		sendDemoAnim(e, t = null) {
			r({
				type: "urd-demo-anim",
				sectionId: e,
				blockId: t
			});
		},
		sendOpenConfig(e) {
			r({
				type: "urd-open-block-config",
				blockId: e
			});
		},
		destroy() {
			window.removeEventListener("message", n);
		}
	};
}
//#endregion
//#region src/lib/preview-scale.js
function io(e, t) {
	return !(e > 0) || !(t > 0) ? 1 : e / t;
}
function ao(e, t, n, r = 0, i = 0) {
	if (n === "full") return 1;
	let a = i > 0 ? io(r, i) : Infinity;
	return Math.max(.1, Math.min(1, io(e, t), a));
}
//#endregion
//#region src/lib/deploy-wait.js
function oo(e, { max: t = 8 } = {}) {
	let n = (e ?? []).filter((e) => e && typeof e.path == "string" && typeof e.content == "string" && e.encoding === "utf-8" && !e.delete && (e.path.startsWith("content/") || e.path === "plugins/plugins.json"));
	return n.sort((e, t) => (e.path === "content/site.json" ? -1 : 0) - (t.path === "content/site.json" ? -1 : 0)), n.slice(0, t).map(({ path: e, content: t }) => ({
		path: e,
		content: t
	}));
}
async function so(e, { fetchFn: t = fetch, delayMs: n = 1e4, attempts: r = 18, sleep: i = (e) => new Promise((t) => setTimeout(t, e)) } = {}) {
	let a = [...e];
	if (a.length === 0) return !0;
	for (let e = 0; e < r; e++) {
		await i(n);
		let e = await Promise.all(a.map(async ({ path: e }) => {
			try {
				let n = await t(`/${e}`, { cache: "no-store" });
				return n.ok ? await n.text() : null;
			} catch {
				return null;
			}
		}));
		if (a = a.filter((t, n) => e[n] !== t.content), a.length === 0) return !0;
	}
	return !1;
}
var co = 3840, lo = 2400, uo = (e, t, n) => Math.min(n, Math.max(t, e));
function fo({ innerWidth: e = 0, screenWidth: t = 0 } = {}) {
	let n = e > 0 ? e : t;
	return Math.max(1, Math.round(n > 0 ? n : 1));
}
function po(e) {
	return !e || typeof e.innerWidth != "number" ? null : fo({
		innerWidth: e.innerWidth,
		screenWidth: e.screen?.width ?? 0
	});
}
function mo(e, t) {
	let n = e && typeof e == "object" && !Array.isArray(e) ? e : {}, r = n.mode === "custom" ? "custom" : "own", i = Number(n.width), a = uo(Number.isFinite(i) && i > 0 ? i : t, 640, co), o = Number(n.height), s = Number.isFinite(o) && o > 0 ? uo(o, 480, lo) : 0;
	return {
		mode: r,
		width: Math.round(a),
		height: Math.round(s)
	};
}
function ho(e, t) {
	return e?.mode === "custom" ? {
		width: e.width,
		height: e.height || 0
	} : {
		width: t,
		height: 0
	};
}
var go = 1920, _o = [
	{
		id: "none",
		gutter: 0
	},
	{
		id: "small",
		gutter: 3
	},
	{
		id: "medium",
		gutter: 6
	},
	{
		id: "large",
		gutter: 9
	}
], vo = [
	{
		id: "compact",
		width: 1200
	},
	{
		id: "standard",
		width: 1440
	},
	{
		id: "wide",
		width: 1600
	},
	{
		id: "full",
		width: "full"
	}
], yo = [
	1920,
	1536,
	1366
];
function bo(e) {
	let t = Number(e);
	if (!Number.isFinite(t)) return 1440;
	let n = Math.round(t / 20) * 20;
	return Math.min(go, Math.max(960, n));
}
function xo(e) {
	let t = Number(e);
	if (!Number.isFinite(t)) return 6;
	let n = Math.round(t / 1) * 1;
	return Math.min(12, Math.max(0, n));
}
function So(e, t) {
	if (e === "full") return 0;
	let n = Math.min(49, Math.max(0, Number(t) || 0));
	return Math.ceil(Number(e) / (1 - 2 * n / 100));
}
function Co(e, t, n) {
	let r = Math.max(0, Number(t) || 0) / 100 * n, i = Math.max(0, n - 2 * r), a = e !== "full" && Number(e) < i, o = a ? Number(e) : i;
	return {
		width: o,
		margin: Math.round((n - o) / 2),
		pct: n > 0 ? o / n * 100 : 0,
		bound: a
	};
}
function wo(e) {
	return vo.find((t) => t.width === e)?.id ?? null;
}
//#endregion
//#region src/lib/nav-size.js
var To = {
	min: 0,
	max: 64,
	step: 1
}, Eo = {
	min: 12,
	max: 28,
	step: 1
}, Do = {
	min: 0,
	max: 80,
	step: 1
}, Oo = {
	min: 0,
	max: 64,
	step: 1
}, ko = {
	min: 480,
	max: 1920,
	step: 20
}, Ao = {
	min: .3,
	max: .8,
	step: .05
}, jo = {
	min: 0,
	max: 64,
	step: 1
}, Mo = {
	min: 180,
	max: 400,
	step: 1
}, No = {
	min: 12,
	max: 128,
	step: 1
}, Po = {
	sm: {
		padY: 8.8,
		textSize: 13.6
	},
	md: {
		padY: 14.4,
		textSize: 16
	},
	lg: {
		padY: 20,
		textSize: 16.8
	},
	xl: {
		padY: 27.2,
		textSize: 18.4
	}
}, Fo = [
	"sm",
	"md",
	"lg",
	"xl"
], Io = .67;
function Lo(e) {
	return e === "floating" || e === "floating-square" || e === "floating-tab";
}
function Ro(e, { min: t, max: n, step: r = 1 }, i) {
	let a = Number(e);
	if (e == null || e === "" || !Number.isFinite(a)) return i;
	let o = Math.round(a / r) * r, s = Math.min(n, Math.max(t, o));
	return r < 1 ? Math.round(s * 100) / 100 : s;
}
function zo(e, t) {
	if (e?.padY != null && e.padY !== "") return Ro(e.padY, To, Po.md.padY);
	let n = Po[e?.size] ?? Po.md;
	return Math.round(n.padY * (Lo(t) ? Io : 1));
}
function Bo(e) {
	if (e?.textSize != null && e.textSize !== "") return Ro(e.textSize, Eo, Po.md.textSize);
	let t = Po[e?.size] ?? Po.md;
	return Math.round(t.textSize);
}
function Vo(e) {
	return e?.padY != null && e.padY !== "" || e?.textSize != null && e.textSize !== "" ? null : Fo.includes(e?.size) ? e.size : "md";
}
//#endregion
//#region src/lib/Dropdown.svelte
var Ho = /* @__PURE__ */ H("<button type=\"button\"> </button>"), Uo = /* @__PURE__ */ H("<button type=\"button\"><span class=\"dd-value svelte-vtocc6\"> </span> <span class=\"dd-caret svelte-vtocc6\"> </span></button> <div class=\"dd-pop dd-anchored svelte-vtocc6\" popover=\"auto\"><!></div>", 1), Wo = /* @__PURE__ */ H("<div class=\"dd-pop svelte-vtocc6\"></div>"), Go = /* @__PURE__ */ H("<button type=\"button\"><span class=\"dd-value svelte-vtocc6\"> </span> <span class=\"dd-caret svelte-vtocc6\"> </span></button> <!>", 1), Ko = /* @__PURE__ */ H("<span class=\"dd svelte-vtocc6\"><!></span>");
function Q(e, t) {
	Je(t, !0);
	let n = ji(t, "value", 3, null), r = ji(t, "options", 19, () => []), i = ji(t, "title", 3, null), a = ji(t, "disabled", 3, !1), o = ji(t, "filled", 3, !1), s = ji(t, "compact", 3, !1), c = Qi(), l = ea("urd-dd"), u = l.slice(2), d = /* @__PURE__ */ N(!1), f = /* @__PURE__ */ N(null), p = /* @__PURE__ */ N(null), m = /* @__PURE__ */ N(en({
		top: 0,
		left: 0,
		width: 160
	})), g = () => r().find(([e]) => `${e ?? ""}` == `${n() ?? ""}`)?.[1] ?? "";
	function _() {
		let e = B(f).getBoundingClientRect(), t = Math.min(320, r().length * 32 + 12), n = Math.max(e.width, 160), i = e.bottom + t + 8 <= window.innerHeight;
		P(m, {
			top: i ? e.bottom + 4 : Math.max(8, e.top - t - 4),
			left: Math.max(8, Math.min(e.left, window.innerWidth - n - 8)),
			width: n
		}, !0);
	}
	function v() {
		if (!a()) {
			if (B(d)) {
				P(d, !1);
				return;
			}
			_(), P(d, !0);
		}
	}
	function y(e) {
		c && B(p)?.hidePopover(), P(d, !1), t.onchange?.(e);
	}
	xn(() => {
		if (!B(d)) return;
		let e = () => {
			c ? B(p)?.hidePopover() : P(d, !1);
		};
		if (window.addEventListener("blur", e), c) return () => window.removeEventListener("blur", e);
		let t = (e) => {
			B(f) && !B(f).contains(e.target) && P(d, !1);
		}, n = (e) => {
			e.key === "Escape" && P(d, !1);
		}, r = (e) => {
			B(f) && e.target instanceof Node && !B(f).contains(e.target) && _();
		};
		return document.addEventListener("pointerdown", t, !0), document.addEventListener("keydown", n, !0), document.addEventListener("scroll", r, !0), () => {
			window.removeEventListener("blur", e), document.removeEventListener("pointerdown", t, !0), document.removeEventListener("keydown", n, !0), document.removeEventListener("scroll", r, !0);
		};
	});
	var b = Ko(), x = F(b), S = (e) => {
		var t = Uo(), c = I(t);
		let f;
		var m = F(c), _ = L(m, !0), v = L(R(m, 2), !0);
		D(c);
		var b = R(c, 2), x = F(b), S = (e) => {
			var t = Pr();
			Yr(I(t), 17, r, ([e, t]) => `${e ?? ""}`, (e, t) => {
				var r = /* @__PURE__ */ A(() => h(B(t), 2));
				let i = () => B(r)[0], a = () => B(r)[1];
				var o = Ho();
				let s;
				var c = L(o, !0);
				z(() => {
					s = q(o, 1, "dd-opt svelte-vtocc6", null, s, { selected: `${i() ?? ""}` == `${n() ?? ""}` }), W(c, a());
				}), V("click", o, () => y(i())), U(e, o);
			}), U(e, t);
		};
		G(x, (e) => {
			B(d) && e(S);
		}), D(b), Ai(b, (e) => P(p, e), () => B(p)), z((e) => {
			f = q(c, 1, "dd-btn svelte-vtocc6", null, f, {
				"dd-filled": o(),
				"dd-compact": s()
			}), X(c, "title", i()), c.disabled = a(), X(c, "popovertarget", u), _i(c, `anchor-name: ${l ?? ""}`), W(_, e), W(v, B(d) ? "▴" : "▾"), X(b, "id", u), _i(b, `position-anchor: ${l ?? ""}`);
		}, [() => g()]), wr("toggle", b, (e) => {
			P(d, e.newState === "open");
		}), U(e, t);
	}, C = (e) => {
		var t = Go(), c = I(t);
		let l;
		var u = F(c), f = L(u, !0), p = L(R(u, 2), !0);
		D(c);
		var _ = R(c, 2), b = (e) => {
			var t = Wo();
			Yr(t, 21, r, ([e, t]) => `${e ?? ""}`, (e, t) => {
				var r = /* @__PURE__ */ A(() => h(B(t), 2));
				let i = () => B(r)[0], a = () => B(r)[1];
				var o = Ho();
				let s;
				var c = L(o, !0);
				z(() => {
					s = q(o, 1, "dd-opt svelte-vtocc6", null, s, { selected: `${i() ?? ""}` == `${n() ?? ""}` }), W(c, a());
				}), V("click", o, () => y(i())), U(e, o);
			}), D(t), z(() => _i(t, `top: ${B(m).top ?? ""}px; left: ${B(m).left ?? ""}px; min-width: ${B(m).width ?? ""}px`)), U(e, t);
		};
		G(_, (e) => {
			B(d) && e(b);
		}), z((e) => {
			l = q(c, 1, "dd-btn svelte-vtocc6", null, l, {
				"dd-filled": o(),
				"dd-compact": s()
			}), X(c, "title", i()), c.disabled = a(), W(f, e), W(p, B(d) ? "▴" : "▾");
		}, [() => g()]), V("click", c, v), U(e, t);
	};
	G(x, (e) => {
		c ? e(S) : e(C, -1);
	}), D(b), Ai(b, (e) => P(f, e), () => B(f)), U(e, b), Ye();
}
Tr(["click"]);
//#endregion
//#region src/lib/Choice.svelte
var qo = /* @__PURE__ */ H("<button type=\"button\"> </button>"), Jo = /* @__PURE__ */ H("<div><span class=\"choice-label svelte-1ehof1c\"> </span> <div class=\"choice-seg svelte-1ehof1c\" role=\"group\"></div></div>");
function Yo(e, t) {
	Je(t, !0);
	let n = ji(t, "title", 3, void 0), r = /* @__PURE__ */ A(() => t.options.length > 3 || t.options.reduce((e, [, t]) => e + `${t}`.length, 0) > 20), i = (e) => `${e ?? ""}`;
	var a = Jo();
	let o;
	var s = F(a), c = L(s, !0), l = R(s, 2);
	Yr(l, 21, () => t.options, ([e, t]) => i(e), (e, n) => {
		var r = /* @__PURE__ */ A(() => h(B(n), 2));
		let a = () => B(r)[0], o = () => B(r)[1];
		var s = qo();
		let c;
		var l = L(s, !0);
		z((e, t) => {
			X(s, "aria-pressed", e), c = q(s, 1, "svelte-1ehof1c", null, c, { on: t }), W(l, o());
		}, [() => i(a()) === i(t.value), () => i(a()) === i(t.value)]), V("click", s, () => t.onchange(a())), U(e, s);
	}), D(l), D(a), z(() => {
		o = q(a, 1, "choice svelte-1ehof1c", null, o, { stacked: B(r) }), X(a, "title", n()), W(c, t.label), X(l, "aria-label", t.label);
	}), U(e, a), Ye();
}
Tr(["click"]);
//#endregion
//#region src/lib/IconEditor.svelte
var Xo = /* @__PURE__ */ H("<div class=\"ie-overlay svelte-e7sog7\" role=\"dialog\" aria-modal=\"true\"><div class=\"ie-card svelte-e7sog7\"><h2 class=\"svelte-e7sog7\"> </h2> <div class=\"ie-stage svelte-e7sog7\"><canvas class=\"ie-canvas svelte-e7sog7\"></canvas> <p class=\"ie-hint svelte-e7sog7\"> </p></div> <label class=\"ie-row svelte-e7sog7\"> <span class=\"ie-val svelte-e7sog7\"> </span></label> <input type=\"range\" min=\"1\" max=\"3\" step=\"0.02\" class=\"svelte-e7sog7\"/> <label class=\"ie-row svelte-e7sog7\"> <span class=\"ie-val svelte-e7sog7\"> </span></label> <input type=\"range\" min=\"0.3\" max=\"2\" step=\"0.02\" class=\"svelte-e7sog7\"/> <label class=\"ie-row svelte-e7sog7\"> <span class=\"ie-val svelte-e7sog7\"> </span></label> <input type=\"range\" min=\"0.3\" max=\"2\" step=\"0.02\" class=\"svelte-e7sog7\"/> <label class=\"ie-row svelte-e7sog7\"> <span class=\"ie-val svelte-e7sog7\"> </span></label> <input type=\"range\" min=\"0\" max=\"2\" step=\"0.02\" class=\"svelte-e7sog7\"/> <span class=\"ie-tools svelte-e7sog7\"><button type=\"button\" class=\"ghost svelte-e7sog7\"> </button> <button type=\"button\" class=\"ghost svelte-e7sog7\"> </button></span> <span class=\"ie-actions svelte-e7sog7\"><button type=\"button\" class=\"ghost svelte-e7sog7\"> </button> <button type=\"button\" class=\"primary svelte-e7sog7\"> </button></span></div></div>");
function Zo(e, t) {
	Je(t, !0);
	let n = ji(t, "image", 3, ""), r = /* @__PURE__ */ N(null), i = /* @__PURE__ */ N(null), a = /* @__PURE__ */ N(1), o = /* @__PURE__ */ N(.5), s = /* @__PURE__ */ N(.5), c = /* @__PURE__ */ N(1), l = /* @__PURE__ */ N(1), u = /* @__PURE__ */ N(1);
	xn(() => {
		if (!n()) return;
		let e = new Image();
		e.onload = () => {
			P(i, e, !0);
		}, e.src = n();
	});
	function d(e, t) {
		if (e.clearRect(0, 0, t, t), !B(i)) return;
		e.filter = `brightness(${B(c)}) contrast(${B(l)}) saturate(${B(u)})`;
		let n = Math.max(t / B(i).width, t / B(i).height) * B(a), r = B(i).width * n, d = B(i).height * n, f = t / 2 - B(o) * r, p = t / 2 - B(s) * d;
		f = Math.min(0, Math.max(t - r, f)), p = Math.min(0, Math.max(t - d, p)), e.drawImage(B(i), f, p, r, d), e.filter = "none";
	}
	xn(() => {
		B(i), B(a), B(o), B(s), B(c), B(l), B(u), B(r) && d(B(r).getContext("2d"), 220);
	});
	function f(e) {
		if (!B(i)) return;
		e.preventDefault();
		let t = e.clientX, n = e.clientY, r = Math.max(220 / B(i).width, 220 / B(i).height) * B(a), c = B(i).width * r, l = B(i).height * r, u = (e) => {
			P(o, Math.min(1, Math.max(0, B(o) - (e.clientX - t) / c)), !0), P(s, Math.min(1, Math.max(0, B(s) - (e.clientY - n) / l)), !0), t = e.clientX, n = e.clientY;
		}, d = () => {
			window.removeEventListener("pointermove", u), window.removeEventListener("pointerup", d);
		};
		window.addEventListener("pointermove", u), window.addEventListener("pointerup", d);
	}
	function p() {
		P(a, 1), P(o, .5), P(s, .5), P(c, 1), P(l, 1), P(u, 1);
	}
	function m() {
		let e = document.createElement("canvas");
		e.width = 128, e.height = 128, d(e.getContext("2d"), 128), t.onapply?.(e.toDataURL("image/webp", .92));
	}
	var h = Xo(), g = F(h), _ = F(g), v = L(_, !0), y = R(_, 2), b = F(y);
	X(b, "width", 220), X(b, "height", 220), Ai(b, (e) => P(r, e), () => B(r));
	var x = L(R(b, 2), !0);
	D(y);
	var S = R(y, 2), C = F(S), w = L(R(C));
	D(S);
	var T = R(S, 2);
	J(T);
	var ee = R(T, 2), te = F(ee), ne = L(R(te));
	D(ee);
	var E = R(ee, 2);
	J(E);
	var re = R(E, 2), ie = F(re), ae = L(R(ie));
	D(re);
	var oe = R(re, 2);
	J(oe);
	var se = R(oe, 2), ce = F(se), le = L(R(ce));
	D(se);
	var ue = R(se, 2);
	J(ue);
	var de = R(ue, 2), fe = F(de), pe = L(fe, !0), me = R(fe, 2), he = L(me, !0);
	D(de);
	var ge = R(de, 2), _e = F(ge), ve = L(_e, !0), ye = R(_e, 2), be = L(ye, !0);
	D(ge), D(g), D(h), z((e, t, n, r, i, a, o, s, c, l, u, d, f, p, m) => {
		W(v, e), X(b, "title", t), W(x, n), W(C, `${r ?? ""} `), W(w, `${i ?? ""}x`), W(te, `${a ?? ""} `), W(ne, `${o ?? ""}%`), W(ie, `${s ?? ""} `), W(ae, `${c ?? ""}%`), W(ce, `${l ?? ""} `), W(le, `${u ?? ""}%`), W(pe, d), W(he, f), W(ve, p), W(be, m);
	}, [
		() => Z("ie.title"),
		() => Z("ie.dragTip"),
		() => Z("ie.hint"),
		() => Z("lbl.zoom"),
		() => B(a).toFixed(2),
		() => Z("lbl.brightness"),
		() => Math.round(B(c) * 100),
		() => Z("lbl.contrast"),
		() => Math.round(B(l) * 100),
		() => Z("lbl.saturate"),
		() => Math.round(B(u) * 100),
		() => Z("ie.grayscale"),
		() => Z("common.reset"),
		() => Z("confirm.cancel"),
		() => Z("common.apply")
	]), V("pointerdown", b, f), Ei(T, () => B(a), (e) => P(a, e)), Ei(E, () => B(c), (e) => P(c, e)), Ei(oe, () => B(l), (e) => P(l, e)), Ei(ue, () => B(u), (e) => P(u, e)), V("click", fe, () => P(u, 0)), V("click", me, p), V("click", _e, () => t.oncancel?.()), V("click", ye, m), U(e, h), Ye();
}
Tr(["pointerdown", "click"]);
//#endregion
//#region ../template/assets/engine/0.7.4/blocks/form.js
var Qo = () => [
	{
		id: "navn",
		label: Z("form.fieldName"),
		type: "text",
		required: !0
	},
	{
		id: "epost",
		label: Z("form.fieldEmail"),
		type: "email",
		required: !0
	},
	{
		id: "melding",
		label: Z("form.fieldMessage"),
		type: "textarea",
		required: !0
	}
], $o = 24, es = {
	"oppsett-byttet": "layout-changed",
	"blokk-endret": "block-edited",
	"desktop-endret-etter-mobil": "desktop-changed-after-mobile",
	seksjonshøyde: "section-height",
	"blokk-flyttet": "block-moved",
	"blokk-slettet": "block-deleted",
	"blokk-lagt-til": "block-added"
};
function ts(e, t) {
	if (!e || !("y" in e || "h" in e)) return e ?? null;
	if (t && e.x === t.x && e.y === t.y && e.w === t.w && e.h === t.h) return null;
	let n = {
		x: e.x,
		w: e.w
	};
	return Number.isFinite(e.y) && (n.row = Math.max(1, Math.round((e.y - $o) / 8) + 1), n.rows = Number.isFinite(e.h) ? Math.max(1, Math.ceil(e.h / 8)) : 1), Number.isFinite(e.z) && e.z !== 1 && (n.z = e.z), e.rot && (n.rot = e.rot), n;
}
var ns = {
	samling: "collection",
	galleri: "gallery",
	tidslinje: "timeline",
	sitat: "quote",
	statistikk: "stats",
	tabell: "table",
	deling: "share",
	nedteller: "countdown",
	produkt: "product",
	handlekurv: "cart",
	kasse: "checkout"
}, rs = { bildegalleri: "slideshow" }, is = {
	flate: "surface",
	aksent: "accent",
	invers: "inverse",
	dus: "soft",
	dempet: "muted",
	dyp: "deep",
	uthevet: "highlighted"
}, as = {
	tom: "blank",
	"hero-sentrert": "hero-centered",
	bilder: "images",
	galleri: "gallery",
	kontakt: "contact",
	funksjonskort: "feature-cards",
	"funksjonskort-enkel": "feature-cards-simple",
	nyheter: "news",
	"nyheter-samling": "news-collection",
	oppslagstavle: "noticeboard",
	publikasjonsarkiv: "publication-archive",
	arrangementer: "events",
	tidslinje: "timeline",
	steg: "steps",
	hovedoppslag: "lead-story",
	produkter: "products",
	butikk: "shop",
	"butikk-hero": "shop-hero",
	"butikk-kategorier": "shop-categories",
	"butikk-tillit": "shop-trust",
	"butikk-utstilling": "shop-showcase",
	kasse: "checkout",
	sitat: "quote",
	statistikk: "stats",
	sponsorer: "sponsors",
	medlemskap: "membership"
};
function os(e) {
	let t = Array.isArray(e) ? e : e.blocks ?? [];
	for (let e of t) ns[e.type] && (e.type = ns[e.type]);
	if (!Array.isArray(e)) {
		for (let t of e.background?.layers ?? []) rs[t.type] && (t.type = rs[t.type]);
		is[e.theme] && (e.theme = is[e.theme]), as[e.preset] && (e.preset = as[e.preset]);
	}
	return e;
}
var ss = {
	1: (e) => {
		for (let t of e.sections ?? []) {
			let e = t.responsive?.mobile;
			for (let e of t.blocks ?? []) e.decor && (e.hideMobile = !0), e.frames?.mobile && (e.frames.mobile = ts(e.frames.mobile, e.frames.desktop));
			e?.mode === "manual" && (e.mode = "auto");
			let n = e?.attention?.reason;
			n && es[n] && (e.attention.reason = es[n]);
		}
		return e;
	},
	2: (e) => {
		for (let t of e.sections ?? []) os(t);
		return e;
	},
	3: (e) => {
		for (let t of e.sections ?? []) os(t);
		return e;
	}
}, cs = {
	1: (e) => ({
		...e,
		layout: e.layout ?? {
			contentWidth: 1440,
			gutter: 6
		}
	}),
	2: (e) => ({
		...e,
		layout: {
			...e.layout ?? { contentWidth: 1440 },
			gutter: 6
		}
	})
};
function ls(e) {
	let t = structuredClone(e), n = t.schemaVersion ?? 1;
	for (; n < 3;) {
		let r = cs[n];
		if (typeof r != "function") return e;
		t = r(t) ?? t, n++, t.schemaVersion = n;
	}
	return t;
}
function us(e, t) {
	let n = structuredClone(e), r = n.schemaVersion ?? 1;
	for (; r < 4;) {
		let i = ss[r];
		if (typeof i != "function") return e;
		n = i(n, t) ?? n, r++, n.schemaVersion = r;
	}
	return n;
}
//#endregion
//#region ../template/assets/engine/0.7.4/plugins.js
function ds(e) {
	let t = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(e).trim());
	return t ? [
		Number(t[1]),
		Number(t[2]),
		Number(t[3])
	] : null;
}
var fs = (e, t) => e[0] - t[0] || e[1] - t[1] || e[2] - t[2];
function ps(e, t) {
	let n = ds(e);
	if (!n || typeof t != "string" || !t.trim()) return !1;
	for (let e of t.trim().split(/\s+/)) {
		let t = /^(>=|<=|>|<|=|\^|~)?(\d+\.\d+\.\d+)$/.exec(e);
		if (!t) return !1;
		let r = t[1] ?? "=", i = ds(t[2]), a = fs(n, i);
		if (!(r === ">=" ? a >= 0 : r === ">" ? a > 0 : r === "<=" ? a <= 0 : r === "<" ? a < 0 : r === "^" ? i[0] === 0 ? n[0] === 0 && n[1] === i[1] && a >= 0 : n[0] === i[0] && a >= 0 : r === "~" ? n[0] === i[0] && n[1] === i[1] && a >= 0 : a === 0)) return !1;
	}
	return !0;
}
var ms = /^[a-z0-9][a-z0-9-]*$/;
function hs(e) {
	let t = [];
	if (!e || typeof e != "object") return ["the manifest is not an object"];
	ms.test(e.id ?? "") || t.push("id is missing or invalid"), (typeof e.name != "string" || !e.name) && t.push("name is missing"), ds(e.version ?? "") || t.push("version is not semver"), (typeof e.requiresEngine != "string" || !e.requiresEngine) && t.push("requiresEngine is missing");
	let n = Array.isArray(e.languages) && e.languages.length > 0;
	return (e.entry !== void 0 || !n) && (typeof e.entry != "string" || !e.entry.endsWith(".js")) && t.push("entry is missing or is not a .js file"), (e.provides !== void 0 || !n) && (!e.provides || typeof e.provides != "object") && t.push("provides is missing"), e.languages !== void 0 && t.push(...Ri(e.languages)), e.locales !== void 0 && typeof e.locales != "boolean" && t.push("locales must be a boolean"), e.names !== void 0 && (typeof e.names != "object" || e.names === null || Array.isArray(e.names) || Object.values(e.names).some((e) => typeof e != "string" || !e)) && t.push("names must be an object mapping language code to name"), t;
}
Promise.resolve();
//#endregion
//#region ../template/assets/engine/0.7.4/sections/presets.js
function gs(e) {
	return typeof crypto < "u" && crypto.randomUUID ? `${e}-${crypto.randomUUID().slice(0, 8)}` : `${e}-${[...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(4))].map((e) => e.toString(16).padStart(2, "0")).join("")}`;
}
var _s = () => ({ mobile: {
	mode: "auto",
	attention: null
} }), $ = (e, t, n, r, i = 1) => ({
	desktop: {
		x: e,
		y: t,
		w: n,
		h: r,
		z: i,
		rot: 0
	},
	mobile: null
}), vs = (e, t, n = {}) => ({
	id: gs("blk"),
	type: "text",
	version: 1,
	props: {
		html: t,
		align: "left",
		box: !1,
		...n
	},
	animation: null,
	frames: e
}), ys = (e, t = {}) => ({
	id: gs("blk"),
	type: "image",
	version: 1,
	props: {
		src: "",
		alt: Z("seed.imageAlt"),
		fit: "cover",
		radius: "md",
		href: null,
		...t
	},
	animation: null,
	frames: e
}), bs = (e, t, n = {}) => ({
	id: gs("blk"),
	type: "button",
	version: 1,
	props: {
		label: t,
		page: null,
		href: "#",
		style: "primary",
		...n
	},
	animation: null,
	frames: e
}), xs = (e, t, n = 40) => ({
	id: gs("blk"),
	type: "icon",
	version: 1,
	props: {
		glyph: t,
		color: "accent",
		size: n
	},
	animation: null,
	frames: e
}), Ss = (e, t = {}) => ({
	id: gs("blk"),
	type: "map",
	version: 1,
	props: {
		location: "",
		zoom: 15,
		height: 320,
		...t
	},
	animation: null,
	frames: e
}), Cs = (e, t = {}) => ({
	id: gs("blk"),
	type: "form",
	version: 1,
	props: {
		recipient: "",
		subject: "",
		mode: "mailto",
		endpoint: "",
		submitLabel: Z("form.sendDefault"),
		successText: Z("form.thanksDefault"),
		fields: Qo(),
		...t
	},
	animation: null,
	frames: e
}), ws = (e, t = {}) => ({
	id: gs("blk"),
	type: "calendar",
	version: 1,
	props: {
		sources: [],
		view: "list",
		limit: 6,
		showCategories: !0,
		showSubscribe: !0,
		...t
	},
	animation: null,
	frames: e
}), Ts = () => ({
	type: "hover-lift",
	version: 1,
	props: {}
}), Es = (e, t, n = {}) => ({
	id: gs("blk"),
	type: "collection",
	version: 1,
	props: {
		collection: null,
		view: t,
		limit: 6,
		newestFirst: !0,
		...n
	},
	animation: null,
	frames: e
}), Ds = (e, t = {}) => ({
	id: gs("blk"),
	type: "product",
	version: 1,
	props: {
		collection: null,
		limit: 0,
		columns: 0,
		currency: "kr",
		...t
	},
	animation: null,
	frames: e
}), Os = (e, t = {}) => ({
	id: gs("blk"),
	type: "cart",
	version: 1,
	props: {
		variant: "button",
		href: "",
		currency: "kr",
		...t
	},
	animation: null,
	frames: e
}), ks = (e, t = {}) => ({
	id: gs("blk"),
	type: "checkout",
	version: 1,
	props: {
		recipient: "",
		endpoint: "",
		vipps: "",
		currency: "kr",
		...t
	},
	animation: null,
	frames: e
}), As = (e, t = {}) => ({
	id: gs("blk"),
	type: "gallery",
	version: 1,
	props: {
		images: [],
		view: "grid",
		columns: 3,
		gap: 12,
		radius: "md",
		lightbox: !0,
		interval: 5,
		...t
	},
	animation: null,
	frames: e
}), js = (e, t) => ({
	id: gs("blk"),
	type: "faq",
	version: 1,
	props: {
		items: t,
		multi: !1
	},
	animation: null,
	frames: e
}), Ms = (e, t = {}) => ({
	id: gs("blk"),
	type: "quote",
	version: 1,
	props: {
		text: "",
		attribution: "",
		role: "",
		variant: "large",
		image: "",
		accent: null,
		...t
	},
	animation: null,
	frames: e
}), Ns = (e, t) => ({
	id: gs("blk"),
	type: "timeline",
	version: 1,
	props: {
		items: t,
		variant: "left",
		marker: "filled",
		accent: null
	},
	animation: null,
	frames: e
}), Ps = (e, t = {}) => ({
	id: gs("blk"),
	type: "stats",
	version: 1,
	props: {
		value: "4800",
		prefix: "",
		suffix: "",
		label: "",
		countUp: !0,
		...t
	},
	animation: null,
	frames: e
}), Fs = (...e) => ({
	version: 1,
	layers: e
}), Is = (e) => ({
	type: "color",
	version: 1,
	props: { value: e }
}), Ls = (e, t, n, r = .5) => ({
	type: "glow",
	version: 1,
	props: {
		x: e,
		y: t,
		color: "accent",
		radius: r,
		opacity: n
	}
}), Rs = (e) => Math.max(0, ...e.blocks.map((e) => e.frames.desktop.y + e.frames.desktop.h)), zs = (e, t, n, r, i, a) => ({
	x: n + e % t * r,
	y: i + Math.floor(e / t) * a
}), Bs = (e, t, n, r, i, a, o, s, c = 0) => {
	let l = (t) => e.blocks.some((e) => {
		let n = e.frames.desktop;
		return n.x < t.x + t.w - .01 && t.x < n.x + n.w - .01 && n.y < t.y + t.h - .01 && t.y < n.y + n.h - .01;
	});
	for (let e = 0; e < 60; e++) {
		let u = zs(e, t, n, r, i, a);
		if (!l({
			x: u.x,
			y: u.y + c,
			w: o,
			h: s
		})) return {
			...u,
			n: e
		};
	}
	return {
		x: n,
		y: Rs(e) + 16,
		n: 0
	};
}, Vs = (e, t, n) => e + t * .1 + n * .01, Hs = (e, t, n, r, i = null) => ({
	id: gs("sec"),
	version: 1,
	preset: e,
	size: { minHeight: t },
	grid: i,
	background: n,
	blocks: r,
	responsive: _s()
});
function Us(e) {
	e.sections.define("blank", {
		label: "Empty section",
		labelKey: "preset.blank.label",
		group: "Basics",
		groupKey: "presetGroup.basic",
		hint: "A blank canvas to build on freely",
		hintKey: "preset.blank.hint",
		create: () => Hs("blank", "40vh", Fs(Is("bg")), [])
	}), e.sections.define("hero", {
		label: "Hero",
		labelKey: "preset.hero.label",
		group: "Basics",
		groupKey: "presetGroup.basic",
		hint: "Large opening with gradient and glow, left-aligned",
		hintKey: "preset.hero.hint",
		create: () => Hs("hero", "70vh", {
			version: 1,
			layers: [
				{
					type: "gradient",
					version: 1,
					props: {
						stops: ["#0b0e14", "#1a1030"],
						angle: 160,
						animate: !1
					}
				},
				Ls(.7, .2, .35),
				{
					type: "grain",
					version: 1,
					props: { opacity: .06 }
				}
			]
		}, [
			vs($(8.33, 40, 50, 38), Z("seed.hero.title")),
			vs($(8.33, 84, 41.67, 26), Z("seed.hero.intro")),
			bs($(8.33, 118, 20, 32), Z("seed.readMore"))
		])
	}), e.sections.define("hero-centered", {
		label: "Hero, centred",
		labelKey: "preset.hero-centered.label",
		group: "Basics",
		groupKey: "presetGroup.basic",
		hint: "Centred opening with two buttons",
		hintKey: "preset.hero-centered.hint",
		create: () => Hs("hero-centered", "60vh", Fs(Is("bg")), [
			vs($(15, 64, 70, 44), Z("seed.heroCenter.title"), { align: "center" }),
			vs($(25, 116, 50, 26), Z("seed.heroCenter.intro"), { align: "center" }),
			bs($(31.5, 160, 17, 40), Z("seed.join")),
			bs($(51.5, 160, 17, 40), Z("seed.readMore"), { style: "secondary" })
		])
	}), e.sections.define("images", {
		label: "Images",
		labelKey: "preset.images.label",
		group: "Basics",
		groupKey: "presetGroup.basic",
		hint: "Title and three image frames",
		hintKey: "preset.images.hint",
		create: () => Hs("images", "360px", Fs(Is("bg")), [
			vs($(4, 24, 50, 32), Z("seed.images.title")),
			ys($(4, 72, 28, 220)),
			ys($(36, 72, 28, 220)),
			ys($(68, 72, 28, 220))
		]),
		itemLabel: "image",
		itemLabelKey: "item.image",
		item: (e) => {
			let { x: t, y: n } = Bs(e, 3, 4, 32, 72, 244, 28, 220);
			return {
				blocks: [ys($(t, n, 28, 220))],
				bottom: n + 244
			};
		}
	}), e.sections.define("gallery", {
		label: "Gallery",
		labelKey: "preset.gallery.label",
		group: "Basics",
		groupKey: "presetGroup.basic",
		hint: "Image gallery in a grid with full-screen view (lightbox)",
		hintKey: "preset.gallery.hint",
		create: () => Hs("gallery", "440px", Fs(Is("bg")), [vs($(4, 24, 50, 32), Z("seed.gallery.title")), As($(4, 72, 92, 320))])
	}), e.sections.define("find-us", {
		label: "Find us",
		labelKey: "preset.find-us.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "Map with your address (privacy-friendly OpenStreetMap)",
		hintKey: "preset.find-us.hint",
		create: () => Hs("find-us", "480px", Fs(Is("bg")), [vs($(6, 40, 60, 70), Z("seed.findUs.title")), Ss($(6, 120, 88, 360, 2))])
	}), e.sections.define("whats-on", {
		label: "What is on",
		labelKey: "preset.whats-on.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "Event list from a subscribable calendar (iCal/Google)",
		hintKey: "preset.whats-on.hint",
		create: () => Hs("whats-on", "520px", Fs(Is("bg")), [vs($(6, 40, 60, 70), Z("seed.whatsOn.title")), ws($(6, 130, 88, 320, 2), { limit: 5 })])
	}), e.sections.define("contact-form", {
		label: "Contact form",
		labelKey: "preset.contact-form.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "Contact form that sends via email (or your own endpoint)",
		hintKey: "preset.contact-form.hint",
		create: () => Hs("contact-form", "520px", Fs(Is("bg")), [vs($(6, 40, 60, 120), Z("seed.contactForm.intro")), Cs($(6, 180, 60, 380, 2))])
	}), e.sections.define("contact", {
		label: "Contact",
		labelKey: "preset.contact.label",
		group: "Basics",
		groupKey: "presetGroup.basic",
		hint: "Contact details in a card with an email button",
		hintKey: "preset.contact.hint",
		create: () => Hs("contact", "320px", Fs(Is("surface"), Ls(.2, .8, .2)), [
			vs($(10, 32, 40, 36), Z("seed.contact.title")),
			vs($(10, 84, 36, 130), Z("seed.contact.info"), { box: !0 }),
			bs($(60, 100, 22, 40), Z("seed.contact.button"), { href: `mailto:${Z("seed.email")}` })
		])
	}), e.sections.define("feature-cards", {
		label: "Feature cards",
		labelKey: "preset.feature-cards.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "Three cards with icon, title and text",
		hintKey: "preset.feature-cards.hint",
		create: () => {
			let e = (e, t, n, r) => {
				let i = xs($(e + 10.5, 88, 4, 52), n), a = vs($(e, 152, 25, 200), Z("seed.features.card", { title: r }), {
					align: "center",
					box: !0
				});
				return a.animation = Ts(), i.mobileOrder = Vs(88, t, 0), a.mobileOrder = Vs(88, t, 1), [i, a];
			};
			return Hs("feature-cards", "420px", Fs(Is("bg")), [
				vs($(6, 28, 60, 38), Z("seed.features.title")),
				...e(6, 0, "✦", Z("seed.features.card1")),
				...e(37.5, 1, "★", Z("seed.features.card2")),
				...e(69, 2, "✓", Z("seed.features.card3"))
			]);
		},
		itemLabel: "card",
		itemLabelKey: "item.card",
		item: (e) => {
			let { x: t, y: n, n: r } = Bs(e, 3, 6, 31.5, 152, 296, 25, 264, -64), i = xs($(t + 10.5, n - 64, 4, 52), "✦"), a = vs($(t, n, 25, 200), Z("seed.features.card", { title: Z("seed.features.newTitle") }), {
				align: "center",
				box: !0
			});
			return a.animation = Ts(), i.mobileOrder = Vs(88, r, 0), a.mobileOrder = Vs(88, r, 1), {
				blocks: [i, a],
				bottom: n + 228
			};
		}
	}), e.sections.define("feature-cards-simple", {
		label: "Feature cards without icons",
		labelKey: "preset.feature-cards-simple.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "Three cards with title and text (without the icons above)",
		hintKey: "preset.feature-cards-simple.hint",
		create: () => {
			let e = (e, t, n) => {
				let r = vs($(e, 88, 25, 200), Z("seed.features.card", { title: n }), {
					align: "center",
					box: !0
				});
				return r.animation = Ts(), r.mobileOrder = Vs(88, t, 0), r;
			};
			return Hs("feature-cards-simple", "360px", Fs(Is("bg")), [
				vs($(6, 28, 60, 38), Z("seed.features.title")),
				e(6, 0, Z("seed.features.card1")),
				e(37.5, 1, Z("seed.features.card2")),
				e(69, 2, Z("seed.features.card3"))
			]);
		},
		itemLabel: "card",
		itemLabelKey: "item.card",
		item: (e) => {
			let { x: t, y: n, n: r } = Bs(e, 3, 6, 31.5, 88, 232, 25, 200), i = vs($(t, n, 25, 200), Z("seed.features.card", { title: Z("seed.features.newTitle") }), {
				align: "center",
				box: !0
			});
			return i.animation = Ts(), i.mobileOrder = Vs(88, r, 0), {
				blocks: [i],
				bottom: n + 228
			};
		}
	}), e.sections.define("news", {
		label: "News",
		labelKey: "preset.news.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "Three news cards with image, tag and date",
		hintKey: "preset.news.hint",
		create: () => {
			let e = (e, t) => {
				let n = ys($(e, 88, 25, 160)), r = vs($(e, 256, 25, 160), Z("seed.news.card"));
				return n.mobileOrder = Vs(88, t, 0), r.mobileOrder = Vs(88, t, 1), [n, r];
			};
			return Hs("news", "460px", Fs(Is("bg")), [
				vs($(6, 28, 50, 38), Z("seed.news.title")),
				bs($(78, 30, 16, 36), Z("seed.news.seeAll"), { style: "secondary" }),
				...e(6, 0),
				...e(37.5, 1),
				...e(69, 2)
			]);
		},
		itemLabel: "story",
		itemLabelKey: "item.story",
		item: (e) => {
			let { x: t, y: n, n: r } = Bs(e, 3, 6, 31.5, 88, 344, 25, 328), i = ys($(t, n, 25, 160)), a = vs($(t, n + 168, 25, 160), Z("seed.news.card"));
			return i.mobileOrder = Vs(88, r, 0), a.mobileOrder = Vs(88, r, 1), {
				blocks: [i, a],
				bottom: n + 352
			};
		}
	}), e.sections.define("news-collection", {
		label: "News (collection)",
		labelKey: "preset.news-collection.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "News cards from a collection: write entries, the cards follow",
		hintKey: "preset.news-collection.hint",
		create: () => Hs("news-collection", "300px", Fs(Is("bg")), [vs($(6, 28, 50, 38), Z("seed.news.title")), Es($(6, 88, 88, 180), "cards")])
	}), e.sections.define("noticeboard", {
		label: "Noticeboard",
		labelKey: "preset.noticeboard.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "Dated list from a collection (notices/announcements)",
		hintKey: "preset.noticeboard.hint",
		create: () => Hs("noticeboard", "300px", Fs(Is("surface")), [vs($(6, 28, 50, 38), Z("seed.noticeboard.title")), Es($(6, 88, 88, 180), "list", { limit: 8 })])
	}), e.sections.define("publication-archive", {
		label: "Publication archive",
		labelKey: "preset.publication-archive.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "Year-grouped archive from a collection (issues, minutes, reports)",
		hintKey: "preset.publication-archive.hint",
		create: () => Hs("publication-archive", "300px", Fs(Is("bg")), [vs($(6, 28, 60, 38), Z("seed.archive.title")), Es($(6, 88, 88, 180), "archive", { limit: 0 })])
	}), e.sections.define("events", {
		label: "Events",
		labelKey: "preset.events.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "Three rows with date badge and sign-up button",
		hintKey: "preset.events.hint",
		create: () => {
			let e = (e, t, n, r) => [
				vs($(6, e, 8, 88), Z("seed.events.dateBadge", {
					day: t,
					month: n
				}), {
					align: "center",
					box: !0
				}),
				vs($(16, e, 58, 88), Z("seed.events.row", { title: r })),
				bs($(78, e + 24, 16, 40), Z("seed.events.signup"), { style: "secondary" })
			];
			return Hs("events", "440px", Fs(Is("surface")), [
				vs($(6, 28, 50, 38), Z("seed.events.title")),
				...e(88, "11", Z("seed.events.monthAug"), Z("seed.events.row1")),
				...e(196, "25", Z("seed.events.monthAug"), Z("seed.events.row2")),
				...e(304, "8", Z("seed.events.monthSep"), Z("seed.events.row3"))
			]);
		},
		itemLabel: "row",
		itemLabelKey: "item.row",
		item: (e) => {
			let t = Rs(e) + 16;
			return {
				blocks: [
					vs($(6, t, 8, 88), Z("seed.events.newBadge"), {
						align: "center",
						box: !0
					}),
					vs($(16, t, 58, 88), Z("seed.events.row", { title: Z("seed.events.newTitle") })),
					bs($(78, t + 24, 16, 40), Z("seed.events.signup"), { style: "secondary" })
				],
				bottom: t + 116
			};
		}
	}), e.sections.define("team", {
		label: "Team/board",
		labelKey: "preset.team.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "Portraits with name, role and email",
		hintKey: "preset.team.hint",
		create: () => {
			let e = (e, t, n) => {
				let r = ys($(e, 80, 22, 180), { alt: Z("seed.team.alt") }), i = vs($(e, 268, 22, 84), Z("seed.team.member", { role: n }), { align: "center" });
				return r.mobileOrder = Vs(80, t, 0), i.mobileOrder = Vs(80, t, 1), [r, i];
			};
			return Hs("team", "420px", Fs(Is("surface")), [
				vs($(6, 24, 50, 32), Z("seed.team.title")),
				...e(7.5, 0, Z("seed.team.role1")),
				...e(39, 1, Z("seed.team.role2")),
				...e(70.5, 2, Z("seed.team.role3"))
			]);
		},
		itemLabel: "person",
		itemLabelKey: "item.person",
		item: (e) => {
			let { x: t, y: n, n: r } = Bs(e, 3, 7.5, 31.5, 80, 288, 22, 272), i = ys($(t, n, 22, 180), { alt: Z("seed.team.alt") }), a = vs($(t, n + 188, 22, 84), Z("seed.team.member", { role: Z("seed.team.roleNew") }), { align: "center" });
			return i.mobileOrder = Vs(80, r, 0), a.mobileOrder = Vs(80, r, 1), {
				blocks: [i, a],
				bottom: n + 296
			};
		}
	}), e.sections.define("faq", {
		label: "FAQ",
		labelKey: "preset.faq.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "Questions and answers in cards",
		hintKey: "preset.faq.hint",
		create: () => Hs("faq", "520px", Fs(Is("bg")), [
			vs($(25, 24, 50, 36), Z("seed.faq.title"), { align: "center" }),
			js($(20, 80, 60, 320), [
				{
					q: Z("seed.faq.q1"),
					a: Z("seed.faq.answer")
				},
				{
					q: Z("seed.faq.q2"),
					a: Z("seed.faq.answer")
				},
				{
					q: Z("seed.faq.q3"),
					a: Z("seed.faq.answer")
				}
			]),
			vs($(20, 416, 60, 32), Z("seed.faq.more"), { align: "center" })
		])
	}), e.sections.define("timeline", {
		label: "Timeline",
		labelKey: "preset.timeline.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "Your story as events along a line",
		hintKey: "preset.timeline.hint",
		create: () => Hs("timeline", "480px", Fs(Is("bg")), [vs($(25, 24, 50, 36), Z("seed.timeline.title"), { align: "center" }), Ns($(25, 88, 50, 330), [
			{
				year: "2019",
				title: Z("seed.timeline.t1"),
				text: Z("seed.timeline.text")
			},
			{
				year: "2022",
				title: Z("seed.timeline.t2"),
				text: Z("seed.timeline.text")
			},
			{
				year: "2026",
				title: Z("seed.timeline.t3"),
				text: Z("seed.timeline.text")
			}
		])])
	}), e.sections.define("steps", {
		label: "Step by step",
		labelKey: "preset.steps.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "Three numbered cards",
		hintKey: "preset.steps.hint",
		create: () => {
			let e = (e, t, n) => {
				let r = vs($(e, 88, 25, 72), `<h3>${t + 1}</h3>`, {
					align: "center",
					size: 44
				}), i = vs($(e, 168, 25, 160), Z("seed.steps.card", { title: n }), {
					align: "center",
					box: !0
				});
				return r.mobileOrder = Vs(88, t, 0), i.mobileOrder = Vs(88, t, 1), [r, i];
			};
			return Hs("steps", "400px", Fs(Is("bg")), [
				vs($(6, 28, 60, 38), Z("seed.steps.title")),
				...e(6, 0, Z("seed.steps.s1")),
				...e(37.5, 1, Z("seed.steps.s2")),
				...e(69, 2, Z("seed.steps.s3"))
			]);
		},
		itemLabel: "step",
		itemLabelKey: "item.step",
		item: (e) => {
			let { x: t, y: n, n: r } = Bs(e, 3, 6, 31.5, 88, 272, 25, 240), i = vs($(t, n, 25, 72), `<h3>${r + 1}</h3>`, {
				align: "center",
				size: 44
			}), a = vs($(t, n + 80, 25, 160), Z("seed.steps.card", { title: Z("seed.steps.newTitle") }), {
				align: "center",
				box: !0
			});
			return i.mobileOrder = Vs(88, r, 0), a.mobileOrder = Vs(88, r, 1), {
				blocks: [i, a],
				bottom: n + 268
			};
		}
	}), e.sections.define("lead-story", {
		label: "Lead story",
		labelKey: "preset.lead-story.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "One big story and two small beside it",
		hintKey: "preset.lead-story.hint",
		create: () => {
			let e = [
				ys($(6, 40, 55, 300)),
				vs($(6, 348, 55, 108), Z("seed.feature.main")),
				bs($(6, 464, 14, 38), Z("seed.readMore"), { style: "secondary" }),
				ys($(66, 40, 28, 120)),
				vs($(66, 164, 28, 60), Z("seed.feature.small1")),
				ys($(66, 244, 28, 120)),
				vs($(66, 368, 28, 60), Z("seed.feature.small2"))
			];
			return e.forEach((e, t) => {
				e.mobileOrder = Vs(40, t < 3 ? 0 : 1, t);
			}), Hs("lead-story", "540px", Fs(Is("bg")), e);
		}
	}), e.sections.define("products", {
		label: "Products",
		labelKey: "preset.products.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "Three hand-built product cards with their own buy link; the Shop preset gives real products with a basket",
		hintKey: "preset.products.hint",
		create: () => {
			let e = (e, t, n, r) => {
				let i = [
					ys($(e, 88, 25, 200)),
					vs($(e, 296, 25, 76), Z("seed.products.card", {
						name: n,
						price: r
					}), { align: "center" }),
					bs($(e + 5, 380, 15, 40), Z("seed.products.buy"))
				];
				return i.forEach((e, n) => {
					e.mobileOrder = Vs(88, t, n);
				}), i;
			};
			return Hs("products", "470px", Fs(Is("bg")), [
				vs($(6, 28, 50, 38), Z("seed.products.title")),
				...e(6, 0, Z("seed.products.name"), Z("seed.products.price1")),
				...e(37.5, 1, Z("seed.products.name"), Z("seed.products.price2")),
				...e(69, 2, Z("seed.products.name"), Z("seed.products.price3"))
			]);
		},
		itemLabel: "product",
		itemLabelKey: "item.product",
		item: (e) => {
			let { x: t, y: n, n: r } = Bs(e, 3, 6, 31.5, 88, 348, 25, 332), i = [
				ys($(t, n, 25, 200)),
				vs($(t, n + 208, 25, 76), Z("seed.products.card", {
					name: Z("seed.products.name"),
					price: Z("seed.products.price1")
				}), { align: "center" }),
				bs($(t + 5, n + 292, 15, 40), Z("seed.products.buy"))
			];
			return i.forEach((e, t) => {
				e.mobileOrder = Vs(88, r, t);
			}), {
				blocks: i,
				bottom: n + 356
			};
		}
	}), e.sections.define("shop", {
		label: "Shop",
		labelKey: "preset.shop.label",
		group: "Shop",
		groupKey: "presetGroup.shop",
		hint: "Real product cards from a product collection, with a basket",
		hintKey: "preset.shop.hint",
		create: () => Hs("shop", "544px", Fs(Is("bg")), [
			vs($(6, 28, 50, 38), Z("seed.shop.title")),
			Os($(78, 88, 16, 48)),
			Ds($(6, 176, 88, 320))
		])
	}), e.sections.define("shop-hero", {
		label: "Shop hero",
		labelKey: "preset.shop-hero.label",
		group: "Shop",
		groupKey: "presetGroup.shop",
		hint: "Campaign band: big heading, subtext, CTA and a campaign image",
		hintKey: "preset.shop-hero.hint",
		create: () => {
			let e = [
				vs($(6, 48, 52, 96), Z("seed.shopHero.title")),
				vs($(6, 152, 40, 48), Z("seed.shopHero.sub")),
				bs($(6, 216, 17, 42), Z("seed.shopHero.cta")),
				ys($(62, 40, 32, 300))
			];
			return e.forEach((e, t) => {
				e.mobileOrder = Vs(48, t < 3 ? 0 : 1, t);
			}), Hs("shop-hero", "400px", {
				version: 1,
				layers: [
					Is("bg"),
					Ls(.8, .25, .28, .6),
					{
						type: "grain",
						version: 1,
						props: { opacity: .05 }
					}
				]
			}, e);
		}
	}), e.sections.define("shop-categories", {
		label: "Shop categories",
		labelKey: "preset.shop-categories.label",
		group: "Shop",
		groupKey: "presetGroup.shop",
		hint: "Four category tiles with image and name; set the link on the image in Properties",
		hintKey: "preset.shop-categories.hint",
		create: () => {
			let e = (e, t, n) => {
				let r = ys($(e, 88, 21, 170)), i = vs($(e, 266, 21, 34), Z("seed.shopCategories.tile", { name: n }), { align: "center" });
				return r.mobileOrder = Vs(88, t, 0), i.mobileOrder = Vs(88, t, 1), [r, i];
			}, t = Hs("shop-categories", "360px", Fs(Is("bg")), [
				vs($(6, 28, 60, 38), Z("seed.shopCategories.title")),
				...e(6, 0, Z("seed.shopCategories.cat1")),
				...e(29.5, 1, Z("seed.shopCategories.cat2")),
				...e(53, 2, Z("seed.shopCategories.cat3")),
				...e(76.5, 3, Z("seed.shopCategories.cat4"))
			]);
			return t.theme = "soft", t;
		},
		itemLabel: "category",
		itemLabelKey: "item.category",
		item: (e) => {
			let { x: t, y: n, n: r } = Bs(e, 4, 6, 23.5, 88, 220, 21, 212), i = ys($(t, n, 21, 170)), a = vs($(t, n + 178, 21, 34), Z("seed.shopCategories.tile", { name: Z("seed.shopCategories.newCat") }), { align: "center" });
			return i.mobileOrder = Vs(88, r, 0), a.mobileOrder = Vs(88, r, 1), {
				blocks: [i, a],
				bottom: n + 220
			};
		}
	}), e.sections.define("shop-trust", {
		label: "Shop trust",
		labelKey: "preset.shop-trust.label",
		group: "Shop",
		groupKey: "presetGroup.shop",
		hint: "Three trust points with icon and text (returns, help, safe ordering)",
		hintKey: "preset.shop-trust.hint",
		create: () => {
			let e = (e, t, n, r) => {
				let i = xs($(e + 10.5, 88, 4, 52), r, 44), a = vs($(e, 148, 25, 96), Z(n), { align: "center" });
				return i.mobileOrder = Vs(88, t, 0), a.mobileOrder = Vs(88, t, 1), [i, a];
			}, t = Hs("shop-trust", "300px", Fs(Is("bg")), [
				vs($(6, 28, 60, 38), Z("seed.shopTrust.title")),
				...e(6, 0, "seed.shopTrust.t1", "✓"),
				...e(37.5, 1, "seed.shopTrust.t2", "↻"),
				...e(69, 2, "seed.shopTrust.t3", "✉")
			]);
			return t.theme = "muted", t;
		},
		itemLabel: "card",
		itemLabelKey: "item.card",
		item: (e) => {
			let { x: t, y: n, n: r } = Bs(e, 3, 6, 31.5, 148, 216, 25, 156, -60), i = xs($(t + 10.5, n - 60, 4, 52), "✓", 44), a = vs($(t, n, 25, 96), Z("seed.shopTrust.newItem"), { align: "center" });
			return i.mobileOrder = Vs(88, r, 0), a.mobileOrder = Vs(88, r, 1), {
				blocks: [i, a],
				bottom: n + 104
			};
		}
	}), e.sections.define("shop-showcase", {
		label: "Shop feature",
		labelKey: "preset.shop-showcase.label",
		group: "Shop",
		groupKey: "presetGroup.shop",
		hint: "Statement band: big typography, text, CTA and an image on a deep surface",
		hintKey: "preset.shop-showcase.hint",
		create: () => {
			let e = [
				vs($(6, 56, 52, 100), Z("seed.shopShowcase.title")),
				vs($(6, 164, 42, 56), Z("seed.shopShowcase.text")),
				bs($(6, 236, 18, 42), Z("seed.shopShowcase.cta")),
				ys($(62, 48, 32, 240))
			];
			e.forEach((e, t) => {
				e.mobileOrder = Vs(56, t < 3 ? 0 : 1, t);
			});
			let t = Hs("shop-showcase", "340px", Fs(Is("bg")), e);
			return t.theme = "deep", t;
		}
	}), e.sections.define("checkout", {
		label: "Checkout",
		labelKey: "preset.checkout.label",
		group: "Shop",
		groupKey: "presetGroup.shop",
		hint: "Order form that sends the basket as an email or to an endpoint",
		hintKey: "preset.checkout.hint",
		create: () => Hs("checkout", "560px", Fs(Is("bg")), [vs($(6, 28, 50, 38), Z("seed.checkout.title")), ks($(25, 96, 50, 430))])
	}), e.sections.define("cta", {
		label: "CTA banner",
		labelKey: "preset.cta.label",
		group: "Highlight",
		groupKey: "presetGroup.highlight",
		hint: "Full width with one clear action",
		hintKey: "preset.cta.hint",
		create: () => Hs("cta", "280px", Fs(Is("surface"), Ls(.5, .5, .3, .7)), [
			vs($(20, 56, 60, 40), Z("seed.cta.title"), { align: "center" }),
			vs($(25, 104, 50, 26), Z("seed.cta.sub"), { align: "center" }),
			bs($(42, 148, 16, 42), Z("seed.join"))
		])
	}), e.sections.define("quote", {
		label: "Quote",
		labelKey: "preset.quote.label",
		group: "Highlight",
		groupKey: "presetGroup.highlight",
		hint: "Large quote with attribution",
		hintKey: "preset.quote.hint",
		create: () => Hs("quote", "300px", Fs(Is("bg")), [Ms($(20, 56, 60, 190), {
			text: Z("seed.quoteBlock.text"),
			attribution: Z("seed.quoteBlock.name"),
			role: Z("seed.quoteBlock.role")
		})])
	}), e.sections.define("stats", {
		label: "Statistics",
		labelKey: "preset.stats.label",
		group: "Highlight",
		groupKey: "presetGroup.highlight",
		hint: "Three big numbers with labels",
		hintKey: "preset.stats.hint",
		create: () => {
			let e = (e, t, n, r, i) => {
				let a = Ps($(e, 76, 25, 120), {
					value: n,
					suffix: r,
					label: i
				});
				return a.mobileOrder = Vs(76, t, 0), a;
			};
			return Hs("stats", "260px", Fs(Is("surface")), [
				e(6, 0, "120", "+", Z("seed.stats.l1")),
				e(37.5, 1, "25", "", Z("seed.stats.l2")),
				e(69, 2, "1981", "", Z("seed.stats.l3"))
			]);
		},
		itemLabel: "number",
		itemLabelKey: "item.number",
		item: (e) => {
			let { x: t, y: n, n: r } = Bs(e, 3, 6, 31.5, 76, 140, 25, 120), i = Ps($(t, n, 25, 120), {
				value: "42",
				label: Z("seed.stats.newLabel")
			});
			return i.mobileOrder = Vs(76, r, 0), {
				blocks: [i],
				bottom: n + 148
			};
		}
	}), e.sections.define("sponsors", {
		label: "Sponsors",
		labelKey: "preset.sponsors.label",
		group: "Highlight",
		groupKey: "presetGroup.highlight",
		hint: "Greyscale logo row with links",
		hintKey: "preset.sponsors.hint",
		create: () => {
			let e = (e) => ys($(e, 108, 18.5, 100), {
				alt: Z("seed.sponsors.alt"),
				fit: "contain",
				radius: null,
				saturate: 0
			});
			return Hs("sponsors", "280px", Fs(Is("bg")), [
				vs($(6, 28, 60, 36), Z("seed.sponsors.title")),
				e(5.5),
				e(29),
				e(52.5),
				e(76)
			]);
		},
		itemLabel: "logo",
		itemLabelKey: "item.logo",
		item: (e) => {
			let { x: t, y: n } = Bs(e, 4, 5.5, 23.5, 108, 124, 18.5, 100);
			return {
				blocks: [ys($(t, n, 18.5, 100), {
					alt: Z("seed.sponsors.alt"),
					fit: "contain",
					radius: null,
					saturate: 0
				})],
				bottom: n + 124
			};
		}
	}), e.sections.define("membership", {
		label: "Membership",
		labelKey: "preset.membership.label",
		group: "Highlight",
		groupKey: "presetGroup.highlight",
		hint: "Price tiers with benefits and a Vipps line",
		hintKey: "preset.membership.hint",
		create: () => Hs("membership", "500px", Fs(Is("surface")), [
			vs($(6, 28, 50, 38), Z("seed.membership.title")),
			vs($(14, 88, 32, 250), Z("seed.membership.tier1"), {
				align: "center",
				box: !0
			}),
			vs($(54, 88, 32, 250), Z("seed.membership.tier2"), {
				align: "center",
				box: !0
			}),
			bs($(42, 358, 16, 42), Z("seed.join")),
			vs($(25, 414, 50, 30), Z("seed.membership.vipps"), { align: "center" })
		])
	});
}
//#endregion
//#region ../template/assets/engine/0.7.4/templates-model.js
var Ws = [
	"section",
	"blocks",
	"page"
];
function Gs(e) {
	return Da(String(e ?? ""), "");
}
function Ks(e, t, { id: n, title: r }) {
	let i = structuredClone(e);
	i.meta = {
		...i.meta,
		id: n,
		title: r
	};
	for (let e of i.sections ?? []) {
		e.id = t("sec");
		for (let n of e.blocks ?? []) n.id = t("blk");
	}
	return i;
}
//#endregion
//#region ../template/assets/engine/0.7.4/collections-csv.js
var qs = [
	"id",
	"title",
	"date",
	"text",
	"href",
	"image",
	"price",
	"memberPrice",
	"badge",
	"sizes",
	"colors"
];
function Js(e) {
	let t = String(e ?? "");
	return /[",\n\r]/.test(t) ? `"${t.replaceAll("\"", "\"\"")}"` : t;
}
function Ys(e, t) {
	return t === "sizes" ? (e.sizes ?? []).join("|") : t === "colors" ? (e.colors ?? []).map((e) => e.name).join("|") : e[t] ?? "";
}
function Xs(e) {
	let t = [qs.join(",")];
	for (let n of e ?? []) t.push(qs.map((e) => Js(Ys(n, e))).join(","));
	return t.join("\n") + "\n";
}
function Zs(e) {
	let t = [], n = [], r = "", i = !1, a = String(e ?? "");
	for (let e = 0; e < a.length; e += 1) {
		let o = a[e];
		i ? o === "\"" && a[e + 1] === "\"" ? (r += "\"", e += 1) : o === "\"" ? i = !1 : r += o : o === "\"" ? i = !0 : o === "," ? (n.push(r), r = "") : o === "\n" || o === "\r" ? (o === "\r" && a[e + 1] === "\n" && (e += 1), n.push(r), t.push(n), n = [], r = "") : r += o;
	}
	return (r !== "" || n.length) && (n.push(r), t.push(n)), t.filter((e) => e.some((e) => e.trim() !== ""));
}
var Qs = (e) => String(e ?? "").split("|").map((e) => e.trim()).filter(Boolean);
function $s(e) {
	let t = Zs(e);
	if (t.length < 2) return null;
	let n = t[0].map((e) => e.trim());
	if (!n.includes("title")) return null;
	let r = [], i = 0;
	for (let e of t.slice(1)) {
		let t = {};
		n.forEach((n, r) => {
			t[n] = e[r] ?? "";
		});
		let a = String(t.title ?? "").trim();
		if (!a) {
			i += 1;
			continue;
		}
		let o = {
			id: String(t.id ?? "").trim(),
			title: a
		};
		for (let e of [
			"date",
			"text",
			"href",
			"image",
			"badge"
		]) {
			let n = String(t[e] ?? "").trim();
			n && (o[e] = n);
		}
		for (let e of ["price", "memberPrice"]) {
			let n = String(t[e] ?? "").trim();
			if (n === "") continue;
			let r = Number(n.replace(",", "."));
			Number.isFinite(r) && r >= 0 && (o[e] = r);
		}
		let s = Qs(t.sizes);
		s.length && (o.sizes = s);
		let c = Qs(t.colors);
		c.length && (o.colors = c.map((e) => ({ name: e }))), r.push(o);
	}
	return {
		entries: r,
		skipped: i
	};
}
//#endregion
//#region ../template/assets/engine/0.7.4/feeds.js
function ec(e) {
	return String(e ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&apos;");
}
function tc(e, t) {
	let n = String(t ?? "").replace(/\/+$/, "");
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${(e ?? []).filter((e) => !e.noindex).map((e) => `  <url><loc>${ec(n + (e.path === "/" ? "/" : e.path))}</loc></url>`).join("\n")}\n</urlset>\n`;
}
function nc(e) {
	return `User-agent: *\nDisallow: /admin/\n\nSitemap: ${String(e ?? "").replace(/\/+$/, "")}/sitemap.xml\n`;
}
var rc = [
	"news",
	"notices",
	"publications"
];
function ic(e) {
	let t = String(e.origin ?? "").replace(/\/+$/, ""), n = (e.items ?? []).map((n) => {
		let r = n.href ? new URL(n.href, t + "/").href : t + "/", i = n.date ? new Date(n.date) : null, a = i && !Number.isNaN(i.getTime()) ? `\n      <pubDate>${i.toUTCString()}</pubDate>` : "", o = n.text ? `\n      <description>${ec(n.text)}</description>` : "";
		return `    <item>\n      <title>${ec(n.title)}</title>\n      <link>${ec(r)}</link>\n      <guid isPermaLink="false">${ec(`${e.path}#${n.id ?? n.title}`)}</guid>${o}${a}\n    </item>`;
	}).join("\n");
	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${ec(e.title)}</title>\n    <link>${ec(t + "/")}</link>\n    <description>${ec(e.description ?? e.title)}</description>\n${n}${n ? "\n" : ""}  </channel>\n</rss>\n`;
}
//#endregion
//#region ../template/assets/engine/0.7.4/preset-thumb.js
var ac = /^#[0-9a-fA-F]{3,8}$/, oc = /^[a-z][a-z0-9-]*$/, sc = "#171c26", cc = "#232a38", lc = "#98a1b3", uc = "#7c5cff", dc = (e, t) => `var(--urd-color-${e}, ${t})`;
function fc(e, t) {
	return typeof e == "string" ? ac.test(e) ? e : oc.test(e) ? dc(e, t) : t : t;
}
function pc(e, t = 800) {
	let n = Number.parseFloat(e);
	return !Number.isFinite(n) || n <= 0 ? 400 : typeof e == "string" && e.trim().endsWith("vh") ? n / 100 * t : n;
}
var mc = (e) => Math.round(e * 10) / 10, hc = (e, t, n) => Math.min(n, Math.max(t, e)), gc = (e, t, n, r, i, a = "") => `<rect x="${mc(e)}" y="${mc(t)}" width="${mc(Math.max(n, 1))}" height="${mc(Math.max(r, 1))}" fill="${i}"${a}/>`;
function _c(e) {
	if (e?.theme) return e.theme === "inverse" || e.theme === "deep" ? dc("text", lc) : e.theme === "accent" ? dc("accent", uc) : dc("surface", cc);
	for (let t of e?.background?.layers ?? []) {
		if (t.type === "color") return fc(t.props?.value, sc);
		if (t.type === "gradient") return fc(Array.isArray(t.props?.stops) ? t.props.stops[0] : null, sc);
	}
	return dc("bg", sc);
}
function vc(e, t, n, r, i) {
	let a = /<h[1-3]/.test(String(i?.html ?? "")), o = i?.align === "center", s = dc("text", lc), c = [];
	i?.box && c.push(gc(e, t, n, r, dc("surface", cc), " rx=\"1.5\""));
	let l = i?.box ? Math.min(2, n * .06) : 0, u = e + l, d = n - l * 2, f = [
		.72,
		.9,
		.5
	], p = [
		a ? 4 : 2.2,
		2.2,
		2.2
	], m = hc(r / (p[0] + p[1] + p[2] + 4.8 + 2), 0, 1), h = t + l + Math.min(1, r * .08);
	for (let e = 0; e < 3; e++) {
		let n = Math.min(Math.max(e === 0 ? a ? 1.4 : 1 : .8, p[e] * m), Math.max(r, 1));
		if (e > 0 && h + n > t + r - l) break;
		let i = d * f[e], g = o ? u + (d - i) / 2 : u;
		c.push(gc(g, h, i, n, s, ` opacity="${e === 0 ? .8 : .4}" rx="${mc(Math.min(1, n / 2))}"`)), h += n + Math.max(.8, 2.4 * m);
	}
	return c.join("");
}
function yc(e, t, n, r, i = !1) {
	let a = dc("text", lc), o = [];
	i ? (o.push(gc(e, t, n, r, dc("surface", cc), " rx=\"1.5\" opacity=\"0.35\"")), o.push(`<rect x="${mc(e + .4)}" y="${mc(t + .4)}" width="${mc(Math.max(n - .8, 1))}" height="${mc(Math.max(r - .8, 1))}" fill="none" stroke="${a}" stroke-width="0.6" stroke-dasharray="2 2" opacity="0.35" rx="1.5"/>`)) : o.push(gc(e, t, n, r, dc("surface", cc), " rx=\"1.5\""));
	let s = i ? .15 : .4, c = (t) => mc(e + n * t), l = (e) => mc(t + r * e);
	return o.push(`<polygon points="${c(.08)},${l(.9)} ${c(.42)},${l(.38)} ${c(.62)},${l(.68)} ${c(.75)},${l(.5)} ${c(.92)},${l(.9)}" fill="${a}" opacity="${s}"/>`), o.push(`<circle cx="${c(.28)}" cy="${l(.26)}" r="${mc(Math.max(1, Math.min(n, r) * .1))}" fill="${a}" opacity="${mc(s + .1)}"/>`), o.join("");
}
function bc(e, t, n, r, i) {
	let a = !(Array.isArray(i?.images) && i.images.length), o = Math.max(1, n * .03), s = (n - o * 2) / 3, c = [];
	for (let n = 0; n < 3; n++) c.push(yc(e + n * (s + o), t, s, r, a));
	return c.join("");
}
function xc(e, t, n, r) {
	let i = Math.max(1, n * .03), a = (n - i * 2) / 3, o = [];
	for (let n = 0; n < 3; n++) {
		let s = e + n * (a + i);
		o.push(gc(s, t, a, r * .55, dc("surface", cc), " rx=\"1.5\"")), o.push(gc(s, t + r * .62, a * .8, 2, dc("text", lc), " opacity=\"0.5\" rx=\"1\""));
	}
	return o.join("");
}
function Sc(e, t, n, r, i) {
	let a = fc(i?.color, uc), o = i?.kind;
	return o === "circle" ? `<ellipse cx="${mc(e + n / 2)}" cy="${mc(t + r / 2)}" rx="${mc(Math.max(n / 2, 1))}" ry="${mc(Math.max(r / 2, 1))}" fill="${a}" opacity="0.8"/>` : o === "triangle" ? `<polygon points="${mc(e)},${mc(t + r)} ${mc(e + n / 2)},${mc(t)} ${mc(e + n)},${mc(t + r)}" fill="${a}" opacity="0.8"/>` : o === "line" || o === "arrow" ? gc(e, t + r / 2 - .75, n, 1.5, a, " opacity=\"0.85\" rx=\"0.75\"") : gc(e, t, n, r, a, " opacity=\"0.8\" rx=\"1\"");
}
function Cc(e, t, n, r, i, a) {
	if (e === "text") return vc(t, n, r, i, a);
	if (e === "image") return yc(t, n, r, i, !a?.src);
	if (e === "gallery") return bc(t, n, r, i, a);
	if (e === "collection") return xc(t, n, r, i);
	if (e === "faq") {
		let e = hc(Math.floor(i / 5), 2, 3), a = Math.max(.6, i * .04), o = (i - a * (e - 1)) / e, s = [];
		for (let i = 0; i < e; i += 1) {
			let e = n + i * (o + a);
			s.push(gc(t, e, r, o, dc("surface", cc), " rx=\"1\"")), s.push(gc(t + r * .06, e + o / 2 - .7, r * .55, 1.4, dc("text", lc), " opacity=\"0.5\" rx=\"0.7\"")), s.push(`<circle cx="${mc(t + r * .92)}" cy="${mc(e + o / 2)}" r="0.9" fill="${dc("text", lc)}" opacity="0.4"/>`);
		}
		return s.join("");
	}
	if (e === "shape") return Sc(t, n, r, i, a);
	if (e === "button") return gc(t, n, r, i, dc("accent", uc), ` rx="${mc(Math.min(i / 2, 4))}"`);
	if (e === "icon") {
		let e = Math.max(1.2, Math.min(r, i) / 2);
		return `<circle cx="${mc(t + r / 2)}" cy="${mc(n + i / 2)}" r="${mc(e)}" fill="${dc("accent", uc)}" opacity="0.85"/>`;
	}
	if (e === "video") {
		let e = [gc(t, n, r, i, dc("surface", cc), " rx=\"1.5\"")], a = t + r / 2, o = n + i / 2, s = Math.max(1.5, Math.min(r, i) * .22);
		return e.push(`<polygon points="${mc(a - s / 2)},${mc(o - s)} ${mc(a - s / 2)},${mc(o + s)} ${mc(a + s)},${mc(o)}" fill="${dc("text", lc)}" opacity="0.6"/>`), e.join("");
	}
	if (e === "timeline") {
		let e = [gc(t + 1, n, 1.4, i, dc("accent", uc), " opacity=\"0.7\" rx=\"0.7\"")];
		for (let a = 0; a < 3; a += 1) {
			let o = n + i * (.18 + a * .32);
			e.push(`<circle cx="${mc(t + 1.7)}" cy="${mc(o)}" r="1.6" fill="${dc("accent", uc)}"/>`), e.push(gc(t + 5, o - 1, r * .5, 2, dc("text", lc), " opacity=\"0.5\" rx=\"1\""));
		}
		return e.join("");
	}
	if (e === "quote") return [
		`<text x="${mc(t + r / 2)}" y="${mc(n + i * .34)}" text-anchor="middle" font-size="${mc(Math.min(r, i) * .5)}" font-family="Georgia, serif" fill="${dc("accent", uc)}">“</text>`,
		gc(t + r * .15, n + i * .48, r * .7, 2, dc("text", lc), " opacity=\"0.6\" rx=\"1\""),
		gc(t + r * .25, n + i * .62, r * .5, 2, dc("text", lc), " opacity=\"0.6\" rx=\"1\""),
		gc(t + r * .35, n + i * .82, r * .3, 1.6, dc("text", lc), " opacity=\"0.35\" rx=\"0.8\"")
	].join("");
	if (e === "stats") return [gc(t + r * .28, n + i * .15, r * .44, i * .42, dc("accent", uc), " opacity=\"0.85\" rx=\"1\""), gc(t + r * .32, n + i * .72, r * .36, 1.6, dc("text", lc), " opacity=\"0.4\" rx=\"0.8\"")].join("");
	if (e === "table") {
		let e = Math.max(1.6, i * .22), a = [gc(t, n, r, e, dc("accent", uc), " opacity=\"0.5\" rx=\"0.8\"")], o = hc(Math.floor((i - e) / 3.2), 1, 3);
		for (let s = 0; s < o; s += 1) a.push(gc(t, n + e + 1 + s * ((i - e - 1) / o), r, 1, dc("text", lc), " opacity=\"0.3\""));
		return a.push(gc(t + r * .33, n, .6, i, dc("text", lc), " opacity=\"0.2\"")), a.push(gc(t + r * .66, n, .6, i, dc("text", lc), " opacity=\"0.2\"")), a.join("");
	}
	if (e === "share") {
		let e = Math.max(1.2, Math.min(i / 2, r / 9)), a = [];
		for (let r = 0; r < 4; r += 1) a.push(`<circle cx="${mc(t + e + r * (e * 2 + 1.5))}" cy="${mc(n + i / 2)}" r="${mc(e)}" fill="${dc("accent", uc)}" opacity="0.8"/>`);
		return a.join("");
	}
	if (e === "countdown") {
		let e = Math.max(.8, r * .03), a = (r - e * 3) / 4, o = [];
		for (let r = 0; r < 4; r += 1) {
			let s = t + r * (a + e);
			o.push(gc(s, n, a, i, dc("surface", cc), " rx=\"1\"")), o.push(gc(s + a * .25, n + i * .2, a * .5, i * .35, dc("accent", uc), " opacity=\"0.85\" rx=\"0.8\""));
		}
		return o.join("");
	}
	if (e === "audio") {
		let e = [gc(t, n, r, i, dc("surface", cc), " rx=\"1.5\"")], a = n + i / 2, o = Math.max(1.2, i * .28);
		return e.push(`<polygon points="${mc(t + r * .06)},${mc(a - o)} ${mc(t + r * .06)},${mc(a + o)} ${mc(t + r * .06 + o * 1.4)},${mc(a)}" fill="${dc("accent", uc)}" opacity="0.85"/>`), e.push(gc(t + r * .2, a - .6, r * .7, 1.2, dc("text", lc), " opacity=\"0.35\" rx=\"0.6\"")), e.join("");
	}
	if (e === "product") {
		let e = Math.max(.8, r * .03), a = (r - e * 2) / 3, o = [];
		for (let r = 0; r < 3; r += 1) {
			let s = t + r * (a + e);
			o.push(gc(s, n, a, i, dc("surface", cc), " rx=\"1\"")), o.push(gc(s + a * .08, n + i * .06, a * .84, i * .42, dc("text", lc), " opacity=\"0.15\" rx=\"0.8\"")), o.push(gc(s + a * .08, n + i * .56, a * .6, 1.4, dc("text", lc), " opacity=\"0.5\" rx=\"0.7\"")), o.push(gc(s + a * .08, n + i * .72, a * .35, 1.4, dc("accent", uc), " opacity=\"0.85\" rx=\"0.7\"")), o.push(gc(s + a * .08, n + i * .84, a * .84, i * .1, dc("accent", uc), " opacity=\"0.6\" rx=\"1\""));
		}
		return o.join("");
	}
	if (e === "cart") {
		let e = Math.max(1.5, Math.min(r, i) / 2.4), a = t + r / 2, o = n + i / 2;
		return [
			`<circle cx="${mc(a)}" cy="${mc(o)}" r="${mc(e)}" fill="${dc("surface", cc)}"/>`,
			gc(a - e * .5, o - e * .25, e, e * .55, dc("text", lc), " opacity=\"0.5\" rx=\"0.4\""),
			`<circle cx="${mc(a + e * .75)}" cy="${mc(o - e * .75)}" r="${mc(Math.max(.9, e * .35))}" fill="${dc("accent", uc)}"/>`
		].join("");
	}
	return e === "checkout" ? [
		gc(t, n, r * .7, 1.2, dc("text", lc), " opacity=\"0.5\" rx=\"0.6\""),
		gc(t, n + i * .12, r * .5, 1.2, dc("text", lc), " opacity=\"0.35\" rx=\"0.6\""),
		gc(t, n + i * .3, r, i * .14, dc("surface", cc), " rx=\"1\""),
		gc(t, n + i * .5, r, i * .14, dc("surface", cc), " rx=\"1\""),
		gc(t, n + i * .78, r * .45, i * .16, dc("accent", uc), " opacity=\"0.85\" rx=\"1.2\"")
	].join("") : gc(t, n, r, i, dc("surface", cc), " rx=\"1.5\"");
}
function wc(e, t, n) {
	let r = Array.isArray(e?.blocks) ? e.blocks : [], i = r.map((e) => (e.frames?.desktop?.y ?? 0) + (e.frames?.desktop?.h ?? 0)), a = n / Math.max(pc(e?.size?.minHeight), i.length ? Math.max(...i) + 16 : 0), o = [gc(0, 0, t, n, _c(e))];
	for (let r of e?.background?.layers ?? []) {
		if (r.type !== "glow") continue;
		let e = r.props ?? {};
		o.push(`<circle cx="${mc(hc(e.x ?? .5, 0, 1) * t)}" cy="${mc(hc(e.y ?? .3, 0, 1) * n)}" r="${mc(t * hc(e.radius ?? .5, .1, 1) * .5)}" fill="${fc(e.color, uc)}" opacity="${mc(hc(e.opacity ?? .3, 0, .5))}"/>`);
	}
	let s = t * .06, c = t - s * 2;
	for (let e of r) {
		let r = e.frames?.desktop;
		if (!r) continue;
		let i = hc(s + (r.x ?? 0) * (c / 100), 0, t - 2), l = hc((r.y ?? 0) * a, 0, n - 2), u = hc((r.w ?? 10) * (c / 100), 2, t - i), d = hc((r.h ?? 20) * a, 2, n - l);
		o.push(Cc(e.type, i, l, u, d, e.props));
	}
	return o.join("");
}
function Tc(e, { w: t = 96, h: n = 116, max: r = 6 } = {}) {
	let i = (Array.isArray(e?.sections) ? e.sections : []).slice(0, r);
	if (!i.length) return `<svg viewBox="0 0 ${t} ${n}" width="${t}" height="${n}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${gc(0, 0, t, n, dc("bg", sc))}</svg>`;
	let a = i.map((e) => hc(pc(e?.size?.minHeight), 160, 900)), o = a.reduce((e, t) => e + t, 0), s = n - 1 * (i.length - 1), c = [], l = 0;
	for (let e = 0; e < i.length; e += 1) {
		let n = Math.max(6, a[e] / o * s);
		c.push(`<g transform="translate(0 ${mc(l)})">${wc(i[e], t, n)}</g>`), l += n + 1;
	}
	return `<svg viewBox="0 0 ${t} ${n}" width="${t}" height="${n}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${c.join("")}</svg>`;
}
//#endregion
//#region ../template/assets/engine/0.7.4/page-presets.js
var Ec = /* @__PURE__ */ new Map();
Us({ sections: { define: (e, t) => Ec.set(e, t) } });
var Dc = [
	{
		id: "landing",
		labelKey: "pageTemplate.landing",
		sections: [
			"hero",
			"feature-cards",
			"stats",
			"quote",
			"cta"
		]
	},
	{
		id: "about",
		labelKey: "pageTemplate.about",
		sections: [
			"hero-centered",
			"team",
			"timeline",
			"sponsors",
			"cta"
		]
	},
	{
		id: "contact",
		labelKey: "pageTemplate.contact",
		sections: [
			"hero-centered",
			"contact",
			"faq"
		]
	},
	{
		id: "portfolio",
		labelKey: "pageTemplate.portfolio",
		sections: [
			"hero-centered",
			"gallery",
			"quote",
			"cta"
		]
	},
	{
		id: "event",
		labelKey: "pageTemplate.event",
		sections: [
			"lead-story",
			"events",
			"steps",
			"faq",
			"cta"
		]
	},
	{
		id: "shop",
		labelKey: "pageTemplate.shop",
		sections: [
			"shop-hero",
			"shop",
			"faq",
			"cta"
		]
	},
	{
		id: "shop-front",
		labelKey: "pageTemplate.shopFront",
		sections: [
			"shop-hero",
			"shop",
			"shop-categories",
			"shop-showcase",
			"shop-trust",
			"cta"
		]
	},
	{
		id: "checkout",
		labelKey: "pageTemplate.checkout",
		sections: ["checkout", "contact"]
	}
];
function Oc(e, { pageId: t, title: n }) {
	let r = Dc.find((t) => t.id === e);
	return r ? {
		schemaVersion: 4,
		meta: {
			id: t,
			title: n
		},
		sections: r.sections.map((e) => Ec.get(e).create())
	} : null;
}
//#endregion
//#region ../template/assets/engine/0.7.4/palette-search.js
function kc(e) {
	return String(e ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}
function Ac(e, t) {
	let n = kc(t).trim(), r = kc(e);
	return n ? r.startsWith(n) ? 0 : r.split(/[^a-z0-9]+/).some((e) => e.startsWith(n)) ? 1 : r.includes(n) ? 2 : -1 : 2;
}
function jc(e, t, n) {
	return e.map((e, r) => ({
		item: e,
		i: r,
		rank: Ac(n(e), t)
	})).filter((e) => e.rank >= 0).sort((e, t) => e.rank - t.rank || e.i - t.i).map((e) => e.item);
}
//#endregion
//#region ../template/assets/engine/0.7.4/theme.js
function Mc(e, t, n) {
	return t === "light" || t === "dark" ? t : n ? "dark" : "light";
}
function Nc(e, t) {
	let n = e.tokens || {}, r = e.scheme === "dark" ? "dark" : "light";
	if (!e.alt?.tokens || t === r) return n;
	let i = {};
	for (let t of /* @__PURE__ */ new Set([...Object.keys(n), ...Object.keys(e.alt.tokens)])) i[t] = {
		...n[t],
		...e.alt.tokens[t]
	};
	return i;
}
var Pc = /^[a-zA-Z0-9#%.,()'"\s+\-*/]+$/;
function Fc(e) {
	return typeof e == "string" && Pc.test(e) && !/url\(|\/\*|\*\/|expression/i.test(e);
}
function Ic(e) {
	let t = e.tokens || {}, n = Nc(e, "light"), r = Nc(e, "dark"), i = e.scheme === "dark" ? "dark" : "light", a = [], o = [], s = [], c = /* @__PURE__ */ new Set([
		...Object.keys(t),
		...Object.keys(n),
		...Object.keys(r)
	]);
	for (let e of c) {
		let i = e === "color", c = /* @__PURE__ */ new Set([
			...Object.keys(t[e] || {}),
			...Object.keys(n[e] || {}),
			...Object.keys(r[e] || {})
		]);
		for (let l of c) {
			let c = t[e]?.[l], u = n[e]?.[l], d = r[e]?.[l];
			Fc(c) && (a.push(`  --urd-${e}-${l}: ${c};`), i && a.push(`  --urd-base-${l}: ${c};`)), u !== d && (i && Fc(u) && Fc(d) ? o.push({
				name: l,
				lv: u,
				dv: d
			}) : !i && Fc(u) && Fc(d) && s.push({
				group: e,
				name: l,
				lv: u,
				dv: d
			}));
		}
	}
	let l = o.length > 0 || s.length > 0, u = ![
		t,
		n,
		r
	].some((e) => Fc(e.color?.["accent-text"])) && Fc(t.color?.accent);
	u && Fc(t.color?.bg) && (a.push(`  --urd-color-accent-text: ${t.color.bg};`), a.push(`  --urd-base-accent-text: ${t.color.bg};`));
	let d = `:root {\n  color-scheme: ${l ? "light dark" : i};\n${a.join("\n")}\n}\n`;
	if (u && (d += "@supports (color: contrast-color(#000)) {\n  :root {\n    --urd-color-accent-text: contrast-color(var(--urd-color-accent));\n    --urd-base-accent-text: contrast-color(var(--urd-base-accent));\n  }\n}\n"), !l) return d;
	let f = [];
	for (let e of o) {
		let t = `light-dark(${e.lv}, ${e.dv})`;
		f.push(`    --urd-color-${e.name}: ${t};`), f.push(`    --urd-base-${e.name}: ${t};`);
	}
	if (d += "@supports (color: light-dark(#000, #fff)) {\n", f.length && (d += `  :root {\n${f.join("\n")}\n  }\n`), d += "  :root[data-urd-theme=\"light\"] { color-scheme: light; }\n", d += "  :root[data-urd-theme=\"dark\"] { color-scheme: dark; }\n", s.length) {
		let e = (e) => s.map((t) => `    --urd-${t.group}-${t.name}: ${e(t)};`).join("\n");
		d += `  @media (prefers-color-scheme: dark) {\n    :root {\n${s.map((e) => `      --urd-${e.group}-${e.name}: ${e.dv};`).join("\n")}\n    }\n  }\n`, d += `  :root[data-urd-theme="light"] {\n${e((e) => e.lv)}\n  }\n`, d += `  :root[data-urd-theme="dark"] {\n${e((e) => e.dv)}\n  }\n`;
	}
	return d += "}\n", d;
}
function Lc(e) {
	return /^[a-z][a-z0-9-]*$/.test(e) ? `var(--urd-color-${e})` : e;
}
var Rc = {
	surface: {
		"--urd-color-bg": "var(--urd-base-surface)",
		"--urd-color-surface": "color-mix(in srgb, var(--urd-base-text) 7%, var(--urd-base-surface))"
	},
	accent: {
		"--urd-color-bg": "var(--urd-base-accent)",
		"--urd-color-surface": "color-mix(in srgb, var(--urd-base-accent) 82%, #000)",
		"--urd-color-text": "var(--urd-base-accent-text)",
		"--urd-color-accent": "var(--urd-base-accent-text)",
		"--urd-color-accent-text": "var(--urd-base-accent)"
	},
	inverse: {
		"--urd-color-bg": "var(--urd-base-text)",
		"--urd-color-surface": "color-mix(in srgb, var(--urd-base-text) 78%, var(--urd-base-bg))",
		"--urd-color-text": "var(--urd-base-bg)"
	},
	soft: {
		"--urd-color-bg": "color-mix(in srgb, var(--urd-base-accent) 12%, var(--urd-base-bg))",
		"--urd-color-surface": "color-mix(in srgb, var(--urd-base-accent) 8%, var(--urd-base-surface))"
	},
	muted: {
		"--urd-color-bg": "color-mix(in srgb, var(--urd-base-text) 5%, var(--urd-base-bg))",
		"--urd-color-surface": "color-mix(in srgb, var(--urd-base-text) 10%, var(--urd-base-bg))",
		"--urd-color-text": "color-mix(in srgb, var(--urd-base-text) 82%, var(--urd-base-bg))"
	},
	deep: {
		"--urd-color-bg": "color-mix(in srgb, var(--urd-base-accent) 30%, var(--urd-base-text))",
		"--urd-color-surface": "color-mix(in srgb, var(--urd-base-accent) 40%, var(--urd-base-text))",
		"--urd-color-text": "var(--urd-base-bg)"
	},
	highlighted: { "--urd-color-surface": "color-mix(in srgb, var(--urd-base-accent) 14%, var(--urd-base-surface))" }
}, zc = {
	surface: "sectionTheme.surface",
	accent: "sectionTheme.accent",
	inverse: "sectionTheme.inverse",
	soft: "sectionTheme.soft",
	muted: "sectionTheme.muted",
	deep: "sectionTheme.deep",
	highlighted: "sectionTheme.highlighted"
};
[...new Set(Object.values(Rc).flatMap(Object.keys))];
function Bc(e) {
	return Rc[e] ?? {};
}
function Vc(e) {
	let t = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(typeof e == "string" ? e.trim() : "");
	if (!t) return null;
	let n = t[1];
	n.length === 3 && (n = n.split("").map((e) => e + e).join(""));
	let r = (e) => {
		let t = parseInt(e, 16) / 255;
		return t <= .03928 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
	};
	return .2126 * r(n.slice(0, 2)) + .7152 * r(n.slice(2, 4)) + .0722 * r(n.slice(4, 6));
}
function Hc(e, t) {
	let n = Vc(e), r = Vc(t);
	return n == null || r == null ? null : (Math.max(n, r) + .05) / (Math.min(n, r) + .05);
}
//#endregion
//#region ../template/assets/engine/0.7.4/backgrounds/color.js
var Uc = {
	version: 1,
	label: "Colour",
	labelKey: "bgLayer.color",
	defaults: () => ({
		value: "bg",
		opacity: 1
	}),
	migrations: {},
	render(e, t) {
		e.style.background = Lc(t.value), e.style.opacity = String(t.opacity ?? 1);
	}
}, Wc = {
	linear: [
		"pan",
		"pan-loop",
		"rotate"
	],
	radial: ["pulse", "orbit"]
};
function Gc(e) {
	let t = Array.isArray(e) && e.length ? e : [{ color: "#0b0e14" }, { color: "#1a1030" }], n = t.map((e) => Math.max(0, Number(e?.share) || 0)), r = n.reduce((e, t) => e + t, 0), i = r <= 0, a = i ? t.length : r, o = 0;
	return t.map((e, t) => {
		let r = i ? 1 : n[t], s = (o + r / 2) / a * 100;
		return o += r, {
			color: e?.color ?? "#0b0e14",
			at: Math.round(s * 100) / 100
		};
	});
}
function Kc(e) {
	let t = (e) => Math.round(e * 100) / 100, n = e[0]?.at ?? 0;
	return [...e.map((e) => ({
		color: e.color,
		at: t(e.at - n)
	})), {
		color: e[0]?.color ?? "#0b0e14",
		at: 100
	}];
}
function qc(e, t, n, r = .5) {
	let i = n % 360 * Math.PI / 180, a = (e) => Math.round(e * 100) / 100 || 0, o = (Math.abs(e * Math.sin(i)) + Math.abs(t * Math.cos(i))) / (1 - Math.min(Math.max(r, 0), .9));
	return {
		period: a(o),
		dx: a(Math.sin(i) * o),
		dy: a(-Math.cos(i) * o)
	};
}
function Jc(e, t, n) {
	return `repeating-linear-gradient(${t}deg, ${e.map((e) => `${Lc(e.color)} ${Math.round(e.at / 100 * n * 100) / 100}px`).join(", ")})`;
}
function Yc(e) {
	let t = e.kind === "radial" ? "radial" : "linear", n = (Wc[t] ?? []).includes(e.animation) ? e.animation : null, r = Gc(e.stops), i = r.map((e) => `${Lc(e.color)} ${e.at}%`).join(", "), a = {}, o;
	if (t === "radial") {
		let t = Math.round((e.x ?? .5) * 100), r = Math.round((e.y ?? .5) * 100);
		if (o = `radial-gradient(circle at ${t}% ${r}%, ${i})`, n === "orbit") return {
			background: null,
			className: null,
			styles: a,
			runner: {
				className: "urd-bg-orbit-runner",
				background: o,
				left: `${-t}%`,
				top: `${-r}%`
			}
		};
		n === "pulse" && (a["--urd-bg-op"] = String(e.opacity ?? 1));
	} else {
		let t = e.angle ?? 160;
		if (n === "pan-loop") {
			let n = (e.stops ?? []).map((e) => Math.max(0, Number(e?.share) || 0)), i = n.reduce((e, t) => e + t, 0), o = i > 0 ? Math.max(...n) / i : 1 / r.length;
			return {
				background: null,
				className: null,
				styles: a,
				loop: {
					angle: t,
					stops: Kc(r),
					maxShare: o
				}
			};
		}
		if (o = n === "rotate" ? `linear-gradient(calc(var(--urd-grad-spin, 0deg) + ${t}deg), ${i})` : `linear-gradient(${t}deg, ${i})`, n === "pan") return {
			background: null,
			className: null,
			styles: a,
			runner: {
				className: "urd-bg-pan-runner",
				background: o
			}
		};
	}
	return {
		background: o,
		className: n ? {
			rotate: "urd-bg-rotate",
			pulse: "urd-bg-pulse"
		}[n] ?? null : null,
		styles: a
	};
}
var Xc = /* @__PURE__ */ new Set(), Zc = !1;
function Qc(e) {
	Xc.add(e), !(Zc || typeof window > "u") && (Zc = !0, window.addEventListener("resize", () => {
		for (let e of [...Xc]) e() || Xc.delete(e);
	}));
}
var $c = !1;
function el() {
	if (!$c) {
		$c = !0;
		try {
			CSS.registerProperty({
				name: "--urd-grad-spin",
				syntax: "<angle>",
				inherits: !1,
				initialValue: "0deg"
			});
		} catch {}
	}
}
var tl = {
	version: 1,
	label: "Gradient",
	labelKey: "bgLayer.gradient",
	defaults: () => ({
		kind: "linear",
		stops: [{
			color: "#0b0e14",
			share: 50
		}, {
			color: "#1a1030",
			share: 50
		}],
		angle: 160,
		x: .5,
		y: .5,
		animation: "none",
		opacity: 1
	}),
	migrations: {},
	render(e, t) {
		let n = Yc(t);
		e.style.opacity = String(t.opacity ?? 1);
		for (let [t, r] of Object.entries(n.styles)) e.style.setProperty(t, r);
		if (n.loop) {
			e.classList.add("urd-bg-loop-host");
			let t = document.createElement("div");
			t.className = "urd-bg-loop-runner", e.appendChild(t);
			let r = () => {
				if (!e.isConnected) return !1;
				let r = e.clientWidth, i = e.clientHeight;
				if (r && i) {
					let e = qc(r, i, n.loop.angle, n.loop.maxShare);
					t.style.inset = `${-Math.ceil(e.period)}px`, t.style.background = Jc(n.loop.stops, n.loop.angle, e.period), t.style.setProperty("--urd-loop-dx", `${e.dx}px`), t.style.setProperty("--urd-loop-dy", `${e.dy}px`);
				}
				return !0;
			};
			requestAnimationFrame(r), Qc(r);
			return;
		}
		if (n.runner) {
			e.classList.add("urd-bg-loop-host");
			let t = document.createElement("div");
			t.className = n.runner.className, t.style.background = n.runner.background, n.runner.left != null && (t.style.left = n.runner.left), n.runner.top != null && (t.style.top = n.runner.top), e.appendChild(t);
			return;
		}
		e.style.background = n.background, n.className && (e.classList.add(n.className), n.className === "urd-bg-rotate" && el());
	}
}, nl = {
	version: 1,
	label: "Glow",
	labelKey: "bgLayer.glow",
	defaults: () => ({
		x: .5,
		y: .3,
		color: "accent",
		radius: .5,
		opacity: .35
	}),
	migrations: {},
	render(e, t) {
		let n = Lc(t.color), r = t.x ?? .5, i = t.y ?? .3, a = t.radius ?? .5;
		e.style.background = `radial-gradient(circle at ${r * 100}% ${i * 100}%, ${n} 0%, transparent ${a * 100}%)`, e.style.opacity = String(t.opacity ?? .35);
	}
}, rl = "url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22128%22%20height%3D%22128%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.9%22%20numOctaves%3D%222%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22128%22%20height%3D%22128%22%20filter%3D%22url(%23n)%22%2F%3E%3C%2Fsvg%3E\")", il = {
	version: 1,
	label: "Grain",
	labelKey: "bgLayer.grain",
	defaults: () => ({ opacity: .06 }),
	migrations: {},
	render(e, t) {
		e.style.backgroundImage = rl, e.style.backgroundRepeat = "repeat", e.style.opacity = String(t.opacity ?? .06);
	}
}, al = /^(?:data:image\/[\w.+-]+;base64,[A-Za-z0-9+/=]+|\/(?!\/)[\w%./-]*)$/;
function ol(e) {
	return typeof e == "string" && al.test(e);
}
//#endregion
//#region ../template/assets/engine/0.7.4/backgrounds/image.js
var sl = .4;
function cl(e, t) {
	return `${(e ?? .5) * 100}% ${(t ?? .5) * 100}%`;
}
function ll(e, t) {
	return e === "contain" ? "contain" : e === "cover" ? "cover" : `${Math.max(0, t ?? 1) * 100}%`;
}
function ul(e) {
	let t = "-9999px";
	return e === "up" ? `inset(${t} 0 0 0)` : e === "down" ? `inset(0 0 ${t} 0)` : e === "both" ? `inset(${t} 0 ${t} 0)` : "inset(0)";
}
function dl(e, t, n, r = .18) {
	let i = Math.max(0, Math.min(1, n)) * sl * t;
	return Math.round(Math.min(i, r * e));
}
function fl(e, t, n, r, i) {
	let a = e + t / 2, o = (n / 2 - a) * Math.max(0, Math.min(1, r)) * sl, s = i ?? dl(t, n, r);
	return Math.max(-s, Math.min(s, o)) || 0;
}
var pl = /* @__PURE__ */ new Set(), ml = !1, hl = 0;
function gl() {
	hl = 0;
	for (let e of [...pl]) e() || pl.delete(e);
}
function _l() {
	hl ||= requestAnimationFrame(gl);
}
function vl(e) {
	pl.add(e), e(), !(ml || typeof window > "u") && (ml = !0, window.addEventListener("scroll", _l, { passive: !0 }), window.addEventListener("resize", _l, { passive: !0 }));
}
function yl(e, t, n, r) {
	let i = r === "cover" || r === "tile" || r === "repeat", a = e.closest(".urd-section") ?? e.parentElement?.closest(".urd-section") ?? e.parentElement, o = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
	e.style.willChange = "transform";
	let s = (t) => {
		e.style.top = `-${t}px`, e.style.bottom = `-${t}px`;
	}, c = () => {
		if (!e.isConnected) return !1;
		if (o || document.body.classList.contains("urd-mobile")) return s(n), e.style.transform = "", !0;
		let r = (a ?? e).getBoundingClientRect(), c = window.innerHeight || document.documentElement.clientHeight, l = dl(r.height, c, t, i ? .18 : .6);
		s(i ? Math.max(n, l) : n);
		let u = fl(r.top, r.height, c, t, l);
		return e.style.transform = `translateY(${u.toFixed(1)}px)`, !0;
	};
	vl(c), typeof requestAnimationFrame == "function" && requestAnimationFrame(() => requestAnimationFrame(c));
}
function bl() {
	return typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("animation-timeline", "view()");
}
var xl = /* @__PURE__ */ new Set(), Sl = !1, Cl = 0;
function wl() {
	Cl = 0;
	for (let e of [...xl]) e() || xl.delete(e);
}
function Tl() {
	!Cl && typeof requestAnimationFrame == "function" && (Cl = requestAnimationFrame(wl));
}
function El(e) {
	xl.add(e), e(), !(Sl || typeof window > "u") && (Sl = !0, window.addEventListener("resize", Tl, { passive: !0 }));
}
function Dl(e, t, n, r) {
	let i = r === "cover" || r === "tile" || r === "repeat", a = e.closest(".urd-section") ?? e.parentElement?.closest(".urd-section") ?? e.parentElement;
	e.style.willChange = "transform", e.classList.add("urd-parallax-css");
	let o = () => {
		if (!e.isConnected) return !1;
		let r = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || document.body.classList.contains("urd-mobile"), o = (a ?? e).getBoundingClientRect(), s = window.innerHeight || document.documentElement.clientHeight, c = dl(o.height, s, t, i ? .18 : .6), l = i && !r ? Math.max(n, c) : n;
		return e.style.setProperty("--urd-px-shift", `${c}px`), e.style.top = `-${l}px`, e.style.bottom = `-${l}px`, !0;
	};
	El(o), typeof requestAnimationFrame == "function" && requestAnimationFrame(() => requestAnimationFrame(o));
}
var Ol = {
	version: 2,
	label: "Image",
	labelKey: "bgLayer.image",
	defaults: () => ({
		src: "",
		fit: "plain",
		x: .5,
		y: .5,
		size: 1,
		opacity: 1,
		blur: 0,
		parallax: 0,
		bleed: "none"
	}),
	migrations: { 1: (e) => ({
		...e,
		fit: e.fit === "vanlig" ? "plain" : e.fit === "flislegg" ? "tile" : e.fit === "egen" ? "custom" : e.fit
	}) },
	render(e, t) {
		if (!ol(t.src)) return;
		e.style.opacity = String(t.opacity ?? 1), e.style.clipPath = ul(t.bleed), e.style.zIndex = t.bleed === "down" || t.bleed === "both" ? "1" : "";
		let n = document.createElement("div");
		n.className = "urd-bg-image", n.style.position = "absolute", n.style.left = "0", n.style.right = "0", n.style.top = "0", n.style.bottom = "0";
		let r = t.fit === "tile" || t.fit === "repeat";
		n.style.backgroundImage = `url("${t.src}")`, n.style.backgroundSize = ll(t.fit, t.size), n.style.backgroundRepeat = r ? "repeat" : "no-repeat", n.style.backgroundPosition = cl(t.x, t.y);
		let i = 0;
		t.blur > 0 && (n.style.filter = `blur(${t.blur}px)`, i = Math.ceil(t.blur), n.style.left = `-${i}px`, n.style.right = `-${i}px`, n.style.top = `-${i}px`, n.style.bottom = `-${i}px`);
		let a = new Image();
		if (a.src = t.src, !a.complete) {
			e.style.visibility = "hidden";
			let t = () => {
				e.style.visibility = "";
			};
			a.addEventListener("load", t, { once: !0 }), a.addEventListener("error", t, { once: !0 });
		}
		e.appendChild(n), t.parallax > 0 && kl(n, t.parallax, i, t.fit ?? "cover");
	}
};
function kl(e, t, n, r) {
	bl() ? Dl(e, t, n, r) : yl(e, t, n, r);
}
//#endregion
//#region ../template/assets/engine/0.7.4/gallery-model.js
function Al(e, t, n) {
	return !Number.isFinite(n) || n < 1 ? 0 : (((Number.isFinite(e) ? e : 0) + t) % n + n) % n;
}
function jl({ count: e = 0, reducedMotion: t = !1 } = {}) {
	return e >= 2 && !t;
}
function Ml(e, { min: t = 2, fallback: n = 5 } = {}) {
	let r = Number(e);
	return !Number.isFinite(r) || r <= 0 ? n : Math.max(t, r);
}
//#endregion
//#region ../template/assets/engine/0.7.4/backgrounds/slideshow.js
var Nl = {
	version: 1,
	label: "Image gallery",
	labelKey: "bgLayer.slideshow",
	defaults: () => ({
		images: [],
		fit: "cover",
		interval: 6,
		fade: 1.5,
		opacity: 1,
		blur: 0
	}),
	migrations: {},
	render(e, t) {
		let n = (t.images ?? []).filter((e) => ol(e?.src));
		if (!n.length) return;
		e.classList.add("urd-bg-slideshow"), e.style.opacity = String(t.opacity ?? 1), t.blur > 0 && (e.style.filter = `blur(${t.blur}px)`, e.style.inset = `-${t.blur * 2}px`);
		let r = Math.max(0, Number(t.fade) || 0);
		e.style.setProperty("--urd-bgg-fade", `${r}s`);
		let i = (e, n) => {
			e.style.backgroundImage = `url("${n.src}")`, e.style.backgroundSize = ll(t.fit), e.style.backgroundRepeat = "no-repeat", e.style.backgroundPosition = cl(n.x, n.y);
		}, a = new Image();
		if (a.src = n[0].src, !a.complete) {
			e.style.visibility = "hidden";
			let t = () => {
				e.style.visibility = "";
			};
			a.addEventListener("load", t, { once: !0 }), a.addEventListener("error", t, { once: !0 });
		}
		let o = document.createElement("div");
		o.className = "urd-bg-slide on", i(o, n[0]), e.appendChild(o);
		let s = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (!jl({
			count: n.length,
			reducedMotion: s
		})) return;
		let c = document.createElement("div");
		c.className = "urd-bg-slide", e.appendChild(c);
		let l = 0, u = o, d = Math.max(Ml(t.interval, { fallback: 6 }), r + .5) * 1e3, f = setInterval(() => {
			if (!e.isConnected) {
				clearInterval(f);
				return;
			}
			if (document.hidden) return;
			let t = Al(l, 1, n.length), r = new Image();
			r.src = n[t].src;
			let a = () => {
				if (!e.isConnected) return;
				let r = u === o ? c : o;
				i(r, n[t]), r.classList.add("on"), u.classList.remove("on"), u = r, l = t;
			};
			r.complete ? a() : (r.addEventListener("load", a, { once: !0 }), r.addEventListener("error", () => {
				l = t;
			}, { once: !0 }));
		}, d);
	}
}, Pl = /^(?:data:video\/[\w.+-]+;base64,[A-Za-z0-9+/=]+|\/media\/[\w%./-]+\.(?:mp4|webm))$/i;
function Fl(e) {
	return typeof e == "string" && Pl.test(e);
}
var Il = null;
function Ll(e) {
	Il ??= new IntersectionObserver((e) => {
		for (let t of e) {
			if (!t.target.isConnected) {
				Il.unobserve(t.target);
				continue;
			}
			t.isIntersecting ? t.target.play().catch(() => {}) : t.target.pause();
		}
	}, { threshold: 0 }), Il.observe(e);
}
var Rl = (e, t, n, r) => {
	e.style.position = "absolute", e.style.inset = "0", e.style.width = "100%", e.style.height = "100%", e.style.objectFit = t === "contain" ? "contain" : "cover", e.style.objectPosition = cl(n, r);
}, zl = {
	version: 1,
	label: "Video",
	labelKey: "bgLayer.video",
	defaults: () => ({
		src: "",
		poster: "",
		fit: "cover",
		x: .5,
		y: .5,
		opacity: 1,
		parallax: 0
	}),
	migrations: {},
	render(e, t) {
		if (!Fl(t.src)) return;
		if (e.style.opacity = String(t.opacity ?? 1), window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
			if (!ol(t.poster)) return;
			let n = document.createElement("img");
			n.className = "urd-bg-video-poster", n.alt = "", n.setAttribute("aria-hidden", "true"), n.src = t.poster, Rl(n, t.fit, t.x, t.y), e.appendChild(n);
			return;
		}
		let n = document.createElement("video");
		n.className = "urd-bg-video", n.muted = !0, n.setAttribute("muted", ""), n.loop = !0, n.playsInline = !0, n.setAttribute("playsinline", ""), n.preload = "metadata", n.disablePictureInPicture = !0, n.setAttribute("aria-hidden", "true"), ol(t.poster) && (n.poster = t.poster), n.src = t.src, Rl(n, t.fit, t.x, t.y), e.appendChild(n), Ll(n), t.parallax > 0 && kl(n, t.parallax, 0, t.fit === "contain" ? "contain" : "cover");
	}
};
//#endregion
//#region ../template/assets/engine/0.7.4/footer-thumb.js
function Bl(e = {}) {
	let t = "#2fd6b6", n = "#5c6b64", r = e.mega ? "#16221d" : "#0e1512", i = e.cols ?? 0, a = e.social ?? 0, o = `<svg viewBox="0 0 160 80" preserveAspectRatio="none" aria-hidden="true"><rect width="160" height="80" fill="${r}"/>`;
	if (e.mega && (o += `<circle cx="20" cy="6" r="34" fill="${t}" opacity="0.18"/>`), e.bigcta) return o += `<rect x="45" y="18" width="70" height="8" rx="3" fill="${n}" opacity="0.85"/>`, o += `<rect x="56" y="32" width="48" height="4" rx="2" fill="${n}" opacity="0.5"/>`, o += `<rect x="62" y="43" width="36" height="10" rx="3" fill="${t}"/>`, o += Vl(n, e.baselineLinks), o + "</svg>";
	let s = e.center ? 80 : 16;
	if (o += `<rect x="${s - (e.center ? 9 : 0)}" y="14" width="18" height="6" rx="2" fill="${t}"/>`, e.tag && (o += `<rect x="${e.center ? s - 22 : 16}" y="24" width="44" height="3" rx="1.5" fill="${n}" opacity="0.6"/>`), e.cta && (o += `<rect x="16" y="31" width="40" height="8" rx="2" fill="none" stroke="${n}" stroke-width="1" opacity="0.7"/>`, o += `<rect x="58" y="31" width="16" height="8" rx="2" fill="${t}"/>`), e.row) o += `<g fill="${n}" opacity="0.7">` + [
		0,
		1,
		2,
		3
	].map((e) => `<rect x="${44 + e * 20}" y="40" width="14" height="4" rx="2"/>`).join("") + "</g>";
	else if (i) {
		let e = 160 - i * 30 - 6;
		for (let r = 0; r < i; r++) {
			let i = e + r * 30;
			o += `<rect x="${i}" y="16" width="16" height="3" rx="1.5" fill="${t}" opacity="0.8"/>`;
			for (let e = 0; e < 3; e++) o += `<rect x="${i}" y="${24 + e * 7}" width="22" height="3" rx="1.5" fill="${n}" opacity="0.6"/>`;
		}
	}
	let c = e.center ? 80 - a * 9 / 2 : 16;
	for (let e = 0; e < a; e++) o += `<rect x="${c + e * 9}" y="52" width="6.5" height="6.5" rx="2" fill="none" stroke="${n}" stroke-width="1"/>`;
	return o += Vl(n, e.baselineLinks), o + "</svg>";
}
function Vl(e, t = 0) {
	let n = `<line x1="8" y1="66" x2="152" y2="66" stroke="${e}" stroke-width="0.6" opacity="0.5"/>`;
	return n += `<rect x="8" y="70" width="40" height="3" rx="1.5" fill="${e}" opacity="0.6"/>`, t && (n += `<g fill="${e}" opacity="0.6">` + Array.from({ length: t }, (e, t) => `<rect x="${120 - t * 16}" y="70" width="12" height="3" rx="1.5"/>`).join("") + "</g>"), n;
}
//#endregion
//#region ../template/assets/engine/0.7.4/animations/core.js
var Hl = () => ({
	duration: 600,
	delay: 0
}), Ul = 90, Wl = {
	"fade-in": {
		version: 1,
		label: "Fade in",
		labelKey: "anim.fadeIn",
		entrance: !0,
		defaults: Hl,
		migrations: {}
	},
	"slide-up": {
		version: 1,
		label: "Slide up",
		labelKey: "anim.slideUp",
		entrance: !0,
		defaults: Hl,
		migrations: {}
	},
	"zoom-in": {
		version: 1,
		label: "Zoom in",
		labelKey: "anim.zoomIn",
		entrance: !0,
		defaults: Hl,
		migrations: {}
	},
	"hover-lift": {
		version: 1,
		label: "Lift on pointer",
		labelKey: "anim.hoverLift",
		entrance: !1,
		defaults: () => ({}),
		migrations: {}
	},
	stagger: {
		version: 1,
		label: "Stagger (card group)",
		labelKey: "anim.stagger",
		entrance: !0,
		group: !0,
		defaults: () => ({
			duration: 600,
			delay: 0,
			step: Ul,
			effect: "slide-up",
			pattern: "sequence"
		}),
		migrations: {}
	}
}, Gl = [
	["font.system", "system-ui, sans-serif"],
	["font.arial", "Arial, Helvetica, sans-serif"],
	["font.verdana", "Verdana, Geneva, sans-serif"],
	["font.trebuchet", "'Trebuchet MS', sans-serif"],
	["font.georgia", "Georgia, 'Times New Roman', serif"],
	["font.palatino", "'Palatino Linotype', Palatino, serif"],
	["font.courier", "'Courier New', monospace"]
];
//#endregion
//#region ../template/assets/engine/0.7.4/place.js
function Kl(e) {
	let t = (e) => Math.round(e * 100) / 100, n = Math.max(0, t(100 - e.w)), r = Math.min(n, Math.max(0, t(e.x - e.w / 2))), i = Math.max(0, e.y - e.h / 2), a = e.snap === !1 || e.grid?.snap === !1, o = e.grid?.size || 8;
	return i = a ? Math.round(i) : Math.round(i / o) * o, {
		x: r,
		y: Math.max(0, i)
	};
}
//#endregion
//#region src/App.svelte
var ql = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), Jl = /* @__PURE__ */ H("<button class=\"ghost row-tool svelte-1n46o8q\"></button>"), Yl = /* @__PURE__ */ H("<span><span class=\"grad-grip svelte-1n46o8q\"><svg viewBox=\"0 0 16 16\" width=\"14\" height=\"14\" fill=\"currentColor\" aria-hidden=\"true\"><circle cx=\"5\" cy=\"3\" r=\"1.4\"></circle><circle cx=\"11\" cy=\"3\" r=\"1.4\"></circle><circle cx=\"5\" cy=\"8\" r=\"1.4\"></circle><circle cx=\"11\" cy=\"8\" r=\"1.4\"></circle><circle cx=\"5\" cy=\"13\" r=\"1.4\"></circle><circle cx=\"11\" cy=\"13\" r=\"1.4\"></circle></svg></span> <!> <input type=\"range\" class=\"tb-grow svelte-1n46o8q\" min=\"0\" max=\"100\" step=\"1\"/> <span class=\"gridmenu-value svelte-1n46o8q\"> </span> <!></span>"), Xl = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), Zl = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"360\" step=\"5\" class=\"svelte-1n46o8q\"/>", 1), Ql = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <!> <button class=\"ghost action svelte-1n46o8q\"> </button> <!> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <!></label>", 1), $l = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.1\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), eu = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), tu = /* @__PURE__ */ H("<div class=\"sizefill svelte-1n46o8q\"><button type=\"button\" class=\"ghost svelte-1n46o8q\"> </button> <button type=\"button\" class=\"ghost svelte-1n46o8q\"> </button></div> <label class=\"svelte-1n46o8q\"> </label> <div class=\"focalpad svelte-1n46o8q\"><span class=\"focaldot svelte-1n46o8q\"></span></div> <label class=\"sub svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"-0.5\" max=\"1.5\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"sub svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"-0.5\" max=\"1.5\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), nu = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.1\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <!></label>", 1), ru = /* @__PURE__ */ H("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> </label> <div class=\"sizestep svelte-1n46o8q\"><button type=\"button\" class=\"svelte-1n46o8q\">−</button> <input type=\"number\" min=\"10\" max=\"400\" class=\"svelte-1n46o8q\"/> <span class=\"sizeunit svelte-1n46o8q\">%</span> <button type=\"button\" class=\"svelte-1n46o8q\">+</button></div> <!> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"20\" step=\"1\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!>", 1), iu = /* @__PURE__ */ H("<span class=\"toolbar-row svelte-1n46o8q\"><img class=\"site-icon-preview svelte-1n46o8q\" alt=\"\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), au = /* @__PURE__ */ H("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" multiple=\"\" class=\"svelte-1n46o8q\"/></label> <!> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"2\" max=\"120\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"5\" step=\"0.1\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"20\" step=\"1\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <p class=\"panel-hint svelte-1n46o8q\"> </p>", 1), ou = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.1\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), su = /* @__PURE__ */ H("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"video/mp4,video/webm\" class=\"svelte-1n46o8q\"/></label> <label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"sub svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"sub svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!>", 1), cu = /* @__PURE__ */ H("<div class=\"bg-layer svelte-1n46o8q\"><span class=\"nav-line svelte-1n46o8q\"><!> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span> <!></div>"), lu = /* @__PURE__ */ H("<!> <label class=\"svelte-1n46o8q\"> <!></label> <button class=\"ghost action svelte-1n46o8q\"> </button>", 1), uu = /* @__PURE__ */ H("<input class=\"nav-target svelte-1n46o8q\"/>"), du = /* @__PURE__ */ H("<div class=\"nav-row nav-sub-row\"><input class=\"svelte-1n46o8q\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span> <span class=\"nav-target\"><!></span> <!></div>"), fu = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label>"), pu = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <span class=\"num-stepper svelte-1n46o8q\"><button type=\"button\" class=\"svelte-1n46o8q\">−</button> <input type=\"number\" min=\"1\" max=\"12\" step=\"1\" class=\"svelte-1n46o8q\"/> <button type=\"button\" class=\"svelte-1n46o8q\">+</button></span></label>", 1), mu = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label>", 1), hu = /* @__PURE__ */ H("<p class=\"panel-hint svelte-1n46o8q\"> </p>"), gu = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label>"), _u = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label>", 1), vu = /* @__PURE__ */ H("<input class=\"svelte-1n46o8q\"/>"), yu = /* @__PURE__ */ H("<span class=\"nav-line svelte-1n46o8q\"><input class=\"svelte-1n46o8q\"/> <!> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!>", 1), bu = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <!> <p class=\"panel-strong svelte-1n46o8q\"> </p> <!> <button class=\"ghost action svelte-1n46o8q\"> </button> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label>", 1), xu = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"1\" max=\"50\" class=\"svelte-1n46o8q\"/></label>"), Su = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <textarea rows=\"3\" spellcheck=\"false\" class=\"svelte-1n46o8q\"></textarea></label> <label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label>", 1), Cu = /* @__PURE__ */ H("<span class=\"nav-line svelte-1n46o8q\"><input class=\"svelte-1n46o8q\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span>"), wu = /* @__PURE__ */ H("<label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <p class=\"panel-strong svelte-1n46o8q\"> </p> <!> <button class=\"ghost action svelte-1n46o8q\"> </button>", 1), Tu = /* @__PURE__ */ H("<span class=\"nav-line svelte-1n46o8q\"><input class=\"tl-year svelte-1n46o8q\"/> <input class=\"svelte-1n46o8q\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span> <input class=\"svelte-1n46o8q\"/>", 1), Eu = /* @__PURE__ */ H("<p class=\"panel-strong svelte-1n46o8q\"> </p> <!> <button class=\"ghost action svelte-1n46o8q\"> </button>", 1), Du = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label>", 1), Ou = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label>", 1), ku = /* @__PURE__ */ H("<span class=\"toolbar-row svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button></span> <span class=\"toolbar-row svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button></span> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label>", 1), Au = /* @__PURE__ */ H("<label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label>"), ju = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input type=\"datetime-local\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label>", 1), Mu = /* @__PURE__ */ H("<button class=\"ghost svelte-1n46o8q\"> </button>"), Nu = /* @__PURE__ */ H("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"audio/*\" class=\"svelte-1n46o8q\"/></label> <!> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label>", 1), Pu = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <!>", 1), Fu = /* @__PURE__ */ H("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <!>", 1), Iu = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> </label> <input class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label>", 1), Lu = /* @__PURE__ */ H("<input class=\"token-input svelte-1n46o8q\" maxlength=\"4\"/>"), Ru = /* @__PURE__ */ H("<span class=\"toolbar-row svelte-1n46o8q\"><img class=\"site-icon-preview svelte-1n46o8q\"/> <button class=\"ghost svelte-1n46o8q\"> </button></span>"), zu = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <span class=\"toolbar-row svelte-1n46o8q\"><!> <!></span></label> <!>", 1), Bu = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" max=\"100\" class=\"svelte-1n46o8q\"/></label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label>", 1), Vu = /* @__PURE__ */ H("<span class=\"toolbar-row svelte-1n46o8q\"><button class=\"ghost action svelte-1n46o8q\"> </button> <button class=\"ghost action svelte-1n46o8q\"> </button></span>"), Hu = /* @__PURE__ */ H("<button class=\"ghost action svelte-1n46o8q\"> </button>"), Uu = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" max=\"100\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label>", 1), Wu = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label>", 1), Gu = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input type=\"email\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"url\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label>", 1), Ku = /* @__PURE__ */ H("<div class=\"bg-layer svelte-1n46o8q\"><span class=\"toolbar-row svelte-1n46o8q\"><img class=\"site-icon-preview svelte-1n46o8q\" alt=\"\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label></div>"), qu = /* @__PURE__ */ H("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" multiple=\"\" class=\"svelte-1n46o8q\"/></label> <!>", 1), Ju = /* @__PURE__ */ H("<p> </p>"), Yu = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input type=\"text\" class=\"svelte-1n46o8q\"/></label> <button class=\"ghost svelte-1n46o8q\"> </button> <!>", 1), Xu = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input type=\"number\" class=\"svelte-1n46o8q\"/></label>"), Zu = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input type=\"text\" class=\"svelte-1n46o8q\"/></label>"), Qu = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), $u = /* @__PURE__ */ H("<p class=\"panel-strong svelte-1n46o8q\"> </p> <!> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), ed = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), td = /* @__PURE__ */ H("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <!>", 1), nd = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"svelte-1n46o8q\"> <!></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), rd = /* @__PURE__ */ H("<label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), id = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), ad = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"24\" max=\"64\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), od = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), sd = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"1\" max=\"3\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.2\" max=\"2\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.2\" max=\"2\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"2\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <button class=\"ghost action svelte-1n46o8q\"> </button> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), cd = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"8\" max=\"400\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), ld = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" max=\"6\" class=\"svelte-1n46o8q\"/></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), ud = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"1\" max=\"6\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"32\" step=\"2\" class=\"svelte-1n46o8q\"/>", 1), dd = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"2\" max=\"60\" class=\"svelte-1n46o8q\"/></label>"), fd = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <!> <!> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), pd = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"1\" step=\"0.5\" class=\"svelte-1n46o8q\"/></label>"), md = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"1\" max=\"40\" class=\"svelte-1n46o8q\"/></label> <!> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), hd = /* @__PURE__ */ H("<div class=\"ctl-row svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <input type=\"range\" min=\"1\" max=\"100\" step=\"1\" class=\"svelte-1n46o8q\"/> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></div>"), gd = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"100\" max=\"4000\" step=\"100\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" max=\"4000\" step=\"100\" class=\"svelte-1n46o8q\"/></label>", 1), _d = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" max=\"400\" class=\"svelte-1n46o8q\"/></label>"), vd = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <!> <!>", 1), yd = /* @__PURE__ */ H("<hr class=\"gridmenu-divider svelte-1n46o8q\"/> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!>", 1), bd = /* @__PURE__ */ H("<div class=\"frame-grid svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <input type=\"number\" step=\"0.5\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" step=\"1\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" step=\"0.5\" min=\"1\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" step=\"1\" min=\"1\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" step=\"1\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" step=\"1\" class=\"svelte-1n46o8q\"/></label></div>"), xd = /* @__PURE__ */ H("<!> <label class=\"svelte-1n46o8q\"> <!></label> <!> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"svelte-1n46o8q\"> <!></label> <!> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <details class=\"group frame-group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><!> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label></div></details>", 1), Sd = /* @__PURE__ */ H("<div class=\"props-tabs svelte-1n46o8q\"><span class=\"seg svelte-1n46o8q\"><button type=\"button\"> </button> <button type=\"button\"> </button></span></div> <!>", 1), Cd = /* @__PURE__ */ H("<button class=\"chrome-restore svelte-1n46o8q\"><!> </button>"), wd = /* @__PURE__ */ H("<button><!> </button>"), Td = /* @__PURE__ */ H("<div class=\"tool-pop svelte-1n46o8q\"></div>"), Ed = /* @__PURE__ */ H("<span class=\"toolmenu svelte-1n46o8q\"><button><!><!></button> <!></span>"), Dd = /* @__PURE__ */ H("<button></button>"), Od = /* @__PURE__ */ H("<span class=\"tool-cap svelte-1n46o8q\"> </span> <span class=\"viewswitch toolgrp svelte-1n46o8q\"></span>", 1), kd = /* @__PURE__ */ H("<div class=\"tool-pop svelte-1n46o8q\"><div class=\"tool-pop-row svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"></button> <span class=\"zoom-readout svelte-1n46o8q\"> </span> <button class=\"ghost svelte-1n46o8q\"></button></div> <button><!> </button></div>"), Ad = /* @__PURE__ */ H("<span class=\"toolmenu svelte-1n46o8q\"><button><span class=\"zoom-cap svelte-1n46o8q\"> </span><!></button> <!></span>"), jd = /* @__PURE__ */ H("<span class=\"tool-cap svelte-1n46o8q\"> </span> <span class=\"zoomswitch toolgrp svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"></button> <span class=\"zoom-readout svelte-1n46o8q\"> </span> <button class=\"ghost svelte-1n46o8q\"></button> <button></button></span>", 1), Md = /* @__PURE__ */ H("<div class=\"tool-pop svelte-1n46o8q\"><button><!> </button> <button><!> </button></div>"), Nd = /* @__PURE__ */ H("<span class=\"tool-cap svelte-1n46o8q\"> </span> <span class=\"toolgrp svelte-1n46o8q\"><button></button> <button></button></span>", 1), Pd = /* @__PURE__ */ H("<button class=\"ghost page-btn svelte-1n46o8q\"> </button> <span class=\"toolset svelte-1n46o8q\"><!> <!> <!></span>", 1), Fd = /* @__PURE__ */ H("<button class=\"badge attention svelte-1n46o8q\"><!> <span class=\"btn-label svelte-1n46o8q\"> </span> <span class=\"badge-mini svelte-1n46o8q\"> </span></button>"), Id = /* @__PURE__ */ H("<button class=\"discard-confirm svelte-1n46o8q\"><!> </button>"), Ld = /* @__PURE__ */ H("<span class=\"draft-cluster svelte-1n46o8q\"><span class=\"chip draft-chip svelte-1n46o8q\"><span class=\"chip-full svelte-1n46o8q\" aria-hidden=\"true\"> </span> <span class=\"chip-mini svelte-1n46o8q\" aria-hidden=\"true\">!</span></span>  <span class=\"discard-wrap svelte-1n46o8q\"><button><!><span class=\"discard-label svelte-1n46o8q\"> </span></button> <!></span></span>"), Rd = /* @__PURE__ */ H("<!> <span class=\"btn-label svelte-1n46o8q\"> </span>", 1), zd = /* @__PURE__ */ H("<span class=\"who svelte-1n46o8q\"><!> </span>"), Bd = /* @__PURE__ */ H("<a class=\"ghost svelte-1n46o8q\" href=\"/api/github/login\"> </a>"), Vd = /* @__PURE__ */ H("<button class=\"ghost svelte-1n46o8q\"><!></button> <!> <a class=\"ghost svelte-1n46o8q\" target=\"_blank\" rel=\"noopener\"><!> <span class=\"btn-label svelte-1n46o8q\"> </span></a> <button class=\"primary svelte-1n46o8q\"> </button>", 1), Hd = /* @__PURE__ */ H("<button> </button>"), Ud = /* @__PURE__ */ H("<span class=\"rail-group svelte-1n46o8q\"> </span> <!>", 1), Wd = /* @__PURE__ */ H("<div class=\"ctl-row svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <input type=\"number\" class=\"tb-num svelte-1n46o8q\" step=\"10\"/> <span class=\"mini-label svelte-1n46o8q\"> </span> <input type=\"number\" class=\"tb-num svelte-1n46o8q\" min=\"0\" step=\"10\" placeholder=\"0\"/></div>"), Gd = /* @__PURE__ */ H("<p class=\"mini-label svelte-1n46o8q\"> </p> <label class=\"svelte-1n46o8q\"> <input type=\"text\" spellcheck=\"false\" class=\"svelte-1n46o8q\"/></label>", 1), Kd = /* @__PURE__ */ H("<div class=\"settings-pop svelte-1n46o8q\"><p class=\"panel-strong svelte-1n46o8q\"> </p> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <p class=\"mini-label svelte-1n46o8q\"> </p> <div class=\"seg svelte-1n46o8q\"><button type=\"button\"> </button> <button type=\"button\"> </button></div> <!> <!></div>"), qd = /* @__PURE__ */ H("<button type=\"button\"></button>"), Jd = /* @__PURE__ */ H("<span class=\"page-path svelte-1n46o8q\">/</span>"), Yd = /* @__PURE__ */ H("<input class=\"page-slug svelte-1n46o8q\"/>"), Xd = /* @__PURE__ */ H("<span class=\"seo-warn svelte-1n46o8q\"></span>"), Zd = /* @__PURE__ */ H("<button class=\"ghost danger svelte-1n46o8q\"><!> </button>"), Qd = /* @__PURE__ */ H("<div class=\"page-menu svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"><!> </button> <!></div>"), $d = /* @__PURE__ */ H("<div><input class=\"page-title svelte-1n46o8q\"/> <!> <!> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <span class=\"page-menu-wrap svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <!></span></span></div>"), ef = /* @__PURE__ */ H("<img class=\"site-icon-preview svelte-1n46o8q\"/>"), tf = /* @__PURE__ */ H("<div><button class=\"page-template-pick svelte-1n46o8q\"><span class=\"page-template-thumb svelte-1n46o8q\"></span> <span class=\"page-template-name svelte-1n46o8q\"> </span></button></div>"), nf = /* @__PURE__ */ H("<div><button class=\"page-template-pick svelte-1n46o8q\"><span class=\"page-template-thumb svelte-1n46o8q\"></span> <span class=\"page-template-name svelte-1n46o8q\"> </span></button> <button class=\"page-template-del svelte-1n46o8q\"></button></div>"), rf = /* @__PURE__ */ H("<span class=\"mini-label svelte-1n46o8q\"> </span> <div class=\"page-template-grid svelte-1n46o8q\"></div>", 1), af = /* @__PURE__ */ H("<div class=\"panel-body svelte-1n46o8q\"><!> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <textarea rows=\"2\" class=\"svelte-1n46o8q\"></textarea></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <textarea rows=\"2\" class=\"svelte-1n46o8q\"></textarea></label> <label class=\"svelte-1n46o8q\"> <!></label> <span class=\"toolbar-row svelte-1n46o8q\"><label class=\"ghost filepick tb-grow svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <!></span> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label></div></details> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <input class=\"svelte-1n46o8q\"/> <button class=\"ghost action svelte-1n46o8q\"> </button> <span class=\"mini-label svelte-1n46o8q\"> </span> <div class=\"page-template-grid svelte-1n46o8q\"><div><button class=\"page-template-pick svelte-1n46o8q\"><span class=\"page-template-thumb svelte-1n46o8q\"></span> <span class=\"page-template-name svelte-1n46o8q\"> </span></button></div> <!></div> <!></div>"), of = /* @__PURE__ */ H("<input class=\"svelte-1n46o8q\"/> <span class=\"toolbar-row svelte-1n46o8q\"><!> <input type=\"number\" class=\"tb-num svelte-1n46o8q\" min=\"8\" max=\"96\" placeholder=\"px\"/> <button><b> </b></button> <button><i> </i></button></span>", 1), sf = /* @__PURE__ */ H("<img alt=\"\" class=\"svelte-1n46o8q\"/>"), cf = /* @__PURE__ */ H("<span class=\"logo-file svelte-1n46o8q\"> </span>"), lf = /* @__PURE__ */ H("<div class=\"logo-pick svelte-1n46o8q\"><span class=\"logo-thumb svelte-1n46o8q\"><!></span> <span class=\"logo-pick-col svelte-1n46o8q\"><label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <!></span></div> <div class=\"ctl-triple svelte-1n46o8q\"><div class=\"ctl-field svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <input type=\"number\" class=\"tb-num svelte-1n46o8q\" min=\"12\" max=\"128\"/></div> <div class=\"ctl-field svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <input type=\"number\" class=\"tb-num svelte-1n46o8q\"/></div> <div class=\"ctl-field svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <input type=\"number\" class=\"tb-num svelte-1n46o8q\" min=\"0\" max=\"64\"/></div></div>", 1), uf = /* @__PURE__ */ H("<button type=\"button\"><!><span class=\"svelte-1n46o8q\"> </span></button>"), df = /* @__PURE__ */ H("<!> <!>", 1), ff = /* @__PURE__ */ H("<span class=\"toolbar-row svelte-1n46o8q\"><span class=\"mini-label tb-grow svelte-1n46o8q\"> </span> <input type=\"number\" class=\"tb-num svelte-1n46o8q\" placeholder=\"1100\"/></span>"), pf = /* @__PURE__ */ H("<!> <!> <span class=\"toolbar-row svelte-1n46o8q\"><span class=\"mini-label tb-grow svelte-1n46o8q\"> </span> <input type=\"number\" class=\"tb-num svelte-1n46o8q\"/></span>", 1), mf = /* @__PURE__ */ H("<label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label>", 1), hf = /* @__PURE__ */ H("<!> <span class=\"toolbar-row svelte-1n46o8q\"><span class=\"mini-label tb-grow svelte-1n46o8q\"> </span> <input type=\"number\" class=\"tb-num svelte-1n46o8q\"/></span>", 1), gf = /* @__PURE__ */ H("<div class=\"ctl-row svelte-1n46o8q\"><span class=\"mini-label ctl-name svelte-1n46o8q\"> </span> <input type=\"range\" class=\"svelte-1n46o8q\"/> <input type=\"number\" class=\"tb-num svelte-1n46o8q\"/></div>"), _f = /* @__PURE__ */ H("<div class=\"ctl-pair svelte-1n46o8q\"><div class=\"ctl-field svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <input type=\"number\" class=\"tb-num svelte-1n46o8q\"/></div> <div class=\"ctl-field svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <input type=\"number\" class=\"tb-num svelte-1n46o8q\"/></div></div>"), vf = /* @__PURE__ */ H("<span class=\"toolbar-row ctl-end svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <input type=\"number\" class=\"tb-num svelte-1n46o8q\" min=\"1\" max=\"8\"/> <span class=\"mini-label svelte-1n46o8q\"> </span> <!></span>"), yf = /* @__PURE__ */ H("<div class=\"ctl-field svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <div class=\"tile-grid cols-5 svelte-1n46o8q\" role=\"group\"></div></div> <!>", 1), bf = /* @__PURE__ */ H("<div class=\"ctl-row svelte-1n46o8q\"><span class=\"mini-label ctl-name svelte-1n46o8q\"> </span> <input type=\"range\" min=\"30\" max=\"80\" step=\"5\" class=\"svelte-1n46o8q\"/> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></div> <!>", 1), xf = /* @__PURE__ */ H("<div class=\"mini-card svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label></div>"), Sf = /* @__PURE__ */ H("<label class=\"field-stack svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <!></label>"), Cf = /* @__PURE__ */ H("<div class=\"ctl-field svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <input type=\"number\" class=\"tb-num svelte-1n46o8q\"/></div>"), wf = /* @__PURE__ */ H("<label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!> <!> <!> <div class=\"ctl-row svelte-1n46o8q\"><span class=\"mini-label ctl-name svelte-1n46o8q\"> </span> <!> <input type=\"range\" min=\"0\" max=\"100\" step=\"1\" class=\"svelte-1n46o8q\"/> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></div> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <label class=\"svelte-1n46o8q\"> <!></label>", 1), Tf = /* @__PURE__ */ H("<button type=\"button\"><span> </span><span class=\"svelte-1n46o8q\"> </span></button>"), Ef = /* @__PURE__ */ H("<div class=\"ctl-row svelte-1n46o8q\"><span class=\"mini-label ctl-name svelte-1n46o8q\"> </span> <input type=\"range\" min=\"0.1\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></div>"), Df = /* @__PURE__ */ H("<div class=\"swatch-cell svelte-1n46o8q\"><!> <span class=\"mini-label svelte-1n46o8q\"> </span></div>"), Of = /* @__PURE__ */ H("<label class=\"field-stack svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <input type=\"text\" class=\"field-filled svelte-1n46o8q\" placeholder=\"https://\"/></label>"), kf = /* @__PURE__ */ H("<label class=\"field-stack svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <input type=\"text\" class=\"field-filled svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <!> <!> <!> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label>", 1), Af = /* @__PURE__ */ H("<div aria-hidden=\"true\"><span class=\"nav-grip svelte-1n46o8q\"></span> <div class=\"nav-item-main svelte-1n46o8q\"><span class=\"nav-item-name ghost-name svelte-1n46o8q\"> </span> <span class=\"ghost-target svelte-1n46o8q\"> </span></div></div>"), jf = /* @__PURE__ */ H("<input class=\"nav-item-href svelte-1n46o8q\"/>"), Mf = /* @__PURE__ */ H("<span class=\"nav-item-sub svelte-1n46o8q\"></span>"), Nf = /* @__PURE__ */ H("<!> <div><span class=\"nav-grip svelte-1n46o8q\" draggable=\"true\"></span> <div class=\"nav-item-main svelte-1n46o8q\"><input class=\"nav-item-name svelte-1n46o8q\"/> <div class=\"nav-item-target svelte-1n46o8q\"><!> <!></div></div> <span class=\"nav-actions svelte-1n46o8q\"><button class=\"ghost nav-act svelte-1n46o8q\"></button> <button class=\"ghost nav-act svelte-1n46o8q\"></button> <button class=\"ghost nav-act svelte-1n46o8q\"></button></span> <button class=\"ghost row-tool nav-more svelte-1n46o8q\"></button></div> <!>", 1), Pf = /* @__PURE__ */ H("<!> <div><span class=\"nav-grip svelte-1n46o8q\" draggable=\"true\"></span> <div class=\"nav-item-main svelte-1n46o8q\"><input class=\"nav-item-name svelte-1n46o8q\"/> <div class=\"nav-item-target svelte-1n46o8q\"><!> <!></div></div> <!> <span class=\"nav-actions svelte-1n46o8q\"><button class=\"ghost nav-act svelte-1n46o8q\"></button> <button class=\"ghost nav-act svelte-1n46o8q\"></button> <button class=\"ghost nav-act svelte-1n46o8q\"></button> <button class=\"ghost nav-act svelte-1n46o8q\"></button></span> <button class=\"ghost row-tool nav-more svelte-1n46o8q\"></button></div> <!> <!> <!>", 1), Ff = /* @__PURE__ */ H("<div class=\"panel-body svelte-1n46o8q\"><details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><!> <!> <!> <!></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><details class=\"group frame-group sub-fold svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><div class=\"ctl-field svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <div class=\"tile-grid cols-3 svelte-1n46o8q\" role=\"group\"></div></div> <!> <!> <!> <!> <!> <!></div></details> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <details class=\"group frame-group sub-fold svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><div class=\"seg cw-seg svelte-1n46o8q\"></div> <details class=\"sub-inset svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"sub-inset-body svelte-1n46o8q\"><!> <div class=\"ctl-row svelte-1n46o8q\"><span class=\"mini-label ctl-name svelte-1n46o8q\"> </span> <input type=\"range\" class=\"svelte-1n46o8q\"/> <input type=\"number\" class=\"tb-num svelte-1n46o8q\"/></div> <!></div></details></div></details> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <details class=\"group frame-group sub-fold svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><!> <!></div></details> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <details class=\"group frame-group sub-fold svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><!> <div class=\"mini-card svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!></div></div></details> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <details class=\"group frame-group sub-fold svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><div class=\"ctl-pair svelte-1n46o8q\"><!> <div class=\"ctl-field svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <input type=\"number\" class=\"tb-num svelte-1n46o8q\"/></div></div> <div class=\"ctl-pair svelte-1n46o8q\"><label class=\"field-stack svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <!></label> <!></div> <!> <!></div></details> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <details class=\"group frame-group sub-fold svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><div class=\"ctl-field svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <div class=\"tile-grid cols-5 svelte-1n46o8q\" role=\"group\"></div></div> <!> <div class=\"swatch-row svelte-1n46o8q\"><!> <div class=\"swatch-cell svelte-1n46o8q\"><!> <span class=\"mini-label svelte-1n46o8q\"> </span></div> <div class=\"swatch-cell svelte-1n46o8q\"><!> <span class=\"mini-label svelte-1n46o8q\"> </span></div></div> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label></div></details> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <details class=\"group frame-group sub-fold svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><!></div></details></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><div class=\"ctl-field svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <div role=\"group\"></div></div> <!> <!> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"1\" max=\"4\" class=\"svelte-1n46o8q\"/></label></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><div class=\"nav-list svelte-1n46o8q\" role=\"list\"></div> <button class=\"ghost action svelte-1n46o8q\"> </button> <span class=\"toolbar-row svelte-1n46o8q\"><input class=\"tb-grow svelte-1n46o8q\"/> <button class=\"ghost action svelte-1n46o8q\"> </button></span></div></details></div>"), If = /* @__PURE__ */ H("<div class=\"cw-row svelte-1n46o8q\"><span class=\"mini-label cw-screen svelte-1n46o8q\"> </span> <span><span class=\"cw-fill svelte-1n46o8q\"></span></span> <span class=\"gridmenu-value cw-margin svelte-1n46o8q\"> </span></div>"), Lf = /* @__PURE__ */ H("<div class=\"mini-label cw-binds svelte-1n46o8q\"> </div>"), Rf = /* @__PURE__ */ H("<div class=\"ctl-row svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <input type=\"range\" class=\"svelte-1n46o8q\"/> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></div>"), zf = /* @__PURE__ */ H("<button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button>", 1), Bf = /* @__PURE__ */ H("<div class=\"panel-body svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <p class=\"panel-strong svelte-1n46o8q\"> </p> <div class=\"sample cw-sample svelte-1n46o8q\"><!> <div class=\"cw-legend svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <span class=\"mini-label svelte-1n46o8q\"> </span></div> <!></div> <div class=\"seg cw-seg svelte-1n46o8q\"></div> <!> <p class=\"mini-label svelte-1n46o8q\"> </p> <div class=\"seg cw-seg svelte-1n46o8q\"></div> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><div class=\"ctl-row svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <input type=\"range\" class=\"svelte-1n46o8q\"/> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></div></div></details> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <!></label> <span class=\"toolbar-row svelte-1n46o8q\"><label class=\"ghost filepick tb-grow svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <!></span></div>"), Vf = /* @__PURE__ */ H("<div class=\"mini-label tpv-cap svelte-1n46o8q\"> </div>"), Hf = /* @__PURE__ */ H("<div class=\"theme-pvw svelte-1n46o8q\"><!> <div class=\"tpv-demo svelte-1n46o8q\"><div class=\"tpv-h svelte-1n46o8q\"> </div> <div class=\"tpv-card svelte-1n46o8q\"> </div> <div class=\"tpv-row svelte-1n46o8q\"><span class=\"tpv-btn svelte-1n46o8q\"> </span><span class=\"tpv-lnk svelte-1n46o8q\"> </span></div></div></div>"), Uf = /* @__PURE__ */ H("<button type=\"button\"><span class=\"tp-band svelte-1n46o8q\"><i class=\"svelte-1n46o8q\"></i><i class=\"svelte-1n46o8q\"></i><i class=\"svelte-1n46o8q\"></i><i class=\"svelte-1n46o8q\"></i></span> <small class=\"svelte-1n46o8q\"> </small></button>"), Wf = /* @__PURE__ */ H("<div class=\"ctl-row autorow svelte-1n46o8q\"><span class=\"autolbl svelte-1n46o8q\"> </span> <span class=\"seg svelte-1n46o8q\"><button type=\"button\"> </button> <button type=\"button\"> </button></span></div>"), Gf = /* @__PURE__ */ H("<span class=\"mini-label svelte-1n46o8q\"> </span>"), Kf = /* @__PURE__ */ H("<div class=\"palcol svelte-1n46o8q\"><!> <span class=\"palcap svelte-1n46o8q\"> </span> <b class=\"palhex svelte-1n46o8q\"> </b></div>"), qf = /* @__PURE__ */ H("<div class=\"ctl-row palhead svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <button type=\"button\"> </button></div> <div></div>", 1), Jf = /* @__PURE__ */ H("<div class=\"panel-body svelte-1n46o8q\"><p class=\"panel-strong svelte-1n46o8q\"> </p> <div class=\"theme-presets svelte-1n46o8q\"></div> <p class=\"panel-strong svelte-1n46o8q\"> </p> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!> <div class=\"ctl-row palhead svelte-1n46o8q\"><!> <button type=\"button\"> </button></div> <div class=\"palcells svelte-1n46o8q\"></div> <!> <div class=\"ctl-row palauto-row svelte-1n46o8q\"><span class=\"mini-label ctl-name svelte-1n46o8q\"> </span> <button type=\"button\"> </button></div> <div class=\"theme-previews svelte-1n46o8q\"><!> <!></div> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <div class=\"sample typo-sample svelte-1n46o8q\"><div class=\"ts-h svelte-1n46o8q\"> </div> <div class=\"ts-b svelte-1n46o8q\"> </div></div></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><div class=\"sample form-prev svelte-1n46o8q\"><span class=\"fp-btn svelte-1n46o8q\"> </span> <span class=\"fp-card svelte-1n46o8q\"> </span></div> <label class=\"ctl-row svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"24\" step=\"1\" class=\"svelte-1n46o8q\"/> <label class=\"ctl-row svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"40\" step=\"1\" class=\"svelte-1n46o8q\"/></div></details></div>"), Yf = /* @__PURE__ */ H("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label>"), Xf = /* @__PURE__ */ H("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" multiple=\"\" class=\"svelte-1n46o8q\"/></label>"), Zf = /* @__PURE__ */ H("<details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"></div></details>"), Qf = /* @__PURE__ */ H("<details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button></div></details> <button class=\"ghost svelte-1n46o8q\"> </button> <label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"> </button> <label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" multiple=\"\" class=\"svelte-1n46o8q\"/></label></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button></div></details> <!> <!>", 1), $f = /* @__PURE__ */ H("<div><input type=\"text\" class=\"svelte-1n46o8q\"/> <!></div>"), ep = /* @__PURE__ */ H("<div class=\"panel-body svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"4\" max=\"96\" step=\"2\" class=\"svelte-1n46o8q\"/> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label></div>"), tp = /* @__PURE__ */ H("<p class=\"panel-strong svelte-1n46o8q\"> </p> <!>", 1), np = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"4\" max=\"96\" step=\"2\" class=\"svelte-1n46o8q\"/>", 1), rp = /* @__PURE__ */ H("<button><span class=\"rs-sample svelte-1n46o8q\"><i class=\"rs-line svelte-1n46o8q\"></i> <i class=\"rs-chip svelte-1n46o8q\"></i> <i class=\"rs-dot svelte-1n46o8q\"></i></span> <span class=\"rs-name svelte-1n46o8q\"> </span></button>"), ip = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" max=\"1000\" step=\"10\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label>", 1), ap = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"100\" max=\"4000\" step=\"100\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" max=\"4000\" step=\"100\" class=\"svelte-1n46o8q\"/></label> <!>", 1), op = /* @__PURE__ */ H("<p class=\"panel-strong svelte-1n46o8q\"> </p> <label class=\"svelte-1n46o8q\"> <input class=\"token-input svelte-1n46o8q\"/></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <p class=\"panel-strong svelte-1n46o8q\"> </p> <div class=\"rs-grid svelte-1n46o8q\"></div> <label class=\"svelte-1n46o8q\"> <span class=\"row-tools svelte-1n46o8q\"><span class=\"gridmenu-value svelte-1n46o8q\"> </span> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <p class=\"panel-strong svelte-1n46o8q\"> </p> <!> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"svelte-1n46o8q\"> <!></label>", 1), sp = /* @__PURE__ */ H("<div class=\"panel-body svelte-1n46o8q\"><!></div>"), cp = /* @__PURE__ */ H("<button class=\"footer-tp svelte-1n46o8q\"><span class=\"footer-tp-thumb svelte-1n46o8q\"></span> <span class=\"footer-tp-name svelte-1n46o8q\"> </span></button>"), lp = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"16\" max=\"160\" step=\"2\" class=\"svelte-1n46o8q\"/>", 1), up = /* @__PURE__ */ H("<span class=\"toolbar-row svelte-1n46o8q\"><label class=\"ghost filepick tb-grow svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <!></span> <!>", 1), dp = /* @__PURE__ */ H("<div class=\"nav-row\"><input class=\"svelte-1n46o8q\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></div> <!>", 1), fp = /* @__PURE__ */ H("<div class=\"nav-row\"><span class=\"nav-line svelte-1n46o8q\"><span class=\"footer-soc-preview svelte-1n46o8q\" aria-hidden=\"true\"></span> <!></span> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span> <input class=\"nav-target svelte-1n46o8q\"/></div>"), pp = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <!>", 1), mp = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <!>", 1), hp = /* @__PURE__ */ H("<div class=\"panel-body svelte-1n46o8q\"><label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><div class=\"footer-tpick svelte-1n46o8q\"></div></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <!></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><!> <button class=\"ghost action svelte-1n46o8q\"> </button> <label class=\"svelte-1n46o8q\"> <!></label></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><!> <button class=\"ghost action svelte-1n46o8q\"> </button></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><!> <button class=\"ghost action svelte-1n46o8q\"> </button></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><!> <p class=\"panel-strong svelte-1n46o8q\"> </p> <!></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <p class=\"panel-strong svelte-1n46o8q\"> </p> <!> <button class=\"ghost action svelte-1n46o8q\"> </button></div></details></div>"), gp = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input type=\"date\" class=\"svelte-1n46o8q\"/></label>"), _p = /* @__PURE__ */ H("<img class=\"site-icon-preview svelte-1n46o8q\" alt=\"\"/> <button class=\"ghost row-tool svelte-1n46o8q\"></button>", 1), vp = /* @__PURE__ */ H("<img class=\"site-icon-preview svelte-1n46o8q\" alt=\"\"/>"), yp = /* @__PURE__ */ H("<span class=\"toolbar-row svelte-1n46o8q\"><input class=\"svelte-1n46o8q\"/> <label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <!> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span>"), bp = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" step=\"0.01\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" step=\"0.01\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <!> <button class=\"ghost action svelte-1n46o8q\"> </button>", 1), xp = /* @__PURE__ */ H("<details class=\"group collection-entry svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><span class=\"toolbar-row svelte-1n46o8q\"><input class=\"svelte-1n46o8q\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span> <!> <textarea rows=\"3\" class=\"svelte-1n46o8q\"></textarea> <!> <span class=\"toolbar-row svelte-1n46o8q\"><label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <!></span> <!></div></details>"), Sp = /* @__PURE__ */ H("<span class=\"toolbar-row svelte-1n46o8q\"><button class=\"ghost action svelte-1n46o8q\"> </button> <button class=\"ghost action svelte-1n46o8q\"> </button> <label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\".csv,text/csv\" class=\"svelte-1n46o8q\"/></label> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span> <!> <!> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), Cp = /* @__PURE__ */ H("<div class=\"panel-body svelte-1n46o8q\"><!> <!> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <button class=\"ghost action svelte-1n46o8q\"> </button></div>"), wp = /* @__PURE__ */ H("<span class=\"plugin-meta svelte-1n46o8q\"> </span>"), Tp = /* @__PURE__ */ H("<p class=\"panel-hint plugin-warn svelte-1n46o8q\"> </p>"), Ep = /* @__PURE__ */ H("<div><span class=\"plugin-head svelte-1n46o8q\"><span class=\"plugin-name svelte-1n46o8q\"> </span> <!> <span class=\"row-tools svelte-1n46o8q\"><label class=\"gridmenu-snap plugin-toggle svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span> <!> <!></div>"), Dp = /* @__PURE__ */ H("<div class=\"plugin-row svelte-1n46o8q\"><span class=\"plugin-head svelte-1n46o8q\"><span class=\"plugin-name svelte-1n46o8q\"> </span> <!> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span></div>"), Op = /* @__PURE__ */ H("<hr class=\"gridmenu-divider svelte-1n46o8q\"/> <p class=\"panel-strong svelte-1n46o8q\"> </p> <!>", 1), kp = /* @__PURE__ */ H("<hr class=\"gridmenu-divider svelte-1n46o8q\"/> <input class=\"svelte-1n46o8q\"/> <button class=\"ghost action svelte-1n46o8q\"> </button> <!>", 1), Ap = /* @__PURE__ */ H("<div class=\"panel-body svelte-1n46o8q\"><!> <!> <!> <!></div>"), jp = /* @__PURE__ */ H("<div><span class=\"history-msg svelte-1n46o8q\"> </span> <span class=\"history-meta svelte-1n46o8q\"> </span></div>"), Mp = /* @__PURE__ */ H("<button class=\"ghost svelte-1n46o8q\"> </button> <!>", 1), Np = /* @__PURE__ */ H("<p class=\"panel-hint svelte-1n46o8q\"> </p> <button class=\"ghost svelte-1n46o8q\"> </button>", 1), Pp = /* @__PURE__ */ H("<span class=\"update-arrow svelte-1n46o8q\"></span> <span class=\"badge svelte-1n46o8q\"> </span>", 1), Fp = /* @__PURE__ */ H("<details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><p class=\"update-notes svelte-1n46o8q\"> </p></div></details>"), Ip = /* @__PURE__ */ H("<details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"><span class=\"update-warn svelte-1n46o8q\"></span> </summary> <div class=\"group-items svelte-1n46o8q\"><pre class=\"update-headers svelte-1n46o8q\"> </pre></div></details>"), Lp = /* @__PURE__ */ H("<span class=\"chip svelte-1n46o8q\"> </span>"), Rp = /* @__PURE__ */ H("<div class=\"update-row svelte-1n46o8q\"><span class=\"update-path svelte-1n46o8q\"> </span> <span class=\"update-flags svelte-1n46o8q\"><!> <span class=\"update-warn svelte-1n46o8q\"></span></span></div>"), zp = /* @__PURE__ */ H("<div class=\"update-row svelte-1n46o8q\"><span class=\"update-path svelte-1n46o8q\"> </span> <!></div>"), Bp = /* @__PURE__ */ H("<span class=\"update-warn svelte-1n46o8q\"></span>"), Vp = /* @__PURE__ */ H("<div class=\"update-row svelte-1n46o8q\"><span> </span> <span class=\"update-flags svelte-1n46o8q\"><!> <!> <input type=\"checkbox\" class=\"svelte-1n46o8q\"/></span></div>"), Hp = /* @__PURE__ */ H("<div class=\"ctl-row update-opt-head svelte-1n46o8q\"><p class=\"panel-strong svelte-1n46o8q\"> </p> <span class=\"mini-label svelte-1n46o8q\"> </span></div> <!>", 1), Up = /* @__PURE__ */ H("<p class=\"update-summary svelte-1n46o8q\"> </p> <!> <!> <!> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"></div></details> <!> <button class=\"primary update-run svelte-1n46o8q\"> </button>", 1), Wp = /* @__PURE__ */ H("<div class=\"update-versions svelte-1n46o8q\"><span class=\"update-from svelte-1n46o8q\"> </span> <!></div> <!>", 1), Gp = /* @__PURE__ */ H("<aside class=\"panel svelte-1n46o8q\"><div class=\"panel-head svelte-1n46o8q\"><h2 class=\"svelte-1n46o8q\"> </h2> <!></div> <!></aside>"), Kp = /* @__PURE__ */ H("<nav class=\"rail svelte-1n46o8q\"><!> <span class=\"rail-settings svelte-1n46o8q\"><span class=\"rail-brand svelte-1n46o8q\" title=\"Urd\"><svg class=\"brand-mark svelte-1n46o8q\" viewBox=\"10.3 8.3 19.4 25.4\" aria-hidden=\"true\"><path d=\"M12 32V10l16 6.5V32\" fill=\"none\" stroke=\"var(--urd-brand)\" stroke-width=\"3.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg> <span class=\"brand-word svelte-1n46o8q\">Urd</span></span> <button></button> <!></span></nav> <!>", 1), qp = /* @__PURE__ */ H("<div class=\"workspace svelte-1n46o8q\"><!> <div><div class=\"stage svelte-1n46o8q\"><iframe class=\"svelte-1n46o8q\"></iframe></div></div></div>"), Jp = /* @__PURE__ */ H("<p class=\"loading svelte-1n46o8q\"> </p>"), Yp = /* @__PURE__ */ H("<p class=\"panel-hint confirm-line svelte-1n46o8q\"> </p>"), Xp = /* @__PURE__ */ H("<div class=\"setup-overlay svelte-1n46o8q\"><div class=\"setup-card svelte-1n46o8q\"><h2 class=\"svelte-1n46o8q\"> </h2> <!> <!> <span class=\"setup-actions svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"primary svelte-1n46o8q\"> </button></span></div></div>"), Zp = /* @__PURE__ */ H("<div class=\"setup-overlay svelte-1n46o8q\"><div class=\"setup-card svelte-1n46o8q\"><h2 class=\"svelte-1n46o8q\"> </h2> <p class=\"panel-hint svelte-1n46o8q\"> </p> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <p class=\"panel-hint svelte-1n46o8q\"> </p> <span class=\"setup-actions svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"primary svelte-1n46o8q\"> </button></span></div></div>"), Qp = /* @__PURE__ */ H("<div><span> </span> <button class=\"toast-x svelte-1n46o8q\">×</button></div>"), $p = /* @__PURE__ */ H("<div class=\"block-menu svelte-1n46o8q\"><header class=\"block-menu-head svelte-1n46o8q\"><span> </span> <button class=\"ghost row-tool svelte-1n46o8q\"></button></header> <div class=\"panel-body block-menu-body svelte-1n46o8q\"><!></div></div>"), em = /* @__PURE__ */ H("<div class=\"editor svelte-1n46o8q\"><!> <header><span class=\"topbar-group svelte-1n46o8q\"><!> <!></span> <span class=\"topbar-group topbar-draft svelte-1n46o8q\"><!></span> <span class=\"topbar-group topbar-right svelte-1n46o8q\"><!></span></header> <!> <!> <!> <!> <!></div>   <!>", 1);
function tm(e, t) {
	Je(t, !0);
	let n = (e, t = f, n = f) => {
		var r = lu(), i = I(r);
		Yr(i, 17, n, Gr, (e, r, i) => {
			var a = cu(), o = F(a), s = F(o);
			{
				let e = /* @__PURE__ */ A(() => Z("tip.bg.changeType")), n = /* @__PURE__ */ A(() => m.map(([e, t]) => [e, t.labelKey ? Z(t.labelKey) : t.label]));
				Q(s, {
					get value() {
						return B(r).type;
					},
					get title() {
						return B(e);
					},
					get options() {
						return B(n);
					},
					onchange: (e) => yr(t(), i, e)
				});
			}
			var c = R(s, 2), l = F(c);
			l.disabled = i === 0, K(l, () => _.up, !0), D(l);
			var u = R(l, 2);
			K(u, () => _.down, !0), D(u);
			var d = R(u, 2);
			K(d, () => _.cross, !0), D(d), D(c), D(o);
			var f = R(o, 2), p = (e) => {
				var n = ql(), a = I(n), o = F(a), s = R(o);
				{
					let e = /* @__PURE__ */ A(zr), n = /* @__PURE__ */ A(() => Z("tip.bg.layerColor"));
					ha(s, {
						get value() {
							return B(r).props.value;
						},
						get tokens() {
							return B(e);
						},
						get label() {
							return B(n);
						},
						onchange: (e) => tr(t(), i, "value", e)
					});
				}
				D(a);
				var c = R(a, 2), l = F(c), u = L(R(l));
				D(c);
				var d = R(c, 2);
				J(d), z((e, t, n) => {
					W(o, `${e ?? ""} `), W(l, `${t ?? ""} `), W(u, `${n ?? ""}%`), Y(d, B(r).props.opacity ?? 1);
				}, [
					() => Z("lbl.color"),
					() => Z("lbl.strength"),
					() => Math.round((B(r).props.opacity ?? 1) * 100)
				]), V("input", d, (e) => tr(t(), i, "opacity", Number(e.target.value))), U(e, n);
			}, h = (e) => {
				let n = /* @__PURE__ */ A(() => sr(B(r))), a = /* @__PURE__ */ A(() => B(n).stops.reduce((e, t) => e + Math.max(0, Number(t.share) || 0), 0));
				var o = Ql(), s = I(o), c = F(s), l = R(c);
				{
					let e = /* @__PURE__ */ A(() => B(n).kind ?? "linear"), r = /* @__PURE__ */ A(() => [["linear", Z("opt.grad.linear")], ["radial", Z("opt.grad.radial")]]);
					Q(l, {
						get value() {
							return B(e);
						},
						get options() {
							return B(r);
						},
						onchange: (e) => dr(t(), i, e)
					});
				}
				D(s);
				var u = R(s, 2);
				Yr(u, 17, () => B(n).stops, Gr, (e, r, o) => {
					var s = Yl();
					let c;
					var l = F(s), u = R(l, 2);
					{
						let e = /* @__PURE__ */ A(zr), n = /* @__PURE__ */ A(() => Z("tip.bg.stopColor"));
						ha(u, {
							get value() {
								return B(r).color;
							},
							get tokens() {
								return B(e);
							},
							get label() {
								return B(n);
							},
							onchange: (e) => fr(t(), i, o, { color: e })
						});
					}
					var d = R(u, 2);
					J(d);
					var f = R(d, 2), p = L(f), m = R(f, 2), h = (e) => {
						var n = Jl();
						K(n, () => _.cross, !0), D(n), z((e) => X(n, "title", e), [() => Z("tip.bg.removeStop")]), V("click", n, () => hr(t(), i, o)), U(e, n);
					};
					G(m, (e) => {
						B(n).stops.length > 2 && e(h);
					}), D(s), z((e, t, a) => {
						c = q(s, 1, "nav-line grad-stop svelte-1n46o8q", null, c, {
							dragging: B(_r)?.layer === i && B(_r).from === o,
							"drop-above": B(_r)?.layer === i && B(_r).insert === o,
							"drop-below": B(_r)?.layer === i && B(_r).insert === B(n).stops.length && o === B(n).stops.length - 1
						}), X(l, "title", e), Y(d, B(r).share ?? 50), X(d, "title", t), W(p, `${a ?? ""}%`);
					}, [
						() => Z("tip.bg.dragStop"),
						() => Z("tip.bg.stopShare"),
						() => B(a) > 0 ? Math.round(Math.max(0, Number(B(r).share) || 0) / B(a) * 100) : Math.round(100 / B(n).stops.length)
					]), V("pointerdown", l, (e) => vr(t(), e, i, o)), V("input", d, (e) => fr(t(), i, o, { share: Number(e.target.value) })), U(e, s);
				});
				var d = R(u, 2), f = L(d, !0), p = R(d, 2), m = (e) => {
					var r = Xl(), a = I(r), o = F(a), s = L(R(o));
					D(a);
					var c = R(a, 2);
					J(c);
					var l = R(c, 2), u = F(l), d = L(R(u));
					D(l);
					var f = R(l, 2);
					J(f), z((e, t, r, i) => {
						W(o, `${e ?? ""} `), W(s, `${t ?? ""}%`), Y(c, B(n).x ?? .5), W(u, `${r ?? ""} `), W(d, `${i ?? ""}%`), Y(f, B(n).y ?? .5);
					}, [
						() => Z("lbl.centerX"),
						() => Math.round((B(n).x ?? .5) * 100),
						() => Z("lbl.centerY"),
						() => Math.round((B(n).y ?? .5) * 100)
					]), V("input", c, (e) => lr(t(), i, "x", Number(e.target.value))), V("input", f, (e) => lr(t(), i, "y", Number(e.target.value))), U(e, r);
				}, h = (e) => {
					var r = Zl(), a = I(r), o = F(a), s = L(R(o));
					D(a);
					var c = R(a, 2);
					J(c), z((e) => {
						W(o, `${e ?? ""} `), W(s, `${B(n).angle ?? ""}°`), Y(c, B(n).angle);
					}, [() => Z("lbl.angle")]), V("input", c, (e) => lr(t(), i, "angle", Number(e.target.value))), U(e, r);
				};
				G(p, (e) => {
					(B(n).kind ?? "linear") === "radial" ? e(m) : e(h, -1);
				});
				var g = R(p, 2), v = F(g), y = L(R(v));
				D(g);
				var b = R(g, 2);
				J(b);
				var x = R(b, 2), S = F(x), C = R(S);
				{
					let e = /* @__PURE__ */ A(() => B(n).animation ?? "none");
					Q(C, {
						get value() {
							return B(e);
						},
						get options() {
							return ur[(B(n).kind ?? "linear") === "radial" ? "radial" : "linear"];
						},
						onchange: (e) => lr(t(), i, "animation", e)
					});
				}
				D(x), z((e, t, r, i, a, o, s) => {
					W(c, `${e ?? ""} `), X(d, "title", t), W(f, r), W(v, `${i ?? ""} `), W(y, `${a ?? ""}%`), Y(b, B(n).opacity ?? 1), X(x, "title", o), W(S, `${s ?? ""} `);
				}, [
					() => Z("blocks.shape"),
					() => Z("tip.bg.addStop"),
					() => Z("ui.addStop"),
					() => Z("lbl.strength"),
					() => Math.round((B(n).opacity ?? 1) * 100),
					() => Z("tip.bg.motion"),
					() => Z("lbl.motion")
				]), V("click", d, () => mr(t(), i)), V("input", b, (e) => lr(t(), i, "opacity", Number(e.target.value))), U(e, o);
			}, g = (e) => {
				var n = $l(), a = I(n), o = F(a), s = R(o);
				{
					let e = /* @__PURE__ */ A(zr), n = /* @__PURE__ */ A(() => Z("tip.bg.glowColor"));
					ha(s, {
						get value() {
							return B(r).props.color;
						},
						get tokens() {
							return B(e);
						},
						get label() {
							return B(n);
						},
						onchange: (e) => tr(t(), i, "color", e)
					});
				}
				D(a);
				var c = R(a, 2), l = F(c), u = L(R(l));
				D(c);
				var d = R(c, 2);
				J(d);
				var f = R(d, 2), p = F(f), m = L(R(p));
				D(f);
				var h = R(f, 2);
				J(h);
				var g = R(h, 2), _ = F(g), v = L(R(_));
				D(g);
				var y = R(g, 2);
				J(y);
				var b = R(y, 2), x = F(b), S = L(R(x));
				D(b);
				var C = R(b, 2);
				J(C), z((e, t, n, i, a, s, c, f, g) => {
					W(o, `${e ?? ""} `), W(l, `${t ?? ""} `), W(u, `${n ?? ""}%`), Y(d, B(r).props.x), W(p, `${i ?? ""} `), W(m, `${a ?? ""}%`), Y(h, B(r).props.y), W(_, `${s ?? ""} `), W(v, `${c ?? ""}%`), Y(y, B(r).props.radius), W(x, `${f ?? ""} `), W(S, `${g ?? ""}%`), Y(C, B(r).props.opacity);
				}, [
					() => Z("lbl.color"),
					() => Z("lbl.posX"),
					() => Math.round(B(r).props.x * 100),
					() => Z("lbl.posY"),
					() => Math.round(B(r).props.y * 100),
					() => Z("lbl.size"),
					() => Math.round(B(r).props.radius * 100),
					() => Z("lbl.strength"),
					() => Math.round(B(r).props.opacity * 100)
				]), V("input", d, (e) => tr(t(), i, "x", Number(e.target.value))), V("input", h, (e) => tr(t(), i, "y", Number(e.target.value))), V("input", y, (e) => tr(t(), i, "radius", Number(e.target.value))), V("input", C, (e) => tr(t(), i, "opacity", Number(e.target.value))), U(e, n);
			}, v = (e) => {
				var n = eu(), a = I(n), o = F(a), s = L(R(o));
				D(a);
				var c = R(a, 2);
				J(c), z((e, t) => {
					W(o, `${e ?? ""} `), W(s, `${t ?? ""}%`), Y(c, B(r).props.opacity);
				}, [() => Z("lbl.strength"), () => Math.round(B(r).props.opacity * 100)]), V("input", c, (e) => tr(t(), i, "opacity", Number(e.target.value))), U(e, n);
			}, y = (e) => {
				let n = /* @__PURE__ */ A(() => B(r).props.fit === "tile" || B(r).props.fit === "repeat");
				var a = ru(), o = I(a), s = F(o), c = R(s);
				D(o);
				var l = R(o, 2), u = F(l), d = R(u);
				{
					let e = /* @__PURE__ */ A(() => B(n) ? "tile" : "plain"), r = /* @__PURE__ */ A(() => [["plain", Z("opt.img.plain")], ["tile", Z("opt.img.tile")]]);
					Q(d, {
						get value() {
							return B(e);
						},
						get options() {
							return B(r);
						},
						onchange: (e) => tr(t(), i, "fit", e)
					});
				}
				D(l);
				var f = R(l, 2), p = L(f, !0), m = R(f, 2), h = F(m), g = R(h, 2);
				J(g);
				var _ = R(g, 4);
				D(m);
				var v = R(m, 2), y = (e) => {
					var n = tu(), a = I(n), o = F(a), s = L(o, !0), c = R(o, 2), l = L(c, !0);
					D(a);
					var u = R(a, 2), d = L(u, !0), f = R(u, 2), p = R(f, 2), m = F(p), h = L(R(m));
					D(p);
					var g = R(p, 2);
					J(g);
					var _ = R(g, 2), v = F(_), y = L(R(v));
					D(_);
					var b = R(_, 2);
					J(b), z((e, t, n, i, a, p, _, x, S, C, w, T) => {
						X(o, "title", e), W(s, t), X(c, "title", n), W(l, i), X(u, "title", a), W(d, p), _i(f, `--fx:${_ ?? ""}%; --fy:${x ?? ""}%`), W(m, `${S ?? ""} `), W(h, `${C ?? ""}%`), Y(g, B(r).props.x ?? .5), W(v, `${w ?? ""} `), W(y, `${T ?? ""}%`), Y(b, B(r).props.y ?? .5);
					}, [
						() => Z("tip.bg.cover"),
						() => Z("ui.cover"),
						() => Z("opt.fitFrame.contain"),
						() => Z("opt.fit.contain"),
						() => Z("tip.bg.position"),
						() => Z("lbl.position"),
						() => Math.max(0, Math.min(1, B(r).props.x ?? .5)) * 100,
						() => Math.max(0, Math.min(1, B(r).props.y ?? .5)) * 100,
						() => Z("lbl.horizontal"),
						() => Math.round((B(r).props.x ?? .5) * 100),
						() => Z("lbl.vertical"),
						() => Math.round((B(r).props.y ?? .5) * 100)
					]), V("click", o, () => or(t(), i, B(r), "cover")), V("click", c, () => or(t(), i, B(r), "contain")), V("pointerdown", f, (e) => nr(e, t(), i, "xy")), V("input", g, (e) => tr(t(), i, "x", Number(e.target.value))), V("input", b, (e) => tr(t(), i, "y", Number(e.target.value))), U(e, n);
				};
				G(v, (e) => {
					B(n) || e(y);
				});
				var b = R(v, 2), x = F(b), S = L(R(x));
				D(b);
				var C = R(b, 2);
				J(C);
				var w = R(C, 2), T = F(w), ee = L(R(T));
				D(w);
				var te = R(w, 2);
				J(te);
				var ne = R(te, 2), E = F(ne);
				J(E);
				var re = R(E);
				D(ne);
				var ie = R(ne, 2), ae = (e) => {
					var n = nu(), a = I(n), o = F(a), s = L(R(o));
					D(a);
					var c = R(a, 2);
					J(c);
					var l = R(c, 2), u = F(l), d = R(u);
					{
						let e = /* @__PURE__ */ A(() => B(r).props.bleed ?? "none"), n = /* @__PURE__ */ A(() => [
							["none", Z("common.none")],
							["up", Z("opt.bleed.up")],
							["down", Z("opt.bleed.down")],
							["both", Z("opt.brand.both")]
						]);
						Q(d, {
							get value() {
								return B(e);
							},
							get options() {
								return B(n);
							},
							onchange: (e) => tr(t(), i, "bleed", e)
						});
					}
					D(l), z((e, t, n, i) => {
						W(o, `${e ?? ""} `), W(s, `${t ?? ""}%`), Y(c, B(r).props.parallax ?? .3), X(l, "title", n), W(u, `${i ?? ""} `);
					}, [
						() => Z("lbl.parallaxStrength"),
						() => Math.round((B(r).props.parallax ?? 0) * 100),
						() => Z("tip.bg.bleed"),
						() => Z("lbl.bleed")
					]), V("input", c, (e) => tr(t(), i, "parallax", Number(e.target.value))), U(e, n);
				};
				G(ie, (e) => {
					(B(r).props.parallax ?? 0) > 0 && e(ae);
				}), z((e, t, n, i, a, c, d, m, v, y, b, w, ie, ae) => {
					X(o, "title", e), W(s, `${t ?? ""} `), X(l, "title", n), W(u, `${i ?? ""} `), X(f, "title", a), W(p, c), X(h, "title", d), Y(g, m), X(_, "title", v), W(x, `${y ?? ""} `), W(S, `${B(r).props.blur ?? 0 ?? ""} px`), Y(C, B(r).props.blur ?? 0), W(T, `${b ?? ""} `), W(ee, `${w ?? ""}%`), Y(te, B(r).props.opacity ?? 1), X(ne, "title", ie), Si(E, (B(r).props.parallax ?? 0) > 0), W(re, ` ${ae ?? ""}`);
				}, [
					() => Z("tip.webpAuto"),
					() => B(r).props.src ? Z("ui.changeImage") : Z("ui.chooseImage"),
					() => Z("tip.bg.fit"),
					() => Z("lbl.fit"),
					() => Z("tip.bg.size"),
					() => Z("lbl.size"),
					() => Z("tip.smaller"),
					() => Math.round((B(r).props.size ?? 1) * 100),
					() => Z("tip.larger"),
					() => Z("lbl.blur"),
					() => Z("lbl.strength"),
					() => Math.round((B(r).props.opacity ?? 1) * 100),
					() => Z("tip.bg.parallax"),
					() => Z("lbl.parallax")
				]), V("change", c, (e) => Tr(t(), i, e)), V("click", h, () => ir(t(), i, B(r).props.size ?? 1, -.05)), V("change", g, (e) => ar(t(), i, e.target.value)), V("click", _, () => ir(t(), i, B(r).props.size ?? 1, .05)), V("input", C, (e) => tr(t(), i, "blur", Number(e.target.value))), V("input", te, (e) => tr(t(), i, "opacity", Number(e.target.value))), V("change", E, (e) => tr(t(), i, "parallax", e.target.checked ? .3 : 0)), U(e, a);
			}, b = (e) => {
				var n = au(), a = I(n), o = F(a), s = R(o);
				D(a);
				var c = R(a, 2);
				Yr(c, 17, () => B(r).props.images ?? [], Gr, (e, n, a) => {
					var o = iu(), s = I(o), c = F(s), l = R(c, 2), u = F(l);
					u.disabled = a === 0, K(u, () => _.up, !0), D(u);
					var d = R(u, 2);
					K(d, () => _.down, !0), D(d);
					var f = R(d, 2);
					K(f, () => _.cross, !0), D(f), D(l), D(s);
					var p = R(s, 2), m = F(p), h = L(R(m));
					D(p);
					var g = R(p, 2);
					J(g);
					var v = R(g, 2), y = F(v), b = L(R(y));
					D(v);
					var x = R(v, 2);
					J(x), z((e, t, i, o, s) => {
						X(c, "src", B(n).src), d.disabled = a === B(r).props.images.length - 1, X(f, "title", e), W(m, `${t ?? ""} `), W(h, `${i ?? ""}%`), Y(g, B(n).x ?? .5), W(y, `${o ?? ""} `), W(b, `${s ?? ""}%`), Y(x, B(n).y ?? .5);
					}, [
						() => Z("tip.removeImage"),
						() => Z("lbl.focusX"),
						() => Math.round((B(n).x ?? .5) * 100),
						() => Z("lbl.focusY"),
						() => Math.round((B(n).y ?? .5) * 100)
					]), V("click", u, () => kr(t(), i, a, -1)), V("click", d, () => kr(t(), i, a, 1)), V("click", f, () => Ar(t(), i, a)), V("input", g, (e) => jr(t(), i, a, "x", Number(e.target.value))), V("input", x, (e) => jr(t(), i, a, "y", Number(e.target.value))), U(e, o);
				});
				var l = R(c, 2), u = F(l), d = R(u);
				{
					let e = /* @__PURE__ */ A(() => B(r).props.fit ?? "cover"), n = /* @__PURE__ */ A(() => [["cover", Z("opt.fit.cover")], ["contain", Z("opt.fit.contain")]]);
					Q(d, {
						get value() {
							return B(e);
						},
						get options() {
							return B(n);
						},
						onchange: (e) => tr(t(), i, "fit", e)
					});
				}
				D(l);
				var f = R(l, 2), p = F(f), m = R(p);
				J(m), D(f);
				var h = R(f, 2), g = F(h), v = L(R(g));
				D(h);
				var y = R(h, 2);
				J(y);
				var b = R(y, 2), x = F(b), S = L(R(x));
				D(b);
				var C = R(b, 2);
				J(C);
				var w = R(C, 2), T = F(w), ee = L(R(T));
				D(w);
				var te = R(w, 2);
				J(te);
				var ne = L(R(te, 2), !0);
				z((e, t, n, i, s, c, l, d, h, _, b) => {
					X(a, "title", e), W(o, `${t ?? ""} `), W(u, `${n ?? ""} `), X(f, "title", i), W(p, `${s ?? ""} `), Y(m, B(r).props.interval ?? 6), W(g, `${c ?? ""} `), W(v, `${l ?? ""} s`), Y(y, B(r).props.fade ?? 1.5), W(x, `${d ?? ""} `), W(S, `${B(r).props.blur ?? 0 ?? ""} px`), Y(C, B(r).props.blur ?? 0), W(T, `${h ?? ""} `), W(ee, `${_ ?? ""}%`), Y(te, B(r).props.opacity ?? 1), W(ne, b);
				}, [
					() => Z("tip.bg.addImages"),
					() => Z("ui.addImages"),
					() => Z("lbl.fit"),
					() => Z("hint.bg.gallery"),
					() => Z("lbl.secondsPerImage"),
					() => Z("lbl.transition"),
					() => (B(r).props.fade ?? 1.5).toFixed(1),
					() => Z("lbl.blur"),
					() => Z("lbl.strength"),
					() => Math.round((B(r).props.opacity ?? 1) * 100),
					() => Z("hint.bg.gallery")
				]), V("change", s, (e) => Or(t(), i, e)), V("change", m, (e) => tr(t(), i, "interval", Number(e.target.value))), V("input", y, (e) => tr(t(), i, "fade", Number(e.target.value))), V("input", C, (e) => tr(t(), i, "blur", Number(e.target.value))), V("input", te, (e) => tr(t(), i, "opacity", Number(e.target.value))), U(e, n);
			}, x = (e) => {
				var n = su(), a = I(n), o = F(a), s = R(o);
				D(a);
				var c = R(a, 2), l = F(c), u = R(l);
				D(c);
				var d = R(c, 2), f = F(d), p = R(f);
				{
					let e = /* @__PURE__ */ A(() => B(r).props.fit ?? "cover"), n = /* @__PURE__ */ A(() => [["cover", Z("opt.fit.cover")], ["contain", Z("opt.fit.contain")]]);
					Q(p, {
						get value() {
							return B(e);
						},
						get options() {
							return B(n);
						},
						onchange: (e) => tr(t(), i, "fit", e)
					});
				}
				D(d);
				var m = R(d, 2), h = F(m), g = L(R(h));
				D(m);
				var _ = R(m, 2);
				J(_);
				var v = R(_, 2), y = F(v), b = L(R(y));
				D(v);
				var x = R(v, 2);
				J(x);
				var S = R(x, 2), C = F(S), w = L(R(C));
				D(S);
				var T = R(S, 2);
				J(T);
				var ee = R(T, 2), te = F(ee);
				J(te);
				var ne = R(te);
				D(ee);
				var E = R(ee, 2), re = (e) => {
					var n = ou(), a = I(n), o = F(a), s = L(R(o));
					D(a);
					var c = R(a, 2);
					J(c), z((e, t) => {
						W(o, `${e ?? ""} `), W(s, `${t ?? ""}%`), Y(c, B(r).props.parallax ?? .3);
					}, [() => Z("lbl.parallaxStrength"), () => Math.round((B(r).props.parallax ?? 0) * 100)]), V("input", c, (e) => tr(t(), i, "parallax", Number(e.target.value))), U(e, n);
				};
				G(E, (e) => {
					(B(r).props.parallax ?? 0) > 0 && e(re);
				}), z((e, t, n, i, s, u, p, m, v, S, E, re, ie, ae) => {
					X(a, "title", e), W(o, `${t ?? ""} `), X(c, "title", n), W(l, `${i ?? ""} `), X(d, "title", s), W(f, `${u ?? ""} `), W(h, `${p ?? ""} `), W(g, `${m ?? ""}%`), Y(_, B(r).props.x ?? .5), W(y, `${v ?? ""} `), W(b, `${S ?? ""}%`), Y(x, B(r).props.y ?? .5), W(C, `${E ?? ""} `), W(w, `${re ?? ""}%`), Y(T, B(r).props.opacity ?? 1), X(ee, "title", ie), Si(te, (B(r).props.parallax ?? 0) > 0), W(ne, ` ${ae ?? ""}`);
				}, [
					() => Z("tip.bg.videoFile"),
					() => B(r).props.src ? Z("ui.changeVideo") : Z("ui.chooseVideo"),
					() => Z("tip.bg.poster"),
					() => B(r).props.poster ? Z("ui.changeImage") : Z("ui.choosePoster"),
					() => Z("tip.bg.fit"),
					() => Z("lbl.fit"),
					() => Z("lbl.horizontal"),
					() => Math.round((B(r).props.x ?? .5) * 100),
					() => Z("lbl.vertical"),
					() => Math.round((B(r).props.y ?? .5) * 100),
					() => Z("lbl.strength"),
					() => Math.round((B(r).props.opacity ?? 1) * 100),
					() => Z("tip.bg.parallax"),
					() => Z("lbl.parallax")
				]), V("change", s, (e) => Er(t(), i, e)), V("change", u, (e) => Dr(t(), i, e)), V("input", _, (e) => tr(t(), i, "x", Number(e.target.value))), V("input", x, (e) => tr(t(), i, "y", Number(e.target.value))), V("input", T, (e) => tr(t(), i, "opacity", Number(e.target.value))), V("change", te, (e) => tr(t(), i, "parallax", e.target.checked ? .3 : 0)), U(e, n);
			};
			G(f, (e) => {
				B(r).type === "color" ? e(p) : B(r).type === "gradient" ? e(h, 1) : B(r).type === "glow" ? e(g, 2) : B(r).type === "grain" ? e(v, 3) : B(r).type === "image" ? e(y, 4) : B(r).type === "slideshow" ? e(b, 5) : B(r).type === "video" && e(x, 6);
			}), D(a), z((e, t, r) => {
				X(l, "title", e), X(u, "title", t), u.disabled = i === n().length - 1, X(d, "title", r);
			}, [
				() => Z("hint.bg.order"),
				() => Z("hint.bg.order"),
				() => Z("tip.bg.removeLayer")
			]), V("click", l, () => er(t(), i, -1)), V("click", u, () => er(t(), i, 1)), V("click", d, () => $n(t(), i)), U(e, a);
		});
		var a = R(i, 2), o = F(a), s = R(o);
		{
			let e = /* @__PURE__ */ A(() => m.map(([e, t]) => [e, t.labelKey ? Z(t.labelKey) : t.label]));
			Q(s, {
				get value() {
					return B(Zn);
				},
				get options() {
					return B(e);
				},
				onchange: (e) => P(Zn, e, !0)
			});
		}
		D(a);
		var c = R(a, 2), l = L(c, !0);
		z((e, t) => {
			W(o, `${e ?? ""} `), W(l, t);
		}, [() => Z("lbl.newLayer"), () => Z("ui.addLayer")]), V("click", c, () => Qn(t(), B(Zn))), U(e, r);
	}, r = (e, t = f, n = f) => {
		var r = Pr();
		Yr(I(r), 17, n, Gr, (e, r, i) => {
			var a = du(), o = F(a);
			J(o);
			var s = R(o, 2), c = F(s);
			c.disabled = i === 0, K(c, () => _.up, !0), D(c);
			var l = R(c, 2);
			K(l, () => _.down, !0), D(l);
			var u = R(l, 2);
			K(u, () => _.cross, !0), D(u), D(s);
			var d = R(s, 2), f = F(d);
			{
				let e = /* @__PURE__ */ A(() => B(r).page ?? "__href"), n = /* @__PURE__ */ A(() => Z("tip.linkTarget")), a = /* @__PURE__ */ A(() => [...B(k).pages.map((e) => [e.id, e.title]), ["__href", Z("opt.linkHref")]]);
				Q(f, {
					get value() {
						return B(e);
					},
					get title() {
						return B(n);
					},
					get options() {
						return B(a);
					},
					onchange: (e) => Sl(t(), i, e)
				});
			}
			D(d);
			var p = R(d, 2), m = (e) => {
				var n = uu();
				J(n), z((e, t) => {
					Y(n, B(r).href ?? ""), X(n, "placeholder", e), X(n, "title", t);
				}, [() => Z("ph.hrefAnchor"), () => Z("tip.hrefAnchor")]), V("change", n, (e) => Cl(t(), i, e.target.value)), U(e, n);
			};
			G(p, (e) => {
				B(r).page || e(m);
			}), D(a), z((e, t) => {
				Y(o, B(r).label), X(o, "title", e), l.disabled = i === n().length - 1, X(u, "title", t);
			}, [() => Z("tip.linkLabel"), () => Z("tip.removeLink")]), V("input", o, (e) => xl(t(), i, e.target.value)), V("click", c, () => bl(t(), i, -1)), V("click", l, () => bl(t(), i, 1)), V("click", u, () => yl(t(), i)), U(e, a);
		}), U(e, r);
	}, i = (e) => {
		let t = /* @__PURE__ */ A(() => B(j).props.boxStyle ?? {});
		var n = mu(), r = I(n), i = F(r), a = R(i);
		{
			let e = /* @__PURE__ */ A(() => B(t).bg ?? ""), n = /* @__PURE__ */ A(zr), r = /* @__PURE__ */ A(() => Z("tip.box.bg"));
			ha(a, {
				get value() {
					return B(e);
				},
				get tokens() {
					return B(n);
				},
				allowClear: !0,
				get label() {
					return B(r);
				},
				onchange: (e) => sn({ bg: e || null })
			});
		}
		D(r);
		var o = R(r, 2), s = F(o), c = R(s);
		{
			let e = /* @__PURE__ */ A(() => B(t).shadow ?? ""), n = /* @__PURE__ */ A(() => [
				["", Z("common.none")],
				["soft", Z("opt.shadow.soft")],
				["strong", Z("opt.shadow.strong")]
			]);
			Q(c, {
				get value() {
					return B(e);
				},
				get options() {
					return B(n);
				},
				onchange: (e) => sn({ shadow: e || null })
			});
		}
		D(o);
		var l = R(o, 2), u = (e) => {
			var n = fu(), r = F(n), i = R(r);
			{
				let e = /* @__PURE__ */ A(() => B(t).shadowColor ?? ""), n = /* @__PURE__ */ A(zr), r = /* @__PURE__ */ A(() => Z("tip.box.shadowColor"));
				ha(i, {
					get value() {
						return B(e);
					},
					get tokens() {
						return B(n);
					},
					allowClear: !0,
					get label() {
						return B(r);
					},
					onchange: (e) => sn({ shadowColor: e || null })
				});
			}
			D(n), z((e) => W(r, `${e ?? ""} `), [() => Z("lbl.shadowColor")]), U(e, n);
		};
		G(l, (e) => {
			B(t).shadow && e(u);
		});
		var d = R(l, 2), f = F(d), p = R(f);
		{
			let e = /* @__PURE__ */ A(() => B(t).border === "none" ? "none" : B(t).border ? "custom" : ""), n = /* @__PURE__ */ A(() => [
				["", Z("opt.border.theme")],
				["none", Z("common.none")],
				["custom", Z("opt.border.custom")]
			]);
			Q(p, {
				get value() {
					return B(e);
				},
				get options() {
					return B(n);
				},
				onchange: (e) => sn({ border: e === "custom" ? {
					color: "accent",
					width: 1
				} : e || null })
			});
		}
		D(d);
		var m = R(d, 2), h = (e) => {
			let n = /* @__PURE__ */ A(() => typeof B(t).border == "object" ? B(t).border : {
				color: "text",
				width: 1
			});
			var r = pu(), i = I(r), a = F(i), o = R(a);
			{
				let e = /* @__PURE__ */ A(zr), t = /* @__PURE__ */ A(() => Z("tip.box.borderColor"));
				ha(o, {
					get value() {
						return B(n).color;
					},
					get tokens() {
						return B(e);
					},
					get label() {
						return B(t);
					},
					onchange: (e) => sn({ border: {
						...B(n),
						color: e
					} })
				});
			}
			D(i);
			var s = R(i, 2), c = F(s), l = R(c), u = F(l), d = R(u, 2);
			J(d);
			var f = R(d, 2);
			D(l), D(s), z((e, t, r, i, o, s) => {
				W(a, `${e ?? ""} `), W(c, `${t ?? ""} `), X(u, "title", r), X(u, "aria-label", i), Y(d, B(n).width), X(f, "title", o), X(f, "aria-label", s);
			}, [
				() => Z("lbl.borderColor"),
				() => Z("lbl.thicknessPx"),
				() => Z("tip.thinner"),
				() => Z("tip.thinner"),
				() => Z("tip.thicker"),
				() => Z("tip.thicker")
			]), V("click", u, () => sn({ border: {
				...B(n),
				width: Math.max(1, B(n).width - 1)
			} })), V("change", d, (e) => sn({ border: {
				...B(n),
				width: Math.min(12, Math.max(1, Number(e.target.value) || 1))
			} })), V("click", f, () => sn({ border: {
				...B(n),
				width: Math.min(12, B(n).width + 1)
			} })), U(e, r);
		};
		G(m, (e) => {
			B(t).border !== "none" && e(h);
		});
		var g = R(m, 2), _ = F(g);
		J(_);
		var v = R(_);
		D(g), z((e, t, n, r, a, o) => {
			W(i, `${e ?? ""} `), W(s, `${t ?? ""} `), W(f, `${n ?? ""} `), X(g, "title", r), Si(_, a), W(v, ` ${o ?? ""}`);
		}, [
			() => Z("lbl.blockColor"),
			() => Z("lbl.shadow"),
			() => Z("lbl.border"),
			() => Z("tip.box.glass"),
			() => !!B(t).glass,
			() => Z("lbl.glass")
		]), V("change", _, (e) => sn({ glass: e.target.checked || null })), U(e, n);
	}, a = (e) => {
		var t = Sd(), n = I(t), r = F(n), a = F(r);
		let o;
		var s = L(a, !0), c = R(a, 2);
		let l;
		var u = L(c, !0);
		D(r), D(n);
		var d = R(n, 2), f = (e) => {
			var t = Pr(), n = I(t), r = (e) => {
				var t = hu(), n = L(t, !0);
				z((e) => W(n, e), [() => Z("hint.textInline")]), U(e, t);
			}, i = (e) => {
				var t = bu(), n = I(t), r = F(n), i = R(r);
				{
					let e = /* @__PURE__ */ A(() => B(j).props.mode ?? "mailto"), t = /* @__PURE__ */ A(() => [["mailto", Z("form.modeMailto")], ["endpoint", Z("form.modeEndpoint")]]);
					Q(i, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("mode", e)
					});
				}
				D(n);
				var a = R(n, 2), o = (e) => {
					var t = gu(), n = F(t), r = R(n);
					J(r), D(t), z((e, i, a) => {
						X(t, "title", e), W(n, `${i ?? ""} `), Y(r, B(j).props.endpoint ?? ""), X(r, "placeholder", a);
					}, [
						() => Z("form.endpointNote"),
						() => Z("form.endpoint"),
						() => Z("form.endpointPh")
					]), V("change", r, (e) => M("endpoint", e.target.value.trim())), U(e, t);
				}, s = (e) => {
					var t = _u(), n = I(t), r = F(n), i = R(r);
					J(i), D(n);
					var a = R(n, 2), o = F(a), s = R(o);
					J(s), D(a), z((e, t, n, a) => {
						W(r, `${e ?? ""} `), Y(i, B(j).props.recipient ?? ""), X(i, "placeholder", t), W(o, `${n ?? ""} `), Y(s, B(j).props.subject ?? ""), X(s, "placeholder", a);
					}, [
						() => Z("form.recipient"),
						() => Z("form.recipientPh"),
						() => Z("form.subject"),
						() => Z("form.subjectPh")
					]), V("change", i, (e) => M("recipient", e.target.value.trim())), V("change", s, (e) => M("subject", e.target.value.trim())), U(e, t);
				};
				G(a, (e) => {
					(B(j).props.mode ?? "mailto") === "endpoint" ? e(o) : e(s, -1);
				});
				var c = R(a, 2), l = L(c, !0), u = R(c, 2);
				Yr(u, 19, () => B(j).props.fields ?? [], (e, t) => e.id ?? t, (e, t, n) => {
					var r = yu(), i = I(r), a = F(i);
					J(a);
					var o = R(a, 2);
					{
						let e = /* @__PURE__ */ A(() => B(t).type ?? "text"), r = /* @__PURE__ */ A(() => cn.map((e) => [e, Z(`form.type${e[0].toUpperCase()}${e.slice(1)}`)]));
						Q(o, {
							get value() {
								return B(e);
							},
							get options() {
								return B(r);
							},
							onchange: (e) => dn(B(n), { type: e })
						});
					}
					var s = R(o, 2), c = F(s);
					K(c, () => _.up, !0), D(c);
					var l = R(c, 2);
					K(l, () => _.down, !0), D(l);
					var u = R(l, 2);
					K(u, () => _.cross, !0), D(u), D(s), D(i);
					var d = R(i, 2), f = F(d);
					J(f);
					var p = R(f);
					D(d);
					var m = R(d, 2), h = (e) => {
						var r = vu();
						J(r), z((e, t) => {
							Y(r, e), X(r, "placeholder", t);
						}, [() => (B(t).options ?? []).join(", "), () => Z("form.optionsPh")]), V("change", r, (e) => fn(B(n), e.target.value)), U(e, r);
					}, g = /* @__PURE__ */ A(() => ln.has(B(t).type));
					G(m, (e) => {
						B(g) && e(h);
					}), z((e, r, i) => {
						Y(a, B(t).label), X(a, "placeholder", e), c.disabled = B(n) === 0, l.disabled = B(n) === (B(j).props.fields?.length ?? 0) - 1, X(u, "title", r), Si(f, B(t).required === !0), W(p, ` ${i ?? ""}`);
					}, [
						() => Z("form.fieldNamePh"),
						() => Z("form.removeField"),
						() => Z("form.required")
					]), V("change", a, (e) => dn(B(n), { label: e.target.value.trim() || Z("form.fieldFallback") })), V("click", c, () => hn(B(n), -1)), V("click", l, () => hn(B(n), 1)), V("click", u, () => mn(B(n))), V("change", f, (e) => dn(B(n), { required: e.target.checked })), U(e, r);
				});
				var d = R(u, 2), f = L(d, !0), p = R(d, 2), m = F(p), h = R(m);
				J(h), D(p);
				var g = R(p, 2), v = F(g), y = R(v);
				J(y), D(g), z((e, t, i, a, o, s, c, u) => {
					X(n, "title", e), W(r, `${t ?? ""} `), W(l, i), W(f, a), W(m, `${o ?? ""} `), Y(h, B(j).props.submitLabel ?? ""), X(h, "placeholder", s), W(v, `${c ?? ""} `), Y(y, B(j).props.successText ?? ""), X(y, "placeholder", u);
				}, [
					() => Z("form.modeTitle"),
					() => Z("form.mode"),
					() => Z("form.fields"),
					() => Z("form.addField"),
					() => Z("lbl.buttonText"),
					() => Z("form.sendDefault"),
					() => Z("form.receipt"),
					() => Z("form.thanksDefault")
				]), V("click", d, pn), V("change", h, (e) => M("submitLabel", e.target.value.trim() || Z("form.sendDefault"))), V("change", y, (e) => M("successText", e.target.value.trim() || Z("form.thanksDefault"))), U(e, t);
			}, a = (e) => {
				var t = Su(), n = I(t), r = F(n), i = R(r);
				ut(i), D(n);
				var a = R(n, 2), o = F(a), s = R(o);
				{
					let e = /* @__PURE__ */ A(() => B(j).props.view ?? "list"), t = /* @__PURE__ */ A(() => [
						["list", Z("calendar.viewList")],
						["cards", Z("calendar.viewCards")],
						["month", Z("calendar.viewMonth")],
						["next", Z("calendar.viewNext")]
					]);
					Q(s, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("view", e)
					});
				}
				D(a);
				var c = R(a, 2), l = (e) => {
					var t = xu(), n = F(t), r = R(n);
					J(r), D(t), z((e, i) => {
						X(t, "title", e), W(n, `${i ?? ""} `), Y(r, B(j).props.limit ?? 6);
					}, [() => Z("tip.collection.limit"), () => Z("lbl.maxCount")]), V("change", r, (e) => M("limit", Math.max(1, Math.min(50, Number(e.target.value) || 6)))), U(e, t);
				};
				G(c, (e) => {
					((B(j).props.view ?? "list") === "list" || B(j).props.view === "cards") && e(l);
				});
				var u = R(c, 2), d = F(u);
				J(d);
				var f = R(d);
				D(u);
				var p = R(u, 2), m = F(p);
				J(m);
				var h = R(m);
				D(p), z((e, t, n, a, s, c) => {
					W(r, `${e ?? ""} `), X(i, "placeholder", t), Y(i, n), W(o, `${a ?? ""} `), Si(d, B(j).props.showCategories !== !1), W(f, ` ${s ?? ""}`), Si(m, B(j).props.showSubscribe !== !1), W(h, ` ${c ?? ""}`);
				}, [
					() => Z("calendar.sources"),
					() => Z("calendar.sourcesPh"),
					() => (B(j).props.sources ?? []).join("\n"),
					() => Z("lbl.view"),
					() => Z("calendar.showCategories"),
					() => Z("calendar.showSubscribe")
				]), V("change", i, (e) => gn(e.target.value)), V("change", d, (e) => M("showCategories", e.target.checked)), V("change", m, (e) => M("showSubscribe", e.target.checked)), U(e, t);
			}, o = (e) => {
				var t = wu(), n = I(t), r = F(n);
				J(r);
				var i = R(r);
				D(n);
				var a = R(n, 2), o = L(a, !0), s = R(a, 2);
				Yr(s, 17, () => B(j).props.items ?? [], Gr, (e, t, n) => {
					var r = Cu(), i = F(r);
					J(i);
					var a = R(i, 2), o = F(a);
					o.disabled = n === 0, K(o, () => _.up, !0), D(o);
					var s = R(o, 2);
					K(s, () => _.down, !0), D(s);
					var c = R(s, 2);
					K(c, () => _.cross, !0), D(c), D(a), D(r), z((e, r) => {
						Y(i, B(t).q), X(i, "title", e), s.disabled = n === (B(j).props.items?.length ?? 0) - 1, X(c, "title", r);
					}, [() => Z("tip.faq.question"), () => Z("tip.faq.remove")]), V("change", i, (e) => _n(n, { q: e.target.value })), V("click", o, () => bn(n, -1)), V("click", s, () => bn(n, 1)), V("click", c, () => yn(n)), U(e, r);
				});
				var c = R(s, 2), l = L(c, !0);
				z((e, t, a, s, c) => {
					X(n, "title", e), Si(r, t), W(i, ` ${a ?? ""}`), W(o, s), W(l, c);
				}, [
					() => Z("tip.faq.multi"),
					() => !!B(j).props.multi,
					() => Z("lbl.faqMulti"),
					() => Z("lbl.questions"),
					() => Z("ui.addQuestion")
				]), V("change", r, (e) => M("multi", e.target.checked)), V("click", c, vn), U(e, t);
			}, s = (e) => {
				var t = Eu(), n = I(t), r = L(n, !0), i = R(n, 2);
				Yr(i, 17, () => B(j).props.items ?? [], Gr, (e, t, n) => {
					var r = Tu(), i = I(r), a = F(i);
					J(a);
					var o = R(a, 2);
					J(o);
					var s = R(o, 2), c = F(s);
					c.disabled = n === 0, K(c, () => _.up, !0), D(c);
					var l = R(c, 2);
					K(l, () => _.down, !0), D(l);
					var u = R(l, 2);
					K(u, () => _.cross, !0), D(u), D(s), D(i);
					var d = R(i, 2);
					J(d), z((e, r, i, s, c, f) => {
						Y(a, B(t).year), X(a, "placeholder", e), X(a, "title", r), Y(o, B(t).title), X(o, "title", i), l.disabled = n === (B(j).props.items?.length ?? 0) - 1, X(u, "title", s), Y(d, B(t).text), X(d, "placeholder", c), X(d, "title", f);
					}, [
						() => Z("ph.tlYear"),
						() => Z("tip.timeline.year"),
						() => Z("tip.timeline.title"),
						() => Z("tip.timeline.remove"),
						() => Z("ph.tlText"),
						() => Z("tip.timeline.text")
					]), V("change", a, (e) => Sn(n, { year: e.target.value })), V("change", o, (e) => Sn(n, { title: e.target.value })), V("click", c, () => Tn(n, -1)), V("click", l, () => Tn(n, 1)), V("click", u, () => wn(n)), V("change", d, (e) => Sn(n, { text: e.target.value })), U(e, r);
				});
				var a = R(i, 2), o = L(a, !0);
				z((e, t) => {
					W(r, e), W(o, t);
				}, [() => Z("lbl.timelineItems"), () => Z("ui.addTlItem")]), V("click", a, Cn), U(e, t);
			}, c = (e) => {
				var t = Du(), n = I(t), r = F(n), i = R(r);
				J(i), D(n);
				var a = R(n, 2), o = F(a), s = R(o);
				J(s), D(a);
				var c = R(a, 2), l = F(c), u = R(l);
				J(u), D(c), z((e, t, n) => {
					W(r, `${e ?? ""} `), Y(i, B(j).props.text ?? ""), W(o, `${t ?? ""} `), Y(s, B(j).props.attribution ?? ""), W(l, `${n ?? ""} `), Y(u, B(j).props.role ?? "");
				}, [
					() => Z("lbl.quoteText"),
					() => Z("lbl.quoteName"),
					() => Z("lbl.quoteRole")
				]), V("change", i, (e) => M("text", e.target.value)), V("change", s, (e) => M("attribution", e.target.value)), V("change", u, (e) => M("role", e.target.value)), U(e, t);
			}, l = (e) => {
				var t = Ou(), n = I(t), r = F(n), i = R(r);
				J(i), D(n);
				var a = R(n, 2), o = F(a), s = R(o);
				J(s), D(a);
				var c = R(a, 2), l = F(c), u = R(l);
				J(u), D(c);
				var d = R(c, 2), f = F(d), p = R(f);
				J(p), D(d), z((e, t, n, a, c) => {
					W(r, `${e ?? ""} `), Y(i, B(j).props.value ?? ""), X(i, "title", t), W(o, `${n ?? ""} `), Y(s, B(j).props.prefix ?? ""), W(l, `${a ?? ""} `), Y(u, B(j).props.suffix ?? ""), W(f, `${c ?? ""} `), Y(p, B(j).props.label ?? "");
				}, [
					() => Z("lbl.statValue"),
					() => Z("tip.stat.value"),
					() => Z("lbl.statPrefix"),
					() => Z("lbl.statSuffix"),
					() => Z("lbl.statLabel")
				]), V("change", i, (e) => M("value", e.target.value)), V("change", s, (e) => M("prefix", e.target.value)), V("change", u, (e) => M("suffix", e.target.value)), V("change", p, (e) => M("label", e.target.value)), U(e, t);
			}, u = (e) => {
				var t = ku(), n = I(t), r = F(n), i = L(r, !0), a = R(r, 2), o = L(a, !0);
				D(n);
				var s = R(n, 2), c = F(s), l = L(c, !0), u = R(c, 2), d = L(u, !0);
				D(s);
				var f = R(s, 2), p = F(f);
				J(p);
				var m = R(p);
				D(f), z((e, t, n, r, a, s) => {
					W(i, e), W(o, t), W(l, n), W(d, r), X(f, "title", a), Si(p, B(j).props.header !== !1), W(m, ` ${s ?? ""}`);
				}, [
					() => Z("ui.addRow"),
					() => Z("ui.removeRow"),
					() => Z("ui.addColumn"),
					() => Z("ui.removeColumn"),
					() => Z("tip.table.header"),
					() => Z("lbl.tableHeader")
				]), V("click", r, () => Dn(1, 0)), V("click", a, () => Dn(-1, 0)), V("click", c, () => Dn(0, 1)), V("click", u, () => Dn(0, -1)), V("change", p, (e) => M("header", e.target.checked)), U(e, t);
			}, d = (e) => {
				var t = Pr();
				Yr(I(t), 17, () => [
					["facebook", "Facebook"],
					["x", "X"],
					["linkedin", "LinkedIn"],
					["whatsapp", "WhatsApp"],
					["email", Z("opt.share.email")],
					["copy", Z("opt.share.copy")]
				], ([e, t]) => e, (e, t) => {
					var n = /* @__PURE__ */ A(() => h(B(t), 2));
					let r = () => B(n)[0], i = () => B(n)[1];
					var a = Au(), o = F(a);
					J(o);
					var s = R(o);
					D(a), z((e) => {
						Si(o, e), W(s, ` ${i() ?? ""}`);
					}, [() => (B(j).props.services ?? []).includes(r())]), V("change", o, (e) => On(r(), e.target.checked)), U(e, a);
				}), U(e, t);
			}, f = (e) => {
				var t = ju(), n = I(t), r = F(n), i = R(r);
				J(i), D(n);
				var a = R(n, 2), o = F(a), s = R(o);
				J(s), D(a), z((e, t, n) => {
					W(r, `${e ?? ""} `), Y(i, B(j).props.target ?? ""), X(a, "title", t), W(o, `${n ?? ""} `), Y(s, B(j).props.doneText ?? "");
				}, [
					() => Z("lbl.countdownTarget"),
					() => Z("tip.countdown.done"),
					() => Z("lbl.countdownDone")
				]), V("change", i, (e) => M("target", e.target.value)), V("change", s, (e) => M("doneText", e.target.value)), U(e, t);
			}, p = (e) => {
				var t = Nu(), n = I(t), r = F(n), i = R(r);
				D(n);
				var a = R(n, 2), o = (e) => {
					var t = Mu(), n = L(t, !0);
					z((e) => W(n, e), [() => Z("ui.removeAudio")]), V("click", t, () => M("src", "")), U(e, t);
				};
				G(a, (e) => {
					B(j).props.src && e(o);
				});
				var s = R(a, 2), c = F(s), l = R(c);
				J(l), D(s);
				var u = R(s, 2), d = F(u);
				J(d);
				var f = R(d);
				D(u), z((e, t, i, a, o) => {
					X(n, "title", e), W(r, `${t ?? ""} `), W(c, `${i ?? ""} `), Y(l, B(j).props.title ?? ""), Si(d, a), W(f, ` ${o ?? ""}`);
				}, [
					() => Z("tip.blocks.audioFile"),
					() => Z("ui.chooseAudio"),
					() => Z("lbl.audioTitle"),
					() => !!B(j).props.loop,
					() => Z("lbl.audioLoop")
				]), V("change", i, kn), V("change", l, (e) => M("title", e.target.value)), V("change", d, (e) => M("loop", e.target.checked)), U(e, t);
			}, m = (e) => {
				var t = Pu(), n = I(t), r = F(n), i = R(r);
				J(i), D(n);
				var a = R(n, 2), o = F(a), s = R(o);
				{
					let e = /* @__PURE__ */ A(() => B(j).props.page ?? "__href"), t = /* @__PURE__ */ A(() => [...B(k).pages.map((e) => [e.id, e.title]), ["__href", Z("opt.externalLink")]]);
					Q(s, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => {
							let t = e === "__href" ? null : e;
							Kt(`edit:${B(j).blockId}`, (e) => {
								e.props.page = t, t && (e.props.href = null);
							});
						}
					});
				}
				D(a);
				var c = R(a, 2), l = (e) => {
					var t = vu();
					J(t), z((e) => {
						X(t, "placeholder", e), Y(t, B(j).props.href === "#" ? "" : B(j).props.href ?? "");
					}, [() => Z("ph.url")]), V("change", t, (e) => M("href", e.target.value || null)), U(e, t);
				};
				G(c, (e) => {
					B(j).props.page || e(l);
				}), z((e, t) => {
					W(r, `${e ?? ""} `), Y(i, B(j).props.label), W(o, `${t ?? ""} `);
				}, [() => Z("blocks.text"), () => Z("lbl.goesTo")]), V("change", i, (e) => M("label", e.target.value)), U(e, t);
			}, g = (e) => {
				var t = Fu(), n = I(t), r = F(n), i = R(r);
				D(n);
				var a = R(n, 2), o = F(a), s = R(o);
				J(s), D(a);
				var c = R(a, 2), l = F(c), u = R(l);
				J(u), D(c);
				var d = R(c, 2), f = (e) => {
					var t = Au(), n = F(t);
					J(n);
					var r = R(n);
					D(t), z((e, i, a) => {
						X(t, "title", e), Si(n, i), W(r, ` ${a ?? ""}`);
					}, [
						() => Z("tip.lightbox"),
						() => !!B(j).props.lightbox,
						() => Z("lbl.lightbox")
					]), V("change", n, (e) => M("lightbox", e.target.checked)), U(e, t);
				};
				G(d, (e) => {
					B(j).props.href || e(f);
				}), z((e, t, n, i, a) => {
					W(r, `${e ?? ""} `), W(o, `${t ?? ""} `), Y(s, B(j).props.alt ?? ""), X(s, "placeholder", n), W(l, `${i ?? ""} `), Y(u, B(j).props.href ?? ""), X(u, "placeholder", a);
				}, [
					() => Z("ui.changeImage"),
					() => Z("lbl.description"),
					() => Z("ph.altText"),
					() => Z("lbl.link"),
					() => Z("ph.optionalImageLink")
				]), V("change", i, jn), V("change", s, (e) => M("alt", e.target.value)), V("change", u, (e) => M("href", e.target.value || null)), U(e, t);
			}, v = (e) => {
				var t = Iu(), n = I(t), r = L(n, !0), i = R(n, 2);
				J(i);
				var a = R(i, 2), o = F(a), s = R(o);
				J(s), D(a), z((e, t, a, c) => {
					X(n, "title", e), W(r, t), Y(i, B(j).props.url ?? ""), X(i, "placeholder", a), W(o, `${c ?? ""} `), Y(s, B(j).props.title ?? "");
				}, [
					() => Z("hint.video"),
					() => Z("lbl.videoUrl"),
					() => Z("ph.videoUrl"),
					() => Z("lbl.videoTitle")
				]), V("change", i, (e) => M("url", e.target.value)), V("change", s, (e) => M("title", e.target.value)), U(e, t);
			}, y = (e) => {
				var t = zu(), n = I(t), r = F(n), i = R(r), a = F(i);
				{
					let e = /* @__PURE__ */ A(() => B(j).props.glyph ?? "★"), t = /* @__PURE__ */ A(() => B(j).props.icon ?? null), n = /* @__PURE__ */ A(() => B(j).props.image ?? null);
					no(a, {
						get value() {
							return B(e);
						},
						get icon() {
							return B(t);
						},
						get image() {
							return B(n);
						},
						onpick: (e) => Kt(`edit:${B(j).blockId}`, (t) => {
							t.props.glyph = e, t.props.icon = null, t.props.image = null;
						}),
						onicon: (e) => Kt(`edit:${B(j).blockId}`, (t) => {
							t.props.icon = e, t.props.image = null;
						}),
						onimage: (e) => M("image", e)
					});
				}
				var o = R(a, 2), s = (e) => {
					var t = Lu();
					J(t), z((e) => {
						Y(t, B(j).props.glyph ?? ""), X(t, "title", e);
					}, [() => Z("tip.icon.typeGlyph")]), V("change", t, (e) => M("glyph", e.target.value || "★")), U(e, t);
				}, c = (e) => {
					var t = Mu(), n = L(t, !0);
					z((e, r) => {
						X(t, "title", e), W(n, r);
					}, [() => Z("tip.icon.backToGlyph"), () => Z("ui.removeDrawnIcon")]), V("click", t, () => M("icon", null)), U(e, t);
				};
				G(o, (e) => {
					B(j).props.icon ? e(c, -1) : e(s);
				}), D(i), D(n);
				var l = R(n, 2), u = (e) => {
					var t = Ru(), n = F(t), r = R(n, 2), i = L(r, !0);
					D(t), z((e, r, a) => {
						X(t, "title", e), X(n, "src", B(j).props.image), X(n, "alt", r), W(i, a);
					}, [
						() => Z("hint.icon.ownImage"),
						() => Z("gp.ownIcon"),
						() => Z("ui.removeOwnIcon")
					]), V("click", r, () => M("image", null)), U(e, t);
				};
				G(l, (e) => {
					B(j).props.image && e(u);
				}), z((e) => W(r, `${e ?? ""} `), [() => Z("blocks.icon")]), U(e, t);
			}, b = (e) => {
				var t = Bu(), n = I(t), r = F(n), i = R(r);
				{
					let e = /* @__PURE__ */ A(() => B(j).props.collection ?? ""), t = /* @__PURE__ */ A(() => [["", Z("common.choose")], ...B(Ts).map((e) => [e, B(Es)[e]?.name ?? e])]);
					Q(i, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("collection", e || null)
					});
				}
				D(n);
				var a = R(n, 2), o = F(a), s = R(o);
				J(s), D(a);
				var c = R(a, 2), l = F(c);
				J(l);
				var u = R(l);
				D(c), z((e, t, i, c, d) => {
					X(n, "title", e), W(r, `${t ?? ""} `), X(a, "title", i), W(o, `${c ?? ""} `), Y(s, B(j).props.limit ?? 6), Si(l, B(j).props.newestFirst !== !1), W(u, ` ${d ?? ""}`);
				}, [
					() => Z("tip.collection.source"),
					() => Z("blocks.collection"),
					() => Z("tip.collection.limit"),
					() => Z("lbl.maxCount"),
					() => Z("lbl.newestFirst")
				]), V("change", s, (e) => M("limit", Number(e.target.value))), V("change", l, (e) => M("newestFirst", e.target.checked)), U(e, t);
			}, x = (e) => {
				var t = Uu(), n = I(t), r = F(n), i = R(r);
				{
					let e = /* @__PURE__ */ A(() => B(j).props.collection ?? ""), t = /* @__PURE__ */ A(() => [["", Z("common.choose")], ...B(Ts).filter((e) => B(Es)[e]?.kind === "products").map((e) => [e, B(Es)[e]?.name ?? e])]);
					Q(i, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("collection", e || null)
					});
				}
				D(n);
				var a = R(n, 2), o = (e) => {
					var t = Vu(), n = F(t), r = L(n, !0), i = R(n, 2), a = L(i, !0);
					D(t), z((e, t, o, s) => {
						X(n, "title", e), W(r, t), X(i, "title", o), W(a, s);
					}, [
						() => Z("tip.product.addProduct"),
						() => Z("ui.addProduct"),
						() => Z("tip.product.editCatalog"),
						() => Z("ui.editCatalog")
					]), V("click", n, () => lc(B(j).props.collection)), V("click", i, () => {
						P(Ds, B(j).props.collection, !0), P(Tt, "collections");
					}), U(e, t);
				}, s = (e) => {
					var t = Hu(), n = L(t, !0);
					z((e, r) => {
						X(t, "title", e), W(n, r);
					}, [() => Z("tip.product.createCatalog"), () => Z("ui.createCatalog")]), V("click", t, sc), U(e, t);
				}, c = /* @__PURE__ */ A(() => !B(Ts).some((e) => B(Es)[e]?.kind === "products"));
				G(a, (e) => {
					B(j).props.collection && B(Es)[B(j).props.collection]?.kind === "products" ? e(o) : B(c) && e(s, 1);
				});
				var l = R(a, 2), u = F(l), d = R(u);
				J(d), D(l);
				var f = R(l, 2), p = F(f), m = R(p);
				J(m), D(f), z((e, t, i, a, o, s) => {
					X(n, "title", e), W(r, `${t ?? ""} `), X(l, "title", i), W(u, `${a ?? ""} `), Y(d, B(j).props.limit ?? 0), X(f, "title", o), W(p, `${s ?? ""} `), Y(m, B(j).props.currency ?? "kr");
				}, [
					() => Z("tip.product.source"),
					() => Z("blocks.collection"),
					() => Z("tip.collection.limit"),
					() => Z("lbl.maxCount"),
					() => Z("tip.product.currency"),
					() => Z("lbl.currency")
				]), V("change", d, (e) => M("limit", Number(e.target.value))), V("change", m, (e) => M("currency", e.target.value)), U(e, t);
			}, S = (e) => {
				var t = Wu(), n = I(t), r = F(n), i = R(r);
				{
					let e = /* @__PURE__ */ A(() => B(j).props.href ?? ""), t = /* @__PURE__ */ A(() => [["", Z("common.none")], ...B(k).pages.map((e) => [e.path, e.title])]);
					Q(i, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("href", e)
					});
				}
				D(n);
				var a = R(n, 2), o = F(a), s = R(o);
				J(s), D(a), z((e, t, i, c) => {
					X(n, "title", e), W(r, `${t ?? ""} `), X(a, "title", i), W(o, `${c ?? ""} `), Y(s, B(j).props.currency ?? "kr");
				}, [
					() => Z("tip.cart.checkout"),
					() => Z("lbl.checkoutPage"),
					() => Z("tip.product.currency"),
					() => Z("lbl.currency")
				]), V("change", s, (e) => M("currency", e.target.value)), U(e, t);
			}, C = (e) => {
				var t = Gu(), n = I(t), r = F(n), i = R(r);
				J(i), D(n);
				var a = R(n, 2), o = F(a), s = R(o);
				J(s), D(a);
				var c = R(a, 2), l = F(c), u = R(l);
				J(u), D(c);
				var d = R(c, 2), f = F(d);
				J(f);
				var p = R(f);
				D(d);
				var m = R(d, 2), h = F(m), g = R(h);
				J(g), D(m), z((e, t, _, v, y, b, x, S, C, w) => {
					X(n, "title", e), W(r, `${t ?? ""} `), Y(i, B(j).props.recipient ?? ""), X(a, "title", _), W(o, `${v ?? ""} `), Y(s, B(j).props.endpoint ?? ""), X(c, "title", y), W(l, `${b ?? ""} `), Y(u, B(j).props.vipps ?? ""), X(d, "title", x), Si(f, B(j).props.vippsCheckout === !0), W(p, ` ${S ?? ""}`), X(m, "title", C), W(h, `${w ?? ""} `), Y(g, B(j).props.currency ?? "kr");
				}, [
					() => Z("tip.checkout.recipient"),
					() => Z("lbl.recipientEmail"),
					() => Z("tip.checkout.endpoint"),
					() => Z("lbl.endpointUrl"),
					() => Z("tip.checkout.vipps"),
					() => Z("lbl.vippsNumber"),
					() => Z("tip.checkout.vippsCheckout"),
					() => Z("lbl.vippsCheckout"),
					() => Z("tip.product.currency"),
					() => Z("lbl.currency")
				]), V("change", i, (e) => M("recipient", e.target.value.trim())), V("change", s, (e) => M("endpoint", e.target.value.trim())), V("change", u, (e) => M("vipps", e.target.value.trim())), V("change", f, (e) => M("vippsCheckout", e.target.checked)), V("change", g, (e) => M("currency", e.target.value)), U(e, t);
			}, w = (e) => {
				var t = qu(), n = I(t), r = F(n), i = R(r);
				D(n), Yr(R(n, 2), 17, () => B(j).props.images ?? [], Gr, (e, t, n) => {
					var r = Ku(), i = F(r), a = F(i), o = R(a, 2), s = F(o);
					s.disabled = n === 0, K(s, () => _.up, !0), D(s);
					var c = R(s, 2);
					K(c, () => _.down, !0), D(c);
					var l = R(c, 2);
					K(l, () => _.cross, !0), D(l), D(o), D(i);
					var u = R(i, 2), d = F(u), f = R(d);
					J(f), D(u);
					var p = R(u, 2), m = F(p), h = R(m);
					J(h), D(p), D(r), z((e, r, o, s, u, p) => {
						X(i, "title", e), X(a, "src", B(t).src), c.disabled = n === B(j).props.images.length - 1, X(l, "title", r), W(d, `${o ?? ""} `), Y(f, B(t).alt ?? ""), X(f, "placeholder", s), W(m, `${u ?? ""} `), Y(h, B(t).href ?? ""), X(h, "placeholder", p);
					}, [
						() => Z("hint.gallery"),
						() => Z("tip.removeImage"),
						() => Z("lbl.description"),
						() => Z("ph.altShort"),
						() => Z("lbl.link"),
						() => Z("ph.galleryHref")
					]), V("click", s, () => Ph(n, -1)), V("click", c, () => Ph(n, 1)), V("click", l, () => Fh(n)), V("change", f, (e) => Ih(n, "alt", e.target.value)), V("change", h, (e) => Ih(n, "href", e.target.value || null)), U(e, r);
				}), z((e, t) => {
					X(n, "title", e), W(r, `${t ?? ""} `);
				}, [() => Z("tip.gallery.addImages"), () => Z("ui.addImages")]), V("change", i, Mh), U(e, t);
			}, T = (e) => {
				var t = fu(), n = F(t);
				Q(R(n), {
					get value() {
						return B(j).props.kind;
					},
					get options() {
						return Pn;
					},
					onchange: (e) => M("kind", e)
				}), D(t), z((e) => W(n, `${e ?? ""} `), [() => Z("blocks.shape")]), U(e, t);
			}, ee = (e) => {
				let t = /* @__PURE__ */ A(() => Ch[B(j).type] ?? B(Sh).find((e) => e.type === B(j).type)?.fields ?? []);
				var n = Pr(), r = I(n), i = (e) => {
					var n = Pr();
					Yr(I(n), 17, () => B(t), (e) => e.key, (e, t) => {
						var n = Pr(), r = I(n), i = (e) => {
							let n = /* @__PURE__ */ A(() => `${B(j).blockId}:${B(t).key}`);
							var r = Yu(), i = I(r), a = F(i), o = R(a);
							J(o), D(i);
							var s = R(i, 2), c = L(s, !0), l = R(s, 2), u = (e) => {
								var t = Ju();
								let r;
								var i = L(t, !0);
								z(() => {
									r = q(t, 1, "panel-hint svelte-1n46o8q", null, r, { "place-error": Qt[B(n)].err }), W(i, Qt[B(n)].text);
								}), U(e, t);
							};
							G(l, (e) => {
								Qt[B(n)] && e(u);
							}), z((e) => {
								W(a, `${B(t).label ?? ""} `), X(o, "placeholder", B(t).placeholder), Y(o, Zt[B(n)] ?? B(j).props[B(t).key] ?? ""), s.disabled = B($t), W(c, e);
							}, [() => Z("props.place.search")]), V("input", o, (e) => {
								Zt[B(n)] = e.target.value;
							}), V("keydown", o, (e) => {
								e.key === "Enter" && an(B(t));
							}), V("click", s, () => an(B(t))), U(e, r);
						}, a = (e) => {
							var n = Xu(), r = F(n), i = R(r);
							J(i), D(n), z(() => {
								W(r, `${B(t).label ?? ""} `), X(i, "min", B(t).min), X(i, "max", B(t).max), X(i, "step", B(t).step ?? 1), Y(i, B(j).props[B(t).key]);
							}), V("change", i, (e) => M(B(t).key, rn(B(t), Number(e.target.value)))), U(e, n);
						}, o = (e) => {
							var n = Au(), r = F(n);
							J(r);
							var i = R(r);
							D(n), z((e) => {
								Si(r, e), W(i, ` ${B(t).label ?? ""}`);
							}, [() => !!B(j).props[B(t).key]]), V("change", r, (e) => M(B(t).key, e.target.checked)), U(e, n);
						}, s = (e) => {
							var n = fu(), r = F(n), i = R(r);
							{
								let e = /* @__PURE__ */ A(() => (B(t).options ?? []).map((e) => [e.value, e.label]));
								Q(i, {
									get value() {
										return B(j).props[B(t).key];
									},
									get options() {
										return B(e);
									},
									onchange: (e) => M(B(t).key, e)
								});
							}
							D(n), z(() => W(r, `${B(t).label ?? ""} `)), U(e, n);
						}, c = (e) => {
							var n = Zu(), r = F(n), i = R(r);
							J(i), D(n), z(() => {
								W(r, `${B(t).label ?? ""} `), X(i, "placeholder", B(t).placeholder), Y(i, B(j).props[B(t).key] ?? "");
							}), V("change", i, (e) => M(B(t).key, e.target.value)), U(e, n);
						};
						G(r, (e) => {
							B(t).type === "place" ? e(i) : B(t).type === "number" ? e(a, 1) : B(t).type === "toggle" ? e(o, 2) : B(t).type === "select" ? e(s, 3) : e(c, -1);
						}), U(e, n);
					}), U(e, n);
				}, a = (e) => {
					var t = Mu(), n = L(t, !0);
					z((e, r) => {
						X(t, "title", e), W(n, r);
					}, [() => Z("hint.pluginBlock"), () => Z("ui.settings")]), V("click", t, () => Ue?.sendOpenConfig(B(j).blockId)), U(e, t);
				};
				G(r, (e) => {
					B(t).length ? e(i) : e(a, -1);
				}), U(e, n);
			};
			G(n, (e) => {
				B(j).type === "text" ? e(r) : B(j).type === "form" ? e(i, 1) : B(j).type === "calendar" ? e(a, 2) : B(j).type === "faq" ? e(o, 3) : B(j).type === "timeline" ? e(s, 4) : B(j).type === "quote" ? e(c, 5) : B(j).type === "stats" ? e(l, 6) : B(j).type === "table" ? e(u, 7) : B(j).type === "share" ? e(d, 8) : B(j).type === "countdown" ? e(f, 9) : B(j).type === "audio" ? e(p, 10) : B(j).type === "button" ? e(m, 11) : B(j).type === "image" ? e(g, 12) : B(j).type === "video" ? e(v, 13) : B(j).type === "icon" ? e(y, 14) : B(j).type === "collection" ? e(b, 15) : B(j).type === "product" ? e(x, 16) : B(j).type === "cart" ? e(S, 17) : B(j).type === "checkout" ? e(C, 18) : B(j).type === "gallery" ? e(w, 19) : B(j).type === "shape" ? e(T, 20) : e(ee, -1);
			}), U(e, t);
		}, p = (e) => {
			var t = xd(), n = I(t), r = (e) => {
				var t = Qu(), n = I(t), r = F(n), a = R(r);
				{
					let e = /* @__PURE__ */ A(() => B(j).props.align ?? "left"), t = /* @__PURE__ */ A(() => [
						["left", Z("common.left")],
						["center", Z("common.center")],
						["right", Z("common.right")]
					]);
					Q(a, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("align", e)
					});
				}
				D(n);
				var o = R(n, 2), s = F(o);
				J(s);
				var c = R(s);
				D(o);
				var l = R(o, 2), u = (e) => {
					i(e);
				};
				G(l, (e) => {
					B(j).props.box && e(u);
				}), Oe(2), z((e, t, n) => {
					W(r, `${e ?? ""} `), Si(s, t), W(c, ` ${n ?? ""}`);
				}, [
					() => Z("lbl.align"),
					() => !!B(j).props.box,
					() => Z("lbl.textBoxToggle")
				]), V("change", s, (e) => M("box", e.target.checked)), U(e, t);
			}, a = (e) => {
				var t = $u(), n = I(t), r = L(n, !0), a = R(n, 2);
				i(a), Oe(2), z((e) => W(r, e), [() => Z("lbl.cardStyle")]), U(e, t);
			}, o = (e) => {
				var t = ed(), n = I(t), r = F(n), i = R(r);
				{
					let e = /* @__PURE__ */ A(() => B(j).props.variant ?? "left"), t = /* @__PURE__ */ A(() => [["left", Z("opt.timeline.left")], ["alternating", Z("opt.timeline.alternating")]]);
					Q(i, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("variant", e)
					});
				}
				D(n);
				var a = R(n, 2), o = F(a), s = R(o);
				{
					let e = /* @__PURE__ */ A(() => B(j).props.marker ?? "filled"), t = /* @__PURE__ */ A(() => [["filled", Z("opt.timeline.filled")], ["ring", Z("opt.timeline.ring")]]);
					Q(s, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("marker", e)
					});
				}
				D(a);
				var c = R(a, 2), l = F(c), u = R(l);
				{
					let e = /* @__PURE__ */ A(() => B(j).props.accent ?? "accent"), t = /* @__PURE__ */ A(zr);
					ha(u, {
						get value() {
							return B(e);
						},
						get tokens() {
							return B(t);
						},
						onchange: (e) => M("accent", e === "accent" ? null : e)
					});
				}
				D(c), Oe(2), z((e, t, n) => {
					W(r, `${e ?? ""} `), W(o, `${t ?? ""} `), W(l, `${n ?? ""} `);
				}, [
					() => Z("lbl.variant"),
					() => Z("lbl.timelineMarker"),
					() => Z("lbl.color")
				]), U(e, t);
			}, s = (e) => {
				var t = nd(), n = I(t), r = F(n), i = R(r);
				{
					let e = /* @__PURE__ */ A(() => B(j).props.variant ?? "large"), t = /* @__PURE__ */ A(() => [["large", Z("opt.quote.large")], ["short", Z("opt.quote.short")]]);
					Q(i, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("variant", e)
					});
				}
				D(n);
				var a = R(n, 2), o = (e) => {
					var t = td(), n = I(t), r = F(n), i = R(r);
					D(n);
					var a = R(n, 2), o = (e) => {
						var t = Mu(), n = L(t, !0);
						z((e) => W(n, e), [() => Z("ui.quotePortraitRemove")]), V("click", t, () => M("image", "")), U(e, t);
					};
					G(a, (e) => {
						B(j).props.image && e(o);
					}), z((e) => W(r, `${e ?? ""} `), [() => Z("ui.quotePortrait")]), V("change", i, Mn), U(e, t);
				};
				G(a, (e) => {
					B(j).props.variant === "short" && e(o);
				});
				var s = R(a, 2), c = F(s), l = R(c);
				{
					let e = /* @__PURE__ */ A(() => B(j).props.accent ?? "accent"), t = /* @__PURE__ */ A(zr);
					ha(l, {
						get value() {
							return B(e);
						},
						get tokens() {
							return B(t);
						},
						onchange: (e) => M("accent", e === "accent" ? null : e)
					});
				}
				D(s), Oe(2), z((e, t) => {
					W(r, `${e ?? ""} `), W(c, `${t ?? ""} `);
				}, [() => Z("lbl.variant"), () => Z("lbl.color")]), U(e, t);
			}, c = (e) => {
				var t = rd(), n = I(t), r = F(n);
				J(r);
				var i = R(r);
				D(n), Oe(2), z((e, t) => {
					X(n, "title", e), Si(r, B(j).props.countUp !== !1), W(i, ` ${t ?? ""}`);
				}, [() => Z("tip.stat.countUp"), () => Z("lbl.statCountUp")]), V("change", r, (e) => M("countUp", e.target.checked)), U(e, t);
			}, l = (e) => {
				var t = id(), n = I(t), r = F(n), i = R(r);
				{
					let e = /* @__PURE__ */ A(() => B(j).props.lines ?? "rows"), t = /* @__PURE__ */ A(() => [
						["rows", Z("opt.table.rows")],
						["grid", Z("opt.table.grid")],
						["none", Z("common.none")]
					]);
					Q(i, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("lines", e)
					});
				}
				D(n);
				var a = R(n, 2), o = F(a);
				J(o);
				var s = R(o);
				D(a), Oe(2), z((e, t, n) => {
					W(r, `${e ?? ""} `), Si(o, t), W(s, ` ${n ?? ""}`);
				}, [
					() => Z("lbl.tableLines"),
					() => !!B(j).props.striped,
					() => Z("lbl.tableStriped")
				]), V("change", o, (e) => M("striped", e.target.checked)), U(e, t);
			}, u = (e) => {
				var t = ad(), n = I(t), r = F(n), i = R(r);
				{
					let e = /* @__PURE__ */ A(() => B(j).props.variant ?? "icons"), t = /* @__PURE__ */ A(() => [["icons", Z("opt.share.icons")], ["labels", Z("opt.share.labels")]]);
					Q(i, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("variant", e)
					});
				}
				D(n);
				var a = R(n, 2), o = F(a), s = R(o);
				J(s), D(a);
				var c = R(a, 2), l = F(c), u = R(l);
				{
					let e = /* @__PURE__ */ A(() => B(j).props.color || "accent"), t = /* @__PURE__ */ A(zr);
					ha(u, {
						get value() {
							return B(e);
						},
						get tokens() {
							return B(t);
						},
						onchange: (e) => M("color", e === "accent" ? "" : e)
					});
				}
				D(c), Oe(2), z((e, t, n) => {
					W(r, `${e ?? ""} `), W(o, `${t ?? ""} `), Y(s, B(j).props.size ?? 38), W(l, `${n ?? ""} `);
				}, [
					() => Z("lbl.variant"),
					() => Z("lbl.size"),
					() => Z("lbl.color")
				]), V("change", s, (e) => M("size", Number(e.target.value) || 38)), U(e, t);
			}, d = (e) => {
				var t = id(), n = I(t), r = F(n), i = R(r);
				{
					let e = /* @__PURE__ */ A(() => B(j).props.variant ?? "boxes"), t = /* @__PURE__ */ A(() => [["boxes", Z("opt.countdown.boxes")], ["plain", Z("opt.countdown.plain")]]);
					Q(i, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("variant", e)
					});
				}
				D(n);
				var a = R(n, 2), o = F(a);
				J(o);
				var s = R(o);
				D(a), Oe(2), z((e, t) => {
					W(r, `${e ?? ""} `), Si(o, B(j).props.showSeconds !== !1), W(s, ` ${t ?? ""}`);
				}, [() => Z("lbl.variant"), () => Z("lbl.countdownSeconds")]), V("change", o, (e) => M("showSeconds", e.target.checked)), U(e, t);
			}, f = (e) => {
				var t = od(), n = I(t), r = F(n), i = R(r);
				{
					let e = /* @__PURE__ */ A(() => [["primary", Z("opt.btn.primary")], ["secondary", Z("opt.btn.secondary")]]);
					Q(i, {
						get value() {
							return B(j).props.style;
						},
						get options() {
							return B(e);
						},
						onchange: (e) => M("style", e)
					});
				}
				D(n), Oe(2), z((e) => W(r, `${e ?? ""} `), [() => Z("lbl.style")]), U(e, t);
			}, p = (e) => {
				var t = sd(), n = I(t), r = F(n), i = R(r);
				{
					let e = /* @__PURE__ */ A(() => B(j).props.fit ?? "cover"), t = /* @__PURE__ */ A(() => [["cover", Z("opt.fitFrame.cover")], ["contain", Z("opt.fitFrame.contain")]]);
					Q(i, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("fit", e)
					});
				}
				D(n);
				var a = R(n, 2), o = F(a), s = R(o);
				{
					let e = /* @__PURE__ */ A(() => B(j).props.radius ?? ""), t = /* @__PURE__ */ A(() => [
						["", Z("common.none")],
						["sm", Z("opt.size.sm")],
						["md", Z("opt.radius.md")]
					]);
					Q(s, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("radius", e || null)
					});
				}
				D(a);
				var c = R(a, 2), l = F(c), u = L(R(l));
				D(c);
				var d = R(c, 2);
				J(d);
				var f = R(d, 2), p = F(f), m = L(R(p));
				D(f);
				var h = R(f, 2);
				J(h);
				var g = R(h, 2), _ = F(g), v = L(R(_));
				D(g);
				var y = R(g, 2);
				J(y);
				var b = R(y, 2), x = F(b), S = L(R(x));
				D(b);
				var C = R(b, 2);
				J(C);
				var w = R(C, 2), T = F(w), ee = L(R(T));
				D(w);
				var te = R(w, 2);
				J(te);
				var ne = R(te, 2), E = F(ne), re = L(R(E));
				D(ne);
				var ie = R(ne, 2);
				J(ie);
				var ae = R(ie, 2), oe = L(ae, !0);
				Oe(2), z((e, t, n, i, a, s, c, f, b, w, ne, se, ce, le, ue, de, fe) => {
					W(r, `${e ?? ""} `), W(o, `${t ?? ""} `), W(l, `${n ?? ""} `), W(u, `${i ?? ""}%`), Y(d, B(j).props.x ?? .5), W(p, `${a ?? ""} `), W(m, `${s ?? ""}%`), Y(h, B(j).props.y ?? .5), X(g, "title", c), W(_, `${f ?? ""} `), W(v, `${b ?? ""}x`), Y(y, B(j).props.zoom ?? 1), W(x, `${w ?? ""} `), W(S, `${ne ?? ""}%`), Y(C, B(j).props.brightness ?? 1), W(T, `${se ?? ""} `), W(ee, `${ce ?? ""}%`), Y(te, B(j).props.contrast ?? 1), W(E, `${le ?? ""} `), W(re, `${ue ?? ""}%`), Y(ie, B(j).props.saturate ?? 1), X(ae, "title", de), W(oe, fe);
				}, [
					() => Z("lbl.fit"),
					() => Z("lbl.radius"),
					() => Z("lbl.focusX"),
					() => Math.round((B(j).props.x ?? .5) * 100),
					() => Z("lbl.focusY"),
					() => Math.round((B(j).props.y ?? .5) * 100),
					() => Z("tip.zoomCrop"),
					() => Z("lbl.zoom"),
					() => (B(j).props.zoom ?? 1).toFixed(2),
					() => Z("lbl.brightness"),
					() => Math.round((B(j).props.brightness ?? 1) * 100),
					() => Z("lbl.contrast"),
					() => Math.round((B(j).props.contrast ?? 1) * 100),
					() => Z("lbl.saturate"),
					() => Math.round((B(j).props.saturate ?? 1) * 100),
					() => Z("tip.resetAdjust"),
					() => Z("ui.resetAdjust")
				]), V("input", d, (e) => M("x", Number(e.target.value))), V("input", h, (e) => M("y", Number(e.target.value))), V("input", y, (e) => M("zoom", Number(e.target.value))), V("input", C, (e) => M("brightness", Number(e.target.value))), V("input", te, (e) => M("contrast", Number(e.target.value))), V("input", ie, (e) => M("saturate", Number(e.target.value))), V("click", ae, () => Kt(`edit:${B(j).blockId}`, (e) => {
					e.props.brightness = 1, e.props.contrast = 1, e.props.saturate = 1;
				})), U(e, t);
			}, m = (e) => {
				var t = cd(), n = I(t), r = F(n), i = R(r);
				J(i), D(n);
				var a = R(n, 2), o = F(a), s = R(o);
				{
					let e = /* @__PURE__ */ A(() => B(j).props.color ?? "accent"), t = /* @__PURE__ */ A(zr);
					ha(s, {
						get value() {
							return B(e);
						},
						get tokens() {
							return B(t);
						},
						onchange: (e) => M("color", e)
					});
				}
				D(a), Oe(2), z((e, t, n) => {
					W(r, `${e ?? ""} `), Y(i, B(j).props.size ?? 48), X(a, "title", t), W(o, `${n ?? ""} `);
				}, [
					() => Z("lbl.sizePx"),
					() => Z("hint.icon.color"),
					() => Z("lbl.color")
				]), V("change", i, (e) => M("size", Number(e.target.value))), U(e, t);
			}, h = (e) => {
				var t = od(), n = I(t), r = F(n), i = R(r);
				{
					let e = /* @__PURE__ */ A(() => B(j).props.view ?? "cards"), t = /* @__PURE__ */ A(() => [
						["cards", Z("opt.collectionView.cards")],
						["list", Z("opt.collectionView.list")],
						["archive", Z("opt.collectionView.archive")]
					]);
					Q(i, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("view", e)
					});
				}
				D(n), Oe(2), z((e) => W(r, `${e ?? ""} `), [() => Z("lbl.view")]), U(e, t);
			}, g = (e) => {
				var t = ld(), n = I(t), r = F(n), i = R(r);
				J(i), D(n), Oe(2), z((e, t) => {
					X(n, "title", e), W(r, `${t ?? ""} `), Y(i, B(j).props.columns ?? 0);
				}, [() => Z("tip.product.columns"), () => Z("lbl.columns")]), V("change", i, (e) => M("columns", Number(e.target.value))), U(e, t);
			}, _ = (e) => {
				var t = od(), n = I(t), r = F(n), i = R(r);
				{
					let e = /* @__PURE__ */ A(() => B(j).props.variant ?? "button"), t = /* @__PURE__ */ A(() => [["button", Z("opt.cart.button")], ["icon", Z("opt.cart.icon")]]);
					Q(i, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("variant", e)
					});
				}
				D(n), Oe(2), z((e) => W(r, `${e ?? ""} `), [() => Z("lbl.view")]), U(e, t);
			}, v = (e) => {
				var t = fd(), n = I(t), r = F(n), i = R(r);
				{
					let e = /* @__PURE__ */ A(() => B(j).props.view ?? "grid"), t = /* @__PURE__ */ A(() => [
						["grid", Z("opt.galleryView.grid")],
						["carousel", Z("opt.galleryView.carousel")],
						["slides", Z("opt.galleryView.slides")]
					]);
					Q(i, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("view", e)
					});
				}
				D(n);
				var a = R(n, 2), o = (e) => {
					var t = ud(), n = I(t), r = F(n), i = R(r);
					J(i), D(n);
					var a = R(n, 2), o = F(a), s = L(R(o));
					D(a);
					var c = R(a, 2);
					J(c), z((e, t) => {
						W(r, `${e ?? ""} `), Y(i, B(j).props.columns ?? 3), W(o, `${t ?? ""} `), W(s, `${B(j).props.gap ?? 12 ?? ""} px`), Y(c, B(j).props.gap ?? 12);
					}, [() => Z("lbl.columns"), () => Z("lbl.imageGap")]), V("change", i, (e) => M("columns", Number(e.target.value))), V("input", c, (e) => M("gap", Number(e.target.value))), U(e, t);
				};
				G(a, (e) => {
					(B(j).props.view ?? "grid") === "grid" && e(o);
				});
				var s = R(a, 2), c = (e) => {
					var t = dd(), n = F(t), r = R(n);
					J(r), D(t), z((e) => {
						W(n, `${e ?? ""} `), Y(r, B(j).props.interval ?? 5);
					}, [() => Z("lbl.secondsPerImage")]), V("change", r, (e) => M("interval", Number(e.target.value))), U(e, t);
				};
				G(s, (e) => {
					B(j).props.view === "slides" && e(c);
				});
				var l = R(s, 2), u = F(l), d = R(u);
				{
					let e = /* @__PURE__ */ A(() => B(j).props.radius ?? ""), t = /* @__PURE__ */ A(() => [
						["", Z("common.none")],
						["sm", Z("opt.size.sm")],
						["md", Z("opt.radius.md")]
					]);
					Q(d, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("radius", e || null)
					});
				}
				D(l);
				var f = R(l, 2), p = F(f);
				J(p);
				var m = R(p);
				D(f), Oe(2), z((e, t, n, i) => {
					W(r, `${e ?? ""} `), W(u, `${t ?? ""} `), X(f, "title", n), Si(p, B(j).props.lightbox !== !1), W(m, ` ${i ?? ""}`);
				}, [
					() => Z("lbl.view"),
					() => Z("lbl.radius"),
					() => Z("tip.lightbox"),
					() => Z("lbl.lightbox")
				]), V("change", p, (e) => M("lightbox", e.target.checked)), U(e, t);
			}, y = (e) => {
				var t = md(), n = I(t), r = F(n);
				Q(R(r), {
					get value() {
						return B(j).props.color;
					},
					get options() {
						return Fn;
					},
					onchange: (e) => M("color", e)
				}), D(n);
				var i = R(n, 2), a = F(i), o = R(a);
				J(o), D(i);
				var s = R(i, 2), c = (e) => {
					var t = pd(), n = F(t), r = R(n);
					J(r), D(t), z((e, t) => {
						W(n, `${e ?? ""} `), X(r, "max", t), Y(r, B(j).frame.w);
					}, [() => Z("lbl.length"), () => Math.max(1, Math.round(100 - B(j).frame.x))]), V("change", r, (e) => on("w", Math.max(1, Math.min(Number(e.target.value), 100 - B(j).frame.x)))), U(e, t);
				};
				G(s, (e) => {
					(B(j).props.kind === "line" || B(j).props.kind === "arrow") && e(c);
				});
				var l = R(s, 2), u = F(l);
				J(u);
				var d = R(u);
				D(l), Oe(2), z((e, t, n, i, s) => {
					W(r, `${e ?? ""} `), W(a, `${t ?? ""} `), Y(o, B(j).props.thickness), X(l, "title", n), Si(u, i), W(d, ` ${s ?? ""}`);
				}, [
					() => Z("lbl.color"),
					() => Z("lbl.thickness"),
					() => Z("tip.shape.fill"),
					() => !!B(j).props.fill,
					() => Z("lbl.filled")
				]), V("change", o, (e) => M("thickness", Number(e.target.value))), V("change", u, (e) => M("fill", e.target.checked ? B(j).props.color : null)), U(e, t);
			};
			G(n, (e) => {
				B(j).type === "text" ? e(r) : B(j).type === "faq" ? e(a, 1) : B(j).type === "timeline" ? e(o, 2) : B(j).type === "quote" ? e(s, 3) : B(j).type === "stats" ? e(c, 4) : B(j).type === "table" ? e(l, 5) : B(j).type === "share" ? e(u, 6) : B(j).type === "countdown" ? e(d, 7) : B(j).type === "button" ? e(f, 8) : B(j).type === "image" ? e(p, 9) : B(j).type === "icon" ? e(m, 10) : B(j).type === "collection" ? e(h, 11) : B(j).type === "product" ? e(g, 12) : B(j).type === "cart" ? e(_, 13) : B(j).type === "gallery" ? e(v, 14) : B(j).type === "shape" && e(y, 15);
			});
			var b = R(n, 2), x = F(b), S = R(x);
			{
				let e = /* @__PURE__ */ A(() => B(j).fit === "shrink" ? "shrink" : "wrap"), t = /* @__PURE__ */ A(() => Jt.has(B(j).type) ? [["wrap", Z("opt.fit.fluid")], ["shrink", Z("opt.fit.floor")]] : [["wrap", Z("opt.fit.wrap")], ["shrink", Z("opt.fit.shrink")]]);
				Q(S, {
					get value() {
						return B(e);
					},
					get options() {
						return B(t);
					},
					onchange: (e) => Yt(e)
				});
			}
			D(b);
			var C = R(b, 2), w = (e) => {
				var t = hd(), n = F(t), r = L(n, !0), i = R(n, 2);
				J(i);
				var a = L(R(i, 2));
				D(t), z((e, n, o, s) => {
					X(t, "title", e), W(r, n), Y(i, o), W(a, `${s ?? ""} %`);
				}, [
					() => Z("tip.fitMin"),
					() => Z("lbl.fitMin"),
					() => Math.round((B(j).fitMin ?? .6) * 100),
					() => Math.round((B(j).fitMin ?? .6) * 100)
				]), V("input", i, (e) => Xt(e.target.valueAsNumber / 100)), U(e, t);
			};
			G(C, (e) => {
				B(j).fit === "shrink" && e(w);
			});
			var T = R(C, 4), ee = F(T), te = R(ee);
			{
				let e = /* @__PURE__ */ A(() => Jr(B(j).animation) ? B(j).animation.type : "");
				Q(te, {
					get value() {
						return B(e);
					},
					get options() {
						return Zr;
					},
					onchange: (e) => ei(e || null)
				});
			}
			D(T);
			var ne = R(T, 2), E = (e) => {
				var t = gd(), n = I(t), r = F(n), i = R(r);
				J(i), D(n);
				var a = R(n, 2), o = F(a), s = R(o);
				J(s), D(a), z((e, t) => {
					W(r, `${e ?? ""} `), Y(i, B(j).animation.props.duration), W(o, `${t ?? ""} `), Y(s, B(j).animation.props.delay);
				}, [() => Z("lbl.durationMs"), () => Z("lbl.delayMs")]), V("change", i, (e) => ni("duration", Number(e.target.value))), V("change", s, (e) => ni("delay", Number(e.target.value))), U(e, t);
			}, re = /* @__PURE__ */ A(() => Jr(B(j).animation));
			G(ne, (e) => {
				B(re) && e(E);
			});
			var ie = R(ne, 2), ae = F(ie), oe = R(ae);
			{
				let e = /* @__PURE__ */ A(() => B(j).hover?.type ?? (B(j).animation && !Jr(B(j).animation) ? B(j).animation.type : ""));
				Q(oe, {
					get value() {
						return B(e);
					},
					get options() {
						return Qr;
					},
					onchange: (e) => ti(e || null)
				});
			}
			D(ie);
			var se = R(ie, 2), ce = (e) => {
				var t = yd(), n = R(I(t), 2), r = F(n);
				J(r);
				var i = R(r);
				D(n);
				var a = R(n, 2), o = (e) => {
					var t = vd(), n = I(t), r = F(n), i = R(r);
					{
						let e = /* @__PURE__ */ A(() => B(j).sticky.mode ?? "scroll"), t = /* @__PURE__ */ A(() => [["scroll", Z("opt.sticky.modeScroll")], ["screen", Z("opt.sticky.modeScreen")]]);
						Q(i, {
							get value() {
								return B(e);
							},
							get options() {
								return B(t);
							},
							onchange: (e) => Kt(`edit:${B(j).blockId}`, (t) => {
								t.sticky = {
									...t.sticky,
									mode: e
								};
							})
						});
					}
					D(n);
					var a = R(n, 2), o = (e) => {
						var t = _d(), n = F(t), r = R(n);
						J(r), D(t), z((e, i) => {
							X(t, "title", e), W(n, `${i ?? ""} `), Y(r, B(j).sticky.offset ?? 16);
						}, [() => B(j).sticky.mode === "screen" ? Z("tip.stickyEdge") : Z("tip.stickyOffset"), () => B(j).sticky.mode === "screen" ? Z("lbl.stickyEdge") : Z("lbl.stickyOffset")]), V("change", r, (e) => Kt(`edit:${B(j).blockId}`, (t) => {
							t.sticky = {
								...t.sticky,
								offset: Math.max(0, Number(e.target.value) || 0)
							};
						})), U(e, t);
					};
					G(a, (e) => {
						(B(j).sticky.mode !== "screen" || (B(j).sticky.dock ?? "bottom-right") !== "middle-center") && e(o);
					});
					var s = R(a, 2), c = (e) => {
						var t = fu(), n = F(t), r = R(n);
						{
							let e = /* @__PURE__ */ A(() => B(j).sticky.dock ?? "bottom-right"), t = /* @__PURE__ */ A(() => Ut.map(([e, t]) => [e, Z(t)]));
							Q(r, {
								get value() {
									return B(e);
								},
								get options() {
									return B(t);
								},
								onchange: (e) => Kt(`edit:${B(j).blockId}`, (t) => {
									t.sticky = {
										...t.sticky,
										dock: e
									};
								})
							});
						}
						D(t), z((e, r) => {
							X(t, "title", e), W(n, `${r ?? ""} `);
						}, [() => Z("tip.stickyDock"), () => Z("lbl.stickyDock")]), U(e, t);
					}, l = (e) => {
						var t = fu(), n = F(t), r = R(n);
						{
							let e = /* @__PURE__ */ A(() => B(j).sticky.until ?? ""), t = /* @__PURE__ */ A(Wt);
							Q(r, {
								get value() {
									return B(e);
								},
								get options() {
									return B(t);
								},
								onchange: (e) => Kt(`edit:${B(j).blockId}`, (t) => {
									t.sticky = {
										...t.sticky,
										until: e || null
									};
								})
							});
						}
						D(t), z((e, r) => {
							X(t, "title", e), W(n, `${r ?? ""} `);
						}, [() => Z("tip.stickyUntil"), () => Z("lbl.stickyUntil")]), U(e, t);
					};
					G(s, (e) => {
						B(j).sticky.mode === "screen" ? e(c) : e(l, -1);
					}), z((e, t) => {
						X(n, "title", e), W(r, `${t ?? ""} `);
					}, [() => Z("tip.stickyMode"), () => Z("lbl.stickyMode")]), U(e, t);
				};
				G(a, (e) => {
					B(j).sticky && e(o);
				}), z((e, t, a) => {
					X(n, "title", e), Si(r, t), W(i, ` ${a ?? ""}`);
				}, [
					() => Z("tip.sticky"),
					() => !!B(j).sticky,
					() => Z("lbl.sticky")
				]), V("change", r, (e) => Kt(`edit:${B(j).blockId}`, (t) => {
					t.sticky = e.target.checked ? {
						offset: 16,
						until: null
					} : null;
				})), U(e, t);
			};
			G(se, (e) => {
				B(be) === "desktop" && e(ce);
			});
			var le = R(se, 4), ue = F(le), de = L(ue, !0), fe = R(ue, 2), pe = F(fe), me = (e) => {
				var t = bd(), n = F(t), r = F(n, !0), i = R(r);
				J(i), D(n);
				var a = R(n, 2), o = F(a, !0), s = R(o);
				J(s), D(a);
				var c = R(a, 2), l = F(c, !0), u = R(l);
				J(u), D(c);
				var d = R(c, 2), f = F(d, !0), p = R(f);
				J(p), D(d);
				var m = R(d, 2), h = F(m, !0), g = R(h);
				J(g), D(m);
				var _ = R(m, 2), v = F(_, !0), y = R(v);
				J(y), D(_), D(t), z((e, t, n, a, c, d, _) => {
					W(r, e), Y(i, B(j).frame.x), W(o, t), Y(s, B(j).frame.y), W(l, n), Y(u, B(j).frame.w), W(f, a), Y(p, B(j).frame.h), X(m, "title", c), W(h, d), Y(g, B(j).frame.z ?? 1), W(v, _), Y(y, B(j).frame.rot ?? 0);
				}, [
					() => Z("frame.x"),
					() => Z("frame.y"),
					() => Z("frame.w"),
					() => Z("frame.h"),
					() => Z("tip.frameZ"),
					() => Z("frame.z"),
					() => Z("frame.rot")
				]), V("change", i, (e) => on("x", Number(e.target.value))), V("change", s, (e) => on("y", Number(e.target.value))), V("change", u, (e) => on("w", Number(e.target.value))), V("change", p, (e) => on("h", Number(e.target.value))), V("change", g, (e) => on("z", Number(e.target.value))), V("change", y, (e) => on("rot", Number(e.target.value))), U(e, t);
			};
			G(pe, (e) => {
				B(be) === "desktop" && e(me);
			});
			var he = R(pe, 2), ge = F(he);
			J(ge);
			var _e = R(ge);
			D(he);
			var ve = R(he, 2), ye = F(ve);
			J(ye);
			var xe = R(ye);
			D(ve), D(fe), D(le), z((e, t, n, r, i, a, o, s, c, l, u, d) => {
				X(b, "title", e), W(x, `${t ?? ""} `), X(T, "title", n), W(ee, `${r ?? ""} `), X(ie, "title", i), W(ae, `${a ?? ""} `), X(ue, "title", o), W(de, s), X(he, "title", c), Si(ge, B(j).hideMobile), W(_e, ` ${l ?? ""}`), X(ve, "title", u), Si(ye, B(j).decor), W(xe, ` ${d ?? ""}`);
			}, [
				() => Z("tip.fit"),
				() => Z("lbl.fit"),
				() => Z("tip.props.blockAnim"),
				() => Z("lbl.animIn"),
				() => Z("tip.props.blockHover"),
				() => Z("lbl.onHover"),
				() => Z("hint.placement"),
				() => Z("group.placement"),
				() => Z("tip.hideMobile"),
				() => Z("lbl.hideMobile"),
				() => Z("tip.decor"),
				() => Z("lbl.decor")
			]), V("change", ge, (e) => An(e.target.checked)), V("change", ye, (e) => En(e.target.checked)), U(e, t);
		};
		G(d, (e) => {
			B(nn) === "content" ? e(f) : e(p, -1);
		}), z((e, t) => {
			o = q(a, 1, "svelte-1n46o8q", null, o, { on: B(nn) === "content" }), W(s, e), l = q(c, 1, "svelte-1n46o8q", null, l, { on: B(nn) === "style" }), W(u, t);
		}, [() => Z("props.tabContent"), () => Z("props.tabStyle")]), V("click", a, () => P(nn, "content")), V("click", c, () => P(nn, "style")), U(e, t);
	}, o = (e) => `<svg width="40" height="26" viewBox="0 0 40 26" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${e}</svg>`, s = {
		bar: o("<rect x=\"1\" y=\"1\" width=\"38\" height=\"7\" rx=\"1\"/><rect x=\"1\" y=\"11\" width=\"38\" height=\"14\" rx=\"1\" stroke-opacity=\"0.35\"/>"),
		floating: o("<rect x=\"5\" y=\"2\" width=\"30\" height=\"7\" rx=\"3.5\"/><rect x=\"1\" y=\"11\" width=\"38\" height=\"14\" rx=\"1\" stroke-opacity=\"0.35\"/>"),
		"floating-square": o("<rect x=\"5\" y=\"2\" width=\"30\" height=\"7\"/><rect x=\"1\" y=\"11\" width=\"38\" height=\"14\" rx=\"1\" stroke-opacity=\"0.35\"/>"),
		"floating-tab": o("<path d=\"M5 1h30v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z\"/><rect x=\"1\" y=\"11\" width=\"38\" height=\"14\" rx=\"1\" stroke-opacity=\"0.35\"/>"),
		"side-left": o("<rect x=\"1\" y=\"1\" width=\"9\" height=\"24\" rx=\"1\"/><rect x=\"13\" y=\"1\" width=\"26\" height=\"24\" rx=\"1\" stroke-opacity=\"0.35\"/>"),
		"side-right": o("<rect x=\"30\" y=\"1\" width=\"9\" height=\"24\" rx=\"1\"/><rect x=\"1\" y=\"1\" width=\"26\" height=\"24\" rx=\"1\" stroke-opacity=\"0.35\"/>")
	}, c = {
		"": o("<rect x=\"1\" y=\"4\" width=\"38\" height=\"18\" rx=\"1\" stroke-opacity=\"0.35\"/>"),
		bottom: o("<rect x=\"1\" y=\"4\" width=\"38\" height=\"18\" rx=\"1\" stroke-opacity=\"0.35\"/><path d=\"M1 22h38\" stroke-width=\"2.5\"/>"),
		top: o("<rect x=\"1\" y=\"4\" width=\"38\" height=\"18\" rx=\"1\" stroke-opacity=\"0.35\"/><path d=\"M1 4h38\" stroke-width=\"2.5\"/>"),
		both: o("<rect x=\"1\" y=\"4\" width=\"38\" height=\"18\" rx=\"1\" stroke-opacity=\"0.35\"/><path d=\"M1 4h38M1 22h38\" stroke-width=\"2.5\"/>"),
		all: o("<rect x=\"1\" y=\"4\" width=\"38\" height=\"18\" rx=\"1\" stroke-width=\"2.5\"/>")
	}, l = (e) => `<svg width="48" height="34" viewBox="0 0 48 34" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${e}</svg>`, u = {
		card: l("<path d=\"M14 1h20\" stroke-opacity=\"0.5\"/><rect x=\"10\" y=\"6\" width=\"28\" height=\"24\" rx=\"3\" fill=\"currentColor\" fill-opacity=\"0.18\"/><path d=\"M15 13h18M15 19h14M15 25h16\" stroke-opacity=\"0.8\"/>"),
		flat: l("<path d=\"M14 1h20\" stroke-opacity=\"0.5\"/><rect x=\"1\" y=\"6\" width=\"46\" height=\"24\" fill=\"currentColor\" fill-opacity=\"0.12\" stroke=\"none\"/><path d=\"M15 13h18M15 19h14M15 25h16\" stroke-opacity=\"0.8\"/>"),
		pills: l("<path d=\"M14 1h20\" stroke-opacity=\"0.5\"/><rect x=\"10\" y=\"7\" width=\"28\" height=\"6\" rx=\"3\" fill=\"currentColor\" fill-opacity=\"0.35\" stroke=\"none\"/><rect x=\"10\" y=\"16\" width=\"28\" height=\"6\" rx=\"3\" fill=\"currentColor\" fill-opacity=\"0.2\" stroke=\"none\"/><rect x=\"10\" y=\"25\" width=\"28\" height=\"6\" rx=\"3\" fill=\"currentColor\" fill-opacity=\"0.2\" stroke=\"none\"/>"),
		lines: l("<path d=\"M14 1h20\" stroke-opacity=\"0.5\"/><path d=\"M12 12h24M12 21h24M12 30h24\" stroke-opacity=\"0.8\"/>"),
		flyout: l("<path d=\"M14 1h20\" stroke-opacity=\"0.5\"/><rect x=\"1\" y=\"6\" width=\"46\" height=\"24\" fill=\"currentColor\" fill-opacity=\"0.12\" stroke=\"none\"/><path d=\"M6 13h10M6 19h8M22 13h10M22 19h8M38 13h6M38 19h4\" stroke-opacity=\"0.8\"/>")
	}, d = /* @__PURE__ */ N("");
	function p() {
		B(d).trim() && (P(ca, B(d), !0), P(la, null), ga(), P(d, ""));
	}
	let m = [
		["color", Uc],
		["gradient", tl],
		["glow", nl],
		["image", Ol],
		["slideshow", Nl],
		["video", zl],
		["grain", il]
	], g = Object.fromEntries(m), _ = {
		copy: "<svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"9\" y=\"9\" width=\"11\" height=\"11\" rx=\"2\"/><path d=\"M5 15V5a2 2 0 0 1 2-2h10\"/></svg>",
		phone: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"><rect x=\"8\" y=\"3\" width=\"8\" height=\"18\" rx=\"2\"/><path d=\"M11 17.5h2\"/></svg>",
		pencil: "<svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17 3l4 4L8 20l-5 1 1-5L17 3z\"/></svg>",
		eye: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z\"/><circle cx=\"12\" cy=\"12\" r=\"2.6\"/></svg>",
		warn: "<svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3L2 20h20L12 3z\"/><path d=\"M12 10v4\"/><path d=\"M12 17.2h.01\"/></svg>",
		up: "<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 20V4\"/><path d=\"M5 11l7-7 7 7\"/></svg>",
		down: "<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 4v16\"/><path d=\"M5 13l7 7 7-7\"/></svg>",
		right: "<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12h16\"/><path d=\"M13 5l7 7-7 7\"/></svg>",
		cross: "<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\"><path d=\"M5 5l14 14\"/><path d=\"M19 5L5 19\"/></svg>",
		plus: "<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\"><path d=\"M12 5v14\"/><path d=\"M5 12h14\"/></svg>",
		minus: "<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\"><path d=\"M5 12h14\"/></svg>",
		gear: "<svg width=\"15\" height=\"15\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z\"/></svg>",
		guides: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 2v20M2 12h20\" stroke-dasharray=\"3 3\"/><rect x=\"7.5\" y=\"7.5\" width=\"9\" height=\"9\" rx=\"1.5\"/></svg>",
		kebab: "<svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"currentColor\" stroke=\"none\"><circle cx=\"12\" cy=\"5\" r=\"1.8\"/><circle cx=\"12\" cy=\"12\" r=\"1.8\"/><circle cx=\"12\" cy=\"19\" r=\"1.8\"/></svg>",
		bookmark: "<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z\"/><path d=\"M12 7v6M9 10h6\"/></svg>",
		fit: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4\"/></svg>",
		gridToggle: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M9 3v18M15 3v18M3 9h18M3 15h18\"/></svg>",
		restore: "<svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 4v5h5\"/><path d=\"M3.05 13A9 9 0 1 0 6 5.3L3 9\"/><path d=\"M12 8v4.5l3 1.8\"/></svg>",
		foldToggle: "<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path class=\"ft-top\" d=\"M7 9l5-5 5 5\"/><path class=\"ft-bot\" d=\"M7 15l5 5 5-5\"/></svg>",
		caret: "<svg width=\"9\" height=\"9\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 9l6 6 6-6\"/></svg>",
		external: "<svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M14 4h6v6\"/><path d=\"M20 4l-8 8\"/><path d=\"M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5\"/></svg>",
		device_desktop: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"2\" y=\"3\" width=\"20\" height=\"13\" rx=\"2\"/><path d=\"M8 21h8M12 16v5\"/></svg>",
		device_laptop: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"4\" y=\"4\" width=\"16\" height=\"11\" rx=\"1.5\"/><path d=\"M2 19h20\"/></svg>",
		device_tablet: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"5\" y=\"2\" width=\"14\" height=\"20\" rx=\"2\"/><path d=\"M11 18.5h2\"/></svg>",
		device_mobile: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"7\" y=\"2\" width=\"10\" height=\"20\" rx=\"2\"/><path d=\"M11 18.5h2\"/></svg>"
	}, v = [
		["purple", Z("adminTheme.purple")],
		["well", Z("adminTheme.well")],
		["gold", Z("adminTheme.gold")],
		["grey", Z("adminTheme.grey")],
		["aurora", Z("adminTheme.aurora")],
		["dusk", Z("adminTheme.dusk")],
		["ember", Z("adminTheme.ember")]
	], y = {
		lilla: "purple",
		bronn: "well",
		gull: "gold",
		graa: "grey",
		nordlys: "aurora",
		skumring: "dusk",
		glo: "ember"
	}, b = /* @__PURE__ */ N(en((() => {
		let e = localStorage.getItem("urd-admin-theme");
		return y[e] ?? e ?? "grey";
	})()));
	xn(() => {
		document.documentElement.dataset.adminTheme = B(b), localStorage.setItem("urd-admin-theme", B(b)), x();
	});
	function x() {
		let e = getComputedStyle(document.documentElement), t = e.getPropertyValue("--urd-color-accent").trim();
		Ue?.sendAdminTheme({
			bg: e.getPropertyValue("--urd-color-bg").trim(),
			surface: e.getPropertyValue("--urd-color-surface").trim(),
			accent: t,
			text: e.getPropertyValue("--urd-color-text").trim(),
			"accent-text": S(t)
		});
	}
	function S(e) {
		return Vc(e) == null || (Hc(e, "#ffffff") ?? 0) >= (Hc(e, "#0b0e14") ?? 0) ? "#ffffff" : "#0b0e14";
	}
	let C = /* @__PURE__ */ N(null), w = /* @__PURE__ */ N(null), T = /* @__PURE__ */ N(!1), ee = /* @__PURE__ */ N(""), te = /* @__PURE__ */ N("info"), ne = 0;
	function E(e, t = "info") {
		P(ee, e, !0), P(te, t, !0);
		let n = ++ne;
		t === "ok" && setTimeout(() => {
			ne === n && (P(ee, ""), P(te, "info"));
		}, 8e3);
	}
	function re() {
		E(Z("status.storageFull"), "error");
	}
	function ie(e, t) {
		try {
			localStorage.setItem(e, t);
		} catch {
			re();
		}
	}
	let ae = /* @__PURE__ */ N(null), oe = /* @__PURE__ */ N(null), se = /* @__PURE__ */ N(en({
		size: 16,
		snap: !0
	})), ce = /* @__PURE__ */ N(!0), le = /* @__PURE__ */ N(en(po(typeof window < "u" ? window : null) ?? 1920)), ue = "urd-admin-screen";
	function de() {
		let e = null;
		try {
			e = JSON.parse(localStorage.getItem(ue) ?? "null");
		} catch {
			e = null;
		}
		return mo(e, B(le));
	}
	let fe = /* @__PURE__ */ N(en(de()));
	function pe(e) {
		P(fe, mo({
			...We(B(fe)),
			...e
		}, B(le)), !0);
		try {
			localStorage.setItem(ue, JSON.stringify(B(fe)));
		} catch {}
	}
	let me = /* @__PURE__ */ A(() => ho(B(fe), B(le))), he = [
		{
			id: "laptop",
			width: 1280,
			height: null,
			viewport: "desktop"
		},
		{
			id: "tablet",
			width: 810,
			height: null,
			viewport: "desktop"
		},
		{
			id: "mobile",
			width: 390,
			height: null,
			viewport: "mobile"
		}
	], ge = /* @__PURE__ */ A(() => [{
		id: "desktop",
		width: B(me).width,
		height: B(me).height || null,
		viewport: "desktop"
	}, ...he]);
	function _e(e) {
		let t = Co(B(Za), B(Qa), e.width).width;
		return Z(e.id === "desktop" ? B(fe).mode === "own" ? "tip.view.desktop" : e.height ? "tip.view.desktopSizeH" : "tip.view.desktopSize" : `tip.view.${e.id}`, {
			w: e.width,
			h: e.height ?? 0,
			c: t
		});
	}
	let ve = /* @__PURE__ */ N("desktop"), ye = /* @__PURE__ */ A(() => B(ge).find((e) => e.id === B(ve)) ?? B(ge)[0]), be = /* @__PURE__ */ A(() => B(ye).viewport === "mobile" || B(ye).width <= (B(k)?.breakpoints?.mobile ?? 640) ? "mobile" : "desktop"), xe = /* @__PURE__ */ N(null), Se = /* @__PURE__ */ N(0), Ce = /* @__PURE__ */ N(0), we = /* @__PURE__ */ N("fit"), Te = /* @__PURE__ */ N(1), Ee = /* @__PURE__ */ A(() => So(B(Za), B(Qa))), De = /* @__PURE__ */ A(() => B(ye).width), ke = /* @__PURE__ */ A(() => B(ye).height ?? 0), Ae = /* @__PURE__ */ A(() => B(we) === "manual" ? B(Te) : ao(B(Se), B(De), "fit", B(Ce), B(ke)));
	function je(e) {
		let t = Math.min(400, Math.max(10, (Math.round(Math.round(B(Ae) * 100) / 10) + e) * 10));
		P(Te, t / 100), P(we, "manual");
	}
	let Me = /* @__PURE__ */ A(() => B(ke) > 0 ? B(ke) : B(Ae) > 0 ? B(Ce) / B(Ae) : B(Ce)), Ne = /* @__PURE__ */ A(() => B(De) * B(Ae)), Pe = /* @__PURE__ */ A(() => B(ke) > 0 ? B(ke) * B(Ae) : B(Ce)), Fe = /* @__PURE__ */ A(() => B(Ne) > B(Se) + 1 || B(Pe) > B(Ce) + 1);
	xn(() => {
		let e = () => Ue?.sendCloseMenus();
		return document.addEventListener("pointerdown", e, !0), () => document.removeEventListener("pointerdown", e, !0);
	}), xn(() => {
		let e = B(be);
		Ue?.sendViewport(e);
	}), xn(() => {
		let e = B(Ae);
		Ue?.sendZoom(e);
	}), xn(() => {
		let e = () => {
			P(le, po(window) ?? B(le), !0);
		};
		return window.addEventListener("resize", e), () => window.removeEventListener("resize", e);
	}), xn(() => {
		let e = B(xe);
		if (!e || typeof ResizeObserver > "u") return;
		let t = () => {
			P(Se, e.clientWidth, !0), P(Ce, e.clientHeight, !0);
		};
		t();
		let n = new ResizeObserver(t);
		return n.observe(e), () => n.disconnect();
	});
	let Ie = /* @__PURE__ */ N(0);
	function Le() {
		P(Ie, O?.data.sections.filter((e) => e.responsive?.mobile?.attention?.needed).length ?? 0, !0);
	}
	function Re() {
		let e = O?.data.sections.find((e) => e.responsive?.mobile?.attention?.needed);
		P(ve, "mobile"), e && setTimeout(() => Ue?.sendScrollSection(e.id), 0);
	}
	function ze(e) {
		let t = O.data.sections.find((t) => t.id === e.sectionId);
		if (t) {
			nt("layout");
			for (let n of e.frames ?? []) {
				let e = t.blocks.find((e) => e.id === n.blockId);
				e && (e.frames.desktop = {
					...e.frames.desktop,
					...n.frame
				});
			}
			t.size = {
				...t.size,
				minHeight: e.minHeight
			}, Ve(t, "layout-changed"), e.sectionId === B(In) && P(Rn, e.minHeight, !0), B(j)?.sectionId === e.sectionId && zt(), O.save(), Ze(), Ue?.sendSection(B(w), t);
		}
	}
	function Be(e) {
		return e?.blocks?.some((e) => e.frames?.mobile) ?? !1;
	}
	function Ve(e, t) {
		!e || !Be(e) || e.responsive?.mobile?.attention?.needed || (e.responsive = {
			...e.responsive ?? {},
			mobile: {
				...e.responsive?.mobile ?? { mode: "auto" },
				attention: {
					needed: !0,
					reason: t,
					since: (/* @__PURE__ */ new Date()).toISOString()
				}
			}
		}, Le(), Ue?.sendAttention(e.id, !0));
	}
	let O = null, He = null, Ue = null, k = /* @__PURE__ */ N(null);
	function Ge() {
		P(k, He.data, !0), He.replace(B(k));
	}
	function Ke() {
		Ue?.sendSite(We(B(k)));
	}
	let qe = /* @__PURE__ */ new Set(), Xe = () => B(k).pages.find((e) => e.id === B(w));
	function Ze() {
		let e = B(k)?.pages?.some((e) => !qe.has(e.id) && localStorage.getItem(`urd-draft-${e.id}`) !== null) ?? !1, t = xs?.hasDraft() || Object.values(Ss).some((e) => e.hasDraft()), n = js?.hasDraft() || Object.values(Ms).some((e) => e.hasDraft());
		P(T, e || O?.hasDraft() && !qe.has(B(w)) || He?.hasDraft() || xc?.hasDraft() || t || n || !1, !0);
	}
	let Qe = [], $e = [], et = null;
	function tt() {
		return JSON.stringify({
			pageId: B(w),
			page: O.data,
			site: He.data,
			collectionsIndex: ws ? xs.data : null,
			collections: ws ? Object.fromEntries(Object.entries(Ss).map(([e, t]) => [e, t.data])) : {},
			templatesIndex: Ps ? js.data : null,
			templates: Ps ? Object.fromEntries(Object.entries(Ms).map(([e, t]) => [e, t.data])) : {},
			plugins: xc?.data ?? null
		});
	}
	function nt(e) {
		e === et && (e.startsWith("edit:") || e.startsWith("grid:")) || (Qe.push(tt()), Qe.length > 50 && Qe.shift(), $e.length = 0, et = e);
	}
	function rt(e) {
		let { pageId: t, page: n, site: r, collectionsIndex: i, collections: a, templatesIndex: o, templates: s, plugins: c } = JSON.parse(e);
		if (He.replace(r), Ge(), He.save(), P(se, {
			snap: !0,
			...B(k).grid
		}, !0), Ke(), it(i, a ?? {}), at(o, s ?? {}), ot(c), t && t !== B(w) && B(k).pages.some((e) => e.id === t)) {
			ie(`urd-draft-${t}`, JSON.stringify(n)), Vi(t, { keepHistory: !0 }), Ze();
			return;
		}
		O.replace(n), O.save(), Ze(), Le(), zt(), Un(O.data.sections.find((e) => e.id === B(In))), B(k).pages.some((e) => e.id === B(w)) ? Ue?.sendPage(B(w), O.data) : Vi(B(k).pages[0].id, { keepHistory: !0 });
	}
	function it(e, t) {
		if (!(!xs || !e) && JSON.stringify({
			index: xs.data,
			collections: Object.fromEntries(Object.entries(Ss).map(([e, t]) => [e, t.data]))
		}) !== JSON.stringify({
			index: e,
			collections: t
		})) {
			xs.replace(e), xs.save();
			for (let e of Object.keys(Ss)) e in t || (localStorage.removeItem(`urd-draft-collection-${e}`), localStorage.removeItem(`urd-draft-samling-${e}`), delete Ss[e]);
			for (let [e, n] of Object.entries(t)) {
				if (!Ss[e]) {
					let t = Cs[e] ?? null;
					Ss[e] = Zi(`urd-draft-collection-${e}`, () => t, re, `urd-draft-samling-${e}`);
				}
				Ss[e].replace(n), Ss[e].save();
			}
			P(Ts, [...e.samlinger ?? []], !0), B(Ds) && !B(Ts).includes(B(Ds)) && P(Ds, null), qs();
		}
	}
	function at(e, t) {
		if (!(!js || !e) && JSON.stringify({
			index: js.data,
			templates: Object.fromEntries(Object.entries(Ms).map(([e, t]) => [e, t.data]))
		}) !== JSON.stringify({
			index: e,
			templates: t
		})) {
			js.replace(e), js.save();
			for (let e of Object.keys(Ms)) e in t || (localStorage.removeItem(`urd-draft-template-${e}`), localStorage.removeItem(`urd-draft-mal-${e}`), delete Ms[e]);
			for (let [e, n] of Object.entries(t)) Ms[e] || (Ms[e] = Zi(`urd-draft-template-${e}`, () => Ns[e] ?? null, re, `urd-draft-mal-${e}`)), Ms[e].replace(n), Ms[e].save();
			P(Fs, [...e.maler ?? []], !0), Ze(), Ls();
		}
	}
	function ot(e) {
		!xc || !e || JSON.stringify(xc.data) !== JSON.stringify(e) && (xc.replace(e), xc.save(), Kc(), rl());
	}
	function st() {
		Qe.length && ($e.push(tt()), rt(Qe.pop()), et = null, E(Z("status.undone")));
	}
	function ct() {
		$e.length && (Qe.push(tt()), rt($e.pop()), et = null, E(Z("status.redone")));
	}
	function dt(e) {
		B(Vt) && (e.target instanceof Element && e.target.closest(".block-menu") || P(Vt, null));
	}
	function ft(e) {
		if (e.key === "Escape" && B(Vt)) {
			P(Vt, null);
			return;
		}
		if (!(e.ctrlKey || e.metaKey)) return;
		let t = e.key.toLowerCase();
		if (t === "d") {
			let t = e.target;
			if (t instanceof HTMLElement && (t.isContentEditable || t.tagName === "TEXTAREA" || t.tagName === "INPUT" && ![
				"number",
				"checkbox",
				"range",
				"color"
			].includes(t.type)) || !B(j) || B(be) === "mobile") return;
			e.preventDefault(), Ue?.sendDuplicate();
			return;
		}
		if (t !== "z" && t !== "y") return;
		let n = e.target;
		n instanceof HTMLElement && (n.isContentEditable || n.tagName === "TEXTAREA" || n.tagName === "INPUT" && ![
			"number",
			"checkbox",
			"range",
			"color"
		].includes(n.type)) || (e.preventDefault(), t === "y" || e.shiftKey ? ct() : st());
	}
	async function pt() {
		P(C, ls(await (await fetch("/content/site.json")).json()), !0), He = Zi("urd-draft-site", () => B(C), re), (He.data.schemaVersion ?? 1) > 3 && (console.warn(`Urd: the site draft has schemaVersion ${He.data.schemaVersion} (the engine has 3) and is discarded`), He.replace(We(B(C)))), He.replace(ls(He.data)), He.save(), Ge(), P(se, {
			snap: !0,
			...B(k).grid
		}, !0), await Vi(new URLSearchParams(location.search).get("page") ?? B(k).pages[0].id), await Xc(), await Us(), await Is(), await pi(), B(oe) && hi(), B(k).site.setup === !0 && !localStorage.getItem("urd-setup-done") && (P(bt, B(k).site.title, !0), P(xt, B(k).theme.tokens.color.accent, !0), P(St, B(k).theme.tokens.color.bg, !0), P(yt, !0));
	}
	let mt = /* @__PURE__ */ N(null);
	function ht({ title: e, lines: t = [], okLabel: n = Z("confirm.ok"), cancelLabel: r = Z("confirm.cancel") }) {
		return new Promise((i) => {
			P(mt, {
				title: e,
				lines: t,
				okLabel: n,
				cancelLabel: r,
				resolve: i
			}, !0);
		});
	}
	function gt({ title: e, lines: t = [], value: n = "", placeholder: r = "", okLabel: i = Z("confirm.ok"), cancelLabel: a = Z("confirm.cancel") }) {
		return new Promise((o) => {
			P(mt, {
				title: e,
				lines: t,
				okLabel: i,
				cancelLabel: a,
				resolve: o,
				prompt: !0,
				value: n,
				placeholder: r
			}, !0);
		});
	}
	function _t(e) {
		B(mt)?.resolve(B(mt).prompt ? e ? B(mt).value : null : e), P(mt, null);
	}
	let vt = !1;
	xn(() => {
		if (!B(mt)) return;
		let e = (e) => {
			e.key === "Escape" && (e.stopPropagation(), _t(!1));
		};
		return document.addEventListener("keydown", e, !0), () => document.removeEventListener("keydown", e, !0);
	});
	let yt = /* @__PURE__ */ N(!1), bt = /* @__PURE__ */ N(""), xt = /* @__PURE__ */ N("#7c5cff"), St = /* @__PURE__ */ N("#0b0e14");
	function Ct() {
		localStorage.setItem("urd-setup-done", "1"), P(yt, !1);
	}
	function wt() {
		let e = B(bt).trim();
		e && (sa("setup", () => {
			B(k).site.title = e, B(k).nav.logo = {
				type: "text",
				value: e
			}, B(k).theme.tokens.color.accent = B(xt), B(k).theme.tokens.color.bg = B(St), delete B(k).site.setup;
		}), Ct(), E(Z("status.setupDone"), "ok"));
	}
	let Tt = /* @__PURE__ */ N(null), Et = [
		[
			"pages",
			"blocks",
			"properties",
			"grid"
		],
		[
			"site",
			"theme",
			"nav",
			"footer",
			"collections",
			"plugins"
		],
		["history", "update"]
	], Dt = [
		"rail.thisPage",
		"rail.site",
		"rail.system"
	], Ot = Object.fromEntries(Et.flat().map((e) => [e, Z(`panel.${e}`)])), kt = {
		pages: ["hint.pages.drafts"],
		blocks: ["hint.blocks.intro"],
		grid: ["hint.grid.intro", "hint.grid.section"],
		collections: ["hint.collections.intro"],
		plugins: ["hint.plugins.intro"],
		history: ["hint.history.intro"]
	}, At = [
		["se", "Davvisámegiella"],
		["en-GB", "English (UK)"],
		["nb", "Norsk bokmål"],
		["nn", "Norsk nynorsk"],
		["tr", "Türkçe"]
	], jt = (e) => [...e].sort((e, t) => e[1].localeCompare(t[1]));
	function Mt(e, t) {
		let n = [];
		for (let r of e) for (let e of Ec[r]?.languages ?? []) e?.[t] === !0 && (typeof e.code != "string" || typeof e.name != "string" || !e.name || At.some(([t]) => t === e.code) || n.some(([t]) => t === e.code) || n.push([e.code, e.name]));
		return n;
	}
	function Nt() {
		let e = jt([...At, ...Mt(B(Rc), "admin")]);
		return Ft === "auto" || e.some(([e]) => e === Ft) ? e : [[Ft, Ft], ...e];
	}
	let Pt = () => Mt(B(wc)?.enabled ?? [], "site"), Ft = localStorage.getItem("urd-admin-lang") ?? "auto";
	function It(e) {
		e !== Ft && (e === "auto" ? localStorage.removeItem("urd-admin-lang") : localStorage.setItem("urd-admin-lang", e), location.reload());
	}
	function Lt(e) {
		P(Tt, B(Tt) === e ? null : e, !0), B(Tt) === "history" && xi(), B(Tt) === "update" && !B(Ni) && Fi();
	}
	let j = /* @__PURE__ */ N(null);
	function Rt(e, t) {
		let n = O?.data.sections.find((t) => t.id === e);
		return {
			section: n,
			block: n?.blocks.find((e) => e.id === t)
		};
	}
	function zt() {
		if (!B(j)) return;
		let { block: e } = Rt(B(j).sectionId, B(j).blockId);
		if (!e) {
			P(j, null);
			return;
		}
		P(j, {
			sectionId: B(j).sectionId,
			blockId: B(j).blockId,
			type: e.type,
			decor: !!e.decor,
			hideMobile: !!e.hideMobile,
			props: JSON.parse(JSON.stringify(e.props)),
			frame: { ...e.frames.desktop },
			animation: e.animation ? JSON.parse(JSON.stringify(e.animation)) : null,
			hover: e.hover ? JSON.parse(JSON.stringify(e.hover)) : null,
			sticky: e.sticky ? JSON.parse(JSON.stringify(e.sticky)) : null
		}, !0);
	}
	function Bt(e) {
		if (P(Vt, null), !e.blockId) {
			P(j, null);
			return;
		}
		P(j, {
			sectionId: e.sectionId,
			blockId: e.blockId
		}, !0), e.sectionId && P(In, e.sectionId, !0), zt();
	}
	let Vt = /* @__PURE__ */ N(null), Ht = window.matchMedia("(prefers-reduced-motion: reduce)").matches, Ut = [
		["top-left", "opt.dock.topLeft"],
		["top-center", "opt.dock.topCenter"],
		["top-right", "opt.dock.topRight"],
		["middle-left", "opt.dock.middleLeft"],
		["middle-center", "opt.dock.middleCenter"],
		["middle-right", "opt.dock.middleRight"],
		["bottom-left", "opt.dock.bottomLeft"],
		["bottom-center", "opt.dock.bottomCenter"],
		["bottom-right", "opt.dock.bottomRight"]
	];
	function Wt() {
		let e = O?.data.sections ?? [], t = e.findIndex((e) => e.id === B(j)?.sectionId);
		return t < 0 ? [["", Z("opt.sticky.ownSection")]] : [["", Z("opt.sticky.ownSection")], ...e.slice(t + 1).map((e, n) => [e.id, Z("opt.sticky.atSection", { n: t + 2 + n })])];
	}
	function Gt(e) {
		if (Bt(e), !B(j)) return;
		let t = B(ae)?.getBoundingClientRect();
		if (!t) return;
		let n = t.left + B(Ae) * e.rect.right + 12;
		n + 300 > window.innerWidth - 8 && (n = Math.max(8, t.left + B(Ae) * e.rect.left - 300 - 12));
		let r = window.innerHeight - Math.min(window.innerHeight * .7, 560) - 8, i = Math.min(Math.max(8, t.top + B(Ae) * e.rect.top), Math.max(8, r));
		P(Vt, {
			left: n,
			top: i
		}, !0);
	}
	function Kt(e, t) {
		let { section: n, block: r } = Rt(B(j)?.sectionId, B(j)?.blockId);
		r && (e && nt(e), t(r, n), Ve(n, "block-edited"), O.save(), Ze(), Ue?.sendSection(B(w), n), zt());
	}
	function M(e, t) {
		Kt(`edit:${B(j).blockId}:${e}`, (n) => {
			n.props[e] = t;
		});
	}
	function qt(e, t) {
		Kt(`edit:${B(j).blockId}:${e}`, (e) => {
			Object.assign(e.props, t);
		});
	}
	let Jt = /* @__PURE__ */ new Set([
		"image",
		"video",
		"shape",
		"icon"
	]);
	function Yt(e) {
		Kt(`edit:${B(j).blockId}:fit`, (t) => {
			e === "shrink" ? (t.fit = "shrink", t.fitMin ??= .6) : (delete t.fit, delete t.fitMin);
		});
	}
	function Xt(e) {
		Kt(`edit:${B(j).blockId}:fitMin`, (t) => {
			t.fitMin = e;
		});
	}
	let Zt = en({}), Qt = en({}), $t = /* @__PURE__ */ N(!1), nn = /* @__PURE__ */ N("content"), rn = (e, t) => (Number.isFinite(t) || (t = e.min ?? 0), e.min != null && (t = Math.max(e.min, t)), e.max != null && (t = Math.min(e.max, t)), t);
	async function an(e) {
		let t = B(j).blockId, n = `${t}:${e.key}`, r = (Zt[n] ?? B(j).props[e.key] ?? "").trim();
		Qt[n] = null;
		let i = r.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
		if (!r || i || /^https?:\/\//i.test(r)) {
			qt(e.key, {
				[e.key]: r,
				lat: i ? Number(i[1]) : null,
				lon: i ? Number(i[2]) : null
			});
			return;
		}
		P($t, !0), Qt[n] = {
			text: Z("props.place.searching"),
			err: !1
		};
		try {
			let i = await fetch(`/api/geocode?q=${encodeURIComponent(r)}`), a = await i.json().catch(() => null);
			if (B(j)?.blockId !== t) return;
			i.ok && Number.isFinite(a?.lat) ? (qt(e.key, {
				[e.key]: r,
				lat: a.lat,
				lon: a.lon
			}), Qt[n] = null) : Qt[n] = {
				text: Ui(a) ?? Z("props.place.notFound"),
				err: !0
			};
		} catch {
			Qt[n] = {
				text: Z("props.place.failed"),
				err: !0
			};
		} finally {
			P($t, !1);
		}
	}
	function on(e, t) {
		Number.isFinite(t) && Kt(`edit:frame-${B(j).blockId}:${e}`, (n) => {
			n.frames.desktop = {
				...n.frames.desktop,
				[e]: t
			};
		});
	}
	function sn(e) {
		Kt(`edit:${B(j).blockId}:boxStyle`, (t) => {
			let n = {
				...t.props.boxStyle ?? {},
				...e
			};
			for (let e of Object.keys(n)) n[e] ?? delete n[e];
			Object.keys(n).length ? t.props.boxStyle = n : delete t.props.boxStyle;
		});
	}
	let cn = [
		"text",
		"email",
		"tel",
		"textarea",
		"select",
		"checkbox",
		"radio",
		"date"
	], ln = /* @__PURE__ */ new Set(["select", "radio"]), un = () => "f" + [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(3))].map((e) => e.toString(16).padStart(2, "0")).join("");
	function dn(e, t) {
		Kt(`edit:${B(j).blockId}:field${e}`, (n) => {
			let r = {
				...n.props.fields[e],
				...t
			};
			ln.has(r.type) ? r.options ??= [] : delete r.options, n.props.fields[e] = r;
		});
	}
	function fn(e, t) {
		dn(e, { options: String(t).split(",").map((e) => e.trim()).filter(Boolean) });
	}
	function pn() {
		Kt("form-field", (e) => {
			(e.props.fields ??= []).push({
				id: un(),
				label: Z("form.newField"),
				type: "text",
				required: !1
			});
		});
	}
	function mn(e) {
		Kt("form-field", (t) => {
			t.props.fields.splice(e, 1);
		});
	}
	function hn(e, t) {
		let n = e + t;
		Kt("form-field", (t) => {
			n < 0 || n >= t.props.fields.length || ([t.props.fields[e], t.props.fields[n]] = [t.props.fields[n], t.props.fields[e]]);
		});
	}
	function gn(e) {
		M("sources", String(e).split("\n").map((e) => e.trim()).filter(Boolean));
	}
	function _n(e, t) {
		Kt(`edit:${B(j).blockId}:faq${e}`, (n) => {
			n.props.items[e] = {
				...n.props.items[e],
				...t
			};
		});
	}
	function vn() {
		Kt("faq-item", (e) => {
			(e.props.items ??= []).push({
				q: Z("seed.faq.newQ"),
				a: Z("seed.faq.answer")
			});
		});
	}
	function yn(e) {
		Kt("faq-item", (t) => {
			t.props.items.splice(e, 1);
		});
	}
	function bn(e, t) {
		let n = e + t;
		Kt("faq-item", (t) => {
			n < 0 || n >= t.props.items.length || ([t.props.items[e], t.props.items[n]] = [t.props.items[n], t.props.items[e]]);
		});
	}
	function Sn(e, t) {
		Kt(`edit:${B(j).blockId}:tl${e}`, (n) => {
			n.props.items[e] = {
				...n.props.items[e],
				...t
			};
		});
	}
	function Cn() {
		Kt("tl-item", (e) => {
			(e.props.items ??= []).push({
				year: "",
				title: Z("seed.timeline.newTitle"),
				text: ""
			});
		});
	}
	function wn(e) {
		Kt("tl-item", (t) => {
			t.props.items.splice(e, 1);
		});
	}
	function Tn(e, t) {
		let n = e + t;
		Kt("tl-item", (t) => {
			n < 0 || n >= t.props.items.length || ([t.props.items[e], t.props.items[n]] = [t.props.items[n], t.props.items[e]]);
		});
	}
	function En(e) {
		Kt("decor", (t) => {
			t.decor = e;
		});
	}
	function Dn(e, t) {
		Kt(`edit:${B(j).blockId}:table-form`, (n) => {
			let r = (Array.isArray(n.props.rows) && n.props.rows.length ? n.props.rows : [[""]]).map((e) => Array.isArray(e) ? e.map((e) => String(e ?? "")) : [""]), i = Math.max(1, ...r.map((e) => e.length));
			r = r.map((e) => [...e, ...Array(i - e.length).fill("")]), e > 0 ? r.push(Array(i).fill("")) : e < 0 && r.length > 1 && r.pop(), t > 0 ? r = r.map((e) => [...e, ""]) : t < 0 && i > 1 && (r = r.map((e) => e.slice(0, i - 1))), n.props.rows = r;
		});
	}
	function On(e, t) {
		Kt(`edit:${B(j).blockId}:share`, (n) => {
			let r = [
				"facebook",
				"x",
				"linkedin",
				"whatsapp",
				"email",
				"copy"
			], i = new Set(n.props.services ?? []);
			t ? i.add(e) : i.delete(e), n.props.services = r.filter((e) => i.has(e));
		});
	}
	function kn(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", !t) return;
		let n = new FileReader();
		n.onload = () => {
			M("src", String(n.result ?? "")), t.size > 4e5 && E(Z("status.audioLarge", { kb: Math.round(t.size / 1024) }), "error");
		}, n.onerror = () => E(Z("status.imageReadError"), "error"), n.readAsDataURL(t);
	}
	function An(e) {
		let { section: t, block: n } = Rt(B(j)?.sectionId, B(j)?.blockId);
		n && (nt("hide-mobile"), n.hideMobile = e, O.save(), Ze(), Ue?.sendSection(B(w), t), zt());
	}
	async function jn(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", t) try {
			let e = await Cr(t);
			Kt(`edit:${B(j).blockId}`, (n) => {
				n.props.src = e.dataUrl, n.props.alt = n.props.alt || Da(t.name).replaceAll("-", " ");
			});
		} catch {
			E(Z("status.imageReadError"), "error");
		}
	}
	async function Mn(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", t) try {
			let e = await Cr(t);
			Kt(`edit:${B(j).blockId}`, (t) => {
				t.props.image = e.dataUrl;
			});
		} catch {
			E(Z("status.imageReadError"), "error");
		}
	}
	let Nn = {
		text: Z("blocks.text"),
		button: Z("blocks.button"),
		image: Z("blocks.image"),
		shape: Z("blocks.shape"),
		video: Z("blocks.video"),
		icon: Z("blocks.icon"),
		gallery: Z("blocks.gallery"),
		faq: Z("blocks.faq"),
		collection: Z("blocks.collection"),
		timeline: Z("blocks.timeline"),
		quote: Z("blocks.quote"),
		stats: Z("blocks.stats"),
		table: Z("blocks.table"),
		share: Z("blocks.share"),
		countdown: Z("blocks.countdown"),
		audio: Z("blocks.audio"),
		product: Z("blocks.product"),
		cart: Z("blocks.cart"),
		checkout: Z("blocks.checkout"),
		map: Z("blocks.map"),
		form: Z("blocks.form"),
		calendar: Z("blocks.calendar")
	}, Pn = [
		["line", Z("shape.line")],
		["arrow", Z("shape.arrow")],
		["circle", Z("shape.circle")],
		["rect", Z("shape.rect")],
		["triangle", Z("shape.triangle")]
	], Fn = [
		["accent", Z("color.accent")],
		["text", Z("color.text")],
		["surface", Z("color.surface")],
		["bg", Z("color.bg")]
	], In = /* @__PURE__ */ N(null), Ln = /* @__PURE__ */ N(null), Rn = /* @__PURE__ */ N(""), zn = /* @__PURE__ */ N(en([])), Bn = /* @__PURE__ */ N(null), Vn = /* @__PURE__ */ N(null), Hn = /* @__PURE__ */ N("");
	function Un(e) {
		P(Ln, e?.grid ? { ...e.grid } : null, !0), P(Rn, e?.size?.minHeight ?? "", !0), P(zn, JSON.parse(JSON.stringify(e?.background?.layers ?? [])), !0), P(Bn, e?.animation ? JSON.parse(JSON.stringify(e.animation)) : null, !0), P(Vn, e?.hover ? JSON.parse(JSON.stringify(e.hover)) : null, !0), P(Hn, e?.theme ?? "", !0);
	}
	let Wn = /* @__PURE__ */ N(null), Gn = en({});
	function Kn() {
		try {
			let e = ((B(ae)?.contentDocument)?.querySelector(`.urd-section[data-section-id="${B(In)}"]`))?.getBoundingClientRect();
			P(Wn, e && e.width ? {
				w: e.width,
				h: e.height
			} : null, !0);
		} catch {
			P(Wn, null);
		}
	}
	xn(() => {
		B(In), B(zn), requestAnimationFrame(() => requestAnimationFrame(Kn));
	}), xn(() => {
		let e = B(ae);
		if (!e || typeof ResizeObserver > "u") return;
		let t = new ResizeObserver(() => Kn());
		return t.observe(e), () => t.disconnect();
	}), xn(() => {
		for (let e of B(zn)) {
			let t = e?.props?.src;
			if (e?.type === "image" && t && !Gn[t]) {
				let e = new Image();
				e.onload = () => {
					Gn[t] = {
						w: e.naturalWidth,
						h: e.naturalHeight
					};
				}, e.src = t;
			}
		}
	});
	function qn(e) {
		Xn("section-theme", (t) => {
			e ? t.theme = e : delete t.theme;
		});
	}
	function Jn(e) {
		let t = B(Rr), n = (e) => e.replaceAll("var(--urd-base-bg)", t.bg).replaceAll("var(--urd-base-surface)", t.surface).replaceAll("var(--urd-base-text)", t.text).replaceAll("var(--urd-base-accent)", t.accent).replaceAll("var(--urd-base-accent-text)", t["accent-text"] ?? S(Zm(t.accent ?? "#000000", t))), r = Bc(e);
		return {
			bg: r["--urd-color-bg"] ? n(r["--urd-color-bg"]) : t.bg,
			surface: r["--urd-color-surface"] ? n(r["--urd-color-surface"]) : t.surface,
			text: r["--urd-color-text"] ? n(r["--urd-color-text"]) : t.text,
			accent: r["--urd-color-accent"] ? n(r["--urd-color-accent"]) : t.accent
		};
	}
	function Yn(e) {
		P(In, e.sectionId, !0), Un(O?.data.sections.find((t) => t.id === e.sectionId));
	}
	function Xn(e, t) {
		let n = O.data.sections.find((e) => e.id === B(In));
		n && (nt(e), t(n), O.save(), Ze(), Ue?.sendSection(B(w), n), Un(n));
	}
	let Zn = /* @__PURE__ */ N("color");
	function Qn(e, t) {
		e.mutate(e.keyPrefix, (e) => {
			e.background ??= {
				version: 1,
				layers: []
			}, e.background.layers.push({
				type: t,
				version: g[t].version ?? 1,
				props: g[t].defaults()
			});
		});
	}
	function $n(e, t) {
		e.mutate(e.keyPrefix, (e) => {
			e.background.layers.splice(t, 1), e.background.layers.length || delete e.background;
		});
	}
	function er(e, t, n) {
		let r = t + n;
		e.mutate(e.keyPrefix, (e) => {
			let n = e.background.layers;
			r < 0 || r >= n.length || ([n[t], n[r]] = [n[r], n[t]]);
		});
	}
	function tr(e, t, n, r) {
		e.mutate(`edit:${e.keyPrefix}-${e.keyId}-${t}-${n}`, (e) => {
			e.background.layers[t].props[n] = r;
		});
	}
	function nr(e, t, n, r = "xy") {
		e.preventDefault();
		let i = e.currentTarget;
		i.setPointerCapture?.(e.pointerId);
		let a = (e) => {
			let a = i.getBoundingClientRect();
			if (r.includes("x")) {
				let r = Math.min(1, Math.max(0, (e.clientX - a.left) / a.width));
				tr(t, n, "x", Math.round(r * 100) / 100);
			}
			if (r.includes("y")) {
				let r = Math.min(1, Math.max(0, (e.clientY - a.top) / a.height));
				tr(t, n, "y", Math.round(r * 100) / 100);
			}
		};
		a(e);
		let o = () => {
			i.removeEventListener("pointermove", a), i.removeEventListener("pointerup", o), i.removeEventListener("pointercancel", o);
		};
		i.addEventListener("pointermove", a), i.addEventListener("pointerup", o), i.addEventListener("pointercancel", o);
	}
	let rr = (e) => Math.min(4, Math.max(.1, e));
	function ir(e, t, n, r) {
		tr(e, t, "size", rr(Math.round((n + r) * 100) / 100));
	}
	function ar(e, t, n) {
		let r = Number(n);
		Number.isFinite(r) && tr(e, t, "size", rr(r / 100));
	}
	function or(e, t, n, r) {
		let i = Gn[n.props.src];
		if (!i?.w || !i?.h || !B(Wn)?.w || !B(Wn)?.h) return;
		let a = B(Wn).h * i.w / (B(Wn).w * i.h), o = r === "cover" ? Math.max(1, a) : Math.min(1, a);
		(n.props.fit === "tile" || n.props.fit === "repeat") && tr(e, t, "fit", "plain"), tr(e, t, "size", rr(Math.round(o * 100) / 100));
	}
	function sr(e) {
		return e.props;
	}
	function cr(e, t, n, r) {
		e.mutate(n, (e) => {
			r(e.background.layers[t].props);
		});
	}
	function lr(e, t, n, r) {
		cr(e, t, `edit:${e.keyPrefix}-${e.keyId}-${t}-${n}`, (e) => {
			e[n] = r;
		});
	}
	let ur = {
		linear: [
			["none", Z("common.none")],
			["pan", Z("opt.gradAnim.pan")],
			["pan-loop", Z("opt.gradAnim.panLoop")],
			["rotate", Z("opt.gradAnim.rotate")]
		],
		radial: [
			["none", Z("common.none")],
			["pulse", Z("opt.gradAnim.pulse")],
			["orbit", Z("opt.gradAnim.orbit")]
		]
	};
	function dr(e, t, n) {
		cr(e, t, e.keyPrefix, (e) => {
			e.kind = n, ur[n].some(([t]) => t === (e.animation ?? "none")) || (e.animation = "none");
		});
	}
	function fr(e, t, n, r) {
		cr(e, t, `edit:${e.keyPrefix}-${e.keyId}-${t}-stop${n}`, (e) => {
			e.stops[n] = {
				...e.stops[n],
				...r
			};
		});
	}
	function mr(e, t) {
		cr(e, t, e.keyPrefix, (e) => {
			let t = Math.round(e.stops.reduce((e, t) => e + (Number(t.share) || 0), 0) / e.stops.length) || 50;
			e.stops.push({
				color: e.stops[e.stops.length - 1]?.color ?? "#ffffff",
				share: t
			});
		});
	}
	function hr(e, t, n) {
		cr(e, t, e.keyPrefix, (e) => {
			e.stops.length > 2 && e.stops.splice(n, 1);
		});
	}
	function gr(e, t, n, r) {
		cr(e, t, e.keyPrefix, (e) => {
			let [t] = e.stops.splice(n, 1);
			e.stops.splice(r, 0, t);
		});
	}
	let _r = /* @__PURE__ */ N(null);
	function vr(e, t, n, r) {
		if (t.button !== 0) return;
		t.preventDefault();
		let i = t.currentTarget.closest(".bg-layer"), a = t.currentTarget.closest(".grad-stop");
		P(_r, {
			layer: n,
			from: r,
			insert: r
		}, !0);
		let o = a.getBoundingClientRect(), s = t.clientY - o.top, c = a.cloneNode(!0);
		c.style.cssText = `position:fixed;left:${o.left}px;top:${o.top}px;width:${o.width}px;display:flex;align-items:center;gap:0.4rem;pointer-events:none;z-index:1000;opacity:0.92;padding:2px 4px;background:var(--urd-color-surface);border:1px solid var(--urd-color-accent);border-radius:6px;`, document.body.appendChild(c);
		let l = (e) => {
			c.style.top = `${e.clientY - s}px`;
			let t = [...i.querySelectorAll(".grad-stop")].map((e) => e.getBoundingClientRect()), n = t.length;
			for (let r = 0; r < t.length; r++) if (e.clientY < t[r].top + t[r].height / 2) {
				n = r;
				break;
			}
			P(_r, {
				...B(_r),
				insert: n
			}, !0);
		}, u = () => {
			window.removeEventListener("pointermove", l), window.removeEventListener("pointerup", u), c.remove();
			let t = B(_r);
			if (P(_r, null), !t) return;
			let n = t.insert > t.from ? t.insert - 1 : t.insert;
			n !== t.from && gr(e, t.layer, t.from, n);
		};
		window.addEventListener("pointermove", l), window.addEventListener("pointerup", u);
	}
	function yr(e, t, n) {
		e.mutate(e.keyPrefix, (e) => {
			e.background.layers[t].type !== n && (e.background.layers[t] = {
				type: n,
				version: g[n].version ?? 1,
				props: g[n].defaults()
			});
		});
	}
	async function br(e, t) {
		try {
			let n = new Image();
			await new Promise((t, r) => {
				n.onload = t, n.onerror = r, n.src = e;
			});
			let r = Math.max(1, Math.round(320 * t[3] / t[2])), i = document.createElement("canvas");
			i.width = 320, i.height = r;
			let a = i.getContext("2d");
			a.drawImage(n, 0, 0, 320, r);
			let o = a.getImageData(0, 0, 320, r).data, s = 320, c = r, l = -1, u = -1;
			for (let e = 0; e < r; e++) for (let t = 0; t < 320; t++) o[(e * 320 + t) * 4 + 3] > 8 && (t < s && (s = t), t > l && (l = t), e < c && (c = e), e > u && (u = e));
			if (l < s) return null;
			let d = t[2] / 320, f = t[3] / r;
			return {
				x: t[0] + s * d,
				y: t[1] + c * f,
				width: (l - s + 1) * d,
				height: (u - c + 1) * f
			};
		} catch {
			return null;
		}
	}
	async function xr(e) {
		let t = await e.text(), n = Ca(t), r = Ta(t);
		if (!r) return n;
		let i = await br(n.dataUrl, r);
		if (!i) return n;
		let a = wa(t, i);
		if (a === t) return n;
		try {
			return Ca(a);
		} catch {
			return n;
		}
	}
	async function Cr(e) {
		return e.type === "image/svg+xml" || /\.svg$/i.test(e.name || "") ? xr(e) : ba(e);
	}
	async function Tr(e, t, n) {
		let r = n.target.files?.[0];
		if (n.target.value = "", r) try {
			tr(e, t, "src", (await Cr(r)).dataUrl);
		} catch {
			E(Z("status.imageReadError"), "error");
		}
	}
	function Er(e, t, n) {
		let r = n.target.files?.[0];
		if (n.target.value = "", !r) return;
		if (!["video/mp4", "video/webm"].includes(r.type)) {
			E(Z("status.videoFormat"), "error");
			return;
		}
		if (r.size > 15e6) {
			E(Z("status.videoTooLarge", {
				mb: (r.size / 1e6).toFixed(1),
				max: Math.round(ya / 1e6)
			}), "error");
			return;
		}
		let i = new FileReader();
		i.onload = () => {
			tr(e, t, "src", String(i.result ?? "")), r.size > 4e6 && E(Z("status.videoLarge", { mb: (r.size / 1e6).toFixed(1) }), "error");
		}, i.onerror = () => E(Z("status.imageReadError"), "error"), i.readAsDataURL(r);
	}
	async function Dr(e, t, n) {
		let r = n.target.files?.[0];
		if (n.target.value = "", r) try {
			tr(e, t, "poster", (await Cr(r)).dataUrl);
		} catch {
			E(Z("status.imageReadError"), "error");
		}
	}
	async function Or(e, t, n) {
		let r = [...n.target.files ?? []];
		if (n.target.value = "", !r.length) return;
		E(Z("status.compressingImages"));
		let { images: i, failed: a, big: o } = await Ah(r);
		i.length && e.mutate(e.keyPrefix, (e) => {
			let n = e.background.layers[t].props;
			n.images ??= [], n.images.push(...i.map(({ src: e }) => ({
				src: e,
				x: .5,
				y: .5
			})));
		}), jh(i.length, a, o);
	}
	function kr(e, t, n, r) {
		e.mutate(e.keyPrefix, (e) => {
			let i = e.background.layers[t].props.images, a = n + r;
			a < 0 || a >= i.length || ([i[n], i[a]] = [i[a], i[n]]);
		});
	}
	function Ar(e, t, n) {
		e.mutate(e.keyPrefix, (e) => {
			e.background.layers[t].props.images.splice(n, 1);
		});
	}
	function jr(e, t, n, r, i) {
		e.mutate(`edit:${e.keyPrefix}g-${e.keyId}-${t}-${n}-${r}`, (e) => {
			e.background.layers[t].props.images[n][r] = i;
		});
	}
	function Mr(e, t) {
		sa(e, () => {
			B(k).nav.style ??= {}, t(B(k).nav.style);
		});
	}
	let H = /* @__PURE__ */ A(() => ({
		mutate: Xn,
		keyPrefix: "bg",
		keyId: B(In)
	})), Nr = {
		mutate: Mr,
		keyPrefix: "navbg",
		keyId: "nav"
	}, Fr = {
		mutate: cl,
		keyPrefix: "footerbg",
		keyId: "footer"
	}, Ir = () => {
		let e = null;
		try {
			e = localStorage.getItem("urd-theme-mode");
		} catch {}
		return Mc(B(k)?.theme?.scheme, e, window.matchMedia("(prefers-color-scheme: dark)").matches);
	}, Lr = /* @__PURE__ */ N("light");
	xn(() => {
		P(Lr, Ir(), !0);
		let e = window.matchMedia("(prefers-color-scheme: dark)"), t = (e) => {
			e instanceof StorageEvent && e.key && e.key !== "urd-theme-mode" || P(Lr, Ir(), !0);
		};
		return e.addEventListener("change", t), window.addEventListener("storage", t), () => {
			e.removeEventListener("change", t), window.removeEventListener("storage", t);
		};
	});
	let Rr = /* @__PURE__ */ A(() => B(k)?.theme ? Nc(B(k).theme, B(Lr)).color ?? {} : {}), zr = () => Object.entries(B(Rr)), Br = [
		[
			"bg",
			Z("palette.bg"),
			Z("palette.bgShort")
		],
		[
			"surface",
			Z("palette.surface"),
			Z("palette.surfaceShort")
		],
		[
			"text",
			Z("palette.text"),
			Z("palette.textShort")
		],
		[
			"accent",
			Z("palette.accent"),
			Z("palette.accentShort")
		],
		[
			"accent-text",
			Z("palette.accentText"),
			Z("palette.accentTextShort")
		]
	], Vr = /* @__PURE__ */ A(() => !!B(k)?.theme.alt), Hr = /* @__PURE__ */ A(() => B(k)?.theme.alt?.auto === !0), Ur = /* @__PURE__ */ A(() => B(k)?.theme.scheme === "dark" ? "dark" : "light"), Wr = /* @__PURE__ */ A(() => B(k)?.theme.tokens.color ?? {}), Kr = /* @__PURE__ */ A(() => ({
		...B(k)?.theme.tokens.color ?? {},
		...B(k)?.theme.alt?.tokens?.color ?? {}
	}));
	function qr(e) {
		return {
			type: e,
			version: Wl[e].version,
			props: Wl[e].defaults()
		};
	}
	let Jr = (e) => !!(e && Wl[e.type]?.entrance), Xr = [["", Z("common.none")], ...Object.entries(Wl).filter(([, e]) => e.entrance).map(([e, t]) => [e, t.labelKey ? Z(t.labelKey) : t.label])], Zr = Xr.filter(([e]) => !Wl[e]?.group), Qr = [["", Z("common.none")], ...Object.entries(Wl).filter(([, e]) => !e.entrance).map(([e, t]) => [e, t.labelKey ? Z(t.labelKey) : t.label])];
	function $r(e) {
		e.animation && !Jr(e.animation) && (e.hover ??= e.animation, e.animation = null);
	}
	function ei(e) {
		Kt(`edit:anim-${B(j).blockId}`, (t) => {
			$r(t), t.animation = e ? qr(e) : null;
		}), B(j) && Ue?.sendDemoAnim(B(j).sectionId, B(j).blockId);
	}
	function ti(e) {
		Kt(`edit:hover-${B(j).blockId}`, (t) => {
			$r(t), t.hover = e ? qr(e) : null;
		});
	}
	function ni(e, t) {
		Number.isFinite(t) && (Kt(`edit:anim-${B(j).blockId}:${e}`, (n) => {
			n.animation && (n.animation.props[e] = t);
		}), B(j) && Ue?.sendDemoAnim(B(j).sectionId, B(j).blockId));
	}
	function ri(e) {
		Xn("section-anim", (t) => {
			$r(t), t.animation = e ? qr(e) : null;
		}), Ue?.sendDemoAnim(B(In));
	}
	function ii(e) {
		Xn("section-hover", (t) => {
			$r(t), t.hover = e ? qr(e) : null;
		});
	}
	function ai(e, t) {
		Number.isFinite(t) && (Xn("edit:section-anim", (n) => {
			n.animation && (n.animation.props[e] = t);
		}), Ue?.sendDemoAnim(B(In)));
	}
	function oi(e, t) {
		Xn("edit:section-anim", (n) => {
			n.animation && (n.animation.props[e] = t);
		}), Ue?.sendDemoAnim(B(In));
	}
	function si(e) {
		let t = O.data.sections.find((e) => e.id === B(In));
		if (!t) return;
		let n = e.trim();
		if (!n) return;
		let r = /^\d+$/.test(n) ? `${n}px` : n;
		nt("section-size"), t.size = {
			...t.size,
			minHeight: r
		}, P(Rn, r, !0), O.save(), Ze(), Ue?.sendSection(B(w), t);
	}
	function ci() {
		return O.data.sections.find((e) => e.id === B(In)) ?? O.data.sections[0];
	}
	function ui(e) {
		let t = O.data.sections.find((e) => e.id === B(In));
		t && (nt("grid:section"), t.grid = e ? { ...He.data.grid } : null, P(Ln, t.grid ? { ...t.grid } : null, !0), O.save(), Ze(), Ue?.sendSection(B(w), t), B(ia) && Ue?.sendShowGrid(!0));
	}
	function di(e, t) {
		let n = O.data.sections.find((e) => e.id === B(In));
		n?.grid && (nt("grid:section"), n.grid = {
			...n.grid,
			[e]: t
		}, P(Ln, { ...n.grid }, !0), O.save(), Ze(), Ue?.sendSection(B(w), n), B(ia) && Ue?.sendShowGrid(!0));
	}
	function fi(e, t) {
		nt("grid:site"), P(se, {
			...B(se),
			[e]: t
		}, !0), He.data.grid = {
			...He.data.grid,
			[e]: t
		}, He.save(), Ze(), Ke(), B(ia) && Ue?.sendShowGrid(!0);
	}
	async function pi() {
		try {
			let e = await fetch("/api/github/me");
			e.ok ? P(oe, await e.json(), !0) : e.status !== 503 && P(oe, null);
		} catch {
			P(oe, null);
		}
	}
	let mi = null;
	async function hi() {
		try {
			let e = await fetch("/api/github/latest");
			e.ok && (mi = (await e.json()).head ?? null);
		} catch {}
	}
	async function gi(e) {
		if (!mi) return await hi(), {
			ok: await ht({
				title: Z("confirm.conflictUnknown.title"),
				lines: [Z("confirm.conflictUnknown.body"), Z("confirm.conflictUnknown.warning")],
				okLabel: Z("confirm.publishAnyway"),
				cancelLabel: Z("confirm.cancel")
			}),
			head: mi
		};
		let t = null;
		try {
			let e = await fetch(`/api/github/latest?base=${mi}`);
			e.ok && (t = await e.json().catch(() => null));
		} catch {}
		if (!t?.head) return {
			ok: !0,
			head: null
		};
		let n = t.head;
		if (n === mi) return {
			ok: !0,
			head: n
		};
		let r = new Set(e.map((e) => e.path)), i = t.truncated ? [Z("confirm.conflict.truncated")] : (t.changedFiles ?? []).filter((e) => r.has(e));
		return i.length === 0 ? {
			ok: !0,
			head: n
		} : {
			ok: await ht({
				title: Z("confirm.conflict.title"),
				lines: [
					Z("confirm.conflict.intro"),
					...i.map((e) => `• ${e}`),
					Z("confirm.conflict.warning")
				],
				okLabel: Z("confirm.publishAnyway"),
				cancelLabel: Z("confirm.cancel")
			}),
			head: n
		};
	}
	let vi = /* @__PURE__ */ N(null), yi = /* @__PURE__ */ N(""), bi = /* @__PURE__ */ N(!1);
	async function xi() {
		P(yi, "");
		try {
			let e = await fetch("/api/github/history");
			e.ok ? P(vi, (await e.json()).commits, !0) : e.status === 401 ? (P(vi, [], !0), P(yi, Z("status.historyLoginRequired"), !0)) : (P(vi, [], !0), P(yi, Ui(await e.json().catch(() => null)) ?? Z("status.historyFetchFailed"), !0));
		} catch {
			P(vi, [], !0), P(yi, Z("status.historyUnavailable"), !0);
		}
	}
	let Ci = (() => {
		let e = {
			dateStyle: "short",
			timeStyle: "short"
		};
		try {
			return new Intl.DateTimeFormat(Wi(), e);
		} catch {
			return new Intl.DateTimeFormat(void 0, e);
		}
	})(), wi = !1;
	async function Ti() {
		let e = B(vi)?.[0];
		if (!(!e || B(bi)) && await ht({
			title: Z("confirm.revert.title"),
			lines: [`«${e.message}»`, Z("confirm.revert.body")],
			okLabel: Z("confirm.revert.ok"),
			cancelLabel: Z("confirm.cancel")
		})) {
			P(bi, !0), E(Z("status.reverting"));
			try {
				let t = await fetch("/api/github/revert", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ expect: e.sha })
				});
				if (t.ok) {
					let { sha: e } = await t.json().catch(() => ({}));
					e ? mi = e : hi(), wi = !0, E(Z("status.revertDone"), "ok"), Di();
				} else t.status === 409 ? E(Z("status.revertConflict"), "error") : E(Ui(await t.json().catch(() => null)) ?? Z("status.revertFailed"), "error");
			} catch {
				E(Z("status.publishLayerUnreachable"), "error");
			}
			P(bi, !1), xi();
		}
	}
	async function Di() {
		let e = ["/content/site.json", ...B(k).pages.map((e) => `/${e.file}`)], t = async () => {
			let t = {};
			for (let n of e) try {
				t[n] = await (await fetch(n, { cache: "no-store" })).text();
			} catch {
				t[n] = null;
			}
			return t;
		}, n = await t();
		for (let r = 0; r < 18; r++) {
			await new Promise((e) => setTimeout(e, 1e4));
			let r = await t();
			if (e.some((e) => r[e] !== null && n[e] !== null && r[e] !== n[e])) {
				E(Z("status.revertDeployed"), "ok");
				for (let e of Object.keys(localStorage).filter((e) => e.startsWith("urd-draft-"))) localStorage.removeItem(e);
				await new Promise((e) => setTimeout(e, 800)), location.reload();
				return;
			}
		}
		E(Z("status.revertDeployTimeout"), "error");
	}
	let Oi = 0;
	async function ki(e) {
		let t = ++Oi, n = ne, r = await so(oo(e));
		t === Oi && n === ne && (r ? E(Z("status.publishLive"), "ok") : E(Z("status.publishDeployTimeout"), "error"));
	}
	let ji = /* @__PURE__ */ N(null), Mi = /* @__PURE__ */ N(null), Ni = /* @__PURE__ */ N(!1), Pi = /* @__PURE__ */ N(en(/* @__PURE__ */ new Set()));
	async function Fi() {
		P(Ni, !0), P(Mi, null), P(ji, null);
		try {
			let e = await fetch("/api/github/update"), t = await e.json().catch(() => null);
			e.ok ? (P(ji, t, !0), P(Pi, /* @__PURE__ */ new Set(), !0)) : P(Mi, Ui(t) ?? Z("update.checkFailed"), !0);
		} catch {
			P(Mi, Z("status.publishLayerUnreachable"), !0);
		}
		P(Ni, !1);
	}
	function Ii(e) {
		let t = new Set(B(Pi));
		t.has(e) ? t.delete(e) : t.add(e), P(Pi, t, !0);
	}
	async function Li() {
		if (!B(ji) || B(ji).upToDate || B(Ni)) return;
		let e = [...B(Pi)], t = B(ji).changes.filter((e) => !B(Pi).has(e.path)), n = t.filter((e) => e.atom && e.conflict);
		if (await ht({
			title: Z("confirm.update.title"),
			lines: [Z("confirm.update.body", {
				target: B(ji).target,
				writes: t.filter((e) => e.action === "write").length,
				deletes: t.filter((e) => e.action === "delete").length
			}), ...n.length > 0 ? [Z("confirm.update.warnEdited", { paths: n.map((e) => e.path).join(", ") })] : []],
			okLabel: Z("confirm.update.ok"),
			cancelLabel: Z("confirm.cancel")
		})) {
			P(Ni, !0), E(Z("update.running", { target: B(ji).target }));
			try {
				let t = await fetch("/api/github/update", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({
						to: B(ji).target,
						expect: B(ji).head,
						skip: e
					})
				}), n = await t.json().catch(() => null);
				t.ok ? (E(Z("update.committed", { target: B(ji).target }), "ok"), await Ri(B(ji).target.replace(/^v/, ""))) : t.status === 409 ? (E(Ui(n) ?? Z("update.checkFailed"), "error"), await Fi()) : E(Ui(n) ?? Z("update.failed"), "error");
			} catch {
				E(Z("status.publishLayerUnreachable"), "error");
			}
			P(Ni, !1);
		}
	}
	async function Ri(e) {
		for (let t = 0; t < 18; t++) {
			await new Promise((e) => setTimeout(e, 1e4));
			try {
				if ((await (await fetch("/urd.json", { cache: "no-store" })).json())?.engine === e) {
					E(Z("update.deployed"), "ok"), await new Promise((e) => setTimeout(e, 800)), location.reload();
					return;
				}
			} catch {}
		}
		E(Z("update.deployTimeout"), "error");
	}
	let zi = null;
	function Bi(e) {
		return {
			schemaVersion: 4,
			meta: {
				id: e.id,
				title: e.title
			},
			sections: [{
				id: gs("sec"),
				version: 1,
				preset: "blank",
				size: { minHeight: "40vh" },
				grid: null,
				background: {
					version: 1,
					layers: [{
						type: "color",
						version: 1,
						props: { value: "bg" }
					}]
				},
				blocks: []
			}]
		};
	}
	async function Vi(e, { keepHistory: t = !1 } = {}) {
		P(w, e, !0), zi = (async () => {
			let n = Xe(), r = null;
			try {
				let e = await fetch(`/${n.file}`);
				e.ok && (r = us(await e.json(), He.data));
			} catch {}
			r ? qe.delete(e) : r = Bi(n), O = Zi(`urd-draft-${e}`, () => r, re), (O.data.schemaVersion ?? 1) > 4 && (console.warn(`Urd: the draft for '${e}' has schemaVersion ${O.data.schemaVersion} (the engine has 4) and is discarded`), O.replace(structuredClone(r))), O.replace(us(O.data, He.data)), O.save(), t || (et = null), P(In, null), P(Ln, null), Ze(), Sa(), Le(), P(ee, "");
		})(), await zi;
	}
	function Hi() {
		Ue?.destroy(), B(ae)?.contentDocument?.addEventListener("pointerdown", () => {
			B(Vt) && P(Vt, null);
		}, !0), Ue = ro(B(ae), {
			onEdit: rh,
			onMove: ih,
			onGrow: ah,
			onDelete: hh,
			onAddSection: uh,
			onMoveSection: dh,
			onDeleteSection: fh,
			onSectionSize: ph,
			onUndo: (e) => e.redo ? ct() : st(),
			onSelectSection: Yn,
			onSelectBlock: Bt,
			onBlockMenu: Gt,
			onReady: Gi,
			onNavigate: oa,
			onAddBlock: (e) => yh(e.sectionId, e.block),
			onAddBlocks: (e) => bh(e.sectionId, e.blocks, e.minBottom, e.moves),
			onRequestBlock: Oh,
			onMoveBlockSection: mh,
			onMobileReset: oh,
			onMobileOrder: sh,
			onReviewDone: ch,
			onBlockFlag: lh,
			onCollectionEdit: ec,
			onCollectionAdd: Zs,
			onSaveTemplate: Rs,
			onStickyGroup: Bs,
			onStickyDock: zs,
			onDeleteTemplate: Hs,
			onApplyLayout: ze,
			onPluginBlocks: (e) => {
				P(Sh, e.blocks ?? [], !0);
			},
			onNavWidth: (e) => sa("edit:nav-width", () => {
				B(k).nav.style ??= {}, B(k).nav.style.width = e.width;
			})
		});
	}
	async function Gi() {
		await zi, await Cc, Ue?.sendPlugins(We(B(wc))?.enabled ?? []), Ue?.sendViewport(B(be)), Ue?.sendZoom(B(Ae)), Js(), Ls(), He.hasDraft() && Ke();
		let e = !B(C).pages.some((e) => e.id === B(w));
		(O.hasDraft() || e) && Ue?.sendPage(B(w), O.data), B(ce) || Ue?.sendChrome(!1), B(ia) && Ue?.sendShowGrid(!0), B(Ki) && Ue?.sendShowGuides(!0), x();
	}
	let Ki = /* @__PURE__ */ N(localStorage.getItem("urd-guides") === "1"), qi = /* @__PURE__ */ N(!1), Ji = /* @__PURE__ */ N(en(localStorage.getItem("urd-layout-picker") === "menu" ? "menu" : "strip"));
	function Yi(e) {
		P(Ji, e === "menu" ? "menu" : "strip", !0), B(Ji) === "menu" ? localStorage.setItem("urd-layout-picker", "menu") : localStorage.removeItem("urd-layout-picker");
	}
	let Qi = /* @__PURE__ */ N(null);
	xn(() => {
		if (!B(qi)) return;
		let e = (e) => {
			B(Qi)?.contains(e.target) || P(qi, !1);
		}, t = (e) => {
			e.key === "Escape" && P(qi, !1);
		}, n = () => {
			P(qi, !1);
		};
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t), window.addEventListener("blur", n), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t), window.removeEventListener("blur", n);
		};
	});
	let $i = {
		view: 1079,
		device: 999,
		zoom: 919
	}, ea = /* @__PURE__ */ N(null), ta = /* @__PURE__ */ N(null), na = en({
		view: !1,
		device: !1,
		zoom: !1
	});
	xn(() => {
		let e = Object.entries($i).map(([e, t]) => {
			let n = window.matchMedia(`(max-width: ${t}px)`), r = () => {
				na[e] = n.matches;
			};
			return r(), n.addEventListener("change", r), () => n.removeEventListener("change", r);
		});
		return () => e.forEach((e) => e());
	}), xn(() => {
		B(ea) && !na[B(ea)] && P(ea, null);
	}), xn(() => {
		if (!B(ea)) return;
		let e = (e) => {
			B(ta)?.contains(e.target) || P(ea, null);
		}, t = (e) => {
			e.key === "Escape" && P(ea, null);
		}, n = () => {
			P(ea, null);
		};
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t), window.addEventListener("blur", n), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t), window.removeEventListener("blur", n);
		};
	});
	function ra() {
		P(Ki, !B(Ki)), localStorage.setItem("urd-guides", B(Ki) ? "1" : "0"), Ue?.sendShowGuides(B(Ki));
	}
	let ia = /* @__PURE__ */ N(localStorage.getItem("urd-grid-overlay") === "1");
	function aa() {
		P(ia, !B(ia)), localStorage.setItem("urd-grid-overlay", B(ia) ? "1" : "0"), Ue?.sendShowGrid(B(ia));
	}
	function oa(e) {
		let t = e.path.replace(/\/$/, "") || "/", n = B(k).pages.find((e) => e.path === t);
		n && n.id !== B(w) && Vi(n.id);
	}
	function sa(e, t) {
		nt(e), t(), He.save(), Ze(), Ke();
	}
	let ca = /* @__PURE__ */ N(""), la = /* @__PURE__ */ N(null), ua = Object.fromEntries(Dc.map((e) => [e.id, Tc(Oc(e.id, {
		pageId: "preview",
		title: ""
	}))])), da = /* @__PURE__ */ A(() => {
		let e = B(k)?.theme?.tokens?.color ?? {};
		return [
			"bg",
			"surface",
			"text",
			"accent"
		].filter((t) => typeof e[t] == "string" && Fc(e[t])).map((t) => `--urd-color-${t}: ${e[t]};`).join(" ");
	}), fa = /* @__PURE__ */ N(null);
	xn(() => {
		if (!B(fa)) return;
		let e = (e) => {
			e.target.closest?.(".page-menu-wrap") || P(fa, null);
		}, t = (e) => {
			e.key === "Escape" && P(fa, null);
		}, n = () => {
			P(fa, null);
		};
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t), window.addEventListener("blur", n), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t), window.removeEventListener("blur", n);
		};
	});
	let pa = [
		"admin",
		"api",
		"assets",
		"content",
		"media",
		"plugins",
		"functions",
		"readme"
	];
	function ma(e, t = null) {
		return e ? pa.includes(e) ? Z("error.reservedName", { slug: e }) : B(k).pages.some((n) => n.id !== t && (n.path === `/${e}` || n.id === e)) ? Z("error.pageExists") : null : Z("error.pageNeedsName");
	}
	function ga() {
		let e = B(ca).trim(), t = Da(e), n = ma(t);
		if (n) {
			E(n, "error");
			return;
		}
		let r = B(la) && !B(la).startsWith("preset:") ? Ms[B(la)]?.data?.page : null, i = B(la)?.startsWith("preset:") ? Oc(B(la).slice(7), {
			pageId: t,
			title: e
		}) ?? Bi({
			id: t,
			title: e
		}) : r ? Ks(us(JSON.parse(JSON.stringify(r)), He.data), gs, {
			id: t,
			title: e
		}) : Bi({
			id: t,
			title: e
		});
		sa("pages", () => {
			B(k).pages.push({
				id: t,
				title: e,
				path: `/${t}`,
				file: `content/pages/${t}.json`
			}), B(k).nav.items.push({
				label: e,
				page: t
			});
		}), ie(`urd-draft-${t}`, JSON.stringify(i)), Ze(), P(ca, ""), P(la, null), Vi(t);
	}
	async function _a(e) {
		P(fa, null), await Vs("page", e.id === B(w) ? JSON.parse(JSON.stringify(O.data)) : await Pa(e));
	}
	function va(e, t) {
		let n = t.trim();
		if (!n || n === e.title) return;
		let r = e.title;
		sa("pages", () => {
			e.title = n;
			for (let t of B(k).nav.items) t.page === e.id && t.label === r && (t.label = n);
		}), e.id === B(w) ? (O.data.meta.title = n, O.save(), Ze(), Ue?.sendPage(B(w), O.data)) : Fa(e, (e) => {
			e.meta.title = n;
		});
	}
	let xa = /* @__PURE__ */ N(en({
		description: "",
		ogTitle: "",
		ogDescription: "",
		ogImage: ""
	}));
	function Sa() {
		let e = O?.data?.meta ?? {};
		P(xa, {
			description: e.description ?? "",
			ogTitle: e.og?.title ?? "",
			ogDescription: e.og?.description ?? "",
			ogImage: e.og?.image ?? ""
		}, !0);
	}
	function ka(e, t) {
		let n = String(t ?? "").trim();
		if (e === "description") n ? O.data.meta.description = n : delete O.data.meta.description;
		else {
			let t = {
				ogTitle: "title",
				ogDescription: "description",
				ogImage: "image"
			}[e], r = { ...O.data.meta.og ?? {} };
			n ? r[t] = n : delete r[t], Object.keys(r).length ? O.data.meta.og = r : delete O.data.meta.og;
		}
		O.save(), Ze(), Sa();
		let r = B(k).pages.find((e) => e.id === B(w));
		B(ja)[B(w)] = !r?.noindex && !O.data.meta.description;
	}
	function Aa(e) {
		let t = B(k).pages.find((e) => e.id === B(w));
		t && (sa("edit:page-noindex", () => {
			e ? t.noindex = !0 : delete t.noindex;
		}), B(ja)[B(w)] = !e && !O?.data?.meta?.description);
	}
	let ja = /* @__PURE__ */ N(en({}));
	async function Ma() {
		let e = {};
		for (let t of B(k).pages) {
			if (t.noindex) continue;
			if (t.id === B(w)) {
				e[t.id] = !O?.data?.meta?.description;
				continue;
			}
			let n = await Pa(t);
			e[t.id] = !n?.meta?.description;
		}
		P(ja, e, !0);
	}
	xn(() => {
		B(Tt) === "pages" && B(w) && Ma();
	});
	async function Na(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", t) try {
			ka("ogImage", (await Cr(t)).dataUrl);
		} catch {
			E(Z("status.imageReadError"), "error");
		}
	}
	async function Pa(e) {
		let t = localStorage.getItem(`urd-draft-${e.id}`);
		if (t) try {
			return JSON.parse(t);
		} catch {}
		try {
			let t = await fetch(`/${e.file}`);
			if (t.ok) return us(await t.json(), He.data);
		} catch {}
		return Bi(e);
	}
	async function Fa(e, t) {
		let n = await Pa(e);
		t(n), ie(`urd-draft-${e.id}`, JSON.stringify(n)), Ze();
	}
	function Ia(e, t) {
		let n = Da(t);
		if (e.path === "/" || `/${n}` === e.path) return;
		let r = ma(n, e.id);
		if (r) {
			E(r, "error");
			return;
		}
		sa("pages", () => {
			e.path = `/${n}`;
		});
	}
	function La(e) {
		e.path !== "/" && (sa("pages", () => {
			B(k).pages = B(k).pages.filter((t) => t.id !== e.id), B(k).nav.items = B(k).nav.items.filter((t) => t.page !== e.id || t.children);
			for (let t of B(k).nav.items) t.page === e.id && delete t.page, t.children && (t.children = t.children.filter((t) => t.page !== e.id), t.children.length === 0 && delete t.children);
			B(k).nav.items = B(k).nav.items.filter((e) => e.page || e.href || e.children);
		}), e.id === B(w) && Vi(B(k).pages[0].id), E(Z("status.pageRemoved")));
	}
	function Ra(e) {
		sa("edit:nav-logo", () => {
			B(k).nav.logo = {
				type: "text",
				value: "",
				...B(k).nav.logo,
				...e
			};
		});
	}
	function za(e) {
		sa("nav", () => {
			B(k).nav.logo ??= {
				type: "text",
				value: B(k).site.title
			};
			let t = B(k).nav.logo, n = t.type === "image";
			e === "both" ? (n && (t.image = t.value, t.value = B(k).site.title), t.image ??= "", t.size ??= 32) : e === "image" ? (n || (t.value = t.image ?? ""), delete t.image, t.size ??= 32) : (n && (t.value = B(k).site.title), delete t.image), t.type = e;
		});
	}
	async function Ba(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", t) try {
			let e = await Cr(t);
			sa("nav", () => {
				let t = B(k).nav.logo;
				t.type === "both" ? t.image = e.dataUrl : t.value = e.dataUrl;
			});
		} catch {
			E(Z("status.imageReadErrorSvg"), "error");
		}
	}
	let Wa = /* @__PURE__ */ N(null);
	async function Ga(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", !t) return;
		if (t.type === "image/svg+xml" || /\.svg$/i.test(t.name || "")) {
			try {
				let e = await xr(t);
				P(Wa, e.dataUrl, !0);
			} catch {
				E(Z("status.imageReadErrorSvg"), "error");
			}
			return;
		}
		let n = new FileReader();
		n.onload = () => {
			P(Wa, String(n.result), !0);
		}, n.onerror = () => E(Z("status.imageReadError"), "error"), n.readAsDataURL(t);
	}
	function Ka(e) {
		sa("edit:site-icon", () => {
			B(k).site.icon = e;
		}), P(Wa, null);
	}
	function qa() {
		sa("edit:site-icon", () => {
			delete B(k).site.icon;
		});
	}
	function Ja(e) {
		sa("edit:site-title", () => {
			B(k).site.title = e;
		});
	}
	function Ya(e) {
		sa("edit:site-desc", () => {
			B(k).site.description = e;
		});
	}
	function Xa(e) {
		let t = String(e ?? "").trim();
		sa("edit:site-analytics", () => {
			t ? B(k).analytics = { token: t } : delete B(k).analytics;
		});
	}
	let Za = /* @__PURE__ */ A(() => B(k)?.layout?.contentWidth ?? 1440), Qa = /* @__PURE__ */ A(() => B(k)?.layout?.gutter ?? 6), $a = /* @__PURE__ */ A(() => wo(B(Za))), eo = /* @__PURE__ */ A(() => _o.find((e) => e.gutter === B(Qa))?.id ?? null), to = /* @__PURE__ */ N(!1), io = /* @__PURE__ */ A(() => B(Za) === "full" ? go : bo(B(Za))), uo = /* @__PURE__ */ A(() => yo.map((e) => ({
		screen: e,
		...Co(B(Za), B(Qa), e)
	})));
	function fo(e, t) {
		sa(t, () => {
			let t = {
				...B(k).layout ?? {},
				contentWidth: B(Za),
				gutter: B(Qa),
				...e
			};
			for (let e of Object.keys(t)) t[e] === void 0 && delete t[e];
			B(k).layout = t;
		});
	}
	let Po = (e) => fo({ contentWidth: e === "full" ? "full" : bo(e) }, "edit:site-width"), Io = (e) => fo({ gutter: xo(e) }, "edit:site-gutter");
	function Lo() {
		let e = B(k).site.lang ?? "no";
		return e === "no" ? "nb" : e;
	}
	function Ho() {
		let e = Lo(), t = jt([...At, ...Pt()]);
		return [...t.some(([t]) => t === e) ? [] : [[e, e]], ...t];
	}
	function Uo(e) {
		sa("site", () => {
			B(k).site.lang = e;
		});
	}
	let Wo = /^(?:data:image\/[\w.+-]+;base64,[A-Za-z0-9+/=]+|\/(?!\/)[\w%./-]*)$/;
	xn(() => {
		if (!B(k)?.site) return;
		let e = B(k).site.icon, t = document.querySelector("link[rel=\"icon\"]");
		if (t) {
			if (typeof e != "string" || !e) {
				t.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230b0e14'/%3E%3Cpath d='M19.2 49.6V14.4l25.6 10.4V49.6' fill='none' stroke='%2315b39a' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";
				return;
			}
			Wo.test(e) && (t.href = e);
		}
	});
	function Go(e) {
		sa("nav", () => {
			B(k).nav.layout = e;
		});
	}
	function Ko(e, t) {
		sa(`edit:nav-tools-${e}`, () => {
			B(k).nav.style ??= {};
			let n = { ...B(k).nav.style.tools ?? {} };
			t === void 0 ? delete n[e] : n[e] = t, Object.keys(n).length ? B(k).nav.style.tools = n : delete B(k).nav.style.tools;
		});
	}
	function qo(e, t) {
		sa(`edit:nav-style-${e}`, () => {
			B(k).nav.style ??= {}, t === void 0 ? delete B(k).nav.style[e] : B(k).nav.style[e] = t;
		});
	}
	let Jo = /* @__PURE__ */ A(() => B(k)?.nav?.variant === "side-left" || B(k)?.nav?.variant === "side-right"), Xo = /* @__PURE__ */ A(() => [
		"floating",
		"floating-square",
		"floating-tab"
	].includes(B(k)?.nav?.variant)), $o = /* @__PURE__ */ A(() => Vo(B(k)?.nav?.style)), es = /* @__PURE__ */ A(() => zo(B(k)?.nav?.style, B(k)?.nav?.variant)), ts = /* @__PURE__ */ A(() => Bo(B(k)?.nav?.style));
	function ns(e) {
		sa("nav", () => {
			B(k).nav.style ??= {}, e === "md" ? delete B(k).nav.style.size : B(k).nav.style.size = e, delete B(k).nav.style.padY, delete B(k).nav.style.textSize;
		});
	}
	function rs(e, t, n) {
		let r = e.target.value;
		qo(t, r === "" ? void 0 : Ro(r, n, void 0)), e.target.value = B(k).nav.style?.[t] ?? "";
	}
	function is(e, t) {
		sa(`edit:nav-mobile-${e}`, () => {
			B(k).nav.style ??= {};
			let n = { ...B(k).nav.style.mobile ?? {} };
			t === void 0 ? delete n[e] : n[e] = t, Object.keys(n).length ? B(k).nav.style.mobile = n : delete B(k).nav.style.mobile;
		});
	}
	function as(e, t) {
		sa(`edit:nav-announce-${e}`, () => {
			let n = { ...B(k).nav.announcement ?? {} };
			t === void 0 ? delete n[e] : n[e] = t, Object.keys(n).length ? B(k).nav.announcement = n : delete B(k).nav.announcement;
		});
	}
	function os(e, t) {
		sa(`edit:nav-sheet-${e}`, () => {
			B(k).nav.style ??= {};
			let n = { ...B(k).nav.style.sheet ?? {} };
			t === void 0 ? delete n[e] : n[e] = t, Object.keys(n).length ? B(k).nav.style.sheet = n : delete B(k).nav.style.sheet;
		});
	}
	function ss(e, t, n) {
		let r = e.target.value;
		qo(t, r === "" ? void 0 : Ro(r, n, void 0)), e.target.value = B(t === "padY" ? es : ts);
	}
	function cs(e, t, n) {
		let r = e.target.value;
		is(t, r === "" ? void 0 : Ro(r, n, void 0)), e.target.value = B(k).nav.style?.mobile?.[t] ?? "";
	}
	function ds(e) {
		let t = Ro(e / 100, Ao, .5);
		qo("shrinkTo", t === .5 ? void 0 : t);
	}
	let fs = {
		underline: [Z("hoverColor.underline.label"), Z("hoverColor.underline.title")],
		pill: [Z("hoverColor.pill.label"), Z("hoverColor.pill.title")],
		lift: [Z("hoverColor.lift.label"), Z("hoverColor.lift.title")]
	}, ms = /* @__PURE__ */ A(() => fs[B(k)?.nav?.style?.hover] ?? null), _s = /* @__PURE__ */ A(() => B(Jo) ? [
		["card", Z("common.standard")],
		["pills", Z("opt.sub.pills")],
		["lines", Z("opt.sub.lines")]
	] : [
		["card", Z("opt.sub.card")],
		["flat", Z("opt.sub.flat")],
		["pills", Z("opt.sub.pills")],
		["lines", Z("opt.sub.lines")],
		["flyout", Z("opt.sub.flyout")]
	]);
	function $(e) {
		sa("nav", () => {
			e === "bar" ? delete B(k).nav.variant : B(k).nav.variant = e, B(k).nav.style && delete B(k).nav.style.radius;
		});
	}
	function vs(e) {
		sa("nav", () => {
			B(k).nav.style ??= {}, e ? B(k).nav.style.glow = !0 : delete B(k).nav.style.glow;
		});
	}
	function ys(e) {
		sa("nav", () => {
			B(k).nav.style ??= {}, e ? delete B(k).nav.style.topGap : B(k).nav.style.topGap = !1;
		});
	}
	function bs(e) {
		sa("nav", () => {
			B(k).nav.style ??= {}, e === "standard" ? delete B(k).nav.style.hover : B(k).nav.style.hover = e;
		});
	}
	let xs = null, Ss = {}, Cs = {}, ws = !1, Ts = /* @__PURE__ */ N(en([])), Es = /* @__PURE__ */ N(en({})), Ds = /* @__PURE__ */ N(null), Os = /* @__PURE__ */ N(""), ks = /* @__PURE__ */ N("news"), As = [
		["news", Z("collectionKind.news")],
		["notices", Z("collectionKind.notices")],
		["publications", Z("collectionKind.publications")],
		["products", Z("collectionKind.products")],
		["custom", Z("collectionKind.custom")]
	], js = null, Ms = {}, Ns = {}, Ps = !1, Fs = /* @__PURE__ */ N(en([]));
	async function Is() {
		let e = {
			version: 1,
			maler: []
		};
		try {
			e = await (await fetch("/content/maler.json")).json();
		} catch {}
		js = Zi("urd-draft-templates", () => e, re, "urd-draft-maler"), P(Fs, [...js.data.maler ?? []], !0);
		for (let e of B(Fs)) {
			let t = null;
			try {
				t = await (await fetch(`/content/maler/${e}.json`)).json();
			} catch {}
			Ns[e] = t, Ms[e] = Zi(`urd-draft-template-${e}`, () => t, re, `urd-draft-mal-${e}`), (Ms[e].data?.schemaVersion ?? 1) > 1 && Ms[e].reset();
		}
		Ps = !0, Ls();
	}
	function Ls() {
		let e = B(Fs).map((e) => Ms[e]?.data ? {
			id: e,
			...JSON.parse(JSON.stringify(Ms[e].data))
		} : null).filter(Boolean).map(({ id: e, mal: t, section: n, blocks: r, page: i }) => ({
			id: e,
			name: t.name,
			kind: t.kind,
			section: n,
			blocks: r,
			page: i
		}));
		Ue?.sendTemplates(e);
	}
	function Rs(e) {
		let t = Ws.includes(e.kind) ? e.kind : "section";
		return Vs(t, e[t]);
	}
	function zs(e) {
		let { section: t, block: n } = Rt(e.sectionId, e.blockId);
		!t || !n?.sticky || Ut.some(([t]) => t === e.dock) && (nt(`sticky-dock:${e.blockId}`), n.sticky = {
			...n.sticky,
			dock: e.dock
		}, O.save(), Ze(), Ue?.sendSection(B(w), t), zt());
	}
	function Bs(e) {
		let t = e.blockIds ?? [], { section: n } = Rt(e.sectionId, t[0]);
		if (!n || !t.length) return;
		nt(`sticky-group:${e.sectionId}`);
		let r = e.on ? gs("stk") : null;
		for (let e of n.blocks) t.includes(e.id) && (e.sticky = r ? {
			offset: 16,
			until: null,
			...e.sticky,
			group: r
		} : null);
		Ve(n, "block-edited"), O.save(), Ze(), Ue?.sendSection(B(w), n), zt(), E(Z(e.on ? "status.stickyGrouped" : "status.stickyUngrouped"));
	}
	async function Vs(e, t) {
		if (!t || !js) return;
		let n = (await gt({
			title: Z("canvas.templateNamePrompt"),
			placeholder: Z("ph.templateName")
		}))?.trim();
		if (!n) return;
		let r = Gs(n);
		if (!r) {
			E(Z("status.invalidName"), "error");
			return;
		}
		if (B(Fs).includes(r)) {
			E(Z("status.templateExists"), "error");
			return;
		}
		nt("templates");
		let i = {
			schemaVersion: 1,
			mal: {
				name: n,
				kind: e
			},
			[e]: t
		};
		Ms[r] = Zi(`urd-draft-template-${r}`, () => null, re, `urd-draft-mal-${r}`), Ms[r].replace(i), Ms[r].save(), js.data.maler = [...B(Fs), r], js.save(), P(Fs, [...B(Fs), r], !0), E(Z("status.templateSaved", { name: n }), "ok"), Ze(), Ls();
	}
	async function Hs(e) {
		let t = Ms[e.id]?.data?.mal;
		t && await ht({ title: Z("confirm.deleteTemplate", { name: t.name }) }) && (nt("templates"), B(la) === e.id && P(la, null), localStorage.removeItem(`urd-draft-template-${e.id}`), localStorage.removeItem(`urd-draft-mal-${e.id}`), delete Ms[e.id], js.data.maler = B(Fs).filter((t) => t !== e.id), js.save(), P(Fs, B(Fs).filter((t) => t !== e.id), !0), Ze(), Ls());
	}
	async function Us() {
		let e = {
			version: 1,
			samlinger: []
		};
		try {
			e = await (await fetch("/content/collections.json")).json();
		} catch {}
		xs = Zi("urd-draft-collections", () => e, re, "urd-draft-samlinger"), P(Ts, [...xs.data.samlinger ?? []], !0);
		for (let e of B(Ts)) {
			let t = null;
			try {
				t = await (await fetch(`/content/samlinger/${e}.json`)).json();
			} catch {}
			Cs[e] = t, Ss[e] = Zi(`urd-draft-collection-${e}`, () => t, re, `urd-draft-samling-${e}`), !t && !Ss[e].data && (Ss[e].replace({
				schemaVersion: 1,
				id: e,
				name: e,
				kind: "custom",
				entries: []
			}), Ss[e].save());
		}
		ws = !0, qs();
	}
	function qs(e = !0) {
		let t = {};
		for (let e of B(Ts)) Ss[e] && (t[e] = JSON.parse(JSON.stringify(Ss[e].data)));
		P(Es, t, !0), e && Js();
	}
	function Js() {
		Ue?.sendCollections(We(B(Es)) ?? {});
	}
	function Ys(e, t, n, r = !0) {
		let i = Ss[e];
		i && (nt(t), n(i.data), i.save(), Ze(), qs(r));
	}
	function Zs(e) {
		Ss[e.collection] && lc(e.collection);
	}
	function Qs(e) {
		return (new DOMParser().parseFromString(String(e ?? ""), "text/html").body.textContent ?? "").trim();
	}
	function ec(e) {
		let { collection: t, entryId: n, field: r, value: i } = e;
		[
			"title",
			"text",
			"image",
			"imageAlt",
			"imageStyle"
		].includes(r) && (r === "title" && !Qs(i) || Ys(t, `edit:collection:${t}:${n}:${r}`, (e) => {
			let t = e.entries.find((e) => e.id === n);
			t && (i === "" && r !== "title" ? delete t[r] : t[r] = i);
		}, r === "image"));
	}
	function ac(e, t, n) {
		let r = {
			schemaVersion: 1,
			id: e,
			name: t,
			kind: n,
			entries: []
		};
		Ss[e] = Zi(`urd-draft-collection-${e}`, () => null, re, `urd-draft-samling-${e}`), Ss[e].replace(r), Ss[e].save(), xs.data.samlinger = [...B(Ts), e], xs.save(), P(Ts, [...B(Ts), e], !0), P(Ds, e, !0), Ze(), qs();
	}
	function oc() {
		let e = B(Os).trim();
		if (!e) return;
		let t = Da(e);
		if (!t || B(Ts).includes(t)) {
			E(Z(t ? "status.collectionExists" : "status.invalidName"), "error");
			return;
		}
		nt("collections"), ac(t, e, B(ks)), P(Os, "");
	}
	function sc() {
		let e = Z("seed.productCatalogName"), t = Da(e) || "collection", n = t;
		for (let e = 2; B(Ts).includes(n); e += 1) n = `${t}-${e}`;
		nt("collections"), ac(n, e, "products"), Kt(null, (e) => {
			e.props.collection = n;
		});
	}
	function cc(e) {
		nt("collections"), localStorage.removeItem(`urd-draft-collection-${e}`), localStorage.removeItem(`urd-draft-samling-${e}`), delete Ss[e], xs.data.samlinger = B(Ts).filter((t) => t !== e), xs.save(), P(Ts, B(Ts).filter((t) => t !== e), !0), B(Ds) === e && P(Ds, null), Ze(), qs();
	}
	function lc(e) {
		Ys(e, `collection:${e}:add-entry`, (e) => {
			e.kind === "products" ? e.entries.push({
				id: gs("entry"),
				title: Z("seed.newProduct"),
				text: ""
			}) : e.entries.unshift({
				id: gs("entry"),
				title: Z("seed.newEntry"),
				date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
				text: ""
			});
		});
	}
	function uc(e, t, n, r) {
		Ys(e, `edit:collection:${e}:${t}:${n}`, (e) => {
			let i = e.entries.find((e) => e.id === t);
			i && (r === "" && n !== "title" ? delete i[n] : i[n] = r);
		});
	}
	function dc(e, t, n) {
		Ys(e, `collection:${e}:move-entry`, (e) => {
			let r = t + n;
			r < 0 || r >= e.entries.length || ([e.entries[t], e.entries[r]] = [e.entries[r], e.entries[t]]);
		});
	}
	function fc(e, t) {
		Ys(e, `collection:${e}:remove-entry`, (e) => {
			e.entries = e.entries.filter((e) => e.id !== t);
		});
	}
	async function pc(e, t, n) {
		let r = n.target.files?.[0];
		n.target.value = "", r && uc(e, t, "image", (await Cr(r)).dataUrl);
	}
	function mc(e, t, n) {
		let r = n.split(",").map((e) => e.trim()).filter(Boolean);
		uc(e, t, "sizes", r.length ? r : "");
	}
	function hc(e, t) {
		Ys(e, `collection:${e}:${t}:colors`, (e) => {
			let n = e.entries.find((e) => e.id === t);
			n && (n.colors = [...n.colors ?? [], { name: Z("ph.colorName") }]);
		});
	}
	function gc(e, t, n, r, i) {
		Ys(e, `edit:collection:${e}:${t}:color:${n}:${r}`, (e) => {
			let a = e.entries.find((e) => e.id === t)?.colors?.[n];
			a && (r === "image" && !i ? delete a.image : i && (a[r] = i));
		});
	}
	async function _c(e, t, n, r) {
		let i = r.target.files?.[0];
		r.target.value = "", i && gc(e, t, n, "image", (await Cr(i)).dataUrl);
	}
	function vc(e, t, n) {
		Ys(e, `collection:${e}:${t}:colors`, (e) => {
			let r = e.entries.find((e) => e.id === t);
			r?.colors && (r.colors = r.colors.filter((e, t) => t !== n), r.colors.length || delete r.colors);
		});
	}
	function yc(e) {
		let t = Ss[e]?.data;
		if (!t) return;
		let n = URL.createObjectURL(new Blob([Xs(t.entries)], { type: "text/csv" })), r = document.createElement("a");
		r.href = n, r.download = `${e}.csv`, r.click(), URL.revokeObjectURL(n);
	}
	async function bc(e, t) {
		let n = t.target.files?.[0];
		if (t.target.value = "", !n) return;
		let r = $s(await n.text());
		if (!r) {
			E(Z("status.csvInvalid"), "error");
			return;
		}
		let i = /* @__PURE__ */ new Set();
		for (let e of r.entries) (!/^[a-z0-9][a-z0-9-]*$/.test(e.id) || i.has(e.id)) && (e.id = gs("entry")), i.add(e.id);
		Ys(e, `collection:${e}:import`, (e) => {
			e.entries = r.entries;
		}), E(Z("status.csvImported", { count: String(r.entries.length) }), "ok");
	}
	let xc = null, Sc, Cc = new Promise((e) => {
		Sc = e;
	}), wc = /* @__PURE__ */ N(null), Ec = en({}), kc = /* @__PURE__ */ N("0.0.0"), Ac = /* @__PURE__ */ N(""), Pc = /* @__PURE__ */ N(""), Lc = /* @__PURE__ */ N(en([])), Rc = /* @__PURE__ */ N(en([])), Wc = /* @__PURE__ */ N("pending"), Gc = () => [.../* @__PURE__ */ new Set([...B(wc)?.enabled ?? [], ...B(wc)?.disabled ?? []])];
	function Kc() {
		P(wc, JSON.parse(JSON.stringify(xc.data)), !0);
	}
	let qc = /* @__PURE__ */ N(null);
	async function Jc() {
		try {
			let e = (await fetch("/urd.json", { cache: "no-store" })).headers.get("content-security-policy");
			if (!e) {
				P(qc, { unknown: !0 }, !0);
				return;
			}
			let t = (t) => new Set((e.split(";").map((e) => e.trim()).find((e) => e.startsWith(`${t} `)) ?? "").split(/\s+/).slice(1));
			P(qc, {
				frameSrc: t("frame-src"),
				connectSrc: t("connect-src"),
				scriptSrc: t("script-src")
			}, !0);
		} catch {
			P(qc, { unknown: !0 }, !0);
		}
	}
	function Yc(e) {
		let t = [
			...(e.scriptSrc ?? []).map((e) => ["script-src", e]),
			...(e.connectSrc ?? []).map((e) => ["connect-src", e]),
			...(e.frameSrc ?? []).map((e) => ["frame-src", e])
		];
		if (!B(qc) || B(qc).unknown) return [];
		let n = {
			"script-src": B(qc).scriptSrc,
			"connect-src": B(qc).connectSrc,
			"frame-src": B(qc).frameSrc
		};
		return t.filter(([e, t]) => !n[e]?.has(t)).map(([e, t]) => `${e} ${t}`);
	}
	async function Xc() {
		Jc();
		let e = {
			version: 1,
			enabled: []
		};
		try {
			e = await (await fetch("/plugins/plugins.json")).json();
		} catch {}
		P(Rc, e.enabled ?? [], !0), xc = Zi("urd-draft-plugins", () => e, re), Kc();
		try {
			P(kc, (await (await fetch("/urd.json")).json()).engine ?? "0.0.0", !0);
		} catch {}
		for (let e of Gc()) $c(e);
		Zc(), Sc(), Ue?.sendPlugins(We(B(wc))?.enabled ?? []);
	}
	async function Zc() {
		try {
			let e = await fetch("/api/github/plugins");
			if (!e.ok) {
				Qc();
				return;
			}
			let { plugins: t } = await e.json();
			localStorage.setItem("urd-plugins-found", JSON.stringify(t ?? [])), P(Lc, (t ?? []).filter((e) => !Gc().includes(e)), !0);
			for (let e of B(Lc)) $c(e);
			P(Wc, "ok");
		} catch {
			Qc();
		}
	}
	function Qc() {
		try {
			let e = JSON.parse(localStorage.getItem("urd-plugins-found") ?? "[]");
			if (Array.isArray(e) && e.length) {
				P(Lc, e.filter((e) => !Gc().includes(e)), !0);
				for (let e of B(Lc)) $c(e);
				P(Wc, "ok");
				return;
			}
		} catch {}
		P(Wc, "unavailable");
	}
	async function $c(e) {
		try {
			let t = await (await fetch(`/plugins/${e}/plugin.json`)).json(), n = hs(t);
			Ec[e] = {
				...t,
				errors: n,
				satisfied: n.length === 0 && ps(B(kc), t.requiresEngine)
			};
		} catch {
			Ec[e] = {
				name: e,
				errors: [Z("plugin.manifestNotFound", { id: e })],
				satisfied: !1
			};
		}
	}
	function el(e, t) {
		nt("plugins");
		let n = xc.data;
		n.enabled = (n.enabled ?? []).filter((t) => t !== e), n.disabled = (n.disabled ?? []).filter((t) => t !== e), t ? n.enabled.push(e) : n.disabled.push(e), xc.save(), Ze(), Kc(), rl();
	}
	function rl() {
		B(ae) && (B(ae).src = B(ae).src);
	}
	function al(e) {
		nt("plugins");
		let t = xc.data;
		t.enabled = (t.enabled ?? []).filter((t) => t !== e), t.disabled = (t.disabled ?? []).filter((t) => t !== e), xc.save(), Ze(), Kc(), rl();
	}
	async function ol() {
		P(Pc, "");
		let e = B(Ac).trim().toLowerCase();
		if (!/^[a-z0-9][a-z0-9-]*$/.test(e)) {
			P(Pc, Z("plugin.invalidId"), !0);
			return;
		}
		if (Gc().includes(e)) {
			P(Pc, Z("plugin.alreadyListed"), !0);
			return;
		}
		if (await $c(e), Ec[e].errors.length) {
			P(Pc, Z("plugin.invalidManifest", { errors: Ec[e].errors.join("; ") }), !0);
			return;
		}
		el(e, !0), P(Ac, "");
	}
	function sl(e) {
		P(Lc, B(Lc).filter((t) => t !== e), !0), el(e, !0);
	}
	function cl(e, t) {
		sa(e, () => {
			B(k).footer ??= {
				version: 1,
				show: !1,
				text: "",
				align: "center"
			}, t(B(k).footer);
		});
	}
	function ll(e, t) {
		cl(`edit:footer-brand-${e}`, (n) => {
			n.brand ??= {}, t.trim() ? n.brand[e] = t : delete n.brand[e], !n.brand.title && !n.brand.tagline && !n.brand.logo && delete n.brand;
		});
	}
	function ul(e) {
		cl("footer", (t) => {
			t.brand ??= {}, e === "image" || e === "both" ? t.brand.mode = e : delete t.brand.mode;
		});
	}
	async function dl(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", t) try {
			let e = await Cr(t);
			cl("footer", (t) => {
				t.brand ??= {}, t.brand.logo = e.dataUrl, t.brand.mode || (t.brand.mode = "both");
			});
		} catch {
			E(Z("status.imageReadErrorSvg"), "error");
		}
	}
	function fl() {
		cl("footer", (e) => {
			e.brand && (delete e.brand.logo, delete e.brand.mode, delete e.brand.logoHeight, !e.brand.title && !e.brand.tagline && delete e.brand);
		});
	}
	function pl(e) {
		cl("edit:footer-logo-height", (t) => {
			t.brand ??= {};
			let n = Number(e);
			Number.isFinite(n) && (t.brand.logoHeight = Math.min(160, Math.max(16, Math.round(n))));
		});
	}
	function ml(e) {
		cl("edit:footer-copyright", (t) => {
			e.trim() ? t.copyright = e : delete t.copyright;
		});
	}
	let hl = [
		{
			id: "minimal",
			label: Z("footerTemplate.minimal"),
			thumb: {
				center: !0,
				social: 2,
				baselineLinks: 1
			}
		},
		{
			id: "centered",
			label: Z("footerTemplate.centered"),
			thumb: {
				center: !0,
				row: !0,
				social: 3
			}
		},
		{
			id: "columns",
			label: Z("footerTemplate.columns"),
			thumb: {
				tag: !0,
				cols: 3,
				social: 3,
				baselineLinks: 2
			}
		},
		{
			id: "sitemap",
			label: Z("footerTemplate.sitemap"),
			thumb: {
				tag: !0,
				fat: !0,
				cols: 4,
				social: 4,
				baselineLinks: 3
			}
		},
		{
			id: "newsletter",
			label: Z("footerTemplate.newsletter"),
			thumb: {
				tag: !0,
				cta: !0,
				cols: 2,
				social: 2,
				baselineLinks: 1
			}
		},
		{
			id: "bigcta",
			label: Z("footerTemplate.bigcta"),
			thumb: {
				center: !0,
				bigcta: !0,
				baselineLinks: 2
			}
		},
		{
			id: "contact",
			label: Z("footerTemplate.contact"),
			thumb: {
				tag: !0,
				cols: 3,
				social: 2,
				baselineLinks: 1
			}
		},
		{
			id: "mega",
			label: Z("footerTemplate.mega"),
			thumb: {
				tag: !0,
				mega: !0,
				cols: 2,
				social: 4,
				baselineLinks: 2
			}
		}
	];
	function gl(e) {
		let t = Z("seed.orgName"), n = B(k).pages ?? [], r = (e) => n.slice(0, e).map((e) => ({
			label: e.title || e.id,
			page: e.id
		})), i = (e) => e.map((e) => ({
			icon: e,
			url: `https://${e}.com`
		})), a = (e, t) => ({
			label: e,
			href: t
		}), o = `© ${t}`;
		return e === "minimal" ? {
			align: "center",
			brand: { title: t },
			social: i(["facebook", "instagram"]),
			copyright: o,
			baseline: [a(Z("seed.footer.privacy"), "#")]
		} : e === "centered" ? {
			align: "center",
			brand: { title: t },
			linkRow: r(5),
			social: i([
				"facebook",
				"instagram",
				"x"
			]),
			copyright: `${o} · ${Z("seed.footer.madeWith")}`
		} : e === "columns" ? {
			align: "left",
			brand: {
				title: t,
				tagline: Z("seed.footer.tagline1")
			},
			columns: [
				{
					title: Z("seed.footer.colPages"),
					links: r(4)
				},
				{
					title: Z("seed.footer.colCompany"),
					links: [
						a(Z("seed.footer.about"), "#"),
						a(Z("seed.join"), "#"),
						a(Z("seed.footer.press"), "#")
					]
				},
				{
					title: Z("seed.footer.colResources"),
					links: [
						a(Z("seed.footer.bylaws"), "#"),
						a(Z("seed.footer.privacy"), "#"),
						a(Z("seed.footer.contact"), "#")
					]
				}
			],
			social: i([
				"facebook",
				"instagram",
				"linkedin"
			]),
			copyright: o,
			baseline: [a(Z("seed.footer.privacy"), "#"), a(Z("seed.footer.terms"), "#")]
		} : e === "sitemap" ? {
			align: "left",
			brand: {
				title: t,
				tagline: Z("seed.footer.tagline2")
			},
			columns: [
				{
					title: Z("seed.footer.colExplore"),
					links: [
						a(Z("seed.footer.home"), "#"),
						a(Z("seed.footer.events"), "#"),
						a(Z("seed.footer.gallery"), "#"),
						a(Z("seed.footer.blog"), "#")
					]
				},
				{
					title: Z("seed.footer.colCompany"),
					links: [
						a(Z("seed.footer.about"), "#"),
						a(Z("seed.footer.history"), "#"),
						a(Z("seed.footer.press"), "#"),
						a(Z("seed.footer.contact"), "#")
					]
				},
				{
					title: Z("seed.footer.colSupport"),
					links: [
						a(Z("seed.join"), "#"),
						a(Z("seed.footer.faq"), "#"),
						a(Z("seed.footer.help"), "#")
					]
				},
				{
					title: Z("seed.footer.colLegal"),
					links: [
						a(Z("seed.footer.privacy"), "#"),
						a(Z("seed.footer.terms"), "#"),
						a(Z("seed.footer.bylaws"), "#")
					]
				}
			],
			social: i([
				"facebook",
				"instagram",
				"linkedin",
				"youtube"
			]),
			copyright: o,
			baseline: [
				a(Z("seed.footer.privacy"), "#"),
				a(Z("seed.footer.terms"), "#"),
				a(Z("seed.footer.cookies"), "#")
			]
		} : e === "newsletter" ? {
			align: "left",
			brand: {
				title: t,
				tagline: Z("seed.footer.tagline3")
			},
			cta: {
				kind: "newsletter",
				heading: Z("seed.footer.newsletterHeading"),
				label: Z("seed.footer.newsletterButton"),
				recipient: Z("seed.email"),
				success: Z("seed.footer.newsletterSuccess")
			},
			columns: [{
				title: Z("seed.footer.colPages"),
				links: r(4)
			}, {
				title: Z("seed.footer.colMore"),
				links: [
					a(Z("seed.footer.about"), "#"),
					a(Z("seed.footer.contact"), "#"),
					a(Z("seed.footer.privacy"), "#")
				]
			}],
			social: i(["facebook", "instagram"]),
			copyright: o,
			baseline: [a(Z("seed.footer.privacy"), "#")]
		} : e === "bigcta" ? {
			align: "center",
			cta: {
				kind: "button",
				big: !0,
				heading: Z("seed.footer.ctaHeading"),
				sub: Z("seed.footer.ctaSub"),
				label: Z("seed.join"),
				href: "#"
			},
			linkRow: r(4),
			social: i([
				"facebook",
				"instagram",
				"x"
			]),
			copyright: o,
			baseline: [a(Z("seed.footer.privacy"), "#"), a(Z("seed.footer.terms"), "#")]
		} : e === "contact" ? {
			align: "left",
			brand: {
				title: t,
				tagline: Z("seed.footer.tagline4")
			},
			columns: [
				{
					title: Z("seed.footer.colVisit"),
					links: [
						a(Z("seed.footer.address"), "#"),
						a(Z("seed.email"), `mailto:${Z("seed.email")}`),
						a(Z("seed.phone"), `tel:${Z("seed.phone").replace(/\s+/g, "")}`)
					]
				},
				{
					title: Z("seed.footer.colHours"),
					links: [a(Z("seed.footer.hours1"), "#"), a(Z("seed.footer.hours2"), "#")]
				},
				{
					title: Z("seed.footer.colPages"),
					links: r(4)
				}
			],
			social: i(["facebook", "instagram"]),
			copyright: o,
			baseline: [a(Z("seed.footer.privacy"), "#")]
		} : {
			align: "left",
			brand: {
				title: t,
				tagline: Z("seed.footer.tagline5")
			},
			columns: [{
				title: Z("seed.footer.colExplore"),
				links: r(4)
			}, {
				title: Z("seed.footer.colFollow"),
				links: [a(Z("seed.footer.newsletter"), "#"), a(Z("seed.email"), `mailto:${Z("seed.email")}`)]
			}],
			social: i([
				"facebook",
				"instagram",
				"linkedin",
				"youtube"
			]),
			copyright: o,
			baseline: [a(Z("seed.footer.privacy"), "#"), a(Z("seed.footer.madeWith"), "#")],
			background: {
				version: 1,
				layers: [{
					type: "glow",
					version: nl.version ?? 1,
					props: {
						...nl.defaults(),
						color: "accent",
						x: .12,
						y: 0,
						radius: .6,
						opacity: .45
					}
				}, {
					type: "grain",
					version: il.version ?? 1,
					props: {
						...il.defaults(),
						opacity: .08
					}
				}]
			}
		};
	}
	function _l(e) {
		cl("footer-template", (t) => {
			let n = gl(e);
			t.show = !0, delete t.text;
			for (let e of [
				"align",
				"brand",
				"columns",
				"social",
				"copyright",
				"baseline",
				"linkRow",
				"cta",
				"columnsAlign",
				"background"
			]) n[e] === void 0 ? delete t[e] : t[e] = n[e];
		});
	}
	function vl(e) {
		cl("footer", (t) => {
			t[e] ??= [], t[e].push(B(k).pages[0] ? {
				label: Z("seed.link"),
				page: B(k).pages[0].id
			} : {
				label: Z("seed.link"),
				href: "https://"
			});
		});
	}
	function yl(e, t) {
		cl("footer", (n) => {
			n[e].splice(t, 1), n[e].length || delete n[e];
		});
	}
	function bl(e, t, n) {
		cl("footer", (r) => {
			let i = r[e], a = t + n;
			a < 0 || a >= i.length || ([i[t], i[a]] = [i[a], i[t]]);
		});
	}
	function xl(e, t, n) {
		cl(`edit:footer-${e}-label-${t}`, (r) => {
			r[e][t].label = n;
		});
	}
	function Sl(e, t, n) {
		cl("footer", (r) => {
			let i = r[e][t];
			n === "__href" ? (delete i.page, i.href = i.href ?? "https://") : (i.page = n, delete i.href);
		});
	}
	function Cl(e, t, n) {
		cl(`edit:footer-${e}-href-${t}`, (r) => {
			r[e][t].href = n;
		});
	}
	function wl(e) {
		cl("footer", (t) => {
			e === "center" ? t.columnsAlign = "center" : delete t.columnsAlign;
		});
	}
	function Tl(e) {
		cl("footer", (t) => {
			e ? t.cta ??= {
				kind: "button",
				label: Z("seed.join")
			} : delete t.cta;
		});
	}
	function El(e, t) {
		cl(`edit:footer-cta-${e}`, (n) => {
			n.cta ??= {}, t === "" || t == null || t === !1 ? delete n.cta[e] : n.cta[e] = t;
		});
	}
	function Dl(e) {
		cl("footer", (t) => {
			t.cta ??= {}, e === "__href" ? (delete t.cta.page, t.cta.href = t.cta.href ?? "https://") : (t.cta.page = e, delete t.cta.href);
		});
	}
	function kl(e, t) {
		cl("footer", (n) => {
			let r = new Set(n.hideOn ?? []);
			t ? r.delete(e) : r.add(e), r.size ? n.hideOn = [...r] : delete n.hideOn;
		});
	}
	function Al() {
		cl("footer", (e) => {
			e.columns ??= [], e.columns.push({
				title: Z("seed.column"),
				links: [{
					label: Z("seed.link"),
					page: B(k).pages[0].id
				}]
			});
		});
	}
	function jl(e) {
		cl("footer", (t) => {
			t.columns.splice(e, 1), t.columns.length || delete t.columns;
		});
	}
	function Ml(e, t) {
		cl("footer", (n) => {
			let r = e + t;
			r < 0 || r >= n.columns.length || ([n.columns[e], n.columns[r]] = [n.columns[r], n.columns[e]]);
		});
	}
	function Pl(e, t) {
		cl(`edit:footer-col-title-${e}`, (n) => {
			n.columns[e].title = t;
		});
	}
	function Fl(e) {
		cl("footer", (t) => {
			t.columns[e].links ??= [], t.columns[e].links.push({
				label: Z("seed.link"),
				page: B(k).pages[0].id
			});
		});
	}
	function Il(e, t) {
		cl("footer", (n) => {
			n.columns[e].links.splice(t, 1);
		});
	}
	function Ll(e, t, n) {
		cl("footer", (r) => {
			let i = r.columns[e].links, a = t + n;
			a < 0 || a >= i.length || ([i[t], i[a]] = [i[a], i[t]]);
		});
	}
	function Rl(e, t, n) {
		cl(`edit:footer-link-label-${e}-${t}`, (r) => {
			r.columns[e].links[t].label = n;
		});
	}
	function Vl(e, t, n) {
		cl("footer", (r) => {
			let i = r.columns[e].links[t];
			n === "__href" ? (delete i.page, i.href = i.href ?? "https://") : (i.page = n, delete i.href);
		});
	}
	function Hl(e, t, n) {
		cl(`edit:footer-link-href-${e}-${t}`, (r) => {
			r.columns[e].links[t].href = n;
		});
	}
	function Ul() {
		cl("footer", (e) => {
			e.social ??= [], e.social.push({
				icon: "facebook",
				url: "https://"
			});
		});
	}
	function tm(e) {
		cl("footer", (t) => {
			t.social.splice(e, 1), t.social.length || delete t.social;
		});
	}
	function nm(e, t) {
		cl("footer", (n) => {
			let r = e + t;
			r < 0 || r >= n.social.length || ([n.social[e], n.social[r]] = [n.social[r], n.social[e]]);
		});
	}
	function rm(e, t) {
		cl("footer", (n) => {
			n.social[e].icon = t;
		});
	}
	function im(e, t) {
		cl(`edit:footer-social-url-${e}`, (n) => {
			n.social[e].url = t;
		});
	}
	let am = Ha.filter(([e]) => e === "iconCat.social" || e === "iconCat.communication").flatMap(([, e]) => e.map((e) => [e, Z(Va[e].labelKey)]));
	function om(e, t) {
		sa(`edit:nav-label-${e}`, () => {
			B(k).nav.items[e].label = t;
		});
	}
	function sm(e, t) {
		sa("nav", () => {
			let n = B(k).nav.items[e];
			t === "__href" ? (delete n.page, n.href = n.href ?? "https://") : t === "__none" ? (delete n.page, delete n.href) : (n.page = t, delete n.href);
		});
	}
	function cm(e, t) {
		sa(`edit:nav-href-${e}`, () => {
			B(k).nav.items[e].href = t;
		});
	}
	function lm(e, t) {
		let n = e + t, r = B(k).nav.items;
		n < 0 || n >= r.length || sa("nav", () => {
			[r[e], r[n]] = [r[n], r[e]];
		});
	}
	function um(e) {
		sa("nav", () => {
			B(k).nav.items.splice(e, 1);
		});
	}
	let dm = /* @__PURE__ */ N(""), fm = /* @__PURE__ */ N(""), pm = /* @__PURE__ */ N(null);
	function mm(e) {
		let [t, n] = e.split(".").map(Number), r = B(k).nav.items;
		return n === void 0 ? {
			list: r,
			index: t,
			parent: null
		} : {
			list: r[t].children,
			index: n,
			parent: r[t]
		};
	}
	function hm(e, t, n, r) {
		if (!B(fm) || B(fm) === t) return null;
		let i = e.getBoundingClientRect(), a = (r - i.top) / i.height, o = n - i.left, s = mm(B(fm)), c = mm(t), l = s.list[s.index], u;
		return u = c.parent ? o < 28 ? {
			key: t.split(".")[0],
			pos: "after"
		} : {
			key: t,
			pos: a < .5 ? "before" : "after"
		} : !l.children?.length && o > i.width * .25 ? {
			key: t,
			pos: "into"
		} : {
			key: t,
			pos: a < .5 ? "before" : "after"
		}, gm(u, l, s);
	}
	function gm(e, t, n) {
		let r = mm(e.key);
		if (r.parent) {
			if (r.parent === t) return null;
			t.children?.length && (e = {
				key: e.key.split(".")[0],
				pos: "after"
			}, r = mm(e.key));
		}
		let i = r.list[r.index];
		if (e.pos === "into") {
			let n = i.children ?? [];
			return n.length && n[n.length - 1] === t ? null : e;
		}
		let a = r.parent ? r.parent.children : B(k).nav.items, o = a.filter((e) => e !== t).indexOf(i) + +(e.pos === "after");
		return a === n.list && o === n.index ? null : e;
	}
	function _m() {
		if (!B(fm)) return {
			label: "",
			target: ""
		};
		let e = mm(B(fm)), t = e.list[e.index], n = t.page ? B(k).pages.find((e) => e.id === t.page) : null;
		return {
			label: t.label,
			target: n ? n.title : t.href ?? Z("opt.noLink")
		};
	}
	function vm() {
		B(pm) && bm(B(pm).key), P(fm, ""), P(pm, null);
	}
	function ym(e) {
		if (!B(fm)) return;
		let t = [...e.currentTarget.querySelectorAll(".nav-item:not(.ghost)")];
		if (!t.length) return;
		let n = t.find((t) => {
			let n = t.getBoundingClientRect();
			return e.clientY >= n.top && e.clientY <= n.bottom;
		}), r = null;
		if (n) r = hm(n, n.dataset.key, e.clientX, e.clientY);
		else {
			let n = mm(B(fm)), i = n.list[n.index], a = t.find((t) => {
				let n = t.getBoundingClientRect();
				return n.top + n.height / 2 > e.clientY;
			});
			if (a) r = a.dataset.key === B(fm) ? null : gm({
				key: a.dataset.key,
				pos: "before"
			}, i, n);
			else {
				let e = [...t].reverse().find((e) => !e.classList.contains("child"));
				r = e.dataset.key === B(fm) ? null : gm({
					key: e.dataset.key,
					pos: "after"
				}, i, n);
			}
		}
		if (!r) {
			P(pm, null);
			return;
		}
		e.preventDefault(), (B(pm)?.key !== r.key || B(pm)?.pos !== r.pos) && P(pm, r, !0);
	}
	function bm(e) {
		let t = B(fm), n = B(pm);
		if (P(fm, ""), P(pm, null), !(!t || !n || n.key !== e || t === e)) {
			{
				let r = mm(t), i = mm(e), a = r.list[r.index];
				if (i.parent && (i.parent === a || a.children?.length) || n.pos === "into" && a.children?.length) return;
			}
			sa("nav", () => {
				let r = B(k).nav.items, i = mm(t), a = mm(e), o = i.list[i.index], s = a.list[a.index];
				if (o !== s) {
					if (i.list.splice(i.index, 1), i.parent && i.parent.children.length === 0 && delete i.parent.children, n.pos === "into") s.children ??= [], s.children.push(o);
					else {
						let e = a.parent ? a.parent.children : r, t = e.indexOf(s) + +(n.pos === "after");
						e.splice(t, 0, o);
					}
					!o.page && o.href == null && !o.children?.length && (o.page = B(k).pages[0].id);
				}
			}), P(dm, "");
		}
	}
	let xm = "<svg width=\"10\" height=\"16\" viewBox=\"0 0 10 16\" fill=\"currentColor\" aria-hidden=\"true\"><circle cx=\"3\" cy=\"3\" r=\"1.3\"/><circle cx=\"7\" cy=\"3\" r=\"1.3\"/><circle cx=\"3\" cy=\"8\" r=\"1.3\"/><circle cx=\"7\" cy=\"8\" r=\"1.3\"/><circle cx=\"3\" cy=\"13\" r=\"1.3\"/><circle cx=\"7\" cy=\"13\" r=\"1.3\"/></svg>";
	function Sm() {
		sa("nav", () => {
			B(k).nav.items.push({
				label: Z("seed.link"),
				page: B(k).pages[0].id
			});
		});
	}
	function Cm(e) {
		sa("nav", () => {
			let t = B(k).nav.items[e];
			t.children ??= [], t.children.push({
				label: Z("seed.link"),
				page: B(k).pages[0].id
			});
		});
	}
	function wm(e, t, n) {
		sa(`edit:nav-child-label-${e}-${t}`, () => {
			B(k).nav.items[e].children[t].label = n;
		});
	}
	function Tm(e, t, n) {
		sa("nav", () => {
			let r = B(k).nav.items[e].children[t];
			n === "__href" ? (delete r.page, r.href = r.href ?? "https://") : (r.page = n, delete r.href);
		});
	}
	function Em(e, t, n) {
		sa(`edit:nav-child-href-${e}-${t}`, () => {
			B(k).nav.items[e].children[t].href = n;
		});
	}
	function Dm(e, t, n) {
		let r = t + n, i = B(k).nav.items[e].children;
		r < 0 || r >= i.length || sa("nav", () => {
			[i[t], i[r]] = [i[r], i[t]];
		});
	}
	function Om(e, t) {
		sa("nav", () => {
			let n = B(k).nav.items[e];
			n.children.splice(t, 1), n.children.length === 0 && (delete n.children, !n.page && !n.href && (n.page = B(k).pages[0].id));
		});
	}
	function km(e, t) {
		sa(`edit:theme-color-${e}`, () => {
			B(k).theme.tokens.color[e] = t, B(k).theme.alt?.auto && (B(k).theme.alt.tokens.color = Um());
		});
	}
	function Am(e, t) {
		return e === "accent-text" ? S(Zm(t.accent ?? "#000000", t)) : t.bg;
	}
	let jm = /* @__PURE__ */ A(() => !B(k)?.theme?.tokens?.color?.["accent-text"] && !B(k)?.theme?.alt?.tokens?.color?.["accent-text"]), Mm = /* @__PURE__ */ N(null), Nm = /* @__PURE__ */ N(!1), Pm = /* @__PURE__ */ N(!1), Fm = (e) => e.length > 0 && [...e].every((e) => e.open);
	function Im() {
		let e = B(Mm)?.querySelectorAll("details.group") ?? [];
		P(Nm, e.length > 0), P(Pm, Fm(e), !0);
	}
	xn(() => {
		B(Tt), pr().then(Im);
	});
	function Lm() {
		let e = !B(Pm);
		B(Mm)?.querySelectorAll("details.group").forEach((t) => {
			t.open = e;
		}), Im();
	}
	function Rm(e) {
		for (let t of e.querySelectorAll("details.group")) {
			let e = t.querySelector(":scope > summary");
			if (!e || e.querySelector(".fold-sub")) continue;
			let n = () => t.querySelectorAll(":scope > .group-items details.group");
			if (!n().length) continue;
			let r = document.createElement("button");
			r.type = "button", r.className = "fold-sub fold-toggle", r.innerHTML = _.foldToggle;
			let i = () => {
				let e = Fm(n());
				r.classList.toggle("collapse", e), r.title = Z(e ? "ui.collapseSub" : "ui.expandSub"), r.setAttribute("aria-label", r.title);
			};
			r.addEventListener("click", (e) => {
				e.preventDefault(), e.stopPropagation();
				let a = !r.classList.contains("collapse");
				t.open = !0, n().forEach((e) => {
					e.open = a;
				}), i();
			}), t.addEventListener("toggle", i, !0), i(), e.appendChild(r);
		}
	}
	xn(() => {
		let e = B(Mm);
		if (!e) return;
		let t = new MutationObserver(() => {
			Rm(e), Im();
		});
		return t.observe(e, {
			childList: !0,
			subtree: !0
		}), e.addEventListener("toggle", Im, !0), Rm(e), () => {
			t.disconnect(), e.removeEventListener("toggle", Im, !0);
		};
	});
	function zm(e) {
		sa("edit:theme-color-accent-text", () => {
			e ? (delete B(k).theme.tokens.color["accent-text"], B(k).theme.alt?.tokens?.color && delete B(k).theme.alt.tokens.color["accent-text"]) : (B(k).theme.tokens.color["accent-text"] = Am("accent-text", B(Wr)), B(k).theme.alt?.auto && (B(k).theme.alt.tokens.color = Um()));
		});
	}
	function Bm(e, t) {
		sa("theme", () => {
			B(k).theme.tokens.font[e] = t;
		});
	}
	function Vm(e, t) {
		sa("theme", () => {
			B(k).theme.tokens.radius[e] = t;
		});
	}
	function Hm(e) {
		let t = /^#([0-9a-f]{6})$/i.exec(e ?? "");
		if (!t) return e;
		let [n, r, i] = [
			0,
			2,
			4
		].map((e) => parseInt(t[1].slice(e, e + 2), 16) / 255), a = Math.max(n, r, i), o = Math.min(n, r, i), s = 0, c = (a + o) / 2, l = a - o, u = l === 0 ? 0 : l / (1 - Math.abs(2 * c - 1));
		l !== 0 && (s = a === n ? (r - i) / l % 6 : a === r ? (i - n) / l + 2 : (n - r) / l + 4, s = (s * 60 + 360) % 360);
		let d = 1 - c, f = (1 - Math.abs(2 * d - 1)) * u, p = f * (1 - Math.abs(s / 60 % 2 - 1)), m = d - f / 2, [h, g, _] = s < 60 ? [
			f,
			p,
			0
		] : s < 120 ? [
			p,
			f,
			0
		] : s < 180 ? [
			0,
			f,
			p
		] : s < 240 ? [
			0,
			p,
			f
		] : s < 300 ? [
			p,
			0,
			f
		] : [
			f,
			0,
			p
		], v = (e) => Math.round((e + m) * 255).toString(16).padStart(2, "0");
		return `#${v(h)}${v(g)}${v(_)}`;
	}
	function Um() {
		return Object.fromEntries(Object.entries(B(k).theme.tokens.color).map(([e, t]) => [e, Hm(t)]));
	}
	function Wm(e, t) {
		sa(`edit:theme-alt-${e}`, () => {
			B(k).theme.alt.tokens.color[e] = t, B(k).theme.alt.auto = !1;
		});
	}
	function Gm(e) {
		sa("theme", () => {
			e === "light" ? delete B(k).theme.scheme : B(k).theme.scheme = e;
		});
	}
	function Km(e) {
		sa("theme", () => {
			e ? B(k).theme.alt = {
				auto: !0,
				tokens: { color: Um() }
			} : delete B(k).theme.alt;
		});
	}
	function qm(e) {
		sa("theme", () => {
			B(k).theme.alt ??= { tokens: { color: Um() } }, B(k).theme.alt.auto = e, e && (B(k).theme.alt.tokens.color = Um());
		});
	}
	function Jm(e) {
		let t = B(k).theme.tokens.font[e];
		return [...Gl.some(([, e]) => e === t) ? [] : [[t, Z("opt.customFont")]], ...Gl.map(([e, t]) => [t, Z(e)])];
	}
	let Ym = (e) => parseInt(e, 10) || 0;
	function Xm(e, t) {
		Vm(e, `${t}px`);
	}
	let Zm = (e, t) => e && t && t[e] ? t[e] : e, Qm = [
		"bg",
		"surface",
		"text",
		"accent",
		"accent-text"
	], $m = [
		{
			id: "well",
			name: Z("themePreset.well.name"),
			note: Z("themePreset.well.note"),
			light: {
				bg: "#f6faf8",
				surface: "#ffffff",
				text: "#16211d",
				accent: "#15b39a",
				"accent-text": "#04241d"
			},
			dark: {
				bg: "#0e1512",
				surface: "#17211d",
				text: "#eaf1ed",
				accent: "#22c3a8",
				"accent-text": "#04241d"
			}
		},
		{
			id: "stone",
			name: Z("themePreset.stone.name"),
			note: Z("themePreset.stone.note"),
			light: {
				bg: "#f4f2ed",
				surface: "#ffffff",
				text: "#262019",
				accent: "#8a5a41",
				"accent-text": "#ffffff"
			},
			dark: {
				bg: "#17130e",
				surface: "#221c15",
				text: "#efe8dd",
				accent: "#c0906f",
				"accent-text": "#1a1109"
			}
		},
		{
			id: "plum",
			name: Z("themePreset.plum.name"),
			note: Z("themePreset.plum.note"),
			light: {
				bg: "#faf5ff",
				surface: "#ffffff",
				text: "#2a1546",
				accent: "#7c3aed",
				"accent-text": "#ffffff"
			},
			dark: {
				bg: "#140f20",
				surface: "#1f1733",
				text: "#ece5f8",
				accent: "#a97cf6",
				"accent-text": "#170a2c"
			}
		},
		{
			id: "rose",
			name: Z("themePreset.rose.name"),
			note: Z("themePreset.rose.note"),
			light: {
				bg: "#faf5f6",
				surface: "#ffffff",
				text: "#241a1d",
				accent: "#b04a63",
				"accent-text": "#ffffff"
			},
			dark: {
				bg: "#171015",
				surface: "#22181c",
				text: "#f1e6ea",
				accent: "#d98098",
				"accent-text": "#2a0f18"
			}
		},
		{
			id: "ocean",
			name: Z("themePreset.ocean.name"),
			note: Z("themePreset.ocean.note"),
			light: {
				bg: "#f1f6fb",
				surface: "#ffffff",
				text: "#13202b",
				accent: "#1a6fa8",
				"accent-text": "#ffffff"
			},
			dark: {
				bg: "#0a1420",
				surface: "#12202f",
				text: "#e2edf5",
				accent: "#47a6df",
				"accent-text": "#06131f"
			}
		},
		{
			id: "night",
			name: Z("themePreset.night.name"),
			note: Z("themePreset.night.note"),
			scheme: "dark",
			light: {
				bg: "#f5f6fb",
				surface: "#ffffff",
				text: "#171a2b",
				accent: "#4f5ed6",
				"accent-text": "#ffffff"
			},
			dark: {
				bg: "#0d0f1a",
				surface: "#171b2e",
				text: "#e7e9f5",
				accent: "#8091ff",
				"accent-text": "#0a0c18"
			}
		}
	];
	function eh(e) {
		sa("theme", () => {
			let t = e.scheme === "dark", n = t ? e.dark : e.light, r = t ? e.light : e.dark;
			for (let e of Qm) B(k).theme.tokens.color[e] = n[e];
			t ? B(k).theme.scheme = "dark" : delete B(k).theme.scheme, B(k).theme.alt = { tokens: { color: { ...r } } };
		});
	}
	let th = /* @__PURE__ */ A(() => {
		if (!B(k)) return null;
		let e = B(k).theme.tokens.color, t = B(k).theme.alt?.tokens?.color ?? {}, n = B(k).theme.scheme === "dark";
		return $m.find((r) => {
			let i = n ? r.dark : r.light, a = n ? r.light : r.dark;
			return Qm.every((n) => e[n] === i[n] && t[n] === a[n]);
		})?.id ?? null;
	});
	function nh() {
		P(ce, !B(ce)), Ue?.sendChrome(B(ce));
	}
	function rh(e) {
		let t = O.data.sections.find((t) => t.id === e.sectionId), n = t?.blocks.find((t) => t.id === e.blockId);
		n && (nt(`edit:${e.blockId}`), n.props = e.props, O.save(), Ze(), B(j)?.blockId === e.blockId && zt(), e.rerender && Ue?.sendSection(B(w), t), P(ee, ""));
	}
	function ih(e) {
		let t = O.data.sections.find((t) => t.id === e.sectionId), n = t?.blocks.find((t) => t.id === e.blockId);
		if (!n) return;
		nt(e.coalesce ? `edit:${e.groupKey ?? e.blockId}` : "move-block");
		let r = e.frameKey === "mobile" ? "mobile" : "desktop";
		n.frames[r] = e.frame, r === "desktop" && Ve(t, "desktop-changed-after-mobile"), O.save(), Ze(), B(j)?.blockId === e.blockId && zt();
	}
	function ah(e) {
		let t = O.data.sections.find((t) => t.id === e.sectionId)?.blocks.find((t) => t.id === e.blockId);
		!t?.frames?.desktop || t.frames.desktop.h === e.h || (O.amendBaseline((t) => {
			let n = t.sections.find((t) => t.id === e.sectionId)?.blocks.find((t) => t.id === e.blockId);
			n?.frames?.desktop && (n.frames.desktop.h = e.h);
		}), O.hasDraft() && nt(`edit:${e.blockId}`), t.frames.desktop.h = e.h, O.save(), Ze(), B(j)?.blockId === e.blockId && zt());
	}
	function oh(e) {
		let t = O.data.sections.find((t) => t.id === e.sectionId);
		if (t) {
			if (nt("mobile-reset"), e.blockId) {
				let n = t.blocks.find((t) => t.id === e.blockId);
				n && (n.frames.mobile = null);
			} else for (let e of t.blocks) e.frames.mobile = null;
			!Be(t) && t.responsive?.mobile && (t.responsive.mobile.attention = null), O.save(), Ze(), Le(), Ue?.sendSection(B(w), t);
		}
	}
	function sh(e) {
		let t = O.data.sections.find((t) => t.id === e.sectionId), n = t?.blocks.find((t) => t.id === e.blockId);
		!n || typeof e.mobileOrder != "number" || (nt("mobile-order"), n.mobileOrder = e.mobileOrder, O.save(), Ze(), Ue?.sendSection(B(w), t));
	}
	function ch(e) {
		let t = O.data.sections.find((t) => t.id === e.sectionId);
		t?.responsive?.mobile && (nt("review-done"), t.responsive.mobile.attention = null, O.save(), Ze(), Le());
	}
	function lh(e) {
		let t = O.data.sections.find((t) => t.id === e.sectionId), n = t?.blocks.find((t) => t.id === e.blockId);
		n && (nt("block-flag"), typeof e.decor == "boolean" && (n.decor = e.decor), typeof e.hideMobile == "boolean" && (n.hideMobile = e.hideMobile), O.save(), Ze(), typeof e.hideMobile == "boolean" && B(be) === "mobile" && Ue?.sendSection(B(w), t), B(j)?.blockId === e.blockId && zt());
	}
	function uh(e) {
		nt("add-section"), e.section.id || (e.section.id = gs("sec")), O.data.sections.splice(e.index, 0, e.section), O.save(), Ze(), Ue?.sendPage(B(w), O.data), P(In, e.section.id, !0), Un(e.section), P(Tt, "properties");
	}
	function dh(e) {
		let t = O.data.sections, n = t.findIndex((t) => t.id === e.sectionId), r = n + e.dir;
		n < 0 || r < 0 || r >= t.length || (nt("move-section"), [t[n], t[r]] = [t[r], t[n]], O.save(), Ze(), Ue?.sendPage(B(w), O.data));
	}
	function fh(e) {
		nt("delete-section"), e.sectionId === B(In) && (P(In, null), P(Ln, null)), B(j)?.sectionId === e.sectionId && P(j, null), O.data.sections = O.data.sections.filter((t) => t.id !== e.sectionId), O.save(), Ze(), Ue?.sendPage(B(w), O.data);
	}
	function ph(e) {
		let t = O.data.sections.find((t) => t.id === e.sectionId);
		if (t) {
			nt("section-size"), t.size = {
				...t.size,
				minHeight: e.minHeight
			};
			for (let n of e.moves ?? []) {
				let e = t.blocks.find((e) => e.id === n.blockId);
				e && (e.frames.desktop = {
					...e.frames.desktop,
					y: e.frames.desktop.y + n.dy
				});
			}
			e.moves?.length && (Ve(t, "section-height"), B(j)?.sectionId === e.sectionId && zt()), e.sectionId === B(In) && P(Rn, e.minHeight, !0), O.save(), Ze();
		}
	}
	function mh(e) {
		let t = O.data.sections.find((t) => t.id === e.fromSectionId), n = O.data.sections.find((t) => t.id === e.toSectionId), r = t?.blocks.find((t) => t.id === e.blockId);
		!t || !n || !r || (nt("move-block"), t.blocks = t.blocks.filter((t) => t.id !== e.blockId), r.frames.desktop = e.frame, r.frames.mobile = null, n.blocks.push(r), Ve(t, "block-moved"), Ve(n, "block-moved"), O.save(), Ze(), Le(), Ue?.sendPage(B(w), O.data), B(j)?.blockId === e.blockId && (P(j, {
			...B(j),
			sectionId: e.toSectionId
		}, !0), zt()));
	}
	function hh(e) {
		let t = O.data.sections.find((t) => t.id === e.sectionId);
		if (!t) return;
		let n = e.blockIds ?? [e.blockId];
		nt("delete-block"), t.blocks = t.blocks.filter((e) => !n.includes(e.id)), n.includes(B(j)?.blockId) && P(j, null), Ve(t, "block-deleted"), O.save(), Ze(), Ue?.sendSection(B(w), t);
	}
	let gh = {
		text: {
			type: "text",
			props: {
				html: Z("seed.text"),
				align: "left"
			},
			w: 33,
			h: 28
		},
		"text-box": {
			type: "text",
			props: {
				html: Z("seed.textBox"),
				align: "left",
				box: !0
			},
			w: 30,
			h: 150
		},
		button: {
			type: "button",
			props: {
				label: Z("seed.newButton"),
				page: null,
				href: null,
				style: "primary"
			},
			w: 20,
			h: 36
		},
		"shape-line": {
			type: "shape",
			decor: !0,
			hideMobile: !0,
			props: {
				kind: "line",
				color: "accent",
				thickness: 2,
				fill: null
			},
			w: 25,
			h: 8
		},
		"shape-arrow": {
			type: "shape",
			decor: !0,
			hideMobile: !0,
			props: {
				kind: "arrow",
				color: "accent",
				thickness: 2,
				fill: null
			},
			w: 25,
			h: 16
		},
		"shape-circle": {
			type: "shape",
			decor: !0,
			hideMobile: !0,
			props: {
				kind: "circle",
				color: "accent",
				thickness: 2,
				fill: null
			},
			w: 10,
			h: 110
		},
		"shape-rect": {
			type: "shape",
			decor: !0,
			hideMobile: !0,
			props: {
				kind: "rect",
				color: "accent",
				thickness: 2,
				fill: null
			},
			w: 20,
			h: 110
		},
		"shape-triangle": {
			type: "shape",
			decor: !0,
			hideMobile: !0,
			props: {
				kind: "triangle",
				color: "accent",
				thickness: 2,
				fill: null
			},
			w: 10,
			h: 110
		},
		image: {
			type: "image",
			props: {
				src: "",
				alt: "",
				fit: "cover",
				radius: "md",
				href: null
			},
			w: 30,
			h: 220
		},
		video: {
			type: "video",
			props: {
				url: "",
				title: "Video"
			},
			w: 45,
			h: 300
		},
		map: {
			type: "map",
			props: {
				location: "",
				zoom: 15,
				height: 320
			},
			w: 60,
			h: 360
		},
		form: {
			type: "form",
			props: {
				recipient: "",
				subject: "",
				mode: "mailto",
				endpoint: "",
				submitLabel: Z("form.sendDefault"),
				successText: Z("form.thanksDefault"),
				fields: Qo()
			},
			w: 50,
			h: 380
		},
		calendar: {
			type: "calendar",
			props: {
				sources: [],
				view: "list",
				limit: 6,
				showCategories: !0,
				showSubscribe: !0
			},
			w: 60,
			h: 320
		},
		"calendar-cards": {
			type: "calendar",
			props: {
				sources: [],
				view: "cards",
				limit: 6,
				showCategories: !0,
				showSubscribe: !0
			},
			w: 88,
			h: 320
		},
		"calendar-month": {
			type: "calendar",
			props: {
				sources: [],
				view: "month",
				limit: 6,
				showCategories: !0,
				showSubscribe: !0
			},
			w: 88,
			h: 480
		},
		"calendar-next": {
			type: "calendar",
			props: {
				sources: [],
				view: "next",
				limit: 6,
				showCategories: !0,
				showSubscribe: !0
			},
			w: 40,
			h: 180
		},
		icon: {
			type: "icon",
			decor: !0,
			hideMobile: !0,
			props: {
				glyph: "★",
				color: "accent",
				size: 48
			},
			w: 8,
			h: 64
		},
		collection: {
			type: "collection",
			props: {
				collection: null,
				view: "cards",
				limit: 6,
				newestFirst: !0
			},
			w: 90,
			h: 200
		},
		gallery: {
			type: "gallery",
			props: {
				images: [],
				view: "grid",
				columns: 3,
				gap: 12,
				radius: "md",
				lightbox: !0,
				interval: 5
			},
			w: 90,
			h: 320
		},
		faq: {
			type: "faq",
			props: {
				items: [
					{
						q: Z("seed.faq.q1"),
						a: Z("seed.faq.answer")
					},
					{
						q: Z("seed.faq.q2"),
						a: Z("seed.faq.answer")
					},
					{
						q: Z("seed.faq.q3"),
						a: Z("seed.faq.answer")
					}
				],
				multi: !1
			},
			w: 50,
			h: 220
		},
		timeline: {
			type: "timeline",
			props: {
				items: [
					{
						year: "2019",
						title: Z("seed.timeline.t1"),
						text: Z("seed.timeline.text")
					},
					{
						year: "2022",
						title: Z("seed.timeline.t2"),
						text: Z("seed.timeline.text")
					},
					{
						year: "2026",
						title: Z("seed.timeline.t3"),
						text: Z("seed.timeline.text")
					}
				],
				variant: "left",
				marker: "filled",
				accent: null
			},
			w: 42,
			h: 260
		},
		quote: {
			type: "quote",
			props: {
				text: Z("seed.quoteBlock.text"),
				attribution: Z("seed.quoteBlock.name"),
				role: Z("seed.quoteBlock.role"),
				variant: "large",
				image: "",
				accent: null
			},
			w: 44,
			h: 180
		},
		stats: {
			type: "stats",
			props: {
				value: "4800",
				prefix: "",
				suffix: "+",
				label: Z("seed.statsBlock.label"),
				countUp: !0
			},
			w: 20,
			h: 90
		},
		table: {
			type: "table",
			props: {
				header: !0,
				striped: !1,
				lines: "rows",
				rows: [
					[
						Z("seed.table.h1"),
						Z("seed.table.h2"),
						Z("seed.table.h3")
					],
					[
						Z("seed.table.r1c1"),
						Z("seed.table.r1c2"),
						""
					],
					[
						Z("seed.table.r2c1"),
						Z("seed.table.r2c2"),
						""
					]
				]
			},
			w: 50,
			h: 160
		},
		share: {
			type: "share",
			props: {
				services: [
					"facebook",
					"x",
					"linkedin",
					"whatsapp",
					"email",
					"copy"
				],
				variant: "icons",
				size: 38,
				color: ""
			},
			w: 34,
			h: 48
		},
		countdown: {
			type: "countdown",
			props: {
				target: (() => {
					let e = new Date(Date.now() + 2592e6), t = (e) => String(e).padStart(2, "0");
					return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}T18:00`;
				})(),
				doneText: Z("seed.countdown.done"),
				variant: "boxes",
				showSeconds: !0
			},
			w: 40,
			h: 110
		},
		audio: {
			type: "audio",
			props: {
				src: "",
				title: "",
				loop: !1
			},
			w: 34,
			h: 80
		},
		product: {
			type: "product",
			props: {
				collection: null,
				limit: 0,
				columns: 0,
				currency: "kr"
			},
			w: 90,
			h: 300
		},
		cart: {
			type: "cart",
			props: {
				variant: "button",
				href: "",
				currency: "kr"
			},
			w: 16,
			h: 48
		},
		checkout: {
			type: "checkout",
			props: {
				recipient: "",
				endpoint: "",
				vipps: "",
				currency: "kr",
				vippsCheckout: !1
			},
			w: 44,
			h: 430
		}
	};
	function _h(e) {
		let t = gh[e];
		return t ? {
			id: gs("blk"),
			type: t.type,
			version: 1,
			decor: !!t.decor,
			hideMobile: !!t.hideMobile,
			props: structuredClone(t.props),
			animation: null,
			frames: {
				desktop: {
					x: 4,
					y: 8,
					w: t.w,
					h: t.h,
					z: 1,
					rot: 0
				},
				mobile: null
			}
		} : null;
	}
	function vh(e) {
		Ue ? Ue.sendPlaceBlock(e) : yh(ci()?.id, e);
	}
	function yh(e, t) {
		let n = O.data.sections.find((t) => t.id === e) ?? O.data.sections[0];
		if (!n) return;
		nt("add-block");
		let r = Math.max(0, ...n.blocks.map((e) => e.frames?.desktop?.z ?? 1)) + 1;
		t.frames?.desktop && (t.frames.desktop = {
			...t.frames.desktop,
			z: r
		}), n.blocks.push(t), Ve(n, "block-added"), O.save(), Ze(), Ue?.sendSection(B(w), n);
	}
	function bh(e, t, n, r) {
		let i = O.data.sections.find((t) => t.id === e);
		if (!i || !t?.length) return;
		nt("add-blocks");
		for (let e of r ?? []) {
			let t = i.blocks.find((t) => t.id === e.blockId);
			t && typeof e.dy == "number" && (t.frames.desktop = {
				...t.frames.desktop,
				y: t.frames.desktop.y + e.dy
			});
		}
		i.blocks.push(...t);
		let a = String(i.size?.minHeight ?? "");
		n && a.endsWith("px") && Number.parseFloat(a) < n && (i.size = {
			...i.size,
			minHeight: `${n}px`
		}), Ve(i, "block-added"), O.save(), Ze(), Ue?.sendSection(B(w), i);
	}
	function xh(e) {
		vh(_h(e));
	}
	let Sh = /* @__PURE__ */ N(en([])), Ch = { map: [
		{
			key: "location",
			type: "place",
			label: Z("lbl.mapLocation"),
			placeholder: Z("ph.mapLocation")
		},
		{
			key: "zoom",
			type: "number",
			label: Z("lbl.mapZoom"),
			min: 1,
			max: 19
		},
		{
			key: "height",
			type: "number",
			label: Z("lbl.mapHeight"),
			min: 120,
			max: 900,
			step: 10
		}
	] };
	function wh(e, t = {}) {
		let n = We(e);
		vh({
			id: gs("blk"),
			type: n.type,
			version: n.version ?? 1,
			decor: !1,
			props: {
				...n.defaults ?? {},
				...We(t)
			},
			animation: null,
			frames: {
				desktop: {
					x: 25,
					y: 40,
					w: 50,
					h: 260,
					z: 1,
					rot: 0
				},
				mobile: null
			}
		});
	}
	let Th = /* @__PURE__ */ N("");
	function Eh() {
		let e = [
			{
				label: Z("blocks.text"),
				act: "block",
				kind: "text"
			},
			{
				label: Z("ui.textBox"),
				act: "block",
				kind: "text-box"
			},
			{
				label: Z("blocks.button"),
				act: "block",
				kind: "button"
			},
			{
				label: Z("blocks.image"),
				act: "image"
			},
			{
				label: Z("blocks.video"),
				act: "block",
				kind: "video"
			},
			{
				label: Z("blocks.icon"),
				act: "block",
				kind: "icon"
			},
			{
				label: Z("blocks.map"),
				act: "block",
				kind: "map"
			},
			{
				label: Z("blocks.form"),
				act: "block",
				kind: "form"
			},
			{
				label: `${Z("blocks.calendar")}: ${Z("calendar.viewList")}`,
				act: "block",
				kind: "calendar"
			},
			{
				label: `${Z("blocks.calendar")}: ${Z("calendar.viewCards")}`,
				act: "block",
				kind: "calendar-cards"
			},
			{
				label: `${Z("blocks.calendar")}: ${Z("calendar.viewMonth")}`,
				act: "block",
				kind: "calendar-month"
			},
			{
				label: `${Z("blocks.calendar")}: ${Z("calendar.viewNext")}`,
				act: "block",
				kind: "calendar-next"
			},
			{
				label: Z("blocks.collection"),
				act: "block",
				kind: "collection"
			},
			{
				label: Z("blocks.faq"),
				act: "block",
				kind: "faq"
			},
			{
				label: Z("blocks.timeline"),
				act: "block",
				kind: "timeline"
			},
			{
				label: Z("blocks.quote"),
				act: "block",
				kind: "quote"
			},
			{
				label: Z("blocks.stats"),
				act: "block",
				kind: "stats"
			},
			{
				label: Z("blocks.table"),
				act: "block",
				kind: "table"
			},
			{
				label: Z("blocks.share"),
				act: "block",
				kind: "share"
			},
			{
				label: Z("blocks.countdown"),
				act: "block",
				kind: "countdown"
			},
			{
				label: Z("blocks.audio"),
				act: "block",
				kind: "audio"
			},
			{
				label: Z("blocks.product"),
				act: "block",
				kind: "product"
			},
			{
				label: Z("blocks.cart"),
				act: "block",
				kind: "cart"
			},
			{
				label: Z("blocks.checkout"),
				act: "block",
				kind: "checkout"
			},
			{
				label: Z("ui.emptyGallery"),
				act: "block",
				kind: "gallery"
			},
			{
				label: Z("ui.galleryWithImages"),
				act: "galleryImages"
			},
			{
				label: Z("shape.line"),
				act: "block",
				kind: "shape-line"
			},
			{
				label: Z("shape.arrow"),
				act: "block",
				kind: "shape-arrow"
			},
			{
				label: Z("shape.circle"),
				act: "block",
				kind: "shape-circle"
			},
			{
				label: Z("shape.rect"),
				act: "block",
				kind: "shape-rect"
			},
			{
				label: Z("shape.triangle"),
				act: "block",
				kind: "shape-triangle"
			}
		];
		for (let t of B(Fs)) {
			let n = Ms[t]?.data?.mal;
			n?.kind === "blocks" && e.push({
				label: n.name,
				act: "template",
				id: t
			});
		}
		for (let t of B(Sh)) if (t.variants?.length) for (let n of t.variants) e.push({
			label: `${t.label}: ${n.label}`,
			act: "plugin",
			entry: t,
			props: n.props
		});
		else e.push({
			label: t.label,
			act: "plugin",
			entry: t
		});
		return e;
	}
	function Dh(e) {
		e.act === "block" ? xh(e.kind) : e.act === "plugin" ? wh(e.entry, e.props ?? {}) : e.act === "template" && Ue?.sendInsertTemplate(e.id);
	}
	function Oh(e) {
		let t = _h(e.kind);
		if (t) {
			if (e.at && typeof e.at.x == "number" && typeof e.at.y == "number") {
				let n = O.data.sections.find((t) => t.id === e.sectionId)?.grid ?? B(k).grid, r = Kl({
					x: e.at.x,
					y: e.at.y,
					w: t.frames.desktop.w,
					h: t.frames.desktop.h,
					grid: n
				});
				t.frames.desktop.x = r.x, t.frames.desktop.y = r.y;
			} else t.frames.desktop.x = Math.round((100 - t.frames.desktop.w) / 2 * 100) / 100, t.frames.desktop.y = 40;
			yh(e.sectionId, t), Ue?.sendSelect(t.id), e.kind === "image" && E(Z("status.imageBlockAdded")), e.kind === "gallery" && E(Z("status.galleryBlockAdded"));
		}
	}
	async function kh(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", !t) return;
		E(Z("status.compressingImage"));
		let n;
		try {
			n = await Cr(t);
		} catch {
			E(Z("status.imageReadError"), "error");
			return;
		}
		let r = Math.round(n.height / n.width * .3 * (B(ae)?.clientWidth ?? 1280));
		vh({
			id: gs("blk"),
			type: "image",
			version: 1,
			props: {
				src: n.dataUrl,
				alt: Da(t.name).replaceAll("-", " "),
				fit: "cover",
				radius: "md",
				href: null
			},
			animation: null,
			frames: {
				desktop: {
					x: 4,
					y: 8,
					w: 30,
					h: Math.max(40, r),
					z: 1,
					rot: 0
				},
				mobile: null
			}
		}), n.bytes > 4e5 ? E(Z("status.imageLarge", { kb: Math.round(n.bytes / 1024) }), "error") : E("");
	}
	async function Ah(e) {
		let t = [], n = 0, r = 0;
		for (let i of e) try {
			let e = await Cr(i);
			e.bytes > 4e5 && (r += 1), t.push({
				src: e.dataUrl,
				alt: Da(i.name).replaceAll("-", " "),
				href: null,
				style: {}
			});
		} catch {
			n += 1;
		}
		return {
			images: t,
			failed: n,
			big: r
		};
	}
	function jh(e, t, n) {
		t ? E(Z("status.imagesReadFailed", { n: t }), "error") : n ? E(Z("status.imagesLarge", { n }), "error") : E(e ? "" : Z("status.noImagesAdded"));
	}
	async function Mh(e) {
		let t = [...e.target.files ?? []];
		if (e.target.value = "", !t.length) return;
		E(Z("status.compressingImages"));
		let { images: n, failed: r, big: i } = await Ah(t);
		n.length && Kt("gallery-add", (e) => {
			e.props.images.push(...n);
		}), jh(n.length, r, i);
	}
	async function Nh(e) {
		let t = [...e.target.files ?? []];
		if (e.target.value = "", !t.length) return;
		E(Z("status.compressingImages"));
		let { images: n, failed: r, big: i } = await Ah(t);
		if (!n.length) {
			jh(0, r, i);
			return;
		}
		let a = _h("gallery");
		a.props.images = n, vh(a), jh(n.length, r, i);
	}
	function Ph(e, t) {
		Kt("gallery-move", (n) => {
			let r = e + t;
			r < 0 || r >= n.props.images.length || ([n.props.images[e], n.props.images[r]] = [n.props.images[r], n.props.images[e]]);
		});
	}
	function Fh(e) {
		Kt("gallery-remove", (t) => {
			t.props.images.splice(e, 1);
		});
	}
	function Ih(e, t, n) {
		Kt(`edit:${B(j).blockId}:img${e}-${t}`, (r) => {
			r.props.images[e][t] = n;
		});
	}
	function Lh(e, t, n, r) {
		let i = e?.[t];
		if (!i?.startsWith("data:image/") && !i?.startsWith("data:audio/") && !i?.startsWith("data:video/")) return;
		let a = i.split(",", 2)[1], o = `media/${Da(n || "image")}-${Oa(a)}.${Ea(i)}`;
		r.push({
			path: o,
			content: a,
			encoding: "base64"
		}), e[t] = `/${o}`;
	}
	function Rh(e, t) {
		Lh(e, "image", e.title, t);
		for (let n of e.colors ?? []) Lh(n, "image", `${e.title}-${n.name}`, t);
	}
	function zh(e, t) {
		for (let n of e?.layers ?? []) {
			if (n.type === "image" && Lh(n.props, "src", "background", t), n.type === "slideshow") for (let e of n.props.images ?? []) Lh(e, "src", "background", t);
			n.type === "video" && (Lh(n.props, "src", "video", t), Lh(n.props, "poster", "plakat", t));
		}
	}
	function Bh(e, t) {
		if (e.type === "image" && Lh(e.props, "src", e.props.alt, t), e.type === "icon" && Lh(e.props, "image", "ikon", t), e.type === "gallery") for (let n of e.props.images ?? []) Lh(n, "src", n.alt || "gallery", t);
		e.type === "audio" && Lh(e.props, "src", e.props.title || "lyd", t);
	}
	function Vh(e, t) {
		zh(e.background, t);
		for (let n of e.blocks) Bh(n, t);
	}
	function Hh(e) {
		let t = [];
		e.meta?.og && Lh(e.meta.og, "image", "share", t);
		for (let n of e.sections) Vh(n, t);
		return t;
	}
	function Uh(e) {
		let t = [], n = e.nav?.logo;
		return n?.type === "image" && Lh(n, "value", "logo", t), n?.type === "both" && Lh(n, "image", "logo", t), e.nav?.style && Lh(e.nav.style, "image", "menu", t), zh(e.nav?.style?.background, t), zh(e.footer?.background, t), e.footer?.brand && Lh(e.footer.brand, "logo", "footer-logo", t), Lh(e.site, "icon", "ikon", t), t;
	}
	let Wh = /* @__PURE__ */ N(!1), Gh = /* @__PURE__ */ N(null);
	function Kh() {
		P(Wh, !B(Wh));
	}
	function qh() {
		P(Wh, !1);
		try {
			Jh(), E(Z("ui.discarded"), "info");
		} catch (e) {
			console.error("Urd: discard failed", e), E(String(e?.message ?? e), "error");
		}
	}
	xn(() => {
		if (!B(Wh)) return;
		let e = (e) => {
			if (!B(Gh)?.contains(e.target)) {
				P(Wh, !1);
				return;
			}
			e.target instanceof Element && e.target.closest(".discard-confirm") && (e.preventDefault(), e.stopPropagation(), qh());
		}, t = (e) => {
			e.key === "Escape" && P(Wh, !1);
		}, n = !1, r = (e) => {
			n = !!B(Gh)?.contains(e.target);
		}, i = () => {
			n = !1;
		}, a = () => {
			n || P(Wh, !1);
		};
		return window.addEventListener("pointerdown", r, !0), window.addEventListener("pointerup", i, !0), window.addEventListener("click", e, !0), window.addEventListener("keydown", t, !0), window.addEventListener("blur", a), () => {
			window.removeEventListener("pointerdown", r, !0), window.removeEventListener("pointerup", i, !0), window.removeEventListener("click", e, !0), window.removeEventListener("keydown", t, !0), window.removeEventListener("blur", a);
		};
	});
	function Jh() {
		nt("discard");
		for (let e of B(k).pages) e.id !== B(w) && !qe.has(e.id) && localStorage.removeItem(`urd-draft-${e.id}`);
		let e = O.reset();
		if (He.reset(), xc && (xc.reset(), Kc()), xs) {
			xs.reset(), P(Ts, [...xs.data.samlinger ?? []], !0);
			for (let e of Object.keys(Ss)) B(Ts).includes(e) ? Ss[e].reset() : delete Ss[e];
			qs();
		}
		if (js) {
			js.reset(), P(Fs, [...js.data.maler ?? []], !0);
			for (let e of Object.keys(Ms)) B(Fs).includes(e) ? Ms[e].reset() : (localStorage.removeItem(`urd-draft-template-${e}`), localStorage.removeItem(`urd-draft-mal-${e}`), delete Ms[e]);
			Ls();
		}
		Ge(), P(se, {
			snap: !0,
			...B(k).grid
		}, !0), Ze(), P(ee, ""), Ke(), B(k).pages.some((e) => e.id === B(w)) ? Ue?.sendPage(B(w), e) : Vi(B(k).pages[0].id);
	}
	async function Yh() {
		if (wi) {
			E(Z("status.revertReloadBeforePublish"), "error");
			return;
		}
		if (B(Ni)) {
			E(Z("update.publishBlocked"), "error");
			return;
		}
		E(Z("status.publishing"));
		let e = [], t = [], n = [], r = [];
		for (let i of B(k).pages) {
			let a = `urd-draft-${i.id}`, o = qe.has(i.id) || !B(C).pages.some((e) => e.id === i.id), s = null;
			if (i.id === B(w) && (O.hasDraft() || o)) s = O.data;
			else if (i.id !== B(w)) {
				let e = localStorage.getItem(a);
				if (e) try {
					s = us(JSON.parse(e), He.data);
				} catch {}
			}
			if (!s && o && (s = Bi(i)), !s) continue;
			let c = JSON.parse(JSON.stringify(s));
			e.push(...Hh(c)), e.push({
				path: i.file,
				content: JSON.stringify(c, null, 2) + "\n",
				encoding: "utf-8"
			}), t.push(i.title), o ? r.push(i.id) : n.push(a);
		}
		if (He.hasDraft()) {
			let r = JSON.parse(JSON.stringify(B(k)));
			e.push(...Uh(r)), e.push({
				path: "content/site.json",
				content: JSON.stringify(r, null, 2) + "\n",
				encoding: "utf-8"
			}), e.push({
				path: "content/theme.css",
				content: Ic(r.theme),
				encoding: "utf-8"
			}), n.push("urd-draft-site");
			let i = (e, t) => JSON.stringify(e ?? null) === JSON.stringify(t ?? null);
			i(B(C).theme, B(k).theme) || t.push(Z("publish.part.theme")), i(B(C).nav, B(k).nav) || t.push(Z("publish.part.nav")), i(B(C).footer, B(k).footer) || t.push(Z("publish.part.footer")), i(B(C).pages, B(k).pages) || t.push(Z("publish.part.pages")), i(B(C).grid, B(k).grid) || t.push(Z("publish.part.grid")), (B(C).site.icon ?? null) !== (B(k).site.icon ?? null) && t.push(Z("publish.part.icon"));
			let { icon: a, ...o } = B(C).site, { icon: s, ...c } = B(k).site;
			i(o, c) || t.push(Z("publish.part.siteInfo"));
		}
		let i = Object.entries(Ss).filter(([, e]) => e.hasDraft());
		if (i.length || xs?.hasDraft()) {
			for (let [t, r] of i) {
				let i = JSON.parse(JSON.stringify(r.data));
				for (let t of i.entries) Rh(t, e);
				e.push({
					path: `content/samlinger/${t}.json`,
					content: JSON.stringify(i, null, 2) + "\n",
					encoding: "utf-8"
				}), rc.includes(i.kind) && e.push({
					path: `content/samlinger/${t}.xml`,
					content: ic({
						title: i.name ?? t,
						origin: location.origin,
						path: `/content/samlinger/${t}.xml`,
						items: i.entries.map((e) => ({
							id: e.id,
							title: Qs(e.title),
							text: Qs(e.text),
							date: e.date,
							href: e.href
						}))
					}),
					encoding: "utf-8"
				}), n.push(`urd-draft-samling-${t}`);
			}
			if (xs?.hasDraft()) {
				e.push({
					path: "content/collections.json",
					content: JSON.stringify(xs.data, null, 2) + "\n",
					encoding: "utf-8"
				}), n.push("urd-draft-collections", "urd-draft-samlinger");
				let t = { samlinger: [] };
				try {
					t = await (await fetch("/content/collections.json")).json();
				} catch {}
				let r = new Set(e.map((e) => e.path));
				for (let n of t.samlinger ?? []) {
					let t = `content/samlinger/${n}.json`;
					!B(Ts).includes(n) && !r.has(t) && e.push({
						path: t,
						delete: !0
					});
				}
			}
			t.push(Z("publish.part.collections"));
		}
		let a = Object.entries(Ms).filter(([, e]) => e.hasDraft());
		if (a.length || js?.hasDraft()) {
			for (let [t, r] of a) {
				let i = JSON.parse(JSON.stringify(r.data));
				i.section && Vh(i.section, e);
				for (let t of i.blocks ?? []) Bh(t, e);
				for (let t of i.page?.sections ?? []) Vh(t, e);
				e.push({
					path: `content/maler/${t}.json`,
					content: JSON.stringify(i, null, 2) + "\n",
					encoding: "utf-8"
				}), n.push(`urd-draft-mal-${t}`);
			}
			if (js?.hasDraft()) {
				e.push({
					path: "content/maler.json",
					content: JSON.stringify(js.data, null, 2) + "\n",
					encoding: "utf-8"
				}), n.push("urd-draft-templates", "urd-draft-maler");
				let t = { maler: [] };
				try {
					t = await (await fetch("/content/maler.json")).json();
				} catch {}
				let r = new Set(e.map((e) => e.path));
				for (let n of t.maler ?? []) {
					let t = `content/maler/${n}.json`;
					!B(Fs).includes(n) && !r.has(t) && e.push({
						path: t,
						delete: !0
					});
				}
			}
			t.push(Z("publish.part.templates"));
		}
		xc?.hasDraft() && (e.push({
			path: "plugins/plugins.json",
			content: JSON.stringify(xc.data, null, 2) + "\n",
			encoding: "utf-8"
		}), n.push("urd-draft-plugins"), t.push(Z("publish.part.plugins")));
		try {
			let t = await (await fetch("/index.html")).text();
			for (let n of B(k).pages) n.path !== "/" && e.push({
				path: `${n.path.slice(1)}/index.html`,
				content: t,
				encoding: "utf-8"
			});
		} catch {}
		e.push({
			path: "sitemap.xml",
			content: tc(B(k).pages, location.origin),
			encoding: "utf-8"
		}), e.push({
			path: "robots.txt",
			content: nc(location.origin),
			encoding: "utf-8"
		});
		let o = new Set(e.map((e) => e.path)), s = (t) => {
			o.has(t) || e.push({
				path: t,
				delete: !0
			});
		};
		for (let e of B(C).pages) {
			let t = B(k).pages.find((t) => t.id === e.id);
			t ? t.path !== e.path && e.path !== "/" && s(`${e.path.slice(1)}/index.html`) : (s(e.file), e.path !== "/" && s(`${e.path.slice(1)}/index.html`));
		}
		let c = await gi(e);
		if (!c.ok) {
			E(Z("status.publishAborted"), "error");
			return;
		}
		let l = {
			message: Z("publish.commitMessage", { titles: t.join(", ") || Z("publish.theSite") }),
			files: e,
			...c.head ? { expect: c.head } : {}
		}, u = null;
		try {
			u = await fetch("/api/github/commit", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(l)
			});
		} catch {}
		if (u?.ok) {
			let { sha: t } = await u.json().catch(() => ({}));
			t ? mi = t : hi(), Hh(O.data), Uh(B(k));
			for (let e of n) localStorage.removeItem(e);
			for (let e of r) qe.add(e);
			if (P(C, JSON.parse(JSON.stringify(B(k))), !0), He = Zi("urd-draft-site", () => B(C), re), Ge(), xc) {
				let e = JSON.parse(JSON.stringify(xc.data));
				xc = Zi("urd-draft-plugins", () => e, re), Kc();
			}
			if (xs) {
				for (let e of Object.values(Ss)) for (let t of e.data.entries) Rh(t, []);
				let e = JSON.parse(JSON.stringify(xs.data));
				xs = Zi("urd-draft-collections", () => e, re, "urd-draft-samlinger"), Cs = {};
				for (let e of B(Ts)) {
					if (!Ss[e]) continue;
					let t = JSON.parse(JSON.stringify(Ss[e].data));
					Cs[e] = t, Ss[e] = Zi(`urd-draft-collection-${e}`, () => t, re, `urd-draft-samling-${e}`);
				}
				qs();
			}
			if (js) {
				for (let e of Object.values(Ms)) {
					e.data?.section && Vh(e.data.section, []);
					for (let t of e.data?.blocks ?? []) Bh(t, []);
					for (let t of e.data?.page?.sections ?? []) Vh(t, []);
				}
				let e = JSON.parse(JSON.stringify(js.data));
				js = Zi("urd-draft-templates", () => e, re, "urd-draft-maler"), Ns = {};
				for (let e of B(Fs)) {
					if (!Ms[e]) continue;
					let t = JSON.parse(JSON.stringify(Ms[e].data));
					Ns[e] = t, Ms[e] = Zi(`urd-draft-template-${e}`, () => t, re, `urd-draft-mal-${e}`);
				}
				Ls();
			}
			P(se, {
				snap: !0,
				...B(k).grid
			}, !0);
			let i = JSON.parse(JSON.stringify(O.data));
			O = Zi(`urd-draft-${B(w)}`, () => i, re), qe.has(B(w)) && ie(`urd-draft-${B(w)}`, JSON.stringify(i)), Ze(), E(Z("status.published"), "info"), ki(e);
		} else if (u?.status === 401) {
			let e = await u.json().catch(() => null);
			E(e?.code === "loginExpired" ? Z("status.loginExpired") : Z("status.loginRequired", { reason: Ui(e) ?? Z("status.unknownReason") }), "error"), await pi();
		} else u?.status === 403 ? E(Ui(await u.json().catch(() => null)) ?? Z("status.noPublishAccess"), "error") : u?.status === 409 ? E(Z("status.publishRace"), "error") : E(u ? Ui(await u.json().catch(() => null)) ?? Z("status.publishFailed") : Z("status.publishUnavailable"), "error");
	}
	pt();
	var Xh = em();
	wr("keydown", tn, ft), wr("pointerdown", tn, dt);
	var Zh = I(Xh), Qh = F(Zh), $h = (e) => {
		var t = Cd(), n = F(t);
		K(n, () => _.pencil);
		var r = R(n);
		D(t), z((e, n) => {
			X(t, "title", e), W(r, ` ${n ?? ""}`);
		}, [() => Z("tip.backToEdit"), () => Z("ui.edit")]), V("click", t, nh), U(e, t);
	};
	G(Qh, (e) => {
		B(ce) || e($h);
	});
	var eg = R(Qh, 2);
	let tg;
	var ng = F(eg), rg = F(ng), ig = (e) => {
		var t = Pd(), n = I(t), r = L(n, !0), i = R(n, 2), a = F(i), o = (e) => {
			var t = Ed(), n = F(t);
			let r;
			var i = F(n);
			K(i, () => _[`device_${B(ve)}`]), K(R(i), () => _.caret), D(n);
			var a = R(n, 2), o = (e) => {
				var t = Td();
				Yr(t, 21, () => B(ge), (e) => e.id, (e, t) => {
					var n = wd();
					let r;
					var i = F(n);
					K(i, () => _[`device_${B(t).id}`]);
					var a = R(i);
					D(n), z((e, i) => {
						r = q(n, 1, "ghost svelte-1n46o8q", null, r, { active: B(ve) === B(t).id }), X(n, "title", e), W(a, ` ${i ?? ""}`);
					}, [() => _e(B(t)), () => Z(`lbl.device.${B(t).id}`)]), V("click", n, () => {
						P(ve, B(t).id, !0), P(ea, null);
					}), U(e, n);
				}), D(t), U(e, t);
			};
			G(a, (e) => {
				B(ea) === "device" && e(o);
			}), D(t), z((e) => {
				r = q(n, 1, "ghost svelte-1n46o8q", null, r, { active: B(ea) === "device" }), X(n, "title", e);
			}, [() => Z("lbl.group.device")]), V("click", n, () => P(ea, B(ea) === "device" ? null : "device", !0)), U(e, t);
		}, s = (e) => {
			var t = Od(), n = I(t), r = L(n, !0), i = R(n, 2);
			Yr(i, 21, () => B(ge), (e) => e.id, (e, t) => {
				var n = Dd();
				let r;
				K(n, () => _[`device_${B(t).id}`], !0), D(n), z((e) => {
					r = q(n, 1, "ghost svelte-1n46o8q", null, r, { active: B(ve) === B(t).id }), X(n, "title", e);
				}, [() => _e(B(t))]), V("click", n, () => P(ve, B(t).id, !0)), U(e, n);
			}), D(i), z((e) => W(r, e), [() => Z("lbl.group.device")]), U(e, t);
		};
		G(a, (e) => {
			na.device ? e(o) : e(s, -1);
		});
		var c = R(a, 2), l = (e) => {
			var t = Ad(), n = F(t);
			let r;
			var i = F(n), a = L(i);
			K(R(i), () => _.caret), D(n);
			var o = R(n, 2), s = (e) => {
				var t = kd(), n = F(t), r = F(n);
				K(r, () => _.minus, !0), D(r);
				var i = R(r, 2), a = L(i), o = R(i, 2);
				K(o, () => _.plus, !0), D(o), D(n);
				var s = R(n, 2);
				let c;
				var l = F(s);
				K(l, () => _.fit);
				var u = R(l);
				D(s), D(t), z((e, t, n, l, d, f) => {
					X(r, "title", e), X(i, "title", t), W(a, `${n ?? ""}%`), X(o, "title", l), c = q(s, 1, "ghost svelte-1n46o8q", null, c, { active: B(we) === "fit" }), X(s, "title", d), W(u, ` ${f ?? ""}`);
				}, [
					() => Z("tip.zoomOut"),
					() => Z("tip.zoomCurrent"),
					() => Math.round(B(Ae) * 100),
					() => Z("tip.zoomIn"),
					() => Z("tip.zoomFit"),
					() => Z("lbl.zoom.fit")
				]), V("click", r, () => je(-1)), V("click", o, () => je(1)), V("click", s, () => P(we, "fit")), U(e, t);
			};
			G(o, (e) => {
				B(ea) === "zoom" && e(s);
			}), D(t), z((e, t) => {
				r = q(n, 1, "ghost svelte-1n46o8q", null, r, { active: B(ea) === "zoom" }), X(n, "title", e), W(a, `${t ?? ""}%`);
			}, [() => Z("lbl.group.zoom"), () => Math.round(B(Ae) * 100)]), V("click", n, () => P(ea, B(ea) === "zoom" ? null : "zoom", !0)), U(e, t);
		}, u = (e) => {
			var t = jd(), n = I(t), r = L(n, !0), i = R(n, 2), a = F(i);
			K(a, () => _.minus, !0), D(a);
			var o = R(a, 2), s = L(o), c = R(o, 2);
			K(c, () => _.plus, !0), D(c);
			var l = R(c, 2);
			let u;
			K(l, () => _.fit, !0), D(l), D(i), z((e, t, n, i, d, f) => {
				W(r, e), X(a, "title", t), X(o, "title", n), W(s, `${i ?? ""}%`), X(c, "title", d), u = q(l, 1, "ghost svelte-1n46o8q", null, u, { active: B(we) === "fit" }), X(l, "title", f);
			}, [
				() => Z("lbl.group.zoom"),
				() => Z("tip.zoomOut"),
				() => Z("tip.zoomCurrent"),
				() => Math.round(B(Ae) * 100),
				() => Z("tip.zoomIn"),
				() => Z("tip.zoomFit")
			]), V("click", a, () => je(-1)), V("click", c, () => je(1)), V("click", l, () => P(we, "fit")), U(e, t);
		};
		G(c, (e) => {
			na.zoom ? e(l) : e(u, -1);
		});
		var d = R(c, 2), f = (e) => {
			var t = Ed(), n = F(t);
			let r;
			var i = F(n);
			K(i, () => _.gridToggle), K(R(i), () => _.caret), D(n);
			var a = R(n, 2), o = (e) => {
				var t = Md(), n = F(t);
				let r;
				var i = F(n);
				K(i, () => _.gridToggle);
				var a = R(i);
				D(n);
				var o = R(n, 2);
				let s;
				var c = F(o);
				K(c, () => _.guides);
				var l = R(c);
				D(o), D(t), z((e, t, i, c) => {
					r = q(n, 1, "ghost svelte-1n46o8q", null, r, { active: B(ia) }), X(n, "title", e), W(a, ` ${t ?? ""}`), s = q(o, 1, "ghost svelte-1n46o8q", null, s, { active: B(Ki) }), X(o, "title", i), W(l, ` ${c ?? ""}`);
				}, [
					() => Z("tip.gridToggle"),
					() => Z("lbl.view.grid"),
					() => Z("tip.guides"),
					() => Z("lbl.view.guides")
				]), V("click", n, aa), V("click", o, ra), U(e, t);
			};
			G(a, (e) => {
				B(ea) === "view" && e(o);
			}), D(t), z((e) => {
				r = q(n, 1, "ghost svelte-1n46o8q", null, r, { active: B(ea) === "view" || B(ia) || B(Ki) }), X(n, "title", e);
			}, [() => Z("lbl.group.view")]), V("click", n, () => P(ea, B(ea) === "view" ? null : "view", !0)), U(e, t);
		}, p = (e) => {
			var t = Nd(), n = I(t), r = L(n, !0), i = R(n, 2), a = F(i);
			let o;
			K(a, () => _.gridToggle, !0), D(a);
			var s = R(a, 2);
			let c;
			K(s, () => _.guides, !0), D(s), D(i), z((e, t, n) => {
				W(r, e), o = q(a, 1, "ghost svelte-1n46o8q", null, o, { active: B(ia) }), X(a, "title", t), c = q(s, 1, "ghost svelte-1n46o8q", null, c, { active: B(Ki) }), X(s, "title", n);
			}, [
				() => Z("lbl.group.view"),
				() => Z("tip.gridToggle"),
				() => Z("tip.guides")
			]), V("click", a, aa), V("click", s, ra), U(e, t);
		};
		G(d, (e) => {
			na.view ? e(f) : e(p, -1);
		}), D(i), Ai(i, (e) => P(ta, e), () => B(ta)), z((e, t) => {
			X(n, "title", e), W(r, t);
		}, [() => Z("tip.switchPage"), () => Xe()?.title ?? ""]), V("click", n, () => Lt("pages")), U(e, t);
	};
	G(rg, (e) => {
		B(C) && e(ig);
	});
	var ag = R(rg, 2), og = (e) => {
		var t = Fd(), n = F(t);
		K(n, () => _.phone);
		var r = R(n, 2), i = L(r, !0), a = L(R(r, 2), !0);
		D(t), z((e, n) => {
			X(t, "title", e), W(i, n), W(a, B(Ie));
		}, [() => Z("tip.attention"), () => Z(B(Ie) === 1 ? "ui.attentionOne" : "ui.attentionMany", { n: B(Ie) })]), V("click", t, Re), U(e, t);
	};
	G(ag, (e) => {
		B(Ie) > 0 && e(og);
	}), D(ng);
	var sg = R(ng, 2), cg = F(sg), lg = (e) => {
		var t = Ld(), n = F(t), r = L(F(n), !0);
		Oe(2), D(n);
		var i = R(n, 2), a = F(i);
		let o;
		var s = F(a);
		K(s, () => _.restore);
		var c = L(R(s), !0);
		D(a);
		var l = R(a, 2), u = (e) => {
			var t = Id(), n = F(t);
			K(n, () => _.restore);
			var r = R(n);
			D(t), z((e, n) => {
				X(t, "title", e), W(r, ` ${n ?? ""}`);
			}, [() => Z("tip.discardArmed"), () => Z("ui.discardConfirm")]), V("click", t, qh), U(e, t);
		};
		G(l, (e) => {
			B(Wh) && e(u);
		}), D(i), Ai(i, (e) => P(Gh, e), () => B(Gh)), D(t), z((e, t, i, s, l) => {
			X(n, "title", e), X(n, "aria-label", t), W(r, i), o = q(a, 1, "discard-dot svelte-1n46o8q", null, o, { armed: B(Wh) }), X(a, "title", s), W(c, l);
		}, [
			() => Z("ui.unpublished"),
			() => Z("ui.unpublished"),
			() => Z("ui.unpublished"),
			() => B(Wh) ? Z("tip.discardArmed") : Z("tip.discard"),
			() => Z("ui.discard")
		]), V("click", a, Kh), li(2, t, () => Xi, () => ({
			x: 24,
			duration: Ht ? 0 : 150
		})), U(e, t);
	};
	G(cg, (e) => {
		B(T) && e(lg);
	}), D(sg);
	var ug = R(sg, 2), dg = F(ug), fg = (e) => {
		var t = Vd(), n = I(t), r = F(n), i = (e) => {
			var t = Rd(), n = I(t);
			K(n, () => _.eye);
			var r = L(R(n, 2), !0);
			z((e) => W(r, e), [() => Z("ui.cleanView")]), U(e, t);
		}, a = (e) => {
			var t = Rd(), n = I(t);
			K(n, () => _.pencil);
			var r = L(R(n, 2), !0);
			z((e) => W(r, e), [() => Z("ui.edit")]), U(e, t);
		};
		G(r, (e) => {
			B(ce) ? e(i) : e(a, -1);
		}), D(n);
		var o = R(n, 2), s = (e) => {
			var t = zd(), n = F(t), r = (e) => {
				var t = Pr();
				K(I(t), () => _.warn), U(e, t);
			};
			G(n, (e) => {
				B(oe).allowed || e(r);
			});
			var i = R(n, 1, !0);
			D(t), z((e) => {
				X(t, "title", e), W(i, B(oe).login);
			}, [() => B(oe).allowed ? Z("tip.hasPublishAccess") : Z("tip.noPublishAccess")]), U(e, t);
		}, c = (e) => {
			var t = Bd(), n = L(t, !0);
			z((e) => W(n, e), [() => Z("ui.loginGitHub")]), U(e, t);
		};
		G(o, (e) => {
			B(oe)?.loggedIn ? e(s) : B(oe) && e(c, 1);
		});
		var l = R(o, 2), u = F(l);
		K(u, () => _.external);
		var d = L(R(u, 2), !0);
		D(l);
		var f = R(l, 2), p = L(f, !0);
		z((e, t, r, i, a) => {
			X(n, "title", e), X(l, "href", t), X(l, "title", r), W(d, i), f.disabled = !B(T), W(p, a);
		}, [
			() => B(ce) ? Z("tip.chromeHide") : Z("tip.chromeShow"),
			() => Xe()?.path ?? "/",
			() => Z("ui.viewSite"),
			() => Z("ui.viewSite"),
			() => Z("ui.publish")
		]), V("click", n, nh), V("click", f, Yh), U(e, t);
	};
	G(dg, (e) => {
		B(C) && e(fg);
	}), D(ug), D(eg);
	var pg = R(eg, 2), mg = (e) => {
		var t = qp(), i = F(t), o = (e) => {
			var t = Kp(), i = I(t), o = F(i);
			Yr(o, 17, () => Et, Gr, (e, t, n) => {
				var r = Ud(), i = I(r), a = L(i, !0);
				Yr(R(i, 2), 16, () => B(t), (e) => e, (e, t) => {
					var n = Hd();
					let r;
					var i = L(n, !0);
					z(() => {
						r = q(n, 1, "svelte-1n46o8q", null, r, { active: B(Tt) === t }), W(i, Ot[t]);
					}), V("click", n, () => Lt(t)), U(e, n);
				}), z((e) => W(a, e), [() => Z(Dt[n])]), U(e, r);
			});
			var l = R(o, 2), m = R(F(l), 2);
			let g;
			K(m, () => _.gear, !0), D(m);
			var y = R(m, 2), x = (e) => {
				var t = Kd(), n = F(t), r = L(n, !0), i = R(n, 2), a = F(i);
				Q(R(a), {
					get value() {
						return B(b);
					},
					get options() {
						return v;
					},
					onchange: (e) => P(b, e, !0)
				}), D(i);
				var o = R(i, 2), s = F(o), c = R(s);
				{
					let e = /* @__PURE__ */ A(() => [["auto", Z("lang.auto")], ...Nt()]);
					Q(c, {
						get value() {
							return Ft;
						},
						get options() {
							return B(e);
						},
						onchange: It
					});
				}
				D(o);
				var l = R(o, 2), u = F(l), d = R(u);
				{
					let e = /* @__PURE__ */ A(() => [["strip", Z("settings.layoutPickerStrip")], ["menu", Z("settings.layoutPickerMenu")]]);
					Q(d, {
						get value() {
							return B(Ji);
						},
						get options() {
							return B(e);
						},
						onchange: Yi
					});
				}
				D(l);
				var f = R(l, 2), p = L(f, !0), m = R(f, 2), h = F(m);
				let g;
				var _ = L(h, !0), y = R(h, 2);
				let x;
				var S = L(y, !0);
				D(m);
				var C = R(m, 2), w = (e) => {
					var t = Wd(), n = F(t), r = L(n, !0), i = R(n, 2);
					J(i);
					var a = R(i, 2), o = L(a, !0), s = R(a, 2);
					J(s), D(t), z((e, t, n, a) => {
						W(r, e), X(i, "min", 640), X(i, "max", co), X(i, "title", t), Y(i, B(fe).width), W(o, n), X(s, "max", lo), X(s, "title", a), Y(s, B(fe).height || "");
					}, [
						() => Z("lbl.screen.w"),
						() => Z("tip.screen.width", {
							min: 640,
							max: co
						}),
						() => Z("lbl.screen.h"),
						() => Z("tip.screen.height", {
							min: 480,
							max: lo
						})
					]), V("change", i, (e) => {
						pe({ width: Number(e.target.value) }), e.target.value = B(fe).width;
					}), V("change", s, (e) => {
						pe({ height: Number(e.target.value) }), e.target.value = B(fe).height || "";
					}), U(e, t);
				};
				G(C, (e) => {
					B(fe).mode === "custom" && e(w);
				});
				var T = R(C, 2), ee = (e) => {
					var t = Gd(), n = I(t), r = L(n, !0), i = R(n, 2), a = F(i), o = R(a);
					J(o), D(i), z((e, t, s, c, l) => {
						X(n, "title", e), W(r, t), X(i, "title", s), W(a, `${c ?? ""} `), X(o, "placeholder", l), Y(o, B(k).analytics?.token ?? "");
					}, [
						() => Z("tip.analytics"),
						() => Z("settings.analytics"),
						() => Z("tip.analytics"),
						() => Z("lbl.analyticsToken"),
						() => Z("ph.analyticsToken")
					]), V("change", o, (e) => Xa(e.target.value)), U(e, t);
				};
				G(T, (e) => {
					B(k) && e(ee);
				}), D(t), z((e, t, n, c, d, v, b, C, w, T, ee, te) => {
					W(r, e), X(i, "title", t), W(a, `${n ?? ""} `), X(o, "title", c), W(s, `${d ?? ""} `), X(l, "title", v), W(u, `${b ?? ""} `), X(f, "title", C), W(p, w), X(m, "title", T), g = q(h, 1, "svelte-1n46o8q", null, g, { on: B(fe).mode === "own" }), W(_, ee), x = q(y, 1, "svelte-1n46o8q", null, x, { on: B(fe).mode === "custom" }), W(S, te);
				}, [
					() => Z("settings.title"),
					() => Z("topbar.adminTheme.title"),
					() => Z("settings.theme"),
					() => Z("topbar.language.title"),
					() => Z("settings.language"),
					() => Z("tip.settings.layoutPicker"),
					() => Z("settings.layoutPicker"),
					() => Z("tip.screen.mode"),
					() => Z("settings.screen"),
					() => Z("tip.screen.mode"),
					() => Z("lbl.screen.own"),
					() => Z("lbl.screen.size")
				]), V("click", h, () => pe({ mode: "own" })), V("click", y, () => pe({ mode: "custom" })), U(e, t);
			};
			G(y, (e) => {
				B(qi) && e(x);
			}), D(l), Ai(l, (e) => P(Qi, e), () => B(Qi)), D(i);
			var C = R(i, 2), T = (e) => {
				var t = Gp(), i = F(t), o = F(i), l = L(o, !0), m = R(o, 2), g = (e) => {
					var t = qd();
					let n;
					K(t, () => _.foldToggle, !0), D(t), z((e, r) => {
						n = q(t, 1, "fold-all fold-toggle svelte-1n46o8q", null, n, { collapse: B(Pm) }), X(t, "title", e), X(t, "aria-label", r);
					}, [() => Z(B(Pm) ? "ui.collapseAll" : "ui.expandAll"), () => Z(B(Pm) ? "ui.collapseAll" : "ui.expandAll")]), V("click", t, Lm), U(e, t);
				};
				G(m, (e) => {
					B(Nm) && e(g);
				}), D(i);
				var v = R(i, 2), y = (e) => {
					var t = af(), n = F(t);
					Yr(n, 17, () => B(k).pages, (e) => e.id, (e, t) => {
						var n = $d();
						let r;
						var i = F(n);
						J(i);
						var a = R(i, 2), o = (e) => {
							var t = Jd();
							z((e) => X(t, "title", e), [() => Z("tip.pages.homeLocked")]), U(e, t);
						}, s = (e) => {
							var n = Yd();
							J(n), z((e, t) => {
								Y(n, e), X(n, "title", t);
							}, [() => B(t).path.slice(1), () => Z("tip.pages.slug")]), V("change", n, (e) => Ia(B(t), e.target.value)), U(e, n);
						};
						G(a, (e) => {
							B(t).path === "/" ? e(o) : e(s, -1);
						});
						var c = R(a, 2), l = (e) => {
							var t = Xd();
							K(t, () => _.warn, !0), D(t), z((e) => X(t, "title", e), [() => Z("tip.pages.missingDescription")]), U(e, t);
						};
						G(c, (e) => {
							B(ja)[B(t).id] && e(l);
						});
						var u = R(c, 2), d = F(u);
						K(d, () => _.right, !0), D(d);
						var f = R(d, 2), p = F(f);
						K(p, () => _.kebab, !0), D(p);
						var m = R(p, 2), h = (e) => {
							var n = Qd(), r = F(n), i = F(r);
							K(i, () => _.bookmark);
							var a = R(i);
							D(r);
							var o = R(r, 2), s = (e) => {
								var n = Zd(), r = F(n);
								K(r, () => _.cross);
								var i = R(r);
								D(n), z((e, t) => {
									X(n, "title", e), W(i, ` ${t ?? ""}`);
								}, [() => Z("tip.pages.delete"), () => Z("ui.deletePage")]), V("click", n, () => {
									P(fa, null), La(B(t));
								}), U(e, n);
							};
							G(o, (e) => {
								B(t).path !== "/" && e(s);
							}), D(n), z((e) => W(a, ` ${e ?? ""}`), [() => Z("ui.savePageTemplate")]), V("click", r, () => _a(B(t))), U(e, n);
						};
						G(m, (e) => {
							B(fa) === B(t).id && e(h);
						}), D(f), D(u), D(n), z((e, a, o) => {
							r = q(n, 1, "page-row svelte-1n46o8q", null, r, { current: B(t).id === B(w) }), Y(i, B(t).title), X(i, "title", e), X(d, "title", a), d.disabled = B(t).id === B(w), X(p, "title", o);
						}, [
							() => Z("tip.pages.title"),
							() => Z("tip.pages.open"),
							() => Z("tip.pages.menu")
						]), V("change", i, (e) => va(B(t), e.target.value)), V("click", d, () => Vi(B(t).id)), V("click", p, () => P(fa, B(fa) === B(t).id ? null : B(t).id, !0)), U(e, n);
					});
					var r = R(n, 2), i = F(r), a = L(i, !0), o = R(i, 2), s = F(o), c = F(s), l = R(c);
					ut(l), D(s);
					var u = R(s, 2), d = F(u), f = R(d);
					J(f), D(u);
					var p = R(u, 2), m = F(p), h = R(m);
					ut(h), D(p);
					var g = R(p, 2), v = F(g), y = R(v), b = (e) => {
						var t = ef();
						z((e) => {
							X(t, "src", B(xa).ogImage), X(t, "alt", e);
						}, [() => Z("lbl.ogImage")]), U(e, t);
					};
					G(y, (e) => {
						B(xa).ogImage && e(b);
					}), D(g);
					var x = R(g, 2), S = F(x), C = F(S), T = R(C);
					D(S);
					var ee = R(S, 2), te = (e) => {
						var t = Jl();
						K(t, () => _.cross, !0), D(t), z((e) => X(t, "title", e), [() => Z("tip.seo.removeOgImage")]), V("click", t, () => ka("ogImage", "")), U(e, t);
					};
					G(ee, (e) => {
						B(xa).ogImage && e(te);
					}), D(x);
					var ne = R(x, 2), E = F(ne);
					J(E);
					var re = R(E);
					D(ne), D(o), D(r);
					var ie = R(r, 4);
					J(ie);
					var ae = R(ie, 2), oe = L(ae, !0), se = R(ae, 2), ce = L(se, !0), le = R(se, 2), ue = F(le);
					let de;
					var fe = F(ue), pe = F(fe);
					K(pe, () => Tc({ sections: [] }), !0), D(pe);
					var me = L(R(pe, 2), !0);
					D(fe), D(ue), Yr(R(ue, 2), 17, () => Dc, (e) => e.id, (e, t) => {
						var n = tf();
						let r;
						var i = F(n), a = F(i);
						K(a, () => ua[B(t).id], !0), D(a);
						var o = L(R(a, 2), !0);
						D(i), D(n), z((e, a) => {
							r = q(n, 1, "page-template-card svelte-1n46o8q", null, r, { picked: B(la) === `preset:${B(t).id}` }), X(i, "title", e), W(o, a);
						}, [() => Z("tip.pages.templatePick", { name: Z(B(t).labelKey) }), () => Z(B(t).labelKey)]), V("click", i, () => P(la, B(la) === `preset:${B(t).id}` ? null : `preset:${B(t).id}`, !0)), U(e, n);
					}), D(le);
					var he = R(le, 2), ge = (e) => {
						var t = rf(), n = I(t), r = L(n, !0), i = R(n, 2);
						Yr(i, 20, () => B(Fs).filter((e) => Ms[e]?.data?.mal?.kind === "page"), (e) => e, (e, t) => {
							var n = nf();
							let r;
							var i = F(n), a = F(i);
							K(a, () => Tc(Ms[t].data.page), !0), D(a);
							var o = L(R(a, 2), !0);
							D(i);
							var s = R(i, 2);
							K(s, () => _.cross, !0), D(s), D(n), z((e, a) => {
								r = q(n, 1, "page-template-card svelte-1n46o8q", null, r, { picked: B(la) === t }), X(i, "title", e), W(o, Ms[t].data.mal.name), X(s, "title", a);
							}, [() => Z("tip.pages.templatePick", { name: Ms[t].data.mal.name }), () => Z("canvas.deleteTemplate")]), V("click", i, () => P(la, B(la) === t ? null : t, !0)), V("click", s, () => Hs({ id: t })), U(e, n);
						}), D(i), z((e) => {
							W(r, e), _i(i, B(da));
						}, [() => Z("canvas.tabMyTemplates")]), U(e, t);
					}, _e = /* @__PURE__ */ A(() => B(Fs).some((e) => Ms[e]?.data?.mal?.kind === "page"));
					G(he, (e) => {
						B(_e) && e(ge);
					}), D(t), z((e, t, n, r, i, o, _, y, b, x, w, T, ee, te, se, pe, he, ge, _e, ve, ye, be) => {
						W(a, e), X(s, "title", t), W(c, `${n ?? ""} `), Y(l, B(xa).description), X(u, "title", r), W(d, `${i ?? ""} `), Y(f, B(xa).ogTitle), X(f, "placeholder", o), X(p, "title", _), W(m, `${y ?? ""} `), Y(h, B(xa).ogDescription), X(h, "placeholder", B(xa).description), X(g, "title", b), W(v, `${x ?? ""} `), X(S, "title", w), W(C, `${T ?? ""} `), X(ne, "title", ee), Si(E, te), W(re, ` ${se ?? ""}`), X(ie, "placeholder", pe), X(ae, "title", he), ae.disabled = ge, W(oe, _e), W(ce, ve), _i(le, B(da)), de = q(ue, 1, "page-template-card svelte-1n46o8q", null, de, { picked: B(la) === null }), X(fe, "title", ye), W(me, be);
					}, [
						() => Z("ui.seoGroup", { page: B(k).pages.find((e) => e.id === B(w))?.title ?? "" }),
						() => Z("tip.seo.description"),
						() => Z("lbl.seoDescription"),
						() => Z("tip.seo.ogTitle"),
						() => Z("lbl.ogTitle"),
						() => B(k).pages.find((e) => e.id === B(w))?.title ?? "",
						() => Z("tip.seo.ogDescription"),
						() => Z("lbl.ogDescription"),
						() => Z("tip.seo.ogImage"),
						() => Z("lbl.ogImage"),
						() => Z("tip.seo.ogImage"),
						() => B(xa).ogImage ? Z("ui.changeImage") : Z("ui.chooseImage"),
						() => Z("tip.seo.hideFromSearch"),
						() => B(k).pages.find((e) => e.id === B(w))?.noindex === !0,
						() => Z("lbl.hideFromSearch"),
						() => Z("ph.newPageName"),
						() => Z("hint.pages.autoMenu"),
						() => !B(ca).trim(),
						() => Z("ui.createPage"),
						() => Z("canvas.tabPresets"),
						() => Z("tip.pages.blankPick"),
						() => Z("ui.blankPage")
					]), V("change", l, (e) => ka("description", e.target.value)), V("change", f, (e) => ka("ogTitle", e.target.value)), V("change", h, (e) => ka("ogDescription", e.target.value)), V("change", T, Na), V("change", E, (e) => Aa(e.target.checked)), V("keydown", ie, (e) => e.key === "Enter" && ga()), Ei(ie, () => B(ca), (e) => P(ca, e)), V("click", ae, ga), V("click", fe, () => P(la, null)), U(e, t);
				}, b = (e) => {
					var t = Ff(), r = F(t), i = F(r), a = L(i, !0), o = R(i, 2), l = F(o);
					{
						let e = /* @__PURE__ */ A(() => Z("common.type")), t = /* @__PURE__ */ A(() => B(k).nav.logo?.type ?? "text"), n = /* @__PURE__ */ A(() => [
							["text", Z("blocks.text")],
							["image", Z("blocks.image")],
							["both", Z("opt.logo.both")]
						]);
						Yo(l, {
							get label() {
								return B(e);
							},
							get value() {
								return B(t);
							},
							get options() {
								return B(n);
							},
							onchange: (e) => za(e)
						});
					}
					var m = R(l, 2), g = (e) => {
						var t = of(), n = I(t);
						J(n);
						var r = R(n, 2), i = F(r);
						{
							let e = /* @__PURE__ */ A(() => Z("tip.nav.logoFont")), t = /* @__PURE__ */ A(() => B(k).nav.logo?.font ?? ""), n = /* @__PURE__ */ A(() => [["", Z("common.inherit")], ...Gl.map(([e, t]) => [t, Z(e)])]);
							Q(i, {
								get title() {
									return B(e);
								},
								get value() {
									return B(t);
								},
								get options() {
									return B(n);
								},
								onchange: (e) => Ra({ font: e || void 0 })
							});
						}
						var a = R(i, 2);
						J(a);
						var o = R(a, 2);
						let s;
						var c = L(F(o), !0);
						D(o);
						var l = R(o, 2);
						let u;
						var d = L(F(l), !0);
						D(l), D(r), z((e, t, r, i, f, p, m) => {
							Y(n, B(k).nav.logo?.value ?? ""), X(n, "placeholder", e), X(a, "title", t), Y(a, B(k).nav.logo?.textSize ?? ""), s = q(o, 1, "tbtn svelte-1n46o8q", null, s, { active: B(k).nav.logo?.bold !== !1 }), X(o, "title", r), W(c, i), u = q(l, 1, "tbtn svelte-1n46o8q", null, u, { active: f }), X(l, "title", p), W(d, m);
						}, [
							() => Z("ph.nav.logoName"),
							() => Z("tip.nav.textSize"),
							() => Z("format.bold"),
							() => Z("format.boldLetter"),
							() => !!B(k).nav.logo?.italic,
							() => Z("format.italic"),
							() => Z("format.italicLetter")
						]), V("input", n, (e) => Ra({ value: e.target.value })), V("change", a, (e) => Ra({ textSize: e.target.value ? Number(e.target.value) : void 0 })), V("click", o, () => Ra({ bold: B(k).nav.logo?.bold === !1 })), V("click", l, () => Ra({ italic: !B(k).nav.logo?.italic })), U(e, t);
					};
					G(m, (e) => {
						(B(k).nav.logo?.type ?? "text") !== "image" && e(g);
					});
					var v = R(m, 2), y = (e) => {
						let t = /* @__PURE__ */ A(() => B(k).nav.logo?.type === "image" ? B(k).nav.logo?.value : B(k).nav.logo?.image);
						var n = lf(), r = I(n), i = F(r), a = F(i), o = (e) => {
							var n = sf();
							z(() => X(n, "src", B(t))), U(e, n);
						};
						G(a, (e) => {
							B(t) && e(o);
						}), D(i);
						var s = R(i, 2), c = F(s), l = F(c), u = R(l);
						D(c);
						var d = R(c, 2), f = (e) => {
							var n = cf(), r = L(n, !0);
							z((e) => W(r, e), [() => B(t).split("/").pop()]), U(e, n);
						};
						G(d, (e) => {
							B(t) && e(f);
						}), D(s), D(r);
						var p = R(r, 2), m = F(p), h = F(m), g = L(h, !0), _ = R(h, 2);
						J(_), D(m);
						var v = R(m, 2), y = F(v), b = L(y, !0), x = R(y, 2);
						J(x), D(v);
						var S = R(v, 2), C = F(S), w = L(C, !0), T = R(C, 2);
						J(T), D(S), D(p), z((e, t, n, r, i, a, o, s, u) => {
							X(c, "title", e), W(l, `${t ?? ""} `), X(m, "title", n), W(g, r), Y(_, B(k).nav.logo?.size ?? 32), X(v, "title", i), W(b, a), X(x, "min", No.min), X(x, "max", No.max), X(x, "placeholder", o), Y(x, B(k).nav.logo?.mobileSize ?? ""), X(S, "title", s), W(w, u), Y(T, B(k).nav.logo?.radius ?? 0);
						}, [
							() => Z("tip.webpAuto"),
							() => B(t) ? Z("ui.changeImage") : Z("ui.chooseImage"),
							() => Z("tip.nav.logoHeight"),
							() => Z("lbl.height"),
							() => Z("tip.nav.logoHeightMobile"),
							() => Z("lbl.onMobile"),
							() => Z("lbl.navSameAsDesktop"),
							() => Z("tip.nav.logoRadius"),
							() => Z("lbl.rounding")
						]), V("change", u, Ba), V("change", _, (e) => Ra({ size: Number(e.target.value) })), V("change", x, (e) => {
							let t = e.target.value;
							Ra({ mobileSize: t === "" ? void 0 : Ro(t, No, void 0) }), e.target.value = B(k).nav.logo?.mobileSize ?? "";
						}), V("change", T, (e) => Ra({ radius: Number(e.target.value) })), U(e, n);
					};
					G(v, (e) => {
						(B(k).nav.logo?.type ?? "text") !== "text" && e(y);
					});
					var b = R(v, 2), x = (e) => {
						{
							let t = /* @__PURE__ */ A(() => Z("lbl.order")), n = /* @__PURE__ */ A(() => B(k).nav.logo?.order ?? "image-first"), r = /* @__PURE__ */ A(() => [["image-first", Z("opt.logo.imageFirst")], ["text-first", Z("opt.logo.textFirst")]]);
							Yo(e, {
								get label() {
									return B(t);
								},
								get value() {
									return B(n);
								},
								get options() {
									return B(r);
								},
								onchange: (e) => Ra({ order: e })
							});
						}
					};
					G(b, (e) => {
						B(k).nav.logo?.type === "both" && e(x);
					}), D(o), D(r);
					var S = R(r, 2), C = F(S), w = L(C, !0), T = R(C, 2), ee = F(T), te = F(ee), ne = L(te, !0), E = R(te, 2), re = F(E), ie = F(re), ae = L(ie, !0), oe = R(ie, 2);
					Yr(oe, 21, () => [
						["bar", Z("opt.navVariant.bar")],
						["floating", Z("opt.navVariant.floating")],
						["floating-square", Z("opt.navVariant.floatingSquare")],
						["floating-tab", Z("opt.navVariant.floatingTab")],
						["side-left", Z("opt.navVariant.sideLeft")],
						["side-right", Z("opt.navVariant.sideRight")]
					], ([e, t]) => e, (e, t) => {
						var n = /* @__PURE__ */ A(() => h(B(t), 2));
						let r = () => B(n)[0], i = () => B(n)[1];
						var a = uf();
						let o;
						var c = F(a);
						K(c, () => s[r()]);
						var l = L(R(c), !0);
						D(a), z(() => {
							o = q(a, 1, "tile svelte-1n46o8q", null, o, { on: (B(k).nav.variant ?? "bar") === r() }), X(a, "aria-pressed", (B(k).nav.variant ?? "bar") === r()), W(l, i());
						}), V("click", a, () => $(r())), U(e, a);
					}), D(oe), D(re);
					var se = R(re, 2), ce = (e) => {
						var t = df(), n = I(t);
						{
							let e = /* @__PURE__ */ A(() => Z("lbl.toolsSide")), t = /* @__PURE__ */ A(() => Z("tip.nav.toolsSideColumn")), r = /* @__PURE__ */ A(() => B(k).nav.style?.tools?.side ?? "end"), i = /* @__PURE__ */ A(() => [["start", Z("opt.toolsSide.top")], ["end", Z("opt.toolsSide.bottom")]]);
							Yo(n, {
								get label() {
									return B(e);
								},
								get title() {
									return B(t);
								},
								get value() {
									return B(r);
								},
								get options() {
									return B(i);
								},
								onchange: (e) => Ko("side", e === "start" ? "start" : void 0)
							});
						}
						var r = R(n, 2);
						{
							let e = /* @__PURE__ */ A(() => Z("lbl.toolsAlign")), t = /* @__PURE__ */ A(() => Z("tip.nav.toolsAlign")), n = /* @__PURE__ */ A(() => B(k).nav.style?.tools?.align ?? "center"), i = /* @__PURE__ */ A(() => [
								["start", Z("opt.toolsAlign.start")],
								["center", Z("opt.toolsAlign.center")],
								["end", Z("opt.toolsAlign.end")],
								["spread", Z("opt.toolsAlign.spread")]
							]);
							Yo(r, {
								get label() {
									return B(e);
								},
								get title() {
									return B(t);
								},
								get value() {
									return B(n);
								},
								get options() {
									return B(i);
								},
								onchange: (e) => Ko("align", e === "center" ? void 0 : e)
							});
						}
						U(e, t);
					}, le = (e) => {
						{
							let t = /* @__PURE__ */ A(() => Z("lbl.toolsSide")), n = /* @__PURE__ */ A(() => Z("tip.nav.toolsSide")), r = /* @__PURE__ */ A(() => B(k).nav.style?.tools?.side ?? "end"), i = /* @__PURE__ */ A(() => [["start", Z("opt.toolsSide.start")], ["end", Z("opt.toolsSide.end")]]);
							Yo(e, {
								get label() {
									return B(t);
								},
								get title() {
									return B(n);
								},
								get value() {
									return B(r);
								},
								get options() {
									return B(i);
								},
								onchange: (e) => Ko("side", e === "start" ? "start" : void 0)
							});
						}
					};
					G(se, (e) => {
						B(Jo) ? e(ce) : e(le, -1);
					});
					var ue = R(se, 2), de = (e) => {
						var t = pf(), n = I(t);
						{
							let e = /* @__PURE__ */ A(() => Z("lbl.navPillWidth")), t = /* @__PURE__ */ A(() => Z("tip.nav.pillWidth")), r = /* @__PURE__ */ A(() => B(k).nav.style?.pillWidth === "content" ? "content" : "custom"), i = /* @__PURE__ */ A(() => [["content", Z("opt.pillWidth.content")], ["custom", Z("opt.pillWidth.custom")]]);
							Yo(n, {
								get label() {
									return B(e);
								},
								get title() {
									return B(t);
								},
								get value() {
									return B(r);
								},
								get options() {
									return B(i);
								},
								onchange: (e) => qo("pillWidth", e === "content" ? "content" : void 0)
							});
						}
						var r = R(n, 2), i = (e) => {
							var t = ff(), n = F(t), r = L(n, !0), i = R(n, 2);
							J(i), D(t), z((e, n) => {
								X(t, "title", e), W(r, n), X(i, "min", ko.min), X(i, "max", ko.max), X(i, "step", ko.step), Y(i, typeof B(k).nav.style?.pillWidth == "number" ? B(k).nav.style.pillWidth : "");
							}, [() => Z("tip.nav.pillWidthPx"), () => Z("lbl.navPillWidthPx")]), V("change", i, (e) => rs(e, "pillWidth", ko)), U(e, t);
						};
						G(r, (e) => {
							B(k).nav.style?.pillWidth !== "content" && e(i);
						});
						var a = R(r, 2), o = F(a), s = L(o, !0), c = R(o, 2);
						J(c), D(a), z((e, t) => {
							X(a, "title", e), W(s, t), X(c, "min", jo.min), X(c, "max", jo.max), X(c, "step", jo.step), X(c, "placeholder", B(k).nav.variant === "floating-square" ? "0" : B(k).nav.variant === "floating-tab" ? "12" : "999"), Y(c, typeof B(k).nav.style?.radius == "number" ? B(k).nav.style.radius : "");
						}, [() => Z("tip.nav.radius"), () => Z("lbl.navRadius")]), V("change", c, (e) => rs(e, "radius", jo)), U(e, t);
					};
					G(ue, (e) => {
						B(Xo) && e(de);
					});
					var fe = R(ue, 2), pe = (e) => {
						{
							let t = /* @__PURE__ */ A(() => Z("lbl.navPlacement")), n = /* @__PURE__ */ A(() => B(k).nav.style?.sidePlacement ?? "top"), r = /* @__PURE__ */ A(() => [
								["top", Z("opt.place.top")],
								["middle", Z("opt.place.middle")],
								["bottom", Z("opt.place.bottom")]
							]);
							Yo(e, {
								get label() {
									return B(t);
								},
								get value() {
									return B(n);
								},
								get options() {
									return B(r);
								},
								onchange: (e) => qo("sidePlacement", e === "top" ? void 0 : e)
							});
						}
					}, me = (e) => {
						{
							let t = /* @__PURE__ */ A(() => Z("lbl.navPlacement")), n = /* @__PURE__ */ A(() => Z("opt.layout.leftAfterLogo")), r = /* @__PURE__ */ A(() => B(k).nav.layout ?? "right"), i = /* @__PURE__ */ A(() => [
								["left", Z("common.left")],
								["center", Z("common.center")],
								["right", Z("common.right")]
							]);
							Yo(e, {
								get label() {
									return B(t);
								},
								get title() {
									return B(n);
								},
								get value() {
									return B(r);
								},
								get options() {
									return B(i);
								},
								onchange: (e) => Go(e)
							});
						}
					};
					G(fe, (e) => {
						B(Jo) ? e(pe) : e(me, -1);
					});
					var he = R(fe, 2), ge = (e) => {
						var t = mf(), n = I(t), r = F(n);
						J(r);
						var i = R(r);
						D(n);
						var a = R(n, 2), o = F(a);
						J(o);
						var s = R(o);
						D(a), z((e, t, c, l) => {
							X(n, "title", e), Si(r, B(k).nav.style?.glow === !0), W(i, ` ${t ?? ""}`), X(a, "title", c), Si(o, B(k).nav.style?.topGap !== !1), W(s, ` ${l ?? ""}`);
						}, [
							() => Z("tip.nav.glow"),
							() => Z("lbl.navGlow"),
							() => Z("tip.nav.topGap"),
							() => Z("lbl.navTopGap")
						]), V("change", r, (e) => vs(e.target.checked)), V("change", o, (e) => ys(e.target.checked)), U(e, t);
					};
					G(he, (e) => {
						B(Xo) && e(ge);
					});
					var _e = R(he, 2), ve = (e) => {
						var t = mf(), n = I(t), r = F(n);
						J(r);
						var i = R(r);
						D(n);
						var a = R(n, 2), o = F(a);
						J(o);
						var s = R(o);
						D(a), z((e, t, c, l) => {
							X(n, "title", e), Si(r, B(k).nav.overlay === !0), W(i, ` ${t ?? ""}`), X(a, "title", c), Si(o, B(k).nav.style?.inset === !0), W(s, ` ${l ?? ""}`);
						}, [
							() => Z("tip.nav.overlay"),
							() => Z("lbl.navOverlay"),
							() => Z("tip.nav.inset"),
							() => Z("lbl.navInset")
						]), V("change", r, (e) => sa("nav", () => {
							e.target.checked ? B(k).nav.overlay = !0 : delete B(k).nav.overlay;
						})), V("change", o, (e) => qo("inset", e.target.checked ? !0 : void 0)), U(e, t);
					};
					G(_e, (e) => {
						!B(Xo) && !B(Jo) && e(ve);
					});
					var ye = R(_e, 2), be = (e) => {
						var t = hf(), n = I(t);
						{
							let e = /* @__PURE__ */ A(() => Z("lbl.textAlign")), t = /* @__PURE__ */ A(() => Z("tip.nav.sideAlign")), r = /* @__PURE__ */ A(() => B(k).nav.style?.sideAlign ?? "left"), i = /* @__PURE__ */ A(() => [
								["left", Z("common.left")],
								["center", Z("common.center")],
								["right", Z("common.right")]
							]);
							Yo(n, {
								get label() {
									return B(e);
								},
								get title() {
									return B(t);
								},
								get value() {
									return B(r);
								},
								get options() {
									return B(i);
								},
								onchange: (e) => qo("sideAlign", e === "left" ? void 0 : e)
							});
						}
						var r = R(n, 2), i = F(r), a = L(i, !0), o = R(i, 2);
						J(o), D(r), z((e, t) => {
							X(r, "title", e), W(a, t), X(o, "min", Mo.min), X(o, "max", Mo.max), Y(o, B(k).nav.style?.width ?? 250);
						}, [() => Z("tip.nav.colWidth"), () => Z("lbl.navColWidth")]), V("change", o, (e) => {
							let t = Ro(e.target.value, Mo, 250);
							qo("width", t === 250 ? void 0 : t), e.target.value = B(k).nav.style?.width ?? 250;
						}), U(e, t);
					};
					G(ye, (e) => {
						B(Jo) && e(be);
					}), D(E), D(ee);
					var xe = R(ee, 4), Se = F(xe), Ce = L(Se, !0), we = R(Se, 2), Te = F(we);
					Yr(Te, 20, () => Fo, (e) => e, (e, t) => {
						var n = Hd();
						let r;
						var i = L(n, !0);
						z((e) => {
							r = q(n, 1, "svelte-1n46o8q", null, r, { on: B($o) === t }), W(i, e);
						}, [() => Z(`opt.size.${t}`)]), V("click", n, () => ns(t)), U(e, n);
					}), D(Te);
					var Ee = R(Te, 2), De = F(Ee), Oe = L(De, !0), ke = R(De, 2), Ae = F(ke), je = (e) => {
						var t = gf(), n = F(t), r = L(n, !0), i = R(n, 2);
						J(i);
						var a = R(i, 2);
						J(a), D(t), z((e, n) => {
							X(t, "title", e), W(r, n), X(i, "min", To.min), X(i, "max", To.max), X(i, "step", To.step), Y(i, B(es)), X(a, "min", To.min), X(a, "max", To.max), Y(a, B(es));
						}, [() => Z("tip.nav.thickness"), () => Z("lbl.navThickness")]), V("input", i, (e) => qo("padY", e.target.valueAsNumber)), V("change", a, (e) => ss(e, "padY", To)), U(e, t);
					};
					G(Ae, (e) => {
						B(Jo) || e(je);
					});
					var Me = R(Ae, 2), Ne = F(Me), Pe = L(Ne, !0), Fe = R(Ne, 2);
					J(Fe);
					var Ie = R(Fe, 2);
					J(Ie), D(Me);
					var Le = R(Me, 2), Re = (e) => {
						var t = _f(), n = F(t), r = F(n), i = L(r, !0), a = R(r, 2);
						J(a), D(n);
						var o = R(n, 2), s = F(o), c = L(s, !0), l = R(s, 2);
						J(l), D(o), D(t), z((e, t, r, s, u, d) => {
							X(n, "title", e), W(i, t), X(a, "min", Do.min), X(a, "max", Do.max), X(a, "placeholder", r), Y(a, B(k).nav.style?.padX ?? ""), X(o, "title", s), W(c, u), X(l, "min", Oo.min), X(l, "max", Oo.max), X(l, "placeholder", d), Y(l, B(k).nav.style?.gap ?? "");
						}, [
							() => Z("tip.nav.padX"),
							() => Z("lbl.navPadX"),
							() => Z("common.auto"),
							() => Z("tip.nav.gap"),
							() => Z("lbl.navGap"),
							() => Z("common.auto")
						]), V("change", a, (e) => rs(e, "padX", Do)), V("change", l, (e) => rs(e, "gap", Oo)), U(e, t);
					};
					G(Le, (e) => {
						B(Jo) || e(Re);
					}), D(ke), D(Ee), D(we), D(xe);
					var ze = R(xe, 4), Be = F(ze), Ve = L(Be, !0), O = R(Be, 2), He = F(O), Ue = (e) => {
						var t = yf(), n = I(t), r = F(n), i = L(r, !0), a = R(r, 2);
						Yr(a, 21, () => [
							["", Z("common.none")],
							["bottom", Z("opt.navBorder.bottom")],
							["top", Z("opt.navBorder.top")],
							["both", Z("opt.navBorder.both")],
							["all", Z("opt.navBorder.all")]
						], ([e, t]) => e, (e, t) => {
							var n = /* @__PURE__ */ A(() => h(B(t), 2));
							let r = () => B(n)[0], i = () => B(n)[1];
							var a = uf();
							let o;
							var s = F(a);
							K(s, () => c[r()]);
							var l = L(R(s), !0);
							D(a), z(() => {
								o = q(a, 1, "tile svelte-1n46o8q", null, o, { on: (B(k).nav.style?.border?.side ?? "") === r() }), X(a, "aria-pressed", (B(k).nav.style?.border?.side ?? "") === r()), W(l, i());
							}), V("click", a, () => qo("border", r() ? {
								...B(k).nav.style?.border ?? {},
								side: r()
							} : void 0)), U(e, a);
						}), D(a), D(n);
						var o = R(n, 2), s = (e) => {
							var t = vf(), n = F(t), r = L(n, !0), i = R(n, 2);
							J(i);
							var a = R(i, 2), o = L(a, !0), s = R(a, 2);
							{
								let e = /* @__PURE__ */ A(() => B(k).nav.style.border.color ?? "text"), t = /* @__PURE__ */ A(zr), n = /* @__PURE__ */ A(() => Z("tip.nav.borderColorPick"));
								ha(s, {
									get value() {
										return B(e);
									},
									get tokens() {
										return B(t);
									},
									get label() {
										return B(n);
									},
									onchange: (e) => qo("border", {
										...B(k).nav.style.border,
										color: e
									})
								});
							}
							D(t), z((e, t, s, c, l) => {
								X(n, "title", e), W(r, t), X(i, "title", s), Y(i, B(k).nav.style.border.width ?? 1), X(a, "title", c), W(o, l);
							}, [
								() => Z("tip.nav.borderWidth"),
								() => Z("lbl.navBorderWidth"),
								() => Z("tip.nav.borderWidth"),
								() => Z("tip.nav.borderColorPick"),
								() => Z("lbl.navBorderColor")
							]), V("change", i, (e) => {
								let t = Ro(e.target.value, {
									min: 1,
									max: 8
								}, 1), n = { ...B(k).nav.style.border };
								t === 1 ? delete n.width : n.width = t, qo("border", n), e.target.value = B(k).nav.style.border.width ?? 1;
							}), U(e, t);
						};
						G(o, (e) => {
							B(k).nav.style?.border?.side && e(s);
						}), z((e, t, r) => {
							X(n, "title", e), W(i, t), X(a, "aria-label", r);
						}, [
							() => Z("tip.nav.border"),
							() => Z("lbl.navBorder"),
							() => Z("lbl.navBorder")
						]), U(e, t);
					};
					G(He, (e) => {
						B(Jo) || e(Ue);
					});
					var We = R(He, 2), Ge = (e) => {
						{
							let t = /* @__PURE__ */ A(() => Z("lbl.navShadow")), n = /* @__PURE__ */ A(() => Z("tip.nav.shadow")), r = /* @__PURE__ */ A(() => B(k).nav.style?.shadow ?? ""), i = /* @__PURE__ */ A(() => [
								["", Z("common.none")],
								["soft", Z("opt.navShadow.soft")],
								["strong", Z("opt.navShadow.strong")]
							]);
							Yo(e, {
								get label() {
									return B(t);
								},
								get title() {
									return B(n);
								},
								get value() {
									return B(r);
								},
								get options() {
									return B(i);
								},
								onchange: (e) => qo("shadow", e || void 0)
							});
						}
					};
					G(We, (e) => {
						!B(Xo) && !B(Jo) && e(Ge);
					}), D(O), D(ze);
					var Ke = R(ze, 4), qe = F(Ke), Je = L(qe, !0), Ye = R(qe, 2), Xe = F(Ye), Ze = (e) => {
						var t = xf(), n = F(t), r = L(n, !0), i = R(n, 2), a = F(i);
						J(a);
						var o = R(a);
						D(i);
						var s = R(i, 2), c = (e) => {
							var t = df(), n = I(t);
							{
								let e = /* @__PURE__ */ A(() => Z("lbl.navScroll")), t = /* @__PURE__ */ A(() => Z("tip.nav.scroll")), r = /* @__PURE__ */ A(() => B(k).nav.scroll ?? "none"), i = /* @__PURE__ */ A(() => [
									["none", Z("opt.scroll.none")],
									["shrink", Z("opt.scroll.shrink")],
									["hide", Z("opt.scroll.hide")]
								]);
								Yo(n, {
									get label() {
										return B(e);
									},
									get title() {
										return B(t);
									},
									get value() {
										return B(r);
									},
									get options() {
										return B(i);
									},
									onchange: (e) => sa("nav", () => {
										e === "none" ? delete B(k).nav.scroll : B(k).nav.scroll = e;
									})
								});
							}
							var r = R(n, 2), i = (e) => {
								var t = bf(), n = I(t), r = F(n), i = L(r, !0), a = R(r, 2);
								J(a);
								var o = L(R(a, 2));
								D(n);
								var s = R(n, 2), c = (e) => {
									var t = Au(), n = F(t);
									J(n);
									var r = R(n);
									D(t), z((e, i) => {
										X(t, "title", e), Si(n, B(k).nav.style?.shrinkLogo === !0), W(r, ` ${i ?? ""}`);
									}, [() => Z("tip.nav.shrinkLogo"), () => Z("lbl.navShrinkLogo")]), V("change", n, (e) => qo("shrinkLogo", e.target.checked ? !0 : void 0)), U(e, t);
								};
								G(s, (e) => {
									(B(k).nav.logo?.type ?? "text") !== "text" && e(c);
								}), z((e, t, r, s) => {
									X(n, "title", e), W(i, t), Y(a, r), W(o, `${s ?? ""}%`);
								}, [
									() => Z("tip.nav.shrinkTo"),
									() => Z("lbl.navShrinkTo"),
									() => Math.round((B(k).nav.style?.shrinkTo ?? .5) * 100),
									() => Math.round((B(k).nav.style?.shrinkTo ?? .5) * 100)
								]), V("input", a, (e) => ds(e.target.valueAsNumber)), U(e, t);
							};
							G(r, (e) => {
								B(k).nav.scroll === "shrink" && e(i);
							}), U(e, t);
						};
						G(s, (e) => {
							B(k).nav.sticky !== !1 && e(c);
						});
						var l = R(s, 2), u = F(l);
						J(u);
						var d = R(u);
						D(l), D(t), z((e, t, n, s, c) => {
							W(r, e), X(i, "title", t), Si(a, B(k).nav.sticky !== !1), W(o, ` ${n ?? ""}`), X(l, "title", s), Si(u, B(k).nav.style?.atTop === "clear"), W(d, ` ${c ?? ""}`);
						}, [
							() => Z("group.navScrolling"),
							() => Z("tip.nav.sticky"),
							() => Z("lbl.navSticky"),
							() => Z("tip.nav.atTop"),
							() => Z("lbl.navAtTop")
						]), V("change", a, (e) => sa("nav", () => {
							B(k).nav.sticky = e.target.checked;
						})), V("change", u, (e) => qo("atTop", e.target.checked ? "clear" : void 0)), U(e, t);
					};
					G(Xe, (e) => {
						B(Jo) || e(Ze);
					});
					var Qe = R(Xe, 2), $e = F(Qe), et = L($e, !0), tt = R($e, 2), nt = F(tt);
					J(nt);
					var rt = R(nt);
					D(tt);
					var it = R(tt, 2), at = (e) => {
						var t = Sf(), n = F(t), r = L(n, !0), i = R(n, 2);
						{
							let e = /* @__PURE__ */ A(() => B(k).nav.cart?.href ?? ""), t = /* @__PURE__ */ A(() => [["", Z("common.none")], ...B(k).pages.map((e) => [e.path, e.title])]);
							Q(i, {
								filled: !0,
								get value() {
									return B(e);
								},
								get options() {
									return B(t);
								},
								onchange: (e) => sa("nav", () => {
									e ? B(k).nav.cart.href = e : delete B(k).nav.cart.href;
								})
							});
						}
						D(t), z((e, n) => {
							X(t, "title", e), W(r, n);
						}, [() => Z("tip.cart.checkout"), () => Z("lbl.checkoutPage")]), U(e, t);
					};
					G(it, (e) => {
						B(k).nav.cart?.show && e(at);
					}), D(Qe), D(Ye), D(Ke);
					var ot = R(Ke, 4), st = F(ot), ct = L(st, !0), lt = R(st, 2), ut = F(lt), dt = F(ut), ft = (e) => {
						var t = Cf(), n = F(t), r = L(n, !0), i = R(n, 2);
						J(i), D(t), z((e, n, a) => {
							X(t, "title", e), W(r, n), X(i, "min", To.min), X(i, "max", To.max), X(i, "placeholder", a), Y(i, B(k).nav.style?.mobile?.padY ?? "");
						}, [
							() => Z("tip.nav.thickness"),
							() => Z("lbl.navThickness"),
							() => Z("lbl.navSameAsDesktop")
						]), V("change", i, (e) => cs(e, "padY", To)), U(e, t);
					};
					G(dt, (e) => {
						B(Jo) || e(ft);
					});
					var pt = R(dt, 2), mt = F(pt), ht = L(mt, !0), gt = R(mt, 2);
					J(gt), D(pt), D(ut);
					var _t = R(ut, 2), vt = F(_t), yt = F(vt), bt = L(yt, !0), xt = R(yt, 2);
					{
						let e = /* @__PURE__ */ A(() => B(k).nav.style?.mobileMenu ?? "dropdown"), t = /* @__PURE__ */ A(() => [["dropdown", Z("opt.mobileMenu.dropdown")], ["sheet", Z("opt.mobileMenu.sheet")]]);
						Q(xt, {
							filled: !0,
							get value() {
								return B(e);
							},
							get options() {
								return B(t);
							},
							onchange: (e) => qo("mobileMenu", e === "dropdown" ? void 0 : e)
						});
					}
					D(vt);
					var St = R(vt, 2), Ct = (e) => {
						var t = Sf(), n = F(t), r = L(n, !0), i = R(n, 2);
						{
							let e = /* @__PURE__ */ A(() => B(k).nav.style?.sheetMotion ?? "top"), t = /* @__PURE__ */ A(() => [
								"top",
								"bottom",
								"left",
								"right",
								"fade",
								"none"
							].map((e) => [e, Z(`opt.sheetMotion.${e}`)]));
							Q(i, {
								filled: !0,
								get value() {
									return B(e);
								},
								get options() {
									return B(t);
								},
								onchange: (e) => qo("sheetMotion", e === "top" ? void 0 : e)
							});
						}
						D(t), z((e, n) => {
							X(t, "title", e), W(r, n);
						}, [() => Z("tip.nav.sheetMotion"), () => Z("lbl.sheetMotion")]), U(e, t);
					};
					G(St, (e) => {
						B(k).nav.style?.mobileMenu === "sheet" && e(Ct);
					}), D(_t);
					var wt = R(_t, 2), Tt = (e) => {
						var t = wf(), n = I(t), r = F(n);
						J(r);
						var i = R(r);
						D(n);
						var a = R(n, 2), o = (e) => {
							var t = Au(), n = F(t);
							J(n);
							var r = R(n);
							D(t), z((e, i) => {
								X(t, "title", e), Si(n, B(k).nav.style?.sheetTheme === !0), W(r, ` ${i ?? ""}`);
							}, [() => Z("tip.nav.sheetTheme"), () => Z("lbl.sheetTheme")]), V("change", n, (e) => qo("sheetTheme", e.target.checked ? !0 : void 0)), U(e, t);
						};
						G(a, (e) => {
							B(k).theme?.alt?.tokens && e(o);
						});
						var s = R(a, 2), c = (e) => {
							var t = Au(), n = F(t);
							J(n);
							var r = R(n);
							D(t), z((e, i) => {
								X(t, "title", e), Si(n, B(k).nav.style?.sheetCart === !0), W(r, ` ${i ?? ""}`);
							}, [() => Z("tip.nav.sheetCart"), () => Z("lbl.sheetCart")]), V("change", n, (e) => qo("sheetCart", e.target.checked ? !0 : void 0)), U(e, t);
						};
						G(s, (e) => {
							B(k).nav.cart?.show && e(c);
						});
						var l = R(s, 2), u = (e) => {
							var t = Au(), n = F(t);
							J(n);
							var r = R(n);
							D(t), z((e, i) => {
								X(t, "title", e), Si(n, B(k).nav.style?.sheetToolLabels === !0), W(r, ` ${i ?? ""}`);
							}, [() => Z("tip.nav.sheetToolLabels"), () => Z("lbl.sheetToolLabels")]), V("change", n, (e) => qo("sheetToolLabels", e.target.checked ? !0 : void 0)), U(e, t);
						};
						G(l, (e) => {
							(B(k).nav.style?.sheetTheme || B(k).nav.style?.sheetCart) && e(u);
						});
						var d = R(l, 2), f = F(d), p = L(f, !0), m = R(f, 2);
						{
							let e = /* @__PURE__ */ A(() => B(k).nav.style?.sheet?.bg ?? "surface"), t = /* @__PURE__ */ A(zr), n = /* @__PURE__ */ A(() => Z("tip.nav.sheetBg"));
							ha(m, {
								get value() {
									return B(e);
								},
								get tokens() {
									return B(t);
								},
								get label() {
									return B(n);
								},
								onchange: (e) => os("bg", e)
							});
						}
						var h = R(m, 2);
						J(h);
						var g = L(R(h, 2));
						D(d);
						var _ = R(d, 2), v = F(_);
						J(v);
						var y = R(v);
						D(_);
						var b = R(_, 2), x = F(b), S = R(x);
						{
							let e = /* @__PURE__ */ A(() => B(k).nav.style?.sheet?.textColor ?? B(k).nav.style?.textColor ?? "text"), t = /* @__PURE__ */ A(zr), n = /* @__PURE__ */ A(() => Z("tip.nav.sheetTextColorPick"));
							ha(S, {
								get value() {
									return B(e);
								},
								get tokens() {
									return B(t);
								},
								get label() {
									return B(n);
								},
								onchange: (e) => os("textColor", e)
							});
						}
						D(b), z((e, t, a, o, s, c, l, u, f, m) => {
							X(n, "title", e), Si(r, B(k).nav.style?.sheetLogo === !0), W(i, ` ${t ?? ""}`), X(d, "title", a), W(p, o), X(h, "title", s), Y(h, c), W(g, `${l ?? ""}%`), X(_, "title", u), Si(v, B(k).nav.style?.sheet?.blur ?? B(k).nav.style?.blur !== !1), W(y, ` ${f ?? ""}`), W(x, `${m ?? ""} `);
						}, [
							() => Z("tip.nav.sheetLogo"),
							() => Z("lbl.sheetLogo"),
							() => Z("tip.nav.sheetBg"),
							() => Z("lbl.background"),
							() => Z("tip.nav.sheetOpacity"),
							() => Math.round((B(k).nav.style?.sheet?.bgOpacity ?? .85) * 100),
							() => Math.round((B(k).nav.style?.sheet?.bgOpacity ?? .85) * 100),
							() => Z("tip.nav.sheetBlur"),
							() => Z("lbl.sheetBlur"),
							() => Z("lbl.textColor")
						]), V("change", r, (e) => qo("sheetLogo", e.target.checked ? !0 : void 0)), V("input", h, (e) => os("bgOpacity", e.target.valueAsNumber / 100)), V("change", v, (e) => os("blur", e.target.checked)), U(e, t);
					};
					G(wt, (e) => {
						B(k).nav.style?.mobileMenu === "sheet" && e(Tt);
					});
					var Et = R(wt, 2), Dt = (e) => {
						var t = Sf(), n = F(t), r = L(n, !0), i = R(n, 2);
						{
							let e = /* @__PURE__ */ A(() => B(k).nav.style?.mobileSubs ?? "collapsed"), t = /* @__PURE__ */ A(() => [["collapsed", Z("opt.mobileSubs.collapsed")], ["expanded", Z("opt.mobileSubs.expanded")]]);
							Q(i, {
								filled: !0,
								get value() {
									return B(e);
								},
								get options() {
									return B(t);
								},
								onchange: (e) => qo("mobileSubs", e === "collapsed" ? void 0 : e)
							});
						}
						D(t), z((e, n) => {
							X(t, "title", e), W(r, n);
						}, [() => Z("tip.nav.mobileSubs"), () => Z("lbl.mobileSubs")]), U(e, t);
					}, Ot = /* @__PURE__ */ A(() => B(k).nav.items?.some((e) => e.children?.length));
					G(Et, (e) => {
						B(Ot) && e(Dt);
					}), D(lt), D(ot);
					var kt = R(ot, 4), At = F(kt), jt = L(At, !0), Mt = R(At, 2), Nt = F(Mt), Pt = F(Nt), Ft = L(Pt, !0), It = R(Pt, 2);
					Yr(It, 21, () => [
						["standard", Z("opt.hover.standard")],
						["underline", Z("opt.hover.underline")],
						["pill", Z("opt.hover.pill")],
						["lift-plain", Z("opt.hover.liftPlain")],
						["lift", Z("opt.hover.lift")]
					], ([e, t]) => e, (e, t) => {
						var n = /* @__PURE__ */ A(() => h(B(t), 2));
						let r = () => B(n)[0], i = () => B(n)[1];
						var a = Tf();
						let o;
						var s = F(a), c = L(s, !0), l = L(R(s), !0);
						D(a), z((e) => {
							o = q(a, 1, "tile hover-tile svelte-1n46o8q", null, o, { on: (B(k).nav.style?.hover ?? "standard") === r() }), X(a, "aria-pressed", (B(k).nav.style?.hover ?? "standard") === r()), q(s, 1, `hover-sample hover-${r() ?? ""}`, "svelte-1n46o8q"), W(c, e), W(l, i());
						}, [() => Z("seed.home")]), V("click", a, () => bs(r())), U(e, a);
					}), D(It), D(Nt);
					var Lt = R(Nt, 2), j = (e) => {
						var t = Ef(), n = F(t), r = L(n, !0), i = R(n, 2);
						J(i);
						var a = L(R(i, 2));
						D(t), z((e, n, o) => {
							X(t, "title", e), W(r, n), Y(i, B(k).nav.style?.hoverGlow ?? .6), W(a, `${o ?? ""}%`);
						}, [
							() => Z("tip.nav.hoverGlow"),
							() => Z("lbl.glowStrength"),
							() => Math.round((B(k).nav.style?.hoverGlow ?? .6) * 100)
						]), V("input", i, (e) => qo("hoverGlow", Number(e.target.value))), U(e, t);
					};
					G(Lt, (e) => {
						B(k).nav.style?.hover === "lift" && e(j);
					});
					var Rt = R(Lt, 2), zt = F(Rt), Bt = (e) => {
						var t = Df(), n = F(t);
						{
							let e = /* @__PURE__ */ A(() => B(k).nav.style?.hoverColor ?? "accent"), t = /* @__PURE__ */ A(zr);
							ha(n, {
								get value() {
									return B(e);
								},
								get tokens() {
									return B(t);
								},
								get label() {
									return B(ms)[1];
								},
								onchange: (e) => qo("hoverColor", e)
							});
						}
						var r = L(R(n, 2), !0);
						D(t), z(() => {
							X(t, "title", B(ms)[1]), W(r, B(ms)[0]);
						}), U(e, t);
					};
					G(zt, (e) => {
						B(ms) && e(Bt);
					});
					var Vt = R(zt, 2), Ht = F(Vt);
					{
						let e = /* @__PURE__ */ A(() => B(k).nav.style?.hoverTextColor ?? "accent"), t = /* @__PURE__ */ A(zr), n = /* @__PURE__ */ A(() => Z("tip.nav.hoverTextColorPick"));
						ha(Ht, {
							get value() {
								return B(e);
							},
							get tokens() {
								return B(t);
							},
							get label() {
								return B(n);
							},
							onchange: (e) => qo("hoverTextColor", e)
						});
					}
					var Ut = L(R(Ht, 2), !0);
					D(Vt);
					var Wt = R(Vt, 2), Gt = F(Wt);
					{
						let e = /* @__PURE__ */ A(() => B(k).nav.style?.textColor ?? "text"), t = /* @__PURE__ */ A(zr), n = /* @__PURE__ */ A(() => Z("tip.nav.textColorPick"));
						ha(Gt, {
							get value() {
								return B(e);
							},
							get tokens() {
								return B(t);
							},
							get label() {
								return B(n);
							},
							onchange: (e) => qo("textColor", e)
						});
					}
					var Kt = L(R(Gt, 2), !0);
					D(Wt), D(Rt);
					var M = R(Rt, 2), qt = F(M);
					J(qt);
					var Jt = R(qt);
					D(M), D(Mt), D(kt);
					var N = R(kt, 4), Yt = F(N), Xt = L(Yt, !0), Zt = R(Yt, 2), Qt = F(Zt);
					n(Qt, () => Nr, () => B(k).nav?.style?.background?.layers ?? []), D(Zt), D(N), D(T), D(S);
					var $t = R(S, 2), en = F($t), tn = L(en, !0), nn = R(en, 2), rn = F(nn), an = F(rn);
					J(an);
					var on = R(an);
					D(rn);
					var sn = R(rn, 2), cn = (e) => {
						var t = kf(), n = I(t), r = F(n), i = L(r, !0), a = R(r, 2);
						J(a), D(n);
						var o = R(n, 2), s = F(o), c = R(s);
						{
							let e = /* @__PURE__ */ A(() => B(k).nav.announcement?.page ?? (B(k).nav.announcement?.href === void 0 ? "" : "custom")), t = /* @__PURE__ */ A(() => [
								["", Z("common.none")],
								...B(k).pages.map((e) => [e.id, e.title]),
								["custom", Z("opt.announceLink.custom")]
							]);
							Q(c, {
								get value() {
									return B(e);
								},
								get options() {
									return B(t);
								},
								onchange: (e) => sa("edit:nav-announce-link", () => {
									let t = { ...B(k).nav.announcement ?? {} };
									delete t.page, delete t.href, e === "custom" ? t.href = "" : e && (t.page = e), B(k).nav.announcement = t;
								})
							});
						}
						D(o);
						var l = R(o, 2), u = (e) => {
							var t = Of(), n = F(t), r = L(n, !0), i = R(n, 2);
							J(i), D(t), z((e, n) => {
								X(t, "title", e), W(r, n), Y(i, B(k).nav.announcement?.href ?? "");
							}, [() => Z("tip.nav.announceHref"), () => Z("lbl.announceHref")]), V("change", i, (e) => as("href", e.target.value.trim())), U(e, t);
						};
						G(l, (e) => {
							B(k).nav.announcement?.href !== void 0 && !B(k).nav.announcement?.page && e(u);
						});
						var d = R(l, 2), f = (e) => {
							var t = Au(), n = F(t);
							J(n);
							var r = R(n);
							D(t), z((e, i) => {
								X(t, "title", e), Si(n, B(k).nav.announcement?.sticky !== !1), W(r, ` ${i ?? ""}`);
							}, [() => Z("tip.nav.announceSticky"), () => Z("lbl.announceSticky")]), V("change", n, (e) => as("sticky", e.target.checked ? void 0 : !1)), U(e, t);
						};
						G(d, (e) => {
							B(k).nav.sticky !== !1 && !B(Xo) && !B(Jo) && !B(k).nav.overlay && e(f);
						});
						var p = R(d, 2), m = (e) => {
							{
								let t = /* @__PURE__ */ A(() => Z("lbl.announcePlace")), n = /* @__PURE__ */ A(() => Z("tip.nav.announcePlace")), r = /* @__PURE__ */ A(() => B(k).nav.announcement?.place ?? "nav"), i = /* @__PURE__ */ A(() => [
									["nav", Z("opt.announcePlace.nav")],
									["page", Z("opt.announcePlace.page")],
									["content", Z("opt.announcePlace.content")]
								]);
								Yo(e, {
									get label() {
										return B(t);
									},
									get title() {
										return B(n);
									},
									get value() {
										return B(r);
									},
									get options() {
										return B(i);
									},
									onchange: (e) => as("place", e === "nav" ? void 0 : e)
								});
							}
						};
						G(p, (e) => {
							B(Jo) && e(m);
						});
						var h = R(p, 2), g = F(h);
						J(g);
						var _ = R(g);
						D(h);
						var v = R(h, 2), y = F(v), b = R(y);
						{
							let e = /* @__PURE__ */ A(() => B(k).nav.announcement?.color ?? "accent"), t = /* @__PURE__ */ A(zr), n = /* @__PURE__ */ A(() => Z("tip.nav.announceColor"));
							ha(b, {
								get value() {
									return B(e);
								},
								get tokens() {
									return B(t);
								},
								get label() {
									return B(n);
								},
								onchange: (e) => as("color", e)
							});
						}
						D(v);
						var x = R(v, 2), S = F(x), C = R(S);
						{
							let e = /* @__PURE__ */ A(() => B(k).nav.announcement?.textColor ?? "accent-text"), t = /* @__PURE__ */ A(zr), n = /* @__PURE__ */ A(() => Z("tip.nav.announceTextColor"));
							ha(C, {
								get value() {
									return B(e);
								},
								get tokens() {
									return B(t);
								},
								get label() {
									return B(n);
								},
								onchange: (e) => as("textColor", e)
							});
						}
						D(x), z((e, t, r, c, l, u, d, f, p, m) => {
							X(n, "title", e), W(i, t), Y(a, B(k).nav.announcement?.text ?? ""), X(o, "title", r), W(s, `${c ?? ""} `), X(h, "title", l), Si(g, B(k).nav.announcement?.dismiss !== !1), W(_, ` ${u ?? ""}`), X(v, "title", d), W(y, `${f ?? ""} `), X(x, "title", p), W(S, `${m ?? ""} `);
						}, [
							() => Z("tip.nav.announce"),
							() => Z("lbl.text"),
							() => Z("tip.nav.announceLink"),
							() => Z("lbl.link"),
							() => Z("tip.nav.announceDismiss"),
							() => Z("lbl.announceDismiss"),
							() => Z("tip.nav.announceColor"),
							() => Z("lbl.background"),
							() => Z("tip.nav.announceTextColor"),
							() => Z("lbl.textColor")
						]), V("change", a, (e) => as("text", e.target.value.trim() || void 0)), V("change", g, (e) => as("dismiss", e.target.checked ? void 0 : !1)), U(e, t);
					};
					G(sn, (e) => {
						B(k).nav.announcement?.show && e(cn);
					}), D(nn), D($t);
					var ln = R($t, 2), un = F(ln), dn = L(un, !0), fn = R(un, 2), pn = F(fn), mn = F(pn), hn = L(mn, !0), gn = R(mn, 2);
					let _n;
					Yr(gn, 21, () => B(_s), ([e, t]) => e, (e, t) => {
						var n = /* @__PURE__ */ A(() => h(B(t), 2));
						let r = () => B(n)[0], i = () => B(n)[1];
						var a = uf();
						let o;
						var s = F(a);
						K(s, () => u[r()]);
						var c = L(R(s), !0);
						D(a), z(() => {
							o = q(a, 1, "tile svelte-1n46o8q", null, o, { on: (B(k).nav.style?.subStyle ?? "card") === r() }), X(a, "aria-pressed", (B(k).nav.style?.subStyle ?? "card") === r()), W(c, i());
						}), V("click", a, () => qo("subStyle", r() === "card" ? void 0 : r())), U(e, a);
					}), D(gn), D(pn);
					var vn = R(pn, 2), yn = (e) => {
						var t = df(), n = I(t), r = (e) => {
							var t = df(), n = I(t);
							{
								let e = /* @__PURE__ */ A(() => Z("lbl.sideSubs")), t = /* @__PURE__ */ A(() => Z("tip.nav.sideSubs")), r = /* @__PURE__ */ A(() => B(k).nav.style?.sideSubs ?? "collapsed"), i = /* @__PURE__ */ A(() => [["collapsed", Z("opt.mobileSubs.collapsed")], ["expanded", Z("opt.mobileSubs.expanded")]]);
								Yo(n, {
									get label() {
										return B(e);
									},
									get title() {
										return B(t);
									},
									get value() {
										return B(r);
									},
									get options() {
										return B(i);
									},
									onchange: (e) => qo("sideSubs", e === "collapsed" ? void 0 : e)
								});
							}
							var r = R(n, 2), i = (e) => {
								var t = Au(), n = F(t);
								J(n);
								var r = R(n);
								D(t), z((e, i) => {
									X(t, "title", e), Si(n, B(k).nav.style?.sideSubArrow === !0), W(r, ` ${i ?? ""}`);
								}, [() => Z("tip.nav.sideSubArrow"), () => Z("lbl.sideSubArrow")]), V("change", n, (e) => qo("sideSubArrow", e.target.checked ? !0 : void 0)), U(e, t);
							};
							G(r, (e) => {
								B(k).nav.style?.sideSubs === "expanded" && e(i);
							}), U(e, t);
						};
						G(n, (e) => {
							B(Jo) && e(r);
						});
						var i = R(n, 2), a = (e) => {
							{
								let t = /* @__PURE__ */ A(() => Z("lbl.subOpen")), n = /* @__PURE__ */ A(() => Z("tip.nav.subOpen")), r = /* @__PURE__ */ A(() => B(k).nav.style?.subOpen ?? "hover"), i = /* @__PURE__ */ A(() => [
									["hover", Z("opt.subOpen.hover")],
									["stay", Z("opt.subOpen.stay")],
									["click", Z("opt.subOpen.click")]
								]);
								Yo(e, {
									get label() {
										return B(t);
									},
									get title() {
										return B(n);
									},
									get value() {
										return B(r);
									},
									get options() {
										return B(i);
									},
									onchange: (e) => qo("subOpen", e === "hover" ? void 0 : e)
								});
							}
						};
						G(i, (e) => {
							(!B(Jo) || B(k).nav.style?.sideSubs !== "expanded") && e(a);
						}), U(e, t);
					}, bn = /* @__PURE__ */ A(() => B(k).nav.items?.some((e) => e.children?.length));
					G(vn, (e) => {
						B(bn) && e(yn);
					});
					var xn = R(vn, 2), Sn = (e) => {
						var t = fu(), n = F(t), r = R(n);
						{
							let e = /* @__PURE__ */ A(() => B(k).nav.style?.subPillColor ?? "surface"), t = /* @__PURE__ */ A(zr), n = /* @__PURE__ */ A(() => Z("tip.nav.subPillColorPick"));
							ha(r, {
								get value() {
									return B(e);
								},
								get tokens() {
									return B(t);
								},
								get label() {
									return B(n);
								},
								onchange: (e) => qo("subPillColor", e)
							});
						}
						D(t), z((e, r) => {
							X(t, "title", e), W(n, `${r ?? ""} `);
						}, [() => Z("tip.nav.subPillColor"), () => Z("lbl.subPillColor")]), U(e, t);
					};
					G(xn, (e) => {
						B(k).nav.style?.subStyle === "pills" && e(Sn);
					});
					var Cn = R(xn, 2), wn = F(Cn), Tn = R(wn);
					J(Tn), D(Cn), D(fn), D(ln);
					var En = R(ln, 2), Dn = F(En), On = L(Dn, !0), kn = R(Dn, 2);
					{
						let e = (e, t = f) => {
							let n = /* @__PURE__ */ A(_m);
							var r = Af();
							let i;
							var a = F(r);
							K(a, () => xm, !0), D(a);
							var o = R(a, 2), s = F(o), c = L(s, !0), l = L(R(s, 2), !0);
							D(o), D(r), z(() => {
								i = q(r, 1, "nav-item ghost svelte-1n46o8q", null, i, { child: t() }), W(c, B(n).label), W(l, B(n).target);
							}), U(e, r);
						};
						var An = F(kn);
						Yr(An, 21, () => B(k).nav.items, Gr, (t, n, r) => {
							let i = /* @__PURE__ */ A(() => `${r}`);
							var a = Pf(), o = I(a), s = (t) => {
								e(t, () => !1);
							};
							G(o, (e) => {
								B(pm)?.key === B(i) && B(pm).pos === "before" && e(s);
							});
							var c = R(o, 2);
							let l;
							var u = F(c);
							K(u, () => xm, !0), D(u);
							var d = R(u, 2), f = F(d);
							J(f);
							var p = R(f, 2), m = F(p);
							{
								let e = /* @__PURE__ */ A(() => B(n).page ?? (B(n).href == null ? "__none" : "__href")), t = /* @__PURE__ */ A(() => Z("tip.linkTarget")), i = /* @__PURE__ */ A(() => [
									...B(k).pages.map((e) => [e.id, e.title]),
									["__href", Z("opt.linkHref")],
									...B(n).children ? [["__none", Z("opt.noLink")]] : []
								]);
								Q(m, {
									compact: !0,
									get value() {
										return B(e);
									},
									get title() {
										return B(t);
									},
									get options() {
										return B(i);
									},
									onchange: (e) => sm(r, e)
								});
							}
							var h = R(m, 2), g = (e) => {
								var t = jf();
								J(t), z((e, r) => {
									Y(t, B(n).href), X(t, "placeholder", e), X(t, "title", r);
								}, [() => Z("ph.hrefAnchor"), () => Z("tip.hrefAnchor")]), V("change", t, (e) => cm(r, e.target.value)), U(e, t);
							};
							G(h, (e) => {
								!B(n).page && B(n).href != null && e(g);
							}), D(p), D(d);
							var v = R(d, 2), y = (e) => {
								var t = Mf();
								K(t, () => "<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M6 9l6 6 6-6\"/></svg>", !0), D(t), z((e) => X(t, "title", e), [() => Z("tip.nav.hasSubmenu")]), U(e, t);
							};
							G(v, (e) => {
								B(n).children?.length && e(y);
							});
							var b = R(v, 2), x = F(b);
							K(x, () => _.plus, !0), D(x);
							var S = R(x, 2);
							S.disabled = r === 0, K(S, () => _.up, !0), D(S);
							var C = R(S, 2);
							K(C, () => _.cross, !0), D(C);
							var w = R(C, 2);
							K(w, () => _.down, !0), D(w), D(b);
							var T = R(b, 2);
							K(T, () => _.kebab, !0), D(T), D(c);
							var ee = R(c, 2);
							Yr(ee, 17, () => B(n).children ?? [], Gr, (t, i, a) => {
								let o = /* @__PURE__ */ A(() => `${r}.${a}`);
								var s = Nf(), c = I(s), l = (t) => {
									e(t, () => !0);
								};
								G(c, (e) => {
									B(pm)?.key === B(o) && B(pm).pos === "before" && e(l);
								});
								var u = R(c, 2);
								let d;
								var f = F(u);
								K(f, () => xm, !0), D(f);
								var p = R(f, 2), m = F(p);
								J(m);
								var h = R(m, 2), g = F(h);
								{
									let e = /* @__PURE__ */ A(() => B(i).page ?? "__href"), t = /* @__PURE__ */ A(() => Z("tip.linkTarget")), n = /* @__PURE__ */ A(() => [...B(k).pages.map((e) => [e.id, e.title]), ["__href", Z("opt.linkHref")]]);
									Q(g, {
										compact: !0,
										get value() {
											return B(e);
										},
										get title() {
											return B(t);
										},
										get options() {
											return B(n);
										},
										onchange: (e) => Tm(r, a, e)
									});
								}
								var v = R(g, 2), y = (e) => {
									var t = jf();
									J(t), z((e, n) => {
										Y(t, B(i).href ?? ""), X(t, "placeholder", e), X(t, "title", n);
									}, [() => Z("ph.hrefAnchor"), () => Z("tip.hrefAnchor")]), V("change", t, (e) => Em(r, a, e.target.value)), U(e, t);
								};
								G(v, (e) => {
									B(i).page || e(y);
								}), D(h), D(p);
								var b = R(p, 2), x = F(b);
								x.disabled = a === 0, K(x, () => _.up, !0), D(x);
								var S = R(x, 2);
								K(S, () => _.cross, !0), D(S);
								var C = R(S, 2);
								K(C, () => _.down, !0), D(C), D(b);
								var w = R(b, 2);
								K(w, () => _.kebab, !0), D(w), D(u);
								var T = R(u, 2), ee = (t) => {
									e(t, () => !0);
								};
								G(T, (e) => {
									B(pm)?.key === B(o) && B(pm).pos === "after" && e(ee);
								}), z((e, t, r, s, c, l, p) => {
									d = q(u, 1, "nav-item child svelte-1n46o8q", null, d, {
										selected: B(dm) === B(o),
										dragging: B(fm) === B(o)
									}), X(u, "data-key", B(o)), X(f, "title", e), Y(m, B(i).label), X(m, "title", t), X(x, "title", r), X(S, "title", s), X(C, "title", c), C.disabled = a === B(n).children.length - 1, X(w, "title", l), X(w, "aria-label", p);
								}, [
									() => Z("tip.nav.dragItem"),
									() => Z("tip.nav.childLabel"),
									() => Z("tip.moveUp"),
									() => Z("tip.nav.removeChild"),
									() => Z("tip.moveDown"),
									() => Z("tip.nav.itemActions"),
									() => Z("tip.nav.itemActions")
								]), V("click", u, (e) => {
									e.stopPropagation(), P(dm, B(o));
								}), wr("dragstart", f, (e) => {
									e.stopPropagation(), P(fm, B(o)), e.dataTransfer?.setData("text/plain", B(o));
								}), wr("dragend", f, vm), V("input", m, (e) => wm(r, a, e.target.value)), V("click", x, () => Dm(r, a, -1)), V("click", S, () => Om(r, a)), V("click", C, () => Dm(r, a, 1)), V("click", w, (e) => {
									e.stopPropagation(), P(dm, B(o));
								}), U(t, s);
							});
							var te = R(ee, 2), ne = (t) => {
								e(t, () => !0);
							};
							G(te, (e) => {
								B(pm)?.key === B(i) && B(pm).pos === "into" && e(ne);
							});
							var E = R(te, 2), re = (t) => {
								e(t, () => !1);
							};
							G(E, (e) => {
								B(pm)?.key === B(i) && B(pm).pos === "after" && e(re);
							}), z((e, t, a, o, s, d, p, m) => {
								l = q(c, 1, "nav-item svelte-1n46o8q", null, l, {
									selected: B(dm) === B(i),
									dragging: B(fm) === B(i),
									"drop-target": B(pm)?.key === B(i) && B(pm).pos === "into"
								}), X(c, "data-key", B(i)), X(u, "title", e), Y(f, B(n).label), X(f, "title", t), X(x, "title", a), X(S, "title", o), X(C, "title", s), X(w, "title", d), w.disabled = r === B(k).nav.items.length - 1, X(T, "title", p), X(T, "aria-label", m);
							}, [
								() => Z("tip.nav.dragItem"),
								() => Z("tip.nav.itemLabel"),
								() => Z("tip.nav.addChild"),
								() => Z("tip.moveUp"),
								() => Z("tip.nav.removeItem"),
								() => Z("tip.moveDown"),
								() => Z("tip.nav.itemActions"),
								() => Z("tip.nav.itemActions")
							]), V("click", c, () => {
								P(dm, B(i));
							}), wr("dragstart", u, (e) => {
								P(fm, B(i)), e.dataTransfer?.setData("text/plain", B(i));
							}), wr("dragend", u, vm), V("input", f, (e) => om(r, e.target.value)), V("click", x, () => Cm(r)), V("click", S, () => lm(r, -1)), V("click", C, () => um(r)), V("click", w, () => lm(r, 1)), V("click", T, () => {
								P(dm, B(i));
							}), U(t, a);
						}), D(An);
						var jn = R(An, 2), Mn = L(jn, !0), Nn = R(jn, 2), Pn = F(Nn);
						J(Pn);
						var Fn = R(Pn, 2), In = L(Fn, !0);
						D(Nn), D(kn), z((e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h, g, _, v, y, b, x, S, C, w, T, ee, te, ne, E, re, ie, ae, oe, se, ce, le, ue, de, fe, pe, me, he, ge, _e, ve, ye, be, xe, Se, Ce) => {
							W(Mn, ye), X(Nn, "title", be), X(Pn, "placeholder", xe), Fn.disabled = Se, W(In, Ce);
						}, [
							() => Z("hint.nav.logoHome"),
							() => Z("group.logo"),
							() => Z("group.appearance"),
							() => Z("group.navLayout"),
							() => Z("tip.nav.variant"),
							() => Z("lbl.navVariant"),
							() => Z("lbl.navVariant"),
							() => Z("tip.nav.sizePreset"),
							() => Z("lbl.size"),
							() => Z("tip.nav.sizePreset"),
							() => Z("lbl.adjust"),
							() => Z("tip.nav.menuTextSize"),
							() => Z("lbl.navTextSize"),
							() => Z("group.navFrame"),
							() => Z("group.navBehaviour"),
							() => Z("lbl.cart"),
							() => Z("tip.nav.cart"),
							() => Z("lbl.showInMenu"),
							() => Z("tip.nav.mobileSame"),
							() => Z("group.mobile"),
							() => Z("tip.nav.menuTextSize"),
							() => Z("lbl.navTextSize"),
							() => Z("lbl.navSameAsDesktop"),
							() => Z("tip.nav.mobileMenu"),
							() => Z("lbl.mobileMenu"),
							() => Z("group.navColours"),
							() => Z("lbl.navHover"),
							() => Z("lbl.navHover"),
							() => Z("tip.nav.hoverTextColor"),
							() => Z("lbl.hoverTextColor"),
							() => Z("tip.nav.textColorPick"),
							() => Z("lbl.textColor"),
							() => Z("tip.nav.blur"),
							() => Z("lbl.navBlur"),
							() => Z("lbl.background"),
							() => Z("tip.nav.announce"),
							() => Z("group.announcement"),
							() => Z("tip.nav.announce"),
							() => Z("lbl.announceShow"),
							() => Z("group.submenu"),
							() => Z("lbl.design"),
							() => Z("lbl.design"),
							() => Z("tip.nav.subColumns"),
							() => Z("lbl.columns"),
							() => Z("hint.nav.submenu"),
							() => Z("group.menuItems"),
							() => Z("ui.addMenuItem"),
							() => Z("tip.nav.newPageAsItem"),
							() => Z("ph.nav.newPageTitle"),
							() => !B(d).trim(),
							() => Z("ui.newPageAsItem")
						]), wr("dragover", An, ym), wr("drop", An, (e) => {
							e.preventDefault(), bm(B(pm)?.key ?? "");
						}), V("click", jn, Sm), V("keydown", Pn, (e) => {
							e.key === "Enter" && p();
						}), Ei(Pn, () => B(d), (e) => P(d, e)), V("click", Fn, p);
					}
					D(En), D(t), z((e, t, n, r, o, s, c, l, u, d, f, p, m, h, g, _, v, y, b, x, S, C, T, ee, te, E, ie, se, ce, le, ue, de, fe, pe, me, he, ge, _e, ve, ye, be, xe, we, Ee, De, D, ke, Ae, je, Ne, Le) => {
						X(i, "title", e), W(a, t), W(w, n), W(ne, r), X(re, "title", o), W(ae, s), X(oe, "aria-label", c), X(Se, "title", l), W(Ce, u), X(Te, "title", d), W(Oe, f), X(Me, "title", p), W(Pe, m), X(Fe, "min", Eo.min), X(Fe, "max", Eo.max), X(Fe, "step", Eo.step), Y(Fe, B(ts)), X(Ie, "min", Eo.min), X(Ie, "max", Eo.max), Y(Ie, B(ts)), W(Ve, h), W(Je, g), W(et, _), X(tt, "title", v), Si(nt, B(k).nav.cart?.show === !0), W(rt, ` ${y ?? ""}`), X(st, "title", b), W(ct, x), X(pt, "title", S), W(ht, C), X(gt, "min", Eo.min), X(gt, "max", Eo.max), X(gt, "placeholder", T), Y(gt, B(k).nav.style?.mobile?.textSize ?? ""), X(vt, "title", ee), W(bt, te), W(jt, E), W(Ft, ie), X(It, "aria-label", se), X(Vt, "title", ce), W(Ut, le), X(Wt, "title", ue), W(Kt, de), X(M, "title", fe), Si(qt, B(k).nav.style?.blur !== !1), W(Jt, ` ${pe ?? ""}`), W(Xt, me), X(en, "title", he), W(tn, ge), X(rn, "title", _e), Si(an, B(k).nav.announcement?.show === !0), W(on, ` ${ve ?? ""}`), W(dn, ye), W(hn, be), _n = q(gn, 1, "tile-grid svelte-1n46o8q", null, _n, {
							"cols-5": !B(Jo),
							"cols-3": B(Jo)
						}), X(gn, "aria-label", xe), X(Cn, "title", we), W(wn, `${Ee ?? ""} `), Y(Tn, B(k).nav.style?.subColumns ?? 1), X(Dn, "title", De), W(On, D);
					}, [
						() => Z("hint.nav.logoHome"),
						() => Z("group.logo"),
						() => Z("group.appearance"),
						() => Z("group.navLayout"),
						() => Z("tip.nav.variant"),
						() => Z("lbl.navVariant"),
						() => Z("lbl.navVariant"),
						() => Z("tip.nav.sizePreset"),
						() => Z("lbl.size"),
						() => Z("tip.nav.sizePreset"),
						() => Z("lbl.adjust"),
						() => Z("tip.nav.menuTextSize"),
						() => Z("lbl.navTextSize"),
						() => Z("group.navFrame"),
						() => Z("group.navBehaviour"),
						() => Z("lbl.cart"),
						() => Z("tip.nav.cart"),
						() => Z("lbl.showInMenu"),
						() => Z("tip.nav.mobileSame"),
						() => Z("group.mobile"),
						() => Z("tip.nav.menuTextSize"),
						() => Z("lbl.navTextSize"),
						() => Z("lbl.navSameAsDesktop"),
						() => Z("tip.nav.mobileMenu"),
						() => Z("lbl.mobileMenu"),
						() => Z("group.navColours"),
						() => Z("lbl.navHover"),
						() => Z("lbl.navHover"),
						() => Z("tip.nav.hoverTextColor"),
						() => Z("lbl.hoverTextColor"),
						() => Z("tip.nav.textColorPick"),
						() => Z("lbl.textColor"),
						() => Z("tip.nav.blur"),
						() => Z("lbl.navBlur"),
						() => Z("lbl.background"),
						() => Z("tip.nav.announce"),
						() => Z("group.announcement"),
						() => Z("tip.nav.announce"),
						() => Z("lbl.announceShow"),
						() => Z("group.submenu"),
						() => Z("lbl.design"),
						() => Z("lbl.design"),
						() => Z("tip.nav.subColumns"),
						() => Z("lbl.columns"),
						() => Z("hint.nav.submenu"),
						() => Z("group.menuItems"),
						() => Z("ui.addMenuItem"),
						() => Z("tip.nav.newPageAsItem"),
						() => Z("ph.nav.newPageTitle"),
						() => !B(d).trim(),
						() => Z("ui.newPageAsItem")
					]), V("input", Fe, (e) => qo("textSize", e.target.valueAsNumber)), V("change", Ie, (e) => ss(e, "textSize", Eo)), V("change", nt, (e) => sa("nav", () => {
						e.target.checked ? B(k).nav.cart = {
							...B(k).nav.cart ?? {},
							show: !0
						} : delete B(k).nav.cart;
					})), V("change", gt, (e) => cs(e, "textSize", Eo)), V("change", qt, (e) => qo("blur", e.target.checked)), V("change", an, (e) => as("show", e.target.checked ? !0 : void 0)), V("change", Tn, (e) => qo("subColumns", Number(e.target.value) > 1 ? Number(e.target.value) : void 0)), U(e, t);
				}, x = (e) => {
					var t = Bf(), n = F(t), r = F(n), i = R(r);
					J(i), D(n);
					var a = R(n, 2), o = F(a), s = R(o);
					J(s), D(a);
					var c = R(a, 2), l = F(c), u = R(l);
					{
						let e = /* @__PURE__ */ A(Lo), t = /* @__PURE__ */ A(Ho);
						Q(u, {
							get value() {
								return B(e);
							},
							get options() {
								return B(t);
							},
							onchange: (e) => Uo(e)
						});
					}
					D(c);
					var d = R(c, 4), f = L(d, !0), p = R(d, 2), m = F(p);
					Yr(m, 17, () => B(uo), (e) => e.screen, (e, t) => {
						var n = If(), r = F(n), i = L(r, !0), a = R(r, 2);
						let o;
						var s = L(a), c = L(R(a, 2), !0);
						D(n), z(() => {
							W(i, B(t).screen), o = q(a, 1, "cw-bar svelte-1n46o8q", null, o, { fluid: !B(t).bound }), _i(s, `width:${B(t).pct ?? ""}%`), W(c, B(t).bound ? `${B(t).margin}` : "-");
						}), U(e, n);
					});
					var h = R(m, 2), g = F(h), v = L(g, !0), y = L(R(g, 2), !0);
					D(h);
					var b = R(h, 2), x = (e) => {
						var t = Lf(), n = L(t, !0);
						z((e) => W(n, e), [() => Z("lbl.bindsFrom", { n: B(Ee) })]), U(e, t);
					};
					G(b, (e) => {
						B(Za) !== "full" && e(x);
					}), D(p);
					var S = R(p, 2);
					Yr(S, 21, () => vo, (e) => e.id, (e, t) => {
						var n = Hd();
						let r;
						var i = L(n, !0);
						z((e) => {
							r = q(n, 1, "svelte-1n46o8q", null, r, { on: B($a) === B(t).id }), W(i, e);
						}, [() => Z(`lbl.width.${B(t).id}`)]), V("click", n, () => Po(B(t).width)), U(e, n);
					}), D(S);
					var C = R(S, 2), w = (e) => {
						var t = Rf(), n = F(t), r = L(n, !0), i = R(n, 2);
						J(i);
						var a = L(R(i, 2));
						D(t), z((e, n) => {
							X(t, "title", e), W(r, n), X(i, "min", 960), X(i, "max", go), X(i, "step", 20), Y(i, B(io)), W(a, `${B(io) ?? ""} px`);
						}, [() => Z("tip.site.contentWidthFree"), () => Z("lbl.widthFree")]), V("input", i, (e) => Po(e.target.valueAsNumber)), U(e, t);
					};
					G(C, (e) => {
						B(Za) !== "full" && e(w);
					});
					var T = R(C, 2), ee = L(T, !0), te = R(T, 2);
					Yr(te, 21, () => _o, (e) => e.id, (e, t) => {
						var n = Hd();
						let r;
						var i = L(n, !0);
						z((e) => {
							r = q(n, 1, "svelte-1n46o8q", null, r, { on: B(eo) === B(t).id }), W(i, e);
						}, [() => Z(`lbl.gutter.${B(t).id}`)]), V("click", n, () => Io(B(t).gutter)), U(e, n);
					}), D(te);
					var ne = R(te, 2), E = F(ne), re = L(E, !0), ie = R(E, 2), ae = F(ie), oe = F(ae), se = L(oe, !0), ce = R(oe, 2);
					J(ce);
					var le = L(R(ce, 2));
					D(ae), D(ie), D(ne);
					var ue = R(ne, 4), de = F(ue), fe = R(de), pe = (e) => {
						var t = ef();
						z((e) => {
							X(t, "src", B(k).site.icon), X(t, "alt", e);
						}, [() => Z("lbl.siteIcon")]), U(e, t);
					};
					G(fe, (e) => {
						B(k).site.icon && e(pe);
					}), D(ue);
					var me = R(ue, 2), he = F(me), ge = F(he), _e = R(ge);
					D(he);
					var ve = R(he, 2), ye = (e) => {
						var t = zf(), n = I(t);
						K(n, () => _.pencil ?? "✎", !0), D(n);
						var r = R(n, 2);
						K(r, () => _.cross, !0), D(r), z((e, t) => {
							X(n, "title", e), X(r, "title", t);
						}, [() => Z("tip.site.editIcon"), () => Z("tip.site.removeIcon")]), V("click", n, () => P(Wa, B(k).site.icon, !0)), V("click", r, qa), U(e, t);
					};
					G(ve, (e) => {
						B(k).site.icon && e(ye);
					}), D(me), D(t), z((e, t, u, p, m, h, g, _, b, x, S, C, w, te, E, ie, oe, ue, fe, pe) => {
						X(n, "title", e), W(r, `${t ?? ""} `), Y(i, B(k).site.title ?? ""), X(i, "placeholder", u), X(a, "title", p), W(o, `${m ?? ""} `), Y(s, B(k).site.description ?? ""), X(s, "placeholder", h), X(c, "title", g), W(l, `${_ ?? ""} `), X(d, "title", b), W(f, x), W(v, S), W(y, C), X(T, "title", w), W(ee, te), ne.open = B(eo) === null || B(to), W(re, E), X(ae, "title", ie), W(se, oe), X(ce, "min", 0), X(ce, "max", 12), X(ce, "step", 1), Y(ce, B(Qa)), W(le, `${B(Qa) ?? ""} vw`), W(de, `${ue ?? ""} `), X(he, "title", fe), W(ge, `${pe ?? ""} `);
					}, [
						() => Z("tip.site.name"),
						() => Z("lbl.name"),
						() => Z("ph.site.name"),
						() => Z("tip.site.description"),
						() => Z("lbl.description"),
						() => Z("ph.site.description"),
						() => Z("site.langTitle"),
						() => Z("site.langLabel"),
						() => Z("tip.site.contentWidth"),
						() => Z("lbl.contentWidth"),
						() => Z("lbl.screenPx"),
						() => Z("lbl.marginPx"),
						() => Z("tip.site.gutter"),
						() => Z("lbl.gutter"),
						() => Z("group.advanced"),
						() => Z("tip.site.gutterVw"),
						() => Z("lbl.gutterVw"),
						() => Z("lbl.siteIcon"),
						() => Z("tip.site.icon"),
						() => B(k).site.icon ? Z("ui.changeIcon") : Z("ui.chooseIcon")
					]), V("input", i, (e) => Ja(e.target.value)), V("input", s, (e) => Ya(e.target.value)), wr("toggle", ne, (e) => P(to, e.currentTarget.open, !0)), V("input", ce, (e) => Io(e.target.valueAsNumber)), V("change", _e, Ga), U(e, t);
				}, C = (e) => {
					var t = Jf();
					{
						let e = (e, t = f, n = f) => {
							var r = Hf(), i = F(r), a = (e) => {
								var t = Vf(), r = L(t, !0);
								z(() => W(r, n())), U(e, t);
							};
							G(i, (e) => {
								n() && e(a);
							});
							var o = R(i, 2), s = F(o), c = L(s, !0), l = R(s, 2), u = L(l, !0), d = R(l, 2), p = F(d), m = L(p, !0), h = L(R(p), !0);
							D(d), D(o), D(r), z((e, t, n, r, i, a, s, l, d) => {
								_i(o, `--tv-bg:${e ?? ""};--tv-surface:${t ?? ""};--tv-text:${n ?? ""};--tv-accent:${r ?? ""};--tv-accent-ink:${i ?? ""}`), W(c, a), W(u, s), W(m, l), W(h, d);
							}, [
								() => Zm(t().bg, t()),
								() => Zm(t().surface, t()),
								() => Zm(t().text, t()),
								() => Zm(t().accent, t()),
								() => Zm(t()["accent-text"] ?? S(Zm(t().accent ?? "#000000", t())), t()),
								() => Z("preview.heading"),
								() => Z("preview.cardBody"),
								() => Z("preview.button"),
								() => Z("preview.link")
							]), U(e, r);
						};
						var n = F(t), r = L(n, !0), i = R(n, 2);
						Yr(i, 21, () => $m, (e) => e.id, (e, t) => {
							var n = Uf();
							let r;
							var i = F(n), a = F(i), o = R(a), s = R(o), c = R(s);
							D(i);
							var l = L(R(i, 2), !0);
							D(n), z(() => {
								r = q(n, 1, "theme-preset svelte-1n46o8q", null, r, { sel: B(th) === B(t).id }), X(n, "title", `${B(t).name} - ${B(t).note}`), _i(a, `background:${B(t).light.bg ?? ""}`), _i(o, `background:${B(t).light.surface ?? ""}`), _i(s, `background:${B(t).light.accent ?? ""}`), _i(c, `background:${B(t).light.text ?? ""}`), W(l, B(t).name);
							}), V("click", n, () => eh(B(t))), U(e, n);
						}), D(i);
						var a = R(i, 2), o = L(a, !0), s = R(a, 2), c = F(s);
						J(c);
						var l = R(c);
						D(s);
						var u = R(s, 2), d = (e) => {
							var t = Wf(), n = F(t), r = L(n, !0), i = R(n, 2), a = F(i);
							let o;
							var s = L(a, !0), c = R(a, 2);
							let l;
							var u = L(c, !0);
							D(i), D(t), z((e, t, n, i) => {
								W(r, e), X(a, "title", t), o = q(a, 1, "svelte-1n46o8q", null, o, { on: B(Hr) }), W(s, n), l = q(c, 1, "svelte-1n46o8q", null, l, { on: !B(Hr) }), W(u, i);
							}, [
								() => Z("lbl.darkColors"),
								() => Z("hint.theme.autoDark"),
								() => Z("opt.auto"),
								() => Z("opt.custom")
							]), V("click", a, () => qm(!0)), V("click", c, () => qm(!1)), U(e, t);
						};
						G(u, (e) => {
							B(Vr) && e(d);
						});
						var p = R(u, 2), m = F(p), g = (e) => {
							var t = Gf(), n = L(t, !0);
							z((e) => W(n, e), [() => Z("lbl.light")]), U(e, t);
						};
						G(m, (e) => {
							B(Vr) && e(g);
						});
						var _ = R(m, 2);
						let Ie;
						var v = L(_, !0);
						D(p);
						var y = R(p, 2);
						Yr(y, 21, () => Br, ([e, t, n]) => e, (e, t) => {
							var n = /* @__PURE__ */ A(() => h(B(t), 3));
							let r = () => B(n)[0], i = () => B(n)[1], a = () => B(n)[2];
							var o = Kf(), s = F(o);
							{
								let e = /* @__PURE__ */ A(() => B(k).theme.tokens.color[r()] ?? Am(r(), B(Wr))), t = /* @__PURE__ */ A(zr);
								ha(s, {
									get value() {
										return B(e);
									},
									get tokens() {
										return B(t);
									},
									get label() {
										return i();
									},
									onchange: (e) => km(r(), e)
								});
							}
							var c = R(s, 2), l = L(c, !0), u = L(R(c, 2), !0);
							D(o), z((e) => {
								W(l, a()), W(u, e);
							}, [() => Zm(B(k).theme.tokens.color[r()] ?? Am(r(), B(Wr)), B(Wr))]), U(e, o);
						}), D(y);
						var b = R(y, 2), x = (e) => {
							var t = qf(), n = I(t), r = F(n), i = L(r, !0), a = R(r, 2);
							let o;
							var s = L(a, !0);
							D(n);
							var c = R(n, 2);
							let l;
							Yr(c, 21, () => Br, ([e, t, n]) => e, (e, t) => {
								var n = /* @__PURE__ */ A(() => h(B(t), 3));
								let r = () => B(n)[0], i = () => B(n)[1], a = () => B(n)[2];
								var o = Kf(), s = F(o);
								{
									let e = /* @__PURE__ */ A(() => B(k).theme.alt.tokens.color[r()] ?? B(Kr)[r()] ?? Am(r(), B(Kr))), t = /* @__PURE__ */ A(zr), n = /* @__PURE__ */ A(() => Z("theme.darkColorLabel", { name: i() }));
									ha(s, {
										get value() {
											return B(e);
										},
										get tokens() {
											return B(t);
										},
										get label() {
											return B(n);
										},
										onchange: (e) => Wm(r(), e)
									});
								}
								var c = R(s, 2), l = L(c, !0), u = L(R(c, 2), !0);
								D(o), z((e) => {
									W(l, a()), W(u, e);
								}, [() => Zm(B(k).theme.alt.tokens.color[r()] ?? B(Kr)[r()] ?? Am(r(), B(Kr)), B(Kr))]), U(e, o);
							}), D(c), z((e, t, n) => {
								W(i, e), o = q(a, 1, "chip svelte-1n46o8q", null, o, { accent: B(Ur) === "dark" }), X(a, "title", t), W(s, n), l = q(c, 1, "palcells svelte-1n46o8q", null, l, { autopal: B(Hr) });
							}, [
								() => Z("lbl.dark"),
								() => Z("tip.theme.darkDefault"),
								() => Z("common.standard")
							]), V("click", a, () => Gm("dark")), U(e, t);
						};
						G(b, (e) => {
							B(Vr) && e(x);
						});
						var C = R(b, 2), w = F(C), T = L(w, !0), ee = R(w, 2);
						let Le;
						var te = L(ee, !0);
						D(C);
						var ne = R(C, 2), E = F(ne);
						{
							let t = /* @__PURE__ */ A(() => B(Vr) ? Z("lbl.light") : "");
							e(E, () => B(Wr), () => B(t));
						}
						var re = R(E, 2), ie = (t) => {
							{
								let n = /* @__PURE__ */ A(() => Z("lbl.dark"));
								e(t, () => B(Kr), () => B(n));
							}
						};
						G(re, (e) => {
							B(Vr) && e(ie);
						}), D(ne);
						var ae = R(ne, 2), oe = F(ae), se = L(oe, !0), ce = R(oe, 2), le = F(ce), ue = F(le), de = R(ue);
						{
							let e = /* @__PURE__ */ A(() => Jm("heading"));
							Q(de, {
								get value() {
									return B(k).theme.tokens.font.heading;
								},
								get options() {
									return B(e);
								},
								onchange: (e) => Bm("heading", e)
							});
						}
						D(le);
						var fe = R(le, 2), pe = F(fe), me = R(pe);
						{
							let e = /* @__PURE__ */ A(() => Jm("body"));
							Q(me, {
								get value() {
									return B(k).theme.tokens.font.body;
								},
								get options() {
									return B(e);
								},
								onchange: (e) => Bm("body", e)
							});
						}
						D(fe);
						var he = R(fe, 2), ge = F(he), _e = L(ge, !0), ve = R(ge, 2), ye = L(ve, !0);
						D(he), D(ce), D(ae);
						var be = R(ae, 2), xe = F(be), Se = L(xe, !0), Ce = R(xe, 2), we = F(Ce), Te = F(we), Ee = L(Te, !0), De = L(R(Te, 2), !0);
						D(we);
						var Oe = R(we, 2), ke = F(Oe, !0), Ae = L(R(ke), !0);
						D(Oe);
						var je = R(Oe, 2);
						J(je);
						var Me = R(je, 2), Ne = F(Me, !0), Pe = L(R(Ne), !0);
						D(Me);
						var Fe = R(Me, 2);
						J(Fe), D(Ce), D(be), D(t), z((e, t, n, i, a, u, d, f, p, m, h, g, y, b, x, S, w, ne, E, re, ie) => {
							W(r, e), W(o, t), X(s, "title", n), Si(c, B(Vr)), W(l, ` ${i ?? ""}`), Ie = q(_, 1, "chip svelte-1n46o8q", null, Ie, { accent: B(Ur) === "light" }), X(_, "title", a), W(v, u), X(C, "title", d), W(T, f), Le = q(ee, 1, "chip palauto svelte-1n46o8q", null, Le, { accent: B(jm) }), W(te, p), W(se, m), W(ue, `${h ?? ""} `), W(pe, `${g ?? ""} `), _i(ge, `font-family:${B(k).theme.tokens.font.heading ?? ""}`), W(_e, y), _i(ve, `font-family:${B(k).theme.tokens.font.body ?? ""}`), W(ye, b), W(Se, x), _i(we, `--r-sm:${B(k).theme.tokens.radius.sm ?? ""};--r-md:${B(k).theme.tokens.radius.md ?? ""}`), W(Ee, S), W(De, w), W(ke, ne), W(Ae, B(k).theme.tokens.radius.sm), Y(je, E), W(Ne, re), W(Pe, B(k).theme.tokens.radius.md), Y(Fe, ie);
						}, [
							() => Z("lbl.themePresets"),
							() => Z("lbl.colors"),
							() => Z("tip.theme.dualMode"),
							() => Z("lbl.dualMode"),
							() => Z("tip.theme.defaultScheme"),
							() => Z("common.standard"),
							() => Z("tip.theme.accentTextAuto"),
							() => Z("palette.accentText"),
							() => Z("opt.auto"),
							() => Z("group.typography"),
							() => Z("lbl.headings"),
							() => Z("lbl.bodyText"),
							() => Z("preview.heading"),
							() => Z("preview.bodySample"),
							() => Z("group.shape"),
							() => Z("preview.button"),
							() => Z("preview.card"),
							() => Z("lbl.smallCorners"),
							() => Ym(B(k).theme.tokens.radius.sm),
							() => Z("lbl.largeCorners"),
							() => Ym(B(k).theme.tokens.radius.md)
						]), V("change", c, (e) => Km(e.target.checked)), V("click", _, () => Gm("light")), V("click", ee, () => zm(!B(jm))), V("input", je, (e) => Xm("sm", Number(e.target.value))), V("input", Fe, (e) => Xm("md", Number(e.target.value)));
					}
					U(e, t);
				}, T = (e) => {
					var t = $f();
					let n;
					var r = F(t);
					J(r);
					var i = R(r, 2), a = (e) => {
						var t = Pr();
						Yr(I(t), 17, () => jc(Eh(), B(Th), (e) => e.label), (e) => e.label, (e, t) => {
							var n = Pr(), r = I(n), i = (e) => {
								var n = Yf(), r = F(n), i = R(r);
								D(n), z((e) => {
									X(n, "title", e), W(r, `${B(t).label ?? ""} `);
								}, [() => Z("tip.webpAuto")]), V("change", i, kh), U(e, n);
							}, a = (e) => {
								var n = Xf(), r = F(n), i = R(r);
								D(n), z((e) => {
									X(n, "title", e), W(r, `${B(t).label ?? ""} `);
								}, [() => Z("tip.blocks.galleryImages")]), V("change", i, Nh), U(e, n);
							}, o = (e) => {
								var n = Mu(), r = L(n, !0);
								z(() => W(r, B(t).label)), V("click", n, () => Dh(B(t))), U(e, n);
							};
							G(r, (e) => {
								B(t).act === "image" ? e(i) : B(t).act === "galleryImages" ? e(a, 1) : e(o, -1);
							}), U(e, n);
						}, (e) => {
							var t = hu(), n = L(t, !0);
							z((e) => W(n, e), [() => Z("canvas.searchEmpty")]), U(e, t);
						}), U(e, t);
					}, o = /* @__PURE__ */ A(() => B(Th).trim()), s = (e) => {
						var t = Qf(), n = I(t), r = F(n), i = L(r, !0), a = R(r, 2), o = F(a), s = L(o, !0), c = R(o, 2), l = L(c, !0);
						D(a), D(n);
						var u = R(n, 2), d = L(u, !0), f = R(u, 2), p = F(f), m = R(p);
						D(f);
						var h = R(f, 2), g = L(h, !0), _ = R(h, 2), v = L(_, !0), y = R(_, 2), b = L(y, !0), x = R(y, 2), S = L(x, !0), C = R(x, 2), w = L(C, !0), T = R(C, 2), ee = L(T, !0), te = R(T, 2), ne = L(te, !0), E = R(te, 2), re = L(E, !0), ie = R(E, 2), ae = L(ie, !0), oe = R(ie, 2), se = L(oe, !0), ce = R(oe, 2), le = L(ce, !0), ue = R(ce, 2), de = L(ue, !0), fe = R(ue, 2), pe = L(fe, !0), me = R(fe, 2), he = L(me, !0), ge = R(me, 2), _e = L(ge, !0), ve = R(ge, 2), ye = L(ve, !0), be = R(ve, 2), xe = F(be), Se = L(xe, !0), Ce = R(xe, 2), we = F(Ce), Te = L(we, !0), Ee = R(we, 2), De = F(Ee), Oe = R(De);
						D(Ee), D(Ce), D(be);
						var ke = R(be, 2), Ae = F(ke), je = L(Ae, !0), Me = R(Ae, 2), Ne = F(Me), Pe = L(Ne, !0), Fe = R(Ne, 2), Ie = L(Fe, !0), Le = R(Fe, 2), Re = L(Le, !0), ze = R(Le, 2), Be = L(ze, !0);
						D(Me), D(ke);
						var Ve = R(ke, 2), O = F(Ve), He = L(O, !0), k = R(O, 2), We = F(k), Ge = L(We, !0), Ke = R(We, 2), qe = L(Ke, !0), Je = R(Ke, 2), Ye = L(Je, !0), Xe = R(Je, 2), Ze = L(Xe, !0), Qe = R(Xe, 2), $e = L(Qe, !0);
						D(k), D(Ve);
						var et = R(Ve, 2), tt = (e) => {
							let t = /* @__PURE__ */ A(() => B(Fs).filter((e) => Ms[e]?.data?.mal?.kind === "blocks"));
							var n = Zf(), r = F(n), i = L(r, !0), a = R(r, 2);
							Yr(a, 20, () => B(t), (e) => e, (e, t) => {
								var n = Mu(), r = L(n, !0);
								z((e) => {
									X(n, "title", e), W(r, Ms[t].data.mal.name);
								}, [() => Z("canvas.insertGroup")]), V("click", n, () => Ue?.sendInsertTemplate(t)), U(e, n);
							}), D(a), D(n), z((e) => W(i, e), [() => Z("canvas.tabMyTemplates")]), U(e, n);
						}, nt = /* @__PURE__ */ A(() => B(Fs).some((e) => Ms[e]?.data?.mal?.kind === "blocks"));
						G(et, (e) => {
							B(nt) && e(tt);
						});
						var rt = R(et, 2), it = (e) => {
							var t = Zf(), n = F(t), r = L(n, !0), i = R(n, 2);
							Yr(i, 21, () => B(Sh), (e) => e.type, (e, t) => {
								var n = Pr(), r = I(n), i = (e) => {
									var n = Zf(), r = F(n), i = L(r, !0), a = R(r, 2);
									Yr(a, 21, () => B(t).variants, (e) => e.label, (e, n) => {
										var r = Mu(), i = L(r, !0);
										z((e) => {
											X(r, "title", e), W(i, B(n).label);
										}, [() => Z("tip.blocks.fromPlugin", { plugin: B(t).plugin })]), V("click", r, () => wh(B(t), B(n).props)), U(e, r);
									}), D(a), D(n), z(() => W(i, B(t).label)), U(e, n);
								}, a = (e) => {
									var n = Mu(), r = L(n, !0);
									z((e) => {
										X(n, "title", e), W(r, B(t).label);
									}, [() => Z("tip.blocks.fromPlugin", { plugin: B(t).plugin })]), V("click", n, () => wh(B(t))), U(e, n);
								};
								G(r, (e) => {
									B(t).variants?.length ? e(i) : e(a, -1);
								}), U(e, n);
							}), D(i), D(t), z((e) => W(r, e), [() => Z("panel.plugins")]), U(e, t);
						};
						G(rt, (e) => {
							B(Sh).length && e(it);
						}), z((e, t, n, r, a, o, u, m, be, xe, Ce, D, Oe, ke, Ae, Me, Ve, O, Ue, k, We, Ke, Je, Xe, Qe, et, tt, nt, rt, it, at, ot, st, ct, lt, ut, dt, ft, pt, mt, ht, gt, _t, vt, yt, bt, xt, A, St, Ct, wt, Tt, Et, Dt, Ot, kt, At, jt, Mt) => {
							W(i, e), W(s, t), X(c, "title", n), W(l, r), W(d, a), X(f, "title", o), W(p, `${u ?? ""} `), X(h, "title", m), W(g, be), X(_, "title", xe), W(v, Ce), X(y, "title", D), W(b, Oe), X(x, "title", ke), W(S, Ae), X(C, "title", Me), W(w, Ve), X(T, "title", O), W(ee, Ue), X(te, "title", k), W(ne, We), X(E, "title", Ke), W(re, Je), X(ie, "title", Xe), W(ae, Qe), X(oe, "title", et), W(se, tt), X(ce, "title", nt), W(le, rt), X(ue, "title", it), W(de, at), X(fe, "title", ot), W(pe, st), X(me, "title", ct), W(he, lt), X(ge, "title", ut), W(_e, dt), X(ve, "title", ft), W(ye, pt), W(Se, mt), X(we, "title", ht), W(Te, gt), X(Ee, "title", _t), W(De, `${vt ?? ""} `), W(je, yt), X(Ne, "title", bt), W(Pe, xt), X(Fe, "title", A), W(Ie, St), X(Le, "title", Ct), W(Re, wt), X(ze, "title", Tt), W(Be, Et), W(He, Dt), W(Ge, Ot), W(qe, kt), W(Ye, At), W(Ze, jt), W($e, Mt);
						}, [
							() => Z("blocks.text"),
							() => Z("blocks.text"),
							() => Z("tip.blocks.textBox"),
							() => Z("ui.textBox"),
							() => Z("blocks.button"),
							() => Z("tip.webpAuto"),
							() => Z("blocks.image"),
							() => Z("tip.blocks.video"),
							() => Z("blocks.video"),
							() => Z("tip.blocks.icon"),
							() => Z("blocks.icon"),
							() => Z("tip.blocks.map"),
							() => Z("blocks.map"),
							() => Z("tip.blocks.form"),
							() => Z("blocks.form"),
							() => Z("tip.blocks.collection"),
							() => Z("blocks.collection"),
							() => Z("tip.blocks.faq"),
							() => Z("blocks.faq"),
							() => Z("tip.blocks.timeline"),
							() => Z("blocks.timeline"),
							() => Z("tip.blocks.quote"),
							() => Z("blocks.quote"),
							() => Z("tip.blocks.stats"),
							() => Z("blocks.stats"),
							() => Z("tip.blocks.table"),
							() => Z("blocks.table"),
							() => Z("tip.blocks.share"),
							() => Z("blocks.share"),
							() => Z("tip.blocks.countdown"),
							() => Z("blocks.countdown"),
							() => Z("tip.blocks.audio"),
							() => Z("blocks.audio"),
							() => Z("tip.blocks.product"),
							() => Z("blocks.product"),
							() => Z("tip.blocks.cart"),
							() => Z("blocks.cart"),
							() => Z("tip.blocks.checkout"),
							() => Z("blocks.checkout"),
							() => Z("blocks.gallery"),
							() => Z("tip.blocks.gallery"),
							() => Z("ui.emptyGallery"),
							() => Z("tip.blocks.galleryImages"),
							() => Z("ui.galleryWithImages"),
							() => Z("blocks.calendar"),
							() => Z("tip.blocks.calendar"),
							() => Z("calendar.viewList"),
							() => Z("tip.blocks.calendar"),
							() => Z("calendar.viewCards"),
							() => Z("tip.blocks.calendar"),
							() => Z("calendar.viewMonth"),
							() => Z("tip.blocks.calendar"),
							() => Z("calendar.viewNext"),
							() => Z("group.shapes"),
							() => Z("shape.line"),
							() => Z("shape.arrow"),
							() => Z("shape.circle"),
							() => Z("shape.rect"),
							() => Z("shape.triangle")
						]), V("click", o, () => xh("text")), V("click", c, () => xh("text-box")), V("click", u, () => xh("button")), V("change", m, kh), V("click", h, () => xh("video")), V("click", _, () => xh("icon")), V("click", y, () => xh("map")), V("click", x, () => xh("form")), V("click", C, () => xh("collection")), V("click", T, () => xh("faq")), V("click", te, () => xh("timeline")), V("click", E, () => xh("quote")), V("click", ie, () => xh("stats")), V("click", oe, () => xh("table")), V("click", ce, () => xh("share")), V("click", ue, () => xh("countdown")), V("click", fe, () => xh("audio")), V("click", me, () => xh("product")), V("click", ge, () => xh("cart")), V("click", ve, () => xh("checkout")), V("click", we, () => xh("gallery")), V("change", Oe, Nh), V("click", Ne, () => xh("calendar")), V("click", Fe, () => xh("calendar-cards")), V("click", Le, () => xh("calendar-month")), V("click", ze, () => xh("calendar-next")), V("click", We, () => xh("shape-line")), V("click", Ke, () => xh("shape-arrow")), V("click", Je, () => xh("shape-circle")), V("click", Xe, () => xh("shape-rect")), V("click", Qe, () => xh("shape-triangle")), U(e, t);
					};
					G(i, (e) => {
						B(o) ? e(a) : e(s, -1);
					}), D(t), z((e, i, a) => {
						n = q(t, 1, "panel-body svelte-1n46o8q", null, n, { locked: B(be) === "mobile" }), X(t, "title", e), X(r, "placeholder", i), X(r, "title", a);
					}, [
						() => B(be) === "mobile" ? Z("tip.blocks.mobileLocked") : void 0,
						() => Z("canvas.searchBlocks"),
						() => Z("canvas.searchBlocks")
					]), Ei(r, () => B(Th), (e) => P(Th, e)), U(e, t);
				}, ee = (e) => {
					var t = ep(), n = F(t), r = F(n), i = L(R(r));
					D(n);
					var a = R(n, 2);
					J(a);
					var o = R(a, 2), s = F(o);
					J(s);
					var c = R(s);
					D(o), D(t), z((e, t) => {
						W(r, `${e ?? ""} `), W(i, `${B(se).size ?? ""} px`), Y(a, B(se).size), Si(s, B(se).snap !== !1), W(c, ` ${t ?? ""}`);
					}, [() => Z("lbl.gridSize"), () => Z("lbl.gridSnap")]), V("input", a, (e) => fi("size", Number(e.target.value))), V("change", s, (e) => fi("snap", e.target.checked)), U(e, t);
				}, te = (e) => {
					var t = sp(), r = F(t), i = (e) => {
						var t = tp(), n = I(t), r = L(n, !0), i = R(n, 2);
						a(i), z((e) => W(r, e), [() => Z("blocks.suffix", { label: Nn[B(j).type] ?? B(j).type })]), U(e, t);
					}, o = (e) => {
						var t = op(), r = I(t), i = L(r, !0), a = R(r, 2), o = F(a), s = R(o);
						J(s), D(a);
						var c = R(a, 4), l = F(c);
						J(l);
						var u = R(l);
						D(c);
						var d = R(c, 2), f = (e) => {
							var t = np(), n = I(t), r = F(n), i = L(R(r));
							D(n);
							var a = R(n, 2);
							J(a), z((e) => {
								W(r, `${e ?? ""} `), W(i, `${B(Ln).size ?? ""} px`), Y(a, B(Ln).size);
							}, [() => Z("lbl.gridSize")]), V("input", a, (e) => di("size", Number(e.target.value))), U(e, t);
						};
						G(d, (e) => {
							B(Ln) && e(f);
						});
						var p = R(d, 4), m = L(p, !0), g = R(p, 2);
						Yr(g, 21, () => [["", "common.standard"], ...Object.entries(zc)], ([e, t]) => e, (e, t) => {
							var n = /* @__PURE__ */ A(() => h(B(t), 2));
							let r = () => B(n)[0], i = () => B(n)[1], a = /* @__PURE__ */ A(() => Jn(r()));
							var o = rp();
							let s;
							var c = F(o), l = F(c), u = R(l, 2), d = R(u, 2);
							D(c);
							var f = L(R(c, 2), !0);
							D(o), z((e, t) => {
								s = q(o, 1, "rs-card svelte-1n46o8q", null, s, { on: B(Hn) === r() }), X(o, "title", e), _i(c, `background: ${B(a).bg ?? ""}`), _i(l, `background: ${B(a).text ?? ""}`), _i(u, `background: ${B(a).surface ?? ""}`), _i(d, `background: ${B(a).accent ?? ""}`), W(f, t);
							}, [() => Z("tip.props.sectionTheme"), () => Z(i())]), V("click", o, () => qn(r())), U(e, o);
						}), D(g);
						var v = R(g, 2), y = F(v), b = R(y), x = F(b), S = L(x), C = R(x, 2);
						K(C, () => _.copy, !0), D(C), D(b), D(v);
						var w = R(v, 4), T = L(w, !0), ee = R(w, 2);
						n(ee, () => B(H), () => B(zn));
						var te = R(ee, 4), ne = F(te), E = R(ne);
						{
							let e = /* @__PURE__ */ A(() => Jr(B(Bn)) ? B(Bn).type : "");
							Q(E, {
								get value() {
									return B(e);
								},
								get options() {
									return Xr;
								},
								onchange: (e) => ri(e || null)
							});
						}
						D(te);
						var re = R(te, 2), ie = (e) => {
							var t = ap(), n = I(t), r = F(n), i = R(r);
							J(i), D(n);
							var a = R(n, 2), o = F(a), s = R(o);
							J(s), D(a);
							var c = R(a, 2), l = (e) => {
								var t = ip(), n = I(t), r = F(n), i = R(r);
								{
									let e = /* @__PURE__ */ A(() => B(Bn).props.effect ?? "slide-up"), t = /* @__PURE__ */ A(() => [
										["fade-in", Z("anim.fadeIn")],
										["slide-up", Z("anim.slideUp")],
										["zoom-in", Z("anim.zoomIn")]
									]);
									Q(i, {
										get value() {
											return B(e);
										},
										get options() {
											return B(t);
										},
										onchange: (e) => oi("effect", e)
									});
								}
								D(n);
								var a = R(n, 2), o = F(a), s = R(o);
								J(s), D(a);
								var c = R(a, 2), l = F(c), u = R(l);
								{
									let e = /* @__PURE__ */ A(() => B(Bn).props.pattern ?? "sequence"), t = /* @__PURE__ */ A(() => [
										["sequence", Z("opt.stagger.sequence")],
										["columns", Z("opt.stagger.columns")],
										["rows", Z("opt.stagger.rows")],
										["center", Z("opt.stagger.center")]
									]);
									Q(u, {
										get value() {
											return B(e);
										},
										get options() {
											return B(t);
										},
										onchange: (e) => oi("pattern", e)
									});
								}
								D(c), z((e, t, i, u, d, f) => {
									X(n, "title", e), W(r, `${t ?? ""} `), X(a, "title", i), W(o, `${u ?? ""} `), Y(s, B(Bn).props.step ?? 90), X(c, "title", d), W(l, `${f ?? ""} `);
								}, [
									() => Z("tip.props.staggerEffect"),
									() => Z("lbl.staggerEffect"),
									() => Z("tip.props.staggerStep"),
									() => Z("lbl.stepMs"),
									() => Z("tip.props.staggerPattern"),
									() => Z("lbl.pattern")
								]), V("change", s, (e) => ai("step", Number(e.target.value))), U(e, t);
							};
							G(c, (e) => {
								B(Bn).type === "stagger" && e(l);
							}), z((e, t) => {
								W(r, `${e ?? ""} `), Y(i, B(Bn).props.duration), W(o, `${t ?? ""} `), Y(s, B(Bn).props.delay ?? 0);
							}, [() => Z("lbl.durationMs"), () => Z("lbl.delayMs")]), V("change", i, (e) => ai("duration", Number(e.target.value))), V("change", s, (e) => ai("delay", Number(e.target.value))), U(e, t);
						}, ae = /* @__PURE__ */ A(() => Jr(B(Bn)));
						G(re, (e) => {
							B(ae) && e(ie);
						});
						var oe = R(re, 2), se = F(oe), ce = R(se);
						{
							let e = /* @__PURE__ */ A(() => B(Vn)?.type ?? (B(Bn) && !Jr(B(Bn)) ? B(Bn).type : ""));
							Q(ce, {
								get value() {
									return B(e);
								},
								get options() {
									return Qr;
								},
								onchange: (e) => ii(e || null)
							});
						}
						D(oe), z((e, t, n, r, c, d, f, h, g, _, b, x, w, ee, E) => {
							W(i, e), X(a, "title", t), W(o, `${n ?? ""} `), Y(s, B(Rn)), X(s, "placeholder", r), Si(l, B(Ln) !== null), W(u, ` ${c ?? ""}`), X(p, "title", d), W(m, f), X(v, "title", h), W(y, `${g ?? ""} `), W(S, `#${B(In) ?? ""}`), X(C, "title", _), W(T, b), X(te, "title", x), W(ne, `${w ?? ""} `), X(oe, "title", ee), W(se, `${E ?? ""} `);
						}, [
							() => Z("lbl.section"),
							() => Z("hint.props.minHeight"),
							() => Z("lbl.minHeight"),
							() => Z("ph.minHeight"),
							() => Z("lbl.sectionGrid"),
							() => Z("tip.props.sectionTheme"),
							() => Z("lbl.sectionTheme"),
							() => Z("tip.props.anchor"),
							() => Z("lbl.anchor"),
							() => Z("tip.props.copyAnchor"),
							() => Z("lbl.background"),
							() => Z("tip.props.sectionAnim"),
							() => Z("lbl.animIn"),
							() => Z("tip.props.sectionHover"),
							() => Z("lbl.onHover")
						]), V("change", s, (e) => si(e.target.value)), V("change", l, (e) => ui(e.target.checked)), V("click", C, () => navigator.clipboard?.writeText(`#${B(In)}`)), U(e, t);
					}, s = (e) => {
						var t = hu(), n = L(t, !0);
						z((e) => W(n, e), [() => Z("hint.props.empty")]), U(e, t);
					};
					G(r, (e) => {
						B(j) ? e(i) : B(In) ? e(o, 1) : e(s, -1);
					}), D(t), U(e, t);
				}, ne = (e) => {
					var t = hp(), i = F(t), a = F(i);
					J(a);
					var o = R(a);
					D(i);
					var s = R(i, 2), c = (e) => {
						var t = Zf(), n = F(t), r = L(n, !0), i = R(n, 2);
						Yr(i, 21, () => B(k).pages ?? [], (e) => e.id, (e, t) => {
							var n = Au(), r = F(n);
							J(r);
							var i = R(r);
							D(n), z((e, a) => {
								X(n, "title", e), Si(r, a), W(i, ` ${(B(t).title || B(t).id) ?? ""}`);
							}, [() => Z("tip.footer.hideOnPage"), () => !(B(k).footer?.hideOn ?? []).includes(B(t).id)]), V("change", r, (e) => kl(B(t).id, e.target.checked)), U(e, n);
						}), D(i), D(t), z((e) => W(r, e), [() => Z("group.showOnPages")]), U(e, t);
					};
					G(s, (e) => {
						B(k).footer?.show && e(c);
					});
					var l = R(s, 2), u = F(l), d = L(u, !0), f = R(u, 2), p = F(f);
					Yr(p, 21, () => hl, (e) => e.id, (e, t) => {
						var n = cp(), r = F(n);
						K(r, () => Bl(B(t).thumb), !0), D(r);
						var i = L(R(r, 2), !0);
						D(n), z((e) => {
							X(n, "title", e), W(i, B(t).label);
						}, [() => Z("tip.footer.template", { label: B(t).label })]), V("click", n, () => _l(B(t).id)), U(e, n);
					}), D(p), D(f), D(l);
					var m = R(l, 2), h = F(m), g = L(h, !0), v = R(h, 2), y = F(v), b = F(y), x = R(b);
					J(x), D(y);
					var S = R(y, 2), C = F(S), w = R(C);
					J(w), D(S);
					var T = R(S, 2), ee = F(T), te = R(ee);
					{
						let e = /* @__PURE__ */ A(() => B(k).footer?.brand?.mode ?? "text"), t = /* @__PURE__ */ A(() => [
							["text", Z("blocks.text")],
							["image", Z("opt.brand.image")],
							["both", Z("opt.brand.both")]
						]);
						Q(te, {
							get value() {
								return B(e);
							},
							get options() {
								return B(t);
							},
							onchange: (e) => ul(e)
						});
					}
					D(T);
					var ne = R(T, 2), E = (e) => {
						var t = up(), n = I(t), r = F(n), i = F(r), a = R(i);
						D(r);
						var o = R(r, 2), s = (e) => {
							var t = Jl();
							K(t, () => _.cross, !0), D(t), z((e) => X(t, "title", e), [() => Z("tip.footer.removeLogo")]), V("click", t, fl), U(e, t);
						};
						G(o, (e) => {
							B(k).footer?.brand?.logo && e(s);
						}), D(n);
						var c = R(n, 2), l = (e) => {
							var t = lp(), n = I(t), r = F(n), i = L(R(r));
							D(n);
							var a = R(n, 2);
							J(a), z((e) => {
								W(r, `${e ?? ""} `), W(i, `${B(k).footer?.brand?.logoHeight ?? 40 ?? ""} px`), Y(a, B(k).footer?.brand?.logoHeight ?? 40);
							}, [() => Z("lbl.logoHeight")]), V("input", a, (e) => pl(e.target.value)), U(e, t);
						};
						G(c, (e) => {
							B(k).footer?.brand?.logo && e(l);
						}), z((e, t) => {
							X(r, "title", e), W(i, `${t ?? ""} `);
						}, [() => Z("tip.webpAutoPublish"), () => B(k).footer?.brand?.logo ? Z("ui.changeLogo") : Z("ui.uploadLogo")]), V("change", a, dl), U(e, t);
					};
					G(ne, (e) => {
						(B(k).footer?.brand?.mode ?? "text") !== "text" && e(E);
					}), D(v), D(m);
					var re = R(m, 2), ie = F(re), ae = L(ie, !0), oe = R(ie, 2), se = F(oe);
					Yr(se, 17, () => B(k).footer?.columns ?? [], Gr, (e, t, n) => {
						var r = dp(), i = I(r), a = F(i);
						J(a);
						var o = R(a, 2), s = F(o);
						K(s, () => _.plus, !0), D(s);
						var c = R(s, 2);
						c.disabled = n === 0, K(c, () => _.up, !0), D(c);
						var l = R(c, 2);
						K(l, () => _.down, !0), D(l);
						var u = R(l, 2);
						K(u, () => _.cross, !0), D(u), D(o), D(i), Yr(R(i, 2), 17, () => B(t).links ?? [], Gr, (e, r, i) => {
							var a = du(), o = F(a);
							J(o);
							var s = R(o, 2), c = F(s);
							c.disabled = i === 0, K(c, () => _.up, !0), D(c);
							var l = R(c, 2);
							K(l, () => _.down, !0), D(l);
							var u = R(l, 2);
							K(u, () => _.cross, !0), D(u), D(s);
							var d = R(s, 2), f = F(d);
							{
								let e = /* @__PURE__ */ A(() => B(r).page ?? "__href"), t = /* @__PURE__ */ A(() => Z("tip.linkTarget")), a = /* @__PURE__ */ A(() => [...B(k).pages.map((e) => [e.id, e.title]), ["__href", Z("opt.linkHref")]]);
								Q(f, {
									get value() {
										return B(e);
									},
									get title() {
										return B(t);
									},
									get options() {
										return B(a);
									},
									onchange: (e) => Vl(n, i, e)
								});
							}
							D(d);
							var p = R(d, 2), m = (e) => {
								var t = uu();
								J(t), z((e, n) => {
									Y(t, B(r).href ?? ""), X(t, "placeholder", e), X(t, "title", n);
								}, [() => Z("ph.hrefAnchor"), () => Z("tip.hrefAnchor")]), V("change", t, (e) => Hl(n, i, e.target.value)), U(e, t);
							};
							G(p, (e) => {
								B(r).page || e(m);
							}), D(a), z((e, n) => {
								Y(o, B(r).label), X(o, "title", e), l.disabled = i === B(t).links.length - 1, X(u, "title", n);
							}, [() => Z("tip.linkLabel"), () => Z("tip.removeLink")]), V("input", o, (e) => Rl(n, i, e.target.value)), V("click", c, () => Ll(n, i, -1)), V("click", l, () => Ll(n, i, 1)), V("click", u, () => Il(n, i)), U(e, a);
						}), z((e, r, i) => {
							Y(a, B(t).title), X(a, "title", e), X(s, "title", r), l.disabled = n === B(k).footer.columns.length - 1, X(u, "title", i);
						}, [
							() => Z("tip.footer.columnTitle"),
							() => Z("tip.footer.addLink"),
							() => Z("tip.footer.removeColumn")
						]), V("input", a, (e) => Pl(n, e.target.value)), V("click", s, () => Fl(n)), V("click", c, () => Ml(n, -1)), V("click", l, () => Ml(n, 1)), V("click", u, () => jl(n)), U(e, r);
					});
					var ce = R(se, 2), le = L(ce, !0), ue = R(ce, 2), de = F(ue), fe = R(de);
					{
						let e = /* @__PURE__ */ A(() => B(k).footer?.columnsAlign ?? "left"), t = /* @__PURE__ */ A(() => [["left", Z("common.left")], ["center", Z("common.center")]]);
						Q(fe, {
							get value() {
								return B(e);
							},
							get options() {
								return B(t);
							},
							onchange: (e) => wl(e)
						});
					}
					D(ue), D(oe), D(re);
					var pe = R(re, 2), me = F(pe), he = L(me, !0), ge = R(me, 2), _e = F(ge);
					Yr(_e, 17, () => B(k).footer?.social ?? [], Gr, (e, t, n) => {
						var r = fp(), i = F(r), a = F(i);
						K(a, () => Ua(B(t).icon) || "", !0), D(a);
						var o = R(a, 2);
						{
							let e = /* @__PURE__ */ A(() => Z("blocks.icon"));
							Q(o, {
								get value() {
									return B(t).icon;
								},
								get title() {
									return B(e);
								},
								get options() {
									return am;
								},
								onchange: (e) => rm(n, e)
							});
						}
						D(i);
						var s = R(i, 2), c = F(s);
						c.disabled = n === 0, K(c, () => _.up, !0), D(c);
						var l = R(c, 2);
						K(l, () => _.down, !0), D(l);
						var u = R(l, 2);
						K(u, () => _.cross, !0), D(u), D(s);
						var d = R(s, 2);
						J(d), D(r), z((e, r) => {
							l.disabled = n === B(k).footer.social.length - 1, X(u, "title", e), Y(d, B(t).url), X(d, "placeholder", r);
						}, [() => Z("tip.removeLink"), () => Z("ph.hrefMailto")]), V("click", c, () => nm(n, -1)), V("click", l, () => nm(n, 1)), V("click", u, () => tm(n)), V("change", d, (e) => im(n, e.target.value)), U(e, r);
					});
					var ve = R(_e, 2), ye = L(ve, !0);
					D(ge), D(pe);
					var be = R(pe, 2), xe = F(be), Se = L(xe, !0), Ce = R(xe, 2), we = F(Ce), Te = F(we);
					J(Te);
					var Ee = R(Te);
					D(we);
					var De = R(we, 2), ke = (e) => {
						let t = /* @__PURE__ */ A(() => B(k).footer.cta);
						var n = mp(), r = I(n), i = F(r), a = R(i);
						{
							let e = /* @__PURE__ */ A(() => B(t).kind ?? "button"), n = /* @__PURE__ */ A(() => [["button", Z("opt.cta.button")], ["newsletter", Z("opt.cta.newsletter")]]);
							Q(a, {
								get value() {
									return B(e);
								},
								get options() {
									return B(n);
								},
								onchange: (e) => El("kind", e)
							});
						}
						D(r);
						var o = R(r, 2), s = F(o);
						J(s);
						var c = R(s);
						D(o);
						var l = R(o, 2), u = F(l), d = R(u);
						J(d), D(l);
						var f = R(l, 2), p = F(f), m = R(p);
						J(m), D(f);
						var h = R(f, 2), g = F(h), _ = R(g);
						J(_), D(h);
						var v = R(h, 2), y = (e) => {
							var n = pp(), r = I(n), i = F(r), a = R(i);
							{
								let e = /* @__PURE__ */ A(() => B(t).page ?? "__href"), n = /* @__PURE__ */ A(() => [...B(k).pages.map((e) => [e.id, e.title]), ["__href", Z("opt.linkHrefMailto")]]);
								Q(a, {
									get value() {
										return B(e);
									},
									get options() {
										return B(n);
									},
									onchange: (e) => Dl(e)
								});
							}
							D(r);
							var o = R(r, 2), s = (e) => {
								var n = vu();
								J(n), z((e, r) => {
									Y(n, B(t).href ?? ""), X(n, "placeholder", e), X(n, "title", r);
								}, [() => Z("ph.hrefMailtoAnchor"), () => Z("tip.hrefAnchor")]), V("change", n, (e) => El("href", e.target.value)), U(e, n);
							};
							G(o, (e) => {
								B(t).page || e(s);
							}), z((e, t) => {
								X(r, "title", e), W(i, `${t ?? ""} `);
							}, [() => Z("tip.footer.ctaTarget"), () => Z("lbl.buttonTarget")]), U(e, n);
						}, b = (e) => {
							var n = Du(), r = I(n), i = F(r), a = R(i);
							J(a), D(r);
							var o = R(r, 2), s = F(o), c = R(s);
							J(c), D(o);
							var l = R(o, 2), u = F(l), d = R(u);
							J(d), D(l), z((e, n, f, p, m, h, g, _, v) => {
								X(r, "title", e), W(i, `${n ?? ""} `), Y(a, B(t).endpoint ?? ""), X(a, "placeholder", f), X(o, "title", p), W(s, `${m ?? ""} `), Y(c, B(t).recipient ?? ""), X(c, "placeholder", h), X(l, "title", g), W(u, `${_ ?? ""} `), Y(d, B(t).success ?? ""), X(d, "placeholder", v);
							}, [
								() => Z("tip.footer.ctaEndpoint"),
								() => Z("lbl.newsletterEndpoint"),
								() => Z("ph.endpoint"),
								() => Z("tip.footer.ctaRecipient"),
								() => Z("lbl.recipientFallback"),
								() => Z("ph.email"),
								() => Z("tip.footer.ctaSuccess"),
								() => Z("lbl.confirmation"),
								() => Z("ph.footer.ctaSuccess")
							]), V("change", a, (e) => El("endpoint", e.target.value)), V("change", c, (e) => El("recipient", e.target.value)), V("input", d, (e) => El("success", e.target.value)), U(e, n);
						};
						G(v, (e) => {
							(B(t).kind ?? "button") === "button" ? e(y) : e(b, -1);
						}), z((e, n, a, v, y, b, x, S, C, w, T, ee) => {
							X(r, "title", e), W(i, `${n ?? ""} `), X(o, "title", a), Si(s, B(t).big === !0), W(c, ` ${v ?? ""}`), X(l, "title", y), W(u, `${b ?? ""} `), Y(d, B(t).heading ?? ""), X(d, "placeholder", x), X(f, "title", S), W(p, `${C ?? ""} `), Y(m, B(t).sub ?? ""), X(h, "title", w), W(g, `${T ?? ""} `), Y(_, B(t).label ?? ""), X(_, "placeholder", ee);
						}, [
							() => Z("tip.footer.ctaKind"),
							() => Z("common.type"),
							() => Z("tip.footer.ctaBig"),
							() => Z("lbl.bigCentered"),
							() => Z("tip.footer.ctaHeading"),
							() => Z("lbl.heading"),
							() => Z("ph.footer.ctaHeading"),
							() => Z("tip.footer.ctaSub"),
							() => Z("lbl.subText"),
							() => Z("tip.footer.ctaLabel"),
							() => Z("lbl.buttonText"),
							() => Z("ph.footer.ctaLabel")
						]), V("change", s, (e) => El("big", e.target.checked)), V("input", d, (e) => El("heading", e.target.value)), V("input", m, (e) => El("sub", e.target.value)), V("input", _, (e) => El("label", e.target.value)), U(e, n);
					};
					G(De, (e) => {
						B(k).footer?.cta && e(ke);
					}), D(Ce), D(be);
					var Ae = R(be, 2), je = F(Ae), Me = L(je, !0), Ne = R(je, 2), Pe = F(Ne);
					r(Pe, () => "linkRow", () => B(k).footer?.linkRow ?? []);
					var Fe = R(Pe, 2), Ie = L(Fe, !0);
					D(Ne), D(Ae);
					var Le = R(Ae, 2), Re = F(Le), ze = L(Re, !0), Be = R(Re, 2), Ve = F(Be), O = (e) => {
						var t = od(), n = I(t), r = F(n), i = R(r);
						{
							let e = /* @__PURE__ */ A(() => B(k).footer?.align ?? "left"), t = /* @__PURE__ */ A(() => [
								["left", Z("common.left")],
								["center", Z("common.center")],
								["right", Z("common.right")]
							]);
							Q(i, {
								get value() {
									return B(e);
								},
								get options() {
									return B(t);
								},
								onchange: (e) => cl("footer", (t) => {
									t.align = e;
								})
							});
						}
						D(n), Oe(2), z((e, t) => {
							X(n, "title", e), W(r, `${t ?? ""} `);
						}, [() => Z("tip.footer.align"), () => Z("lbl.align")]), U(e, t);
					};
					G(Ve, (e) => {
						B(k).footer?.cta?.big !== !0 && e(O);
					});
					var He = R(Ve, 2), Ue = L(He, !0), We = R(He, 2);
					n(We, () => Fr, () => B(k).footer?.background?.layers ?? []), D(Be), D(Le);
					var Ge = R(Le, 2), Ke = F(Ge), qe = L(Ke, !0), Je = R(Ke, 2), Ye = F(Je), Xe = F(Ye), Ze = R(Xe);
					J(Ze), D(Ye);
					var Qe = R(Ye, 2), $e = L(Qe, !0), et = R(Qe, 2);
					r(et, () => "baseline", () => B(k).footer?.baseline ?? []);
					var tt = R(et, 2), nt = L(tt, !0);
					D(Je), D(Ge), D(t), z((e, t, n, r, s, c, l, u, f, p, m, h, _, v, te, ne, E, re, ie, oe, se, ce, fe, pe, me, ge, _e, ve, be, xe, Ce, De) => {
						X(i, "title", e), Si(a, t), W(o, ` ${n ?? ""}`), W(d, r), W(g, s), X(y, "title", c), W(b, `${l ?? ""} `), Y(x, B(k).footer?.brand?.title ?? ""), X(x, "placeholder", u), X(S, "title", f), W(C, `${p ?? ""} `), Y(w, B(k).footer?.brand?.tagline ?? ""), X(T, "title", m), W(ee, `${h ?? ""} `), W(ae, _), W(le, v), X(ue, "title", te), W(de, `${ne ?? ""} `), W(he, E), W(ye, re), W(Se, ie), X(we, "title", oe), Si(Te, se), W(Ee, ` ${ce ?? ""}`), W(Me, fe), W(Ie, pe), W(ze, me), W(Ue, ge), W(qe, _e), X(Ye, "title", ve), W(Xe, `${be ?? ""} `), Y(Ze, B(k).footer?.copyright ?? ""), X(Ze, "placeholder", xe), W($e, Ce), W(nt, De);
					}, [
						() => Z("tip.footer.show"),
						() => !!B(k).footer?.show,
						() => Z("lbl.showFooter"),
						() => Z("group.startpoint"),
						() => Z("group.brand"),
						() => Z("tip.footer.brandTitle"),
						() => Z("lbl.title"),
						() => Z("ph.footer.brandTitle"),
						() => Z("tip.footer.tagline"),
						() => Z("lbl.tagline"),
						() => Z("tip.footer.brandMode"),
						() => Z("lbl.brandMode"),
						() => Z("group.columns"),
						() => Z("ui.addColumn"),
						() => Z("tip.footer.columnsAlign"),
						() => Z("lbl.splitColumnAlign"),
						() => Z("group.social"),
						() => Z("ui.addSocial"),
						() => Z("group.cta"),
						() => Z("tip.footer.cta"),
						() => !!B(k).footer?.cta,
						() => Z("lbl.showCta"),
						() => Z("group.linkRow"),
						() => Z("ui.addRowLink"),
						() => Z("group.appearance"),
						() => Z("lbl.background"),
						() => Z("group.baseline"),
						() => Z("tip.footer.copyright"),
						() => Z("lbl.copyright"),
						() => Z("ph.footer.copyright"),
						() => Z("lbl.baselineLinks"),
						() => Z("ui.addBaselineLink")
					]), V("change", a, (e) => cl("footer", (t) => {
						t.show = e.target.checked;
					})), V("input", x, (e) => ll("title", e.target.value)), V("input", w, (e) => ll("tagline", e.target.value)), V("click", ce, Al), V("click", ve, Ul), V("change", Te, (e) => Tl(e.target.checked)), V("click", Fe, () => vl("linkRow")), V("input", Ze, (e) => ml(e.target.value)), V("click", tt, () => vl("baseline")), U(e, t);
				}, E = (e) => {
					var t = Cp(), n = F(t), r = (e) => {
						var t = fu(), n = F(t), r = R(n);
						{
							let e = /* @__PURE__ */ A(() => B(Ds) ?? ""), t = /* @__PURE__ */ A(() => [["", Z("common.choose")], ...B(Ts).map((e) => [e, B(Es)[e]?.name ?? e])]);
							Q(r, {
								get value() {
									return B(e);
								},
								get options() {
									return B(t);
								},
								onchange: (e) => P(Ds, e || null, !0)
							});
						}
						D(t), z((e) => W(n, `${e ?? ""} `), [() => Z("blocks.collection")]), U(e, t);
					};
					G(n, (e) => {
						B(Ts).length && e(r);
					});
					var i = R(n, 2), a = (e) => {
						let t = /* @__PURE__ */ A(() => B(Es)[B(Ds)]);
						var n = Sp(), r = I(n), i = F(r), a = L(i, !0), o = R(i, 2), s = L(o, !0), c = R(o, 2), l = F(c), u = R(l);
						D(c);
						var d = R(c, 2);
						K(d, () => _.cross, !0), D(d), D(r);
						var f = R(r, 2);
						Yr(f, 19, () => B(t).entries, (e) => e.id, (e, n, r) => {
							var i = xp(), a = F(i), o = L(a), s = R(a, 2), c = F(s), l = F(c);
							J(l);
							var u = R(l, 2), d = F(u);
							K(d, () => _.up, !0), D(d);
							var f = R(d, 2);
							K(f, () => _.down, !0), D(f);
							var p = R(f, 2);
							K(p, () => _.cross, !0), D(p), D(u), D(c);
							var m = R(c, 2), h = (e) => {
								var t = gp(), r = F(t), i = R(r);
								J(i), D(t), z((e) => {
									W(r, `${e ?? ""} `), Y(i, B(n).date ?? "");
								}, [() => Z("lbl.date")]), V("change", i, (e) => uc(B(Ds), B(n).id, "date", e.target.value)), U(e, t);
							};
							G(m, (e) => {
								B(t).kind !== "products" && e(h);
							});
							var g = R(m, 2);
							ut(g);
							var v = R(g, 2), y = (e) => {
								var t = gu(), r = F(t), i = R(r);
								J(i), D(t), z((e, t) => {
									W(r, `${e ?? ""} `), Y(i, B(n).href ?? ""), X(i, "placeholder", t);
								}, [() => Z("lbl.link"), () => Z("ph.collections.href")]), V("change", i, (e) => uc(B(Ds), B(n).id, "href", e.target.value)), U(e, t);
							};
							G(v, (e) => {
								B(t).kind !== "products" && e(y);
							});
							var b = R(v, 2), x = F(b), S = F(x), C = R(S);
							D(x);
							var w = R(x, 2), T = (e) => {
								var t = _p(), r = I(t), i = R(r, 2);
								K(i, () => _.cross, !0), D(i), z((e) => {
									X(r, "src", B(n).image), X(i, "title", e);
								}, [() => Z("tip.removeImage")]), V("click", i, () => uc(B(Ds), B(n).id, "image", "")), U(e, t);
							};
							G(w, (e) => {
								B(n).image && e(T);
							}), D(b);
							var ee = R(b, 2), te = (e) => {
								var t = bp(), r = I(t), i = F(r), a = R(i);
								J(a), D(r);
								var o = R(r, 2), s = F(o), c = R(s);
								J(c), D(o);
								var l = R(o, 2), u = F(l), d = R(u);
								J(d), D(l);
								var f = R(l, 2), p = F(f), m = R(p);
								J(m), D(f);
								var h = R(f, 2);
								Yr(h, 17, () => B(n).colors ?? [], Gr, (e, t, r) => {
									var i = yp(), a = F(i);
									J(a);
									var o = R(a, 2), s = F(o), c = R(s);
									D(o);
									var l = R(o, 2), u = (e) => {
										var n = vp();
										z(() => X(n, "src", B(t).image)), U(e, n);
									};
									G(l, (e) => {
										B(t).image && e(u);
									});
									var d = R(l, 2);
									K(d, () => _.cross, !0), D(d), D(i), z((e, n) => {
										Y(a, B(t).name), X(a, "placeholder", e), W(s, `${n ?? ""} `);
									}, [() => Z("ph.colorName"), () => B(t).image ? Z("ui.changeImage") : Z("ui.addImage")]), V("change", a, (e) => gc(B(Ds), B(n).id, r, "name", e.target.value)), V("change", c, (e) => _c(B(Ds), B(n).id, r, e)), V("click", d, () => vc(B(Ds), B(n).id, r)), U(e, i);
								});
								var g = R(h, 2), v = L(g, !0);
								z((e, t, r, h, _, y, b, x, S, C, w) => {
									W(i, `${e ?? ""} `), Y(a, B(n).price ?? ""), X(o, "title", t), W(s, `${r ?? ""} `), Y(c, B(n).memberPrice ?? ""), X(l, "title", h), W(u, `${_ ?? ""} `), Y(d, B(n).badge ?? ""), X(f, "title", y), W(p, `${b ?? ""} `), Y(m, x), X(m, "placeholder", S), X(g, "title", C), W(v, w);
								}, [
									() => Z("lbl.price"),
									() => Z("tip.entry.memberPrice"),
									() => Z("lbl.memberPrice"),
									() => Z("tip.entry.badge"),
									() => Z("lbl.productBadge"),
									() => Z("tip.entry.sizes"),
									() => Z("lbl.sizes"),
									() => (B(n).sizes ?? []).join(", "),
									() => Z("ph.sizes"),
									() => Z("tip.entry.colors"),
									() => Z("ui.addColor")
								]), V("change", a, (e) => uc(B(Ds), B(n).id, "price", e.target.value === "" ? "" : Number(e.target.value))), V("change", c, (e) => uc(B(Ds), B(n).id, "memberPrice", e.target.value === "" ? "" : Number(e.target.value))), V("change", d, (e) => uc(B(Ds), B(n).id, "badge", e.target.value)), V("change", m, (e) => mc(B(Ds), B(n).id, e.target.value)), V("click", g, () => hc(B(Ds), B(n).id)), U(e, t);
							};
							G(ee, (e) => {
								B(t).kind === "products" && e(te);
							}), D(s), D(i), z((e, i, a, s, c) => {
								W(o, `${e ?? ""}${B(t).kind === "products" ? B(n).price == null ? "" : ` · ${B(n).price}` : B(n).date ? ` · ${B(n).date}` : ""}`), Y(l, B(n).title), X(l, "title", i), d.disabled = B(r) === 0, f.disabled = B(r) === B(t).entries.length - 1, X(p, "title", a), X(g, "placeholder", s), Y(g, B(n).text ?? ""), W(S, `${c ?? ""} `);
							}, [
								() => Qs(B(n).title),
								() => Z("lbl.title"),
								() => Z("tip.collections.deleteEntry"),
								() => Z("ph.collections.text"),
								() => B(n).image ? Z("ui.changeImage") : Z("ui.addImage")
							]), V("change", l, (e) => uc(B(Ds), B(n).id, "title", e.target.value || Z("ui.untitled"))), V("click", d, () => dc(B(Ds), B(r), -1)), V("click", f, () => dc(B(Ds), B(r), 1)), V("click", p, () => fc(B(Ds), B(n).id)), V("change", g, (e) => uc(B(Ds), B(n).id, "text", e.target.value)), V("change", C, (e) => pc(B(Ds), B(n).id, e)), U(e, i);
						});
						var p = R(f, 2), m = (e) => {
							var t = hu(), n = L(t, !0);
							z((e) => W(n, e), [() => Z("hint.collections.empty")]), U(e, t);
						};
						G(p, (e) => {
							B(t).entries.length || e(m);
						}), Oe(2), z((e, t, n, r, i, u) => {
							W(a, e), X(o, "title", t), W(s, n), X(c, "title", r), W(l, `${i ?? ""} `), X(d, "title", u);
						}, [
							() => Z("ui.addEntry"),
							() => Z("tip.collections.exportCsv"),
							() => Z("ui.exportCsv"),
							() => Z("tip.collections.importCsv"),
							() => Z("ui.importCsv"),
							() => Z("tip.collections.deleteCollection")
						]), V("click", i, () => lc(B(Ds))), V("click", o, () => yc(B(Ds))), V("change", u, (e) => bc(B(Ds), e)), V("click", d, () => cc(B(Ds))), U(e, n);
					};
					G(i, (e) => {
						B(Ds) && B(Es)[B(Ds)] && e(a);
					});
					var o = R(i, 2), s = F(o), c = R(s);
					J(c), D(o);
					var l = R(o, 2), u = F(l);
					Q(R(u), {
						get value() {
							return B(ks);
						},
						get options() {
							return As;
						},
						onchange: (e) => P(ks, e, !0)
					}), D(l);
					var d = R(l, 2), f = L(d, !0);
					D(t), z((e, t, n, r, i) => {
						W(s, `${e ?? ""} `), X(c, "placeholder", t), W(u, `${n ?? ""} `), d.disabled = r, W(f, i);
					}, [
						() => Z("lbl.newCollectionName"),
						() => Z("ph.collections.name"),
						() => Z("common.type"),
						() => !B(Os).trim(),
						() => Z("ui.createCollection")
					]), V("keydown", c, (e) => e.key === "Enter" && oc()), Ei(c, () => B(Os), (e) => P(Os, e)), V("click", d, oc), U(e, t);
				}, re = (e) => {
					var t = Ap(), n = F(t), r = (e) => {
						var t = hu(), n = L(t, !0);
						z((e) => W(n, e), [() => Z("hint.plugins.empty")]), U(e, t);
					}, i = /* @__PURE__ */ A(() => !Gc().length);
					G(n, (e) => {
						B(i) && e(r);
					});
					var a = R(n, 2);
					Yr(a, 16, Gc, (e) => e, (e, t) => {
						let n = /* @__PURE__ */ A(() => Ec[t]), r = /* @__PURE__ */ A(() => (B(wc)?.enabled ?? []).includes(t));
						var i = Ep();
						let a;
						var o = F(i), s = F(o), c = L(s, !0), l = R(s, 2), u = (e) => {
							var t = wp(), r = L(t);
							z(() => W(r, `v${B(n).version ?? ""}`)), U(e, t);
						};
						G(l, (e) => {
							B(n)?.version && e(u);
						});
						var d = R(l, 2), f = F(d), p = F(f);
						J(p);
						var m = R(p);
						D(f);
						var h = R(f, 2);
						K(h, () => _.cross, !0), D(h), D(d), D(o);
						var g = R(o, 2), v = (e) => {
							var t = Tp(), r = L(t, !0);
							z((e) => W(r, e), [() => B(n).errors.join("; ")]), U(e, t);
						}, y = (e) => {
							var t = Tp(), r = L(t, !0);
							z((e) => W(r, e), [() => Z("plugin.engineMismatch", {
								required: B(n).requiresEngine,
								current: B(kc)
							})]), U(e, t);
						}, b = (e) => {
							var t = Tp(), r = L(t, !0);
							z((e) => W(r, e), [() => Z("plugin.cspNeeded", { list: Yc(B(n).csp).join(", ") })]), U(e, t);
						}, x = /* @__PURE__ */ A(() => B(n)?.csp && Yc(B(n).csp).length);
						G(g, (e) => {
							B(n)?.errors?.length ? e(v) : B(n) && !B(n).satisfied ? e(y, 1) : B(x) && e(b, 2);
						});
						var S = R(g, 2), C = (e) => {
							var t = hu(), r = L(t, !0);
							z((e) => W(r, e), [() => Z("plugin.languages", { list: B(n).languages.map((e) => e.name).join(", ") })]), U(e, t);
						};
						G(S, (e) => {
							B(n)?.languages?.length && e(C);
						}), D(i), z((e, t, o, s, l) => {
							a = q(i, 1, "plugin-row svelte-1n46o8q", null, a, { "plugin-broken": B(n)?.errors?.length }), W(c, e), X(f, "title", t), Si(p, B(r)), p.disabled = o, W(m, ` ${s ?? ""}`), X(h, "title", l);
						}, [
							() => B(n)?.names?.[Wi()] ?? B(n)?.name ?? t,
							() => B(r) ? Z("tip.plugins.on") : Z("tip.plugins.off"),
							() => !!B(n)?.errors?.length,
							() => B(r) ? Z("ui.on") : Z("ui.off"),
							() => Z("tip.plugins.remove")
						]), V("change", p, (e) => el(t, e.target.checked)), V("click", h, () => al(t)), U(e, i);
					});
					var o = R(a, 2), s = (e) => {
						var t = Op(), n = R(I(t), 2), r = L(n, !0);
						Yr(R(n, 2), 16, () => B(Lc), (e) => e, (e, t) => {
							var n = Dp(), r = F(n), i = F(r), a = L(i, !0), o = R(i, 2), s = (e) => {
								var n = wp(), r = L(n);
								z(() => W(r, `v${Ec[t].version ?? ""}`)), U(e, n);
							};
							G(o, (e) => {
								Ec[t]?.version && e(s);
							});
							var c = R(o, 2), l = F(c);
							K(l, () => _.right, !0), D(l), D(c), D(r), D(n), z((e, t) => {
								W(a, e), X(l, "title", t);
							}, [() => Ec[t]?.names?.[Wi()] ?? Ec[t]?.name ?? t, () => Z("tip.plugins.addFound")]), V("click", l, () => sl(t)), U(e, n);
						}), z((e) => W(r, e), [() => Z("hint.plugins.found")]), U(e, t);
					};
					G(o, (e) => {
						B(Lc).length && e(s);
					});
					var c = R(o, 2), l = (e) => {
						var t = Pr(), n = I(t), r = (e) => {
							var t = hu(), n = L(t, !0);
							z((e) => W(n, e), [() => Z("hint.plugins.autoDiscover")]), U(e, t);
						};
						G(n, (e) => {
							B(Lc).length || e(r);
						}), U(e, t);
					}, u = (e) => {
						var t = kp(), n = R(I(t), 2);
						J(n);
						var r = R(n, 2), i = L(r, !0), a = R(r, 2), o = (e) => {
							var t = Tp(), n = L(t, !0);
							z(() => W(n, B(Pc))), U(e, t);
						};
						G(a, (e) => {
							B(Pc) && e(o);
						}), z((e, t, a) => {
							X(n, "placeholder", e), r.disabled = t, W(i, a);
						}, [
							() => Z("ph.plugins.folder"),
							() => !B(Ac).trim(),
							() => Z("ui.addPlugin")
						]), V("keydown", n, (e) => e.key === "Enter" && ol()), Ei(n, () => B(Ac), (e) => P(Ac, e)), V("click", r, ol), U(e, t);
					};
					G(c, (e) => {
						B(Wc) === "ok" ? e(l) : e(u, -1);
					}), D(t), U(e, t);
				}, ie = (e) => {
					var t = sp(), n = F(t), r = (e) => {
						var t = hu(), n = L(t, !0);
						z((e) => W(n, e), [() => Z("hint.history.loading")]), U(e, t);
					}, i = (e) => {
						var t = df(), n = I(t), r = (e) => {
							var t = hu(), n = L(t, !0);
							z(() => W(n, B(yi))), U(e, t);
						};
						G(n, (e) => {
							B(yi) && e(r);
						});
						var i = R(n, 2), a = (e) => {
							var t = Mp(), n = I(t), r = L(n, !0);
							Yr(R(n, 2), 19, () => B(vi), (e) => e.sha, (e, t, n) => {
								var r = jp();
								let i;
								var a = F(r), o = L(a, !0), s = L(R(a, 2));
								D(r), z((e) => {
									i = q(r, 1, "history-row svelte-1n46o8q", null, i, { head: B(n) === 0 }), X(a, "title", B(t).sha), W(o, B(t).message), W(s, `${B(t).author ?? ""}${e ?? ""}`);
								}, [() => B(t).date ? ` · ${Ci.format(new Date(B(t).date))}` : ""]), U(e, r);
							}), z((e, t) => {
								n.disabled = B(bi) || !B(oe)?.allowed, X(n, "title", e), W(r, t);
							}, [() => B(oe)?.allowed ? Z("tip.history.revert") : Z("tip.history.needsAccess"), () => Z("ui.revertLast")]), V("click", n, Ti), U(e, t);
						};
						G(i, (e) => {
							B(vi).length > 0 && e(a);
						}), U(e, t);
					};
					G(n, (e) => {
						B(vi) === null ? e(r) : e(i, -1);
					}), D(t), U(e, t);
				}, ae = (e) => {
					var t = sp(), n = F(t), r = (e) => {
						var t = hu(), n = L(t, !0);
						z((e) => W(n, e), [() => Z("update.checking")]), U(e, t);
					}, i = (e) => {
						var t = Np(), n = I(t), r = L(n, !0), i = R(n, 2), a = L(i, !0);
						z((e) => {
							W(r, B(Mi)), W(a, e);
						}, [() => Z("update.retry")]), V("click", i, Fi), U(e, t);
					}, a = (e) => {
						var t = Wp(), n = I(t), r = F(n), i = L(r, !0), a = R(r, 2), o = (e) => {
							var t = Pp(), n = I(t);
							K(n, () => _.right, !0), D(n);
							var r = L(R(n, 2), !0);
							z(() => W(r, B(ji).target)), U(e, t);
						};
						G(a, (e) => {
							B(ji).upToDate || e(o);
						}), D(n);
						var s = R(n, 2), c = (e) => {
							var t = hu(), n = L(t, !0);
							z((e) => W(n, e), [() => Z("update.upToDate")]), U(e, t);
						}, l = (e) => {
							var t = Up(), n = I(t), r = L(n, !0), i = R(n, 2), a = (e) => {
								var t = Fp(), n = F(t), r = L(n, !0), i = R(n, 2), a = L(F(i), !0);
								D(i), D(t), z((e) => {
									W(r, e), W(a, B(ji).notes);
								}, [() => Z("update.aboutVersion", { target: B(ji).target })]), U(e, t);
							};
							G(i, (e) => {
								B(ji).notes && e(a);
							});
							var o = R(i, 2), s = (e) => {
								var t = Ip(), n = F(t), r = F(n);
								K(r, () => _.warn, !0), D(r);
								var i = R(r);
								D(n);
								var a = R(n, 2), o = L(F(a), !0);
								D(a), D(t), z((e, t) => {
									X(n, "title", e), W(i, ` ${t ?? ""}`), W(o, B(ji).headers.upstream);
								}, [() => Z("update.headersManual"), () => Z("update.headersTitle")]), U(e, t);
							};
							G(o, (e) => {
								B(ji).headers?.upstream && e(s);
							});
							var c = R(o, 2);
							Yr(c, 17, () => B(ji).changes.filter((e) => e.atom && e.conflict), (e) => e.path, (e, t) => {
								var n = Rp(), r = F(n), i = L(r, !0), a = R(r, 2), o = F(a), s = (e) => {
									var t = Lp(), n = L(t, !0);
									z((e) => W(n, e), [() => Z("update.actionDelete")]), U(e, t);
								};
								G(o, (e) => {
									B(t).action === "delete" && e(s);
								});
								var c = R(o, 2);
								K(c, () => _.warn, !0), D(c), D(a), D(n), z((e) => {
									X(r, "title", B(t).path), W(i, B(t).path), X(c, "title", e);
								}, [() => Z(`update.conflict.${B(t).conflict}`)]), U(e, n);
							});
							var l = R(c, 2), u = F(l), d = L(u), f = R(u, 2);
							Yr(f, 21, () => B(ji).changes.filter((e) => e.atom && !e.conflict), (e) => e.path, (e, t) => {
								var n = zp(), r = F(n), i = L(r, !0), a = R(r, 2), o = (e) => {
									var t = Lp(), n = L(t, !0);
									z((e) => W(n, e), [() => Z("update.actionDelete")]), U(e, t);
								};
								G(a, (e) => {
									B(t).action === "delete" && e(o);
								}), D(n), z(() => {
									X(r, "title", B(t).path), W(i, B(t).path);
								}), U(e, n);
							}), D(f), D(l);
							var p = R(l, 2), m = (e) => {
								var t = Hp(), n = I(t), r = F(n), i = L(r, !0), a = L(R(r, 2), !0);
								D(n), Yr(R(n, 2), 17, () => B(ji).changes.filter((e) => !e.atom), (e) => e.path, (e, t) => {
									var n = Vp(), r = F(n);
									let i;
									var a = L(r, !0), o = R(r, 2), s = F(o), c = (e) => {
										var t = Lp(), n = L(t, !0);
										z((e) => W(n, e), [() => Z("update.actionDelete")]), U(e, t);
									};
									G(s, (e) => {
										B(t).action === "delete" && e(c);
									});
									var l = R(s, 2), u = (e) => {
										var n = Bp();
										K(n, () => _.warn, !0), D(n), z((e) => X(n, "title", e), [() => Z(`update.conflict.${B(t).conflict}`)]), U(e, n);
									};
									G(l, (e) => {
										B(t).conflict && e(u);
									});
									var d = R(l, 2);
									J(d), D(o), D(n), z((e, n, o, s) => {
										i = q(r, 1, "update-path svelte-1n46o8q", null, i, { skipped: e }), X(r, "title", B(t).path), W(a, B(t).path), Si(d, n), X(d, "title", o), X(d, "aria-label", s);
									}, [
										() => B(Pi).has(B(t).path),
										() => B(Pi).has(B(t).path),
										() => Z("update.keepMine.title"),
										() => Z("update.keepMine")
									]), V("change", d, () => Ii(B(t).path)), U(e, n);
								}), z((e, t) => {
									W(i, e), W(a, t);
								}, [() => Z("update.optionalTitle"), () => Z("update.keepMine")]), U(e, t);
							}, h = /* @__PURE__ */ A(() => B(ji).changes.some((e) => !e.atom));
							G(p, (e) => {
								B(h) && e(m);
							});
							var g = R(p, 2), v = L(g, !0);
							z((e, t, n, i, a, o) => {
								W(r, e), X(u, "title", t), W(d, `${n ?? ""} · ${i ?? ""}`), g.disabled = B(Ni) || !B(oe)?.allowed, X(g, "title", a), W(v, o);
							}, [
								() => Z("update.summary", {
									writes: B(ji).changes.filter((e) => e.action === "write").length,
									deletes: B(ji).changes.filter((e) => e.action === "delete").length
								}),
								() => Z("update.atomGroup.title"),
								() => Z("update.atomTitle"),
								() => B(ji).changes.filter((e) => e.atom).length,
								() => B(oe)?.allowed ? Z("update.run.title") : Z("tip.history.needsAccess"),
								() => Z("update.run", { target: B(ji).target })
							]), V("click", g, Li), U(e, t);
						};
						G(s, (e) => {
							B(ji).upToDate ? e(c) : e(l, -1);
						}), z((e) => W(i, e), [() => Z("update.current", { version: B(ji).current })]), U(e, t);
					};
					G(n, (e) => {
						B(Ni) && !B(ji) ? e(r) : B(Mi) ? e(i, 1) : B(ji) && e(a, 2);
					}), D(t), U(e, t);
				};
				G(v, (e) => {
					B(Tt) === "pages" ? e(y) : B(Tt) === "nav" ? e(b, 1) : B(Tt) === "site" ? e(x, 2) : B(Tt) === "theme" ? e(C, 3) : B(Tt) === "blocks" ? e(T, 4) : B(Tt) === "grid" ? e(ee, 5) : B(Tt) === "properties" ? e(te, 6) : B(Tt) === "footer" ? e(ne, 7) : B(Tt) === "collections" ? e(E, 8) : B(Tt) === "plugins" ? e(re, 9) : B(Tt) === "history" ? e(ie, 10) : B(Tt) === "update" && e(ae, 11);
				}), D(t), Ai(t, (e) => P(Mm, e), () => B(Mm)), z((e) => {
					X(o, "title", e), W(l, Ot[B(Tt)]);
				}, [() => kt[B(Tt)]?.map((e) => Z(e)).join("\n")]), U(e, t);
			};
			G(C, (e) => {
				B(Tt) && e(T);
			}), z((e) => {
				g = q(m, 1, "rail-gear svelte-1n46o8q", null, g, { active: B(qi) }), X(m, "title", e);
			}, [() => Z("settings.title")]), V("click", m, () => P(qi, !B(qi))), U(e, t);
		};
		G(i, (e) => {
			B(ce) && e(o);
		});
		var l = R(i, 2);
		let m;
		var g = F(l), y = F(g);
		Ai(y, (e) => P(ae, e), () => B(ae)), D(g), D(l), Ai(l, (e) => P(xe, e), () => B(xe)), D(t), z((e) => {
			m = q(l, 1, "frame-wrap svelte-1n46o8q", null, m, {
				mobile: B(be) === "mobile",
				pan: B(Fe),
				fold: B(ke) > 0
			}), _i(g, `width:${B(Ne) ?? ""}px; height:${B(Pe) ?? ""}px`), X(y, "title", e), X(y, "src", `/?page=${B(w)}&preview=1`), _i(y, `width:${B(De) ?? ""}px; height:${B(Me) ?? ""}px; transform:scale(${B(Ae) ?? ""}); transform-origin:top left`);
		}, [() => Z("ui.previewTitle")]), wr("load", y, Hi), Sr(y), U(e, t);
	}, hg = (e) => {
		var t = Jp(), n = L(t, !0);
		z((e) => W(n, e), [() => Z("ui.loading")]), U(e, t);
	};
	G(pg, (e) => {
		B(C) ? e(mg) : e(hg, -1);
	});
	var gg = R(pg, 2), _g = (e) => {
		Zo(e, {
			get image() {
				return B(Wa);
			},
			onapply: Ka,
			oncancel: () => P(Wa, null)
		});
	};
	G(gg, (e) => {
		B(Wa) && e(_g);
	});
	var vg = R(gg, 2), yg = (e) => {
		var t = Xp(), n = F(t), r = F(n), i = L(r, !0), a = R(r, 2);
		Yr(a, 16, () => B(mt).lines, (e) => e, (e, t) => {
			var n = Yp(), r = L(n, !0);
			z(() => W(r, t)), U(e, n);
		});
		var o = R(a, 2), s = (e) => {
			var t = vu();
			J(t), lt(t, !0), z(() => X(t, "placeholder", B(mt).placeholder)), V("keydown", t, (e) => e.key === "Enter" && B(mt).value.trim() && _t(!0)), Ei(t, () => B(mt).value, (e) => B(mt).value = e), U(e, t);
		};
		G(o, (e) => {
			B(mt).prompt && e(s);
		});
		var c = R(o, 2), l = F(c), u = L(l, !0), d = R(l, 2), f = L(d, !0);
		D(c), D(n), D(t), z(() => {
			W(i, B(mt).title), W(u, B(mt).cancelLabel), W(f, B(mt).okLabel);
		}), V("pointerdown", t, (e) => vt = e.target === e.currentTarget), V("click", t, (e) => vt && e.target === e.currentTarget && _t(!1)), V("click", l, () => _t(!1)), V("click", d, () => _t(!0)), U(e, t);
	};
	G(vg, (e) => {
		B(mt) && e(yg);
	});
	var bg = R(vg, 2), xg = (e) => {
		var t = Zp(), n = F(t), r = F(n), i = L(r, !0), a = R(r, 2), o = L(a, !0), s = R(a, 2), c = F(s), l = R(c);
		J(l), D(s);
		var u = R(s, 2), d = F(u), f = R(d);
		{
			let e = /* @__PURE__ */ A(() => Z("setup.accentPick"));
			ha(f, {
				get value() {
					return B(xt);
				},
				get label() {
					return B(e);
				},
				onchange: (e) => P(xt, e, !0)
			});
		}
		D(u);
		var p = R(u, 2), m = F(p), h = R(m);
		{
			let e = /* @__PURE__ */ A(() => Z("setup.bgLabel"));
			ha(h, {
				get value() {
					return B(St);
				},
				get label() {
					return B(e);
				},
				onchange: (e) => P(St, e, !0)
			});
		}
		D(p);
		var g = R(p, 2), _ = L(g, !0), v = R(g, 2), y = F(v), b = L(y, !0), x = R(y, 2), S = L(x, !0);
		D(v), D(n), D(t), z((e, t, n, r, a, s, u, f, p, h) => {
			W(i, e), W(o, t), W(c, `${n ?? ""} `), X(l, "placeholder", r), W(d, `${a ?? ""} `), W(m, `${s ?? ""} `), W(_, u), W(b, f), x.disabled = p, W(S, h);
		}, [
			() => Z("setup.title"),
			() => Z("setup.intro"),
			() => Z("setup.nameLabel"),
			() => Z("ph.setup.name"),
			() => Z("setup.accentLabel"),
			() => Z("setup.bgLabel"),
			() => Z("setup.outro"),
			() => Z("setup.skip"),
			() => !B(bt).trim(),
			() => Z("setup.start")
		]), V("keydown", l, (e) => e.key === "Enter" && wt()), Ei(l, () => B(bt), (e) => P(bt, e)), V("click", y, Ct), V("click", x, wt), U(e, t);
	};
	G(bg, (e) => {
		B(yt) && e(xg);
	});
	var Sg = R(bg, 2), Cg = (e) => {
		var t = Qp();
		let n;
		var r = F(t), i = L(r, !0), a = R(r, 2);
		D(t), z((e) => {
			n = q(t, 1, "toast svelte-1n46o8q", null, n, {
				ok: B(te) === "ok",
				error: B(te) === "error"
			}), W(i, B(ee)), X(a, "title", e);
		}, [() => Z("ui.close")]), V("click", a, () => E("")), U(e, t);
	};
	G(Sg, (e) => {
		B(ee) && e(Cg);
	}), D(Zh);
	var wg = R(Zh, 2), Tg = (e) => {
		var t = $p(), n = F(t), r = F(n), i = L(r, !0), o = R(r, 2);
		K(o, () => _.cross, !0), D(o), D(n);
		var s = R(n, 2), c = F(s);
		a(c), D(s), D(t), z((e, n) => {
			_i(t, `left: ${B(Vt).left ?? ""}px; top: ${B(Vt).top ?? ""}px`), W(i, e), X(o, "title", n);
		}, [() => Z("blocks.suffix", { label: Nn[B(j).type] ?? B(j).type }), () => Z("tip.closeEsc")]), V("click", o, () => P(Vt, null)), U(e, t);
	};
	G(wg, (e) => {
		B(Vt) && B(j) && e(Tg);
	}), z(() => tg = q(eg, 1, "topbar svelte-1n46o8q", null, tg, { hidden: !B(ce) })), U(e, Xh), Ye();
}
//#endregion
//#region src/main.js
Tr([
	"click",
	"input",
	"pointerdown",
	"change",
	"keydown"
]), document.documentElement.lang = await qi();
var nm = Br(tm, { target: document.getElementById("urd-admin") });
//#endregion
export { nm as default };
