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
var g = 1024, _ = 2048, v = 4096, y = 8192, b = 16384, x = 32768, S = 1 << 25, C = 65536, ee = 1 << 19, te = 1 << 20, ne = 1 << 25, w = 65536, re = 1 << 21, ie = 1 << 22, ae = 1 << 23, oe = Symbol("$state"), se = Symbol("component"), ce = Symbol("legacy props"), le = Symbol(""), ue = Symbol("attributes"), de = Symbol("class"), fe = Symbol("style"), pe = Symbol("text"), me = Symbol("form reset"), he = new class extends Error {
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
function T() {
	return Oe(/* @__PURE__ */ un(De));
}
function E(e) {
	if (Te) {
		if (/* @__PURE__ */ un(De) !== null) throw Ce(), _e;
		De = e;
	}
}
function ke(e = 1) {
	if (Te) {
		for (var t = e, n = De; t--;) n = /* @__PURE__ */ un(n);
		De = n;
	}
}
function Ae(e = !0) {
	for (var t = 0, n = De;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ un(n);
		e && n.remove(), n = i;
	}
}
function D(e) {
	if (!e || e.nodeType !== 8) throw Ce(), _e;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function O(e) {
	return e === this.v;
}
function je(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Me(e) {
	return !je(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function Ne() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Pe(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Fe(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Ie() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Le(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Re() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function ze(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Be() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Ve() {
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
var We = [];
function Ge(e, t = !1, n = !1) {
	return Ke(e, /* @__PURE__ */ new Map(), "", We, null, n);
}
function Ke(t, n, r, i, a = null, o = !1) {
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
				d in t && (u[d] = Ke(f, n, r, i, null, o));
			}
			return u;
		}
		if (l(t) === s) {
			u = {}, n.set(t, u), a !== null && n.set(a, u);
			for (var p of Object.keys(t)) u[p] = Ke(t[p], n, r, i, null, o);
			return u;
		}
		if (t instanceof Date) return t.getTime(), structuredClone(t);
		if (typeof t.toJSON == "function" && !o) return Ke(t.toJSON(), n, r, i, t);
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
var qe = null;
function Je(e) {
	qe = e;
}
function Ye(e, t = !1, n) {
	qe = {
		p: qe,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: Jn,
		l: null
	};
}
function Xe(e) {
	var t = qe, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) Cn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, qe = t.p, Ze(e);
}
function Ze(e = {}) {
	return i(e, se, { value: !0 }), e;
}
function Qe() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var $e = [];
function et() {
	var e = $e;
	$e = [], p(e);
}
function tt(e) {
	if ($e.length === 0 && !Nt) {
		var t = $e;
		queueMicrotask(() => {
			t === $e && et();
		});
	}
	$e.push(e);
}
function nt() {
	for (; $e.length > 0;) et();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var rt = ~(_ | v | g);
function it(e, t) {
	e.f = e.f & rt | t;
}
function at(e) {
	e.f & 512 || e.deps === null ? it(e, g) : it(e, v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function ot(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= w, ot(t.deps));
}
function st(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), ot(e.deps), it(e, g);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var ct = !1;
function lt(e) {
	var t = ct;
	try {
		return ct = !1, [e(), ct];
	} finally {
		ct = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
function ut(e, t) {
	if (t) {
		let t = document.body;
		e.autofocus = !0, tt(() => {
			document.activeElement === t && e.focus();
		});
	}
}
function dt(e) {
	Te && /* @__PURE__ */ ln(e) !== null && dn(e);
}
var ft = !1;
function pt() {
	ft || (ft = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[me]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function mt(e) {
	var t = Gn, n = Jn;
	qn(null), Yn(null);
	try {
		return e();
	} finally {
		qn(t), Yn(n);
	}
}
function ht(e, t, n, r = n) {
	e.addEventListener(t, () => mt(n));
	let i = e[me];
	e[me] = i ? () => {
		i(), r(!0);
	} : () => r(!0), pt();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function gt(e, t, n, r) {
	let i = Qe() ? bt : Ct;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = Jn, c = _t(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				gn(e, s);
			}
			vt();
		}
	}
	var d = yt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ St(e))).then(u).catch((e) => gn(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), vt();
	}) : f();
}
function _t() {
	var e = Jn, t = Gn, n = qe, r = kt;
	return function(i = !0) {
		Yn(e), qn(t), Je(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function vt(e = !0) {
	Yn(null), qn(null), Je(null), e && kt?.deactivate();
}
function yt() {
	var e = Jn, t = e.b, n = kt, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function bt(e) {
	var t = 2 | _;
	return Jn !== null && (Jn.f |= ee), {
		ctx: qe,
		deps: null,
		effects: null,
		equals: O,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: ve,
		wv: 0,
		parent: Jn,
		ac: null
	};
}
var xt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function St(e, t, n) {
	let r = Jn;
	r === null && Ne();
	var i = void 0, a = Yt(ve), o = !Gn, s = /* @__PURE__ */ new Set();
	return En(() => {
		var t = Jn, n = m();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== he && n.reject(e);
			}).finally(vt);
		} catch (e) {
			n.reject(e), vt();
		}
		var c = kt;
		if (o) {
			if (t.f & 32768) var l = yt();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(xt);
			else for (let e of s.values()) e.reject(xt);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== xt && (c.activate(), t ? (a.f |= ae, Zt(a, t)) : (a.f & 8388608 && (a.f ^= ae), Zt(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), xn(() => {
		for (let e of s) e.reject(xt);
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
function k(e) {
	let t = /* @__PURE__ */ bt(e);
	return Zn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function Ct(e) {
	let t = /* @__PURE__ */ bt(e);
	return t.equals = Me, t;
}
function wt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Nn(t[n]);
	}
}
function A(e) {
	var t, n = Jn, r = e.parent;
	if (!Un && r !== null && e.v !== ve && r.f & 24576) return Se(), e.v;
	Yn(r);
	try {
		e.f &= ~w, wt(e), t = lr(e);
	} finally {
		Yn(n);
	}
	return t;
}
function Tt(e) {
	var t = A(e);
	if (!e.equals(t) && (e.wv = or(), (!kt?.is_fork || e.deps === null) && (kt === null ? e.v = t : (kt.capture(e, t, !0), At?.capture(e, t, !0)), e.deps === null))) {
		it(e, g);
		return;
	}
	Un || (jt === null ? at(e) : (bn() || kt?.is_fork) && jt.set(e, t));
}
function Et(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && mt(() => {
		t.ac.abort(he), t.ac = null;
	}), t.fn !== null && (t.teardown = f), fr(t, 0), jn(t));
}
function Dt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && pr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var Ot = null, kt = null, At = null, jt = null, Mt = null, Nt = !1, j = !1, Pt = null, Ft = null, It = 0, Lt = 1, Rt = class e {
	id = Lt++;
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
			for (var r of n.d) it(r, _), t(r);
			for (r of n.m) it(r, v), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, It++ > 1e3 && (this.#x(), Bt());
		for (let e of this.#u) this.#d.delete(e), it(e, _), this.schedule(e);
		for (let e of this.#d) it(e, v), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = Pt = [], r = [], i = Ft = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Gt(e), this.#h() || this.discard(), t;
		}
		if (kt = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (Pt = null, Ft = null, this.#h()) {
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
		s !== null && (qt.clear(), s.#g());
	}
	#_(e, t, n) {
		e.f ^= g;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= g : i & 4 ? t.push(r) : sr(r) && (i & 16 && this.#d.add(r), pr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), it(i, _), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), kt = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) st(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== ve && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), jt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		kt = this;
	}
	deactivate() {
		kt = null, jt = null;
	}
	flush() {
		try {
			j = !0, kt = this, this.#g();
		} finally {
			It = 0, Mt = null, Pt = null, Ft = null, j = !1, kt = null, jt = null, qt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(xt);
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
		this.#m || (this.#m = !0, tt(() => {
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
			!j && !Nt && tt(() => {
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
			if (Pt !== null && t === Jn && (Gn === null || !(Gn.f & 2))) return;
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
			if (nt(), kt === null) return n;
			kt.flush();
		}
	} finally {
		Nt = t;
	}
}
function Bt() {
	try {
		Re();
	} catch (e) {
		gn(e, Mt);
	}
}
var Vt = null;
function Ht(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && sr(r) && (Vt = /* @__PURE__ */ new Set(), pr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Fn(r), Vt?.size > 0)) {
				qt.clear();
				for (let e of Vt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Vt.has(n) && (Vt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || pr(n);
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
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), it(e, g);
		for (var n = e.first; n !== null;) Wt(n, t), n = n.next;
	}
}
function Gt(e) {
	it(e, g);
	for (var t = e.first; t !== null;) Gt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Kt = /* @__PURE__ */ new Set(), qt = /* @__PURE__ */ new Map(), Jt = !1;
function Yt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: O,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function M(e, t) {
	let n = Yt(e, t);
	return Zn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Xt(e, t = !1, n = !0) {
	let r = Yt(e);
	return t || (r.equals = Me), r;
}
function N(e, t, n = !1) {
	return Gn !== null && (!Kn || Gn.f & 131072) && Qe() && Gn.f & 4325394 && (Xn === null || !Xn.has(e)) && He(), Zt(e, n ? tn(t) : t, Ft);
}
function Zt(e, t, n = null) {
	if (!e.equals(t)) {
		Un ? qt.set(e, t) : qt.has(e) || qt.set(e, e.v);
		var r = Rt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && A(t), jt === null && at(t);
		}
		e.wv = or(), en(e, _, n), Qe() && Jn !== null && Jn.f & 1024 && !(Jn.f & 96) && (er === null ? tr([e]) : er.push(e)), !r.is_fork && Kt.size > 0 && !Jt && Qt();
	}
	return t;
}
function Qt() {
	Jt = !1;
	for (let e of Kt) {
		e.f & 1024 && it(e, v);
		let t;
		try {
			t = sr(e);
		} catch {
			t = !0;
		}
		t && pr(e);
	}
	Kt.clear();
}
function $t(e) {
	N(e, e.v + 1);
}
function en(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Qe(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === Jn)) {
			var l = (c & _) === 0;
			if (l && it(s, t), c & 131072) Kt.add(s);
			else if (c & 2) {
				var u = s;
				jt?.delete(u), c & 65536 || (c & 512 && (Jn === null || !(Jn.f & 2097152)) && (s.f |= w), en(u, v, n));
			} else if (l) {
				var d = s;
				c & 16 && Vt !== null && Vt.add(d), n === null ? Ut(d) : n.push(d);
			}
		}
	}
}
function tn(t) {
	if (typeof t != "object" || !t || oe in t || se in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ M(0), u = null, d = ir, f = (e) => {
		if (ir === d) return e();
		var t = Gn, n = ir;
		qn(null), ar(d);
		var r = e();
		return qn(t), ar(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ M(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && Be();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ M(n.value, u);
				return r.set(t, e), e;
			}) : N(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ M(ve, u));
					r.set(t, e), $t(o);
				}
			} else N(n, ve), $t(o);
			return !0;
		},
		get(e, n, i) {
			if (n === oe) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ M(tn(s ? e[n] : ve), u)), r.set(n, o)), o !== void 0) {
				var c = z(o);
				return c === ve ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			var n = Reflect.getOwnPropertyDescriptor(e, t);
			if (n && "value" in n) {
				var i = r.get(t);
				i && (n.value = z(i));
			} else if (n === void 0) {
				var a = r.get(t), o = a?.v;
				if (a !== void 0 && o !== ve) return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return n;
		},
		has(e, t) {
			if (t === oe) return !0;
			var n = r.get(t), i = n !== void 0 && n.v !== ve || Reflect.has(e, t);
			return (n !== void 0 || Jn !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ M(i ? tn(e[t]) : ve, u)), r.set(t, n)), z(n) === ve) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ M(ve, u)), r.set(d + "", p)) : N(p, ve);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ M(void 0, u)), N(c, tn(n)), r.set(t, c));
			else {
				l = c.v !== ve;
				var m = f(() => tn(n));
				N(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && N(g, _ + 1);
				}
				$t(o);
			}
			return !0;
		},
		ownKeys(e) {
			z(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== ve;
			});
			for (var [n, i] of r) i.v !== ve && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			Ve();
		}
	});
}
var nn, rn, an, on;
function sn() {
	if (nn === void 0) {
		nn = window, rn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		an = a(t, "firstChild").get, on = a(t, "nextSibling").get, u(e) && (e[de] = void 0, e[ue] = null, e[fe] = void 0, e.__e = void 0), u(n) && (n[pe] = void 0);
	}
}
function cn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function ln(e) {
	return an.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function un(e) {
	return on.call(e);
}
function P(e, t) {
	if (!Te) return /* @__PURE__ */ ln(e);
	var n = /* @__PURE__ */ ln(De);
	if (n === null) n = De.appendChild(cn());
	else if (t && n.nodeType !== 3) {
		var r = cn();
		return n?.before(r), Oe(r), r;
	}
	return t && mn(n), Oe(n), n;
}
function F(e, t = !1) {
	if (!Te) {
		var n = /* @__PURE__ */ ln(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ un(n) : n;
	}
	if (t) {
		if (De?.nodeType !== 3) {
			var r = cn();
			return De?.before(r), Oe(r), r;
		}
		mn(De);
	}
	return De;
}
function I(e, t = !1) {
	if (!Te) return /* @__PURE__ */ ln(e);
	var n = P(e, t);
	return E(e), n;
}
function L(e, t = 1, n = !1) {
	let r = Te ? De : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ un(r);
	if (!Te) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = cn();
			return r === null ? i?.after(a) : r.before(a), Oe(a), a;
		}
		mn(r);
	}
	return Oe(r), r;
}
function dn(e) {
	e.textContent = "";
}
function fn() {
	return !1;
}
function pn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function mn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function hn(e) {
	var t = Jn;
	if (t === null) return Gn.f |= ae, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	gn(e, t);
}
function gn(e, t) {
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
function _n(e) {
	Jn === null && (Gn === null && Le(e), Ie()), Un && Fe(e);
}
function vn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function yn(e, t) {
	var n = Jn;
	n !== null && n.f & 8192 && (e |= y);
	var r = {
		ctx: qe,
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
	if (e & 4) Pt === null ? Rt.ensure().schedule(r) : Pt.push(r);
	else if (t !== null) {
		try {
			pr(r);
		} catch (e) {
			throw Nn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= C));
	}
	if (i !== null && (i.parent = n, n !== null && vn(i, n), Gn !== null && Gn.f & 2 && !(e & 64))) {
		var a = Gn;
		(a.effects ??= []).push(i);
	}
	return r;
}
function bn() {
	return Gn !== null && !Kn;
}
function xn(e) {
	let t = yn(8, null);
	return it(t, g), t.teardown = e, t;
}
function Sn(e) {
	_n("$effect");
	var t = Jn.f;
	if (!Gn && t & 32 && qe !== null && !qe.i) {
		var n = qe;
		(n.e ??= []).push(e);
	} else return Cn(e);
}
function Cn(e) {
	return yn(4 | te, e);
}
function wn(e) {
	Rt.ensure();
	let t = yn(64 | ee, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? In(t, () => {
			Nn(t), n(void 0);
		}) : (Nn(t), n(void 0));
	});
}
function Tn(e) {
	return yn(4, e);
}
function En(e) {
	return yn(ie | ee, e);
}
function Dn(e, t = 0) {
	return yn(8 | t, e);
}
function R(e, t = [], n = [], r = []) {
	gt(r, t, n, (t) => {
		yn(8, () => {
			e(...t.map(z));
		});
	});
}
function On(e, t = 0) {
	return yn(16 | t, e);
}
function kn(e) {
	return yn(32 | ee, e);
}
function An(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Un, r = Gn;
		Wn(!0), qn(null);
		try {
			t.call(null);
		} catch (t) {
			gn(t, e.parent);
		} finally {
			Wn(n), qn(r);
		}
	}
}
function jn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && mt(() => {
			e.abort(he);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Nn(n, t), n = r;
	}
}
function Mn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Nn(t), t = n;
	}
}
function Nn(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Pn(e.nodes.start, e.nodes.end), n = !0), e.f |= S, jn(e, t && !n), fr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	An(e), e.f ^= S, e.f |= b;
	var i = e.parent;
	i !== null && i.first !== null && Fn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Pn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ un(e);
		e.remove(), e = n;
	}
}
function Fn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function In(e, t, n = !0) {
	var r = [];
	e.f |= 256, Ln(e, r, !0);
	var i = () => {
		n && Nn(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Ln(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= y;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Ln(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Rn(e) {
	e.f &= -257, zn(e, !0);
}
function zn(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= y, e.f & 1024 || (it(e, _), Rt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			zn(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Bn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ un(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Vn = null, Hn = !1, Un = !1;
function Wn(e) {
	Un = e;
}
var Gn = null, Kn = !1;
function qn(e) {
	Gn = e;
}
var Jn = null;
function Yn(e) {
	Jn = e;
}
var Xn = null;
function Zn(e) {
	Gn !== null && (Xn ??= /* @__PURE__ */ new Set()).add(e);
}
var Qn = null, $n = 0, er = null;
function tr(e) {
	er = e;
}
var nr = 1, rr = 0, ir = rr;
function ar(e) {
	ir = e;
}
function or() {
	return ++nr;
}
function sr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~w), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (sr(a) && Tt(a), a.wv > e.wv) return !0;
		}
		t & 512 && jt === null && it(e, g);
	}
	return !1;
}
function cr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Xn !== null && Xn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? cr(a, t, !1) : t === a && (n ? it(a, _) : a.f & 1024 && it(a, v), Ut(a));
	}
}
function lr(e) {
	var t = Qn, n = $n, r = er, i = Gn, a = Xn, o = qe, s = Kn, c = ir, l = e.f;
	Qn = null, $n = 0, er = null, Gn = l & 96 ? null : e, Xn = null, Je(e.ctx), Kn = !1, ir = ++rr, e.ac !== null && (mt(() => {
		e.ac.abort(he);
	}), e.ac = null);
	try {
		e.f |= re;
		var u = e.fn, d = u();
		e.f |= x;
		var f = ur(e);
		if (Qe() && er !== null && !Kn && f !== null && !(e.f & 6146)) for (var p = 0; p < er.length; p++) cr(er[p], e);
		if (i !== null && i !== e) {
			if (rr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = rr;
			if (t !== null) for (let e of t) e.rv = rr;
			er !== null && (r === null ? r = er : r.push(...er));
		}
		return e.f & 8388608 && (e.f ^= ae), d;
	} catch (t) {
		return ur(e), hn(t);
	} finally {
		e.f ^= re, Qn = t, $n = n, er = r, Gn = i, Xn = a, Je(o), Kn = s, ir = c;
	}
}
function ur(e) {
	var t = e.deps, n = kt?.is_fork;
	if (Qn !== null) {
		var r;
		if (n || fr(e, $n), t !== null && $n > 0) for (t.length = $n + Qn.length, r = 0; r < Qn.length; r++) t[$n + r] = Qn[r];
		else e.deps = t = Qn;
		if (bn() && e.f & 512) for (r = $n; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && $n < t.length && (fr(e, $n), t.length = $n);
	return t;
}
function dr(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (Qn === null || !n.call(Qn, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512, s.f &= ~w), s.v !== ve && at(s), s.ac !== null && mt(() => {
			s.ac.abort(he), s.ac = null, it(s, _);
		}), Et(s), fr(s, 0);
	}
}
function fr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) dr(e, n[r]);
}
function pr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		it(e, g);
		var n = Jn, r = Hn;
		Jn = e, Hn = !(t & 96);
		try {
			t & 16777232 ? Mn(e) : jn(e), An(e);
			var i = lr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = nr;
		} finally {
			Hn = r, Jn = n;
		}
	}
}
async function mr() {
	await Promise.resolve(), zt();
}
function z(e) {
	var t = !!(e.f & 2);
	if (Vn?.add(e), Gn !== null && !Kn && !(Jn !== null && Jn.f & 16384) && (Xn === null || !Xn.has(e))) {
		var r = Gn.deps;
		if (Gn.f & 2097152) e.rv < rr && (e.rv = rr, Qn === null && r !== null && r[$n] === e ? $n++ : Qn === null ? Qn = [e] : Qn.push(e));
		else {
			Gn.deps ??= [], n.call(Gn.deps, e) || Gn.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [Gn] : n.call(i, Gn) || i.push(Gn);
		}
	}
	if (Un && qt.has(e)) return qt.get(e);
	if (t) {
		var a = e;
		if (Un) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || gr(a)) && (o = A(a)), qt.set(a, o), o;
		}
		var s = !(a.f & 512) && !Kn && Gn !== null && (Hn || !!(Gn.f & 512)), c = (a.f & x) === 0;
		sr(a) && (s && (a.f |= 512), Tt(a)), s && !c && (Dt(a), hr(a));
	}
	if (jt?.has(e)) return jt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function hr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (Dt(t), hr(t));
}
function gr(e) {
	if (e.v === ve) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (qt.has(t) || t.f & 2 && gr(t)) return !0;
	return !1;
}
function _r(e) {
	var t = Kn;
	try {
		return Kn = !0, e();
	} finally {
		Kn = t;
	}
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var vr = ["touchstart", "touchmove"];
function yr(e) {
	return vr.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var br = Symbol("events"), xr = /* @__PURE__ */ new Set(), Sr = /* @__PURE__ */ new Set();
function Cr(e) {
	if (!Te) return;
	e.removeAttribute("onload"), e.removeAttribute("onerror");
	let t = e.__e;
	t !== void 0 && (e.__e = void 0, queueMicrotask(() => {
		e.isConnected && e.dispatchEvent(t);
	}));
}
function wr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || kr.call(t, e), !e.cancelBubble) return mt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? tt(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function Tr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = wr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && xn(() => {
		t.removeEventListener(e, o, a);
	});
}
function B(e, t, n) {
	(t[br] ??= {})[e] = n;
}
function Er(e) {
	for (var t = 0; t < e.length; t++) xr.add(e[t]);
	for (var n of Sr) n(e);
}
var Dr = null, Or = !1;
function kr(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	Dr = e, Or || (Or = !0, setTimeout(() => {
		Or = !1, Dr = null;
	}));
	var s = 0, c = Dr === e && e[br];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[br] = t;
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
		var d = Gn, f = Jn;
		qn(null), Yn(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[br]?.[r];
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
			e[br] = t, delete e.currentTarget, qn(d), Yn(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var Ar = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function jr(e) {
	return Ar?.createHTML(e) ?? e;
}
function Mr(e) {
	var t = pn("template");
	return t.innerHTML = jr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function Nr(e, t) {
	var n = Jn;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function V(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (Te) return Nr(De, null), De;
		i === void 0 && (i = Mr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ ln(i)));
		var t = r || rn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ ln(t), s = t.lastChild;
			Nr(o, s);
		} else Nr(t, t);
		return t;
	};
}
function Pr(e = "") {
	if (!Te) {
		var t = cn(e + "");
		return Nr(t, t), t;
	}
	var n = De;
	return n.nodeType === 3 ? mn(n) : (n.before(n = cn()), Oe(n)), Nr(n, n), n;
}
function Fr() {
	if (Te) return Nr(De, null), De;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = cn();
	return e.append(t, n), Nr(t, n), e;
}
function H(e, t) {
	if (Te) {
		var n = Jn;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = De), T();
		return;
	}
	e !== null && e.before(t);
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function Ir(e) {
	let t = 0, n = Yt(0), r;
	return () => {
		bn() && (z(n), Dn(() => (t === 0 && (r = _r(() => e(() => $t(n)))), t += 1, () => {
			tt(() => {
				--t, t === 0 && (r?.(), r = void 0, $t(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Lr = C | ee;
function Rr(e, t, n, r) {
	new zr(e, t, n, r);
}
var zr = class {
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
	#h = Ir(() => (this.#m = Yt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = Jn;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = Jn.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = On(() => {
			if (Te) {
				let e = this.#t;
				T();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, Lr), Te && (this.#e = De);
	}
	#g() {
		try {
			this.#a = kn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		tt(r), t && (this.#s = kn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				we();
				return;
			}
			t = !0, n && Ue(), this.#s !== null && In(this.#s, () => {
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
					gn(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = kn(() => e(this.#e)), tt(() => {
			var e = this.#c = document.createDocumentFragment(), t = cn(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
				try {
					return kn(() => this.#r(t));
				} catch (e) {
					try {
						this.error(e), n = !0;
					} catch (e) {
						gn(e, this.#i.parent);
					}
					return null;
				}
			}), this.#a === null) {
				this.#c = null, n && this.#x(kt);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, In(this.#o, () => {
				this.#o = null;
			}), this.#x(kt));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = kn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Bn(this.#a, e);
				let t = this.#n.pending;
				this.#o = kn(() => t(this.#e));
			} else this.#x(kt);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		st(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = Jn, n = Gn, r = qe;
		Yn(this.#i), qn(this.#i), Je(this.#i.ctx);
		try {
			return Rt.ensure(), e();
		} finally {
			Yn(t), qn(n), Je(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && In(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, tt(() => {
			this.#d = !1, this.#m && Zt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), z(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		kt?.is_fork ? (this.#a && kt.skip_effect(this.#a), this.#o && kt.skip_effect(this.#o), this.#s && kt.skip_effect(this.#s), kt.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (Nn(this.#a), null), this.#o &&= (Nn(this.#o), null), this.#s &&= (Nn(this.#s), null), Te && (Oe(this.#t), ke(), Oe(Ae()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return kn(() => {
						var r = Jn;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return gn(e, this.#i.parent), null;
				}
			}));
		};
		tt(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				gn(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => gn(e, this.#i && this.#i.parent)) : n(t);
		});
	}
}, Br = !0;
function U(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[pe] ??= e.nodeValue) && (e[pe] = n, e.nodeValue = `${n}`);
}
function Vr(e, t) {
	return Ur(e, t);
}
var Hr = /* @__PURE__ */ new Map();
function Ur(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	sn();
	var l = void 0, u = wn(() => {
		var u = n ?? t.appendChild(cn());
		Rr(u, { pending: () => {} }, (t) => {
			Ye({});
			var n = qe;
			if (o && (n.c = o), a && (i.$$events = a), Te && Nr(t, null), Br = s, l = e(t, i) || Ze(), Br = !0, Te && (Jn.nodes.end = De, De === null || De.nodeType !== 8 || De.data !== "]")) throw Ce(), _e;
			Xe();
		}, c);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!d.has(r)) {
					d.add(r);
					var i = yr(r);
					for (let e of [t, document]) {
						var a = Hr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Hr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, kr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(r(xr)), Sr.add(f), () => {
			for (var e of d) for (let n of [t, document]) {
				var r = Hr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, kr), r.delete(e), r.size === 0 && Hr.delete(n)) : r.set(e, i);
			}
			Sr.delete(f), u !== n && u.parentNode?.removeChild(u);
		};
	});
	return Wr.set(l, u), l;
}
var Wr = /* @__PURE__ */ new WeakMap(), Gr = class {
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
			if (n) Rn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Rn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (Nn(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Bn(r, t), t.append(cn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else Nn(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), In(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (Nn(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = kt, r = fn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = cn();
				i.append(a), this.#n.set(e, {
					effect: kn(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, kn(() => t(this.anchor)));
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
function W(e, t, n = !1) {
	var r;
	Te && (r = De, T());
	var i = new Gr(e), a = n ? C : 0;
	function o(e, t) {
		if (Te) {
			var n = D(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Ae();
				Oe(a), i.anchor = a, Ee(!1), i.ensure(e, t), Ee(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	On(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Kr(e, t) {
	return t;
}
function qr(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		In(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					Jr(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = i.length === 0 && n !== null && e.pending.size === 0;
		if (l) {
			var u = n, d = u.parentNode;
			dn(d), d.append(u), e.items.clear();
		}
		Jr(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function Jr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ne, Bn(a, document.createDocumentFragment())) : Nn(t[i], n);
	}
}
var Yr;
function Xr(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = Te ? Oe(/* @__PURE__ */ ln(u)) : u.appendChild(cn());
	}
	Te && T();
	var d = null, f = /* @__PURE__ */ Ct(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Qr(v, p, c, n, a), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= ne, ei(d, null, c)) : Rn(d) : In(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: On(() => {
			p = z(f);
			var e = p.length;
			let t = !1;
			Te && D(c) === "[!" != (e === 0) && (c = Ae(), Oe(c), Ee(!1), t = !0);
			for (var r = /* @__PURE__ */ new Set(), u = kt, v = fn(), y = 0; y < e; y += 1) {
				Te && De.nodeType === 8 && De.data === "]" && (c = De, t = !0, Ee(!1));
				var b = p[y], x = a(b, y), S = h ? null : l.get(x);
				S ? (S.v && Zt(S.v, b), S.i && Zt(S.i, y), v && u.unskip_effect(S.e)) : (S = $r(l, h ? c : Yr ??= cn(), b, x, y, o, n, i), h || (S.e.f |= ne), l.set(x, S)), r.add(x);
			}
			if (e === 0 && s && !d && (h ? d = kn(() => s(c)) : (d = kn(() => s(Yr ??= cn())), d.f |= ne)), e > r.size && Pe("", "", ""), Te && e > 0 && Oe(Ae()), !h) {
				if (m.set(u, r), v) {
					for (let [e, t] of l) r.has(e) || u.skip_effect(t.e);
					u.oncommit(g), u.ondiscard(_);
				} else g(u);
			}
			t && Ee(!0), z(f);
		}),
		flags: n,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, Te && (c = De);
}
function Zr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Qr(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = Zr(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Rn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= ne, _ === l) ei(_, null, n);
			else {
				var y = d ? d.next : l;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), ti(e, d, _), ti(e, _, y), ei(_, y, n), d = _, p = [], m = [], l = Zr(d.next);
				continue;
			}
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) ei(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					ti(e, S.prev, C.next), ti(e, d, S), ti(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), ei(_, l, n), ti(e, _.prev, _.next), ti(e, _, d === null ? e.effect.first : d.next), ti(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Zr(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Zr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Jr(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var ee = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || ee.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && ee.push(l), l = Zr(l.next);
		var te = ee.length;
		if (te > 0) {
			var w = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < te; v += 1) ee[v].nodes?.a?.measure();
				for (v = 0; v < te; v += 1) ee[v].nodes?.a?.fix();
			}
			qr(e, ee, w);
		}
	}
	o && tt(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function $r(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Yt(n) : /* @__PURE__ */ Xt(n, !1, !1) : null, l = o & 2 ? Yt(i) : null;
	return {
		v: c,
		i: l,
		e: kn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function ei(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ un(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function ti(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
function G(e, t, n = !1, r = !1, i = !1, a = !1) {
	var o = e, s = "";
	if (n) {
		var c = e;
		Te && (o = Oe(/* @__PURE__ */ ln(c)));
	}
	R(() => {
		var e = Jn;
		if (s === (s = t() ?? "")) {
			Te && T();
			return;
		}
		if (n && !Te) {
			e.nodes = null, c.innerHTML = s, s !== "" && Nr(/* @__PURE__ */ ln(c), c.lastChild);
			return;
		}
		if (e.nodes !== null && (Pn(e.nodes.start, e.nodes.end), e.nodes = null), s !== "") {
			if (Te) {
				for (var a = De.data, l = T(), u = l; l !== null && (l.nodeType !== 8 || l.data !== "");) u = l, l = /* @__PURE__ */ un(l);
				if (l === null) throw Ce(), _e;
				Nr(De, u), o = Oe(l);
				return;
			}
			var d = pn(r ? "svg" : i ? "math" : "template", r ? be : i ? xe : void 0);
			d.innerHTML = s;
			var f = r || i ? d : d.content;
			if (Nr(/* @__PURE__ */ ln(f), f.lastChild), r || i) for (; /* @__PURE__ */ ln(f);) o.before(/* @__PURE__ */ ln(f));
			else o.before(f);
		}
	});
}
//#endregion
//#region node_modules/svelte/src/internal/client/timing.js
var ni = () => performance.now(), ri = {
	tick: (e) => requestAnimationFrame(e),
	now: () => ni(),
	tasks: /* @__PURE__ */ new Set()
};
//#endregion
//#region node_modules/svelte/src/internal/client/loop.js
function ii() {
	let e = ri.now();
	ri.tasks.forEach((t) => {
		t.c(e) || (ri.tasks.delete(t), t.f());
	}), ri.tasks.size !== 0 && ri.tick(ii);
}
function ai(e) {
	let t;
	return ri.tasks.size === 0 && ri.tick(ii), {
		promise: new Promise((n) => {
			ri.tasks.add(t = {
				c: e,
				f: n
			});
		}),
		abort() {
			ri.tasks.delete(t);
		}
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/transitions.js
function oi(e, t) {
	mt(() => {
		e.dispatchEvent(new CustomEvent(t));
	});
}
function si(e) {
	if (e === "float") return "cssFloat";
	if (e === "offset") return "cssOffset";
	if (e.startsWith("--")) return e;
	let t = e.split("-");
	return t.length === 1 ? t[0] : t[0] + t.slice(1).map((e) => e[0].toUpperCase() + e.slice(1)).join("");
}
function ci(e) {
	let t = {}, n = e.split(";");
	for (let e of n) {
		let [n, r] = e.split(":");
		if (!n || r === void 0) break;
		let i = si(n.trim());
		t[i] = r.trim();
	}
	return t;
}
var li = (e) => e;
function ui(e, t, n, r) {
	var i = !!(e & 1), a = !!(e & 2), o = i && a, s = !!(e & 4), c = o ? "both" : i ? "in" : "out", l, u = t.inert, d = t.style.overflow, f, p;
	function m() {
		return mt(() => l ??= n()(t, r?.() ?? {}, { direction: c }));
	}
	var h = {
		is_global: s,
		in() {
			if (t.inert = u, !i) {
				p?.abort(), p?.reset?.();
				return;
			}
			a || f?.abort(), f = di(t, m(), p, 1, () => {
				oi(t, "introstart");
			}, () => {
				oi(t, "introend"), f?.abort(), f = l = void 0, t.style.overflow = d;
			});
		},
		out(e) {
			if (!a) {
				e?.(), l = void 0;
				return;
			}
			t.inert = !0, p = di(t, m(), f, 0, () => {
				oi(t, "outrostart");
			}, () => {
				oi(t, "outroend"), e?.();
			});
		},
		stop: () => {
			f?.abort(), p?.abort();
		}
	}, g = Jn;
	if ((g.nodes.t ??= []).push(h), i && Br) {
		var _ = s;
		if (!_) {
			for (var v = g.parent; v && v.f & 65536;) for (; (v = v.parent) && !(v.f & 16););
			_ = !v || !!(v.f & 32768);
		}
		_ && Tn(() => {
			_r(() => h.in());
		});
	}
}
function di(e, t, n, r, i, a) {
	var o = r === 1, s = !1;
	if (d(t)) {
		var c;
		return tt(() => {
			s || (c = di(e, t({ direction: o ? "in" : "out" }), n, r, i, a));
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
	let { delay: l = 0, css: u, tick: p, easing: m = li } = t;
	var h, g = () => 1 - r;
	return tt(() => {
		if (!s) {
			var c = [];
			if (o && n === void 0 && (p && p(0, 1), u)) {
				var d = ci(u(0, 1));
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
						var v = o + s * m(_ / f), y = ci(u(v, 1 - v));
						l.push(y), d ||= y.overflow === "hidden";
					}
					d && (e.style.overflow = "hidden"), g = () => {
						var e = h.currentTime;
						return o + s * m(e / c);
					}, p && ai(() => {
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
var fi = [..." 	\n\r\f\xA0\v﻿"];
function pi(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || fi.includes(r[o - 1])) && (s === r.length || fi.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function mi(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function hi(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function gi(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(hi)), i && c.push(...Object.keys(i).map(hi));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = hi(e.substring(l, u).trim());
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
		return r && (n += mi(r)), i && (n += mi(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function _i(e, t, n, r, i, a) {
	var o = e[de];
	if (Te || o !== n || o === void 0) {
		var s = pi(n, r, a);
		(!Te || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[de] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function vi(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function yi(e, t, n, r) {
	var i = e[fe];
	if (Te || i !== t) {
		var a = gi(t, r);
		(!Te || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[fe] = t;
	} else r && (Array.isArray(r) ? (vi(e, n?.[0], r[0]), vi(e, n?.[1], r[1], "important")) : vi(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var bi = Symbol("is custom element"), xi = Symbol("is html"), Si = ge ? "link" : "LINK", Ci = ge ? "progress" : "PROGRESS";
function K(e) {
	if (Te) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					J(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					J(e, "checked", null), e.checked = r;
				}
			}
		};
		e[me] = n, tt(n), pt();
	}
}
function q(e, t) {
	var n = Ti(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === Ci) && (e.value = t ?? "");
}
function wi(e, t) {
	var n = Ti(e);
	n.checked !== (n.checked = t ?? void 0) && (e.checked = t);
}
function J(e, t, n, r) {
	var i = Ti(e);
	Te && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === Si) || i[t] !== (i[t] = n) && (t === "loading" && (e[le] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Di(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function Ti(e) {
	return e[ue] ??= {
		[bi]: e.nodeName.includes("-"),
		[xi]: e.namespaceURI === ye
	};
}
var Ei = /* @__PURE__ */ new Map();
function Di(e) {
	var t = e.getAttribute("is") || e.nodeName, n = Ei.get(t);
	if (n) return n;
	Ei.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.add(s);
		i = l(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function Oi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	ht(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = ki(e) ? Ai(a) : a, n(a), kt !== null && r.add(kt), await mr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (Te && e.defaultValue !== e.value || _r(t) == null && e.value) && (n(ki(e) ? Ai(e.value) : e.value), kt !== null && r.add(kt)), Dn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = kt;
			if (r.has(i)) return;
		}
		ki(e) && n === Ai(e.value) || e.type === "date" && !n && !e.value || n !== e.value && (e.value = n ?? "");
	});
}
function ki(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function Ai(e) {
	return e === "" ? null : +e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function ji(e, t) {
	return e === t || e?.[oe] === t;
}
function Mi(e = Ze(), t, n, r) {
	var i = qe.r, a = Jn;
	return Tn(() => {
		var o, s;
		return Dn(() => {
			o = s, s = r?.() || [], _r(() => {
				ji(n(...s), e) || (t(e, ...s), o && ji(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && ji(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function Ni(e, t, n, r) {
	var i = !0, o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ bt(r), z(u)) : (l && (l = !1, c = s ? _r(r) : r), c);
	let f;
	if (o) {
		var p = oe in e || ce in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = lt(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && ze(t), f(m)));
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
	var v = !1, y = (n & 1 ? bt : Ct)(() => (v = !1, g()));
	o && z(y);
	var b = Jn;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? z(y) : i && o ? tn(e) : e;
			return N(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return Un && v || b.f & 16384 ? y.v : z(y);
	});
}
var Pi = {
	lang: "nb",
	strings: {
		"nav.toFront": "Til forsiden",
		"nav.toLightTheme": "Bytt til lyst tema",
		"nav.toDarkTheme": "Bytt til mørkt tema",
		"nav.menu": "Meny",
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
		"render.missingPlugin": "Blokktypen '{type}' er ikke tilgjengelig (mangler plugin eller nyere Urd?)"
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
}, Fi = [
	"nb",
	"nn",
	"en-GB",
	"se",
	"tr"
], Ii = /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/, Li = {
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
function Ri(e) {
	let t = String(e ?? "").trim().toLowerCase();
	for (let [e, n] of Object.entries(Li)) if (n.some((e) => t === e || t.startsWith(`${e}-`))) return e;
	return null;
}
function zi(e) {
	return Fi.includes(String(e ?? ""));
}
function Bi(e) {
	let t = [];
	if (!Array.isArray(e)) return ["languages must be a list"];
	for (let n of e) {
		if (!n || typeof n != "object" || Array.isArray(n)) {
			t.push("languages: every entry must be an object");
			continue;
		}
		let e = String(n.code ?? "");
		Ii.test(e) ? zi(e) && t.push(`languages: '${e}' is built into Urd and cannot be overridden`) : t.push(`languages: '${e}' is not a valid language code`), (typeof n.name != "string" || !n.name.trim()) && t.push(`languages/${e}: name is missing (the language's own name)`);
		for (let r of ["site", "admin"]) n[r] !== void 0 && typeof n[r] != "boolean" && t.push(`languages/${e}: ${r} must be a boolean`);
		n.site !== !0 && n.admin !== !0 && t.push(`languages/${e}: must cover site, admin or both`);
	}
	return t;
}
function Vi(e) {
	let t = Ri(e);
	if (t) return t;
	let n = String(e ?? "").trim();
	return Ii.test(n) ? n : "nb";
}
async function Hi(e, t) {
	try {
		return await (await import(
			/* @vite-ignore */
			"/assets/urd/language-packs.js"
)).loadPackStrings(e, t);
	} catch {
		return null;
	}
}
({ ...Pi.strings });
var Ui = {
	lang: "nb",
	dict: {}
};
function Wi(e, t) {
	if (!t) return e;
	let n = e;
	for (let [e, r] of Object.entries(t)) n = n.replaceAll(`{${e}}`, String(r));
	return n;
}
function Y(e, t) {
	return Wi(Ui.dict[e] ?? e, t);
}
function Gi(e) {
	let t = `api.${e?.code}`;
	return e?.code && Ui.dict[t] !== void 0 ? Wi(Ui.dict[t], e) : e?.error ?? null;
}
function Ki() {
	return Ui.lang;
}
function qi() {
	let e = null;
	try {
		e = localStorage.getItem("urd-admin-lang");
	} catch {}
	if (e) return Vi(e);
	for (let e of navigator.languages ?? [navigator.language]) {
		let t = Ri(e);
		if (t) return t;
	}
	return "en-GB";
}
var Ji;
new Promise((e) => {
	Ji = e;
});
async function Yi(e = qi()) {
	let t = async (e) => (await import(
		/* @vite-ignore */
		`/assets/urd/locales/admin/${e}.js`
)).default.strings;
	Ui.lang = Vi(e);
	let n = zi(Ui.lang);
	try {
		Object.assign(Ui.dict, await t("nb")), n && Ui.lang !== "nb" && Object.assign(Ui.dict, await t(Ui.lang));
	} catch {}
	if (!n) {
		let e = await Hi(Ui.lang, "admin");
		e ? Object.assign(Ui.dict, e) : Ui.lang = "nb";
	}
	return Ji(Ui.lang), Ui.lang;
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region node_modules/svelte/src/transition/index.js
function Xi(e) {
	let t = e - 1;
	return t * t * t + 1;
}
function Zi(e) {
	let t = typeof e == "string" && e.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
	return t ? [parseFloat(t[1]), t[2] || "px"] : [e, "px"];
}
function Qi(e, { delay: t = 0, duration: n = 400, easing: r = Xi, x: i = 0, y: a = 0, opacity: o = 0 } = {}) {
	let s = getComputedStyle(e), c = +s.opacity, l = s.transform === "none" ? "" : s.transform, u = c * (1 - o), [d, f] = Zi(i), [p, m] = Zi(a);
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
function $i(e, t, n, r) {
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
//#region src/lib/ColorPicker.svelte
var ea = /* @__PURE__ */ V("<button type=\"button\" class=\"cp-clear svelte-zxiloo\">×</button>"), ta = /* @__PURE__ */ V("<button type=\"button\" class=\"cp-eye svelte-zxiloo\"><svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 2l4 4-3 3-4-4 3-3z\"></path><path d=\"M15 5L4 16l-1 5 5-1L19 9\"></path></svg></button>"), na = /* @__PURE__ */ V("<input type=\"number\" min=\"0\" max=\"255\" class=\"svelte-zxiloo\"/>"), ra = /* @__PURE__ */ V("<button type=\"button\"></button>"), ia = /* @__PURE__ */ V("<span class=\"cp-label svelte-zxiloo\"> <!></span> <span class=\"cp-tokens svelte-zxiloo\"></span>", 1), aa = /* @__PURE__ */ V("<span class=\"cp-saved svelte-zxiloo\"><button type=\"button\" class=\"cp-token svelte-zxiloo\"></button> <button type=\"button\" class=\"cp-del svelte-zxiloo\">×</button></span>"), oa = /* @__PURE__ */ V("<span class=\"cp-tokens svelte-zxiloo\"></span>"), sa = /* @__PURE__ */ V("<button type=\"button\" class=\"cp-token svelte-zxiloo\"></button>"), ca = /* @__PURE__ */ V("<span class=\"cp-label svelte-zxiloo\"> </span> <span class=\"cp-tokens svelte-zxiloo\"></span>", 1), la = /* @__PURE__ */ V("<div class=\"cp-pop svelte-zxiloo\"><div class=\"cp-sv svelte-zxiloo\"><span class=\"cp-cursor svelte-zxiloo\"></span></div> <input class=\"cp-hue svelte-zxiloo\" type=\"range\" min=\"0\" max=\"360\" step=\"1\"/> <input class=\"cp-alpha svelte-zxiloo\" type=\"range\" min=\"0\" max=\"100\" step=\"1\"/> <span class=\"cp-row svelte-zxiloo\"><span class=\"cp-preview svelte-zxiloo\"></span> <input class=\"cp-hex svelte-zxiloo\" spellcheck=\"false\"/> <!></span> <span class=\"cp-row cp-rgb svelte-zxiloo\"></span> <!> <span class=\"cp-label cp-label-row svelte-zxiloo\"> <button type=\"button\" class=\"cp-add svelte-zxiloo\">+</button></span> <!> <!></div>"), ua = /* @__PURE__ */ V("<span class=\"cp svelte-zxiloo\"><button type=\"button\"></button> <!> <!></span>");
function da(e, t) {
	Ye(t, !0);
	let n = Ni(t, "value", 3, "#000000"), r = Ni(t, "tokens", 19, () => []), i = Ni(t, "label", 19, () => Y("cp.pickColor")), a = Ni(t, "allowClear", 3, !1), o = "urd-recent-colors", s = "urd-saved-colors", c = () => {
		let e = r().find(([e]) => e === n());
		return e ? e[1] : n();
	}, l = () => r().find(([e]) => e === n())?.[0] ?? null, u = /* @__PURE__ */ M(tn([])), d = /* @__PURE__ */ M(tn([])), f = "", p = "", m = /* @__PURE__ */ M(null), g = /* @__PURE__ */ M(!1), _ = /* @__PURE__ */ M(tn({
		top: 0,
		left: 0
	})), v = /* @__PURE__ */ M(0), y = /* @__PURE__ */ M(0), b = /* @__PURE__ */ M(1), x = /* @__PURE__ */ M(1), S = /* @__PURE__ */ M("#000000");
	function C(e) {
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
	let ee = (e, t, n) => "#" + [
		e,
		t,
		n
	].map((e) => e.toString(16).padStart(2, "0")).join("");
	function te(e, t, n) {
		e /= 255, t /= 255, n /= 255;
		let r = Math.max(e, t, n), i = r - Math.min(e, t, n), a = 0;
		return i && (a = r === e ? (t - n) / i % 6 : r === t ? (n - e) / i + 2 : (e - t) / i + 4, a *= 60, a < 0 && (a += 360)), [
			a,
			r ? i / r : 0,
			r
		];
	}
	function ne(e, t, n) {
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
	function w() {
		return ee(...ne(z(v), z(y), z(b)));
	}
	function re() {
		let e = w();
		return z(x) >= .995 ? e : e + Math.round(z(x) * 255).toString(16).padStart(2, "0");
	}
	function ie() {
		N(S, re(), !0), p = z(S), t.onchange?.(z(S));
	}
	function ae(e) {
		let t = C(e);
		return t ? (((e) => {
			var t = h(e, 3);
			N(v, t[0], !0), N(y, t[1], !0), N(b, t[2], !0);
		})(te(t[0], t[1], t[2])), N(x, t[3], !0), N(S, re(), !0), !0) : !1;
	}
	function oe() {
		ae(c()) || ae("#000000"), f = n(), p = "";
		try {
			let e = JSON.parse(localStorage.getItem(o) ?? "[]");
			N(u, Array.isArray(e) ? e : [], !0);
		} catch {
			N(u, [], !0);
		}
		try {
			let e = JSON.parse(localStorage.getItem(s) ?? "[]");
			N(d, Array.isArray(e) ? e : [], !0);
		} catch {
			N(d, [], !0);
		}
		let e = z(m).getBoundingClientRect(), t = z(m).closest(".panel-body")?.getBoundingClientRect(), r = t ? t.right : window.innerWidth, i = Math.max(8, Math.min(e.right - 236, r - 236 - 8)), a = e.bottom + 380 + 8 > window.innerHeight ? Math.max(8, e.top - 380 - 8) : e.bottom + 6;
		N(_, {
			top: a,
			left: i
		}, !0), N(g, !0);
	}
	function se() {
		if (N(g, !1), p && p !== f) {
			let e = [p, ...z(u).filter((e) => e !== p)].slice(0, 8);
			localStorage.setItem(o, JSON.stringify(e));
		}
	}
	function ce(e, n) {
		ae(n), N(S, n, !0), t.onchange?.(e);
	}
	function le(e) {
		let t = e.currentTarget;
		t.setPointerCapture(e.pointerId);
		let n = (e) => {
			let n = t.getBoundingClientRect();
			N(y, Math.min(1, Math.max(0, (e.clientX - n.left) / n.width)), !0), N(b, 1 - Math.min(1, Math.max(0, (e.clientY - n.top) / n.height))), ie();
		};
		n(e);
		let r = (e) => n(e), i = () => {
			t.removeEventListener("pointermove", r), t.removeEventListener("pointerup", i);
		};
		t.addEventListener("pointermove", r), t.addEventListener("pointerup", i);
	}
	function ue(e) {
		ae(e.target.value) ? ie() : N(S, w(), !0);
	}
	function de(e) {
		return (C(w()) ?? [
			0,
			0,
			0
		])[e];
	}
	function fe(e, t) {
		let n = C(w()) ?? [
			0,
			0,
			0
		];
		n[e] = Math.min(255, Math.max(0, Number(t) || 0)), ((e) => {
			var t = h(e, 3);
			N(v, t[0], !0), N(y, t[1], !0), N(b, t[2], !0);
		})(te(...n)), ie();
	}
	let pe = typeof window < "u" && "EyeDropper" in window;
	async function me() {
		try {
			ae((await new window.EyeDropper().open()).sRGBHex) && ie();
		} catch {}
	}
	function he(e) {
		ae(e) && ie();
	}
	function ge() {
		let e = re();
		z(d).includes(e) || (N(d, [e, ...z(d)].slice(0, 12), !0), localStorage.setItem(s, JSON.stringify(Ge(z(d)))));
	}
	function _e(e) {
		N(d, z(d).filter((t) => t !== e), !0), localStorage.setItem(s, JSON.stringify(Ge(z(d))));
	}
	Sn(() => {
		if (!z(g)) return;
		let e = (e) => {
			z(m) && !z(m).contains(e.target) && se();
		}, t = (e) => {
			e.key === "Escape" && se();
		}, n = () => se();
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t, !0), window.addEventListener("blur", n), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t, !0), window.removeEventListener("blur", n);
		};
	});
	var ve = ua(), ye = P(ve);
	let be;
	var xe = L(ye, 2), Se = (e) => {
		var n = ea();
		R((e, t) => {
			J(n, "title", e), J(n, "aria-label", t);
		}, [() => Y("cp.clearTitle"), () => Y("cp.clear")]), B("click", n, () => t.onchange?.("")), H(e, n);
	};
	W(xe, (e) => {
		a() && n() && e(Se);
	});
	var Ce = L(xe, 2), we = (e) => {
		var t = la(), i = P(t), a = I(i), o = L(i, 2);
		K(o);
		var s = L(o, 2);
		K(s);
		var c = L(s, 2), f = P(c), p = L(f, 2);
		K(p);
		var m = L(p, 2), g = (e) => {
			var t = ta();
			R((e) => J(t, "title", e), [() => Y("cp.eyedropper")]), B("click", t, me), H(e, t);
		};
		W(m, (e) => {
			pe && e(g);
		}), E(c);
		var C = L(c, 2);
		Xr(C, 22, () => [
			"R",
			"G",
			"B"
		], (e) => e, (e, t, n) => {
			var r = na();
			K(r), R((e) => {
				J(r, "title", t), q(r, e);
			}, [() => de(z(n))]), B("change", r, (e) => fe(z(n), e.target.value)), H(e, r);
		}), E(C);
		var ee = L(C, 2), te = (e) => {
			var t = ia(), i = F(t), a = P(i, !0), o = L(a), s = (e) => {
				var t = Pr();
				R((e) => U(t, e), [() => Y("cp.linkedSuffix", { token: l() })]), H(e, t);
			}, c = /* @__PURE__ */ k(() => l());
			W(o, (e) => {
				z(c) && e(s);
			}), E(i);
			var u = L(i, 2);
			Xr(u, 21, r, ([e, t]) => e, (e, t) => {
				var r = /* @__PURE__ */ k(() => h(z(t), 2));
				let i = () => z(r)[0], a = () => z(r)[1];
				var o = ra();
				let s;
				R((e) => {
					s = _i(o, 1, "cp-token svelte-zxiloo", null, s, { active: n() === i() }), yi(o, `background: ${a() ?? ""}`), J(o, "title", e);
				}, [() => Y("cp.tokenTitle", { name: i() })]), B("click", o, () => ce(i(), a())), H(e, o);
			}), E(u), R((e) => U(a, e), [() => Y("cp.themeColors")]), H(e, t);
		};
		W(ee, (e) => {
			r().length && e(te);
		});
		var ne = L(ee, 2), re = P(ne), ae = L(re);
		E(ne);
		var oe = L(ne, 2), se = (e) => {
			var t = oa();
			Xr(t, 20, () => z(d), (e) => e, (e, t) => {
				var n = aa(), r = P(n), i = L(r, 2);
				E(n), R((e) => {
					yi(r, `background: ${t ?? ""}`), J(r, "title", t), J(i, "title", e);
				}, [() => Y("cp.removeSaved")]), B("click", r, () => he(t)), B("click", i, () => _e(t)), H(e, n);
			}), E(t), H(e, t);
		};
		W(oe, (e) => {
			z(d).length && e(se);
		});
		var ve = L(oe, 2), ye = (e) => {
			var t = ca(), n = F(t), r = I(n, !0), i = L(n, 2);
			Xr(i, 20, () => z(u), (e) => e, (e, t) => {
				var n = sa();
				R(() => {
					yi(n, `background: ${t ?? ""}`), J(n, "title", t);
				}), B("click", n, () => he(t)), H(e, n);
			}), E(i), R((e) => U(r, e), [() => Y("common.recent")]), H(e, t);
		};
		W(ve, (e) => {
			z(u).length && e(ye);
		}), E(t), R((e, n, r, c, l) => {
			yi(t, `top: ${z(_).top ?? ""}px; left: ${z(_).left ?? ""}px`), yi(i, `background-image: linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent); background-color: hsl(${z(v) ?? ""}, 100%, 50%)`), yi(a, `left: ${z(y) * 100}%; top: ${(1 - z(b)) * 100}%`), q(o, z(v)), q(s, e), J(s, "title", n), yi(s, `background: linear-gradient(to right, transparent, ${r ?? ""}), repeating-conic-gradient(rgb(255 255 255 / 35%) 0 25%, rgb(0 0 0 / 35%) 0 50%) 0 0 / 10px 10px`), yi(f, `background: ${z(S) ?? ""}`), q(p, z(S)), U(re, `${c ?? ""} `), J(ae, "title", l);
		}, [
			() => Math.round(z(x) * 100),
			() => Y("cp.alpha"),
			() => w(),
			() => Y("cp.saved"),
			() => Y("cp.saveTitle")
		]), B("click", t, (e) => e.preventDefault()), B("pointerdown", i, le), B("input", o, (e) => {
			N(v, Number(e.target.value), !0), ie();
		}), B("input", s, (e) => {
			N(x, Number(e.target.value) / 100), ie();
		}), B("change", p, ue), B("click", ae, ge), H(e, t);
	};
	W(Ce, (e) => {
		z(g) && e(we);
	}), E(ve), Mi(ve, (e) => N(m, e), () => z(m)), R((e, t, r) => {
		be = _i(ye, 1, "cp-swatch svelte-zxiloo", null, be, {
			linked: e,
			"cp-empty": a() && !n()
		}), yi(ye, `background: ${t ?? ""}`), J(ye, "title", r), J(ye, "aria-label", i());
	}, [
		() => l(),
		() => n() ? c() : "transparent",
		() => l() ? Y("cp.linkedTitle", {
			label: i(),
			token: l()
		}) : i()
	]), B("click", ye, () => z(g) ? se() : oe()), H(e, ve), Xe();
}
Er([
	"click",
	"pointerdown",
	"input",
	"change"
]);
//#endregion
//#region ../template/assets/engine/0.7.1/imageTools.js
var fa = 1600, pa = .82, ma = .6, ha = 15e6;
async function ga(e, t = fa) {
	if (va(e)) return ya(await e.text());
	let n = await createImageBitmap(e), r = Math.min(1, t / Math.max(n.width, n.height)), i = Math.round(n.width * r), a = Math.round(n.height * r), o = document.createElement("canvas");
	o.width = i, o.height = a, o.getContext("2d").drawImage(n, 0, 0, i, a), n.close();
	let s = (e) => new Promise((t) => o.toBlob(t, "image/webp", e)), c = await s(pa);
	return c.size > 4e5 && (c = await s(ma)), {
		dataUrl: await new Promise((e) => {
			let t = new FileReader();
			t.onload = () => e(t.result), t.readAsDataURL(c);
		}),
		bytes: c.size,
		width: i,
		height: a
	};
}
var _a = "image/svg+xml";
function va(e) {
	return e.type === _a || /\.svg$/i.test(e.name || "");
}
function ya(e) {
	let t = String(e ?? "");
	if (!/<svg[\s>]/i.test(t)) throw Error("Invalid SVG");
	if (/<\s*script[\s>]/i.test(t) || /<\s*foreignObject[\s>]/i.test(t) || /\son[a-z]+\s*=/i.test(t) || /javascript:/i.test(t)) throw Error("The SVG contains scripts or event handlers and cannot be used");
	let n = new Blob([t]).size, r = `data:${_a};base64,${btoa(unescape(encodeURIComponent(t)))}`, i = t.match(/<svg\b[^>]*>/i)?.[0] ?? "", a = i.match(/viewBox\s*=\s*["']\s*([-\d.]+(?:[\s,]+[-\d.]+){3})\s*["']/i)?.[1]?.split(/[\s,]+/).map(Number);
	return {
		dataUrl: r,
		bytes: n,
		width: a?.length === 4 ? a[2] : Number.parseFloat(i.match(/\bwidth\s*=\s*["']?([\d.]+)/i)?.[1]) || 0,
		height: a?.length === 4 ? a[3] : Number.parseFloat(i.match(/\bheight\s*=\s*["']?([\d.]+)/i)?.[1]) || 0
	};
}
function ba(e, t, n = .04) {
	let r = String(e ?? "");
	if (!t || !(t.width > 0) || !(t.height > 0)) return r;
	let i = r.match(/<svg\b[^>]*>/i)?.[0];
	if (!i) return r;
	let a = (e) => Math.round(e * 1e3) / 1e3, o = Math.max(t.width, t.height) * Math.max(0, n), s = a(t.x - o), c = a(t.y - o), l = a(t.width + 2 * o), u = a(t.height + 2 * o), d = i.replace(/\sviewBox\s*=\s*["'][^"']*["']/i, "").replace(/\swidth\s*=\s*["'][^"']*["']/i, "").replace(/\sheight\s*=\s*["'][^"']*["']/i, "").replace(/<svg\b/i, `<svg viewBox="${s} ${c} ${l} ${u}" width="${l}" height="${u}"`);
	return r.replace(i, d);
}
function xa(e) {
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
function Sa(e) {
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
function Ca(e, t = "image") {
	return e.replace(/\.[^.]+$/, "").toLowerCase().replaceAll("æ", "ae").replaceAll("ø", "o").replaceAll("å", "a").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || t;
}
function wa(e) {
	let t = 5381;
	for (let n = 0; n < e.length; n++) t = (t << 5) + t + e.charCodeAt(n) >>> 0;
	return t.toString(16).padStart(8, "0");
}
//#endregion
//#region ../template/assets/engine/0.7.1/glyphs.js
var Ta = "urd-recent-glyphs", Ea = [
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
function Da(e, t) {
	return [t, ...(Array.isArray(e) ? e : []).filter((e) => e !== t)].slice(0, 16);
}
function Oa() {
	try {
		let e = JSON.parse(localStorage.getItem("urd-recent-glyphs") ?? "[]");
		return Array.isArray(e) ? e : [];
	} catch {
		return [];
	}
}
function ka(e) {
	let t = Da(Oa(), e);
	try {
		localStorage.setItem(Ta, JSON.stringify(t));
	} catch {}
	return t;
}
//#endregion
//#region ../template/assets/engine/0.7.1/icons.js
var Aa = "fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"", ja = "fill=\"currentColor\" stroke=\"none\"", Ma = {
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
}, Na = [
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
function Pa(e) {
	let t = typeof e == "string" ? Ma[e] : null;
	return t ? `<svg viewBox="0 0 24 24" width="100%" height="100%" ${t.fill ? ja : Aa} aria-hidden="true" focusable="false">${t.body}</svg>` : null;
}
//#endregion
//#region src/lib/GlyphPicker.svelte
var Fa = /* @__PURE__ */ V("<img class=\"gp-own svelte-15ln1c3\"/>"), Ia = /* @__PURE__ */ V("<span class=\"gp-svg svelte-15ln1c3\"></span>"), La = /* @__PURE__ */ V("<button type=\"button\" class=\"gp-cell svelte-15ln1c3\"> </button>"), Ra = /* @__PURE__ */ V("<div class=\"gp-group svelte-15ln1c3\"> </div> <div class=\"gp-grid svelte-15ln1c3\"></div>", 1), za = /* @__PURE__ */ V("<button type=\"button\"><span class=\"gp-svg svelte-15ln1c3\"></span></button>"), Ba = /* @__PURE__ */ V("<button type=\"button\"> </button>"), Va = /* @__PURE__ */ V("<div class=\"gp-group svelte-15ln1c3\"> </div> <button type=\"button\" class=\"ghost gp-upload svelte-15ln1c3\"> </button> <input type=\"file\" accept=\"image/*\" hidden=\"\"/> <p class=\"gp-hint svelte-15ln1c3\"> </p>", 1), Ha = /* @__PURE__ */ V("<div class=\"gp-pop svelte-15ln1c3\"><!> <!> <!> <!></div>"), Ua = /* @__PURE__ */ V("<span class=\"gp svelte-15ln1c3\"><button type=\"button\" class=\"gp-swatch svelte-15ln1c3\"><!></button> <!></span>");
function Wa(e, t) {
	Ye(t, !0);
	let n = Ni(t, "value", 3, "★"), r = Ni(t, "icon", 3, null), i = Ni(t, "image", 3, null), a = Ni(t, "label", 19, () => Y("gp.pickGlyph")), o = /* @__PURE__ */ M(tn([])), s = /* @__PURE__ */ M(null), c = /* @__PURE__ */ M(null), l = /* @__PURE__ */ M(!1), u = /* @__PURE__ */ M(tn({
		top: 0,
		left: 0
	}));
	function d() {
		N(o, Oa(), !0);
		let e = z(s).getBoundingClientRect(), t = Math.max(8, Math.min(e.right - 292, window.innerWidth - 292 - 8)), n = e.bottom + 380 + 8 > window.innerHeight ? Math.max(8, e.top - 380 - 8) : e.bottom + 6;
		N(u, {
			top: n,
			left: t
		}, !0), N(l, !0);
	}
	function f(e) {
		ka(e), t.onpick?.(e), N(l, !1);
	}
	function p(e) {
		t.onicon?.(e), N(l, !1);
	}
	async function m(e) {
		let n = e.target.files?.[0];
		if (e.target.value = "", !n) return;
		let r = await ga(n, 256);
		t.onimage?.(r.dataUrl), N(l, !1);
	}
	Sn(() => {
		if (!z(l)) return;
		let e = (e) => {
			z(s) && !z(s).contains(e.target) && N(l, !1);
		}, t = (e) => {
			e.key === "Escape" && N(l, !1);
		}, n = (e) => {
			z(s) && e.target instanceof Node && !z(s).contains(e.target) && N(l, !1);
		};
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t, !0), document.addEventListener("scroll", n, !0), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t, !0), document.removeEventListener("scroll", n, !0);
		};
	});
	var g = Ua(), _ = P(g), v = P(_), y = (e) => {
		var t = Fa();
		R((e) => {
			J(t, "src", i()), J(t, "alt", e);
		}, [() => Y("gp.ownIcon")]), H(e, t);
	}, b = (e) => {
		var t = Ia();
		G(t, () => Pa(r()), !0), E(t), H(e, t);
	}, x = (e) => {
		var t = Pr();
		R(() => U(t, n() || "★")), H(e, t);
	};
	W(v, (e) => {
		i() ? e(y) : r() && Ma[r()] ? e(b, 1) : e(x, -1);
	}), E(_);
	var S = L(_, 2), C = (e) => {
		var i = Ha(), a = P(i), s = (e) => {
			var t = Ra(), n = F(t), r = I(n, !0), i = L(n, 2);
			Xr(i, 20, () => z(o), (e) => e, (e, t) => {
				var n = La(), r = I(n, !0);
				R(() => U(r, t)), B("click", n, () => f(t)), H(e, n);
			}), E(i), R((e) => U(r, e), [() => Y("common.recent")]), H(e, t);
		};
		W(a, (e) => {
			z(o).length && e(s);
		});
		var l = L(a, 2), d = (e) => {
			var t = Fr();
			Xr(F(t), 17, () => Na, ([e, t]) => e, (e, t) => {
				var n = /* @__PURE__ */ k(() => h(z(t), 2));
				let i = () => z(n)[0], a = () => z(n)[1];
				var o = Ra(), s = F(o), c = I(s, !0), l = L(s, 2);
				Xr(l, 20, a, (e) => e, (e, t) => {
					var n = za();
					let i;
					var a = P(n);
					G(a, () => Pa(t), !0), E(a), E(n), R((e) => {
						i = _i(n, 1, "gp-cell gp-cell-icon svelte-15ln1c3", null, i, { active: t === r() }), J(n, "title", e);
					}, [() => Y(Ma[t].labelKey)]), B("click", n, () => p(t)), H(e, n);
				}), E(l), R((e) => U(c, e), [() => Y(i())]), H(e, o);
			}), H(e, t);
		};
		W(l, (e) => {
			t.onicon && e(d);
		});
		var g = L(l, 2);
		Xr(g, 17, () => Ea, ([e, t]) => e, (e, t) => {
			var r = /* @__PURE__ */ k(() => h(z(t), 2));
			let i = () => z(r)[0], a = () => z(r)[1];
			var o = Ra(), s = F(o), c = I(s, !0), l = L(s, 2);
			Xr(l, 20, () => a().split(" "), (e) => e, (e, t) => {
				var r = Ba();
				let i;
				var a = I(r, !0);
				R(() => {
					i = _i(r, 1, "gp-cell svelte-15ln1c3", null, i, { active: t === n() }), U(a, t);
				}), B("click", r, () => f(t)), H(e, r);
			}), E(l), R((e) => U(c, e), [() => Y(i())]), H(e, o);
		});
		var _ = L(g, 2), v = (e) => {
			var t = Va(), n = F(t), r = I(n, !0), i = L(n, 2), a = I(i, !0), o = L(i, 2);
			Mi(o, (e) => N(c, e), () => z(c));
			var s = I(L(o, 2), !0);
			R((e, t, n) => {
				U(r, e), U(a, t), U(s, n);
			}, [
				() => Y("gp.ownIcon"),
				() => Y("gp.upload"),
				() => Y("gp.uploadHint")
			]), B("click", i, () => z(c).click()), B("change", o, m), H(e, t);
		};
		W(_, (e) => {
			t.onimage && e(v);
		}), E(i), R(() => yi(i, `top: ${z(u).top ?? ""}px; left: ${z(u).left ?? ""}px`)), H(e, i);
	};
	W(S, (e) => {
		z(l) && e(C);
	}), E(g), Mi(g, (e) => N(s, e), () => z(s)), R(() => {
		J(_, "title", a()), J(_, "aria-label", a());
	}), B("click", _, () => z(l) ? N(l, !1) : d()), H(e, g), Xe();
}
Er(["click", "change"]);
//#endregion
//#region src/lib/previewBridge.js
function Ga(e, t = {}) {
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
function Ka(e, t) {
	return !(e > 0) || !(t > 0) ? 1 : e / t;
}
function qa(e, t, n, r = 0, i = 0) {
	if (n === "full") return 1;
	let a = i > 0 ? Ka(r, i) : Infinity;
	return Math.max(.1, Math.min(1, Ka(e, t), a));
}
var Ja = 1920, Ya = [
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
], Xa = [
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
], Za = [
	1920,
	1536,
	1366
];
function Qa(e) {
	let t = Number(e);
	if (!Number.isFinite(t)) return 1440;
	let n = Math.round(t / 20) * 20;
	return Math.min(Ja, Math.max(960, n));
}
function $a(e) {
	let t = Number(e);
	if (!Number.isFinite(t)) return 6;
	let n = Math.round(t / 1) * 1;
	return Math.min(12, Math.max(0, n));
}
function eo(e, t) {
	if (e === "full") return 0;
	let n = Math.min(49, Math.max(0, Number(t) || 0));
	return Math.ceil(Number(e) / (1 - 2 * n / 100));
}
function to(e, t, n) {
	let r = Math.max(0, Number(t) || 0) / 100 * n, i = Math.max(0, n - 2 * r), a = e !== "full" && Number(e) < i, o = a ? Number(e) : i;
	return {
		width: o,
		margin: Math.round((n - o) / 2),
		pct: n > 0 ? o / n * 100 : 0,
		bound: a
	};
}
function no(e) {
	return Xa.find((t) => t.width === e)?.id ?? null;
}
//#endregion
//#region src/lib/Dropdown.svelte
var ro = /* @__PURE__ */ V("<button type=\"button\"> </button>"), io = /* @__PURE__ */ V("<div class=\"dd-pop svelte-vtocc6\"></div>"), ao = /* @__PURE__ */ V("<span class=\"dd svelte-vtocc6\"><button type=\"button\" class=\"dd-btn svelte-vtocc6\"><span class=\"dd-value svelte-vtocc6\"> </span> <span class=\"dd-caret svelte-vtocc6\"> </span></button> <!></span>");
function X(e, t) {
	Ye(t, !0);
	let n = Ni(t, "value", 3, null), r = Ni(t, "options", 19, () => []), i = Ni(t, "title", 3, null), a = Ni(t, "disabled", 3, !1), o = /* @__PURE__ */ M(!1), s = /* @__PURE__ */ M(null), c = /* @__PURE__ */ M(tn({
		top: 0,
		left: 0,
		width: 160
	})), l = () => r().find(([e]) => `${e ?? ""}` == `${n() ?? ""}`)?.[1] ?? "";
	function u() {
		let e = z(s).getBoundingClientRect(), t = Math.min(320, r().length * 32 + 12), n = Math.max(e.width, 160), i = e.bottom + t + 8 <= window.innerHeight;
		N(c, {
			top: i ? e.bottom + 4 : Math.max(8, e.top - t - 4),
			left: Math.max(8, Math.min(e.left, window.innerWidth - n - 8)),
			width: n
		}, !0);
	}
	function d() {
		if (!a()) {
			if (z(o)) {
				N(o, !1);
				return;
			}
			u(), N(o, !0);
		}
	}
	function f(e) {
		N(o, !1), t.onchange?.(e);
	}
	Sn(() => {
		if (!z(o)) return;
		let e = (e) => {
			z(s) && !z(s).contains(e.target) && N(o, !1);
		}, t = (e) => {
			e.key === "Escape" && N(o, !1);
		}, n = (e) => {
			z(s) && e.target instanceof Node && !z(s).contains(e.target) && u();
		};
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t, !0), document.addEventListener("scroll", n, !0), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t, !0), document.removeEventListener("scroll", n, !0);
		};
	});
	var p = ao(), m = P(p), g = P(m), _ = I(g, !0), v = I(L(g, 2), !0);
	E(m);
	var y = L(m, 2), b = (e) => {
		var t = io();
		Xr(t, 21, r, ([e, t]) => `${e ?? ""}`, (e, t) => {
			var r = /* @__PURE__ */ k(() => h(z(t), 2));
			let i = () => z(r)[0], a = () => z(r)[1];
			var o = ro();
			let s;
			var c = I(o, !0);
			R(() => {
				s = _i(o, 1, "dd-opt svelte-vtocc6", null, s, { selected: `${i() ?? ""}` == `${n() ?? ""}` }), U(c, a());
			}), B("click", o, () => f(i())), H(e, o);
		}), E(t), R(() => yi(t, `top: ${z(c).top ?? ""}px; left: ${z(c).left ?? ""}px; min-width: ${z(c).width ?? ""}px`)), H(e, t);
	};
	W(y, (e) => {
		z(o) && e(b);
	}), E(p), Mi(p, (e) => N(s, e), () => z(s)), R((e) => {
		J(m, "title", i()), m.disabled = a(), U(_, e), U(v, z(o) ? "▴" : "▾");
	}, [() => l()]), B("click", m, d), H(e, p), Xe();
}
Er(["click"]);
//#endregion
//#region src/lib/IconEditor.svelte
var oo = /* @__PURE__ */ V("<div class=\"ie-overlay svelte-e7sog7\" role=\"dialog\" aria-modal=\"true\"><div class=\"ie-card svelte-e7sog7\"><h2 class=\"svelte-e7sog7\"> </h2> <div class=\"ie-stage svelte-e7sog7\"><canvas class=\"ie-canvas svelte-e7sog7\"></canvas> <p class=\"ie-hint svelte-e7sog7\"> </p></div> <label class=\"ie-row svelte-e7sog7\"> <span class=\"ie-val svelte-e7sog7\"> </span></label> <input type=\"range\" min=\"1\" max=\"3\" step=\"0.02\" class=\"svelte-e7sog7\"/> <label class=\"ie-row svelte-e7sog7\"> <span class=\"ie-val svelte-e7sog7\"> </span></label> <input type=\"range\" min=\"0.3\" max=\"2\" step=\"0.02\" class=\"svelte-e7sog7\"/> <label class=\"ie-row svelte-e7sog7\"> <span class=\"ie-val svelte-e7sog7\"> </span></label> <input type=\"range\" min=\"0.3\" max=\"2\" step=\"0.02\" class=\"svelte-e7sog7\"/> <label class=\"ie-row svelte-e7sog7\"> <span class=\"ie-val svelte-e7sog7\"> </span></label> <input type=\"range\" min=\"0\" max=\"2\" step=\"0.02\" class=\"svelte-e7sog7\"/> <span class=\"ie-tools svelte-e7sog7\"><button type=\"button\" class=\"ghost svelte-e7sog7\"> </button> <button type=\"button\" class=\"ghost svelte-e7sog7\"> </button></span> <span class=\"ie-actions svelte-e7sog7\"><button type=\"button\" class=\"ghost svelte-e7sog7\"> </button> <button type=\"button\" class=\"primary svelte-e7sog7\"> </button></span></div></div>");
function so(e, t) {
	Ye(t, !0);
	let n = Ni(t, "image", 3, ""), r = /* @__PURE__ */ M(null), i = /* @__PURE__ */ M(null), a = /* @__PURE__ */ M(1), o = /* @__PURE__ */ M(.5), s = /* @__PURE__ */ M(.5), c = /* @__PURE__ */ M(1), l = /* @__PURE__ */ M(1), u = /* @__PURE__ */ M(1);
	Sn(() => {
		if (!n()) return;
		let e = new Image();
		e.onload = () => {
			N(i, e, !0);
		}, e.src = n();
	});
	function d(e, t) {
		if (e.clearRect(0, 0, t, t), !z(i)) return;
		e.filter = `brightness(${z(c)}) contrast(${z(l)}) saturate(${z(u)})`;
		let n = Math.max(t / z(i).width, t / z(i).height) * z(a), r = z(i).width * n, d = z(i).height * n, f = t / 2 - z(o) * r, p = t / 2 - z(s) * d;
		f = Math.min(0, Math.max(t - r, f)), p = Math.min(0, Math.max(t - d, p)), e.drawImage(z(i), f, p, r, d), e.filter = "none";
	}
	Sn(() => {
		z(i), z(a), z(o), z(s), z(c), z(l), z(u), z(r) && d(z(r).getContext("2d"), 220);
	});
	function f(e) {
		if (!z(i)) return;
		e.preventDefault();
		let t = e.clientX, n = e.clientY, r = Math.max(220 / z(i).width, 220 / z(i).height) * z(a), c = z(i).width * r, l = z(i).height * r, u = (e) => {
			N(o, Math.min(1, Math.max(0, z(o) - (e.clientX - t) / c)), !0), N(s, Math.min(1, Math.max(0, z(s) - (e.clientY - n) / l)), !0), t = e.clientX, n = e.clientY;
		}, d = () => {
			window.removeEventListener("pointermove", u), window.removeEventListener("pointerup", d);
		};
		window.addEventListener("pointermove", u), window.addEventListener("pointerup", d);
	}
	function p() {
		N(a, 1), N(o, .5), N(s, .5), N(c, 1), N(l, 1), N(u, 1);
	}
	function m() {
		let e = document.createElement("canvas");
		e.width = 128, e.height = 128, d(e.getContext("2d"), 128), t.onapply?.(e.toDataURL("image/webp", .92));
	}
	var h = oo(), g = P(h), _ = P(g), v = I(_, !0), y = L(_, 2), b = P(y);
	J(b, "width", 220), J(b, "height", 220), Mi(b, (e) => N(r, e), () => z(r));
	var x = I(L(b, 2), !0);
	E(y);
	var S = L(y, 2), C = P(S), ee = I(L(C));
	E(S);
	var te = L(S, 2);
	K(te);
	var ne = L(te, 2), w = P(ne), re = I(L(w));
	E(ne);
	var ie = L(ne, 2);
	K(ie);
	var ae = L(ie, 2), oe = P(ae), se = I(L(oe));
	E(ae);
	var ce = L(ae, 2);
	K(ce);
	var le = L(ce, 2), ue = P(le), de = I(L(ue));
	E(le);
	var fe = L(le, 2);
	K(fe);
	var pe = L(fe, 2), me = P(pe), he = I(me, !0), ge = L(me, 2), _e = I(ge, !0);
	E(pe);
	var ve = L(pe, 2), ye = P(ve), be = I(ye, !0), xe = L(ye, 2), Se = I(xe, !0);
	E(ve), E(g), E(h), R((e, t, n, r, i, a, o, s, c, l, u, d, f, p, m) => {
		U(v, e), J(b, "title", t), U(x, n), U(C, `${r ?? ""} `), U(ee, `${i ?? ""}x`), U(w, `${a ?? ""} `), U(re, `${o ?? ""}%`), U(oe, `${s ?? ""} `), U(se, `${c ?? ""}%`), U(ue, `${l ?? ""} `), U(de, `${u ?? ""}%`), U(he, d), U(_e, f), U(be, p), U(Se, m);
	}, [
		() => Y("ie.title"),
		() => Y("ie.dragTip"),
		() => Y("ie.hint"),
		() => Y("lbl.zoom"),
		() => z(a).toFixed(2),
		() => Y("lbl.brightness"),
		() => Math.round(z(c) * 100),
		() => Y("lbl.contrast"),
		() => Math.round(z(l) * 100),
		() => Y("lbl.saturate"),
		() => Math.round(z(u) * 100),
		() => Y("ie.grayscale"),
		() => Y("common.reset"),
		() => Y("confirm.cancel"),
		() => Y("common.apply")
	]), B("pointerdown", b, f), Oi(te, () => z(a), (e) => N(a, e)), Oi(ie, () => z(c), (e) => N(c, e)), Oi(ce, () => z(l), (e) => N(l, e)), Oi(fe, () => z(u), (e) => N(u, e)), B("click", me, () => N(u, 0)), B("click", ge, p), B("click", ye, () => t.oncancel?.()), B("click", xe, m), H(e, h), Xe();
}
Er(["pointerdown", "click"]);
var co = 24, lo = {
	"oppsett-byttet": "layout-changed",
	"blokk-endret": "block-edited",
	"desktop-endret-etter-mobil": "desktop-changed-after-mobile",
	seksjonshøyde: "section-height",
	"blokk-flyttet": "block-moved",
	"blokk-slettet": "block-deleted",
	"blokk-lagt-til": "block-added"
};
function uo(e, t) {
	if (!e || !("y" in e || "h" in e)) return e ?? null;
	if (t && e.x === t.x && e.y === t.y && e.w === t.w && e.h === t.h) return null;
	let n = {
		x: e.x,
		w: e.w
	};
	return Number.isFinite(e.y) && (n.row = Math.max(1, Math.round((e.y - co) / 8) + 1), n.rows = Number.isFinite(e.h) ? Math.max(1, Math.ceil(e.h / 8)) : 1), Number.isFinite(e.z) && e.z !== 1 && (n.z = e.z), e.rot && (n.rot = e.rot), n;
}
var fo = {
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
}, po = { bildegalleri: "slideshow" }, mo = {
	flate: "surface",
	aksent: "accent",
	invers: "inverse",
	dus: "soft",
	dempet: "muted",
	dyp: "deep",
	uthevet: "highlighted"
}, ho = {
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
function go(e) {
	let t = Array.isArray(e) ? e : e.blocks ?? [];
	for (let e of t) fo[e.type] && (e.type = fo[e.type]);
	if (!Array.isArray(e)) {
		for (let t of e.background?.layers ?? []) po[t.type] && (t.type = po[t.type]);
		mo[e.theme] && (e.theme = mo[e.theme]), ho[e.preset] && (e.preset = ho[e.preset]);
	}
	return e;
}
var _o = {
	1: (e) => {
		for (let t of e.sections ?? []) {
			let e = t.responsive?.mobile;
			for (let e of t.blocks ?? []) e.decor && (e.hideMobile = !0), e.frames?.mobile && (e.frames.mobile = uo(e.frames.mobile, e.frames.desktop));
			e?.mode === "manual" && (e.mode = "auto");
			let n = e?.attention?.reason;
			n && lo[n] && (e.attention.reason = lo[n]);
		}
		return e;
	},
	2: (e) => {
		for (let t of e.sections ?? []) go(t);
		return e;
	},
	3: (e) => {
		for (let t of e.sections ?? []) go(t);
		return e;
	}
}, vo = {
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
function yo(e) {
	let t = structuredClone(e), n = t.schemaVersion ?? 1;
	for (; n < 3;) {
		let r = vo[n];
		if (typeof r != "function") return e;
		t = r(t) ?? t, n++, t.schemaVersion = n;
	}
	return t;
}
function bo(e, t) {
	let n = structuredClone(e), r = n.schemaVersion ?? 1;
	for (; r < 4;) {
		let i = _o[r];
		if (typeof i != "function") return e;
		n = i(n, t) ?? n, r++, n.schemaVersion = r;
	}
	return n;
}
//#endregion
//#region ../template/assets/engine/0.7.1/plugins.js
function xo(e) {
	let t = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(e).trim());
	return t ? [
		Number(t[1]),
		Number(t[2]),
		Number(t[3])
	] : null;
}
var So = (e, t) => e[0] - t[0] || e[1] - t[1] || e[2] - t[2];
function Co(e, t) {
	let n = xo(e);
	if (!n || typeof t != "string" || !t.trim()) return !1;
	for (let e of t.trim().split(/\s+/)) {
		let t = /^(>=|<=|>|<|=|\^|~)?(\d+\.\d+\.\d+)$/.exec(e);
		if (!t) return !1;
		let r = t[1] ?? "=", i = xo(t[2]), a = So(n, i);
		if (!(r === ">=" ? a >= 0 : r === ">" ? a > 0 : r === "<=" ? a <= 0 : r === "<" ? a < 0 : r === "^" ? i[0] === 0 ? n[0] === 0 && n[1] === i[1] && a >= 0 : n[0] === i[0] && a >= 0 : r === "~" ? n[0] === i[0] && n[1] === i[1] && a >= 0 : a === 0)) return !1;
	}
	return !0;
}
var wo = /^[a-z0-9][a-z0-9-]*$/;
function To(e) {
	let t = [];
	if (!e || typeof e != "object") return ["the manifest is not an object"];
	wo.test(e.id ?? "") || t.push("id is missing or invalid"), (typeof e.name != "string" || !e.name) && t.push("name is missing"), xo(e.version ?? "") || t.push("version is not semver"), (typeof e.requiresEngine != "string" || !e.requiresEngine) && t.push("requiresEngine is missing");
	let n = Array.isArray(e.languages) && e.languages.length > 0;
	return (e.entry !== void 0 || !n) && (typeof e.entry != "string" || !e.entry.endsWith(".js")) && t.push("entry is missing or is not a .js file"), (e.provides !== void 0 || !n) && (!e.provides || typeof e.provides != "object") && t.push("provides is missing"), e.languages !== void 0 && t.push(...Bi(e.languages)), e.locales !== void 0 && typeof e.locales != "boolean" && t.push("locales must be a boolean"), e.names !== void 0 && (typeof e.names != "object" || e.names === null || Array.isArray(e.names) || Object.values(e.names).some((e) => typeof e != "string" || !e)) && t.push("names must be an object mapping language code to name"), t;
}
Promise.resolve();
//#endregion
//#region ../template/assets/engine/0.7.1/sections/presets.js
function Eo(e) {
	return typeof crypto < "u" && crypto.randomUUID ? `${e}-${crypto.randomUUID().slice(0, 8)}` : `${e}-${[...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(4))].map((e) => e.toString(16).padStart(2, "0")).join("")}`;
}
var Do = () => ({ mobile: {
	mode: "auto",
	attention: null
} }), Z = (e, t, n, r, i = 1) => ({
	desktop: {
		x: e,
		y: t,
		w: n,
		h: r,
		z: i,
		rot: 0
	},
	mobile: null
}), Q = (e, t, n = {}) => ({
	id: Eo("blk"),
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
}), Oo = (e, t = {}) => ({
	id: Eo("blk"),
	type: "image",
	version: 1,
	props: {
		src: "",
		alt: Y("seed.imageAlt"),
		fit: "cover",
		radius: "md",
		href: null,
		...t
	},
	animation: null,
	frames: e
}), ko = (e, t, n = {}) => ({
	id: Eo("blk"),
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
}), Ao = (e, t, n = 40) => ({
	id: Eo("blk"),
	type: "icon",
	version: 1,
	props: {
		glyph: t,
		color: "accent",
		size: n
	},
	animation: null,
	frames: e
}), jo = () => ({
	type: "hover-lift",
	version: 1,
	props: {}
}), Mo = (e, t, n = {}) => ({
	id: Eo("blk"),
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
}), No = (e, t = {}) => ({
	id: Eo("blk"),
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
}), Po = (e, t = {}) => ({
	id: Eo("blk"),
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
}), Fo = (e, t = {}) => ({
	id: Eo("blk"),
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
}), Io = (e, t = {}) => ({
	id: Eo("blk"),
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
}), Lo = (e, t) => ({
	id: Eo("blk"),
	type: "faq",
	version: 1,
	props: {
		items: t,
		multi: !1
	},
	animation: null,
	frames: e
}), Ro = (e, t = {}) => ({
	id: Eo("blk"),
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
}), zo = (e, t) => ({
	id: Eo("blk"),
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
}), Bo = (e, t = {}) => ({
	id: Eo("blk"),
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
}), Vo = (...e) => ({
	version: 1,
	layers: e
}), Ho = (e) => ({
	type: "color",
	version: 1,
	props: { value: e }
}), Uo = (e, t, n, r = .5) => ({
	type: "glow",
	version: 1,
	props: {
		x: e,
		y: t,
		color: "accent",
		radius: r,
		opacity: n
	}
}), Wo = (e) => Math.max(0, ...e.blocks.map((e) => e.frames.desktop.y + e.frames.desktop.h)), Go = (e, t, n, r, i, a) => ({
	x: n + e % t * r,
	y: i + Math.floor(e / t) * a
}), Ko = (e, t, n, r, i, a, o, s, c = 0) => {
	let l = (t) => e.blocks.some((e) => {
		let n = e.frames.desktop;
		return n.x < t.x + t.w - .01 && t.x < n.x + n.w - .01 && n.y < t.y + t.h - .01 && t.y < n.y + n.h - .01;
	});
	for (let e = 0; e < 60; e++) {
		let u = Go(e, t, n, r, i, a);
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
		y: Wo(e) + 16,
		n: 0
	};
}, qo = (e, t, n) => e + t * .1 + n * .01, Jo = (e, t, n, r, i = null) => ({
	id: Eo("sec"),
	version: 1,
	preset: e,
	size: { minHeight: t },
	grid: i,
	background: n,
	blocks: r,
	responsive: Do()
});
function Yo(e) {
	e.sections.define("blank", {
		label: "Empty section",
		labelKey: "preset.blank.label",
		group: "Basics",
		groupKey: "presetGroup.basic",
		hint: "A blank canvas to build on freely",
		hintKey: "preset.blank.hint",
		create: () => Jo("blank", "40vh", Vo(Ho("bg")), [])
	}), e.sections.define("hero", {
		label: "Hero",
		labelKey: "preset.hero.label",
		group: "Basics",
		groupKey: "presetGroup.basic",
		hint: "Large opening with gradient and glow, left-aligned",
		hintKey: "preset.hero.hint",
		create: () => Jo("hero", "70vh", {
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
				Uo(.7, .2, .35),
				{
					type: "grain",
					version: 1,
					props: { opacity: .06 }
				}
			]
		}, [
			Q(Z(8.33, 40, 50, 38), Y("seed.hero.title")),
			Q(Z(8.33, 84, 41.67, 26), Y("seed.hero.intro")),
			ko(Z(8.33, 118, 20, 32), Y("seed.readMore"))
		])
	}), e.sections.define("hero-centered", {
		label: "Hero, centred",
		labelKey: "preset.hero-centered.label",
		group: "Basics",
		groupKey: "presetGroup.basic",
		hint: "Centred opening with two buttons",
		hintKey: "preset.hero-centered.hint",
		create: () => Jo("hero-centered", "60vh", Vo(Ho("bg")), [
			Q(Z(15, 64, 70, 44), Y("seed.heroCenter.title"), { align: "center" }),
			Q(Z(25, 116, 50, 26), Y("seed.heroCenter.intro"), { align: "center" }),
			ko(Z(31.5, 160, 17, 40), Y("seed.join")),
			ko(Z(51.5, 160, 17, 40), Y("seed.readMore"), { style: "secondary" })
		])
	}), e.sections.define("images", {
		label: "Images",
		labelKey: "preset.images.label",
		group: "Basics",
		groupKey: "presetGroup.basic",
		hint: "Title and three image frames",
		hintKey: "preset.images.hint",
		create: () => Jo("images", "360px", Vo(Ho("bg")), [
			Q(Z(4, 24, 50, 32), Y("seed.images.title")),
			Oo(Z(4, 72, 28, 220)),
			Oo(Z(36, 72, 28, 220)),
			Oo(Z(68, 72, 28, 220))
		]),
		itemLabel: "image",
		itemLabelKey: "item.image",
		item: (e) => {
			let { x: t, y: n } = Ko(e, 3, 4, 32, 72, 244, 28, 220);
			return {
				blocks: [Oo(Z(t, n, 28, 220))],
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
		create: () => Jo("gallery", "440px", Vo(Ho("bg")), [Q(Z(4, 24, 50, 32), Y("seed.gallery.title")), Io(Z(4, 72, 92, 320))])
	}), e.sections.define("contact", {
		label: "Contact",
		labelKey: "preset.contact.label",
		group: "Basics",
		groupKey: "presetGroup.basic",
		hint: "Contact details in a card with an email button",
		hintKey: "preset.contact.hint",
		create: () => Jo("contact", "320px", Vo(Ho("surface"), Uo(.2, .8, .2)), [
			Q(Z(10, 32, 40, 36), Y("seed.contact.title")),
			Q(Z(10, 84, 36, 130), Y("seed.contact.info"), { box: !0 }),
			ko(Z(60, 100, 22, 40), Y("seed.contact.button"), { href: `mailto:${Y("seed.email")}` })
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
				let i = Ao(Z(e + 10.5, 88, 4, 52), n), a = Q(Z(e, 152, 25, 200), Y("seed.features.card", { title: r }), {
					align: "center",
					box: !0
				});
				return a.animation = jo(), i.mobileOrder = qo(88, t, 0), a.mobileOrder = qo(88, t, 1), [i, a];
			};
			return Jo("feature-cards", "420px", Vo(Ho("bg")), [
				Q(Z(6, 28, 60, 38), Y("seed.features.title")),
				...e(6, 0, "✦", Y("seed.features.card1")),
				...e(37.5, 1, "★", Y("seed.features.card2")),
				...e(69, 2, "✓", Y("seed.features.card3"))
			]);
		},
		itemLabel: "card",
		itemLabelKey: "item.card",
		item: (e) => {
			let { x: t, y: n, n: r } = Ko(e, 3, 6, 31.5, 152, 296, 25, 264, -64), i = Ao(Z(t + 10.5, n - 64, 4, 52), "✦"), a = Q(Z(t, n, 25, 200), Y("seed.features.card", { title: Y("seed.features.newTitle") }), {
				align: "center",
				box: !0
			});
			return a.animation = jo(), i.mobileOrder = qo(88, r, 0), a.mobileOrder = qo(88, r, 1), {
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
				let r = Q(Z(e, 88, 25, 200), Y("seed.features.card", { title: n }), {
					align: "center",
					box: !0
				});
				return r.animation = jo(), r.mobileOrder = qo(88, t, 0), r;
			};
			return Jo("feature-cards-simple", "360px", Vo(Ho("bg")), [
				Q(Z(6, 28, 60, 38), Y("seed.features.title")),
				e(6, 0, Y("seed.features.card1")),
				e(37.5, 1, Y("seed.features.card2")),
				e(69, 2, Y("seed.features.card3"))
			]);
		},
		itemLabel: "card",
		itemLabelKey: "item.card",
		item: (e) => {
			let { x: t, y: n, n: r } = Ko(e, 3, 6, 31.5, 88, 232, 25, 200), i = Q(Z(t, n, 25, 200), Y("seed.features.card", { title: Y("seed.features.newTitle") }), {
				align: "center",
				box: !0
			});
			return i.animation = jo(), i.mobileOrder = qo(88, r, 0), {
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
				let n = Oo(Z(e, 88, 25, 160)), r = Q(Z(e, 256, 25, 160), Y("seed.news.card"));
				return n.mobileOrder = qo(88, t, 0), r.mobileOrder = qo(88, t, 1), [n, r];
			};
			return Jo("news", "460px", Vo(Ho("bg")), [
				Q(Z(6, 28, 50, 38), Y("seed.news.title")),
				ko(Z(78, 30, 16, 36), Y("seed.news.seeAll"), { style: "secondary" }),
				...e(6, 0),
				...e(37.5, 1),
				...e(69, 2)
			]);
		},
		itemLabel: "story",
		itemLabelKey: "item.story",
		item: (e) => {
			let { x: t, y: n, n: r } = Ko(e, 3, 6, 31.5, 88, 344, 25, 328), i = Oo(Z(t, n, 25, 160)), a = Q(Z(t, n + 168, 25, 160), Y("seed.news.card"));
			return i.mobileOrder = qo(88, r, 0), a.mobileOrder = qo(88, r, 1), {
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
		create: () => Jo("news-collection", "300px", Vo(Ho("bg")), [Q(Z(6, 28, 50, 38), Y("seed.news.title")), Mo(Z(6, 88, 88, 180), "cards")])
	}), e.sections.define("noticeboard", {
		label: "Noticeboard",
		labelKey: "preset.noticeboard.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "Dated list from a collection (notices/announcements)",
		hintKey: "preset.noticeboard.hint",
		create: () => Jo("noticeboard", "300px", Vo(Ho("surface")), [Q(Z(6, 28, 50, 38), Y("seed.noticeboard.title")), Mo(Z(6, 88, 88, 180), "list", { limit: 8 })])
	}), e.sections.define("publication-archive", {
		label: "Publication archive",
		labelKey: "preset.publication-archive.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "Year-grouped archive from a collection (issues, minutes, reports)",
		hintKey: "preset.publication-archive.hint",
		create: () => Jo("publication-archive", "300px", Vo(Ho("bg")), [Q(Z(6, 28, 60, 38), Y("seed.archive.title")), Mo(Z(6, 88, 88, 180), "archive", { limit: 0 })])
	}), e.sections.define("events", {
		label: "Events",
		labelKey: "preset.events.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "Three rows with date badge and sign-up button",
		hintKey: "preset.events.hint",
		create: () => {
			let e = (e, t, n, r) => [
				Q(Z(6, e, 8, 88), Y("seed.events.dateBadge", {
					day: t,
					month: n
				}), {
					align: "center",
					box: !0
				}),
				Q(Z(16, e, 58, 88), Y("seed.events.row", { title: r })),
				ko(Z(78, e + 24, 16, 40), Y("seed.events.signup"), { style: "secondary" })
			];
			return Jo("events", "440px", Vo(Ho("surface")), [
				Q(Z(6, 28, 50, 38), Y("seed.events.title")),
				...e(88, "11", Y("seed.events.monthAug"), Y("seed.events.row1")),
				...e(196, "25", Y("seed.events.monthAug"), Y("seed.events.row2")),
				...e(304, "8", Y("seed.events.monthSep"), Y("seed.events.row3"))
			]);
		},
		itemLabel: "row",
		itemLabelKey: "item.row",
		item: (e) => {
			let t = Wo(e) + 16;
			return {
				blocks: [
					Q(Z(6, t, 8, 88), Y("seed.events.newBadge"), {
						align: "center",
						box: !0
					}),
					Q(Z(16, t, 58, 88), Y("seed.events.row", { title: Y("seed.events.newTitle") })),
					ko(Z(78, t + 24, 16, 40), Y("seed.events.signup"), { style: "secondary" })
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
				let r = Oo(Z(e, 80, 22, 180), { alt: Y("seed.team.alt") }), i = Q(Z(e, 268, 22, 84), Y("seed.team.member", { role: n }), { align: "center" });
				return r.mobileOrder = qo(80, t, 0), i.mobileOrder = qo(80, t, 1), [r, i];
			};
			return Jo("team", "420px", Vo(Ho("surface")), [
				Q(Z(6, 24, 50, 32), Y("seed.team.title")),
				...e(7.5, 0, Y("seed.team.role1")),
				...e(39, 1, Y("seed.team.role2")),
				...e(70.5, 2, Y("seed.team.role3"))
			]);
		},
		itemLabel: "person",
		itemLabelKey: "item.person",
		item: (e) => {
			let { x: t, y: n, n: r } = Ko(e, 3, 7.5, 31.5, 80, 288, 22, 272), i = Oo(Z(t, n, 22, 180), { alt: Y("seed.team.alt") }), a = Q(Z(t, n + 188, 22, 84), Y("seed.team.member", { role: Y("seed.team.roleNew") }), { align: "center" });
			return i.mobileOrder = qo(80, r, 0), a.mobileOrder = qo(80, r, 1), {
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
		create: () => Jo("faq", "520px", Vo(Ho("bg")), [
			Q(Z(25, 24, 50, 36), Y("seed.faq.title"), { align: "center" }),
			Lo(Z(20, 80, 60, 320), [
				{
					q: Y("seed.faq.q1"),
					a: Y("seed.faq.answer")
				},
				{
					q: Y("seed.faq.q2"),
					a: Y("seed.faq.answer")
				},
				{
					q: Y("seed.faq.q3"),
					a: Y("seed.faq.answer")
				}
			]),
			Q(Z(20, 416, 60, 32), Y("seed.faq.more"), { align: "center" })
		])
	}), e.sections.define("timeline", {
		label: "Timeline",
		labelKey: "preset.timeline.label",
		group: "Cards and lists",
		groupKey: "presetGroup.cards",
		hint: "Your story as events along a line",
		hintKey: "preset.timeline.hint",
		create: () => Jo("timeline", "480px", Vo(Ho("bg")), [Q(Z(25, 24, 50, 36), Y("seed.timeline.title"), { align: "center" }), zo(Z(25, 88, 50, 330), [
			{
				year: "2019",
				title: Y("seed.timeline.t1"),
				text: Y("seed.timeline.text")
			},
			{
				year: "2022",
				title: Y("seed.timeline.t2"),
				text: Y("seed.timeline.text")
			},
			{
				year: "2026",
				title: Y("seed.timeline.t3"),
				text: Y("seed.timeline.text")
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
				let r = Q(Z(e, 88, 25, 72), `<h3>${t + 1}</h3>`, {
					align: "center",
					size: 44
				}), i = Q(Z(e, 168, 25, 160), Y("seed.steps.card", { title: n }), {
					align: "center",
					box: !0
				});
				return r.mobileOrder = qo(88, t, 0), i.mobileOrder = qo(88, t, 1), [r, i];
			};
			return Jo("steps", "400px", Vo(Ho("bg")), [
				Q(Z(6, 28, 60, 38), Y("seed.steps.title")),
				...e(6, 0, Y("seed.steps.s1")),
				...e(37.5, 1, Y("seed.steps.s2")),
				...e(69, 2, Y("seed.steps.s3"))
			]);
		},
		itemLabel: "step",
		itemLabelKey: "item.step",
		item: (e) => {
			let { x: t, y: n, n: r } = Ko(e, 3, 6, 31.5, 88, 272, 25, 240), i = Q(Z(t, n, 25, 72), `<h3>${r + 1}</h3>`, {
				align: "center",
				size: 44
			}), a = Q(Z(t, n + 80, 25, 160), Y("seed.steps.card", { title: Y("seed.steps.newTitle") }), {
				align: "center",
				box: !0
			});
			return i.mobileOrder = qo(88, r, 0), a.mobileOrder = qo(88, r, 1), {
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
				Oo(Z(6, 40, 55, 300)),
				Q(Z(6, 348, 55, 108), Y("seed.feature.main")),
				ko(Z(6, 464, 14, 38), Y("seed.readMore"), { style: "secondary" }),
				Oo(Z(66, 40, 28, 120)),
				Q(Z(66, 164, 28, 60), Y("seed.feature.small1")),
				Oo(Z(66, 244, 28, 120)),
				Q(Z(66, 368, 28, 60), Y("seed.feature.small2"))
			];
			return e.forEach((e, t) => {
				e.mobileOrder = qo(40, t < 3 ? 0 : 1, t);
			}), Jo("lead-story", "540px", Vo(Ho("bg")), e);
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
					Oo(Z(e, 88, 25, 200)),
					Q(Z(e, 296, 25, 76), Y("seed.products.card", {
						name: n,
						price: r
					}), { align: "center" }),
					ko(Z(e + 5, 380, 15, 40), Y("seed.products.buy"))
				];
				return i.forEach((e, n) => {
					e.mobileOrder = qo(88, t, n);
				}), i;
			};
			return Jo("products", "470px", Vo(Ho("bg")), [
				Q(Z(6, 28, 50, 38), Y("seed.products.title")),
				...e(6, 0, Y("seed.products.name"), Y("seed.products.price1")),
				...e(37.5, 1, Y("seed.products.name"), Y("seed.products.price2")),
				...e(69, 2, Y("seed.products.name"), Y("seed.products.price3"))
			]);
		},
		itemLabel: "product",
		itemLabelKey: "item.product",
		item: (e) => {
			let { x: t, y: n, n: r } = Ko(e, 3, 6, 31.5, 88, 348, 25, 332), i = [
				Oo(Z(t, n, 25, 200)),
				Q(Z(t, n + 208, 25, 76), Y("seed.products.card", {
					name: Y("seed.products.name"),
					price: Y("seed.products.price1")
				}), { align: "center" }),
				ko(Z(t + 5, n + 292, 15, 40), Y("seed.products.buy"))
			];
			return i.forEach((e, t) => {
				e.mobileOrder = qo(88, r, t);
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
		create: () => Jo("shop", "544px", Vo(Ho("bg")), [
			Q(Z(6, 28, 50, 38), Y("seed.shop.title")),
			Po(Z(78, 88, 16, 48)),
			No(Z(6, 176, 88, 320))
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
				Q(Z(6, 48, 52, 96), Y("seed.shopHero.title")),
				Q(Z(6, 152, 40, 48), Y("seed.shopHero.sub")),
				ko(Z(6, 216, 17, 42), Y("seed.shopHero.cta")),
				Oo(Z(62, 40, 32, 300))
			];
			return e.forEach((e, t) => {
				e.mobileOrder = qo(48, t < 3 ? 0 : 1, t);
			}), Jo("shop-hero", "400px", {
				version: 1,
				layers: [
					Ho("bg"),
					Uo(.8, .25, .28, .6),
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
				let r = Oo(Z(e, 88, 21, 170)), i = Q(Z(e, 266, 21, 34), Y("seed.shopCategories.tile", { name: n }), { align: "center" });
				return r.mobileOrder = qo(88, t, 0), i.mobileOrder = qo(88, t, 1), [r, i];
			}, t = Jo("shop-categories", "360px", Vo(Ho("bg")), [
				Q(Z(6, 28, 60, 38), Y("seed.shopCategories.title")),
				...e(6, 0, Y("seed.shopCategories.cat1")),
				...e(29.5, 1, Y("seed.shopCategories.cat2")),
				...e(53, 2, Y("seed.shopCategories.cat3")),
				...e(76.5, 3, Y("seed.shopCategories.cat4"))
			]);
			return t.theme = "soft", t;
		},
		itemLabel: "category",
		itemLabelKey: "item.category",
		item: (e) => {
			let { x: t, y: n, n: r } = Ko(e, 4, 6, 23.5, 88, 220, 21, 212), i = Oo(Z(t, n, 21, 170)), a = Q(Z(t, n + 178, 21, 34), Y("seed.shopCategories.tile", { name: Y("seed.shopCategories.newCat") }), { align: "center" });
			return i.mobileOrder = qo(88, r, 0), a.mobileOrder = qo(88, r, 1), {
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
				let i = Ao(Z(e + 10.5, 88, 4, 52), r, 44), a = Q(Z(e, 148, 25, 96), Y(n), { align: "center" });
				return i.mobileOrder = qo(88, t, 0), a.mobileOrder = qo(88, t, 1), [i, a];
			}, t = Jo("shop-trust", "300px", Vo(Ho("bg")), [
				Q(Z(6, 28, 60, 38), Y("seed.shopTrust.title")),
				...e(6, 0, "seed.shopTrust.t1", "✓"),
				...e(37.5, 1, "seed.shopTrust.t2", "↻"),
				...e(69, 2, "seed.shopTrust.t3", "✉")
			]);
			return t.theme = "muted", t;
		},
		itemLabel: "card",
		itemLabelKey: "item.card",
		item: (e) => {
			let { x: t, y: n, n: r } = Ko(e, 3, 6, 31.5, 148, 216, 25, 156, -60), i = Ao(Z(t + 10.5, n - 60, 4, 52), "✓", 44), a = Q(Z(t, n, 25, 96), Y("seed.shopTrust.newItem"), { align: "center" });
			return i.mobileOrder = qo(88, r, 0), a.mobileOrder = qo(88, r, 1), {
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
				Q(Z(6, 56, 52, 100), Y("seed.shopShowcase.title")),
				Q(Z(6, 164, 42, 56), Y("seed.shopShowcase.text")),
				ko(Z(6, 236, 18, 42), Y("seed.shopShowcase.cta")),
				Oo(Z(62, 48, 32, 240))
			];
			e.forEach((e, t) => {
				e.mobileOrder = qo(56, t < 3 ? 0 : 1, t);
			});
			let t = Jo("shop-showcase", "340px", Vo(Ho("bg")), e);
			return t.theme = "deep", t;
		}
	}), e.sections.define("checkout", {
		label: "Checkout",
		labelKey: "preset.checkout.label",
		group: "Shop",
		groupKey: "presetGroup.shop",
		hint: "Order form that sends the basket as an email or to an endpoint",
		hintKey: "preset.checkout.hint",
		create: () => Jo("checkout", "560px", Vo(Ho("bg")), [Q(Z(6, 28, 50, 38), Y("seed.checkout.title")), Fo(Z(25, 96, 50, 430))])
	}), e.sections.define("cta", {
		label: "CTA banner",
		labelKey: "preset.cta.label",
		group: "Highlight",
		groupKey: "presetGroup.highlight",
		hint: "Full width with one clear action",
		hintKey: "preset.cta.hint",
		create: () => Jo("cta", "280px", Vo(Ho("surface"), Uo(.5, .5, .3, .7)), [
			Q(Z(20, 56, 60, 40), Y("seed.cta.title"), { align: "center" }),
			Q(Z(25, 104, 50, 26), Y("seed.cta.sub"), { align: "center" }),
			ko(Z(42, 148, 16, 42), Y("seed.join"))
		])
	}), e.sections.define("quote", {
		label: "Quote",
		labelKey: "preset.quote.label",
		group: "Highlight",
		groupKey: "presetGroup.highlight",
		hint: "Large quote with attribution",
		hintKey: "preset.quote.hint",
		create: () => Jo("quote", "300px", Vo(Ho("bg")), [Ro(Z(20, 56, 60, 190), {
			text: Y("seed.quoteBlock.text"),
			attribution: Y("seed.quoteBlock.name"),
			role: Y("seed.quoteBlock.role")
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
				let a = Bo(Z(e, 76, 25, 120), {
					value: n,
					suffix: r,
					label: i
				});
				return a.mobileOrder = qo(76, t, 0), a;
			};
			return Jo("stats", "260px", Vo(Ho("surface")), [
				e(6, 0, "120", "+", Y("seed.stats.l1")),
				e(37.5, 1, "25", "", Y("seed.stats.l2")),
				e(69, 2, "1981", "", Y("seed.stats.l3"))
			]);
		},
		itemLabel: "number",
		itemLabelKey: "item.number",
		item: (e) => {
			let { x: t, y: n, n: r } = Ko(e, 3, 6, 31.5, 76, 140, 25, 120), i = Bo(Z(t, n, 25, 120), {
				value: "42",
				label: Y("seed.stats.newLabel")
			});
			return i.mobileOrder = qo(76, r, 0), {
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
			let e = (e) => Oo(Z(e, 108, 18.5, 100), {
				alt: Y("seed.sponsors.alt"),
				fit: "contain",
				radius: null,
				saturate: 0
			});
			return Jo("sponsors", "280px", Vo(Ho("bg")), [
				Q(Z(6, 28, 60, 36), Y("seed.sponsors.title")),
				e(5.5),
				e(29),
				e(52.5),
				e(76)
			]);
		},
		itemLabel: "logo",
		itemLabelKey: "item.logo",
		item: (e) => {
			let { x: t, y: n } = Ko(e, 4, 5.5, 23.5, 108, 124, 18.5, 100);
			return {
				blocks: [Oo(Z(t, n, 18.5, 100), {
					alt: Y("seed.sponsors.alt"),
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
		create: () => Jo("membership", "500px", Vo(Ho("surface")), [
			Q(Z(6, 28, 50, 38), Y("seed.membership.title")),
			Q(Z(14, 88, 32, 250), Y("seed.membership.tier1"), {
				align: "center",
				box: !0
			}),
			Q(Z(54, 88, 32, 250), Y("seed.membership.tier2"), {
				align: "center",
				box: !0
			}),
			ko(Z(42, 358, 16, 42), Y("seed.join")),
			Q(Z(25, 414, 50, 30), Y("seed.membership.vipps"), { align: "center" })
		])
	});
}
//#endregion
//#region ../template/assets/engine/0.7.1/templates-model.js
var Xo = [
	"section",
	"blocks",
	"page"
];
function Zo(e) {
	return Ca(String(e ?? ""), "");
}
function Qo(e, t, { id: n, title: r }) {
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
//#region ../template/assets/engine/0.7.1/collections-csv.js
var $o = [
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
function es(e) {
	let t = String(e ?? "");
	return /[",\n\r]/.test(t) ? `"${t.replaceAll("\"", "\"\"")}"` : t;
}
function ts(e, t) {
	return t === "sizes" ? (e.sizes ?? []).join("|") : t === "colors" ? (e.colors ?? []).map((e) => e.name).join("|") : e[t] ?? "";
}
function ns(e) {
	let t = [$o.join(",")];
	for (let n of e ?? []) t.push($o.map((e) => es(ts(n, e))).join(","));
	return t.join("\n") + "\n";
}
function rs(e) {
	let t = [], n = [], r = "", i = !1, a = String(e ?? "");
	for (let e = 0; e < a.length; e += 1) {
		let o = a[e];
		i ? o === "\"" && a[e + 1] === "\"" ? (r += "\"", e += 1) : o === "\"" ? i = !1 : r += o : o === "\"" ? i = !0 : o === "," ? (n.push(r), r = "") : o === "\n" || o === "\r" ? (o === "\r" && a[e + 1] === "\n" && (e += 1), n.push(r), t.push(n), n = [], r = "") : r += o;
	}
	return (r !== "" || n.length) && (n.push(r), t.push(n)), t.filter((e) => e.some((e) => e.trim() !== ""));
}
var is = (e) => String(e ?? "").split("|").map((e) => e.trim()).filter(Boolean);
function as(e) {
	let t = rs(e);
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
		let s = is(t.sizes);
		s.length && (o.sizes = s);
		let c = is(t.colors);
		c.length && (o.colors = c.map((e) => ({ name: e }))), r.push(o);
	}
	return {
		entries: r,
		skipped: i
	};
}
//#endregion
//#region ../template/assets/engine/0.7.1/feeds.js
function os(e) {
	return String(e ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&apos;");
}
function ss(e, t) {
	let n = String(t ?? "").replace(/\/+$/, "");
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${(e ?? []).filter((e) => !e.noindex).map((e) => `  <url><loc>${os(n + (e.path === "/" ? "/" : e.path))}</loc></url>`).join("\n")}\n</urlset>\n`;
}
function cs(e) {
	return `User-agent: *\nDisallow: /admin/\n\nSitemap: ${String(e ?? "").replace(/\/+$/, "")}/sitemap.xml\n`;
}
var ls = [
	"news",
	"notices",
	"publications"
];
function us(e) {
	let t = String(e.origin ?? "").replace(/\/+$/, ""), n = (e.items ?? []).map((n) => {
		let r = n.href ? new URL(n.href, t + "/").href : t + "/", i = n.date ? new Date(n.date) : null, a = i && !Number.isNaN(i.getTime()) ? `\n      <pubDate>${i.toUTCString()}</pubDate>` : "", o = n.text ? `\n      <description>${os(n.text)}</description>` : "";
		return `    <item>\n      <title>${os(n.title)}</title>\n      <link>${os(r)}</link>\n      <guid isPermaLink="false">${os(`${e.path}#${n.id ?? n.title}`)}</guid>${o}${a}\n    </item>`;
	}).join("\n");
	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${os(e.title)}</title>\n    <link>${os(t + "/")}</link>\n    <description>${os(e.description ?? e.title)}</description>\n${n}${n ? "\n" : ""}  </channel>\n</rss>\n`;
}
//#endregion
//#region ../template/assets/engine/0.7.1/preset-thumb.js
var ds = /^#[0-9a-fA-F]{3,8}$/, fs = /^[a-z][a-z0-9-]*$/, ps = "#171c26", ms = "#232a38", hs = "#98a1b3", gs = "#7c5cff", _s = (e, t) => `var(--urd-color-${e}, ${t})`;
function vs(e, t) {
	return typeof e == "string" ? ds.test(e) ? e : fs.test(e) ? _s(e, t) : t : t;
}
function ys(e, t = 800) {
	let n = Number.parseFloat(e);
	return !Number.isFinite(n) || n <= 0 ? 400 : typeof e == "string" && e.trim().endsWith("vh") ? n / 100 * t : n;
}
var $ = (e) => Math.round(e * 10) / 10, bs = (e, t, n) => Math.min(n, Math.max(t, e)), xs = (e, t, n, r, i, a = "") => `<rect x="${$(e)}" y="${$(t)}" width="${$(Math.max(n, 1))}" height="${$(Math.max(r, 1))}" fill="${i}"${a}/>`;
function Ss(e) {
	if (e?.theme) return e.theme === "inverse" || e.theme === "deep" ? _s("text", hs) : e.theme === "accent" ? _s("accent", gs) : _s("surface", ms);
	for (let t of e?.background?.layers ?? []) {
		if (t.type === "color") return vs(t.props?.value, ps);
		if (t.type === "gradient") return vs(Array.isArray(t.props?.stops) ? t.props.stops[0] : null, ps);
	}
	return _s("bg", ps);
}
function Cs(e, t, n, r, i) {
	let a = /<h[1-3]/.test(String(i?.html ?? "")), o = i?.align === "center", s = _s("text", hs), c = [];
	i?.box && c.push(xs(e, t, n, r, _s("surface", ms), " rx=\"1.5\""));
	let l = i?.box ? Math.min(2, n * .06) : 0, u = e + l, d = n - l * 2, f = [
		.72,
		.9,
		.5
	], p = [
		a ? 4 : 2.2,
		2.2,
		2.2
	], m = bs(r / (p[0] + p[1] + p[2] + 4.8 + 2), 0, 1), h = t + l + Math.min(1, r * .08);
	for (let e = 0; e < 3; e++) {
		let n = Math.min(Math.max(e === 0 ? a ? 1.4 : 1 : .8, p[e] * m), Math.max(r, 1));
		if (e > 0 && h + n > t + r - l) break;
		let i = d * f[e], g = o ? u + (d - i) / 2 : u;
		c.push(xs(g, h, i, n, s, ` opacity="${e === 0 ? .8 : .4}" rx="${$(Math.min(1, n / 2))}"`)), h += n + Math.max(.8, 2.4 * m);
	}
	return c.join("");
}
function ws(e, t, n, r, i = !1) {
	let a = _s("text", hs), o = [];
	i ? (o.push(xs(e, t, n, r, _s("surface", ms), " rx=\"1.5\" opacity=\"0.35\"")), o.push(`<rect x="${$(e + .4)}" y="${$(t + .4)}" width="${$(Math.max(n - .8, 1))}" height="${$(Math.max(r - .8, 1))}" fill="none" stroke="${a}" stroke-width="0.6" stroke-dasharray="2 2" opacity="0.35" rx="1.5"/>`)) : o.push(xs(e, t, n, r, _s("surface", ms), " rx=\"1.5\""));
	let s = i ? .15 : .4, c = (t) => $(e + n * t), l = (e) => $(t + r * e);
	return o.push(`<polygon points="${c(.08)},${l(.9)} ${c(.42)},${l(.38)} ${c(.62)},${l(.68)} ${c(.75)},${l(.5)} ${c(.92)},${l(.9)}" fill="${a}" opacity="${s}"/>`), o.push(`<circle cx="${c(.28)}" cy="${l(.26)}" r="${$(Math.max(1, Math.min(n, r) * .1))}" fill="${a}" opacity="${$(s + .1)}"/>`), o.join("");
}
function Ts(e, t, n, r, i) {
	let a = !(Array.isArray(i?.images) && i.images.length), o = Math.max(1, n * .03), s = (n - o * 2) / 3, c = [];
	for (let n = 0; n < 3; n++) c.push(ws(e + n * (s + o), t, s, r, a));
	return c.join("");
}
function Es(e, t, n, r) {
	let i = Math.max(1, n * .03), a = (n - i * 2) / 3, o = [];
	for (let n = 0; n < 3; n++) {
		let s = e + n * (a + i);
		o.push(xs(s, t, a, r * .55, _s("surface", ms), " rx=\"1.5\"")), o.push(xs(s, t + r * .62, a * .8, 2, _s("text", hs), " opacity=\"0.5\" rx=\"1\""));
	}
	return o.join("");
}
function Ds(e, t, n, r, i) {
	let a = vs(i?.color, gs), o = i?.kind;
	return o === "circle" ? `<ellipse cx="${$(e + n / 2)}" cy="${$(t + r / 2)}" rx="${$(Math.max(n / 2, 1))}" ry="${$(Math.max(r / 2, 1))}" fill="${a}" opacity="0.8"/>` : o === "triangle" ? `<polygon points="${$(e)},${$(t + r)} ${$(e + n / 2)},${$(t)} ${$(e + n)},${$(t + r)}" fill="${a}" opacity="0.8"/>` : o === "line" || o === "arrow" ? xs(e, t + r / 2 - .75, n, 1.5, a, " opacity=\"0.85\" rx=\"0.75\"") : xs(e, t, n, r, a, " opacity=\"0.8\" rx=\"1\"");
}
function Os(e, t, n, r, i, a) {
	if (e === "text") return Cs(t, n, r, i, a);
	if (e === "image") return ws(t, n, r, i, !a?.src);
	if (e === "gallery") return Ts(t, n, r, i, a);
	if (e === "collection") return Es(t, n, r, i);
	if (e === "faq") {
		let e = bs(Math.floor(i / 5), 2, 3), a = Math.max(.6, i * .04), o = (i - a * (e - 1)) / e, s = [];
		for (let i = 0; i < e; i += 1) {
			let e = n + i * (o + a);
			s.push(xs(t, e, r, o, _s("surface", ms), " rx=\"1\"")), s.push(xs(t + r * .06, e + o / 2 - .7, r * .55, 1.4, _s("text", hs), " opacity=\"0.5\" rx=\"0.7\"")), s.push(`<circle cx="${$(t + r * .92)}" cy="${$(e + o / 2)}" r="0.9" fill="${_s("text", hs)}" opacity="0.4"/>`);
		}
		return s.join("");
	}
	if (e === "shape") return Ds(t, n, r, i, a);
	if (e === "button") return xs(t, n, r, i, _s("accent", gs), ` rx="${$(Math.min(i / 2, 4))}"`);
	if (e === "icon") {
		let e = Math.max(1.2, Math.min(r, i) / 2);
		return `<circle cx="${$(t + r / 2)}" cy="${$(n + i / 2)}" r="${$(e)}" fill="${_s("accent", gs)}" opacity="0.85"/>`;
	}
	if (e === "video") {
		let e = [xs(t, n, r, i, _s("surface", ms), " rx=\"1.5\"")], a = t + r / 2, o = n + i / 2, s = Math.max(1.5, Math.min(r, i) * .22);
		return e.push(`<polygon points="${$(a - s / 2)},${$(o - s)} ${$(a - s / 2)},${$(o + s)} ${$(a + s)},${$(o)}" fill="${_s("text", hs)}" opacity="0.6"/>`), e.join("");
	}
	if (e === "timeline") {
		let e = [xs(t + 1, n, 1.4, i, _s("accent", gs), " opacity=\"0.7\" rx=\"0.7\"")];
		for (let a = 0; a < 3; a += 1) {
			let o = n + i * (.18 + a * .32);
			e.push(`<circle cx="${$(t + 1.7)}" cy="${$(o)}" r="1.6" fill="${_s("accent", gs)}"/>`), e.push(xs(t + 5, o - 1, r * .5, 2, _s("text", hs), " opacity=\"0.5\" rx=\"1\""));
		}
		return e.join("");
	}
	if (e === "quote") return [
		`<text x="${$(t + r / 2)}" y="${$(n + i * .34)}" text-anchor="middle" font-size="${$(Math.min(r, i) * .5)}" font-family="Georgia, serif" fill="${_s("accent", gs)}">“</text>`,
		xs(t + r * .15, n + i * .48, r * .7, 2, _s("text", hs), " opacity=\"0.6\" rx=\"1\""),
		xs(t + r * .25, n + i * .62, r * .5, 2, _s("text", hs), " opacity=\"0.6\" rx=\"1\""),
		xs(t + r * .35, n + i * .82, r * .3, 1.6, _s("text", hs), " opacity=\"0.35\" rx=\"0.8\"")
	].join("");
	if (e === "stats") return [xs(t + r * .28, n + i * .15, r * .44, i * .42, _s("accent", gs), " opacity=\"0.85\" rx=\"1\""), xs(t + r * .32, n + i * .72, r * .36, 1.6, _s("text", hs), " opacity=\"0.4\" rx=\"0.8\"")].join("");
	if (e === "table") {
		let e = Math.max(1.6, i * .22), a = [xs(t, n, r, e, _s("accent", gs), " opacity=\"0.5\" rx=\"0.8\"")], o = bs(Math.floor((i - e) / 3.2), 1, 3);
		for (let s = 0; s < o; s += 1) a.push(xs(t, n + e + 1 + s * ((i - e - 1) / o), r, 1, _s("text", hs), " opacity=\"0.3\""));
		return a.push(xs(t + r * .33, n, .6, i, _s("text", hs), " opacity=\"0.2\"")), a.push(xs(t + r * .66, n, .6, i, _s("text", hs), " opacity=\"0.2\"")), a.join("");
	}
	if (e === "share") {
		let e = Math.max(1.2, Math.min(i / 2, r / 9)), a = [];
		for (let r = 0; r < 4; r += 1) a.push(`<circle cx="${$(t + e + r * (e * 2 + 1.5))}" cy="${$(n + i / 2)}" r="${$(e)}" fill="${_s("accent", gs)}" opacity="0.8"/>`);
		return a.join("");
	}
	if (e === "countdown") {
		let e = Math.max(.8, r * .03), a = (r - e * 3) / 4, o = [];
		for (let r = 0; r < 4; r += 1) {
			let s = t + r * (a + e);
			o.push(xs(s, n, a, i, _s("surface", ms), " rx=\"1\"")), o.push(xs(s + a * .25, n + i * .2, a * .5, i * .35, _s("accent", gs), " opacity=\"0.85\" rx=\"0.8\""));
		}
		return o.join("");
	}
	if (e === "audio") {
		let e = [xs(t, n, r, i, _s("surface", ms), " rx=\"1.5\"")], a = n + i / 2, o = Math.max(1.2, i * .28);
		return e.push(`<polygon points="${$(t + r * .06)},${$(a - o)} ${$(t + r * .06)},${$(a + o)} ${$(t + r * .06 + o * 1.4)},${$(a)}" fill="${_s("accent", gs)}" opacity="0.85"/>`), e.push(xs(t + r * .2, a - .6, r * .7, 1.2, _s("text", hs), " opacity=\"0.35\" rx=\"0.6\"")), e.join("");
	}
	if (e === "product") {
		let e = Math.max(.8, r * .03), a = (r - e * 2) / 3, o = [];
		for (let r = 0; r < 3; r += 1) {
			let s = t + r * (a + e);
			o.push(xs(s, n, a, i, _s("surface", ms), " rx=\"1\"")), o.push(xs(s + a * .08, n + i * .06, a * .84, i * .42, _s("text", hs), " opacity=\"0.15\" rx=\"0.8\"")), o.push(xs(s + a * .08, n + i * .56, a * .6, 1.4, _s("text", hs), " opacity=\"0.5\" rx=\"0.7\"")), o.push(xs(s + a * .08, n + i * .72, a * .35, 1.4, _s("accent", gs), " opacity=\"0.85\" rx=\"0.7\"")), o.push(xs(s + a * .08, n + i * .84, a * .84, i * .1, _s("accent", gs), " opacity=\"0.6\" rx=\"1\""));
		}
		return o.join("");
	}
	if (e === "cart") {
		let e = Math.max(1.5, Math.min(r, i) / 2.4), a = t + r / 2, o = n + i / 2;
		return [
			`<circle cx="${$(a)}" cy="${$(o)}" r="${$(e)}" fill="${_s("surface", ms)}"/>`,
			xs(a - e * .5, o - e * .25, e, e * .55, _s("text", hs), " opacity=\"0.5\" rx=\"0.4\""),
			`<circle cx="${$(a + e * .75)}" cy="${$(o - e * .75)}" r="${$(Math.max(.9, e * .35))}" fill="${_s("accent", gs)}"/>`
		].join("");
	}
	return e === "checkout" ? [
		xs(t, n, r * .7, 1.2, _s("text", hs), " opacity=\"0.5\" rx=\"0.6\""),
		xs(t, n + i * .12, r * .5, 1.2, _s("text", hs), " opacity=\"0.35\" rx=\"0.6\""),
		xs(t, n + i * .3, r, i * .14, _s("surface", ms), " rx=\"1\""),
		xs(t, n + i * .5, r, i * .14, _s("surface", ms), " rx=\"1\""),
		xs(t, n + i * .78, r * .45, i * .16, _s("accent", gs), " opacity=\"0.85\" rx=\"1.2\"")
	].join("") : xs(t, n, r, i, _s("surface", ms), " rx=\"1.5\"");
}
function ks(e, t, n) {
	let r = Array.isArray(e?.blocks) ? e.blocks : [], i = r.map((e) => (e.frames?.desktop?.y ?? 0) + (e.frames?.desktop?.h ?? 0)), a = n / Math.max(ys(e?.size?.minHeight), i.length ? Math.max(...i) + 16 : 0), o = [xs(0, 0, t, n, Ss(e))];
	for (let r of e?.background?.layers ?? []) {
		if (r.type !== "glow") continue;
		let e = r.props ?? {};
		o.push(`<circle cx="${$(bs(e.x ?? .5, 0, 1) * t)}" cy="${$(bs(e.y ?? .3, 0, 1) * n)}" r="${$(t * bs(e.radius ?? .5, .1, 1) * .5)}" fill="${vs(e.color, gs)}" opacity="${$(bs(e.opacity ?? .3, 0, .5))}"/>`);
	}
	let s = t * .06, c = t - s * 2;
	for (let e of r) {
		let r = e.frames?.desktop;
		if (!r) continue;
		let i = bs(s + (r.x ?? 0) * (c / 100), 0, t - 2), l = bs((r.y ?? 0) * a, 0, n - 2), u = bs((r.w ?? 10) * (c / 100), 2, t - i), d = bs((r.h ?? 20) * a, 2, n - l);
		o.push(Os(e.type, i, l, u, d, e.props));
	}
	return o.join("");
}
function As(e, { w: t = 96, h: n = 116, max: r = 6 } = {}) {
	let i = (Array.isArray(e?.sections) ? e.sections : []).slice(0, r);
	if (!i.length) return `<svg viewBox="0 0 ${t} ${n}" width="${t}" height="${n}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${xs(0, 0, t, n, _s("bg", ps))}</svg>`;
	let a = i.map((e) => bs(ys(e?.size?.minHeight), 160, 900)), o = a.reduce((e, t) => e + t, 0), s = n - 1 * (i.length - 1), c = [], l = 0;
	for (let e = 0; e < i.length; e += 1) {
		let n = Math.max(6, a[e] / o * s);
		c.push(`<g transform="translate(0 ${$(l)})">${ks(i[e], t, n)}</g>`), l += n + 1;
	}
	return `<svg viewBox="0 0 ${t} ${n}" width="${t}" height="${n}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${c.join("")}</svg>`;
}
//#endregion
//#region ../template/assets/engine/0.7.1/page-presets.js
var js = /* @__PURE__ */ new Map();
Yo({ sections: { define: (e, t) => js.set(e, t) } });
var Ms = [
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
function Ns(e, { pageId: t, title: n }) {
	let r = Ms.find((t) => t.id === e);
	return r ? {
		schemaVersion: 4,
		meta: {
			id: t,
			title: n
		},
		sections: r.sections.map((e) => js.get(e).create())
	} : null;
}
//#endregion
//#region ../template/assets/engine/0.7.1/palette-search.js
function Ps(e) {
	return String(e ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}
function Fs(e, t) {
	let n = Ps(t).trim(), r = Ps(e);
	return n ? r.startsWith(n) ? 0 : r.split(/[^a-z0-9]+/).some((e) => e.startsWith(n)) ? 1 : r.includes(n) ? 2 : -1 : 2;
}
function Is(e, t, n) {
	return e.map((e, r) => ({
		item: e,
		i: r,
		rank: Fs(n(e), t)
	})).filter((e) => e.rank >= 0).sort((e, t) => e.rank - t.rank || e.i - t.i).map((e) => e.item);
}
//#endregion
//#region ../template/assets/engine/0.7.1/theme.js
function Ls(e, t, n) {
	return t === "light" || t === "dark" ? t : n ? "dark" : "light";
}
function Rs(e, t) {
	let n = e.tokens || {}, r = e.scheme === "dark" ? "dark" : "light";
	if (!e.alt?.tokens || t === r) return n;
	let i = {};
	for (let t of /* @__PURE__ */ new Set([...Object.keys(n), ...Object.keys(e.alt.tokens)])) i[t] = {
		...n[t],
		...e.alt.tokens[t]
	};
	return i;
}
var zs = /^[a-zA-Z0-9#%.,()'"\s+\-*/]+$/;
function Bs(e) {
	return typeof e == "string" && zs.test(e) && !/url\(|\/\*|\*\/|expression/i.test(e);
}
function Vs(e) {
	let t = e.tokens || {}, n = Rs(e, "light"), r = Rs(e, "dark"), i = e.scheme === "dark" ? "dark" : "light", a = [], o = [], s = [], c = /* @__PURE__ */ new Set([
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
			Bs(c) && (a.push(`  --urd-${e}-${l}: ${c};`), i && a.push(`  --urd-base-${l}: ${c};`)), u !== d && (i && Bs(u) && Bs(d) ? o.push({
				name: l,
				lv: u,
				dv: d
			}) : !i && Bs(u) && Bs(d) && s.push({
				group: e,
				name: l,
				lv: u,
				dv: d
			}));
		}
	}
	let l = o.length > 0 || s.length > 0, u = `:root {\n  color-scheme: ${l ? "light dark" : i};\n${a.join("\n")}\n}\n`;
	if (!l) return u;
	let d = [];
	for (let e of o) {
		let t = `light-dark(${e.lv}, ${e.dv})`;
		d.push(`    --urd-color-${e.name}: ${t};`), d.push(`    --urd-base-${e.name}: ${t};`);
	}
	if (u += "@supports (color: light-dark(#000, #fff)) {\n", d.length && (u += `  :root {\n${d.join("\n")}\n  }\n`), u += "  :root[data-urd-theme=\"light\"] { color-scheme: light; }\n", u += "  :root[data-urd-theme=\"dark\"] { color-scheme: dark; }\n", s.length) {
		let e = (e) => s.map((t) => `    --urd-${t.group}-${t.name}: ${e(t)};`).join("\n");
		u += `  @media (prefers-color-scheme: dark) {\n    :root {\n${s.map((e) => `      --urd-${e.group}-${e.name}: ${e.dv};`).join("\n")}\n    }\n  }\n`, u += `  :root[data-urd-theme="light"] {\n${e((e) => e.lv)}\n  }\n`, u += `  :root[data-urd-theme="dark"] {\n${e((e) => e.dv)}\n  }\n`;
	}
	return u += "}\n", u;
}
function Hs(e) {
	return /^[a-z][a-z0-9-]*$/.test(e) ? `var(--urd-color-${e})` : e;
}
var Us = {
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
}, Ws = {
	surface: "sectionTheme.surface",
	accent: "sectionTheme.accent",
	inverse: "sectionTheme.inverse",
	soft: "sectionTheme.soft",
	muted: "sectionTheme.muted",
	deep: "sectionTheme.deep",
	highlighted: "sectionTheme.highlighted"
};
[...new Set(Object.values(Us).flatMap(Object.keys))];
function Gs(e) {
	return Us[e] ?? {};
}
function Ks(e) {
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
function qs(e, t) {
	let n = Ks(e), r = Ks(t);
	return n == null || r == null ? null : (Math.max(n, r) + .05) / (Math.min(n, r) + .05);
}
//#endregion
//#region ../template/assets/engine/0.7.1/backgrounds/color.js
var Js = {
	version: 1,
	label: "Colour",
	labelKey: "bgLayer.color",
	defaults: () => ({
		value: "bg",
		opacity: 1
	}),
	migrations: {},
	render(e, t) {
		e.style.background = Hs(t.value), e.style.opacity = String(t.opacity ?? 1);
	}
}, Ys = {
	linear: [
		"pan",
		"pan-loop",
		"rotate"
	],
	radial: ["pulse", "orbit"]
};
function Xs(e) {
	let t = Array.isArray(e) && e.length ? e : [{ color: "#0b0e14" }, { color: "#1a1030" }], n = t.map((e) => Math.max(0, Number(e?.share) || 0)), r = n.reduce((e, t) => e + t, 0), i = r <= 0, a = i ? t.length : r, o = 0;
	return t.map((e, t) => {
		let r = i ? 1 : n[t], s = (o + r / 2) / a * 100;
		return o += r, {
			color: e?.color ?? "#0b0e14",
			at: Math.round(s * 100) / 100
		};
	});
}
function Zs(e) {
	let t = (e) => Math.round(e * 100) / 100, n = e[0]?.at ?? 0;
	return [...e.map((e) => ({
		color: e.color,
		at: t(e.at - n)
	})), {
		color: e[0]?.color ?? "#0b0e14",
		at: 100
	}];
}
function Qs(e, t, n, r = .5) {
	let i = n % 360 * Math.PI / 180, a = (e) => Math.round(e * 100) / 100 || 0, o = (Math.abs(e * Math.sin(i)) + Math.abs(t * Math.cos(i))) / (1 - Math.min(Math.max(r, 0), .9));
	return {
		period: a(o),
		dx: a(Math.sin(i) * o),
		dy: a(-Math.cos(i) * o)
	};
}
function $s(e, t, n) {
	return `repeating-linear-gradient(${t}deg, ${e.map((e) => `${Hs(e.color)} ${Math.round(e.at / 100 * n * 100) / 100}px`).join(", ")})`;
}
function ec(e) {
	let t = e.kind === "radial" ? "radial" : "linear", n = (Ys[t] ?? []).includes(e.animation) ? e.animation : null, r = Xs(e.stops), i = r.map((e) => `${Hs(e.color)} ${e.at}%`).join(", "), a = {}, o;
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
					stops: Zs(r),
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
var tc = /* @__PURE__ */ new Set(), nc = !1;
function rc(e) {
	tc.add(e), !(nc || typeof window > "u") && (nc = !0, window.addEventListener("resize", () => {
		for (let e of [...tc]) e() || tc.delete(e);
	}));
}
var ic = !1;
function ac() {
	if (!ic) {
		ic = !0;
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
var oc = {
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
		let n = ec(t);
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
					let e = Qs(r, i, n.loop.angle, n.loop.maxShare);
					t.style.inset = `${-Math.ceil(e.period)}px`, t.style.background = $s(n.loop.stops, n.loop.angle, e.period), t.style.setProperty("--urd-loop-dx", `${e.dx}px`), t.style.setProperty("--urd-loop-dy", `${e.dy}px`);
				}
				return !0;
			};
			requestAnimationFrame(r), rc(r);
			return;
		}
		if (n.runner) {
			e.classList.add("urd-bg-loop-host");
			let t = document.createElement("div");
			t.className = n.runner.className, t.style.background = n.runner.background, n.runner.left != null && (t.style.left = n.runner.left), n.runner.top != null && (t.style.top = n.runner.top), e.appendChild(t);
			return;
		}
		e.style.background = n.background, n.className && (e.classList.add(n.className), n.className === "urd-bg-rotate" && ac());
	}
}, sc = {
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
		let n = Hs(t.color), r = t.x ?? .5, i = t.y ?? .3, a = t.radius ?? .5;
		e.style.background = `radial-gradient(circle at ${r * 100}% ${i * 100}%, ${n} 0%, transparent ${a * 100}%)`, e.style.opacity = String(t.opacity ?? .35);
	}
}, cc = "url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22128%22%20height%3D%22128%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.9%22%20numOctaves%3D%222%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22128%22%20height%3D%22128%22%20filter%3D%22url(%23n)%22%2F%3E%3C%2Fsvg%3E\")", lc = {
	version: 1,
	label: "Grain",
	labelKey: "bgLayer.grain",
	defaults: () => ({ opacity: .06 }),
	migrations: {},
	render(e, t) {
		e.style.backgroundImage = cc, e.style.backgroundRepeat = "repeat", e.style.opacity = String(t.opacity ?? .06);
	}
}, uc = /^(?:data:image\/[\w.+-]+;base64,[A-Za-z0-9+/=]+|\/(?!\/)[\w%./-]*)$/;
function dc(e) {
	return typeof e == "string" && uc.test(e);
}
//#endregion
//#region ../template/assets/engine/0.7.1/backgrounds/image.js
var fc = .4;
function pc(e, t) {
	return `${(e ?? .5) * 100}% ${(t ?? .5) * 100}%`;
}
function mc(e, t) {
	return e === "contain" ? "contain" : e === "cover" ? "cover" : `${Math.max(0, t ?? 1) * 100}%`;
}
function hc(e) {
	let t = "-9999px";
	return e === "up" ? `inset(${t} 0 0 0)` : e === "down" ? `inset(0 0 ${t} 0)` : e === "both" ? `inset(${t} 0 ${t} 0)` : "inset(0)";
}
function gc(e, t, n, r = .18) {
	let i = Math.max(0, Math.min(1, n)) * fc * t;
	return Math.round(Math.min(i, r * e));
}
function _c(e, t, n, r, i) {
	let a = e + t / 2, o = (n / 2 - a) * Math.max(0, Math.min(1, r)) * fc, s = i ?? gc(t, n, r);
	return Math.max(-s, Math.min(s, o)) || 0;
}
var vc = /* @__PURE__ */ new Set(), yc = !1, bc = 0;
function xc() {
	bc = 0;
	for (let e of [...vc]) e() || vc.delete(e);
}
function Sc() {
	bc ||= requestAnimationFrame(xc);
}
function Cc(e) {
	vc.add(e), e(), !(yc || typeof window > "u") && (yc = !0, window.addEventListener("scroll", Sc, { passive: !0 }), window.addEventListener("resize", Sc, { passive: !0 }));
}
function wc(e, t, n, r) {
	let i = r === "cover" || r === "tile" || r === "repeat", a = e.closest(".urd-section") ?? e.parentElement?.closest(".urd-section") ?? e.parentElement, o = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
	e.style.willChange = "transform";
	let s = (t) => {
		e.style.top = `-${t}px`, e.style.bottom = `-${t}px`;
	}, c = () => {
		if (!e.isConnected) return !1;
		if (o || document.body.classList.contains("urd-mobile")) return s(n), e.style.transform = "", !0;
		let r = (a ?? e).getBoundingClientRect(), c = window.innerHeight || document.documentElement.clientHeight, l = gc(r.height, c, t, i ? .18 : .6);
		s(i ? Math.max(n, l) : n);
		let u = _c(r.top, r.height, c, t, l);
		return e.style.transform = `translateY(${u.toFixed(1)}px)`, !0;
	};
	Cc(c), typeof requestAnimationFrame == "function" && requestAnimationFrame(() => requestAnimationFrame(c));
}
function Tc() {
	return typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("animation-timeline", "view()");
}
var Ec = /* @__PURE__ */ new Set(), Dc = !1, Oc = 0;
function kc() {
	Oc = 0;
	for (let e of [...Ec]) e() || Ec.delete(e);
}
function Ac() {
	!Oc && typeof requestAnimationFrame == "function" && (Oc = requestAnimationFrame(kc));
}
function jc(e) {
	Ec.add(e), e(), !(Dc || typeof window > "u") && (Dc = !0, window.addEventListener("resize", Ac, { passive: !0 }));
}
function Mc(e, t, n, r) {
	let i = r === "cover" || r === "tile" || r === "repeat", a = e.closest(".urd-section") ?? e.parentElement?.closest(".urd-section") ?? e.parentElement;
	e.style.willChange = "transform", e.classList.add("urd-parallax-css");
	let o = () => {
		if (!e.isConnected) return !1;
		let r = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || document.body.classList.contains("urd-mobile"), o = (a ?? e).getBoundingClientRect(), s = window.innerHeight || document.documentElement.clientHeight, c = gc(o.height, s, t, i ? .18 : .6), l = i && !r ? Math.max(n, c) : n;
		return e.style.setProperty("--urd-px-shift", `${c}px`), e.style.top = `-${l}px`, e.style.bottom = `-${l}px`, !0;
	};
	jc(o), typeof requestAnimationFrame == "function" && requestAnimationFrame(() => requestAnimationFrame(o));
}
var Nc = {
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
		if (!dc(t.src)) return;
		e.style.opacity = String(t.opacity ?? 1), e.style.clipPath = hc(t.bleed), e.style.zIndex = t.bleed === "down" || t.bleed === "both" ? "1" : "";
		let n = document.createElement("div");
		n.className = "urd-bg-image", n.style.position = "absolute", n.style.left = "0", n.style.right = "0", n.style.top = "0", n.style.bottom = "0";
		let r = t.fit === "tile" || t.fit === "repeat";
		n.style.backgroundImage = `url("${t.src}")`, n.style.backgroundSize = mc(t.fit, t.size), n.style.backgroundRepeat = r ? "repeat" : "no-repeat", n.style.backgroundPosition = pc(t.x, t.y);
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
		e.appendChild(n), t.parallax > 0 && Pc(n, t.parallax, i, t.fit ?? "cover");
	}
};
function Pc(e, t, n, r) {
	Tc() ? Mc(e, t, n, r) : wc(e, t, n, r);
}
//#endregion
//#region ../template/assets/engine/0.7.1/gallery-model.js
function Fc(e, t, n) {
	return !Number.isFinite(n) || n < 1 ? 0 : (((Number.isFinite(e) ? e : 0) + t) % n + n) % n;
}
function Ic({ count: e = 0, reducedMotion: t = !1 } = {}) {
	return e >= 2 && !t;
}
function Lc(e, { min: t = 2, fallback: n = 5 } = {}) {
	let r = Number(e);
	return !Number.isFinite(r) || r <= 0 ? n : Math.max(t, r);
}
//#endregion
//#region ../template/assets/engine/0.7.1/backgrounds/slideshow.js
var Rc = {
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
		let n = (t.images ?? []).filter((e) => dc(e?.src));
		if (!n.length) return;
		e.classList.add("urd-bg-slideshow"), e.style.opacity = String(t.opacity ?? 1), t.blur > 0 && (e.style.filter = `blur(${t.blur}px)`, e.style.inset = `-${t.blur * 2}px`);
		let r = Math.max(0, Number(t.fade) || 0);
		e.style.setProperty("--urd-bgg-fade", `${r}s`);
		let i = (e, n) => {
			e.style.backgroundImage = `url("${n.src}")`, e.style.backgroundSize = mc(t.fit), e.style.backgroundRepeat = "no-repeat", e.style.backgroundPosition = pc(n.x, n.y);
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
		if (!Ic({
			count: n.length,
			reducedMotion: s
		})) return;
		let c = document.createElement("div");
		c.className = "urd-bg-slide", e.appendChild(c);
		let l = 0, u = o, d = Math.max(Lc(t.interval, { fallback: 6 }), r + .5) * 1e3, f = setInterval(() => {
			if (!e.isConnected) {
				clearInterval(f);
				return;
			}
			if (document.hidden) return;
			let t = Fc(l, 1, n.length), r = new Image();
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
}, zc = /^(?:data:video\/[\w.+-]+;base64,[A-Za-z0-9+/=]+|\/media\/[\w%./-]+\.(?:mp4|webm))$/i;
function Bc(e) {
	return typeof e == "string" && zc.test(e);
}
var Vc = null;
function Hc(e) {
	Vc ??= new IntersectionObserver((e) => {
		for (let t of e) {
			if (!t.target.isConnected) {
				Vc.unobserve(t.target);
				continue;
			}
			t.isIntersecting ? t.target.play().catch(() => {}) : t.target.pause();
		}
	}, { threshold: 0 }), Vc.observe(e);
}
var Uc = (e, t, n, r) => {
	e.style.position = "absolute", e.style.inset = "0", e.style.width = "100%", e.style.height = "100%", e.style.objectFit = t === "contain" ? "contain" : "cover", e.style.objectPosition = pc(n, r);
}, Wc = {
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
		if (!Bc(t.src)) return;
		if (e.style.opacity = String(t.opacity ?? 1), window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
			if (!dc(t.poster)) return;
			let n = document.createElement("img");
			n.className = "urd-bg-video-poster", n.alt = "", n.setAttribute("aria-hidden", "true"), n.src = t.poster, Uc(n, t.fit, t.x, t.y), e.appendChild(n);
			return;
		}
		let n = document.createElement("video");
		n.className = "urd-bg-video", n.muted = !0, n.setAttribute("muted", ""), n.loop = !0, n.playsInline = !0, n.setAttribute("playsinline", ""), n.preload = "metadata", n.disablePictureInPicture = !0, n.setAttribute("aria-hidden", "true"), dc(t.poster) && (n.poster = t.poster), n.src = t.src, Uc(n, t.fit, t.x, t.y), e.appendChild(n), Hc(n), t.parallax > 0 && Pc(n, t.parallax, 0, t.fit === "contain" ? "contain" : "cover");
	}
};
//#endregion
//#region ../template/assets/engine/0.7.1/footer-thumb.js
function Gc(e = {}) {
	let t = "#2fd6b6", n = "#5c6b64", r = e.mega ? "#16221d" : "#0e1512", i = e.cols ?? 0, a = e.social ?? 0, o = `<svg viewBox="0 0 160 80" preserveAspectRatio="none" aria-hidden="true"><rect width="160" height="80" fill="${r}"/>`;
	if (e.mega && (o += `<circle cx="20" cy="6" r="34" fill="${t}" opacity="0.18"/>`), e.bigcta) return o += `<rect x="45" y="18" width="70" height="8" rx="3" fill="${n}" opacity="0.85"/>`, o += `<rect x="56" y="32" width="48" height="4" rx="2" fill="${n}" opacity="0.5"/>`, o += `<rect x="62" y="43" width="36" height="10" rx="3" fill="${t}"/>`, o += Kc(n, e.baselineLinks), o + "</svg>";
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
	return o += Kc(n, e.baselineLinks), o + "</svg>";
}
function Kc(e, t = 0) {
	let n = `<line x1="8" y1="66" x2="152" y2="66" stroke="${e}" stroke-width="0.6" opacity="0.5"/>`;
	return n += `<rect x="8" y="70" width="40" height="3" rx="1.5" fill="${e}" opacity="0.6"/>`, t && (n += `<g fill="${e}" opacity="0.6">` + Array.from({ length: t }, (e, t) => `<rect x="${120 - t * 16}" y="70" width="12" height="3" rx="1.5"/>`).join("") + "</g>"), n;
}
//#endregion
//#region ../template/assets/engine/0.7.1/animations/core.js
var qc = () => ({
	duration: 600,
	delay: 0
}), Jc = 90, Yc = {
	"fade-in": {
		version: 1,
		label: "Fade in",
		labelKey: "anim.fadeIn",
		entrance: !0,
		defaults: qc,
		migrations: {}
	},
	"slide-up": {
		version: 1,
		label: "Slide up",
		labelKey: "anim.slideUp",
		entrance: !0,
		defaults: qc,
		migrations: {}
	},
	"zoom-in": {
		version: 1,
		label: "Zoom in",
		labelKey: "anim.zoomIn",
		entrance: !0,
		defaults: qc,
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
			step: Jc,
			effect: "slide-up",
			pattern: "sequence"
		}),
		migrations: {}
	}
}, Xc = [
	["font.system", "system-ui, sans-serif"],
	["font.arial", "Arial, Helvetica, sans-serif"],
	["font.verdana", "Verdana, Geneva, sans-serif"],
	["font.trebuchet", "'Trebuchet MS', sans-serif"],
	["font.georgia", "Georgia, 'Times New Roman', serif"],
	["font.palatino", "'Palatino Linotype', Palatino, serif"],
	["font.courier", "'Courier New', monospace"]
];
//#endregion
//#region ../template/assets/engine/0.7.1/place.js
function Zc(e) {
	let t = (e) => Math.round(e * 100) / 100, n = Math.max(0, t(100 - e.w)), r = Math.min(n, Math.max(0, t(e.x - e.w / 2))), i = Math.max(0, e.y - e.h / 2), a = e.snap === !1 || e.grid?.snap === !1, o = e.grid?.size || 8;
	return i = a ? Math.round(i) : Math.round(i / o) * o, {
		x: r,
		y: Math.max(0, i)
	};
}
//#endregion
//#region src/App.svelte
var Qc = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), $c = /* @__PURE__ */ V("<button class=\"ghost row-tool svelte-1n46o8q\"></button>"), el = /* @__PURE__ */ V("<span><span class=\"grad-grip svelte-1n46o8q\"><svg viewBox=\"0 0 16 16\" width=\"14\" height=\"14\" fill=\"currentColor\" aria-hidden=\"true\"><circle cx=\"5\" cy=\"3\" r=\"1.4\"></circle><circle cx=\"11\" cy=\"3\" r=\"1.4\"></circle><circle cx=\"5\" cy=\"8\" r=\"1.4\"></circle><circle cx=\"11\" cy=\"8\" r=\"1.4\"></circle><circle cx=\"5\" cy=\"13\" r=\"1.4\"></circle><circle cx=\"11\" cy=\"13\" r=\"1.4\"></circle></svg></span> <!> <input type=\"range\" class=\"tb-grow svelte-1n46o8q\" min=\"0\" max=\"100\" step=\"1\"/> <span class=\"gridmenu-value svelte-1n46o8q\"> </span> <!></span>"), tl = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), nl = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"360\" step=\"5\" class=\"svelte-1n46o8q\"/>", 1), rl = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <!></label> <!> <button class=\"ghost action svelte-1n46o8q\"> </button> <!> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <!></label>", 1), il = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.1\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), al = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.01\" max=\"0.3\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), ol = /* @__PURE__ */ V("<div class=\"sizefill svelte-1n46o8q\"><button type=\"button\" class=\"ghost svelte-1n46o8q\"> </button> <button type=\"button\" class=\"ghost svelte-1n46o8q\"> </button></div> <label class=\"svelte-1n46o8q\"> </label> <div class=\"focalpad svelte-1n46o8q\"><span class=\"focaldot svelte-1n46o8q\"></span></div> <label class=\"sub svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"-0.5\" max=\"1.5\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"sub svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"-0.5\" max=\"1.5\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), sl = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.1\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <!></label>", 1), cl = /* @__PURE__ */ V("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> </label> <div class=\"sizestep svelte-1n46o8q\"><button type=\"button\" class=\"svelte-1n46o8q\">−</button> <input type=\"number\" min=\"10\" max=\"400\" class=\"svelte-1n46o8q\"/> <span class=\"sizeunit svelte-1n46o8q\">%</span> <button type=\"button\" class=\"svelte-1n46o8q\">+</button></div> <!> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"20\" step=\"1\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!>", 1), ll = /* @__PURE__ */ V("<span class=\"toolbar-row svelte-1n46o8q\"><img class=\"site-icon-preview svelte-1n46o8q\" alt=\"\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), ul = /* @__PURE__ */ V("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" multiple=\"\" class=\"svelte-1n46o8q\"/></label> <!> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"2\" max=\"120\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"5\" step=\"0.1\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"20\" step=\"1\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <p class=\"panel-hint svelte-1n46o8q\"> </p>", 1), dl = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.1\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), fl = /* @__PURE__ */ V("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"video/mp4,video/webm\" class=\"svelte-1n46o8q\"/></label> <label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"sub svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"sub svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!>", 1), pl = /* @__PURE__ */ V("<div class=\"bg-layer svelte-1n46o8q\"><span class=\"nav-line svelte-1n46o8q\"><!> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span> <!></div>"), ml = /* @__PURE__ */ V("<!> <label class=\"svelte-1n46o8q\"> <!></label> <button class=\"ghost action svelte-1n46o8q\"> </button>", 1), hl = /* @__PURE__ */ V("<input class=\"nav-target svelte-1n46o8q\"/>"), gl = /* @__PURE__ */ V("<div class=\"nav-row nav-sub-row svelte-1n46o8q\"><input class=\"svelte-1n46o8q\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span> <span class=\"nav-target svelte-1n46o8q\"><!></span> <!></div>"), _l = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <!></label>"), vl = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <span class=\"num-stepper svelte-1n46o8q\"><button type=\"button\" class=\"svelte-1n46o8q\">−</button> <input type=\"number\" min=\"1\" max=\"12\" step=\"1\" class=\"svelte-1n46o8q\"/> <button type=\"button\" class=\"svelte-1n46o8q\">+</button></span></label>", 1), yl = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label>", 1), bl = /* @__PURE__ */ V("<p class=\"panel-hint svelte-1n46o8q\"> </p>"), xl = /* @__PURE__ */ V("<span class=\"nav-line svelte-1n46o8q\"><input class=\"svelte-1n46o8q\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span>"), Sl = /* @__PURE__ */ V("<label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <p class=\"panel-strong svelte-1n46o8q\"> </p> <!> <button class=\"ghost action svelte-1n46o8q\"> </button>", 1), Cl = /* @__PURE__ */ V("<span class=\"nav-line svelte-1n46o8q\"><input class=\"tl-year svelte-1n46o8q\"/> <input class=\"svelte-1n46o8q\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span> <input class=\"svelte-1n46o8q\"/>", 1), wl = /* @__PURE__ */ V("<p class=\"panel-strong svelte-1n46o8q\"> </p> <!> <button class=\"ghost action svelte-1n46o8q\"> </button>", 1), Tl = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label>", 1), El = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label>", 1), Dl = /* @__PURE__ */ V("<span class=\"toolbar-row svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button></span> <span class=\"toolbar-row svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button></span> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label>", 1), Ol = /* @__PURE__ */ V("<label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label>"), kl = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <input type=\"datetime-local\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label>", 1), Al = /* @__PURE__ */ V("<button class=\"ghost svelte-1n46o8q\"> </button>"), jl = /* @__PURE__ */ V("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"audio/*\" class=\"svelte-1n46o8q\"/></label> <!> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label>", 1), Ml = /* @__PURE__ */ V("<input class=\"svelte-1n46o8q\"/>"), Nl = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <!>", 1), Pl = /* @__PURE__ */ V("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <!>", 1), Fl = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> </label> <input class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label>", 1), Il = /* @__PURE__ */ V("<input class=\"token-input svelte-1n46o8q\" maxlength=\"4\"/>"), Ll = /* @__PURE__ */ V("<span class=\"toolbar-row svelte-1n46o8q\"><img class=\"site-icon-preview svelte-1n46o8q\"/> <button class=\"ghost svelte-1n46o8q\"> </button></span>"), Rl = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <span class=\"toolbar-row svelte-1n46o8q\"><!> <!></span></label> <!>", 1), zl = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" max=\"100\" class=\"svelte-1n46o8q\"/></label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label>", 1), Bl = /* @__PURE__ */ V("<span class=\"toolbar-row svelte-1n46o8q\"><button class=\"ghost action svelte-1n46o8q\"> </button> <button class=\"ghost action svelte-1n46o8q\"> </button></span>"), Vl = /* @__PURE__ */ V("<button class=\"ghost action svelte-1n46o8q\"> </button>"), Hl = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" max=\"100\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label>", 1), Ul = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label>", 1), Wl = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <input type=\"email\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"url\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label>", 1), Gl = /* @__PURE__ */ V("<div class=\"bg-layer svelte-1n46o8q\"><span class=\"toolbar-row svelte-1n46o8q\"><img class=\"site-icon-preview svelte-1n46o8q\" alt=\"\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label></div>"), Kl = /* @__PURE__ */ V("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" multiple=\"\" class=\"svelte-1n46o8q\"/></label> <!>", 1), ql = /* @__PURE__ */ V("<p> </p>"), Jl = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <input type=\"text\" class=\"svelte-1n46o8q\"/></label> <button class=\"ghost svelte-1n46o8q\"> </button> <!>", 1), Yl = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <input type=\"number\" class=\"svelte-1n46o8q\"/></label>"), Xl = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <input type=\"text\" class=\"svelte-1n46o8q\"/></label>"), Zl = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), Ql = /* @__PURE__ */ V("<p class=\"panel-strong svelte-1n46o8q\"> </p> <!> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), $l = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), eu = /* @__PURE__ */ V("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <!>", 1), tu = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"svelte-1n46o8q\"> <!></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), nu = /* @__PURE__ */ V("<label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), ru = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), iu = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"24\" max=\"64\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), au = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <!></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), ou = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"1\" max=\"3\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.2\" max=\"2\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.2\" max=\"2\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"2\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <button class=\"ghost action svelte-1n46o8q\"> </button> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), su = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"8\" max=\"400\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), cu = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" max=\"6\" class=\"svelte-1n46o8q\"/></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), lu = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"1\" max=\"6\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"32\" step=\"2\" class=\"svelte-1n46o8q\"/>", 1), uu = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"2\" max=\"60\" class=\"svelte-1n46o8q\"/></label>"), du = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <!></label> <!> <!> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), fu = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"1\" max=\"40\" class=\"svelte-1n46o8q\"/></label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), pu = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"100\" max=\"4000\" step=\"100\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" max=\"4000\" step=\"100\" class=\"svelte-1n46o8q\"/></label>", 1), mu = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" max=\"400\" class=\"svelte-1n46o8q\"/></label>"), hu = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <!></label> <!> <!>", 1), gu = /* @__PURE__ */ V("<hr class=\"gridmenu-divider svelte-1n46o8q\"/> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!>", 1), _u = /* @__PURE__ */ V("<div class=\"frame-grid svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <input type=\"number\" step=\"0.5\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" step=\"1\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" step=\"0.5\" min=\"1\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" step=\"1\" min=\"1\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" step=\"1\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" step=\"1\" class=\"svelte-1n46o8q\"/></label></div>"), vu = /* @__PURE__ */ V("<!> <label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"svelte-1n46o8q\"> <!></label> <!> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <details class=\"group frame-group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><!> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label></div></details>", 1), yu = /* @__PURE__ */ V("<div class=\"props-tabs svelte-1n46o8q\"><span class=\"seg svelte-1n46o8q\"><button type=\"button\"> </button> <button type=\"button\"> </button></span></div> <!>", 1), bu = /* @__PURE__ */ V("<button class=\"chrome-restore svelte-1n46o8q\"><!> </button>"), xu = /* @__PURE__ */ V("<button><!> </button>"), Su = /* @__PURE__ */ V("<div class=\"tool-pop svelte-1n46o8q\"></div>"), Cu = /* @__PURE__ */ V("<span class=\"toolmenu svelte-1n46o8q\"><button><!><!></button> <!></span>"), wu = /* @__PURE__ */ V("<button></button>"), Tu = /* @__PURE__ */ V("<span class=\"tool-cap svelte-1n46o8q\"> </span> <span class=\"viewswitch toolgrp svelte-1n46o8q\"></span>", 1), Eu = /* @__PURE__ */ V("<div class=\"tool-pop svelte-1n46o8q\"><div class=\"tool-pop-row svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"></button> <span class=\"zoom-readout svelte-1n46o8q\"> </span> <button class=\"ghost svelte-1n46o8q\"></button></div> <button><!> </button></div>"), Du = /* @__PURE__ */ V("<span class=\"toolmenu svelte-1n46o8q\"><button><span class=\"zoom-cap svelte-1n46o8q\"> </span><!></button> <!></span>"), Ou = /* @__PURE__ */ V("<span class=\"tool-cap svelte-1n46o8q\"> </span> <span class=\"zoomswitch toolgrp svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"></button> <span class=\"zoom-readout svelte-1n46o8q\"> </span> <button class=\"ghost svelte-1n46o8q\"></button> <button></button></span>", 1), ku = /* @__PURE__ */ V("<div class=\"tool-pop svelte-1n46o8q\"><button><!> </button> <button><!> </button></div>"), Au = /* @__PURE__ */ V("<span class=\"tool-cap svelte-1n46o8q\"> </span> <span class=\"toolgrp svelte-1n46o8q\"><button></button> <button></button></span>", 1), ju = /* @__PURE__ */ V("<button class=\"ghost page-btn svelte-1n46o8q\"> </button> <span class=\"toolset svelte-1n46o8q\"><!> <!> <!></span>", 1), Mu = /* @__PURE__ */ V("<button class=\"badge attention svelte-1n46o8q\"><!> <span class=\"btn-label svelte-1n46o8q\"> </span> <span class=\"badge-mini svelte-1n46o8q\"> </span></button>"), Nu = /* @__PURE__ */ V("<button class=\"discard-confirm svelte-1n46o8q\"><!> </button>"), Pu = /* @__PURE__ */ V("<span class=\"draft-cluster svelte-1n46o8q\"><span class=\"chip draft-chip svelte-1n46o8q\"><span class=\"chip-full svelte-1n46o8q\" aria-hidden=\"true\"> </span> <span class=\"chip-mini svelte-1n46o8q\" aria-hidden=\"true\">!</span></span>  <span class=\"discard-wrap svelte-1n46o8q\"><button><!><span class=\"discard-label svelte-1n46o8q\"> </span></button> <!></span></span>"), Fu = /* @__PURE__ */ V("<!> <span class=\"btn-label svelte-1n46o8q\"> </span>", 1), Iu = /* @__PURE__ */ V("<span class=\"who svelte-1n46o8q\"><!> </span>"), Lu = /* @__PURE__ */ V("<a class=\"ghost svelte-1n46o8q\" href=\"/api/github/login\"> </a>"), Ru = /* @__PURE__ */ V("<button class=\"ghost svelte-1n46o8q\"><!></button> <!> <a class=\"ghost svelte-1n46o8q\" target=\"_blank\" rel=\"noopener\"><!> <span class=\"btn-label svelte-1n46o8q\"> </span></a> <button class=\"primary svelte-1n46o8q\"> </button>", 1), zu = /* @__PURE__ */ V("<button> </button>"), Bu = /* @__PURE__ */ V("<span class=\"rail-group svelte-1n46o8q\"> </span> <!>", 1), Vu = /* @__PURE__ */ V("<div class=\"settings-pop svelte-1n46o8q\"><p class=\"panel-strong svelte-1n46o8q\"> </p> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label></div>"), Hu = /* @__PURE__ */ V("<span class=\"page-path svelte-1n46o8q\">/</span>"), Uu = /* @__PURE__ */ V("<input class=\"page-slug svelte-1n46o8q\"/>"), Wu = /* @__PURE__ */ V("<span class=\"seo-warn svelte-1n46o8q\"></span>"), Gu = /* @__PURE__ */ V("<button class=\"ghost danger svelte-1n46o8q\"><!> </button>"), Ku = /* @__PURE__ */ V("<div class=\"page-menu svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"><!> </button> <!></div>"), qu = /* @__PURE__ */ V("<div><input class=\"page-title svelte-1n46o8q\"/> <!> <!> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <span class=\"page-menu-wrap svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <!></span></span></div>"), Ju = /* @__PURE__ */ V("<img class=\"site-icon-preview svelte-1n46o8q\"/>"), Yu = /* @__PURE__ */ V("<div><button class=\"page-template-pick svelte-1n46o8q\"><span class=\"page-template-thumb svelte-1n46o8q\"></span> <span class=\"page-template-name svelte-1n46o8q\"> </span></button></div>"), Xu = /* @__PURE__ */ V("<div><button class=\"page-template-pick svelte-1n46o8q\"><span class=\"page-template-thumb svelte-1n46o8q\"></span> <span class=\"page-template-name svelte-1n46o8q\"> </span></button> <button class=\"page-template-del svelte-1n46o8q\"></button></div>"), Zu = /* @__PURE__ */ V("<span class=\"mini-label svelte-1n46o8q\"> </span> <div class=\"page-template-grid svelte-1n46o8q\"></div>", 1), Qu = /* @__PURE__ */ V("<div class=\"panel-body svelte-1n46o8q\"><!> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <textarea rows=\"2\" class=\"svelte-1n46o8q\"></textarea></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <textarea rows=\"2\" class=\"svelte-1n46o8q\"></textarea></label> <label class=\"svelte-1n46o8q\"> <!></label> <span class=\"toolbar-row svelte-1n46o8q\"><label class=\"ghost filepick tb-grow svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <!></span> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label></div></details> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <input class=\"svelte-1n46o8q\"/> <button class=\"ghost action svelte-1n46o8q\"> </button> <span class=\"mini-label svelte-1n46o8q\"> </span> <div class=\"page-template-grid svelte-1n46o8q\"><div><button class=\"page-template-pick svelte-1n46o8q\"><span class=\"page-template-thumb svelte-1n46o8q\"></span> <span class=\"page-template-name svelte-1n46o8q\"> </span></button></div> <!></div> <!></div>"), $u = /* @__PURE__ */ V("<input class=\"svelte-1n46o8q\"/> <span class=\"toolbar-row svelte-1n46o8q\"><!> <input type=\"number\" class=\"tb-num svelte-1n46o8q\" min=\"8\" max=\"96\" placeholder=\"px\"/> <button><b> </b></button> <button><i> </i></button></span>", 1), ed = /* @__PURE__ */ V("<span class=\"toolbar-row svelte-1n46o8q\"><label class=\"ghost filepick tb-grow svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <input type=\"number\" class=\"tb-num svelte-1n46o8q\" min=\"12\" max=\"128\"/> <input type=\"number\" class=\"tb-num svelte-1n46o8q\" min=\"0\" max=\"64\"/></span>"), td = /* @__PURE__ */ V("<label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label>", 1), nd = /* @__PURE__ */ V("<label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!>", 1), rd = /* @__PURE__ */ V("<div class=\"nav-row svelte-1n46o8q\"><input class=\"svelte-1n46o8q\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span> <span class=\"nav-target svelte-1n46o8q\"><!></span> <!></div> <!>", 1), id = /* @__PURE__ */ V("<div class=\"panel-body svelte-1n46o8q\"><details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <!></label> <!> <!> <!></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <!></label> <!> <!> <!> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!> <label class=\"svelte-1n46o8q\"> <!></label> <!> <!> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <p class=\"panel-strong svelte-1n46o8q\"> </p> <!></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"1\" max=\"4\" class=\"svelte-1n46o8q\"/></label></div></details> <details class=\"group svelte-1n46o8q\" open=\"\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><!> <button class=\"ghost action svelte-1n46o8q\"> </button></div></details></div>"), ad = /* @__PURE__ */ V("<div class=\"cw-row svelte-1n46o8q\"><span class=\"mini-label cw-screen svelte-1n46o8q\"> </span> <span><span class=\"cw-fill svelte-1n46o8q\"></span></span> <span class=\"gridmenu-value cw-margin svelte-1n46o8q\"> </span></div>"), od = /* @__PURE__ */ V("<div class=\"mini-label cw-binds svelte-1n46o8q\"> </div>"), sd = /* @__PURE__ */ V("<div class=\"ctl-row svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <input type=\"range\" class=\"svelte-1n46o8q\"/> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></div>"), cd = /* @__PURE__ */ V("<button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button>", 1), ld = /* @__PURE__ */ V("<div class=\"panel-body svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <p class=\"panel-strong svelte-1n46o8q\"> </p> <div class=\"sample cw-sample svelte-1n46o8q\"><!> <div class=\"cw-legend svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <span class=\"mini-label svelte-1n46o8q\"> </span></div> <!></div> <div class=\"seg cw-seg svelte-1n46o8q\"></div> <!> <p class=\"mini-label svelte-1n46o8q\"> </p> <div class=\"seg cw-seg svelte-1n46o8q\"></div> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><div class=\"ctl-row svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <input type=\"range\" class=\"svelte-1n46o8q\"/> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></div></div></details> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <!></label> <span class=\"toolbar-row svelte-1n46o8q\"><label class=\"ghost filepick tb-grow svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <!></span></div>"), ud = /* @__PURE__ */ V("<div class=\"mini-label tpv-cap svelte-1n46o8q\"> </div>"), dd = /* @__PURE__ */ V("<div class=\"theme-pvw svelte-1n46o8q\"><!> <div class=\"tpv-demo svelte-1n46o8q\"><div class=\"tpv-h svelte-1n46o8q\"> </div> <div class=\"tpv-card svelte-1n46o8q\"> </div> <div class=\"tpv-row svelte-1n46o8q\"><span class=\"tpv-btn svelte-1n46o8q\"> </span><span class=\"tpv-lnk svelte-1n46o8q\"> </span></div></div></div>"), fd = /* @__PURE__ */ V("<button type=\"button\"><span class=\"tp-band svelte-1n46o8q\"><i class=\"svelte-1n46o8q\"></i><i class=\"svelte-1n46o8q\"></i><i class=\"svelte-1n46o8q\"></i><i class=\"svelte-1n46o8q\"></i></span> <small class=\"svelte-1n46o8q\"> </small></button>"), pd = /* @__PURE__ */ V("<div class=\"ctl-row autorow svelte-1n46o8q\"><span class=\"autolbl svelte-1n46o8q\"> </span> <span class=\"seg svelte-1n46o8q\"><button type=\"button\"> </button> <button type=\"button\"> </button></span></div>"), md = /* @__PURE__ */ V("<span class=\"mini-label svelte-1n46o8q\"> </span>"), hd = /* @__PURE__ */ V("<div class=\"palcol svelte-1n46o8q\"><!> <span class=\"palcap svelte-1n46o8q\"> </span> <b class=\"palhex svelte-1n46o8q\"> </b></div>"), gd = /* @__PURE__ */ V("<div class=\"ctl-row palhead svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <button type=\"button\"> </button></div> <div></div>", 1), _d = /* @__PURE__ */ V("<div class=\"panel-body svelte-1n46o8q\"><p class=\"panel-strong svelte-1n46o8q\"> </p> <div class=\"theme-presets svelte-1n46o8q\"></div> <p class=\"panel-strong svelte-1n46o8q\"> </p> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!> <div class=\"ctl-row palhead svelte-1n46o8q\"><!> <button type=\"button\"> </button></div> <div class=\"palcells svelte-1n46o8q\"></div> <!> <div class=\"theme-previews svelte-1n46o8q\"><!> <!></div> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <div class=\"sample typo-sample svelte-1n46o8q\"><div class=\"ts-h svelte-1n46o8q\"> </div> <div class=\"ts-b svelte-1n46o8q\"> </div></div></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><div class=\"sample form-prev svelte-1n46o8q\"><span class=\"fp-btn svelte-1n46o8q\"> </span> <span class=\"fp-card svelte-1n46o8q\"> </span></div> <label class=\"ctl-row svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"24\" step=\"1\" class=\"svelte-1n46o8q\"/> <label class=\"ctl-row svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"40\" step=\"1\" class=\"svelte-1n46o8q\"/></div></details></div>"), vd = /* @__PURE__ */ V("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label>"), yd = /* @__PURE__ */ V("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" multiple=\"\" class=\"svelte-1n46o8q\"/></label>"), bd = /* @__PURE__ */ V("<details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"></div></details>"), xd = /* @__PURE__ */ V("<details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button></div></details> <button class=\"ghost svelte-1n46o8q\"> </button> <label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"> </button> <label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" multiple=\"\" class=\"svelte-1n46o8q\"/></label></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button></div></details> <!> <!>", 1), Sd = /* @__PURE__ */ V("<div><input type=\"text\" class=\"svelte-1n46o8q\"/> <!></div>"), Cd = /* @__PURE__ */ V("<div class=\"panel-body svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"4\" max=\"96\" step=\"2\" class=\"svelte-1n46o8q\"/> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label></div>"), wd = /* @__PURE__ */ V("<p class=\"panel-strong svelte-1n46o8q\"> </p> <!>", 1), Td = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"4\" max=\"96\" step=\"2\" class=\"svelte-1n46o8q\"/>", 1), Ed = /* @__PURE__ */ V("<button><span class=\"rs-sample svelte-1n46o8q\"><i class=\"rs-line svelte-1n46o8q\"></i> <i class=\"rs-chip svelte-1n46o8q\"></i> <i class=\"rs-dot svelte-1n46o8q\"></i></span> <span class=\"rs-name svelte-1n46o8q\"> </span></button>"), Dd = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" max=\"1000\" step=\"10\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label>", 1), Od = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"100\" max=\"4000\" step=\"100\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" max=\"4000\" step=\"100\" class=\"svelte-1n46o8q\"/></label> <!>", 1), kd = /* @__PURE__ */ V("<p class=\"panel-strong svelte-1n46o8q\"> </p> <label class=\"svelte-1n46o8q\"> <input class=\"token-input svelte-1n46o8q\"/></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <p class=\"panel-strong svelte-1n46o8q\"> </p> <div class=\"rs-grid svelte-1n46o8q\"></div> <label class=\"svelte-1n46o8q\"> <span class=\"row-tools svelte-1n46o8q\"><span class=\"gridmenu-value svelte-1n46o8q\"> </span> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <p class=\"panel-strong svelte-1n46o8q\"> </p> <!> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"svelte-1n46o8q\"> <!></label>", 1), Ad = /* @__PURE__ */ V("<div class=\"panel-body svelte-1n46o8q\"><!></div>"), jd = /* @__PURE__ */ V("<button class=\"footer-tp svelte-1n46o8q\"><span class=\"footer-tp-thumb svelte-1n46o8q\"></span> <span class=\"footer-tp-name svelte-1n46o8q\"> </span></button>"), Md = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"16\" max=\"160\" step=\"2\" class=\"svelte-1n46o8q\"/>", 1), Nd = /* @__PURE__ */ V("<span class=\"toolbar-row svelte-1n46o8q\"><label class=\"ghost filepick tb-grow svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <!></span> <!>", 1), Pd = /* @__PURE__ */ V("<div class=\"nav-row svelte-1n46o8q\"><input class=\"svelte-1n46o8q\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></div> <!>", 1), Fd = /* @__PURE__ */ V("<div class=\"nav-row svelte-1n46o8q\"><span class=\"nav-line svelte-1n46o8q\"><span class=\"footer-soc-preview svelte-1n46o8q\" aria-hidden=\"true\"></span> <!></span> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span> <input class=\"nav-target svelte-1n46o8q\"/></div>"), Id = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <!></label> <!>", 1), Ld = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <!>", 1), Rd = /* @__PURE__ */ V("<div class=\"panel-body svelte-1n46o8q\"><label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><div class=\"footer-tpick svelte-1n46o8q\"></div></div></details> <details class=\"group svelte-1n46o8q\" open=\"\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <!></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><!> <button class=\"ghost action svelte-1n46o8q\"> </button> <label class=\"svelte-1n46o8q\"> <!></label></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><!> <button class=\"ghost action svelte-1n46o8q\"> </button></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><!> <button class=\"ghost action svelte-1n46o8q\"> </button></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><!> <p class=\"panel-strong svelte-1n46o8q\"> </p> <!></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <p class=\"panel-strong svelte-1n46o8q\"> </p> <!> <button class=\"ghost action svelte-1n46o8q\"> </button></div></details></div>"), zd = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <input type=\"date\" class=\"svelte-1n46o8q\"/></label>"), Bd = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label>"), Vd = /* @__PURE__ */ V("<img class=\"site-icon-preview svelte-1n46o8q\" alt=\"\"/> <button class=\"ghost row-tool svelte-1n46o8q\"></button>", 1), Hd = /* @__PURE__ */ V("<img class=\"site-icon-preview svelte-1n46o8q\" alt=\"\"/>"), Ud = /* @__PURE__ */ V("<span class=\"toolbar-row svelte-1n46o8q\"><input class=\"svelte-1n46o8q\"/> <label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <!> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span>"), Wd = /* @__PURE__ */ V("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" step=\"0.01\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" step=\"0.01\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <!> <button class=\"ghost action svelte-1n46o8q\"> </button>", 1), Gd = /* @__PURE__ */ V("<details class=\"group collection-entry svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><span class=\"toolbar-row svelte-1n46o8q\"><input class=\"svelte-1n46o8q\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span> <!> <textarea rows=\"3\" class=\"svelte-1n46o8q\"></textarea> <!> <span class=\"toolbar-row svelte-1n46o8q\"><label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <!></span> <!></div></details>"), Kd = /* @__PURE__ */ V("<span class=\"toolbar-row svelte-1n46o8q\"><button class=\"ghost action svelte-1n46o8q\"> </button> <button class=\"ghost action svelte-1n46o8q\"> </button> <label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\".csv,text/csv\" class=\"svelte-1n46o8q\"/></label> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span> <!> <!> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), qd = /* @__PURE__ */ V("<div class=\"panel-body svelte-1n46o8q\"><!> <!> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <button class=\"ghost action svelte-1n46o8q\"> </button></div>"), Jd = /* @__PURE__ */ V("<span class=\"plugin-meta svelte-1n46o8q\"> </span>"), Yd = /* @__PURE__ */ V("<p class=\"panel-hint plugin-warn svelte-1n46o8q\"> </p>"), Xd = /* @__PURE__ */ V("<div><span class=\"plugin-head svelte-1n46o8q\"><span class=\"plugin-name svelte-1n46o8q\"> </span> <!> <span class=\"row-tools svelte-1n46o8q\"><label class=\"gridmenu-snap plugin-toggle svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span> <!> <!></div>"), Zd = /* @__PURE__ */ V("<div class=\"plugin-row svelte-1n46o8q\"><span class=\"plugin-head svelte-1n46o8q\"><span class=\"plugin-name svelte-1n46o8q\"> </span> <!> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span></div>"), Qd = /* @__PURE__ */ V("<hr class=\"gridmenu-divider svelte-1n46o8q\"/> <p class=\"panel-strong svelte-1n46o8q\"> </p> <!>", 1), $d = /* @__PURE__ */ V("<hr class=\"gridmenu-divider svelte-1n46o8q\"/> <input class=\"svelte-1n46o8q\"/> <button class=\"ghost action svelte-1n46o8q\"> </button> <!>", 1), ef = /* @__PURE__ */ V("<div class=\"panel-body svelte-1n46o8q\"><!> <!> <!> <!></div>"), tf = /* @__PURE__ */ V("<div><span class=\"history-msg svelte-1n46o8q\"> </span> <span class=\"history-meta svelte-1n46o8q\"> </span></div>"), nf = /* @__PURE__ */ V("<button class=\"ghost svelte-1n46o8q\"> </button> <!>", 1), rf = /* @__PURE__ */ V("<!> <!>", 1), af = /* @__PURE__ */ V("<p class=\"panel-hint svelte-1n46o8q\"> </p> <button class=\"ghost svelte-1n46o8q\"> </button>", 1), of = /* @__PURE__ */ V("<span class=\"update-arrow svelte-1n46o8q\"></span> <span class=\"badge svelte-1n46o8q\"> </span>", 1), sf = /* @__PURE__ */ V("<details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><p class=\"update-notes svelte-1n46o8q\"> </p></div></details>"), cf = /* @__PURE__ */ V("<details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"><span class=\"update-warn svelte-1n46o8q\"></span> </summary> <div class=\"group-items svelte-1n46o8q\"><pre class=\"update-headers svelte-1n46o8q\"> </pre></div></details>"), lf = /* @__PURE__ */ V("<span class=\"chip svelte-1n46o8q\"> </span>"), uf = /* @__PURE__ */ V("<div class=\"update-row svelte-1n46o8q\"><span class=\"update-path svelte-1n46o8q\"> </span> <span class=\"update-flags svelte-1n46o8q\"><!> <span class=\"update-warn svelte-1n46o8q\"></span></span></div>"), df = /* @__PURE__ */ V("<div class=\"update-row svelte-1n46o8q\"><span class=\"update-path svelte-1n46o8q\"> </span> <!></div>"), ff = /* @__PURE__ */ V("<span class=\"update-warn svelte-1n46o8q\"></span>"), pf = /* @__PURE__ */ V("<div class=\"update-row svelte-1n46o8q\"><span> </span> <span class=\"update-flags svelte-1n46o8q\"><!> <!> <input type=\"checkbox\" class=\"svelte-1n46o8q\"/></span></div>"), mf = /* @__PURE__ */ V("<div class=\"ctl-row update-opt-head svelte-1n46o8q\"><p class=\"panel-strong svelte-1n46o8q\"> </p> <span class=\"mini-label svelte-1n46o8q\"> </span></div> <!>", 1), hf = /* @__PURE__ */ V("<p class=\"update-summary svelte-1n46o8q\"> </p> <!> <!> <!> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"></div></details> <!> <button class=\"primary update-run svelte-1n46o8q\"> </button>", 1), gf = /* @__PURE__ */ V("<div class=\"update-versions svelte-1n46o8q\"><span class=\"update-from svelte-1n46o8q\"> </span> <!></div> <!>", 1), _f = /* @__PURE__ */ V("<aside class=\"panel svelte-1n46o8q\"><h2 class=\"svelte-1n46o8q\"> </h2> <!></aside>"), vf = /* @__PURE__ */ V("<nav class=\"rail svelte-1n46o8q\"><!> <span class=\"rail-settings svelte-1n46o8q\"><span class=\"rail-brand svelte-1n46o8q\" title=\"Urd\"><svg class=\"brand-mark svelte-1n46o8q\" viewBox=\"10.3 8.3 19.4 25.4\" aria-hidden=\"true\"><path d=\"M12 32V10l16 6.5V32\" fill=\"none\" stroke=\"var(--urd-brand)\" stroke-width=\"3.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg> <span class=\"brand-word svelte-1n46o8q\">Urd</span></span> <button></button> <!></span></nav> <!>", 1), yf = /* @__PURE__ */ V("<div class=\"workspace svelte-1n46o8q\"><!> <div><div class=\"stage svelte-1n46o8q\"><iframe class=\"svelte-1n46o8q\"></iframe></div></div></div>"), bf = /* @__PURE__ */ V("<p class=\"loading svelte-1n46o8q\"> </p>"), xf = /* @__PURE__ */ V("<p class=\"panel-hint confirm-line svelte-1n46o8q\"> </p>"), Sf = /* @__PURE__ */ V("<div class=\"setup-overlay svelte-1n46o8q\"><div class=\"setup-card svelte-1n46o8q\"><h2 class=\"svelte-1n46o8q\"> </h2> <!> <!> <span class=\"setup-actions svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"primary svelte-1n46o8q\"> </button></span></div></div>"), Cf = /* @__PURE__ */ V("<div class=\"setup-overlay svelte-1n46o8q\"><div class=\"setup-card svelte-1n46o8q\"><h2 class=\"svelte-1n46o8q\"> </h2> <p class=\"panel-hint svelte-1n46o8q\"> </p> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <p class=\"panel-hint svelte-1n46o8q\"> </p> <span class=\"setup-actions svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"primary svelte-1n46o8q\"> </button></span></div></div>"), wf = /* @__PURE__ */ V("<div><span> </span> <button class=\"toast-x svelte-1n46o8q\">×</button></div>"), Tf = /* @__PURE__ */ V("<div class=\"block-menu svelte-1n46o8q\"><header class=\"block-menu-head svelte-1n46o8q\"><span> </span> <button class=\"ghost row-tool svelte-1n46o8q\"></button></header> <div class=\"panel-body block-menu-body svelte-1n46o8q\"><!></div></div>"), Ef = /* @__PURE__ */ V("<div class=\"editor svelte-1n46o8q\"><!> <header><span class=\"topbar-group svelte-1n46o8q\"><!> <!></span> <span class=\"topbar-group topbar-draft svelte-1n46o8q\"><!></span> <span class=\"topbar-group topbar-right svelte-1n46o8q\"><!></span></header> <!> <!> <!> <!> <!></div>   <!>", 1);
function Df(e, t) {
	Ye(t, !0);
	let n = (e, t = f, n = f) => {
		var r = ml(), i = F(r);
		Xr(i, 17, n, Kr, (e, r, i) => {
			var a = pl(), s = P(a), l = P(s);
			{
				let e = /* @__PURE__ */ k(() => Y("tip.bg.changeType")), n = /* @__PURE__ */ k(() => o.map(([e, t]) => [e, t.labelKey ? Y(t.labelKey) : t.label]));
				X(l, {
					get value() {
						return z(r).type;
					},
					get title() {
						return z(e);
					},
					get options() {
						return z(n);
					},
					onchange: (e) => qn(t(), i, e)
				});
			}
			var u = L(l, 2), d = P(u);
			d.disabled = i === 0, G(d, () => c.up, !0), E(d);
			var f = L(d, 2);
			G(f, () => c.down, !0), E(f);
			var p = L(f, 2);
			G(p, () => c.cross, !0), E(p), E(u), E(s);
			var m = L(s, 2), h = (e) => {
				var n = Qc(), a = F(n), o = P(a), s = L(o);
				{
					let e = /* @__PURE__ */ k(dr), n = /* @__PURE__ */ k(() => Y("tip.bg.layerColor"));
					da(s, {
						get value() {
							return z(r).props.value;
						},
						get tokens() {
							return z(e);
						},
						get label() {
							return z(n);
						},
						onchange: (e) => An(t(), i, "value", e)
					});
				}
				E(a);
				var c = L(a, 2), l = P(c), u = I(L(l));
				E(c);
				var d = L(c, 2);
				K(d), R((e, t, n) => {
					U(o, `${e ?? ""} `), U(l, `${t ?? ""} `), U(u, `${n ?? ""}%`), q(d, z(r).props.opacity ?? 1);
				}, [
					() => Y("lbl.color"),
					() => Y("lbl.strength"),
					() => Math.round((z(r).props.opacity ?? 1) * 100)
				]), B("input", d, (e) => An(t(), i, "opacity", Number(e.target.value))), H(e, n);
			}, g = (e) => {
				let n = /* @__PURE__ */ k(() => In(z(r))), a = /* @__PURE__ */ k(() => z(n).stops.reduce((e, t) => e + Math.max(0, Number(t.share) || 0), 0));
				var o = rl(), s = F(o), l = P(s), u = L(l);
				{
					let e = /* @__PURE__ */ k(() => z(n).kind ?? "linear"), r = /* @__PURE__ */ k(() => [["linear", Y("opt.grad.linear")], ["radial", Y("opt.grad.radial")]]);
					X(u, {
						get value() {
							return z(e);
						},
						get options() {
							return z(r);
						},
						onchange: (e) => Bn(t(), i, e)
					});
				}
				E(s);
				var d = L(s, 2);
				Xr(d, 17, () => z(n).stops, Kr, (e, r, o) => {
					var s = el();
					let l;
					var u = P(s), d = L(u, 2);
					{
						let e = /* @__PURE__ */ k(dr), n = /* @__PURE__ */ k(() => Y("tip.bg.stopColor"));
						da(d, {
							get value() {
								return z(r).color;
							},
							get tokens() {
								return z(e);
							},
							get label() {
								return z(n);
							},
							onchange: (e) => Vn(t(), i, o, { color: e })
						});
					}
					var f = L(d, 2);
					K(f);
					var p = L(f, 2), m = I(p), h = L(p, 2), g = (e) => {
						var n = $c();
						G(n, () => c.cross, !0), E(n), R((e) => J(n, "title", e), [() => Y("tip.bg.removeStop")]), B("click", n, () => Un(t(), i, o)), H(e, n);
					};
					W(h, (e) => {
						z(n).stops.length > 2 && e(g);
					}), E(s), R((e, t, a) => {
						l = _i(s, 1, "nav-line grad-stop svelte-1n46o8q", null, l, {
							dragging: z(Gn)?.layer === i && z(Gn).from === o,
							"drop-above": z(Gn)?.layer === i && z(Gn).insert === o,
							"drop-below": z(Gn)?.layer === i && z(Gn).insert === z(n).stops.length && o === z(n).stops.length - 1
						}), J(u, "title", e), q(f, z(r).share ?? 50), J(f, "title", t), U(m, `${a ?? ""}%`);
					}, [
						() => Y("tip.bg.dragStop"),
						() => Y("tip.bg.stopShare"),
						() => z(a) > 0 ? Math.round(Math.max(0, Number(z(r).share) || 0) / z(a) * 100) : Math.round(100 / z(n).stops.length)
					]), B("pointerdown", u, (e) => Kn(t(), e, i, o)), B("input", f, (e) => Vn(t(), i, o, { share: Number(e.target.value) })), H(e, s);
				});
				var f = L(d, 2), p = I(f, !0), m = L(f, 2), h = (e) => {
					var r = tl(), a = F(r), o = P(a), s = I(L(o));
					E(a);
					var c = L(a, 2);
					K(c);
					var l = L(c, 2), u = P(l), d = I(L(u));
					E(l);
					var f = L(l, 2);
					K(f), R((e, t, r, i) => {
						U(o, `${e ?? ""} `), U(s, `${t ?? ""}%`), q(c, z(n).x ?? .5), U(u, `${r ?? ""} `), U(d, `${i ?? ""}%`), q(f, z(n).y ?? .5);
					}, [
						() => Y("lbl.centerX"),
						() => Math.round((z(n).x ?? .5) * 100),
						() => Y("lbl.centerY"),
						() => Math.round((z(n).y ?? .5) * 100)
					]), B("input", c, (e) => Rn(t(), i, "x", Number(e.target.value))), B("input", f, (e) => Rn(t(), i, "y", Number(e.target.value))), H(e, r);
				}, g = (e) => {
					var r = nl(), a = F(r), o = P(a), s = I(L(o));
					E(a);
					var c = L(a, 2);
					K(c), R((e) => {
						U(o, `${e ?? ""} `), U(s, `${z(n).angle ?? ""}°`), q(c, z(n).angle);
					}, [() => Y("lbl.angle")]), B("input", c, (e) => Rn(t(), i, "angle", Number(e.target.value))), H(e, r);
				};
				W(m, (e) => {
					(z(n).kind ?? "linear") === "radial" ? e(h) : e(g, -1);
				});
				var _ = L(m, 2), v = P(_), y = I(L(v));
				E(_);
				var b = L(_, 2);
				K(b);
				var x = L(b, 2), S = P(x), C = L(S);
				{
					let e = /* @__PURE__ */ k(() => z(n).animation ?? "none");
					X(C, {
						get value() {
							return z(e);
						},
						get options() {
							return zn[(z(n).kind ?? "linear") === "radial" ? "radial" : "linear"];
						},
						onchange: (e) => Rn(t(), i, "animation", e)
					});
				}
				E(x), R((e, t, r, i, a, o, s) => {
					U(l, `${e ?? ""} `), J(f, "title", t), U(p, r), U(v, `${i ?? ""} `), U(y, `${a ?? ""}%`), q(b, z(n).opacity ?? 1), J(x, "title", o), U(S, `${s ?? ""} `);
				}, [
					() => Y("blocks.shape"),
					() => Y("tip.bg.addStop"),
					() => Y("ui.addStop"),
					() => Y("lbl.strength"),
					() => Math.round((z(n).opacity ?? 1) * 100),
					() => Y("tip.bg.motion"),
					() => Y("lbl.motion")
				]), B("click", f, () => Hn(t(), i)), B("input", b, (e) => Rn(t(), i, "opacity", Number(e.target.value))), H(e, o);
			}, _ = (e) => {
				var n = il(), a = F(n), o = P(a), s = L(o);
				{
					let e = /* @__PURE__ */ k(dr), n = /* @__PURE__ */ k(() => Y("tip.bg.glowColor"));
					da(s, {
						get value() {
							return z(r).props.color;
						},
						get tokens() {
							return z(e);
						},
						get label() {
							return z(n);
						},
						onchange: (e) => An(t(), i, "color", e)
					});
				}
				E(a);
				var c = L(a, 2), l = P(c), u = I(L(l));
				E(c);
				var d = L(c, 2);
				K(d);
				var f = L(d, 2), p = P(f), m = I(L(p));
				E(f);
				var h = L(f, 2);
				K(h);
				var g = L(h, 2), _ = P(g), v = I(L(_));
				E(g);
				var y = L(g, 2);
				K(y);
				var b = L(y, 2), x = P(b), S = I(L(x));
				E(b);
				var C = L(b, 2);
				K(C), R((e, t, n, i, a, s, c, f, g) => {
					U(o, `${e ?? ""} `), U(l, `${t ?? ""} `), U(u, `${n ?? ""}%`), q(d, z(r).props.x), U(p, `${i ?? ""} `), U(m, `${a ?? ""}%`), q(h, z(r).props.y), U(_, `${s ?? ""} `), U(v, `${c ?? ""}%`), q(y, z(r).props.radius), U(x, `${f ?? ""} `), U(S, `${g ?? ""}%`), q(C, z(r).props.opacity);
				}, [
					() => Y("lbl.color"),
					() => Y("lbl.posX"),
					() => Math.round(z(r).props.x * 100),
					() => Y("lbl.posY"),
					() => Math.round(z(r).props.y * 100),
					() => Y("lbl.size"),
					() => Math.round(z(r).props.radius * 100),
					() => Y("lbl.strength"),
					() => Math.round(z(r).props.opacity * 100)
				]), B("input", d, (e) => An(t(), i, "x", Number(e.target.value))), B("input", h, (e) => An(t(), i, "y", Number(e.target.value))), B("input", y, (e) => An(t(), i, "radius", Number(e.target.value))), B("input", C, (e) => An(t(), i, "opacity", Number(e.target.value))), H(e, n);
			}, v = (e) => {
				var n = al(), a = F(n), o = P(a), s = I(L(o));
				E(a);
				var c = L(a, 2);
				K(c), R((e, t) => {
					U(o, `${e ?? ""} `), U(s, `${t ?? ""}%`), q(c, z(r).props.opacity);
				}, [() => Y("lbl.strength"), () => Math.round(z(r).props.opacity * 100)]), B("input", c, (e) => An(t(), i, "opacity", Number(e.target.value))), H(e, n);
			}, y = (e) => {
				let n = /* @__PURE__ */ k(() => z(r).props.fit === "tile" || z(r).props.fit === "repeat");
				var a = cl(), o = F(a), s = P(o), c = L(s);
				E(o);
				var l = L(o, 2), u = P(l), d = L(u);
				{
					let e = /* @__PURE__ */ k(() => z(n) ? "tile" : "plain"), r = /* @__PURE__ */ k(() => [["plain", Y("opt.img.plain")], ["tile", Y("opt.img.tile")]]);
					X(d, {
						get value() {
							return z(e);
						},
						get options() {
							return z(r);
						},
						onchange: (e) => An(t(), i, "fit", e)
					});
				}
				E(l);
				var f = L(l, 2), p = I(f, !0), m = L(f, 2), h = P(m), g = L(h, 2);
				K(g);
				var _ = L(g, 4);
				E(m);
				var v = L(m, 2), y = (e) => {
					var n = ol(), a = F(n), o = P(a), s = I(o, !0), c = L(o, 2), l = I(c, !0);
					E(a);
					var u = L(a, 2), d = I(u, !0), f = L(u, 2), p = L(f, 2), m = P(p), h = I(L(m));
					E(p);
					var g = L(p, 2);
					K(g);
					var _ = L(g, 2), v = P(_), y = I(L(v));
					E(_);
					var b = L(_, 2);
					K(b), R((e, t, n, i, a, p, _, x, S, C, ee, te) => {
						J(o, "title", e), U(s, t), J(c, "title", n), U(l, i), J(u, "title", a), U(d, p), yi(f, `--fx:${_ ?? ""}%; --fy:${x ?? ""}%`), U(m, `${S ?? ""} `), U(h, `${C ?? ""}%`), q(g, z(r).props.x ?? .5), U(v, `${ee ?? ""} `), U(y, `${te ?? ""}%`), q(b, z(r).props.y ?? .5);
					}, [
						() => Y("tip.bg.cover"),
						() => Y("ui.cover"),
						() => Y("opt.fitFrame.contain"),
						() => Y("opt.fit.contain"),
						() => Y("tip.bg.position"),
						() => Y("lbl.position"),
						() => Math.max(0, Math.min(1, z(r).props.x ?? .5)) * 100,
						() => Math.max(0, Math.min(1, z(r).props.y ?? .5)) * 100,
						() => Y("lbl.horizontal"),
						() => Math.round((z(r).props.x ?? .5) * 100),
						() => Y("lbl.vertical"),
						() => Math.round((z(r).props.y ?? .5) * 100)
					]), B("click", o, () => Fn(t(), i, z(r), "cover")), B("click", c, () => Fn(t(), i, z(r), "contain")), B("pointerdown", f, (e) => jn(e, t(), i, "xy")), B("input", g, (e) => An(t(), i, "x", Number(e.target.value))), B("input", b, (e) => An(t(), i, "y", Number(e.target.value))), H(e, n);
				};
				W(v, (e) => {
					z(n) || e(y);
				});
				var b = L(v, 2), x = P(b), S = I(L(x));
				E(b);
				var C = L(b, 2);
				K(C);
				var ee = L(C, 2), te = P(ee), ne = I(L(te));
				E(ee);
				var w = L(ee, 2);
				K(w);
				var re = L(w, 2), ie = P(re);
				K(ie);
				var ae = L(ie);
				E(re);
				var oe = L(re, 2), se = (e) => {
					var n = sl(), a = F(n), o = P(a), s = I(L(o));
					E(a);
					var c = L(a, 2);
					K(c);
					var l = L(c, 2), u = P(l), d = L(u);
					{
						let e = /* @__PURE__ */ k(() => z(r).props.bleed ?? "none"), n = /* @__PURE__ */ k(() => [
							["none", Y("common.none")],
							["up", Y("opt.bleed.up")],
							["down", Y("opt.bleed.down")],
							["both", Y("opt.brand.both")]
						]);
						X(d, {
							get value() {
								return z(e);
							},
							get options() {
								return z(n);
							},
							onchange: (e) => An(t(), i, "bleed", e)
						});
					}
					E(l), R((e, t, n, i) => {
						U(o, `${e ?? ""} `), U(s, `${t ?? ""}%`), q(c, z(r).props.parallax ?? .3), J(l, "title", n), U(u, `${i ?? ""} `);
					}, [
						() => Y("lbl.parallaxStrength"),
						() => Math.round((z(r).props.parallax ?? 0) * 100),
						() => Y("tip.bg.bleed"),
						() => Y("lbl.bleed")
					]), B("input", c, (e) => An(t(), i, "parallax", Number(e.target.value))), H(e, n);
				};
				W(oe, (e) => {
					(z(r).props.parallax ?? 0) > 0 && e(se);
				}), R((e, t, n, i, a, c, d, m, v, y, b, ee, oe, se) => {
					J(o, "title", e), U(s, `${t ?? ""} `), J(l, "title", n), U(u, `${i ?? ""} `), J(f, "title", a), U(p, c), J(h, "title", d), q(g, m), J(_, "title", v), U(x, `${y ?? ""} `), U(S, `${z(r).props.blur ?? 0 ?? ""} px`), q(C, z(r).props.blur ?? 0), U(te, `${b ?? ""} `), U(ne, `${ee ?? ""}%`), q(w, z(r).props.opacity ?? 1), J(re, "title", oe), wi(ie, (z(r).props.parallax ?? 0) > 0), U(ae, ` ${se ?? ""}`);
				}, [
					() => Y("tip.webpAuto"),
					() => z(r).props.src ? Y("ui.changeImage") : Y("ui.chooseImage"),
					() => Y("tip.bg.fit"),
					() => Y("lbl.fit"),
					() => Y("tip.bg.size"),
					() => Y("lbl.size"),
					() => Y("tip.smaller"),
					() => Math.round((z(r).props.size ?? 1) * 100),
					() => Y("tip.larger"),
					() => Y("lbl.blur"),
					() => Y("lbl.strength"),
					() => Math.round((z(r).props.opacity ?? 1) * 100),
					() => Y("tip.bg.parallax"),
					() => Y("lbl.parallax")
				]), B("change", c, (e) => Zn(t(), i, e)), B("click", h, () => Nn(t(), i, z(r).props.size ?? 1, -.05)), B("change", g, (e) => Pn(t(), i, e.target.value)), B("click", _, () => Nn(t(), i, z(r).props.size ?? 1, .05)), B("input", C, (e) => An(t(), i, "blur", Number(e.target.value))), B("input", w, (e) => An(t(), i, "opacity", Number(e.target.value))), B("change", ie, (e) => An(t(), i, "parallax", e.target.checked ? .3 : 0)), H(e, a);
			}, b = (e) => {
				var n = ul(), a = F(n), o = P(a), s = L(o);
				E(a);
				var l = L(a, 2);
				Xr(l, 17, () => z(r).props.images ?? [], Kr, (e, n, a) => {
					var o = ll(), s = F(o), l = P(s), u = L(l, 2), d = P(u);
					d.disabled = a === 0, G(d, () => c.up, !0), E(d);
					var f = L(d, 2);
					G(f, () => c.down, !0), E(f);
					var p = L(f, 2);
					G(p, () => c.cross, !0), E(p), E(u), E(s);
					var m = L(s, 2), h = P(m), g = I(L(h));
					E(m);
					var _ = L(m, 2);
					K(_);
					var v = L(_, 2), y = P(v), b = I(L(y));
					E(v);
					var x = L(v, 2);
					K(x), R((e, t, i, o, s) => {
						J(l, "src", z(n).src), f.disabled = a === z(r).props.images.length - 1, J(p, "title", e), U(h, `${t ?? ""} `), U(g, `${i ?? ""}%`), q(_, z(n).x ?? .5), U(y, `${o ?? ""} `), U(b, `${s ?? ""}%`), q(x, z(n).y ?? .5);
					}, [
						() => Y("tip.removeImage"),
						() => Y("lbl.focusX"),
						() => Math.round((z(n).x ?? .5) * 100),
						() => Y("lbl.focusY"),
						() => Math.round((z(n).y ?? .5) * 100)
					]), B("click", d, () => tr(t(), i, a, -1)), B("click", f, () => tr(t(), i, a, 1)), B("click", p, () => nr(t(), i, a)), B("input", _, (e) => rr(t(), i, a, "x", Number(e.target.value))), B("input", x, (e) => rr(t(), i, a, "y", Number(e.target.value))), H(e, o);
				});
				var u = L(l, 2), d = P(u), f = L(d);
				{
					let e = /* @__PURE__ */ k(() => z(r).props.fit ?? "cover"), n = /* @__PURE__ */ k(() => [["cover", Y("opt.fit.cover")], ["contain", Y("opt.fit.contain")]]);
					X(f, {
						get value() {
							return z(e);
						},
						get options() {
							return z(n);
						},
						onchange: (e) => An(t(), i, "fit", e)
					});
				}
				E(u);
				var p = L(u, 2), m = P(p), h = L(m);
				K(h), E(p);
				var g = L(p, 2), _ = P(g), v = I(L(_));
				E(g);
				var y = L(g, 2);
				K(y);
				var b = L(y, 2), x = P(b), S = I(L(x));
				E(b);
				var C = L(b, 2);
				K(C);
				var ee = L(C, 2), te = P(ee), ne = I(L(te));
				E(ee);
				var w = L(ee, 2);
				K(w);
				var re = I(L(w, 2), !0);
				R((e, t, n, i, s, c, l, u, f, g, b) => {
					J(a, "title", e), U(o, `${t ?? ""} `), U(d, `${n ?? ""} `), J(p, "title", i), U(m, `${s ?? ""} `), q(h, z(r).props.interval ?? 6), U(_, `${c ?? ""} `), U(v, `${l ?? ""} s`), q(y, z(r).props.fade ?? 1.5), U(x, `${u ?? ""} `), U(S, `${z(r).props.blur ?? 0 ?? ""} px`), q(C, z(r).props.blur ?? 0), U(te, `${f ?? ""} `), U(ne, `${g ?? ""}%`), q(w, z(r).props.opacity ?? 1), U(re, b);
				}, [
					() => Y("tip.bg.addImages"),
					() => Y("ui.addImages"),
					() => Y("lbl.fit"),
					() => Y("hint.bg.gallery"),
					() => Y("lbl.secondsPerImage"),
					() => Y("lbl.transition"),
					() => (z(r).props.fade ?? 1.5).toFixed(1),
					() => Y("lbl.blur"),
					() => Y("lbl.strength"),
					() => Math.round((z(r).props.opacity ?? 1) * 100),
					() => Y("hint.bg.gallery")
				]), B("change", s, (e) => er(t(), i, e)), B("change", h, (e) => An(t(), i, "interval", Number(e.target.value))), B("input", y, (e) => An(t(), i, "fade", Number(e.target.value))), B("input", C, (e) => An(t(), i, "blur", Number(e.target.value))), B("input", w, (e) => An(t(), i, "opacity", Number(e.target.value))), H(e, n);
			}, x = (e) => {
				var n = fl(), a = F(n), o = P(a), s = L(o);
				E(a);
				var c = L(a, 2), l = P(c), u = L(l);
				E(c);
				var d = L(c, 2), f = P(d), p = L(f);
				{
					let e = /* @__PURE__ */ k(() => z(r).props.fit ?? "cover"), n = /* @__PURE__ */ k(() => [["cover", Y("opt.fit.cover")], ["contain", Y("opt.fit.contain")]]);
					X(p, {
						get value() {
							return z(e);
						},
						get options() {
							return z(n);
						},
						onchange: (e) => An(t(), i, "fit", e)
					});
				}
				E(d);
				var m = L(d, 2), h = P(m), g = I(L(h));
				E(m);
				var _ = L(m, 2);
				K(_);
				var v = L(_, 2), y = P(v), b = I(L(y));
				E(v);
				var x = L(v, 2);
				K(x);
				var S = L(x, 2), C = P(S), ee = I(L(C));
				E(S);
				var te = L(S, 2);
				K(te);
				var ne = L(te, 2), w = P(ne);
				K(w);
				var re = L(w);
				E(ne);
				var ie = L(ne, 2), ae = (e) => {
					var n = dl(), a = F(n), o = P(a), s = I(L(o));
					E(a);
					var c = L(a, 2);
					K(c), R((e, t) => {
						U(o, `${e ?? ""} `), U(s, `${t ?? ""}%`), q(c, z(r).props.parallax ?? .3);
					}, [() => Y("lbl.parallaxStrength"), () => Math.round((z(r).props.parallax ?? 0) * 100)]), B("input", c, (e) => An(t(), i, "parallax", Number(e.target.value))), H(e, n);
				};
				W(ie, (e) => {
					(z(r).props.parallax ?? 0) > 0 && e(ae);
				}), R((e, t, n, i, s, u, p, m, v, S, ie, ae, oe, se) => {
					J(a, "title", e), U(o, `${t ?? ""} `), J(c, "title", n), U(l, `${i ?? ""} `), J(d, "title", s), U(f, `${u ?? ""} `), U(h, `${p ?? ""} `), U(g, `${m ?? ""}%`), q(_, z(r).props.x ?? .5), U(y, `${v ?? ""} `), U(b, `${S ?? ""}%`), q(x, z(r).props.y ?? .5), U(C, `${ie ?? ""} `), U(ee, `${ae ?? ""}%`), q(te, z(r).props.opacity ?? 1), J(ne, "title", oe), wi(w, (z(r).props.parallax ?? 0) > 0), U(re, ` ${se ?? ""}`);
				}, [
					() => Y("tip.bg.videoFile"),
					() => z(r).props.src ? Y("ui.changeVideo") : Y("ui.chooseVideo"),
					() => Y("tip.bg.poster"),
					() => z(r).props.poster ? Y("ui.changeImage") : Y("ui.choosePoster"),
					() => Y("tip.bg.fit"),
					() => Y("lbl.fit"),
					() => Y("lbl.horizontal"),
					() => Math.round((z(r).props.x ?? .5) * 100),
					() => Y("lbl.vertical"),
					() => Math.round((z(r).props.y ?? .5) * 100),
					() => Y("lbl.strength"),
					() => Math.round((z(r).props.opacity ?? 1) * 100),
					() => Y("tip.bg.parallax"),
					() => Y("lbl.parallax")
				]), B("change", s, (e) => Qn(t(), i, e)), B("change", u, (e) => $n(t(), i, e)), B("input", _, (e) => An(t(), i, "x", Number(e.target.value))), B("input", x, (e) => An(t(), i, "y", Number(e.target.value))), B("input", te, (e) => An(t(), i, "opacity", Number(e.target.value))), B("change", w, (e) => An(t(), i, "parallax", e.target.checked ? .3 : 0)), H(e, n);
			};
			W(m, (e) => {
				z(r).type === "color" ? e(h) : z(r).type === "gradient" ? e(g, 1) : z(r).type === "glow" ? e(_, 2) : z(r).type === "grain" ? e(v, 3) : z(r).type === "image" ? e(y, 4) : z(r).type === "slideshow" ? e(b, 5) : z(r).type === "video" && e(x, 6);
			}), E(a), R((e, t, r) => {
				J(d, "title", e), J(f, "title", t), f.disabled = i === n().length - 1, J(p, "title", r);
			}, [
				() => Y("hint.bg.order"),
				() => Y("hint.bg.order"),
				() => Y("tip.bg.removeLayer")
			]), B("click", d, () => kn(t(), i, -1)), B("click", f, () => kn(t(), i, 1)), B("click", p, () => On(t(), i)), H(e, a);
		});
		var a = L(i, 2), s = P(a), l = L(s);
		{
			let e = /* @__PURE__ */ k(() => o.map(([e, t]) => [e, t.labelKey ? Y(t.labelKey) : t.label]));
			X(l, {
				get value() {
					return z(En);
				},
				get options() {
					return z(e);
				},
				onchange: (e) => N(En, e, !0)
			});
		}
		E(a);
		var u = L(a, 2), d = I(u, !0);
		R((e, t) => {
			U(s, `${e ?? ""} `), U(d, t);
		}, [() => Y("lbl.newLayer"), () => Y("ui.addLayer")]), B("click", u, () => Dn(t(), z(En))), H(e, r);
	}, r = (e, t = f, n = f) => {
		var r = Fr();
		Xr(F(r), 17, n, Kr, (e, r, i) => {
			var a = gl(), o = P(a);
			K(o);
			var s = L(o, 2), l = P(s);
			l.disabled = i === 0, G(l, () => c.up, !0), E(l);
			var u = L(l, 2);
			G(u, () => c.down, !0), E(u);
			var d = L(u, 2);
			G(d, () => c.cross, !0), E(d), E(s);
			var f = L(s, 2), p = P(f);
			{
				let e = /* @__PURE__ */ k(() => z(r).page ?? "__href"), n = /* @__PURE__ */ k(() => Y("tip.linkTarget")), a = /* @__PURE__ */ k(() => [...z(O).pages.map((e) => [e.id, e.title]), ["__href", Y("opt.linkHref")]]);
				X(p, {
					get value() {
						return z(e);
					},
					get title() {
						return z(n);
					},
					get options() {
						return z(a);
					},
					onchange: (e) => uc(t(), i, e)
				});
			}
			E(f);
			var m = L(f, 2), h = (e) => {
				var n = hl();
				K(n), R((e, t) => {
					q(n, z(r).href ?? ""), J(n, "placeholder", e), J(n, "title", t);
				}, [() => Y("ph.hrefAnchor"), () => Y("tip.hrefAnchor")]), B("change", n, (e) => dc(t(), i, e.target.value)), H(e, n);
			};
			W(m, (e) => {
				z(r).page || e(h);
			}), E(a), R((e, t) => {
				q(o, z(r).label), J(o, "title", e), u.disabled = i === n().length - 1, J(d, "title", t);
			}, [() => Y("tip.linkLabel"), () => Y("tip.removeLink")]), B("input", o, (e) => cc(t(), i, e.target.value)), B("click", l, () => ac(t(), i, -1)), B("click", u, () => ac(t(), i, 1)), B("click", d, () => ic(t(), i)), H(e, a);
		}), H(e, r);
	}, i = (e) => {
		let t = /* @__PURE__ */ k(() => z(A).props.boxStyle ?? {});
		var n = yl(), r = F(n), i = P(r), a = L(i);
		{
			let e = /* @__PURE__ */ k(() => z(t).bg ?? ""), n = /* @__PURE__ */ k(dr), r = /* @__PURE__ */ k(() => Y("tip.box.bg"));
			da(a, {
				get value() {
					return z(e);
				},
				get tokens() {
					return z(n);
				},
				allowClear: !0,
				get label() {
					return z(r);
				},
				onchange: (e) => Ht({ bg: e || null })
			});
		}
		E(r);
		var o = L(r, 2), s = P(o), c = L(s);
		{
			let e = /* @__PURE__ */ k(() => z(t).shadow ?? ""), n = /* @__PURE__ */ k(() => [
				["", Y("common.none")],
				["soft", Y("opt.shadow.soft")],
				["strong", Y("opt.shadow.strong")]
			]);
			X(c, {
				get value() {
					return z(e);
				},
				get options() {
					return z(n);
				},
				onchange: (e) => Ht({ shadow: e || null })
			});
		}
		E(o);
		var l = L(o, 2), u = (e) => {
			var n = _l(), r = P(n), i = L(r);
			{
				let e = /* @__PURE__ */ k(() => z(t).shadowColor ?? ""), n = /* @__PURE__ */ k(dr), r = /* @__PURE__ */ k(() => Y("tip.box.shadowColor"));
				da(i, {
					get value() {
						return z(e);
					},
					get tokens() {
						return z(n);
					},
					allowClear: !0,
					get label() {
						return z(r);
					},
					onchange: (e) => Ht({ shadowColor: e || null })
				});
			}
			E(n), R((e) => U(r, `${e ?? ""} `), [() => Y("lbl.shadowColor")]), H(e, n);
		};
		W(l, (e) => {
			z(t).shadow && e(u);
		});
		var d = L(l, 2), f = P(d), p = L(f);
		{
			let e = /* @__PURE__ */ k(() => z(t).border === "none" ? "none" : z(t).border ? "custom" : ""), n = /* @__PURE__ */ k(() => [
				["", Y("opt.border.theme")],
				["none", Y("common.none")],
				["custom", Y("opt.border.custom")]
			]);
			X(p, {
				get value() {
					return z(e);
				},
				get options() {
					return z(n);
				},
				onchange: (e) => Ht({ border: e === "custom" ? {
					color: "accent",
					width: 1
				} : e || null })
			});
		}
		E(d);
		var m = L(d, 2), h = (e) => {
			let n = /* @__PURE__ */ k(() => typeof z(t).border == "object" ? z(t).border : {
				color: "text",
				width: 1
			});
			var r = vl(), i = F(r), a = P(i), o = L(a);
			{
				let e = /* @__PURE__ */ k(dr), t = /* @__PURE__ */ k(() => Y("tip.box.borderColor"));
				da(o, {
					get value() {
						return z(n).color;
					},
					get tokens() {
						return z(e);
					},
					get label() {
						return z(t);
					},
					onchange: (e) => Ht({ border: {
						...z(n),
						color: e
					} })
				});
			}
			E(i);
			var s = L(i, 2), c = P(s), l = L(c), u = P(l), d = L(u, 2);
			K(d);
			var f = L(d, 2);
			E(l), E(s), R((e, t, r, i, o, s) => {
				U(a, `${e ?? ""} `), U(c, `${t ?? ""} `), J(u, "title", r), J(u, "aria-label", i), q(d, z(n).width), J(f, "title", o), J(f, "aria-label", s);
			}, [
				() => Y("lbl.borderColor"),
				() => Y("lbl.thicknessPx"),
				() => Y("tip.thinner"),
				() => Y("tip.thinner"),
				() => Y("tip.thicker"),
				() => Y("tip.thicker")
			]), B("click", u, () => Ht({ border: {
				...z(n),
				width: Math.max(1, z(n).width - 1)
			} })), B("change", d, (e) => Ht({ border: {
				...z(n),
				width: Math.min(12, Math.max(1, Number(e.target.value) || 1))
			} })), B("click", f, () => Ht({ border: {
				...z(n),
				width: Math.min(12, z(n).width + 1)
			} })), H(e, r);
		};
		W(m, (e) => {
			z(t).border !== "none" && e(h);
		});
		var g = L(m, 2), _ = P(g);
		K(_);
		var v = L(_);
		E(g), R((e, t, n, r, a, o) => {
			U(i, `${e ?? ""} `), U(s, `${t ?? ""} `), U(f, `${n ?? ""} `), J(g, "title", r), wi(_, a), U(v, ` ${o ?? ""}`);
		}, [
			() => Y("lbl.blockColor"),
			() => Y("lbl.shadow"),
			() => Y("lbl.border"),
			() => Y("tip.box.glass"),
			() => !!z(t).glass,
			() => Y("lbl.glass")
		]), B("change", _, (e) => Ht({ glass: e.target.checked || null })), H(e, n);
	}, a = (e) => {
		var t = yu(), n = F(t), r = P(n), a = P(r);
		let o;
		var s = I(a, !0), l = L(a, 2);
		let u;
		var d = I(l, !0);
		E(r), E(n);
		var f = L(n, 2), p = (e) => {
			var t = Fr(), n = F(t), r = (e) => {
				var t = bl(), n = I(t, !0);
				R((e) => U(n, e), [() => Y("hint.textInline")]), H(e, t);
			}, i = (e) => {
				var t = Sl(), n = F(t), r = P(n);
				K(r);
				var i = L(r);
				E(n);
				var a = L(n, 2), o = I(a, !0), s = L(a, 2);
				Xr(s, 17, () => z(A).props.items ?? [], Kr, (e, t, n) => {
					var r = xl(), i = P(r);
					K(i);
					var a = L(i, 2), o = P(a);
					o.disabled = n === 0, G(o, () => c.up, !0), E(o);
					var s = L(o, 2);
					G(s, () => c.down, !0), E(s);
					var l = L(s, 2);
					G(l, () => c.cross, !0), E(l), E(a), E(r), R((e, r) => {
						q(i, z(t).q), J(i, "title", e), s.disabled = n === (z(A).props.items?.length ?? 0) - 1, J(l, "title", r);
					}, [() => Y("tip.faq.question"), () => Y("tip.faq.remove")]), B("change", i, (e) => Ut(n, { q: e.target.value })), B("click", o, () => Kt(n, -1)), B("click", s, () => Kt(n, 1)), B("click", l, () => Gt(n)), H(e, r);
				});
				var l = L(s, 2), u = I(l, !0);
				R((e, t, a, s, c) => {
					J(n, "title", e), wi(r, t), U(i, ` ${a ?? ""}`), U(o, s), U(u, c);
				}, [
					() => Y("tip.faq.multi"),
					() => !!z(A).props.multi,
					() => Y("lbl.faqMulti"),
					() => Y("lbl.questions"),
					() => Y("ui.addQuestion")
				]), B("change", r, (e) => j("multi", e.target.checked)), B("click", l, Wt), H(e, t);
			}, a = (e) => {
				var t = wl(), n = F(t), r = I(n, !0), i = L(n, 2);
				Xr(i, 17, () => z(A).props.items ?? [], Kr, (e, t, n) => {
					var r = Cl(), i = F(r), a = P(i);
					K(a);
					var o = L(a, 2);
					K(o);
					var s = L(o, 2), l = P(s);
					l.disabled = n === 0, G(l, () => c.up, !0), E(l);
					var u = L(l, 2);
					G(u, () => c.down, !0), E(u);
					var d = L(u, 2);
					G(d, () => c.cross, !0), E(d), E(s), E(i);
					var f = L(i, 2);
					K(f), R((e, r, i, s, c, l) => {
						q(a, z(t).year), J(a, "placeholder", e), J(a, "title", r), q(o, z(t).title), J(o, "title", i), u.disabled = n === (z(A).props.items?.length ?? 0) - 1, J(d, "title", s), q(f, z(t).text), J(f, "placeholder", c), J(f, "title", l);
					}, [
						() => Y("ph.tlYear"),
						() => Y("tip.timeline.year"),
						() => Y("tip.timeline.title"),
						() => Y("tip.timeline.remove"),
						() => Y("ph.tlText"),
						() => Y("tip.timeline.text")
					]), B("change", a, (e) => qt(n, { year: e.target.value })), B("change", o, (e) => qt(n, { title: e.target.value })), B("click", l, () => Xt(n, -1)), B("click", u, () => Xt(n, 1)), B("click", d, () => Yt(n)), B("change", f, (e) => qt(n, { text: e.target.value })), H(e, r);
				});
				var a = L(i, 2), o = I(a, !0);
				R((e, t) => {
					U(r, e), U(o, t);
				}, [() => Y("lbl.timelineItems"), () => Y("ui.addTlItem")]), B("click", a, Jt), H(e, t);
			}, o = (e) => {
				var t = Tl(), n = F(t), r = P(n), i = L(r);
				K(i), E(n);
				var a = L(n, 2), o = P(a), s = L(o);
				K(s), E(a);
				var c = L(a, 2), l = P(c), u = L(l);
				K(u), E(c), R((e, t, n) => {
					U(r, `${e ?? ""} `), q(i, z(A).props.text ?? ""), U(o, `${t ?? ""} `), q(s, z(A).props.attribution ?? ""), U(l, `${n ?? ""} `), q(u, z(A).props.role ?? "");
				}, [
					() => Y("lbl.quoteText"),
					() => Y("lbl.quoteName"),
					() => Y("lbl.quoteRole")
				]), B("change", i, (e) => j("text", e.target.value)), B("change", s, (e) => j("attribution", e.target.value)), B("change", u, (e) => j("role", e.target.value)), H(e, t);
			}, s = (e) => {
				var t = El(), n = F(t), r = P(n), i = L(r);
				K(i), E(n);
				var a = L(n, 2), o = P(a), s = L(o);
				K(s), E(a);
				var c = L(a, 2), l = P(c), u = L(l);
				K(u), E(c);
				var d = L(c, 2), f = P(d), p = L(f);
				K(p), E(d), R((e, t, n, a, c) => {
					U(r, `${e ?? ""} `), q(i, z(A).props.value ?? ""), J(i, "title", t), U(o, `${n ?? ""} `), q(s, z(A).props.prefix ?? ""), U(l, `${a ?? ""} `), q(u, z(A).props.suffix ?? ""), U(f, `${c ?? ""} `), q(p, z(A).props.label ?? "");
				}, [
					() => Y("lbl.statValue"),
					() => Y("tip.stat.value"),
					() => Y("lbl.statPrefix"),
					() => Y("lbl.statSuffix"),
					() => Y("lbl.statLabel")
				]), B("change", i, (e) => j("value", e.target.value)), B("change", s, (e) => j("prefix", e.target.value)), B("change", u, (e) => j("suffix", e.target.value)), B("change", p, (e) => j("label", e.target.value)), H(e, t);
			}, l = (e) => {
				var t = Dl(), n = F(t), r = P(n), i = I(r, !0), a = L(r, 2), o = I(a, !0);
				E(n);
				var s = L(n, 2), c = P(s), l = I(c, !0), u = L(c, 2), d = I(u, !0);
				E(s);
				var f = L(s, 2), p = P(f);
				K(p);
				var m = L(p);
				E(f), R((e, t, n, r, a, s) => {
					U(i, e), U(o, t), U(l, n), U(d, r), J(f, "title", a), wi(p, z(A).props.header !== !1), U(m, ` ${s ?? ""}`);
				}, [
					() => Y("ui.addRow"),
					() => Y("ui.removeRow"),
					() => Y("ui.addColumn"),
					() => Y("ui.removeColumn"),
					() => Y("tip.table.header"),
					() => Y("lbl.tableHeader")
				]), B("click", r, () => Qt(1, 0)), B("click", a, () => Qt(-1, 0)), B("click", c, () => Qt(0, 1)), B("click", u, () => Qt(0, -1)), B("change", p, (e) => j("header", e.target.checked)), H(e, t);
			}, u = (e) => {
				var t = Fr();
				Xr(F(t), 17, () => [
					["facebook", "Facebook"],
					["x", "X"],
					["linkedin", "LinkedIn"],
					["whatsapp", "WhatsApp"],
					["email", Y("opt.share.email")],
					["copy", Y("opt.share.copy")]
				], ([e, t]) => e, (e, t) => {
					var n = /* @__PURE__ */ k(() => h(z(t), 2));
					let r = () => z(n)[0], i = () => z(n)[1];
					var a = Ol(), o = P(a);
					K(o);
					var s = L(o);
					E(a), R((e) => {
						wi(o, e), U(s, ` ${i() ?? ""}`);
					}, [() => (z(A).props.services ?? []).includes(r())]), B("change", o, (e) => $t(r(), e.target.checked)), H(e, a);
				}), H(e, t);
			}, d = (e) => {
				var t = kl(), n = F(t), r = P(n), i = L(r);
				K(i), E(n);
				var a = L(n, 2), o = P(a), s = L(o);
				K(s), E(a), R((e, t, n) => {
					U(r, `${e ?? ""} `), q(i, z(A).props.target ?? ""), J(a, "title", t), U(o, `${n ?? ""} `), q(s, z(A).props.doneText ?? "");
				}, [
					() => Y("lbl.countdownTarget"),
					() => Y("tip.countdown.done"),
					() => Y("lbl.countdownDone")
				]), B("change", i, (e) => j("target", e.target.value)), B("change", s, (e) => j("doneText", e.target.value)), H(e, t);
			}, f = (e) => {
				var t = jl(), n = F(t), r = P(n), i = L(r);
				E(n);
				var a = L(n, 2), o = (e) => {
					var t = Al(), n = I(t, !0);
					R((e) => U(n, e), [() => Y("ui.removeAudio")]), B("click", t, () => j("src", "")), H(e, t);
				};
				W(a, (e) => {
					z(A).props.src && e(o);
				});
				var s = L(a, 2), c = P(s), l = L(c);
				K(l), E(s);
				var u = L(s, 2), d = P(u);
				K(d);
				var f = L(d);
				E(u), R((e, t, i, a, o) => {
					J(n, "title", e), U(r, `${t ?? ""} `), U(c, `${i ?? ""} `), q(l, z(A).props.title ?? ""), wi(d, a), U(f, ` ${o ?? ""}`);
				}, [
					() => Y("tip.blocks.audioFile"),
					() => Y("ui.chooseAudio"),
					() => Y("lbl.audioTitle"),
					() => !!z(A).props.loop,
					() => Y("lbl.audioLoop")
				]), B("change", i, en), B("change", l, (e) => j("title", e.target.value)), B("change", d, (e) => j("loop", e.target.checked)), H(e, t);
			}, p = (e) => {
				var t = Nl(), n = F(t), r = P(n), i = L(r);
				K(i), E(n);
				var a = L(n, 2), o = P(a), s = L(o);
				{
					let e = /* @__PURE__ */ k(() => z(A).props.page ?? "__href"), t = /* @__PURE__ */ k(() => [...z(O).pages.map((e) => [e.id, e.title]), ["__href", Y("opt.externalLink")]]);
					X(s, {
						get value() {
							return z(e);
						},
						get options() {
							return z(t);
						},
						onchange: (e) => {
							let t = e === "__href" ? null : e;
							Nt(`edit:${z(A).blockId}`, (e) => {
								e.props.page = t, t && (e.props.href = null);
							});
						}
					});
				}
				E(a);
				var c = L(a, 2), l = (e) => {
					var t = Ml();
					K(t), R((e) => {
						J(t, "placeholder", e), q(t, z(A).props.href === "#" ? "" : z(A).props.href ?? "");
					}, [() => Y("ph.url")]), B("change", t, (e) => j("href", e.target.value || null)), H(e, t);
				};
				W(c, (e) => {
					z(A).props.page || e(l);
				}), R((e, t) => {
					U(r, `${e ?? ""} `), q(i, z(A).props.label), U(o, `${t ?? ""} `);
				}, [() => Y("blocks.text"), () => Y("lbl.goesTo")]), B("change", i, (e) => j("label", e.target.value)), H(e, t);
			}, m = (e) => {
				var t = Pl(), n = F(t), r = P(n), i = L(r);
				E(n);
				var a = L(n, 2), o = P(a), s = L(o);
				K(s), E(a);
				var c = L(a, 2), l = P(c), u = L(l);
				K(u), E(c);
				var d = L(c, 2), f = (e) => {
					var t = Ol(), n = P(t);
					K(n);
					var r = L(n);
					E(t), R((e, i, a) => {
						J(t, "title", e), wi(n, i), U(r, ` ${a ?? ""}`);
					}, [
						() => Y("tip.lightbox"),
						() => !!z(A).props.lightbox,
						() => Y("lbl.lightbox")
					]), B("change", n, (e) => j("lightbox", e.target.checked)), H(e, t);
				};
				W(d, (e) => {
					z(A).props.href || e(f);
				}), R((e, t, n, i, a) => {
					U(r, `${e ?? ""} `), U(o, `${t ?? ""} `), q(s, z(A).props.alt ?? ""), J(s, "placeholder", n), U(l, `${i ?? ""} `), q(u, z(A).props.href ?? ""), J(u, "placeholder", a);
				}, [
					() => Y("ui.changeImage"),
					() => Y("lbl.description"),
					() => Y("ph.altText"),
					() => Y("lbl.link"),
					() => Y("ph.optionalImageLink")
				]), B("change", i, an), B("change", s, (e) => j("alt", e.target.value)), B("change", u, (e) => j("href", e.target.value || null)), H(e, t);
			}, g = (e) => {
				var t = Fl(), n = F(t), r = I(n, !0), i = L(n, 2);
				K(i);
				var a = L(i, 2), o = P(a), s = L(o);
				K(s), E(a), R((e, t, a, c) => {
					J(n, "title", e), U(r, t), q(i, z(A).props.url ?? ""), J(i, "placeholder", a), U(o, `${c ?? ""} `), q(s, z(A).props.title ?? "");
				}, [
					() => Y("hint.video"),
					() => Y("lbl.videoUrl"),
					() => Y("ph.videoUrl"),
					() => Y("lbl.videoTitle")
				]), B("change", i, (e) => j("url", e.target.value)), B("change", s, (e) => j("title", e.target.value)), H(e, t);
			}, _ = (e) => {
				var t = Rl(), n = F(t), r = P(n), i = L(r), a = P(i);
				{
					let e = /* @__PURE__ */ k(() => z(A).props.glyph ?? "★"), t = /* @__PURE__ */ k(() => z(A).props.icon ?? null), n = /* @__PURE__ */ k(() => z(A).props.image ?? null);
					Wa(a, {
						get value() {
							return z(e);
						},
						get icon() {
							return z(t);
						},
						get image() {
							return z(n);
						},
						onpick: (e) => Nt(`edit:${z(A).blockId}`, (t) => {
							t.props.glyph = e, t.props.icon = null, t.props.image = null;
						}),
						onicon: (e) => Nt(`edit:${z(A).blockId}`, (t) => {
							t.props.icon = e, t.props.image = null;
						}),
						onimage: (e) => j("image", e)
					});
				}
				var o = L(a, 2), s = (e) => {
					var t = Il();
					K(t), R((e) => {
						q(t, z(A).props.glyph ?? ""), J(t, "title", e);
					}, [() => Y("tip.icon.typeGlyph")]), B("change", t, (e) => j("glyph", e.target.value || "★")), H(e, t);
				}, c = (e) => {
					var t = Al(), n = I(t, !0);
					R((e, r) => {
						J(t, "title", e), U(n, r);
					}, [() => Y("tip.icon.backToGlyph"), () => Y("ui.removeDrawnIcon")]), B("click", t, () => j("icon", null)), H(e, t);
				};
				W(o, (e) => {
					z(A).props.icon ? e(c, -1) : e(s);
				}), E(i), E(n);
				var l = L(n, 2), u = (e) => {
					var t = Ll(), n = P(t), r = L(n, 2), i = I(r, !0);
					E(t), R((e, r, a) => {
						J(t, "title", e), J(n, "src", z(A).props.image), J(n, "alt", r), U(i, a);
					}, [
						() => Y("hint.icon.ownImage"),
						() => Y("gp.ownIcon"),
						() => Y("ui.removeOwnIcon")
					]), B("click", r, () => j("image", null)), H(e, t);
				};
				W(l, (e) => {
					z(A).props.image && e(u);
				}), R((e) => U(r, `${e ?? ""} `), [() => Y("blocks.icon")]), H(e, t);
			}, v = (e) => {
				var t = zl(), n = F(t), r = P(n), i = L(r);
				{
					let e = /* @__PURE__ */ k(() => z(A).props.collection ?? ""), t = /* @__PURE__ */ k(() => [["", Y("common.choose")], ...z(uo).map((e) => [e, z(fo)[e]?.name ?? e])]);
					X(i, {
						get value() {
							return z(e);
						},
						get options() {
							return z(t);
						},
						onchange: (e) => j("collection", e || null)
					});
				}
				E(n);
				var a = L(n, 2), o = P(a), s = L(o);
				K(s), E(a);
				var c = L(a, 2), l = P(c);
				K(l);
				var u = L(l);
				E(c), R((e, t, i, c, d) => {
					J(n, "title", e), U(r, `${t ?? ""} `), J(a, "title", i), U(o, `${c ?? ""} `), q(s, z(A).props.limit ?? 6), wi(l, z(A).props.newestFirst !== !1), U(u, ` ${d ?? ""}`);
				}, [
					() => Y("tip.collection.source"),
					() => Y("blocks.collection"),
					() => Y("tip.collection.limit"),
					() => Y("lbl.maxCount"),
					() => Y("lbl.newestFirst")
				]), B("change", s, (e) => j("limit", Number(e.target.value))), B("change", l, (e) => j("newestFirst", e.target.checked)), H(e, t);
			}, y = (e) => {
				var t = Hl(), n = F(t), r = P(n), i = L(r);
				{
					let e = /* @__PURE__ */ k(() => z(A).props.collection ?? ""), t = /* @__PURE__ */ k(() => [["", Y("common.choose")], ...z(uo).filter((e) => z(fo)[e]?.kind === "products").map((e) => [e, z(fo)[e]?.name ?? e])]);
					X(i, {
						get value() {
							return z(e);
						},
						get options() {
							return z(t);
						},
						onchange: (e) => j("collection", e || null)
					});
				}
				E(n);
				var a = L(n, 2), o = (e) => {
					var t = Bl(), n = P(t), r = I(n, !0), i = L(n, 2), a = I(i, !0);
					E(t), R((e, t, o, s) => {
						J(n, "title", e), U(r, t), J(i, "title", o), U(a, s);
					}, [
						() => Y("tip.product.addProduct"),
						() => Y("ui.addProduct"),
						() => Y("tip.product.editCatalog"),
						() => Y("ui.editCatalog")
					]), B("click", n, () => Uo(z(A).props.collection)), B("click", i, () => {
						N(po, z(A).props.collection, !0), N(ft, "collections");
					}), H(e, t);
				}, s = (e) => {
					var t = Vl(), n = I(t, !0);
					R((e, r) => {
						J(t, "title", e), U(n, r);
					}, [() => Y("tip.product.createCatalog"), () => Y("ui.createCatalog")]), B("click", t, Vo), H(e, t);
				}, c = /* @__PURE__ */ k(() => !z(uo).some((e) => z(fo)[e]?.kind === "products"));
				W(a, (e) => {
					z(A).props.collection && z(fo)[z(A).props.collection]?.kind === "products" ? e(o) : z(c) && e(s, 1);
				});
				var l = L(a, 2), u = P(l), d = L(u);
				K(d), E(l);
				var f = L(l, 2), p = P(f), m = L(p);
				K(m), E(f), R((e, t, i, a, o, s) => {
					J(n, "title", e), U(r, `${t ?? ""} `), J(l, "title", i), U(u, `${a ?? ""} `), q(d, z(A).props.limit ?? 0), J(f, "title", o), U(p, `${s ?? ""} `), q(m, z(A).props.currency ?? "kr");
				}, [
					() => Y("tip.product.source"),
					() => Y("blocks.collection"),
					() => Y("tip.collection.limit"),
					() => Y("lbl.maxCount"),
					() => Y("tip.product.currency"),
					() => Y("lbl.currency")
				]), B("change", d, (e) => j("limit", Number(e.target.value))), B("change", m, (e) => j("currency", e.target.value)), H(e, t);
			}, b = (e) => {
				var t = Ul(), n = F(t), r = P(n), i = L(r);
				{
					let e = /* @__PURE__ */ k(() => z(A).props.href ?? ""), t = /* @__PURE__ */ k(() => [["", Y("common.none")], ...z(O).pages.map((e) => [e.path, e.title])]);
					X(i, {
						get value() {
							return z(e);
						},
						get options() {
							return z(t);
						},
						onchange: (e) => j("href", e)
					});
				}
				E(n);
				var a = L(n, 2), o = P(a), s = L(o);
				K(s), E(a), R((e, t, i, c) => {
					J(n, "title", e), U(r, `${t ?? ""} `), J(a, "title", i), U(o, `${c ?? ""} `), q(s, z(A).props.currency ?? "kr");
				}, [
					() => Y("tip.cart.checkout"),
					() => Y("lbl.checkoutPage"),
					() => Y("tip.product.currency"),
					() => Y("lbl.currency")
				]), B("change", s, (e) => j("currency", e.target.value)), H(e, t);
			}, x = (e) => {
				var t = Wl(), n = F(t), r = P(n), i = L(r);
				K(i), E(n);
				var a = L(n, 2), o = P(a), s = L(o);
				K(s), E(a);
				var c = L(a, 2), l = P(c), u = L(l);
				K(u), E(c);
				var d = L(c, 2), f = P(d);
				K(f);
				var p = L(f);
				E(d);
				var m = L(d, 2), h = P(m), g = L(h);
				K(g), E(m), R((e, t, _, v, y, b, x, S, C, ee) => {
					J(n, "title", e), U(r, `${t ?? ""} `), q(i, z(A).props.recipient ?? ""), J(a, "title", _), U(o, `${v ?? ""} `), q(s, z(A).props.endpoint ?? ""), J(c, "title", y), U(l, `${b ?? ""} `), q(u, z(A).props.vipps ?? ""), J(d, "title", x), wi(f, z(A).props.vippsCheckout === !0), U(p, ` ${S ?? ""}`), J(m, "title", C), U(h, `${ee ?? ""} `), q(g, z(A).props.currency ?? "kr");
				}, [
					() => Y("tip.checkout.recipient"),
					() => Y("lbl.recipientEmail"),
					() => Y("tip.checkout.endpoint"),
					() => Y("lbl.endpointUrl"),
					() => Y("tip.checkout.vipps"),
					() => Y("lbl.vippsNumber"),
					() => Y("tip.checkout.vippsCheckout"),
					() => Y("lbl.vippsCheckout"),
					() => Y("tip.product.currency"),
					() => Y("lbl.currency")
				]), B("change", i, (e) => j("recipient", e.target.value.trim())), B("change", s, (e) => j("endpoint", e.target.value.trim())), B("change", u, (e) => j("vipps", e.target.value.trim())), B("change", f, (e) => j("vippsCheckout", e.target.checked)), B("change", g, (e) => j("currency", e.target.value)), H(e, t);
			}, S = (e) => {
				var t = Kl(), n = F(t), r = P(n), i = L(r);
				E(n), Xr(L(n, 2), 17, () => z(A).props.images ?? [], Kr, (e, t, n) => {
					var r = Gl(), i = P(r), a = P(i), o = L(a, 2), s = P(o);
					s.disabled = n === 0, G(s, () => c.up, !0), E(s);
					var l = L(s, 2);
					G(l, () => c.down, !0), E(l);
					var u = L(l, 2);
					G(u, () => c.cross, !0), E(u), E(o), E(i);
					var d = L(i, 2), f = P(d), p = L(f);
					K(p), E(d);
					var m = L(d, 2), h = P(m), g = L(h);
					K(g), E(m), E(r), R((e, r, o, s, c, d) => {
						J(i, "title", e), J(a, "src", z(t).src), l.disabled = n === z(A).props.images.length - 1, J(u, "title", r), U(f, `${o ?? ""} `), q(p, z(t).alt ?? ""), J(p, "placeholder", s), U(h, `${c ?? ""} `), q(g, z(t).href ?? ""), J(g, "placeholder", d);
					}, [
						() => Y("hint.gallery"),
						() => Y("tip.removeImage"),
						() => Y("lbl.description"),
						() => Y("ph.altShort"),
						() => Y("lbl.link"),
						() => Y("ph.galleryHref")
					]), B("click", s, () => xp(n, -1)), B("click", l, () => xp(n, 1)), B("click", u, () => Sp(n)), B("change", p, (e) => Cp(n, "alt", e.target.value)), B("change", g, (e) => Cp(n, "href", e.target.value || null)), H(e, r);
				}), R((e, t) => {
					J(n, "title", e), U(r, `${t ?? ""} `);
				}, [() => Y("tip.gallery.addImages"), () => Y("ui.addImages")]), B("change", i, yp), H(e, t);
			}, C = (e) => {
				var t = _l(), n = P(t);
				X(L(n), {
					get value() {
						return z(A).props.kind;
					},
					get options() {
						return cn;
					},
					onchange: (e) => j("kind", e)
				}), E(t), R((e) => U(n, `${e ?? ""} `), [() => Y("blocks.shape")]), H(e, t);
			}, ee = (e) => {
				let t = /* @__PURE__ */ k(() => z(up).find((e) => e.type === z(A).type)?.fields ?? []);
				var n = Fr(), r = F(n), i = (e) => {
					var n = Fr();
					Xr(F(n), 17, () => z(t), (e) => e.key, (e, t) => {
						var n = Fr(), r = F(n), i = (e) => {
							let n = /* @__PURE__ */ k(() => `${z(A).blockId}:${z(t).key}`);
							var r = Jl(), i = F(r), a = P(i), o = L(a);
							K(o), E(i);
							var s = L(i, 2), c = I(s, !0), l = L(s, 2), u = (e) => {
								var t = ql();
								let r;
								var i = I(t, !0);
								R(() => {
									r = _i(t, 1, "panel-hint svelte-1n46o8q", null, r, { "place-error": It[z(n)].err }), U(i, It[z(n)].text);
								}), H(e, t);
							};
							W(l, (e) => {
								It[z(n)] && e(u);
							}), R((e) => {
								U(a, `${z(t).label ?? ""} `), J(o, "placeholder", z(t).placeholder), q(o, Ft[z(n)] ?? z(A).props[z(t).key] ?? ""), s.disabled = z(Lt), U(c, e);
							}, [() => Y("props.place.search")]), B("input", o, (e) => {
								Ft[z(n)] = e.target.value;
							}), B("keydown", o, (e) => {
								e.key === "Enter" && Bt(z(t));
							}), B("click", s, () => Bt(z(t))), H(e, r);
						}, a = (e) => {
							var n = Yl(), r = P(n), i = L(r);
							K(i), E(n), R(() => {
								U(r, `${z(t).label ?? ""} `), J(i, "min", z(t).min), J(i, "max", z(t).max), J(i, "step", z(t).step ?? 1), q(i, z(A).props[z(t).key]);
							}), B("change", i, (e) => j(z(t).key, zt(z(t), Number(e.target.value)))), H(e, n);
						}, o = (e) => {
							var n = Ol(), r = P(n);
							K(r);
							var i = L(r);
							E(n), R((e) => {
								wi(r, e), U(i, ` ${z(t).label ?? ""}`);
							}, [() => !!z(A).props[z(t).key]]), B("change", r, (e) => j(z(t).key, e.target.checked)), H(e, n);
						}, s = (e) => {
							var n = _l(), r = P(n), i = L(r);
							{
								let e = /* @__PURE__ */ k(() => (z(t).options ?? []).map((e) => [e.value, e.label]));
								X(i, {
									get value() {
										return z(A).props[z(t).key];
									},
									get options() {
										return z(e);
									},
									onchange: (e) => j(z(t).key, e)
								});
							}
							E(n), R(() => U(r, `${z(t).label ?? ""} `)), H(e, n);
						}, c = (e) => {
							var n = Xl(), r = P(n), i = L(r);
							K(i), E(n), R(() => {
								U(r, `${z(t).label ?? ""} `), J(i, "placeholder", z(t).placeholder), q(i, z(A).props[z(t).key] ?? "");
							}), B("change", i, (e) => j(z(t).key, e.target.value)), H(e, n);
						};
						W(r, (e) => {
							z(t).type === "place" ? e(i) : z(t).type === "number" ? e(a, 1) : z(t).type === "toggle" ? e(o, 2) : z(t).type === "select" ? e(s, 3) : e(c, -1);
						}), H(e, n);
					}), H(e, n);
				}, a = (e) => {
					var t = Al(), n = I(t, !0);
					R((e, r) => {
						J(t, "title", e), U(n, r);
					}, [() => Y("hint.pluginBlock"), () => Y("ui.settings")]), B("click", t, () => D?.sendOpenConfig(z(A).blockId)), H(e, t);
				};
				W(r, (e) => {
					z(t).length ? e(i) : e(a, -1);
				}), H(e, n);
			};
			W(n, (e) => {
				z(A).type === "text" ? e(r) : z(A).type === "faq" ? e(i, 1) : z(A).type === "timeline" ? e(a, 2) : z(A).type === "quote" ? e(o, 3) : z(A).type === "stats" ? e(s, 4) : z(A).type === "table" ? e(l, 5) : z(A).type === "share" ? e(u, 6) : z(A).type === "countdown" ? e(d, 7) : z(A).type === "audio" ? e(f, 8) : z(A).type === "button" ? e(p, 9) : z(A).type === "image" ? e(m, 10) : z(A).type === "video" ? e(g, 11) : z(A).type === "icon" ? e(_, 12) : z(A).type === "collection" ? e(v, 13) : z(A).type === "product" ? e(y, 14) : z(A).type === "cart" ? e(b, 15) : z(A).type === "checkout" ? e(x, 16) : z(A).type === "gallery" ? e(S, 17) : z(A).type === "shape" ? e(C, 18) : e(ee, -1);
			}), H(e, t);
		}, m = (e) => {
			var t = vu(), n = F(t), r = (e) => {
				var t = Zl(), n = F(t), r = P(n), a = L(r);
				{
					let e = /* @__PURE__ */ k(() => z(A).props.align ?? "left"), t = /* @__PURE__ */ k(() => [
						["left", Y("common.left")],
						["center", Y("common.center")],
						["right", Y("common.right")]
					]);
					X(a, {
						get value() {
							return z(e);
						},
						get options() {
							return z(t);
						},
						onchange: (e) => j("align", e)
					});
				}
				E(n);
				var o = L(n, 2), s = P(o);
				K(s);
				var c = L(s);
				E(o);
				var l = L(o, 2), u = (e) => {
					i(e);
				};
				W(l, (e) => {
					z(A).props.box && e(u);
				}), ke(2), R((e, t, n) => {
					U(r, `${e ?? ""} `), wi(s, t), U(c, ` ${n ?? ""}`);
				}, [
					() => Y("lbl.align"),
					() => !!z(A).props.box,
					() => Y("lbl.textBoxToggle")
				]), B("change", s, (e) => j("box", e.target.checked)), H(e, t);
			}, a = (e) => {
				var t = Ql(), n = F(t), r = I(n, !0), a = L(n, 2);
				i(a), ke(2), R((e) => U(r, e), [() => Y("lbl.cardStyle")]), H(e, t);
			}, o = (e) => {
				var t = $l(), n = F(t), r = P(n), i = L(r);
				{
					let e = /* @__PURE__ */ k(() => z(A).props.variant ?? "left"), t = /* @__PURE__ */ k(() => [["left", Y("opt.timeline.left")], ["alternating", Y("opt.timeline.alternating")]]);
					X(i, {
						get value() {
							return z(e);
						},
						get options() {
							return z(t);
						},
						onchange: (e) => j("variant", e)
					});
				}
				E(n);
				var a = L(n, 2), o = P(a), s = L(o);
				{
					let e = /* @__PURE__ */ k(() => z(A).props.marker ?? "filled"), t = /* @__PURE__ */ k(() => [["filled", Y("opt.timeline.filled")], ["ring", Y("opt.timeline.ring")]]);
					X(s, {
						get value() {
							return z(e);
						},
						get options() {
							return z(t);
						},
						onchange: (e) => j("marker", e)
					});
				}
				E(a);
				var c = L(a, 2), l = P(c), u = L(l);
				{
					let e = /* @__PURE__ */ k(() => z(A).props.accent ?? "accent"), t = /* @__PURE__ */ k(dr);
					da(u, {
						get value() {
							return z(e);
						},
						get tokens() {
							return z(t);
						},
						onchange: (e) => j("accent", e === "accent" ? null : e)
					});
				}
				E(c), ke(2), R((e, t, n) => {
					U(r, `${e ?? ""} `), U(o, `${t ?? ""} `), U(l, `${n ?? ""} `);
				}, [
					() => Y("lbl.variant"),
					() => Y("lbl.timelineMarker"),
					() => Y("lbl.color")
				]), H(e, t);
			}, s = (e) => {
				var t = tu(), n = F(t), r = P(n), i = L(r);
				{
					let e = /* @__PURE__ */ k(() => z(A).props.variant ?? "large"), t = /* @__PURE__ */ k(() => [["large", Y("opt.quote.large")], ["short", Y("opt.quote.short")]]);
					X(i, {
						get value() {
							return z(e);
						},
						get options() {
							return z(t);
						},
						onchange: (e) => j("variant", e)
					});
				}
				E(n);
				var a = L(n, 2), o = (e) => {
					var t = eu(), n = F(t), r = P(n), i = L(r);
					E(n);
					var a = L(n, 2), o = (e) => {
						var t = Al(), n = I(t, !0);
						R((e) => U(n, e), [() => Y("ui.quotePortraitRemove")]), B("click", t, () => j("image", "")), H(e, t);
					};
					W(a, (e) => {
						z(A).props.image && e(o);
					}), R((e) => U(r, `${e ?? ""} `), [() => Y("ui.quotePortrait")]), B("change", i, on), H(e, t);
				};
				W(a, (e) => {
					z(A).props.variant === "short" && e(o);
				});
				var s = L(a, 2), c = P(s), l = L(c);
				{
					let e = /* @__PURE__ */ k(() => z(A).props.accent ?? "accent"), t = /* @__PURE__ */ k(dr);
					da(l, {
						get value() {
							return z(e);
						},
						get tokens() {
							return z(t);
						},
						onchange: (e) => j("accent", e === "accent" ? null : e)
					});
				}
				E(s), ke(2), R((e, t) => {
					U(r, `${e ?? ""} `), U(c, `${t ?? ""} `);
				}, [() => Y("lbl.variant"), () => Y("lbl.color")]), H(e, t);
			}, c = (e) => {
				var t = nu(), n = F(t), r = P(n);
				K(r);
				var i = L(r);
				E(n), ke(2), R((e, t) => {
					J(n, "title", e), wi(r, z(A).props.countUp !== !1), U(i, ` ${t ?? ""}`);
				}, [() => Y("tip.stat.countUp"), () => Y("lbl.statCountUp")]), B("change", r, (e) => j("countUp", e.target.checked)), H(e, t);
			}, l = (e) => {
				var t = ru(), n = F(t), r = P(n), i = L(r);
				{
					let e = /* @__PURE__ */ k(() => z(A).props.lines ?? "rows"), t = /* @__PURE__ */ k(() => [
						["rows", Y("opt.table.rows")],
						["grid", Y("opt.table.grid")],
						["none", Y("common.none")]
					]);
					X(i, {
						get value() {
							return z(e);
						},
						get options() {
							return z(t);
						},
						onchange: (e) => j("lines", e)
					});
				}
				E(n);
				var a = L(n, 2), o = P(a);
				K(o);
				var s = L(o);
				E(a), ke(2), R((e, t, n) => {
					U(r, `${e ?? ""} `), wi(o, t), U(s, ` ${n ?? ""}`);
				}, [
					() => Y("lbl.tableLines"),
					() => !!z(A).props.striped,
					() => Y("lbl.tableStriped")
				]), B("change", o, (e) => j("striped", e.target.checked)), H(e, t);
			}, u = (e) => {
				var t = iu(), n = F(t), r = P(n), i = L(r);
				{
					let e = /* @__PURE__ */ k(() => z(A).props.variant ?? "icons"), t = /* @__PURE__ */ k(() => [["icons", Y("opt.share.icons")], ["labels", Y("opt.share.labels")]]);
					X(i, {
						get value() {
							return z(e);
						},
						get options() {
							return z(t);
						},
						onchange: (e) => j("variant", e)
					});
				}
				E(n);
				var a = L(n, 2), o = P(a), s = L(o);
				K(s), E(a);
				var c = L(a, 2), l = P(c), u = L(l);
				{
					let e = /* @__PURE__ */ k(() => z(A).props.color || "accent"), t = /* @__PURE__ */ k(dr);
					da(u, {
						get value() {
							return z(e);
						},
						get tokens() {
							return z(t);
						},
						onchange: (e) => j("color", e === "accent" ? "" : e)
					});
				}
				E(c), ke(2), R((e, t, n) => {
					U(r, `${e ?? ""} `), U(o, `${t ?? ""} `), q(s, z(A).props.size ?? 38), U(l, `${n ?? ""} `);
				}, [
					() => Y("lbl.variant"),
					() => Y("lbl.size"),
					() => Y("lbl.color")
				]), B("change", s, (e) => j("size", Number(e.target.value) || 38)), H(e, t);
			}, d = (e) => {
				var t = ru(), n = F(t), r = P(n), i = L(r);
				{
					let e = /* @__PURE__ */ k(() => z(A).props.variant ?? "boxes"), t = /* @__PURE__ */ k(() => [["boxes", Y("opt.countdown.boxes")], ["plain", Y("opt.countdown.plain")]]);
					X(i, {
						get value() {
							return z(e);
						},
						get options() {
							return z(t);
						},
						onchange: (e) => j("variant", e)
					});
				}
				E(n);
				var a = L(n, 2), o = P(a);
				K(o);
				var s = L(o);
				E(a), ke(2), R((e, t) => {
					U(r, `${e ?? ""} `), wi(o, z(A).props.showSeconds !== !1), U(s, ` ${t ?? ""}`);
				}, [() => Y("lbl.variant"), () => Y("lbl.countdownSeconds")]), B("change", o, (e) => j("showSeconds", e.target.checked)), H(e, t);
			}, f = (e) => {
				var t = au(), n = F(t), r = P(n), i = L(r);
				{
					let e = /* @__PURE__ */ k(() => [["primary", Y("opt.btn.primary")], ["secondary", Y("opt.btn.secondary")]]);
					X(i, {
						get value() {
							return z(A).props.style;
						},
						get options() {
							return z(e);
						},
						onchange: (e) => j("style", e)
					});
				}
				E(n), ke(2), R((e) => U(r, `${e ?? ""} `), [() => Y("lbl.style")]), H(e, t);
			}, p = (e) => {
				var t = ou(), n = F(t), r = P(n), i = L(r);
				{
					let e = /* @__PURE__ */ k(() => z(A).props.fit ?? "cover"), t = /* @__PURE__ */ k(() => [["cover", Y("opt.fitFrame.cover")], ["contain", Y("opt.fitFrame.contain")]]);
					X(i, {
						get value() {
							return z(e);
						},
						get options() {
							return z(t);
						},
						onchange: (e) => j("fit", e)
					});
				}
				E(n);
				var a = L(n, 2), o = P(a), s = L(o);
				{
					let e = /* @__PURE__ */ k(() => z(A).props.radius ?? ""), t = /* @__PURE__ */ k(() => [
						["", Y("common.none")],
						["sm", Y("opt.size.sm")],
						["md", Y("opt.radius.md")]
					]);
					X(s, {
						get value() {
							return z(e);
						},
						get options() {
							return z(t);
						},
						onchange: (e) => j("radius", e || null)
					});
				}
				E(a);
				var c = L(a, 2), l = P(c), u = I(L(l));
				E(c);
				var d = L(c, 2);
				K(d);
				var f = L(d, 2), p = P(f), m = I(L(p));
				E(f);
				var h = L(f, 2);
				K(h);
				var g = L(h, 2), _ = P(g), v = I(L(_));
				E(g);
				var y = L(g, 2);
				K(y);
				var b = L(y, 2), x = P(b), S = I(L(x));
				E(b);
				var C = L(b, 2);
				K(C);
				var ee = L(C, 2), te = P(ee), ne = I(L(te));
				E(ee);
				var w = L(ee, 2);
				K(w);
				var re = L(w, 2), ie = P(re), ae = I(L(ie));
				E(re);
				var oe = L(re, 2);
				K(oe);
				var se = L(oe, 2), ce = I(se, !0);
				ke(2), R((e, t, n, i, a, s, c, f, b, ee, re, le, ue, de, fe, pe, me) => {
					U(r, `${e ?? ""} `), U(o, `${t ?? ""} `), U(l, `${n ?? ""} `), U(u, `${i ?? ""}%`), q(d, z(A).props.x ?? .5), U(p, `${a ?? ""} `), U(m, `${s ?? ""}%`), q(h, z(A).props.y ?? .5), J(g, "title", c), U(_, `${f ?? ""} `), U(v, `${b ?? ""}x`), q(y, z(A).props.zoom ?? 1), U(x, `${ee ?? ""} `), U(S, `${re ?? ""}%`), q(C, z(A).props.brightness ?? 1), U(te, `${le ?? ""} `), U(ne, `${ue ?? ""}%`), q(w, z(A).props.contrast ?? 1), U(ie, `${de ?? ""} `), U(ae, `${fe ?? ""}%`), q(oe, z(A).props.saturate ?? 1), J(se, "title", pe), U(ce, me);
				}, [
					() => Y("lbl.fit"),
					() => Y("lbl.radius"),
					() => Y("lbl.focusX"),
					() => Math.round((z(A).props.x ?? .5) * 100),
					() => Y("lbl.focusY"),
					() => Math.round((z(A).props.y ?? .5) * 100),
					() => Y("tip.zoomCrop"),
					() => Y("lbl.zoom"),
					() => (z(A).props.zoom ?? 1).toFixed(2),
					() => Y("lbl.brightness"),
					() => Math.round((z(A).props.brightness ?? 1) * 100),
					() => Y("lbl.contrast"),
					() => Math.round((z(A).props.contrast ?? 1) * 100),
					() => Y("lbl.saturate"),
					() => Math.round((z(A).props.saturate ?? 1) * 100),
					() => Y("tip.resetAdjust"),
					() => Y("ui.resetAdjust")
				]), B("input", d, (e) => j("x", Number(e.target.value))), B("input", h, (e) => j("y", Number(e.target.value))), B("input", y, (e) => j("zoom", Number(e.target.value))), B("input", C, (e) => j("brightness", Number(e.target.value))), B("input", w, (e) => j("contrast", Number(e.target.value))), B("input", oe, (e) => j("saturate", Number(e.target.value))), B("click", se, () => Nt(`edit:${z(A).blockId}`, (e) => {
					e.props.brightness = 1, e.props.contrast = 1, e.props.saturate = 1;
				})), H(e, t);
			}, m = (e) => {
				var t = su(), n = F(t), r = P(n), i = L(r);
				K(i), E(n);
				var a = L(n, 2), o = P(a), s = L(o);
				{
					let e = /* @__PURE__ */ k(() => z(A).props.color ?? "accent"), t = /* @__PURE__ */ k(dr);
					da(s, {
						get value() {
							return z(e);
						},
						get tokens() {
							return z(t);
						},
						onchange: (e) => j("color", e)
					});
				}
				E(a), ke(2), R((e, t, n) => {
					U(r, `${e ?? ""} `), q(i, z(A).props.size ?? 48), J(a, "title", t), U(o, `${n ?? ""} `);
				}, [
					() => Y("lbl.sizePx"),
					() => Y("hint.icon.color"),
					() => Y("lbl.color")
				]), B("change", i, (e) => j("size", Number(e.target.value))), H(e, t);
			}, h = (e) => {
				var t = au(), n = F(t), r = P(n), i = L(r);
				{
					let e = /* @__PURE__ */ k(() => z(A).props.view ?? "cards"), t = /* @__PURE__ */ k(() => [
						["cards", Y("opt.collectionView.cards")],
						["list", Y("opt.collectionView.list")],
						["archive", Y("opt.collectionView.archive")]
					]);
					X(i, {
						get value() {
							return z(e);
						},
						get options() {
							return z(t);
						},
						onchange: (e) => j("view", e)
					});
				}
				E(n), ke(2), R((e) => U(r, `${e ?? ""} `), [() => Y("lbl.view")]), H(e, t);
			}, g = (e) => {
				var t = cu(), n = F(t), r = P(n), i = L(r);
				K(i), E(n), ke(2), R((e, t) => {
					J(n, "title", e), U(r, `${t ?? ""} `), q(i, z(A).props.columns ?? 0);
				}, [() => Y("tip.product.columns"), () => Y("lbl.columns")]), B("change", i, (e) => j("columns", Number(e.target.value))), H(e, t);
			}, _ = (e) => {
				var t = au(), n = F(t), r = P(n), i = L(r);
				{
					let e = /* @__PURE__ */ k(() => z(A).props.variant ?? "button"), t = /* @__PURE__ */ k(() => [["button", Y("opt.cart.button")], ["icon", Y("opt.cart.icon")]]);
					X(i, {
						get value() {
							return z(e);
						},
						get options() {
							return z(t);
						},
						onchange: (e) => j("variant", e)
					});
				}
				E(n), ke(2), R((e) => U(r, `${e ?? ""} `), [() => Y("lbl.view")]), H(e, t);
			}, v = (e) => {
				var t = du(), n = F(t), r = P(n), i = L(r);
				{
					let e = /* @__PURE__ */ k(() => z(A).props.view ?? "grid"), t = /* @__PURE__ */ k(() => [
						["grid", Y("opt.galleryView.grid")],
						["carousel", Y("opt.galleryView.carousel")],
						["slides", Y("opt.galleryView.slides")]
					]);
					X(i, {
						get value() {
							return z(e);
						},
						get options() {
							return z(t);
						},
						onchange: (e) => j("view", e)
					});
				}
				E(n);
				var a = L(n, 2), o = (e) => {
					var t = lu(), n = F(t), r = P(n), i = L(r);
					K(i), E(n);
					var a = L(n, 2), o = P(a), s = I(L(o));
					E(a);
					var c = L(a, 2);
					K(c), R((e, t) => {
						U(r, `${e ?? ""} `), q(i, z(A).props.columns ?? 3), U(o, `${t ?? ""} `), U(s, `${z(A).props.gap ?? 12 ?? ""} px`), q(c, z(A).props.gap ?? 12);
					}, [() => Y("lbl.columns"), () => Y("lbl.imageGap")]), B("change", i, (e) => j("columns", Number(e.target.value))), B("input", c, (e) => j("gap", Number(e.target.value))), H(e, t);
				};
				W(a, (e) => {
					(z(A).props.view ?? "grid") === "grid" && e(o);
				});
				var s = L(a, 2), c = (e) => {
					var t = uu(), n = P(t), r = L(n);
					K(r), E(t), R((e) => {
						U(n, `${e ?? ""} `), q(r, z(A).props.interval ?? 5);
					}, [() => Y("lbl.secondsPerImage")]), B("change", r, (e) => j("interval", Number(e.target.value))), H(e, t);
				};
				W(s, (e) => {
					z(A).props.view === "slides" && e(c);
				});
				var l = L(s, 2), u = P(l), d = L(u);
				{
					let e = /* @__PURE__ */ k(() => z(A).props.radius ?? ""), t = /* @__PURE__ */ k(() => [
						["", Y("common.none")],
						["sm", Y("opt.size.sm")],
						["md", Y("opt.radius.md")]
					]);
					X(d, {
						get value() {
							return z(e);
						},
						get options() {
							return z(t);
						},
						onchange: (e) => j("radius", e || null)
					});
				}
				E(l);
				var f = L(l, 2), p = P(f);
				K(p);
				var m = L(p);
				E(f), ke(2), R((e, t, n, i) => {
					U(r, `${e ?? ""} `), U(u, `${t ?? ""} `), J(f, "title", n), wi(p, z(A).props.lightbox !== !1), U(m, ` ${i ?? ""}`);
				}, [
					() => Y("lbl.view"),
					() => Y("lbl.radius"),
					() => Y("tip.lightbox"),
					() => Y("lbl.lightbox")
				]), B("change", p, (e) => j("lightbox", e.target.checked)), H(e, t);
			}, y = (e) => {
				var t = fu(), n = F(t), r = P(n);
				X(L(r), {
					get value() {
						return z(A).props.color;
					},
					get options() {
						return ln;
					},
					onchange: (e) => j("color", e)
				}), E(n);
				var i = L(n, 2), a = P(i), o = L(a);
				K(o), E(i);
				var s = L(i, 2), c = P(s);
				K(c);
				var l = L(c);
				E(s), ke(2), R((e, t, n, i, u) => {
					U(r, `${e ?? ""} `), U(a, `${t ?? ""} `), q(o, z(A).props.thickness), J(s, "title", n), wi(c, i), U(l, ` ${u ?? ""}`);
				}, [
					() => Y("lbl.color"),
					() => Y("lbl.thickness"),
					() => Y("tip.shape.fill"),
					() => !!z(A).props.fill,
					() => Y("lbl.filled")
				]), B("change", o, (e) => j("thickness", Number(e.target.value))), B("change", c, (e) => j("fill", e.target.checked ? z(A).props.color : null)), H(e, t);
			};
			W(n, (e) => {
				z(A).type === "text" ? e(r) : z(A).type === "faq" ? e(a, 1) : z(A).type === "timeline" ? e(o, 2) : z(A).type === "quote" ? e(s, 3) : z(A).type === "stats" ? e(c, 4) : z(A).type === "table" ? e(l, 5) : z(A).type === "share" ? e(u, 6) : z(A).type === "countdown" ? e(d, 7) : z(A).type === "button" ? e(f, 8) : z(A).type === "image" ? e(p, 9) : z(A).type === "icon" ? e(m, 10) : z(A).type === "collection" ? e(h, 11) : z(A).type === "product" ? e(g, 12) : z(A).type === "cart" ? e(_, 13) : z(A).type === "gallery" ? e(v, 14) : z(A).type === "shape" && e(y, 15);
			});
			var b = L(n, 2), x = P(b), S = L(x);
			{
				let e = /* @__PURE__ */ k(() => yr(z(A).animation) ? z(A).animation.type : "");
				X(S, {
					get value() {
						return z(e);
					},
					get options() {
						return xr;
					},
					onchange: (e) => Er(e || null)
				});
			}
			E(b);
			var C = L(b, 2), ee = (e) => {
				var t = pu(), n = F(t), r = P(n), i = L(r);
				K(i), E(n);
				var a = L(n, 2), o = P(a), s = L(o);
				K(s), E(a), R((e, t) => {
					U(r, `${e ?? ""} `), q(i, z(A).animation.props.duration), U(o, `${t ?? ""} `), q(s, z(A).animation.props.delay);
				}, [() => Y("lbl.durationMs"), () => Y("lbl.delayMs")]), B("change", i, (e) => Or("duration", Number(e.target.value))), B("change", s, (e) => Or("delay", Number(e.target.value))), H(e, t);
			}, te = /* @__PURE__ */ k(() => yr(z(A).animation));
			W(C, (e) => {
				z(te) && e(ee);
			});
			var ne = L(C, 2), w = P(ne), re = L(w);
			{
				let e = /* @__PURE__ */ k(() => z(A).hover?.type ?? (z(A).animation && !yr(z(A).animation) ? z(A).animation.type : ""));
				X(re, {
					get value() {
						return z(e);
					},
					get options() {
						return Sr;
					},
					onchange: (e) => Dr(e || null)
				});
			}
			E(ne);
			var ie = L(ne, 2), ae = (e) => {
				var t = gu(), n = L(F(t), 2), r = P(n);
				K(r);
				var i = L(r);
				E(n);
				var a = L(n, 2), o = (e) => {
					var t = hu(), n = F(t), r = P(n), i = L(r);
					{
						let e = /* @__PURE__ */ k(() => z(A).sticky.mode ?? "scroll"), t = /* @__PURE__ */ k(() => [["scroll", Y("opt.sticky.modeScroll")], ["screen", Y("opt.sticky.modeScreen")]]);
						X(i, {
							get value() {
								return z(e);
							},
							get options() {
								return z(t);
							},
							onchange: (e) => Nt(`edit:${z(A).blockId}`, (t) => {
								t.sticky = {
									...t.sticky,
									mode: e
								};
							})
						});
					}
					E(n);
					var a = L(n, 2), o = (e) => {
						var t = mu(), n = P(t), r = L(n);
						K(r), E(t), R((e, i) => {
							J(t, "title", e), U(n, `${i ?? ""} `), q(r, z(A).sticky.offset ?? 16);
						}, [() => z(A).sticky.mode === "screen" ? Y("tip.stickyEdge") : Y("tip.stickyOffset"), () => z(A).sticky.mode === "screen" ? Y("lbl.stickyEdge") : Y("lbl.stickyOffset")]), B("change", r, (e) => Nt(`edit:${z(A).blockId}`, (t) => {
							t.sticky = {
								...t.sticky,
								offset: Math.max(0, Number(e.target.value) || 0)
							};
						})), H(e, t);
					};
					W(a, (e) => {
						(z(A).sticky.mode !== "screen" || (z(A).sticky.dock ?? "bottom-right") !== "middle-center") && e(o);
					});
					var s = L(a, 2), c = (e) => {
						var t = _l(), n = P(t), r = L(n);
						{
							let e = /* @__PURE__ */ k(() => z(A).sticky.dock ?? "bottom-right"), t = /* @__PURE__ */ k(() => At.map(([e, t]) => [e, Y(t)]));
							X(r, {
								get value() {
									return z(e);
								},
								get options() {
									return z(t);
								},
								onchange: (e) => Nt(`edit:${z(A).blockId}`, (t) => {
									t.sticky = {
										...t.sticky,
										dock: e
									};
								})
							});
						}
						E(t), R((e, r) => {
							J(t, "title", e), U(n, `${r ?? ""} `);
						}, [() => Y("tip.stickyDock"), () => Y("lbl.stickyDock")]), H(e, t);
					}, l = (e) => {
						var t = _l(), n = P(t), r = L(n);
						{
							let e = /* @__PURE__ */ k(() => z(A).sticky.until ?? ""), t = /* @__PURE__ */ k(jt);
							X(r, {
								get value() {
									return z(e);
								},
								get options() {
									return z(t);
								},
								onchange: (e) => Nt(`edit:${z(A).blockId}`, (t) => {
									t.sticky = {
										...t.sticky,
										until: e || null
									};
								})
							});
						}
						E(t), R((e, r) => {
							J(t, "title", e), U(n, `${r ?? ""} `);
						}, [() => Y("tip.stickyUntil"), () => Y("lbl.stickyUntil")]), H(e, t);
					};
					W(s, (e) => {
						z(A).sticky.mode === "screen" ? e(c) : e(l, -1);
					}), R((e, t) => {
						J(n, "title", e), U(r, `${t ?? ""} `);
					}, [() => Y("tip.stickyMode"), () => Y("lbl.stickyMode")]), H(e, t);
				};
				W(a, (e) => {
					z(A).sticky && e(o);
				}), R((e, t, a) => {
					J(n, "title", e), wi(r, t), U(i, ` ${a ?? ""}`);
				}, [
					() => Y("tip.sticky"),
					() => !!z(A).sticky,
					() => Y("lbl.sticky")
				]), B("change", r, (e) => Nt(`edit:${z(A).blockId}`, (t) => {
					t.sticky = e.target.checked ? {
						offset: 16,
						until: null
					} : null;
				})), H(e, t);
			};
			W(ie, (e) => {
				z(se) === "desktop" && e(ae);
			});
			var oe = L(ie, 4), ce = P(oe), le = I(ce, !0), ue = L(ce, 2), de = P(ue), fe = (e) => {
				var t = _u(), n = P(t), r = P(n, !0), i = L(r);
				K(i), E(n);
				var a = L(n, 2), o = P(a, !0), s = L(o);
				K(s), E(a);
				var c = L(a, 2), l = P(c, !0), u = L(l);
				K(u), E(c);
				var d = L(c, 2), f = P(d, !0), p = L(f);
				K(p), E(d);
				var m = L(d, 2), h = P(m, !0), g = L(h);
				K(g), E(m);
				var _ = L(m, 2), v = P(_, !0), y = L(v);
				K(y), E(_), E(t), R((e, t, n, a, c, d, _) => {
					U(r, e), q(i, z(A).frame.x), U(o, t), q(s, z(A).frame.y), U(l, n), q(u, z(A).frame.w), U(f, a), q(p, z(A).frame.h), J(m, "title", c), U(h, d), q(g, z(A).frame.z ?? 1), U(v, _), q(y, z(A).frame.rot ?? 0);
				}, [
					() => Y("frame.x"),
					() => Y("frame.y"),
					() => Y("frame.w"),
					() => Y("frame.h"),
					() => Y("tip.frameZ"),
					() => Y("frame.z"),
					() => Y("frame.rot")
				]), B("change", i, (e) => Vt("x", Number(e.target.value))), B("change", s, (e) => Vt("y", Number(e.target.value))), B("change", u, (e) => Vt("w", Number(e.target.value))), B("change", p, (e) => Vt("h", Number(e.target.value))), B("change", g, (e) => Vt("z", Number(e.target.value))), B("change", y, (e) => Vt("rot", Number(e.target.value))), H(e, t);
			};
			W(de, (e) => {
				z(se) === "desktop" && e(fe);
			});
			var pe = L(de, 2), me = P(pe);
			K(me);
			var he = L(me);
			E(pe);
			var ge = L(pe, 2), _e = P(ge);
			K(_e);
			var ve = L(_e);
			E(ge), E(ue), E(oe), R((e, t, n, r, i, a, o, s, c, l) => {
				J(b, "title", e), U(x, `${t ?? ""} `), J(ne, "title", n), U(w, `${r ?? ""} `), J(ce, "title", i), U(le, a), J(pe, "title", o), wi(me, z(A).hideMobile), U(he, ` ${s ?? ""}`), J(ge, "title", c), wi(_e, z(A).decor), U(ve, ` ${l ?? ""}`);
			}, [
				() => Y("tip.props.blockAnim"),
				() => Y("lbl.animIn"),
				() => Y("tip.props.blockHover"),
				() => Y("lbl.onHover"),
				() => Y("hint.placement"),
				() => Y("group.placement"),
				() => Y("tip.hideMobile"),
				() => Y("lbl.hideMobile"),
				() => Y("tip.decor"),
				() => Y("lbl.decor")
			]), B("change", me, (e) => rn(e.target.checked)), B("change", _e, (e) => Zt(e.target.checked)), H(e, t);
		};
		W(f, (e) => {
			z(Rt) === "content" ? e(p) : e(m, -1);
		}), R((e, t) => {
			o = _i(a, 1, "svelte-1n46o8q", null, o, { on: z(Rt) === "content" }), U(s, e), u = _i(l, 1, "svelte-1n46o8q", null, u, { on: z(Rt) === "style" }), U(d, t);
		}, [() => Y("props.tabContent"), () => Y("props.tabStyle")]), B("click", a, () => N(Rt, "content")), B("click", l, () => N(Rt, "style")), H(e, t);
	}, o = [
		["color", Js],
		["gradient", oc],
		["glow", sc],
		["image", Nc],
		["slideshow", Rc],
		["video", Wc],
		["grain", lc]
	], s = Object.fromEntries(o), c = {
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
		caret: "<svg width=\"9\" height=\"9\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 9l6 6 6-6\"/></svg>",
		external: "<svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M14 4h6v6\"/><path d=\"M20 4l-8 8\"/><path d=\"M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5\"/></svg>",
		device_desktop: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"2\" y=\"3\" width=\"20\" height=\"13\" rx=\"2\"/><path d=\"M8 21h8M12 16v5\"/></svg>",
		device_laptop: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"4\" y=\"4\" width=\"16\" height=\"11\" rx=\"1.5\"/><path d=\"M2 19h20\"/></svg>",
		device_tablet: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"5\" y=\"2\" width=\"14\" height=\"20\" rx=\"2\"/><path d=\"M11 18.5h2\"/></svg>",
		device_mobile: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"7\" y=\"2\" width=\"10\" height=\"20\" rx=\"2\"/><path d=\"M11 18.5h2\"/></svg>"
	}, l = [
		["purple", Y("adminTheme.purple")],
		["well", Y("adminTheme.well")],
		["gold", Y("adminTheme.gold")],
		["grey", Y("adminTheme.grey")],
		["aurora", Y("adminTheme.aurora")],
		["dusk", Y("adminTheme.dusk")],
		["ember", Y("adminTheme.ember")]
	], u = {
		lilla: "purple",
		bronn: "well",
		gull: "gold",
		graa: "grey",
		nordlys: "aurora",
		skumring: "dusk",
		glo: "ember"
	}, d = /* @__PURE__ */ M(tn((() => {
		let e = localStorage.getItem("urd-admin-theme");
		return u[e] ?? e ?? "grey";
	})()));
	Sn(() => {
		document.documentElement.dataset.adminTheme = z(d), localStorage.setItem("urd-admin-theme", z(d)), p();
	});
	function p() {
		let e = getComputedStyle(document.documentElement), t = e.getPropertyValue("--urd-color-accent").trim();
		D?.sendAdminTheme({
			bg: e.getPropertyValue("--urd-color-bg").trim(),
			surface: e.getPropertyValue("--urd-color-surface").trim(),
			accent: t,
			text: e.getPropertyValue("--urd-color-text").trim(),
			"accent-text": m(t)
		});
	}
	function m(e) {
		return Ks(e) == null || (qs(e, "#ffffff") ?? 0) >= (qs(e, "#0b0e14") ?? 0) ? "#ffffff" : "#0b0e14";
	}
	let g = /* @__PURE__ */ M(null), _ = /* @__PURE__ */ M(null), v = /* @__PURE__ */ M(!1), y = /* @__PURE__ */ M(""), b = /* @__PURE__ */ M("info"), x = 0;
	function S(e, t = "info") {
		N(y, e, !0), N(b, t, !0);
		let n = ++x;
		t === "ok" && setTimeout(() => {
			x === n && (N(y, ""), N(b, "info"));
		}, 8e3);
	}
	function C() {
		S(Y("status.storageFull"), "error");
	}
	function ee(e, t) {
		try {
			localStorage.setItem(e, t);
		} catch {
			C();
		}
	}
	let te = /* @__PURE__ */ M(null), ne = /* @__PURE__ */ M(null), w = /* @__PURE__ */ M(tn({
		size: 16,
		snap: !0
	})), re = /* @__PURE__ */ M(!0), ie = [
		{
			id: "desktop",
			width: null,
			viewport: "desktop"
		},
		{
			id: "laptop",
			width: 1280,
			viewport: "desktop"
		},
		{
			id: "tablet",
			width: 810,
			viewport: "desktop"
		},
		{
			id: "mobile",
			width: 390,
			viewport: "mobile"
		}
	], ae = /* @__PURE__ */ M("desktop"), oe = /* @__PURE__ */ k(() => ie.find((e) => e.id === z(ae)) ?? ie[0]), se = /* @__PURE__ */ k(() => z(oe).viewport), ce = /* @__PURE__ */ M(null), le = /* @__PURE__ */ M(0), ue = /* @__PURE__ */ M(0), de = /* @__PURE__ */ M(tn(typeof window < "u" ? window.innerWidth : 1280)), fe = /* @__PURE__ */ M("fit"), pe = /* @__PURE__ */ M(1), me = /* @__PURE__ */ k(() => z(fa) === "full" ? z(de) : 1920), he = /* @__PURE__ */ k(() => eo(z(fa), z(pa))), ge = /* @__PURE__ */ k(() => z(oe).width ?? z(me)), _e = /* @__PURE__ */ k(() => z(fe) === "manual" ? z(pe) : qa(z(le), z(ge), "fit"));
	function ve(e) {
		let t = Math.min(400, Math.max(10, (Math.round(Math.round(z(_e) * 100) / 10) + e) * 10));
		N(pe, t / 100), N(fe, "manual");
	}
	let ye = /* @__PURE__ */ k(() => z(_e) > 0 ? z(ue) / z(_e) : z(ue)), be = /* @__PURE__ */ k(() => z(ge) * z(_e)), xe = /* @__PURE__ */ k(() => z(ue)), Se = /* @__PURE__ */ k(() => z(be) > z(le) + 1 || z(xe) > z(ue) + 1);
	Sn(() => {
		let e = () => D?.sendCloseMenus();
		return document.addEventListener("pointerdown", e, !0), () => document.removeEventListener("pointerdown", e, !0);
	}), Sn(() => {
		let e = z(se);
		D?.sendViewport(e);
	}), Sn(() => {
		let e = z(_e);
		D?.sendZoom(e);
	}), Sn(() => {
		let e = () => {
			N(de, window.innerWidth, !0);
		};
		return window.addEventListener("resize", e), () => window.removeEventListener("resize", e);
	}), Sn(() => {
		let e = z(ce);
		if (!e || typeof ResizeObserver > "u") return;
		let t = () => {
			N(le, e.clientWidth, !0), N(ue, e.clientHeight, !0);
		};
		t();
		let n = new ResizeObserver(t);
		return n.observe(e), () => n.disconnect();
	});
	let Ce = /* @__PURE__ */ M(0);
	function we() {
		N(Ce, T?.data.sections.filter((e) => e.responsive?.mobile?.attention?.needed).length ?? 0, !0);
	}
	function Te() {
		let e = T?.data.sections.find((e) => e.responsive?.mobile?.attention?.needed);
		N(ae, "mobile"), e && setTimeout(() => D?.sendScrollSection(e.id), 0);
	}
	function Ee(e) {
		let t = T.data.sections.find((t) => t.id === e.sectionId);
		if (t) {
			Be("layout");
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
			}, Oe(t, "layout-changed"), e.sectionId === z(un) && N(fn, e.minHeight, !0), z(A)?.sectionId === e.sectionId && Et(), T.save(), Fe(), D?.sendSection(z(_), t);
		}
	}
	function De(e) {
		return e?.blocks?.some((e) => e.frames?.mobile) ?? !1;
	}
	function Oe(e, t) {
		!e || !De(e) || e.responsive?.mobile?.attention?.needed || (e.responsive = {
			...e.responsive ?? {},
			mobile: {
				...e.responsive?.mobile ?? { mode: "auto" },
				attention: {
					needed: !0,
					reason: t,
					since: (/* @__PURE__ */ new Date()).toISOString()
				}
			}
		}, we(), D?.sendAttention(e.id, !0));
	}
	let T = null, Ae = null, D = null, O = /* @__PURE__ */ M(null);
	function je() {
		N(O, Ae.data, !0), Ae.replace(z(O));
	}
	function Me() {
		D?.sendSite(Ge(z(O)));
	}
	let Ne = /* @__PURE__ */ new Set(), Pe = () => z(O).pages.find((e) => e.id === z(_));
	function Fe() {
		let e = z(O)?.pages?.some((e) => !Ne.has(e.id) && localStorage.getItem(`urd-draft-${e.id}`) !== null) ?? !1, t = ao?.hasDraft() || Object.values(oo).some((e) => e.hasDraft()), n = _o?.hasDraft() || Object.values(vo).some((e) => e.hasDraft());
		N(v, e || T?.hasDraft() && !Ne.has(z(_)) || Ae?.hasDraft() || os?.hasDraft() || t || n || !1, !0);
	}
	let Ie = [], Le = [], Re = null;
	function ze() {
		return JSON.stringify({
			pageId: z(_),
			page: T.data,
			site: Ae.data,
			collectionsIndex: lo ? ao.data : null,
			collections: lo ? Object.fromEntries(Object.entries(oo).map(([e, t]) => [e, t.data])) : {},
			templatesIndex: So ? _o.data : null,
			templates: So ? Object.fromEntries(Object.entries(vo).map(([e, t]) => [e, t.data])) : {},
			plugins: os?.data ?? null
		});
	}
	function Be(e) {
		e === Re && (e.startsWith("edit:") || e.startsWith("grid:")) || (Ie.push(ze()), Ie.length > 50 && Ie.shift(), Le.length = 0, Re = e);
	}
	function Ve(e) {
		let { pageId: t, page: n, site: r, collectionsIndex: i, collections: a, templatesIndex: o, templates: s, plugins: c } = JSON.parse(e);
		if (Ae.replace(r), je(), Ae.save(), N(w, {
			snap: !0,
			...z(O).grid
		}, !0), Me(), He(i, a ?? {}), Ue(o, s ?? {}), We(c), t && t !== z(_) && z(O).pages.some((e) => e.id === t)) {
			ee(`urd-draft-${t}`, JSON.stringify(n)), ci(t, { keepHistory: !0 }), Fe();
			return;
		}
		T.replace(n), T.save(), Fe(), we(), Et(), _n(T.data.sections.find((e) => e.id === z(un))), z(O).pages.some((e) => e.id === z(_)) ? D?.sendPage(z(_), T.data) : ci(z(O).pages[0].id, { keepHistory: !0 });
	}
	function He(e, t) {
		if (!(!ao || !e) && JSON.stringify({
			index: ao.data,
			collections: Object.fromEntries(Object.entries(oo).map(([e, t]) => [e, t.data]))
		}) !== JSON.stringify({
			index: e,
			collections: t
		})) {
			ao.replace(e), ao.save();
			for (let e of Object.keys(oo)) e in t || (localStorage.removeItem(`urd-draft-collection-${e}`), localStorage.removeItem(`urd-draft-samling-${e}`), delete oo[e]);
			for (let [e, n] of Object.entries(t)) {
				if (!oo[e]) {
					let t = co[e] ?? null;
					oo[e] = $i(`urd-draft-collection-${e}`, () => t, C, `urd-draft-samling-${e}`);
				}
				oo[e].replace(n), oo[e].save();
			}
			N(uo, [...e.samlinger ?? []], !0), z(po) && !z(uo).includes(z(po)) && N(po, null), No();
		}
	}
	function Ue(e, t) {
		if (!(!_o || !e) && JSON.stringify({
			index: _o.data,
			templates: Object.fromEntries(Object.entries(vo).map(([e, t]) => [e, t.data]))
		}) !== JSON.stringify({
			index: e,
			templates: t
		})) {
			_o.replace(e), _o.save();
			for (let e of Object.keys(vo)) e in t || (localStorage.removeItem(`urd-draft-template-${e}`), localStorage.removeItem(`urd-draft-mal-${e}`), delete vo[e]);
			for (let [e, n] of Object.entries(t)) vo[e] || (vo[e] = $i(`urd-draft-template-${e}`, () => xo[e] ?? null, C, `urd-draft-mal-${e}`)), vo[e].replace(n), vo[e].save();
			N(wo, [...e.maler ?? []], !0), Fe(), Z();
		}
	}
	function We(e) {
		!os || !e || JSON.stringify(os.data) !== JSON.stringify(e) && (os.replace(e), os.save(), xs(), js());
	}
	function Ke() {
		Ie.length && (Le.push(ze()), Ve(Ie.pop()), Re = null, S(Y("status.undone")));
	}
	function qe() {
		Le.length && (Ie.push(ze()), Ve(Le.pop()), Re = null, S(Y("status.redone")));
	}
	function Je(e) {
		z(Ot) && (e.target instanceof Element && e.target.closest(".block-menu") || N(Ot, null));
	}
	function Ze(e) {
		if (e.key === "Escape" && z(Ot)) {
			N(Ot, null);
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
			].includes(t.type)) || !z(A) || z(se) === "mobile") return;
			e.preventDefault(), D?.sendDuplicate();
			return;
		}
		if (t !== "z" && t !== "y") return;
		let n = e.target;
		n instanceof HTMLElement && (n.isContentEditable || n.tagName === "TEXTAREA" || n.tagName === "INPUT" && ![
			"number",
			"checkbox",
			"range",
			"color"
		].includes(n.type)) || (e.preventDefault(), t === "y" || e.shiftKey ? qe() : Ke());
	}
	async function Qe() {
		N(g, yo(await (await fetch("/content/site.json")).json()), !0), Ae = $i("urd-draft-site", () => z(g), C), (Ae.data.schemaVersion ?? 1) > 3 && (console.warn(`Urd: the site draft has schemaVersion ${Ae.data.schemaVersion} (the engine has 3) and is discarded`), Ae.replace(Ge(z(g)))), Ae.replace(yo(Ae.data)), Ae.save(), je(), N(w, {
			snap: !0,
			...z(O).grid
		}, !0), await ci(new URLSearchParams(location.search).get("page") ?? z(O).pages[0].id), await Ts(), await Mo(), await Do(), await Rr(), z(ne) && Br(), z(O).site.setup === !0 && !localStorage.getItem("urd-setup-done") && (N(at, z(O).site.title, !0), N(ot, z(O).theme.tokens.color.accent, !0), N(st, z(O).theme.tokens.color.bg, !0), N(it, !0));
	}
	let $e = /* @__PURE__ */ M(null);
	function et({ title: e, lines: t = [], okLabel: n = Y("confirm.ok"), cancelLabel: r = Y("confirm.cancel") }) {
		return new Promise((i) => {
			N($e, {
				title: e,
				lines: t,
				okLabel: n,
				cancelLabel: r,
				resolve: i
			}, !0);
		});
	}
	function tt({ title: e, lines: t = [], value: n = "", placeholder: r = "", okLabel: i = Y("confirm.ok"), cancelLabel: a = Y("confirm.cancel") }) {
		return new Promise((o) => {
			N($e, {
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
	function nt(e) {
		z($e)?.resolve(z($e).prompt ? e ? z($e).value : null : e), N($e, null);
	}
	let rt = !1;
	Sn(() => {
		if (!z($e)) return;
		let e = (e) => {
			e.key === "Escape" && (e.stopPropagation(), nt(!1));
		};
		return document.addEventListener("keydown", e, !0), () => document.removeEventListener("keydown", e, !0);
	});
	let it = /* @__PURE__ */ M(!1), at = /* @__PURE__ */ M(""), ot = /* @__PURE__ */ M("#7c5cff"), st = /* @__PURE__ */ M("#0b0e14");
	function ct() {
		localStorage.setItem("urd-setup-done", "1"), N(it, !1);
	}
	function lt() {
		let e = z(at).trim();
		e && (ki("setup", () => {
			z(O).site.title = e, z(O).nav.logo = {
				type: "text",
				value: e
			}, z(O).theme.tokens.color.accent = z(ot), z(O).theme.tokens.color.bg = z(st), delete z(O).site.setup;
		}), ct(), S(Y("status.setupDone"), "ok"));
	}
	let ft = /* @__PURE__ */ M(null), pt = [
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
	], mt = [
		"rail.thisPage",
		"rail.site",
		"rail.system"
	], ht = Object.fromEntries(pt.flat().map((e) => [e, Y(`panel.${e}`)])), gt = {
		pages: ["hint.pages.drafts"],
		blocks: ["hint.blocks.intro"],
		grid: ["hint.grid.intro", "hint.grid.section"],
		collections: ["hint.collections.intro"],
		plugins: ["hint.plugins.intro"],
		history: ["hint.history.intro"]
	}, _t = [
		["se", "Davvisámegiella"],
		["en-GB", "English (UK)"],
		["nb", "Norsk bokmål"],
		["nn", "Norsk nynorsk"],
		["tr", "Türkçe"]
	], vt = (e) => [...e].sort((e, t) => e[1].localeCompare(t[1]));
	function yt(e, t) {
		let n = [];
		for (let r of e) for (let e of ms[r]?.languages ?? []) e?.[t] === !0 && (typeof e.code != "string" || typeof e.name != "string" || !e.name || _t.some(([t]) => t === e.code) || n.some(([t]) => t === e.code) || n.push([e.code, e.name]));
		return n;
	}
	function bt() {
		let e = vt([..._t, ...yt(z(ys), "admin")]);
		return St === "auto" || e.some(([e]) => e === St) ? e : [[St, St], ...e];
	}
	let xt = () => yt(z(ps)?.enabled ?? [], "site"), St = localStorage.getItem("urd-admin-lang") ?? "auto";
	function Ct(e) {
		e !== St && (e === "auto" ? localStorage.removeItem("urd-admin-lang") : localStorage.setItem("urd-admin-lang", e), location.reload());
	}
	function wt(e) {
		N(ft, z(ft) === e ? null : e, !0), z(ft) === "history" && Gr(), z(ft) === "update" && !z(ei) && ni();
	}
	let A = /* @__PURE__ */ M(null);
	function Tt(e, t) {
		let n = T?.data.sections.find((t) => t.id === e);
		return {
			section: n,
			block: n?.blocks.find((e) => e.id === t)
		};
	}
	function Et() {
		if (!z(A)) return;
		let { block: e } = Tt(z(A).sectionId, z(A).blockId);
		if (!e) {
			N(A, null);
			return;
		}
		N(A, {
			sectionId: z(A).sectionId,
			blockId: z(A).blockId,
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
	function Dt(e) {
		if (N(Ot, null), !e.blockId) {
			N(A, null);
			return;
		}
		N(A, {
			sectionId: e.sectionId,
			blockId: e.blockId
		}, !0), e.sectionId && N(un, e.sectionId, !0), Et();
	}
	let Ot = /* @__PURE__ */ M(null), kt = window.matchMedia("(prefers-reduced-motion: reduce)").matches, At = [
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
	function jt() {
		let e = T?.data.sections ?? [], t = e.findIndex((e) => e.id === z(A)?.sectionId);
		return [["", Y("opt.sticky.ownSection")], ...e.slice(t + 1).map((e, n) => [e.id, Y("opt.sticky.atSection", { n: t + 2 + n })])];
	}
	function Mt(e) {
		if (Dt(e), !z(A)) return;
		let t = z(te)?.getBoundingClientRect();
		if (!t) return;
		let n = t.left + z(_e) * e.rect.right + 12;
		n + 300 > window.innerWidth - 8 && (n = Math.max(8, t.left + z(_e) * e.rect.left - 300 - 12));
		let r = window.innerHeight - Math.min(window.innerHeight * .7, 560) - 8, i = Math.min(Math.max(8, t.top + z(_e) * e.rect.top), Math.max(8, r));
		N(Ot, {
			left: n,
			top: i
		}, !0);
	}
	function Nt(e, t) {
		let { section: n, block: r } = Tt(z(A)?.sectionId, z(A)?.blockId);
		r && (e && Be(e), t(r, n), Oe(n, "block-edited"), T.save(), Fe(), D?.sendSection(z(_), n), Et());
	}
	function j(e, t) {
		Nt(`edit:${z(A).blockId}:${e}`, (n) => {
			n.props[e] = t;
		});
	}
	function Pt(e, t) {
		Nt(`edit:${z(A).blockId}:${e}`, (e) => {
			Object.assign(e.props, t);
		});
	}
	let Ft = tn({}), It = tn({}), Lt = /* @__PURE__ */ M(!1), Rt = /* @__PURE__ */ M("content"), zt = (e, t) => (Number.isFinite(t) || (t = e.min ?? 0), e.min != null && (t = Math.max(e.min, t)), e.max != null && (t = Math.min(e.max, t)), t);
	async function Bt(e) {
		let t = z(A).blockId, n = `${t}:${e.key}`, r = (Ft[n] ?? z(A).props[e.key] ?? "").trim();
		It[n] = null;
		let i = r.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
		if (!r || i || /^https?:\/\//i.test(r)) {
			Pt(e.key, {
				[e.key]: r,
				lat: i ? Number(i[1]) : null,
				lon: i ? Number(i[2]) : null
			});
			return;
		}
		N(Lt, !0), It[n] = {
			text: Y("props.place.searching"),
			err: !1
		};
		try {
			let i = await fetch(`/api/geocode?q=${encodeURIComponent(r)}`), a = await i.json().catch(() => null);
			if (z(A)?.blockId !== t) return;
			i.ok && Number.isFinite(a?.lat) ? (Pt(e.key, {
				[e.key]: r,
				lat: a.lat,
				lon: a.lon
			}), It[n] = null) : It[n] = {
				text: Gi(a) ?? Y("props.place.notFound"),
				err: !0
			};
		} catch {
			It[n] = {
				text: Y("props.place.failed"),
				err: !0
			};
		} finally {
			N(Lt, !1);
		}
	}
	function Vt(e, t) {
		Number.isFinite(t) && Nt(`edit:frame-${z(A).blockId}:${e}`, (n) => {
			n.frames.desktop = {
				...n.frames.desktop,
				[e]: t
			};
		});
	}
	function Ht(e) {
		Nt(`edit:${z(A).blockId}:boxStyle`, (t) => {
			let n = {
				...t.props.boxStyle ?? {},
				...e
			};
			for (let e of Object.keys(n)) n[e] ?? delete n[e];
			Object.keys(n).length ? t.props.boxStyle = n : delete t.props.boxStyle;
		});
	}
	function Ut(e, t) {
		Nt(`edit:${z(A).blockId}:faq${e}`, (n) => {
			n.props.items[e] = {
				...n.props.items[e],
				...t
			};
		});
	}
	function Wt() {
		Nt("faq-item", (e) => {
			(e.props.items ??= []).push({
				q: Y("seed.faq.newQ"),
				a: Y("seed.faq.answer")
			});
		});
	}
	function Gt(e) {
		Nt("faq-item", (t) => {
			t.props.items.splice(e, 1);
		});
	}
	function Kt(e, t) {
		let n = e + t;
		Nt("faq-item", (t) => {
			n < 0 || n >= t.props.items.length || ([t.props.items[e], t.props.items[n]] = [t.props.items[n], t.props.items[e]]);
		});
	}
	function qt(e, t) {
		Nt(`edit:${z(A).blockId}:tl${e}`, (n) => {
			n.props.items[e] = {
				...n.props.items[e],
				...t
			};
		});
	}
	function Jt() {
		Nt("tl-item", (e) => {
			(e.props.items ??= []).push({
				year: "",
				title: Y("seed.timeline.newTitle"),
				text: ""
			});
		});
	}
	function Yt(e) {
		Nt("tl-item", (t) => {
			t.props.items.splice(e, 1);
		});
	}
	function Xt(e, t) {
		let n = e + t;
		Nt("tl-item", (t) => {
			n < 0 || n >= t.props.items.length || ([t.props.items[e], t.props.items[n]] = [t.props.items[n], t.props.items[e]]);
		});
	}
	function Zt(e) {
		Nt("decor", (t) => {
			t.decor = e;
		});
	}
	function Qt(e, t) {
		Nt(`edit:${z(A).blockId}:table-form`, (n) => {
			let r = (Array.isArray(n.props.rows) && n.props.rows.length ? n.props.rows : [[""]]).map((e) => Array.isArray(e) ? e.map((e) => String(e ?? "")) : [""]), i = Math.max(1, ...r.map((e) => e.length));
			r = r.map((e) => [...e, ...Array(i - e.length).fill("")]), e > 0 ? r.push(Array(i).fill("")) : e < 0 && r.length > 1 && r.pop(), t > 0 ? r = r.map((e) => [...e, ""]) : t < 0 && i > 1 && (r = r.map((e) => e.slice(0, i - 1))), n.props.rows = r;
		});
	}
	function $t(e, t) {
		Nt(`edit:${z(A).blockId}:share`, (n) => {
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
	function en(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", !t) return;
		let n = new FileReader();
		n.onload = () => {
			j("src", String(n.result ?? "")), t.size > 4e5 && S(Y("status.audioLarge", { kb: Math.round(t.size / 1024) }), "error");
		}, n.onerror = () => S(Y("status.imageReadError"), "error"), n.readAsDataURL(t);
	}
	function rn(e) {
		let { section: t, block: n } = Tt(z(A)?.sectionId, z(A)?.blockId);
		n && (Be("hide-mobile"), n.hideMobile = e, T.save(), Fe(), D?.sendSection(z(_), t), Et());
	}
	async function an(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", t) try {
			let e = await Xn(t);
			Nt(`edit:${z(A).blockId}`, (n) => {
				n.props.src = e.dataUrl, n.props.alt = n.props.alt || Ca(t.name).replaceAll("-", " ");
			});
		} catch {
			S(Y("status.imageReadError"), "error");
		}
	}
	async function on(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", t) try {
			let e = await Xn(t);
			Nt(`edit:${z(A).blockId}`, (t) => {
				t.props.image = e.dataUrl;
			});
		} catch {
			S(Y("status.imageReadError"), "error");
		}
	}
	let sn = {
		text: Y("blocks.text"),
		button: Y("blocks.button"),
		image: Y("blocks.image"),
		shape: Y("blocks.shape"),
		video: Y("blocks.video"),
		icon: Y("blocks.icon"),
		gallery: Y("blocks.gallery"),
		faq: Y("blocks.faq"),
		collection: Y("blocks.collection"),
		timeline: Y("blocks.timeline"),
		quote: Y("blocks.quote"),
		stats: Y("blocks.stats"),
		table: Y("blocks.table"),
		share: Y("blocks.share"),
		countdown: Y("blocks.countdown"),
		audio: Y("blocks.audio"),
		product: Y("blocks.product"),
		cart: Y("blocks.cart"),
		checkout: Y("blocks.checkout")
	}, cn = [
		["line", Y("shape.line")],
		["arrow", Y("shape.arrow")],
		["circle", Y("shape.circle")],
		["rect", Y("shape.rect")],
		["triangle", Y("shape.triangle")]
	], ln = [
		["accent", Y("color.accent")],
		["text", Y("color.text")],
		["surface", Y("color.surface")],
		["bg", Y("color.bg")]
	], un = /* @__PURE__ */ M(null), dn = /* @__PURE__ */ M(null), fn = /* @__PURE__ */ M(""), pn = /* @__PURE__ */ M(tn([])), mn = /* @__PURE__ */ M(null), hn = /* @__PURE__ */ M(null), gn = /* @__PURE__ */ M("");
	function _n(e) {
		N(dn, e?.grid ? { ...e.grid } : null, !0), N(fn, e?.size?.minHeight ?? "", !0), N(pn, JSON.parse(JSON.stringify(e?.background?.layers ?? [])), !0), N(mn, e?.animation ? JSON.parse(JSON.stringify(e.animation)) : null, !0), N(hn, e?.hover ? JSON.parse(JSON.stringify(e.hover)) : null, !0), N(gn, e?.theme ?? "", !0);
	}
	let vn = /* @__PURE__ */ M(null), yn = tn({});
	function bn() {
		try {
			let e = ((z(te)?.contentDocument)?.querySelector(`.urd-section[data-section-id="${z(un)}"]`))?.getBoundingClientRect();
			N(vn, e && e.width ? {
				w: e.width,
				h: e.height
			} : null, !0);
		} catch {
			N(vn, null);
		}
	}
	Sn(() => {
		z(un), z(pn), requestAnimationFrame(() => requestAnimationFrame(bn));
	}), Sn(() => {
		let e = z(te);
		if (!e || typeof ResizeObserver > "u") return;
		let t = new ResizeObserver(() => bn());
		return t.observe(e), () => t.disconnect();
	}), Sn(() => {
		for (let e of z(pn)) {
			let t = e?.props?.src;
			if (e?.type === "image" && t && !yn[t]) {
				let e = new Image();
				e.onload = () => {
					yn[t] = {
						w: e.naturalWidth,
						h: e.naturalHeight
					};
				}, e.src = t;
			}
		}
	});
	function xn(e) {
		Tn("section-theme", (t) => {
			e ? t.theme = e : delete t.theme;
		});
	}
	function Cn(e) {
		let t = z(ur), n = (e) => e.replaceAll("var(--urd-base-bg)", t.bg).replaceAll("var(--urd-base-surface)", t.surface).replaceAll("var(--urd-base-text)", t.text).replaceAll("var(--urd-base-accent)", t.accent).replaceAll("var(--urd-base-accent-text)", t["accent-text"]), r = Gs(e);
		return {
			bg: r["--urd-color-bg"] ? n(r["--urd-color-bg"]) : t.bg,
			surface: r["--urd-color-surface"] ? n(r["--urd-color-surface"]) : t.surface,
			text: r["--urd-color-text"] ? n(r["--urd-color-text"]) : t.text,
			accent: r["--urd-color-accent"] ? n(r["--urd-color-accent"]) : t.accent
		};
	}
	function wn(e) {
		N(un, e.sectionId, !0), _n(T?.data.sections.find((t) => t.id === e.sectionId));
	}
	function Tn(e, t) {
		let n = T.data.sections.find((e) => e.id === z(un));
		n && (Be(e), t(n), T.save(), Fe(), D?.sendSection(z(_), n), _n(n));
	}
	let En = /* @__PURE__ */ M("color");
	function Dn(e, t) {
		e.mutate(e.keyPrefix, (e) => {
			e.background ??= {
				version: 1,
				layers: []
			}, e.background.layers.push({
				type: t,
				version: s[t].version ?? 1,
				props: s[t].defaults()
			});
		});
	}
	function On(e, t) {
		e.mutate(e.keyPrefix, (e) => {
			e.background.layers.splice(t, 1), e.background.layers.length || delete e.background;
		});
	}
	function kn(e, t, n) {
		let r = t + n;
		e.mutate(e.keyPrefix, (e) => {
			let n = e.background.layers;
			r < 0 || r >= n.length || ([n[t], n[r]] = [n[r], n[t]]);
		});
	}
	function An(e, t, n, r) {
		e.mutate(`edit:${e.keyPrefix}-${e.keyId}-${t}-${n}`, (e) => {
			e.background.layers[t].props[n] = r;
		});
	}
	function jn(e, t, n, r = "xy") {
		e.preventDefault();
		let i = e.currentTarget;
		i.setPointerCapture?.(e.pointerId);
		let a = (e) => {
			let a = i.getBoundingClientRect();
			if (r.includes("x")) {
				let r = Math.min(1, Math.max(0, (e.clientX - a.left) / a.width));
				An(t, n, "x", Math.round(r * 100) / 100);
			}
			if (r.includes("y")) {
				let r = Math.min(1, Math.max(0, (e.clientY - a.top) / a.height));
				An(t, n, "y", Math.round(r * 100) / 100);
			}
		};
		a(e);
		let o = () => {
			i.removeEventListener("pointermove", a), i.removeEventListener("pointerup", o), i.removeEventListener("pointercancel", o);
		};
		i.addEventListener("pointermove", a), i.addEventListener("pointerup", o), i.addEventListener("pointercancel", o);
	}
	let Mn = (e) => Math.min(4, Math.max(.1, e));
	function Nn(e, t, n, r) {
		An(e, t, "size", Mn(Math.round((n + r) * 100) / 100));
	}
	function Pn(e, t, n) {
		let r = Number(n);
		Number.isFinite(r) && An(e, t, "size", Mn(r / 100));
	}
	function Fn(e, t, n, r) {
		let i = yn[n.props.src];
		if (!i?.w || !i?.h || !z(vn)?.w || !z(vn)?.h) return;
		let a = z(vn).h * i.w / (z(vn).w * i.h), o = r === "cover" ? Math.max(1, a) : Math.min(1, a);
		(n.props.fit === "tile" || n.props.fit === "repeat") && An(e, t, "fit", "plain"), An(e, t, "size", Mn(Math.round(o * 100) / 100));
	}
	function In(e) {
		return e.props;
	}
	function Ln(e, t, n, r) {
		e.mutate(n, (e) => {
			r(e.background.layers[t].props);
		});
	}
	function Rn(e, t, n, r) {
		Ln(e, t, `edit:${e.keyPrefix}-${e.keyId}-${t}-${n}`, (e) => {
			e[n] = r;
		});
	}
	let zn = {
		linear: [
			["none", Y("common.none")],
			["pan", Y("opt.gradAnim.pan")],
			["pan-loop", Y("opt.gradAnim.panLoop")],
			["rotate", Y("opt.gradAnim.rotate")]
		],
		radial: [
			["none", Y("common.none")],
			["pulse", Y("opt.gradAnim.pulse")],
			["orbit", Y("opt.gradAnim.orbit")]
		]
	};
	function Bn(e, t, n) {
		Ln(e, t, e.keyPrefix, (e) => {
			e.kind = n, zn[n].some(([t]) => t === (e.animation ?? "none")) || (e.animation = "none");
		});
	}
	function Vn(e, t, n, r) {
		Ln(e, t, `edit:${e.keyPrefix}-${e.keyId}-${t}-stop${n}`, (e) => {
			e.stops[n] = {
				...e.stops[n],
				...r
			};
		});
	}
	function Hn(e, t) {
		Ln(e, t, e.keyPrefix, (e) => {
			let t = Math.round(e.stops.reduce((e, t) => e + (Number(t.share) || 0), 0) / e.stops.length) || 50;
			e.stops.push({
				color: e.stops[e.stops.length - 1]?.color ?? "#ffffff",
				share: t
			});
		});
	}
	function Un(e, t, n) {
		Ln(e, t, e.keyPrefix, (e) => {
			e.stops.length > 2 && e.stops.splice(n, 1);
		});
	}
	function Wn(e, t, n, r) {
		Ln(e, t, e.keyPrefix, (e) => {
			let [t] = e.stops.splice(n, 1);
			e.stops.splice(r, 0, t);
		});
	}
	let Gn = /* @__PURE__ */ M(null);
	function Kn(e, t, n, r) {
		if (t.button !== 0) return;
		t.preventDefault();
		let i = t.currentTarget.closest(".bg-layer"), a = t.currentTarget.closest(".grad-stop");
		N(Gn, {
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
			N(Gn, {
				...z(Gn),
				insert: n
			}, !0);
		}, u = () => {
			window.removeEventListener("pointermove", l), window.removeEventListener("pointerup", u), c.remove();
			let t = z(Gn);
			if (N(Gn, null), !t) return;
			let n = t.insert > t.from ? t.insert - 1 : t.insert;
			n !== t.from && Wn(e, t.layer, t.from, n);
		};
		window.addEventListener("pointermove", l), window.addEventListener("pointerup", u);
	}
	function qn(e, t, n) {
		e.mutate(e.keyPrefix, (e) => {
			e.background.layers[t].type !== n && (e.background.layers[t] = {
				type: n,
				version: s[n].version ?? 1,
				props: s[n].defaults()
			});
		});
	}
	async function Jn(e, t) {
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
	async function Yn(e) {
		let t = await e.text(), n = ya(t), r = xa(t);
		if (!r) return n;
		let i = await Jn(n.dataUrl, r);
		if (!i) return n;
		let a = ba(t, i);
		if (a === t) return n;
		try {
			return ya(a);
		} catch {
			return n;
		}
	}
	async function Xn(e) {
		return e.type === "image/svg+xml" || /\.svg$/i.test(e.name || "") ? Yn(e) : ga(e);
	}
	async function Zn(e, t, n) {
		let r = n.target.files?.[0];
		if (n.target.value = "", r) try {
			An(e, t, "src", (await Xn(r)).dataUrl);
		} catch {
			S(Y("status.imageReadError"), "error");
		}
	}
	function Qn(e, t, n) {
		let r = n.target.files?.[0];
		if (n.target.value = "", !r) return;
		if (!["video/mp4", "video/webm"].includes(r.type)) {
			S(Y("status.videoFormat"), "error");
			return;
		}
		if (r.size > 15e6) {
			S(Y("status.videoTooLarge", {
				mb: (r.size / 1e6).toFixed(1),
				max: Math.round(ha / 1e6)
			}), "error");
			return;
		}
		let i = new FileReader();
		i.onload = () => {
			An(e, t, "src", String(i.result ?? "")), r.size > 4e6 && S(Y("status.videoLarge", { mb: (r.size / 1e6).toFixed(1) }), "error");
		}, i.onerror = () => S(Y("status.imageReadError"), "error"), i.readAsDataURL(r);
	}
	async function $n(e, t, n) {
		let r = n.target.files?.[0];
		if (n.target.value = "", r) try {
			An(e, t, "poster", (await Xn(r)).dataUrl);
		} catch {
			S(Y("status.imageReadError"), "error");
		}
	}
	async function er(e, t, n) {
		let r = [...n.target.files ?? []];
		if (n.target.value = "", !r.length) return;
		S(Y("status.compressingImages"));
		let { images: i, failed: a, big: o } = await _p(r);
		i.length && e.mutate(e.keyPrefix, (e) => {
			let n = e.background.layers[t].props;
			n.images ??= [], n.images.push(...i.map(({ src: e }) => ({
				src: e,
				x: .5,
				y: .5
			})));
		}), vp(i.length, a, o);
	}
	function tr(e, t, n, r) {
		e.mutate(e.keyPrefix, (e) => {
			let i = e.background.layers[t].props.images, a = n + r;
			a < 0 || a >= i.length || ([i[n], i[a]] = [i[a], i[n]]);
		});
	}
	function nr(e, t, n) {
		e.mutate(e.keyPrefix, (e) => {
			e.background.layers[t].props.images.splice(n, 1);
		});
	}
	function rr(e, t, n, r, i) {
		e.mutate(`edit:${e.keyPrefix}g-${e.keyId}-${t}-${n}-${r}`, (e) => {
			e.background.layers[t].props.images[n][r] = i;
		});
	}
	function ir(e, t) {
		ki(e, () => {
			z(O).nav.style ??= {}, t(z(O).nav.style);
		});
	}
	let ar = /* @__PURE__ */ k(() => ({
		mutate: Tn,
		keyPrefix: "bg",
		keyId: z(un)
	})), or = {
		mutate: ir,
		keyPrefix: "navbg",
		keyId: "nav"
	}, sr = {
		mutate: Hs,
		keyPrefix: "footerbg",
		keyId: "footer"
	}, cr = () => {
		let e = null;
		try {
			e = localStorage.getItem("urd-theme-mode");
		} catch {}
		return Ls(z(O)?.theme?.scheme, e, window.matchMedia("(prefers-color-scheme: dark)").matches);
	}, lr = /* @__PURE__ */ M("light");
	Sn(() => {
		N(lr, cr(), !0);
		let e = window.matchMedia("(prefers-color-scheme: dark)"), t = (e) => {
			e instanceof StorageEvent && e.key && e.key !== "urd-theme-mode" || N(lr, cr(), !0);
		};
		return e.addEventListener("change", t), window.addEventListener("storage", t), () => {
			e.removeEventListener("change", t), window.removeEventListener("storage", t);
		};
	});
	let ur = /* @__PURE__ */ k(() => z(O)?.theme ? Rs(z(O).theme, z(lr)).color ?? {} : {}), dr = () => Object.entries(z(ur)), fr = [
		[
			"bg",
			Y("palette.bg"),
			Y("palette.bgShort")
		],
		[
			"surface",
			Y("palette.surface"),
			Y("palette.surfaceShort")
		],
		[
			"text",
			Y("palette.text"),
			Y("palette.textShort")
		],
		[
			"accent",
			Y("palette.accent"),
			Y("palette.accentShort")
		],
		[
			"accent-text",
			Y("palette.accentText"),
			Y("palette.accentTextShort")
		]
	], pr = /* @__PURE__ */ k(() => !!z(O)?.theme.alt), mr = /* @__PURE__ */ k(() => z(O)?.theme.alt?.auto === !0), hr = /* @__PURE__ */ k(() => z(O)?.theme.scheme === "dark" ? "dark" : "light"), gr = /* @__PURE__ */ k(() => z(O)?.theme.tokens.color ?? {}), _r = /* @__PURE__ */ k(() => ({
		...z(O)?.theme.tokens.color ?? {},
		...z(O)?.theme.alt?.tokens?.color ?? {}
	}));
	function vr(e) {
		return {
			type: e,
			version: Yc[e].version,
			props: Yc[e].defaults()
		};
	}
	let yr = (e) => !!(e && Yc[e.type]?.entrance), br = [["", Y("common.none")], ...Object.entries(Yc).filter(([, e]) => e.entrance).map(([e, t]) => [e, t.labelKey ? Y(t.labelKey) : t.label])], xr = br.filter(([e]) => !Yc[e]?.group), Sr = [["", Y("common.none")], ...Object.entries(Yc).filter(([, e]) => !e.entrance).map(([e, t]) => [e, t.labelKey ? Y(t.labelKey) : t.label])];
	function wr(e) {
		e.animation && !yr(e.animation) && (e.hover ??= e.animation, e.animation = null);
	}
	function Er(e) {
		Nt(`edit:anim-${z(A).blockId}`, (t) => {
			wr(t), t.animation = e ? vr(e) : null;
		}), z(A) && D?.sendDemoAnim(z(A).sectionId, z(A).blockId);
	}
	function Dr(e) {
		Nt(`edit:hover-${z(A).blockId}`, (t) => {
			wr(t), t.hover = e ? vr(e) : null;
		});
	}
	function Or(e, t) {
		Number.isFinite(t) && (Nt(`edit:anim-${z(A).blockId}:${e}`, (n) => {
			n.animation && (n.animation.props[e] = t);
		}), z(A) && D?.sendDemoAnim(z(A).sectionId, z(A).blockId));
	}
	function kr(e) {
		Tn("section-anim", (t) => {
			wr(t), t.animation = e ? vr(e) : null;
		}), D?.sendDemoAnim(z(un));
	}
	function Ar(e) {
		Tn("section-hover", (t) => {
			wr(t), t.hover = e ? vr(e) : null;
		});
	}
	function jr(e, t) {
		Number.isFinite(t) && (Tn("edit:section-anim", (n) => {
			n.animation && (n.animation.props[e] = t);
		}), D?.sendDemoAnim(z(un)));
	}
	function Mr(e, t) {
		Tn("edit:section-anim", (n) => {
			n.animation && (n.animation.props[e] = t);
		}), D?.sendDemoAnim(z(un));
	}
	function Nr(e) {
		let t = T.data.sections.find((e) => e.id === z(un));
		if (!t) return;
		let n = e.trim();
		if (!n) return;
		let r = /^\d+$/.test(n) ? `${n}px` : n;
		Be("section-size"), t.size = {
			...t.size,
			minHeight: r
		}, N(fn, r, !0), T.save(), Fe(), D?.sendSection(z(_), t);
	}
	function V() {
		return T.data.sections.find((e) => e.id === z(un)) ?? T.data.sections[0];
	}
	function Pr(e) {
		let t = T.data.sections.find((e) => e.id === z(un));
		t && (Be("grid:section"), t.grid = e ? { ...Ae.data.grid } : null, N(dn, t.grid ? { ...t.grid } : null, !0), T.save(), Fe(), D?.sendSection(z(_), t), z(Ti) && D?.sendShowGrid(!0));
	}
	function Ir(e, t) {
		let n = T.data.sections.find((e) => e.id === z(un));
		n?.grid && (Be("grid:section"), n.grid = {
			...n.grid,
			[e]: t
		}, N(dn, { ...n.grid }, !0), T.save(), Fe(), D?.sendSection(z(_), n), z(Ti) && D?.sendShowGrid(!0));
	}
	function Lr(e, t) {
		Be("grid:site"), N(w, {
			...z(w),
			[e]: t
		}, !0), Ae.data.grid = {
			...Ae.data.grid,
			[e]: t
		}, Ae.save(), Fe(), Me(), z(Ti) && D?.sendShowGrid(!0);
	}
	async function Rr() {
		try {
			let e = await fetch("/api/github/me");
			e.ok ? N(ne, await e.json(), !0) : e.status !== 503 && N(ne, null);
		} catch {
			N(ne, null);
		}
	}
	let zr = null;
	async function Br() {
		try {
			let e = await fetch("/api/github/latest");
			e.ok && (zr = (await e.json()).head ?? null);
		} catch {}
	}
	async function Vr(e) {
		if (!zr) return await Br(), {
			ok: await et({
				title: Y("confirm.conflictUnknown.title"),
				lines: [Y("confirm.conflictUnknown.body"), Y("confirm.conflictUnknown.warning")],
				okLabel: Y("confirm.publishAnyway"),
				cancelLabel: Y("confirm.cancel")
			}),
			head: zr
		};
		let t = null;
		try {
			let e = await fetch(`/api/github/latest?base=${zr}`);
			e.ok && (t = await e.json().catch(() => null));
		} catch {}
		if (!t?.head) return {
			ok: !0,
			head: null
		};
		let n = t.head;
		if (n === zr) return {
			ok: !0,
			head: n
		};
		let r = new Set(e.map((e) => e.path)), i = t.truncated ? [Y("confirm.conflict.truncated")] : (t.changedFiles ?? []).filter((e) => r.has(e));
		return i.length === 0 ? {
			ok: !0,
			head: n
		} : {
			ok: await et({
				title: Y("confirm.conflict.title"),
				lines: [
					Y("confirm.conflict.intro"),
					...i.map((e) => `• ${e}`),
					Y("confirm.conflict.warning")
				],
				okLabel: Y("confirm.publishAnyway"),
				cancelLabel: Y("confirm.cancel")
			}),
			head: n
		};
	}
	let Hr = /* @__PURE__ */ M(null), Ur = /* @__PURE__ */ M(""), Wr = /* @__PURE__ */ M(!1);
	async function Gr() {
		N(Ur, "");
		try {
			let e = await fetch("/api/github/history");
			e.ok ? N(Hr, (await e.json()).commits, !0) : e.status === 401 ? (N(Hr, [], !0), N(Ur, Y("status.historyLoginRequired"), !0)) : (N(Hr, [], !0), N(Ur, Gi(await e.json().catch(() => null)) ?? Y("status.historyFetchFailed"), !0));
		} catch {
			N(Hr, [], !0), N(Ur, Y("status.historyUnavailable"), !0);
		}
	}
	let qr = (() => {
		let e = {
			dateStyle: "short",
			timeStyle: "short"
		};
		try {
			return new Intl.DateTimeFormat(Ki(), e);
		} catch {
			return new Intl.DateTimeFormat(void 0, e);
		}
	})(), Jr = !1;
	async function Yr() {
		let e = z(Hr)?.[0];
		if (!(!e || z(Wr)) && await et({
			title: Y("confirm.revert.title"),
			lines: [`«${e.message}»`, Y("confirm.revert.body")],
			okLabel: Y("confirm.revert.ok"),
			cancelLabel: Y("confirm.cancel")
		})) {
			N(Wr, !0), S(Y("status.reverting"));
			try {
				let t = await fetch("/api/github/revert", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ expect: e.sha })
				});
				if (t.ok) {
					let { sha: e } = await t.json().catch(() => ({}));
					e ? zr = e : Br(), Jr = !0, S(Y("status.revertDone"), "ok"), Zr();
				} else t.status === 409 ? S(Y("status.revertConflict"), "error") : S(Gi(await t.json().catch(() => null)) ?? Y("status.revertFailed"), "error");
			} catch {
				S(Y("status.publishLayerUnreachable"), "error");
			}
			N(Wr, !1), Gr();
		}
	}
	async function Zr() {
		let e = ["/content/site.json", ...z(O).pages.map((e) => `/${e.file}`)], t = async () => {
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
				S(Y("status.revertDeployed"), "ok");
				for (let e of Object.keys(localStorage).filter((e) => e.startsWith("urd-draft-"))) localStorage.removeItem(e);
				await new Promise((e) => setTimeout(e, 800)), location.reload();
				return;
			}
		}
		S(Y("status.revertDeployTimeout"), "error");
	}
	let Qr = /* @__PURE__ */ M(null), $r = /* @__PURE__ */ M(null), ei = /* @__PURE__ */ M(!1), ti = /* @__PURE__ */ M(tn(/* @__PURE__ */ new Set()));
	async function ni() {
		N(ei, !0), N($r, null), N(Qr, null);
		try {
			let e = await fetch("/api/github/update"), t = await e.json().catch(() => null);
			e.ok ? (N(Qr, t, !0), N(ti, /* @__PURE__ */ new Set(), !0)) : N($r, Gi(t) ?? Y("update.checkFailed"), !0);
		} catch {
			N($r, Y("status.publishLayerUnreachable"), !0);
		}
		N(ei, !1);
	}
	function ri(e) {
		let t = new Set(z(ti));
		t.has(e) ? t.delete(e) : t.add(e), N(ti, t, !0);
	}
	async function ii() {
		if (!z(Qr) || z(Qr).upToDate || z(ei)) return;
		let e = [...z(ti)], t = z(Qr).changes.filter((e) => !z(ti).has(e.path)), n = t.filter((e) => e.atom && e.conflict);
		if (await et({
			title: Y("confirm.update.title"),
			lines: [Y("confirm.update.body", {
				target: z(Qr).target,
				writes: t.filter((e) => e.action === "write").length,
				deletes: t.filter((e) => e.action === "delete").length
			}), ...n.length > 0 ? [Y("confirm.update.warnEdited", { paths: n.map((e) => e.path).join(", ") })] : []],
			okLabel: Y("confirm.update.ok"),
			cancelLabel: Y("confirm.cancel")
		})) {
			N(ei, !0), S(Y("update.running", { target: z(Qr).target }));
			try {
				let t = await fetch("/api/github/update", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({
						to: z(Qr).target,
						expect: z(Qr).head,
						skip: e
					})
				}), n = await t.json().catch(() => null);
				t.ok ? (S(Y("update.committed", { target: z(Qr).target }), "ok"), await ai(z(Qr).target.replace(/^v/, ""))) : t.status === 409 ? (S(Gi(n) ?? Y("update.checkFailed"), "error"), await ni()) : S(Gi(n) ?? Y("update.failed"), "error");
			} catch {
				S(Y("status.publishLayerUnreachable"), "error");
			}
			N(ei, !1);
		}
	}
	async function ai(e) {
		for (let t = 0; t < 18; t++) {
			await new Promise((e) => setTimeout(e, 1e4));
			try {
				if ((await (await fetch("/urd.json", { cache: "no-store" })).json())?.engine === e) {
					S(Y("update.deployed"), "ok"), await new Promise((e) => setTimeout(e, 800)), location.reload();
					return;
				}
			} catch {}
		}
		S(Y("update.deployTimeout"), "error");
	}
	let oi = null;
	function si(e) {
		return {
			schemaVersion: 4,
			meta: {
				id: e.id,
				title: e.title
			},
			sections: [{
				id: Eo("sec"),
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
	async function ci(e, { keepHistory: t = !1 } = {}) {
		N(_, e, !0), oi = (async () => {
			let n = Pe(), r = null;
			try {
				let e = await fetch(`/${n.file}`);
				e.ok && (r = bo(await e.json(), Ae.data));
			} catch {}
			r ? Ne.delete(e) : r = si(n), T = $i(`urd-draft-${e}`, () => r, C), (T.data.schemaVersion ?? 1) > 4 && (console.warn(`Urd: the draft for '${e}' has schemaVersion ${T.data.schemaVersion} (the engine has 4) and is discarded`), T.replace(structuredClone(r))), T.replace(bo(T.data, Ae.data)), T.save(), t || (Re = null), N(un, null), N(dn, null), Fe(), Hi(), we(), N(y, "");
		})(), await oi;
	}
	function li() {
		D?.destroy(), z(te)?.contentDocument?.addEventListener("pointerdown", () => {
			z(Ot) && N(Ot, null);
		}, !0), D = Ga(z(te), {
			onEdit: Gf,
			onMove: Kf,
			onGrow: qf,
			onDelete: rp,
			onAddSection: Qf,
			onMoveSection: $f,
			onDeleteSection: ep,
			onSectionSize: tp,
			onUndo: (e) => e.redo ? qe() : Ke(),
			onSelectSection: wn,
			onSelectBlock: Dt,
			onBlockMenu: Mt,
			onReady: di,
			onNavigate: Di,
			onAddBlock: (e) => sp(e.sectionId, e.block),
			onAddBlocks: (e) => cp(e.sectionId, e.blocks, e.minBottom, e.moves),
			onRequestBlock: hp,
			onMoveBlockSection: np,
			onMobileReset: Jf,
			onMobileOrder: Yf,
			onReviewDone: Xf,
			onBlockFlag: Zf,
			onCollectionEdit: Ro,
			onCollectionAdd: Io,
			onSaveTemplate: Q,
			onStickyGroup: ko,
			onStickyDock: Oo,
			onDeleteTemplate: jo,
			onApplyLayout: Ee,
			onPluginBlocks: (e) => {
				N(up, e.blocks ?? [], !0);
			},
			onNavWidth: (e) => ki("edit:nav-width", () => {
				z(O).nav.style ??= {}, z(O).nav.style.width = e.width;
			})
		});
	}
	async function di() {
		await oi, await fs, D?.sendPlugins(Ge(z(ps))?.enabled ?? []), D?.sendViewport(z(se)), D?.sendZoom(z(_e)), Po(), Z(), Ae.hasDraft() && Me();
		let e = !z(g).pages.some((e) => e.id === z(_));
		(T.hasDraft() || e) && D?.sendPage(z(_), T.data), z(re) || D?.sendChrome(!1), z(Ti) && D?.sendShowGrid(!0), z(fi) && D?.sendShowGuides(!0), p();
	}
	let fi = /* @__PURE__ */ M(localStorage.getItem("urd-guides") === "1"), pi = /* @__PURE__ */ M(!1), mi = /* @__PURE__ */ M(tn(localStorage.getItem("urd-layout-picker") === "menu" ? "menu" : "strip"));
	function hi(e) {
		N(mi, e === "menu" ? "menu" : "strip", !0), z(mi) === "menu" ? localStorage.setItem("urd-layout-picker", "menu") : localStorage.removeItem("urd-layout-picker");
	}
	let gi = /* @__PURE__ */ M(null);
	Sn(() => {
		if (!z(pi)) return;
		let e = (e) => {
			z(gi)?.contains(e.target) || N(pi, !1);
		}, t = (e) => {
			e.key === "Escape" && N(pi, !1);
		}, n = () => {
			N(pi, !1);
		};
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t), window.addEventListener("blur", n), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t), window.removeEventListener("blur", n);
		};
	});
	let vi = {
		view: 1079,
		device: 999,
		zoom: 919
	}, bi = /* @__PURE__ */ M(null), xi = /* @__PURE__ */ M(null), Si = tn({
		view: !1,
		device: !1,
		zoom: !1
	});
	Sn(() => {
		let e = Object.entries(vi).map(([e, t]) => {
			let n = window.matchMedia(`(max-width: ${t}px)`), r = () => {
				Si[e] = n.matches;
			};
			return r(), n.addEventListener("change", r), () => n.removeEventListener("change", r);
		});
		return () => e.forEach((e) => e());
	}), Sn(() => {
		z(bi) && !Si[z(bi)] && N(bi, null);
	}), Sn(() => {
		if (!z(bi)) return;
		let e = (e) => {
			z(xi)?.contains(e.target) || N(bi, null);
		}, t = (e) => {
			e.key === "Escape" && N(bi, null);
		}, n = () => {
			N(bi, null);
		};
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t), window.addEventListener("blur", n), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t), window.removeEventListener("blur", n);
		};
	});
	function Ci() {
		N(fi, !z(fi)), localStorage.setItem("urd-guides", z(fi) ? "1" : "0"), D?.sendShowGuides(z(fi));
	}
	let Ti = /* @__PURE__ */ M(localStorage.getItem("urd-grid-overlay") === "1");
	function Ei() {
		N(Ti, !z(Ti)), localStorage.setItem("urd-grid-overlay", z(Ti) ? "1" : "0"), D?.sendShowGrid(z(Ti));
	}
	function Di(e) {
		let t = e.path.replace(/\/$/, "") || "/", n = z(O).pages.find((e) => e.path === t);
		n && n.id !== z(_) && ci(n.id);
	}
	function ki(e, t) {
		Be(e), t(), Ae.save(), Fe(), Me();
	}
	let Ai = /* @__PURE__ */ M(""), ji = /* @__PURE__ */ M(null), Ni = Object.fromEntries(Ms.map((e) => [e.id, As(Ns(e.id, {
		pageId: "preview",
		title: ""
	}))])), Pi = /* @__PURE__ */ k(() => {
		let e = z(O)?.theme?.tokens?.color ?? {};
		return [
			"bg",
			"surface",
			"text",
			"accent"
		].filter((t) => typeof e[t] == "string" && Bs(e[t])).map((t) => `--urd-color-${t}: ${e[t]};`).join(" ");
	}), Fi = /* @__PURE__ */ M(null);
	Sn(() => {
		if (!z(Fi)) return;
		let e = (e) => {
			e.target.closest?.(".page-menu-wrap") || N(Fi, null);
		}, t = (e) => {
			e.key === "Escape" && N(Fi, null);
		}, n = () => {
			N(Fi, null);
		};
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t), window.addEventListener("blur", n), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t), window.removeEventListener("blur", n);
		};
	});
	let Ii = [
		"admin",
		"api",
		"assets",
		"content",
		"media",
		"plugins",
		"functions",
		"readme"
	];
	function Li(e, t = null) {
		return e ? Ii.includes(e) ? Y("error.reservedName", { slug: e }) : z(O).pages.some((n) => n.id !== t && (n.path === `/${e}` || n.id === e)) ? Y("error.pageExists") : null : Y("error.pageNeedsName");
	}
	function Ri() {
		let e = z(Ai).trim(), t = Ca(e), n = Li(t);
		if (n) {
			S(n, "error");
			return;
		}
		let r = z(ji) && !z(ji).startsWith("preset:") ? vo[z(ji)]?.data?.page : null, i = z(ji)?.startsWith("preset:") ? Ns(z(ji).slice(7), {
			pageId: t,
			title: e
		}) ?? si({
			id: t,
			title: e
		}) : r ? Qo(bo(JSON.parse(JSON.stringify(r)), Ae.data), Eo, {
			id: t,
			title: e
		}) : si({
			id: t,
			title: e
		});
		ki("pages", () => {
			z(O).pages.push({
				id: t,
				title: e,
				path: `/${t}`,
				file: `content/pages/${t}.json`
			}), z(O).nav.items.push({
				label: e,
				page: t
			});
		}), ee(`urd-draft-${t}`, JSON.stringify(i)), Fe(), N(Ai, ""), N(ji, null), ci(t);
	}
	async function zi(e) {
		N(Fi, null), await Ao("page", e.id === z(_) ? JSON.parse(JSON.stringify(T.data)) : await Xi(e));
	}
	function Bi(e, t) {
		let n = t.trim();
		if (!n || n === e.title) return;
		let r = e.title;
		ki("pages", () => {
			e.title = n;
			for (let t of z(O).nav.items) t.page === e.id && t.label === r && (t.label = n);
		}), e.id === z(_) ? (T.data.meta.title = n, T.save(), Fe(), D?.sendPage(z(_), T.data)) : Zi(e, (e) => {
			e.meta.title = n;
		});
	}
	let Vi = /* @__PURE__ */ M(tn({
		description: "",
		ogTitle: "",
		ogDescription: "",
		ogImage: ""
	}));
	function Hi() {
		let e = T?.data?.meta ?? {};
		N(Vi, {
			description: e.description ?? "",
			ogTitle: e.og?.title ?? "",
			ogDescription: e.og?.description ?? "",
			ogImage: e.og?.image ?? ""
		}, !0);
	}
	function Ui(e, t) {
		let n = String(t ?? "").trim();
		if (e === "description") n ? T.data.meta.description = n : delete T.data.meta.description;
		else {
			let t = {
				ogTitle: "title",
				ogDescription: "description",
				ogImage: "image"
			}[e], r = { ...T.data.meta.og ?? {} };
			n ? r[t] = n : delete r[t], Object.keys(r).length ? T.data.meta.og = r : delete T.data.meta.og;
		}
		T.save(), Fe(), Hi();
		let r = z(O).pages.find((e) => e.id === z(_));
		z(qi)[z(_)] = !r?.noindex && !T.data.meta.description;
	}
	function Wi(e) {
		let t = z(O).pages.find((e) => e.id === z(_));
		t && (ki("edit:page-noindex", () => {
			e ? t.noindex = !0 : delete t.noindex;
		}), z(qi)[z(_)] = !e && !T?.data?.meta?.description);
	}
	let qi = /* @__PURE__ */ M(tn({}));
	async function Ji() {
		let e = {};
		for (let t of z(O).pages) {
			if (t.noindex) continue;
			if (t.id === z(_)) {
				e[t.id] = !T?.data?.meta?.description;
				continue;
			}
			let n = await Xi(t);
			e[t.id] = !n?.meta?.description;
		}
		N(qi, e, !0);
	}
	Sn(() => {
		z(ft) === "pages" && z(_) && Ji();
	});
	async function Yi(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", t) try {
			Ui("ogImage", (await Xn(t)).dataUrl);
		} catch {
			S(Y("status.imageReadError"), "error");
		}
	}
	async function Xi(e) {
		let t = localStorage.getItem(`urd-draft-${e.id}`);
		if (t) try {
			return JSON.parse(t);
		} catch {}
		try {
			let t = await fetch(`/${e.file}`);
			if (t.ok) return bo(await t.json(), Ae.data);
		} catch {}
		return si(e);
	}
	async function Zi(e, t) {
		let n = await Xi(e);
		t(n), ee(`urd-draft-${e.id}`, JSON.stringify(n)), Fe();
	}
	function ea(e, t) {
		let n = Ca(t);
		if (e.path === "/" || `/${n}` === e.path) return;
		let r = Li(n, e.id);
		if (r) {
			S(r, "error");
			return;
		}
		ki("pages", () => {
			e.path = `/${n}`;
		});
	}
	function ta(e) {
		e.path !== "/" && (ki("pages", () => {
			z(O).pages = z(O).pages.filter((t) => t.id !== e.id), z(O).nav.items = z(O).nav.items.filter((t) => t.page !== e.id || t.children);
			for (let t of z(O).nav.items) t.page === e.id && delete t.page, t.children && (t.children = t.children.filter((t) => t.page !== e.id), t.children.length === 0 && delete t.children);
			z(O).nav.items = z(O).nav.items.filter((e) => e.page || e.href || e.children);
		}), e.id === z(_) && ci(z(O).pages[0].id), S(Y("status.pageRemoved")));
	}
	function na(e) {
		ki("edit:nav-logo", () => {
			z(O).nav.logo = {
				type: "text",
				value: "",
				...z(O).nav.logo,
				...e
			};
		});
	}
	function ra(e) {
		ki("nav", () => {
			z(O).nav.logo ??= {
				type: "text",
				value: z(O).site.title
			};
			let t = z(O).nav.logo, n = t.type === "image";
			e === "both" ? (n && (t.image = t.value, t.value = z(O).site.title), t.image ??= "", t.size ??= 32) : e === "image" ? (n || (t.value = t.image ?? ""), delete t.image, t.size ??= 32) : (n && (t.value = z(O).site.title), delete t.image), t.type = e;
		});
	}
	async function ia(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", t) try {
			let e = await Xn(t);
			ki("nav", () => {
				let t = z(O).nav.logo;
				t.type === "both" ? t.image = e.dataUrl : t.value = e.dataUrl;
			});
		} catch {
			S(Y("status.imageReadErrorSvg"), "error");
		}
	}
	let aa = /* @__PURE__ */ M(null);
	async function oa(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", !t) return;
		if (t.type === "image/svg+xml" || /\.svg$/i.test(t.name || "")) {
			try {
				let e = await Yn(t);
				N(aa, e.dataUrl, !0);
			} catch {
				S(Y("status.imageReadErrorSvg"), "error");
			}
			return;
		}
		let n = new FileReader();
		n.onload = () => {
			N(aa, String(n.result), !0);
		}, n.onerror = () => S(Y("status.imageReadError"), "error"), n.readAsDataURL(t);
	}
	function sa(e) {
		ki("edit:site-icon", () => {
			z(O).site.icon = e;
		}), N(aa, null);
	}
	function ca() {
		ki("edit:site-icon", () => {
			delete z(O).site.icon;
		});
	}
	function la(e) {
		ki("edit:site-title", () => {
			z(O).site.title = e;
		});
	}
	function ua(e) {
		ki("edit:site-desc", () => {
			z(O).site.description = e;
		});
	}
	let fa = /* @__PURE__ */ k(() => z(O)?.layout?.contentWidth ?? 1440), pa = /* @__PURE__ */ k(() => z(O)?.layout?.gutter ?? 6), ma = /* @__PURE__ */ k(() => no(z(fa))), _a = /* @__PURE__ */ k(() => Ya.find((e) => e.gutter === z(pa))?.id ?? null), va = /* @__PURE__ */ M(!1), Ta = /* @__PURE__ */ k(() => z(fa) === "full" ? Ja : Qa(z(fa))), Ea = /* @__PURE__ */ k(() => Za.map((e) => ({
		screen: e,
		...to(z(fa), z(pa), e)
	})));
	function Da(e, t) {
		ki(t, () => {
			z(O).layout = {
				contentWidth: z(fa),
				gutter: z(pa),
				...e
			};
		});
	}
	let Oa = (e) => Da({ contentWidth: e === "full" ? "full" : Qa(e) }, "edit:site-width"), ka = (e) => Da({ gutter: $a(e) }, "edit:site-gutter");
	function Aa() {
		let e = z(O).site.lang ?? "no";
		return e === "no" ? "nb" : e;
	}
	function ja() {
		let e = Aa(), t = vt([..._t, ...xt()]);
		return [...t.some(([t]) => t === e) ? [] : [[e, e]], ...t];
	}
	function Fa(e) {
		ki("site", () => {
			z(O).site.lang = e;
		});
	}
	let Ia = /^(?:data:image\/[\w.+-]+;base64,[A-Za-z0-9+/=]+|\/(?!\/)[\w%./-]*)$/;
	Sn(() => {
		if (!z(O)?.site) return;
		let e = z(O).site.icon, t = document.querySelector("link[rel=\"icon\"]");
		if (t) {
			if (typeof e != "string" || !e) {
				t.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230b0e14'/%3E%3Cpath d='M19.2 49.6V14.4l25.6 10.4V49.6' fill='none' stroke='%2315b39a' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";
				return;
			}
			Ia.test(e) && (t.href = e);
		}
	});
	function La(e) {
		ki("nav", () => {
			z(O).nav.layout = e;
		});
	}
	function Ra(e, t) {
		ki(`edit:nav-style-${e}`, () => {
			z(O).nav.style ??= {}, t === void 0 ? delete z(O).nav.style[e] : z(O).nav.style[e] = t;
		});
	}
	let za = /* @__PURE__ */ k(() => z(O)?.nav?.variant === "side-left" || z(O)?.nav?.variant === "side-right"), Ba = /* @__PURE__ */ k(() => [
		"floating",
		"floating-square",
		"floating-tab"
	].includes(z(O)?.nav?.variant)), Va = {
		underline: [Y("hoverColor.underline.label"), Y("hoverColor.underline.title")],
		pill: [Y("hoverColor.pill.label"), Y("hoverColor.pill.title")],
		lift: [Y("hoverColor.lift.label"), Y("hoverColor.lift.title")]
	}, Ha = /* @__PURE__ */ k(() => Va[z(O)?.nav?.style?.hover] ?? null);
	function Ua(e) {
		ki("nav", () => {
			e === "bar" ? delete z(O).nav.variant : z(O).nav.variant = e;
		});
	}
	function Ka(e) {
		ki("nav", () => {
			z(O).nav.style ??= {}, e ? z(O).nav.style.glow = !0 : delete z(O).nav.style.glow;
		});
	}
	function ro(e) {
		ki("nav", () => {
			z(O).nav.style ??= {}, e ? delete z(O).nav.style.topGap : z(O).nav.style.topGap = !1;
		});
	}
	function io(e) {
		ki("nav", () => {
			z(O).nav.style ??= {}, e === "standard" ? delete z(O).nav.style.hover : z(O).nav.style.hover = e;
		});
	}
	let ao = null, oo = {}, co = {}, lo = !1, uo = /* @__PURE__ */ M(tn([])), fo = /* @__PURE__ */ M(tn({})), po = /* @__PURE__ */ M(null), mo = /* @__PURE__ */ M(""), ho = /* @__PURE__ */ M("news"), go = [
		["news", Y("collectionKind.news")],
		["notices", Y("collectionKind.notices")],
		["publications", Y("collectionKind.publications")],
		["products", Y("collectionKind.products")],
		["custom", Y("collectionKind.custom")]
	], _o = null, vo = {}, xo = {}, So = !1, wo = /* @__PURE__ */ M(tn([]));
	async function Do() {
		let e = {
			version: 1,
			maler: []
		};
		try {
			e = await (await fetch("/content/maler.json")).json();
		} catch {}
		_o = $i("urd-draft-templates", () => e, C, "urd-draft-maler"), N(wo, [..._o.data.maler ?? []], !0);
		for (let e of z(wo)) {
			let t = null;
			try {
				t = await (await fetch(`/content/maler/${e}.json`)).json();
			} catch {}
			xo[e] = t, vo[e] = $i(`urd-draft-template-${e}`, () => t, C, `urd-draft-mal-${e}`), (vo[e].data?.schemaVersion ?? 1) > 1 && vo[e].reset();
		}
		So = !0, Z();
	}
	function Z() {
		let e = z(wo).map((e) => vo[e]?.data ? {
			id: e,
			...JSON.parse(JSON.stringify(vo[e].data))
		} : null).filter(Boolean).map(({ id: e, mal: t, section: n, blocks: r, page: i }) => ({
			id: e,
			name: t.name,
			kind: t.kind,
			section: n,
			blocks: r,
			page: i
		}));
		D?.sendTemplates(e);
	}
	function Q(e) {
		let t = Xo.includes(e.kind) ? e.kind : "section";
		return Ao(t, e[t]);
	}
	function Oo(e) {
		let { section: t, block: n } = Tt(e.sectionId, e.blockId);
		!t || !n?.sticky || At.some(([t]) => t === e.dock) && (Be(`sticky-dock:${e.blockId}`), n.sticky = {
			...n.sticky,
			dock: e.dock
		}, T.save(), Fe(), D?.sendSection(z(_), t), Et());
	}
	function ko(e) {
		let t = e.blockIds ?? [], { section: n } = Tt(e.sectionId, t[0]);
		if (!n || !t.length) return;
		Be(`sticky-group:${e.sectionId}`);
		let r = e.on ? Eo("stk") : null;
		for (let e of n.blocks) t.includes(e.id) && (e.sticky = r ? {
			offset: 16,
			until: null,
			...e.sticky,
			group: r
		} : null);
		Oe(n, "block-edited"), T.save(), Fe(), D?.sendSection(z(_), n), Et(), S(Y(e.on ? "status.stickyGrouped" : "status.stickyUngrouped"));
	}
	async function Ao(e, t) {
		if (!t || !_o) return;
		let n = (await tt({
			title: Y("canvas.templateNamePrompt"),
			placeholder: Y("ph.templateName")
		}))?.trim();
		if (!n) return;
		let r = Zo(n);
		if (!r) {
			S(Y("status.invalidName"), "error");
			return;
		}
		if (z(wo).includes(r)) {
			S(Y("status.templateExists"), "error");
			return;
		}
		Be("templates");
		let i = {
			schemaVersion: 1,
			mal: {
				name: n,
				kind: e
			},
			[e]: t
		};
		vo[r] = $i(`urd-draft-template-${r}`, () => null, C, `urd-draft-mal-${r}`), vo[r].replace(i), vo[r].save(), _o.data.maler = [...z(wo), r], _o.save(), N(wo, [...z(wo), r], !0), S(Y("status.templateSaved", { name: n }), "ok"), Fe(), Z();
	}
	async function jo(e) {
		let t = vo[e.id]?.data?.mal;
		t && await et({ title: Y("confirm.deleteTemplate", { name: t.name }) }) && (Be("templates"), z(ji) === e.id && N(ji, null), localStorage.removeItem(`urd-draft-template-${e.id}`), localStorage.removeItem(`urd-draft-mal-${e.id}`), delete vo[e.id], _o.data.maler = z(wo).filter((t) => t !== e.id), _o.save(), N(wo, z(wo).filter((t) => t !== e.id), !0), Fe(), Z());
	}
	async function Mo() {
		let e = {
			version: 1,
			samlinger: []
		};
		try {
			e = await (await fetch("/content/collections.json")).json();
		} catch {}
		ao = $i("urd-draft-collections", () => e, C, "urd-draft-samlinger"), N(uo, [...ao.data.samlinger ?? []], !0);
		for (let e of z(uo)) {
			let t = null;
			try {
				t = await (await fetch(`/content/samlinger/${e}.json`)).json();
			} catch {}
			co[e] = t, oo[e] = $i(`urd-draft-collection-${e}`, () => t, C, `urd-draft-samling-${e}`), !t && !oo[e].data && (oo[e].replace({
				schemaVersion: 1,
				id: e,
				name: e,
				kind: "custom",
				entries: []
			}), oo[e].save());
		}
		lo = !0, No();
	}
	function No(e = !0) {
		let t = {};
		for (let e of z(uo)) oo[e] && (t[e] = JSON.parse(JSON.stringify(oo[e].data)));
		N(fo, t, !0), e && Po();
	}
	function Po() {
		D?.sendCollections(Ge(z(fo)) ?? {});
	}
	function Fo(e, t, n, r = !0) {
		let i = oo[e];
		i && (Be(t), n(i.data), i.save(), Fe(), No(r));
	}
	function Io(e) {
		oo[e.collection] && Uo(e.collection);
	}
	function Lo(e) {
		return (new DOMParser().parseFromString(String(e ?? ""), "text/html").body.textContent ?? "").trim();
	}
	function Ro(e) {
		let { collection: t, entryId: n, field: r, value: i } = e;
		[
			"title",
			"text",
			"image",
			"imageAlt",
			"imageStyle"
		].includes(r) && (r === "title" && !Lo(i) || Fo(t, `edit:collection:${t}:${n}:${r}`, (e) => {
			let t = e.entries.find((e) => e.id === n);
			t && (i === "" && r !== "title" ? delete t[r] : t[r] = i);
		}, r === "image"));
	}
	function zo(e, t, n) {
		let r = {
			schemaVersion: 1,
			id: e,
			name: t,
			kind: n,
			entries: []
		};
		oo[e] = $i(`urd-draft-collection-${e}`, () => null, C, `urd-draft-samling-${e}`), oo[e].replace(r), oo[e].save(), ao.data.samlinger = [...z(uo), e], ao.save(), N(uo, [...z(uo), e], !0), N(po, e, !0), Fe(), No();
	}
	function Bo() {
		let e = z(mo).trim();
		if (!e) return;
		let t = Ca(e);
		if (!t || z(uo).includes(t)) {
			S(Y(t ? "status.collectionExists" : "status.invalidName"), "error");
			return;
		}
		Be("collections"), zo(t, e, z(ho)), N(mo, "");
	}
	function Vo() {
		let e = Y("seed.productCatalogName"), t = Ca(e) || "collection", n = t;
		for (let e = 2; z(uo).includes(n); e += 1) n = `${t}-${e}`;
		Be("collections"), zo(n, e, "products"), Nt(null, (e) => {
			e.props.collection = n;
		});
	}
	function Ho(e) {
		Be("collections"), localStorage.removeItem(`urd-draft-collection-${e}`), localStorage.removeItem(`urd-draft-samling-${e}`), delete oo[e], ao.data.samlinger = z(uo).filter((t) => t !== e), ao.save(), N(uo, z(uo).filter((t) => t !== e), !0), z(po) === e && N(po, null), Fe(), No();
	}
	function Uo(e) {
		Fo(e, `collection:${e}:add-entry`, (e) => {
			e.kind === "products" ? e.entries.push({
				id: Eo("entry"),
				title: Y("seed.newProduct"),
				text: ""
			}) : e.entries.unshift({
				id: Eo("entry"),
				title: Y("seed.newEntry"),
				date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
				text: ""
			});
		});
	}
	function Wo(e, t, n, r) {
		Fo(e, `edit:collection:${e}:${t}:${n}`, (e) => {
			let i = e.entries.find((e) => e.id === t);
			i && (r === "" && n !== "title" ? delete i[n] : i[n] = r);
		});
	}
	function Go(e, t, n) {
		Fo(e, `collection:${e}:move-entry`, (e) => {
			let r = t + n;
			r < 0 || r >= e.entries.length || ([e.entries[t], e.entries[r]] = [e.entries[r], e.entries[t]]);
		});
	}
	function Ko(e, t) {
		Fo(e, `collection:${e}:remove-entry`, (e) => {
			e.entries = e.entries.filter((e) => e.id !== t);
		});
	}
	async function qo(e, t, n) {
		let r = n.target.files?.[0];
		n.target.value = "", r && Wo(e, t, "image", (await Xn(r)).dataUrl);
	}
	function Jo(e, t, n) {
		let r = n.split(",").map((e) => e.trim()).filter(Boolean);
		Wo(e, t, "sizes", r.length ? r : "");
	}
	function Yo(e, t) {
		Fo(e, `collection:${e}:${t}:colors`, (e) => {
			let n = e.entries.find((e) => e.id === t);
			n && (n.colors = [...n.colors ?? [], { name: Y("ph.colorName") }]);
		});
	}
	function $o(e, t, n, r, i) {
		Fo(e, `edit:collection:${e}:${t}:color:${n}:${r}`, (e) => {
			let a = e.entries.find((e) => e.id === t)?.colors?.[n];
			a && (r === "image" && !i ? delete a.image : i && (a[r] = i));
		});
	}
	async function es(e, t, n, r) {
		let i = r.target.files?.[0];
		r.target.value = "", i && $o(e, t, n, "image", (await Xn(i)).dataUrl);
	}
	function ts(e, t, n) {
		Fo(e, `collection:${e}:${t}:colors`, (e) => {
			let r = e.entries.find((e) => e.id === t);
			r?.colors && (r.colors = r.colors.filter((e, t) => t !== n), r.colors.length || delete r.colors);
		});
	}
	function rs(e) {
		let t = oo[e]?.data;
		if (!t) return;
		let n = URL.createObjectURL(new Blob([ns(t.entries)], { type: "text/csv" })), r = document.createElement("a");
		r.href = n, r.download = `${e}.csv`, r.click(), URL.revokeObjectURL(n);
	}
	async function is(e, t) {
		let n = t.target.files?.[0];
		if (t.target.value = "", !n) return;
		let r = as(await n.text());
		if (!r) {
			S(Y("status.csvInvalid"), "error");
			return;
		}
		let i = /* @__PURE__ */ new Set();
		for (let e of r.entries) (!/^[a-z0-9][a-z0-9-]*$/.test(e.id) || i.has(e.id)) && (e.id = Eo("entry")), i.add(e.id);
		Fo(e, `collection:${e}:import`, (e) => {
			e.entries = r.entries;
		}), S(Y("status.csvImported", { count: String(r.entries.length) }), "ok");
	}
	let os = null, ds, fs = new Promise((e) => {
		ds = e;
	}), ps = /* @__PURE__ */ M(null), ms = tn({}), hs = /* @__PURE__ */ M("0.0.0"), gs = /* @__PURE__ */ M(""), _s = /* @__PURE__ */ M(""), vs = /* @__PURE__ */ M(tn([])), ys = /* @__PURE__ */ M(tn([])), $ = /* @__PURE__ */ M("pending"), bs = () => [.../* @__PURE__ */ new Set([...z(ps)?.enabled ?? [], ...z(ps)?.disabled ?? []])];
	function xs() {
		N(ps, JSON.parse(JSON.stringify(os.data)), !0);
	}
	let Ss = /* @__PURE__ */ M(null);
	async function Cs() {
		try {
			let e = (await fetch("/urd.json", { cache: "no-store" })).headers.get("content-security-policy");
			if (!e) {
				N(Ss, { unknown: !0 }, !0);
				return;
			}
			let t = (t) => new Set((e.split(";").map((e) => e.trim()).find((e) => e.startsWith(`${t} `)) ?? "").split(/\s+/).slice(1));
			N(Ss, {
				frameSrc: t("frame-src"),
				connectSrc: t("connect-src"),
				scriptSrc: t("script-src")
			}, !0);
		} catch {
			N(Ss, { unknown: !0 }, !0);
		}
	}
	function ws(e) {
		let t = [
			...(e.scriptSrc ?? []).map((e) => ["script-src", e]),
			...(e.connectSrc ?? []).map((e) => ["connect-src", e]),
			...(e.frameSrc ?? []).map((e) => ["frame-src", e])
		];
		if (!z(Ss) || z(Ss).unknown) return [];
		let n = {
			"script-src": z(Ss).scriptSrc,
			"connect-src": z(Ss).connectSrc,
			"frame-src": z(Ss).frameSrc
		};
		return t.filter(([e, t]) => !n[e]?.has(t)).map(([e, t]) => `${e} ${t}`);
	}
	async function Ts() {
		Cs();
		let e = {
			version: 1,
			enabled: []
		};
		try {
			e = await (await fetch("/plugins/plugins.json")).json();
		} catch {}
		N(ys, e.enabled ?? [], !0), os = $i("urd-draft-plugins", () => e, C), xs();
		try {
			N(hs, (await (await fetch("/urd.json")).json()).engine ?? "0.0.0", !0);
		} catch {}
		for (let e of bs()) Os(e);
		Es(), ds(), D?.sendPlugins(Ge(z(ps))?.enabled ?? []);
	}
	async function Es() {
		try {
			let e = await fetch("/api/github/plugins");
			if (!e.ok) {
				Ds();
				return;
			}
			let { plugins: t } = await e.json();
			localStorage.setItem("urd-plugins-found", JSON.stringify(t ?? [])), N(vs, (t ?? []).filter((e) => !bs().includes(e)), !0);
			for (let e of z(vs)) Os(e);
			N($, "ok");
		} catch {
			Ds();
		}
	}
	function Ds() {
		try {
			let e = JSON.parse(localStorage.getItem("urd-plugins-found") ?? "[]");
			if (Array.isArray(e) && e.length) {
				N(vs, e.filter((e) => !bs().includes(e)), !0);
				for (let e of z(vs)) Os(e);
				N($, "ok");
				return;
			}
		} catch {}
		N($, "unavailable");
	}
	async function Os(e) {
		try {
			let t = await (await fetch(`/plugins/${e}/plugin.json`)).json(), n = To(t);
			ms[e] = {
				...t,
				errors: n,
				satisfied: n.length === 0 && Co(z(hs), t.requiresEngine)
			};
		} catch {
			ms[e] = {
				name: e,
				errors: [Y("plugin.manifestNotFound", { id: e })],
				satisfied: !1
			};
		}
	}
	function ks(e, t) {
		Be("plugins");
		let n = os.data;
		n.enabled = (n.enabled ?? []).filter((t) => t !== e), n.disabled = (n.disabled ?? []).filter((t) => t !== e), t ? n.enabled.push(e) : n.disabled.push(e), os.save(), Fe(), xs(), js();
	}
	function js() {
		z(te) && (z(te).src = z(te).src);
	}
	function Ps(e) {
		Be("plugins");
		let t = os.data;
		t.enabled = (t.enabled ?? []).filter((t) => t !== e), t.disabled = (t.disabled ?? []).filter((t) => t !== e), os.save(), Fe(), xs(), js();
	}
	async function Fs() {
		N(_s, "");
		let e = z(gs).trim().toLowerCase();
		if (!/^[a-z0-9][a-z0-9-]*$/.test(e)) {
			N(_s, Y("plugin.invalidId"), !0);
			return;
		}
		if (bs().includes(e)) {
			N(_s, Y("plugin.alreadyListed"), !0);
			return;
		}
		if (await Os(e), ms[e].errors.length) {
			N(_s, Y("plugin.invalidManifest", { errors: ms[e].errors.join("; ") }), !0);
			return;
		}
		ks(e, !0), N(gs, "");
	}
	function zs(e) {
		N(vs, z(vs).filter((t) => t !== e), !0), ks(e, !0);
	}
	function Hs(e, t) {
		ki(e, () => {
			z(O).footer ??= {
				version: 1,
				show: !1,
				text: "",
				align: "center"
			}, t(z(O).footer);
		});
	}
	function Us(e, t) {
		Hs(`edit:footer-brand-${e}`, (n) => {
			n.brand ??= {}, t.trim() ? n.brand[e] = t : delete n.brand[e], !n.brand.title && !n.brand.tagline && !n.brand.logo && delete n.brand;
		});
	}
	function Ys(e) {
		Hs("footer", (t) => {
			t.brand ??= {}, e === "image" || e === "both" ? t.brand.mode = e : delete t.brand.mode;
		});
	}
	async function Xs(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", t) try {
			let e = await Xn(t);
			Hs("footer", (t) => {
				t.brand ??= {}, t.brand.logo = e.dataUrl, t.brand.mode || (t.brand.mode = "both");
			});
		} catch {
			S(Y("status.imageReadErrorSvg"), "error");
		}
	}
	function Zs() {
		Hs("footer", (e) => {
			e.brand && (delete e.brand.logo, delete e.brand.mode, delete e.brand.logoHeight, !e.brand.title && !e.brand.tagline && delete e.brand);
		});
	}
	function Qs(e) {
		Hs("edit:footer-logo-height", (t) => {
			t.brand ??= {};
			let n = Number(e);
			Number.isFinite(n) && (t.brand.logoHeight = Math.min(160, Math.max(16, Math.round(n))));
		});
	}
	function $s(e) {
		Hs("edit:footer-copyright", (t) => {
			e.trim() ? t.copyright = e : delete t.copyright;
		});
	}
	let ec = [
		{
			id: "minimal",
			label: Y("footerTemplate.minimal"),
			thumb: {
				center: !0,
				social: 2,
				baselineLinks: 1
			}
		},
		{
			id: "centered",
			label: Y("footerTemplate.centered"),
			thumb: {
				center: !0,
				row: !0,
				social: 3
			}
		},
		{
			id: "columns",
			label: Y("footerTemplate.columns"),
			thumb: {
				tag: !0,
				cols: 3,
				social: 3,
				baselineLinks: 2
			}
		},
		{
			id: "sitemap",
			label: Y("footerTemplate.sitemap"),
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
			label: Y("footerTemplate.newsletter"),
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
			label: Y("footerTemplate.bigcta"),
			thumb: {
				center: !0,
				bigcta: !0,
				baselineLinks: 2
			}
		},
		{
			id: "contact",
			label: Y("footerTemplate.contact"),
			thumb: {
				tag: !0,
				cols: 3,
				social: 2,
				baselineLinks: 1
			}
		},
		{
			id: "mega",
			label: Y("footerTemplate.mega"),
			thumb: {
				tag: !0,
				mega: !0,
				cols: 2,
				social: 4,
				baselineLinks: 2
			}
		}
	];
	function tc(e) {
		let t = Y("seed.orgName"), n = z(O).pages ?? [], r = (e) => n.slice(0, e).map((e) => ({
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
			baseline: [a(Y("seed.footer.privacy"), "#")]
		} : e === "centered" ? {
			align: "center",
			brand: { title: t },
			linkRow: r(5),
			social: i([
				"facebook",
				"instagram",
				"x"
			]),
			copyright: `${o} · ${Y("seed.footer.madeWith")}`
		} : e === "columns" ? {
			align: "left",
			brand: {
				title: t,
				tagline: Y("seed.footer.tagline1")
			},
			columns: [
				{
					title: Y("seed.footer.colPages"),
					links: r(4)
				},
				{
					title: Y("seed.footer.colCompany"),
					links: [
						a(Y("seed.footer.about"), "#"),
						a(Y("seed.join"), "#"),
						a(Y("seed.footer.press"), "#")
					]
				},
				{
					title: Y("seed.footer.colResources"),
					links: [
						a(Y("seed.footer.bylaws"), "#"),
						a(Y("seed.footer.privacy"), "#"),
						a(Y("seed.footer.contact"), "#")
					]
				}
			],
			social: i([
				"facebook",
				"instagram",
				"linkedin"
			]),
			copyright: o,
			baseline: [a(Y("seed.footer.privacy"), "#"), a(Y("seed.footer.terms"), "#")]
		} : e === "sitemap" ? {
			align: "left",
			brand: {
				title: t,
				tagline: Y("seed.footer.tagline2")
			},
			columns: [
				{
					title: Y("seed.footer.colExplore"),
					links: [
						a(Y("seed.footer.home"), "#"),
						a(Y("seed.footer.events"), "#"),
						a(Y("seed.footer.gallery"), "#"),
						a(Y("seed.footer.blog"), "#")
					]
				},
				{
					title: Y("seed.footer.colCompany"),
					links: [
						a(Y("seed.footer.about"), "#"),
						a(Y("seed.footer.history"), "#"),
						a(Y("seed.footer.press"), "#"),
						a(Y("seed.footer.contact"), "#")
					]
				},
				{
					title: Y("seed.footer.colSupport"),
					links: [
						a(Y("seed.join"), "#"),
						a(Y("seed.footer.faq"), "#"),
						a(Y("seed.footer.help"), "#")
					]
				},
				{
					title: Y("seed.footer.colLegal"),
					links: [
						a(Y("seed.footer.privacy"), "#"),
						a(Y("seed.footer.terms"), "#"),
						a(Y("seed.footer.bylaws"), "#")
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
				a(Y("seed.footer.privacy"), "#"),
				a(Y("seed.footer.terms"), "#"),
				a(Y("seed.footer.cookies"), "#")
			]
		} : e === "newsletter" ? {
			align: "left",
			brand: {
				title: t,
				tagline: Y("seed.footer.tagline3")
			},
			cta: {
				kind: "newsletter",
				heading: Y("seed.footer.newsletterHeading"),
				label: Y("seed.footer.newsletterButton"),
				recipient: Y("seed.email"),
				success: Y("seed.footer.newsletterSuccess")
			},
			columns: [{
				title: Y("seed.footer.colPages"),
				links: r(4)
			}, {
				title: Y("seed.footer.colMore"),
				links: [
					a(Y("seed.footer.about"), "#"),
					a(Y("seed.footer.contact"), "#"),
					a(Y("seed.footer.privacy"), "#")
				]
			}],
			social: i(["facebook", "instagram"]),
			copyright: o,
			baseline: [a(Y("seed.footer.privacy"), "#")]
		} : e === "bigcta" ? {
			align: "center",
			cta: {
				kind: "button",
				big: !0,
				heading: Y("seed.footer.ctaHeading"),
				sub: Y("seed.footer.ctaSub"),
				label: Y("seed.join"),
				href: "#"
			},
			linkRow: r(4),
			social: i([
				"facebook",
				"instagram",
				"x"
			]),
			copyright: o,
			baseline: [a(Y("seed.footer.privacy"), "#"), a(Y("seed.footer.terms"), "#")]
		} : e === "contact" ? {
			align: "left",
			brand: {
				title: t,
				tagline: Y("seed.footer.tagline4")
			},
			columns: [
				{
					title: Y("seed.footer.colVisit"),
					links: [
						a(Y("seed.footer.address"), "#"),
						a(Y("seed.email"), `mailto:${Y("seed.email")}`),
						a(Y("seed.phone"), `tel:${Y("seed.phone").replace(/\s+/g, "")}`)
					]
				},
				{
					title: Y("seed.footer.colHours"),
					links: [a(Y("seed.footer.hours1"), "#"), a(Y("seed.footer.hours2"), "#")]
				},
				{
					title: Y("seed.footer.colPages"),
					links: r(4)
				}
			],
			social: i(["facebook", "instagram"]),
			copyright: o,
			baseline: [a(Y("seed.footer.privacy"), "#")]
		} : {
			align: "left",
			brand: {
				title: t,
				tagline: Y("seed.footer.tagline5")
			},
			columns: [{
				title: Y("seed.footer.colExplore"),
				links: r(4)
			}, {
				title: Y("seed.footer.colFollow"),
				links: [a(Y("seed.footer.newsletter"), "#"), a(Y("seed.email"), `mailto:${Y("seed.email")}`)]
			}],
			social: i([
				"facebook",
				"instagram",
				"linkedin",
				"youtube"
			]),
			copyright: o,
			baseline: [a(Y("seed.footer.privacy"), "#"), a(Y("seed.footer.madeWith"), "#")],
			background: {
				version: 1,
				layers: [{
					type: "glow",
					version: sc.version ?? 1,
					props: {
						...sc.defaults(),
						color: "accent",
						x: .12,
						y: 0,
						radius: .6,
						opacity: .45
					}
				}, {
					type: "grain",
					version: lc.version ?? 1,
					props: {
						...lc.defaults(),
						opacity: .08
					}
				}]
			}
		};
	}
	function nc(e) {
		Hs("footer-template", (t) => {
			let n = tc(e);
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
	function rc(e) {
		Hs("footer", (t) => {
			t[e] ??= [], t[e].push(z(O).pages[0] ? {
				label: Y("seed.link"),
				page: z(O).pages[0].id
			} : {
				label: Y("seed.link"),
				href: "https://"
			});
		});
	}
	function ic(e, t) {
		Hs("footer", (n) => {
			n[e].splice(t, 1), n[e].length || delete n[e];
		});
	}
	function ac(e, t, n) {
		Hs("footer", (r) => {
			let i = r[e], a = t + n;
			a < 0 || a >= i.length || ([i[t], i[a]] = [i[a], i[t]]);
		});
	}
	function cc(e, t, n) {
		Hs(`edit:footer-${e}-label-${t}`, (r) => {
			r[e][t].label = n;
		});
	}
	function uc(e, t, n) {
		Hs("footer", (r) => {
			let i = r[e][t];
			n === "__href" ? (delete i.page, i.href = i.href ?? "https://") : (i.page = n, delete i.href);
		});
	}
	function dc(e, t, n) {
		Hs(`edit:footer-${e}-href-${t}`, (r) => {
			r[e][t].href = n;
		});
	}
	function fc(e) {
		Hs("footer", (t) => {
			e === "center" ? t.columnsAlign = "center" : delete t.columnsAlign;
		});
	}
	function pc(e) {
		Hs("footer", (t) => {
			e ? t.cta ??= {
				kind: "button",
				label: Y("seed.join")
			} : delete t.cta;
		});
	}
	function mc(e, t) {
		Hs(`edit:footer-cta-${e}`, (n) => {
			n.cta ??= {}, t === "" || t == null || t === !1 ? delete n.cta[e] : n.cta[e] = t;
		});
	}
	function hc(e) {
		Hs("footer", (t) => {
			t.cta ??= {}, e === "__href" ? (delete t.cta.page, t.cta.href = t.cta.href ?? "https://") : (t.cta.page = e, delete t.cta.href);
		});
	}
	function gc(e, t) {
		Hs("footer", (n) => {
			let r = new Set(n.hideOn ?? []);
			t ? r.delete(e) : r.add(e), r.size ? n.hideOn = [...r] : delete n.hideOn;
		});
	}
	function _c() {
		Hs("footer", (e) => {
			e.columns ??= [], e.columns.push({
				title: Y("seed.column"),
				links: [{
					label: Y("seed.link"),
					page: z(O).pages[0].id
				}]
			});
		});
	}
	function vc(e) {
		Hs("footer", (t) => {
			t.columns.splice(e, 1), t.columns.length || delete t.columns;
		});
	}
	function yc(e, t) {
		Hs("footer", (n) => {
			let r = e + t;
			r < 0 || r >= n.columns.length || ([n.columns[e], n.columns[r]] = [n.columns[r], n.columns[e]]);
		});
	}
	function bc(e, t) {
		Hs(`edit:footer-col-title-${e}`, (n) => {
			n.columns[e].title = t;
		});
	}
	function xc(e) {
		Hs("footer", (t) => {
			t.columns[e].links ??= [], t.columns[e].links.push({
				label: Y("seed.link"),
				page: z(O).pages[0].id
			});
		});
	}
	function Sc(e, t) {
		Hs("footer", (n) => {
			n.columns[e].links.splice(t, 1);
		});
	}
	function Cc(e, t, n) {
		Hs("footer", (r) => {
			let i = r.columns[e].links, a = t + n;
			a < 0 || a >= i.length || ([i[t], i[a]] = [i[a], i[t]]);
		});
	}
	function wc(e, t, n) {
		Hs(`edit:footer-link-label-${e}-${t}`, (r) => {
			r.columns[e].links[t].label = n;
		});
	}
	function Tc(e, t, n) {
		Hs("footer", (r) => {
			let i = r.columns[e].links[t];
			n === "__href" ? (delete i.page, i.href = i.href ?? "https://") : (i.page = n, delete i.href);
		});
	}
	function Ec(e, t, n) {
		Hs(`edit:footer-link-href-${e}-${t}`, (r) => {
			r.columns[e].links[t].href = n;
		});
	}
	function Dc() {
		Hs("footer", (e) => {
			e.social ??= [], e.social.push({
				icon: "facebook",
				url: "https://"
			});
		});
	}
	function Oc(e) {
		Hs("footer", (t) => {
			t.social.splice(e, 1), t.social.length || delete t.social;
		});
	}
	function kc(e, t) {
		Hs("footer", (n) => {
			let r = e + t;
			r < 0 || r >= n.social.length || ([n.social[e], n.social[r]] = [n.social[r], n.social[e]]);
		});
	}
	function Ac(e, t) {
		Hs("footer", (n) => {
			n.social[e].icon = t;
		});
	}
	function jc(e, t) {
		Hs(`edit:footer-social-url-${e}`, (n) => {
			n.social[e].url = t;
		});
	}
	let Mc = Na.filter(([e]) => e === "iconCat.social" || e === "iconCat.communication").flatMap(([, e]) => e.map((e) => [e, Y(Ma[e].labelKey)]));
	function Pc(e, t) {
		ki(`edit:nav-label-${e}`, () => {
			z(O).nav.items[e].label = t;
		});
	}
	function Fc(e, t) {
		ki("nav", () => {
			let n = z(O).nav.items[e];
			t === "__href" ? (delete n.page, n.href = n.href ?? "https://") : t === "__none" ? (delete n.page, delete n.href) : (n.page = t, delete n.href);
		});
	}
	function Ic(e, t) {
		ki(`edit:nav-href-${e}`, () => {
			z(O).nav.items[e].href = t;
		});
	}
	function Lc(e, t) {
		let n = e + t, r = z(O).nav.items;
		n < 0 || n >= r.length || ki("nav", () => {
			[r[e], r[n]] = [r[n], r[e]];
		});
	}
	function zc(e) {
		ki("nav", () => {
			z(O).nav.items.splice(e, 1);
		});
	}
	function Bc() {
		ki("nav", () => {
			z(O).nav.items.push({
				label: Y("seed.link"),
				page: z(O).pages[0].id
			});
		});
	}
	function Vc(e) {
		ki("nav", () => {
			let t = z(O).nav.items[e];
			t.children ??= [], t.children.push({
				label: Y("seed.link"),
				page: z(O).pages[0].id
			});
		});
	}
	function Hc(e, t, n) {
		ki(`edit:nav-child-label-${e}-${t}`, () => {
			z(O).nav.items[e].children[t].label = n;
		});
	}
	function Uc(e, t, n) {
		ki("nav", () => {
			let r = z(O).nav.items[e].children[t];
			n === "__href" ? (delete r.page, r.href = r.href ?? "https://") : (r.page = n, delete r.href);
		});
	}
	function Kc(e, t, n) {
		ki(`edit:nav-child-href-${e}-${t}`, () => {
			z(O).nav.items[e].children[t].href = n;
		});
	}
	function qc(e, t, n) {
		let r = t + n, i = z(O).nav.items[e].children;
		r < 0 || r >= i.length || ki("nav", () => {
			[i[t], i[r]] = [i[r], i[t]];
		});
	}
	function Jc(e, t) {
		ki("nav", () => {
			let n = z(O).nav.items[e];
			n.children.splice(t, 1), n.children.length === 0 && (delete n.children, !n.page && !n.href && (n.page = z(O).pages[0].id));
		});
	}
	function Df(e, t) {
		ki(`edit:theme-color-${e}`, () => {
			z(O).theme.tokens.color[e] = t, z(O).theme.alt?.auto && (z(O).theme.alt.tokens.color = jf());
		});
	}
	function Of(e, t) {
		ki("theme", () => {
			z(O).theme.tokens.font[e] = t;
		});
	}
	function kf(e, t) {
		ki("theme", () => {
			z(O).theme.tokens.radius[e] = t;
		});
	}
	function Af(e) {
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
	function jf() {
		return Object.fromEntries(Object.entries(z(O).theme.tokens.color).map(([e, t]) => [e, Af(t)]));
	}
	function Mf(e, t) {
		ki(`edit:theme-alt-${e}`, () => {
			z(O).theme.alt.tokens.color[e] = t, z(O).theme.alt.auto = !1;
		});
	}
	function Nf(e) {
		ki("theme", () => {
			e === "light" ? delete z(O).theme.scheme : z(O).theme.scheme = e;
		});
	}
	function Pf(e) {
		ki("theme", () => {
			e ? z(O).theme.alt = {
				auto: !0,
				tokens: { color: jf() }
			} : delete z(O).theme.alt;
		});
	}
	function Ff(e) {
		ki("theme", () => {
			z(O).theme.alt ??= { tokens: { color: jf() } }, z(O).theme.alt.auto = e, e && (z(O).theme.alt.tokens.color = jf());
		});
	}
	function If(e) {
		let t = z(O).theme.tokens.font[e];
		return [...Xc.some(([, e]) => e === t) ? [] : [[t, Y("opt.customFont")]], ...Xc.map(([e, t]) => [t, Y(e)])];
	}
	let Lf = (e) => parseInt(e, 10) || 0;
	function Rf(e, t) {
		kf(e, `${t}px`);
	}
	let zf = (e, t) => e && t && t[e] ? t[e] : e, Bf = [
		"bg",
		"surface",
		"text",
		"accent",
		"accent-text"
	], Vf = [
		{
			id: "well",
			name: Y("themePreset.well.name"),
			note: Y("themePreset.well.note"),
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
			name: Y("themePreset.stone.name"),
			note: Y("themePreset.stone.note"),
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
			name: Y("themePreset.plum.name"),
			note: Y("themePreset.plum.note"),
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
			name: Y("themePreset.rose.name"),
			note: Y("themePreset.rose.note"),
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
			name: Y("themePreset.ocean.name"),
			note: Y("themePreset.ocean.note"),
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
			name: Y("themePreset.night.name"),
			note: Y("themePreset.night.note"),
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
	function Hf(e) {
		ki("theme", () => {
			let t = e.scheme === "dark", n = t ? e.dark : e.light, r = t ? e.light : e.dark;
			for (let e of Bf) z(O).theme.tokens.color[e] = n[e];
			t ? z(O).theme.scheme = "dark" : delete z(O).theme.scheme, z(O).theme.alt = { tokens: { color: { ...r } } };
		});
	}
	let Uf = /* @__PURE__ */ k(() => {
		if (!z(O)) return null;
		let e = z(O).theme.tokens.color, t = z(O).theme.alt?.tokens?.color ?? {}, n = z(O).theme.scheme === "dark";
		return Vf.find((r) => {
			let i = n ? r.dark : r.light, a = n ? r.light : r.dark;
			return Bf.every((n) => e[n] === i[n] && t[n] === a[n]);
		})?.id ?? null;
	});
	function Wf() {
		N(re, !z(re)), D?.sendChrome(z(re));
	}
	function Gf(e) {
		let t = T.data.sections.find((t) => t.id === e.sectionId), n = t?.blocks.find((t) => t.id === e.blockId);
		n && (Be(`edit:${e.blockId}`), n.props = e.props, T.save(), Fe(), z(A)?.blockId === e.blockId && Et(), e.rerender && D?.sendSection(z(_), t), N(y, ""));
	}
	function Kf(e) {
		let t = T.data.sections.find((t) => t.id === e.sectionId), n = t?.blocks.find((t) => t.id === e.blockId);
		if (!n) return;
		Be(e.coalesce ? `edit:${e.groupKey ?? e.blockId}` : "move-block");
		let r = e.frameKey === "mobile" ? "mobile" : "desktop";
		n.frames[r] = e.frame, r === "desktop" && Oe(t, "desktop-changed-after-mobile"), T.save(), Fe(), z(A)?.blockId === e.blockId && Et();
	}
	function qf(e) {
		let t = T.data.sections.find((t) => t.id === e.sectionId)?.blocks.find((t) => t.id === e.blockId);
		!t?.frames?.desktop || t.frames.desktop.h === e.h || (T.amendBaseline((t) => {
			let n = t.sections.find((t) => t.id === e.sectionId)?.blocks.find((t) => t.id === e.blockId);
			n?.frames?.desktop && (n.frames.desktop.h = e.h);
		}), T.hasDraft() && Be(`edit:${e.blockId}`), t.frames.desktop.h = e.h, T.save(), Fe(), z(A)?.blockId === e.blockId && Et());
	}
	function Jf(e) {
		let t = T.data.sections.find((t) => t.id === e.sectionId);
		if (t) {
			if (Be("mobile-reset"), e.blockId) {
				let n = t.blocks.find((t) => t.id === e.blockId);
				n && (n.frames.mobile = null);
			} else for (let e of t.blocks) e.frames.mobile = null;
			!De(t) && t.responsive?.mobile && (t.responsive.mobile.attention = null), T.save(), Fe(), we(), D?.sendSection(z(_), t);
		}
	}
	function Yf(e) {
		let t = T.data.sections.find((t) => t.id === e.sectionId), n = t?.blocks.find((t) => t.id === e.blockId);
		!n || typeof e.mobileOrder != "number" || (Be("mobile-order"), n.mobileOrder = e.mobileOrder, T.save(), Fe(), D?.sendSection(z(_), t));
	}
	function Xf(e) {
		let t = T.data.sections.find((t) => t.id === e.sectionId);
		t?.responsive?.mobile && (Be("review-done"), t.responsive.mobile.attention = null, T.save(), Fe(), we());
	}
	function Zf(e) {
		let t = T.data.sections.find((t) => t.id === e.sectionId), n = t?.blocks.find((t) => t.id === e.blockId);
		n && (Be("block-flag"), typeof e.decor == "boolean" && (n.decor = e.decor), typeof e.hideMobile == "boolean" && (n.hideMobile = e.hideMobile), T.save(), Fe(), typeof e.hideMobile == "boolean" && z(se) === "mobile" && D?.sendSection(z(_), t), z(A)?.blockId === e.blockId && Et());
	}
	function Qf(e) {
		Be("add-section"), e.section.id || (e.section.id = Eo("sec")), T.data.sections.splice(e.index, 0, e.section), T.save(), Fe(), D?.sendPage(z(_), T.data), N(un, e.section.id, !0), _n(e.section), N(ft, "properties");
	}
	function $f(e) {
		let t = T.data.sections, n = t.findIndex((t) => t.id === e.sectionId), r = n + e.dir;
		n < 0 || r < 0 || r >= t.length || (Be("move-section"), [t[n], t[r]] = [t[r], t[n]], T.save(), Fe(), D?.sendPage(z(_), T.data));
	}
	function ep(e) {
		Be("delete-section"), e.sectionId === z(un) && (N(un, null), N(dn, null)), z(A)?.sectionId === e.sectionId && N(A, null), T.data.sections = T.data.sections.filter((t) => t.id !== e.sectionId), T.save(), Fe(), D?.sendPage(z(_), T.data);
	}
	function tp(e) {
		let t = T.data.sections.find((t) => t.id === e.sectionId);
		if (t) {
			Be("section-size"), t.size = {
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
			e.moves?.length && (Oe(t, "section-height"), z(A)?.sectionId === e.sectionId && Et()), e.sectionId === z(un) && N(fn, e.minHeight, !0), T.save(), Fe();
		}
	}
	function np(e) {
		let t = T.data.sections.find((t) => t.id === e.fromSectionId), n = T.data.sections.find((t) => t.id === e.toSectionId), r = t?.blocks.find((t) => t.id === e.blockId);
		!t || !n || !r || (Be("move-block"), t.blocks = t.blocks.filter((t) => t.id !== e.blockId), r.frames.desktop = e.frame, r.frames.mobile = null, n.blocks.push(r), Oe(t, "block-moved"), Oe(n, "block-moved"), T.save(), Fe(), we(), D?.sendPage(z(_), T.data), z(A)?.blockId === e.blockId && (N(A, {
			...z(A),
			sectionId: e.toSectionId
		}, !0), Et()));
	}
	function rp(e) {
		let t = T.data.sections.find((t) => t.id === e.sectionId);
		if (!t) return;
		let n = e.blockIds ?? [e.blockId];
		Be("delete-block"), t.blocks = t.blocks.filter((e) => !n.includes(e.id)), n.includes(z(A)?.blockId) && N(A, null), Oe(t, "block-deleted"), T.save(), Fe(), D?.sendSection(z(_), t);
	}
	let ip = {
		text: {
			type: "text",
			props: {
				html: Y("seed.text"),
				align: "left"
			},
			w: 33,
			h: 28
		},
		"text-box": {
			type: "text",
			props: {
				html: Y("seed.textBox"),
				align: "left",
				box: !0
			},
			w: 30,
			h: 150
		},
		button: {
			type: "button",
			props: {
				label: Y("seed.newButton"),
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
						q: Y("seed.faq.q1"),
						a: Y("seed.faq.answer")
					},
					{
						q: Y("seed.faq.q2"),
						a: Y("seed.faq.answer")
					},
					{
						q: Y("seed.faq.q3"),
						a: Y("seed.faq.answer")
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
						title: Y("seed.timeline.t1"),
						text: Y("seed.timeline.text")
					},
					{
						year: "2022",
						title: Y("seed.timeline.t2"),
						text: Y("seed.timeline.text")
					},
					{
						year: "2026",
						title: Y("seed.timeline.t3"),
						text: Y("seed.timeline.text")
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
				text: Y("seed.quoteBlock.text"),
				attribution: Y("seed.quoteBlock.name"),
				role: Y("seed.quoteBlock.role"),
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
				label: Y("seed.statsBlock.label"),
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
						Y("seed.table.h1"),
						Y("seed.table.h2"),
						Y("seed.table.h3")
					],
					[
						Y("seed.table.r1c1"),
						Y("seed.table.r1c2"),
						""
					],
					[
						Y("seed.table.r2c1"),
						Y("seed.table.r2c2"),
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
				doneText: Y("seed.countdown.done"),
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
	function ap(e) {
		let t = ip[e];
		return t ? {
			id: Eo("blk"),
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
	function op(e) {
		D ? D.sendPlaceBlock(e) : sp(V()?.id, e);
	}
	function sp(e, t) {
		let n = T.data.sections.find((t) => t.id === e) ?? T.data.sections[0];
		if (!n) return;
		Be("add-block");
		let r = Math.max(0, ...n.blocks.map((e) => e.frames?.desktop?.z ?? 1)) + 1;
		t.frames?.desktop && (t.frames.desktop = {
			...t.frames.desktop,
			z: r
		}), n.blocks.push(t), Oe(n, "block-added"), T.save(), Fe(), D?.sendSection(z(_), n);
	}
	function cp(e, t, n, r) {
		let i = T.data.sections.find((t) => t.id === e);
		if (!i || !t?.length) return;
		Be("add-blocks");
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
		}), Oe(i, "block-added"), T.save(), Fe(), D?.sendSection(z(_), i);
	}
	function lp(e) {
		op(ap(e));
	}
	let up = /* @__PURE__ */ M(tn([]));
	function dp(e, t = {}) {
		let n = Ge(e);
		op({
			id: Eo("blk"),
			type: n.type,
			version: n.version ?? 1,
			decor: !1,
			props: {
				...n.defaults ?? {},
				...Ge(t)
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
	let fp = /* @__PURE__ */ M("");
	function pp() {
		let e = [
			{
				label: Y("blocks.text"),
				act: "block",
				kind: "text"
			},
			{
				label: Y("ui.textBox"),
				act: "block",
				kind: "text-box"
			},
			{
				label: Y("blocks.button"),
				act: "block",
				kind: "button"
			},
			{
				label: Y("blocks.image"),
				act: "image"
			},
			{
				label: Y("blocks.video"),
				act: "block",
				kind: "video"
			},
			{
				label: Y("blocks.icon"),
				act: "block",
				kind: "icon"
			},
			{
				label: Y("blocks.collection"),
				act: "block",
				kind: "collection"
			},
			{
				label: Y("blocks.faq"),
				act: "block",
				kind: "faq"
			},
			{
				label: Y("blocks.timeline"),
				act: "block",
				kind: "timeline"
			},
			{
				label: Y("blocks.quote"),
				act: "block",
				kind: "quote"
			},
			{
				label: Y("blocks.stats"),
				act: "block",
				kind: "stats"
			},
			{
				label: Y("blocks.table"),
				act: "block",
				kind: "table"
			},
			{
				label: Y("blocks.share"),
				act: "block",
				kind: "share"
			},
			{
				label: Y("blocks.countdown"),
				act: "block",
				kind: "countdown"
			},
			{
				label: Y("blocks.audio"),
				act: "block",
				kind: "audio"
			},
			{
				label: Y("blocks.product"),
				act: "block",
				kind: "product"
			},
			{
				label: Y("blocks.cart"),
				act: "block",
				kind: "cart"
			},
			{
				label: Y("blocks.checkout"),
				act: "block",
				kind: "checkout"
			},
			{
				label: Y("ui.emptyGallery"),
				act: "block",
				kind: "gallery"
			},
			{
				label: Y("ui.galleryWithImages"),
				act: "galleryImages"
			},
			{
				label: Y("shape.line"),
				act: "block",
				kind: "shape-line"
			},
			{
				label: Y("shape.arrow"),
				act: "block",
				kind: "shape-arrow"
			},
			{
				label: Y("shape.circle"),
				act: "block",
				kind: "shape-circle"
			},
			{
				label: Y("shape.rect"),
				act: "block",
				kind: "shape-rect"
			},
			{
				label: Y("shape.triangle"),
				act: "block",
				kind: "shape-triangle"
			}
		];
		for (let t of z(wo)) {
			let n = vo[t]?.data?.mal;
			n?.kind === "blocks" && e.push({
				label: n.name,
				act: "template",
				id: t
			});
		}
		for (let t of z(up)) if (t.variants?.length) for (let n of t.variants) e.push({
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
	function mp(e) {
		e.act === "block" ? lp(e.kind) : e.act === "plugin" ? dp(e.entry, e.props ?? {}) : e.act === "template" && D?.sendInsertTemplate(e.id);
	}
	function hp(e) {
		let t = ap(e.kind);
		if (t) {
			if (e.at && typeof e.at.x == "number" && typeof e.at.y == "number") {
				let n = T.data.sections.find((t) => t.id === e.sectionId)?.grid ?? z(O).grid, r = Zc({
					x: e.at.x,
					y: e.at.y,
					w: t.frames.desktop.w,
					h: t.frames.desktop.h,
					grid: n
				});
				t.frames.desktop.x = r.x, t.frames.desktop.y = r.y;
			} else t.frames.desktop.x = Math.round((100 - t.frames.desktop.w) / 2 * 100) / 100, t.frames.desktop.y = 40;
			sp(e.sectionId, t), D?.sendSelect(t.id), e.kind === "image" && S(Y("status.imageBlockAdded")), e.kind === "gallery" && S(Y("status.galleryBlockAdded"));
		}
	}
	async function gp(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", !t) return;
		S(Y("status.compressingImage"));
		let n;
		try {
			n = await Xn(t);
		} catch {
			S(Y("status.imageReadError"), "error");
			return;
		}
		let r = Math.round(n.height / n.width * .3 * (z(te)?.clientWidth ?? 1280));
		op({
			id: Eo("blk"),
			type: "image",
			version: 1,
			props: {
				src: n.dataUrl,
				alt: Ca(t.name).replaceAll("-", " "),
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
		}), n.bytes > 4e5 ? S(Y("status.imageLarge", { kb: Math.round(n.bytes / 1024) }), "error") : S("");
	}
	async function _p(e) {
		let t = [], n = 0, r = 0;
		for (let i of e) try {
			let e = await Xn(i);
			e.bytes > 4e5 && (r += 1), t.push({
				src: e.dataUrl,
				alt: Ca(i.name).replaceAll("-", " "),
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
	function vp(e, t, n) {
		t ? S(Y("status.imagesReadFailed", { n: t }), "error") : n ? S(Y("status.imagesLarge", { n }), "error") : S(e ? "" : Y("status.noImagesAdded"));
	}
	async function yp(e) {
		let t = [...e.target.files ?? []];
		if (e.target.value = "", !t.length) return;
		S(Y("status.compressingImages"));
		let { images: n, failed: r, big: i } = await _p(t);
		n.length && Nt("gallery-add", (e) => {
			e.props.images.push(...n);
		}), vp(n.length, r, i);
	}
	async function bp(e) {
		let t = [...e.target.files ?? []];
		if (e.target.value = "", !t.length) return;
		S(Y("status.compressingImages"));
		let { images: n, failed: r, big: i } = await _p(t);
		if (!n.length) {
			vp(0, r, i);
			return;
		}
		let a = ap("gallery");
		a.props.images = n, op(a), vp(n.length, r, i);
	}
	function xp(e, t) {
		Nt("gallery-move", (n) => {
			let r = e + t;
			r < 0 || r >= n.props.images.length || ([n.props.images[e], n.props.images[r]] = [n.props.images[r], n.props.images[e]]);
		});
	}
	function Sp(e) {
		Nt("gallery-remove", (t) => {
			t.props.images.splice(e, 1);
		});
	}
	function Cp(e, t, n) {
		Nt(`edit:${z(A).blockId}:img${e}-${t}`, (r) => {
			r.props.images[e][t] = n;
		});
	}
	function wp(e, t, n, r) {
		let i = e?.[t];
		if (!i?.startsWith("data:image/") && !i?.startsWith("data:audio/") && !i?.startsWith("data:video/")) return;
		let a = i.split(",", 2)[1], o = `media/${Ca(n || "image")}-${wa(a)}.${Sa(i)}`;
		r.push({
			path: o,
			content: a,
			encoding: "base64"
		}), e[t] = `/${o}`;
	}
	function Tp(e, t) {
		wp(e, "image", e.title, t);
		for (let n of e.colors ?? []) wp(n, "image", `${e.title}-${n.name}`, t);
	}
	function Ep(e, t) {
		for (let n of e?.layers ?? []) {
			if (n.type === "image" && wp(n.props, "src", "background", t), n.type === "slideshow") for (let e of n.props.images ?? []) wp(e, "src", "background", t);
			n.type === "video" && (wp(n.props, "src", "video", t), wp(n.props, "poster", "plakat", t));
		}
	}
	function Dp(e, t) {
		if (e.type === "image" && wp(e.props, "src", e.props.alt, t), e.type === "icon" && wp(e.props, "image", "ikon", t), e.type === "gallery") for (let n of e.props.images ?? []) wp(n, "src", n.alt || "gallery", t);
		e.type === "audio" && wp(e.props, "src", e.props.title || "lyd", t);
	}
	function Op(e, t) {
		Ep(e.background, t);
		for (let n of e.blocks) Dp(n, t);
	}
	function kp(e) {
		let t = [];
		e.meta?.og && wp(e.meta.og, "image", "share", t);
		for (let n of e.sections) Op(n, t);
		return t;
	}
	function Ap(e) {
		let t = [], n = e.nav?.logo;
		return n?.type === "image" && wp(n, "value", "logo", t), n?.type === "both" && wp(n, "image", "logo", t), e.nav?.style && wp(e.nav.style, "image", "menu", t), Ep(e.nav?.style?.background, t), Ep(e.footer?.background, t), e.footer?.brand && wp(e.footer.brand, "logo", "footer-logo", t), wp(e.site, "icon", "ikon", t), t;
	}
	let jp = /* @__PURE__ */ M(!1), Mp = /* @__PURE__ */ M(null);
	function Np() {
		N(jp, !z(jp));
	}
	function Pp() {
		N(jp, !1), Fp();
	}
	Sn(() => {
		if (!z(jp)) return;
		let e = (e) => {
			z(Mp)?.contains(e.target) || N(jp, !1);
		}, t = (e) => {
			e.key === "Escape" && N(jp, !1);
		}, n = () => N(jp, !1);
		return window.addEventListener("click", e, !0), window.addEventListener("keydown", t, !0), window.addEventListener("blur", n), () => {
			window.removeEventListener("click", e, !0), window.removeEventListener("keydown", t, !0), window.removeEventListener("blur", n);
		};
	});
	function Fp() {
		Be("discard");
		for (let e of z(O).pages) e.id !== z(_) && !Ne.has(e.id) && localStorage.removeItem(`urd-draft-${e.id}`);
		let e = T.reset();
		if (Ae.reset(), os && (os.reset(), xs()), ao) {
			ao.reset(), N(uo, [...ao.data.samlinger ?? []], !0);
			for (let e of Object.keys(oo)) z(uo).includes(e) ? oo[e].reset() : delete oo[e];
			No();
		}
		if (_o) {
			_o.reset(), N(wo, [..._o.data.maler ?? []], !0);
			for (let e of Object.keys(vo)) z(wo).includes(e) ? vo[e].reset() : (localStorage.removeItem(`urd-draft-template-${e}`), localStorage.removeItem(`urd-draft-mal-${e}`), delete vo[e]);
			Z();
		}
		je(), N(w, {
			snap: !0,
			...z(O).grid
		}, !0), Fe(), N(y, ""), Me(), z(O).pages.some((e) => e.id === z(_)) ? D?.sendPage(z(_), e) : ci(z(O).pages[0].id);
	}
	async function Ip() {
		if (Jr) {
			S(Y("status.revertReloadBeforePublish"), "error");
			return;
		}
		if (z(ei)) {
			S(Y("update.publishBlocked"), "error");
			return;
		}
		S(Y("status.publishing"));
		let e = [], t = [], n = [], r = [];
		for (let i of z(O).pages) {
			let a = `urd-draft-${i.id}`, o = Ne.has(i.id) || !z(g).pages.some((e) => e.id === i.id), s = null;
			if (i.id === z(_) && (T.hasDraft() || o)) s = T.data;
			else if (i.id !== z(_)) {
				let e = localStorage.getItem(a);
				if (e) try {
					s = bo(JSON.parse(e), Ae.data);
				} catch {}
			}
			if (!s && o && (s = si(i)), !s) continue;
			let c = JSON.parse(JSON.stringify(s));
			e.push(...kp(c)), e.push({
				path: i.file,
				content: JSON.stringify(c, null, 2) + "\n",
				encoding: "utf-8"
			}), t.push(i.title), o ? r.push(i.id) : n.push(a);
		}
		if (Ae.hasDraft()) {
			let r = JSON.parse(JSON.stringify(z(O)));
			e.push(...Ap(r)), e.push({
				path: "content/site.json",
				content: JSON.stringify(r, null, 2) + "\n",
				encoding: "utf-8"
			}), e.push({
				path: "content/theme.css",
				content: Vs(r.theme),
				encoding: "utf-8"
			}), n.push("urd-draft-site");
			let i = (e, t) => JSON.stringify(e ?? null) === JSON.stringify(t ?? null);
			i(z(g).theme, z(O).theme) || t.push(Y("publish.part.theme")), i(z(g).nav, z(O).nav) || t.push(Y("publish.part.nav")), i(z(g).footer, z(O).footer) || t.push(Y("publish.part.footer")), i(z(g).pages, z(O).pages) || t.push(Y("publish.part.pages")), i(z(g).grid, z(O).grid) || t.push(Y("publish.part.grid")), (z(g).site.icon ?? null) !== (z(O).site.icon ?? null) && t.push(Y("publish.part.icon"));
			let { icon: a, ...o } = z(g).site, { icon: s, ...c } = z(O).site;
			i(o, c) || t.push(Y("publish.part.siteInfo"));
		}
		let i = Object.entries(oo).filter(([, e]) => e.hasDraft());
		if (i.length || ao?.hasDraft()) {
			for (let [t, r] of i) {
				let i = JSON.parse(JSON.stringify(r.data));
				for (let t of i.entries) Tp(t, e);
				e.push({
					path: `content/samlinger/${t}.json`,
					content: JSON.stringify(i, null, 2) + "\n",
					encoding: "utf-8"
				}), ls.includes(i.kind) && e.push({
					path: `content/samlinger/${t}.xml`,
					content: us({
						title: i.name ?? t,
						origin: location.origin,
						path: `/content/samlinger/${t}.xml`,
						items: i.entries.map((e) => ({
							id: e.id,
							title: Lo(e.title),
							text: Lo(e.text),
							date: e.date,
							href: e.href
						}))
					}),
					encoding: "utf-8"
				}), n.push(`urd-draft-samling-${t}`);
			}
			if (ao?.hasDraft()) {
				e.push({
					path: "content/collections.json",
					content: JSON.stringify(ao.data, null, 2) + "\n",
					encoding: "utf-8"
				}), n.push("urd-draft-collections", "urd-draft-samlinger");
				let t = { samlinger: [] };
				try {
					t = await (await fetch("/content/collections.json")).json();
				} catch {}
				let r = new Set(e.map((e) => e.path));
				for (let n of t.samlinger ?? []) {
					let t = `content/samlinger/${n}.json`;
					!z(uo).includes(n) && !r.has(t) && e.push({
						path: t,
						delete: !0
					});
				}
			}
			t.push(Y("publish.part.collections"));
		}
		let a = Object.entries(vo).filter(([, e]) => e.hasDraft());
		if (a.length || _o?.hasDraft()) {
			for (let [t, r] of a) {
				let i = JSON.parse(JSON.stringify(r.data));
				i.section && Op(i.section, e);
				for (let t of i.blocks ?? []) Dp(t, e);
				for (let t of i.page?.sections ?? []) Op(t, e);
				e.push({
					path: `content/maler/${t}.json`,
					content: JSON.stringify(i, null, 2) + "\n",
					encoding: "utf-8"
				}), n.push(`urd-draft-mal-${t}`);
			}
			if (_o?.hasDraft()) {
				e.push({
					path: "content/maler.json",
					content: JSON.stringify(_o.data, null, 2) + "\n",
					encoding: "utf-8"
				}), n.push("urd-draft-templates", "urd-draft-maler");
				let t = { maler: [] };
				try {
					t = await (await fetch("/content/maler.json")).json();
				} catch {}
				let r = new Set(e.map((e) => e.path));
				for (let n of t.maler ?? []) {
					let t = `content/maler/${n}.json`;
					!z(wo).includes(n) && !r.has(t) && e.push({
						path: t,
						delete: !0
					});
				}
			}
			t.push(Y("publish.part.templates"));
		}
		os?.hasDraft() && (e.push({
			path: "plugins/plugins.json",
			content: JSON.stringify(os.data, null, 2) + "\n",
			encoding: "utf-8"
		}), n.push("urd-draft-plugins"), t.push(Y("publish.part.plugins")));
		try {
			let t = await (await fetch("/index.html")).text();
			for (let n of z(O).pages) n.path !== "/" && e.push({
				path: `${n.path.slice(1)}/index.html`,
				content: t,
				encoding: "utf-8"
			});
		} catch {}
		e.push({
			path: "sitemap.xml",
			content: ss(z(O).pages, location.origin),
			encoding: "utf-8"
		}), e.push({
			path: "robots.txt",
			content: cs(location.origin),
			encoding: "utf-8"
		});
		let o = new Set(e.map((e) => e.path)), s = (t) => {
			o.has(t) || e.push({
				path: t,
				delete: !0
			});
		};
		for (let e of z(g).pages) {
			let t = z(O).pages.find((t) => t.id === e.id);
			t ? t.path !== e.path && e.path !== "/" && s(`${e.path.slice(1)}/index.html`) : (s(e.file), e.path !== "/" && s(`${e.path.slice(1)}/index.html`));
		}
		let c = await Vr(e);
		if (!c.ok) {
			S(Y("status.publishAborted"), "error");
			return;
		}
		let l = {
			message: Y("publish.commitMessage", { titles: t.join(", ") || Y("publish.theSite") }),
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
			let { sha: e } = await u.json().catch(() => ({}));
			e ? zr = e : Br(), kp(T.data), Ap(z(O));
			for (let e of n) localStorage.removeItem(e);
			for (let e of r) Ne.add(e);
			if (N(g, JSON.parse(JSON.stringify(z(O))), !0), Ae = $i("urd-draft-site", () => z(g), C), je(), os) {
				let e = JSON.parse(JSON.stringify(os.data));
				os = $i("urd-draft-plugins", () => e, C), xs();
			}
			if (ao) {
				for (let e of Object.values(oo)) for (let t of e.data.entries) Tp(t, []);
				let e = JSON.parse(JSON.stringify(ao.data));
				ao = $i("urd-draft-collections", () => e, C, "urd-draft-samlinger"), co = {};
				for (let e of z(uo)) {
					if (!oo[e]) continue;
					let t = JSON.parse(JSON.stringify(oo[e].data));
					co[e] = t, oo[e] = $i(`urd-draft-collection-${e}`, () => t, C, `urd-draft-samling-${e}`);
				}
				No();
			}
			if (_o) {
				for (let e of Object.values(vo)) {
					e.data?.section && Op(e.data.section, []);
					for (let t of e.data?.blocks ?? []) Dp(t, []);
					for (let t of e.data?.page?.sections ?? []) Op(t, []);
				}
				let e = JSON.parse(JSON.stringify(_o.data));
				_o = $i("urd-draft-templates", () => e, C, "urd-draft-maler"), xo = {};
				for (let e of z(wo)) {
					if (!vo[e]) continue;
					let t = JSON.parse(JSON.stringify(vo[e].data));
					xo[e] = t, vo[e] = $i(`urd-draft-template-${e}`, () => t, C, `urd-draft-mal-${e}`);
				}
				Z();
			}
			N(w, {
				snap: !0,
				...z(O).grid
			}, !0);
			let t = JSON.parse(JSON.stringify(T.data));
			T = $i(`urd-draft-${z(_)}`, () => t, C), Ne.has(z(_)) && ee(`urd-draft-${z(_)}`, JSON.stringify(t)), Fe(), S(Y("status.published"), "ok");
		} else if (u?.status === 401) {
			let e = await u.json().catch(() => null);
			S(e?.code === "loginExpired" ? Y("status.loginExpired") : Y("status.loginRequired", { reason: Gi(e) ?? Y("status.unknownReason") }), "error"), await Rr();
		} else u?.status === 403 ? S(Gi(await u.json().catch(() => null)) ?? Y("status.noPublishAccess"), "error") : u?.status === 409 ? S(Y("status.publishRace"), "error") : S(u ? Gi(await u.json().catch(() => null)) ?? Y("status.publishFailed") : Y("status.publishUnavailable"), "error");
	}
	Qe();
	var Lp = Ef();
	Tr("keydown", nn, Ze), Tr("pointerdown", nn, Je);
	var Rp = F(Lp), zp = P(Rp), Bp = (e) => {
		var t = bu(), n = P(t);
		G(n, () => c.pencil);
		var r = L(n);
		E(t), R((e, n) => {
			J(t, "title", e), U(r, ` ${n ?? ""}`);
		}, [() => Y("tip.backToEdit"), () => Y("ui.edit")]), B("click", t, Wf), H(e, t);
	};
	W(zp, (e) => {
		z(re) || e(Bp);
	});
	var Vp = L(zp, 2);
	let Hp;
	var Up = P(Vp), Wp = P(Up), Gp = (e) => {
		var t = ju(), n = F(t), r = I(n, !0), i = L(n, 2), a = P(i), o = (e) => {
			var t = Cu(), n = P(t);
			let r;
			var i = P(n);
			G(i, () => c[`device_${z(ae)}`]), G(L(i), () => c.caret), E(n);
			var a = L(n, 2), o = (e) => {
				var t = Su();
				Xr(t, 21, () => ie, (e) => e.id, (e, t) => {
					var n = xu();
					let r;
					var i = P(n);
					G(i, () => c[`device_${z(t).id}`]);
					var a = L(i);
					E(n), R((e, i) => {
						r = _i(n, 1, "ghost svelte-1n46o8q", null, r, { active: z(ae) === z(t).id }), J(n, "title", e), U(a, ` ${i ?? ""}`);
					}, [() => Y(`tip.view.${z(t).id}`, {
						w: z(t).width ?? z(me),
						c: to(z(fa), z(pa), z(t).width ?? z(me)).width
					}), () => Y(`lbl.device.${z(t).id}`)]), B("click", n, () => {
						N(ae, z(t).id, !0), N(bi, null);
					}), H(e, n);
				}), E(t), H(e, t);
			};
			W(a, (e) => {
				z(bi) === "device" && e(o);
			}), E(t), R((e) => {
				r = _i(n, 1, "ghost svelte-1n46o8q", null, r, { active: z(bi) === "device" }), J(n, "title", e);
			}, [() => Y("lbl.group.device")]), B("click", n, () => N(bi, z(bi) === "device" ? null : "device", !0)), H(e, t);
		}, s = (e) => {
			var t = Tu(), n = F(t), r = I(n, !0), i = L(n, 2);
			Xr(i, 21, () => ie, (e) => e.id, (e, t) => {
				var n = wu();
				let r;
				G(n, () => c[`device_${z(t).id}`], !0), E(n), R((e) => {
					r = _i(n, 1, "ghost svelte-1n46o8q", null, r, { active: z(ae) === z(t).id }), J(n, "title", e);
				}, [() => Y(`tip.view.${z(t).id}`, {
					w: z(t).width ?? z(me),
					c: to(z(fa), z(pa), z(t).width ?? z(me)).width
				})]), B("click", n, () => N(ae, z(t).id, !0)), H(e, n);
			}), E(i), R((e) => U(r, e), [() => Y("lbl.group.device")]), H(e, t);
		};
		W(a, (e) => {
			Si.device ? e(o) : e(s, -1);
		});
		var l = L(a, 2), u = (e) => {
			var t = Du(), n = P(t);
			let r;
			var i = P(n), a = I(i);
			G(L(i), () => c.caret), E(n);
			var o = L(n, 2), s = (e) => {
				var t = Eu(), n = P(t), r = P(n);
				G(r, () => c.minus, !0), E(r);
				var i = L(r, 2), a = I(i), o = L(i, 2);
				G(o, () => c.plus, !0), E(o), E(n);
				var s = L(n, 2);
				let l;
				var u = P(s);
				G(u, () => c.fit);
				var d = L(u);
				E(s), E(t), R((e, t, n, c, u, f) => {
					J(r, "title", e), J(i, "title", t), U(a, `${n ?? ""}%`), J(o, "title", c), l = _i(s, 1, "ghost svelte-1n46o8q", null, l, { active: z(fe) === "fit" }), J(s, "title", u), U(d, ` ${f ?? ""}`);
				}, [
					() => Y("tip.zoomOut"),
					() => Y("tip.zoomCurrent"),
					() => Math.round(z(_e) * 100),
					() => Y("tip.zoomIn"),
					() => Y("tip.zoomFit"),
					() => Y("lbl.zoom.fit")
				]), B("click", r, () => ve(-1)), B("click", o, () => ve(1)), B("click", s, () => N(fe, "fit")), H(e, t);
			};
			W(o, (e) => {
				z(bi) === "zoom" && e(s);
			}), E(t), R((e, t) => {
				r = _i(n, 1, "ghost svelte-1n46o8q", null, r, { active: z(bi) === "zoom" }), J(n, "title", e), U(a, `${t ?? ""}%`);
			}, [() => Y("lbl.group.zoom"), () => Math.round(z(_e) * 100)]), B("click", n, () => N(bi, z(bi) === "zoom" ? null : "zoom", !0)), H(e, t);
		}, d = (e) => {
			var t = Ou(), n = F(t), r = I(n, !0), i = L(n, 2), a = P(i);
			G(a, () => c.minus, !0), E(a);
			var o = L(a, 2), s = I(o), l = L(o, 2);
			G(l, () => c.plus, !0), E(l);
			var u = L(l, 2);
			let d;
			G(u, () => c.fit, !0), E(u), E(i), R((e, t, n, i, c, f) => {
				U(r, e), J(a, "title", t), J(o, "title", n), U(s, `${i ?? ""}%`), J(l, "title", c), d = _i(u, 1, "ghost svelte-1n46o8q", null, d, { active: z(fe) === "fit" }), J(u, "title", f);
			}, [
				() => Y("lbl.group.zoom"),
				() => Y("tip.zoomOut"),
				() => Y("tip.zoomCurrent"),
				() => Math.round(z(_e) * 100),
				() => Y("tip.zoomIn"),
				() => Y("tip.zoomFit")
			]), B("click", a, () => ve(-1)), B("click", l, () => ve(1)), B("click", u, () => N(fe, "fit")), H(e, t);
		};
		W(l, (e) => {
			Si.zoom ? e(u) : e(d, -1);
		});
		var f = L(l, 2), p = (e) => {
			var t = Cu(), n = P(t);
			let r;
			var i = P(n);
			G(i, () => c.gridToggle), G(L(i), () => c.caret), E(n);
			var a = L(n, 2), o = (e) => {
				var t = ku(), n = P(t);
				let r;
				var i = P(n);
				G(i, () => c.gridToggle);
				var a = L(i);
				E(n);
				var o = L(n, 2);
				let s;
				var l = P(o);
				G(l, () => c.guides);
				var u = L(l);
				E(o), E(t), R((e, t, i, c) => {
					r = _i(n, 1, "ghost svelte-1n46o8q", null, r, { active: z(Ti) }), J(n, "title", e), U(a, ` ${t ?? ""}`), s = _i(o, 1, "ghost svelte-1n46o8q", null, s, { active: z(fi) }), J(o, "title", i), U(u, ` ${c ?? ""}`);
				}, [
					() => Y("tip.gridToggle"),
					() => Y("lbl.view.grid"),
					() => Y("tip.guides"),
					() => Y("lbl.view.guides")
				]), B("click", n, Ei), B("click", o, Ci), H(e, t);
			};
			W(a, (e) => {
				z(bi) === "view" && e(o);
			}), E(t), R((e) => {
				r = _i(n, 1, "ghost svelte-1n46o8q", null, r, { active: z(bi) === "view" || z(Ti) || z(fi) }), J(n, "title", e);
			}, [() => Y("lbl.group.view")]), B("click", n, () => N(bi, z(bi) === "view" ? null : "view", !0)), H(e, t);
		}, m = (e) => {
			var t = Au(), n = F(t), r = I(n, !0), i = L(n, 2), a = P(i);
			let o;
			G(a, () => c.gridToggle, !0), E(a);
			var s = L(a, 2);
			let l;
			G(s, () => c.guides, !0), E(s), E(i), R((e, t, n) => {
				U(r, e), o = _i(a, 1, "ghost svelte-1n46o8q", null, o, { active: z(Ti) }), J(a, "title", t), l = _i(s, 1, "ghost svelte-1n46o8q", null, l, { active: z(fi) }), J(s, "title", n);
			}, [
				() => Y("lbl.group.view"),
				() => Y("tip.gridToggle"),
				() => Y("tip.guides")
			]), B("click", a, Ei), B("click", s, Ci), H(e, t);
		};
		W(f, (e) => {
			Si.view ? e(p) : e(m, -1);
		}), E(i), Mi(i, (e) => N(xi, e), () => z(xi)), R((e, t) => {
			J(n, "title", e), U(r, t);
		}, [() => Y("tip.switchPage"), () => Pe()?.title ?? ""]), B("click", n, () => wt("pages")), H(e, t);
	};
	W(Wp, (e) => {
		z(g) && e(Gp);
	});
	var Kp = L(Wp, 2), qp = (e) => {
		var t = Mu(), n = P(t);
		G(n, () => c.phone);
		var r = L(n, 2), i = I(r, !0), a = I(L(r, 2), !0);
		E(t), R((e, n) => {
			J(t, "title", e), U(i, n), U(a, z(Ce));
		}, [() => Y("tip.attention"), () => Y(z(Ce) === 1 ? "ui.attentionOne" : "ui.attentionMany", { n: z(Ce) })]), B("click", t, Te), H(e, t);
	};
	W(Kp, (e) => {
		z(Ce) > 0 && e(qp);
	}), E(Up);
	var Jp = L(Up, 2), Yp = P(Jp), Xp = (e) => {
		var t = Pu(), n = P(t), r = I(P(n), !0);
		ke(2), E(n);
		var i = L(n, 2), a = P(i);
		let o;
		var s = P(a);
		G(s, () => c.restore);
		var l = I(L(s), !0);
		E(a);
		var u = L(a, 2), d = (e) => {
			var t = Nu(), n = P(t);
			G(n, () => c.restore);
			var r = L(n);
			E(t), R((e, n) => {
				J(t, "title", e), U(r, ` ${n ?? ""}`);
			}, [() => Y("tip.discardArmed"), () => Y("ui.discardConfirm")]), B("click", t, Pp), H(e, t);
		};
		W(u, (e) => {
			z(jp) && e(d);
		}), E(i), Mi(i, (e) => N(Mp, e), () => z(Mp)), E(t), R((e, t, i, s, c) => {
			J(n, "title", e), J(n, "aria-label", t), U(r, i), o = _i(a, 1, "discard-dot svelte-1n46o8q", null, o, { armed: z(jp) }), J(a, "title", s), U(l, c);
		}, [
			() => Y("ui.unpublished"),
			() => Y("ui.unpublished"),
			() => Y("ui.unpublished"),
			() => z(jp) ? Y("tip.discardArmed") : Y("tip.discard"),
			() => Y("ui.discard")
		]), B("click", a, Np), ui(2, t, () => Qi, () => ({
			x: 24,
			duration: kt ? 0 : 150
		})), H(e, t);
	};
	W(Yp, (e) => {
		z(v) && e(Xp);
	}), E(Jp);
	var Zp = L(Jp, 2), Qp = P(Zp), $p = (e) => {
		var t = Ru(), n = F(t), r = P(n), i = (e) => {
			var t = Fu(), n = F(t);
			G(n, () => c.eye);
			var r = I(L(n, 2), !0);
			R((e) => U(r, e), [() => Y("ui.cleanView")]), H(e, t);
		}, a = (e) => {
			var t = Fu(), n = F(t);
			G(n, () => c.pencil);
			var r = I(L(n, 2), !0);
			R((e) => U(r, e), [() => Y("ui.edit")]), H(e, t);
		};
		W(r, (e) => {
			z(re) ? e(i) : e(a, -1);
		}), E(n);
		var o = L(n, 2), s = (e) => {
			var t = Iu(), n = P(t), r = (e) => {
				var t = Fr();
				G(F(t), () => c.warn), H(e, t);
			};
			W(n, (e) => {
				z(ne).allowed || e(r);
			});
			var i = L(n, 1, !0);
			E(t), R((e) => {
				J(t, "title", e), U(i, z(ne).login);
			}, [() => z(ne).allowed ? Y("tip.hasPublishAccess") : Y("tip.noPublishAccess")]), H(e, t);
		}, l = (e) => {
			var t = Lu(), n = I(t, !0);
			R((e) => U(n, e), [() => Y("ui.loginGitHub")]), H(e, t);
		};
		W(o, (e) => {
			z(ne)?.loggedIn ? e(s) : z(ne) && e(l, 1);
		});
		var u = L(o, 2), d = P(u);
		G(d, () => c.external);
		var f = I(L(d, 2), !0);
		E(u);
		var p = L(u, 2), m = I(p, !0);
		R((e, t, r, i, a) => {
			J(n, "title", e), J(u, "href", t), J(u, "title", r), U(f, i), p.disabled = !z(v), U(m, a);
		}, [
			() => z(re) ? Y("tip.chromeHide") : Y("tip.chromeShow"),
			() => Pe()?.path ?? "/",
			() => Y("ui.viewSite"),
			() => Y("ui.viewSite"),
			() => Y("ui.publish")
		]), B("click", n, Wf), B("click", p, Ip), H(e, t);
	};
	W(Qp, (e) => {
		z(g) && e($p);
	}), E(Zp), E(Vp);
	var em = L(Vp, 2), tm = (e) => {
		var t = yf(), i = P(t), o = (e) => {
			var t = vf(), i = F(t), o = P(i);
			Xr(o, 17, () => pt, Kr, (e, t, n) => {
				var r = Bu(), i = F(r), a = I(i, !0);
				Xr(L(i, 2), 16, () => z(t), (e) => e, (e, t) => {
					var n = zu();
					let r;
					var i = I(n, !0);
					R(() => {
						r = _i(n, 1, "svelte-1n46o8q", null, r, { active: z(ft) === t }), U(i, ht[t]);
					}), B("click", n, () => wt(t)), H(e, n);
				}), R((e) => U(a, e), [() => Y(mt[n])]), H(e, r);
			});
			var s = L(o, 2), u = L(P(s), 2);
			let p;
			G(u, () => c.gear, !0), E(u);
			var m = L(u, 2), g = (e) => {
				var t = Vu(), n = P(t), r = I(n, !0), i = L(n, 2), a = P(i);
				X(L(a), {
					get value() {
						return z(d);
					},
					get options() {
						return l;
					},
					onchange: (e) => N(d, e, !0)
				}), E(i);
				var o = L(i, 2), s = P(o), c = L(s);
				{
					let e = /* @__PURE__ */ k(() => [["auto", Y("lang.auto")], ...bt()]);
					X(c, {
						get value() {
							return St;
						},
						get options() {
							return z(e);
						},
						onchange: Ct
					});
				}
				E(o);
				var u = L(o, 2), f = P(u), p = L(f);
				{
					let e = /* @__PURE__ */ k(() => [["strip", Y("settings.layoutPickerStrip")], ["menu", Y("settings.layoutPickerMenu")]]);
					X(p, {
						get value() {
							return z(mi);
						},
						get options() {
							return z(e);
						},
						onchange: hi
					});
				}
				E(u), E(t), R((e, t, n, c, l, d, p) => {
					U(r, e), J(i, "title", t), U(a, `${n ?? ""} `), J(o, "title", c), U(s, `${l ?? ""} `), J(u, "title", d), U(f, `${p ?? ""} `);
				}, [
					() => Y("settings.title"),
					() => Y("topbar.adminTheme.title"),
					() => Y("settings.theme"),
					() => Y("topbar.language.title"),
					() => Y("settings.language"),
					() => Y("tip.settings.layoutPicker"),
					() => Y("settings.layoutPicker")
				]), H(e, t);
			};
			W(m, (e) => {
				z(pi) && e(g);
			}), E(s), Mi(s, (e) => N(gi, e), () => z(gi)), E(i);
			var v = L(i, 2), y = (e) => {
				var t = _f(), i = P(t), o = I(i, !0), s = L(i, 2), l = (e) => {
					var t = Qu(), n = P(t);
					Xr(n, 17, () => z(O).pages, (e) => e.id, (e, t) => {
						var n = qu();
						let r;
						var i = P(n);
						K(i);
						var a = L(i, 2), o = (e) => {
							var t = Hu();
							R((e) => J(t, "title", e), [() => Y("tip.pages.homeLocked")]), H(e, t);
						}, s = (e) => {
							var n = Uu();
							K(n), R((e, t) => {
								q(n, e), J(n, "title", t);
							}, [() => z(t).path.slice(1), () => Y("tip.pages.slug")]), B("change", n, (e) => ea(z(t), e.target.value)), H(e, n);
						};
						W(a, (e) => {
							z(t).path === "/" ? e(o) : e(s, -1);
						});
						var l = L(a, 2), u = (e) => {
							var t = Wu();
							G(t, () => c.warn, !0), E(t), R((e) => J(t, "title", e), [() => Y("tip.pages.missingDescription")]), H(e, t);
						};
						W(l, (e) => {
							z(qi)[z(t).id] && e(u);
						});
						var d = L(l, 2), f = P(d);
						G(f, () => c.right, !0), E(f);
						var p = L(f, 2), m = P(p);
						G(m, () => c.kebab, !0), E(m);
						var h = L(m, 2), g = (e) => {
							var n = Ku(), r = P(n), i = P(r);
							G(i, () => c.bookmark);
							var a = L(i);
							E(r);
							var o = L(r, 2), s = (e) => {
								var n = Gu(), r = P(n);
								G(r, () => c.cross);
								var i = L(r);
								E(n), R((e, t) => {
									J(n, "title", e), U(i, ` ${t ?? ""}`);
								}, [() => Y("tip.pages.delete"), () => Y("ui.deletePage")]), B("click", n, () => {
									N(Fi, null), ta(z(t));
								}), H(e, n);
							};
							W(o, (e) => {
								z(t).path !== "/" && e(s);
							}), E(n), R((e) => U(a, ` ${e ?? ""}`), [() => Y("ui.savePageTemplate")]), B("click", r, () => zi(z(t))), H(e, n);
						};
						W(h, (e) => {
							z(Fi) === z(t).id && e(g);
						}), E(p), E(d), E(n), R((e, a, o) => {
							r = _i(n, 1, "page-row svelte-1n46o8q", null, r, { current: z(t).id === z(_) }), q(i, z(t).title), J(i, "title", e), J(f, "title", a), f.disabled = z(t).id === z(_), J(m, "title", o);
						}, [
							() => Y("tip.pages.title"),
							() => Y("tip.pages.open"),
							() => Y("tip.pages.menu")
						]), B("change", i, (e) => Bi(z(t), e.target.value)), B("click", f, () => ci(z(t).id)), B("click", m, () => N(Fi, z(Fi) === z(t).id ? null : z(t).id, !0)), H(e, n);
					});
					var r = L(n, 2), i = P(r), a = I(i, !0), o = L(i, 2), s = P(o), l = P(s), u = L(l);
					dt(u), E(s);
					var d = L(s, 2), f = P(d), p = L(f);
					K(p), E(d);
					var m = L(d, 2), h = P(m), g = L(h);
					dt(g), E(m);
					var v = L(m, 2), y = P(v), b = L(y), x = (e) => {
						var t = Ju();
						R((e) => {
							J(t, "src", z(Vi).ogImage), J(t, "alt", e);
						}, [() => Y("lbl.ogImage")]), H(e, t);
					};
					W(b, (e) => {
						z(Vi).ogImage && e(x);
					}), E(v);
					var S = L(v, 2), C = P(S), ee = P(C), te = L(ee);
					E(C);
					var ne = L(C, 2), w = (e) => {
						var t = $c();
						G(t, () => c.cross, !0), E(t), R((e) => J(t, "title", e), [() => Y("tip.seo.removeOgImage")]), B("click", t, () => Ui("ogImage", "")), H(e, t);
					};
					W(ne, (e) => {
						z(Vi).ogImage && e(w);
					}), E(S);
					var re = L(S, 2), ie = P(re);
					K(ie);
					var ae = L(ie);
					E(re), E(o), E(r);
					var oe = L(r, 4);
					K(oe);
					var se = L(oe, 2), ce = I(se, !0), le = L(se, 2), ue = I(le, !0), de = L(le, 2), fe = P(de);
					let pe;
					var me = P(fe), he = P(me);
					G(he, () => As({ sections: [] }), !0), E(he);
					var ge = I(L(he, 2), !0);
					E(me), E(fe), Xr(L(fe, 2), 17, () => Ms, (e) => e.id, (e, t) => {
						var n = Yu();
						let r;
						var i = P(n), a = P(i);
						G(a, () => Ni[z(t).id], !0), E(a);
						var o = I(L(a, 2), !0);
						E(i), E(n), R((e, a) => {
							r = _i(n, 1, "page-template-card svelte-1n46o8q", null, r, { picked: z(ji) === `preset:${z(t).id}` }), J(i, "title", e), U(o, a);
						}, [() => Y("tip.pages.templatePick", { name: Y(z(t).labelKey) }), () => Y(z(t).labelKey)]), B("click", i, () => N(ji, z(ji) === `preset:${z(t).id}` ? null : `preset:${z(t).id}`, !0)), H(e, n);
					}), E(de);
					var _e = L(de, 2), ve = (e) => {
						var t = Zu(), n = F(t), r = I(n, !0), i = L(n, 2);
						Xr(i, 20, () => z(wo).filter((e) => vo[e]?.data?.mal?.kind === "page"), (e) => e, (e, t) => {
							var n = Xu();
							let r;
							var i = P(n), a = P(i);
							G(a, () => As(vo[t].data.page), !0), E(a);
							var o = I(L(a, 2), !0);
							E(i);
							var s = L(i, 2);
							G(s, () => c.cross, !0), E(s), E(n), R((e, a) => {
								r = _i(n, 1, "page-template-card svelte-1n46o8q", null, r, { picked: z(ji) === t }), J(i, "title", e), U(o, vo[t].data.mal.name), J(s, "title", a);
							}, [() => Y("tip.pages.templatePick", { name: vo[t].data.mal.name }), () => Y("canvas.deleteTemplate")]), B("click", i, () => N(ji, z(ji) === t ? null : t, !0)), B("click", s, () => jo({ id: t })), H(e, n);
						}), E(i), R((e) => {
							U(r, e), yi(i, z(Pi));
						}, [() => Y("canvas.tabMyTemplates")]), H(e, t);
					}, ye = /* @__PURE__ */ k(() => z(wo).some((e) => vo[e]?.data?.mal?.kind === "page"));
					W(_e, (e) => {
						z(ye) && e(ve);
					}), E(t), R((e, t, n, r, i, o, c, _, b, x, S, te, ne, w, le, he, _e, ve, ye, be, xe, Se) => {
						U(a, e), J(s, "title", t), U(l, `${n ?? ""} `), q(u, z(Vi).description), J(d, "title", r), U(f, `${i ?? ""} `), q(p, z(Vi).ogTitle), J(p, "placeholder", o), J(m, "title", c), U(h, `${_ ?? ""} `), q(g, z(Vi).ogDescription), J(g, "placeholder", z(Vi).description), J(v, "title", b), U(y, `${x ?? ""} `), J(C, "title", S), U(ee, `${te ?? ""} `), J(re, "title", ne), wi(ie, w), U(ae, ` ${le ?? ""}`), J(oe, "placeholder", he), J(se, "title", _e), se.disabled = ve, U(ce, ye), U(ue, be), yi(de, z(Pi)), pe = _i(fe, 1, "page-template-card svelte-1n46o8q", null, pe, { picked: z(ji) === null }), J(me, "title", xe), U(ge, Se);
					}, [
						() => Y("ui.seoGroup", { page: z(O).pages.find((e) => e.id === z(_))?.title ?? "" }),
						() => Y("tip.seo.description"),
						() => Y("lbl.seoDescription"),
						() => Y("tip.seo.ogTitle"),
						() => Y("lbl.ogTitle"),
						() => z(O).pages.find((e) => e.id === z(_))?.title ?? "",
						() => Y("tip.seo.ogDescription"),
						() => Y("lbl.ogDescription"),
						() => Y("tip.seo.ogImage"),
						() => Y("lbl.ogImage"),
						() => Y("tip.seo.ogImage"),
						() => z(Vi).ogImage ? Y("ui.changeImage") : Y("ui.chooseImage"),
						() => Y("tip.seo.hideFromSearch"),
						() => z(O).pages.find((e) => e.id === z(_))?.noindex === !0,
						() => Y("lbl.hideFromSearch"),
						() => Y("ph.newPageName"),
						() => Y("hint.pages.autoMenu"),
						() => !z(Ai).trim(),
						() => Y("ui.createPage"),
						() => Y("canvas.tabPresets"),
						() => Y("tip.pages.blankPick"),
						() => Y("ui.blankPage")
					]), B("change", u, (e) => Ui("description", e.target.value)), B("change", p, (e) => Ui("ogTitle", e.target.value)), B("change", g, (e) => Ui("ogDescription", e.target.value)), B("change", te, Yi), B("change", ie, (e) => Wi(e.target.checked)), B("keydown", oe, (e) => e.key === "Enter" && Ri()), Oi(oe, () => z(Ai), (e) => N(Ai, e)), B("click", se, Ri), B("click", me, () => N(ji, null)), H(e, t);
				}, u = (e) => {
					var t = id(), r = P(t), i = P(r), a = I(i, !0), o = L(i, 2), s = P(o), l = P(s), u = L(l);
					{
						let e = /* @__PURE__ */ k(() => z(O).nav.logo?.type ?? "text"), t = /* @__PURE__ */ k(() => [
							["text", Y("blocks.text")],
							["image", Y("blocks.image")],
							["both", Y("opt.logo.both")]
						]);
						X(u, {
							get value() {
								return z(e);
							},
							get options() {
								return z(t);
							},
							onchange: (e) => ra(e)
						});
					}
					E(s);
					var d = L(s, 2), f = (e) => {
						var t = $u(), n = F(t);
						K(n);
						var r = L(n, 2), i = P(r);
						{
							let e = /* @__PURE__ */ k(() => Y("tip.nav.logoFont")), t = /* @__PURE__ */ k(() => z(O).nav.logo?.font ?? ""), n = /* @__PURE__ */ k(() => [["", Y("common.inherit")], ...Xc.map(([e, t]) => [t, Y(e)])]);
							X(i, {
								get title() {
									return z(e);
								},
								get value() {
									return z(t);
								},
								get options() {
									return z(n);
								},
								onchange: (e) => na({ font: e || void 0 })
							});
						}
						var a = L(i, 2);
						K(a);
						var o = L(a, 2);
						let s;
						var c = I(P(o), !0);
						E(o);
						var l = L(o, 2);
						let u;
						var d = I(P(l), !0);
						E(l), E(r), R((e, t, r, i, f, p, m) => {
							q(n, z(O).nav.logo?.value ?? ""), J(n, "placeholder", e), J(a, "title", t), q(a, z(O).nav.logo?.textSize ?? ""), s = _i(o, 1, "tbtn svelte-1n46o8q", null, s, { active: z(O).nav.logo?.bold !== !1 }), J(o, "title", r), U(c, i), u = _i(l, 1, "tbtn svelte-1n46o8q", null, u, { active: f }), J(l, "title", p), U(d, m);
						}, [
							() => Y("ph.nav.logoName"),
							() => Y("tip.nav.textSize"),
							() => Y("format.bold"),
							() => Y("format.boldLetter"),
							() => !!z(O).nav.logo?.italic,
							() => Y("format.italic"),
							() => Y("format.italicLetter")
						]), B("input", n, (e) => na({ value: e.target.value })), B("change", a, (e) => na({ textSize: e.target.value ? Number(e.target.value) : void 0 })), B("click", o, () => na({ bold: z(O).nav.logo?.bold === !1 })), B("click", l, () => na({ italic: !z(O).nav.logo?.italic })), H(e, t);
					};
					W(d, (e) => {
						(z(O).nav.logo?.type ?? "text") !== "image" && e(f);
					});
					var p = L(d, 2), m = (e) => {
						var t = ed(), n = P(t), r = P(n), i = L(r);
						E(n);
						var a = L(n, 2);
						K(a);
						var o = L(a, 2);
						K(o), E(t), R((e, t, i, s) => {
							J(n, "title", e), U(r, `${t ?? ""} `), J(a, "title", i), q(a, z(O).nav.logo?.size ?? 32), J(o, "title", s), q(o, z(O).nav.logo?.radius ?? 0);
						}, [
							() => Y("tip.webpAuto"),
							() => (z(O).nav.logo?.type === "image" ? z(O).nav.logo?.value : z(O).nav.logo?.image) ? Y("ui.changeImage") : Y("ui.chooseImage"),
							() => Y("tip.nav.logoHeight"),
							() => Y("tip.nav.logoRadius")
						]), B("change", i, ia), B("change", a, (e) => na({ size: Number(e.target.value) })), B("change", o, (e) => na({ radius: Number(e.target.value) })), H(e, t);
					};
					W(p, (e) => {
						(z(O).nav.logo?.type ?? "text") !== "text" && e(m);
					});
					var h = L(p, 2), g = (e) => {
						var t = _l(), n = P(t), r = L(n);
						{
							let e = /* @__PURE__ */ k(() => z(O).nav.logo?.order ?? "image-first"), t = /* @__PURE__ */ k(() => [["image-first", Y("opt.logo.imageFirst")], ["text-first", Y("opt.logo.textFirst")]]);
							X(r, {
								get value() {
									return z(e);
								},
								get options() {
									return z(t);
								},
								onchange: (e) => na({ order: e })
							});
						}
						E(t), R((e) => U(n, `${e ?? ""} `), [() => Y("lbl.order")]), H(e, t);
					};
					W(h, (e) => {
						z(O).nav.logo?.type === "both" && e(g);
					}), E(o), E(r);
					var _ = L(r, 2), v = P(_), y = I(v, !0), b = L(v, 2), x = P(b), S = P(x), C = L(S);
					{
						let e = /* @__PURE__ */ k(() => z(O).nav.variant ?? "bar"), t = /* @__PURE__ */ k(() => [
							["bar", Y("opt.navVariant.bar")],
							["floating", Y("opt.navVariant.floating")],
							["floating-square", Y("opt.navVariant.floatingSquare")],
							["floating-tab", Y("opt.navVariant.floatingTab")],
							["side-left", Y("opt.navVariant.sideLeft")],
							["side-right", Y("opt.navVariant.sideRight")]
						]);
						X(C, {
							get value() {
								return z(e);
							},
							get options() {
								return z(t);
							},
							onchange: (e) => Ua(e)
						});
					}
					E(x);
					var ee = L(x, 2), te = (e) => {
						var t = td(), n = F(t), r = P(n);
						K(r);
						var i = L(r);
						E(n);
						var a = L(n, 2), o = P(a);
						K(o);
						var s = L(o);
						E(a), R((e, t, c, l) => {
							J(n, "title", e), wi(r, z(O).nav.style?.glow === !0), U(i, ` ${t ?? ""}`), J(a, "title", c), wi(o, z(O).nav.style?.topGap !== !1), U(s, ` ${l ?? ""}`);
						}, [
							() => Y("tip.nav.glow"),
							() => Y("lbl.navGlow"),
							() => Y("tip.nav.topGap"),
							() => Y("lbl.navTopGap")
						]), B("change", r, (e) => Ka(e.target.checked)), B("change", o, (e) => ro(e.target.checked)), H(e, t);
					};
					W(ee, (e) => {
						z(Ba) && e(te);
					});
					var ne = L(ee, 2), w = (e) => {
						var t = Ol(), n = P(t);
						K(n);
						var r = L(n);
						E(t), R((e, i) => {
							J(t, "title", e), wi(n, z(O).nav.overlay === !0), U(r, ` ${i ?? ""}`);
						}, [() => Y("tip.nav.overlay"), () => Y("lbl.navOverlay")]), B("change", n, (e) => ki("nav", () => {
							e.target.checked ? z(O).nav.overlay = !0 : delete z(O).nav.overlay;
						})), H(e, t);
					};
					W(ne, (e) => {
						!z(Ba) && !z(za) && e(w);
					});
					var re = L(ne, 2), ie = (e) => {
						var t = _l(), n = P(t), r = L(n);
						{
							let e = /* @__PURE__ */ k(() => z(O).nav.style?.sideAlign ?? "left"), t = /* @__PURE__ */ k(() => [
								["left", Y("common.left")],
								["center", Y("common.center")],
								["right", Y("common.right")]
							]);
							X(r, {
								get value() {
									return z(e);
								},
								get options() {
									return z(t);
								},
								onchange: (e) => Ra("sideAlign", e === "left" ? void 0 : e)
							});
						}
						E(t), R((e, r) => {
							J(t, "title", e), U(n, `${r ?? ""} `);
						}, [() => Y("tip.nav.sideAlign"), () => Y("lbl.textAlign")]), H(e, t);
					};
					W(re, (e) => {
						z(za) && e(ie);
					});
					var ae = L(re, 2), oe = P(ae);
					K(oe);
					var se = L(oe);
					E(ae);
					var ce = L(ae, 2), le = P(ce), ue = L(le);
					{
						let e = /* @__PURE__ */ k(() => z(O).nav.style?.size ?? "md"), t = /* @__PURE__ */ k(() => [
							["sm", Y("opt.size.sm")],
							["md", Y("opt.size.md")],
							["lg", Y("opt.size.lg")],
							["xl", Y("opt.size.xl")]
						]);
						X(ue, {
							get value() {
								return z(e);
							},
							get options() {
								return z(t);
							},
							onchange: (e) => Ra("size", e === "md" ? void 0 : e)
						});
					}
					E(ce);
					var de = L(ce, 2), fe = P(de), pe = L(fe), me = (e) => {
						{
							let t = /* @__PURE__ */ k(() => z(O).nav.style?.sidePlacement ?? "top"), n = /* @__PURE__ */ k(() => [
								["top", Y("opt.place.top")],
								["middle", Y("opt.place.middle")],
								["bottom", Y("opt.place.bottom")]
							]);
							X(e, {
								get value() {
									return z(t);
								},
								get options() {
									return z(n);
								},
								onchange: (e) => Ra("sidePlacement", e === "top" ? void 0 : e)
							});
						}
					}, he = (e) => {
						{
							let t = /* @__PURE__ */ k(() => z(O).nav.layout ?? "right"), n = /* @__PURE__ */ k(() => [
								["right", Y("common.right")],
								["center", Y("common.center")],
								["left", Y("opt.layout.leftAfterLogo")]
							]);
							X(e, {
								get value() {
									return z(t);
								},
								get options() {
									return z(n);
								},
								onchange: (e) => La(e)
							});
						}
					};
					W(pe, (e) => {
						z(za) ? e(me) : e(he, -1);
					}), E(de);
					var ge = L(de, 2), _e = (e) => {
						var t = nd(), n = F(t), r = P(n);
						K(r);
						var i = L(r);
						E(n);
						var a = L(n, 2), o = (e) => {
							var t = _l(), n = P(t), r = L(n);
							{
								let e = /* @__PURE__ */ k(() => z(O).nav.scroll ?? "none"), t = /* @__PURE__ */ k(() => [
									["none", Y("opt.scroll.none")],
									["shrink", Y("opt.scroll.shrink")],
									["hide", Y("opt.scroll.hide")]
								]);
								X(r, {
									get value() {
										return z(e);
									},
									get options() {
										return z(t);
									},
									onchange: (e) => ki("nav", () => {
										e === "none" ? delete z(O).nav.scroll : z(O).nav.scroll = e;
									})
								});
							}
							E(t), R((e, r) => {
								J(t, "title", e), U(n, `${r ?? ""} `);
							}, [() => Y("tip.nav.scroll"), () => Y("lbl.navScroll")]), H(e, t);
						};
						W(a, (e) => {
							z(O).nav.sticky !== !1 && e(o);
						}), R((e, t) => {
							J(n, "title", e), wi(r, z(O).nav.sticky !== !1), U(i, ` ${t ?? ""}`);
						}, [() => Y("tip.nav.sticky"), () => Y("lbl.navSticky")]), B("change", r, (e) => ki("nav", () => {
							z(O).nav.sticky = e.target.checked;
						})), H(e, t);
					};
					W(ge, (e) => {
						z(za) || e(_e);
					});
					var ve = L(ge, 2), ye = P(ve);
					K(ye);
					var be = L(ye);
					E(ve);
					var xe = L(ve, 2), Se = (e) => {
						var t = _l(), n = P(t), r = L(n);
						{
							let e = /* @__PURE__ */ k(() => z(O).nav.cart?.href ?? ""), t = /* @__PURE__ */ k(() => [["", Y("common.none")], ...z(O).pages.map((e) => [e.path, e.title])]);
							X(r, {
								get value() {
									return z(e);
								},
								get options() {
									return z(t);
								},
								onchange: (e) => ki("nav", () => {
									e ? z(O).nav.cart.href = e : delete z(O).nav.cart.href;
								})
							});
						}
						E(t), R((e, r) => {
							J(t, "title", e), U(n, `${r ?? ""} `);
						}, [() => Y("tip.cart.checkout"), () => Y("lbl.checkoutPage")]), H(e, t);
					};
					W(xe, (e) => {
						z(O).nav.cart?.show && e(Se);
					});
					var Ce = L(xe, 2), we = P(Ce), Te = L(we);
					{
						let e = /* @__PURE__ */ k(() => z(O).nav.style?.hover ?? "standard"), t = /* @__PURE__ */ k(() => [
							["standard", Y("opt.hover.standard")],
							["underline", Y("opt.hover.underline")],
							["pill", Y("opt.hover.pill")],
							["lift-plain", Y("opt.hover.liftPlain")],
							["lift", Y("opt.hover.lift")]
						]);
						X(Te, {
							get value() {
								return z(e);
							},
							get options() {
								return z(t);
							},
							onchange: (e) => io(e)
						});
					}
					E(Ce);
					var Ee = L(Ce, 2), De = (e) => {
						var t = dl(), n = F(t), r = P(n), i = I(L(r));
						E(n);
						var a = L(n, 2);
						K(a), R((e, t, o) => {
							J(n, "title", e), U(r, `${t ?? ""} `), U(i, `${o ?? ""}%`), q(a, z(O).nav.style?.hoverGlow ?? .6);
						}, [
							() => Y("tip.nav.hoverGlow"),
							() => Y("lbl.glowStrength"),
							() => Math.round((z(O).nav.style?.hoverGlow ?? .6) * 100)
						]), B("input", a, (e) => Ra("hoverGlow", Number(e.target.value))), H(e, t);
					};
					W(Ee, (e) => {
						z(O).nav.style?.hover === "lift" && e(De);
					});
					var Oe = L(Ee, 2), T = (e) => {
						var t = _l(), n = P(t), r = L(n);
						{
							let e = /* @__PURE__ */ k(() => z(O).nav.style?.hoverColor ?? "accent"), t = /* @__PURE__ */ k(dr);
							da(r, {
								get value() {
									return z(e);
								},
								get tokens() {
									return z(t);
								},
								get label() {
									return z(Ha)[1];
								},
								onchange: (e) => Ra("hoverColor", e)
							});
						}
						E(t), R(() => {
							J(t, "title", z(Ha)[1]), U(n, `${z(Ha)[0] ?? ""} `);
						}), H(e, t);
					};
					W(Oe, (e) => {
						z(Ha) && e(T);
					});
					var ke = L(Oe, 2), Ae = P(ke), D = L(Ae);
					{
						let e = /* @__PURE__ */ k(() => z(O).nav.style?.hoverTextColor ?? "accent"), t = /* @__PURE__ */ k(dr), n = /* @__PURE__ */ k(() => Y("tip.nav.hoverTextColorPick"));
						da(D, {
							get value() {
								return z(e);
							},
							get tokens() {
								return z(t);
							},
							get label() {
								return z(n);
							},
							onchange: (e) => Ra("hoverTextColor", e)
						});
					}
					E(ke);
					var je = L(ke, 2), Me = P(je), Ne = L(Me);
					{
						let e = /* @__PURE__ */ k(() => z(O).nav.style?.textColor ?? "text"), t = /* @__PURE__ */ k(dr), n = /* @__PURE__ */ k(() => Y("tip.nav.textColorPick"));
						da(Ne, {
							get value() {
								return z(e);
							},
							get tokens() {
								return z(t);
							},
							get label() {
								return z(n);
							},
							onchange: (e) => Ra("textColor", e)
						});
					}
					E(je);
					var Pe = L(je, 4), Fe = I(Pe, !0), Ie = L(Pe, 2);
					n(Ie, () => or, () => z(O).nav?.style?.background?.layers ?? []), E(b), E(_);
					var Le = L(_, 2), Re = P(Le), ze = I(Re, !0), Be = L(Re, 2), Ve = P(Be), He = P(Ve), Ue = L(He);
					{
						let e = /* @__PURE__ */ k(() => z(O).nav.style?.subStyle ?? "card"), t = /* @__PURE__ */ k(() => z(za) ? [
							["card", Y("common.standard")],
							["pills", Y("opt.sub.pills")],
							["lines", Y("opt.sub.lines")]
						] : [
							["card", Y("opt.sub.card")],
							["flat", Y("opt.sub.flat")],
							["pills", Y("opt.sub.pills")],
							["lines", Y("opt.sub.lines")],
							["flyout", Y("opt.sub.flyout")]
						]);
						X(Ue, {
							get value() {
								return z(e);
							},
							get options() {
								return z(t);
							},
							onchange: (e) => Ra("subStyle", e === "card" ? void 0 : e)
						});
					}
					E(Ve);
					var We = L(Ve, 2), Ge = (e) => {
						var t = _l(), n = P(t), r = L(n);
						{
							let e = /* @__PURE__ */ k(() => z(O).nav.style?.subPillColor ?? "surface"), t = /* @__PURE__ */ k(dr), n = /* @__PURE__ */ k(() => Y("tip.nav.subPillColorPick"));
							da(r, {
								get value() {
									return z(e);
								},
								get tokens() {
									return z(t);
								},
								get label() {
									return z(n);
								},
								onchange: (e) => Ra("subPillColor", e)
							});
						}
						E(t), R((e, r) => {
							J(t, "title", e), U(n, `${r ?? ""} `);
						}, [() => Y("tip.nav.subPillColor"), () => Y("lbl.subPillColor")]), H(e, t);
					};
					W(We, (e) => {
						z(O).nav.style?.subStyle === "pills" && e(Ge);
					});
					var Ke = L(We, 2), qe = P(Ke), Je = L(qe);
					K(Je), E(Ke), E(Be), E(Le);
					var Ye = L(Le, 2), Xe = P(Ye), Ze = I(Xe, !0), Qe = L(Xe, 2), $e = P(Qe);
					Xr($e, 17, () => z(O).nav.items, Kr, (e, t, n) => {
						var r = rd(), i = F(r), a = P(i);
						K(a);
						var o = L(a, 2), s = P(o);
						G(s, () => c.plus, !0), E(s);
						var l = L(s, 2);
						l.disabled = n === 0, G(l, () => c.up, !0), E(l);
						var u = L(l, 2);
						G(u, () => c.down, !0), E(u);
						var d = L(u, 2);
						G(d, () => c.cross, !0), E(d), E(o);
						var f = L(o, 2), p = P(f);
						{
							let e = /* @__PURE__ */ k(() => z(t).page ?? (z(t).href == null ? "__none" : "__href")), r = /* @__PURE__ */ k(() => Y("tip.linkTarget")), i = /* @__PURE__ */ k(() => [
								...z(O).pages.map((e) => [e.id, e.title]),
								["__href", Y("opt.linkHref")],
								...z(t).children ? [["__none", Y("opt.noLink")]] : []
							]);
							X(p, {
								get value() {
									return z(e);
								},
								get title() {
									return z(r);
								},
								get options() {
									return z(i);
								},
								onchange: (e) => Fc(n, e)
							});
						}
						E(f);
						var m = L(f, 2), h = (e) => {
							var r = hl();
							K(r), R((e, n) => {
								q(r, z(t).href), J(r, "placeholder", e), J(r, "title", n);
							}, [() => Y("ph.hrefAnchor"), () => Y("tip.hrefAnchor")]), B("change", r, (e) => Ic(n, e.target.value)), H(e, r);
						};
						W(m, (e) => {
							!z(t).page && z(t).href != null && e(h);
						}), E(i), Xr(L(i, 2), 17, () => z(t).children ?? [], Kr, (e, r, i) => {
							var a = gl(), o = P(a);
							K(o);
							var s = L(o, 2), l = P(s);
							l.disabled = i === 0, G(l, () => c.up, !0), E(l);
							var u = L(l, 2);
							G(u, () => c.down, !0), E(u);
							var d = L(u, 2);
							G(d, () => c.cross, !0), E(d), E(s);
							var f = L(s, 2), p = P(f);
							{
								let e = /* @__PURE__ */ k(() => z(r).page ?? "__href"), t = /* @__PURE__ */ k(() => Y("tip.linkTarget")), a = /* @__PURE__ */ k(() => [...z(O).pages.map((e) => [e.id, e.title]), ["__href", Y("opt.linkHref")]]);
								X(p, {
									get value() {
										return z(e);
									},
									get title() {
										return z(t);
									},
									get options() {
										return z(a);
									},
									onchange: (e) => Uc(n, i, e)
								});
							}
							E(f);
							var m = L(f, 2), h = (e) => {
								var t = hl();
								K(t), R((e, n) => {
									q(t, z(r).href ?? ""), J(t, "placeholder", e), J(t, "title", n);
								}, [() => Y("ph.hrefAnchor"), () => Y("tip.hrefAnchor")]), B("change", t, (e) => Kc(n, i, e.target.value)), H(e, t);
							};
							W(m, (e) => {
								z(r).page || e(h);
							}), E(a), R((e, n) => {
								q(o, z(r).label), J(o, "title", e), u.disabled = i === z(t).children.length - 1, J(d, "title", n);
							}, [() => Y("tip.nav.childLabel"), () => Y("tip.nav.removeChild")]), B("input", o, (e) => Hc(n, i, e.target.value)), B("click", l, () => qc(n, i, -1)), B("click", u, () => qc(n, i, 1)), B("click", d, () => Jc(n, i)), H(e, a);
						}), R((e, r, i) => {
							q(a, z(t).label), J(a, "title", e), J(s, "title", r), u.disabled = n === z(O).nav.items.length - 1, J(d, "title", i);
						}, [
							() => Y("tip.nav.itemLabel"),
							() => Y("tip.nav.addChild"),
							() => Y("tip.nav.removeItem")
						]), B("input", a, (e) => Pc(n, e.target.value)), B("click", s, () => Vc(n)), B("click", l, () => Lc(n, -1)), B("click", u, () => Lc(n, 1)), B("click", d, () => zc(n)), H(e, r);
					});
					var et = L($e, 2), tt = I(et, !0);
					E(Qe), E(Ye), E(t), R((e, t, n, r, o, s, c, u, d, f, p, m, h, g, _, v, b, C, ee, te, ne, w, re, ie) => {
						J(i, "title", e), U(a, t), U(l, `${n ?? ""} `), U(y, r), J(x, "title", o), U(S, `${s ?? ""} `), J(ae, "title", c), wi(oe, z(O).nav.style?.blur !== !1), U(se, ` ${u ?? ""}`), U(le, `${d ?? ""} `), U(fe, `${f ?? ""} `), J(ve, "title", p), wi(ye, z(O).nav.cart?.show === !0), U(be, ` ${m ?? ""}`), U(we, `${h ?? ""} `), J(ke, "title", g), U(Ae, `${_ ?? ""} `), U(Me, `${v ?? ""} `), U(Fe, b), U(ze, C), U(He, `${ee ?? ""} `), J(Ke, "title", te), U(qe, `${ne ?? ""} `), q(Je, z(O).nav.style?.subColumns ?? 1), J(Xe, "title", w), U(Ze, re), U(tt, ie);
					}, [
						() => Y("hint.nav.logoHome"),
						() => Y("group.logo"),
						() => Y("common.type"),
						() => Y("group.appearance"),
						() => Y("tip.nav.variant"),
						() => Y("lbl.navVariant"),
						() => Y("tip.nav.blur"),
						() => Y("lbl.navBlur"),
						() => Y("lbl.size"),
						() => Y("lbl.navPlacement"),
						() => Y("tip.nav.cart"),
						() => Y("lbl.navCart"),
						() => Y("lbl.navHover"),
						() => Y("tip.nav.hoverTextColor"),
						() => Y("lbl.hoverTextColor"),
						() => Y("lbl.textColor"),
						() => Y("lbl.background"),
						() => Y("group.submenu"),
						() => Y("lbl.design"),
						() => Y("tip.nav.subColumns"),
						() => Y("lbl.columns"),
						() => Y("hint.nav.submenu"),
						() => Y("group.menuItems"),
						() => Y("ui.addMenuItem")
					]), B("change", oe, (e) => Ra("blur", e.target.checked)), B("change", ye, (e) => ki("nav", () => {
						e.target.checked ? z(O).nav.cart = {
							...z(O).nav.cart ?? {},
							show: !0
						} : delete z(O).nav.cart;
					})), B("change", Je, (e) => Ra("subColumns", Number(e.target.value) > 1 ? Number(e.target.value) : void 0)), B("click", et, Bc), H(e, t);
				}, d = (e) => {
					var t = ld(), n = P(t), r = P(n), i = L(r);
					K(i), E(n);
					var a = L(n, 2), o = P(a), s = L(o);
					K(s), E(a);
					var l = L(a, 2), u = P(l), d = L(u);
					{
						let e = /* @__PURE__ */ k(Aa), t = /* @__PURE__ */ k(ja);
						X(d, {
							get value() {
								return z(e);
							},
							get options() {
								return z(t);
							},
							onchange: (e) => Fa(e)
						});
					}
					E(l);
					var f = L(l, 4), p = I(f, !0), m = L(f, 2), h = P(m);
					Xr(h, 17, () => z(Ea), (e) => e.screen, (e, t) => {
						var n = ad(), r = P(n), i = I(r, !0), a = L(r, 2);
						let o;
						var s = I(a), c = I(L(a, 2), !0);
						E(n), R(() => {
							U(i, z(t).screen), o = _i(a, 1, "cw-bar svelte-1n46o8q", null, o, { fluid: !z(t).bound }), yi(s, `width:${z(t).pct ?? ""}%`), U(c, z(t).bound ? `${z(t).margin}` : "-");
						}), H(e, n);
					});
					var g = L(h, 2), _ = P(g), v = I(_, !0), y = I(L(_, 2), !0);
					E(g);
					var b = L(g, 2), x = (e) => {
						var t = od(), n = I(t, !0);
						R((e) => U(n, e), [() => Y("lbl.bindsFrom", { n: z(he) })]), H(e, t);
					};
					W(b, (e) => {
						z(fa) !== "full" && e(x);
					}), E(m);
					var S = L(m, 2);
					Xr(S, 21, () => Xa, (e) => e.id, (e, t) => {
						var n = zu();
						let r;
						var i = I(n, !0);
						R((e) => {
							r = _i(n, 1, "svelte-1n46o8q", null, r, { on: z(ma) === z(t).id }), U(i, e);
						}, [() => Y(`lbl.width.${z(t).id}`)]), B("click", n, () => Oa(z(t).width)), H(e, n);
					}), E(S);
					var C = L(S, 2), ee = (e) => {
						var t = sd(), n = P(t), r = I(n, !0), i = L(n, 2);
						K(i);
						var a = I(L(i, 2));
						E(t), R((e, n) => {
							J(t, "title", e), U(r, n), J(i, "min", 960), J(i, "max", Ja), J(i, "step", 20), q(i, z(Ta)), U(a, `${z(Ta) ?? ""} px`);
						}, [() => Y("tip.site.contentWidthFree"), () => Y("lbl.widthFree")]), B("input", i, (e) => Oa(e.target.valueAsNumber)), H(e, t);
					};
					W(C, (e) => {
						z(fa) !== "full" && e(ee);
					});
					var te = L(C, 2), ne = I(te, !0), w = L(te, 2);
					Xr(w, 21, () => Ya, (e) => e.id, (e, t) => {
						var n = zu();
						let r;
						var i = I(n, !0);
						R((e) => {
							r = _i(n, 1, "svelte-1n46o8q", null, r, { on: z(_a) === z(t).id }), U(i, e);
						}, [() => Y(`lbl.gutter.${z(t).id}`)]), B("click", n, () => ka(z(t).gutter)), H(e, n);
					}), E(w);
					var re = L(w, 2), ie = P(re), ae = I(ie, !0), oe = L(ie, 2), se = P(oe), ce = P(se), le = I(ce, !0), ue = L(ce, 2);
					K(ue);
					var de = I(L(ue, 2));
					E(se), E(oe), E(re);
					var fe = L(re, 4), pe = P(fe), me = L(pe), ge = (e) => {
						var t = Ju();
						R((e) => {
							J(t, "src", z(O).site.icon), J(t, "alt", e);
						}, [() => Y("lbl.siteIcon")]), H(e, t);
					};
					W(me, (e) => {
						z(O).site.icon && e(ge);
					}), E(fe);
					var _e = L(fe, 2), ve = P(_e), ye = P(ve), be = L(ye);
					E(ve);
					var xe = L(ve, 2), Se = (e) => {
						var t = cd(), n = F(t);
						G(n, () => c.pencil ?? "✎", !0), E(n);
						var r = L(n, 2);
						G(r, () => c.cross, !0), E(r), R((e, t) => {
							J(n, "title", e), J(r, "title", t);
						}, [() => Y("tip.site.editIcon"), () => Y("tip.site.removeIcon")]), B("click", n, () => N(aa, z(O).site.icon, !0)), B("click", r, ca), H(e, t);
					};
					W(xe, (e) => {
						z(O).site.icon && e(Se);
					}), E(_e), E(t), R((e, t, c, d, m, h, g, _, b, x, S, C, ee, w, ie, oe, ce, fe, me, he) => {
						J(n, "title", e), U(r, `${t ?? ""} `), q(i, z(O).site.title ?? ""), J(i, "placeholder", c), J(a, "title", d), U(o, `${m ?? ""} `), q(s, z(O).site.description ?? ""), J(s, "placeholder", h), J(l, "title", g), U(u, `${_ ?? ""} `), J(f, "title", b), U(p, x), U(v, S), U(y, C), J(te, "title", ee), U(ne, w), re.open = z(_a) === null || z(va), U(ae, ie), J(se, "title", oe), U(le, ce), J(ue, "min", 0), J(ue, "max", 12), J(ue, "step", 1), q(ue, z(pa)), U(de, `${z(pa) ?? ""} vw`), U(pe, `${fe ?? ""} `), J(ve, "title", me), U(ye, `${he ?? ""} `);
					}, [
						() => Y("tip.site.name"),
						() => Y("lbl.name"),
						() => Y("ph.site.name"),
						() => Y("tip.site.description"),
						() => Y("lbl.description"),
						() => Y("ph.site.description"),
						() => Y("site.langTitle"),
						() => Y("site.langLabel"),
						() => Y("tip.site.contentWidth"),
						() => Y("lbl.contentWidth"),
						() => Y("lbl.screenPx"),
						() => Y("lbl.marginPx"),
						() => Y("tip.site.gutter"),
						() => Y("lbl.gutter"),
						() => Y("group.advanced"),
						() => Y("tip.site.gutterVw"),
						() => Y("lbl.gutterVw"),
						() => Y("lbl.siteIcon"),
						() => Y("tip.site.icon"),
						() => z(O).site.icon ? Y("ui.changeIcon") : Y("ui.chooseIcon")
					]), B("input", i, (e) => la(e.target.value)), B("input", s, (e) => ua(e.target.value)), Tr("toggle", re, (e) => N(va, e.currentTarget.open, !0)), B("input", ue, (e) => ka(e.target.valueAsNumber)), B("change", be, oa), H(e, t);
				}, p = (e) => {
					var t = _d();
					{
						let e = (e, t = f, n = f) => {
							var r = dd(), i = P(r), a = (e) => {
								var t = ud(), r = I(t, !0);
								R(() => U(r, n())), H(e, t);
							};
							W(i, (e) => {
								n() && e(a);
							});
							var o = L(i, 2), s = P(o), c = I(s, !0), l = L(s, 2), u = I(l, !0), d = L(l, 2), p = P(d), m = I(p, !0), h = I(L(p), !0);
							E(d), E(o), E(r), R((e, t, n, r, i, a, s, l, d) => {
								yi(o, `--tv-bg:${e ?? ""};--tv-surface:${t ?? ""};--tv-text:${n ?? ""};--tv-accent:${r ?? ""};--tv-accent-ink:${i ?? ""}`), U(c, a), U(u, s), U(m, l), U(h, d);
							}, [
								() => zf(t().bg, t()),
								() => zf(t().surface, t()),
								() => zf(t().text, t()),
								() => zf(t().accent, t()),
								() => zf(t()["accent-text"] ?? t().bg, t()),
								() => Y("preview.heading"),
								() => Y("preview.cardBody"),
								() => Y("preview.button"),
								() => Y("preview.link")
							]), H(e, r);
						};
						var n = P(t), r = I(n, !0), i = L(n, 2);
						Xr(i, 21, () => Vf, (e) => e.id, (e, t) => {
							var n = fd();
							let r;
							var i = P(n), a = P(i), o = L(a), s = L(o), c = L(s);
							E(i);
							var l = I(L(i, 2), !0);
							E(n), R(() => {
								r = _i(n, 1, "theme-preset svelte-1n46o8q", null, r, { sel: z(Uf) === z(t).id }), J(n, "title", `${z(t).name} - ${z(t).note}`), yi(a, `background:${z(t).light.bg ?? ""}`), yi(o, `background:${z(t).light.surface ?? ""}`), yi(s, `background:${z(t).light.accent ?? ""}`), yi(c, `background:${z(t).light.text ?? ""}`), U(l, z(t).name);
							}), B("click", n, () => Hf(z(t))), H(e, n);
						}), E(i);
						var a = L(i, 2), o = I(a, !0), s = L(a, 2), c = P(s);
						K(c);
						var l = L(c);
						E(s);
						var u = L(s, 2), d = (e) => {
							var t = pd(), n = P(t), r = I(n, !0), i = L(n, 2), a = P(i);
							let o;
							var s = I(a, !0), c = L(a, 2);
							let l;
							var u = I(c, !0);
							E(i), E(t), R((e, t, n, i) => {
								U(r, e), J(a, "title", t), o = _i(a, 1, "svelte-1n46o8q", null, o, { on: z(mr) }), U(s, n), l = _i(c, 1, "svelte-1n46o8q", null, l, { on: !z(mr) }), U(u, i);
							}, [
								() => Y("lbl.darkColors"),
								() => Y("hint.theme.autoDark"),
								() => Y("opt.auto"),
								() => Y("opt.custom")
							]), B("click", a, () => Ff(!0)), B("click", c, () => Ff(!1)), H(e, t);
						};
						W(u, (e) => {
							z(pr) && e(d);
						});
						var p = L(u, 2), m = P(p), g = (e) => {
							var t = md(), n = I(t, !0);
							R((e) => U(n, e), [() => Y("lbl.light")]), H(e, t);
						};
						W(m, (e) => {
							z(pr) && e(g);
						});
						var _ = L(m, 2);
						let D;
						var v = I(_, !0);
						E(p);
						var y = L(p, 2);
						Xr(y, 21, () => fr, ([e, t, n]) => e, (e, t) => {
							var n = /* @__PURE__ */ k(() => h(z(t), 3));
							let r = () => z(n)[0], i = () => z(n)[1], a = () => z(n)[2];
							var o = hd(), s = P(o);
							{
								let e = /* @__PURE__ */ k(() => z(O).theme.tokens.color[r()] ?? z(O).theme.tokens.color.bg), t = /* @__PURE__ */ k(dr);
								da(s, {
									get value() {
										return z(e);
									},
									get tokens() {
										return z(t);
									},
									get label() {
										return i();
									},
									onchange: (e) => Df(r(), e)
								});
							}
							var c = L(s, 2), l = I(c, !0), u = I(L(c, 2), !0);
							E(o), R((e) => {
								U(l, a()), U(u, e);
							}, [() => zf(z(O).theme.tokens.color[r()] ?? z(O).theme.tokens.color.bg, z(gr))]), H(e, o);
						}), E(y);
						var b = L(y, 2), x = (e) => {
							var t = gd(), n = F(t), r = P(n), i = I(r, !0), a = L(r, 2);
							let o;
							var s = I(a, !0);
							E(n);
							var c = L(n, 2);
							let l;
							Xr(c, 21, () => fr, ([e, t, n]) => e, (e, t) => {
								var n = /* @__PURE__ */ k(() => h(z(t), 3));
								let r = () => z(n)[0], i = () => z(n)[1], a = () => z(n)[2];
								var o = hd(), s = P(o);
								{
									let e = /* @__PURE__ */ k(() => z(O).theme.alt.tokens.color[r()] ?? z(_r)[r()] ?? z(O).theme.tokens.color.bg), t = /* @__PURE__ */ k(dr), n = /* @__PURE__ */ k(() => Y("theme.darkColorLabel", { name: i() }));
									da(s, {
										get value() {
											return z(e);
										},
										get tokens() {
											return z(t);
										},
										get label() {
											return z(n);
										},
										onchange: (e) => Mf(r(), e)
									});
								}
								var c = L(s, 2), l = I(c, !0), u = I(L(c, 2), !0);
								E(o), R((e) => {
									U(l, a()), U(u, e);
								}, [() => zf(z(O).theme.alt.tokens.color[r()] ?? z(_r)[r()], z(_r))]), H(e, o);
							}), E(c), R((e, t, n) => {
								U(i, e), o = _i(a, 1, "chip svelte-1n46o8q", null, o, { accent: z(hr) === "dark" }), J(a, "title", t), U(s, n), l = _i(c, 1, "palcells svelte-1n46o8q", null, l, { autopal: z(mr) });
							}, [
								() => Y("lbl.dark"),
								() => Y("tip.theme.darkDefault"),
								() => Y("common.standard")
							]), B("click", a, () => Nf("dark")), H(e, t);
						};
						W(b, (e) => {
							z(pr) && e(x);
						});
						var S = L(b, 2), C = P(S);
						{
							let t = /* @__PURE__ */ k(() => z(pr) ? Y("lbl.light") : "");
							e(C, () => z(gr), () => z(t));
						}
						var ee = L(C, 2), te = (t) => {
							{
								let n = /* @__PURE__ */ k(() => Y("lbl.dark"));
								e(t, () => z(_r), () => z(n));
							}
						};
						W(ee, (e) => {
							z(pr) && e(te);
						}), E(S);
						var ne = L(S, 2), w = P(ne), re = I(w, !0), ie = L(w, 2), ae = P(ie), oe = P(ae), se = L(oe);
						{
							let e = /* @__PURE__ */ k(() => If("heading"));
							X(se, {
								get value() {
									return z(O).theme.tokens.font.heading;
								},
								get options() {
									return z(e);
								},
								onchange: (e) => Of("heading", e)
							});
						}
						E(ae);
						var ce = L(ae, 2), le = P(ce), ue = L(le);
						{
							let e = /* @__PURE__ */ k(() => If("body"));
							X(ue, {
								get value() {
									return z(O).theme.tokens.font.body;
								},
								get options() {
									return z(e);
								},
								onchange: (e) => Of("body", e)
							});
						}
						E(ce);
						var de = L(ce, 2), fe = P(de), pe = I(fe, !0), me = L(fe, 2), he = I(me, !0);
						E(de), E(ie), E(ne);
						var ge = L(ne, 2), _e = P(ge), ve = I(_e, !0), ye = L(_e, 2), be = P(ye), xe = P(be), Se = I(xe, !0), Ce = I(L(xe, 2), !0);
						E(be);
						var we = L(be, 2), Te = P(we, !0), Ee = I(L(Te), !0);
						E(we);
						var De = L(we, 2);
						K(De);
						var Oe = L(De, 2), T = P(Oe, !0), ke = I(L(T), !0);
						E(Oe);
						var Ae = L(Oe, 2);
						K(Ae), E(ye), E(ge), E(t), R((e, t, n, i, a, u, d, f, p, m, h, g, y, b, x, S, C, ee) => {
							U(r, e), U(o, t), J(s, "title", n), wi(c, z(pr)), U(l, ` ${i ?? ""}`), D = _i(_, 1, "chip svelte-1n46o8q", null, D, { accent: z(hr) === "light" }), J(_, "title", a), U(v, u), U(re, d), U(oe, `${f ?? ""} `), U(le, `${p ?? ""} `), yi(fe, `font-family:${z(O).theme.tokens.font.heading ?? ""}`), U(pe, m), yi(me, `font-family:${z(O).theme.tokens.font.body ?? ""}`), U(he, h), U(ve, g), yi(be, `--r-sm:${z(O).theme.tokens.radius.sm ?? ""};--r-md:${z(O).theme.tokens.radius.md ?? ""}`), U(Se, y), U(Ce, b), U(Te, x), U(Ee, z(O).theme.tokens.radius.sm), q(De, S), U(T, C), U(ke, z(O).theme.tokens.radius.md), q(Ae, ee);
						}, [
							() => Y("lbl.themePresets"),
							() => Y("lbl.colors"),
							() => Y("tip.theme.dualMode"),
							() => Y("lbl.dualMode"),
							() => Y("tip.theme.defaultScheme"),
							() => Y("common.standard"),
							() => Y("group.typography"),
							() => Y("lbl.headings"),
							() => Y("lbl.bodyText"),
							() => Y("preview.heading"),
							() => Y("preview.bodySample"),
							() => Y("group.shape"),
							() => Y("preview.button"),
							() => Y("preview.card"),
							() => Y("lbl.smallCorners"),
							() => Lf(z(O).theme.tokens.radius.sm),
							() => Y("lbl.largeCorners"),
							() => Lf(z(O).theme.tokens.radius.md)
						]), B("change", c, (e) => Pf(e.target.checked)), B("click", _, () => Nf("light")), B("input", De, (e) => Rf("sm", Number(e.target.value))), B("input", Ae, (e) => Rf("md", Number(e.target.value)));
					}
					H(e, t);
				}, m = (e) => {
					var t = Sd();
					let n;
					var r = P(t);
					K(r);
					var i = L(r, 2), a = (e) => {
						var t = Fr();
						Xr(F(t), 17, () => Is(pp(), z(fp), (e) => e.label), (e) => e.label, (e, t) => {
							var n = Fr(), r = F(n), i = (e) => {
								var n = vd(), r = P(n), i = L(r);
								E(n), R((e) => {
									J(n, "title", e), U(r, `${z(t).label ?? ""} `);
								}, [() => Y("tip.webpAuto")]), B("change", i, gp), H(e, n);
							}, a = (e) => {
								var n = yd(), r = P(n), i = L(r);
								E(n), R((e) => {
									J(n, "title", e), U(r, `${z(t).label ?? ""} `);
								}, [() => Y("tip.blocks.galleryImages")]), B("change", i, bp), H(e, n);
							}, o = (e) => {
								var n = Al(), r = I(n, !0);
								R(() => U(r, z(t).label)), B("click", n, () => mp(z(t))), H(e, n);
							};
							W(r, (e) => {
								z(t).act === "image" ? e(i) : z(t).act === "galleryImages" ? e(a, 1) : e(o, -1);
							}), H(e, n);
						}, (e) => {
							var t = bl(), n = I(t, !0);
							R((e) => U(n, e), [() => Y("canvas.searchEmpty")]), H(e, t);
						}), H(e, t);
					}, o = /* @__PURE__ */ k(() => z(fp).trim()), s = (e) => {
						var t = xd(), n = F(t), r = P(n), i = I(r, !0), a = L(r, 2), o = P(a), s = I(o, !0), c = L(o, 2), l = I(c, !0);
						E(a), E(n);
						var u = L(n, 2), d = I(u, !0), f = L(u, 2), p = P(f), m = L(p);
						E(f);
						var h = L(f, 2), g = I(h, !0), _ = L(h, 2), v = I(_, !0), y = L(_, 2), b = I(y, !0), x = L(y, 2), S = I(x, !0), C = L(x, 2), ee = I(C, !0), te = L(C, 2), ne = I(te, !0), w = L(te, 2), re = I(w, !0), ie = L(w, 2), ae = I(ie, !0), oe = L(ie, 2), se = I(oe, !0), ce = L(oe, 2), le = I(ce, !0), ue = L(ce, 2), de = I(ue, !0), fe = L(ue, 2), pe = I(fe, !0), me = L(fe, 2), he = I(me, !0), ge = L(me, 2), _e = I(ge, !0), ve = L(ge, 2), ye = P(ve), be = I(ye, !0), xe = L(ye, 2), Se = P(xe), Ce = I(Se, !0), we = L(Se, 2), Te = P(we), Ee = L(Te);
						E(we), E(xe), E(ve);
						var De = L(ve, 2), Oe = P(De), T = I(Oe, !0), ke = L(Oe, 2), Ae = P(ke), O = I(Ae, !0), je = L(Ae, 2), Me = I(je, !0), Ne = L(je, 2), Pe = I(Ne, !0), Fe = L(Ne, 2), Ie = I(Fe, !0), Le = L(Fe, 2), Re = I(Le, !0);
						E(ke), E(De);
						var ze = L(De, 2), Be = (e) => {
							let t = /* @__PURE__ */ k(() => z(wo).filter((e) => vo[e]?.data?.mal?.kind === "blocks"));
							var n = bd(), r = P(n), i = I(r, !0), a = L(r, 2);
							Xr(a, 20, () => z(t), (e) => e, (e, t) => {
								var n = Al(), r = I(n, !0);
								R((e) => {
									J(n, "title", e), U(r, vo[t].data.mal.name);
								}, [() => Y("canvas.insertGroup")]), B("click", n, () => D?.sendInsertTemplate(t)), H(e, n);
							}), E(a), E(n), R((e) => U(i, e), [() => Y("canvas.tabMyTemplates")]), H(e, n);
						}, Ve = /* @__PURE__ */ k(() => z(wo).some((e) => vo[e]?.data?.mal?.kind === "blocks"));
						W(ze, (e) => {
							z(Ve) && e(Be);
						});
						var He = L(ze, 2), Ue = (e) => {
							var t = bd(), n = P(t), r = I(n, !0), i = L(n, 2);
							Xr(i, 21, () => z(up), (e) => e.type, (e, t) => {
								var n = Fr(), r = F(n), i = (e) => {
									var n = bd(), r = P(n), i = I(r, !0), a = L(r, 2);
									Xr(a, 21, () => z(t).variants, (e) => e.label, (e, n) => {
										var r = Al(), i = I(r, !0);
										R((e) => {
											J(r, "title", e), U(i, z(n).label);
										}, [() => Y("tip.blocks.fromPlugin", { plugin: z(t).plugin })]), B("click", r, () => dp(z(t), z(n).props)), H(e, r);
									}), E(a), E(n), R(() => U(i, z(t).label)), H(e, n);
								}, a = (e) => {
									var n = Al(), r = I(n, !0);
									R((e) => {
										J(n, "title", e), U(r, z(t).label);
									}, [() => Y("tip.blocks.fromPlugin", { plugin: z(t).plugin })]), B("click", n, () => dp(z(t))), H(e, n);
								};
								W(r, (e) => {
									z(t).variants?.length ? e(i) : e(a, -1);
								}), H(e, n);
							}), E(i), E(t), R((e) => U(r, e), [() => Y("panel.plugins")]), H(e, t);
						};
						W(He, (e) => {
							z(up).length && e(Ue);
						}), R((e, t, n, r, a, o, u, m, ve, ye, xe, Ee, De, Oe, E, ke, Ae, D, je, Ne, Fe, Le, ze, Be, Ve, He, Ue, We, Ge, Ke, qe, Je, Ye, Xe, Ze, Qe, $e, et, tt, nt, rt, it, at, ot, st, ct) => {
							U(i, e), U(s, t), J(c, "title", n), U(l, r), U(d, a), J(f, "title", o), U(p, `${u ?? ""} `), J(h, "title", m), U(g, ve), J(_, "title", ye), U(v, xe), J(y, "title", Ee), U(b, De), J(x, "title", Oe), U(S, E), J(C, "title", ke), U(ee, Ae), J(te, "title", D), U(ne, je), J(w, "title", Ne), U(re, Fe), J(ie, "title", Le), U(ae, ze), J(oe, "title", Be), U(se, Ve), J(ce, "title", He), U(le, Ue), J(ue, "title", We), U(de, Ge), J(fe, "title", Ke), U(pe, qe), J(me, "title", Je), U(he, Ye), J(ge, "title", Xe), U(_e, Ze), U(be, Qe), J(Se, "title", $e), U(Ce, et), J(we, "title", tt), U(Te, `${nt ?? ""} `), U(T, rt), U(O, it), U(Me, at), U(Pe, ot), U(Ie, st), U(Re, ct);
						}, [
							() => Y("blocks.text"),
							() => Y("blocks.text"),
							() => Y("tip.blocks.textBox"),
							() => Y("ui.textBox"),
							() => Y("blocks.button"),
							() => Y("tip.webpAuto"),
							() => Y("blocks.image"),
							() => Y("tip.blocks.video"),
							() => Y("blocks.video"),
							() => Y("tip.blocks.icon"),
							() => Y("blocks.icon"),
							() => Y("tip.blocks.collection"),
							() => Y("blocks.collection"),
							() => Y("tip.blocks.faq"),
							() => Y("blocks.faq"),
							() => Y("tip.blocks.timeline"),
							() => Y("blocks.timeline"),
							() => Y("tip.blocks.quote"),
							() => Y("blocks.quote"),
							() => Y("tip.blocks.stats"),
							() => Y("blocks.stats"),
							() => Y("tip.blocks.table"),
							() => Y("blocks.table"),
							() => Y("tip.blocks.share"),
							() => Y("blocks.share"),
							() => Y("tip.blocks.countdown"),
							() => Y("blocks.countdown"),
							() => Y("tip.blocks.audio"),
							() => Y("blocks.audio"),
							() => Y("tip.blocks.product"),
							() => Y("blocks.product"),
							() => Y("tip.blocks.cart"),
							() => Y("blocks.cart"),
							() => Y("tip.blocks.checkout"),
							() => Y("blocks.checkout"),
							() => Y("blocks.gallery"),
							() => Y("tip.blocks.gallery"),
							() => Y("ui.emptyGallery"),
							() => Y("tip.blocks.galleryImages"),
							() => Y("ui.galleryWithImages"),
							() => Y("group.shapes"),
							() => Y("shape.line"),
							() => Y("shape.arrow"),
							() => Y("shape.circle"),
							() => Y("shape.rect"),
							() => Y("shape.triangle")
						]), B("click", o, () => lp("text")), B("click", c, () => lp("text-box")), B("click", u, () => lp("button")), B("change", m, gp), B("click", h, () => lp("video")), B("click", _, () => lp("icon")), B("click", y, () => lp("collection")), B("click", x, () => lp("faq")), B("click", C, () => lp("timeline")), B("click", te, () => lp("quote")), B("click", w, () => lp("stats")), B("click", ie, () => lp("table")), B("click", oe, () => lp("share")), B("click", ce, () => lp("countdown")), B("click", ue, () => lp("audio")), B("click", fe, () => lp("product")), B("click", me, () => lp("cart")), B("click", ge, () => lp("checkout")), B("click", Se, () => lp("gallery")), B("change", Ee, bp), B("click", Ae, () => lp("shape-line")), B("click", je, () => lp("shape-arrow")), B("click", Ne, () => lp("shape-circle")), B("click", Fe, () => lp("shape-rect")), B("click", Le, () => lp("shape-triangle")), H(e, t);
					};
					W(i, (e) => {
						z(o) ? e(a) : e(s, -1);
					}), E(t), R((e, i, a) => {
						n = _i(t, 1, "panel-body svelte-1n46o8q", null, n, { locked: z(se) === "mobile" }), J(t, "title", e), J(r, "placeholder", i), J(r, "title", a);
					}, [
						() => z(se) === "mobile" ? Y("tip.blocks.mobileLocked") : void 0,
						() => Y("canvas.searchBlocks"),
						() => Y("canvas.searchBlocks")
					]), Oi(r, () => z(fp), (e) => N(fp, e)), H(e, t);
				}, g = (e) => {
					var t = Cd(), n = P(t), r = P(n), i = I(L(r));
					E(n);
					var a = L(n, 2);
					K(a);
					var o = L(a, 2), s = P(o);
					K(s);
					var c = L(s);
					E(o), E(t), R((e, t) => {
						U(r, `${e ?? ""} `), U(i, `${z(w).size ?? ""} px`), q(a, z(w).size), wi(s, z(w).snap !== !1), U(c, ` ${t ?? ""}`);
					}, [() => Y("lbl.gridSize"), () => Y("lbl.gridSnap")]), B("input", a, (e) => Lr("size", Number(e.target.value))), B("change", s, (e) => Lr("snap", e.target.checked)), H(e, t);
				}, v = (e) => {
					var t = Ad(), r = P(t), i = (e) => {
						var t = wd(), n = F(t), r = I(n, !0), i = L(n, 2);
						a(i), R((e) => U(r, e), [() => Y("blocks.suffix", { label: sn[z(A).type] ?? z(A).type })]), H(e, t);
					}, o = (e) => {
						var t = kd(), r = F(t), i = I(r, !0), a = L(r, 2), o = P(a), s = L(o);
						K(s), E(a);
						var l = L(a, 4), u = P(l);
						K(u);
						var d = L(u);
						E(l);
						var f = L(l, 2), p = (e) => {
							var t = Td(), n = F(t), r = P(n), i = I(L(r));
							E(n);
							var a = L(n, 2);
							K(a), R((e) => {
								U(r, `${e ?? ""} `), U(i, `${z(dn).size ?? ""} px`), q(a, z(dn).size);
							}, [() => Y("lbl.gridSize")]), B("input", a, (e) => Ir("size", Number(e.target.value))), H(e, t);
						};
						W(f, (e) => {
							z(dn) && e(p);
						});
						var m = L(f, 4), g = I(m, !0), _ = L(m, 2);
						Xr(_, 21, () => [["", "common.standard"], ...Object.entries(Ws)], ([e, t]) => e, (e, t) => {
							var n = /* @__PURE__ */ k(() => h(z(t), 2));
							let r = () => z(n)[0], i = () => z(n)[1], a = /* @__PURE__ */ k(() => Cn(r()));
							var o = Ed();
							let s;
							var c = P(o), l = P(c), u = L(l, 2), d = L(u, 2);
							E(c);
							var f = I(L(c, 2), !0);
							E(o), R((e, t) => {
								s = _i(o, 1, "rs-card svelte-1n46o8q", null, s, { on: z(gn) === r() }), J(o, "title", e), yi(c, `background: ${z(a).bg ?? ""}`), yi(l, `background: ${z(a).text ?? ""}`), yi(u, `background: ${z(a).surface ?? ""}`), yi(d, `background: ${z(a).accent ?? ""}`), U(f, t);
							}, [() => Y("tip.props.sectionTheme"), () => Y(i())]), B("click", o, () => xn(r())), H(e, o);
						}), E(_);
						var v = L(_, 2), y = P(v), b = L(y), x = P(b), S = I(x), C = L(x, 2);
						G(C, () => c.copy, !0), E(C), E(b), E(v);
						var ee = L(v, 4), te = I(ee, !0), ne = L(ee, 2);
						n(ne, () => z(ar), () => z(pn));
						var w = L(ne, 4), re = P(w), ie = L(re);
						{
							let e = /* @__PURE__ */ k(() => yr(z(mn)) ? z(mn).type : "");
							X(ie, {
								get value() {
									return z(e);
								},
								get options() {
									return br;
								},
								onchange: (e) => kr(e || null)
							});
						}
						E(w);
						var ae = L(w, 2), oe = (e) => {
							var t = Od(), n = F(t), r = P(n), i = L(r);
							K(i), E(n);
							var a = L(n, 2), o = P(a), s = L(o);
							K(s), E(a);
							var c = L(a, 2), l = (e) => {
								var t = Dd(), n = F(t), r = P(n), i = L(r);
								{
									let e = /* @__PURE__ */ k(() => z(mn).props.effect ?? "slide-up"), t = /* @__PURE__ */ k(() => [
										["fade-in", Y("anim.fadeIn")],
										["slide-up", Y("anim.slideUp")],
										["zoom-in", Y("anim.zoomIn")]
									]);
									X(i, {
										get value() {
											return z(e);
										},
										get options() {
											return z(t);
										},
										onchange: (e) => Mr("effect", e)
									});
								}
								E(n);
								var a = L(n, 2), o = P(a), s = L(o);
								K(s), E(a);
								var c = L(a, 2), l = P(c), u = L(l);
								{
									let e = /* @__PURE__ */ k(() => z(mn).props.pattern ?? "sequence"), t = /* @__PURE__ */ k(() => [
										["sequence", Y("opt.stagger.sequence")],
										["columns", Y("opt.stagger.columns")],
										["rows", Y("opt.stagger.rows")],
										["center", Y("opt.stagger.center")]
									]);
									X(u, {
										get value() {
											return z(e);
										},
										get options() {
											return z(t);
										},
										onchange: (e) => Mr("pattern", e)
									});
								}
								E(c), R((e, t, i, u, d, f) => {
									J(n, "title", e), U(r, `${t ?? ""} `), J(a, "title", i), U(o, `${u ?? ""} `), q(s, z(mn).props.step ?? 90), J(c, "title", d), U(l, `${f ?? ""} `);
								}, [
									() => Y("tip.props.staggerEffect"),
									() => Y("lbl.staggerEffect"),
									() => Y("tip.props.staggerStep"),
									() => Y("lbl.stepMs"),
									() => Y("tip.props.staggerPattern"),
									() => Y("lbl.pattern")
								]), B("change", s, (e) => jr("step", Number(e.target.value))), H(e, t);
							};
							W(c, (e) => {
								z(mn).type === "stagger" && e(l);
							}), R((e, t) => {
								U(r, `${e ?? ""} `), q(i, z(mn).props.duration), U(o, `${t ?? ""} `), q(s, z(mn).props.delay ?? 0);
							}, [() => Y("lbl.durationMs"), () => Y("lbl.delayMs")]), B("change", i, (e) => jr("duration", Number(e.target.value))), B("change", s, (e) => jr("delay", Number(e.target.value))), H(e, t);
						}, se = /* @__PURE__ */ k(() => yr(z(mn)));
						W(ae, (e) => {
							z(se) && e(oe);
						});
						var ce = L(ae, 2), le = P(ce), ue = L(le);
						{
							let e = /* @__PURE__ */ k(() => z(hn)?.type ?? (z(mn) && !yr(z(mn)) ? z(mn).type : ""));
							X(ue, {
								get value() {
									return z(e);
								},
								get options() {
									return Sr;
								},
								onchange: (e) => Ar(e || null)
							});
						}
						E(ce), R((e, t, n, r, c, l, f, p, h, _, b, x, ee, ne, ie) => {
							U(i, e), J(a, "title", t), U(o, `${n ?? ""} `), q(s, z(fn)), J(s, "placeholder", r), wi(u, z(dn) !== null), U(d, ` ${c ?? ""}`), J(m, "title", l), U(g, f), J(v, "title", p), U(y, `${h ?? ""} `), U(S, `#${z(un) ?? ""}`), J(C, "title", _), U(te, b), J(w, "title", x), U(re, `${ee ?? ""} `), J(ce, "title", ne), U(le, `${ie ?? ""} `);
						}, [
							() => Y("lbl.section"),
							() => Y("hint.props.minHeight"),
							() => Y("lbl.minHeight"),
							() => Y("ph.minHeight"),
							() => Y("lbl.sectionGrid"),
							() => Y("tip.props.sectionTheme"),
							() => Y("lbl.sectionTheme"),
							() => Y("tip.props.anchor"),
							() => Y("lbl.anchor"),
							() => Y("tip.props.copyAnchor"),
							() => Y("lbl.background"),
							() => Y("tip.props.sectionAnim"),
							() => Y("lbl.animIn"),
							() => Y("tip.props.sectionHover"),
							() => Y("lbl.onHover")
						]), B("change", s, (e) => Nr(e.target.value)), B("change", u, (e) => Pr(e.target.checked)), B("click", C, () => navigator.clipboard?.writeText(`#${z(un)}`)), H(e, t);
					}, s = (e) => {
						var t = bl(), n = I(t, !0);
						R((e) => U(n, e), [() => Y("hint.props.empty")]), H(e, t);
					};
					W(r, (e) => {
						z(A) ? e(i) : z(un) ? e(o, 1) : e(s, -1);
					}), E(t), H(e, t);
				}, y = (e) => {
					var t = Rd(), i = P(t), a = P(i);
					K(a);
					var o = L(a);
					E(i);
					var s = L(i, 2), l = (e) => {
						var t = bd(), n = P(t), r = I(n, !0), i = L(n, 2);
						Xr(i, 21, () => z(O).pages ?? [], (e) => e.id, (e, t) => {
							var n = Ol(), r = P(n);
							K(r);
							var i = L(r);
							E(n), R((e, a) => {
								J(n, "title", e), wi(r, a), U(i, ` ${(z(t).title || z(t).id) ?? ""}`);
							}, [() => Y("tip.footer.hideOnPage"), () => !(z(O).footer?.hideOn ?? []).includes(z(t).id)]), B("change", r, (e) => gc(z(t).id, e.target.checked)), H(e, n);
						}), E(i), E(t), R((e) => U(r, e), [() => Y("group.showOnPages")]), H(e, t);
					};
					W(s, (e) => {
						z(O).footer?.show && e(l);
					});
					var u = L(s, 2), d = P(u), f = I(d, !0), p = L(d, 2), m = P(p);
					Xr(m, 21, () => ec, (e) => e.id, (e, t) => {
						var n = jd(), r = P(n);
						G(r, () => Gc(z(t).thumb), !0), E(r);
						var i = I(L(r, 2), !0);
						E(n), R((e) => {
							J(n, "title", e), U(i, z(t).label);
						}, [() => Y("tip.footer.template", { label: z(t).label })]), B("click", n, () => nc(z(t).id)), H(e, n);
					}), E(m), E(p), E(u);
					var h = L(u, 2), g = P(h), _ = I(g, !0), v = L(g, 2), y = P(v), b = P(y), x = L(b);
					K(x), E(y);
					var S = L(y, 2), C = P(S), ee = L(C);
					K(ee), E(S);
					var te = L(S, 2), ne = P(te), w = L(ne);
					{
						let e = /* @__PURE__ */ k(() => z(O).footer?.brand?.mode ?? "text"), t = /* @__PURE__ */ k(() => [
							["text", Y("blocks.text")],
							["image", Y("opt.brand.image")],
							["both", Y("opt.brand.both")]
						]);
						X(w, {
							get value() {
								return z(e);
							},
							get options() {
								return z(t);
							},
							onchange: (e) => Ys(e)
						});
					}
					E(te);
					var re = L(te, 2), ie = (e) => {
						var t = Nd(), n = F(t), r = P(n), i = P(r), a = L(i);
						E(r);
						var o = L(r, 2), s = (e) => {
							var t = $c();
							G(t, () => c.cross, !0), E(t), R((e) => J(t, "title", e), [() => Y("tip.footer.removeLogo")]), B("click", t, Zs), H(e, t);
						};
						W(o, (e) => {
							z(O).footer?.brand?.logo && e(s);
						}), E(n);
						var l = L(n, 2), u = (e) => {
							var t = Md(), n = F(t), r = P(n), i = I(L(r));
							E(n);
							var a = L(n, 2);
							K(a), R((e) => {
								U(r, `${e ?? ""} `), U(i, `${z(O).footer?.brand?.logoHeight ?? 40 ?? ""} px`), q(a, z(O).footer?.brand?.logoHeight ?? 40);
							}, [() => Y("lbl.logoHeight")]), B("input", a, (e) => Qs(e.target.value)), H(e, t);
						};
						W(l, (e) => {
							z(O).footer?.brand?.logo && e(u);
						}), R((e, t) => {
							J(r, "title", e), U(i, `${t ?? ""} `);
						}, [() => Y("tip.webpAutoPublish"), () => z(O).footer?.brand?.logo ? Y("ui.changeLogo") : Y("ui.uploadLogo")]), B("change", a, Xs), H(e, t);
					};
					W(re, (e) => {
						(z(O).footer?.brand?.mode ?? "text") !== "text" && e(ie);
					}), E(v), E(h);
					var ae = L(h, 2), oe = P(ae), se = I(oe, !0), ce = L(oe, 2), le = P(ce);
					Xr(le, 17, () => z(O).footer?.columns ?? [], Kr, (e, t, n) => {
						var r = Pd(), i = F(r), a = P(i);
						K(a);
						var o = L(a, 2), s = P(o);
						G(s, () => c.plus, !0), E(s);
						var l = L(s, 2);
						l.disabled = n === 0, G(l, () => c.up, !0), E(l);
						var u = L(l, 2);
						G(u, () => c.down, !0), E(u);
						var d = L(u, 2);
						G(d, () => c.cross, !0), E(d), E(o), E(i), Xr(L(i, 2), 17, () => z(t).links ?? [], Kr, (e, r, i) => {
							var a = gl(), o = P(a);
							K(o);
							var s = L(o, 2), l = P(s);
							l.disabled = i === 0, G(l, () => c.up, !0), E(l);
							var u = L(l, 2);
							G(u, () => c.down, !0), E(u);
							var d = L(u, 2);
							G(d, () => c.cross, !0), E(d), E(s);
							var f = L(s, 2), p = P(f);
							{
								let e = /* @__PURE__ */ k(() => z(r).page ?? "__href"), t = /* @__PURE__ */ k(() => Y("tip.linkTarget")), a = /* @__PURE__ */ k(() => [...z(O).pages.map((e) => [e.id, e.title]), ["__href", Y("opt.linkHref")]]);
								X(p, {
									get value() {
										return z(e);
									},
									get title() {
										return z(t);
									},
									get options() {
										return z(a);
									},
									onchange: (e) => Tc(n, i, e)
								});
							}
							E(f);
							var m = L(f, 2), h = (e) => {
								var t = hl();
								K(t), R((e, n) => {
									q(t, z(r).href ?? ""), J(t, "placeholder", e), J(t, "title", n);
								}, [() => Y("ph.hrefAnchor"), () => Y("tip.hrefAnchor")]), B("change", t, (e) => Ec(n, i, e.target.value)), H(e, t);
							};
							W(m, (e) => {
								z(r).page || e(h);
							}), E(a), R((e, n) => {
								q(o, z(r).label), J(o, "title", e), u.disabled = i === z(t).links.length - 1, J(d, "title", n);
							}, [() => Y("tip.linkLabel"), () => Y("tip.removeLink")]), B("input", o, (e) => wc(n, i, e.target.value)), B("click", l, () => Cc(n, i, -1)), B("click", u, () => Cc(n, i, 1)), B("click", d, () => Sc(n, i)), H(e, a);
						}), R((e, r, i) => {
							q(a, z(t).title), J(a, "title", e), J(s, "title", r), u.disabled = n === z(O).footer.columns.length - 1, J(d, "title", i);
						}, [
							() => Y("tip.footer.columnTitle"),
							() => Y("tip.footer.addLink"),
							() => Y("tip.footer.removeColumn")
						]), B("input", a, (e) => bc(n, e.target.value)), B("click", s, () => xc(n)), B("click", l, () => yc(n, -1)), B("click", u, () => yc(n, 1)), B("click", d, () => vc(n)), H(e, r);
					});
					var ue = L(le, 2), de = I(ue, !0), fe = L(ue, 2), pe = P(fe), me = L(pe);
					{
						let e = /* @__PURE__ */ k(() => z(O).footer?.columnsAlign ?? "left"), t = /* @__PURE__ */ k(() => [["left", Y("common.left")], ["center", Y("common.center")]]);
						X(me, {
							get value() {
								return z(e);
							},
							get options() {
								return z(t);
							},
							onchange: (e) => fc(e)
						});
					}
					E(fe), E(ce), E(ae);
					var he = L(ae, 2), ge = P(he), _e = I(ge, !0), ve = L(ge, 2), ye = P(ve);
					Xr(ye, 17, () => z(O).footer?.social ?? [], Kr, (e, t, n) => {
						var r = Fd(), i = P(r), a = P(i);
						G(a, () => Pa(z(t).icon) || "", !0), E(a);
						var o = L(a, 2);
						{
							let e = /* @__PURE__ */ k(() => Y("blocks.icon"));
							X(o, {
								get value() {
									return z(t).icon;
								},
								get title() {
									return z(e);
								},
								get options() {
									return Mc;
								},
								onchange: (e) => Ac(n, e)
							});
						}
						E(i);
						var s = L(i, 2), l = P(s);
						l.disabled = n === 0, G(l, () => c.up, !0), E(l);
						var u = L(l, 2);
						G(u, () => c.down, !0), E(u);
						var d = L(u, 2);
						G(d, () => c.cross, !0), E(d), E(s);
						var f = L(s, 2);
						K(f), E(r), R((e, r) => {
							u.disabled = n === z(O).footer.social.length - 1, J(d, "title", e), q(f, z(t).url), J(f, "placeholder", r);
						}, [() => Y("tip.removeLink"), () => Y("ph.hrefMailto")]), B("click", l, () => kc(n, -1)), B("click", u, () => kc(n, 1)), B("click", d, () => Oc(n)), B("change", f, (e) => jc(n, e.target.value)), H(e, r);
					});
					var be = L(ye, 2), xe = I(be, !0);
					E(ve), E(he);
					var Se = L(he, 2), Ce = P(Se), we = I(Ce, !0), Te = L(Ce, 2), Ee = P(Te), De = P(Ee);
					K(De);
					var Oe = L(De);
					E(Ee);
					var T = L(Ee, 2), Ae = (e) => {
						let t = /* @__PURE__ */ k(() => z(O).footer.cta);
						var n = Ld(), r = F(n), i = P(r), a = L(i);
						{
							let e = /* @__PURE__ */ k(() => z(t).kind ?? "button"), n = /* @__PURE__ */ k(() => [["button", Y("opt.cta.button")], ["newsletter", Y("opt.cta.newsletter")]]);
							X(a, {
								get value() {
									return z(e);
								},
								get options() {
									return z(n);
								},
								onchange: (e) => mc("kind", e)
							});
						}
						E(r);
						var o = L(r, 2), s = P(o);
						K(s);
						var c = L(s);
						E(o);
						var l = L(o, 2), u = P(l), d = L(u);
						K(d), E(l);
						var f = L(l, 2), p = P(f), m = L(p);
						K(m), E(f);
						var h = L(f, 2), g = P(h), _ = L(g);
						K(_), E(h);
						var v = L(h, 2), y = (e) => {
							var n = Id(), r = F(n), i = P(r), a = L(i);
							{
								let e = /* @__PURE__ */ k(() => z(t).page ?? "__href"), n = /* @__PURE__ */ k(() => [...z(O).pages.map((e) => [e.id, e.title]), ["__href", Y("opt.linkHrefMailto")]]);
								X(a, {
									get value() {
										return z(e);
									},
									get options() {
										return z(n);
									},
									onchange: (e) => hc(e)
								});
							}
							E(r);
							var o = L(r, 2), s = (e) => {
								var n = Ml();
								K(n), R((e, r) => {
									q(n, z(t).href ?? ""), J(n, "placeholder", e), J(n, "title", r);
								}, [() => Y("ph.hrefMailtoAnchor"), () => Y("tip.hrefAnchor")]), B("change", n, (e) => mc("href", e.target.value)), H(e, n);
							};
							W(o, (e) => {
								z(t).page || e(s);
							}), R((e, t) => {
								J(r, "title", e), U(i, `${t ?? ""} `);
							}, [() => Y("tip.footer.ctaTarget"), () => Y("lbl.buttonTarget")]), H(e, n);
						}, b = (e) => {
							var n = Tl(), r = F(n), i = P(r), a = L(i);
							K(a), E(r);
							var o = L(r, 2), s = P(o), c = L(s);
							K(c), E(o);
							var l = L(o, 2), u = P(l), d = L(u);
							K(d), E(l), R((e, n, f, p, m, h, g, _, v) => {
								J(r, "title", e), U(i, `${n ?? ""} `), q(a, z(t).endpoint ?? ""), J(a, "placeholder", f), J(o, "title", p), U(s, `${m ?? ""} `), q(c, z(t).recipient ?? ""), J(c, "placeholder", h), J(l, "title", g), U(u, `${_ ?? ""} `), q(d, z(t).success ?? ""), J(d, "placeholder", v);
							}, [
								() => Y("tip.footer.ctaEndpoint"),
								() => Y("lbl.newsletterEndpoint"),
								() => Y("ph.endpoint"),
								() => Y("tip.footer.ctaRecipient"),
								() => Y("lbl.recipientFallback"),
								() => Y("ph.email"),
								() => Y("tip.footer.ctaSuccess"),
								() => Y("lbl.confirmation"),
								() => Y("ph.footer.ctaSuccess")
							]), B("change", a, (e) => mc("endpoint", e.target.value)), B("change", c, (e) => mc("recipient", e.target.value)), B("input", d, (e) => mc("success", e.target.value)), H(e, n);
						};
						W(v, (e) => {
							(z(t).kind ?? "button") === "button" ? e(y) : e(b, -1);
						}), R((e, n, a, v, y, b, x, S, C, ee, te, ne) => {
							J(r, "title", e), U(i, `${n ?? ""} `), J(o, "title", a), wi(s, z(t).big === !0), U(c, ` ${v ?? ""}`), J(l, "title", y), U(u, `${b ?? ""} `), q(d, z(t).heading ?? ""), J(d, "placeholder", x), J(f, "title", S), U(p, `${C ?? ""} `), q(m, z(t).sub ?? ""), J(h, "title", ee), U(g, `${te ?? ""} `), q(_, z(t).label ?? ""), J(_, "placeholder", ne);
						}, [
							() => Y("tip.footer.ctaKind"),
							() => Y("common.type"),
							() => Y("tip.footer.ctaBig"),
							() => Y("lbl.bigCentered"),
							() => Y("tip.footer.ctaHeading"),
							() => Y("lbl.heading"),
							() => Y("ph.footer.ctaHeading"),
							() => Y("tip.footer.ctaSub"),
							() => Y("lbl.subText"),
							() => Y("tip.footer.ctaLabel"),
							() => Y("lbl.buttonText"),
							() => Y("ph.footer.ctaLabel")
						]), B("change", s, (e) => mc("big", e.target.checked)), B("input", d, (e) => mc("heading", e.target.value)), B("input", m, (e) => mc("sub", e.target.value)), B("input", _, (e) => mc("label", e.target.value)), H(e, n);
					};
					W(T, (e) => {
						z(O).footer?.cta && e(Ae);
					}), E(Te), E(Se);
					var D = L(Se, 2), je = P(D), Me = I(je, !0), Ne = L(je, 2), Pe = P(Ne);
					r(Pe, () => "linkRow", () => z(O).footer?.linkRow ?? []);
					var Fe = L(Pe, 2), Ie = I(Fe, !0);
					E(Ne), E(D);
					var Le = L(D, 2), Re = P(Le), ze = I(Re, !0), Be = L(Re, 2), Ve = P(Be), He = (e) => {
						var t = au(), n = F(t), r = P(n), i = L(r);
						{
							let e = /* @__PURE__ */ k(() => z(O).footer?.align ?? "left"), t = /* @__PURE__ */ k(() => [
								["left", Y("common.left")],
								["center", Y("common.center")],
								["right", Y("common.right")]
							]);
							X(i, {
								get value() {
									return z(e);
								},
								get options() {
									return z(t);
								},
								onchange: (e) => Hs("footer", (t) => {
									t.align = e;
								})
							});
						}
						E(n), ke(2), R((e, t) => {
							J(n, "title", e), U(r, `${t ?? ""} `);
						}, [() => Y("tip.footer.align"), () => Y("lbl.align")]), H(e, t);
					};
					W(Ve, (e) => {
						z(O).footer?.cta?.big !== !0 && e(He);
					});
					var Ue = L(Ve, 2), We = I(Ue, !0), Ge = L(Ue, 2);
					n(Ge, () => sr, () => z(O).footer?.background?.layers ?? []), E(Be), E(Le);
					var Ke = L(Le, 2), qe = P(Ke), Je = I(qe, !0), Ye = L(qe, 2), Xe = P(Ye), Ze = P(Xe), Qe = L(Ze);
					K(Qe), E(Xe);
					var $e = L(Xe, 2), et = I($e, !0), tt = L($e, 2);
					r(tt, () => "baseline", () => z(O).footer?.baseline ?? []);
					var nt = L(tt, 2), rt = I(nt, !0);
					E(Ye), E(Ke), E(t), R((e, t, n, r, s, c, l, u, d, p, m, h, g, v, w, re, ie, ae, oe, ce, le, ue, me, he, ge, ve, ye, be, Se, Ce, Te, T) => {
						J(i, "title", e), wi(a, t), U(o, ` ${n ?? ""}`), U(f, r), U(_, s), J(y, "title", c), U(b, `${l ?? ""} `), q(x, z(O).footer?.brand?.title ?? ""), J(x, "placeholder", u), J(S, "title", d), U(C, `${p ?? ""} `), q(ee, z(O).footer?.brand?.tagline ?? ""), J(te, "title", m), U(ne, `${h ?? ""} `), U(se, g), U(de, v), J(fe, "title", w), U(pe, `${re ?? ""} `), U(_e, ie), U(xe, ae), U(we, oe), J(Ee, "title", ce), wi(De, le), U(Oe, ` ${ue ?? ""}`), U(Me, me), U(Ie, he), U(ze, ge), U(We, ve), U(Je, ye), J(Xe, "title", be), U(Ze, `${Se ?? ""} `), q(Qe, z(O).footer?.copyright ?? ""), J(Qe, "placeholder", Ce), U(et, Te), U(rt, T);
					}, [
						() => Y("tip.footer.show"),
						() => !!z(O).footer?.show,
						() => Y("lbl.showFooter"),
						() => Y("group.startpoint"),
						() => Y("group.brand"),
						() => Y("tip.footer.brandTitle"),
						() => Y("lbl.title"),
						() => Y("ph.footer.brandTitle"),
						() => Y("tip.footer.tagline"),
						() => Y("lbl.tagline"),
						() => Y("tip.footer.brandMode"),
						() => Y("lbl.brandMode"),
						() => Y("group.columns"),
						() => Y("ui.addColumn"),
						() => Y("tip.footer.columnsAlign"),
						() => Y("lbl.splitColumnAlign"),
						() => Y("group.social"),
						() => Y("ui.addSocial"),
						() => Y("group.cta"),
						() => Y("tip.footer.cta"),
						() => !!z(O).footer?.cta,
						() => Y("lbl.showCta"),
						() => Y("group.linkRow"),
						() => Y("ui.addRowLink"),
						() => Y("group.appearance"),
						() => Y("lbl.background"),
						() => Y("group.baseline"),
						() => Y("tip.footer.copyright"),
						() => Y("lbl.copyright"),
						() => Y("ph.footer.copyright"),
						() => Y("lbl.baselineLinks"),
						() => Y("ui.addBaselineLink")
					]), B("change", a, (e) => Hs("footer", (t) => {
						t.show = e.target.checked;
					})), B("input", x, (e) => Us("title", e.target.value)), B("input", ee, (e) => Us("tagline", e.target.value)), B("click", ue, _c), B("click", be, Dc), B("change", De, (e) => pc(e.target.checked)), B("click", Fe, () => rc("linkRow")), B("input", Qe, (e) => $s(e.target.value)), B("click", nt, () => rc("baseline")), H(e, t);
				}, b = (e) => {
					var t = qd(), n = P(t), r = (e) => {
						var t = _l(), n = P(t), r = L(n);
						{
							let e = /* @__PURE__ */ k(() => z(po) ?? ""), t = /* @__PURE__ */ k(() => [["", Y("common.choose")], ...z(uo).map((e) => [e, z(fo)[e]?.name ?? e])]);
							X(r, {
								get value() {
									return z(e);
								},
								get options() {
									return z(t);
								},
								onchange: (e) => N(po, e || null, !0)
							});
						}
						E(t), R((e) => U(n, `${e ?? ""} `), [() => Y("blocks.collection")]), H(e, t);
					};
					W(n, (e) => {
						z(uo).length && e(r);
					});
					var i = L(n, 2), a = (e) => {
						let t = /* @__PURE__ */ k(() => z(fo)[z(po)]);
						var n = Kd(), r = F(n), i = P(r), a = I(i, !0), o = L(i, 2), s = I(o, !0), l = L(o, 2), u = P(l), d = L(u);
						E(l);
						var f = L(l, 2);
						G(f, () => c.cross, !0), E(f), E(r);
						var p = L(r, 2);
						Xr(p, 19, () => z(t).entries, (e) => e.id, (e, n, r) => {
							var i = Gd(), a = P(i), o = I(a), s = L(a, 2), l = P(s), u = P(l);
							K(u);
							var d = L(u, 2), f = P(d);
							G(f, () => c.up, !0), E(f);
							var p = L(f, 2);
							G(p, () => c.down, !0), E(p);
							var m = L(p, 2);
							G(m, () => c.cross, !0), E(m), E(d), E(l);
							var h = L(l, 2), g = (e) => {
								var t = zd(), r = P(t), i = L(r);
								K(i), E(t), R((e) => {
									U(r, `${e ?? ""} `), q(i, z(n).date ?? "");
								}, [() => Y("lbl.date")]), B("change", i, (e) => Wo(z(po), z(n).id, "date", e.target.value)), H(e, t);
							};
							W(h, (e) => {
								z(t).kind !== "products" && e(g);
							});
							var _ = L(h, 2);
							dt(_);
							var v = L(_, 2), y = (e) => {
								var t = Bd(), r = P(t), i = L(r);
								K(i), E(t), R((e, t) => {
									U(r, `${e ?? ""} `), q(i, z(n).href ?? ""), J(i, "placeholder", t);
								}, [() => Y("lbl.link"), () => Y("ph.collections.href")]), B("change", i, (e) => Wo(z(po), z(n).id, "href", e.target.value)), H(e, t);
							};
							W(v, (e) => {
								z(t).kind !== "products" && e(y);
							});
							var b = L(v, 2), x = P(b), S = P(x), C = L(S);
							E(x);
							var ee = L(x, 2), te = (e) => {
								var t = Vd(), r = F(t), i = L(r, 2);
								G(i, () => c.cross, !0), E(i), R((e) => {
									J(r, "src", z(n).image), J(i, "title", e);
								}, [() => Y("tip.removeImage")]), B("click", i, () => Wo(z(po), z(n).id, "image", "")), H(e, t);
							};
							W(ee, (e) => {
								z(n).image && e(te);
							}), E(b);
							var ne = L(b, 2), w = (e) => {
								var t = Wd(), r = F(t), i = P(r), a = L(i);
								K(a), E(r);
								var o = L(r, 2), s = P(o), l = L(s);
								K(l), E(o);
								var u = L(o, 2), d = P(u), f = L(d);
								K(f), E(u);
								var p = L(u, 2), m = P(p), h = L(m);
								K(h), E(p);
								var g = L(p, 2);
								Xr(g, 17, () => z(n).colors ?? [], Kr, (e, t, r) => {
									var i = Ud(), a = P(i);
									K(a);
									var o = L(a, 2), s = P(o), l = L(s);
									E(o);
									var u = L(o, 2), d = (e) => {
										var n = Hd();
										R(() => J(n, "src", z(t).image)), H(e, n);
									};
									W(u, (e) => {
										z(t).image && e(d);
									});
									var f = L(u, 2);
									G(f, () => c.cross, !0), E(f), E(i), R((e, n) => {
										q(a, z(t).name), J(a, "placeholder", e), U(s, `${n ?? ""} `);
									}, [() => Y("ph.colorName"), () => z(t).image ? Y("ui.changeImage") : Y("ui.addImage")]), B("change", a, (e) => $o(z(po), z(n).id, r, "name", e.target.value)), B("change", l, (e) => es(z(po), z(n).id, r, e)), B("click", f, () => ts(z(po), z(n).id, r)), H(e, i);
								});
								var _ = L(g, 2), v = I(_, !0);
								R((e, t, r, c, g, y, b, x, S, C, ee) => {
									U(i, `${e ?? ""} `), q(a, z(n).price ?? ""), J(o, "title", t), U(s, `${r ?? ""} `), q(l, z(n).memberPrice ?? ""), J(u, "title", c), U(d, `${g ?? ""} `), q(f, z(n).badge ?? ""), J(p, "title", y), U(m, `${b ?? ""} `), q(h, x), J(h, "placeholder", S), J(_, "title", C), U(v, ee);
								}, [
									() => Y("lbl.price"),
									() => Y("tip.entry.memberPrice"),
									() => Y("lbl.memberPrice"),
									() => Y("tip.entry.badge"),
									() => Y("lbl.productBadge"),
									() => Y("tip.entry.sizes"),
									() => Y("lbl.sizes"),
									() => (z(n).sizes ?? []).join(", "),
									() => Y("ph.sizes"),
									() => Y("tip.entry.colors"),
									() => Y("ui.addColor")
								]), B("change", a, (e) => Wo(z(po), z(n).id, "price", e.target.value === "" ? "" : Number(e.target.value))), B("change", l, (e) => Wo(z(po), z(n).id, "memberPrice", e.target.value === "" ? "" : Number(e.target.value))), B("change", f, (e) => Wo(z(po), z(n).id, "badge", e.target.value)), B("change", h, (e) => Jo(z(po), z(n).id, e.target.value)), B("click", _, () => Yo(z(po), z(n).id)), H(e, t);
							};
							W(ne, (e) => {
								z(t).kind === "products" && e(w);
							}), E(s), E(i), R((e, i, a, s, c) => {
								U(o, `${e ?? ""}${z(t).kind === "products" ? z(n).price == null ? "" : ` · ${z(n).price}` : z(n).date ? ` · ${z(n).date}` : ""}`), q(u, z(n).title), J(u, "title", i), f.disabled = z(r) === 0, p.disabled = z(r) === z(t).entries.length - 1, J(m, "title", a), J(_, "placeholder", s), q(_, z(n).text ?? ""), U(S, `${c ?? ""} `);
							}, [
								() => Lo(z(n).title),
								() => Y("lbl.title"),
								() => Y("tip.collections.deleteEntry"),
								() => Y("ph.collections.text"),
								() => z(n).image ? Y("ui.changeImage") : Y("ui.addImage")
							]), B("change", u, (e) => Wo(z(po), z(n).id, "title", e.target.value || Y("ui.untitled"))), B("click", f, () => Go(z(po), z(r), -1)), B("click", p, () => Go(z(po), z(r), 1)), B("click", m, () => Ko(z(po), z(n).id)), B("change", _, (e) => Wo(z(po), z(n).id, "text", e.target.value)), B("change", C, (e) => qo(z(po), z(n).id, e)), H(e, i);
						});
						var m = L(p, 2), h = (e) => {
							var t = bl(), n = I(t, !0);
							R((e) => U(n, e), [() => Y("hint.collections.empty")]), H(e, t);
						};
						W(m, (e) => {
							z(t).entries.length || e(h);
						}), ke(2), R((e, t, n, r, i, c) => {
							U(a, e), J(o, "title", t), U(s, n), J(l, "title", r), U(u, `${i ?? ""} `), J(f, "title", c);
						}, [
							() => Y("ui.addEntry"),
							() => Y("tip.collections.exportCsv"),
							() => Y("ui.exportCsv"),
							() => Y("tip.collections.importCsv"),
							() => Y("ui.importCsv"),
							() => Y("tip.collections.deleteCollection")
						]), B("click", i, () => Uo(z(po))), B("click", o, () => rs(z(po))), B("change", d, (e) => is(z(po), e)), B("click", f, () => Ho(z(po))), H(e, n);
					};
					W(i, (e) => {
						z(po) && z(fo)[z(po)] && e(a);
					});
					var o = L(i, 2), s = P(o), l = L(s);
					K(l), E(o);
					var u = L(o, 2), d = P(u);
					X(L(d), {
						get value() {
							return z(ho);
						},
						get options() {
							return go;
						},
						onchange: (e) => N(ho, e, !0)
					}), E(u);
					var f = L(u, 2), p = I(f, !0);
					E(t), R((e, t, n, r, i) => {
						U(s, `${e ?? ""} `), J(l, "placeholder", t), U(d, `${n ?? ""} `), f.disabled = r, U(p, i);
					}, [
						() => Y("lbl.newCollectionName"),
						() => Y("ph.collections.name"),
						() => Y("common.type"),
						() => !z(mo).trim(),
						() => Y("ui.createCollection")
					]), B("keydown", l, (e) => e.key === "Enter" && Bo()), Oi(l, () => z(mo), (e) => N(mo, e)), B("click", f, Bo), H(e, t);
				}, x = (e) => {
					var t = ef(), n = P(t), r = (e) => {
						var t = bl(), n = I(t, !0);
						R((e) => U(n, e), [() => Y("hint.plugins.empty")]), H(e, t);
					}, i = /* @__PURE__ */ k(() => !bs().length);
					W(n, (e) => {
						z(i) && e(r);
					});
					var a = L(n, 2);
					Xr(a, 16, bs, (e) => e, (e, t) => {
						let n = /* @__PURE__ */ k(() => ms[t]), r = /* @__PURE__ */ k(() => (z(ps)?.enabled ?? []).includes(t));
						var i = Xd();
						let a;
						var o = P(i), s = P(o), l = I(s, !0), u = L(s, 2), d = (e) => {
							var t = Jd(), r = I(t);
							R(() => U(r, `v${z(n).version ?? ""}`)), H(e, t);
						};
						W(u, (e) => {
							z(n)?.version && e(d);
						});
						var f = L(u, 2), p = P(f), m = P(p);
						K(m);
						var h = L(m);
						E(p);
						var g = L(p, 2);
						G(g, () => c.cross, !0), E(g), E(f), E(o);
						var _ = L(o, 2), v = (e) => {
							var t = Yd(), r = I(t, !0);
							R((e) => U(r, e), [() => z(n).errors.join("; ")]), H(e, t);
						}, y = (e) => {
							var t = Yd(), r = I(t, !0);
							R((e) => U(r, e), [() => Y("plugin.engineMismatch", {
								required: z(n).requiresEngine,
								current: z(hs)
							})]), H(e, t);
						}, b = (e) => {
							var t = Yd(), r = I(t, !0);
							R((e) => U(r, e), [() => Y("plugin.cspNeeded", { list: ws(z(n).csp).join(", ") })]), H(e, t);
						}, x = /* @__PURE__ */ k(() => z(n)?.csp && ws(z(n).csp).length);
						W(_, (e) => {
							z(n)?.errors?.length ? e(v) : z(n) && !z(n).satisfied ? e(y, 1) : z(x) && e(b, 2);
						});
						var S = L(_, 2), C = (e) => {
							var t = bl(), r = I(t, !0);
							R((e) => U(r, e), [() => Y("plugin.languages", { list: z(n).languages.map((e) => e.name).join(", ") })]), H(e, t);
						};
						W(S, (e) => {
							z(n)?.languages?.length && e(C);
						}), E(i), R((e, t, o, s, c) => {
							a = _i(i, 1, "plugin-row svelte-1n46o8q", null, a, { "plugin-broken": z(n)?.errors?.length }), U(l, e), J(p, "title", t), wi(m, z(r)), m.disabled = o, U(h, ` ${s ?? ""}`), J(g, "title", c);
						}, [
							() => z(n)?.names?.[Ki()] ?? z(n)?.name ?? t,
							() => z(r) ? Y("tip.plugins.on") : Y("tip.plugins.off"),
							() => !!z(n)?.errors?.length,
							() => z(r) ? Y("ui.on") : Y("ui.off"),
							() => Y("tip.plugins.remove")
						]), B("change", m, (e) => ks(t, e.target.checked)), B("click", g, () => Ps(t)), H(e, i);
					});
					var o = L(a, 2), s = (e) => {
						var t = Qd(), n = L(F(t), 2), r = I(n, !0);
						Xr(L(n, 2), 16, () => z(vs), (e) => e, (e, t) => {
							var n = Zd(), r = P(n), i = P(r), a = I(i, !0), o = L(i, 2), s = (e) => {
								var n = Jd(), r = I(n);
								R(() => U(r, `v${ms[t].version ?? ""}`)), H(e, n);
							};
							W(o, (e) => {
								ms[t]?.version && e(s);
							});
							var l = L(o, 2), u = P(l);
							G(u, () => c.right, !0), E(u), E(l), E(r), E(n), R((e, t) => {
								U(a, e), J(u, "title", t);
							}, [() => ms[t]?.names?.[Ki()] ?? ms[t]?.name ?? t, () => Y("tip.plugins.addFound")]), B("click", u, () => zs(t)), H(e, n);
						}), R((e) => U(r, e), [() => Y("hint.plugins.found")]), H(e, t);
					};
					W(o, (e) => {
						z(vs).length && e(s);
					});
					var l = L(o, 2), u = (e) => {
						var t = Fr(), n = F(t), r = (e) => {
							var t = bl(), n = I(t, !0);
							R((e) => U(n, e), [() => Y("hint.plugins.autoDiscover")]), H(e, t);
						};
						W(n, (e) => {
							z(vs).length || e(r);
						}), H(e, t);
					}, d = (e) => {
						var t = $d(), n = L(F(t), 2);
						K(n);
						var r = L(n, 2), i = I(r, !0), a = L(r, 2), o = (e) => {
							var t = Yd(), n = I(t, !0);
							R(() => U(n, z(_s))), H(e, t);
						};
						W(a, (e) => {
							z(_s) && e(o);
						}), R((e, t, a) => {
							J(n, "placeholder", e), r.disabled = t, U(i, a);
						}, [
							() => Y("ph.plugins.folder"),
							() => !z(gs).trim(),
							() => Y("ui.addPlugin")
						]), B("keydown", n, (e) => e.key === "Enter" && Fs()), Oi(n, () => z(gs), (e) => N(gs, e)), B("click", r, Fs), H(e, t);
					};
					W(l, (e) => {
						z($) === "ok" ? e(u) : e(d, -1);
					}), E(t), H(e, t);
				}, S = (e) => {
					var t = Ad(), n = P(t), r = (e) => {
						var t = bl(), n = I(t, !0);
						R((e) => U(n, e), [() => Y("hint.history.loading")]), H(e, t);
					}, i = (e) => {
						var t = rf(), n = F(t), r = (e) => {
							var t = bl(), n = I(t, !0);
							R(() => U(n, z(Ur))), H(e, t);
						};
						W(n, (e) => {
							z(Ur) && e(r);
						});
						var i = L(n, 2), a = (e) => {
							var t = nf(), n = F(t), r = I(n, !0);
							Xr(L(n, 2), 19, () => z(Hr), (e) => e.sha, (e, t, n) => {
								var r = tf();
								let i;
								var a = P(r), o = I(a, !0), s = I(L(a, 2));
								E(r), R((e) => {
									i = _i(r, 1, "history-row svelte-1n46o8q", null, i, { head: z(n) === 0 }), J(a, "title", z(t).sha), U(o, z(t).message), U(s, `${z(t).author ?? ""}${e ?? ""}`);
								}, [() => z(t).date ? ` · ${qr.format(new Date(z(t).date))}` : ""]), H(e, r);
							}), R((e, t) => {
								n.disabled = z(Wr) || !z(ne)?.allowed, J(n, "title", e), U(r, t);
							}, [() => z(ne)?.allowed ? Y("tip.history.revert") : Y("tip.history.needsAccess"), () => Y("ui.revertLast")]), B("click", n, Yr), H(e, t);
						};
						W(i, (e) => {
							z(Hr).length > 0 && e(a);
						}), H(e, t);
					};
					W(n, (e) => {
						z(Hr) === null ? e(r) : e(i, -1);
					}), E(t), H(e, t);
				}, C = (e) => {
					var t = Ad(), n = P(t), r = (e) => {
						var t = bl(), n = I(t, !0);
						R((e) => U(n, e), [() => Y("update.checking")]), H(e, t);
					}, i = (e) => {
						var t = af(), n = F(t), r = I(n, !0), i = L(n, 2), a = I(i, !0);
						R((e) => {
							U(r, z($r)), U(a, e);
						}, [() => Y("update.retry")]), B("click", i, ni), H(e, t);
					}, a = (e) => {
						var t = gf(), n = F(t), r = P(n), i = I(r, !0), a = L(r, 2), o = (e) => {
							var t = of(), n = F(t);
							G(n, () => c.right, !0), E(n);
							var r = I(L(n, 2), !0);
							R(() => U(r, z(Qr).target)), H(e, t);
						};
						W(a, (e) => {
							z(Qr).upToDate || e(o);
						}), E(n);
						var s = L(n, 2), l = (e) => {
							var t = bl(), n = I(t, !0);
							R((e) => U(n, e), [() => Y("update.upToDate")]), H(e, t);
						}, u = (e) => {
							var t = hf(), n = F(t), r = I(n, !0), i = L(n, 2), a = (e) => {
								var t = sf(), n = P(t), r = I(n, !0), i = L(n, 2), a = I(P(i), !0);
								E(i), E(t), R((e) => {
									U(r, e), U(a, z(Qr).notes);
								}, [() => Y("update.aboutVersion", { target: z(Qr).target })]), H(e, t);
							};
							W(i, (e) => {
								z(Qr).notes && e(a);
							});
							var o = L(i, 2), s = (e) => {
								var t = cf(), n = P(t), r = P(n);
								G(r, () => c.warn, !0), E(r);
								var i = L(r);
								E(n);
								var a = L(n, 2), o = I(P(a), !0);
								E(a), E(t), R((e, t) => {
									J(n, "title", e), U(i, ` ${t ?? ""}`), U(o, z(Qr).headers.upstream);
								}, [() => Y("update.headersManual"), () => Y("update.headersTitle")]), H(e, t);
							};
							W(o, (e) => {
								z(Qr).headers?.upstream && e(s);
							});
							var l = L(o, 2);
							Xr(l, 17, () => z(Qr).changes.filter((e) => e.atom && e.conflict), (e) => e.path, (e, t) => {
								var n = uf(), r = P(n), i = I(r, !0), a = L(r, 2), o = P(a), s = (e) => {
									var t = lf(), n = I(t, !0);
									R((e) => U(n, e), [() => Y("update.actionDelete")]), H(e, t);
								};
								W(o, (e) => {
									z(t).action === "delete" && e(s);
								});
								var l = L(o, 2);
								G(l, () => c.warn, !0), E(l), E(a), E(n), R((e) => {
									J(r, "title", z(t).path), U(i, z(t).path), J(l, "title", e);
								}, [() => Y(`update.conflict.${z(t).conflict}`)]), H(e, n);
							});
							var u = L(l, 2), d = P(u), f = I(d), p = L(d, 2);
							Xr(p, 21, () => z(Qr).changes.filter((e) => e.atom && !e.conflict), (e) => e.path, (e, t) => {
								var n = df(), r = P(n), i = I(r, !0), a = L(r, 2), o = (e) => {
									var t = lf(), n = I(t, !0);
									R((e) => U(n, e), [() => Y("update.actionDelete")]), H(e, t);
								};
								W(a, (e) => {
									z(t).action === "delete" && e(o);
								}), E(n), R(() => {
									J(r, "title", z(t).path), U(i, z(t).path);
								}), H(e, n);
							}), E(p), E(u);
							var m = L(u, 2), h = (e) => {
								var t = mf(), n = F(t), r = P(n), i = I(r, !0), a = I(L(r, 2), !0);
								E(n), Xr(L(n, 2), 17, () => z(Qr).changes.filter((e) => !e.atom), (e) => e.path, (e, t) => {
									var n = pf(), r = P(n);
									let i;
									var a = I(r, !0), o = L(r, 2), s = P(o), l = (e) => {
										var t = lf(), n = I(t, !0);
										R((e) => U(n, e), [() => Y("update.actionDelete")]), H(e, t);
									};
									W(s, (e) => {
										z(t).action === "delete" && e(l);
									});
									var u = L(s, 2), d = (e) => {
										var n = ff();
										G(n, () => c.warn, !0), E(n), R((e) => J(n, "title", e), [() => Y(`update.conflict.${z(t).conflict}`)]), H(e, n);
									};
									W(u, (e) => {
										z(t).conflict && e(d);
									});
									var f = L(u, 2);
									K(f), E(o), E(n), R((e, n, o, s) => {
										i = _i(r, 1, "update-path svelte-1n46o8q", null, i, { skipped: e }), J(r, "title", z(t).path), U(a, z(t).path), wi(f, n), J(f, "title", o), J(f, "aria-label", s);
									}, [
										() => z(ti).has(z(t).path),
										() => z(ti).has(z(t).path),
										() => Y("update.keepMine.title"),
										() => Y("update.keepMine")
									]), B("change", f, () => ri(z(t).path)), H(e, n);
								}), R((e, t) => {
									U(i, e), U(a, t);
								}, [() => Y("update.optionalTitle"), () => Y("update.keepMine")]), H(e, t);
							}, g = /* @__PURE__ */ k(() => z(Qr).changes.some((e) => !e.atom));
							W(m, (e) => {
								z(g) && e(h);
							});
							var _ = L(m, 2), v = I(_, !0);
							R((e, t, n, i, a, o) => {
								U(r, e), J(d, "title", t), U(f, `${n ?? ""} · ${i ?? ""}`), _.disabled = z(ei) || !z(ne)?.allowed, J(_, "title", a), U(v, o);
							}, [
								() => Y("update.summary", {
									writes: z(Qr).changes.filter((e) => e.action === "write").length,
									deletes: z(Qr).changes.filter((e) => e.action === "delete").length
								}),
								() => Y("update.atomGroup.title"),
								() => Y("update.atomTitle"),
								() => z(Qr).changes.filter((e) => e.atom).length,
								() => z(ne)?.allowed ? Y("update.run.title") : Y("tip.history.needsAccess"),
								() => Y("update.run", { target: z(Qr).target })
							]), B("click", _, ii), H(e, t);
						};
						W(s, (e) => {
							z(Qr).upToDate ? e(l) : e(u, -1);
						}), R((e) => U(i, e), [() => Y("update.current", { version: z(Qr).current })]), H(e, t);
					};
					W(n, (e) => {
						z(ei) && !z(Qr) ? e(r) : z($r) ? e(i, 1) : z(Qr) && e(a, 2);
					}), E(t), H(e, t);
				};
				W(s, (e) => {
					z(ft) === "pages" ? e(l) : z(ft) === "nav" ? e(u, 1) : z(ft) === "site" ? e(d, 2) : z(ft) === "theme" ? e(p, 3) : z(ft) === "blocks" ? e(m, 4) : z(ft) === "grid" ? e(g, 5) : z(ft) === "properties" ? e(v, 6) : z(ft) === "footer" ? e(y, 7) : z(ft) === "collections" ? e(b, 8) : z(ft) === "plugins" ? e(x, 9) : z(ft) === "history" ? e(S, 10) : z(ft) === "update" && e(C, 11);
				}), E(t), R((e) => {
					J(i, "title", e), U(o, ht[z(ft)]);
				}, [() => gt[z(ft)]?.map((e) => Y(e)).join("\n")]), H(e, t);
			};
			W(v, (e) => {
				z(ft) && e(y);
			}), R((e) => {
				p = _i(u, 1, "rail-gear svelte-1n46o8q", null, p, { active: z(pi) }), J(u, "title", e);
			}, [() => Y("settings.title")]), B("click", u, () => N(pi, !z(pi))), H(e, t);
		};
		W(i, (e) => {
			z(re) && e(o);
		});
		var s = L(i, 2);
		let u;
		var p = P(s), m = P(p);
		Mi(m, (e) => N(te, e), () => z(te)), E(p), E(s), Mi(s, (e) => N(ce, e), () => z(ce)), E(t), R((e) => {
			u = _i(s, 1, "frame-wrap svelte-1n46o8q", null, u, {
				mobile: z(se) === "mobile",
				pan: z(Se)
			}), yi(p, `width:${z(be) ?? ""}px; height:${z(xe) ?? ""}px`), J(m, "title", e), J(m, "src", `/?page=${z(_)}&preview=1`), yi(m, `width:${z(ge) ?? ""}px; height:${z(ye) ?? ""}px; transform:scale(${z(_e) ?? ""}); transform-origin:top left`);
		}, [() => Y("ui.previewTitle")]), Tr("load", m, li), Cr(m), H(e, t);
	}, nm = (e) => {
		var t = bf(), n = I(t, !0);
		R((e) => U(n, e), [() => Y("ui.loading")]), H(e, t);
	};
	W(em, (e) => {
		z(g) ? e(tm) : e(nm, -1);
	});
	var rm = L(em, 2), im = (e) => {
		so(e, {
			get image() {
				return z(aa);
			},
			onapply: sa,
			oncancel: () => N(aa, null)
		});
	};
	W(rm, (e) => {
		z(aa) && e(im);
	});
	var am = L(rm, 2), om = (e) => {
		var t = Sf(), n = P(t), r = P(n), i = I(r, !0), a = L(r, 2);
		Xr(a, 16, () => z($e).lines, (e) => e, (e, t) => {
			var n = xf(), r = I(n, !0);
			R(() => U(r, t)), H(e, n);
		});
		var o = L(a, 2), s = (e) => {
			var t = Ml();
			K(t), ut(t, !0), R(() => J(t, "placeholder", z($e).placeholder)), B("keydown", t, (e) => e.key === "Enter" && z($e).value.trim() && nt(!0)), Oi(t, () => z($e).value, (e) => z($e).value = e), H(e, t);
		};
		W(o, (e) => {
			z($e).prompt && e(s);
		});
		var c = L(o, 2), l = P(c), u = I(l, !0), d = L(l, 2), f = I(d, !0);
		E(c), E(n), E(t), R(() => {
			U(i, z($e).title), U(u, z($e).cancelLabel), U(f, z($e).okLabel);
		}), B("pointerdown", t, (e) => rt = e.target === e.currentTarget), B("click", t, (e) => rt && e.target === e.currentTarget && nt(!1)), B("click", l, () => nt(!1)), B("click", d, () => nt(!0)), H(e, t);
	};
	W(am, (e) => {
		z($e) && e(om);
	});
	var sm = L(am, 2), cm = (e) => {
		var t = Cf(), n = P(t), r = P(n), i = I(r, !0), a = L(r, 2), o = I(a, !0), s = L(a, 2), c = P(s), l = L(c);
		K(l), E(s);
		var u = L(s, 2), d = P(u), f = L(d);
		{
			let e = /* @__PURE__ */ k(() => Y("setup.accentPick"));
			da(f, {
				get value() {
					return z(ot);
				},
				get label() {
					return z(e);
				},
				onchange: (e) => N(ot, e, !0)
			});
		}
		E(u);
		var p = L(u, 2), m = P(p), h = L(m);
		{
			let e = /* @__PURE__ */ k(() => Y("setup.bgLabel"));
			da(h, {
				get value() {
					return z(st);
				},
				get label() {
					return z(e);
				},
				onchange: (e) => N(st, e, !0)
			});
		}
		E(p);
		var g = L(p, 2), _ = I(g, !0), v = L(g, 2), y = P(v), b = I(y, !0), x = L(y, 2), S = I(x, !0);
		E(v), E(n), E(t), R((e, t, n, r, a, s, u, f, p, h) => {
			U(i, e), U(o, t), U(c, `${n ?? ""} `), J(l, "placeholder", r), U(d, `${a ?? ""} `), U(m, `${s ?? ""} `), U(_, u), U(b, f), x.disabled = p, U(S, h);
		}, [
			() => Y("setup.title"),
			() => Y("setup.intro"),
			() => Y("setup.nameLabel"),
			() => Y("ph.setup.name"),
			() => Y("setup.accentLabel"),
			() => Y("setup.bgLabel"),
			() => Y("setup.outro"),
			() => Y("setup.skip"),
			() => !z(at).trim(),
			() => Y("setup.start")
		]), B("keydown", l, (e) => e.key === "Enter" && lt()), Oi(l, () => z(at), (e) => N(at, e)), B("click", y, ct), B("click", x, lt), H(e, t);
	};
	W(sm, (e) => {
		z(it) && e(cm);
	});
	var lm = L(sm, 2), um = (e) => {
		var t = wf();
		let n;
		var r = P(t), i = I(r, !0), a = L(r, 2);
		E(t), R((e) => {
			n = _i(t, 1, "toast svelte-1n46o8q", null, n, {
				ok: z(b) === "ok",
				error: z(b) === "error"
			}), U(i, z(y)), J(a, "title", e);
		}, [() => Y("ui.close")]), B("click", a, () => S("")), H(e, t);
	};
	W(lm, (e) => {
		z(y) && e(um);
	}), E(Rp);
	var dm = L(Rp, 2), fm = (e) => {
		var t = Tf(), n = P(t), r = P(n), i = I(r, !0), o = L(r, 2);
		G(o, () => c.cross, !0), E(o), E(n);
		var s = L(n, 2), l = P(s);
		a(l), E(s), E(t), R((e, n) => {
			yi(t, `left: ${z(Ot).left ?? ""}px; top: ${z(Ot).top ?? ""}px`), U(i, e), J(o, "title", n);
		}, [() => Y("blocks.suffix", { label: sn[z(A).type] ?? z(A).type }), () => Y("tip.closeEsc")]), B("click", o, () => N(Ot, null)), H(e, t);
	};
	W(dm, (e) => {
		z(Ot) && z(A) && e(fm);
	}), R(() => Hp = _i(Vp, 1, "topbar svelte-1n46o8q", null, Hp, { hidden: !z(re) })), H(e, Lp), Xe();
}
//#endregion
//#region src/main.js
Er([
	"click",
	"input",
	"pointerdown",
	"change",
	"keydown"
]), document.documentElement.lang = await Yi();
var Of = Vr(Df, { target: document.getElementById("urd-admin") });
//#endregion
export { Of as default };
