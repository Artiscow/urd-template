//#region node_modules/svelte/src/internal/shared/utils.js
var e = Array.isArray, t = Array.prototype.indexOf, n = Array.prototype.includes, r = Array.from, i = Object.defineProperty, a = Object.getOwnPropertyDescriptor, o = Object.getOwnPropertyDescriptors, s = Object.prototype, c = Array.prototype, l = Object.getPrototypeOf, u = Object.isExtensible;
function d(e) {
	return typeof e == "function";
}
var f = () => {};
function p(e) {
	return e();
}
function m(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function h() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
function g(e, t) {
	if (Array.isArray(e)) return e;
	if (t === void 0 || !(Symbol.iterator in e)) return Array.from(e);
	let n = [];
	for (let r of e) if (n.push(r), n.length === t) break;
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/constants.js
var _ = 1 << 24, v = 1024, y = 2048, b = 4096, x = 8192, S = 16384, C = 32768, w = 1 << 25, ee = 65536, T = 1 << 19, te = 1 << 20, ne = 1 << 25, re = 1 << 21, ie = 1 << 22, ae = 1 << 23, oe = Symbol("$state"), se = Symbol("component"), ce = Symbol("legacy props"), le = Symbol(""), ue = Symbol("attributes"), de = Symbol("class"), fe = Symbol("style"), pe = Symbol("text"), me = Symbol("form reset"), he = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), ge = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml"), _e = {}, ve = Symbol("uninitialized"), ye = "http://www.w3.org/1999/xhtml", be = "http://www.w3.org/2000/svg", xe = "http://www.w3.org/1998/Math/MathML";
function Se() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Ce(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function we() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var Te = !1;
function Ee(e) {
	Te = e;
}
var De;
function Oe(e) {
	if (e === null) throw Ce(), _e;
	return De = e;
}
function ke() {
	return Oe(/* @__PURE__ */ Sn(De));
}
function E(e) {
	if (Te) {
		if (/* @__PURE__ */ Sn(De) !== null) throw Ce(), _e;
		De = e;
	}
}
function Ae(e = 1) {
	if (Te) {
		for (var t = e, n = De; t--;) n = /* @__PURE__ */ Sn(n);
		De = n;
	}
}
function je(e = !0) {
	for (var t = 0, n = De;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ Sn(n);
		e && n.remove(), n = i;
	}
}
function Me(e) {
	if (!e || e.nodeType !== 8) throw Ce(), _e;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Ne(e) {
	return e === this.v;
}
function Pe(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Fe(e) {
	return !Pe(e, this.v);
}
function Ie(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function Le() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Re(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function ze(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Be() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Ve(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function He() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Ue(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function We() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Ge() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ke() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function qe() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/internal/flags/index.js
var Je = !1;
function Ye() {
	Je = !0;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/clone.js
var Xe = [];
function Ze(e, t = !1, n = !1) {
	return Qe(e, /* @__PURE__ */ new Map(), "", Xe, null, n);
}
function Qe(t, n, r, i, a = null, o = !1) {
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
				d in t && (u[d] = Qe(f, n, r, i, null, o));
			}
			return u;
		}
		if (l(t) === s) {
			u = {}, n.set(t, u), a !== null && n.set(a, u);
			for (var p of Object.keys(t)) u[p] = Qe(t[p], n, r, i, null, o);
			return u;
		}
		if (t instanceof Date) return t.getTime(), structuredClone(t);
		if (typeof t.toJSON == "function" && !o) return Qe(t.toJSON(), n, r, i, t);
	}
	if (t instanceof EventTarget) return t;
	try {
		return structuredClone(t);
	} catch {
		return t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/shared/context.js
function $e(e) {
	let t = e.p;
	for (; t !== null && t.c === null;) t = t.p;
	return t?.c ?? null;
}
function et(e, t) {
	return e === null && Ie(t), e.c ??= new Map($e(e) || void 0);
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var tt = null;
function nt(e) {
	tt = e;
}
function rt(e) {
	return et(tt, "getContext").get(e);
}
function it(e, t) {
	return et(tt, "setContext").set(e, t), t;
}
function at(e, t = !1, n) {
	tt = {
		p: tt,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: sr,
		l: Je && !t ? {
			s: null,
			u: null,
			$: []
		} : null
	};
}
function ot(e) {
	var t = tt, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) Fn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, tt = t.p, st(e);
}
function st(e = {}) {
	return i(e, se, { value: !0 }), e;
}
function ct() {
	return !Je || tt !== null && tt.l === null;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var lt = [];
function ut() {
	var e = lt;
	lt = [], m(e);
}
function dt(e) {
	if (lt.length === 0 && !Vt) {
		var t = lt;
		queueMicrotask(() => {
			t === lt && ut();
		});
	}
	lt.push(e);
}
function ft() {
	for (; lt.length > 0;) ut();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var pt = ~(y | b | v);
function mt(e, t) {
	e.f = e.f & pt | t;
}
function ht(e) {
	e.f & 512 || e.deps === null ? mt(e, v) : mt(e, b);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function gt(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), mt(e, v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
function _t(e, t) {
	if (t) {
		let t = document.body;
		e.autofocus = !0, dt(() => {
			document.activeElement === t && e.focus();
		});
	}
}
function vt(e) {
	Te && /* @__PURE__ */ xn(e) !== null && Cn(e);
}
var yt = !1;
function bt() {
	yt || (yt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[me]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function xt(e) {
	var t = ir, n = sr;
	or(null), cr(null);
	try {
		return e();
	} finally {
		or(t), cr(n);
	}
}
function St(e, t, n, r = n) {
	e.addEventListener(t, () => xt(n));
	let i = e[me];
	e[me] = i ? () => {
		i(), r(!0);
	} : () => r(!0), bt();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function Ct(e, t, n, r) {
	let i = ct() ? Dt : At;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = sr, c = wt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				On(e, s);
			}
			Tt();
		}
	}
	var d = Et();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ kt(e))).then(u).catch((e) => On(e, s)).finally(d);
	}
	l ? l.then(() => {
		s.f & 16384 ? d() : (c(), f(), Tt());
	}) : f();
}
function wt() {
	var e = sr, t = ir, n = tt, r = Lt;
	return function(i = !0) {
		cr(e), or(t), nt(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function Tt(e = !0) {
	cr(null), or(null), nt(null), e && Lt?.deactivate();
}
function Et() {
	var e = sr, t = e.b, n = Lt, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Dt(e) {
	var t = 2 | y;
	return sr !== null && (sr.f |= T), {
		ctx: tt,
		deps: null,
		effects: null,
		equals: Ne,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: ve,
		wv: 0,
		parent: sr,
		ac: null
	};
}
var Ot = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function kt(e, t, n) {
	let r = sr;
	r === null && Le();
	var i = void 0, a = an(ve), o = !ir, s = /* @__PURE__ */ new Set();
	return zn(() => {
		var t = sr, n = h();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== he && n.reject(e);
			}).finally(Tt);
		} catch (e) {
			n.reject(e), Tt();
		}
		var c = Lt;
		if (o) {
			if (t.f & 32768) var l = Et();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(Ot);
			else for (let e of s.values()) e.reject(Ot);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== Ot && (c.activate(), t ? (a.f |= ae, un(a, t)) : (a.f & 8388608 && (a.f ^= ae), un(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), Nn(() => {
		for (let e of s) e.reject(Ot);
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
function D(e) {
	let t = /* @__PURE__ */ Dt(e);
	return ur(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function At(e) {
	let t = /* @__PURE__ */ Dt(e);
	return t.equals = Fe, t;
}
function jt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) qn(t[n]);
	}
}
function Mt(e) {
	var t, n = sr, r = e.parent;
	if (!nr && r !== null && e.v !== ve && r.f & 24576) return Se(), e.v;
	cr(r);
	try {
		jt(e), t = Sr(e);
	} finally {
		cr(n);
	}
	return t;
}
function Nt(e) {
	var t = Mt(e);
	!e.equals(t) && (e.wv = yr(), (!Lt?.is_fork || e.deps === null) && (Lt === null ? e.v = t : (Lt.capture(e, t, !0), Rt?.capture(e, t, !0)), e.deps === null)) ? mt(e, v) : nr || (zt === null ? ht(e) : (Mn() || Lt?.is_fork) && zt.set(e, t));
}
function Pt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && xt(() => {
		t.ac.abort(he), t.ac = null;
	}), t.fn !== null && (t.teardown = f), Tr(t, 0), Gn(t));
}
function Ft(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Er(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var It = null, Lt = null, Rt = null, zt = null, Bt = null, Vt = !1, Ht = !1, Ut = null, Wt = null, Gt = 0, Kt = 1, qt = class e {
	id = Kt++;
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
		It === null ? It = this : (It.#n = this, this.#t = It), It = this;
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
			for (var r of n.d) mt(r, y), t(r);
			for (r of n.m) mt(r, b), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		var e = [];
		for (let i of this.#c) if (!(i.f & 16384 || !(i.f & 6144))) {
			for (var t = i, n = !1; t.parent !== null;) {
				t = t.parent;
				var r = t.f;
				if (r & 96) {
					if (!(r & 1024)) {
						n = !0;
						break;
					}
					t.f ^= v;
				}
			}
			n || e.push(t);
		}
		return this.#c = [], e;
	}
	#_() {
		this.#e = !0;
		for (let e of this.#u) this.#d.delete(e), mt(e, y), this.schedule(e);
		for (let e of this.#d) mt(e, b), this.schedule(e);
		this.apply();
		for (var t = Ut = [], n = [], r = Wt = []; this.#c.length > 0;) {
			Gt++ > 1e3 && (this.#S(), Yt());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw en(e), this.#h() || this.discard(), t;
			}
		}
		if (Lt = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (Ut = null, Wt = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) $t(e, t);
			r.length > 0 && Lt.#_();
			return;
		}
		let a = this.#y();
		if (a) this.#x(n), this.#x(t), a.#b(this);
		else {
			this.#u.clear(), this.#d.clear();
			for (let e of this.#r) e(this);
			this.#r.clear(), Rt = this, Zt(n), Zt(t), Rt = null, this.#s?.resolve();
			var o = Lt;
			if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
				if (o !== null) {
					for (let e of this.#c) o.#c.push(e);
					this.#c = [];
				} else o = this;
			}
			o !== null && (nn.clear(), o.#_());
		}
	}
	#v(e, t, n) {
		e.f ^= v;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= v : i & 4 ? t.push(r) : br(r) && (i & 16 && this.#d.add(r), Er(r));
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
	#y() {
		for (var e = this.#t; e !== null;) {
			if (!e.is_fork) {
				for (let [t, [, n]] of this.current) if (e.current.has(t) && !n) return e;
			}
			e = e.#t;
		}
		return null;
	}
	#b(e) {
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), mt(i, y), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), Lt = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) gt(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== ve && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), zt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		Lt = this;
	}
	deactivate() {
		Lt = null, zt = null;
	}
	flush() {
		try {
			Ht = !0, Lt = this, this.#_();
		} finally {
			Gt = 0, Bt = null, Ut = null, Wt = null, Ht = !1, Lt = null, zt = null, nn.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(Ot);
		this.#S(), this.#s?.resolve();
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
		this.#m || (this.#m = !0, dt(() => {
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
		return (this.#s ??= h()).promise;
	}
	static ensure() {
		if (Lt === null) {
			let t = Lt = new e();
			!Ht && !Vt && dt(() => {
				t.#e || t.flush();
			});
		}
		return Lt;
	}
	apply() {
		zt = null;
	}
	schedule(e) {
		Bt = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768) ? e.b.defer_effect(e) : this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? It = e : t.#t = e, this.linked = !1;
		}
	}
};
function Jt(e) {
	var t = Vt, n = Rt;
	Rt = null, Vt = !0;
	try {
		var r;
		for (e && (Jt(), r = e());;) {
			if (ft(), Lt === null) return r;
			Lt.flush();
		}
	} finally {
		Vt = t, Rt = n;
	}
}
function Yt() {
	try {
		He();
	} catch (e) {
		On(e, Bt);
	}
}
var Xt = null;
function Zt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && br(r) && (Xt = /* @__PURE__ */ new Set(), Er(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Yn(r), Xt?.size > 0)) {
				nn.clear();
				for (let e of Xt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Xt.has(n) && (Xt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Er(n);
					}
				}
				Xt.clear();
			}
		}
		Xt = null;
	}
}
function Qt(e) {
	Lt.schedule(e);
}
function $t(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), mt(e, v);
		for (var n = e.first; n !== null;) $t(n, t), n = n.next;
	}
}
function en(e) {
	mt(e, v);
	for (var t = e.first; t !== null;) en(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var tn = /* @__PURE__ */ new Set(), nn = /* @__PURE__ */ new Map(), rn = !1;
function an(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Ne,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function O(e, t) {
	let n = an(e, t);
	return ur(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function on(e, t = !1, n = !0) {
	let r = an(e);
	return t || (r.equals = Fe), Je && n && tt !== null && tt.l !== null && (tt.l.s ??= []).push(r), r;
}
function sn(e, t) {
	return k(e, Ar(() => F(e))), t;
}
function k(e, t, n = !1) {
	return ir !== null && (!ar || ir.f & 131072) && ct() && ir.f & 4325394 && (lr === null || !lr.has(e)) && Ke(), un(e, n ? mn(t) : t, Wt);
}
var cn = null, ln = 0;
function un(e, t, n = null) {
	if (!e.equals(t)) {
		nr ? nn.set(e, t) : nn.has(e) || nn.set(e, e.v);
		var r = qt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && Mt(t), zt === null && ht(t);
		}
		e.wv = yr(), cn = null, ln = 0, pn(e, y, n), cn = null, ct() && sr !== null && sr.f & 1024 && !(sr.f & 96) && (pr === null ? mr([e]) : pr.push(e)), !r.is_fork && tn.size > 0 && !rn && dn();
	}
	return t;
}
function dn() {
	rn = !1;
	for (let e of tn) {
		e.f & 1024 && mt(e, b);
		let t;
		try {
			t = br(e);
		} catch {
			t = !0;
		}
		t && Er(e);
	}
	tn.clear();
}
function fn(e) {
	k(e, e.v + 1);
}
function pn(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = ct(), a = r.length;
		if (ln += a, ln > 1e5 && cn === null && (cn = /* @__PURE__ */ new Set()), cn !== null) {
			if (cn.has(e)) return;
			cn.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== sr) {
				var l = (c & y) === 0;
				if (l && mt(s, t), c & 131072) tn.add(s);
				else if (c & 2) {
					var u = s;
					zt?.delete(u), pn(u, b, n);
				} else if (l) {
					var d = s;
					c & 16 && Xt !== null && Xt.add(d), n === null ? Qt(d) : n.push(d);
				}
			}
		}
	}
}
function mn(t) {
	if (typeof t != "object" || !t || oe in t || se in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ O(0), u = null, d = _r, f = (e) => {
		if (_r === d) return e();
		var t = ir, n = _r;
		or(null), vr(d);
		var r = e();
		return or(t), vr(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ O(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && We();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ O(n.value, u);
				return r.set(t, e), e;
			}) : k(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ O(ve, u));
					r.set(t, e), fn(o);
				}
			} else k(n, ve), fn(o);
			return !0;
		},
		get(e, n, i) {
			if (n === oe) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ O(mn(s ? e[n] : ve), u)), r.set(n, o)), o !== void 0) {
				var c = F(o);
				return c === ve ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var n = Reflect.getOwnPropertyDescriptor(e, t), i = r.get(t);
			if (i !== void 0) {
				var a = F(i);
				if (a === ve) return;
				if (n && "value" in n) n.value = a;
				else return {
					enumerable: !0,
					configurable: !0,
					value: a,
					writable: !0
				};
			}
			return n;
		},
		has(e, t) {
			if (t === oe) return !0;
			var n = r.get(t), i = n !== void 0 && n.v !== ve || Reflect.has(e, t);
			return (n !== void 0 || sr !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ O(i ? mn(e[t]) : ve, u)), r.set(t, n)), F(n) === ve) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ O(ve, u)), r.set(d + "", p)) : k(p, ve);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ O(void 0, u)), k(c, mn(n)), r.set(t, c));
			else {
				l = c.v !== ve;
				var m = f(() => mn(n));
				k(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && k(g, _ + 1);
				}
				fn(o);
			}
			return !0;
		},
		ownKeys(e) {
			F(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== ve;
			});
			for (var [n, i] of r) i.v !== ve && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			Ge();
		}
	});
}
var hn, gn, _n, vn;
function yn() {
	if (hn === void 0) {
		hn = window, gn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		_n = a(t, "firstChild").get, vn = a(t, "nextSibling").get, u(e) && (e[de] = void 0, e[ue] = null, e[fe] = void 0, e.__e = void 0), u(n) && (n[pe] = void 0);
	}
}
function bn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function xn(e) {
	return _n.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Sn(e) {
	return vn.call(e);
}
function A(e, t) {
	if (!Te) return /* @__PURE__ */ xn(e);
	var n = /* @__PURE__ */ xn(De);
	if (n === null) n = De.appendChild(bn());
	else if (t && n.nodeType !== 3) {
		var r = bn();
		return n?.before(r), Oe(r), r;
	}
	return t && En(n), Oe(n), n;
}
function j(e, t = !1) {
	if (!Te) {
		var n = /* @__PURE__ */ xn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ Sn(n) : n;
	}
	if (t) {
		if (De?.nodeType !== 3) {
			var r = bn();
			return De?.before(r), Oe(r), r;
		}
		En(De);
	}
	return De;
}
function M(e, t = !1) {
	if (!Te) return /* @__PURE__ */ xn(e);
	var n = A(e, t);
	return E(e), n;
}
function N(e, t = 1, n = !1) {
	let r = Te ? De : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ Sn(r);
	if (!Te) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = bn();
			return r === null ? i?.after(a) : r.before(a), Oe(a), a;
		}
		En(r);
	}
	return Oe(r), r;
}
function Cn(e) {
	e.textContent = "";
}
function wn() {
	return !1;
}
function Tn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function En(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function Dn(e) {
	var t = sr;
	if (t === null) return ir.f |= ae, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	On(e, t);
}
function On(e, t) {
	if (e === _e) throw e;
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
function kn(e) {
	sr === null && (ir === null && Ve(e), Be()), nr && ze(e);
}
function An(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function jn(e, t) {
	var n = sr;
	n !== null && n.f & 8192 && (e |= x);
	var r = {
		ctx: tt,
		deps: null,
		nodes: null,
		f: e | y | 512,
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
	Lt?.register_created_effect(r);
	var i = r;
	if (e & 4) Ut === null ? qt.ensure().schedule(r) : Ut.push(r);
	else if (t !== null) {
		try {
			Er(r);
		} catch (e) {
			throw qn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= ee));
	}
	if (i !== null && (i.parent = n, n !== null && An(i, n), ir !== null && ir.f & 2 && !(e & 64))) {
		var a = ir;
		(a.effects ??= []).push(i);
	}
	return r;
}
function Mn() {
	return ir !== null && !ar;
}
function Nn(e) {
	let t = jn(8, null);
	return mt(t, v), t.teardown = e, t;
}
function Pn(e) {
	kn("$effect");
	var t = sr.f;
	if (!ir && t & 32 && tt !== null && !tt.i) {
		var n = tt;
		(n.e ??= []).push(e);
	} else return Fn(e);
}
function Fn(e) {
	return jn(4 | te, e);
}
function In(e) {
	return kn("$effect.pre"), jn(8 | te, e);
}
function Ln(e) {
	qt.ensure();
	let t = jn(64 | T, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Xn(t, () => {
			qn(t), n(void 0);
		}) : (qn(t), n(void 0));
	});
}
function Rn(e) {
	return jn(4, e);
}
function zn(e) {
	return jn(ie | T, e);
}
function Bn(e, t = 0) {
	return jn(8 | t, e);
}
function P(e, t = [], n = [], r = []) {
	Ct(r, t, n, (t) => {
		jn(8, () => {
			e(...t.map(F));
		});
	});
}
function Vn(e, t = 0) {
	return jn(16 | t, e);
}
function Hn(e, t = 0) {
	return jn(_ | t, e);
}
function Un(e) {
	return jn(32 | T, e);
}
function Wn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = nr, r = ir;
		rr(!0), or(null);
		try {
			t.call(null);
		} catch (t) {
			On(t, e.parent);
		} finally {
			rr(n), or(r);
		}
	}
}
function Gn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && xt(() => {
			e.abort(he);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : qn(n, t), n = r;
	}
}
function Kn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || qn(t), t = n;
	}
}
function qn(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Jn(e.nodes.start, e.nodes.end), n = !0), e.f |= w, Gn(e, t && !n), Tr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Wn(e), e.f ^= w, e.f |= S;
	var i = e.parent;
	i !== null && i.first !== null && Yn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Jn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ Sn(e);
		e.remove(), e = n;
	}
}
function Yn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Xn(e, t, n = !0) {
	var r = [];
	e.f |= 256, Zn(e, r, !0);
	var i = () => {
		n && qn(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Zn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= x;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Zn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Qn(e) {
	e.f &= -257, $n(e, !0);
}
function $n(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= x, e.f & 1024 || (mt(e, y), qt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			$n(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function er(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ Sn(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var tr = null, nr = !1;
function rr(e) {
	nr = e;
}
var ir = null, ar = !1;
function or(e) {
	ir = e;
}
var sr = null;
function cr(e) {
	sr = e;
}
var lr = null;
function ur(e) {
	ir !== null && (ir.f & 2097152 || ir.f & 2) && (lr ??= /* @__PURE__ */ new Set()).add(e);
}
var dr = null, fr = 0, pr = null;
function mr(e) {
	pr = e;
}
var hr = 1, gr = 0, _r = gr;
function vr(e) {
	_r = e;
}
function yr() {
	return ++hr;
}
function br(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (br(a) && Nt(a), a.wv > e.wv) return !0;
		}
		t & 512 && zt === null && mt(e, v);
	}
	return !1;
}
function xr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(lr !== null && lr.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? xr(a, t, !1) : t === a && (n ? mt(a, y) : a.f & 1024 && mt(a, b), Qt(a));
	}
}
function Sr(e) {
	var t = dr, n = fr, r = pr, i = ir, a = lr, o = tt, s = ar, c = _r, l = e.f;
	dr = null, fr = 0, pr = null, ir = l & 96 ? null : e, lr = null, nt(e.ctx), ar = !1, _r = ++gr, e.ac !== null && (xt(() => {
		e.ac.abort(he);
	}), e.ac = null);
	try {
		e.f |= re;
		var u = e.fn, d = u();
		e.f |= C;
		var f = Cr(e);
		if (ct() && pr !== null && !ar && f !== null && !(e.f & 6146)) for (var p = 0; p < pr.length; p++) xr(pr[p], e);
		if (i !== null && i !== e) {
			if (gr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = gr;
			if (t !== null) for (let e of t) e.rv = gr;
			pr !== null && (r === null ? r = pr : r.push(...pr));
		}
		return e.f & 8388608 && (e.f ^= ae), d;
	} catch (t) {
		return Cr(e), Dn(t);
	} finally {
		e.f ^= re, dr = t, fr = n, pr = r, ir = i, lr = a, nt(o), ar = s, _r = c;
	}
}
function Cr(e) {
	var t = e.deps, n = Lt?.is_fork;
	if (dr !== null) {
		var r;
		if (n || Tr(e, fr), t !== null && fr > 0) for (t.length = fr + dr.length, r = 0; r < dr.length; r++) t[fr + r] = dr[r];
		else e.deps = t = dr;
		if (Mn() && e.f & 512) for (r = fr; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && fr < t.length && (Tr(e, fr), t.length = fr);
	return t;
}
function wr(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (dr === null || !n.call(dr, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512), s.v !== ve && ht(s), s.ac !== null && xt(() => {
			s.ac.abort(he), s.ac = null, mt(s, y);
		}), Pt(s), Tr(s, 0);
	}
}
function Tr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) wr(e, n[r]);
}
function Er(e) {
	var t = e.f;
	if (!(t & 16384)) {
		mt(e, v);
		var n = sr;
		sr = e;
		try {
			t & 16777232 ? Kn(e) : Gn(e), Wn(e);
			var r = Sr(e);
			e.teardown = typeof r == "function" ? r : null, e.wv = hr;
		} finally {
			sr = n;
		}
	}
}
async function Dr() {
	await Promise.resolve(), Jt();
}
function F(e) {
	var t = !!(e.f & 2);
	if (tr?.add(e), ir !== null && !ar && !(sr !== null && sr.f & 16384) && (lr === null || !lr.has(e))) {
		var r = ir.deps;
		if (ir.f & 2097152) e.rv < gr && (e.rv = gr, dr === null && r !== null && r[fr] === e ? fr++ : dr === null ? dr = [e] : dr.push(e));
		else {
			ir.deps ??= [], n.call(ir.deps, e) || ir.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [ir] : n.call(i, ir) || i.push(ir);
		}
	}
	if (nr && nn.has(e)) return nn.get(e);
	if (t) {
		var a = e;
		if (nr) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || kr(a)) && (o = Mt(a)), nn.set(a, o), o;
		}
		var s = !(a.f & 512) && !ar && ir !== null && !!(ir.f & 512), c = (a.f & C) === 0;
		br(a) && (s && (a.f |= 512), Nt(a)), s && !c && (Ft(a), Or(a));
	}
	if (zt?.has(e)) return zt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Or(e) {
	if (e.f |= 512, e.deps !== null) for (let r of e.deps) {
		var t = r.reactions;
		t === null ? r.reactions = [e] : n.call(t, e) || t.push(e), r.f & 2 && !(r.f & 512) && (Ft(r), Or(r));
	}
}
function kr(e) {
	if (e.v === ve) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (nn.has(t) || t.f & 2 && kr(t)) return !0;
	return !1;
}
function Ar(e) {
	var t = ar;
	try {
		return ar = !0, e();
	} finally {
		ar = t;
	}
}
function jr(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (oe in e) Mr(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && oe in n && Mr(n);
		}
	}
}
function Mr(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			Mr(e[n], t);
		} catch {}
		let n = l(e);
		if (n !== Object.prototype && n !== Array.prototype && n !== Map.prototype && n !== Set.prototype && n !== Date.prototype) {
			let t = o(n);
			for (let n in t) {
				let r = t[n].get;
				if (r) try {
					r.call(e);
				} catch {}
			}
		}
	}
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var Nr = ["touchstart", "touchmove"];
function Pr(e) {
	return Nr.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var Fr = Symbol("events"), Ir = /* @__PURE__ */ new Set(), Lr = /* @__PURE__ */ new Set();
function Rr(e) {
	if (!Te) return;
	e.removeAttribute("onload"), e.removeAttribute("onerror");
	let t = e.__e;
	t !== void 0 && (e.__e = void 0, queueMicrotask(() => {
		e.isConnected && e.dispatchEvent(t);
	}));
}
function zr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Wr.call(t, e), !e.cancelBubble) return xt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, dt(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function Br(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = zr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && Nn(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function I(e, t, n) {
	(t[Fr] ??= {})[e] = n;
}
function Vr(e) {
	for (var t = 0; t < e.length; t++) Ir.add(e[t]);
	for (var n of Lr) n(e);
}
var Hr = null, Ur = !1;
function Wr(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	Hr = e, Ur || (Ur = !0, setTimeout(() => {
		Ur = !1, Hr = null;
	}));
	var s = 0, c = Hr === e && e[Fr];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[Fr] = t;
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
		var d = ir, f = sr;
		or(null), cr(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[Fr]?.[r];
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
			e[Fr] = t, delete e.currentTarget, or(d), cr(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var Gr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Kr(e) {
	return Gr?.createHTML(e) ?? e;
}
function qr(e) {
	var t = Tn("template");
	return t.innerHTML = Kr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function Jr(e, t) {
	var n = sr;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function L(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (Te) return Jr(De, null), De;
		i === void 0 && (i = qr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ xn(i)));
		var t = r || gn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ xn(t), s = t.lastChild;
			Jr(o, s);
		} else Jr(t, t);
		return t;
	};
}
function Yr(e = "") {
	if (!Te) {
		var t = bn(e + "");
		return Jr(t, t), t;
	}
	var n = De;
	return n.nodeType === 3 ? En(n) : (n.before(n = bn()), Oe(n)), Jr(n, n), n;
}
function Xr() {
	if (Te) return Jr(De, null), De;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = bn();
	return e.append(t, n), Jr(t, n), e;
}
function R(e, t) {
	if (Te) {
		var n = sr;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = De), ke();
	} else e !== null && e.before(t);
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function Zr(e) {
	let t = 0, n = an(0), r;
	return () => {
		Mn() && (F(n), Bn(() => (t === 0 && (r = Ar(() => e(() => fn(n)))), t += 1, () => {
			dt(() => {
				--t, t === 0 && (r?.(), r = void 0, fn(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Qr = ee | T;
function $r(e, t, n, r) {
	new ei(e, t, n, r);
}
var ei = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = Te ? De : null;
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
	#h = Zr(() => (this.#m = an(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = sr;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = sr.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Vn(() => {
			if (Te) {
				let e = Me(this.#t);
				ke();
				let t = e === "[!";
				if (e.startsWith("[?")) {
					let t = JSON.parse(e.slice(2));
					this.#_(t);
				} else t ? this.#b() : this.#g();
			} else this.#x();
		}, Qr), Te && (this.#e = De);
	}
	#g() {
		try {
			this.#a = Un(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		dt(r), t && (this.#s = Un(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			this.#y() || (t ? we() : (t = !0, n && qe(), this.#s !== null && Xn(this.#s, () => {
				this.#s = null;
			}), this.#C(() => {
				this.#x();
			})));
		};
		return {
			reset: r,
			invoke_onerror: () => {
				if (!this.#y()) try {
					n = !0, this.#n.onerror?.(e, r), n = !1;
				} catch (e) {
					On(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		return (this.#i.f & (S | w)) !== 0;
	}
	#b() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = Un(() => e(this.#e)), dt(() => {
			if (!this.#y()) {
				var e = this.#c = document.createDocumentFragment(), t = bn(), n = !1;
				e.append(t), this.#a = this.#C(() => {
					try {
						return Un(() => this.#r(t));
					} catch (e) {
						try {
							this.error(e), n = !0;
						} catch (e) {
							On(e, this.#i.parent);
						}
						return null;
					}
				}), this.#a === null ? (this.#c = null, n && this.#S(Lt)) : this.#u === 0 && (this.#e.before(e), this.#c = null, Xn(this.#o, () => {
					this.#o = null;
				}), this.#S(Lt));
			}
		}));
	}
	#x() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = Un(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				er(this.#a, e);
				let t = this.#n.pending;
				this.#o = Un(() => t(this.#e));
			} else this.#S(Lt);
		} catch (e) {
			this.error(e);
		}
	}
	#S(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		gt(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#C(e) {
		var t = sr, n = ir, r = tt;
		cr(this.#i), or(this.#i), nt(this.#i.ctx);
		try {
			return qt.ensure(), e();
		} finally {
			cr(t), or(n), nt(r);
		}
	}
	#w(e, t) {
		this.has_pending_snippet() ? (this.#u += e, this.#u === 0 && (this.#S(t), this.#o && Xn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null))) : this.parent && this.parent.#w(e, t);
	}
	update_pending_count(e, t) {
		this.#w(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, dt(() => {
			this.#d = !1, this.#m && un(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), F(this.#m);
	}
	error(e) {
		if (e === _e || !this.#n.onerror && !this.#n.failed) throw e;
		Lt?.is_fork ? (this.#a && Lt.skip_effect(this.#a), this.#o && Lt.skip_effect(this.#o), this.#s && Lt.skip_effect(this.#s), Lt.oncommit(() => {
			this.#y() || this.#T(e);
		})) : this.#T(e);
	}
	#T(e) {
		this.#a &&= (qn(this.#a), null), this.#o &&= (qn(this.#o), null), this.#s &&= (qn(this.#s), null), Te && (Oe(this.#t), Ae(), Oe(je()));
		let t = this.#n.failed, n = (e) => {
			if (this.#y()) return;
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && !this.#y() && (this.#s = this.#C(() => {
				try {
					return Un(() => {
						var r = sr;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return On(e, this.#i.parent), null;
				}
			}));
		};
		dt(() => {
			if (!this.#y()) {
				var t;
				try {
					t = this.transform_error(e);
				} catch (e) {
					On(e, this.#i && this.#i.parent);
					return;
				}
				typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => On(e, this.#i && this.#i.parent)) : n(t);
			}
		});
	}
}, ti = !0;
function z(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[pe] ??= e.nodeValue) && (e[pe] = n, e.nodeValue = `${n}`);
}
function ni(e, t) {
	return ii(e, t);
}
var ri = /* @__PURE__ */ new Map();
function ii(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	yn();
	var l = void 0, u = Ln(() => {
		var u = n ?? t.appendChild(bn());
		$r(u, { pending: () => {} }, (t) => {
			at({});
			var n = tt;
			if (o && (n.c = o), a && (i.$$events = a), Te && Jr(t, null), ti = s, l = e(t, i) || st(), ti = !0, Te && (sr.nodes.end = De, De === null || De.nodeType !== 8 || De.data !== "]")) throw Ce(), _e;
			ot();
		}, c);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!d.has(r)) {
					d.add(r);
					var i = Pr(r);
					for (let e of [t, document]) {
						var a = ri.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), ri.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Wr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(r(Ir)), Lr.add(f), () => {
			for (var e of d) for (let n of [t, document]) {
				var r = ri.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Wr), r.delete(e), r.size === 0 && ri.delete(n)) : r.set(e, i);
			}
			Lr.delete(f), u !== n && u.parentNode?.removeChild(u);
		};
	});
	return ai.set(l, u), l;
}
var ai = /* @__PURE__ */ new WeakMap(), oi = class {
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
			if (n) Qn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Qn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (qn(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						er(r, t), t.append(bn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else qn(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Xn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (qn(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = Lt, r = wn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = bn();
				i.append(a), this.#n.set(e, {
					effect: Un(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, Un(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else Te && (this.anchor = De), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function B(e, t, n = !1) {
	var r;
	Te && (r = De, ke());
	var i = new oi(e), a = n ? ee : 0;
	function o(e, t) {
		if (Te) {
			var n = Me(r);
			if (e !== parseInt(n.substring(1))) {
				var a = je();
				Oe(a), i.anchor = a, Ee(!1), i.ensure(e, t), Ee(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	Vn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function si(e, t) {
	return t;
}
function ci(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		Xn(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					li(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = i.length === 0 && n !== null && e.pending.size === 0;
		if (l) {
			var u = n, d = u.parentNode;
			Cn(d), d.append(u), e.items.clear();
		}
		li(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function li(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ne, er(a, document.createDocumentFragment())) : qn(t[i], n);
	}
}
var ui;
function di(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = Te ? Oe(/* @__PURE__ */ xn(u)) : u.appendChild(bn());
	}
	Te && ke();
	var d = null, f = /* @__PURE__ */ At(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p = /* @__PURE__ */ new Map(), m = !0;
	function h(e) {
		if (!(_.effect.f & 16384)) {
			_.pending.delete(e);
			var t = F(f);
			_.fallback = d, pi(_, t, c, n, a), d !== null && (t.length === 0 ? d.f & 33554432 ? (d.f ^= ne, hi(d, null, c)) : Qn(d) : Xn(d, () => {
				d = null;
			}));
		}
	}
	function g(e) {
		_.pending.delete(e);
	}
	var _ = {
		effect: Vn(() => {
			var e = F(f), t = e.length;
			let r = !1;
			Te && Me(c) === "[!" != (t === 0) && (c = je(), Oe(c), Ee(!1), r = !0);
			for (var u = /* @__PURE__ */ new Set(), _ = Lt, v = wn(), y = 0; y < t; y += 1) {
				Te && De.nodeType === 8 && De.data === "]" && (c = De, r = !0, Ee(!1));
				var b = e[y], x = a(b, y), S = m ? null : l.get(x);
				S ? (S.v && un(S.v, b), S.i && un(S.i, y), v && _.unskip_effect(S.e)) : (S = mi(l, m ? c : ui ??= bn(), b, x, y, o, n, i), m || (S.e.f |= ne), l.set(x, S)), u.add(x);
			}
			if (t === 0 && s && !d && (m ? d = Un(() => s(c)) : (d = Un(() => s(ui ??= bn())), d.f |= ne)), t > u.size && Re("", "", ""), Te && t > 0 && Oe(je()), !m) {
				if (p.set(_, u), v) {
					for (let [e, t] of l) u.has(e) || _.skip_effect(t.e);
					_.oncommit(h), _.ondiscard(g);
				} else h(_);
			}
			r && Ee(!0), F(f);
		}),
		flags: n,
		items: l,
		pending: p,
		outrogroups: null,
		fallback: d
	};
	m = !1, Te && (c = De);
}
function fi(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function pi(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = fi(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Qn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= ne, _ === l) hi(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), gi(e, d, _), gi(e, _, y), hi(_, y, n), d = _, p = [], m = [], l = fi(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) hi(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					gi(e, S.prev, C.next), gi(e, d, S), gi(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), hi(_, l, n), gi(e, _.prev, _.next), gi(e, _, d === null ? e.effect.first : d.next), gi(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = fi(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = fi(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (li(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = fi(l.next);
		var ee = w.length;
		if (ee > 0) {
			var T = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.fix();
			}
			ci(e, w, T);
		}
	}
	o && dt(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function mi(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? an(n) : /* @__PURE__ */ on(n, !1, !1) : null, l = o & 2 ? an(i) : null;
	return {
		v: c,
		i: l,
		e: Un(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function hi(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ Sn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function gi(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
function V(e, t, n = !1, r = !1, i = !1, a = !1) {
	var o = e, s = "";
	if (n) {
		var c = e;
		Te && (o = Oe(/* @__PURE__ */ xn(c)));
	}
	P(() => {
		var e = sr;
		if (s === (s = t() ?? "")) Te && ke();
		else if (n && !Te) e.nodes = null, c.innerHTML = s, s !== "" && Jr(/* @__PURE__ */ xn(c), c.lastChild);
		else if (e.nodes !== null && (Jn(e.nodes.start, e.nodes.end), e.nodes = null), s !== "") {
			if (Te) {
				for (var a = De.data, l = ke(), u = l; l !== null && (l.nodeType !== 8 || l.data !== "");) u = l, l = /* @__PURE__ */ Sn(l);
				if (l === null) throw Ce(), _e;
				Jr(De, u), o = Oe(l);
			} else {
				var d = Tn(r ? "svg" : i ? "math" : "template", r ? be : i ? xe : void 0);
				d.innerHTML = s;
				var f = r || i ? d : d.content;
				if (Jr(/* @__PURE__ */ xn(f), f.lastChild), r || i) for (; /* @__PURE__ */ xn(f);) o.before(/* @__PURE__ */ xn(f));
				else o.before(f);
			}
		}
	});
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/snippet.js
function _i(e, t, ...n) {
	var r = new oi(e);
	Vn(() => {
		let e = t() ?? null;
		r.ensure(e, e && ((t) => e(t, ...n)));
	}, ee);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/svelte-component.js
function vi(e, t, n) {
	var r;
	Te && (r = De, ke());
	var i = new oi(e);
	Vn(() => {
		var e = t() ?? null;
		if (Te && Me(r) === "[" != (e !== null)) {
			var a = je();
			Oe(a), i.anchor = a, Ee(!1), i.ensure(e, e && ((t) => n(t, e))), Ee(!0);
		} else i.ensure(e, e && ((t) => n(t, e)));
	}, ee);
}
//#endregion
//#region node_modules/svelte/src/internal/client/timing.js
var yi = () => performance.now(), bi = {
	tick: (e) => requestAnimationFrame(e),
	now: () => yi(),
	tasks: /* @__PURE__ */ new Set()
};
//#endregion
//#region node_modules/svelte/src/internal/client/loop.js
function xi() {
	let e = bi.now();
	bi.tasks.forEach((t) => {
		t.c(e) || (bi.tasks.delete(t), t.f());
	}), bi.tasks.size !== 0 && bi.tick(xi);
}
function Si(e) {
	let t;
	return bi.tasks.size === 0 && bi.tick(xi), {
		promise: new Promise((n) => {
			bi.tasks.add(t = {
				c: e,
				f: n
			});
		}),
		abort() {
			bi.tasks.delete(t);
		}
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/transitions.js
function Ci(e, t) {
	xt(() => {
		e.dispatchEvent(new CustomEvent(t));
	});
}
function wi(e) {
	if (e === "float") return "cssFloat";
	if (e === "offset") return "cssOffset";
	if (e.startsWith("--")) return e;
	let t = e.split("-");
	return t.length === 1 ? t[0] : t[0] + t.slice(1).map((e) => e[0].toUpperCase() + e.slice(1)).join("");
}
function Ti(e) {
	let t = {}, n = e.split(";");
	for (let e of n) {
		let [n, r] = e.split(":");
		if (!n || r === void 0) break;
		let i = wi(n.trim());
		t[i] = r.trim();
	}
	return t;
}
var Ei = (e) => e;
function Di(e, t, n, r) {
	var i = !!(e & 1), a = !!(e & 2), o = i && a, s = !!(e & 4), c = o ? "both" : i ? "in" : "out", l, u = t.inert, d = t.style.overflow, f, p;
	function m() {
		return xt(() => l ??= n()(t, r?.() ?? {}, { direction: c }));
	}
	var h = {
		is_global: s,
		in() {
			t.inert = u, i ? (a || f?.abort(), f = Oi(t, m(), p, 1, () => {
				Ci(t, "introstart");
			}, () => {
				Ci(t, "introend"), f?.abort(), f = l = void 0, t.style.overflow = d;
			})) : (p?.abort(), p?.reset?.());
		},
		out(e) {
			a ? (t.inert = !0, p = Oi(t, m(), f, 0, () => {
				Ci(t, "outrostart");
			}, () => {
				Ci(t, "outroend"), e?.();
			})) : (e?.(), l = void 0);
		},
		stop: () => {
			f?.abort(), p?.abort();
		}
	}, g = sr;
	if ((g.nodes.t ??= []).push(h), i && ti) {
		var _ = s;
		if (!_) {
			for (var v = g.parent; v && v.f & 65536;) for (; (v = v.parent) && !(v.f & 16););
			_ = !v || !!(v.f & 32768);
		}
		_ && Rn(() => {
			Ar(() => h.in());
		});
	}
}
function Oi(e, t, n, r, i, a) {
	var o = r === 1, s = !1;
	if (d(t)) {
		var c;
		return dt(() => {
			s || (c = Oi(e, t({ direction: o ? "in" : "out" }), n, r, i, a));
		}), {
			abort: () => {
				s = !0, c?.abort();
			},
			deactivate: () => c?.deactivate(),
			reset: () => c?.reset(),
			t: () => c?.t() ?? 1 - r
		};
	}
	if (n?.deactivate(), !t?.duration && !t?.delay) return i(), a(), {
		abort: f,
		deactivate: f,
		reset: f,
		t: () => r
	};
	let { delay: l = 0, css: u, tick: p, easing: m = Ei } = t;
	var h, g = () => 1 - r;
	return dt(() => {
		if (!s) {
			var c = [];
			if (o && n === void 0 && (p && p(0, 1), u)) {
				var d = Ti(u(0, 1));
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
						var v = o + s * m(_ / f), y = Ti(u(v, 1 - v));
						l.push(y), d ||= y.overflow === "hidden";
					}
					d && (e.style.overflow = "hidden"), g = () => {
						var e = h.currentTime;
						return o + s * m(e / c);
					}, p && Si(() => {
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
//#region node_modules/svelte/src/internal/client/dom/elements/attachments.js
function ki(e, t) {
	var n = void 0, r;
	Hn(() => {
		n !== (n = t()) && (r &&= (qn(r), null), n && (r = Un(() => {
			Rn(() => n(e));
		})));
	});
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
var Ai = [..." 	\n\r\f\xA0\v﻿"];
function ji(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Ai.includes(r[o - 1])) && (s === r.length || Ai.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function Mi(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function Ni(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function Pi(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(Ni)), i && c.push(...Object.keys(i).map(Ni));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = Ni(e.substring(l, u).trim());
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
		return r && (n += Mi(r)), i && (n += Mi(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function H(e, t, n, r, i, a) {
	var o = e[de];
	if (Te || o !== n || o === void 0) {
		var s = ji(n, r, a);
		(!Te || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[de] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function Fi(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function Ii(e, t, n, r) {
	var i = e[fe];
	if (Te || i !== t) {
		var a = Pi(t, r);
		(!Te || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[fe] = t;
	} else r && (Array.isArray(r) ? (Fi(e, n?.[0], r[0]), Fi(e, n?.[1], r[1], "important")) : Fi(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var Li = Symbol("is custom element"), Ri = Symbol("is html"), zi = ge ? "link" : "LINK", Bi = ge ? "progress" : "PROGRESS";
function U(e) {
	if (Te) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					G(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					G(e, "checked", null), e.checked = r;
				}
			}
		};
		e[me] = n, dt(n), bt();
	}
}
function W(e, t) {
	var n = Hi(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === Bi) && (e.value = t ?? "");
}
function Vi(e, t) {
	var n = Hi(e);
	n.checked !== (n.checked = t ?? void 0) && (e.checked = t);
}
function G(e, t, n, r) {
	var i = Hi(e);
	Te && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === zi) || i[t] !== (i[t] = n) && (t === "loading" && (e[le] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Wi(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function Hi(e) {
	return e[ue] ??= {
		[Li]: e.nodeName.includes("-"),
		[Ri]: e.namespaceURI === ye
	};
}
var Ui = /* @__PURE__ */ new Map();
function Wi(e) {
	var t = e.getAttribute("is") || e.nodeName, n = Ui.get(t);
	if (n) return n;
	Ui.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.add(s);
		i = l(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function Gi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	St(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = Ki(e) ? qi(a) : a, n(a), Lt !== null && r.add(Lt), await Dr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (Te && e.defaultValue !== e.value || Ar(t) == null && e.value) && (n(Ki(e) ? qi(e.value) : e.value), Lt !== null && r.add(Lt)), Bn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = Lt;
			if (r.has(i)) return;
		}
		Ki(e) && n === qi(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function Ki(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function qi(e) {
	return e === "" ? null : +e;
}
var Ji = /* @__PURE__ */ new class e {
	#e = /* @__PURE__ */ new WeakMap();
	#t;
	#n;
	static entries = /* @__PURE__ */ new WeakMap();
	constructor(e) {
		this.#n = e;
	}
	observe(e, t) {
		var n = this.#e.get(e) || /* @__PURE__ */ new Set();
		return n.add(t), this.#e.set(e, n), this.#r().observe(e, this.#n), () => {
			var n = this.#e.get(e);
			n.delete(t), n.size === 0 && (this.#e.delete(e), this.#t.unobserve(e));
		};
	}
	#r() {
		return this.#t ??= new ResizeObserver((t) => {
			for (var n of t) {
				e.entries.set(n.target, n);
				for (var r of this.#e.get(n.target) || []) r(n);
			}
		});
	}
}({ box: "border-box" });
function Yi(e, t, n) {
	var r = Ji.observe(e, () => n(e[t]));
	Rn(() => (Ar(() => n(e[t])), r));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Xi(e, t) {
	return e === t || e?.[oe] === t;
}
function Zi(e = st(), t, n, r) {
	var i = tt.r, a = sr;
	return Rn(() => {
		var o, s;
		return Bn(() => {
			o = s, s = r?.() || [], Ar(() => {
				Xi(n(...s), e) || (t(e, ...s), o && Xi(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && Xi(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/universal.js
function Qi(e, t, n, r, i) {
	var a = () => {
		r(n[e]);
	};
	n.addEventListener(t, a), i ? Bn(() => {
		n[e] = i();
	}) : a(), (n === document.body || n === window || n === document) && Nn(() => {
		n.removeEventListener(t, a);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function $i(e = !1) {
	let t = tt, n = t.l.u;
	if (!n) return;
	let r = () => jr(t.s);
	if (e) {
		let e = 0, n = {}, i = /* @__PURE__ */ Dt(() => {
			let r = !1, i = t.s;
			for (let e in i) i[e] !== n[e] && (n[e] = i[e], r = !0);
			return r && e++, e;
		});
		r = () => F(i);
	}
	n.b.length && In(() => {
		ea(t, r), m(n.b);
	}), Pn(() => {
		let e = Ar(() => n.m.map(p));
		return () => {
			for (let t of e) typeof t == "function" && t();
		};
	}), n.a.length && Pn(() => {
		ea(t, r), m(n.a);
	});
}
function ea(e, t) {
	if (e.l.s) for (let t of e.l.s) F(t);
	t();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var ta = !1;
function na(e) {
	var t = ta;
	try {
		return ta = !1, [e(), ta];
	} finally {
		ta = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function ra(e, t, n, r) {
	var i = !Je || !!(n & 2), o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ Dt(r), F(u)) : (l && (l = !1, c = s ? Ar(r) : r), c);
	let f;
	if (o) {
		var p = oe in e || ce in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = na(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && Ue(t), f(m)));
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
	var v = !1, y = (n & 1 ? Dt : At)(() => (v = !1, g()));
	o && F(y);
	var b = sr;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? F(y) : i && o ? mn(e) : e;
			return k(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return nr && v || b.f & 16384 ? y.v : F(y);
	});
}
function ia(e) {
	tt === null && Ie("onMount"), Je && tt.l !== null ? aa(tt).m.push(e) : Pn(() => {
		let t = Ar(e);
		if (typeof t == "function") return t;
	});
}
function aa(e) {
	var t = e.l;
	return t.u ??= {
		a: [],
		b: [],
		m: []
	};
}
//#endregion
//#region ../template/assets/engine/0.7.6/locales/site/nb.js
var oa = {
	lang: "nb",
	strings: {
		"nav.toFront": "Til forsiden",
		"nav.toLightTheme": "Bytt til lyst tema",
		"nav.toDarkTheme": "Bytt til mørkt tema",
		"nav.menu": "Meny",
		"nav.closeMenu": "Lukk menyen",
		"nav.dismissAnnouncement": "Lukk kunngjøringen",
		"nav.launcher": "Snarveier",
		"nav.launcherMore": "Vis flere",
		"nav.launcherLess": "Vis færre",
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
		"gallery.pause": "Sett lysbildene på pause",
		"gallery.play": "Spill av lysbildene",
		"ribbon.pause": "Sett båndet på pause",
		"ribbon.play": "Spill av båndet",
		"video.unknownUrl": "Ukjent videolenke (YouTube og Vimeo støttes)",
		"video.emptyHint": "Lim inn en YouTube- eller Vimeo-lenke i Egenskaper",
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
		"calendar.theme.pad.inDays.other": "I dag om {n} dager",
		"calendar.cardNo": "Nr. {n}",
		"calendar.theme.index.cardNo": "Kort nr. {n}",
		"calendar.theme.index.colDate": "Dato:",
		"calendar.theme.index.colTime": "Tid:",
		"calendar.theme.index.colPlace": "Sted:",
		"calendar.theme.index.signup": "Påmelding: ja, se lenke",
		"calendar.theme.index.openToAll": "Påmelding: ikke nødvendig",
		"calendar.theme.index.recurring": "Gjentas: ja",
		"calendar.updated": "Oppdatert {time}",
		"calendar.colStatus": "Status",
		"calendar.rowHint": "Trykk på en rad for detaljer",
		"calendar.theme.departures.now": "Avganger · program",
		"calendar.theme.departures.signup": "Påmeld",
		"calendar.theme.departures.openToAll": "Åpent",
		"calendar.theme.departures.subscribe": "Abonner på tavla",
		"calendar.theme.marquee.now": "Nå på plakaten",
		"calendar.theme.marquee.later": "Kommer snart",
		"calendar.theme.marquee.signup": "Billetter",
		"calendar.countLabel": "Arrangementer",
		"calendar.colCategory": "Kategori",
		"calendar.theme.receipt.period": "Høsten 2026",
		"calendar.venue": "Klubbhuset, Nedre gate 2",
		"calendar.admission": "Inngang",
		"calendar.admissionPrice": "Gratis",
		"calendar.thanks": "Takk for at du kommer!",
		"calendar.theme.receipt.program": "* Program *",
		"calendar.theme.receipt.countLabel": "Antall arrangement",
		"calendar.theme.receipt.nextShort": "Neste om",
		"calendar.theme.receipt.signup": "Påmelding",
		"calendar.theme.receipt.subscribe": "Abonner: skann eller trykk her",
		"calendar.theme.receipt.cardNo": "Kvittering nr {n}",
		"calendar.theme.seventies.period": "Oktober og november",
		"calendar.theme.seventies.now": "Hva skjer?",
		"calendar.theme.seventies.signup": "Bli med",
		"calendar.theme.seventies.subscribe": "Følg kalenderen, far out",
		"calendar.theme.deco.now": "Program",
		"calendar.theme.deco.signup": "Reserver plass",
		"calendar.more": "+{n}",
		"calendar.next": "Neste arrangement",
		"calendar.now": "Akkurat nå",
		"calendar.later": "Senere",
		"calendar.colDate": "Dato",
		"calendar.colTime": "Tid",
		"calendar.colEvent": "Arrangement",
		"calendar.colPlace": "Sted",
		"calendar.program": "Program",
		"calendar.allDay": "hele dagen",
		"calendar.count.one": "{n} arrangement",
		"calendar.count.other": "{n} arrangementer",
		"calendar.nextShort": "Neste",
		"calendar.thisMonth": "Denne måneden",
		"calendar.scrollPrev": "Forrige kort",
		"calendar.scrollNext": "Neste kort",
		"calendar.weekN": "Uke {n}",
		"calendar.range": "{from} til {to}",
		"calendar.prevWeek": "Forrige uke",
		"calendar.nextWeek": "Neste uke",
		"calendar.prevDay": "Forrige dag",
		"calendar.nextDay": "Neste dag",
		"calendar.todayBtn": "I dag",
		"calendar.todayCount.one": "{n} i dag",
		"calendar.todayCount.other": "{n} i dag",
		"calendar.wheel": "Årshjul",
		"calendar.pickMonth": "Velg en måned på hjulet for å se dens arrangementer",
		"calendar.wholeYear": "Hele året",
		"calendar.fewer": "Færre",
		"calendar.moreLegend": "Flere",
		"calendar.pickDay": "Pek på en dag for å se arrangementene",
		"calendar.showCalendar": "Vis kalenderen {name}",
		"calendar.unnamed": "Arrangementer",
		"calendar.then": "Deretter",
		"calendar.unitDays.one": "dag",
		"calendar.unitDays.other": "dager",
		"calendar.unitHours.one": "time",
		"calendar.unitHours.other": "timer",
		"calendar.unitMin.one": "min",
		"calendar.unitMin.other": "min",
		"calendar.monthNone": "Ingenting denne måneden",
		"calendar.monthYear": "{m} {y}",
		"calendar.monthRange": "{from} · {to}",
		"calendar.dayTime": "{date} {time}",
		"calendar.demoTitle1": "Oppstartskveld",
		"calendar.demoTitle2": "Medlemsmøte",
		"calendar.demoTitle3": "Høsttur",
		"calendar.demoTitle4": "Åpen trening",
		"calendar.demoTitle5": "Dugnad",
		"calendar.demoCat1": "Sosialt",
		"calendar.demoCat2": "Møte",
		"calendar.demoCat3": "Tur",
		"calendar.demoLoc1": "Klubbhuset",
		"calendar.demoLoc2": "Oppmøte ved parkeringen",
		"calendar.demoDesc1": "Lett trening for alle nivåer. Ta med innesko og vannflaske. Mer om treningen:",
		"calendar.demoDesc2": "Vi møtes også på nett for dem som ikke kan komme:",
		"calendar.demoDesc3": "Fast møte for medlemmene. Sakslisten sendes ut uka før.",
		"calendar.demoDesc4": "To dager i marka med overnatting. Påmelding innen fredag:",
		"calendar.browse": "Bla gjennom kortene",
		"calendar.untilStart": "Fram til start",
		"calendar.wholeProgram": "Hele programmet",
		"calendar.noticeLabel": "Kunngjøring",
		"calendar.moreInfo": "Les mer",
		"calendar.readWhole": "Les hele",
		"calendar.nextN.one": "{n} neste",
		"calendar.nextN.other": "{n} neste",
		"calendar.series": "Fast arrangement",
		"calendar.when": "Når",
		"calendar.where": "Hvor",
		"calendar.forWhom": "For hvem",
		"calendar.openAll": "Åpent for alle",
		"calendar.period": "Sesongen 2026",
		"calendar.allDates": "Alle datoer",
		"calendar.emptyKicker": "Datoer",
		"calendar.emptyTitle": "Datoer kommer",
		"calendar.swUpcoming": "Kommende",
		"calendar.swWeek": "Uke",
		"calendar.swMonth": "Måned",
		"calendar.recurring": "Gjentas",
		"calendar.organizer": "Arrangør",
		"calendar.moreAbout": "Mer om {name}",
		"calendar.openToAll": "Åpent for alle",
		"calendar.showAll": "Vis alle {n} ({m} til)",
		"calendar.join": "Bli med",
		"calendar.addEvent": "Legg i kalender",
		"calendar.close": "Lukk",
		"calendar.addOne": "Bare dette arrangementet",
		"calendar.addFile": "Last ned som fil (.ics)",
		"calendar.addWhole": "Hele kalenderen",
		"calendar.icalAddress": "Kalenderens iCal-adresse",
		"calendar.cancelled": "Avlyst",
		"calendar.until": "til {date}",
		"calendar.timeRange": "{from}-{to}",
		"calendar.dayMonth": "{d}. {m}",
		"calendar.zoneOf": "Tidene vises i {zone}",
		"calendar.zoneYours": "Tidene vises i din tidssone ({zone})",
		"calendar.loading": "Laster kalenderen",
		"calendar.dayNone": "Ingenting denne dagen",
		"calendar.earlier": "Tidligere ({n})",
		"calendar.search": "Søk i arrangementene",
		"calendar.bandPause": "Sett arrangementene på pause",
		"calendar.bandPlay": "Spill av arrangementene",
		"calendar.noMatch": "Ingen arrangementer passer",
		"calendar.onMap": "Vis i kart",
		"calendar.viewsLabel": "Visning",
		"calendar.categoriesLabel": "Kategorier",
		"calendar.countdownClock": "{d}d {h}t {m}m",
		"calendar.weekdayDay": "{wd} {d}.",
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
}, sa = [
	"nb",
	"nn",
	"en-GB",
	"se",
	"tr"
], ca = /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/, la = {
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
function ua(e) {
	let t = String(e ?? "").trim().toLowerCase();
	for (let [e, n] of Object.entries(la)) if (n.some((e) => t === e || t.startsWith(`${e}-`))) return e;
	return null;
}
function da(e) {
	return sa.includes(String(e ?? ""));
}
function fa(e) {
	let t = [];
	if (!Array.isArray(e)) return ["languages must be a list"];
	for (let n of e) {
		if (!n || typeof n != "object" || Array.isArray(n)) {
			t.push("languages: every entry must be an object");
			continue;
		}
		let e = String(n.code ?? "");
		ca.test(e) ? da(e) && t.push(`languages: '${e}' is built into Urd and cannot be overridden`) : t.push(`languages: '${e}' is not a valid language code`), (typeof n.name != "string" || !n.name.trim()) && t.push(`languages/${e}: name is missing (the language's own name)`);
		for (let r of ["site", "admin"]) n[r] !== void 0 && typeof n[r] != "boolean" && t.push(`languages/${e}: ${r} must be a boolean`);
		n.site !== !0 && n.admin !== !0 && t.push(`languages/${e}: must cover site, admin or both`);
	}
	return t;
}
function pa(e) {
	let t = ua(e);
	if (t) return t;
	let n = String(e ?? "").trim();
	return ca.test(n) ? n : "nb";
}
async function ma(e, t) {
	try {
		return await (await import(
			/* @vite-ignore */
			"/assets/urd/language-packs.js"
)).loadPackStrings(e, t);
	} catch {
		return null;
	}
}
var ha = {
	lang: "nb",
	dict: { ...oa.strings },
	own: oa.strings,
	dates: null
}, ga = {
	lang: "nb",
	dict: {}
};
function _a(e, t) {
	if (!t) return e;
	let n = e;
	for (let [e, r] of Object.entries(t)) n = n.replaceAll(`{${e}}`, String(r));
	return n;
}
function K(e, t) {
	return _a(ga.dict[e] ?? e, t);
}
function va(e, t) {
	let n = "other";
	try {
		n = new Intl.PluralRules(ha.lang).select(t);
	} catch {}
	let r = ha.dict[`${e}.${n}`] !== void 0 || ha.dict[`${e}.other`] === void 0 ? n : "other";
	return {
		form: r,
		key: `${e}.${r}`
	};
}
function ya(e, t, n) {
	let { key: r } = va(e, t);
	return _a(ha.dict[r] ?? r, {
		...n,
		n: t
	});
}
function ba(e) {
	let t = `api.${e?.code}`;
	return e?.code && ga.dict[t] !== void 0 ? _a(ga.dict[t], e) : e?.error ?? null;
}
function xa() {
	return ga.lang;
}
function Sa() {
	let e = null;
	try {
		e = localStorage.getItem("urd-admin-lang");
	} catch {}
	if (e) return pa(e);
	for (let e of navigator.languages ?? [navigator.language]) {
		let t = ua(e);
		if (t) return t;
	}
	return "en-GB";
}
var Ca;
new Promise((e) => {
	Ca = e;
});
async function wa(e = Sa()) {
	let t = async (e) => (await import(
		/* @vite-ignore */
		`/assets/urd/locales/admin/${e}.js`
)).default.strings;
	ga.lang = pa(e);
	let n = da(ga.lang);
	try {
		Object.assign(ga.dict, await t("nb")), n && ga.lang !== "nb" && Object.assign(ga.dict, await t(ga.lang));
	} catch {}
	if (!n) {
		let e = await ma(ga.lang, "admin");
		e ? Object.assign(ga.dict, e) : ga.lang = "nb";
	}
	return Ca(ga.lang), ga.lang;
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region src/lib/icons.js
var q = {
	copy: "<svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"9\" y=\"9\" width=\"11\" height=\"11\" rx=\"2\"/><path d=\"M5 15V5a2 2 0 0 1 2-2h10\"/></svg>",
	phone: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"><rect x=\"8\" y=\"3\" width=\"8\" height=\"18\" rx=\"2\"/><path d=\"M11 17.5h2\"/></svg>",
	shuffle: "<svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M16 3h5v5\"/><path d=\"M4 20 21 3\"/><path d=\"M21 16v5h-5\"/><path d=\"M15 15l6 6\"/><path d=\"M4 4l5 5\"/></svg>",
	pencil: "<svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17 3l4 4L8 20l-5 1 1-5L17 3z\"/></svg>",
	eye: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z\"/><circle cx=\"12\" cy=\"12\" r=\"2.6\"/></svg>",
	warn: "<svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3L2 20h20L12 3z\"/><path d=\"M12 10v4\"/><path d=\"M12 17.2h.01\"/></svg>",
	up: "<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 20V4\"/><path d=\"M5 11l7-7 7 7\"/></svg>",
	down: "<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 4v16\"/><path d=\"M5 13l7 7 7-7\"/></svg>",
	right: "<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12h16\"/><path d=\"M13 5l7 7-7 7\"/></svg>",
	pin: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linejoin=\"round\"><path d=\"M14 3l7 7-3 1-4 4 1 4-3 1-3-5-5 5v-2l4-4-5-3 1-3 4 1 4-4z\"/></svg>",
	pinOn: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"currentColor\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linejoin=\"round\"><path d=\"M14 3l7 7-3 1-4 4 1 4-3 1-3-5-5 5v-2l4-4-5-3 1-3 4 1 4-4z\"/></svg>",
	cross: "<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\"><path d=\"M5 5l14 14\"/><path d=\"M19 5L5 19\"/></svg>",
	plus: "<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\"><path d=\"M12 5v14\"/><path d=\"M5 12h14\"/></svg>",
	minus: "<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\"><path d=\"M5 12h14\"/></svg>",
	gear: "<svg width=\"15\" height=\"15\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z\"/></svg>",
	guides: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 2v20M2 12h20\" stroke-dasharray=\"3 3\"/><rect x=\"7.5\" y=\"7.5\" width=\"9\" height=\"9\" rx=\"1.5\"/></svg>",
	image: "<svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\"/><circle cx=\"8.5\" cy=\"9.5\" r=\"1.6\"/><path d=\"M4 17l5-5 4 4 3-2 4 4\"/></svg>",
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
};
//#endregion
//#region ../template/assets/engine/0.7.6/anchored.js
function Ta(e = globalThis) {
	let t = e?.HTMLElement?.prototype, n = e?.CSS;
	return !!(t && "popover" in t && typeof t.showPopover == "function" && typeof n?.supports == "function" && n.supports("anchor-name: --urd") && n.supports("position-try-fallbacks: flip-block"));
}
var Ea = 0;
function Da(e = "urd-pop") {
	return Ea += 1, `--${e}-${Ea}`;
}
function Oa(e, t) {
	let n = e?.closest?.(".panel-body, .block-menu-body");
	n && (t ? n.style.setProperty("anchor-name", "--urd-pane") : n.style.removeProperty("anchor-name"));
}
//#endregion
//#region src/lib/Dropdown.svelte
var ka = /* @__PURE__ */ L("<span aria-hidden=\"true\"><svg viewBox=\"0 0 16 16\" width=\"1em\" height=\"1em\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"svelte-vtocc6\"><path d=\"M3.5 6l4.5 4.5L12.5 6\"></path></svg></span>"), Aa = /* @__PURE__ */ L("<span class=\"dd-note svelte-vtocc6\"> </span>"), ja = /* @__PURE__ */ L("<button type=\"button\"> <!></button>"), Ma = /* @__PURE__ */ L("<button type=\"button\"><span class=\"dd-value svelte-vtocc6\"> </span> <!></button> <div class=\"dd-pop dd-anchored svelte-vtocc6\" popover=\"auto\"><!></div>", 1), Na = /* @__PURE__ */ L("<div class=\"dd-pop svelte-vtocc6\"></div>"), Pa = /* @__PURE__ */ L("<button type=\"button\"><span class=\"dd-value svelte-vtocc6\"> </span> <!></button> <!>", 1), Fa = /* @__PURE__ */ L("<span class=\"dd svelte-vtocc6\"><!></span>");
function J(e, t) {
	at(t, !0);
	let n = (e) => {
		var t = ka();
		let n;
		P(() => n = H(t, 1, "dd-caret svelte-vtocc6", null, n, { "dd-caret-open": F(f) })), R(e, t);
	}, r = ra(t, "value", 3, null), i = ra(t, "options", 19, () => []), a = ra(t, "title", 3, null), o = ra(t, "disabled", 3, !1), s = ra(t, "filled", 3, !1), c = ra(t, "compact", 3, !1), l = Ta(), u = Da("urd-dd"), d = u.slice(2), f = /* @__PURE__ */ O(!1), p = /* @__PURE__ */ O(null), m = /* @__PURE__ */ O(null), h = /* @__PURE__ */ O(mn({
		top: 0,
		left: 0,
		width: 160
	})), _ = () => i().find(([e]) => `${e ?? ""}` == `${r() ?? ""}`)?.[1] ?? "";
	function v() {
		let e = F(p).getBoundingClientRect(), t = Math.min(320, i().reduce((e, t) => e + (t[2] ? 76 : 32), 12)), n = Math.max(e.width, 160), r = e.bottom + t + 8 <= window.innerHeight;
		k(h, {
			top: r ? e.bottom + 4 : Math.max(8, e.top - t - 4),
			left: Math.max(8, Math.min(e.left, window.innerWidth - n - 8)),
			width: n
		}, !0);
	}
	function y() {
		o() || (F(f) ? k(f, !1) : (v(), k(f, !0)));
	}
	function b(e) {
		l && F(m)?.hidePopover(), k(f, !1), t.onchange?.(e);
	}
	Pn(() => {
		if (!F(f)) return;
		let e = () => {
			l ? F(m)?.hidePopover() : k(f, !1);
		};
		if (window.addEventListener("blur", e), l) return () => window.removeEventListener("blur", e);
		let t = (e) => {
			F(p) && !F(p).contains(e.target) && k(f, !1);
		}, n = (e) => {
			e.key === "Escape" && k(f, !1);
		}, r = (e) => {
			F(p) && e.target instanceof Node && !F(p).contains(e.target) && v();
		};
		return document.addEventListener("pointerdown", t, !0), document.addEventListener("keydown", n, !0), document.addEventListener("scroll", r, !0), () => {
			window.removeEventListener("blur", e), document.removeEventListener("pointerdown", t, !0), document.removeEventListener("keydown", n, !0), document.removeEventListener("scroll", r, !0);
		};
	});
	var x = Fa(), S = A(x), C = (e) => {
		var t = Ma(), l = j(t);
		let p;
		var h = A(l), v = M(h, !0), y = N(h, 2);
		n(y), E(l);
		var x = N(l, 2), S = A(x), C = (e) => {
			var t = Xr();
			di(j(t), 17, i, ([e, t, n]) => `${e ?? ""}`, (e, t) => {
				var n = /* @__PURE__ */ D(() => g(F(t), 3));
				let i = () => F(n)[0], a = () => F(n)[1], o = () => F(n)[2];
				var s = ja();
				let c;
				var l = A(s, !0), u = N(l), d = (e) => {
					var t = Aa(), n = M(t, !0);
					P(() => z(n, o())), R(e, t);
				};
				B(u, (e) => {
					o() && e(d);
				}), E(s), P(() => {
					c = H(s, 1, "dd-opt svelte-vtocc6", null, c, { selected: `${i() ?? ""}` == `${r() ?? ""}` }), z(l, a());
				}), I("click", s, () => b(i())), R(e, s);
			}), R(e, t);
		};
		B(S, (e) => {
			F(f) && e(C);
		}), E(x), Zi(x, (e) => k(m, e), () => F(m)), P((e) => {
			p = H(l, 1, "dd-btn svelte-vtocc6", null, p, {
				"dd-filled": s(),
				"dd-compact": c()
			}), G(l, "title", a()), l.disabled = o(), G(l, "popovertarget", d), Ii(l, `anchor-name: ${u ?? ""}`), z(v, e), G(x, "id", d), Ii(x, `position-anchor: ${u ?? ""}`);
		}, [() => _()]), Br("toggle", x, (e) => {
			k(f, e.newState === "open");
		}), R(e, t);
	}, w = (e) => {
		var t = Pa(), l = j(t);
		let u;
		var d = A(l), p = M(d, !0), m = N(d, 2);
		n(m), E(l);
		var v = N(l, 2), x = (e) => {
			var t = Na();
			di(t, 21, i, ([e, t, n]) => `${e ?? ""}`, (e, t) => {
				var n = /* @__PURE__ */ D(() => g(F(t), 3));
				let i = () => F(n)[0], a = () => F(n)[1], o = () => F(n)[2];
				var s = ja();
				let c;
				var l = A(s, !0), u = N(l), d = (e) => {
					var t = Aa(), n = M(t, !0);
					P(() => z(n, o())), R(e, t);
				};
				B(u, (e) => {
					o() && e(d);
				}), E(s), P(() => {
					c = H(s, 1, "dd-opt svelte-vtocc6", null, c, { selected: `${i() ?? ""}` == `${r() ?? ""}` }), z(l, a());
				}), I("click", s, () => b(i())), R(e, s);
			}), E(t), P(() => Ii(t, `top: ${F(h).top ?? ""}px; left: ${F(h).left ?? ""}px; min-width: ${F(h).width ?? ""}px`)), R(e, t);
		};
		B(v, (e) => {
			F(f) && e(x);
		}), P((e) => {
			u = H(l, 1, "dd-btn svelte-vtocc6", null, u, {
				"dd-filled": s(),
				"dd-compact": c()
			}), G(l, "title", a()), l.disabled = o(), z(p, e);
		}, [() => _()]), I("click", l, y), R(e, t);
	};
	B(S, (e) => {
		l ? e(C) : e(w, -1);
	}), E(x), Zi(x, (e) => k(p, e), () => F(p)), R(e, x), ot();
}
Vr(["click"]);
function Ia(e) {
	return Number(e) === 2 ? 2 : 1;
}
//#endregion
//#region ../template/assets/engine/0.7.6/gallery-layout.js
var La = [
	"floating",
	"fill",
	"band",
	"mosaic"
], Ra = [
	"rect",
	"square",
	"circle",
	"oval",
	"pill",
	"arch",
	"triangle",
	"diamond",
	"hexagon",
	"octagon",
	"star",
	"heart",
	"blob",
	"leaf",
	"slant"
], za = [
	"shadow",
	"plain",
	"polaroid",
	"border",
	"thick",
	"dark",
	"double",
	"glow",
	"tape",
	"pin",
	"stamp",
	"film",
	"soft"
], Ba = [
	"natural",
	"mono",
	"sepia",
	"vintage",
	"faded",
	"warm",
	"cool",
	"duotone",
	"punchy",
	"noir",
	"dim",
	"pop"
], Va = [
	"square",
	"circle",
	"triangle",
	"diamond",
	"hexagon",
	"octagon",
	"star",
	"heart"
], Ha = {
	floating: [
		"none",
		"drift",
		"rise",
		"kenburns",
		"crossfade",
		"bounce"
	],
	fill: [
		"none",
		"drift",
		"kenburns"
	],
	mosaic: [
		"none",
		"crossfade",
		"kenburns"
	],
	band: ["none"]
}, Ua = {
	floating: "drift",
	fill: "none",
	mosaic: "crossfade",
	band: "none"
}, Wa = {
	min: 1,
	max: 20,
	dflt: 8
}, Ga = {
	min: 60,
	max: 400
}, Ka = {
	floating: 140,
	band: 156,
	mosaic: 140,
	fill: 0
}, qa = {
	polaroid: "#ffffff",
	border: "#ffffff",
	thick: "#ffffff",
	double: "#ffffff",
	dark: "#161616",
	glow: "accent"
}, Ja = 1.35, Ya = {
	min: 0,
	max: 1,
	dflt: .85
}, Xa = {
	min: 0,
	max: 15,
	dflt: 5
}, Za = {
	min: 0,
	max: 48,
	dflt: 5
}, Qa = {
	min: .5,
	max: 90,
	dflt: 30
}, $a = {
	min: .5,
	max: 90,
	dflt: 12
}, eo = {
	min: 4,
	max: 20,
	dflt: 12
};
function to(e) {
	let t = String(e), n = 5381;
	for (let e = 0; e < t.length; e++) n = (n << 5) + n + t.charCodeAt(e) >>> 0;
	return n;
}
function no(e, t) {
	let n = to(`${e}:${t}`);
	return n ^= n >>> 15, n = Math.imul(n, 739982445) >>> 0, n ^= n >>> 12, n = Math.imul(n, 695872825) >>> 0, n ^= n >>> 15, (n >>> 0) / 4294967296;
}
function ro(e) {
	let t = Math.abs(Math.round(Number(e) || 0)) % 3, n = (e) => `rgba(128,128,128,${e})`, r = [
		64,
		104,
		150
	][t], i = [
		"M0 150 L60 96 L108 150 Z M84 150 L138 108 L180 150 Z",
		"M0 150 L44 110 L92 150 Z M70 150 L128 88 L180 150 Z",
		"M0 150 L72 84 L132 150 Z M110 150 L156 116 L180 150 Z"
	][t], a = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 150"><rect width="180" height="150" fill="${n(.14 + t * .04)}"/><circle cx="${r}" cy="44" r="15" fill="${n(.4)}"/><path d="${i}" fill="${n(.45)}"/></svg>`;
	return `data:image/svg+xml,${encodeURIComponent(a)}`;
}
function io(e) {
	return Array.from({ length: Math.max(1, Math.round(Number(e) || 0)) }, (e, t) => ({ src: ro(t) }));
}
var ao = (e) => Math.round(e * 100) / 100;
function oo(e, { min: t, max: n, dflt: r }) {
	if (e == null || e === "") return r;
	let i = Number(e);
	return Number.isFinite(i) ? Math.min(n, Math.max(t, i)) : r;
}
function so(e) {
	return La.includes(e) ? e : "floating";
}
function co(e, t) {
	let n = so(e);
	return Ha[n].includes(t) ? t : Ua[n];
}
function lo(e) {
	return Ha[so(e)];
}
function uo({ style: e = "floating", motion: t, reducedMotion: n = !1 } = {}) {
	return n ? !1 : so(e) === "band" || co(e, t) !== "none";
}
function fo(e, t, n, r = !1) {
	let i = Math.round(oo(e, so(t) === "mosaic" ? eo : Wa)), a = Number(n);
	return !r && Number.isFinite(a) && a > 0 ? Math.min(i, a) : i;
}
function po(e, t) {
	let n = Ka[so(t)] || Ka.floating;
	return Math.round(oo(e, {
		...Ga,
		dflt: n
	}));
}
function mo(e) {
	return _o(e) in qa;
}
function ho(e, t) {
	let n = qa[_o(e)] ?? "";
	return n && typeof t == "string" && t.trim() ? t.trim() : n;
}
function go(e) {
	return Ra.includes(e) ? e : "rect";
}
function _o(e) {
	return za.includes(e) ? e : "shadow";
}
function vo(e) {
	return Ba.includes(e) ? e : "natural";
}
function yo(e, t) {
	if (_o(t) === "polaroid") return .84;
	let n = go(e);
	return Va.includes(n) ? 1 : n === "arch" ? .8 : Ja;
}
function bo(e) {
	return ["rect", "square"].includes(go(e));
}
function xo(e) {
	return oo(e, $a);
}
function So(e) {
	return oo(e, Ya);
}
function Co(e) {
	return oo(e, Xa);
}
function wo(e) {
	return Math.round(oo(e, Za));
}
function To(e) {
	return oo(e, Qa);
}
function Eo(e) {
	return Ia(e);
}
function Do(e, t) {
	let n = Number(e);
	return Number.isFinite(n) && n > 0 ? Math.round(n) : Number(t) || 1;
}
function Oo(e, { count: t, seed: n, size: r, spread: i, tilt: a, style: o = "floating", repeat: s = !1 } = {}) {
	let c = (Array.isArray(e) ? e : []).filter((e) => e && typeof e.src == "string" && e.src), l = fo(t, o, c.length, s), u = po(r, o), d = So(i), f = Co(a), p = n == null || n === "" ? 1 : n, m = Math.ceil(Math.sqrt(l * 1.6)), h = Math.ceil(l / m), g = Array.from({ length: m * h }, (e, t) => t).map((e) => ({
		cell: e,
		at: no(p, `cell${e}`)
	})).sort((e, t) => e.at - t.at).map((e) => e.cell), _ = [];
	for (let e = 0; e < l; e++) {
		let t = g[e], n = (t % m + .5) / m + (no(p, `x${e}`) - .5) * (.9 / m), r = (Math.floor(t / m) + .5) / h + (no(p, `y${e}`) - .5) * (.9 / h);
		_.push({
			src: c.length ? c[e % c.length].src : "",
			index: c.length ? e % c.length : -1,
			x: ao(50 + (n - .5) * 100 * d),
			y: ao(50 + (r - .5) * 100 * d),
			w: Math.round(u * (.8 + no(p, `w${e}`) * .4)),
			rot: ko(p, e, f),
			phase: ao(no(p, `p${e}`)),
			heading: ao(no(p, `h${e}`))
		});
	}
	return _;
}
function ko(e, t, n) {
	return ao((no(e == null || e === "" ? 1 : e, `r${t}`) - .5) * 2 * Co(n));
}
function Ao(e, t) {
	let n = e == null || e === "" ? 1 : e, r = no(n, `m${t}`);
	return {
		cols: r < .3 ? 2 : 1,
		rows: r > .7 || r < .1 ? 2 : 1,
		phase: ao(no(n, `mp${t}`))
	};
}
function jo(e, t, n, r = !1) {
	let i = fo(e, "mosaic", n, r);
	return Array.from({ length: i }, (e, n) => Ao(t, n));
}
//#endregion
//#region ../template/assets/engine/0.7.6/preset-thumb.js
var Mo = /^#[0-9a-fA-F]{3,8}$/, No = /^[a-z][a-z0-9-]*$/, Po = "#171c26", Fo = "#232a38", Io = "#98a1b3", Lo = "#7c5cff", Ro = (e, t) => `var(--urd-color-${e}, ${t})`;
function zo(e, t) {
	return typeof e == "string" ? Mo.test(e) ? e : No.test(e) ? Ro(e, t) : t : t;
}
function Bo(e, t = 800) {
	let n = Number.parseFloat(e);
	return !Number.isFinite(n) || n <= 0 ? 400 : typeof e == "string" && e.trim().endsWith("vh") ? n / 100 * t : n;
}
var Vo = (e) => Math.round(e * 10) / 10, Ho = (e, t, n) => Math.min(n, Math.max(t, e)), Uo = (e, t, n, r, i, a = "") => `<rect x="${Vo(e)}" y="${Vo(t)}" width="${Vo(Math.max(n, 1))}" height="${Vo(Math.max(r, 1))}" fill="${i}"${a}/>`;
function Wo(e) {
	if (e?.theme) return e.theme === "inverse" || e.theme === "deep" ? Ro("text", Io) : e.theme === "accent" ? Ro("accent", Lo) : Ro("surface", Fo);
	for (let t of e?.background?.layers ?? []) {
		if (t.type === "color") return zo(t.props?.value, Po);
		if (t.type === "gradient") return zo(Array.isArray(t.props?.stops) ? t.props.stops[0] : null, Po);
	}
	return Ro("bg", Po);
}
function Go(e, t, n, r, i) {
	let a = /<h[1-3]/.test(String(i?.html ?? "")), o = i?.align === "center", s = Ro("text", Io), c = [];
	i?.box && c.push(Uo(e, t, n, r, Ro("surface", Fo), " rx=\"1.5\""));
	let l = i?.box ? Math.min(2, n * .06) : 0, u = e + l, d = n - l * 2, f = [
		.72,
		.9,
		.5
	], p = [
		a ? 4 : 2.2,
		2.2,
		2.2
	], m = Ho(r / (p[0] + p[1] + p[2] + 4.8 + 2), 0, 1), h = t + l + Math.min(1, r * .08);
	for (let e = 0; e < 3; e++) {
		let n = Math.min(Math.max(e === 0 ? a ? 1.4 : 1 : .8, p[e] * m), Math.max(r, 1));
		if (e > 0 && h + n > t + r - l) break;
		let i = d * f[e], g = o ? u + (d - i) / 2 : u;
		c.push(Uo(g, h, i, n, s, ` opacity="${e === 0 ? .8 : .4}" rx="${Vo(Math.min(1, n / 2))}"`)), h += n + Math.max(.8, 2.4 * m);
	}
	return c.join("");
}
function Ko(e, t, n, r, i = !1) {
	let a = Ro("text", Io), o = [];
	i ? (o.push(Uo(e, t, n, r, Ro("surface", Fo), " rx=\"1.5\" opacity=\"0.35\"")), o.push(`<rect x="${Vo(e + .4)}" y="${Vo(t + .4)}" width="${Vo(Math.max(n - .8, 1))}" height="${Vo(Math.max(r - .8, 1))}" fill="none" stroke="${a}" stroke-width="0.6" stroke-dasharray="2 2" opacity="0.35" rx="1.5"/>`)) : o.push(Uo(e, t, n, r, Ro("surface", Fo), " rx=\"1.5\""));
	let s = i ? .15 : .4, c = (t) => Vo(e + n * t), l = (e) => Vo(t + r * e);
	return o.push(`<polygon points="${c(.08)},${l(.9)} ${c(.42)},${l(.38)} ${c(.62)},${l(.68)} ${c(.75)},${l(.5)} ${c(.92)},${l(.9)}" fill="${a}" opacity="${s}"/>`), o.push(`<circle cx="${c(.28)}" cy="${l(.26)}" r="${Vo(Math.max(1, Math.min(n, r) * .1))}" fill="${a}" opacity="${Vo(s + .1)}"/>`), o.join("");
}
function qo(e, t, n, r, i) {
	let a = !(Array.isArray(i?.images) && i.images.length), o = Math.max(1, n * .03), s = (n - o * 2) / 3, c = [];
	for (let n = 0; n < 3; n++) c.push(Ko(e + n * (s + o), t, s, r, a));
	return c.join("");
}
function Jo(e, t, n, r) {
	let i = Math.max(1, n * .03), a = (n - i * 2) / 3, o = [];
	for (let n = 0; n < 3; n++) {
		let s = e + n * (a + i);
		o.push(Uo(s, t, a, r * .55, Ro("surface", Fo), " rx=\"1.5\"")), o.push(Uo(s, t + r * .62, a * .8, 2, Ro("text", Io), " opacity=\"0.5\" rx=\"1\""));
	}
	return o.join("");
}
function Yo(e, t, n, r, i) {
	let a = zo(i?.color, Lo), o = i?.kind;
	return o === "circle" ? `<ellipse cx="${Vo(e + n / 2)}" cy="${Vo(t + r / 2)}" rx="${Vo(Math.max(n / 2, 1))}" ry="${Vo(Math.max(r / 2, 1))}" fill="${a}" opacity="0.8"/>` : o === "triangle" ? `<polygon points="${Vo(e)},${Vo(t + r)} ${Vo(e + n / 2)},${Vo(t)} ${Vo(e + n)},${Vo(t + r)}" fill="${a}" opacity="0.8"/>` : o === "line" || o === "arrow" ? Uo(e, t + r / 2 - .75, n, 1.5, a, " opacity=\"0.85\" rx=\"0.75\"") : Uo(e, t, n, r, a, " opacity=\"0.8\" rx=\"1\"");
}
function Xo(e, t, n, r, i, a) {
	if (e === "text") return Go(t, n, r, i, a);
	if (e === "image") return Ko(t, n, r, i, !a?.src);
	if (e === "gallery") return qo(t, n, r, i, a);
	if (e === "collection") return Jo(t, n, r, i);
	if (e === "faq") {
		let e = Ho(Math.floor(i / 5), 2, 3), a = Math.max(.6, i * .04), o = (i - a * (e - 1)) / e, s = [];
		for (let i = 0; i < e; i += 1) {
			let e = n + i * (o + a);
			s.push(Uo(t, e, r, o, Ro("surface", Fo), " rx=\"1\"")), s.push(Uo(t + r * .06, e + o / 2 - .7, r * .55, 1.4, Ro("text", Io), " opacity=\"0.5\" rx=\"0.7\"")), s.push(`<circle cx="${Vo(t + r * .92)}" cy="${Vo(e + o / 2)}" r="0.9" fill="${Ro("text", Io)}" opacity="0.4"/>`);
		}
		return s.join("");
	}
	if (e === "shape") return Yo(t, n, r, i, a);
	if (e === "button") return Uo(t, n, r, i, Ro("accent", Lo), ` rx="${Vo(Math.min(i / 2, 4))}"`);
	if (e === "icon") {
		let e = Math.max(1.2, Math.min(r, i) / 2);
		return `<circle cx="${Vo(t + r / 2)}" cy="${Vo(n + i / 2)}" r="${Vo(e)}" fill="${Ro("accent", Lo)}" opacity="0.85"/>`;
	}
	if (e === "video") {
		let e = [Uo(t, n, r, i, Ro("surface", Fo), " rx=\"1.5\"")], a = t + r / 2, o = n + i / 2, s = Math.max(1.5, Math.min(r, i) * .22);
		return e.push(`<polygon points="${Vo(a - s / 2)},${Vo(o - s)} ${Vo(a - s / 2)},${Vo(o + s)} ${Vo(a + s)},${Vo(o)}" fill="${Ro("text", Io)}" opacity="0.6"/>`), e.join("");
	}
	if (e === "timeline") {
		let e = [Uo(t + 1, n, 1.4, i, Ro("accent", Lo), " opacity=\"0.7\" rx=\"0.7\"")];
		for (let a = 0; a < 3; a += 1) {
			let o = n + i * (.18 + a * .32);
			e.push(`<circle cx="${Vo(t + 1.7)}" cy="${Vo(o)}" r="1.6" fill="${Ro("accent", Lo)}"/>`), e.push(Uo(t + 5, o - 1, r * .5, 2, Ro("text", Io), " opacity=\"0.5\" rx=\"1\""));
		}
		return e.join("");
	}
	if (e === "quote") return [
		`<text x="${Vo(t + r / 2)}" y="${Vo(n + i * .34)}" text-anchor="middle" font-size="${Vo(Math.min(r, i) * .5)}" font-family="Georgia, serif" fill="${Ro("accent", Lo)}">“</text>`,
		Uo(t + r * .15, n + i * .48, r * .7, 2, Ro("text", Io), " opacity=\"0.6\" rx=\"1\""),
		Uo(t + r * .25, n + i * .62, r * .5, 2, Ro("text", Io), " opacity=\"0.6\" rx=\"1\""),
		Uo(t + r * .35, n + i * .82, r * .3, 1.6, Ro("text", Io), " opacity=\"0.35\" rx=\"0.8\"")
	].join("");
	if (e === "ribbon") return [
		Uo(t, n + i * .3, r, i * .4, Ro("accent", Lo), " opacity=\"0.85\" rx=\"1\""),
		Uo(t + r * .08, n + i * .46, r * .18, 1.8, Ro("bg", Po), " opacity=\"0.9\" rx=\"0.9\""),
		Uo(t + r * .34, n + i * .46, r * .24, 1.8, Ro("bg", Po), " opacity=\"0.9\" rx=\"0.9\""),
		Uo(t + r * .66, n + i * .46, r * .2, 1.8, Ro("bg", Po), " opacity=\"0.9\" rx=\"0.9\"")
	].join("");
	if (e === "stats") return [Uo(t + r * .28, n + i * .15, r * .44, i * .42, Ro("accent", Lo), " opacity=\"0.85\" rx=\"1\""), Uo(t + r * .32, n + i * .72, r * .36, 1.6, Ro("text", Io), " opacity=\"0.4\" rx=\"0.8\"")].join("");
	if (e === "table") {
		let e = Math.max(1.6, i * .22), a = [Uo(t, n, r, e, Ro("accent", Lo), " opacity=\"0.5\" rx=\"0.8\"")], o = Ho(Math.floor((i - e) / 3.2), 1, 3);
		for (let s = 0; s < o; s += 1) a.push(Uo(t, n + e + 1 + s * ((i - e - 1) / o), r, 1, Ro("text", Io), " opacity=\"0.3\""));
		return a.push(Uo(t + r * .33, n, .6, i, Ro("text", Io), " opacity=\"0.2\"")), a.push(Uo(t + r * .66, n, .6, i, Ro("text", Io), " opacity=\"0.2\"")), a.join("");
	}
	if (e === "share") {
		let e = Math.max(1.2, Math.min(i / 2, r / 9)), a = [];
		for (let r = 0; r < 4; r += 1) a.push(`<circle cx="${Vo(t + e + r * (e * 2 + 1.5))}" cy="${Vo(n + i / 2)}" r="${Vo(e)}" fill="${Ro("accent", Lo)}" opacity="0.8"/>`);
		return a.join("");
	}
	if (e === "countdown") {
		let e = Math.max(.8, r * .03), a = (r - e * 3) / 4, o = [];
		for (let r = 0; r < 4; r += 1) {
			let s = t + r * (a + e);
			o.push(Uo(s, n, a, i, Ro("surface", Fo), " rx=\"1\"")), o.push(Uo(s + a * .25, n + i * .2, a * .5, i * .35, Ro("accent", Lo), " opacity=\"0.85\" rx=\"0.8\""));
		}
		return o.join("");
	}
	if (e === "audio") {
		let e = [Uo(t, n, r, i, Ro("surface", Fo), " rx=\"1.5\"")], a = n + i / 2, o = Math.max(1.2, i * .28);
		return e.push(`<polygon points="${Vo(t + r * .06)},${Vo(a - o)} ${Vo(t + r * .06)},${Vo(a + o)} ${Vo(t + r * .06 + o * 1.4)},${Vo(a)}" fill="${Ro("accent", Lo)}" opacity="0.85"/>`), e.push(Uo(t + r * .2, a - .6, r * .7, 1.2, Ro("text", Io), " opacity=\"0.35\" rx=\"0.6\"")), e.join("");
	}
	if (e === "product") {
		let e = Math.max(.8, r * .03), a = (r - e * 2) / 3, o = [];
		for (let r = 0; r < 3; r += 1) {
			let s = t + r * (a + e);
			o.push(Uo(s, n, a, i, Ro("surface", Fo), " rx=\"1\"")), o.push(Uo(s + a * .08, n + i * .06, a * .84, i * .42, Ro("text", Io), " opacity=\"0.15\" rx=\"0.8\"")), o.push(Uo(s + a * .08, n + i * .56, a * .6, 1.4, Ro("text", Io), " opacity=\"0.5\" rx=\"0.7\"")), o.push(Uo(s + a * .08, n + i * .72, a * .35, 1.4, Ro("accent", Lo), " opacity=\"0.85\" rx=\"0.7\"")), o.push(Uo(s + a * .08, n + i * .84, a * .84, i * .1, Ro("accent", Lo), " opacity=\"0.6\" rx=\"1\""));
		}
		return o.join("");
	}
	if (e === "cart") {
		let e = Math.max(1.5, Math.min(r, i) / 2.4), a = t + r / 2, o = n + i / 2;
		return [
			`<circle cx="${Vo(a)}" cy="${Vo(o)}" r="${Vo(e)}" fill="${Ro("surface", Fo)}"/>`,
			Uo(a - e * .5, o - e * .25, e, e * .55, Ro("text", Io), " opacity=\"0.5\" rx=\"0.4\""),
			`<circle cx="${Vo(a + e * .75)}" cy="${Vo(o - e * .75)}" r="${Vo(Math.max(.9, e * .35))}" fill="${Ro("accent", Lo)}"/>`
		].join("");
	}
	return e === "checkout" ? [
		Uo(t, n, r * .7, 1.2, Ro("text", Io), " opacity=\"0.5\" rx=\"0.6\""),
		Uo(t, n + i * .12, r * .5, 1.2, Ro("text", Io), " opacity=\"0.35\" rx=\"0.6\""),
		Uo(t, n + i * .3, r, i * .14, Ro("surface", Fo), " rx=\"1\""),
		Uo(t, n + i * .5, r, i * .14, Ro("surface", Fo), " rx=\"1\""),
		Uo(t, n + i * .78, r * .45, i * .16, Ro("accent", Lo), " opacity=\"0.85\" rx=\"1.2\"")
	].join("") : Uo(t, n, r, i, Ro("surface", Fo), " rx=\"1.5\"");
}
function Zo(e, t, n) {
	let r = Array.isArray(e?.blocks) ? e.blocks : [], i = r.map((e) => (e.frames?.desktop?.y ?? 0) + (e.frames?.desktop?.h ?? 0)), a = n / Math.max(Bo(e?.size?.minHeight), i.length ? Math.max(...i) + 16 : 0), o = [Uo(0, 0, t, n, Wo(e))];
	for (let r of e?.background?.layers ?? []) {
		if (r.type !== "glow") continue;
		let e = r.props ?? {};
		o.push(`<circle cx="${Vo(Ho(e.x ?? .5, 0, 1) * t)}" cy="${Vo(Ho(e.y ?? .3, 0, 1) * n)}" r="${Vo(t * Ho(e.radius ?? .5, .1, 1) * .5)}" fill="${zo(e.color, Lo)}" opacity="${Vo(Ho(e.opacity ?? .3, 0, .5))}"/>`);
	}
	for (let r of e?.background?.layers ?? []) {
		if (r.type !== "slideshow") continue;
		let e = r.props ?? {}, i = e.style ?? "floating", a = Ro("surface", Fo);
		if (i === "floating") {
			let r = e.look === "polaroid", s = t * (r ? .17 : .13), c = s / (r ? .84 : 1.35);
			for (let r of Oo(e.images, {
				...e,
				seed: e.seed || 1,
				style: i
			})) {
				let e = r.x / 100 * t - s / 2, i = r.y / 100 * n - c / 2, l = ` rx="1" opacity="0.75" transform="rotate(${Vo(r.rot)} ${Vo(e + s / 2)} ${Vo(i + c / 2)})"`;
				o.push(Uo(e, i, s, c, a, l));
			}
		} else if (i === "band") {
			let r = Number(e.rows) === 1 ? 1 : 2, i = n * (r === 1 ? .4 : .3), s = i * 1.33;
			for (let e = 0; e < r; e += 1) {
				let c = r === 1 ? (n - i) / 2 : n * .1 + e * (i + n * .1);
				for (let n = -s * (e * .5); n < t; n += s + 3) o.push(Uo(n, c, s, i, a, " rx=\"1\" opacity=\"0.75\""));
			}
		} else if (i === "mosaic") {
			let r = (t - 10) / 4, i = n / 3.4, s = 0, c = 0;
			for (let t of jo(e.count, e.seed || 1)) {
				s + t.cols > 4 && (s = 0, c += 1);
				let e = 2 + c * (i + 2);
				if (e > n) break;
				o.push(Uo(2 + s * (r + 2), e, r * t.cols + 2 * (t.cols - 1), i * t.rows + 2 * (t.rows - 1), a, " rx=\"1\" opacity=\"0.75\"")), s += t.cols, s >= 4 && (s = 0, c += 1);
			}
		}
	}
	let s = t * .06, c = t - s * 2;
	for (let e of r) {
		let r = e.frames?.desktop;
		if (!r) continue;
		let i = Ho(s + (r.x ?? 0) * (c / 100), 0, t - 2), l = Ho((r.y ?? 0) * a, 0, n - 2), u = Ho((r.w ?? 10) * (c / 100), 2, t - i), d = Ho((r.h ?? 20) * a, 2, n - l);
		o.push(Xo(e.type, i, l, u, d, e.props));
	}
	return o.join("");
}
function Qo(e, { w: t = 96, h: n = 116, max: r = 6 } = {}) {
	let i = (Array.isArray(e?.sections) ? e.sections : []).slice(0, r);
	if (!i.length) return `<svg viewBox="0 0 ${t} ${n}" width="${t}" height="${n}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${Uo(0, 0, t, n, Ro("bg", Po))}</svg>`;
	let a = i.map((e) => Ho(Bo(e?.size?.minHeight), 160, 900)), o = a.reduce((e, t) => e + t, 0), s = n - 1 * (i.length - 1), c = [], l = 0;
	for (let e = 0; e < i.length; e += 1) {
		let n = Math.max(6, a[e] / o * s);
		c.push(`<g transform="translate(0 ${Vo(l)})">${Zo(i[e], t, n)}</g>`), l += n + 1;
	}
	return `<svg viewBox="0 0 ${t} ${n}" width="${t}" height="${n}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${c.join("")}</svg>`;
}
//#endregion
//#region ../template/assets/engine/0.7.6/blocks/form.js
var $o = () => [
	{
		id: "navn",
		label: K("form.fieldName"),
		type: "text",
		required: !0
	},
	{
		id: "epost",
		label: K("form.fieldEmail"),
		type: "email",
		required: !0
	},
	{
		id: "melding",
		label: K("form.fieldMessage"),
		type: "textarea",
		required: !0
	}
];
//#endregion
//#region ../template/assets/engine/0.7.6/sections/presets.js
function es(e) {
	return typeof crypto < "u" && crypto.randomUUID ? `${e}-${crypto.randomUUID().slice(0, 8)}` : `${e}-${[...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(4))].map((e) => e.toString(16).padStart(2, "0")).join("")}`;
}
var ts = () => ({ mobile: {
	mode: "auto",
	attention: null
} }), Y = (e, t, n, r, i = 1) => ({
	desktop: {
		x: e,
		y: t,
		w: n,
		h: r,
		z: i,
		rot: 0
	},
	mobile: null
}), ns = (e, t, n = {}) => ({
	id: es("blk"),
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
}), rs = (e, t = {}) => ({
	id: es("blk"),
	type: "image",
	version: 1,
	props: {
		src: "",
		alt: K("seed.imageAlt"),
		fit: "cover",
		radius: "md",
		href: null,
		...t
	},
	animation: null,
	frames: e
}), is = (e, t, n = {}) => ({
	id: es("blk"),
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
}), as = (e, t, n = 40) => ({
	id: es("blk"),
	type: "icon",
	version: 1,
	props: {
		glyph: t,
		color: "accent",
		size: n
	},
	animation: null,
	frames: e
}), os = (e, t = {}) => ({
	id: es("blk"),
	type: "map",
	version: 2,
	props: {
		location: "",
		zoom: 15,
		...t
	},
	animation: null,
	frames: e
}), ss = (e, t = {}) => ({
	id: es("blk"),
	type: "form",
	version: 1,
	props: {
		recipient: "",
		subject: "",
		mode: "mailto",
		endpoint: "",
		submitLabel: K("form.sendDefault"),
		successText: K("form.thanksDefault"),
		fields: $o(),
		...t
	},
	animation: null,
	frames: e
}), cs = (e, t = {}) => ({
	id: es("blk"),
	type: "calendar",
	version: 1,
	props: {
		sources: [],
		view: "list",
		limit: 6,
		showCategories: !1,
		showSubscribe: !1,
		showSignup: !1,
		...t
	},
	animation: null,
	frames: e
}), ls = () => ({
	type: "hover-lift",
	version: 1,
	props: {}
}), us = (e, t, n = {}) => ({
	id: es("blk"),
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
}), ds = (e, t = {}) => ({
	id: es("blk"),
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
}), fs = (e, t = {}) => ({
	id: es("blk"),
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
}), ps = (e, t = {}) => ({
	id: es("blk"),
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
}), ms = (e, t = {}) => ({
	id: es("blk"),
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
}), hs = (e, t) => ({
	id: es("blk"),
	type: "faq",
	version: 1,
	props: {
		items: t,
		multi: !1
	},
	animation: null,
	frames: e
}), gs = (e, t = {}) => ({
	id: es("blk"),
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
}), _s = (e, t) => ({
	id: es("blk"),
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
}), vs = (e, t = {}) => ({
	id: es("blk"),
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
}), ys = (...e) => ({
	version: 1,
	layers: e
}), bs = (e) => ({
	type: "color",
	version: 1,
	props: { value: e }
}), xs = (e, t, n, r = .5) => ({
	type: "glow",
	version: 1,
	props: {
		x: e,
		y: t,
		color: "accent",
		radius: r,
		opacity: n
	}
}), Ss = (e) => Math.max(0, ...e.blocks.map((e) => e.frames.desktop.y + e.frames.desktop.h)), Cs = (e, t, n, r, i, a) => ({
	x: n + e % t * r,
	y: i + Math.floor(e / t) * a
}), ws = (e, t, n, r, i, a, o, s, c = 0) => {
	let l = (t) => e.blocks.some((e) => {
		let n = e.frames.desktop;
		return n.x < t.x + t.w - .01 && t.x < n.x + n.w - .01 && n.y < t.y + t.h - .01 && t.y < n.y + n.h - .01;
	});
	for (let e = 0; e < 60; e++) {
		let u = Cs(e, t, n, r, i, a);
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
		y: Ss(e) + 16,
		n: 0
	};
}, Ts = (e, t, n) => e + t * .1 + n * .01, Es = (e, t, n, r, i = null) => ({
	id: es("sec"),
	version: 1,
	preset: e,
	size: { minHeight: t },
	grid: i,
	background: n,
	blocks: r,
	responsive: ts()
});
function Ds(e) {
	e.sections.define("blank", {
		label: "Empty section",
		labelKey: "preset.blank.label",
		group: "Basics",
		groupKey: "presetGroup.basic",
		hint: "A blank canvas to build on freely",
		hintKey: "preset.blank.hint",
		create: () => Es("blank", "40vh", ys(bs("bg")), [])
	}), e.sections.define("hero", {
		label: "Hero",
		labelKey: "preset.hero.label",
		group: "Basics",
		groupKey: "presetGroup.basic",
		hint: "Large opening with gradient and glow, left-aligned",
		hintKey: "preset.hero.hint",
		create: () => Es("hero", "70vh", {
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
				xs(.7, .2, .35),
				{
					type: "grain",
					version: 1,
					props: { opacity: .06 }
				}
			]
		}, [
			ns(Y(8.33, 40, 50, 38), K("seed.hero.title")),
			ns(Y(8.33, 84, 41.67, 26), K("seed.hero.intro")),
			is(Y(8.33, 118, 20, 32), K("seed.readMore"))
		])
	}), e.sections.define("hero-centered", {
		label: "Hero, centred",
		labelKey: "preset.hero-centered.label",
		group: "Basics",
		groupKey: "presetGroup.basic",
		hint: "Centred opening with two buttons",
		hintKey: "preset.hero-centered.hint",
		create: () => Es("hero-centered", "60vh", ys(bs("bg")), [
			ns(Y(15, 64, 70, 44), K("seed.heroCenter.title"), { align: "center" }),
			ns(Y(25, 116, 50, 26), K("seed.heroCenter.intro"), { align: "center" }),
			is(Y(31.5, 160, 17, 40), K("seed.join")),
			is(Y(51.5, 160, 17, 40), K("seed.readMore"), { style: "secondary" })
		])
	}), e.sections.define("hero-image", {
		label: "Hero over a photo",
		labelKey: "preset.hero-image.label",
		group: "Basics",
		groupKey: "presetGroup.basic",
		hint: "Opening over a photo that creeps slowly, with a veil under the text",
		hintKey: "preset.hero-image.hint",
		create: () => {
			let e = Es("hero-image", "70vh", {
				version: 1,
				layers: [
					bs("bg"),
					{
						type: "image",
						version: 3,
						props: {
							src: "",
							fit: "cover",
							x: .5,
							y: .5,
							size: 1,
							opacity: 1,
							blur: 0,
							parallax: 0,
							bleed: "none",
							motion: "kenburns",
							motionSpeed: 24
						}
					},
					{
						type: "gradient",
						version: 1,
						props: {
							kind: "linear",
							angle: 180,
							stops: [{
								color: "#00000000",
								share: 45
							}, {
								color: "#000000b3",
								share: 55
							}]
						}
					}
				]
			}, [
				ns(Y(8.33, 40, 50, 38), K("seed.hero.title")),
				ns(Y(8.33, 84, 41.67, 26), K("seed.hero.intro")),
				is(Y(8.33, 118, 20, 32), K("seed.readMore"))
			]);
			return e.theme = "inverse", e;
		}
	}), e.sections.define("hero-photos", {
		label: "Hero with floating photos",
		labelKey: "preset.hero-photos.label",
		group: "Basics",
		groupKey: "presetGroup.basic",
		hint: "Centred opening with scattered photos drifting behind the text",
		hintKey: "preset.hero-photos.hint",
		create: () => {
			let e = Es("hero-photos", "70vh", {
				version: 1,
				layers: [
					bs("bg"),
					{
						type: "slideshow",
						version: 2,
						props: {
							images: [],
							source: "upload",
							folder: "",
							order: "random",
							folderMax: 24,
							style: "floating",
							motion: "drift",
							motionSpeed: 30,
							interval: 12,
							fade: 1.5,
							count: 8,
							seed: 0,
							size: null,
							spread: .85,
							tilt: 5,
							radius: 5,
							rows: 2,
							direction: "left",
							underNav: !0,
							underAnnounce: !1,
							fit: "cover",
							blur: 0,
							opacity: .85
						}
					},
					{
						type: "grain",
						version: 1,
						props: { opacity: .06 }
					}
				]
			}, [
				ns(Y(15, 64, 70, 44), K("seed.heroCenter.title"), { align: "center" }),
				ns(Y(25, 116, 50, 26), K("seed.heroCenter.intro"), { align: "center" }),
				is(Y(41.5, 160, 17, 40), K("seed.readMore"))
			]);
			return e.theme = "inverse", e;
		}
	}), e.sections.define("images", {
		label: "Images",
		labelKey: "preset.images.label",
		group: "Basics",
		groupKey: "presetGroup.basic",
		hint: "Title and three image frames",
		hintKey: "preset.images.hint",
		create: () => Es("images", "360px", ys(bs("bg")), [
			ns(Y(4, 24, 50, 32), K("seed.images.title")),
			rs(Y(4, 72, 28, 220)),
			rs(Y(36, 72, 28, 220)),
			rs(Y(68, 72, 28, 220))
		]),
		itemLabel: "image",
		itemLabelKey: "item.image",
		item: (e) => {
			let { x: t, y: n } = ws(e, 3, 4, 32, 72, 244, 28, 220);
			return {
				blocks: [rs(Y(t, n, 28, 220))],
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
		create: () => Es("gallery", "440px", ys(bs("bg")), [ns(Y(4, 24, 50, 32), K("seed.gallery.title")), ms(Y(4, 72, 92, 320))])
	}), e.sections.define("find-us", {
		label: "Find us",
		labelKey: "preset.find-us.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "Map with your address (privacy-friendly OpenStreetMap)",
		hintKey: "preset.find-us.hint",
		create: () => Es("find-us", "480px", ys(bs("bg")), [ns(Y(6, 40, 60, 70), K("seed.findUs.title")), os(Y(6, 120, 88, 360, 2))])
	}), e.sections.define("whats-on", {
		label: "What is on",
		labelKey: "preset.whats-on.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "Event list from a subscribable calendar (iCal/Google)",
		hintKey: "preset.whats-on.hint",
		create: () => Es("whats-on", "520px", ys(bs("bg")), [ns(Y(6, 40, 60, 70), K("seed.whatsOn.title")), cs(Y(6, 130, 88, 320, 2), { limit: 5 })])
	});
	let t = (t, n, r) => e.sections.define(t, {
		label: `What is on: ${t.slice(9)}`,
		labelKey: `preset.${t}.label`,
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "Events from a subscribable calendar (iCal/Google)",
		hintKey: `preset.${t}.hint`,
		create: () => Es(t, n, ys(bs("bg")), [ns(Y(6, 40, 60, 70), K("seed.whatsOn.title")), r()])
	});
	t("whats-on-cards", "560px", () => cs(Y(6, 130, 88, 360, 2), {
		view: "cards",
		limit: 6
	})), t("whats-on-month", "720px", () => cs(Y(6, 130, 88, 520, 2), { view: "month" })), t("whats-on-week", "560px", () => cs(Y(6, 130, 88, 360, 2), {
		view: "week",
		design: "weekStrip"
	})), t("whats-on-next", "460px", () => cs(Y(6, 130, 48, 260, 2), {
		view: "next",
		nextCount: 3,
		laterCount: 3
	})), e.sections.define("contact-form", {
		label: "Contact form",
		labelKey: "preset.contact-form.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "Contact form that sends via email (or your own endpoint)",
		hintKey: "preset.contact-form.hint",
		create: () => Es("contact-form", "520px", ys(bs("bg")), [ns(Y(6, 40, 60, 120), K("seed.contactForm.intro")), ss(Y(6, 180, 60, 380, 2))])
	}), e.sections.define("contact", {
		label: "Contact",
		labelKey: "preset.contact.label",
		group: "Basics",
		groupKey: "presetGroup.basic",
		hint: "Contact details in a card with an email button",
		hintKey: "preset.contact.hint",
		create: () => Es("contact", "320px", ys(bs("surface"), xs(.2, .8, .2)), [
			ns(Y(10, 32, 40, 36), K("seed.contact.title")),
			ns(Y(10, 84, 36, 130), K("seed.contact.info"), { box: !0 }),
			is(Y(60, 100, 22, 40), K("seed.contact.button"), { href: `mailto:${K("seed.email")}` })
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
				let i = as(Y(e + 10.5, 88, 4, 52), n), a = ns(Y(e, 152, 25, 200), K("seed.features.card", { title: r }), {
					align: "center",
					box: !0
				});
				return a.animation = ls(), i.mobileOrder = Ts(88, t, 0), a.mobileOrder = Ts(88, t, 1), [i, a];
			};
			return Es("feature-cards", "420px", ys(bs("bg")), [
				ns(Y(6, 28, 60, 38), K("seed.features.title")),
				...e(6, 0, "✦", K("seed.features.card1")),
				...e(37.5, 1, "★", K("seed.features.card2")),
				...e(69, 2, "✓", K("seed.features.card3"))
			]);
		},
		itemLabel: "card",
		itemLabelKey: "item.card",
		item: (e) => {
			let { x: t, y: n, n: r } = ws(e, 3, 6, 31.5, 152, 296, 25, 264, -64), i = as(Y(t + 10.5, n - 64, 4, 52), "✦"), a = ns(Y(t, n, 25, 200), K("seed.features.card", { title: K("seed.features.newTitle") }), {
				align: "center",
				box: !0
			});
			return a.animation = ls(), i.mobileOrder = Ts(88, r, 0), a.mobileOrder = Ts(88, r, 1), {
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
				let r = ns(Y(e, 88, 25, 200), K("seed.features.card", { title: n }), {
					align: "center",
					box: !0
				});
				return r.animation = ls(), r.mobileOrder = Ts(88, t, 0), r;
			};
			return Es("feature-cards-simple", "360px", ys(bs("bg")), [
				ns(Y(6, 28, 60, 38), K("seed.features.title")),
				e(6, 0, K("seed.features.card1")),
				e(37.5, 1, K("seed.features.card2")),
				e(69, 2, K("seed.features.card3"))
			]);
		},
		itemLabel: "card",
		itemLabelKey: "item.card",
		item: (e) => {
			let { x: t, y: n, n: r } = ws(e, 3, 6, 31.5, 88, 232, 25, 200), i = ns(Y(t, n, 25, 200), K("seed.features.card", { title: K("seed.features.newTitle") }), {
				align: "center",
				box: !0
			});
			return i.animation = ls(), i.mobileOrder = Ts(88, r, 0), {
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
				let n = rs(Y(e, 88, 25, 160)), r = ns(Y(e, 256, 25, 160), K("seed.news.card"));
				return n.mobileOrder = Ts(88, t, 0), r.mobileOrder = Ts(88, t, 1), [n, r];
			};
			return Es("news", "460px", ys(bs("bg")), [
				ns(Y(6, 28, 50, 38), K("seed.news.title")),
				is(Y(78, 30, 16, 36), K("seed.news.seeAll"), { style: "secondary" }),
				...e(6, 0),
				...e(37.5, 1),
				...e(69, 2)
			]);
		},
		itemLabel: "story",
		itemLabelKey: "item.story",
		item: (e) => {
			let { x: t, y: n, n: r } = ws(e, 3, 6, 31.5, 88, 344, 25, 328), i = rs(Y(t, n, 25, 160)), a = ns(Y(t, n + 168, 25, 160), K("seed.news.card"));
			return i.mobileOrder = Ts(88, r, 0), a.mobileOrder = Ts(88, r, 1), {
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
		create: () => Es("news-collection", "300px", ys(bs("bg")), [ns(Y(6, 28, 50, 38), K("seed.news.title")), us(Y(6, 88, 88, 180), "cards")])
	}), e.sections.define("noticeboard", {
		label: "Noticeboard",
		labelKey: "preset.noticeboard.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "Dated list from a collection (notices/announcements)",
		hintKey: "preset.noticeboard.hint",
		create: () => Es("noticeboard", "300px", ys(bs("surface")), [ns(Y(6, 28, 50, 38), K("seed.noticeboard.title")), us(Y(6, 88, 88, 180), "list", { limit: 8 })])
	}), e.sections.define("publication-archive", {
		label: "Publication archive",
		labelKey: "preset.publication-archive.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "Year-grouped archive from a collection (issues, minutes, reports)",
		hintKey: "preset.publication-archive.hint",
		create: () => Es("publication-archive", "300px", ys(bs("bg")), [ns(Y(6, 28, 60, 38), K("seed.archive.title")), us(Y(6, 88, 88, 180), "archive", { limit: 0 })])
	}), e.sections.define("events", {
		label: "Events",
		labelKey: "preset.events.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "Three rows with date badge and sign-up button",
		hintKey: "preset.events.hint",
		create: () => {
			let e = (e, t, n, r) => [
				ns(Y(6, e, 8, 88), K("seed.events.dateBadge", {
					day: t,
					month: n
				}), {
					align: "center",
					box: !0
				}),
				ns(Y(16, e, 58, 88), K("seed.events.row", { title: r })),
				is(Y(78, e + 24, 16, 40), K("seed.events.signup"), { style: "secondary" })
			];
			return Es("events", "440px", ys(bs("surface")), [
				ns(Y(6, 28, 50, 38), K("seed.events.title")),
				...e(88, "11", K("seed.events.monthAug"), K("seed.events.row1")),
				...e(196, "25", K("seed.events.monthAug"), K("seed.events.row2")),
				...e(304, "8", K("seed.events.monthSep"), K("seed.events.row3"))
			]);
		},
		itemLabel: "row",
		itemLabelKey: "item.row",
		item: (e) => {
			let t = Ss(e) + 16;
			return {
				blocks: [
					ns(Y(6, t, 8, 88), K("seed.events.newBadge"), {
						align: "center",
						box: !0
					}),
					ns(Y(16, t, 58, 88), K("seed.events.row", { title: K("seed.events.newTitle") })),
					is(Y(78, t + 24, 16, 40), K("seed.events.signup"), { style: "secondary" })
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
				let r = rs(Y(e, 80, 22, 180), { alt: K("seed.team.alt") }), i = ns(Y(e, 268, 22, 84), K("seed.team.member", { role: n }), { align: "center" });
				return r.mobileOrder = Ts(80, t, 0), i.mobileOrder = Ts(80, t, 1), [r, i];
			};
			return Es("team", "420px", ys(bs("surface")), [
				ns(Y(6, 24, 50, 32), K("seed.team.title")),
				...e(7.5, 0, K("seed.team.role1")),
				...e(39, 1, K("seed.team.role2")),
				...e(70.5, 2, K("seed.team.role3"))
			]);
		},
		itemLabel: "person",
		itemLabelKey: "item.person",
		item: (e) => {
			let { x: t, y: n, n: r } = ws(e, 3, 7.5, 31.5, 80, 288, 22, 272), i = rs(Y(t, n, 22, 180), { alt: K("seed.team.alt") }), a = ns(Y(t, n + 188, 22, 84), K("seed.team.member", { role: K("seed.team.roleNew") }), { align: "center" });
			return i.mobileOrder = Ts(80, r, 0), a.mobileOrder = Ts(80, r, 1), {
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
		create: () => Es("faq", "520px", ys(bs("bg")), [
			ns(Y(25, 24, 50, 36), K("seed.faq.title"), { align: "center" }),
			hs(Y(20, 80, 60, 320), [
				{
					q: K("seed.faq.q1"),
					a: K("seed.faq.answer")
				},
				{
					q: K("seed.faq.q2"),
					a: K("seed.faq.answer")
				},
				{
					q: K("seed.faq.q3"),
					a: K("seed.faq.answer")
				}
			]),
			ns(Y(20, 416, 60, 32), K("seed.faq.more"), { align: "center" })
		])
	}), e.sections.define("timeline", {
		label: "Timeline",
		labelKey: "preset.timeline.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "Your story as events along a line",
		hintKey: "preset.timeline.hint",
		create: () => Es("timeline", "480px", ys(bs("bg")), [ns(Y(25, 24, 50, 36), K("seed.timeline.title"), { align: "center" }), _s(Y(25, 88, 50, 330), [
			{
				year: "2019",
				title: K("seed.timeline.t1"),
				text: K("seed.timeline.text")
			},
			{
				year: "2022",
				title: K("seed.timeline.t2"),
				text: K("seed.timeline.text")
			},
			{
				year: "2026",
				title: K("seed.timeline.t3"),
				text: K("seed.timeline.text")
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
				let r = ns(Y(e, 88, 25, 72), `<h3>${t + 1}</h3>`, {
					align: "center",
					size: 44
				}), i = ns(Y(e, 168, 25, 160), K("seed.steps.card", { title: n }), {
					align: "center",
					box: !0
				});
				return r.mobileOrder = Ts(88, t, 0), i.mobileOrder = Ts(88, t, 1), [r, i];
			};
			return Es("steps", "400px", ys(bs("bg")), [
				ns(Y(6, 28, 60, 38), K("seed.steps.title")),
				...e(6, 0, K("seed.steps.s1")),
				...e(37.5, 1, K("seed.steps.s2")),
				...e(69, 2, K("seed.steps.s3"))
			]);
		},
		itemLabel: "step",
		itemLabelKey: "item.step",
		item: (e) => {
			let { x: t, y: n, n: r } = ws(e, 3, 6, 31.5, 88, 272, 25, 240), i = ns(Y(t, n, 25, 72), `<h3>${r + 1}</h3>`, {
				align: "center",
				size: 44
			}), a = ns(Y(t, n + 80, 25, 160), K("seed.steps.card", { title: K("seed.steps.newTitle") }), {
				align: "center",
				box: !0
			});
			return i.mobileOrder = Ts(88, r, 0), a.mobileOrder = Ts(88, r, 1), {
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
				rs(Y(6, 40, 55, 300)),
				ns(Y(6, 348, 55, 108), K("seed.feature.main")),
				is(Y(6, 464, 14, 38), K("seed.readMore"), { style: "secondary" }),
				rs(Y(66, 40, 28, 120)),
				ns(Y(66, 164, 28, 60), K("seed.feature.small1")),
				rs(Y(66, 244, 28, 120)),
				ns(Y(66, 368, 28, 60), K("seed.feature.small2"))
			];
			return e.forEach((e, t) => {
				e.mobileOrder = Ts(40, t < 3 ? 0 : 1, t);
			}), Es("lead-story", "540px", ys(bs("bg")), e);
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
					rs(Y(e, 88, 25, 200)),
					ns(Y(e, 296, 25, 76), K("seed.products.card", {
						name: n,
						price: r
					}), { align: "center" }),
					is(Y(e + 5, 380, 15, 40), K("seed.products.buy"))
				];
				return i.forEach((e, n) => {
					e.mobileOrder = Ts(88, t, n);
				}), i;
			};
			return Es("products", "470px", ys(bs("bg")), [
				ns(Y(6, 28, 50, 38), K("seed.products.title")),
				...e(6, 0, K("seed.products.name"), K("seed.products.price1")),
				...e(37.5, 1, K("seed.products.name"), K("seed.products.price2")),
				...e(69, 2, K("seed.products.name"), K("seed.products.price3"))
			]);
		},
		itemLabel: "product",
		itemLabelKey: "item.product",
		item: (e) => {
			let { x: t, y: n, n: r } = ws(e, 3, 6, 31.5, 88, 348, 25, 332), i = [
				rs(Y(t, n, 25, 200)),
				ns(Y(t, n + 208, 25, 76), K("seed.products.card", {
					name: K("seed.products.name"),
					price: K("seed.products.price1")
				}), { align: "center" }),
				is(Y(t + 5, n + 292, 15, 40), K("seed.products.buy"))
			];
			return i.forEach((e, t) => {
				e.mobileOrder = Ts(88, r, t);
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
		create: () => Es("shop", "544px", ys(bs("bg")), [
			ns(Y(6, 28, 50, 38), K("seed.shop.title")),
			fs(Y(78, 88, 16, 48)),
			ds(Y(6, 176, 88, 320))
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
				ns(Y(6, 48, 52, 96), K("seed.shopHero.title")),
				ns(Y(6, 152, 40, 48), K("seed.shopHero.sub")),
				is(Y(6, 216, 17, 42), K("seed.shopHero.cta")),
				rs(Y(62, 40, 32, 300))
			];
			return e.forEach((e, t) => {
				e.mobileOrder = Ts(48, t < 3 ? 0 : 1, t);
			}), Es("shop-hero", "400px", {
				version: 1,
				layers: [
					bs("bg"),
					xs(.8, .25, .28, .6),
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
				let r = rs(Y(e, 88, 21, 170)), i = ns(Y(e, 266, 21, 34), K("seed.shopCategories.tile", { name: n }), { align: "center" });
				return r.mobileOrder = Ts(88, t, 0), i.mobileOrder = Ts(88, t, 1), [r, i];
			}, t = Es("shop-categories", "360px", ys(bs("bg")), [
				ns(Y(6, 28, 60, 38), K("seed.shopCategories.title")),
				...e(6, 0, K("seed.shopCategories.cat1")),
				...e(29.5, 1, K("seed.shopCategories.cat2")),
				...e(53, 2, K("seed.shopCategories.cat3")),
				...e(76.5, 3, K("seed.shopCategories.cat4"))
			]);
			return t.theme = "soft", t;
		},
		itemLabel: "category",
		itemLabelKey: "item.category",
		item: (e) => {
			let { x: t, y: n, n: r } = ws(e, 4, 6, 23.5, 88, 220, 21, 212), i = rs(Y(t, n, 21, 170)), a = ns(Y(t, n + 178, 21, 34), K("seed.shopCategories.tile", { name: K("seed.shopCategories.newCat") }), { align: "center" });
			return i.mobileOrder = Ts(88, r, 0), a.mobileOrder = Ts(88, r, 1), {
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
				let i = as(Y(e + 10.5, 88, 4, 52), r, 44), a = ns(Y(e, 148, 25, 96), K(n), { align: "center" });
				return i.mobileOrder = Ts(88, t, 0), a.mobileOrder = Ts(88, t, 1), [i, a];
			}, t = Es("shop-trust", "300px", ys(bs("bg")), [
				ns(Y(6, 28, 60, 38), K("seed.shopTrust.title")),
				...e(6, 0, "seed.shopTrust.t1", "✓"),
				...e(37.5, 1, "seed.shopTrust.t2", "↻"),
				...e(69, 2, "seed.shopTrust.t3", "✉")
			]);
			return t.theme = "muted", t;
		},
		itemLabel: "card",
		itemLabelKey: "item.card",
		item: (e) => {
			let { x: t, y: n, n: r } = ws(e, 3, 6, 31.5, 148, 216, 25, 156, -60), i = as(Y(t + 10.5, n - 60, 4, 52), "✓", 44), a = ns(Y(t, n, 25, 96), K("seed.shopTrust.newItem"), { align: "center" });
			return i.mobileOrder = Ts(88, r, 0), a.mobileOrder = Ts(88, r, 1), {
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
				ns(Y(6, 56, 52, 100), K("seed.shopShowcase.title")),
				ns(Y(6, 164, 42, 56), K("seed.shopShowcase.text")),
				is(Y(6, 236, 18, 42), K("seed.shopShowcase.cta")),
				rs(Y(62, 48, 32, 240))
			];
			e.forEach((e, t) => {
				e.mobileOrder = Ts(56, t < 3 ? 0 : 1, t);
			});
			let t = Es("shop-showcase", "340px", ys(bs("bg")), e);
			return t.theme = "deep", t;
		}
	}), e.sections.define("checkout", {
		label: "Checkout",
		labelKey: "preset.checkout.label",
		group: "Shop",
		groupKey: "presetGroup.shop",
		hint: "Order form that sends the basket as an email or to an endpoint",
		hintKey: "preset.checkout.hint",
		create: () => Es("checkout", "560px", ys(bs("bg")), [ns(Y(6, 28, 50, 38), K("seed.checkout.title")), ps(Y(25, 96, 50, 430))])
	}), e.sections.define("cta", {
		label: "CTA banner",
		labelKey: "preset.cta.label",
		group: "Highlight",
		groupKey: "presetGroup.highlight",
		hint: "Full width with one clear action",
		hintKey: "preset.cta.hint",
		create: () => Es("cta", "280px", ys(bs("surface"), xs(.5, .5, .3, .7)), [
			ns(Y(20, 56, 60, 40), K("seed.cta.title"), { align: "center" }),
			ns(Y(25, 104, 50, 26), K("seed.cta.sub"), { align: "center" }),
			is(Y(42, 148, 16, 42), K("seed.join"))
		])
	}), e.sections.define("quote", {
		label: "Quote",
		labelKey: "preset.quote.label",
		group: "Highlight",
		groupKey: "presetGroup.highlight",
		hint: "Large quote with attribution",
		hintKey: "preset.quote.hint",
		create: () => Es("quote", "300px", ys(bs("bg")), [gs(Y(20, 56, 60, 190), {
			text: K("seed.quoteBlock.text"),
			attribution: K("seed.quoteBlock.name"),
			role: K("seed.quoteBlock.role")
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
				let a = vs(Y(e, 76, 25, 120), {
					value: n,
					suffix: r,
					label: i
				});
				return a.mobileOrder = Ts(76, t, 0), a;
			};
			return Es("stats", "260px", ys(bs("surface")), [
				e(6, 0, "120", "+", K("seed.stats.l1")),
				e(37.5, 1, "25", "", K("seed.stats.l2")),
				e(69, 2, "1981", "", K("seed.stats.l3"))
			]);
		},
		itemLabel: "number",
		itemLabelKey: "item.number",
		item: (e) => {
			let { x: t, y: n, n: r } = ws(e, 3, 6, 31.5, 76, 140, 25, 120), i = vs(Y(t, n, 25, 120), {
				value: "42",
				label: K("seed.stats.newLabel")
			});
			return i.mobileOrder = Ts(76, r, 0), {
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
			let e = (e) => rs(Y(e, 108, 18.5, 100), {
				alt: K("seed.sponsors.alt"),
				fit: "contain",
				radius: null,
				saturate: 0
			});
			return Es("sponsors", "280px", ys(bs("bg")), [
				ns(Y(6, 28, 60, 36), K("seed.sponsors.title")),
				e(5.5),
				e(29),
				e(52.5),
				e(76)
			]);
		},
		itemLabel: "logo",
		itemLabelKey: "item.logo",
		item: (e) => {
			let { x: t, y: n } = ws(e, 4, 5.5, 23.5, 108, 124, 18.5, 100);
			return {
				blocks: [rs(Y(t, n, 18.5, 100), {
					alt: K("seed.sponsors.alt"),
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
		create: () => Es("membership", "500px", ys(bs("surface")), [
			ns(Y(6, 28, 50, 38), K("seed.membership.title")),
			ns(Y(14, 88, 32, 250), K("seed.membership.tier1"), {
				align: "center",
				box: !0
			}),
			ns(Y(54, 88, 32, 250), K("seed.membership.tier2"), {
				align: "center",
				box: !0
			}),
			is(Y(42, 358, 16, 42), K("seed.join")),
			ns(Y(25, 414, 50, 30), K("seed.membership.vipps"), { align: "center" })
		])
	});
}
//#endregion
//#region ../template/assets/engine/0.7.6/theme.js
function Os(e, t, n) {
	return t === "light" || t === "dark" ? t : n ? "dark" : "light";
}
function ks(e, t) {
	let n = e.tokens || {}, r = e.scheme === "dark" ? "dark" : "light";
	if (!e.alt?.tokens || t === r) return n;
	let i = {};
	for (let t of /* @__PURE__ */ new Set([...Object.keys(n), ...Object.keys(e.alt.tokens)])) i[t] = {
		...n[t],
		...e.alt.tokens[t]
	};
	return i;
}
var As = /^[a-zA-Z0-9#%.,()'"\s+\-*/]+$/;
function js(e) {
	return typeof e == "string" && As.test(e) && !/url\(|\/\*|\*\/|expression/i.test(e);
}
function Ms(e) {
	let t = e.tokens || {}, n = ks(e, "light"), r = ks(e, "dark"), i = e.scheme === "dark" ? "dark" : "light", a = [], o = [], s = [], c = /* @__PURE__ */ new Set([
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
			js(c) && (a.push(`  --urd-${e}-${l}: ${c};`), i && a.push(`  --urd-base-${l}: ${c};`)), u !== d && (i && js(u) && js(d) ? o.push({
				name: l,
				lv: u,
				dv: d
			}) : !i && js(u) && js(d) && s.push({
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
	].some((e) => js(e.color?.["accent-text"])) && js(t.color?.accent);
	u && js(t.color?.bg) && (a.push(`  --urd-color-accent-text: ${t.color.bg};`), a.push(`  --urd-base-accent-text: ${t.color.bg};`));
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
function Ns(e) {
	return /^[a-z][a-z0-9-]*$/.test(e) ? `var(--urd-color-${e})` : e;
}
var Ps = {
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
}, Fs = {
	surface: "sectionTheme.surface",
	accent: "sectionTheme.accent",
	inverse: "sectionTheme.inverse",
	soft: "sectionTheme.soft",
	muted: "sectionTheme.muted",
	deep: "sectionTheme.deep",
	highlighted: "sectionTheme.highlighted"
};
[...new Set(Object.values(Ps).flatMap(Object.keys))];
function Is(e) {
	return Ps[e] ?? {};
}
function Ls(e) {
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
function Rs(e, t) {
	let n = Ls(e), r = Ls(t);
	return n == null || r == null ? null : (Math.max(n, r) + .05) / (Math.min(n, r) + .05);
}
//#endregion
//#region ../template/assets/engine/0.7.6/nav-model.js
var zs = /^(?:data:image\/[\w.+-]+;base64,[A-Za-z0-9+/=]+|\/api\/photo\?[^\s"'<>\\]{1,2048}|\/(?!\/)[\w%./-]*)$/;
function Bs(e) {
	return typeof e == "string" && zs.test(e);
}
var Vs = /^(?:https?:\/\/|mailto:|tel:)[^\s]+$/i;
function Hs(e) {
	return typeof e == "string" && Vs.test(e.trim());
}
var Us = /^(?:\/(?![/\\])[^\s\\]*|#[^\s]*)$/;
function Ws(e) {
	return Hs(e) || typeof e == "string" && Us.test(e.trim());
}
var Gs = [
	"launcher",
	"cart",
	"theme",
	"links"
];
function Ks(e = {}) {
	let t = Array.isArray(e.tools?.order) ? e.tools.order : [], n = [];
	for (let e of t) Gs.includes(e) && !n.includes(e) && n.push(e);
	for (let e of Gs) n.includes(e) || n.push(e);
	return n;
}
//#endregion
//#region ../template/assets/engine/0.7.6/icons.js
var qs = "fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"", Js = "fill=\"currentColor\" stroke=\"none\"", Ys = {
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
}, Xs = [
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
function Zs(e) {
	let t = typeof e == "string" ? Ys[e] : null;
	return t ? `<svg viewBox="0 0 24 24" width="100%" height="100%" ${t.fill ? Js : qs} aria-hidden="true" focusable="false">${t.body}</svg>` : null;
}
//#endregion
//#region ../template/assets/engine/0.7.6/links-model.js
function Qs(e) {
	let t = Array.isArray(e?.footer?.social) ? e.footer.social : null;
	if (!t) return e;
	let n = structuredClone(e);
	n.site ??= {};
	let r = Array.isArray(n.site.links) ? n.site.links : [], i = t.filter((e) => e && typeof e.icon == "string" && e.icon.trim()).map((e, t) => ({
		id: `link-${r.length + t + 1}`,
		icon: e.icon.trim(),
		label: Ys[e.icon.trim()]?.label ?? e.icon.trim(),
		url: typeof e.url == "string" ? e.url.trim() : ""
	}));
	return n.site.links = [...r, ...i], delete n.footer.social, n;
}
var $s = /* @__PURE__ */ new Set([
	"audio",
	"calendar",
	"cart",
	"checkout",
	"collection",
	"countdown",
	"faq",
	"form",
	"product",
	"quote",
	"share",
	"stats",
	"table",
	"timeline"
]);
function ec(e) {
	return $s.has(e?.type) && e.height?.mode !== "own";
}
var tc = /* @__PURE__ */ new Set([
	"calendar",
	"collection",
	"product"
]), nc = /* @__PURE__ */ new Set([
	"countdown",
	"quote",
	"stats"
]), rc = /* @__PURE__ */ new Set([
	"image",
	"video",
	"shape",
	"icon"
]), ic = /* @__PURE__ */ new Set([
	"image",
	"video",
	"shape",
	"icon",
	"map"
]), ac = {
	min: .4,
	max: 2,
	step: .05
}, oc = {
	min: 6,
	max: 200,
	base: 16
}, sc = /* @__PURE__ */ new Map([["calendar", .875]]);
function cc(e) {
	if (!e || ic.has(e.type)) return 1;
	let t = Number(e.size);
	if (!Number.isFinite(t) || t <= 0) return 1;
	let { min: n, max: r } = uc(e);
	return Math.round(Math.min(r, Math.max(n, t)) * 100) / 100;
}
function lc(e) {
	let t = Number(e?.props?.size);
	return e?.type === "text" && Number.isFinite(t) && t > 0 ? t : oc.base * (sc.get(e?.type) ?? 1);
}
function uc(e) {
	let t = lc(e), { min: n, max: r } = dc(e), i = Math.round(ac.step * 100), a = Math.ceil(Math.max(ac.min * 100, n === null ? 0 : n / t * 100) / i - 1e-9) * i, o = Math.floor(Math.min(ac.max * 100, r === null ? Infinity : r / t * 100) / i + 1e-9) * i;
	return {
		min: Math.min(100, a) / 100,
		max: Math.max(100, o) / 100
	};
}
function dc(e) {
	let t = (e) => {
		let t = Number(e);
		return Number.isFinite(t) && t > 0 ? Math.min(oc.max, Math.max(oc.min, Math.round(t))) : null;
	}, n = t(e?.sizeMin), r = t(e?.sizeMax);
	return {
		min: n,
		max: n !== null && r !== null ? Math.max(n, r) : r
	};
}
function fc(e, t = {}) {
	let n = t.gapMax ?? 70, r = t.gapMin ?? 10, i = e.filter((e) => e && Number.isFinite(e.y) && Number.isFinite(e.h)).map((e) => ({
		...e,
		grow: Math.max(0, Number(e.grow) || 0)
	})).sort((e, t) => e.y - t.y || (e.x ?? 0) - (t.x ?? 0)), a = new Map(i.map((e) => [e.id, 0])), o = -Infinity;
	for (let e of i) {
		let t = a.get(e.id) + e.grow;
		if (o = Math.max(o, e.y + a.get(e.id) + e.h + e.grow), t <= 0) continue;
		let s = e.y + e.h / 2, c = e.y + e.h;
		for (let o of i) {
			if (o === e || o.y < s) continue;
			let i = Math.max(0, o.y - c), l = i <= n ? t : Math.max(0, t - (i - r));
			l > a.get(o.id) && a.set(o.id, l);
		}
	}
	let s = /* @__PURE__ */ new Map();
	for (let [e, t] of a) t > 0 && s.set(e, t);
	return {
		shifts: s,
		bottom: Number.isFinite(o) ? o : 0
	};
}
function pc(e, t, n) {
	return mc(e, /* @__PURE__ */ new Map([[t, n]]));
}
function mc(e, t) {
	let n = [];
	for (let r of e ?? []) {
		let e = r?.frames?.desktop;
		if (!e || !Number.isFinite(e.y) || !Number.isFinite(e.h)) continue;
		let i = t?.get(r.id), a = Number.isFinite(i) ? Math.max(0, i - e.h) : 0;
		n.push({
			id: r.id,
			x: e.x ?? 0,
			y: e.y,
			h: e.h,
			grow: a
		});
	}
	let r = /* @__PURE__ */ new Map();
	if (!n.some((e) => e.grow > 0)) return r;
	let { shifts: i } = fc(n);
	for (let e of n) {
		let t = i.get(e.id) ?? 0;
		t && r.set(e.id, e.y + t);
	}
	return r;
}
var hc = 24, gc = {
	"oppsett-byttet": "layout-changed",
	"blokk-endret": "block-edited",
	"desktop-endret-etter-mobil": "desktop-changed-after-mobile",
	seksjonshøyde: "section-height",
	"blokk-flyttet": "block-moved",
	"blokk-slettet": "block-deleted",
	"blokk-lagt-til": "block-added"
};
function _c(e, t) {
	if (!e || !("y" in e || "h" in e)) return e ?? null;
	if (t && e.x === t.x && e.y === t.y && e.w === t.w && e.h === t.h) return null;
	let n = {
		x: e.x,
		w: e.w
	};
	return Number.isFinite(e.y) && (n.row = Math.max(1, Math.round((e.y - hc) / 8) + 1), n.rows = Number.isFinite(e.h) ? Math.max(1, Math.ceil(e.h / 8)) : 1), Number.isFinite(e.z) && e.z !== 1 && (n.z = e.z), e.rot && (n.rot = e.rot), n;
}
var vc = {
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
}, yc = { bildegalleri: "slideshow" }, bc = {
	flate: "surface",
	aksent: "accent",
	invers: "inverse",
	dus: "soft",
	dempet: "muted",
	dyp: "deep",
	uthevet: "highlighted"
}, xc = {
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
function Sc(e) {
	let t = Array.isArray(e) ? e : e.blocks ?? [];
	for (let e of t) vc[e.type] && (e.type = vc[e.type]);
	if (!Array.isArray(e)) {
		for (let t of e.background?.layers ?? []) yc[t.type] && (t.type = yc[t.type]);
		bc[e.theme] && (e.theme = bc[e.theme]), xc[e.preset] && (e.preset = xc[e.preset]);
	}
	return e;
}
var Cc = 26;
function wc(e) {
	if (!e || ic.has(e.type)) return 1;
	let t = Number(e.size);
	return !Number.isFinite(t) || t <= 0 ? 1 : Math.round(Math.min(ac.max, Math.max(ac.min, t)) * 100) / 100;
}
function Tc(e) {
	for (let t of e?.blocks ?? []) {
		if (t.type !== "calendar" || !t.props || !("scale" in t.props)) continue;
		let e = wc({
			type: "calendar",
			size: t.props.scale
		});
		delete t.props.scale, e !== 1 && (t.size = e);
	}
}
function Ec(e) {
	for (let t of e?.blocks ?? []) {
		if (t.type !== "map" && t.type !== "kart" || !Number.isFinite(t.props?.height)) continue;
		let n = t.frames?.desktop;
		if (n && Number.isFinite(n.h)) {
			let r = Math.max(n.h, Math.round(t.props.height + Cc)), i = pc(e.blocks, t.id, r);
			n.h = r;
			for (let t of e.blocks) {
				let e = i.get(t.id);
				Number.isFinite(e) && t.frames?.desktop && (t.frames.desktop.y = e);
			}
		}
		delete t.props.height;
	}
}
function Dc(e, t = !1) {
	for (let n of e?.blocks ?? []) {
		if (n.type !== "gallery" || !n.props) continue;
		let r = n.frames?.desktop;
		if ((t || "bandHeight" in n.props) && n.props.view === "ribbon" && r && Number.isFinite(r.h)) {
			let t = Math.min(400, Math.max(80, Number(n.props.bandHeight) || 160)), i = Number(n.props.rows) === 2 ? 2 : 1, a = Number(n.props.gap) || 0, o = Math.round((i * t + (i - 1) * a) * wc(n)), s = pc(e.blocks, n.id, o);
			r.h = o;
			for (let t of e.blocks) {
				let e = s.get(t.id);
				Number.isFinite(e) && t.frames?.desktop && (t.frames.desktop.y = e);
			}
		}
		delete n.props.bandHeight;
	}
}
var Oc = {
	1: (e) => {
		for (let t of e.sections ?? []) {
			let e = t.responsive?.mobile;
			for (let e of t.blocks ?? []) e.decor && (e.hideMobile = !0), e.frames?.mobile && (e.frames.mobile = _c(e.frames.mobile, e.frames.desktop));
			e?.mode === "manual" && (e.mode = "auto");
			let n = e?.attention?.reason;
			n && gc[n] && (e.attention.reason = gc[n]);
		}
		return e;
	},
	2: (e) => {
		for (let t of e.sections ?? []) Sc(t);
		return e;
	},
	3: (e) => {
		for (let t of e.sections ?? []) Sc(t);
		return e;
	},
	4: (e) => {
		for (let t of e.sections ?? []) Ec(t);
		return e;
	},
	5: (e) => {
		for (let t of e.sections ?? []) Tc(t);
		return e;
	},
	6: (e) => {
		for (let t of e.sections ?? []) Dc(t, !0);
		return e;
	}
}, kc = {
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
	}),
	3: (e) => e.nav && e.nav.style?.inset === void 0 ? {
		...e,
		nav: {
			...e.nav,
			style: {
				...e.nav.style ?? {},
				inset: !1
			}
		}
	} : e,
	4: (e) => Qs(e)
};
function Ac(e) {
	let t = structuredClone(e), n = t.schemaVersion ?? 1;
	for (; n < 5;) {
		let r = kc[n];
		if (typeof r != "function") return e;
		t = r(t) ?? t, n++, t.schemaVersion = n;
	}
	return t;
}
function jc(e, t) {
	let n = structuredClone(e), r = n.schemaVersion ?? 1;
	for (; r < 7;) {
		let i = Oc[r];
		if (typeof i != "function") return e;
		n = i(n, t) ?? n, r++, n.schemaVersion = r;
	}
	return n;
}
//#endregion
//#region ../template/assets/engine/0.7.6/page-presets.js
var Mc = /* @__PURE__ */ new Map();
Ds({ sections: { define: (e, t) => Mc.set(e, t) } });
var Nc = [
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
function Pc(e, { pageId: t, title: n }) {
	let r = Nc.find((t) => t.id === e);
	return r ? {
		schemaVersion: 7,
		meta: {
			id: t,
			title: n
		},
		sections: r.sections.map((e) => Mc.get(e).create())
	} : null;
}
//#endregion
//#region src/panels/PagesPanel.svelte
var Fc = /* @__PURE__ */ L("<span class=\"page-path\">/</span>"), Ic = /* @__PURE__ */ L("<input class=\"page-slug\"/>"), Lc = /* @__PURE__ */ L("<span class=\"seo-warn\"></span>"), Rc = /* @__PURE__ */ L("<button class=\"ghost danger\"><!> </button>"), zc = /* @__PURE__ */ L("<div class=\"page-menu\"><button class=\"ghost\"><!> </button> <!></div>"), Bc = /* @__PURE__ */ L("<div><input class=\"page-title\"/> <!> <!> <span class=\"row-tools\"><button class=\"ghost row-tool\"></button> <span class=\"page-menu-wrap\"><button class=\"ghost row-tool\"></button> <!></span></span></div>"), Vc = /* @__PURE__ */ L("<img class=\"site-icon-preview\"/>"), Hc = /* @__PURE__ */ L("<button class=\"ghost row-tool\"></button>"), Uc = /* @__PURE__ */ L("<div><button class=\"page-template-pick\"><span class=\"page-template-thumb\"></span> <span class=\"page-template-name\"> </span></button></div>"), Wc = /* @__PURE__ */ L("<div><button class=\"page-template-pick\"><span class=\"page-template-thumb\"></span> <span class=\"page-template-name\"> </span></button> <button class=\"page-template-del\"></button></div>"), Gc = /* @__PURE__ */ L("<span class=\"mini-label\"> </span> <div class=\"page-template-grid\"></div>", 1), Kc = /* @__PURE__ */ L("<div class=\"panel-body\"><!> <details class=\"group\"><summary> </summary> <div class=\"group-items\"><label> <textarea rows=\"2\"></textarea></label> <label> <input/></label> <label> <textarea rows=\"2\"></textarea></label> <label> <!></label> <span class=\"toolbar-row\"><label class=\"ghost filepick tb-grow\"> <input type=\"file\" accept=\"image/*\"/></label> <!></span> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label></div></details> <hr class=\"gridmenu-divider\"/> <input/> <button class=\"ghost action\"> </button> <span class=\"mini-label\"> </span> <div class=\"page-template-grid\"><div><button class=\"page-template-pick\"><span class=\"page-template-thumb\"></span> <span class=\"page-template-name\"> </span></button></div> <!></div> <!></div>");
function qc(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.missingSeo), i = /* @__PURE__ */ D(() => n.pageId), a = /* @__PURE__ */ D(() => n.seoDraft), o = /* @__PURE__ */ D(() => n.siteDraft), s = /* @__PURE__ */ D(() => n.templateIds), { addPage: c, deletePage: l, handleDeleteTemplate: u, renamePage: d, savePageAsTemplate: f, selectPage: p, setPageNoindex: m, setPageSeo: h, setPageSlug: g, templateStores: _, uploadOgImage: v } = n, y = Object.fromEntries(Nc.map((e) => [e.id, Qo(Pc(e.id, {
		pageId: "preview",
		title: ""
	}))])), b = /* @__PURE__ */ D(() => {
		let e = F(o)?.theme?.tokens?.color ?? {};
		return [
			"bg",
			"surface",
			"text",
			"accent"
		].filter((t) => typeof e[t] == "string" && js(e[t])).map((t) => `--urd-color-${t}: ${e[t]};`).join(" ");
	});
	var x = Kc(), S = A(x);
	di(S, 17, () => F(o).pages, (e) => e.id, (e, t) => {
		var a = Bc();
		let o;
		var s = A(a);
		U(s);
		var c = N(s, 2), u = (e) => {
			var t = Fc();
			P((e) => G(t, "title", e), [() => K("tip.pages.homeLocked")]), R(e, t);
		}, m = (e) => {
			var n = Ic();
			U(n), P((e, t) => {
				W(n, e), G(n, "title", t);
			}, [() => F(t).path.slice(1), () => K("tip.pages.slug")]), I("change", n, (e) => g(F(t), e.target.value)), R(e, n);
		};
		B(c, (e) => {
			F(t).path === "/" ? e(u) : e(m, -1);
		});
		var h = N(c, 2), _ = (e) => {
			var t = Lc();
			V(t, () => q.warn, !0), E(t), P((e) => G(t, "title", e), [() => K("tip.pages.missingDescription")]), R(e, t);
		};
		B(h, (e) => {
			F(r)[F(t).id] && e(_);
		});
		var v = N(h, 2), y = A(v);
		V(y, () => q.right, !0), E(y);
		var b = N(y, 2), x = A(b);
		V(x, () => q.kebab, !0), E(x);
		var S = N(x, 2), C = (e) => {
			var r = zc(), i = A(r), a = A(i);
			V(a, () => q.bookmark);
			var o = N(a);
			E(i);
			var s = N(i, 2), c = (e) => {
				var r = Rc(), i = A(r);
				V(i, () => q.cross);
				var a = N(i);
				E(r), P((e, t) => {
					G(r, "title", e), z(a, ` ${t ?? ""}`);
				}, [() => K("tip.pages.delete"), () => K("ui.deletePage")]), I("click", r, () => {
					n.pageMenuFor = null, l(F(t));
				}), R(e, r);
			};
			B(s, (e) => {
				F(t).path !== "/" && e(c);
			}), E(r), P((e) => z(o, ` ${e ?? ""}`), [() => K("ui.savePageTemplate")]), I("click", i, () => f(F(t))), R(e, r);
		};
		B(S, (e) => {
			n.pageMenuFor === F(t).id && e(C);
		}), E(b), E(v), E(a), P((e, n, r) => {
			o = H(a, 1, "page-row", null, o, { current: F(t).id === F(i) }), W(s, F(t).title), G(s, "title", e), G(y, "title", n), y.disabled = F(t).id === F(i), G(x, "title", r);
		}, [
			() => K("tip.pages.title"),
			() => K("tip.pages.open"),
			() => K("tip.pages.menu")
		]), I("change", s, (e) => d(F(t), e.target.value)), I("click", y, () => p(F(t).id)), I("click", x, () => n.pageMenuFor = n.pageMenuFor === F(t).id ? null : F(t).id), R(e, a);
	});
	var C = N(S, 2), w = A(C), ee = M(w, !0), T = N(w, 2), te = A(T), ne = A(te), re = N(ne);
	vt(re), E(te);
	var ie = N(te, 2), ae = A(ie), oe = N(ae);
	U(oe), E(ie);
	var se = N(ie, 2), ce = A(se), le = N(ce);
	vt(le), E(se);
	var ue = N(se, 2), de = A(ue), fe = N(de), pe = (e) => {
		var t = Vc();
		P((e) => {
			G(t, "src", F(a).ogImage), G(t, "alt", e);
		}, [() => K("lbl.ogImage")]), R(e, t);
	};
	B(fe, (e) => {
		F(a).ogImage && e(pe);
	}), E(ue);
	var me = N(ue, 2), he = A(me), ge = A(he), _e = N(ge);
	E(he);
	var ve = N(he, 2), ye = (e) => {
		var t = Hc();
		V(t, () => q.cross, !0), E(t), P((e) => G(t, "title", e), [() => K("tip.seo.removeOgImage")]), I("click", t, () => h("ogImage", "")), R(e, t);
	};
	B(ve, (e) => {
		F(a).ogImage && e(ye);
	}), E(me);
	var be = N(me, 2), xe = A(be);
	U(xe);
	var Se = N(xe);
	E(be), E(T), E(C);
	var Ce = N(C, 4);
	U(Ce);
	var we = N(Ce, 2), Te = M(we, !0), Ee = N(we, 2), De = M(Ee, !0), Oe = N(Ee, 2), ke = A(Oe);
	let Ae;
	var je = A(ke), Me = A(je);
	V(Me, () => Qo({ sections: [] }), !0), E(Me);
	var Ne = M(N(Me, 2), !0);
	E(je), E(ke), di(N(ke, 2), 17, () => Nc, (e) => e.id, (e, t) => {
		var r = Uc();
		let i;
		var a = A(r), o = A(a);
		V(o, () => y[F(t).id], !0), E(o);
		var s = M(N(o, 2), !0);
		E(a), E(r), P((e, o) => {
			i = H(r, 1, "page-template-card", null, i, { picked: n.newPageTemplate === `preset:${F(t).id}` }), G(a, "title", e), z(s, o);
		}, [() => K("tip.pages.templatePick", { name: K(F(t).labelKey) }), () => K(F(t).labelKey)]), I("click", a, () => n.newPageTemplate = n.newPageTemplate === `preset:${F(t).id}` ? null : `preset:${F(t).id}`), R(e, r);
	}), E(Oe);
	var Pe = N(Oe, 2), Fe = (e) => {
		var t = Gc(), r = j(t), i = M(r, !0), a = N(r, 2);
		di(a, 20, () => F(s).filter((e) => _[e]?.data?.mal?.kind === "page"), (e) => e, (e, t) => {
			var r = Wc();
			let i;
			var a = A(r), o = A(a);
			V(o, () => Qo(_[t].data.page), !0), E(o);
			var s = M(N(o, 2), !0);
			E(a);
			var c = N(a, 2);
			V(c, () => q.cross, !0), E(c), E(r), P((e, o) => {
				i = H(r, 1, "page-template-card", null, i, { picked: n.newPageTemplate === t }), G(a, "title", e), z(s, _[t].data.mal.name), G(c, "title", o);
			}, [() => K("tip.pages.templatePick", { name: _[t].data.mal.name }), () => K("canvas.deleteTemplate")]), I("click", a, () => n.newPageTemplate = n.newPageTemplate === t ? null : t), I("click", c, () => u({ id: t })), R(e, r);
		}), E(a), P((e) => {
			z(i, e), Ii(a, F(b));
		}, [() => K("canvas.tabMyTemplates")]), R(e, t);
	}, Ie = /* @__PURE__ */ D(() => F(s).some((e) => _[e]?.data?.mal?.kind === "page"));
	B(Pe, (e) => {
		F(Ie) && e(Fe);
	}), E(x), P((e, t, r, i, o, s, c, l, u, d, f, p, m, h, g, _, v, y, x, S, C, w) => {
		z(ee, e), G(te, "title", t), z(ne, `${r ?? ""} `), W(re, F(a).description), G(ie, "title", i), z(ae, `${o ?? ""} `), W(oe, F(a).ogTitle), G(oe, "placeholder", s), G(se, "title", c), z(ce, `${l ?? ""} `), W(le, F(a).ogDescription), G(le, "placeholder", F(a).description), G(ue, "title", u), z(de, `${d ?? ""} `), G(he, "title", f), z(ge, `${p ?? ""} `), G(be, "title", m), Vi(xe, h), z(Se, ` ${g ?? ""}`), G(Ce, "placeholder", _), G(we, "title", v), we.disabled = y, z(Te, x), z(De, S), Ii(Oe, F(b)), Ae = H(ke, 1, "page-template-card", null, Ae, { picked: n.newPageTemplate === null }), G(je, "title", C), z(Ne, w);
	}, [
		() => K("ui.seoGroup", { page: F(o).pages.find((e) => e.id === F(i))?.title ?? "" }),
		() => K("tip.seo.description"),
		() => K("lbl.seoDescription"),
		() => K("tip.seo.ogTitle"),
		() => K("lbl.ogTitle"),
		() => F(o).pages.find((e) => e.id === F(i))?.title ?? "",
		() => K("tip.seo.ogDescription"),
		() => K("lbl.ogDescription"),
		() => K("tip.seo.ogImage"),
		() => K("lbl.ogImage"),
		() => K("tip.seo.ogImage"),
		() => F(a).ogImage ? K("ui.changeImage") : K("ui.chooseImage"),
		() => K("tip.seo.hideFromSearch"),
		() => F(o).pages.find((e) => e.id === F(i))?.noindex === !0,
		() => K("lbl.hideFromSearch"),
		() => K("ph.newPageName"),
		() => K("hint.pages.autoMenu"),
		() => !n.newPageTitle.trim(),
		() => K("ui.createPage"),
		() => K("canvas.tabPresets"),
		() => K("tip.pages.blankPick"),
		() => K("ui.blankPage")
	]), I("change", re, (e) => h("description", e.target.value)), I("change", oe, (e) => h("ogTitle", e.target.value)), I("change", le, (e) => h("ogDescription", e.target.value)), I("change", _e, v), I("change", xe, (e) => m(e.target.checked)), I("keydown", Ce, (e) => e.key === "Enter" && c()), Gi(Ce, () => n.newPageTitle, (e) => n.newPageTitle = e), I("click", we, c), I("click", je, () => n.newPageTemplate = null), R(e, x), ot();
}
Vr([
	"change",
	"click",
	"keydown"
]);
//#endregion
//#region src/lib/ColorPicker.svelte
var Jc = /* @__PURE__ */ L("<button type=\"button\" class=\"cp-eye svelte-zxiloo\"><svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 2l4 4-3 3-4-4 3-3z\"></path><path d=\"M15 5L4 16l-1 5 5-1L19 9\"></path></svg></button>"), Yc = /* @__PURE__ */ L("<input type=\"number\" min=\"0\" max=\"255\" class=\"svelte-zxiloo\"/>"), Xc = /* @__PURE__ */ L("<button type=\"button\"></button>"), Zc = /* @__PURE__ */ L("<span class=\"cp-label svelte-zxiloo\"> <!></span> <span class=\"cp-tokens svelte-zxiloo\"></span>", 1), Qc = /* @__PURE__ */ L("<span class=\"cp-saved svelte-zxiloo\"><button type=\"button\" class=\"cp-token svelte-zxiloo\"></button> <button type=\"button\" class=\"cp-del svelte-zxiloo\">×</button></span>"), $c = /* @__PURE__ */ L("<span class=\"cp-tokens svelte-zxiloo\"></span>"), el = /* @__PURE__ */ L("<button type=\"button\" class=\"cp-token svelte-zxiloo\"></button>"), tl = /* @__PURE__ */ L("<span class=\"cp-label svelte-zxiloo\"> </span> <span class=\"cp-tokens svelte-zxiloo\"></span>", 1), nl = /* @__PURE__ */ L("<div class=\"cp-sv svelte-zxiloo\"><span class=\"cp-cursor svelte-zxiloo\"></span></div> <input class=\"cp-hue svelte-zxiloo\" type=\"range\" min=\"0\" max=\"360\" step=\"1\"/> <input class=\"cp-alpha svelte-zxiloo\" type=\"range\" min=\"0\" max=\"100\" step=\"1\"/> <span class=\"cp-row svelte-zxiloo\"><span class=\"cp-preview svelte-zxiloo\"></span> <input class=\"cp-hex svelte-zxiloo\" spellcheck=\"false\"/> <!></span> <span class=\"cp-row cp-rgb svelte-zxiloo\"></span> <!> <span class=\"cp-label cp-label-row svelte-zxiloo\"> <button type=\"button\" class=\"cp-add svelte-zxiloo\">+</button></span> <!> <!>", 1), rl = /* @__PURE__ */ L("<button type=\"button\" class=\"cp-clear svelte-zxiloo\">×</button>"), il = /* @__PURE__ */ L("<div class=\"cp-pop cp-anchored svelte-zxiloo\" popover=\"auto\"><!></div>"), al = /* @__PURE__ */ L("<div class=\"cp-pop svelte-zxiloo\"><!></div>"), ol = /* @__PURE__ */ L("<span class=\"cp svelte-zxiloo\"><button type=\"button\"></button> <!> <!></span>");
function sl(e, t) {
	at(t, !0);
	let n = (e) => {
		var t = nl(), n = j(t), a = M(n), o = N(n, 2);
		U(o);
		var s = N(o, 2);
		U(s);
		var c = N(s, 2), l = A(c), u = N(l, 2);
		U(u);
		var d = N(u, 2), f = (e) => {
			var t = Jc();
			P((e) => G(t, "title", e), [() => K("cp.eyedropper")]), I("click", t, xe), R(e, t);
		};
		B(d, (e) => {
			be && e(f);
		}), E(c);
		var p = N(c, 2);
		di(p, 22, () => [
			"R",
			"G",
			"B"
		], (e) => e, (e, t, n) => {
			var r = Yc();
			U(r), P((e) => {
				G(r, "title", t), W(r, e);
			}, [() => ve(F(n))]), I("change", r, (e) => ye(F(n), e.target.value)), R(e, r);
		}), E(p);
		var v = N(p, 2), y = (e) => {
			var t = Zc(), n = j(t), a = A(n, !0), o = N(a), s = (e) => {
				var t = Yr();
				P((e) => z(t, e), [() => K("cp.linkedSuffix", { token: m() })]), R(e, t);
			}, c = /* @__PURE__ */ D(() => m());
			B(o, (e) => {
				F(c) && e(s);
			}), E(n);
			var l = N(n, 2);
			di(l, 21, i, ([e, t]) => e, (e, t) => {
				var n = /* @__PURE__ */ D(() => g(F(t), 2));
				let i = () => F(n)[0], a = () => F(n)[1];
				var o = Xc();
				let s;
				P((e) => {
					s = H(o, 1, "cp-token svelte-zxiloo", null, s, { active: r() === i() }), Ii(o, `background: ${a() ?? ""}`), G(o, "title", e);
				}, [() => K("cp.tokenTitle", { name: i() })]), I("click", o, () => he(i(), a())), R(e, o);
			}), E(l), P((e) => z(a, e), [() => K("cp.themeColors")]), R(e, t);
		};
		B(v, (e) => {
			i().length && e(y);
		});
		var b = N(v, 2), x = A(b), S = N(x);
		E(b);
		var ne = N(b, 2), re = (e) => {
			var t = $c();
			di(t, 20, () => F(_), (e) => e, (e, t) => {
				var n = Qc(), r = A(n), i = N(r, 2);
				E(n), P((e) => {
					Ii(r, `background: ${t ?? ""}`), G(r, "title", t), G(i, "title", e);
				}, [() => K("cp.removeSaved")]), I("click", r, () => Se(t)), I("click", i, () => we(t)), R(e, n);
			}), E(t), R(e, t);
		};
		B(ne, (e) => {
			F(_).length && e(re);
		});
		var ie = N(ne, 2), ae = (e) => {
			var t = tl(), n = j(t), r = M(n, !0), i = N(n, 2);
			di(i, 20, () => F(h), (e) => e, (e, t) => {
				var n = el();
				P(() => {
					Ii(n, `background: ${t ?? ""}`), G(n, "title", t);
				}), I("click", n, () => Se(t)), R(e, n);
			}), E(i), P((e) => z(r, e), [() => K("common.recent")]), R(e, t);
		};
		B(ie, (e) => {
			F(h).length && e(ae);
		}), P((e, t, r, i, c) => {
			Ii(n, `background-image: linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent); background-color: hsl(${F(C) ?? ""}, 100%, 50%)`), Ii(a, `left: ${F(w) * 100}%; top: ${(1 - F(ee)) * 100}%`), W(o, F(C)), W(s, e), G(s, "title", t), Ii(s, `background: linear-gradient(to right, transparent, ${r ?? ""}), repeating-conic-gradient(rgb(255 255 255 / 35%) 0 25%, rgb(0 0 0 / 35%) 0 50%) 0 0 / 10px 10px`), Ii(l, `background: ${F(te) ?? ""}`), W(u, F(te)), z(x, `${i ?? ""} `), G(S, "title", c);
		}, [
			() => Math.round(F(T) * 100),
			() => K("cp.alpha"),
			() => oe(),
			() => K("cp.saved"),
			() => K("cp.saveTitle")
		]), I("pointerdown", n, ge), I("input", o, (e) => {
			k(C, Number(e.target.value), !0), ce();
		}), I("input", s, (e) => {
			k(T, Number(e.target.value) / 100), ce();
		}), I("change", u, _e), I("click", S, Ce), R(e, t);
	}, r = ra(t, "value", 3, "#000000"), i = ra(t, "tokens", 19, () => []), a = ra(t, "label", 19, () => K("cp.pickColor")), o = ra(t, "allowClear", 3, !1), s = "urd-recent-colors", c = "urd-saved-colors", l = Ta(), u = Da("urd-cp"), d = u.slice(2), f = /* @__PURE__ */ O(null), p = () => {
		let e = i().find(([e]) => e === r());
		return e ? e[1] : r();
	}, m = () => i().find(([e]) => e === r())?.[0] ?? null, h = /* @__PURE__ */ O(mn([])), _ = /* @__PURE__ */ O(mn([])), v = "", y = "", b = /* @__PURE__ */ O(null), x = /* @__PURE__ */ O(!1), S = /* @__PURE__ */ O(mn({
		top: 0,
		left: 0
	})), C = /* @__PURE__ */ O(0), w = /* @__PURE__ */ O(0), ee = /* @__PURE__ */ O(1), T = /* @__PURE__ */ O(1), te = /* @__PURE__ */ O("#000000");
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
	let re = (e, t, n) => "#" + [
		e,
		t,
		n
	].map((e) => e.toString(16).padStart(2, "0")).join("");
	function ie(e, t, n) {
		e /= 255, t /= 255, n /= 255;
		let r = Math.max(e, t, n), i = r - Math.min(e, t, n), a = 0;
		return i && (a = r === e ? (t - n) / i % 6 : r === t ? (n - e) / i + 2 : (e - t) / i + 4, a *= 60, a < 0 && (a += 360)), [
			a,
			r ? i / r : 0,
			r
		];
	}
	function ae(e, t, n) {
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
	function oe() {
		return re(...ae(F(C), F(w), F(ee)));
	}
	function se() {
		let e = oe();
		return F(T) >= .995 ? e : e + Math.round(F(T) * 255).toString(16).padStart(2, "0");
	}
	function ce() {
		k(te, se(), !0), y = F(te), t.onchange?.(F(te));
	}
	function le(e) {
		let t = ne(e);
		return t ? (((e) => {
			var t = g(e, 3);
			k(C, t[0], !0), k(w, t[1], !0), k(ee, t[2], !0);
		})(ie(t[0], t[1], t[2])), k(T, t[3], !0), k(te, se(), !0), !0) : !1;
	}
	function ue() {
		le(p()) || le("#000000"), v = r(), y = "";
		try {
			let e = JSON.parse(localStorage.getItem(s) ?? "[]");
			k(h, Array.isArray(e) ? e : [], !0);
		} catch {
			k(h, [], !0);
		}
		try {
			let e = JSON.parse(localStorage.getItem(c) ?? "[]");
			k(_, Array.isArray(e) ? e : [], !0);
		} catch {
			k(_, [], !0);
		}
	}
	function de(e) {
		e.newState === "open" ? (ue(), Oa(F(b), !0), k(x, !0)) : F(x) && (Oa(F(b), !1), k(x, !1), pe());
	}
	function fe() {
		ue();
		let e = F(b).getBoundingClientRect(), t = F(b).closest(".panel-body")?.getBoundingClientRect(), n = t ? t.right : window.innerWidth, r = Math.max(8, Math.min(e.right - 236, n - 236 - 8)), i = e.bottom + 380 + 8 > window.innerHeight ? Math.max(8, e.top - 380 - 8) : e.bottom + 6;
		k(S, {
			top: i,
			left: r
		}, !0), k(x, !0);
	}
	function pe() {
		if (y && y !== v) {
			let e = [y, ...F(h).filter((e) => e !== y)].slice(0, 8);
			localStorage.setItem(s, JSON.stringify(e));
		}
	}
	function me() {
		l ? F(f)?.hidePopover() : (k(x, !1), pe());
	}
	function he(e, n) {
		le(n), k(te, n, !0), t.onchange?.(e);
	}
	function ge(e) {
		let t = e.currentTarget;
		t.setPointerCapture(e.pointerId);
		let n = (e) => {
			let n = t.getBoundingClientRect();
			k(w, Math.min(1, Math.max(0, (e.clientX - n.left) / n.width)), !0), k(ee, 1 - Math.min(1, Math.max(0, (e.clientY - n.top) / n.height))), ce();
		};
		n(e);
		let r = (e) => n(e), i = () => {
			t.removeEventListener("pointermove", r), t.removeEventListener("pointerup", i);
		};
		t.addEventListener("pointermove", r), t.addEventListener("pointerup", i);
	}
	function _e(e) {
		le(e.target.value) ? ce() : k(te, oe(), !0);
	}
	function ve(e) {
		return (ne(oe()) ?? [
			0,
			0,
			0
		])[e];
	}
	function ye(e, t) {
		let n = ne(oe()) ?? [
			0,
			0,
			0
		];
		n[e] = Math.min(255, Math.max(0, Number(t) || 0)), ((e) => {
			var t = g(e, 3);
			k(C, t[0], !0), k(w, t[1], !0), k(ee, t[2], !0);
		})(ie(...n)), ce();
	}
	let be = typeof window < "u" && "EyeDropper" in window;
	async function xe() {
		try {
			le((await new window.EyeDropper().open()).sRGBHex) && ce();
		} catch {}
	}
	function Se(e) {
		le(e) && ce();
	}
	function Ce() {
		let e = se();
		F(_).includes(e) || (k(_, [e, ...F(_)].slice(0, 12), !0), localStorage.setItem(c, JSON.stringify(Ze(F(_)))));
	}
	function we(e) {
		k(_, F(_).filter((t) => t !== e), !0), localStorage.setItem(c, JSON.stringify(Ze(F(_))));
	}
	Pn(() => {
		if (!F(x)) return;
		let e = () => me();
		if (window.addEventListener("blur", e), l) return () => window.removeEventListener("blur", e);
		let t = (e) => {
			F(b) && !F(b).contains(e.target) && me();
		}, n = (e) => {
			e.key === "Escape" && me();
		};
		return document.addEventListener("pointerdown", t, !0), document.addEventListener("keydown", n, !0), () => {
			document.removeEventListener("pointerdown", t, !0), document.removeEventListener("keydown", n, !0), window.removeEventListener("blur", e);
		};
	});
	var Te = ol(), Ee = A(Te);
	let De;
	var Oe = N(Ee, 2), ke = (e) => {
		var n = rl();
		P((e, t) => {
			G(n, "title", e), G(n, "aria-label", t);
		}, [() => K("cp.clearTitle"), () => K("cp.clear")]), I("click", n, () => t.onchange?.("")), R(e, n);
	};
	B(Oe, (e) => {
		o() && r() && e(ke);
	});
	var Ae = N(Oe, 2), je = (e) => {
		var t = il(), r = A(t), i = (e) => {
			n(e);
		};
		B(r, (e) => {
			F(x) && e(i);
		}), E(t), Zi(t, (e) => k(f, e), () => F(f)), P(() => {
			G(t, "id", d), Ii(t, `position-anchor: ${u ?? ""}`);
		}), Br("toggle", t, de), I("click", t, (e) => e.preventDefault()), R(e, t);
	}, Me = (e) => {
		var t = al(), r = A(t);
		n(r), E(t), P(() => Ii(t, `top: ${F(S).top ?? ""}px; left: ${F(S).left ?? ""}px`)), I("click", t, (e) => e.preventDefault()), R(e, t);
	};
	B(Ae, (e) => {
		l ? e(je) : F(x) && e(Me, 1);
	}), E(Te), Zi(Te, (e) => k(b, e), () => F(b)), P((e, t, n) => {
		De = H(Ee, 1, "cp-swatch svelte-zxiloo", null, De, {
			linked: e,
			"cp-empty": o() && !r()
		}), Ii(Ee, `background: ${t ?? ""}${l ? `; anchor-name: ${u}` : ""}`), G(Ee, "title", n), G(Ee, "popovertarget", l ? d : void 0), G(Ee, "aria-label", a());
	}, [
		() => m(),
		() => r() ? p() : "transparent",
		() => m() ? K("cp.linkedTitle", {
			label: a(),
			token: m()
		}) : a()
	]), I("click", Ee, function(...e) {
		(l ? void 0 : () => F(x) ? me() : fe())?.apply(this, e);
	}), R(e, Te), ot();
}
Vr([
	"pointerdown",
	"input",
	"change",
	"click"
]);
//#endregion
//#region src/lib/MarkPicker.svelte
var cl = /* @__PURE__ */ L("<span class=\"mp-count svelte-1y5ipgc\"> </span>"), ll = /* @__PURE__ */ L("<div class=\"mp-tabs svelte-1y5ipgc\" role=\"group\"><button type=\"button\"> </button> <button type=\"button\"> <!></button></div>"), ul = /* @__PURE__ */ L("<button type=\"button\"><span class=\"mp-svg svelte-1y5ipgc\"></span></button>"), dl = /* @__PURE__ */ L("<p class=\"mp-hint svelte-1y5ipgc\"> </p>"), fl = /* @__PURE__ */ L("<input class=\"mp-search svelte-1y5ipgc\" type=\"search\"/> <div class=\"mp-scroll svelte-1y5ipgc\"><div class=\"mp-grid svelte-1y5ipgc\"><button type=\"button\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" aria-hidden=\"true\" class=\"svelte-1y5ipgc\"><circle cx=\"12\" cy=\"12\" r=\"8.5\"></circle><path d=\"M6 18L18 6\"></path></svg></button> <!></div> <!></div>", 1), pl = /* @__PURE__ */ L("<button type=\"button\"><img alt=\"\" class=\"svelte-1y5ipgc\"/></button>"), ml = /* @__PURE__ */ L("<div class=\"mp-scroll svelte-1y5ipgc\"><div class=\"mp-grid mp-grid-img svelte-1y5ipgc\"><button type=\"button\" class=\"mp-cell mp-upload svelte-1y5ipgc\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" aria-hidden=\"true\" class=\"svelte-1y5ipgc\"><path d=\"M12 5v14\"></path><path d=\"M5 12h14\"></path></svg> <span> </span></button> <!></div> <p class=\"mp-hint svelte-1y5ipgc\"> </p></div>"), hl = /* @__PURE__ */ L("<!> <!>", 1), gl = /* @__PURE__ */ L("<img class=\"mp-own svelte-1y5ipgc\" alt=\"\"/>"), _l = /* @__PURE__ */ L("<span class=\"mp-svg svelte-1y5ipgc\"></span>"), vl = /* @__PURE__ */ L("<span class=\"mp-empty svelte-1y5ipgc\" aria-hidden=\"true\">+</span>"), yl = /* @__PURE__ */ L("<div class=\"mp-pop mp-anchored svelte-1y5ipgc\" popover=\"auto\"><!></div>"), bl = /* @__PURE__ */ L("<div class=\"mp-pop svelte-1y5ipgc\"><!></div>"), xl = /* @__PURE__ */ L("<span class=\"mp svelte-1y5ipgc\"><button type=\"button\"><!></button> <!> <input type=\"file\" accept=\"image/*\" hidden=\"\"/></span>");
function Sl(e, t) {
	at(t, !0);
	let n = (e) => {
		var t = hl(), n = j(t), a = (e) => {
			var t = ll(), n = A(t);
			let r;
			var i = M(n, !0), a = N(n, 2);
			let s;
			var c = A(a, !0), l = N(c), u = (e) => {
				var t = cl(), n = M(t, !0);
				P(() => z(n, F(S).length)), R(e, t);
			};
			B(l, (e) => {
				F(S).length && e(u);
			}), E(a), E(t), P((e, l) => {
				G(t, "aria-label", o()), r = H(n, 1, "mp-tab svelte-1y5ipgc", null, r, { on: F(_) === "icons" }), G(n, "aria-pressed", F(_) === "icons"), z(i, e), s = H(a, 1, "mp-tab svelte-1y5ipgc", null, s, { on: F(_) === "images" }), G(a, "aria-pressed", F(_) === "images"), z(c, l);
			}, [() => K("mp.icons"), () => K("mp.images")]), I("click", n, () => k(_, "icons")), I("click", a, () => k(_, "images")), R(e, t);
		};
		B(n, (e) => {
			l() || e(a);
		});
		var c = N(n, 2), u = (e) => {
			var t = fl(), n = j(t);
			U(n);
			var a = N(n, 2), o = A(a), c = A(o);
			let l;
			di(N(c, 2), 17, () => F(x), ({ id: e }) => e, (e, t) => {
				let n = () => F(t).id;
				var a = ul();
				let o;
				var s = A(a);
				V(s, () => Zs(n()), !0), E(s), E(a), P((e, t) => {
					o = H(a, 1, "mp-cell svelte-1y5ipgc", null, o, { active: n() === r() && !i() }), G(a, "title", e), G(a, "aria-label", t);
				}, [() => K(Ys[n()].labelKey), () => K(Ys[n()].labelKey)]), I("click", a, () => te(n())), R(e, a);
			}), E(o);
			var u = N(o, 2), d = (e) => {
				var t = dl(), n = M(t, !0);
				P((e) => z(n, e), [() => K("mp.noHits")]), R(e, t);
			};
			B(u, (e) => {
				F(x).length || e(d);
			}), E(a), P((e, t) => {
				G(n, "placeholder", e), G(n, "aria-label", t), l = H(c, 1, "mp-cell mp-none svelte-1y5ipgc", null, l, { active: !r() && !i() }), G(c, "title", s()), G(c, "aria-label", s());
			}, [() => K("mp.search"), () => K("mp.search")]), Gi(n, () => F(v), (e) => k(v, e)), I("click", c, re), R(e, t);
		}, d = (e) => {
			var t = ml(), n = A(t), r = A(n), a = M(N(A(r), 2), !0);
			E(r), di(N(r, 2), 16, () => F(S), (e) => e, (e, t) => {
				var n = pl();
				let r;
				var a = M(n);
				P(() => {
					r = H(n, 1, "mp-cell mp-img svelte-1y5ipgc", null, r, { active: t === i() }), G(a, "src", t);
				}), I("click", n, () => ne(t)), R(e, n);
			}), E(n);
			var o = M(N(n, 2), !0);
			E(t), P((e, t) => {
				z(a, e), z(o, t);
			}, [() => K("mp.upload"), () => K("mp.imagesHint")]), I("click", r, oe), R(e, t);
		};
		B(c, (e) => {
			F(_) === "icons" ? e(u) : e(d, -1);
		}), R(e, t);
	}, r = ra(t, "icon", 3, ""), i = ra(t, "image", 3, ""), a = ra(t, "images", 19, () => []), o = ra(t, "label", 19, () => K("mp.pickMark")), s = ra(t, "noneLabel", 19, () => K("common.none")), c = ra(t, "klass", 3, ""), l = ra(t, "iconsOnly", 3, !1), u = Ta(), d = Da("urd-mp"), f = d.slice(2), p = /* @__PURE__ */ O(null), m = /* @__PURE__ */ O(null), h = /* @__PURE__ */ O(null), g = /* @__PURE__ */ O(!1), _ = /* @__PURE__ */ O("icons"), v = /* @__PURE__ */ O(""), y = /* @__PURE__ */ O(mn({
		top: 0,
		left: 0
	})), b = Xs.flatMap(([e, t]) => t.map((t) => ({
		id: t,
		cat: e
	}))), x = /* @__PURE__ */ D(() => {
		let e = F(v).trim().toLowerCase();
		return e ? b.filter(({ id: t }) => {
			let n = K(Ys[t].labelKey) || Ys[t].label;
			return t.includes(e) || n.toLowerCase().includes(e);
		}) : b;
	}), S = /* @__PURE__ */ D(() => [...new Set(a().filter(Boolean))]);
	function C() {
		k(v, ""), k(ie, !1), k(_, i() && !l() ? "images" : "icons", !0);
	}
	function w(e) {
		k(g, e.newState === "open"), Oa(F(p), F(g)), F(g) && C();
	}
	function ee() {
		u && F(m)?.hidePopover(), k(g, !1);
	}
	function T() {
		C();
		let e = F(p).getBoundingClientRect();
		k(y, {
			left: Math.max(8, Math.min(e.left, window.innerWidth - 286 - 8)),
			top: e.bottom + 332 + 8 > window.innerHeight ? Math.max(8, e.top - 332 - 8) : e.bottom + 6
		}, !0), k(g, !0);
	}
	function te(e) {
		t.onpick?.({
			icon: e,
			image: ""
		});
	}
	function ne(e) {
		t.onpick?.({ image: e });
	}
	function re() {
		t.onpick?.({
			icon: "",
			image: ""
		});
	}
	let ie = /* @__PURE__ */ O(!1);
	function ae(e) {
		k(ie, !1);
		let n = e.target.files?.[0];
		e.target.value = "", n && t.onfile?.(n);
	}
	function oe() {
		k(ie, !0), F(h).click();
	}
	Pn(() => {
		if (!F(g)) return;
		let e = () => {
			F(ie) || ee();
		};
		if (window.addEventListener("blur", e), u) return () => window.removeEventListener("blur", e);
		let t = (e) => {
			F(p) && !F(p).contains(e.target) && k(g, !1);
		}, n = (e) => {
			e.key === "Escape" && k(g, !1);
		}, r = (e) => {
			F(p) && e.target instanceof Node && !F(p).contains(e.target) && k(g, !1);
		};
		return document.addEventListener("pointerdown", t, !0), document.addEventListener("keydown", n, !0), document.addEventListener("scroll", r, !0), () => {
			window.removeEventListener("blur", e), document.removeEventListener("pointerdown", t, !0), document.removeEventListener("keydown", n, !0), document.removeEventListener("scroll", r, !0);
		};
	});
	var se = xl(), ce = A(se), le = A(ce), ue = (e) => {
		var n = Xr();
		_i(j(n), () => t.children), R(e, n);
	}, de = (e) => {
		var t = gl();
		P(() => G(t, "src", i())), R(e, t);
	}, fe = (e) => {
		var t = _l();
		V(t, () => Zs(r()), !0), E(t), R(e, t);
	}, pe = (e) => {
		R(e, vl());
	};
	B(le, (e) => {
		t.children ? e(ue) : i() ? e(de, 1) : r() && Ys[r()] ? e(fe, 2) : e(pe, -1);
	}), E(ce);
	var me = N(ce, 2), he = (e) => {
		var t = yl(), r = A(t), i = (e) => {
			n(e);
		};
		B(r, (e) => {
			F(g) && e(i);
		}), E(t), Zi(t, (e) => k(m, e), () => F(m)), P(() => {
			G(t, "id", f), Ii(t, `position-anchor: ${d ?? ""}`);
		}), Br("toggle", t, w), R(e, t);
	}, ge = (e) => {
		var t = bl(), r = A(t);
		n(r), E(t), P(() => Ii(t, `top: ${F(y).top ?? ""}px; left: ${F(y).left ?? ""}px`)), R(e, t);
	};
	B(me, (e) => {
		u ? e(he) : F(g) && e(ge, 1);
	});
	var _e = N(me, 2);
	Zi(_e, (e) => k(h, e), () => F(h)), E(se), Zi(se, (e) => k(p, e), () => F(p)), P(() => {
		H(ce, 1, `mp-trigger ${c() ?? ""}`, "svelte-1y5ipgc"), G(ce, "title", o()), G(ce, "aria-label", o()), G(ce, "popovertarget", u ? f : void 0), Ii(ce, u ? `anchor-name: ${d}` : void 0);
	}), I("click", ce, function(...e) {
		(u ? void 0 : () => F(g) ? k(g, !1) : T())?.apply(this, e);
	}), I("change", _e, ae), Br("cancel", _e, () => k(ie, !1)), R(e, se), ot();
}
Vr(["click", "change"]);
//#endregion
//#region src/lib/nav-size.js
var Cl = {
	min: 0,
	max: 64,
	step: 1
}, wl = {
	min: 12,
	max: 28,
	step: 1
}, Tl = {
	min: 0,
	max: 80,
	step: 1
}, El = {
	min: 0,
	max: 64,
	step: 1
}, Dl = {
	min: 480,
	max: 1920,
	step: 20
}, Ol = {
	min: .3,
	max: .8,
	step: .05
}, kl = {
	min: 0,
	max: 400,
	step: 10
}, Al = {
	min: 0,
	max: 1200,
	step: 20
}, jl = {
	min: 0,
	max: 64,
	step: 1
}, Ml = {
	min: 180,
	max: 400,
	step: 1
}, Nl = {
	min: 12,
	max: 128,
	step: 1
}, Pl = {
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
}, Fl = [
	"sm",
	"md",
	"lg",
	"xl"
], Il = .67;
function Ll(e) {
	return e === "floating" || e === "floating-square" || e === "floating-tab";
}
function Rl(e, { min: t, max: n, step: r = 1 }, i) {
	let a = Number(e);
	if (e == null || e === "" || !Number.isFinite(a)) return i;
	let o = Math.round(a / r) * r, s = Math.min(n, Math.max(t, o));
	return r < 1 ? Math.round(s * 100) / 100 : s;
}
function zl(e, t) {
	if (e?.padY != null && e.padY !== "") return Rl(e.padY, Cl, Pl.md.padY);
	let n = Pl[e?.size] ?? Pl.md;
	return Math.round(n.padY * (Ll(t) ? Il : 1));
}
function Bl(e) {
	if (e?.textSize != null && e.textSize !== "") return Rl(e.textSize, wl, Pl.md.textSize);
	let t = Pl[e?.size] ?? Pl.md;
	return Math.round(t.textSize);
}
function Vl(e) {
	return e?.padY != null && e.padY !== "" || e?.textSize != null && e.textSize !== "" ? null : Fl.includes(e?.size) ? e.size : "md";
}
//#endregion
//#region src/lib/Choice.svelte
var Hl = /* @__PURE__ */ L("<button type=\"button\"> </button>"), Ul = /* @__PURE__ */ L("<div><span class=\"choice-label svelte-1ehof1c\"> </span> <div class=\"choice-seg svelte-1ehof1c\" role=\"group\"></div></div>");
function Wl(e, t) {
	at(t, !0);
	let n = ra(t, "title", 3, void 0), r = /* @__PURE__ */ D(() => t.options.length > 3 || t.options.reduce((e, [, t]) => e + `${t}`.length, 0) > 14), i = (e) => `${e ?? ""}`;
	var a = Ul();
	let o;
	var s = A(a), c = M(s, !0), l = N(s, 2);
	di(l, 21, () => t.options, ([e, t]) => i(e), (e, n) => {
		var r = /* @__PURE__ */ D(() => g(F(n), 2));
		let a = () => F(r)[0], o = () => F(r)[1];
		var s = Hl();
		let c;
		var l = M(s, !0);
		P((e, t) => {
			G(s, "aria-pressed", e), c = H(s, 1, "svelte-1ehof1c", null, c, { on: t }), z(l, o());
		}, [() => i(a()) === i(t.value), () => i(a()) === i(t.value)]), I("click", s, () => t.onchange(a())), R(e, s);
	}), E(l), E(a), P(() => {
		o = H(a, 1, "choice svelte-1ehof1c", null, o, { stacked: F(r) }), G(a, "title", n()), z(c, t.label), G(l, "aria-label", t.label);
	}), R(e, a), ot();
}
Vr(["click"]);
//#endregion
//#region ../template/assets/engine/0.7.6/fonts.js
var Gl = [
	["font.system", "system-ui, sans-serif"],
	["font.arial", "Arial, Helvetica, sans-serif"],
	["font.verdana", "Verdana, Geneva, sans-serif"],
	["font.trebuchet", "'Trebuchet MS', sans-serif"],
	["font.georgia", "Georgia, 'Times New Roman', serif"],
	["font.palatino", "'Palatino Linotype', Palatino, serif"],
	["font.courier", "'Courier New', monospace"]
], Kl = [
	"dots",
	"grid",
	"diagonal",
	"checks",
	"waves",
	"zigzag",
	"plus",
	"triangles"
], ql = {
	min: 8,
	max: 160,
	dflt: 28
}, Jl = .12, Yl = {
	dots: "<circle cx=\"12\" cy=\"12\" r=\"3\"/>",
	grid: "<rect width=\"24\" height=\"1.6\"/><rect width=\"1.6\" height=\"24\"/>",
	diagonal: "<path d=\"M-6 6L6 -6M0 24L24 0M18 30L30 18\" fill=\"none\" stroke=\"#000\" stroke-width=\"4\"/>",
	checks: "<rect width=\"12\" height=\"12\"/><rect x=\"12\" y=\"12\" width=\"12\" height=\"12\"/>",
	waves: "<path d=\"M0 12Q6 4 12 12T24 12\" fill=\"none\" stroke=\"#000\" stroke-width=\"2.4\"/>",
	zigzag: "<path d=\"M0 16L6 8L12 16L18 8L24 16\" fill=\"none\" stroke=\"#000\" stroke-width=\"2.4\"/>",
	plus: "<path d=\"M12 7V17M7 12H17\" fill=\"none\" stroke=\"#000\" stroke-width=\"2.4\" stroke-linecap=\"round\"/>",
	triangles: "<path d=\"M0 24L12 4L24 24Z\"/>"
};
function Xl(e) {
	return Kl.includes(e) ? e : "dots";
}
function Zl(e) {
	let t = Number(e);
	return !Number.isFinite(t) || t <= 0 ? ql.dflt : Math.min(ql.max, Math.max(ql.min, Math.round(t)));
}
function Ql(e) {
	let t = Number(e);
	return Number.isFinite(t) ? (Math.round(t) % 360 + 360) % 360 : 0;
}
function $l(e) {
	let t = Number(e);
	return e == null || e === "" || !Number.isFinite(t) ? Jl : Math.min(1, Math.max(0, t));
}
function eu(e = {}) {
	let t = Zl(e.size), n = Ql(e.rotation), r = Yl[Xl(e.pattern)], i = `<pattern id="p" width="${t}" height="${t}" patternUnits="userSpaceOnUse"${n ? ` patternTransform="rotate(${n})"` : ""}><g transform="scale(${t / 24})">${r}</g></pattern>`, a = "<rect width=\"100%\" height=\"100%\" fill=\"url(#p)\"/>";
	return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs>${i}</defs>${e.invert === !0 ? `<mask id="m"><rect width="100%" height="100%" fill="#fff"/>${a}</mask><rect width="100%" height="100%" mask="url(#m)"/>` : a}</svg>`;
}
var tu = () => typeof CSS < "u" && typeof CSS.supports == "function" && (CSS.supports("mask-image", "none") || CSS.supports("-webkit-mask-image", "none")), nu = {
	version: 1,
	label: "Pattern",
	labelKey: "bgLayer.pattern",
	defaults: () => ({
		pattern: "dots",
		color: "text",
		size: ql.dflt,
		opacity: Jl,
		rotation: 0,
		invert: !1
	}),
	migrations: {},
	render(e, t) {
		if (!tu()) return;
		let n = `url("data:image/svg+xml,${encodeURIComponent(eu(t))}")`;
		e.style.backgroundColor = Ns(t.color ?? "text"), e.style.opacity = String($l(t.opacity));
		for (let t of ["webkitMask", "mask"]) e.style[`${t}Image`] = n, e.style[`${t}Size`] = "100% 100%", e.style[`${t}Repeat`] = "no-repeat";
	}
}, ru = [
	"grid",
	"carousel",
	"slides",
	"ribbon",
	"mosaic",
	"polaroid"
], iu = [
	"grid",
	"mosaic",
	"polaroid"
], au = {
	min: 80,
	max: 400,
	dflt: 140
}, ou = {
	min: 0,
	max: 15,
	dflt: 4
};
function su(e) {
	return ru.includes(e) ? e : "grid";
}
function cu(e, t, n) {
	return !Number.isFinite(n) || n < 1 ? 0 : (((Number.isFinite(e) ? e : 0) + t) % n + n) % n;
}
function lu({ count: e = 0, reducedMotion: t = !1 } = {}) {
	return e >= 2 && !t;
}
function uu(e, { min: t = 2, fallback: n = 5 } = {}) {
	let r = Number(e);
	return !Number.isFinite(r) || r <= 0 ? n : Math.max(t, r);
}
//#endregion
//#region ../template/assets/engine/0.7.6/backgrounds/image.js
var du = .4, fu = [
	"none",
	"kenburns",
	"drift"
], pu = {
	min: 6,
	max: 60,
	dflt: 20
};
function mu(e) {
	return fu.includes(e) ? e : "none";
}
function hu(e) {
	let { min: t, max: n, dflt: r } = pu, i = Number(e);
	return !Number.isFinite(i) || i <= 0 ? r : Math.min(n, Math.max(t, i));
}
function gu(e, t) {
	return `${(e ?? .5) * 100}% ${(t ?? .5) * 100}%`;
}
function _u(e, t) {
	return e === "contain" ? "contain" : e === "cover" ? "cover" : `${Math.max(0, t ?? 1) * 100}%`;
}
function vu(e) {
	let t = "-9999px";
	return e === "up" ? `inset(${t} 0 0 0)` : e === "down" ? `inset(0 0 ${t} 0)` : e === "both" ? `inset(${t} 0 ${t} 0)` : "inset(0)";
}
function yu(e, t, n, r = .18) {
	let i = Math.max(0, Math.min(1, n)) * du * t;
	return Math.round(Math.min(i, r * e));
}
function bu(e, t, n, r, i) {
	let a = e + t / 2, o = (n / 2 - a) * Math.max(0, Math.min(1, r)) * du, s = i ?? yu(t, n, r);
	return Math.max(-s, Math.min(s, o)) || 0;
}
var xu = /* @__PURE__ */ new Set(), Su = !1, Cu = 0;
function wu() {
	Cu = 0;
	for (let e of [...xu]) e() || xu.delete(e);
}
function Tu() {
	Cu ||= requestAnimationFrame(wu);
}
function Eu(e) {
	xu.add(e), e(), !(Su || typeof window > "u") && (Su = !0, window.addEventListener("scroll", Tu, { passive: !0 }), window.addEventListener("resize", Tu, { passive: !0 }));
}
function Du(e, t, n, r) {
	let i = r === "cover" || r === "tile" || r === "repeat", a = e.closest(".urd-section") ?? e.parentElement?.closest(".urd-section") ?? e.parentElement, o = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
	e.style.willChange = "transform";
	let s = (t) => {
		e.style.top = `-${t}px`, e.style.bottom = `-${t}px`;
	}, c = () => {
		if (!e.isConnected) return !1;
		if (o || document.body.classList.contains("urd-mobile")) return s(n), e.style.transform = "", !0;
		let r = (a ?? e).getBoundingClientRect(), c = window.innerHeight || document.documentElement.clientHeight, l = yu(r.height, c, t, i ? .18 : .6);
		s(i ? Math.max(n, l) : n);
		let u = bu(r.top, r.height, c, t, l);
		return e.style.transform = `translateY(${u.toFixed(1)}px)`, !0;
	};
	Eu(c), typeof requestAnimationFrame == "function" && requestAnimationFrame(() => requestAnimationFrame(c));
}
function Ou() {
	return typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("animation-timeline", "view()");
}
var ku = /* @__PURE__ */ new Set(), Au = !1, ju = 0;
function Mu() {
	ju = 0;
	for (let e of [...ku]) e() || ku.delete(e);
}
function Nu() {
	!ju && typeof requestAnimationFrame == "function" && (ju = requestAnimationFrame(Mu));
}
function Pu(e) {
	ku.add(e), e(), !(Au || typeof window > "u") && (Au = !0, window.addEventListener("resize", Nu, { passive: !0 }));
}
function Fu(e, t, n, r) {
	let i = r === "cover" || r === "tile" || r === "repeat", a = e.closest(".urd-section") ?? e.parentElement?.closest(".urd-section") ?? e.parentElement;
	e.style.willChange = "transform", e.classList.add("urd-parallax-css");
	let o = () => {
		if (!e.isConnected) return !1;
		let r = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || document.body.classList.contains("urd-mobile"), o = (a ?? e).getBoundingClientRect(), s = window.innerHeight || document.documentElement.clientHeight, c = yu(o.height, s, t, i ? .18 : .6), l = i && !r ? Math.max(n, c) : n;
		return e.style.setProperty("--urd-px-shift", `${c}px`), e.style.top = `-${l}px`, e.style.bottom = `-${l}px`, !0;
	};
	Pu(o), typeof requestAnimationFrame == "function" && requestAnimationFrame(() => requestAnimationFrame(o));
}
var Iu = {
	version: 3,
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
		bleed: "none",
		motion: "none",
		motionSpeed: pu.dflt
	}),
	migrations: {
		1: (e) => ({
			...e,
			fit: e.fit === "vanlig" ? "plain" : e.fit === "flislegg" ? "tile" : e.fit === "egen" ? "custom" : e.fit
		}),
		2: (e) => ({
			motion: "none",
			motionSpeed: pu.dflt,
			...e
		})
	},
	render(e, t) {
		let n = !Bs(t.src);
		n && e.classList.add("urd-bg-demo");
		let r = n ? ro(0) : t.src;
		e.style.opacity = String(t.opacity ?? 1), e.style.clipPath = vu(t.bleed), e.style.zIndex = t.bleed === "down" || t.bleed === "both" ? "1" : "";
		let i = document.createElement("div");
		i.className = "urd-bg-image", i.style.position = "absolute", i.style.left = "0", i.style.right = "0", i.style.top = "0", i.style.bottom = "0";
		let a = mu(t.motion), o = a === "none" ? i : document.createElement("div");
		o !== i && (o.className = `urd-bg-motion urd-bg-motion-${a}`, o.style.position = "absolute", o.style.left = "0", o.style.right = "0", o.style.top = "0", o.style.bottom = "0", o.style.animationDuration = `${hu(t.motionSpeed)}s`, i.appendChild(o));
		let s = t.fit === "tile" || t.fit === "repeat";
		o.style.backgroundImage = `url("${r}")`, o.style.backgroundSize = _u(t.fit, t.size), o.style.backgroundRepeat = s ? "repeat" : "no-repeat", o.style.backgroundPosition = gu(t.x, t.y);
		let c = 0;
		t.blur > 0 && (o.style.filter = `blur(${t.blur}px)`, c = Math.ceil(t.blur), o.style.left = `-${c}px`, o.style.right = `-${c}px`, o.style.top = `-${c}px`, o.style.bottom = `-${c}px`);
		let l = new Image();
		if (l.src = r, !l.complete) {
			e.style.visibility = "hidden";
			let t = () => {
				e.style.visibility = "";
			};
			l.addEventListener("load", t, { once: !0 }), l.addEventListener("error", t, { once: !0 });
		}
		e.appendChild(i), t.parallax > 0 && Lu(i, t.parallax, o === i ? c : 0, t.fit ?? "cover");
	}
};
function Lu(e, t, n, r) {
	Ou() ? Fu(e, t, n, r) : Du(e, t, n, r);
}
//#endregion
//#region ../template/assets/engine/0.7.6/photo-source.js
var Ru = [
	"drive",
	"gphotos",
	"nextcloud",
	"json"
], zu = {
	min: 1,
	max: 60,
	dflt: 24
}, Bu = [
	"name",
	"newest",
	"random"
], Vu = [
	480,
	800,
	1200,
	1600,
	2e3
], Hu = /^[A-Za-z0-9_-]{10,128}$/, Uu = /^(?!\d+(?:\.\d+)*$)[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/;
function Wu(e) {
	let t = Number(e);
	return !Number.isFinite(t) || t <= 0 ? zu.dflt : Math.min(zu.max, Math.max(zu.min, Math.round(t)));
}
function Gu(e) {
	let t = typeof e == "string" ? e.trim() : "";
	if (!t) return null;
	if (Hu.test(t) && !t.includes(".")) return {
		provider: "drive",
		id: t
	};
	let n;
	try {
		n = new URL(t);
	} catch {
		return null;
	}
	if (n.protocol !== "https:" || n.username || n.password || n.port) return null;
	let r = n.hostname.toLowerCase();
	if (r === "drive.google.com") {
		let e = /^\/drive\/(?:u\/\d+\/)?folders\/([A-Za-z0-9_-]{10,128})\/?$/.exec(n.pathname);
		if (e) return {
			provider: "drive",
			id: e[1]
		};
		let t = n.searchParams.get("id") ?? "";
		return Hu.test(t) ? {
			provider: "drive",
			id: t
		} : null;
	}
	if (r === "photos.google.com") {
		let e = /^\/share\/([A-Za-z0-9_-]{10,256})\/?$/.exec(n.pathname), t = n.searchParams.get("key") ?? "";
		return e ? {
			provider: "gphotos",
			id: e[1],
			...Hu.test(t) ? { host: t } : {}
		} : null;
	}
	if (r === "photos.app.goo.gl") {
		let e = /^\/([A-Za-z0-9_-]{6,128})\/?$/.exec(n.pathname);
		return e ? {
			provider: "gphotos",
			id: `s:${e[1]}`
		} : null;
	}
	let i = /^(?:\/index\.php)?\/s\/([A-Za-z0-9]{8,64})\/?$/.exec(n.pathname);
	return i && Uu.test(r) ? {
		provider: "nextcloud",
		id: i[1],
		host: r
	} : /\.json$/i.test(n.pathname) && Uu.test(r) ? {
		provider: "json",
		url: n.href
	} : null;
}
function Ku(e) {
	return Bu.includes(e) ? e : "name";
}
var qu = (e) => Ku(e) === "newest" ? "newest" : "name";
function Ju(e, t) {
	if (!e || !Ru.includes(e.provider)) return null;
	let n = new URLSearchParams({
		p: e.provider,
		sort: qu(t),
		max: "200"
	});
	return e.id && n.set("id", e.id), e.host && n.set("host", e.host), e.url && n.set("url", e.url), `/api/photos?${n.toString()}`;
}
function Yu(e, t = 200) {
	return (Array.isArray(e?.photos) ? e.photos : []).filter((e) => typeof e?.src == "string" && e.src.startsWith("/api/photo?")).slice(0, Math.max(1, Math.min(200, Number(t) || 200))).map((e) => ({
		src: e.src,
		name: typeof e.name == "string" ? e.name : ""
	}));
}
function Xu(e) {
	let t = e >>> 0;
	return () => {
		t = t + 1831565813 >>> 0;
		let e = t;
		return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
function Zu(e, t) {
	let n = [...e], r = Xu(Number(t) || 0);
	for (let e = n.length - 1; e > 0; e--) {
		let t = Math.floor(r() * (e + 1));
		[n[e], n[t]] = [n[t], n[e]];
	}
	return n;
}
function Qu(e, t, n) {
	return Ku(t) === "random" ? Zu(e, n) : [...e];
}
var $u = 0;
function ed() {
	return $u ||= typeof crypto < "u" && crypto.getRandomValues ? crypto.getRandomValues(/* @__PURE__ */ new Uint32Array(1))[0] || 1 : Date.now() >>> 0 || 1, $u;
}
function td(e, t = 1) {
	let n = (Number(e) || 0) * Math.min(3, Math.max(1, Number(t) || 1));
	return Vu.find((e) => e >= n) ?? Vu[Vu.length - 1];
}
function nd(e, t) {
	if (typeof e != "string" || !e.startsWith("/api/photo?")) return e;
	let n = new URLSearchParams(e.slice(11));
	return n.set("w", String(t)), `/api/photo?${n.toString()}`;
}
var rd = 6e5, id = 3e4, ad = /* @__PURE__ */ new Map(), od = /* @__PURE__ */ new Map();
function sd(e) {
	return e?.source === "folder" && typeof e.folder == "string" ? e.folder.trim() : "";
}
function cd(e, t) {
	let n = Ju(Gu(e), t);
	return n ? ld(ad.get(n)) : null;
}
function ld(e) {
	if (!e) return null;
	let t = e.value.photos.length ? rd : id;
	return Date.now() - e.at < t ? e.value : null;
}
function ud(e, t, { force: n = !1 } = {}) {
	let r = Ju(Gu(e), t);
	if (!r) return Promise.resolve({
		photos: [],
		error: "badAddress",
		code: "photoFolderUnknown"
	});
	if (!n) {
		let e = ld(ad.get(r));
		if (e) return Promise.resolve(e);
		if (od.has(r)) return od.get(r);
	}
	let i = (async () => {
		let e;
		try {
			let t = await fetch(r), n = await t.json().catch(() => null);
			e = t.ok ? {
				photos: Yu(n),
				error: null,
				code: null
			} : {
				photos: [],
				error: n?.error ?? `status ${t.status}`,
				code: n?.code ?? "photoFolderFailed",
				host: n?.host ?? "",
				status: n?.status ?? t.status
			};
		} catch {
			e = {
				photos: [],
				error: "unreachable",
				code: "photoFolderFailed"
			};
		}
		return ad.set(r, {
			at: Date.now(),
			value: e
		}), od.delete(r), e;
	})();
	return od.set(r, i), i;
}
function dd(e) {
	let t = sd(e), n = t ? cd(t, e.order) : null;
	return n?.photos.length ? Qu(n.photos, e.order, ed()).slice(0, Wu(e.folderMax)) : e.images ?? [];
}
function fd(e, t, n) {
	let r = sd(t);
	r && !cd(r, t.order) && ud(r, t.order).then((r) => {
		e.isConnected && r.photos.length && (e.textContent = "", e.removeAttribute("style"), e.className = "urd-bg-layer", n(e, t));
	}), n(e, t);
}
//#endregion
//#region ../template/assets/engine/0.7.6/backgrounds/slideshow.js
var pd = {
	source: "upload",
	folder: "",
	order: "random",
	folderMax: zu.dflt,
	style: "floating",
	motion: "drift",
	motionSpeed: Qa.dflt,
	interval: $a.dflt,
	fade: 1.5,
	count: Wa.dflt,
	seed: 0,
	size: null,
	spread: Ya.dflt,
	tilt: Xa.dflt,
	radius: Za.dflt,
	rows: 2,
	direction: "left",
	underNav: !0,
	underAnnounce: !1,
	repeat: !1,
	shape: "rect",
	look: "shadow",
	tone: "natural",
	frameColor: ""
}, md = {
	version: 2,
	label: "Image gallery",
	labelKey: "bgLayer.slideshow",
	defaults: () => ({
		images: [],
		fit: "cover",
		opacity: .85,
		blur: 0,
		...pd
	}),
	migrations: { 1: (e) => ({
		...pd,
		style: "fill",
		motion: "none",
		interval: 6,
		opacity: 1,
		...e
	}) },
	render(e, t) {
		fd(e, t, gd);
	}
}, hd = (e, t) => {
	let n = document.createElement(e);
	return n.className = t, n;
};
function gd(e, t) {
	let n = so(t.style), r = dd(t).filter((e) => Bs(e?.src)), i = go(t.shape), a = _o(t.look);
	e.classList.add("urd-bg-slideshow", `urd-gallery-${n}`, `urd-gallery-tone-${vo(t.tone)}`), n !== "fill" && e.classList.add(`urd-gallery-shape-${i}`, `urd-gallery-look-${a}`), e.style.setProperty("--urd-frame-radius", `${wo(t.radius)}px`), r.length || e.classList.add("urd-bg-demo"), e.style.opacity = String(t.opacity ?? .85);
	let o = ho(a, t.frameColor);
	o && e.style.setProperty("--urd-frame-color", Ns(o));
	let s = t.underNav === !1 ? ["var(--urd-announce-h, 0px)", "var(--urd-nav-own-h, 0px)"] : t.underAnnounce === !0 ? [] : ["var(--urd-announce-h, 0px)"], c = s.length ? `calc(${s.join(" + ")})` : "", l = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? !1, u = co(n, t.motion), d = {
		el: e,
		props: t,
		style: n,
		images: r,
		motion: u,
		shape: i,
		look: a,
		aspect: yo(i, a),
		moves: uo({
			style: n,
			motion: u,
			reducedMotion: l
		}),
		reduced: l,
		seed: Do(t.seed, ed()),
		time: To(t.motionSpeed),
		dwell: xo(t.interval),
		dpr: window.devicePixelRatio || 1
	};
	Dd[n](d), c && (e.style.top = n === "fill" && t.blur > 0 ? `calc(${c} - ${t.blur * 2}px)` : c);
}
function _d(e, t, n, r, i) {
	let a = t[n];
	e.style.backgroundImage = `url("${a ? nd(a.src, r) : ro(i)}")`, e.style.backgroundPosition = a ? gu(a.x, a.y) : "";
}
function vd({ el: e, props: t, images: n, motion: r, reduced: i, dpr: a, dwell: o }) {
	let s = !n.length, c = s ? io(3) : n, l = td(window.innerWidth, a);
	t.blur > 0 && (e.style.filter = `blur(${t.blur}px)`, e.style.inset = `-${t.blur * 2}px`);
	let u = Math.max(0, Number(t.fade) || 0);
	e.style.setProperty("--urd-bgg-fade", `${u}s`);
	let d = mu(r === "drift" ? "drift" : r === "kenburns" ? "kenburns" : "none"), f = (e) => {
		let n = hd("div", e ? "urd-bg-slide on" : "urd-bg-slide");
		return d !== "none" && (n.classList.add("urd-bg-motion", `urd-bg-motion-${d}`), n.style.animationDuration = `${hu(t.motionSpeed)}s`), n;
	}, p = (e, n) => {
		e.style.backgroundImage = `url("${s ? n.src : nd(n.src, l)}")`, e.style.backgroundSize = s ? "240px auto" : _u(t.fit), e.style.backgroundRepeat = s ? "repeat" : "no-repeat", e.style.backgroundPosition = s ? "" : gu(n.x, n.y);
	}, m = new Image();
	if (m.src = s ? c[0].src : nd(c[0].src, l), !m.complete) {
		e.style.visibility = "hidden";
		let t = () => {
			e.style.visibility = "";
		};
		m.addEventListener("load", t, { once: !0 }), m.addEventListener("error", t, { once: !0 });
	}
	let h = f(!0);
	if (p(h, c[0]), e.appendChild(h), !lu({
		count: c.length,
		reducedMotion: i
	})) return;
	let g = f(!1);
	e.appendChild(g);
	let _ = 0, v = h, y = Math.max(uu(o, { fallback: $a.dflt }), u + .5) * 1e3, b = setInterval(() => {
		if (!h.isConnected) {
			clearInterval(b);
			return;
		}
		if (document.hidden) return;
		let e = cu(_, 1, c.length), t = new Image();
		t.src = s ? c[e].src : nd(c[e].src, l);
		let n = () => {
			if (!h.isConnected) return;
			let t = v === h ? g : h;
			p(t, c[e]), t.classList.add("on"), v.classList.remove("on"), v = t, _ = e;
		};
		t.complete ? n() : (t.addEventListener("load", n, { once: !0 }), t.addEventListener("error", () => {
			_ = e;
		}, { once: !0 }));
	}, y);
}
function yd(e, t, n, r, i) {
	let a = hd("div", "urd-gallery-skin"), o = hd("div", "urd-gallery-face");
	return _d(o, t, n, r, i), a.appendChild(o), e.appendChild(a), {
		skin: a,
		face: o
	};
}
function bd(e, t) {
	let { x: n, y: r, heading: i } = e;
	if (t === "rise") return {
		tx0: "0px",
		ty0: `calc(${100 - r}cqh + 60%)`,
		tx1: "0px",
		ty1: `calc(${-r}cqh - 60%)`
	};
	let a = i < .5, o = i * 2 % 1 < .5, s = `calc(${-n}cqw - 60%)`, c = `calc(${100 - n}cqw + 60%)`, l = `calc(${-r}cqh - 60%)`, u = `calc(${100 - r}cqh + 60%)`;
	return {
		tx0: a ? s : c,
		tx1: a ? c : s,
		ty0: o ? l : u,
		ty1: o ? u : l
	};
}
function xd({ frame: e, skin: t, face: n }, r, i, a) {
	let { motion: o, moves: s, time: c } = a;
	if (!s) return;
	let l = `-${(r.phase * c).toFixed(2)}s`;
	if (o === "drift" || o === "rise") {
		e.classList.add("urd-gallery-travel");
		let t = bd(r, o);
		e.style.setProperty("--tx0", t.tx0), e.style.setProperty("--ty0", t.ty0), e.style.setProperty("--tx1", t.tx1), e.style.setProperty("--ty1", t.ty1), e.style.animationDuration = `${c}s`, e.style.animationDelay = l;
	} else if (o === "kenburns") e.classList.add("urd-gallery-kenburns"), e.style.animationDuration = `${c}s`, e.style.animationDelay = l;
	else if (o === "bounce") {
		e.style.left = "0", e.style.top = "0", e.style.translate = "0 0", e.classList.add("urd-gallery-bounce-x"), t.classList.add("urd-gallery-bounce-y");
		let n = c * (.8 + r.heading * .4), i = c * (.5 + r.phase * .35);
		e.style.animationDuration = `${n.toFixed(2)}s`, e.style.animationDelay = `-${(r.phase * n).toFixed(2)}s`, t.style.animationDuration = `${i.toFixed(2)}s`, t.style.animationDelay = `-${(r.heading * i).toFixed(2)}s`;
	}
}
function Sd(e, t, n) {
	let { images: r, moves: i, dwell: a, motion: o } = t;
	if (o !== "crossfade" || !i) return;
	let s = e.length, c = e.map((e) => e.index), l = r.map((e, t) => c.includes(t) ? 0 : -1), u = 0, d = (e) => {
		if (r.length < 2) return -1;
		let t = (e) => l[e], n = r.map((e, t) => t).filter((e) => !c.includes(e)), i = n.length ? n : r.map((e, t) => t).filter((t) => t !== c[e]);
		return i.reduce((e, n) => t(n) < t(e) ? n : e, i[0]);
	}, f = 0;
	e.forEach((t, i) => {
		t.frame.classList.add("urd-gallery-fade"), t.frame.style.animationDuration = `${a}s`;
		let o = (i / s + t.phase * .3) % 1;
		t.frame.style.animationDelay = `-${(o * a).toFixed(2)}s`, t.frame.addEventListener("animationiteration", () => {
			if (!t.frame.isConnected) return;
			let a = d(i);
			a >= 0 && (_d(t.face, r, a, t.width, i), c[i] = a, l[a] = ++u), n && (f += 1, Cd(t, n(i, f, e.filter((e) => e !== t))));
		});
	});
}
function Cd(e, t) {
	let n = t.w / 2 * 1.15, r = t.w / e.aspect / 2 * 1.15;
	e.frame.style.left = `clamp(${n.toFixed(1)}px, ${t.x}%, calc(100% - ${n.toFixed(1)}px))`, e.frame.style.top = `clamp(${r.toFixed(1)}px, ${t.y}%, calc(100% - ${r.toFixed(1)}px))`, e.frame.style.width = `${t.w}px`, e.frame.style.rotate = `${t.rot}deg`, e.x = t.x, e.y = t.y;
}
function wd(e) {
	let { el: t, props: n, style: r, images: i, seed: a, aspect: o, dpr: s } = e, c = {
		count: n.count,
		seed: a,
		size: n.size,
		spread: n.spread,
		tilt: n.tilt,
		style: r,
		repeat: n.repeat === !0
	};
	Sd(Oo(i, c).map((n, r) => {
		let a = hd("div", "urd-gallery-box urd-gallery-frame" + (n.index < 0 ? " urd-gallery-frame-empty" : ""));
		a.style.aspectRatio = String(o);
		let c = td(n.w, s), { skin: l, face: u } = yd(a, i, n.index, c, r);
		t.appendChild(a);
		let d = {
			frame: a,
			skin: l,
			face: u,
			width: c,
			aspect: o,
			index: n.index,
			phase: n.phase
		};
		return Cd(d, n), xd(d, n, r, e), d;
	}), e, (e, t, n) => {
		let r = null, o = -1;
		for (let s = 0; s < 6; s += 1) {
			let l = Oo(i, {
				...c,
				seed: `${a}:${t * 6 + s}`
			})[e], u = Math.min(999, ...n.map((e) => Math.hypot(e.x - l.x, e.y - l.y)));
			u > o && (o = u, r = l);
		}
		return r;
	});
}
function Td(e) {
	let { el: t, props: n, images: r, moves: i, time: a, aspect: o, dpr: s } = e, c = Eo(n.rows), l = po(n.size, "band");
	t.style.setProperty("--urd-band-h", `${l}px`);
	let u = r.length || 8, d = td(l * o, s);
	for (let e = 0; e < c; e += 1) {
		let s = hd("div", "urd-gallery-band-row");
		i || s.classList.add("urd-ribbon-still");
		let c = hd("div", "urd-ribbon-track");
		n.direction === "right" != (e === 1) && c.classList.add("urd-ribbon-right"), c.style.setProperty("--urd-ribbon-ms", `${a * 1e3}ms`), e === 1 && (c.style.animationDelay = `-${(a / 3).toFixed(1)}s`);
		let l = (e) => {
			for (let t = 0; t < u; t += 1) {
				let n = hd("div", "urd-gallery-box urd-gallery-band-tile" + (r.length ? "" : " urd-gallery-frame-empty"));
				n.style.aspectRatio = String(o), yd(n, r, r.length ? t : -1, d, t), e.appendChild(n);
			}
		}, f = hd("div", "urd-ribbon-run");
		l(f);
		let p = hd("div", "urd-ribbon-run");
		p.setAttribute("aria-hidden", "true"), l(p), c.append(f, p), s.appendChild(c), t.appendChild(s);
	}
}
function Ed(e) {
	let { el: t, props: n, images: r, seed: i, dpr: a, motion: o, moves: s, time: c } = e, l = jo(n.count, i, r.length, n.repeat === !0);
	t.style.setProperty("--urd-mosaic-row", `${po(n.size, "mosaic")}px`);
	let u = td(po(n.size, "mosaic") * 2.2, a);
	Sd(l.map((e, n) => {
		let i = hd("div", "urd-gallery-box urd-gallery-tile" + (r.length ? "" : " urd-gallery-frame-empty"));
		i.style.gridColumn = `span ${e.cols}`, i.style.gridRow = `span ${e.rows}`;
		let a = r.length ? n % r.length : -1, { face: l } = yd(i, r, a, u, n);
		return t.appendChild(i), s && o === "kenburns" && (l.classList.add("urd-gallery-kenburns"), l.style.animationDuration = `${c}s`, l.style.animationDelay = `-${(e.phase * c).toFixed(2)}s`), {
			frame: i,
			skin: i,
			face: l,
			width: u,
			index: a,
			phase: e.phase
		};
	}), e);
}
var Dd = {
	fill: vd,
	floating: wd,
	band: Td,
	mosaic: Ed
}, Od = /* @__PURE__ */ L("<span class=\"toolbar-row\"><img class=\"site-icon-preview\" alt=\"\"/> <span class=\"row-tools\"><button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button></span></span> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\"/> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\"/>", 1), kd = /* @__PURE__ */ L("<label class=\"ghost filepick\"> <input type=\"file\" accept=\"image/*\" multiple=\"\"/></label> <!>", 1), Ad = /* @__PURE__ */ L("<p> </p>"), jd = /* @__PURE__ */ L("<label> <input type=\"text\" placeholder=\"https://drive.google.com/drive/folders/...\"/></label> <label> <!></label> <label> <input type=\"number\" min=\"1\" max=\"60\"/></label> <button type=\"button\" class=\"ghost action\"><!> </button> <!>", 1), Md = /* @__PURE__ */ L("<label> <!></label> <!>", 1), Nd = /* @__PURE__ */ L("<label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"6\" max=\"60\" step=\"1\"/>", 1), Pd = /* @__PURE__ */ L("<label> <!></label> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\"/>", 1), Fd = /* @__PURE__ */ L("<button class=\"ghost row-tool\"></button>"), Id = /* @__PURE__ */ L("<span><span class=\"grad-grip\"><svg viewBox=\"0 0 16 16\" width=\"14\" height=\"14\" fill=\"currentColor\" aria-hidden=\"true\"><circle cx=\"5\" cy=\"3\" r=\"1.4\"></circle><circle cx=\"11\" cy=\"3\" r=\"1.4\"></circle><circle cx=\"5\" cy=\"8\" r=\"1.4\"></circle><circle cx=\"11\" cy=\"8\" r=\"1.4\"></circle><circle cx=\"5\" cy=\"13\" r=\"1.4\"></circle><circle cx=\"11\" cy=\"13\" r=\"1.4\"></circle></svg></span> <!> <input type=\"range\" class=\"tb-grow\" min=\"0\" max=\"100\" step=\"1\"/> <span class=\"gridmenu-value\"> </span> <!></span>"), Ld = /* @__PURE__ */ L("<label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\"/> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\"/>", 1), Rd = /* @__PURE__ */ L("<label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0\" max=\"360\" step=\"5\"/>", 1), zd = /* @__PURE__ */ L("<label> <!></label> <!> <button class=\"ghost action\"> </button> <!> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\"/> <label> <!></label>", 1), Bd = /* @__PURE__ */ L("<label> <!></label> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\"/> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\"/> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0.1\" max=\"1\" step=\"0.01\"/> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\"/>", 1), Vd = /* @__PURE__ */ L("<label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\"/>", 1), Hd = /* @__PURE__ */ L("<label> <!></label> <label> <!></label> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" step=\"2\"/> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\"/> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0\" max=\"180\" step=\"5\"/> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label>", 1), Ud = /* @__PURE__ */ L("<div class=\"sizefill\"><button type=\"button\" class=\"ghost\"> </button> <button type=\"button\" class=\"ghost\"> </button></div> <label> </label> <div class=\"focalpad\"><span class=\"focaldot\"></span></div> <label class=\"sub\"> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"-0.5\" max=\"1.5\" step=\"0.01\"/> <label class=\"sub\"> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"-0.5\" max=\"1.5\" step=\"0.01\"/>", 1), Wd = /* @__PURE__ */ L("<label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0.1\" max=\"1\" step=\"0.01\"/> <label> <!></label>", 1), Gd = /* @__PURE__ */ L("<label class=\"ghost filepick\"> <input type=\"file\" accept=\"image/*\"/></label> <label> <!></label> <label> </label> <div class=\"sizestep\"><button type=\"button\">−</button> <input type=\"number\" min=\"10\" max=\"400\"/> <span class=\"sizeunit\">%</span> <button type=\"button\">+</button></div> <!> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0\" max=\"20\" step=\"1\"/> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\"/> <!> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!>", 1), Kd = /* @__PURE__ */ L("<label> <!></label> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0.5\" max=\"90\" step=\"0.5\"/> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0\" max=\"5\" step=\"0.1\"/> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0\" max=\"20\" step=\"1\"/>", 1), qd = /* @__PURE__ */ L("<label> <!></label> <label> <!></label>", 1), Jd = /* @__PURE__ */ L("<button type=\"button\" class=\"ghost action\"><!> </button>"), Yd = /* @__PURE__ */ L("<label> <input type=\"number\" max=\"20\"/></label> <label> <!></label> <label> <!></label> <!>", 1), Xd = /* @__PURE__ */ L("<label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\"/> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0\" max=\"15\" step=\"1\"/>", 1), Zd = /* @__PURE__ */ L("<label> <!></label>"), Qd = /* @__PURE__ */ L("<label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0\" max=\"48\" step=\"1\"/>", 1), $d = /* @__PURE__ */ L("<!> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"60\" max=\"400\" step=\"2\"/> <!> <label> <!></label> <label> <!></label> <!> <!>", 1), ef = /* @__PURE__ */ L("<label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0.5\" max=\"90\" step=\"0.5\"/>", 1), tf = /* @__PURE__ */ L("<label><input type=\"checkbox\"/> </label>"), nf = /* @__PURE__ */ L("<!> <!> <label> <!></label> <!> <label> <!></label> <!> <!> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\"/>", 1), rf = /* @__PURE__ */ L("<label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0.1\" max=\"1\" step=\"0.01\"/>", 1), af = /* @__PURE__ */ L("<label class=\"ghost filepick\"> <input type=\"file\" accept=\"video/mp4,video/webm\"/></label> <label class=\"ghost filepick\"> <input type=\"file\" accept=\"image/*\"/></label> <label> <!></label> <label class=\"sub\"> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\"/> <label class=\"sub\"> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\"/> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\"/> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!>", 1), of = /* @__PURE__ */ L("<div class=\"bg-layer\"><span class=\"nav-line\"><!> <span class=\"row-tools\"><button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button></span></span> <!></div>"), sf = /* @__PURE__ */ L("<!> <label> <!></label> <button class=\"ghost action\"> </button>", 1);
function cf(e, t) {
	at(t, !0);
	let n = (e, t = f, n = f, r = f) => {
		var i = Xr(), a = j(i), o = (e) => {
			var i = kd(), a = j(i), o = A(a), s = N(o);
			E(a), di(N(a, 2), 17, () => r().props.images ?? [], si, (e, i, a) => {
				var o = Od(), s = j(o), c = A(s), l = N(c, 2), u = A(l);
				u.disabled = a === 0, V(u, () => q.up, !0), E(u);
				var d = N(u, 2);
				V(d, () => q.down, !0), E(d);
				var f = N(d, 2);
				V(f, () => q.cross, !0), E(f), E(l), E(s);
				var p = N(s, 2), m = A(p), h = M(N(m));
				E(p);
				var g = N(p, 2);
				U(g);
				var _ = N(g, 2), v = A(_), y = M(N(v));
				E(_);
				var b = N(_, 2);
				U(b), P((e, t, n, o, s) => {
					G(c, "src", F(i).src), d.disabled = a === r().props.images.length - 1, G(f, "title", e), z(m, `${t ?? ""} `), z(h, `${n ?? ""}%`), W(g, F(i).x ?? .5), z(v, `${o ?? ""} `), z(y, `${s ?? ""}%`), W(b, F(i).y ?? .5);
				}, [
					() => K("tip.removeImage"),
					() => K("lbl.focusX"),
					() => Math.round((F(i).x ?? .5) * 100),
					() => K("lbl.focusY"),
					() => Math.round((F(i).y ?? .5) * 100)
				]), I("click", u, () => Te(t(), n(), a, -1)), I("click", d, () => Te(t(), n(), a, 1)), I("click", f, () => Ee(t(), n(), a)), I("input", g, (e) => De(t(), n(), a, "x", Number(e.target.value))), I("input", b, (e) => De(t(), n(), a, "y", Number(e.target.value))), R(e, o);
			}), P((e, t) => {
				G(a, "title", e), z(o, `${t ?? ""} `);
			}, [() => K("tip.bg.addImages"), () => K("ui.addImages")]), I("change", s, (e) => we(t(), n(), e)), R(e, i);
		};
		B(a, (e) => {
			(r().props.source ?? "upload") !== "folder" && e(o);
		}), R(e, i);
	}, r = (e, t = f, n = f, r = f) => {
		let i = /* @__PURE__ */ D(() => Oe(r()));
		var a = Md(), o = j(a), s = A(o), c = N(s);
		{
			let e = /* @__PURE__ */ D(() => F(i).source ?? "upload"), r = /* @__PURE__ */ D(() => [["upload", K("opt.photoSource.upload")], ["folder", K("opt.photoSource.folder")]]);
			J(c, {
				get value() {
					return F(e);
				},
				get options() {
					return F(r);
				},
				onchange: (e) => T(t(), n(), "source", e)
			});
		}
		E(o);
		var l = N(o, 2), u = (e) => {
			let a = /* @__PURE__ */ D(() => Gu(F(i).folder ?? "")), o = /* @__PURE__ */ D(() => !F(a) || F(a).provider === "drive" || F(a).provider === "nextcloud");
			var s = jd(), c = j(s), l = A(c), u = N(l);
			U(u);
			let d;
			E(c);
			var f = N(c, 2), p = A(f), m = N(p);
			{
				let e = /* @__PURE__ */ D(() => F(o) || F(i).order === "random" ? F(i).order ?? "name" : "name"), r = /* @__PURE__ */ D(() => F(o) ? [
					["name", K("opt.folderOrder.name")],
					["newest", K("opt.folderOrder.newest")],
					["random", K("opt.folderOrder.random")]
				] : [["name", K("opt.folderOrder.listed")], ["random", K("opt.folderOrder.random")]]);
				J(m, {
					get value() {
						return F(e);
					},
					get options() {
						return F(r);
					},
					onchange: (e) => T(t(), n(), "order", e)
				});
			}
			E(f);
			var h = N(f, 2), g = A(h), _ = N(g);
			U(_), E(h);
			var v = N(h, 2), y = A(v);
			V(y, () => q.eye);
			var b = N(y);
			E(v);
			var x = N(v, 2), S = (e) => {
				var r = Ad();
				let i;
				var a = M(r, !0);
				P((e, t) => {
					i = H(r, 1, "folder-status", null, i, { err: e }), z(a, t);
				}, [() => xe[Se(t(), n())].err, () => xe[Se(t(), n())].text]), R(e, r);
			}, C = /* @__PURE__ */ D(() => xe[Se(t(), n())]);
			B(x, (e) => {
				F(C) && e(S);
			}), P((e, t, n, r, o, s, m, y) => {
				G(c, "title", e), z(l, `${t ?? ""} `), W(u, F(i).folder ?? ""), d = H(u, 1, "", null, d, { "bad-target": n }), G(f, "title", r), z(p, `${o ?? ""} `), G(h, "title", s), z(g, `${m ?? ""} `), W(_, F(i).folderMax ?? 24), v.disabled = !F(a), z(b, ` ${y ?? ""}`);
			}, [
				() => K("tip.bg.photoFolder"),
				() => K("lbl.photoFolder"),
				() => (F(i).folder ?? "").trim() && !F(a),
				() => K("tip.bg.folderOrder"),
				() => K("lbl.folderOrder"),
				() => K("tip.bg.folderMax"),
				() => K("lbl.folderMax"),
				() => K("ui.checkFolder")
			]), I("change", u, (e) => T(t(), n(), "folder", e.target.value.trim())), I("change", _, (e) => T(t(), n(), "folderMax", Number(e.target.value))), I("click", v, () => Ce(t(), n(), r())), R(e, s);
		};
		B(l, (e) => {
			(F(i).source ?? "upload") === "folder" && e(u);
		}), P((e, t) => {
			G(o, "title", e), z(s, `${t ?? ""} `);
		}, [() => K("tip.bg.photoSource"), () => K("lbl.photoSource")]), R(e, a);
	}, i = (e, t = f, n = f, r = f) => {
		var i = Md(), a = j(i), o = A(a), s = N(o);
		{
			let e = /* @__PURE__ */ D(() => r().props.motion ?? "none"), i = /* @__PURE__ */ D(() => [
				["none", K("common.none")],
				["kenburns", K("opt.bgMotion.kenburns")],
				["drift", K("opt.bgMotion.drift")]
			]);
			J(s, {
				get value() {
					return F(e);
				},
				get options() {
					return F(i);
				},
				onchange: (e) => T(t(), n(), "motion", e)
			});
		}
		E(a);
		var c = N(a, 2), l = (e) => {
			var i = Nd(), a = j(i), o = A(a), s = M(N(o));
			E(a);
			var c = N(a, 2);
			U(c), P((e) => {
				z(o, `${e ?? ""} `), z(s, `${r().props.motionSpeed ?? 20 ?? ""} s`), W(c, r().props.motionSpeed ?? 20);
			}, [() => K("lbl.motionSpeed")]), I("input", c, (e) => T(t(), n(), "motionSpeed", Number(e.target.value))), R(e, i);
		};
		B(c, (e) => {
			(r().props.motion ?? "none") !== "none" && e(l);
		}), P((e, t) => {
			G(a, "title", e), z(o, `${t ?? ""} `);
		}, [() => K("tip.bg.imageMotion"), () => K("lbl.motion")]), R(e, i);
	}, a = rt("urd-editor"), o = /* @__PURE__ */ D(() => a.secBox), s = /* @__PURE__ */ D(() => a.sectionBg), c = /* @__PURE__ */ D(() => a.siteDraft), { BG_DEFS: l, BG_TYPES: u, compressMany: d, compressOrTrim: p, imageErrorText: m, newSeed: h, readVideoFile: g, reportUpload: _, setStatus: v, themeSwatches: y } = a, b = mn({});
	Pn(() => {
		for (let e of F(s)) {
			let t = e?.props?.src;
			if (e?.type === "image" && t && !b[t]) {
				let e = new Image();
				e.onload = () => {
					b[t] = {
						w: e.naturalWidth,
						h: e.naturalHeight
					};
				}, e.src = t;
			}
		}
	});
	let x = /* @__PURE__ */ O("color");
	function S(e, t) {
		e.mutate(e.keyPrefix, (e) => {
			e.background ??= {
				version: 1,
				layers: []
			}, e.background.layers.push({
				type: t,
				version: l[t].version ?? 1,
				props: l[t].defaults()
			});
		});
	}
	function C(e, t) {
		e.mutate(e.keyPrefix, (e) => {
			e.background.layers.splice(t, 1), e.background.layers.length || delete e.background;
		});
	}
	function w(e, t, n) {
		let r = t + n;
		e.mutate(e.keyPrefix, (e) => {
			let n = e.background.layers;
			r < 0 || r >= n.length || ([n[t], n[r]] = [n[r], n[t]]);
		});
	}
	function ee(e, t, n) {
		e.mutate(`edit:${e.keyPrefix}-${e.keyId}-${t}-${Object.keys(n).join("+")}`, (e) => {
			Object.assign(e.background.layers[t].props, n);
		});
	}
	function T(e, t, n, r) {
		e.mutate(`edit:${e.keyPrefix}-${e.keyId}-${t}-${n}`, (e) => {
			e.background.layers[t].props[n] = r;
		});
	}
	function te(e, t, n, r = "xy") {
		e.preventDefault();
		let i = e.currentTarget;
		i.setPointerCapture?.(e.pointerId);
		let a = (e) => {
			let a = i.getBoundingClientRect();
			if (r.includes("x")) {
				let r = Math.min(1, Math.max(0, (e.clientX - a.left) / a.width));
				T(t, n, "x", Math.round(r * 100) / 100);
			}
			if (r.includes("y")) {
				let r = Math.min(1, Math.max(0, (e.clientY - a.top) / a.height));
				T(t, n, "y", Math.round(r * 100) / 100);
			}
		};
		a(e);
		let o = () => {
			i.removeEventListener("pointermove", a), i.removeEventListener("pointerup", o), i.removeEventListener("pointercancel", o);
		};
		i.addEventListener("pointermove", a), i.addEventListener("pointerup", o), i.addEventListener("pointercancel", o);
	}
	let ne = (e) => Math.min(4, Math.max(.1, e));
	function re(e, t, n, r) {
		T(e, t, "size", ne(Math.round((n + r) * 100) / 100));
	}
	function ie(e, t, n) {
		let r = Number(n);
		Number.isFinite(r) && T(e, t, "size", ne(r / 100));
	}
	function ae(e, t, n, r) {
		let i = b[n.props.src];
		if (!i?.w || !i?.h || !F(o)?.w || !F(o)?.h) return;
		let a = F(o).h * i.w / (F(o).w * i.h), s = r === "cover" ? Math.max(1, a) : Math.min(1, a);
		(n.props.fit === "tile" || n.props.fit === "repeat") && T(e, t, "fit", "plain"), T(e, t, "size", ne(Math.round(s * 100) / 100));
	}
	function oe(e) {
		return e.props;
	}
	function se(e, t, n, r) {
		e.mutate(n, (e) => {
			r(e.background.layers[t].props);
		});
	}
	function ce(e, t, n, r) {
		se(e, t, `edit:${e.keyPrefix}-${e.keyId}-${t}-${n}`, (e) => {
			e[n] = r;
		});
	}
	let le = {
		linear: [
			["none", K("common.none")],
			["pan", K("opt.gradAnim.pan")],
			["pan-loop", K("opt.gradAnim.panLoop")],
			["rotate", K("opt.gradAnim.rotate")]
		],
		radial: [
			["none", K("common.none")],
			["pulse", K("opt.gradAnim.pulse")],
			["orbit", K("opt.gradAnim.orbit")]
		]
	};
	function ue(e, t, n) {
		se(e, t, e.keyPrefix, (e) => {
			e.kind = n, le[n].some(([t]) => t === (e.animation ?? "none")) || (e.animation = "none");
		});
	}
	function de(e, t, n, r) {
		se(e, t, `edit:${e.keyPrefix}-${e.keyId}-${t}-stop${n}`, (e) => {
			e.stops[n] = {
				...e.stops[n],
				...r
			};
		});
	}
	function fe(e, t) {
		se(e, t, e.keyPrefix, (e) => {
			let t = Math.round(e.stops.reduce((e, t) => e + (Number(t.share) || 0), 0) / e.stops.length) || 50;
			e.stops.push({
				color: e.stops[e.stops.length - 1]?.color ?? "#ffffff",
				share: t
			});
		});
	}
	function pe(e, t, n) {
		se(e, t, e.keyPrefix, (e) => {
			e.stops.length > 2 && e.stops.splice(n, 1);
		});
	}
	function me(e, t, n, r) {
		se(e, t, e.keyPrefix, (e) => {
			let [t] = e.stops.splice(n, 1);
			e.stops.splice(r, 0, t);
		});
	}
	let he = /* @__PURE__ */ O(null);
	function ge(e, t, n, r) {
		if (t.button !== 0) return;
		t.preventDefault();
		let i = t.currentTarget.closest(".bg-layer"), a = t.currentTarget.closest(".grad-stop");
		k(he, {
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
			k(he, {
				...F(he),
				insert: n
			}, !0);
		}, u = () => {
			window.removeEventListener("pointermove", l), window.removeEventListener("pointerup", u), c.remove();
			let t = F(he);
			if (k(he, null), !t) return;
			let n = t.insert > t.from ? t.insert - 1 : t.insert;
			n !== t.from && me(e, t.layer, t.from, n);
		};
		window.addEventListener("pointermove", l), window.addEventListener("pointerup", u);
	}
	function _e(e, t, n) {
		e.mutate(e.keyPrefix, (e) => {
			e.background.layers[t].type !== n && (e.background.layers[t] = {
				type: n,
				version: l[n].version ?? 1,
				props: l[n].defaults()
			});
		});
	}
	async function ve(e, t, n) {
		let r = n.target.files?.[0];
		if (n.target.value = "", r) try {
			T(e, t, "src", (await p(r)).dataUrl);
		} catch (e) {
			v(m(e), "error");
		}
	}
	function ye(e, t, n) {
		let r = n.target.files?.[0];
		n.target.value = "", r && g(r, "status.videoFormat", (n) => T(e, t, "src", n));
	}
	async function be(e, t, n) {
		let r = n.target.files?.[0];
		if (n.target.value = "", r) try {
			T(e, t, "poster", (await p(r)).dataUrl);
		} catch (e) {
			v(m(e), "error");
		}
	}
	let xe = mn({}), Se = (e, t) => `${e.keyPrefix}-${e.keyId}-${t}`;
	async function Ce(e, t, n) {
		let r = Se(e, t);
		xe[r] = {
			text: K("status.folderChecking"),
			err: !1
		};
		let i = await ud(n.props.folder, n.props.order, { force: !0 });
		xe[r] = i.photos.length ? {
			text: ya("status.folderFound", i.photos.length, { count: i.photos.length }),
			err: !1
		} : {
			text: ba(i) ?? K("status.folderNone"),
			err: !0
		};
	}
	async function we(e, t, n) {
		let r = [...n.target.files ?? []];
		if (n.target.value = "", !r.length) return;
		v(K("status.compressingImages"));
		let { images: i, failed: a, big: o } = await d(r);
		i.length && e.mutate(e.keyPrefix, (e) => {
			let n = e.background.layers[t].props;
			n.images ??= [], n.images.push(...i.map(({ src: e }) => ({
				src: e,
				x: .5,
				y: .5
			})));
		}), _(i.length, a, o);
	}
	function Te(e, t, n, r) {
		e.mutate(e.keyPrefix, (e) => {
			let i = e.background.layers[t].props.images, a = n + r;
			a < 0 || a >= i.length || ([i[n], i[a]] = [i[a], i[n]]);
		});
	}
	function Ee(e, t, n) {
		e.mutate(e.keyPrefix, (e) => {
			e.background.layers[t].props.images.splice(n, 1);
		});
	}
	function De(e, t, n, r, i) {
		e.mutate(`edit:${e.keyPrefix}g-${e.keyId}-${t}-${n}-${r}`, (e) => {
			e.background.layers[t].props.images[n][r] = i;
		});
	}
	let Oe = (e) => (e.version ?? 1) < md.version ? md.migrations[1](e.props ?? {}) : e.props ?? {};
	var ke = sf(), Ae = j(ke);
	di(Ae, 17, () => t.layers, si, (e, a, o) => {
		var s = of(), l = A(s), d = A(l);
		{
			let e = /* @__PURE__ */ D(() => K("tip.bg.changeType")), n = /* @__PURE__ */ D(() => u.map(([e, t]) => [e, t.labelKey ? K(t.labelKey) : t.label]));
			J(d, {
				get value() {
					return F(a).type;
				},
				get title() {
					return F(e);
				},
				get options() {
					return F(n);
				},
				onchange: (e) => _e(t.bg, o, e)
			});
		}
		var f = N(d, 2), p = A(f);
		p.disabled = o === 0, V(p, () => q.up, !0), E(p);
		var m = N(p, 2);
		V(m, () => q.down, !0), E(m);
		var g = N(m, 2);
		V(g, () => q.cross, !0), E(g), E(f), E(l);
		var _ = N(l, 2), v = (e) => {
			var n = Pd(), r = j(n), i = A(r), s = N(i);
			{
				let e = /* @__PURE__ */ D(y), n = /* @__PURE__ */ D(() => K("tip.bg.layerColor"));
				sl(s, {
					get value() {
						return F(a).props.value;
					},
					get tokens() {
						return F(e);
					},
					get label() {
						return F(n);
					},
					onchange: (e) => T(t.bg, o, "value", e)
				});
			}
			E(r);
			var c = N(r, 2), l = A(c), u = M(N(l));
			E(c);
			var d = N(c, 2);
			U(d), P((e, t, n) => {
				z(i, `${e ?? ""} `), z(l, `${t ?? ""} `), z(u, `${n ?? ""}%`), W(d, F(a).props.opacity ?? 1);
			}, [
				() => K("lbl.color"),
				() => K("lbl.strength"),
				() => Math.round((F(a).props.opacity ?? 1) * 100)
			]), I("input", d, (e) => T(t.bg, o, "opacity", Number(e.target.value))), R(e, n);
		}, b = (e) => {
			let n = /* @__PURE__ */ D(() => oe(F(a))), r = /* @__PURE__ */ D(() => F(n).stops.reduce((e, t) => e + Math.max(0, Number(t.share) || 0), 0));
			var i = zd(), s = j(i), c = A(s), l = N(c);
			{
				let e = /* @__PURE__ */ D(() => F(n).kind ?? "linear"), r = /* @__PURE__ */ D(() => [["linear", K("opt.grad.linear")], ["radial", K("opt.grad.radial")]]);
				J(l, {
					get value() {
						return F(e);
					},
					get options() {
						return F(r);
					},
					onchange: (e) => ue(t.bg, o, e)
				});
			}
			E(s);
			var u = N(s, 2);
			di(u, 17, () => F(n).stops, si, (e, i, a) => {
				var s = Id();
				let c;
				var l = A(s), u = N(l, 2);
				{
					let e = /* @__PURE__ */ D(y), n = /* @__PURE__ */ D(() => K("tip.bg.stopColor"));
					sl(u, {
						get value() {
							return F(i).color;
						},
						get tokens() {
							return F(e);
						},
						get label() {
							return F(n);
						},
						onchange: (e) => de(t.bg, o, a, { color: e })
					});
				}
				var d = N(u, 2);
				U(d);
				var f = N(d, 2), p = M(f), m = N(f, 2), h = (e) => {
					var n = Fd();
					V(n, () => q.cross, !0), E(n), P((e) => G(n, "title", e), [() => K("tip.bg.removeStop")]), I("click", n, () => pe(t.bg, o, a)), R(e, n);
				};
				B(m, (e) => {
					F(n).stops.length > 2 && e(h);
				}), E(s), P((e, t, r) => {
					c = H(s, 1, "nav-line grad-stop", null, c, {
						dragging: F(he)?.layer === o && F(he).from === a,
						"drop-above": F(he)?.layer === o && F(he).insert === a,
						"drop-below": F(he)?.layer === o && F(he).insert === F(n).stops.length && a === F(n).stops.length - 1
					}), G(l, "title", e), W(d, F(i).share ?? 50), G(d, "title", t), z(p, `${r ?? ""}%`);
				}, [
					() => K("tip.bg.dragStop"),
					() => K("tip.bg.stopShare"),
					() => F(r) > 0 ? Math.round(Math.max(0, Number(F(i).share) || 0) / F(r) * 100) : Math.round(100 / F(n).stops.length)
				]), I("pointerdown", l, (e) => ge(t.bg, e, o, a)), I("input", d, (e) => de(t.bg, o, a, { share: Number(e.target.value) })), R(e, s);
			});
			var d = N(u, 2), f = M(d, !0), p = N(d, 2), m = (e) => {
				var r = Ld(), i = j(r), a = A(i), s = M(N(a));
				E(i);
				var c = N(i, 2);
				U(c);
				var l = N(c, 2), u = A(l), d = M(N(u));
				E(l);
				var f = N(l, 2);
				U(f), P((e, t, r, i) => {
					z(a, `${e ?? ""} `), z(s, `${t ?? ""}%`), W(c, F(n).x ?? .5), z(u, `${r ?? ""} `), z(d, `${i ?? ""}%`), W(f, F(n).y ?? .5);
				}, [
					() => K("lbl.centerX"),
					() => Math.round((F(n).x ?? .5) * 100),
					() => K("lbl.centerY"),
					() => Math.round((F(n).y ?? .5) * 100)
				]), I("input", c, (e) => ce(t.bg, o, "x", Number(e.target.value))), I("input", f, (e) => ce(t.bg, o, "y", Number(e.target.value))), R(e, r);
			}, h = (e) => {
				var r = Rd(), i = j(r), a = A(i), s = M(N(a));
				E(i);
				var c = N(i, 2);
				U(c), P((e) => {
					z(a, `${e ?? ""} `), z(s, `${F(n).angle ?? ""}°`), W(c, F(n).angle);
				}, [() => K("lbl.angle")]), I("input", c, (e) => ce(t.bg, o, "angle", Number(e.target.value))), R(e, r);
			};
			B(p, (e) => {
				(F(n).kind ?? "linear") === "radial" ? e(m) : e(h, -1);
			});
			var g = N(p, 2), _ = A(g), v = M(N(_));
			E(g);
			var b = N(g, 2);
			U(b);
			var x = N(b, 2), S = A(x), C = N(S);
			{
				let e = /* @__PURE__ */ D(() => F(n).animation ?? "none");
				J(C, {
					get value() {
						return F(e);
					},
					get options() {
						return le[(F(n).kind ?? "linear") === "radial" ? "radial" : "linear"];
					},
					onchange: (e) => ce(t.bg, o, "animation", e)
				});
			}
			E(x), P((e, t, r, i, a, o, s) => {
				z(c, `${e ?? ""} `), G(d, "title", t), z(f, r), z(_, `${i ?? ""} `), z(v, `${a ?? ""}%`), W(b, F(n).opacity ?? 1), G(x, "title", o), z(S, `${s ?? ""} `);
			}, [
				() => K("blocks.shape"),
				() => K("tip.bg.addStop"),
				() => K("ui.addStop"),
				() => K("lbl.strength"),
				() => Math.round((F(n).opacity ?? 1) * 100),
				() => K("tip.bg.motion"),
				() => K("lbl.motion")
			]), I("click", d, () => fe(t.bg, o)), I("input", b, (e) => ce(t.bg, o, "opacity", Number(e.target.value))), R(e, i);
		}, x = (e) => {
			var n = Bd(), r = j(n), i = A(r), s = N(i);
			{
				let e = /* @__PURE__ */ D(y), n = /* @__PURE__ */ D(() => K("tip.bg.glowColor"));
				sl(s, {
					get value() {
						return F(a).props.color;
					},
					get tokens() {
						return F(e);
					},
					get label() {
						return F(n);
					},
					onchange: (e) => T(t.bg, o, "color", e)
				});
			}
			E(r);
			var c = N(r, 2), l = A(c), u = M(N(l));
			E(c);
			var d = N(c, 2);
			U(d);
			var f = N(d, 2), p = A(f), m = M(N(p));
			E(f);
			var h = N(f, 2);
			U(h);
			var g = N(h, 2), _ = A(g), v = M(N(_));
			E(g);
			var b = N(g, 2);
			U(b);
			var x = N(b, 2), S = A(x), C = M(N(S));
			E(x);
			var w = N(x, 2);
			U(w), P((e, t, n, r, o, s, c, f, g) => {
				z(i, `${e ?? ""} `), z(l, `${t ?? ""} `), z(u, `${n ?? ""}%`), W(d, F(a).props.x), z(p, `${r ?? ""} `), z(m, `${o ?? ""}%`), W(h, F(a).props.y), z(_, `${s ?? ""} `), z(v, `${c ?? ""}%`), W(b, F(a).props.radius), z(S, `${f ?? ""} `), z(C, `${g ?? ""}%`), W(w, F(a).props.opacity);
			}, [
				() => K("lbl.color"),
				() => K("lbl.posX"),
				() => Math.round(F(a).props.x * 100),
				() => K("lbl.posY"),
				() => Math.round(F(a).props.y * 100),
				() => K("lbl.size"),
				() => Math.round(F(a).props.radius * 100),
				() => K("lbl.strength"),
				() => Math.round(F(a).props.opacity * 100)
			]), I("input", d, (e) => T(t.bg, o, "x", Number(e.target.value))), I("input", h, (e) => T(t.bg, o, "y", Number(e.target.value))), I("input", b, (e) => T(t.bg, o, "radius", Number(e.target.value))), I("input", w, (e) => T(t.bg, o, "opacity", Number(e.target.value))), R(e, n);
		}, S = (e) => {
			var n = Vd(), r = j(n), i = A(r), s = M(N(i));
			E(r);
			var c = N(r, 2);
			U(c), P((e, t) => {
				z(i, `${e ?? ""} `), z(s, `${t ?? ""}%`), W(c, F(a).props.opacity);
			}, [() => K("lbl.strength"), () => Math.round(F(a).props.opacity * 100)]), I("input", c, (e) => T(t.bg, o, "opacity", Number(e.target.value))), R(e, n);
		}, ne = (e) => {
			var n = Hd(), r = j(n), i = A(r), s = N(i);
			{
				let e = /* @__PURE__ */ D(() => Xl(F(a).props.pattern)), n = /* @__PURE__ */ D(() => Kl.map((e) => [e, K(`opt.bgPattern.${e}`)]));
				J(s, {
					get value() {
						return F(e);
					},
					get options() {
						return F(n);
					},
					onchange: (e) => T(t.bg, o, "pattern", e)
				});
			}
			E(r);
			var c = N(r, 2), l = A(c), u = N(l);
			{
				let e = /* @__PURE__ */ D(() => F(a).props.color ?? "text"), n = /* @__PURE__ */ D(y), r = /* @__PURE__ */ D(() => K("lbl.color"));
				sl(u, {
					get value() {
						return F(e);
					},
					get tokens() {
						return F(n);
					},
					get label() {
						return F(r);
					},
					onchange: (e) => T(t.bg, o, "color", e)
				});
			}
			E(c);
			var d = N(c, 2), f = A(d), p = M(N(f));
			E(d);
			var m = N(d, 2);
			U(m);
			var h = N(m, 2), g = A(h), _ = M(N(g));
			E(h);
			var v = N(h, 2);
			U(v);
			var b = N(v, 2), x = A(b), S = M(N(x));
			E(b);
			var C = N(b, 2);
			U(C);
			var w = N(C, 2), ee = A(w);
			U(ee);
			var te = N(ee);
			E(w), P((e, t, n, r, o, s, c, u) => {
				z(i, `${e ?? ""} `), z(l, `${t ?? ""} `), z(f, `${n ?? ""} `), z(p, `${F(a).props.size ?? ql.dflt ?? ""} px`), G(m, "min", ql.min), G(m, "max", ql.max), W(m, F(a).props.size ?? ql.dflt), z(g, `${r ?? ""} `), z(_, `${o ?? ""}%`), W(v, F(a).props.opacity ?? .12), z(x, `${s ?? ""} `), z(S, `${F(a).props.rotation ?? 0 ?? ""}°`), W(C, F(a).props.rotation ?? 0), G(w, "title", c), Vi(ee, F(a).props.invert === !0), z(te, ` ${u ?? ""}`);
			}, [
				() => K("lbl.bgPattern"),
				() => K("lbl.color"),
				() => K("lbl.size"),
				() => K("lbl.strength"),
				() => Math.round((F(a).props.opacity ?? .12) * 100),
				() => K("lbl.patternRotation"),
				() => K("tip.bg.patternInvert"),
				() => K("lbl.patternInvert")
			]), I("input", m, (e) => T(t.bg, o, "size", Number(e.target.value))), I("input", v, (e) => T(t.bg, o, "opacity", Number(e.target.value))), I("input", C, (e) => T(t.bg, o, "rotation", Number(e.target.value))), I("change", ee, (e) => T(t.bg, o, "invert", e.target.checked)), R(e, n);
		}, se = (e) => {
			let n = /* @__PURE__ */ D(() => F(a).props.fit === "tile" || F(a).props.fit === "repeat");
			var r = Gd(), s = j(r), c = A(s), l = N(c);
			E(s);
			var u = N(s, 2), d = A(u), f = N(d);
			{
				let e = /* @__PURE__ */ D(() => F(n) ? "tile" : "plain"), r = /* @__PURE__ */ D(() => [["plain", K("opt.img.plain")], ["tile", K("opt.img.tile")]]);
				J(f, {
					get value() {
						return F(e);
					},
					get options() {
						return F(r);
					},
					onchange: (e) => T(t.bg, o, "fit", e)
				});
			}
			E(u);
			var p = N(u, 2), m = M(p, !0), h = N(p, 2), g = A(h), _ = N(g, 2);
			U(_);
			var v = N(_, 4);
			E(h);
			var y = N(h, 2), b = (e) => {
				var n = Ud(), r = j(n), i = A(r), s = M(i, !0), c = N(i, 2), l = M(c, !0);
				E(r);
				var u = N(r, 2), d = M(u, !0), f = N(u, 2), p = N(f, 2), m = A(p), h = M(N(m));
				E(p);
				var g = N(p, 2);
				U(g);
				var _ = N(g, 2), v = A(_), y = M(N(v));
				E(_);
				var b = N(_, 2);
				U(b), P((e, t, n, r, o, p, _, x, S, C, w, ee) => {
					G(i, "title", e), z(s, t), G(c, "title", n), z(l, r), G(u, "title", o), z(d, p), Ii(f, `--fx:${_ ?? ""}%; --fy:${x ?? ""}%`), z(m, `${S ?? ""} `), z(h, `${C ?? ""}%`), W(g, F(a).props.x ?? .5), z(v, `${w ?? ""} `), z(y, `${ee ?? ""}%`), W(b, F(a).props.y ?? .5);
				}, [
					() => K("tip.bg.cover"),
					() => K("ui.cover"),
					() => K("opt.fitFrame.contain"),
					() => K("opt.fit.contain"),
					() => K("tip.bg.position"),
					() => K("lbl.position"),
					() => Math.max(0, Math.min(1, F(a).props.x ?? .5)) * 100,
					() => Math.max(0, Math.min(1, F(a).props.y ?? .5)) * 100,
					() => K("lbl.horizontal"),
					() => Math.round((F(a).props.x ?? .5) * 100),
					() => K("lbl.vertical"),
					() => Math.round((F(a).props.y ?? .5) * 100)
				]), I("click", i, () => ae(t.bg, o, F(a), "cover")), I("click", c, () => ae(t.bg, o, F(a), "contain")), I("pointerdown", f, (e) => te(e, t.bg, o, "xy")), I("input", g, (e) => T(t.bg, o, "x", Number(e.target.value))), I("input", b, (e) => T(t.bg, o, "y", Number(e.target.value))), R(e, n);
			};
			B(y, (e) => {
				F(n) || e(b);
			});
			var x = N(y, 2), S = A(x), C = M(N(S));
			E(x);
			var w = N(x, 2);
			U(w);
			var ee = N(w, 2), ne = A(ee), oe = M(N(ne));
			E(ee);
			var se = N(ee, 2);
			U(se);
			var ce = N(se, 2);
			i(ce, () => t.bg, () => o, () => F(a));
			var le = N(ce, 2), ue = A(le);
			U(ue);
			var de = N(ue);
			E(le);
			var fe = N(le, 2), pe = (e) => {
				var n = Wd(), r = j(n), i = A(r), s = M(N(i));
				E(r);
				var c = N(r, 2);
				U(c);
				var l = N(c, 2), u = A(l), d = N(u);
				{
					let e = /* @__PURE__ */ D(() => F(a).props.bleed ?? "none"), n = /* @__PURE__ */ D(() => [
						["none", K("common.none")],
						["up", K("opt.bleed.up")],
						["down", K("opt.bleed.down")],
						["both", K("opt.brand.both")]
					]);
					J(d, {
						get value() {
							return F(e);
						},
						get options() {
							return F(n);
						},
						onchange: (e) => T(t.bg, o, "bleed", e)
					});
				}
				E(l), P((e, t, n, r) => {
					z(i, `${e ?? ""} `), z(s, `${t ?? ""}%`), W(c, F(a).props.parallax ?? .3), G(l, "title", n), z(u, `${r ?? ""} `);
				}, [
					() => K("lbl.parallaxStrength"),
					() => Math.round((F(a).props.parallax ?? 0) * 100),
					() => K("tip.bg.bleed"),
					() => K("lbl.bleed")
				]), I("input", c, (e) => T(t.bg, o, "parallax", Number(e.target.value))), R(e, n);
			};
			B(fe, (e) => {
				(F(a).props.parallax ?? 0) > 0 && e(pe);
			}), P((e, t, n, r, i, o, l, f, h, y, b, x, ee, T) => {
				G(s, "title", e), z(c, `${t ?? ""} `), G(u, "title", n), z(d, `${r ?? ""} `), G(p, "title", i), z(m, o), G(g, "title", l), W(_, f), G(v, "title", h), z(S, `${y ?? ""} `), z(C, `${F(a).props.blur ?? 0 ?? ""} px`), W(w, F(a).props.blur ?? 0), z(ne, `${b ?? ""} `), z(oe, `${x ?? ""}%`), W(se, F(a).props.opacity ?? 1), G(le, "title", ee), Vi(ue, (F(a).props.parallax ?? 0) > 0), z(de, ` ${T ?? ""}`);
			}, [
				() => K("tip.webpAuto"),
				() => F(a).props.src ? K("ui.changeImage") : K("ui.chooseImage"),
				() => K("tip.bg.fit"),
				() => K("lbl.imageFit"),
				() => K("tip.bg.size"),
				() => K("lbl.size"),
				() => K("tip.smaller"),
				() => Math.round((F(a).props.size ?? 1) * 100),
				() => K("tip.larger"),
				() => K("lbl.blur"),
				() => K("lbl.strength"),
				() => Math.round((F(a).props.opacity ?? 1) * 100),
				() => K("tip.bg.parallax"),
				() => K("lbl.parallax")
			]), I("change", l, (e) => ve(t.bg, o, e)), I("click", g, () => re(t.bg, o, F(a).props.size ?? 1, -.05)), I("change", _, (e) => ie(t.bg, o, e.target.value)), I("click", v, () => re(t.bg, o, F(a).props.size ?? 1, .05)), I("input", w, (e) => T(t.bg, o, "blur", Number(e.target.value))), I("input", se, (e) => T(t.bg, o, "opacity", Number(e.target.value))), I("change", ue, (e) => T(t.bg, o, "parallax", e.target.checked ? .3 : 0)), R(e, r);
		}, me = (e) => {
			let i = /* @__PURE__ */ D(() => Oe(F(a))), s = /* @__PURE__ */ D(() => F(i).style ?? "floating"), l = /* @__PURE__ */ D(() => co(F(s), F(i).motion)), u = /* @__PURE__ */ D(() => (F(i).seed ?? 0) > 0);
			var d = nf(), f = j(d);
			r(f, () => t.bg, () => o, () => F(a));
			var p = N(f, 2);
			n(p, () => t.bg, () => o, () => F(a));
			var m = N(p, 2), g = A(m), _ = N(g);
			{
				let e = /* @__PURE__ */ D(() => La.map((e) => [e, K(`opt.galleryStyle.${e}`)]));
				J(_, {
					get value() {
						return F(s);
					},
					get options() {
						return F(e);
					},
					onchange: (e) => T(t.bg, o, "style", e)
				});
			}
			E(m);
			var v = N(m, 2), b = (e) => {
				var n = Kd(), r = j(n), a = A(r), s = N(a);
				{
					let e = /* @__PURE__ */ D(() => F(i).fit ?? "cover"), n = /* @__PURE__ */ D(() => [["cover", K("opt.fit.cover")], ["contain", K("opt.fit.contain")]]);
					J(s, {
						get value() {
							return F(e);
						},
						get options() {
							return F(n);
						},
						onchange: (e) => T(t.bg, o, "fit", e)
					});
				}
				E(r);
				var c = N(r, 2), l = A(c), u = M(N(l));
				E(c);
				var d = N(c, 2);
				U(d);
				var f = N(d, 2), p = A(f), m = M(N(p));
				E(f);
				var h = N(f, 2);
				U(h);
				var g = N(h, 2), _ = A(g), v = M(N(_));
				E(g);
				var y = N(g, 2);
				U(y), P((e, t, n, r, o) => {
					z(a, `${e ?? ""} `), z(l, `${t ?? ""} `), z(u, `${F(i).interval ?? 12 ?? ""} s`), W(d, F(i).interval ?? 12), z(p, `${n ?? ""} `), z(m, `${r ?? ""} s`), W(h, F(i).fade ?? 1.5), z(_, `${o ?? ""} `), z(v, `${F(i).blur ?? 0 ?? ""} px`), W(y, F(i).blur ?? 0);
				}, [
					() => K("lbl.imageFit"),
					() => K("lbl.secondsPerImage"),
					() => K("lbl.transition"),
					() => (F(i).fade ?? 1.5).toFixed(1),
					() => K("lbl.blur")
				]), I("input", d, (e) => T(t.bg, o, "interval", Number(e.target.value))), I("input", h, (e) => T(t.bg, o, "fade", Number(e.target.value))), I("input", y, (e) => T(t.bg, o, "blur", Number(e.target.value))), R(e, n);
			}, x = (e) => {
				var n = $d(), r = j(n), a = (e) => {
					var n = qd(), r = j(n), a = A(r), s = N(a);
					{
						let e = /* @__PURE__ */ D(() => String(F(i).rows ?? 2));
						J(s, {
							get value() {
								return F(e);
							},
							options: [["1", "1"], ["2", "2"]],
							onchange: (e) => T(t.bg, o, "rows", Number(e))
						});
					}
					E(r);
					var c = N(r, 2), l = A(c), u = N(l);
					{
						let e = /* @__PURE__ */ D(() => F(i).direction ?? "left"), n = /* @__PURE__ */ D(() => [["left", K("opt.ribbonDir.left")], ["right", K("opt.ribbonDir.right")]]);
						J(u, {
							get value() {
								return F(e);
							},
							get options() {
								return F(n);
							},
							onchange: (e) => T(t.bg, o, "direction", e)
						});
					}
					E(c), P((e, t) => {
						z(a, `${e ?? ""} `), z(l, `${t ?? ""} `);
					}, [() => K("lbl.galleryRows"), () => K("lbl.photoDirection")]), R(e, n);
				}, c = (e) => {
					var n = Yd(), r = j(n), a = A(r), c = N(a);
					U(c), E(r);
					var l = N(r, 2), d = A(l), f = N(d);
					{
						let e = /* @__PURE__ */ D(() => F(i).repeat === !0 ? "repeat" : "once"), n = /* @__PURE__ */ D(() => [["once", K("opt.galleryRepeat.once")], ["repeat", K("opt.galleryRepeat.repeat")]]);
						J(f, {
							get value() {
								return F(e);
							},
							get options() {
								return F(n);
							},
							onchange: (e) => T(t.bg, o, "repeat", e === "repeat")
						});
					}
					E(l);
					var p = N(l, 2), m = A(p), g = N(m);
					{
						let e = /* @__PURE__ */ D(() => F(u) ? "fixed" : "random"), n = /* @__PURE__ */ D(() => [["random", K("opt.galleryPlace.random")], ["fixed", K("opt.galleryPlace.fixed")]]);
						J(g, {
							get value() {
								return F(e);
							},
							get options() {
								return F(n);
							},
							onchange: (e) => T(t.bg, o, "seed", e === "fixed" ? h() : 0)
						});
					}
					E(p);
					var _ = N(p, 2), v = (e) => {
						var n = Jd(), r = A(n);
						V(r, () => q.shuffle);
						var i = N(r);
						E(n), P((e, t) => {
							G(n, "title", e), z(i, ` ${t ?? ""}`);
						}, [() => K("tip.bg.photoSeed"), () => K("ui.shufflePhotos")]), I("click", n, () => T(t.bg, o, "seed", h())), R(e, n);
					};
					B(_, (e) => {
						F(u) && e(v);
					}), P((e, t, n, o, u, f) => {
						G(r, "title", e), z(a, `${t ?? ""} `), G(c, "min", F(s) === "mosaic" ? 4 : 1), W(c, F(i).count ?? (F(s) === "mosaic" ? 12 : 8)), G(l, "title", n), z(d, `${o ?? ""} `), G(p, "title", u), z(m, `${f ?? ""} `);
					}, [
						() => K("tip.bg.photoCount"),
						() => K("lbl.photoCount"),
						() => K("tip.bg.galleryRepeat"),
						() => K("lbl.galleryRepeat"),
						() => K("tip.bg.galleryPlace"),
						() => K("lbl.galleryPlace")
					]), I("change", c, (e) => T(t.bg, o, "count", Number(e.target.value))), R(e, n);
				};
				B(r, (e) => {
					F(s) === "band" ? e(a) : e(c, -1);
				});
				var l = N(r, 2), d = A(l), f = M(N(d));
				E(l);
				var p = N(l, 2);
				U(p);
				var m = N(p, 2), g = (e) => {
					var n = Xd(), r = j(n), a = A(r), s = M(N(a));
					E(r);
					var c = N(r, 2);
					U(c);
					var l = N(c, 2), u = A(l), d = M(N(u));
					E(l);
					var f = N(l, 2);
					U(f), P((e, t, n, o) => {
						G(r, "title", e), z(a, `${t ?? ""} `), z(s, `${n ?? ""}%`), W(c, F(i).spread ?? .85), z(u, `${o ?? ""} `), z(d, `${F(i).tilt ?? 5 ?? ""}°`), W(f, F(i).tilt ?? 5);
					}, [
						() => K("tip.bg.photoSpread"),
						() => K("lbl.photoSpread"),
						() => Math.round((F(i).spread ?? .85) * 100),
						() => K("lbl.photoTilt")
					]), I("input", c, (e) => T(t.bg, o, "spread", Number(e.target.value))), I("input", f, (e) => T(t.bg, o, "tilt", Number(e.target.value))), R(e, n);
				};
				B(m, (e) => {
					F(s) === "floating" && e(g);
				});
				var _ = N(m, 2), v = A(_), b = N(v);
				{
					let e = /* @__PURE__ */ D(() => F(i).shape ?? "rect"), n = /* @__PURE__ */ D(() => Ra.map((e) => [e, K(`opt.galleryShape.${e}`)]));
					J(b, {
						get value() {
							return F(e);
						},
						get options() {
							return F(n);
						},
						onchange: (e) => T(t.bg, o, "shape", e)
					});
				}
				E(_);
				var x = N(_, 2), S = A(x), C = N(S);
				{
					let e = /* @__PURE__ */ D(() => F(i).look ?? "shadow"), n = /* @__PURE__ */ D(() => za.map((e) => [e, K(`opt.galleryLook.${e}`)]));
					J(C, {
						get value() {
							return F(e);
						},
						get options() {
							return F(n);
						},
						onchange: (e) => T(t.bg, o, "look", e)
					});
				}
				E(x);
				var w = N(x, 2), ee = (e) => {
					var n = Zd(), r = A(n), a = N(r);
					{
						let e = /* @__PURE__ */ D(() => ho(F(i).look, F(i).frameColor)), n = /* @__PURE__ */ D(y), r = /* @__PURE__ */ D(() => K("tip.bg.frameColor"));
						sl(a, {
							get value() {
								return F(e);
							},
							get tokens() {
								return F(n);
							},
							allowClear: !0,
							get label() {
								return F(r);
							},
							onchange: (e) => T(t.bg, o, "frameColor", e ?? "")
						});
					}
					E(n), P((e) => z(r, `${e ?? ""} `), [() => K("lbl.frameColor")]), R(e, n);
				}, te = /* @__PURE__ */ D(() => mo(F(i).look));
				B(w, (e) => {
					F(te) && e(ee);
				});
				var ne = N(w, 2), re = (e) => {
					var n = Qd(), r = j(n), a = A(r), s = M(N(a));
					E(r);
					var c = N(r, 2);
					U(c), P((e) => {
						z(a, `${e ?? ""} `), z(s, `${F(i).radius ?? 5 ?? ""} px`), W(c, F(i).radius ?? 5);
					}, [() => K("lbl.rounding")]), I("input", c, (e) => T(t.bg, o, "radius", Number(e.target.value))), R(e, n);
				}, ie = /* @__PURE__ */ D(() => bo(F(i).shape) && (F(i).look ?? "shadow") !== "polaroid");
				B(ne, (e) => {
					F(ie) && e(re);
				}), P((e, t, n, r, i, a, o) => {
					z(d, `${e ?? ""} `), z(f, `${t ?? ""} px`), W(p, n), G(_, "title", r), z(v, `${i ?? ""} `), G(x, "title", a), z(S, `${o ?? ""} `);
				}, [
					() => K("lbl.size"),
					() => po(F(i).size, F(s)),
					() => po(F(i).size, F(s)),
					() => K("tip.bg.galleryShape"),
					() => K("lbl.galleryShape"),
					() => K("tip.bg.galleryLook"),
					() => K("lbl.galleryLook")
				]), I("input", p, (e) => T(t.bg, o, "size", Number(e.target.value))), R(e, n);
			};
			B(v, (e) => {
				F(s) === "fill" ? e(b) : e(x, -1);
			});
			var S = N(v, 2), C = A(S), w = N(C);
			{
				let e = /* @__PURE__ */ D(() => F(i).tone ?? "natural"), n = /* @__PURE__ */ D(() => Ba.map((e) => [e, K(`opt.galleryTone.${e}`)]));
				J(w, {
					get value() {
						return F(e);
					},
					get options() {
						return F(n);
					},
					onchange: (e) => T(t.bg, o, "tone", e)
				});
			}
			E(S);
			var te = N(S, 2), ne = (e) => {
				var n = Zd(), r = A(n), i = N(r);
				{
					let e = /* @__PURE__ */ D(() => lo(F(s)).map((e) => [e, K(e === "none" ? "common.none" : `opt.galleryMotion.${e}`)]));
					J(i, {
						get value() {
							return F(l);
						},
						get options() {
							return F(e);
						},
						onchange: (e) => T(t.bg, o, "motion", e)
					});
				}
				E(n), P((e, t) => {
					G(n, "title", e), z(r, `${t ?? ""} `);
				}, [() => K("tip.bg.photoMotion"), () => K("lbl.motion")]), R(e, n);
			}, re = /* @__PURE__ */ D(() => lo(F(s)).length > 1);
			B(te, (e) => {
				F(re) && e(ne);
			});
			var ie = N(te, 2), ae = (e) => {
				var n = ef(), r = j(n), a = A(r), s = M(N(a));
				E(r);
				var c = N(r, 2);
				U(c), P((e) => {
					z(a, `${e ?? ""} `), z(s, `${F(i).interval ?? 12 ?? ""} s`), W(c, F(i).interval ?? 12);
				}, [() => K("lbl.secondsPerImage")]), I("input", c, (e) => T(t.bg, o, "interval", Number(e.target.value))), R(e, n);
			}, oe = (e) => {
				var n = ef(), r = j(n), a = A(r), s = M(N(a));
				E(r);
				var c = N(r, 2);
				U(c), P((e) => {
					z(a, `${e ?? ""} `), z(s, `${F(i).motionSpeed ?? 30 ?? ""} s`), W(c, F(i).motionSpeed ?? 30);
				}, [() => K("lbl.motionSpeed")]), I("input", c, (e) => T(t.bg, o, "motionSpeed", Number(e.target.value))), R(e, n);
			};
			B(ie, (e) => {
				F(l) === "crossfade" && F(s) !== "fill" ? e(ae) : (F(l) !== "none" || F(s) === "band") && e(oe, 1);
			});
			var se = N(ie, 2), ce = A(se);
			U(ce);
			var le = N(ce);
			E(se);
			var ue = N(se, 2), de = (e) => {
				var n = tf();
				let r;
				var a = A(n);
				U(a);
				var s = N(a);
				E(n), P((e, t) => {
					r = H(n, 1, "gridmenu-snap", null, r, { muted: F(i).underNav === !1 }), G(n, "title", e), Vi(a, F(i).underAnnounce === !0), a.disabled = F(i).underNav === !1, z(s, ` ${t ?? ""}`);
				}, [() => K("tip.bg.underAnnounce"), () => K("lbl.underAnnounce")]), I("change", a, (e) => e.target.checked ? ee(t.bg, o, {
					underAnnounce: !0,
					underNav: !0
				}) : T(t.bg, o, "underAnnounce", !1)), R(e, n);
			};
			B(ue, (e) => {
				F(c).nav?.announcement?.text && e(de);
			});
			var fe = N(ue, 2), pe = A(fe), me = M(N(pe));
			E(fe);
			var he = N(fe, 2);
			U(he), P((e, t, n, r, a, o, s, c) => {
				G(m, "title", e), z(g, `${t ?? ""} `), G(S, "title", n), z(C, `${r ?? ""} `), G(se, "title", a), Vi(ce, F(i).underNav !== !1), z(le, ` ${o ?? ""}`), z(pe, `${s ?? ""} `), z(me, `${c ?? ""}%`), W(he, F(i).opacity ?? .85);
			}, [
				() => K("tip.bg.galleryStyle"),
				() => K("lbl.galleryStyle"),
				() => K("tip.bg.galleryTone"),
				() => K("lbl.galleryTone"),
				() => K("tip.bg.underNav"),
				() => K("lbl.underNav"),
				() => K("lbl.strength"),
				() => Math.round((F(i).opacity ?? .85) * 100)
			]), I("change", ce, (e) => e.target.checked ? T(t.bg, o, "underNav", !0) : ee(t.bg, o, {
				underNav: !1,
				underAnnounce: !1
			})), I("input", he, (e) => T(t.bg, o, "opacity", Number(e.target.value))), R(e, d);
		}, xe = (e) => {
			var n = af(), r = j(n), i = A(r), s = N(i);
			E(r);
			var c = N(r, 2), l = A(c), u = N(l);
			E(c);
			var d = N(c, 2), f = A(d), p = N(f);
			{
				let e = /* @__PURE__ */ D(() => F(a).props.fit ?? "cover"), n = /* @__PURE__ */ D(() => [["cover", K("opt.fit.cover")], ["contain", K("opt.fit.contain")]]);
				J(p, {
					get value() {
						return F(e);
					},
					get options() {
						return F(n);
					},
					onchange: (e) => T(t.bg, o, "fit", e)
				});
			}
			E(d);
			var m = N(d, 2), h = A(m), g = M(N(h));
			E(m);
			var _ = N(m, 2);
			U(_);
			var v = N(_, 2), y = A(v), b = M(N(y));
			E(v);
			var x = N(v, 2);
			U(x);
			var S = N(x, 2), C = A(S), w = M(N(C));
			E(S);
			var ee = N(S, 2);
			U(ee);
			var te = N(ee, 2), ne = A(te);
			U(ne);
			var re = N(ne);
			E(te);
			var ie = N(te, 2), ae = (e) => {
				var n = rf(), r = j(n), i = A(r), s = M(N(i));
				E(r);
				var c = N(r, 2);
				U(c), P((e, t) => {
					z(i, `${e ?? ""} `), z(s, `${t ?? ""}%`), W(c, F(a).props.parallax ?? .3);
				}, [() => K("lbl.parallaxStrength"), () => Math.round((F(a).props.parallax ?? 0) * 100)]), I("input", c, (e) => T(t.bg, o, "parallax", Number(e.target.value))), R(e, n);
			};
			B(ie, (e) => {
				(F(a).props.parallax ?? 0) > 0 && e(ae);
			}), P((e, t, n, o, s, u, p, m, v, S, T, ie, ae, oe) => {
				G(r, "title", e), z(i, `${t ?? ""} `), G(c, "title", n), z(l, `${o ?? ""} `), G(d, "title", s), z(f, `${u ?? ""} `), z(h, `${p ?? ""} `), z(g, `${m ?? ""}%`), W(_, F(a).props.x ?? .5), z(y, `${v ?? ""} `), z(b, `${S ?? ""}%`), W(x, F(a).props.y ?? .5), z(C, `${T ?? ""} `), z(w, `${ie ?? ""}%`), W(ee, F(a).props.opacity ?? 1), G(te, "title", ae), Vi(ne, (F(a).props.parallax ?? 0) > 0), z(re, ` ${oe ?? ""}`);
			}, [
				() => K("tip.bg.videoFile"),
				() => F(a).props.src ? K("ui.changeVideo") : K("ui.chooseVideo"),
				() => K("tip.bg.poster"),
				() => F(a).props.poster ? K("ui.changeImage") : K("ui.choosePoster"),
				() => K("tip.bg.fit"),
				() => K("lbl.imageFit"),
				() => K("lbl.horizontal"),
				() => Math.round((F(a).props.x ?? .5) * 100),
				() => K("lbl.vertical"),
				() => Math.round((F(a).props.y ?? .5) * 100),
				() => K("lbl.strength"),
				() => Math.round((F(a).props.opacity ?? 1) * 100),
				() => K("tip.bg.parallax"),
				() => K("lbl.parallax")
			]), I("change", s, (e) => ye(t.bg, o, e)), I("change", u, (e) => be(t.bg, o, e)), I("input", _, (e) => T(t.bg, o, "x", Number(e.target.value))), I("input", x, (e) => T(t.bg, o, "y", Number(e.target.value))), I("input", ee, (e) => T(t.bg, o, "opacity", Number(e.target.value))), I("change", ne, (e) => T(t.bg, o, "parallax", e.target.checked ? .3 : 0)), R(e, n);
		};
		B(_, (e) => {
			F(a).type === "color" ? e(v) : F(a).type === "gradient" ? e(b, 1) : F(a).type === "glow" ? e(x, 2) : F(a).type === "grain" ? e(S, 3) : F(a).type === "pattern" ? e(ne, 4) : F(a).type === "image" ? e(se, 5) : F(a).type === "slideshow" ? e(me, 6) : F(a).type === "video" && e(xe, 7);
		}), E(s), P((e, n, r) => {
			G(p, "title", e), G(m, "title", n), m.disabled = o === t.layers.length - 1, G(g, "title", r);
		}, [
			() => K("hint.bg.order"),
			() => K("hint.bg.order"),
			() => K("tip.bg.removeLayer")
		]), I("click", p, () => w(t.bg, o, -1)), I("click", m, () => w(t.bg, o, 1)), I("click", g, () => C(t.bg, o)), R(e, s);
	});
	var je = N(Ae, 2), Me = A(je), Ne = N(Me);
	{
		let e = /* @__PURE__ */ D(() => u.map(([e, t]) => [e, t.labelKey ? K(t.labelKey) : t.label]));
		J(Ne, {
			get value() {
				return F(x);
			},
			get options() {
				return F(e);
			},
			onchange: (e) => k(x, e, !0)
		});
	}
	E(je);
	var Pe = N(je, 2), Fe = M(Pe, !0);
	P((e, t) => {
		z(Me, `${e ?? ""} `), z(Fe, t);
	}, [() => K("lbl.newLayer"), () => K("ui.addLayer")]), I("click", Pe, () => S(t.bg, F(x))), R(e, ke), ot();
}
Vr([
	"change",
	"click",
	"input",
	"pointerdown"
]);
//#endregion
//#region src/panels/NavPanel.svelte
var lf = /* @__PURE__ */ L("<input/> <span class=\"toolbar-row\"><!> <input type=\"number\" class=\"tb-num\" min=\"8\" max=\"96\" placeholder=\"px\"/> <button><b> </b></button> <button><i> </i></button></span>", 1), uf = /* @__PURE__ */ L("<img alt=\"\"/>"), df = /* @__PURE__ */ L("<span class=\"logo-file\"> </span>"), ff = /* @__PURE__ */ L("<div class=\"logo-pick\"><span class=\"logo-thumb\"><!></span> <span class=\"logo-pick-col\"><label class=\"ghost filepick\"> <input type=\"file\" accept=\"image/*\"/></label> <!></span></div> <div class=\"ctl-triple\"><div class=\"ctl-field\"><span class=\"mini-label\"> </span> <input type=\"number\" class=\"tb-num\" min=\"12\" max=\"128\"/></div> <div class=\"ctl-field\"><span class=\"mini-label\"> </span> <input type=\"number\" class=\"tb-num\"/></div> <div class=\"ctl-field\"><span class=\"mini-label\"> </span> <input type=\"number\" class=\"tb-num\" min=\"0\" max=\"64\"/></div></div>", 1), pf = /* @__PURE__ */ L("<button type=\"button\"><!><span> </span></button>"), mf = /* @__PURE__ */ L("<span class=\"toolbar-row\"><span class=\"mini-label tb-grow\"> </span> <input type=\"number\" class=\"tb-num\" placeholder=\"1100\"/></span>"), hf = /* @__PURE__ */ L("<!> <!> <span class=\"toolbar-row\"><span class=\"mini-label tb-grow\"> </span> <input type=\"number\" class=\"tb-num\"/></span>", 1), gf = /* @__PURE__ */ L("<label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label>", 1), _f = /* @__PURE__ */ L("<!> <span class=\"toolbar-row\"><span class=\"mini-label tb-grow\"> </span> <input type=\"number\" class=\"tb-num\"/></span>", 1), vf = /* @__PURE__ */ L("<button> </button>"), yf = /* @__PURE__ */ L("<div class=\"ctl-row\"><span class=\"mini-label ctl-name\"> </span> <input type=\"range\"/> <input type=\"number\" class=\"tb-num\"/></div>"), bf = /* @__PURE__ */ L("<div class=\"ctl-pair\"><div class=\"ctl-field\"><span class=\"mini-label\"> </span> <input type=\"number\" class=\"tb-num\"/></div> <div class=\"ctl-field\"><span class=\"mini-label\"> </span> <input type=\"number\" class=\"tb-num\"/></div></div>"), xf = /* @__PURE__ */ L("<span class=\"toolbar-row ctl-end\"><span class=\"mini-label\"> </span> <input type=\"number\" class=\"tb-num\" min=\"1\" max=\"8\"/> <span class=\"mini-label\"> </span> <!></span>"), Sf = /* @__PURE__ */ L("<div class=\"ctl-field\"><span class=\"mini-label\"> </span> <div class=\"tile-grid cols-5\" role=\"group\"></div></div> <!>", 1), Cf = /* @__PURE__ */ L("<label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label>"), wf = /* @__PURE__ */ L("<div class=\"ctl-row\"><span class=\"mini-label ctl-name\"> </span> <input type=\"range\" min=\"30\" max=\"80\" step=\"5\"/> <span class=\"gridmenu-value\"> </span></div> <div class=\"ctl-row\"><span class=\"mini-label ctl-name\"> </span> <input type=\"range\" min=\"0\" max=\"400\" step=\"10\"/> <span class=\"gridmenu-value\"> </span></div> <div class=\"ctl-row\"><span class=\"mini-label ctl-name\"> </span> <input type=\"range\" min=\"0\" max=\"1200\" step=\"20\"/> <span class=\"gridmenu-value\"> </span></div> <!>", 1), Tf = /* @__PURE__ */ L("<!> <!>", 1), Ef = /* @__PURE__ */ L("<div class=\"mini-card\"><span class=\"mini-label\"> </span> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label></div>"), Df = /* @__PURE__ */ L("<div class=\"ctl-field\"><span class=\"mini-label\"> </span> <input type=\"number\" class=\"tb-num\"/></div>"), Of = /* @__PURE__ */ L("<label class=\"field-stack\"><span class=\"mini-label\"> </span> <!></label>"), kf = /* @__PURE__ */ L("<label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!> <!> <!> <!> <div class=\"ctl-row\"><span class=\"mini-label ctl-name\"> </span> <!> <input type=\"range\" min=\"0\" max=\"100\" step=\"1\"/> <span class=\"gridmenu-value\"> </span></div> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <label> <!></label>", 1), Af = /* @__PURE__ */ L("<button type=\"button\"><span> </span><span> </span></button>"), jf = /* @__PURE__ */ L("<div class=\"ctl-row\"><span class=\"mini-label ctl-name\"> </span> <input type=\"range\" min=\"0.1\" max=\"1\" step=\"0.01\"/> <span class=\"gridmenu-value\"> </span></div>"), Mf = /* @__PURE__ */ L("<div class=\"swatch-cell\"><!> <span class=\"mini-label\"> </span></div>"), Nf = /* @__PURE__ */ L("<label class=\"field-stack\"><span class=\"mini-label\"> </span> <input type=\"text\" class=\"field-filled\" placeholder=\"https://\"/></label>"), Pf = /* @__PURE__ */ L("<button class=\"ghost\"> </button>"), Ff = /* @__PURE__ */ L("<label class=\"field-stack\"><span class=\"mini-label\"> </span> <input type=\"text\" class=\"field-filled\"/></label> <label> <!></label> <!> <!> <!> <!> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!> <label> <!></label> <label> <!></label>", 1), If = /* @__PURE__ */ L("<span class=\"tool-move\"><button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button></span>"), Lf = /* @__PURE__ */ L("<div class=\"mini-card\"><span class=\"tool-head\"><span class=\"mini-label\"> </span><!></span> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label></div>"), Rf = /* @__PURE__ */ L("<div class=\"mini-card\"><span class=\"tool-head\"><span class=\"mini-label\"> </span><!></span> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <button class=\"ghost action\"> </button></div>"), zf = /* @__PURE__ */ L("<div class=\"mini-card\"><span class=\"tool-head\"><span class=\"mini-label\"> </span><!></span> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!></div>"), Bf = /* @__PURE__ */ L("<label class=\"field-stack\"><span class=\"mini-label\"> </span> <input type=\"text\" class=\"field-filled\"/></label>"), Vf = /* @__PURE__ */ L("<span class=\"lrow-warn\"></span>"), Hf = /* @__PURE__ */ L("<span class=\"lrow-tile-mark\"><!></span> <span class=\"lrow-tile-name\"> </span>", 1), Uf = /* @__PURE__ */ L("<span class=\"bad-target-note\"> </span>"), Wf = /* @__PURE__ */ L("<div class=\"lrow-body\"><!> <div class=\"lrow-fields\"><input class=\"field-filled\"/> <input/> <!> <span class=\"lrow-actions\"><!> <button class=\"linkish danger\"> </button></span></div></div>"), Gf = /* @__PURE__ */ L("<div><div class=\"lrow-head\" role=\"button\" tabindex=\"0\"><span class=\"lrow-mark\" aria-hidden=\"true\"><!></span> <span class=\"lrow-name\"> </span> <!> <span class=\"row-tools\" role=\"none\"><button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button></span> <span class=\"lrow-chev\" aria-hidden=\"true\"></span></div> <!></div>"), Kf = /* @__PURE__ */ L("<div class=\"ctl-field\"><span class=\"mini-label\"> </span> <div class=\"tile-grid cols-3\" role=\"group\"></div></div> <!> <div class=\"ctl-row\"><span class=\"mini-label ctl-name\"> </span> <input type=\"range\" min=\"1\" max=\"24\" step=\"1\"/> <span class=\"gridmenu-value\"> </span></div> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!> <div class=\"mini-card\"><span class=\"mini-label\"> </span> <span class=\"lbtn-pick\"><!> <span class=\"lbtn-name\"><!></span></span></div> <!> <button class=\"ghost action\"> </button>", 1), qf = /* @__PURE__ */ L("<details class=\"group sub-fold\"><summary><span class=\"tool-head\"> <!></span></summary> <div class=\"group-items\"><label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!></div></details>"), Jf = /* @__PURE__ */ L("<label> <!></label>"), Yf = /* @__PURE__ */ L("<div aria-hidden=\"true\"><span class=\"nav-grip\"></span> <div class=\"nav-item-main\"><span class=\"nav-item-name ghost-name\"> </span> <span class=\"ghost-target\"> </span></div></div>"), Xf = /* @__PURE__ */ L("<input class=\"nav-item-href\"/>"), Zf = /* @__PURE__ */ L("<span class=\"nav-item-sub\"></span>"), Qf = /* @__PURE__ */ L("<!> <div><span class=\"nav-grip\" draggable=\"true\"></span> <div class=\"nav-item-main\"><input class=\"nav-item-name\"/> <div class=\"nav-item-target\"><!> <!></div></div> <span class=\"nav-actions\"><button class=\"ghost nav-act\"></button> <button class=\"ghost nav-act\"></button> <button class=\"ghost nav-act\"></button></span> <button class=\"ghost row-tool nav-more\"></button></div> <!>", 1), $f = /* @__PURE__ */ L("<!> <div><span class=\"nav-grip\" draggable=\"true\"></span> <div class=\"nav-item-main\"><input class=\"nav-item-name\"/> <div class=\"nav-item-target\"><!> <!></div></div> <!> <span class=\"nav-actions\"><button class=\"ghost nav-act\"></button> <button class=\"ghost nav-act\"></button> <button class=\"ghost nav-act\"></button> <button class=\"ghost nav-act\"></button></span> <button class=\"ghost row-tool nav-more\"></button></div> <!> <!> <!>", 1), ep = /* @__PURE__ */ L("<div class=\"panel-body\"><details class=\"group\"><summary> </summary> <div class=\"group-items\"><!> <!> <!> <!></div></details> <details class=\"group\"><summary> </summary> <div class=\"group-items\"><details class=\"group frame-group sub-fold\"><summary> </summary> <div class=\"group-items\"><div class=\"ctl-field\"><span class=\"mini-label\"> </span> <div class=\"tile-grid cols-3\" role=\"group\"></div></div> <!> <!> <!> <!> <!></div></details> <hr class=\"gridmenu-divider\"/> <details class=\"group frame-group sub-fold\"><summary> </summary> <div class=\"group-items\"><div class=\"seg cw-seg\"></div> <details class=\"sub-inset\"><summary> </summary> <div class=\"sub-inset-body\"><!> <div class=\"ctl-row\"><span class=\"mini-label ctl-name\"> </span> <input type=\"range\"/> <input type=\"number\" class=\"tb-num\"/></div> <!></div></details></div></details> <hr class=\"gridmenu-divider\"/> <details class=\"group frame-group sub-fold\"><summary> </summary> <div class=\"group-items\"><!> <!></div></details> <hr class=\"gridmenu-divider\"/> <details class=\"group frame-group sub-fold\"><summary> </summary> <div class=\"group-items\"><!></div></details> <hr class=\"gridmenu-divider\"/> <details class=\"group frame-group sub-fold\"><summary> </summary> <div class=\"group-items\"><div class=\"ctl-pair\"><!> <div class=\"ctl-field\"><span class=\"mini-label\"> </span> <input type=\"number\" class=\"tb-num\"/></div></div> <div class=\"ctl-pair\"><label class=\"field-stack\"><span class=\"mini-label\"> </span> <!></label> <label class=\"field-stack\"><span class=\"mini-label\"> </span> <!></label></div> <div class=\"ctl-pair\"><label class=\"field-stack\"><span class=\"mini-label\"> </span> <!></label> <!></div> <div class=\"ctl-pair\"><label class=\"field-stack\"><span class=\"mini-label\"> </span> <!></label></div> <!> <div class=\"ctl-pair\"><label class=\"field-stack\"><span class=\"mini-label\"> </span> <!></label> <!></div> <!> <!></div></details> <hr class=\"gridmenu-divider\"/> <details class=\"group frame-group sub-fold\"><summary> </summary> <div class=\"group-items\"><div class=\"ctl-field\"><span class=\"mini-label\"> </span> <div class=\"tile-grid cols-5\" role=\"group\"></div></div> <!> <div class=\"swatch-row\"><!> <div class=\"swatch-cell\"><!> <span class=\"mini-label\"> </span></div> <div class=\"swatch-cell\"><!> <span class=\"mini-label\"> </span></div></div> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label></div></details> <hr class=\"gridmenu-divider\"/> <details class=\"group frame-group sub-fold\"><summary> </summary> <div class=\"group-items\"><!></div></details></div></details> <details class=\"group\"><summary> </summary> <div class=\"group-items\"><label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!></div></details> <details class=\"group\"><summary> </summary> <div class=\"group-items\"><!>  <!></div></details> <details class=\"group\"><summary> </summary> <div class=\"group-items\"><div class=\"ctl-field\"><span class=\"mini-label\"> </span> <div role=\"group\"></div></div> <!> <!> <label> <input type=\"number\" min=\"1\" max=\"4\"/></label></div></details> <details class=\"group\"><summary> </summary> <div class=\"group-items\"><div class=\"nav-list\" role=\"list\"></div> <button class=\"ghost action\"> </button> <span class=\"toolbar-row\"><input class=\"tb-grow\"/> <button class=\"ghost action\"> </button></span></div></details></div>");
function tp(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.siteDraft), i = /* @__PURE__ */ D(() => n.bridge), { addPage: a, compressOrTrim: o, navBgCtx: s, setStatus: c, siteMutate: l, themeSwatches: u } = n, d = (e) => `<svg width="40" height="26" viewBox="0 0 40 26" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${e}</svg>`, p = {
		bar: d("<rect x=\"1\" y=\"1\" width=\"38\" height=\"7\" rx=\"1\"/><rect x=\"1\" y=\"11\" width=\"38\" height=\"14\" rx=\"1\" stroke-opacity=\"0.35\"/>"),
		floating: d("<rect x=\"5\" y=\"2\" width=\"30\" height=\"7\" rx=\"3.5\"/><rect x=\"1\" y=\"11\" width=\"38\" height=\"14\" rx=\"1\" stroke-opacity=\"0.35\"/>"),
		"floating-square": d("<rect x=\"5\" y=\"2\" width=\"30\" height=\"7\"/><rect x=\"1\" y=\"11\" width=\"38\" height=\"14\" rx=\"1\" stroke-opacity=\"0.35\"/>"),
		"floating-tab": d("<path d=\"M5 1h30v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z\"/><rect x=\"1\" y=\"11\" width=\"38\" height=\"14\" rx=\"1\" stroke-opacity=\"0.35\"/>"),
		"side-left": d("<rect x=\"1\" y=\"1\" width=\"9\" height=\"24\" rx=\"1\"/><rect x=\"13\" y=\"1\" width=\"26\" height=\"24\" rx=\"1\" stroke-opacity=\"0.35\"/>"),
		"side-right": d("<rect x=\"30\" y=\"1\" width=\"9\" height=\"24\" rx=\"1\"/><rect x=\"1\" y=\"1\" width=\"26\" height=\"24\" rx=\"1\" stroke-opacity=\"0.35\"/>")
	}, m = {
		"": d("<rect x=\"1\" y=\"4\" width=\"38\" height=\"18\" rx=\"1\" stroke-opacity=\"0.35\"/>"),
		bottom: d("<rect x=\"1\" y=\"4\" width=\"38\" height=\"18\" rx=\"1\" stroke-opacity=\"0.35\"/><path d=\"M1 22h38\" stroke-width=\"2.5\"/>"),
		top: d("<rect x=\"1\" y=\"4\" width=\"38\" height=\"18\" rx=\"1\" stroke-opacity=\"0.35\"/><path d=\"M1 4h38\" stroke-width=\"2.5\"/>"),
		both: d("<rect x=\"1\" y=\"4\" width=\"38\" height=\"18\" rx=\"1\" stroke-opacity=\"0.35\"/><path d=\"M1 4h38M1 22h38\" stroke-width=\"2.5\"/>"),
		all: d("<rect x=\"1\" y=\"4\" width=\"38\" height=\"18\" rx=\"1\" stroke-width=\"2.5\"/>")
	}, h = (e) => `<svg width="48" height="34" viewBox="0 0 48 34" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${e}</svg>`, _ = {
		card: h("<path d=\"M14 1h20\" stroke-opacity=\"0.5\"/><rect x=\"10\" y=\"6\" width=\"28\" height=\"24\" rx=\"3\" fill=\"currentColor\" fill-opacity=\"0.18\"/><path d=\"M15 13h18M15 19h14M15 25h16\" stroke-opacity=\"0.8\"/>"),
		flat: h("<path d=\"M14 1h20\" stroke-opacity=\"0.5\"/><rect x=\"1\" y=\"6\" width=\"46\" height=\"24\" fill=\"currentColor\" fill-opacity=\"0.12\" stroke=\"none\"/><path d=\"M15 13h18M15 19h14M15 25h16\" stroke-opacity=\"0.8\"/>"),
		pills: h("<path d=\"M14 1h20\" stroke-opacity=\"0.5\"/><rect x=\"10\" y=\"7\" width=\"28\" height=\"6\" rx=\"3\" fill=\"currentColor\" fill-opacity=\"0.35\" stroke=\"none\"/><rect x=\"10\" y=\"16\" width=\"28\" height=\"6\" rx=\"3\" fill=\"currentColor\" fill-opacity=\"0.2\" stroke=\"none\"/><rect x=\"10\" y=\"25\" width=\"28\" height=\"6\" rx=\"3\" fill=\"currentColor\" fill-opacity=\"0.2\" stroke=\"none\"/>"),
		lines: h("<path d=\"M14 1h20\" stroke-opacity=\"0.5\"/><path d=\"M12 12h24M12 21h24M12 30h24\" stroke-opacity=\"0.8\"/>"),
		flyout: h("<path d=\"M14 1h20\" stroke-opacity=\"0.5\"/><rect x=\"1\" y=\"6\" width=\"46\" height=\"24\" fill=\"currentColor\" fill-opacity=\"0.12\" stroke=\"none\"/><path d=\"M6 13h10M6 19h8M22 13h10M22 19h8M38 13h6M38 19h4\" stroke-opacity=\"0.8\"/>")
	}, v = {
		grid: h("<rect x=\"1\" y=\"1\" width=\"46\" height=\"32\" rx=\"3\" stroke-opacity=\"0.35\"/><rect x=\"6\" y=\"6\" width=\"10\" height=\"10\" rx=\"2.5\" fill=\"currentColor\" fill-opacity=\"0.3\" stroke=\"none\"/><rect x=\"19\" y=\"6\" width=\"10\" height=\"10\" rx=\"2.5\" fill=\"currentColor\" fill-opacity=\"0.3\" stroke=\"none\"/><rect x=\"32\" y=\"6\" width=\"10\" height=\"10\" rx=\"2.5\" fill=\"currentColor\" fill-opacity=\"0.3\" stroke=\"none\"/><path d=\"M7 20h8M20 20h8M33 20h8\" stroke-opacity=\"0.7\"/><path d=\"M6 26h10M19 26h10M32 26h10\" stroke-opacity=\"0.35\"/>"),
		list: h("<rect x=\"1\" y=\"1\" width=\"46\" height=\"32\" rx=\"3\" stroke-opacity=\"0.35\"/><rect x=\"6\" y=\"6\" width=\"7\" height=\"7\" rx=\"2\" fill=\"currentColor\" fill-opacity=\"0.3\" stroke=\"none\"/><rect x=\"6\" y=\"17\" width=\"7\" height=\"7\" rx=\"2\" fill=\"currentColor\" fill-opacity=\"0.3\" stroke=\"none\"/><path d=\"M17 9.5h24M17 20.5h18\" stroke-opacity=\"0.7\"/>"),
		cover: h("<rect x=\"1\" y=\"1\" width=\"46\" height=\"32\" rx=\"3\" stroke-opacity=\"0.35\"/><rect x=\"6\" y=\"6\" width=\"16\" height=\"12\" rx=\"2.5\" fill=\"currentColor\" fill-opacity=\"0.3\" stroke=\"none\"/><rect x=\"26\" y=\"6\" width=\"16\" height=\"12\" rx=\"2.5\" fill=\"currentColor\" fill-opacity=\"0.3\" stroke=\"none\"/><path d=\"M6 14h16M26 14h16\" stroke-opacity=\"0.55\" stroke-width=\"3\"/><path d=\"M6 23h12M26 23h12\" stroke-opacity=\"0.35\"/>")
	}, y = /* @__PURE__ */ O("");
	function b() {
		F(y).trim() && (n.newPageTitle = F(y), n.newPageTemplate = null, a() !== !1 && k(y, ""));
	}
	function x(e) {
		l("edit:nav-logo", () => {
			F(r).nav.logo = {
				type: "text",
				value: "",
				...F(r).nav.logo,
				...e
			};
		});
	}
	function S(e) {
		l("nav", () => {
			F(r).nav.logo ??= {
				type: "text",
				value: F(r).site.title
			};
			let t = F(r).nav.logo, n = t.type === "image";
			e === "both" ? (n && (t.image = t.value, t.value = F(r).site.title), t.image ??= "", t.size ??= 32) : e === "image" ? (n || (t.value = t.image ?? ""), delete t.image, t.size ??= 32) : (n && (t.value = F(r).site.title), delete t.image), t.type = e;
		});
	}
	async function C(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", t) try {
			let e = await o(t);
			l("nav", () => {
				let t = F(r).nav.logo;
				t.type === "both" ? t.image = e.dataUrl : t.value = e.dataUrl;
			});
		} catch {
			c(K("status.imageReadErrorSvg"), "error");
		}
	}
	function w(e) {
		l("nav", () => {
			F(r).nav.layout = e;
		});
	}
	let ee = (e) => e !== "theme" || !!F(r).theme?.alt?.tokens, T = /* @__PURE__ */ D(() => Ks(F(r)?.nav?.style ?? {}).filter(ee));
	function te(e, t) {
		let n = Ks(F(r).nav.style ?? {}), i = n.indexOf(e), a = i + t;
		for (; a >= 0 && a < n.length && !ee(n[a]);) a += t;
		i < 0 || a < 0 || a >= n.length || ([n[i], n[a]] = [n[a], n[i]], ne("order", n));
	}
	function ne(e, t) {
		l(`edit:nav-tools-${e}`, () => {
			F(r).nav.style ??= {};
			let n = { ...F(r).nav.style.tools ?? {} };
			t === void 0 ? delete n[e] : n[e] = t, Object.keys(n).length ? F(r).nav.style.tools = n : delete F(r).nav.style.tools;
		});
	}
	function re(e, t) {
		l(`edit:nav-style-${e}`, () => {
			F(r).nav.style ??= {}, t === void 0 ? delete F(r).nav.style[e] : F(r).nav.style[e] = t;
		});
	}
	let ie = /* @__PURE__ */ D(() => F(r)?.nav?.variant === "side-left" || F(r)?.nav?.variant === "side-right"), ae = /* @__PURE__ */ D(() => [
		"floating",
		"floating-square",
		"floating-tab"
	].includes(F(r)?.nav?.variant)), oe = /* @__PURE__ */ D(() => Vl(F(r)?.nav?.style)), se = /* @__PURE__ */ D(() => zl(F(r)?.nav?.style, F(r)?.nav?.variant)), ce = /* @__PURE__ */ D(() => Bl(F(r)?.nav?.style));
	function le(e) {
		l("nav", () => {
			F(r).nav.style ??= {}, e === "md" ? delete F(r).nav.style.size : F(r).nav.style.size = e, delete F(r).nav.style.padY, delete F(r).nav.style.textSize;
		});
	}
	function ue(e, t, n) {
		let i = e.target.value;
		re(t, i === "" ? void 0 : Rl(i, n, void 0)), e.target.value = F(r).nav.style?.[t] ?? "";
	}
	function de(e, t) {
		l(`edit:nav-mobile-${e}`, () => {
			F(r).nav.style ??= {};
			let n = { ...F(r).nav.style.mobile ?? {} };
			t === void 0 ? delete n[e] : n[e] = t, Object.keys(n).length ? F(r).nav.style.mobile = n : delete F(r).nav.style.mobile;
		});
	}
	let fe = (e) => {
		let t = F(r)?.nav?.style?.mobile?.[e];
		return t === void 0 ? "" : t ? "on" : "off";
	}, pe = (e, t) => de(e, t === "" ? void 0 : t === "on"), me = (e) => de("border", e ? {
		...F(r).nav.style?.mobile?.border ?? {},
		side: e
	} : void 0);
	function he(e, t) {
		l(`edit:nav-announce-${e}`, () => {
			let n = { ...F(r).nav.announcement ?? {} };
			t === void 0 ? delete n[e] : n[e] = t, Object.keys(n).length ? F(r).nav.announcement = n : delete F(r).nav.announcement;
		});
	}
	let ge = "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"currentColor\" aria-hidden=\"true\">" + [
		6,
		12,
		18
	].flatMap((e) => [
		6,
		12,
		18
	].map((t) => `<circle cx="${t}" cy="${e}" r="1.6"/>`)).join("") + "</svg>", _e = /* @__PURE__ */ O(null);
	function ve() {
		let e = F(r).nav?.launcher;
		return [e?.image, ...(e?.links ?? []).map((e) => e.image)].filter(Boolean);
	}
	function ye(e, t) {
		l("nav", () => {
			F(r).nav.launcher ??= { links: [] };
			let n = e === null ? F(r).nav.launcher : F(r).nav.launcher.links[e];
			t.image ? n.image = t.image : delete n.image, t.icon ? n.icon = t.icon : delete n.icon;
		});
	}
	function be(e, t) {
		l(`edit:nav-launcher-${e}`, () => {
			F(r).nav.launcher ??= { links: [] }, t === void 0 ? delete F(r).nav.launcher[e] : F(r).nav.launcher[e] = t;
		});
	}
	function xe() {
		l("nav", () => {
			F(r).nav.launcher ??= { links: [] }, F(r).nav.launcher.links ??= [], F(r).nav.launcher.links.push({
				label: K("seed.link"),
				href: "",
				icon: "globe"
			});
		});
	}
	function Se(e) {
		l("nav", () => {
			F(r).nav.launcher.links.splice(e, 1);
		});
	}
	function Ce(e, t) {
		l("nav", () => {
			let n = F(r).nav.launcher.links, i = e + t;
			i < 0 || i >= n.length || ([n[e], n[i]] = [n[i], n[e]]);
		});
	}
	function we(e, t, n) {
		l(`edit:nav-launcher-${t}-${e}`, () => {
			F(r).nav.launcher.links[e][t] = n;
		});
	}
	async function Te(e, t) {
		if (e) try {
			let n = await o(e);
			l("nav", () => {
				F(r).nav.launcher ??= { links: [] }, t === null ? F(r).nav.launcher.image = n.dataUrl : F(r).nav.launcher.links[t].image = n.dataUrl;
			});
		} catch {
			c(K("status.imageReadErrorSvg"), "error");
		}
	}
	function Ee(e, t) {
		l(`edit:nav-sheet-${e}`, () => {
			F(r).nav.style ??= {};
			let n = { ...F(r).nav.style.sheet ?? {} };
			t === void 0 ? delete n[e] : n[e] = t, Object.keys(n).length ? F(r).nav.style.sheet = n : delete F(r).nav.style.sheet;
		});
	}
	function De(e, t, n) {
		let r = e.target.value;
		re(t, r === "" ? void 0 : Rl(r, n, void 0)), e.target.value = F(t === "padY" ? se : ce);
	}
	function Oe(e, t, n) {
		let i = e.target.value;
		de(t, i === "" ? void 0 : Rl(i, n, void 0)), e.target.value = F(r).nav.style?.mobile?.[t] ?? "";
	}
	function ke(e) {
		let t = Rl(e / 100, Ol, .5);
		re("shrinkTo", t === .5 ? void 0 : t);
	}
	function je(e) {
		let t = Rl(e, kl, 80);
		re("shrinkAt", t === 80 ? void 0 : t);
	}
	function Me(e) {
		let t = Rl(e, Al, 220);
		re("shrinkMs", t === 220 ? void 0 : t);
	}
	let Ne = {
		underline: [K("hoverColor.underline.label"), K("hoverColor.underline.title")],
		pill: [K("hoverColor.pill.label"), K("hoverColor.pill.title")],
		lift: [K("hoverColor.lift.label"), K("hoverColor.lift.title")]
	}, Pe = /* @__PURE__ */ D(() => Ne[F(r)?.nav?.style?.hover] ?? null), Fe = /* @__PURE__ */ D(() => [
		["grid", K("opt.launcherView.grid")],
		["list", K("opt.launcherView.list")],
		["cover", K("opt.launcherView.cover")]
	]), Ie = /* @__PURE__ */ D(() => F(ie) ? [
		["card", K("common.standard")],
		["pills", K("opt.sub.pills")],
		["lines", K("opt.sub.lines")]
	] : [
		["card", K("opt.sub.card")],
		["flat", K("opt.sub.flat")],
		["pills", K("opt.sub.pills")],
		["lines", K("opt.sub.lines")],
		["flyout", K("opt.sub.flyout")]
	]);
	function Le(e) {
		(F(r).nav.variant ?? "bar") !== e && l("nav", () => {
			e === "bar" ? delete F(r).nav.variant : F(r).nav.variant = e, F(r).nav.style && delete F(r).nav.style.radius;
		});
	}
	function Re(e) {
		l("nav", () => {
			F(r).nav.style ??= {}, e ? F(r).nav.style.glow = !0 : delete F(r).nav.style.glow;
		});
	}
	function ze(e) {
		l("nav", () => {
			F(r).nav.style ??= {}, e ? delete F(r).nav.style.topGap : F(r).nav.style.topGap = !1;
		});
	}
	function Be(e) {
		l("nav", () => {
			F(r).nav.style ??= {}, e === "standard" ? delete F(r).nav.style.hover : F(r).nav.style.hover = e;
		});
	}
	function Ve(e, t) {
		l(`edit:nav-label-${e}`, () => {
			F(r).nav.items[e].label = t;
		});
	}
	function He(e, t) {
		l("nav", () => {
			let n = F(r).nav.items[e];
			t === "__href" ? (delete n.page, n.href = n.href ?? "https://") : t === "__none" ? (delete n.page, delete n.href) : (n.page = t, delete n.href);
		});
	}
	function Ue(e, t) {
		l(`edit:nav-href-${e}`, () => {
			F(r).nav.items[e].href = t;
		});
	}
	function We(e, t) {
		let n = e + t, i = F(r).nav.items;
		n < 0 || n >= i.length || l("nav", () => {
			[i[e], i[n]] = [i[n], i[e]];
		});
	}
	function Ge(e) {
		l("nav", () => {
			F(r).nav.items.splice(e, 1);
		});
	}
	let Ke = /* @__PURE__ */ O(""), qe = /* @__PURE__ */ O(""), Je = /* @__PURE__ */ O(null);
	function Ye(e) {
		let [t, n] = e.split(".").map(Number), i = F(r).nav.items;
		return n === void 0 ? {
			list: i,
			index: t,
			parent: null
		} : {
			list: i[t].children,
			index: n,
			parent: i[t]
		};
	}
	function Xe(e, t, n, r) {
		if (!F(qe) || F(qe) === t) return null;
		let i = e.getBoundingClientRect(), a = (r - i.top) / i.height, o = n - i.left, s = Ye(F(qe)), c = Ye(t), l = s.list[s.index], u;
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
		}, Ze(u, l, s);
	}
	function Ze(e, t, n) {
		let i = Ye(e.key);
		if (i.parent) {
			if (i.parent === t) return null;
			t.children?.length && (e = {
				key: e.key.split(".")[0],
				pos: "after"
			}, i = Ye(e.key));
		}
		let a = i.list[i.index];
		if (e.pos === "into") {
			let n = a.children ?? [];
			return n.length && n[n.length - 1] === t ? null : e;
		}
		let o = i.parent ? i.parent.children : F(r).nav.items, s = o.filter((e) => e !== t).indexOf(a) + +(e.pos === "after");
		return o === n.list && s === n.index ? null : e;
	}
	function Qe() {
		if (!F(qe)) return {
			label: "",
			target: ""
		};
		let e = Ye(F(qe)), t = e.list[e.index], n = t.page ? F(r).pages.find((e) => e.id === t.page) : null;
		return {
			label: t.label,
			target: n ? n.title : t.href ?? K("opt.noLink")
		};
	}
	function $e(e) {
		F(Je) && e?.dataTransfer?.dropEffect !== "none" && nt(F(Je).key), k(qe, ""), k(Je, null);
	}
	Pn(() => {
		if (!F(qe)) return;
		let e = (e) => e.preventDefault();
		return window.addEventListener("dragover", e), window.addEventListener("drop", e), () => {
			window.removeEventListener("dragover", e), window.removeEventListener("drop", e);
		};
	});
	let et = "application/x-urd-nav-row";
	function tt(e) {
		if (!F(qe)) return;
		let t = [...e.currentTarget.querySelectorAll(".nav-item:not(.ghost)")];
		if (!t.length) return;
		let n = t.find((t) => {
			let n = t.getBoundingClientRect();
			return e.clientY >= n.top && e.clientY <= n.bottom;
		}), r = null;
		if (n) r = Xe(n, n.dataset.key, e.clientX, e.clientY);
		else {
			let n = Ye(F(qe)), i = n.list[n.index], a = t.find((t) => {
				let n = t.getBoundingClientRect();
				return n.top + n.height / 2 > e.clientY;
			});
			if (a) r = a.dataset.key === F(qe) ? null : Ze({
				key: a.dataset.key,
				pos: "before"
			}, i, n);
			else {
				let e = [...t].reverse().find((e) => !e.classList.contains("child"));
				r = e.dataset.key === F(qe) ? null : Ze({
					key: e.dataset.key,
					pos: "after"
				}, i, n);
			}
		}
		r ? (e.preventDefault(), (F(Je)?.key !== r.key || F(Je)?.pos !== r.pos) && k(Je, r, !0)) : k(Je, null);
	}
	function nt(e) {
		let t = F(qe), n = F(Je);
		if (k(qe, ""), k(Je, null), t && n && n.key === e && t !== e) {
			{
				let r = Ye(t), i = Ye(e), a = r.list[r.index];
				if (i.parent && (i.parent === a || a.children?.length) || n.pos === "into" && a.children?.length) return;
			}
			l("nav", () => {
				let i = F(r).nav.items, a = Ye(t), o = Ye(e), s = a.list[a.index], c = o.list[o.index];
				if (s !== c) {
					if (a.list.splice(a.index, 1), a.parent && a.parent.children.length === 0 && (delete a.parent.children, !a.parent.page && !a.parent.href && (a.parent.page = F(r).pages[0].id)), n.pos === "into") c.children ??= [], c.children.push(s);
					else {
						let e = o.parent ? o.parent.children : i, t = e.indexOf(c) + +(n.pos === "after");
						e.splice(t, 0, s);
					}
					!s.page && s.href == null && !s.children?.length && (s.page = F(r).pages[0].id);
				}
			}), k(Ke, "");
		}
	}
	let it = "<svg width=\"10\" height=\"16\" viewBox=\"0 0 10 16\" fill=\"currentColor\" aria-hidden=\"true\"><circle cx=\"3\" cy=\"3\" r=\"1.3\"/><circle cx=\"7\" cy=\"3\" r=\"1.3\"/><circle cx=\"3\" cy=\"8\" r=\"1.3\"/><circle cx=\"7\" cy=\"8\" r=\"1.3\"/><circle cx=\"3\" cy=\"13\" r=\"1.3\"/><circle cx=\"7\" cy=\"13\" r=\"1.3\"/></svg>";
	function st() {
		l("nav", () => {
			F(r).nav.items.push({
				label: K("seed.link"),
				page: F(r).pages[0].id
			});
		});
	}
	function ct(e) {
		l("nav", () => {
			let t = F(r).nav.items[e];
			t.children ??= [], t.children.push({
				label: K("seed.link"),
				page: F(r).pages[0].id
			});
		});
	}
	function lt(e, t, n) {
		l(`edit:nav-child-label-${e}-${t}`, () => {
			F(r).nav.items[e].children[t].label = n;
		});
	}
	function ut(e, t, n) {
		l("nav", () => {
			let i = F(r).nav.items[e].children[t];
			n === "__href" ? (delete i.page, i.href = i.href ?? "https://") : (i.page = n, delete i.href);
		});
	}
	function dt(e, t, n) {
		l(`edit:nav-child-href-${e}-${t}`, () => {
			F(r).nav.items[e].children[t].href = n;
		});
	}
	function ft(e, t, n) {
		let i = t + n, a = F(r).nav.items[e].children;
		i < 0 || i >= a.length || l("nav", () => {
			[a[t], a[i]] = [a[i], a[t]];
		});
	}
	function pt(e, t) {
		l("nav", () => {
			let n = F(r).nav.items[e];
			n.children.splice(t, 1), n.children.length === 0 && (delete n.children, !n.page && !n.href && (n.page = F(r).pages[0].id));
		});
	}
	var mt = ep(), ht = A(mt), gt = A(ht), _t = M(gt, !0), vt = N(gt, 2), yt = A(vt);
	{
		let e = /* @__PURE__ */ D(() => K("common.type")), t = /* @__PURE__ */ D(() => F(r).nav.logo?.type ?? "text"), n = /* @__PURE__ */ D(() => [
			["text", K("blocks.text")],
			["image", K("blocks.image")],
			["both", K("opt.logo.both")]
		]);
		Wl(yt, {
			get label() {
				return F(e);
			},
			get value() {
				return F(t);
			},
			get options() {
				return F(n);
			},
			onchange: (e) => S(e)
		});
	}
	var bt = N(yt, 2), xt = (e) => {
		var t = lf(), n = j(t);
		U(n);
		var i = N(n, 2), a = A(i);
		{
			let e = /* @__PURE__ */ D(() => K("tip.nav.logoFont")), t = /* @__PURE__ */ D(() => F(r).nav.logo?.font ?? ""), n = /* @__PURE__ */ D(() => [["", K("common.inherit")], ...Gl.map(([e, t]) => [t, K(e)])]);
			J(a, {
				get title() {
					return F(e);
				},
				get value() {
					return F(t);
				},
				get options() {
					return F(n);
				},
				onchange: (e) => x({ font: e || void 0 })
			});
		}
		var o = N(a, 2);
		U(o);
		var s = N(o, 2);
		let c;
		var l = M(A(s), !0);
		E(s);
		var u = N(s, 2);
		let d;
		var f = M(A(u), !0);
		E(u), E(i), P((e, t, i, a, p, m, h) => {
			W(n, F(r).nav.logo?.value ?? ""), G(n, "placeholder", e), G(o, "title", t), W(o, F(r).nav.logo?.textSize ?? ""), c = H(s, 1, "tbtn", null, c, { active: F(r).nav.logo?.bold !== !1 }), G(s, "title", i), z(l, a), d = H(u, 1, "tbtn", null, d, { active: p }), G(u, "title", m), z(f, h);
		}, [
			() => K("ph.nav.logoName"),
			() => K("tip.nav.textSize"),
			() => K("format.bold"),
			() => K("format.boldLetter"),
			() => !!F(r).nav.logo?.italic,
			() => K("format.italic"),
			() => K("format.italicLetter")
		]), I("input", n, (e) => x({ value: e.target.value })), I("change", o, (e) => x({ textSize: e.target.value ? Number(e.target.value) : void 0 })), I("click", s, () => x({ bold: F(r).nav.logo?.bold === !1 })), I("click", u, () => x({ italic: !F(r).nav.logo?.italic })), R(e, t);
	};
	B(bt, (e) => {
		(F(r).nav.logo?.type ?? "text") !== "image" && e(xt);
	});
	var St = N(bt, 2), Ct = (e) => {
		let t = /* @__PURE__ */ D(() => F(r).nav.logo?.type === "image" ? F(r).nav.logo?.value : F(r).nav.logo?.image);
		var n = ff(), i = j(n), a = A(i), o = A(a), s = (e) => {
			var n = uf();
			P(() => G(n, "src", F(t))), R(e, n);
		};
		B(o, (e) => {
			F(t) && e(s);
		}), E(a);
		var c = N(a, 2), l = A(c), u = A(l), d = N(u);
		E(l);
		var f = N(l, 2), p = (e) => {
			var n = df(), r = M(n, !0);
			P((e) => z(r, e), [() => F(t).split("/").pop()]), R(e, n);
		};
		B(f, (e) => {
			F(t) && e(p);
		}), E(c), E(i);
		var m = N(i, 2), h = A(m), g = A(h), _ = M(g, !0), v = N(g, 2);
		U(v), E(h);
		var y = N(h, 2), b = A(y), S = M(b, !0), w = N(b, 2);
		U(w), E(y);
		var ee = N(y, 2), T = A(ee), te = M(T, !0), ne = N(T, 2);
		U(ne), E(ee), E(m), P((e, t, n, i, a, o, s, c, d) => {
			G(l, "title", e), z(u, `${t ?? ""} `), G(h, "title", n), z(_, i), W(v, F(r).nav.logo?.size ?? 32), G(y, "title", a), z(S, o), G(w, "min", Nl.min), G(w, "max", Nl.max), G(w, "placeholder", s), W(w, F(r).nav.logo?.mobileSize ?? ""), G(ee, "title", c), z(te, d), W(ne, F(r).nav.logo?.radius ?? 0);
		}, [
			() => K("tip.webpAuto"),
			() => F(t) ? K("ui.changeImage") : K("ui.chooseImage"),
			() => K("tip.nav.logoHeight"),
			() => K("lbl.height"),
			() => K("tip.nav.logoHeightMobile"),
			() => K("lbl.onMobile"),
			() => K("lbl.navSameAsDesktop"),
			() => K("tip.nav.logoRadius"),
			() => K("lbl.rounding")
		]), I("change", d, C), I("change", v, (e) => x({ size: Number(e.target.value) })), I("change", w, (e) => {
			let t = e.target.value;
			x({ mobileSize: t === "" ? void 0 : Rl(t, Nl, void 0) }), e.target.value = F(r).nav.logo?.mobileSize ?? "";
		}), I("change", ne, (e) => x({ radius: Number(e.target.value) })), R(e, n);
	};
	B(St, (e) => {
		(F(r).nav.logo?.type ?? "text") !== "text" && e(Ct);
	});
	var wt = N(St, 2), Tt = (e) => {
		{
			let t = /* @__PURE__ */ D(() => K("lbl.order")), n = /* @__PURE__ */ D(() => F(r).nav.logo?.order ?? "image-first"), i = /* @__PURE__ */ D(() => [["image-first", K("opt.logo.imageFirst")], ["text-first", K("opt.logo.textFirst")]]);
			Wl(e, {
				get label() {
					return F(t);
				},
				get value() {
					return F(n);
				},
				get options() {
					return F(i);
				},
				onchange: (e) => x({ order: e })
			});
		}
	};
	B(wt, (e) => {
		F(r).nav.logo?.type === "both" && e(Tt);
	}), E(vt), E(ht);
	var Et = N(ht, 2), Dt = A(Et), Ot = M(Dt, !0), kt = N(Dt, 2), At = A(kt), jt = A(At), Mt = M(jt, !0), Nt = N(jt, 2), Pt = A(Nt), Ft = A(Pt), It = M(Ft, !0), Lt = N(Ft, 2);
	di(Lt, 21, () => [
		["bar", K("opt.navVariant.bar")],
		["floating", K("opt.navVariant.floating")],
		["floating-square", K("opt.navVariant.floatingSquare")],
		["floating-tab", K("opt.navVariant.floatingTab")],
		["side-left", K("opt.navVariant.sideLeft")],
		["side-right", K("opt.navVariant.sideRight")]
	], ([e, t]) => e, (e, t) => {
		var n = /* @__PURE__ */ D(() => g(F(t), 2));
		let i = () => F(n)[0], a = () => F(n)[1];
		var o = pf();
		let s;
		var c = A(o);
		V(c, () => p[i()]);
		var l = M(N(c), !0);
		E(o), P(() => {
			s = H(o, 1, "tile", null, s, { on: (F(r).nav.variant ?? "bar") === i() }), G(o, "aria-pressed", (F(r).nav.variant ?? "bar") === i()), z(l, a());
		}), I("click", o, () => Le(i())), R(e, o);
	}), E(Lt), E(Pt);
	var Rt = N(Pt, 2), zt = (e) => {
		var t = hf(), n = j(t);
		{
			let e = /* @__PURE__ */ D(() => K("lbl.navPillWidth")), t = /* @__PURE__ */ D(() => K("tip.nav.pillWidth")), i = /* @__PURE__ */ D(() => F(r).nav.style?.pillWidth === "content" ? "content" : "custom"), a = /* @__PURE__ */ D(() => [["content", K("opt.pillWidth.content")], ["custom", K("opt.pillWidth.custom")]]);
			Wl(n, {
				get label() {
					return F(e);
				},
				get title() {
					return F(t);
				},
				get value() {
					return F(i);
				},
				get options() {
					return F(a);
				},
				onchange: (e) => re("pillWidth", e === "content" ? "content" : void 0)
			});
		}
		var i = N(n, 2), a = (e) => {
			var t = mf(), n = A(t), i = M(n, !0), a = N(n, 2);
			U(a), E(t), P((e, n) => {
				G(t, "title", e), z(i, n), G(a, "min", Dl.min), G(a, "max", Dl.max), G(a, "step", Dl.step), W(a, typeof F(r).nav.style?.pillWidth == "number" ? F(r).nav.style.pillWidth : "");
			}, [() => K("tip.nav.pillWidthPx"), () => K("lbl.navPillWidthPx")]), I("change", a, (e) => ue(e, "pillWidth", Dl)), R(e, t);
		};
		B(i, (e) => {
			F(r).nav.style?.pillWidth !== "content" && e(a);
		});
		var o = N(i, 2), s = A(o), c = M(s, !0), l = N(s, 2);
		U(l), E(o), P((e, t) => {
			G(o, "title", e), z(c, t), G(l, "min", jl.min), G(l, "max", jl.max), G(l, "step", jl.step), G(l, "placeholder", F(r).nav.variant === "floating-square" ? "0" : ""), W(l, typeof F(r).nav.style?.radius == "number" ? F(r).nav.style.radius : "");
		}, [() => K("tip.nav.radius"), () => K("lbl.navRadius")]), I("change", l, (e) => ue(e, "radius", jl)), R(e, t);
	};
	B(Rt, (e) => {
		F(ae) && e(zt);
	});
	var Bt = N(Rt, 2), Vt = (e) => {
		{
			let t = /* @__PURE__ */ D(() => K("lbl.navPlacement")), n = /* @__PURE__ */ D(() => F(r).nav.style?.sidePlacement ?? "top"), i = /* @__PURE__ */ D(() => [
				["top", K("opt.place.top")],
				["middle", K("opt.place.middle")],
				["bottom", K("opt.place.bottom")]
			]);
			Wl(e, {
				get label() {
					return F(t);
				},
				get value() {
					return F(n);
				},
				get options() {
					return F(i);
				},
				onchange: (e) => re("sidePlacement", e === "top" ? void 0 : e)
			});
		}
	}, Ht = (e) => {
		{
			let t = /* @__PURE__ */ D(() => K("lbl.navPlacement")), n = /* @__PURE__ */ D(() => K("opt.layout.leftAfterLogo")), i = /* @__PURE__ */ D(() => F(r).nav.layout ?? "right"), a = /* @__PURE__ */ D(() => [
				["left", K("common.left")],
				["center", K("common.center")],
				["right", K("common.right")]
			]);
			Wl(e, {
				get label() {
					return F(t);
				},
				get title() {
					return F(n);
				},
				get value() {
					return F(i);
				},
				get options() {
					return F(a);
				},
				onchange: (e) => w(e)
			});
		}
	};
	B(Bt, (e) => {
		F(ie) ? e(Vt) : e(Ht, -1);
	});
	var Ut = N(Bt, 2), Wt = (e) => {
		var t = gf(), n = j(t), i = A(n);
		U(i);
		var a = N(i);
		E(n);
		var o = N(n, 2), s = A(o);
		U(s);
		var c = N(s);
		E(o), P((e, t, l, u) => {
			G(n, "title", e), Vi(i, F(r).nav.style?.glow === !0), z(a, ` ${t ?? ""}`), G(o, "title", l), Vi(s, F(r).nav.style?.topGap !== !1), z(c, ` ${u ?? ""}`);
		}, [
			() => K("tip.nav.glow"),
			() => K("lbl.navGlow"),
			() => K("tip.nav.topGap"),
			() => K("lbl.navTopGap")
		]), I("change", i, (e) => Re(e.target.checked)), I("change", s, (e) => ze(e.target.checked)), R(e, t);
	};
	B(Ut, (e) => {
		F(ae) && e(Wt);
	});
	var Gt = N(Ut, 2), Kt = (e) => {
		var t = gf(), n = j(t), i = A(n);
		U(i);
		var a = N(i);
		E(n);
		var o = N(n, 2), s = A(o);
		U(s);
		var c = N(s);
		E(o), P((e, t, l, u) => {
			G(n, "title", e), Vi(i, F(r).nav.overlay === !0), z(a, ` ${t ?? ""}`), G(o, "title", l), Vi(s, F(r).nav.style?.inset !== !1), z(c, ` ${u ?? ""}`);
		}, [
			() => K("tip.nav.overlay"),
			() => K("lbl.navOverlay"),
			() => K("tip.nav.inset"),
			() => K("lbl.navInset")
		]), I("change", i, (e) => l("nav", () => {
			e.target.checked ? F(r).nav.overlay = !0 : delete F(r).nav.overlay;
		})), I("change", s, (e) => re("inset", e.target.checked ? void 0 : !1)), R(e, t);
	};
	B(Gt, (e) => {
		!F(ae) && !F(ie) && e(Kt);
	});
	var qt = N(Gt, 2), Jt = (e) => {
		var t = _f(), n = j(t);
		{
			let e = /* @__PURE__ */ D(() => K("lbl.textAlign")), t = /* @__PURE__ */ D(() => K("tip.nav.sideAlign")), i = /* @__PURE__ */ D(() => F(r).nav.style?.sideAlign ?? "left"), a = /* @__PURE__ */ D(() => [
				["left", K("common.left")],
				["center", K("common.center")],
				["right", K("common.right")]
			]);
			Wl(n, {
				get label() {
					return F(e);
				},
				get title() {
					return F(t);
				},
				get value() {
					return F(i);
				},
				get options() {
					return F(a);
				},
				onchange: (e) => re("sideAlign", e === "left" ? void 0 : e)
			});
		}
		var i = N(n, 2), a = A(i), o = M(a, !0), s = N(a, 2);
		U(s), E(i), P((e, t) => {
			G(i, "title", e), z(o, t), G(s, "min", Ml.min), G(s, "max", Ml.max), W(s, F(r).nav.style?.width ?? 250);
		}, [() => K("tip.nav.colWidth"), () => K("lbl.navColWidth")]), I("change", s, (e) => {
			let t = Rl(e.target.value, Ml, 250);
			re("width", t === 250 ? void 0 : t), e.target.value = F(r).nav.style?.width ?? 250;
		}), R(e, t);
	};
	B(qt, (e) => {
		F(ie) && e(Jt);
	}), E(Nt), E(At);
	var Yt = N(At, 4), Xt = A(Yt), Zt = M(Xt, !0), Qt = N(Xt, 2), $t = A(Qt);
	di($t, 20, () => Fl, (e) => e, (e, t) => {
		var n = vf();
		let r;
		var i = M(n, !0);
		P((e) => {
			r = H(n, 1, "", null, r, { on: F(oe) === t }), z(i, e);
		}, [() => K(`opt.size.${t}`)]), I("click", n, () => le(t)), R(e, n);
	}), E($t);
	var en = N($t, 2), tn = A(en), nn = M(tn, !0), rn = N(tn, 2), an = A(rn), on = (e) => {
		var t = yf(), n = A(t), r = M(n, !0), i = N(n, 2);
		U(i);
		var a = N(i, 2);
		U(a), E(t), P((e, n) => {
			G(t, "title", e), z(r, n), G(i, "min", Cl.min), G(i, "max", Cl.max), G(i, "step", Cl.step), W(i, F(se)), G(a, "min", Cl.min), G(a, "max", Cl.max), W(a, F(se));
		}, [() => K("tip.nav.thickness"), () => K("lbl.navThickness")]), I("input", i, (e) => re("padY", e.target.valueAsNumber)), I("change", a, (e) => De(e, "padY", Cl)), R(e, t);
	};
	B(an, (e) => {
		F(ie) || e(on);
	});
	var sn = N(an, 2), cn = A(sn), ln = M(cn, !0), un = N(cn, 2);
	U(un);
	var dn = N(un, 2);
	U(dn), E(sn);
	var fn = N(sn, 2), pn = (e) => {
		var t = bf(), n = A(t), i = A(n), a = M(i, !0), o = N(i, 2);
		U(o), E(n);
		var s = N(n, 2), c = A(s), l = M(c, !0), u = N(c, 2);
		U(u), E(s), E(t), P((e, t, i, c, d, f) => {
			G(n, "title", e), z(a, t), G(o, "min", Tl.min), G(o, "max", Tl.max), G(o, "placeholder", i), W(o, F(r).nav.style?.padX ?? ""), G(s, "title", c), z(l, d), G(u, "min", El.min), G(u, "max", El.max), G(u, "placeholder", f), W(u, F(r).nav.style?.gap ?? "");
		}, [
			() => K("tip.nav.padX"),
			() => K("lbl.navPadX"),
			() => K("common.auto"),
			() => K("tip.nav.gap"),
			() => K("lbl.navGap"),
			() => K("common.auto")
		]), I("change", o, (e) => ue(e, "padX", Tl)), I("change", u, (e) => ue(e, "gap", El)), R(e, t);
	};
	B(fn, (e) => {
		F(ie) || e(pn);
	}), E(rn), E(en), E(Qt), E(Yt);
	var mn = N(Yt, 4), hn = A(mn), gn = M(hn, !0), _n = N(hn, 2), vn = A(_n), yn = (e) => {
		var t = Sf(), n = j(t), i = A(n), a = M(i, !0), o = N(i, 2);
		di(o, 21, () => [
			["", K("common.none")],
			["bottom", K("opt.navBorder.bottom")],
			["top", K("opt.navBorder.top")],
			["both", K("opt.navBorder.both")],
			["all", K("opt.navBorder.all")]
		], ([e, t]) => e, (e, t) => {
			var n = /* @__PURE__ */ D(() => g(F(t), 2));
			let i = () => F(n)[0], a = () => F(n)[1];
			var o = pf();
			let s;
			var c = A(o);
			V(c, () => m[i()]);
			var l = M(N(c), !0);
			E(o), P(() => {
				s = H(o, 1, "tile", null, s, { on: (F(r).nav.style?.border?.side ?? "") === i() }), G(o, "aria-pressed", (F(r).nav.style?.border?.side ?? "") === i()), z(l, a());
			}), I("click", o, () => re("border", i() ? {
				...F(r).nav.style?.border ?? {},
				side: i()
			} : void 0)), R(e, o);
		}), E(o), E(n);
		var s = N(n, 2), c = (e) => {
			var t = xf(), n = A(t), i = M(n, !0), a = N(n, 2);
			U(a);
			var o = N(a, 2), s = M(o, !0), c = N(o, 2);
			{
				let e = /* @__PURE__ */ D(() => F(r).nav.style.border.color ?? "text"), t = /* @__PURE__ */ D(u), n = /* @__PURE__ */ D(() => K("tip.nav.borderColorPick"));
				sl(c, {
					get value() {
						return F(e);
					},
					get tokens() {
						return F(t);
					},
					get label() {
						return F(n);
					},
					onchange: (e) => re("border", {
						...F(r).nav.style.border,
						color: e
					})
				});
			}
			E(t), P((e, t, c, l, u) => {
				G(n, "title", e), z(i, t), G(a, "title", c), W(a, F(r).nav.style.border.width ?? 1), G(o, "title", l), z(s, u);
			}, [
				() => K("tip.nav.borderWidth"),
				() => K("lbl.navBorderWidth"),
				() => K("tip.nav.borderWidth"),
				() => K("tip.nav.borderColorPick"),
				() => K("lbl.navBorderColor")
			]), I("change", a, (e) => {
				let t = Rl(e.target.value, {
					min: 1,
					max: 8
				}, 1), n = { ...F(r).nav.style.border };
				t === 1 ? delete n.width : n.width = t, re("border", n), e.target.value = F(r).nav.style.border.width ?? 1;
			}), R(e, t);
		};
		B(s, (e) => {
			F(r).nav.style?.border?.side && e(c);
		}), P((e, t, r) => {
			G(n, "title", e), z(a, t), G(o, "aria-label", r);
		}, [
			() => K("tip.nav.border"),
			() => K("lbl.navBorder"),
			() => K("lbl.navBorder")
		]), R(e, t);
	};
	B(vn, (e) => {
		F(ie) || e(yn);
	});
	var bn = N(vn, 2), xn = (e) => {
		{
			let t = /* @__PURE__ */ D(() => K("lbl.navShadow")), n = /* @__PURE__ */ D(() => K("tip.nav.shadow")), i = /* @__PURE__ */ D(() => F(r).nav.style?.shadow ?? ""), a = /* @__PURE__ */ D(() => [
				["", K("common.none")],
				["soft", K("opt.navShadow.soft")],
				["strong", K("opt.navShadow.strong")]
			]);
			Wl(e, {
				get label() {
					return F(t);
				},
				get title() {
					return F(n);
				},
				get value() {
					return F(i);
				},
				get options() {
					return F(a);
				},
				onchange: (e) => re("shadow", e || void 0)
			});
		}
	};
	B(bn, (e) => {
		!F(ae) && !F(ie) && e(xn);
	}), E(_n), E(mn);
	var Sn = N(mn, 4), Cn = A(Sn), wn = M(Cn, !0), Tn = N(Cn, 2), En = A(Tn), Dn = (e) => {
		var t = Ef(), n = A(t), i = M(n, !0), a = N(n, 2), o = A(a);
		U(o);
		var s = N(o);
		E(a);
		var c = N(a, 2), u = (e) => {
			var t = Tf(), n = j(t);
			{
				let e = /* @__PURE__ */ D(() => K("lbl.navScroll")), t = /* @__PURE__ */ D(() => K("tip.nav.scroll")), i = /* @__PURE__ */ D(() => F(r).nav.scroll ?? "none"), a = /* @__PURE__ */ D(() => [
					["none", K("opt.scroll.none")],
					["shrink", K("opt.scroll.shrink")],
					["hide", K("opt.scroll.hide")]
				]);
				Wl(n, {
					get label() {
						return F(e);
					},
					get title() {
						return F(t);
					},
					get value() {
						return F(i);
					},
					get options() {
						return F(a);
					},
					onchange: (e) => l("nav", () => {
						e === "none" ? delete F(r).nav.scroll : F(r).nav.scroll = e;
					})
				});
			}
			var i = N(n, 2), a = (e) => {
				var t = wf(), n = j(t), i = A(n), a = M(i, !0), o = N(i, 2);
				U(o);
				var s = M(N(o, 2));
				E(n);
				var c = N(n, 2), l = A(c), u = M(l, !0), d = N(l, 2);
				U(d);
				var f = M(N(d, 2));
				E(c);
				var p = N(c, 2), m = A(p), h = M(m, !0), g = N(m, 2);
				U(g);
				var _ = M(N(g, 2));
				E(p);
				var v = N(p, 2), y = (e) => {
					var t = Cf(), n = A(t);
					U(n);
					var i = N(n);
					E(t), P((e, a) => {
						G(t, "title", e), Vi(n, F(r).nav.style?.shrinkLogo === !0), z(i, ` ${a ?? ""}`);
					}, [() => K("tip.nav.shrinkLogo"), () => K("lbl.navShrinkLogo")]), I("change", n, (e) => re("shrinkLogo", e.target.checked ? !0 : void 0)), R(e, t);
				};
				B(v, (e) => {
					(F(r).nav.logo?.type ?? "text") !== "text" && e(y);
				}), P((e, t, i, l, m, v, y, b) => {
					G(n, "title", e), z(a, t), W(o, i), z(s, `${l ?? ""}%`), G(c, "title", m), z(u, v), W(d, F(r).nav.style?.shrinkAt ?? 80), z(f, `${F(r).nav.style?.shrinkAt ?? 80 ?? ""} px`), G(p, "title", y), z(h, b), W(g, F(r).nav.style?.shrinkMs ?? 220), z(_, `${F(r).nav.style?.shrinkMs ?? 220 ?? ""} ms`);
				}, [
					() => K("tip.nav.shrinkTo"),
					() => K("lbl.navShrinkTo"),
					() => Math.round((F(r).nav.style?.shrinkTo ?? .5) * 100),
					() => Math.round((F(r).nav.style?.shrinkTo ?? .5) * 100),
					() => K("tip.nav.shrinkAt"),
					() => K("lbl.navShrinkAt"),
					() => K("tip.nav.shrinkMs"),
					() => K("lbl.navShrinkMs")
				]), I("input", o, (e) => ke(e.target.valueAsNumber)), I("input", d, (e) => je(e.target.valueAsNumber)), I("input", g, (e) => Me(e.target.valueAsNumber)), R(e, t);
			};
			B(i, (e) => {
				F(r).nav.scroll === "shrink" && e(a);
			}), R(e, t);
		};
		B(c, (e) => {
			F(r).nav.sticky !== !1 && e(u);
		});
		var d = N(c, 2), f = A(d);
		U(f);
		var p = N(f);
		E(d), E(t), P((e, t, n, c, l) => {
			z(i, e), G(a, "title", t), Vi(o, F(r).nav.sticky !== !1), z(s, ` ${n ?? ""}`), G(d, "title", c), Vi(f, F(r).nav.style?.atTop === "clear"), z(p, ` ${l ?? ""}`);
		}, [
			() => K("group.navScrolling"),
			() => K("tip.nav.sticky"),
			() => K("lbl.navSticky"),
			() => K("tip.nav.atTop"),
			() => K("lbl.navAtTop")
		]), I("change", o, (e) => l("nav", () => {
			F(r).nav.sticky = e.target.checked;
		})), I("change", f, (e) => re("atTop", e.target.checked ? "clear" : void 0)), R(e, t);
	};
	B(En, (e) => {
		F(ie) || e(Dn);
	}), E(Tn), E(Sn);
	var On = N(Sn, 4), kn = A(On), An = M(kn, !0), jn = N(kn, 2), Mn = A(jn), Nn = A(Mn), Fn = (e) => {
		var t = Df(), n = A(t), i = M(n, !0), a = N(n, 2);
		U(a), E(t), P((e, n, o) => {
			G(t, "title", e), z(i, n), G(a, "min", Cl.min), G(a, "max", Cl.max), G(a, "placeholder", o), W(a, F(r).nav.style?.mobile?.padY ?? "");
		}, [
			() => K("tip.nav.thickness"),
			() => K("lbl.navThickness"),
			() => K("lbl.navSameAsDesktop")
		]), I("change", a, (e) => Oe(e, "padY", Cl)), R(e, t);
	};
	B(Nn, (e) => {
		F(ie) || e(Fn);
	});
	var In = N(Nn, 2), Ln = A(In), Rn = M(Ln, !0), zn = N(Ln, 2);
	U(zn), E(In), E(Mn);
	var Bn = N(Mn, 2), Vn = A(Bn), Hn = A(Vn), Un = M(Hn, !0), Wn = N(Hn, 2);
	{
		let e = /* @__PURE__ */ D(() => F(r).nav.style?.mobile?.size ?? ""), t = /* @__PURE__ */ D(() => [["", K("lbl.navSameAsDesktop")], ...Fl.map((e) => [e, K(`opt.size.${e}`)])]);
		J(Wn, {
			filled: !0,
			get value() {
				return F(e);
			},
			get options() {
				return F(t);
			},
			onchange: (e) => de("size", e || void 0)
		});
	}
	E(Vn);
	var Gn = N(Vn, 2), Kn = A(Gn), qn = M(Kn, !0), Jn = N(Kn, 2);
	{
		let e = /* @__PURE__ */ D(() => F(r).nav.style?.mobile?.layout ?? ""), t = /* @__PURE__ */ D(() => [
			["", K("lbl.navSameAsDesktop")],
			["left", K("common.left")],
			["center", K("common.center")],
			["right", K("common.right")]
		]);
		J(Jn, {
			filled: !0,
			get value() {
				return F(e);
			},
			get options() {
				return F(t);
			},
			onchange: (e) => de("layout", e || void 0)
		});
	}
	E(Gn), E(Bn);
	var Yn = N(Bn, 2), Xn = A(Yn), Zn = A(Xn), Qn = M(Zn, !0), $n = N(Zn, 2);
	{
		let e = /* @__PURE__ */ D(() => F(r).nav.style?.mobile?.tools?.side ?? ""), t = /* @__PURE__ */ D(() => [
			["", K("lbl.navSameAsDesktop")],
			["start", K("common.left")],
			["end", K("common.right")]
		]);
		J($n, {
			filled: !0,
			get value() {
				return F(e);
			},
			get options() {
				return F(t);
			},
			onchange: (e) => de("tools", e ? { side: e } : void 0)
		});
	}
	E(Xn);
	var er = N(Xn, 2), tr = (e) => {
		var t = Of(), n = A(t), r = M(n, !0), i = N(n, 2);
		{
			let e = /* @__PURE__ */ D(() => fe("overlay")), t = /* @__PURE__ */ D(() => [
				["", K("lbl.navSameAsDesktop")],
				["on", K("common.on")],
				["off", K("common.off")]
			]);
			J(i, {
				filled: !0,
				get value() {
					return F(e);
				},
				get options() {
					return F(t);
				},
				onchange: (e) => pe("overlay", e)
			});
		}
		E(t), P((e, n) => {
			G(t, "title", e), z(r, n);
		}, [() => K("tip.nav.mobileOverlay"), () => K("lbl.navOverlay")]), R(e, t);
	};
	B(er, (e) => {
		!F(ae) && !F(ie) && e(tr);
	}), E(Yn);
	var nr = N(Yn, 2), rr = A(nr), ir = A(rr), ar = M(ir, !0), or = N(ir, 2);
	{
		let e = /* @__PURE__ */ D(() => F(r).nav.style?.mobile?.border?.side ?? ""), t = /* @__PURE__ */ D(() => [
			["", K("lbl.navSameAsDesktop")],
			["none", K("common.none")],
			["bottom", K("opt.navBorder.bottom")],
			["top", K("opt.navBorder.top")],
			["both", K("opt.navBorder.both")],
			["all", K("opt.navBorder.all")]
		]);
		J(or, {
			filled: !0,
			get value() {
				return F(e);
			},
			get options() {
				return F(t);
			},
			onchange: (e) => me(e)
		});
	}
	E(rr), E(nr);
	var sr = N(nr, 2), cr = (e) => {
		var t = xf(), n = A(t), i = M(n, !0), a = N(n, 2);
		U(a);
		var o = N(a, 2), s = M(o, !0), c = N(o, 2);
		{
			let e = /* @__PURE__ */ D(() => F(r).nav.style.mobile.border.color ?? "text"), t = /* @__PURE__ */ D(u), n = /* @__PURE__ */ D(() => K("tip.nav.borderColorPick"));
			sl(c, {
				get value() {
					return F(e);
				},
				get tokens() {
					return F(t);
				},
				get label() {
					return F(n);
				},
				onchange: (e) => de("border", {
					...F(r).nav.style.mobile.border,
					color: e
				})
			});
		}
		E(t), P((e, t, c, l, u) => {
			G(n, "title", e), z(i, t), G(a, "title", c), W(a, F(r).nav.style.mobile.border.width ?? 1), G(o, "title", l), z(s, u);
		}, [
			() => K("tip.nav.borderWidth"),
			() => K("lbl.navBorderWidth"),
			() => K("tip.nav.borderWidth"),
			() => K("tip.nav.borderColorPick"),
			() => K("lbl.navBorderColor")
		]), I("change", a, (e) => {
			let t = Rl(e.target.value, {
				min: 1,
				max: 8
			}, 1), n = { ...F(r).nav.style.mobile.border };
			t === 1 ? delete n.width : n.width = t, de("border", n), e.target.value = F(r).nav.style.mobile.border.width ?? 1;
		}), R(e, t);
	};
	B(sr, (e) => {
		F(r).nav.style?.mobile?.border?.side && F(r).nav.style.mobile.border.side !== "none" && e(cr);
	});
	var lr = N(sr, 2), ur = A(lr), dr = A(ur), fr = M(dr, !0), pr = N(dr, 2);
	{
		let e = /* @__PURE__ */ D(() => F(r).nav.style?.mobileMenu ?? "dropdown"), t = /* @__PURE__ */ D(() => [["dropdown", K("opt.mobileMenu.dropdown")], ["sheet", K("opt.mobileMenu.sheet")]]);
		J(pr, {
			filled: !0,
			get value() {
				return F(e);
			},
			get options() {
				return F(t);
			},
			onchange: (e) => re("mobileMenu", e === "dropdown" ? void 0 : e)
		});
	}
	E(ur);
	var mr = N(ur, 2), hr = (e) => {
		var t = Of(), n = A(t), i = M(n, !0), a = N(n, 2);
		{
			let e = /* @__PURE__ */ D(() => F(r).nav.style?.sheetMotion ?? "top"), t = /* @__PURE__ */ D(() => [
				"top",
				"bottom",
				"left",
				"right",
				"fade",
				"none"
			].map((e) => [e, K(`opt.sheetMotion.${e}`)]));
			J(a, {
				filled: !0,
				get value() {
					return F(e);
				},
				get options() {
					return F(t);
				},
				onchange: (e) => re("sheetMotion", e === "top" ? void 0 : e)
			});
		}
		E(t), P((e, n) => {
			G(t, "title", e), z(i, n);
		}, [() => K("tip.nav.sheetMotion"), () => K("lbl.sheetMotion")]), R(e, t);
	};
	B(mr, (e) => {
		F(r).nav.style?.mobileMenu === "sheet" && e(hr);
	}), E(lr);
	var gr = N(lr, 2), _r = (e) => {
		var t = kf(), n = j(t), i = A(n);
		U(i);
		var a = N(i);
		E(n);
		var o = N(n, 2), s = (e) => {
			var t = Cf(), n = A(t);
			U(n);
			var i = N(n);
			E(t), P((e, a) => {
				G(t, "title", e), Vi(n, F(r).nav.style?.sheetTheme === !0), z(i, ` ${a ?? ""}`);
			}, [() => K("tip.nav.sheetTheme"), () => K("lbl.sheetTheme")]), I("change", n, (e) => re("sheetTheme", e.target.checked ? !0 : void 0)), R(e, t);
		};
		B(o, (e) => {
			F(r).theme?.alt?.tokens && F(r).nav.style?.tools?.theme !== !1 && e(s);
		});
		var c = N(o, 2), l = (e) => {
			var t = Cf(), n = A(t);
			U(n);
			var i = N(n);
			E(t), P((e, a) => {
				G(t, "title", e), Vi(n, F(r).nav.style?.sheetCart === !0), z(i, ` ${a ?? ""}`);
			}, [() => K("tip.nav.sheetCart"), () => K("lbl.sheetCart")]), I("change", n, (e) => re("sheetCart", e.target.checked ? !0 : void 0)), R(e, t);
		};
		B(c, (e) => {
			F(r).nav.cart?.show && e(l);
		});
		var d = N(c, 2), f = (e) => {
			var t = Cf(), n = A(t);
			U(n);
			var i = N(n);
			E(t), P((e, a) => {
				G(t, "title", e), Vi(n, F(r).nav.style?.sheetAnnounce === !0), z(i, ` ${a ?? ""}`);
			}, [() => K("tip.nav.sheetAnnounce"), () => K("lbl.sheetAnnounce")]), I("change", n, (e) => re("sheetAnnounce", e.target.checked ? !0 : void 0)), R(e, t);
		};
		B(d, (e) => {
			F(r).nav.announcement?.show && e(f);
		});
		var p = N(d, 2), m = (e) => {
			var t = Cf(), n = A(t);
			U(n);
			var i = N(n);
			E(t), P((e, a) => {
				G(t, "title", e), Vi(n, F(r).nav.style?.sheetToolLabels === !0), z(i, ` ${a ?? ""}`);
			}, [() => K("tip.nav.sheetToolLabels"), () => K("lbl.sheetToolLabels")]), I("change", n, (e) => re("sheetToolLabels", e.target.checked ? !0 : void 0)), R(e, t);
		};
		B(p, (e) => {
			(F(r).nav.style?.sheetTheme || F(r).nav.style?.sheetCart) && e(m);
		});
		var h = N(p, 2), g = A(h), _ = M(g, !0), v = N(g, 2);
		{
			let e = /* @__PURE__ */ D(() => F(r).nav.style?.sheet?.bg ?? "surface"), t = /* @__PURE__ */ D(u), n = /* @__PURE__ */ D(() => K("tip.nav.sheetBg"));
			sl(v, {
				get value() {
					return F(e);
				},
				get tokens() {
					return F(t);
				},
				get label() {
					return F(n);
				},
				onchange: (e) => Ee("bg", e)
			});
		}
		var y = N(v, 2);
		U(y);
		var b = M(N(y, 2));
		E(h);
		var x = N(h, 2), S = A(x);
		U(S);
		var C = N(S);
		E(x);
		var w = N(x, 2), ee = A(w), T = N(ee);
		{
			let e = /* @__PURE__ */ D(() => F(r).nav.style?.sheet?.textColor ?? F(r).nav.style?.textColor ?? "text"), t = /* @__PURE__ */ D(u), n = /* @__PURE__ */ D(() => K("tip.nav.sheetTextColorPick"));
			sl(T, {
				get value() {
					return F(e);
				},
				get tokens() {
					return F(t);
				},
				get label() {
					return F(n);
				},
				onchange: (e) => Ee("textColor", e)
			});
		}
		E(w), P((e, t, o, s, c, l, u, d, f, p) => {
			G(n, "title", e), Vi(i, F(r).nav.style?.sheetLogo === !0), z(a, ` ${t ?? ""}`), G(h, "title", o), z(_, s), G(y, "title", c), W(y, l), z(b, `${u ?? ""}%`), G(x, "title", d), Vi(S, F(r).nav.style?.sheet?.blur ?? F(r).nav.style?.blur !== !1), z(C, ` ${f ?? ""}`), z(ee, `${p ?? ""} `);
		}, [
			() => K("tip.nav.sheetLogo"),
			() => K("lbl.sheetLogo"),
			() => K("tip.nav.sheetBg"),
			() => K("lbl.background"),
			() => K("tip.nav.sheetOpacity"),
			() => Math.round((F(r).nav.style?.sheet?.bgOpacity ?? .85) * 100),
			() => Math.round((F(r).nav.style?.sheet?.bgOpacity ?? .85) * 100),
			() => K("tip.nav.sheetBlur"),
			() => K("lbl.sheetBlur"),
			() => K("lbl.textColor")
		]), I("change", i, (e) => re("sheetLogo", e.target.checked ? !0 : void 0)), I("input", y, (e) => Ee("bgOpacity", e.target.valueAsNumber / 100)), I("change", S, (e) => Ee("blur", e.target.checked)), R(e, t);
	};
	B(gr, (e) => {
		F(r).nav.style?.mobileMenu === "sheet" && e(_r);
	});
	var vr = N(gr, 2), yr = (e) => {
		var t = Of(), n = A(t), i = M(n, !0), a = N(n, 2);
		{
			let e = /* @__PURE__ */ D(() => F(r).nav.style?.mobileSubs ?? "collapsed"), t = /* @__PURE__ */ D(() => [["collapsed", K("opt.mobileSubs.collapsed")], ["expanded", K("opt.mobileSubs.expanded")]]);
			J(a, {
				filled: !0,
				get value() {
					return F(e);
				},
				get options() {
					return F(t);
				},
				onchange: (e) => re("mobileSubs", e === "collapsed" ? void 0 : e)
			});
		}
		E(t), P((e, n) => {
			G(t, "title", e), z(i, n);
		}, [() => K("tip.nav.mobileSubs"), () => K("lbl.mobileSubs")]), R(e, t);
	}, br = /* @__PURE__ */ D(() => F(r).nav.items?.some((e) => e.children?.length));
	B(vr, (e) => {
		F(br) && e(yr);
	}), E(jn), E(On);
	var xr = N(On, 4), Sr = A(xr), Cr = M(Sr, !0), wr = N(Sr, 2), Tr = A(wr), Er = A(Tr), Dr = M(Er, !0), Or = N(Er, 2);
	di(Or, 21, () => [
		["standard", K("opt.hover.standard")],
		["underline", K("opt.hover.underline")],
		["pill", K("opt.hover.pill")],
		["lift-plain", K("opt.hover.liftPlain")],
		["lift", K("opt.hover.lift")]
	], ([e, t]) => e, (e, t) => {
		var n = /* @__PURE__ */ D(() => g(F(t), 2));
		let i = () => F(n)[0], a = () => F(n)[1];
		var o = Af();
		let s;
		var c = A(o), l = M(c, !0), u = M(N(c), !0);
		E(o), P((e) => {
			s = H(o, 1, "tile hover-tile", null, s, { on: (F(r).nav.style?.hover ?? "standard") === i() }), G(o, "aria-pressed", (F(r).nav.style?.hover ?? "standard") === i()), H(c, 1, `hover-sample hover-${i() ?? ""}`), z(l, e), z(u, a());
		}, [() => K("seed.home")]), I("click", o, () => Be(i())), R(e, o);
	}), E(Or), E(Tr);
	var kr = N(Tr, 2), Ar = (e) => {
		var t = jf(), n = A(t), i = M(n, !0), a = N(n, 2);
		U(a);
		var o = M(N(a, 2));
		E(t), P((e, n, s) => {
			G(t, "title", e), z(i, n), W(a, F(r).nav.style?.hoverGlow ?? .6), z(o, `${s ?? ""}%`);
		}, [
			() => K("tip.nav.hoverGlow"),
			() => K("lbl.glowStrength"),
			() => Math.round((F(r).nav.style?.hoverGlow ?? .6) * 100)
		]), I("input", a, (e) => re("hoverGlow", Number(e.target.value))), R(e, t);
	};
	B(kr, (e) => {
		F(r).nav.style?.hover === "lift" && e(Ar);
	});
	var jr = N(kr, 2), Mr = A(jr), Nr = (e) => {
		var t = Mf(), n = A(t);
		{
			let e = /* @__PURE__ */ D(() => F(r).nav.style?.hoverColor ?? "accent"), t = /* @__PURE__ */ D(u);
			sl(n, {
				get value() {
					return F(e);
				},
				get tokens() {
					return F(t);
				},
				get label() {
					return F(Pe)[1];
				},
				onchange: (e) => re("hoverColor", e)
			});
		}
		var i = M(N(n, 2), !0);
		E(t), P(() => {
			G(t, "title", F(Pe)[1]), z(i, F(Pe)[0]);
		}), R(e, t);
	};
	B(Mr, (e) => {
		F(Pe) && e(Nr);
	});
	var Pr = N(Mr, 2), Fr = A(Pr);
	{
		let e = /* @__PURE__ */ D(() => F(r).nav.style?.hoverTextColor ?? "accent"), t = /* @__PURE__ */ D(u), n = /* @__PURE__ */ D(() => K("tip.nav.hoverTextColorPick"));
		sl(Fr, {
			get value() {
				return F(e);
			},
			get tokens() {
				return F(t);
			},
			get label() {
				return F(n);
			},
			onchange: (e) => re("hoverTextColor", e)
		});
	}
	var Ir = M(N(Fr, 2), !0);
	E(Pr);
	var Lr = N(Pr, 2), Rr = A(Lr);
	{
		let e = /* @__PURE__ */ D(() => F(r).nav.style?.textColor ?? "text"), t = /* @__PURE__ */ D(u), n = /* @__PURE__ */ D(() => K("tip.nav.textColorPick"));
		sl(Rr, {
			get value() {
				return F(e);
			},
			get tokens() {
				return F(t);
			},
			get label() {
				return F(n);
			},
			onchange: (e) => re("textColor", e)
		});
	}
	var zr = M(N(Rr, 2), !0);
	E(Lr), E(jr);
	var Vr = N(jr, 2), Hr = A(Vr);
	U(Hr);
	var Ur = N(Hr);
	E(Vr), E(wr), E(xr);
	var Wr = N(xr, 4), Gr = A(Wr), Kr = M(Gr, !0), qr = N(Gr, 2), Jr = A(qr);
	{
		let e = /* @__PURE__ */ D(() => F(r).nav?.style?.background?.layers ?? []);
		cf(Jr, {
			get bg() {
				return s;
			},
			get layers() {
				return F(e);
			}
		});
	}
	E(qr), E(Wr), E(kt), E(Et);
	var L = N(Et, 2), Zr = A(L), Qr = M(Zr, !0), $r = N(Zr, 2), ei = A($r), ti = A(ei);
	U(ti);
	var ni = N(ti);
	E(ei);
	var ri = N(ei, 2), ii = (e) => {
		var t = Ff(), n = j(t), a = A(n), o = M(a, !0), s = N(a, 2);
		U(s), E(n);
		var c = N(n, 2), d = A(c), f = N(d);
		{
			let e = /* @__PURE__ */ D(() => F(r).nav.announcement?.page ?? (F(r).nav.announcement?.href === void 0 ? "" : "custom")), t = /* @__PURE__ */ D(() => [
				["", K("common.none")],
				...F(r).pages.map((e) => [e.id, e.title]),
				["custom", K("opt.announceLink.custom")]
			]);
			J(f, {
				get value() {
					return F(e);
				},
				get options() {
					return F(t);
				},
				onchange: (e) => l("edit:nav-announce-link", () => {
					let t = { ...F(r).nav.announcement ?? {} };
					delete t.page, delete t.href, e === "custom" ? t.href = "" : e && (t.page = e), F(r).nav.announcement = t;
				})
			});
		}
		E(c);
		var p = N(c, 2), m = (e) => {
			var t = Nf(), n = A(t), i = M(n, !0), a = N(n, 2);
			U(a), E(t), P((e, n) => {
				G(t, "title", e), z(i, n), W(a, F(r).nav.announcement?.href ?? "");
			}, [() => K("tip.nav.announceHref"), () => K("lbl.announceHref")]), I("change", a, (e) => he("href", e.target.value.trim())), R(e, t);
		};
		B(p, (e) => {
			F(r).nav.announcement?.href !== void 0 && !F(r).nav.announcement?.page && e(m);
		});
		var h = N(p, 2), g = (e) => {
			var t = Cf(), n = A(t);
			U(n);
			var i = N(n);
			E(t), P((e, a) => {
				G(t, "title", e), Vi(n, F(r).nav.announcement?.sticky !== !1), z(i, ` ${a ?? ""}`);
			}, [() => K("tip.nav.announceSticky"), () => K("lbl.announceSticky")]), I("change", n, (e) => he("sticky", e.target.checked ? void 0 : !1)), R(e, t);
		};
		B(h, (e) => {
			F(r).nav.sticky !== !1 && !F(ae) && !F(ie) && !F(r).nav.overlay && e(g);
		});
		var _ = N(h, 2), v = (e) => {
			var t = Cf(), n = A(t);
			U(n);
			var i = N(n);
			E(t), P((e, a) => {
				G(t, "title", e), Vi(n, F(r).nav.announcement?.followNav === !0), z(i, ` ${a ?? ""}`);
			}, [() => K("tip.nav.announceFollowNav"), () => K("lbl.announceFollowNav")]), I("change", n, (e) => he("followNav", e.target.checked ? !0 : void 0)), R(e, t);
		};
		B(_, (e) => {
			F(r).nav.scroll === "hide" && F(r).nav.sticky !== !1 && !F(ie) && F(r).nav.announcement?.sticky !== !1 && e(v);
		});
		var y = N(_, 2), b = (e) => {
			{
				let t = /* @__PURE__ */ D(() => K("lbl.announcePlace")), n = /* @__PURE__ */ D(() => K("tip.nav.announcePlace")), i = /* @__PURE__ */ D(() => F(r).nav.announcement?.place ?? "nav"), a = /* @__PURE__ */ D(() => [
					["nav", K("opt.announcePlace.nav")],
					["page", K("opt.announcePlace.page")],
					["content", K("opt.announcePlace.content")]
				]);
				Wl(e, {
					get label() {
						return F(t);
					},
					get title() {
						return F(n);
					},
					get value() {
						return F(i);
					},
					get options() {
						return F(a);
					},
					onchange: (e) => he("place", e === "nav" ? void 0 : e)
				});
			}
		};
		B(y, (e) => {
			F(ie) && e(b);
		});
		var x = N(y, 2), S = A(x);
		U(S);
		var C = N(S);
		E(x);
		var w = N(x, 2), ee = (e) => {
			var t = Pf(), n = M(t, !0);
			P((e, r) => {
				G(t, "title", e), z(n, r);
			}, [() => K("tip.nav.announceShowAgain"), () => K("lbl.announceShowAgain")]), I("click", t, () => F(i)?.sendAnnounceReset()), R(e, t);
		};
		B(w, (e) => {
			F(r).nav.announcement?.dismiss !== !1 && e(ee);
		});
		var T = N(w, 2), te = A(T), ne = N(te);
		{
			let e = /* @__PURE__ */ D(() => F(r).nav.announcement?.color ?? "accent"), t = /* @__PURE__ */ D(u), n = /* @__PURE__ */ D(() => K("tip.nav.announceColor"));
			sl(ne, {
				get value() {
					return F(e);
				},
				get tokens() {
					return F(t);
				},
				get label() {
					return F(n);
				},
				onchange: (e) => he("color", e)
			});
		}
		E(T);
		var re = N(T, 2), oe = A(re), se = N(oe);
		{
			let e = /* @__PURE__ */ D(() => F(r).nav.announcement?.textColor ?? "accent-text"), t = /* @__PURE__ */ D(u), n = /* @__PURE__ */ D(() => K("tip.nav.announceTextColor"));
			sl(se, {
				get value() {
					return F(e);
				},
				get tokens() {
					return F(t);
				},
				get label() {
					return F(n);
				},
				onchange: (e) => he("textColor", e)
			});
		}
		E(re), P((e, t, i, a, l, u, f, p, m, h) => {
			G(n, "title", e), z(o, t), W(s, F(r).nav.announcement?.text ?? ""), G(c, "title", i), z(d, `${a ?? ""} `), G(x, "title", l), Vi(S, F(r).nav.announcement?.dismiss !== !1), z(C, ` ${u ?? ""}`), G(T, "title", f), z(te, `${p ?? ""} `), G(re, "title", m), z(oe, `${h ?? ""} `);
		}, [
			() => K("tip.nav.announce"),
			() => K("lbl.text"),
			() => K("tip.nav.announceLink"),
			() => K("lbl.link"),
			() => K("tip.nav.announceDismiss"),
			() => K("lbl.announceDismiss"),
			() => K("tip.nav.announceColor"),
			() => K("lbl.background"),
			() => K("tip.nav.announceTextColor"),
			() => K("lbl.textColor")
		]), I("change", s, (e) => he("text", e.target.value.trim() || void 0)), I("change", S, (e) => he("dismiss", e.target.checked ? void 0 : !1)), R(e, t);
	};
	B(ri, (e) => {
		F(r).nav.announcement?.show && e(ii);
	}), E($r), E(L);
	var ai = N(L, 2), oi = A(ai), ci = M(oi, !0), li = N(oi, 2);
	{
		let e = (e, t = f, n = f) => {
			var r = If(), i = A(r);
			V(i, () => q.up, !0), E(i);
			var a = N(i, 2);
			V(a, () => q.down, !0), E(a), E(r), P((e, t) => {
				G(i, "title", e), i.disabled = n() === 0, G(a, "title", t), a.disabled = n() === F(T).length - 1;
			}, [() => K("tip.moveUp"), () => K("tip.moveDown")]), I("click", i, (e) => {
				e.preventDefault(), e.stopPropagation(), te(t(), -1);
			}), I("click", a, (e) => {
				e.preventDefault(), e.stopPropagation(), te(t(), 1);
			}), R(e, r);
		};
		var ui = A(li), fi = (e) => {
			var t = Tf(), n = j(t);
			{
				let e = /* @__PURE__ */ D(() => K("lbl.toolsSide")), t = /* @__PURE__ */ D(() => K("tip.nav.toolsSideColumn")), i = /* @__PURE__ */ D(() => F(r).nav.style?.tools?.side ?? "end"), a = /* @__PURE__ */ D(() => [["start", K("opt.toolsSide.top")], ["end", K("opt.toolsSide.bottom")]]);
				Wl(n, {
					get label() {
						return F(e);
					},
					get title() {
						return F(t);
					},
					get value() {
						return F(i);
					},
					get options() {
						return F(a);
					},
					onchange: (e) => ne("side", e === "start" ? "start" : void 0)
				});
			}
			var i = N(n, 2);
			{
				let e = /* @__PURE__ */ D(() => K("lbl.toolsAlign")), t = /* @__PURE__ */ D(() => K("tip.nav.toolsAlign")), n = /* @__PURE__ */ D(() => F(r).nav.style?.tools?.align ?? "center"), a = /* @__PURE__ */ D(() => [
					["start", K("opt.toolsAlign.start")],
					["center", K("opt.toolsAlign.center")],
					["end", K("opt.toolsAlign.end")],
					["spread", K("opt.toolsAlign.spread")]
				]);
				Wl(i, {
					get label() {
						return F(e);
					},
					get title() {
						return F(t);
					},
					get value() {
						return F(n);
					},
					get options() {
						return F(a);
					},
					onchange: (e) => ne("align", e === "center" ? void 0 : e)
				});
			}
			R(e, t);
		}, pi = (e) => {
			{
				let t = /* @__PURE__ */ D(() => K("lbl.toolsSide")), n = /* @__PURE__ */ D(() => K("tip.nav.toolsSide")), i = /* @__PURE__ */ D(() => F(r).nav.style?.tools?.side ?? "end"), a = /* @__PURE__ */ D(() => [["start", K("opt.toolsSide.start")], ["end", K("opt.toolsSide.end")]]);
				Wl(e, {
					get label() {
						return F(t);
					},
					get title() {
						return F(n);
					},
					get value() {
						return F(i);
					},
					get options() {
						return F(a);
					},
					onchange: (e) => ne("side", e === "start" ? "start" : void 0)
				});
			}
		};
		B(ui, (e) => {
			F(ie) ? e(fi) : e(pi, -1);
		}), di(N(ui, 2), 18, () => F(T), (e) => e, (t, i, a) => {
			var o = Xr(), s = j(o), c = (t) => {
				var n = Xr(), o = j(n), s = (t) => {
					var n = Lf(), o = A(n), s = A(o), c = M(s, !0), l = N(s);
					e(l, () => i, () => F(a)), E(o);
					var u = N(o, 2), d = A(u);
					U(d);
					var f = N(d);
					E(u), E(n), P((e, t, n) => {
						z(c, e), G(u, "title", t), Vi(d, F(r).nav.style?.tools?.theme !== !1), z(f, ` ${n ?? ""}`);
					}, [
						() => K("lbl.themeToggle"),
						() => K("tip.nav.themeToggle"),
						() => K("lbl.showInMenu")
					]), I("change", d, (e) => ne("theme", e.target.checked ? void 0 : !1)), R(t, n);
				};
				B(o, (e) => {
					F(r).theme?.alt?.tokens && e(s);
				}), R(t, n);
			}, u = (t) => {
				var o = Rf(), s = A(o), c = A(s), l = M(c, !0), u = N(c);
				e(u, () => i, () => F(a)), E(s);
				var d = N(s, 2), f = A(d);
				U(f);
				var p = N(f);
				E(d);
				var m = N(d, 2), h = M(m, !0);
				E(o), P((e, t, n, i) => {
					z(l, e), G(d, "title", t), Vi(f, F(r).nav.style?.tools?.links === !0), z(p, ` ${n ?? ""}`), z(h, i);
				}, [
					() => K("lbl.navToolLinks"),
					() => K("tip.nav.toolLinks"),
					() => K("lbl.showInMenu"),
					() => K("ui.editSiteLinks")
				]), I("change", f, (e) => ne("links", e.target.checked ? !0 : void 0)), I("click", m, () => {
					n.siteLinksOpen = !0, n.openPanel("site");
				}), R(t, o);
			}, d = (t) => {
				var n = zf(), o = A(n), s = A(o), c = M(s, !0), u = N(s);
				e(u, () => i, () => F(a)), E(o);
				var d = N(o, 2), f = A(d);
				U(f);
				var p = N(f);
				E(d);
				var m = N(d, 2), h = (e) => {
					var t = Of(), n = A(t), i = M(n, !0), a = N(n, 2);
					{
						let e = /* @__PURE__ */ D(() => F(r).nav.cart?.href ?? ""), t = /* @__PURE__ */ D(() => [["", K("common.none")], ...F(r).pages.map((e) => [e.path, e.title])]);
						J(a, {
							filled: !0,
							get value() {
								return F(e);
							},
							get options() {
								return F(t);
							},
							onchange: (e) => l("nav", () => {
								e ? F(r).nav.cart.href = e : delete F(r).nav.cart.href;
							})
						});
					}
					E(t), P((e, n) => {
						G(t, "title", e), z(i, n);
					}, [() => K("tip.cart.checkout"), () => K("lbl.checkoutPage")]), R(e, t);
				};
				B(m, (e) => {
					F(r).nav.cart?.show && e(h);
				}), E(n), P((e, t, n) => {
					z(c, e), G(d, "title", t), Vi(f, F(r).nav.cart?.show === !0), z(p, ` ${n ?? ""}`);
				}, [
					() => K("lbl.cart"),
					() => K("tip.nav.cart"),
					() => K("lbl.showInMenu")
				]), I("change", f, (e) => l("nav", () => {
					e.target.checked ? F(r).nav.cart = {
						...F(r).nav.cart ?? {},
						show: !0
					} : delete F(r).nav.cart;
				})), R(t, n);
			}, f = (t) => {
				var n = qf(), o = A(n), s = A(o), c = A(s, !0), l = N(c);
				e(l, () => i, () => F(a)), E(s), E(o);
				var u = N(o, 2), d = A(u), f = A(d);
				U(f);
				var p = N(f);
				E(d);
				var m = N(d, 2), h = (e) => {
					var t = Kf(), n = j(t), i = A(n), a = M(i, !0), o = N(i, 2);
					di(o, 21, () => F(Fe), ([e, t]) => e, (e, t) => {
						var n = /* @__PURE__ */ D(() => g(F(t), 2));
						let i = () => F(n)[0], a = () => F(n)[1];
						var o = pf();
						let s;
						var c = A(o);
						V(c, () => v[i()]);
						var l = M(N(c), !0);
						E(o), P(() => {
							s = H(o, 1, "tile", null, s, { on: (F(r).nav.launcher?.view ?? "grid") === i() }), G(o, "aria-pressed", (F(r).nav.launcher?.view ?? "grid") === i()), z(l, a());
						}), I("click", o, () => be("view", i() === "grid" ? void 0 : i())), R(e, o);
					}), E(o), E(n);
					var s = N(n, 2);
					{
						let e = /* @__PURE__ */ D(() => K("lbl.launcherMobileView")), t = /* @__PURE__ */ D(() => K("tip.nav.launcherMobileView")), n = /* @__PURE__ */ D(() => F(r).nav.launcher?.mobileView ?? ""), i = /* @__PURE__ */ D(() => [["", K("lbl.navSameAsDesktop")], ...F(Fe)]);
						Wl(s, {
							get label() {
								return F(e);
							},
							get title() {
								return F(t);
							},
							get value() {
								return F(n);
							},
							get options() {
								return F(i);
							},
							onchange: (e) => be("mobileView", e || void 0)
						});
					}
					var c = N(s, 2), l = A(c), u = M(l, !0), d = N(l, 2);
					U(d);
					var f = M(N(d, 2), !0);
					E(c);
					var p = N(c, 2), m = A(p);
					U(m);
					var h = N(m);
					E(p);
					var _ = N(p, 2), y = (e) => {
						var t = Bf(), n = A(t), i = M(n, !0), a = N(n, 2);
						U(a), E(t), P((e, n, o) => {
							G(t, "title", e), z(i, n), G(a, "placeholder", o), W(a, F(r).nav.launcher?.title ?? "");
						}, [
							() => K("tip.nav.launcherTitleText"),
							() => K("lbl.launcherTitle"),
							() => K("ph.launcherTitle")
						]), I("change", a, (e) => be("title", e.target.value.trim() || void 0)), R(e, t);
					};
					B(_, (e) => {
						F(r).nav.launcher?.showTitle !== !1 && e(y);
					});
					var b = N(_, 2), x = A(b), S = M(x, !0), C = N(x, 2), w = A(C);
					{
						let e = /* @__PURE__ */ D(() => F(r).nav.launcher?.icon ?? ""), t = /* @__PURE__ */ D(() => F(r).nav.launcher?.image ?? ""), n = /* @__PURE__ */ D(ve), i = /* @__PURE__ */ D(() => K("opt.launcherDots")), a = /* @__PURE__ */ D(() => K("tip.nav.launcherIcon"));
						Sl(w, {
							get icon() {
								return F(e);
							},
							get image() {
								return F(t);
							},
							get images() {
								return F(n);
							},
							klass: "lbtn-mark",
							get noneLabel() {
								return F(i);
							},
							get label() {
								return F(a);
							},
							onpick: (e) => ye(null, e),
							onfile: (e) => Te(e, null),
							children: (e, t) => {
								var n = Xr(), i = j(n), a = (e) => {
									var t = uf();
									P(() => G(t, "src", F(r).nav.launcher.image)), R(e, t);
								}, o = (e) => {
									var t = Xr();
									V(j(t), () => Zs(F(r).nav.launcher.icon) || ""), R(e, t);
								}, s = (e) => {
									var t = Xr();
									V(j(t), () => ge), R(e, t);
								};
								B(i, (e) => {
									F(r).nav.launcher?.image ? e(a) : F(r).nav.launcher?.icon ? e(o, 1) : e(s, -1);
								}), R(e, n);
							},
							$$slots: { default: !0 }
						});
					}
					var ee = N(w, 2), T = A(ee), te = (e) => {
						var t = Yr();
						P((e) => z(t, e), [() => K("mp.ownImage")]), R(e, t);
					}, ne = (e) => {
						var t = Yr();
						P((e) => z(t, e), [() => K(Ys[F(r).nav.launcher.icon]?.labelKey ?? "common.none")]), R(e, t);
					}, re = (e) => {
						var t = Yr();
						P((e) => z(t, e), [() => K("opt.launcherDots")]), R(e, t);
					};
					B(T, (e) => {
						F(r).nav.launcher?.image ? e(te) : F(r).nav.launcher?.icon ? e(ne, 1) : e(re, -1);
					}), E(ee), E(C), E(b);
					var ie = N(b, 2);
					di(ie, 17, () => F(r).nav.launcher?.links ?? [], si, (e, t, n) => {
						let i = /* @__PURE__ */ D(() => !Ws(F(t).href ?? ""));
						var a = Gf();
						let o;
						var s = A(a), c = A(s), l = A(c), u = (e) => {
							var n = uf();
							P(() => G(n, "src", F(t).image)), R(e, n);
						}, d = (e) => {
							var n = Xr();
							V(j(n), () => Zs(F(t).icon) || ""), R(e, n);
						};
						B(l, (e) => {
							F(t).image ? e(u) : e(d, -1);
						}), E(c);
						var f = N(c, 2), p = M(f, !0), m = N(f, 2), h = (e) => {
							var t = Vf();
							V(t, () => q.warn, !0), E(t), P((e) => G(t, "title", e), [() => K("tip.badTarget")]), R(e, t);
						};
						B(m, (e) => {
							F(i) && e(h);
						});
						var g = N(m, 2), _ = A(g);
						_.disabled = n === 0, V(_, () => q.up, !0), E(_);
						var v = N(_, 2);
						V(v, () => q.down, !0), E(v), E(g);
						var y = N(g, 2);
						V(y, () => q.caret, !0), E(y), E(s);
						var b = N(s, 2), x = (e) => {
							var r = Wf(), a = A(r);
							{
								let e = /* @__PURE__ */ D(() => F(t).icon ?? ""), r = /* @__PURE__ */ D(() => F(t).image ?? ""), i = /* @__PURE__ */ D(ve), o = /* @__PURE__ */ D(() => K("mp.pickMark"));
								Sl(a, {
									get icon() {
										return F(e);
									},
									get image() {
										return F(r);
									},
									get images() {
										return F(i);
									},
									klass: "lrow-tile",
									get label() {
										return F(o);
									},
									onpick: (e) => ye(n, e),
									onfile: (e) => Te(e, n),
									children: (e, n) => {
										var r = Hf(), i = j(r), a = A(i), o = (e) => {
											var n = uf();
											P(() => G(n, "src", F(t).image)), R(e, n);
										}, s = (e) => {
											var n = Xr();
											V(j(n), () => Zs(F(t).icon) || ""), R(e, n);
										};
										B(a, (e) => {
											F(t).image ? e(o) : F(t).icon && e(s, 1);
										}), E(i);
										var c = M(N(i, 2), !0);
										P((e) => z(c, e), [() => F(t).label || K("seed.link")]), R(e, r);
									},
									$$slots: { default: !0 }
								});
							}
							var o = N(a, 2), s = A(o);
							U(s);
							var c = N(s, 2);
							U(c);
							let l;
							var u = N(c, 2), d = (e) => {
								var t = Uf(), n = M(t, !0);
								P((e) => z(n, e), [() => K("ui.badTarget")]), R(e, t);
							};
							B(u, (e) => {
								F(i) && e(d);
							});
							var f = N(u, 2), p = A(f);
							{
								let e = /* @__PURE__ */ D(() => F(t).icon ?? ""), r = /* @__PURE__ */ D(() => F(t).image ?? ""), i = /* @__PURE__ */ D(ve), a = /* @__PURE__ */ D(() => K("mp.pickMark"));
								Sl(p, {
									get icon() {
										return F(e);
									},
									get image() {
										return F(r);
									},
									get images() {
										return F(i);
									},
									klass: "linkish",
									get label() {
										return F(a);
									},
									onpick: (e) => ye(n, e),
									onfile: (e) => Te(e, n),
									children: (e, t) => {
										Ae();
										var n = Yr();
										P((e) => z(n, e), [() => K("mp.changeMark")]), R(e, n);
									},
									$$slots: { default: !0 }
								});
							}
							var m = N(p, 2), h = M(m, !0);
							E(f), E(o), E(r), P((e, n, r, a, o, u) => {
								W(s, F(t).label), G(s, "title", e), G(s, "placeholder", n), l = H(c, 1, "field-filled", null, l, { "bad-target": F(i) }), W(c, F(t).href ?? ""), G(c, "placeholder", r), G(c, "title", a), G(m, "title", o), z(h, u);
							}, [
								() => K("tip.nav.launcherLabel"),
								() => K("lbl.text"),
								() => K("ph.hrefAnchor"),
								() => F(i) ? K("tip.badTarget") : K("tip.hrefAnchor"),
								() => K("tip.removeLink"),
								() => K("ui.remove")
							]), I("change", s, (e) => we(n, "label", e.target.value)), I("change", c, (e) => we(n, "href", e.target.value)), I("click", m, () => Se(n)), R(e, r);
						};
						B(b, (e) => {
							F(_e) === n && e(x);
						}), E(a), P((e, t, i) => {
							o = H(a, 1, "lrow", null, o, { open: F(_e) === n }), z(p, e), G(_, "title", t), G(v, "title", i), v.disabled = n === F(r).nav.launcher.links.length - 1;
						}, [
							() => F(t).label || K("seed.link"),
							() => K("tip.moveUp"),
							() => K("tip.moveDown")
						]), I("click", s, () => k(_e, F(_e) === n ? null : n, !0)), I("keydown", s, (e) => {
							(e.key === "Enter" || e.key === " ") && (e.preventDefault(), k(_e, F(_e) === n ? null : n, !0));
						}), I("click", g, (e) => e.stopPropagation()), I("keydown", g, (e) => e.stopPropagation()), I("click", _, () => Ce(n, -1)), I("click", v, () => Ce(n, 1)), R(e, a);
					});
					var ae = N(ie, 2), oe = M(ae, !0);
					P((e, t, n, i, s, l, g, _) => {
						z(a, e), G(o, "aria-label", t), G(c, "title", n), z(u, i), W(d, F(r).nav.launcher?.mobileMax ?? 6), z(f, F(r).nav.launcher?.mobileMax ?? 6), G(p, "title", s), Vi(m, F(r).nav.launcher?.showTitle !== !1), z(h, ` ${l ?? ""}`), z(S, g), z(oe, _);
					}, [
						() => K("lbl.design"),
						() => K("lbl.design"),
						() => K("tip.nav.launcherMobileMax"),
						() => K("lbl.launcherMobileMax"),
						() => K("tip.nav.launcherTitle"),
						() => K("lbl.launcherShowTitle"),
						() => K("lbl.launcherButton"),
						() => K("ui.addLauncherLink")
					]), I("input", d, (e) => be("mobileMax", e.target.valueAsNumber === 6 ? void 0 : e.target.valueAsNumber)), I("change", m, (e) => be("showTitle", e.target.checked ? void 0 : !1)), I("click", ae, xe), R(e, t);
				};
				B(m, (e) => {
					F(r).nav.launcher?.show === !0 && e(h);
				}), E(u), E(n), P((e, t, n, i) => {
					G(o, "title", e), z(c, t), G(d, "title", n), Vi(f, F(r).nav.launcher?.show === !0), z(p, ` ${i ?? ""}`);
				}, [
					() => K("tip.nav.launcher"),
					() => K("group.launcher"),
					() => K("tip.nav.launcher"),
					() => K("lbl.showInMenu")
				]), I("change", f, (e) => be("show", e.target.checked ? !0 : void 0)), R(t, n);
			};
			B(s, (e) => {
				i === "theme" ? e(c) : i === "links" ? e(u, 1) : i === "cart" ? e(d, 2) : e(f, -1);
			}), R(t, o);
		}), E(li);
	}
	E(ai);
	var mi = N(ai, 2), hi = A(mi), gi = M(hi, !0), _i = N(hi, 2), vi = A(_i), yi = A(vi), bi = M(yi, !0), xi = N(yi, 2);
	let Si;
	di(xi, 21, () => F(Ie), ([e, t]) => e, (e, t) => {
		var n = /* @__PURE__ */ D(() => g(F(t), 2));
		let i = () => F(n)[0], a = () => F(n)[1];
		var o = pf();
		let s;
		var c = A(o);
		V(c, () => _[i()]);
		var l = M(N(c), !0);
		E(o), P(() => {
			s = H(o, 1, "tile", null, s, { on: (F(r).nav.style?.subStyle ?? "card") === i() }), G(o, "aria-pressed", (F(r).nav.style?.subStyle ?? "card") === i()), z(l, a());
		}), I("click", o, () => re("subStyle", i() === "card" ? void 0 : i())), R(e, o);
	}), E(xi), E(vi);
	var Ci = N(vi, 2), wi = (e) => {
		var t = Tf(), n = j(t), i = (e) => {
			var t = Tf(), n = j(t);
			{
				let e = /* @__PURE__ */ D(() => K("lbl.sideSubs")), t = /* @__PURE__ */ D(() => K("tip.nav.sideSubs")), i = /* @__PURE__ */ D(() => F(r).nav.style?.sideSubs ?? "collapsed"), a = /* @__PURE__ */ D(() => [["collapsed", K("opt.mobileSubs.collapsed")], ["expanded", K("opt.mobileSubs.expanded")]]);
				Wl(n, {
					get label() {
						return F(e);
					},
					get title() {
						return F(t);
					},
					get value() {
						return F(i);
					},
					get options() {
						return F(a);
					},
					onchange: (e) => re("sideSubs", e === "collapsed" ? void 0 : e)
				});
			}
			var i = N(n, 2), a = (e) => {
				var t = Cf(), n = A(t);
				U(n);
				var i = N(n);
				E(t), P((e, a) => {
					G(t, "title", e), Vi(n, F(r).nav.style?.sideSubArrow === !0), z(i, ` ${a ?? ""}`);
				}, [() => K("tip.nav.sideSubArrow"), () => K("lbl.sideSubArrow")]), I("change", n, (e) => re("sideSubArrow", e.target.checked ? !0 : void 0)), R(e, t);
			};
			B(i, (e) => {
				F(r).nav.style?.sideSubs === "expanded" && e(a);
			}), R(e, t);
		};
		B(n, (e) => {
			F(ie) && e(i);
		});
		var a = N(n, 2), o = (e) => {
			{
				let t = /* @__PURE__ */ D(() => K("lbl.subOpen")), n = /* @__PURE__ */ D(() => K("tip.nav.subOpen")), i = /* @__PURE__ */ D(() => F(r).nav.style?.subOpen ?? "hover"), a = /* @__PURE__ */ D(() => [
					["hover", K("opt.subOpen.hover")],
					["stay", K("opt.subOpen.stay")],
					["click", K("opt.subOpen.click")]
				]);
				Wl(e, {
					get label() {
						return F(t);
					},
					get title() {
						return F(n);
					},
					get value() {
						return F(i);
					},
					get options() {
						return F(a);
					},
					onchange: (e) => re("subOpen", e === "hover" ? void 0 : e)
				});
			}
		};
		B(a, (e) => {
			(!F(ie) || F(r).nav.style?.sideSubs !== "expanded") && e(o);
		}), R(e, t);
	}, Ti = /* @__PURE__ */ D(() => F(r).nav.items?.some((e) => e.children?.length));
	B(Ci, (e) => {
		F(Ti) && e(wi);
	});
	var Ei = N(Ci, 2), Di = (e) => {
		var t = Jf(), n = A(t), i = N(n);
		{
			let e = /* @__PURE__ */ D(() => F(r).nav.style?.subPillColor ?? "surface"), t = /* @__PURE__ */ D(u), n = /* @__PURE__ */ D(() => K("tip.nav.subPillColorPick"));
			sl(i, {
				get value() {
					return F(e);
				},
				get tokens() {
					return F(t);
				},
				get label() {
					return F(n);
				},
				onchange: (e) => re("subPillColor", e)
			});
		}
		E(t), P((e, r) => {
			G(t, "title", e), z(n, `${r ?? ""} `);
		}, [() => K("tip.nav.subPillColor"), () => K("lbl.subPillColor")]), R(e, t);
	};
	B(Ei, (e) => {
		F(r).nav.style?.subStyle === "pills" && e(Di);
	});
	var Oi = N(Ei, 2), ki = A(Oi), Ai = N(ki);
	U(Ai), E(Oi), E(_i), E(mi);
	var ji = N(mi, 2), Mi = A(ji), Ni = M(Mi, !0), Pi = N(Mi, 2);
	{
		let e = (e, t = f) => {
			let n = /* @__PURE__ */ D(Qe);
			var r = Yf();
			let i;
			var a = A(r);
			V(a, () => it, !0), E(a);
			var o = N(a, 2), s = A(o), c = M(s, !0), l = M(N(s, 2), !0);
			E(o), E(r), P(() => {
				i = H(r, 1, "nav-item ghost", null, i, { child: t() }), z(c, F(n).label), z(l, F(n).target);
			}), R(e, r);
		};
		var Fi = A(Pi);
		di(Fi, 21, () => F(r).nav.items, si, (t, n, i) => {
			let a = /* @__PURE__ */ D(() => `${i}`);
			var o = $f(), s = j(o), c = (t) => {
				e(t, () => !1);
			};
			B(s, (e) => {
				F(Je)?.key === F(a) && F(Je).pos === "before" && e(c);
			});
			var l = N(s, 2);
			let u;
			var d = A(l);
			V(d, () => it, !0), E(d);
			var f = N(d, 2), p = A(f);
			U(p);
			var m = N(p, 2), h = A(m);
			{
				let e = /* @__PURE__ */ D(() => F(n).page ?? (F(n).href == null ? "__none" : "__href")), t = /* @__PURE__ */ D(() => K("tip.linkTarget")), a = /* @__PURE__ */ D(() => [
					...F(r).pages.map((e) => [e.id, e.title]),
					["__href", K("opt.linkHref")],
					...F(n).children ? [["__none", K("opt.noLink")]] : []
				]);
				J(h, {
					compact: !0,
					get value() {
						return F(e);
					},
					get title() {
						return F(t);
					},
					get options() {
						return F(a);
					},
					onchange: (e) => He(i, e)
				});
			}
			var g = N(h, 2), _ = (e) => {
				var t = Xf();
				U(t), P((e, r) => {
					W(t, F(n).href), G(t, "placeholder", e), G(t, "title", r);
				}, [() => K("ph.hrefAnchor"), () => K("tip.hrefAnchor")]), I("change", t, (e) => Ue(i, e.target.value)), R(e, t);
			};
			B(g, (e) => {
				!F(n).page && F(n).href != null && e(_);
			}), E(m), E(f);
			var v = N(f, 2), y = (e) => {
				var t = Zf();
				V(t, () => "<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M6 9l6 6 6-6\"/></svg>", !0), E(t), P((e) => G(t, "title", e), [() => K("tip.nav.hasSubmenu")]), R(e, t);
			};
			B(v, (e) => {
				F(n).children?.length && e(y);
			});
			var b = N(v, 2), x = A(b);
			V(x, () => q.plus, !0), E(x);
			var S = N(x, 2);
			S.disabled = i === 0, V(S, () => q.up, !0), E(S);
			var C = N(S, 2);
			V(C, () => q.cross, !0), E(C);
			var w = N(C, 2);
			V(w, () => q.down, !0), E(w), E(b);
			var ee = N(b, 2);
			V(ee, () => q.kebab, !0), E(ee), E(l);
			var T = N(l, 2);
			di(T, 17, () => F(n).children ?? [], si, (t, a, o) => {
				let s = /* @__PURE__ */ D(() => `${i}.${o}`);
				var c = Qf(), l = j(c), u = (t) => {
					e(t, () => !0);
				};
				B(l, (e) => {
					F(Je)?.key === F(s) && F(Je).pos === "before" && e(u);
				});
				var d = N(l, 2);
				let f;
				var p = A(d);
				V(p, () => it, !0), E(p);
				var m = N(p, 2), h = A(m);
				U(h);
				var g = N(h, 2), _ = A(g);
				{
					let e = /* @__PURE__ */ D(() => F(a).page ?? "__href"), t = /* @__PURE__ */ D(() => K("tip.linkTarget")), n = /* @__PURE__ */ D(() => [...F(r).pages.map((e) => [e.id, e.title]), ["__href", K("opt.linkHref")]]);
					J(_, {
						compact: !0,
						get value() {
							return F(e);
						},
						get title() {
							return F(t);
						},
						get options() {
							return F(n);
						},
						onchange: (e) => ut(i, o, e)
					});
				}
				var v = N(_, 2), y = (e) => {
					var t = Xf();
					U(t), P((e, n) => {
						W(t, F(a).href ?? ""), G(t, "placeholder", e), G(t, "title", n);
					}, [() => K("ph.hrefAnchor"), () => K("tip.hrefAnchor")]), I("change", t, (e) => dt(i, o, e.target.value)), R(e, t);
				};
				B(v, (e) => {
					F(a).page || e(y);
				}), E(g), E(m);
				var b = N(m, 2), x = A(b);
				x.disabled = o === 0, V(x, () => q.up, !0), E(x);
				var S = N(x, 2);
				V(S, () => q.cross, !0), E(S);
				var C = N(S, 2);
				V(C, () => q.down, !0), E(C), E(b);
				var w = N(b, 2);
				V(w, () => q.kebab, !0), E(w), E(d);
				var ee = N(d, 2), T = (t) => {
					e(t, () => !0);
				};
				B(ee, (e) => {
					F(Je)?.key === F(s) && F(Je).pos === "after" && e(T);
				}), P((e, t, r, i, c, l, u) => {
					f = H(d, 1, "nav-item child", null, f, {
						selected: F(Ke) === F(s),
						dragging: F(qe) === F(s)
					}), G(d, "data-key", F(s)), G(p, "title", e), W(h, F(a).label), G(h, "title", t), G(x, "title", r), G(S, "title", i), G(C, "title", c), C.disabled = o === F(n).children.length - 1, G(w, "title", l), G(w, "aria-label", u);
				}, [
					() => K("tip.nav.dragItem"),
					() => K("tip.nav.childLabel"),
					() => K("tip.moveUp"),
					() => K("tip.nav.removeChild"),
					() => K("tip.moveDown"),
					() => K("tip.nav.itemActions"),
					() => K("tip.nav.itemActions")
				]), I("click", d, (e) => {
					e.stopPropagation(), k(Ke, F(s));
				}), Br("dragstart", p, (e) => {
					e.stopPropagation(), k(qe, F(s)), e.dataTransfer?.setData(et, F(s));
				}), Br("dragend", p, $e), I("input", h, (e) => lt(i, o, e.target.value)), I("click", x, () => ft(i, o, -1)), I("click", S, () => pt(i, o)), I("click", C, () => ft(i, o, 1)), I("click", w, (e) => {
					e.stopPropagation(), k(Ke, F(s));
				}), R(t, c);
			});
			var te = N(T, 2), ne = (t) => {
				e(t, () => !0);
			};
			B(te, (e) => {
				F(Je)?.key === F(a) && F(Je).pos === "into" && e(ne);
			});
			var re = N(te, 2), ie = (t) => {
				e(t, () => !1);
			};
			B(re, (e) => {
				F(Je)?.key === F(a) && F(Je).pos === "after" && e(ie);
			}), P((e, t, o, s, c, f, m, h) => {
				u = H(l, 1, "nav-item", null, u, {
					selected: F(Ke) === F(a),
					dragging: F(qe) === F(a),
					"drop-target": F(Je)?.key === F(a) && F(Je).pos === "into"
				}), G(l, "data-key", F(a)), G(d, "title", e), W(p, F(n).label), G(p, "title", t), G(x, "title", o), G(S, "title", s), G(C, "title", c), G(w, "title", f), w.disabled = i === F(r).nav.items.length - 1, G(ee, "title", m), G(ee, "aria-label", h);
			}, [
				() => K("tip.nav.dragItem"),
				() => K("tip.nav.itemLabel"),
				() => K("tip.nav.addChild"),
				() => K("tip.moveUp"),
				() => K("tip.nav.removeItem"),
				() => K("tip.moveDown"),
				() => K("tip.nav.itemActions"),
				() => K("tip.nav.itemActions")
			]), I("click", l, () => {
				k(Ke, F(a));
			}), Br("dragstart", d, (e) => {
				k(qe, F(a)), e.dataTransfer?.setData(et, F(a));
			}), Br("dragend", d, $e), I("input", p, (e) => Ve(i, e.target.value)), I("click", x, () => ct(i)), I("click", S, () => We(i, -1)), I("click", C, () => Ge(i)), I("click", w, () => We(i, 1)), I("click", ee, () => {
				k(Ke, F(a));
			}), R(t, o);
		}), E(Fi);
		var Ii = N(Fi, 2), Li = M(Ii, !0), Ri = N(Ii, 2), zi = A(Ri);
		U(zi);
		var Bi = N(zi, 2), Hi = M(Bi, !0);
		E(Ri), E(Pi), P((e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h, g, _, v, y, b, x, S, C, w, ee, T, te, ne, re, ie, ae, oe, se, ce, le, ue, de, fe, pe, me, he, ge, _e, ve, ye, be, xe, Se, Ce, we, Te, Ee, De, Oe, ke, E, Ae) => {
			z(Li, De), G(Ri, "title", Oe), G(zi, "placeholder", ke), Bi.disabled = E, z(Hi, Ae);
		}, [
			() => K("hint.nav.logoHome"),
			() => K("group.logo"),
			() => K("group.appearance"),
			() => K("group.navLayout"),
			() => K("tip.nav.variant"),
			() => K("lbl.navVariant"),
			() => K("lbl.navVariant"),
			() => K("tip.nav.sizePreset"),
			() => K("lbl.size"),
			() => K("tip.nav.sizePreset"),
			() => K("lbl.adjust"),
			() => K("tip.nav.menuTextSize"),
			() => K("lbl.navTextSize"),
			() => K("group.navFrame"),
			() => K("group.navBehaviour"),
			() => K("tip.nav.mobileSame"),
			() => K("group.mobile"),
			() => K("tip.nav.menuTextSize"),
			() => K("lbl.navTextSize"),
			() => K("lbl.navSameAsDesktop"),
			() => K("tip.nav.mobileSize"),
			() => K("lbl.size"),
			() => K("tip.nav.mobileLayout"),
			() => K("lbl.navPlacement"),
			() => K("tip.nav.mobileTools"),
			() => K("lbl.toolsSide"),
			() => K("tip.nav.mobileBorder"),
			() => K("lbl.navBorder"),
			() => K("tip.nav.mobileMenu"),
			() => K("lbl.mobileMenu"),
			() => K("group.navColours"),
			() => K("lbl.navHover"),
			() => K("lbl.navHover"),
			() => K("tip.nav.hoverTextColor"),
			() => K("lbl.hoverTextColor"),
			() => K("tip.nav.textColorPick"),
			() => K("lbl.textColor"),
			() => K("tip.nav.blur"),
			() => K("lbl.navBlur"),
			() => K("lbl.background"),
			() => K("tip.nav.announce"),
			() => K("group.announcement"),
			() => K("tip.nav.announce"),
			() => K("lbl.announceShow"),
			() => K("tip.nav.tools"),
			() => K("group.tools"),
			() => K("group.submenu"),
			() => K("lbl.design"),
			() => K("lbl.design"),
			() => K("tip.nav.subColumns"),
			() => K("lbl.columns"),
			() => K("hint.nav.submenu"),
			() => K("group.menuItems"),
			() => K("ui.addMenuItem"),
			() => K("tip.nav.newPageAsItem"),
			() => K("ph.nav.newPageTitle"),
			() => !F(y).trim(),
			() => K("ui.newPageAsItem")
		]), Br("dragover", Fi, tt), Br("drop", Fi, (e) => {
			e.preventDefault(), nt(F(Je)?.key ?? "");
		}), I("click", Ii, st), I("keydown", zi, (e) => {
			e.key === "Enter" && b();
		}), Gi(zi, () => F(y), (e) => k(y, e)), I("click", Bi, b);
	}
	E(ji), E(mt), P((e, t, n, i, a, o, s, c, l, u, d, f, p, m, h, g, _, v, y, b, x, S, C, w, ee, T, te, ne, re, ae, oe, se, le, ue, de, fe, pe, me, he, ge, _e, ve, ye, be, xe, Se, Ce, we, Te, Ee, De, Oe, ke, E, Ae, je, Me, Ne) => {
		G(gt, "title", e), z(_t, t), z(Ot, n), z(Mt, i), G(Pt, "title", a), z(It, o), G(Lt, "aria-label", s), G(Xt, "title", c), z(Zt, l), G($t, "title", u), z(nn, d), G(sn, "title", f), z(ln, p), G(un, "min", wl.min), G(un, "max", wl.max), G(un, "step", wl.step), W(un, F(ce)), G(dn, "min", wl.min), G(dn, "max", wl.max), W(dn, F(ce)), z(gn, m), z(wn, h), G(kn, "title", g), z(An, _), G(In, "title", v), z(Rn, y), G(zn, "min", wl.min), G(zn, "max", wl.max), G(zn, "placeholder", b), W(zn, F(r).nav.style?.mobile?.textSize ?? ""), G(Vn, "title", x), z(Un, S), G(Gn, "title", C), z(qn, w), G(Xn, "title", ee), z(Qn, T), G(rr, "title", te), z(ar, ne), G(ur, "title", re), z(fr, ae), z(Cr, oe), z(Dr, se), G(Or, "aria-label", le), G(Pr, "title", ue), z(Ir, de), G(Lr, "title", fe), z(zr, pe), G(Vr, "title", me), Vi(Hr, F(r).nav.style?.blur !== !1), z(Ur, ` ${he ?? ""}`), z(Kr, ge), G(Zr, "title", _e), z(Qr, ve), G(ei, "title", ye), Vi(ti, F(r).nav.announcement?.show === !0), z(ni, ` ${be ?? ""}`), G(oi, "title", xe), z(ci, Se), z(gi, Ce), z(bi, we), Si = H(xi, 1, "tile-grid", null, Si, {
			"cols-5": !F(ie),
			"cols-3": F(ie)
		}), G(xi, "aria-label", Te), G(Oi, "title", Ee), z(ki, `${De ?? ""} `), W(Ai, F(r).nav.style?.subColumns ?? 1), G(Mi, "title", Oe), z(Ni, ke);
	}, [
		() => K("hint.nav.logoHome"),
		() => K("group.logo"),
		() => K("group.appearance"),
		() => K("group.navLayout"),
		() => K("tip.nav.variant"),
		() => K("lbl.navVariant"),
		() => K("lbl.navVariant"),
		() => K("tip.nav.sizePreset"),
		() => K("lbl.size"),
		() => K("tip.nav.sizePreset"),
		() => K("lbl.adjust"),
		() => K("tip.nav.menuTextSize"),
		() => K("lbl.navTextSize"),
		() => K("group.navFrame"),
		() => K("group.navBehaviour"),
		() => K("tip.nav.mobileSame"),
		() => K("group.mobile"),
		() => K("tip.nav.menuTextSize"),
		() => K("lbl.navTextSize"),
		() => K("lbl.navSameAsDesktop"),
		() => K("tip.nav.mobileSize"),
		() => K("lbl.size"),
		() => K("tip.nav.mobileLayout"),
		() => K("lbl.navPlacement"),
		() => K("tip.nav.mobileTools"),
		() => K("lbl.toolsSide"),
		() => K("tip.nav.mobileBorder"),
		() => K("lbl.navBorder"),
		() => K("tip.nav.mobileMenu"),
		() => K("lbl.mobileMenu"),
		() => K("group.navColours"),
		() => K("lbl.navHover"),
		() => K("lbl.navHover"),
		() => K("tip.nav.hoverTextColor"),
		() => K("lbl.hoverTextColor"),
		() => K("tip.nav.textColorPick"),
		() => K("lbl.textColor"),
		() => K("tip.nav.blur"),
		() => K("lbl.navBlur"),
		() => K("lbl.background"),
		() => K("tip.nav.announce"),
		() => K("group.announcement"),
		() => K("tip.nav.announce"),
		() => K("lbl.announceShow"),
		() => K("tip.nav.tools"),
		() => K("group.tools"),
		() => K("group.submenu"),
		() => K("lbl.design"),
		() => K("lbl.design"),
		() => K("tip.nav.subColumns"),
		() => K("lbl.columns"),
		() => K("hint.nav.submenu"),
		() => K("group.menuItems"),
		() => K("ui.addMenuItem"),
		() => K("tip.nav.newPageAsItem"),
		() => K("ph.nav.newPageTitle"),
		() => !F(y).trim(),
		() => K("ui.newPageAsItem")
	]), I("input", un, (e) => re("textSize", e.target.valueAsNumber)), I("change", dn, (e) => De(e, "textSize", wl)), I("change", zn, (e) => Oe(e, "textSize", wl)), I("change", Hr, (e) => re("blur", e.target.checked)), I("change", ti, (e) => he("show", e.target.checked ? !0 : void 0)), I("change", Ai, (e) => re("subColumns", Number(e.target.value) > 1 ? Number(e.target.value) : void 0)), R(e, mt), ot();
}
Vr([
	"input",
	"change",
	"click",
	"keydown"
]);
var np = 1920, rp = [
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
], ip = [
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
], ap = [
	1920,
	1536,
	1366
];
function op(e) {
	let t = Number(e);
	if (!Number.isFinite(t)) return 1440;
	let n = Math.round(t / 20) * 20;
	return Math.min(np, Math.max(960, n));
}
function sp(e) {
	let t = Number(e);
	if (!Number.isFinite(t)) return 6;
	let n = Math.round(t / 1) * 1;
	return Math.min(12, Math.max(0, n));
}
function cp(e, t) {
	if (e === "full") return 0;
	let n = Math.min(49, Math.max(0, Number(t) || 0));
	return Math.ceil(Number(e) / (1 - 2 * n / 100));
}
function lp(e, t, n) {
	let r = Math.max(0, Number(t) || 0) / 100 * n, i = Math.max(0, n - 2 * r), a = e !== "full" && Number(e) < i, o = a ? Number(e) : i;
	return {
		width: o,
		margin: Math.round((n - o) / 2),
		pct: n > 0 ? o / n * 100 : 0,
		bound: a
	};
}
function up(e) {
	return ip.find((t) => t.width === e)?.id ?? null;
}
//#endregion
//#region ../template/assets/engine/0.7.6/calendar-format.js
function dp(e) {
	if (typeof e != "string" || !e.trim()) return !1;
	try {
		return new Intl.DateTimeFormat("en", { timeZone: e.trim() }), !0;
	} catch {
		return !1;
	}
}
//#endregion
//#region ../template/assets/engine/0.7.6/map-links.js
var fp = {
	osm: {
		url: "https://www.openstreetmap.org/search?query=",
		names: !1
	},
	duckduckgo: {
		url: "https://duckduckgo.com/?iaxm=maps&q=",
		names: !0
	},
	brave: {
		url: "https://search.brave.com/maps?q=",
		names: !0
	},
	here: {
		url: "https://wego.here.com/search/",
		names: !0
	},
	google: {
		url: "https://www.google.com/maps/search/?api=1&query=",
		names: !0
	},
	apple: {
		url: "https://maps.apple.com/search?query=",
		names: !0
	},
	norgeskart: {
		url: "https://norgeskart.no/?sok=",
		names: !1
	},
	finn: {
		url: "https://kart.finn.no/?q=",
		names: !0
	}
}, pp = Object.keys(fp);
function mp(e) {
	let t = e?.site?.mapService;
	return Object.hasOwn(fp, t) ? t : "osm";
}
//#endregion
//#region ../template/assets/engine/0.7.6/meeting-links.js
var hp = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/;
function gp(e) {
	let t = Array.isArray(e) ? e : String(e ?? "").split(/[\s,;]+/), n = [];
	for (let e of t) {
		let t = String(e ?? "").trim().toLowerCase();
		if (!t) continue;
		let r = "";
		try {
			r = new URL(/^[a-z][a-z0-9+.-]*:\/\//.test(t) ? t : `https://${t}`).hostname;
		} catch {}
		hp.test(r) && !n.includes(r) && n.push(r);
	}
	return n;
}
//#endregion
//#region src/lib/swatch.js
var _p = (e) => e ? e.startsWith("#") ? e : `var(--urd-color-${e})` : "var(--urd-color-accent)", vp = 1600, yp = .82, bp = .6, xp = 15e6, Sp = 4e6, Cp = 256e3;
function wp(e) {
	if (!Ep(e, 0, "GIF8")) return !1;
	for (let t = 13; t < e.length - 11; t++) if (e[t] === 33 && e[t + 1] === 255 && e[t + 2] === 11 && (Ep(e, t + 3, "NETSCAPE2.0") || Ep(e, t + 3, "ANIMEXTS1.0"))) return !0;
	return !1;
}
var Tp = class extends Error {
	constructor(e) {
		super("The animated image is too large"), this.code = "animatedTooLarge", this.bytes = e;
	}
}, Ep = (e, t, n) => {
	if (t + n.length > e.length) return !1;
	for (let r = 0; r < n.length; r += 1) if (e[t + r] !== n.charCodeAt(r)) return !1;
	return !0;
};
function Dp(e) {
	if (!Ep(e, 0, "GIF87a") && !Ep(e, 0, "GIF89a") || e.length < 13) return !1;
	let t = 13;
	e[10] & 128 && (t += 3 * 2 ** ((e[10] & 7) + 1));
	let n = () => {
		for (; t < e.length;) {
			let n = e[t];
			if (t += 1, n === 0) return;
			t += n;
		}
	}, r = 0;
	for (; t < e.length;) {
		let i = e[t];
		if (t += 1, i === 44) {
			if (r += 1, r > 1) return !0;
			if (t + 9 > e.length) return !1;
			let i = e[t + 8];
			t += 9, i & 128 && (t += 3 * 2 ** ((i & 7) + 1)), t += 1, n();
		} else if (i === 33) t += 1, n();
		else return !1;
	}
	return !1;
}
function Op(e) {
	return !Ep(e, 0, "RIFF") || !Ep(e, 8, "WEBP") ? !1 : Ep(e, 12, "VP8X") && e.length > 20 && !!(e[20] & 2);
}
function kp(e) {
	if (e.length < 16 || [
		137,
		80,
		78,
		71,
		13,
		10,
		26,
		10
	].some((t, n) => e[n] !== t)) return !1;
	let t = 8;
	for (; t + 8 <= e.length;) {
		let n = (e[t] << 24 | e[t + 1] << 16 | e[t + 2] << 8 | e[t + 3]) >>> 0;
		if (Ep(e, t + 4, "acTL")) return !0;
		if (Ep(e, t + 4, "IDAT") || Ep(e, t + 4, "IEND")) return !1;
		t += 12 + n;
	}
	return !1;
}
function Ap(e) {
	return e instanceof Uint8Array ? Dp(e) ? "gif" : Op(e) ? "webp" : kp(e) ? "png" : null : null;
}
async function jp(e) {
	if (!/^image\/(?:gif|webp|png|apng)$/i.test(e.type || "") && !/\.(?:gif|webp|a?png)$/i.test(e.name || "")) return null;
	if (e.size > 4e6) {
		let t = new Uint8Array(await e.slice(0, Cp).arrayBuffer());
		if (Ap(t) || wp(t)) throw new Tp(e.size);
		return null;
	}
	let t = new Uint8Array(await e.arrayBuffer()), n = Ap(t);
	if (!n) return null;
	let r = await new Promise((e, r) => {
		let i = new FileReader();
		i.onload = () => e(i.result), i.onerror = () => r(i.error), i.readAsDataURL(new Blob([t], { type: `image/${n}` }));
	}), i = 0, a = 0;
	try {
		let t = await createImageBitmap(e);
		i = t.width, a = t.height, t.close();
	} catch {}
	return {
		dataUrl: r,
		bytes: t.length,
		width: i,
		height: a,
		animated: !0
	};
}
async function Mp(e, t = vp, { still: n = !1 } = {}) {
	if (Pp(e)) return Fp(await e.text());
	let r = n ? null : await jp(e);
	if (r) return r;
	let i = await createImageBitmap(e), a = Math.min(1, t / Math.max(i.width, i.height)), o = Math.round(i.width * a), s = Math.round(i.height * a), c = document.createElement("canvas");
	c.width = o, c.height = s, c.getContext("2d").drawImage(i, 0, 0, o, s), i.close();
	let l = (e) => new Promise((t) => c.toBlob(t, "image/webp", e)), u = await l(yp);
	return u.size > 4e5 && (u = await l(bp)), {
		dataUrl: await new Promise((e) => {
			let t = new FileReader();
			t.onload = () => e(t.result), t.readAsDataURL(u);
		}),
		bytes: u.size,
		width: o,
		height: s
	};
}
var Np = "image/svg+xml";
function Pp(e) {
	return e.type === Np || /\.svg$/i.test(e.name || "");
}
function Fp(e) {
	let t = String(e ?? "");
	if (!/<svg[\s>]/i.test(t)) throw Error("Invalid SVG");
	if (/<\s*script[\s>]/i.test(t) || /<\s*foreignObject[\s>]/i.test(t) || /\son[a-z]+\s*=/i.test(t) || /javascript:/i.test(t)) throw Error("The SVG contains scripts or event handlers and cannot be used");
	let n = new Blob([t]).size, r = `data:${Np};base64,${btoa(unescape(encodeURIComponent(t)))}`, i = t.match(/<svg\b[^>]*>/i)?.[0] ?? "", a = i.match(/viewBox\s*=\s*["']\s*([-\d.]+(?:[\s,]+[-\d.]+){3})\s*["']/i)?.[1]?.split(/[\s,]+/).map(Number);
	return {
		dataUrl: r,
		bytes: n,
		width: a?.length === 4 ? a[2] : Number.parseFloat(i.match(/\bwidth\s*=\s*["']?([\d.]+)/i)?.[1]) || 0,
		height: a?.length === 4 ? a[3] : Number.parseFloat(i.match(/\bheight\s*=\s*["']?([\d.]+)/i)?.[1]) || 0
	};
}
function Ip(e, t, n = .04) {
	let r = String(e ?? "");
	if (!t || !(t.width > 0) || !(t.height > 0)) return r;
	let i = r.match(/<svg\b[^>]*>/i)?.[0];
	if (!i) return r;
	let a = (e) => Math.round(e * 1e3) / 1e3, o = Math.max(t.width, t.height) * Math.max(0, n), s = a(t.x - o), c = a(t.y - o), l = a(t.width + 2 * o), u = a(t.height + 2 * o), d = i.replace(/\sviewBox\s*=\s*["'][^"']*["']/i, "").replace(/\swidth\s*=\s*["'][^"']*["']/i, "").replace(/\sheight\s*=\s*["'][^"']*["']/i, "").replace(/<svg\b/i, `<svg viewBox="${s} ${c} ${l} ${u}" width="${l}" height="${u}"`);
	return r.replace(i, d);
}
function Lp(e) {
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
function Rp(e) {
	let t = e || "";
	if (/^data:image\/svg\+xml[;,]/.test(t)) return "svg";
	if (/^data:image\/gif[;,]/.test(t)) return "gif";
	if (/^data:image\/(?:png|apng)[;,]/.test(t)) return "png";
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
function zp(e, t = "image") {
	return e.replace(/\.[^.]+$/, "").toLowerCase().replaceAll("æ", "ae").replaceAll("ø", "o").replaceAll("å", "a").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || t;
}
function Bp(e) {
	let t = 5381;
	for (let n = 0; n < e.length; n++) t = (t << 5) + t + e.charCodeAt(n) >>> 0;
	return t.toString(16).padStart(8, "0");
}
//#endregion
//#region ../template/assets/engine/0.7.6/glyphs.js
var Vp = "urd-recent-glyphs", Hp = "urd-recent-icons", Up = [
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
function Wp(e, t) {
	return [t, ...(Array.isArray(e) ? e : []).filter((e) => e !== t)].slice(0, 16);
}
var Gp = (e) => {
	try {
		let t = JSON.parse(localStorage.getItem(e) ?? "[]");
		return Array.isArray(t) ? t : [];
	} catch {
		return [];
	}
}, Kp = (e, t, n) => {
	let r = Wp(t, n);
	try {
		localStorage.setItem(e, JSON.stringify(r));
	} catch {}
	return r;
};
function qp() {
	return Gp(Vp);
}
function Jp(e) {
	return Kp(Vp, qp(), e);
}
function Yp() {
	return Gp(Hp);
}
function Xp(e) {
	return Kp(Hp, Yp(), e);
}
//#endregion
//#region src/lib/GlyphPicker.svelte
var Zp = /* @__PURE__ */ L("<button type=\"button\"><span class=\"gp-svg svelte-15ln1c3\"></span></button>"), Qp = /* @__PURE__ */ L("<button type=\"button\" class=\"gp-cell svelte-15ln1c3\"> </button>"), $p = /* @__PURE__ */ L("<div class=\"gp-group svelte-15ln1c3\"> </div> <div class=\"gp-grid svelte-15ln1c3\"><!> <!></div>", 1), em = /* @__PURE__ */ L("<div class=\"gp-group svelte-15ln1c3\"> </div> <div class=\"gp-grid svelte-15ln1c3\"></div>", 1), tm = /* @__PURE__ */ L("<button type=\"button\"> </button>"), nm = /* @__PURE__ */ L("<div class=\"gp-group svelte-15ln1c3\"> </div> <button type=\"button\" class=\"ghost gp-upload svelte-15ln1c3\"> </button> <input type=\"file\" accept=\"image/*\" hidden=\"\"/> <p class=\"gp-hint svelte-15ln1c3\"> </p>", 1), rm = /* @__PURE__ */ L("<!> <!> <!> <!>", 1), im = /* @__PURE__ */ L("<img class=\"gp-own svelte-15ln1c3\"/>"), am = /* @__PURE__ */ L("<span class=\"gp-svg svelte-15ln1c3\"></span>"), om = /* @__PURE__ */ L("<div class=\"gp-pop gp-anchored svelte-15ln1c3\" popover=\"auto\"><!></div>"), sm = /* @__PURE__ */ L("<div class=\"gp-pop svelte-15ln1c3\"><!></div>"), cm = /* @__PURE__ */ L("<span class=\"gp svelte-15ln1c3\"><button type=\"button\" class=\"gp-swatch svelte-15ln1c3\"><!></button> <!></span>");
function lm(e, t) {
	at(t, !0);
	let n = (e) => {
		var n = rm(), a = j(n), o = (e) => {
			var t = $p(), n = j(t), r = M(n, !0), a = N(n, 2), o = A(a);
			di(o, 16, () => F(f), (e) => e, (e, t) => {
				var n = Zp();
				let r;
				var a = A(n);
				V(a, () => Zs(t), !0), E(a), E(n), P((e) => {
					r = H(n, 1, "gp-cell gp-cell-icon svelte-15ln1c3", null, r, { active: t === i() }), G(n, "title", e);
				}, [() => K(Ys[t].labelKey)]), I("click", n, () => w(t)), R(e, n);
			});
			var c = N(o, 2), l = (e) => {
				var t = Xr();
				di(j(t), 16, () => F(d), (e) => e, (e, t) => {
					var n = Qp(), r = M(n, !0);
					P(() => z(r, t)), I("click", n, () => C(t)), R(e, n);
				}), R(e, t);
			};
			B(c, (e) => {
				s() || e(l);
			}), E(a), P((e) => z(r, e), [() => K("common.recent")]), R(e, t);
		};
		B(a, (e) => {
			(F(d).length || F(f).length) && e(o);
		});
		var c = N(a, 2), l = (e) => {
			var t = Xr();
			di(j(t), 17, () => Xs, ([e, t]) => e, (e, t) => {
				var n = /* @__PURE__ */ D(() => g(F(t), 2));
				let r = () => F(n)[0], a = () => F(n)[1];
				var o = em(), s = j(o), c = M(s, !0), l = N(s, 2);
				di(l, 20, a, (e) => e, (e, t) => {
					var n = Zp();
					let r;
					var a = A(n);
					V(a, () => Zs(t), !0), E(a), E(n), P((e) => {
						r = H(n, 1, "gp-cell gp-cell-icon svelte-15ln1c3", null, r, { active: t === i() }), G(n, "title", e);
					}, [() => K(Ys[t].labelKey)]), I("click", n, () => w(t)), R(e, n);
				}), E(l), P((e) => z(c, e), [() => K(r())]), R(e, o);
			}), R(e, t);
		};
		B(c, (e) => {
			t.onicon && e(l);
		});
		var u = N(c, 2), p = (e) => {
			var t = Xr();
			di(j(t), 17, () => Up, ([e, t]) => e, (e, t) => {
				var n = /* @__PURE__ */ D(() => g(F(t), 2));
				let i = () => F(n)[0], a = () => F(n)[1];
				var o = em(), s = j(o), c = M(s, !0), l = N(s, 2);
				di(l, 20, () => a().split(" "), (e) => e, (e, t) => {
					var n = tm();
					let i;
					var a = M(n, !0);
					P(() => {
						i = H(n, 1, "gp-cell svelte-15ln1c3", null, i, { active: t === r() }), z(a, t);
					}), I("click", n, () => C(t)), R(e, n);
				}), E(l), P((e) => z(c, e), [() => K(i())]), R(e, o);
			}), R(e, t);
		};
		B(u, (e) => {
			s() || e(p);
		});
		var m = N(u, 2), _ = (e) => {
			var t = nm(), n = j(t), r = M(n, !0), i = N(n, 2), a = M(i, !0), o = N(i, 2);
			Zi(o, (e) => k(h, e), () => F(h));
			var s = M(N(o, 2), !0);
			P((e, t, n) => {
				z(r, e), z(a, t), z(s, n);
			}, [
				() => K("gp.ownIcon"),
				() => K("gp.upload"),
				() => K("gp.uploadHint")
			]), I("click", i, () => F(h).click()), I("change", o, ee), R(e, t);
		};
		B(m, (e) => {
			t.onimage && e(_);
		}), R(e, n);
	}, r = ra(t, "value", 3, "★"), i = ra(t, "icon", 3, null), a = ra(t, "image", 3, null), o = ra(t, "label", 19, () => K("gp.pickGlyph")), s = ra(t, "iconsOnly", 3, !1), c = Ta(), l = Da("urd-gp"), u = l.slice(2), d = /* @__PURE__ */ O(mn([])), f = /* @__PURE__ */ O(mn([])), p = /* @__PURE__ */ O(null), m = /* @__PURE__ */ O(null), h = /* @__PURE__ */ O(null), _ = /* @__PURE__ */ O(!1), v = /* @__PURE__ */ O(mn({
		top: 0,
		left: 0
	}));
	function y() {
		k(d, qp(), !0), k(f, t.onicon ? Yp().filter((e) => Ys[e]) : [], !0);
	}
	function b(e) {
		k(_, e.newState === "open"), Oa(F(p), F(_)), F(_) && y();
	}
	function x() {
		c && F(m)?.hidePopover(), k(_, !1);
	}
	function S() {
		y();
		let e = F(p).getBoundingClientRect(), t = Math.max(8, Math.min(e.right - 292, window.innerWidth - 292 - 8)), n = e.bottom + 380 + 8 > window.innerHeight ? Math.max(8, e.top - 380 - 8) : e.bottom + 6;
		k(v, {
			top: n,
			left: t
		}, !0), k(_, !0);
	}
	function C(e) {
		Jp(e), t.onpick?.(e), x();
	}
	function w(e) {
		Xp(e), t.onicon?.(e), x();
	}
	async function ee(e) {
		let n = e.target.files?.[0];
		if (e.target.value = "", n) {
			try {
				let e = await Mp(n, 256, { still: !0 });
				t.onimage?.(e.dataUrl);
			} catch (e) {
				console.warn("Urd: the icon could not be read", e);
			}
			x();
		}
	}
	Pn(() => {
		if (!F(_)) return;
		let e = () => x();
		if (window.addEventListener("blur", e), c) return () => window.removeEventListener("blur", e);
		let t = (e) => {
			F(p) && !F(p).contains(e.target) && k(_, !1);
		}, n = (e) => {
			e.key === "Escape" && k(_, !1);
		}, r = (e) => {
			F(p) && e.target instanceof Node && !F(p).contains(e.target) && k(_, !1);
		};
		return document.addEventListener("pointerdown", t, !0), document.addEventListener("keydown", n, !0), document.addEventListener("scroll", r, !0), () => {
			window.removeEventListener("blur", e), document.removeEventListener("pointerdown", t, !0), document.removeEventListener("keydown", n, !0), document.removeEventListener("scroll", r, !0);
		};
	});
	var T = cm(), te = A(T), ne = A(te), re = (e) => {
		var t = im();
		P((e) => {
			G(t, "src", a()), G(t, "alt", e);
		}, [() => K("gp.ownIcon")]), R(e, t);
	}, ie = (e) => {
		var t = am();
		V(t, () => Zs(i()), !0), E(t), R(e, t);
	}, ae = (e) => {
		var t = Yr();
		P(() => z(t, r() || "★")), R(e, t);
	};
	B(ne, (e) => {
		a() ? e(re) : i() && Ys[i()] ? e(ie, 1) : e(ae, -1);
	}), E(te);
	var oe = N(te, 2), se = (e) => {
		var t = om(), r = A(t), i = (e) => {
			n(e);
		};
		B(r, (e) => {
			F(_) && e(i);
		}), E(t), Zi(t, (e) => k(m, e), () => F(m)), P(() => {
			G(t, "id", u), Ii(t, `position-anchor: ${l ?? ""}`);
		}), Br("toggle", t, b), R(e, t);
	}, ce = (e) => {
		var t = sm(), r = A(t);
		n(r), E(t), P(() => Ii(t, `top: ${F(v).top ?? ""}px; left: ${F(v).left ?? ""}px`)), R(e, t);
	};
	B(oe, (e) => {
		c ? e(se) : F(_) && e(ce, 1);
	}), E(T), Zi(T, (e) => k(p, e), () => F(p)), P(() => {
		G(te, "title", o()), G(te, "aria-label", o()), G(te, "popovertarget", c ? u : void 0), Ii(te, c ? `anchor-name: ${l}` : void 0);
	}), I("click", te, function(...e) {
		(c ? void 0 : () => F(_) ? k(_, !1) : S())?.apply(this, e);
	}), R(e, T), ot();
}
Vr(["click", "change"]);
//#endregion
//#region src/lib/LinkList.svelte
var um = /* @__PURE__ */ L("<button class=\"ghost row-tool\"></button>"), dm = /* @__PURE__ */ L("<div class=\"nav-row link-row\"><span class=\"nav-line\"><!> <input class=\"nav-target\"/> <!></span> <span class=\"nav-line\"><input class=\"nav-target\" spellcheck=\"false\"/> <span class=\"row-tools\"><button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button></span></span></div>"), fm = /* @__PURE__ */ L("<!> <button class=\"ghost action\"> </button>", 1);
function pm(e, t) {
	at(t, !0);
	let n = ra(t, "links", 19, () => []);
	var r = fm(), i = j(r);
	di(i, 19, n, (e, t) => e.id ?? t, (e, r, i) => {
		var a = dm(), o = A(a), s = A(o);
		{
			let e = /* @__PURE__ */ D(() => F(r).image ? null : F(r).icon || null), n = /* @__PURE__ */ D(() => F(r).image || null), a = /* @__PURE__ */ D(() => K("blocks.icon"));
			lm(s, {
				iconsOnly: !0,
				value: "",
				get icon() {
					return F(e);
				},
				get image() {
					return F(n);
				},
				get label() {
					return F(a);
				},
				onicon: (e) => t.onchange(F(i), {
					icon: e,
					image: ""
				}),
				onimage: (e) => t.onchange(F(i), {
					image: e,
					icon: ""
				})
			});
		}
		var c = N(s, 2);
		U(c);
		var l = N(c, 2), u = (e) => {
			var n = um();
			V(n, () => q.cross, !0), E(n), P((e) => G(n, "title", e), [() => K("ui.ownIconRemove")]), I("click", n, () => t.onchange(F(i), {
				image: "",
				icon: "globe"
			})), R(e, n);
		};
		B(l, (e) => {
			F(r).image && e(u);
		}), E(o);
		var d = N(o, 2), f = A(d);
		U(f);
		var p = N(f, 2), m = A(p);
		V(m, () => q.up, !0), E(m);
		var h = N(m, 2);
		V(h, () => q.down, !0), E(h);
		var g = N(h, 2);
		V(g, () => q.cross, !0), E(g), E(p), E(d), E(a), P((e, t, a, o, s, l, u) => {
			W(c, F(r).label ?? ""), G(c, "placeholder", e), G(c, "title", t), G(c, "data-link-label", F(r).id), W(f, F(r).url ?? ""), G(f, "placeholder", a), G(f, "title", o), G(m, "title", s), m.disabled = F(i) === 0, G(h, "title", l), h.disabled = F(i) === n().length - 1, G(g, "title", u);
		}, [
			() => F(r).icon ? Ys[F(r).icon]?.label : K("lbl.linkLabel"),
			() => K("tip.link.label"),
			() => K("ph.hrefMailto"),
			() => K("tip.link.url"),
			() => K("tip.moveUp"),
			() => K("tip.moveDown"),
			() => K("tip.removeLink")
		]), I("change", c, (e) => t.onchange(F(i), { label: e.target.value.trim() })), I("change", f, (e) => t.onchange(F(i), { url: e.target.value.trim() })), I("click", m, () => t.onmove(F(i), -1)), I("click", h, () => t.onmove(F(i), 1)), I("click", g, () => t.onremove(F(i))), R(e, a);
	});
	var a = N(i, 2), o = M(a, !0);
	P((e) => z(o, e), [() => K("ui.addSiteLink")]), I("click", a, function(...e) {
		t.onadd?.apply(this, e);
	}), R(e, r), ot();
}
Vr(["change", "click"]);
//#endregion
//#region src/panels/SitePanel.svelte
var mm = /* @__PURE__ */ L("<p class=\"panel-hint place-error\"> </p>"), hm = /* @__PURE__ */ L("<span class=\"site-cal-color\"><!> <span> </span></span>"), gm = /* @__PURE__ */ L("<div><button type=\"button\" class=\"site-cal-head\"><span class=\"site-cal-dot\" aria-hidden=\"true\"></span> <span class=\"site-cal-text\"><span class=\"site-cal-name\"> </span> <span class=\"site-cal-addr\"> </span></span> <span class=\"site-cal-chev\" aria-hidden=\"true\"></span></button> <div class=\"site-cal-body\"><div class=\"site-cal-clip\"><div class=\"site-cal-fields\"><span class=\"mini-label site-cal-section\"> </span> <label class=\"site-cal-field\"> <input/></label> <label class=\"site-cal-field\"> <input spellcheck=\"false\"/></label> <label class=\"site-cal-field\"> <input/></label> <span class=\"mini-label site-cal-section\"> </span> <div class=\"site-cal-colors\"><span class=\"site-cal-color\"><!> <span> </span></span> <!></div> <span class=\"mini-label site-cal-section\"> </span> <label class=\"site-cal-field\"> <input placeholder=\"https://\" spellcheck=\"false\"/></label> <label class=\"site-cal-field\"> <input/></label> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <div class=\"site-cal-foot\"><span class=\"row-tools\"><button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button></span> <button type=\"button\" class=\"site-cal-remove\"> </button></div></div></div></div></div>"), _m = /* @__PURE__ */ L("<div class=\"site-cal-list\"></div>"), vm = /* @__PURE__ */ L("<div class=\"cw-row\"><span class=\"mini-label cw-screen\"> </span> <span><span class=\"cw-fill\"></span></span> <span class=\"gridmenu-value cw-margin\"> </span></div>"), ym = /* @__PURE__ */ L("<div class=\"mini-label cw-binds\"> </div>"), bm = /* @__PURE__ */ L("<button> </button>"), xm = /* @__PURE__ */ L("<div class=\"ctl-row\"><span class=\"mini-label\"> </span> <input type=\"range\"/> <span class=\"gridmenu-value\"> </span></div>"), Sm = /* @__PURE__ */ L("<img class=\"site-icon-preview\"/>"), Cm = /* @__PURE__ */ L("<button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button>", 1), wm = /* @__PURE__ */ L("<div class=\"panel-body\"><label> <input/></label> <label> <input/></label> <label> <!></label> <label> <input placeholder=\"Europe/Oslo\" spellcheck=\"false\"/></label> <!> <label> <!></label> <label> <input placeholder=\"meet.example.org\" spellcheck=\"false\"/></label> <details class=\"group\"><summary> </summary> <div class=\"group-items\"><button type=\"button\" class=\"site-cal-add\"><!> </button> <!></div></details> <details class=\"group\"><summary> </summary> <div class=\"group-items\"><!></div></details> <hr class=\"gridmenu-divider\"/> <p class=\"panel-strong\"> </p> <div class=\"sample cw-sample\"><!> <div class=\"cw-legend\"><span class=\"mini-label\"> </span> <span class=\"mini-label\"> </span></div> <!></div> <div class=\"seg cw-seg\"></div> <!> <p class=\"mini-label\"> </p> <div class=\"seg cw-seg\"></div> <details class=\"group\"><summary> </summary> <div class=\"group-items\"><div class=\"ctl-row\"><span class=\"mini-label\"> </span> <input type=\"range\"/> <span class=\"gridmenu-value\"> </span></div></div></details> <hr class=\"gridmenu-divider\"/> <label> <!></label> <span class=\"toolbar-row\"><label class=\"ghost filepick tb-grow\"> <input type=\"file\" accept=\"image/*\"/></label> <!></span></div>");
function Tm(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.bindsFrom), i = /* @__PURE__ */ D(() => n.layoutGutter), a = /* @__PURE__ */ D(() => n.layoutWidth), o = /* @__PURE__ */ D(() => n.siteDraft), { addSiteCalendar: s, setStatus: c, siteCalendars: l, siteLangOptions: u, siteLangValue: d, siteMutate: f, svgAutoTrim: p, themeSwatches: m, siteLinks: h, addSiteLink: _, removeSiteLink: v, moveSiteLink: y, setSiteLink: b } = n;
	async function x(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", !t) return;
		if (t.type === "image/svg+xml" || /\.svg$/i.test(t.name || "")) {
			try {
				let e = await p(t);
				n.iconEditorImage = e.dataUrl;
			} catch {
				c(K("status.imageReadErrorSvg"), "error");
			}
			return;
		}
		let r = new FileReader();
		r.onload = () => {
			n.iconEditorImage = String(r.result);
		}, r.onerror = () => c(K("status.imageReadError"), "error"), r.readAsDataURL(t);
	}
	function S() {
		f("edit:site-icon", () => {
			delete F(o).site.icon;
		});
	}
	function C(e) {
		f("edit:site-title", () => {
			F(o).site.title = e;
		});
	}
	function w(e) {
		f("edit:site-desc", () => {
			F(o).site.description = e;
		});
	}
	let ee = /* @__PURE__ */ D(() => up(F(a))), T = /* @__PURE__ */ D(() => rp.find((e) => e.gutter === F(i))?.id ?? null), te = /* @__PURE__ */ O(!1), ne = /* @__PURE__ */ D(() => F(a) === "full" ? np : op(F(a))), re = /* @__PURE__ */ D(() => ap.map((e) => ({
		screen: e,
		...lp(F(a), F(i), e)
	})));
	function ie(e, t) {
		f(t, () => {
			let t = {
				...F(o).layout ?? {},
				contentWidth: F(a),
				gutter: F(i),
				...e
			};
			for (let e of Object.keys(t)) t[e] === void 0 && delete t[e];
			F(o).layout = t;
		});
	}
	let ae = (e) => ie({ contentWidth: e === "full" ? "full" : op(e) }, "edit:site-width"), oe = (e) => ie({ gutter: sp(e) }, "edit:site-gutter");
	function se(e) {
		f("site", () => {
			F(o).site.lang = e;
		});
	}
	function ce(e) {
		let t = gp(e);
		f("site", () => {
			t.length ? F(o).site.meetingHosts = t : delete F(o).site.meetingHosts;
		});
	}
	function le(e) {
		f("site", () => {
			F(o).site.calendars[e]?.id === n.openSiteCalendar && (n.openSiteCalendar = null), F(o).site.calendars.splice(e, 1), F(o).site.calendars.length || delete F(o).site.calendars;
		});
	}
	function ue(e, t) {
		f("site", () => {
			let n = F(o).site.calendars, r = e + t;
			r < 0 || r >= n.length || ([n[e], n[r]] = [n[r], n[e]]);
		});
	}
	function de(e, t, n, r = !1) {
		let i = String(n ?? "").trim();
		f(`edit:site-cal-${e}-${t}`, () => {
			let n = F(o).site.calendars[e];
			i || r ? n[t] = i : delete n[t];
		});
	}
	function fe(e, t, n) {
		f("site", () => {
			let r = F(o).site.calendars[e];
			n ? delete r[t] : r[t] = !1;
		});
	}
	function pe(e) {
		f("site", () => {
			e && e !== "osm" ? F(o).site.mapService = e : delete F(o).site.mapService;
		});
	}
	function me(e) {
		let t = e.trim();
		n.siteZoneBad = t !== "" && !dp(t), !n.siteZoneBad && f("site", () => {
			t ? F(o).site.timeZone = t : delete F(o).site.timeZone;
		});
	}
	var he = wm(), ge = A(he), _e = A(ge), ve = N(_e);
	U(ve), E(ge);
	var ye = N(ge, 2), be = A(ye), xe = N(be);
	U(xe), E(ye);
	var Se = N(ye, 2), Ce = A(Se), we = N(Ce);
	{
		let e = /* @__PURE__ */ D(d), t = /* @__PURE__ */ D(u);
		J(we, {
			get value() {
				return F(e);
			},
			get options() {
				return F(t);
			},
			onchange: (e) => se(e)
		});
	}
	E(Se);
	var Te = N(Se, 2), Ee = A(Te), De = N(Ee);
	U(De);
	let Oe;
	E(Te);
	var ke = N(Te, 2), Ae = (e) => {
		var t = mm(), n = M(t, !0);
		P((e) => z(n, e), [() => K("settings.timeZoneBad")]), R(e, t);
	};
	B(ke, (e) => {
		n.siteZoneBad && e(Ae);
	});
	var je = N(ke, 2), Me = A(je), Ne = N(Me);
	{
		let e = /* @__PURE__ */ D(() => mp(F(o))), t = /* @__PURE__ */ D(() => pp.map((e) => [
			e,
			K(`mapService.${e}`),
			K(`mapService.${e}.note`)
		]));
		J(Ne, {
			get value() {
				return F(e);
			},
			get options() {
				return F(t);
			},
			onchange: (e) => pe(e)
		});
	}
	E(je);
	var Pe = N(je, 2), Fe = A(Pe), Ie = N(Fe);
	U(Ie), E(Pe);
	var Le = N(Pe, 2), Re = A(Le), ze = M(Re, !0), Be = N(Re, 2), Ve = A(Be), He = A(Ve);
	V(He, () => q.plus);
	var Ue = N(He);
	E(Ve);
	var We = N(Ve, 2), Ge = (e) => {
		var t = _m();
		di(t, 23, l, (e) => e.id, (e, t, r) => {
			let i = /* @__PURE__ */ D(() => n.openSiteCalendar === F(t).id);
			var a = gm();
			let o;
			var s = A(a), c = A(s);
			let u;
			var d = N(c, 2), f = A(d), p = M(f, !0), h = M(N(f, 2), !0);
			E(d);
			var _ = N(d, 2);
			V(_, () => q.down, !0), E(_), E(s);
			var v = N(s, 2), y = A(v), b = A(y), x = A(b), S = M(x, !0), C = N(x, 2), w = A(C), ee = N(w);
			U(ee), E(C);
			var T = N(C, 2), te = A(T), ne = N(te);
			U(ne), E(T);
			var re = N(T, 2), ie = A(re), ae = N(ie);
			U(ae), E(re);
			var oe = N(re, 2), se = M(oe, !0), ce = N(oe, 2), pe = A(ce), me = A(pe);
			{
				let e = /* @__PURE__ */ D(() => F(t).color || "accent"), n = /* @__PURE__ */ D(m), i = /* @__PURE__ */ D(() => K("siteCal.colorMain"));
				sl(me, {
					get value() {
						return F(e);
					},
					get tokens() {
						return F(n);
					},
					get label() {
						return F(i);
					},
					onchange: (e) => de(F(r), "color", e ?? "")
				});
			}
			var he = M(N(me, 2), !0);
			E(pe), di(N(pe, 2), 16, () => [
				["colorText", "siteCal.colorText"],
				["colorBox", "siteCal.colorBox"],
				["colorChip", "siteCal.colorChip"]
			], ([e, t]) => e, (e, n) => {
				var i = /* @__PURE__ */ D(() => g(n, 2));
				let a = () => F(i)[0], o = () => F(i)[1];
				var s = hm(), c = A(s);
				{
					let e = /* @__PURE__ */ D(() => F(t)[a()] || ""), n = /* @__PURE__ */ D(m), i = /* @__PURE__ */ D(() => K(o()));
					sl(c, {
						get value() {
							return F(e);
						},
						get tokens() {
							return F(n);
						},
						allowClear: !0,
						get label() {
							return F(i);
						},
						onchange: (e) => de(F(r), a(), e ?? "")
					});
				}
				var l = M(N(c, 2), !0);
				E(s), P((e, t) => {
					G(s, "title", e), z(l, t);
				}, [() => K(`tip.${o()}`), () => K(o())]), R(e, s);
			}), E(ce);
			var ge = N(ce, 2), _e = M(ge, !0), ve = N(ge, 2), ye = A(ve), be = N(ye);
			U(be), E(ve);
			var xe = N(ve, 2), Se = A(xe), Ce = N(Se);
			U(Ce), E(xe);
			var we = N(xe, 2), Te = A(we);
			U(Te);
			var Ee = N(Te);
			E(we);
			var De = N(we, 2), Oe = A(De);
			U(Oe);
			var ke = N(Oe);
			E(De);
			var Ae = N(De, 2), je = A(Ae), Me = A(je);
			V(Me, () => q.up, !0), E(Me);
			var Ne = N(Me, 2);
			V(Ne, () => q.down, !0), E(Ne), E(je);
			var Pe = N(je, 2), Fe = M(Pe, !0);
			E(Ae), E(b), E(y), E(v), E(a), P((e, n, l, d, f, m, g, _, y, b, x, C, T, oe, ce, le, ue, de, fe, me, ge, E, Ae, je, Ie, Le) => {
				o = H(a, 1, "site-cal-row", null, o, { open: F(i) }), G(s, "aria-expanded", F(i)), u = Ii(c, "", u, { background: e }), z(p, n), z(h, l), v.inert = !F(i), z(S, d), z(w, `${f ?? ""} `), W(ee, F(t).name ?? ""), G(ee, "placeholder", m), G(ee, "title", g), G(ee, "data-cal-name", F(t).id), z(te, `${_ ?? ""} `), W(ne, F(t).url), G(ne, "placeholder", y), G(re, "title", b), z(ie, `${x ?? ""} `), W(ae, F(t).description ?? ""), z(se, C), G(pe, "title", T), z(he, oe), z(_e, ce), G(ve, "title", le), z(ye, `${ue ?? ""} `), W(be, F(t).link ?? ""), G(xe, "title", de), z(Se, `${fe ?? ""} `), W(Ce, F(t).organizer ?? ""), G(we, "title", me), Vi(Te, F(t).subscribable !== !1), z(Ee, ` ${ge ?? ""}`), G(De, "title", E), Vi(Oe, F(t).inFilter !== !1), z(ke, ` ${Ae ?? ""}`), Me.disabled = F(r) === 0, Ne.disabled = je, G(Pe, "title", Ie), z(Fe, Le);
			}, [
				() => _p(F(t).color),
				() => F(t).name || F(t).url || K("ui.addSiteCalendar"),
				() => F(t).url || K("calendar.sourceUrl"),
				() => K("group.siteCalBasics"),
				() => K("lbl.name"),
				() => K("calendar.sourceName"),
				() => K("tip.calendar.sourceName"),
				() => K("calendar.sourceUrl"),
				() => K("calendar.sourcesPh"),
				() => K("tip.siteCal.description"),
				() => K("siteCal.description"),
				() => K("group.siteCalColors"),
				() => K("tip.calendar.sourceColor"),
				() => K("siteCal.colorMain"),
				() => K("group.siteCalVisitors"),
				() => K("tip.siteCal.link"),
				() => K("siteCal.link"),
				() => K("tip.siteCal.organizer"),
				() => K("siteCal.organizer"),
				() => K("tip.siteCal.subscribable"),
				() => K("siteCal.subscribable"),
				() => K("tip.siteCal.inFilter"),
				() => K("siteCal.inFilter"),
				() => F(r) === l().length - 1,
				() => K("tip.site.removeCalendar"),
				() => K("siteCal.remove")
			]), I("click", s, () => n.openSiteCalendar = F(i) ? null : F(t).id), I("change", ee, (e) => de(F(r), "name", e.target.value)), I("change", ne, (e) => de(F(r), "url", e.target.value, !0)), I("change", ae, (e) => de(F(r), "description", e.target.value)), I("change", be, (e) => de(F(r), "link", e.target.value)), I("change", Ce, (e) => de(F(r), "organizer", e.target.value)), I("change", Te, (e) => fe(F(r), "subscribable", e.target.checked)), I("change", Oe, (e) => fe(F(r), "inFilter", e.target.checked)), I("click", Me, () => ue(F(r), -1)), I("click", Ne, () => ue(F(r), 1)), I("click", Pe, () => le(F(r))), R(e, a);
		}), E(t), R(e, t);
	}, Ke = /* @__PURE__ */ D(() => l().length);
	B(We, (e) => {
		F(Ke) && e(Ge);
	}), E(Be), E(Le);
	var qe = N(Le, 2), Je = A(qe), Ye = M(Je, !0), Xe = N(Je, 2), Ze = A(Xe);
	{
		let e = /* @__PURE__ */ D(h);
		pm(Ze, {
			get links() {
				return F(e);
			},
			onchange: (e, t) => b(e, t),
			onadd: () => _(),
			onremove: (e) => v(e),
			onmove: (e, t) => y(e, t)
		});
	}
	E(Xe), E(qe);
	var Qe = N(qe, 4), $e = M(Qe, !0), et = N(Qe, 2), tt = A(et);
	di(tt, 17, () => F(re), (e) => e.screen, (e, t) => {
		var n = vm(), r = A(n), i = M(r, !0), a = N(r, 2);
		let o;
		var s = M(a), c = M(N(a, 2), !0);
		E(n), P(() => {
			z(i, F(t).screen), o = H(a, 1, "cw-bar", null, o, { fluid: !F(t).bound }), Ii(s, `width:${F(t).pct ?? ""}%`), z(c, F(t).bound ? `${F(t).margin}` : "-");
		}), R(e, n);
	});
	var nt = N(tt, 2), it = A(nt), st = M(it, !0), ct = M(N(it, 2), !0);
	E(nt);
	var lt = N(nt, 2), ut = (e) => {
		var t = ym(), n = M(t, !0);
		P((e) => z(n, e), [() => K("lbl.bindsFrom", { n: F(r) })]), R(e, t);
	};
	B(lt, (e) => {
		F(a) !== "full" && e(ut);
	}), E(et);
	var dt = N(et, 2);
	di(dt, 21, () => ip, (e) => e.id, (e, t) => {
		var n = bm();
		let r;
		var i = M(n, !0);
		P((e) => {
			r = H(n, 1, "", null, r, { on: F(ee) === F(t).id }), z(i, e);
		}, [() => K(`lbl.width.${F(t).id}`)]), I("click", n, () => ae(F(t).width)), R(e, n);
	}), E(dt);
	var ft = N(dt, 2), pt = (e) => {
		var t = xm(), n = A(t), r = M(n, !0), i = N(n, 2);
		U(i);
		var a = M(N(i, 2));
		E(t), P((e, n) => {
			G(t, "title", e), z(r, n), G(i, "min", 960), G(i, "max", np), G(i, "step", 20), W(i, F(ne)), z(a, `${F(ne) ?? ""} px`);
		}, [() => K("tip.site.contentWidthFree"), () => K("lbl.widthFree")]), I("input", i, (e) => ae(e.target.valueAsNumber)), R(e, t);
	};
	B(ft, (e) => {
		F(a) !== "full" && e(pt);
	});
	var mt = N(ft, 2), ht = M(mt, !0), gt = N(mt, 2);
	di(gt, 21, () => rp, (e) => e.id, (e, t) => {
		var n = bm();
		let r;
		var i = M(n, !0);
		P((e) => {
			r = H(n, 1, "", null, r, { on: F(T) === F(t).id }), z(i, e);
		}, [() => K(`lbl.gutter.${F(t).id}`)]), I("click", n, () => oe(F(t).gutter)), R(e, n);
	}), E(gt);
	var _t = N(gt, 2), vt = A(_t), yt = M(vt, !0), bt = N(vt, 2), xt = A(bt), St = A(xt), Ct = M(St, !0), wt = N(St, 2);
	U(wt);
	var Tt = M(N(wt, 2));
	E(xt), E(bt), E(_t);
	var Et = N(_t, 4), Dt = A(Et), Ot = N(Dt), kt = (e) => {
		var t = Sm();
		P((e) => {
			G(t, "src", F(o).site.icon), G(t, "alt", e);
		}, [() => K("lbl.siteIcon")]), R(e, t);
	};
	B(Ot, (e) => {
		F(o).site.icon && e(kt);
	}), E(Et);
	var At = N(Et, 2), jt = A(At), Mt = A(jt), Nt = N(Mt);
	E(jt);
	var Pt = N(jt, 2), Ft = (e) => {
		var t = Cm(), r = j(t);
		V(r, () => q.pencil ?? "✎", !0), E(r);
		var i = N(r, 2);
		V(i, () => q.cross, !0), E(i), P((e, t) => {
			G(r, "title", e), G(i, "title", t);
		}, [() => K("tip.site.editIcon"), () => K("tip.site.removeIcon")]), I("click", r, () => n.iconEditorImage = F(o).site.icon), I("click", i, S), R(e, t);
	};
	B(Pt, (e) => {
		F(o).site.icon && e(Ft);
	}), E(At), E(he), P((e, t, r, a, s, c, l, u, d, f, p, m, h, g, _, v, y, b, x, S, C, w, ee, ne, re, ie, ae, oe, se, ce, le, ue) => {
		G(ge, "title", e), z(_e, `${t ?? ""} `), W(ve, F(o).site.title ?? ""), G(ve, "placeholder", r), G(ye, "title", a), z(be, `${s ?? ""} `), W(xe, F(o).site.description ?? ""), G(xe, "placeholder", c), G(Se, "title", l), z(Ce, `${u ?? ""} `), G(Te, "title", d), z(Ee, `${f ?? ""} `), W(De, F(o).site.timeZone ?? ""), Oe = H(De, 1, "", null, Oe, { "place-error": n.siteZoneBad }), G(je, "title", p), z(Me, `${m ?? ""} `), G(Pe, "title", h), z(Fe, `${g ?? ""} `), W(Ie, _), G(Re, "title", v), z(ze, y), z(Ue, ` ${b ?? ""}`), G(Je, "title", x), z(Ye, S), G(Qe, "title", C), z($e, w), z(st, ee), z(ct, ne), G(mt, "title", re), z(ht, ie), _t.open = F(T) === null || F(te), z(yt, ae), G(xt, "title", oe), z(Ct, se), G(wt, "min", 0), G(wt, "max", 12), G(wt, "step", 1), W(wt, F(i)), z(Tt, `${F(i) ?? ""} vw`), z(Dt, `${ce ?? ""} `), G(jt, "title", le), z(Mt, `${ue ?? ""} `);
	}, [
		() => K("tip.site.name"),
		() => K("lbl.name"),
		() => K("ph.site.name"),
		() => K("tip.site.description"),
		() => K("lbl.description"),
		() => K("ph.site.description"),
		() => K("site.langTitle"),
		() => K("site.langLabel"),
		() => K("tip.settings.timeZone"),
		() => K("settings.timeZone"),
		() => K("tip.settings.mapService"),
		() => K("settings.mapService"),
		() => K("tip.settings.meetingHosts"),
		() => K("settings.meetingHosts"),
		() => (F(o).site.meetingHosts ?? []).join(", "),
		() => K("tip.site.calendars"),
		() => K("group.siteCalendars"),
		() => K("ui.addSiteCalendar"),
		() => K("tip.site.links"),
		() => K("group.siteLinks"),
		() => K("tip.site.contentWidth"),
		() => K("lbl.contentWidth"),
		() => K("lbl.screenPx"),
		() => K("lbl.marginPx"),
		() => K("tip.site.gutter"),
		() => K("lbl.gutter"),
		() => K("group.advanced"),
		() => K("tip.site.gutterVw"),
		() => K("lbl.gutterVw"),
		() => K("lbl.siteIcon"),
		() => K("tip.site.icon"),
		() => F(o).site.icon ? K("ui.changeIcon") : K("ui.chooseIcon")
	]), I("input", ve, (e) => C(e.target.value)), I("input", xe, (e) => w(e.target.value)), I("change", De, (e) => me(e.target.value)), I("change", Ie, (e) => ce(e.target.value)), I("click", Ve, () => s()), Qi("open", "toggle", Le, (e) => n.siteCalendarsOpen = e, () => n.siteCalendarsOpen), Qi("open", "toggle", qe, (e) => n.siteLinksOpen = e, () => n.siteLinksOpen), Br("toggle", _t, (e) => k(te, e.currentTarget.open, !0)), I("input", wt, (e) => oe(e.target.valueAsNumber)), I("change", Nt, x), R(e, he), ot();
}
Vr([
	"input",
	"change",
	"click"
]);
//#endregion
//#region src/panels/ThemePanel.svelte
var Em = /* @__PURE__ */ L("<div class=\"mini-label tpv-cap\"> </div>"), Dm = /* @__PURE__ */ L("<div class=\"theme-pvw\"><!> <div class=\"tpv-demo\"><div class=\"tpv-h\"> </div> <div class=\"tpv-card\"> </div> <div class=\"tpv-row\"><span class=\"tpv-btn\"> </span><span class=\"tpv-lnk\"> </span></div></div></div>"), Om = /* @__PURE__ */ L("<button type=\"button\"><span class=\"tp-band\"><i></i><i></i><i></i><i></i></span> <small> </small></button>"), km = /* @__PURE__ */ L("<div class=\"ctl-row autorow\"><span class=\"autolbl\"> </span> <span class=\"seg\"><button type=\"button\"> </button> <button type=\"button\"> </button></span></div>"), Am = /* @__PURE__ */ L("<span class=\"mini-label\"> </span>"), jm = /* @__PURE__ */ L("<div class=\"palcol\"><!> <span class=\"palcap\"> </span> <b class=\"palhex\"> </b></div>"), Mm = /* @__PURE__ */ L("<div class=\"ctl-row palhead\"><span class=\"mini-label\"> </span> <button type=\"button\"> </button></div> <div></div>", 1), Nm = /* @__PURE__ */ L("<div class=\"panel-body\"><p class=\"panel-strong\"> </p> <div class=\"theme-presets\"></div> <p class=\"panel-strong\"> </p> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!> <div class=\"ctl-row palhead\"><!> <button type=\"button\"> </button></div> <div class=\"palcells\"></div> <!> <div class=\"ctl-row palauto-row\"><span class=\"mini-label ctl-name\"> </span> <button type=\"button\"> </button></div> <div class=\"theme-previews\"><!> <!></div> <details class=\"group\"><summary> </summary> <div class=\"group-items\"><label> <!></label> <label> <!></label> <div class=\"sample typo-sample\"><div class=\"ts-h\"> </div> <div class=\"ts-b\"> </div></div></div></details> <details class=\"group\"><summary> </summary> <div class=\"group-items\"><div class=\"sample form-prev\"><span class=\"fp-btn\"> </span> <span class=\"fp-card\"> </span></div> <label class=\"ctl-row\"> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0\" max=\"24\" step=\"1\"/> <label class=\"ctl-row\"> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0\" max=\"40\" step=\"1\"/></div></details></div>");
function Pm(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.activeThemePreset), i = /* @__PURE__ */ D(() => n.siteDraft), { THEME_PRESETS: a, applyThemePreset: o, readableOn: s, siteMutate: c, suggestAltColors: l, themeHex: u, themeSwatches: d } = n, p = [
		[
			"bg",
			K("palette.bg"),
			K("palette.bgShort")
		],
		[
			"surface",
			K("palette.surface"),
			K("palette.surfaceShort")
		],
		[
			"text",
			K("palette.text"),
			K("palette.textShort")
		],
		[
			"accent",
			K("palette.accent"),
			K("palette.accentShort")
		],
		[
			"accent-text",
			K("palette.accentText"),
			K("palette.accentTextShort")
		]
	], m = /* @__PURE__ */ D(() => !!F(i)?.theme.alt), h = /* @__PURE__ */ D(() => F(i)?.theme.alt?.auto === !0), _ = /* @__PURE__ */ D(() => F(i)?.theme.scheme === "dark" ? "dark" : "light"), v = /* @__PURE__ */ D(() => F(i)?.theme.tokens.color ?? {}), y = /* @__PURE__ */ D(() => ({
		...F(i)?.theme.tokens.color ?? {},
		...F(i)?.theme.alt?.tokens?.color ?? {}
	}));
	function b(e, t) {
		c(`edit:theme-color-${e}`, () => {
			F(i).theme.tokens.color[e] = t, F(i).theme.alt?.auto && (F(i).theme.alt.tokens.color = l());
		});
	}
	function x(e, t) {
		return e === "accent-text" ? s(u(t.accent ?? "#000000", t)) : t.bg;
	}
	let S = /* @__PURE__ */ D(() => !F(i)?.theme?.tokens?.color?.["accent-text"] && !F(i)?.theme?.alt?.tokens?.color?.["accent-text"]);
	function C(e) {
		c("edit:theme-color-accent-text", () => {
			e ? (delete F(i).theme.tokens.color["accent-text"], F(i).theme.alt?.tokens?.color && delete F(i).theme.alt.tokens.color["accent-text"]) : (F(i).theme.tokens.color["accent-text"] = x("accent-text", F(v)), F(i).theme.alt?.auto && (F(i).theme.alt.tokens.color = l()));
		});
	}
	function w(e, t) {
		c("theme", () => {
			F(i).theme.tokens.font[e] = t;
		});
	}
	function ee(e, t) {
		c("theme", () => {
			F(i).theme.tokens.radius[e] = t;
		});
	}
	function T(e, t) {
		c(`edit:theme-alt-${e}`, () => {
			F(i).theme.alt.tokens.color[e] = t, F(i).theme.alt.auto = !1;
		});
	}
	function te(e) {
		c("theme", () => {
			e === "light" ? delete F(i).theme.scheme : F(i).theme.scheme = e;
		});
	}
	function ne(e) {
		c("theme", () => {
			e ? F(i).theme.alt = {
				auto: !0,
				tokens: { color: l() }
			} : delete F(i).theme.alt;
		});
	}
	function re(e) {
		c("theme", () => {
			F(i).theme.alt ??= { tokens: { color: l() } }, F(i).theme.alt.auto = e, e && (F(i).theme.alt.tokens.color = l());
		});
	}
	function ie(e) {
		let t = F(i).theme.tokens.font[e];
		return [...Gl.some(([, e]) => e === t) ? [] : [[t, K("opt.customFont")]], ...Gl.map(([e, t]) => [t, K(e)])];
	}
	let ae = (e) => parseInt(e, 10) || 0;
	function oe(e, t) {
		ee(e, `${t}px`);
	}
	var se = Nm();
	{
		let e = (e, t = f, n = f) => {
			var r = Dm(), i = A(r), a = (e) => {
				var t = Em(), r = M(t, !0);
				P(() => z(r, n())), R(e, t);
			};
			B(i, (e) => {
				n() && e(a);
			});
			var o = N(i, 2), c = A(o), l = M(c, !0), d = N(c, 2), p = M(d, !0), m = N(d, 2), h = A(m), g = M(h, !0), _ = M(N(h), !0);
			E(m), E(o), E(r), P((e, t, n, r, i, a, s, c, u) => {
				Ii(o, `--tv-bg:${e ?? ""};--tv-surface:${t ?? ""};--tv-text:${n ?? ""};--tv-accent:${r ?? ""};--tv-accent-ink:${i ?? ""}`), z(l, a), z(p, s), z(g, c), z(_, u);
			}, [
				() => u(t().bg, t()),
				() => u(t().surface, t()),
				() => u(t().text, t()),
				() => u(t().accent, t()),
				() => u(t()["accent-text"] ?? s(u(t().accent ?? "#000000", t())), t()),
				() => K("preview.heading"),
				() => K("preview.cardBody"),
				() => K("preview.button"),
				() => K("preview.link")
			]), R(e, r);
		};
		var ce = A(se), le = M(ce, !0), ue = N(ce, 2);
		di(ue, 21, () => a, (e) => e.id, (e, t) => {
			var n = Om();
			let i;
			var a = A(n), s = A(a), c = N(s), l = N(c), u = N(l);
			E(a);
			var d = M(N(a, 2), !0);
			E(n), P(() => {
				i = H(n, 1, "theme-preset", null, i, { sel: F(r) === F(t).id }), G(n, "title", `${F(t).name} - ${F(t).note}`), Ii(s, `background:${F(t).light.bg ?? ""}`), Ii(c, `background:${F(t).light.surface ?? ""}`), Ii(l, `background:${F(t).light.accent ?? ""}`), Ii(u, `background:${F(t).light.text ?? ""}`), z(d, F(t).name);
			}), I("click", n, () => o(F(t))), R(e, n);
		}), E(ue);
		var de = N(ue, 2), fe = M(de, !0), pe = N(de, 2), me = A(pe);
		U(me);
		var he = N(me);
		E(pe);
		var ge = N(pe, 2), _e = (e) => {
			var t = km(), n = A(t), r = M(n, !0), i = N(n, 2), a = A(i);
			let o;
			var s = M(a, !0), c = N(a, 2);
			let l;
			var u = M(c, !0);
			E(i), E(t), P((e, t, n, i) => {
				z(r, e), G(a, "title", t), o = H(a, 1, "", null, o, { on: F(h) }), z(s, n), l = H(c, 1, "", null, l, { on: !F(h) }), z(u, i);
			}, [
				() => K("lbl.darkColors"),
				() => K("hint.theme.autoDark"),
				() => K("opt.auto"),
				() => K("opt.custom")
			]), I("click", a, () => re(!0)), I("click", c, () => re(!1)), R(e, t);
		};
		B(ge, (e) => {
			F(m) && e(_e);
		});
		var ve = N(ge, 2), ye = A(ve), be = (e) => {
			var t = Am(), n = M(t, !0);
			P((e) => z(n, e), [() => K("lbl.light")]), R(e, t);
		};
		B(ye, (e) => {
			F(m) && e(be);
		});
		var xe = N(ye, 2);
		let t;
		var Se = M(xe, !0);
		E(ve);
		var Ce = N(ve, 2);
		di(Ce, 21, () => p, ([e, t, n]) => e, (e, t) => {
			var n = /* @__PURE__ */ D(() => g(F(t), 3));
			let r = () => F(n)[0], a = () => F(n)[1], o = () => F(n)[2];
			var s = jm(), c = A(s);
			{
				let e = /* @__PURE__ */ D(() => F(i).theme.tokens.color[r()] ?? x(r(), F(v))), t = /* @__PURE__ */ D(d);
				sl(c, {
					get value() {
						return F(e);
					},
					get tokens() {
						return F(t);
					},
					get label() {
						return a();
					},
					onchange: (e) => b(r(), e)
				});
			}
			var l = N(c, 2), f = M(l, !0), p = M(N(l, 2), !0);
			E(s), P((e) => {
				z(f, o()), z(p, e);
			}, [() => u(F(i).theme.tokens.color[r()] ?? x(r(), F(v)), F(v))]), R(e, s);
		}), E(Ce);
		var we = N(Ce, 2), Te = (e) => {
			var t = Mm(), n = j(t), r = A(n), a = M(r, !0), o = N(r, 2);
			let s;
			var c = M(o, !0);
			E(n);
			var l = N(n, 2);
			let f;
			di(l, 21, () => p, ([e, t, n]) => e, (e, t) => {
				var n = /* @__PURE__ */ D(() => g(F(t), 3));
				let r = () => F(n)[0], a = () => F(n)[1], o = () => F(n)[2];
				var s = jm(), c = A(s);
				{
					let e = /* @__PURE__ */ D(() => F(i).theme.alt.tokens.color[r()] ?? F(y)[r()] ?? x(r(), F(y))), t = /* @__PURE__ */ D(d), n = /* @__PURE__ */ D(() => K("theme.darkColorLabel", { name: a() }));
					sl(c, {
						get value() {
							return F(e);
						},
						get tokens() {
							return F(t);
						},
						get label() {
							return F(n);
						},
						onchange: (e) => T(r(), e)
					});
				}
				var l = N(c, 2), f = M(l, !0), p = M(N(l, 2), !0);
				E(s), P((e) => {
					z(f, o()), z(p, e);
				}, [() => u(F(i).theme.alt.tokens.color[r()] ?? F(y)[r()] ?? x(r(), F(y)), F(y))]), R(e, s);
			}), E(l), P((e, t, n) => {
				z(a, e), s = H(o, 1, "chip", null, s, { accent: F(_) === "dark" }), G(o, "title", t), z(c, n), f = H(l, 1, "palcells", null, f, { autopal: F(h) });
			}, [
				() => K("lbl.dark"),
				() => K("tip.theme.darkDefault"),
				() => K("common.standard")
			]), I("click", o, () => te("dark")), R(e, t);
		};
		B(we, (e) => {
			F(m) && e(Te);
		});
		var Ee = N(we, 2), De = A(Ee), Oe = M(De, !0), ke = N(De, 2);
		let n;
		var Ae = M(ke, !0);
		E(Ee);
		var je = N(Ee, 2), Me = A(je);
		{
			let t = /* @__PURE__ */ D(() => F(m) ? K("lbl.light") : "");
			e(Me, () => F(v), () => F(t));
		}
		var Ne = N(Me, 2), Pe = (t) => {
			{
				let n = /* @__PURE__ */ D(() => K("lbl.dark"));
				e(t, () => F(y), () => F(n));
			}
		};
		B(Ne, (e) => {
			F(m) && e(Pe);
		}), E(je);
		var Fe = N(je, 2), Ie = A(Fe), Le = M(Ie, !0), Re = N(Ie, 2), ze = A(Re), Be = A(ze), Ve = N(Be);
		{
			let e = /* @__PURE__ */ D(() => ie("heading"));
			J(Ve, {
				get value() {
					return F(i).theme.tokens.font.heading;
				},
				get options() {
					return F(e);
				},
				onchange: (e) => w("heading", e)
			});
		}
		E(ze);
		var He = N(ze, 2), Ue = A(He), We = N(Ue);
		{
			let e = /* @__PURE__ */ D(() => ie("body"));
			J(We, {
				get value() {
					return F(i).theme.tokens.font.body;
				},
				get options() {
					return F(e);
				},
				onchange: (e) => w("body", e)
			});
		}
		E(He);
		var Ge = N(He, 2), Ke = A(Ge), qe = M(Ke, !0), Je = N(Ke, 2), Ye = M(Je, !0);
		E(Ge), E(Re), E(Fe);
		var Xe = N(Fe, 2), Ze = A(Xe), Qe = M(Ze, !0), $e = N(Ze, 2), et = A($e), tt = A(et), nt = M(tt, !0), it = M(N(tt, 2), !0);
		E(et);
		var st = N(et, 2), ct = A(st, !0), lt = M(N(ct), !0);
		E(st);
		var ut = N(st, 2);
		U(ut);
		var dt = N(ut, 2), ft = A(dt, !0), pt = M(N(ft), !0);
		E(dt);
		var mt = N(dt, 2);
		U(mt), E($e), E(Xe), E(se), P((e, r, a, o, s, c, l, u, d, f, p, h, g, v, y, b, x, C, w, ee, T) => {
			z(le, e), z(fe, r), G(pe, "title", a), Vi(me, F(m)), z(he, ` ${o ?? ""}`), t = H(xe, 1, "chip", null, t, { accent: F(_) === "light" }), G(xe, "title", s), z(Se, c), G(Ee, "title", l), z(Oe, u), n = H(ke, 1, "chip palauto", null, n, { accent: F(S) }), z(Ae, d), z(Le, f), z(Be, `${p ?? ""} `), z(Ue, `${h ?? ""} `), Ii(Ke, `font-family:${F(i).theme.tokens.font.heading ?? ""}`), z(qe, g), Ii(Je, `font-family:${F(i).theme.tokens.font.body ?? ""}`), z(Ye, v), z(Qe, y), Ii(et, `--r-sm:${F(i).theme.tokens.radius.sm ?? ""};--r-md:${F(i).theme.tokens.radius.md ?? ""}`), z(nt, b), z(it, x), z(ct, C), z(lt, F(i).theme.tokens.radius.sm), W(ut, w), z(ft, ee), z(pt, F(i).theme.tokens.radius.md), W(mt, T);
		}, [
			() => K("lbl.themePresets"),
			() => K("lbl.colors"),
			() => K("tip.theme.dualMode"),
			() => K("lbl.dualMode"),
			() => K("tip.theme.defaultScheme"),
			() => K("common.standard"),
			() => K("tip.theme.accentTextAuto"),
			() => K("palette.accentText"),
			() => K("opt.auto"),
			() => K("group.typography"),
			() => K("lbl.headings"),
			() => K("lbl.bodyText"),
			() => K("preview.heading"),
			() => K("preview.bodySample"),
			() => K("group.shape"),
			() => K("preview.button"),
			() => K("preview.card"),
			() => K("lbl.smallCorners"),
			() => ae(F(i).theme.tokens.radius.sm),
			() => K("lbl.largeCorners"),
			() => ae(F(i).theme.tokens.radius.md)
		]), I("change", me, (e) => ne(e.target.checked)), I("click", xe, () => te("light")), I("click", ke, () => C(!F(S))), I("input", ut, (e) => oe("sm", Number(e.target.value))), I("input", mt, (e) => oe("md", Number(e.target.value)));
	}
	R(e, se), ot();
}
Vr([
	"click",
	"change",
	"input"
]);
//#endregion
//#region ../template/assets/engine/0.7.6/palette-search.js
function Fm(e) {
	return String(e ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}
function Im(e, t) {
	let n = Fm(t).trim(), r = Fm(e);
	return n ? r.startsWith(n) ? 0 : r.split(/[^a-z0-9]+/).some((e) => e.startsWith(n)) ? 1 : r.includes(n) ? 2 : -1 : 2;
}
function Lm(e, t) {
	let n = Fm(e);
	return Fm(t).split(/\s+/).filter(Boolean).every((e) => n.includes(e));
}
function Rm(e, t, n) {
	return e.map((e, r) => ({
		item: e,
		i: r,
		rank: Im(n(e), t)
	})).filter((e) => e.rank >= 0).sort((e, t) => e.rank - t.rank || e.i - t.i).map((e) => e.item);
}
//#endregion
//#region ../template/assets/engine/0.7.6/calendar-designs.js
var zm = [
	"list",
	"cards",
	"month",
	"agenda",
	"next",
	"week",
	"day",
	"year"
], Bm = [
	"title",
	"date",
	"time",
	"place",
	"description",
	"category",
	"number"
], Vm = [
	"noticeLabel",
	"noticeTitle",
	"noticeText",
	"emptyKicker",
	"emptyTitle",
	"series",
	"forWhom",
	"openAll",
	"period",
	"venue",
	"admission",
	"admissionPrice",
	"thanks"
], Hm = {
	noticeTitle: "calendar.noticeTitleHint",
	noticeText: "calendar.noticeTextHint"
}, Um = ["emptyKicker", "emptyTitle"], Wm = [
	"noticeLabel",
	"noticeTitle",
	"noticeText",
	"readWhole",
	"moreInfo"
], Gm = /* @__PURE__ */ "all.signup.subscribe.subscribeMulti.addGoogle.swUpcoming.swWeek.swMonth.noMatch.earlier.showAll.zoneOf.zoneYours.weekN.range.moreN.dayNone.cancelled.allDay.until.timeAt.today.tomorrow.inDays.when.where.organizer.moreAbout.join.addEvent.addOne.addFile.addWhole.icalAddress.onMap.recurring".split("."), Km = [
	"modern",
	"next",
	"ap",
	"retro"
];
function qm() {
	return Km.map((e) => ({
		family: e,
		labelKey: `calendar.family.${e}`,
		designs: lh.filter((t) => t.family === e)
	})).filter((e) => e.designs.length);
}
var Jm = [
	{
		id: "agenda",
		labelKey: "calendar.phone.agenda",
		family: "neutral"
	},
	{
		id: "depRows",
		labelKey: "calendar.phone.depRows",
		family: "retro",
		module: "retro",
		home: "departures",
		ownSubscribe: !0
	},
	{
		id: "depStrip",
		labelKey: "calendar.phone.depStrip",
		family: "retro",
		module: "retro",
		home: "departures",
		ownSubscribe: !0
	},
	{
		id: "marqueeRows",
		labelKey: "calendar.phone.marqueeRows",
		family: "retro",
		module: "retro",
		home: "marquee",
		ownSubscribe: !0
	}
], Ym = [
	"list",
	"cards",
	"agenda",
	"next"
], Xm = (e) => ({
	id: e.id,
	labelKey: e.labelKey,
	family: e.family,
	module: e.module,
	set: e.set,
	view: e.view,
	ownSubscribe: e.ownSubscribe === !0,
	desktop: !0,
	look: e.id
});
function Zm(e) {
	let t = Th(e), n = lh.filter((e) => e.phone !== "switch" && (e.view === null || Ym.includes(e.view) || e.view === t)).map(Xm), r = Jm.slice(1).map((e) => ({
		...e,
		look: e.home
	}));
	return [
		Jm[0],
		...n,
		...r
	];
}
function Qm(e, t) {
	let n = Zm(t);
	return n.find((t) => t.id === e) ?? n.find((e) => e.id === th(t)) ?? n[0];
}
function $m(e) {
	return [
		"neutral",
		"sets",
		...Km
	].map((t) => ({
		family: t,
		labelKey: `calendar.family.${t}`,
		designs: e.filter((e) => e.family === t)
	})).filter((e) => e.designs.length);
}
function eh(e) {
	return $m(Zm(e));
}
function th(e) {
	let t = wh(e?.design), n = t.phoneDefault ?? (t.phone === "switch" ? "agenda" : t.id), r = e?.phoneView === "self" || !e?.phoneView && e?.phoneDesign === !1 ? t.id : e?.phoneView;
	return r && Zm(e).some((e) => e.id === r) ? r : n;
}
var nh = [
	{
		id: "neutral",
		labelKey: "calendar.cardDesign.neutral",
		family: "neutral"
	},
	{
		id: "depHead",
		labelKey: "calendar.cardDesign.depHead",
		family: "retro",
		module: "retro",
		home: "departures"
	},
	{
		id: "depTitle",
		labelKey: "calendar.cardDesign.depTitle",
		family: "retro",
		module: "retro",
		home: "departures"
	},
	{
		id: "depScreen",
		labelKey: "calendar.cardDesign.depScreen",
		family: "retro",
		module: "retro",
		home: "departures"
	}
];
function rh() {
	let e = /* @__PURE__ */ new Map();
	for (let t of lh.filter((e) => !e.ownCard)) e.set(t.set, [...e.get(t.set) ?? [], t]);
	return [...e].filter(([, e]) => e.length > 1).map(([e, t]) => ({
		id: `set-${e}`,
		labelKey: `calendar.cardSet.${e}`,
		family: "sets",
		set: e,
		setCard: !0,
		designs: t.map((e) => e.id)
	}));
}
function ih(e) {
	return e.ownCard ? null : rh().find((t) => t.set === e.set) ?? null;
}
function ah() {
	let e = rh(), t = lh.filter((t) => t.ownCard || !e.some((e) => e.set === t.set)).map((e) => ({
		...Xm(e),
		module: e.ownCard ? e.module : void 0
	})), n = nh.slice(1).map((e) => ({
		...e,
		look: e.home,
		set: wh(e.home).set
	}));
	return [
		nh[0],
		...e,
		...t,
		...n
	];
}
function oh(e) {
	let t = ah();
	return t.find((t) => t.id === e) ?? t[0];
}
function sh() {
	return $m(ah());
}
function ch(e) {
	let t = ah(), n = e?.card;
	if (n && t.some((e) => e.id === n)) return n;
	let r = n && lh.find((e) => e.id === n);
	if (r) return ih(r)?.id ?? r.id;
	let i = wh(e?.design);
	return i.cardDefault ?? ih(i)?.id ?? i.id;
}
var X = (e, t = "colors") => ({
	key: e,
	labelKey: `calendar.slot.${e}`,
	section: t
}), lh = [
	{
		id: "plain",
		labelKey: "calendar.design.plain",
		set: "theme",
		family: "modern",
		phone: "fits",
		view: null,
		stripe: !1,
		slots: [
			X("accent"),
			X("surface"),
			X("line"),
			X("chip")
		],
		texts: [
			"next",
			"now",
			"later",
			...Gm
		]
	},
	{
		id: "timeline",
		labelKey: "calendar.design.timeline",
		set: "theme",
		family: "modern",
		phone: "fits",
		view: "list",
		module: "list",
		stripe: !1,
		slots: [
			X("accent"),
			X("dot"),
			X("line"),
			X("chip")
		],
		texts: Gm
	},
	{
		id: "table",
		labelKey: "calendar.design.table",
		set: "theme",
		family: "modern",
		phone: "switch",
		view: "list",
		module: "list",
		stripe: !1,
		slots: [
			X("accent"),
			X("head"),
			X("headText"),
			X("zebra"),
			X("line"),
			X("chip")
		],
		texts: [
			"colDate",
			"colTime",
			"colEvent",
			"colPlace",
			...Gm
		]
	},
	{
		id: "booklet",
		labelKey: "calendar.design.booklet",
		ownCard: !0,
		set: "poster",
		family: "modern",
		phone: "fits",
		excerpt: !0,
		view: "list",
		module: "list",
		stripe: !1,
		slots: [
			X("accent"),
			X("surface"),
			X("rule"),
			X("chip")
		],
		texts: ["program", ...Gm]
	},
	{
		id: "numbered",
		labelKey: "calendar.design.numbered",
		set: "poster",
		family: "modern",
		phone: "fits",
		view: "list",
		module: "list",
		stripe: !1,
		slots: [
			X("accent"),
			X("number"),
			X("line"),
			X("chip")
		],
		texts: ["count", ...Gm]
	},
	{
		id: "apList",
		labelKey: "calendar.design.apList",
		set: "apNavy",
		family: "ap",
		phone: "fits",
		empty: "ap",
		view: "list",
		module: "list",
		stripe: !1,
		slots: [
			X("row"),
			X("text"),
			X("gold"),
			X("line"),
			X("rec")
		],
		texts: [...Um, ...Gm]
	},
	{
		id: "glass",
		labelKey: "calendar.design.glass",
		ownCard: !0,
		set: "lightGlass",
		family: "modern",
		phone: "fits",
		view: "list",
		module: "list",
		stripe: !1,
		slots: [
			X("ground"),
			X("text"),
			X("glass", "glass"),
			X("glassLine", "glass"),
			X("chip", "glass"),
			X("blobA", "blobs"),
			X("blobB", "blobs"),
			X("blobC", "blobs")
		],
		texts: Gm
	},
	{
		id: "posters",
		labelKey: "calendar.design.posters",
		ownCard: !0,
		set: "poster",
		family: "modern",
		phone: "flows",
		view: "cards",
		module: "cards",
		stripe: !1,
		program: !0,
		slots: [
			X("accent"),
			X("surface"),
			X("line"),
			X("posterA", "posters"),
			X("posterAText", "posters"),
			X("posterB", "posters"),
			X("posterBText", "posters"),
			X("posterC", "posters"),
			X("posterCText", "posters")
		],
		texts: ["wholeProgram", ...Gm]
	},
	{
		id: "tickets",
		labelKey: "calendar.design.tickets",
		ownCard: !0,
		set: "theme",
		family: "modern",
		phone: "flows",
		view: "cards",
		module: "cards",
		stripe: !1,
		program: !0,
		open: !0,
		slots: [
			X("accent"),
			X("surface"),
			X("line"),
			X("stub", "stub"),
			X("stubText", "stub")
		],
		texts: [
			"wholeProgram",
			"openToAll",
			...Gm
		]
	},
	{
		id: "carousel",
		labelKey: "calendar.design.carousel",
		set: "theme",
		family: "modern",
		phone: "fits",
		view: "cards",
		module: "cards",
		stripe: !1,
		slots: [
			X("accent"),
			X("surface"),
			X("line"),
			X("chip"),
			X("card", "first"),
			X("cardText", "first")
		],
		texts: Gm
	},
	{
		id: "photo",
		labelKey: "calendar.design.photo",
		set: "theme",
		family: "modern",
		phone: "flows",
		view: "cards",
		module: "cards",
		stripe: !1,
		slots: [
			X("accent"),
			X("surface"),
			X("line"),
			X("placeholder"),
			X("badge", "onPicture"),
			X("badgeText", "onPicture"),
			X("chip", "onPicture")
		],
		texts: Gm
	},
	{
		id: "apGrid",
		labelKey: "calendar.design.apGrid",
		set: "apCream",
		family: "ap",
		phone: "flows",
		empty: "ap",
		view: "cards",
		module: "cards",
		stripe: !1,
		slots: [
			X("head"),
			X("card"),
			X("text"),
			X("gold"),
			X("rec")
		],
		texts: [...Um, ...Gm]
	},
	{
		id: "bento",
		labelKey: "calendar.design.bento",
		set: "bento",
		family: "modern",
		phone: "flows",
		view: "cards",
		module: "cards",
		stripe: !1,
		ownSubscribe: !0,
		slots: [
			X("accent"),
			X("soft"),
			X("tile"),
			X("line"),
			X("hero", "hero"),
			X("heroText", "hero")
		],
		texts: [
			"nextShort",
			"thisMonth",
			...Gm
		]
	},
	{
		id: "weekStrip",
		labelKey: "calendar.design.weekStrip",
		set: "theme",
		family: "modern",
		phone: "flows",
		view: "week",
		module: "time",
		stripe: !1,
		slots: [
			X("accent"),
			X("surface"),
			X("line"),
			X("todayBg"),
			X("pill"),
			X("pillText")
		],
		texts: Gm
	},
	{
		id: "weekPlan",
		labelKey: "calendar.design.weekPlan",
		set: "theme",
		family: "modern",
		phone: "flows",
		view: "week",
		module: "time",
		stripe: !0,
		slots: [
			X("accent"),
			X("surface"),
			X("line"),
			X("todayBg"),
			X("event")
		],
		texts: ["todayBtn", ...Gm]
	},
	{
		id: "layers",
		labelKey: "calendar.design.layers",
		set: "theme",
		family: "modern",
		phone: "flows",
		view: "week",
		module: "time",
		stripe: !1,
		ownFilter: !0,
		slots: [
			X("accent"),
			X("surface"),
			X("line"),
			X("todayBg")
		],
		texts: ["unnamed", ...Gm]
	},
	{
		id: "sidepanel",
		labelKey: "calendar.design.sidepanel",
		set: "theme",
		family: "modern",
		phone: "flows",
		view: "month",
		module: "time",
		stripe: !1,
		slots: [
			X("accent"),
			X("surface"),
			X("panel"),
			X("line"),
			X("todayBg"),
			X("selected"),
			X("chip")
		],
		texts: Gm
	},
	{
		id: "apMonth",
		labelKey: "calendar.design.apMonth",
		set: "apCream",
		family: "ap",
		phone: "flows",
		empty: "ap",
		view: "month",
		module: "time",
		stripe: !1,
		slots: [
			X("card"),
			X("text"),
			X("gold"),
			X("goldDark"),
			X("grid"),
			X("pill")
		],
		texts: [...Um, ...Gm]
	},
	{
		id: "dayPlan",
		labelKey: "calendar.design.dayPlan",
		set: "theme",
		family: "modern",
		phone: "fits",
		view: "day",
		module: "time",
		stripe: !0,
		slots: [
			X("accent"),
			X("surface"),
			X("line"),
			X("past"),
			X("event")
		],
		texts: [
			"todayBtn",
			"todayCount",
			"count",
			...Gm
		]
	},
	{
		id: "yearWheel",
		labelKey: "calendar.design.yearWheel",
		set: "theme",
		family: "modern",
		phone: "fits",
		view: "year",
		module: "time",
		stripe: !1,
		slots: [
			X("accent"),
			X("surface"),
			X("line"),
			X("ring", "wheel"),
			X("past", "wheel"),
			X("dot", "wheel"),
			X("dotOff", "wheel")
		],
		texts: [
			"wheel",
			"pickMonth",
			"count",
			"monthNone",
			...Gm
		]
	},
	{
		id: "heatmap",
		labelKey: "calendar.design.heatmap",
		set: "theme",
		family: "modern",
		phone: "switch",
		view: "year",
		module: "time",
		stripe: !1,
		slots: [
			X("surface"),
			X("panel"),
			X("line"),
			X("cell0", "scale"),
			X("cell1", "scale"),
			X("cell2", "scale"),
			X("cell3", "scale"),
			X("today", "scale")
		],
		texts: [
			"wholeYear",
			"fewer",
			"more",
			"pickDay",
			"count",
			...Gm
		]
	},
	{
		id: "billboard",
		labelKey: "calendar.design.billboard",
		ownCard: !0,
		set: "board",
		family: "next",
		phone: "fits",
		view: "next",
		module: "next",
		stripe: !1,
		ownSubscribe: !0,
		program: !0,
		slots: [
			X("bg"),
			X("text"),
			X("label"),
			X("pulse"),
			X("tile", "countdown"),
			X("tileText", "countdown"),
			X("button", "buttons"),
			X("buttonText", "buttons")
		],
		texts: [
			"now",
			"then",
			"unitDays",
			"unitHours",
			"unitMin",
			"wholeProgram",
			...Gm
		]
	},
	{
		id: "stacked",
		labelKey: "calendar.design.stacked",
		set: "theme",
		family: "next",
		phone: "fits",
		view: "next",
		module: "next",
		stripe: !1,
		slots: [
			X("accent"),
			X("surface"),
			X("line"),
			X("card", "cards"),
			X("cardText", "cards"),
			X("cardMid", "cards"),
			X("cardBack", "cards"),
			X("badge", "cards"),
			X("badgeText", "cards")
		],
		texts: [
			"now",
			"browse",
			"nextN",
			...Gm
		]
	},
	{
		id: "noticeboard",
		labelKey: "calendar.design.noticeboard",
		ownCard: !0,
		set: "cork",
		family: "next",
		phone: "fits",
		view: "next",
		module: "next",
		stripe: !1,
		notice: !0,
		slots: [
			X("board"),
			X("boardText"),
			X("note", "notes"),
			X("noteText", "notes"),
			X("noteLabel", "notes"),
			X("noteAlt", "notes"),
			X("noteAltText", "notes"),
			X("pin", "notes"),
			X("pinAlt", "notes"),
			X("button", "buttons"),
			X("buttonText", "buttons"),
			X("strip", "later"),
			X("stripText", "later")
		],
		texts: [
			"now",
			"next",
			"later",
			...Wm,
			...Gm
		]
	},
	{
		id: "split",
		labelKey: "calendar.design.split",
		set: "theme",
		family: "next",
		phone: "fits",
		excerpt: !0,
		view: "next",
		module: "next",
		stripe: !1,
		slots: [
			X("accent"),
			X("surface"),
			X("line"),
			X("chip"),
			X("panel", "panel"),
			X("panelText", "panel"),
			X("button", "buttons"),
			X("buttonText", "buttons"),
			X("laterBg", "later")
		],
		texts: [
			"now",
			"later",
			...Gm
		]
	},
	{
		id: "band",
		labelKey: "calendar.design.band",
		set: "theme",
		family: "next",
		phone: "fits",
		view: "next",
		module: "next",
		stripe: !1,
		slots: [
			X("band", "band"),
			X("bandText", "band"),
			X("dot", "band"),
			X("tag", "band"),
			X("tagText", "band")
		],
		texts: ["now", ...Gm]
	},
	{
		id: "oneLine",
		labelKey: "calendar.design.oneLine",
		set: "theme",
		family: "next",
		phone: "fits",
		view: "next",
		module: "next",
		stripe: !0,
		slots: [
			X("accent"),
			X("surface"),
			X("line"),
			X("ring"),
			X("button", "buttons"),
			X("buttonText", "buttons")
		],
		texts: [
			"now",
			"later",
			...Gm
		]
	},
	{
		id: "ring",
		labelKey: "calendar.design.ring",
		set: "theme",
		family: "next",
		phone: "fits",
		view: "next",
		module: "next",
		stripe: !1,
		slots: [
			X("surface"),
			X("line"),
			X("chip"),
			X("accent", "ring"),
			X("track", "ring")
		],
		texts: [
			"now",
			"unitDays",
			"unitHours",
			...Gm
		]
	},
	{
		id: "darkGlass",
		labelKey: "calendar.design.darkGlass",
		ownCard: !0,
		set: "darkGlass",
		family: "next",
		phone: "fits",
		view: "next",
		module: "next",
		stripe: !1,
		ownSubscribe: !0,
		slots: [
			X("ground"),
			X("text"),
			X("label"),
			X("edge", "glass"),
			X("glass", "glass"),
			X("track", "glass"),
			X("blobA", "blobs"),
			X("blobB", "blobs"),
			X("button", "buttons"),
			X("buttonText", "buttons")
		],
		texts: [
			"now",
			"then",
			"untilStart",
			"countdownClock",
			...Gm
		]
	},
	{
		id: "nextBento",
		labelKey: "calendar.design.nextBento",
		set: "bento",
		family: "next",
		phone: "fits",
		view: "next",
		module: "next",
		stripe: !1,
		ownSubscribe: !0,
		program: !0,
		slots: [
			X("accent"),
			X("accentText"),
			X("soft"),
			X("tile"),
			X("line")
		],
		texts: [
			"now",
			"wholeProgram",
			"count",
			...Gm
		]
	},
	{
		id: "apNow",
		labelKey: "calendar.design.apNow",
		set: "apCream",
		family: "ap",
		phone: "fits",
		view: "next",
		module: "more",
		stripe: !1,
		notice: !0,
		noticeBand: !0,
		empty: "ap",
		slots: [
			X("head"),
			X("card"),
			X("text"),
			X("panel"),
			X("panelText"),
			X("gold"),
			X("goldDark"),
			X("alert", "alert"),
			X("alertText", "alert")
		],
		texts: [
			"now",
			"next",
			"later",
			...Wm,
			...Um,
			...Gm
		]
	},
	{
		id: "apNavy",
		labelKey: "calendar.design.apNavy",
		set: "apNavy",
		family: "ap",
		phone: "fits",
		view: "next",
		module: "more",
		stripe: !1,
		empty: "ap",
		slots: [
			X("ground"),
			X("text"),
			X("tile"),
			X("line"),
			X("gold"),
			X("goldDark"),
			X("card", "first"),
			X("cardText", "first")
		],
		texts: [
			"now",
			"later",
			"moreInfo",
			"nextN",
			...Um,
			...Gm
		]
	},
	{
		id: "apSeries",
		labelKey: "calendar.design.apSeries",
		set: "apCream",
		family: "ap",
		phone: "fits",
		excerpt: !0,
		view: "list",
		module: "more",
		stripe: !1,
		notice: !0,
		empty: "ap",
		slots: [
			X("card"),
			X("row"),
			X("text"),
			X("title"),
			X("gold"),
			X("goldDark"),
			X("line")
		],
		texts: [
			"series",
			"forWhom",
			"openAll",
			"allDates",
			...Wm,
			...Um,
			...Gm
		]
	},
	{
		id: "pad",
		labelKey: "calendar.design.pad",
		ownCard: !0,
		set: "pad",
		family: "retro",
		phone: "fits",
		excerpt: !0,
		view: "next",
		module: "retro",
		stripe: !1,
		theme: ["inDays"],
		slots: [
			X("paper"),
			X("head"),
			X("ink"),
			X("rule"),
			X("edge")
		],
		texts: [
			"addEvent",
			"moreInfo",
			...Gm
		]
	},
	{
		id: "index",
		labelKey: "calendar.design.index",
		ownCard: !0,
		set: "index",
		family: "retro",
		phone: "flows",
		excerpt: !0,
		view: "cards",
		module: "retro",
		stripe: !1,
		open: !0,
		theme: [
			"cardNo",
			"colDate",
			"colTime",
			"colPlace",
			"signup",
			"openToAll",
			"recurring"
		],
		slots: [
			X("card"),
			X("rule"),
			X("line"),
			X("ink")
		],
		texts: [
			"cardNo",
			"colDate",
			"colTime",
			"colPlace",
			"openToAll",
			"moreInfo",
			...Gm
		]
	},
	{
		id: "departures",
		labelKey: "calendar.design.departures",
		ownCard: !0,
		set: "departures",
		family: "retro",
		phone: "switch",
		excerpt: !0,
		view: "list",
		module: "retro",
		stripe: !1,
		open: !0,
		ownSubscribe: !0,
		rewrites: !0,
		phoneDefault: "depStrip",
		cardDefault: "depHead",
		theme: [
			"now",
			"signup",
			"openToAll",
			"subscribe"
		],
		slots: [
			X("board"),
			X("flap"),
			X("text"),
			X("amber"),
			X("cancelled")
		],
		texts: [
			"now",
			"updated",
			"colDate",
			"colTime",
			"colEvent",
			"colPlace",
			"colStatus",
			"rowHint",
			"openToAll",
			"moreInfo",
			...Gm
		]
	},
	{
		id: "marquee",
		ownCard: !0,
		labelKey: "calendar.design.marquee",
		set: "marquee",
		family: "retro",
		phone: "switch",
		excerpt: !0,
		view: "next",
		module: "retro",
		stripe: !1,
		phoneDefault: "marqueeRows",
		theme: [
			"now",
			"later",
			"signup"
		],
		slots: [
			X("frame"),
			X("bulb"),
			X("board"),
			X("ink")
		],
		texts: [
			"now",
			"later",
			"moreInfo",
			...Gm
		]
	},
	{
		id: "receipt",
		ownCard: !0,
		labelKey: "calendar.design.receipt",
		set: "receipt",
		family: "retro",
		phone: "fits",
		excerpt: !0,
		view: "list",
		module: "retro",
		stripe: !1,
		ownSubscribe: !0,
		rewrites: !0,
		theme: [
			"program",
			"period",
			"countLabel",
			"nextShort",
			"signup",
			"subscribe",
			"cardNo"
		],
		slots: [X("paper"), X("ink")],
		texts: [
			"program",
			"period",
			"venue",
			"countLabel",
			"nextShort",
			"unitDays",
			"admission",
			"admissionPrice",
			"thanks",
			"cardNo",
			"colDate",
			"colTime",
			"colPlace",
			"colCategory",
			"moreInfo",
			...Gm
		]
	},
	{
		id: "seventies",
		ownCard: !0,
		labelKey: "calendar.design.seventies",
		set: "seventies",
		family: "retro",
		phone: "fits",
		excerpt: !0,
		view: "list",
		module: "retro",
		stripe: !1,
		ownSubscribe: !0,
		theme: [
			"now",
			"period",
			"signup",
			"subscribe"
		],
		slots: [
			X("cream"),
			X("orange"),
			X("brown"),
			X("mustard")
		],
		texts: [
			"now",
			"period",
			"moreInfo",
			...Gm
		]
	},
	{
		id: "deco",
		labelKey: "calendar.design.deco",
		ownCard: !0,
		set: "deco",
		family: "retro",
		phone: "fits",
		excerpt: !0,
		view: "list",
		module: "retro",
		stripe: !1,
		ownSubscribe: !0,
		theme: ["now", "signup"],
		slots: [
			X("bg"),
			X("gold"),
			X("cream")
		],
		texts: [
			"now",
			"period",
			"moreInfo",
			...Gm
		]
	},
	{
		id: "mobileAgenda",
		labelKey: "calendar.design.mobileAgenda",
		set: "agendaDark",
		family: "modern",
		phone: "fits",
		view: "agenda",
		module: "more",
		stripe: !0,
		ownFilter: !0,
		slots: [
			X("ground"),
			X("text"),
			X("card"),
			X("edge"),
			X("accent"),
			X("chip")
		],
		texts: ["todayBtn", ...Gm]
	}
], uh = (e, t, n, r) => ({
	key: e,
	kind: "choice",
	values: t,
	def: n,
	labelKey: `calendar.opt.${e}`,
	...r ? { when: r } : {}
}), dh = (e, t) => ({
	key: e,
	kind: "switch",
	def: t,
	labelKey: `calendar.opt.${e}`
}), fh = (e) => ({
	...e,
	tipKey: `tip.calendar.opt.${e.key}`
}), ph = (e) => ({
	key: e,
	kind: "hour",
	def: null,
	labelKey: `calendar.opt.${e}`
}), mh = {
	sidepanel: [uh("panelSide", [
		"right",
		"left",
		"under"
	], "right")],
	weekPlan: [
		ph("hourFrom"),
		ph("hourTo"),
		dh("weekend", !1)
	],
	dayPlan: [
		ph("hourFrom"),
		ph("hourTo"),
		dh("weekend", !1)
	],
	table: [
		dh("colTime", !0),
		dh("colPlace", !0),
		dh("zebra", !0)
	],
	posters: [uh("columns", [
		"auto",
		"2",
		"3",
		"4"
	], "auto")],
	photo: [uh("columns", [
		"auto",
		"2",
		"3",
		"4"
	], "auto")],
	yearWheel: [uh("firstMonth", [
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"10",
		"11",
		"now"
	], "0")],
	numbered: [dh("pad", !0)],
	band: [dh("roll", !0), uh("pause", ["button", "touch"], "button", { roll: !0 })],
	index: [uh("columns", [
		"auto",
		"2",
		"3",
		"4"
	], "auto")]
}, hh = {
	theme: fh(uh("wordChoice", ["theme", "neutral"], "theme")),
	rewrites: fh(dh("rewrite", !0))
}, gh = [
	"weekStrip",
	"weekPlan",
	"layers"
], _h = [
	"month",
	"sidepanel",
	"apMonth"
];
function vh(e) {
	let t = wh(e?.design), n = e?.switcherViews ?? {};
	return {
		week: gh.includes(n.week) ? n.week : "weekStrip",
		month: _h.includes(n.month) ? n.month : t.set === "apCream" || t.set === "apNavy" ? "apMonth" : "month"
	};
}
function yh(e) {
	return e?.description === "card" || e?.description === "rows" ? e.description : e?.options?.description === !1 ? "card" : "rows";
}
function bh(e) {
	let t = wh(e?.design);
	return t.excerpt === !0 || t.id === "plain" && Th(e) === "cards";
}
function xh(e) {
	let t = wh(e), n = mh[t.id] ?? [], r = [];
	return t.theme?.length && r.push(hh.theme), t.rewrites && r.push(hh.rewrites), r.length ? [...n, ...r] : n;
}
function Sh(e) {
	let t = e?.options ?? {}, n = {};
	for (let r of xh(e?.design)) {
		let e = t[r.key];
		r.kind === "choice" ? n[r.key] = r.values.includes(e) ? e : r.def : r.kind === "switch" ? n[r.key] = typeof e == "boolean" ? e : r.def : n[r.key] = Number.isInteger(e) && e >= 0 && e <= 24 ? e : null;
	}
	return n;
}
function Ch(e, t) {
	return !e.when || Object.entries(e.when).every(([e, n]) => t?.[e] === n);
}
function wh(e) {
	return lh.find((t) => t.id === e) ?? lh[0];
}
function Th(e) {
	return wh(e?.design).view || (zm.includes(e?.view) ? e.view : "list");
}
var Eh = [
	"list",
	"cards",
	"agenda",
	"next"
];
function Dh() {
	let e = [{
		view: null,
		designs: lh.filter((e) => e.view === null)
	}];
	for (let t of zm) {
		let n = lh.filter((e) => e.view === t);
		n.length && e.push({
			view: t,
			designs: n
		});
	}
	return e;
}
var Oh = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i, kh = /^[a-z][a-z0-9-]*$/;
function Ah(e) {
	return typeof e == "string" ? Oh.test(e) ? e : kh.test(e) ? `var(--urd-color-${e})` : null : null;
}
function jh(e, t) {
	let n = typeof t?.show == "boolean" ? t.show : e.stripe;
	return {
		show: n,
		color: n ? Ah(t?.color) : null
	};
}
var Mh = {
	min: 8,
	max: 120
}, Nh = /^(?:\s|&nbsp;|&#160;|<[^<>]*>)*$/i;
function Ph(e) {
	return typeof e != "string" || Nh.test(e);
}
function Fh(e, t) {
	return Object.keys(t ?? {}).some((n) => {
		let r = n.split(".")[0];
		return !e.texts.includes(r) || Hm[r] ? !1 : t[n] === !1 ? Vm.includes(r) : !Ph(t[n]);
	});
}
function Ih(e) {
	let t = {};
	for (let n of Object.keys(Hm)) Ph(e?.[n]) || (t[n] = e[n]);
	return Object.keys(t).length ? t : void 0;
}
//#endregion
//#region src/panels/BlocksPanel.svelte
var Lh = /* @__PURE__ */ L("<label class=\"ghost filepick\"> <input type=\"file\" accept=\"image/*\"/></label>"), Rh = /* @__PURE__ */ L("<label class=\"ghost filepick\"> <input type=\"file\" accept=\"image/*\" multiple=\"\"/></label>"), zh = /* @__PURE__ */ L("<button class=\"ghost\"> </button>"), Bh = /* @__PURE__ */ L("<p class=\"panel-hint\"> </p>"), Vh = /* @__PURE__ */ L("<details class=\"group\"><summary> </summary> <div class=\"group-items\"></div></details>"), Hh = /* @__PURE__ */ L("<details class=\"group\"><summary> </summary> <div class=\"group-items\"><button class=\"ghost\"> </button> <button class=\"ghost\"> </button></div></details> <button class=\"ghost\"> </button> <label class=\"ghost filepick\"> <input type=\"file\" accept=\"image/*\"/></label> <button class=\"ghost\"> </button> <button class=\"ghost\"> </button> <button class=\"ghost\"> </button> <button class=\"ghost\"> </button> <button class=\"ghost\"> </button> <button class=\"ghost\"> </button> <button class=\"ghost\"> </button> <button class=\"ghost\"> </button> <button class=\"ghost\"> </button> <button class=\"ghost\"> </button> <button class=\"ghost\"> </button> <button class=\"ghost\"> </button> <button class=\"ghost\"> </button> <button class=\"ghost\"> </button> <button class=\"ghost\"> </button> <button class=\"ghost\"> </button> <button class=\"ghost\"> </button> <details class=\"group\"><summary> </summary> <div class=\"group-items\"><button class=\"ghost\"> </button> <label class=\"ghost filepick\"> <input type=\"file\" accept=\"image/*\" multiple=\"\"/></label></div></details> <details class=\"group\"><summary> </summary> <div class=\"group-items\"><button class=\"ghost\"> </button> <button class=\"ghost\"> </button> <button class=\"ghost\"> </button> <button class=\"ghost\"> </button> <button class=\"ghost\"> </button></div> <div class=\"group-items\"><button class=\"ghost\"> </button></div></details> <details class=\"group\"><summary> </summary> <div class=\"group-items\"><button class=\"ghost\"> </button> <button class=\"ghost\"> </button> <button class=\"ghost\"> </button> <button class=\"ghost\"> </button> <button class=\"ghost\"> </button></div></details> <!> <!>", 1), Uh = /* @__PURE__ */ L("<div><input type=\"text\"/> <!></div>");
function Wh(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.bridge), i = /* @__PURE__ */ D(() => n.iframeEl), a = /* @__PURE__ */ D(() => n.pluginBlocks), o = /* @__PURE__ */ D(() => n.templateIds), s = /* @__PURE__ */ D(() => n.templateStores), c = /* @__PURE__ */ D(() => n.viewMode), { addCalendarDesign: l, buildBlock: u, compressMany: d, compressOrTrim: f, imageErrorText: p, reportUpload: m, requestPlacement: h, setStatus: g } = n;
	function _(e) {
		h(u(e));
	}
	function v(e, t = {}) {
		let n = Ze(e);
		h({
			id: es("blk"),
			type: n.type,
			version: n.version ?? 1,
			decor: !1,
			props: {
				...n.defaults ?? {},
				...Ze(t)
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
	let y = /* @__PURE__ */ O("");
	function b() {
		let e = [
			{
				label: K("blocks.text"),
				act: "block",
				kind: "text"
			},
			{
				label: K("ui.textBox"),
				act: "block",
				kind: "text-box"
			},
			{
				label: K("blocks.button"),
				act: "block",
				kind: "button"
			},
			{
				label: K("blocks.image"),
				act: "image"
			},
			{
				label: K("blocks.video"),
				act: "block",
				kind: "video"
			},
			{
				label: K("blocks.icon"),
				act: "block",
				kind: "icon"
			},
			{
				label: K("blocks.map"),
				act: "block",
				kind: "map"
			},
			{
				label: K("blocks.form"),
				act: "block",
				kind: "form"
			},
			{
				label: `${K("blocks.calendar")}: ${K("calendar.viewList")}`,
				act: "block",
				kind: "calendar"
			},
			{
				label: `${K("blocks.calendar")}: ${K("calendar.viewCards")}`,
				act: "block",
				kind: "calendar-cards"
			},
			{
				label: `${K("blocks.calendar")}: ${K("calendar.viewMonth")}`,
				act: "block",
				kind: "calendar-month"
			},
			{
				label: `${K("blocks.calendar")}: ${K("calendar.viewNext")}`,
				act: "block",
				kind: "calendar-next"
			},
			{
				label: `${K("blocks.calendar")}: ${K("calendar.viewAgenda")}`,
				act: "block",
				kind: "calendar-agenda"
			},
			...Dh().flatMap((e) => e.designs).filter((e) => e.id !== "plain").map((e) => ({
				label: `${K("blocks.calendar")}: ${K(e.labelKey)}`,
				act: "calendarDesign",
				design: e.id
			})),
			{
				label: K("blocks.collection"),
				act: "block",
				kind: "collection"
			},
			{
				label: K("blocks.faq"),
				act: "block",
				kind: "faq"
			},
			{
				label: K("blocks.timeline"),
				act: "block",
				kind: "timeline"
			},
			{
				label: K("blocks.quote"),
				act: "block",
				kind: "quote"
			},
			{
				label: K("blocks.stats"),
				act: "block",
				kind: "stats"
			},
			{
				label: K("blocks.ribbon"),
				act: "block",
				kind: "ribbon"
			},
			{
				label: K("blocks.table"),
				act: "block",
				kind: "table"
			},
			{
				label: K("blocks.share"),
				act: "block",
				kind: "share"
			},
			{
				label: K("blocks.countdown"),
				act: "block",
				kind: "countdown"
			},
			{
				label: K("blocks.audio"),
				act: "block",
				kind: "audio"
			},
			{
				label: K("blocks.product"),
				act: "block",
				kind: "product"
			},
			{
				label: K("blocks.cart"),
				act: "block",
				kind: "cart"
			},
			{
				label: K("blocks.checkout"),
				act: "block",
				kind: "checkout"
			},
			{
				label: K("ui.emptyGallery"),
				act: "block",
				kind: "gallery"
			},
			{
				label: K("ui.galleryWithImages"),
				act: "galleryImages"
			},
			{
				label: K("shape.line"),
				act: "block",
				kind: "shape-line"
			},
			{
				label: K("shape.arrow"),
				act: "block",
				kind: "shape-arrow"
			},
			{
				label: K("shape.circle"),
				act: "block",
				kind: "shape-circle"
			},
			{
				label: K("shape.rect"),
				act: "block",
				kind: "shape-rect"
			},
			{
				label: K("shape.triangle"),
				act: "block",
				kind: "shape-triangle"
			}
		];
		for (let t of F(o)) {
			let n = F(s)[t]?.data?.mal;
			n?.kind === "blocks" && e.push({
				label: n.name,
				act: "template",
				id: t
			});
		}
		for (let t of F(a)) if (t.variants?.length) for (let n of t.variants) e.push({
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
	function x(e) {
		e.act === "block" ? _(e.kind) : e.act === "calendarDesign" ? l(e.design) : e.act === "plugin" ? v(e.entry, e.props ?? {}) : e.act === "template" && F(r)?.sendInsertTemplate(e.id);
	}
	async function S(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", !t) return;
		g(K("status.compressingImage"));
		let n;
		try {
			n = await f(t);
		} catch (e) {
			g(p(e), "error");
			return;
		}
		let r = Math.round(n.height / n.width * .3 * (F(i)?.clientWidth ?? 1280));
		h({
			id: es("blk"),
			type: "image",
			version: 1,
			props: {
				src: n.dataUrl,
				alt: zp(t.name).replaceAll("-", " "),
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
		}), n.bytes > 4e5 ? g(K("status.imageLarge", { kb: Math.round(n.bytes / 1024) }), "error") : g("");
	}
	async function C(e) {
		let t = [...e.target.files ?? []];
		if (e.target.value = "", !t.length) return;
		g(K("status.compressingImages"));
		let { images: n, failed: r, big: i } = await d(t);
		if (!n.length) {
			m(0, r, i);
			return;
		}
		let a = u("gallery");
		a.props.images = n, h(a), m(n.length, r, i);
	}
	var w = Uh();
	let ee;
	var T = A(w);
	U(T);
	var te = N(T, 2), ne = (e) => {
		var t = Xr();
		di(j(t), 17, () => Rm(b(), F(y), (e) => e.label), (e) => e.label, (e, t) => {
			var n = Xr(), r = j(n), i = (e) => {
				var n = Lh(), r = A(n), i = N(r);
				E(n), P((e) => {
					G(n, "title", e), z(r, `${F(t).label ?? ""} `);
				}, [() => K("tip.webpAuto")]), I("change", i, S), R(e, n);
			}, a = (e) => {
				var n = Rh(), r = A(n), i = N(r);
				E(n), P((e) => {
					G(n, "title", e), z(r, `${F(t).label ?? ""} `);
				}, [() => K("tip.blocks.galleryImages")]), I("change", i, C), R(e, n);
			}, o = (e) => {
				var n = zh(), r = M(n, !0);
				P(() => z(r, F(t).label)), I("click", n, () => x(F(t))), R(e, n);
			};
			B(r, (e) => {
				F(t).act === "image" ? e(i) : F(t).act === "galleryImages" ? e(a, 1) : e(o, -1);
			}), R(e, n);
		}, (e) => {
			var t = Bh(), n = M(t, !0);
			P((e) => z(n, e), [() => K("canvas.searchEmpty")]), R(e, t);
		}), R(e, t);
	}, re = /* @__PURE__ */ D(() => F(y).trim()), ie = (e) => {
		var t = Hh(), i = j(t), c = A(i), l = M(c, !0), u = N(c, 2), d = A(u), f = M(d, !0), p = N(d, 2), m = M(p, !0);
		E(u), E(i);
		var h = N(i, 2), g = M(h, !0), y = N(h, 2), b = A(y), x = N(b);
		E(y);
		var w = N(y, 2), ee = M(w, !0), T = N(w, 2), te = M(T, !0), ne = N(T, 2), re = M(ne, !0), ie = N(ne, 2), ae = M(ie, !0), oe = N(ie, 2), se = M(oe, !0), ce = N(oe, 2), le = M(ce, !0), ue = N(ce, 2), de = M(ue, !0), fe = N(ue, 2), pe = M(fe, !0), me = N(fe, 2), he = M(me, !0), ge = N(me, 2), _e = M(ge, !0), ve = N(ge, 2), ye = M(ve, !0), be = N(ve, 2), xe = M(be, !0), Se = N(be, 2), Ce = M(Se, !0), we = N(Se, 2), Te = M(we, !0), Ee = N(we, 2), De = M(Ee, !0), Oe = N(Ee, 2), ke = M(Oe, !0), Ae = N(Oe, 2), je = M(Ae, !0), Me = N(Ae, 2), Ne = A(Me), Pe = M(Ne, !0), Fe = N(Ne, 2), Ie = A(Fe), Le = M(Ie, !0), Re = N(Ie, 2), ze = A(Re), Be = N(ze);
		E(Re), E(Fe), E(Me);
		var Ve = N(Me, 2), He = A(Ve), Ue = M(He, !0), We = N(He, 2), Ge = A(We), Ke = M(Ge, !0), qe = N(Ge, 2), Je = M(qe, !0), Ye = N(qe, 2), Xe = M(Ye, !0), Ze = N(Ye, 2), Qe = M(Ze, !0), $e = N(Ze, 2), et = M($e, !0);
		E(We);
		var tt = N(We, 2), nt = A(tt), rt = M(nt, !0);
		E(tt), E(Ve);
		var it = N(Ve, 2), at = A(it), ot = M(at, !0), st = N(at, 2), ct = A(st), lt = M(ct, !0), ut = N(ct, 2), dt = M(ut, !0), ft = N(ut, 2), pt = M(ft, !0), mt = N(ft, 2), ht = M(mt, !0), gt = N(mt, 2), _t = M(gt, !0);
		E(st), E(it);
		var vt = N(it, 2), yt = (e) => {
			let t = /* @__PURE__ */ D(() => F(o).filter((e) => F(s)[e]?.data?.mal?.kind === "blocks"));
			var n = Vh(), i = A(n), a = M(i, !0), c = N(i, 2);
			di(c, 20, () => F(t), (e) => e, (e, t) => {
				var n = zh(), i = M(n, !0);
				P((e) => {
					G(n, "title", e), z(i, F(s)[t].data.mal.name);
				}, [() => K("canvas.insertGroup")]), I("click", n, () => F(r)?.sendInsertTemplate(t)), R(e, n);
			}), E(c), E(n), P((e) => z(a, e), [() => K("canvas.tabMyTemplates")]), R(e, n);
		}, bt = /* @__PURE__ */ D(() => F(o).some((e) => F(s)[e]?.data?.mal?.kind === "blocks"));
		B(vt, (e) => {
			F(bt) && e(yt);
		});
		var xt = N(vt, 2), St = (e) => {
			var t = Vh(), n = A(t), r = M(n, !0), i = N(n, 2);
			di(i, 21, () => F(a), (e) => e.type, (e, t) => {
				var n = Xr(), r = j(n), i = (e) => {
					var n = Vh(), r = A(n), i = M(r, !0), a = N(r, 2);
					di(a, 21, () => F(t).variants, (e) => e.label, (e, n) => {
						var r = zh(), i = M(r, !0);
						P((e) => {
							G(r, "title", e), z(i, F(n).label);
						}, [() => K("tip.blocks.fromPlugin", { plugin: F(t).plugin })]), I("click", r, () => v(F(t), F(n).props)), R(e, r);
					}), E(a), E(n), P(() => z(i, F(t).label)), R(e, n);
				}, a = (e) => {
					var n = zh(), r = M(n, !0);
					P((e) => {
						G(n, "title", e), z(r, F(t).label);
					}, [() => K("tip.blocks.fromPlugin", { plugin: F(t).plugin })]), I("click", n, () => v(F(t))), R(e, n);
				};
				B(r, (e) => {
					F(t).variants?.length ? e(i) : e(a, -1);
				}), R(e, n);
			}), E(i), E(t), P((e) => z(r, e), [() => K("panel.plugins")]), R(e, t);
		};
		B(xt, (e) => {
			F(a).length && e(St);
		}), P((e, t, n, r, i, a, o, s, c, u, d, h, _, v, x, S, C, E, Me, Ne, Fe, Be, Ve, He, We, tt, it, at, st, ct, ut, ft, mt, gt, vt, yt, bt, xt, St, Ct, wt, Tt, Et, Dt, Ot, kt, D, At, jt, Mt, Nt, Pt, Ft, It, Lt, Rt, zt, Bt, Vt, Ht, Ut, Wt, Gt, Kt, qt) => {
			z(l, e), z(f, t), G(p, "title", n), z(m, r), z(g, i), G(y, "title", a), z(b, `${o ?? ""} `), G(w, "title", s), z(ee, c), G(T, "title", u), z(te, d), G(ne, "title", h), z(re, _), G(ie, "title", v), z(ae, x), G(oe, "title", S), z(se, C), G(ce, "title", E), z(le, Me), G(ue, "title", Ne), z(de, Fe), G(fe, "title", Be), z(pe, Ve), G(me, "title", He), z(he, We), G(ge, "title", tt), z(_e, it), G(ve, "title", at), z(ye, st), G(be, "title", ct), z(xe, ut), G(Se, "title", ft), z(Ce, mt), G(we, "title", gt), z(Te, vt), G(Ee, "title", yt), z(De, bt), G(Oe, "title", xt), z(ke, St), G(Ae, "title", Ct), z(je, wt), z(Pe, Tt), G(Ie, "title", Et), z(Le, Dt), G(Re, "title", Ot), z(ze, `${kt ?? ""} `), z(Ue, D), G(Ge, "title", At), z(Ke, jt), G(qe, "title", Mt), z(Je, Nt), G(Ye, "title", Pt), z(Xe, Ft), G(Ze, "title", It), z(Qe, Lt), G($e, "title", Rt), z(et, zt), G(nt, "title", Bt), z(rt, Vt), z(ot, Ht), z(lt, Ut), z(dt, Wt), z(pt, Gt), z(ht, Kt), z(_t, qt);
		}, [
			() => K("blocks.text"),
			() => K("blocks.text"),
			() => K("tip.blocks.textBox"),
			() => K("ui.textBox"),
			() => K("blocks.button"),
			() => K("tip.webpAuto"),
			() => K("blocks.image"),
			() => K("tip.blocks.video"),
			() => K("blocks.video"),
			() => K("tip.blocks.icon"),
			() => K("blocks.icon"),
			() => K("tip.blocks.map"),
			() => K("blocks.map"),
			() => K("tip.blocks.form"),
			() => K("blocks.form"),
			() => K("tip.blocks.collection"),
			() => K("blocks.collection"),
			() => K("tip.blocks.faq"),
			() => K("blocks.faq"),
			() => K("tip.blocks.timeline"),
			() => K("blocks.timeline"),
			() => K("tip.blocks.quote"),
			() => K("blocks.quote"),
			() => K("tip.blocks.stats"),
			() => K("blocks.stats"),
			() => K("tip.blocks.ribbon"),
			() => K("blocks.ribbon"),
			() => K("tip.blocks.table"),
			() => K("blocks.table"),
			() => K("tip.blocks.share"),
			() => K("blocks.share"),
			() => K("tip.blocks.countdown"),
			() => K("blocks.countdown"),
			() => K("tip.blocks.audio"),
			() => K("blocks.audio"),
			() => K("tip.blocks.product"),
			() => K("blocks.product"),
			() => K("tip.blocks.cart"),
			() => K("blocks.cart"),
			() => K("tip.blocks.checkout"),
			() => K("blocks.checkout"),
			() => K("blocks.gallery"),
			() => K("tip.blocks.gallery"),
			() => K("ui.emptyGallery"),
			() => K("tip.blocks.galleryImages"),
			() => K("ui.galleryWithImages"),
			() => K("blocks.calendar"),
			() => K("tip.blocks.calendar"),
			() => K("calendar.viewList"),
			() => K("tip.blocks.calendar"),
			() => K("calendar.viewCards"),
			() => K("tip.blocks.calendar"),
			() => K("calendar.viewMonth"),
			() => K("tip.blocks.calendar"),
			() => K("calendar.viewNext"),
			() => K("tip.blocks.calendar"),
			() => K("calendar.viewAgenda"),
			() => K("tip.calendar.picker.open"),
			() => K("calendar.picker.open"),
			() => K("group.shapes"),
			() => K("shape.line"),
			() => K("shape.arrow"),
			() => K("shape.circle"),
			() => K("shape.rect"),
			() => K("shape.triangle")
		]), I("click", d, () => _("text")), I("click", p, () => _("text-box")), I("click", h, () => _("button")), I("change", x, S), I("click", w, () => _("video")), I("click", T, () => _("icon")), I("click", ne, () => _("map")), I("click", ie, () => _("form")), I("click", oe, () => _("collection")), I("click", ce, () => _("faq")), I("click", ue, () => _("timeline")), I("click", fe, () => _("quote")), I("click", me, () => _("stats")), I("click", ge, () => _("ribbon")), I("click", ve, () => _("table")), I("click", be, () => _("share")), I("click", Se, () => _("countdown")), I("click", we, () => _("audio")), I("click", Ee, () => _("product")), I("click", Oe, () => _("cart")), I("click", Ae, () => _("checkout")), I("click", Ie, () => _("gallery")), I("change", Be, C), I("click", Ge, () => _("calendar")), I("click", qe, () => _("calendar-cards")), I("click", Ye, () => _("calendar-month")), I("click", Ze, () => _("calendar-next")), I("click", $e, () => _("calendar-agenda")), I("click", nt, () => n.designPicker = { mode: "add" }), I("click", ct, () => _("shape-line")), I("click", ut, () => _("shape-arrow")), I("click", ft, () => _("shape-circle")), I("click", mt, () => _("shape-rect")), I("click", gt, () => _("shape-triangle")), R(e, t);
	};
	B(te, (e) => {
		F(re) ? e(ne) : e(ie, -1);
	}), E(w), P((e, t, n) => {
		ee = H(w, 1, "panel-body", null, ee, { locked: F(c) === "mobile" }), G(w, "title", e), G(T, "placeholder", t), G(T, "title", n);
	}, [
		() => F(c) === "mobile" ? K("tip.blocks.mobileLocked") : void 0,
		() => K("canvas.searchBlocks"),
		() => K("canvas.searchBlocks")
	]), Gi(T, () => F(y), (e) => k(y, e)), R(e, w), ot();
}
Vr(["change", "click"]);
//#endregion
//#region src/panels/GridPanel.svelte
var Gh = /* @__PURE__ */ L("<div class=\"panel-body\"><label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"4\" max=\"96\" step=\"2\"/> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label></div>");
function Kh(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.grid), { setGrid: i } = n;
	var a = Gh(), o = A(a), s = A(o), c = M(N(s));
	E(o);
	var l = N(o, 2);
	U(l);
	var u = N(l, 2), d = A(u);
	U(d);
	var f = N(d);
	E(u), E(a), P((e, t) => {
		z(s, `${e ?? ""} `), z(c, `${F(r).size ?? ""} px`), W(l, F(r).size), Vi(d, F(r).snap !== !1), z(f, ` ${t ?? ""}`);
	}, [() => K("lbl.gridSize"), () => K("lbl.gridSnap")]), I("input", l, (e) => i("size", Number(e.target.value))), I("change", d, (e) => i("snap", e.target.checked)), R(e, a), ot();
}
Vr(["input", "change"]);
//#endregion
//#region node_modules/svelte/src/reactivity/set.js
var qh = [
	"forEach",
	"isDisjointFrom",
	"isSubsetOf",
	"isSupersetOf"
], Jh = [
	"difference",
	"intersection",
	"symmetricDifference",
	"union"
], Yh = !1, Xh = class e extends Set {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ O(0);
	#n = /* @__PURE__ */ O(0);
	#r = _r || -1;
	constructor(e) {
		if (super(), e) {
			for (var t of e) super.add(t);
			this.#n.v = super.size;
		}
		Yh || this.#a();
	}
	#i(e) {
		return _r === this.#r ? /* @__PURE__ */ O(e) : an(e);
	}
	#a() {
		Yh = !0;
		var t = e.prototype, n = Set.prototype;
		for (let e of qh) t[e] = function(...t) {
			return F(this.#t), n[e].apply(this, t);
		};
		for (let r of Jh) t[r] = function(...t) {
			F(this.#t);
			var i = n[r].apply(this, t);
			return new e(i);
		};
	}
	has(e) {
		var t = super.has(e), n = this.#e, r = n.get(e);
		if (r === void 0) {
			if (!t) return F(this.#t), !1;
			r = this.#i(!0), n.set(e, r);
		}
		return F(r), t;
	}
	add(e) {
		return super.has(e) || (super.add(e), k(this.#n, super.size), fn(this.#t)), this;
	}
	delete(e) {
		var t = super.delete(e), n = this.#e, r = n.get(e);
		return r !== void 0 && (n.delete(e), k(r, !1)), t && (k(this.#n, super.size), fn(this.#t)), t;
	}
	clear() {
		if (super.size !== 0) {
			super.clear();
			var e = this.#e;
			for (var t of e.values()) k(t, !1);
			e.clear(), k(this.#n, 0), fn(this.#t);
		}
	}
	keys() {
		return this.values();
	}
	values() {
		return F(this.#t), super.values();
	}
	entries() {
		return F(this.#t), super.entries();
	}
	[Symbol.iterator]() {
		return this.keys();
	}
	get size() {
		return F(this.#n);
	}
}, Zh = "urd-quick-row", Qh = ["fit", "phone"], $h = {
	calendar: [
		"design",
		"limit",
		"subscribe"
	],
	text: ["align", "textBox"],
	button: ["goesTo", "btnStyle"],
	image: ["imgFit", "radius"],
	video: ["videoSource"],
	icon: ["iconSize", "iconColor"],
	shape: ["shapeColor", "thickness"],
	gallery: ["galleryView", "columns"],
	ribbon: ["ribbonMotion", "speed"],
	table: ["tableLines"],
	quote: ["variant"],
	stats: ["variant"],
	faq: ["variant"],
	timeline: ["variant"],
	form: ["sendMode"],
	collection: ["collectionView", "limit"],
	product: ["columns"],
	cart: ["cartView"],
	checkout: ["vippsButton"],
	share: ["variant"],
	countdown: ["seconds"],
	audio: ["loop"],
	map: ["zoom"]
};
function eg(e) {
	return [...$h[e] ?? [], ...Qh];
}
var tg = Object.freeze({
	pinned: [],
	removed: []
});
function ng(e) {
	let t = (e) => Array.isArray(e) ? [...new Set(e.filter((e) => typeof e == "string" && e))] : [];
	return {
		pinned: t(e?.pinned),
		removed: t(e?.removed)
	};
}
function rg(e, t, n) {
	let r = eg(e).filter((e) => !t.removed.includes(e));
	for (let e of t.pinned) r.includes(e) || r.push(e);
	return r.filter((e) => n.has(e));
}
function ig(e, t, n) {
	return eg(e).includes(n) ? !t.removed.includes(n) : t.pinned.includes(n);
}
function ag(e, t, n) {
	let r = eg(e).includes(n);
	return ig(e, t, n) ? r ? {
		pinned: t.pinned,
		removed: [...t.removed, n]
	} : {
		pinned: t.pinned.filter((e) => e !== n),
		removed: t.removed
	} : r ? {
		pinned: t.pinned,
		removed: t.removed.filter((e) => e !== n)
	} : {
		pinned: [...t.pinned, n],
		removed: t.removed
	};
}
function og(e) {
	return e.pinned.length > 0 || e.removed.length > 0;
}
function sg(e) {
	try {
		let t = JSON.parse(e.getItem("urd-quick-row") ?? "{}");
		return !t || typeof t != "object" || Array.isArray(t) ? {} : Object.fromEntries(Object.entries(t).map(([e, t]) => [e, ng(t)]));
	} catch {
		return {};
	}
}
function cg(e, t) {
	let n = Object.fromEntries(Object.entries(t).filter(([, e]) => og(e)));
	try {
		e.setItem(Zh, JSON.stringify(n));
	} catch {}
}
//#endregion
//#region src/menu/state.svelte.js
var lg = "urd-admin-menu-width", ug = mn({
	widthPref: localStorage.getItem(lg) === "narrow" ? "narrow" : "wide",
	wide: localStorage.getItem(lg) !== "narrow",
	min: 8,
	room: Infinity,
	menuQuery: "",
	propsQuery: "",
	tab: "content",
	place: null
});
function dg() {
	return ug.wide && ug.room >= 740;
}
function fg(e) {
	ug.widthPref = e === "narrow" ? "narrow" : "wide", ug.wide = ug.widthPref === "wide", ug.widthPref === "narrow" ? localStorage.setItem(lg, "narrow") : localStorage.removeItem(lg);
}
function pg(e) {
	ug.min = Math.round(e) + 8, ug.room = window.innerWidth - ug.min - 8;
}
var mg = [
	"content",
	"style",
	"placement"
];
function hg(e, t = null) {
	if (!mg.includes(e)) return;
	ug.tab = e;
	let n = t?.querySelectorAll(".emenu-col")[mg.indexOf(e)];
	n && (n.scrollIntoView({ block: "nearest" }), document.activeElement?.classList.contains("menu-search") || n.querySelector("summary, button")?.focus());
}
var gg = new Xh(), _g = /* @__PURE__ */ new Set(), vg = mn({ choices: sg(localStorage) });
function yg(e) {
	return vg.choices[e] ?? tg;
}
function bg(e, t) {
	vg.choices = {
		...vg.choices,
		[e]: t
	}, cg(localStorage, Ze(vg.choices));
}
function xg(e, t) {
	bg(e, ag(e, yg(e), t));
}
//#endregion
//#region src/menu/Pin.svelte
var Sg = /* @__PURE__ */ L("<button type=\"button\"></button>");
function Cg(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock.type), i = /* @__PURE__ */ D(() => ig(F(r), yg(F(r)), t.id));
	var a = Sg();
	let o;
	V(a, () => F(i) ? q.pinOn : q.pin, !0), E(a), P((e, t) => {
		o = H(a, 1, "menu-pin", null, o, { on: F(i) }), G(a, "aria-pressed", F(i)), G(a, "title", e), G(a, "aria-label", t);
	}, [() => F(i) ? K("menu.unpin") : K("menu.pin"), () => F(i) ? K("menu.unpin") : K("menu.pin")]), I("click", a, () => xg(F(r), t.id)), R(e, a), ot();
}
Vr(["click"]);
//#endregion
//#region src/menu/options.js
var wg = () => [["on", K("common.on")], ["off", K("common.off")]], Tg = () => [
	["canvas", K("opt.ribbonWidth.content")],
	["page", K("opt.ribbonWidth.page")],
	["content", K("opt.ribbonWidth.own")]
], Eg = (e) => e === "canvas" || e === "page" ? e : "content", Dg = () => [
	["roll", K("opt.ribbonMotion.roll")],
	["sway", K("opt.ribbonMotion.sway")],
	["step", K("opt.ribbonMotion.step")],
	["none", K("opt.ribbonMotion.none")]
], Og = () => [
	["text", K("opt.ribbonStripe.text")],
	["marks", K("opt.ribbonStripe.marks")],
	["plain", K("opt.ribbonStripe.plain")]
], kg = () => [["none", K("common.none")], ...Og()], Ag = () => [
	["dot", K("opt.ribbonSep.dot")],
	["dash", K("opt.ribbonSep.dash")],
	["slash", K("opt.ribbonSep.slash")],
	["star", K("opt.ribbonSep.star")],
	["none", K("common.none")],
	["custom", K("opt.ribbonSep.custom")]
], jg = (e) => e.color || (e.variant === "plain" ? "text" : "accent-text"), Mg = (e) => `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">${e}</svg>`, Ng = {
	dot: Mg("<circle cx=\"12\" cy=\"12\" r=\"3\"/>"),
	dash: Mg("<rect x=\"3\" y=\"10.6\" width=\"18\" height=\"2.8\" rx=\"1.4\"/>"),
	slash: Mg("<path d=\"M15.5 3.5L8.5 20.5\" stroke=\"currentColor\" stroke-width=\"2.6\" stroke-linecap=\"round\" fill=\"none\"/>"),
	star: Mg("<path d=\"M12 2.8l2.3 6.1 6.5.4-5 4.1 1.6 6.3-5.4-3.5-5.4 3.5 1.6-6.3-5-4.1 6.5-.4z\"/>"),
	none: Mg("<path d=\"M5 12h14\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" fill=\"none\" opacity=\"0.35\"/><path d=\"M6 6l12 12\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" fill=\"none\"/>"),
	custom: Mg("<path d=\"M5 8h14M5 12h9M5 16h12\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" fill=\"none\"/>")
}, Pg = () => [
	["line", K("shape.line")],
	["arrow", K("shape.arrow")],
	["circle", K("shape.circle")],
	["rect", K("shape.rect")],
	["triangle", K("shape.triangle")]
], Fg = () => [
	["accent", K("color.accent")],
	["text", K("color.text")],
	["surface", K("color.surface")],
	["bg", K("color.bg")]
], Ig = [
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
//#endregion
//#region src/lib/menu-search.js
function Lg(e, t, n = "", r = /* @__PURE__ */ new Set()) {
	let i = null;
	for (let a of e ?? []) {
		if (a.kind === "rule") {
			i = null;
			continue;
		}
		if (a.kind === "heading") {
			i = a;
			continue;
		}
		let e = i ? `${n} ${i.text}` : n, o = r.size;
		if (a.kind === "group") {
			if (Lg(a.children, t, `${e} ${a.text}`, r), r.size > o) {
				r.add(a);
				for (let e of a.children ?? []) e.kind === "row" && !e.text.trim() && r.add(e);
			}
		} else t(`${e} ${a.text}`) && r.add(a);
		i && r.size > o && r.add(i);
	}
	return r;
}
var Rg = "button, select, textarea, svg, [popover], .dd, .gridmenu-value, .menu-group-value", zg = ".row-tool, .cp-clear, [popover] *";
function Bg(e) {
	let t = [], n = (e) => {
		for (let r of e.childNodes) r.nodeType === 3 ? t.push(r.data) : r.nodeType === 1 && !r.matches(Rg) && n(r);
	};
	n(e);
	let r = e.getAttribute("title");
	r && t.push(r);
	for (let n of e.querySelectorAll("[title]")) n.matches(zg) || t.push(n.getAttribute("title"));
	return t.join(" ").replace(/\s+/g, " ").trim();
}
function Vg(e, t = "") {
	let n = [];
	for (let r of e.children) if (!(t && r.matches(t))) {
		if (r.tagName === "DETAILS") {
			let e = r.querySelector(":scope > summary"), t = r.querySelector(":scope > .group-items") ?? r;
			n.push({
				kind: "group",
				el: r,
				text: e ? Bg(e) : "",
				children: Vg(t, "summary")
			});
		} else r.tagName === "HR" ? n.push({
			kind: "rule",
			el: r,
			text: ""
		}) : r.matches(".panel-strong, .mini-label") ? n.push({
			kind: "heading",
			el: r,
			text: Bg(r)
		}) : n.push({
			kind: "row",
			el: r,
			text: Bg(r)
		});
	}
	return n;
}
function Hg(e, t) {
	for (let n of e.children) {
		let e = Vg(n, ".emenu-title, .emenu-none"), r = Lg(e, t), i = (e) => {
			for (let t of e) t.el.classList.toggle("menu-miss", !r.has(t)), t.kind === "group" && (r.has(t) && (t.el.open = !0), i(t.children));
		};
		i(e), n.classList.toggle("menu-empty", !e.some((e) => r.has(e)));
	}
}
function Ug(e, t) {
	return (n) => {
		let r = () => Hg(n, (n) => t(n, e));
		r();
		let i = new MutationObserver(r);
		return i.observe(n, {
			childList: !0,
			subtree: !0,
			characterData: !0
		}), () => i.disconnect();
	};
}
//#endregion
//#region src/menu/MenuGroup.svelte
var Wg = /* @__PURE__ */ L("<i class=\"menu-group-dot\" aria-hidden=\"true\"></i>"), Gg = /* @__PURE__ */ L("<button type=\"button\" class=\"linkish menu-group-reset\"> </button>"), Kg = /* @__PURE__ */ L("<details class=\"group menu-group\"><summary><!><span class=\"menu-group-title\"> </span><span class=\"menu-group-value\"> </span></summary> <div class=\"group-items\"><!> <!></div></details>");
function qg(e, t) {
	at(t, !0);
	let n = ra(t, "reset", 3, null), r = ra(t, "group", 3, null);
	ra(t, "defaultOpen", 3, !1)() && !_g.has(t.id) && (_g.add(t.id), gg.add(t.id));
	let i = /* @__PURE__ */ D(() => r() ? r().reset : n());
	it("menu-group", {
		own: (e) => !!r()?.own(e),
		resetKey: (e) => r()?.resetKey(e)
	});
	var a = Kg(), o = A(a), s = A(o), c = (e) => {
		R(e, Wg());
	};
	B(s, (e) => {
		F(i) && e(c);
	});
	var l = N(s), u = M(l, !0), d = M(N(l), !0);
	E(o);
	var f = N(o, 2), p = A(f);
	_i(p, () => t.children);
	var m = N(p, 2), h = (e) => {
		var t = Gg(), n = M(t, !0);
		P((e) => z(n, e), [() => K("menu.reset")]), I("click", t, function(...e) {
			F(i)?.apply(this, e);
		}), R(e, t);
	};
	B(m, (e) => {
		F(i) && e(h);
	}), E(f), E(a), P((e) => {
		a.open = e, z(u, t.title), z(d, t.value);
	}, [() => gg.has(t.id)]), Br("toggle", a, (e) => {
		e.currentTarget.closest(".emenu-search") || (e.currentTarget.open ? gg.add(t.id) : gg.delete(t.id));
	}), R(e, a), ot();
}
Vr(["click"]);
//#endregion
//#region src/menu/Placement.svelte
var Jg = /* @__PURE__ */ L("<div class=\"frame-grid\"><label> <input type=\"number\"/></label> <label> <input type=\"number\"/></label></div>"), Yg = /* @__PURE__ */ L("<div class=\"ctl-row\"><span class=\"mini-label\"> </span> <input type=\"range\"/> <span class=\"gridmenu-value\"> </span> <!></div> <!>", 1), Xg = /* @__PURE__ */ L("<div class=\"ctl-row\"><span class=\"mini-label\"> </span> <input type=\"range\" min=\"1\" max=\"100\" step=\"1\"/> <span class=\"gridmenu-value\"> </span></div>"), Zg = /* @__PURE__ */ L("<div class=\"pin-line\"><label> <!></label> <!></div> <!>", 1), Qg = /* @__PURE__ */ L("<label> <input type=\"number\" min=\"100\" max=\"4000\" step=\"100\"/></label> <label> <input type=\"number\" min=\"0\" max=\"4000\" step=\"100\"/></label>", 1), $g = /* @__PURE__ */ L("<label> <!></label> <!> <label> <!></label>", 1), e_ = /* @__PURE__ */ L("<label> <input type=\"number\" min=\"0\" max=\"400\"/></label>"), t_ = /* @__PURE__ */ L("<label> <!></label>"), n_ = /* @__PURE__ */ L("<label> <!></label> <!> <!>", 1), r_ = /* @__PURE__ */ L("<label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!>", 1), i_ = /* @__PURE__ */ L("<div class=\"frame-grid\"><label> <input type=\"number\" step=\"0.5\"/></label> <label> <input type=\"number\" step=\"1\"/></label> <label> <input type=\"number\" step=\"0.5\" min=\"1\"/></label> <label> <input type=\"number\" step=\"1\" min=\"1\"/></label> <label> <input type=\"number\" step=\"1\"/></label> <label> <input type=\"number\" step=\"1\"/></label></div>"), a_ = /* @__PURE__ */ L("<button type=\"button\" class=\"setting-reset\"></button>"), o_ = /* @__PURE__ */ L("<div><i class=\"setting-dot\" aria-hidden=\"true\"></i> <div class=\"setting-body\"><span class=\"mini-label\"> </span> <span class=\"setting-source\"> </span></div> <!></div>"), s_ = /* @__PURE__ */ L("<!> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label>", 1), c_ = /* @__PURE__ */ L("<label> <!></label> <!>", 1), l_ = /* @__PURE__ */ L("<!> <!> <!> <div class=\"pin-line\"><label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!></div> <!> <!> <!>", 1);
function u_(e, t) {
	at(t, !0);
	let n = (e) => {
		var t = Yg(), n = j(t), r = A(n), i = M(r, !0), a = N(r, 2);
		U(a);
		var o = N(a, 2), l = M(o);
		Cg(N(o, 2), { id: "size" }), E(n);
		var u = N(n, 2), d = (e) => {
			var t = Jg(), n = A(t), r = A(n, !0), i = N(r);
			U(i), E(n);
			var a = N(n, 2), o = A(a, !0), s = N(o);
			U(s), E(a), E(t), P((e, t, c, l, u, d, f, p) => {
				G(n, "title", e), z(r, t), G(i, "min", oc.min), G(i, "max", oc.max), W(i, c), G(i, "placeholder", l), G(a, "title", u), z(o, d), G(s, "min", oc.min), G(s, "max", oc.max), W(s, f), G(s, "placeholder", p);
			}, [
				() => K("tip.scaleMin"),
				() => K("lbl.scaleMin"),
				() => dc(F(c)).min ?? "",
				() => String(Math.round(lc(F(c)) * cc(F(c)))),
				() => K("tip.scaleMax"),
				() => K("lbl.scaleMax"),
				() => dc(F(c)).max ?? "",
				() => String(Math.round(lc(F(c)) * cc(F(c))))
			]), I("change", i, (e) => g("sizeMin", e.target.value)), I("change", s, (e) => g("sizeMax", e.target.value)), R(e, t);
		}, f = /* @__PURE__ */ D(() => cc(F(c)) !== 1);
		B(u, (e) => {
			F(f) && e(d);
		}), P((e, t, r, o, s, c, u, d) => {
			G(n, "title", e), z(i, t), G(a, "min", r), G(a, "max", o), G(a, "step", s), W(a, c), G(a, "aria-label", u), z(l, `${d ?? ""} %`);
		}, [
			() => K("tip.scale"),
			() => K("lbl.scale"),
			() => Math.round(uc(F(c)).min * 100),
			() => Math.round(uc(F(c)).max * 100),
			() => Math.round(ac.step * 100),
			() => Math.round(cc(F(c)) * 100),
			() => K("lbl.scale"),
			() => Math.round(cc(F(c)) * 100)
		]), I("input", a, (e) => h(e.target.valueAsNumber / 100)), I("change", a, function(...e) {
			s.endSizeGesture?.apply(this, e);
		}), R(e, t);
	}, r = (e) => {
		var t = Zg(), n = j(t), r = A(n), i = A(r), a = N(i);
		{
			let e = /* @__PURE__ */ D(() => F(c).fit ?? "wrap"), t = /* @__PURE__ */ D(() => rc.has(F(c).type) ? [["wrap", K("opt.fit.fluid")], ["shrink", K("opt.fit.floor")]] : [
				["wrap", K("opt.fit.wrap")],
				...ne() || F(c).fit === "shrink" ? [["shrink", K("opt.fit.shrink")]] : [],
				["both", K("opt.fit.both")]
			]);
			J(a, {
				get value() {
					return F(e);
				},
				get options() {
					return F(t);
				},
				onchange: (e) => p(e)
			});
		}
		E(r), Cg(N(r, 2), { id: "fit" }), E(n);
		var o = N(n, 2), s = (e) => {
			var t = Xg(), n = A(t), r = M(n, !0), i = N(n, 2);
			U(i);
			var a = M(N(i, 2));
			E(t), P((e, n, o, s) => {
				G(t, "title", e), z(r, n), W(i, o), z(a, `${s ?? ""} %`);
			}, [
				() => K("tip.fitMin"),
				() => K("lbl.fitMin"),
				() => Math.round((F(c).fitMin ?? .6) * 100),
				() => Math.round((F(c).fitMin ?? .6) * 100)
			]), I("input", i, (e) => m(e.target.valueAsNumber / 100)), R(e, t);
		};
		B(o, (e) => {
			F(c).fit && e(s);
		}), P((e, t) => {
			G(r, "title", e), z(i, `${t ?? ""} `);
		}, [() => K("tip.fit"), () => K("lbl.fit")]), R(e, t);
	}, i = (e) => {
		var t = $g(), n = j(t), r = A(n), i = N(r);
		{
			let e = /* @__PURE__ */ D(() => ee(F(c).animation) ? F(c).animation.type : ""), t = /* @__PURE__ */ D(T);
			J(i, {
				get value() {
					return F(e);
				},
				get options() {
					return F(t);
				},
				onchange: (e) => S(e || null)
			});
		}
		E(n);
		var a = N(n, 2), o = (e) => {
			var t = Qg(), n = j(t), r = A(n), i = N(r);
			U(i), E(n);
			var a = N(n, 2), o = A(a), s = N(o);
			U(s), E(a), P((e, t) => {
				z(r, `${e ?? ""} `), W(i, F(c).animation.props.duration), z(o, `${t ?? ""} `), W(s, F(c).animation.props.delay);
			}, [() => K("lbl.durationMs"), () => K("lbl.delayMs")]), I("change", i, (e) => w("duration", Number(e.target.value))), I("change", s, (e) => w("delay", Number(e.target.value))), R(e, t);
		}, s = /* @__PURE__ */ D(() => ee(F(c).animation));
		B(a, (e) => {
			F(s) && e(o);
		});
		var l = N(a, 2), u = A(l), d = N(u);
		{
			let e = /* @__PURE__ */ D(() => F(c).hover?.type ?? (F(c).animation && !ee(F(c).animation) ? F(c).animation.type : "")), t = /* @__PURE__ */ D(te);
			J(d, {
				get value() {
					return F(e);
				},
				get options() {
					return F(t);
				},
				onchange: (e) => C(e || null)
			});
		}
		E(l), P((e, t, i, a) => {
			G(n, "title", e), z(r, `${t ?? ""} `), G(l, "title", i), z(u, `${a ?? ""} `);
		}, [
			() => K("tip.props.blockAnim"),
			() => K("lbl.animIn"),
			() => K("tip.props.blockHover"),
			() => K("lbl.onHover")
		]), R(e, t);
	}, a = (e) => {
		var t = Xr(), n = j(t), r = (e) => {
			var t = r_(), n = j(t), r = A(n);
			U(r);
			var i = N(r);
			E(n);
			var a = N(n, 2), o = (e) => {
				var t = n_(), n = j(t), r = A(n), i = N(r);
				{
					let e = /* @__PURE__ */ D(() => F(c).sticky.mode ?? "scroll"), t = /* @__PURE__ */ D(() => [["scroll", K("opt.sticky.modeScroll")], ["screen", K("opt.sticky.modeScreen")]]);
					J(i, {
						get value() {
							return F(e);
						},
						get options() {
							return F(t);
						},
						onchange: (e) => d(`edit:${F(c).blockId}`, (t) => {
							t.sticky = {
								...t.sticky,
								mode: e
							};
						})
					});
				}
				E(n);
				var a = N(n, 2), o = (e) => {
					var t = e_(), n = A(t), r = N(n);
					U(r), E(t), P((e, i) => {
						G(t, "title", e), z(n, `${i ?? ""} `), W(r, F(c).sticky.offset ?? 16);
					}, [() => F(c).sticky.mode === "screen" ? K("tip.stickyEdge") : K("tip.stickyOffset"), () => F(c).sticky.mode === "screen" ? K("lbl.stickyEdge") : K("lbl.stickyOffset")]), I("change", r, (e) => d(`edit:${F(c).blockId}`, (t) => {
						t.sticky = {
							...t.sticky,
							offset: Math.max(0, Number(e.target.value) || 0)
						};
					})), R(e, t);
				};
				B(a, (e) => {
					(F(c).sticky.mode !== "screen" || (F(c).sticky.dock ?? "bottom-right") !== "middle-center") && e(o);
				});
				var s = N(a, 2), l = (e) => {
					var t = t_(), n = A(t), r = N(n);
					{
						let e = /* @__PURE__ */ D(() => F(c).sticky.dock ?? "bottom-right"), t = /* @__PURE__ */ D(() => Ig.map(([e, t]) => [e, K(t)]));
						J(r, {
							get value() {
								return F(e);
							},
							get options() {
								return F(t);
							},
							onchange: (e) => d(`edit:${F(c).blockId}`, (t) => {
								t.sticky = {
									...t.sticky,
									dock: e
								};
							})
						});
					}
					E(t), P((e, r) => {
						G(t, "title", e), z(n, `${r ?? ""} `);
					}, [() => K("tip.stickyDock"), () => K("lbl.stickyDock")]), R(e, t);
				}, u = (e) => {
					var t = t_(), n = A(t), r = N(n);
					{
						let e = /* @__PURE__ */ D(() => F(c).sticky.until ?? ""), t = /* @__PURE__ */ D(oe);
						J(r, {
							get value() {
								return F(e);
							},
							get options() {
								return F(t);
							},
							onchange: (e) => d(`edit:${F(c).blockId}`, (t) => {
								t.sticky = {
									...t.sticky,
									until: e || null
								};
							})
						});
					}
					E(t), P((e, r) => {
						G(t, "title", e), z(n, `${r ?? ""} `);
					}, [() => K("tip.stickyUntil"), () => K("lbl.stickyUntil")]), R(e, t);
				};
				B(s, (e) => {
					F(c).sticky.mode === "screen" ? e(l) : e(u, -1);
				}), P((e, t) => {
					G(n, "title", e), z(r, `${t ?? ""} `);
				}, [() => K("tip.stickyMode"), () => K("lbl.stickyMode")]), R(e, t);
			};
			B(a, (e) => {
				F(c).sticky && e(o);
			}), P((e, t, a) => {
				G(n, "title", e), Vi(r, t), z(i, ` ${a ?? ""}`);
			}, [
				() => K("tip.sticky"),
				() => !!F(c).sticky,
				() => K("lbl.sticky")
			]), I("change", r, (e) => d(`edit:${F(c).blockId}`, (t) => {
				t.sticky = e.target.checked ? {
					offset: 16,
					until: null
				} : null;
			})), R(e, t);
		};
		B(n, (e) => {
			F(l) === "desktop" && e(r);
		}), R(e, t);
	}, o = (e) => {
		var t = s_(), n = j(t), r = (e) => {
			var t = i_(), n = A(t), r = A(n, !0), i = N(r);
			U(i), E(n);
			var a = N(n, 2), o = A(a, !0), s = N(o);
			U(s), E(a);
			var l = N(a, 2), u = A(l, !0), d = N(u);
			U(d), E(l);
			var p = N(l, 2), m = A(p, !0), h = N(m);
			U(h), E(p);
			var g = N(p, 2), _ = A(g, !0), v = N(_);
			U(v), E(g);
			var y = N(g, 2), b = A(y, !0), x = N(b);
			U(x), E(y), E(t), P((e, t, n, a, l, f, p) => {
				z(r, e), W(i, F(c).frame.x), z(o, t), W(s, F(c).frame.y), z(u, n), W(d, F(c).frame.w), z(m, a), W(h, F(c).frame.h), G(g, "title", l), z(_, f), W(v, F(c).frame.z ?? 1), z(b, p), W(x, F(c).frame.rot ?? 0);
			}, [
				() => K("frame.x"),
				() => K("frame.y"),
				() => K("frame.w"),
				() => K("frame.h"),
				() => K("tip.frameZ"),
				() => K("frame.z"),
				() => K("frame.rot")
			]), I("change", i, (e) => f("x", Number(e.target.value))), I("change", s, (e) => f("y", Number(e.target.value))), I("change", d, (e) => f("w", Number(e.target.value))), I("change", h, (e) => f("h", Number(e.target.value))), I("change", v, (e) => f("z", Number(e.target.value))), I("change", x, (e) => f("rot", Number(e.target.value))), R(e, t);
		}, i = (e) => {
			let t = /* @__PURE__ */ D(() => F(c).mobileRow !== null);
			var n = o_();
			let r;
			var i = N(A(n), 2), a = A(i), o = M(a, !0), s = M(N(a, 2), !0);
			E(i);
			var l = N(i, 2), u = (e) => {
				var t = a_();
				V(t, () => ie, !0), E(t), P((e, n) => {
					G(t, "title", e), G(t, "aria-label", n);
				}, [() => K("menu.resetPhone"), () => K("menu.resetPhone")]), I("click", t, () => re({
					sectionId: F(c).sectionId,
					blockId: F(c).blockId
				})), R(e, t);
			};
			B(l, (e) => {
				F(t) && e(u);
			}), E(n), P((e, i) => {
				r = H(n, 1, "setting", null, r, { own: F(t) }), z(o, e), z(s, i);
			}, [() => K("lbl.phonePlacement"), () => F(t) ? K("menu.phoneRow", { n: F(c).mobileRow + 1 }) : K("menu.followsDesktop", { v: K("menu.phoneFlow") })]), R(e, n);
		};
		B(n, (e) => {
			F(l) === "desktop" ? e(r) : e(i, -1);
		});
		var a = N(n, 2), o = A(a);
		U(o);
		var s = N(o);
		E(a), P((e, t) => {
			G(a, "title", e), Vi(o, F(c).decor), z(s, ` ${t ?? ""}`);
		}, [() => K("tip.decor"), () => K("lbl.decor")]), I("change", o, (e) => x(e.target.checked)), R(e, t);
	}, s = rt("urd-editor"), c = /* @__PURE__ */ D(() => s.selectedBlock), l = /* @__PURE__ */ D(() => s.viewMode), u = /* @__PURE__ */ D(() => s.sections), { mutateBlock: d, setBlockFrame: f, setBlockFit: p, setBlockFitMin: m, setBlockSize: h, setBlockSizeBound: g, setBlockHeightMode: _, setBlockHeightAlign: v, canStretch: y, setBlockHideMobile: b, setBlockDecor: x, setBlockAnimation: S, setBlockHover: C, setBlockAnimProp: w, isEntrance: ee, blockEntranceOptions: T, hoverOptions: te, designWidth: ne, handleMobileReset: re } = s, ie = "<svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 12a9 9 0 103-6.7\"/><path d=\"M3 4v5h5\"/></svg>";
	function ae() {
		let e = ee(F(c).animation) ? F(c).animation.type : F(c).hover?.type, t = e ? [...T(), ...te()].find(([t]) => t === e) : null;
		return t ? t[1] : K("common.none");
	}
	function oe() {
		let e = F(u).findIndex((e) => e.id === F(c)?.sectionId);
		return e < 0 ? [["", K("opt.sticky.ownSection")]] : [["", K("opt.sticky.ownSection")], ...F(u).slice(e + 1).map((t, n) => [t.id, K("opt.sticky.atSection", { n: e + 2 + n })])];
	}
	var se = l_(), ce = j(se), le = (e) => {
		var t = c_(), n = j(t), r = A(n), i = N(r);
		{
			let e = /* @__PURE__ */ D(() => F(c).height?.mode === "own" ? "own" : "content"), t = /* @__PURE__ */ D(() => [["content", K("opt.height.content")], ["own", K("opt.height.own")]]);
			J(i, {
				get value() {
					return F(e);
				},
				get options() {
					return F(t);
				},
				onchange: (e) => _(e)
			});
		}
		E(n);
		var a = N(n, 2), o = (e) => {
			let t = /* @__PURE__ */ D(() => [
				"middle",
				"bottom",
				"stretch"
			].includes(F(c).height.align) ? F(c).height.align : "top");
			var n = t_(), r = A(n), i = N(r);
			{
				let e = /* @__PURE__ */ D(() => [
					["top", K("opt.heightAlign.top")],
					["middle", K("opt.heightAlign.middle")],
					["bottom", K("opt.heightAlign.bottom")],
					...y() || F(t) === "stretch" ? [["stretch", K("opt.heightAlign.stretch")]] : []
				]);
				J(i, {
					get value() {
						return F(t);
					},
					get options() {
						return F(e);
					},
					onchange: (e) => v(e)
				});
			}
			E(n), P((e, t) => {
				G(n, "title", e), z(r, `${t ?? ""} `);
			}, [() => K("tip.heightAlign"), () => K("lbl.heightAlign")]), R(e, n);
		};
		B(a, (e) => {
			F(c).height?.mode === "own" && e(o);
		}), P((e, t) => {
			G(n, "title", e), z(r, `${t ?? ""} `);
		}, [() => K("tip.height"), () => K("lbl.height")]), R(e, t);
	}, ue = /* @__PURE__ */ D(() => $s.has(F(c).type));
	B(ce, (e) => {
		F(ue) && e(le);
	});
	var de = N(ce, 2), fe = (e) => {
		n(e);
	}, pe = /* @__PURE__ */ D(() => !ic.has(F(c).type));
	B(de, (e) => {
		F(pe) && e(fe);
	});
	var me = N(de, 2);
	r(me);
	var he = N(me, 2), ge = A(he), _e = A(ge);
	U(_e);
	var ve = N(_e);
	E(ge), Cg(N(ge, 2), { id: "phone" }), E(he);
	var ye = N(he, 2);
	a(ye);
	var be = N(ye, 2);
	{
		let e = /* @__PURE__ */ D(() => K("group.motion")), t = /* @__PURE__ */ D(ae);
		qg(be, {
			id: "motion",
			get title() {
				return F(e);
			},
			get value() {
				return F(t);
			},
			children: (e, t) => {
				i(e);
			},
			$$slots: { default: !0 }
		});
	}
	var xe = N(be, 2);
	{
		let e = /* @__PURE__ */ D(() => K("group.placement")), t = /* @__PURE__ */ D(() => F(l) === "desktop" ? `${F(c).frame.w} % × ${F(c).frame.h}` : "");
		qg(xe, {
			id: "frame",
			get title() {
				return F(e);
			},
			get value() {
				return F(t);
			},
			children: (e, t) => {
				o(e);
			},
			$$slots: { default: !0 }
		});
	}
	P((e, t) => {
		G(ge, "title", e), Vi(_e, F(c).hideMobile), z(ve, ` ${t ?? ""}`);
	}, [() => K("tip.hideMobile"), () => K("lbl.hideMobile")]), I("change", _e, (e) => b(e.target.checked)), R(e, se), ot();
}
Vr([
	"input",
	"change",
	"click"
]);
//#endregion
//#region src/menu/Setting.svelte
var d_ = /* @__PURE__ */ L("<span class=\"setting-source\"> </span>"), f_ = /* @__PURE__ */ L("<button type=\"button\" class=\"setting-reset\"></button>"), p_ = /* @__PURE__ */ L("<div><i class=\"setting-dot\" aria-hidden=\"true\"></i> <div class=\"setting-body\"><!> <!></div> <!></div>");
function m_(e, t) {
	at(t, !0);
	let n = rt("menu-group"), r = ra(t, "source", 3, "default"), i = ra(t, "shown", 3, null), a = /* @__PURE__ */ D(() => !!t.key && n?.own(t.key));
	var o = p_();
	let s;
	var c = N(A(o), 2), l = A(c);
	_i(l, () => t.children);
	var u = N(l, 2), d = (e) => {
		var t = d_(), n = M(t, !0);
		P((e) => z(n, e), [() => K(r() === "theme" ? "menu.sourceTheme" : "menu.sourceDefault", { v: i() })]), R(e, t);
	};
	B(u, (e) => {
		!F(a) && i() !== null && i() !== void 0 && e(d);
	}), E(c);
	var f = N(c, 2), p = (e) => {
		var i = f_();
		V(i, () => "<svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 12a9 9 0 103-6.7\"/><path d=\"M3 4v5h5\"/></svg>", !0), E(i), P((e, t) => {
			G(i, "title", e), G(i, "aria-label", t);
		}, [() => K(r() === "theme" ? "menu.resetTheme" : "menu.resetSetting"), () => K(r() === "theme" ? "menu.resetTheme" : "menu.resetSetting")]), I("click", i, () => n.resetKey(t.key)), R(e, i);
	};
	B(f, (e) => {
		F(a) && e(p);
	}), E(o), P(() => s = H(o, 1, "setting", null, s, { own: F(a) })), R(e, o), ot();
}
Vr(["click"]);
//#endregion
//#region src/menu/BoxStyle.svelte
var h_ = /* @__PURE__ */ L("<label> <!></label>"), g_ = /* @__PURE__ */ L("<label> <!></label> <label> <span class=\"num-stepper\"><button type=\"button\">−</button> <input type=\"number\" min=\"1\" max=\"12\" step=\"1\"/> <button type=\"button\">+</button></span></label>", 1), __ = /* @__PURE__ */ L("<label> <!></label> <label> <!></label> <!> <label> <!></label> <!> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label>", 1);
function v_(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock), { setBoxStyle: i, themeSwatches: a } = n, o = /* @__PURE__ */ D(() => F(r).props.boxStyle ?? {});
	var s = __(), c = j(s), l = A(c), u = N(l);
	{
		let e = /* @__PURE__ */ D(() => F(o).bg ?? ""), t = /* @__PURE__ */ D(a), n = /* @__PURE__ */ D(() => K("tip.box.bg"));
		sl(u, {
			get value() {
				return F(e);
			},
			get tokens() {
				return F(t);
			},
			allowClear: !0,
			get label() {
				return F(n);
			},
			onchange: (e) => i({ bg: e || null })
		});
	}
	E(c);
	var d = N(c, 2), f = A(d), p = N(f);
	{
		let e = /* @__PURE__ */ D(() => F(o).shadow ?? ""), t = /* @__PURE__ */ D(() => [
			["", K("common.none")],
			["soft", K("opt.shadow.soft")],
			["strong", K("opt.shadow.strong")]
		]);
		J(p, {
			get value() {
				return F(e);
			},
			get options() {
				return F(t);
			},
			onchange: (e) => i({ shadow: e || null })
		});
	}
	E(d);
	var m = N(d, 2), h = (e) => {
		var t = h_(), n = A(t), r = N(n);
		{
			let e = /* @__PURE__ */ D(() => F(o).shadowColor ?? ""), t = /* @__PURE__ */ D(a), n = /* @__PURE__ */ D(() => K("tip.box.shadowColor"));
			sl(r, {
				get value() {
					return F(e);
				},
				get tokens() {
					return F(t);
				},
				allowClear: !0,
				get label() {
					return F(n);
				},
				onchange: (e) => i({ shadowColor: e || null })
			});
		}
		E(t), P((e) => z(n, `${e ?? ""} `), [() => K("lbl.shadowColor")]), R(e, t);
	};
	B(m, (e) => {
		F(o).shadow && e(h);
	});
	var g = N(m, 2), _ = A(g), v = N(_);
	{
		let e = /* @__PURE__ */ D(() => F(o).border === "none" ? "none" : F(o).border ? "custom" : ""), t = /* @__PURE__ */ D(() => [
			["", K("opt.border.theme")],
			["none", K("common.none")],
			["custom", K("opt.border.custom")]
		]);
		J(v, {
			get value() {
				return F(e);
			},
			get options() {
				return F(t);
			},
			onchange: (e) => i({ border: e === "custom" ? {
				color: "accent",
				width: 1
			} : e || null })
		});
	}
	E(g);
	var y = N(g, 2), b = (e) => {
		let t = /* @__PURE__ */ D(() => typeof F(o).border == "object" ? F(o).border : {
			color: "text",
			width: 1
		});
		var n = g_(), r = j(n), s = A(r), c = N(s);
		{
			let e = /* @__PURE__ */ D(a), n = /* @__PURE__ */ D(() => K("tip.box.borderColor"));
			sl(c, {
				get value() {
					return F(t).color;
				},
				get tokens() {
					return F(e);
				},
				get label() {
					return F(n);
				},
				onchange: (e) => i({ border: {
					...F(t),
					color: e
				} })
			});
		}
		E(r);
		var l = N(r, 2), u = A(l), d = N(u), f = A(d), p = N(f, 2);
		U(p);
		var m = N(p, 2);
		E(d), E(l), P((e, n, r, i, a, o) => {
			z(s, `${e ?? ""} `), z(u, `${n ?? ""} `), G(f, "title", r), G(f, "aria-label", i), W(p, F(t).width), G(m, "title", a), G(m, "aria-label", o);
		}, [
			() => K("lbl.borderColor"),
			() => K("lbl.thicknessPx"),
			() => K("tip.thinner"),
			() => K("tip.thinner"),
			() => K("tip.thicker"),
			() => K("tip.thicker")
		]), I("click", f, () => i({ border: {
			...F(t),
			width: Math.max(1, F(t).width - 1)
		} })), I("change", p, (e) => i({ border: {
			...F(t),
			width: Math.min(12, Math.max(1, Number(e.target.value) || 1))
		} })), I("click", m, () => i({ border: {
			...F(t),
			width: Math.min(12, F(t).width + 1)
		} })), R(e, n);
	};
	B(y, (e) => {
		F(o).border !== "none" && e(b);
	});
	var x = N(y, 2), S = A(x);
	U(S);
	var C = N(S);
	E(x), P((e, t, n, r, i, a) => {
		z(l, `${e ?? ""} `), z(f, `${t ?? ""} `), z(_, `${n ?? ""} `), G(x, "title", r), Vi(S, i), z(C, ` ${a ?? ""}`);
	}, [
		() => K("lbl.blockColor"),
		() => K("lbl.shadow"),
		() => K("lbl.border"),
		() => K("tip.box.glass"),
		() => !!F(o).glass,
		() => K("lbl.glass")
	]), I("change", S, (e) => i({ glass: e.target.checked || null })), R(e, s), ot();
}
Vr(["click", "change"]);
//#endregion
//#region src/menu/groups.js
var y_ = (e, t) => JSON.stringify(e) === JSON.stringify(t);
function b_(e, t) {
	let n = (t) => Object.entries(t).filter(([t, n]) => e()[t] !== void 0 && !y_(e()[t], n));
	return {
		groupReset: (e, r) => n(r).length ? () => t(e, { ...r }) : null,
		groupChanged: (e) => n(e).length,
		groupOf: (r, i) => ({
			id: r,
			defaults: i,
			reset: n(i).length ? () => t(r, { ...i }) : null,
			own: (t) => t in i && e()[t] !== void 0 && !y_(e()[t], i[t]),
			resetKey: (e) => t(`${r}:${e}`, { [e]: i[e] })
		})
	};
}
//#endregion
//#region src/menu/families/Text.svelte
var x_ = /* @__PURE__ */ L("<p class=\"panel-hint\"> </p>"), S_ = /* @__PURE__ */ L("<div class=\"pin-line\"><label> <!></label> <!></div>"), C_ = /* @__PURE__ */ L("<div class=\"pin-line\"><label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!></div>"), w_ = /* @__PURE__ */ L("<!> <!>", 1);
function T_(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock), { setBlockProp: i, setBlockProps: a } = n, { groupChanged: o, groupOf: s } = b_(() => F(r).props, a);
	var c = Xr(), l = j(c), u = (e) => {
		var t = x_(), n = M(t, !0);
		P((e) => z(n, e), [() => K("hint.textInline")]), R(e, t);
	}, d = (e) => {
		let t = (e) => {
			m_(e, {
				key: "align",
				children: (e, t) => {
					var n = S_(), a = A(n), o = A(a), s = N(o);
					{
						let e = /* @__PURE__ */ D(() => F(r).props.align ?? "left"), t = /* @__PURE__ */ D(() => [
							["left", K("common.left")],
							["center", K("common.center")],
							["right", K("common.right")]
						]);
						J(s, {
							get value() {
								return F(e);
							},
							get options() {
								return F(t);
							},
							onchange: (e) => i("align", e)
						});
					}
					E(a), Cg(N(a, 2), { id: "align" }), E(n), P((e) => z(o, `${e ?? ""} `), [() => K("lbl.align")]), R(e, n);
				},
				$$slots: { default: !0 }
			});
		}, n = (e) => {
			var t = w_(), n = j(t);
			{
				let e = /* @__PURE__ */ D(() => K("common.off"));
				m_(n, {
					key: "box",
					get shown() {
						return F(e);
					},
					children: (e, t) => {
						var n = C_(), a = A(n), o = A(a);
						U(o);
						var s = N(o);
						E(a), Cg(N(a, 2), { id: "textBox" }), E(n), P((e, t) => {
							Vi(o, e), z(s, ` ${t ?? ""}`);
						}, [() => !!F(r).props.box, () => K("lbl.textBoxToggle")]), I("change", o, (e) => i("box", e.target.checked)), R(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			var a = N(n, 2), o = (e) => {
				v_(e, {});
			};
			B(a, (e) => {
				F(r).props.box && e(o);
			}), R(e, t);
		};
		var a = w_(), o = j(a);
		{
			let e = /* @__PURE__ */ D(() => K("lbl.align")), n = /* @__PURE__ */ D(() => ({
				left: K("common.left"),
				center: K("common.center"),
				right: K("common.right")
			})[F(r).props.align ?? "left"]), i = /* @__PURE__ */ D(() => s("text-align", { align: "left" }));
			qg(o, {
				id: "text-align",
				get title() {
					return F(e);
				},
				get value() {
					return F(n);
				},
				get group() {
					return F(i);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
		var c = N(o, 2);
		{
			let e = /* @__PURE__ */ D(() => K("group.textBox")), t = /* @__PURE__ */ D(() => F(r).props.box ? K("common.on") : K("common.off")), i = /* @__PURE__ */ D(() => s("text-box", {
				box: !1,
				boxStyle: null
			}));
			qg(c, {
				id: "text-box",
				get title() {
					return F(e);
				},
				get value() {
					return F(t);
				},
				get group() {
					return F(i);
				},
				children: (e, t) => {
					n(e);
				},
				$$slots: { default: !0 }
			});
		}
		R(e, a);
	};
	B(l, (e) => {
		t.area === "content" ? e(u) : t.area === "style" && e(d, 1);
	}), R(e, c), ot();
}
Vr(["change"]);
//#endregion
//#region src/menu/families/Button.svelte
var E_ = /* @__PURE__ */ L("<input/>"), D_ = /* @__PURE__ */ L("<label> <input/></label> <div class=\"pin-line\"><label> <!></label> <!></div> <!>", 1), O_ = /* @__PURE__ */ L("<div class=\"pin-line\"><label> <!></label> <!></div>");
function k_(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock), { setBlockProp: i, setBlockProps: a, buttonTargets: o, setButtonTarget: s } = n, { groupChanged: c, groupOf: l } = b_(() => F(r).props, a);
	var u = Xr(), d = j(u), f = (e) => {
		let t = (e) => {
			var t = D_(), n = j(t), a = A(n), c = N(a);
			U(c), E(n);
			var l = N(n, 2), u = A(l), d = A(u), f = N(d);
			{
				let e = /* @__PURE__ */ D(() => F(r).props.page ?? "__href"), t = /* @__PURE__ */ D(o);
				J(f, {
					get value() {
						return F(e);
					},
					get options() {
						return F(t);
					},
					get onchange() {
						return s;
					}
				});
			}
			E(u), Cg(N(u, 2), { id: "goesTo" }), E(l);
			var p = N(l, 2), m = (e) => {
				var t = E_();
				U(t), P((e) => {
					G(t, "placeholder", e), W(t, F(r).props.href === "#" ? "" : F(r).props.href ?? "");
				}, [() => K("ph.url")]), I("change", t, (e) => i("href", e.target.value || null)), R(e, t);
			};
			B(p, (e) => {
				F(r).props.page || e(m);
			}), P((e, t) => {
				z(a, `${e ?? ""} `), W(c, F(r).props.label), z(d, `${t ?? ""} `);
			}, [() => K("blocks.text"), () => K("lbl.goesTo")]), I("change", c, (e) => i("label", e.target.value)), R(e, t);
		};
		{
			let n = /* @__PURE__ */ D(() => K("group.textLink")), i = /* @__PURE__ */ D(() => o().find(([e]) => e === (F(r).props.page ?? "__href"))?.[1] ?? "");
			qg(e, {
				id: "btn-link",
				defaultOpen: !0,
				get title() {
					return F(n);
				},
				get value() {
					return F(i);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
	}, p = (e) => {
		let t = (e) => {
			m_(e, {
				key: "style",
				children: (e, t) => {
					var n = O_(), a = A(n), o = A(a), s = N(o);
					{
						let e = /* @__PURE__ */ D(() => [["primary", K("opt.btn.primary")], ["secondary", K("opt.btn.secondary")]]);
						J(s, {
							get value() {
								return F(r).props.style;
							},
							get options() {
								return F(e);
							},
							onchange: (e) => i("style", e)
						});
					}
					E(a), Cg(N(a, 2), { id: "btnStyle" }), E(n), P((e) => z(o, `${e ?? ""} `), [() => K("lbl.style")]), R(e, n);
				},
				$$slots: { default: !0 }
			});
		};
		{
			let n = /* @__PURE__ */ D(() => K("group.appearance")), i = /* @__PURE__ */ D(() => F(r).props.style === "secondary" ? K("opt.btn.secondary") : K("opt.btn.primary")), a = /* @__PURE__ */ D(() => l("btn-look", { style: "primary" }));
			qg(e, {
				id: "btn-look",
				defaultOpen: !0,
				get title() {
					return F(n);
				},
				get value() {
					return F(i);
				},
				get group() {
					return F(a);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
	};
	B(d, (e) => {
		t.area === "content" ? e(f) : t.area === "style" && e(p, 1);
	}), R(e, u), ot();
}
Vr(["change"]);
//#endregion
//#region src/menu/families/Image.svelte
var A_ = /* @__PURE__ */ L("<label class=\"ghost filepick\"> <input type=\"file\" accept=\"image/*\"/></label> <label> <input/></label>", 1), j_ = /* @__PURE__ */ L("<label> <input/></label>"), M_ = /* @__PURE__ */ L("<label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label>"), N_ = /* @__PURE__ */ L("<!> <!>", 1), P_ = /* @__PURE__ */ L("<div class=\"pin-line\"><label> <!></label> <!></div>"), F_ = /* @__PURE__ */ L("<!> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\"/> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\"/> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"1\" max=\"3\" step=\"0.01\"/> <button type=\"button\" class=\"linkish\"> </button>", 1), I_ = /* @__PURE__ */ L("<label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0.2\" max=\"2\" step=\"0.01\"/> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0.2\" max=\"2\" step=\"0.01\"/> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0\" max=\"2\" step=\"0.01\"/>", 1), L_ = /* @__PURE__ */ L("<!> <!> <!>", 1);
function R_(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock), { mutateBlock: i, setBlockProp: a, setBlockProps: o, openImageEditor: s, compressOrTrim: c, imageErrorText: l, setStatus: u } = n, { groupChanged: d, groupOf: f } = b_(() => F(r).props, o);
	async function p(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", t) try {
			let e = await c(t);
			i(`edit:${F(r).blockId}`, (n) => {
				n.props.src = e.dataUrl, n.props.alt = n.props.alt || zp(t.name).replaceAll("-", " ");
			});
		} catch (e) {
			u(l(e), "error");
		}
	}
	var m = Xr(), h = j(m), g = (e) => {
		let t = (e) => {
			var t = A_(), n = j(t), i = A(n), o = N(i);
			E(n);
			var s = N(n, 2), c = A(s), l = N(c);
			U(l), E(s), P((e, t, n) => {
				z(i, `${e ?? ""} `), z(c, `${t ?? ""} `), W(l, F(r).props.alt ?? ""), G(l, "placeholder", n);
			}, [
				() => K("ui.changeImage"),
				() => K("lbl.description"),
				() => K("ph.altText")
			]), I("change", o, p), I("change", l, (e) => a("alt", e.target.value)), R(e, t);
		}, n = (e) => {
			var t = N_(), n = j(t);
			m_(n, {
				key: "href",
				children: (e, t) => {
					var n = j_(), i = A(n), o = N(i);
					U(o), E(n), P((e, t) => {
						z(i, `${e ?? ""} `), W(o, F(r).props.href ?? ""), G(o, "placeholder", t);
					}, [() => K("lbl.link"), () => K("ph.optionalImageLink")]), I("change", o, (e) => a("href", e.target.value || null)), R(e, n);
				},
				$$slots: { default: !0 }
			});
			var i = N(n, 2), o = (e) => {
				{
					let t = /* @__PURE__ */ D(() => K("common.off"));
					m_(e, {
						key: "lightbox",
						get shown() {
							return F(t);
						},
						children: (e, t) => {
							var n = M_(), i = A(n);
							U(i);
							var o = N(i);
							E(n), P((e, t, r) => {
								G(n, "title", e), Vi(i, t), z(o, ` ${r ?? ""}`);
							}, [
								() => K("tip.lightbox"),
								() => !!F(r).props.lightbox,
								() => K("lbl.lightbox")
							]), I("change", i, (e) => a("lightbox", e.target.checked)), R(e, n);
						},
						$$slots: { default: !0 }
					});
				}
			};
			B(i, (e) => {
				F(r).props.href || e(o);
			}), R(e, t);
		};
		var i = N_(), o = j(i);
		{
			let e = /* @__PURE__ */ D(() => K("blocks.image")), n = /* @__PURE__ */ D(() => F(r).props.alt || K("menu.noAlt"));
			qg(o, {
				id: "img-image",
				get title() {
					return F(e);
				},
				get value() {
					return F(n);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
		var s = N(o, 2);
		{
			let e = /* @__PURE__ */ D(() => K("group.linkClick")), t = /* @__PURE__ */ D(() => F(r).props.href || (F(r).props.lightbox ? K("menu.lightboxShort") : K("common.none"))), i = /* @__PURE__ */ D(() => f("img-link", {
				href: null,
				lightbox: !1
			}));
			qg(s, {
				id: "img-link",
				get title() {
					return F(e);
				},
				get value() {
					return F(t);
				},
				get group() {
					return F(i);
				},
				children: (e, t) => {
					n(e);
				},
				$$slots: { default: !0 }
			});
		}
		R(e, i);
	}, _ = (e) => {
		let t = (e) => {
			var t = F_(), n = j(t);
			m_(n, {
				key: "fit",
				children: (e, t) => {
					var n = P_(), i = A(n), o = A(i), s = N(o);
					{
						let e = /* @__PURE__ */ D(() => F(r).props.fit ?? "cover"), t = /* @__PURE__ */ D(() => [["cover", K("opt.fitFrame.cover")], ["contain", K("opt.fitFrame.contain")]]);
						J(s, {
							get value() {
								return F(e);
							},
							get options() {
								return F(t);
							},
							onchange: (e) => a("fit", e)
						});
					}
					E(i), Cg(N(i, 2), { id: "imgFit" }), E(n), P((e) => z(o, `${e ?? ""} `), [() => K("lbl.imageFit")]), R(e, n);
				},
				$$slots: { default: !0 }
			});
			var i = N(n, 2), o = A(i), c = M(N(o));
			E(i);
			var l = N(i, 2);
			U(l);
			var u = N(l, 2), d = A(u), f = M(N(d));
			E(u);
			var p = N(u, 2);
			U(p);
			var m = N(p, 2), h = A(m), g = M(N(h));
			E(m);
			var _ = N(m, 2);
			U(_);
			var v = N(_, 2), y = M(v, !0);
			P((e, t, n, i, a, s, u, v) => {
				z(o, `${e ?? ""} `), z(c, `${t ?? ""}%`), W(l, F(r).props.x ?? .5), z(d, `${n ?? ""} `), z(f, `${i ?? ""}%`), W(p, F(r).props.y ?? .5), G(m, "title", a), z(h, `${s ?? ""} `), z(g, `${u ?? ""}x`), W(_, F(r).props.zoom ?? 1), z(y, v);
			}, [
				() => K("lbl.focusX"),
				() => Math.round((F(r).props.x ?? .5) * 100),
				() => K("lbl.focusY"),
				() => Math.round((F(r).props.y ?? .5) * 100),
				() => K("tip.zoomCrop"),
				() => K("lbl.zoom"),
				() => (F(r).props.zoom ?? 1).toFixed(2),
				() => K("ui.openImageEditor")
			]), I("input", l, (e) => a("x", Number(e.target.value))), I("input", p, (e) => a("y", Number(e.target.value))), I("input", _, (e) => a("zoom", Number(e.target.value))), I("click", v, s), R(e, t);
		}, n = (e) => {
			var t = I_(), n = j(t), i = A(n), o = M(N(i));
			E(n);
			var s = N(n, 2);
			U(s);
			var c = N(s, 2), l = A(c), u = M(N(l));
			E(c);
			var d = N(c, 2);
			U(d);
			var f = N(d, 2), p = A(f), m = M(N(p));
			E(f);
			var h = N(f, 2);
			U(h), P((e, t, n, a, c, f) => {
				z(i, `${e ?? ""} `), z(o, `${t ?? ""}%`), W(s, F(r).props.brightness ?? 1), z(l, `${n ?? ""} `), z(u, `${a ?? ""}%`), W(d, F(r).props.contrast ?? 1), z(p, `${c ?? ""} `), z(m, `${f ?? ""}%`), W(h, F(r).props.saturate ?? 1);
			}, [
				() => K("lbl.brightness"),
				() => Math.round((F(r).props.brightness ?? 1) * 100),
				() => K("lbl.contrast"),
				() => Math.round((F(r).props.contrast ?? 1) * 100),
				() => K("lbl.saturate"),
				() => Math.round((F(r).props.saturate ?? 1) * 100)
			]), I("input", s, (e) => a("brightness", Number(e.target.value))), I("input", d, (e) => a("contrast", Number(e.target.value))), I("input", h, (e) => a("saturate", Number(e.target.value))), R(e, t);
		}, i = (e) => {
			m_(e, {
				key: "radius",
				children: (e, t) => {
					var n = P_(), i = A(n), o = A(i), s = N(o);
					{
						let e = /* @__PURE__ */ D(() => F(r).props.radius ?? ""), t = /* @__PURE__ */ D(() => [
							["", K("common.none")],
							["sm", K("opt.size.sm")],
							["md", K("opt.radius.md")]
						]);
						J(s, {
							get value() {
								return F(e);
							},
							get options() {
								return F(t);
							},
							onchange: (e) => a("radius", e || null)
						});
					}
					E(i), Cg(N(i, 2), { id: "radius" }), E(n), P((e) => z(o, `${e ?? ""} `), [() => K("lbl.radius")]), R(e, n);
				},
				$$slots: { default: !0 }
			});
		}, o = /* @__PURE__ */ D(() => d({
			fit: "cover",
			x: .5,
			y: .5,
			zoom: 1
		})), c = /* @__PURE__ */ D(() => d({
			brightness: 1,
			contrast: 1,
			saturate: 1
		}));
		var l = L_(), u = j(l);
		{
			let e = /* @__PURE__ */ D(() => K("group.crop")), n = /* @__PURE__ */ D(() => F(o) ? K("menu.changed", { n: F(o) }) : K("menu.standard")), r = /* @__PURE__ */ D(() => f("img-crop", {
				fit: "cover",
				x: .5,
				y: .5,
				zoom: 1
			}));
			qg(u, {
				id: "img-crop",
				get title() {
					return F(e);
				},
				get value() {
					return F(n);
				},
				get group() {
					return F(r);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
		var p = N(u, 2);
		{
			let e = /* @__PURE__ */ D(() => K("group.filters")), t = /* @__PURE__ */ D(() => F(c) ? K("menu.changed", { n: F(c) }) : K("menu.standard")), r = /* @__PURE__ */ D(() => f("img-filters", {
				brightness: 1,
				contrast: 1,
				saturate: 1
			}));
			qg(p, {
				id: "img-filters",
				get title() {
					return F(e);
				},
				get value() {
					return F(t);
				},
				get group() {
					return F(r);
				},
				children: (e, t) => {
					n(e);
				},
				$$slots: { default: !0 }
			});
		}
		var m = N(p, 2);
		{
			let e = /* @__PURE__ */ D(() => K("group.corners")), t = /* @__PURE__ */ D(() => ({
				"": K("common.none"),
				sm: K("opt.size.sm"),
				md: K("opt.radius.md")
			})[F(r).props.radius ?? ""]), n = /* @__PURE__ */ D(() => f("img-corners", { radius: "md" }));
			qg(m, {
				id: "img-corners",
				get title() {
					return F(e);
				},
				get value() {
					return F(t);
				},
				get group() {
					return F(n);
				},
				children: (e, t) => {
					i(e);
				},
				$$slots: { default: !0 }
			});
		}
		R(e, l);
	};
	B(h, (e) => {
		t.area === "content" ? e(g) : t.area === "style" && e(_, 1);
	}), R(e, m), ot();
}
Vr([
	"change",
	"input",
	"click"
]);
//#endregion
//#region src/menu/families/Video.svelte
var z_ = /* @__PURE__ */ L("<label> </label> <input/>", 1), B_ = /* @__PURE__ */ L("<label class=\"ghost filepick\"> <input type=\"file\" accept=\"video/mp4,video/webm\"/></label> <label class=\"ghost filepick\"> <input type=\"file\" accept=\"image/*\"/></label>", 1), V_ = /* @__PURE__ */ L("<div class=\"pin-line\"><!> <!></div> <!>", 1), H_ = /* @__PURE__ */ L("<label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label>"), U_ = /* @__PURE__ */ L("<!> <!> <!>", 1), W_ = /* @__PURE__ */ L("<label> <input/></label>");
function G_(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock), { setBlockProp: i, setBlockProps: a, setBlockVideoFile: o, setBlockVideoPoster: s } = n, { groupChanged: c, groupOf: l } = b_(() => F(r).props, a);
	var u = Xr(), d = j(u), f = (e) => {
		let t = (e) => {
			var t = V_(), n = j(t), a = A(n);
			{
				let e = /* @__PURE__ */ D(() => K("lbl.videoSource")), t = /* @__PURE__ */ D(() => [["embed", K("opt.videoSource.embed")], ["file", K("opt.videoSource.file")]]);
				Wl(a, {
					get label() {
						return F(e);
					},
					get value() {
						return F(u);
					},
					get options() {
						return F(t);
					},
					onchange: (e) => i("source", e)
				});
			}
			Cg(N(a, 2), { id: "videoSource" }), E(n);
			var c = N(n, 2), l = (e) => {
				var t = z_(), n = j(t), a = M(n, !0), o = N(n, 2);
				U(o), P((e, t, i) => {
					G(n, "title", e), z(a, t), W(o, F(r).props.url ?? ""), G(o, "placeholder", i);
				}, [
					() => K("hint.video"),
					() => K("lbl.videoUrl"),
					() => K("ph.videoUrl")
				]), I("change", o, (e) => i("url", e.target.value)), R(e, t);
			}, d = (e) => {
				var t = B_(), n = j(t), i = A(n), a = N(i);
				E(n);
				var c = N(n, 2), l = A(c), u = N(l);
				E(c), P((e, t, r, a) => {
					G(n, "title", e), z(i, `${t ?? ""} `), G(c, "title", r), z(l, `${a ?? ""} `);
				}, [
					() => K("tip.video.file"),
					() => F(r).props.src ? K("ui.changeVideo") : K("ui.chooseVideo"),
					() => K("tip.bg.poster"),
					() => F(r).props.poster ? K("ui.changeImage") : K("ui.choosePoster")
				]), I("change", a, o), I("change", u, s), R(e, t);
			};
			B(c, (e) => {
				F(u) === "embed" ? e(l) : e(d, -1);
			}), R(e, t);
		}, n = (e) => {
			var t = U_(), n = j(t);
			{
				let e = /* @__PURE__ */ D(() => K("common.off"));
				m_(n, {
					key: "loop",
					get shown() {
						return F(e);
					},
					children: (e, t) => {
						var n = H_(), a = A(n);
						U(a);
						var o = N(a);
						E(n), P((e) => {
							Vi(a, F(r).props.loop === !0), z(o, ` ${e ?? ""}`);
						}, [() => K("lbl.videoLoop")]), I("change", a, (e) => i("loop", e.target.checked)), R(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			var o = N(n, 2);
			{
				let e = /* @__PURE__ */ D(() => K("common.off"));
				m_(o, {
					key: "muted",
					get shown() {
						return F(e);
					},
					children: (e, t) => {
						var n = H_(), i = A(n);
						U(i);
						var o = N(i);
						E(n), P((e) => {
							Vi(i, F(r).props.muted === !0), z(o, ` ${e ?? ""}`);
						}, [() => K("lbl.videoMuted")]), I("change", i, (e) => a("muted", e.target.checked ? { muted: !0 } : {
							muted: !1,
							autoplay: !1
						})), R(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			var s = N(o, 2), c = (e) => {
				{
					let t = /* @__PURE__ */ D(() => K("common.off"));
					m_(e, {
						key: "autoplay",
						get shown() {
							return F(t);
						},
						children: (e, t) => {
							var n = H_(), a = A(n);
							U(a);
							var o = N(a);
							E(n), P((e, t) => {
								G(n, "title", e), Vi(a, F(r).props.autoplay === !0), z(o, ` ${t ?? ""}`);
							}, [() => K("tip.video.autoplay"), () => K("lbl.videoAutoplay")]), I("change", a, (e) => i("autoplay", e.target.checked)), R(e, n);
						},
						$$slots: { default: !0 }
					});
				}
			};
			B(s, (e) => {
				F(r).props.muted === !0 && e(c);
			}), R(e, t);
		}, c = (e) => {
			var t = W_(), n = A(t), a = N(n);
			U(a), E(t), P((e) => {
				z(n, `${e ?? ""} `), W(a, F(r).props.title ?? "");
			}, [() => K("lbl.videoTitle")]), I("change", a, (e) => i("title", e.target.value)), R(e, t);
		}, u = /* @__PURE__ */ D(() => F(r).props.source === "file" ? "file" : "embed");
		var d = U_(), f = j(d);
		{
			let e = /* @__PURE__ */ D(() => K("lbl.videoSource")), n = /* @__PURE__ */ D(() => F(u) === "file" ? K("opt.videoSource.file") : K("opt.videoSource.embed"));
			qg(f, {
				id: "video-source",
				get title() {
					return F(e);
				},
				get value() {
					return F(n);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
		var p = N(f, 2), m = (e) => {
			let t = /* @__PURE__ */ D(() => [
				F(r).props.loop === !0,
				F(r).props.muted === !0,
				F(r).props.autoplay === !0
			].filter(Boolean).length);
			{
				let r = /* @__PURE__ */ D(() => K("group.playback")), i = /* @__PURE__ */ D(() => F(t) ? K("menu.onCount", { n: F(t) }) : K("common.off")), a = /* @__PURE__ */ D(() => l("video-play", {
					loop: !1,
					muted: !1,
					autoplay: !1
				}));
				qg(e, {
					id: "video-play",
					get title() {
						return F(r);
					},
					get value() {
						return F(i);
					},
					get group() {
						return F(a);
					},
					children: (e, t) => {
						n(e);
					},
					$$slots: { default: !0 }
				});
			}
		};
		B(p, (e) => {
			F(u) === "file" && e(m);
		});
		var h = N(p, 2);
		{
			let e = /* @__PURE__ */ D(() => K("group.accessibility")), t = /* @__PURE__ */ D(() => F(r).props.title || K("menu.noTitle"));
			qg(h, {
				id: "video-a11y",
				get title() {
					return F(e);
				},
				get value() {
					return F(t);
				},
				children: (e, t) => {
					c(e);
				},
				$$slots: { default: !0 }
			});
		}
		R(e, d);
	};
	B(d, (e) => {
		t.area === "content" && e(f);
	}), R(e, u), ot();
}
Vr(["change"]);
//#endregion
//#region src/menu/families/Icon.svelte
var K_ = /* @__PURE__ */ L("<input class=\"token-input\" maxlength=\"4\"/>"), q_ = /* @__PURE__ */ L("<button class=\"ghost\"> </button>"), J_ = /* @__PURE__ */ L("<span class=\"toolbar-row\"><img class=\"site-icon-preview\"/> <button class=\"ghost\"> </button></span>"), Y_ = /* @__PURE__ */ L("<label> <span class=\"toolbar-row\"><!> <!></span></label> <!>", 1), X_ = /* @__PURE__ */ L("<div class=\"pin-line\"><label> <input type=\"number\" min=\"8\" max=\"400\"/></label> <!></div>"), Z_ = /* @__PURE__ */ L("<div class=\"pin-line\"><label> <!></label> <!></div>"), Q_ = /* @__PURE__ */ L("<!> <!>", 1);
function $_(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock), { mutateBlock: i, setBlockProp: a, setBlockProps: o, themeSwatches: s } = n, { groupChanged: c, groupOf: l } = b_(() => F(r).props, o);
	var u = Xr(), d = j(u), f = (e) => {
		let t = (e) => {
			var t = Y_(), n = j(t), o = A(n), s = N(o), c = A(s);
			{
				let e = /* @__PURE__ */ D(() => F(r).props.glyph ?? "★"), t = /* @__PURE__ */ D(() => F(r).props.icon ?? null), n = /* @__PURE__ */ D(() => F(r).props.image ?? null);
				lm(c, {
					get value() {
						return F(e);
					},
					get icon() {
						return F(t);
					},
					get image() {
						return F(n);
					},
					onpick: (e) => i(`edit:${F(r).blockId}`, (t) => {
						t.props.glyph = e, t.props.icon = null, t.props.image = null;
					}),
					onicon: (e) => i(`edit:${F(r).blockId}`, (t) => {
						t.props.icon = e, t.props.image = null;
					}),
					onimage: (e) => a("image", e)
				});
			}
			var l = N(c, 2), u = (e) => {
				var t = K_();
				U(t), P((e) => {
					W(t, F(r).props.glyph ?? ""), G(t, "title", e);
				}, [() => K("tip.icon.typeGlyph")]), I("change", t, (e) => a("glyph", e.target.value || "★")), R(e, t);
			}, d = (e) => {
				var t = q_(), n = M(t, !0);
				P((e, r) => {
					G(t, "title", e), z(n, r);
				}, [() => K("tip.icon.backToGlyph"), () => K("ui.removeDrawnIcon")]), I("click", t, () => a("icon", null)), R(e, t);
			};
			B(l, (e) => {
				F(r).props.icon ? e(d, -1) : e(u);
			}), E(s), E(n);
			var f = N(n, 2), p = (e) => {
				var t = J_(), n = A(t), i = N(n, 2), o = M(i, !0);
				E(t), P((e, i, a) => {
					G(t, "title", e), G(n, "src", F(r).props.image), G(n, "alt", i), z(o, a);
				}, [
					() => K("hint.icon.ownImage"),
					() => K("gp.ownIcon"),
					() => K("ui.removeOwnIcon")
				]), I("click", i, () => a("image", null)), R(e, t);
			};
			B(f, (e) => {
				F(r).props.image && e(p);
			}), P((e) => z(o, `${e ?? ""} `), [() => K("blocks.icon")]), R(e, t);
		};
		{
			let n = /* @__PURE__ */ D(() => K("blocks.icon")), i = /* @__PURE__ */ D(() => F(r).props.image ? K("gp.ownIcon") : F(r).props.icon ? K("menu.drawnIcon") : F(r).props.glyph ?? "★");
			qg(e, {
				id: "icon-icon",
				defaultOpen: !0,
				get title() {
					return F(n);
				},
				get value() {
					return F(i);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
	}, p = (e) => {
		let t = (e) => {
			var t = Q_(), n = j(t);
			m_(n, {
				key: "size",
				shown: "48",
				children: (e, t) => {
					var n = X_(), i = A(n), o = A(i), s = N(o);
					U(s), E(i), Cg(N(i, 2), { id: "iconSize" }), E(n), P((e) => {
						z(o, `${e ?? ""} `), W(s, F(r).props.size ?? 48);
					}, [() => K("lbl.sizePx")]), I("change", s, (e) => a("size", Number(e.target.value))), R(e, n);
				},
				$$slots: { default: !0 }
			}), m_(N(n, 2), {
				key: "color",
				children: (e, t) => {
					var n = Z_(), i = A(n), o = A(i), c = N(o);
					{
						let e = /* @__PURE__ */ D(() => F(r).props.color ?? "accent"), t = /* @__PURE__ */ D(s);
						sl(c, {
							get value() {
								return F(e);
							},
							get tokens() {
								return F(t);
							},
							onchange: (e) => a("color", e)
						});
					}
					E(i), Cg(N(i, 2), { id: "iconColor" }), E(n), P((e, t) => {
						G(i, "title", e), z(o, `${t ?? ""} `);
					}, [() => K("hint.icon.color"), () => K("lbl.color")]), R(e, n);
				},
				$$slots: { default: !0 }
			}), R(e, t);
		};
		{
			let n = /* @__PURE__ */ D(() => K("group.appearance")), i = /* @__PURE__ */ D(() => `${F(r).props.size ?? 48} px`), a = /* @__PURE__ */ D(() => l("icon-look", {
				size: 48,
				color: "accent"
			}));
			qg(e, {
				id: "icon-look",
				defaultOpen: !0,
				get title() {
					return F(n);
				},
				get value() {
					return F(i);
				},
				get group() {
					return F(a);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
	};
	B(d, (e) => {
		t.area === "content" ? e(f) : t.area === "style" && e(p, 1);
	}), R(e, u), ot();
}
Vr(["change", "click"]);
//#endregion
//#region src/menu/families/Shape.svelte
var ev = /* @__PURE__ */ L("<label> <input/></label>"), tv = /* @__PURE__ */ L("<label> <!></label> <!>", 1), nv = /* @__PURE__ */ L("<div class=\"pin-line\"><label> <!></label> <!></div>"), rv = /* @__PURE__ */ L("<div class=\"pin-line\"><label> <input type=\"number\" min=\"1\" max=\"40\"/></label> <!></div>"), iv = /* @__PURE__ */ L("<label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label>"), av = /* @__PURE__ */ L("<!> <!> <!>", 1), ov = /* @__PURE__ */ L("<label> <input type=\"number\" min=\"4\" step=\"1\"/></label>"), sv = /* @__PURE__ */ L("<label> <input type=\"number\" min=\"1\" step=\"0.5\"/></label>"), cv = /* @__PURE__ */ L("<!> <!>", 1);
function lv(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock), { setBlockProp: i, setBlockProps: a, setBlockFrame: o, designWidth: s, shapePx: c, setShapeSizePx: l } = n, { groupChanged: u, groupOf: d } = b_(() => F(r).props, a);
	var f = Xr(), p = j(f), m = (e) => {
		let t = (e) => {
			var t = tv(), n = j(t), a = A(n), o = N(a);
			{
				let e = /* @__PURE__ */ D(Pg);
				J(o, {
					get value() {
						return F(r).props.kind;
					},
					get options() {
						return F(e);
					},
					onchange: (e) => i("kind", e)
				});
			}
			E(n);
			var s = N(n, 2), c = (e) => {
				var t = ev(), n = A(t), a = N(n);
				U(a), E(t), P((e, i) => {
					G(t, "title", e), z(n, `${i ?? ""} `), W(a, F(r).props.label ?? "");
				}, [() => K("tip.shape.label"), () => K("lbl.shapeLabel")]), I("change", a, (e) => i("label", e.target.value.trim() || void 0)), R(e, t);
			};
			B(s, (e) => {
				F(r).props.kind === "line" && e(c);
			}), P((e) => z(a, `${e ?? ""} `), [() => K("blocks.shape")]), R(e, t);
		};
		{
			let n = /* @__PURE__ */ D(() => K("blocks.shape")), i = /* @__PURE__ */ D(() => Pg().find(([e]) => e === F(r).props.kind)?.[1] ?? "");
			qg(e, {
				id: "shape-shape",
				defaultOpen: !0,
				get title() {
					return F(n);
				},
				get value() {
					return F(i);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
	}, h = (e) => {
		let t = (e) => {
			var t = av(), n = j(t);
			m_(n, {
				key: "color",
				children: (e, t) => {
					var n = nv(), a = A(n), o = A(a), s = N(o);
					{
						let e = /* @__PURE__ */ D(Fg);
						J(s, {
							get value() {
								return F(r).props.color;
							},
							get options() {
								return F(e);
							},
							onchange: (e) => i("color", e)
						});
					}
					E(a), Cg(N(a, 2), { id: "shapeColor" }), E(n), P((e) => z(o, `${e ?? ""} `), [() => K("lbl.color")]), R(e, n);
				},
				$$slots: { default: !0 }
			});
			var a = N(n, 2);
			m_(a, {
				key: "thickness",
				shown: "2",
				children: (e, t) => {
					var n = rv(), a = A(n), o = A(a), s = N(o);
					U(s), E(a), Cg(N(a, 2), { id: "thickness" }), E(n), P((e) => {
						z(o, `${e ?? ""} `), W(s, F(r).props.thickness);
					}, [() => K("lbl.thickness")]), I("change", s, (e) => i("thickness", Number(e.target.value))), R(e, n);
				},
				$$slots: { default: !0 }
			}), m_(N(a, 2), {
				key: "fill",
				children: (e, t) => {
					var n = iv(), a = A(n);
					U(a);
					var o = N(a);
					E(n), P((e, t, r) => {
						G(n, "title", e), Vi(a, t), z(o, ` ${r ?? ""}`);
					}, [
						() => K("tip.shape.fill"),
						() => !!F(r).props.fill,
						() => K("lbl.filled")
					]), I("change", a, (e) => i("fill", e.target.checked ? F(r).props.color : null)), R(e, n);
				},
				$$slots: { default: !0 }
			}), R(e, t);
		}, n = (e) => {
			var t = Xr(), n = j(t), i = (e) => {
				var t = ov(), n = A(t), i = N(n);
				U(i), E(t), P((e, r, a, o) => {
					G(t, "title", e), z(n, `${r ?? ""} `), G(i, "max", a), W(i, o);
				}, [
					() => K("tip.shapeSize"),
					() => K("lbl.length"),
					() => c(100 - F(r).frame.x),
					() => c(F(r).frame.w)
				]), I("change", i, (e) => l(Number(e.target.value), !1)), R(e, t);
			}, a = /* @__PURE__ */ D(() => (F(r).props.kind === "line" || F(r).props.kind === "arrow") && s()), u = (e) => {
				var t = sv(), n = A(t), i = N(n);
				U(i), E(t), P((e, t) => {
					z(n, `${e ?? ""} `), G(i, "max", t), W(i, F(r).frame.w);
				}, [() => K("lbl.length"), () => Math.max(1, Math.round(100 - F(r).frame.x))]), I("change", i, (e) => o("w", Math.max(1, Math.min(Number(e.target.value), 100 - F(r).frame.x)))), R(e, t);
			}, d = (e) => {
				var t = ov(), n = A(t), i = N(n);
				U(i), E(t), P((e, r, a, o) => {
					G(t, "title", e), z(n, `${r ?? ""} `), G(i, "max", a), W(i, o);
				}, [
					() => K("tip.shapeSize"),
					() => K("lbl.sizePx"),
					() => c(100 - F(r).frame.x),
					() => c(F(r).frame.w)
				]), I("change", i, (e) => l(Number(e.target.value), !0)), R(e, t);
			};
			B(n, (e) => {
				F(a) ? e(i) : F(r).props.kind === "line" || F(r).props.kind === "arrow" ? e(u, 1) : e(d, -1);
			}), R(e, t);
		}, a = /* @__PURE__ */ D(() => F(r).props.kind === "line" || F(r).props.kind === "arrow");
		var u = cv(), f = j(u);
		{
			let e = /* @__PURE__ */ D(() => K("group.strokeFill")), n = /* @__PURE__ */ D(() => `${Fg().find(([e]) => e === F(r).props.color)?.[1] ?? ""} · ${F(r).props.thickness ?? 2} px`), i = /* @__PURE__ */ D(() => d("shape-stroke", {
				color: "accent",
				thickness: 2,
				fill: null
			}));
			qg(f, {
				id: "shape-stroke",
				get title() {
					return F(e);
				},
				get value() {
					return F(n);
				},
				get group() {
					return F(i);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
		var p = N(f, 2), m = (e) => {
			{
				let t = /* @__PURE__ */ D(() => K("group.measures")), i = /* @__PURE__ */ D(() => s() ? `${c(F(r).frame.w)} px` : `${F(r).frame.w} %`);
				qg(e, {
					id: "shape-size",
					get title() {
						return F(t);
					},
					get value() {
						return F(i);
					},
					children: (e, t) => {
						n(e);
					},
					$$slots: { default: !0 }
				});
			}
		}, h = /* @__PURE__ */ D(() => F(a) || s());
		B(p, (e) => {
			F(h) && e(m);
		}), R(e, u);
	};
	B(p, (e) => {
		t.area === "content" ? e(m) : t.area === "style" && e(h, 1);
	}), R(e, f), ot();
}
Vr(["change"]);
//#endregion
//#region src/menu/families/Gallery.svelte
var uv = /* @__PURE__ */ L("<div class=\"bg-layer\"><span class=\"toolbar-row\"><img class=\"site-icon-preview\" alt=\"\"/> <span class=\"row-tools\"><button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button></span></span> <label> <input/></label> <label> <input/></label></div>"), dv = /* @__PURE__ */ L("<label class=\"ghost filepick\"> <input type=\"file\" accept=\"image/*\" multiple=\"\"/></label> <!>", 1), fv = /* @__PURE__ */ L("<div class=\"pin-line\"><label> <!></label> <!></div>"), pv = /* @__PURE__ */ L("<div class=\"pin-line\"><label> <input type=\"number\" min=\"1\" max=\"6\"/></label> <!></div>"), mv = /* @__PURE__ */ L("<!> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0\" max=\"32\" step=\"2\"/>", 1), hv = /* @__PURE__ */ L("<div class=\"ctl-row\"><span class=\"mini-label ctl-name\"> </span> <input type=\"range\" step=\"10\"/> <span class=\"gridmenu-value\"> </span></div>"), gv = /* @__PURE__ */ L("<!> <button type=\"button\" class=\"ghost action\"><!> </button>", 1), _v = /* @__PURE__ */ L("<div class=\"ctl-row\"><span class=\"mini-label ctl-name\"> </span> <input type=\"range\" step=\"1\"/> <span class=\"gridmenu-value\"> </span></div>"), vv = /* @__PURE__ */ L("<button type=\"button\" class=\"ghost action\"><!> </button>"), yv = /* @__PURE__ */ L("<label> <!></label>"), bv = /* @__PURE__ */ L("<label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label>"), xv = /* @__PURE__ */ L("<!> <!> <!> <!>", 1), Sv = /* @__PURE__ */ L("<label> <input type=\"number\" min=\"2\" max=\"60\"/></label>"), Cv = /* @__PURE__ */ L("<!> <!> <!> <!> <!> <!>", 1), wv = /* @__PURE__ */ L("<div class=\"ctl-row\"><span class=\"mini-label ctl-name\"> </span> <input type=\"range\" min=\"10\" max=\"300\" step=\"5\"/> <span class=\"gridmenu-value\"> </span></div>"), Tv = /* @__PURE__ */ L("<!> <!> <!> <div class=\"ctl-row\"><span class=\"mini-label ctl-name\"> </span> <input type=\"range\" min=\"60\" max=\"800\" step=\"10\"/> <span class=\"gridmenu-value\"> </span></div> <label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"0\" max=\"32\" step=\"2\"/> <!> <!> <!>", 1), Ev = /* @__PURE__ */ L("<!> <!>", 1), Dv = /* @__PURE__ */ L("<!> <!> <!>", 1);
function Ov(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock), { setBlockProp: i, setBlockProps: a, setBlockFrame: o, addGalleryImages: s, moveGalleryImage: c, removeGalleryImage: l, setGalleryImageField: u, themeSwatches: d, newSeed: f } = n, { groupChanged: p, groupOf: m } = b_(() => F(r).props, a);
	var h = Xr(), g = j(h), _ = (e) => {
		let t = (e) => {
			var t = dv(), n = j(t), i = A(n), a = N(i);
			E(n), di(N(n, 2), 17, () => F(r).props.images ?? [], si, (e, t, n) => {
				var i = uv(), a = A(i), o = A(a), s = N(o, 2), d = A(s);
				d.disabled = n === 0, V(d, () => q.up, !0), E(d);
				var f = N(d, 2);
				V(f, () => q.down, !0), E(f);
				var p = N(f, 2);
				V(p, () => q.cross, !0), E(p), E(s), E(a);
				var m = N(a, 2), h = A(m), g = N(h);
				U(g), E(m);
				var _ = N(m, 2), v = A(_), y = N(v);
				U(y), E(_), E(i), P((e, i, s, c, l, u) => {
					G(a, "title", e), G(o, "src", F(t).src), f.disabled = n === F(r).props.images.length - 1, G(p, "title", i), z(h, `${s ?? ""} `), W(g, F(t).alt ?? ""), G(g, "placeholder", c), z(v, `${l ?? ""} `), W(y, F(t).href ?? ""), G(y, "placeholder", u);
				}, [
					() => K("hint.gallery"),
					() => K("tip.removeImage"),
					() => K("lbl.description"),
					() => K("ph.altShort"),
					() => K("lbl.link"),
					() => K("ph.galleryHref")
				]), I("click", d, () => c(n, -1)), I("click", f, () => c(n, 1)), I("click", p, () => l(n)), I("change", g, (e) => u(n, "alt", e.target.value)), I("change", y, (e) => u(n, "href", e.target.value || null)), R(e, i);
			}), P((e, t) => {
				G(n, "title", e), z(i, `${t ?? ""} `);
			}, [() => K("tip.gallery.addImages"), () => K("ui.addImages")]), I("change", a, s), R(e, t);
		};
		{
			let n = /* @__PURE__ */ D(() => K("group.images")), i = /* @__PURE__ */ D(() => K("menu.imageCount", { n: F(r).props.images?.length ?? 0 }));
			qg(e, {
				id: "gallery-images",
				defaultOpen: !0,
				get title() {
					return F(n);
				},
				get value() {
					return F(i);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
	}, v = (e) => {
		let t = (e) => {
			var t = Cv(), n = j(t);
			m_(n, {
				key: "view",
				children: (e, t) => {
					var n = fv(), r = A(n), a = A(r), o = N(a);
					{
						let e = /* @__PURE__ */ D(() => ru.map((e) => [e, K(`opt.galleryView.${e}`)]));
						J(o, {
							get value() {
								return F(s);
							},
							get options() {
								return F(e);
							},
							onchange: (e) => i("view", e)
						});
					}
					E(r), Cg(N(r, 2), { id: "galleryView" }), E(n), P((e) => z(a, `${e ?? ""} `), [() => K("lbl.view")]), R(e, n);
				},
				$$slots: { default: !0 }
			});
			var a = N(n, 2), o = (e) => {
				m_(e, {
					key: "width",
					children: (e, t) => {
						{
							let t = /* @__PURE__ */ D(() => K("lbl.ribbonWidth")), n = /* @__PURE__ */ D(() => Eg(F(r).props.width)), a = /* @__PURE__ */ D(Tg);
							Wl(e, {
								get label() {
									return F(t);
								},
								get value() {
									return F(n);
								},
								get options() {
									return F(a);
								},
								onchange: (e) => i("width", e)
							});
						}
					},
					$$slots: { default: !0 }
				});
			};
			B(a, (e) => {
				F(s) === "ribbon" && e(o);
			});
			var c = N(a, 2), l = (e) => {
				var t = mv(), n = j(t);
				m_(n, {
					key: "columns",
					shown: "3",
					children: (e, t) => {
						var n = pv(), a = A(n), o = A(a), s = N(o);
						U(s), E(a), Cg(N(a, 2), { id: "columns" }), E(n), P((e) => {
							z(o, `${e ?? ""} `), W(s, F(r).props.columns ?? 3);
						}, [() => K("lbl.columns")]), I("change", s, (e) => i("columns", Number(e.target.value))), R(e, n);
					},
					$$slots: { default: !0 }
				});
				var a = N(n, 2), o = A(a), s = M(N(o));
				E(a);
				var c = N(a, 2);
				U(c), P((e) => {
					z(o, `${e ?? ""} `), z(s, `${F(r).props.gap ?? 12 ?? ""} px`), W(c, F(r).props.gap ?? 12);
				}, [() => K("lbl.imageGap")]), I("input", c, (e) => i("gap", Number(e.target.value))), R(e, t);
			}, u = /* @__PURE__ */ D(() => iu.includes(F(s)));
			B(c, (e) => {
				F(u) && e(l);
			});
			var p = N(c, 2), m = (e) => {
				var t = gv(), n = j(t);
				m_(n, {
					key: "rowHeight",
					children: (e, t) => {
						var n = hv(), a = A(n), o = M(a, !0), s = N(a, 2);
						U(s);
						var c = M(N(s, 2));
						E(n), P((e, t) => {
							G(n, "title", e), z(o, t), G(s, "min", au.min), G(s, "max", au.max), W(s, F(r).props.rowHeight ?? au.dflt), z(c, `${F(r).props.rowHeight ?? au.dflt ?? ""} px`);
						}, [() => K("tip.gallery.rowHeight"), () => K("lbl.galleryRowHeight")]), I("input", s, (e) => i("rowHeight", e.target.valueAsNumber)), R(e, n);
					},
					$$slots: { default: !0 }
				});
				var a = N(n, 2), o = A(a);
				V(o, () => q.shuffle);
				var s = N(o);
				E(a), P((e, t) => {
					G(a, "title", e), z(s, ` ${t ?? ""}`);
				}, [() => K("tip.gallery.shuffleMosaic"), () => K("ui.shufflePhotos")]), I("click", a, () => i("seed", f())), R(e, t);
			};
			B(p, (e) => {
				F(s) === "mosaic" && e(m);
			});
			var h = N(p, 2), g = (e) => {
				var t = xv(), n = j(t);
				m_(n, {
					key: "tilt",
					children: (e, t) => {
						var n = _v(), a = A(n), o = M(a, !0), s = N(a, 2);
						U(s);
						var c = M(N(s, 2));
						E(n), P((e, t) => {
							G(n, "title", e), z(o, t), G(s, "min", ou.min), G(s, "max", ou.max), W(s, F(r).props.tilt ?? ou.dflt), z(c, `${F(r).props.tilt ?? ou.dflt ?? ""}°`);
						}, [() => K("tip.gallery.tilt"), () => K("lbl.polaroidTilt")]), I("input", s, (e) => i("tilt", e.target.valueAsNumber)), R(e, n);
					},
					$$slots: { default: !0 }
				});
				var a = N(n, 2), o = (e) => {
					var t = vv(), n = A(t);
					V(n, () => q.shuffle);
					var r = N(n);
					E(t), P((e, n) => {
						G(t, "title", e), z(r, ` ${n ?? ""}`);
					}, [() => K("tip.gallery.shuffleTilt"), () => K("ui.shufflePhotos")]), I("click", t, () => i("seed", f())), R(e, t);
				};
				B(a, (e) => {
					(F(r).props.tilt ?? ou.dflt) > 0 && e(o);
				});
				var s = N(a, 2);
				m_(s, {
					key: "frameColor",
					source: "theme",
					children: (e, t) => {
						var n = yv(), a = A(n), o = N(a);
						{
							let e = /* @__PURE__ */ D(() => F(r).props.frameColor || "#ffffff"), t = /* @__PURE__ */ D(d), n = /* @__PURE__ */ D(() => K("tip.gallery.frameColor"));
							sl(o, {
								get value() {
									return F(e);
								},
								get tokens() {
									return F(t);
								},
								allowClear: !0,
								get label() {
									return F(n);
								},
								onchange: (e) => i("frameColor", e ?? "")
							});
						}
						E(n), P((e, t) => {
							G(n, "title", e), z(a, `${t ?? ""} `);
						}, [() => K("tip.gallery.frameColor"), () => K("lbl.frameColor")]), R(e, n);
					},
					$$slots: { default: !0 }
				}), m_(N(s, 2), {
					key: "captions",
					children: (e, t) => {
						var n = bv(), a = A(n);
						U(a);
						var o = N(a);
						E(n), P((e, t) => {
							G(n, "title", e), Vi(a, F(r).props.captions === !0), z(o, ` ${t ?? ""}`);
						}, [() => K("tip.gallery.captions"), () => K("lbl.galleryCaptions")]), I("change", a, (e) => i("captions", e.target.checked)), R(e, n);
					},
					$$slots: { default: !0 }
				}), R(e, t);
			};
			B(h, (e) => {
				F(s) === "polaroid" && e(g);
			});
			var _ = N(h, 2), v = (e) => {
				m_(e, {
					key: "interval",
					shown: "5",
					children: (e, t) => {
						var n = Sv(), a = A(n), o = N(a);
						U(o), E(n), P((e) => {
							z(a, `${e ?? ""} `), W(o, F(r).props.interval ?? 5);
						}, [() => K("lbl.secondsPerImage")]), I("change", o, (e) => i("interval", Number(e.target.value))), R(e, n);
					},
					$$slots: { default: !0 }
				});
			};
			B(_, (e) => {
				F(s) === "slides" && e(v);
			}), R(e, t);
		}, n = (e) => {
			var t = Tv(), n = j(t);
			m_(n, {
				key: "rows",
				children: (e, t) => {
					{
						let t = /* @__PURE__ */ D(() => K("lbl.ribbonRows")), n = /* @__PURE__ */ D(() => String(F(r).props.rows ?? 1)), a = /* @__PURE__ */ D(() => [["1", K("opt.ribbonRows.one")], ["2", K("opt.ribbonRows.two")]]);
						Wl(e, {
							get label() {
								return F(t);
							},
							get value() {
								return F(n);
							},
							get options() {
								return F(a);
							},
							onchange: (e) => i("rows", Number(e))
						});
					}
				},
				$$slots: { default: !0 }
			});
			var a = N(n, 2);
			m_(a, {
				key: "direction",
				children: (e, t) => {
					{
						let t = /* @__PURE__ */ D(() => K("lbl.ribbonDirection")), n = /* @__PURE__ */ D(() => F(r).props.direction ?? "left"), a = /* @__PURE__ */ D(() => [["left", K("opt.ribbonDir.left")], ["right", K("opt.ribbonDir.right")]]);
						Wl(e, {
							get label() {
								return F(t);
							},
							get value() {
								return F(n);
							},
							get options() {
								return F(a);
							},
							onchange: (e) => i("direction", e)
						});
					}
				},
				$$slots: { default: !0 }
			});
			var s = N(a, 2);
			m_(s, {
				key: "speed",
				children: (e, t) => {
					var n = wv(), a = A(n), o = M(a, !0), s = N(a, 2);
					U(s);
					var c = M(N(s, 2), !0);
					E(n), P((e, t) => {
						G(n, "title", e), z(o, t), W(s, F(r).props.speed ?? 60), z(c, F(r).props.speed ?? 60);
					}, [() => K("tip.ribbon.speed"), () => K("lbl.ribbonSpeed")]), I("input", s, (e) => i("speed", e.target.valueAsNumber)), R(e, n);
				},
				$$slots: { default: !0 }
			});
			var c = N(s, 2), l = A(c), u = M(l, !0), d = N(l, 2);
			U(d);
			var f = M(N(d, 2));
			E(c);
			var p = N(c, 2), m = A(p), h = M(N(m));
			E(p);
			var g = N(p, 2);
			U(g);
			var _ = N(g, 2);
			m_(_, {
				key: "pauseOnHover",
				children: (e, t) => {
					var n = bv(), a = A(n);
					U(a);
					var o = N(a);
					E(n), P((e, t) => {
						G(n, "title", e), Vi(a, F(r).props.pauseOnHover !== !1), z(o, ` ${t ?? ""}`);
					}, [() => K("tip.ribbon.pause"), () => K("lbl.ribbonPause")]), I("change", a, (e) => i("pauseOnHover", e.target.checked)), R(e, n);
				},
				$$slots: { default: !0 }
			});
			var v = N(_, 2);
			m_(v, {
				key: "pause",
				children: (e, t) => {
					{
						let t = /* @__PURE__ */ D(() => K("lbl.bandPause")), n = /* @__PURE__ */ D(() => F(r).props.pause ?? "button"), a = /* @__PURE__ */ D(() => K("tip.ribbon.pauseMode")), o = /* @__PURE__ */ D(() => [["button", K("opt.bandPause.button")], ["touch", K("opt.bandPause.touch")]]);
						Wl(e, {
							get label() {
								return F(t);
							},
							get value() {
								return F(n);
							},
							get title() {
								return F(a);
							},
							get options() {
								return F(o);
							},
							onchange: (e) => i("pause", e)
						});
					}
				},
				$$slots: { default: !0 }
			}), m_(N(v, 2), {
				key: "fade",
				children: (e, t) => {
					var n = bv(), a = A(n);
					U(a);
					var o = N(a);
					E(n), P((e, t) => {
						G(n, "title", e), Vi(a, F(r).props.fade !== !1), z(o, ` ${t ?? ""}`);
					}, [() => K("tip.ribbon.fade"), () => K("lbl.ribbonFade")]), I("change", a, (e) => i("fade", e.target.checked)), R(e, n);
				},
				$$slots: { default: !0 }
			}), P((e, t, n) => {
				G(c, "title", e), z(u, t), W(d, F(r).frame.h), z(f, `${F(r).frame.h ?? ""} px`), z(m, `${n ?? ""} `), z(h, `${F(r).props.gap ?? 12 ?? ""} px`), W(g, F(r).props.gap ?? 12);
			}, [
				() => K("tip.ribbon.bandHeight"),
				() => K("lbl.ribbonHeight"),
				() => K("lbl.imageGap")
			]), I("input", d, (e) => o("h", e.target.valueAsNumber)), I("input", g, (e) => i("gap", Number(e.target.value))), R(e, t);
		}, a = (e) => {
			var t = Ev(), n = j(t);
			m_(n, {
				key: "radius",
				children: (e, t) => {
					var n = yv(), a = A(n), o = N(a);
					{
						let e = /* @__PURE__ */ D(() => F(r).props.radius ?? ""), t = /* @__PURE__ */ D(() => [
							["", K("common.none")],
							["sm", K("opt.size.sm")],
							["md", K("opt.radius.md")]
						]);
						J(o, {
							get value() {
								return F(e);
							},
							get options() {
								return F(t);
							},
							onchange: (e) => i("radius", e || null)
						});
					}
					E(n), P((e) => z(a, `${e ?? ""} `), [() => K("lbl.radius")]), R(e, n);
				},
				$$slots: { default: !0 }
			});
			var a = N(n, 2);
			{
				let e = /* @__PURE__ */ D(() => K("common.on"));
				m_(a, {
					key: "lightbox",
					get shown() {
						return F(e);
					},
					children: (e, t) => {
						var n = bv(), a = A(n);
						U(a);
						var o = N(a);
						E(n), P((e, t) => {
							G(n, "title", e), Vi(a, F(r).props.lightbox !== !1), z(o, ` ${t ?? ""}`);
						}, [() => K("tip.lightbox"), () => K("lbl.lightbox")]), I("change", a, (e) => i("lightbox", e.target.checked)), R(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			R(e, t);
		}, s = /* @__PURE__ */ D(() => su(F(r).props.view));
		var c = Dv(), l = j(c);
		{
			let e = /* @__PURE__ */ D(() => K("lbl.view")), n = /* @__PURE__ */ D(() => K(`opt.galleryView.${F(s)}`)), r = /* @__PURE__ */ D(() => m("gallery-view", {
				view: "grid",
				columns: 3,
				gap: 12,
				interval: 5,
				width: "canvas",
				rowHeight: void 0,
				tilt: void 0,
				frameColor: void 0,
				captions: void 0
			}));
			qg(l, {
				id: "gallery-view",
				get title() {
					return F(e);
				},
				get value() {
					return F(n);
				},
				get group() {
					return F(r);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
		var u = N(l, 2), p = (e) => {
			{
				let t = /* @__PURE__ */ D(() => K("lbl.ribbonMotion")), i = /* @__PURE__ */ D(() => `${F(r).props.speed ?? 60} px/s`), a = /* @__PURE__ */ D(() => m("gallery-roll", {
					rows: void 0,
					direction: void 0,
					speed: void 0,
					pauseOnHover: void 0,
					pause: void 0,
					fade: void 0
				}));
				qg(e, {
					id: "gallery-roll",
					get title() {
						return F(t);
					},
					get value() {
						return F(i);
					},
					get group() {
						return F(a);
					},
					children: (e, t) => {
						n(e);
					},
					$$slots: { default: !0 }
				});
			}
		};
		B(u, (e) => {
			F(s) === "ribbon" && e(p);
		});
		var h = N(u, 2);
		{
			let e = /* @__PURE__ */ D(() => K("group.galleryImages")), t = /* @__PURE__ */ D(() => ({
				"": K("common.none"),
				sm: K("opt.size.sm"),
				md: K("opt.radius.md")
			})[F(r).props.radius ?? ""]), n = /* @__PURE__ */ D(() => m("gallery-look", {
				radius: "md",
				lightbox: !0
			}));
			qg(h, {
				id: "gallery-look",
				get title() {
					return F(e);
				},
				get value() {
					return F(t);
				},
				get group() {
					return F(n);
				},
				children: (e, t) => {
					a(e);
				},
				$$slots: { default: !0 }
			});
		}
		R(e, c);
	};
	B(g, (e) => {
		t.area === "content" ? e(_) : t.area === "style" && e(v, 1);
	}), R(e, h), ot();
}
Vr([
	"change",
	"click",
	"input"
]);
//#endregion
//#region src/menu/families/Ribbon.svelte
var kv = /* @__PURE__ */ L("<span class=\"nav-line\"><input/> <span class=\"row-tools\"><button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button></span></span>"), Av = /* @__PURE__ */ L("<!> <button class=\"ghost action\"> </button>", 1), jv = /* @__PURE__ */ L("<button type=\"button\"></button>"), Mv = /* @__PURE__ */ L("<div class=\"ctl-field\"><span class=\"mini-label\"> </span> <div class=\"tile-grid cols-6\" role=\"group\"></div></div>"), Nv = /* @__PURE__ */ L("<label class=\"field-stack\"><span class=\"mini-label\"> </span> <input class=\"field-filled\"/></label>"), Pv = /* @__PURE__ */ L("<!> <!>", 1), Fv = /* @__PURE__ */ L("<div class=\"pin-line\"><!> <!></div>"), Iv = /* @__PURE__ */ L("<div class=\"ctl-row\"><span class=\"mini-label ctl-name\"> </span> <input type=\"range\" min=\"0.5\" max=\"10\" step=\"0.5\"/> <span class=\"gridmenu-value\"> </span></div>"), Lv = /* @__PURE__ */ L("<div class=\"ctl-row\"><span class=\"mini-label ctl-name\"> </span> <input type=\"range\" min=\"10\" max=\"300\" step=\"5\"/> <span class=\"gridmenu-value\"> </span> <!></div>"), Rv = /* @__PURE__ */ L("<label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label>"), zv = /* @__PURE__ */ L("<button class=\"ghost action\"> </button> <!> <!> <!> <!> <!>", 1), Bv = /* @__PURE__ */ L("<label class=\"field-stack\"><span class=\"mini-label\"> </span> <!></label>"), Vv = /* @__PURE__ */ L("<label> <!></label>"), Hv = /* @__PURE__ */ L("<div class=\"ctl-row\"><span class=\"mini-label ctl-name\"> </span> <input type=\"range\" min=\"2\" max=\"40\" step=\"1\"/> <span class=\"gridmenu-value\"> </span></div>"), Uv = /* @__PURE__ */ L("<!> <!> <!> <!> <!> <!>", 1), Wv = /* @__PURE__ */ L("<div class=\"ctl-row\"><span class=\"mini-label ctl-name\"> </span> <input type=\"range\" min=\"-10\" max=\"10\" step=\"1\"/> <span class=\"gridmenu-value\"> </span></div>"), Gv = /* @__PURE__ */ L("<!> <!> <!>", 1), Kv = /* @__PURE__ */ L("<div class=\"ctl-row\"><span class=\"mini-label ctl-name\"> </span> <input type=\"range\" min=\"8\" max=\"120\" step=\"2\"/> <span class=\"gridmenu-value\"> </span></div>"), qv = /* @__PURE__ */ L("<!> <!> <!> <!> <!>", 1), Jv = /* @__PURE__ */ L("<div class=\"swatch-cell\"><!> <span class=\"mini-label\"> </span></div>"), Yv = /* @__PURE__ */ L("<div class=\"swatch-row\"><!> <div class=\"swatch-cell\"><!> <span class=\"mini-label\"> </span></div></div>");
function Xv(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock), { mutateBlock: i, setBlockProp: a, setBlockProps: o, themeSwatches: s } = n, { groupChanged: c, groupOf: l } = b_(() => F(r).props, o);
	function u(e, t) {
		i(`edit:${F(r).blockId}:ribbon${e}`, (n) => {
			n.props.items[e] = t;
		});
	}
	function d() {
		i("ribbon-item", (e) => {
			e.props.items ??= [], e.props.items.push(K("seed.ribbonBlock.new"));
		});
	}
	function f(e) {
		i("ribbon-item", (t) => {
			t.props.items.splice(e, 1);
		});
	}
	function p(e, t) {
		let n = e + t;
		i("ribbon-item", (t) => {
			n < 0 || n >= t.props.items.length || ([t.props.items[e], t.props.items[n]] = [t.props.items[n], t.props.items[e]]);
		});
	}
	var m = Xr(), h = j(m), _ = (e) => {
		let t = (e) => {
			var t = Av(), n = j(t);
			di(n, 17, () => F(r).props.items ?? [], si, (e, t, n) => {
				var i = kv(), a = A(i);
				U(a);
				var o = N(a, 2), s = A(o);
				s.disabled = n === 0, V(s, () => q.up, !0), E(s);
				var c = N(s, 2);
				V(c, () => q.down, !0), E(c);
				var l = N(c, 2);
				V(l, () => q.cross, !0), E(l), E(o), E(i), P((e, i, o, u) => {
					W(a, F(t)), G(a, "title", e), G(s, "title", i), G(c, "title", o), c.disabled = n === (F(r).props.items?.length ?? 0) - 1, G(l, "title", u);
				}, [
					() => K("tip.ribbon.item"),
					() => K("tip.moveUp"),
					() => K("tip.moveDown"),
					() => K("tip.ribbon.remove")
				]), I("change", a, (e) => u(n, e.target.value)), I("click", s, () => p(n, -1)), I("click", c, () => p(n, 1)), I("click", l, () => f(n)), R(e, i);
			});
			var i = N(n, 2), a = M(i, !0);
			P((e) => z(a, e), [() => K("ui.addRibbonItem")]), I("click", i, d), R(e, t);
		}, n = (e) => {
			var t = Pv(), n = j(t);
			m_(n, {
				key: "sep",
				children: (e, t) => {
					var n = Mv(), i = A(n), o = M(i, !0), s = N(i, 2);
					di(s, 21, Ag, ([e, t]) => e, (e, t) => {
						var n = /* @__PURE__ */ D(() => g(F(t), 2));
						let i = () => F(n)[0], o = () => F(n)[1];
						var s = jv();
						let c;
						V(s, () => Ng[i()], !0), E(s), P(() => {
							c = H(s, 1, "tile", null, c, { on: (F(r).props.sep ?? "dot") === i() }), G(s, "aria-pressed", (F(r).props.sep ?? "dot") === i()), G(s, "title", o());
						}), I("click", s, () => a("sep", i())), R(e, s);
					}), E(s), E(n), P((e, t) => {
						z(o, e), G(s, "aria-label", t);
					}, [() => K("lbl.ribbonSep"), () => K("lbl.ribbonSep")]), R(e, n);
				},
				$$slots: { default: !0 }
			});
			var i = N(n, 2), o = (e) => {
				m_(e, {
					key: "sepText",
					children: (e, t) => {
						var n = Nv(), i = A(n), o = M(i, !0), s = N(i, 2);
						U(s), E(n), P((e, t) => {
							G(n, "title", e), z(o, t), W(s, F(r).props.sepText ?? "");
						}, [() => K("tip.ribbon.sepText"), () => K("lbl.ribbonSepText")]), I("change", s, (e) => a("sepText", e.target.value)), R(e, n);
					},
					$$slots: { default: !0 }
				});
			};
			B(i, (e) => {
				F(r).props.sep === "custom" && e(o);
			}), R(e, t);
		};
		var i = Pv(), o = j(i);
		{
			let e = /* @__PURE__ */ D(() => K("lbl.ribbonItems")), n = /* @__PURE__ */ D(() => K("menu.wordCount", { n: F(r).props.items?.length ?? 0 }));
			qg(o, {
				id: "ribbon-words",
				get title() {
					return F(e);
				},
				get value() {
					return F(n);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
		var s = N(o, 2);
		{
			let e = /* @__PURE__ */ D(() => K("lbl.ribbonSep")), t = /* @__PURE__ */ D(() => Ag().find(([e]) => e === (F(r).props.sep ?? "dot"))?.[1] ?? ""), i = /* @__PURE__ */ D(() => l("ribbon-sep", {
				sep: "dot",
				sepText: void 0
			}));
			qg(s, {
				id: "ribbon-sep",
				get title() {
					return F(e);
				},
				get value() {
					return F(t);
				},
				get group() {
					return F(i);
				},
				children: (e, t) => {
					n(e);
				},
				$$slots: { default: !0 }
			});
		}
		R(e, i);
	}, v = (e) => {
		let t = (e) => {
			var t = Pv(), i = j(t);
			m_(i, {
				key: "motion",
				children: (e, t) => {
					var n = Fv(), r = A(n);
					{
						let e = /* @__PURE__ */ D(Dg);
						J(r, {
							filled: !0,
							get value() {
								return F(f);
							},
							get options() {
								return F(e);
							},
							onchange: (e) => a("motion", e)
						});
					}
					Cg(N(r, 2), { id: "ribbonMotion" }), E(n), R(e, n);
				},
				$$slots: { default: !0 }
			});
			var o = N(i, 2), s = (e) => {
				var t = zv(), i = j(t), o = M(i, !0), s = N(i, 2);
				m_(s, {
					key: "direction",
					children: (e, t) => {
						{
							let t = /* @__PURE__ */ D(() => K("lbl.ribbonDirection")), n = /* @__PURE__ */ D(() => F(r).props.direction ?? "left"), i = /* @__PURE__ */ D(() => [["left", K("opt.ribbonDir.left")], ["right", K("opt.ribbonDir.right")]]);
							Wl(e, {
								get label() {
									return F(t);
								},
								get value() {
									return F(n);
								},
								get options() {
									return F(i);
								},
								onchange: (e) => a("direction", e)
							});
						}
					},
					$$slots: { default: !0 }
				});
				var c = N(s, 2), l = (e) => {
					m_(e, {
						key: "dwell",
						shown: "2.5",
						children: (e, t) => {
							var n = Iv(), i = A(n), o = M(i, !0), s = N(i, 2);
							U(s);
							var c = M(N(s, 2));
							E(n), P((e, t) => {
								G(n, "title", e), z(o, t), W(s, F(r).props.dwell ?? 2.5), z(c, `${F(r).props.dwell ?? 2.5 ?? ""} s`);
							}, [() => K("tip.ribbon.dwell"), () => K("lbl.ribbonDwell")]), I("input", s, (e) => a("dwell", e.target.valueAsNumber)), R(e, n);
						},
						$$slots: { default: !0 }
					});
				}, u = (e) => {
					m_(e, {
						key: "speed",
						shown: "60",
						children: (e, t) => {
							var n = Lv(), i = A(n), o = M(i, !0), s = N(i, 2);
							U(s);
							var c = N(s, 2), l = M(c, !0);
							Cg(N(c, 2), { id: "speed" }), E(n), P((e, t) => {
								G(n, "title", e), z(o, t), W(s, F(r).props.speed ?? 60), z(l, F(r).props.speed ?? 60);
							}, [() => K("tip.ribbon.speed"), () => K("lbl.ribbonSpeed")]), I("input", s, (e) => a("speed", e.target.valueAsNumber)), R(e, n);
						},
						$$slots: { default: !0 }
					});
				};
				B(c, (e) => {
					F(f) === "step" ? e(l) : e(u, -1);
				});
				var d = N(c, 2);
				{
					let e = /* @__PURE__ */ D(() => K("common.on"));
					m_(d, {
						key: "pauseOnHover",
						get shown() {
							return F(e);
						},
						children: (e, t) => {
							var n = Rv(), i = A(n);
							U(i);
							var o = N(i);
							E(n), P((e, t) => {
								G(n, "title", e), Vi(i, F(r).props.pauseOnHover !== !1), z(o, ` ${t ?? ""}`);
							}, [() => K("tip.ribbon.pause"), () => K("lbl.ribbonPause")]), I("change", i, (e) => a("pauseOnHover", e.target.checked)), R(e, n);
						},
						$$slots: { default: !0 }
					});
				}
				var p = N(d, 2);
				m_(p, {
					key: "pause",
					children: (e, t) => {
						{
							let t = /* @__PURE__ */ D(() => K("lbl.bandPause")), n = /* @__PURE__ */ D(() => F(r).props.pause ?? "button"), i = /* @__PURE__ */ D(() => K("tip.ribbon.pauseMode")), o = /* @__PURE__ */ D(() => [["button", K("opt.bandPause.button")], ["touch", K("opt.bandPause.touch")]]);
							Wl(e, {
								get label() {
									return F(t);
								},
								get value() {
									return F(n);
								},
								get title() {
									return F(i);
								},
								get options() {
									return F(o);
								},
								onchange: (e) => a("pause", e)
							});
						}
					},
					$$slots: { default: !0 }
				});
				var m = N(p, 2);
				{
					let e = /* @__PURE__ */ D(() => K("common.on"));
					m_(m, {
						key: "fade",
						get shown() {
							return F(e);
						},
						children: (e, t) => {
							var n = Rv(), i = A(n);
							U(i);
							var o = N(i);
							E(n), P((e, t) => {
								G(n, "title", e), Vi(i, F(r).props.fade !== !1), z(o, ` ${t ?? ""}`);
							}, [() => K("tip.ribbon.fade"), () => K("lbl.ribbonFade")]), I("change", i, (e) => a("fade", e.target.checked)), R(e, n);
						},
						$$slots: { default: !0 }
					});
				}
				P((e, t) => {
					G(i, "title", e), z(o, t);
				}, [() => K("tip.ribbon.play"), () => K("ui.ribbonPlay")]), I("click", i, () => n.bridge?.sendDemoMotion()), R(e, t);
			};
			B(o, (e) => {
				F(f) !== "none" && e(s);
			}), R(e, t);
		}, i = (e) => {
			var t = Uv(), n = j(t);
			m_(n, {
				key: "above",
				children: (e, t) => {
					var n = Bv(), i = A(n), o = M(i, !0), s = N(i, 2);
					{
						let e = /* @__PURE__ */ D(() => F(r).props.above ?? "none"), t = /* @__PURE__ */ D(kg);
						J(s, {
							filled: !0,
							get value() {
								return F(e);
							},
							get options() {
								return F(t);
							},
							onchange: (e) => a("above", e)
						});
					}
					E(n), P((e, t) => {
						G(n, "title", e), z(o, t);
					}, [() => K("tip.ribbon.above"), () => K("lbl.ribbonAbove")]), R(e, n);
				},
				$$slots: { default: !0 }
			});
			var i = N(n, 2), o = (e) => {
				m_(e, {
					key: "aboveColor",
					source: "theme",
					children: (e, t) => {
						var n = Vv(), i = A(n), o = N(i);
						{
							let e = /* @__PURE__ */ D(() => F(r).props.aboveColor ?? jg(F(r).props)), t = /* @__PURE__ */ D(s), n = /* @__PURE__ */ D(() => K("tip.ribbon.stripeColor"));
							sl(o, {
								get value() {
									return F(e);
								},
								get tokens() {
									return F(t);
								},
								get label() {
									return F(n);
								},
								onchange: (e) => a("aboveColor", e)
							});
						}
						E(n), P((e, t) => {
							G(n, "title", e), z(i, `${t ?? ""} `);
						}, [() => K("tip.ribbon.stripeColor"), () => K("lbl.colour")]), R(e, n);
					},
					$$slots: { default: !0 }
				});
			};
			B(i, (e) => {
				(F(r).props.above ?? "none") !== "none" && e(o);
			});
			var c = N(i, 2);
			m_(c, {
				key: "main",
				children: (e, t) => {
					var n = Bv(), i = A(n), o = M(i, !0), s = N(i, 2);
					{
						let e = /* @__PURE__ */ D(() => F(r).props.main ?? "text"), t = /* @__PURE__ */ D(Og);
						J(s, {
							filled: !0,
							get value() {
								return F(e);
							},
							get options() {
								return F(t);
							},
							onchange: (e) => a("main", e)
						});
					}
					E(n), P((e, t) => {
						G(n, "title", e), z(o, t);
					}, [() => K("tip.ribbon.main"), () => K("lbl.ribbonMain")]), R(e, n);
				},
				$$slots: { default: !0 }
			});
			var l = N(c, 2);
			m_(l, {
				key: "below",
				children: (e, t) => {
					var n = Bv(), i = A(n), o = M(i, !0), s = N(i, 2);
					{
						let e = /* @__PURE__ */ D(() => F(r).props.below ?? "none"), t = /* @__PURE__ */ D(kg);
						J(s, {
							filled: !0,
							get value() {
								return F(e);
							},
							get options() {
								return F(t);
							},
							onchange: (e) => a("below", e)
						});
					}
					E(n), P((e, t) => {
						G(n, "title", e), z(o, t);
					}, [() => K("tip.ribbon.below"), () => K("lbl.ribbonBelow")]), R(e, n);
				},
				$$slots: { default: !0 }
			});
			var u = N(l, 2), d = (e) => {
				m_(e, {
					key: "belowColor",
					source: "theme",
					children: (e, t) => {
						var n = Vv(), i = A(n), o = N(i);
						{
							let e = /* @__PURE__ */ D(() => F(r).props.belowColor ?? jg(F(r).props)), t = /* @__PURE__ */ D(s), n = /* @__PURE__ */ D(() => K("tip.ribbon.stripeColor"));
							sl(o, {
								get value() {
									return F(e);
								},
								get tokens() {
									return F(t);
								},
								get label() {
									return F(n);
								},
								onchange: (e) => a("belowColor", e)
							});
						}
						E(n), P((e, t) => {
							G(n, "title", e), z(i, `${t ?? ""} `);
						}, [() => K("tip.ribbon.stripeColor"), () => K("lbl.colour")]), R(e, n);
					},
					$$slots: { default: !0 }
				});
			};
			B(u, (e) => {
				(F(r).props.below ?? "none") !== "none" && e(d);
			});
			var f = N(u, 2), p = (e) => {
				var t = Pv(), n = j(t);
				m_(n, {
					key: "stripePlace",
					children: (e, t) => {
						{
							let t = /* @__PURE__ */ D(() => K("lbl.ribbonStripePlace")), n = /* @__PURE__ */ D(() => K("tip.ribbon.stripePlace")), i = /* @__PURE__ */ D(() => F(r).props.stripePlace ?? "stack"), o = /* @__PURE__ */ D(() => [["stack", K("opt.ribbonPlace.stack")], ["edge", K("opt.ribbonPlace.edge")]]);
							Wl(e, {
								get label() {
									return F(t);
								},
								get title() {
									return F(n);
								},
								get value() {
									return F(i);
								},
								get options() {
									return F(o);
								},
								onchange: (e) => a("stripePlace", e)
							});
						}
					},
					$$slots: { default: !0 }
				}), m_(N(n, 2), {
					key: "thickness",
					shown: "8",
					children: (e, t) => {
						var n = Hv(), i = A(n), o = M(i, !0), s = N(i, 2);
						U(s);
						var c = M(N(s, 2));
						E(n), P((e, t) => {
							G(n, "title", e), z(o, t), W(s, F(r).props.thickness ?? 8), z(c, `${F(r).props.thickness ?? 8 ?? ""} px`);
						}, [() => K("tip.ribbon.thickness"), () => K("lbl.ribbonThickness")]), I("input", s, (e) => a("thickness", e.target.valueAsNumber)), R(e, n);
					},
					$$slots: { default: !0 }
				}), R(e, t);
			};
			B(f, (e) => {
				((F(r).props.above ?? "none") !== "none" || (F(r).props.below ?? "none") !== "none") && e(p);
			}), R(e, t);
		}, o = (e) => {
			var t = Gv(), n = j(t);
			m_(n, {
				key: "width",
				children: (e, t) => {
					{
						let t = /* @__PURE__ */ D(() => K("lbl.ribbonWidth")), n = /* @__PURE__ */ D(() => Eg(F(r).props.width)), i = /* @__PURE__ */ D(Tg);
						Wl(e, {
							get label() {
								return F(t);
							},
							get value() {
								return F(n);
							},
							get options() {
								return F(i);
							},
							onchange: (e) => a("width", e)
						});
					}
				},
				$$slots: { default: !0 }
			});
			var i = N(n, 2);
			m_(i, {
				key: "variant",
				children: (e, t) => {
					{
						let t = /* @__PURE__ */ D(() => K("lbl.ribbonVariant")), n = /* @__PURE__ */ D(() => F(r).props.variant ?? "band"), i = /* @__PURE__ */ D(() => [["band", K("opt.ribbonVariant.band")], ["plain", K("opt.ribbonVariant.plain")]]);
						Wl(e, {
							get label() {
								return F(t);
							},
							get value() {
								return F(n);
							},
							get options() {
								return F(i);
							},
							onchange: (e) => a("variant", e)
						});
					}
				},
				$$slots: { default: !0 }
			}), m_(N(i, 2), {
				key: "tilt",
				shown: "0",
				children: (e, t) => {
					var n = Wv(), i = A(n), o = M(i, !0), s = N(i, 2);
					U(s);
					var c = M(N(s, 2));
					E(n), P((e, t) => {
						G(n, "title", e), z(o, t), W(s, F(r).props.tilt ?? 0), z(c, `${F(r).props.tilt ?? 0 ?? ""}°`);
					}, [() => K("tip.ribbon.tilt"), () => K("lbl.ribbonTilt")]), I("input", s, (e) => a("tilt", e.target.valueAsNumber)), R(e, n);
				},
				$$slots: { default: !0 }
			}), R(e, t);
		}, u = (e) => {
			var t = qv(), n = j(t);
			m_(n, {
				key: "size",
				children: (e, t) => {
					var n = Bv(), i = A(n), o = M(i, !0), s = N(i, 2);
					{
						let e = /* @__PURE__ */ D(() => F(r).props.size ?? "md"), t = /* @__PURE__ */ D(() => [
							["sm", K("opt.size.sm")],
							["md", K("opt.size.md")],
							["lg", K("opt.size.lg")],
							["xl", K("opt.size.xl")]
						]);
						J(s, {
							filled: !0,
							get value() {
								return F(e);
							},
							get options() {
								return F(t);
							},
							onchange: (e) => a("size", e)
						});
					}
					E(n), P((e) => z(o, e), [() => K("lbl.size")]), R(e, n);
				},
				$$slots: { default: !0 }
			});
			var i = N(n, 2);
			{
				let e = /* @__PURE__ */ D(() => K("common.off"));
				m_(i, {
					key: "caps",
					get shown() {
						return F(e);
					},
					children: (e, t) => {
						var n = Rv(), i = A(n);
						U(i);
						var o = N(i);
						E(n), P((e, t) => {
							G(n, "title", e), Vi(i, F(r).props.caps === !0), z(o, ` ${t ?? ""}`);
						}, [() => K("tip.ribbon.caps"), () => K("lbl.ribbonCaps")]), I("change", i, (e) => a("caps", e.target.checked)), R(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			var o = N(i, 2);
			m_(o, {
				key: "weight",
				children: (e, t) => {
					var n = Rv(), i = A(n);
					U(i);
					var o = N(i);
					E(n), P((e, t) => {
						G(n, "title", e), Vi(i, F(r).props.weight === "bold"), z(o, ` ${t ?? ""}`);
					}, [() => K("tip.ribbon.bold"), () => K("lbl.ribbonBold")]), I("change", i, (e) => a("weight", e.target.checked ? "bold" : "normal")), R(e, n);
				},
				$$slots: { default: !0 }
			});
			var s = N(o, 2);
			{
				let e = /* @__PURE__ */ D(() => K("common.off"));
				m_(s, {
					key: "outline",
					get shown() {
						return F(e);
					},
					children: (e, t) => {
						var n = Rv(), i = A(n);
						U(i);
						var o = N(i);
						E(n), P((e, t) => {
							G(n, "title", e), Vi(i, F(r).props.outline === !0), z(o, ` ${t ?? ""}`);
						}, [() => K("tip.ribbon.outline"), () => K("lbl.ribbonOutline")]), I("change", i, (e) => a("outline", e.target.checked)), R(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			m_(N(s, 2), {
				key: "gap",
				shown: "40",
				children: (e, t) => {
					var n = Kv(), i = A(n), o = M(i, !0), s = N(i, 2);
					U(s);
					var c = M(N(s, 2));
					E(n), P((e, t) => {
						G(n, "title", e), z(o, t), W(s, F(r).props.gap ?? 40), z(c, `${F(r).props.gap ?? 40 ?? ""} px`);
					}, [() => K("tip.ribbon.gap"), () => K("lbl.ribbonGap")]), I("input", s, (e) => a("gap", e.target.valueAsNumber)), R(e, n);
				},
				$$slots: { default: !0 }
			}), R(e, t);
		}, d = (e) => {
			m_(e, {
				key: "bg",
				children: (e, t) => {
					var n = Yv(), i = A(n), o = (e) => {
						var t = Jv(), n = A(t);
						{
							let e = /* @__PURE__ */ D(() => F(r).props.bg ?? "accent"), t = /* @__PURE__ */ D(s), i = /* @__PURE__ */ D(() => K("tip.ribbon.bg"));
							sl(n, {
								get value() {
									return F(e);
								},
								get tokens() {
									return F(t);
								},
								get label() {
									return F(i);
								},
								onchange: (e) => a("bg", e)
							});
						}
						var i = M(N(n, 2), !0);
						E(t), P((e, n) => {
							G(t, "title", e), z(i, n);
						}, [() => K("tip.ribbon.bg"), () => K("lbl.background")]), R(e, t);
					};
					B(i, (e) => {
						(F(r).props.variant ?? "band") !== "plain" && e(o);
					});
					var c = N(i, 2), l = A(c);
					{
						let e = /* @__PURE__ */ D(() => F(r).props.color ?? ((F(r).props.variant ?? "band") === "plain" ? "text" : "accent-text")), t = /* @__PURE__ */ D(s), n = /* @__PURE__ */ D(() => K("tip.ribbon.color"));
						sl(l, {
							get value() {
								return F(e);
							},
							get tokens() {
								return F(t);
							},
							get label() {
								return F(n);
							},
							onchange: (e) => a("color", e)
						});
					}
					var u = M(N(l, 2), !0);
					E(c), E(n), P((e, t) => {
						G(c, "title", e), z(u, t);
					}, [() => K("tip.ribbon.color"), () => K("lbl.textColor")]), R(e, n);
				},
				$$slots: { default: !0 }
			});
		}, f = /* @__PURE__ */ D(() => F(r).props.motion ?? "roll"), p = /* @__PURE__ */ D(() => [F(r).props.above ?? "none", F(r).props.below ?? "none"].filter((e) => e !== "none").length), m = /* @__PURE__ */ D(() => c({
			bg: void 0,
			color: void 0
		}));
		var h = qv(), g = j(h);
		{
			let e = /* @__PURE__ */ D(() => K("lbl.ribbonMotion")), n = /* @__PURE__ */ D(() => Dg().find(([e]) => e === F(f))?.[1] ?? ""), r = /* @__PURE__ */ D(() => l("ribbon-motion", {
				motion: "roll",
				direction: "left",
				speed: 60,
				dwell: 2.5,
				pauseOnHover: !0,
				pause: "button",
				fade: !0
			}));
			qg(g, {
				id: "ribbon-motion",
				get title() {
					return F(e);
				},
				get value() {
					return F(n);
				},
				get group() {
					return F(r);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
		var _ = N(g, 2);
		{
			let e = /* @__PURE__ */ D(() => K("lbl.ribbonStripes")), t = /* @__PURE__ */ D(() => F(p) ? K("menu.onCount", { n: F(p) }) : K("common.off")), n = /* @__PURE__ */ D(() => l("ribbon-stripes", {
				above: "none",
				below: "none",
				main: "text",
				aboveColor: void 0,
				belowColor: void 0,
				stripePlace: "stack",
				thickness: 8
			}));
			qg(_, {
				id: "ribbon-stripes",
				get title() {
					return F(e);
				},
				get value() {
					return F(t);
				},
				get group() {
					return F(n);
				},
				children: (e, t) => {
					i(e);
				},
				$$slots: { default: !0 }
			});
		}
		var v = N(_, 2);
		{
			let e = /* @__PURE__ */ D(() => K("lbl.ribbonShape")), t = /* @__PURE__ */ D(() => Tg().find(([e]) => e === Eg(F(r).props.width))?.[1] ?? ""), n = /* @__PURE__ */ D(() => l("ribbon-shape", {
				width: "canvas",
				variant: "band",
				tilt: 0
			}));
			qg(v, {
				id: "ribbon-shape",
				get title() {
					return F(e);
				},
				get value() {
					return F(t);
				},
				get group() {
					return F(n);
				},
				children: (e, t) => {
					o(e);
				},
				$$slots: { default: !0 }
			});
		}
		var y = N(v, 2);
		{
			let e = /* @__PURE__ */ D(() => K("lbl.ribbonText")), t = /* @__PURE__ */ D(() => ({
				sm: K("opt.size.sm"),
				md: K("opt.size.md"),
				lg: K("opt.size.lg"),
				xl: K("opt.size.xl")
			})[F(r).props.size ?? "md"]), n = /* @__PURE__ */ D(() => l("ribbon-text", {
				size: "md",
				caps: !1,
				weight: "normal",
				outline: !1,
				gap: 40
			}));
			qg(y, {
				id: "ribbon-text",
				get title() {
					return F(e);
				},
				get value() {
					return F(t);
				},
				get group() {
					return F(n);
				},
				children: (e, t) => {
					u(e);
				},
				$$slots: { default: !0 }
			});
		}
		var b = N(y, 2);
		{
			let e = /* @__PURE__ */ D(() => K("group.navColours")), t = /* @__PURE__ */ D(() => F(m) ? K("menu.changed", { n: F(m) }) : K("menu.standard")), n = /* @__PURE__ */ D(() => l("ribbon-colours", {
				bg: void 0,
				color: void 0
			}));
			qg(b, {
				id: "ribbon-colours",
				get title() {
					return F(e);
				},
				get value() {
					return F(t);
				},
				get group() {
					return F(n);
				},
				children: (e, t) => {
					d(e);
				},
				$$slots: { default: !0 }
			});
		}
		R(e, h);
	};
	B(h, (e) => {
		t.area === "content" ? e(_) : t.area === "style" && e(v, 1);
	}), R(e, m), ot();
}
Vr([
	"change",
	"click",
	"input"
]);
//#endregion
//#region src/menu/families/Calendar.svelte
var Zv = /* @__PURE__ */ O("title"), Qv = /* @__PURE__ */ L("<div class=\"bg-layer\"><span class=\"toolbar-row\"><span class=\"cal-ref-swatch\" aria-hidden=\"true\"></span> <span> </span> <button class=\"ghost row-tool\"></button></span></div>"), $v = /* @__PURE__ */ L("<div class=\"bg-layer\"><span class=\"toolbar-row\"><input class=\"tb-grow\" spellcheck=\"false\"/> <button class=\"ghost row-tool\"></button></span> <span class=\"toolbar-row\"><input class=\"tb-grow\"/> <!></span> <button type=\"button\" class=\"ghost action\"> </button></div>"), ey = /* @__PURE__ */ L("<label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label>"), ty = /* @__PURE__ */ L("<span class=\"gridmenu-value\"> </span>"), ny = /* @__PURE__ */ L("<!> <button type=\"button\" class=\"ghost action\"><!> </button> <span class=\"mini-label\"> </span> <!> <!> <button type=\"button\" class=\"linkish\"> </button>", 1), ry = /* @__PURE__ */ L("<label> <!></label>"), iy = /* @__PURE__ */ L("<div class=\"ctl-row\"><span class=\"mini-label ctl-name\"> </span> <!></div> <div class=\"ctl-row\"><span class=\"mini-label ctl-name\"> </span> <!></div>", 1), ay = /* @__PURE__ */ L("<label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!> <!>", 1), oy = /* @__PURE__ */ L("<div class=\"pin-line\"><label> <input type=\"number\" min=\"1\" max=\"50\"/></label> <!></div> <!>", 1), sy = /* @__PURE__ */ L("<!> <div class=\"ctl-row\"><span class=\"mini-label ctl-name\"> </span> <input type=\"range\" min=\"0\" max=\"10\" step=\"1\"/> <span class=\"gridmenu-value\"> </span></div>", 1), cy = /* @__PURE__ */ L("<!> <!> <!> <!> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!> <!> <!>", 1), ly = /* @__PURE__ */ L("<label> <input placeholder=\"/program\" spellcheck=\"false\"/></label>"), uy = /* @__PURE__ */ L("<!> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!> <div class=\"pin-line\"><label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!></div> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!> <!>", 1), dy = /* @__PURE__ */ L("<label> <input/></label> <label> <!></label>", 1), fy = /* @__PURE__ */ L("<label class=\"field-stack\"> <textarea rows=\"3\"></textarea></label>"), py = /* @__PURE__ */ L("<!> <label> <input/></label> <!> <label> <input placeholder=\"https://\" spellcheck=\"false\"/></label>", 1), my = /* @__PURE__ */ L("<label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!>", 1), hy = /* @__PURE__ */ L("<button type=\"button\" class=\"ghost action\"> </button>"), gy = /* @__PURE__ */ L("<!> <!> <!> <!> <!> <!>", 1), _y = /* @__PURE__ */ L("<label> <input type=\"number\" min=\"0\" max=\"24\"/></label>"), vy = /* @__PURE__ */ L("<div class=\"ctl-row\"><span class=\"mini-label ctl-name\"> </span> <!></div>"), yy = /* @__PURE__ */ L("<span class=\"mini-label\"> </span>"), by = /* @__PURE__ */ L("<div class=\"cal-slot\"><!> <span class=\"mini-label\"> </span></div>"), xy = /* @__PURE__ */ L("<!> <div class=\"cal-slots\"></div>", 1), Sy = /* @__PURE__ */ L("<!> <label> <!></label> <label> <input type=\"number\"/></label> <!> <span class=\"toolbar-row\"><button type=\"button\"><i> </i></button> <button type=\"button\"><u> </u></button> <!></span>", 1), Cy = /* @__PURE__ */ L("<div class=\"pin-line\"><button type=\"button\" class=\"menu-row cal-design-row\"><span class=\"menu-group-title\"> </span><span class=\"menu-group-value\"> </span></button> <!></div> <div class=\"pin-line\"><button type=\"button\" class=\"menu-row cal-design-row\"><span class=\"menu-group-title\"> </span><span class=\"menu-group-value\"> </span></button> <!></div> <div class=\"pin-line\"><button type=\"button\" class=\"menu-row cal-design-row\"><span class=\"menu-group-title\"> </span><span class=\"menu-group-value\"> </span></button> <!></div>   <!> <!> <!> <!>", 1);
function wy(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock), { mutateBlock: i, setBlockProp: a, setBlockProps: o, siteCalendars: s, siteCalendarById: c, addSiteCalendar: l, themeSwatches: u } = n, d = {
		list: "calendar.viewList",
		cards: "calendar.viewCards",
		month: "calendar.viewMonth",
		agenda: "calendar.viewAgenda",
		next: "calendar.viewNext",
		week: "calendar.viewWeek",
		day: "calendar.viewDay",
		year: "calendar.viewYear"
	};
	function f(e, t) {
		let n = { ...F(r).props.options ?? {} };
		t === e.def || t == null ? delete n[e.key] : n[e.key] = t, a("options", Object.keys(n).length ? n : void 0);
	}
	function p(e, t) {
		return e.key === "firstMonth" && t === "now" ? K("calendar.opt.firstMonth.now") : e.key === "firstMonth" ? new Intl.DateTimeFormat(xa(), { month: "long" }).format(new Date(2024, Number(t), 1)) : K(`${e.labelKey}.${t}`);
	}
	function m(e) {
		let t = [];
		for (let n of e.slots) {
			let e = t.find((e) => e.section === n.section);
			e ? e.slots.push(n) : t.push({
				section: n.section,
				slots: [n]
			});
		}
		return t;
	}
	function h() {
		return F(r)?.props.fieldStyle?.[F(Zv)] ?? {};
	}
	function g(e) {
		let t = F(r).props.texts?.[e];
		return typeof t == "string" ? new DOMParser().parseFromString(t.replace(/<br\s*\/?>/gi, "\n"), "text/html").body.textContent.trim() : "";
	}
	function _(e, t) {
		let n = t.trim(), i = { ...F(r).props.texts ?? {} };
		n ? i[e] = n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>") : delete i[e], a("texts", Object.keys(i).length ? i : void 0);
	}
	function v(e, t) {
		let n = { ...F(r).props.colors ?? {} };
		t ? n[e] = t : delete n[e], a("colors", Object.keys(n).length ? n : void 0);
	}
	function y(e) {
		let t = {
			...F(r).props.stripe ?? {},
			...e
		};
		for (let e of Object.keys(t)) t[e] === void 0 && delete t[e];
		a("stripe", Object.keys(t).length ? t : void 0);
	}
	function b(e) {
		let t = { ...F(r).props.fieldStyle ?? {} }, n = {
			...t[F(Zv)] ?? {},
			...e
		};
		for (let e of Object.keys(n)) n[e] === void 0 && delete n[e];
		Object.keys(n).length ? t[F(Zv)] = n : delete t[F(Zv)], a("fieldStyle", Object.keys(t).length ? t : void 0);
	}
	let x = (e) => e && typeof e == "object" && "calendar" in e ? {
		ref: String(e.calendar ?? ""),
		url: "",
		name: "",
		color: ""
	} : e && typeof e == "object" ? {
		ref: "",
		url: e.url ?? "",
		name: e.name ?? "",
		color: e.color ?? ""
	} : {
		ref: "",
		url: typeof e == "string" ? e : "",
		name: "",
		color: ""
	}, S = ({ ref: e, url: t, name: n, color: r }) => e ? { calendar: e } : n || r ? {
		url: t,
		...n ? { name: n } : {},
		...r ? { color: r } : {}
	} : t, C = () => new Set((F(r).props.sources ?? []).map((e) => x(e).ref).filter(Boolean));
	function w(e, t) {
		let n = Ze(F(r).props.sources ?? []).filter((t) => x(t).ref !== e);
		a("sources", t ? [...n, { calendar: e }] : n);
	}
	function ee(e) {
		let t = Ze(F(r).props.sources ?? []), { url: n, name: i, color: o } = x(t[e]), s = l({
			url: n.trim(),
			...i ? { name: i } : {},
			...o ? { color: o } : {}
		});
		a("sources", t.map((t, n) => n === e ? { calendar: s } : t));
	}
	function T(e, t) {
		i(`edit:${F(r).blockId}:source${e}`, (n) => {
			let r = [...n.props.sources ?? []];
			r[e] = S({
				...x(r[e]),
				...t
			}), n.props.sources = r;
		});
	}
	function te() {
		a("sources", [...Ze(F(r).props.sources ?? []), ""]);
	}
	function ne(e) {
		a("sources", Ze(F(r).props.sources ?? []).filter((t, n) => n !== e));
	}
	function re() {
		let e = F(r).props, t = wh(e.design), n = (e, t) => () => o(e, t), i = Th(e), a = i === "agenda" ? 8 : 6, s = i === "next" ? 3 : void 0, l = e.switcher === !0 || e.switcherViews != null || e.toolsSize != null || e.description != null || e.showMore === !1 || (e.limit ?? 6) !== a || e.nextCount !== s || e.laterCount !== s || e.showCancelled === !1 || e.structuredData === !1 || e.clock != null || e.weekStart != null, u = [
			!t.ownFilter && e.showCategories === !0,
			e.showSubscribe !== !1,
			e.showSignup === !0,
			e.showSearch === !0,
			e.showEarlier === !0
		].filter(Boolean).length, f = u > 0 || e.showOpen === !1 || e.showAdd === !1 || !!e.programHref, p = !!e.emptyText || e.emptyIcon != null && e.emptyIcon !== "calendar", m = xh(e.design).filter((t) => e.options?.[t.key] != null).length, h = t.slots.filter((t) => e.colors?.[t.key]).length, g = Object.keys(e.fieldStyle ?? {}).length;
		return {
			sources: String((e.sources ?? []).filter((e) => {
				let t = x(e);
				return t.ref ? !!c(t.ref) : t.url.trim();
			}).length),
			view: K(d[Th(e)]),
			viewReset: l ? n("cal-view", {
				switcher: void 0,
				switcherViews: void 0,
				toolsSize: void 0,
				description: void 0,
				showMore: void 0,
				limit: a,
				nextCount: s,
				laterCount: s,
				showCancelled: void 0,
				structuredData: void 0,
				clock: void 0,
				weekStart: void 0
			}) : null,
			buttons: u ? K("menu.onCount", { n: u }) : K("common.off"),
			buttonsReset: f ? n("cal-buttons", {
				showCategories: !1,
				showSubscribe: !1,
				showSignup: !1,
				showSearch: void 0,
				showEarlier: void 0,
				showOpen: void 0,
				showAdd: void 0,
				programHref: void 0
			}) : null,
			empty: e.emptyText || K("menu.standard"),
			emptyReset: p ? n("cal-empty", {
				emptyText: void 0,
				emptyIcon: void 0
			}) : null,
			notice: e.notice?.show === !0 ? K("common.on") : K("common.off"),
			noticeReset: e.notice ? n("cal-notice", { notice: void 0 }) : null,
			opts: m ? K("menu.changed", { n: m }) : K("menu.standard"),
			optsReset: m ? n("cal-opts", { options: void 0 }) : null,
			colors: h ? K("menu.changedOf", {
				n: h,
				m: t.slots.length
			}) : K("menu.standard"),
			colorsReset: h ? n("cal-colors", { colors: void 0 }) : null,
			stripe: jh(t, e.stripe).show ? K("common.on") : K("common.off"),
			stripeReset: e.stripe ? n("cal-stripe", { stripe: void 0 }) : null,
			fields: g ? K("menu.changed", { n: g }) : K("menu.standard"),
			fieldsReset: g ? n("cal-fields", { fieldStyle: void 0 }) : null
		};
	}
	var ie = Xr(), ae = j(ie), oe = (e) => {
		let t = (e) => {
			var t = ny(), i = j(t);
			di(i, 17, () => F(r).props.sources ?? [], si, (e, t, n) => {
				let r = /* @__PURE__ */ D(() => x(F(t)));
				var i = Xr(), a = j(i), o = (e) => {
					let t = /* @__PURE__ */ D(() => c(F(r).ref));
					var i = Qv(), a = A(i), o = A(a);
					let s;
					var l = N(o, 2);
					let u;
					var d = M(l, !0), f = N(l, 2);
					V(f, () => q.cross, !0), E(f), E(a), E(i), P((e, n, r) => {
						s = Ii(o, "", s, { background: e }), u = H(l, 1, "tb-grow cal-ref-name", null, u, { muted: !F(t) }), z(d, n), G(f, "title", r);
					}, [
						() => _p(F(t)?.color),
						() => F(t) ? F(t).name || F(t).url : K("calendar.refMissing"),
						() => K("ui.remove")
					]), I("click", f, () => ne(n)), R(e, i);
				}, s = (e) => {
					var t = $v(), i = A(t), a = A(i);
					U(a);
					var o = N(a, 2);
					V(o, () => q.cross, !0), E(o), E(i);
					var s = N(i, 2), c = A(s);
					U(c);
					var l = N(c, 2);
					{
						let e = /* @__PURE__ */ D(() => F(r).color || "accent"), t = /* @__PURE__ */ D(u), i = /* @__PURE__ */ D(() => K("tip.calendar.sourceColor"));
						sl(l, {
							get value() {
								return F(e);
							},
							get tokens() {
								return F(t);
							},
							allowClear: !0,
							get label() {
								return F(i);
							},
							onchange: (e) => T(n, { color: e ?? "" })
						});
					}
					E(s);
					var d = N(s, 2), f = M(d, !0);
					E(t), P((e, t, n, i, s, l, u, p) => {
						W(a, F(r).url), G(a, "placeholder", e), G(a, "title", t), G(o, "title", n), W(c, F(r).name), G(c, "placeholder", i), G(c, "title", s), G(d, "title", l), d.disabled = u, z(f, p);
					}, [
						() => K("calendar.sourcesPh"),
						() => K("calendar.sourceUrl"),
						() => K("ui.remove"),
						() => K("calendar.sourceName"),
						() => K("tip.calendar.sourceName"),
						() => K("tip.calendar.saveToSite"),
						() => !F(r).url.trim(),
						() => K("calendar.saveToSite")
					]), I("change", a, (e) => T(n, { url: e.target.value.trim() })), I("click", o, () => ne(n)), I("change", c, (e) => T(n, { name: e.target.value.trim() })), I("click", d, () => ee(n)), R(e, t);
				};
				B(a, (e) => {
					F(r).ref ? e(o) : e(s, -1);
				}), R(e, i);
			});
			var a = N(i, 2), o = A(a);
			V(o, () => q.plus);
			var l = N(o);
			E(a);
			var d = N(a, 2), f = M(d, !0), p = N(d, 2);
			di(p, 17, s, (e) => e.id, (e, t) => {
				var n = ey(), r = A(n);
				U(r);
				var i = N(r);
				E(n), P((e) => {
					Vi(r, e), z(i, ` ${(F(t).name || F(t).url) ?? ""}`);
				}, [() => C().has(F(t).id)]), I("change", r, (e) => w(F(t).id, e.target.checked)), R(e, n);
			});
			var m = N(p, 2), h = (e) => {
				var t = ty(), n = M(t, !0);
				P((e) => z(n, e), [() => K("calendar.siteSourcesNone")]), R(e, t);
			}, g = /* @__PURE__ */ D(() => !s().length);
			B(m, (e) => {
				F(g) && e(h);
			});
			var _ = N(m, 2), v = M(_, !0);
			P((e, t, n, r) => {
				z(l, ` ${e ?? ""}`), G(d, "title", t), z(f, n), z(v, r);
			}, [
				() => K("ui.addCalendar"),
				() => K("tip.calendar.siteSources"),
				() => K("calendar.siteSources"),
				() => K("calendar.editSiteCalendars")
			]), I("click", a, te), I("click", _, () => n.openPanel("site", { calendars: !0 })), R(e, t);
		}, i = (e) => {
			var t = cy(), n = j(t), i = (e) => {
				var t = ry(), n = A(t), i = N(n);
				{
					let e = /* @__PURE__ */ D(() => F(r).props.view ?? "list"), t = /* @__PURE__ */ D(() => [
						["list", K("calendar.viewList")],
						["cards", K("calendar.viewCards")],
						["month", K("calendar.viewMonth")],
						["agenda", K("calendar.viewAgenda")],
						["next", K("calendar.viewNext")]
					]);
					J(i, {
						get value() {
							return F(e);
						},
						get options() {
							return F(t);
						},
						onchange: (e) => a("view", e)
					});
				}
				E(t), P((e) => z(n, `${e ?? ""} `), [() => K("lbl.view")]), R(e, t);
			}, o = /* @__PURE__ */ D(() => !wh(F(r).props.design).view);
			B(n, (e) => {
				F(o) && e(i);
			});
			var s = N(n, 2), c = (e) => {
				var t = ay(), n = j(t), i = A(n);
				U(i);
				var o = N(i);
				E(n);
				var s = N(n, 2), c = (e) => {
					let t = /* @__PURE__ */ D(() => vh(F(r).props));
					var n = iy(), i = j(n), o = A(i), s = M(o, !0), c = N(o, 2);
					{
						let e = /* @__PURE__ */ D(() => gh.map((e) => [e, K(`calendar.design.${e}`)]));
						J(c, {
							get value() {
								return F(t).week;
							},
							get options() {
								return F(e);
							},
							onchange: (e) => a("switcherViews", {
								...F(r).props.switcherViews ?? {},
								week: e
							})
						});
					}
					E(i);
					var l = N(i, 2), u = A(l), d = M(u, !0), f = N(u, 2);
					{
						let e = /* @__PURE__ */ D(() => _h.map((e) => [e, K(e === "month" ? "calendar.viewMonth" : `calendar.design.${e}`)]));
						J(f, {
							get value() {
								return F(t).month;
							},
							get options() {
								return F(e);
							},
							onchange: (e) => a("switcherViews", {
								...F(r).props.switcherViews ?? {},
								month: e
							})
						});
					}
					E(l), P((e, t, n, r) => {
						G(i, "title", e), z(s, t), G(l, "title", n), z(d, r);
					}, [
						() => K("tip.calendar.switchWeek"),
						() => K("calendar.switchWeek"),
						() => K("tip.calendar.switchMonth"),
						() => K("calendar.switchMonth")
					]), R(e, n);
				};
				B(s, (e) => {
					F(r).props.switcher === !0 && e(c);
				});
				var l = N(s, 2);
				{
					let e = /* @__PURE__ */ D(() => K("calendar.toolsSize")), t = /* @__PURE__ */ D(() => K("tip.calendar.toolsSize")), n = /* @__PURE__ */ D(() => ["s", "l"].includes(F(r).props.toolsSize) ? F(r).props.toolsSize : "m"), i = /* @__PURE__ */ D(() => [
						["s", K("calendar.toolsSize.s")],
						["m", K("calendar.toolsSize.m")],
						["l", K("calendar.toolsSize.l")]
					]);
					Wl(l, {
						get label() {
							return F(e);
						},
						get title() {
							return F(t);
						},
						get value() {
							return F(n);
						},
						get options() {
							return F(i);
						},
						onchange: (e) => a("toolsSize", e === "m" ? void 0 : e)
					});
				}
				P((e, t) => {
					G(n, "title", e), Vi(i, F(r).props.switcher === !0), z(o, ` ${t ?? ""}`);
				}, [() => K("tip.calendar.switcher"), () => K("calendar.switcher")]), I("change", i, (e) => a("switcher", e.target.checked || void 0)), R(e, t);
			}, l = /* @__PURE__ */ D(() => Eh.includes(Th(F(r).props)));
			B(s, (e) => {
				F(l) && e(c);
			});
			var u = N(s, 2), d = (e) => {
				{
					let t = /* @__PURE__ */ D(() => K("calendar.opt.description")), n = /* @__PURE__ */ D(() => K("tip.calendar.opt.description")), i = /* @__PURE__ */ D(() => yh(F(r).props)), o = /* @__PURE__ */ D(() => [["rows", K("calendar.descriptionRows")], ["card", K("calendar.descriptionCard")]]);
					Wl(e, {
						get label() {
							return F(t);
						},
						get title() {
							return F(n);
						},
						get value() {
							return F(i);
						},
						get options() {
							return F(o);
						},
						onchange: (e) => a("description", e === "rows" ? void 0 : e)
					});
				}
			}, f = /* @__PURE__ */ D(() => bh(F(r).props));
			B(u, (e) => {
				F(f) && e(d);
			});
			var p = N(u, 2), m = (e) => {
				var t = oy(), n = j(t), i = A(n), o = A(i), s = N(o);
				U(s), E(i), Cg(N(i, 2), { id: "limit" }), E(n);
				var c = N(n, 2), l = (e) => {
					var t = ey(), n = A(t);
					U(n);
					var i = N(n);
					E(t), P((e, a) => {
						G(t, "title", e), Vi(n, F(r).props.showMore !== !1), z(i, ` ${a ?? ""}`);
					}, [() => K("tip.calendar.showMore"), () => K("calendar.showMore")]), I("change", n, (e) => a("showMore", e.target.checked ? void 0 : !1)), R(e, t);
				}, u = /* @__PURE__ */ D(() => Th(F(r).props) === "list" && wh(F(r).props.design).module !== "more");
				B(c, (e) => {
					F(u) && e(l);
				}), P((e, t) => {
					G(i, "title", e), z(o, `${t ?? ""} `), W(s, F(r).props.limit ?? 6);
				}, [() => K("tip.collection.limit"), () => K("lbl.maxCount")]), I("change", s, (e) => a("limit", Math.max(1, Math.min(50, Number(e.target.value) || 6)))), R(e, t);
			}, h = /* @__PURE__ */ D(() => [
				"list",
				"cards",
				"agenda"
			].includes(F(r).props.view ?? "list"));
			B(p, (e) => {
				F(h) && e(m);
			});
			var g = N(p, 2), _ = A(g);
			U(_);
			var v = N(_);
			E(g);
			var y = N(g, 2), b = A(y);
			U(b);
			var x = N(b);
			E(y);
			var S = N(y, 2);
			{
				let e = /* @__PURE__ */ D(() => K("calendar.clock")), t = /* @__PURE__ */ D(() => K("tip.calendar.clock")), n = /* @__PURE__ */ D(() => F(r).props.clock === "12" ? "12" : "24"), i = /* @__PURE__ */ D(() => [["24", K("calendar.clock.24")], ["12", K("calendar.clock.12")]]);
				Wl(S, {
					get label() {
						return F(e);
					},
					get title() {
						return F(t);
					},
					get value() {
						return F(n);
					},
					get options() {
						return F(i);
					},
					onchange: (e) => a("clock", e === "12" ? "12" : void 0)
				});
			}
			var C = N(S, 2), w = (e) => {
				{
					let t = /* @__PURE__ */ D(() => K("calendar.weekStart")), n = /* @__PURE__ */ D(() => K("tip.calendar.weekStart")), i = /* @__PURE__ */ D(() => ["mon", "sun"].includes(F(r).props.weekStart) ? F(r).props.weekStart : "auto"), o = /* @__PURE__ */ D(() => [
						["auto", K("calendar.weekStart.auto")],
						["mon", K("calendar.weekStart.mon")],
						["sun", K("calendar.weekStart.sun")]
					]);
					Wl(e, {
						get label() {
							return F(t);
						},
						get title() {
							return F(n);
						},
						get value() {
							return F(i);
						},
						get options() {
							return F(o);
						},
						onchange: (e) => a("weekStart", e === "auto" ? void 0 : e)
					});
				}
			}, ee = /* @__PURE__ */ D(() => [
				"month",
				"week",
				"year",
				"agenda"
			].includes(Th(F(r).props)) || F(r).props.design === "bento" || F(r).props.switcher === !0);
			B(C, (e) => {
				F(ee) && e(w);
			});
			var T = N(C, 2), te = (e) => {
				var t = sy(), n = j(t);
				{
					let e = /* @__PURE__ */ D(() => K("calendar.nextCount")), t = /* @__PURE__ */ D(() => K("tip.calendar.nextCount")), i = /* @__PURE__ */ D(() => String(Math.min(3, Math.max(1, Number(F(r).props.nextCount) || 1))));
					Wl(n, {
						get label() {
							return F(e);
						},
						get title() {
							return F(t);
						},
						get value() {
							return F(i);
						},
						options: [
							["1", "1"],
							["2", "2"],
							["3", "3"]
						],
						onchange: (e) => a("nextCount", Number(e))
					});
				}
				var i = N(n, 2), o = A(i), s = M(o, !0), c = N(o, 2);
				U(c);
				var l = M(N(c, 2), !0);
				E(i), P((e, t) => {
					G(i, "title", e), z(s, t), W(c, F(r).props.laterCount ?? 0), z(l, F(r).props.laterCount ?? 0);
				}, [() => K("tip.calendar.laterCount"), () => K("calendar.laterCount")]), I("input", c, (e) => a("laterCount", e.target.valueAsNumber)), R(e, t);
			};
			B(T, (e) => {
				F(r).props.view === "next" && e(te);
			}), P((e, t, n, i) => {
				G(g, "title", e), Vi(_, F(r).props.showCancelled !== !1), z(v, ` ${t ?? ""}`), G(y, "title", n), Vi(b, F(r).props.structuredData !== !1), z(x, ` ${i ?? ""}`);
			}, [
				() => K("tip.calendar.showCancelled"),
				() => K("calendar.showCancelled"),
				() => K("tip.calendar.structuredData"),
				() => K("calendar.structuredData")
			]), I("change", _, (e) => a("showCancelled", e.target.checked ? void 0 : !1)), I("change", b, (e) => a("structuredData", e.target.checked ? void 0 : !1)), R(e, t);
		}, o = (e) => {
			var t = uy(), n = j(t), i = (e) => {
				var t = ey(), n = A(t);
				U(n);
				var i = N(n);
				E(t), P((e, a) => {
					G(t, "title", e), Vi(n, F(r).props.showCategories === !0), z(i, ` ${a ?? ""}`);
				}, [() => K("tip.calendar.showCategories"), () => K("calendar.showCategories")]), I("change", n, (e) => a("showCategories", e.target.checked)), R(e, t);
			}, o = /* @__PURE__ */ D(() => !wh(F(r).props.design).ownFilter);
			B(n, (e) => {
				F(o) && e(i);
			});
			var s = N(n, 2), c = A(s);
			U(c);
			var l = N(c);
			E(s);
			var u = N(s, 2), d = (e) => {
				var t = ey(), n = A(t);
				U(n);
				var i = N(n);
				E(t), P((e, a) => {
					G(t, "title", e), Vi(n, F(r).props.showEarlier === !0), z(i, ` ${a ?? ""}`);
				}, [() => K("tip.calendar.showEarlier"), () => K("calendar.showEarlier")]), I("change", n, (e) => a("showEarlier", e.target.checked ? !0 : void 0)), R(e, t);
			}, f = /* @__PURE__ */ D(() => ![
				"month",
				"week",
				"day",
				"year"
			].includes(Th(F(r).props)));
			B(u, (e) => {
				F(f) && e(d);
			});
			var p = N(u, 2), m = A(p), h = A(m);
			U(h);
			var g = N(h);
			E(m), Cg(N(m, 2), { id: "subscribe" }), E(p);
			var _ = N(p, 2), v = A(_);
			U(v);
			var y = N(v);
			E(_);
			var b = N(_, 2), x = A(b);
			U(x);
			var S = N(x);
			E(b);
			var C = N(b, 2), w = (e) => {
				var t = ey(), n = A(t);
				U(n);
				var i = N(n);
				E(t), P((e, a) => {
					G(t, "title", e), Vi(n, F(r).props.showOpen !== !1), z(i, ` ${a ?? ""}`);
				}, [() => K("tip.calendar.showOpen"), () => K("calendar.showOpen")]), I("change", n, (e) => a("showOpen", e.target.checked ? void 0 : !1)), R(e, t);
			}, ee = /* @__PURE__ */ D(() => wh(F(r).props.design).open);
			B(C, (e) => {
				F(ee) && e(w);
			});
			var T = N(C, 2), te = (e) => {
				var t = ly(), n = A(t), i = N(n);
				U(i), E(t), P((e, a) => {
					G(t, "title", e), z(n, `${a ?? ""} `), W(i, F(r).props.programHref ?? "");
				}, [() => K("tip.calendar.programHref"), () => K("calendar.programHref")]), I("change", i, (e) => a("programHref", e.target.value.trim() || void 0)), R(e, t);
			}, ne = /* @__PURE__ */ D(() => wh(F(r).props.design).program);
			B(T, (e) => {
				F(ne) && e(te);
			}), P((e, t, n, i, a, o) => {
				G(s, "title", e), Vi(c, F(r).props.showSearch === !0), z(l, ` ${t ?? ""}`), Vi(h, F(r).props.showSubscribe !== !1), z(g, ` ${n ?? ""}`), Vi(v, F(r).props.showSignup === !0), z(y, ` ${i ?? ""}`), G(b, "title", a), Vi(x, F(r).props.showAdd !== !1), z(S, ` ${o ?? ""}`);
			}, [
				() => K("tip.calendar.showSearch"),
				() => K("calendar.showSearch"),
				() => K("calendar.showSubscribe"),
				() => K("calendar.showSignup"),
				() => K("tip.calendar.showAdd"),
				() => K("calendar.showAdd")
			]), I("change", c, (e) => a("showSearch", e.target.checked ? !0 : void 0)), I("change", h, (e) => a("showSubscribe", e.target.checked)), I("change", v, (e) => a("showSignup", e.target.checked)), I("change", x, (e) => a("showAdd", e.target.checked ? void 0 : !1)), R(e, t);
		}, l = (e) => {
			var t = dy(), n = j(t), i = A(n), o = N(i);
			U(o), E(n);
			var s = N(n, 2), c = A(s), l = N(c);
			{
				let e = /* @__PURE__ */ D(() => F(r).props.emptyIcon === "none" ? "" : F(r).props.emptyIcon ?? "calendar"), t = /* @__PURE__ */ D(() => K("tip.calendar.emptyIcon"));
				Sl(l, {
					iconsOnly: !0,
					get icon() {
						return F(e);
					},
					klass: "lbtn-mark",
					get label() {
						return F(t);
					},
					onpick: (e) => a("emptyIcon", e.icon || "none"),
					children: (e, t) => {
						var n = Xr(), i = j(n), a = (e) => {
							var t = Xr();
							V(j(t), () => Zs(F(r).props.emptyIcon ?? "calendar") || Zs("calendar")), R(e, t);
						};
						B(i, (e) => {
							F(r).props.emptyIcon !== "none" && e(a);
						}), R(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			E(s), P((e, t, a, l, u) => {
				G(n, "title", e), z(i, `${t ?? ""} `), W(o, F(r).props.emptyText ?? ""), G(o, "placeholder", a), G(s, "title", l), z(c, `${u ?? ""} `);
			}, [
				() => K("tip.calendar.emptyText"),
				() => K("calendar.emptyText"),
				() => K("calendar.emptyPh"),
				() => K("tip.calendar.emptyIcon"),
				() => K("calendar.emptyIcon")
			]), I("change", o, (e) => a("emptyText", e.target.value.trim() || void 0)), R(e, t);
		}, d = (e) => {
			var t = Xr(), n = j(t), i = (e) => {
				var t = my(), n = j(t), i = A(n);
				U(i);
				var o = N(i);
				E(n);
				var s = N(n, 2), c = (e) => {
					var t = py(), n = j(t), i = (e) => {
						{
							let t = /* @__PURE__ */ D(() => K("calendar.noticeAs")), n = /* @__PURE__ */ D(() => K("tip.calendar.noticeAs")), i = /* @__PURE__ */ D(() => F(r).props.notice?.as === "band" ? "band" : "note"), o = /* @__PURE__ */ D(() => [["note", K("calendar.noticeAsNote")], ["band", K("calendar.noticeAsBand")]]);
							Wl(e, {
								get label() {
									return F(t);
								},
								get title() {
									return F(n);
								},
								get value() {
									return F(i);
								},
								get options() {
									return F(o);
								},
								onchange: (e) => a("notice", {
									...F(r).props.notice ?? {},
									as: e === "band" ? "band" : void 0
								})
							});
						}
					}, o = /* @__PURE__ */ D(() => wh(F(r).props.design).noticeBand);
					B(n, (e) => {
						F(o) && e(i);
					});
					var s = N(n, 2), c = A(s), l = N(c);
					U(l), E(s);
					var u = N(s, 2), d = (e) => {
						var t = fy(), n = A(t), r = N(n);
						vt(r), E(t), P((e, i, a) => {
							G(t, "title", e), z(n, `${i ?? ""} `), W(r, a);
						}, [
							() => K("tip.calendar.noticeBody"),
							() => K("calendar.noticeBody"),
							() => g("noticeText")
						]), I("change", r, (e) => _("noticeText", e.target.value)), R(e, t);
					}, f = /* @__PURE__ */ D(() => F(r).props.notice?.as !== "band" || !wh(F(r).props.design).noticeBand);
					B(u, (e) => {
						F(f) && e(d);
					});
					var p = N(u, 2), m = A(p), h = N(m);
					U(h), E(p), P((e, t, n, i, a, o) => {
						G(s, "title", e), z(c, `${t ?? ""} `), W(l, n), G(l, "placeholder", i), G(p, "title", a), z(m, `${o ?? ""} `), W(h, F(r).props.notice?.href ?? "");
					}, [
						() => K("tip.calendar.noticeHeading"),
						() => K("calendar.noticeHeading"),
						() => g("noticeTitle"),
						() => K("calendar.noticeTitleHint"),
						() => K("tip.calendar.noticeHref"),
						() => K("calendar.noticeHref")
					]), I("change", l, (e) => _("noticeTitle", e.target.value)), I("change", h, (e) => a("notice", {
						...F(r).props.notice ?? {},
						href: e.target.value.trim() || void 0
					})), R(e, t);
				};
				B(s, (e) => {
					F(r).props.notice?.show === !0 && e(c);
				}), P((e, t) => {
					G(n, "title", e), Vi(i, F(r).props.notice?.show === !0), z(o, ` ${t ?? ""}`);
				}, [() => K("tip.calendar.showNotice"), () => K("calendar.showNotice")]), I("change", i, (e) => a("notice", {
					...F(r).props.notice ?? {},
					show: e.target.checked
				})), R(e, t);
			}, o = /* @__PURE__ */ D(() => wh(F(r).props.design).notice);
			B(n, (e) => {
				F(o) && e(i);
			}), R(e, t);
		}, f = /* @__PURE__ */ D(re);
		var p = gy(), m = j(p);
		{
			let e = /* @__PURE__ */ D(() => K("calendar.sources"));
			qg(m, {
				id: "cal-sources",
				get title() {
					return F(e);
				},
				get value() {
					return F(f).sources;
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
		var h = N(m, 2);
		{
			let e = /* @__PURE__ */ D(() => K("calendar.group.view"));
			qg(h, {
				id: "cal-view",
				get title() {
					return F(e);
				},
				get value() {
					return F(f).view;
				},
				get reset() {
					return F(f).viewReset;
				},
				children: (e, t) => {
					i(e);
				},
				$$slots: { default: !0 }
			});
		}
		var v = N(h, 2);
		{
			let e = /* @__PURE__ */ D(() => K("calendar.group.buttons"));
			qg(v, {
				id: "cal-buttons",
				get title() {
					return F(e);
				},
				get value() {
					return F(f).buttons;
				},
				get reset() {
					return F(f).buttonsReset;
				},
				children: (e, t) => {
					o(e);
				},
				$$slots: { default: !0 }
			});
		}
		var y = N(v, 2);
		{
			let e = /* @__PURE__ */ D(() => K("calendar.group.empty"));
			qg(y, {
				id: "cal-empty",
				get title() {
					return F(e);
				},
				get value() {
					return F(f).empty;
				},
				get reset() {
					return F(f).emptyReset;
				},
				children: (e, t) => {
					l(e);
				},
				$$slots: { default: !0 }
			});
		}
		var b = N(y, 2), S = (e) => {
			{
				let t = /* @__PURE__ */ D(() => K("calendar.group.notice"));
				qg(e, {
					id: "cal-notice",
					get title() {
						return F(t);
					},
					get value() {
						return F(f).notice;
					},
					get reset() {
						return F(f).noticeReset;
					},
					children: (e, t) => {
						d(e);
					},
					$$slots: { default: !0 }
				});
			}
		}, ie = /* @__PURE__ */ D(() => wh(F(r).props.design).notice);
		B(b, (e) => {
			F(ie) && e(S);
		});
		var ae = N(b, 2), oe = (e) => {
			var t = hy(), n = M(t, !0);
			P((e, r) => {
				G(t, "title", e), z(n, r);
			}, [() => K("tip.calendar.resetTexts"), () => K("calendar.resetTexts")]), I("click", t, () => a("texts", Ih(F(r).props.texts))), R(e, t);
		}, se = /* @__PURE__ */ D(() => Fh(wh(F(r).props.design), F(r).props.texts));
		B(ae, (e) => {
			F(se) && e(oe);
		}), R(e, p);
	}, se = (e) => {
		let t = (e) => {
			var t = Xr(), n = j(t), i = (e) => {
				let t = /* @__PURE__ */ D(() => Sh(F(r).props));
				var n = Xr();
				di(j(n), 17, () => xh(F(r).props.design).filter((e) => Ch(e, F(t))), (e) => e.key, (e, n) => {
					var r = Xr(), i = j(r), a = (e) => {
						var r = ey(), i = A(r);
						U(i);
						var a = N(i);
						E(r), P((e, o) => {
							G(r, "title", e), Vi(i, F(t)[F(n).key]), z(a, ` ${o ?? ""}`);
						}, [() => F(n).tipKey ? K(F(n).tipKey) : void 0, () => K(F(n).labelKey)]), I("change", i, (e) => f(F(n), e.target.checked)), R(e, r);
					}, o = (e) => {
						var r = _y(), i = A(r), a = N(i);
						U(a), E(r), P((e, o, s) => {
							G(r, "title", e), z(i, `${o ?? ""} `), W(a, F(t)[F(n).key] ?? ""), G(a, "placeholder", s);
						}, [
							() => K("tip.calendar.opt.hours"),
							() => K(F(n).labelKey),
							() => K("calendar.opt.columns.auto")
						]), I("change", a, (e) => f(F(n), e.target.value === "" ? null : Math.max(0, Math.min(24, Math.round(Number(e.target.value)) || 0)))), R(e, r);
					}, s = (e) => {
						var r = vy(), i = A(r), a = M(i, !0), o = N(i, 2);
						{
							let e = /* @__PURE__ */ D(() => F(n).values.map((e) => [e, p(F(n), e)]));
							J(o, {
								get value() {
									return F(t)[F(n).key];
								},
								get options() {
									return F(e);
								},
								onchange: (e) => f(F(n), e)
							});
						}
						E(r), P((e) => z(a, e), [() => K(F(n).labelKey)]), R(e, r);
					}, c = (e) => {
						{
							let r = /* @__PURE__ */ D(() => K(F(n).labelKey)), i = /* @__PURE__ */ D(() => F(n).tipKey ? K(F(n).tipKey) : void 0), a = /* @__PURE__ */ D(() => F(n).values.map((e) => [e, p(F(n), e)]));
							Wl(e, {
								get label() {
									return F(r);
								},
								get title() {
									return F(i);
								},
								get value() {
									return F(t)[F(n).key];
								},
								get options() {
									return F(a);
								},
								onchange: (e) => f(F(n), e)
							});
						}
					};
					B(i, (e) => {
						F(n).kind === "switch" ? e(a) : F(n).kind === "hour" ? e(o, 1) : F(n).values.length > 4 ? e(s, 2) : e(c, -1);
					}), R(e, r);
				}), R(e, n);
			}, a = /* @__PURE__ */ D(() => xh(F(r).props.design).length);
			B(n, (e) => {
				F(a) && e(i);
			}), R(e, t);
		}, i = (e) => {
			var t = Xr();
			di(j(t), 19, () => m(F(s)), (e) => e.section, (e, t, n) => {
				var i = xy(), a = j(i), o = (e) => {
					var n = yy(), r = M(n, !0);
					P((e) => z(r, e), [() => K(`calendar.section.${F(t).section}`)]), R(e, n);
				};
				B(a, (e) => {
					F(n) > 0 && e(o);
				});
				var s = N(a, 2);
				di(s, 21, () => F(t).slots, (e) => e.key, (e, t) => {
					var n = by(), i = A(n);
					{
						let e = /* @__PURE__ */ D(() => F(r).props.colors?.[F(t).key] ?? ""), n = /* @__PURE__ */ D(u), a = /* @__PURE__ */ D(() => K(F(t).labelKey));
						sl(i, {
							get value() {
								return F(e);
							},
							get tokens() {
								return F(n);
							},
							allowClear: !0,
							get label() {
								return F(a);
							},
							onchange: (e) => v(F(t).key, e || "")
						});
					}
					var a = M(N(i, 2), !0);
					E(n), P((e, t) => {
						G(n, "title", e), z(a, t);
					}, [() => K("tip.calendar.slot"), () => K(F(t).labelKey)]), R(e, n);
				}), E(s), R(e, i);
			}), R(e, t);
		}, a = (e) => {
			var t = my(), n = j(t), i = A(n);
			U(i);
			var a = N(i);
			E(n);
			var o = N(n, 2), c = (e) => {
				var t = vy(), n = A(t), i = M(n, !0), a = N(n, 2);
				{
					let e = /* @__PURE__ */ D(() => F(r).props.stripe?.color ?? ""), t = /* @__PURE__ */ D(u), n = /* @__PURE__ */ D(() => K("calendar.stripeColor"));
					sl(a, {
						get value() {
							return F(e);
						},
						get tokens() {
							return F(t);
						},
						allowClear: !0,
						get label() {
							return F(n);
						},
						onchange: (e) => y({ color: e || void 0 })
					});
				}
				E(t), P((e, n) => {
					G(t, "title", e), z(i, n);
				}, [() => K("tip.calendar.stripeColor"), () => K("calendar.stripeColor")]), R(e, t);
			}, l = /* @__PURE__ */ D(() => jh(F(s), F(r).props.stripe).show);
			B(o, (e) => {
				F(l) && e(c);
			}), P((e, t, r) => {
				G(n, "title", e), Vi(i, t), z(a, ` ${r ?? ""}`);
			}, [
				() => K("tip.calendar.stripe"),
				() => jh(F(s), F(r).props.stripe).show,
				() => K("calendar.stripe")
			]), I("change", i, (e) => y({ show: e.target.checked })), R(e, t);
		}, o = (e) => {
			var t = Sy(), n = j(t);
			{
				let e = /* @__PURE__ */ D(() => Bm.map((e) => [e, K(`calendar.field.${e}`)]));
				J(n, {
					get value() {
						return F(Zv);
					},
					get options() {
						return F(e);
					},
					onchange: (e) => k(Zv, e, !0)
				});
			}
			var r = N(n, 2), i = A(r), a = N(i);
			{
				let e = /* @__PURE__ */ D(() => h().font ?? ""), t = /* @__PURE__ */ D(() => [["", K("common.inherit")], ...Gl.map(([e, t]) => [t, K(e)])]);
				J(a, {
					get value() {
						return F(e);
					},
					get options() {
						return F(t);
					},
					onchange: (e) => b({ font: e || void 0 })
				});
			}
			E(r);
			var o = N(r, 2), s = A(o), c = N(s);
			U(c), E(o);
			var l = N(o, 2);
			{
				let e = /* @__PURE__ */ D(() => K("calendar.fieldWeight")), t = /* @__PURE__ */ D(() => h().bold === !0 ? "bold" : h().bold === !1 ? "normal" : ""), n = /* @__PURE__ */ D(() => [
					["", K("common.inherit")],
					["bold", K("format.bold")],
					["normal", K("calendar.fieldNormal")]
				]);
				Wl(l, {
					get label() {
						return F(e);
					},
					get value() {
						return F(t);
					},
					get options() {
						return F(n);
					},
					onchange: (e) => b({ bold: e === "bold" || e !== "normal" && void 0 })
				});
			}
			var d = N(l, 2), f = A(d);
			let p;
			var m = M(A(f), !0);
			E(f);
			var g = N(f, 2);
			let _;
			var v = M(A(g), !0);
			E(g);
			var y = N(g, 2);
			{
				let e = /* @__PURE__ */ D(() => h().color ?? ""), t = /* @__PURE__ */ D(u), n = /* @__PURE__ */ D(() => K("calendar.fieldColor"));
				sl(y, {
					get value() {
						return F(e);
					},
					get tokens() {
						return F(t);
					},
					allowClear: !0,
					get label() {
						return F(n);
					},
					onchange: (e) => b({ color: e || void 0 })
				});
			}
			E(d), P((e, t, n, r, a, l, u, d, h, y, b) => {
				z(i, `${e ?? ""} `), G(o, "title", t), z(s, `${n ?? ""} `), G(c, "min", Mh.min), G(c, "max", Mh.max), W(c, r), G(c, "placeholder", a), p = H(f, 1, "tbtn", null, p, { active: l }), G(f, "title", u), z(m, d), _ = H(g, 1, "tbtn", null, _, { active: h }), G(g, "title", y), z(v, b);
			}, [
				() => K("calendar.fieldFont"),
				() => K("tip.calendar.fieldSize"),
				() => K("calendar.fieldSize"),
				() => h().size ?? "",
				() => K("common.inherit"),
				() => h().italic === !0,
				() => K("format.italic"),
				() => K("format.italicLetter"),
				() => h().underline === !0,
				() => K("calendar.fieldUnderline"),
				() => K("format.underlineLetter")
			]), I("change", c, (e) => b({ size: e.target.value === "" ? void 0 : Math.max(Mh.min, Math.min(Mh.max, Number(e.target.value) || Mh.min)) })), I("click", f, () => b({ italic: !h().italic || void 0 })), I("click", g, () => b({ underline: !h().underline || void 0 })), R(e, t);
		}, s = /* @__PURE__ */ D(() => wh(F(r).props.design)), c = /* @__PURE__ */ D(re);
		var l = Cy(), d = j(l), g = A(d), _ = A(g), x = M(_, !0), S = M(N(_), !0);
		E(g), Cg(N(g, 2), { id: "design" }), E(d);
		var C = N(d, 2), w = A(C), ee = A(w), T = M(ee, !0), te = M(N(ee), !0);
		E(w), Cg(N(w, 2), { id: "phoneView" }), E(C);
		var ne = N(C, 2), ie = A(ne), ae = A(ie), oe = M(ae, !0), se = M(N(ae), !0);
		E(ie), Cg(N(ie, 2), { id: "card" }), E(ne);
		var ce = N(ne, 2);
		{
			let e = /* @__PURE__ */ D(() => K("calendar.section.options"));
			qg(ce, {
				id: "cal-opts",
				get title() {
					return F(e);
				},
				get value() {
					return F(c).opts;
				},
				get reset() {
					return F(c).optsReset;
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
		var le = N(ce, 2);
		{
			let e = /* @__PURE__ */ D(() => K("calendar.colors"));
			qg(le, {
				id: "cal-colors",
				get title() {
					return F(e);
				},
				get value() {
					return F(c).colors;
				},
				get reset() {
					return F(c).colorsReset;
				},
				children: (e, t) => {
					i(e);
				},
				$$slots: { default: !0 }
			});
		}
		var ue = N(le, 2);
		{
			let e = /* @__PURE__ */ D(() => K("calendar.stripe"));
			qg(ue, {
				id: "cal-stripe",
				get title() {
					return F(e);
				},
				get value() {
					return F(c).stripe;
				},
				get reset() {
					return F(c).stripeReset;
				},
				children: (e, t) => {
					a(e);
				},
				$$slots: { default: !0 }
			});
		}
		var de = N(ue, 2);
		{
			let e = /* @__PURE__ */ D(() => K("calendar.fieldStyle"));
			qg(de, {
				id: "cal-fields",
				get title() {
					return F(e);
				},
				get value() {
					return F(c).fields;
				},
				get reset() {
					return F(c).fieldsReset;
				},
				children: (e, t) => {
					o(e);
				},
				$$slots: { default: !0 }
			});
		}
		P((e, t, n, r, i, a, o, s, c) => {
			G(g, "title", e), z(x, t), z(S, n), G(w, "title", r), z(T, i), z(te, a), G(ie, "title", o), z(oe, s), z(se, c);
		}, [
			() => K("tip.calendar.design"),
			() => K("calendar.design"),
			() => K(F(s).labelKey),
			() => K("tip.calendar.phoneView"),
			() => K("calendar.phoneView"),
			() => K(Qm(th(F(r).props), F(r).props).labelKey),
			() => K("tip.calendar.card"),
			() => K("calendar.card"),
			() => K(oh(ch(F(r).props)).labelKey)
		]), I("click", g, function(...e) {
			n.openDesignPicker?.apply(this, e);
		}), I("click", w, function(...e) {
			n.openPhonePicker?.apply(this, e);
		}), I("click", ie, function(...e) {
			n.openCardPicker?.apply(this, e);
		}), R(e, l);
	};
	B(ae, (e) => {
		t.area === "content" ? e(oe) : t.area === "style" && e(se, 1);
	}), R(e, ie), ot();
}
Vr([
	"click",
	"change",
	"input"
]);
//#endregion
//#region src/menu/families/Form.svelte
var Ty = /* @__PURE__ */ L("<div class=\"pin-line\"><label> <!></label> <!></div>"), Ey = /* @__PURE__ */ L("<label> <input/></label>"), Dy = /* @__PURE__ */ L("<label> <input/></label> <label> <input/></label>", 1), Oy = /* @__PURE__ */ L("<!> <!>", 1), ky = /* @__PURE__ */ L("<input/>"), Ay = /* @__PURE__ */ L("<span class=\"nav-line\"><input/> <!> <span class=\"row-tools\"><button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button></span></span> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!>", 1), jy = /* @__PURE__ */ L("<!> <button class=\"ghost action\"> </button>", 1), My = /* @__PURE__ */ L("<!> <!> <!>", 1);
function Ny(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock), { mutateBlock: i, setBlockProp: a, setBlockProps: o } = n, { groupOf: s } = b_(() => F(r).props, o), c = /* @__PURE__ */ D(() => (F(r).props.mode ?? "mailto") === "endpoint" ? "endpoint" : "mailto"), l = () => [["mailto", K("form.modeMailto")], ["endpoint", K("form.modeEndpoint")]], u = [
		"text",
		"email",
		"tel",
		"textarea",
		"select",
		"checkbox",
		"radio",
		"date"
	], d = /* @__PURE__ */ new Set(["select", "radio"]), f = () => "f" + [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(3))].map((e) => e.toString(16).padStart(2, "0")).join("");
	function p(e, t) {
		i(`edit:${F(r).blockId}:field${e}`, (n) => {
			let r = {
				...n.props.fields[e],
				...t
			};
			d.has(r.type) ? r.options ??= [] : delete r.options, n.props.fields[e] = r;
		});
	}
	function m(e, t) {
		p(e, { options: String(t).split(",").map((e) => e.trim()).filter(Boolean) });
	}
	function h() {
		i("form-field", (e) => {
			e.props.fields ??= [], e.props.fields.push({
				id: f(),
				label: K("form.newField"),
				type: "text",
				required: !1
			});
		});
	}
	function g(e) {
		i("form-field", (t) => {
			t.props.fields.splice(e, 1);
		});
	}
	function _(e, t) {
		let n = e + t;
		i("form-field", (t) => {
			n < 0 || n >= t.props.fields.length || ([t.props.fields[e], t.props.fields[n]] = [t.props.fields[n], t.props.fields[e]]);
		});
	}
	var v = Xr(), y = j(v), b = (e) => {
		let t = (e) => {
			var t = Oy(), n = j(t);
			m_(n, {
				key: "mode",
				children: (e, t) => {
					var n = Ty(), r = A(n), i = A(r), o = N(i);
					{
						let e = /* @__PURE__ */ D(l);
						J(o, {
							get value() {
								return F(c);
							},
							get options() {
								return F(e);
							},
							onchange: (e) => a("mode", e)
						});
					}
					E(r), Cg(N(r, 2), { id: "sendMode" }), E(n), P((e, t) => {
						G(r, "title", e), z(i, `${t ?? ""} `);
					}, [() => K("form.modeTitle"), () => K("form.mode")]), R(e, n);
				},
				$$slots: { default: !0 }
			});
			var i = N(n, 2), o = (e) => {
				var t = Ey(), n = A(t), i = N(n);
				U(i), E(t), P((e, a, o) => {
					G(t, "title", e), z(n, `${a ?? ""} `), W(i, F(r).props.endpoint ?? ""), G(i, "placeholder", o);
				}, [
					() => K("form.endpointNote"),
					() => K("form.endpoint"),
					() => K("form.endpointPh")
				]), I("change", i, (e) => a("endpoint", e.target.value.trim())), R(e, t);
			}, s = (e) => {
				var t = Dy(), n = j(t), i = A(n), o = N(i);
				U(o), E(n);
				var s = N(n, 2), c = A(s), l = N(c);
				U(l), E(s), P((e, t, n, a) => {
					z(i, `${e ?? ""} `), W(o, F(r).props.recipient ?? ""), G(o, "placeholder", t), z(c, `${n ?? ""} `), W(l, F(r).props.subject ?? ""), G(l, "placeholder", a);
				}, [
					() => K("form.recipient"),
					() => K("form.recipientPh"),
					() => K("form.subject"),
					() => K("form.subjectPh")
				]), I("change", o, (e) => a("recipient", e.target.value.trim())), I("change", l, (e) => a("subject", e.target.value.trim())), R(e, t);
			};
			B(i, (e) => {
				F(c) === "endpoint" ? e(o) : e(s, -1);
			}), R(e, t);
		}, n = (e) => {
			var t = jy(), n = j(t);
			di(n, 19, () => F(r).props.fields ?? [], (e, t) => e.id ?? t, (e, t, n) => {
				var i = Ay(), a = j(i), o = A(a);
				U(o);
				var s = N(o, 2);
				{
					let e = /* @__PURE__ */ D(() => F(t).type ?? "text"), r = /* @__PURE__ */ D(() => u.map((e) => [e, K(`form.type${e[0].toUpperCase()}${e.slice(1)}`)]));
					J(s, {
						get value() {
							return F(e);
						},
						get options() {
							return F(r);
						},
						onchange: (e) => p(F(n), { type: e })
					});
				}
				var c = N(s, 2), l = A(c);
				V(l, () => q.up, !0), E(l);
				var f = N(l, 2);
				V(f, () => q.down, !0), E(f);
				var h = N(f, 2);
				V(h, () => q.cross, !0), E(h), E(c), E(a);
				var v = N(a, 2), y = A(v);
				U(y);
				var b = N(y);
				E(v);
				var x = N(v, 2), S = (e) => {
					var r = ky();
					U(r), P((e, t) => {
						W(r, e), G(r, "placeholder", t);
					}, [() => (F(t).options ?? []).join(", "), () => K("form.optionsPh")]), I("change", r, (e) => m(F(n), e.target.value)), R(e, r);
				}, C = /* @__PURE__ */ D(() => d.has(F(t).type));
				B(x, (e) => {
					F(C) && e(S);
				}), P((e, i, a) => {
					W(o, F(t).label), G(o, "placeholder", e), l.disabled = F(n) === 0, f.disabled = F(n) === (F(r).props.fields?.length ?? 0) - 1, G(h, "title", i), Vi(y, F(t).required === !0), z(b, ` ${a ?? ""}`);
				}, [
					() => K("form.fieldNamePh"),
					() => K("form.removeField"),
					() => K("form.required")
				]), I("change", o, (e) => p(F(n), { label: e.target.value.trim() || K("form.fieldFallback") })), I("click", l, () => _(F(n), -1)), I("click", f, () => _(F(n), 1)), I("click", h, () => g(F(n))), I("change", y, (e) => p(F(n), { required: e.target.checked })), R(e, i);
			});
			var i = N(n, 2), a = M(i, !0);
			P((e) => z(a, e), [() => K("form.addField")]), I("click", i, h), R(e, t);
		}, i = (e) => {
			var t = Dy(), n = j(t), i = A(n), o = N(i);
			U(o), E(n);
			var s = N(n, 2), c = A(s), l = N(c);
			U(l), E(s), P((e, t, n, a) => {
				z(i, `${e ?? ""} `), W(o, F(r).props.submitLabel ?? ""), G(o, "placeholder", t), z(c, `${n ?? ""} `), W(l, F(r).props.successText ?? ""), G(l, "placeholder", a);
			}, [
				() => K("lbl.buttonText"),
				() => K("form.sendDefault"),
				() => K("form.receipt"),
				() => K("form.thanksDefault")
			]), I("change", o, (e) => a("submitLabel", e.target.value.trim() || K("form.sendDefault"))), I("change", l, (e) => a("successText", e.target.value.trim() || K("form.thanksDefault"))), R(e, t);
		};
		var o = My(), f = j(o);
		{
			let e = /* @__PURE__ */ D(() => K("group.sending")), n = /* @__PURE__ */ D(() => F(c) === "endpoint" ? F(r).props.endpoint || K("form.modeEndpoint") : F(r).props.recipient || K("form.modeMailto")), i = /* @__PURE__ */ D(() => s("form-sending", { mode: "mailto" }));
			qg(f, {
				id: "form-sending",
				get title() {
					return F(e);
				},
				get value() {
					return F(n);
				},
				get group() {
					return F(i);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
		var v = N(f, 2);
		{
			let e = /* @__PURE__ */ D(() => K("form.fields")), t = /* @__PURE__ */ D(() => String(F(r).props.fields?.length ?? 0));
			qg(v, {
				id: "form-fields",
				get title() {
					return F(e);
				},
				get value() {
					return F(t);
				},
				children: (e, t) => {
					n(e);
				},
				$$slots: { default: !0 }
			});
		}
		var y = N(v, 2);
		{
			let e = /* @__PURE__ */ D(() => K("group.buttonReceipt")), t = /* @__PURE__ */ D(() => F(r).props.submitLabel || K("form.sendDefault"));
			qg(y, {
				id: "form-receipt",
				get title() {
					return F(e);
				},
				get value() {
					return F(t);
				},
				children: (e, t) => {
					i(e);
				},
				$$slots: { default: !0 }
			});
		}
		R(e, o);
	};
	B(y, (e) => {
		t.area === "content" && e(b);
	}), R(e, v), ot();
}
Vr(["change", "click"]);
//#endregion
//#region src/menu/families/Faq.svelte
var Py = /* @__PURE__ */ L("<span class=\"nav-line\"><input/> <span class=\"row-tools\"><button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button></span></span>"), Fy = /* @__PURE__ */ L("<label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label>"), Iy = /* @__PURE__ */ L("<!> <button class=\"ghost action\"> </button> <!>", 1), Ly = /* @__PURE__ */ L("<div class=\"pin-line\"><!> <!></div>"), Ry = /* @__PURE__ */ L("<!> <!>", 1);
function zy(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock), { mutateBlock: i, setBlockProp: a, setBlockProps: o } = n, { groupChanged: s, groupOf: c } = b_(() => F(r).props, o), l = /* @__PURE__ */ D(() => F(r).props.variant === "list" ? "list" : "cards"), u = ["cards", "list"];
	function d(e, t) {
		i(`edit:${F(r).blockId}:faq${e}`, (n) => {
			n.props.items[e] = {
				...n.props.items[e],
				...t
			};
		});
	}
	function f() {
		i("faq-item", (e) => {
			e.props.items ??= [], e.props.items.push({
				q: K("seed.faq.newQ"),
				a: K("seed.faq.answer")
			});
		});
	}
	function p(e) {
		i("faq-item", (t) => {
			t.props.items.splice(e, 1);
		});
	}
	function m(e, t) {
		let n = e + t;
		i("faq-item", (t) => {
			n < 0 || n >= t.props.items.length || ([t.props.items[e], t.props.items[n]] = [t.props.items[n], t.props.items[e]]);
		});
	}
	var h = Xr(), g = j(h), _ = (e) => {
		let t = (e) => {
			var t = Iy(), n = j(t);
			di(n, 17, () => F(r).props.items ?? [], si, (e, t, n) => {
				var i = Py(), a = A(i);
				U(a);
				var o = N(a, 2), s = A(o);
				s.disabled = n === 0, V(s, () => q.up, !0), E(s);
				var c = N(s, 2);
				V(c, () => q.down, !0), E(c);
				var l = N(c, 2);
				V(l, () => q.cross, !0), E(l), E(o), E(i), P((e, i) => {
					W(a, F(t).q), G(a, "title", e), c.disabled = n === (F(r).props.items?.length ?? 0) - 1, G(l, "title", i);
				}, [() => K("tip.faq.question"), () => K("tip.faq.remove")]), I("change", a, (e) => d(n, { q: e.target.value })), I("click", s, () => m(n, -1)), I("click", c, () => m(n, 1)), I("click", l, () => p(n)), R(e, i);
			});
			var i = N(n, 2), o = M(i, !0), s = N(i, 2);
			{
				let e = /* @__PURE__ */ D(() => K("common.off"));
				m_(s, {
					key: "multi",
					get shown() {
						return F(e);
					},
					children: (e, t) => {
						var n = Fy(), i = A(n);
						U(i);
						var o = N(i);
						E(n), P((e, t, r) => {
							G(n, "title", e), Vi(i, t), z(o, ` ${r ?? ""}`);
						}, [
							() => K("tip.faq.multi"),
							() => !!F(r).props.multi,
							() => K("lbl.faqMulti")
						]), I("change", i, (e) => a("multi", e.target.checked)), R(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			P((e) => z(o, e), [() => K("ui.addQuestion")]), I("click", i, f), R(e, t);
		};
		{
			let n = /* @__PURE__ */ D(() => K("lbl.questions")), i = /* @__PURE__ */ D(() => String(F(r).props.items?.length ?? 0)), a = /* @__PURE__ */ D(() => c("faq-questions", { multi: !1 }));
			qg(e, {
				id: "faq-questions",
				defaultOpen: !0,
				get title() {
					return F(n);
				},
				get value() {
					return F(i);
				},
				get group() {
					return F(a);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
	}, v = (e) => {
		let t = (e) => {
			m_(e, {
				key: "variant",
				children: (e, t) => {
					var n = Ly(), r = A(n);
					{
						let e = /* @__PURE__ */ D(() => K("lbl.variant")), t = /* @__PURE__ */ D(() => u.map((e) => [e, K(`opt.faqVariant.${e}`)]));
						Wl(r, {
							get label() {
								return F(e);
							},
							get value() {
								return F(l);
							},
							get options() {
								return F(t);
							},
							onchange: (e) => a("variant", e)
						});
					}
					Cg(N(r, 2), { id: "variant" }), E(n), R(e, n);
				},
				$$slots: { default: !0 }
			});
		}, n = (e) => {
			v_(e, {});
		}, r = /* @__PURE__ */ D(() => s({ boxStyle: void 0 }));
		var i = Ry(), o = j(i);
		{
			let e = /* @__PURE__ */ D(() => K("lbl.variant")), n = /* @__PURE__ */ D(() => K(`opt.faqVariant.${F(l)}`)), r = /* @__PURE__ */ D(() => c("faq-variant", { variant: "cards" }));
			qg(o, {
				id: "faq-variant",
				get title() {
					return F(e);
				},
				get value() {
					return F(n);
				},
				get group() {
					return F(r);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
		var d = N(o, 2), f = (e) => {
			{
				let t = /* @__PURE__ */ D(() => K("lbl.cardStyle")), i = /* @__PURE__ */ D(() => F(r) ? K("menu.changed", { n: F(r) }) : K("menu.standard")), a = /* @__PURE__ */ D(() => c("faq-card", { boxStyle: void 0 }));
				qg(e, {
					id: "faq-card",
					get title() {
						return F(t);
					},
					get value() {
						return F(i);
					},
					get group() {
						return F(a);
					},
					children: (e, t) => {
						n(e);
					},
					$$slots: { default: !0 }
				});
			}
		};
		B(d, (e) => {
			F(l) !== "list" && e(f);
		}), R(e, i);
	};
	B(g, (e) => {
		t.area === "content" ? e(_) : t.area === "style" && e(v, 1);
	}), R(e, h), ot();
}
Vr(["change", "click"]);
//#endregion
//#region src/menu/families/Timeline.svelte
var By = /* @__PURE__ */ L("<span class=\"nav-line\"><input/> <span class=\"row-tools\"><button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button></span></span> <input/> <input/>", 1), Vy = /* @__PURE__ */ L("<!> <button class=\"ghost action\"> </button>", 1), Hy = /* @__PURE__ */ L("<div class=\"pin-line\"><label> <!></label> <!></div>"), Uy = /* @__PURE__ */ L("<label> <!></label>"), Wy = /* @__PURE__ */ L("<!> <!> <!>", 1);
function Gy(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock), { mutateBlock: i, setBlockProp: a, setBlockProps: o, themeSwatches: s } = n, { groupOf: c } = b_(() => F(r).props, o), l = () => [["left", K("opt.timeline.left")], ["alternating", K("opt.timeline.alternating")]];
	function u(e, t) {
		i(`edit:${F(r).blockId}:tl${e}`, (n) => {
			n.props.items[e] = {
				...n.props.items[e],
				...t
			};
		});
	}
	function d() {
		i("tl-item", (e) => {
			e.props.items ??= [], e.props.items.push({
				year: "",
				title: K("seed.timeline.newTitle"),
				text: ""
			});
		});
	}
	function f(e) {
		i("tl-item", (t) => {
			t.props.items.splice(e, 1);
		});
	}
	function p(e, t) {
		let n = e + t;
		i("tl-item", (t) => {
			n < 0 || n >= t.props.items.length || ([t.props.items[e], t.props.items[n]] = [t.props.items[n], t.props.items[e]]);
		});
	}
	var m = Xr(), h = j(m), g = (e) => {
		let t = (e) => {
			var t = Vy(), n = j(t);
			di(n, 17, () => F(r).props.items ?? [], si, (e, t, n) => {
				var i = By(), a = j(i), o = A(a);
				U(o);
				var s = N(o, 2), c = A(s);
				c.disabled = n === 0, V(c, () => q.up, !0), E(c);
				var l = N(c, 2);
				V(l, () => q.down, !0), E(l);
				var d = N(l, 2);
				V(d, () => q.cross, !0), E(d), E(s), E(a);
				var m = N(a, 2);
				U(m);
				var h = N(m, 2);
				U(h), P((e, i, a, s, c, u) => {
					W(o, F(t).year), G(o, "placeholder", e), G(o, "title", i), l.disabled = n === (F(r).props.items?.length ?? 0) - 1, G(d, "title", a), W(m, F(t).title), G(m, "title", s), W(h, F(t).text), G(h, "placeholder", c), G(h, "title", u);
				}, [
					() => K("ph.tlYear"),
					() => K("tip.timeline.year"),
					() => K("tip.timeline.remove"),
					() => K("tip.timeline.title"),
					() => K("ph.tlText"),
					() => K("tip.timeline.text")
				]), I("change", o, (e) => u(n, { year: e.target.value })), I("click", c, () => p(n, -1)), I("click", l, () => p(n, 1)), I("click", d, () => f(n)), I("change", m, (e) => u(n, { title: e.target.value })), I("change", h, (e) => u(n, { text: e.target.value })), R(e, i);
			});
			var i = N(n, 2), a = M(i, !0);
			P((e) => z(a, e), [() => K("ui.addTlItem")]), I("click", i, d), R(e, t);
		};
		{
			let n = /* @__PURE__ */ D(() => K("lbl.timelineItems")), i = /* @__PURE__ */ D(() => String(F(r).props.items?.length ?? 0));
			qg(e, {
				id: "tl-events",
				defaultOpen: !0,
				get title() {
					return F(n);
				},
				get value() {
					return F(i);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
	}, _ = (e) => {
		let t = (e) => {
			var t = Wy(), n = j(t);
			m_(n, {
				key: "variant",
				children: (e, t) => {
					var n = Hy(), i = A(n), o = A(i), s = N(o);
					{
						let e = /* @__PURE__ */ D(() => F(r).props.variant ?? "left"), t = /* @__PURE__ */ D(l);
						J(s, {
							get value() {
								return F(e);
							},
							get options() {
								return F(t);
							},
							onchange: (e) => a("variant", e)
						});
					}
					E(i), Cg(N(i, 2), { id: "variant" }), E(n), P((e) => z(o, `${e ?? ""} `), [() => K("lbl.variant")]), R(e, n);
				},
				$$slots: { default: !0 }
			});
			var i = N(n, 2);
			m_(i, {
				key: "marker",
				children: (e, t) => {
					var n = Uy(), i = A(n), o = N(i);
					{
						let e = /* @__PURE__ */ D(() => F(r).props.marker ?? "filled"), t = /* @__PURE__ */ D(() => [["filled", K("opt.timeline.filled")], ["ring", K("opt.timeline.ring")]]);
						J(o, {
							get value() {
								return F(e);
							},
							get options() {
								return F(t);
							},
							onchange: (e) => a("marker", e)
						});
					}
					E(n), P((e) => z(i, `${e ?? ""} `), [() => K("lbl.timelineMarker")]), R(e, n);
				},
				$$slots: { default: !0 }
			}), m_(N(i, 2), {
				key: "accent",
				source: "theme",
				children: (e, t) => {
					var n = Uy(), i = A(n), o = N(i);
					{
						let e = /* @__PURE__ */ D(() => F(r).props.accent ?? "accent"), t = /* @__PURE__ */ D(s);
						sl(o, {
							get value() {
								return F(e);
							},
							get tokens() {
								return F(t);
							},
							onchange: (e) => a("accent", e === "accent" ? null : e)
						});
					}
					E(n), P((e) => z(i, `${e ?? ""} `), [() => K("lbl.color")]), R(e, n);
				},
				$$slots: { default: !0 }
			}), R(e, t);
		};
		{
			let n = /* @__PURE__ */ D(() => K("group.appearance")), i = /* @__PURE__ */ D(() => l().find(([e]) => e === (F(r).props.variant ?? "left"))?.[1] ?? ""), a = /* @__PURE__ */ D(() => c("tl-look", {
				variant: "left",
				marker: "filled",
				accent: null
			}));
			qg(e, {
				id: "tl-look",
				defaultOpen: !0,
				get title() {
					return F(n);
				},
				get value() {
					return F(i);
				},
				get group() {
					return F(a);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
	};
	B(h, (e) => {
		t.area === "content" ? e(g) : t.area === "style" && e(_, 1);
	}), R(e, m), ot();
}
Vr(["change", "click"]);
//#endregion
//#region src/menu/families/Quote.svelte
var Ky = /* @__PURE__ */ L("<label> <input/></label> <label> <input/></label> <label> <input/></label>", 1), qy = /* @__PURE__ */ L("<div class=\"pin-line\"><label> <!></label> <!></div>"), Jy = /* @__PURE__ */ L("<button class=\"ghost\"> </button>"), Yy = /* @__PURE__ */ L("<label class=\"ghost filepick\"> <input type=\"file\" accept=\"image/*\"/></label> <!>", 1), Xy = /* @__PURE__ */ L("<label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label>"), Zy = /* @__PURE__ */ L("<!> <!>", 1), Qy = /* @__PURE__ */ L("<label> <!></label>");
function $y(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock), { mutateBlock: i, setBlockProp: a, setBlockProps: o, compressOrTrim: s, imageErrorText: c, setStatus: l, themeSwatches: u } = n, { groupChanged: d, groupOf: f } = b_(() => F(r).props, o), p = () => [["large", K("opt.quote.large")], ["short", K("opt.quote.short")]], m = /* @__PURE__ */ D(() => {
		let e = (F(r).props.attribution ?? "").trim();
		if (e) return e;
		let t = (F(r).props.text ?? "").trim();
		return t.length > 40 ? `${t.slice(0, 40)}…` : t;
	});
	async function h(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", t) try {
			let e = await s(t);
			i(`edit:${F(r).blockId}`, (t) => {
				t.props.image = e.dataUrl;
			});
		} catch (e) {
			l(c(e), "error");
		}
	}
	var g = Xr(), _ = j(g), v = (e) => {
		let t = (e) => {
			var t = Ky(), n = j(t), i = A(n), o = N(i);
			U(o), E(n);
			var s = N(n, 2), c = A(s), l = N(c);
			U(l), E(s);
			var u = N(s, 2), d = A(u), f = N(d);
			U(f), E(u), P((e, t, n) => {
				z(i, `${e ?? ""} `), W(o, F(r).props.text ?? ""), z(c, `${t ?? ""} `), W(l, F(r).props.attribution ?? ""), z(d, `${n ?? ""} `), W(f, F(r).props.role ?? "");
			}, [
				() => K("lbl.quoteText"),
				() => K("lbl.quoteName"),
				() => K("lbl.quoteRole")
			]), I("change", o, (e) => a("text", e.target.value)), I("change", l, (e) => a("attribution", e.target.value)), I("change", f, (e) => a("role", e.target.value)), R(e, t);
		};
		{
			let n = /* @__PURE__ */ D(() => K("group.quote"));
			qg(e, {
				id: "quote-words",
				defaultOpen: !0,
				get title() {
					return F(n);
				},
				get value() {
					return F(m);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
	}, y = (e) => {
		let t = (e) => {
			var t = Zy(), n = j(t);
			m_(n, {
				key: "variant",
				children: (e, t) => {
					var n = qy(), i = A(n), o = A(i), s = N(o);
					{
						let e = /* @__PURE__ */ D(() => F(r).props.variant ?? "large"), t = /* @__PURE__ */ D(p);
						J(s, {
							get value() {
								return F(e);
							},
							get options() {
								return F(t);
							},
							onchange: (e) => a("variant", e)
						});
					}
					E(i), Cg(N(i, 2), { id: "variant" }), E(n), P((e) => z(o, `${e ?? ""} `), [() => K("lbl.variant")]), R(e, n);
				},
				$$slots: { default: !0 }
			});
			var i = N(n, 2), o = (e) => {
				var t = Yy(), n = j(t), i = A(n), o = N(i);
				E(n);
				var s = N(n, 2), c = (e) => {
					var t = Jy(), n = M(t, !0);
					P((e) => z(n, e), [() => K("ui.quotePortraitRemove")]), I("click", t, () => a("image", "")), R(e, t);
				};
				B(s, (e) => {
					F(r).props.image && e(c);
				}), P((e) => z(i, `${e ?? ""} `), [() => K("ui.quotePortrait")]), I("change", o, h), R(e, t);
			}, s = (e) => {
				{
					let t = /* @__PURE__ */ D(() => K("common.off"));
					m_(e, {
						key: "card",
						get shown() {
							return F(t);
						},
						children: (e, t) => {
							var n = Xy(), i = A(n);
							U(i);
							var o = N(i);
							E(n), P((e, t) => {
								G(n, "title", e), Vi(i, F(r).props.card === !0), z(o, ` ${t ?? ""}`);
							}, [() => K("tip.quote.card"), () => K("lbl.quoteCard")]), I("change", i, (e) => a("card", e.target.checked)), R(e, n);
						},
						$$slots: { default: !0 }
					});
				}
			};
			B(i, (e) => {
				F(r).props.variant === "short" ? e(o) : e(s, -1);
			}), R(e, t);
		}, n = (e) => {
			m_(e, {
				key: "accent",
				source: "theme",
				children: (e, t) => {
					var n = Qy(), i = A(n), o = N(i);
					{
						let e = /* @__PURE__ */ D(() => F(r).props.accent ?? "accent"), t = /* @__PURE__ */ D(u);
						sl(o, {
							get value() {
								return F(e);
							},
							get tokens() {
								return F(t);
							},
							onchange: (e) => a("accent", e === "accent" ? null : e)
						});
					}
					E(n), P((e) => z(i, `${e ?? ""} `), [() => K("lbl.color")]), R(e, n);
				},
				$$slots: { default: !0 }
			});
		}, i = /* @__PURE__ */ D(() => d({ accent: null }));
		var o = Zy(), s = j(o);
		{
			let e = /* @__PURE__ */ D(() => K("lbl.variant")), n = /* @__PURE__ */ D(() => p().find(([e]) => e === (F(r).props.variant ?? "large"))?.[1] ?? ""), i = /* @__PURE__ */ D(() => f("quote-variant", {
				variant: "large",
				card: !1,
				image: ""
			}));
			qg(s, {
				id: "quote-variant",
				get title() {
					return F(e);
				},
				get value() {
					return F(n);
				},
				get group() {
					return F(i);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
		var c = N(s, 2);
		{
			let e = /* @__PURE__ */ D(() => K("lbl.color")), t = /* @__PURE__ */ D(() => F(i) ? K("menu.changed", { n: F(i) }) : K("menu.standard")), r = /* @__PURE__ */ D(() => f("quote-colour", { accent: null }));
			qg(c, {
				id: "quote-colour",
				get title() {
					return F(e);
				},
				get value() {
					return F(t);
				},
				get group() {
					return F(r);
				},
				children: (e, t) => {
					n(e);
				},
				$$slots: { default: !0 }
			});
		}
		R(e, o);
	};
	B(_, (e) => {
		t.area === "content" ? e(v) : t.area === "style" && e(y, 1);
	}), R(e, g), ot();
}
Vr(["change", "click"]);
//#endregion
//#region src/menu/families/Stats.svelte
var eb = /* @__PURE__ */ L("<label> <input/></label> <label> <input/></label> <label> <input/></label> <label> <input/></label>", 1), tb = /* @__PURE__ */ L("<div class=\"pin-line\"><!> <!></div>"), nb = /* @__PURE__ */ L("<label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label>"), rb = /* @__PURE__ */ L("<!> <!>", 1);
function ib(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock), { setBlockProp: i, setBlockProps: a } = n, { groupOf: o } = b_(() => F(r).props, a), s = /* @__PURE__ */ D(() => c.includes(F(r).props.variant) ? F(r).props.variant : "plain"), c = [
		"plain",
		"cards",
		"band"
	];
	var l = Xr(), u = j(l), d = (e) => {
		let t = (e) => {
			var t = eb(), n = j(t), a = A(n), o = N(a);
			U(o), E(n);
			var s = N(n, 2), c = A(s), l = N(c);
			U(l), E(s);
			var u = N(s, 2), d = A(u), f = N(d);
			U(f), E(u);
			var p = N(u, 2), m = A(p), h = N(m);
			U(h), E(p), P((e, t, n, i, s) => {
				z(a, `${e ?? ""} `), W(o, F(r).props.value ?? ""), G(o, "title", t), z(c, `${n ?? ""} `), W(l, F(r).props.prefix ?? ""), z(d, `${i ?? ""} `), W(f, F(r).props.suffix ?? ""), z(m, `${s ?? ""} `), W(h, F(r).props.label ?? "");
			}, [
				() => K("lbl.statValue"),
				() => K("tip.stat.value"),
				() => K("lbl.statPrefix"),
				() => K("lbl.statSuffix"),
				() => K("lbl.statLabel")
			]), I("change", o, (e) => i("value", e.target.value)), I("change", l, (e) => i("prefix", e.target.value)), I("change", f, (e) => i("suffix", e.target.value)), I("change", h, (e) => i("label", e.target.value)), R(e, t);
		};
		{
			let n = /* @__PURE__ */ D(() => K("group.number")), i = /* @__PURE__ */ D(() => `${F(r).props.prefix ?? ""}${F(r).props.value ?? ""}${F(r).props.suffix ?? ""}`.trim());
			qg(e, {
				id: "stat-number",
				defaultOpen: !0,
				get title() {
					return F(n);
				},
				get value() {
					return F(i);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
	}, f = (e) => {
		let t = (e) => {
			var t = rb(), n = j(t);
			m_(n, {
				key: "variant",
				children: (e, t) => {
					var n = tb(), r = A(n);
					{
						let e = /* @__PURE__ */ D(() => K("lbl.variant")), t = /* @__PURE__ */ D(() => c.map((e) => [e, K(`opt.statVariant.${e}`)]));
						Wl(r, {
							get label() {
								return F(e);
							},
							get value() {
								return F(s);
							},
							get options() {
								return F(t);
							},
							onchange: (e) => i("variant", e)
						});
					}
					Cg(N(r, 2), { id: "variant" }), E(n), R(e, n);
				},
				$$slots: { default: !0 }
			});
			var a = N(n, 2);
			{
				let e = /* @__PURE__ */ D(() => K("common.on"));
				m_(a, {
					key: "countUp",
					get shown() {
						return F(e);
					},
					children: (e, t) => {
						var n = nb(), a = A(n);
						U(a);
						var o = N(a);
						E(n), P((e, t) => {
							G(n, "title", e), Vi(a, F(r).props.countUp !== !1), z(o, ` ${t ?? ""}`);
						}, [() => K("tip.stat.countUp"), () => K("lbl.statCountUp")]), I("change", a, (e) => i("countUp", e.target.checked)), R(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			R(e, t);
		};
		{
			let n = /* @__PURE__ */ D(() => K("group.appearance")), r = /* @__PURE__ */ D(() => K(`opt.statVariant.${F(s)}`)), i = /* @__PURE__ */ D(() => o("stat-look", {
				variant: "plain",
				countUp: !0
			}));
			qg(e, {
				id: "stat-look",
				defaultOpen: !0,
				get title() {
					return F(n);
				},
				get value() {
					return F(r);
				},
				get group() {
					return F(i);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
	};
	B(u, (e) => {
		t.area === "content" ? e(d) : t.area === "style" && e(f, 1);
	}), R(e, l), ot();
}
Vr(["change"]);
//#endregion
//#region src/menu/families/Table.svelte
var ab = /* @__PURE__ */ L("<label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label>"), ob = /* @__PURE__ */ L("<span class=\"toolbar-row\"><button class=\"ghost\"> </button> <button class=\"ghost\"> </button></span> <span class=\"toolbar-row\"><button class=\"ghost\"> </button> <button class=\"ghost\"> </button></span> <!>", 1), sb = /* @__PURE__ */ L("<div class=\"pin-line\"><label> <!></label> <!></div>"), cb = /* @__PURE__ */ L("<!> <!>", 1);
function lb(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock), { mutateBlock: i, setBlockProp: a, setBlockProps: o } = n, { groupOf: s } = b_(() => F(r).props, o), c = /* @__PURE__ */ D(() => {
		let e = Array.isArray(F(r).props.rows) ? F(r).props.rows : [], t = Math.max(1, ...e.map((e) => Array.isArray(e) ? e.length : 1), 1);
		return `${Math.max(1, e.length)} × ${t}`;
	}), l = () => [
		["rows", K("opt.table.rows")],
		["grid", K("opt.table.grid")],
		["none", K("common.none")]
	];
	function u(e, t) {
		i(`edit:${F(r).blockId}:table-form`, (n) => {
			let r = (Array.isArray(n.props.rows) && n.props.rows.length ? n.props.rows : [[""]]).map((e) => Array.isArray(e) ? e.map((e) => String(e ?? "")) : [""]), i = Math.max(1, ...r.map((e) => e.length));
			r = r.map((e) => [...e, ...Array(i - e.length).fill("")]), e > 0 ? r.push(Array(i).fill("")) : e < 0 && r.length > 1 && r.pop(), t > 0 ? r = r.map((e) => [...e, ""]) : t < 0 && i > 1 && (r = r.map((e) => e.slice(0, i - 1))), n.props.rows = r;
		});
	}
	var d = Xr(), f = j(d), p = (e) => {
		let t = (e) => {
			var t = ob(), n = j(t), i = A(n), o = M(i, !0), s = N(i, 2), c = M(s, !0);
			E(n);
			var l = N(n, 2), d = A(l), f = M(d, !0), p = N(d, 2), m = M(p, !0);
			E(l);
			var h = N(l, 2);
			{
				let e = /* @__PURE__ */ D(() => K("common.on"));
				m_(h, {
					key: "header",
					get shown() {
						return F(e);
					},
					children: (e, t) => {
						var n = ab(), i = A(n);
						U(i);
						var o = N(i);
						E(n), P((e, t) => {
							G(n, "title", e), Vi(i, F(r).props.header !== !1), z(o, ` ${t ?? ""}`);
						}, [() => K("tip.table.header"), () => K("lbl.tableHeader")]), I("change", i, (e) => a("header", e.target.checked)), R(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			P((e, t, n, r) => {
				z(o, e), z(c, t), z(f, n), z(m, r);
			}, [
				() => K("ui.addRow"),
				() => K("ui.removeRow"),
				() => K("ui.addColumn"),
				() => K("ui.removeColumn")
			]), I("click", i, () => u(1, 0)), I("click", s, () => u(-1, 0)), I("click", d, () => u(0, 1)), I("click", p, () => u(0, -1)), R(e, t);
		};
		{
			let n = /* @__PURE__ */ D(() => K("group.rowsColumns")), r = /* @__PURE__ */ D(() => s("table-shape", { header: !0 }));
			qg(e, {
				id: "table-shape",
				defaultOpen: !0,
				get title() {
					return F(n);
				},
				get value() {
					return F(c);
				},
				get group() {
					return F(r);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
	}, m = (e) => {
		let t = (e) => {
			var t = cb(), n = j(t);
			m_(n, {
				key: "lines",
				children: (e, t) => {
					var n = sb(), i = A(n), o = A(i), s = N(o);
					{
						let e = /* @__PURE__ */ D(() => F(r).props.lines ?? "rows"), t = /* @__PURE__ */ D(l);
						J(s, {
							get value() {
								return F(e);
							},
							get options() {
								return F(t);
							},
							onchange: (e) => a("lines", e)
						});
					}
					E(i), Cg(N(i, 2), { id: "tableLines" }), E(n), P((e) => z(o, `${e ?? ""} `), [() => K("lbl.tableLines")]), R(e, n);
				},
				$$slots: { default: !0 }
			});
			var i = N(n, 2);
			{
				let e = /* @__PURE__ */ D(() => K("common.off"));
				m_(i, {
					key: "striped",
					get shown() {
						return F(e);
					},
					children: (e, t) => {
						var n = ab(), i = A(n);
						U(i);
						var o = N(i);
						E(n), P((e, t) => {
							Vi(i, e), z(o, ` ${t ?? ""}`);
						}, [() => !!F(r).props.striped, () => K("lbl.tableStriped")]), I("change", i, (e) => a("striped", e.target.checked)), R(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			R(e, t);
		};
		{
			let n = /* @__PURE__ */ D(() => K("lbl.tableLines")), i = /* @__PURE__ */ D(() => l().find(([e]) => e === (F(r).props.lines ?? "rows"))?.[1] ?? ""), a = /* @__PURE__ */ D(() => s("table-lines", {
				lines: "rows",
				striped: !1
			}));
			qg(e, {
				id: "table-lines",
				defaultOpen: !0,
				get title() {
					return F(n);
				},
				get value() {
					return F(i);
				},
				get group() {
					return F(a);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
	};
	B(f, (e) => {
		t.area === "content" ? e(p) : t.area === "style" && e(m, 1);
	}), R(e, d), ot();
}
Vr(["click", "change"]);
//#endregion
//#region src/menu/families/Share.svelte
var ub = /* @__PURE__ */ L("<label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label>"), db = /* @__PURE__ */ L("<img alt=\"\"/>"), fb = /* @__PURE__ */ L("<label class=\"gridmenu-snap link-pick\"><input type=\"checkbox\"/> <span class=\"footer-soc-preview\" aria-hidden=\"true\"><!></span> </label>"), pb = /* @__PURE__ */ L("<!> <button class=\"ghost action\"> </button>", 1), mb = /* @__PURE__ */ L("<!> <!> <span class=\"mini-label\"> </span> <!>", 1), hb = /* @__PURE__ */ L("<div class=\"pin-line\"><label> <!></label> <!></div>"), gb = /* @__PURE__ */ L("<label> <input type=\"number\" min=\"24\" max=\"64\"/></label>"), _b = /* @__PURE__ */ L("<label> <!></label>"), vb = /* @__PURE__ */ L("<!> <!> <!>", 1);
function yb(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock), { mutateBlock: i, setBlockProp: a, setBlockProps: o, themeSwatches: s, siteLinks: c } = n, l = /* @__PURE__ */ D(() => F(r).props.useSite !== !1);
	function u(e, t) {
		i(`edit:${F(r).blockId}:hidden`, (n) => {
			let r = new Set(Array.isArray(n.props.hidden) ? n.props.hidden : []);
			t ? r.delete(e) : r.add(e), n.props.hidden = [...r];
		});
	}
	function d(e) {
		i(`edit:${F(r).blockId}:links`, (t) => {
			t.props.links ??= [], e(t.props.links);
		});
	}
	let { groupOf: f } = b_(() => F(r).props, o), p = () => [["icons", K("opt.share.icons")], ["labels", K("opt.share.labels")]];
	var m = Xr(), h = j(m), g = (e) => {
		let t = (e) => {
			var t = mb(), i = j(t);
			{
				let e = /* @__PURE__ */ D(() => K("common.on"));
				m_(i, {
					key: "useSite",
					get shown() {
						return F(e);
					},
					children: (e, t) => {
						var n = ub(), r = A(n);
						U(r);
						var i = N(r);
						E(n), P((e, t) => {
							G(n, "title", e), Vi(r, F(l)), z(i, ` ${t ?? ""}`);
						}, [() => K("tip.share.useSite"), () => K("lbl.useSiteLinks")]), I("change", r, (e) => a("useSite", e.target.checked)), R(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			var o = N(i, 2), s = (e) => {
				var t = pb(), i = j(t);
				di(i, 17, c, (e) => e.id, (e, t) => {
					var n = fb(), i = A(n);
					U(i);
					var a = N(i, 2), o = A(a), s = (e) => {
						var n = db();
						P(() => G(n, "src", F(t).image)), R(e, n);
					}, c = (e) => {
						var n = Xr();
						V(j(n), () => Zs(F(t).icon) || ""), R(e, n);
					};
					B(o, (e) => {
						F(t).image ? e(s) : e(c, -1);
					}), E(a);
					var l = N(a);
					E(n), P((e) => {
						Vi(i, e), z(l, ` ${(F(t).label || Ys[F(t).icon]?.label || F(t).url) ?? ""}`);
					}, [() => !(F(r).props.hidden ?? []).includes(F(t).id)]), I("change", i, (e) => u(F(t).id, e.target.checked)), R(e, n);
				});
				var a = N(i, 2), o = M(a, !0);
				P((e) => z(o, e), [() => K("ui.editSiteLinks")]), I("click", a, () => {
					n.siteLinksOpen = !0, n.openPanel("site");
				}), R(e, t);
			};
			B(o, (e) => {
				F(l) && e(s);
			});
			var f = N(o, 2), p = M(f, !0), m = N(f, 2);
			{
				let e = /* @__PURE__ */ D(() => F(r).props.links ?? []);
				pm(m, {
					get links() {
						return F(e);
					},
					onchange: (e, t) => d((n) => {
						n[e] = {
							...n[e],
							...t
						};
					}),
					onadd: () => d((e) => e.push({
						id: es("link"),
						icon: "globe",
						label: "",
						url: ""
					})),
					onremove: (e) => d((t) => t.splice(e, 1)),
					onmove: (e, t) => d((n) => {
						let r = e + t;
						r >= 0 && r < n.length && ([n[e], n[r]] = [n[r], n[e]]);
					})
				});
			}
			P((e) => z(p, e), [() => K("lbl.ownLinks")]), R(e, t);
		};
		{
			let n = /* @__PURE__ */ D(() => K("group.siteLinks")), i = /* @__PURE__ */ D(() => String((F(l) ? c().filter((e) => !(F(r).props.hidden ?? []).includes(e.id)).length : 0) + (F(r).props.links ?? []).length)), a = /* @__PURE__ */ D(() => f("share-services", {
				useSite: !0,
				hidden: []
			}));
			qg(e, {
				id: "share-services",
				defaultOpen: !0,
				get title() {
					return F(n);
				},
				get value() {
					return F(i);
				},
				get group() {
					return F(a);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
	}, _ = (e) => {
		let t = (e) => {
			var t = vb(), n = j(t);
			m_(n, {
				key: "variant",
				children: (e, t) => {
					var n = hb(), i = A(n), o = A(i), s = N(o);
					{
						let e = /* @__PURE__ */ D(() => F(r).props.variant ?? "icons"), t = /* @__PURE__ */ D(p);
						J(s, {
							get value() {
								return F(e);
							},
							get options() {
								return F(t);
							},
							onchange: (e) => a("variant", e)
						});
					}
					E(i), Cg(N(i, 2), { id: "variant" }), E(n), P((e) => z(o, `${e ?? ""} `), [() => K("lbl.variant")]), R(e, n);
				},
				$$slots: { default: !0 }
			});
			var i = N(n, 2);
			m_(i, {
				key: "size",
				shown: "38",
				children: (e, t) => {
					var n = gb(), i = A(n), o = N(i);
					U(o), E(n), P((e) => {
						z(i, `${e ?? ""} `), W(o, F(r).props.size ?? 38);
					}, [() => K("lbl.size")]), I("change", o, (e) => a("size", Number(e.target.value) || 38)), R(e, n);
				},
				$$slots: { default: !0 }
			}), m_(N(i, 2), {
				key: "color",
				source: "theme",
				children: (e, t) => {
					var n = _b(), i = A(n), o = N(i);
					{
						let e = /* @__PURE__ */ D(() => F(r).props.color || "accent"), t = /* @__PURE__ */ D(s);
						sl(o, {
							get value() {
								return F(e);
							},
							get tokens() {
								return F(t);
							},
							onchange: (e) => a("color", e === "accent" ? "" : e)
						});
					}
					E(n), P((e) => z(i, `${e ?? ""} `), [() => K("lbl.color")]), R(e, n);
				},
				$$slots: { default: !0 }
			}), R(e, t);
		};
		{
			let n = /* @__PURE__ */ D(() => K("group.appearance")), i = /* @__PURE__ */ D(() => p().find(([e]) => e === (F(r).props.variant ?? "icons"))?.[1] ?? ""), a = /* @__PURE__ */ D(() => f("share-look", {
				variant: "icons",
				size: 38,
				color: ""
			}));
			qg(e, {
				id: "share-look",
				defaultOpen: !0,
				get title() {
					return F(n);
				},
				get value() {
					return F(i);
				},
				get group() {
					return F(a);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
	};
	B(h, (e) => {
		t.area === "content" ? e(g) : t.area === "style" && e(_, 1);
	}), R(e, m), ot();
}
Vr(["change", "click"]);
//#endregion
//#region src/menu/families/Countdown.svelte
var bb = /* @__PURE__ */ L("<label> <input type=\"datetime-local\"/></label> <label> <input/></label>", 1), xb = /* @__PURE__ */ L("<label> <!></label>"), Sb = /* @__PURE__ */ L("<div class=\"pin-line\"><label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!></div>"), Cb = /* @__PURE__ */ L("<!> <!>", 1);
function wb(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock), { setBlockProp: i, setBlockProps: a } = n, { groupOf: o } = b_(() => F(r).props, a), s = () => [["boxes", K("opt.countdown.boxes")], ["plain", K("opt.countdown.plain")]];
	var c = Xr(), l = j(c), u = (e) => {
		let t = (e) => {
			var t = bb(), n = j(t), a = A(n), o = N(a);
			U(o), E(n);
			var s = N(n, 2), c = A(s), l = N(c);
			U(l), E(s), P((e, t, n) => {
				z(a, `${e ?? ""} `), W(o, F(r).props.target ?? ""), G(s, "title", t), z(c, `${n ?? ""} `), W(l, F(r).props.doneText ?? "");
			}, [
				() => K("lbl.countdownTarget"),
				() => K("tip.countdown.done"),
				() => K("lbl.countdownDone")
			]), I("change", o, (e) => i("target", e.target.value)), I("change", l, (e) => i("doneText", e.target.value)), R(e, t);
		};
		{
			let n = /* @__PURE__ */ D(() => K("group.target")), i = /* @__PURE__ */ D(() => F(r).props.target ? F(r).props.target.replace("T", " ") : K("common.none"));
			qg(e, {
				id: "countdown-target",
				defaultOpen: !0,
				get title() {
					return F(n);
				},
				get value() {
					return F(i);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
	}, d = (e) => {
		let t = (e) => {
			var t = Cb(), n = j(t);
			m_(n, {
				key: "variant",
				children: (e, t) => {
					var n = xb(), a = A(n), o = N(a);
					{
						let e = /* @__PURE__ */ D(() => F(r).props.variant ?? "boxes"), t = /* @__PURE__ */ D(s);
						J(o, {
							get value() {
								return F(e);
							},
							get options() {
								return F(t);
							},
							onchange: (e) => i("variant", e)
						});
					}
					E(n), P((e) => z(a, `${e ?? ""} `), [() => K("lbl.variant")]), R(e, n);
				},
				$$slots: { default: !0 }
			});
			var a = N(n, 2);
			{
				let e = /* @__PURE__ */ D(() => K("common.on"));
				m_(a, {
					key: "showSeconds",
					get shown() {
						return F(e);
					},
					children: (e, t) => {
						var n = Sb(), a = A(n), o = A(a);
						U(o);
						var s = N(o);
						E(a), Cg(N(a, 2), { id: "seconds" }), E(n), P((e) => {
							Vi(o, F(r).props.showSeconds !== !1), z(s, ` ${e ?? ""}`);
						}, [() => K("lbl.countdownSeconds")]), I("change", o, (e) => i("showSeconds", e.target.checked)), R(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			R(e, t);
		};
		{
			let n = /* @__PURE__ */ D(() => K("group.appearance")), i = /* @__PURE__ */ D(() => s().find(([e]) => e === (F(r).props.variant ?? "boxes"))?.[1] ?? ""), a = /* @__PURE__ */ D(() => o("countdown-look", {
				variant: "boxes",
				showSeconds: !0
			}));
			qg(e, {
				id: "countdown-look",
				defaultOpen: !0,
				get title() {
					return F(n);
				},
				get value() {
					return F(i);
				},
				get group() {
					return F(a);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
	};
	B(l, (e) => {
		t.area === "content" ? e(u) : t.area === "style" && e(d, 1);
	}), R(e, c), ot();
}
Vr(["change"]);
//#endregion
//#region src/menu/families/Audio.svelte
var Tb = /* @__PURE__ */ L("<button class=\"ghost\"> </button>"), Eb = /* @__PURE__ */ L("<label class=\"ghost filepick\"> <input type=\"file\" accept=\"audio/*\"/></label> <!> <label> <input/></label>", 1), Db = /* @__PURE__ */ L("<div class=\"pin-line\"><label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!></div>"), Ob = /* @__PURE__ */ L("<!> <!>", 1);
function kb(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock), { setBlockProp: i, setBlockProps: a, setStatus: o } = n, { groupOf: s } = b_(() => F(r).props, a);
	function c(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", !t) return;
		let n = new FileReader();
		n.onload = () => {
			i("src", String(n.result ?? "")), t.size > 4e5 && o(K("status.audioLarge", { kb: Math.round(t.size / 1024) }), "error");
		}, n.onerror = () => o(K("status.imageReadError"), "error"), n.readAsDataURL(t);
	}
	var l = Xr(), u = j(l), d = (e) => {
		let t = (e) => {
			var t = Eb(), n = j(t), a = A(n), o = N(a);
			E(n);
			var s = N(n, 2), l = (e) => {
				var t = Tb(), n = M(t, !0);
				P((e) => z(n, e), [() => K("ui.removeAudio")]), I("click", t, () => i("src", "")), R(e, t);
			};
			B(s, (e) => {
				F(r).props.src && e(l);
			});
			var u = N(s, 2), d = A(u), f = N(d);
			U(f), E(u), P((e, t, i) => {
				G(n, "title", e), z(a, `${t ?? ""} `), z(d, `${i ?? ""} `), W(f, F(r).props.title ?? "");
			}, [
				() => K("tip.blocks.audioFile"),
				() => K("ui.chooseAudio"),
				() => K("lbl.audioTitle")
			]), I("change", o, c), I("change", f, (e) => i("title", e.target.value)), R(e, t);
		}, n = (e) => {
			{
				let t = /* @__PURE__ */ D(() => K("common.off"));
				m_(e, {
					key: "loop",
					get shown() {
						return F(t);
					},
					children: (e, t) => {
						var n = Db(), a = A(n), o = A(a);
						U(o);
						var s = N(o);
						E(a), Cg(N(a, 2), { id: "loop" }), E(n), P((e, t) => {
							Vi(o, e), z(s, ` ${t ?? ""}`);
						}, [() => !!F(r).props.loop, () => K("lbl.audioLoop")]), I("change", o, (e) => i("loop", e.target.checked)), R(e, n);
					},
					$$slots: { default: !0 }
				});
			}
		};
		var a = Ob(), o = j(a);
		{
			let e = /* @__PURE__ */ D(() => K("group.audioFile")), n = /* @__PURE__ */ D(() => F(r).props.title || (F(r).props.src ? K("blocks.audio") : K("common.none")));
			qg(o, {
				id: "audio-file",
				get title() {
					return F(e);
				},
				get value() {
					return F(n);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
		var l = N(o, 2);
		{
			let e = /* @__PURE__ */ D(() => K("group.playback")), t = /* @__PURE__ */ D(() => F(r).props.loop ? K("lbl.audioLoop") : K("menu.standard")), i = /* @__PURE__ */ D(() => s("audio-playback", { loop: !1 }));
			qg(l, {
				id: "audio-playback",
				get title() {
					return F(e);
				},
				get value() {
					return F(t);
				},
				get group() {
					return F(i);
				},
				children: (e, t) => {
					n(e);
				},
				$$slots: { default: !0 }
			});
		}
		R(e, a);
	};
	B(u, (e) => {
		t.area === "content" && e(d);
	}), R(e, l), ot();
}
Vr(["change", "click"]);
//#endregion
//#region src/menu/families/Collection.svelte
var Ab = /* @__PURE__ */ L("<div class=\"pin-line\"><label> <input type=\"number\" min=\"0\" max=\"100\"/></label> <!></div>"), jb = /* @__PURE__ */ L("<label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label>"), Mb = /* @__PURE__ */ L("<label> <!></label> <!> <!>", 1), Nb = /* @__PURE__ */ L("<div class=\"pin-line\"><label> <!></label> <!></div>");
function Pb(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock), i = /* @__PURE__ */ D(() => n.collectionIds), a = /* @__PURE__ */ D(() => n.collectionsView), { setBlockProp: o, setBlockProps: s } = n, { groupOf: c } = b_(() => F(r).props, s), l = () => [
		["cards", K("opt.collectionView.cards")],
		["list", K("opt.collectionView.list")],
		["archive", K("opt.collectionView.archive")]
	];
	var u = Xr(), d = j(u), f = (e) => {
		let t = (e) => {
			var t = Mb(), n = j(t), s = A(n), c = N(s);
			{
				let e = /* @__PURE__ */ D(() => F(r).props.collection ?? ""), t = /* @__PURE__ */ D(() => [["", K("common.choose")], ...F(i).map((e) => [e, F(a)[e]?.name ?? e])]);
				J(c, {
					get value() {
						return F(e);
					},
					get options() {
						return F(t);
					},
					onchange: (e) => o("collection", e || null)
				});
			}
			E(n);
			var l = N(n, 2);
			m_(l, {
				key: "limit",
				shown: "6",
				children: (e, t) => {
					var n = Ab(), i = A(n), a = A(i), s = N(a);
					U(s), E(i), Cg(N(i, 2), { id: "limit" }), E(n), P((e, t) => {
						G(i, "title", e), z(a, `${t ?? ""} `), W(s, F(r).props.limit ?? 6);
					}, [() => K("tip.collection.limit"), () => K("lbl.maxCount")]), I("change", s, (e) => o("limit", Number(e.target.value))), R(e, n);
				},
				$$slots: { default: !0 }
			});
			var u = N(l, 2);
			{
				let e = /* @__PURE__ */ D(() => K("common.on"));
				m_(u, {
					key: "newestFirst",
					get shown() {
						return F(e);
					},
					children: (e, t) => {
						var n = jb(), i = A(n);
						U(i);
						var a = N(i);
						E(n), P((e) => {
							Vi(i, F(r).props.newestFirst !== !1), z(a, ` ${e ?? ""}`);
						}, [() => K("lbl.newestFirst")]), I("change", i, (e) => o("newestFirst", e.target.checked)), R(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			P((e, t) => {
				G(n, "title", e), z(s, `${t ?? ""} `);
			}, [() => K("tip.collection.source"), () => K("blocks.collection")]), R(e, t);
		};
		{
			let n = /* @__PURE__ */ D(() => K("group.source")), i = /* @__PURE__ */ D(() => F(a)[F(r).props.collection]?.name ?? K("common.choose")), o = /* @__PURE__ */ D(() => c("collection-source", {
				limit: 6,
				newestFirst: !0
			}));
			qg(e, {
				id: "collection-source",
				defaultOpen: !0,
				get title() {
					return F(n);
				},
				get value() {
					return F(i);
				},
				get group() {
					return F(o);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
	}, p = (e) => {
		let t = (e) => {
			m_(e, {
				key: "view",
				children: (e, t) => {
					var n = Nb(), i = A(n), a = A(i), s = N(a);
					{
						let e = /* @__PURE__ */ D(() => F(r).props.view ?? "cards"), t = /* @__PURE__ */ D(l);
						J(s, {
							get value() {
								return F(e);
							},
							get options() {
								return F(t);
							},
							onchange: (e) => o("view", e)
						});
					}
					E(i), Cg(N(i, 2), { id: "collectionView" }), E(n), P((e) => z(a, `${e ?? ""} `), [() => K("lbl.view")]), R(e, n);
				},
				$$slots: { default: !0 }
			});
		};
		{
			let n = /* @__PURE__ */ D(() => K("lbl.view")), i = /* @__PURE__ */ D(() => l().find(([e]) => e === (F(r).props.view ?? "cards"))?.[1] ?? ""), a = /* @__PURE__ */ D(() => c("collection-view", { view: "cards" }));
			qg(e, {
				id: "collection-view",
				defaultOpen: !0,
				get title() {
					return F(n);
				},
				get value() {
					return F(i);
				},
				get group() {
					return F(a);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
	};
	B(d, (e) => {
		t.area === "content" ? e(f) : t.area === "style" && e(p, 1);
	}), R(e, u), ot();
}
Vr(["change"]);
//#endregion
//#region src/menu/families/Product.svelte
var Fb = /* @__PURE__ */ L("<span class=\"toolbar-row\"><button class=\"ghost action\"> </button> <button class=\"ghost action\"> </button></span>"), Ib = /* @__PURE__ */ L("<button class=\"ghost action\"> </button>"), Lb = /* @__PURE__ */ L("<label> <input type=\"number\" min=\"0\" max=\"100\"/></label>"), Rb = /* @__PURE__ */ L("<label> <!></label> <!> <!>", 1), zb = /* @__PURE__ */ L("<label> <input/></label>"), Bb = /* @__PURE__ */ L("<!> <!>", 1), Vb = /* @__PURE__ */ L("<div class=\"pin-line\"><label> <input type=\"number\" min=\"0\" max=\"6\"/></label> <!></div>");
function Hb(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock), i = /* @__PURE__ */ D(() => n.collectionIds), a = /* @__PURE__ */ D(() => n.collectionsView), { setBlockProp: o, setBlockProps: s, addCollectionEntry: c, createCatalogForBlock: l } = n, { groupOf: u } = b_(() => F(r).props, s);
	var d = Xr(), f = j(d), p = (e) => {
		let t = (e) => {
			var t = Rb(), s = j(t), u = A(s), d = N(u);
			{
				let e = /* @__PURE__ */ D(() => F(r).props.collection ?? ""), t = /* @__PURE__ */ D(() => [["", K("common.choose")], ...F(i).filter((e) => F(a)[e]?.kind === "products").map((e) => [e, F(a)[e]?.name ?? e])]);
				J(d, {
					get value() {
						return F(e);
					},
					get options() {
						return F(t);
					},
					onchange: (e) => o("collection", e || null)
				});
			}
			E(s);
			var f = N(s, 2), p = (e) => {
				var t = Fb(), i = A(t), a = M(i, !0), o = N(i, 2), s = M(o, !0);
				E(t), P((e, t, n, r) => {
					G(i, "title", e), z(a, t), G(o, "title", n), z(s, r);
				}, [
					() => K("tip.product.addProduct"),
					() => K("ui.addProduct"),
					() => K("tip.product.editCatalog"),
					() => K("ui.editCatalog")
				]), I("click", i, () => c(F(r).props.collection)), I("click", o, () => n.openCollection(F(r).props.collection)), R(e, t);
			}, m = (e) => {
				var t = Ib(), n = M(t, !0);
				P((e, r) => {
					G(t, "title", e), z(n, r);
				}, [() => K("tip.product.createCatalog"), () => K("ui.createCatalog")]), I("click", t, l), R(e, t);
			}, h = /* @__PURE__ */ D(() => !F(i).some((e) => F(a)[e]?.kind === "products"));
			B(f, (e) => {
				F(r).props.collection && F(a)[F(r).props.collection]?.kind === "products" ? e(p) : F(h) && e(m, 1);
			}), m_(N(f, 2), {
				key: "limit",
				shown: "0",
				children: (e, t) => {
					var n = Lb(), i = A(n), a = N(i);
					U(a), E(n), P((e, t) => {
						G(n, "title", e), z(i, `${t ?? ""} `), W(a, F(r).props.limit ?? 0);
					}, [() => K("tip.collection.limit"), () => K("lbl.maxCount")]), I("change", a, (e) => o("limit", Number(e.target.value))), R(e, n);
				},
				$$slots: { default: !0 }
			}), P((e, t) => {
				G(s, "title", e), z(u, `${t ?? ""} `);
			}, [() => K("tip.product.source"), () => K("blocks.collection")]), R(e, t);
		}, s = (e) => {
			m_(e, {
				key: "currency",
				children: (e, t) => {
					var n = zb(), i = A(n), a = N(i);
					U(a), E(n), P((e, t) => {
						G(n, "title", e), z(i, `${t ?? ""} `), W(a, F(r).props.currency ?? "kr");
					}, [() => K("tip.product.currency"), () => K("lbl.currency")]), I("change", a, (e) => o("currency", e.target.value)), R(e, n);
				},
				$$slots: { default: !0 }
			});
		};
		var d = Bb(), f = j(d);
		{
			let e = /* @__PURE__ */ D(() => K("group.catalog")), n = /* @__PURE__ */ D(() => F(a)[F(r).props.collection]?.name ?? K("common.choose")), i = /* @__PURE__ */ D(() => u("product-catalog", { limit: 0 }));
			qg(f, {
				id: "product-catalog",
				get title() {
					return F(e);
				},
				get value() {
					return F(n);
				},
				get group() {
					return F(i);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
		var p = N(f, 2);
		{
			let e = /* @__PURE__ */ D(() => K("lbl.price")), t = /* @__PURE__ */ D(() => F(r).props.currency ?? "kr"), n = /* @__PURE__ */ D(() => u("product-price", { currency: "kr" }));
			qg(p, {
				id: "product-price",
				get title() {
					return F(e);
				},
				get value() {
					return F(t);
				},
				get group() {
					return F(n);
				},
				children: (e, t) => {
					s(e);
				},
				$$slots: { default: !0 }
			});
		}
		R(e, d);
	}, m = (e) => {
		let t = (e) => {
			m_(e, {
				key: "columns",
				shown: "0",
				children: (e, t) => {
					var n = Vb(), i = A(n), a = A(i), s = N(a);
					U(s), E(i), Cg(N(i, 2), { id: "columns" }), E(n), P((e, t) => {
						G(i, "title", e), z(a, `${t ?? ""} `), W(s, F(r).props.columns ?? 0);
					}, [() => K("tip.product.columns"), () => K("lbl.columns")]), I("change", s, (e) => o("columns", Number(e.target.value))), R(e, n);
				},
				$$slots: { default: !0 }
			});
		};
		{
			let n = /* @__PURE__ */ D(() => K("group.grid")), i = /* @__PURE__ */ D(() => F(r).props.columns ? String(F(r).props.columns) : K("menu.standard")), a = /* @__PURE__ */ D(() => u("product-grid", { columns: 0 }));
			qg(e, {
				id: "product-grid",
				defaultOpen: !0,
				get title() {
					return F(n);
				},
				get value() {
					return F(i);
				},
				get group() {
					return F(a);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
	};
	B(f, (e) => {
		t.area === "content" ? e(p) : t.area === "style" && e(m, 1);
	}), R(e, d), ot();
}
Vr(["click", "change"]);
//#endregion
//#region src/menu/families/Cart.svelte
var Ub = /* @__PURE__ */ L("<label> <input/></label>"), Wb = /* @__PURE__ */ L("<label> <!></label> <!>", 1), Gb = /* @__PURE__ */ L("<div class=\"pin-line\"><label> <!></label> <!></div>");
function Kb(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock), i = /* @__PURE__ */ D(() => n.siteDraft), { setBlockProp: a, setBlockProps: o } = n, { groupOf: s } = b_(() => F(r).props, o), c = () => [["button", K("opt.cart.button")], ["icon", K("opt.cart.icon")]];
	var l = Xr(), u = j(l), d = (e) => {
		let t = (e) => {
			var t = Wb(), n = j(t), o = A(n), s = N(o);
			{
				let e = /* @__PURE__ */ D(() => F(r).props.href ?? ""), t = /* @__PURE__ */ D(() => [["", K("common.none")], ...F(i).pages.map((e) => [e.path, e.title])]);
				J(s, {
					get value() {
						return F(e);
					},
					get options() {
						return F(t);
					},
					onchange: (e) => a("href", e)
				});
			}
			E(n), m_(N(n, 2), {
				key: "currency",
				children: (e, t) => {
					var n = Ub(), i = A(n), o = N(i);
					U(o), E(n), P((e, t) => {
						G(n, "title", e), z(i, `${t ?? ""} `), W(o, F(r).props.currency ?? "kr");
					}, [() => K("tip.product.currency"), () => K("lbl.currency")]), I("change", o, (e) => a("currency", e.target.value)), R(e, n);
				},
				$$slots: { default: !0 }
			}), P((e, t) => {
				G(n, "title", e), z(o, `${t ?? ""} `);
			}, [() => K("tip.cart.checkout"), () => K("lbl.checkoutPage")]), R(e, t);
		};
		{
			let n = /* @__PURE__ */ D(() => K("group.checkout")), a = /* @__PURE__ */ D(() => F(i).pages.find((e) => e.path === F(r).props.href)?.title ?? K("common.none")), o = /* @__PURE__ */ D(() => s("cart-checkout", { currency: "kr" }));
			qg(e, {
				id: "cart-checkout",
				defaultOpen: !0,
				get title() {
					return F(n);
				},
				get value() {
					return F(a);
				},
				get group() {
					return F(o);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
	}, f = (e) => {
		let t = (e) => {
			m_(e, {
				key: "variant",
				children: (e, t) => {
					var n = Gb(), i = A(n), o = A(i), s = N(o);
					{
						let e = /* @__PURE__ */ D(() => F(r).props.variant ?? "button"), t = /* @__PURE__ */ D(c);
						J(s, {
							get value() {
								return F(e);
							},
							get options() {
								return F(t);
							},
							onchange: (e) => a("variant", e)
						});
					}
					E(i), Cg(N(i, 2), { id: "cartView" }), E(n), P((e) => z(o, `${e ?? ""} `), [() => K("lbl.view")]), R(e, n);
				},
				$$slots: { default: !0 }
			});
		};
		{
			let n = /* @__PURE__ */ D(() => K("lbl.view")), i = /* @__PURE__ */ D(() => c().find(([e]) => e === (F(r).props.variant ?? "button"))?.[1] ?? ""), a = /* @__PURE__ */ D(() => s("cart-view", { variant: "button" }));
			qg(e, {
				id: "cart-view",
				defaultOpen: !0,
				get title() {
					return F(n);
				},
				get value() {
					return F(i);
				},
				get group() {
					return F(a);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
	};
	B(u, (e) => {
		t.area === "content" ? e(d) : t.area === "style" && e(f, 1);
	}), R(e, l), ot();
}
Vr(["change"]);
//#endregion
//#region src/menu/families/Checkout.svelte
var qb = /* @__PURE__ */ L("<label> <input/></label>"), Jb = /* @__PURE__ */ L("<label> <input type=\"email\"/></label> <label> <input type=\"url\"/></label> <!>", 1), Yb = /* @__PURE__ */ L("<div class=\"pin-line\"><label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!></div>"), Xb = /* @__PURE__ */ L("<label> <input/></label> <!>", 1), Zb = /* @__PURE__ */ L("<!> <!>", 1);
function Qb(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock), { setBlockProp: i, setBlockProps: a } = n, { groupOf: o } = b_(() => F(r).props, a);
	var s = Xr(), c = j(s), l = (e) => {
		let t = (e) => {
			var t = Jb(), n = j(t), a = A(n), o = N(a);
			U(o), E(n);
			var s = N(n, 2), c = A(s), l = N(c);
			U(l), E(s), m_(N(s, 2), {
				key: "currency",
				children: (e, t) => {
					var n = qb(), a = A(n), o = N(a);
					U(o), E(n), P((e, t) => {
						G(n, "title", e), z(a, `${t ?? ""} `), W(o, F(r).props.currency ?? "kr");
					}, [() => K("tip.product.currency"), () => K("lbl.currency")]), I("change", o, (e) => i("currency", e.target.value)), R(e, n);
				},
				$$slots: { default: !0 }
			}), P((e, t, i, u) => {
				G(n, "title", e), z(a, `${t ?? ""} `), W(o, F(r).props.recipient ?? ""), G(s, "title", i), z(c, `${u ?? ""} `), W(l, F(r).props.endpoint ?? "");
			}, [
				() => K("tip.checkout.recipient"),
				() => K("lbl.recipientEmail"),
				() => K("tip.checkout.endpoint"),
				() => K("lbl.endpointUrl")
			]), I("change", o, (e) => i("recipient", e.target.value.trim())), I("change", l, (e) => i("endpoint", e.target.value.trim())), R(e, t);
		}, n = (e) => {
			var t = Xb(), n = j(t), a = A(n), o = N(a);
			U(o), E(n);
			var s = N(n, 2);
			{
				let e = /* @__PURE__ */ D(() => K("common.off"));
				m_(s, {
					key: "vippsCheckout",
					get shown() {
						return F(e);
					},
					children: (e, t) => {
						var n = Yb(), a = A(n), o = A(a);
						U(o);
						var s = N(o);
						E(a), Cg(N(a, 2), { id: "vippsButton" }), E(n), P((e, t) => {
							G(a, "title", e), Vi(o, F(r).props.vippsCheckout === !0), z(s, ` ${t ?? ""}`);
						}, [() => K("tip.checkout.vippsCheckout"), () => K("lbl.vippsCheckout")]), I("change", o, (e) => i("vippsCheckout", e.target.checked)), R(e, n);
					},
					$$slots: { default: !0 }
				});
			}
			P((e, t) => {
				G(n, "title", e), z(a, `${t ?? ""} `), W(o, F(r).props.vipps ?? "");
			}, [() => K("tip.checkout.vipps"), () => K("lbl.vippsNumber")]), I("change", o, (e) => i("vipps", e.target.value.trim())), R(e, t);
		};
		var a = Zb(), s = j(a);
		{
			let e = /* @__PURE__ */ D(() => K("group.order")), n = /* @__PURE__ */ D(() => F(r).props.recipient || F(r).props.endpoint || K("common.none")), i = /* @__PURE__ */ D(() => o("checkout-order", { currency: "kr" }));
			qg(s, {
				id: "checkout-order",
				get title() {
					return F(e);
				},
				get value() {
					return F(n);
				},
				get group() {
					return F(i);
				},
				children: (e, n) => {
					t(e);
				},
				$$slots: { default: !0 }
			});
		}
		var c = N(s, 2);
		{
			let e = /* @__PURE__ */ D(() => K("group.vipps")), t = /* @__PURE__ */ D(() => F(r).props.vippsCheckout ? K("lbl.vippsCheckout") : F(r).props.vipps || K("common.none")), i = /* @__PURE__ */ D(() => o("checkout-vipps", { vippsCheckout: !1 }));
			qg(c, {
				id: "checkout-vipps",
				get title() {
					return F(e);
				},
				get value() {
					return F(t);
				},
				get group() {
					return F(i);
				},
				children: (e, t) => {
					n(e);
				},
				$$slots: { default: !0 }
			});
		}
		R(e, a);
	};
	B(c, (e) => {
		t.area === "content" && e(l);
	}), R(e, s), ot();
}
Vr(["change"]);
//#endregion
//#region src/menu/families/Fields.svelte
var $b = mn({}), ex = mn({}), tx = /* @__PURE__ */ O(!1), nx = /* @__PURE__ */ L("<p> </p>"), rx = /* @__PURE__ */ L("<label> <input type=\"text\"/></label> <button class=\"ghost\"> </button> <!>", 1), ix = /* @__PURE__ */ L("<div class=\"pin-line\"><label> <input type=\"number\"/></label> <!></div>"), ax = /* @__PURE__ */ L("<label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label>"), ox = /* @__PURE__ */ L("<label> <!></label>"), sx = /* @__PURE__ */ L("<label> <input type=\"text\"/></label>"), cx = /* @__PURE__ */ L("<button class=\"ghost\"> </button>");
function lx(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock), i = /* @__PURE__ */ D(() => n.pluginBlocks), { setBlockProp: a, setBlockProps: o } = n, s = (e, t) => (Number.isFinite(t) || (t = e.min ?? 0), e.min != null && (t = Math.max(e.min, t)), e.max != null && (t = Math.min(e.max, t)), t);
	async function c(e) {
		let t = F(r).blockId, n = `${t}:${e.key}`, i = ($b[n] ?? F(r).props[e.key] ?? "").trim();
		ex[n] = null;
		let a = i.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
		if (!i || a || /^https?:\/\//i.test(i)) o(e.key, {
			[e.key]: i,
			lat: a ? Number(a[1]) : null,
			lon: a ? Number(a[2]) : null
		});
		else {
			k(tx, !0), ex[n] = {
				text: K("props.place.searching"),
				err: !1
			};
			try {
				let a = await fetch(`/api/geocode?q=${encodeURIComponent(i)}`), s = await a.json().catch(() => null);
				if (F(r)?.blockId !== t) return;
				a.ok && Number.isFinite(s?.lat) ? (o(e.key, {
					[e.key]: i,
					lat: s.lat,
					lon: s.lon
				}), ex[n] = null) : ex[n] = {
					text: ba(s) ?? K("props.place.notFound"),
					err: !0
				};
			} catch {
				ex[n] = {
					text: K("props.place.failed"),
					err: !0
				};
			} finally {
				k(tx, !1);
			}
		}
	}
	let l = { map: [{
		key: "location",
		type: "place",
		label: K("lbl.mapLocation"),
		placeholder: K("ph.mapLocation")
	}, {
		key: "zoom",
		type: "number",
		label: K("lbl.mapZoom"),
		min: 1,
		max: 19
	}] };
	var u = Xr(), d = j(u), f = (e) => {
		let t = (e) => {
			var t = Xr();
			di(j(t), 17, () => F(o), (e) => e.key, (e, t) => {
				var n = Xr(), i = j(n), o = (e) => {
					let n = /* @__PURE__ */ D(() => `${F(r).blockId}:${F(t).key}`);
					var i = rx(), a = j(i), o = A(a), s = N(o);
					U(s), E(a);
					var l = N(a, 2), u = M(l, !0), d = N(l, 2), f = (e) => {
						var t = nx();
						let r;
						var i = M(t, !0);
						P(() => {
							r = H(t, 1, "panel-hint", null, r, { "place-error": ex[F(n)].err }), z(i, ex[F(n)].text);
						}), R(e, t);
					};
					B(d, (e) => {
						ex[F(n)] && e(f);
					}), P((e) => {
						z(o, `${F(t).label ?? ""} `), G(s, "placeholder", F(t).placeholder), W(s, $b[F(n)] ?? F(r).props[F(t).key] ?? ""), l.disabled = F(tx), z(u, e);
					}, [() => K("props.place.search")]), I("input", s, (e) => {
						$b[F(n)] = e.target.value;
					}), I("keydown", s, (e) => {
						e.key === "Enter" && c(F(t));
					}), I("click", l, () => c(F(t))), R(e, i);
				}, l = (e) => {
					var n = ix(), i = A(n), o = A(i), c = N(o);
					U(c), E(i);
					var l = N(i, 2), u = (e) => {
						Cg(e, { id: "zoom" });
					};
					B(l, (e) => {
						F(r).type === "map" && F(t).key === "zoom" && e(u);
					}), E(n), P(() => {
						z(o, `${F(t).label ?? ""} `), G(c, "min", F(t).min), G(c, "max", F(t).max), G(c, "step", F(t).step ?? 1), W(c, F(r).props[F(t).key]);
					}), I("change", c, (e) => a(F(t).key, s(F(t), Number(e.target.value)))), R(e, n);
				}, u = (e) => {
					var n = ax(), i = A(n);
					U(i);
					var o = N(i);
					E(n), P((e) => {
						Vi(i, e), z(o, ` ${F(t).label ?? ""}`);
					}, [() => !!F(r).props[F(t).key]]), I("change", i, (e) => a(F(t).key, e.target.checked)), R(e, n);
				}, d = (e) => {
					var n = ox(), i = A(n), o = N(i);
					{
						let e = /* @__PURE__ */ D(() => (F(t).options ?? []).map((e) => [e.value, e.label]));
						J(o, {
							get value() {
								return F(r).props[F(t).key];
							},
							get options() {
								return F(e);
							},
							onchange: (e) => a(F(t).key, e)
						});
					}
					E(n), P(() => z(i, `${F(t).label ?? ""} `)), R(e, n);
				}, f = (e) => {
					var n = sx(), i = A(n), o = N(i);
					U(o), E(n), P(() => {
						z(i, `${F(t).label ?? ""} `), G(o, "placeholder", F(t).placeholder), W(o, F(r).props[F(t).key] ?? "");
					}), I("change", o, (e) => a(F(t).key, e.target.value)), R(e, n);
				};
				B(i, (e) => {
					F(t).type === "place" ? e(o) : F(t).type === "number" ? e(l, 1) : F(t).type === "toggle" ? e(u, 2) : F(t).type === "select" ? e(d, 3) : e(f, -1);
				}), R(e, n);
			}), R(e, t);
		}, o = /* @__PURE__ */ D(() => l[F(r).type] ?? F(i).find((e) => e.type === F(r).type)?.fields ?? []);
		var u = Xr(), d = j(u), f = (e) => {
			{
				let n = /* @__PURE__ */ D(() => K("group.place")), i = /* @__PURE__ */ D(() => F(r).props.location || K("common.none"));
				qg(e, {
					id: "map-place",
					defaultOpen: !0,
					get title() {
						return F(n);
					},
					get value() {
						return F(i);
					},
					children: (e, n) => {
						t(e);
					},
					$$slots: { default: !0 }
				});
			}
		}, p = (e) => {
			t(e);
		}, m = (e) => {
			var t = cx(), i = M(t, !0);
			P((e, n) => {
				G(t, "title", e), z(i, n);
			}, [() => K("hint.pluginBlock"), () => K("ui.settings")]), I("click", t, () => n.bridge?.sendOpenConfig(F(r).blockId)), R(e, t);
		};
		B(d, (e) => {
			F(r).type === "map" ? e(f) : F(o).length ? e(p, 1) : e(m, -1);
		}), R(e, u);
	};
	B(d, (e) => {
		t.area === "content" && e(f);
	}), R(e, u), ot();
}
Vr([
	"input",
	"keydown",
	"click",
	"change"
]);
//#endregion
//#region src/menu/ElementMenu.svelte
var ux = /* @__PURE__ */ L("<button type=\"button\" class=\"menu-quick-open\"> </button>"), dx = /* @__PURE__ */ L("<input type=\"number\"/>"), fx = /* @__PURE__ */ L("<button type=\"button\"> </button>"), px = /* @__PURE__ */ L("<span class=\"seg\" role=\"group\"></span>"), mx = /* @__PURE__ */ L("<div class=\"menu-quick-item\"><span class=\"menu-quick-head\"><span class=\"mini-label\"> </span><!></span> <!></div>"), hx = /* @__PURE__ */ L("<button type=\"button\" class=\"linkish menu-quick-reset\"> </button>"), gx = /* @__PURE__ */ L("<div class=\"menu-quick\"><!> <!></div>"), _x = /* @__PURE__ */ L("<div><section class=\"emenu-col\"><p class=\"panel-strong emenu-title\"> </p><!><p class=\"emenu-none\"> </p></section> <section class=\"emenu-col\"><p class=\"panel-strong emenu-title\"> </p><!><p class=\"emenu-none\"> </p></section> <section class=\"emenu-col\"><p class=\"panel-strong emenu-title\"> </p><!><p class=\"emenu-none\"> </p></section></div>"), vx = /* @__PURE__ */ L("<div class=\"emenu-cols\"><section class=\"emenu-col\"><p class=\"panel-strong\"> </p><!></section> <section class=\"emenu-col\"><p class=\"panel-strong\"> </p><!></section> <section class=\"emenu-col\"><p class=\"panel-strong\"> </p><!></section></div>"), yx = /* @__PURE__ */ L("<div class=\"props-tabs\"><span class=\"seg\"><button type=\"button\"> </button> <button type=\"button\"> </button> <button type=\"button\"> </button></span></div> <!>", 1), bx = /* @__PURE__ */ L("<div class=\"emenu-root\"><!> <!></div>");
function xx(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock), { setBlockProp: i, setBlockFit: a, setBlockSize: o, endSizeGesture: s, setBlockHideMobile: c, designWidth: l, buttonTargets: u, setButtonTarget: d, themeSwatches: f } = n, p = {
		text: T_,
		button: k_,
		image: R_,
		video: G_,
		icon: $_,
		shape: lv,
		gallery: Ov,
		ribbon: Xv,
		calendar: wy,
		form: Ny,
		faq: zy,
		timeline: Gy,
		quote: $y,
		stats: ib,
		table: lb,
		share: yb,
		countdown: wb,
		audio: kb,
		collection: Pb,
		product: Hb,
		cart: Kb,
		checkout: Qb
	}, m = /* @__PURE__ */ D(() => p[F(r).type] ?? lx), h = ra(t, "query", 3, "");
	function _() {
		let e = yg(F(r).type), t = new Map(v().map((e) => [e.id, e]));
		return rg(F(r).type, e, new Set(t.keys())).map((e) => t.get(e));
	}
	function v() {
		let e = F(r), t = [];
		e.type === "calendar" && (t.push({
			id: "design",
			label: K("calendar.design"),
			kind: "open",
			value: K(wh(e.props.design).labelKey),
			run: n.openDesignPicker
		}), t.push({
			id: "phoneView",
			label: K("calendar.phoneView"),
			kind: "open",
			value: K(Qm(th(e.props), e.props).labelKey),
			run: n.openPhonePicker
		}), t.push({
			id: "card",
			label: K("calendar.card"),
			kind: "open",
			value: K(oh(ch(e.props)).labelKey),
			run: n.openCardPicker
		}), [
			"list",
			"cards",
			"agenda"
		].includes(Th(e.props)) && t.push({
			id: "limit",
			label: K("lbl.maxCount"),
			kind: "number",
			min: 1,
			max: 50,
			value: e.props.limit ?? 6,
			set: (e) => i("limit", Math.max(1, Math.min(50, Number(e) || 6)))
		}), t.push({
			id: "subscribe",
			label: K("quick.subscribe"),
			kind: "choice",
			value: e.props.showSubscribe === !1 ? "off" : "on",
			options: [["on", K("common.on")], ["off", K("common.off")]],
			set: (e) => i("showSubscribe", e === "on")
		}));
		let f = rc.has(e.type);
		t.push({
			id: "fit",
			label: K("quick.fit"),
			kind: "choice",
			value: e.fit === "shrink" || e.fit === "both" ? e.fit : "wrap",
			options: f ? [["wrap", K("quick.fit.fluid")], ["shrink", K("quick.fit.floor")]] : [
				["wrap", K("quick.fit.wrap")],
				...l() || e.fit === "shrink" ? [["shrink", K("quick.fit.shrink")]] : [],
				["both", K("quick.fit.both")]
			],
			set: (e) => a(e)
		}), t.push({
			id: "phone",
			label: K("quick.phone"),
			kind: "choice",
			value: e.hideMobile ? "off" : "on",
			options: [["on", K("quick.phone.show")], ["off", K("quick.phone.hide")]],
			set: (e) => c(e === "off")
		});
		let p = e.props;
		if (e.type === "text") t.push({
			id: "align",
			label: K("lbl.align"),
			kind: "choice",
			value: p.align ?? "left",
			options: [
				["left", K("common.left")],
				["center", K("common.center")],
				["right", K("common.right")]
			],
			set: (e) => i("align", e)
		}), t.push({
			id: "textBox",
			label: K("group.textBox"),
			kind: "choice",
			value: p.box ? "on" : "off",
			options: wg(),
			set: (e) => i("box", e === "on")
		});
		else if (e.type === "button") t.push({
			id: "goesTo",
			label: K("lbl.goesTo"),
			kind: "select",
			value: p.page ?? "__href",
			options: u(),
			set: d
		}), t.push({
			id: "btnStyle",
			label: K("lbl.style"),
			kind: "select",
			value: p.style ?? "primary",
			options: [["primary", K("opt.btn.primary")], ["secondary", K("opt.btn.secondary")]],
			set: (e) => i("style", e)
		});
		else if (e.type === "image") t.push({
			id: "imgFit",
			label: K("lbl.imageFit"),
			kind: "select",
			value: p.fit ?? "cover",
			options: [["cover", K("opt.fitFrame.cover")], ["contain", K("opt.fitFrame.contain")]],
			set: (e) => i("fit", e)
		}), t.push({
			id: "radius",
			label: K("group.corners"),
			kind: "choice",
			value: p.radius ?? "",
			options: [
				["", K("common.none")],
				["sm", K("opt.size.sm")],
				["md", K("opt.radius.md")]
			],
			set: (e) => i("radius", e || null)
		});
		else if (e.type === "video") t.push({
			id: "videoSource",
			label: K("lbl.videoSource"),
			kind: "choice",
			value: p.source === "file" ? "file" : "embed",
			options: [["embed", K("opt.videoSource.embed")], ["file", K("opt.videoSource.file")]],
			set: (e) => i("source", e)
		});
		else if (e.type === "icon") t.push({
			id: "iconSize",
			label: K("lbl.sizePx"),
			kind: "number",
			min: 8,
			max: 400,
			value: p.size ?? 48,
			set: (e) => i("size", Math.max(8, Math.min(400, Number(e) || 48)))
		}), t.push({
			id: "iconColor",
			label: K("lbl.color"),
			kind: "color",
			value: p.color ?? "accent",
			set: (e) => i("color", e)
		});
		else if (e.type === "gallery") {
			let e = su(p.view);
			t.push({
				id: "galleryView",
				label: K("lbl.view"),
				kind: "select",
				value: e,
				options: ru.map((e) => [e, K(`opt.galleryView.${e}`)]),
				set: (e) => i("view", e)
			}), iu.includes(e) && t.push({
				id: "columns",
				label: K("lbl.columns"),
				kind: "number",
				min: 1,
				max: 6,
				value: p.columns ?? 3,
				set: (e) => i("columns", Math.max(1, Math.min(6, Number(e) || 3)))
			});
		} else if (e.type === "ribbon") {
			let e = p.motion ?? "roll";
			t.push({
				id: "ribbonMotion",
				label: K("lbl.ribbonMotion"),
				kind: "select",
				value: e,
				options: Dg(),
				set: (e) => i("motion", e)
			}), (e === "roll" || e === "sway") && t.push({
				id: "speed",
				label: K("lbl.ribbonSpeed"),
				kind: "number",
				min: 10,
				max: 300,
				step: 5,
				value: p.speed ?? 60,
				set: (e) => i("speed", Math.max(10, Math.min(300, Number(e) || 60)))
			});
		} else e.type === "shape" ? (t.push({
			id: "shapeColor",
			label: K("lbl.color"),
			kind: "select",
			value: p.color ?? "accent",
			options: Fg(),
			set: (e) => i("color", e)
		}), t.push({
			id: "thickness",
			label: K("lbl.thickness"),
			kind: "number",
			min: 1,
			max: 40,
			value: p.thickness ?? 2,
			set: (e) => i("thickness", Math.max(1, Math.min(40, Number(e) || 2)))
		})) : e.type === "table" ? t.push({
			id: "tableLines",
			label: K("lbl.tableLines"),
			kind: "select",
			value: p.lines ?? "rows",
			options: [
				["rows", K("opt.table.rows")],
				["grid", K("opt.table.grid")],
				["none", K("common.none")]
			],
			set: (e) => i("lines", e)
		}) : e.type === "quote" ? t.push({
			id: "variant",
			label: K("lbl.variant"),
			kind: "select",
			value: p.variant ?? "large",
			options: [["large", K("opt.quote.large")], ["short", K("opt.quote.short")]],
			set: (e) => i("variant", e)
		}) : e.type === "stats" ? t.push({
			id: "variant",
			label: K("lbl.variant"),
			kind: "select",
			value: [
				"plain",
				"cards",
				"band"
			].includes(p.variant) ? p.variant : "plain",
			options: [
				"plain",
				"cards",
				"band"
			].map((e) => [e, K(`opt.statVariant.${e}`)]),
			set: (e) => i("variant", e)
		}) : e.type === "faq" ? t.push({
			id: "variant",
			label: K("lbl.variant"),
			kind: "select",
			value: p.variant === "list" ? "list" : "cards",
			options: ["cards", "list"].map((e) => [e, K(`opt.faqVariant.${e}`)]),
			set: (e) => i("variant", e)
		}) : e.type === "timeline" ? t.push({
			id: "variant",
			label: K("lbl.variant"),
			kind: "select",
			value: p.variant ?? "left",
			options: [["left", K("opt.timeline.left")], ["alternating", K("opt.timeline.alternating")]],
			set: (e) => i("variant", e)
		}) : e.type === "form" ? t.push({
			id: "sendMode",
			label: K("form.mode"),
			kind: "select",
			value: p.mode === "endpoint" ? "endpoint" : "mailto",
			options: [["mailto", K("form.modeMailto")], ["endpoint", K("form.modeEndpoint")]],
			set: (e) => i("mode", e)
		}) : e.type === "collection" ? (t.push({
			id: "collectionView",
			label: K("lbl.view"),
			kind: "select",
			value: p.view ?? "cards",
			options: [
				["cards", K("opt.collectionView.cards")],
				["list", K("opt.collectionView.list")],
				["archive", K("opt.collectionView.archive")]
			],
			set: (e) => i("view", e)
		}), t.push({
			id: "limit",
			label: K("lbl.maxCount"),
			kind: "number",
			min: 0,
			max: 100,
			value: p.limit ?? 6,
			set: (e) => i("limit", Math.max(0, Math.min(100, Number(e) || 0)))
		})) : e.type === "product" ? t.push({
			id: "columns",
			label: K("lbl.columns"),
			kind: "number",
			min: 0,
			max: 6,
			value: p.columns ?? 0,
			set: (e) => i("columns", Math.max(0, Math.min(6, Number(e) || 0)))
		}) : e.type === "cart" ? t.push({
			id: "cartView",
			label: K("lbl.view"),
			kind: "select",
			value: p.variant ?? "button",
			options: [["button", K("opt.cart.button")], ["icon", K("opt.cart.icon")]],
			set: (e) => i("variant", e)
		}) : e.type === "checkout" ? t.push({
			id: "vippsButton",
			label: K("lbl.vippsCheckout"),
			kind: "choice",
			value: p.vippsCheckout === !0 ? "on" : "off",
			options: wg(),
			set: (e) => i("vippsCheckout", e === "on")
		}) : e.type === "share" ? t.push({
			id: "variant",
			label: K("lbl.variant"),
			kind: "select",
			value: p.variant ?? "icons",
			options: [["icons", K("opt.share.icons")], ["labels", K("opt.share.labels")]],
			set: (e) => i("variant", e)
		}) : e.type === "countdown" ? t.push({
			id: "seconds",
			label: K("lbl.countdownSeconds"),
			kind: "choice",
			value: p.showSeconds === !1 ? "off" : "on",
			options: wg(),
			set: (e) => i("showSeconds", e === "on")
		}) : e.type === "audio" ? t.push({
			id: "loop",
			label: K("lbl.audioLoop"),
			kind: "choice",
			value: p.loop ? "on" : "off",
			options: wg(),
			set: (e) => i("loop", e === "on")
		}) : e.type === "map" && t.push({
			id: "zoom",
			label: K("lbl.mapZoom"),
			kind: "number",
			min: 1,
			max: 19,
			value: p.zoom ?? 15,
			set: (e) => i("zoom", Math.max(1, Math.min(19, Number(e) || 15)))
		});
		if (!ic.has(e.type)) {
			let n = uc(e);
			t.push({
				id: "size",
				label: K("lbl.scale"),
				kind: "number",
				min: Math.round(n.min * 100),
				max: Math.round(n.max * 100),
				step: Math.round(ac.step * 100),
				value: Math.round(cc(e) * 100),
				set: (e) => {
					s(), o((Number(e) || 100) / 100), s();
				}
			});
		}
		return t;
	}
	function y(e) {
		let t = e.target;
		if (t instanceof HTMLElement && (t.isContentEditable || [
			"INPUT",
			"TEXTAREA",
			"SELECT"
		].includes(t.tagName)) || e.ctrlKey || e.metaKey || e.altKey) return;
		let n = e.currentTarget;
		if ([
			"1",
			"2",
			"3"
		].includes(e.key)) e.preventDefault(), hg(mg[Number(e.key) - 1], n.closest(".block-menu") ?? n.closest(".panel-body"));
		else if (e.key === "/") {
			e.preventDefault();
			let t = (n.closest(".block-menu") ?? n.closest(".panel-body"))?.querySelector(".menu-search");
			t?.focus(), t?.select();
		}
	}
	var b = bx();
	{
		let e = (e) => {
			var t = Xr();
			vi(j(t), () => F(m), (e, t) => {
				t(e, { area: "content" });
			}), R(e, t);
		}, n = (e) => {
			var t = Xr();
			vi(j(t), () => F(m), (e, t) => {
				t(e, { area: "style" });
			}), R(e, t);
		}, i = (e) => {
			u_(e, {});
		};
		var x = A(b), S = (e) => {
			var t = gx(), n = A(t);
			di(n, 17, _, (e) => e.id, (e, t) => {
				var n = mx(), r = A(n), i = A(r), a = M(i, !0);
				Cg(N(i), { get id() {
					return F(t).id;
				} }), E(r);
				var o = N(r, 2), s = (e) => {
					var n = ux(), r = M(n, !0);
					P(() => z(r, F(t).value)), I("click", n, function(...e) {
						F(t).run?.apply(this, e);
					}), R(e, n);
				}, c = (e) => {
					var n = dx();
					U(n), P(() => {
						G(n, "min", F(t).min), G(n, "max", F(t).max), G(n, "step", F(t).step ?? 1), W(n, F(t).value), G(n, "aria-label", F(t).label);
					}), I("change", n, (e) => F(t).set(e.target.value)), R(e, n);
				}, l = (e) => {
					J(e, {
						get value() {
							return F(t).value;
						},
						get options() {
							return F(t).options;
						},
						get title() {
							return F(t).label;
						},
						compact: !0,
						onchange: (e) => F(t).set(e)
					});
				}, u = (e) => {
					{
						let n = /* @__PURE__ */ D(f);
						sl(e, {
							get value() {
								return F(t).value;
							},
							get tokens() {
								return F(n);
							},
							get label() {
								return F(t).label;
							},
							onchange: (e) => F(t).set(e)
						});
					}
				}, d = (e) => {
					var n = px();
					di(n, 21, () => F(t).options, ([e, t]) => e, (e, n) => {
						var r = /* @__PURE__ */ D(() => g(F(n), 2));
						let i = () => F(r)[0], a = () => F(r)[1];
						var o = fx();
						let s;
						var c = M(o, !0);
						P(() => {
							G(o, "aria-pressed", F(t).value === i()), s = H(o, 1, "", null, s, { on: F(t).value === i() }), z(c, a());
						}), I("click", o, () => F(t).set(i())), R(e, o);
					}), E(n), P(() => G(n, "aria-label", F(t).label)), R(e, n);
				};
				B(o, (e) => {
					F(t).kind === "open" ? e(s) : F(t).kind === "number" ? e(c, 1) : F(t).kind === "select" ? e(l, 2) : F(t).kind === "color" ? e(u, 3) : e(d, -1);
				}), E(n), P(() => z(a, F(t).label)), R(e, n);
			});
			var i = N(n, 2), a = (e) => {
				var t = hx(), n = M(t, !0);
				P((e) => z(n, e), [() => K("menu.quickReset")]), I("click", t, () => bg(F(r).type, tg)), R(e, t);
			}, o = /* @__PURE__ */ D(() => og(yg(F(r).type)));
			B(i, (e) => {
				F(o) && e(a);
			}), E(t), R(e, t);
		}, C = /* @__PURE__ */ D(() => !h().trim());
		B(x, (e) => {
			F(C) && e(S);
		});
		var w = N(x, 2), ee = (r) => {
			var a = _x();
			let o;
			var s = A(a), c = A(s), l = M(c, !0), u = N(c);
			e(u);
			var d = M(N(u), !0);
			E(s);
			var f = N(s, 2), p = A(f), m = M(p, !0), g = N(p);
			n(g);
			var _ = M(N(g), !0);
			E(f);
			var v = N(f, 2), y = A(v), b = M(y, !0), x = N(y);
			i(x);
			var S = M(N(x), !0);
			E(v), E(a), ki(a, () => Ug(h(), Lm)), P((e, n, r, i, s, c) => {
				o = H(a, 1, "emenu-cols emenu-search", null, o, { stacked: !t.wide }), z(l, e), z(d, n), z(m, r), z(_, i), z(b, s), z(S, c);
			}, [
				() => K("props.tabContent"),
				() => K("menu.noMatch"),
				() => K("props.tabStyle"),
				() => K("menu.noMatch"),
				() => K("props.tabPlacement"),
				() => K("menu.noMatch")
			]), R(r, a);
		}, T = /* @__PURE__ */ D(() => h().trim()), te = (t) => {
			var r = vx(), a = A(r), o = A(a), s = M(o, !0), c = N(o);
			e(c), E(a);
			var l = N(a, 2), u = A(l), d = M(u, !0), f = N(u);
			n(f), E(l);
			var p = N(l, 2), m = A(p), h = M(m, !0), g = N(m);
			i(g), E(p), E(r), P((e, t, n) => {
				z(s, e), z(d, t), z(h, n);
			}, [
				() => K("props.tabContent"),
				() => K("props.tabStyle"),
				() => K("props.tabPlacement")
			]), R(t, r);
		}, ne = (t) => {
			var r = yx(), a = j(r), o = A(a), s = A(o);
			let c;
			var l = M(s, !0), u = N(s, 2);
			let d;
			var f = M(u, !0), p = N(u, 2);
			let m;
			var h = M(p, !0);
			E(o), E(a);
			var g = N(a, 2), _ = (t) => {
				e(t);
			}, v = (e) => {
				n(e);
			}, y = (e) => {
				i(e);
			};
			B(g, (e) => {
				ug.tab === "content" ? e(_) : ug.tab === "style" ? e(v, 1) : e(y, -1);
			}), P((e, t, n) => {
				c = H(s, 1, "", null, c, { on: ug.tab === "content" }), z(l, e), d = H(u, 1, "", null, d, { on: ug.tab === "style" }), z(f, t), m = H(p, 1, "", null, m, { on: ug.tab === "placement" }), z(h, n);
			}, [
				() => K("props.tabContent"),
				() => K("props.tabStyle"),
				() => K("props.tabPlacement")
			]), I("click", s, () => ug.tab = "content"), I("click", u, () => ug.tab = "style"), I("click", p, () => ug.tab = "placement"), R(t, r);
		};
		B(w, (e) => {
			F(T) ? e(ee) : t.wide ? e(te, 1) : e(ne, -1);
		}), E(b);
	}
	I("keydown", b, y), R(e, b), ot();
}
Vr([
	"keydown",
	"click",
	"change"
]);
//#endregion
//#region src/menu/SearchField.svelte
var Sx = /* @__PURE__ */ L("<span><input type=\"search\" class=\"menu-search\"/> <span class=\"menu-search-key\" aria-hidden=\"true\">/</span></span>");
function Cx(e, t) {
	at(t, !0);
	function n(e) {
		e.key === "Escape" && t.get() ? (e.stopPropagation(), t.set("")) : !t.get() && [
			"1",
			"2",
			"3"
		].includes(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey && (e.preventDefault(), hg(mg[Number(e.key) - 1], e.currentTarget.closest(".block-menu") ?? e.currentTarget.closest(".panel-body")));
	}
	var r = Sx();
	let i;
	var a = A(r);
	U(a), Ae(2), E(r), P((e, t, n, o) => {
		i = H(r, 1, "menu-search-wrap", null, i, { filled: e }), G(a, "placeholder", t), G(a, "aria-label", n), G(a, "title", o);
	}, [
		() => !!t.get(),
		() => K("menu.search"),
		() => K("menu.search"),
		() => K("tip.menu.search")
	]), I("keydown", a, n), Gi(a, t.get, t.set), R(e, r), ot();
}
Vr(["keydown"]);
//#endregion
//#region ../template/assets/engine/0.7.6/divider-model.js
var wx = [
	"wave",
	"tilt",
	"curve",
	"triangle",
	"zigzag"
], Tx = {
	min: 16,
	max: 240,
	dflt: 64
}, Ex = /* @__PURE__ */ L("<p class=\"panel-strong\"> </p> <!> <!>", 1), Dx = /* @__PURE__ */ L("<label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"4\" max=\"96\" step=\"2\"/>", 1), Ox = /* @__PURE__ */ L("<button><span class=\"rs-sample\"><i class=\"rs-line\"></i> <i class=\"rs-chip\"></i> <i class=\"rs-dot\"></i></span> <span class=\"rs-name\"> </span></button>"), kx = /* @__PURE__ */ L("<div class=\"ctl-row\"><span class=\"mini-label ctl-name\"> </span> <input type=\"range\" step=\"4\"/> <span class=\"gridmenu-value\"> </span></div> <label> <!></label> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label>", 1), Ax = /* @__PURE__ */ L("<label> <!></label> <!>", 1), jx = /* @__PURE__ */ L("<label> <!></label> <label> <input type=\"number\" min=\"0\" max=\"1000\" step=\"10\"/></label> <label> <!></label>", 1), Mx = /* @__PURE__ */ L("<label> <input type=\"number\" min=\"100\" max=\"4000\" step=\"100\"/></label> <label> <input type=\"number\" min=\"0\" max=\"4000\" step=\"100\"/></label> <!>", 1), Nx = /* @__PURE__ */ L("<p class=\"panel-strong\"> </p> <label> <input class=\"token-input\"/></label> <hr class=\"gridmenu-divider\"/> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!> <hr class=\"gridmenu-divider\"/> <p class=\"panel-strong\"> </p> <div class=\"rs-grid\"></div> <label> <span class=\"row-tools\"><span class=\"gridmenu-value\"> </span> <button class=\"ghost row-tool\"></button></span></label> <hr class=\"gridmenu-divider\"/> <p class=\"panel-strong\"> </p> <!> <hr class=\"gridmenu-divider\"/> <p class=\"panel-strong\"> </p> <!> <hr class=\"gridmenu-divider\"/> <label> <!></label> <!> <label> <!></label>", 1), Px = /* @__PURE__ */ L("<p class=\"panel-hint\"> </p>"), Fx = /* @__PURE__ */ L("<div class=\"panel-body\"><!></div>");
function Ix(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.activeSectionId), i = /* @__PURE__ */ D(() => n.bridge), a = /* @__PURE__ */ D(() => n.previewPalette), o = /* @__PURE__ */ D(() => n.sectionAnim), s = /* @__PURE__ */ D(() => n.sectionBg), c = /* @__PURE__ */ D(() => n.sectionBgCtx), l = /* @__PURE__ */ D(() => n.sectionDivider), u = /* @__PURE__ */ D(() => n.sectionGrid), d = /* @__PURE__ */ D(() => n.sectionHover), f = /* @__PURE__ */ D(() => n.sectionMinHeight), p = /* @__PURE__ */ D(() => n.sectionTheme), m = /* @__PURE__ */ D(() => n.selectedBlock), { BLOCK_LABELS: h, ENTRANCE_OPTIONS: _, HOVER_OPTIONS: v, animObj: y, isEntrance: b, mutateSection: x, normalizeAnim: S, readableOn: C, setSectionGrid: w, setSectionHeight: ee, themeHex: T, themeSwatches: te, toggleSectionGrid: ne } = n;
	function re(e) {
		x("section-theme", (t) => {
			e ? t.theme = e : delete t.theme;
		});
	}
	function ie(e) {
		let t = F(a), n = (e) => e.replaceAll("var(--urd-base-bg)", t.bg).replaceAll("var(--urd-base-surface)", t.surface).replaceAll("var(--urd-base-text)", t.text).replaceAll("var(--urd-base-accent)", t.accent).replaceAll("var(--urd-base-accent-text)", t["accent-text"] ?? C(T(t.accent ?? "#000000", t))), r = Is(e);
		return {
			bg: r["--urd-color-bg"] ? n(r["--urd-color-bg"]) : t.bg,
			surface: r["--urd-color-surface"] ? n(r["--urd-color-surface"]) : t.surface,
			text: r["--urd-color-text"] ? n(r["--urd-color-text"]) : t.text,
			accent: r["--urd-color-accent"] ? n(r["--urd-color-accent"]) : t.accent
		};
	}
	function ae(e) {
		x("section-anim", (t) => {
			S(t), t.animation = e ? y(e) : null;
		}), F(i)?.sendDemoAnim(F(r));
	}
	function oe(e, t, n) {
		x(`section-divider-${e}-${t}`, (r) => {
			let i = { ...r.divider ?? {} };
			if (t === "shape" && !n) delete i[e];
			else {
				let r = { ...i[e] ?? { shape: "wave" } };
				n === void 0 || n === !1 || n === "" ? delete r[t] : r[t] = n, i[e] = r;
			}
			Object.keys(i).length ? r.divider = i : delete r.divider;
		});
	}
	function se(e) {
		x("section-hover", (t) => {
			S(t), t.hover = e ? y(e) : null;
		});
	}
	function ce(e, t) {
		Number.isFinite(t) && (x("edit:section-anim", (n) => {
			n.animation && (n.animation.props[e] = t);
		}), F(i)?.sendDemoAnim(F(r)));
	}
	function le(e, t) {
		x("edit:section-anim", (n) => {
			n.animation && (n.animation.props[e] = t);
		}), F(i)?.sendDemoAnim(F(r));
	}
	var ue = Fx(), de = A(ue), fe = (e) => {
		var t = Ex(), n = j(t), r = M(n, !0), i = N(n, 2);
		Cx(i, {
			get: () => ug.propsQuery,
			set: (e) => ug.propsQuery = e
		}), xx(N(i, 2), {
			wide: !1,
			get query() {
				return ug.propsQuery;
			}
		}), P((e) => z(r, e), [() => K("blocks.suffix", { label: h[F(m).type] ?? F(m).type })]), R(e, t);
	}, pe = (e) => {
		var t = Nx(), n = j(t), i = M(n, !0), a = N(n, 2), m = A(a), h = N(m);
		U(h), E(a);
		var y = N(a, 4), x = A(y);
		U(x);
		var S = N(x);
		E(y);
		var C = N(y, 2), T = (e) => {
			var t = Dx(), n = j(t), r = A(n), i = M(N(r));
			E(n);
			var a = N(n, 2);
			U(a), P((e) => {
				z(r, `${e ?? ""} `), z(i, `${F(u).size ?? ""} px`), W(a, F(u).size);
			}, [() => K("lbl.gridSize")]), I("input", a, (e) => w("size", Number(e.target.value))), R(e, t);
		};
		B(C, (e) => {
			F(u) && e(T);
		});
		var ue = N(C, 4), de = M(ue, !0), fe = N(ue, 2);
		di(fe, 21, () => [["", "common.standard"], ...Object.entries(Fs)], ([e, t]) => e, (e, t) => {
			var n = /* @__PURE__ */ D(() => g(F(t), 2));
			let r = () => F(n)[0], i = () => F(n)[1], a = /* @__PURE__ */ D(() => ie(r()));
			var o = Ox();
			let s;
			var c = A(o), l = A(c), u = N(l, 2), d = N(u, 2);
			E(c);
			var f = M(N(c, 2), !0);
			E(o), P((e, t) => {
				s = H(o, 1, "rs-card", null, s, { on: F(p) === r() }), G(o, "title", e), Ii(c, `background: ${F(a).bg ?? ""}`), Ii(l, `background: ${F(a).text ?? ""}`), Ii(u, `background: ${F(a).surface ?? ""}`), Ii(d, `background: ${F(a).accent ?? ""}`), z(f, t);
			}, [() => K("tip.props.sectionTheme"), () => K(i())]), I("click", o, () => re(r())), R(e, o);
		}), E(fe);
		var pe = N(fe, 2), me = A(pe), he = N(me), ge = A(he), _e = M(ge), ve = N(ge, 2);
		V(ve, () => q.copy, !0), E(ve), E(he), E(pe);
		var ye = N(pe, 4), be = M(ye, !0), xe = N(ye, 2);
		cf(xe, {
			get bg() {
				return F(c);
			},
			get layers() {
				return F(s);
			}
		});
		var Se = N(xe, 4), Ce = M(Se, !0), we = N(Se, 2);
		di(we, 16, () => [["top", "lbl.dividerTop"], ["bottom", "lbl.dividerBottom"]], ([e, t]) => e, (e, t) => {
			var n = /* @__PURE__ */ D(() => g(t, 2));
			let r = () => F(n)[0], i = () => F(n)[1], a = /* @__PURE__ */ D(() => F(l)[r()]);
			var o = Ax(), s = j(o), c = A(s), u = N(c);
			{
				let e = /* @__PURE__ */ D(() => F(a)?.shape ?? ""), t = /* @__PURE__ */ D(() => [["", K("common.none")], ...wx.map((e) => [e, K(`opt.divider.${e}`)])]);
				J(u, {
					get value() {
						return F(e);
					},
					get options() {
						return F(t);
					},
					onchange: (e) => oe(r(), "shape", e)
				});
			}
			E(s);
			var d = N(s, 2), f = (e) => {
				var t = kx(), n = j(t), i = A(n), o = M(i, !0), s = N(i, 2);
				U(s);
				var c = M(N(s, 2));
				E(n);
				var l = N(n, 2), u = A(l), d = N(u);
				{
					let e = /* @__PURE__ */ D(() => F(a).color ?? "bg"), t = /* @__PURE__ */ D(te), n = /* @__PURE__ */ D(() => K("tip.divider.color"));
					sl(d, {
						get value() {
							return F(e);
						},
						get tokens() {
							return F(t);
						},
						get label() {
							return F(n);
						},
						onchange: (e) => oe(r(), "color", e)
					});
				}
				E(l);
				var f = N(l, 2), p = A(f);
				U(p);
				var m = N(p);
				E(f);
				var h = N(f, 2), g = A(h);
				U(g);
				var _ = N(g);
				E(h), P((e, t, n, r, i, d, v) => {
					z(o, e), G(s, "min", Tx.min), G(s, "max", Tx.max), W(s, F(a).height ?? Tx.dflt), z(c, `${F(a).height ?? Tx.dflt ?? ""} px`), G(l, "title", t), z(u, `${n ?? ""} `), G(f, "title", r), Vi(p, F(a).flip === !0), z(m, ` ${i ?? ""}`), G(h, "title", d), Vi(g, F(a).invert === !0), z(_, ` ${v ?? ""}`);
				}, [
					() => K("lbl.height"),
					() => K("tip.divider.color"),
					() => K("lbl.color"),
					() => K("tip.divider.flip"),
					() => K("lbl.dividerFlip"),
					() => K("tip.divider.invert"),
					() => K("lbl.patternInvert")
				]), I("input", s, (e) => oe(r(), "height", e.target.valueAsNumber)), I("change", p, (e) => oe(r(), "flip", e.target.checked)), I("change", g, (e) => oe(r(), "invert", e.target.checked)), R(e, t);
			};
			B(d, (e) => {
				F(a)?.shape && e(f);
			}), P((e, t) => {
				G(s, "title", e), z(c, `${t ?? ""} `);
			}, [() => K("tip.props.dividers"), () => K(i())]), R(e, o);
		});
		var Te = N(we, 4), Ee = A(Te), De = N(Ee);
		{
			let e = /* @__PURE__ */ D(() => b(F(o)) ? F(o).type : "");
			J(De, {
				get value() {
					return F(e);
				},
				get options() {
					return _;
				},
				onchange: (e) => ae(e || null)
			});
		}
		E(Te);
		var Oe = N(Te, 2), ke = (e) => {
			var t = Mx(), n = j(t), r = A(n), i = N(r);
			U(i), E(n);
			var a = N(n, 2), s = A(a), c = N(s);
			U(c), E(a);
			var l = N(a, 2), u = (e) => {
				var t = jx(), n = j(t), r = A(n), i = N(r);
				{
					let e = /* @__PURE__ */ D(() => F(o).props.effect ?? "slide-up"), t = /* @__PURE__ */ D(() => [
						["fade-in", K("anim.fadeIn")],
						["slide-up", K("anim.slideUp")],
						["zoom-in", K("anim.zoomIn")]
					]);
					J(i, {
						get value() {
							return F(e);
						},
						get options() {
							return F(t);
						},
						onchange: (e) => le("effect", e)
					});
				}
				E(n);
				var a = N(n, 2), s = A(a), c = N(s);
				U(c), E(a);
				var l = N(a, 2), u = A(l), d = N(u);
				{
					let e = /* @__PURE__ */ D(() => F(o).props.pattern ?? "sequence"), t = /* @__PURE__ */ D(() => [
						["sequence", K("opt.stagger.sequence")],
						["columns", K("opt.stagger.columns")],
						["rows", K("opt.stagger.rows")],
						["center", K("opt.stagger.center")]
					]);
					J(d, {
						get value() {
							return F(e);
						},
						get options() {
							return F(t);
						},
						onchange: (e) => le("pattern", e)
					});
				}
				E(l), P((e, t, i, d, f, p) => {
					G(n, "title", e), z(r, `${t ?? ""} `), G(a, "title", i), z(s, `${d ?? ""} `), W(c, F(o).props.step ?? 90), G(l, "title", f), z(u, `${p ?? ""} `);
				}, [
					() => K("tip.props.staggerEffect"),
					() => K("lbl.staggerEffect"),
					() => K("tip.props.staggerStep"),
					() => K("lbl.stepMs"),
					() => K("tip.props.staggerPattern"),
					() => K("lbl.pattern")
				]), I("change", c, (e) => ce("step", Number(e.target.value))), R(e, t);
			};
			B(l, (e) => {
				F(o).type === "stagger" && e(u);
			}), P((e, t) => {
				z(r, `${e ?? ""} `), W(i, F(o).props.duration), z(s, `${t ?? ""} `), W(c, F(o).props.delay ?? 0);
			}, [() => K("lbl.durationMs"), () => K("lbl.delayMs")]), I("change", i, (e) => ce("duration", Number(e.target.value))), I("change", c, (e) => ce("delay", Number(e.target.value))), R(e, t);
		}, Ae = /* @__PURE__ */ D(() => b(F(o)));
		B(Oe, (e) => {
			F(Ae) && e(ke);
		});
		var je = N(Oe, 2), Me = A(je), Ne = N(Me);
		{
			let e = /* @__PURE__ */ D(() => F(d)?.type ?? (F(o) && !b(F(o)) ? F(o).type : ""));
			J(Ne, {
				get value() {
					return F(e);
				},
				get options() {
					return v;
				},
				onchange: (e) => se(e || null)
			});
		}
		E(je), P((e, t, n, o, s, c, l, d, p, g, _, v, y, b, C, w, ee) => {
			z(i, e), G(a, "title", t), z(m, `${n ?? ""} `), W(h, F(f)), G(h, "placeholder", o), Vi(x, F(u) !== null), z(S, ` ${s ?? ""}`), G(ue, "title", c), z(de, l), G(pe, "title", d), z(me, `${p ?? ""} `), z(_e, `#${F(r) ?? ""}`), G(ve, "title", g), z(be, _), G(Se, "title", v), z(Ce, y), G(Te, "title", b), z(Ee, `${C ?? ""} `), G(je, "title", w), z(Me, `${ee ?? ""} `);
		}, [
			() => K("lbl.section"),
			() => K("hint.props.minHeight"),
			() => K("lbl.minHeight"),
			() => K("ph.minHeight"),
			() => K("lbl.sectionGrid"),
			() => K("tip.props.sectionTheme"),
			() => K("lbl.sectionTheme"),
			() => K("tip.props.anchor"),
			() => K("lbl.anchor"),
			() => K("tip.props.copyAnchor"),
			() => K("lbl.background"),
			() => K("tip.props.dividers"),
			() => K("lbl.sectionDividers"),
			() => K("tip.props.sectionAnim"),
			() => K("lbl.animIn"),
			() => K("tip.props.sectionHover"),
			() => K("lbl.onHover")
		]), I("change", h, (e) => ee(e.target.value)), I("change", x, (e) => ne(e.target.checked)), I("click", ve, () => navigator.clipboard?.writeText(`#${F(r)}`)), R(e, t);
	}, me = (e) => {
		var t = Px(), n = M(t, !0);
		P((e) => z(n, e), [() => K("hint.props.empty")]), R(e, t);
	};
	B(de, (e) => {
		F(m) ? e(fe) : F(r) ? e(pe, 1) : e(me, -1);
	}), E(ue), R(e, ue), ot();
}
Vr([
	"change",
	"input",
	"click"
]);
//#endregion
//#region ../template/assets/engine/0.7.6/backgrounds/glow.js
var Lx = {
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
		let n = Ns(t.color), r = t.x ?? .5, i = t.y ?? .3, a = t.radius ?? .5;
		e.style.background = `radial-gradient(circle at ${r * 100}% ${i * 100}%, ${n} 0%, transparent ${a * 100}%)`, e.style.opacity = String(t.opacity ?? .35);
	}
}, Rx = "url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22128%22%20height%3D%22128%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.9%22%20numOctaves%3D%222%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22128%22%20height%3D%22128%22%20filter%3D%22url(%23n)%22%2F%3E%3C%2Fsvg%3E\")", zx = {
	version: 1,
	label: "Grain",
	labelKey: "bgLayer.grain",
	defaults: () => ({ opacity: .06 }),
	migrations: {},
	render(e, t) {
		e.style.backgroundImage = Rx, e.style.backgroundRepeat = "repeat", e.style.opacity = String(t.opacity ?? .06);
	}
};
//#endregion
//#region ../template/assets/engine/0.7.6/footer-thumb.js
function Bx(e = {}) {
	let t = "#2fd6b6", n = "#5c6b64", r = e.mega ? "#16221d" : "#0e1512", i = e.cols ?? 0, a = e.social ?? 0, o = `<svg viewBox="0 0 160 80" preserveAspectRatio="none" aria-hidden="true"><rect width="160" height="80" fill="${r}"/>`;
	if (e.mega && (o += `<circle cx="20" cy="6" r="34" fill="${t}" opacity="0.18"/>`), e.bigcta) return o += `<rect x="45" y="18" width="70" height="8" rx="3" fill="${n}" opacity="0.85"/>`, o += `<rect x="56" y="32" width="48" height="4" rx="2" fill="${n}" opacity="0.5"/>`, o += `<rect x="62" y="43" width="36" height="10" rx="3" fill="${t}"/>`, o += Vx(n, e.baselineLinks), o + "</svg>";
	if (e.chapters) {
		o += `<rect x="12" y="10" width="20" height="6" rx="2" fill="${t}"/>`, o += `<rect x="12" y="20" width="46" height="3" rx="1.5" fill="${n}" opacity="0.6"/>`;
		let r = i || 3, a = (136 - (r - 1) * 8) / r;
		for (let e = 0; e < r; e++) {
			let r = 12 + e * (a + 8);
			o += `<line x1="${r}" y1="30" x2="${r + a}" y2="30" stroke="${n}" stroke-width="0.8" opacity="0.7"/>`, o += `<rect x="${r}" y="34" width="9" height="6" rx="1.5" fill="${t}"/>`;
			for (let e = 0; e < 3; e++) o += `<rect x="${r}" y="${44 + e * 6}" width="${a * .7}" height="3" rx="1.5" fill="${n}" opacity="0.6"/>`;
		}
		return o += Vx(n, e.baselineLinks), o + "</svg>";
	}
	if (e.split) {
		o += `<rect x="8" y="8" width="70" height="52" rx="4" fill="${t}" opacity="0.16"/>`, o += `<rect x="16" y="16" width="20" height="6" rx="2" fill="${t}"/>`, o += `<rect x="16" y="26" width="46" height="3" rx="1.5" fill="${n}" opacity="0.6"/>`, o += `<rect x="16" y="36" width="26" height="9" rx="3" fill="${t}"/>`;
		let r = i || 2;
		for (let e = 0; e < r; e++) {
			let r = 90 + e * 32;
			o += `<rect x="${r}" y="14" width="16" height="3" rx="1.5" fill="${t}" opacity="0.8"/>`;
			for (let e = 0; e < 4; e++) o += `<rect x="${r}" y="${22 + e * 7}" width="22" height="3" rx="1.5" fill="${n}" opacity="0.6"/>`;
		}
		return o += Vx(n, e.baselineLinks), o + "</svg>";
	}
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
	return o += Vx(n, e.baselineLinks), o + "</svg>";
}
function Vx(e, t = 0) {
	let n = `<line x1="8" y1="66" x2="152" y2="66" stroke="${e}" stroke-width="0.6" opacity="0.5"/>`;
	return n += `<rect x="8" y="70" width="40" height="3" rx="1.5" fill="${e}" opacity="0.6"/>`, t && (n += `<g fill="${e}" opacity="0.6">` + Array.from({ length: t }, (e, t) => `<rect x="${120 - t * 16}" y="70" width="12" height="3" rx="1.5"/>`).join("") + "</g>"), n;
}
//#endregion
//#region src/panels/FooterPanel.svelte
var Hx = /* @__PURE__ */ L("<input class=\"nav-target\"/>"), Ux = /* @__PURE__ */ L("<div class=\"nav-row nav-sub-row\"><input/> <span class=\"row-tools\"><button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button></span> <span class=\"nav-target\"><!></span> <!></div>"), Wx = /* @__PURE__ */ L("<label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label>"), Gx = /* @__PURE__ */ L("<details class=\"group\"><summary> </summary> <div class=\"group-items\"></div></details>"), Kx = /* @__PURE__ */ L("<button class=\"footer-tp\"><span class=\"footer-tp-thumb\"></span> <span class=\"footer-tp-name\"> </span></button>"), qx = /* @__PURE__ */ L("<button class=\"ghost row-tool\"></button>"), Jx = /* @__PURE__ */ L("<label> <span class=\"gridmenu-value\"> </span></label> <input type=\"range\" min=\"16\" max=\"160\" step=\"2\"/>", 1), Yx = /* @__PURE__ */ L("<span class=\"toolbar-row\"><label class=\"ghost filepick tb-grow\"> <input type=\"file\" accept=\"image/*\"/></label> <!></span> <!>", 1), Xx = /* @__PURE__ */ L("<div class=\"nav-row\"><input/> <span class=\"row-tools\"><button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button></span></div> <!>", 1), Zx = /* @__PURE__ */ L("<input/>"), Qx = /* @__PURE__ */ L("<label> <!></label> <!>", 1), $x = /* @__PURE__ */ L("<label> <input/></label> <label> <input/></label> <label> <input/></label>", 1), eS = /* @__PURE__ */ L("<label> <!></label> <label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <label> <input/></label> <label> <input/></label> <label> <input/></label> <!>", 1), tS = /* @__PURE__ */ L("<label> <!></label> <hr class=\"gridmenu-divider\"/>", 1), nS = /* @__PURE__ */ L("<div class=\"panel-body\"><label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!> <details class=\"group\"><summary> </summary> <div class=\"group-items\"><div class=\"footer-tpick\"></div></div></details> <details class=\"group\"><summary> </summary> <div class=\"group-items\"><label> <input/></label> <label> <input/></label> <label> <!></label> <!></div></details> <details class=\"group\"><summary> </summary> <div class=\"group-items\"><!> <button class=\"ghost action\"> </button> <label> <!></label></div></details> <details class=\"group\"><summary> </summary> <div class=\"group-items\"><label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <button class=\"ghost action\"> </button></div></details> <details class=\"group\"><summary> </summary> <div class=\"group-items\"><label class=\"gridmenu-snap\"><input type=\"checkbox\"/> </label> <!></div></details> <details class=\"group\"><summary> </summary> <div class=\"group-items\"><!> <button class=\"ghost action\"> </button></div></details> <details class=\"group\"><summary> </summary> <div class=\"group-items\"><!> <p class=\"panel-strong\"> </p> <!></div></details> <details class=\"group\"><summary> </summary> <div class=\"group-items\"><label> <input/></label> <p class=\"panel-strong\"> </p> <!> <button class=\"ghost action\"> </button></div></details></div>");
function rS(e, t) {
	at(t, !0);
	let n = (e, t = f, n = f) => {
		var r = Xr();
		di(j(r), 17, n, si, (e, r, a) => {
			var o = Ux(), s = A(o);
			U(s);
			var c = N(s, 2), l = A(c);
			l.disabled = a === 0, V(l, () => q.up, !0), E(l);
			var u = N(l, 2);
			V(u, () => q.down, !0), E(u);
			var d = N(u, 2);
			V(d, () => q.cross, !0), E(d), E(c);
			var f = N(c, 2), p = A(f);
			{
				let e = /* @__PURE__ */ D(() => F(r).page ?? "__href"), n = /* @__PURE__ */ D(() => K("tip.linkTarget")), o = /* @__PURE__ */ D(() => [...F(i).pages.map((e) => [e.id, e.title]), ["__href", K("opt.linkHref")]]);
				J(p, {
					get value() {
						return F(e);
					},
					get title() {
						return F(n);
					},
					get options() {
						return F(o);
					},
					onchange: (e) => C(t(), a, e)
				});
			}
			E(f);
			var m = N(f, 2), h = (e) => {
				var n = Hx();
				U(n), P((e, t) => {
					W(n, F(r).href ?? ""), G(n, "placeholder", e), G(n, "title", t);
				}, [() => K("ph.hrefAnchor"), () => K("tip.hrefAnchor")]), I("change", n, (e) => w(t(), a, e.target.value)), R(e, n);
			};
			B(m, (e) => {
				F(r).page || e(h);
			}), E(o), P((e, t) => {
				W(s, F(r).label), G(s, "title", e), u.disabled = a === n().length - 1, G(d, "title", t);
			}, [() => K("tip.linkLabel"), () => K("tip.removeLink")]), I("input", s, (e) => S(t(), a, e.target.value)), I("click", l, () => x(t(), a, -1)), I("click", u, () => x(t(), a, 1)), I("click", d, () => b(t(), a)), R(e, o);
		}), R(e, r);
	}, r = rt("urd-editor"), i = /* @__PURE__ */ D(() => r.siteDraft), { compressOrTrim: a, footerBgCtx: o, footerMutate: s, setStatus: c } = r;
	function l(e, t) {
		s(`edit:footer-brand-${e}`, (n) => {
			n.brand ??= {}, t.trim() ? n.brand[e] = t : delete n.brand[e], !n.brand.title && !n.brand.tagline && !n.brand.logo && delete n.brand;
		});
	}
	function u(e) {
		s("footer", (t) => {
			t.brand ??= {}, e === "image" || e === "both" ? t.brand.mode = e : delete t.brand.mode;
		});
	}
	async function d(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", t) try {
			let e = await a(t);
			s("footer", (t) => {
				t.brand ??= {}, t.brand.logo = e.dataUrl, t.brand.mode || (t.brand.mode = "both");
			});
		} catch {
			c(K("status.imageReadErrorSvg"), "error");
		}
	}
	function p() {
		s("footer", (e) => {
			e.brand && (delete e.brand.logo, delete e.brand.mode, delete e.brand.logoHeight, !e.brand.title && !e.brand.tagline && delete e.brand);
		});
	}
	function m(e) {
		s("edit:footer-logo-height", (t) => {
			t.brand ??= {};
			let n = Number(e);
			Number.isFinite(n) && (t.brand.logoHeight = Math.min(160, Math.max(16, Math.round(n))));
		});
	}
	function h(e) {
		s("edit:footer-copyright", (t) => {
			e.trim() ? t.copyright = e : delete t.copyright;
		});
	}
	let g = [
		{
			id: "minimal",
			label: K("footerTemplate.minimal"),
			thumb: {
				center: !0,
				social: 2,
				baselineLinks: 1
			}
		},
		{
			id: "centered",
			label: K("footerTemplate.centered"),
			thumb: {
				center: !0,
				row: !0,
				social: 3
			}
		},
		{
			id: "columns",
			label: K("footerTemplate.columns"),
			thumb: {
				tag: !0,
				cols: 3,
				social: 3,
				baselineLinks: 2
			}
		},
		{
			id: "sitemap",
			label: K("footerTemplate.sitemap"),
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
			label: K("footerTemplate.newsletter"),
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
			label: K("footerTemplate.bigcta"),
			thumb: {
				center: !0,
				bigcta: !0,
				baselineLinks: 2
			}
		},
		{
			id: "contact",
			label: K("footerTemplate.contact"),
			thumb: {
				tag: !0,
				cols: 3,
				social: 2,
				baselineLinks: 1
			}
		},
		{
			id: "mega",
			label: K("footerTemplate.mega"),
			thumb: {
				tag: !0,
				mega: !0,
				cols: 2,
				social: 4,
				baselineLinks: 2
			}
		},
		{
			id: "chapters",
			label: K("footerTemplate.chapters"),
			thumb: {
				chapters: !0,
				cols: 3,
				baselineLinks: 2
			}
		},
		{
			id: "split",
			label: K("footerTemplate.split"),
			thumb: {
				split: !0,
				cols: 2,
				baselineLinks: 1
			}
		}
	];
	function _(e) {
		let t = K("seed.orgName"), n = F(i).pages ?? [], r = (e) => n.slice(0, e).map((e) => ({
			label: e.title || e.id,
			page: e.id
		})), a = (e, t) => ({
			label: e,
			href: t
		}), o = `© ${t}`;
		return e === "minimal" ? {
			align: "center",
			brand: { title: t },
			copyright: o,
			baseline: [a(K("seed.footer.privacy"), "#")]
		} : e === "centered" ? {
			align: "center",
			brand: { title: t },
			linkRow: r(5),
			copyright: `${o} · ${K("seed.footer.madeWith")}`
		} : e === "columns" ? {
			align: "left",
			brand: {
				title: t,
				tagline: K("seed.footer.tagline1")
			},
			columns: [
				{
					title: K("seed.footer.colPages"),
					links: r(4)
				},
				{
					title: K("seed.footer.colCompany"),
					links: [
						a(K("seed.footer.about"), "#"),
						a(K("seed.join"), "#"),
						a(K("seed.footer.press"), "#")
					]
				},
				{
					title: K("seed.footer.colResources"),
					links: [
						a(K("seed.footer.bylaws"), "#"),
						a(K("seed.footer.privacy"), "#"),
						a(K("seed.footer.contact"), "#")
					]
				}
			],
			copyright: o,
			baseline: [a(K("seed.footer.privacy"), "#"), a(K("seed.footer.terms"), "#")]
		} : e === "sitemap" ? {
			align: "left",
			brand: {
				title: t,
				tagline: K("seed.footer.tagline2")
			},
			columns: [
				{
					title: K("seed.footer.colExplore"),
					links: [
						a(K("seed.footer.home"), "#"),
						a(K("seed.footer.events"), "#"),
						a(K("seed.footer.gallery"), "#"),
						a(K("seed.footer.blog"), "#")
					]
				},
				{
					title: K("seed.footer.colCompany"),
					links: [
						a(K("seed.footer.about"), "#"),
						a(K("seed.footer.history"), "#"),
						a(K("seed.footer.press"), "#"),
						a(K("seed.footer.contact"), "#")
					]
				},
				{
					title: K("seed.footer.colSupport"),
					links: [
						a(K("seed.join"), "#"),
						a(K("seed.footer.faq"), "#"),
						a(K("seed.footer.help"), "#")
					]
				},
				{
					title: K("seed.footer.colLegal"),
					links: [
						a(K("seed.footer.privacy"), "#"),
						a(K("seed.footer.terms"), "#"),
						a(K("seed.footer.bylaws"), "#")
					]
				}
			],
			copyright: o,
			baseline: [
				a(K("seed.footer.privacy"), "#"),
				a(K("seed.footer.terms"), "#"),
				a(K("seed.footer.cookies"), "#")
			]
		} : e === "newsletter" ? {
			align: "left",
			brand: {
				title: t,
				tagline: K("seed.footer.tagline3")
			},
			cta: {
				kind: "newsletter",
				heading: K("seed.footer.newsletterHeading"),
				label: K("seed.footer.newsletterButton"),
				recipient: K("seed.email"),
				success: K("seed.footer.newsletterSuccess")
			},
			columns: [{
				title: K("seed.footer.colPages"),
				links: r(4)
			}, {
				title: K("seed.footer.colMore"),
				links: [
					a(K("seed.footer.about"), "#"),
					a(K("seed.footer.contact"), "#"),
					a(K("seed.footer.privacy"), "#")
				]
			}],
			copyright: o,
			baseline: [a(K("seed.footer.privacy"), "#")]
		} : e === "bigcta" ? {
			align: "center",
			cta: {
				kind: "button",
				big: !0,
				heading: K("seed.footer.ctaHeading"),
				sub: K("seed.footer.ctaSub"),
				label: K("seed.join"),
				href: "#"
			},
			linkRow: r(4),
			copyright: o,
			baseline: [a(K("seed.footer.privacy"), "#"), a(K("seed.footer.terms"), "#")]
		} : e === "contact" ? {
			align: "left",
			brand: {
				title: t,
				tagline: K("seed.footer.tagline4")
			},
			columns: [
				{
					title: K("seed.footer.colVisit"),
					links: [
						a(K("seed.footer.address"), "#"),
						a(K("seed.email"), `mailto:${K("seed.email")}`),
						a(K("seed.phone"), `tel:${K("seed.phone").replace(/\s+/g, "")}`)
					]
				},
				{
					title: K("seed.footer.colHours"),
					links: [a(K("seed.footer.hours1"), "#"), a(K("seed.footer.hours2"), "#")]
				},
				{
					title: K("seed.footer.colPages"),
					links: r(4)
				}
			],
			copyright: o,
			baseline: [a(K("seed.footer.privacy"), "#")]
		} : e === "chapters" ? {
			align: "left",
			design: "chapters",
			brand: {
				title: t,
				tagline: K("seed.footer.tagline2")
			},
			columns: [
				{
					title: K("seed.footer.colExplore"),
					links: r(4)
				},
				{
					title: K("seed.footer.colCompany"),
					links: [
						a(K("seed.footer.about"), "#"),
						a(K("seed.footer.history"), "#"),
						a(K("seed.footer.contact"), "#")
					]
				},
				{
					title: K("seed.footer.colSupport"),
					links: [
						a(K("seed.join"), "#"),
						a(K("seed.footer.faq"), "#"),
						a(K("seed.footer.help"), "#")
					]
				}
			],
			copyright: o,
			baseline: [a(K("seed.footer.privacy"), "#"), a(K("seed.footer.terms"), "#")]
		} : e === "split" ? {
			align: "left",
			design: "split",
			brand: {
				title: t,
				tagline: K("seed.footer.tagline1")
			},
			cta: {
				kind: "button",
				heading: K("seed.footer.ctaHeading"),
				label: K("seed.join"),
				href: "#"
			},
			columns: [{
				title: K("seed.footer.colPages"),
				links: r(4)
			}, {
				title: K("seed.footer.colMore"),
				links: [
					a(K("seed.footer.about"), "#"),
					a(K("seed.footer.contact"), "#"),
					a(K("seed.footer.privacy"), "#")
				]
			}],
			copyright: o,
			baseline: [a(K("seed.footer.privacy"), "#")]
		} : {
			align: "left",
			brand: {
				title: t,
				tagline: K("seed.footer.tagline5")
			},
			columns: [{
				title: K("seed.footer.colExplore"),
				links: r(4)
			}, {
				title: K("seed.footer.colFollow"),
				links: [a(K("seed.footer.newsletter"), "#"), a(K("seed.email"), `mailto:${K("seed.email")}`)]
			}],
			copyright: o,
			baseline: [a(K("seed.footer.privacy"), "#"), a(K("seed.footer.madeWith"), "#")],
			background: {
				version: 1,
				layers: [{
					type: "glow",
					version: Lx.version ?? 1,
					props: {
						...Lx.defaults(),
						color: "accent",
						x: .12,
						y: 0,
						radius: .6,
						opacity: .45
					}
				}, {
					type: "grain",
					version: zx.version ?? 1,
					props: {
						...zx.defaults(),
						opacity: .08
					}
				}]
			}
		};
	}
	function v(e) {
		s("footer-template", (t) => {
			let n = _(e);
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
				"background",
				"design"
			]) n[e] === void 0 ? delete t[e] : t[e] = n[e];
		});
	}
	function y(e) {
		s("footer", (t) => {
			t[e] ??= [], t[e].push(F(i).pages[0] ? {
				label: K("seed.link"),
				page: F(i).pages[0].id
			} : {
				label: K("seed.link"),
				href: "https://"
			});
		});
	}
	function b(e, t) {
		s("footer", (n) => {
			n[e].splice(t, 1), n[e].length || delete n[e];
		});
	}
	function x(e, t, n) {
		s("footer", (r) => {
			let i = r[e], a = t + n;
			a < 0 || a >= i.length || ([i[t], i[a]] = [i[a], i[t]]);
		});
	}
	function S(e, t, n) {
		s(`edit:footer-${e}-label-${t}`, (r) => {
			r[e][t].label = n;
		});
	}
	function C(e, t, n) {
		s("footer", (r) => {
			let i = r[e][t];
			n === "__href" ? (delete i.page, i.href = i.href ?? "https://") : (i.page = n, delete i.href);
		});
	}
	function w(e, t, n) {
		s(`edit:footer-${e}-href-${t}`, (r) => {
			r[e][t].href = n;
		});
	}
	function ee(e) {
		s("footer", (t) => {
			e === "center" ? t.columnsAlign = "center" : delete t.columnsAlign;
		});
	}
	function T(e) {
		s("footer", (t) => {
			e ? t.cta ??= {
				kind: "button",
				label: K("seed.join")
			} : delete t.cta;
		});
	}
	function te(e, t) {
		s(`edit:footer-cta-${e}`, (n) => {
			n.cta ??= {}, t === "" || t == null || t === !1 ? delete n.cta[e] : n.cta[e] = t;
		});
	}
	function ne(e) {
		s("footer", (t) => {
			t.cta ??= {}, e === "__href" ? (delete t.cta.page, t.cta.href = t.cta.href ?? "https://") : (t.cta.page = e, delete t.cta.href);
		});
	}
	function re(e, t) {
		s("footer", (n) => {
			let r = new Set(n.hideOn ?? []);
			t ? r.delete(e) : r.add(e), r.size ? n.hideOn = [...r] : delete n.hideOn;
		});
	}
	function ie() {
		s("footer", (e) => {
			e.columns ??= [], e.columns.push({
				title: K("seed.column"),
				links: [{
					label: K("seed.link"),
					page: F(i).pages[0].id
				}]
			});
		});
	}
	function ae(e) {
		s("footer", (t) => {
			t.columns.splice(e, 1), t.columns.length || delete t.columns;
		});
	}
	function oe(e, t) {
		s("footer", (n) => {
			let r = e + t;
			r < 0 || r >= n.columns.length || ([n.columns[e], n.columns[r]] = [n.columns[r], n.columns[e]]);
		});
	}
	function se(e, t) {
		s(`edit:footer-col-title-${e}`, (n) => {
			n.columns[e].title = t;
		});
	}
	function ce(e) {
		s("footer", (t) => {
			t.columns[e].links ??= [], t.columns[e].links.push({
				label: K("seed.link"),
				page: F(i).pages[0].id
			});
		});
	}
	function le(e, t) {
		s("footer", (n) => {
			n.columns[e].links.splice(t, 1);
		});
	}
	function ue(e, t, n) {
		s("footer", (r) => {
			let i = r.columns[e].links, a = t + n;
			a < 0 || a >= i.length || ([i[t], i[a]] = [i[a], i[t]]);
		});
	}
	function de(e, t, n) {
		s(`edit:footer-link-label-${e}-${t}`, (r) => {
			r.columns[e].links[t].label = n;
		});
	}
	function fe(e, t, n) {
		s("footer", (r) => {
			let i = r.columns[e].links[t];
			n === "__href" ? (delete i.page, i.href = i.href ?? "https://") : (i.page = n, delete i.href);
		});
	}
	function pe(e, t, n) {
		s(`edit:footer-link-href-${e}-${t}`, (r) => {
			r.columns[e].links[t].href = n;
		});
	}
	var me = nS(), he = A(me), ge = A(he);
	U(ge);
	var _e = N(ge);
	E(he);
	var ve = N(he, 2), ye = (e) => {
		var t = Gx(), n = A(t), r = M(n, !0), a = N(n, 2);
		di(a, 21, () => F(i).pages ?? [], (e) => e.id, (e, t) => {
			var n = Wx(), r = A(n);
			U(r);
			var a = N(r);
			E(n), P((e, i) => {
				G(n, "title", e), Vi(r, i), z(a, ` ${(F(t).title || F(t).id) ?? ""}`);
			}, [() => K("tip.footer.hideOnPage"), () => !(F(i).footer?.hideOn ?? []).includes(F(t).id)]), I("change", r, (e) => re(F(t).id, e.target.checked)), R(e, n);
		}), E(a), E(t), P((e) => z(r, e), [() => K("group.showOnPages")]), R(e, t);
	};
	B(ve, (e) => {
		F(i).footer?.show && e(ye);
	});
	var be = N(ve, 2), xe = A(be), Se = M(xe, !0), Ce = N(xe, 2), we = A(Ce);
	di(we, 21, () => g, (e) => e.id, (e, t) => {
		var n = Kx(), r = A(n);
		V(r, () => Bx(F(t).thumb), !0), E(r);
		var i = M(N(r, 2), !0);
		E(n), P((e) => {
			G(n, "title", e), z(i, F(t).label);
		}, [() => K("tip.footer.template", { label: F(t).label })]), I("click", n, () => v(F(t).id)), R(e, n);
	}), E(we), E(Ce), E(be);
	var Te = N(be, 2), Ee = A(Te), De = M(Ee, !0), Oe = N(Ee, 2), ke = A(Oe), je = A(ke), Me = N(je);
	U(Me), E(ke);
	var Ne = N(ke, 2), Pe = A(Ne), Fe = N(Pe);
	U(Fe), E(Ne);
	var Ie = N(Ne, 2), Le = A(Ie), Re = N(Le);
	{
		let e = /* @__PURE__ */ D(() => F(i).footer?.brand?.mode ?? "text"), t = /* @__PURE__ */ D(() => [
			["text", K("blocks.text")],
			["image", K("opt.brand.image")],
			["both", K("opt.brand.both")]
		]);
		J(Re, {
			get value() {
				return F(e);
			},
			get options() {
				return F(t);
			},
			onchange: (e) => u(e)
		});
	}
	E(Ie);
	var ze = N(Ie, 2), Be = (e) => {
		var t = Yx(), n = j(t), r = A(n), a = A(r), o = N(a);
		E(r);
		var s = N(r, 2), c = (e) => {
			var t = qx();
			V(t, () => q.cross, !0), E(t), P((e) => G(t, "title", e), [() => K("tip.footer.removeLogo")]), I("click", t, p), R(e, t);
		};
		B(s, (e) => {
			F(i).footer?.brand?.logo && e(c);
		}), E(n);
		var l = N(n, 2), u = (e) => {
			var t = Jx(), n = j(t), r = A(n), a = M(N(r));
			E(n);
			var o = N(n, 2);
			U(o), P((e) => {
				z(r, `${e ?? ""} `), z(a, `${F(i).footer?.brand?.logoHeight ?? 40 ?? ""} px`), W(o, F(i).footer?.brand?.logoHeight ?? 40);
			}, [() => K("lbl.logoHeight")]), I("input", o, (e) => m(e.target.value)), R(e, t);
		};
		B(l, (e) => {
			F(i).footer?.brand?.logo && e(u);
		}), P((e, t) => {
			G(r, "title", e), z(a, `${t ?? ""} `);
		}, [() => K("tip.webpAutoPublish"), () => F(i).footer?.brand?.logo ? K("ui.changeLogo") : K("ui.uploadLogo")]), I("change", o, d), R(e, t);
	};
	B(ze, (e) => {
		(F(i).footer?.brand?.mode ?? "text") !== "text" && e(Be);
	}), E(Oe), E(Te);
	var Ve = N(Te, 2), He = A(Ve), Ue = M(He, !0), We = N(He, 2), Ge = A(We);
	di(Ge, 17, () => F(i).footer?.columns ?? [], si, (e, t, n) => {
		var r = Xx(), a = j(r), o = A(a);
		U(o);
		var s = N(o, 2), c = A(s);
		V(c, () => q.plus, !0), E(c);
		var l = N(c, 2);
		l.disabled = n === 0, V(l, () => q.up, !0), E(l);
		var u = N(l, 2);
		V(u, () => q.down, !0), E(u);
		var d = N(u, 2);
		V(d, () => q.cross, !0), E(d), E(s), E(a), di(N(a, 2), 17, () => F(t).links ?? [], si, (e, r, a) => {
			var o = Ux(), s = A(o);
			U(s);
			var c = N(s, 2), l = A(c);
			l.disabled = a === 0, V(l, () => q.up, !0), E(l);
			var u = N(l, 2);
			V(u, () => q.down, !0), E(u);
			var d = N(u, 2);
			V(d, () => q.cross, !0), E(d), E(c);
			var f = N(c, 2), p = A(f);
			{
				let e = /* @__PURE__ */ D(() => F(r).page ?? "__href"), t = /* @__PURE__ */ D(() => K("tip.linkTarget")), o = /* @__PURE__ */ D(() => [...F(i).pages.map((e) => [e.id, e.title]), ["__href", K("opt.linkHref")]]);
				J(p, {
					get value() {
						return F(e);
					},
					get title() {
						return F(t);
					},
					get options() {
						return F(o);
					},
					onchange: (e) => fe(n, a, e)
				});
			}
			E(f);
			var m = N(f, 2), h = (e) => {
				var t = Hx();
				U(t), P((e, n) => {
					W(t, F(r).href ?? ""), G(t, "placeholder", e), G(t, "title", n);
				}, [() => K("ph.hrefAnchor"), () => K("tip.hrefAnchor")]), I("change", t, (e) => pe(n, a, e.target.value)), R(e, t);
			};
			B(m, (e) => {
				F(r).page || e(h);
			}), E(o), P((e, n) => {
				W(s, F(r).label), G(s, "title", e), u.disabled = a === F(t).links.length - 1, G(d, "title", n);
			}, [() => K("tip.linkLabel"), () => K("tip.removeLink")]), I("input", s, (e) => de(n, a, e.target.value)), I("click", l, () => ue(n, a, -1)), I("click", u, () => ue(n, a, 1)), I("click", d, () => le(n, a)), R(e, o);
		}), P((e, r, a) => {
			W(o, F(t).title), G(o, "title", e), G(c, "title", r), u.disabled = n === F(i).footer.columns.length - 1, G(d, "title", a);
		}, [
			() => K("tip.footer.columnTitle"),
			() => K("tip.footer.addLink"),
			() => K("tip.footer.removeColumn")
		]), I("input", o, (e) => se(n, e.target.value)), I("click", c, () => ce(n)), I("click", l, () => oe(n, -1)), I("click", u, () => oe(n, 1)), I("click", d, () => ae(n)), R(e, r);
	});
	var Ke = N(Ge, 2), qe = M(Ke, !0), Je = N(Ke, 2), Ye = A(Je), Xe = N(Ye);
	{
		let e = /* @__PURE__ */ D(() => F(i).footer?.columnsAlign ?? "left"), t = /* @__PURE__ */ D(() => [["left", K("common.left")], ["center", K("common.center")]]);
		J(Xe, {
			get value() {
				return F(e);
			},
			get options() {
				return F(t);
			},
			onchange: (e) => ee(e)
		});
	}
	E(Je), E(We), E(Ve);
	var Ze = N(Ve, 2), Qe = A(Ze), $e = M(Qe, !0), et = N(Qe, 2), tt = A(et), nt = A(tt);
	U(nt);
	var it = N(nt);
	E(tt);
	var st = N(tt, 2), ct = M(st, !0);
	E(et), E(Ze);
	var lt = N(Ze, 2), ut = A(lt), dt = M(ut, !0), ft = N(ut, 2), pt = A(ft), mt = A(pt);
	U(mt);
	var ht = N(mt);
	E(pt);
	var gt = N(pt, 2), _t = (e) => {
		let t = /* @__PURE__ */ D(() => F(i).footer.cta);
		var n = eS(), r = j(n), a = A(r), o = N(a);
		{
			let e = /* @__PURE__ */ D(() => F(t).kind ?? "button"), n = /* @__PURE__ */ D(() => [["button", K("opt.cta.button")], ["newsletter", K("opt.cta.newsletter")]]);
			J(o, {
				get value() {
					return F(e);
				},
				get options() {
					return F(n);
				},
				onchange: (e) => te("kind", e)
			});
		}
		E(r);
		var s = N(r, 2), c = A(s);
		U(c);
		var l = N(c);
		E(s);
		var u = N(s, 2), d = A(u), f = N(d);
		U(f), E(u);
		var p = N(u, 2), m = A(p), h = N(m);
		U(h), E(p);
		var g = N(p, 2), _ = A(g), v = N(_);
		U(v), E(g);
		var y = N(g, 2), b = (e) => {
			var n = Qx(), r = j(n), a = A(r), o = N(a);
			{
				let e = /* @__PURE__ */ D(() => F(t).page ?? "__href"), n = /* @__PURE__ */ D(() => [...F(i).pages.map((e) => [e.id, e.title]), ["__href", K("opt.linkHrefMailto")]]);
				J(o, {
					get value() {
						return F(e);
					},
					get options() {
						return F(n);
					},
					onchange: (e) => ne(e)
				});
			}
			E(r);
			var s = N(r, 2), c = (e) => {
				var n = Zx();
				U(n), P((e, r) => {
					W(n, F(t).href ?? ""), G(n, "placeholder", e), G(n, "title", r);
				}, [() => K("ph.hrefMailtoAnchor"), () => K("tip.hrefAnchor")]), I("change", n, (e) => te("href", e.target.value)), R(e, n);
			};
			B(s, (e) => {
				F(t).page || e(c);
			}), P((e, t) => {
				G(r, "title", e), z(a, `${t ?? ""} `);
			}, [() => K("tip.footer.ctaTarget"), () => K("lbl.buttonTarget")]), R(e, n);
		}, x = (e) => {
			var n = $x(), r = j(n), i = A(r), a = N(i);
			U(a), E(r);
			var o = N(r, 2), s = A(o), c = N(s);
			U(c), E(o);
			var l = N(o, 2), u = A(l), d = N(u);
			U(d), E(l), P((e, n, f, p, m, h, g, _, v) => {
				G(r, "title", e), z(i, `${n ?? ""} `), W(a, F(t).endpoint ?? ""), G(a, "placeholder", f), G(o, "title", p), z(s, `${m ?? ""} `), W(c, F(t).recipient ?? ""), G(c, "placeholder", h), G(l, "title", g), z(u, `${_ ?? ""} `), W(d, F(t).success ?? ""), G(d, "placeholder", v);
			}, [
				() => K("tip.footer.ctaEndpoint"),
				() => K("lbl.newsletterEndpoint"),
				() => K("ph.endpoint"),
				() => K("tip.footer.ctaRecipient"),
				() => K("lbl.recipientFallback"),
				() => K("ph.email"),
				() => K("tip.footer.ctaSuccess"),
				() => K("lbl.confirmation"),
				() => K("ph.footer.ctaSuccess")
			]), I("change", a, (e) => te("endpoint", e.target.value)), I("change", c, (e) => te("recipient", e.target.value)), I("input", d, (e) => te("success", e.target.value)), R(e, n);
		};
		B(y, (e) => {
			(F(t).kind ?? "button") === "button" ? e(b) : e(x, -1);
		}), P((e, n, i, o, y, b, x, S, C, w, ee, T) => {
			G(r, "title", e), z(a, `${n ?? ""} `), G(s, "title", i), Vi(c, F(t).big === !0), z(l, ` ${o ?? ""}`), G(u, "title", y), z(d, `${b ?? ""} `), W(f, F(t).heading ?? ""), G(f, "placeholder", x), G(p, "title", S), z(m, `${C ?? ""} `), W(h, F(t).sub ?? ""), G(g, "title", w), z(_, `${ee ?? ""} `), W(v, F(t).label ?? ""), G(v, "placeholder", T);
		}, [
			() => K("tip.footer.ctaKind"),
			() => K("common.type"),
			() => K("tip.footer.ctaBig"),
			() => K("lbl.bigCentered"),
			() => K("tip.footer.ctaHeading"),
			() => K("lbl.heading"),
			() => K("ph.footer.ctaHeading"),
			() => K("tip.footer.ctaSub"),
			() => K("lbl.subText"),
			() => K("tip.footer.ctaLabel"),
			() => K("lbl.buttonText"),
			() => K("ph.footer.ctaLabel")
		]), I("change", c, (e) => te("big", e.target.checked)), I("input", f, (e) => te("heading", e.target.value)), I("input", h, (e) => te("sub", e.target.value)), I("input", v, (e) => te("label", e.target.value)), R(e, n);
	};
	B(gt, (e) => {
		F(i).footer?.cta && e(_t);
	}), E(ft), E(lt);
	var vt = N(lt, 2), yt = A(vt), bt = M(yt, !0), xt = N(yt, 2), St = A(xt);
	n(St, () => "linkRow", () => F(i).footer?.linkRow ?? []);
	var Ct = N(St, 2), wt = M(Ct, !0);
	E(xt), E(vt);
	var Tt = N(vt, 2), Et = A(Tt), Dt = M(Et, !0), Ot = N(Et, 2), kt = A(Ot), At = (e) => {
		var t = tS(), n = j(t), r = A(n), a = N(r);
		{
			let e = /* @__PURE__ */ D(() => F(i).footer?.align ?? "left"), t = /* @__PURE__ */ D(() => [
				["left", K("common.left")],
				["center", K("common.center")],
				["right", K("common.right")]
			]);
			J(a, {
				get value() {
					return F(e);
				},
				get options() {
					return F(t);
				},
				onchange: (e) => s("footer", (t) => {
					t.align = e;
				})
			});
		}
		E(n), Ae(2), P((e, t) => {
			G(n, "title", e), z(r, `${t ?? ""} `);
		}, [() => K("tip.footer.align"), () => K("lbl.align")]), R(e, t);
	};
	B(kt, (e) => {
		F(i).footer?.cta?.big !== !0 && e(At);
	});
	var jt = N(kt, 2), Mt = M(jt, !0), Nt = N(jt, 2);
	{
		let e = /* @__PURE__ */ D(() => F(i).footer?.background?.layers ?? []);
		cf(Nt, {
			get bg() {
				return o;
			},
			get layers() {
				return F(e);
			}
		});
	}
	E(Ot), E(Tt);
	var Pt = N(Tt, 2), Ft = A(Pt), It = M(Ft, !0), Lt = N(Ft, 2), Rt = A(Lt), zt = A(Rt), Bt = N(zt);
	U(Bt), E(Rt);
	var Vt = N(Rt, 2), Ht = M(Vt, !0), Ut = N(Vt, 2);
	n(Ut, () => "baseline", () => F(i).footer?.baseline ?? []);
	var Wt = N(Ut, 2), Gt = M(Wt, !0);
	E(Lt), E(Pt), E(me), P((e, t, n, r, a, o, s, c, l, u, d, f, p, m, h, g, _, v, y, b, x, S, C, w, ee, T, te, ne, re, ie, ae, oe, se, ce, le) => {
		G(he, "title", e), Vi(ge, t), z(_e, ` ${n ?? ""}`), z(Se, r), z(De, a), G(ke, "title", o), z(je, `${s ?? ""} `), W(Me, F(i).footer?.brand?.title ?? ""), G(Me, "placeholder", c), G(Ne, "title", l), z(Pe, `${u ?? ""} `), W(Fe, F(i).footer?.brand?.tagline ?? ""), G(Ie, "title", d), z(Le, `${f ?? ""} `), z(Ue, p), z(qe, m), G(Je, "title", h), z(Ye, `${g ?? ""} `), G(Qe, "title", _), z($e, v), G(tt, "title", y), Vi(nt, F(i).footer?.links !== !1), z(it, ` ${b ?? ""}`), z(ct, x), z(dt, S), G(pt, "title", C), Vi(mt, w), z(ht, ` ${ee ?? ""}`), z(bt, T), z(wt, te), z(Dt, ne), z(Mt, re), z(It, ie), G(Rt, "title", ae), z(zt, `${oe ?? ""} `), W(Bt, F(i).footer?.copyright ?? ""), G(Bt, "placeholder", se), z(Ht, ce), z(Gt, le);
	}, [
		() => K("tip.footer.show"),
		() => !!F(i).footer?.show,
		() => K("lbl.showFooter"),
		() => K("group.startpoint"),
		() => K("group.brand"),
		() => K("tip.footer.brandTitle"),
		() => K("lbl.title"),
		() => K("ph.footer.brandTitle"),
		() => K("tip.footer.tagline"),
		() => K("lbl.tagline"),
		() => K("tip.footer.brandMode"),
		() => K("lbl.brandMode"),
		() => K("group.columns"),
		() => K("ui.addColumn"),
		() => K("tip.footer.columnsAlign"),
		() => K("lbl.splitColumnAlign"),
		() => K("tip.footer.links"),
		() => K("group.social"),
		() => K("tip.footer.links"),
		() => K("ui.footerLinks"),
		() => K("ui.editSiteLinks"),
		() => K("group.cta"),
		() => K("tip.footer.cta"),
		() => !!F(i).footer?.cta,
		() => K("lbl.showCta"),
		() => K("group.linkRow"),
		() => K("ui.addRowLink"),
		() => K("group.appearance"),
		() => K("lbl.background"),
		() => K("group.baseline"),
		() => K("tip.footer.copyright"),
		() => K("lbl.copyright"),
		() => K("ph.footer.copyright"),
		() => K("lbl.baselineLinks"),
		() => K("ui.addBaselineLink")
	]), I("change", ge, (e) => s("footer", (t) => {
		t.show = e.target.checked;
	})), I("input", Me, (e) => l("title", e.target.value)), I("input", Fe, (e) => l("tagline", e.target.value)), I("click", Ke, ie), I("change", nt, (e) => s("footer", (t) => {
		e.target.checked ? delete t.links : t.links = !1;
	})), I("click", st, () => {
		r.siteLinksOpen = !0, r.openPanel("site");
	}), I("change", mt, (e) => T(e.target.checked)), I("click", Ct, () => y("linkRow")), I("input", Bt, (e) => h(e.target.value)), I("click", Wt, () => y("baseline")), R(e, me), ot();
}
Vr([
	"input",
	"click",
	"change"
]);
//#endregion
//#region ../template/assets/engine/0.7.6/collections-csv.js
var iS = [
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
function aS(e) {
	let t = String(e ?? "");
	return /[",\n\r]/.test(t) ? `"${t.replaceAll("\"", "\"\"")}"` : t;
}
function oS(e, t) {
	return t === "sizes" ? (e.sizes ?? []).join("|") : t === "colors" ? (e.colors ?? []).map((e) => e.name).join("|") : e[t] ?? "";
}
function sS(e) {
	let t = [iS.join(",")];
	for (let n of e ?? []) t.push(iS.map((e) => aS(oS(n, e))).join(","));
	return t.join("\n") + "\n";
}
function cS(e) {
	let t = [], n = [], r = "", i = !1, a = String(e ?? "");
	for (let e = 0; e < a.length; e += 1) {
		let o = a[e];
		i ? o === "\"" && a[e + 1] === "\"" ? (r += "\"", e += 1) : o === "\"" ? i = !1 : r += o : o === "\"" ? i = !0 : o === "," ? (n.push(r), r = "") : o === "\n" || o === "\r" ? (o === "\r" && a[e + 1] === "\n" && (e += 1), n.push(r), t.push(n), n = [], r = "") : r += o;
	}
	return (r !== "" || n.length) && (n.push(r), t.push(n)), t.filter((e) => e.some((e) => e.trim() !== ""));
}
var lS = (e) => String(e ?? "").split("|").map((e) => e.trim()).filter(Boolean);
function uS(e) {
	let t = cS(e);
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
		let s = lS(t.sizes);
		s.length && (o.sizes = s);
		let c = lS(t.colors);
		c.length && (o.colors = c.map((e) => ({ name: e }))), r.push(o);
	}
	return {
		entries: r,
		skipped: i
	};
}
//#endregion
//#region src/panels/CollectionsPanel.svelte
var dS = /* @__PURE__ */ L("<label> <!></label>"), fS = /* @__PURE__ */ L("<label> <input type=\"date\"/></label>"), pS = /* @__PURE__ */ L("<label> <input/></label>"), mS = /* @__PURE__ */ L("<img class=\"site-icon-preview\" alt=\"\"/> <button class=\"ghost row-tool\"></button>", 1), hS = /* @__PURE__ */ L("<img class=\"site-icon-preview\" alt=\"\"/>"), gS = /* @__PURE__ */ L("<span class=\"toolbar-row\"><input/> <label class=\"ghost filepick\"> <input type=\"file\" accept=\"image/*\"/></label> <!> <button class=\"ghost row-tool\"></button></span>"), _S = /* @__PURE__ */ L("<label> <input type=\"number\" min=\"0\" step=\"0.01\"/></label> <label> <input type=\"number\" min=\"0\" step=\"0.01\"/></label> <label> <input/></label> <label> <input/></label> <!> <button class=\"ghost action\"> </button>", 1), vS = /* @__PURE__ */ L("<details class=\"group collection-entry\"><summary> </summary> <div class=\"group-items\"><span class=\"toolbar-row\"><input/> <span class=\"row-tools\"><button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button> <button class=\"ghost row-tool\"></button></span></span> <!> <textarea rows=\"3\"></textarea> <!> <span class=\"toolbar-row\"><label class=\"ghost filepick\"> <input type=\"file\" accept=\"image/*\"/></label> <!></span> <!></div></details>"), yS = /* @__PURE__ */ L("<p class=\"panel-hint\"> </p>"), bS = /* @__PURE__ */ L("<span class=\"toolbar-row\"><button class=\"ghost action\"> </button> <button class=\"ghost action\"> </button> <label class=\"ghost filepick\"> <input type=\"file\" accept=\".csv,text/csv\"/></label> <button class=\"ghost row-tool\"></button></span> <!> <!> <hr class=\"gridmenu-divider\"/>", 1), xS = /* @__PURE__ */ L("<div class=\"panel-body\"><!> <!> <label> <input/></label> <label> <!></label> <button class=\"ghost action\"> </button></div>");
function SS(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.collectionIds), i = /* @__PURE__ */ D(() => n.collectionStores), a = /* @__PURE__ */ D(() => n.collectionsView), { addCollection: o, addCollectionEntry: s, compressOrTrim: c, mutateCollection: l, plainTitle: u, removeCollection: d, setStatus: f } = n, p = [
		["news", K("collectionKind.news")],
		["notices", K("collectionKind.notices")],
		["publications", K("collectionKind.publications")],
		["products", K("collectionKind.products")],
		["custom", K("collectionKind.custom")]
	];
	function m(e, t, n, r) {
		l(e, `edit:collection:${e}:${t}:${n}`, (e) => {
			let i = e.entries.find((e) => e.id === t);
			i && (r === "" && n !== "title" ? delete i[n] : i[n] = r);
		});
	}
	function h(e, t, n) {
		l(e, `collection:${e}:move-entry`, (e) => {
			let r = t + n;
			r < 0 || r >= e.entries.length || ([e.entries[t], e.entries[r]] = [e.entries[r], e.entries[t]]);
		});
	}
	function g(e, t) {
		l(e, `collection:${e}:remove-entry`, (e) => {
			e.entries = e.entries.filter((e) => e.id !== t);
		});
	}
	async function _(e, t, n) {
		let r = n.target.files?.[0];
		n.target.value = "", r && m(e, t, "image", (await c(r)).dataUrl);
	}
	function v(e, t, n) {
		let r = n.split(",").map((e) => e.trim()).filter(Boolean);
		m(e, t, "sizes", r.length ? r : "");
	}
	function y(e, t) {
		l(e, `collection:${e}:${t}:colors`, (e) => {
			let n = e.entries.find((e) => e.id === t);
			n && (n.colors = [...n.colors ?? [], { name: K("ph.colorName") }]);
		});
	}
	function b(e, t, n, r, i) {
		l(e, `edit:collection:${e}:${t}:color:${n}:${r}`, (e) => {
			let a = e.entries.find((e) => e.id === t)?.colors?.[n];
			a && (r === "image" && !i ? delete a.image : i && (a[r] = i));
		});
	}
	async function x(e, t, n, r) {
		let i = r.target.files?.[0];
		r.target.value = "", i && b(e, t, n, "image", (await c(i)).dataUrl);
	}
	function S(e, t, n) {
		l(e, `collection:${e}:${t}:colors`, (e) => {
			let r = e.entries.find((e) => e.id === t);
			r?.colors && (r.colors = r.colors.filter((e, t) => t !== n), r.colors.length || delete r.colors);
		});
	}
	function C(e) {
		let t = F(i)[e]?.data;
		if (!t) return;
		let n = URL.createObjectURL(new Blob([sS(t.entries)], { type: "text/csv" })), r = document.createElement("a");
		r.href = n, r.download = `${e}.csv`, r.click(), URL.revokeObjectURL(n);
	}
	async function w(e, t) {
		let n = t.target.files?.[0];
		if (t.target.value = "", !n) return;
		let r = uS(await n.text());
		if (!r) {
			f(K("status.csvInvalid"), "error");
			return;
		}
		let i = /* @__PURE__ */ new Set();
		for (let e of r.entries) (!/^[a-z0-9][a-z0-9-]*$/.test(e.id) || i.has(e.id)) && (e.id = es("entry")), i.add(e.id);
		l(e, `collection:${e}:import`, (e) => {
			e.entries = r.entries;
		}), f(K("status.csvImported", { count: String(r.entries.length) }), "ok");
	}
	var ee = xS(), T = A(ee), te = (e) => {
		var t = dS(), i = A(t), o = N(i);
		{
			let e = /* @__PURE__ */ D(() => n.activeCollection ?? ""), t = /* @__PURE__ */ D(() => [["", K("common.choose")], ...F(r).map((e) => [e, F(a)[e]?.name ?? e])]);
			J(o, {
				get value() {
					return F(e);
				},
				get options() {
					return F(t);
				},
				onchange: (e) => n.activeCollection = e || null
			});
		}
		E(t), P((e) => z(i, `${e ?? ""} `), [() => K("blocks.collection")]), R(e, t);
	};
	B(T, (e) => {
		F(r).length && e(te);
	});
	var ne = N(T, 2), re = (e) => {
		let t = /* @__PURE__ */ D(() => F(a)[n.activeCollection]);
		var r = bS(), i = j(r), o = A(i), c = M(o, !0), l = N(o, 2), f = M(l, !0), p = N(l, 2), ee = A(p), T = N(ee);
		E(p);
		var te = N(p, 2);
		V(te, () => q.cross, !0), E(te), E(i);
		var ne = N(i, 2);
		di(ne, 19, () => F(t).entries, (e) => e.id, (e, r, i) => {
			var a = vS(), o = A(a), s = M(o), c = N(o, 2), l = A(c), d = A(l);
			U(d);
			var f = N(d, 2), p = A(f);
			V(p, () => q.up, !0), E(p);
			var C = N(p, 2);
			V(C, () => q.down, !0), E(C);
			var w = N(C, 2);
			V(w, () => q.cross, !0), E(w), E(f), E(l);
			var ee = N(l, 2), T = (e) => {
				var t = fS(), i = A(t), a = N(i);
				U(a), E(t), P((e) => {
					z(i, `${e ?? ""} `), W(a, F(r).date ?? "");
				}, [() => K("lbl.date")]), I("change", a, (e) => m(n.activeCollection, F(r).id, "date", e.target.value)), R(e, t);
			};
			B(ee, (e) => {
				F(t).kind !== "products" && e(T);
			});
			var te = N(ee, 2);
			vt(te);
			var ne = N(te, 2), re = (e) => {
				var t = pS(), i = A(t), a = N(i);
				U(a), E(t), P((e, t) => {
					z(i, `${e ?? ""} `), W(a, F(r).href ?? ""), G(a, "placeholder", t);
				}, [() => K("lbl.link"), () => K("ph.collections.href")]), I("change", a, (e) => m(n.activeCollection, F(r).id, "href", e.target.value)), R(e, t);
			};
			B(ne, (e) => {
				F(t).kind !== "products" && e(re);
			});
			var ie = N(ne, 2), ae = A(ie), oe = A(ae), se = N(oe);
			E(ae);
			var ce = N(ae, 2), le = (e) => {
				var t = mS(), i = j(t), a = N(i, 2);
				V(a, () => q.cross, !0), E(a), P((e) => {
					G(i, "src", F(r).image), G(a, "title", e);
				}, [() => K("tip.removeImage")]), I("click", a, () => m(n.activeCollection, F(r).id, "image", "")), R(e, t);
			};
			B(ce, (e) => {
				F(r).image && e(le);
			}), E(ie);
			var ue = N(ie, 2), de = (e) => {
				var t = _S(), i = j(t), a = A(i), o = N(a);
				U(o), E(i);
				var s = N(i, 2), c = A(s), l = N(c);
				U(l), E(s);
				var u = N(s, 2), d = A(u), f = N(d);
				U(f), E(u);
				var p = N(u, 2), h = A(p), g = N(h);
				U(g), E(p);
				var _ = N(p, 2);
				di(_, 17, () => F(r).colors ?? [], si, (e, t, i) => {
					var a = gS(), o = A(a);
					U(o);
					var s = N(o, 2), c = A(s), l = N(c);
					E(s);
					var u = N(s, 2), d = (e) => {
						var n = hS();
						P(() => G(n, "src", F(t).image)), R(e, n);
					};
					B(u, (e) => {
						F(t).image && e(d);
					});
					var f = N(u, 2);
					V(f, () => q.cross, !0), E(f), E(a), P((e, n) => {
						W(o, F(t).name), G(o, "placeholder", e), z(c, `${n ?? ""} `);
					}, [() => K("ph.colorName"), () => F(t).image ? K("ui.changeImage") : K("ui.addImage")]), I("change", o, (e) => b(n.activeCollection, F(r).id, i, "name", e.target.value)), I("change", l, (e) => x(n.activeCollection, F(r).id, i, e)), I("click", f, () => S(n.activeCollection, F(r).id, i)), R(e, a);
				});
				var C = N(_, 2), w = M(C, !0);
				P((e, t, n, i, m, _, v, y, b, x, S) => {
					z(a, `${e ?? ""} `), W(o, F(r).price ?? ""), G(s, "title", t), z(c, `${n ?? ""} `), W(l, F(r).memberPrice ?? ""), G(u, "title", i), z(d, `${m ?? ""} `), W(f, F(r).badge ?? ""), G(p, "title", _), z(h, `${v ?? ""} `), W(g, y), G(g, "placeholder", b), G(C, "title", x), z(w, S);
				}, [
					() => K("lbl.price"),
					() => K("tip.entry.memberPrice"),
					() => K("lbl.memberPrice"),
					() => K("tip.entry.badge"),
					() => K("lbl.productBadge"),
					() => K("tip.entry.sizes"),
					() => K("lbl.sizes"),
					() => (F(r).sizes ?? []).join(", "),
					() => K("ph.sizes"),
					() => K("tip.entry.colors"),
					() => K("ui.addColor")
				]), I("change", o, (e) => m(n.activeCollection, F(r).id, "price", e.target.value === "" ? "" : Number(e.target.value))), I("change", l, (e) => m(n.activeCollection, F(r).id, "memberPrice", e.target.value === "" ? "" : Number(e.target.value))), I("change", f, (e) => m(n.activeCollection, F(r).id, "badge", e.target.value)), I("change", g, (e) => v(n.activeCollection, F(r).id, e.target.value)), I("click", C, () => y(n.activeCollection, F(r).id)), R(e, t);
			};
			B(ue, (e) => {
				F(t).kind === "products" && e(de);
			}), E(c), E(a), P((e, n, a, o, c) => {
				z(s, `${e ?? ""}${F(t).kind === "products" ? F(r).price == null ? "" : ` · ${F(r).price}` : F(r).date ? ` · ${F(r).date}` : ""}`), W(d, F(r).title), G(d, "title", n), p.disabled = F(i) === 0, C.disabled = F(i) === F(t).entries.length - 1, G(w, "title", a), G(te, "placeholder", o), W(te, F(r).text ?? ""), z(oe, `${c ?? ""} `);
			}, [
				() => u(F(r).title),
				() => K("lbl.title"),
				() => K("tip.collections.deleteEntry"),
				() => K("ph.collections.text"),
				() => F(r).image ? K("ui.changeImage") : K("ui.addImage")
			]), I("change", d, (e) => m(n.activeCollection, F(r).id, "title", e.target.value || K("ui.untitled"))), I("click", p, () => h(n.activeCollection, F(i), -1)), I("click", C, () => h(n.activeCollection, F(i), 1)), I("click", w, () => g(n.activeCollection, F(r).id)), I("change", te, (e) => m(n.activeCollection, F(r).id, "text", e.target.value)), I("change", se, (e) => _(n.activeCollection, F(r).id, e)), R(e, a);
		});
		var re = N(ne, 2), ie = (e) => {
			var t = yS(), n = M(t, !0);
			P((e) => z(n, e), [() => K("hint.collections.empty")]), R(e, t);
		};
		B(re, (e) => {
			F(t).entries.length || e(ie);
		}), Ae(2), P((e, t, n, r, i, a) => {
			z(c, e), G(l, "title", t), z(f, n), G(p, "title", r), z(ee, `${i ?? ""} `), G(te, "title", a);
		}, [
			() => K("ui.addEntry"),
			() => K("tip.collections.exportCsv"),
			() => K("ui.exportCsv"),
			() => K("tip.collections.importCsv"),
			() => K("ui.importCsv"),
			() => K("tip.collections.deleteCollection")
		]), I("click", o, () => s(n.activeCollection)), I("click", l, () => C(n.activeCollection)), I("change", T, (e) => w(n.activeCollection, e)), I("click", te, () => d(n.activeCollection)), R(e, r);
	};
	B(ne, (e) => {
		n.activeCollection && F(a)[n.activeCollection] && e(re);
	});
	var ie = N(ne, 2), ae = A(ie), oe = N(ae);
	U(oe), E(ie);
	var se = N(ie, 2), ce = A(se);
	J(N(ce), {
		get value() {
			return n.newCollectionKind;
		},
		get options() {
			return p;
		},
		onchange: (e) => n.newCollectionKind = e
	}), E(se);
	var le = N(se, 2), ue = M(le, !0);
	E(ee), P((e, t, n, r, i) => {
		z(ae, `${e ?? ""} `), G(oe, "placeholder", t), z(ce, `${n ?? ""} `), le.disabled = r, z(ue, i);
	}, [
		() => K("lbl.newCollectionName"),
		() => K("ph.collections.name"),
		() => K("common.type"),
		() => !n.newCollectionName.trim(),
		() => K("ui.createCollection")
	]), I("keydown", oe, (e) => e.key === "Enter" && o()), Gi(oe, () => n.newCollectionName, (e) => n.newCollectionName = e), I("click", le, o), R(e, ee), ot();
}
Vr([
	"click",
	"change",
	"keydown"
]);
//#endregion
//#region src/panels/PluginsPanel.svelte
var CS = /* @__PURE__ */ L("<p class=\"panel-hint\"> </p>"), wS = /* @__PURE__ */ L("<span class=\"plugin-meta\"> </span>"), TS = /* @__PURE__ */ L("<p class=\"panel-hint plugin-warn\"> </p>"), ES = /* @__PURE__ */ L("<div><span class=\"plugin-head\"><span class=\"plugin-name\"> </span> <!> <span class=\"row-tools\"><label class=\"gridmenu-snap plugin-toggle\"><input type=\"checkbox\"/> </label> <button class=\"ghost row-tool\"></button></span></span> <!> <!></div>"), DS = /* @__PURE__ */ L("<div class=\"plugin-row\"><span class=\"plugin-head\"><span class=\"plugin-name\"> </span> <!> <span class=\"row-tools\"><button class=\"ghost row-tool\"></button></span></span></div>"), OS = /* @__PURE__ */ L("<hr class=\"gridmenu-divider\"/> <p class=\"panel-strong\"> </p> <!>", 1), kS = /* @__PURE__ */ L("<hr class=\"gridmenu-divider\"/> <input/> <button class=\"ghost action\"> </button> <!>", 1), AS = /* @__PURE__ */ L("<div class=\"panel-body\"><!> <!> <!> <!></div>");
function jS(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.liveCsp), i = /* @__PURE__ */ D(() => n.pluginDiscovery), a = /* @__PURE__ */ D(() => n.pluginEngine), o = /* @__PURE__ */ D(() => n.pluginInfo), s = /* @__PURE__ */ D(() => n.pluginsView), { knownPlugins: c, loadPluginInfo: l, removePlugin: u, setPluginEnabled: d } = n, f = /* @__PURE__ */ O(""), p = /* @__PURE__ */ O("");
	function m(e) {
		let t = [
			...(e.scriptSrc ?? []).map((e) => ["script-src", e]),
			...(e.connectSrc ?? []).map((e) => ["connect-src", e]),
			...(e.frameSrc ?? []).map((e) => ["frame-src", e])
		];
		if (!F(r) || F(r).unknown) return [];
		let n = {
			"script-src": F(r).scriptSrc,
			"connect-src": F(r).connectSrc,
			"frame-src": F(r).frameSrc
		};
		return t.filter(([e, t]) => !n[e]?.has(t)).map(([e, t]) => `${e} ${t}`);
	}
	async function h() {
		k(p, "");
		let e = F(f).trim().toLowerCase();
		/^[a-z0-9][a-z0-9-]*$/.test(e) ? c().includes(e) ? k(p, K("plugin.alreadyListed"), !0) : (await l(e), F(o)[e].errors.length ? k(p, K("plugin.invalidManifest", { errors: F(o)[e].errors.join("; ") }), !0) : (d(e, !0), k(f, ""))) : k(p, K("plugin.invalidId"), !0);
	}
	function g(e) {
		n.pluginsFound = n.pluginsFound.filter((t) => t !== e), d(e, !0);
	}
	var _ = AS(), v = A(_), y = (e) => {
		var t = CS(), n = M(t, !0);
		P((e) => z(n, e), [() => K("hint.plugins.empty")]), R(e, t);
	}, b = /* @__PURE__ */ D(() => !c().length);
	B(v, (e) => {
		F(b) && e(y);
	});
	var x = N(v, 2);
	di(x, 16, c, (e) => e, (e, t) => {
		let n = /* @__PURE__ */ D(() => F(o)[t]), r = /* @__PURE__ */ D(() => (F(s)?.enabled ?? []).includes(t));
		var i = ES();
		let c;
		var l = A(i), f = A(l), p = M(f, !0), h = N(f, 2), g = (e) => {
			var t = wS(), r = M(t);
			P(() => z(r, `v${F(n).version ?? ""}`)), R(e, t);
		};
		B(h, (e) => {
			F(n)?.version && e(g);
		});
		var _ = N(h, 2), v = A(_), y = A(v);
		U(y);
		var b = N(y);
		E(v);
		var x = N(v, 2);
		V(x, () => q.cross, !0), E(x), E(_), E(l);
		var S = N(l, 2), C = (e) => {
			var t = TS(), r = M(t, !0);
			P((e) => z(r, e), [() => F(n).errors.join("; ")]), R(e, t);
		}, w = (e) => {
			var t = TS(), r = M(t, !0);
			P((e) => z(r, e), [() => K("plugin.engineMismatch", {
				required: F(n).requiresEngine,
				current: F(a)
			})]), R(e, t);
		}, ee = (e) => {
			var t = TS(), r = M(t, !0);
			P((e) => z(r, e), [() => K("plugin.cspNeeded", { list: m(F(n).csp).join(", ") })]), R(e, t);
		}, T = /* @__PURE__ */ D(() => F(n)?.csp && m(F(n).csp).length);
		B(S, (e) => {
			F(n)?.errors?.length ? e(C) : F(n) && !F(n).satisfied ? e(w, 1) : F(T) && e(ee, 2);
		});
		var te = N(S, 2), ne = (e) => {
			var t = CS(), r = M(t, !0);
			P((e) => z(r, e), [() => K("plugin.languages", { list: F(n).languages.map((e) => e.name).join(", ") })]), R(e, t);
		};
		B(te, (e) => {
			F(n)?.languages?.length && e(ne);
		}), E(i), P((e, t, a, o, s) => {
			c = H(i, 1, "plugin-row", null, c, { "plugin-broken": F(n)?.errors?.length }), z(p, e), G(v, "title", t), Vi(y, F(r)), y.disabled = a, z(b, ` ${o ?? ""}`), G(x, "title", s);
		}, [
			() => F(n)?.names?.[xa()] ?? F(n)?.name ?? t,
			() => F(r) ? K("tip.plugins.on") : K("tip.plugins.off"),
			() => !!F(n)?.errors?.length,
			() => F(r) ? K("ui.on") : K("ui.off"),
			() => K("tip.plugins.remove")
		]), I("change", y, (e) => d(t, e.target.checked)), I("click", x, () => u(t)), R(e, i);
	});
	var S = N(x, 2), C = (e) => {
		var t = OS(), r = N(j(t), 2), i = M(r, !0);
		di(N(r, 2), 16, () => n.pluginsFound, (e) => e, (e, t) => {
			var n = DS(), r = A(n), i = A(r), a = M(i, !0), s = N(i, 2), c = (e) => {
				var n = wS(), r = M(n);
				P(() => z(r, `v${F(o)[t].version ?? ""}`)), R(e, n);
			};
			B(s, (e) => {
				F(o)[t]?.version && e(c);
			});
			var l = N(s, 2), u = A(l);
			V(u, () => q.right, !0), E(u), E(l), E(r), E(n), P((e, t) => {
				z(a, e), G(u, "title", t);
			}, [() => F(o)[t]?.names?.[xa()] ?? F(o)[t]?.name ?? t, () => K("tip.plugins.addFound")]), I("click", u, () => g(t)), R(e, n);
		}), P((e) => z(i, e), [() => K("hint.plugins.found")]), R(e, t);
	};
	B(S, (e) => {
		n.pluginsFound.length && e(C);
	});
	var w = N(S, 2), ee = (e) => {
		var t = Xr(), r = j(t), i = (e) => {
			var t = CS(), n = M(t, !0);
			P((e) => z(n, e), [() => K("hint.plugins.autoDiscover")]), R(e, t);
		};
		B(r, (e) => {
			n.pluginsFound.length || e(i);
		}), R(e, t);
	}, T = (e) => {
		var t = kS(), n = N(j(t), 2);
		U(n);
		var r = N(n, 2), i = M(r, !0), a = N(r, 2), o = (e) => {
			var t = TS(), n = M(t, !0);
			P(() => z(n, F(p))), R(e, t);
		};
		B(a, (e) => {
			F(p) && e(o);
		}), P((e, t, a) => {
			G(n, "placeholder", e), r.disabled = t, z(i, a);
		}, [
			() => K("ph.plugins.folder"),
			() => !F(f).trim(),
			() => K("ui.addPlugin")
		]), I("keydown", n, (e) => e.key === "Enter" && h()), Gi(n, () => F(f), (e) => k(f, e)), I("click", r, h), R(e, t);
	};
	B(w, (e) => {
		F(i) === "ok" ? e(ee) : e(T, -1);
	}), E(_), R(e, _), ot();
}
Vr([
	"change",
	"click",
	"keydown"
]);
//#endregion
//#region src/panels/HistoryPanel.svelte
var MS = /* @__PURE__ */ L("<p class=\"panel-hint\"> </p>"), NS = /* @__PURE__ */ L("<div><span class=\"history-msg\"> </span> <span class=\"history-meta\"> </span></div>"), PS = /* @__PURE__ */ L("<button class=\"ghost\"> </button> <!>", 1), FS = /* @__PURE__ */ L("<!> <!>", 1), IS = /* @__PURE__ */ L("<div class=\"panel-body\"><!></div>");
function LS(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.auth), i = /* @__PURE__ */ D(() => n.historyError), a = /* @__PURE__ */ D(() => n.historyList), o = /* @__PURE__ */ D(() => n.siteDraft), { askConfirm: s, loadHistory: c, refreshBaseSha: l, setStatus: u } = n, d = /* @__PURE__ */ O(!1), f = (() => {
		let e = {
			dateStyle: "short",
			timeStyle: "short"
		};
		try {
			return new Intl.DateTimeFormat(xa(), e);
		} catch {
			return new Intl.DateTimeFormat(void 0, e);
		}
	})();
	async function p() {
		let e = F(a)?.[0];
		if (e && !F(d) && await s({
			title: K("confirm.revert.title"),
			lines: [`«${e.message}»`, K("confirm.revert.body")],
			okLabel: K("confirm.revert.ok"),
			cancelLabel: K("confirm.cancel")
		})) {
			k(d, !0), u(K("status.reverting"));
			try {
				let t = await fetch("/api/github/revert", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ expect: e.sha })
				});
				if (t.ok) {
					let { sha: e } = await t.json().catch(() => ({}));
					e ? n.baseSha = e : l(), n.revertedSinceLoad = !0, u(K("status.revertDone"), "ok"), m();
				} else t.status === 409 ? u(K("status.revertConflict"), "error") : u(ba(await t.json().catch(() => null)) ?? K("status.revertFailed"), "error");
			} catch {
				u(K("status.publishLayerUnreachable"), "error");
			}
			k(d, !1), c();
		}
	}
	async function m() {
		let e = ["/content/site.json", ...F(o).pages.map((e) => `/${e.file}`)], t = async () => {
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
				u(K("status.revertDeployed"), "ok");
				for (let e of Object.keys(localStorage).filter((e) => e.startsWith("urd-draft-"))) localStorage.removeItem(e);
				await new Promise((e) => setTimeout(e, 800)), location.reload();
				return;
			}
		}
		u(K("status.revertDeployTimeout"), "error");
	}
	var h = IS(), g = A(h), _ = (e) => {
		var t = MS(), n = M(t, !0);
		P((e) => z(n, e), [() => K("hint.history.loading")]), R(e, t);
	}, v = (e) => {
		var t = FS(), n = j(t), o = (e) => {
			var t = MS(), n = M(t, !0);
			P(() => z(n, F(i))), R(e, t);
		};
		B(n, (e) => {
			F(i) && e(o);
		});
		var s = N(n, 2), c = (e) => {
			var t = PS(), n = j(t), i = M(n, !0);
			di(N(n, 2), 19, () => F(a), (e) => e.sha, (e, t, n) => {
				var r = NS();
				let i;
				var a = A(r), o = M(a, !0), s = M(N(a, 2));
				E(r), P((e) => {
					i = H(r, 1, "history-row", null, i, { head: F(n) === 0 }), G(a, "title", F(t).sha), z(o, F(t).message), z(s, `${F(t).author ?? ""}${e ?? ""}`);
				}, [() => F(t).date ? ` · ${f.format(new Date(F(t).date))}` : ""]), R(e, r);
			}), P((e, t) => {
				n.disabled = F(d) || !F(r)?.allowed, G(n, "title", e), z(i, t);
			}, [() => F(r)?.allowed ? K("tip.history.revert") : K("tip.history.needsAccess"), () => K("ui.revertLast")]), I("click", n, p), R(e, t);
		};
		B(s, (e) => {
			F(a).length > 0 && e(c);
		}), R(e, t);
	};
	B(g, (e) => {
		F(a) === null ? e(_) : e(v, -1);
	}), E(h), R(e, h), ot();
}
Vr(["click"]);
//#endregion
//#region src/panels/UpdatePanel.svelte
var RS = /* @__PURE__ */ L("<p class=\"panel-hint\"> </p>"), zS = /* @__PURE__ */ L("<p class=\"panel-hint\"> </p> <button class=\"ghost\"> </button>", 1), BS = /* @__PURE__ */ L("<span class=\"update-arrow\"></span> <span class=\"badge\"> </span>", 1), VS = /* @__PURE__ */ L("<details class=\"group\"><summary> </summary> <div class=\"group-items\"><p class=\"update-notes\"> </p></div></details>"), HS = /* @__PURE__ */ L("<details class=\"group\"><summary><span class=\"update-warn\"></span> </summary> <div class=\"group-items\"><pre class=\"update-headers\"> </pre></div></details>"), US = /* @__PURE__ */ L("<span class=\"chip\"> </span>"), WS = /* @__PURE__ */ L("<div class=\"update-row\"><span class=\"update-path\"> </span> <span class=\"update-flags\"><!> <span class=\"update-warn\"></span></span></div>"), GS = /* @__PURE__ */ L("<div class=\"update-row\"><span class=\"update-path\"> </span> <!></div>"), KS = /* @__PURE__ */ L("<span class=\"update-warn\"></span>"), qS = /* @__PURE__ */ L("<div class=\"update-row\"><span> </span> <span class=\"update-flags\"><!> <!> <input type=\"checkbox\"/></span></div>"), JS = /* @__PURE__ */ L("<div class=\"ctl-row update-opt-head\"><p class=\"panel-strong\"> </p> <span class=\"mini-label\"> </span></div> <!>", 1), YS = /* @__PURE__ */ L("<p class=\"update-summary\"> </p> <!> <!> <!> <details class=\"group\"><summary> </summary> <div class=\"group-items\"></div></details> <!> <button class=\"primary update-run\"> </button>", 1), XS = /* @__PURE__ */ L("<div class=\"update-versions\"><span class=\"update-from\"> </span> <!></div> <!>", 1), ZS = /* @__PURE__ */ L("<div class=\"panel-body\"><!></div>");
function QS(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.auth), i = /* @__PURE__ */ D(() => n.updateError), a = /* @__PURE__ */ D(() => n.updateInfo), { askConfirm: o, loadUpdateCheck: s, setStatus: c } = n;
	function l(e) {
		let t = new Set(n.updateSkip);
		t.has(e) ? t.delete(e) : t.add(e), n.updateSkip = t;
	}
	async function u() {
		if (!F(a) || F(a).upToDate || n.updateBusy) return;
		let e = [...n.updateSkip], t = F(a).changes.filter((e) => !n.updateSkip.has(e.path)), r = t.filter((e) => e.atom && e.conflict);
		if (await o({
			title: K("confirm.update.title"),
			lines: [K("confirm.update.body", {
				target: F(a).target,
				writes: t.filter((e) => e.action === "write").length,
				deletes: t.filter((e) => e.action === "delete").length
			}), ...r.length > 0 ? [K("confirm.update.warnEdited", { paths: r.map((e) => e.path).join(", ") })] : []],
			okLabel: K("confirm.update.ok"),
			cancelLabel: K("confirm.cancel")
		})) {
			n.updateBusy = !0, c(K("update.running", { target: F(a).target }));
			try {
				let t, n, r = -1;
				for (; t = await fetch("/api/github/update", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({
						to: F(a).target,
						expect: F(a).head,
						skip: e
					})
				}), n = await t.json().catch(() => null), n?.code === "updateContinue" && n.copied > r;) r = n.copied, c(K("update.copying", {
					copied: n.copied,
					total: n.total
				}));
				t.ok ? (c(K("update.committed", { target: F(a).target }), "ok"), await d(F(a).target.replace(/^v/, ""))) : t.status === 409 ? (c(ba(n) ?? K("update.checkFailed"), "error"), await s()) : c(ba(n) ?? K("update.failed"), "error");
			} catch {
				c(K("status.publishLayerUnreachable"), "error");
			}
			n.updateBusy = !1;
		}
	}
	async function d(e) {
		for (let t = 0; t < 18; t++) {
			await new Promise((e) => setTimeout(e, 1e4));
			try {
				if ((await (await fetch("/urd.json", { cache: "no-store" })).json())?.engine === e) {
					c(K("update.deployed"), "ok"), await new Promise((e) => setTimeout(e, 800)), location.reload();
					return;
				}
			} catch {}
		}
		c(K("update.deployTimeout"), "error");
	}
	var f = ZS(), p = A(f), m = (e) => {
		var t = RS(), n = M(t, !0);
		P((e) => z(n, e), [() => K("update.checking")]), R(e, t);
	}, h = (e) => {
		var t = zS(), n = j(t), r = M(n, !0), a = N(n, 2), o = M(a, !0);
		P((e) => {
			z(r, F(i)), z(o, e);
		}, [() => K("update.retry")]), I("click", a, s), R(e, t);
	}, g = (e) => {
		var t = XS(), i = j(t), o = A(i), s = M(o, !0), c = N(o, 2), d = (e) => {
			var t = BS(), n = j(t);
			V(n, () => q.right, !0), E(n);
			var r = M(N(n, 2), !0);
			P(() => z(r, F(a).target)), R(e, t);
		};
		B(c, (e) => {
			F(a).upToDate || e(d);
		}), E(i);
		var f = N(i, 2), p = (e) => {
			var t = RS(), n = M(t, !0);
			P((e) => z(n, e), [() => K("update.upToDate")]), R(e, t);
		}, m = (e) => {
			var t = YS(), i = j(t), o = M(i, !0), s = N(i, 2), c = (e) => {
				var t = VS(), n = A(t), r = M(n, !0), i = N(n, 2), o = M(A(i), !0);
				E(i), E(t), P((e) => {
					z(r, e), z(o, F(a).notes);
				}, [() => K("update.aboutVersion", { target: F(a).target })]), R(e, t);
			};
			B(s, (e) => {
				F(a).notes && e(c);
			});
			var d = N(s, 2), f = (e) => {
				var t = HS(), n = A(t), r = A(n);
				V(r, () => q.warn, !0), E(r);
				var i = N(r);
				E(n);
				var o = N(n, 2), s = M(A(o), !0);
				E(o), E(t), P((e, t) => {
					G(n, "title", e), z(i, ` ${t ?? ""}`), z(s, F(a).headers.upstream);
				}, [() => K("update.headersManual"), () => K("update.headersTitle")]), R(e, t);
			};
			B(d, (e) => {
				F(a).headers?.upstream && e(f);
			});
			var p = N(d, 2);
			di(p, 17, () => F(a).changes.filter((e) => e.atom && e.conflict), (e) => e.path, (e, t) => {
				var n = WS(), r = A(n), i = M(r, !0), a = N(r, 2), o = A(a), s = (e) => {
					var t = US(), n = M(t, !0);
					P((e) => z(n, e), [() => K("update.actionDelete")]), R(e, t);
				};
				B(o, (e) => {
					F(t).action === "delete" && e(s);
				});
				var c = N(o, 2);
				V(c, () => q.warn, !0), E(c), E(a), E(n), P((e) => {
					G(r, "title", F(t).path), z(i, F(t).path), G(c, "title", e);
				}, [() => K(`update.conflict.${F(t).conflict}`)]), R(e, n);
			});
			var m = N(p, 2), h = A(m), g = M(h), _ = N(h, 2);
			di(_, 21, () => F(a).changes.filter((e) => e.atom && !e.conflict), (e) => e.path, (e, t) => {
				var n = GS(), r = A(n), i = M(r, !0), a = N(r, 2), o = (e) => {
					var t = US(), n = M(t, !0);
					P((e) => z(n, e), [() => K("update.actionDelete")]), R(e, t);
				};
				B(a, (e) => {
					F(t).action === "delete" && e(o);
				}), E(n), P(() => {
					G(r, "title", F(t).path), z(i, F(t).path);
				}), R(e, n);
			}), E(_), E(m);
			var v = N(m, 2), y = (e) => {
				var t = JS(), r = j(t), i = A(r), o = M(i, !0), s = M(N(i, 2), !0);
				E(r), di(N(r, 2), 17, () => F(a).changes.filter((e) => !e.atom), (e) => e.path, (e, t) => {
					var r = qS(), i = A(r);
					let a;
					var o = M(i, !0), s = N(i, 2), c = A(s), u = (e) => {
						var t = US(), n = M(t, !0);
						P((e) => z(n, e), [() => K("update.actionDelete")]), R(e, t);
					};
					B(c, (e) => {
						F(t).action === "delete" && e(u);
					});
					var d = N(c, 2), f = (e) => {
						var n = KS();
						V(n, () => q.warn, !0), E(n), P((e) => G(n, "title", e), [() => K(`update.conflict.${F(t).conflict}`)]), R(e, n);
					};
					B(d, (e) => {
						F(t).conflict && e(f);
					});
					var p = N(d, 2);
					U(p), E(s), E(r), P((e, n, r, s) => {
						a = H(i, 1, "update-path", null, a, { skipped: e }), G(i, "title", F(t).path), z(o, F(t).path), Vi(p, n), G(p, "title", r), G(p, "aria-label", s);
					}, [
						() => n.updateSkip.has(F(t).path),
						() => n.updateSkip.has(F(t).path),
						() => K("update.keepMine.title"),
						() => K("update.keepMine")
					]), I("change", p, () => l(F(t).path)), R(e, r);
				}), P((e, t) => {
					z(o, e), z(s, t);
				}, [() => K("update.optionalTitle"), () => K("update.keepMine")]), R(e, t);
			}, b = /* @__PURE__ */ D(() => F(a).changes.some((e) => !e.atom));
			B(v, (e) => {
				F(b) && e(y);
			});
			var x = N(v, 2), S = M(x, !0);
			P((e, t, i, a, s, c) => {
				z(o, e), G(h, "title", t), z(g, `${i ?? ""} · ${a ?? ""}`), x.disabled = n.updateBusy || !F(r)?.allowed, G(x, "title", s), z(S, c);
			}, [
				() => K("update.summary", {
					writes: F(a).changes.filter((e) => e.action === "write").length,
					deletes: F(a).changes.filter((e) => e.action === "delete").length
				}),
				() => K("update.atomGroup.title"),
				() => K("update.atomTitle"),
				() => F(a).changes.filter((e) => e.atom).length,
				() => F(r)?.allowed ? K("update.run.title") : K("tip.history.needsAccess"),
				() => K("update.run", { target: F(a).target })
			]), I("click", x, u), R(e, t);
		};
		B(f, (e) => {
			F(a).upToDate ? e(p) : e(m, -1);
		}), P((e) => z(s, e), [() => K("update.current", { version: F(a).current })]), R(e, t);
	};
	B(p, (e) => {
		n.updateBusy && !F(a) ? e(m) : F(i) ? e(h, 1) : F(a) && e(g, 2);
	}), E(f), R(e, f), ot();
}
Vr(["click", "change"]);
//#endregion
//#region src/lib/IconEditor.svelte
var $S = /* @__PURE__ */ L("<div class=\"ie-overlay svelte-e7sog7\" role=\"dialog\" aria-modal=\"true\"><div class=\"ie-card svelte-e7sog7\"><h2 class=\"svelte-e7sog7\"> </h2> <div class=\"ie-stage svelte-e7sog7\"><canvas class=\"ie-canvas svelte-e7sog7\"></canvas> <p class=\"ie-hint svelte-e7sog7\"> </p></div> <label class=\"ie-row svelte-e7sog7\"> <span class=\"ie-val svelte-e7sog7\"> </span></label> <input type=\"range\" min=\"1\" max=\"3\" step=\"0.02\" class=\"svelte-e7sog7\"/> <label class=\"ie-row svelte-e7sog7\"> <span class=\"ie-val svelte-e7sog7\"> </span></label> <input type=\"range\" min=\"0.3\" max=\"2\" step=\"0.02\" class=\"svelte-e7sog7\"/> <label class=\"ie-row svelte-e7sog7\"> <span class=\"ie-val svelte-e7sog7\"> </span></label> <input type=\"range\" min=\"0.3\" max=\"2\" step=\"0.02\" class=\"svelte-e7sog7\"/> <label class=\"ie-row svelte-e7sog7\"> <span class=\"ie-val svelte-e7sog7\"> </span></label> <input type=\"range\" min=\"0\" max=\"2\" step=\"0.02\" class=\"svelte-e7sog7\"/> <span class=\"ie-tools svelte-e7sog7\"><button type=\"button\" class=\"ghost svelte-e7sog7\"> </button> <button type=\"button\" class=\"ghost svelte-e7sog7\"> </button></span> <span class=\"ie-actions svelte-e7sog7\"><button type=\"button\" class=\"ghost svelte-e7sog7\"> </button> <button type=\"button\" class=\"primary svelte-e7sog7\"> </button></span></div></div>");
function eC(e, t) {
	at(t, !0);
	let n = ra(t, "image", 3, ""), r = /* @__PURE__ */ O(null), i = /* @__PURE__ */ O(null), a = /* @__PURE__ */ O(1), o = /* @__PURE__ */ O(.5), s = /* @__PURE__ */ O(.5), c = /* @__PURE__ */ O(1), l = /* @__PURE__ */ O(1), u = /* @__PURE__ */ O(1);
	Pn(() => {
		if (!n()) return;
		let e = new Image();
		e.onload = () => {
			k(i, e, !0);
		}, e.src = n();
	});
	function d(e, t) {
		if (e.clearRect(0, 0, t, t), !F(i)) return;
		e.filter = `brightness(${F(c)}) contrast(${F(l)}) saturate(${F(u)})`;
		let n = Math.max(t / F(i).width, t / F(i).height) * F(a), r = F(i).width * n, d = F(i).height * n, f = t / 2 - F(o) * r, p = t / 2 - F(s) * d;
		f = Math.min(0, Math.max(t - r, f)), p = Math.min(0, Math.max(t - d, p)), e.drawImage(F(i), f, p, r, d), e.filter = "none";
	}
	Pn(() => {
		F(i), F(a), F(o), F(s), F(c), F(l), F(u), F(r) && d(F(r).getContext("2d"), 220);
	});
	function f(e) {
		if (!F(i)) return;
		e.preventDefault();
		let t = e.clientX, n = e.clientY, r = Math.max(220 / F(i).width, 220 / F(i).height) * F(a), c = F(i).width * r, l = F(i).height * r, u = (e) => {
			k(o, Math.min(1, Math.max(0, F(o) - (e.clientX - t) / c)), !0), k(s, Math.min(1, Math.max(0, F(s) - (e.clientY - n) / l)), !0), t = e.clientX, n = e.clientY;
		}, d = () => {
			window.removeEventListener("pointermove", u), window.removeEventListener("pointerup", d);
		};
		window.addEventListener("pointermove", u), window.addEventListener("pointerup", d);
	}
	function p() {
		k(a, 1), k(o, .5), k(s, .5), k(c, 1), k(l, 1), k(u, 1);
	}
	function m() {
		let e = document.createElement("canvas");
		e.width = 128, e.height = 128, d(e.getContext("2d"), 128), t.onapply?.(e.toDataURL("image/webp", .92));
	}
	var h = $S(), g = A(h), _ = A(g), v = M(_, !0), y = N(_, 2), b = A(y);
	G(b, "width", 220), G(b, "height", 220), Zi(b, (e) => k(r, e), () => F(r));
	var x = M(N(b, 2), !0);
	E(y);
	var S = N(y, 2), C = A(S), w = M(N(C));
	E(S);
	var ee = N(S, 2);
	U(ee);
	var T = N(ee, 2), te = A(T), ne = M(N(te));
	E(T);
	var re = N(T, 2);
	U(re);
	var ie = N(re, 2), ae = A(ie), oe = M(N(ae));
	E(ie);
	var se = N(ie, 2);
	U(se);
	var ce = N(se, 2), le = A(ce), ue = M(N(le));
	E(ce);
	var de = N(ce, 2);
	U(de);
	var fe = N(de, 2), pe = A(fe), me = M(pe, !0), he = N(pe, 2), ge = M(he, !0);
	E(fe);
	var _e = N(fe, 2), ve = A(_e), ye = M(ve, !0), be = N(ve, 2), xe = M(be, !0);
	E(_e), E(g), E(h), P((e, t, n, r, i, a, o, s, c, l, u, d, f, p, m) => {
		z(v, e), G(b, "title", t), z(x, n), z(C, `${r ?? ""} `), z(w, `${i ?? ""}x`), z(te, `${a ?? ""} `), z(ne, `${o ?? ""}%`), z(ae, `${s ?? ""} `), z(oe, `${c ?? ""}%`), z(le, `${l ?? ""} `), z(ue, `${u ?? ""}%`), z(me, d), z(ge, f), z(ye, p), z(xe, m);
	}, [
		() => K("ie.title"),
		() => K("ie.dragTip"),
		() => K("ie.hint"),
		() => K("lbl.zoom"),
		() => F(a).toFixed(2),
		() => K("lbl.brightness"),
		() => Math.round(F(c) * 100),
		() => K("lbl.contrast"),
		() => Math.round(F(l) * 100),
		() => K("lbl.saturate"),
		() => Math.round(F(u) * 100),
		() => K("ie.grayscale"),
		() => K("common.reset"),
		() => K("confirm.cancel"),
		() => K("common.apply")
	]), I("pointerdown", b, f), Gi(ee, () => F(a), (e) => k(a, e)), Gi(re, () => F(c), (e) => k(c, e)), Gi(se, () => F(l), (e) => k(l, e)), Gi(de, () => F(u), (e) => k(u, e)), I("click", pe, () => k(u, 0)), I("click", he, p), I("click", ve, () => t.oncancel?.()), I("click", be, m), R(e, h), ot();
}
Vr(["pointerdown", "click"]);
//#endregion
//#region ../template/assets/engine/0.7.6/calendar-thumb.js
var tC = "#0e1512", nC = "#2fd6b6", rC = "#5c6b64", iC = "#22302a", aC = "#e8efe9", oC = "#16221d", sC = "#1c2340", cC = "#f3ecd8", lC = "#d0a74a", uC = (e) => e < 1 ? ` opacity="${e}"` : "", Z = (e, t, n, r, i, a = 1, o = 2) => `<rect x="${e}" y="${t}" width="${n}" height="${r}" rx="${o}" fill="${i}"${uC(a)}/>`, dC = (e, t, n, r, i = 1) => `<circle cx="${e}" cy="${t}" r="${n}" fill="${r}"${uC(i)}/>`, fC = (e, t, n, r, i, a = 1, o = 1) => `<line x1="${e}" y1="${t}" x2="${n}" y2="${r}" stroke="${i}" stroke-width="${a}"${uC(o)}/>`, pC = (e, t, n, r) => Array.from({ length: e }, (e, i) => r(t + i * n, i)).join(""), mC = (e, t = tC) => `<svg viewBox="0 0 160 80" preserveAspectRatio="none" aria-hidden="true"><rect width="160" height="80" fill="${t}"/>${e}</svg>`;
function hC(e, t, n, r, i, a = rC) {
	let o = "", s = n / 7, c = r / 4;
	for (let n = 0; n < 28; n++) {
		let r = e + n % 7 * s + s / 2, l = t + Math.floor(n / 7) * c + c / 2;
		o += dC(r, l, 1.6, i.includes(n) ? nC : a, i.includes(n) ? 1 : .55);
	}
	return o;
}
var gC = {
	plain: () => pC(3, 12, 20, (e) => Z(14, e, 14, 14, iC, 1, 3) + Z(34, e + 2, 70, 4, rC, .9) + Z(34, e + 9, 46, 3, rC, .5)),
	timeline: () => fC(50, 10, 50, 70, rC, 1.2, .7) + pC(3, 16, 22, (e, t) => Z(18, e - 3, 24, 5, rC, .9) + dC(50, e, 3.4, t ? rC : nC) + Z(60, e - 3, 62, 4, rC, .9) + Z(60, e + 4, 40, 3, rC, .5)),
	table: () => Z(12, 10, 136, 10, nC, 1, 3) + pC(4, 26, 12, (e, t) => (t % 2 ? Z(12, e - 3, 136, 12, iC, .8, 0) : "") + Z(16, e, 20, 3, rC, .9) + Z(44, e, 14, 3, rC, .5) + Z(66, e, 44, 3, rC, .9) + Z(118, e, 24, 3, rC, .5)),
	booklet: () => Z(12, 8, 136, 64, aC, 1, 2) + Z(20, 14, 40, 7, oC) + fC(20, 26, 140, 26, oC, 1.4) + [20, 84].map((e) => pC(3, 32, 12, (t) => Z(e, t, 8, 8, nC, 1, 1) + Z(e + 12, t, 36, 3, oC, .85) + Z(e + 12, t + 5, 26, 2.5, oC, .4))).join(""),
	numbered: () => pC(3, 12, 20, (e) => fC(14, e - 3, 146, e - 3, rC, .8, .6) + Z(14, e, 14, 12, nC, 1, 2) + Z(36, e + 1, 64, 4, rC, .9) + Z(36, e + 8, 44, 3, rC, .5) + Z(120, e + 3, 24, 4, nC, .7)),
	apList: () => pC(3, 10, 21, (e) => Z(12, e, 136, 17, sC, 1, 2) + Z(18, e + 4, 10, 9, lC, 1, 1) + fC(34, e + 3, 34, e + 14, lC, .8, .5) + Z(40, e + 4, 26, 3, lC, .8) + Z(40, e + 10, 56, 3.5, cC, .9)),
	glass: () => dC(30, 14, 34, "#ff8a65", .55) + dC(132, 70, 36, "#7fd1c4", .55) + dC(100, 10, 20, "#ffd36b", .4) + pC(3, 12, 20, (e) => Z(14, e, 132, 15, "#ffffff", .32, 6) + Z(20, e + 4, 9, 7, aC, .9, 1) + Z(36, e + 4, 50, 3, aC, .9) + Z(36, e + 9, 34, 2.5, aC, .5)),
	posters: () => Z(12, 10, 62, 60, nC, 1, 4) + Z(20, 30, 18, 20, oC, .9, 2) + Z(20, 56, 40, 4, oC, .8) + Z(80, 10, 32, 28, aC, 1, 4) + Z(86, 16, 10, 10, oC, .8, 1) + Z(116, 10, 32, 28, "#bfe9df", 1, 4) + Z(122, 16, 10, 10, oC, .8, 1) + Z(80, 42, 32, 28, iC, 1, 4) + Z(86, 48, 10, 10, nC, 1, 1) + Z(116, 42, 32, 28, iC, .5, 4),
	tickets: () => pC(3, 10, 21, (e) => Z(12, e, 136, 17, iC, 1, 4) + Z(12, e, 30, 17, nC, 1, 4) + Z(20, e + 4, 12, 9, oC, .85, 1) + fC(42, e + 1, 42, e + 16, tC, 1.6) + Z(50, e + 4, 50, 3.5, rC, .95) + Z(50, e + 10, 34, 2.5, rC, .55) + Z(120, e + 5, 22, 7, nC, .85)),
	carousel: () => [
		12,
		50,
		88,
		126
	].map((e, t) => Z(e, 14, 34, 54, t ? iC : nC, 1, 4) + Z(e + 6, 22, 12, 14, t ? nC : oC, .9, 1) + Z(e + 6, 50, 22, 3, t ? rC : oC, .9) + Z(e + 6, 56, 14, 2.5, t ? rC : oC, .5)).join(""),
	photo: () => [
		12,
		60,
		108
	].map((e) => Z(e, 12, 40, 56, iC, 1, 4) + Z(e, 12, 40, 26, nC, .45, 4) + Z(e + 4, 16, 12, 6, aC, .95, 1) + Z(e + 5, 44, 28, 3.5, rC, .95) + Z(e + 5, 51, 20, 2.5, rC, .5) + Z(e + 5, 58, 14, 5, nC, .9)).join(""),
	apGrid: () => [
		12,
		60,
		108
	].map((e) => Z(e, 12, 40, 56, cC, 1, 2) + Z(e, 12, 40, 16, sC, 1, 2) + fC(e, 28, e + 40, 28, lC, 1.4) + Z(e + 4, 16, 8, 8, lC, 1, 1) + Z(e + 22, 18, 14, 4, lC, .9) + Z(e + 5, 36, 28, 4, sC, .9) + Z(e + 5, 44, 18, 2.5, sC, .55) + Z(e + 5, 52, 24, 2.5, sC, .4)).join(""),
	bento: () => Z(12, 10, 66, 40, aC, 1, 6) + Z(18, 14, 16, 5, nC, 1, 2) + Z(18, 28, 14, 14, oC, .9, 1) + Z(36, 38, 34, 4, oC, .8) + Z(82, 10, 31, 18, iC, 1, 5) + Z(117, 10, 31, 18, iC, 1, 5) + Z(82, 32, 66, 18, iC, 1, 5) + hC(86, 34, 58, 14, [
		9,
		12,
		19
	]) + Z(12, 54, 31, 18, aC, 1, 5) + Z(47, 54, 31, 18, nC, .4, 5) + Z(82, 54, 66, 18, iC, 1, 5) + Z(88, 60, 30, 4, rC, .9),
	weekStrip: () => Z(60, 8, 40, 5, rC, .9) + Array.from({ length: 7 }, (e, t) => Z(12 + t * 19.6, 20, 17, 50, t === 3 ? nC : iC, t === 3 ? .25 : 1, 3) + Z(15 + t * 19.6, 24, 6, 5, rC, .9, 1) + ([
		1,
		3,
		5
	].includes(t) ? Z(14 + t * 19.6, 36, 13, 7, nC, 1, 2) : "")).join(""),
	weekPlan: () => Z(12, 8, 136, 64, iC, .6, 3) + pC(4, 22, 12, (e) => fC(12, e, 148, e, rC, .6, .6)) + Array.from({ length: 7 }, (e, t) => fC(30 + t * 17, 14, 30 + t * 17, 72, rC, .6, .6)).join("") + Z(82, 14, 16, 58, nC, .14, 0) + Z(49, 36, 13, 10, nC, .9, 2) + Z(83, 48, 13, 14, nC, .9, 2) + Z(117, 24, 13, 9, aC, .7, 2),
	layers: () => Z(12, 8, 136, 64, iC, .6, 3) + Z(70, 12, 22, 6, nC, .9, 3) + Z(96, 12, 22, 6, aC, .7, 3) + Z(122, 12, 22, 6, rC, .6, 3) + pC(3, 26, 15, (e, t) => fC(12, e - 2, 148, e - 2, rC, .6, .6) + Z(16, e + 3, 16, 3, rC, .9) + Z([
		44,
		62,
		100
	][t], e + 1, [
		46,
		22,
		40
	][t], 8, [
		nC,
		aC,
		"#7fd1c4"
	][t], .9, 3)),
	sidepanel: () => Z(12, 8, 136, 64, iC, .6, 3) + hC(18, 18, 76, 48, [
		5,
		10,
		17,
		24
	]) + Z(100, 8, 48, 64, iC, 1, 3) + Z(106, 14, 26, 5, aC, .9) + pC(2, 26, 16, (e) => Z(106, e, 36, 12, tC, 1, 2) + fC(106, e, 106, e + 12, nC, 2) + Z(111, e + 3, 24, 3, rC, .9)),
	apMonth: () => Z(12, 8, 136, 64, cC, 1, 2) + fC(12, 8, 148, 8, lC, 2.4) + Z(58, 13, 44, 5, sC, .9) + pC(4, 26, 12, (e) => fC(12, e, 148, e, lC, .6, .5)) + Array.from({ length: 6 }, (e, t) => fC(31.4 + t * 19.4, 26, 31.4 + t * 19.4, 72, lC, .6, .5)).join("") + Z(54, 40, 14, 5, lC, .6, 0) + fC(54, 40, 54, 45, lC, 2) + Z(112, 52, 14, 5, lC, .6, 0) + fC(112, 52, 112, 57, lC, 2) + dC(98, 32, 3.4, lC),
	dayPlan: () => Z(34, 6, 92, 68, iC, .6, 5) + Z(42, 12, 40, 5, aC, .9) + Array.from({ length: 7 }, (e, t) => Z(42 + t * 11, 22, 8, 9, t === 2 ? nC : iC, 1, 2)).join("") + pC(4, 38, 9, (e) => fC(34, e, 126, e, rC, .6, .6)) + Z(56, 39, 62, 7, aC, .5, 2) + Z(56, 57, 62, 7, nC, .5, 2) + fC(48, 51, 126, 51, nC, 1.4) + dC(48, 51, 2.2, nC),
	yearWheel: () => `<circle cx="46" cy="40" r="24" fill="none" stroke="${iC}" stroke-width="9"/><circle cx="46" cy="40" r="24" fill="none" stroke="${rC}" stroke-width="9" stroke-dasharray="100 151" transform="rotate(-90 46 40)"${uC(.8)}/><circle cx="46" cy="40" r="24" fill="none" stroke="${nC}" stroke-width="9" stroke-dasharray="13 151" stroke-dashoffset="-100" transform="rotate(-90 46 40)"/>` + dC(24, 32, 2, aC) + dC(26, 50, 2, aC) + dC(60, 60, 2, aC, .5) + Z(38, 37, 16, 6, aC, .9) + Z(88, 20, 20, 4, nC) + pC(3, 30, 13, (e) => Z(88, e, 56, 9, iC, 1, 2) + Z(92, e + 3, 34, 3, rC, .9)),
	heatmap: () => Z(12, 8, 136, 64, iC, .6, 3) + Array.from({ length: 3 }, (e, t) => Array.from({ length: 28 }, (e, n) => Z(18 + t * 44 + n % 7 * 5.4, 16 + Math.floor(n / 7) * 5.4, 4.2, 4.2, [
		3,
		11,
		16,
		24
	].includes((n + t * 5) % 28) ? nC : rC, [
		3,
		11,
		16,
		24
	].includes((n + t * 5) % 28) ? 1 : (n * 7 + t) % 5 == 0 ? .6 : .28, 1)).join("")).join("") + Z(18, 46, 124, 9, tC, .8, 2) + Z(22, 49, 30, 3, aC, .8),
	billboard: () => Z(34, 6, 92, 68, oC, 1, 6) + dC(42, 14, 2, nC) + Z(48, 12, 24, 4, nC, .9) + Z(42, 22, 60, 7, aC, .95) + [
		42,
		70,
		98
	].map((e) => Z(e, 36, 22, 16, iC, 1, 3) + Z(e + 6, 40, 10, 7, aC, .9, 1)).join("") + Z(42, 58, 78, 9, nC, 1, 3),
	stacked: () => Z(54, 10, 70, 44, iC, .7, 5) + Z(46, 16, 70, 44, iC, 1, 5) + Z(38, 22, 70, 44, aC, 1, 5) + Z(44, 28, 22, 6, nC, 1, 3) + Z(44, 40, 44, 5, oC, .9) + Z(44, 49, 30, 3, oC, .5) + Z(44, 56, 20, 6, nC, 1, 2),
	noticeboard: () => Z(34, 6, 92, 68, "#8a5a3c", 1, 5) + Z(42, 14, 64, 28, "#fff7cc", 1, 0) + dC(74, 14, 3, "#d33a2c") + Z(48, 22, 40, 5, oC, .9) + Z(48, 31, 28, 3, oC, .5) + Z(48, 46, 58, 20, "#d9ecff", 1, 0) + dC(54, 46, 2.6, "#2f6fd6") + Z(54, 53, 36, 4, oC, .85) + Z(54, 60, 44, 2.5, oC, .45),
	split: () => Z(16, 10, 128, 60, iC, 1, 6) + Z(16, 10, 44, 42, nC, 1, 6) + Z(24, 22, 20, 22, oC, .9, 2) + Z(68, 16, 20, 5, rC, .7, 2) + Z(68, 26, 58, 6, aC, .95) + Z(68, 36, 40, 3, rC, .7) + fC(16, 52, 144, 52, rC, .6, .6) + Z(24, 58, 60, 3, rC, .8) + Z(24, 64, 44, 2.5, rC, .5),
	band: () => Z(8, 30, 144, 20, nC, 1, 0) + Z(8, 30, 40, 20, oC, 1, 0) + dC(16, 40, 2, nC) + Z(22, 38, 20, 4, aC, .9) + Z(56, 38, 34, 4, oC, .85) + dC(96, 40, 1.8, oC) + Z(102, 38, 34, 4, oC, .85) + dC(142, 40, 1.8, oC),
	oneLine: () => pC(3, 12, 20, (e, t) => Z(12, e, 136, 15, iC, t ? .7 : 1, 4) + fC(12, e + 1, 12, e + 14, t ? rC : nC, 3) + dC(22, e + 7.5, 2.4, t ? rC : nC) + Z(30, e + 5.5, 20, 4, t ? rC : nC, .9) + Z(56, e + 5.5, 54, 4, rC, .9) + (t ? "" : Z(124, e + 4, 18, 7, nC, 1, 2))),
	ring: () => Z(30, 6, 100, 68, iC, 1, 8) + `<circle cx="58" cy="34" r="15" fill="none" stroke="${rC}" stroke-width="5"${uC(.5)}/><circle cx="58" cy="34" r="15" fill="none" stroke="${nC}" stroke-width="5" stroke-linecap="round" stroke-dasharray="70 94" transform="rotate(-90 58 34)"/>` + Z(53, 31, 10, 6, aC, .9, 1) + Z(82, 24, 38, 6, aC, .95) + Z(82, 35, 28, 3, rC, .8) + fC(38, 56, 122, 56, rC, .6, .6) + Z(38, 61, 50, 3, rC, .7) + Z(38, 67, 40, 3, rC, .5),
	darkGlass: () => Z(34, 6, 92, 68, "#121216", 1, 7) + dC(112, 16, 22, nC, .45) + dC(46, 68, 20, "#3fb8a4", .35) + dC(42, 14, 2, nC) + Z(48, 12, 22, 4, nC, .9) + Z(42, 22, 56, 6, aC, .95) + Z(42, 34, 76, 3, rC, .6, 1.5) + Z(42, 34, 60, 3, nC, 1, 1.5) + Z(42, 42, 36, 9, aC, 1, 3) + Z(82, 42, 36, 9, aC, .18, 3) + Z(42, 56, 76, 14, aC, .1, 3) + Z(47, 61, 40, 3, aC, .7),
	nextBento: () => Z(40, 8, 80, 26, nC, 1, 6) + Z(46, 13, 22, 4, oC, .8) + Z(46, 23, 44, 5, oC, .9) + Z(40, 38, 38, 16, iC, 1, 5) + Z(82, 38, 38, 16, iC, 1, 5) + Z(40, 58, 38, 16, aC, 1, 5) + Z(82, 58, 38, 16, nC, .4, 5) + Z(46, 42, 8, 7, aC, .9, 1) + Z(88, 42, 8, 7, aC, .9, 1) + Z(46, 62, 8, 7, oC, .9, 1),
	apNow: () => Z(40, 6, 80, 68, cC, 1, 5) + Z(40, 6, 80, 12, sC, 1, 5) + dC(47, 12, 1.8, lC) + Z(52, 10, 22, 4, lC, .9) + Z(46, 24, 14, 14, sC, 1, 2) + Z(50, 28, 6, 6, lC, 1, 1) + Z(66, 25, 44, 5, sC, .9) + Z(66, 34, 32, 3, sC, .5) + Z(40, 46, 80, 28, "#eae1c7", 1, 0) + fC(48, 54, 48, 66, lC, 1) + dC(48, 54, 1.8, lC) + dC(48, 66, 1.8, lC) + Z(54, 52, 40, 3.5, sC, .8) + Z(54, 64, 34, 3.5, sC, .8),
	apNavy: () => Z(40, 6, 80, 68, sC, 1, 5) + dC(47, 13, 1.8, lC) + Z(52, 11, 22, 4, lC, .9) + Z(46, 20, 68, 22, cC, 1, 3) + Z(51, 25, 8, 10, lC, 1, 1) + Z(64, 25, 40, 5, sC, .9) + Z(64, 34, 26, 3, sC, .5) + `<rect x="46" y="46" width="68" height="14" rx="3" fill="#262e4f" stroke="${lC}" stroke-width="0.8"/>` + Z(51, 50, 7, 6, lC, 1, 1) + Z(64, 51, 36, 4, cC, .85) + Z(46, 66, 50, 3, cC, .6),
	apSeries: () => Z(12, 8, 136, 64, "#f5efdd", 1, 2) + fC(20, 17, 34, 17, lC, 1) + Z(38, 15, 26, 3.5, lC, .9) + Z(20, 24, 58, 8, "#7a1a1a") + Z(20, 38, 64, 3, sC, .6) + Z(20, 44, 52, 3, sC, .6) + [
		20,
		46,
		72
	].map((e) => Z(e, 54, 12, 2.5, lC, .9) + Z(e, 60, 20, 3.5, sC, .8)).join("") + fC(100, 14, 100, 66, lC, .8, .6) + Z(108, 18, 30, 8, "#7a1a1a", .85) + Z(108, 32, 32, 2.5, sC, .5) + Z(108, 38, 26, 2.5, sC, .5),
	pad: () => Z(34, 2, 92, 72, "#fbf7ee", 1, 2) + Z(34, 2, 92, 9, "#c4302b", 1, 0) + Z(82, 15, 5, 24, "#1d1b18", 1, 0) + Z(70, 29, 18, 4, "#1d1b18", 1, 0) + fC(72, 30, 83, 16, "#1d1b18", 4) + fC(40, 44, 120, 44, "#cfc6b3", 1.2) + pC(3, 50, 8, (e) => Z(40, e, 14, 3, "#c4302b", .9) + Z(58, e, 40, 3, "#1d1b18", .8) + Z(104, e, 16, 3, "#1d1b18", .45)) + Z(36, 76, 88, 2, "#d9d0bd", 1, 0),
	index: () => [
		[12, 6],
		[84, 6],
		[12, 42],
		[84, 42]
	].map(([e, t], n) => Z(e, t, 64, 32, "#fdfbf3", 1, 1) + fC(e + 4, t + 9, e + 60, t + 9, "#c9483b", 1.2) + pC(3, t + 14, 6, (t) => Z(e + 4, t, 44, 2, "#2a2622", .7)) + (n === 3 ? Z(e + 40, t + 20, 18, 7, "#c9483b", .8, 0) : "")).join(""),
	departures: () => Z(10, 4, 140, 72, "#111315", 1, 4) + Z(16, 10, 44, 5, "#ffb000", 1, 1) + pC(4, 22, 12, (e, t) => [
		16,
		42,
		68,
		110
	].map((t, n) => Array.from({ length: n === 2 ? 7 : 4 }, (n, r) => Z(t + r * 5.5, e, 4.5, 8, "#23272c", 1, 1)).join("")).join("") + Z(130, e + 2, 14, 4, t === 3 ? "#ff5a4f" : t === 1 ? "#ffb000" : "#f4f1e6", .9, 1)),
	marquee: () => Z(8, 4, 144, 72, "#7a1420", 1, 6) + Array.from({ length: 12 }, (e, t) => dC(16 + t * 11.6, 9, 1.8, "#ffd76a") + dC(16 + t * 11.6, 71, 1.8, "#ffd76a")).join("") + Z(14, 14, 132, 52, "#f6f1e4", 1, 0) + Z(20, 18, 40, 3, "#7a1420", .9, 0) + Z(20, 25, 76, 8, "#17120f", 1, 0) + Z(20, 37, 60, 3, "#17120f", .7, 0) + pC(3, 46, 6, (e) => Z(20, e, 120, 2.5, "#17120f", .55, 0)),
	receipt: () => Z(46, 2, 68, 70, "#fbfaf6", 1, 0) + `<polygon points="${Array.from({ length: 17 }, (e, t) => `${46 + t * 4},72 ${48 + t * 4},75.5`).join(" ")} 114,72" fill="#fbfaf6"/>` + Z(64, 6, 32, 4, "#1b1b1b", 1, 0) + Z(68, 12, 24, 2.5, "#1b1b1b", .6, 0) + [18, 46].map((e) => pC(16, 51, 4, (t) => Z(t, e, 2.4, .8, "#1b1b1b", 1, 0))).join("") + pC(4, 22, 6, (e, t) => Z(51, e, 8, 3, "#1b1b1b", 1, 0) + Z(62, e, [
		28,
		18,
		24,
		14
	][t], 3, "#1b1b1b", .85, 0) + pC(Math.floor((32 - [
		28,
		18,
		24,
		14
	][t]) / 3), 64 + [
		28,
		18,
		24,
		14
	][t] + 2, 3, (t) => Z(t, e + 2, 1, 1, "#1b1b1b", .6, 0)) + Z(100, e, 10, 3, "#1b1b1b", 1, 0)) + pC(2, 50, 5, (e) => Z(51, e, 30, 2.5, "#1b1b1b", .7, 0) + Z(102, e, 8, 2.5, "#1b1b1b", .7, 0)) + Array.from({ length: 22 }, (e, t) => Z(52 + t * 2.6, 61, [
		1,
		1.8,
		.8
	][t % 3], 7, "#1b1b1b", 1, 0)).join(""),
	seventies: () => Z(34, 2, 92, 76, "#f6e7c8", 1, 8) + [
		[20, "#e0aa2a"],
		[17, "#f6e7c8"],
		[14, "#5a3320"],
		[11, "#e2711d"],
		[8, "#e0aa2a"],
		[5, "#f6e7c8"]
	].map(([e, t]) => dC(80, 24, e, t)).join("") + Z(34, 24, 92, 4, "#f6e7c8", 1, 0) + Z(60, 26, 40, 5, "#e2711d", 1, 2) + Z(66, 33, 28, 2, "#5a3320", .6, 1) + Z(40, 38, 80, 36, "#e0aa2a", 1, 7) + pC(3, 41, 11, (e, t) => Z(43, e, 74, 9, "#f6e7c8", 1, 4.5) + dC(48, e + 4.5, 3.4, [
		"#e2711d",
		"#e0aa2a",
		"#5a3320"
	][t]) + Z(54, e + 2.2, 30, 2.6, "#5a3320", .9, 1) + Z(54, e + 5.8, 20, 1.6, "#5a3320", .5, 1) + (t === 1 ? "" : Z(103, e + 2.5, 11, 4, "#5a3320", 1, 2))),
	deco: () => Z(14, 2, 132, 76, "#0e0e10", 1, 0) + [
		[
			16,
			4,
			128,
			72
		],
		[
			18.5,
			6.5,
			123,
			67
		],
		[
			82,
			70,
			16,
			4
		]
	].map(([e, t, n, r]) => `<rect x="${e}" y="${t}" width="${n}" height="${r}" fill="none" stroke="#d4af6a" stroke-width="0.6"/>`).join("") + Array.from({ length: 15 }, (e, t) => (t - 7) * 12 * Math.PI / 180).map((e) => fC(80, 20, 80 + 11 * Math.sin(e), 20 - 11 * Math.cos(e), "#d4af6a", .9)).join("") + Z(62, 23, 36, 4, "#d4af6a", 1, 0) + Z(69, 29.5, 22, 1.5, "#f3ead3", .7, 0) + pC(3, 34, 11, (e) => fC(22, e, 138, e, "#d4af6a", .5) + Z(26, e + 2.5, 8, 5, "#d4af6a", 1, 0) + fC(38, e + 1.5, 38, e + 9.5, "#d4af6a", .5) + Z(42, e + 3, 52, 3, "#f3ead3", .9, 0) + Z(42, e + 7.5, 32, 1.5, "#f3ead3", .5, 0) + Z(120, e + 4.5, 15, 1.8, "#d4af6a", .9, 0)) + fC(22, 67, 138, 67, "#d4af6a", .5) + Z(62, 70, 16, 4, "#d4af6a", 1, 0),
	mobileAgenda: () => Z(50, 4, 60, 72, "#121216", 1, 8) + Z(56, 10, 22, 4, aC, .9) + Array.from({ length: 7 }, (e, t) => Z(56 + t * 7.1, 18, 5.6, 9, t === 2 ? nC : iC, 1, 2)).join("") + pC(3, 32, 14, (e) => Z(56, e, 48, 11, "#1c1c22", 1, 3) + fC(67, e + 2, 67, e + 9, nC, 1.4) + Z(58, e + 4, 6, 3, rC, .8) + Z(70, e + 3, 26, 3, aC, .85))
};
Object.keys(gC);
function _C(e) {
	let t = gC[e] ?? gC.plain, n = ["booklet"].includes(e);
	return mC(t(), n ? "#1a2620" : tC);
}
//#endregion
//#region src/lib/DesignPicker.svelte
var vC = /* @__PURE__ */ L("<button type=\"button\"> </button>"), yC = /* @__PURE__ */ L("<div class=\"dp-views svelte-wurosr\" role=\"group\"><button type=\"button\"> </button> <!></div>"), bC = /* @__PURE__ */ L("<img alt=\"\" loading=\"lazy\" decoding=\"async\" class=\"svelte-wurosr\"/>"), xC = /* @__PURE__ */ L("<span class=\"dp-mark svelte-wurosr\"> </span>"), SC = /* @__PURE__ */ L("<button type=\"button\"><span class=\"dp-pic svelte-wurosr\"><!></span> <span class=\"dp-name svelte-wurosr\"> </span> <!></button>"), CC = /* @__PURE__ */ L("<section class=\"dp-family svelte-wurosr\"><h3 class=\"svelte-wurosr\"> </h3> <div class=\"dp-grid svelte-wurosr\"></div></section>"), wC = /* @__PURE__ */ L("<p class=\"dp-none svelte-wurosr\"> </p>"), TC = /* @__PURE__ */ L("<span class=\"dp-side-view svelte-wurosr\"> </span>"), EC = /* @__PURE__ */ L("<span> </span>"), DC = /* @__PURE__ */ L("<dt class=\"svelte-wurosr\"> </dt> <dd class=\"svelte-wurosr\"></dd>", 1), OC = /* @__PURE__ */ L("<dialog class=\"dp-overlay svelte-wurosr\"><div class=\"dp-card svelte-wurosr\"><div class=\"dp-head svelte-wurosr\"><h2 class=\"svelte-wurosr\"> </h2> <input class=\"dp-search svelte-wurosr\" type=\"search\"/> <span class=\"dp-count svelte-wurosr\"> </span> <button type=\"button\" class=\"dp-close svelte-wurosr\"><svg viewBox=\"0 0 16 16\" width=\"16\" height=\"16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" aria-hidden=\"true\"><path d=\"M3 3l10 10M13 3L3 13\"></path></svg></button></div> <!> <div class=\"dp-body svelte-wurosr\"><div class=\"dp-list svelte-wurosr\"><!> <!></div> <aside class=\"dp-side svelte-wurosr\"><div class=\"dp-side-head svelte-wurosr\"><strong> </strong> <!></div> <div class=\"dp-preview svelte-wurosr\"><div class=\"dp-stage svelte-wurosr\"><iframe src=\"/?preview=1\" class=\"svelte-wurosr\"></iframe></div></div> <div class=\"dp-info svelte-wurosr\"><section class=\"svelte-wurosr\"><h3 class=\"svelte-wurosr\"> </h3> <p class=\"svelte-wurosr\"> </p></section> <section class=\"svelte-wurosr\"><h3 class=\"svelte-wurosr\"> </h3> <dl class=\"svelte-wurosr\"></dl></section></div> <button type=\"button\" class=\"dp-use svelte-wurosr\"> </button></aside></div></div></dialog>");
function kC(e, t) {
	at(t, !0);
	let n = ra(t, "current", 3, null), r = ra(t, "mode", 3, "set"), i = ra(t, "design", 3, "plain"), a = ra(t, "props", 19, () => ({})), o = ra(t, "site", 3, null), s = ra(t, "page", 3, null), c = r() === "phone", l = r() === "card", u = c || l, d = c ? "phone-" : l ? "card-" : "", f = {
		list: "calendar.viewList",
		cards: "calendar.viewCards",
		month: "calendar.viewMonth",
		agenda: "calendar.viewAgenda",
		next: "calendar.viewNext",
		week: "calendar.viewWeek",
		day: "calendar.viewDay",
		year: "calendar.viewYear"
	}, p = c ? 390 : 1040, m = /* @__PURE__ */ O(""), h = /* @__PURE__ */ O(""), _ = /* @__PURE__ */ O(mn(n() ?? (c ? "agenda" : l ? "neutral" : "plain"))), v = /* @__PURE__ */ O(mn(/* @__PURE__ */ new Set())), y = /* @__PURE__ */ O(null), b = /* @__PURE__ */ O(0), x = /* @__PURE__ */ O(!1), S = /* @__PURE__ */ O(600), C = /* @__PURE__ */ O(null), w = /* @__PURE__ */ O(null), ee = (e) => u || !F(h) || e.view === null || e.view === F(h);
	function T(e) {
		if (!e.setCard) return K(e.labelKey);
		let t = e.designs.map((e) => K(wh(e).labelKey)), n = K(e.labelKey);
		return t.length > 3 ? K("calendar.picker.setNameMore", {
			set: n,
			designs: t.slice(0, 3).join(", "),
			n: t.length - 3
		}) : K("calendar.picker.setName", {
			set: n,
			designs: ce(t)
		});
	}
	let te = (e) => e.setCard ? [T(e), ...e.designs.map((e) => K(wh(e).labelKey))].join(" ") : K(e.labelKey), ne = (e) => ee(e) && (!F(m).trim() || te(e).toLowerCase().includes(F(m).trim().toLowerCase())), re = /* @__PURE__ */ D(() => (c ? eh(a()) : l ? sh() : qm()).map((e) => ({
		...e,
		designs: e.designs.filter(ne)
	})).filter((e) => e.designs.length)), ie = /* @__PURE__ */ D(() => F(re).reduce((e, t) => e + t.designs.length, 0)), ae = /* @__PURE__ */ D(() => c ? Qm(F(_), a()) : l ? oh(F(_)) : wh(F(_))), oe = /* @__PURE__ */ D(() => F(b) ? Math.min(1, F(b) / p) : .4);
	function se(e) {
		return e.setCard ? K("calendar.picker.setAbout", { designs: ce(e.designs.map((e) => K(wh(e).labelKey))) }) : l && e.desktop ? K("calendar.picker.cardOf", { name: K(e.labelKey) }) : K(`${e.labelKey}.about`);
	}
	function ce(e) {
		try {
			return new Intl.ListFormat(xa(), { type: "conjunction" }).format(e);
		} catch {
			return e.join(", ");
		}
	}
	function le(e) {
		let t = e.look ? wh(e.look) : null, n, r, a;
		if (c || l) n = e.setCard ? [wh(i()).set === e.set ? K("calendar.picker.c.cardOwn") : K("calendar.picker.c.setOther")] : t ? t.id === i() ? [K(l ? "calendar.picker.c.cardOwn" : `${t.labelKey}.colors`)] : [K("calendar.picker.c.other", { name: K(t.labelKey) })] : [K(c ? "calendar.picker.c.phoneNeutral" : "calendar.picker.c.cardNeutral")], r = [K(c ? "calendar.picker.c.phoneWords" : "calendar.picker.c.cardText")], a = [K(c ? "calendar.picker.c.phoneOptions" : "calendar.picker.c.cardOptions")];
		else {
			n = [K(`${e.labelKey}.colors`)], r = [K("calendar.picker.c.words"), ...e.theme?.length ? [K("calendar.picker.c.theme")] : []];
			let t = xh(e.id).filter((e) => !e.tipKey).map((e) => K(`${e.labelKey}.phrase`));
			a = [...t.length ? [K("calendar.picker.c.settings", { settings: ce(t) })] : [], ...e.rewrites ? [K("calendar.picker.c.rewrite")] : []];
		}
		return [
			["calendar.picker.h.colours", n],
			["calendar.picker.h.text", r],
			["calendar.picker.h.options", a]
		].filter(([, e]) => e.length).map(([e, t]) => [K(e), t]);
	}
	Pn(() => {
		F(w) && !F(w).open && F(w).showModal(), F(C)?.focus();
	});
	function ue(e) {
		let t = wh(u ? i() : e), n = {
			id: "design-picker-sec",
			version: 1,
			size: { minHeight: "200px" },
			grid: null,
			background: {
				version: 1,
				layers: []
			},
			blocks: [{
				id: "design-picker-cal",
				type: "calendar",
				version: 1,
				decor: !1,
				hideMobile: !1,
				animation: null,
				props: {
					sources: [],
					limit: 4,
					view: t.view ?? "list",
					...t.id === "plain" ? {} : { design: t.id },
					...t.view === "next" ? {
						nextCount: 3,
						laterCount: 3
					} : {},
					...c ? { phoneView: e } : {},
					...l ? { card: e } : {}
				},
				frames: {
					desktop: {
						x: 3,
						y: 24,
						w: 94,
						h: 600
					},
					mobile: null
				}
			}]
		};
		return {
			...s() ?? {},
			sections: [n]
		};
	}
	let de = (e) => F(y)?.contentWindow?.postMessage(e, location.origin);
	function fe() {
		let e = F(y)?.contentDocument, t = e?.querySelector(".urd-block[data-block-id=\"design-picker-cal\"]");
		if (!t) return;
		let n = e.querySelector("dialog.urd-cal-dialog[open]"), r = Math.max(t.getBoundingClientRect().bottom, n?.getBoundingClientRect().bottom ?? 0) + (e.defaultView?.scrollY ?? 0), i = Math.max(160, Math.ceil(r + 24));
		i !== F(S) && k(S, i, !0);
	}
	let pe = null, me = null;
	function he() {
		pe?.disconnect(), pe = null;
		let e = F(y)?.contentWindow;
		if (!e?.ResizeObserver) return;
		let t = 0, n = () => {
			let r = e.document.querySelector(".urd-block[data-block-id=\"design-picker-cal\"]");
			r && r !== me ? (me = r, pe = new e.ResizeObserver(fe), pe.observe(r), fe(), l && ge(e, r, 0)) : t++ < 300 && e.requestAnimationFrame(n);
		};
		n();
	}
	function ge(e, t, n) {
		let r = t.querySelector(".urd-cal-event");
		if (!r) {
			n < 300 && e.requestAnimationFrame(() => ge(e, t, n + 1));
			return;
		}
		r.click();
		let i = e.document.querySelector("dialog.urd-cal-dialog[open]");
		i && pe && (pe.observe(i), fe());
	}
	function _e() {
		de({
			type: "urd-preview-full",
			pageId: "design-picker",
			page: ue(F(_))
		}), he();
	}
	function ve(e) {
		if (e.origin !== location.origin || e.source !== F(y)?.contentWindow || e.data?.type !== "urd-ready") return;
		let t = F(y)?.contentDocument;
		if (t && !t.getElementById("design-picker-style")) {
			let e = t.createElement("style");
			e.id = "design-picker-style", e.textContent = ".urd-nav, #urd-announce, .urd-nav-announce, #urd-footer, .urd-totop { display: none !important; } html { overflow: hidden !important; }", t.head.appendChild(e);
		}
		o() && de({
			type: "urd-site",
			site: o()
		}), de({
			type: "urd-viewport",
			mode: c ? "mobile" : "desktop"
		}), de({
			type: "urd-chrome",
			visible: !1
		}), k(x, !0);
	}
	Pn(() => {
		F(_), F(x) && _e();
	}), Pn(() => () => pe?.disconnect());
	function ye() {
		t.onclose?.();
	}
	function be(e) {
		k(v, /* @__PURE__ */ new Set([...F(v), e]), !0);
	}
	var xe = OC();
	Br("message", hn, ve);
	var Se = A(xe), Ce = A(Se), we = A(Ce), Te = M(we, !0), Ee = N(we, 2);
	U(Ee), Zi(Ee, (e) => k(C, e), () => F(C));
	var De = N(Ee, 2), Oe = M(De, !0), ke = N(De, 2);
	E(Ce);
	var Ae = N(Ce, 2), je = (e) => {
		var t = yC(), n = A(t);
		let r;
		var i = M(n, !0);
		di(N(n, 2), 16, () => zm, (e) => e, (e, t) => {
			var n = vC();
			let r;
			var i = M(n, !0);
			P((e) => {
				G(n, "aria-pressed", F(h) === t), r = H(n, 1, "svelte-wurosr", null, r, { on: F(h) === t }), z(i, e);
			}, [() => K(f[t])]), I("click", n, () => k(h, t, !0)), R(e, n);
		}), E(t), P((e) => {
			G(n, "aria-pressed", F(h) === ""), r = H(n, 1, "svelte-wurosr", null, r, { on: F(h) === "" }), z(i, e);
		}, [() => K("calendar.picker.all")]), I("click", n, () => k(h, "")), R(e, t);
	};
	B(Ae, (e) => {
		u || e(je);
	});
	var Me = N(Ae, 2), Ne = A(Me), Pe = A(Ne);
	di(Pe, 17, () => F(re), (e) => e.family, (e, r) => {
		var i = CC(), a = A(i), o = M(a, !0), s = N(a, 2);
		di(s, 21, () => F(r).designs, (e) => e.id, (e, r) => {
			var i = SC();
			let a;
			var o = A(i), s = A(o), c = (e) => {
				var t = Xr();
				V(j(t), () => _C(F(r).id)), R(e, t);
			}, l = /* @__PURE__ */ D(() => F(v).has(F(r).id)), u = (e) => {
				var t = bC();
				P(() => G(t, "src", `/admin/designs/${d}${F(r).id}.webp`)), Br("error", t, () => be(F(r).id)), Rr(t), R(e, t);
			};
			B(s, (e) => {
				F(l) ? e(c) : e(u, -1);
			}), E(o);
			var f = N(o, 2), p = M(f, !0), m = N(f, 2), h = (e) => {
				var t = xC(), n = M(t, !0);
				P((e) => z(n, e), [() => K("calendar.picker.current")]), R(e, t);
			};
			B(m, (e) => {
				n() !== null && F(r).id === n() && e(h);
			}), E(i), P((e, t) => {
				a = H(i, 1, "dp-tile svelte-wurosr", null, a, {
					on: F(r).id === F(_),
					current: n() !== null && F(r).id === n()
				}), G(i, "aria-pressed", F(r).id === F(_)), G(i, "title", e), z(p, t);
			}, [() => T(F(r)), () => T(F(r))]), I("click", i, () => k(_, F(r).id, !0)), I("dblclick", i, () => t.onpick?.(F(r).id)), R(e, i);
		}), E(s), E(i), P((e) => z(o, e), [() => K(F(r).labelKey)]), R(e, i);
	});
	var Fe = N(Pe, 2), Ie = (e) => {
		var t = wC(), n = M(t, !0);
		P((e) => z(n, e), [() => K("calendar.picker.none")]), R(e, t);
	};
	B(Fe, (e) => {
		F(re).length || e(Ie);
	}), E(Ne);
	var Le = N(Ne, 2), Re = A(Le), ze = A(Re), Be = M(ze, !0), Ve = N(ze, 2), He = (e) => {
		var t = TC(), n = M(t, !0);
		P((e) => z(n, e), [() => K(f[F(ae).view])]), R(e, t);
	};
	B(Ve, (e) => {
		!u && F(ae).view && e(He);
	}), E(Re);
	var Ue = N(Re, 2), We = A(Ue), Ge = A(We);
	Zi(Ge, (e) => k(y, e), () => F(y)), E(We), E(Ue);
	var Ke = N(Ue, 2), qe = A(Ke), Je = A(qe), Ye = M(Je, !0), Xe = M(N(Je, 2), !0);
	E(qe);
	var Ze = N(qe, 2), Qe = A(Ze), $e = M(Qe, !0), et = N(Qe, 2);
	di(et, 21, () => le(F(ae)), ([e, t]) => e, (e, t) => {
		var n = /* @__PURE__ */ D(() => g(F(t), 2));
		let r = () => F(n)[0], i = () => F(n)[1];
		var a = DC(), o = j(a), s = M(o, !0), c = N(o, 2);
		di(c, 21, i, si, (e, t) => {
			var n = EC(), r = M(n, !0);
			P(() => z(r, F(t))), R(e, n);
		}), E(c), P(() => z(s, r())), R(e, a);
	}), E(et), E(Ze), E(Ke);
	var tt = N(Ke, 2), nt = M(tt, !0);
	E(Le), E(Me), E(Se), E(xe), Zi(xe, (e) => k(w, e), () => F(w)), P((e, t, n, r, i, a, o, s, c, l, u, d, f) => {
		G(xe, "aria-label", e), z(Te, t), G(Ee, "placeholder", n), G(Ee, "aria-label", r), z(Oe, i), G(ke, "aria-label", a), G(ke, "title", o), z(Be, s), Ii(We, `width:${p * F(oe)}px; height:${F(S) * F(oe)}px`), G(Ge, "title", c), Ii(Ge, `width:${p}px; height:${F(S) ?? ""}px; transform:scale(${F(oe) ?? ""}); transform-origin:top left`), z(Ye, l), z(Xe, u), z($e, d), z(nt, f);
	}, [
		() => K("calendar.picker.title"),
		() => K(c ? "calendar.picker.phoneTitle" : l ? "calendar.picker.cardTitle" : "calendar.picker.title"),
		() => K("calendar.picker.search"),
		() => K("calendar.picker.search"),
		() => K("calendar.picker.count", { n: F(ie) }),
		() => K("ui.close"),
		() => K("ui.close"),
		() => T(F(ae)),
		() => K("calendar.picker.preview", { name: T(F(ae)) }),
		() => K("calendar.picker.aboutHead"),
		() => se(F(ae)),
		() => K("calendar.picker.yoursHead"),
		() => r() === "add" ? K("calendar.picker.add") : K("calendar.picker.use")
	]), Br("close", xe, ye), Gi(Ee, () => F(m), (e) => k(m, e)), I("click", ke, () => t.onclose?.()), Yi(Ue, "clientWidth", (e) => k(b, e)), I("click", tt, () => t.onpick?.(F(_))), R(e, xe), ot();
}
Vr(["click", "dblclick"]);
//#endregion
//#region src/menu/FloatingMenu.svelte
var AC = /* @__PURE__ */ L("<button class=\"ghost row-tool\"></button>"), jC = /* @__PURE__ */ L("<div><header class=\"block-menu-head\"><span class=\"block-menu-grip\" aria-hidden=\"true\"></span> <span class=\"block-menu-title\"> </span> <!> <!> <button class=\"ghost row-tool menu-width\"></button> <button class=\"ghost row-tool\"></button></header> <div class=\"panel-body block-menu-body\"><!></div></div>");
function MC(e, t) {
	at(t, !0);
	let n = rt("urd-editor"), r = /* @__PURE__ */ D(() => n.selectedBlock), { moveBlockMenu: i, menuBackToBlock: a } = n, o = /* @__PURE__ */ O(!1), s;
	ia(() => s?.querySelector(".menu-search")?.focus());
	function c(e) {
		if (e.button !== 0 || e.target.closest("button, input, label")) return;
		e.preventDefault();
		let n = e.currentTarget, r = n.closest(".block-menu"), a = {
			w: r.offsetWidth,
			h: r.offsetHeight
		}, s = {
			x: e.clientX,
			y: e.clientY,
			left: t.pos.left,
			top: t.pos.top
		};
		n.setPointerCapture(e.pointerId), k(o, !0);
		let c = (e) => i({
			left: s.left + (e.clientX - s.x),
			top: s.top + (e.clientY - s.y)
		}, a), l = () => {
			n.removeEventListener("pointermove", c), n.removeEventListener("pointerup", l), n.removeEventListener("pointercancel", l), k(o, !1);
		};
		n.addEventListener("pointermove", c), n.addEventListener("pointerup", l), n.addEventListener("pointercancel", l);
	}
	var l = jC();
	let u;
	var d = A(l), f = A(d);
	V(f, () => "<svg width=\"10\" height=\"16\" viewBox=\"0 0 12 18\" fill=\"currentColor\" aria-hidden=\"true\"><circle cx=\"3\" cy=\"3\" r=\"1.6\"/><circle cx=\"9\" cy=\"3\" r=\"1.6\"/><circle cx=\"3\" cy=\"9\" r=\"1.6\"/><circle cx=\"9\" cy=\"9\" r=\"1.6\"/><circle cx=\"3\" cy=\"15\" r=\"1.6\"/><circle cx=\"9\" cy=\"15\" r=\"1.6\"/></svg>", !0), E(f);
	var p = N(f, 2), m = M(p, !0), h = N(p, 2);
	Cx(h, {
		get: () => ug.menuQuery,
		set: (e) => ug.menuQuery = e
	});
	var g = N(h, 2), _ = (e) => {
		var t = AC();
		V(t, () => "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1\"/><path d=\"M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1\"/></svg>", !0), E(t), P((e, n) => {
			G(t, "title", e), G(t, "aria-label", n);
		}, [() => K("menu.backToBlock"), () => K("menu.backToBlock")]), I("click", t, a), R(e, t);
	};
	B(g, (e) => {
		ug.place && e(_);
	});
	var v = N(g, 2);
	V(v, () => ug.wide ? "<svg viewBox=\"0 0 18 18\" width=\"14\" height=\"14\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M2 4l4 5-4 5M16 4l-4 5 4 5\"/></svg>" : "<svg viewBox=\"0 0 18 18\" width=\"14\" height=\"14\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M6 4L2 9l4 5M12 4l4 5-4 5\"/></svg>", !0), E(v);
	var y = N(v, 2);
	V(y, () => q.cross, !0), E(y), E(d);
	var b = N(d, 2), x = A(b);
	{
		let e = /* @__PURE__ */ D(dg);
		xx(x, {
			get wide() {
				return F(e);
			},
			get query() {
				return ug.menuQuery;
			}
		});
	}
	E(b), E(l), Zi(l, (e) => s = e, () => s), P((e, n, r, i, a, s) => {
		u = H(l, 1, "block-menu", null, u, {
			wide: e,
			dragging: F(o)
		}), Ii(l, `--menu-left: ${t.pos.left ?? ""}px; --menu-top: ${t.pos.top ?? ""}px; --menu-min: ${ug.min ?? ""}px`), G(d, "title", n), z(m, r), G(v, "title", i), G(v, "aria-label", a), G(y, "title", s);
	}, [
		() => dg(),
		() => K("tip.menu.dragHead"),
		() => K("blocks.suffix", { label: n.blockLabel(F(r).type) }),
		() => ug.wide ? K("menu.toNarrow") : K("menu.toWide"),
		() => ug.wide ? K("menu.toNarrow") : K("menu.toWide"),
		() => K("tip.closeEsc")
	]), I("pointerdown", d, c), I("click", v, () => ug.wide = !ug.wide), I("click", y, function(...e) {
		t.onclose?.apply(this, e);
	}), R(e, l), ot();
}
//#endregion
//#region node_modules/svelte/src/internal/flags/legacy.js
Vr(["pointerdown", "click"]), Ye();
//#endregion
//#region node_modules/svelte/src/transition/index.js
function NC(e) {
	let t = e - 1;
	return t * t * t + 1;
}
function PC(e) {
	let t = typeof e == "string" && e.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
	return t ? [parseFloat(t[1]), t[2] || "px"] : [e, "px"];
}
function FC(e, { delay: t = 0, duration: n = 400, easing: r = NC, x: i = 0, y: a = 0, opacity: o = 0 } = {}) {
	let s = getComputedStyle(e), c = +s.opacity, l = s.transform === "none" ? "" : s.transform, u = c * (1 - o), [d, f] = PC(i), [p, m] = PC(a);
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
//#region src/shell/TopBar.svelte
var IC = /* @__PURE__ */ L("<button><!> </button>"), LC = /* @__PURE__ */ L("<div class=\"tool-pop\"></div>"), RC = /* @__PURE__ */ L("<span class=\"toolmenu\"><button><!><!></button> <!></span>"), zC = /* @__PURE__ */ L("<button></button>"), BC = /* @__PURE__ */ L("<span class=\"tool-cap\"> </span> <span class=\"viewswitch toolgrp\"></span>", 1), VC = /* @__PURE__ */ L("<div class=\"tool-pop\"><div class=\"tool-pop-row\"><button class=\"ghost\"></button> <span class=\"zoom-readout\"> </span> <button class=\"ghost\"></button></div> <button><!> </button></div>"), HC = /* @__PURE__ */ L("<span class=\"toolmenu\"><button><span class=\"zoom-cap\"> </span><!></button> <!></span>"), UC = /* @__PURE__ */ L("<span class=\"tool-cap\"> </span> <span class=\"zoomswitch toolgrp\"><button class=\"ghost\"></button> <span class=\"zoom-readout\"> </span> <button class=\"ghost\"></button> <button></button></span>", 1), WC = /* @__PURE__ */ L("<div class=\"tool-pop\"><button><!> </button> <button><!> </button></div>"), GC = /* @__PURE__ */ L("<span class=\"tool-cap\"> </span> <span class=\"toolgrp\"><button></button> <button></button></span>", 1), KC = /* @__PURE__ */ L("<button class=\"ghost page-btn\"> </button> <span class=\"toolset\"><!> <!> <!></span>", 1), qC = /* @__PURE__ */ L("<button class=\"badge attention\"><!> <span class=\"btn-label\"> </span> <span class=\"badge-mini\"> </span></button>"), JC = /* @__PURE__ */ L("<button class=\"discard-confirm\"><!> </button>"), YC = /* @__PURE__ */ L("<span class=\"draft-cluster\"><span class=\"chip draft-chip\"><span class=\"chip-full\" aria-hidden=\"true\"> </span> <span class=\"chip-mini\" aria-hidden=\"true\">!</span></span>  <span class=\"discard-wrap\"><button><!><span class=\"discard-label\"> </span></button> <!></span></span>"), XC = /* @__PURE__ */ L("<!> <span class=\"btn-label\"> </span>", 1), ZC = /* @__PURE__ */ L("<span class=\"who\"><!> </span>"), QC = /* @__PURE__ */ L("<a class=\"ghost\" href=\"/api/github/login\"> </a>"), $C = /* @__PURE__ */ L("<button class=\"ghost\"><!></button> <!> <a class=\"ghost\" target=\"_blank\" rel=\"noopener\"><!> <span class=\"btn-label\"> </span></a> <button class=\"primary\"> </button>", 1), ew = /* @__PURE__ */ L("<header><span class=\"topbar-group\"><!> <!></span> <span class=\"topbar-group topbar-draft\"><!></span> <span class=\"topbar-group topbar-right\"><!></span></header>");
function tw(e, t) {
	at(t, !1);
	let n = /* @__PURE__ */ on(rt("urd-editor"));
	$i();
	var r = ew();
	let i;
	var a = A(r), o = A(a), s = (e) => {
		var t = KC(), r = j(t), i = M(r, !0), a = N(r, 2), o = A(a), s = (e) => {
			var t = RC(), r = A(t);
			let i;
			var a = A(r);
			V(a, () => q[`device_${F(n).deviceId}`]), V(N(a), () => q.caret), E(r);
			var o = N(r, 2), s = (e) => {
				var t = LC();
				di(t, 5, () => F(n).devices, (e) => e.id, (e, t) => {
					var r = IC();
					let i;
					var a = A(r);
					V(a, () => q[`device_${F(t).id}`]);
					var o = N(a);
					E(r), P((e, a) => {
						i = H(r, 1, "ghost", null, i, { active: F(n).deviceId === F(t).id }), G(r, "title", e), z(o, ` ${a ?? ""}`);
					}, [() => F(n).deviceTip(F(t)), () => K(`lbl.device.${F(t).id}`)]), I("click", r, () => {
						sn(n, F(n).deviceId = F(t).id), sn(n, F(n).toolMenu = null);
					}), R(e, r);
				}), E(t), R(e, t);
			};
			B(o, (e) => {
				F(n).toolMenu === "device" && e(s);
			}), E(t), P((e) => {
				i = H(r, 1, "ghost", null, i, { active: F(n).toolMenu === "device" }), G(r, "title", e);
			}, [() => K("lbl.group.device")]), I("click", r, () => sn(n, F(n).toolMenu = F(n).toolMenu === "device" ? null : "device")), R(e, t);
		}, c = (e) => {
			var t = BC(), r = j(t), i = M(r, !0), a = N(r, 2);
			di(a, 5, () => F(n).devices, (e) => e.id, (e, t) => {
				var r = zC();
				let i;
				V(r, () => q[`device_${F(t).id}`], !0), E(r), P((e) => {
					i = H(r, 1, "ghost", null, i, { active: F(n).deviceId === F(t).id }), G(r, "title", e);
				}, [() => F(n).deviceTip(F(t))]), I("click", r, () => sn(n, F(n).deviceId = F(t).id)), R(e, r);
			}), E(a), P((e) => z(i, e), [() => K("lbl.group.device")]), R(e, t);
		};
		B(o, (e) => {
			F(n).folded.device ? e(s) : e(c, -1);
		});
		var l = N(o, 2), u = (e) => {
			var t = HC(), r = A(t);
			let i;
			var a = A(r), o = M(a);
			V(N(a), () => q.caret), E(r);
			var s = N(r, 2), c = (e) => {
				var t = VC(), r = A(t), i = A(r);
				V(i, () => q.minus, !0), E(i);
				var a = N(i, 2), o = M(a), s = N(a, 2);
				V(s, () => q.plus, !0), E(s), E(r);
				var c = N(r, 2);
				let l;
				var u = A(c);
				V(u, () => q.fit);
				var d = N(u);
				E(c), E(t), P((e, t, r, u, f, p) => {
					G(i, "title", e), G(a, "title", t), z(o, `${r ?? ""}%`), G(s, "title", u), l = H(c, 1, "ghost", null, l, { active: F(n).zoomMode === "fit" }), G(c, "title", f), z(d, ` ${p ?? ""}`);
				}, [
					() => K("tip.zoomOut"),
					() => K("tip.zoomCurrent"),
					() => Math.round(F(n).scale * 100),
					() => K("tip.zoomIn"),
					() => K("tip.zoomFit"),
					() => K("lbl.zoom.fit")
				]), I("click", i, () => F(n).stepZoom(-1)), I("click", s, () => F(n).stepZoom(1)), I("click", c, () => sn(n, F(n).zoomMode = "fit")), R(e, t);
			};
			B(s, (e) => {
				F(n).toolMenu === "zoom" && e(c);
			}), E(t), P((e, t) => {
				i = H(r, 1, "ghost", null, i, { active: F(n).toolMenu === "zoom" }), G(r, "title", e), z(o, `${t ?? ""}%`);
			}, [() => K("lbl.group.zoom"), () => Math.round(F(n).scale * 100)]), I("click", r, () => sn(n, F(n).toolMenu = F(n).toolMenu === "zoom" ? null : "zoom")), R(e, t);
		}, d = (e) => {
			var t = UC(), r = j(t), i = M(r, !0), a = N(r, 2), o = A(a);
			V(o, () => q.minus, !0), E(o);
			var s = N(o, 2), c = M(s), l = N(s, 2);
			V(l, () => q.plus, !0), E(l);
			var u = N(l, 2);
			let d;
			V(u, () => q.fit, !0), E(u), E(a), P((e, t, r, a, f, p) => {
				z(i, e), G(o, "title", t), G(s, "title", r), z(c, `${a ?? ""}%`), G(l, "title", f), d = H(u, 1, "ghost", null, d, { active: F(n).zoomMode === "fit" }), G(u, "title", p);
			}, [
				() => K("lbl.group.zoom"),
				() => K("tip.zoomOut"),
				() => K("tip.zoomCurrent"),
				() => Math.round(F(n).scale * 100),
				() => K("tip.zoomIn"),
				() => K("tip.zoomFit")
			]), I("click", o, () => F(n).stepZoom(-1)), I("click", l, () => F(n).stepZoom(1)), I("click", u, () => sn(n, F(n).zoomMode = "fit")), R(e, t);
		};
		B(l, (e) => {
			F(n).folded.zoom ? e(u) : e(d, -1);
		});
		var f = N(l, 2), p = (e) => {
			var t = RC(), r = A(t);
			let i;
			var a = A(r);
			V(a, () => q.gridToggle), V(N(a), () => q.caret), E(r);
			var o = N(r, 2), s = (e) => {
				var t = WC(), r = A(t);
				let i;
				var a = A(r);
				V(a, () => q.gridToggle);
				var o = N(a);
				E(r);
				var s = N(r, 2);
				let c;
				var l = A(s);
				V(l, () => q.guides);
				var u = N(l);
				E(s), E(t), P((e, t, a, l) => {
					i = H(r, 1, "ghost", null, i, { active: F(n).gridOn }), G(r, "title", e), z(o, ` ${t ?? ""}`), c = H(s, 1, "ghost", null, c, { active: F(n).guidesOn }), G(s, "title", a), z(u, ` ${l ?? ""}`);
				}, [
					() => K("tip.gridToggle"),
					() => K("lbl.view.grid"),
					() => K("tip.guides"),
					() => K("lbl.view.guides")
				]), I("click", r, function(...e) {
					F(n).toggleGrid?.apply(this, e);
				}), I("click", s, function(...e) {
					F(n).toggleGuides?.apply(this, e);
				}), R(e, t);
			};
			B(o, (e) => {
				F(n).toolMenu === "view" && e(s);
			}), E(t), P((e) => {
				i = H(r, 1, "ghost", null, i, { active: F(n).toolMenu === "view" || F(n).gridOn || F(n).guidesOn }), G(r, "title", e);
			}, [() => K("lbl.group.view")]), I("click", r, () => sn(n, F(n).toolMenu = F(n).toolMenu === "view" ? null : "view")), R(e, t);
		}, m = (e) => {
			var t = GC(), r = j(t), i = M(r, !0), a = N(r, 2), o = A(a);
			let s;
			V(o, () => q.gridToggle, !0), E(o);
			var c = N(o, 2);
			let l;
			V(c, () => q.guides, !0), E(c), E(a), P((e, t, r) => {
				z(i, e), s = H(o, 1, "ghost", null, s, { active: F(n).gridOn }), G(o, "title", t), l = H(c, 1, "ghost", null, l, { active: F(n).guidesOn }), G(c, "title", r);
			}, [
				() => K("lbl.group.view"),
				() => K("tip.gridToggle"),
				() => K("tip.guides")
			]), I("click", o, function(...e) {
				F(n).toggleGrid?.apply(this, e);
			}), I("click", c, function(...e) {
				F(n).toggleGuides?.apply(this, e);
			}), R(e, t);
		};
		B(f, (e) => {
			F(n).folded.view ? e(p) : e(m, -1);
		}), E(a), Zi(a, (e) => sn(n, F(n).toolMenuEl = e), () => F(n)?.toolMenuEl), P((e, t) => {
			G(r, "title", e), z(i, t);
		}, [() => K("tip.switchPage"), () => F(n).pageEntry()?.title ?? ""]), I("click", r, () => F(n).togglePanel("pages")), R(e, t);
	};
	B(o, (e) => {
		F(n).site && e(s);
	});
	var c = N(o, 2), l = (e) => {
		var t = qC(), r = A(t);
		V(r, () => q.phone);
		var i = N(r, 2), a = M(i, !0), o = M(N(i, 2), !0);
		E(t), P((e, r) => {
			G(t, "title", e), z(a, r), z(o, F(n).attentionCount);
		}, [() => K("tip.attention"), () => K(F(n).attentionCount === 1 ? "ui.attentionOne" : "ui.attentionMany", { n: F(n).attentionCount })]), I("click", t, function(...e) {
			F(n).jumpToAttention?.apply(this, e);
		}), R(e, t);
	};
	B(c, (e) => {
		F(n).attentionCount > 0 && e(l);
	}), E(a);
	var u = N(a, 2), d = A(u), f = (e) => {
		var t = YC(), r = A(t), i = M(A(r), !0);
		Ae(2), E(r);
		var a = N(r, 2), o = A(a);
		let s;
		var c = A(o);
		V(c, () => q.restore);
		var l = M(N(c), !0);
		E(o);
		var u = N(o, 2), d = (e) => {
			var t = JC(), r = A(t);
			V(r, () => q.restore);
			var i = N(r);
			E(t), P((e, n) => {
				G(t, "title", e), z(i, ` ${n ?? ""}`);
			}, [() => K("tip.discardArmed"), () => K("ui.discardConfirm")]), I("click", t, function(...e) {
				F(n).confirmDiscard?.apply(this, e);
			}), R(e, t);
		};
		B(u, (e) => {
			F(n).discardArmed && e(d);
		}), E(a), Zi(a, (e) => sn(n, F(n).discardWrapEl = e), () => F(n)?.discardWrapEl), E(t), P((e, t, a, c, u) => {
			G(r, "title", e), G(r, "aria-label", t), z(i, a), s = H(o, 1, "discard-dot", null, s, { armed: F(n).discardArmed }), G(o, "title", c), z(l, u);
		}, [
			() => K("ui.unpublished"),
			() => K("ui.unpublished"),
			() => K("ui.unpublished"),
			() => F(n).discardArmed ? K("tip.discardArmed") : K("tip.discard"),
			() => K("ui.discard")
		]), I("click", o, function(...e) {
			F(n).requestDiscard?.apply(this, e);
		}), Di(2, t, () => FC, () => ({
			x: 24,
			duration: F(n).reducedMotion ? 0 : 150
		})), R(e, t);
	};
	B(d, (e) => {
		F(n).dirty && e(f);
	}), E(u);
	var p = N(u, 2), m = A(p), h = (e) => {
		var t = $C(), r = j(t), i = A(r), a = (e) => {
			var t = XC(), n = j(t);
			V(n, () => q.eye);
			var r = M(N(n, 2), !0);
			P((e) => z(r, e), [() => K("ui.cleanView")]), R(e, t);
		}, o = (e) => {
			var t = XC(), n = j(t);
			V(n, () => q.pencil);
			var r = M(N(n, 2), !0);
			P((e) => z(r, e), [() => K("ui.edit")]), R(e, t);
		};
		B(i, (e) => {
			F(n).chromeVisible ? e(a) : e(o, -1);
		}), E(r);
		var s = N(r, 2), c = (e) => {
			var t = ZC(), r = A(t), i = (e) => {
				var t = Xr();
				V(j(t), () => q.warn), R(e, t);
			};
			B(r, (e) => {
				F(n).auth.allowed || e(i);
			});
			var a = N(r, 1, !0);
			E(t), P((e) => {
				G(t, "title", e), z(a, F(n).auth.login);
			}, [() => F(n).auth.allowed ? K("tip.hasPublishAccess") : K("tip.noPublishAccess")]), R(e, t);
		}, l = (e) => {
			var t = QC(), n = M(t, !0);
			P((e) => z(n, e), [() => K("ui.loginGitHub")]), R(e, t);
		};
		B(s, (e) => {
			F(n).auth?.loggedIn ? e(c) : F(n).auth && e(l, 1);
		});
		var u = N(s, 2), d = A(u);
		V(d, () => q.external);
		var f = M(N(d, 2), !0);
		E(u);
		var p = N(u, 2), m = M(p, !0);
		P((e, t, i, a, o) => {
			G(r, "title", e), G(u, "href", t), G(u, "title", i), z(f, a), p.disabled = !F(n).dirty, z(m, o);
		}, [
			() => F(n).chromeVisible ? K("tip.chromeHide") : K("tip.chromeShow"),
			() => F(n).pageEntry()?.path ?? "/",
			() => K("ui.viewSite"),
			() => K("ui.viewSite"),
			() => K("ui.publish")
		]), I("click", r, function(...e) {
			F(n).toggleChrome?.apply(this, e);
		}), I("click", p, function(...e) {
			F(n).publish?.apply(this, e);
		}), R(e, t);
	};
	B(m, (e) => {
		F(n).site && e(h);
	}), E(p), E(r), P(() => i = H(r, 1, "topbar", null, i, { hidden: !F(n).chromeVisible })), R(e, r), ot();
}
Vr(["click"]);
var nw = 3840, rw = 2400, iw = (e, t, n) => Math.min(n, Math.max(t, e));
function aw({ innerWidth: e = 0, screenWidth: t = 0 } = {}) {
	let n = e > 0 ? e : t;
	return Math.max(1, Math.round(n > 0 ? n : 1));
}
function ow(e) {
	return !e || typeof e.innerWidth != "number" ? null : aw({
		innerWidth: e.innerWidth,
		screenWidth: e.screen?.width ?? 0
	});
}
function sw(e, t) {
	let n = e && typeof e == "object" && !Array.isArray(e) ? e : {}, r = n.mode === "custom" ? "custom" : "own", i = Number(n.width), a = iw(Number.isFinite(i) && i > 0 ? i : t, 640, nw), o = Number(n.height), s = Number.isFinite(o) && o > 0 ? iw(o, 480, rw) : 0;
	return {
		mode: r,
		width: Math.round(a),
		height: Math.round(s)
	};
}
function cw(e, t) {
	return e?.mode === "custom" ? {
		width: e.width,
		height: e.height || 0
	} : {
		width: t,
		height: 0
	};
}
//#endregion
//#region src/shell/Rail.svelte
var lw = /* @__PURE__ */ L("<button> </button>"), uw = /* @__PURE__ */ L("<span class=\"rail-group\"> </span> <!>", 1), dw = /* @__PURE__ */ L("<div class=\"ctl-row\"><span class=\"mini-label\"> </span> <input type=\"number\" class=\"tb-num\" step=\"10\"/> <span class=\"mini-label\"> </span> <input type=\"number\" class=\"tb-num\" min=\"0\" step=\"10\" placeholder=\"0\"/></div>"), fw = /* @__PURE__ */ L("<p class=\"mini-label\"> </p> <label> <input type=\"text\" spellcheck=\"false\"/></label>", 1), pw = /* @__PURE__ */ L("<div class=\"settings-pop\"><p class=\"panel-strong\"> </p> <label> <!></label> <label> <!></label> <label> <!></label> <label> <!></label> <label> <!></label> <p class=\"mini-label\"> </p> <div class=\"seg\"><button type=\"button\"> </button> <button type=\"button\"> </button></div> <!> <!></div>"), mw = /* @__PURE__ */ L("<nav><!> <span class=\"rail-settings\"><span class=\"rail-brand\" title=\"Urd\"><svg class=\"brand-mark\" viewBox=\"10.3 8.3 19.4 25.4\" aria-hidden=\"true\"><path d=\"M12 32V10l16 6.5V32\" fill=\"none\" stroke=\"var(--urd-brand)\" stroke-width=\"3.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg> <span class=\"brand-word\">Urd</span></span> <button></button> <!></span></nav>");
function hw(e, t) {
	at(t, !1);
	let n = /* @__PURE__ */ on(rt("urd-editor"));
	$i();
	var r = mw();
	let i;
	var a = A(r);
	di(a, 1, () => F(n).PANEL_GROUPS, si, (e, t, r) => {
		var i = uw(), a = j(i), o = M(a, !0);
		di(N(a, 2), 1, () => F(t), (e) => e, (e, t) => {
			var r = lw();
			let i;
			var a = M(r, !0);
			P(() => {
				i = H(r, 1, "", null, i, { active: F(n).activePanel === F(t) }), z(a, F(n).PANEL_LABELS[F(t)]);
			}), I("click", r, () => F(n).togglePanel(F(t))), R(e, r);
		}), P((e) => z(o, e), [() => K(F(n).PANEL_GROUP_KEYS[r])]), R(e, i);
	});
	var o = N(a, 2), s = N(A(o), 2);
	let c;
	V(s, () => q.gear, !0), E(s);
	var l = N(s, 2), u = (e) => {
		var t = pw(), r = A(t), i = M(r, !0), a = N(r, 2), o = A(a);
		J(N(o), {
			get value() {
				return F(n).adminTheme;
			},
			get options() {
				return F(n).ADMIN_THEMES;
			},
			onchange: (e) => sn(n, F(n).adminTheme = e)
		}), E(a);
		var s = N(a, 2), c = A(s), l = N(c);
		{
			let e = /* @__PURE__ */ At(() => [["auto", K("lang.auto")], ...F(n).adminLangOptions()]);
			J(l, {
				get value() {
					return F(n).adminLangChoice;
				},
				get options() {
					return F(e);
				},
				get onchange() {
					return F(n).setAdminLang;
				}
			});
		}
		E(s);
		var u = N(s, 2), d = A(u), f = N(d);
		{
			let e = /* @__PURE__ */ At(() => [["strip", K("settings.layoutPickerStrip")], ["menu", K("settings.layoutPickerMenu")]]);
			J(f, {
				get value() {
					return F(n).layoutPickerPref;
				},
				get options() {
					return F(e);
				},
				get onchange() {
					return F(n).setLayoutPicker;
				}
			});
		}
		E(u);
		var p = N(u, 2), m = A(p), h = N(m);
		{
			let e = /* @__PURE__ */ At(() => [["wide", K("settings.menuWide")], ["narrow", K("settings.menuNarrow")]]);
			J(h, {
				get value() {
					return ug.widthPref;
				},
				get options() {
					return F(e);
				},
				get onchange() {
					return fg;
				}
			});
		}
		E(p);
		var g = N(p, 2), _ = A(g), v = N(_);
		{
			let e = /* @__PURE__ */ At(() => [["remember", K("settings.panelsRemember")], ["reset", K("settings.panelsReset")]]);
			J(v, {
				get value() {
					return F(n).panelsPref;
				},
				get options() {
					return F(e);
				},
				get onchange() {
					return F(n).setPanelsPref;
				}
			});
		}
		E(g);
		var y = N(g, 2), b = M(y, !0), x = N(y, 2), S = A(x);
		let C;
		var w = M(S, !0), ee = N(S, 2);
		let T;
		var te = M(ee, !0);
		E(x);
		var ne = N(x, 2), re = (e) => {
			var t = dw(), r = A(t), i = M(r, !0), a = N(r, 2);
			U(a);
			var o = N(a, 2), s = M(o, !0), c = N(o, 2);
			U(c), E(t), P((e, t, r, o) => {
				z(i, e), G(a, "min", 640), G(a, "max", nw), G(a, "title", t), W(a, F(n).screenPref.width), z(s, r), G(c, "max", rw), G(c, "title", o), W(c, F(n).screenPref.height || "");
			}, [
				() => K("lbl.screen.w"),
				() => K("tip.screen.width", {
					min: 640,
					max: nw
				}),
				() => K("lbl.screen.h"),
				() => K("tip.screen.height", {
					min: 480,
					max: rw
				})
			]), I("change", a, (e) => {
				F(n).setScreenPref({ width: Number(e.target.value) }), e.target.value = F(n).screenPref.width;
			}), I("change", c, (e) => {
				F(n).setScreenPref({ height: Number(e.target.value) }), e.target.value = F(n).screenPref.height || "";
			}), R(e, t);
		};
		B(ne, (e) => {
			F(n).screenPref.mode === "custom" && e(re);
		});
		var ie = N(ne, 2), ae = (e) => {
			var t = fw(), r = j(t), i = M(r, !0), a = N(r, 2), o = A(a), s = N(o);
			U(s), E(a), P((e, t, c, l, u) => {
				G(r, "title", e), z(i, t), G(a, "title", c), z(o, `${l ?? ""} `), G(s, "placeholder", u), W(s, F(n).siteDraft.analytics?.token ?? "");
			}, [
				() => K("tip.analytics"),
				() => K("settings.analytics"),
				() => K("tip.analytics"),
				() => K("lbl.analyticsToken"),
				() => K("ph.analyticsToken")
			]), I("change", s, (e) => F(n).setAnalyticsToken(e.target.value)), R(e, t);
		};
		B(ie, (e) => {
			F(n).siteDraft && e(ae);
		}), E(t), P((e, t, r, l, f, h, v, ne, re, ie, ae, oe, se, ce, le, ue) => {
			z(i, e), G(a, "title", t), z(o, `${r ?? ""} `), G(s, "title", l), z(c, `${f ?? ""} `), G(u, "title", h), z(d, `${v ?? ""} `), G(p, "title", ne), z(m, `${re ?? ""} `), G(g, "title", ie), z(_, `${ae ?? ""} `), G(y, "title", oe), z(b, se), G(x, "title", ce), C = H(S, 1, "", null, C, { on: F(n).screenPref.mode === "own" }), z(w, le), T = H(ee, 1, "", null, T, { on: F(n).screenPref.mode === "custom" }), z(te, ue);
		}, [
			() => K("settings.title"),
			() => K("topbar.adminTheme.title"),
			() => K("settings.theme"),
			() => K("topbar.language.title"),
			() => K("settings.language"),
			() => K("tip.settings.layoutPicker"),
			() => K("settings.layoutPicker"),
			() => K("tip.settings.menuWidth"),
			() => K("settings.menuWidth"),
			() => K("tip.settings.panels"),
			() => K("settings.panels"),
			() => K("tip.screen.mode"),
			() => K("settings.screen"),
			() => K("tip.screen.mode"),
			() => K("lbl.screen.own"),
			() => K("lbl.screen.size")
		]), I("click", S, () => F(n).setScreenPref({ mode: "own" })), I("click", ee, () => F(n).setScreenPref({ mode: "custom" })), R(e, t);
	};
	B(l, (e) => {
		F(n).settingsOpen && e(u);
	}), E(o), Zi(o, (e) => sn(n, F(n).settingsEl = e), () => F(n)?.settingsEl), E(r), P((e) => {
		i = H(r, 1, "rail", null, i, { hidden: !F(n).chromeVisible }), c = H(s, 1, "rail-gear", null, c, { active: F(n).settingsOpen }), G(s, "title", e);
	}, [() => K("settings.title")]), I("click", s, () => sn(n, F(n).settingsOpen = !F(n).settingsOpen)), R(e, r), ot();
}
Vr(["click", "change"]);
//#endregion
//#region src/shell/PreviewStage.svelte
var gw = /* @__PURE__ */ L("<div><div class=\"stage\"><iframe></iframe></div></div>");
function _w(e, t) {
	at(t, !1);
	let n = /* @__PURE__ */ on(rt("urd-editor"));
	$i();
	var r = gw();
	let i;
	var a = A(r), o = A(a);
	Zi(o, (e) => sn(n, F(n).iframeEl = e), () => F(n)?.iframeEl), E(a), E(r), Zi(r, (e) => sn(n, F(n).frameWrapEl = e), () => F(n)?.frameWrapEl), P((e) => {
		i = H(r, 1, "frame-wrap", null, i, {
			mobile: F(n).viewMode === "mobile",
			pan: F(n).canPan,
			fold: F(n).targetH > 0
		}), Ii(a, `width:${F(n).stageW ?? ""}px; height:${F(n).stageH ?? ""}px`), G(o, "title", e), G(o, "src", `/?page=${F(n).pageId}&preview=1`), Ii(o, `width:${F(n).targetW ?? ""}px; height:${F(n).iframeH ?? ""}px; transform:scale(${F(n).scale ?? ""}); transform-origin:top left`);
	}, [() => K("ui.previewTitle")]), Br("load", o, function(...e) {
		F(n).onIframeLoad?.apply(this, e);
	}), Rr(o), R(e, r), ot();
}
//#endregion
//#region src/shell/ConfirmDialog.svelte
var vw = /* @__PURE__ */ L("<p class=\"panel-hint confirm-line\"> </p>"), yw = /* @__PURE__ */ L("<input/>"), bw = /* @__PURE__ */ L("<div class=\"setup-overlay\"><div class=\"setup-card\"><h2> </h2> <!> <!> <span class=\"setup-actions\"><button class=\"ghost\"> </button> <button class=\"primary\"> </button></span></div></div>");
function xw(e, t) {
	at(t, !1);
	let n = /* @__PURE__ */ on(rt("urd-editor"));
	$i();
	var r = Xr(), i = j(r), a = (e) => {
		var t = bw(), r = A(t), i = A(r), a = M(i, !0), o = N(i, 2);
		di(o, 1, () => F(n).confirmBox.lines, (e) => e, (e, t) => {
			var n = vw(), r = M(n, !0);
			P(() => z(r, F(t))), R(e, n);
		});
		var s = N(o, 2), c = (e) => {
			var t = yw();
			U(t), _t(t, !0), P(() => G(t, "placeholder", F(n).confirmBox.placeholder)), I("keydown", t, (e) => e.key === "Enter" && F(n).confirmBox.value.trim() && F(n).answerConfirm(!0)), Gi(t, () => F(n).confirmBox.value, (e) => sn(n, F(n).confirmBox.value = e)), R(e, t);
		};
		B(s, (e) => {
			F(n).confirmBox.prompt && e(c);
		});
		var l = N(s, 2), u = A(l), d = M(u, !0), f = N(u, 2), p = M(f, !0);
		E(l), E(r), E(t), P(() => {
			z(a, F(n).confirmBox.title), z(d, F(n).confirmBox.cancelLabel), z(p, F(n).confirmBox.okLabel);
		}), I("pointerdown", t, (e) => sn(n, F(n).confirmDownOnOverlay = e.target === e.currentTarget)), I("click", t, (e) => F(n).confirmDownOnOverlay && e.target === e.currentTarget && F(n).answerConfirm(!1)), I("click", u, () => F(n).answerConfirm(!1)), I("click", f, () => F(n).answerConfirm(!0)), R(e, t);
	};
	B(i, (e) => {
		F(n).confirmBox && e(a);
	}), R(e, r), ot();
}
Vr([
	"pointerdown",
	"click",
	"keydown"
]);
//#endregion
//#region src/shell/SetupWizard.svelte
var Sw = /* @__PURE__ */ L("<div class=\"setup-overlay\"><div class=\"setup-card\"><h2> </h2> <p class=\"panel-hint\"> </p> <label> <input/></label> <label> <!></label> <label> <!></label> <p class=\"panel-hint\"> </p> <p class=\"panel-hint\"> </p> <span class=\"setup-actions\"><button class=\"ghost\"> </button> <button class=\"primary\"> </button></span></div></div>");
function Cw(e, t) {
	at(t, !1);
	let n = /* @__PURE__ */ on(rt("urd-editor"));
	$i();
	var r = Xr(), i = j(r), a = (e) => {
		var t = Sw(), r = A(t), i = A(r), a = M(i, !0), o = N(i, 2), s = M(o, !0), c = N(o, 2), l = A(c), u = N(l);
		U(u), E(c);
		var d = N(c, 2), f = A(d), p = N(f);
		{
			let e = /* @__PURE__ */ At(() => K("setup.accentPick"));
			sl(p, {
				get value() {
					return F(n).setupAccent;
				},
				get label() {
					return F(e);
				},
				onchange: (e) => sn(n, F(n).setupAccent = e)
			});
		}
		E(d);
		var m = N(d, 2), h = A(m), g = N(h);
		{
			let e = /* @__PURE__ */ At(() => K("setup.bgLabel"));
			sl(g, {
				get value() {
					return F(n).setupBg;
				},
				get label() {
					return F(e);
				},
				onchange: (e) => sn(n, F(n).setupBg = e)
			});
		}
		E(m);
		var _ = N(m, 2), v = M(_, !0), y = N(_, 2), b = M(y, !0), x = N(y, 2), S = A(x), C = M(S, !0), w = N(S, 2), ee = M(w, !0);
		E(x), E(r), E(t), P((e, t, n, r, i, o, c, d, p, m, g) => {
			z(a, e), z(s, t), z(l, `${n ?? ""} `), G(u, "placeholder", r), z(f, `${i ?? ""} `), z(h, `${o ?? ""} `), z(v, c), z(b, d), z(C, p), w.disabled = m, z(ee, g);
		}, [
			() => K("setup.title"),
			() => K("setup.intro"),
			() => K("setup.nameLabel"),
			() => K("ph.setup.name"),
			() => K("setup.accentLabel"),
			() => K("setup.bgLabel"),
			() => K("setup.outro"),
			() => K("setup.keys"),
			() => K("setup.skip"),
			() => !F(n).setupName.trim(),
			() => K("setup.start")
		]), I("keydown", u, (e) => e.key === "Enter" && F(n).applySetup()), Gi(u, () => F(n).setupName, (e) => sn(n, F(n).setupName = e)), I("click", S, function(...e) {
			F(n).closeSetup?.apply(this, e);
		}), I("click", w, function(...e) {
			F(n).applySetup?.apply(this, e);
		}), R(e, t);
	};
	B(i, (e) => {
		F(n).showSetup && e(a);
	}), R(e, r), ot();
}
Vr(["keydown", "click"]);
//#endregion
//#region src/lib/draftStore.js
function ww(e, t, n, r) {
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
//#region src/lib/menu-place.js
function Tw(e, t, n, r = 8, i = 8) {
	let a = Math.max(r, n.w - t.w - i), o = Math.max(i, n.h - t.h - i);
	return {
		left: Math.min(Math.max(r, e.left), a),
		top: Math.min(Math.max(i, e.top), o)
	};
}
function Ew(e, t, n) {
	let r = Math.min(e.left + t.w, n.right) - Math.max(e.left, n.left), i = Math.min(e.top + t.h, n.bottom) - Math.max(e.top, n.top);
	return r > 0 && i > 0 ? r * i : 0;
}
function Dw(e, t, n, { min: r = 8, gap: i = 12, margin: a = 8 } = {}) {
	let o = [
		["right", {
			left: e.right + i,
			top: e.top
		}],
		["left", {
			left: e.left - i - t.w,
			top: e.top
		}],
		["below", {
			left: e.left,
			top: e.bottom + i
		}]
	].map(([i, o]) => {
		let s = Tw(o, t, n, r, a);
		return {
			side: i,
			...s,
			covers: Ew(s, t, e)
		};
	}), s = o.find((e) => e.covers === 0) ?? o.reduce((e, t) => t.covers < e.covers ? t : e);
	return {
		left: s.left,
		top: s.top,
		side: s.side
	};
}
var Ow = 400;
function kw({ prepare: e, onHeight: t, title: n }) {
	let r = null, i = !1, a = null, o = null, s = null, c = (e) => r?.contentWindow?.postMessage(e, location.origin), l = () => {
		if (a = null, !i || !o) return;
		let { pageId: t, page: n, blocks: r } = o;
		o = null, s = t, e(c, !1), c({
			type: "urd-preview-full",
			pageId: t,
			page: n
		});
		for (let [e, { sectionId: t, seq: n }] of r) c({
			type: "urd-fit-block",
			sectionId: t,
			blockId: e,
			seq: n
		});
	}, u = (n) => {
		if (n.origin !== location.origin || !r || n.source !== r.contentWindow) return;
		let a = n.data;
		a?.type === "urd-ready" ? (i = !0, e(c, !0), c({
			type: "urd-viewport",
			mode: "mobile"
		}), c({
			type: "urd-chrome",
			visible: !1
		}), l()) : a?.type === "urd-grow" && a.fit && s && t(s, a.blockId, a.h, a.seq ?? 0);
	}, d = () => {
		r || (window.addEventListener("message", u), r = document.createElement("iframe"), r.src = "/?preview=1", r.title = n(), r.tabIndex = -1, r.inert = !0, r.setAttribute("aria-hidden", "true"), r.style.cssText = "position:fixed;left:0;top:0;width:390px;height:844px;border:0;opacity:0;pointer-events:none;z-index:-1", document.body.appendChild(r));
	};
	return {
		request(e, t, n, r, i) {
			d();
			let s = o?.pageId === e ? o.blocks : /* @__PURE__ */ new Map();
			s.set(r, {
				sectionId: n,
				seq: i
			}), o = {
				pageId: e,
				page: t,
				blocks: s
			}, clearTimeout(a), a = setTimeout(l, Ow);
		},
		cancel() {
			clearTimeout(a), a = null, o = null, s = null;
		},
		destroy() {
			clearTimeout(a), window.removeEventListener("message", u), r?.remove(), r = null, i = !1;
		}
	};
}
//#endregion
//#region ../template/assets/engine/0.7.6/animations/core.js
var Aw = () => ({
	duration: 600,
	delay: 0
}), jw = 90, Mw = {
	"fade-in": {
		version: 1,
		label: "Fade in",
		labelKey: "anim.fadeIn",
		entrance: !0,
		defaults: Aw,
		migrations: {}
	},
	"slide-up": {
		version: 1,
		label: "Slide up",
		labelKey: "anim.slideUp",
		entrance: !0,
		defaults: Aw,
		migrations: {}
	},
	"zoom-in": {
		version: 1,
		label: "Zoom in",
		labelKey: "anim.zoomIn",
		entrance: !0,
		defaults: Aw,
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
			step: jw,
			effect: "slide-up",
			pattern: "sequence"
		}),
		migrations: {}
	}
};
//#endregion
//#region ../template/assets/engine/0.7.6/plugins.js
function Nw(e) {
	let t = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(e).trim());
	return t ? [
		Number(t[1]),
		Number(t[2]),
		Number(t[3])
	] : null;
}
var Pw = (e, t) => e[0] - t[0] || e[1] - t[1] || e[2] - t[2];
function Fw(e, t) {
	let n = Nw(e);
	if (!n || typeof t != "string" || !t.trim()) return !1;
	for (let e of t.trim().split(/\s+/)) {
		let t = /^(>=|<=|>|<|=|\^|~)?(\d+\.\d+\.\d+)$/.exec(e);
		if (!t) return !1;
		let r = t[1] ?? "=", i = Nw(t[2]), a = Pw(n, i);
		if (!(r === ">=" ? a >= 0 : r === ">" ? a > 0 : r === "<=" ? a <= 0 : r === "<" ? a < 0 : r === "^" ? i[0] === 0 ? n[0] === 0 && n[1] === i[1] && a >= 0 : n[0] === i[0] && a >= 0 : r === "~" ? n[0] === i[0] && n[1] === i[1] && a >= 0 : a === 0)) return !1;
	}
	return !0;
}
var Iw = /^[a-z0-9][a-z0-9-]*$/;
function Lw(e) {
	let t = [];
	if (!e || typeof e != "object") return ["the manifest is not an object"];
	Iw.test(e.id ?? "") || t.push("id is missing or invalid"), (typeof e.name != "string" || !e.name) && t.push("name is missing"), Nw(e.version ?? "") || t.push("version is not semver"), (typeof e.requiresEngine != "string" || !e.requiresEngine) && t.push("requiresEngine is missing");
	let n = Array.isArray(e.languages) && e.languages.length > 0;
	return (e.entry !== void 0 || !n) && (typeof e.entry != "string" || !e.entry.endsWith(".js")) && t.push("entry is missing or is not a .js file"), (e.provides !== void 0 || !n) && (!e.provides || typeof e.provides != "object") && t.push("provides is missing"), e.languages !== void 0 && t.push(...fa(e.languages)), e.locales !== void 0 && typeof e.locales != "boolean" && t.push("locales must be a boolean"), e.names !== void 0 && (typeof e.names != "object" || e.names === null || Array.isArray(e.names) || Object.values(e.names).some((e) => typeof e != "string" || !e)) && t.push("names must be an object mapping language code to name"), t;
}
Promise.resolve();
//#endregion
//#region src/lib/preview-scale.js
function Rw(e, t) {
	return !(e > 0) || !(t > 0) ? 1 : e / t;
}
function zw(e, t, n, r = 0, i = 0) {
	if (n === "full") return 1;
	let a = i > 0 ? Rw(r, i) : Infinity;
	return Math.max(.1, Math.min(1, Rw(e, t), a));
}
//#endregion
//#region src/lib/previewBridge.js
function Bw(e, t = {}) {
	let n = (n) => {
		if (n.origin !== location.origin || n.source !== e.contentWindow) return;
		let r = n.data;
		r?.type === "urd-edit" && t.onEdit?.(r), r?.type === "urd-move" && t.onMove?.(r), r?.type === "urd-grow" && t.onGrow?.(r), r?.type === "urd-delete" && t.onDelete?.(r), r?.type === "urd-add-section" && t.onAddSection?.(r), r?.type === "urd-move-section" && t.onMoveSection?.(r), r?.type === "urd-delete-section" && t.onDeleteSection?.(r), r?.type === "urd-section-size" && t.onSectionSize?.(r), r?.type === "urd-undo" && t.onUndo?.(r), r?.type === "urd-select-section" && t.onSelectSection?.(r), r?.type === "urd-select-block" && t.onSelectBlock?.(r), r?.type === "urd-menu-area" && t.onMenuArea?.(r), r?.type === "urd-block-menu" && t.onBlockMenu?.(r), r?.type === "urd-plugin-blocks" && t.onPluginBlocks?.(r), r?.type === "urd-ready" && t.onReady?.(r), r?.type === "urd-navigate" && t.onNavigate?.(r), r?.type === "urd-add-block" && t.onAddBlock?.(r), r?.type === "urd-add-blocks" && t.onAddBlocks?.(r), r?.type === "urd-request-block" && t.onRequestBlock?.(r), r?.type === "urd-move-block-section" && t.onMoveBlockSection?.(r), r?.type === "urd-mobile-reset" && t.onMobileReset?.(r), r?.type === "urd-mobile-order" && t.onMobileOrder?.(r), r?.type === "urd-review-done" && t.onReviewDone?.(r), r?.type === "urd-block-flag" && t.onBlockFlag?.(r), r?.type === "urd-block-style" && t.onBlockStyle?.(r), r?.type === "urd-collection-edit" && t.onCollectionEdit?.(r), r?.type === "urd-collection-add" && t.onCollectionAdd?.(r), r?.type === "urd-nav-width" && t.onNavWidth?.(r), r?.type === "urd-save-template" && t.onSaveTemplate?.(r), r?.type === "urd-sticky-group" && t.onStickyGroup?.(r), r?.type === "urd-sticky-dock" && t.onStickyDock?.(r), r?.type === "urd-delete-template" && t.onDeleteTemplate?.(r), r?.type === "urd-apply-layout" && t.onApplyLayout?.(r);
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
		sendAnnounceReset() {
			r({ type: "urd-announce-reset" });
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
		sendFitBlock(e, t, n = 0) {
			r({
				type: "urd-fit-block",
				sectionId: e,
				blockId: t,
				seq: n
			});
		},
		sendFrames(e, t) {
			r({
				type: "urd-frames",
				sectionId: e,
				frames: t
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
		sendDemoMotion() {
			r({ type: "urd-demo-motion" });
		},
		sendOpenImageEditor(e) {
			r({
				type: "urd-open-image-editor",
				blockId: e
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
//#region ../template/assets/engine/0.7.6/place.js
function Vw(e) {
	let t = (e) => Math.round(e * 100) / 100, n = Math.max(0, t(100 - e.w)), r = Math.min(n, Math.max(0, t(e.x - e.w / 2))), i = Math.max(0, e.y - e.h / 2), a = e.snap === !1 || e.grid?.snap === !1, o = e.grid?.size || 8;
	return i = a ? Math.round(i) : Math.round(i / o) * o, {
		x: r,
		y: Math.max(0, i)
	};
}
//#endregion
//#region ../template/assets/engine/0.7.6/backgrounds/color.js
var Hw = {
	version: 1,
	label: "Colour",
	labelKey: "bgLayer.color",
	defaults: () => ({
		value: "bg",
		opacity: 1
	}),
	migrations: {},
	render(e, t) {
		e.style.background = Ns(t.value), e.style.opacity = String(t.opacity ?? 1);
	}
}, Uw = {
	linear: [
		"pan",
		"pan-loop",
		"rotate"
	],
	radial: ["pulse", "orbit"]
};
function Ww(e) {
	let t = Array.isArray(e) && e.length ? e : [{ color: "#0b0e14" }, { color: "#1a1030" }], n = t.map((e) => Math.max(0, Number(e?.share) || 0)), r = n.reduce((e, t) => e + t, 0), i = r <= 0, a = i ? t.length : r, o = 0;
	return t.map((e, t) => {
		let r = i ? 1 : n[t], s = (o + r / 2) / a * 100;
		return o += r, {
			color: e?.color ?? "#0b0e14",
			at: Math.round(s * 100) / 100
		};
	});
}
function Gw(e) {
	let t = (e) => Math.round(e * 100) / 100, n = e[0]?.at ?? 0;
	return [...e.map((e) => ({
		color: e.color,
		at: t(e.at - n)
	})), {
		color: e[0]?.color ?? "#0b0e14",
		at: 100
	}];
}
function Kw(e, t, n, r = .5) {
	let i = n % 360 * Math.PI / 180, a = (e) => Math.round(e * 100) / 100 || 0, o = (Math.abs(e * Math.sin(i)) + Math.abs(t * Math.cos(i))) / (1 - Math.min(Math.max(r, 0), .9));
	return {
		period: a(o),
		dx: a(Math.sin(i) * o),
		dy: a(-Math.cos(i) * o)
	};
}
function qw(e, t, n) {
	return `repeating-linear-gradient(${t}deg, ${e.map((e) => `${Ns(e.color)} ${Math.round(e.at / 100 * n * 100) / 100}px`).join(", ")})`;
}
function Jw(e) {
	let t = e.kind === "radial" ? "radial" : "linear", n = (Uw[t] ?? []).includes(e.animation) ? e.animation : null, r = Ww(e.stops), i = r.map((e) => `${Ns(e.color)} ${e.at}%`).join(", "), a = {}, o;
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
					stops: Gw(r),
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
var Yw = /* @__PURE__ */ new Set(), Xw = !1;
function Zw(e) {
	Yw.add(e), !(Xw || typeof window > "u") && (Xw = !0, window.addEventListener("resize", () => {
		for (let e of [...Yw]) e() || Yw.delete(e);
	}));
}
var Qw = !1;
function $w() {
	if (!Qw) {
		Qw = !0;
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
var eT = {
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
		let n = Jw(t);
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
					let e = Kw(r, i, n.loop.angle, n.loop.maxShare);
					t.style.inset = `${-Math.ceil(e.period)}px`, t.style.background = qw(n.loop.stops, n.loop.angle, e.period), t.style.setProperty("--urd-loop-dx", `${e.dx}px`), t.style.setProperty("--urd-loop-dy", `${e.dy}px`);
				}
				return !0;
			};
			requestAnimationFrame(r), Zw(r);
		} else if (n.runner) {
			e.classList.add("urd-bg-loop-host");
			let t = document.createElement("div");
			t.className = n.runner.className, t.style.background = n.runner.background, n.runner.left != null && (t.style.left = n.runner.left), n.runner.top != null && (t.style.top = n.runner.top), e.appendChild(t);
		} else e.style.background = n.background, n.className && (e.classList.add(n.className), n.className === "urd-bg-rotate" && $w());
	}
}, tT = /^(?:data:video\/[\w.+-]+;base64,[A-Za-z0-9+/=]+|\/media\/[\w%./-]+\.(?:mp4|webm))$/i;
function nT(e) {
	return typeof e == "string" && tT.test(e);
}
var rT = null;
function iT(e) {
	rT ??= new IntersectionObserver((e) => {
		for (let t of e) t.target.isConnected ? t.isIntersecting ? t.target.play().catch(() => {}) : t.target.pause() : rT.unobserve(t.target);
	}, { threshold: 0 }), rT.observe(e);
}
var aT = (e, t, n, r) => {
	e.style.position = "absolute", e.style.inset = "0", e.style.width = "100%", e.style.height = "100%", e.style.objectFit = t === "contain" ? "contain" : "cover", e.style.objectPosition = gu(n, r);
}, oT = {
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
		if (!nT(t.src)) return;
		if (e.style.opacity = String(t.opacity ?? 1), window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
			if (!Bs(t.poster)) return;
			let n = document.createElement("img");
			n.className = "urd-bg-video-poster", n.alt = "", n.setAttribute("aria-hidden", "true"), n.src = t.poster, aT(n, t.fit, t.x, t.y), e.appendChild(n);
			return;
		}
		let n = document.createElement("video");
		n.className = "urd-bg-video", n.muted = !0, n.setAttribute("muted", ""), n.loop = !0, n.playsInline = !0, n.setAttribute("playsinline", ""), n.preload = "metadata", n.disablePictureInPicture = !0, n.setAttribute("aria-hidden", "true"), Bs(t.poster) && (n.poster = t.poster), n.src = t.src, aT(n, t.fit, t.x, t.y), e.appendChild(n), iT(n), t.parallax > 0 && Lu(n, t.parallax, 0, t.fit === "contain" ? "contain" : "cover");
	}
}, sT = [
	"section",
	"blocks",
	"page"
];
function cT(e) {
	return zp(String(e ?? ""), "");
}
function lT(e, t, { id: n, title: r }) {
	let i = structuredClone(e);
	i.meta = {
		...i.meta,
		id: n,
		title: r
	};
	for (let e of i.sections ?? []) {
		e.id = t("sec");
		for (let n of e.blocks ?? []) n.id = t("blk");
		Ec(e), Tc(e), Dc(e);
	}
	return i;
}
//#endregion
//#region src/state/templates.svelte.js
var uT = null, dT = {}, fT = {}, pT = !1, mT = /* @__PURE__ */ O(mn([]));
async function hT() {
	let e = {
		version: 1,
		maler: []
	};
	try {
		e = await (await fetch("/content/maler.json")).json();
	} catch {}
	uT = ww("urd-draft-templates", () => e, OM.draftSaveError, "urd-draft-maler"), k(mT, [...uT.data.maler ?? []], !0);
	for (let e of F(mT)) {
		let t = null;
		try {
			t = await (await fetch(`/content/maler/${e}.json`)).json();
		} catch {}
		fT[e] = t, dT[e] = ww(`urd-draft-template-${e}`, () => t, OM.draftSaveError, `urd-draft-mal-${e}`), (dT[e].data?.schemaVersion ?? 1) > 1 && dT[e].reset();
	}
	pT = !0, gT();
}
function gT() {
	let e = F(mT).map((e) => dT[e]?.data ? {
		id: e,
		...JSON.parse(JSON.stringify(dT[e].data))
	} : null).filter(Boolean).map(({ id: e, mal: t, section: n, blocks: r, page: i }) => ({
		id: e,
		name: t.name,
		kind: t.kind,
		section: n,
		blocks: r,
		page: i
	}));
	XD.bridge?.sendTemplates(e);
}
function _T(e) {
	let t = sT.includes(e.kind) ? e.kind : "section";
	return vT(t, e[t]);
}
async function vT(e, t) {
	if (!t || !uT) return;
	let n = (await OM.askPrompt({
		title: K("canvas.templateNamePrompt"),
		placeholder: K("ph.templateName")
	}))?.trim();
	if (!n) return;
	let r = cT(n);
	if (!r) {
		OM.setStatus(K("status.invalidName"), "error");
		return;
	}
	if (F(mT).includes(r)) {
		OM.setStatus(K("status.templateExists"), "error");
		return;
	}
	DA.pushHistory("templates");
	let i = {
		schemaVersion: 1,
		mal: {
			name: n,
			kind: e
		},
		[e]: t
	};
	dT[r] = ww(`urd-draft-template-${r}`, () => null, OM.draftSaveError, `urd-draft-mal-${r}`), dT[r].replace(i), dT[r].save(), uT.data.maler = [...F(mT), r], uT.save(), k(mT, [...F(mT), r], !0), OM.setStatus(K("status.templateSaved", { name: n }), "ok"), DA.updateDirty(), gT();
}
async function yT(e) {
	let t = dT[e.id]?.data?.mal;
	t && await OM.askConfirm({ title: K("confirm.deleteTemplate", { name: t.name }) }) && (DA.pushHistory("templates"), Q.newPageTemplate === e.id && (Q.newPageTemplate = null), localStorage.removeItem(`urd-draft-template-${e.id}`), localStorage.removeItem(`urd-draft-mal-${e.id}`), delete dT[e.id], uT.data.maler = F(mT).filter((t) => t !== e.id), uT.save(), k(mT, F(mT).filter((t) => t !== e.id), !0), DA.updateDirty(), gT());
}
var bT = {
	get templatesIndexStore() {
		return uT;
	},
	set templatesIndexStore(e) {
		uT = e;
	},
	get templateStores() {
		return dT;
	},
	set templateStores(e) {
		dT = e;
	},
	get publishedTemplates() {
		return fT;
	},
	set publishedTemplates(e) {
		fT = e;
	},
	get templatesReady() {
		return pT;
	},
	set templatesReady(e) {
		pT = e;
	},
	get templateIds() {
		return F(mT);
	},
	set templateIds(e) {
		k(mT, e, !0);
	},
	initTemplates: hT,
	pushTemplatesToPreview: gT,
	handleSaveTemplate: _T,
	saveTemplate: vT,
	handleDeleteTemplate: yT
}, xT = [
	["color", Hw],
	["gradient", eT],
	["glow", Lx],
	["image", Iu],
	["slideshow", md],
	["video", oT],
	["pattern", nu],
	["grain", zx]
], ST = Object.fromEntries(xT), CT = /* @__PURE__ */ O(null), wT = /* @__PURE__ */ O(mn({
	size: 16,
	snap: !0
})), TT = /* @__PURE__ */ D(() => cp(F(rE), F(iE))), ET = null, DT = /* @__PURE__ */ O(null);
function OT() {
	k(DT, ET.data, !0), ET.replace(F(DT));
}
function kT() {
	XD.bridge?.sendSite(Ze(F(DT)));
}
function AT(e, t) {
	IT(e, () => {
		F(DT).nav.style ??= {}, t(F(DT).nav.style);
	});
}
var jT = {
	mutate: AT,
	keyPrefix: "navbg",
	keyId: "nav"
}, MT = {
	mutate: wE,
	keyPrefix: "footerbg",
	keyId: "footer"
}, NT = /* @__PURE__ */ D(() => F(DT)?.theme ? ks(F(DT).theme, XD.previewMode).color ?? {} : {}), PT = () => Object.entries(F(NT));
function FT(e, t) {
	DA.pushHistory("grid:site"), k(wT, {
		...F(wT),
		[e]: t
	}, !0), ET.data.grid = {
		...ET.data.grid,
		[e]: t
	}, ET.save(), DA.updateDirty(), kT(), OM.gridOn && XD.bridge?.sendShowGrid(!0);
}
function IT(e, t) {
	DA.pushHistory(e), t(), ET.save(), DA.updateDirty(), kT();
}
var LT = /* @__PURE__ */ O(""), RT = /* @__PURE__ */ O(null), zT = /* @__PURE__ */ O(null), BT = [
	"admin",
	"api",
	"assets",
	"content",
	"media",
	"plugins",
	"functions",
	"readme"
];
function VT(e, t = null) {
	return e ? BT.includes(e) ? K("error.reservedName", { slug: e }) : F(DT).pages.some((n) => n.id !== t && (n.path === `/${e}` || n.id === e)) ? K("error.pageExists") : null : K("error.pageNeedsName");
}
function HT() {
	let e = F(LT).trim(), t = zp(e), n = VT(t);
	if (n) return OM.setStatus(n, "error"), !1;
	let r = F(RT) && !F(RT).startsWith("preset:") ? bT.templateStores[F(RT)]?.data?.page : null, i = F(RT)?.startsWith("preset:") ? Pc(F(RT).slice(7), {
		pageId: t,
		title: e
	}) ?? $.blankPage({
		id: t,
		title: e
	}) : r ? lT(jc(JSON.parse(JSON.stringify(r)), ET.data), es, {
		id: t,
		title: e
	}) : $.blankPage({
		id: t,
		title: e
	});
	IT("pages", () => {
		F(DT).pages.push({
			id: t,
			title: e,
			path: `/${t}`,
			file: `content/pages/${t}.json`
		}), F(DT).nav.items.push({
			label: e,
			page: t
		});
	}), OM.writeDraftKey(`urd-draft-${t}`, JSON.stringify(i)), DA.updateDirty(), k(LT, ""), k(RT, null), $.selectPage(t);
}
async function UT(e) {
	k(zT, null);
	let t = e.id === $.pageId ? JSON.parse(JSON.stringify($.store.data)) : await $.readPageDraft(e);
	await bT.saveTemplate("page", t);
}
function WT(e, t) {
	let n = t.trim();
	if (!n || n === e.title) return;
	let r = e.title;
	IT("pages", () => {
		e.title = n;
		for (let t of F(DT).nav.items) t.page === e.id && t.label === r && (t.label = n);
	}), e.id === $.pageId ? ($.store.data.meta.title = n, $.store.save(), DA.updateDirty(), XD.bridge?.sendPage($.pageId, $.store.data)) : $.patchPageDraft(e, (e) => {
		e.meta.title = n;
	});
}
var GT = /* @__PURE__ */ O(mn({
	description: "",
	ogTitle: "",
	ogDescription: "",
	ogImage: ""
}));
function KT() {
	let e = $.store?.data?.meta ?? {};
	k(GT, {
		description: e.description ?? "",
		ogTitle: e.og?.title ?? "",
		ogDescription: e.og?.description ?? "",
		ogImage: e.og?.image ?? ""
	}, !0);
}
function qT(e, t) {
	let n = String(t ?? "").trim();
	if (e === "description") n ? $.store.data.meta.description = n : delete $.store.data.meta.description;
	else {
		let t = {
			ogTitle: "title",
			ogDescription: "description",
			ogImage: "image"
		}[e], r = { ...$.store.data.meta.og ?? {} };
		n ? r[t] = n : delete r[t], Object.keys(r).length ? $.store.data.meta.og = r : delete $.store.data.meta.og;
	}
	$.store.save(), DA.updateDirty(), KT();
	let r = F(DT).pages.find((e) => e.id === $.pageId);
	F(YT)[$.pageId] = !r?.noindex && !$.store.data.meta.description;
}
function JT(e) {
	let t = F(DT).pages.find((e) => e.id === $.pageId);
	t && (IT("edit:page-noindex", () => {
		e ? t.noindex = !0 : delete t.noindex;
	}), F(YT)[$.pageId] = !e && !$.store?.data?.meta?.description);
}
var YT = /* @__PURE__ */ O(mn({}));
async function XT() {
	let e = {};
	for (let t of F(DT).pages) {
		if (t.noindex) continue;
		if (t.id === $.pageId) {
			e[t.id] = !$.store?.data?.meta?.description;
			continue;
		}
		let n = await $.readPageDraft(t);
		e[t.id] = !n?.meta?.description;
	}
	k(YT, e, !0);
}
async function ZT(e) {
	let t = e.target.files?.[0];
	if (e.target.value = "", t) try {
		qT("ogImage", (await LM.compressOrTrim(t)).dataUrl);
	} catch (e) {
		OM.setStatus(LM.imageErrorText(e), "error");
	}
}
function QT(e, t) {
	let n = zp(t);
	if (e.path === "/" || `/${n}` === e.path) return;
	let r = VT(n, e.id);
	r ? OM.setStatus(r, "error") : IT("pages", () => {
		e.path = `/${n}`;
	});
}
function $T(e) {
	e.path !== "/" && (IT("pages", () => {
		F(DT).pages = F(DT).pages.filter((t) => t.id !== e.id), F(DT).nav.items = F(DT).nav.items.filter((t) => t.page !== e.id || t.children);
		for (let t of F(DT).nav.items) t.page === e.id && delete t.page, t.children && (t.children = t.children.filter((t) => t.page !== e.id), t.children.length === 0 && delete t.children);
		F(DT).nav.items = F(DT).nav.items.filter((e) => e.page || e.href || e.children);
	}), e.id === $.pageId && $.selectPage(F(DT).pages[0].id), OM.setStatus(K("status.pageRemoved")));
}
var eE = /* @__PURE__ */ O(null);
function tE(e) {
	IT("edit:site-icon", () => {
		F(DT).site.icon = e;
	}), k(eE, null);
}
function nE(e) {
	let t = String(e ?? "").trim();
	IT("edit:site-analytics", () => {
		t ? F(DT).analytics = { token: t } : delete F(DT).analytics;
	});
}
var rE = /* @__PURE__ */ D(() => F(DT)?.layout?.contentWidth ?? 1440), iE = /* @__PURE__ */ D(() => F(DT)?.layout?.gutter ?? 6);
function aE() {
	let e = F(DT).site.lang ?? "no";
	return e === "no" ? "nb" : e;
}
function oE() {
	let e = aE(), t = OM.sortLangs([...OM.LANG_OPTIONS, ...OM.sitePackLangs()]);
	return [...t.some(([t]) => t === e) ? [] : [[e, e]], ...t];
}
var sE = /* @__PURE__ */ O(!1), cE = /* @__PURE__ */ O(null), lE = /* @__PURE__ */ O(null), uE = () => F(DT)?.site?.calendars ?? [], dE = (e) => uE().find((t) => t.id === e) ?? null, fE = () => F(DT)?.site?.links ?? [], pE = /* @__PURE__ */ O(null), mE = /* @__PURE__ */ O(!1);
function hE() {
	let e = {
		id: es("link"),
		icon: "globe",
		label: "",
		url: ""
	};
	return IT("site", () => {
		F(DT).site.links ??= [], F(DT).site.links.push(e);
	}), k(pE, e.id, !0), e.id;
}
function gE(e) {
	IT("site", () => {
		F(DT).site.links.splice(e, 1), F(DT).site.links.length || delete F(DT).site.links;
	});
}
function _E(e, t) {
	let n = e + t;
	IT("site", () => {
		let t = F(DT).site.links;
		n < 0 || n >= t.length || ([t[e], t[n]] = [t[n], t[e]]);
	});
}
function vE(e, t) {
	IT(`edit:site-link-${e}`, () => {
		let n = F(DT).site.links[e];
		for (let [e, r] of Object.entries(t)) r || e === "url" ? n[e] = r : delete n[e];
	});
}
function yE(e = {}) {
	let t = {
		id: es("cal"),
		url: "",
		...e
	};
	return IT("site", () => {
		F(DT).site.calendars ??= [], F(DT).site.calendars.unshift(t);
	}), k(cE, t.id, !0), k(lE, t.id, !0), k(sE, !0), t.id;
}
var bE = /* @__PURE__ */ O(!1), xE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230b0e14'/%3E%3Cpath d='M19.2 49.6V14.4l25.6 10.4V49.6' fill='none' stroke='%2315b39a' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E", SE = /^(?:data:image\/[\w.+-]+;base64,[A-Za-z0-9+/=]+|\/(?!\/)[\w%./-]*)$/;
function CE(e) {
	IT("nav", () => {
		e === null ? delete F(DT).nav.launcher.image : delete F(DT).nav.launcher.links[e].image;
	});
}
function wE(e, t) {
	IT(e, () => {
		F(DT).footer ??= {
			version: 1,
			show: !1,
			text: "",
			align: "center"
		}, t(F(DT).footer);
	});
}
function TE(e, t) {
	let n = F(DT).nav.items;
	e === t || e < 0 || t < 0 || e >= n.length || t >= n.length || IT("nav", () => {
		let [r] = n.splice(e, 1);
		n.splice(t, 0, r);
	});
}
function EE(e, t, n) {
	let r = F(DT).nav.items[e].children;
	t === n || t < 0 || n < 0 || t >= r.length || n >= r.length || IT("nav", () => {
		let [e] = r.splice(t, 1);
		r.splice(n, 0, e);
	});
}
function DE(e) {
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
function OE() {
	return Object.fromEntries(Object.entries(F(DT).theme.tokens.color).map(([e, t]) => [e, DE(t)]));
}
function kE() {
	IT("theme", () => {
		F(DT).theme.alt = { tokens: { color: OE() } };
	});
}
function AE() {
	IT("theme", () => {
		F(DT).theme.alt.tokens.color = OE();
	});
}
function jE() {
	IT("theme", () => {
		delete F(DT).theme.alt;
	});
}
var ME = (e, t) => e && t && t[e] ? t[e] : e, NE = [
	"bg",
	"surface",
	"text",
	"accent",
	"accent-text"
], PE = /* @__PURE__ */ D(() => [
	{
		id: "well",
		name: K("themePreset.well.name"),
		note: K("themePreset.well.note"),
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
		name: K("themePreset.stone.name"),
		note: K("themePreset.stone.note"),
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
		name: K("themePreset.plum.name"),
		note: K("themePreset.plum.note"),
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
		name: K("themePreset.rose.name"),
		note: K("themePreset.rose.note"),
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
		name: K("themePreset.ocean.name"),
		note: K("themePreset.ocean.note"),
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
		name: K("themePreset.night.name"),
		note: K("themePreset.night.note"),
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
]);
function FE(e) {
	IT("theme", () => {
		let t = e.scheme === "dark", n = t ? e.dark : e.light, r = t ? e.light : e.dark;
		for (let e of NE) F(DT).theme.tokens.color[e] = n[e];
		t ? F(DT).theme.scheme = "dark" : delete F(DT).theme.scheme, F(DT).theme.alt = { tokens: { color: { ...r } } };
	});
}
var IE = /* @__PURE__ */ D(() => {
	if (!F(DT)) return null;
	let e = F(DT).theme.tokens.color, t = F(DT).theme.alt?.tokens?.color ?? {}, n = F(DT).theme.scheme === "dark";
	return F(PE).find((r) => {
		let i = n ? r.dark : r.light, a = n ? r.light : r.dark;
		return NE.every((n) => e[n] === i[n] && t[n] === a[n]);
	})?.id ?? null;
});
function LE() {
	Pn(() => {
		if (!F(zT)) return;
		let e = (e) => {
			e.target.closest?.(".page-menu-wrap") || k(zT, null);
		}, t = (e) => {
			e.key === "Escape" && k(zT, null);
		}, n = () => {
			k(zT, null);
		};
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t), window.addEventListener("blur", n), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t), window.removeEventListener("blur", n);
		};
	}), Pn(() => {
		OM.activePanel === "pages" && $.pageId && XT();
	}), Pn(() => {
		let e = F(lE);
		e && (k(lE, null), Dr().then(() => document.querySelector(`[data-cal-name="${e}"]`)?.focus()));
	}), Pn(() => {
		let e = F(pE);
		e && (k(pE, null), Dr().then(() => document.querySelector(`[data-link-label="${e}"]`)?.focus()));
	}), Pn(() => {
		if (!F(DT)?.site) return;
		let e = F(DT).site.icon, t = document.querySelector("link[rel=\"icon\"]");
		t && (typeof e != "string" || !e ? t.href = xE : SE.test(e) && (t.href = e));
	});
}
var Q = {
	BG_TYPES: xT,
	BG_DEFS: ST,
	get site() {
		return F(CT);
	},
	set site(e) {
		k(CT, e, !0);
	},
	get grid() {
		return F(wT);
	},
	set grid(e) {
		k(wT, e, !0);
	},
	get bindsFrom() {
		return F(TT);
	},
	set bindsFrom(e) {
		k(TT, e);
	},
	get siteStore() {
		return ET;
	},
	set siteStore(e) {
		ET = e;
	},
	get siteDraft() {
		return F(DT);
	},
	set siteDraft(e) {
		k(DT, e, !0);
	},
	linkSiteDraft: OT,
	pushSiteToPreview: kT,
	navBgMutate: AT,
	navBgCtx: jT,
	footerBgCtx: MT,
	get previewPalette() {
		return F(NT);
	},
	themeSwatches: PT,
	setGrid: FT,
	siteMutate: IT,
	get newPageTitle() {
		return F(LT);
	},
	set newPageTitle(e) {
		k(LT, e, !0);
	},
	get newPageTemplate() {
		return F(RT);
	},
	set newPageTemplate(e) {
		k(RT, e, !0);
	},
	get pageMenuFor() {
		return F(zT);
	},
	set pageMenuFor(e) {
		k(zT, e, !0);
	},
	RESERVED_SLUGS: BT,
	pageSlugError: VT,
	addPage: HT,
	savePageAsTemplate: UT,
	renamePage: WT,
	get seoDraft() {
		return F(GT);
	},
	set seoDraft(e) {
		k(GT, e, !0);
	},
	readSeoDraft: KT,
	setPageSeo: qT,
	setPageNoindex: JT,
	get missingSeo() {
		return F(YT);
	},
	set missingSeo(e) {
		k(YT, e, !0);
	},
	refreshMissingSeo: XT,
	uploadOgImage: ZT,
	setPageSlug: QT,
	deletePage: $T,
	get iconEditorImage() {
		return F(eE);
	},
	set iconEditorImage(e) {
		k(eE, e, !0);
	},
	applyIcon: tE,
	setAnalyticsToken: nE,
	get layoutWidth() {
		return F(rE);
	},
	set layoutWidth(e) {
		k(rE, e);
	},
	get layoutGutter() {
		return F(iE);
	},
	set layoutGutter(e) {
		k(iE, e);
	},
	siteLangValue: aE,
	siteLangOptions: oE,
	get siteCalendarsOpen() {
		return F(sE);
	},
	set siteCalendarsOpen(e) {
		k(sE, e, !0);
	},
	get openSiteCalendar() {
		return F(cE);
	},
	set openSiteCalendar(e) {
		k(cE, e, !0);
	},
	get focusSiteCalendar() {
		return F(lE);
	},
	set focusSiteCalendar(e) {
		k(lE, e, !0);
	},
	siteLinks: fE,
	addSiteLink: hE,
	removeSiteLink: gE,
	moveSiteLink: _E,
	setSiteLink: vE,
	get focusSiteLink() {
		return F(pE);
	},
	set focusSiteLink(e) {
		k(pE, e, !0);
	},
	get siteLinksOpen() {
		return F(mE);
	},
	set siteLinksOpen(e) {
		k(mE, e, !0);
	},
	siteCalendars: uE,
	siteCalendarById: dE,
	addSiteCalendar: yE,
	get siteZoneBad() {
		return F(bE);
	},
	set siteZoneBad(e) {
		k(bE, e, !0);
	},
	URD_MARK_ICON: xE,
	SAFE_ICON_RE: SE,
	clearLauncherImage: CE,
	footerMutate: wE,
	moveNavItemTo: TE,
	moveNavChildTo: EE,
	invertLightness: DE,
	suggestAltColors: OE,
	createAltTheme: kE,
	reSuggestAltTheme: AE,
	removeAltTheme: jE,
	themeHex: ME,
	THEME_PRESET_KEYS: NE,
	get THEME_PRESETS() {
		return F(PE);
	},
	applyThemePreset: FE,
	get activeThemePreset() {
		return F(IE);
	},
	effects: LE
}, RE = /* @__PURE__ */ D(() => ({
	text: K("blocks.text"),
	button: K("blocks.button"),
	image: K("blocks.image"),
	shape: K("blocks.shape"),
	video: K("blocks.video"),
	icon: K("blocks.icon"),
	gallery: K("blocks.gallery"),
	faq: K("blocks.faq"),
	collection: K("blocks.collection"),
	timeline: K("blocks.timeline"),
	quote: K("blocks.quote"),
	stats: K("blocks.stats"),
	ribbon: K("blocks.ribbon"),
	table: K("blocks.table"),
	share: K("blocks.share"),
	countdown: K("blocks.countdown"),
	audio: K("blocks.audio"),
	product: K("blocks.product"),
	cart: K("blocks.cart"),
	checkout: K("blocks.checkout"),
	map: K("blocks.map"),
	form: K("blocks.form"),
	calendar: K("blocks.calendar")
})), zE = /* @__PURE__ */ D(() => ({
	text: {
		type: "text",
		props: {
			html: K("seed.text"),
			align: "left"
		},
		w: 33,
		h: 28
	},
	"text-box": {
		type: "text",
		props: {
			html: K("seed.textBox"),
			align: "left",
			box: !0
		},
		w: 30,
		h: 150
	},
	button: {
		type: "button",
		props: {
			label: K("seed.newButton"),
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
			zoom: 15
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
			submitLabel: K("form.sendDefault"),
			successText: K("form.thanksDefault"),
			fields: $o()
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
			showCategories: !1,
			showSubscribe: !1,
			showSignup: !1
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
			showCategories: !1,
			showSubscribe: !1,
			showSignup: !1
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
			showCategories: !1,
			showSubscribe: !1,
			showSignup: !1
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
			nextCount: 3,
			laterCount: 3,
			showCategories: !1,
			showSubscribe: !1,
			showSignup: !1
		},
		w: 40,
		h: 180
	},
	"calendar-agenda": {
		type: "calendar",
		props: {
			sources: [],
			view: "agenda",
			limit: 8,
			showCategories: !1,
			showSubscribe: !1,
			showSignup: !1
		},
		w: 60,
		h: 360
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
		w: 88.89,
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
			interval: 5,
			width: "canvas"
		},
		w: 88.89,
		h: 320
	},
	faq: {
		type: "faq",
		props: {
			items: [
				{
					q: K("seed.faq.q1"),
					a: K("seed.faq.answer")
				},
				{
					q: K("seed.faq.q2"),
					a: K("seed.faq.answer")
				},
				{
					q: K("seed.faq.q3"),
					a: K("seed.faq.answer")
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
					title: K("seed.timeline.t1"),
					text: K("seed.timeline.text")
				},
				{
					year: "2022",
					title: K("seed.timeline.t2"),
					text: K("seed.timeline.text")
				},
				{
					year: "2026",
					title: K("seed.timeline.t3"),
					text: K("seed.timeline.text")
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
			text: K("seed.quoteBlock.text"),
			attribution: K("seed.quoteBlock.name"),
			role: K("seed.quoteBlock.role"),
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
			label: K("seed.statsBlock.label"),
			countUp: !0
		},
		w: 20,
		h: 90
	},
	ribbon: {
		type: "ribbon",
		props: {
			items: [
				K("seed.ribbonBlock.a"),
				K("seed.ribbonBlock.b"),
				K("seed.ribbonBlock.c")
			],
			sep: "dot",
			speed: 60,
			direction: "left",
			pauseOnHover: !0,
			width: "canvas",
			variant: "band",
			size: "md",
			caps: !1,
			tilt: 0,
			fade: !0,
			gap: 40
		},
		w: 88.89,
		h: 70
	},
	table: {
		type: "table",
		props: {
			header: !0,
			striped: !1,
			lines: "rows",
			rows: [
				[
					K("seed.table.h1"),
					K("seed.table.h2"),
					K("seed.table.h3")
				],
				[
					K("seed.table.r1c1"),
					K("seed.table.r1c2"),
					""
				],
				[
					K("seed.table.r2c1"),
					K("seed.table.r2c2"),
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
			doneText: K("seed.countdown.done"),
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
		w: 88.89,
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
}));
function BE(e) {
	let t = F(zE)[e];
	return t ? {
		id: es("blk"),
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
function VE(e) {
	XD.bridge ? XD.bridge.sendPlaceBlock(e) : HE($.targetSection()?.id, e);
}
function HE(e, t) {
	let n = $.store.data.sections.find((t) => t.id === e) ?? $.store.data.sections[0];
	if (!n) return;
	DA.pushHistory("add-block");
	let r = Math.max(0, ...n.blocks.map((e) => e.frames?.desktop?.z ?? 1)) + 1;
	t.frames?.desktop && (t.frames.desktop = {
		...t.frames.desktop,
		z: r
	}), n.blocks.push(t), $.markDesktopChange(n, "block-added"), $.store.save(), DA.updateDirty(), XD.bridge?.sendSection($.pageId, n), $.fitBlockSoon(n.id, t);
}
function UE(e, t, n, r) {
	let i = $.store.data.sections.find((t) => t.id === e);
	if (!i || !t?.length) return;
	DA.pushHistory("add-blocks");
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
	}), $.markDesktopChange(i, "block-added"), $.store.save(), DA.updateDirty(), XD.bridge?.sendSection($.pageId, i);
}
var WE = {
	list: "calendar",
	cards: "calendar-cards",
	month: "calendar-month",
	next: "calendar-next",
	agenda: "calendar-agenda",
	week: "calendar-month",
	day: "calendar",
	year: "calendar-month"
};
function GE(e) {
	let t = wh(e), n = BE(WE[t.view] ?? "calendar");
	n && (n.props = {
		...n.props,
		...t.view ? { view: t.view } : {},
		...t.id === "plain" ? {} : { design: t.id },
		...t.view === "next" ? {
			nextCount: 3,
			laterCount: 3
		} : {}
	}, VE(n));
}
function KE(e) {
	let t = BE(e.kind);
	if (t) {
		if (e.at && typeof e.at.x == "number" && typeof e.at.y == "number") {
			let n = $.store.data.sections.find((t) => t.id === e.sectionId)?.grid ?? Q.siteDraft.grid, r = Vw({
				x: e.at.x,
				y: e.at.y,
				w: t.frames.desktop.w,
				h: t.frames.desktop.h,
				grid: n
			});
			t.frames.desktop.x = r.x, t.frames.desktop.y = r.y;
		} else t.frames.desktop.x = Math.round((100 - t.frames.desktop.w) / 2 * 100) / 100, t.frames.desktop.y = 40;
		HE(e.sectionId, t), XD.bridge?.sendSelect(t.id), e.kind === "image" && OM.setStatus(K("status.imageBlockAdded")), e.kind === "gallery" && OM.setStatus(K("status.galleryBlockAdded"));
	}
}
var qE = {
	get BLOCK_LABELS() {
		return F(RE);
	},
	get BLOCK_DEFAULTS() {
		return F(zE);
	},
	buildBlock: BE,
	requestPlacement: VE,
	insertBlock: HE,
	insertBlocks: UE,
	CAL_KIND_BY_VIEW: WE,
	addCalendarDesign: GE,
	handleRequestBlock: KE
};
//#endregion
//#region src/state/bridge.svelte.js
function JE(e) {
	let { section: t, block: n } = $.readBlock(e.sectionId, e.blockId);
	t && n?.sticky && Ig.some(([t]) => t === e.dock) && (DA.pushHistory(`sticky-dock:${e.blockId}`), n.sticky = {
		...n.sticky,
		dock: e.dock
	}, $.store.save(), DA.updateDirty(), XD.bridge?.sendSection($.pageId, t), $.syncSelectedBlock());
}
function YE(e) {
	let t = e.blockIds ?? [], { section: n } = $.readBlock(e.sectionId, t[0]);
	if (!n || !t.length) return;
	DA.pushHistory(`sticky-group:${e.sectionId}`);
	let r = e.on ? es("stk") : null;
	for (let e of n.blocks) t.includes(e.id) && (e.sticky = r ? {
		offset: 16,
		until: null,
		...e.sticky,
		group: r
	} : null);
	$.markDesktopChange(n, "block-edited"), $.store.save(), DA.updateDirty(), XD.bridge?.sendSection($.pageId, n), $.syncSelectedBlock(), OM.setStatus(K(e.on ? "status.stickyGrouped" : "status.stickyUngrouped"));
}
function XE(e) {
	let t = $.store.data.sections.find((t) => t.id === e.sectionId), n = t?.blocks.find((t) => t.id === e.blockId);
	n && (DA.pushHistory(`edit:${e.blockId}`), n.props = e.props, $.store.save(), DA.updateDirty(), $.selectedBlock?.blockId === e.blockId && $.syncSelectedBlock(), e.rerender && XD.bridge?.sendSection($.pageId, t), OM.status = "", $.fitBlockSoon(t.id, n));
}
function ZE(e) {
	let t = $.store.data.sections.find((t) => t.id === e.sectionId), n = t?.blocks.find((t) => t.id === e.blockId);
	if (!n) return;
	DA.pushHistory(e.coalesce ? `edit:${e.groupKey ?? e.blockId}` : "move-block");
	let r = e.frameKey === "mobile" ? "mobile" : "desktop", i = n.frames.desktop?.w;
	n.frames[r] = e.frame, r === "desktop" && $.markDesktopChange(t, "desktop-changed-after-mobile"), $.store.save(), DA.updateDirty(), $.selectedBlock?.blockId === e.blockId && $.syncSelectedBlock(), r === "desktop" && e.frame?.w !== i ? $.fitBlockSoon(t.id, n) : r === "mobile" && $.phoneFitSoon(t.id, n);
}
function QE(e) {
	let t = $.store.data.sections.find((t) => t.id === e.sectionId), n = t?.blocks.find((t) => t.id === e.blockId);
	n?.frames?.desktop && n.frames.desktop.h !== e.h && (e.fit ? XD.viewMode === "desktop" && e.seq === $.fitSeq.get(e.blockId) && $E(t, n, e.h) : ($.store.amendBaseline((t) => {
		let n = t.sections.find((t) => t.id === e.sectionId)?.blocks.find((t) => t.id === e.blockId);
		n?.frames?.desktop && (n.frames.desktop.h = e.h);
	}), $.store.hasDraft() && DA.pushHistory(`edit:${e.blockId}`), n.frames.desktop.h = e.h, $.store.save(), DA.updateDirty(), $.selectedBlock?.blockId === e.blockId && $.syncSelectedBlock()));
}
function $E(e, t, n) {
	let r = pc(e.blocks, t.id, n), i = {};
	t.frames.desktop = {
		...t.frames.desktop,
		h: n
	}, i[t.id] = t.frames.desktop;
	for (let [t, n] of r) {
		let r = e.blocks.find((e) => e.id === t);
		r?.frames?.desktop && (r.frames.desktop = {
			...r.frames.desktop,
			y: n
		}, i[t] = r.frames.desktop);
	}
	$.markDesktopChange(e, "block-edited"), $.store.save(), DA.updateDirty(), $.selectedBlock?.blockId === t.id && $.syncSelectedBlock(), XD.bridge?.sendFrames(e.id, Ze(i));
}
function eD(e) {
	let t = $.store.data.sections.find((t) => t.id === e.sectionId);
	if (t) {
		if (DA.pushHistory("mobile-reset"), e.blockId) {
			let n = t.blocks.find((t) => t.id === e.blockId);
			n && (n.frames.mobile = null);
		} else for (let e of t.blocks) e.frames.mobile = null;
		!$.hasMobileOverrides(t) && t.responsive?.mobile && (t.responsive.mobile.attention = null), $.store.save(), DA.updateDirty(), OM.updateAttention(), XD.bridge?.sendSection($.pageId, t);
	}
}
function tD(e) {
	let t = $.store.data.sections.find((t) => t.id === e.sectionId), n = t?.blocks.find((t) => t.id === e.blockId);
	n && typeof e.mobileOrder == "number" && (DA.pushHistory("mobile-order"), n.mobileOrder = e.mobileOrder, $.store.save(), DA.updateDirty(), XD.bridge?.sendSection($.pageId, t));
}
function nD(e) {
	let t = $.store.data.sections.find((t) => t.id === e.sectionId);
	t?.responsive?.mobile && (DA.pushHistory("review-done"), t.responsive.mobile.attention = null, $.store.save(), DA.updateDirty(), OM.updateAttention());
}
var rD = [
	"animation",
	"hover",
	"size",
	"sizeMin",
	"sizeMax",
	"height",
	"fit",
	"fitMin"
];
function iD(e) {
	let t = $.store.data.sections.find((t) => t.id === e.sectionId), n = t?.blocks.find((t) => t.id === e.blockId);
	if (n && e.fields && typeof e.fields == "object") {
		DA.pushHistory("block-style");
		for (let t of rD) t in e.fields && (e.fields[t] === null || e.fields[t] === void 0 ? delete n[t] : n[t] = structuredClone(e.fields[t]));
		$.store.save(), DA.updateDirty(), XD.bridge?.sendSection($.pageId, t), $.selectedBlock?.blockId === e.blockId && $.syncSelectedBlock();
	}
}
function aD(e) {
	let t = $.store.data.sections.find((t) => t.id === e.sectionId), n = t?.blocks.find((t) => t.id === e.blockId);
	n && (DA.pushHistory("block-flag"), typeof e.decor == "boolean" && (n.decor = e.decor), typeof e.hideMobile == "boolean" && (n.hideMobile = e.hideMobile), $.store.save(), DA.updateDirty(), typeof e.hideMobile == "boolean" && XD.viewMode === "mobile" && XD.bridge?.sendSection($.pageId, t), $.selectedBlock?.blockId === e.blockId && $.syncSelectedBlock());
}
function oD(e) {
	DA.pushHistory("add-section"), e.section.id || (e.section.id = es("sec")), $.store.data.sections.splice(e.index, 0, e.section), $.store.save(), DA.updateDirty(), XD.bridge?.sendPage($.pageId, $.store.data), $.activeSectionId = e.section.id, $.syncSectionMirrors(e.section), OM.activePanel = "properties";
}
function sD(e) {
	let t = $.store.data.sections, n = t.findIndex((t) => t.id === e.sectionId), r = n + e.dir;
	n < 0 || r < 0 || r >= t.length || (DA.pushHistory("move-section"), [t[n], t[r]] = [t[r], t[n]], $.store.save(), DA.updateDirty(), XD.bridge?.sendPage($.pageId, $.store.data));
}
function cD(e) {
	DA.pushHistory("delete-section"), e.sectionId === $.activeSectionId && ($.activeSectionId = null, $.sectionGrid = null), $.selectedBlock?.sectionId === e.sectionId && ($.selectedBlock = null), $.store.data.sections = $.store.data.sections.filter((t) => t.id !== e.sectionId), $.store.save(), DA.updateDirty(), XD.bridge?.sendPage($.pageId, $.store.data);
}
function lD(e) {
	let t = $.store.data.sections.find((t) => t.id === e.sectionId);
	if (t) {
		DA.pushHistory("section-size"), t.size = {
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
		e.moves?.length && ($.markDesktopChange(t, "section-height"), $.selectedBlock?.sectionId === e.sectionId && $.syncSelectedBlock()), e.sectionId === $.activeSectionId && ($.sectionMinHeight = e.minHeight), $.store.save(), DA.updateDirty();
	}
}
function uD(e) {
	let t = $.store.data.sections.find((t) => t.id === e.fromSectionId), n = $.store.data.sections.find((t) => t.id === e.toSectionId), r = t?.blocks.find((t) => t.id === e.blockId);
	t && n && r && (DA.pushHistory(e.groupKey ? `edit:${e.groupKey}` : "move-block"), t.blocks = t.blocks.filter((t) => t.id !== e.blockId), r.frames.desktop = e.frame, r.frames.mobile = null, n.blocks.push(r), $.markDesktopChange(t, "block-moved"), $.markDesktopChange(n, "block-moved"), $.store.save(), DA.updateDirty(), OM.updateAttention(), XD.bridge?.sendSection($.pageId, t), XD.bridge?.sendSection($.pageId, n), $.selectedBlock?.blockId === e.blockId && ($.selectedBlock = {
		...$.selectedBlock,
		sectionId: e.toSectionId
	}, $.syncSelectedBlock()));
}
function dD(e) {
	let t = $.store.data.sections.find((t) => t.id === e.sectionId);
	if (!t) return;
	let n = e.blockIds ?? [e.blockId];
	DA.pushHistory("delete-block"), t.blocks = t.blocks.filter((e) => !n.includes(e.id)), n.includes($.selectedBlock?.blockId) && ($.selectedBlock = null), $.markDesktopChange(t, "block-deleted"), $.store.save(), DA.updateDirty(), XD.bridge?.sendSection($.pageId, t);
}
var fD = {
	handleStickyDock: JE,
	handleStickyGroup: YE,
	handleEdit: XE,
	handleMove: ZE,
	handleGrow: QE,
	applyFit: $E,
	handleMobileReset: eD,
	handleMobileOrder: tD,
	handleReviewDone: nD,
	handleBlockFlag: aD,
	handleBlockStyle: iD,
	handleAddSection: oD,
	handleMoveSection: sD,
	handleDeleteSection: cD,
	handleSectionSize: lD,
	handleMoveBlockSection: uD,
	handleDelete: dD
}, pD = /* @__PURE__ */ O(null), mD = /* @__PURE__ */ O(!0), hD = /* @__PURE__ */ O(mn(ow(typeof window < "u" ? window : null) ?? 1920)), gD = "urd-admin-screen";
function _D() {
	let e = null;
	try {
		e = JSON.parse(localStorage.getItem(gD) ?? "null");
	} catch {
		e = null;
	}
	return sw(e, F(hD));
}
var vD = /* @__PURE__ */ O(mn(_D()));
function yD(e) {
	k(vD, sw({
		...Ze(F(vD)),
		...e
	}, F(hD)), !0);
	try {
		localStorage.setItem(gD, JSON.stringify(F(vD)));
	} catch {}
}
var bD = /* @__PURE__ */ D(() => cw(F(vD), F(hD))), xD = [
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
], SD = /* @__PURE__ */ D(() => [{
	id: "desktop",
	width: F(bD).width,
	height: F(bD).height || null,
	viewport: "desktop"
}, ...xD]);
function CD(e) {
	let t = lp(Q.layoutWidth, Q.layoutGutter, e.width).width;
	return K(e.id === "desktop" ? F(vD).mode === "own" ? "tip.view.desktop" : e.height ? "tip.view.desktopSizeH" : "tip.view.desktopSize" : `tip.view.${e.id}`, {
		w: e.width,
		h: e.height ?? 0,
		c: t
	});
}
var wD = /* @__PURE__ */ O("desktop"), TD = /* @__PURE__ */ D(() => F(SD).find((e) => e.id === F(wD)) ?? F(SD)[0]), ED = /* @__PURE__ */ D(() => F(TD).viewport === "mobile" || F(TD).width <= (Q.siteDraft?.breakpoints?.mobile ?? 640) ? "mobile" : "desktop"), DD = /* @__PURE__ */ O(null), OD = /* @__PURE__ */ O(0), kD = /* @__PURE__ */ O(0), AD = /* @__PURE__ */ O("fit"), jD = /* @__PURE__ */ O(1), MD = /* @__PURE__ */ D(() => F(TD).width), ND = /* @__PURE__ */ D(() => F(TD).height ?? 0), PD = /* @__PURE__ */ D(() => F(AD) === "manual" ? F(jD) : zw(F(OD), F(MD), "fit", F(kD), F(ND)));
function FD(e) {
	k(jD, Math.min(400, Math.max(10, (Math.round(Math.round(F(PD) * 100) / 10) + e) * 10)) / 100), k(AD, "manual");
}
var ID = /* @__PURE__ */ D(() => F(ND) > 0 ? F(ND) : F(PD) > 0 ? F(kD) / F(PD) : F(kD)), LD = /* @__PURE__ */ D(() => F(MD) * F(PD)), RD = /* @__PURE__ */ D(() => F(ND) > 0 ? F(ND) * F(PD) : F(kD)), zD = /* @__PURE__ */ D(() => F(LD) > F(OD) + 1 || F(RD) > F(kD) + 1), BD = /* @__PURE__ */ O(null), VD = () => {
	let e = null;
	try {
		e = localStorage.getItem("urd-theme-mode");
	} catch {}
	return Os(Q.siteDraft?.theme?.scheme, e, window.matchMedia("(prefers-color-scheme: dark)").matches);
}, HD = /* @__PURE__ */ O("light");
function UD() {
	F(BD)?.destroy(), F(pD)?.contentDocument?.addEventListener("pointerdown", () => {
		$.blockMenu &&= null;
	}, !0), k(BD, Bw(F(pD), {
		onEdit: fD.handleEdit,
		onMove: fD.handleMove,
		onGrow: fD.handleGrow,
		onDelete: fD.handleDelete,
		onAddSection: fD.handleAddSection,
		onMoveSection: fD.handleMoveSection,
		onDeleteSection: fD.handleDeleteSection,
		onSectionSize: fD.handleSectionSize,
		onUndo: (e) => e.redo ? DA.redo() : DA.undo(),
		onSelectSection: $.onSelectSection,
		onSelectBlock: $.onSelectBlock,
		onBlockMenu: $.onBlockMenu,
		onMenuArea: $.onMenuArea,
		onReady: WD,
		onNavigate: GD,
		onAddBlock: (e) => qE.insertBlock(e.sectionId, e.block),
		onAddBlocks: (e) => qE.insertBlocks(e.sectionId, e.blocks, e.minBottom, e.moves),
		onRequestBlock: qE.handleRequestBlock,
		onMoveBlockSection: fD.handleMoveBlockSection,
		onMobileReset: fD.handleMobileReset,
		onMobileOrder: fD.handleMobileOrder,
		onReviewDone: fD.handleReviewDone,
		onBlockFlag: fD.handleBlockFlag,
		onBlockStyle: fD.handleBlockStyle,
		onCollectionEdit: YA.handleCollectionEdit,
		onCollectionAdd: YA.handleCollectionAdd,
		onSaveTemplate: bT.handleSaveTemplate,
		onStickyGroup: fD.handleStickyGroup,
		onStickyDock: fD.handleStickyDock,
		onDeleteTemplate: bT.handleDeleteTemplate,
		onApplyLayout: $.handleApplyLayout,
		onPluginBlocks: (e) => {
			_O.pluginBlocks = e.blocks ?? [];
		},
		onNavWidth: (e) => Q.siteMutate("edit:nav-width", () => {
			Q.siteDraft.nav.style ??= {}, Q.siteDraft.nav.style.width = e.width;
		})
	}));
}
async function WD() {
	await $.pageLoading, await _O.pluginsReady, F(BD)?.sendPlugins(Ze(_O.pluginsView)?.enabled ?? []), F(BD)?.sendViewport(F(ED)), F(BD)?.sendZoom(F(PD)), YA.pushCollectionsToPreview(), bT.pushTemplatesToPreview(), Q.siteStore.hasDraft() && Q.pushSiteToPreview();
	let e = !Q.site.pages.some((e) => e.id === $.pageId);
	($.store.hasDraft() || e) && F(BD)?.sendPage($.pageId, $.store.data), F(mD) || F(BD)?.sendChrome(!1), OM.gridOn && F(BD)?.sendShowGrid(!0), OM.guidesOn && F(BD)?.sendShowGuides(!0), OM.sendAdminTheme();
}
function GD(e) {
	let t = e.path.replace(/\/$/, "") || "/", n = Q.siteDraft.pages.find((e) => e.path === t);
	n && n.id !== $.pageId && $.selectPage(n.id);
}
function KD() {
	F(pD) && (F(pD).src = F(pD).src);
}
var qD = 0;
async function JD() {
	F(mD) && (qD = OM.panelEl?.scrollTop ?? 0), k(mD, !F(mD)), F(BD)?.sendChrome(F(mD)), F(mD) || ($.blockMenu = null), F(mD) && (await Dr(), requestAnimationFrame(() => {
		OM.panelEl && (OM.panelEl.scrollTop = qD);
	}));
}
function YD() {
	Pn(() => {
		let e = () => F(BD)?.sendCloseMenus();
		return document.addEventListener("pointerdown", e, !0), () => document.removeEventListener("pointerdown", e, !0);
	}), Pn(() => {
		let e = F(ED);
		F(BD)?.sendViewport(e);
	}), Pn(() => {
		let e = F(PD);
		F(BD)?.sendZoom(e);
	}), Pn(() => {
		let e = () => {
			k(hD, ow(window) ?? F(hD), !0);
		};
		return window.addEventListener("resize", e), () => window.removeEventListener("resize", e);
	}), Pn(() => {
		let e = F(DD);
		if (!e || typeof ResizeObserver > "u") return;
		let t = () => {
			k(OD, e.clientWidth, !0), k(kD, e.clientHeight, !0);
		};
		t();
		let n = new ResizeObserver(t);
		return n.observe(e), () => n.disconnect();
	}), Pn(() => {
		k(HD, VD(), !0);
		let e = window.matchMedia("(prefers-color-scheme: dark)"), t = (e) => {
			e instanceof StorageEvent && e.key && e.key !== "urd-theme-mode" || k(HD, VD(), !0);
		};
		return e.addEventListener("change", t), window.addEventListener("storage", t), () => {
			e.removeEventListener("change", t), window.removeEventListener("storage", t);
		};
	});
}
var XD = {
	get iframeEl() {
		return F(pD);
	},
	set iframeEl(e) {
		k(pD, e, !0);
	},
	get chromeVisible() {
		return F(mD);
	},
	set chromeVisible(e) {
		k(mD, e, !0);
	},
	get ownWidth() {
		return F(hD);
	},
	set ownWidth(e) {
		k(hD, e, !0);
	},
	SCREEN_PREF_KEY: gD,
	readScreenPref: _D,
	get screenPref() {
		return F(vD);
	},
	set screenPref(e) {
		k(vD, e, !0);
	},
	setScreenPref: yD,
	get screenTarget() {
		return F(bD);
	},
	set screenTarget(e) {
		k(bD, e);
	},
	FIXED_DEVICES: xD,
	get devices() {
		return F(SD);
	},
	set devices(e) {
		k(SD, e);
	},
	deviceTip: CD,
	get deviceId() {
		return F(wD);
	},
	set deviceId(e) {
		k(wD, e, !0);
	},
	get device() {
		return F(TD);
	},
	set device(e) {
		k(TD, e);
	},
	get viewMode() {
		return F(ED);
	},
	set viewMode(e) {
		k(ED, e);
	},
	get frameWrapEl() {
		return F(DD);
	},
	set frameWrapEl(e) {
		k(DD, e, !0);
	},
	get frameW() {
		return F(OD);
	},
	set frameW(e) {
		k(OD, e, !0);
	},
	get frameH() {
		return F(kD);
	},
	set frameH(e) {
		k(kD, e, !0);
	},
	get zoomMode() {
		return F(AD);
	},
	set zoomMode(e) {
		k(AD, e, !0);
	},
	get manualZoom() {
		return F(jD);
	},
	set manualZoom(e) {
		k(jD, e, !0);
	},
	get targetW() {
		return F(MD);
	},
	set targetW(e) {
		k(MD, e);
	},
	get targetH() {
		return F(ND);
	},
	set targetH(e) {
		k(ND, e);
	},
	get scale() {
		return F(PD);
	},
	set scale(e) {
		k(PD, e);
	},
	stepZoom: FD,
	get iframeH() {
		return F(ID);
	},
	set iframeH(e) {
		k(ID, e);
	},
	get stageW() {
		return F(LD);
	},
	set stageW(e) {
		k(LD, e);
	},
	get stageH() {
		return F(RD);
	},
	set stageH(e) {
		k(RD, e);
	},
	get canPan() {
		return F(zD);
	},
	set canPan(e) {
		k(zD, e);
	},
	get bridge() {
		return F(BD);
	},
	set bridge(e) {
		k(BD, e);
	},
	readPreviewMode: VD,
	get previewMode() {
		return F(HD);
	},
	set previewMode(e) {
		k(HD, e, !0);
	},
	onIframeLoad: UD,
	onReady: WD,
	onNavigate: GD,
	reloadPreview: KD,
	get panelScroll() {
		return qD;
	},
	set panelScroll(e) {
		qD = e;
	},
	toggleChrome: JD,
	effects: YD
}, ZD = null, QD, $D = new Promise((e) => {
	QD = e;
}), eO = /* @__PURE__ */ O(null), tO = /* @__PURE__ */ O(mn({})), nO = /* @__PURE__ */ O("0.0.0"), rO = /* @__PURE__ */ O(mn([])), iO = /* @__PURE__ */ O(mn([])), aO = /* @__PURE__ */ O("pending"), oO = () => [.../* @__PURE__ */ new Set([...F(eO)?.enabled ?? [], ...F(eO)?.disabled ?? []])];
function sO() {
	k(eO, JSON.parse(JSON.stringify(ZD.data)), !0);
}
var cO = /* @__PURE__ */ O(null);
async function lO() {
	try {
		let e = (await fetch("/urd.json", { cache: "no-store" })).headers.get("content-security-policy");
		if (!e) {
			k(cO, { unknown: !0 }, !0);
			return;
		}
		let t = (t) => new Set((e.split(";").map((e) => e.trim()).find((e) => e.startsWith(`${t} `)) ?? "").split(/\s+/).slice(1));
		k(cO, {
			frameSrc: t("frame-src"),
			connectSrc: t("connect-src"),
			scriptSrc: t("script-src")
		}, !0);
	} catch {
		k(cO, { unknown: !0 }, !0);
	}
}
async function uO() {
	lO();
	let e = {
		version: 1,
		enabled: []
	};
	try {
		e = await (await fetch("/plugins/plugins.json")).json();
	} catch {}
	k(iO, e.enabled ?? [], !0), ZD = ww("urd-draft-plugins", () => e, OM.draftSaveError), sO();
	try {
		k(nO, (await (await fetch("/urd.json")).json()).engine ?? "0.0.0", !0);
	} catch {}
	for (let e of oO()) pO(e);
	dO(), QD(), XD.bridge?.sendPlugins(Ze(F(eO))?.enabled ?? []);
}
async function dO() {
	try {
		let e = await fetch("/api/github/plugins");
		if (!e.ok) {
			fO();
			return;
		}
		let { plugins: t } = await e.json();
		localStorage.setItem("urd-plugins-found", JSON.stringify(t ?? [])), k(rO, (t ?? []).filter((e) => !oO().includes(e)), !0);
		for (let e of F(rO)) pO(e);
		k(aO, "ok");
	} catch {
		fO();
	}
}
function fO() {
	try {
		let e = JSON.parse(localStorage.getItem("urd-plugins-found") ?? "[]");
		if (Array.isArray(e) && e.length) {
			k(rO, e.filter((e) => !oO().includes(e)), !0);
			for (let e of F(rO)) pO(e);
			k(aO, "ok");
			return;
		}
	} catch {}
	k(aO, "unavailable");
}
async function pO(e) {
	try {
		let t = await (await fetch(`/plugins/${e}/plugin.json`)).json(), n = Lw(t);
		F(tO)[e] = {
			...t,
			errors: n,
			satisfied: n.length === 0 && Fw(F(nO), t.requiresEngine)
		};
	} catch {
		F(tO)[e] = {
			name: e,
			errors: [K("plugin.manifestNotFound", { id: e })],
			satisfied: !1
		};
	}
}
function mO(e, t) {
	DA.pushHistory("plugins");
	let n = ZD.data;
	n.enabled = (n.enabled ?? []).filter((t) => t !== e), n.disabled = (n.disabled ?? []).filter((t) => t !== e), t ? n.enabled.push(e) : n.disabled.push(e), ZD.save(), DA.updateDirty(), sO(), XD.reloadPreview();
}
function hO(e) {
	DA.pushHistory("plugins");
	let t = ZD.data;
	t.enabled = (t.enabled ?? []).filter((t) => t !== e), t.disabled = (t.disabled ?? []).filter((t) => t !== e), ZD.save(), DA.updateDirty(), sO(), XD.reloadPreview();
}
var gO = /* @__PURE__ */ O(mn([])), _O = {
	get pluginsStore() {
		return ZD;
	},
	set pluginsStore(e) {
		ZD = e;
	},
	get resolvePluginsReady() {
		return QD;
	},
	set resolvePluginsReady(e) {
		QD = e;
	},
	pluginsReady: $D,
	get pluginsView() {
		return F(eO);
	},
	set pluginsView(e) {
		k(eO, e, !0);
	},
	get pluginInfo() {
		return F(tO);
	},
	set pluginInfo(e) {
		k(tO, e, !0);
	},
	get pluginEngine() {
		return F(nO);
	},
	set pluginEngine(e) {
		k(nO, e, !0);
	},
	get pluginsFound() {
		return F(rO);
	},
	set pluginsFound(e) {
		k(rO, e, !0);
	},
	get publishedPluginIds() {
		return F(iO);
	},
	set publishedPluginIds(e) {
		k(iO, e, !0);
	},
	get pluginDiscovery() {
		return F(aO);
	},
	set pluginDiscovery(e) {
		k(aO, e, !0);
	},
	knownPlugins: oO,
	syncPluginsView: sO,
	get liveCsp() {
		return F(cO);
	},
	set liveCsp(e) {
		k(cO, e, !0);
	},
	loadLiveCsp: lO,
	initPlugins: uO,
	discoverPlugins: dO,
	useCachedDiscovery: fO,
	loadPluginInfo: pO,
	setPluginEnabled: mO,
	removePlugin: hO,
	get pluginBlocks() {
		return F(gO);
	},
	set pluginBlocks(e) {
		k(gO, e, !0);
	}
}, vO = /* @__PURE__ */ O(null);
function yO(e) {
	let t = SO.data.sections.find((t) => t.id === e.sectionId);
	if (t) {
		DA.pushHistory("layout");
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
		}, xO(t, "layout-changed"), e.sectionId === F(Ok) && k(Ak, e.minHeight, !0), F(TO)?.sectionId === e.sectionId && DO(), SO.save(), DA.updateDirty(), XD.bridge?.sendSection(F(vO), t);
	}
}
function bO(e) {
	return e?.blocks?.some((e) => e.frames?.mobile) ?? !1;
}
function xO(e, t) {
	e && bO(e) && (e.responsive?.mobile?.attention?.needed || (e.responsive = {
		...e.responsive ?? {},
		mobile: {
			...e.responsive?.mobile ?? { mode: "auto" },
			attention: {
				needed: !0,
				reason: t,
				since: (/* @__PURE__ */ new Date()).toISOString()
			}
		}
	}, OM.updateAttention(), XD.bridge?.sendAttention(e.id, !0)));
}
var SO = null, CO = /* @__PURE__ */ new Set(), wO = () => Q.siteDraft.pages.find((e) => e.id === F(vO)), TO = /* @__PURE__ */ O(null);
function EO(e, t) {
	let n = SO?.data.sections.find((t) => t.id === e);
	return {
		section: n,
		block: n?.blocks.find((e) => e.id === t)
	};
}
function DO() {
	if (!F(TO)) return;
	let { block: e } = EO(F(TO).sectionId, F(TO).blockId);
	e ? k(TO, {
		sectionId: F(TO).sectionId,
		blockId: F(TO).blockId,
		type: e.type,
		decor: !!e.decor,
		hideMobile: !!e.hideMobile,
		fit: e.fit === "shrink" || e.fit === "both" ? e.fit : void 0,
		fitMin: typeof e.fitMin == "number" ? e.fitMin : void 0,
		size: typeof e.size == "number" ? e.size : void 0,
		sizeMin: typeof e.sizeMin == "number" ? e.sizeMin : void 0,
		sizeMax: typeof e.sizeMax == "number" ? e.sizeMax : void 0,
		height: e.height ? JSON.parse(JSON.stringify(e.height)) : null,
		props: JSON.parse(JSON.stringify(e.props)),
		frame: { ...e.frames.desktop },
		mobileRow: Number.isFinite(e.frames.mobile?.row) ? e.frames.mobile.row : null,
		animation: e.animation ? JSON.parse(JSON.stringify(e.animation)) : null,
		hover: e.hover ? JSON.parse(JSON.stringify(e.hover)) : null,
		sticky: e.sticky ? JSON.parse(JSON.stringify(e.sticky)) : null
	}, !0) : k(TO, null);
}
function OO(e) {
	k(kO, null), e.blockId ? (k(TO, {
		sectionId: e.sectionId,
		blockId: e.blockId
	}, !0), e.sectionId && k(Ok, e.sectionId, !0), DO()) : k(TO, null);
}
var kO = /* @__PURE__ */ O(null);
function AO() {
	pg(XD.frameWrapEl?.getBoundingClientRect().left ?? 0);
}
var jO = /* @__PURE__ */ O(null), MO = null;
function NO(e) {
	F(TO) && (F(kO) || (OM.activePanel = "properties"), Dr().then(() => hg(e.area, document.querySelector(".block-menu") ?? document.querySelector(".panel-body"))));
}
var PO = null;
function FO(e) {
	OO(e), F(TO) && (PO = e.rect, k(kO, LO(e.rect), !0));
}
function IO() {
	return AO(), {
		w: Math.min(ug.wide && ug.room >= 740 ? 740 : 400, window.innerWidth - 16),
		h: Math.min(window.innerHeight * .72, 620)
	};
}
function LO(e) {
	let t = IO(), n = {
		w: window.innerWidth,
		h: window.innerHeight
	};
	if (ug.place) return Tw(ug.place, t, n, ug.min);
	let r = XD.iframeEl?.getBoundingClientRect();
	if (!r) return {
		left: ug.min,
		top: 8
	};
	let i = XD.scale, { left: a, top: o } = Dw({
		left: r.left + i * e.left,
		top: r.top + i * e.top,
		right: r.left + i * e.right,
		bottom: r.top + i * e.bottom
	}, t, n, { min: ug.min });
	return {
		left: a,
		top: o
	};
}
function RO(e, t = IO()) {
	let n = Tw(e, t, {
		w: window.innerWidth,
		h: window.innerHeight
	}, ug.min);
	ug.place = n, k(kO, n, !0);
}
function zO() {
	ug.place = null, PO && k(kO, LO(PO), !0);
}
function BO(e, t) {
	let { section: n, block: r } = EO(F(TO)?.sectionId, F(TO)?.blockId);
	r && (e && DA.pushHistory(e), t(r, n), xO(n, "block-edited"), SO.save(), DA.updateDirty(), XD.bridge?.sendSection(F(vO), n), DO(), tk(n.id, r));
}
function VO(e, t) {
	BO(`edit:${F(TO).blockId}:${e}`, (n) => {
		n.props[e] = t;
	});
}
function HO(e, t) {
	BO(`edit:${F(TO).blockId}:${e}`, (e) => {
		Object.assign(e.props, t);
	});
}
function UO(e, t) {
	let n = F(TO).props;
	return Object.entries(t).some(([e, t]) => n[e] !== void 0 && JSON.stringify(n[e]) !== JSON.stringify(t)) ? () => HO(e, { ...t }) : null;
}
function WO(e) {
	let t = F(TO).props;
	return Object.entries(e).filter(([e, n]) => t[e] !== void 0 && JSON.stringify(t[e]) !== JSON.stringify(n)).length;
}
var GO = () => [["on", K("common.on")], ["off", K("common.off")]], KO = () => [
	["canvas", K("opt.ribbonWidth.content")],
	["page", K("opt.ribbonWidth.page")],
	["content", K("opt.ribbonWidth.own")]
], qO = (e) => e === "canvas" || e === "page" ? e : "content", JO = () => [
	["roll", K("opt.ribbonMotion.roll")],
	["sway", K("opt.ribbonMotion.sway")],
	["step", K("opt.ribbonMotion.step")],
	["none", K("opt.ribbonMotion.none")]
];
function YO() {
	return [...Q.siteDraft.pages.map((e) => [e.id, e.title]), ["__href", K("opt.externalLink")]];
}
function XO(e) {
	let t = e === "__href" ? null : e;
	BO(`edit:${F(TO).blockId}`, (e) => {
		e.props.page = t, t && (e.props.href = null);
	});
}
function ZO() {
	XD.bridge?.sendOpenImageEditor(F(TO).blockId), k(kO, null);
}
var QO = /* @__PURE__ */ new Map(), $O = /* @__PURE__ */ new Map(), ek = 0;
function tk(e, t) {
	if (ak(e, t), XD.viewMode !== "desktop" || !ec(t)) return;
	clearTimeout(QO.get(t.id));
	let n = ++ek;
	$O.set(t.id, n), QO.set(t.id, setTimeout(() => XD.bridge?.sendFitBlock(e, t.id, n), 60));
}
var nk = /* @__PURE__ */ new Map(), rk = null, ik = "";
function ak(e, t) {
	if (!tc.has(t.type) || !ec(t)) return;
	rk ??= kw({
		title: () => K("canvas.phoneMeasure"),
		prepare: (e, t) => {
			let n = Ze(_O.pluginsView)?.enabled ?? [], r = JSON.stringify(n);
			(t || r !== ik) && e({
				type: "urd-plugins",
				enabled: n
			}), ik = r, e({
				type: "urd-site",
				site: Ze(Q.siteDraft)
			}), e({
				type: "urd-collections",
				collections: Ze(YA.collectionsView) ?? {}
			});
		},
		onHeight: ok
	});
	let n = ++ek;
	nk.set(t.id, n), rk.request(F(vO), Ze(SO.data), e, t.id, n);
}
function ok(e, t, n, r) {
	if (e !== F(vO) || r !== nk.get(t)) return;
	let i = SO.data.sections.flatMap((e) => e.blocks).find((e) => e.id === t), a = Math.round(n);
	i && a > 0 && i.mobileHeight !== a && (i.mobileHeight = a, SO.save(), DA.updateDirty());
}
function sk() {
	for (let e of QO.values()) clearTimeout(e);
	QO.clear(), $O.clear(), nk.clear(), rk?.cancel();
}
function ck(e) {
	let t = wh(e), n = t.view === "next" ? {
		nextCount: F(TO).props.nextCount ?? 3,
		laterCount: F(TO).props.laterCount ?? 3
	} : {}, r = t.id === "plain" && ![
		"list",
		"cards",
		"month",
		"agenda",
		"next"
	].includes(Th(F(TO).props)) ? { view: "list" } : {};
	HO("design", {
		design: t.id === "plain" ? void 0 : t.id,
		...t.view ? { view: t.view } : {},
		...r,
		...n
	});
}
function lk(e) {
	HO("phoneView", {
		phoneView: e === th({
			...F(TO).props,
			phoneView: void 0,
			phoneDesign: void 0
		}) ? void 0 : e,
		phoneDesign: void 0
	});
}
function uk(e) {
	VO("card", e === ch({
		...F(TO).props,
		card: void 0
	}) ? void 0 : e);
}
function dk(e) {
	BO(`edit:${F(TO).blockId}:fit`, (t) => {
		e === "shrink" || e === "both" ? (t.fit = e, t.fitMin ??= .6) : (delete t.fit, delete t.fitMin);
	});
}
function fk(e) {
	BO(`edit:${F(TO).blockId}:fitMin`, (t) => {
		t.fitMin = e;
	});
}
var pk = null;
function mk(e, t) {
	return {
		blockId: e.id,
		size: cc(e),
		frame: { ...e.frames.desktop },
		ys: new Map(t.blocks.filter((e) => e.frames?.desktop).map((e) => [e.id, e.frames.desktop.y]))
	};
}
function hk(e, t, n, r) {
	r === 1 ? (delete e.size, delete e.sizeMin, delete e.sizeMax) : e.size = r;
	for (let r of t.blocks) r.id !== e.id && r.frames?.desktop && n.ys.has(r.id) && (r.frames.desktop = {
		...r.frames.desktop,
		y: n.ys.get(r.id)
	});
	e.frames.desktop = { ...n.frame };
	let i = cc(e) / n.size;
	if (i === 1) return;
	let a = {
		...n.frame,
		w: Math.min(Math.round(n.frame.w * i * 100) / 100, Math.round((100 - n.frame.x) * 100) / 100)
	};
	if (!ec(e)) {
		a.h = Math.max(1, Math.round(n.frame.h * i));
		for (let [n, r] of pc(t.blocks, e.id, a.h)) {
			let e = t.blocks.find((e) => e.id === n);
			e?.frames?.desktop && (e.frames.desktop = {
				...e.frames.desktop,
				y: r
			});
		}
	}
	e.frames.desktop = a;
}
function gk(e) {
	BO(`edit:${F(TO).blockId}:size`, (t, n) => {
		pk?.blockId !== t.id && (pk = mk(t, n));
		let { min: r, max: i } = uc(t);
		hk(t, n, pk, Math.round(Math.min(i, Math.max(r, e)) * 100) / 100);
	});
}
function _k(e, t) {
	pk = null, BO(`edit:${F(TO).blockId}:${e}`, (n, r) => {
		let i = mk(n, r);
		i.size !== 1 && (n.size = i.size);
		let a = Math.round(Number(t));
		Number.isFinite(a) && a > 0 ? n[e] = Math.min(oc.max, Math.max(oc.min, a)) : delete n[e];
		let o = cc(n);
		o !== i.size && hk(n, r, i, o);
	});
}
function vk(e) {
	BO(`edit:${F(TO).blockId}:height`, (t) => {
		e === "own" ? t.height = { mode: "own" } : delete t.height;
	});
}
function yk(e) {
	BO(`edit:${F(TO).blockId}:heightAlign`, (t) => {
		t.height = { mode: "own" }, e !== "top" && (t.height.align = e);
	});
}
function bk() {
	let e = F(TO);
	if (nc.has(e.type)) return !0;
	if (e.type !== "calendar") return !1;
	let t = wh(e.props.design);
	return !t.module && ["list", "cards"].includes(t.view);
}
function xk(e, t) {
	Number.isFinite(t) && BO(`edit:frame-${F(TO).blockId}:${e}`, (n) => {
		n.frames.desktop = {
			...n.frames.desktop,
			[e]: t
		};
	});
}
function Sk() {
	let e = SO.data.sections.find((e) => e.id === F(TO)?.sectionId)?.size?.maxWidth, t = typeof Q.layoutWidth == "number" ? Q.layoutWidth : 0;
	return e === "full" ? 0 : e ? /^\d+(\.\d+)?px$/.test(e) ? Math.min(parseFloat(e), t || Infinity) : 0 : t;
}
function Ck(e) {
	return Math.round(e / 100 * Sk());
}
function wk(e, t) {
	let n = Sk();
	if (!Number.isFinite(e) || e < 4 || !(n > 0)) return;
	let { x: r, w: i, h: a } = F(TO).frame, o = Math.max(.5, Math.min(Math.round(e / n * 200) / 2, Math.round((100 - r) * 2) / 2)), s = t ? Math.max(1, Math.round(o / i * a)) : a;
	Number.isFinite(o) && Number.isFinite(s) && BO(`edit:frame-${F(TO).blockId}:size`, (e) => {
		e.frames.desktop = {
			...e.frames.desktop,
			w: o,
			h: s
		};
	});
}
function Tk(e) {
	BO(`edit:${F(TO).blockId}:boxStyle`, (t) => {
		let n = {
			...t.props.boxStyle ?? {},
			...e
		};
		for (let e of Object.keys(n)) n[e] ?? delete n[e];
		Object.keys(n).length ? t.props.boxStyle = n : delete t.props.boxStyle;
	});
}
function Ek(e) {
	BO("decor", (t) => {
		t.decor = e;
	});
}
function Dk(e) {
	let { section: t, block: n } = EO(F(TO)?.sectionId, F(TO)?.blockId);
	n && (DA.pushHistory("hide-mobile"), n.hideMobile = e, SO.save(), DA.updateDirty(), XD.bridge?.sendSection(F(vO), t), DO());
}
var Ok = /* @__PURE__ */ O(null), kk = /* @__PURE__ */ O(null), Ak = /* @__PURE__ */ O(""), jk = /* @__PURE__ */ O(mn([])), Mk = /* @__PURE__ */ O(null), Nk = /* @__PURE__ */ O(null), Pk = /* @__PURE__ */ O(""), Fk = /* @__PURE__ */ O(mn({}));
function Ik(e) {
	k(kk, e?.grid ? { ...e.grid } : null, !0), k(Ak, e?.size?.minHeight ?? "", !0), k(jk, JSON.parse(JSON.stringify(e?.background?.layers ?? [])), !0), k(Mk, e?.animation ? JSON.parse(JSON.stringify(e.animation)) : null, !0), k(Nk, e?.hover ? JSON.parse(JSON.stringify(e.hover)) : null, !0), k(Pk, e?.theme ?? "", !0), k(Fk, e?.divider ? JSON.parse(JSON.stringify(e.divider)) : {}, !0);
}
var Lk = /* @__PURE__ */ O(null);
function Rk() {
	try {
		let e = ((XD.iframeEl?.contentDocument)?.querySelector(`.urd-section[data-section-id="${F(Ok)}"]`))?.getBoundingClientRect();
		k(Lk, e && e.width ? {
			w: e.width,
			h: e.height
		} : null, !0);
	} catch {
		k(Lk, null);
	}
}
function zk(e) {
	k(Ok, e.sectionId, !0), Ik(SO?.data.sections.find((t) => t.id === e.sectionId)), e.open && (OM.activePanel = "properties");
}
function Bk(e, t) {
	let n = SO.data.sections.find((e) => e.id === F(Ok));
	n && (DA.pushHistory(e), t(n), SO.save(), DA.updateDirty(), XD.bridge?.sendSection(F(vO), n), Ik(n));
}
function Vk(e) {
	let t = e.target.files?.[0];
	e.target.value = "", t && LM.readVideoFile(t, "status.videoFileFormat", (e) => VO("src", e));
}
async function Hk(e) {
	let t = e.target.files?.[0];
	if (e.target.value = "", t) try {
		VO("poster", (await LM.compressOrTrim(t)).dataUrl);
	} catch (e) {
		OM.setStatus(LM.imageErrorText(e), "error");
	}
}
var Uk = /* @__PURE__ */ D(() => ({
	mutate: Bk,
	keyPrefix: "bg",
	keyId: F(Ok)
}));
function Wk(e) {
	return {
		type: e,
		version: Mw[e].version,
		props: Mw[e].defaults()
	};
}
var Gk = (e) => !!(e && Mw[e.type]?.entrance), Kk = /* @__PURE__ */ D(() => [["", K("common.none")], ...Object.entries(Mw).filter(([, e]) => e.entrance).map(([e, t]) => [e, t.labelKey ? K(t.labelKey) : t.label])]), qk = /* @__PURE__ */ D(() => F(Kk).filter(([e]) => !Mw[e]?.group)), Jk = /* @__PURE__ */ D(() => [["", K("common.none")], ...Object.entries(Mw).filter(([, e]) => !e.entrance).map(([e, t]) => [e, t.labelKey ? K(t.labelKey) : t.label])]);
function Yk(e) {
	e.animation && !Gk(e.animation) && (e.hover ??= e.animation, e.animation = null);
}
function Xk(e) {
	BO(`edit:anim-${F(TO).blockId}`, (t) => {
		Yk(t), t.animation = e ? Wk(e) : null;
	}), F(TO) && XD.bridge?.sendDemoAnim(F(TO).sectionId, F(TO).blockId);
}
function Zk(e) {
	BO(`edit:hover-${F(TO).blockId}`, (t) => {
		Yk(t), t.hover = e ? Wk(e) : null;
	});
}
function Qk(e, t) {
	Number.isFinite(t) && (BO(`edit:anim-${F(TO).blockId}:${e}`, (n) => {
		n.animation && (n.animation.props[e] = t);
	}), F(TO) && XD.bridge?.sendDemoAnim(F(TO).sectionId, F(TO).blockId));
}
function $k(e) {
	let t = SO.data.sections.find((e) => e.id === F(Ok));
	if (!t) return;
	let n = e.trim();
	if (!n) return;
	let r = /^\d+$/.test(n) ? `${n}px` : n;
	DA.pushHistory("section-size"), t.size = {
		...t.size,
		minHeight: r
	}, k(Ak, r, !0), SO.save(), DA.updateDirty(), XD.bridge?.sendSection(F(vO), t);
}
function eA() {
	return SO.data.sections.find((e) => e.id === F(Ok)) ?? SO.data.sections[0];
}
function tA(e) {
	let t = SO.data.sections.find((e) => e.id === F(Ok));
	t && (DA.pushHistory("grid:section"), t.grid = e ? { ...Q.siteStore.data.grid } : null, k(kk, t.grid ? { ...t.grid } : null, !0), SO.save(), DA.updateDirty(), XD.bridge?.sendSection(F(vO), t), OM.gridOn && XD.bridge?.sendShowGrid(!0));
}
function nA(e, t) {
	let n = SO.data.sections.find((e) => e.id === F(Ok));
	n?.grid && (DA.pushHistory("grid:section"), n.grid = {
		...n.grid,
		[e]: t
	}, k(kk, { ...n.grid }, !0), SO.save(), DA.updateDirty(), XD.bridge?.sendSection(F(vO), n), OM.gridOn && XD.bridge?.sendShowGrid(!0));
}
var rA = null;
function iA(e) {
	return {
		schemaVersion: 7,
		meta: {
			id: e.id,
			title: e.title
		},
		sections: [{
			id: es("sec"),
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
async function aA(e, { keepHistory: t = !1 } = {}) {
	k(vO, e, !0), rA = (async () => {
		let n = wO(), r = null;
		try {
			let e = await fetch(`/${n.file}`);
			e.ok && (r = jc(await e.json(), Q.siteStore.data));
		} catch {}
		r ? CO.delete(e) : r = iA(n), SO = ww(`urd-draft-${e}`, () => r, OM.draftSaveError), (SO.data.schemaVersion ?? 1) > 7 && (console.warn(`Urd: the draft for '${e}' has schemaVersion ${SO.data.schemaVersion} (the engine has 7) and is discarded`), SO.replace(structuredClone(r))), SO.replace(jc(SO.data, Q.siteStore.data)), SO.save(), t || (DA.lastHistoryKey = null), k(Ok, null), k(kk, null), DA.updateDirty(), Q.readSeoDraft(), OM.updateAttention(), OM.status = "";
	})(), await rA;
}
async function oA(e) {
	let t = localStorage.getItem(`urd-draft-${e.id}`);
	if (t) try {
		return JSON.parse(t);
	} catch {}
	try {
		let t = await fetch(`/${e.file}`);
		if (t.ok) return jc(await t.json(), Q.siteStore.data);
	} catch {}
	return iA(e);
}
async function sA(e, t) {
	let n = await oA(e);
	t(n), OM.writeDraftKey(`urd-draft-${e.id}`, JSON.stringify(n)), DA.updateDirty();
}
async function cA(e) {
	let t = [...e.target.files ?? []];
	if (e.target.value = "", !t.length) return;
	OM.setStatus(K("status.compressingImages"));
	let { images: n, failed: r, big: i } = await LM.compressMany(t);
	n.length && BO("gallery-add", (e) => {
		e.props.images.push(...n);
	}), LM.reportUpload(n.length, r, i);
}
function lA(e, t) {
	BO("gallery-move", (n) => {
		let r = e + t;
		r < 0 || r >= n.props.images.length || ([n.props.images[e], n.props.images[r]] = [n.props.images[r], n.props.images[e]]);
	});
}
function uA(e) {
	BO("gallery-remove", (t) => {
		t.props.images.splice(e, 1);
	});
}
function dA(e, t, n) {
	BO(`edit:${F(TO).blockId}:img${e}-${t}`, (r) => {
		r.props.images[e][t] = n;
	});
}
function fA() {
	pk = null;
}
function pA() {
	Pn(() => {
		if (F(kO)) return AO(), window.addEventListener("resize", AO), () => window.removeEventListener("resize", AO);
	}), Pn(() => {
		F(jO)?.mode === "set" && F(TO)?.type !== "calendar" && k(jO, null);
	}), Pn(() => {
		let e = F(TO)?.blockId ?? null;
		e !== MO && (MO = e, ug.menuQuery = "", ug.propsQuery = "");
	}), Pn(() => {
		F(kO) || (ug.menuQuery = "");
	}), Pn(() => {
		F(Ok), F(jk), requestAnimationFrame(() => requestAnimationFrame(Rk));
	}), Pn(() => {
		let e = XD.iframeEl;
		if (!e || typeof ResizeObserver > "u") return;
		let t = new ResizeObserver(() => Rk());
		return t.observe(e), () => t.disconnect();
	});
}
var $ = {
	get sections() {
		return SO?.data.sections ?? [];
	},
	get pageId() {
		return F(vO);
	},
	set pageId(e) {
		k(vO, e, !0);
	},
	handleApplyLayout: yO,
	hasMobileOverrides: bO,
	markDesktopChange: xO,
	get store() {
		return SO;
	},
	set store(e) {
		SO = e;
	},
	pendingPublished: CO,
	pageEntry: wO,
	get selectedBlock() {
		return F(TO);
	},
	set selectedBlock(e) {
		k(TO, e, !0);
	},
	readBlock: EO,
	syncSelectedBlock: DO,
	onSelectBlock: OO,
	get blockMenu() {
		return F(kO);
	},
	set blockMenu(e) {
		k(kO, e, !0);
	},
	moveBlockMenu: RO,
	menuBackToBlock: zO,
	onMenuArea: NO,
	measureMenuRoom: AO,
	get designPicker() {
		return F(jO);
	},
	set designPicker(e) {
		k(jO, e, !0);
	},
	get searchBlockId() {
		return MO;
	},
	set searchBlockId(e) {
		MO = e;
	},
	onBlockMenu: FO,
	mutateBlock: BO,
	setBlockProp: VO,
	setBlockProps: HO,
	groupReset: UO,
	groupChanged: WO,
	onOff: GO,
	RIBBON_REACH: KO,
	ribbonReach: qO,
	RIBBON_MOTIONS: JO,
	buttonTargets: YO,
	setButtonTarget: XO,
	openImageEditor: ZO,
	fitTimers: QO,
	fitSeq: $O,
	get fitCount() {
		return ek;
	},
	set fitCount(e) {
		ek = e;
	},
	fitBlockSoon: tk,
	phoneSeq: nk,
	get phoneFit() {
		return rk;
	},
	set phoneFit(e) {
		rk = e;
	},
	get phonePlugins() {
		return ik;
	},
	set phonePlugins(e) {
		ik = e;
	},
	phoneFitSoon: ak,
	applyPhoneHeight: ok,
	dropFits: sk,
	setCalendarDesign: ck,
	setCalendarPhoneView: lk,
	setCalendarCard: uk,
	setBlockFit: dk,
	setBlockFitMin: fk,
	get sizeGesture() {
		return pk;
	},
	set sizeGesture(e) {
		pk = e;
	},
	setBlockSize: gk,
	setBlockSizeBound: _k,
	setBlockHeightMode: vk,
	setBlockHeightAlign: yk,
	canStretch: bk,
	setBlockFrame: xk,
	designWidth: Sk,
	shapePx: Ck,
	setShapeSizePx: wk,
	setBoxStyle: Tk,
	setBlockDecor: Ek,
	setBlockHideMobile: Dk,
	get activeSectionId() {
		return F(Ok);
	},
	set activeSectionId(e) {
		k(Ok, e, !0);
	},
	get sectionGrid() {
		return F(kk);
	},
	set sectionGrid(e) {
		k(kk, e, !0);
	},
	get sectionMinHeight() {
		return F(Ak);
	},
	set sectionMinHeight(e) {
		k(Ak, e, !0);
	},
	get sectionBg() {
		return F(jk);
	},
	set sectionBg(e) {
		k(jk, e, !0);
	},
	get sectionAnim() {
		return F(Mk);
	},
	set sectionAnim(e) {
		k(Mk, e, !0);
	},
	get sectionHover() {
		return F(Nk);
	},
	set sectionHover(e) {
		k(Nk, e, !0);
	},
	get sectionTheme() {
		return F(Pk);
	},
	set sectionTheme(e) {
		k(Pk, e, !0);
	},
	get sectionDivider() {
		return F(Fk);
	},
	set sectionDivider(e) {
		k(Fk, e, !0);
	},
	syncSectionMirrors: Ik,
	get secBox() {
		return F(Lk);
	},
	set secBox(e) {
		k(Lk, e, !0);
	},
	measureSecBox: Rk,
	onSelectSection: zk,
	mutateSection: Bk,
	setBlockVideoFile: Vk,
	setBlockVideoPoster: Hk,
	get sectionBgCtx() {
		return F(Uk);
	},
	animObj: Wk,
	isEntrance: Gk,
	get ENTRANCE_OPTIONS() {
		return F(Kk);
	},
	get BLOCK_ENTRANCE_OPTIONS() {
		return F(qk);
	},
	get HOVER_OPTIONS() {
		return F(Jk);
	},
	normalizeAnim: Yk,
	setBlockAnimation: Xk,
	setBlockHover: Zk,
	setBlockAnimProp: Qk,
	setSectionHeight: $k,
	targetSection: eA,
	toggleSectionGrid: tA,
	setSectionGrid: nA,
	get pageLoading() {
		return rA;
	},
	set pageLoading(e) {
		rA = e;
	},
	blankPage: iA,
	selectPage: aA,
	readPageDraft: oA,
	patchPageDraft: sA,
	addGalleryImages: cA,
	moveGalleryImage: lA,
	removeGalleryImage: uA,
	setGalleryImageField: dA,
	endSizeGesture: fA,
	effects: pA
}, mA = /* @__PURE__ */ O(!1);
function hA() {
	let e = Q.siteDraft?.pages?.some((e) => !$.pendingPublished.has(e.id) && localStorage.getItem(`urd-draft-${e.id}`) !== null) ?? !1, t = YA.collectionsIndexStore?.hasDraft() || Object.values(YA.collectionStores).some((e) => e.hasDraft()), n = bT.templatesIndexStore?.hasDraft() || Object.values(bT.templateStores).some((e) => e.hasDraft());
	k(mA, e || $.store?.hasDraft() && !$.pendingPublished.has($.pageId) || Q.siteStore?.hasDraft() || _O.pluginsStore?.hasDraft() || t || n || !1, !0);
}
var gA = [], _A = [], vA = null;
function yA() {
	return JSON.stringify({
		pageId: $.pageId,
		page: $.store.data,
		site: Q.siteStore.data,
		collectionsIndex: YA.collectionsReady ? YA.collectionsIndexStore.data : null,
		collections: YA.collectionsReady ? Object.fromEntries(Object.entries(YA.collectionStores).map(([e, t]) => [e, t.data])) : {},
		templatesIndex: bT.templatesReady ? bT.templatesIndexStore.data : null,
		templates: bT.templatesReady ? Object.fromEntries(Object.entries(bT.templateStores).map(([e, t]) => [e, t.data])) : {},
		plugins: _O.pluginsStore?.data ?? null
	});
}
function bA(e) {
	(e !== vA || !e.startsWith("edit:") && !e.startsWith("grid:")) && (gA.push(yA()), gA.length > 50 && gA.shift(), _A.length = 0, vA = e);
}
function xA(e) {
	let { pageId: t, page: n, site: r, collectionsIndex: i, collections: a, templatesIndex: o, templates: s, plugins: c } = JSON.parse(e);
	Q.siteStore.replace(r), Q.linkSiteDraft(), Q.siteStore.save(), Q.grid = {
		snap: !0,
		...Q.siteDraft.grid
	}, Q.pushSiteToPreview(), SA(i, a ?? {}), CA(o, s ?? {}), wA(c), t && t !== $.pageId && Q.siteDraft.pages.some((e) => e.id === t) ? (OM.writeDraftKey(`urd-draft-${t}`, JSON.stringify(n)), $.selectPage(t, { keepHistory: !0 }), hA()) : ($.store.replace(n), $.store.save(), hA(), OM.updateAttention(), $.syncSelectedBlock(), $.syncSectionMirrors($.store.data.sections.find((e) => e.id === $.activeSectionId)), Q.siteDraft.pages.some((e) => e.id === $.pageId) ? XD.bridge?.sendPage($.pageId, $.store.data) : $.selectPage(Q.siteDraft.pages[0].id, { keepHistory: !0 }));
}
function SA(e, t) {
	if (YA.collectionsIndexStore && e && JSON.stringify({
		index: YA.collectionsIndexStore.data,
		collections: Object.fromEntries(Object.entries(YA.collectionStores).map(([e, t]) => [e, t.data]))
	}) !== JSON.stringify({
		index: e,
		collections: t
	})) {
		YA.collectionsIndexStore.replace(e), YA.collectionsIndexStore.save();
		for (let e of Object.keys(YA.collectionStores)) e in t || (localStorage.removeItem(`urd-draft-collection-${e}`), localStorage.removeItem(`urd-draft-samling-${e}`), delete YA.collectionStores[e]);
		for (let [e, n] of Object.entries(t)) {
			if (!YA.collectionStores[e]) {
				let t = YA.publishedCollections[e] ?? null;
				YA.collectionStores[e] = ww(`urd-draft-collection-${e}`, () => t, OM.draftSaveError, `urd-draft-samling-${e}`);
			}
			YA.collectionStores[e].replace(n), YA.collectionStores[e].save();
		}
		YA.collectionIds = [...e.samlinger ?? []], YA.activeCollection && !YA.collectionIds.includes(YA.activeCollection) && (YA.activeCollection = null), YA.syncCollectionsView();
	}
}
function CA(e, t) {
	if (bT.templatesIndexStore && e && JSON.stringify({
		index: bT.templatesIndexStore.data,
		templates: Object.fromEntries(Object.entries(bT.templateStores).map(([e, t]) => [e, t.data]))
	}) !== JSON.stringify({
		index: e,
		templates: t
	})) {
		bT.templatesIndexStore.replace(e), bT.templatesIndexStore.save();
		for (let e of Object.keys(bT.templateStores)) e in t || (localStorage.removeItem(`urd-draft-template-${e}`), localStorage.removeItem(`urd-draft-mal-${e}`), delete bT.templateStores[e]);
		for (let [e, n] of Object.entries(t)) bT.templateStores[e] || (bT.templateStores[e] = ww(`urd-draft-template-${e}`, () => bT.publishedTemplates[e] ?? null, OM.draftSaveError, `urd-draft-mal-${e}`)), bT.templateStores[e].replace(n), bT.templateStores[e].save();
		bT.templateIds = [...e.maler ?? []], hA(), bT.pushTemplatesToPreview();
	}
}
function wA(e) {
	_O.pluginsStore && e && JSON.stringify(_O.pluginsStore.data) !== JSON.stringify(e) && (_O.pluginsStore.replace(e), _O.pluginsStore.save(), _O.syncPluginsView(), XD.reloadPreview());
}
function TA() {
	gA.length && ($.dropFits(), _A.push(yA()), xA(gA.pop()), vA = null, OM.setStatus(K("status.undone")));
}
function EA() {
	_A.length && ($.dropFits(), gA.push(yA()), xA(_A.pop()), vA = null, OM.setStatus(K("status.redone")));
}
var DA = {
	get dirty() {
		return F(mA);
	},
	set dirty(e) {
		k(mA, e, !0);
	},
	updateDirty: hA,
	history: gA,
	redoStack: _A,
	get lastHistoryKey() {
		return vA;
	},
	set lastHistoryKey(e) {
		vA = e;
	},
	snapshot: yA,
	pushHistory: bA,
	restore: xA,
	restoreCollections: SA,
	restoreTemplates: CA,
	restorePlugins: wA,
	undo: TA,
	redo: EA
}, OA = null, kA = {}, AA = {}, jA = !1, MA = /* @__PURE__ */ O(mn([])), NA = /* @__PURE__ */ O(mn({})), PA = /* @__PURE__ */ O(null), FA = /* @__PURE__ */ O(""), IA = /* @__PURE__ */ O("news");
async function LA() {
	let e = {
		version: 1,
		samlinger: []
	};
	try {
		e = await (await fetch("/content/collections.json")).json();
	} catch {}
	OA = ww("urd-draft-collections", () => e, OM.draftSaveError, "urd-draft-samlinger"), k(MA, [...OA.data.samlinger ?? []], !0);
	for (let e of F(MA)) {
		let t = null;
		try {
			t = await (await fetch(`/content/samlinger/${e}.json`)).json();
		} catch {}
		AA[e] = t, kA[e] = ww(`urd-draft-collection-${e}`, () => t, OM.draftSaveError, `urd-draft-samling-${e}`), !t && !kA[e].data && (kA[e].replace({
			schemaVersion: 1,
			id: e,
			name: e,
			kind: "custom",
			entries: []
		}), kA[e].save());
	}
	jA = !0, RA();
}
function RA(e = !0) {
	let t = {};
	for (let e of F(MA)) kA[e] && (t[e] = JSON.parse(JSON.stringify(kA[e].data)));
	k(NA, t, !0), e && zA();
}
function zA() {
	XD.bridge?.sendCollections(Ze(F(NA)) ?? {});
}
function BA(e, t, n, r = !0) {
	let i = kA[e];
	i && (DA.pushHistory(t), n(i.data), i.save(), DA.updateDirty(), RA(r));
}
function VA(e) {
	kA[e.collection] && JA(e.collection);
}
function HA(e) {
	return (new DOMParser().parseFromString(String(e ?? ""), "text/html").body.textContent ?? "").trim();
}
function UA(e) {
	let { collection: t, entryId: n, field: r, value: i } = e;
	[
		"title",
		"text",
		"image",
		"imageAlt",
		"imageStyle"
	].includes(r) && (r !== "title" || HA(i)) && BA(t, `edit:collection:${t}:${n}:${r}`, (e) => {
		let t = e.entries.find((e) => e.id === n);
		t && (i === "" && r !== "title" ? delete t[r] : t[r] = i);
	}, r === "image");
}
function WA(e, t, n) {
	let r = {
		schemaVersion: 1,
		id: e,
		name: t,
		kind: n,
		entries: []
	};
	kA[e] = ww(`urd-draft-collection-${e}`, () => null, OM.draftSaveError, `urd-draft-samling-${e}`), kA[e].replace(r), kA[e].save(), OA.data.samlinger = [...F(MA), e], OA.save(), k(MA, [...F(MA), e], !0), k(PA, e, !0), DA.updateDirty(), RA();
}
function GA() {
	let e = F(FA).trim();
	if (!e) return;
	let t = zp(e);
	!t || F(MA).includes(t) ? OM.setStatus(K(t ? "status.collectionExists" : "status.invalidName"), "error") : (DA.pushHistory("collections"), WA(t, e, F(IA)), k(FA, ""));
}
function KA() {
	let e = K("seed.productCatalogName"), t = zp(e) || "collection", n = t;
	for (let e = 2; F(MA).includes(n); e += 1) n = `${t}-${e}`;
	DA.pushHistory("collections"), WA(n, e, "products"), $.mutateBlock(null, (e) => {
		e.props.collection = n;
	});
}
function qA(e) {
	DA.pushHistory("collections"), localStorage.removeItem(`urd-draft-collection-${e}`), localStorage.removeItem(`urd-draft-samling-${e}`), delete kA[e], OA.data.samlinger = F(MA).filter((t) => t !== e), OA.save(), k(MA, F(MA).filter((t) => t !== e), !0), F(PA) === e && k(PA, null), DA.updateDirty(), RA();
}
function JA(e) {
	BA(e, `collection:${e}:add-entry`, (e) => {
		e.kind === "products" ? e.entries.push({
			id: es("entry"),
			title: K("seed.newProduct"),
			text: ""
		}) : e.entries.unshift({
			id: es("entry"),
			title: K("seed.newEntry"),
			date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			text: ""
		});
	});
}
var YA = {
	get collectionsIndexStore() {
		return OA;
	},
	set collectionsIndexStore(e) {
		OA = e;
	},
	get collectionStores() {
		return kA;
	},
	set collectionStores(e) {
		kA = e;
	},
	get publishedCollections() {
		return AA;
	},
	set publishedCollections(e) {
		AA = e;
	},
	get collectionsReady() {
		return jA;
	},
	set collectionsReady(e) {
		jA = e;
	},
	get collectionIds() {
		return F(MA);
	},
	set collectionIds(e) {
		k(MA, e, !0);
	},
	get collectionsView() {
		return F(NA);
	},
	set collectionsView(e) {
		k(NA, e, !0);
	},
	get activeCollection() {
		return F(PA);
	},
	set activeCollection(e) {
		k(PA, e, !0);
	},
	get newCollectionName() {
		return F(FA);
	},
	set newCollectionName(e) {
		k(FA, e, !0);
	},
	get newCollectionKind() {
		return F(IA);
	},
	set newCollectionKind(e) {
		k(IA, e, !0);
	},
	initCollections: LA,
	syncCollectionsView: RA,
	pushCollectionsToPreview: zA,
	mutateCollection: BA,
	handleCollectionAdd: VA,
	plainTitle: HA,
	handleCollectionEdit: UA,
	insertCollection: WA,
	addCollection: GA,
	createCatalogForBlock: KA,
	removeCollection: qA,
	addCollectionEntry: JA
};
//#endregion
//#region src/lib/deploy-wait.js
function XA(e, { max: t = 8 } = {}) {
	let n = (e ?? []).filter((e) => e && typeof e.path == "string" && typeof e.content == "string" && e.encoding === "utf-8" && !e.delete && (e.path.startsWith("content/") || e.path === "plugins/plugins.json"));
	return n.sort((e, t) => (e.path === "content/site.json" ? -1 : 0) - (t.path === "content/site.json" ? -1 : 0)), n.slice(0, t).map(({ path: e, content: t }) => ({
		path: e,
		content: t
	}));
}
async function ZA(e, { fetchFn: t = fetch, delayMs: n = 1e4, attempts: r = 18, sleep: i = (e) => new Promise((t) => setTimeout(t, e)) } = {}) {
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
//#endregion
//#region src/state/updater.svelte.js
var QA = null;
async function $A() {
	try {
		let e = await fetch("/api/github/latest");
		e.ok && (QA = (await e.json()).head ?? null);
	} catch {}
}
async function ej(e) {
	if (!QA) return await $A(), {
		ok: await OM.askConfirm({
			title: K("confirm.conflictUnknown.title"),
			lines: [K("confirm.conflictUnknown.body"), K("confirm.conflictUnknown.warning")],
			okLabel: K("confirm.publishAnyway"),
			cancelLabel: K("confirm.cancel")
		}),
		head: QA
	};
	let t = null;
	try {
		let e = await fetch(`/api/github/latest?base=${QA}`);
		e.ok && (t = await e.json().catch(() => null));
	} catch {}
	if (!t?.head) return {
		ok: !0,
		head: null
	};
	let n = t.head;
	if (n === QA) return {
		ok: !0,
		head: n
	};
	let r = new Set(e.map((e) => e.path)), i = t.truncated ? [K("confirm.conflict.truncated")] : (t.changedFiles ?? []).filter((e) => r.has(e));
	return i.length === 0 ? {
		ok: !0,
		head: n
	} : {
		ok: await OM.askConfirm({
			title: K("confirm.conflict.title"),
			lines: [
				K("confirm.conflict.intro"),
				...i.map((e) => `• ${e}`),
				K("confirm.conflict.warning")
			],
			okLabel: K("confirm.publishAnyway"),
			cancelLabel: K("confirm.cancel")
		}),
		head: n
	};
}
var tj = /* @__PURE__ */ O(null), nj = /* @__PURE__ */ O("");
async function rj() {
	k(nj, "");
	try {
		let e = await fetch("/api/github/history");
		e.ok ? k(tj, (await e.json()).commits, !0) : e.status === 401 ? (k(tj, [], !0), k(nj, K("status.historyLoginRequired"), !0)) : (k(tj, [], !0), k(nj, ba(await e.json().catch(() => null)) ?? K("status.historyFetchFailed"), !0));
	} catch {
		k(tj, [], !0), k(nj, K("status.historyUnavailable"), !0);
	}
}
var ij = !1, aj = 0;
async function oj(e) {
	let t = ++aj, n = OM.statusSeq, r = await ZA(XA(e));
	t === aj && n === OM.statusSeq && (r ? OM.setStatus(K("status.publishLive"), "ok") : OM.setStatus(K("status.publishDeployTimeout"), "error"));
}
var sj = /* @__PURE__ */ O(null), cj = /* @__PURE__ */ O(null), lj = /* @__PURE__ */ O(!1), uj = /* @__PURE__ */ O(mn(/* @__PURE__ */ new Set()));
async function dj() {
	k(lj, !0), k(cj, null), k(sj, null);
	try {
		let e = await fetch("/api/github/update"), t = await e.json().catch(() => null);
		e.ok ? (k(sj, t, !0), k(uj, /* @__PURE__ */ new Set(), !0)) : k(cj, ba(t) ?? K("update.checkFailed"), !0);
	} catch {
		k(cj, K("status.publishLayerUnreachable"), !0);
	}
	k(lj, !1);
}
var fj = {
	get baseSha() {
		return QA;
	},
	set baseSha(e) {
		QA = e;
	},
	refreshBaseSha: $A,
	confirmNoConflict: ej,
	get historyList() {
		return F(tj);
	},
	set historyList(e) {
		k(tj, e, !0);
	},
	get historyError() {
		return F(nj);
	},
	set historyError(e) {
		k(nj, e, !0);
	},
	loadHistory: rj,
	get revertedSinceLoad() {
		return ij;
	},
	set revertedSinceLoad(e) {
		ij = e;
	},
	get publishWave() {
		return aj;
	},
	set publishWave(e) {
		aj = e;
	},
	awaitPublishDeploy: oj,
	get updateInfo() {
		return F(sj);
	},
	set updateInfo(e) {
		k(sj, e, !0);
	},
	get updateError() {
		return F(cj);
	},
	set updateError(e) {
		k(cj, e, !0);
	},
	get updateBusy() {
		return F(lj);
	},
	set updateBusy(e) {
		k(lj, e, !0);
	},
	get updateSkip() {
		return F(uj);
	},
	set updateSkip(e) {
		k(uj, e, !0);
	},
	loadUpdateCheck: dj
}, pj = /* @__PURE__ */ D(() => [
	["purple", K("adminTheme.purple")],
	["well", K("adminTheme.well")],
	["gold", K("adminTheme.gold")],
	["grey", K("adminTheme.grey")],
	["aurora", K("adminTheme.aurora")],
	["dusk", K("adminTheme.dusk")],
	["ember", K("adminTheme.ember")]
]), mj = {
	lilla: "purple",
	bronn: "well",
	gull: "gold",
	graa: "grey",
	nordlys: "aurora",
	skumring: "dusk",
	glo: "ember"
}, hj = /* @__PURE__ */ O(mn((() => {
	let e = localStorage.getItem("urd-admin-theme");
	return mj[e] ?? e ?? "grey";
})()));
function gj() {
	let e = getComputedStyle(document.documentElement), t = e.getPropertyValue("--urd-color-accent").trim();
	XD.bridge?.sendAdminTheme({
		bg: e.getPropertyValue("--urd-color-bg").trim(),
		surface: e.getPropertyValue("--urd-color-surface").trim(),
		accent: t,
		text: e.getPropertyValue("--urd-color-text").trim(),
		"accent-text": _j(t)
	});
}
function _j(e) {
	return Ls(e) == null || (Rs(e, "#ffffff") ?? 0) >= (Rs(e, "#0b0e14") ?? 0) ? "#ffffff" : "#0b0e14";
}
var vj = /* @__PURE__ */ O(""), yj = /* @__PURE__ */ O("info"), bj = 0;
function xj(e, t = "info") {
	k(vj, e, !0), k(yj, t, !0);
	let n = ++bj;
	t === "ok" && setTimeout(() => {
		bj === n && (k(vj, ""), k(yj, "info"));
	}, 8e3);
}
function Sj() {
	xj(K("status.storageFull"), "error");
}
function Cj(e, t) {
	try {
		localStorage.setItem(e, t);
	} catch {
		Sj();
	}
}
var wj = /* @__PURE__ */ O(null), Tj = /* @__PURE__ */ O(0);
function Ej() {
	k(Tj, $.store?.data.sections.filter((e) => e.responsive?.mobile?.attention?.needed).length ?? 0, !0);
}
function Dj() {
	let e = $.store?.data.sections.find((e) => e.responsive?.mobile?.attention?.needed);
	XD.deviceId = "mobile", e && setTimeout(() => XD.bridge?.sendScrollSection(e.id), 0);
}
function Oj(e) {
	$.blockMenu && (e.target instanceof Element && e.target.closest(".block-menu, dialog") || ($.blockMenu = null));
}
function kj(e) {
	if (e.key === "Escape" && $.blockMenu && !(e.target instanceof Element && e.target.closest("dialog"))) {
		$.blockMenu = null;
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
		].includes(t.type)) || !$.selectedBlock || XD.viewMode === "mobile") return;
		e.preventDefault(), XD.bridge?.sendDuplicate();
		return;
	}
	if (t !== "z" && t !== "y") return;
	let n = e.target;
	n instanceof HTMLElement && (n.isContentEditable || n.tagName === "TEXTAREA" || n.tagName === "INPUT" && ![
		"number",
		"checkbox",
		"range",
		"color"
	].includes(n.type)) || (e.preventDefault(), t === "y" || e.shiftKey ? DA.redo() : DA.undo());
}
async function Aj() {
	Q.site = Ac(await (await fetch("/content/site.json")).json()), Q.siteStore = ww("urd-draft-site", () => Q.site, Sj), (Q.siteStore.data.schemaVersion ?? 1) > 5 && (console.warn(`Urd: the site draft has schemaVersion ${Q.siteStore.data.schemaVersion} (the engine has 5) and is discarded`), Q.siteStore.replace(Ze(Q.site))), Q.siteStore.replace(Ac(Q.siteStore.data)), Q.siteStore.save(), Q.linkSiteDraft(), Q.grid = {
		snap: !0,
		...Q.siteDraft.grid
	}, await $.selectPage(new URLSearchParams(location.search).get("page") ?? Q.siteDraft.pages[0].id), await _O.initPlugins(), await YA.initCollections(), await bT.initTemplates(), await sM(), F(wj) && fj.refreshBaseSha(), aM(), Q.siteDraft.site.setup === !0 && !localStorage.getItem("urd-setup-done") && (k(Lj, Q.siteDraft.site.title, !0), k(Rj, Q.siteDraft.theme.tokens.color.accent, !0), k(zj, Q.siteDraft.theme.tokens.color.bg, !0), k(Ij, !0));
}
var jj = /* @__PURE__ */ O(null);
function Mj({ title: e, lines: t = [], okLabel: n = K("confirm.ok"), cancelLabel: r = K("confirm.cancel") }) {
	return new Promise((i) => {
		k(jj, {
			title: e,
			lines: t,
			okLabel: n,
			cancelLabel: r,
			resolve: i
		}, !0);
	});
}
function Nj({ title: e, lines: t = [], value: n = "", placeholder: r = "", okLabel: i = K("confirm.ok"), cancelLabel: a = K("confirm.cancel") }) {
	return new Promise((o) => {
		k(jj, {
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
function Pj(e) {
	F(jj)?.resolve(F(jj).prompt ? e ? F(jj).value : null : e), k(jj, null);
}
var Fj = !1, Ij = /* @__PURE__ */ O(!1), Lj = /* @__PURE__ */ O(""), Rj = /* @__PURE__ */ O("#7c5cff"), zj = /* @__PURE__ */ O("#0b0e14");
function Bj() {
	localStorage.setItem("urd-setup-done", "1"), k(Ij, !1);
}
function Vj() {
	let e = F(Lj).trim();
	e && (Q.siteMutate("setup", () => {
		Q.siteDraft.site.title = e, Q.siteDraft.nav.logo = {
			type: "text",
			value: e
		}, Q.siteDraft.theme.tokens.color.accent = F(Rj), Q.siteDraft.theme.tokens.color.bg = F(zj), delete Q.siteDraft.site.setup;
	}), Bj(), xj(K("status.setupDone"), "ok"));
}
var Hj = "urd-admin-panels", Uj = "urd-admin-panel-open", Wj = /* @__PURE__ */ O(mn(localStorage.getItem(Hj) === "reset" ? "reset" : "remember"));
function Gj(e) {
	k(Wj, e === "reset" ? "reset" : "remember", !0), F(Wj) === "reset" ? localStorage.setItem(Hj, "reset") : localStorage.removeItem(Hj);
}
var Kj = /* @__PURE__ */ O(mn(F(Wj) === "reset" ? null : localStorage.getItem(Uj))), qj = [
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
], Jj = [
	"rail.thisPage",
	"rail.site",
	"rail.system"
], Yj = /* @__PURE__ */ D(() => Object.fromEntries(qj.flat().map((e) => [e, K(`panel.${e}`)])));
F(Kj) && !qj.flat().includes(F(Kj)) && k(Kj, null);
var Xj = {
	pages: ["hint.pages.drafts"],
	blocks: ["hint.blocks.intro"],
	grid: ["hint.grid.intro", "hint.grid.section"],
	collections: ["hint.collections.intro"],
	plugins: ["hint.plugins.intro"],
	history: ["hint.history.intro"]
}, Zj = [
	["se", "Davvisámegiella"],
	["en-GB", "English (UK)"],
	["nb", "Norsk bokmål"],
	["nn", "Norsk nynorsk"],
	["tr", "Türkçe"]
], Qj = (e) => [...e].sort((e, t) => e[1].localeCompare(t[1]));
function $j(e, t) {
	let n = [];
	for (let r of e) for (let e of _O.pluginInfo[r]?.languages ?? []) e?.[t] === !0 && typeof e.code == "string" && typeof e.name == "string" && e.name && (Zj.some(([t]) => t === e.code) || n.some(([t]) => t === e.code) || n.push([e.code, e.name]));
	return n;
}
function eM() {
	let e = Qj([...Zj, ...$j(_O.publishedPluginIds, "admin")]);
	return nM === "auto" || e.some(([e]) => e === nM) ? e : [[nM, nM], ...e];
}
var tM = () => $j(_O.pluginsView?.enabled ?? [], "site"), nM = localStorage.getItem("urd-admin-lang") ?? "auto";
function rM(e) {
	e !== nM && (e === "auto" ? localStorage.removeItem("urd-admin-lang") : localStorage.setItem("urd-admin-lang", e), location.reload());
}
function iM(e) {
	k(Kj, F(Kj) === e ? null : e, !0), aM();
}
function aM() {
	F(Kj) === "history" && fj.loadHistory(), F(Kj) === "update" && !fj.updateBusy && fj.loadUpdateCheck();
}
var oM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
async function sM() {
	try {
		let e = await fetch("/api/github/me");
		e.ok ? k(wj, await e.json(), !0) : e.status !== 503 && k(wj, null);
	} catch {
		k(wj, null);
	}
}
var cM = /* @__PURE__ */ O(localStorage.getItem("urd-guides") === "1"), lM = /* @__PURE__ */ O(!1), uM = /* @__PURE__ */ O(mn(localStorage.getItem("urd-layout-picker") === "menu" ? "menu" : "strip"));
function dM(e) {
	k(uM, e === "menu" ? "menu" : "strip", !0), F(uM) === "menu" ? localStorage.setItem("urd-layout-picker", "menu") : localStorage.removeItem("urd-layout-picker");
}
var fM = /* @__PURE__ */ O(null), pM = {
	view: 1079,
	device: 999,
	zoom: 919
}, mM = /* @__PURE__ */ O(null), hM = /* @__PURE__ */ O(null), gM = /* @__PURE__ */ O(mn({
	view: !1,
	device: !1,
	zoom: !1
}));
function _M() {
	k(cM, !F(cM)), localStorage.setItem("urd-guides", F(cM) ? "1" : "0"), XD.bridge?.sendShowGuides(F(cM));
}
var vM = /* @__PURE__ */ O(localStorage.getItem("urd-grid-overlay") === "1");
function yM() {
	k(vM, !F(vM)), localStorage.setItem("urd-grid-overlay", F(vM) ? "1" : "0"), XD.bridge?.sendShowGrid(F(vM));
}
var bM = /* @__PURE__ */ O(null), xM = /* @__PURE__ */ O(!1), SM = /* @__PURE__ */ O(!1), CM = (e) => e.length > 0 && [...e].every((e) => e.open);
function wM() {
	let e = F(bM)?.querySelectorAll("details.group") ?? [];
	k(xM, e.length > 0), k(SM, CM(e), !0);
}
function TM() {
	let e = !F(SM);
	F(bM)?.querySelectorAll("details.group").forEach((t) => {
		t.open = e;
	}), wM();
}
function EM(e) {
	for (let t of e.querySelectorAll("details.group")) {
		let e = t.querySelector(":scope > summary");
		if (!e || e.querySelector(".fold-sub")) continue;
		let n = () => t.querySelectorAll(":scope > .group-items details.group");
		if (!n().length) continue;
		let r = document.createElement("button");
		r.type = "button", r.className = "fold-sub fold-toggle", r.innerHTML = q.foldToggle;
		let i = () => {
			let e = CM(n());
			r.classList.toggle("collapse", e), r.title = K(e ? "ui.collapseSub" : "ui.expandSub"), r.setAttribute("aria-label", r.title);
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
function DM() {
	Pn(() => {
		document.documentElement.dataset.adminTheme = F(hj), localStorage.setItem("urd-admin-theme", F(hj)), gj();
	}), Pn(() => {
		if (!F(jj)) return;
		let e = (e) => {
			e.key === "Escape" && (e.stopPropagation(), Pj(!1));
		};
		return document.addEventListener("keydown", e, !0), () => document.removeEventListener("keydown", e, !0);
	}), Pn(() => {
		F(Wj) === "reset" ? localStorage.removeItem(Uj) : F(Kj) ? localStorage.setItem(Uj, F(Kj)) : localStorage.removeItem(Uj);
	}), Pn(() => {
		if (!F(lM)) return;
		let e = (e) => {
			F(fM)?.contains(e.target) || k(lM, !1);
		}, t = (e) => {
			e.key === "Escape" && k(lM, !1);
		}, n = () => {
			k(lM, !1);
		};
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t), window.addEventListener("blur", n), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t), window.removeEventListener("blur", n);
		};
	}), Pn(() => {
		let e = Object.entries(pM).map(([e, t]) => {
			let n = window.matchMedia(`(max-width: ${t}px)`), r = () => {
				F(gM)[e] = n.matches;
			};
			return r(), n.addEventListener("change", r), () => n.removeEventListener("change", r);
		});
		return () => e.forEach((e) => e());
	}), Pn(() => {
		F(mM) && !F(gM)[F(mM)] && k(mM, null);
	}), Pn(() => {
		if (!F(mM)) return;
		let e = (e) => {
			F(hM)?.contains(e.target) || k(mM, null);
		}, t = (e) => {
			e.key === "Escape" && k(mM, null);
		}, n = () => {
			k(mM, null);
		};
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t), window.addEventListener("blur", n), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t), window.removeEventListener("blur", n);
		};
	}), Pn(() => {
		F(Kj), Dr().then(wM);
	}), Pn(() => {
		let e = F(bM);
		if (!e) return;
		let t = new MutationObserver(() => {
			EM(e), wM();
		});
		return t.observe(e, {
			childList: !0,
			subtree: !0
		}), e.addEventListener("toggle", wM, !0), EM(e), () => {
			t.disconnect(), e.removeEventListener("toggle", wM, !0);
		};
	});
}
var OM = {
	get ADMIN_THEMES() {
		return F(pj);
	},
	LEGACY_ADMIN_THEMES: mj,
	get adminTheme() {
		return F(hj);
	},
	set adminTheme(e) {
		k(hj, e, !0);
	},
	sendAdminTheme: gj,
	readableOn: _j,
	get status() {
		return F(vj);
	},
	set status(e) {
		k(vj, e, !0);
	},
	get statusKind() {
		return F(yj);
	},
	set statusKind(e) {
		k(yj, e, !0);
	},
	get statusSeq() {
		return bj;
	},
	set statusSeq(e) {
		bj = e;
	},
	setStatus: xj,
	draftSaveError: Sj,
	writeDraftKey: Cj,
	get auth() {
		return F(wj);
	},
	set auth(e) {
		k(wj, e, !0);
	},
	get attentionCount() {
		return F(Tj);
	},
	set attentionCount(e) {
		k(Tj, e, !0);
	},
	updateAttention: Ej,
	jumpToAttention: Dj,
	onPointerdownWindow: Oj,
	onKeydown: kj,
	init: Aj,
	get confirmBox() {
		return F(jj);
	},
	set confirmBox(e) {
		k(jj, e, !0);
	},
	askConfirm: Mj,
	askPrompt: Nj,
	answerConfirm: Pj,
	get confirmDownOnOverlay() {
		return Fj;
	},
	set confirmDownOnOverlay(e) {
		Fj = e;
	},
	get showSetup() {
		return F(Ij);
	},
	set showSetup(e) {
		k(Ij, e, !0);
	},
	get setupName() {
		return F(Lj);
	},
	set setupName(e) {
		k(Lj, e, !0);
	},
	get setupAccent() {
		return F(Rj);
	},
	set setupAccent(e) {
		k(Rj, e, !0);
	},
	get setupBg() {
		return F(zj);
	},
	set setupBg(e) {
		k(zj, e, !0);
	},
	closeSetup: Bj,
	applySetup: Vj,
	PANELS_PREF_KEY: Hj,
	PANEL_OPEN_KEY: Uj,
	get panelsPref() {
		return F(Wj);
	},
	set panelsPref(e) {
		k(Wj, e, !0);
	},
	setPanelsPref: Gj,
	get activePanel() {
		return F(Kj);
	},
	set activePanel(e) {
		k(Kj, e, !0);
	},
	PANEL_GROUPS: qj,
	PANEL_GROUP_KEYS: Jj,
	get PANEL_LABELS() {
		return F(Yj);
	},
	PANEL_INTROS: Xj,
	LANG_OPTIONS: Zj,
	sortLangs: Qj,
	packLangOptions: $j,
	adminLangOptions: eM,
	sitePackLangs: tM,
	adminLangChoice: nM,
	setAdminLang: rM,
	togglePanel: iM,
	loadPanelData: aM,
	reducedMotion: oM,
	checkAuth: sM,
	get guidesOn() {
		return F(cM);
	},
	set guidesOn(e) {
		k(cM, e, !0);
	},
	get settingsOpen() {
		return F(lM);
	},
	set settingsOpen(e) {
		k(lM, e, !0);
	},
	get layoutPickerPref() {
		return F(uM);
	},
	set layoutPickerPref(e) {
		k(uM, e, !0);
	},
	setLayoutPicker: dM,
	get settingsEl() {
		return F(fM);
	},
	set settingsEl(e) {
		k(fM, e, !0);
	},
	FOLD_MQ: pM,
	get toolMenu() {
		return F(mM);
	},
	set toolMenu(e) {
		k(mM, e, !0);
	},
	get toolMenuEl() {
		return F(hM);
	},
	set toolMenuEl(e) {
		k(hM, e, !0);
	},
	get folded() {
		return F(gM);
	},
	set folded(e) {
		k(gM, e, !0);
	},
	toggleGuides: _M,
	get gridOn() {
		return F(vM);
	},
	set gridOn(e) {
		k(vM, e, !0);
	},
	toggleGrid: yM,
	get panelEl() {
		return F(bM);
	},
	set panelEl(e) {
		k(bM, e, !0);
	},
	get panelHasGroups() {
		return F(xM);
	},
	set panelHasGroups(e) {
		k(xM, e, !0);
	},
	get panelAllOpen() {
		return F(SM);
	},
	set panelAllOpen(e) {
		k(SM, e, !0);
	},
	allOpen: CM,
	syncPanelFolds: wM,
	togglePanelGroups: TM,
	decorateSubFolds: EM,
	effects: DM
};
//#endregion
//#region src/state/media.svelte.js
async function kM(e, t) {
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
async function AM(e) {
	let t = await e.text(), n = Fp(t), r = Lp(t);
	if (!r) return n;
	let i = await kM(n.dataUrl, r);
	if (!i) return n;
	let a = Ip(t, i);
	if (a === t) return n;
	try {
		return Fp(a);
	} catch {
		return n;
	}
}
async function jM(e) {
	if (e.type === "image/svg+xml" || /\.svg$/i.test(e.name || "")) return AM(e);
	let t = await Mp(e);
	return t.animated && t.bytes > 1e6 && OM.setStatus(K("status.animatedLarge", { mb: (t.bytes / 1e6).toFixed(1) }), "error"), t;
}
function MM(e) {
	return e?.code === "animatedTooLarge" ? K("status.animatedTooLarge", {
		mb: (e.bytes / 1e6).toFixed(1),
		max: Math.round(Sp / 1e6)
	}) : K("status.imageReadError");
}
function NM(e, t, n) {
	if (!["video/mp4", "video/webm"].includes(e.type)) {
		OM.setStatus(K(t), "error");
		return;
	}
	if (e.size > 15e6) {
		OM.setStatus(K("status.videoTooLarge", {
			mb: (e.size / 1e6).toFixed(1),
			max: Math.round(xp / 1e6)
		}), "error");
		return;
	}
	let r = new FileReader();
	r.onload = () => {
		n(String(r.result ?? "")), e.size > 4e6 && OM.setStatus(K("status.videoLarge", { mb: (e.size / 1e6).toFixed(1) }), "error");
	}, r.onerror = () => OM.setStatus(K("status.imageReadError"), "error"), r.readAsDataURL(e);
}
var PM = () => 1 + Math.floor(Math.random() * 1e6);
async function FM(e) {
	let t = [], n = 0, r = 0;
	for (let i of e) try {
		let e = await jM(i);
		e.bytes > 4e5 && (r += 1), t.push({
			src: e.dataUrl,
			alt: zp(i.name).replaceAll("-", " "),
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
function IM(e, t, n) {
	t ? OM.setStatus(K("status.imagesReadFailed", { n: t }), "error") : n ? OM.setStatus(K("status.imagesLarge", { n }), "error") : OM.setStatus(e ? "" : K("status.noImagesAdded"));
}
var LM = {
	svgContentBBox: kM,
	svgAutoTrim: AM,
	compressOrTrim: jM,
	imageErrorText: MM,
	readVideoFile: NM,
	newSeed: PM,
	compressMany: FM,
	reportUpload: IM
};
//#endregion
//#region ../template/assets/engine/0.7.6/feeds.js
function RM(e) {
	return String(e ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&apos;");
}
function zM(e, t) {
	let n = String(t ?? "").replace(/\/+$/, "");
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${(e ?? []).filter((e) => !e.noindex).map((e) => `  <url><loc>${RM(n + (e.path === "/" ? "/" : e.path))}</loc></url>`).join("\n")}\n</urlset>\n`;
}
function BM(e) {
	return `User-agent: *\nDisallow: /admin/\n\nSitemap: ${String(e ?? "").replace(/\/+$/, "")}/sitemap.xml\n`;
}
var VM = [
	"news",
	"notices",
	"publications"
];
function HM(e) {
	let t = String(e.origin ?? "").replace(/\/+$/, ""), n = (e.items ?? []).map((n) => {
		let r = n.href ? new URL(n.href, t + "/").href : t + "/", i = n.date ? new Date(n.date) : null, a = i && !Number.isNaN(i.getTime()) ? `\n      <pubDate>${i.toUTCString()}</pubDate>` : "", o = n.text ? `\n      <description>${RM(n.text)}</description>` : "";
		return `    <item>\n      <title>${RM(n.title)}</title>\n      <link>${RM(r)}</link>\n      <guid isPermaLink="false">${RM(`${e.path}#${n.id ?? n.title}`)}</guid>${o}${a}\n    </item>`;
	}).join("\n");
	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${RM(e.title)}</title>\n    <link>${RM(t + "/")}</link>\n    <description>${RM(e.description ?? e.title)}</description>\n${n}${n ? "\n" : ""}  </channel>\n</rss>\n`;
}
//#endregion
//#region src/state/publish.svelte.js
function UM(e, t, n, r) {
	let i = e?.[t];
	if (!i?.startsWith("data:image/") && !i?.startsWith("data:audio/") && !i?.startsWith("data:video/")) return;
	let a = i.split(",", 2)[1], o = `media/${zp(n || "image")}-${Bp(a)}.${Rp(i)}`;
	r.push({
		path: o,
		content: a,
		encoding: "base64"
	}), e[t] = `/${o}`;
}
function WM(e, t) {
	UM(e, "image", e.title, t);
	for (let n of e.colors ?? []) UM(n, "image", `${e.title}-${n.name}`, t);
}
function GM(e, t) {
	for (let n of e?.layers ?? []) {
		if (n.type === "image" && UM(n.props, "src", "background", t), n.type === "slideshow") for (let e of n.props.images ?? []) UM(e, "src", "background", t);
		n.type === "video" && (UM(n.props, "src", "video", t), UM(n.props, "poster", "plakat", t));
	}
}
function KM(e, t) {
	if (e.type === "image" && UM(e.props, "src", e.props.alt, t), e.type === "icon" && UM(e.props, "image", "ikon", t), e.type === "gallery") for (let n of e.props.images ?? []) UM(n, "src", n.alt || "gallery", t);
	e.type === "audio" && UM(e.props, "src", e.props.title || "lyd", t), e.type === "video" && (UM(e.props, "src", e.props.title || "video", t), UM(e.props, "poster", "poster", t));
}
function qM(e, t) {
	GM(e.background, t);
	for (let n of e.blocks) KM(n, t);
}
function JM(e) {
	let t = [];
	e.meta?.og && UM(e.meta.og, "image", "share", t);
	for (let n of e.sections) qM(n, t);
	return t;
}
function YM(e) {
	let t = [], n = e.nav?.logo;
	n?.type === "image" && UM(n, "value", "logo", t), n?.type === "both" && UM(n, "image", "logo", t), e.nav?.style && UM(e.nav.style, "image", "menu", t), GM(e.nav?.style?.background, t), GM(e.footer?.background, t), e.footer?.brand && UM(e.footer.brand, "logo", "footer-logo", t);
	for (let n of Array.isArray(e.site?.links) ? e.site.links : []) UM(n, "image", "link-icon", t);
	if (e.nav?.launcher) {
		UM(e.nav.launcher, "image", "snarvei", t);
		for (let n of e.nav.launcher.links ?? []) UM(n, "image", "snarvei", t);
	}
	return UM(e.site, "icon", "ikon", t), t;
}
var XM = /* @__PURE__ */ O(!1), ZM = /* @__PURE__ */ O(null);
function QM() {
	k(XM, !F(XM));
}
function $M() {
	k(XM, !1);
	try {
		eN(), OM.setStatus(K("ui.discarded"), "info");
	} catch (e) {
		console.error("Urd: discard failed", e), OM.setStatus(String(e?.message ?? e), "error");
	}
}
function eN() {
	DA.pushHistory("discard");
	for (let e of Q.siteDraft.pages) e.id !== $.pageId && !$.pendingPublished.has(e.id) && localStorage.removeItem(`urd-draft-${e.id}`);
	let e = $.store.reset();
	if (Q.siteStore.reset(), _O.pluginsStore && (_O.pluginsStore.reset(), _O.syncPluginsView()), YA.collectionsIndexStore) {
		YA.collectionsIndexStore.reset(), YA.collectionIds = [...YA.collectionsIndexStore.data.samlinger ?? []];
		for (let e of Object.keys(YA.collectionStores)) YA.collectionIds.includes(e) ? YA.collectionStores[e].reset() : delete YA.collectionStores[e];
		YA.syncCollectionsView();
	}
	if (bT.templatesIndexStore) {
		bT.templatesIndexStore.reset(), bT.templateIds = [...bT.templatesIndexStore.data.maler ?? []];
		for (let e of Object.keys(bT.templateStores)) bT.templateIds.includes(e) ? bT.templateStores[e].reset() : (localStorage.removeItem(`urd-draft-template-${e}`), localStorage.removeItem(`urd-draft-mal-${e}`), delete bT.templateStores[e]);
		bT.pushTemplatesToPreview();
	}
	Q.linkSiteDraft(), Q.grid = {
		snap: !0,
		...Q.siteDraft.grid
	}, DA.updateDirty(), OM.status = "", Q.pushSiteToPreview(), Q.siteDraft.pages.some((e) => e.id === $.pageId) ? XD.bridge?.sendPage($.pageId, e) : $.selectPage(Q.siteDraft.pages[0].id);
}
async function tN() {
	if (fj.revertedSinceLoad) {
		OM.setStatus(K("status.revertReloadBeforePublish"), "error");
		return;
	}
	if (fj.updateBusy) {
		OM.setStatus(K("update.publishBlocked"), "error");
		return;
	}
	OM.setStatus(K("status.publishing"));
	let e = [], t = [], n = [], r = [];
	for (let i of Q.siteDraft.pages) {
		let a = `urd-draft-${i.id}`, o = $.pendingPublished.has(i.id) || !Q.site.pages.some((e) => e.id === i.id), s = null;
		if (i.id === $.pageId && ($.store.hasDraft() || o)) s = $.store.data;
		else if (i.id !== $.pageId) {
			let e = localStorage.getItem(a);
			if (e) try {
				s = jc(JSON.parse(e), Q.siteStore.data);
			} catch {}
		}
		if (!s && o && (s = $.blankPage(i)), !s) continue;
		let c = JSON.parse(JSON.stringify(s));
		e.push(...JM(c)), e.push({
			path: i.file,
			content: JSON.stringify(c, null, 2) + "\n",
			encoding: "utf-8"
		}), t.push(i.title), o ? r.push(i.id) : n.push(a);
	}
	if (Q.siteStore.hasDraft()) {
		let r = JSON.parse(JSON.stringify(Q.siteDraft));
		e.push(...YM(r)), e.push({
			path: "content/site.json",
			content: JSON.stringify(r, null, 2) + "\n",
			encoding: "utf-8"
		}), e.push({
			path: "content/theme.css",
			content: Ms(r.theme),
			encoding: "utf-8"
		}), n.push("urd-draft-site");
		let i = (e, t) => JSON.stringify(e ?? null) === JSON.stringify(t ?? null);
		i(Q.site.theme, Q.siteDraft.theme) || t.push(K("publish.part.theme")), i(Q.site.nav, Q.siteDraft.nav) || t.push(K("publish.part.nav")), i(Q.site.footer, Q.siteDraft.footer) || t.push(K("publish.part.footer")), i(Q.site.pages, Q.siteDraft.pages) || t.push(K("publish.part.pages")), i(Q.site.grid, Q.siteDraft.grid) || t.push(K("publish.part.grid")), (Q.site.site.icon ?? null) !== (Q.siteDraft.site.icon ?? null) && t.push(K("publish.part.icon"));
		let { icon: a, ...o } = Q.site.site, { icon: s, ...c } = Q.siteDraft.site;
		i(o, c) || t.push(K("publish.part.siteInfo"));
	}
	let i = Object.entries(YA.collectionStores).filter(([, e]) => e.hasDraft());
	if (i.length || YA.collectionsIndexStore?.hasDraft()) {
		for (let [t, r] of i) {
			let i = JSON.parse(JSON.stringify(r.data));
			for (let t of i.entries) WM(t, e);
			e.push({
				path: `content/samlinger/${t}.json`,
				content: JSON.stringify(i, null, 2) + "\n",
				encoding: "utf-8"
			}), VM.includes(i.kind) && e.push({
				path: `content/samlinger/${t}.xml`,
				content: HM({
					title: i.name ?? t,
					origin: location.origin,
					path: `/content/samlinger/${t}.xml`,
					items: i.entries.map((e) => ({
						id: e.id,
						title: YA.plainTitle(e.title),
						text: YA.plainTitle(e.text),
						date: e.date,
						href: e.href
					}))
				}),
				encoding: "utf-8"
			}), n.push(`urd-draft-samling-${t}`);
		}
		if (YA.collectionsIndexStore?.hasDraft()) {
			e.push({
				path: "content/collections.json",
				content: JSON.stringify(YA.collectionsIndexStore.data, null, 2) + "\n",
				encoding: "utf-8"
			}), n.push("urd-draft-collections", "urd-draft-samlinger");
			let t = { samlinger: [] };
			try {
				t = await (await fetch("/content/collections.json")).json();
			} catch {}
			let r = new Set(e.map((e) => e.path));
			for (let n of t.samlinger ?? []) {
				let t = `content/samlinger/${n}.json`;
				!YA.collectionIds.includes(n) && !r.has(t) && e.push({
					path: t,
					delete: !0
				});
			}
		}
		t.push(K("publish.part.collections"));
	}
	let a = Object.entries(bT.templateStores).filter(([, e]) => e.hasDraft());
	if (a.length || bT.templatesIndexStore?.hasDraft()) {
		for (let [t, r] of a) {
			let i = JSON.parse(JSON.stringify(r.data));
			i.section && qM(i.section, e);
			for (let t of i.blocks ?? []) KM(t, e);
			for (let t of i.page?.sections ?? []) qM(t, e);
			e.push({
				path: `content/maler/${t}.json`,
				content: JSON.stringify(i, null, 2) + "\n",
				encoding: "utf-8"
			}), n.push(`urd-draft-mal-${t}`);
		}
		if (bT.templatesIndexStore?.hasDraft()) {
			e.push({
				path: "content/maler.json",
				content: JSON.stringify(bT.templatesIndexStore.data, null, 2) + "\n",
				encoding: "utf-8"
			}), n.push("urd-draft-templates", "urd-draft-maler");
			let t = { maler: [] };
			try {
				t = await (await fetch("/content/maler.json")).json();
			} catch {}
			let r = new Set(e.map((e) => e.path));
			for (let n of t.maler ?? []) {
				let t = `content/maler/${n}.json`;
				!bT.templateIds.includes(n) && !r.has(t) && e.push({
					path: t,
					delete: !0
				});
			}
		}
		t.push(K("publish.part.templates"));
	}
	_O.pluginsStore?.hasDraft() && (e.push({
		path: "plugins/plugins.json",
		content: JSON.stringify(_O.pluginsStore.data, null, 2) + "\n",
		encoding: "utf-8"
	}), n.push("urd-draft-plugins"), t.push(K("publish.part.plugins")));
	try {
		let t = await (await fetch("/index.html")).text();
		for (let n of Q.siteDraft.pages) n.path !== "/" && e.push({
			path: `${n.path.slice(1)}/index.html`,
			content: t,
			encoding: "utf-8"
		});
	} catch {}
	e.push({
		path: "sitemap.xml",
		content: zM(Q.siteDraft.pages, location.origin),
		encoding: "utf-8"
	}), e.push({
		path: "robots.txt",
		content: BM(location.origin),
		encoding: "utf-8"
	});
	let o = new Set(e.map((e) => e.path)), s = (t) => {
		o.has(t) || e.push({
			path: t,
			delete: !0
		});
	};
	for (let e of Q.site.pages) {
		let t = Q.siteDraft.pages.find((t) => t.id === e.id);
		t ? t.path !== e.path && e.path !== "/" && s(`${e.path.slice(1)}/index.html`) : (s(e.file), e.path !== "/" && s(`${e.path.slice(1)}/index.html`));
	}
	let c = await fj.confirmNoConflict(e);
	if (!c.ok) {
		OM.setStatus(K("status.publishAborted"), "error");
		return;
	}
	let l = {
		message: K("publish.commitMessage", { titles: t.join(", ") || K("publish.theSite") }),
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
		t ? fj.baseSha = t : fj.refreshBaseSha(), JM($.store.data), YM(Q.siteDraft);
		for (let e of n) localStorage.removeItem(e);
		for (let e of r) $.pendingPublished.add(e);
		if (Q.site = JSON.parse(JSON.stringify(Q.siteDraft)), Q.siteStore = ww("urd-draft-site", () => Q.site, OM.draftSaveError), Q.linkSiteDraft(), _O.pluginsStore) {
			let e = JSON.parse(JSON.stringify(_O.pluginsStore.data));
			_O.pluginsStore = ww("urd-draft-plugins", () => e, OM.draftSaveError), _O.syncPluginsView();
		}
		if (YA.collectionsIndexStore) {
			for (let e of Object.values(YA.collectionStores)) for (let t of e.data.entries) WM(t, []);
			let e = JSON.parse(JSON.stringify(YA.collectionsIndexStore.data));
			YA.collectionsIndexStore = ww("urd-draft-collections", () => e, OM.draftSaveError, "urd-draft-samlinger"), YA.publishedCollections = {};
			for (let e of YA.collectionIds) {
				if (!YA.collectionStores[e]) continue;
				let t = JSON.parse(JSON.stringify(YA.collectionStores[e].data));
				YA.publishedCollections[e] = t, YA.collectionStores[e] = ww(`urd-draft-collection-${e}`, () => t, OM.draftSaveError, `urd-draft-samling-${e}`);
			}
			YA.syncCollectionsView();
		}
		if (bT.templatesIndexStore) {
			for (let e of Object.values(bT.templateStores)) {
				e.data?.section && qM(e.data.section, []);
				for (let t of e.data?.blocks ?? []) KM(t, []);
				for (let t of e.data?.page?.sections ?? []) qM(t, []);
			}
			let e = JSON.parse(JSON.stringify(bT.templatesIndexStore.data));
			bT.templatesIndexStore = ww("urd-draft-templates", () => e, OM.draftSaveError, "urd-draft-maler"), bT.publishedTemplates = {};
			for (let e of bT.templateIds) {
				if (!bT.templateStores[e]) continue;
				let t = JSON.parse(JSON.stringify(bT.templateStores[e].data));
				bT.publishedTemplates[e] = t, bT.templateStores[e] = ww(`urd-draft-template-${e}`, () => t, OM.draftSaveError, `urd-draft-mal-${e}`);
			}
			bT.pushTemplatesToPreview();
		}
		Q.grid = {
			snap: !0,
			...Q.siteDraft.grid
		};
		let i = JSON.parse(JSON.stringify($.store.data));
		$.store = ww(`urd-draft-${$.pageId}`, () => i, OM.draftSaveError), $.pendingPublished.has($.pageId) && OM.writeDraftKey(`urd-draft-${$.pageId}`, JSON.stringify(i)), DA.updateDirty(), OM.setStatus(K("status.published"), "info"), fj.awaitPublishDeploy(e);
	} else if (u?.status === 401) {
		let e = await u.json().catch(() => null);
		OM.setStatus(e?.code === "loginExpired" ? K("status.loginExpired") : K("status.loginRequired", { reason: ba(e) ?? K("status.unknownReason") }), "error"), await OM.checkAuth();
	} else u?.status === 403 ? OM.setStatus(ba(await u.json().catch(() => null)) ?? K("status.noPublishAccess"), "error") : u?.status === 409 ? OM.setStatus(K("status.publishRace"), "error") : u ? OM.setStatus(ba(await u.json().catch(() => null)) ?? K("status.publishFailed"), "error") : OM.setStatus(K("status.publishUnavailable"), "error");
}
function nN() {
	Pn(() => {
		if (!F(XM)) return;
		let e = (e) => {
			F(ZM)?.contains(e.target) ? e.target instanceof Element && e.target.closest(".discard-confirm") && (e.preventDefault(), e.stopPropagation(), $M()) : k(XM, !1);
		}, t = (e) => {
			e.key === "Escape" && k(XM, !1);
		}, n = !1, r = (e) => {
			n = !!F(ZM)?.contains(e.target);
		}, i = () => {
			n = !1;
		}, a = () => {
			n || k(XM, !1);
		};
		return window.addEventListener("pointerdown", r, !0), window.addEventListener("pointerup", i, !0), window.addEventListener("click", e, !0), window.addEventListener("keydown", t, !0), window.addEventListener("blur", a), () => {
			window.removeEventListener("pointerdown", r, !0), window.removeEventListener("pointerup", i, !0), window.removeEventListener("click", e, !0), window.removeEventListener("keydown", t, !0), window.removeEventListener("blur", a);
		};
	});
}
var rN = {
	materializeField: UM,
	materializeEntryImages: WM,
	materializeBackground: GM,
	materializeBlockImages: KM,
	materializeSection: qM,
	materializeImages: JM,
	materializeSiteImages: YM,
	get discardArmed() {
		return F(XM);
	},
	set discardArmed(e) {
		k(XM, e, !0);
	},
	get discardWrapEl() {
		return F(ZM);
	},
	set discardWrapEl(e) {
		k(ZM, e, !0);
	},
	requestDiscard: QM,
	confirmDiscard: $M,
	discard: eN,
	publish: tN,
	effects: nN
}, iN = /* @__PURE__ */ L("<button class=\"chrome-restore\"><!> </button>"), aN = /* @__PURE__ */ L("<button type=\"button\"></button>"), oN = /* @__PURE__ */ L("<aside><div class=\"panel-head\"><h2> </h2> <!></div> <!></aside>"), sN = /* @__PURE__ */ L("<div class=\"workspace\"><!> <!> <!></div>"), cN = /* @__PURE__ */ L("<p class=\"loading\"> </p>"), lN = /* @__PURE__ */ L("<div><span> </span> <button class=\"toast-x\">×</button></div>"), uN = /* @__PURE__ */ L("<div class=\"editor\"><!> <!> <!> <!> <!> <!> <!> <!></div> <!>", 1);
function dN(e, t) {
	at(t, !0);
	let n = [
		LM,
		DA,
		XD,
		OM,
		Q,
		$,
		YA,
		bT,
		_O,
		fj,
		qE,
		fD,
		rN
	], r = {};
	for (let e of n) Object.defineProperties(r, Object.getOwnPropertyDescriptors(e));
	Object.assign(r, {
		blockLabel: (e) => qE.BLOCK_LABELS[e] ?? e,
		blockEntranceOptions: () => $.BLOCK_ENTRANCE_OPTIONS,
		hoverOptions: () => $.HOVER_OPTIONS,
		openPanel: (e, t = {}) => {
			t.calendars && (Q.siteCalendarsOpen = !0), OM.activePanel = e;
		},
		openCollection: (e) => {
			YA.activeCollection = e, OM.activePanel = "collections";
		},
		openDesignPicker: () => {
			$.designPicker = { mode: "set" };
		},
		openPhonePicker: () => {
			$.designPicker = { mode: "phone" };
		},
		openCardPicker: () => {
			$.designPicker = { mode: "card" };
		}
	}), it("urd-editor", r);
	for (let e of n) e.effects?.();
	ia(() => {
		r.init();
	});
	var i = uN();
	Br("keydown", hn, function(...e) {
		r.onKeydown?.apply(this, e);
	}), Br("pointerdown", hn, function(...e) {
		r.onPointerdownWindow?.apply(this, e);
	});
	var a = j(i), o = A(a), s = (e) => {
		var t = iN(), n = A(t);
		V(n, () => q.pencil);
		var i = N(n);
		E(t), P((e, n) => {
			G(t, "title", e), z(i, ` ${n ?? ""}`);
		}, [() => K("tip.backToEdit"), () => K("ui.edit")]), I("click", t, function(...e) {
			r.toggleChrome?.apply(this, e);
		}), R(e, t);
	};
	B(o, (e) => {
		r.chromeVisible || e(s);
	});
	var c = N(o, 2);
	tw(c, {});
	var l = N(c, 2), u = (e) => {
		var t = sN(), n = A(t);
		hw(n, {});
		var i = N(n, 2), a = (e) => {
			var t = oN();
			let n;
			var i = A(t), a = A(i), o = M(a, !0), s = N(a, 2), c = (e) => {
				var t = aN();
				let n;
				V(t, () => q.foldToggle, !0), E(t), P((e, i) => {
					n = H(t, 1, "fold-all fold-toggle", null, n, { collapse: r.panelAllOpen }), G(t, "title", e), G(t, "aria-label", i);
				}, [() => K(r.panelAllOpen ? "ui.collapseAll" : "ui.expandAll"), () => K(r.panelAllOpen ? "ui.collapseAll" : "ui.expandAll")]), I("click", t, function(...e) {
					r.togglePanelGroups?.apply(this, e);
				}), R(e, t);
			};
			B(s, (e) => {
				r.panelHasGroups && e(c);
			}), E(i);
			var l = N(i, 2), u = (e) => {
				qc(e, {});
			}, d = (e) => {
				tp(e, {});
			}, f = (e) => {
				Tm(e, {});
			}, p = (e) => {
				Pm(e, {});
			}, m = (e) => {
				Wh(e, {});
			}, h = (e) => {
				Kh(e, {});
			}, g = (e) => {
				Ix(e, {});
			}, _ = (e) => {
				rS(e, {});
			}, v = (e) => {
				SS(e, {});
			}, y = (e) => {
				jS(e, {});
			}, b = (e) => {
				LS(e, {});
			}, x = (e) => {
				QS(e, {});
			};
			B(l, (e) => {
				r.activePanel === "pages" ? e(u) : r.activePanel === "nav" ? e(d, 1) : r.activePanel === "site" ? e(f, 2) : r.activePanel === "theme" ? e(p, 3) : r.activePanel === "blocks" ? e(m, 4) : r.activePanel === "grid" ? e(h, 5) : r.activePanel === "properties" ? e(g, 6) : r.activePanel === "footer" ? e(_, 7) : r.activePanel === "collections" ? e(v, 8) : r.activePanel === "plugins" ? e(y, 9) : r.activePanel === "history" ? e(b, 10) : r.activePanel === "update" && e(x, 11);
			}), E(t), Zi(t, (e) => r.panelEl = e, () => r?.panelEl), P((e) => {
				n = H(t, 1, "panel", null, n, { hidden: !r.chromeVisible }), G(a, "title", e), z(o, r.PANEL_LABELS[r.activePanel]);
			}, [() => r.PANEL_INTROS[r.activePanel]?.map((e) => K(e)).join("\n")]), R(e, t);
		};
		B(i, (e) => {
			r.activePanel && e(a);
		}), _w(N(i, 2), {}), E(t), R(e, t);
	}, d = (e) => {
		var t = cN(), n = M(t, !0);
		P((e) => z(n, e), [() => K("ui.loading")]), R(e, t);
	};
	B(l, (e) => {
		r.site ? e(u) : e(d, -1);
	});
	var f = N(l, 2), p = (e) => {
		eC(e, {
			get image() {
				return r.iconEditorImage;
			},
			get onapply() {
				return r.applyIcon;
			},
			oncancel: () => r.iconEditorImage = null
		});
	};
	B(f, (e) => {
		r.iconEditorImage && e(p);
	});
	var m = N(f, 2), h = (e) => {
		{
			let t = /* @__PURE__ */ D(() => r.designPicker.mode === "set" ? wh(r.selectedBlock?.props.design).id : r.designPicker.mode === "phone" ? th(r.selectedBlock?.props) : r.designPicker.mode === "card" ? ch(r.selectedBlock?.props) : null), n = /* @__PURE__ */ D(() => wh(r.selectedBlock?.props.design).id), i = /* @__PURE__ */ D(() => r.selectedBlock ? Ze(r.selectedBlock.props) : {}), a = /* @__PURE__ */ D(() => r.siteDraft ? Ze(r.siteDraft) : null), o = /* @__PURE__ */ D(() => r.store?.data ? Ze(r.store.data) : null);
			kC(e, {
				get mode() {
					return r.designPicker.mode;
				},
				get current() {
					return F(t);
				},
				get design() {
					return F(n);
				},
				get props() {
					return F(i);
				},
				get site() {
					return F(a);
				},
				get page() {
					return F(o);
				},
				onpick: (e) => {
					r.designPicker.mode === "add" ? r.addCalendarDesign(e) : r.designPicker.mode === "phone" ? r.setCalendarPhoneView(e) : r.designPicker.mode === "card" ? r.setCalendarCard(e) : r.setCalendarDesign(e), r.designPicker = null;
				},
				onclose: () => r.designPicker = null
			});
		}
	};
	B(m, (e) => {
		r.designPicker && e(h);
	});
	var g = N(m, 2);
	xw(g, {});
	var _ = N(g, 2);
	Cw(_, {});
	var v = N(_, 2), y = (e) => {
		var t = lN();
		let n;
		var i = A(t), a = M(i, !0), o = N(i, 2);
		E(t), P((e) => {
			n = H(t, 1, "toast", null, n, {
				ok: r.statusKind === "ok",
				error: r.statusKind === "error"
			}), z(a, r.status), G(o, "title", e);
		}, [() => K("ui.close")]), I("click", o, () => r.setStatus("")), R(e, t);
	};
	B(v, (e) => {
		r.status && e(y);
	}), E(a);
	var b = N(a, 2), x = (e) => {
		MC(e, {
			get pos() {
				return r.blockMenu;
			},
			onclose: () => r.blockMenu = null
		});
	};
	B(b, (e) => {
		r.blockMenu && r.selectedBlock && e(x);
	}), R(e, i), ot();
}
//#endregion
//#region src/main.js
Vr(["click"]), document.documentElement.lang = await wa();
var fN = ni(dN, { target: document.getElementById("urd-admin") });
//#endregion
export { fN as default };
