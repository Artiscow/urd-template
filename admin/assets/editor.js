//#region node_modules/svelte/src/internal/shared/utils.js
var e = Array.isArray, t = Array.prototype.indexOf, n = Array.prototype.includes, r = Array.from, i = Object.defineProperty, a = Object.getOwnPropertyDescriptor, o = Object.getOwnPropertyDescriptors, s = Object.prototype, c = Array.prototype, l = Object.getPrototypeOf, u = Object.isExtensible, d = () => {};
function f(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function p() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
function m(e, t) {
	if (Array.isArray(e)) return e;
	if (t === void 0 || !(Symbol.iterator in e)) return Array.from(e);
	let n = [];
	for (let r of e) if (n.push(r), n.length === t) break;
	return n;
}
var h = 1024, g = 2048, _ = 4096, v = 8192, y = 16384, b = 32768, x = 1 << 25, S = 65536, C = 1 << 19, w = 1 << 20, T = 1 << 25, ee = 65536, E = 1 << 21, te = 1 << 22, ne = 1 << 23, re = Symbol("$state"), ie = Symbol("legacy props"), ae = Symbol(""), oe = Symbol("attributes"), se = Symbol("class"), ce = Symbol("style"), le = Symbol("text"), ue = Symbol("form reset"), de = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), fe = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function pe() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function me(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function he(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function ge() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function _e(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function D() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function ve(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function O() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function k() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function ye() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function be() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/constants.js
var xe = {}, Se = Symbol("uninitialized"), Ce = "http://www.w3.org/1999/xhtml", we = "http://www.w3.org/2000/svg", Te = "http://www.w3.org/1998/Math/MathML";
function Ee() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function De(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Oe() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var ke = !1;
function Ae(e) {
	ke = e;
}
var je;
function Me(e) {
	if (e === null) throw De(), xe;
	return je = e;
}
function Ne() {
	return Me(/* @__PURE__ */ dn(je));
}
function A(e) {
	if (ke) {
		if (/* @__PURE__ */ dn(je) !== null) throw De(), xe;
		je = e;
	}
}
function Pe(e = 1) {
	if (ke) {
		for (var t = e, n = je; t--;) n = /* @__PURE__ */ dn(n);
		je = n;
	}
}
function Fe(e = !0) {
	for (var t = 0, n = je;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ dn(n);
		e && n.remove(), n = i;
	}
}
function Ie(e) {
	if (!e || e.nodeType !== 8) throw De(), xe;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Le(e) {
	return e === this.v;
}
function Re(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function ze(e) {
	return !Re(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/shared/clone.js
var Be = [];
function Ve(e, t = !1, n = !1) {
	return He(e, /* @__PURE__ */ new Map(), "", Be, null, n);
}
function He(t, n, r, i, a = null, o = !1) {
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
				d in t && (u[d] = He(f, n, r, i, null, o));
			}
			return u;
		}
		if (l(t) === s) {
			u = {}, n.set(t, u), a !== null && n.set(a, u);
			for (var p of Object.keys(t)) u[p] = He(t[p], n, r, i, null, o);
			return u;
		}
		if (t instanceof Date) return structuredClone(t);
		if (typeof t.toJSON == "function" && !o) return He(t.toJSON(), n, r, i, t);
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
var Ue = null;
function We(e) {
	Ue = e;
}
function Ge(e, t = !1, n) {
	Ue = {
		p: Ue,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: qn,
		l: null
	};
}
function Ke(e) {
	var t = Ue, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) Sn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, Ue = t.p, e ?? {};
}
function qe() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Je = [];
function Ye() {
	var e = Je;
	Je = [], f(e);
}
function Xe(e) {
	if (Je.length === 0 && !Nt) {
		var t = Je;
		queueMicrotask(() => {
			t === Je && Ye();
		});
	}
	Je.push(e);
}
function Ze() {
	for (; Je.length > 0;) Ye();
}
function Qe(e) {
	var t = qn;
	if (t === null) return Wn.f |= ne, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	$e(e, t);
}
function $e(e, t) {
	if (!(t !== null && t.f & 16384)) {
		for (; t !== null;) {
			if (t.f & 128) {
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
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var et = ~(g | _ | h);
function tt(e, t) {
	e.f = e.f & et | t;
}
function nt(e) {
	e.f & 512 || e.deps === null ? tt(e, h) : tt(e, _);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function rt(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= ee, rt(t.deps));
}
function it(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), rt(e.deps), tt(e, h);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var at = !1;
function ot(e) {
	var t = at;
	try {
		return at = !1, [e(), at];
	} finally {
		at = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
function st(e, t) {
	if (t) {
		let t = document.body;
		e.autofocus = !0, Xe(() => {
			document.activeElement === t && e.focus();
		});
	}
}
function ct(e) {
	ke && /* @__PURE__ */ un(e) !== null && fn(e);
}
var lt = !1;
function ut() {
	lt || (lt = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[ue]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function dt(e) {
	var t = Wn, n = qn;
	Kn(null), Jn(null);
	try {
		return e();
	} finally {
		Kn(t), Jn(n);
	}
}
function j(e, t, n, r = n) {
	e.addEventListener(t, () => dt(n));
	let i = e[ue];
	e[ue] = i ? () => {
		i(), r(!0);
	} : () => r(!0), ut();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function ft(e) {
	let t = 0, n = Xt(0), r;
	return () => {
		yn() && (B(n), En(() => (t === 0 && (r = hr(() => e(() => en(n)))), t += 1, () => {
			Xe(() => {
				--t, t === 0 && (r?.(), r = void 0, en(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var pt = S | C;
function mt(e, t, n, r) {
	new ht(e, t, n, r);
}
var ht = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = ke ? je : null;
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
	#h = ft(() => (this.#m = Xt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = qn;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = qn.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Dn(() => {
			if (ke) {
				let e = this.#t;
				Ne();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, pt), ke && (this.#e = je);
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
		Xe(r), t && (this.#s = On(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				Oe();
				return;
			}
			t = !0, n && be(), this.#s !== null && Fn(this.#s, () => {
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
					$e(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = On(() => e(this.#e)), Xe(() => {
			var e = this.#c = document.createDocumentFragment(), t = ln();
			e.append(t), this.#a = this.#S(() => On(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, Fn(this.#o, () => {
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
		it(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = qn, n = Wn, r = Ue;
		Jn(this.#i), Kn(this.#i), We(this.#i.ctx);
		try {
			return zt.ensure(), e();
		} catch (e) {
			return Qe(e), null;
		} finally {
			Jn(t), Kn(n), We(r);
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
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Xe(() => {
			this.#d = !1, this.#m && Qt(this.#m, this.#l);
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
		this.#a &&= (Mn(this.#a), null), this.#o &&= (Mn(this.#o), null), this.#s &&= (Mn(this.#s), null), ke && (Me(this.#t), Pe(), Me(Fe()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return On(() => {
						var r = qn;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return $e(e, this.#i.parent), null;
				}
			}));
		};
		Xe(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				$e(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => $e(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function gt(e, t, n, r) {
	let i = qe() ? yt : St;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = qn, c = _t(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				$e(e, s);
			}
			vt();
		}
	}
	var d = M();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ xt(e))).then(u).catch((e) => $e(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), vt();
	}) : f();
}
function _t() {
	var e = qn, t = Wn, n = Ue, r = kt;
	return function(i = !0) {
		Jn(e), Kn(t), We(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function vt(e = !0) {
	Jn(null), Kn(null), We(null), e && kt?.deactivate();
}
function M() {
	var e = qn, t = e.b, n = kt, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function yt(e) {
	var t = 2 | g;
	return qn !== null && (qn.f |= C), {
		ctx: Ue,
		deps: null,
		effects: null,
		equals: Le,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: Se,
		wv: 0,
		parent: qn,
		ac: null
	};
}
var bt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function xt(e, t, n) {
	let r = qn;
	r === null && pe();
	var i = void 0, a = Xt(Se), o = !Wn, s = /* @__PURE__ */ new Set();
	return Tn(() => {
		var t = qn, n = p();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== de && n.reject(e);
			}).finally(vt);
		} catch (e) {
			n.reject(e), vt();
		}
		var c = kt;
		if (o) {
			if (t.f & 32768) var l = M();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(bt);
			else for (let e of s.values()) e.reject(bt);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== bt && (c.activate(), t ? (a.f |= ne, Qt(a, t)) : (a.f & 8388608 && (a.f ^= ne), Qt(a, e)), c.deactivate());
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
function N(e) {
	let t = /* @__PURE__ */ yt(e);
	return Xn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function St(e) {
	let t = /* @__PURE__ */ yt(e);
	return t.equals = ze, t;
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
	if (!Hn && r !== null && e.v !== Se && r.f & 24576) return Ee(), e.v;
	Jn(r);
	try {
		e.f &= ~ee, Ct(e), t = cr(e);
	} finally {
		Jn(n);
	}
	return t;
}
function Tt(e) {
	var t = wt(e);
	if (!e.equals(t) && (e.wv = ar(), (!kt?.is_fork || e.deps === null) && (kt === null ? e.v = t : (kt.capture(e, t, !0), At?.capture(e, t, !0)), e.deps === null))) {
		tt(e, h);
		return;
	}
	Hn || (jt === null ? nt(e) : (yn() || kt?.is_fork) && jt.set(e, t));
}
function Et(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && dt(() => {
		t.ac.abort(de), t.ac = null;
	}), t.fn !== null && (t.teardown = d), ur(t, 0), An(t));
}
function Dt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && dr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var Ot = null, kt = null, At = null, jt = null, Mt = null, Nt = !1, Pt = !1, Ft = null, It = null, Lt = 0, Rt = 1, zt = class e {
	id = Rt++;
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
			for (var r of n.d) tt(r, g), t(r);
			for (r of n.m) tt(r, _), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, Lt++ > 1e3 && (this.#x(), Vt());
		for (let e of this.#u) this.#d.delete(e), tt(e, g), this.schedule(e);
		for (let e of this.#d) tt(e, _), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = Ft = [], r = [], i = It = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Kt(e), this.#h() || this.discard(), t;
		}
		if (kt = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (Ft = null, It = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Gt(e, t);
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
		this.#r.clear(), At = this, Ut(r), Ut(n), At = null, this.#s?.resolve();
		var s = kt;
		if (this.#a === 0 && (this.#c.length === 0 || s !== null) && this.#x(), this.#c.length > 0) if (s !== null) {
			let e = s;
			e.#c.push(...this.#c.filter((t) => !e.#c.includes(t)));
		} else s = this;
		s !== null && s.#g();
	}
	#_(e, t, n) {
		e.f ^= h;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= h : i & 4 ? t.push(r) : or(r) && (i & 16 && this.#d.add(r), dr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), tt(i, g), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), kt = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) it(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== Se && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), jt?.set(e, t)), this.is_fork || (e.v = t);
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
			Lt = 0, Mt = null, Ft = null, It = null, Pt = !1, kt = null, jt = null, Jt.clear();
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
		this.#m || (this.#m = !0, Xe(() => {
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
		return (this.#s ??= p()).promise;
	}
	static ensure() {
		if (kt === null) {
			let t = kt = new e();
			!Pt && !Nt && Xe(() => {
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
				t.f ^= h;
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
function Bt(e) {
	var t = Nt;
	Nt = !0;
	try {
		var n;
		for (e && (kt !== null && !kt.is_fork && kt.flush(), n = e());;) {
			if (Ze(), kt === null) return n;
			kt.flush();
		}
	} finally {
		Nt = t;
	}
}
function Vt() {
	try {
		D();
	} catch (e) {
		$e(e, Mt);
	}
}
var Ht = null;
function Ut(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && or(r) && (Ht = /* @__PURE__ */ new Set(), dr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Pn(r), Ht?.size > 0)) {
				Jt.clear();
				for (let e of Ht) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Ht.has(n) && (Ht.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || dr(n);
					}
				}
				Ht.clear();
			}
		}
		Ht = null;
	}
}
function Wt(e) {
	kt.schedule(e);
}
function Gt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), tt(e, h);
		for (var n = e.first; n !== null;) Gt(n, t), n = n.next;
	}
}
function Kt(e) {
	tt(e, h);
	for (var t = e.first; t !== null;) Kt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var qt = /* @__PURE__ */ new Set(), Jt = /* @__PURE__ */ new Map(), Yt = !1;
function Xt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Le,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function P(e, t) {
	let n = Xt(e, t);
	return Xn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Zt(e, t = !1, n = !0) {
	let r = Xt(e);
	return t || (r.equals = ze), r;
}
function F(e, t, n = !1) {
	return Wn !== null && (!Gn || Wn.f & 131072) && qe() && Wn.f & 4325394 && (Yn === null || !Yn.has(e)) && ye(), Qt(e, n ? nn(t) : t, It);
}
function Qt(e, t, n = null) {
	if (!e.equals(t)) {
		Jt.set(e, Hn ? t : e.v);
		var r = zt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && wt(t), jt === null && nt(t);
		}
		e.wv = ar(), tn(e, g, n), qe() && qn !== null && qn.f & 1024 && !(qn.f & 96) && ($n === null ? er([e]) : $n.push(e)), !r.is_fork && qt.size > 0 && !Yt && $t();
	}
	return t;
}
function $t() {
	Yt = !1;
	for (let e of qt) {
		e.f & 1024 && tt(e, _);
		let t;
		try {
			t = or(e);
		} catch {
			t = !0;
		}
		t && dr(e);
	}
	qt.clear();
}
function en(e) {
	F(e, e.v + 1);
}
function tn(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = qe(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === qn)) {
			var l = (c & g) === 0;
			if (l && tt(s, t), c & 131072) qt.add(s);
			else if (c & 2) {
				var u = s;
				jt?.delete(u), c & 65536 || (c & 512 && (qn === null || !(qn.f & 2097152)) && (s.f |= ee), tn(u, _, n));
			} else if (l) {
				var d = s;
				c & 16 && Ht !== null && Ht.add(d), n === null ? Wt(d) : n.push(d);
			}
		}
	}
}
function nn(t) {
	if (typeof t != "object" || !t || re in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ P(0), u = null, d = rr, f = (e) => {
		if (rr === d) return e();
		var t = Wn, n = rr;
		Kn(null), ir(d);
		var r = e();
		return Kn(t), ir(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ P(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && O();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ P(n.value, u);
				return r.set(t, e), e;
			}) : F(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ P(Se, u));
					r.set(t, e), en(o);
				}
			} else F(n, Se), en(o);
			return !0;
		},
		get(e, n, i) {
			if (n === re) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ P(nn(s ? e[n] : Se), u)), r.set(n, o)), o !== void 0) {
				var c = B(o);
				return c === Se ? void 0 : c;
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
				if (a !== void 0 && o !== Se) return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return n;
		},
		has(e, t) {
			if (t === re) return !0;
			var n = r.get(t), i = n !== void 0 && n.v !== Se || Reflect.has(e, t);
			return (n !== void 0 || qn !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ P(i ? nn(e[t]) : Se, u)), r.set(t, n)), B(n) === Se) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ P(Se, u)), r.set(d + "", p)) : F(p, Se);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ P(void 0, u)), F(c, nn(n)), r.set(t, c));
			else {
				l = c.v !== Se;
				var m = f(() => nn(n));
				F(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && F(g, _ + 1);
				}
				en(o);
			}
			return !0;
		},
		ownKeys(e) {
			B(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== Se;
			});
			for (var [n, i] of r) i.v !== Se && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			k();
		}
	});
}
var rn, an, on, sn;
function cn() {
	if (rn === void 0) {
		rn = window, an = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		on = a(t, "firstChild").get, sn = a(t, "nextSibling").get, u(e) && (e[se] = void 0, e[oe] = null, e[ce] = void 0, e.__e = void 0), u(n) && (n[le] = void 0);
	}
}
function ln(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function un(e) {
	return on.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function dn(e) {
	return sn.call(e);
}
function I(e, t) {
	if (!ke) return /* @__PURE__ */ un(e);
	var n = /* @__PURE__ */ un(je);
	if (n === null) n = je.appendChild(ln());
	else if (t && n.nodeType !== 3) {
		var r = ln();
		return n?.before(r), Me(r), r;
	}
	return t && hn(n), Me(n), n;
}
function L(e, t = !1) {
	if (!ke) {
		var n = /* @__PURE__ */ un(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ dn(n) : n;
	}
	if (t) {
		if (je?.nodeType !== 3) {
			var r = ln();
			return je?.before(r), Me(r), r;
		}
		hn(je);
	}
	return je;
}
function R(e, t = 1, n = !1) {
	let r = ke ? je : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ dn(r);
	if (!ke) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = ln();
			return r === null ? i?.after(a) : r.before(a), Me(a), a;
		}
		hn(r);
	}
	return Me(r), r;
}
function fn(e) {
	e.textContent = "";
}
function pn() {
	return !1;
}
function mn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function hn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function gn(e) {
	qn === null && (Wn === null && _e(e), ge()), Hn && he(e);
}
function _n(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function vn(e, t) {
	var n = qn;
	n !== null && n.f & 8192 && (e |= v);
	var r = {
		ctx: Ue,
		deps: null,
		nodes: null,
		f: e | g | 512,
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
	if (e & 4) Ft === null ? zt.ensure().schedule(r) : Ft.push(r);
	else if (t !== null) {
		try {
			dr(r);
		} catch (e) {
			throw Mn(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= S));
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
	return tt(t, h), t.teardown = e, t;
}
function xn(e) {
	gn("$effect");
	var t = qn.f;
	if (!Wn && t & 32 && Ue !== null && !Ue.i) {
		var n = Ue;
		(n.e ??= []).push(e);
	} else return Sn(e);
}
function Sn(e) {
	return vn(4 | w, e);
}
function Cn(e) {
	zt.ensure();
	let t = vn(64 | C, e);
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
	return vn(te | C, e);
}
function En(e, t = 0) {
	return vn(8 | t, e);
}
function z(e, t = [], n = [], r = []) {
	gt(r, t, n, (t) => {
		vn(8, () => {
			e(...t.map(B));
		});
	});
}
function Dn(e, t = 0) {
	return vn(16 | t, e);
}
function On(e) {
	return vn(32 | C, e);
}
function kn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = Hn, n = Wn;
		Un(!0), Kn(null);
		try {
			t.call(null);
		} finally {
			Un(e), Kn(n);
		}
	}
}
function An(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && dt(() => {
			e.abort(de);
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
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Nn(e.nodes.start, e.nodes.end), n = !0), e.f |= x, An(e, t && !n), ur(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	kn(e), e.f ^= x, e.f |= y;
	var i = e.parent;
	i !== null && i.first !== null && Pn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Nn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ dn(e);
		e.remove(), e = n;
	}
}
function Pn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Fn(e, t, n = !0) {
	var r = [];
	In(e, r, !0);
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
		e.f ^= v;
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
	Rn(e, !0);
}
function Rn(e, t) {
	if (e.f & 8192) {
		e.f ^= v, e.f & 1024 || (tt(e, g), zt.ensure().schedule(e));
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
		var i = n === r ? null : /* @__PURE__ */ dn(n);
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
	if (t & 2 && (e.f &= ~ee), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (or(a) && Tt(a), a.wv > e.wv) return !0;
		}
		t & 512 && jt === null && tt(e, h);
	}
	return !1;
}
function sr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Yn !== null && Yn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? sr(a, t, !1) : t === a && (n ? tt(a, g) : a.f & 1024 && tt(a, _), Wt(a));
	}
}
function cr(e) {
	var t = Zn, n = Qn, r = $n, i = Wn, a = Yn, o = Ue, s = Gn, c = rr, l = e.f;
	Zn = null, Qn = 0, $n = null, Wn = l & 96 ? null : e, Yn = null, We(e.ctx), Gn = !1, rr = ++nr, e.ac !== null && (dt(() => {
		e.ac.abort(de);
	}), e.ac = null);
	try {
		e.f |= E;
		var u = e.fn, d = u();
		e.f |= b;
		var f = e.deps, p = kt?.is_fork;
		if (Zn !== null) {
			var m;
			if (p || ur(e, Qn), f !== null && Qn > 0) for (f.length = Qn + Zn.length, m = 0; m < Zn.length; m++) f[Qn + m] = Zn[m];
			else e.deps = f = Zn;
			if (yn() && e.f & 512) for (m = Qn; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && Qn < f.length && (ur(e, Qn), f.length = Qn);
		if (qe() && $n !== null && !Gn && f !== null && !(e.f & 6146)) for (m = 0; m < $n.length; m++) sr($n[m], e);
		if (i !== null && i !== e) {
			if (nr++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = nr;
			if (t !== null) for (let e of t) e.rv = nr;
			$n !== null && (r === null ? r = $n : r.push(...$n));
		}
		return e.f & 8388608 && (e.f ^= ne), d;
	} catch (e) {
		return Qe(e);
	} finally {
		e.f ^= E, Zn = t, Qn = n, $n = r, Wn = i, Yn = a, We(o), Gn = s, rr = c;
	}
}
function lr(e, r) {
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
		s.f & 512 && (s.f ^= 512, s.f &= ~ee), s.v !== Se && nt(s), s.ac !== null && dt(() => {
			s.ac.abort(de), s.ac = null, tt(s, g);
		}), Et(s), ur(s, 0);
	}
}
function ur(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) lr(e, n[r]);
}
function dr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		tt(e, h);
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
async function fr() {
	await Promise.resolve(), Bt();
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
	if (Hn && Jt.has(e)) return Jt.get(e);
	if (t) {
		var a = e;
		if (Hn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || mr(a)) && (o = wt(a)), Jt.set(a, o), o;
		}
		var s = !(a.f & 512) && !Gn && Wn !== null && (Vn || !!(Wn.f & 512)), c = (a.f & b) === 0;
		or(a) && (s && (a.f |= 512), Tt(a)), s && !c && (Dt(a), pr(a));
	}
	if (jt?.has(e)) return jt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function pr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (Dt(t), pr(t));
}
function mr(e) {
	if (e.v === Se) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Jt.has(t) || t.f & 2 && mr(t)) return !0;
	return !1;
}
function hr(e) {
	var t = Gn;
	try {
		return Gn = !0, e();
	} finally {
		Gn = t;
	}
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var gr = ["touchstart", "touchmove"];
function _r(e) {
	return gr.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var vr = Symbol("events"), yr = /* @__PURE__ */ new Set(), br = /* @__PURE__ */ new Set();
function xr(e) {
	if (!ke) return;
	e.removeAttribute("onload"), e.removeAttribute("onerror");
	let t = e.__e;
	t !== void 0 && (e.__e = void 0, queueMicrotask(() => {
		e.isConnected && e.dispatchEvent(t);
	}));
}
function Sr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Er.call(t, e), !e.cancelBubble) return dt(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Xe(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function Cr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = Sr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && bn(() => {
		t.removeEventListener(e, o, a);
	});
}
function V(e, t, n) {
	(t[vr] ??= {})[e] = n;
}
function wr(e) {
	for (var t = 0; t < e.length; t++) yr.add(e[t]);
	for (var n of br) n(e);
}
var Tr = null;
function Er(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	Tr = e;
	var s = 0, c = Tr === e && e[vr];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[vr] = t;
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
					var h = o[vr]?.[r];
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
			e[vr] = t, delete e.currentTarget, Kn(d), Jn(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var Dr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Or(e) {
	return Dr?.createHTML(e) ?? e;
}
function kr(e) {
	var t = mn("template");
	return t.innerHTML = Or(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function Ar(e, t) {
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
		if (ke) return Ar(je, null), je;
		i === void 0 && (i = kr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ un(i)));
		var t = r || an ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ un(t), s = t.lastChild;
			Ar(o, s);
		} else Ar(t, t);
		return t;
	};
}
function jr(e = "") {
	if (!ke) {
		var t = ln(e + "");
		return Ar(t, t), t;
	}
	var n = je;
	return n.nodeType === 3 ? hn(n) : (n.before(n = ln()), Me(n)), Ar(n, n), n;
}
function Mr() {
	if (ke) return Ar(je, null), je;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = ln();
	return e.append(t, n), Ar(t, n), e;
}
function U(e, t) {
	if (ke) {
		var n = qn;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = je), Ne();
		return;
	}
	e !== null && e.before(t);
}
function W(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[le] ??= e.nodeValue) && (e[le] = n, e.nodeValue = `${n}`);
}
function Nr(e, t) {
	return Fr(e, t);
}
var Pr = /* @__PURE__ */ new Map();
function Fr(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	cn();
	var l = void 0, u = Cn(() => {
		var s = n ?? t.appendChild(ln());
		mt(s, { pending: () => {} }, (t) => {
			Ge({});
			var n = Ue;
			if (o && (n.c = o), a && (i.$$events = a), ke && Ar(t, null), l = e(t, i) || {}, ke && (qn.nodes.end = je, je === null || je.nodeType !== 8 || je.data !== "]")) throw De(), xe;
			Ke();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = _r(r);
					for (let e of [t, document]) {
						var a = Pr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Pr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Er, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(yr)), br.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = Pr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Er), r.delete(e), r.size === 0 && Pr.delete(n)) : r.set(e, i);
			}
			br.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return Ir.set(l, u), l;
}
var Ir = /* @__PURE__ */ new WeakMap(), Lr = class {
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
						zn(r, t), t.append(ln()), this.#n.set(e, {
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
		var n = kt, r = pn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = ln();
			i.append(a), this.#n.set(e, {
				effect: On(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, On(() => t(this.anchor)));
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else ke && (this.anchor = je), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function G(e, t, n = !1) {
	var r;
	ke && (r = je, Ne());
	var i = new Lr(e), a = n ? S : 0;
	function o(e, t) {
		if (ke) {
			var n = Ie(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Fe();
				Me(a), i.anchor = a, Ae(!1), i.ensure(e, t), Ae(!0);
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
function Rr(e, t) {
	return t;
}
function zr(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		Fn(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					Br(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = i.length === 0 && n !== null;
		if (l) {
			var u = n, d = u.parentNode;
			fn(d), d.append(u), e.items.clear();
		}
		Br(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function Br(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= T, zn(a, document.createDocumentFragment())) : Mn(t[i], n);
	}
}
var Vr;
function Hr(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = ke ? Me(/* @__PURE__ */ un(u)) : u.appendChild(ln());
	}
	ke && Ne();
	var d = null, f = /* @__PURE__ */ St(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Wr(v, p, c, n, a), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= T, Kr(d, null, c)) : Ln(d) : Fn(d, () => {
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
			ke && Ie(c) === "[!" != (e === 0) && (c = Fe(), Me(c), Ae(!1), t = !0);
			for (var r = /* @__PURE__ */ new Set(), u = kt, v = pn(), y = 0; y < e; y += 1) {
				ke && je.nodeType === 8 && je.data === "]" && (c = je, t = !0, Ae(!1));
				var b = p[y], x = a(b, y), S = h ? null : l.get(x);
				S ? (S.v && Qt(S.v, b), S.i && Qt(S.i, y), v && u.unskip_effect(S.e)) : (S = Gr(l, h ? c : Vr ??= ln(), b, x, y, o, n, i), h || (S.e.f |= T), l.set(x, S)), r.add(x);
			}
			if (e === 0 && s && !d && (h ? d = On(() => s(c)) : (d = On(() => s(Vr ??= ln())), d.f |= T)), e > r.size && me("", "", ""), ke && e > 0 && Me(Fe()), !h) if (m.set(u, r), v) {
				for (let [e, t] of l) r.has(e) || u.skip_effect(t.e);
				u.oncommit(g), u.ondiscard(_);
			} else g(u);
			t && Ae(!0), B(f);
		}),
		flags: n,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, ke && (c = je);
}
function Ur(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Wr(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = Ur(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Ln(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= T, _ === l) Kr(_, null, n);
		else {
			var y = d ? d.next : l;
			_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), qr(e, d, _), qr(e, _, y), Kr(_, y, n), d = _, p = [], m = [], l = Ur(d.next);
			continue;
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Kr(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					qr(e, S.prev, C.next), qr(e, d, S), qr(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), Kr(_, l, n), qr(e, _.prev, _.next), qr(e, _, d === null ? e.effect.first : d.next), qr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Ur(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Ur(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Br(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Ur(l.next);
		var ee = w.length;
		if (ee > 0) {
			var E = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.fix();
			}
			zr(e, w, E);
		}
	}
	o && Xe(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Gr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Xt(n) : /* @__PURE__ */ Zt(n, !1, !1) : null, l = o & 2 ? Xt(i) : null;
	return {
		v: c,
		i: l,
		e: On(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Kr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ dn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function qr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
function K(e, t, n = !1, r = !1, i = !1, a = !1) {
	var o = e, s = "";
	if (n) {
		var c = e;
		ke && (o = Me(/* @__PURE__ */ un(c)));
	}
	z(() => {
		var e = qn;
		if (s === (s = t() ?? "")) {
			ke && Ne();
			return;
		}
		if (n && !ke) {
			e.nodes = null, c.innerHTML = s, s !== "" && Ar(/* @__PURE__ */ un(c), c.lastChild);
			return;
		}
		if (e.nodes !== null && (Nn(e.nodes.start, e.nodes.end), e.nodes = null), s !== "") {
			if (ke) {
				for (var a = je.data, l = Ne(), u = l; l !== null && (l.nodeType !== 8 || l.data !== "");) u = l, l = /* @__PURE__ */ dn(l);
				if (l === null) throw De(), xe;
				Ar(je, u), o = Me(l);
				return;
			}
			var d = mn(r ? "svg" : i ? "math" : "template", r ? we : i ? Te : void 0);
			d.innerHTML = s;
			var f = r || i ? d : d.content;
			if (Ar(/* @__PURE__ */ un(f), f.lastChild), r || i) for (; /* @__PURE__ */ un(f);) o.before(/* @__PURE__ */ un(f));
			else o.before(f);
		}
	});
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
var Jr = [..." 	\n\r\f\xA0\v﻿"];
function Yr(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Jr.includes(r[o - 1])) && (s === r.length || Jr.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function Xr(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function Zr(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function Qr(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(Zr)), i && c.push(...Object.keys(i).map(Zr));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = Zr(e.substring(l, u).trim());
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
		return r && (n += Xr(r)), i && (n += Xr(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function $r(e, t, n, r, i, a) {
	var o = e[se];
	if (ke || o !== n || o === void 0) {
		var s = Yr(n, r, a);
		(!ke || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[se] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function ei(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function ti(e, t, n, r) {
	var i = e[ce];
	if (ke || i !== t) {
		var a = Qr(t, r);
		(!ke || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[ce] = t;
	} else r && (Array.isArray(r) ? (ei(e, n?.[0], r[0]), ei(e, n?.[1], r[1], "important")) : ei(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var ni = Symbol("is custom element"), ri = Symbol("is html"), ii = fe ? "link" : "LINK", ai = fe ? "progress" : "PROGRESS";
function q(e) {
	if (ke) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					Y(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					Y(e, "checked", null), e.checked = r;
				}
			}
		};
		e[ue] = n, Xe(n), ut();
	}
}
function J(e, t) {
	var n = si(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === ai) && (e.value = t ?? "");
}
function oi(e, t) {
	var n = si(e);
	n.checked !== (n.checked = t ?? void 0) && (e.checked = t);
}
function Y(e, t, n, r) {
	var i = si(e);
	ke && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === ii) || i[t] !== (i[t] = n) && (t === "loading" && (e[ae] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && li(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function si(e) {
	return e[oe] ??= {
		[ni]: e.nodeName.includes("-"),
		[ri]: e.namespaceURI === Ce
	};
}
var ci = /* @__PURE__ */ new Map();
function li(e) {
	var t = e.getAttribute("is") || e.nodeName, n = ci.get(t);
	if (n) return n;
	ci.set(t, n = []);
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.push(s);
		i = l(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function ui(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	j(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = di(e) ? fi(a) : a, n(a), kt !== null && r.add(kt), await fr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (ke && e.defaultValue !== e.value || hr(t) == null && e.value) && (n(di(e) ? fi(e.value) : e.value), kt !== null && r.add(kt)), En(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = kt;
			if (r.has(i)) return;
		}
		di(e) && n === fi(e.value) || e.type === "date" && !n && !e.value || n !== e.value && (e.value = n ?? "");
	});
}
function di(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function fi(e) {
	return e === "" ? null : +e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function pi(e, t) {
	return e === t || e?.[re] === t;
}
function mi(e = {}, t, n, r) {
	var i = Ue.r, a = qn;
	return wn(() => {
		var o, s;
		return En(() => {
			o = s, s = r?.() || [], hr(() => {
				pi(n(...s), e) || (t(e, ...s), o && pi(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && pi(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function hi(e, t, n, r) {
	var i = !0, o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ yt(r), B(u)) : (l && (l = !1, c = s ? hr(r) : r), c);
	let f;
	if (o) {
		var p = re in e || ie in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = ot(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && ve(t), f(m)));
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
			let n = t ? B(y) : i && o ? nn(e) : e;
			return F(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return Hn && v || b.f & 16384 ? y.v : B(y);
	});
}
var gi = {
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
}, _i = [
	"nb",
	"nn",
	"en-GB",
	"se",
	"tr"
], vi = /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/, yi = {
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
function bi(e) {
	let t = String(e ?? "").trim().toLowerCase();
	for (let [e, n] of Object.entries(yi)) if (n.some((e) => t === e || t.startsWith(`${e}-`))) return e;
	return null;
}
function xi(e) {
	return _i.includes(String(e ?? ""));
}
function Si(e) {
	let t = [];
	if (!Array.isArray(e)) return ["languages må være en liste"];
	for (let n of e) {
		if (!n || typeof n != "object" || Array.isArray(n)) {
			t.push("languages: hvert innslag må være et objekt");
			continue;
		}
		let e = String(n.code ?? "");
		vi.test(e) ? xi(e) && t.push(`languages: '${e}' er innebygd i Urd og kan ikke overstyres`) : t.push(`languages: '${e}' er ikke en gyldig språkkode`), (typeof n.name != "string" || !n.name.trim()) && t.push(`languages/${e}: name mangler (språkets eget navn)`);
		for (let r of ["site", "admin"]) n[r] !== void 0 && typeof n[r] != "boolean" && t.push(`languages/${e}: ${r} må være boolsk`);
		n.site !== !0 && n.admin !== !0 && t.push(`languages/${e}: må dekke site, admin eller begge`);
	}
	return t;
}
function Ci(e) {
	let t = bi(e);
	if (t) return t;
	let n = String(e ?? "").trim();
	return vi.test(n) ? n : "nb";
}
async function wi(e, t) {
	try {
		return await (await import(
			/* @vite-ignore */
			"/assets/urd/language-packs.js"
)).loadPackStrings(e, t);
	} catch {
		return null;
	}
}
({ ...gi.strings });
var Ti = {
	lang: "nb",
	dict: {}
};
function Ei(e, t) {
	if (!t) return e;
	let n = e;
	for (let [e, r] of Object.entries(t)) n = n.replaceAll(`{${e}}`, String(r));
	return n;
}
function X(e, t) {
	return Ei(Ti.dict[e] ?? e, t);
}
function Di(e) {
	let t = `api.${e?.code}`;
	return e?.code && Ti.dict[t] !== void 0 ? Ei(Ti.dict[t], e) : e?.error ?? null;
}
function Oi() {
	return Ti.lang;
}
function ki() {
	let e = null;
	try {
		e = localStorage.getItem("urd-admin-lang");
	} catch {}
	if (e) return Ci(e);
	for (let e of navigator.languages ?? [navigator.language]) {
		let t = bi(e);
		if (t) return t;
	}
	return "en-GB";
}
var Ai;
new Promise((e) => {
	Ai = e;
});
async function ji(e = ki()) {
	let t = async (e) => (await import(
		/* @vite-ignore */
		`/assets/urd/locales/admin/${e}.js`
)).default.strings;
	Ti.lang = Ci(e);
	let n = xi(Ti.lang);
	try {
		Object.assign(Ti.dict, await t("nb")), n && Ti.lang !== "nb" && Object.assign(Ti.dict, await t(Ti.lang));
	} catch {}
	if (!n) {
		let e = await wi(Ti.lang, "admin");
		e ? Object.assign(Ti.dict, e) : Ti.lang = "nb";
	}
	return Ai(Ti.lang), Ti.lang;
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region src/lib/draftStore.js
function Mi(e, t, n) {
	let r = t(), i = JSON.stringify(r), a = JSON.parse(i), o = localStorage.getItem(e);
	if (o) try {
		a = JSON.parse(o);
	} catch {
		localStorage.removeItem(e);
	}
	return {
		get data() {
			return a;
		},
		save() {
			let t = JSON.stringify(a);
			if (t === i) return localStorage.removeItem(e), !0;
			try {
				return localStorage.setItem(e, t), !0;
			} catch (e) {
				return n?.(e), !1;
			}
		},
		reset() {
			return localStorage.removeItem(e), a = JSON.parse(i), a;
		},
		replace(e) {
			return a = e, a;
		},
		amendBaseline(e) {
			let t = JSON.parse(i);
			e(t), i = JSON.stringify(t);
		},
		hasDraft() {
			return localStorage.getItem(e) !== null;
		}
	};
}
//#endregion
//#region src/lib/ColorPicker.svelte
var Ni = /* @__PURE__ */ H("<button type=\"button\" class=\"cp-clear svelte-zxiloo\">×</button>"), Pi = /* @__PURE__ */ H("<button type=\"button\" class=\"cp-eye svelte-zxiloo\"><svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 2l4 4-3 3-4-4 3-3z\"></path><path d=\"M15 5L4 16l-1 5 5-1L19 9\"></path></svg></button>"), Fi = /* @__PURE__ */ H("<input type=\"number\" min=\"0\" max=\"255\" class=\"svelte-zxiloo\"/>"), Ii = /* @__PURE__ */ H("<button type=\"button\"></button>"), Li = /* @__PURE__ */ H("<span class=\"cp-label svelte-zxiloo\"> <!></span> <span class=\"cp-tokens svelte-zxiloo\"></span>", 1), Ri = /* @__PURE__ */ H("<span class=\"cp-saved svelte-zxiloo\"><button type=\"button\" class=\"cp-token svelte-zxiloo\"></button> <button type=\"button\" class=\"cp-del svelte-zxiloo\">×</button></span>"), zi = /* @__PURE__ */ H("<span class=\"cp-tokens svelte-zxiloo\"></span>"), Bi = /* @__PURE__ */ H("<button type=\"button\" class=\"cp-token svelte-zxiloo\"></button>"), Vi = /* @__PURE__ */ H("<span class=\"cp-label svelte-zxiloo\"> </span> <span class=\"cp-tokens svelte-zxiloo\"></span>", 1), Hi = /* @__PURE__ */ H("<div class=\"cp-pop svelte-zxiloo\"><div class=\"cp-sv svelte-zxiloo\"><span class=\"cp-cursor svelte-zxiloo\"></span></div> <input class=\"cp-hue svelte-zxiloo\" type=\"range\" min=\"0\" max=\"360\" step=\"1\"/> <input class=\"cp-alpha svelte-zxiloo\" type=\"range\" min=\"0\" max=\"100\" step=\"1\"/> <span class=\"cp-row svelte-zxiloo\"><span class=\"cp-preview svelte-zxiloo\"></span> <input class=\"cp-hex svelte-zxiloo\" spellcheck=\"false\"/> <!></span> <span class=\"cp-row cp-rgb svelte-zxiloo\"></span> <!> <span class=\"cp-label cp-label-row svelte-zxiloo\"> <button type=\"button\" class=\"cp-add svelte-zxiloo\">+</button></span> <!> <!></div>"), Ui = /* @__PURE__ */ H("<span class=\"cp svelte-zxiloo\"><button type=\"button\"></button> <!> <!></span>");
function Wi(e, t) {
	Ge(t, !0);
	let n = hi(t, "value", 3, "#000000"), r = hi(t, "tokens", 19, () => []), i = hi(t, "label", 19, () => X("cp.pickColor")), a = hi(t, "allowClear", 3, !1), o = "urd-recent-colors", s = "urd-saved-colors", c = () => {
		let e = r().find(([e]) => e === n());
		return e ? e[1] : n();
	}, l = () => r().find(([e]) => e === n())?.[0] ?? null, u = /* @__PURE__ */ P(nn([])), d = /* @__PURE__ */ P(nn([])), f = "", p = "", h = /* @__PURE__ */ P(null), g = /* @__PURE__ */ P(!1), _ = /* @__PURE__ */ P(nn({
		top: 0,
		left: 0
	})), v = /* @__PURE__ */ P(0), y = /* @__PURE__ */ P(0), b = /* @__PURE__ */ P(1), x = /* @__PURE__ */ P(1), S = /* @__PURE__ */ P("#000000");
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
	let w = (e, t, n) => "#" + [
		e,
		t,
		n
	].map((e) => e.toString(16).padStart(2, "0")).join("");
	function T(e, t, n) {
		e /= 255, t /= 255, n /= 255;
		let r = Math.max(e, t, n), i = r - Math.min(e, t, n), a = 0;
		return i && (a = r === e ? (t - n) / i % 6 : r === t ? (n - e) / i + 2 : (e - t) / i + 4, a *= 60, a < 0 && (a += 360)), [
			a,
			r ? i / r : 0,
			r
		];
	}
	function ee(e, t, n) {
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
	function E() {
		return w(...ee(B(v), B(y), B(b)));
	}
	function te() {
		let e = E();
		return B(x) >= .995 ? e : e + Math.round(B(x) * 255).toString(16).padStart(2, "0");
	}
	function ne() {
		F(S, te(), !0), p = B(S), t.onchange?.(B(S));
	}
	function re(e) {
		let t = C(e);
		return t ? (((e) => {
			var t = m(e, 3);
			F(v, t[0], !0), F(y, t[1], !0), F(b, t[2], !0);
		})(T(t[0], t[1], t[2])), F(x, t[3], !0), F(S, te(), !0), !0) : !1;
	}
	function ie() {
		re(c()) || re("#000000"), f = n(), p = "";
		try {
			let e = JSON.parse(localStorage.getItem(o) ?? "[]");
			F(u, Array.isArray(e) ? e : [], !0);
		} catch {
			F(u, [], !0);
		}
		try {
			let e = JSON.parse(localStorage.getItem(s) ?? "[]");
			F(d, Array.isArray(e) ? e : [], !0);
		} catch {
			F(d, [], !0);
		}
		let e = B(h).getBoundingClientRect(), t = B(h).closest(".panel-body")?.getBoundingClientRect(), r = t ? t.right : window.innerWidth, i = Math.max(8, Math.min(e.right - 236, r - 236 - 8)), a = e.bottom + 380 + 8 > window.innerHeight ? Math.max(8, e.top - 380 - 8) : e.bottom + 6;
		F(_, {
			top: a,
			left: i
		}, !0), F(g, !0);
	}
	function ae() {
		if (F(g, !1), p && p !== f) {
			let e = [p, ...B(u).filter((e) => e !== p)].slice(0, 8);
			localStorage.setItem(o, JSON.stringify(e));
		}
	}
	function oe(e, n) {
		re(n), F(S, n, !0), t.onchange?.(e);
	}
	function se(e) {
		let t = e.currentTarget;
		t.setPointerCapture(e.pointerId);
		let n = (e) => {
			let n = t.getBoundingClientRect();
			F(y, Math.min(1, Math.max(0, (e.clientX - n.left) / n.width)), !0), F(b, 1 - Math.min(1, Math.max(0, (e.clientY - n.top) / n.height))), ne();
		};
		n(e);
		let r = (e) => n(e), i = () => {
			t.removeEventListener("pointermove", r), t.removeEventListener("pointerup", i);
		};
		t.addEventListener("pointermove", r), t.addEventListener("pointerup", i);
	}
	function ce(e) {
		re(e.target.value) ? ne() : F(S, E(), !0);
	}
	function le(e) {
		return (C(E()) ?? [
			0,
			0,
			0
		])[e];
	}
	function ue(e, t) {
		let n = C(E()) ?? [
			0,
			0,
			0
		];
		n[e] = Math.min(255, Math.max(0, Number(t) || 0)), ((e) => {
			var t = m(e, 3);
			F(v, t[0], !0), F(y, t[1], !0), F(b, t[2], !0);
		})(T(...n)), ne();
	}
	let de = typeof window < "u" && "EyeDropper" in window;
	async function fe() {
		try {
			re((await new window.EyeDropper().open()).sRGBHex) && ne();
		} catch {}
	}
	function pe(e) {
		re(e) && ne();
	}
	function me() {
		let e = te();
		B(d).includes(e) || (F(d, [e, ...B(d)].slice(0, 12), !0), localStorage.setItem(s, JSON.stringify(Ve(B(d)))));
	}
	function he(e) {
		F(d, B(d).filter((t) => t !== e), !0), localStorage.setItem(s, JSON.stringify(Ve(B(d))));
	}
	xn(() => {
		if (!B(g)) return;
		let e = (e) => {
			B(h) && !B(h).contains(e.target) && ae();
		}, t = (e) => {
			e.key === "Escape" && ae();
		}, n = () => ae();
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t, !0), window.addEventListener("blur", n), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t, !0), window.removeEventListener("blur", n);
		};
	});
	var ge = Ui(), _e = I(ge);
	let D;
	var ve = R(_e, 2), O = (e) => {
		var n = Ni();
		z((e, t) => {
			Y(n, "title", e), Y(n, "aria-label", t);
		}, [() => X("cp.clearTitle"), () => X("cp.clear")]), V("click", n, () => t.onchange?.("")), U(e, n);
	};
	G(ve, (e) => {
		a() && n() && e(O);
	});
	var k = R(ve, 2), ye = (e) => {
		var t = Hi(), i = I(t), a = I(i);
		A(i);
		var o = R(i, 2);
		q(o);
		var s = R(o, 2);
		q(s);
		var c = R(s, 2), f = I(c), p = R(f, 2);
		q(p);
		var h = R(p, 2), g = (e) => {
			var t = Pi();
			z((e) => Y(t, "title", e), [() => X("cp.eyedropper")]), V("click", t, fe), U(e, t);
		};
		G(h, (e) => {
			de && e(g);
		}), A(c);
		var C = R(c, 2);
		Hr(C, 22, () => [
			"R",
			"G",
			"B"
		], (e) => e, (e, t, n) => {
			var r = Fi();
			q(r), z((e) => {
				Y(r, "title", t), J(r, e);
			}, [() => le(B(n))]), V("change", r, (e) => ue(B(n), e.target.value)), U(e, r);
		}), A(C);
		var w = R(C, 2), T = (e) => {
			var t = Li(), i = L(t), a = I(i, !0), o = R(a), s = (e) => {
				var t = jr();
				z((e) => W(t, e), [() => X("cp.linkedSuffix", { token: l() })]), U(e, t);
			}, c = /* @__PURE__ */ N(() => l());
			G(o, (e) => {
				B(c) && e(s);
			}), A(i);
			var u = R(i, 2);
			Hr(u, 21, r, ([e, t]) => e, (e, t) => {
				var r = /* @__PURE__ */ N(() => m(B(t), 2));
				let i = () => B(r)[0], a = () => B(r)[1];
				var o = Ii();
				let s;
				z((e) => {
					s = $r(o, 1, "cp-token svelte-zxiloo", null, s, { active: n() === i() }), ti(o, `background: ${a() ?? ""}`), Y(o, "title", e);
				}, [() => X("cp.tokenTitle", { name: i() })]), V("click", o, () => oe(i(), a())), U(e, o);
			}), A(u), z((e) => W(a, e), [() => X("cp.themeColors")]), U(e, t);
		};
		G(w, (e) => {
			r().length && e(T);
		});
		var ee = R(w, 2), te = I(ee), re = R(te);
		A(ee);
		var ie = R(ee, 2), ae = (e) => {
			var t = zi();
			Hr(t, 20, () => B(d), (e) => e, (e, t) => {
				var n = Ri(), r = I(n), i = R(r, 2);
				A(n), z((e) => {
					ti(r, `background: ${t ?? ""}`), Y(r, "title", t), Y(i, "title", e);
				}, [() => X("cp.removeSaved")]), V("click", r, () => pe(t)), V("click", i, () => he(t)), U(e, n);
			}), A(t), U(e, t);
		};
		G(ie, (e) => {
			B(d).length && e(ae);
		});
		var ge = R(ie, 2), _e = (e) => {
			var t = Vi(), n = L(t), r = I(n, !0);
			A(n);
			var i = R(n, 2);
			Hr(i, 20, () => B(u), (e) => e, (e, t) => {
				var n = Bi();
				z(() => {
					ti(n, `background: ${t ?? ""}`), Y(n, "title", t);
				}), V("click", n, () => pe(t)), U(e, n);
			}), A(i), z((e) => W(r, e), [() => X("common.recent")]), U(e, t);
		};
		G(ge, (e) => {
			B(u).length && e(_e);
		}), A(t), z((e, n, r, c, l) => {
			ti(t, `top: ${B(_).top ?? ""}px; left: ${B(_).left ?? ""}px`), ti(i, `background-image: linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent); background-color: hsl(${B(v) ?? ""}, 100%, 50%)`), ti(a, `left: ${B(y) * 100}%; top: ${(1 - B(b)) * 100}%`), J(o, B(v)), J(s, e), Y(s, "title", n), ti(s, `background: linear-gradient(to right, transparent, ${r ?? ""}), repeating-conic-gradient(rgb(255 255 255 / 35%) 0 25%, rgb(0 0 0 / 35%) 0 50%) 0 0 / 10px 10px`), ti(f, `background: ${B(S) ?? ""}`), J(p, B(S)), W(te, `${c ?? ""} `), Y(re, "title", l);
		}, [
			() => Math.round(B(x) * 100),
			() => X("cp.alpha"),
			() => E(),
			() => X("cp.saved"),
			() => X("cp.saveTitle")
		]), V("click", t, (e) => e.preventDefault()), V("pointerdown", i, se), V("input", o, (e) => {
			F(v, Number(e.target.value), !0), ne();
		}), V("input", s, (e) => {
			F(x, Number(e.target.value) / 100), ne();
		}), V("change", p, ce), V("click", re, me), U(e, t);
	};
	G(k, (e) => {
		B(g) && e(ye);
	}), A(ge), mi(ge, (e) => F(h, e), () => B(h)), z((e, t, n) => {
		D = $r(_e, 1, "cp-swatch svelte-zxiloo", null, D, e), ti(_e, `background: ${t ?? ""}`), Y(_e, "title", n), Y(_e, "aria-label", i());
	}, [
		() => ({
			linked: l(),
			"cp-empty": a() && !n()
		}),
		() => n() ? c() : "transparent",
		() => l() ? X("cp.linkedTitle", {
			label: i(),
			token: l()
		}) : i()
	]), V("click", _e, () => B(g) ? ae() : ie()), U(e, ge), Ke();
}
wr([
	"click",
	"pointerdown",
	"input",
	"change"
]);
//#endregion
//#region ../template/assets/engine/0.6.11/imageTools.js
var Gi = 1600, Ki = .82, qi = .6;
async function Ji(e, t = Gi) {
	if (Xi(e)) return Zi(await e.text());
	let n = await createImageBitmap(e), r = Math.min(1, t / Math.max(n.width, n.height)), i = Math.round(n.width * r), a = Math.round(n.height * r), o = document.createElement("canvas");
	o.width = i, o.height = a, o.getContext("2d").drawImage(n, 0, 0, i, a), n.close();
	let s = (e) => new Promise((t) => o.toBlob(t, "image/webp", e)), c = await s(Ki);
	return c.size > 4e5 && (c = await s(qi)), {
		dataUrl: await new Promise((e) => {
			let t = new FileReader();
			t.onload = () => e(t.result), t.readAsDataURL(c);
		}),
		bytes: c.size,
		width: i,
		height: a
	};
}
var Yi = "image/svg+xml";
function Xi(e) {
	return e.type === Yi || /\.svg$/i.test(e.name || "");
}
function Zi(e) {
	let t = String(e ?? "");
	if (!/<svg[\s>]/i.test(t)) throw Error("Ugyldig SVG");
	if (/<\s*script[\s>]/i.test(t) || /<\s*foreignObject[\s>]/i.test(t) || /\son[a-z]+\s*=/i.test(t) || /javascript:/i.test(t)) throw Error("SVG-en inneholder skript eller hendelser og kan ikke brukes");
	let n = new Blob([t]).size, r = `data:${Yi};base64,${btoa(unescape(encodeURIComponent(t)))}`, i = t.match(/<svg\b[^>]*>/i)?.[0] ?? "", a = i.match(/viewBox\s*=\s*["']\s*([-\d.]+(?:[\s,]+[-\d.]+){3})\s*["']/i)?.[1]?.split(/[\s,]+/).map(Number);
	return {
		dataUrl: r,
		bytes: n,
		width: a?.length === 4 ? a[2] : Number.parseFloat(i.match(/\bwidth\s*=\s*["']?([\d.]+)/i)?.[1]) || 0,
		height: a?.length === 4 ? a[3] : Number.parseFloat(i.match(/\bheight\s*=\s*["']?([\d.]+)/i)?.[1]) || 0
	};
}
function Qi(e, t, n = .04) {
	let r = String(e ?? "");
	if (!t || !(t.width > 0) || !(t.height > 0)) return r;
	let i = r.match(/<svg\b[^>]*>/i)?.[0];
	if (!i) return r;
	let a = (e) => Math.round(e * 1e3) / 1e3, o = Math.max(t.width, t.height) * Math.max(0, n), s = a(t.x - o), c = a(t.y - o), l = a(t.width + 2 * o), u = a(t.height + 2 * o), d = i.replace(/\sviewBox\s*=\s*["'][^"']*["']/i, "").replace(/\swidth\s*=\s*["'][^"']*["']/i, "").replace(/\sheight\s*=\s*["'][^"']*["']/i, "").replace(/<svg\b/i, `<svg viewBox="${s} ${c} ${l} ${u}" width="${l}" height="${u}"`);
	return r.replace(i, d);
}
function $i(e) {
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
function ea(e) {
	return /^data:image\/svg\+xml[;,]/.test(e || "") ? "svg" : "webp";
}
function ta(e, t = "bilde") {
	return e.replace(/\.[^.]+$/, "").toLowerCase().replaceAll("æ", "ae").replaceAll("ø", "o").replaceAll("å", "a").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || t;
}
function na(e) {
	let t = 5381;
	for (let n = 0; n < e.length; n++) t = (t << 5) + t + e.charCodeAt(n) >>> 0;
	return t.toString(16).padStart(8, "0");
}
//#endregion
//#region ../template/assets/engine/0.6.11/glyphs.js
var ra = "urd-recent-glyphs", ia = [
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
function aa(e, t) {
	return [t, ...(Array.isArray(e) ? e : []).filter((e) => e !== t)].slice(0, 16);
}
function oa() {
	try {
		let e = JSON.parse(localStorage.getItem("urd-recent-glyphs") ?? "[]");
		return Array.isArray(e) ? e : [];
	} catch {
		return [];
	}
}
function sa(e) {
	let t = aa(oa(), e);
	try {
		localStorage.setItem(ra, JSON.stringify(t));
	} catch {}
	return t;
}
//#endregion
//#region ../template/assets/engine/0.6.11/icons.js
var ca = "fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"", la = "fill=\"currentColor\" stroke=\"none\"", ua = {
	facebook: {
		label: "Facebook",
		body: "<path d=\"M15.5 4H13a3.5 3.5 0 0 0-3.5 3.5V10H7v3.2h2.5V20h3.2v-6.8h2.5l.55-3.2h-3.05V7.8c0-.5.4-.8.9-.8h1.9z\"/>"
	},
	instagram: {
		label: "Instagram",
		body: "<rect x=\"3.5\" y=\"3.5\" width=\"17\" height=\"17\" rx=\"4.5\"/><circle cx=\"12\" cy=\"12\" r=\"3.8\"/><circle cx=\"16.9\" cy=\"7.1\" r=\"1.1\" fill=\"currentColor\" stroke=\"none\"/>"
	},
	x: {
		label: "X (Twitter)",
		body: "<path d=\"M5 4h3.8l4 5.4L17.4 4h2.4l-5.9 6.9L20.5 20h-3.8l-4.3-5.8L7.4 20H5l6.3-7.4z\"/>",
		fill: !0
	},
	linkedin: {
		label: "LinkedIn",
		body: "<circle cx=\"4.8\" cy=\"4.8\" r=\"1.7\"/><path d=\"M3.3 9.2h3v11h-3z\"/><path d=\"M9.7 20.2v-11h3v1.6a3.9 3.9 0 0 1 3.3-1.8c2.6 0 4.4 1.8 4.4 4.9v6.3h-3.1v-5.7c0-1.6-.7-2.6-2-2.6-1.4 0-2.5 1-2.5 2.7v5.6z\"/>"
	},
	youtube: {
		label: "YouTube",
		body: "<rect x=\"2.8\" y=\"5.7\" width=\"18.4\" height=\"12.6\" rx=\"3.6\"/><path d=\"M10.2 9.3l5 2.7-5 2.7z\" fill=\"currentColor\" stroke=\"none\"/>"
	},
	tiktok: {
		label: "TikTok",
		body: "<path d=\"M13.8 5v9.3a3.9 3.9 0 1 1-3.9-3.9\"/><path d=\"M13.8 5c.5 2.9 2.6 4.8 5.6 5v3.1c-2.1-.1-4-.8-5.6-2\"/>"
	},
	whatsapp: {
		label: "WhatsApp",
		body: "<path d=\"M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5z\"/><path d=\"M9.2 8.4l1 2-.8 1a7.3 7.3 0 0 0 3.2 3.2l1-.8 2 1c-.3 1.3-1.2 1.9-2.4 1.7-2.9-.5-5.2-2.8-5.7-5.7-.2-1.2.4-2.1 1.7-2.4z\"/>"
	},
	snapchat: {
		label: "Snapchat",
		body: "<path d=\"M12 3.2c-2.9 0-4.9 2.1-4.9 5v2.1c-.8.3-1.7.3-2.5.1.3 1 1.1 1.8 2.2 2-.4 1.4-1.5 2.5-3 2.8 1 1.2 2.6 1.9 4.3 1.8.9 1.2 2.3 1.9 3.9 1.9s3-.7 3.9-1.9c1.7.1 3.3-.6 4.3-1.8-1.5-.3-2.6-1.4-3-2.8 1.1-.2 1.9-1 2.2-2-.8.2-1.7.2-2.5-.1V8.2c0-2.9-2-5-4.9-5z\"/>"
	},
	pinterest: {
		label: "Pinterest",
		body: "<path d=\"M9.2 20.5c.4-1.6 1.4-5.6 1.9-7.6\"/><path d=\"M10.4 14.2c.4.9 1.4 1.5 2.6 1.5 2.6 0 4.4-2.2 4.4-5a5.4 5.4 0 1 0-10.4 2.1\"/>"
	},
	spotify: {
		label: "Spotify",
		body: "<circle cx=\"12\" cy=\"12\" r=\"8.8\"/><path d=\"M7.6 9.6c3-.9 6.6-.6 9.1.9\"/><path d=\"M8 12.5c2.5-.7 5.4-.4 7.5.8\"/><path d=\"M8.5 15.2c2-.5 4.2-.3 5.9.7\"/>"
	},
	discord: {
		label: "Discord",
		body: "<path d=\"M8 3.9c-1.6.3-3.1.9-4.5 1.7-1.5 3.2-2.1 6.6-1.7 10a12.7 12.7 0 0 0 5 2.6l1-1.9a11 11 0 0 0 8.4 0l1 1.9a12.7 12.7 0 0 0 5-2.6c.4-3.4-.2-6.8-1.7-10A14 14 0 0 0 16 3.9l-.6 1.4a15 15 0 0 0-6.8 0z\"/><circle cx=\"9.3\" cy=\"11.5\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"14.7\" cy=\"11.5\" r=\"1.2\" fill=\"currentColor\" stroke=\"none\"/>"
	},
	github: {
		label: "GitHub",
		body: "<path d=\"M12 2.8a9.2 9.2 0 0 0-2.9 17.9c.5.1.6-.2.6-.4v-1.7c-2.6.6-3.1-1.1-3.1-1.1-.4-1.1-1-1.4-1-1.4-.9-.6 0-.6 0-.6.9.1 1.4 1 1.4 1 .8 1.4 2.2 1 2.7.8.1-.6.3-1 .6-1.3-2-.2-4.2-1-4.2-4.5 0-1 .4-1.8 1-2.5-.1-.2-.4-1.2.1-2.4 0 0 .8-.3 2.5.9a8.8 8.8 0 0 1 4.6 0c1.7-1.2 2.5-.9 2.5-.9.5 1.2.2 2.2.1 2.4.6.7 1 1.5 1 2.5 0 3.5-2.2 4.3-4.2 4.5.3.3.6.9.6 1.8v2.6c0 .2.1.5.6.4A9.2 9.2 0 0 0 12 2.8z\"/>",
		fill: !0
	},
	mail: {
		label: "E-post",
		body: "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2.5\"/><path d=\"M3.5 7l8.5 6 8.5-6\"/>"
	},
	phone: {
		label: "Telefon",
		body: "<path d=\"M21.2 16.9v2.6a1.8 1.8 0 0 1-2 1.8 18 18 0 0 1-7.8-2.8 17.7 17.7 0 0 1-5.4-5.4A18 18 0 0 1 3.2 5.2a1.8 1.8 0 0 1 1.8-2h2.6a1.8 1.8 0 0 1 1.8 1.5c.1.9.3 1.7.6 2.5a1.8 1.8 0 0 1-.4 1.9l-1.1 1.1a14.4 14.4 0 0 0 5.4 5.4l1.1-1.1a1.8 1.8 0 0 1 1.9-.4c.8.3 1.6.5 2.5.6a1.8 1.8 0 0 1 1.5 1.8z\"/>"
	},
	smartphone: {
		label: "Mobil",
		body: "<rect x=\"7\" y=\"2.8\" width=\"10\" height=\"18.4\" rx=\"2.5\"/><line x1=\"10.8\" y1=\"18.2\" x2=\"13.2\" y2=\"18.2\"/>"
	},
	chat: {
		label: "Snakkeboble",
		body: "<path d=\"M20.8 12a8.5 8.5 0 0 1-12.4 7.5L4 20.6l1.1-4.2A8.5 8.5 0 1 1 20.8 12z\"/>"
	},
	send: {
		label: "Send",
		body: "<path d=\"M21 3.5L10.4 14.1\"/><path d=\"M21 3.5l-6.8 17-3.8-6.4L4 10.3z\"/>"
	},
	globe: {
		label: "Nettside",
		body: "<circle cx=\"12\" cy=\"12\" r=\"8.8\"/><path d=\"M3.2 12h17.6\"/><path d=\"M12 3.2c2.4 2.4 3.6 5.4 3.6 8.8s-1.2 6.4-3.6 8.8c-2.4-2.4-3.6-5.4-3.6-8.8S9.6 5.6 12 3.2z\"/>"
	},
	rss: {
		label: "RSS-feed",
		body: "<path d=\"M4.5 11a8.5 8.5 0 0 1 8.5 8.5\"/><path d=\"M4.5 5.5a14 14 0 0 1 14 14\"/><circle cx=\"5.5\" cy=\"18.5\" r=\"1.3\" fill=\"currentColor\" stroke=\"none\"/>"
	},
	"map-pin": {
		label: "Kartnål",
		body: "<path d=\"M12 21.5s7-6.2 7-11.3A7 7 0 1 0 5 10.2c0 5.1 7 11.3 7 11.3z\"/><circle cx=\"12\" cy=\"10\" r=\"2.6\"/>"
	},
	map: {
		label: "Kart",
		body: "<path d=\"M9 4L3.5 6v14L9 18l6 2 5.5-2V4L15 6z\"/><path d=\"M9 4v14\"/><path d=\"M15 6v14\"/>"
	},
	home: {
		label: "Hjem",
		body: "<path d=\"M4 10.5l8-7 8 7V20a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 20z\"/><path d=\"M9.5 21.5V14h5v7.5\"/>"
	},
	clock: {
		label: "Klokke",
		body: "<circle cx=\"12\" cy=\"12\" r=\"8.8\"/><path d=\"M12 7v5l3.2 2\"/>"
	},
	calendar: {
		label: "Kalender",
		body: "<rect x=\"3.5\" y=\"5\" width=\"17\" height=\"16\" rx=\"2.5\"/><path d=\"M3.5 10h17\"/><path d=\"M8 2.8V7\"/><path d=\"M16 2.8V7\"/>"
	},
	heart: {
		label: "Hjerte",
		body: "<path d=\"M12 20.5S3.5 15.4 3.5 9.5A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8.5 2.5c0 5.9-8.5 11-8.5 11z\"/>"
	},
	star: {
		label: "Stjerne",
		body: "<path d=\"M12 3.5l2.7 5.4 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L3.3 9.8l6-.9z\"/>"
	},
	check: {
		label: "Hake",
		body: "<path d=\"M4.5 12.8L9.5 18 19.5 6.5\"/>"
	},
	cross: {
		label: "Kryss",
		body: "<path d=\"M6 6l12 12\"/><path d=\"M18 6L6 18\"/>"
	},
	plus: {
		label: "Pluss",
		body: "<path d=\"M12 5v14\"/><path d=\"M5 12h14\"/>"
	},
	info: {
		label: "Info",
		body: "<circle cx=\"12\" cy=\"12\" r=\"8.8\"/><path d=\"M12 11v5.5\"/><line x1=\"12\" y1=\"7.8\" x2=\"12\" y2=\"7.8\"/>"
	},
	question: {
		label: "Spørsmål",
		body: "<circle cx=\"12\" cy=\"12\" r=\"8.8\"/><path d=\"M9.4 9.2A2.7 2.7 0 0 1 12 7.4c1.5 0 2.7 1 2.7 2.4 0 1.8-2.7 2-2.7 4\"/><line x1=\"12\" y1=\"16.8\" x2=\"12\" y2=\"16.8\"/>"
	},
	warning: {
		label: "Advarsel",
		body: "<path d=\"M12 4L2.8 19.5h18.4z\"/><path d=\"M12 10v4\"/><line x1=\"12\" y1=\"16.8\" x2=\"12\" y2=\"16.8\"/>"
	},
	zap: {
		label: "Lyn",
		body: "<path d=\"M13 2.8L4.5 13.5H11l-1 7.7 8.5-10.7H12z\"/>"
	},
	sun: {
		label: "Sol",
		body: "<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7\"/>"
	},
	moon: {
		label: "Måne",
		body: "<path d=\"M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z\"/>"
	},
	leaf: {
		label: "Blad",
		body: "<path d=\"M5 19C5 9 11 4.5 20 4.5c0 9-4.5 15-13 14.5z\"/><path d=\"M5 19c2-5.5 5.5-9 10-11\"/>"
	},
	music: {
		label: "Musikk",
		body: "<circle cx=\"7\" cy=\"17.5\" r=\"2.8\"/><circle cx=\"17\" cy=\"15.5\" r=\"2.8\"/><path d=\"M9.8 17.5V6.5l10-2v11\"/>"
	},
	camera: {
		label: "Kamera",
		body: "<path d=\"M3.5 8.5A1.5 1.5 0 0 1 5 7h2.5l1.7-2.3h5.6L16.5 7H19a1.5 1.5 0 0 1 1.5 1.5V18a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 18z\"/><circle cx=\"12\" cy=\"13\" r=\"3.4\"/>"
	},
	image: {
		label: "Bilde",
		body: "<rect x=\"3.5\" y=\"4.5\" width=\"17\" height=\"15\" rx=\"2.5\"/><circle cx=\"8.8\" cy=\"9.3\" r=\"1.6\"/><path d=\"M20.5 15.5l-4.7-4.7-9.3 8.7\"/>"
	},
	document: {
		label: "Dokument",
		body: "<path d=\"M13.5 3H6.8A1.8 1.8 0 0 0 5 4.8v14.4A1.8 1.8 0 0 0 6.8 21h10.4a1.8 1.8 0 0 0 1.8-1.8V8.5z\"/><path d=\"M13.5 3v5.5H19\"/><path d=\"M8.5 13h7M8.5 16.5h7\"/>"
	},
	"shopping-bag": {
		label: "Handlepose",
		body: "<path d=\"M5.5 8h13l-1 12a1.8 1.8 0 0 1-1.8 1.5H8.3A1.8 1.8 0 0 1 6.5 20z\"/><path d=\"M8.8 10.5V7a3.2 3.2 0 0 1 6.4 0v3.5\"/>"
	},
	gift: {
		label: "Gave",
		body: "<rect x=\"3.5\" y=\"8\" width=\"17\" height=\"4\"/><path d=\"M5 12v8.5h14V12\"/><path d=\"M12 8v12.5\"/><path d=\"M12 8s-4.5.3-5.5-1.8C5.8 4.7 7.8 3.3 9.3 4.4 10.8 5.5 12 8 12 8z\"/><path d=\"M12 8s4.5.3 5.5-1.8c.7-1.5-1.3-2.9-2.8-1.8C13.2 5.5 12 8 12 8z\"/>"
	},
	wrench: {
		label: "Verktøy",
		body: "<path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z\"/>"
	},
	lock: {
		label: "Lås",
		body: "<rect x=\"5\" y=\"10.5\" width=\"14\" height=\"10\" rx=\"2\"/><path d=\"M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3\"/>"
	},
	search: {
		label: "Søk",
		body: "<circle cx=\"10.8\" cy=\"10.8\" r=\"6.8\"/><path d=\"M15.8 15.8L21 21\"/>"
	},
	user: {
		label: "Person",
		body: "<circle cx=\"12\" cy=\"8\" r=\"4\"/><path d=\"M4.5 20.5a7.5 7.5 0 0 1 15 0\"/>"
	},
	users: {
		label: "Personer",
		body: "<circle cx=\"9\" cy=\"8.5\" r=\"3.5\"/><path d=\"M2.8 20a6.2 6.2 0 0 1 12.4 0\"/><path d=\"M16 5.4a3.5 3.5 0 0 1 0 6.2\"/><path d=\"M17.8 14.6a6.2 6.2 0 0 1 3.4 5.4\"/>"
	},
	"thumbs-up": {
		label: "Tommel opp",
		body: "<path d=\"M3.5 10.5H7v10H3.5z\"/><path d=\"M7 19.5V11l4.2-5.6a1.7 1.7 0 0 1 3 1.4l-.9 3.7h4.8a2 2 0 0 1 2 2.4l-1.2 5.5a2 2 0 0 1-2 1.6H8.6\"/>"
	},
	"arrow-right": {
		label: "Pil høyre",
		body: "<path d=\"M4 12h16\"/><path d=\"M13.5 5.5L20 12l-6.5 6.5\"/>"
	},
	"arrow-left": {
		label: "Pil venstre",
		body: "<path d=\"M20 12H4\"/><path d=\"M10.5 5.5L4 12l6.5 6.5\"/>"
	},
	"arrow-up": {
		label: "Pil opp",
		body: "<path d=\"M12 20V4\"/><path d=\"M5.5 10.5L12 4l6.5 6.5\"/>"
	},
	"arrow-down": {
		label: "Pil ned",
		body: "<path d=\"M12 4v16\"/><path d=\"M5.5 13.5L12 20l6.5-6.5\"/>"
	},
	"external-link": {
		label: "Ekstern lenke",
		body: "<path d=\"M9.5 5H5.8A1.8 1.8 0 0 0 4 6.8v11.4A1.8 1.8 0 0 0 5.8 20h11.4a1.8 1.8 0 0 0 1.8-1.8v-3.7\"/><path d=\"M13.5 4H20v6.5\"/><path d=\"M20 4l-9 9\"/>"
	},
	download: {
		label: "Nedlasting",
		body: "<path d=\"M12 3.5v11\"/><path d=\"M6.5 9l5.5 5.5L17.5 9\"/><path d=\"M4 20.5h16\"/>"
	},
	share: {
		label: "Deling",
		body: "<circle cx=\"6\" cy=\"12\" r=\"2.6\"/><circle cx=\"17.5\" cy=\"5.5\" r=\"2.6\"/><circle cx=\"17.5\" cy=\"18.5\" r=\"2.6\"/><path d=\"M8.4 10.8l6.8-4M8.4 13.2l6.8 4\"/>"
	}
}, da = [
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
function fa(e) {
	let t = typeof e == "string" ? ua[e] : null;
	return t ? `<svg viewBox="0 0 24 24" width="100%" height="100%" ${t.fill ? la : ca} aria-hidden="true" focusable="false">${t.body}</svg>` : null;
}
//#endregion
//#region src/lib/GlyphPicker.svelte
var pa = /* @__PURE__ */ H("<img class=\"gp-own svelte-15ln1c3\"/>"), ma = /* @__PURE__ */ H("<span class=\"gp-svg svelte-15ln1c3\"></span>"), ha = /* @__PURE__ */ H("<button type=\"button\" class=\"gp-cell svelte-15ln1c3\"> </button>"), ga = /* @__PURE__ */ H("<div class=\"gp-group svelte-15ln1c3\"> </div> <div class=\"gp-grid svelte-15ln1c3\"></div>", 1), _a = /* @__PURE__ */ H("<button type=\"button\"><span class=\"gp-svg svelte-15ln1c3\"></span></button>"), va = /* @__PURE__ */ H("<button type=\"button\"> </button>"), ya = /* @__PURE__ */ H("<div class=\"gp-group svelte-15ln1c3\"> </div> <button type=\"button\" class=\"ghost gp-upload svelte-15ln1c3\"> </button> <input type=\"file\" accept=\"image/*\" hidden=\"\"/> <p class=\"gp-hint svelte-15ln1c3\"> </p>", 1), ba = /* @__PURE__ */ H("<div class=\"gp-pop svelte-15ln1c3\"><!> <!> <!> <!></div>"), xa = /* @__PURE__ */ H("<span class=\"gp svelte-15ln1c3\"><button type=\"button\" class=\"gp-swatch svelte-15ln1c3\"><!></button> <!></span>");
function Sa(e, t) {
	Ge(t, !0);
	let n = hi(t, "value", 3, "★"), r = hi(t, "icon", 3, null), i = hi(t, "image", 3, null), a = hi(t, "label", 19, () => X("gp.pickGlyph")), o = /* @__PURE__ */ P(nn([])), s = /* @__PURE__ */ P(null), c = /* @__PURE__ */ P(null), l = /* @__PURE__ */ P(!1), u = /* @__PURE__ */ P(nn({
		top: 0,
		left: 0
	}));
	function d() {
		F(o, oa(), !0);
		let e = B(s).getBoundingClientRect(), t = Math.max(8, Math.min(e.right - 292, window.innerWidth - 292 - 8)), n = e.bottom + 380 + 8 > window.innerHeight ? Math.max(8, e.top - 380 - 8) : e.bottom + 6;
		F(u, {
			top: n,
			left: t
		}, !0), F(l, !0);
	}
	function f(e) {
		sa(e), t.onpick?.(e), F(l, !1);
	}
	function p(e) {
		t.onicon?.(e), F(l, !1);
	}
	async function h(e) {
		let n = e.target.files?.[0];
		if (e.target.value = "", !n) return;
		let r = await Ji(n, 256);
		t.onimage?.(r.dataUrl), F(l, !1);
	}
	xn(() => {
		if (!B(l)) return;
		let e = (e) => {
			B(s) && !B(s).contains(e.target) && F(l, !1);
		}, t = (e) => {
			e.key === "Escape" && F(l, !1);
		}, n = (e) => {
			B(s) && e.target instanceof Node && !B(s).contains(e.target) && F(l, !1);
		};
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t, !0), document.addEventListener("scroll", n, !0), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t, !0), document.removeEventListener("scroll", n, !0);
		};
	});
	var g = xa(), _ = I(g), v = I(_), y = (e) => {
		var t = pa();
		z((e) => {
			Y(t, "src", i()), Y(t, "alt", e);
		}, [() => X("gp.ownIcon")]), U(e, t);
	}, b = (e) => {
		var t = ma();
		K(t, () => fa(r()), !0), A(t), U(e, t);
	}, x = (e) => {
		var t = jr();
		z(() => W(t, n() || "★")), U(e, t);
	};
	G(v, (e) => {
		i() ? e(y) : r() && ua[r()] ? e(b, 1) : e(x, -1);
	}), A(_);
	var S = R(_, 2), C = (e) => {
		var i = ba(), a = I(i), s = (e) => {
			var t = ga(), n = L(t), r = I(n, !0);
			A(n);
			var i = R(n, 2);
			Hr(i, 20, () => B(o), (e) => e, (e, t) => {
				var n = ha(), r = I(n, !0);
				A(n), z(() => W(r, t)), V("click", n, () => f(t)), U(e, n);
			}), A(i), z((e) => W(r, e), [() => X("common.recent")]), U(e, t);
		};
		G(a, (e) => {
			B(o).length && e(s);
		});
		var l = R(a, 2), d = (e) => {
			var t = Mr();
			Hr(L(t), 17, () => da, ([e, t]) => e, (e, t) => {
				var n = /* @__PURE__ */ N(() => m(B(t), 2));
				let i = () => B(n)[0], a = () => B(n)[1];
				var o = ga(), s = L(o), c = I(s, !0);
				A(s);
				var l = R(s, 2);
				Hr(l, 20, a, (e) => e, (e, t) => {
					var n = _a();
					let i;
					var a = I(n);
					K(a, () => fa(t), !0), A(a), A(n), z(() => {
						i = $r(n, 1, "gp-cell gp-cell-icon svelte-15ln1c3", null, i, { active: t === r() }), Y(n, "title", ua[t].label);
					}), V("click", n, () => p(t)), U(e, n);
				}), A(l), z((e) => W(c, e), [() => X(i())]), U(e, o);
			}), U(e, t);
		};
		G(l, (e) => {
			t.onicon && e(d);
		});
		var g = R(l, 2);
		Hr(g, 17, () => ia, ([e, t]) => e, (e, t) => {
			var r = /* @__PURE__ */ N(() => m(B(t), 2));
			let i = () => B(r)[0], a = () => B(r)[1];
			var o = ga(), s = L(o), c = I(s, !0);
			A(s);
			var l = R(s, 2);
			Hr(l, 20, () => a().split(" "), (e) => e, (e, t) => {
				var r = va();
				let i;
				var a = I(r, !0);
				A(r), z(() => {
					i = $r(r, 1, "gp-cell svelte-15ln1c3", null, i, { active: t === n() }), W(a, t);
				}), V("click", r, () => f(t)), U(e, r);
			}), A(l), z((e) => W(c, e), [() => X(i())]), U(e, o);
		});
		var _ = R(g, 2), v = (e) => {
			var t = ya(), n = L(t), r = I(n, !0);
			A(n);
			var i = R(n, 2), a = I(i, !0);
			A(i);
			var o = R(i, 2);
			mi(o, (e) => F(c, e), () => B(c));
			var s = R(o, 2), l = I(s, !0);
			A(s), z((e, t, n) => {
				W(r, e), W(a, t), W(l, n);
			}, [
				() => X("gp.ownIcon"),
				() => X("gp.upload"),
				() => X("gp.uploadHint")
			]), V("click", i, () => B(c).click()), V("change", o, h), U(e, t);
		};
		G(_, (e) => {
			t.onimage && e(v);
		}), A(i), z(() => ti(i, `top: ${B(u).top ?? ""}px; left: ${B(u).left ?? ""}px`)), U(e, i);
	};
	G(S, (e) => {
		B(l) && e(C);
	}), A(g), mi(g, (e) => F(s, e), () => B(s)), z(() => {
		Y(_, "title", a()), Y(_, "aria-label", a());
	}), V("click", _, () => B(l) ? F(l, !1) : d()), U(e, g), Ke();
}
wr(["click", "change"]);
//#endregion
//#region src/lib/previewBridge.js
function Ca(e, t = {}) {
	let n = (e) => {
		if (e.origin !== location.origin) return;
		let n = e.data;
		n?.type === "urd-edit" && t.onEdit?.(n), n?.type === "urd-move" && t.onMove?.(n), n?.type === "urd-grow" && t.onGrow?.(n), n?.type === "urd-delete" && t.onDelete?.(n), n?.type === "urd-add-section" && t.onAddSection?.(n), n?.type === "urd-move-section" && t.onMoveSection?.(n), n?.type === "urd-delete-section" && t.onDeleteSection?.(n), n?.type === "urd-section-size" && t.onSectionSize?.(n), n?.type === "urd-undo" && t.onUndo?.(n), n?.type === "urd-select-section" && t.onSelectSection?.(n), n?.type === "urd-select-block" && t.onSelectBlock?.(n), n?.type === "urd-block-menu" && t.onBlockMenu?.(n), n?.type === "urd-plugin-blocks" && t.onPluginBlocks?.(n), n?.type === "urd-ready" && t.onReady?.(n), n?.type === "urd-navigate" && t.onNavigate?.(n), n?.type === "urd-add-block" && t.onAddBlock?.(n), n?.type === "urd-add-blocks" && t.onAddBlocks?.(n), n?.type === "urd-request-block" && t.onRequestBlock?.(n), n?.type === "urd-move-block-section" && t.onMoveBlockSection?.(n), n?.type === "urd-mobile-manual" && t.onMobileManual?.(n), n?.type === "urd-mobile-auto" && t.onMobileAuto?.(n), n?.type === "urd-review-done" && t.onReviewDone?.(n), n?.type === "urd-block-flag" && t.onBlockFlag?.(n), n?.type === "urd-collection-edit" && t.onCollectionEdit?.(n), n?.type === "urd-nav-width" && t.onNavWidth?.(n), n?.type === "urd-save-template" && t.onSaveTemplate?.(n), n?.type === "urd-delete-template" && t.onDeleteTemplate?.(n), n?.type === "urd-apply-layout" && t.onApplyLayout?.(n);
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
		sendMaler(e) {
			r({
				type: "urd-maler",
				maler: e
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
function wa(e, t) {
	return !(e > 0) || !(t > 0) ? 1 : e / t;
}
function Ta(e, t, n) {
	let r = n === "full" ? 1 : Math.min(1, wa(e, t));
	return Math.max(.1, r);
}
//#endregion
//#region src/lib/Dropdown.svelte
var Ea = /* @__PURE__ */ H("<button type=\"button\"> </button>"), Da = /* @__PURE__ */ H("<div class=\"dd-pop svelte-vtocc6\"></div>"), Oa = /* @__PURE__ */ H("<span class=\"dd svelte-vtocc6\"><button type=\"button\" class=\"dd-btn svelte-vtocc6\"><span class=\"dd-value svelte-vtocc6\"> </span> <span class=\"dd-caret svelte-vtocc6\"> </span></button> <!></span>");
function Z(e, t) {
	Ge(t, !0);
	let n = hi(t, "value", 3, null), r = hi(t, "options", 19, () => []), i = hi(t, "title", 3, null), a = hi(t, "disabled", 3, !1), o = /* @__PURE__ */ P(!1), s = /* @__PURE__ */ P(null), c = /* @__PURE__ */ P(nn({
		top: 0,
		left: 0,
		width: 160
	})), l = () => r().find(([e]) => `${e ?? ""}` == `${n() ?? ""}`)?.[1] ?? "";
	function u() {
		let e = B(s).getBoundingClientRect(), t = Math.min(320, r().length * 32 + 12), n = Math.max(e.width, 160), i = e.bottom + t + 8 <= window.innerHeight;
		F(c, {
			top: i ? e.bottom + 4 : Math.max(8, e.top - t - 4),
			left: Math.max(8, Math.min(e.left, window.innerWidth - n - 8)),
			width: n
		}, !0);
	}
	function d() {
		if (!a()) {
			if (B(o)) {
				F(o, !1);
				return;
			}
			u(), F(o, !0);
		}
	}
	function f(e) {
		F(o, !1), t.onchange?.(e);
	}
	xn(() => {
		if (!B(o)) return;
		let e = (e) => {
			B(s) && !B(s).contains(e.target) && F(o, !1);
		}, t = (e) => {
			e.key === "Escape" && F(o, !1);
		}, n = (e) => {
			B(s) && e.target instanceof Node && !B(s).contains(e.target) && u();
		};
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t, !0), document.addEventListener("scroll", n, !0), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t, !0), document.removeEventListener("scroll", n, !0);
		};
	});
	var p = Oa(), h = I(p), g = I(h), _ = I(g, !0);
	A(g);
	var v = R(g, 2), y = I(v, !0);
	A(v), A(h);
	var b = R(h, 2), x = (e) => {
		var t = Da();
		Hr(t, 21, r, ([e, t]) => `${e ?? ""}`, (e, t) => {
			var r = /* @__PURE__ */ N(() => m(B(t), 2));
			let i = () => B(r)[0], a = () => B(r)[1];
			var o = Ea();
			let s;
			var c = I(o, !0);
			A(o), z(() => {
				s = $r(o, 1, "dd-opt svelte-vtocc6", null, s, { valgt: `${i() ?? ""}` == `${n() ?? ""}` }), W(c, a());
			}), V("click", o, () => f(i())), U(e, o);
		}), A(t), z(() => ti(t, `top: ${B(c).top ?? ""}px; left: ${B(c).left ?? ""}px; min-width: ${B(c).width ?? ""}px`)), U(e, t);
	};
	G(b, (e) => {
		B(o) && e(x);
	}), A(p), mi(p, (e) => F(s, e), () => B(s)), z((e) => {
		Y(h, "title", i()), h.disabled = a(), W(_, e), W(y, B(o) ? "▴" : "▾");
	}, [() => l()]), V("click", h, d), U(e, p), Ke();
}
wr(["click"]);
//#endregion
//#region src/lib/IconEditor.svelte
var ka = /* @__PURE__ */ H("<div class=\"ie-overlay svelte-e7sog7\" role=\"dialog\" aria-modal=\"true\"><div class=\"ie-card svelte-e7sog7\"><h2 class=\"svelte-e7sog7\"> </h2> <div class=\"ie-stage svelte-e7sog7\"><canvas class=\"ie-canvas svelte-e7sog7\"></canvas> <p class=\"ie-hint svelte-e7sog7\"> </p></div> <label class=\"ie-row svelte-e7sog7\"> <span class=\"ie-val svelte-e7sog7\"> </span></label> <input type=\"range\" min=\"1\" max=\"3\" step=\"0.02\" class=\"svelte-e7sog7\"/> <label class=\"ie-row svelte-e7sog7\"> <span class=\"ie-val svelte-e7sog7\"> </span></label> <input type=\"range\" min=\"0.3\" max=\"2\" step=\"0.02\" class=\"svelte-e7sog7\"/> <label class=\"ie-row svelte-e7sog7\"> <span class=\"ie-val svelte-e7sog7\"> </span></label> <input type=\"range\" min=\"0.3\" max=\"2\" step=\"0.02\" class=\"svelte-e7sog7\"/> <label class=\"ie-row svelte-e7sog7\"> <span class=\"ie-val svelte-e7sog7\"> </span></label> <input type=\"range\" min=\"0\" max=\"2\" step=\"0.02\" class=\"svelte-e7sog7\"/> <span class=\"ie-tools svelte-e7sog7\"><button type=\"button\" class=\"ghost svelte-e7sog7\"> </button> <button type=\"button\" class=\"ghost svelte-e7sog7\"> </button></span> <span class=\"ie-actions svelte-e7sog7\"><button type=\"button\" class=\"ghost svelte-e7sog7\"> </button> <button type=\"button\" class=\"primary svelte-e7sog7\"> </button></span></div></div>");
function Aa(e, t) {
	Ge(t, !0);
	let n = hi(t, "image", 3, ""), r = /* @__PURE__ */ P(null), i = /* @__PURE__ */ P(null), a = /* @__PURE__ */ P(1), o = /* @__PURE__ */ P(.5), s = /* @__PURE__ */ P(.5), c = /* @__PURE__ */ P(1), l = /* @__PURE__ */ P(1), u = /* @__PURE__ */ P(1);
	xn(() => {
		if (!n()) return;
		let e = new Image();
		e.onload = () => {
			F(i, e, !0);
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
			F(o, Math.min(1, Math.max(0, B(o) - (e.clientX - t) / c)), !0), F(s, Math.min(1, Math.max(0, B(s) - (e.clientY - n) / l)), !0), t = e.clientX, n = e.clientY;
		}, d = () => {
			window.removeEventListener("pointermove", u), window.removeEventListener("pointerup", d);
		};
		window.addEventListener("pointermove", u), window.addEventListener("pointerup", d);
	}
	function p() {
		F(a, 1), F(o, .5), F(s, .5), F(c, 1), F(l, 1), F(u, 1);
	}
	function m() {
		let e = document.createElement("canvas");
		e.width = 128, e.height = 128, d(e.getContext("2d"), 128), t.onapply?.(e.toDataURL("image/webp", .92));
	}
	var h = ka(), g = I(h), _ = I(g), v = I(_, !0);
	A(_);
	var y = R(_, 2), b = I(y);
	Y(b, "width", 220), Y(b, "height", 220), mi(b, (e) => F(r, e), () => B(r));
	var x = R(b, 2), S = I(x, !0);
	A(x), A(y);
	var C = R(y, 2), w = I(C), T = R(w), ee = I(T);
	A(T), A(C);
	var E = R(C, 2);
	q(E);
	var te = R(E, 2), ne = I(te), re = R(ne), ie = I(re);
	A(re), A(te);
	var ae = R(te, 2);
	q(ae);
	var oe = R(ae, 2), se = I(oe), ce = R(se), le = I(ce);
	A(ce), A(oe);
	var ue = R(oe, 2);
	q(ue);
	var de = R(ue, 2), fe = I(de), pe = R(fe), me = I(pe);
	A(pe), A(de);
	var he = R(de, 2);
	q(he);
	var ge = R(he, 2), _e = I(ge), D = I(_e, !0);
	A(_e);
	var ve = R(_e, 2), O = I(ve, !0);
	A(ve), A(ge);
	var k = R(ge, 2), ye = I(k), be = I(ye, !0);
	A(ye);
	var xe = R(ye, 2), Se = I(xe, !0);
	A(xe), A(k), A(g), A(h), z((e, t, n, r, i, a, o, s, c, l, u, d, f, p, m) => {
		W(v, e), Y(b, "title", t), W(S, n), W(w, `${r ?? ""} `), W(ee, `${i ?? ""}x`), W(ne, `${a ?? ""} `), W(ie, `${o ?? ""}%`), W(se, `${s ?? ""} `), W(le, `${c ?? ""}%`), W(fe, `${l ?? ""} `), W(me, `${u ?? ""}%`), W(D, d), W(O, f), W(be, p), W(Se, m);
	}, [
		() => X("ie.title"),
		() => X("ie.dragTip"),
		() => X("ie.hint"),
		() => X("lbl.zoom"),
		() => B(a).toFixed(2),
		() => X("lbl.brightness"),
		() => Math.round(B(c) * 100),
		() => X("lbl.contrast"),
		() => Math.round(B(l) * 100),
		() => X("lbl.saturate"),
		() => Math.round(B(u) * 100),
		() => X("ie.grayscale"),
		() => X("common.reset"),
		() => X("confirm.cancel"),
		() => X("common.apply")
	]), V("pointerdown", b, f), ui(E, () => B(a), (e) => F(a, e)), ui(ae, () => B(c), (e) => F(c, e)), ui(ue, () => B(l), (e) => F(l, e)), ui(he, () => B(u), (e) => F(u, e)), V("click", _e, () => F(u, 0)), V("click", ve, p), V("click", ye, () => t.oncancel?.()), V("click", xe, m), U(e, h), Ke();
}
wr(["pointerdown", "click"]);
var ja = {}, Ma = {};
function Na(e) {
	let t = structuredClone(e), n = t.schemaVersion ?? 1;
	for (; n < 1;) {
		let r = Ma[n];
		if (typeof r != "function") return e;
		t = r(t) ?? t, n++, t.schemaVersion = n;
	}
	return t;
}
function Pa(e, t) {
	let n = structuredClone(e), r = n.schemaVersion ?? 1;
	for (; r < 1;) {
		let i = ja[r];
		if (typeof i != "function") return e;
		n = i(n, t) ?? n, r++, n.schemaVersion = r;
	}
	return n;
}
//#endregion
//#region ../template/assets/engine/0.6.11/plugins.js
function Fa(e) {
	let t = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(e).trim());
	return t ? [
		Number(t[1]),
		Number(t[2]),
		Number(t[3])
	] : null;
}
var Ia = (e, t) => e[0] - t[0] || e[1] - t[1] || e[2] - t[2];
function La(e, t) {
	let n = Fa(e);
	if (!n || typeof t != "string" || !t.trim()) return !1;
	for (let e of t.trim().split(/\s+/)) {
		let t = /^(>=|<=|>|<|=|\^|~)?(\d+\.\d+\.\d+)$/.exec(e);
		if (!t) return !1;
		let r = t[1] ?? "=", i = Fa(t[2]), a = Ia(n, i);
		if (!(r === ">=" ? a >= 0 : r === ">" ? a > 0 : r === "<=" ? a <= 0 : r === "<" ? a < 0 : r === "^" ? i[0] === 0 ? n[0] === 0 && n[1] === i[1] && a >= 0 : n[0] === i[0] && a >= 0 : r === "~" ? n[0] === i[0] && n[1] === i[1] && a >= 0 : a === 0)) return !1;
	}
	return !0;
}
var Ra = /^[a-z0-9][a-z0-9-]*$/;
function za(e) {
	let t = [];
	if (!e || typeof e != "object") return ["manifestet er ikke et objekt"];
	Ra.test(e.id ?? "") || t.push("id mangler eller er ugyldig"), (typeof e.name != "string" || !e.name) && t.push("name mangler"), Fa(e.version ?? "") || t.push("version er ikke semver"), (typeof e.requiresEngine != "string" || !e.requiresEngine) && t.push("requiresEngine mangler");
	let n = Array.isArray(e.languages) && e.languages.length > 0;
	return (e.entry !== void 0 || !n) && (typeof e.entry != "string" || !e.entry.endsWith(".js")) && t.push("entry mangler eller er ikke en .js-fil"), (e.provides !== void 0 || !n) && (!e.provides || typeof e.provides != "object") && t.push("provides mangler"), e.languages !== void 0 && t.push(...Si(e.languages)), e.locales !== void 0 && typeof e.locales != "boolean" && t.push("locales må være boolsk"), e.names !== void 0 && (typeof e.names != "object" || e.names === null || Array.isArray(e.names) || Object.values(e.names).some((e) => typeof e != "string" || !e)) && t.push("names må være et objekt med språkkode til navn"), t;
}
//#endregion
//#region ../template/assets/engine/0.6.11/sections/presets.js
function Ba(e) {
	return typeof crypto < "u" && crypto.randomUUID ? `${e}-${crypto.randomUUID().slice(0, 8)}` : `${e}-${[...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(4))].map((e) => e.toString(16).padStart(2, "0")).join("")}`;
}
var Va = () => ({ mobile: {
	mode: "auto",
	attention: null
} }), Q = (e, t, n, r, i = 1) => ({
	desktop: {
		x: e,
		y: t,
		w: n,
		h: r,
		z: i,
		rot: 0
	},
	mobile: null
}), $ = (e, t, n = {}) => ({
	id: Ba("blk"),
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
}), Ha = (e, t = {}) => ({
	id: Ba("blk"),
	type: "image",
	version: 1,
	props: {
		src: "",
		alt: X("seed.imageAlt"),
		fit: "cover",
		radius: "md",
		href: null,
		...t
	},
	animation: null,
	frames: e
}), Ua = (e, t, n = {}) => ({
	id: Ba("blk"),
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
}), Wa = (e, t, n = 40) => ({
	id: Ba("blk"),
	type: "icon",
	version: 1,
	props: {
		glyph: t,
		color: "accent",
		size: n
	},
	animation: null,
	frames: e
}), Ga = () => ({
	type: "hover-lift",
	version: 1,
	props: {}
}), Ka = (e, t, n = {}) => ({
	id: Ba("blk"),
	type: "samling",
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
}), qa = (e, t = {}) => ({
	id: Ba("blk"),
	type: "galleri",
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
}), Ja = (e, t) => ({
	id: Ba("blk"),
	type: "faq",
	version: 1,
	props: {
		items: t,
		multi: !1
	},
	animation: null,
	frames: e
}), Ya = (e, t = {}) => ({
	id: Ba("blk"),
	type: "sitat",
	version: 1,
	props: {
		text: "",
		attribution: "",
		role: "",
		variant: "stor",
		image: "",
		accent: null,
		...t
	},
	animation: null,
	frames: e
}), Xa = (e, t) => ({
	id: Ba("blk"),
	type: "tidslinje",
	version: 1,
	props: {
		items: t,
		variant: "venstre",
		marker: "fylt",
		accent: null
	},
	animation: null,
	frames: e
}), Za = (e, t = {}) => ({
	id: Ba("blk"),
	type: "statistikk",
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
}), Qa = (...e) => ({
	version: 1,
	layers: e
}), $a = (e) => ({
	type: "color",
	version: 1,
	props: { value: e }
}), eo = (e, t, n, r = .5) => ({
	type: "glow",
	version: 1,
	props: {
		x: e,
		y: t,
		color: "accent",
		radius: r,
		opacity: n
	}
}), to = (e) => Math.max(0, ...e.blocks.map((e) => e.frames.desktop.y + e.frames.desktop.h)), no = (e, t, n, r, i, a) => ({
	x: n + e % t * r,
	y: i + Math.floor(e / t) * a
}), ro = (e, t, n, r, i, a, o, s, c = 0) => {
	let l = (t) => e.blocks.some((e) => {
		let n = e.frames.desktop;
		return n.x < t.x + t.w - .01 && t.x < n.x + n.w - .01 && n.y < t.y + t.h - .01 && t.y < n.y + n.h - .01;
	});
	for (let e = 0; e < 60; e++) {
		let u = no(e, t, n, r, i, a);
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
		y: to(e) + 16,
		n: 0
	};
}, io = (e, t, n) => e + t * .1 + n * .01, ao = (e, t, n, r, i = null) => ({
	id: Ba("sec"),
	version: 1,
	preset: e,
	size: { minHeight: t },
	grid: i,
	background: n,
	blocks: r,
	responsive: Va()
});
function oo(e) {
	e.sections.define("tom", {
		label: "Tom seksjon",
		labelKey: "preset.tom.label",
		group: "Grunnleggende",
		groupKey: "presetGroup.basic",
		hint: "Blankt lerret å bygge fritt på",
		hintKey: "preset.tom.hint",
		create: () => ao("tom", "40vh", Qa($a("bg")), [])
	}), e.sections.define("hero", {
		label: "Hero",
		labelKey: "preset.hero.label",
		group: "Grunnleggende",
		groupKey: "presetGroup.basic",
		hint: "Stor åpning med gradient og glød, venstrestilt",
		hintKey: "preset.hero.hint",
		create: () => ao("hero", "70vh", {
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
				eo(.7, .2, .35),
				{
					type: "grain",
					version: 1,
					props: { opacity: .06 }
				}
			]
		}, [
			$(Q(8.33, 40, 50, 38), X("seed.hero.title")),
			$(Q(8.33, 84, 41.67, 26), X("seed.hero.intro")),
			Ua(Q(8.33, 118, 20, 32), X("seed.readMore"))
		])
	}), e.sections.define("hero-sentrert", {
		label: "Hero, sentrert",
		labelKey: "preset.hero-sentrert.label",
		group: "Grunnleggende",
		groupKey: "presetGroup.basic",
		hint: "Sentrert åpning med to knapper",
		hintKey: "preset.hero-sentrert.hint",
		create: () => ao("hero-sentrert", "60vh", Qa($a("bg")), [
			$(Q(15, 64, 70, 44), X("seed.heroCenter.title"), { align: "center" }),
			$(Q(25, 116, 50, 26), X("seed.heroCenter.intro"), { align: "center" }),
			Ua(Q(31.5, 160, 17, 40), X("seed.join")),
			Ua(Q(51.5, 160, 17, 40), X("seed.readMore"), { style: "secondary" })
		])
	}), e.sections.define("bilder", {
		label: "Bilder",
		labelKey: "preset.bilder.label",
		group: "Grunnleggende",
		groupKey: "presetGroup.basic",
		hint: "Tittel og tre bilderammer",
		hintKey: "preset.bilder.hint",
		create: () => ao("bilder", "360px", Qa($a("bg")), [
			$(Q(4, 24, 50, 32), X("seed.images.title")),
			Ha(Q(4, 72, 28, 220)),
			Ha(Q(36, 72, 28, 220)),
			Ha(Q(68, 72, 28, 220))
		]),
		itemLabel: "bilde",
		itemLabelKey: "item.image",
		item: (e) => {
			let { x: t, y: n } = ro(e, 3, 4, 32, 72, 244, 28, 220);
			return {
				blocks: [Ha(Q(t, n, 28, 220))],
				bottom: n + 244
			};
		}
	}), e.sections.define("galleri", {
		label: "Galleri",
		labelKey: "preset.galleri.label",
		group: "Grunnleggende",
		groupKey: "presetGroup.basic",
		hint: "Bildegalleri i rutenett med fullskjermvisning (lightbox)",
		hintKey: "preset.galleri.hint",
		create: () => ao("galleri", "440px", Qa($a("bg")), [$(Q(4, 24, 50, 32), X("seed.gallery.title")), qa(Q(4, 72, 92, 320))])
	}), e.sections.define("kontakt", {
		label: "Kontakt",
		labelKey: "preset.kontakt.label",
		group: "Grunnleggende",
		groupKey: "presetGroup.basic",
		hint: "Kontaktinfo i kort med e-postknapp",
		hintKey: "preset.kontakt.hint",
		create: () => ao("kontakt", "320px", Qa($a("surface"), eo(.2, .8, .2)), [
			$(Q(10, 32, 40, 36), X("seed.contact.title")),
			$(Q(10, 84, 36, 130), X("seed.contact.info"), { box: !0 }),
			Ua(Q(60, 100, 22, 40), X("seed.contact.button"), { href: "mailto:post@dinforening.no" })
		])
	}), e.sections.define("funksjonskort", {
		label: "Funksjonskort",
		labelKey: "preset.funksjonskort.label",
		group: "Kort og lister",
		groupKey: "presetGroup.cards",
		hint: "Tre kort med ikon, tittel og tekst",
		hintKey: "preset.funksjonskort.hint",
		create: () => {
			let e = (e, t, n, r) => {
				let i = Wa(Q(e + 10.5, 88, 4, 52), n), a = $(Q(e, 152, 25, 200), X("seed.features.card", { title: r }), {
					align: "center",
					box: !0
				});
				return a.animation = Ga(), i.mobileOrder = io(88, t, 0), a.mobileOrder = io(88, t, 1), [i, a];
			};
			return ao("funksjonskort", "420px", Qa($a("bg")), [
				$(Q(6, 28, 60, 38), X("seed.features.title")),
				...e(6, 0, "✦", X("seed.features.card1")),
				...e(37.5, 1, "★", X("seed.features.card2")),
				...e(69, 2, "✓", X("seed.features.card3"))
			]);
		},
		itemLabel: "kort",
		itemLabelKey: "item.card",
		item: (e) => {
			let { x: t, y: n, n: r } = ro(e, 3, 6, 31.5, 152, 296, 25, 264, -64), i = Wa(Q(t + 10.5, n - 64, 4, 52), "✦"), a = $(Q(t, n, 25, 200), X("seed.features.card", { title: X("seed.features.newTitle") }), {
				align: "center",
				box: !0
			});
			return a.animation = Ga(), i.mobileOrder = io(88, r, 0), a.mobileOrder = io(88, r, 1), {
				blocks: [i, a],
				bottom: n + 228
			};
		}
	}), e.sections.define("funksjonskort-enkel", {
		label: "Funksjonskort uten ikoner",
		labelKey: "preset.funksjonskort-enkel.label",
		group: "Kort og lister",
		groupKey: "presetGroup.cards",
		hint: "Tre kort med tittel og tekst (uten ikonene over)",
		hintKey: "preset.funksjonskort-enkel.hint",
		create: () => {
			let e = (e, t, n) => {
				let r = $(Q(e, 88, 25, 200), X("seed.features.card", { title: n }), {
					align: "center",
					box: !0
				});
				return r.animation = Ga(), r.mobileOrder = io(88, t, 0), r;
			};
			return ao("funksjonskort-enkel", "360px", Qa($a("bg")), [
				$(Q(6, 28, 60, 38), X("seed.features.title")),
				e(6, 0, X("seed.features.card1")),
				e(37.5, 1, X("seed.features.card2")),
				e(69, 2, X("seed.features.card3"))
			]);
		},
		itemLabel: "kort",
		itemLabelKey: "item.card",
		item: (e) => {
			let { x: t, y: n, n: r } = ro(e, 3, 6, 31.5, 88, 232, 25, 200), i = $(Q(t, n, 25, 200), X("seed.features.card", { title: X("seed.features.newTitle") }), {
				align: "center",
				box: !0
			});
			return i.animation = Ga(), i.mobileOrder = io(88, r, 0), {
				blocks: [i],
				bottom: n + 228
			};
		}
	}), e.sections.define("nyheter", {
		label: "Nyheter",
		labelKey: "preset.nyheter.label",
		group: "Kort og lister",
		groupKey: "presetGroup.cards",
		hint: "Tre nyhetskort med bilde, tag og dato",
		hintKey: "preset.nyheter.hint",
		create: () => {
			let e = (e, t) => {
				let n = Ha(Q(e, 88, 25, 160)), r = $(Q(e, 256, 25, 160), X("seed.news.card"));
				return n.mobileOrder = io(88, t, 0), r.mobileOrder = io(88, t, 1), [n, r];
			};
			return ao("nyheter", "460px", Qa($a("bg")), [
				$(Q(6, 28, 50, 38), X("seed.news.title")),
				Ua(Q(78, 30, 16, 36), X("seed.news.seeAll"), { style: "secondary" }),
				...e(6, 0),
				...e(37.5, 1),
				...e(69, 2)
			]);
		},
		itemLabel: "sak",
		itemLabelKey: "item.story",
		item: (e) => {
			let { x: t, y: n, n: r } = ro(e, 3, 6, 31.5, 88, 344, 25, 328), i = Ha(Q(t, n, 25, 160)), a = $(Q(t, n + 168, 25, 160), X("seed.news.card"));
			return i.mobileOrder = io(88, r, 0), a.mobileOrder = io(88, r, 1), {
				blocks: [i, a],
				bottom: n + 352
			};
		}
	}), e.sections.define("nyheter-samling", {
		label: "Nyheter (samling)",
		labelKey: "preset.nyheter-samling.label",
		group: "Kort og lister",
		groupKey: "presetGroup.cards",
		hint: "Nyhetskort fra en samling: skriv innslag, kortene følger med",
		hintKey: "preset.nyheter-samling.hint",
		create: () => ao("nyheter-samling", "300px", Qa($a("bg")), [$(Q(6, 28, 50, 38), X("seed.news.title")), Ka(Q(6, 88, 88, 180), "cards")])
	}), e.sections.define("oppslagstavle", {
		label: "Oppslagstavle",
		labelKey: "preset.oppslagstavle.label",
		group: "Kort og lister",
		groupKey: "presetGroup.cards",
		hint: "Datert liste fra en samling (oppslag/kunngjøringer)",
		hintKey: "preset.oppslagstavle.hint",
		create: () => ao("oppslagstavle", "300px", Qa($a("surface")), [$(Q(6, 28, 50, 38), X("seed.noticeboard.title")), Ka(Q(6, 88, 88, 180), "list", { limit: 8 })])
	}), e.sections.define("publikasjonsarkiv", {
		label: "Publikasjonsarkiv",
		labelKey: "preset.publikasjonsarkiv.label",
		group: "Kort og lister",
		groupKey: "presetGroup.cards",
		hint: "År-gruppert arkiv fra en samling (utgaver, referater, rapporter)",
		hintKey: "preset.publikasjonsarkiv.hint",
		create: () => ao("publikasjonsarkiv", "300px", Qa($a("bg")), [$(Q(6, 28, 60, 38), X("seed.archive.title")), Ka(Q(6, 88, 88, 180), "archive", { limit: 0 })])
	}), e.sections.define("arrangementer", {
		label: "Arrangementer",
		labelKey: "preset.arrangementer.label",
		group: "Kort og lister",
		groupKey: "presetGroup.cards",
		hint: "Tre rader med dato-badge og påmeldingsknapp",
		hintKey: "preset.arrangementer.hint",
		create: () => {
			let e = (e, t, n, r) => [
				$(Q(6, e, 8, 88), X("seed.events.dateBadge", {
					day: t,
					month: n
				}), {
					align: "center",
					box: !0
				}),
				$(Q(16, e, 58, 88), X("seed.events.row", { title: r })),
				Ua(Q(78, e + 24, 16, 40), X("seed.events.signup"), { style: "secondary" })
			];
			return ao("arrangementer", "440px", Qa($a("surface")), [
				$(Q(6, 28, 50, 38), X("seed.events.title")),
				...e(88, "11", X("seed.events.monthAug"), X("seed.events.row1")),
				...e(196, "25", X("seed.events.monthAug"), X("seed.events.row2")),
				...e(304, "8", X("seed.events.monthSep"), X("seed.events.row3"))
			]);
		},
		itemLabel: "rad",
		itemLabelKey: "item.row",
		item: (e) => {
			let t = to(e) + 16;
			return {
				blocks: [
					$(Q(6, t, 8, 88), X("seed.events.newBadge"), {
						align: "center",
						box: !0
					}),
					$(Q(16, t, 58, 88), X("seed.events.row", { title: X("seed.events.newTitle") })),
					Ua(Q(78, t + 24, 16, 40), X("seed.events.signup"), { style: "secondary" })
				],
				bottom: t + 116
			};
		}
	}), e.sections.define("team", {
		label: "Team/styret",
		labelKey: "preset.team.label",
		group: "Kort og lister",
		groupKey: "presetGroup.cards",
		hint: "Portretter med navn, verv og e-post",
		hintKey: "preset.team.hint",
		create: () => {
			let e = (e, t, n) => {
				let r = Ha(Q(e, 80, 22, 180), { alt: X("seed.team.alt") }), i = $(Q(e, 268, 22, 84), X("seed.team.member", { role: n }), { align: "center" });
				return r.mobileOrder = io(80, t, 0), i.mobileOrder = io(80, t, 1), [r, i];
			};
			return ao("team", "420px", Qa($a("surface")), [
				$(Q(6, 24, 50, 32), X("seed.team.title")),
				...e(7.5, 0, X("seed.team.role1")),
				...e(39, 1, X("seed.team.role2")),
				...e(70.5, 2, X("seed.team.role3"))
			]);
		},
		itemLabel: "person",
		itemLabelKey: "item.person",
		item: (e) => {
			let { x: t, y: n, n: r } = ro(e, 3, 7.5, 31.5, 80, 288, 22, 272), i = Ha(Q(t, n, 22, 180), { alt: X("seed.team.alt") }), a = $(Q(t, n + 188, 22, 84), X("seed.team.member", { role: X("seed.team.roleNew") }), { align: "center" });
			return i.mobileOrder = io(80, r, 0), a.mobileOrder = io(80, r, 1), {
				blocks: [i, a],
				bottom: n + 296
			};
		}
	}), e.sections.define("faq", {
		label: "FAQ",
		labelKey: "preset.faq.label",
		group: "Kort og lister",
		groupKey: "presetGroup.cards",
		hint: "Spørsmål og svar i kort",
		hintKey: "preset.faq.hint",
		create: () => ao("faq", "520px", Qa($a("bg")), [
			$(Q(25, 24, 50, 36), X("seed.faq.title"), { align: "center" }),
			Ja(Q(20, 80, 60, 320), [
				{
					q: X("seed.faq.q1"),
					a: X("seed.faq.answer")
				},
				{
					q: X("seed.faq.q2"),
					a: X("seed.faq.answer")
				},
				{
					q: X("seed.faq.q3"),
					a: X("seed.faq.answer")
				}
			]),
			$(Q(20, 416, 60, 32), X("seed.faq.more"), { align: "center" })
		])
	}), e.sections.define("tidslinje", {
		label: "Tidslinje",
		labelKey: "preset.tidslinje.label",
		group: "Kort og lister",
		groupKey: "presetGroup.cards",
		hint: "Historien som hendelser langs en linje",
		hintKey: "preset.tidslinje.hint",
		create: () => ao("tidslinje", "480px", Qa($a("bg")), [$(Q(25, 24, 50, 36), X("seed.tidslinje.title"), { align: "center" }), Xa(Q(25, 88, 50, 330), [
			{
				year: "2019",
				title: X("seed.tidslinje.t1"),
				text: X("seed.tidslinje.text")
			},
			{
				year: "2022",
				title: X("seed.tidslinje.t2"),
				text: X("seed.tidslinje.text")
			},
			{
				year: "2026",
				title: X("seed.tidslinje.t3"),
				text: X("seed.tidslinje.text")
			}
		])])
	}), e.sections.define("steg", {
		label: "Steg for steg",
		labelKey: "preset.steg.label",
		group: "Kort og lister",
		groupKey: "presetGroup.cards",
		hint: "Tre nummererte kort",
		hintKey: "preset.steg.hint",
		create: () => {
			let e = (e, t, n) => {
				let r = $(Q(e, 88, 25, 72), `<h3>${t + 1}</h3>`, {
					align: "center",
					size: 44
				}), i = $(Q(e, 168, 25, 160), X("seed.steps.card", { title: n }), {
					align: "center",
					box: !0
				});
				return r.mobileOrder = io(88, t, 0), i.mobileOrder = io(88, t, 1), [r, i];
			};
			return ao("steg", "400px", Qa($a("bg")), [
				$(Q(6, 28, 60, 38), X("seed.steps.title")),
				...e(6, 0, X("seed.steps.s1")),
				...e(37.5, 1, X("seed.steps.s2")),
				...e(69, 2, X("seed.steps.s3"))
			]);
		},
		itemLabel: "steg",
		itemLabelKey: "item.step",
		item: (e) => {
			let { x: t, y: n, n: r } = ro(e, 3, 6, 31.5, 88, 272, 25, 240), i = $(Q(t, n, 25, 72), `<h3>${r + 1}</h3>`, {
				align: "center",
				size: 44
			}), a = $(Q(t, n + 80, 25, 160), X("seed.steps.card", { title: X("seed.steps.newTitle") }), {
				align: "center",
				box: !0
			});
			return i.mobileOrder = io(88, r, 0), a.mobileOrder = io(88, r, 1), {
				blocks: [i, a],
				bottom: n + 268
			};
		}
	}), e.sections.define("hovedoppslag", {
		label: "Hovedoppslag",
		labelKey: "preset.hovedoppslag.label",
		group: "Kort og lister",
		groupKey: "presetGroup.cards",
		hint: "Én stor sak og to små ved siden",
		hintKey: "preset.hovedoppslag.hint",
		create: () => {
			let e = [
				Ha(Q(6, 40, 55, 300)),
				$(Q(6, 348, 55, 108), X("seed.feature.main")),
				Ua(Q(6, 464, 14, 38), X("seed.readMore"), { style: "secondary" }),
				Ha(Q(66, 40, 28, 120)),
				$(Q(66, 164, 28, 60), X("seed.feature.small1")),
				Ha(Q(66, 244, 28, 120)),
				$(Q(66, 368, 28, 60), X("seed.feature.small2"))
			];
			return e.forEach((e, t) => {
				e.mobileOrder = io(40, t < 3 ? 0 : 1, t);
			}), ao("hovedoppslag", "540px", Qa($a("bg")), e);
		}
	}), e.sections.define("produkter", {
		label: "Produkter",
		labelKey: "preset.produkter.label",
		group: "Kort og lister",
		groupKey: "presetGroup.cards",
		hint: "Tre produktkort; pek Kjøp-knappen på en betalingslenke (f.eks. Vipps)",
		hintKey: "preset.produkter.hint",
		create: () => {
			let e = (e, t, n, r) => {
				let i = [
					Ha(Q(e, 88, 25, 200)),
					$(Q(e, 296, 25, 76), X("seed.products.card", {
						name: n,
						price: r
					}), { align: "center" }),
					Ua(Q(e + 5, 380, 15, 40), X("seed.products.buy"))
				];
				return i.forEach((e, n) => {
					e.mobileOrder = io(88, t, n);
				}), i;
			};
			return ao("produkter", "470px", Qa($a("bg")), [
				$(Q(6, 28, 50, 38), X("seed.products.title")),
				...e(6, 0, X("seed.products.name"), X("seed.products.price1")),
				...e(37.5, 1, X("seed.products.name"), X("seed.products.price2")),
				...e(69, 2, X("seed.products.name"), X("seed.products.price3"))
			]);
		},
		itemLabel: "produkt",
		itemLabelKey: "item.product",
		item: (e) => {
			let { x: t, y: n, n: r } = ro(e, 3, 6, 31.5, 88, 348, 25, 332), i = [
				Ha(Q(t, n, 25, 200)),
				$(Q(t, n + 208, 25, 76), X("seed.products.card", {
					name: X("seed.products.name"),
					price: X("seed.products.price1")
				}), { align: "center" }),
				Ua(Q(t + 5, n + 292, 15, 40), X("seed.products.buy"))
			];
			return i.forEach((e, t) => {
				e.mobileOrder = io(88, r, t);
			}), {
				blocks: i,
				bottom: n + 356
			};
		}
	}), e.sections.define("cta", {
		label: "CTA-banner",
		labelKey: "preset.cta.label",
		group: "Fremheving",
		groupKey: "presetGroup.highlight",
		hint: "Full bredde med én tydelig handling",
		hintKey: "preset.cta.hint",
		create: () => ao("cta", "280px", Qa($a("surface"), eo(.5, .5, .3, .7)), [
			$(Q(20, 56, 60, 40), X("seed.cta.title"), { align: "center" }),
			$(Q(25, 104, 50, 26), X("seed.cta.sub"), { align: "center" }),
			Ua(Q(42, 148, 16, 42), X("seed.join"))
		])
	}), e.sections.define("sitat", {
		label: "Sitat",
		labelKey: "preset.sitat.label",
		group: "Fremheving",
		groupKey: "presetGroup.highlight",
		hint: "Stort sitat med attribusjon",
		hintKey: "preset.sitat.hint",
		create: () => ao("sitat", "300px", Qa($a("bg")), [Ya(Q(20, 56, 60, 190), {
			text: X("seed.sitat.text"),
			attribution: X("seed.sitat.name"),
			role: X("seed.sitat.role")
		})])
	}), e.sections.define("statistikk", {
		label: "Statistikk",
		labelKey: "preset.statistikk.label",
		group: "Fremheving",
		groupKey: "presetGroup.highlight",
		hint: "Tre store tall med etikett",
		hintKey: "preset.statistikk.hint",
		create: () => {
			let e = (e, t, n, r, i) => {
				let a = Za(Q(e, 76, 25, 120), {
					value: n,
					suffix: r,
					label: i
				});
				return a.mobileOrder = io(76, t, 0), a;
			};
			return ao("statistikk", "260px", Qa($a("surface")), [
				e(6, 0, "120", "+", X("seed.stats.l1")),
				e(37.5, 1, "25", "", X("seed.stats.l2")),
				e(69, 2, "1981", "", X("seed.stats.l3"))
			]);
		},
		itemLabel: "tall",
		itemLabelKey: "item.number",
		item: (e) => {
			let { x: t, y: n, n: r } = ro(e, 3, 6, 31.5, 76, 140, 25, 120), i = Za(Q(t, n, 25, 120), {
				value: "42",
				label: X("seed.stats.newLabel")
			});
			return i.mobileOrder = io(76, r, 0), {
				blocks: [i],
				bottom: n + 148
			};
		}
	}), e.sections.define("sponsorer", {
		label: "Sponsorer",
		labelKey: "preset.sponsorer.label",
		group: "Fremheving",
		groupKey: "presetGroup.highlight",
		hint: "Logorad i gråtone med lenker",
		hintKey: "preset.sponsorer.hint",
		create: () => {
			let e = (e) => Ha(Q(e, 108, 18.5, 100), {
				alt: X("seed.sponsors.alt"),
				fit: "contain",
				radius: null,
				saturate: 0
			});
			return ao("sponsorer", "280px", Qa($a("bg")), [
				$(Q(6, 28, 60, 36), X("seed.sponsors.title")),
				e(5.5),
				e(29),
				e(52.5),
				e(76)
			]);
		},
		itemLabel: "logo",
		itemLabelKey: "item.logo",
		item: (e) => {
			let { x: t, y: n } = ro(e, 4, 5.5, 23.5, 108, 124, 18.5, 100);
			return {
				blocks: [Ha(Q(t, n, 18.5, 100), {
					alt: X("seed.sponsors.alt"),
					fit: "contain",
					radius: null,
					saturate: 0
				})],
				bottom: n + 124
			};
		}
	}), e.sections.define("medlemskap", {
		label: "Medlemskap",
		labelKey: "preset.medlemskap.label",
		group: "Fremheving",
		groupKey: "presetGroup.highlight",
		hint: "Prisnivåer med fordeler og Vipps-linje",
		hintKey: "preset.medlemskap.hint",
		create: () => ao("medlemskap", "500px", Qa($a("surface")), [
			$(Q(6, 28, 50, 38), X("seed.membership.title")),
			$(Q(14, 88, 32, 250), X("seed.membership.tier1"), {
				align: "center",
				box: !0
			}),
			$(Q(54, 88, 32, 250), X("seed.membership.tier2"), {
				align: "center",
				box: !0
			}),
			Ua(Q(42, 358, 16, 42), X("seed.join")),
			$(Q(25, 414, 50, 30), X("seed.membership.vipps"), { align: "center" })
		])
	});
}
//#endregion
//#region ../template/assets/engine/0.6.11/maler-model.js
var so = [
	"section",
	"blocks",
	"page"
];
function co(e) {
	return ta(String(e ?? ""), "");
}
function lo(e, t, { id: n, title: r }) {
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
//#region ../template/assets/engine/0.6.11/preset-thumb.js
var uo = /^#[0-9a-fA-F]{3,8}$/, fo = /^[a-z][a-z0-9-]*$/, po = "#171c26", mo = "#232a38", ho = "#98a1b3", go = "#7c5cff", _o = (e, t) => `var(--urd-color-${e}, ${t})`;
function vo(e, t) {
	return typeof e == "string" ? uo.test(e) ? e : fo.test(e) ? _o(e, t) : t : t;
}
function yo(e, t = 800) {
	let n = Number.parseFloat(e);
	return !Number.isFinite(n) || n <= 0 ? 400 : typeof e == "string" && e.trim().endsWith("vh") ? n / 100 * t : n;
}
var bo = (e) => Math.round(e * 10) / 10, xo = (e, t, n) => Math.min(n, Math.max(t, e)), So = (e, t, n, r, i, a = "") => `<rect x="${bo(e)}" y="${bo(t)}" width="${bo(Math.max(n, 1))}" height="${bo(Math.max(r, 1))}" fill="${i}"${a}/>`;
function Co(e) {
	for (let t of e?.background?.layers ?? []) {
		if (t.type === "color") return vo(t.props?.value, po);
		if (t.type === "gradient") return vo(Array.isArray(t.props?.stops) ? t.props.stops[0] : null, po);
	}
	return _o("bg", po);
}
function wo(e, t, n, r, i) {
	let a = /<h[1-3]/.test(String(i?.html ?? "")), o = i?.align === "center", s = _o("text", ho), c = [], l = [
		.72,
		.9,
		.5
	], u = t + 1;
	for (let i = 0; i < 3; i++) {
		let d = i === 0 && a ? 4 : 2.2;
		if (u + d > t + r) break;
		let f = n * l[i], p = o ? e + (n - f) / 2 : e;
		c.push(So(p, u, f, d, s, ` opacity="${i === 0 ? .8 : .4}" rx="1"`)), u += d + 2.4;
	}
	return c.join("");
}
function To(e, t, n, r) {
	let i = _o("text", ho), a = [So(e, t, n, r, _o("surface", mo), " rx=\"1.5\"")], o = (t) => bo(e + n * t), s = (e) => bo(t + r * e);
	return a.push(`<polygon points="${o(.08)},${s(.9)} ${o(.42)},${s(.38)} ${o(.62)},${s(.68)} ${o(.75)},${s(.5)} ${o(.92)},${s(.9)}" fill="${i}" opacity="0.4"/>`), a.push(`<circle cx="${o(.28)}" cy="${s(.26)}" r="${bo(Math.max(1, Math.min(n, r) * .1))}" fill="${i}" opacity="0.5"/>`), a.join("");
}
function Eo(e, t, n, r) {
	let i = Math.max(1, n * .03), a = (n - i * 2) / 3, o = [];
	for (let n = 0; n < 3; n++) o.push(To(e + n * (a + i), t, a, r));
	return o.join("");
}
function Do(e, t, n, r) {
	let i = Math.max(1, n * .03), a = (n - i * 2) / 3, o = [];
	for (let n = 0; n < 3; n++) {
		let s = e + n * (a + i);
		o.push(So(s, t, a, r * .55, _o("surface", mo), " rx=\"1.5\"")), o.push(So(s, t + r * .62, a * .8, 2, _o("text", ho), " opacity=\"0.5\" rx=\"1\""));
	}
	return o.join("");
}
function Oo(e, t, n, r, i) {
	let a = vo(i?.color, go), o = i?.kind;
	return o === "circle" ? `<ellipse cx="${bo(e + n / 2)}" cy="${bo(t + r / 2)}" rx="${bo(Math.max(n / 2, 1))}" ry="${bo(Math.max(r / 2, 1))}" fill="${a}" opacity="0.8"/>` : o === "triangle" ? `<polygon points="${bo(e)},${bo(t + r)} ${bo(e + n / 2)},${bo(t)} ${bo(e + n)},${bo(t + r)}" fill="${a}" opacity="0.8"/>` : o === "line" || o === "arrow" ? So(e, t + r / 2 - .75, n, 1.5, a, " opacity=\"0.85\" rx=\"0.75\"") : So(e, t, n, r, a, " opacity=\"0.8\" rx=\"1\"");
}
function ko(e, t, n, r, i, a) {
	if (e === "text") return wo(t, n, r, i, a);
	if (e === "image") return To(t, n, r, i);
	if (e === "galleri") return Eo(t, n, r, i);
	if (e === "samling") return Do(t, n, r, i);
	if (e === "shape") return Oo(t, n, r, i, a);
	if (e === "button") return So(t, n, r, i, _o("accent", go), ` rx="${bo(Math.min(i / 2, 4))}"`);
	if (e === "icon") {
		let e = Math.max(1.2, Math.min(r, i) / 2);
		return `<circle cx="${bo(t + r / 2)}" cy="${bo(n + i / 2)}" r="${bo(e)}" fill="${_o("accent", go)}" opacity="0.85"/>`;
	}
	if (e === "video") {
		let e = [So(t, n, r, i, _o("surface", mo), " rx=\"1.5\"")], a = t + r / 2, o = n + i / 2, s = Math.max(1.5, Math.min(r, i) * .22);
		return e.push(`<polygon points="${bo(a - s / 2)},${bo(o - s)} ${bo(a - s / 2)},${bo(o + s)} ${bo(a + s)},${bo(o)}" fill="${_o("text", ho)}" opacity="0.6"/>`), e.join("");
	}
	if (e === "tidslinje") {
		let e = [So(t + 1, n, 1.4, i, _o("accent", go), " opacity=\"0.7\" rx=\"0.7\"")];
		for (let a = 0; a < 3; a += 1) {
			let o = n + i * (.18 + a * .32);
			e.push(`<circle cx="${bo(t + 1.7)}" cy="${bo(o)}" r="1.6" fill="${_o("accent", go)}"/>`), e.push(So(t + 5, o - 1, r * .5, 2, _o("text", ho), " opacity=\"0.5\" rx=\"1\""));
		}
		return e.join("");
	}
	return e === "sitat" ? [
		`<text x="${bo(t + r / 2)}" y="${bo(n + i * .34)}" text-anchor="middle" font-size="${bo(Math.min(r, i) * .5)}" font-family="Georgia, serif" fill="${_o("accent", go)}">“</text>`,
		So(t + r * .15, n + i * .48, r * .7, 2, _o("text", ho), " opacity=\"0.6\" rx=\"1\""),
		So(t + r * .25, n + i * .62, r * .5, 2, _o("text", ho), " opacity=\"0.6\" rx=\"1\""),
		So(t + r * .35, n + i * .82, r * .3, 1.6, _o("text", ho), " opacity=\"0.35\" rx=\"0.8\"")
	].join("") : e === "statistikk" ? [So(t + r * .28, n + i * .15, r * .44, i * .42, _o("accent", go), " opacity=\"0.85\" rx=\"1\""), So(t + r * .32, n + i * .72, r * .36, 1.6, _o("text", ho), " opacity=\"0.4\" rx=\"0.8\"")].join("") : So(t, n, r, i, _o("surface", mo), " rx=\"1.5\"");
}
function Ao(e, t, n) {
	let r = Array.isArray(e?.blocks) ? e.blocks : [], i = r.map((e) => (e.frames?.desktop?.y ?? 0) + (e.frames?.desktop?.h ?? 0)), a = n / Math.max(yo(e?.size?.minHeight), i.length ? Math.max(...i) + 16 : 0), o = [So(0, 0, t, n, Co(e))];
	for (let r of e?.background?.layers ?? []) {
		if (r.type !== "glow") continue;
		let e = r.props ?? {};
		o.push(`<circle cx="${bo(xo(e.x ?? .5, 0, 1) * t)}" cy="${bo(xo(e.y ?? .3, 0, 1) * n)}" r="${bo(t * xo(e.radius ?? .5, .1, 1) * .5)}" fill="${vo(e.color, go)}" opacity="${bo(xo(e.opacity ?? .3, 0, .5))}"/>`);
	}
	for (let e of r) {
		let r = e.frames?.desktop;
		if (!r) continue;
		let i = xo((r.x ?? 0) * (t / 100), 0, t - 2), s = xo((r.y ?? 0) * a, 0, n - 2), c = xo((r.w ?? 10) * (t / 100), 2, t - i), l = xo((r.h ?? 20) * a, 2, n - s);
		o.push(ko(e.type, i, s, c, l, e.props));
	}
	return o.join("");
}
function jo(e, { w: t = 96, h: n = 116, max: r = 6 } = {}) {
	let i = (Array.isArray(e?.sections) ? e.sections : []).slice(0, r);
	if (!i.length) return `<svg viewBox="0 0 ${t} ${n}" width="${t}" height="${n}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${So(0, 0, t, n, _o("bg", po))}</svg>`;
	let a = i.map((e) => xo(yo(e?.size?.minHeight), 160, 900)), o = a.reduce((e, t) => e + t, 0), s = n - 1 * (i.length - 1), c = [], l = 0;
	for (let e = 0; e < i.length; e += 1) {
		let n = Math.max(6, a[e] / o * s);
		c.push(`<g transform="translate(0 ${bo(l)})">${Ao(i[e], t, n)}</g>`), l += n + 1;
	}
	return `<svg viewBox="0 0 ${t} ${n}" width="${t}" height="${n}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${c.join("")}</svg>`;
}
//#endregion
//#region ../template/assets/engine/0.6.11/page-presets.js
var Mo = /* @__PURE__ */ new Map();
oo({ sections: { define: (e, t) => Mo.set(e, t) } });
var No = [
	{
		id: "landing",
		labelKey: "pageTemplate.landing",
		sections: [
			"hero",
			"funksjonskort",
			"statistikk",
			"sitat",
			"cta"
		]
	},
	{
		id: "om-oss",
		labelKey: "pageTemplate.about",
		sections: [
			"hero-sentrert",
			"team",
			"tidslinje",
			"sponsorer",
			"cta"
		]
	},
	{
		id: "kontakt",
		labelKey: "pageTemplate.contact",
		sections: [
			"hero-sentrert",
			"kontakt",
			"faq"
		]
	},
	{
		id: "portefolje",
		labelKey: "pageTemplate.portfolio",
		sections: [
			"hero-sentrert",
			"galleri",
			"sitat",
			"cta"
		]
	},
	{
		id: "arrangement",
		labelKey: "pageTemplate.event",
		sections: [
			"hovedoppslag",
			"arrangementer",
			"steg",
			"faq",
			"cta"
		]
	}
];
function Po(e, { pageId: t, title: n }) {
	let r = No.find((t) => t.id === e);
	return r ? {
		schemaVersion: 1,
		meta: {
			id: t,
			title: n
		},
		sections: r.sections.map((e) => Mo.get(e).create())
	} : null;
}
//#endregion
//#region ../template/assets/engine/0.6.11/palette-search.js
function Fo(e) {
	return String(e ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}
function Io(e, t) {
	let n = Fo(t).trim(), r = Fo(e);
	return n ? r.startsWith(n) ? 0 : r.split(/[^a-z0-9]+/).some((e) => e.startsWith(n)) ? 1 : r.includes(n) ? 2 : -1 : 2;
}
function Lo(e, t, n) {
	return e.map((e, r) => ({
		item: e,
		i: r,
		rank: Io(n(e), t)
	})).filter((e) => e.rank >= 0).sort((e, t) => e.rank - t.rank || e.i - t.i).map((e) => e.item);
}
//#endregion
//#region ../template/assets/engine/0.6.11/theme.js
function Ro(e, t) {
	let n = e.tokens || {}, r = e.scheme === "dark" ? "dark" : "light";
	if (!e.alt?.tokens || t === r) return n;
	let i = {};
	for (let t of /* @__PURE__ */ new Set([...Object.keys(n), ...Object.keys(e.alt.tokens)])) i[t] = {
		...n[t],
		...e.alt.tokens[t]
	};
	return i;
}
var zo = /^[a-zA-Z0-9#%.,()'"\s+\-*/]+$/;
function Bo(e) {
	return typeof e == "string" && zo.test(e) && !/url\(|\/\*|\*\/|expression/i.test(e);
}
function Vo(e) {
	let t = e.tokens || {}, n = Ro(e, "light"), r = Ro(e, "dark"), i = e.scheme === "dark" ? "dark" : "light", a = [], o = [], s = [], c = /* @__PURE__ */ new Set([
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
			Bo(c) && (a.push(`  --urd-${e}-${l}: ${c};`), i && a.push(`  --urd-base-${l}: ${c};`)), u !== d && (i && Bo(u) && Bo(d) ? o.push({
				name: l,
				lv: u,
				dv: d
			}) : !i && Bo(u) && Bo(d) && s.push({
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
function Ho(e) {
	return /^[a-z][a-z0-9-]*$/.test(e) ? `var(--urd-color-${e})` : e;
}
var Uo = {
	flate: {
		"--urd-color-bg": "var(--urd-base-surface)",
		"--urd-color-surface": "color-mix(in srgb, var(--urd-base-text) 7%, var(--urd-base-surface))"
	},
	aksent: {
		"--urd-color-bg": "var(--urd-base-accent)",
		"--urd-color-surface": "color-mix(in srgb, var(--urd-base-accent) 82%, #000)",
		"--urd-color-text": "var(--urd-base-accent-text)",
		"--urd-color-accent": "var(--urd-base-accent-text)",
		"--urd-color-accent-text": "var(--urd-base-accent)"
	},
	invers: {
		"--urd-color-bg": "var(--urd-base-text)",
		"--urd-color-surface": "color-mix(in srgb, var(--urd-base-text) 78%, var(--urd-base-bg))",
		"--urd-color-text": "var(--urd-base-bg)"
	},
	dus: {
		"--urd-color-bg": "color-mix(in srgb, var(--urd-base-accent) 12%, var(--urd-base-bg))",
		"--urd-color-surface": "color-mix(in srgb, var(--urd-base-accent) 8%, var(--urd-base-surface))"
	},
	dempet: {
		"--urd-color-bg": "color-mix(in srgb, var(--urd-base-text) 5%, var(--urd-base-bg))",
		"--urd-color-surface": "color-mix(in srgb, var(--urd-base-text) 10%, var(--urd-base-bg))",
		"--urd-color-text": "color-mix(in srgb, var(--urd-base-text) 82%, var(--urd-base-bg))"
	},
	dyp: {
		"--urd-color-bg": "color-mix(in srgb, var(--urd-base-accent) 30%, var(--urd-base-text))",
		"--urd-color-surface": "color-mix(in srgb, var(--urd-base-accent) 40%, var(--urd-base-text))",
		"--urd-color-text": "var(--urd-base-bg)"
	},
	uthevet: { "--urd-color-surface": "color-mix(in srgb, var(--urd-base-accent) 14%, var(--urd-base-surface))" }
}, Wo = {
	flate: "sectionTheme.flate",
	aksent: "sectionTheme.aksent",
	invers: "sectionTheme.invers",
	dus: "sectionTheme.dus",
	dempet: "sectionTheme.dempet",
	dyp: "sectionTheme.dyp",
	uthevet: "sectionTheme.uthevet"
};
[...new Set(Object.values(Uo).flatMap(Object.keys))];
function Go(e) {
	return Uo[e] ?? {};
}
function Ko(e) {
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
function qo(e, t) {
	let n = Ko(e), r = Ko(t);
	return n == null || r == null ? null : (Math.max(n, r) + .05) / (Math.min(n, r) + .05);
}
//#endregion
//#region ../template/assets/engine/0.6.11/backgrounds/color.js
var Jo = {
	version: 1,
	label: "Farge",
	labelKey: "bgLayer.color",
	defaults: () => ({
		value: "bg",
		opacity: 1
	}),
	migrations: {},
	render(e, t) {
		e.style.background = Ho(t.value), e.style.opacity = String(t.opacity ?? 1);
	}
}, Yo = {
	linear: [
		"pan",
		"pan-loop",
		"rotate"
	],
	radial: ["pulse", "orbit"]
};
function Xo(e) {
	let t = Array.isArray(e) && e.length ? e : [{ color: "#0b0e14" }, { color: "#1a1030" }], n = t.map((e) => Math.max(0, Number(e?.share) || 0)), r = n.reduce((e, t) => e + t, 0), i = r <= 0, a = i ? t.length : r, o = 0;
	return t.map((e, t) => {
		let r = i ? 1 : n[t], s = (o + r / 2) / a * 100;
		return o += r, {
			color: e?.color ?? "#0b0e14",
			at: Math.round(s * 100) / 100
		};
	});
}
function Zo(e) {
	let t = (e) => Math.round(e * 100) / 100, n = e[0]?.at ?? 0;
	return [...e.map((e) => ({
		color: e.color,
		at: t(e.at - n)
	})), {
		color: e[0]?.color ?? "#0b0e14",
		at: 100
	}];
}
function Qo(e, t, n, r = .5) {
	let i = n % 360 * Math.PI / 180, a = (e) => Math.round(e * 100) / 100 || 0, o = (Math.abs(e * Math.sin(i)) + Math.abs(t * Math.cos(i))) / (1 - Math.min(Math.max(r, 0), .9));
	return {
		period: a(o),
		dx: a(Math.sin(i) * o),
		dy: a(-Math.cos(i) * o)
	};
}
function $o(e, t, n) {
	return `repeating-linear-gradient(${t}deg, ${e.map((e) => `${Ho(e.color)} ${Math.round(e.at / 100 * n * 100) / 100}px`).join(", ")})`;
}
function es(e) {
	let t = e.kind === "radial" ? "radial" : "linear", n = (Yo[t] ?? []).includes(e.animation) ? e.animation : null, r = Xo(e.stops), i = r.map((e) => `${Ho(e.color)} ${e.at}%`).join(", "), a = {}, o;
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
					stops: Zo(r),
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
var ts = /* @__PURE__ */ new Set(), ns = !1;
function rs(e) {
	ts.add(e), !(ns || typeof window > "u") && (ns = !0, window.addEventListener("resize", () => {
		for (let e of [...ts]) e() || ts.delete(e);
	}));
}
var is = !1;
function as() {
	if (!is) {
		is = !0;
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
var os = {
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
		let n = es(t);
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
					let e = Qo(r, i, n.loop.angle, n.loop.maxShare);
					t.style.inset = `${-Math.ceil(e.period)}px`, t.style.background = $o(n.loop.stops, n.loop.angle, e.period), t.style.setProperty("--urd-loop-dx", `${e.dx}px`), t.style.setProperty("--urd-loop-dy", `${e.dy}px`);
				}
				return !0;
			};
			requestAnimationFrame(r), rs(r);
			return;
		}
		if (n.runner) {
			e.classList.add("urd-bg-loop-host");
			let t = document.createElement("div");
			t.className = n.runner.className, t.style.background = n.runner.background, n.runner.left != null && (t.style.left = n.runner.left), n.runner.top != null && (t.style.top = n.runner.top), e.appendChild(t);
			return;
		}
		e.style.background = n.background, n.className && (e.classList.add(n.className), n.className === "urd-bg-rotate" && as());
	}
}, ss = {
	version: 1,
	label: "Glød",
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
		let n = Ho(t.color);
		e.style.background = `radial-gradient(circle at ${t.x * 100}% ${t.y * 100}%, ${n} 0%, transparent ${t.radius * 100}%)`, e.style.opacity = String(t.opacity ?? .35);
	}
}, cs = "url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22128%22%20height%3D%22128%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.9%22%20numOctaves%3D%222%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22128%22%20height%3D%22128%22%20filter%3D%22url(%23n)%22%2F%3E%3C%2Fsvg%3E\")", ls = {
	version: 1,
	label: "Korn",
	labelKey: "bgLayer.grain",
	defaults: () => ({ opacity: .06 }),
	migrations: {},
	render(e, t) {
		e.style.backgroundImage = cs, e.style.backgroundRepeat = "repeat", e.style.opacity = String(t.opacity ?? .06);
	}
}, us = .4;
function ds(e, t) {
	return `${(e ?? .5) * 100}% ${(t ?? .5) * 100}%`;
}
function fs(e, t) {
	return e === "contain" ? "contain" : e === "cover" ? "cover" : `${Math.max(0, t ?? 1) * 100}%`;
}
function ps(e) {
	let t = "-9999px";
	return e === "up" ? `inset(${t} 0 0 0)` : e === "down" ? `inset(0 0 ${t} 0)` : e === "both" ? `inset(${t} 0 ${t} 0)` : "inset(0)";
}
function ms(e, t, n, r = .18) {
	let i = Math.max(0, Math.min(1, n)) * us * t;
	return Math.round(Math.min(i, r * e));
}
function hs(e, t, n, r, i) {
	let a = e + t / 2, o = (n / 2 - a) * Math.max(0, Math.min(1, r)) * us, s = i ?? ms(t, n, r);
	return Math.max(-s, Math.min(s, o)) || 0;
}
var gs = /* @__PURE__ */ new Set(), _s = !1, vs = 0;
function ys() {
	vs = 0;
	for (let e of [...gs]) e() || gs.delete(e);
}
function bs() {
	vs ||= requestAnimationFrame(ys);
}
function xs(e) {
	gs.add(e), e(), !(_s || typeof window > "u") && (_s = !0, window.addEventListener("scroll", bs, { passive: !0 }), window.addEventListener("resize", bs, { passive: !0 }));
}
function Ss(e, t, n, r) {
	let i = r === "cover" || r === "flislegg" || r === "repeat", a = e.closest(".urd-section") ?? e.parentElement?.closest(".urd-section") ?? e.parentElement, o = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
	e.style.willChange = "transform";
	let s = (t) => {
		e.style.top = `-${t}px`, e.style.bottom = `-${t}px`;
	}, c = () => {
		if (!e.isConnected) return !1;
		if (o || document.body.classList.contains("urd-mobile")) return s(n), e.style.transform = "", !0;
		let r = (a ?? e).getBoundingClientRect(), c = window.innerHeight || document.documentElement.clientHeight, l = ms(r.height, c, t, i ? .18 : .6);
		s(i ? Math.max(n, l) : n);
		let u = hs(r.top, r.height, c, t, l);
		return e.style.transform = `translateY(${u.toFixed(1)}px)`, !0;
	};
	xs(c), typeof requestAnimationFrame == "function" && requestAnimationFrame(() => requestAnimationFrame(c));
}
function Cs() {
	return typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("animation-timeline", "view()");
}
var ws = /* @__PURE__ */ new Set(), Ts = !1, Es = 0;
function Ds() {
	Es = 0;
	for (let e of [...ws]) e() || ws.delete(e);
}
function Os() {
	!Es && typeof requestAnimationFrame == "function" && (Es = requestAnimationFrame(Ds));
}
function ks(e) {
	ws.add(e), e(), !(Ts || typeof window > "u") && (Ts = !0, window.addEventListener("resize", Os, { passive: !0 }));
}
function As(e, t, n, r) {
	let i = r === "cover" || r === "flislegg" || r === "repeat", a = e.closest(".urd-section") ?? e.parentElement?.closest(".urd-section") ?? e.parentElement;
	e.style.willChange = "transform", e.classList.add("urd-parallax-css");
	let o = () => {
		if (!e.isConnected) return !1;
		let r = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || document.body.classList.contains("urd-mobile"), o = (a ?? e).getBoundingClientRect(), s = window.innerHeight || document.documentElement.clientHeight, c = ms(o.height, s, t, i ? .18 : .6), l = i && !r ? Math.max(n, c) : n;
		return e.style.setProperty("--urd-px-shift", `${c}px`), e.style.top = `-${l}px`, e.style.bottom = `-${l}px`, !0;
	};
	ks(o), typeof requestAnimationFrame == "function" && requestAnimationFrame(() => requestAnimationFrame(o));
}
var js = {
	version: 1,
	label: "Bilde",
	labelKey: "bgLayer.image",
	defaults: () => ({
		src: "",
		fit: "vanlig",
		x: .5,
		y: .5,
		size: 1,
		opacity: 1,
		blur: 0,
		parallax: 0,
		bleed: "none"
	}),
	migrations: {},
	render(e, t) {
		if (!t.src) return;
		e.style.opacity = String(t.opacity ?? 1), e.style.clipPath = ps(t.bleed), e.style.zIndex = t.bleed === "down" || t.bleed === "both" ? "1" : "";
		let n = document.createElement("div");
		n.className = "urd-bg-image", n.style.position = "absolute", n.style.left = "0", n.style.right = "0", n.style.top = "0", n.style.bottom = "0";
		let r = t.fit === "flislegg" || t.fit === "repeat";
		n.style.backgroundImage = `url("${t.src}")`, n.style.backgroundSize = fs(t.fit, t.size), n.style.backgroundRepeat = r ? "repeat" : "no-repeat", n.style.backgroundPosition = ds(t.x, t.y);
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
		if (e.appendChild(n), t.parallax > 0) {
			let e = t.fit ?? "cover";
			Cs() ? As(n, t.parallax, i, e) : Ss(n, t.parallax, i, e);
		}
	}
};
//#endregion
//#region ../template/assets/engine/0.6.11/galleri-model.js
function Ms(e, t, n) {
	return !Number.isFinite(n) || n < 1 ? 0 : (((Number.isFinite(e) ? e : 0) + t) % n + n) % n;
}
function Ns({ count: e = 0, reducedMotion: t = !1 } = {}) {
	return e >= 2 && !t;
}
function Ps(e, { min: t = 2, fallback: n = 5 } = {}) {
	let r = Number(e);
	return !Number.isFinite(r) || r <= 0 ? n : Math.max(t, r);
}
//#endregion
//#region ../template/assets/engine/0.6.11/backgrounds/bildegalleri.js
var Fs = {
	version: 1,
	label: "Bildegalleri",
	labelKey: "bgLayer.bildegalleri",
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
		let n = (t.images ?? []).filter((e) => e?.src);
		if (!n.length) return;
		e.classList.add("urd-bg-galleri"), e.style.opacity = String(t.opacity ?? 1), t.blur > 0 && (e.style.filter = `blur(${t.blur}px)`, e.style.inset = `-${t.blur * 2}px`);
		let r = Math.max(0, Number(t.fade) || 0);
		e.style.setProperty("--urd-bgg-fade", `${r}s`);
		let i = (e, n) => {
			e.style.backgroundImage = `url("${n.src}")`, e.style.backgroundSize = fs(t.fit), e.style.backgroundRepeat = "no-repeat", e.style.backgroundPosition = ds(n.x, n.y);
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
		if (!Ns({
			count: n.length,
			reducedMotion: s
		})) return;
		let c = document.createElement("div");
		c.className = "urd-bg-slide", e.appendChild(c);
		let l = 0, u = o, d = Math.max(Ps(t.interval, { fallback: 6 }), r + .5) * 1e3, f = setInterval(() => {
			if (!e.isConnected) {
				clearInterval(f);
				return;
			}
			if (document.hidden) return;
			let t = Ms(l, 1, n.length), r = new Image();
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
};
//#endregion
//#region ../template/assets/engine/0.6.11/footer-thumb.js
function Is(e = {}) {
	let t = "#2fd6b6", n = "#5c6b64", r = e.mega ? "#16221d" : "#0e1512", i = e.cols ?? 0, a = e.social ?? 0, o = `<svg viewBox="0 0 160 80" preserveAspectRatio="none" aria-hidden="true"><rect width="160" height="80" fill="${r}"/>`;
	if (e.mega && (o += `<circle cx="20" cy="6" r="34" fill="${t}" opacity="0.18"/>`), e.bigcta) return o += `<rect x="45" y="18" width="70" height="8" rx="3" fill="${n}" opacity="0.85"/>`, o += `<rect x="56" y="32" width="48" height="4" rx="2" fill="${n}" opacity="0.5"/>`, o += `<rect x="62" y="43" width="36" height="10" rx="3" fill="${t}"/>`, o += Ls(n, e.baselineLinks), o + "</svg>";
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
	return o += Ls(n, e.baselineLinks), o + "</svg>";
}
function Ls(e, t = 0) {
	let n = `<line x1="8" y1="66" x2="152" y2="66" stroke="${e}" stroke-width="0.6" opacity="0.5"/>`;
	return n += `<rect x="8" y="70" width="40" height="3" rx="1.5" fill="${e}" opacity="0.6"/>`, t && (n += `<g fill="${e}" opacity="0.6">` + Array.from({ length: t }, (e, t) => `<rect x="${120 - t * 16}" y="70" width="12" height="3" rx="1.5"/>`).join("") + "</g>"), n;
}
//#endregion
//#region ../template/assets/engine/0.6.11/animations/core.js
var Rs = () => ({
	duration: 600,
	delay: 0
}), zs = {
	"fade-in": {
		version: 1,
		label: "Ton inn",
		labelKey: "anim.fadeIn",
		entrance: !0,
		defaults: Rs,
		migrations: {}
	},
	"slide-up": {
		version: 1,
		label: "Gli opp",
		labelKey: "anim.slideUp",
		entrance: !0,
		defaults: Rs,
		migrations: {}
	},
	"zoom-in": {
		version: 1,
		label: "Zoom inn",
		labelKey: "anim.zoomIn",
		entrance: !0,
		defaults: Rs,
		migrations: {}
	},
	"hover-lift": {
		version: 1,
		label: "Løft ved peker",
		labelKey: "anim.hoverLift",
		entrance: !1,
		defaults: () => ({}),
		migrations: {}
	},
	stagger: {
		version: 1,
		label: "Stagger (kortgruppe)",
		labelKey: "anim.stagger",
		entrance: !0,
		group: !0,
		defaults: () => ({
			duration: 600,
			delay: 0,
			step: 90,
			effect: "slide-up",
			pattern: "sequence"
		}),
		migrations: {}
	}
}, Bs = [
	["font.system", "system-ui, sans-serif"],
	["font.arial", "Arial, Helvetica, sans-serif"],
	["font.verdana", "Verdana, Geneva, sans-serif"],
	["font.trebuchet", "'Trebuchet MS', sans-serif"],
	["font.georgia", "Georgia, 'Times New Roman', serif"],
	["font.palatino", "'Palatino Linotype', Palatino, serif"],
	["font.courier", "'Courier New', monospace"]
];
//#endregion
//#region ../template/assets/engine/0.6.11/place.js
function Vs(e) {
	let t = (e) => Math.round(e * 100) / 100, n = Math.max(0, t(100 - e.w)), r = Math.min(n, Math.max(0, t(e.x - e.w / 2))), i = Math.max(0, e.y - e.h / 2), a = e.snap === !1 || e.grid?.snap === !1, o = e.grid?.size || 8;
	return i = a ? Math.round(i) : Math.round(i / o) * o, {
		x: r,
		y: Math.max(0, i)
	};
}
//#endregion
//#region src/App.svelte
var Hs = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), Us = /* @__PURE__ */ H("<button class=\"ghost row-tool svelte-1n46o8q\"></button>"), Ws = /* @__PURE__ */ H("<span><span class=\"grad-grip svelte-1n46o8q\"><svg viewBox=\"0 0 16 16\" width=\"14\" height=\"14\" fill=\"currentColor\" aria-hidden=\"true\"><circle cx=\"5\" cy=\"3\" r=\"1.4\"></circle><circle cx=\"11\" cy=\"3\" r=\"1.4\"></circle><circle cx=\"5\" cy=\"8\" r=\"1.4\"></circle><circle cx=\"11\" cy=\"8\" r=\"1.4\"></circle><circle cx=\"5\" cy=\"13\" r=\"1.4\"></circle><circle cx=\"11\" cy=\"13\" r=\"1.4\"></circle></svg></span> <!> <input type=\"range\" class=\"tb-grow svelte-1n46o8q\" min=\"0\" max=\"100\" step=\"1\"/> <span class=\"gridmenu-value svelte-1n46o8q\"> </span> <!></span>"), Gs = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), Ks = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"360\" step=\"5\" class=\"svelte-1n46o8q\"/>", 1), qs = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <!> <button class=\"ghost action svelte-1n46o8q\"> </button> <!> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <!></label>", 1), Js = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.1\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), Ys = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.01\" max=\"0.3\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), Xs = /* @__PURE__ */ H("<div class=\"sizefill svelte-1n46o8q\"><button type=\"button\" class=\"ghost svelte-1n46o8q\"> </button> <button type=\"button\" class=\"ghost svelte-1n46o8q\"> </button></div> <label class=\"svelte-1n46o8q\"> </label> <div class=\"focalpad svelte-1n46o8q\"><span class=\"focaldot svelte-1n46o8q\"></span></div> <label class=\"sub svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"-0.5\" max=\"1.5\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"sub svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"-0.5\" max=\"1.5\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), Zs = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.1\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <!></label>", 1), Qs = /* @__PURE__ */ H("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> </label> <div class=\"sizestep svelte-1n46o8q\"><button type=\"button\" class=\"svelte-1n46o8q\">−</button> <input type=\"number\" min=\"10\" max=\"400\" class=\"svelte-1n46o8q\"/> <span class=\"sizeunit svelte-1n46o8q\">%</span> <button type=\"button\" class=\"svelte-1n46o8q\">+</button></div> <!> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"20\" step=\"1\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!>", 1), $s = /* @__PURE__ */ H("<span class=\"toolbar-row svelte-1n46o8q\"><img class=\"site-icon-preview svelte-1n46o8q\" alt=\"\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), ec = /* @__PURE__ */ H("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" multiple=\"\" class=\"svelte-1n46o8q\"/></label> <!> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"2\" max=\"120\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"5\" step=\"0.1\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"20\" step=\"1\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <p class=\"panel-hint svelte-1n46o8q\"> </p>", 1), tc = /* @__PURE__ */ H("<div class=\"bg-layer svelte-1n46o8q\"><span class=\"nav-line svelte-1n46o8q\"><!> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span> <!></div>"), nc = /* @__PURE__ */ H("<!> <label class=\"svelte-1n46o8q\"> <!></label> <button class=\"ghost action svelte-1n46o8q\"> </button>", 1), rc = /* @__PURE__ */ H("<input class=\"nav-target svelte-1n46o8q\"/>"), ic = /* @__PURE__ */ H("<div class=\"nav-row nav-sub-row svelte-1n46o8q\"><input class=\"svelte-1n46o8q\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span> <span class=\"nav-target svelte-1n46o8q\"><!></span> <!></div>"), ac = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label>"), oc = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <span class=\"num-stepper svelte-1n46o8q\"><button type=\"button\" class=\"svelte-1n46o8q\">−</button> <input type=\"number\" min=\"1\" max=\"12\" step=\"1\" class=\"svelte-1n46o8q\"/> <button type=\"button\" class=\"svelte-1n46o8q\">+</button></span></label>", 1), sc = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label>", 1), cc = /* @__PURE__ */ H("<p class=\"panel-hint svelte-1n46o8q\"> </p>"), lc = /* @__PURE__ */ H("<span class=\"nav-line svelte-1n46o8q\"><input class=\"svelte-1n46o8q\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span>"), uc = /* @__PURE__ */ H("<label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <p class=\"panel-strong svelte-1n46o8q\"> </p> <!> <button class=\"ghost action svelte-1n46o8q\"> </button>", 1), dc = /* @__PURE__ */ H("<span class=\"nav-line svelte-1n46o8q\"><input class=\"tl-year svelte-1n46o8q\"/> <input class=\"svelte-1n46o8q\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span> <input class=\"svelte-1n46o8q\"/>", 1), fc = /* @__PURE__ */ H("<p class=\"panel-strong svelte-1n46o8q\"> </p> <!> <button class=\"ghost action svelte-1n46o8q\"> </button>", 1), pc = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label>", 1), mc = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label>", 1), hc = /* @__PURE__ */ H("<input class=\"svelte-1n46o8q\"/>"), gc = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <!>", 1), _c = /* @__PURE__ */ H("<label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label>"), vc = /* @__PURE__ */ H("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <!>", 1), yc = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> </label> <input class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label>", 1), bc = /* @__PURE__ */ H("<input class=\"token-input svelte-1n46o8q\" maxlength=\"4\"/>"), xc = /* @__PURE__ */ H("<button class=\"ghost svelte-1n46o8q\"> </button>"), Sc = /* @__PURE__ */ H("<span class=\"toolbar-row svelte-1n46o8q\"><img class=\"site-icon-preview svelte-1n46o8q\"/> <button class=\"ghost svelte-1n46o8q\"> </button></span>"), Cc = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <span class=\"toolbar-row svelte-1n46o8q\"><!> <!></span></label> <!>", 1), wc = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" max=\"100\" class=\"svelte-1n46o8q\"/></label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label>", 1), Tc = /* @__PURE__ */ H("<div class=\"bg-layer svelte-1n46o8q\"><span class=\"toolbar-row svelte-1n46o8q\"><img class=\"site-icon-preview svelte-1n46o8q\" alt=\"\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label></div>"), Ec = /* @__PURE__ */ H("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" multiple=\"\" class=\"svelte-1n46o8q\"/></label> <!>", 1), Dc = /* @__PURE__ */ H("<p> </p>"), Oc = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input type=\"text\" class=\"svelte-1n46o8q\"/></label> <button class=\"ghost svelte-1n46o8q\"> </button> <!>", 1), kc = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input type=\"number\" class=\"svelte-1n46o8q\"/></label>"), Ac = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input type=\"text\" class=\"svelte-1n46o8q\"/></label>"), jc = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), Mc = /* @__PURE__ */ H("<p class=\"panel-strong svelte-1n46o8q\"> </p> <!> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), Nc = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), Pc = /* @__PURE__ */ H("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <!>", 1), Fc = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"svelte-1n46o8q\"> <!></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), Ic = /* @__PURE__ */ H("<label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), Lc = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), Rc = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"1\" max=\"3\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.2\" max=\"2\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.2\" max=\"2\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"2\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <button class=\"ghost action svelte-1n46o8q\"> </button> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), zc = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"8\" max=\"400\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), Bc = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"1\" max=\"6\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"32\" step=\"2\" class=\"svelte-1n46o8q\"/>", 1), Vc = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"2\" max=\"60\" class=\"svelte-1n46o8q\"/></label>"), Hc = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <!> <!> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), Uc = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"1\" max=\"40\" class=\"svelte-1n46o8q\"/></label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), Wc = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"100\" max=\"4000\" step=\"100\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" max=\"4000\" step=\"100\" class=\"svelte-1n46o8q\"/></label>", 1), Gc = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" max=\"400\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label>", 1), Kc = /* @__PURE__ */ H("<hr class=\"gridmenu-divider svelte-1n46o8q\"/> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!>", 1), qc = /* @__PURE__ */ H("<div class=\"frame-grid svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <input type=\"number\" step=\"0.5\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" step=\"1\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" step=\"0.5\" min=\"1\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" step=\"1\" min=\"1\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" step=\"1\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" step=\"1\" class=\"svelte-1n46o8q\"/></label></div>"), Jc = /* @__PURE__ */ H("<!> <label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"svelte-1n46o8q\"> <!></label> <!> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <details class=\"group frame-group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><!> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label></div></details>", 1), Yc = /* @__PURE__ */ H("<div class=\"props-tabs svelte-1n46o8q\"><span class=\"seg svelte-1n46o8q\"><button type=\"button\"> </button> <button type=\"button\"> </button></span></div> <!>", 1), Xc = /* @__PURE__ */ H("<button class=\"chrome-restore svelte-1n46o8q\"><!> </button>"), Zc = /* @__PURE__ */ H("<button class=\"ghost svelte-1n46o8q\"> </button> <span class=\"viewswitch svelte-1n46o8q\"><button></button> <button></button></span> <span class=\"zoomswitch svelte-1n46o8q\"><button></button> <button class=\"ghost svelte-1n46o8q\"></button> <span class=\"zoom-readout svelte-1n46o8q\"> </span> <button class=\"ghost svelte-1n46o8q\"></button></span> <button></button>", 1), Qc = /* @__PURE__ */ H("<button class=\"badge attention svelte-1n46o8q\"><!> </button>"), $c = /* @__PURE__ */ H("<span class=\"badge svelte-1n46o8q\"> </span> <button> </button>", 1), el = /* @__PURE__ */ H("<!> ", 1), tl = /* @__PURE__ */ H("<span class=\"who svelte-1n46o8q\"><!> </span>"), nl = /* @__PURE__ */ H("<a class=\"ghost svelte-1n46o8q\" href=\"/api/github/login\"> </a>"), rl = /* @__PURE__ */ H("<button class=\"ghost svelte-1n46o8q\"><!></button> <!> <a class=\"ghost svelte-1n46o8q\" target=\"_blank\" rel=\"noopener\"> </a> <button class=\"primary svelte-1n46o8q\"> </button>", 1), il = /* @__PURE__ */ H("<hr class=\"rail-sep svelte-1n46o8q\"/>"), al = /* @__PURE__ */ H("<button> </button>"), ol = /* @__PURE__ */ H("<!> <!>", 1), sl = /* @__PURE__ */ H("<div class=\"settings-pop svelte-1n46o8q\"><p class=\"panel-strong svelte-1n46o8q\"> </p> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label></div>"), cl = /* @__PURE__ */ H("<span class=\"page-path svelte-1n46o8q\">/</span>"), ll = /* @__PURE__ */ H("<input class=\"page-slug svelte-1n46o8q\"/>"), ul = /* @__PURE__ */ H("<button class=\"ghost danger svelte-1n46o8q\"><!> </button>"), dl = /* @__PURE__ */ H("<div class=\"page-menu svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"><!> </button> <!></div>"), fl = /* @__PURE__ */ H("<div><input class=\"page-title svelte-1n46o8q\"/> <!> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <span class=\"page-menu-wrap svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <!></span></span></div>"), pl = /* @__PURE__ */ H("<div><button class=\"page-mal-pick svelte-1n46o8q\"><span class=\"page-mal-thumb svelte-1n46o8q\"></span> <span class=\"page-mal-name svelte-1n46o8q\"> </span></button></div>"), ml = /* @__PURE__ */ H("<div><button class=\"page-mal-pick svelte-1n46o8q\"><span class=\"page-mal-thumb svelte-1n46o8q\"></span> <span class=\"page-mal-name svelte-1n46o8q\"> </span></button> <button class=\"page-mal-del svelte-1n46o8q\"></button></div>"), hl = /* @__PURE__ */ H("<span class=\"mini-label svelte-1n46o8q\"> </span> <div class=\"page-mal-grid svelte-1n46o8q\"></div>", 1), gl = /* @__PURE__ */ H("<div class=\"panel-body svelte-1n46o8q\"><!> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <input class=\"svelte-1n46o8q\"/> <button class=\"ghost action svelte-1n46o8q\"> </button> <span class=\"mini-label svelte-1n46o8q\"> </span> <div class=\"page-mal-grid svelte-1n46o8q\"><div><button class=\"page-mal-pick svelte-1n46o8q\"><span class=\"page-mal-thumb svelte-1n46o8q\"></span> <span class=\"page-mal-name svelte-1n46o8q\"> </span></button></div> <!></div> <!></div>"), _l = /* @__PURE__ */ H("<input class=\"svelte-1n46o8q\"/> <span class=\"toolbar-row svelte-1n46o8q\"><!> <input type=\"number\" class=\"tb-num svelte-1n46o8q\" min=\"8\" max=\"96\" placeholder=\"px\"/> <button><b> </b></button> <button><i> </i></button></span>", 1), vl = /* @__PURE__ */ H("<span class=\"toolbar-row svelte-1n46o8q\"><label class=\"ghost filepick tb-grow svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <input type=\"number\" class=\"tb-num svelte-1n46o8q\" min=\"12\" max=\"128\"/> <input type=\"number\" class=\"tb-num svelte-1n46o8q\" min=\"0\" max=\"64\"/></span>"), yl = /* @__PURE__ */ H("<label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label>", 1), bl = /* @__PURE__ */ H("<label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!>", 1), xl = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.1\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), Sl = /* @__PURE__ */ H("<div class=\"nav-row svelte-1n46o8q\"><input class=\"svelte-1n46o8q\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span> <span class=\"nav-target svelte-1n46o8q\"><!></span> <!></div> <!>", 1), Cl = /* @__PURE__ */ H("<div class=\"panel-body svelte-1n46o8q\"><details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <!></label> <!> <!> <!></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <!></label> <!> <!> <!> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"svelte-1n46o8q\"> <!></label> <!> <!> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <p class=\"panel-strong svelte-1n46o8q\"> </p> <!></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"1\" max=\"4\" class=\"svelte-1n46o8q\"/></label></div></details> <details class=\"group svelte-1n46o8q\" open=\"\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><!> <button class=\"ghost action svelte-1n46o8q\"> </button></div></details></div>"), wl = /* @__PURE__ */ H("<img class=\"site-icon-preview svelte-1n46o8q\"/>"), Tl = /* @__PURE__ */ H("<button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button>", 1), El = /* @__PURE__ */ H("<div class=\"panel-body svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <!></label> <span class=\"toolbar-row svelte-1n46o8q\"><label class=\"ghost filepick tb-grow svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <!></span></div>"), Dl = /* @__PURE__ */ H("<div class=\"mini-label tpv-cap svelte-1n46o8q\"> </div>"), Ol = /* @__PURE__ */ H("<div class=\"theme-pvw svelte-1n46o8q\"><!> <div class=\"tpv-demo svelte-1n46o8q\"><div class=\"tpv-h svelte-1n46o8q\"> </div> <div class=\"tpv-card svelte-1n46o8q\"> </div> <div class=\"tpv-row svelte-1n46o8q\"><span class=\"tpv-btn svelte-1n46o8q\"> </span><span class=\"tpv-lnk svelte-1n46o8q\"> </span></div></div></div>"), kl = /* @__PURE__ */ H("<button type=\"button\"><span class=\"tp-band svelte-1n46o8q\"><i class=\"svelte-1n46o8q\"></i><i class=\"svelte-1n46o8q\"></i><i class=\"svelte-1n46o8q\"></i><i class=\"svelte-1n46o8q\"></i></span> <small class=\"svelte-1n46o8q\"> </small></button>"), Al = /* @__PURE__ */ H("<div class=\"ctl-row autorow svelte-1n46o8q\"><span class=\"autolbl svelte-1n46o8q\"> </span> <span class=\"seg svelte-1n46o8q\"><button type=\"button\"> </button> <button type=\"button\"> </button></span></div>"), jl = /* @__PURE__ */ H("<span class=\"mini-label svelte-1n46o8q\"> </span>"), Ml = /* @__PURE__ */ H("<div class=\"palcol svelte-1n46o8q\"><!> <span class=\"palcap svelte-1n46o8q\"> </span> <b class=\"palhex svelte-1n46o8q\"> </b></div>"), Nl = /* @__PURE__ */ H("<div class=\"ctl-row palhead svelte-1n46o8q\"><span class=\"mini-label svelte-1n46o8q\"> </span> <button type=\"button\"> </button></div> <div></div>", 1), Pl = /* @__PURE__ */ H("<div class=\"panel-body svelte-1n46o8q\"><p class=\"panel-strong svelte-1n46o8q\"> </p> <div class=\"theme-presets svelte-1n46o8q\"></div> <p class=\"panel-strong svelte-1n46o8q\"> </p> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!> <div class=\"ctl-row palhead svelte-1n46o8q\"><!> <button type=\"button\"> </button></div> <div class=\"palcells svelte-1n46o8q\"></div> <!> <div class=\"theme-previews svelte-1n46o8q\"><!> <!></div> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <div class=\"sample typo-sample svelte-1n46o8q\"><div class=\"ts-h svelte-1n46o8q\"> </div> <div class=\"ts-b svelte-1n46o8q\"> </div></div></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><div class=\"sample form-prev svelte-1n46o8q\"><span class=\"fp-btn svelte-1n46o8q\"> </span> <span class=\"fp-card svelte-1n46o8q\"> </span></div> <label class=\"ctl-row svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"24\" step=\"1\" class=\"svelte-1n46o8q\"/> <label class=\"ctl-row svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"40\" step=\"1\" class=\"svelte-1n46o8q\"/></div></details></div>"), Fl = /* @__PURE__ */ H("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label>"), Il = /* @__PURE__ */ H("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" multiple=\"\" class=\"svelte-1n46o8q\"/></label>"), Ll = /* @__PURE__ */ H("<details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"></div></details>"), Rl = /* @__PURE__ */ H("<details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button></div></details> <button class=\"ghost svelte-1n46o8q\"> </button> <label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"> </button> <label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" multiple=\"\" class=\"svelte-1n46o8q\"/></label></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button></div></details> <!> <!>", 1), zl = /* @__PURE__ */ H("<div><input type=\"text\" class=\"svelte-1n46o8q\"/> <!></div>"), Bl = /* @__PURE__ */ H("<div class=\"panel-body svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"4\" max=\"96\" step=\"2\" class=\"svelte-1n46o8q\"/> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label></div>"), Vl = /* @__PURE__ */ H("<p class=\"panel-strong svelte-1n46o8q\"> </p> <!>", 1), Hl = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"4\" max=\"96\" step=\"2\" class=\"svelte-1n46o8q\"/>", 1), Ul = /* @__PURE__ */ H("<button><span class=\"rs-sample svelte-1n46o8q\"><i class=\"rs-line svelte-1n46o8q\"></i> <i class=\"rs-chip svelte-1n46o8q\"></i> <i class=\"rs-dot svelte-1n46o8q\"></i></span> <span class=\"rs-name svelte-1n46o8q\"> </span></button>"), Wl = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" max=\"1000\" step=\"10\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label>", 1), Gl = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"100\" max=\"4000\" step=\"100\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" max=\"4000\" step=\"100\" class=\"svelte-1n46o8q\"/></label> <!>", 1), Kl = /* @__PURE__ */ H("<p class=\"panel-strong svelte-1n46o8q\"> </p> <label class=\"svelte-1n46o8q\"> <input class=\"token-input svelte-1n46o8q\"/></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <p class=\"panel-strong svelte-1n46o8q\"> </p> <div class=\"rs-grid svelte-1n46o8q\"></div> <label class=\"svelte-1n46o8q\"> <span class=\"row-tools svelte-1n46o8q\"><span class=\"gridmenu-value svelte-1n46o8q\"> </span> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <p class=\"panel-strong svelte-1n46o8q\"> </p> <!> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"svelte-1n46o8q\"> <!></label>", 1), ql = /* @__PURE__ */ H("<div class=\"panel-body svelte-1n46o8q\"><!></div>"), Jl = /* @__PURE__ */ H("<button class=\"footer-tp svelte-1n46o8q\"><span class=\"footer-tp-thumb svelte-1n46o8q\"></span> <span class=\"footer-tp-name svelte-1n46o8q\"> </span></button>"), Yl = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"16\" max=\"160\" step=\"2\" class=\"svelte-1n46o8q\"/>", 1), Xl = /* @__PURE__ */ H("<span class=\"toolbar-row svelte-1n46o8q\"><label class=\"ghost filepick tb-grow svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <!></span> <!>", 1), Zl = /* @__PURE__ */ H("<div class=\"nav-row svelte-1n46o8q\"><input class=\"svelte-1n46o8q\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></div> <!>", 1), Ql = /* @__PURE__ */ H("<div class=\"nav-row svelte-1n46o8q\"><span class=\"nav-line svelte-1n46o8q\"><span class=\"footer-soc-preview svelte-1n46o8q\" aria-hidden=\"true\"></span> <!></span> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span> <input class=\"nav-target svelte-1n46o8q\"/></div>"), $l = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <!>", 1), eu = /* @__PURE__ */ H("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <!>", 1), tu = /* @__PURE__ */ H("<div class=\"panel-body svelte-1n46o8q\"><label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><div class=\"footer-tpick svelte-1n46o8q\"></div></div></details> <details class=\"group svelte-1n46o8q\" open=\"\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <!></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><!> <button class=\"ghost action svelte-1n46o8q\"> </button> <label class=\"svelte-1n46o8q\"> <!></label></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><!> <button class=\"ghost action svelte-1n46o8q\"> </button></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><!> <button class=\"ghost action svelte-1n46o8q\"> </button></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><!> <p class=\"panel-strong svelte-1n46o8q\"> </p> <!></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <p class=\"panel-strong svelte-1n46o8q\"> </p> <!> <button class=\"ghost action svelte-1n46o8q\"> </button></div></details></div>"), nu = /* @__PURE__ */ H("<img class=\"site-icon-preview svelte-1n46o8q\" alt=\"\"/> <button class=\"ghost row-tool svelte-1n46o8q\"></button>", 1), ru = /* @__PURE__ */ H("<details class=\"group samling-entry svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><span class=\"toolbar-row svelte-1n46o8q\"><input class=\"svelte-1n46o8q\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span> <label class=\"svelte-1n46o8q\"> <input type=\"date\" class=\"svelte-1n46o8q\"/></label> <textarea rows=\"3\" class=\"svelte-1n46o8q\"></textarea> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <span class=\"toolbar-row svelte-1n46o8q\"><label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <!></span></div></details>"), iu = /* @__PURE__ */ H("<span class=\"toolbar-row svelte-1n46o8q\"><button class=\"ghost action svelte-1n46o8q\"> </button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span> <!> <!> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), au = /* @__PURE__ */ H("<div class=\"panel-body svelte-1n46o8q\"><!> <!> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <button class=\"ghost action svelte-1n46o8q\"> </button></div>"), ou = /* @__PURE__ */ H("<span class=\"plugin-meta svelte-1n46o8q\"> </span>"), su = /* @__PURE__ */ H("<p class=\"panel-hint plugin-warn svelte-1n46o8q\"> </p>"), cu = /* @__PURE__ */ H("<div><span class=\"plugin-head svelte-1n46o8q\"><span class=\"plugin-name svelte-1n46o8q\"> </span> <!> <span class=\"row-tools svelte-1n46o8q\"><label class=\"gridmenu-snap plugin-toggle svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span> <!> <!></div>"), lu = /* @__PURE__ */ H("<div class=\"plugin-row svelte-1n46o8q\"><span class=\"plugin-head svelte-1n46o8q\"><span class=\"plugin-name svelte-1n46o8q\"> </span> <!> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span></div>"), uu = /* @__PURE__ */ H("<hr class=\"gridmenu-divider svelte-1n46o8q\"/> <p class=\"panel-strong svelte-1n46o8q\"> </p> <!>", 1), du = /* @__PURE__ */ H("<hr class=\"gridmenu-divider svelte-1n46o8q\"/> <input class=\"svelte-1n46o8q\"/> <button class=\"ghost action svelte-1n46o8q\"> </button> <!>", 1), fu = /* @__PURE__ */ H("<div class=\"panel-body svelte-1n46o8q\"><!> <!> <!> <!></div>"), pu = /* @__PURE__ */ H("<div><span class=\"history-msg svelte-1n46o8q\"> </span> <span class=\"history-meta svelte-1n46o8q\"> </span></div>"), mu = /* @__PURE__ */ H("<button class=\"ghost svelte-1n46o8q\"> </button> <!>", 1), hu = /* @__PURE__ */ H("<p class=\"panel-hint svelte-1n46o8q\"> </p> <button class=\"ghost svelte-1n46o8q\"> </button>", 1), gu = /* @__PURE__ */ H("<span class=\"update-arrow svelte-1n46o8q\"></span> <span class=\"badge svelte-1n46o8q\"> </span>", 1), _u = /* @__PURE__ */ H("<details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><p class=\"update-notes svelte-1n46o8q\"> </p></div></details>"), vu = /* @__PURE__ */ H("<details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"><span class=\"update-warn svelte-1n46o8q\"></span> </summary> <div class=\"group-items svelte-1n46o8q\"><pre class=\"update-headers svelte-1n46o8q\"> </pre></div></details>"), yu = /* @__PURE__ */ H("<span class=\"chip svelte-1n46o8q\"> </span>"), bu = /* @__PURE__ */ H("<div class=\"update-row svelte-1n46o8q\"><span class=\"update-path svelte-1n46o8q\"> </span> <span class=\"update-flags svelte-1n46o8q\"><!> <span class=\"update-warn svelte-1n46o8q\"></span></span></div>"), xu = /* @__PURE__ */ H("<div class=\"update-row svelte-1n46o8q\"><span class=\"update-path svelte-1n46o8q\"> </span> <!></div>"), Su = /* @__PURE__ */ H("<span class=\"update-warn svelte-1n46o8q\"></span>"), Cu = /* @__PURE__ */ H("<div class=\"update-row svelte-1n46o8q\"><span> </span> <span class=\"update-flags svelte-1n46o8q\"><!> <!> <input type=\"checkbox\" class=\"svelte-1n46o8q\"/></span></div>"), wu = /* @__PURE__ */ H("<div class=\"ctl-row update-opt-head svelte-1n46o8q\"><p class=\"panel-strong svelte-1n46o8q\"> </p> <span class=\"mini-label svelte-1n46o8q\"> </span></div> <!>", 1), Tu = /* @__PURE__ */ H("<p class=\"update-summary svelte-1n46o8q\"> </p> <!> <!> <!> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"></div></details> <!> <button class=\"primary update-run svelte-1n46o8q\"> </button>", 1), Eu = /* @__PURE__ */ H("<div class=\"update-versions svelte-1n46o8q\"><span class=\"update-from svelte-1n46o8q\"> </span> <!></div> <!>", 1), Du = /* @__PURE__ */ H("<aside class=\"panel svelte-1n46o8q\"><h2 class=\"svelte-1n46o8q\"> </h2> <!></aside>"), Ou = /* @__PURE__ */ H("<nav class=\"rail svelte-1n46o8q\"><!> <span class=\"rail-settings svelte-1n46o8q\"><button></button> <!></span></nav> <!>", 1), ku = /* @__PURE__ */ H("<div class=\"workspace svelte-1n46o8q\"><!> <div><div class=\"stage svelte-1n46o8q\"><iframe class=\"svelte-1n46o8q\"></iframe></div></div></div>"), Au = /* @__PURE__ */ H("<p class=\"loading svelte-1n46o8q\"> </p>"), ju = /* @__PURE__ */ H("<p class=\"panel-hint confirm-line svelte-1n46o8q\"> </p>"), Mu = /* @__PURE__ */ H("<div class=\"setup-overlay svelte-1n46o8q\"><div class=\"setup-card svelte-1n46o8q\"><h2 class=\"svelte-1n46o8q\"> </h2> <!> <!> <span class=\"setup-actions svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"primary svelte-1n46o8q\"> </button></span></div></div>"), Nu = /* @__PURE__ */ H("<div class=\"setup-overlay svelte-1n46o8q\"><div class=\"setup-card svelte-1n46o8q\"><h2 class=\"svelte-1n46o8q\"> </h2> <p class=\"panel-hint svelte-1n46o8q\"> </p> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <p class=\"panel-hint svelte-1n46o8q\"> </p> <span class=\"setup-actions svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"primary svelte-1n46o8q\"> </button></span></div></div>"), Pu = /* @__PURE__ */ H("<div><span> </span> <button class=\"toast-x svelte-1n46o8q\">×</button></div>"), Fu = /* @__PURE__ */ H("<div class=\"block-menu svelte-1n46o8q\"><header class=\"block-menu-head svelte-1n46o8q\"><span> </span> <button class=\"ghost row-tool svelte-1n46o8q\"></button></header> <div class=\"panel-body block-menu-body svelte-1n46o8q\"><!></div></div>"), Iu = /* @__PURE__ */ H("<div class=\"editor svelte-1n46o8q\"><!> <header><span class=\"topbar-group svelte-1n46o8q\"><span class=\"brand svelte-1n46o8q\" title=\"Urd\"><svg class=\"brand-mark svelte-1n46o8q\" viewBox=\"0 0 40 40\" aria-hidden=\"true\"><path d=\"M12 32V10l16 6.5V32\" fill=\"none\" stroke=\"var(--urd-brand)\" stroke-width=\"3.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg> <span class=\"brand-word svelte-1n46o8q\">Urd</span></span> <!> <!> <!></span> <span class=\"topbar-group topbar-right svelte-1n46o8q\"><!></span></header> <!> <!> <!> <!> <!></div>   <!>", 1);
function Lu(e, t) {
	Ge(t, !0);
	let n = (e, t = d, n = d) => {
		var r = nc(), i = L(r);
		Hr(i, 17, n, Rr, (e, r, i) => {
			var a = tc(), s = I(a), l = I(s);
			{
				let e = /* @__PURE__ */ N(() => X("tip.bg.changeType")), n = /* @__PURE__ */ N(() => o.map(([e, t]) => [e, t.labelKey ? X(t.labelKey) : t.label]));
				Z(l, {
					get value() {
						return B(r).type;
					},
					get title() {
						return B(e);
					},
					get options() {
						return B(n);
					},
					onchange: (e) => On(t(), i, e)
				});
			}
			var u = R(l, 2), d = I(u);
			d.disabled = i === 0, K(d, () => c.up, !0), A(d);
			var f = R(d, 2);
			K(f, () => c.down, !0), A(f);
			var p = R(f, 2);
			K(p, () => c.cross, !0), A(p), A(u), A(s);
			var m = R(s, 2), h = (e) => {
				var n = Hs(), a = L(n), o = I(a), s = R(o);
				{
					let e = /* @__PURE__ */ N(Vn), n = /* @__PURE__ */ N(() => X("tip.bg.layerColor"));
					Wi(s, {
						get value() {
							return B(r).props.value;
						},
						get tokens() {
							return B(e);
						},
						get label() {
							return B(n);
						},
						onchange: (e) => un(t(), i, "value", e)
					});
				}
				A(a);
				var c = R(a, 2), l = I(c), u = R(l), d = I(u);
				A(u), A(c);
				var f = R(c, 2);
				q(f), z((e, t, n) => {
					W(o, `${e ?? ""} `), W(l, `${t ?? ""} `), W(d, `${n ?? ""}%`), J(f, B(r).props.opacity ?? 1);
				}, [
					() => X("lbl.color"),
					() => X("lbl.strength"),
					() => Math.round((B(r).props.opacity ?? 1) * 100)
				]), V("input", f, (e) => un(t(), i, "opacity", Number(e.target.value))), U(e, n);
			}, g = (e) => {
				let n = /* @__PURE__ */ N(() => gn(B(r))), a = /* @__PURE__ */ N(() => B(n).stops.reduce((e, t) => e + Math.max(0, Number(t.share) || 0), 0));
				var o = qs(), s = L(o), l = I(s), u = R(l);
				{
					let e = /* @__PURE__ */ N(() => B(n).kind ?? "linear"), r = /* @__PURE__ */ N(() => [["linear", X("opt.grad.linear")], ["radial", X("opt.grad.radial")]]);
					Z(u, {
						get value() {
							return B(e);
						},
						get options() {
							return B(r);
						},
						onchange: (e) => bn(t(), i, e)
					});
				}
				A(s);
				var d = R(s, 2);
				Hr(d, 17, () => B(n).stops, Rr, (e, r, o) => {
					var s = Ws();
					let l;
					var u = I(s), d = R(u, 2);
					{
						let e = /* @__PURE__ */ N(Vn), n = /* @__PURE__ */ N(() => X("tip.bg.stopColor"));
						Wi(d, {
							get value() {
								return B(r).color;
							},
							get tokens() {
								return B(e);
							},
							get label() {
								return B(n);
							},
							onchange: (e) => Sn(t(), i, o, { color: e })
						});
					}
					var f = R(d, 2);
					q(f);
					var p = R(f, 2), m = I(p);
					A(p);
					var h = R(p, 2), g = (e) => {
						var n = Us();
						K(n, () => c.cross, !0), A(n), z((e) => Y(n, "title", e), [() => X("tip.bg.removeStop")]), V("click", n, () => wn(t(), i, o)), U(e, n);
					};
					G(h, (e) => {
						B(n).stops.length > 2 && e(g);
					}), A(s), z((e, t, a) => {
						l = $r(s, 1, "nav-line grad-stop svelte-1n46o8q", null, l, {
							dragging: B(En)?.layer === i && B(En).from === o,
							"drop-above": B(En)?.layer === i && B(En).insert === o,
							"drop-below": B(En)?.layer === i && B(En).insert === B(n).stops.length && o === B(n).stops.length - 1
						}), Y(u, "title", e), J(f, B(r).share ?? 50), Y(f, "title", t), W(m, `${a ?? ""}%`);
					}, [
						() => X("tip.bg.dragStop"),
						() => X("tip.bg.stopShare"),
						() => B(a) > 0 ? Math.round(Math.max(0, Number(B(r).share) || 0) / B(a) * 100) : Math.round(100 / B(n).stops.length)
					]), V("pointerdown", u, (e) => Dn(t(), e, i, o)), V("input", f, (e) => Sn(t(), i, o, { share: Number(e.target.value) })), U(e, s);
				});
				var f = R(d, 2), p = I(f, !0);
				A(f);
				var m = R(f, 2), h = (e) => {
					var r = Gs(), a = L(r), o = I(a), s = R(o), c = I(s);
					A(s), A(a);
					var l = R(a, 2);
					q(l);
					var u = R(l, 2), d = I(u), f = R(d), p = I(f);
					A(f), A(u);
					var m = R(u, 2);
					q(m), z((e, t, r, i) => {
						W(o, `${e ?? ""} `), W(c, `${t ?? ""}%`), J(l, B(n).x ?? .5), W(d, `${r ?? ""} `), W(p, `${i ?? ""}%`), J(m, B(n).y ?? .5);
					}, [
						() => X("lbl.centerX"),
						() => Math.round((B(n).x ?? .5) * 100),
						() => X("lbl.centerY"),
						() => Math.round((B(n).y ?? .5) * 100)
					]), V("input", l, (e) => vn(t(), i, "x", Number(e.target.value))), V("input", m, (e) => vn(t(), i, "y", Number(e.target.value))), U(e, r);
				}, g = (e) => {
					var r = Ks(), a = L(r), o = I(a), s = R(o), c = I(s);
					A(s), A(a);
					var l = R(a, 2);
					q(l), z((e) => {
						W(o, `${e ?? ""} `), W(c, `${B(n).angle ?? ""}°`), J(l, B(n).angle);
					}, [() => X("lbl.angle")]), V("input", l, (e) => vn(t(), i, "angle", Number(e.target.value))), U(e, r);
				};
				G(m, (e) => {
					(B(n).kind ?? "linear") === "radial" ? e(h) : e(g, -1);
				});
				var _ = R(m, 2), v = I(_), y = R(v), b = I(y);
				A(y), A(_);
				var x = R(_, 2);
				q(x);
				var S = R(x, 2), C = I(S), w = R(C);
				{
					let e = /* @__PURE__ */ N(() => B(n).animation ?? "none");
					Z(w, {
						get value() {
							return B(e);
						},
						get options() {
							return yn[(B(n).kind ?? "linear") === "radial" ? "radial" : "linear"];
						},
						onchange: (e) => vn(t(), i, "animation", e)
					});
				}
				A(S), z((e, t, r, i, a, o, s) => {
					W(l, `${e ?? ""} `), Y(f, "title", t), W(p, r), W(v, `${i ?? ""} `), W(b, `${a ?? ""}%`), J(x, B(n).opacity ?? 1), Y(S, "title", o), W(C, `${s ?? ""} `);
				}, [
					() => X("blocks.shape"),
					() => X("tip.bg.addStop"),
					() => X("ui.addStop"),
					() => X("lbl.strength"),
					() => Math.round((B(n).opacity ?? 1) * 100),
					() => X("tip.bg.motion"),
					() => X("lbl.motion")
				]), V("click", f, () => Cn(t(), i)), V("input", x, (e) => vn(t(), i, "opacity", Number(e.target.value))), U(e, o);
			}, _ = (e) => {
				var n = Js(), a = L(n), o = I(a), s = R(o);
				{
					let e = /* @__PURE__ */ N(Vn), n = /* @__PURE__ */ N(() => X("tip.bg.glowColor"));
					Wi(s, {
						get value() {
							return B(r).props.color;
						},
						get tokens() {
							return B(e);
						},
						get label() {
							return B(n);
						},
						onchange: (e) => un(t(), i, "color", e)
					});
				}
				A(a);
				var c = R(a, 2), l = I(c), u = R(l), d = I(u);
				A(u), A(c);
				var f = R(c, 2);
				q(f);
				var p = R(f, 2), m = I(p), h = R(m), g = I(h);
				A(h), A(p);
				var _ = R(p, 2);
				q(_);
				var v = R(_, 2), y = I(v), b = R(y), x = I(b);
				A(b), A(v);
				var S = R(v, 2);
				q(S);
				var C = R(S, 2), w = I(C), T = R(w), ee = I(T);
				A(T), A(C);
				var E = R(C, 2);
				q(E), z((e, t, n, i, a, s, c, u, p) => {
					W(o, `${e ?? ""} `), W(l, `${t ?? ""} `), W(d, `${n ?? ""}%`), J(f, B(r).props.x), W(m, `${i ?? ""} `), W(g, `${a ?? ""}%`), J(_, B(r).props.y), W(y, `${s ?? ""} `), W(x, `${c ?? ""}%`), J(S, B(r).props.radius), W(w, `${u ?? ""} `), W(ee, `${p ?? ""}%`), J(E, B(r).props.opacity);
				}, [
					() => X("lbl.color"),
					() => X("lbl.posX"),
					() => Math.round(B(r).props.x * 100),
					() => X("lbl.posY"),
					() => Math.round(B(r).props.y * 100),
					() => X("lbl.size"),
					() => Math.round(B(r).props.radius * 100),
					() => X("lbl.strength"),
					() => Math.round(B(r).props.opacity * 100)
				]), V("input", f, (e) => un(t(), i, "x", Number(e.target.value))), V("input", _, (e) => un(t(), i, "y", Number(e.target.value))), V("input", S, (e) => un(t(), i, "radius", Number(e.target.value))), V("input", E, (e) => un(t(), i, "opacity", Number(e.target.value))), U(e, n);
			}, v = (e) => {
				var n = Ys(), a = L(n), o = I(a), s = R(o), c = I(s);
				A(s), A(a);
				var l = R(a, 2);
				q(l), z((e, t) => {
					W(o, `${e ?? ""} `), W(c, `${t ?? ""}%`), J(l, B(r).props.opacity);
				}, [() => X("lbl.strength"), () => Math.round(B(r).props.opacity * 100)]), V("input", l, (e) => un(t(), i, "opacity", Number(e.target.value))), U(e, n);
			}, y = (e) => {
				let n = /* @__PURE__ */ N(() => B(r).props.fit === "flislegg" || B(r).props.fit === "repeat");
				var a = Qs(), o = L(a), s = I(o), c = R(s);
				A(o);
				var l = R(o, 2), u = I(l), d = R(u);
				{
					let e = /* @__PURE__ */ N(() => B(n) ? "flislegg" : "vanlig"), r = /* @__PURE__ */ N(() => [["vanlig", X("opt.img.plain")], ["flislegg", X("opt.img.tile")]]);
					Z(d, {
						get value() {
							return B(e);
						},
						get options() {
							return B(r);
						},
						onchange: (e) => un(t(), i, "fit", e)
					});
				}
				A(l);
				var f = R(l, 2), p = I(f, !0);
				A(f);
				var m = R(f, 2), h = I(m), g = R(h, 2);
				q(g);
				var _ = R(g, 4);
				A(m);
				var v = R(m, 2), y = (e) => {
					var n = Xs(), a = L(n), o = I(a), s = I(o, !0);
					A(o);
					var c = R(o, 2), l = I(c, !0);
					A(c), A(a);
					var u = R(a, 2), d = I(u, !0);
					A(u);
					var f = R(u, 2), p = R(f, 2), m = I(p), h = R(m), g = I(h);
					A(h), A(p);
					var _ = R(p, 2);
					q(_);
					var v = R(_, 2), y = I(v), b = R(y), x = I(b);
					A(b), A(v);
					var S = R(v, 2);
					q(S), z((e, t, n, i, a, p, h, v, b, C, w, T) => {
						Y(o, "title", e), W(s, t), Y(c, "title", n), W(l, i), Y(u, "title", a), W(d, p), ti(f, `--fx:${h ?? ""}%; --fy:${v ?? ""}%`), W(m, `${b ?? ""} `), W(g, `${C ?? ""}%`), J(_, B(r).props.x ?? .5), W(y, `${w ?? ""} `), W(x, `${T ?? ""}%`), J(S, B(r).props.y ?? .5);
					}, [
						() => X("tip.bg.cover"),
						() => X("ui.cover"),
						() => X("opt.fitFrame.contain"),
						() => X("opt.fit.contain"),
						() => X("tip.bg.position"),
						() => X("lbl.position"),
						() => Math.max(0, Math.min(1, B(r).props.x ?? .5)) * 100,
						() => Math.max(0, Math.min(1, B(r).props.y ?? .5)) * 100,
						() => X("lbl.horizontal"),
						() => Math.round((B(r).props.x ?? .5) * 100),
						() => X("lbl.vertical"),
						() => Math.round((B(r).props.y ?? .5) * 100)
					]), V("click", o, () => hn(t(), i, B(r), "cover")), V("click", c, () => hn(t(), i, B(r), "contain")), V("pointerdown", f, (e) => dn(e, t(), i, "xy")), V("input", _, (e) => un(t(), i, "x", Number(e.target.value))), V("input", S, (e) => un(t(), i, "y", Number(e.target.value))), U(e, n);
				};
				G(v, (e) => {
					B(n) || e(y);
				});
				var b = R(v, 2), x = I(b), S = R(x), C = I(S);
				A(S), A(b);
				var w = R(b, 2);
				q(w);
				var T = R(w, 2), ee = I(T), E = R(ee), te = I(E);
				A(E), A(T);
				var ne = R(T, 2);
				q(ne);
				var re = R(ne, 2), ie = I(re);
				q(ie);
				var ae = R(ie);
				A(re);
				var oe = R(re, 2), se = (e) => {
					var n = Zs(), a = L(n), o = I(a), s = R(o), c = I(s);
					A(s), A(a);
					var l = R(a, 2);
					q(l);
					var u = R(l, 2), d = I(u), f = R(d);
					{
						let e = /* @__PURE__ */ N(() => B(r).props.bleed ?? "none"), n = /* @__PURE__ */ N(() => [
							["none", X("common.none")],
							["up", X("opt.bleed.up")],
							["down", X("opt.bleed.down")],
							["both", X("opt.brand.both")]
						]);
						Z(f, {
							get value() {
								return B(e);
							},
							get options() {
								return B(n);
							},
							onchange: (e) => un(t(), i, "bleed", e)
						});
					}
					A(u), z((e, t, n, i) => {
						W(o, `${e ?? ""} `), W(c, `${t ?? ""}%`), J(l, B(r).props.parallax ?? .3), Y(u, "title", n), W(d, `${i ?? ""} `);
					}, [
						() => X("lbl.parallaxStrength"),
						() => Math.round((B(r).props.parallax ?? 0) * 100),
						() => X("tip.bg.bleed"),
						() => X("lbl.bleed")
					]), V("input", l, (e) => un(t(), i, "parallax", Number(e.target.value))), U(e, n);
				};
				G(oe, (e) => {
					(B(r).props.parallax ?? 0) > 0 && e(se);
				}), z((e, t, n, i, a, c, d, m, v, y, b, S, T, E) => {
					Y(o, "title", e), W(s, `${t ?? ""} `), Y(l, "title", n), W(u, `${i ?? ""} `), Y(f, "title", a), W(p, c), Y(h, "title", d), J(g, m), Y(_, "title", v), W(x, `${y ?? ""} `), W(C, `${B(r).props.blur ?? 0 ?? ""} px`), J(w, B(r).props.blur ?? 0), W(ee, `${b ?? ""} `), W(te, `${S ?? ""}%`), J(ne, B(r).props.opacity ?? 1), Y(re, "title", T), oi(ie, (B(r).props.parallax ?? 0) > 0), W(ae, ` ${E ?? ""}`);
				}, [
					() => X("tip.webpAuto"),
					() => B(r).props.src ? X("ui.changeImage") : X("ui.chooseImage"),
					() => X("tip.bg.fit"),
					() => X("lbl.fit"),
					() => X("tip.bg.size"),
					() => X("lbl.size"),
					() => X("tip.smaller"),
					() => Math.round((B(r).props.size ?? 1) * 100),
					() => X("tip.larger"),
					() => X("lbl.blur"),
					() => X("lbl.strength"),
					() => Math.round((B(r).props.opacity ?? 1) * 100),
					() => X("tip.bg.parallax"),
					() => X("lbl.parallax")
				]), V("change", c, (e) => Mn(t(), i, e)), V("click", h, () => pn(t(), i, B(r).props.size ?? 1, -.05)), V("change", g, (e) => mn(t(), i, e.target.value)), V("click", _, () => pn(t(), i, B(r).props.size ?? 1, .05)), V("input", w, (e) => un(t(), i, "blur", Number(e.target.value))), V("input", ne, (e) => un(t(), i, "opacity", Number(e.target.value))), V("change", ie, (e) => un(t(), i, "parallax", e.target.checked ? .3 : 0)), U(e, a);
			}, b = (e) => {
				var n = ec(), a = L(n), o = I(a), s = R(o);
				A(a);
				var l = R(a, 2);
				Hr(l, 17, () => B(r).props.images ?? [], Rr, (e, n, a) => {
					var o = $s(), s = L(o), l = I(s), u = R(l, 2), d = I(u);
					d.disabled = a === 0, K(d, () => c.up, !0), A(d);
					var f = R(d, 2);
					K(f, () => c.down, !0), A(f);
					var p = R(f, 2);
					K(p, () => c.cross, !0), A(p), A(u), A(s);
					var m = R(s, 2), h = I(m), g = R(h), _ = I(g);
					A(g), A(m);
					var v = R(m, 2);
					q(v);
					var y = R(v, 2), b = I(y), x = R(b), S = I(x);
					A(x), A(y);
					var C = R(y, 2);
					q(C), z((e, t, i, o, s) => {
						Y(l, "src", B(n).src), f.disabled = a === B(r).props.images.length - 1, Y(p, "title", e), W(h, `${t ?? ""} `), W(_, `${i ?? ""}%`), J(v, B(n).x ?? .5), W(b, `${o ?? ""} `), W(S, `${s ?? ""}%`), J(C, B(n).y ?? .5);
					}, [
						() => X("tip.removeImage"),
						() => X("lbl.focusX"),
						() => Math.round((B(n).x ?? .5) * 100),
						() => X("lbl.focusY"),
						() => Math.round((B(n).y ?? .5) * 100)
					]), V("click", d, () => Pn(t(), i, a, -1)), V("click", f, () => Pn(t(), i, a, 1)), V("click", p, () => Fn(t(), i, a)), V("input", v, (e) => In(t(), i, a, "x", Number(e.target.value))), V("input", C, (e) => In(t(), i, a, "y", Number(e.target.value))), U(e, o);
				});
				var u = R(l, 2), d = I(u), f = R(d);
				{
					let e = /* @__PURE__ */ N(() => B(r).props.fit ?? "cover"), n = /* @__PURE__ */ N(() => [["cover", X("opt.fit.cover")], ["contain", X("opt.fit.contain")]]);
					Z(f, {
						get value() {
							return B(e);
						},
						get options() {
							return B(n);
						},
						onchange: (e) => un(t(), i, "fit", e)
					});
				}
				A(u);
				var p = R(u, 2), m = I(p), h = R(m);
				q(h), A(p);
				var g = R(p, 2), _ = I(g), v = R(_), y = I(v);
				A(v), A(g);
				var b = R(g, 2);
				q(b);
				var x = R(b, 2), S = I(x), C = R(S), w = I(C);
				A(C), A(x);
				var T = R(x, 2);
				q(T);
				var ee = R(T, 2), E = I(ee), te = R(E), ne = I(te);
				A(te), A(ee);
				var re = R(ee, 2);
				q(re);
				var ie = R(re, 2), ae = I(ie, !0);
				A(ie), z((e, t, n, i, s, c, l, u, f, g, v) => {
					Y(a, "title", e), W(o, `${t ?? ""} `), W(d, `${n ?? ""} `), Y(p, "title", i), W(m, `${s ?? ""} `), J(h, B(r).props.interval ?? 6), W(_, `${c ?? ""} `), W(y, `${l ?? ""} s`), J(b, B(r).props.fade ?? 1.5), W(S, `${u ?? ""} `), W(w, `${B(r).props.blur ?? 0 ?? ""} px`), J(T, B(r).props.blur ?? 0), W(E, `${f ?? ""} `), W(ne, `${g ?? ""}%`), J(re, B(r).props.opacity ?? 1), W(ae, v);
				}, [
					() => X("tip.bg.addImages"),
					() => X("ui.addImages"),
					() => X("lbl.fit"),
					() => X("hint.bg.gallery"),
					() => X("lbl.secondsPerImage"),
					() => X("lbl.transition"),
					() => (B(r).props.fade ?? 1.5).toFixed(1),
					() => X("lbl.blur"),
					() => X("lbl.strength"),
					() => Math.round((B(r).props.opacity ?? 1) * 100),
					() => X("hint.bg.gallery")
				]), V("change", s, (e) => Nn(t(), i, e)), V("change", h, (e) => un(t(), i, "interval", Number(e.target.value))), V("input", b, (e) => un(t(), i, "fade", Number(e.target.value))), V("input", T, (e) => un(t(), i, "blur", Number(e.target.value))), V("input", re, (e) => un(t(), i, "opacity", Number(e.target.value))), U(e, n);
			};
			G(m, (e) => {
				B(r).type === "color" ? e(h) : B(r).type === "gradient" ? e(g, 1) : B(r).type === "glow" ? e(_, 2) : B(r).type === "grain" ? e(v, 3) : B(r).type === "image" ? e(y, 4) : B(r).type === "bildegalleri" && e(b, 5);
			}), A(a), z((e, t, r) => {
				Y(d, "title", e), Y(f, "title", t), f.disabled = i === n().length - 1, Y(p, "title", r);
			}, [
				() => X("hint.bg.order"),
				() => X("hint.bg.order"),
				() => X("tip.bg.removeLayer")
			]), V("click", d, () => ln(t(), i, -1)), V("click", f, () => ln(t(), i, 1)), V("click", p, () => cn(t(), i)), U(e, a);
		});
		var a = R(i, 2), s = I(a), l = R(s);
		{
			let e = /* @__PURE__ */ N(() => o.map(([e, t]) => [e, t.labelKey ? X(t.labelKey) : t.label]));
			Z(l, {
				get value() {
					return B(on);
				},
				get options() {
					return B(e);
				},
				onchange: (e) => F(on, e, !0)
			});
		}
		A(a);
		var u = R(a, 2), f = I(u, !0);
		A(u), z((e, t) => {
			W(s, `${e ?? ""} `), W(f, t);
		}, [() => X("lbl.newLayer"), () => X("ui.addLayer")]), V("click", u, () => sn(t(), B(on))), U(e, r);
	}, r = (e, t = d, n = d) => {
		var r = Mr();
		Hr(L(r), 17, n, Rr, (e, r, i) => {
			var a = ic(), o = I(a);
			q(o);
			var s = R(o, 2), l = I(s);
			l.disabled = i === 0, K(l, () => c.up, !0), A(l);
			var u = R(l, 2);
			K(u, () => c.down, !0), A(u);
			var d = R(u, 2);
			K(d, () => c.cross, !0), A(d), A(s);
			var f = R(s, 2), p = I(f);
			{
				let e = /* @__PURE__ */ N(() => B(r).page ?? "__href"), n = /* @__PURE__ */ N(() => X("tip.linkTarget")), a = /* @__PURE__ */ N(() => [...B(k).pages.map((e) => [e.id, e.title]), ["__href", X("opt.linkHref")]]);
				Z(p, {
					get value() {
						return B(e);
					},
					get title() {
						return B(n);
					},
					get options() {
						return B(a);
					},
					onchange: (e) => wo(t(), i, e)
				});
			}
			A(f);
			var m = R(f, 2), h = (e) => {
				var n = rc();
				q(n), z((e, t) => {
					J(n, B(r).href ?? ""), Y(n, "placeholder", e), Y(n, "title", t);
				}, [() => X("ph.hrefAnchor"), () => X("tip.hrefAnchor")]), V("change", n, (e) => To(t(), i, e.target.value)), U(e, n);
			};
			G(m, (e) => {
				B(r).page || e(h);
			}), A(a), z((e, t) => {
				J(o, B(r).label), Y(o, "title", e), u.disabled = i === n().length - 1, Y(d, "title", t);
			}, [() => X("tip.linkLabel"), () => X("tip.removeLink")]), V("input", o, (e) => Co(t(), i, e.target.value)), V("click", l, () => So(t(), i, -1)), V("click", u, () => So(t(), i, 1)), V("click", d, () => xo(t(), i)), U(e, a);
		}), U(e, r);
	}, i = (e) => {
		let t = /* @__PURE__ */ N(() => B(j).props.boxStyle ?? {});
		var n = sc(), r = L(n), i = I(r), a = R(i);
		{
			let e = /* @__PURE__ */ N(() => B(t).bg ?? ""), n = /* @__PURE__ */ N(Vn), r = /* @__PURE__ */ N(() => X("tip.box.bg"));
			Wi(a, {
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
				onchange: (e) => Dt({ bg: e || null })
			});
		}
		A(r);
		var o = R(r, 2), s = I(o), c = R(s);
		{
			let e = /* @__PURE__ */ N(() => B(t).shadow ?? ""), n = /* @__PURE__ */ N(() => [
				["", X("common.none")],
				["soft", X("opt.shadow.soft")],
				["strong", X("opt.shadow.strong")]
			]);
			Z(c, {
				get value() {
					return B(e);
				},
				get options() {
					return B(n);
				},
				onchange: (e) => Dt({ shadow: e || null })
			});
		}
		A(o);
		var l = R(o, 2), u = (e) => {
			var n = ac(), r = I(n), i = R(r);
			{
				let e = /* @__PURE__ */ N(() => B(t).shadowColor ?? ""), n = /* @__PURE__ */ N(Vn), r = /* @__PURE__ */ N(() => X("tip.box.shadowColor"));
				Wi(i, {
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
					onchange: (e) => Dt({ shadowColor: e || null })
				});
			}
			A(n), z((e) => W(r, `${e ?? ""} `), [() => X("lbl.shadowColor")]), U(e, n);
		};
		G(l, (e) => {
			B(t).shadow && e(u);
		});
		var d = R(l, 2), f = I(d), p = R(f);
		{
			let e = /* @__PURE__ */ N(() => B(t).border === "none" ? "none" : B(t).border ? "custom" : ""), n = /* @__PURE__ */ N(() => [
				["", X("opt.border.theme")],
				["none", X("common.none")],
				["custom", X("opt.border.custom")]
			]);
			Z(p, {
				get value() {
					return B(e);
				},
				get options() {
					return B(n);
				},
				onchange: (e) => Dt({ border: e === "custom" ? {
					color: "accent",
					width: 1
				} : e || null })
			});
		}
		A(d);
		var m = R(d, 2), h = (e) => {
			let n = /* @__PURE__ */ N(() => typeof B(t).border == "object" ? B(t).border : {
				color: "text",
				width: 1
			});
			var r = oc(), i = L(r), a = I(i), o = R(a);
			{
				let e = /* @__PURE__ */ N(Vn), t = /* @__PURE__ */ N(() => X("tip.box.borderColor"));
				Wi(o, {
					get value() {
						return B(n).color;
					},
					get tokens() {
						return B(e);
					},
					get label() {
						return B(t);
					},
					onchange: (e) => Dt({ border: {
						...B(n),
						color: e
					} })
				});
			}
			A(i);
			var s = R(i, 2), c = I(s), l = R(c), u = I(l), d = R(u, 2);
			q(d);
			var f = R(d, 2);
			A(l), A(s), z((e, t, r, i, o, s) => {
				W(a, `${e ?? ""} `), W(c, `${t ?? ""} `), Y(u, "title", r), Y(u, "aria-label", i), J(d, B(n).width), Y(f, "title", o), Y(f, "aria-label", s);
			}, [
				() => X("lbl.borderColor"),
				() => X("lbl.thicknessPx"),
				() => X("tip.thinner"),
				() => X("tip.thinner"),
				() => X("tip.thicker"),
				() => X("tip.thicker")
			]), V("click", u, () => Dt({ border: {
				...B(n),
				width: Math.max(1, B(n).width - 1)
			} })), V("change", d, (e) => Dt({ border: {
				...B(n),
				width: Math.min(12, Math.max(1, Number(e.target.value) || 1))
			} })), V("click", f, () => Dt({ border: {
				...B(n),
				width: Math.min(12, B(n).width + 1)
			} })), U(e, r);
		};
		G(m, (e) => {
			B(t).border !== "none" && e(h);
		});
		var g = R(m, 2), _ = I(g);
		q(_);
		var v = R(_);
		A(g), z((e, t, n, r, a, o) => {
			W(i, `${e ?? ""} `), W(s, `${t ?? ""} `), W(f, `${n ?? ""} `), Y(g, "title", r), oi(_, a), W(v, ` ${o ?? ""}`);
		}, [
			() => X("lbl.blockColor"),
			() => X("lbl.shadow"),
			() => X("lbl.border"),
			() => X("tip.box.glass"),
			() => !!B(t).glass,
			() => X("lbl.glass")
		]), V("change", _, (e) => Dt({ glass: e.target.checked || null })), U(e, n);
	}, a = (e) => {
		var t = Yc(), n = L(t), r = I(n), a = I(r);
		let o;
		var s = I(a, !0);
		A(a);
		var l = R(a, 2);
		let u;
		var d = I(l, !0);
		A(l), A(r), A(n);
		var f = R(n, 2), p = (e) => {
			var t = Mr(), n = L(t), r = (e) => {
				var t = cc(), n = I(t, !0);
				A(t), z((e) => W(n, e), [() => X("hint.textInline")]), U(e, t);
			}, i = (e) => {
				var t = uc(), n = L(t), r = I(n);
				q(r);
				var i = R(r);
				A(n);
				var a = R(n, 2), o = I(a, !0);
				A(a);
				var s = R(a, 2);
				Hr(s, 17, () => B(j).props.items ?? [], Rr, (e, t, n) => {
					var r = lc(), i = I(r);
					q(i);
					var a = R(i, 2), o = I(a);
					o.disabled = n === 0, K(o, () => c.up, !0), A(o);
					var s = R(o, 2);
					K(s, () => c.down, !0), A(s);
					var l = R(s, 2);
					K(l, () => c.cross, !0), A(l), A(a), A(r), z((e, r) => {
						J(i, B(t).q), Y(i, "title", e), s.disabled = n === (B(j).props.items?.length ?? 0) - 1, Y(l, "title", r);
					}, [() => X("tip.faq.question"), () => X("tip.faq.remove")]), V("change", i, (e) => Ot(n, { q: e.target.value })), V("click", o, () => jt(n, -1)), V("click", s, () => jt(n, 1)), V("click", l, () => At(n)), U(e, r);
				});
				var l = R(s, 2), u = I(l, !0);
				A(l), z((e, t, a, s, c) => {
					Y(n, "title", e), oi(r, t), W(i, ` ${a ?? ""}`), W(o, s), W(u, c);
				}, [
					() => X("tip.faq.multi"),
					() => !!B(j).props.multi,
					() => X("lbl.faqMulti"),
					() => X("lbl.questions"),
					() => X("ui.addQuestion")
				]), V("change", r, (e) => M("multi", e.target.checked)), V("click", l, kt), U(e, t);
			}, a = (e) => {
				var t = fc(), n = L(t), r = I(n, !0);
				A(n);
				var i = R(n, 2);
				Hr(i, 17, () => B(j).props.items ?? [], Rr, (e, t, n) => {
					var r = dc(), i = L(r), a = I(i);
					q(a);
					var o = R(a, 2);
					q(o);
					var s = R(o, 2), l = I(s);
					l.disabled = n === 0, K(l, () => c.up, !0), A(l);
					var u = R(l, 2);
					K(u, () => c.down, !0), A(u);
					var d = R(u, 2);
					K(d, () => c.cross, !0), A(d), A(s), A(i);
					var f = R(i, 2);
					q(f), z((e, r, i, s, c, l) => {
						J(a, B(t).year), Y(a, "placeholder", e), Y(a, "title", r), J(o, B(t).title), Y(o, "title", i), u.disabled = n === (B(j).props.items?.length ?? 0) - 1, Y(d, "title", s), J(f, B(t).text), Y(f, "placeholder", c), Y(f, "title", l);
					}, [
						() => X("ph.tlYear"),
						() => X("tip.tl.year"),
						() => X("tip.tl.title"),
						() => X("tip.tl.remove"),
						() => X("ph.tlText"),
						() => X("tip.tl.text")
					]), V("change", a, (e) => Mt(n, { year: e.target.value })), V("change", o, (e) => Mt(n, { title: e.target.value })), V("click", l, () => Ft(n, -1)), V("click", u, () => Ft(n, 1)), V("click", d, () => Pt(n)), V("change", f, (e) => Mt(n, { text: e.target.value })), U(e, r);
				});
				var a = R(i, 2), o = I(a, !0);
				A(a), z((e, t) => {
					W(r, e), W(o, t);
				}, [() => X("lbl.tlItems"), () => X("ui.addTlItem")]), V("click", a, Nt), U(e, t);
			}, o = (e) => {
				var t = pc(), n = L(t), r = I(n), i = R(r);
				q(i), A(n);
				var a = R(n, 2), o = I(a), s = R(o);
				q(s), A(a);
				var c = R(a, 2), l = I(c), u = R(l);
				q(u), A(c), z((e, t, n) => {
					W(r, `${e ?? ""} `), J(i, B(j).props.text ?? ""), W(o, `${t ?? ""} `), J(s, B(j).props.attribution ?? ""), W(l, `${n ?? ""} `), J(u, B(j).props.role ?? "");
				}, [
					() => X("lbl.sitatText"),
					() => X("lbl.sitatName"),
					() => X("lbl.sitatRole")
				]), V("change", i, (e) => M("text", e.target.value)), V("change", s, (e) => M("attribution", e.target.value)), V("change", u, (e) => M("role", e.target.value)), U(e, t);
			}, s = (e) => {
				var t = mc(), n = L(t), r = I(n), i = R(r);
				q(i), A(n);
				var a = R(n, 2), o = I(a), s = R(o);
				q(s), A(a);
				var c = R(a, 2), l = I(c), u = R(l);
				q(u), A(c);
				var d = R(c, 2), f = I(d), p = R(f);
				q(p), A(d), z((e, t, n, a, c) => {
					W(r, `${e ?? ""} `), J(i, B(j).props.value ?? ""), Y(i, "title", t), W(o, `${n ?? ""} `), J(s, B(j).props.prefix ?? ""), W(l, `${a ?? ""} `), J(u, B(j).props.suffix ?? ""), W(f, `${c ?? ""} `), J(p, B(j).props.label ?? "");
				}, [
					() => X("lbl.statValue"),
					() => X("tip.stat.value"),
					() => X("lbl.statPrefix"),
					() => X("lbl.statSuffix"),
					() => X("lbl.statLabel")
				]), V("change", i, (e) => M("value", e.target.value)), V("change", s, (e) => M("prefix", e.target.value)), V("change", u, (e) => M("suffix", e.target.value)), V("change", p, (e) => M("label", e.target.value)), U(e, t);
			}, l = (e) => {
				var t = gc(), n = L(t), r = I(n), i = R(r);
				q(i), A(n);
				var a = R(n, 2), o = I(a), s = R(o);
				{
					let e = /* @__PURE__ */ N(() => B(j).props.page ?? "__href"), t = /* @__PURE__ */ N(() => [...B(k).pages.map((e) => [e.id, e.title]), ["__href", X("opt.externalLink")]]);
					Z(s, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => {
							let t = e === "__href" ? null : e;
							vt(`edit:${B(j).blockId}`, (e) => {
								e.props.page = t, t && (e.props.href = null);
							});
						}
					});
				}
				A(a);
				var c = R(a, 2), l = (e) => {
					var t = hc();
					q(t), z((e) => {
						Y(t, "placeholder", e), J(t, B(j).props.href === "#" ? "" : B(j).props.href ?? "");
					}, [() => X("ph.url")]), V("change", t, (e) => M("href", e.target.value || null)), U(e, t);
				};
				G(c, (e) => {
					B(j).props.page || e(l);
				}), z((e, t) => {
					W(r, `${e ?? ""} `), J(i, B(j).props.label), W(o, `${t ?? ""} `);
				}, [() => X("blocks.text"), () => X("lbl.goesTo")]), V("change", i, (e) => M("label", e.target.value)), U(e, t);
			}, u = (e) => {
				var t = vc(), n = L(t), r = I(n), i = R(r);
				A(n);
				var a = R(n, 2), o = I(a), s = R(o);
				q(s), A(a);
				var c = R(a, 2), l = I(c), u = R(l);
				q(u), A(c);
				var d = R(c, 2), f = (e) => {
					var t = _c(), n = I(t);
					q(n);
					var r = R(n);
					A(t), z((e, i, a) => {
						Y(t, "title", e), oi(n, i), W(r, ` ${a ?? ""}`);
					}, [
						() => X("tip.lightbox"),
						() => !!B(j).props.lightbox,
						() => X("lbl.lightbox")
					]), V("change", n, (e) => M("lightbox", e.target.checked)), U(e, t);
				};
				G(d, (e) => {
					B(j).props.href || e(f);
				}), z((e, t, n, i, a) => {
					W(r, `${e ?? ""} `), W(o, `${t ?? ""} `), J(s, B(j).props.alt ?? ""), Y(s, "placeholder", n), W(l, `${i ?? ""} `), J(u, B(j).props.href ?? ""), Y(u, "placeholder", a);
				}, [
					() => X("ui.changeImage"),
					() => X("lbl.description"),
					() => X("ph.altText"),
					() => X("lbl.link"),
					() => X("ph.optionalImageLink")
				]), V("change", i, Lt), V("change", s, (e) => M("alt", e.target.value)), V("change", u, (e) => M("href", e.target.value || null)), U(e, t);
			}, d = (e) => {
				var t = yc(), n = L(t), r = I(n, !0);
				A(n);
				var i = R(n, 2);
				q(i);
				var a = R(i, 2), o = I(a), s = R(o);
				q(s), A(a), z((e, t, a, c) => {
					Y(n, "title", e), W(r, t), J(i, B(j).props.url ?? ""), Y(i, "placeholder", a), W(o, `${c ?? ""} `), J(s, B(j).props.title ?? "");
				}, [
					() => X("hint.video"),
					() => X("lbl.videoUrl"),
					() => X("ph.videoUrl"),
					() => X("lbl.videoTitle")
				]), V("change", i, (e) => M("url", e.target.value)), V("change", s, (e) => M("title", e.target.value)), U(e, t);
			}, f = (e) => {
				var t = Cc(), n = L(t), r = I(n), i = R(r), a = I(i);
				{
					let e = /* @__PURE__ */ N(() => B(j).props.glyph ?? "★"), t = /* @__PURE__ */ N(() => B(j).props.icon ?? null), n = /* @__PURE__ */ N(() => B(j).props.image ?? null);
					Sa(a, {
						get value() {
							return B(e);
						},
						get icon() {
							return B(t);
						},
						get image() {
							return B(n);
						},
						onpick: (e) => vt(`edit:${B(j).blockId}`, (t) => {
							t.props.glyph = e, t.props.icon = null, t.props.image = null;
						}),
						onicon: (e) => vt(`edit:${B(j).blockId}`, (t) => {
							t.props.icon = e, t.props.image = null;
						}),
						onimage: (e) => M("image", e)
					});
				}
				var o = R(a, 2), s = (e) => {
					var t = bc();
					q(t), z((e) => {
						J(t, B(j).props.glyph ?? ""), Y(t, "title", e);
					}, [() => X("tip.icon.typeGlyph")]), V("change", t, (e) => M("glyph", e.target.value || "★")), U(e, t);
				}, c = (e) => {
					var t = xc(), n = I(t, !0);
					A(t), z((e, r) => {
						Y(t, "title", e), W(n, r);
					}, [() => X("tip.icon.backToGlyph"), () => X("ui.removeDrawnIcon")]), V("click", t, () => M("icon", null)), U(e, t);
				};
				G(o, (e) => {
					B(j).props.icon ? e(c, -1) : e(s);
				}), A(i), A(n);
				var l = R(n, 2), u = (e) => {
					var t = Sc(), n = I(t), r = R(n, 2), i = I(r, !0);
					A(r), A(t), z((e, r, a) => {
						Y(t, "title", e), Y(n, "src", B(j).props.image), Y(n, "alt", r), W(i, a);
					}, [
						() => X("hint.icon.ownImage"),
						() => X("gp.ownIcon"),
						() => X("ui.removeOwnIcon")
					]), V("click", r, () => M("image", null)), U(e, t);
				};
				G(l, (e) => {
					B(j).props.image && e(u);
				}), z((e) => W(r, `${e ?? ""} `), [() => X("blocks.icon")]), U(e, t);
			}, p = (e) => {
				var t = wc(), n = L(t), r = I(n), i = R(r);
				{
					let e = /* @__PURE__ */ N(() => B(j).props.collection ?? ""), t = /* @__PURE__ */ N(() => [["", X("common.choose")], ...B(Ui).map((e) => [e, B(Gi)[e]?.name ?? e])]);
					Z(i, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("collection", e || null)
					});
				}
				A(n);
				var a = R(n, 2), o = I(a), s = R(o);
				q(s), A(a);
				var c = R(a, 2), l = I(c);
				q(l);
				var u = R(l);
				A(c), z((e, t, i, c, d) => {
					Y(n, "title", e), W(r, `${t ?? ""} `), Y(a, "title", i), W(o, `${c ?? ""} `), J(s, B(j).props.limit ?? 6), oi(l, B(j).props.newestFirst !== !1), W(u, ` ${d ?? ""}`);
				}, [
					() => X("tip.samling.source"),
					() => X("blocks.samling"),
					() => X("tip.samling.limit"),
					() => X("lbl.maxCount"),
					() => X("lbl.newestFirst")
				]), V("change", s, (e) => M("limit", Number(e.target.value))), V("change", l, (e) => M("newestFirst", e.target.checked)), U(e, t);
			}, m = (e) => {
				var t = Ec(), n = L(t), r = I(n), i = R(r);
				A(n), Hr(R(n, 2), 17, () => B(j).props.images ?? [], Rr, (e, t, n) => {
					var r = Tc(), i = I(r), a = I(i), o = R(a, 2), s = I(o);
					s.disabled = n === 0, K(s, () => c.up, !0), A(s);
					var l = R(s, 2);
					K(l, () => c.down, !0), A(l);
					var u = R(l, 2);
					K(u, () => c.cross, !0), A(u), A(o), A(i);
					var d = R(i, 2), f = I(d), p = R(f);
					q(p), A(d);
					var m = R(d, 2), h = I(m), g = R(h);
					q(g), A(m), A(r), z((e, r, o, s, c, d) => {
						Y(i, "title", e), Y(a, "src", B(t).src), l.disabled = n === B(j).props.images.length - 1, Y(u, "title", r), W(f, `${o ?? ""} `), J(p, B(t).alt ?? ""), Y(p, "placeholder", s), W(h, `${c ?? ""} `), J(g, B(t).href ?? ""), Y(g, "placeholder", d);
					}, [
						() => X("hint.gallery"),
						() => X("tip.removeImage"),
						() => X("lbl.description"),
						() => X("ph.altShort"),
						() => X("lbl.link"),
						() => X("ph.galleryHref")
					]), V("click", s, () => pd(n, -1)), V("click", l, () => pd(n, 1)), V("click", u, () => md(n)), V("change", p, (e) => hd(n, "alt", e.target.value)), V("change", g, (e) => hd(n, "href", e.target.value || null)), U(e, r);
				}), z((e, t) => {
					Y(n, "title", e), W(r, `${t ?? ""} `);
				}, [() => X("tip.gallery.addImages"), () => X("ui.addImages")]), V("change", i, dd), U(e, t);
			}, h = (e) => {
				var t = ac(), n = I(t);
				Z(R(n), {
					get value() {
						return B(j).props.kind;
					},
					get options() {
						return Bt;
					},
					onchange: (e) => M("kind", e)
				}), A(t), z((e) => W(n, `${e ?? ""} `), [() => X("blocks.shape")]), U(e, t);
			}, g = (e) => {
				let t = /* @__PURE__ */ N(() => B(nd).find((e) => e.type === B(j).type)?.fields ?? []);
				var n = Mr(), r = L(n), i = (e) => {
					var n = Mr();
					Hr(L(n), 17, () => B(t), (e) => e.key, (e, t) => {
						var n = Mr(), r = L(n), i = (e) => {
							let n = /* @__PURE__ */ N(() => `${B(j).blockId}:${B(t).key}`);
							var r = Oc(), i = L(r), a = I(i), o = R(a);
							q(o), A(i);
							var s = R(i, 2), c = I(s, !0);
							A(s);
							var l = R(s, 2), u = (e) => {
								var t = Dc();
								let r;
								var i = I(t, !0);
								A(t), z(() => {
									r = $r(t, 1, "panel-hint svelte-1n46o8q", null, r, { "place-error": xt[B(n)].err }), W(i, xt[B(n)].text);
								}), U(e, t);
							};
							G(l, (e) => {
								xt[B(n)] && e(u);
							}), z((e) => {
								W(a, `${B(t).label ?? ""} `), Y(o, "placeholder", B(t).placeholder), J(o, bt[B(n)] ?? B(j).props[B(t).key] ?? ""), s.disabled = B(St), W(c, e);
							}, [() => X("props.place.search")]), V("input", o, (e) => {
								bt[B(n)] = e.target.value;
							}), V("keydown", o, (e) => {
								e.key === "Enter" && Tt(B(t));
							}), V("click", s, () => Tt(B(t))), U(e, r);
						}, a = (e) => {
							var n = kc(), r = I(n), i = R(r);
							q(i), A(n), z(() => {
								W(r, `${B(t).label ?? ""} `), Y(i, "min", B(t).min), Y(i, "max", B(t).max), Y(i, "step", B(t).step ?? 1), J(i, B(j).props[B(t).key]);
							}), V("change", i, (e) => M(B(t).key, wt(B(t), Number(e.target.value)))), U(e, n);
						}, o = (e) => {
							var n = _c(), r = I(n);
							q(r);
							var i = R(r);
							A(n), z((e) => {
								oi(r, e), W(i, ` ${B(t).label ?? ""}`);
							}, [() => !!B(j).props[B(t).key]]), V("change", r, (e) => M(B(t).key, e.target.checked)), U(e, n);
						}, s = (e) => {
							var n = ac(), r = I(n), i = R(r);
							{
								let e = /* @__PURE__ */ N(() => (B(t).options ?? []).map((e) => [e.value, e.label]));
								Z(i, {
									get value() {
										return B(j).props[B(t).key];
									},
									get options() {
										return B(e);
									},
									onchange: (e) => M(B(t).key, e)
								});
							}
							A(n), z(() => W(r, `${B(t).label ?? ""} `)), U(e, n);
						}, c = (e) => {
							var n = Ac(), r = I(n), i = R(r);
							q(i), A(n), z(() => {
								W(r, `${B(t).label ?? ""} `), Y(i, "placeholder", B(t).placeholder), J(i, B(j).props[B(t).key] ?? "");
							}), V("change", i, (e) => M(B(t).key, e.target.value)), U(e, n);
						};
						G(r, (e) => {
							B(t).type === "place" ? e(i) : B(t).type === "number" ? e(a, 1) : B(t).type === "toggle" ? e(o, 2) : B(t).type === "select" ? e(s, 3) : e(c, -1);
						}), U(e, n);
					}), U(e, n);
				}, a = (e) => {
					var t = xc(), n = I(t, !0);
					A(t), z((e, r) => {
						Y(t, "title", e), W(n, r);
					}, [() => X("hint.pluginBlock"), () => X("ui.settings")]), V("click", t, () => O?.sendOpenConfig(B(j).blockId)), U(e, t);
				};
				G(r, (e) => {
					B(t).length ? e(i) : e(a, -1);
				}), U(e, n);
			};
			G(n, (e) => {
				B(j).type === "text" ? e(r) : B(j).type === "faq" ? e(i, 1) : B(j).type === "tidslinje" ? e(a, 2) : B(j).type === "sitat" ? e(o, 3) : B(j).type === "statistikk" ? e(s, 4) : B(j).type === "button" ? e(l, 5) : B(j).type === "image" ? e(u, 6) : B(j).type === "video" ? e(d, 7) : B(j).type === "icon" ? e(f, 8) : B(j).type === "samling" ? e(p, 9) : B(j).type === "galleri" ? e(m, 10) : B(j).type === "shape" ? e(h, 11) : e(g, -1);
			}), U(e, t);
		}, m = (e) => {
			var t = Jc(), n = L(t), r = (e) => {
				var t = jc(), n = L(t), r = I(n), a = R(r);
				{
					let e = /* @__PURE__ */ N(() => B(j).props.align ?? "left"), t = /* @__PURE__ */ N(() => [
						["left", X("common.left")],
						["center", X("common.center")],
						["right", X("common.right")]
					]);
					Z(a, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("align", e)
					});
				}
				A(n);
				var o = R(n, 2), s = I(o);
				q(s);
				var c = R(s);
				A(o);
				var l = R(o, 2), u = (e) => {
					i(e);
				};
				G(l, (e) => {
					B(j).props.box && e(u);
				}), Pe(2), z((e, t, n) => {
					W(r, `${e ?? ""} `), oi(s, t), W(c, ` ${n ?? ""}`);
				}, [
					() => X("lbl.align"),
					() => !!B(j).props.box,
					() => X("lbl.textBoxToggle")
				]), V("change", s, (e) => M("box", e.target.checked)), U(e, t);
			}, a = (e) => {
				var t = Mc(), n = L(t), r = I(n, !0);
				A(n);
				var a = R(n, 2);
				i(a), Pe(2), z((e) => W(r, e), [() => X("lbl.cardStyle")]), U(e, t);
			}, o = (e) => {
				var t = Nc(), n = L(t), r = I(n), i = R(r);
				{
					let e = /* @__PURE__ */ N(() => B(j).props.variant ?? "venstre"), t = /* @__PURE__ */ N(() => [["venstre", X("opt.tl.venstre")], ["veksler", X("opt.tl.veksler")]]);
					Z(i, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("variant", e)
					});
				}
				A(n);
				var a = R(n, 2), o = I(a), s = R(o);
				{
					let e = /* @__PURE__ */ N(() => B(j).props.marker ?? "fylt"), t = /* @__PURE__ */ N(() => [["fylt", X("opt.tl.fylt")], ["ring", X("opt.tl.ring")]]);
					Z(s, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("marker", e)
					});
				}
				A(a);
				var c = R(a, 2), l = I(c), u = R(l);
				{
					let e = /* @__PURE__ */ N(() => B(j).props.accent ?? "accent"), t = /* @__PURE__ */ N(Vn);
					Wi(u, {
						get value() {
							return B(e);
						},
						get tokens() {
							return B(t);
						},
						onchange: (e) => M("accent", e === "accent" ? null : e)
					});
				}
				A(c), Pe(2), z((e, t, n) => {
					W(r, `${e ?? ""} `), W(o, `${t ?? ""} `), W(l, `${n ?? ""} `);
				}, [
					() => X("lbl.variant"),
					() => X("lbl.tlMarker"),
					() => X("lbl.color")
				]), U(e, t);
			}, s = (e) => {
				var t = Fc(), n = L(t), r = I(n), i = R(r);
				{
					let e = /* @__PURE__ */ N(() => B(j).props.variant ?? "stor"), t = /* @__PURE__ */ N(() => [["stor", X("opt.sitat.stor")], ["kort", X("opt.sitat.kort")]]);
					Z(i, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("variant", e)
					});
				}
				A(n);
				var a = R(n, 2), o = (e) => {
					var t = Pc(), n = L(t), r = I(n), i = R(r);
					A(n);
					var a = R(n, 2), o = (e) => {
						var t = xc(), n = I(t, !0);
						A(t), z((e) => W(n, e), [() => X("ui.sitatPortrettFjern")]), V("click", t, () => M("image", "")), U(e, t);
					};
					G(a, (e) => {
						B(j).props.image && e(o);
					}), z((e) => W(r, `${e ?? ""} `), [() => X("ui.sitatPortrett")]), V("change", i, Rt), U(e, t);
				};
				G(a, (e) => {
					B(j).props.variant === "kort" && e(o);
				});
				var s = R(a, 2), c = I(s), l = R(c);
				{
					let e = /* @__PURE__ */ N(() => B(j).props.accent ?? "accent"), t = /* @__PURE__ */ N(Vn);
					Wi(l, {
						get value() {
							return B(e);
						},
						get tokens() {
							return B(t);
						},
						onchange: (e) => M("accent", e === "accent" ? null : e)
					});
				}
				A(s), Pe(2), z((e, t) => {
					W(r, `${e ?? ""} `), W(c, `${t ?? ""} `);
				}, [() => X("lbl.variant"), () => X("lbl.color")]), U(e, t);
			}, c = (e) => {
				var t = Ic(), n = L(t), r = I(n);
				q(r);
				var i = R(r);
				A(n), Pe(2), z((e, t) => {
					Y(n, "title", e), oi(r, B(j).props.countUp !== !1), W(i, ` ${t ?? ""}`);
				}, [() => X("tip.stat.countUp"), () => X("lbl.statCountUp")]), V("change", r, (e) => M("countUp", e.target.checked)), U(e, t);
			}, l = (e) => {
				var t = Lc(), n = L(t), r = I(n), i = R(r);
				{
					let e = /* @__PURE__ */ N(() => [["primary", X("opt.btn.primary")], ["secondary", X("opt.btn.secondary")]]);
					Z(i, {
						get value() {
							return B(j).props.style;
						},
						get options() {
							return B(e);
						},
						onchange: (e) => M("style", e)
					});
				}
				A(n), Pe(2), z((e) => W(r, `${e ?? ""} `), [() => X("lbl.style")]), U(e, t);
			}, u = (e) => {
				var t = Rc(), n = L(t), r = I(n), i = R(r);
				{
					let e = /* @__PURE__ */ N(() => B(j).props.fit ?? "cover"), t = /* @__PURE__ */ N(() => [["cover", X("opt.fitFrame.cover")], ["contain", X("opt.fitFrame.contain")]]);
					Z(i, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("fit", e)
					});
				}
				A(n);
				var a = R(n, 2), o = I(a), s = R(o);
				{
					let e = /* @__PURE__ */ N(() => B(j).props.radius ?? ""), t = /* @__PURE__ */ N(() => [
						["", X("common.none")],
						["sm", X("opt.size.sm")],
						["md", X("opt.radius.md")]
					]);
					Z(s, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("radius", e || null)
					});
				}
				A(a);
				var c = R(a, 2), l = I(c), u = R(l), d = I(u);
				A(u), A(c);
				var f = R(c, 2);
				q(f);
				var p = R(f, 2), m = I(p), h = R(m), g = I(h);
				A(h), A(p);
				var _ = R(p, 2);
				q(_);
				var v = R(_, 2), y = I(v), b = R(y), x = I(b);
				A(b), A(v);
				var S = R(v, 2);
				q(S);
				var C = R(S, 2), w = I(C), T = R(w), ee = I(T);
				A(T), A(C);
				var E = R(C, 2);
				q(E);
				var te = R(E, 2), ne = I(te), re = R(ne), ie = I(re);
				A(re), A(te);
				var ae = R(te, 2);
				q(ae);
				var oe = R(ae, 2), se = I(oe), ce = R(se), le = I(ce);
				A(ce), A(oe);
				var ue = R(oe, 2);
				q(ue);
				var de = R(ue, 2), fe = I(de, !0);
				A(de), Pe(2), z((e, t, n, i, a, s, c, u, p, h, b, C, T, te, re, oe, ce) => {
					W(r, `${e ?? ""} `), W(o, `${t ?? ""} `), W(l, `${n ?? ""} `), W(d, `${i ?? ""}%`), J(f, B(j).props.x ?? .5), W(m, `${a ?? ""} `), W(g, `${s ?? ""}%`), J(_, B(j).props.y ?? .5), Y(v, "title", c), W(y, `${u ?? ""} `), W(x, `${p ?? ""}x`), J(S, B(j).props.zoom ?? 1), W(w, `${h ?? ""} `), W(ee, `${b ?? ""}%`), J(E, B(j).props.brightness ?? 1), W(ne, `${C ?? ""} `), W(ie, `${T ?? ""}%`), J(ae, B(j).props.contrast ?? 1), W(se, `${te ?? ""} `), W(le, `${re ?? ""}%`), J(ue, B(j).props.saturate ?? 1), Y(de, "title", oe), W(fe, ce);
				}, [
					() => X("lbl.fit"),
					() => X("lbl.radius"),
					() => X("lbl.focusX"),
					() => Math.round((B(j).props.x ?? .5) * 100),
					() => X("lbl.focusY"),
					() => Math.round((B(j).props.y ?? .5) * 100),
					() => X("tip.zoomCrop"),
					() => X("lbl.zoom"),
					() => (B(j).props.zoom ?? 1).toFixed(2),
					() => X("lbl.brightness"),
					() => Math.round((B(j).props.brightness ?? 1) * 100),
					() => X("lbl.contrast"),
					() => Math.round((B(j).props.contrast ?? 1) * 100),
					() => X("lbl.saturate"),
					() => Math.round((B(j).props.saturate ?? 1) * 100),
					() => X("tip.resetAdjust"),
					() => X("ui.resetAdjust")
				]), V("input", f, (e) => M("x", Number(e.target.value))), V("input", _, (e) => M("y", Number(e.target.value))), V("input", S, (e) => M("zoom", Number(e.target.value))), V("input", E, (e) => M("brightness", Number(e.target.value))), V("input", ae, (e) => M("contrast", Number(e.target.value))), V("input", ue, (e) => M("saturate", Number(e.target.value))), V("click", de, () => vt(`edit:${B(j).blockId}`, (e) => {
					e.props.brightness = 1, e.props.contrast = 1, e.props.saturate = 1;
				})), U(e, t);
			}, d = (e) => {
				var t = zc(), n = L(t), r = I(n), i = R(r);
				q(i), A(n);
				var a = R(n, 2), o = I(a), s = R(o);
				{
					let e = /* @__PURE__ */ N(() => B(j).props.color ?? "accent"), t = /* @__PURE__ */ N(Vn);
					Wi(s, {
						get value() {
							return B(e);
						},
						get tokens() {
							return B(t);
						},
						onchange: (e) => M("color", e)
					});
				}
				A(a), Pe(2), z((e, t, n) => {
					W(r, `${e ?? ""} `), J(i, B(j).props.size ?? 48), Y(a, "title", t), W(o, `${n ?? ""} `);
				}, [
					() => X("lbl.sizePx"),
					() => X("hint.icon.color"),
					() => X("lbl.color")
				]), V("change", i, (e) => M("size", Number(e.target.value))), U(e, t);
			}, f = (e) => {
				var t = Lc(), n = L(t), r = I(n), i = R(r);
				{
					let e = /* @__PURE__ */ N(() => B(j).props.view ?? "cards"), t = /* @__PURE__ */ N(() => [
						["cards", X("opt.collectionView.cards")],
						["list", X("opt.collectionView.list")],
						["archive", X("opt.collectionView.archive")]
					]);
					Z(i, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("view", e)
					});
				}
				A(n), Pe(2), z((e) => W(r, `${e ?? ""} `), [() => X("lbl.view")]), U(e, t);
			}, p = (e) => {
				var t = Hc(), n = L(t), r = I(n), i = R(r);
				{
					let e = /* @__PURE__ */ N(() => B(j).props.view ?? "grid"), t = /* @__PURE__ */ N(() => [
						["grid", X("opt.galleryView.grid")],
						["carousel", X("opt.galleryView.carousel")],
						["slides", X("opt.galleryView.slides")]
					]);
					Z(i, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("view", e)
					});
				}
				A(n);
				var a = R(n, 2), o = (e) => {
					var t = Bc(), n = L(t), r = I(n), i = R(r);
					q(i), A(n);
					var a = R(n, 2), o = I(a), s = R(o), c = I(s);
					A(s), A(a);
					var l = R(a, 2);
					q(l), z((e, t) => {
						W(r, `${e ?? ""} `), J(i, B(j).props.columns ?? 3), W(o, `${t ?? ""} `), W(c, `${B(j).props.gap ?? 12 ?? ""} px`), J(l, B(j).props.gap ?? 12);
					}, [() => X("lbl.columns"), () => X("lbl.imageGap")]), V("change", i, (e) => M("columns", Number(e.target.value))), V("input", l, (e) => M("gap", Number(e.target.value))), U(e, t);
				};
				G(a, (e) => {
					(B(j).props.view ?? "grid") === "grid" && e(o);
				});
				var s = R(a, 2), c = (e) => {
					var t = Vc(), n = I(t), r = R(n);
					q(r), A(t), z((e) => {
						W(n, `${e ?? ""} `), J(r, B(j).props.interval ?? 5);
					}, [() => X("lbl.secondsPerImage")]), V("change", r, (e) => M("interval", Number(e.target.value))), U(e, t);
				};
				G(s, (e) => {
					B(j).props.view === "slides" && e(c);
				});
				var l = R(s, 2), u = I(l), d = R(u);
				{
					let e = /* @__PURE__ */ N(() => B(j).props.radius ?? ""), t = /* @__PURE__ */ N(() => [
						["", X("common.none")],
						["sm", X("opt.size.sm")],
						["md", X("opt.radius.md")]
					]);
					Z(d, {
						get value() {
							return B(e);
						},
						get options() {
							return B(t);
						},
						onchange: (e) => M("radius", e || null)
					});
				}
				A(l);
				var f = R(l, 2), p = I(f);
				q(p);
				var m = R(p);
				A(f), Pe(2), z((e, t, n, i) => {
					W(r, `${e ?? ""} `), W(u, `${t ?? ""} `), Y(f, "title", n), oi(p, B(j).props.lightbox !== !1), W(m, ` ${i ?? ""}`);
				}, [
					() => X("lbl.view"),
					() => X("lbl.radius"),
					() => X("tip.lightbox"),
					() => X("lbl.lightbox")
				]), V("change", p, (e) => M("lightbox", e.target.checked)), U(e, t);
			}, m = (e) => {
				var t = Uc(), n = L(t), r = I(n);
				Z(R(r), {
					get value() {
						return B(j).props.color;
					},
					get options() {
						return Vt;
					},
					onchange: (e) => M("color", e)
				}), A(n);
				var i = R(n, 2), a = I(i), o = R(a);
				q(o), A(i);
				var s = R(i, 2), c = I(s);
				q(c);
				var l = R(c);
				A(s), Pe(2), z((e, t, n, i, u) => {
					W(r, `${e ?? ""} `), W(a, `${t ?? ""} `), J(o, B(j).props.thickness), Y(s, "title", n), oi(c, i), W(l, ` ${u ?? ""}`);
				}, [
					() => X("lbl.color"),
					() => X("lbl.thickness"),
					() => X("tip.shape.fill"),
					() => !!B(j).props.fill,
					() => X("lbl.filled")
				]), V("change", o, (e) => M("thickness", Number(e.target.value))), V("change", c, (e) => M("fill", e.target.checked ? B(j).props.color : null)), U(e, t);
			};
			G(n, (e) => {
				B(j).type === "text" ? e(r) : B(j).type === "faq" ? e(a, 1) : B(j).type === "tidslinje" ? e(o, 2) : B(j).type === "sitat" ? e(s, 3) : B(j).type === "statistikk" ? e(c, 4) : B(j).type === "button" ? e(l, 5) : B(j).type === "image" ? e(u, 6) : B(j).type === "icon" ? e(d, 7) : B(j).type === "samling" ? e(f, 8) : B(j).type === "galleri" ? e(p, 9) : B(j).type === "shape" && e(m, 10);
			});
			var h = R(n, 2), g = I(h), _ = R(g);
			{
				let e = /* @__PURE__ */ N(() => Yn(B(j).animation) ? B(j).animation.type : "");
				Z(_, {
					get value() {
						return B(e);
					},
					get options() {
						return Zn;
					},
					onchange: (e) => er(e || null)
				});
			}
			A(h);
			var v = R(h, 2), y = (e) => {
				var t = Wc(), n = L(t), r = I(n), i = R(r);
				q(i), A(n);
				var a = R(n, 2), o = I(a), s = R(o);
				q(s), A(a), z((e, t) => {
					W(r, `${e ?? ""} `), J(i, B(j).animation.props.duration), W(o, `${t ?? ""} `), J(s, B(j).animation.props.delay);
				}, [() => X("lbl.durationMs"), () => X("lbl.delayMs")]), V("change", i, (e) => nr("duration", Number(e.target.value))), V("change", s, (e) => nr("delay", Number(e.target.value))), U(e, t);
			}, b = /* @__PURE__ */ N(() => Yn(B(j).animation));
			G(v, (e) => {
				B(b) && e(y);
			});
			var x = R(v, 2), S = I(x), C = R(S);
			{
				let e = /* @__PURE__ */ N(() => B(j).hover?.type ?? (B(j).animation && !Yn(B(j).animation) ? B(j).animation.type : ""));
				Z(C, {
					get value() {
						return B(e);
					},
					get options() {
						return Qn;
					},
					onchange: (e) => tr(e || null)
				});
			}
			A(x);
			var w = R(x, 2), T = (e) => {
				var t = Kc(), n = R(L(t), 2), r = I(n);
				q(r);
				var i = R(r);
				A(n);
				var a = R(n, 2), o = (e) => {
					var t = Gc(), n = L(t), r = I(n), i = R(r);
					q(i), A(n);
					var a = R(n, 2), o = I(a), s = R(o);
					{
						let e = /* @__PURE__ */ N(() => B(j).sticky.until ?? ""), t = /* @__PURE__ */ N(gt);
						Z(s, {
							get value() {
								return B(e);
							},
							get options() {
								return B(t);
							},
							onchange: (e) => vt(`edit:${B(j).blockId}`, (t) => {
								t.sticky = {
									...t.sticky,
									until: e || null
								};
							})
						});
					}
					A(a), z((e, t, s, c) => {
						Y(n, "title", e), W(r, `${t ?? ""} `), J(i, B(j).sticky.offset ?? 16), Y(a, "title", s), W(o, `${c ?? ""} `);
					}, [
						() => X("tip.stickyOffset"),
						() => X("lbl.stickyOffset"),
						() => X("tip.stickyUntil"),
						() => X("lbl.stickyUntil")
					]), V("change", i, (e) => vt(`edit:${B(j).blockId}`, (t) => {
						t.sticky = {
							...t.sticky,
							offset: Math.max(0, Number(e.target.value) || 0)
						};
					})), U(e, t);
				};
				G(a, (e) => {
					B(j).sticky && e(o);
				}), z((e, t, a) => {
					Y(n, "title", e), oi(r, t), W(i, ` ${a ?? ""}`);
				}, [
					() => X("tip.sticky"),
					() => !!B(j).sticky,
					() => X("lbl.sticky")
				]), V("change", r, (e) => vt(`edit:${B(j).blockId}`, (t) => {
					t.sticky = e.target.checked ? {
						offset: 16,
						until: null
					} : null;
				})), U(e, t);
			};
			G(w, (e) => {
				B(te) === "desktop" && e(T);
			});
			var ee = R(w, 4), E = I(ee), ne = I(E, !0);
			A(E);
			var re = R(E, 2), ie = I(re), ae = (e) => {
				var t = qc(), n = I(t), r = I(n, !0), i = R(r);
				q(i), A(n);
				var a = R(n, 2), o = I(a, !0), s = R(o);
				q(s), A(a);
				var c = R(a, 2), l = I(c, !0), u = R(l);
				q(u), A(c);
				var d = R(c, 2), f = I(d, !0), p = R(f);
				q(p), A(d);
				var m = R(d, 2), h = I(m, !0), g = R(h);
				q(g), A(m);
				var _ = R(m, 2), v = I(_, !0), y = R(v);
				q(y), A(_), A(t), z((e, t, n, a, c, d, _) => {
					W(r, e), J(i, B(j).frame.x), W(o, t), J(s, B(j).frame.y), W(l, n), J(u, B(j).frame.w), W(f, a), J(p, B(j).frame.h), Y(m, "title", c), W(h, d), J(g, B(j).frame.z ?? 1), W(v, _), J(y, B(j).frame.rot ?? 0);
				}, [
					() => X("frame.x"),
					() => X("frame.y"),
					() => X("frame.w"),
					() => X("frame.h"),
					() => X("tip.frameZ"),
					() => X("frame.z"),
					() => X("frame.rot")
				]), V("change", i, (e) => Et("x", Number(e.target.value))), V("change", s, (e) => Et("y", Number(e.target.value))), V("change", u, (e) => Et("w", Number(e.target.value))), V("change", p, (e) => Et("h", Number(e.target.value))), V("change", g, (e) => Et("z", Number(e.target.value))), V("change", y, (e) => Et("rot", Number(e.target.value))), U(e, t);
			};
			G(ie, (e) => {
				B(te) === "desktop" && e(ae);
			});
			var oe = R(ie, 2), se = I(oe);
			q(se);
			var ce = R(se);
			A(oe), A(re), A(ee), z((e, t, n, r, i, a, o, s) => {
				Y(h, "title", e), W(g, `${t ?? ""} `), Y(x, "title", n), W(S, `${r ?? ""} `), Y(E, "title", i), W(ne, a), Y(oe, "title", o), oi(se, B(j).decor), W(ce, ` ${s ?? ""}`);
			}, [
				() => X("tip.props.blockAnim"),
				() => X("lbl.animIn"),
				() => X("tip.props.blockHover"),
				() => X("lbl.onHover"),
				() => X("hint.placement"),
				() => X("group.placement"),
				() => X("tip.decor"),
				() => X("lbl.decor")
			]), V("change", se, (e) => It(e.target.checked)), U(e, t);
		};
		G(f, (e) => {
			B(Ct) === "content" ? e(p) : e(m, -1);
		}), z((e, t) => {
			o = $r(a, 1, "svelte-1n46o8q", null, o, { on: B(Ct) === "content" }), W(s, e), u = $r(l, 1, "svelte-1n46o8q", null, u, { on: B(Ct) === "style" }), W(d, t);
		}, [() => X("props.tabContent"), () => X("props.tabStyle")]), V("click", a, () => F(Ct, "content")), V("click", l, () => F(Ct, "style")), U(e, t);
	}, o = [
		["color", Jo],
		["gradient", os],
		["glow", ss],
		["image", js],
		["bildegalleri", Fs],
		["grain", ls]
	], s = Object.fromEntries(o), c = {
		desktop: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"4\" y=\"5\" width=\"16\" height=\"11\" rx=\"1.5\"/><path d=\"M2 19h20\"/></svg>",
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
		guides: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3.5\" y=\"3.5\" width=\"17\" height=\"17\" rx=\"2\"/><path d=\"M3.5 9.2h17M3.5 14.8h17M9.2 3.5v17M14.8 3.5v17\"/></svg>",
		kebab: "<svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"currentColor\" stroke=\"none\"><circle cx=\"12\" cy=\"5\" r=\"1.8\"/><circle cx=\"12\" cy=\"12\" r=\"1.8\"/><circle cx=\"12\" cy=\"19\" r=\"1.8\"/></svg>",
		bookmark: "<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z\"/><path d=\"M12 7v6M9 10h6\"/></svg>",
		fit: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4\"/></svg>"
	}, l = [
		["lilla", X("adminTheme.lilla")],
		["bronn", X("adminTheme.bronn")],
		["gull", X("adminTheme.gull")],
		["graa", X("adminTheme.graa")],
		["nordlys", X("adminTheme.nordlys")],
		["skumring", X("adminTheme.skumring")],
		["glo", X("adminTheme.glo")]
	], u = /* @__PURE__ */ P(nn(localStorage.getItem("urd-admin-theme") ?? "graa"));
	xn(() => {
		document.documentElement.dataset.adminTheme = B(u), localStorage.setItem("urd-admin-theme", B(u)), f();
	});
	function f() {
		let e = getComputedStyle(document.documentElement), t = e.getPropertyValue("--urd-color-accent").trim();
		O?.sendAdminTheme({
			bg: e.getPropertyValue("--urd-color-bg").trim(),
			surface: e.getPropertyValue("--urd-color-surface").trim(),
			accent: t,
			text: e.getPropertyValue("--urd-color-text").trim(),
			"accent-text": p(t)
		});
	}
	function p(e) {
		return Ko(e) == null || (qo(e, "#ffffff") ?? 0) >= (qo(e, "#0b0e14") ?? 0) ? "#ffffff" : "#0b0e14";
	}
	let h = /* @__PURE__ */ P(null), g = /* @__PURE__ */ P(null), _ = /* @__PURE__ */ P(!1), v = /* @__PURE__ */ P(""), y = /* @__PURE__ */ P("info"), b = 0;
	function x(e, t = "info") {
		F(v, e, !0), F(y, t, !0);
		let n = ++b;
		t === "ok" && setTimeout(() => {
			b === n && (F(v, ""), F(y, "info"));
		}, 8e3);
	}
	function S() {
		x(X("status.storageFull"), "error");
	}
	function C(e, t) {
		try {
			localStorage.setItem(e, t);
		} catch {
			S();
		}
	}
	let w = /* @__PURE__ */ P(null), T = /* @__PURE__ */ P(null), ee = /* @__PURE__ */ P(nn({
		size: 16,
		snap: !0
	})), E = /* @__PURE__ */ P(!0), te = /* @__PURE__ */ P("desktop"), ne = /* @__PURE__ */ P(null), re = /* @__PURE__ */ P(0), ie = /* @__PURE__ */ P(0), ae = /* @__PURE__ */ P(nn(typeof window < "u" ? window.innerWidth : 1280)), oe = /* @__PURE__ */ P("fit"), se = /* @__PURE__ */ P(1), ce = /* @__PURE__ */ N(() => B(te) === "mobile" ? 390 : B(ae)), le = /* @__PURE__ */ N(() => B(oe) === "manual" ? B(se) : Ta(B(re), B(ce), "fit"));
	function ue(e) {
		let t = Math.min(400, Math.max(10, (Math.round(Math.round(B(le) * 100) / 10) + e) * 10));
		F(se, t / 100), F(oe, "manual");
	}
	let de = /* @__PURE__ */ N(() => B(le) > 0 ? B(ie) / B(le) : B(ie)), fe = /* @__PURE__ */ N(() => B(ce) * B(le)), pe = /* @__PURE__ */ N(() => B(ie));
	xn(() => {
		let e = () => O?.sendCloseMenus();
		return document.addEventListener("pointerdown", e, !0), () => document.removeEventListener("pointerdown", e, !0);
	}), xn(() => {
		let e = B(te);
		O?.sendViewport(e);
	}), xn(() => {
		let e = () => {
			F(ae, window.innerWidth, !0);
		};
		return window.addEventListener("resize", e), () => window.removeEventListener("resize", e);
	}), xn(() => {
		let e = B(ne);
		if (!e || typeof ResizeObserver > "u") return;
		let t = () => {
			let t = e.getBoundingClientRect();
			F(re, t.width, !0), F(ie, t.height, !0);
		};
		t();
		let n = new ResizeObserver(t);
		return n.observe(e), () => n.disconnect();
	});
	let me = /* @__PURE__ */ P(0);
	function he() {
		F(me, D?.data.sections.filter((e) => e.responsive?.mobile?.attention?.needed).length ?? 0, !0);
	}
	function ge(e) {
		let t = D.data.sections.find((t) => t.id === e.sectionId);
		if (t) {
			Oe("layout");
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
			}, _e(t, "oppsett-byttet"), e.sectionId === B(Ht) && F(Wt, e.minHeight, !0), B(j)?.sectionId === e.sectionId && pt(), D.save(), Ce(), O?.sendSection(B(g), t);
		}
	}
	function _e(e, t) {
		!e || e.responsive?.mobile?.mode !== "manual" || e.responsive.mobile.attention?.needed || (e.responsive.mobile.attention = {
			needed: !0,
			reason: t,
			since: (/* @__PURE__ */ new Date()).toISOString()
		}, he(), O?.sendAttention(e.id, !0));
	}
	let D = null, ve = null, O = null, k = /* @__PURE__ */ P(null);
	function ye() {
		F(k, ve.data, !0), ve.replace(B(k));
	}
	function be() {
		O?.sendSite(Ve(B(k)));
	}
	let xe = /* @__PURE__ */ new Set(), Se = () => B(k).pages.find((e) => e.id === B(g));
	function Ce() {
		let e = B(k)?.pages?.some((e) => !xe.has(e.id) && localStorage.getItem(`urd-draft-${e.id}`) !== null) ?? !1, t = zi?.hasDraft() || Object.values(Bi).some((e) => e.hasDraft()), n = ra?.hasDraft() || Object.values(ia).some((e) => e.hasDraft());
		F(_, e || D?.hasDraft() && !xe.has(B(g)) || ve?.hasDraft() || Ma?.hasDraft() || t || n || !1, !0);
	}
	let we = [], Te = [], Ee = null;
	function De() {
		return JSON.stringify({
			pageId: B(g),
			page: D.data,
			site: ve.data,
			samlingerIndex: Hi ? zi.data : null,
			samlinger: Hi ? Object.fromEntries(Object.entries(Bi).map(([e, t]) => [e, t.data])) : {},
			malerIndex: oa ? ra.data : null,
			maler: oa ? Object.fromEntries(Object.entries(ia).map(([e, t]) => [e, t.data])) : {},
			plugins: Ma?.data ?? null
		});
	}
	function Oe(e) {
		e === Ee && (e.startsWith("edit:") || e.startsWith("grid:")) || (we.push(De()), we.length > 50 && we.shift(), Te.length = 0, Ee = e);
	}
	function ke(e) {
		let { pageId: t, page: n, site: r, samlingerIndex: i, samlinger: a, malerIndex: o, maler: s, plugins: c } = JSON.parse(e);
		if (ve.replace(r), ye(), ve.save(), F(ee, {
			snap: !0,
			...B(k).grid
		}, !0), be(), Ae(i, a ?? {}), je(o, s ?? {}), Me(c), t && t !== B(g) && B(k).pages.some((e) => e.id === t)) {
			C(`urd-draft-${t}`, JSON.stringify(n)), Ir(t, { keepHistory: !0 }), Ce();
			return;
		}
		D.replace(n), D.save(), Ce(), he(), pt(), Yt(D.data.sections.find((e) => e.id === B(Ht))), B(k).pages.some((e) => e.id === B(g)) ? O?.sendPage(B(g), D.data) : Ir(B(k).pages[0].id, { keepHistory: !0 });
	}
	function Ae(e, t) {
		if (!(!zi || !e) && JSON.stringify({
			index: zi.data,
			samlinger: Object.fromEntries(Object.entries(Bi).map(([e, t]) => [e, t.data]))
		}) !== JSON.stringify({
			index: e,
			samlinger: t
		})) {
			zi.replace(e), zi.save();
			for (let e of Object.keys(Bi)) e in t || (localStorage.removeItem(`urd-draft-samling-${e}`), delete Bi[e]);
			for (let [e, n] of Object.entries(t)) {
				if (!Bi[e]) {
					let t = Vi[e] ?? null;
					Bi[e] = Mi(`urd-draft-samling-${e}`, () => t, S);
				}
				Bi[e].replace(n), Bi[e].save();
			}
			F(Ui, [...e.samlinger ?? []], !0), B(Ki) && !B(Ui).includes(B(Ki)) && F(Ki, null), _a();
		}
	}
	function je(e, t) {
		if (!(!ra || !e) && JSON.stringify({
			index: ra.data,
			maler: Object.fromEntries(Object.entries(ia).map(([e, t]) => [e, t.data]))
		}) !== JSON.stringify({
			index: e,
			maler: t
		})) {
			ra.replace(e), ra.save();
			for (let e of Object.keys(ia)) e in t || (localStorage.removeItem(`urd-draft-mal-${e}`), delete ia[e]);
			for (let [e, n] of Object.entries(t)) ia[e] || (ia[e] = Mi(`urd-draft-mal-${e}`, () => aa[e] ?? null, S)), ia[e].replace(n), ia[e].save();
			F(sa, [...e.maler ?? []], !0), Ce(), la();
		}
	}
	function Me(e) {
		!Ma || !e || JSON.stringify(Ma.data) !== JSON.stringify(e) && (Ma.replace(e), Ma.save(), qa(), no());
	}
	function Ne() {
		we.length && (Te.push(De()), ke(we.pop()), Ee = null, x(X("status.undone")));
	}
	function Fe() {
		Te.length && (we.push(De()), ke(Te.pop()), Ee = null, x(X("status.redone")));
	}
	function Ie(e) {
		B(ht) && (e.target instanceof Element && e.target.closest(".block-menu") || F(ht, null));
	}
	function Le(e) {
		if (e.key === "Escape" && B(ht)) {
			F(ht, null);
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
			].includes(t.type)) || !B(j) || B(te) === "mobile") return;
			e.preventDefault(), O?.sendDuplicate();
			return;
		}
		if (t !== "z" && t !== "y") return;
		let n = e.target;
		n instanceof HTMLElement && (n.isContentEditable || n.tagName === "TEXTAREA" || n.tagName === "INPUT" && ![
			"number",
			"checkbox",
			"range",
			"color"
		].includes(n.type)) || (e.preventDefault(), t === "y" || e.shiftKey ? Fe() : Ne());
	}
	async function Re() {
		F(h, Na(await (await fetch("/content/site.json")).json()), !0), ve = Mi("urd-draft-site", () => B(h), S), (ve.data.schemaVersion ?? 1) > 1 && (console.warn(`Urd: site-utkastet har schemaVersion ${ve.data.schemaVersion} (motoren har 1) og forkastes`), ve.replace(Ve(B(h)))), ve.replace(Na(ve.data)), ve.save(), ye(), F(ee, {
			snap: !0,
			...B(k).grid
		}, !0), await Ir(new URLSearchParams(location.search).get("page") ?? B(k).pages[0].id), await Za(), await ga(), await ca(), await fr(), B(T) && mr(), B(k).site.setup === !0 && !localStorage.getItem("urd-setup-done") && (F(qe, B(k).site.title, !0), F(Je, B(k).theme.tokens.color.accent, !0), F(Ye, B(k).theme.tokens.color.bg, !0), F(We, !0));
	}
	let ze = /* @__PURE__ */ P(null);
	function Be({ title: e, lines: t = [], okLabel: n = X("confirm.ok"), cancelLabel: r = X("confirm.cancel") }) {
		return new Promise((i) => {
			F(ze, {
				title: e,
				lines: t,
				okLabel: n,
				cancelLabel: r,
				resolve: i
			}, !0);
		});
	}
	function He({ title: e, lines: t = [], value: n = "", placeholder: r = "", okLabel: i = X("confirm.ok"), cancelLabel: a = X("confirm.cancel") }) {
		return new Promise((o) => {
			F(ze, {
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
	function Ue(e) {
		B(ze)?.resolve(B(ze).prompt ? e ? B(ze).value : null : e), F(ze, null);
	}
	let We = /* @__PURE__ */ P(!1), qe = /* @__PURE__ */ P(""), Je = /* @__PURE__ */ P("#7c5cff"), Ye = /* @__PURE__ */ P("#0b0e14");
	function Xe() {
		localStorage.setItem("urd-setup-done", "1"), F(We, !1);
	}
	function Ze() {
		let e = B(qe).trim();
		e && (Jr("setup", () => {
			B(k).site.title = e, B(k).nav.logo = {
				type: "text",
				value: e
			}, B(k).theme.tokens.color.accent = B(Je), B(k).theme.tokens.color.bg = B(Ye), delete B(k).site.setup;
		}), Xe(), x(X("status.setupDone"), "ok"));
	}
	let Qe = /* @__PURE__ */ P(null), $e = [
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
	], et = Object.fromEntries($e.flat().map((e) => [e, X(`panel.${e}`)])), tt = {
		pages: ["hint.pages.drafts"],
		blocks: ["hint.blocks.intro"],
		grid: ["hint.grid.intro", "hint.grid.section"],
		collections: ["hint.collections.intro"],
		plugins: ["hint.plugins.intro"],
		history: ["hint.history.intro"]
	}, nt = [
		["se", "Davvisámegiella"],
		["en-GB", "English (UK)"],
		["nb", "Norsk bokmål"],
		["nn", "Norsk nynorsk"],
		["tr", "Türkçe"]
	], rt = (e) => [...e].sort((e, t) => e[1].localeCompare(t[1]));
	function it(e, t) {
		let n = [];
		for (let r of e) for (let e of Va[r]?.languages ?? []) e?.[t] === !0 && (typeof e.code != "string" || typeof e.name != "string" || !e.name || nt.some(([t]) => t === e.code) || n.some(([t]) => t === e.code) || n.push([e.code, e.name]));
		return n;
	}
	function at() {
		let e = rt([...nt, ...it(B(Wa), "admin")]);
		return lt === "auto" || e.some(([e]) => e === lt) ? e : [[lt, lt], ...e];
	}
	let ot = () => it(B(Ra)?.enabled ?? [], "site"), lt = localStorage.getItem("urd-admin-lang") ?? "auto";
	function ut(e) {
		e !== lt && (e === "auto" ? localStorage.removeItem("urd-admin-lang") : localStorage.setItem("urd-admin-lang", e), location.reload());
	}
	function dt(e) {
		F(Qe, B(Qe) === e ? null : e, !0), O?.sendShowGrid(B(Qe) === "grid"), B(Qe) === "history" && yr(), B(Qe) === "update" && !B(Or) && Ar();
	}
	let j = /* @__PURE__ */ P(null);
	function ft(e, t) {
		let n = D?.data.sections.find((t) => t.id === e);
		return {
			section: n,
			block: n?.blocks.find((e) => e.id === t)
		};
	}
	function pt() {
		if (!B(j)) return;
		let { block: e } = ft(B(j).sectionId, B(j).blockId);
		if (!e) {
			F(j, null);
			return;
		}
		F(j, {
			sectionId: B(j).sectionId,
			blockId: B(j).blockId,
			type: e.type,
			decor: !!e.decor,
			props: JSON.parse(JSON.stringify(e.props)),
			frame: { ...e.frames.desktop },
			animation: e.animation ? JSON.parse(JSON.stringify(e.animation)) : null,
			hover: e.hover ? JSON.parse(JSON.stringify(e.hover)) : null,
			sticky: e.sticky ? JSON.parse(JSON.stringify(e.sticky)) : null
		}, !0);
	}
	function mt(e) {
		if (F(ht, null), !e.blockId) {
			F(j, null);
			return;
		}
		F(j, {
			sectionId: e.sectionId,
			blockId: e.blockId
		}, !0), e.sectionId && F(Ht, e.sectionId, !0), pt();
	}
	let ht = /* @__PURE__ */ P(null);
	function gt() {
		let e = D?.data.sections ?? [], t = e.findIndex((e) => e.id === B(j)?.sectionId);
		return [["", X("opt.sticky.ownSection")], ...e.slice(t + 1).map((e, n) => [e.id, X("opt.sticky.atSection", { n: t + 2 + n })])];
	}
	function _t(e) {
		if (mt(e), !B(j)) return;
		let t = B(w)?.getBoundingClientRect();
		if (!t) return;
		let n = t.left + B(le) * e.rect.right + 12;
		n + 300 > window.innerWidth - 8 && (n = Math.max(8, t.left + B(le) * e.rect.left - 300 - 12));
		let r = window.innerHeight - Math.min(window.innerHeight * .7, 560) - 8, i = Math.min(Math.max(8, t.top + B(le) * e.rect.top), Math.max(8, r));
		F(ht, {
			left: n,
			top: i
		}, !0);
	}
	function vt(e, t) {
		let { section: n, block: r } = ft(B(j)?.sectionId, B(j)?.blockId);
		r && (Oe(e), t(r, n), _e(n, "blokk-endret"), D.save(), Ce(), O?.sendSection(B(g), n), pt());
	}
	function M(e, t) {
		vt(`edit:${B(j).blockId}:${e}`, (n) => {
			n.props[e] = t;
		});
	}
	function yt(e, t) {
		vt(`edit:${B(j).blockId}:${e}`, (e) => {
			Object.assign(e.props, t);
		});
	}
	let bt = nn({}), xt = nn({}), St = /* @__PURE__ */ P(!1), Ct = /* @__PURE__ */ P("content"), wt = (e, t) => (Number.isFinite(t) || (t = e.min ?? 0), e.min != null && (t = Math.max(e.min, t)), e.max != null && (t = Math.min(e.max, t)), t);
	async function Tt(e) {
		let t = B(j).blockId, n = `${t}:${e.key}`, r = (bt[n] ?? B(j).props[e.key] ?? "").trim();
		xt[n] = null;
		let i = r.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
		if (!r || i || /^https?:\/\//i.test(r)) {
			yt(e.key, {
				[e.key]: r,
				lat: i ? Number(i[1]) : null,
				lon: i ? Number(i[2]) : null
			});
			return;
		}
		F(St, !0), xt[n] = {
			text: X("props.place.searching"),
			err: !1
		};
		try {
			let i = await fetch(`/api/geocode?q=${encodeURIComponent(r)}`), a = await i.json().catch(() => null);
			if (B(j)?.blockId !== t) return;
			i.ok && Number.isFinite(a?.lat) ? (yt(e.key, {
				[e.key]: r,
				lat: a.lat,
				lon: a.lon
			}), xt[n] = null) : xt[n] = {
				text: Di(a) ?? X("props.place.notFound"),
				err: !0
			};
		} catch {
			xt[n] = {
				text: X("props.place.failed"),
				err: !0
			};
		} finally {
			F(St, !1);
		}
	}
	function Et(e, t) {
		Number.isFinite(t) && vt(`edit:frame-${B(j).blockId}:${e}`, (n) => {
			n.frames.desktop = {
				...n.frames.desktop,
				[e]: t
			};
		});
	}
	function Dt(e) {
		vt(`edit:${B(j).blockId}:boxStyle`, (t) => {
			let n = {
				...t.props.boxStyle ?? {},
				...e
			};
			for (let e of Object.keys(n)) n[e] ?? delete n[e];
			Object.keys(n).length ? t.props.boxStyle = n : delete t.props.boxStyle;
		});
	}
	function Ot(e, t) {
		vt(`edit:${B(j).blockId}:faq${e}`, (n) => {
			n.props.items[e] = {
				...n.props.items[e],
				...t
			};
		});
	}
	function kt() {
		vt("faq-item", (e) => {
			(e.props.items ??= []).push({
				q: X("seed.faq.newQ"),
				a: X("seed.faq.answer")
			});
		});
	}
	function At(e) {
		vt("faq-item", (t) => {
			t.props.items.splice(e, 1);
		});
	}
	function jt(e, t) {
		let n = e + t;
		vt("faq-item", (t) => {
			n < 0 || n >= t.props.items.length || ([t.props.items[e], t.props.items[n]] = [t.props.items[n], t.props.items[e]]);
		});
	}
	function Mt(e, t) {
		vt(`edit:${B(j).blockId}:tl${e}`, (n) => {
			n.props.items[e] = {
				...n.props.items[e],
				...t
			};
		});
	}
	function Nt() {
		vt("tl-item", (e) => {
			(e.props.items ??= []).push({
				year: "",
				title: X("seed.tidslinje.newTitle"),
				text: ""
			});
		});
	}
	function Pt(e) {
		vt("tl-item", (t) => {
			t.props.items.splice(e, 1);
		});
	}
	function Ft(e, t) {
		let n = e + t;
		vt("tl-item", (t) => {
			n < 0 || n >= t.props.items.length || ([t.props.items[e], t.props.items[n]] = [t.props.items[n], t.props.items[e]]);
		});
	}
	function It(e) {
		vt("decor", (t) => {
			t.decor = e;
		});
	}
	async function Lt(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", t) try {
			let e = await jn(t);
			vt(`edit:${B(j).blockId}`, (n) => {
				n.props.src = e.dataUrl, n.props.alt = n.props.alt || ta(t.name).replaceAll("-", " ");
			});
		} catch {
			x(X("status.imageReadError"), "error");
		}
	}
	async function Rt(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", t) try {
			let e = await jn(t);
			vt(`edit:${B(j).blockId}`, (t) => {
				t.props.image = e.dataUrl;
			});
		} catch {
			x(X("status.imageReadError"), "error");
		}
	}
	let zt = {
		text: X("blocks.text"),
		button: X("blocks.button"),
		image: X("blocks.image"),
		shape: X("blocks.shape"),
		video: X("blocks.video"),
		icon: X("blocks.icon"),
		galleri: X("blocks.galleri"),
		faq: X("blocks.faq")
	}, Bt = [
		["line", X("shape.line")],
		["arrow", X("shape.arrow")],
		["circle", X("shape.circle")],
		["rect", X("shape.rect")],
		["triangle", X("shape.triangle")]
	], Vt = [
		["accent", X("color.accent")],
		["text", X("color.text")],
		["surface", X("color.surface")],
		["bg", X("color.bg")]
	], Ht = /* @__PURE__ */ P(null), Ut = /* @__PURE__ */ P(null), Wt = /* @__PURE__ */ P(""), Gt = /* @__PURE__ */ P(nn([])), Kt = /* @__PURE__ */ P(null), qt = /* @__PURE__ */ P(null), Jt = /* @__PURE__ */ P("");
	function Yt(e) {
		F(Ut, e?.grid ? { ...e.grid } : null, !0), F(Wt, e?.size?.minHeight ?? "", !0), F(Gt, JSON.parse(JSON.stringify(e?.background?.layers ?? [])), !0), F(Kt, e?.animation ? JSON.parse(JSON.stringify(e.animation)) : null, !0), F(qt, e?.hover ? JSON.parse(JSON.stringify(e.hover)) : null, !0), F(Jt, e?.theme ?? "", !0);
	}
	let Xt = /* @__PURE__ */ P(null), Zt = nn({});
	function Qt() {
		try {
			let e = ((B(w)?.contentDocument)?.querySelector(`.urd-section[data-section-id="${B(Ht)}"]`))?.getBoundingClientRect();
			F(Xt, e && e.width ? {
				w: e.width,
				h: e.height
			} : null, !0);
		} catch {
			F(Xt, null);
		}
	}
	xn(() => {
		B(Ht), B(Gt), requestAnimationFrame(() => requestAnimationFrame(Qt));
	}), xn(() => {
		let e = B(w);
		if (!e || typeof ResizeObserver > "u") return;
		let t = new ResizeObserver(() => Qt());
		return t.observe(e), () => t.disconnect();
	}), xn(() => {
		for (let e of B(Gt)) {
			let t = e?.props?.src;
			if (e?.type === "image" && t && !Zt[t]) {
				let e = new Image();
				e.onload = () => {
					Zt[t] = {
						w: e.naturalWidth,
						h: e.naturalHeight
					};
				}, e.src = t;
			}
		}
	});
	function $t(e) {
		an("section-theme", (t) => {
			e ? t.theme = e : delete t.theme;
		});
	}
	function en(e) {
		let t = B(k).theme.scheme === "dark" ? {
			...B(k).theme.tokens.color,
			...B(k).theme.alt?.tokens?.color ?? {}
		} : B(k).theme.tokens.color, n = (e) => e.replaceAll("var(--urd-base-bg)", t.bg).replaceAll("var(--urd-base-surface)", t.surface).replaceAll("var(--urd-base-text)", t.text).replaceAll("var(--urd-base-accent)", t.accent).replaceAll("var(--urd-base-accent-text)", t["accent-text"]), r = Go(e);
		return {
			bg: r["--urd-color-bg"] ? n(r["--urd-color-bg"]) : t.bg,
			surface: r["--urd-color-surface"] ? n(r["--urd-color-surface"]) : t.surface,
			text: r["--urd-color-text"] ? n(r["--urd-color-text"]) : t.text,
			accent: r["--urd-color-accent"] ? n(r["--urd-color-accent"]) : t.accent
		};
	}
	function tn(e) {
		F(Ht, e.sectionId, !0), Yt(D?.data.sections.find((t) => t.id === e.sectionId));
	}
	function an(e, t) {
		let n = D.data.sections.find((e) => e.id === B(Ht));
		n && (Oe(e), t(n), D.save(), Ce(), O?.sendSection(B(g), n), Yt(n));
	}
	let on = /* @__PURE__ */ P("color");
	function sn(e, t) {
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
	function cn(e, t) {
		e.mutate(e.keyPrefix, (e) => {
			e.background.layers.splice(t, 1), e.background.layers.length || delete e.background;
		});
	}
	function ln(e, t, n) {
		let r = t + n;
		e.mutate(e.keyPrefix, (e) => {
			let n = e.background.layers;
			r < 0 || r >= n.length || ([n[t], n[r]] = [n[r], n[t]]);
		});
	}
	function un(e, t, n, r) {
		e.mutate(`edit:${e.keyPrefix}-${e.keyId}-${t}-${n}`, (e) => {
			e.background.layers[t].props[n] = r;
		});
	}
	function dn(e, t, n, r = "xy") {
		e.preventDefault();
		let i = e.currentTarget;
		i.setPointerCapture?.(e.pointerId);
		let a = (e) => {
			let a = i.getBoundingClientRect();
			if (r.includes("x")) {
				let r = Math.min(1, Math.max(0, (e.clientX - a.left) / a.width));
				un(t, n, "x", Math.round(r * 100) / 100);
			}
			if (r.includes("y")) {
				let r = Math.min(1, Math.max(0, (e.clientY - a.top) / a.height));
				un(t, n, "y", Math.round(r * 100) / 100);
			}
		};
		a(e);
		let o = () => {
			i.removeEventListener("pointermove", a), i.removeEventListener("pointerup", o), i.removeEventListener("pointercancel", o);
		};
		i.addEventListener("pointermove", a), i.addEventListener("pointerup", o), i.addEventListener("pointercancel", o);
	}
	let fn = (e) => Math.min(4, Math.max(.1, e));
	function pn(e, t, n, r) {
		un(e, t, "size", fn(Math.round((n + r) * 100) / 100));
	}
	function mn(e, t, n) {
		let r = Number(n);
		Number.isFinite(r) && un(e, t, "size", fn(r / 100));
	}
	function hn(e, t, n, r) {
		let i = Zt[n.props.src];
		if (!i?.w || !i?.h || !B(Xt)?.w || !B(Xt)?.h) return;
		let a = B(Xt).h * i.w / (B(Xt).w * i.h), o = r === "cover" ? Math.max(1, a) : Math.min(1, a);
		(n.props.fit === "flislegg" || n.props.fit === "repeat") && un(e, t, "fit", "vanlig"), un(e, t, "size", fn(Math.round(o * 100) / 100));
	}
	function gn(e) {
		return e.props;
	}
	function _n(e, t, n, r) {
		e.mutate(n, (e) => {
			r(e.background.layers[t].props);
		});
	}
	function vn(e, t, n, r) {
		_n(e, t, `edit:${e.keyPrefix}-${e.keyId}-${t}-${n}`, (e) => {
			e[n] = r;
		});
	}
	let yn = {
		linear: [
			["none", X("common.none")],
			["pan", X("opt.gradAnim.pan")],
			["pan-loop", X("opt.gradAnim.panLoop")],
			["rotate", X("opt.gradAnim.rotate")]
		],
		radial: [
			["none", X("common.none")],
			["pulse", X("opt.gradAnim.pulse")],
			["orbit", X("opt.gradAnim.orbit")]
		]
	};
	function bn(e, t, n) {
		_n(e, t, e.keyPrefix, (e) => {
			e.kind = n, yn[n].some(([t]) => t === (e.animation ?? "none")) || (e.animation = "none");
		});
	}
	function Sn(e, t, n, r) {
		_n(e, t, `edit:${e.keyPrefix}-${e.keyId}-${t}-stop${n}`, (e) => {
			e.stops[n] = {
				...e.stops[n],
				...r
			};
		});
	}
	function Cn(e, t) {
		_n(e, t, e.keyPrefix, (e) => {
			let t = Math.round(e.stops.reduce((e, t) => e + (Number(t.share) || 0), 0) / e.stops.length) || 50;
			e.stops.push({
				color: e.stops[e.stops.length - 1]?.color ?? "#ffffff",
				share: t
			});
		});
	}
	function wn(e, t, n) {
		_n(e, t, e.keyPrefix, (e) => {
			e.stops.length > 2 && e.stops.splice(n, 1);
		});
	}
	function Tn(e, t, n, r) {
		_n(e, t, e.keyPrefix, (e) => {
			let [t] = e.stops.splice(n, 1);
			e.stops.splice(r, 0, t);
		});
	}
	let En = /* @__PURE__ */ P(null);
	function Dn(e, t, n, r) {
		if (t.button !== 0) return;
		t.preventDefault();
		let i = t.currentTarget.closest(".bg-layer"), a = t.currentTarget.closest(".grad-stop");
		F(En, {
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
			F(En, {
				...B(En),
				insert: n
			}, !0);
		}, u = () => {
			window.removeEventListener("pointermove", l), window.removeEventListener("pointerup", u), c.remove();
			let t = B(En);
			if (F(En, null), !t) return;
			let n = t.insert > t.from ? t.insert - 1 : t.insert;
			n !== t.from && Tn(e, t.layer, t.from, n);
		};
		window.addEventListener("pointermove", l), window.addEventListener("pointerup", u);
	}
	function On(e, t, n) {
		e.mutate(e.keyPrefix, (e) => {
			e.background.layers[t].type !== n && (e.background.layers[t] = {
				type: n,
				version: s[n].version ?? 1,
				props: s[n].defaults()
			});
		});
	}
	async function kn(e, t) {
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
	async function An(e) {
		let t = await e.text(), n = Zi(t), r = $i(t);
		if (!r) return n;
		let i = await kn(n.dataUrl, r);
		if (!i) return n;
		let a = Qi(t, i);
		if (a === t) return n;
		try {
			return Zi(a);
		} catch {
			return n;
		}
	}
	async function jn(e) {
		return e.type === "image/svg+xml" || /\.svg$/i.test(e.name || "") ? An(e) : Ji(e);
	}
	async function Mn(e, t, n) {
		let r = n.target.files?.[0];
		if (n.target.value = "", r) try {
			un(e, t, "src", (await jn(r)).dataUrl);
		} catch {
			x(X("status.imageReadError"), "error");
		}
	}
	async function Nn(e, t, n) {
		let r = [...n.target.files ?? []];
		if (n.target.value = "", !r.length) return;
		x(X("status.compressingImages"));
		let { images: i, failed: a, big: o } = await ld(r);
		i.length && e.mutate(e.keyPrefix, (e) => {
			let n = e.background.layers[t].props;
			n.images ??= [], n.images.push(...i.map(({ src: e }) => ({
				src: e,
				x: .5,
				y: .5
			})));
		}), ud(i.length, a, o);
	}
	function Pn(e, t, n, r) {
		e.mutate(e.keyPrefix, (e) => {
			let i = e.background.layers[t].props.images, a = n + r;
			a < 0 || a >= i.length || ([i[n], i[a]] = [i[a], i[n]]);
		});
	}
	function Fn(e, t, n) {
		e.mutate(e.keyPrefix, (e) => {
			e.background.layers[t].props.images.splice(n, 1);
		});
	}
	function In(e, t, n, r, i) {
		e.mutate(`edit:${e.keyPrefix}g-${e.keyId}-${t}-${n}-${r}`, (e) => {
			e.background.layers[t].props.images[n][r] = i;
		});
	}
	function Ln(e, t) {
		Jr(e, () => {
			B(k).nav.style ??= {}, t(B(k).nav.style);
		});
	}
	let Rn = /* @__PURE__ */ N(() => ({
		mutate: an,
		keyPrefix: "bg",
		keyId: B(Ht)
	})), zn = {
		mutate: Ln,
		keyPrefix: "navbg",
		keyId: "nav"
	}, Bn = {
		mutate: oo,
		keyPrefix: "footerbg",
		keyId: "footer"
	}, Vn = () => Object.entries(B(k)?.theme.tokens.color ?? {}).map(([e, t]) => [e, t]), Hn = [
		[
			"bg",
			X("palette.bg"),
			X("palette.bgShort")
		],
		[
			"surface",
			X("palette.surface"),
			X("palette.surfaceShort")
		],
		[
			"text",
			X("palette.text"),
			X("palette.textShort")
		],
		[
			"accent",
			X("palette.accent"),
			X("palette.accentShort")
		],
		[
			"accent-text",
			X("palette.accentText"),
			X("palette.accentTextShort")
		]
	], Un = /* @__PURE__ */ N(() => !!B(k)?.theme.alt), Wn = /* @__PURE__ */ N(() => B(k)?.theme.alt?.auto === !0), Gn = /* @__PURE__ */ N(() => B(k)?.theme.scheme === "dark" ? "dark" : "light"), Kn = /* @__PURE__ */ N(() => B(k)?.theme.tokens.color ?? {}), qn = /* @__PURE__ */ N(() => ({
		...B(k)?.theme.tokens.color ?? {},
		...B(k)?.theme.alt?.tokens?.color ?? {}
	}));
	function Jn(e) {
		return {
			type: e,
			version: zs[e].version,
			props: zs[e].defaults()
		};
	}
	let Yn = (e) => !!(e && zs[e.type]?.entrance), Xn = [["", X("common.none")], ...Object.entries(zs).filter(([, e]) => e.entrance).map(([e, t]) => [e, t.labelKey ? X(t.labelKey) : t.label])], Zn = Xn.filter(([e]) => !zs[e]?.group), Qn = [["", X("common.none")], ...Object.entries(zs).filter(([, e]) => !e.entrance).map(([e, t]) => [e, t.labelKey ? X(t.labelKey) : t.label])];
	function $n(e) {
		e.animation && !Yn(e.animation) && (e.hover ??= e.animation, e.animation = null);
	}
	function er(e) {
		vt(`edit:anim-${B(j).blockId}`, (t) => {
			$n(t), t.animation = e ? Jn(e) : null;
		}), B(j) && O?.sendDemoAnim(B(j).sectionId, B(j).blockId);
	}
	function tr(e) {
		vt(`edit:hover-${B(j).blockId}`, (t) => {
			$n(t), t.hover = e ? Jn(e) : null;
		});
	}
	function nr(e, t) {
		Number.isFinite(t) && (vt(`edit:anim-${B(j).blockId}:${e}`, (n) => {
			n.animation && (n.animation.props[e] = t);
		}), B(j) && O?.sendDemoAnim(B(j).sectionId, B(j).blockId));
	}
	function rr(e) {
		an("section-anim", (t) => {
			$n(t), t.animation = e ? Jn(e) : null;
		}), O?.sendDemoAnim(B(Ht));
	}
	function ir(e) {
		an("section-hover", (t) => {
			$n(t), t.hover = e ? Jn(e) : null;
		});
	}
	function ar(e, t) {
		Number.isFinite(t) && (an("edit:section-anim", (n) => {
			n.animation && (n.animation.props[e] = t);
		}), O?.sendDemoAnim(B(Ht)));
	}
	function or(e, t) {
		an("edit:section-anim", (n) => {
			n.animation && (n.animation.props[e] = t);
		}), O?.sendDemoAnim(B(Ht));
	}
	function sr(e) {
		let t = D.data.sections.find((e) => e.id === B(Ht));
		if (!t) return;
		let n = e.trim();
		if (!n) return;
		let r = /^\d+$/.test(n) ? `${n}px` : n;
		Oe("section-size"), t.size = {
			...t.size,
			minHeight: r
		}, F(Wt, r, !0), D.save(), Ce(), O?.sendSection(B(g), t);
	}
	function cr() {
		return D.data.sections.find((e) => e.id === B(Ht)) ?? D.data.sections[0];
	}
	function lr(e) {
		let t = D.data.sections.find((e) => e.id === B(Ht));
		t && (Oe("grid:section"), t.grid = e ? { ...ve.data.grid } : null, F(Ut, t.grid ? { ...t.grid } : null, !0), D.save(), Ce(), O?.sendSection(B(g), t), B(Qe) === "grid" && O?.sendShowGrid(!0));
	}
	function ur(e, t) {
		let n = D.data.sections.find((e) => e.id === B(Ht));
		n?.grid && (Oe("grid:section"), n.grid = {
			...n.grid,
			[e]: t
		}, F(Ut, { ...n.grid }, !0), D.save(), Ce(), O?.sendSection(B(g), n), B(Qe) === "grid" && O?.sendShowGrid(!0));
	}
	function dr(e, t) {
		Oe("grid:site"), F(ee, {
			...B(ee),
			[e]: t
		}, !0), ve.data.grid = {
			...ve.data.grid,
			[e]: t
		}, ve.save(), Ce(), be(), B(Qe) === "grid" && O?.sendShowGrid(!0);
	}
	async function fr() {
		try {
			let e = await fetch("/api/github/me");
			e.ok ? F(T, await e.json(), !0) : e.status !== 503 && F(T, null);
		} catch {
			F(T, null);
		}
	}
	let pr = null;
	async function mr() {
		try {
			let e = await fetch("/api/github/latest");
			e.ok && (pr = (await e.json()).head ?? null);
		} catch {}
	}
	async function hr(e) {
		if (!pr) return await mr(), {
			ok: await Be({
				title: X("confirm.conflictUnknown.title"),
				lines: [X("confirm.conflictUnknown.body"), X("confirm.conflictUnknown.warning")],
				okLabel: X("confirm.publishAnyway"),
				cancelLabel: X("confirm.cancel")
			}),
			head: pr
		};
		let t = null;
		try {
			let e = await fetch(`/api/github/latest?base=${pr}`);
			e.ok && (t = await e.json().catch(() => null));
		} catch {}
		if (!t?.head) return {
			ok: !0,
			head: null
		};
		let n = t.head;
		if (n === pr) return {
			ok: !0,
			head: n
		};
		let r = new Set(e.map((e) => e.path)), i = t.truncated ? [X("confirm.conflict.truncated")] : (t.changedFiles ?? []).filter((e) => r.has(e));
		return i.length === 0 ? {
			ok: !0,
			head: n
		} : {
			ok: await Be({
				title: X("confirm.conflict.title"),
				lines: [
					X("confirm.conflict.intro"),
					...i.map((e) => `• ${e}`),
					X("confirm.conflict.warning")
				],
				okLabel: X("confirm.publishAnyway"),
				cancelLabel: X("confirm.cancel")
			}),
			head: n
		};
	}
	let gr = /* @__PURE__ */ P(null), _r = /* @__PURE__ */ P(""), vr = /* @__PURE__ */ P(!1);
	async function yr() {
		F(_r, "");
		try {
			let e = await fetch("/api/github/history");
			e.ok ? F(gr, (await e.json()).commits, !0) : e.status === 401 ? (F(gr, [], !0), F(_r, X("status.historyLoginRequired"), !0)) : (F(gr, [], !0), F(_r, Di(await e.json().catch(() => null)) ?? X("status.historyFetchFailed"), !0));
		} catch {
			F(gr, [], !0), F(_r, X("status.historyUnavailable"), !0);
		}
	}
	let br = (() => {
		let e = {
			dateStyle: "short",
			timeStyle: "short"
		};
		try {
			return new Intl.DateTimeFormat(Oi(), e);
		} catch {
			return new Intl.DateTimeFormat(void 0, e);
		}
	})(), Sr = !1;
	async function wr() {
		let e = B(gr)?.[0];
		if (!(!e || B(vr)) && await Be({
			title: X("confirm.revert.title"),
			lines: [`«${e.message}»`, X("confirm.revert.body")],
			okLabel: X("confirm.revert.ok"),
			cancelLabel: X("confirm.cancel")
		})) {
			F(vr, !0), x(X("status.reverting"));
			try {
				let t = await fetch("/api/github/revert", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ expect: e.sha })
				});
				if (t.ok) {
					let { sha: e } = await t.json().catch(() => ({}));
					e ? pr = e : mr(), Sr = !0, x(X("status.revertDone"), "ok"), Tr();
				} else t.status === 409 ? x(X("status.revertConflict"), "error") : x(Di(await t.json().catch(() => null)) ?? X("status.revertFailed"), "error");
			} catch {
				x(X("status.publishLayerUnreachable"), "error");
			}
			F(vr, !1), yr();
		}
	}
	async function Tr() {
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
				x(X("status.revertDeployed"), "ok");
				for (let e of Object.keys(localStorage).filter((e) => e.startsWith("urd-draft-"))) localStorage.removeItem(e);
				await new Promise((e) => setTimeout(e, 800)), location.reload();
				return;
			}
		}
		x(X("status.revertDeployTimeout"), "error");
	}
	let Er = /* @__PURE__ */ P(null), Dr = /* @__PURE__ */ P(null), Or = /* @__PURE__ */ P(!1), kr = /* @__PURE__ */ P(nn(/* @__PURE__ */ new Set()));
	async function Ar() {
		F(Or, !0), F(Dr, null), F(Er, null);
		try {
			let e = await fetch("/api/github/update"), t = await e.json().catch(() => null);
			e.ok ? (F(Er, t, !0), F(kr, /* @__PURE__ */ new Set(), !0)) : F(Dr, Di(t) ?? X("update.checkFailed"), !0);
		} catch {
			F(Dr, X("status.publishLayerUnreachable"), !0);
		}
		F(Or, !1);
	}
	function H(e) {
		let t = new Set(B(kr));
		t.has(e) ? t.delete(e) : t.add(e), F(kr, t, !0);
	}
	async function jr() {
		if (!B(Er) || B(Er).upToDate || B(Or)) return;
		let e = [...B(kr)], t = B(Er).changes.filter((e) => !B(kr).has(e.path)), n = t.filter((e) => e.atom && e.conflict);
		if (await Be({
			title: X("confirm.update.title"),
			lines: [X("confirm.update.body", {
				target: B(Er).target,
				writes: t.filter((e) => e.action === "write").length,
				deletes: t.filter((e) => e.action === "delete").length
			}), ...n.length > 0 ? [X("confirm.update.warnEdited", { paths: n.map((e) => e.path).join(", ") })] : []],
			okLabel: X("confirm.update.ok"),
			cancelLabel: X("confirm.cancel")
		})) {
			F(Or, !0), x(X("update.running", { target: B(Er).target }));
			try {
				let t = await fetch("/api/github/update", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({
						to: B(Er).target,
						expect: B(Er).head,
						skip: e
					})
				}), n = await t.json().catch(() => null);
				t.ok ? (x(X("update.committed", { target: B(Er).target }), "ok"), await Nr(B(Er).target.replace(/^v/, ""))) : t.status === 409 ? (x(Di(n) ?? X("update.checkFailed"), "error"), await Ar()) : x(Di(n) ?? X("update.failed"), "error");
			} catch {
				x(X("status.publishLayerUnreachable"), "error");
			}
			F(Or, !1);
		}
	}
	async function Nr(e) {
		for (let t = 0; t < 18; t++) {
			await new Promise((e) => setTimeout(e, 1e4));
			try {
				if ((await (await fetch("/urd.json", { cache: "no-store" })).json())?.engine === e) {
					x(X("update.deployed"), "ok"), await new Promise((e) => setTimeout(e, 800)), location.reload();
					return;
				}
			} catch {}
		}
		x(X("update.deployTimeout"), "error");
	}
	let Pr = null;
	function Fr(e) {
		return {
			schemaVersion: 1,
			meta: {
				id: e.id,
				title: e.title
			},
			sections: [{
				id: Ba("sec"),
				version: 1,
				preset: "tom",
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
	async function Ir(e, { keepHistory: t = !1 } = {}) {
		F(g, e, !0), Pr = (async () => {
			let n = Se(), r = null;
			try {
				let e = await fetch(`/${n.file}`);
				e.ok && (r = Pa(await e.json(), ve.data));
			} catch {}
			r ? xe.delete(e) : r = Fr(n), D = Mi(`urd-draft-${e}`, () => r, S), (D.data.schemaVersion ?? 1) > 1 && (console.warn(`Urd: utkastet for '${e}' har schemaVersion ${D.data.schemaVersion} (motoren har 1) og forkastes`), D.replace(structuredClone(r))), D.replace(Pa(D.data, ve.data)), D.save(), t || (Ee = null), F(Ht, null), F(Ut, null), Ce(), he(), F(v, "");
		})(), await Pr;
	}
	function Lr() {
		O?.destroy(), B(w)?.contentDocument?.addEventListener("pointerdown", () => {
			B(ht) && F(ht, null);
		}, !0), O = Ca(B(w), {
			onEdit: Lu,
			onMove: Ru,
			onGrow: zu,
			onDelete: Yu,
			onAddSection: Wu,
			onMoveSection: Gu,
			onDeleteSection: Ku,
			onSectionSize: qu,
			onUndo: (e) => e.redo ? Fe() : Ne(),
			onSelectSection: tn,
			onSelectBlock: mt,
			onBlockMenu: _t,
			onReady: zr,
			onNavigate: qr,
			onAddBlock: (e) => $u(e.sectionId, e.block),
			onAddBlocks: (e) => ed(e.sectionId, e.blocks, e.minBottom, e.moves),
			onRequestBlock: sd,
			onMoveBlockSection: Ju,
			onMobileManual: Bu,
			onMobileAuto: Vu,
			onReviewDone: Hu,
			onBlockFlag: Uu,
			onCollectionEdit: ba,
			onSaveTemplate: pa,
			onDeleteTemplate: ha,
			onApplyLayout: ge,
			onPluginBlocks: (e) => {
				F(nd, e.blocks ?? [], !0);
			},
			onNavWidth: (e) => Jr("edit:nav-width", () => {
				B(k).nav.style ??= {}, B(k).nav.style.width = e.width;
			})
		});
	}
	async function zr() {
		await Pr, await Ia, O?.sendPlugins(Ve(B(Ra))?.enabled ?? []), O?.sendViewport(B(te)), va(), la(), ve.hasDraft() && be();
		let e = !B(h).pages.some((e) => e.id === B(g));
		(D.hasDraft() || e) && O?.sendPage(B(g), D.data), B(E) || O?.sendChrome(!1), B(Qe) === "grid" && O?.sendShowGrid(!0), B(Br) && O?.sendShowGuides(!0), f();
	}
	let Br = /* @__PURE__ */ P(localStorage.getItem("urd-guides") === "1"), Vr = /* @__PURE__ */ P(!1), Ur = /* @__PURE__ */ P(nn(localStorage.getItem("urd-layout-picker") === "menu" ? "menu" : "strip"));
	function Wr(e) {
		F(Ur, e === "menu" ? "menu" : "strip", !0), B(Ur) === "menu" ? localStorage.setItem("urd-layout-picker", "menu") : localStorage.removeItem("urd-layout-picker");
	}
	let Gr = /* @__PURE__ */ P(null);
	xn(() => {
		if (!B(Vr)) return;
		let e = (e) => {
			B(Gr)?.contains(e.target) || F(Vr, !1);
		}, t = (e) => {
			e.key === "Escape" && F(Vr, !1);
		}, n = () => {
			F(Vr, !1);
		};
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t), window.addEventListener("blur", n), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t), window.removeEventListener("blur", n);
		};
	});
	function Kr() {
		F(Br, !B(Br)), localStorage.setItem("urd-guides", B(Br) ? "1" : "0"), O?.sendShowGuides(B(Br));
	}
	function qr(e) {
		let t = e.path.replace(/\/$/, "") || "/", n = B(k).pages.find((e) => e.path === t);
		n && n.id !== B(g) && Ir(n.id);
	}
	function Jr(e, t) {
		Oe(e), t(), ve.save(), Ce(), be();
	}
	let Yr = /* @__PURE__ */ P(""), Xr = /* @__PURE__ */ P(null), Zr = Object.fromEntries(No.map((e) => [e.id, jo(Po(e.id, {
		pageId: "forhandsvisning",
		title: ""
	}))])), Qr = /* @__PURE__ */ P(null);
	xn(() => {
		if (!B(Qr)) return;
		let e = (e) => {
			e.target.closest?.(".page-menu-wrap") || F(Qr, null);
		}, t = (e) => {
			e.key === "Escape" && F(Qr, null);
		}, n = () => {
			F(Qr, null);
		};
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t), window.addEventListener("blur", n), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t), window.removeEventListener("blur", n);
		};
	});
	let ei = [
		"admin",
		"api",
		"assets",
		"content",
		"media",
		"plugins",
		"functions",
		"readme"
	];
	function ni(e, t = null) {
		return e ? ei.includes(e) ? X("error.reservedName", { slug: e }) : B(k).pages.some((n) => n.id !== t && (n.path === `/${e}` || n.id === e)) ? X("error.pageExists") : null : X("error.pageNeedsName");
	}
	function ri() {
		let e = B(Yr).trim(), t = ta(e), n = ni(t);
		if (n) {
			x(n, "error");
			return;
		}
		let r = B(Xr) && !B(Xr).startsWith("preset:") ? ia[B(Xr)]?.data?.page : null, i = B(Xr)?.startsWith("preset:") ? Po(B(Xr).slice(7), {
			pageId: t,
			title: e
		}) ?? Fr({
			id: t,
			title: e
		}) : r ? lo(Pa(JSON.parse(JSON.stringify(r)), ve.data), Ba, {
			id: t,
			title: e
		}) : Fr({
			id: t,
			title: e
		});
		Jr("pages", () => {
			B(k).pages.push({
				id: t,
				title: e,
				path: `/${t}`,
				file: `content/pages/${t}.json`
			}), B(k).nav.items.push({
				label: e,
				page: t
			});
		}), C(`urd-draft-${t}`, JSON.stringify(i)), Ce(), F(Yr, ""), F(Xr, null), Ir(t);
	}
	async function ii(e) {
		F(Qr, null), await ma("page", e.id === B(g) ? JSON.parse(JSON.stringify(D.data)) : await si(e));
	}
	function ai(e, t) {
		let n = t.trim();
		if (!n || n === e.title) return;
		let r = e.title;
		Jr("pages", () => {
			e.title = n;
			for (let t of B(k).nav.items) t.page === e.id && t.label === r && (t.label = n);
		}), e.id === B(g) ? (D.data.meta.title = n, D.save(), Ce(), O?.sendPage(B(g), D.data)) : ci(e, (e) => {
			e.meta.title = n;
		});
	}
	async function si(e) {
		let t = localStorage.getItem(`urd-draft-${e.id}`);
		if (t) try {
			return JSON.parse(t);
		} catch {}
		try {
			let t = await fetch(`/${e.file}`);
			if (t.ok) return Pa(await t.json(), ve.data);
		} catch {}
		return Fr(e);
	}
	async function ci(e, t) {
		let n = await si(e);
		t(n), C(`urd-draft-${e.id}`, JSON.stringify(n)), Ce();
	}
	function li(e, t) {
		let n = ta(t);
		if (e.path === "/" || `/${n}` === e.path) return;
		let r = ni(n, e.id);
		if (r) {
			x(r, "error");
			return;
		}
		Jr("pages", () => {
			e.path = `/${n}`;
		});
	}
	function di(e) {
		e.path !== "/" && (Jr("pages", () => {
			B(k).pages = B(k).pages.filter((t) => t.id !== e.id), B(k).nav.items = B(k).nav.items.filter((t) => t.page !== e.id || t.children);
			for (let t of B(k).nav.items) t.page === e.id && delete t.page, t.children && (t.children = t.children.filter((t) => t.page !== e.id), t.children.length === 0 && delete t.children);
			B(k).nav.items = B(k).nav.items.filter((e) => e.page || e.href || e.children);
		}), e.id === B(g) && Ir(B(k).pages[0].id), x(X("status.pageRemoved")));
	}
	function fi(e) {
		Jr("edit:nav-logo", () => {
			B(k).nav.logo = {
				type: "text",
				value: "",
				...B(k).nav.logo,
				...e
			};
		});
	}
	function pi(e) {
		Jr("nav", () => {
			B(k).nav.logo ??= {
				type: "text",
				value: B(k).site.title
			};
			let t = B(k).nav.logo, n = t.type === "image";
			e === "both" ? (n && (t.image = t.value, t.value = B(k).site.title), t.image ??= "", t.size ??= 32) : e === "image" ? (n || (t.value = t.image ?? ""), delete t.image, t.size ??= 32) : (n && (t.value = B(k).site.title), delete t.image), t.type = e;
		});
	}
	async function hi(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", t) try {
			let e = await jn(t);
			Jr("nav", () => {
				let t = B(k).nav.logo;
				t.type === "both" ? t.image = e.dataUrl : t.value = e.dataUrl;
			});
		} catch {
			x(X("status.imageReadErrorSvg"), "error");
		}
	}
	let gi = /* @__PURE__ */ P(null);
	async function _i(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", !t) return;
		if (t.type === "image/svg+xml" || /\.svg$/i.test(t.name || "")) {
			try {
				let e = await An(t);
				F(gi, e.dataUrl, !0);
			} catch {
				x(X("status.imageReadErrorSvg"), "error");
			}
			return;
		}
		let n = new FileReader();
		n.onload = () => {
			F(gi, String(n.result), !0);
		}, n.onerror = () => x(X("status.imageReadError"), "error"), n.readAsDataURL(t);
	}
	function vi(e) {
		Jr("edit:site-icon", () => {
			B(k).site.icon = e;
		}), F(gi, null);
	}
	function yi() {
		Jr("edit:site-icon", () => {
			delete B(k).site.icon;
		});
	}
	function bi(e) {
		Jr("edit:site-title", () => {
			B(k).site.title = e;
		});
	}
	function xi(e) {
		Jr("edit:site-desc", () => {
			B(k).site.description = e;
		});
	}
	function Si() {
		let e = B(k).site.lang ?? "no";
		return e === "no" ? "nb" : e;
	}
	function Ci() {
		let e = Si(), t = rt([...nt, ...ot()]);
		return [...t.some(([t]) => t === e) ? [] : [[e, e]], ...t];
	}
	function wi(e) {
		Jr("site", () => {
			B(k).site.lang = e;
		});
	}
	let Ti = /^(?:data:image\/[\w.+-]+;base64,[A-Za-z0-9+/=]+|\/(?!\/)[\w%./-]*)$/;
	xn(() => {
		if (!B(k)?.site) return;
		let e = B(k).site.icon, t = document.querySelector("link[rel=\"icon\"]");
		if (t) {
			if (typeof e != "string" || !e) {
				t.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230b0e14'/%3E%3Cpath d='M19.2 51.2V16l25.6 10.4V51.2' fill='none' stroke='%2315b39a' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";
				return;
			}
			Ti.test(e) && (t.href = e);
		}
	});
	function Ei(e) {
		Jr("nav", () => {
			B(k).nav.layout = e;
		});
	}
	function ki(e, t) {
		Jr(`edit:nav-style-${e}`, () => {
			B(k).nav.style ??= {}, t === void 0 ? delete B(k).nav.style[e] : B(k).nav.style[e] = t;
		});
	}
	let Ai = /* @__PURE__ */ N(() => B(k)?.nav?.variant === "side-left" || B(k)?.nav?.variant === "side-right"), ji = /* @__PURE__ */ N(() => [
		"floating",
		"floating-square",
		"floating-tab"
	].includes(B(k)?.nav?.variant)), Ni = {
		underline: [X("hoverColor.underline.label"), X("hoverColor.underline.title")],
		pill: [X("hoverColor.pill.label"), X("hoverColor.pill.title")],
		lift: [X("hoverColor.lift.label"), X("hoverColor.lift.title")]
	}, Pi = /* @__PURE__ */ N(() => Ni[B(k)?.nav?.style?.hover] ?? null);
	function Fi(e) {
		Jr("nav", () => {
			e === "bar" ? delete B(k).nav.variant : B(k).nav.variant = e;
		});
	}
	function Ii(e) {
		Jr("nav", () => {
			B(k).nav.style ??= {}, e ? B(k).nav.style.glow = !0 : delete B(k).nav.style.glow;
		});
	}
	function Li(e) {
		Jr("nav", () => {
			B(k).nav.style ??= {}, e ? delete B(k).nav.style.topGap : B(k).nav.style.topGap = !1;
		});
	}
	function Ri(e) {
		Jr("nav", () => {
			B(k).nav.style ??= {}, e === "standard" ? delete B(k).nav.style.hover : B(k).nav.style.hover = e;
		});
	}
	let zi = null, Bi = {}, Vi = {}, Hi = !1, Ui = /* @__PURE__ */ P(nn([])), Gi = /* @__PURE__ */ P(nn({})), Ki = /* @__PURE__ */ P(null), qi = /* @__PURE__ */ P(""), Yi = /* @__PURE__ */ P("news"), Xi = [
		["news", X("collectionKind.news")],
		["notices", X("collectionKind.notices")],
		["publications", X("collectionKind.publications")],
		["custom", X("collectionKind.custom")]
	], ra = null, ia = {}, aa = {}, oa = !1, sa = /* @__PURE__ */ P(nn([]));
	async function ca() {
		let e = {
			version: 1,
			maler: []
		};
		try {
			e = await (await fetch("/content/maler.json")).json();
		} catch {}
		ra = Mi("urd-draft-maler", () => e, S), F(sa, [...ra.data.maler ?? []], !0);
		for (let e of B(sa)) {
			let t = null;
			try {
				t = await (await fetch(`/content/maler/${e}.json`)).json();
			} catch {}
			aa[e] = t, ia[e] = Mi(`urd-draft-mal-${e}`, () => t, S), (ia[e].data?.schemaVersion ?? 1) > 1 && ia[e].reset();
		}
		oa = !0, la();
	}
	function la() {
		let e = B(sa).map((e) => ia[e]?.data ? {
			id: e,
			...JSON.parse(JSON.stringify(ia[e].data))
		} : null).filter(Boolean).map(({ id: e, mal: t, section: n, blocks: r, page: i }) => ({
			id: e,
			name: t.name,
			kind: t.kind,
			section: n,
			blocks: r,
			page: i
		}));
		O?.sendMaler(e);
	}
	function pa(e) {
		let t = so.includes(e.kind) ? e.kind : "section";
		return ma(t, e[t]);
	}
	async function ma(e, t) {
		if (!t || !ra) return;
		let n = (await He({
			title: X("canvas.templateNamePrompt"),
			placeholder: X("ph.templateName")
		}))?.trim();
		if (!n) return;
		let r = co(n);
		if (!r) {
			x(X("status.invalidName"), "error");
			return;
		}
		if (B(sa).includes(r)) {
			x(X("status.templateExists"), "error");
			return;
		}
		Oe("maler");
		let i = {
			schemaVersion: 1,
			mal: {
				name: n,
				kind: e
			},
			[e]: t
		};
		ia[r] = Mi(`urd-draft-mal-${r}`, () => null, S), ia[r].replace(i), ia[r].save(), ra.data.maler = [...B(sa), r], ra.save(), F(sa, [...B(sa), r], !0), x(X("status.templateSaved", { name: n }), "ok"), Ce(), la();
	}
	async function ha(e) {
		let t = ia[e.id]?.data?.mal;
		t && await Be({ title: X("confirm.deleteTemplate", { name: t.name }) }) && (Oe("maler"), B(Xr) === e.id && F(Xr, null), localStorage.removeItem(`urd-draft-mal-${e.id}`), delete ia[e.id], ra.data.maler = B(sa).filter((t) => t !== e.id), ra.save(), F(sa, B(sa).filter((t) => t !== e.id), !0), Ce(), la());
	}
	async function ga() {
		let e = {
			version: 1,
			samlinger: []
		};
		try {
			e = await (await fetch("/content/samlinger.json")).json();
		} catch {}
		zi = Mi("urd-draft-samlinger", () => e, S), F(Ui, [...zi.data.samlinger ?? []], !0);
		for (let e of B(Ui)) {
			let t = null;
			try {
				t = await (await fetch(`/content/samlinger/${e}.json`)).json();
			} catch {}
			Vi[e] = t, Bi[e] = Mi(`urd-draft-samling-${e}`, () => t, S), !t && !Bi[e].data && (Bi[e].replace({
				schemaVersion: 1,
				id: e,
				name: e,
				kind: "custom",
				entries: []
			}), Bi[e].save());
		}
		Hi = !0, _a();
	}
	function _a(e = !0) {
		let t = {};
		for (let e of B(Ui)) Bi[e] && (t[e] = JSON.parse(JSON.stringify(Bi[e].data)));
		F(Gi, t, !0), e && va();
	}
	function va() {
		O?.sendCollections(Ve(B(Gi)) ?? {});
	}
	function ya(e, t, n, r = !0) {
		let i = Bi[e];
		i && (Oe(t), n(i.data), i.save(), Ce(), _a(r));
	}
	function ba(e) {
		let { collection: t, entryId: n, field: r, value: i } = e;
		[
			"title",
			"text",
			"image",
			"imageAlt",
			"imageStyle"
		].includes(r) && (r === "title" && !String(i ?? "").replace(/<[^>]*>/g, "").trim() || ya(t, `edit:samling:${t}:${n}:${r}`, (e) => {
			let t = e.entries.find((e) => e.id === n);
			t && (i === "" && r !== "title" ? delete t[r] : t[r] = i);
		}, r === "image"));
	}
	function xa() {
		let e = B(qi).trim();
		if (!e) return;
		let t = ta(e);
		if (!t || B(Ui).includes(t)) {
			x(X(t ? "status.collectionExists" : "status.invalidName"), "error");
			return;
		}
		Oe("samlinger");
		let n = {
			schemaVersion: 1,
			id: t,
			name: e,
			kind: B(Yi),
			entries: []
		};
		Bi[t] = Mi(`urd-draft-samling-${t}`, () => null, S), Bi[t].replace(n), Bi[t].save(), zi.data.samlinger = [...B(Ui), t], zi.save(), F(Ui, [...B(Ui), t], !0), F(Ki, t, !0), F(qi, ""), Ce(), _a();
	}
	function wa(e) {
		Oe("samlinger"), localStorage.removeItem(`urd-draft-samling-${e}`), delete Bi[e], zi.data.samlinger = B(Ui).filter((t) => t !== e), zi.save(), F(Ui, B(Ui).filter((t) => t !== e), !0), B(Ki) === e && F(Ki, null), Ce(), _a();
	}
	function Ea(e) {
		ya(e, `samling:${e}:add-entry`, (e) => {
			e.entries.unshift({
				id: Ba("innslag"),
				title: X("seed.newEntry"),
				date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
				text: ""
			});
		});
	}
	function Da(e, t, n, r) {
		ya(e, `edit:samling:${e}:${t}:${n}`, (e) => {
			let i = e.entries.find((e) => e.id === t);
			i && (r === "" && n !== "title" ? delete i[n] : i[n] = r);
		});
	}
	function Oa(e, t, n) {
		ya(e, `samling:${e}:move-entry`, (e) => {
			let r = t + n;
			r < 0 || r >= e.entries.length || ([e.entries[t], e.entries[r]] = [e.entries[r], e.entries[t]]);
		});
	}
	function ka(e, t) {
		ya(e, `samling:${e}:remove-entry`, (e) => {
			e.entries = e.entries.filter((e) => e.id !== t);
		});
	}
	async function ja(e, t, n) {
		let r = n.target.files?.[0];
		n.target.value = "", r && Da(e, t, "image", (await jn(r)).dataUrl);
	}
	let Ma = null, Fa, Ia = new Promise((e) => {
		Fa = e;
	}), Ra = /* @__PURE__ */ P(null), Va = nn({}), Q = /* @__PURE__ */ P("0.0.0"), $ = /* @__PURE__ */ P(""), Ha = /* @__PURE__ */ P(""), Ua = /* @__PURE__ */ P(nn([])), Wa = /* @__PURE__ */ P(nn([])), Ga = /* @__PURE__ */ P("pending"), Ka = () => [.../* @__PURE__ */ new Set([...B(Ra)?.enabled ?? [], ...B(Ra)?.disabled ?? []])];
	function qa() {
		F(Ra, JSON.parse(JSON.stringify(Ma.data)), !0);
	}
	let Ja = /* @__PURE__ */ P(null);
	async function Ya() {
		try {
			let e = (await fetch("/urd.json", { cache: "no-store" })).headers.get("content-security-policy");
			if (!e) {
				F(Ja, { unknown: !0 }, !0);
				return;
			}
			let t = (t) => new Set((e.split(";").map((e) => e.trim()).find((e) => e.startsWith(`${t} `)) ?? "").split(/\s+/).slice(1));
			F(Ja, {
				frameSrc: t("frame-src"),
				connectSrc: t("connect-src")
			}, !0);
		} catch {
			F(Ja, { unknown: !0 }, !0);
		}
	}
	function Xa(e) {
		let t = [...(e.connectSrc ?? []).map((e) => ["connect-src", e]), ...(e.frameSrc ?? []).map((e) => ["frame-src", e])];
		if (!B(Ja) || B(Ja).unknown) return [];
		let n = {
			"connect-src": B(Ja).connectSrc,
			"frame-src": B(Ja).frameSrc
		};
		return t.filter(([e, t]) => !n[e]?.has(t)).map(([e, t]) => `${e} ${t}`);
	}
	async function Za() {
		Ya();
		let e = {
			version: 1,
			enabled: []
		};
		try {
			e = await (await fetch("/plugins/plugins.json")).json();
		} catch {}
		F(Wa, e.enabled ?? [], !0), Ma = Mi("urd-draft-plugins", () => e, S), qa();
		try {
			F(Q, (await (await fetch("/urd.json")).json()).engine ?? "0.0.0", !0);
		} catch {}
		for (let e of Ka()) eo(e);
		Qa(), Fa(), O?.sendPlugins(Ve(B(Ra))?.enabled ?? []);
	}
	async function Qa() {
		try {
			let e = await fetch("/api/github/plugins");
			if (!e.ok) {
				$a();
				return;
			}
			let { plugins: t } = await e.json();
			localStorage.setItem("urd-plugins-found", JSON.stringify(t ?? [])), F(Ua, (t ?? []).filter((e) => !Ka().includes(e)), !0);
			for (let e of B(Ua)) eo(e);
			F(Ga, "ok");
		} catch {
			$a();
		}
	}
	function $a() {
		try {
			let e = JSON.parse(localStorage.getItem("urd-plugins-found") ?? "[]");
			if (Array.isArray(e) && e.length) {
				F(Ua, e.filter((e) => !Ka().includes(e)), !0);
				for (let e of B(Ua)) eo(e);
				F(Ga, "ok");
				return;
			}
		} catch {}
		F(Ga, "unavailable");
	}
	async function eo(e) {
		try {
			let t = await (await fetch(`/plugins/${e}/plugin.json`)).json(), n = za(t);
			Va[e] = {
				...t,
				errors: n,
				satisfied: n.length === 0 && La(B(Q), t.requiresEngine)
			};
		} catch {
			Va[e] = {
				name: e,
				errors: [X("plugin.manifestNotFound", { id: e })],
				satisfied: !1
			};
		}
	}
	function to(e, t) {
		Oe("plugins");
		let n = Ma.data;
		n.enabled = (n.enabled ?? []).filter((t) => t !== e), n.disabled = (n.disabled ?? []).filter((t) => t !== e), t ? n.enabled.push(e) : n.disabled.push(e), Ma.save(), Ce(), qa(), no();
	}
	function no() {
		B(w) && (B(w).src = B(w).src);
	}
	function ro(e) {
		Oe("plugins");
		let t = Ma.data;
		t.enabled = (t.enabled ?? []).filter((t) => t !== e), t.disabled = (t.disabled ?? []).filter((t) => t !== e), Ma.save(), Ce(), qa(), no();
	}
	async function io() {
		F(Ha, "");
		let e = B($).trim().toLowerCase();
		if (!/^[a-z0-9][a-z0-9-]*$/.test(e)) {
			F(Ha, X("plugin.invalidId"), !0);
			return;
		}
		if (Ka().includes(e)) {
			F(Ha, X("plugin.alreadyListed"), !0);
			return;
		}
		if (await eo(e), Va[e].errors.length) {
			F(Ha, X("plugin.invalidManifest", { errors: Va[e].errors.join("; ") }), !0);
			return;
		}
		to(e, !0), F($, "");
	}
	function ao(e) {
		F(Ua, B(Ua).filter((t) => t !== e), !0), to(e, !0);
	}
	function oo(e, t) {
		Jr(e, () => {
			B(k).footer ??= {
				version: 1,
				show: !1,
				text: "",
				align: "center"
			}, t(B(k).footer);
		});
	}
	function uo(e, t) {
		oo(`edit:footer-brand-${e}`, (n) => {
			n.brand ??= {}, t.trim() ? n.brand[e] = t : delete n.brand[e], !n.brand.title && !n.brand.tagline && !n.brand.logo && delete n.brand;
		});
	}
	function fo(e) {
		oo("footer", (t) => {
			t.brand ??= {}, e === "image" || e === "both" ? t.brand.mode = e : delete t.brand.mode;
		});
	}
	async function po(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", t) try {
			let e = await jn(t);
			oo("footer", (t) => {
				t.brand ??= {}, t.brand.logo = e.dataUrl, t.brand.mode || (t.brand.mode = "both");
			});
		} catch {
			x(X("status.imageReadErrorSvg"), "error");
		}
	}
	function mo() {
		oo("footer", (e) => {
			e.brand && (delete e.brand.logo, delete e.brand.mode, delete e.brand.logoHeight, !e.brand.title && !e.brand.tagline && delete e.brand);
		});
	}
	function ho(e) {
		oo("edit:footer-logo-height", (t) => {
			t.brand ??= {};
			let n = Number(e);
			Number.isFinite(n) && (t.brand.logoHeight = Math.min(160, Math.max(16, Math.round(n))));
		});
	}
	function go(e) {
		oo("edit:footer-copyright", (t) => {
			e.trim() ? t.copyright = e : delete t.copyright;
		});
	}
	let _o = [
		{
			id: "minimal",
			label: X("footerTemplate.minimal"),
			thumb: {
				center: !0,
				social: 2,
				baselineLinks: 1
			}
		},
		{
			id: "sentrert",
			label: X("footerTemplate.sentrert"),
			thumb: {
				center: !0,
				row: !0,
				social: 3
			}
		},
		{
			id: "kolonner",
			label: X("footerTemplate.kolonner"),
			thumb: {
				tag: !0,
				cols: 3,
				social: 3,
				baselineLinks: 2
			}
		},
		{
			id: "sitemap",
			label: X("footerTemplate.sitemap"),
			thumb: {
				tag: !0,
				fat: !0,
				cols: 4,
				social: 4,
				baselineLinks: 3
			}
		},
		{
			id: "nyhetsbrev",
			label: X("footerTemplate.nyhetsbrev"),
			thumb: {
				tag: !0,
				cta: !0,
				cols: 2,
				social: 2,
				baselineLinks: 1
			}
		},
		{
			id: "storcta",
			label: X("footerTemplate.storcta"),
			thumb: {
				center: !0,
				bigcta: !0,
				baselineLinks: 2
			}
		},
		{
			id: "kontakt",
			label: X("footerTemplate.kontakt"),
			thumb: {
				tag: !0,
				cols: 3,
				social: 2,
				baselineLinks: 1
			}
		},
		{
			id: "mega",
			label: X("footerTemplate.mega"),
			thumb: {
				tag: !0,
				mega: !0,
				cols: 2,
				social: 4,
				baselineLinks: 2
			}
		}
	];
	function vo(e) {
		let t = X("seed.orgName"), n = B(k).pages ?? [], r = (e) => n.slice(0, e).map((e) => ({
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
			baseline: [a(X("seed.footer.privacy"), "#")]
		} : e === "sentrert" ? {
			align: "center",
			brand: { title: t },
			linkRow: r(5),
			social: i([
				"facebook",
				"instagram",
				"x"
			]),
			copyright: `${o} · ${X("seed.footer.madeWith")}`
		} : e === "kolonner" ? {
			align: "left",
			brand: {
				title: t,
				tagline: X("seed.footer.tagline1")
			},
			columns: [
				{
					title: X("seed.footer.colPages"),
					links: r(4)
				},
				{
					title: X("seed.footer.colCompany"),
					links: [
						a(X("seed.footer.about"), "#"),
						a(X("seed.join"), "#"),
						a(X("seed.footer.press"), "#")
					]
				},
				{
					title: X("seed.footer.colResources"),
					links: [
						a(X("seed.footer.bylaws"), "#"),
						a(X("seed.footer.privacy"), "#"),
						a(X("seed.footer.contact"), "#")
					]
				}
			],
			social: i([
				"facebook",
				"instagram",
				"linkedin"
			]),
			copyright: o,
			baseline: [a(X("seed.footer.privacy"), "#"), a(X("seed.footer.terms"), "#")]
		} : e === "sitemap" ? {
			align: "left",
			brand: {
				title: t,
				tagline: X("seed.footer.tagline2")
			},
			columns: [
				{
					title: X("seed.footer.colExplore"),
					links: [
						a(X("seed.footer.home"), "#"),
						a(X("seed.footer.events"), "#"),
						a(X("seed.footer.gallery"), "#"),
						a(X("seed.footer.blog"), "#")
					]
				},
				{
					title: X("seed.footer.colCompany"),
					links: [
						a(X("seed.footer.about"), "#"),
						a(X("seed.footer.history"), "#"),
						a(X("seed.footer.press"), "#"),
						a(X("seed.footer.contact"), "#")
					]
				},
				{
					title: X("seed.footer.colSupport"),
					links: [
						a(X("seed.join"), "#"),
						a(X("seed.footer.faq"), "#"),
						a(X("seed.footer.help"), "#")
					]
				},
				{
					title: X("seed.footer.colLegal"),
					links: [
						a(X("seed.footer.privacy"), "#"),
						a(X("seed.footer.terms"), "#"),
						a(X("seed.footer.bylaws"), "#")
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
				a(X("seed.footer.privacy"), "#"),
				a(X("seed.footer.terms"), "#"),
				a(X("seed.footer.cookies"), "#")
			]
		} : e === "nyhetsbrev" ? {
			align: "left",
			brand: {
				title: t,
				tagline: X("seed.footer.tagline3")
			},
			cta: {
				kind: "newsletter",
				heading: X("seed.footer.newsletterHeading"),
				label: X("seed.footer.newsletterButton"),
				recipient: X("seed.email"),
				success: X("seed.footer.newsletterSuccess")
			},
			columns: [{
				title: X("seed.footer.colPages"),
				links: r(4)
			}, {
				title: X("seed.footer.colMore"),
				links: [
					a(X("seed.footer.about"), "#"),
					a(X("seed.footer.contact"), "#"),
					a(X("seed.footer.privacy"), "#")
				]
			}],
			social: i(["facebook", "instagram"]),
			copyright: o,
			baseline: [a(X("seed.footer.privacy"), "#")]
		} : e === "storcta" ? {
			align: "center",
			cta: {
				kind: "button",
				big: !0,
				heading: X("seed.footer.ctaHeading"),
				sub: X("seed.footer.ctaSub"),
				label: X("seed.join"),
				href: "#"
			},
			linkRow: r(4),
			social: i([
				"facebook",
				"instagram",
				"x"
			]),
			copyright: o,
			baseline: [a(X("seed.footer.privacy"), "#"), a(X("seed.footer.terms"), "#")]
		} : e === "kontakt" ? {
			align: "left",
			brand: {
				title: t,
				tagline: X("seed.footer.tagline4")
			},
			columns: [
				{
					title: X("seed.footer.colVisit"),
					links: [
						a(X("seed.footer.address"), "#"),
						a(X("seed.email"), "mailto:post@dinforening.no"),
						a("+47 22 00 00 00", "tel:+4722000000")
					]
				},
				{
					title: X("seed.footer.colHours"),
					links: [a(X("seed.footer.hours1"), "#"), a(X("seed.footer.hours2"), "#")]
				},
				{
					title: X("seed.footer.colPages"),
					links: r(4)
				}
			],
			social: i(["facebook", "instagram"]),
			copyright: o,
			baseline: [a(X("seed.footer.privacy"), "#")]
		} : {
			align: "left",
			brand: {
				title: t,
				tagline: X("seed.footer.tagline5")
			},
			columns: [{
				title: X("seed.footer.colExplore"),
				links: r(4)
			}, {
				title: X("seed.footer.colFollow"),
				links: [a(X("seed.footer.newsletter"), "#"), a(X("seed.email"), "mailto:post@dinforening.no")]
			}],
			social: i([
				"facebook",
				"instagram",
				"linkedin",
				"youtube"
			]),
			copyright: o,
			baseline: [a(X("seed.footer.privacy"), "#"), a(X("seed.footer.madeWith"), "#")],
			background: {
				version: 1,
				layers: [{
					type: "glow",
					version: ss.version ?? 1,
					props: {
						...ss.defaults(),
						color: "accent",
						x: .12,
						y: 0,
						radius: .6,
						opacity: .45
					}
				}, {
					type: "grain",
					version: ls.version ?? 1,
					props: {
						...ls.defaults(),
						opacity: .08
					}
				}]
			}
		};
	}
	function yo(e) {
		oo("footer-template", (t) => {
			let n = vo(e);
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
	function bo(e) {
		oo("footer", (t) => {
			t[e] ??= [], t[e].push(B(k).pages[0] ? {
				label: X("seed.link"),
				page: B(k).pages[0].id
			} : {
				label: X("seed.link"),
				href: "https://"
			});
		});
	}
	function xo(e, t) {
		oo("footer", (n) => {
			n[e].splice(t, 1), n[e].length || delete n[e];
		});
	}
	function So(e, t, n) {
		oo("footer", (r) => {
			let i = r[e], a = t + n;
			a < 0 || a >= i.length || ([i[t], i[a]] = [i[a], i[t]]);
		});
	}
	function Co(e, t, n) {
		oo(`edit:footer-${e}-label-${t}`, (r) => {
			r[e][t].label = n;
		});
	}
	function wo(e, t, n) {
		oo("footer", (r) => {
			let i = r[e][t];
			n === "__href" ? (delete i.page, i.href = i.href ?? "https://") : (i.page = n, delete i.href);
		});
	}
	function To(e, t, n) {
		oo(`edit:footer-${e}-href-${t}`, (r) => {
			r[e][t].href = n;
		});
	}
	function Eo(e) {
		oo("footer", (t) => {
			e === "center" ? t.columnsAlign = "center" : delete t.columnsAlign;
		});
	}
	function Do(e) {
		oo("footer", (t) => {
			e ? t.cta ??= {
				kind: "button",
				label: X("seed.join")
			} : delete t.cta;
		});
	}
	function Oo(e, t) {
		oo(`edit:footer-cta-${e}`, (n) => {
			n.cta ??= {}, t === "" || t == null || t === !1 ? delete n.cta[e] : n.cta[e] = t;
		});
	}
	function ko(e) {
		oo("footer", (t) => {
			t.cta ??= {}, e === "__href" ? (delete t.cta.page, t.cta.href = t.cta.href ?? "https://") : (t.cta.page = e, delete t.cta.href);
		});
	}
	function Ao(e, t) {
		oo("footer", (n) => {
			let r = new Set(n.hideOn ?? []);
			t ? r.delete(e) : r.add(e), r.size ? n.hideOn = [...r] : delete n.hideOn;
		});
	}
	function Mo() {
		oo("footer", (e) => {
			e.columns ??= [], e.columns.push({
				title: X("seed.column"),
				links: [{
					label: X("seed.link"),
					page: B(k).pages[0].id
				}]
			});
		});
	}
	function Fo(e) {
		oo("footer", (t) => {
			t.columns.splice(e, 1), t.columns.length || delete t.columns;
		});
	}
	function Io(e, t) {
		oo("footer", (n) => {
			let r = e + t;
			r < 0 || r >= n.columns.length || ([n.columns[e], n.columns[r]] = [n.columns[r], n.columns[e]]);
		});
	}
	function Ro(e, t) {
		oo(`edit:footer-col-title-${e}`, (n) => {
			n.columns[e].title = t;
		});
	}
	function zo(e) {
		oo("footer", (t) => {
			t.columns[e].links ??= [], t.columns[e].links.push({
				label: X("seed.link"),
				page: B(k).pages[0].id
			});
		});
	}
	function Bo(e, t) {
		oo("footer", (n) => {
			n.columns[e].links.splice(t, 1);
		});
	}
	function Ho(e, t, n) {
		oo("footer", (r) => {
			let i = r.columns[e].links, a = t + n;
			a < 0 || a >= i.length || ([i[t], i[a]] = [i[a], i[t]]);
		});
	}
	function Uo(e, t, n) {
		oo(`edit:footer-link-label-${e}-${t}`, (r) => {
			r.columns[e].links[t].label = n;
		});
	}
	function Yo(e, t, n) {
		oo("footer", (r) => {
			let i = r.columns[e].links[t];
			n === "__href" ? (delete i.page, i.href = i.href ?? "https://") : (i.page = n, delete i.href);
		});
	}
	function Xo(e, t, n) {
		oo(`edit:footer-link-href-${e}-${t}`, (r) => {
			r.columns[e].links[t].href = n;
		});
	}
	function Zo() {
		oo("footer", (e) => {
			e.social ??= [], e.social.push({
				icon: "facebook",
				url: "https://"
			});
		});
	}
	function Qo(e) {
		oo("footer", (t) => {
			t.social.splice(e, 1), t.social.length || delete t.social;
		});
	}
	function $o(e, t) {
		oo("footer", (n) => {
			let r = e + t;
			r < 0 || r >= n.social.length || ([n.social[e], n.social[r]] = [n.social[r], n.social[e]]);
		});
	}
	function es(e, t) {
		oo("footer", (n) => {
			n.social[e].icon = t;
		});
	}
	function ts(e, t) {
		oo(`edit:footer-social-url-${e}`, (n) => {
			n.social[e].url = t;
		});
	}
	let ns = da.filter(([e]) => e === "iconCat.social" || e === "iconCat.communication").flatMap(([, e]) => e.map((e) => [e, ua[e].label]));
	function rs(e, t) {
		Jr(`edit:nav-label-${e}`, () => {
			B(k).nav.items[e].label = t;
		});
	}
	function is(e, t) {
		Jr("nav", () => {
			let n = B(k).nav.items[e];
			t === "__href" ? (delete n.page, n.href = n.href ?? "https://") : t === "__none" ? (delete n.page, delete n.href) : (n.page = t, delete n.href);
		});
	}
	function as(e, t) {
		Jr(`edit:nav-href-${e}`, () => {
			B(k).nav.items[e].href = t;
		});
	}
	function cs(e, t) {
		let n = e + t, r = B(k).nav.items;
		n < 0 || n >= r.length || Jr("nav", () => {
			[r[e], r[n]] = [r[n], r[e]];
		});
	}
	function us(e) {
		Jr("nav", () => {
			B(k).nav.items.splice(e, 1);
		});
	}
	function ds() {
		Jr("nav", () => {
			B(k).nav.items.push({
				label: X("seed.link"),
				page: B(k).pages[0].id
			});
		});
	}
	function fs(e) {
		Jr("nav", () => {
			let t = B(k).nav.items[e];
			t.children ??= [], t.children.push({
				label: X("seed.link"),
				page: B(k).pages[0].id
			});
		});
	}
	function ps(e, t, n) {
		Jr(`edit:nav-child-label-${e}-${t}`, () => {
			B(k).nav.items[e].children[t].label = n;
		});
	}
	function ms(e, t, n) {
		Jr("nav", () => {
			let r = B(k).nav.items[e].children[t];
			n === "__href" ? (delete r.page, r.href = r.href ?? "https://") : (r.page = n, delete r.href);
		});
	}
	function hs(e, t, n) {
		Jr(`edit:nav-child-href-${e}-${t}`, () => {
			B(k).nav.items[e].children[t].href = n;
		});
	}
	function gs(e, t, n) {
		let r = t + n, i = B(k).nav.items[e].children;
		r < 0 || r >= i.length || Jr("nav", () => {
			[i[t], i[r]] = [i[r], i[t]];
		});
	}
	function _s(e, t) {
		Jr("nav", () => {
			let n = B(k).nav.items[e];
			n.children.splice(t, 1), n.children.length === 0 && (delete n.children, !n.page && !n.href && (n.page = B(k).pages[0].id));
		});
	}
	function vs(e, t) {
		Jr(`edit:theme-color-${e}`, () => {
			B(k).theme.tokens.color[e] = t, B(k).theme.alt?.auto && (B(k).theme.alt.tokens.color = Ss());
		});
	}
	function ys(e, t) {
		Jr("theme", () => {
			B(k).theme.tokens.font[e] = t;
		});
	}
	function bs(e, t) {
		Jr("theme", () => {
			B(k).theme.tokens.radius[e] = t;
		});
	}
	function xs(e) {
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
	function Ss() {
		return Object.fromEntries(Object.entries(B(k).theme.tokens.color).map(([e, t]) => [e, xs(t)]));
	}
	function Cs(e, t) {
		Jr(`edit:theme-alt-${e}`, () => {
			B(k).theme.alt.tokens.color[e] = t, B(k).theme.alt.auto = !1;
		});
	}
	function ws(e) {
		Jr("theme", () => {
			e === "light" ? delete B(k).theme.scheme : B(k).theme.scheme = e;
		});
	}
	function Ts(e) {
		Jr("theme", () => {
			e ? B(k).theme.alt = {
				auto: !0,
				tokens: { color: Ss() }
			} : delete B(k).theme.alt;
		});
	}
	function Es(e) {
		Jr("theme", () => {
			B(k).theme.alt ??= { tokens: { color: Ss() } }, B(k).theme.alt.auto = e, e && (B(k).theme.alt.tokens.color = Ss());
		});
	}
	function Ds(e) {
		let t = B(k).theme.tokens.font[e];
		return [...Bs.some(([, e]) => e === t) ? [] : [[t, X("opt.customFont")]], ...Bs.map(([e, t]) => [t, X(e)])];
	}
	let Os = (e) => parseInt(e, 10) || 0;
	function ks(e, t) {
		bs(e, `${t}px`);
	}
	let As = (e, t) => e && t && t[e] ? t[e] : e, Ms = [
		"bg",
		"surface",
		"text",
		"accent",
		"accent-text"
	], Ns = [
		{
			id: "bronn",
			name: X("themePreset.bronn.name"),
			note: X("themePreset.bronn.note"),
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
			id: "stein",
			name: X("themePreset.stein.name"),
			note: X("themePreset.stein.note"),
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
			id: "plomme",
			name: X("themePreset.plomme.name"),
			note: X("themePreset.plomme.note"),
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
			name: X("themePreset.rose.name"),
			note: X("themePreset.rose.note"),
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
			id: "hav",
			name: X("themePreset.hav.name"),
			note: X("themePreset.hav.note"),
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
			id: "natt",
			name: X("themePreset.natt.name"),
			note: X("themePreset.natt.note"),
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
	function Ps(e) {
		Jr("theme", () => {
			let t = e.scheme === "dark", n = t ? e.dark : e.light, r = t ? e.light : e.dark;
			for (let e of Ms) B(k).theme.tokens.color[e] = n[e];
			t ? B(k).theme.scheme = "dark" : delete B(k).theme.scheme, B(k).theme.alt = { tokens: { color: { ...r } } };
		});
	}
	let Ls = /* @__PURE__ */ N(() => {
		if (!B(k)) return null;
		let e = B(k).theme.tokens.color, t = B(k).theme.alt?.tokens?.color ?? {}, n = B(k).theme.scheme === "dark";
		return Ns.find((r) => {
			let i = n ? r.dark : r.light, a = n ? r.light : r.dark;
			return Ms.every((n) => e[n] === i[n] && t[n] === a[n]);
		})?.id ?? null;
	});
	function Rs() {
		F(E, !B(E)), O?.sendChrome(B(E));
	}
	function Lu(e) {
		let t = D.data.sections.find((t) => t.id === e.sectionId), n = t?.blocks.find((t) => t.id === e.blockId);
		n && (Oe(`edit:${e.blockId}`), n.props = e.props, D.save(), Ce(), B(j)?.blockId === e.blockId && pt(), e.rerender && O?.sendSection(B(g), t), F(v, ""));
	}
	function Ru(e) {
		let t = D.data.sections.find((t) => t.id === e.sectionId), n = t?.blocks.find((t) => t.id === e.blockId);
		if (!n) return;
		Oe(e.coalesce ? `edit:${e.groupKey ?? e.blockId}` : "move-block");
		let r = e.frameKey === "mobile" ? "mobile" : "desktop";
		n.frames[r] = e.frame, r === "desktop" && _e(t, "desktop-endret-etter-mobil"), D.save(), Ce(), B(j)?.blockId === e.blockId && pt();
	}
	function zu(e) {
		let t = D.data.sections.find((t) => t.id === e.sectionId)?.blocks.find((t) => t.id === e.blockId);
		!t?.frames?.desktop || t.frames.desktop.h === e.h || (D.amendBaseline((t) => {
			let n = t.sections.find((t) => t.id === e.sectionId)?.blocks.find((t) => t.id === e.blockId);
			n?.frames?.desktop && (n.frames.desktop.h = e.h);
		}), D.hasDraft() && Oe(`edit:${e.blockId}`), t.frames.desktop.h = e.h, D.save(), Ce(), B(j)?.blockId === e.blockId && pt());
	}
	function Bu(e) {
		let t = D.data.sections.find((t) => t.id === e.sectionId);
		if (t) {
			Oe("mobile-manual");
			for (let { blockId: n, frame: r } of e.frames) {
				let e = t.blocks.find((e) => e.id === n);
				e && (e.frames.mobile = r);
			}
			t.responsive = {
				...t.responsive ?? {},
				mobile: {
					mode: "manual",
					attention: t.responsive?.mobile?.attention ?? null
				}
			}, D.save(), Ce();
		}
	}
	function Vu(e) {
		let t = D.data.sections.find((t) => t.id === e.sectionId);
		if (t) {
			Oe("mobile-auto");
			for (let e of t.blocks) e.frames.mobile = null;
			t.responsive = {
				...t.responsive ?? {},
				mobile: {
					mode: "auto",
					attention: null
				}
			}, D.save(), Ce(), he(), O?.sendSection(B(g), t);
		}
	}
	function Hu(e) {
		let t = D.data.sections.find((t) => t.id === e.sectionId);
		t?.responsive?.mobile && (Oe("review-done"), t.responsive.mobile.attention = null, D.save(), Ce(), he());
	}
	function Uu(e) {
		let t = D.data.sections.find((t) => t.id === e.sectionId)?.blocks.find((t) => t.id === e.blockId);
		t && (Oe("decor"), t.decor = e.decor, D.save(), Ce(), B(j)?.blockId === e.blockId && pt());
	}
	function Wu(e) {
		Oe("add-section"), e.section.id || (e.section.id = Ba("sec")), D.data.sections.splice(e.index, 0, e.section), D.save(), Ce(), O?.sendPage(B(g), D.data), F(Ht, e.section.id, !0), Yt(e.section), B(Qe) !== "properties" && (F(Qe, "properties"), O?.sendShowGrid(!1));
	}
	function Gu(e) {
		let t = D.data.sections, n = t.findIndex((t) => t.id === e.sectionId), r = n + e.dir;
		n < 0 || r < 0 || r >= t.length || (Oe("move-section"), [t[n], t[r]] = [t[r], t[n]], D.save(), Ce(), O?.sendPage(B(g), D.data));
	}
	function Ku(e) {
		Oe("delete-section"), e.sectionId === B(Ht) && (F(Ht, null), F(Ut, null)), B(j)?.sectionId === e.sectionId && F(j, null), D.data.sections = D.data.sections.filter((t) => t.id !== e.sectionId), D.save(), Ce(), O?.sendPage(B(g), D.data);
	}
	function qu(e) {
		let t = D.data.sections.find((t) => t.id === e.sectionId);
		if (t) {
			Oe("section-size"), t.size = {
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
			e.moves?.length && (_e(t, "seksjonshøyde"), B(j)?.sectionId === e.sectionId && pt()), e.sectionId === B(Ht) && F(Wt, e.minHeight, !0), D.save(), Ce();
		}
	}
	function Ju(e) {
		let t = D.data.sections.find((t) => t.id === e.fromSectionId), n = D.data.sections.find((t) => t.id === e.toSectionId), r = t?.blocks.find((t) => t.id === e.blockId);
		!t || !n || !r || (Oe("move-block"), t.blocks = t.blocks.filter((t) => t.id !== e.blockId), r.frames.desktop = e.frame, r.frames.mobile = null, n.blocks.push(r), _e(t, "blokk-flyttet"), _e(n, "blokk-flyttet"), D.save(), Ce(), he(), O?.sendPage(B(g), D.data), B(j)?.blockId === e.blockId && (F(j, {
			...B(j),
			sectionId: e.toSectionId
		}, !0), pt()));
	}
	function Yu(e) {
		let t = D.data.sections.find((t) => t.id === e.sectionId);
		if (!t) return;
		let n = e.blockIds ?? [e.blockId];
		Oe("delete-block"), t.blocks = t.blocks.filter((e) => !n.includes(e.id)), n.includes(B(j)?.blockId) && F(j, null), _e(t, "blokk-slettet"), D.save(), Ce(), O?.sendSection(B(g), t);
	}
	let Xu = {
		text: {
			type: "text",
			props: {
				html: X("seed.text"),
				align: "left"
			},
			w: 33,
			h: 28
		},
		"text-box": {
			type: "text",
			props: {
				html: X("seed.textBox"),
				align: "left",
				box: !0
			},
			w: 30,
			h: 150
		},
		button: {
			type: "button",
			props: {
				label: X("seed.newButton"),
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
			props: {
				glyph: "★",
				color: "accent",
				size: 48
			},
			w: 8,
			h: 64
		},
		samling: {
			type: "samling",
			props: {
				collection: null,
				view: "cards",
				limit: 6,
				newestFirst: !0
			},
			w: 90,
			h: 200
		},
		galleri: {
			type: "galleri",
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
						q: X("seed.faq.q1"),
						a: X("seed.faq.answer")
					},
					{
						q: X("seed.faq.q2"),
						a: X("seed.faq.answer")
					},
					{
						q: X("seed.faq.q3"),
						a: X("seed.faq.answer")
					}
				],
				multi: !1
			},
			w: 50,
			h: 220
		},
		tidslinje: {
			type: "tidslinje",
			props: {
				items: [
					{
						year: "2019",
						title: X("seed.tidslinje.t1"),
						text: X("seed.tidslinje.text")
					},
					{
						year: "2022",
						title: X("seed.tidslinje.t2"),
						text: X("seed.tidslinje.text")
					},
					{
						year: "2026",
						title: X("seed.tidslinje.t3"),
						text: X("seed.tidslinje.text")
					}
				],
				variant: "venstre",
				marker: "fylt",
				accent: null
			},
			w: 42,
			h: 260
		},
		sitat: {
			type: "sitat",
			props: {
				text: X("seed.sitat.text"),
				attribution: X("seed.sitat.name"),
				role: X("seed.sitat.role"),
				variant: "stor",
				image: "",
				accent: null
			},
			w: 44,
			h: 180
		},
		statistikk: {
			type: "statistikk",
			props: {
				value: "4800",
				prefix: "",
				suffix: "+",
				label: X("seed.statistikk.label"),
				countUp: !0
			},
			w: 20,
			h: 90
		}
	};
	function Zu(e) {
		let t = Xu[e];
		return t ? {
			id: Ba("blk"),
			type: t.type,
			version: 1,
			decor: !!t.decor,
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
	function Qu(e) {
		O ? O.sendPlaceBlock(e) : $u(cr()?.id, e);
	}
	function $u(e, t) {
		let n = D.data.sections.find((t) => t.id === e) ?? D.data.sections[0];
		if (!n) return;
		Oe("add-block");
		let r = Math.max(0, ...n.blocks.map((e) => e.frames?.desktop?.z ?? 1)) + 1;
		t.frames?.desktop && (t.frames.desktop = {
			...t.frames.desktop,
			z: r
		}), n.blocks.push(t), _e(n, "blokk-lagt-til"), D.save(), Ce(), O?.sendSection(B(g), n);
	}
	function ed(e, t, n, r) {
		let i = D.data.sections.find((t) => t.id === e);
		if (!i || !t?.length) return;
		Oe("add-blocks");
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
		}), _e(i, "blokk-lagt-til"), D.save(), Ce(), O?.sendSection(B(g), i);
	}
	function td(e) {
		Qu(Zu(e));
	}
	let nd = /* @__PURE__ */ P(nn([]));
	function rd(e, t = {}) {
		let n = Ve(e);
		Qu({
			id: Ba("blk"),
			type: n.type,
			version: n.version ?? 1,
			decor: !1,
			props: {
				...n.defaults ?? {},
				...Ve(t)
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
	let id = /* @__PURE__ */ P("");
	function ad() {
		let e = [
			{
				label: X("blocks.text"),
				act: "block",
				kind: "text"
			},
			{
				label: X("ui.textBox"),
				act: "block",
				kind: "text-box"
			},
			{
				label: X("blocks.button"),
				act: "block",
				kind: "button"
			},
			{
				label: X("blocks.image"),
				act: "image"
			},
			{
				label: X("blocks.video"),
				act: "block",
				kind: "video"
			},
			{
				label: X("blocks.icon"),
				act: "block",
				kind: "icon"
			},
			{
				label: X("blocks.samling"),
				act: "block",
				kind: "samling"
			},
			{
				label: X("blocks.faq"),
				act: "block",
				kind: "faq"
			},
			{
				label: X("blocks.tidslinje"),
				act: "block",
				kind: "tidslinje"
			},
			{
				label: X("blocks.sitat"),
				act: "block",
				kind: "sitat"
			},
			{
				label: X("blocks.statistikk"),
				act: "block",
				kind: "statistikk"
			},
			{
				label: X("ui.emptyGallery"),
				act: "block",
				kind: "galleri"
			},
			{
				label: X("ui.galleryWithImages"),
				act: "galleryImages"
			},
			{
				label: X("shape.line"),
				act: "block",
				kind: "shape-line"
			},
			{
				label: X("shape.arrow"),
				act: "block",
				kind: "shape-arrow"
			},
			{
				label: X("shape.circle"),
				act: "block",
				kind: "shape-circle"
			},
			{
				label: X("shape.rect"),
				act: "block",
				kind: "shape-rect"
			},
			{
				label: X("shape.triangle"),
				act: "block",
				kind: "shape-triangle"
			}
		];
		for (let t of B(sa)) {
			let n = ia[t]?.data?.mal;
			n?.kind === "blocks" && e.push({
				label: n.name,
				act: "mal",
				id: t
			});
		}
		for (let t of B(nd)) if (t.variants?.length) for (let n of t.variants) e.push({
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
	function od(e) {
		e.act === "block" ? td(e.kind) : e.act === "plugin" ? rd(e.entry, e.props ?? {}) : e.act === "mal" && O?.sendInsertTemplate(e.id);
	}
	function sd(e) {
		let t = Zu(e.kind);
		if (t) {
			if (e.at && typeof e.at.x == "number" && typeof e.at.y == "number") {
				let n = D.data.sections.find((t) => t.id === e.sectionId)?.grid ?? B(k).grid, r = Vs({
					x: e.at.x,
					y: e.at.y,
					w: t.frames.desktop.w,
					h: t.frames.desktop.h,
					grid: n
				});
				t.frames.desktop.x = r.x, t.frames.desktop.y = r.y;
			} else t.frames.desktop.x = Math.round((100 - t.frames.desktop.w) / 2 * 100) / 100, t.frames.desktop.y = 40;
			$u(e.sectionId, t), O?.sendSelect(t.id), e.kind === "image" && x(X("status.imageBlockAdded")), e.kind === "galleri" && x(X("status.galleryBlockAdded"));
		}
	}
	async function cd(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", !t) return;
		x(X("status.compressingImage"));
		let n;
		try {
			n = await jn(t);
		} catch {
			x(X("status.imageReadError"), "error");
			return;
		}
		let r = Math.round(n.height / n.width * .3 * (B(w)?.clientWidth ?? 1280));
		Qu({
			id: Ba("blk"),
			type: "image",
			version: 1,
			props: {
				src: n.dataUrl,
				alt: ta(t.name).replaceAll("-", " "),
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
		}), n.bytes > 4e5 ? x(X("status.imageLarge", { kb: Math.round(n.bytes / 1024) }), "error") : x("");
	}
	async function ld(e) {
		let t = [], n = 0, r = 0;
		for (let i of e) try {
			let e = await jn(i);
			e.bytes > 4e5 && (r += 1), t.push({
				src: e.dataUrl,
				alt: ta(i.name).replaceAll("-", " "),
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
	function ud(e, t, n) {
		t ? x(X("status.imagesReadFailed", { n: t }), "error") : n ? x(X("status.imagesLarge", { n }), "error") : x(e ? "" : X("status.noImagesAdded"));
	}
	async function dd(e) {
		let t = [...e.target.files ?? []];
		if (e.target.value = "", !t.length) return;
		x(X("status.compressingImages"));
		let { images: n, failed: r, big: i } = await ld(t);
		n.length && vt("galleri-add", (e) => {
			e.props.images.push(...n);
		}), ud(n.length, r, i);
	}
	async function fd(e) {
		let t = [...e.target.files ?? []];
		if (e.target.value = "", !t.length) return;
		x(X("status.compressingImages"));
		let { images: n, failed: r, big: i } = await ld(t);
		if (!n.length) {
			ud(0, r, i);
			return;
		}
		let a = Zu("galleri");
		a.props.images = n, Qu(a), ud(n.length, r, i);
	}
	function pd(e, t) {
		vt("galleri-move", (n) => {
			let r = e + t;
			r < 0 || r >= n.props.images.length || ([n.props.images[e], n.props.images[r]] = [n.props.images[r], n.props.images[e]]);
		});
	}
	function md(e) {
		vt("galleri-remove", (t) => {
			t.props.images.splice(e, 1);
		});
	}
	function hd(e, t, n) {
		vt(`edit:${B(j).blockId}:img${e}-${t}`, (r) => {
			r.props.images[e][t] = n;
		});
	}
	function gd(e, t, n, r) {
		let i = e?.[t];
		if (!i?.startsWith("data:image/")) return;
		let a = i.split(",", 2)[1], o = `media/${ta(n || "bilde")}-${na(a)}.${ea(i)}`;
		r.push({
			path: o,
			content: a,
			encoding: "base64"
		}), e[t] = `/${o}`;
	}
	function _d(e, t) {
		for (let n of e?.layers ?? []) if (n.type === "image" && gd(n.props, "src", "bakgrunn", t), n.type === "bildegalleri") for (let e of n.props.images ?? []) gd(e, "src", "bakgrunn", t);
	}
	function vd(e, t) {
		if (e.type === "image" && gd(e.props, "src", e.props.alt, t), e.type === "icon" && gd(e.props, "image", "ikon", t), e.type === "galleri") for (let n of e.props.images ?? []) gd(n, "src", n.alt || "galleri", t);
	}
	function yd(e, t) {
		_d(e.background, t);
		for (let n of e.blocks) vd(n, t);
	}
	function bd(e) {
		let t = [];
		for (let n of e.sections) yd(n, t);
		return t;
	}
	function xd(e) {
		let t = [], n = e.nav?.logo;
		return n?.type === "image" && gd(n, "value", "logo", t), n?.type === "both" && gd(n, "image", "logo", t), e.nav?.style && gd(e.nav.style, "image", "meny", t), _d(e.nav?.style?.background, t), _d(e.footer?.background, t), e.footer?.brand && gd(e.footer.brand, "logo", "footer-logo", t), gd(e.site, "icon", "ikon", t), t;
	}
	let Sd = /* @__PURE__ */ P(!1);
	function Cd() {
		if (!B(Sd)) {
			F(Sd, !0);
			return;
		}
		F(Sd, !1), wd();
	}
	xn(() => {
		if (!B(Sd)) return;
		let e = (e) => {
			e.target?.closest?.(".discard-btn") || F(Sd, !1);
		}, t = (e) => {
			e.key === "Escape" && F(Sd, !1);
		}, n = () => F(Sd, !1);
		return window.addEventListener("pointerdown", e, !0), window.addEventListener("keydown", t, !0), window.addEventListener("blur", n), () => {
			window.removeEventListener("pointerdown", e, !0), window.removeEventListener("keydown", t, !0), window.removeEventListener("blur", n);
		};
	});
	function wd() {
		Oe("discard");
		for (let e of B(k).pages) e.id !== B(g) && !xe.has(e.id) && localStorage.removeItem(`urd-draft-${e.id}`);
		let e = D.reset();
		if (ve.reset(), Ma && (Ma.reset(), qa()), zi) {
			zi.reset(), F(Ui, [...zi.data.samlinger ?? []], !0);
			for (let e of Object.keys(Bi)) B(Ui).includes(e) ? Bi[e].reset() : delete Bi[e];
			_a();
		}
		if (ra) {
			ra.reset(), F(sa, [...ra.data.maler ?? []], !0);
			for (let e of Object.keys(ia)) B(sa).includes(e) ? ia[e].reset() : (localStorage.removeItem(`urd-draft-mal-${e}`), delete ia[e]);
			la();
		}
		ye(), F(ee, {
			snap: !0,
			...B(k).grid
		}, !0), Ce(), F(v, ""), be(), B(k).pages.some((e) => e.id === B(g)) ? O?.sendPage(B(g), e) : Ir(B(k).pages[0].id);
	}
	async function Td() {
		if (Sr) {
			x(X("status.revertReloadBeforePublish"), "error");
			return;
		}
		if (B(Or)) {
			x(X("update.publishBlocked"), "error");
			return;
		}
		x(X("status.publishing"));
		let e = [], t = [], n = [], r = [];
		for (let i of B(k).pages) {
			let a = `urd-draft-${i.id}`, o = xe.has(i.id) || !B(h).pages.some((e) => e.id === i.id), s = null;
			if (i.id === B(g) && (D.hasDraft() || o)) s = D.data;
			else if (i.id !== B(g)) {
				let e = localStorage.getItem(a);
				if (e) try {
					s = Pa(JSON.parse(e), ve.data);
				} catch {}
			}
			if (!s && o && (s = Fr(i)), !s) continue;
			let c = JSON.parse(JSON.stringify(s));
			e.push(...bd(c)), e.push({
				path: i.file,
				content: JSON.stringify(c, null, 2) + "\n",
				encoding: "utf-8"
			}), t.push(i.title), o ? r.push(i.id) : n.push(a);
		}
		if (ve.hasDraft()) {
			let r = JSON.parse(JSON.stringify(B(k)));
			e.push(...xd(r)), e.push({
				path: "content/site.json",
				content: JSON.stringify(r, null, 2) + "\n",
				encoding: "utf-8"
			}), e.push({
				path: "content/theme.css",
				content: Vo(r.theme),
				encoding: "utf-8"
			}), n.push("urd-draft-site");
			let i = (e, t) => JSON.stringify(e ?? null) === JSON.stringify(t ?? null);
			i(B(h).theme, B(k).theme) || t.push("tema"), i(B(h).nav, B(k).nav) || t.push("menyen"), i(B(h).footer, B(k).footer) || t.push("footeren"), i(B(h).pages, B(k).pages) || t.push("sideregisteret"), i(B(h).grid, B(k).grid) || t.push("gridet"), (B(h).site.icon ?? null) !== (B(k).site.icon ?? null) && t.push("nettstedsikonet");
			let { icon: a, ...o } = B(h).site, { icon: s, ...c } = B(k).site;
			i(o, c) || t.push("nettstedsinfo");
		}
		let i = Object.entries(Bi).filter(([, e]) => e.hasDraft());
		if (i.length || zi?.hasDraft()) {
			for (let [t, r] of i) {
				let i = JSON.parse(JSON.stringify(r.data));
				for (let t of i.entries) gd(t, "image", t.title, e);
				e.push({
					path: `content/samlinger/${t}.json`,
					content: JSON.stringify(i, null, 2) + "\n",
					encoding: "utf-8"
				}), n.push(`urd-draft-samling-${t}`);
			}
			if (zi?.hasDraft()) {
				e.push({
					path: "content/samlinger.json",
					content: JSON.stringify(zi.data, null, 2) + "\n",
					encoding: "utf-8"
				}), n.push("urd-draft-samlinger");
				let t = { samlinger: [] };
				try {
					t = await (await fetch("/content/samlinger.json")).json();
				} catch {}
				let r = new Set(e.map((e) => e.path));
				for (let n of t.samlinger ?? []) {
					let t = `content/samlinger/${n}.json`;
					!B(Ui).includes(n) && !r.has(t) && e.push({
						path: t,
						delete: !0
					});
				}
			}
			t.push("samlinger");
		}
		let a = Object.entries(ia).filter(([, e]) => e.hasDraft());
		if (a.length || ra?.hasDraft()) {
			for (let [t, r] of a) {
				let i = JSON.parse(JSON.stringify(r.data));
				i.section && yd(i.section, e);
				for (let t of i.blocks ?? []) vd(t, e);
				for (let t of i.page?.sections ?? []) yd(t, e);
				e.push({
					path: `content/maler/${t}.json`,
					content: JSON.stringify(i, null, 2) + "\n",
					encoding: "utf-8"
				}), n.push(`urd-draft-mal-${t}`);
			}
			if (ra?.hasDraft()) {
				e.push({
					path: "content/maler.json",
					content: JSON.stringify(ra.data, null, 2) + "\n",
					encoding: "utf-8"
				}), n.push("urd-draft-maler");
				let t = { maler: [] };
				try {
					t = await (await fetch("/content/maler.json")).json();
				} catch {}
				let r = new Set(e.map((e) => e.path));
				for (let n of t.maler ?? []) {
					let t = `content/maler/${n}.json`;
					!B(sa).includes(n) && !r.has(t) && e.push({
						path: t,
						delete: !0
					});
				}
			}
			t.push("maler");
		}
		Ma?.hasDraft() && (e.push({
			path: "plugins/plugins.json",
			content: JSON.stringify(Ma.data, null, 2) + "\n",
			encoding: "utf-8"
		}), n.push("urd-draft-plugins"), t.push("plugins"));
		try {
			let t = await (await fetch("/index.html")).text();
			for (let n of B(k).pages) n.path !== "/" && e.push({
				path: `${n.path.slice(1)}/index.html`,
				content: t,
				encoding: "utf-8"
			});
		} catch {}
		let o = new Set(e.map((e) => e.path)), s = (t) => {
			o.has(t) || e.push({
				path: t,
				delete: !0
			});
		};
		for (let e of B(h).pages) {
			let t = B(k).pages.find((t) => t.id === e.id);
			t ? t.path !== e.path && e.path !== "/" && s(`${e.path.slice(1)}/index.html`) : (s(e.file), e.path !== "/" && s(`${e.path.slice(1)}/index.html`));
		}
		let c = await hr(e);
		if (!c.ok) {
			x(X("status.publishAborted"), "error");
			return;
		}
		let l = {
			message: `Oppdater ${t.join(", ") || "nettstedet"} via Urd-admin`,
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
			e ? pr = e : mr(), bd(D.data), xd(B(k));
			for (let e of n) localStorage.removeItem(e);
			for (let e of r) xe.add(e);
			if (F(h, JSON.parse(JSON.stringify(B(k))), !0), ve = Mi("urd-draft-site", () => B(h), S), ye(), Ma) {
				let e = JSON.parse(JSON.stringify(Ma.data));
				Ma = Mi("urd-draft-plugins", () => e, S), qa();
			}
			if (zi) {
				for (let e of Object.values(Bi)) for (let t of e.data.entries) gd(t, "image", t.title, []);
				let e = JSON.parse(JSON.stringify(zi.data));
				zi = Mi("urd-draft-samlinger", () => e, S), Vi = {};
				for (let e of B(Ui)) {
					if (!Bi[e]) continue;
					let t = JSON.parse(JSON.stringify(Bi[e].data));
					Vi[e] = t, Bi[e] = Mi(`urd-draft-samling-${e}`, () => t, S);
				}
				_a();
			}
			if (ra) {
				for (let e of Object.values(ia)) {
					e.data?.section && yd(e.data.section, []);
					for (let t of e.data?.blocks ?? []) vd(t, []);
					for (let t of e.data?.page?.sections ?? []) yd(t, []);
				}
				let e = JSON.parse(JSON.stringify(ra.data));
				ra = Mi("urd-draft-maler", () => e, S), aa = {};
				for (let e of B(sa)) {
					if (!ia[e]) continue;
					let t = JSON.parse(JSON.stringify(ia[e].data));
					aa[e] = t, ia[e] = Mi(`urd-draft-mal-${e}`, () => t, S);
				}
				la();
			}
			F(ee, {
				snap: !0,
				...B(k).grid
			}, !0);
			let t = JSON.parse(JSON.stringify(D.data));
			D = Mi(`urd-draft-${B(g)}`, () => t, S), xe.has(B(g)) && C(`urd-draft-${B(g)}`, JSON.stringify(t)), Ce(), x(X("status.published"), "ok");
		} else if (u?.status === 401) {
			let e = await u.json().catch(() => null);
			x(e?.code === "loginExpired" ? X("status.loginExpired") : X("status.loginRequired", { reason: Di(e) ?? X("status.unknownReason") }), "error"), await fr();
		} else u?.status === 403 ? x(Di(await u.json().catch(() => null)) ?? X("status.noPublishAccess"), "error") : u?.status === 409 ? x(X("status.publishRace"), "error") : x(u ? Di(await u.json().catch(() => null)) ?? X("status.publishFailed") : X("status.publishUnavailable"), "error");
	}
	Re();
	var Ed = Iu();
	Cr("keydown", rn, Le), Cr("pointerdown", rn, Ie);
	var Dd = L(Ed), Od = I(Dd), kd = (e) => {
		var t = Xc(), n = I(t);
		K(n, () => c.pencil);
		var r = R(n);
		A(t), z((e, n) => {
			Y(t, "title", e), W(r, ` ${n ?? ""}`);
		}, [() => X("tip.backToEdit"), () => X("ui.edit")]), V("click", t, Rs), U(e, t);
	};
	G(Od, (e) => {
		B(E) || e(kd);
	});
	var Ad = R(Od, 2);
	let jd;
	var Md = I(Ad), Nd = R(I(Md), 2), Pd = (e) => {
		var t = Zc(), n = L(t), r = I(n, !0);
		A(n);
		var i = R(n, 2), a = I(i);
		let o;
		K(a, () => c.desktop, !0), A(a);
		var s = R(a, 2);
		let l;
		K(s, () => c.phone, !0), A(s), A(i);
		var u = R(i, 2), d = I(u);
		let f;
		K(d, () => c.fit, !0), A(d);
		var p = R(d, 2);
		K(p, () => c.minus, !0), A(p);
		var m = R(p, 2), h = I(m);
		A(m);
		var g = R(m, 2);
		K(g, () => c.plus, !0), A(g), A(u);
		var _ = R(u, 2);
		let v;
		K(_, () => c.guides, !0), A(_), z((e, t, i, c, u, y, b, x, S, C) => {
			Y(n, "title", e), W(r, t), o = $r(a, 1, "ghost svelte-1n46o8q", null, o, { active: B(te) === "desktop" }), Y(a, "title", i), l = $r(s, 1, "ghost svelte-1n46o8q", null, l, { active: B(te) === "mobile" }), Y(s, "title", c), f = $r(d, 1, "ghost svelte-1n46o8q", null, f, { active: B(oe) === "fit" }), Y(d, "title", u), Y(p, "title", y), Y(m, "title", b), W(h, `${x ?? ""}%`), Y(g, "title", S), v = $r(_, 1, "ghost guides-btn svelte-1n46o8q", null, v, { active: B(Br) }), Y(_, "title", C);
		}, [
			() => X("tip.switchPage"),
			() => Se()?.title ?? "",
			() => X("tip.desktopView"),
			() => X("tip.mobileView"),
			() => X("tip.zoomFit"),
			() => X("tip.zoomOut"),
			() => X("tip.zoomCurrent"),
			() => Math.round(B(le) * 100),
			() => X("tip.zoomIn"),
			() => X("tip.guides")
		]), V("click", n, () => dt("pages")), V("click", a, () => F(te, "desktop")), V("click", s, () => F(te, "mobile")), V("click", d, () => F(oe, "fit")), V("click", p, () => ue(-1)), V("click", g, () => ue(1)), V("click", _, Kr), U(e, t);
	};
	G(Nd, (e) => {
		B(h) && e(Pd);
	});
	var Fd = R(Nd, 2), Id = (e) => {
		var t = Qc(), n = I(t);
		K(n, () => c.phone);
		var r = R(n);
		A(t), z((e, n) => {
			Y(t, "title", e), W(r, ` ${n ?? ""}`);
		}, [() => X("tip.attention"), () => X(B(me) === 1 ? "ui.attentionOne" : "ui.attentionMany", { n: B(me) })]), V("click", t, () => F(te, "mobile")), U(e, t);
	};
	G(Fd, (e) => {
		B(me) > 0 && e(Id);
	});
	var Ld = R(Fd, 2), Rd = (e) => {
		var t = $c(), n = L(t), r = I(n, !0);
		A(n);
		var i = R(n, 2);
		let a;
		var o = I(i, !0);
		A(i), z((e, t, n) => {
			W(r, e), a = $r(i, 1, "ghost discard-btn svelte-1n46o8q", null, a, { armed: B(Sd) }), Y(i, "title", t), W(o, n);
		}, [
			() => X("ui.unpublished"),
			() => B(Sd) ? X("tip.discardArmed") : X("tip.discard"),
			() => B(Sd) ? X("ui.discardConfirm") : X("ui.discard")
		]), V("click", i, Cd), U(e, t);
	};
	G(Ld, (e) => {
		B(_) && e(Rd);
	}), A(Md);
	var zd = R(Md, 2), Bd = I(zd), Vd = (e) => {
		var t = rl(), n = L(t), r = I(n), i = (e) => {
			var t = el(), n = L(t);
			K(n, () => c.eye);
			var r = R(n);
			z((e) => W(r, ` ${e ?? ""}`), [() => X("ui.cleanView")]), U(e, t);
		}, a = (e) => {
			var t = el(), n = L(t);
			K(n, () => c.pencil);
			var r = R(n);
			z((e) => W(r, ` ${e ?? ""}`), [() => X("ui.edit")]), U(e, t);
		};
		G(r, (e) => {
			B(E) ? e(i) : e(a, -1);
		}), A(n);
		var o = R(n, 2), s = (e) => {
			var t = tl(), n = I(t), r = (e) => {
				var t = Mr();
				K(L(t), () => c.warn), U(e, t);
			};
			G(n, (e) => {
				B(T).allowed || e(r);
			});
			var i = R(n, 1, !0);
			A(t), z((e) => {
				Y(t, "title", e), W(i, B(T).login);
			}, [() => B(T).allowed ? X("tip.hasPublishAccess") : X("tip.noPublishAccess")]), U(e, t);
		}, l = (e) => {
			var t = nl(), n = I(t, !0);
			A(t), z((e) => W(n, e), [() => X("ui.loginGitHub")]), U(e, t);
		};
		G(o, (e) => {
			B(T)?.loggedIn ? e(s) : B(T) && e(l, 1);
		});
		var u = R(o, 2), d = I(u, !0);
		A(u);
		var f = R(u, 2), p = I(f, !0);
		A(f), z((e, t, r, i) => {
			Y(n, "title", e), Y(u, "href", t), W(d, r), f.disabled = !B(_), W(p, i);
		}, [
			() => B(E) ? X("tip.chromeHide") : X("tip.chromeShow"),
			() => Se()?.path ?? "/",
			() => X("ui.viewSite"),
			() => X("ui.publish")
		]), V("click", n, Rs), V("click", f, Td), U(e, t);
	};
	G(Bd, (e) => {
		B(h) && e(Vd);
	}), A(zd), A(Ad);
	var Hd = R(Ad, 2), Ud = (e) => {
		var t = ku(), i = I(t), o = (e) => {
			var t = Ou(), i = L(t), o = I(i);
			Hr(o, 17, () => $e, Rr, (e, t, n) => {
				var r = ol(), i = L(r), a = (e) => {
					U(e, il());
				};
				G(i, (e) => {
					n > 0 && e(a);
				}), Hr(R(i, 2), 16, () => B(t), (e) => e, (e, t) => {
					var n = al();
					let r;
					var i = I(n, !0);
					A(n), z(() => {
						r = $r(n, 1, "svelte-1n46o8q", null, r, { active: B(Qe) === t }), W(i, et[t]);
					}), V("click", n, () => dt(t)), U(e, n);
				}), U(e, r);
			});
			var s = R(o, 2), f = I(s);
			let p;
			K(f, () => c.gear, !0), A(f);
			var h = R(f, 2), _ = (e) => {
				var t = sl(), n = I(t), r = I(n, !0);
				A(n);
				var i = R(n, 2), a = I(i);
				Z(R(a), {
					get value() {
						return B(u);
					},
					get options() {
						return l;
					},
					onchange: (e) => F(u, e, !0)
				}), A(i);
				var o = R(i, 2), s = I(o), c = R(s);
				{
					let e = /* @__PURE__ */ N(() => [["auto", X("lang.auto")], ...at()]);
					Z(c, {
						get value() {
							return lt;
						},
						get options() {
							return B(e);
						},
						onchange: ut
					});
				}
				A(o);
				var d = R(o, 2), f = I(d), p = R(f);
				{
					let e = /* @__PURE__ */ N(() => [["strip", X("settings.layoutPickerStrip")], ["menu", X("settings.layoutPickerMenu")]]);
					Z(p, {
						get value() {
							return B(Ur);
						},
						get options() {
							return B(e);
						},
						onchange: Wr
					});
				}
				A(d), A(t), z((e, t, n, c, l, u, p) => {
					W(r, e), Y(i, "title", t), W(a, `${n ?? ""} `), Y(o, "title", c), W(s, `${l ?? ""} `), Y(d, "title", u), W(f, `${p ?? ""} `);
				}, [
					() => X("settings.title"),
					() => X("topbar.adminTheme.title"),
					() => X("settings.theme"),
					() => X("topbar.language.title"),
					() => X("settings.language"),
					() => X("tip.settings.layoutPicker"),
					() => X("settings.layoutPicker")
				]), U(e, t);
			};
			G(h, (e) => {
				B(Vr) && e(_);
			}), A(s), mi(s, (e) => F(Gr, e), () => B(Gr)), A(i);
			var v = R(i, 2), y = (e) => {
				var t = Du(), i = I(t), o = I(i, !0);
				A(i);
				var s = R(i, 2), l = (e) => {
					var t = gl(), n = I(t);
					Hr(n, 17, () => B(k).pages, (e) => e.id, (e, t) => {
						var n = fl();
						let r;
						var i = I(n);
						q(i);
						var a = R(i, 2), o = (e) => {
							var t = cl();
							z((e) => Y(t, "title", e), [() => X("tip.pages.homeLocked")]), U(e, t);
						}, s = (e) => {
							var n = ll();
							q(n), z((e, t) => {
								J(n, e), Y(n, "title", t);
							}, [() => B(t).path.slice(1), () => X("tip.pages.slug")]), V("change", n, (e) => li(B(t), e.target.value)), U(e, n);
						};
						G(a, (e) => {
							B(t).path === "/" ? e(o) : e(s, -1);
						});
						var l = R(a, 2), u = I(l);
						K(u, () => c.right, !0), A(u);
						var d = R(u, 2), f = I(d);
						K(f, () => c.kebab, !0), A(f);
						var p = R(f, 2), m = (e) => {
							var n = dl(), r = I(n), i = I(r);
							K(i, () => c.bookmark);
							var a = R(i);
							A(r);
							var o = R(r, 2), s = (e) => {
								var n = ul(), r = I(n);
								K(r, () => c.cross);
								var i = R(r);
								A(n), z((e, t) => {
									Y(n, "title", e), W(i, ` ${t ?? ""}`);
								}, [() => X("tip.pages.delete"), () => X("ui.deletePage")]), V("click", n, () => {
									F(Qr, null), di(B(t));
								}), U(e, n);
							};
							G(o, (e) => {
								B(t).path !== "/" && e(s);
							}), A(n), z((e) => W(a, ` ${e ?? ""}`), [() => X("ui.savePageTemplate")]), V("click", r, () => ii(B(t))), U(e, n);
						};
						G(p, (e) => {
							B(Qr) === B(t).id && e(m);
						}), A(d), A(l), A(n), z((e, a, o) => {
							r = $r(n, 1, "page-row svelte-1n46o8q", null, r, { current: B(t).id === B(g) }), J(i, B(t).title), Y(i, "title", e), Y(u, "title", a), u.disabled = B(t).id === B(g), Y(f, "title", o);
						}, [
							() => X("tip.pages.title"),
							() => X("tip.pages.open"),
							() => X("tip.pages.menu")
						]), V("change", i, (e) => ai(B(t), e.target.value)), V("click", u, () => Ir(B(t).id)), V("click", f, () => F(Qr, B(Qr) === B(t).id ? null : B(t).id, !0)), U(e, n);
					});
					var r = R(n, 4);
					q(r);
					var i = R(r, 2), a = I(i, !0);
					A(i);
					var o = R(i, 2), s = I(o, !0);
					A(o);
					var l = R(o, 2), u = I(l);
					let d;
					var f = I(u), p = I(f);
					K(p, () => jo({ sections: [] }), !0), A(p);
					var m = R(p, 2), h = I(m, !0);
					A(m), A(f), A(u), Hr(R(u, 2), 17, () => No, (e) => e.id, (e, t) => {
						var n = pl();
						let r;
						var i = I(n), a = I(i);
						K(a, () => Zr[B(t).id], !0), A(a);
						var o = R(a, 2), s = I(o, !0);
						A(o), A(i), A(n), z((e, a) => {
							r = $r(n, 1, "page-mal-card svelte-1n46o8q", null, r, { picked: B(Xr) === `preset:${B(t).id}` }), Y(i, "title", e), W(s, a);
						}, [() => X("tip.pages.templatePick", { name: X(B(t).labelKey) }), () => X(B(t).labelKey)]), V("click", i, () => F(Xr, B(Xr) === `preset:${B(t).id}` ? null : `preset:${B(t).id}`, !0)), U(e, n);
					}), A(l);
					var _ = R(l, 2), v = (e) => {
						var t = hl(), n = L(t), r = I(n, !0);
						A(n);
						var i = R(n, 2);
						Hr(i, 20, () => B(sa).filter((e) => ia[e]?.data?.mal?.kind === "page"), (e) => e, (e, t) => {
							var n = ml();
							let r;
							var i = I(n), a = I(i);
							K(a, () => jo(ia[t].data.page), !0), A(a);
							var o = R(a, 2), s = I(o, !0);
							A(o), A(i);
							var l = R(i, 2);
							K(l, () => c.cross, !0), A(l), A(n), z((e, a) => {
								r = $r(n, 1, "page-mal-card svelte-1n46o8q", null, r, { picked: B(Xr) === t }), Y(i, "title", e), W(s, ia[t].data.mal.name), Y(l, "title", a);
							}, [() => X("tip.pages.templatePick", { name: ia[t].data.mal.name }), () => X("canvas.deleteTemplate")]), V("click", i, () => F(Xr, B(Xr) === t ? null : t, !0)), V("click", l, () => ha({ id: t })), U(e, n);
						}), A(i), z((e) => W(r, e), [() => X("canvas.tabMyTemplates")]), U(e, t);
					}, y = /* @__PURE__ */ N(() => B(sa).some((e) => ia[e]?.data?.mal?.kind === "page"));
					G(_, (e) => {
						B(y) && e(v);
					}), A(t), z((e, t, n, o, c, l, p) => {
						Y(r, "placeholder", e), Y(i, "title", t), i.disabled = n, W(a, o), W(s, c), d = $r(u, 1, "page-mal-card svelte-1n46o8q", null, d, { picked: B(Xr) === null }), Y(f, "title", l), W(h, p);
					}, [
						() => X("ph.newPageName"),
						() => X("hint.pages.autoMenu"),
						() => !B(Yr).trim(),
						() => X("ui.createPage"),
						() => X("canvas.tabPresets"),
						() => X("tip.pages.blankPick"),
						() => X("ui.blankPage")
					]), V("keydown", r, (e) => e.key === "Enter" && ri()), ui(r, () => B(Yr), (e) => F(Yr, e)), V("click", i, ri), V("click", f, () => F(Xr, null)), U(e, t);
				}, u = (e) => {
					var t = Cl(), r = I(t), i = I(r), a = I(i, !0);
					A(i);
					var o = R(i, 2), s = I(o), l = I(s), u = R(l);
					{
						let e = /* @__PURE__ */ N(() => B(k).nav.logo?.type ?? "text"), t = /* @__PURE__ */ N(() => [
							["text", X("blocks.text")],
							["image", X("blocks.image")],
							["both", X("opt.logo.both")]
						]);
						Z(u, {
							get value() {
								return B(e);
							},
							get options() {
								return B(t);
							},
							onchange: (e) => pi(e)
						});
					}
					A(s);
					var d = R(s, 2), f = (e) => {
						var t = _l(), n = L(t);
						q(n);
						var r = R(n, 2), i = I(r);
						{
							let e = /* @__PURE__ */ N(() => X("tip.nav.logoFont")), t = /* @__PURE__ */ N(() => B(k).nav.logo?.font ?? ""), n = /* @__PURE__ */ N(() => [["", X("common.inherit")], ...Bs.map(([e, t]) => [t, X(e)])]);
							Z(i, {
								get title() {
									return B(e);
								},
								get value() {
									return B(t);
								},
								get options() {
									return B(n);
								},
								onchange: (e) => fi({ font: e || void 0 })
							});
						}
						var a = R(i, 2);
						q(a);
						var o = R(a, 2);
						let s;
						var c = I(o), l = I(c, !0);
						A(c), A(o);
						var u = R(o, 2);
						let d;
						var f = I(u), p = I(f, !0);
						A(f), A(u), A(r), z((e, t, r, i, c, f, m) => {
							J(n, B(k).nav.logo?.value ?? ""), Y(n, "placeholder", e), Y(a, "title", t), J(a, B(k).nav.logo?.textSize ?? ""), s = $r(o, 1, "tbtn svelte-1n46o8q", null, s, { active: B(k).nav.logo?.bold !== !1 }), Y(o, "title", r), W(l, i), d = $r(u, 1, "tbtn svelte-1n46o8q", null, d, c), Y(u, "title", f), W(p, m);
						}, [
							() => X("ph.nav.logoName"),
							() => X("tip.nav.textSize"),
							() => X("format.bold"),
							() => X("format.boldLetter"),
							() => ({ active: !!B(k).nav.logo?.italic }),
							() => X("format.italic"),
							() => X("format.italicLetter")
						]), V("input", n, (e) => fi({ value: e.target.value })), V("change", a, (e) => fi({ textSize: e.target.value ? Number(e.target.value) : void 0 })), V("click", o, () => fi({ bold: B(k).nav.logo?.bold === !1 })), V("click", u, () => fi({ italic: !B(k).nav.logo?.italic })), U(e, t);
					};
					G(d, (e) => {
						(B(k).nav.logo?.type ?? "text") !== "image" && e(f);
					});
					var p = R(d, 2), m = (e) => {
						var t = vl(), n = I(t), r = I(n), i = R(r);
						A(n);
						var a = R(n, 2);
						q(a);
						var o = R(a, 2);
						q(o), A(t), z((e, t, i, s) => {
							Y(n, "title", e), W(r, `${t ?? ""} `), Y(a, "title", i), J(a, B(k).nav.logo?.size ?? 32), Y(o, "title", s), J(o, B(k).nav.logo?.radius ?? 0);
						}, [
							() => X("tip.webpAuto"),
							() => (B(k).nav.logo?.type === "image" ? B(k).nav.logo?.value : B(k).nav.logo?.image) ? X("ui.changeImage") : X("ui.chooseImage"),
							() => X("tip.nav.logoHeight"),
							() => X("tip.nav.logoRadius")
						]), V("change", i, hi), V("change", a, (e) => fi({ size: Number(e.target.value) })), V("change", o, (e) => fi({ radius: Number(e.target.value) })), U(e, t);
					};
					G(p, (e) => {
						(B(k).nav.logo?.type ?? "text") !== "text" && e(m);
					});
					var h = R(p, 2), g = (e) => {
						var t = ac(), n = I(t), r = R(n);
						{
							let e = /* @__PURE__ */ N(() => B(k).nav.logo?.order ?? "image-first"), t = /* @__PURE__ */ N(() => [["image-first", X("opt.logo.imageFirst")], ["text-first", X("opt.logo.textFirst")]]);
							Z(r, {
								get value() {
									return B(e);
								},
								get options() {
									return B(t);
								},
								onchange: (e) => fi({ order: e })
							});
						}
						A(t), z((e) => W(n, `${e ?? ""} `), [() => X("lbl.order")]), U(e, t);
					};
					G(h, (e) => {
						B(k).nav.logo?.type === "both" && e(g);
					}), A(o), A(r);
					var _ = R(r, 2), v = I(_), y = I(v, !0);
					A(v);
					var b = R(v, 2), x = I(b), S = I(x), C = R(S);
					{
						let e = /* @__PURE__ */ N(() => B(k).nav.variant ?? "bar"), t = /* @__PURE__ */ N(() => [
							["bar", X("opt.navVariant.bar")],
							["floating", X("opt.navVariant.floating")],
							["floating-square", X("opt.navVariant.floatingSquare")],
							["floating-tab", X("opt.navVariant.floatingTab")],
							["side-left", X("opt.navVariant.sideLeft")],
							["side-right", X("opt.navVariant.sideRight")]
						]);
						Z(C, {
							get value() {
								return B(e);
							},
							get options() {
								return B(t);
							},
							onchange: (e) => Fi(e)
						});
					}
					A(x);
					var w = R(x, 2), T = (e) => {
						var t = yl(), n = L(t), r = I(n);
						q(r);
						var i = R(r);
						A(n);
						var a = R(n, 2), o = I(a);
						q(o);
						var s = R(o);
						A(a), z((e, t, c, l) => {
							Y(n, "title", e), oi(r, B(k).nav.style?.glow === !0), W(i, ` ${t ?? ""}`), Y(a, "title", c), oi(o, B(k).nav.style?.topGap !== !1), W(s, ` ${l ?? ""}`);
						}, [
							() => X("tip.nav.glow"),
							() => X("lbl.navGlow"),
							() => X("tip.nav.topGap"),
							() => X("lbl.navTopGap")
						]), V("change", r, (e) => Ii(e.target.checked)), V("change", o, (e) => Li(e.target.checked)), U(e, t);
					};
					G(w, (e) => {
						B(ji) && e(T);
					});
					var ee = R(w, 2), E = (e) => {
						var t = _c(), n = I(t);
						q(n);
						var r = R(n);
						A(t), z((e, i) => {
							Y(t, "title", e), oi(n, B(k).nav.overlay === !0), W(r, ` ${i ?? ""}`);
						}, [() => X("tip.nav.overlay"), () => X("lbl.navOverlay")]), V("change", n, (e) => Jr("nav", () => {
							e.target.checked ? B(k).nav.overlay = !0 : delete B(k).nav.overlay;
						})), U(e, t);
					};
					G(ee, (e) => {
						!B(ji) && !B(Ai) && e(E);
					});
					var te = R(ee, 2), ne = (e) => {
						var t = ac(), n = I(t), r = R(n);
						{
							let e = /* @__PURE__ */ N(() => B(k).nav.style?.sideAlign ?? "left"), t = /* @__PURE__ */ N(() => [
								["left", X("common.left")],
								["center", X("common.center")],
								["right", X("common.right")]
							]);
							Z(r, {
								get value() {
									return B(e);
								},
								get options() {
									return B(t);
								},
								onchange: (e) => ki("sideAlign", e === "left" ? void 0 : e)
							});
						}
						A(t), z((e, r) => {
							Y(t, "title", e), W(n, `${r ?? ""} `);
						}, [() => X("tip.nav.sideAlign"), () => X("lbl.textAlign")]), U(e, t);
					};
					G(te, (e) => {
						B(Ai) && e(ne);
					});
					var re = R(te, 2), ie = I(re);
					q(ie);
					var ae = R(ie);
					A(re);
					var oe = R(re, 2), se = I(oe), ce = R(se);
					{
						let e = /* @__PURE__ */ N(() => B(k).nav.style?.size ?? "md"), t = /* @__PURE__ */ N(() => [
							["sm", X("opt.size.sm")],
							["md", X("opt.size.md")],
							["lg", X("opt.size.lg")],
							["xl", X("opt.size.xl")]
						]);
						Z(ce, {
							get value() {
								return B(e);
							},
							get options() {
								return B(t);
							},
							onchange: (e) => ki("size", e === "md" ? void 0 : e)
						});
					}
					A(oe);
					var le = R(oe, 2), ue = I(le), de = R(ue), fe = (e) => {
						{
							let t = /* @__PURE__ */ N(() => B(k).nav.style?.sidePlacement ?? "top"), n = /* @__PURE__ */ N(() => [
								["top", X("opt.place.top")],
								["middle", X("opt.place.middle")],
								["bottom", X("opt.place.bottom")]
							]);
							Z(e, {
								get value() {
									return B(t);
								},
								get options() {
									return B(n);
								},
								onchange: (e) => ki("sidePlacement", e === "top" ? void 0 : e)
							});
						}
					}, pe = (e) => {
						{
							let t = /* @__PURE__ */ N(() => B(k).nav.layout ?? "right"), n = /* @__PURE__ */ N(() => [
								["right", X("common.right")],
								["center", X("common.center")],
								["left", X("opt.layout.leftAfterLogo")]
							]);
							Z(e, {
								get value() {
									return B(t);
								},
								get options() {
									return B(n);
								},
								onchange: (e) => Ei(e)
							});
						}
					};
					G(de, (e) => {
						B(Ai) ? e(fe) : e(pe, -1);
					}), A(le);
					var me = R(le, 2), he = (e) => {
						var t = bl(), n = L(t), r = I(n);
						q(r);
						var i = R(r);
						A(n);
						var a = R(n, 2), o = (e) => {
							var t = ac(), n = I(t), r = R(n);
							{
								let e = /* @__PURE__ */ N(() => B(k).nav.scroll ?? "none"), t = /* @__PURE__ */ N(() => [
									["none", X("opt.scroll.none")],
									["shrink", X("opt.scroll.shrink")],
									["hide", X("opt.scroll.hide")]
								]);
								Z(r, {
									get value() {
										return B(e);
									},
									get options() {
										return B(t);
									},
									onchange: (e) => Jr("nav", () => {
										e === "none" ? delete B(k).nav.scroll : B(k).nav.scroll = e;
									})
								});
							}
							A(t), z((e, r) => {
								Y(t, "title", e), W(n, `${r ?? ""} `);
							}, [() => X("tip.nav.scroll"), () => X("lbl.navScroll")]), U(e, t);
						};
						G(a, (e) => {
							B(k).nav.sticky !== !1 && e(o);
						}), z((e, t) => {
							Y(n, "title", e), oi(r, B(k).nav.sticky !== !1), W(i, ` ${t ?? ""}`);
						}, [() => X("tip.nav.sticky"), () => X("lbl.navSticky")]), V("change", r, (e) => Jr("nav", () => {
							B(k).nav.sticky = e.target.checked;
						})), U(e, t);
					};
					G(me, (e) => {
						B(Ai) || e(he);
					});
					var ge = R(me, 2), _e = I(ge), D = R(_e);
					{
						let e = /* @__PURE__ */ N(() => B(k).nav.style?.hover ?? "standard"), t = /* @__PURE__ */ N(() => [
							["standard", X("opt.hover.standard")],
							["underline", X("opt.hover.underline")],
							["pill", X("opt.hover.pill")],
							["lift-plain", X("opt.hover.liftPlain")],
							["lift", X("opt.hover.lift")]
						]);
						Z(D, {
							get value() {
								return B(e);
							},
							get options() {
								return B(t);
							},
							onchange: (e) => Ri(e)
						});
					}
					A(ge);
					var ve = R(ge, 2), O = (e) => {
						var t = xl(), n = L(t), r = I(n), i = R(r), a = I(i);
						A(i), A(n);
						var o = R(n, 2);
						q(o), z((e, t, i) => {
							Y(n, "title", e), W(r, `${t ?? ""} `), W(a, `${i ?? ""}%`), J(o, B(k).nav.style?.hoverGlow ?? .6);
						}, [
							() => X("tip.nav.hoverGlow"),
							() => X("lbl.glowStrength"),
							() => Math.round((B(k).nav.style?.hoverGlow ?? .6) * 100)
						]), V("input", o, (e) => ki("hoverGlow", Number(e.target.value))), U(e, t);
					};
					G(ve, (e) => {
						B(k).nav.style?.hover === "lift" && e(O);
					});
					var ye = R(ve, 2), be = (e) => {
						var t = ac(), n = I(t), r = R(n);
						{
							let e = /* @__PURE__ */ N(() => B(k).nav.style?.hoverColor ?? "accent"), t = /* @__PURE__ */ N(Vn);
							Wi(r, {
								get value() {
									return B(e);
								},
								get tokens() {
									return B(t);
								},
								get label() {
									return B(Pi)[1];
								},
								onchange: (e) => ki("hoverColor", e)
							});
						}
						A(t), z(() => {
							Y(t, "title", B(Pi)[1]), W(n, `${B(Pi)[0] ?? ""} `);
						}), U(e, t);
					};
					G(ye, (e) => {
						B(Pi) && e(be);
					});
					var xe = R(ye, 2), Se = I(xe), Ce = R(Se);
					{
						let e = /* @__PURE__ */ N(() => B(k).nav.style?.hoverTextColor ?? "accent"), t = /* @__PURE__ */ N(Vn), n = /* @__PURE__ */ N(() => X("tip.nav.hoverTextColorPick"));
						Wi(Ce, {
							get value() {
								return B(e);
							},
							get tokens() {
								return B(t);
							},
							get label() {
								return B(n);
							},
							onchange: (e) => ki("hoverTextColor", e)
						});
					}
					A(xe);
					var we = R(xe, 2), Te = I(we), Ee = R(Te);
					{
						let e = /* @__PURE__ */ N(() => B(k).nav.style?.textColor ?? "text"), t = /* @__PURE__ */ N(Vn), n = /* @__PURE__ */ N(() => X("tip.nav.textColorPick"));
						Wi(Ee, {
							get value() {
								return B(e);
							},
							get tokens() {
								return B(t);
							},
							get label() {
								return B(n);
							},
							onchange: (e) => ki("textColor", e)
						});
					}
					A(we);
					var De = R(we, 4), Oe = I(De, !0);
					A(De);
					var ke = R(De, 2);
					n(ke, () => zn, () => B(k).nav?.style?.background?.layers ?? []), A(b), A(_);
					var Ae = R(_, 2), je = I(Ae), Me = I(je, !0);
					A(je);
					var Ne = R(je, 2), Pe = I(Ne), Fe = I(Pe), Ie = R(Fe);
					{
						let e = /* @__PURE__ */ N(() => B(k).nav.style?.subStyle ?? "card"), t = /* @__PURE__ */ N(() => B(Ai) ? [
							["card", X("common.standard")],
							["pills", X("opt.sub.pills")],
							["lines", X("opt.sub.lines")]
						] : [
							["card", X("opt.sub.card")],
							["flat", X("opt.sub.flat")],
							["pills", X("opt.sub.pills")],
							["lines", X("opt.sub.lines")],
							["flyout", X("opt.sub.flyout")]
						]);
						Z(Ie, {
							get value() {
								return B(e);
							},
							get options() {
								return B(t);
							},
							onchange: (e) => ki("subStyle", e === "card" ? void 0 : e)
						});
					}
					A(Pe);
					var Le = R(Pe, 2), Re = (e) => {
						var t = ac(), n = I(t), r = R(n);
						{
							let e = /* @__PURE__ */ N(() => B(k).nav.style?.subPillColor ?? "surface"), t = /* @__PURE__ */ N(Vn), n = /* @__PURE__ */ N(() => X("tip.nav.subPillColorPick"));
							Wi(r, {
								get value() {
									return B(e);
								},
								get tokens() {
									return B(t);
								},
								get label() {
									return B(n);
								},
								onchange: (e) => ki("subPillColor", e)
							});
						}
						A(t), z((e, r) => {
							Y(t, "title", e), W(n, `${r ?? ""} `);
						}, [() => X("tip.nav.subPillColor"), () => X("lbl.subPillColor")]), U(e, t);
					};
					G(Le, (e) => {
						B(k).nav.style?.subStyle === "pills" && e(Re);
					});
					var ze = R(Le, 2), Be = I(ze), Ve = R(Be);
					q(Ve), A(ze), A(Ne), A(Ae);
					var He = R(Ae, 2), Ue = I(He), We = I(Ue, !0);
					A(Ue);
					var Ge = R(Ue, 2), Ke = I(Ge);
					Hr(Ke, 17, () => B(k).nav.items, Rr, (e, t, n) => {
						var r = Sl(), i = L(r), a = I(i);
						q(a);
						var o = R(a, 2), s = I(o);
						K(s, () => c.plus, !0), A(s);
						var l = R(s, 2);
						l.disabled = n === 0, K(l, () => c.up, !0), A(l);
						var u = R(l, 2);
						K(u, () => c.down, !0), A(u);
						var d = R(u, 2);
						K(d, () => c.cross, !0), A(d), A(o);
						var f = R(o, 2), p = I(f);
						{
							let e = /* @__PURE__ */ N(() => B(t).page ?? (B(t).href == null ? "__none" : "__href")), r = /* @__PURE__ */ N(() => X("tip.linkTarget")), i = /* @__PURE__ */ N(() => [
								...B(k).pages.map((e) => [e.id, e.title]),
								["__href", X("opt.linkHref")],
								...B(t).children ? [["__none", X("opt.noLink")]] : []
							]);
							Z(p, {
								get value() {
									return B(e);
								},
								get title() {
									return B(r);
								},
								get options() {
									return B(i);
								},
								onchange: (e) => is(n, e)
							});
						}
						A(f);
						var m = R(f, 2), h = (e) => {
							var r = rc();
							q(r), z((e, n) => {
								J(r, B(t).href), Y(r, "placeholder", e), Y(r, "title", n);
							}, [() => X("ph.hrefAnchor"), () => X("tip.hrefAnchor")]), V("change", r, (e) => as(n, e.target.value)), U(e, r);
						};
						G(m, (e) => {
							!B(t).page && B(t).href != null && e(h);
						}), A(i), Hr(R(i, 2), 17, () => B(t).children ?? [], Rr, (e, r, i) => {
							var a = ic(), o = I(a);
							q(o);
							var s = R(o, 2), l = I(s);
							l.disabled = i === 0, K(l, () => c.up, !0), A(l);
							var u = R(l, 2);
							K(u, () => c.down, !0), A(u);
							var d = R(u, 2);
							K(d, () => c.cross, !0), A(d), A(s);
							var f = R(s, 2), p = I(f);
							{
								let e = /* @__PURE__ */ N(() => B(r).page ?? "__href"), t = /* @__PURE__ */ N(() => X("tip.linkTarget")), a = /* @__PURE__ */ N(() => [...B(k).pages.map((e) => [e.id, e.title]), ["__href", X("opt.linkHref")]]);
								Z(p, {
									get value() {
										return B(e);
									},
									get title() {
										return B(t);
									},
									get options() {
										return B(a);
									},
									onchange: (e) => ms(n, i, e)
								});
							}
							A(f);
							var m = R(f, 2), h = (e) => {
								var t = rc();
								q(t), z((e, n) => {
									J(t, B(r).href ?? ""), Y(t, "placeholder", e), Y(t, "title", n);
								}, [() => X("ph.hrefAnchor"), () => X("tip.hrefAnchor")]), V("change", t, (e) => hs(n, i, e.target.value)), U(e, t);
							};
							G(m, (e) => {
								B(r).page || e(h);
							}), A(a), z((e, n) => {
								J(o, B(r).label), Y(o, "title", e), u.disabled = i === B(t).children.length - 1, Y(d, "title", n);
							}, [() => X("tip.nav.childLabel"), () => X("tip.nav.removeChild")]), V("input", o, (e) => ps(n, i, e.target.value)), V("click", l, () => gs(n, i, -1)), V("click", u, () => gs(n, i, 1)), V("click", d, () => _s(n, i)), U(e, a);
						}), z((e, r, i) => {
							J(a, B(t).label), Y(a, "title", e), Y(s, "title", r), u.disabled = n === B(k).nav.items.length - 1, Y(d, "title", i);
						}, [
							() => X("tip.nav.itemLabel"),
							() => X("tip.nav.addChild"),
							() => X("tip.nav.removeItem")
						]), V("input", a, (e) => rs(n, e.target.value)), V("click", s, () => fs(n)), V("click", l, () => cs(n, -1)), V("click", u, () => cs(n, 1)), V("click", d, () => us(n)), U(e, r);
					});
					var qe = R(Ke, 2), Je = I(qe, !0);
					A(qe), A(Ge), A(He), A(t), z((e, t, n, r, o, s, c, u, d, f, p, m, h, g, _, v, b, C, w, T, ee, E) => {
						Y(i, "title", e), W(a, t), W(l, `${n ?? ""} `), W(y, r), Y(x, "title", o), W(S, `${s ?? ""} `), Y(re, "title", c), oi(ie, B(k).nav.style?.blur !== !1), W(ae, ` ${u ?? ""}`), W(se, `${d ?? ""} `), W(ue, `${f ?? ""} `), W(_e, `${p ?? ""} `), Y(xe, "title", m), W(Se, `${h ?? ""} `), W(Te, `${g ?? ""} `), W(Oe, _), W(Me, v), W(Fe, `${b ?? ""} `), Y(ze, "title", C), W(Be, `${w ?? ""} `), J(Ve, B(k).nav.style?.subColumns ?? 1), Y(Ue, "title", T), W(We, ee), W(Je, E);
					}, [
						() => X("hint.nav.logoHome"),
						() => X("group.logo"),
						() => X("common.type"),
						() => X("group.appearance"),
						() => X("tip.nav.variant"),
						() => X("lbl.navVariant"),
						() => X("tip.nav.blur"),
						() => X("lbl.navBlur"),
						() => X("lbl.size"),
						() => X("lbl.navPlacement"),
						() => X("lbl.navHover"),
						() => X("tip.nav.hoverTextColor"),
						() => X("lbl.hoverTextColor"),
						() => X("lbl.textColor"),
						() => X("lbl.background"),
						() => X("group.submenu"),
						() => X("lbl.design"),
						() => X("tip.nav.subColumns"),
						() => X("lbl.columns"),
						() => X("hint.nav.submenu"),
						() => X("group.menuItems"),
						() => X("ui.addMenuItem")
					]), V("change", ie, (e) => ki("blur", e.target.checked)), V("change", Ve, (e) => ki("subColumns", Number(e.target.value) > 1 ? Number(e.target.value) : void 0)), V("click", qe, ds), U(e, t);
				}, f = (e) => {
					var t = El(), n = I(t), r = I(n), i = R(r);
					q(i), A(n);
					var a = R(n, 2), o = I(a), s = R(o);
					q(s), A(a);
					var l = R(a, 2), u = I(l), d = R(u);
					{
						let e = /* @__PURE__ */ N(Si), t = /* @__PURE__ */ N(Ci);
						Z(d, {
							get value() {
								return B(e);
							},
							get options() {
								return B(t);
							},
							onchange: (e) => wi(e)
						});
					}
					A(l);
					var f = R(l, 4), p = I(f), m = R(p), h = (e) => {
						var t = wl();
						z((e) => {
							Y(t, "src", B(k).site.icon), Y(t, "alt", e);
						}, [() => X("lbl.siteIcon")]), U(e, t);
					};
					G(m, (e) => {
						B(k).site.icon && e(h);
					}), A(f);
					var g = R(f, 2), _ = I(g), v = I(_), y = R(v);
					A(_);
					var b = R(_, 2), x = (e) => {
						var t = Tl(), n = L(t);
						K(n, () => c.pencil ?? "✎", !0), A(n);
						var r = R(n, 2);
						K(r, () => c.cross, !0), A(r), z((e, t) => {
							Y(n, "title", e), Y(r, "title", t);
						}, [() => X("tip.site.editIcon"), () => X("tip.site.removeIcon")]), V("click", n, () => F(gi, B(k).site.icon, !0)), V("click", r, yi), U(e, t);
					};
					G(b, (e) => {
						B(k).site.icon && e(x);
					}), A(g), A(t), z((e, t, c, d, f, m, h, g, y, b, x) => {
						Y(n, "title", e), W(r, `${t ?? ""} `), J(i, B(k).site.title ?? ""), Y(i, "placeholder", c), Y(a, "title", d), W(o, `${f ?? ""} `), J(s, B(k).site.description ?? ""), Y(s, "placeholder", m), Y(l, "title", h), W(u, `${g ?? ""} `), W(p, `${y ?? ""} `), Y(_, "title", b), W(v, `${x ?? ""} `);
					}, [
						() => X("tip.site.name"),
						() => X("lbl.name"),
						() => X("ph.site.name"),
						() => X("tip.site.description"),
						() => X("lbl.description"),
						() => X("ph.site.description"),
						() => X("site.langTitle"),
						() => X("site.langLabel"),
						() => X("lbl.siteIcon"),
						() => X("tip.site.icon"),
						() => B(k).site.icon ? X("ui.changeIcon") : X("ui.chooseIcon")
					]), V("input", i, (e) => bi(e.target.value)), V("input", s, (e) => xi(e.target.value)), V("change", y, _i), U(e, t);
				}, p = (e) => {
					var t = Pl();
					{
						let e = (e, t = d, n = d) => {
							var r = Ol(), i = I(r), a = (e) => {
								var t = Dl(), r = I(t, !0);
								A(t), z(() => W(r, n())), U(e, t);
							};
							G(i, (e) => {
								n() && e(a);
							});
							var o = R(i, 2), s = I(o), c = I(s, !0);
							A(s);
							var l = R(s, 2), u = I(l, !0);
							A(l);
							var f = R(l, 2), p = I(f), m = I(p, !0);
							A(p);
							var h = R(p), g = I(h, !0);
							A(h), A(f), A(o), A(r), z((e, t, n, r, i, a, s, l, d) => {
								ti(o, `--tv-bg:${e ?? ""};--tv-surface:${t ?? ""};--tv-text:${n ?? ""};--tv-accent:${r ?? ""};--tv-accent-ink:${i ?? ""}`), W(c, a), W(u, s), W(m, l), W(g, d);
							}, [
								() => As(t().bg, t()),
								() => As(t().surface, t()),
								() => As(t().text, t()),
								() => As(t().accent, t()),
								() => As(t()["accent-text"] ?? t().bg, t()),
								() => X("preview.heading"),
								() => X("preview.cardBody"),
								() => X("preview.button"),
								() => X("preview.link")
							]), U(e, r);
						};
						var n = I(t), r = I(n, !0);
						A(n);
						var i = R(n, 2);
						Hr(i, 21, () => Ns, (e) => e.id, (e, t) => {
							var n = kl();
							let r;
							var i = I(n), a = I(i), o = R(a), s = R(o), c = R(s);
							A(i);
							var l = R(i, 2), u = I(l, !0);
							A(l), A(n), z(() => {
								r = $r(n, 1, "theme-preset svelte-1n46o8q", null, r, { sel: B(Ls) === B(t).id }), Y(n, "title", `${B(t).name} - ${B(t).note}`), ti(a, `background:${B(t).light.bg ?? ""}`), ti(o, `background:${B(t).light.surface ?? ""}`), ti(s, `background:${B(t).light.accent ?? ""}`), ti(c, `background:${B(t).light.text ?? ""}`), W(u, B(t).name);
							}), V("click", n, () => Ps(B(t))), U(e, n);
						}), A(i);
						var a = R(i, 2), o = I(a, !0);
						A(a);
						var s = R(a, 2), c = I(s);
						q(c);
						var l = R(c);
						A(s);
						var u = R(s, 2), f = (e) => {
							var t = Al(), n = I(t), r = I(n, !0);
							A(n);
							var i = R(n, 2), a = I(i);
							let o;
							var s = I(a, !0);
							A(a);
							var c = R(a, 2);
							let l;
							var u = I(c, !0);
							A(c), A(i), A(t), z((e, t, n, i) => {
								W(r, e), Y(a, "title", t), o = $r(a, 1, "svelte-1n46o8q", null, o, { on: B(Wn) }), W(s, n), l = $r(c, 1, "svelte-1n46o8q", null, l, { on: !B(Wn) }), W(u, i);
							}, [
								() => X("lbl.darkColors"),
								() => X("hint.theme.autoDark"),
								() => X("opt.auto"),
								() => X("opt.custom")
							]), V("click", a, () => Es(!0)), V("click", c, () => Es(!1)), U(e, t);
						};
						G(u, (e) => {
							B(Un) && e(f);
						});
						var p = R(u, 2), h = I(p), g = (e) => {
							var t = jl(), n = I(t, !0);
							A(t), z((e) => W(n, e), [() => X("lbl.light")]), U(e, t);
						};
						G(h, (e) => {
							B(Un) && e(g);
						});
						var _ = R(h, 2);
						let je;
						var v = I(_, !0);
						A(_), A(p);
						var y = R(p, 2);
						Hr(y, 21, () => Hn, ([e, t, n]) => e, (e, t) => {
							var n = /* @__PURE__ */ N(() => m(B(t), 3));
							let r = () => B(n)[0], i = () => B(n)[1], a = () => B(n)[2];
							var o = Ml(), s = I(o);
							{
								let e = /* @__PURE__ */ N(() => B(k).theme.tokens.color[r()] ?? B(k).theme.tokens.color.bg), t = /* @__PURE__ */ N(Vn);
								Wi(s, {
									get value() {
										return B(e);
									},
									get tokens() {
										return B(t);
									},
									get label() {
										return i();
									},
									onchange: (e) => vs(r(), e)
								});
							}
							var c = R(s, 2), l = I(c, !0);
							A(c);
							var u = R(c, 2), d = I(u, !0);
							A(u), A(o), z((e) => {
								W(l, a()), W(d, e);
							}, [() => As(B(k).theme.tokens.color[r()] ?? B(k).theme.tokens.color.bg, B(Kn))]), U(e, o);
						}), A(y);
						var b = R(y, 2), x = (e) => {
							var t = Nl(), n = L(t), r = I(n), i = I(r, !0);
							A(r);
							var a = R(r, 2);
							let o;
							var s = I(a, !0);
							A(a), A(n);
							var c = R(n, 2);
							let l;
							Hr(c, 21, () => Hn, ([e, t, n]) => e, (e, t) => {
								var n = /* @__PURE__ */ N(() => m(B(t), 3));
								let r = () => B(n)[0], i = () => B(n)[1], a = () => B(n)[2];
								var o = Ml(), s = I(o);
								{
									let e = /* @__PURE__ */ N(() => B(k).theme.alt.tokens.color[r()] ?? B(qn)[r()] ?? B(k).theme.tokens.color.bg), t = /* @__PURE__ */ N(Vn), n = /* @__PURE__ */ N(() => X("theme.darkColorLabel", { name: i() }));
									Wi(s, {
										get value() {
											return B(e);
										},
										get tokens() {
											return B(t);
										},
										get label() {
											return B(n);
										},
										onchange: (e) => Cs(r(), e)
									});
								}
								var c = R(s, 2), l = I(c, !0);
								A(c);
								var u = R(c, 2), d = I(u, !0);
								A(u), A(o), z((e) => {
									W(l, a()), W(d, e);
								}, [() => As(B(k).theme.alt.tokens.color[r()] ?? B(qn)[r()], B(qn))]), U(e, o);
							}), A(c), z((e, t, n) => {
								W(i, e), o = $r(a, 1, "chip svelte-1n46o8q", null, o, { accent: B(Gn) === "dark" }), Y(a, "title", t), W(s, n), l = $r(c, 1, "palcells svelte-1n46o8q", null, l, { autopal: B(Wn) });
							}, [
								() => X("lbl.dark"),
								() => X("tip.theme.darkDefault"),
								() => X("common.standard")
							]), V("click", a, () => ws("dark")), U(e, t);
						};
						G(b, (e) => {
							B(Un) && e(x);
						});
						var S = R(b, 2), C = I(S);
						{
							let t = /* @__PURE__ */ N(() => B(Un) ? X("lbl.light") : "");
							e(C, () => B(Kn), () => B(t));
						}
						var w = R(C, 2), T = (t) => {
							{
								let n = /* @__PURE__ */ N(() => X("lbl.dark"));
								e(t, () => B(qn), () => B(n));
							}
						};
						G(w, (e) => {
							B(Un) && e(T);
						}), A(S);
						var ee = R(S, 2), E = I(ee), te = I(E, !0);
						A(E);
						var ne = R(E, 2), re = I(ne), ie = I(re), ae = R(ie);
						{
							let e = /* @__PURE__ */ N(() => Ds("heading"));
							Z(ae, {
								get value() {
									return B(k).theme.tokens.font.heading;
								},
								get options() {
									return B(e);
								},
								onchange: (e) => ys("heading", e)
							});
						}
						A(re);
						var oe = R(re, 2), se = I(oe), ce = R(se);
						{
							let e = /* @__PURE__ */ N(() => Ds("body"));
							Z(ce, {
								get value() {
									return B(k).theme.tokens.font.body;
								},
								get options() {
									return B(e);
								},
								onchange: (e) => ys("body", e)
							});
						}
						A(oe);
						var le = R(oe, 2), ue = I(le), de = I(ue, !0);
						A(ue);
						var fe = R(ue, 2), pe = I(fe, !0);
						A(fe), A(le), A(ne), A(ee);
						var me = R(ee, 2), he = I(me), ge = I(he, !0);
						A(he);
						var _e = R(he, 2), D = I(_e), ve = I(D), O = I(ve, !0);
						A(ve);
						var ye = R(ve, 2), be = I(ye, !0);
						A(ye), A(D);
						var xe = R(D, 2), Se = I(xe, !0), Ce = R(Se), we = I(Ce, !0);
						A(Ce), A(xe);
						var Te = R(xe, 2);
						q(Te);
						var Ee = R(Te, 2), De = I(Ee, !0), Oe = R(De), ke = I(Oe, !0);
						A(Oe), A(Ee);
						var Ae = R(Ee, 2);
						q(Ae), A(_e), A(me), A(t), z((e, t, n, i, a, u, d, f, p, m, h, g, y, b, x, S, C, w) => {
							W(r, e), W(o, t), Y(s, "title", n), oi(c, B(Un)), W(l, ` ${i ?? ""}`), je = $r(_, 1, "chip svelte-1n46o8q", null, je, { accent: B(Gn) === "light" }), Y(_, "title", a), W(v, u), W(te, d), W(ie, `${f ?? ""} `), W(se, `${p ?? ""} `), ti(ue, `font-family:${B(k).theme.tokens.font.heading ?? ""}`), W(de, m), ti(fe, `font-family:${B(k).theme.tokens.font.body ?? ""}`), W(pe, h), W(ge, g), ti(D, `--r-sm:${B(k).theme.tokens.radius.sm ?? ""};--r-md:${B(k).theme.tokens.radius.md ?? ""}`), W(O, y), W(be, b), W(Se, x), W(we, B(k).theme.tokens.radius.sm), J(Te, S), W(De, C), W(ke, B(k).theme.tokens.radius.md), J(Ae, w);
						}, [
							() => X("lbl.themePresets"),
							() => X("lbl.colors"),
							() => X("tip.theme.dualMode"),
							() => X("lbl.dualMode"),
							() => X("tip.theme.defaultScheme"),
							() => X("common.standard"),
							() => X("group.typography"),
							() => X("lbl.headings"),
							() => X("lbl.bodyText"),
							() => X("preview.heading"),
							() => X("preview.bodySample"),
							() => X("group.shape"),
							() => X("preview.button"),
							() => X("preview.card"),
							() => X("lbl.smallCorners"),
							() => Os(B(k).theme.tokens.radius.sm),
							() => X("lbl.largeCorners"),
							() => Os(B(k).theme.tokens.radius.md)
						]), V("change", c, (e) => Ts(e.target.checked)), V("click", _, () => ws("light")), V("input", Te, (e) => ks("sm", Number(e.target.value))), V("input", Ae, (e) => ks("md", Number(e.target.value)));
					}
					U(e, t);
				}, h = (e) => {
					var t = zl();
					let n;
					var r = I(t);
					q(r);
					var i = R(r, 2), a = (e) => {
						var t = Mr();
						Hr(L(t), 17, () => Lo(ad(), B(id), (e) => e.label), (e) => e.label, (e, t) => {
							var n = Mr(), r = L(n), i = (e) => {
								var n = Fl(), r = I(n), i = R(r);
								A(n), z((e) => {
									Y(n, "title", e), W(r, `${B(t).label ?? ""} `);
								}, [() => X("tip.webpAuto")]), V("change", i, cd), U(e, n);
							}, a = (e) => {
								var n = Il(), r = I(n), i = R(r);
								A(n), z((e) => {
									Y(n, "title", e), W(r, `${B(t).label ?? ""} `);
								}, [() => X("tip.blocks.galleryImages")]), V("change", i, fd), U(e, n);
							}, o = (e) => {
								var n = xc(), r = I(n, !0);
								A(n), z(() => W(r, B(t).label)), V("click", n, () => od(B(t))), U(e, n);
							};
							G(r, (e) => {
								B(t).act === "image" ? e(i) : B(t).act === "galleryImages" ? e(a, 1) : e(o, -1);
							}), U(e, n);
						}, (e) => {
							var t = cc(), n = I(t, !0);
							A(t), z((e) => W(n, e), [() => X("canvas.searchEmpty")]), U(e, t);
						}), U(e, t);
					}, o = /* @__PURE__ */ N(() => B(id).trim()), s = (e) => {
						var t = Rl(), n = L(t), r = I(n), i = I(r, !0);
						A(r);
						var a = R(r, 2), o = I(a), s = I(o, !0);
						A(o);
						var c = R(o, 2), l = I(c, !0);
						A(c), A(a), A(n);
						var u = R(n, 2), d = I(u, !0);
						A(u);
						var f = R(u, 2), p = I(f), m = R(p);
						A(f);
						var h = R(f, 2), g = I(h, !0);
						A(h);
						var _ = R(h, 2), v = I(_, !0);
						A(_);
						var y = R(_, 2), b = I(y, !0);
						A(y);
						var x = R(y, 2), S = I(x, !0);
						A(x);
						var C = R(x, 2), w = I(C, !0);
						A(C);
						var T = R(C, 2), ee = I(T, !0);
						A(T);
						var E = R(T, 2), te = I(E, !0);
						A(E);
						var ne = R(E, 2), re = I(ne), ie = I(re, !0);
						A(re);
						var ae = R(re, 2), oe = I(ae), se = I(oe, !0);
						A(oe);
						var ce = R(oe, 2), le = I(ce), ue = R(le);
						A(ce), A(ae), A(ne);
						var de = R(ne, 2), fe = I(de), pe = I(fe, !0);
						A(fe);
						var me = R(fe, 2), he = I(me), ge = I(he, !0);
						A(he);
						var _e = R(he, 2), D = I(_e, !0);
						A(_e);
						var ve = R(_e, 2), k = I(ve, !0);
						A(ve);
						var ye = R(ve, 2), be = I(ye, !0);
						A(ye);
						var xe = R(ye, 2), Se = I(xe, !0);
						A(xe), A(me), A(de);
						var Ce = R(de, 2), we = (e) => {
							let t = /* @__PURE__ */ N(() => B(sa).filter((e) => ia[e]?.data?.mal?.kind === "blocks"));
							var n = Ll(), r = I(n), i = I(r, !0);
							A(r);
							var a = R(r, 2);
							Hr(a, 20, () => B(t), (e) => e, (e, t) => {
								var n = xc(), r = I(n, !0);
								A(n), z((e) => {
									Y(n, "title", e), W(r, ia[t].data.mal.name);
								}, [() => X("canvas.insertGroup")]), V("click", n, () => O?.sendInsertTemplate(t)), U(e, n);
							}), A(a), A(n), z((e) => W(i, e), [() => X("canvas.tabMyTemplates")]), U(e, n);
						}, Te = /* @__PURE__ */ N(() => B(sa).some((e) => ia[e]?.data?.mal?.kind === "blocks"));
						G(Ce, (e) => {
							B(Te) && e(we);
						});
						var Ee = R(Ce, 2), De = (e) => {
							var t = Ll(), n = I(t), r = I(n, !0);
							A(n);
							var i = R(n, 2);
							Hr(i, 21, () => B(nd), (e) => e.type, (e, t) => {
								var n = Mr(), r = L(n), i = (e) => {
									var n = Ll(), r = I(n), i = I(r, !0);
									A(r);
									var a = R(r, 2);
									Hr(a, 21, () => B(t).variants, (e) => e.label, (e, n) => {
										var r = xc(), i = I(r, !0);
										A(r), z((e) => {
											Y(r, "title", e), W(i, B(n).label);
										}, [() => X("tip.blocks.fromPlugin", { plugin: B(t).plugin })]), V("click", r, () => rd(B(t), B(n).props)), U(e, r);
									}), A(a), A(n), z(() => W(i, B(t).label)), U(e, n);
								}, a = (e) => {
									var n = xc(), r = I(n, !0);
									A(n), z((e) => {
										Y(n, "title", e), W(r, B(t).label);
									}, [() => X("tip.blocks.fromPlugin", { plugin: B(t).plugin })]), V("click", n, () => rd(B(t))), U(e, n);
								};
								G(r, (e) => {
									B(t).variants?.length ? e(i) : e(a, -1);
								}), U(e, n);
							}), A(i), A(t), z((e) => W(r, e), [() => X("panel.plugins")]), U(e, t);
						};
						G(Ee, (e) => {
							B(nd).length && e(De);
						}), z((e, t, n, r, a, o, u, m, ne, re, ae, ue, de, fe, me, he, _e, ve, O, ye, xe, Ce, we, Te, Ee, De, Oe, ke, Ae, je, Me, Ne) => {
							W(i, e), W(s, t), Y(c, "title", n), W(l, r), W(d, a), Y(f, "title", o), W(p, `${u ?? ""} `), Y(h, "title", m), W(g, ne), Y(_, "title", re), W(v, ae), Y(y, "title", ue), W(b, de), Y(x, "title", fe), W(S, me), Y(C, "title", he), W(w, _e), Y(T, "title", ve), W(ee, O), Y(E, "title", ye), W(te, xe), W(ie, Ce), Y(oe, "title", we), W(se, Te), Y(ce, "title", Ee), W(le, `${De ?? ""} `), W(pe, Oe), W(ge, ke), W(D, Ae), W(k, je), W(be, Me), W(Se, Ne);
						}, [
							() => X("blocks.text"),
							() => X("blocks.text"),
							() => X("tip.blocks.textBox"),
							() => X("ui.textBox"),
							() => X("blocks.button"),
							() => X("tip.webpAuto"),
							() => X("blocks.image"),
							() => X("tip.blocks.video"),
							() => X("blocks.video"),
							() => X("tip.blocks.icon"),
							() => X("blocks.icon"),
							() => X("tip.blocks.samling"),
							() => X("blocks.samling"),
							() => X("tip.blocks.faq"),
							() => X("blocks.faq"),
							() => X("tip.blocks.tidslinje"),
							() => X("blocks.tidslinje"),
							() => X("tip.blocks.sitat"),
							() => X("blocks.sitat"),
							() => X("tip.blocks.statistikk"),
							() => X("blocks.statistikk"),
							() => X("blocks.galleri"),
							() => X("tip.blocks.gallery"),
							() => X("ui.emptyGallery"),
							() => X("tip.blocks.galleryImages"),
							() => X("ui.galleryWithImages"),
							() => X("group.shapes"),
							() => X("shape.line"),
							() => X("shape.arrow"),
							() => X("shape.circle"),
							() => X("shape.rect"),
							() => X("shape.triangle")
						]), V("click", o, () => td("text")), V("click", c, () => td("text-box")), V("click", u, () => td("button")), V("change", m, cd), V("click", h, () => td("video")), V("click", _, () => td("icon")), V("click", y, () => td("samling")), V("click", x, () => td("faq")), V("click", C, () => td("tidslinje")), V("click", T, () => td("sitat")), V("click", E, () => td("statistikk")), V("click", oe, () => td("galleri")), V("change", ue, fd), V("click", he, () => td("shape-line")), V("click", _e, () => td("shape-arrow")), V("click", ve, () => td("shape-circle")), V("click", ye, () => td("shape-rect")), V("click", xe, () => td("shape-triangle")), U(e, t);
					};
					G(i, (e) => {
						B(o) ? e(a) : e(s, -1);
					}), A(t), z((e, i, a) => {
						n = $r(t, 1, "panel-body svelte-1n46o8q", null, n, { locked: B(te) === "mobile" }), Y(t, "title", e), Y(r, "placeholder", i), Y(r, "title", a);
					}, [
						() => B(te) === "mobile" ? X("tip.blocks.mobileLocked") : void 0,
						() => X("canvas.searchBlocks"),
						() => X("canvas.searchBlocks")
					]), ui(r, () => B(id), (e) => F(id, e)), U(e, t);
				}, _ = (e) => {
					var t = Bl(), n = I(t), r = I(n), i = R(r), a = I(i);
					A(i), A(n);
					var o = R(n, 2);
					q(o);
					var s = R(o, 2), c = I(s);
					q(c);
					var l = R(c);
					A(s), A(t), z((e, t) => {
						W(r, `${e ?? ""} `), W(a, `${B(ee).size ?? ""} px`), J(o, B(ee).size), oi(c, B(ee).snap !== !1), W(l, ` ${t ?? ""}`);
					}, [() => X("lbl.gridSize"), () => X("lbl.gridSnap")]), V("input", o, (e) => dr("size", Number(e.target.value))), V("change", c, (e) => dr("snap", e.target.checked)), U(e, t);
				}, v = (e) => {
					var t = ql(), r = I(t), i = (e) => {
						var t = Vl(), n = L(t), r = I(n, !0);
						A(n);
						var i = R(n, 2);
						a(i), z((e) => W(r, e), [() => X("blocks.suffix", { label: zt[B(j).type] ?? B(j).type })]), U(e, t);
					}, o = (e) => {
						var t = Kl(), r = L(t), i = I(r, !0);
						A(r);
						var a = R(r, 2), o = I(a), s = R(o);
						q(s), A(a);
						var l = R(a, 4), u = I(l);
						q(u);
						var d = R(u);
						A(l);
						var f = R(l, 2), p = (e) => {
							var t = Hl(), n = L(t), r = I(n), i = R(r), a = I(i);
							A(i), A(n);
							var o = R(n, 2);
							q(o), z((e) => {
								W(r, `${e ?? ""} `), W(a, `${B(Ut).size ?? ""} px`), J(o, B(Ut).size);
							}, [() => X("lbl.gridSize")]), V("input", o, (e) => ur("size", Number(e.target.value))), U(e, t);
						};
						G(f, (e) => {
							B(Ut) && e(p);
						});
						var h = R(f, 4), g = I(h, !0);
						A(h);
						var _ = R(h, 2);
						Hr(_, 21, () => [["", "common.standard"], ...Object.entries(Wo)], ([e, t]) => e, (e, t) => {
							var n = /* @__PURE__ */ N(() => m(B(t), 2));
							let r = () => B(n)[0], i = () => B(n)[1], a = /* @__PURE__ */ N(() => en(r()));
							var o = Ul();
							let s;
							var c = I(o), l = I(c), u = R(l, 2), d = R(u, 2);
							A(c);
							var f = R(c, 2), p = I(f, !0);
							A(f), A(o), z((e, t) => {
								s = $r(o, 1, "rs-card svelte-1n46o8q", null, s, { on: B(Jt) === r() }), Y(o, "title", e), ti(c, `background: ${B(a).bg ?? ""}`), ti(l, `background: ${B(a).text ?? ""}`), ti(u, `background: ${B(a).surface ?? ""}`), ti(d, `background: ${B(a).accent ?? ""}`), W(p, t);
							}, [() => X("tip.props.sectionTheme"), () => X(i())]), V("click", o, () => $t(r())), U(e, o);
						}), A(_);
						var v = R(_, 2), y = I(v), b = R(y), x = I(b), S = I(x);
						A(x);
						var C = R(x, 2);
						K(C, () => c.copy, !0), A(C), A(b), A(v);
						var w = R(v, 4), T = I(w, !0);
						A(w);
						var ee = R(w, 2);
						n(ee, () => B(Rn), () => B(Gt));
						var E = R(ee, 4), te = I(E), ne = R(te);
						{
							let e = /* @__PURE__ */ N(() => Yn(B(Kt)) ? B(Kt).type : "");
							Z(ne, {
								get value() {
									return B(e);
								},
								get options() {
									return Xn;
								},
								onchange: (e) => rr(e || null)
							});
						}
						A(E);
						var re = R(E, 2), ie = (e) => {
							var t = Gl(), n = L(t), r = I(n), i = R(r);
							q(i), A(n);
							var a = R(n, 2), o = I(a), s = R(o);
							q(s), A(a);
							var c = R(a, 2), l = (e) => {
								var t = Wl(), n = L(t), r = I(n), i = R(r);
								{
									let e = /* @__PURE__ */ N(() => B(Kt).props.effect ?? "slide-up"), t = /* @__PURE__ */ N(() => [
										["fade-in", X("anim.fadeIn")],
										["slide-up", X("anim.slideUp")],
										["zoom-in", X("anim.zoomIn")]
									]);
									Z(i, {
										get value() {
											return B(e);
										},
										get options() {
											return B(t);
										},
										onchange: (e) => or("effect", e)
									});
								}
								A(n);
								var a = R(n, 2), o = I(a), s = R(o);
								q(s), A(a);
								var c = R(a, 2), l = I(c), u = R(l);
								{
									let e = /* @__PURE__ */ N(() => B(Kt).props.pattern ?? "sequence"), t = /* @__PURE__ */ N(() => [
										["sequence", X("opt.stagger.sequence")],
										["columns", X("opt.stagger.columns")],
										["rows", X("opt.stagger.rows")],
										["center", X("opt.stagger.center")]
									]);
									Z(u, {
										get value() {
											return B(e);
										},
										get options() {
											return B(t);
										},
										onchange: (e) => or("pattern", e)
									});
								}
								A(c), z((e, t, i, u, d, f) => {
									Y(n, "title", e), W(r, `${t ?? ""} `), Y(a, "title", i), W(o, `${u ?? ""} `), J(s, B(Kt).props.step ?? 90), Y(c, "title", d), W(l, `${f ?? ""} `);
								}, [
									() => X("tip.props.staggerEffect"),
									() => X("lbl.staggerEffect"),
									() => X("tip.props.staggerStep"),
									() => X("lbl.stepMs"),
									() => X("tip.props.staggerPattern"),
									() => X("lbl.pattern")
								]), V("change", s, (e) => ar("step", Number(e.target.value))), U(e, t);
							};
							G(c, (e) => {
								B(Kt).type === "stagger" && e(l);
							}), z((e, t) => {
								W(r, `${e ?? ""} `), J(i, B(Kt).props.duration), W(o, `${t ?? ""} `), J(s, B(Kt).props.delay ?? 0);
							}, [() => X("lbl.durationMs"), () => X("lbl.delayMs")]), V("change", i, (e) => ar("duration", Number(e.target.value))), V("change", s, (e) => ar("delay", Number(e.target.value))), U(e, t);
						}, ae = /* @__PURE__ */ N(() => Yn(B(Kt)));
						G(re, (e) => {
							B(ae) && e(ie);
						});
						var oe = R(re, 2), se = I(oe), ce = R(se);
						{
							let e = /* @__PURE__ */ N(() => B(qt)?.type ?? (B(Kt) && !Yn(B(Kt)) ? B(Kt).type : ""));
							Z(ce, {
								get value() {
									return B(e);
								},
								get options() {
									return Qn;
								},
								onchange: (e) => ir(e || null)
							});
						}
						A(oe), z((e, t, n, r, c, l, f, p, m, _, b, x, w, ee, ne) => {
							W(i, e), Y(a, "title", t), W(o, `${n ?? ""} `), J(s, B(Wt)), Y(s, "placeholder", r), oi(u, B(Ut) !== null), W(d, ` ${c ?? ""}`), Y(h, "title", l), W(g, f), Y(v, "title", p), W(y, `${m ?? ""} `), W(S, `#${B(Ht) ?? ""}`), Y(C, "title", _), W(T, b), Y(E, "title", x), W(te, `${w ?? ""} `), Y(oe, "title", ee), W(se, `${ne ?? ""} `);
						}, [
							() => X("lbl.section"),
							() => X("hint.props.minHeight"),
							() => X("lbl.minHeight"),
							() => X("ph.minHeight"),
							() => X("lbl.sectionGrid"),
							() => X("tip.props.sectionTheme"),
							() => X("lbl.sectionTheme"),
							() => X("tip.props.anchor"),
							() => X("lbl.anchor"),
							() => X("tip.props.copyAnchor"),
							() => X("lbl.background"),
							() => X("tip.props.sectionAnim"),
							() => X("lbl.animIn"),
							() => X("tip.props.sectionHover"),
							() => X("lbl.onHover")
						]), V("change", s, (e) => sr(e.target.value)), V("change", u, (e) => lr(e.target.checked)), V("click", C, () => navigator.clipboard?.writeText(`#${B(Ht)}`)), U(e, t);
					}, s = (e) => {
						var t = cc(), n = I(t, !0);
						A(t), z((e) => W(n, e), [() => X("hint.props.empty")]), U(e, t);
					};
					G(r, (e) => {
						B(j) ? e(i) : B(Ht) ? e(o, 1) : e(s, -1);
					}), A(t), U(e, t);
				}, y = (e) => {
					var t = tu(), i = I(t), a = I(i);
					q(a);
					var o = R(a);
					A(i);
					var s = R(i, 2), l = (e) => {
						var t = Ll(), n = I(t), r = I(n, !0);
						A(n);
						var i = R(n, 2);
						Hr(i, 21, () => B(k).pages ?? [], (e) => e.id, (e, t) => {
							var n = _c(), r = I(n);
							q(r);
							var i = R(r);
							A(n), z((e, a) => {
								Y(n, "title", e), oi(r, a), W(i, ` ${(B(t).title || B(t).id) ?? ""}`);
							}, [() => X("tip.footer.hideOnPage"), () => !(B(k).footer?.hideOn ?? []).includes(B(t).id)]), V("change", r, (e) => Ao(B(t).id, e.target.checked)), U(e, n);
						}), A(i), A(t), z((e) => W(r, e), [() => X("group.showOnPages")]), U(e, t);
					};
					G(s, (e) => {
						B(k).footer?.show && e(l);
					});
					var u = R(s, 2), d = I(u), f = I(d, !0);
					A(d);
					var p = R(d, 2), m = I(p);
					Hr(m, 21, () => _o, (e) => e.id, (e, t) => {
						var n = Jl(), r = I(n);
						K(r, () => Is(B(t).thumb), !0), A(r);
						var i = R(r, 2), a = I(i, !0);
						A(i), A(n), z((e) => {
							Y(n, "title", e), W(a, B(t).label);
						}, [() => X("tip.footer.template", { label: B(t).label })]), V("click", n, () => yo(B(t).id)), U(e, n);
					}), A(m), A(p), A(u);
					var h = R(u, 2), g = I(h), _ = I(g, !0);
					A(g);
					var v = R(g, 2), y = I(v), b = I(y), x = R(b);
					q(x), A(y);
					var S = R(y, 2), C = I(S), w = R(C);
					q(w), A(S);
					var T = R(S, 2), ee = I(T), E = R(ee);
					{
						let e = /* @__PURE__ */ N(() => B(k).footer?.brand?.mode ?? "text"), t = /* @__PURE__ */ N(() => [
							["text", X("blocks.text")],
							["image", X("opt.brand.image")],
							["both", X("opt.brand.both")]
						]);
						Z(E, {
							get value() {
								return B(e);
							},
							get options() {
								return B(t);
							},
							onchange: (e) => fo(e)
						});
					}
					A(T);
					var te = R(T, 2), ne = (e) => {
						var t = Xl(), n = L(t), r = I(n), i = I(r), a = R(i);
						A(r);
						var o = R(r, 2), s = (e) => {
							var t = Us();
							K(t, () => c.cross, !0), A(t), z((e) => Y(t, "title", e), [() => X("tip.footer.removeLogo")]), V("click", t, mo), U(e, t);
						};
						G(o, (e) => {
							B(k).footer?.brand?.logo && e(s);
						}), A(n);
						var l = R(n, 2), u = (e) => {
							var t = Yl(), n = L(t), r = I(n), i = R(r), a = I(i);
							A(i), A(n);
							var o = R(n, 2);
							q(o), z((e) => {
								W(r, `${e ?? ""} `), W(a, `${B(k).footer?.brand?.logoHeight ?? 40 ?? ""} px`), J(o, B(k).footer?.brand?.logoHeight ?? 40);
							}, [() => X("lbl.logoHeight")]), V("input", o, (e) => ho(e.target.value)), U(e, t);
						};
						G(l, (e) => {
							B(k).footer?.brand?.logo && e(u);
						}), z((e, t) => {
							Y(r, "title", e), W(i, `${t ?? ""} `);
						}, [() => X("tip.webpAutoPublish"), () => B(k).footer?.brand?.logo ? X("ui.changeLogo") : X("ui.uploadLogo")]), V("change", a, po), U(e, t);
					};
					G(te, (e) => {
						(B(k).footer?.brand?.mode ?? "text") !== "text" && e(ne);
					}), A(v), A(h);
					var re = R(h, 2), ie = I(re), ae = I(ie, !0);
					A(ie);
					var oe = R(ie, 2), se = I(oe);
					Hr(se, 17, () => B(k).footer?.columns ?? [], Rr, (e, t, n) => {
						var r = Zl(), i = L(r), a = I(i);
						q(a);
						var o = R(a, 2), s = I(o);
						K(s, () => c.plus, !0), A(s);
						var l = R(s, 2);
						l.disabled = n === 0, K(l, () => c.up, !0), A(l);
						var u = R(l, 2);
						K(u, () => c.down, !0), A(u);
						var d = R(u, 2);
						K(d, () => c.cross, !0), A(d), A(o), A(i), Hr(R(i, 2), 17, () => B(t).links ?? [], Rr, (e, r, i) => {
							var a = ic(), o = I(a);
							q(o);
							var s = R(o, 2), l = I(s);
							l.disabled = i === 0, K(l, () => c.up, !0), A(l);
							var u = R(l, 2);
							K(u, () => c.down, !0), A(u);
							var d = R(u, 2);
							K(d, () => c.cross, !0), A(d), A(s);
							var f = R(s, 2), p = I(f);
							{
								let e = /* @__PURE__ */ N(() => B(r).page ?? "__href"), t = /* @__PURE__ */ N(() => X("tip.linkTarget")), a = /* @__PURE__ */ N(() => [...B(k).pages.map((e) => [e.id, e.title]), ["__href", X("opt.linkHref")]]);
								Z(p, {
									get value() {
										return B(e);
									},
									get title() {
										return B(t);
									},
									get options() {
										return B(a);
									},
									onchange: (e) => Yo(n, i, e)
								});
							}
							A(f);
							var m = R(f, 2), h = (e) => {
								var t = rc();
								q(t), z((e, n) => {
									J(t, B(r).href ?? ""), Y(t, "placeholder", e), Y(t, "title", n);
								}, [() => X("ph.hrefAnchor"), () => X("tip.hrefAnchor")]), V("change", t, (e) => Xo(n, i, e.target.value)), U(e, t);
							};
							G(m, (e) => {
								B(r).page || e(h);
							}), A(a), z((e, n) => {
								J(o, B(r).label), Y(o, "title", e), u.disabled = i === B(t).links.length - 1, Y(d, "title", n);
							}, [() => X("tip.linkLabel"), () => X("tip.removeLink")]), V("input", o, (e) => Uo(n, i, e.target.value)), V("click", l, () => Ho(n, i, -1)), V("click", u, () => Ho(n, i, 1)), V("click", d, () => Bo(n, i)), U(e, a);
						}), z((e, r, i) => {
							J(a, B(t).title), Y(a, "title", e), Y(s, "title", r), u.disabled = n === B(k).footer.columns.length - 1, Y(d, "title", i);
						}, [
							() => X("tip.footer.columnTitle"),
							() => X("tip.footer.addLink"),
							() => X("tip.footer.removeColumn")
						]), V("input", a, (e) => Ro(n, e.target.value)), V("click", s, () => zo(n)), V("click", l, () => Io(n, -1)), V("click", u, () => Io(n, 1)), V("click", d, () => Fo(n)), U(e, r);
					});
					var ce = R(se, 2), le = I(ce, !0);
					A(ce);
					var ue = R(ce, 2), de = I(ue), fe = R(de);
					{
						let e = /* @__PURE__ */ N(() => B(k).footer?.columnsAlign ?? "left"), t = /* @__PURE__ */ N(() => [["left", X("common.left")], ["center", X("common.center")]]);
						Z(fe, {
							get value() {
								return B(e);
							},
							get options() {
								return B(t);
							},
							onchange: (e) => Eo(e)
						});
					}
					A(ue), A(oe), A(re);
					var pe = R(re, 2), me = I(pe), he = I(me, !0);
					A(me);
					var ge = R(me, 2), _e = I(ge);
					Hr(_e, 17, () => B(k).footer?.social ?? [], Rr, (e, t, n) => {
						var r = Ql(), i = I(r), a = I(i);
						K(a, () => fa(B(t).icon) || "", !0), A(a);
						var o = R(a, 2);
						{
							let e = /* @__PURE__ */ N(() => X("blocks.icon"));
							Z(o, {
								get value() {
									return B(t).icon;
								},
								get title() {
									return B(e);
								},
								get options() {
									return ns;
								},
								onchange: (e) => es(n, e)
							});
						}
						A(i);
						var s = R(i, 2), l = I(s);
						l.disabled = n === 0, K(l, () => c.up, !0), A(l);
						var u = R(l, 2);
						K(u, () => c.down, !0), A(u);
						var d = R(u, 2);
						K(d, () => c.cross, !0), A(d), A(s);
						var f = R(s, 2);
						q(f), A(r), z((e, r) => {
							u.disabled = n === B(k).footer.social.length - 1, Y(d, "title", e), J(f, B(t).url), Y(f, "placeholder", r);
						}, [() => X("tip.removeLink"), () => X("ph.hrefMailto")]), V("click", l, () => $o(n, -1)), V("click", u, () => $o(n, 1)), V("click", d, () => Qo(n)), V("change", f, (e) => ts(n, e.target.value)), U(e, r);
					});
					var D = R(_e, 2), ve = I(D, !0);
					A(D), A(ge), A(pe);
					var O = R(pe, 2), ye = I(O), be = I(ye, !0);
					A(ye);
					var xe = R(ye, 2), Se = I(xe), Ce = I(Se);
					q(Ce);
					var we = R(Ce);
					A(Se);
					var Te = R(Se, 2), Ee = (e) => {
						let t = /* @__PURE__ */ N(() => B(k).footer.cta);
						var n = eu(), r = L(n), i = I(r), a = R(i);
						{
							let e = /* @__PURE__ */ N(() => B(t).kind ?? "button"), n = /* @__PURE__ */ N(() => [["button", X("opt.cta.button")], ["newsletter", X("opt.cta.newsletter")]]);
							Z(a, {
								get value() {
									return B(e);
								},
								get options() {
									return B(n);
								},
								onchange: (e) => Oo("kind", e)
							});
						}
						A(r);
						var o = R(r, 2), s = I(o);
						q(s);
						var c = R(s);
						A(o);
						var l = R(o, 2), u = I(l), d = R(u);
						q(d), A(l);
						var f = R(l, 2), p = I(f), m = R(p);
						q(m), A(f);
						var h = R(f, 2), g = I(h), _ = R(g);
						q(_), A(h);
						var v = R(h, 2), y = (e) => {
							var n = $l(), r = L(n), i = I(r), a = R(i);
							{
								let e = /* @__PURE__ */ N(() => B(t).page ?? "__href"), n = /* @__PURE__ */ N(() => [...B(k).pages.map((e) => [e.id, e.title]), ["__href", X("opt.linkHrefMailto")]]);
								Z(a, {
									get value() {
										return B(e);
									},
									get options() {
										return B(n);
									},
									onchange: (e) => ko(e)
								});
							}
							A(r);
							var o = R(r, 2), s = (e) => {
								var n = hc();
								q(n), z((e, r) => {
									J(n, B(t).href ?? ""), Y(n, "placeholder", e), Y(n, "title", r);
								}, [() => X("ph.hrefMailtoAnchor"), () => X("tip.hrefAnchor")]), V("change", n, (e) => Oo("href", e.target.value)), U(e, n);
							};
							G(o, (e) => {
								B(t).page || e(s);
							}), z((e, t) => {
								Y(r, "title", e), W(i, `${t ?? ""} `);
							}, [() => X("tip.footer.ctaTarget"), () => X("lbl.buttonTarget")]), U(e, n);
						}, b = (e) => {
							var n = pc(), r = L(n), i = I(r), a = R(i);
							q(a), A(r);
							var o = R(r, 2), s = I(o), c = R(s);
							q(c), A(o);
							var l = R(o, 2), u = I(l), d = R(u);
							q(d), A(l), z((e, n, f, p, m, h, g, _, v) => {
								Y(r, "title", e), W(i, `${n ?? ""} `), J(a, B(t).endpoint ?? ""), Y(a, "placeholder", f), Y(o, "title", p), W(s, `${m ?? ""} `), J(c, B(t).recipient ?? ""), Y(c, "placeholder", h), Y(l, "title", g), W(u, `${_ ?? ""} `), J(d, B(t).success ?? ""), Y(d, "placeholder", v);
							}, [
								() => X("tip.footer.ctaEndpoint"),
								() => X("lbl.newsletterEndpoint"),
								() => X("ph.endpoint"),
								() => X("tip.footer.ctaRecipient"),
								() => X("lbl.recipientFallback"),
								() => X("ph.email"),
								() => X("tip.footer.ctaSuccess"),
								() => X("lbl.confirmation"),
								() => X("ph.footer.ctaSuccess")
							]), V("change", a, (e) => Oo("endpoint", e.target.value)), V("change", c, (e) => Oo("recipient", e.target.value)), V("input", d, (e) => Oo("success", e.target.value)), U(e, n);
						};
						G(v, (e) => {
							(B(t).kind ?? "button") === "button" ? e(y) : e(b, -1);
						}), z((e, n, a, v, y, b, x, S, C, w, T, ee) => {
							Y(r, "title", e), W(i, `${n ?? ""} `), Y(o, "title", a), oi(s, B(t).big === !0), W(c, ` ${v ?? ""}`), Y(l, "title", y), W(u, `${b ?? ""} `), J(d, B(t).heading ?? ""), Y(d, "placeholder", x), Y(f, "title", S), W(p, `${C ?? ""} `), J(m, B(t).sub ?? ""), Y(h, "title", w), W(g, `${T ?? ""} `), J(_, B(t).label ?? ""), Y(_, "placeholder", ee);
						}, [
							() => X("tip.footer.ctaKind"),
							() => X("common.type"),
							() => X("tip.footer.ctaBig"),
							() => X("lbl.bigCentered"),
							() => X("tip.footer.ctaHeading"),
							() => X("lbl.heading"),
							() => X("ph.footer.ctaHeading"),
							() => X("tip.footer.ctaSub"),
							() => X("lbl.subText"),
							() => X("tip.footer.ctaLabel"),
							() => X("lbl.buttonText"),
							() => X("ph.footer.ctaLabel")
						]), V("change", s, (e) => Oo("big", e.target.checked)), V("input", d, (e) => Oo("heading", e.target.value)), V("input", m, (e) => Oo("sub", e.target.value)), V("input", _, (e) => Oo("label", e.target.value)), U(e, n);
					};
					G(Te, (e) => {
						B(k).footer?.cta && e(Ee);
					}), A(xe), A(O);
					var De = R(O, 2), Oe = I(De), ke = I(Oe, !0);
					A(Oe);
					var Ae = R(Oe, 2), je = I(Ae);
					r(je, () => "linkRow", () => B(k).footer?.linkRow ?? []);
					var Me = R(je, 2), Ne = I(Me, !0);
					A(Me), A(Ae), A(De);
					var Fe = R(De, 2), Ie = I(Fe), Le = I(Ie, !0);
					A(Ie);
					var Re = R(Ie, 2), ze = I(Re), Be = (e) => {
						var t = Lc(), n = L(t), r = I(n), i = R(r);
						{
							let e = /* @__PURE__ */ N(() => B(k).footer?.align ?? "left"), t = /* @__PURE__ */ N(() => [
								["left", X("common.left")],
								["center", X("common.center")],
								["right", X("common.right")]
							]);
							Z(i, {
								get value() {
									return B(e);
								},
								get options() {
									return B(t);
								},
								onchange: (e) => oo("footer", (t) => {
									t.align = e;
								})
							});
						}
						A(n), Pe(2), z((e, t) => {
							Y(n, "title", e), W(r, `${t ?? ""} `);
						}, [() => X("tip.footer.align"), () => X("lbl.align")]), U(e, t);
					};
					G(ze, (e) => {
						B(k).footer?.cta?.big !== !0 && e(Be);
					});
					var Ve = R(ze, 2), He = I(Ve, !0);
					A(Ve);
					var Ue = R(Ve, 2);
					n(Ue, () => Bn, () => B(k).footer?.background?.layers ?? []), A(Re), A(Fe);
					var We = R(Fe, 2), Ge = I(We), Ke = I(Ge, !0);
					A(Ge);
					var qe = R(Ge, 2), Je = I(qe), Ye = I(Je), Xe = R(Ye);
					q(Xe), A(Je);
					var Ze = R(Je, 2), Qe = I(Ze, !0);
					A(Ze);
					var $e = R(Ze, 2);
					r($e, () => "baseline", () => B(k).footer?.baseline ?? []);
					var et = R($e, 2), tt = I(et, !0);
					A(et), A(qe), A(We), A(t), z((e, t, n, r, s, c, l, u, d, p, m, h, g, v, E, te, ne, re, ie, oe, se, ce, fe, pe, me, ge, _e, D, O, ye, xe, Te) => {
						Y(i, "title", e), oi(a, t), W(o, ` ${n ?? ""}`), W(f, r), W(_, s), Y(y, "title", c), W(b, `${l ?? ""} `), J(x, B(k).footer?.brand?.title ?? ""), Y(x, "placeholder", u), Y(S, "title", d), W(C, `${p ?? ""} `), J(w, B(k).footer?.brand?.tagline ?? ""), Y(T, "title", m), W(ee, `${h ?? ""} `), W(ae, g), W(le, v), Y(ue, "title", E), W(de, `${te ?? ""} `), W(he, ne), W(ve, re), W(be, ie), Y(Se, "title", oe), oi(Ce, se), W(we, ` ${ce ?? ""}`), W(ke, fe), W(Ne, pe), W(Le, me), W(He, ge), W(Ke, _e), Y(Je, "title", D), W(Ye, `${O ?? ""} `), J(Xe, B(k).footer?.copyright ?? ""), Y(Xe, "placeholder", ye), W(Qe, xe), W(tt, Te);
					}, [
						() => X("tip.footer.show"),
						() => !!B(k).footer?.show,
						() => X("lbl.showFooter"),
						() => X("group.startpoint"),
						() => X("group.brand"),
						() => X("tip.footer.brandTitle"),
						() => X("lbl.title"),
						() => X("ph.footer.brandTitle"),
						() => X("tip.footer.tagline"),
						() => X("lbl.tagline"),
						() => X("tip.footer.brandMode"),
						() => X("lbl.brandMode"),
						() => X("group.columns"),
						() => X("ui.addColumn"),
						() => X("tip.footer.columnsAlign"),
						() => X("lbl.splitColumnAlign"),
						() => X("group.social"),
						() => X("ui.addSocial"),
						() => X("group.cta"),
						() => X("tip.footer.cta"),
						() => !!B(k).footer?.cta,
						() => X("lbl.showCta"),
						() => X("group.linkRow"),
						() => X("ui.addRowLink"),
						() => X("group.appearance"),
						() => X("lbl.background"),
						() => X("group.baseline"),
						() => X("tip.footer.copyright"),
						() => X("lbl.copyright"),
						() => X("ph.footer.copyright"),
						() => X("lbl.baselineLinks"),
						() => X("ui.addBaselineLink")
					]), V("change", a, (e) => oo("footer", (t) => {
						t.show = e.target.checked;
					})), V("input", x, (e) => uo("title", e.target.value)), V("input", w, (e) => uo("tagline", e.target.value)), V("click", ce, Mo), V("click", D, Zo), V("change", Ce, (e) => Do(e.target.checked)), V("click", Me, () => bo("linkRow")), V("input", Xe, (e) => go(e.target.value)), V("click", et, () => bo("baseline")), U(e, t);
				}, b = (e) => {
					var t = au(), n = I(t), r = (e) => {
						var t = ac(), n = I(t), r = R(n);
						{
							let e = /* @__PURE__ */ N(() => B(Ki) ?? ""), t = /* @__PURE__ */ N(() => [["", X("common.choose")], ...B(Ui).map((e) => [e, B(Gi)[e]?.name ?? e])]);
							Z(r, {
								get value() {
									return B(e);
								},
								get options() {
									return B(t);
								},
								onchange: (e) => F(Ki, e || null, !0)
							});
						}
						A(t), z((e) => W(n, `${e ?? ""} `), [() => X("blocks.samling")]), U(e, t);
					};
					G(n, (e) => {
						B(Ui).length && e(r);
					});
					var i = R(n, 2), a = (e) => {
						let t = /* @__PURE__ */ N(() => B(Gi)[B(Ki)]);
						var n = iu(), r = L(n), i = I(r), a = I(i, !0);
						A(i);
						var o = R(i, 2);
						K(o, () => c.cross, !0), A(o), A(r);
						var s = R(r, 2);
						Hr(s, 19, () => B(t).entries, (e) => e.id, (e, n, r) => {
							var i = ru(), a = I(i), o = I(a);
							A(a);
							var s = R(a, 2), l = I(s), u = I(l);
							q(u);
							var d = R(u, 2), f = I(d);
							K(f, () => c.up, !0), A(f);
							var p = R(f, 2);
							K(p, () => c.down, !0), A(p);
							var m = R(p, 2);
							K(m, () => c.cross, !0), A(m), A(d), A(l);
							var h = R(l, 2), g = I(h), _ = R(g);
							q(_), A(h);
							var v = R(h, 2);
							ct(v);
							var y = R(v, 2), b = I(y), x = R(b);
							q(x), A(y);
							var S = R(y, 2), C = I(S), w = I(C), T = R(w);
							A(C);
							var ee = R(C, 2), E = (e) => {
								var t = nu(), r = L(t), i = R(r, 2);
								K(i, () => c.cross, !0), A(i), z((e) => {
									Y(r, "src", B(n).image), Y(i, "title", e);
								}, [() => X("tip.removeImage")]), V("click", i, () => Da(B(Ki), B(n).id, "image", "")), U(e, t);
							};
							G(ee, (e) => {
								B(n).image && e(E);
							}), A(S), A(s), A(i), z((e, i, a, s, c, l, d, h) => {
								W(o, `${e ?? ""}${B(n).date ? ` · ${B(n).date}` : ""}`), J(u, B(n).title), Y(u, "title", i), f.disabled = B(r) === 0, p.disabled = B(r) === B(t).entries.length - 1, Y(m, "title", a), W(g, `${s ?? ""} `), J(_, B(n).date ?? ""), Y(v, "placeholder", c), J(v, B(n).text ?? ""), W(b, `${l ?? ""} `), J(x, B(n).href ?? ""), Y(x, "placeholder", d), W(w, `${h ?? ""} `);
							}, [
								() => B(n).title.replace(/<[^>]*>/g, ""),
								() => X("lbl.title"),
								() => X("tip.collections.deleteEntry"),
								() => X("lbl.date"),
								() => X("ph.collections.text"),
								() => X("lbl.link"),
								() => X("ph.collections.href"),
								() => B(n).image ? X("ui.changeImage") : X("ui.addImage")
							]), V("change", u, (e) => Da(B(Ki), B(n).id, "title", e.target.value || "Uten tittel")), V("click", f, () => Oa(B(Ki), B(r), -1)), V("click", p, () => Oa(B(Ki), B(r), 1)), V("click", m, () => ka(B(Ki), B(n).id)), V("change", _, (e) => Da(B(Ki), B(n).id, "date", e.target.value)), V("change", v, (e) => Da(B(Ki), B(n).id, "text", e.target.value)), V("change", x, (e) => Da(B(Ki), B(n).id, "href", e.target.value)), V("change", T, (e) => ja(B(Ki), B(n).id, e)), U(e, i);
						});
						var l = R(s, 2), u = (e) => {
							var t = cc(), n = I(t, !0);
							A(t), z((e) => W(n, e), [() => X("hint.collections.empty")]), U(e, t);
						};
						G(l, (e) => {
							B(t).entries.length || e(u);
						}), Pe(2), z((e, t) => {
							W(a, e), Y(o, "title", t);
						}, [() => X("ui.addEntry"), () => X("tip.collections.deleteCollection")]), V("click", i, () => Ea(B(Ki))), V("click", o, () => wa(B(Ki))), U(e, n);
					};
					G(i, (e) => {
						B(Ki) && B(Gi)[B(Ki)] && e(a);
					});
					var o = R(i, 2), s = I(o), l = R(s);
					q(l), A(o);
					var u = R(o, 2), d = I(u);
					Z(R(d), {
						get value() {
							return B(Yi);
						},
						get options() {
							return Xi;
						},
						onchange: (e) => F(Yi, e, !0)
					}), A(u);
					var f = R(u, 2), p = I(f, !0);
					A(f), A(t), z((e, t, n, r, i) => {
						W(s, `${e ?? ""} `), Y(l, "placeholder", t), W(d, `${n ?? ""} `), f.disabled = r, W(p, i);
					}, [
						() => X("lbl.newCollectionName"),
						() => X("ph.collections.name"),
						() => X("common.type"),
						() => !B(qi).trim(),
						() => X("ui.createCollection")
					]), V("keydown", l, (e) => e.key === "Enter" && xa()), ui(l, () => B(qi), (e) => F(qi, e)), V("click", f, xa), U(e, t);
				}, x = (e) => {
					var t = fu(), n = I(t), r = (e) => {
						var t = cc(), n = I(t, !0);
						A(t), z((e) => W(n, e), [() => X("hint.plugins.empty")]), U(e, t);
					}, i = /* @__PURE__ */ N(() => !Ka().length);
					G(n, (e) => {
						B(i) && e(r);
					});
					var a = R(n, 2);
					Hr(a, 16, Ka, (e) => e, (e, t) => {
						let n = /* @__PURE__ */ N(() => Va[t]), r = /* @__PURE__ */ N(() => (B(Ra)?.enabled ?? []).includes(t));
						var i = cu();
						let a;
						var o = I(i), s = I(o), l = I(s, !0);
						A(s);
						var u = R(s, 2), d = (e) => {
							var t = ou(), r = I(t);
							A(t), z(() => W(r, `v${B(n).version ?? ""}`)), U(e, t);
						};
						G(u, (e) => {
							B(n)?.version && e(d);
						});
						var f = R(u, 2), p = I(f), m = I(p);
						q(m);
						var h = R(m);
						A(p);
						var g = R(p, 2);
						K(g, () => c.cross, !0), A(g), A(f), A(o);
						var _ = R(o, 2), v = (e) => {
							var t = su(), r = I(t, !0);
							A(t), z((e) => W(r, e), [() => B(n).errors.join("; ")]), U(e, t);
						}, y = (e) => {
							var t = su(), r = I(t, !0);
							A(t), z((e) => W(r, e), [() => X("plugin.engineMismatch", {
								required: B(n).requiresEngine,
								current: B(Q)
							})]), U(e, t);
						}, b = (e) => {
							var t = su(), r = I(t, !0);
							A(t), z((e) => W(r, e), [() => X("plugin.cspNeeded", { list: Xa(B(n).csp).join(", ") })]), U(e, t);
						}, x = /* @__PURE__ */ N(() => B(n)?.csp && Xa(B(n).csp).length);
						G(_, (e) => {
							B(n)?.errors?.length ? e(v) : B(n) && !B(n).satisfied ? e(y, 1) : B(x) && e(b, 2);
						});
						var S = R(_, 2), C = (e) => {
							var t = cc(), r = I(t, !0);
							A(t), z((e) => W(r, e), [() => X("plugin.languages", { list: B(n).languages.map((e) => e.name).join(", ") })]), U(e, t);
						};
						G(S, (e) => {
							B(n)?.languages?.length && e(C);
						}), A(i), z((e, t, o, s, c) => {
							a = $r(i, 1, "plugin-row svelte-1n46o8q", null, a, { "plugin-broken": B(n)?.errors?.length }), W(l, e), Y(p, "title", t), oi(m, B(r)), m.disabled = o, W(h, ` ${s ?? ""}`), Y(g, "title", c);
						}, [
							() => B(n)?.names?.[Oi()] ?? B(n)?.name ?? t,
							() => B(r) ? X("tip.plugins.on") : X("tip.plugins.off"),
							() => !!B(n)?.errors?.length,
							() => B(r) ? X("ui.on") : X("ui.off"),
							() => X("tip.plugins.remove")
						]), V("change", m, (e) => to(t, e.target.checked)), V("click", g, () => ro(t)), U(e, i);
					});
					var o = R(a, 2), s = (e) => {
						var t = uu(), n = R(L(t), 2), r = I(n, !0);
						A(n), Hr(R(n, 2), 16, () => B(Ua), (e) => e, (e, t) => {
							var n = lu(), r = I(n), i = I(r), a = I(i, !0);
							A(i);
							var o = R(i, 2), s = (e) => {
								var n = ou(), r = I(n);
								A(n), z(() => W(r, `v${Va[t].version ?? ""}`)), U(e, n);
							};
							G(o, (e) => {
								Va[t]?.version && e(s);
							});
							var l = R(o, 2), u = I(l);
							K(u, () => c.right, !0), A(u), A(l), A(r), A(n), z((e, t) => {
								W(a, e), Y(u, "title", t);
							}, [() => Va[t]?.names?.[Oi()] ?? Va[t]?.name ?? t, () => X("tip.plugins.addFound")]), V("click", u, () => ao(t)), U(e, n);
						}), z((e) => W(r, e), [() => X("hint.plugins.found")]), U(e, t);
					};
					G(o, (e) => {
						B(Ua).length && e(s);
					});
					var l = R(o, 2), u = (e) => {
						var t = Mr(), n = L(t), r = (e) => {
							var t = cc(), n = I(t, !0);
							A(t), z((e) => W(n, e), [() => X("hint.plugins.autoDiscover")]), U(e, t);
						};
						G(n, (e) => {
							B(Ua).length || e(r);
						}), U(e, t);
					}, d = (e) => {
						var t = du(), n = R(L(t), 2);
						q(n);
						var r = R(n, 2), i = I(r, !0);
						A(r);
						var a = R(r, 2), o = (e) => {
							var t = su(), n = I(t, !0);
							A(t), z(() => W(n, B(Ha))), U(e, t);
						};
						G(a, (e) => {
							B(Ha) && e(o);
						}), z((e, t, a) => {
							Y(n, "placeholder", e), r.disabled = t, W(i, a);
						}, [
							() => X("ph.plugins.folder"),
							() => !B($).trim(),
							() => X("ui.addPlugin")
						]), V("keydown", n, (e) => e.key === "Enter" && io()), ui(n, () => B($), (e) => F($, e)), V("click", r, io), U(e, t);
					};
					G(l, (e) => {
						B(Ga) === "ok" ? e(u) : e(d, -1);
					}), A(t), U(e, t);
				}, S = (e) => {
					var t = ql(), n = I(t), r = (e) => {
						var t = cc(), n = I(t, !0);
						A(t), z((e) => W(n, e), [() => X("hint.history.loading")]), U(e, t);
					}, i = (e) => {
						var t = ol(), n = L(t), r = (e) => {
							var t = cc(), n = I(t, !0);
							A(t), z(() => W(n, B(_r))), U(e, t);
						};
						G(n, (e) => {
							B(_r) && e(r);
						});
						var i = R(n, 2), a = (e) => {
							var t = mu(), n = L(t), r = I(n, !0);
							A(n), Hr(R(n, 2), 19, () => B(gr), (e) => e.sha, (e, t, n) => {
								var r = pu();
								let i;
								var a = I(r), o = I(a, !0);
								A(a);
								var s = R(a, 2), c = I(s);
								A(s), A(r), z((e) => {
									i = $r(r, 1, "history-row svelte-1n46o8q", null, i, { head: B(n) === 0 }), Y(a, "title", B(t).sha), W(o, B(t).message), W(c, `${B(t).author ?? ""}${e ?? ""}`);
								}, [() => B(t).date ? ` · ${br.format(new Date(B(t).date))}` : ""]), U(e, r);
							}), z((e, t) => {
								n.disabled = B(vr) || !B(T)?.allowed, Y(n, "title", e), W(r, t);
							}, [() => B(T)?.allowed ? X("tip.history.revert") : X("tip.history.needsAccess"), () => X("ui.revertLast")]), V("click", n, wr), U(e, t);
						};
						G(i, (e) => {
							B(gr).length > 0 && e(a);
						}), U(e, t);
					};
					G(n, (e) => {
						B(gr) === null ? e(r) : e(i, -1);
					}), A(t), U(e, t);
				}, C = (e) => {
					var t = ql(), n = I(t), r = (e) => {
						var t = cc(), n = I(t, !0);
						A(t), z((e) => W(n, e), [() => X("update.checking")]), U(e, t);
					}, i = (e) => {
						var t = hu(), n = L(t), r = I(n, !0);
						A(n);
						var i = R(n, 2), a = I(i, !0);
						A(i), z((e) => {
							W(r, B(Dr)), W(a, e);
						}, [() => X("update.retry")]), V("click", i, Ar), U(e, t);
					}, a = (e) => {
						var t = Eu(), n = L(t), r = I(n), i = I(r, !0);
						A(r);
						var a = R(r, 2), o = (e) => {
							var t = gu(), n = L(t);
							K(n, () => c.right, !0), A(n);
							var r = R(n, 2), i = I(r, !0);
							A(r), z(() => W(i, B(Er).target)), U(e, t);
						};
						G(a, (e) => {
							B(Er).upToDate || e(o);
						}), A(n);
						var s = R(n, 2), l = (e) => {
							var t = cc(), n = I(t, !0);
							A(t), z((e) => W(n, e), [() => X("update.upToDate")]), U(e, t);
						}, u = (e) => {
							var t = Tu(), n = L(t), r = I(n, !0);
							A(n);
							var i = R(n, 2), a = (e) => {
								var t = _u(), n = I(t), r = I(n, !0);
								A(n);
								var i = R(n, 2), a = I(i), o = I(a, !0);
								A(a), A(i), A(t), z((e) => {
									W(r, e), W(o, B(Er).notes);
								}, [() => X("update.aboutVersion", { target: B(Er).target })]), U(e, t);
							};
							G(i, (e) => {
								B(Er).notes && e(a);
							});
							var o = R(i, 2), s = (e) => {
								var t = vu(), n = I(t), r = I(n);
								K(r, () => c.warn, !0), A(r);
								var i = R(r);
								A(n);
								var a = R(n, 2), o = I(a), s = I(o, !0);
								A(o), A(a), A(t), z((e, t) => {
									Y(n, "title", e), W(i, ` ${t ?? ""}`), W(s, B(Er).headers.upstream);
								}, [() => X("update.headersManual"), () => X("update.headersTitle")]), U(e, t);
							};
							G(o, (e) => {
								B(Er).headers?.upstream && e(s);
							});
							var l = R(o, 2);
							Hr(l, 17, () => B(Er).changes.filter((e) => e.atom && e.conflict), (e) => e.path, (e, t) => {
								var n = bu(), r = I(n), i = I(r, !0);
								A(r);
								var a = R(r, 2), o = I(a), s = (e) => {
									var t = yu(), n = I(t, !0);
									A(t), z((e) => W(n, e), [() => X("update.actionDelete")]), U(e, t);
								};
								G(o, (e) => {
									B(t).action === "delete" && e(s);
								});
								var l = R(o, 2);
								K(l, () => c.warn, !0), A(l), A(a), A(n), z((e) => {
									Y(r, "title", B(t).path), W(i, B(t).path), Y(l, "title", e);
								}, [() => X(`update.conflict.${B(t).conflict}`)]), U(e, n);
							});
							var u = R(l, 2), d = I(u), f = I(d);
							A(d);
							var p = R(d, 2);
							Hr(p, 21, () => B(Er).changes.filter((e) => e.atom && !e.conflict), (e) => e.path, (e, t) => {
								var n = xu(), r = I(n), i = I(r, !0);
								A(r);
								var a = R(r, 2), o = (e) => {
									var t = yu(), n = I(t, !0);
									A(t), z((e) => W(n, e), [() => X("update.actionDelete")]), U(e, t);
								};
								G(a, (e) => {
									B(t).action === "delete" && e(o);
								}), A(n), z(() => {
									Y(r, "title", B(t).path), W(i, B(t).path);
								}), U(e, n);
							}), A(p), A(u);
							var m = R(u, 2), h = (e) => {
								var t = wu(), n = L(t), r = I(n), i = I(r, !0);
								A(r);
								var a = R(r, 2), o = I(a, !0);
								A(a), A(n), Hr(R(n, 2), 17, () => B(Er).changes.filter((e) => !e.atom), (e) => e.path, (e, t) => {
									var n = Cu(), r = I(n);
									let i;
									var a = I(r, !0);
									A(r);
									var o = R(r, 2), s = I(o), l = (e) => {
										var t = yu(), n = I(t, !0);
										A(t), z((e) => W(n, e), [() => X("update.actionDelete")]), U(e, t);
									};
									G(s, (e) => {
										B(t).action === "delete" && e(l);
									});
									var u = R(s, 2), d = (e) => {
										var n = Su();
										K(n, () => c.warn, !0), A(n), z((e) => Y(n, "title", e), [() => X(`update.conflict.${B(t).conflict}`)]), U(e, n);
									};
									G(u, (e) => {
										B(t).conflict && e(d);
									});
									var f = R(u, 2);
									q(f), A(o), A(n), z((e, n, o, s) => {
										i = $r(r, 1, "update-path svelte-1n46o8q", null, i, e), Y(r, "title", B(t).path), W(a, B(t).path), oi(f, n), Y(f, "title", o), Y(f, "aria-label", s);
									}, [
										() => ({ skipped: B(kr).has(B(t).path) }),
										() => B(kr).has(B(t).path),
										() => X("update.keepMine.title"),
										() => X("update.keepMine")
									]), V("change", f, () => H(B(t).path)), U(e, n);
								}), z((e, t) => {
									W(i, e), W(o, t);
								}, [() => X("update.optionalTitle"), () => X("update.keepMine")]), U(e, t);
							}, g = /* @__PURE__ */ N(() => B(Er).changes.some((e) => !e.atom));
							G(m, (e) => {
								B(g) && e(h);
							});
							var _ = R(m, 2), v = I(_, !0);
							A(_), z((e, t, n, i, a, o) => {
								W(r, e), Y(d, "title", t), W(f, `${n ?? ""} · ${i ?? ""}`), _.disabled = B(Or) || !B(T)?.allowed, Y(_, "title", a), W(v, o);
							}, [
								() => X("update.summary", {
									writes: B(Er).changes.filter((e) => e.action === "write").length,
									deletes: B(Er).changes.filter((e) => e.action === "delete").length
								}),
								() => X("update.atomGroup.title"),
								() => X("update.atomTitle"),
								() => B(Er).changes.filter((e) => e.atom).length,
								() => B(T)?.allowed ? X("update.run.title") : X("tip.history.needsAccess"),
								() => X("update.run", { target: B(Er).target })
							]), V("click", _, jr), U(e, t);
						};
						G(s, (e) => {
							B(Er).upToDate ? e(l) : e(u, -1);
						}), z((e) => W(i, e), [() => X("update.current", { version: B(Er).current })]), U(e, t);
					};
					G(n, (e) => {
						B(Or) && !B(Er) ? e(r) : B(Dr) ? e(i, 1) : B(Er) && e(a, 2);
					}), A(t), U(e, t);
				};
				G(s, (e) => {
					B(Qe) === "pages" ? e(l) : B(Qe) === "nav" ? e(u, 1) : B(Qe) === "site" ? e(f, 2) : B(Qe) === "theme" ? e(p, 3) : B(Qe) === "blocks" ? e(h, 4) : B(Qe) === "grid" ? e(_, 5) : B(Qe) === "properties" ? e(v, 6) : B(Qe) === "footer" ? e(y, 7) : B(Qe) === "collections" ? e(b, 8) : B(Qe) === "plugins" ? e(x, 9) : B(Qe) === "history" ? e(S, 10) : B(Qe) === "update" && e(C, 11);
				}), A(t), z((e) => {
					Y(i, "title", e), W(o, et[B(Qe)]);
				}, [() => tt[B(Qe)]?.map((e) => X(e)).join("\n")]), U(e, t);
			};
			G(v, (e) => {
				B(Qe) && e(y);
			}), z((e) => {
				p = $r(f, 1, "rail-gear svelte-1n46o8q", null, p, { active: B(Vr) }), Y(f, "title", e);
			}, [() => X("settings.title")]), V("click", f, () => F(Vr, !B(Vr))), U(e, t);
		};
		G(i, (e) => {
			B(E) && e(o);
		});
		var s = R(i, 2);
		let f;
		var p = I(s), h = I(p);
		mi(h, (e) => F(w, e), () => B(w)), A(p), A(s), mi(s, (e) => F(ne, e), () => B(ne)), A(t), z((e) => {
			f = $r(s, 1, "frame-wrap svelte-1n46o8q", null, f, { mobile: B(te) === "mobile" }), ti(p, `width:${B(fe) ?? ""}px; height:${B(pe) ?? ""}px`), Y(h, "title", e), Y(h, "src", `/?page=${B(g)}&preview=1`), ti(h, `width:${B(ce) ?? ""}px; height:${B(de) ?? ""}px; transform:scale(${B(le) ?? ""}); transform-origin:top left`);
		}, [() => X("ui.previewTitle")]), Cr("load", h, Lr), xr(h), U(e, t);
	}, Wd = (e) => {
		var t = Au(), n = I(t, !0);
		A(t), z((e) => W(n, e), [() => X("ui.loading")]), U(e, t);
	};
	G(Hd, (e) => {
		B(h) ? e(Ud) : e(Wd, -1);
	});
	var Gd = R(Hd, 2), Kd = (e) => {
		Aa(e, {
			get image() {
				return B(gi);
			},
			onapply: vi,
			oncancel: () => F(gi, null)
		});
	};
	G(Gd, (e) => {
		B(gi) && e(Kd);
	});
	var qd = R(Gd, 2), Jd = (e) => {
		var t = Mu(), n = I(t), r = I(n), i = I(r, !0);
		A(r);
		var a = R(r, 2);
		Hr(a, 16, () => B(ze).lines, (e) => e, (e, t) => {
			var n = ju(), r = I(n, !0);
			A(n), z(() => W(r, t)), U(e, n);
		});
		var o = R(a, 2), s = (e) => {
			var t = hc();
			q(t), st(t, !0), z(() => Y(t, "placeholder", B(ze).placeholder)), V("keydown", t, (e) => e.key === "Enter" && B(ze).value.trim() && Ue(!0)), ui(t, () => B(ze).value, (e) => B(ze).value = e), U(e, t);
		};
		G(o, (e) => {
			B(ze).prompt && e(s);
		});
		var c = R(o, 2), l = I(c), u = I(l, !0);
		A(l);
		var d = R(l, 2), f = I(d, !0);
		A(d), A(c), A(n), A(t), z(() => {
			W(i, B(ze).title), W(u, B(ze).cancelLabel), W(f, B(ze).okLabel);
		}), V("click", l, () => Ue(!1)), V("click", d, () => Ue(!0)), U(e, t);
	};
	G(qd, (e) => {
		B(ze) && e(Jd);
	});
	var Yd = R(qd, 2), Xd = (e) => {
		var t = Nu(), n = I(t), r = I(n), i = I(r, !0);
		A(r);
		var a = R(r, 2), o = I(a, !0);
		A(a);
		var s = R(a, 2), c = I(s), l = R(c);
		q(l), A(s);
		var u = R(s, 2), d = I(u), f = R(d);
		{
			let e = /* @__PURE__ */ N(() => X("setup.accentPick"));
			Wi(f, {
				get value() {
					return B(Je);
				},
				get label() {
					return B(e);
				},
				onchange: (e) => F(Je, e, !0)
			});
		}
		A(u);
		var p = R(u, 2), m = I(p), h = R(m);
		{
			let e = /* @__PURE__ */ N(() => X("setup.bgLabel"));
			Wi(h, {
				get value() {
					return B(Ye);
				},
				get label() {
					return B(e);
				},
				onchange: (e) => F(Ye, e, !0)
			});
		}
		A(p);
		var g = R(p, 2), _ = I(g, !0);
		A(g);
		var v = R(g, 2), y = I(v), b = I(y, !0);
		A(y);
		var x = R(y, 2), S = I(x, !0);
		A(x), A(v), A(n), A(t), z((e, t, n, r, a, s, u, f, p, h) => {
			W(i, e), W(o, t), W(c, `${n ?? ""} `), Y(l, "placeholder", r), W(d, `${a ?? ""} `), W(m, `${s ?? ""} `), W(_, u), W(b, f), x.disabled = p, W(S, h);
		}, [
			() => X("setup.title"),
			() => X("setup.intro"),
			() => X("setup.nameLabel"),
			() => X("ph.setup.name"),
			() => X("setup.accentLabel"),
			() => X("setup.bgLabel"),
			() => X("setup.outro"),
			() => X("setup.skip"),
			() => !B(qe).trim(),
			() => X("setup.start")
		]), V("keydown", l, (e) => e.key === "Enter" && Ze()), ui(l, () => B(qe), (e) => F(qe, e)), V("click", y, Xe), V("click", x, Ze), U(e, t);
	};
	G(Yd, (e) => {
		B(We) && e(Xd);
	});
	var Zd = R(Yd, 2), Qd = (e) => {
		var t = Pu();
		let n;
		var r = I(t), i = I(r, !0);
		A(r);
		var a = R(r, 2);
		A(t), z((e) => {
			n = $r(t, 1, "toast svelte-1n46o8q", null, n, {
				ok: B(y) === "ok",
				error: B(y) === "error"
			}), W(i, B(v)), Y(a, "title", e);
		}, [() => X("ui.close")]), V("click", a, () => x("")), U(e, t);
	};
	G(Zd, (e) => {
		B(v) && e(Qd);
	}), A(Dd);
	var $d = R(Dd, 2), ef = (e) => {
		var t = Fu(), n = I(t), r = I(n), i = I(r, !0);
		A(r);
		var o = R(r, 2);
		K(o, () => c.cross, !0), A(o), A(n);
		var s = R(n, 2), l = I(s);
		a(l), A(s), A(t), z((e, n) => {
			ti(t, `left: ${B(ht).left ?? ""}px; top: ${B(ht).top ?? ""}px`), W(i, e), Y(o, "title", n);
		}, [() => X("blocks.suffix", { label: zt[B(j).type] ?? B(j).type }), () => X("tip.closeEsc")]), V("click", o, () => F(ht, null)), U(e, t);
	};
	G($d, (e) => {
		B(ht) && B(j) && e(ef);
	}), z(() => jd = $r(Ad, 1, "topbar svelte-1n46o8q", null, jd, { hidden: !B(E) })), U(e, Ed), Ke();
}
//#endregion
//#region src/main.js
wr([
	"click",
	"input",
	"pointerdown",
	"change",
	"keydown"
]), document.documentElement.lang = await ji();
var Ru = Nr(Lu, { target: document.getElementById("urd-admin") });
//#endregion
export { Ru as default };
