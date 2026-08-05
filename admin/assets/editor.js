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
var h = 1024, g = 2048, _ = 4096, v = 8192, y = 16384, b = 32768, x = 1 << 25, S = 65536, C = 1 << 19, w = 1 << 20, T = 1 << 25, E = 65536, D = 1 << 21, ee = 1 << 22, te = 1 << 23, ne = Symbol("$state"), re = Symbol("legacy props"), ie = Symbol(""), ae = Symbol("attributes"), oe = Symbol("class"), se = Symbol("style"), ce = Symbol("text"), le = Symbol("form reset"), ue = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), de = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function fe() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function pe(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function me(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function he() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function O(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function ge() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function k(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function A() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function _e() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function ve() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function ye() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/constants.js
var be = {}, j = Symbol("uninitialized"), xe = "http://www.w3.org/1999/xhtml", Se = "http://www.w3.org/2000/svg", Ce = "http://www.w3.org/1998/Math/MathML";
function we() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Te(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Ee() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var De = !1;
function Oe(e) {
	De = e;
}
var ke;
function Ae(e) {
	if (e === null) throw Te(), be;
	return ke = e;
}
function je() {
	return Ae(/* @__PURE__ */ ln(ke));
}
function M(e) {
	if (De) {
		if (/* @__PURE__ */ ln(ke) !== null) throw Te(), be;
		ke = e;
	}
}
function Me(e = 1) {
	if (De) {
		for (var t = e, n = ke; t--;) n = /* @__PURE__ */ ln(n);
		ke = n;
	}
}
function Ne(e = !0) {
	for (var t = 0, n = ke;;) {
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
function Pe(e) {
	if (!e || e.nodeType !== 8) throw Te(), be;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Fe(e) {
	return e === this.v;
}
function Ie(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Le(e) {
	return !Ie(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/shared/clone.js
var Re = [];
function ze(e, t = !1, n = !1) {
	return Be(e, /* @__PURE__ */ new Map(), "", Re, null, n);
}
function Be(t, n, r, i, a = null, o = !1) {
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
				d in t && (u[d] = Be(f, n, r, i, null, o));
			}
			return u;
		}
		if (l(t) === s) {
			u = {}, n.set(t, u), a !== null && n.set(a, u);
			for (var p of Object.keys(t)) u[p] = Be(t[p], n, r, i, null, o);
			return u;
		}
		if (t instanceof Date) return structuredClone(t);
		if (typeof t.toJSON == "function" && !o) return Be(t.toJSON(), n, r, i, t);
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
var Ve = null;
function He(e) {
	Ve = e;
}
function Ue(e, t = !1, n) {
	Ve = {
		p: Ve,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: Gn,
		l: null
	};
}
function We(e) {
	var t = Ve, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) bn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, Ve = t.p, e ?? {};
}
function Ge() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Ke = [];
function qe() {
	var e = Ke;
	Ke = [], f(e);
}
function Je(e) {
	if (Ke.length === 0 && !jt) {
		var t = Ke;
		queueMicrotask(() => {
			t === Ke && qe();
		});
	}
	Ke.push(e);
}
function Ye() {
	for (; Ke.length > 0;) qe();
}
function Xe(e) {
	var t = Gn;
	if (t === null) return Hn.f |= te, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	Ze(e, t);
}
function Ze(e, t) {
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
var Qe = ~(g | _ | h);
function $e(e, t) {
	e.f = e.f & Qe | t;
}
function et(e) {
	e.f & 512 || e.deps === null ? $e(e, h) : $e(e, _);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function tt(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= E, tt(t.deps));
}
function nt(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), tt(e.deps), $e(e, h);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var rt = !1;
function N(e) {
	var t = rt;
	try {
		return rt = !1, [e(), rt];
	} finally {
		rt = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
function it(e) {
	De && /* @__PURE__ */ cn(e) !== null && un(e);
}
var at = !1;
function ot() {
	at || (at = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[le]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function st(e) {
	var t = Hn, n = Gn;
	Wn(null), Kn(null);
	try {
		return e();
	} finally {
		Wn(t), Kn(n);
	}
}
function ct(e, t, n, r = n) {
	e.addEventListener(t, () => st(n));
	let i = e[le];
	e[le] = i ? () => {
		i(), r(!0);
	} : () => r(!0), ot();
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function lt(e) {
	let t = 0, n = Jt(0), r;
	return () => {
		_n() && (V(n), wn(() => (t === 0 && (r = pr(() => e(() => Qt(n)))), t += 1, () => {
			Je(() => {
				--t, t === 0 && (r?.(), r = void 0, Qt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var ut = S | C;
function dt(e, t, n, r) {
	new ft(e, t, n, r);
}
var ft = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = De ? ke : null;
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
	#h = lt(() => (this.#m = Jt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = Gn;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = Gn.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = Tn(() => {
			if (De) {
				let e = this.#t;
				je();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, ut), De && (this.#e = ke);
	}
	#g() {
		try {
			this.#a = En(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		Je(r), t && (this.#s = En(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				Ee();
				return;
			}
			t = !0, n && ye(), this.#s !== null && Nn(this.#s, () => {
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
					Ze(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = En(() => e(this.#e)), Je(() => {
			var e = this.#c = document.createDocumentFragment(), t = sn();
			e.append(t), this.#a = this.#S(() => En(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, Nn(this.#o, () => {
				this.#o = null;
			}), this.#x(Dt));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = En(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Ln(this.#a, e);
				let t = this.#n.pending;
				this.#o = En(() => t(this.#e));
			} else this.#x(Dt);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		nt(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = Gn, n = Hn, r = Ve;
		Kn(this.#i), Wn(this.#i), He(this.#i.ctx);
		try {
			return Lt.ensure(), e();
		} catch (e) {
			return Xe(e), null;
		} finally {
			Kn(t), Wn(n), He(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Nn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, Je(() => {
			this.#d = !1, this.#m && Xt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), V(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		Dt?.is_fork ? (this.#a && Dt.skip_effect(this.#a), this.#o && Dt.skip_effect(this.#o), this.#s && Dt.skip_effect(this.#s), Dt.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (An(this.#a), null), this.#o &&= (An(this.#o), null), this.#s &&= (An(this.#s), null), De && (Ae(this.#t), Me(), Ae(Ne()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return En(() => {
						var r = Gn;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return Ze(e, this.#i.parent), null;
				}
			}));
		};
		Je(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				Ze(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => Ze(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function pt(e, t, n, r) {
	let i = Ge() ? _t : bt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = Gn, c = mt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				Ze(e, s);
			}
			ht();
		}
	}
	var d = gt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ yt(e))).then(u).catch((e) => Ze(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), ht();
	}) : f();
}
function mt() {
	var e = Gn, t = Hn, n = Ve, r = Dt;
	return function(i = !0) {
		Kn(e), Wn(t), He(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function ht(e = !0) {
	Kn(null), Wn(null), He(null), e && Dt?.deactivate();
}
function gt() {
	var e = Gn, t = e.b, n = Dt, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function _t(e) {
	var t = 2 | g;
	return Gn !== null && (Gn.f |= C), {
		ctx: Ve,
		deps: null,
		effects: null,
		equals: Fe,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: j,
		wv: 0,
		parent: Gn,
		ac: null
	};
}
var vt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function yt(e, t, n) {
	let r = Gn;
	r === null && fe();
	var i = void 0, a = Jt(j), o = !Hn, s = /* @__PURE__ */ new Set();
	return Cn(() => {
		var t = Gn, n = p();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ue && n.reject(e);
			}).finally(ht);
		} catch (e) {
			n.reject(e), ht();
		}
		var c = Dt;
		if (o) {
			if (t.f & 32768) var l = gt();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(vt);
			else for (let e of s.values()) e.reject(vt);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== vt && (c.activate(), t ? (a.f |= te, Xt(a, t)) : (a.f & 8388608 && (a.f ^= te), Xt(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), vn(() => {
		for (let e of s) e.reject(vt);
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
function P(e) {
	let t = /* @__PURE__ */ _t(e);
	return Jn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function bt(e) {
	let t = /* @__PURE__ */ _t(e);
	return t.equals = Le, t;
}
function xt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) An(t[n]);
	}
}
function St(e) {
	var t, n = Gn, r = e.parent;
	if (!Bn && r !== null && e.v !== j && r.f & 24576) return we(), e.v;
	Kn(r);
	try {
		e.f &= ~E, xt(e), t = or(e);
	} finally {
		Kn(n);
	}
	return t;
}
function Ct(e) {
	var t = St(e);
	if (!e.equals(t) && (e.wv = rr(), (!Dt?.is_fork || e.deps === null) && (Dt === null ? e.v = t : (Dt.capture(e, t, !0), Ot?.capture(e, t, !0)), e.deps === null))) {
		$e(e, h);
		return;
	}
	Bn || (kt === null ? et(e) : (_n() || Dt?.is_fork) && kt.set(e, t));
}
function wt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && st(() => {
		t.ac.abort(ue), t.ac = null;
	}), t.fn !== null && (t.teardown = d), cr(t, 0), On(t));
}
function Tt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && lr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var Et = null, Dt = null, Ot = null, kt = null, At = null, jt = !1, Mt = !1, Nt = null, Pt = null, Ft = 0, It = 1, Lt = class e {
	id = It++;
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
		Et === null ? Et = this : (Et.#n = this, this.#t = Et), Et = this;
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
			for (var r of n.d) $e(r, g), t(r);
			for (r of n.m) $e(r, _), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, Ft++ > 1e3 && (this.#x(), zt());
		for (let e of this.#u) this.#d.delete(e), $e(e, g), this.schedule(e);
		for (let e of this.#d) $e(e, _), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = Nt = [], r = [], i = Pt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw Wt(e), this.#h() || this.discard(), t;
		}
		if (Dt = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (Nt = null, Pt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Ut(e, t);
			i.length > 0 && Dt.#g();
			return;
		}
		let o = this.#v();
		if (o) {
			this.#b(r), this.#b(n), o.#y(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), Ot = this, Vt(r), Vt(n), Ot = null, this.#s?.resolve();
		var s = Dt;
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
				a ? r.f ^= h : i & 4 ? t.push(r) : ir(r) && (i & 16 && this.#d.add(r), lr(r));
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
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), $e(i, g), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), Dt = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) nt(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== j && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), kt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		Dt = this;
	}
	deactivate() {
		Dt = null, kt = null;
	}
	flush() {
		try {
			Mt = !0, Dt = this, this.#g();
		} finally {
			Ft = 0, At = null, Nt = null, Pt = null, Mt = !1, Dt = null, kt = null, Kt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(vt);
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
		this.#m || (this.#m = !0, Je(() => {
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
		if (Dt === null) {
			let t = Dt = new e();
			!Mt && !jt && Je(() => {
				t.#e || t.flush();
			});
		}
		return Dt;
	}
	apply() {
		kt = null;
	}
	schedule(e) {
		if (At = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (Nt !== null && t === Gn && (Hn === null || !(Hn.f & 2))) return;
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
			e === null || (e.#n = t), t === null ? Et = e : t.#t = e, this.linked = !1;
		}
	}
};
function Rt(e) {
	var t = jt;
	jt = !0;
	try {
		var n;
		for (e && (Dt !== null && !Dt.is_fork && Dt.flush(), n = e());;) {
			if (Ye(), Dt === null) return n;
			Dt.flush();
		}
	} finally {
		jt = t;
	}
}
function zt() {
	try {
		ge();
	} catch (e) {
		Ze(e, At);
	}
}
var Bt = null;
function Vt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && ir(r) && (Bt = /* @__PURE__ */ new Set(), lr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Mn(r), Bt?.size > 0)) {
				Kt.clear();
				for (let e of Bt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Bt.has(n) && (Bt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || lr(n);
					}
				}
				Bt.clear();
			}
		}
		Bt = null;
	}
}
function Ht(e) {
	Dt.schedule(e);
}
function Ut(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), $e(e, h);
		for (var n = e.first; n !== null;) Ut(n, t), n = n.next;
	}
}
function Wt(e) {
	$e(e, h);
	for (var t = e.first; t !== null;) Wt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Gt = /* @__PURE__ */ new Set(), Kt = /* @__PURE__ */ new Map(), qt = !1;
function Jt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Fe,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function F(e, t) {
	let n = Jt(e, t);
	return Jn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Yt(e, t = !1, n = !0) {
	let r = Jt(e);
	return t || (r.equals = Le), r;
}
function I(e, t, n = !1) {
	return Hn !== null && (!Un || Hn.f & 131072) && Ge() && Hn.f & 4325394 && (qn === null || !qn.has(e)) && ve(), Xt(e, n ? en(t) : t, Pt);
}
function Xt(e, t, n = null) {
	if (!e.equals(t)) {
		Kt.set(e, Bn ? t : e.v);
		var r = Lt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && St(t), kt === null && et(t);
		}
		e.wv = rr(), $t(e, g, n), Ge() && Gn !== null && Gn.f & 1024 && !(Gn.f & 96) && (Zn === null ? Qn([e]) : Zn.push(e)), !r.is_fork && Gt.size > 0 && !qt && Zt();
	}
	return t;
}
function Zt() {
	qt = !1;
	for (let e of Gt) {
		e.f & 1024 && $e(e, _);
		let t;
		try {
			t = ir(e);
		} catch {
			t = !0;
		}
		t && lr(e);
	}
	Gt.clear();
}
function Qt(e) {
	I(e, e.v + 1);
}
function $t(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Ge(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === Gn)) {
			var l = (c & g) === 0;
			if (l && $e(s, t), c & 131072) Gt.add(s);
			else if (c & 2) {
				var u = s;
				kt?.delete(u), c & 65536 || (c & 512 && (Gn === null || !(Gn.f & 2097152)) && (s.f |= E), $t(u, _, n));
			} else if (l) {
				var d = s;
				c & 16 && Bt !== null && Bt.add(d), n === null ? Ht(d) : n.push(d);
			}
		}
	}
}
function en(t) {
	if (typeof t != "object" || !t || ne in t) return t;
	let n = l(t);
	if (n !== s && n !== c) return t;
	var r = /* @__PURE__ */ new Map(), i = e(t), o = /* @__PURE__ */ F(0), u = null, d = tr, f = (e) => {
		if (tr === d) return e();
		var t = Hn, n = tr;
		Wn(null), nr(d);
		var r = e();
		return Wn(t), nr(n), r;
	};
	return i && r.set("length", /* @__PURE__ */ F(t.length, u)), new Proxy(t, {
		defineProperty(e, t, n) {
			(!("value" in n) || n.configurable === !1 || n.enumerable === !1 || n.writable === !1) && A();
			var i = r.get(t);
			return i === void 0 ? f(() => {
				var e = /* @__PURE__ */ F(n.value, u);
				return r.set(t, e), e;
			}) : I(i, n.value, !0), !0;
		},
		deleteProperty(e, t) {
			var n = r.get(t);
			if (n === void 0) {
				if (t in e) {
					let e = f(() => /* @__PURE__ */ F(j, u));
					r.set(t, e), Qt(o);
				}
			} else I(n, j), Qt(o);
			return !0;
		},
		get(e, n, i) {
			if (n === ne) return t;
			var o = r.get(n), s = n in e;
			if (o === void 0 && (!s || a(e, n)?.writable) && (o = f(() => /* @__PURE__ */ F(en(s ? e[n] : j), u)), r.set(n, o)), o !== void 0) {
				var c = V(o);
				return c === j ? void 0 : c;
			}
			return Reflect.get(e, n, i);
		},
		getOwnPropertyDescriptor(e, t) {
			var n = Reflect.getOwnPropertyDescriptor(e, t);
			if (n && "value" in n) {
				var i = r.get(t);
				i && (n.value = V(i));
			} else if (n === void 0) {
				var a = r.get(t), o = a?.v;
				if (a !== void 0 && o !== j) return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return n;
		},
		has(e, t) {
			if (t === ne) return !0;
			var n = r.get(t), i = n !== void 0 && n.v !== j || Reflect.has(e, t);
			return (n !== void 0 || Gn !== null && (!i || a(e, t)?.writable)) && (n === void 0 && (n = f(() => /* @__PURE__ */ F(i ? en(e[t]) : j, u)), r.set(t, n)), V(n) === j) ? !1 : i;
		},
		set(e, t, n, s) {
			var c = r.get(t), l = t in e;
			if (i && t === "length") for (var d = n; d < c.v; d += 1) {
				var p = r.get(d + "");
				p === void 0 ? d in e && (p = f(() => /* @__PURE__ */ F(j, u)), r.set(d + "", p)) : I(p, j);
			}
			if (c === void 0) (!l || a(e, t)?.writable) && (c = f(() => /* @__PURE__ */ F(void 0, u)), I(c, en(n)), r.set(t, c));
			else {
				l = c.v !== j;
				var m = f(() => en(n));
				I(c, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(s, n), !l) {
				if (i && typeof t == "string") {
					var g = r.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && I(g, _ + 1);
				}
				Qt(o);
			}
			return !0;
		},
		ownKeys(e) {
			V(o);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = r.get(e);
				return t === void 0 || t.v !== j;
			});
			for (var [n, i] of r) i.v !== j && !(n in e) && t.push(n);
			return t;
		},
		setPrototypeOf() {
			_e();
		}
	});
}
var tn, nn, rn, an;
function on() {
	if (tn === void 0) {
		tn = window, nn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		rn = a(t, "firstChild").get, an = a(t, "nextSibling").get, u(e) && (e[oe] = void 0, e[ae] = null, e[se] = void 0, e.__e = void 0), u(n) && (n[ce] = void 0);
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
function L(e, t) {
	if (!De) return /* @__PURE__ */ cn(e);
	var n = /* @__PURE__ */ cn(ke);
	if (n === null) n = ke.appendChild(sn());
	else if (t && n.nodeType !== 3) {
		var r = sn();
		return n?.before(r), Ae(r), r;
	}
	return t && pn(n), Ae(n), n;
}
function R(e, t = !1) {
	if (!De) {
		var n = /* @__PURE__ */ cn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ ln(n) : n;
	}
	if (t) {
		if (ke?.nodeType !== 3) {
			var r = sn();
			return ke?.before(r), Ae(r), r;
		}
		pn(ke);
	}
	return ke;
}
function z(e, t = 1, n = !1) {
	let r = De ? ke : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ ln(r);
	if (!De) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = sn();
			return r === null ? i?.after(a) : r.before(a), Ae(a), a;
		}
		pn(r);
	}
	return Ae(r), r;
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
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function mn(e) {
	Gn === null && (Hn === null && O(e), he()), Bn && me(e);
}
function hn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function gn(e, t) {
	var n = Gn;
	n !== null && n.f & 8192 && (e |= v);
	var r = {
		ctx: Ve,
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
	Dt?.register_created_effect(r);
	var i = r;
	if (e & 4) Nt === null ? Lt.ensure().schedule(r) : Nt.push(r);
	else if (t !== null) {
		try {
			lr(r);
		} catch (e) {
			throw An(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= S));
	}
	if (i !== null && (i.parent = n, n !== null && hn(i, n), Hn !== null && Hn.f & 2 && !(e & 64))) {
		var a = Hn;
		(a.effects ??= []).push(i);
	}
	return r;
}
function _n() {
	return Hn !== null && !Un;
}
function vn(e) {
	let t = gn(8, null);
	return $e(t, h), t.teardown = e, t;
}
function yn(e) {
	mn("$effect");
	var t = Gn.f;
	if (!Hn && t & 32 && Ve !== null && !Ve.i) {
		var n = Ve;
		(n.e ??= []).push(e);
	} else return bn(e);
}
function bn(e) {
	return gn(4 | w, e);
}
function xn(e) {
	Lt.ensure();
	let t = gn(64 | C, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Nn(t, () => {
			An(t), n(void 0);
		}) : (An(t), n(void 0));
	});
}
function Sn(e) {
	return gn(4, e);
}
function Cn(e) {
	return gn(ee | C, e);
}
function wn(e, t = 0) {
	return gn(8 | t, e);
}
function B(e, t = [], n = [], r = []) {
	pt(r, t, n, (t) => {
		gn(8, () => {
			e(...t.map(V));
		});
	});
}
function Tn(e, t = 0) {
	return gn(16 | t, e);
}
function En(e) {
	return gn(32 | C, e);
}
function Dn(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = Bn, n = Hn;
		Vn(!0), Wn(null);
		try {
			t.call(null);
		} finally {
			Vn(e), Wn(n);
		}
	}
}
function On(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && st(() => {
			e.abort(ue);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : An(n, t), n = r;
	}
}
function kn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || An(t), t = n;
	}
}
function An(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (jn(e.nodes.start, e.nodes.end), n = !0), e.f |= x, On(e, t && !n), cr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Dn(e), e.f ^= x, e.f |= y;
	var i = e.parent;
	i !== null && i.first !== null && Mn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function jn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ ln(e);
		e.remove(), e = n;
	}
}
function Mn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Nn(e, t, n = !0) {
	var r = [];
	Pn(e, r, !0);
	var i = () => {
		n && An(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Pn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= v;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Pn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Fn(e) {
	In(e, !0);
}
function In(e, t) {
	if (e.f & 8192) {
		e.f ^= v, e.f & 1024 || ($e(e, g), Lt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			In(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Ln(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ ln(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Rn = null, zn = !1, Bn = !1;
function Vn(e) {
	Bn = e;
}
var Hn = null, Un = !1;
function Wn(e) {
	Hn = e;
}
var Gn = null;
function Kn(e) {
	Gn = e;
}
var qn = null;
function Jn(e) {
	Hn !== null && (qn ??= /* @__PURE__ */ new Set()).add(e);
}
var Yn = null, Xn = 0, Zn = null;
function Qn(e) {
	Zn = e;
}
var $n = 1, er = 0, tr = er;
function nr(e) {
	tr = e;
}
function rr() {
	return ++$n;
}
function ir(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~E), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (ir(a) && Ct(a), a.wv > e.wv) return !0;
		}
		t & 512 && kt === null && $e(e, h);
	}
	return !1;
}
function ar(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(qn !== null && qn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? ar(a, t, !1) : t === a && (n ? $e(a, g) : a.f & 1024 && $e(a, _), Ht(a));
	}
}
function or(e) {
	var t = Yn, n = Xn, r = Zn, i = Hn, a = qn, o = Ve, s = Un, c = tr, l = e.f;
	Yn = null, Xn = 0, Zn = null, Hn = l & 96 ? null : e, qn = null, He(e.ctx), Un = !1, tr = ++er, e.ac !== null && (st(() => {
		e.ac.abort(ue);
	}), e.ac = null);
	try {
		e.f |= D;
		var u = e.fn, d = u();
		e.f |= b;
		var f = e.deps, p = Dt?.is_fork;
		if (Yn !== null) {
			var m;
			if (p || cr(e, Xn), f !== null && Xn > 0) for (f.length = Xn + Yn.length, m = 0; m < Yn.length; m++) f[Xn + m] = Yn[m];
			else e.deps = f = Yn;
			if (_n() && e.f & 512) for (m = Xn; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && Xn < f.length && (cr(e, Xn), f.length = Xn);
		if (Ge() && Zn !== null && !Un && f !== null && !(e.f & 6146)) for (m = 0; m < Zn.length; m++) ar(Zn[m], e);
		if (i !== null && i !== e) {
			if (er++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = er;
			if (t !== null) for (let e of t) e.rv = er;
			Zn !== null && (r === null ? r = Zn : r.push(...Zn));
		}
		return e.f & 8388608 && (e.f ^= te), d;
	} catch (e) {
		return Xe(e);
	} finally {
		e.f ^= D, Yn = t, Xn = n, Zn = r, Hn = i, qn = a, He(o), Un = s, tr = c;
	}
}
function sr(e, r) {
	let i = r.reactions;
	if (i !== null) {
		var a = t.call(i, e);
		if (a !== -1) {
			var o = i.length - 1;
			o === 0 ? i = r.reactions = null : (i[a] = i[o], i.pop());
		}
	}
	if (i === null && r.f & 2 && (Yn === null || !n.call(Yn, r))) {
		var s = r;
		s.f & 512 && (s.f ^= 512, s.f &= ~E), s.v !== j && et(s), s.ac !== null && st(() => {
			s.ac.abort(ue), s.ac = null, $e(s, g);
		}), wt(s), cr(s, 0);
	}
}
function cr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) sr(e, n[r]);
}
function lr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		$e(e, h);
		var n = Gn, r = zn;
		Gn = e, zn = !(t & 96);
		try {
			t & 16777232 ? kn(e) : On(e), Dn(e);
			var i = or(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = $n;
		} finally {
			zn = r, Gn = n;
		}
	}
}
async function ur() {
	await Promise.resolve(), Rt();
}
function V(e) {
	var t = !!(e.f & 2);
	if (Rn?.add(e), Hn !== null && !Un && !(Gn !== null && Gn.f & 16384) && (qn === null || !qn.has(e))) {
		var r = Hn.deps;
		if (Hn.f & 2097152) e.rv < er && (e.rv = er, Yn === null && r !== null && r[Xn] === e ? Xn++ : Yn === null ? Yn = [e] : Yn.push(e));
		else {
			Hn.deps ??= [], n.call(Hn.deps, e) || Hn.deps.push(e);
			var i = e.reactions;
			i === null ? e.reactions = [Hn] : n.call(i, Hn) || i.push(Hn);
		}
	}
	if (Bn && Kt.has(e)) return Kt.get(e);
	if (t) {
		var a = e;
		if (Bn) {
			var o = a.v;
			return (!(a.f & 1024) && a.reactions !== null || fr(a)) && (o = St(a)), Kt.set(a, o), o;
		}
		var s = !(a.f & 512) && !Un && Hn !== null && (zn || !!(Hn.f & 512)), c = (a.f & b) === 0;
		ir(a) && (s && (a.f |= 512), Ct(a)), s && !c && (Tt(a), dr(a));
	}
	if (kt?.has(e)) return kt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function dr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (Tt(t), dr(t));
}
function fr(e) {
	if (e.v === j) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Kt.has(t) || t.f & 2 && fr(t)) return !0;
	return !1;
}
function pr(e) {
	var t = Un;
	try {
		return Un = !0, e();
	} finally {
		Un = t;
	}
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var mr = ["touchstart", "touchmove"];
function hr(e) {
	return mr.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var gr = Symbol("events"), _r = /* @__PURE__ */ new Set(), vr = /* @__PURE__ */ new Set();
function yr(e) {
	if (!De) return;
	e.removeAttribute("onload"), e.removeAttribute("onerror");
	let t = e.__e;
	t !== void 0 && (e.__e = void 0, queueMicrotask(() => {
		e.isConnected && e.dispatchEvent(t);
	}));
}
function br(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || U.call(t, e), !e.cancelBubble) return st(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? Je(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function xr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = br(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && vn(() => {
		t.removeEventListener(e, o, a);
	});
}
function H(e, t, n) {
	(t[gr] ??= {})[e] = n;
}
function Sr(e) {
	for (var t = 0; t < e.length; t++) _r.add(e[t]);
	for (var n of vr) n(e);
}
var Cr = null;
function U(e) {
	var t = this, n = t.ownerDocument, r = e.type, a = e.composedPath?.() || [], o = a[0] || e.target;
	Cr = e;
	var s = 0, c = Cr === e && e[gr];
	if (c) {
		var l = a.indexOf(c);
		if (l !== -1 && (t === document || t === window)) {
			e[gr] = t;
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
		var d = Hn, f = Gn;
		Wn(null), Kn(null);
		try {
			for (var p, m = []; o !== null && o !== t;) {
				try {
					var h = o[gr]?.[r];
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
			e[gr] = t, delete e.currentTarget, Wn(d), Kn(f);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var wr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function Tr(e) {
	return wr?.createHTML(e) ?? e;
}
function Er(e) {
	var t = fn("template");
	return t.innerHTML = Tr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function Dr(e, t) {
	var n = Gn;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function W(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (De) return Dr(ke, null), ke;
		i === void 0 && (i = Er(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ cn(i)));
		var t = r || nn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ cn(t), s = t.lastChild;
			Dr(o, s);
		} else Dr(t, t);
		return t;
	};
}
function Or(e = "") {
	if (!De) {
		var t = sn(e + "");
		return Dr(t, t), t;
	}
	var n = ke;
	return n.nodeType === 3 ? pn(n) : (n.before(n = sn()), Ae(n)), Dr(n, n), n;
}
function kr() {
	if (De) return Dr(ke, null), ke;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = sn();
	return e.append(t, n), Dr(t, n), e;
}
function G(e, t) {
	if (De) {
		var n = Gn;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = ke), je();
		return;
	}
	e !== null && e.before(t);
}
function K(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[ce] ??= e.nodeValue) && (e[ce] = n, e.nodeValue = `${n}`);
}
function Ar(e, t) {
	return Mr(e, t);
}
var jr = /* @__PURE__ */ new Map();
function Mr(e, { target: t, anchor: n, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	on();
	var l = void 0, u = xn(() => {
		var s = n ?? t.appendChild(sn());
		dt(s, { pending: () => {} }, (t) => {
			Ue({});
			var n = Ve;
			if (o && (n.c = o), a && (i.$$events = a), De && Dr(t, null), l = e(t, i) || {}, De && (Gn.nodes.end = ke, ke === null || ke.nodeType !== 8 || ke.data !== "]")) throw Te(), be;
			We();
		}, c);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = hr(r);
					for (let e of [t, document]) {
						var a = jr.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), jr.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, U, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(r(_r)), vr.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = jr.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, U), r.delete(e), r.size === 0 && jr.delete(n)) : r.set(e, i);
			}
			vr.delete(d), s !== n && s.parentNode?.removeChild(s);
		};
	});
	return Nr.set(l, u), l;
}
var Nr = /* @__PURE__ */ new WeakMap(), Pr = class {
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
			if (n) Fn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Fn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (An(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Ln(r, t), t.append(sn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else An(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Nn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (An(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = Dt, r = dn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
			var i = document.createDocumentFragment(), a = sn();
			i.append(a), this.#n.set(e, {
				effect: En(() => t(a)),
				fragment: i
			});
		} else this.#t.set(e, En(() => t(this.anchor)));
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else De && (this.anchor = ke), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function q(e, t, n = !1) {
	var r;
	De && (r = ke, je());
	var i = new Pr(e), a = n ? S : 0;
	function o(e, t) {
		if (De) {
			var n = Pe(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Ne();
				Ae(a), i.anchor = a, Oe(!1), i.ensure(e, t), Oe(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	Tn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Fr(e, t) {
	return t;
}
function Ir(e, t, n) {
	for (var i = [], a = t.length, o, s = t.length, c = 0; c < a; c++) {
		let n = t[c];
		Nn(n, () => {
			if (o) {
				if (o.pending.delete(n), o.done.add(n), o.pending.size === 0) {
					var t = e.outrogroups;
					Lr(e, r(o.done)), t.delete(o), t.size === 0 && (e.outrogroups = null);
				}
			} else --s;
		}, !1);
	}
	if (s === 0) {
		var l = i.length === 0 && n !== null;
		if (l) {
			var u = n, d = u.parentNode;
			un(d), d.append(u), e.items.clear();
		}
		Lr(e, t, !l);
	} else o = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(o);
}
function Lr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= T, Ln(a, document.createDocumentFragment())) : An(t[i], n);
	}
}
var Rr;
function zr(t, n, i, a, o, s = null) {
	var c = t, l = /* @__PURE__ */ new Map();
	if (n & 4) {
		var u = t;
		c = De ? Ae(/* @__PURE__ */ cn(u)) : u.appendChild(sn());
	}
	De && je();
	var d = null, f = /* @__PURE__ */ bt(() => {
		var t = i();
		return e(t) ? t : t == null ? [] : r(t);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, Vr(v, p, c, n, a), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= T, Ur(d, null, c)) : Fn(d) : Nn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: Tn(() => {
			p = V(f);
			var e = p.length;
			let t = !1;
			De && Pe(c) === "[!" != (e === 0) && (c = Ne(), Ae(c), Oe(!1), t = !0);
			for (var r = /* @__PURE__ */ new Set(), u = Dt, v = dn(), y = 0; y < e; y += 1) {
				De && ke.nodeType === 8 && ke.data === "]" && (c = ke, t = !0, Oe(!1));
				var b = p[y], x = a(b, y), S = h ? null : l.get(x);
				S ? (S.v && Xt(S.v, b), S.i && Xt(S.i, y), v && u.unskip_effect(S.e)) : (S = Hr(l, h ? c : Rr ??= sn(), b, x, y, o, n, i), h || (S.e.f |= T), l.set(x, S)), r.add(x);
			}
			if (e === 0 && s && !d && (h ? d = En(() => s(c)) : (d = En(() => s(Rr ??= sn())), d.f |= T)), e > r.size && pe("", "", ""), De && e > 0 && Ae(Ne()), !h) if (m.set(u, r), v) {
				for (let [e, t] of l) r.has(e) || u.skip_effect(t.e);
				u.oncommit(g), u.ondiscard(_);
			} else g(u);
			t && Oe(!0), V(f);
		}),
		flags: n,
		items: l,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, De && (c = ke);
}
function Br(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Vr(e, t, n, i, a) {
	var o = !!(i & 8), s = t.length, c = e.items, l = Br(e.effect.first), u, d = null, f, p = [], m = [], h, g, _, v;
	if (o) for (v = 0; v < s; v += 1) h = t[v], g = a(h, v), _ = c.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < s; v += 1) {
		if (h = t[v], g = a(h, v), _ = c.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Fn(_), o && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= T, _ === l) Ur(_, null, n);
		else {
			var y = d ? d.next : l;
			_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Wr(e, d, _), Wr(e, _, y), Ur(_, y, n), d = _, p = [], m = [], l = Br(d.next);
			continue;
		}
		if (_ !== l) {
			if (u !== void 0 && u.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					d = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) Ur(p[x], b, n);
					for (x = 0; x < m.length; x += 1) u.delete(m[x]);
					Wr(e, S.prev, C.next), Wr(e, d, S), Wr(e, C, b), l = b, d = C, --v, p = [], m = [];
				} else u.delete(_), Ur(_, l, n), Wr(e, _.prev, _.next), Wr(e, _, d === null ? e.effect.first : d.next), Wr(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; l !== null && l !== _;) (u ??= /* @__PURE__ */ new Set()).add(l), m.push(l), l = Br(l.next);
			if (l === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, l = Br(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Lr(e, r(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (l !== null || u !== void 0) {
		var w = [];
		if (u !== void 0) for (_ of u) _.f & 8192 || w.push(_);
		for (; l !== null;) !(l.f & 8192) && l !== e.fallback && w.push(l), l = Br(l.next);
		var E = w.length;
		if (E > 0) {
			var D = i & 4 && s === 0 ? n : null;
			if (o) {
				for (v = 0; v < E; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < E; v += 1) w[v].nodes?.a?.fix();
			}
			Ir(e, w, D);
		}
	}
	o && Je(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function Hr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Jt(n) : /* @__PURE__ */ Yt(n, !1, !1) : null, l = o & 2 ? Jt(i) : null;
	return {
		v: c,
		i: l,
		e: En(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function Ur(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ ln(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Wr(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
function J(e, t, n = !1, r = !1, i = !1, a = !1) {
	var o = e, s = "";
	if (n) {
		var c = e;
		De && (o = Ae(/* @__PURE__ */ cn(c)));
	}
	B(() => {
		var e = Gn;
		if (s === (s = t() ?? "")) {
			De && je();
			return;
		}
		if (n && !De) {
			e.nodes = null, c.innerHTML = s, s !== "" && Dr(/* @__PURE__ */ cn(c), c.lastChild);
			return;
		}
		if (e.nodes !== null && (jn(e.nodes.start, e.nodes.end), e.nodes = null), s !== "") {
			if (De) {
				for (var a = ke.data, l = je(), u = l; l !== null && (l.nodeType !== 8 || l.data !== "");) u = l, l = /* @__PURE__ */ ln(l);
				if (l === null) throw Te(), be;
				Dr(ke, u), o = Ae(l);
				return;
			}
			var d = fn(r ? "svg" : i ? "math" : "template", r ? Se : i ? Ce : void 0);
			d.innerHTML = s;
			var f = r || i ? d : d.content;
			if (Dr(/* @__PURE__ */ cn(f), f.lastChild), r || i) for (; /* @__PURE__ */ cn(f);) o.before(/* @__PURE__ */ cn(f));
			else o.before(f);
		}
	});
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
var Gr = [..." 	\n\r\f\xA0\v﻿"];
function Kr(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Gr.includes(r[o - 1])) && (s === r.length || Gr.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function qr(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function Jr(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function Yr(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(Jr)), i && c.push(...Object.keys(i).map(Jr));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = Jr(e.substring(l, u).trim());
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
		return r && (n += qr(r)), i && (n += qr(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function Xr(e, t, n, r, i, a) {
	var o = e[oe];
	if (De || o !== n || o === void 0) {
		var s = Kr(n, r, a);
		(!De || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[oe] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function Zr(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function Qr(e, t, n, r) {
	var i = e[se];
	if (De || i !== t) {
		var a = Yr(t, r);
		(!De || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[se] = t;
	} else r && (Array.isArray(r) ? (Zr(e, n?.[0], r[0]), Zr(e, n?.[1], r[1], "important")) : Zr(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var $r = Symbol("is custom element"), ei = Symbol("is html"), ti = de ? "link" : "LINK", ni = de ? "progress" : "PROGRESS";
function Y(e) {
	if (De) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					Z(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					Z(e, "checked", null), e.checked = r;
				}
			}
		};
		e[le] = n, Je(n), ot();
	}
}
function X(e, t) {
	var n = ii(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === ni) && (e.value = t ?? "");
}
function ri(e, t) {
	var n = ii(e);
	n.checked !== (n.checked = t ?? void 0) && (e.checked = t);
}
function Z(e, t, n, r) {
	var i = ii(e);
	De && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === ti) || i[t] !== (i[t] = n) && (t === "loading" && (e[ie] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && oi(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function ii(e) {
	return e[ae] ??= {
		[$r]: e.nodeName.includes("-"),
		[ei]: e.namespaceURI === xe
	};
}
var ai = /* @__PURE__ */ new Map();
function oi(e) {
	var t = e.getAttribute("is") || e.nodeName, n = ai.get(t);
	if (n) return n;
	ai.set(t, n = []);
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var s in r = o(i), r) r[s].set && s !== "innerHTML" && s !== "textContent" && s !== "innerText" && n.push(s);
		i = l(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function si(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	ct(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = ci(e) ? li(a) : a, n(a), Dt !== null && r.add(Dt), await ur(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (De && e.defaultValue !== e.value || pr(t) == null && e.value) && (n(ci(e) ? li(e.value) : e.value), Dt !== null && r.add(Dt)), wn(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = Dt;
			if (r.has(i)) return;
		}
		ci(e) && n === li(e.value) || e.type === "date" && !n && !e.value || n !== e.value && (e.value = n ?? "");
	});
}
function ci(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function li(e) {
	return e === "" ? null : +e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function ui(e, t) {
	return e === t || e?.[ne] === t;
}
function di(e = {}, t, n, r) {
	var i = Ve.r, a = Gn;
	return Sn(() => {
		var o, s;
		return wn(() => {
			o = s, s = r?.() || [], pr(() => {
				ui(n(...s), e) || (t(e, ...s), o && ui(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && ui(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function fi(e, t, n, r) {
	var i = !0, o = !!(n & 8), s = !!(n & 16), c = r, l = !0, u = void 0, d = () => s && i ? (u ??= /* @__PURE__ */ _t(r), V(u)) : (l && (l = !1, c = s ? pr(r) : r), c);
	let f;
	if (o) {
		var p = ne in e || re in e;
		f = a(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	o ? [m, h] = N(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = d(), f && (i && k(t), f(m)));
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
	var v = !1, y = (n & 1 ? _t : bt)(() => (v = !1, g()));
	o && V(y);
	var b = Gn;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? V(y) : i && o ? en(e) : e;
			return I(y, n), v = !0, c !== void 0 && (c = n), e;
		}
		return Bn && v || b.f & 16384 ? y.v : V(y);
	});
}
var pi = {
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
}, mi = [
	"nb",
	"nn",
	"en-GB",
	"se",
	"tr"
], hi = /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/, gi = {
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
function _i(e) {
	let t = String(e ?? "").trim().toLowerCase();
	for (let [e, n] of Object.entries(gi)) if (n.some((e) => t === e || t.startsWith(`${e}-`))) return e;
	return null;
}
function vi(e) {
	return mi.includes(String(e ?? ""));
}
function yi(e) {
	let t = [];
	if (!Array.isArray(e)) return ["languages må være en liste"];
	for (let n of e) {
		if (!n || typeof n != "object" || Array.isArray(n)) {
			t.push("languages: hvert innslag må være et objekt");
			continue;
		}
		let e = String(n.code ?? "");
		hi.test(e) ? vi(e) && t.push(`languages: '${e}' er innebygd i Urd og kan ikke overstyres`) : t.push(`languages: '${e}' er ikke en gyldig språkkode`), (typeof n.name != "string" || !n.name.trim()) && t.push(`languages/${e}: name mangler (språkets eget navn)`);
		for (let r of ["site", "admin"]) n[r] !== void 0 && typeof n[r] != "boolean" && t.push(`languages/${e}: ${r} må være boolsk`);
		n.site !== !0 && n.admin !== !0 && t.push(`languages/${e}: må dekke site, admin eller begge`);
	}
	return t;
}
function bi(e) {
	let t = _i(e);
	if (t) return t;
	let n = String(e ?? "").trim();
	return hi.test(n) ? n : "nb";
}
async function xi(e, t) {
	try {
		return await (await import(
			/* @vite-ignore */
			"/assets/urd/language-packs.js"
)).loadPackStrings(e, t);
	} catch {
		return null;
	}
}
({ ...pi.strings });
var Si = {
	lang: "nb",
	dict: {}
};
function Ci(e, t) {
	if (!t) return e;
	let n = e;
	for (let [e, r] of Object.entries(t)) n = n.replaceAll(`{${e}}`, String(r));
	return n;
}
function Q(e, t) {
	return Ci(Si.dict[e] ?? e, t);
}
function wi(e) {
	let t = `api.${e?.code}`;
	return e?.code && Si.dict[t] !== void 0 ? Ci(Si.dict[t], e) : e?.error ?? null;
}
function Ti() {
	return Si.lang;
}
function Ei() {
	let e = null;
	try {
		e = localStorage.getItem("urd-admin-lang");
	} catch {}
	if (e) return bi(e);
	for (let e of navigator.languages ?? [navigator.language]) {
		let t = _i(e);
		if (t) return t;
	}
	return "en-GB";
}
var Di;
new Promise((e) => {
	Di = e;
});
async function Oi(e = Ei()) {
	let t = async (e) => (await import(
		/* @vite-ignore */
		`/assets/urd/locales/admin/${e}.js`
)).default.strings;
	Si.lang = bi(e);
	let n = vi(Si.lang);
	try {
		Object.assign(Si.dict, await t("nb")), n && Si.lang !== "nb" && Object.assign(Si.dict, await t(Si.lang));
	} catch {}
	if (!n) {
		let e = await xi(Si.lang, "admin");
		e ? Object.assign(Si.dict, e) : Si.lang = "nb";
	}
	return Di(Si.lang), Si.lang;
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region src/lib/draftStore.js
function ki(e, t, n) {
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
var Ai = /* @__PURE__ */ W("<button type=\"button\" class=\"cp-clear svelte-zxiloo\">×</button>"), ji = /* @__PURE__ */ W("<button type=\"button\" class=\"cp-eye svelte-zxiloo\"><svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 2l4 4-3 3-4-4 3-3z\"></path><path d=\"M15 5L4 16l-1 5 5-1L19 9\"></path></svg></button>"), Mi = /* @__PURE__ */ W("<input type=\"number\" min=\"0\" max=\"255\" class=\"svelte-zxiloo\"/>"), Ni = /* @__PURE__ */ W("<button type=\"button\"></button>"), Pi = /* @__PURE__ */ W("<span class=\"cp-label svelte-zxiloo\"> <!></span> <span class=\"cp-tokens svelte-zxiloo\"></span>", 1), Fi = /* @__PURE__ */ W("<span class=\"cp-saved svelte-zxiloo\"><button type=\"button\" class=\"cp-token svelte-zxiloo\"></button> <button type=\"button\" class=\"cp-del svelte-zxiloo\">×</button></span>"), Ii = /* @__PURE__ */ W("<span class=\"cp-tokens svelte-zxiloo\"></span>"), Li = /* @__PURE__ */ W("<button type=\"button\" class=\"cp-token svelte-zxiloo\"></button>"), Ri = /* @__PURE__ */ W("<span class=\"cp-label svelte-zxiloo\"> </span> <span class=\"cp-tokens svelte-zxiloo\"></span>", 1), zi = /* @__PURE__ */ W("<div class=\"cp-pop svelte-zxiloo\"><div class=\"cp-sv svelte-zxiloo\"><span class=\"cp-cursor svelte-zxiloo\"></span></div> <input class=\"cp-hue svelte-zxiloo\" type=\"range\" min=\"0\" max=\"360\" step=\"1\"/> <input class=\"cp-alpha svelte-zxiloo\" type=\"range\" min=\"0\" max=\"100\" step=\"1\"/> <span class=\"cp-row svelte-zxiloo\"><span class=\"cp-preview svelte-zxiloo\"></span> <input class=\"cp-hex svelte-zxiloo\" spellcheck=\"false\"/> <!></span> <span class=\"cp-row cp-rgb svelte-zxiloo\"></span> <!> <span class=\"cp-label cp-label-row svelte-zxiloo\"> <button type=\"button\" class=\"cp-add svelte-zxiloo\">+</button></span> <!> <!></div>"), Bi = /* @__PURE__ */ W("<span class=\"cp svelte-zxiloo\"><button type=\"button\"></button> <!> <!></span>");
function Vi(e, t) {
	Ue(t, !0);
	let n = fi(t, "value", 3, "#000000"), r = fi(t, "tokens", 19, () => []), i = fi(t, "label", 19, () => Q("cp.pickColor")), a = fi(t, "allowClear", 3, !1), o = "urd-recent-colors", s = "urd-saved-colors", c = () => {
		let e = r().find(([e]) => e === n());
		return e ? e[1] : n();
	}, l = () => r().find(([e]) => e === n())?.[0] ?? null, u = /* @__PURE__ */ F(en([])), d = /* @__PURE__ */ F(en([])), f = "", p = "", h = /* @__PURE__ */ F(null), g = /* @__PURE__ */ F(!1), _ = /* @__PURE__ */ F(en({
		top: 0,
		left: 0
	})), v = /* @__PURE__ */ F(0), y = /* @__PURE__ */ F(0), b = /* @__PURE__ */ F(1), x = /* @__PURE__ */ F(1), S = /* @__PURE__ */ F("#000000");
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
	function E(e, t, n) {
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
	function D() {
		return w(...E(V(v), V(y), V(b)));
	}
	function ee() {
		let e = D();
		return V(x) >= .995 ? e : e + Math.round(V(x) * 255).toString(16).padStart(2, "0");
	}
	function te() {
		I(S, ee(), !0), p = V(S), t.onchange?.(V(S));
	}
	function ne(e) {
		let t = C(e);
		return t ? (((e) => {
			var t = m(e, 3);
			I(v, t[0], !0), I(y, t[1], !0), I(b, t[2], !0);
		})(T(t[0], t[1], t[2])), I(x, t[3], !0), I(S, ee(), !0), !0) : !1;
	}
	function re() {
		ne(c()) || ne("#000000"), f = n(), p = "";
		try {
			let e = JSON.parse(localStorage.getItem(o) ?? "[]");
			I(u, Array.isArray(e) ? e : [], !0);
		} catch {
			I(u, [], !0);
		}
		try {
			let e = JSON.parse(localStorage.getItem(s) ?? "[]");
			I(d, Array.isArray(e) ? e : [], !0);
		} catch {
			I(d, [], !0);
		}
		let e = V(h).getBoundingClientRect(), t = V(h).closest(".panel-body")?.getBoundingClientRect(), r = t ? t.right : window.innerWidth, i = Math.max(8, Math.min(e.right - 236, r - 236 - 8)), a = e.bottom + 380 + 8 > window.innerHeight ? Math.max(8, e.top - 380 - 8) : e.bottom + 6;
		I(_, {
			top: a,
			left: i
		}, !0), I(g, !0);
	}
	function ie() {
		if (I(g, !1), p && p !== f) {
			let e = [p, ...V(u).filter((e) => e !== p)].slice(0, 8);
			localStorage.setItem(o, JSON.stringify(e));
		}
	}
	function ae(e, n) {
		ne(n), I(S, n, !0), t.onchange?.(e);
	}
	function oe(e) {
		let t = e.currentTarget;
		t.setPointerCapture(e.pointerId);
		let n = (e) => {
			let n = t.getBoundingClientRect();
			I(y, Math.min(1, Math.max(0, (e.clientX - n.left) / n.width)), !0), I(b, 1 - Math.min(1, Math.max(0, (e.clientY - n.top) / n.height))), te();
		};
		n(e);
		let r = (e) => n(e), i = () => {
			t.removeEventListener("pointermove", r), t.removeEventListener("pointerup", i);
		};
		t.addEventListener("pointermove", r), t.addEventListener("pointerup", i);
	}
	function se(e) {
		ne(e.target.value) ? te() : I(S, D(), !0);
	}
	function ce(e) {
		return (C(D()) ?? [
			0,
			0,
			0
		])[e];
	}
	function le(e, t) {
		let n = C(D()) ?? [
			0,
			0,
			0
		];
		n[e] = Math.min(255, Math.max(0, Number(t) || 0)), ((e) => {
			var t = m(e, 3);
			I(v, t[0], !0), I(y, t[1], !0), I(b, t[2], !0);
		})(T(...n)), te();
	}
	let ue = typeof window < "u" && "EyeDropper" in window;
	async function de() {
		try {
			ne((await new window.EyeDropper().open()).sRGBHex) && te();
		} catch {}
	}
	function fe(e) {
		ne(e) && te();
	}
	function pe() {
		let e = ee();
		V(d).includes(e) || (I(d, [e, ...V(d)].slice(0, 12), !0), localStorage.setItem(s, JSON.stringify(ze(V(d)))));
	}
	function me(e) {
		I(d, V(d).filter((t) => t !== e), !0), localStorage.setItem(s, JSON.stringify(ze(V(d))));
	}
	yn(() => {
		if (!V(g)) return;
		let e = (e) => {
			V(h) && !V(h).contains(e.target) && ie();
		}, t = (e) => {
			e.key === "Escape" && ie();
		}, n = () => ie();
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t, !0), window.addEventListener("blur", n), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t, !0), window.removeEventListener("blur", n);
		};
	});
	var he = Bi(), O = L(he);
	let ge;
	var k = z(O, 2), A = (e) => {
		var n = Ai();
		B((e, t) => {
			Z(n, "title", e), Z(n, "aria-label", t);
		}, [() => Q("cp.clearTitle"), () => Q("cp.clear")]), H("click", n, () => t.onchange?.("")), G(e, n);
	};
	q(k, (e) => {
		a() && n() && e(A);
	});
	var _e = z(k, 2), ve = (e) => {
		var t = zi(), i = L(t), a = L(i);
		M(i);
		var o = z(i, 2);
		Y(o);
		var s = z(o, 2);
		Y(s);
		var c = z(s, 2), f = L(c), p = z(f, 2);
		Y(p);
		var h = z(p, 2), g = (e) => {
			var t = ji();
			B((e) => Z(t, "title", e), [() => Q("cp.eyedropper")]), H("click", t, de), G(e, t);
		};
		q(h, (e) => {
			ue && e(g);
		}), M(c);
		var C = z(c, 2);
		zr(C, 22, () => [
			"R",
			"G",
			"B"
		], (e) => e, (e, t, n) => {
			var r = Mi();
			Y(r), B((e) => {
				Z(r, "title", t), X(r, e);
			}, [() => ce(V(n))]), H("change", r, (e) => le(V(n), e.target.value)), G(e, r);
		}), M(C);
		var w = z(C, 2), T = (e) => {
			var t = Pi(), i = R(t), a = L(i, !0), o = z(a), s = (e) => {
				var t = Or();
				B((e) => K(t, e), [() => Q("cp.linkedSuffix", { token: l() })]), G(e, t);
			}, c = /* @__PURE__ */ P(() => l());
			q(o, (e) => {
				V(c) && e(s);
			}), M(i);
			var u = z(i, 2);
			zr(u, 21, r, ([e, t]) => e, (e, t) => {
				var r = /* @__PURE__ */ P(() => m(V(t), 2));
				let i = () => V(r)[0], a = () => V(r)[1];
				var o = Ni();
				let s;
				B((e) => {
					s = Xr(o, 1, "cp-token svelte-zxiloo", null, s, { active: n() === i() }), Qr(o, `background: ${a() ?? ""}`), Z(o, "title", e);
				}, [() => Q("cp.tokenTitle", { name: i() })]), H("click", o, () => ae(i(), a())), G(e, o);
			}), M(u), B((e) => K(a, e), [() => Q("cp.themeColors")]), G(e, t);
		};
		q(w, (e) => {
			r().length && e(T);
		});
		var E = z(w, 2), ee = L(E), ne = z(ee);
		M(E);
		var re = z(E, 2), ie = (e) => {
			var t = Ii();
			zr(t, 20, () => V(d), (e) => e, (e, t) => {
				var n = Fi(), r = L(n), i = z(r, 2);
				M(n), B((e) => {
					Qr(r, `background: ${t ?? ""}`), Z(r, "title", t), Z(i, "title", e);
				}, [() => Q("cp.removeSaved")]), H("click", r, () => fe(t)), H("click", i, () => me(t)), G(e, n);
			}), M(t), G(e, t);
		};
		q(re, (e) => {
			V(d).length && e(ie);
		});
		var he = z(re, 2), O = (e) => {
			var t = Ri(), n = R(t), r = L(n, !0);
			M(n);
			var i = z(n, 2);
			zr(i, 20, () => V(u), (e) => e, (e, t) => {
				var n = Li();
				B(() => {
					Qr(n, `background: ${t ?? ""}`), Z(n, "title", t);
				}), H("click", n, () => fe(t)), G(e, n);
			}), M(i), B((e) => K(r, e), [() => Q("common.recent")]), G(e, t);
		};
		q(he, (e) => {
			V(u).length && e(O);
		}), M(t), B((e, n, r, c, l) => {
			Qr(t, `top: ${V(_).top ?? ""}px; left: ${V(_).left ?? ""}px`), Qr(i, `background-image: linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent); background-color: hsl(${V(v) ?? ""}, 100%, 50%)`), Qr(a, `left: ${V(y) * 100}%; top: ${(1 - V(b)) * 100}%`), X(o, V(v)), X(s, e), Z(s, "title", n), Qr(s, `background: linear-gradient(to right, transparent, ${r ?? ""}), repeating-conic-gradient(rgb(255 255 255 / 35%) 0 25%, rgb(0 0 0 / 35%) 0 50%) 0 0 / 10px 10px`), Qr(f, `background: ${V(S) ?? ""}`), X(p, V(S)), K(ee, `${c ?? ""} `), Z(ne, "title", l);
		}, [
			() => Math.round(V(x) * 100),
			() => Q("cp.alpha"),
			() => D(),
			() => Q("cp.saved"),
			() => Q("cp.saveTitle")
		]), H("click", t, (e) => e.preventDefault()), H("pointerdown", i, oe), H("input", o, (e) => {
			I(v, Number(e.target.value), !0), te();
		}), H("input", s, (e) => {
			I(x, Number(e.target.value) / 100), te();
		}), H("change", p, se), H("click", ne, pe), G(e, t);
	};
	q(_e, (e) => {
		V(g) && e(ve);
	}), M(he), di(he, (e) => I(h, e), () => V(h)), B((e, t, n) => {
		ge = Xr(O, 1, "cp-swatch svelte-zxiloo", null, ge, e), Qr(O, `background: ${t ?? ""}`), Z(O, "title", n), Z(O, "aria-label", i());
	}, [
		() => ({
			linked: l(),
			"cp-empty": a() && !n()
		}),
		() => n() ? c() : "transparent",
		() => l() ? Q("cp.linkedTitle", {
			label: i(),
			token: l()
		}) : i()
	]), H("click", O, () => V(g) ? ie() : re()), G(e, he), We();
}
Sr([
	"click",
	"pointerdown",
	"input",
	"change"
]);
//#endregion
//#region ../template/assets/engine/0.6.10/imageTools.js
var Hi = 1600, Ui = .82, Wi = .6;
async function Gi(e, t = Hi) {
	if (qi(e)) return Ji(await e.text());
	let n = await createImageBitmap(e), r = Math.min(1, t / Math.max(n.width, n.height)), i = Math.round(n.width * r), a = Math.round(n.height * r), o = document.createElement("canvas");
	o.width = i, o.height = a, o.getContext("2d").drawImage(n, 0, 0, i, a), n.close();
	let s = (e) => new Promise((t) => o.toBlob(t, "image/webp", e)), c = await s(Ui);
	return c.size > 4e5 && (c = await s(Wi)), {
		dataUrl: await new Promise((e) => {
			let t = new FileReader();
			t.onload = () => e(t.result), t.readAsDataURL(c);
		}),
		bytes: c.size,
		width: i,
		height: a
	};
}
var Ki = "image/svg+xml";
function qi(e) {
	return e.type === Ki || /\.svg$/i.test(e.name || "");
}
function Ji(e) {
	let t = String(e ?? "");
	if (!/<svg[\s>]/i.test(t)) throw Error("Ugyldig SVG");
	if (/<\s*script[\s>]/i.test(t) || /<\s*foreignObject[\s>]/i.test(t) || /\son[a-z]+\s*=/i.test(t) || /javascript:/i.test(t)) throw Error("SVG-en inneholder skript eller hendelser og kan ikke brukes");
	let n = new Blob([t]).size, r = `data:${Ki};base64,${btoa(unescape(encodeURIComponent(t)))}`, i = t.match(/<svg\b[^>]*>/i)?.[0] ?? "", a = i.match(/viewBox\s*=\s*["']\s*([-\d.]+(?:[\s,]+[-\d.]+){3})\s*["']/i)?.[1]?.split(/[\s,]+/).map(Number);
	return {
		dataUrl: r,
		bytes: n,
		width: a?.length === 4 ? a[2] : Number.parseFloat(i.match(/\bwidth\s*=\s*["']?([\d.]+)/i)?.[1]) || 0,
		height: a?.length === 4 ? a[3] : Number.parseFloat(i.match(/\bheight\s*=\s*["']?([\d.]+)/i)?.[1]) || 0
	};
}
function Yi(e, t, n = .04) {
	let r = String(e ?? "");
	if (!t || !(t.width > 0) || !(t.height > 0)) return r;
	let i = r.match(/<svg\b[^>]*>/i)?.[0];
	if (!i) return r;
	let a = (e) => Math.round(e * 1e3) / 1e3, o = Math.max(t.width, t.height) * Math.max(0, n), s = a(t.x - o), c = a(t.y - o), l = a(t.width + 2 * o), u = a(t.height + 2 * o), d = i.replace(/\sviewBox\s*=\s*["'][^"']*["']/i, "").replace(/\swidth\s*=\s*["'][^"']*["']/i, "").replace(/\sheight\s*=\s*["'][^"']*["']/i, "").replace(/<svg\b/i, `<svg viewBox="${s} ${c} ${l} ${u}" width="${l}" height="${u}"`);
	return r.replace(i, d);
}
function Xi(e) {
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
function Zi(e) {
	return /^data:image\/svg\+xml[;,]/.test(e || "") ? "svg" : "webp";
}
function Qi(e) {
	return e.replace(/\.[^.]+$/, "").toLowerCase().replaceAll("æ", "ae").replaceAll("ø", "o").replaceAll("å", "a").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "bilde";
}
function $i(e) {
	let t = 5381;
	for (let n = 0; n < e.length; n++) t = (t << 5) + t + e.charCodeAt(n) >>> 0;
	return t.toString(16).padStart(8, "0");
}
//#endregion
//#region ../template/assets/engine/0.6.10/glyphs.js
var ea = "urd-recent-glyphs", ta = [
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
function na(e, t) {
	return [t, ...(Array.isArray(e) ? e : []).filter((e) => e !== t)].slice(0, 16);
}
function ra() {
	try {
		let e = JSON.parse(localStorage.getItem("urd-recent-glyphs") ?? "[]");
		return Array.isArray(e) ? e : [];
	} catch {
		return [];
	}
}
function ia(e) {
	let t = na(ra(), e);
	try {
		localStorage.setItem(ea, JSON.stringify(t));
	} catch {}
	return t;
}
//#endregion
//#region ../template/assets/engine/0.6.10/icons.js
var aa = "fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"", oa = "fill=\"currentColor\" stroke=\"none\"", sa = {
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
}, ca = [
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
function la(e) {
	let t = typeof e == "string" ? sa[e] : null;
	return t ? `<svg viewBox="0 0 24 24" width="100%" height="100%" ${t.fill ? oa : aa} aria-hidden="true" focusable="false">${t.body}</svg>` : null;
}
//#endregion
//#region src/lib/GlyphPicker.svelte
var ua = /* @__PURE__ */ W("<img class=\"gp-own svelte-15ln1c3\"/>"), da = /* @__PURE__ */ W("<span class=\"gp-svg svelte-15ln1c3\"></span>"), fa = /* @__PURE__ */ W("<button type=\"button\" class=\"gp-cell svelte-15ln1c3\"> </button>"), pa = /* @__PURE__ */ W("<div class=\"gp-group svelte-15ln1c3\"> </div> <div class=\"gp-grid svelte-15ln1c3\"></div>", 1), ma = /* @__PURE__ */ W("<button type=\"button\"><span class=\"gp-svg svelte-15ln1c3\"></span></button>"), ha = /* @__PURE__ */ W("<button type=\"button\"> </button>"), ga = /* @__PURE__ */ W("<div class=\"gp-group svelte-15ln1c3\"> </div> <button type=\"button\" class=\"ghost gp-upload svelte-15ln1c3\"> </button> <input type=\"file\" accept=\"image/*\" hidden=\"\"/> <p class=\"gp-hint svelte-15ln1c3\"> </p>", 1), _a = /* @__PURE__ */ W("<div class=\"gp-pop svelte-15ln1c3\"><!> <!> <!> <!></div>"), va = /* @__PURE__ */ W("<span class=\"gp svelte-15ln1c3\"><button type=\"button\" class=\"gp-swatch svelte-15ln1c3\"><!></button> <!></span>");
function ya(e, t) {
	Ue(t, !0);
	let n = fi(t, "value", 3, "★"), r = fi(t, "icon", 3, null), i = fi(t, "image", 3, null), a = fi(t, "label", 19, () => Q("gp.pickGlyph")), o = /* @__PURE__ */ F(en([])), s = /* @__PURE__ */ F(null), c = /* @__PURE__ */ F(null), l = /* @__PURE__ */ F(!1), u = /* @__PURE__ */ F(en({
		top: 0,
		left: 0
	}));
	function d() {
		I(o, ra(), !0);
		let e = V(s).getBoundingClientRect(), t = Math.max(8, Math.min(e.right - 292, window.innerWidth - 292 - 8)), n = e.bottom + 380 + 8 > window.innerHeight ? Math.max(8, e.top - 380 - 8) : e.bottom + 6;
		I(u, {
			top: n,
			left: t
		}, !0), I(l, !0);
	}
	function f(e) {
		ia(e), t.onpick?.(e), I(l, !1);
	}
	function p(e) {
		t.onicon?.(e), I(l, !1);
	}
	async function h(e) {
		let n = e.target.files?.[0];
		if (e.target.value = "", !n) return;
		let r = await Gi(n, 256);
		t.onimage?.(r.dataUrl), I(l, !1);
	}
	yn(() => {
		if (!V(l)) return;
		let e = (e) => {
			V(s) && !V(s).contains(e.target) && I(l, !1);
		}, t = (e) => {
			e.key === "Escape" && I(l, !1);
		}, n = (e) => {
			V(s) && e.target instanceof Node && !V(s).contains(e.target) && I(l, !1);
		};
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t, !0), document.addEventListener("scroll", n, !0), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t, !0), document.removeEventListener("scroll", n, !0);
		};
	});
	var g = va(), _ = L(g), v = L(_), y = (e) => {
		var t = ua();
		B((e) => {
			Z(t, "src", i()), Z(t, "alt", e);
		}, [() => Q("gp.ownIcon")]), G(e, t);
	}, b = (e) => {
		var t = da();
		J(t, () => la(r()), !0), M(t), G(e, t);
	}, x = (e) => {
		var t = Or();
		B(() => K(t, n() || "★")), G(e, t);
	};
	q(v, (e) => {
		i() ? e(y) : r() && sa[r()] ? e(b, 1) : e(x, -1);
	}), M(_);
	var S = z(_, 2), C = (e) => {
		var i = _a(), a = L(i), s = (e) => {
			var t = pa(), n = R(t), r = L(n, !0);
			M(n);
			var i = z(n, 2);
			zr(i, 20, () => V(o), (e) => e, (e, t) => {
				var n = fa(), r = L(n, !0);
				M(n), B(() => K(r, t)), H("click", n, () => f(t)), G(e, n);
			}), M(i), B((e) => K(r, e), [() => Q("common.recent")]), G(e, t);
		};
		q(a, (e) => {
			V(o).length && e(s);
		});
		var l = z(a, 2), d = (e) => {
			var t = kr();
			zr(R(t), 17, () => ca, ([e, t]) => e, (e, t) => {
				var n = /* @__PURE__ */ P(() => m(V(t), 2));
				let i = () => V(n)[0], a = () => V(n)[1];
				var o = pa(), s = R(o), c = L(s, !0);
				M(s);
				var l = z(s, 2);
				zr(l, 20, a, (e) => e, (e, t) => {
					var n = ma();
					let i;
					var a = L(n);
					J(a, () => la(t), !0), M(a), M(n), B(() => {
						i = Xr(n, 1, "gp-cell gp-cell-icon svelte-15ln1c3", null, i, { active: t === r() }), Z(n, "title", sa[t].label);
					}), H("click", n, () => p(t)), G(e, n);
				}), M(l), B((e) => K(c, e), [() => Q(i())]), G(e, o);
			}), G(e, t);
		};
		q(l, (e) => {
			t.onicon && e(d);
		});
		var g = z(l, 2);
		zr(g, 17, () => ta, ([e, t]) => e, (e, t) => {
			var r = /* @__PURE__ */ P(() => m(V(t), 2));
			let i = () => V(r)[0], a = () => V(r)[1];
			var o = pa(), s = R(o), c = L(s, !0);
			M(s);
			var l = z(s, 2);
			zr(l, 20, () => a().split(" "), (e) => e, (e, t) => {
				var r = ha();
				let i;
				var a = L(r, !0);
				M(r), B(() => {
					i = Xr(r, 1, "gp-cell svelte-15ln1c3", null, i, { active: t === n() }), K(a, t);
				}), H("click", r, () => f(t)), G(e, r);
			}), M(l), B((e) => K(c, e), [() => Q(i())]), G(e, o);
		});
		var _ = z(g, 2), v = (e) => {
			var t = ga(), n = R(t), r = L(n, !0);
			M(n);
			var i = z(n, 2), a = L(i, !0);
			M(i);
			var o = z(i, 2);
			di(o, (e) => I(c, e), () => V(c));
			var s = z(o, 2), l = L(s, !0);
			M(s), B((e, t, n) => {
				K(r, e), K(a, t), K(l, n);
			}, [
				() => Q("gp.ownIcon"),
				() => Q("gp.upload"),
				() => Q("gp.uploadHint")
			]), H("click", i, () => V(c).click()), H("change", o, h), G(e, t);
		};
		q(_, (e) => {
			t.onimage && e(v);
		}), M(i), B(() => Qr(i, `top: ${V(u).top ?? ""}px; left: ${V(u).left ?? ""}px`)), G(e, i);
	};
	q(S, (e) => {
		V(l) && e(C);
	}), M(g), di(g, (e) => I(s, e), () => V(s)), B(() => {
		Z(_, "title", a()), Z(_, "aria-label", a());
	}), H("click", _, () => V(l) ? I(l, !1) : d()), G(e, g), We();
}
Sr(["click", "change"]);
//#endregion
//#region src/lib/previewBridge.js
function ba(e, t = {}) {
	let n = (e) => {
		if (e.origin !== location.origin) return;
		let n = e.data;
		n?.type === "urd-edit" && t.onEdit?.(n), n?.type === "urd-move" && t.onMove?.(n), n?.type === "urd-grow" && t.onGrow?.(n), n?.type === "urd-delete" && t.onDelete?.(n), n?.type === "urd-add-section" && t.onAddSection?.(n), n?.type === "urd-move-section" && t.onMoveSection?.(n), n?.type === "urd-delete-section" && t.onDeleteSection?.(n), n?.type === "urd-section-size" && t.onSectionSize?.(n), n?.type === "urd-undo" && t.onUndo?.(n), n?.type === "urd-select-section" && t.onSelectSection?.(n), n?.type === "urd-select-block" && t.onSelectBlock?.(n), n?.type === "urd-block-menu" && t.onBlockMenu?.(n), n?.type === "urd-plugin-blocks" && t.onPluginBlocks?.(n), n?.type === "urd-ready" && t.onReady?.(n), n?.type === "urd-navigate" && t.onNavigate?.(n), n?.type === "urd-add-block" && t.onAddBlock?.(n), n?.type === "urd-add-blocks" && t.onAddBlocks?.(n), n?.type === "urd-request-block" && t.onRequestBlock?.(n), n?.type === "urd-move-block-section" && t.onMoveBlockSection?.(n), n?.type === "urd-mobile-manual" && t.onMobileManual?.(n), n?.type === "urd-mobile-auto" && t.onMobileAuto?.(n), n?.type === "urd-review-done" && t.onReviewDone?.(n), n?.type === "urd-block-flag" && t.onBlockFlag?.(n), n?.type === "urd-collection-edit" && t.onCollectionEdit?.(n), n?.type === "urd-nav-width" && t.onNavWidth?.(n);
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
function xa(e, t) {
	return !(e > 0) || !(t > 0) ? 1 : e / t;
}
function Sa(e, t, n) {
	let r = n === "full" ? 1 : Math.min(1, xa(e, t));
	return Math.max(.1, r);
}
//#endregion
//#region src/lib/Dropdown.svelte
var Ca = /* @__PURE__ */ W("<button type=\"button\"> </button>"), wa = /* @__PURE__ */ W("<div class=\"dd-pop svelte-vtocc6\"></div>"), Ta = /* @__PURE__ */ W("<span class=\"dd svelte-vtocc6\"><button type=\"button\" class=\"dd-btn svelte-vtocc6\"><span class=\"dd-value svelte-vtocc6\"> </span> <span class=\"dd-caret svelte-vtocc6\"> </span></button> <!></span>");
function $(e, t) {
	Ue(t, !0);
	let n = fi(t, "value", 3, null), r = fi(t, "options", 19, () => []), i = fi(t, "title", 3, null), a = fi(t, "disabled", 3, !1), o = /* @__PURE__ */ F(!1), s = /* @__PURE__ */ F(null), c = /* @__PURE__ */ F(en({
		top: 0,
		left: 0,
		width: 160
	})), l = () => r().find(([e]) => `${e ?? ""}` == `${n() ?? ""}`)?.[1] ?? "";
	function u() {
		let e = V(s).getBoundingClientRect(), t = Math.min(320, r().length * 32 + 12), n = Math.max(e.width, 160), i = e.bottom + t + 8 <= window.innerHeight;
		I(c, {
			top: i ? e.bottom + 4 : Math.max(8, e.top - t - 4),
			left: Math.max(8, Math.min(e.left, window.innerWidth - n - 8)),
			width: n
		}, !0);
	}
	function d() {
		if (!a()) {
			if (V(o)) {
				I(o, !1);
				return;
			}
			u(), I(o, !0);
		}
	}
	function f(e) {
		I(o, !1), t.onchange?.(e);
	}
	yn(() => {
		if (!V(o)) return;
		let e = (e) => {
			V(s) && !V(s).contains(e.target) && I(o, !1);
		}, t = (e) => {
			e.key === "Escape" && I(o, !1);
		}, n = (e) => {
			V(s) && e.target instanceof Node && !V(s).contains(e.target) && u();
		};
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t, !0), document.addEventListener("scroll", n, !0), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t, !0), document.removeEventListener("scroll", n, !0);
		};
	});
	var p = Ta(), h = L(p), g = L(h), _ = L(g, !0);
	M(g);
	var v = z(g, 2), y = L(v, !0);
	M(v), M(h);
	var b = z(h, 2), x = (e) => {
		var t = wa();
		zr(t, 21, r, ([e, t]) => `${e ?? ""}`, (e, t) => {
			var r = /* @__PURE__ */ P(() => m(V(t), 2));
			let i = () => V(r)[0], a = () => V(r)[1];
			var o = Ca();
			let s;
			var c = L(o, !0);
			M(o), B(() => {
				s = Xr(o, 1, "dd-opt svelte-vtocc6", null, s, { valgt: `${i() ?? ""}` == `${n() ?? ""}` }), K(c, a());
			}), H("click", o, () => f(i())), G(e, o);
		}), M(t), B(() => Qr(t, `top: ${V(c).top ?? ""}px; left: ${V(c).left ?? ""}px; min-width: ${V(c).width ?? ""}px`)), G(e, t);
	};
	q(b, (e) => {
		V(o) && e(x);
	}), M(p), di(p, (e) => I(s, e), () => V(s)), B((e) => {
		Z(h, "title", i()), h.disabled = a(), K(_, e), K(y, V(o) ? "▴" : "▾");
	}, [() => l()]), H("click", h, d), G(e, p), We();
}
Sr(["click"]);
//#endregion
//#region src/lib/IconEditor.svelte
var Ea = /* @__PURE__ */ W("<div class=\"ie-overlay svelte-e7sog7\" role=\"dialog\" aria-modal=\"true\"><div class=\"ie-card svelte-e7sog7\"><h2 class=\"svelte-e7sog7\"> </h2> <div class=\"ie-stage svelte-e7sog7\"><canvas class=\"ie-canvas svelte-e7sog7\"></canvas> <p class=\"ie-hint svelte-e7sog7\"> </p></div> <label class=\"ie-row svelte-e7sog7\"> <span class=\"ie-val svelte-e7sog7\"> </span></label> <input type=\"range\" min=\"1\" max=\"3\" step=\"0.02\" class=\"svelte-e7sog7\"/> <label class=\"ie-row svelte-e7sog7\"> <span class=\"ie-val svelte-e7sog7\"> </span></label> <input type=\"range\" min=\"0.3\" max=\"2\" step=\"0.02\" class=\"svelte-e7sog7\"/> <label class=\"ie-row svelte-e7sog7\"> <span class=\"ie-val svelte-e7sog7\"> </span></label> <input type=\"range\" min=\"0.3\" max=\"2\" step=\"0.02\" class=\"svelte-e7sog7\"/> <label class=\"ie-row svelte-e7sog7\"> <span class=\"ie-val svelte-e7sog7\"> </span></label> <input type=\"range\" min=\"0\" max=\"2\" step=\"0.02\" class=\"svelte-e7sog7\"/> <span class=\"ie-tools svelte-e7sog7\"><button type=\"button\" class=\"ghost svelte-e7sog7\"> </button> <button type=\"button\" class=\"ghost svelte-e7sog7\"> </button></span> <span class=\"ie-actions svelte-e7sog7\"><button type=\"button\" class=\"ghost svelte-e7sog7\"> </button> <button type=\"button\" class=\"primary svelte-e7sog7\"> </button></span></div></div>");
function Da(e, t) {
	Ue(t, !0);
	let n = fi(t, "image", 3, ""), r = /* @__PURE__ */ F(null), i = /* @__PURE__ */ F(null), a = /* @__PURE__ */ F(1), o = /* @__PURE__ */ F(.5), s = /* @__PURE__ */ F(.5), c = /* @__PURE__ */ F(1), l = /* @__PURE__ */ F(1), u = /* @__PURE__ */ F(1);
	yn(() => {
		if (!n()) return;
		let e = new Image();
		e.onload = () => {
			I(i, e, !0);
		}, e.src = n();
	});
	function d(e, t) {
		if (e.clearRect(0, 0, t, t), !V(i)) return;
		e.filter = `brightness(${V(c)}) contrast(${V(l)}) saturate(${V(u)})`;
		let n = Math.max(t / V(i).width, t / V(i).height) * V(a), r = V(i).width * n, d = V(i).height * n, f = t / 2 - V(o) * r, p = t / 2 - V(s) * d;
		f = Math.min(0, Math.max(t - r, f)), p = Math.min(0, Math.max(t - d, p)), e.drawImage(V(i), f, p, r, d), e.filter = "none";
	}
	yn(() => {
		V(i), V(a), V(o), V(s), V(c), V(l), V(u), V(r) && d(V(r).getContext("2d"), 220);
	});
	function f(e) {
		if (!V(i)) return;
		e.preventDefault();
		let t = e.clientX, n = e.clientY, r = Math.max(220 / V(i).width, 220 / V(i).height) * V(a), c = V(i).width * r, l = V(i).height * r, u = (e) => {
			I(o, Math.min(1, Math.max(0, V(o) - (e.clientX - t) / c)), !0), I(s, Math.min(1, Math.max(0, V(s) - (e.clientY - n) / l)), !0), t = e.clientX, n = e.clientY;
		}, d = () => {
			window.removeEventListener("pointermove", u), window.removeEventListener("pointerup", d);
		};
		window.addEventListener("pointermove", u), window.addEventListener("pointerup", d);
	}
	function p() {
		I(a, 1), I(o, .5), I(s, .5), I(c, 1), I(l, 1), I(u, 1);
	}
	function m() {
		let e = document.createElement("canvas");
		e.width = 128, e.height = 128, d(e.getContext("2d"), 128), t.onapply?.(e.toDataURL("image/webp", .92));
	}
	var h = Ea(), g = L(h), _ = L(g), v = L(_, !0);
	M(_);
	var y = z(_, 2), b = L(y);
	Z(b, "width", 220), Z(b, "height", 220), di(b, (e) => I(r, e), () => V(r));
	var x = z(b, 2), S = L(x, !0);
	M(x), M(y);
	var C = z(y, 2), w = L(C), T = z(w), E = L(T);
	M(T), M(C);
	var D = z(C, 2);
	Y(D);
	var ee = z(D, 2), te = L(ee), ne = z(te), re = L(ne);
	M(ne), M(ee);
	var ie = z(ee, 2);
	Y(ie);
	var ae = z(ie, 2), oe = L(ae), se = z(oe), ce = L(se);
	M(se), M(ae);
	var le = z(ae, 2);
	Y(le);
	var ue = z(le, 2), de = L(ue), fe = z(de), pe = L(fe);
	M(fe), M(ue);
	var me = z(ue, 2);
	Y(me);
	var he = z(me, 2), O = L(he), ge = L(O, !0);
	M(O);
	var k = z(O, 2), A = L(k, !0);
	M(k), M(he);
	var _e = z(he, 2), ve = L(_e), ye = L(ve, !0);
	M(ve);
	var be = z(ve, 2), j = L(be, !0);
	M(be), M(_e), M(g), M(h), B((e, t, n, r, i, a, o, s, c, l, u, d, f, p, m) => {
		K(v, e), Z(b, "title", t), K(S, n), K(w, `${r ?? ""} `), K(E, `${i ?? ""}x`), K(te, `${a ?? ""} `), K(re, `${o ?? ""}%`), K(oe, `${s ?? ""} `), K(ce, `${c ?? ""}%`), K(de, `${l ?? ""} `), K(pe, `${u ?? ""}%`), K(ge, d), K(A, f), K(ye, p), K(j, m);
	}, [
		() => Q("ie.title"),
		() => Q("ie.dragTip"),
		() => Q("ie.hint"),
		() => Q("lbl.zoom"),
		() => V(a).toFixed(2),
		() => Q("lbl.brightness"),
		() => Math.round(V(c) * 100),
		() => Q("lbl.contrast"),
		() => Math.round(V(l) * 100),
		() => Q("lbl.saturate"),
		() => Math.round(V(u) * 100),
		() => Q("ie.grayscale"),
		() => Q("common.reset"),
		() => Q("confirm.cancel"),
		() => Q("common.apply")
	]), H("pointerdown", b, f), si(D, () => V(a), (e) => I(a, e)), si(ie, () => V(c), (e) => I(c, e)), si(le, () => V(l), (e) => I(l, e)), si(me, () => V(u), (e) => I(u, e)), H("click", O, () => I(u, 0)), H("click", k, p), H("click", ve, () => t.oncancel?.()), H("click", be, m), G(e, h), We();
}
Sr(["pointerdown", "click"]);
var Oa = {}, ka = {};
function Aa(e) {
	let t = structuredClone(e), n = t.schemaVersion ?? 1;
	for (; n < 1;) {
		let r = ka[n];
		if (typeof r != "function") return e;
		t = r(t) ?? t, n++, t.schemaVersion = n;
	}
	return t;
}
function ja(e, t) {
	let n = structuredClone(e), r = n.schemaVersion ?? 1;
	for (; r < 1;) {
		let i = Oa[r];
		if (typeof i != "function") return e;
		n = i(n, t) ?? n, r++, n.schemaVersion = r;
	}
	return n;
}
//#endregion
//#region ../template/assets/engine/0.6.10/plugins.js
function Ma(e) {
	let t = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(e).trim());
	return t ? [
		Number(t[1]),
		Number(t[2]),
		Number(t[3])
	] : null;
}
var Na = (e, t) => e[0] - t[0] || e[1] - t[1] || e[2] - t[2];
function Pa(e, t) {
	let n = Ma(e);
	if (!n || typeof t != "string" || !t.trim()) return !1;
	for (let e of t.trim().split(/\s+/)) {
		let t = /^(>=|<=|>|<|=|\^|~)?(\d+\.\d+\.\d+)$/.exec(e);
		if (!t) return !1;
		let r = t[1] ?? "=", i = Ma(t[2]), a = Na(n, i);
		if (!(r === ">=" ? a >= 0 : r === ">" ? a > 0 : r === "<=" ? a <= 0 : r === "<" ? a < 0 : r === "^" ? i[0] === 0 ? n[0] === 0 && n[1] === i[1] && a >= 0 : n[0] === i[0] && a >= 0 : r === "~" ? n[0] === i[0] && n[1] === i[1] && a >= 0 : a === 0)) return !1;
	}
	return !0;
}
var Fa = /^[a-z0-9][a-z0-9-]*$/;
function Ia(e) {
	let t = [];
	if (!e || typeof e != "object") return ["manifestet er ikke et objekt"];
	Fa.test(e.id ?? "") || t.push("id mangler eller er ugyldig"), (typeof e.name != "string" || !e.name) && t.push("name mangler"), Ma(e.version ?? "") || t.push("version er ikke semver"), (typeof e.requiresEngine != "string" || !e.requiresEngine) && t.push("requiresEngine mangler");
	let n = Array.isArray(e.languages) && e.languages.length > 0;
	return (e.entry !== void 0 || !n) && (typeof e.entry != "string" || !e.entry.endsWith(".js")) && t.push("entry mangler eller er ikke en .js-fil"), (e.provides !== void 0 || !n) && (!e.provides || typeof e.provides != "object") && t.push("provides mangler"), e.languages !== void 0 && t.push(...yi(e.languages)), e.locales !== void 0 && typeof e.locales != "boolean" && t.push("locales må være boolsk"), e.names !== void 0 && (typeof e.names != "object" || e.names === null || Array.isArray(e.names) || Object.values(e.names).some((e) => typeof e != "string" || !e)) && t.push("names må være et objekt med språkkode til navn"), t;
}
//#endregion
//#region ../template/assets/engine/0.6.10/sections/presets.js
function La(e) {
	return typeof crypto < "u" && crypto.randomUUID ? `${e}-${crypto.randomUUID().slice(0, 8)}` : `${e}-${[...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(4))].map((e) => e.toString(16).padStart(2, "0")).join("")}`;
}
//#endregion
//#region ../template/assets/engine/0.6.10/theme.js
function Ra(e, t) {
	let n = e.tokens || {}, r = e.scheme === "dark" ? "dark" : "light";
	if (!e.alt?.tokens || t === r) return n;
	let i = {};
	for (let t of /* @__PURE__ */ new Set([...Object.keys(n), ...Object.keys(e.alt.tokens)])) i[t] = {
		...n[t],
		...e.alt.tokens[t]
	};
	return i;
}
var za = /^[a-zA-Z0-9#%.,()'"\s+\-*/]+$/;
function Ba(e) {
	return typeof e == "string" && za.test(e) && !/url\(|\/\*|\*\/|expression/i.test(e);
}
function Va(e) {
	let t = e.tokens || {}, n = Ra(e, "light"), r = Ra(e, "dark"), i = e.scheme === "dark" ? "dark" : "light", a = [], o = [], s = [], c = /* @__PURE__ */ new Set([
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
			Ba(c) && (a.push(`  --urd-${e}-${l}: ${c};`), i && a.push(`  --urd-base-${l}: ${c};`)), u !== d && (i && Ba(u) && Ba(d) ? o.push({
				name: l,
				lv: u,
				dv: d
			}) : !i && Ba(u) && Ba(d) && s.push({
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
function Ha(e) {
	return /^[a-z][a-z0-9-]*$/.test(e) ? `var(--urd-color-${e})` : e;
}
var Ua = {
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
	}
}, Wa = {
	flate: "sectionTheme.flate",
	aksent: "sectionTheme.aksent",
	invers: "sectionTheme.invers"
};
[...new Set(Object.values(Ua).flatMap(Object.keys))];
function Ga(e) {
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
function Ka(e, t) {
	let n = Ga(e), r = Ga(t);
	return n == null || r == null ? null : (Math.max(n, r) + .05) / (Math.min(n, r) + .05);
}
//#endregion
//#region ../template/assets/engine/0.6.10/backgrounds/color.js
var qa = {
	version: 1,
	label: "Farge",
	labelKey: "bgLayer.color",
	defaults: () => ({
		value: "bg",
		opacity: 1
	}),
	migrations: {},
	render(e, t) {
		e.style.background = Ha(t.value), e.style.opacity = String(t.opacity ?? 1);
	}
}, Ja = {
	linear: [
		"pan",
		"pan-loop",
		"rotate"
	],
	radial: ["pulse", "orbit"]
};
function Ya(e) {
	let t = Array.isArray(e) && e.length ? e : [{ color: "#0b0e14" }, { color: "#1a1030" }], n = t.map((e) => Math.max(0, Number(e?.share) || 0)), r = n.reduce((e, t) => e + t, 0), i = r <= 0, a = i ? t.length : r, o = 0;
	return t.map((e, t) => {
		let r = i ? 1 : n[t], s = (o + r / 2) / a * 100;
		return o += r, {
			color: e?.color ?? "#0b0e14",
			at: Math.round(s * 100) / 100
		};
	});
}
function Xa(e) {
	let t = (e) => Math.round(e * 100) / 100, n = e[0]?.at ?? 0;
	return [...e.map((e) => ({
		color: e.color,
		at: t(e.at - n)
	})), {
		color: e[0]?.color ?? "#0b0e14",
		at: 100
	}];
}
function Za(e, t, n, r = .5) {
	let i = n % 360 * Math.PI / 180, a = (e) => Math.round(e * 100) / 100 || 0, o = (Math.abs(e * Math.sin(i)) + Math.abs(t * Math.cos(i))) / (1 - Math.min(Math.max(r, 0), .9));
	return {
		period: a(o),
		dx: a(Math.sin(i) * o),
		dy: a(-Math.cos(i) * o)
	};
}
function Qa(e, t, n) {
	return `repeating-linear-gradient(${t}deg, ${e.map((e) => `${Ha(e.color)} ${Math.round(e.at / 100 * n * 100) / 100}px`).join(", ")})`;
}
function $a(e) {
	let t = e.kind === "radial" ? "radial" : "linear", n = (Ja[t] ?? []).includes(e.animation) ? e.animation : null, r = Ya(e.stops), i = r.map((e) => `${Ha(e.color)} ${e.at}%`).join(", "), a = {}, o;
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
					stops: Xa(r),
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
var eo = /* @__PURE__ */ new Set(), to = !1;
function no(e) {
	eo.add(e), !(to || typeof window > "u") && (to = !0, window.addEventListener("resize", () => {
		for (let e of [...eo]) e() || eo.delete(e);
	}));
}
var ro = !1;
function io() {
	if (!ro) {
		ro = !0;
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
var ao = {
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
		let n = $a(t);
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
					let e = Za(r, i, n.loop.angle, n.loop.maxShare);
					t.style.inset = `${-Math.ceil(e.period)}px`, t.style.background = Qa(n.loop.stops, n.loop.angle, e.period), t.style.setProperty("--urd-loop-dx", `${e.dx}px`), t.style.setProperty("--urd-loop-dy", `${e.dy}px`);
				}
				return !0;
			};
			requestAnimationFrame(r), no(r);
			return;
		}
		if (n.runner) {
			e.classList.add("urd-bg-loop-host");
			let t = document.createElement("div");
			t.className = n.runner.className, t.style.background = n.runner.background, n.runner.left != null && (t.style.left = n.runner.left), n.runner.top != null && (t.style.top = n.runner.top), e.appendChild(t);
			return;
		}
		e.style.background = n.background, n.className && (e.classList.add(n.className), n.className === "urd-bg-rotate" && io());
	}
}, oo = {
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
		let n = Ha(t.color);
		e.style.background = `radial-gradient(circle at ${t.x * 100}% ${t.y * 100}%, ${n} 0%, transparent ${t.radius * 100}%)`, e.style.opacity = String(t.opacity ?? .35);
	}
}, so = "url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22128%22%20height%3D%22128%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.9%22%20numOctaves%3D%222%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22128%22%20height%3D%22128%22%20filter%3D%22url(%23n)%22%2F%3E%3C%2Fsvg%3E\")", co = {
	version: 1,
	label: "Korn",
	labelKey: "bgLayer.grain",
	defaults: () => ({ opacity: .06 }),
	migrations: {},
	render(e, t) {
		e.style.backgroundImage = so, e.style.backgroundRepeat = "repeat", e.style.opacity = String(t.opacity ?? .06);
	}
}, lo = .4;
function uo(e, t) {
	return `${(e ?? .5) * 100}% ${(t ?? .5) * 100}%`;
}
function fo(e, t) {
	return e === "contain" ? "contain" : e === "cover" ? "cover" : `${Math.max(0, t ?? 1) * 100}%`;
}
function po(e) {
	let t = "-9999px";
	return e === "up" ? `inset(${t} 0 0 0)` : e === "down" ? `inset(0 0 ${t} 0)` : e === "both" ? `inset(${t} 0 ${t} 0)` : "inset(0)";
}
function mo(e, t, n, r = .18) {
	let i = Math.max(0, Math.min(1, n)) * lo * t;
	return Math.round(Math.min(i, r * e));
}
function ho(e, t, n, r, i) {
	let a = e + t / 2, o = (n / 2 - a) * Math.max(0, Math.min(1, r)) * lo, s = i ?? mo(t, n, r);
	return Math.max(-s, Math.min(s, o)) || 0;
}
var go = /* @__PURE__ */ new Set(), _o = !1, vo = 0;
function yo() {
	vo = 0;
	for (let e of [...go]) e() || go.delete(e);
}
function bo() {
	vo ||= requestAnimationFrame(yo);
}
function xo(e) {
	go.add(e), e(), !(_o || typeof window > "u") && (_o = !0, window.addEventListener("scroll", bo, { passive: !0 }), window.addEventListener("resize", bo, { passive: !0 }));
}
function So(e, t, n, r) {
	let i = r === "cover" || r === "flislegg" || r === "repeat", a = e.closest(".urd-section") ?? e.parentElement?.closest(".urd-section") ?? e.parentElement, o = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
	e.style.willChange = "transform";
	let s = (t) => {
		e.style.top = `-${t}px`, e.style.bottom = `-${t}px`;
	}, c = () => {
		if (!e.isConnected) return !1;
		if (o || document.body.classList.contains("urd-mobile")) return s(n), e.style.transform = "", !0;
		let r = (a ?? e).getBoundingClientRect(), c = window.innerHeight || document.documentElement.clientHeight, l = mo(r.height, c, t, i ? .18 : .6);
		s(i ? Math.max(n, l) : n);
		let u = ho(r.top, r.height, c, t, l);
		return e.style.transform = `translateY(${u.toFixed(1)}px)`, !0;
	};
	xo(c), typeof requestAnimationFrame == "function" && requestAnimationFrame(() => requestAnimationFrame(c));
}
function Co() {
	return typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("animation-timeline", "view()");
}
var wo = /* @__PURE__ */ new Set(), To = !1, Eo = 0;
function Do() {
	Eo = 0;
	for (let e of [...wo]) e() || wo.delete(e);
}
function Oo() {
	!Eo && typeof requestAnimationFrame == "function" && (Eo = requestAnimationFrame(Do));
}
function ko(e) {
	wo.add(e), e(), !(To || typeof window > "u") && (To = !0, window.addEventListener("resize", Oo, { passive: !0 }));
}
function Ao(e, t, n, r) {
	let i = r === "cover" || r === "flislegg" || r === "repeat", a = e.closest(".urd-section") ?? e.parentElement?.closest(".urd-section") ?? e.parentElement;
	e.style.willChange = "transform", e.classList.add("urd-parallax-css");
	let o = () => {
		if (!e.isConnected) return !1;
		let r = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || document.body.classList.contains("urd-mobile"), o = (a ?? e).getBoundingClientRect(), s = window.innerHeight || document.documentElement.clientHeight, c = mo(o.height, s, t, i ? .18 : .6), l = i && !r ? Math.max(n, c) : n;
		return e.style.setProperty("--urd-px-shift", `${c}px`), e.style.top = `-${l}px`, e.style.bottom = `-${l}px`, !0;
	};
	ko(o), typeof requestAnimationFrame == "function" && requestAnimationFrame(() => requestAnimationFrame(o));
}
var jo = {
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
		e.style.opacity = String(t.opacity ?? 1), e.style.clipPath = po(t.bleed), e.style.zIndex = t.bleed === "down" || t.bleed === "both" ? "1" : "";
		let n = document.createElement("div");
		n.className = "urd-bg-image", n.style.position = "absolute", n.style.left = "0", n.style.right = "0", n.style.top = "0", n.style.bottom = "0";
		let r = t.fit === "flislegg" || t.fit === "repeat";
		n.style.backgroundImage = `url("${t.src}")`, n.style.backgroundSize = fo(t.fit, t.size), n.style.backgroundRepeat = r ? "repeat" : "no-repeat", n.style.backgroundPosition = uo(t.x, t.y);
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
			Co() ? Ao(n, t.parallax, i, e) : So(n, t.parallax, i, e);
		}
	}
};
//#endregion
//#region ../template/assets/engine/0.6.10/galleri-model.js
function Mo(e, t, n) {
	return !Number.isFinite(n) || n < 1 ? 0 : (((Number.isFinite(e) ? e : 0) + t) % n + n) % n;
}
function No({ count: e = 0, reducedMotion: t = !1 } = {}) {
	return e >= 2 && !t;
}
function Po(e, { min: t = 2, fallback: n = 5 } = {}) {
	let r = Number(e);
	return !Number.isFinite(r) || r <= 0 ? n : Math.max(t, r);
}
//#endregion
//#region ../template/assets/engine/0.6.10/backgrounds/bildegalleri.js
var Fo = {
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
			e.style.backgroundImage = `url("${n.src}")`, e.style.backgroundSize = fo(t.fit), e.style.backgroundRepeat = "no-repeat", e.style.backgroundPosition = uo(n.x, n.y);
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
		if (!No({
			count: n.length,
			reducedMotion: s
		})) return;
		let c = document.createElement("div");
		c.className = "urd-bg-slide", e.appendChild(c);
		let l = 0, u = o, d = Math.max(Po(t.interval, { fallback: 6 }), r + .5) * 1e3, f = setInterval(() => {
			if (!e.isConnected) {
				clearInterval(f);
				return;
			}
			if (document.hidden) return;
			let t = Mo(l, 1, n.length), r = new Image();
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
//#region ../template/assets/engine/0.6.10/footer-thumb.js
function Io(e = {}) {
	let t = "#2fd6b6", n = "#5c6b64", r = e.mega ? "#16221d" : "#0e1512", i = e.cols ?? 0, a = e.social ?? 0, o = `<svg viewBox="0 0 160 80" preserveAspectRatio="none" aria-hidden="true"><rect width="160" height="80" fill="${r}"/>`;
	if (e.mega && (o += `<circle cx="20" cy="6" r="34" fill="${t}" opacity="0.18"/>`), e.bigcta) return o += `<rect x="45" y="18" width="70" height="8" rx="3" fill="${n}" opacity="0.85"/>`, o += `<rect x="56" y="32" width="48" height="4" rx="2" fill="${n}" opacity="0.5"/>`, o += `<rect x="62" y="43" width="36" height="10" rx="3" fill="${t}"/>`, o += Lo(n, e.baselineLinks), o + "</svg>";
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
	return o += Lo(n, e.baselineLinks), o + "</svg>";
}
function Lo(e, t = 0) {
	let n = `<line x1="8" y1="66" x2="152" y2="66" stroke="${e}" stroke-width="0.6" opacity="0.5"/>`;
	return n += `<rect x="8" y="70" width="40" height="3" rx="1.5" fill="${e}" opacity="0.6"/>`, t && (n += `<g fill="${e}" opacity="0.6">` + Array.from({ length: t }, (e, t) => `<rect x="${120 - t * 16}" y="70" width="12" height="3" rx="1.5"/>`).join("") + "</g>"), n;
}
//#endregion
//#region ../template/assets/engine/0.6.10/animations/core.js
var Ro = () => ({
	duration: 600,
	delay: 0
}), zo = {
	"fade-in": {
		version: 1,
		label: "Ton inn",
		labelKey: "anim.fadeIn",
		entrance: !0,
		defaults: Ro,
		migrations: {}
	},
	"slide-up": {
		version: 1,
		label: "Gli opp",
		labelKey: "anim.slideUp",
		entrance: !0,
		defaults: Ro,
		migrations: {}
	},
	"zoom-in": {
		version: 1,
		label: "Zoom inn",
		labelKey: "anim.zoomIn",
		entrance: !0,
		defaults: Ro,
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
			step: 90,
			effect: "slide-up",
			pattern: "sequence"
		}),
		migrations: {}
	}
}, Bo = [
	["font.system", "system-ui, sans-serif"],
	["font.arial", "Arial, Helvetica, sans-serif"],
	["font.verdana", "Verdana, Geneva, sans-serif"],
	["font.trebuchet", "'Trebuchet MS', sans-serif"],
	["font.georgia", "Georgia, 'Times New Roman', serif"],
	["font.palatino", "'Palatino Linotype', Palatino, serif"],
	["font.courier", "'Courier New', monospace"]
];
//#endregion
//#region ../template/assets/engine/0.6.10/place.js
function Vo(e) {
	let t = (e) => Math.round(e * 100) / 100, n = Math.max(0, t(100 - e.w)), r = Math.min(n, Math.max(0, t(e.x - e.w / 2))), i = Math.max(0, e.y - e.h / 2), a = e.snap === !1 || e.grid?.snap === !1, o = e.grid?.size || 8;
	return i = a ? Math.round(i) : Math.round(i / o) * o, {
		x: r,
		y: Math.max(0, i)
	};
}
//#endregion
//#region src/App.svelte
var Ho = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), Uo = /* @__PURE__ */ W("<button class=\"ghost row-tool svelte-1n46o8q\"></button>"), Wo = /* @__PURE__ */ W("<span><span class=\"grad-grip svelte-1n46o8q\"><svg viewBox=\"0 0 16 16\" width=\"14\" height=\"14\" fill=\"currentColor\" aria-hidden=\"true\"><circle cx=\"5\" cy=\"3\" r=\"1.4\"></circle><circle cx=\"11\" cy=\"3\" r=\"1.4\"></circle><circle cx=\"5\" cy=\"8\" r=\"1.4\"></circle><circle cx=\"11\" cy=\"8\" r=\"1.4\"></circle><circle cx=\"5\" cy=\"13\" r=\"1.4\"></circle><circle cx=\"11\" cy=\"13\" r=\"1.4\"></circle></svg></span> <!> <input type=\"range\" class=\"tb-grow svelte-1n46o8q\" min=\"0\" max=\"100\" step=\"1\"/> <span class=\"gridmenu-value svelte-1n46o8q\"> </span> <!></span>"), Go = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), Ko = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"360\" step=\"5\" class=\"svelte-1n46o8q\"/>", 1), qo = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <!></label> <!> <button class=\"ghost action svelte-1n46o8q\"> </button> <!> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <!></label>", 1), Jo = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.1\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), Yo = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.01\" max=\"0.3\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), Xo = /* @__PURE__ */ W("<div class=\"sizefill svelte-1n46o8q\"><button type=\"button\" class=\"ghost svelte-1n46o8q\"> </button> <button type=\"button\" class=\"ghost svelte-1n46o8q\"> </button></div> <label class=\"svelte-1n46o8q\"> </label> <div class=\"focalpad svelte-1n46o8q\"><span class=\"focaldot svelte-1n46o8q\"></span></div> <label class=\"sub svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"-0.5\" max=\"1.5\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"sub svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"-0.5\" max=\"1.5\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), Zo = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.1\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <!></label>", 1), Qo = /* @__PURE__ */ W("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> </label> <div class=\"sizestep svelte-1n46o8q\"><button type=\"button\" class=\"svelte-1n46o8q\">−</button> <input type=\"number\" min=\"10\" max=\"400\" class=\"svelte-1n46o8q\"/> <span class=\"sizeunit svelte-1n46o8q\">%</span> <button type=\"button\" class=\"svelte-1n46o8q\">+</button></div> <!> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"20\" step=\"1\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!>", 1), $o = /* @__PURE__ */ W("<span class=\"toolbar-row svelte-1n46o8q\"><img class=\"site-icon-preview svelte-1n46o8q\" alt=\"\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), es = /* @__PURE__ */ W("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" multiple=\"\" class=\"svelte-1n46o8q\"/></label> <!> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"2\" max=\"120\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"5\" step=\"0.1\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"20\" step=\"1\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.05\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <p class=\"panel-hint svelte-1n46o8q\"> </p>", 1), ts = /* @__PURE__ */ W("<div class=\"bg-layer svelte-1n46o8q\"><span class=\"nav-line svelte-1n46o8q\"><!> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span> <!></div>"), ns = /* @__PURE__ */ W("<p class=\"panel-hint svelte-1n46o8q\"> </p> <!> <label class=\"svelte-1n46o8q\"> <!></label> <button class=\"ghost action svelte-1n46o8q\"> </button>", 1), rs = /* @__PURE__ */ W("<input class=\"nav-target svelte-1n46o8q\"/>"), is = /* @__PURE__ */ W("<div class=\"nav-row nav-sub-row svelte-1n46o8q\"><input class=\"svelte-1n46o8q\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span> <span class=\"nav-target svelte-1n46o8q\"><!></span> <!></div>"), as = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <!></label>"), os = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <span class=\"num-stepper svelte-1n46o8q\"><button type=\"button\" class=\"svelte-1n46o8q\">−</button> <input type=\"number\" min=\"1\" max=\"12\" step=\"1\" class=\"svelte-1n46o8q\"/> <button type=\"button\" class=\"svelte-1n46o8q\">+</button></span></label>", 1), ss = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label>", 1), cs = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!>", 1), ls = /* @__PURE__ */ W("<span class=\"nav-line svelte-1n46o8q\"><input class=\"svelte-1n46o8q\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span>"), us = /* @__PURE__ */ W("<label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <p class=\"panel-strong svelte-1n46o8q\"> </p> <!> <button class=\"ghost action svelte-1n46o8q\"> </button> <p class=\"panel-strong svelte-1n46o8q\"> </p> <!>", 1), ds = /* @__PURE__ */ W("<input class=\"svelte-1n46o8q\"/>"), fs = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"svelte-1n46o8q\"> <!></label>", 1), ps = /* @__PURE__ */ W("<label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label>"), ms = /* @__PURE__ */ W("<label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <!> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"1\" max=\"3\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.2\" max=\"2\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.2\" max=\"2\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"2\" step=\"0.01\" class=\"svelte-1n46o8q\"/> <button class=\"ghost action svelte-1n46o8q\"> </button>", 1), hs = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> </label> <input class=\"svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <p class=\"panel-hint svelte-1n46o8q\"> </p>", 1), gs = /* @__PURE__ */ W("<input class=\"token-input svelte-1n46o8q\" maxlength=\"4\"/>"), _s = /* @__PURE__ */ W("<button class=\"ghost svelte-1n46o8q\"> </button>"), vs = /* @__PURE__ */ W("<span class=\"toolbar-row svelte-1n46o8q\"><img class=\"site-icon-preview svelte-1n46o8q\"/> <button class=\"ghost svelte-1n46o8q\"> </button></span> <p class=\"panel-hint svelte-1n46o8q\"> </p>", 1), ys = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <span class=\"toolbar-row svelte-1n46o8q\"><!> <!></span></label> <!> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"8\" max=\"400\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <p class=\"panel-hint svelte-1n46o8q\"> </p>", 1), bs = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" max=\"100\" class=\"svelte-1n46o8q\"/></label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <p class=\"panel-hint svelte-1n46o8q\"> </p>", 1), xs = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"1\" max=\"6\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"32\" step=\"2\" class=\"svelte-1n46o8q\"/>", 1), Ss = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"2\" max=\"60\" class=\"svelte-1n46o8q\"/></label>"), Cs = /* @__PURE__ */ W("<div class=\"bg-layer svelte-1n46o8q\"><span class=\"toolbar-row svelte-1n46o8q\"><img class=\"site-icon-preview svelte-1n46o8q\" alt=\"\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label></div>"), ws = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <!></label> <!> <!> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" multiple=\"\" class=\"svelte-1n46o8q\"/></label> <!> <p class=\"panel-hint svelte-1n46o8q\"> </p>", 1), Ts = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"1\" max=\"40\" class=\"svelte-1n46o8q\"/></label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label>", 1), Es = /* @__PURE__ */ W("<button class=\"ghost svelte-1n46o8q\"> </button> <p class=\"panel-hint svelte-1n46o8q\"> </p>", 1), Ds = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"100\" max=\"4000\" step=\"100\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" max=\"4000\" step=\"100\" class=\"svelte-1n46o8q\"/></label>", 1), Os = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" max=\"400\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label>", 1), ks = /* @__PURE__ */ W("<hr class=\"gridmenu-divider svelte-1n46o8q\"/> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!>", 1), As = /* @__PURE__ */ W("<div class=\"frame-grid svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <input type=\"number\" step=\"0.5\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" step=\"1\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" step=\"0.5\" min=\"1\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" step=\"1\" min=\"1\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" step=\"1\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input type=\"number\" step=\"1\" class=\"svelte-1n46o8q\"/></label></div>"), js = /* @__PURE__ */ W("<!> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"svelte-1n46o8q\"> <!></label> <!> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <details class=\"group frame-group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><p class=\"panel-hint svelte-1n46o8q\"> </p> <!> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label></div></details>", 1), Ms = /* @__PURE__ */ W("<button class=\"chrome-restore svelte-1n46o8q\"><!> </button>"), Ns = /* @__PURE__ */ W("<button class=\"ghost svelte-1n46o8q\"> </button> <span class=\"viewswitch svelte-1n46o8q\"><button></button> <button></button></span> <span class=\"zoomswitch svelte-1n46o8q\"><button></button> <button class=\"ghost svelte-1n46o8q\"></button> <span class=\"zoom-readout svelte-1n46o8q\"> </span> <button class=\"ghost svelte-1n46o8q\"></button></span> <button></button>", 1), Ps = /* @__PURE__ */ W("<button class=\"badge attention svelte-1n46o8q\"><!> </button>"), Fs = /* @__PURE__ */ W("<span class=\"badge svelte-1n46o8q\"> </span> <button> </button>", 1), Is = /* @__PURE__ */ W("<!> ", 1), Ls = /* @__PURE__ */ W("<span class=\"who svelte-1n46o8q\"><!> </span>"), Rs = /* @__PURE__ */ W("<a class=\"ghost svelte-1n46o8q\" href=\"/api/github/login\"> </a>"), zs = /* @__PURE__ */ W("<button class=\"ghost svelte-1n46o8q\"><!></button> <!> <a class=\"ghost svelte-1n46o8q\" target=\"_blank\" rel=\"noopener\"> </a> <button class=\"primary svelte-1n46o8q\"> </button>", 1), Bs = /* @__PURE__ */ W("<hr class=\"rail-sep svelte-1n46o8q\"/>"), Vs = /* @__PURE__ */ W("<button> </button>"), Hs = /* @__PURE__ */ W("<!> <!>", 1), Us = /* @__PURE__ */ W("<div class=\"settings-pop svelte-1n46o8q\"><p class=\"panel-strong svelte-1n46o8q\"> </p> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label></div>"), Ws = /* @__PURE__ */ W("<span class=\"page-path svelte-1n46o8q\">/</span>"), Gs = /* @__PURE__ */ W("<input class=\"page-slug svelte-1n46o8q\"/>"), Ks = /* @__PURE__ */ W("<div><input class=\"page-title svelte-1n46o8q\"/> <!> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <!></span></div>"), qs = /* @__PURE__ */ W("<div class=\"panel-body svelte-1n46o8q\"><p class=\"panel-hint svelte-1n46o8q\"> </p> <!> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <input class=\"svelte-1n46o8q\"/> <button class=\"ghost action svelte-1n46o8q\"> </button> <p class=\"panel-hint svelte-1n46o8q\"> </p></div>"), Js = /* @__PURE__ */ W("<input class=\"svelte-1n46o8q\"/> <span class=\"toolbar-row svelte-1n46o8q\"><!> <input type=\"number\" class=\"tb-num svelte-1n46o8q\" min=\"8\" max=\"96\" placeholder=\"px\"/> <button><b> </b></button> <button><i> </i></button></span>", 1), Ys = /* @__PURE__ */ W("<span class=\"toolbar-row svelte-1n46o8q\"><label class=\"ghost filepick tb-grow svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <input type=\"number\" class=\"tb-num svelte-1n46o8q\" min=\"12\" max=\"128\"/> <input type=\"number\" class=\"tb-num svelte-1n46o8q\" min=\"0\" max=\"64\"/></span> <p class=\"panel-hint svelte-1n46o8q\"> </p>", 1), Xs = /* @__PURE__ */ W("<label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label>", 1), Zs = /* @__PURE__ */ W("<label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!>", 1), Qs = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0.1\" max=\"1\" step=\"0.01\" class=\"svelte-1n46o8q\"/>", 1), $s = /* @__PURE__ */ W("<div class=\"nav-row svelte-1n46o8q\"><input class=\"svelte-1n46o8q\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span> <span class=\"nav-target svelte-1n46o8q\"><!></span> <!></div> <!>", 1), ec = /* @__PURE__ */ W("<div class=\"panel-body svelte-1n46o8q\"><p class=\"panel-hint svelte-1n46o8q\"> </p> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <!></label> <!> <!> <!> <p class=\"panel-hint svelte-1n46o8q\"> </p></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <!></label> <!> <!> <!> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"svelte-1n46o8q\"> <!></label> <!> <!> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <p class=\"panel-strong svelte-1n46o8q\"> </p> <!></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"1\" max=\"4\" class=\"svelte-1n46o8q\"/></label></div></details> <details class=\"group svelte-1n46o8q\" open=\"\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><!> <button class=\"ghost action svelte-1n46o8q\"> </button> <p class=\"panel-hint svelte-1n46o8q\"> </p></div></details></div>"), tc = /* @__PURE__ */ W("<img class=\"site-icon-preview svelte-1n46o8q\"/>"), nc = /* @__PURE__ */ W("<button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button>", 1), rc = /* @__PURE__ */ W("<div class=\"panel-body svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <!></label> <span class=\"toolbar-row svelte-1n46o8q\"><label class=\"ghost filepick tb-grow svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <!></span></div>"), ic = /* @__PURE__ */ W("<div class=\"tpv-cap svelte-1n46o8q\"> </div>"), ac = /* @__PURE__ */ W("<div class=\"theme-pvw svelte-1n46o8q\"><!> <div class=\"tpv-demo svelte-1n46o8q\"><div class=\"tpv-h svelte-1n46o8q\"> </div> <div class=\"tpv-card svelte-1n46o8q\"> </div> <div class=\"tpv-row svelte-1n46o8q\"><span class=\"tpv-btn svelte-1n46o8q\"> </span><span class=\"tpv-lnk svelte-1n46o8q\"> </span></div></div></div>"), oc = /* @__PURE__ */ W("<button type=\"button\"><span class=\"tp-band svelte-1n46o8q\"><i class=\"svelte-1n46o8q\"></i><i class=\"svelte-1n46o8q\"></i><i class=\"svelte-1n46o8q\"></i><i class=\"svelte-1n46o8q\"></i></span> <small class=\"svelte-1n46o8q\"> </small></button>"), sc = /* @__PURE__ */ W("<div class=\"autorow svelte-1n46o8q\"><span class=\"autolbl svelte-1n46o8q\"> </span> <span class=\"seg svelte-1n46o8q\"><button type=\"button\"> </button> <button type=\"button\"> </button></span></div>"), cc = /* @__PURE__ */ W("<span class=\"palname svelte-1n46o8q\"> </span>"), lc = /* @__PURE__ */ W("<div class=\"palcol svelte-1n46o8q\"><!> <span class=\"palcap svelte-1n46o8q\"> </span> <b class=\"palhex svelte-1n46o8q\"> </b></div>"), uc = /* @__PURE__ */ W("<p class=\"panel-hint svelte-1n46o8q\"> </p>"), dc = /* @__PURE__ */ W("<div class=\"palhead svelte-1n46o8q\"><span class=\"palname svelte-1n46o8q\"> </span> <button type=\"button\"> </button></div> <div></div> <!>", 1), fc = /* @__PURE__ */ W("<div class=\"panel-body svelte-1n46o8q\"><p class=\"panel-strong svelte-1n46o8q\"> </p> <div class=\"theme-presets svelte-1n46o8q\"></div> <p class=\"panel-strong svelte-1n46o8q\"> </p> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!> <div class=\"palhead svelte-1n46o8q\"><!> <button type=\"button\"> </button></div> <div class=\"palcells svelte-1n46o8q\"></div> <!> <div class=\"theme-previews svelte-1n46o8q\"><!> <!></div> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <div class=\"typo-sample svelte-1n46o8q\"><div class=\"ts-h svelte-1n46o8q\"> </div> <div class=\"ts-b svelte-1n46o8q\"> </div></div></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><div class=\"form-prev svelte-1n46o8q\"><span class=\"fp-btn svelte-1n46o8q\"> </span> <span class=\"fp-card svelte-1n46o8q\"> </span></div> <label class=\"rng-lab svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"24\" step=\"1\" class=\"svelte-1n46o8q\"/> <label class=\"rng-lab svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"0\" max=\"40\" step=\"1\" class=\"svelte-1n46o8q\"/></div></details></div>"), pc = /* @__PURE__ */ W("<details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"></div></details>"), mc = /* @__PURE__ */ W("<div><p class=\"panel-hint svelte-1n46o8q\"> </p> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button></div></details> <button class=\"ghost svelte-1n46o8q\"> </button> <label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"> </button> <label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" multiple=\"\" class=\"svelte-1n46o8q\"/></label></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"ghost svelte-1n46o8q\"> </button></div></details> <!></div>"), hc = /* @__PURE__ */ W("<div class=\"panel-body svelte-1n46o8q\"><p class=\"panel-hint svelte-1n46o8q\"> </p> <label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"4\" max=\"96\" step=\"2\" class=\"svelte-1n46o8q\"/> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <p class=\"panel-hint svelte-1n46o8q\"> </p></div>"), gc = /* @__PURE__ */ W("<p class=\"panel-strong svelte-1n46o8q\"> </p> <!>", 1), _c = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"4\" max=\"96\" step=\"2\" class=\"svelte-1n46o8q\"/>", 1), vc = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" max=\"1000\" step=\"10\" class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label>", 1), yc = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"0\" max=\"4000\" step=\"100\" class=\"svelte-1n46o8q\"/></label>"), bc = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <input type=\"number\" min=\"100\" max=\"4000\" step=\"100\" class=\"svelte-1n46o8q\"/></label> <!>", 1), xc = /* @__PURE__ */ W("<p class=\"panel-strong svelte-1n46o8q\"> </p> <label class=\"svelte-1n46o8q\"> <input class=\"token-input svelte-1n46o8q\"/></label> <p class=\"panel-hint svelte-1n46o8q\"> </p> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <span class=\"row-tools svelte-1n46o8q\"><span class=\"gridmenu-value svelte-1n46o8q\"> </span> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <p class=\"panel-strong svelte-1n46o8q\"> </p> <!> <hr class=\"gridmenu-divider svelte-1n46o8q\"/> <label class=\"svelte-1n46o8q\"> <!></label> <!> <label class=\"svelte-1n46o8q\"> <!></label>", 1), Sc = /* @__PURE__ */ W("<div class=\"panel-body svelte-1n46o8q\"><!></div>"), Cc = /* @__PURE__ */ W("<button class=\"footer-tp svelte-1n46o8q\"><span class=\"footer-tp-thumb svelte-1n46o8q\"></span> <span class=\"footer-tp-name svelte-1n46o8q\"> </span></button>"), wc = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <span class=\"gridmenu-value svelte-1n46o8q\"> </span></label> <input type=\"range\" min=\"16\" max=\"160\" step=\"2\" class=\"svelte-1n46o8q\"/>", 1), Tc = /* @__PURE__ */ W("<span class=\"toolbar-row svelte-1n46o8q\"><label class=\"ghost filepick tb-grow svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <!></span> <!>", 1), Ec = /* @__PURE__ */ W("<div class=\"nav-row svelte-1n46o8q\"><input class=\"svelte-1n46o8q\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></div> <!>", 1), Dc = /* @__PURE__ */ W("<div class=\"nav-row svelte-1n46o8q\"><span class=\"nav-line svelte-1n46o8q\"><span class=\"footer-soc-preview svelte-1n46o8q\" aria-hidden=\"true\"></span> <!></span> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span> <input class=\"nav-target svelte-1n46o8q\"/></div>"), Oc = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <!></label> <!>", 1), kc = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label>", 1), Ac = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <!></label> <label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <!>", 1), jc = /* @__PURE__ */ W("<label class=\"svelte-1n46o8q\"> <!></label> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), Mc = /* @__PURE__ */ W("<div class=\"panel-body svelte-1n46o8q\"><label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><div class=\"footer-tpick svelte-1n46o8q\"></div></div></details> <details class=\"group svelte-1n46o8q\" open=\"\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <!></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><!> <button class=\"ghost action svelte-1n46o8q\"> </button> <label class=\"svelte-1n46o8q\"> <!></label></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><!> <button class=\"ghost action svelte-1n46o8q\"> </button></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"gridmenu-snap svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <!></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><!> <button class=\"ghost action svelte-1n46o8q\"> </button></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><!> <p class=\"panel-strong svelte-1n46o8q\"> </p> <!></div></details> <details class=\"group svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <p class=\"panel-strong svelte-1n46o8q\"> </p> <!> <button class=\"ghost action svelte-1n46o8q\"> </button></div></details></div>"), Nc = /* @__PURE__ */ W("<img class=\"site-icon-preview svelte-1n46o8q\" alt=\"\"/> <button class=\"ghost row-tool svelte-1n46o8q\"></button>", 1), Pc = /* @__PURE__ */ W("<details class=\"group samling-entry svelte-1n46o8q\"><summary class=\"svelte-1n46o8q\"> </summary> <div class=\"group-items svelte-1n46o8q\"><span class=\"toolbar-row svelte-1n46o8q\"><input class=\"svelte-1n46o8q\"/> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span> <label class=\"svelte-1n46o8q\"> <input type=\"date\" class=\"svelte-1n46o8q\"/></label> <textarea rows=\"3\" class=\"svelte-1n46o8q\"></textarea> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <span class=\"toolbar-row svelte-1n46o8q\"><label class=\"ghost filepick svelte-1n46o8q\"> <input type=\"file\" accept=\"image/*\" class=\"svelte-1n46o8q\"/></label> <!></span></div></details>"), Fc = /* @__PURE__ */ W("<span class=\"toolbar-row svelte-1n46o8q\"><button class=\"ghost action svelte-1n46o8q\"> </button> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span> <!> <!> <hr class=\"gridmenu-divider svelte-1n46o8q\"/>", 1), Ic = /* @__PURE__ */ W("<div class=\"panel-body svelte-1n46o8q\"><p class=\"panel-hint svelte-1n46o8q\"> </p> <!> <!> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <button class=\"ghost action svelte-1n46o8q\"> </button></div>"), Lc = /* @__PURE__ */ W("<span class=\"plugin-meta svelte-1n46o8q\"> </span>"), Rc = /* @__PURE__ */ W("<p class=\"panel-hint plugin-warn svelte-1n46o8q\"> </p>"), zc = /* @__PURE__ */ W("<div><span class=\"plugin-head svelte-1n46o8q\"><span class=\"plugin-name svelte-1n46o8q\"> </span> <!> <span class=\"row-tools svelte-1n46o8q\"><label class=\"gridmenu-snap plugin-toggle svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label> <button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span> <!> <!></div>"), Bc = /* @__PURE__ */ W("<div class=\"plugin-row svelte-1n46o8q\"><span class=\"plugin-head svelte-1n46o8q\"><span class=\"plugin-name svelte-1n46o8q\"> </span> <!> <span class=\"row-tools svelte-1n46o8q\"><button class=\"ghost row-tool svelte-1n46o8q\"></button></span></span></div>"), Vc = /* @__PURE__ */ W("<hr class=\"gridmenu-divider svelte-1n46o8q\"/> <p class=\"panel-hint svelte-1n46o8q\"> </p> <!>", 1), Hc = /* @__PURE__ */ W("<hr class=\"gridmenu-divider svelte-1n46o8q\"/> <input class=\"svelte-1n46o8q\"/> <button class=\"ghost action svelte-1n46o8q\"> </button> <!>", 1), Uc = /* @__PURE__ */ W("<div class=\"panel-body svelte-1n46o8q\"><p class=\"panel-hint svelte-1n46o8q\"> </p> <!> <!> <!> <!></div>"), Wc = /* @__PURE__ */ W("<div><span class=\"history-msg svelte-1n46o8q\"> </span> <span class=\"history-meta svelte-1n46o8q\"> </span></div>"), Gc = /* @__PURE__ */ W("<button class=\"ghost svelte-1n46o8q\"> </button> <!>", 1), Kc = /* @__PURE__ */ W("<div class=\"panel-body svelte-1n46o8q\"><p class=\"panel-hint svelte-1n46o8q\"> </p> <!></div>"), qc = /* @__PURE__ */ W("<p class=\"panel-hint svelte-1n46o8q\"> </p> <button class=\"ghost svelte-1n46o8q\"> </button>", 1), Jc = /* @__PURE__ */ W("<span> </span>"), Yc = /* @__PURE__ */ W("<p class=\"panel-hint plugin-warn svelte-1n46o8q\"> </p> <pre class=\"update-headers svelte-1n46o8q\"> </pre>", 1), Xc = /* @__PURE__ */ W("<span class=\"update-warn svelte-1n46o8q\"></span>"), Zc = /* @__PURE__ */ W("<div class=\"update-row svelte-1n46o8q\"><span class=\"update-path svelte-1n46o8q\"> </span> <span class=\"update-flags svelte-1n46o8q\"><!> <!></span></div>"), Qc = /* @__PURE__ */ W("<div class=\"update-row svelte-1n46o8q\"><span> </span> <span class=\"update-flags svelte-1n46o8q\"><!> <!> <label class=\"update-keep svelte-1n46o8q\"><input type=\"checkbox\" class=\"svelte-1n46o8q\"/> </label></span></div>"), $c = /* @__PURE__ */ W("<!> <p class=\"panel-strong svelte-1n46o8q\"> </p> <!> <!> <button class=\"primary update-run svelte-1n46o8q\"> </button>", 1), el = /* @__PURE__ */ W("<div class=\"update-versions svelte-1n46o8q\"><span> </span> <!></div> <!>", 1), tl = /* @__PURE__ */ W("<aside class=\"panel svelte-1n46o8q\"><h2 class=\"svelte-1n46o8q\"> </h2> <!></aside>"), nl = /* @__PURE__ */ W("<nav class=\"rail svelte-1n46o8q\"><!> <span class=\"rail-settings svelte-1n46o8q\"><button></button> <!></span></nav> <!>", 1), rl = /* @__PURE__ */ W("<div class=\"workspace svelte-1n46o8q\"><!> <div><div class=\"stage svelte-1n46o8q\"><iframe class=\"svelte-1n46o8q\"></iframe></div></div></div>"), il = /* @__PURE__ */ W("<p class=\"loading svelte-1n46o8q\"> </p>"), al = /* @__PURE__ */ W("<p class=\"panel-hint confirm-line svelte-1n46o8q\"> </p>"), ol = /* @__PURE__ */ W("<div class=\"setup-overlay svelte-1n46o8q\"><div class=\"setup-card svelte-1n46o8q\"><h2 class=\"svelte-1n46o8q\"> </h2> <!> <span class=\"setup-actions svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"primary svelte-1n46o8q\"> </button></span></div></div>"), sl = /* @__PURE__ */ W("<div class=\"setup-overlay svelte-1n46o8q\"><div class=\"setup-card svelte-1n46o8q\"><h2 class=\"svelte-1n46o8q\"> </h2> <p class=\"panel-hint svelte-1n46o8q\"> </p> <label class=\"svelte-1n46o8q\"> <input class=\"svelte-1n46o8q\"/></label> <label class=\"svelte-1n46o8q\"> <!></label> <label class=\"svelte-1n46o8q\"> <!></label> <p class=\"panel-hint svelte-1n46o8q\"> </p> <span class=\"setup-actions svelte-1n46o8q\"><button class=\"ghost svelte-1n46o8q\"> </button> <button class=\"primary svelte-1n46o8q\"> </button></span></div></div>"), cl = /* @__PURE__ */ W("<div><span> </span> <button class=\"toast-x svelte-1n46o8q\">×</button></div>"), ll = /* @__PURE__ */ W("<div class=\"block-menu svelte-1n46o8q\"><header class=\"block-menu-head svelte-1n46o8q\"><span> </span> <button class=\"ghost row-tool svelte-1n46o8q\"></button></header> <div class=\"panel-body block-menu-body svelte-1n46o8q\"><!></div></div>"), ul = /* @__PURE__ */ W("<div class=\"editor svelte-1n46o8q\"><!> <header><span class=\"topbar-group svelte-1n46o8q\"><span class=\"brand svelte-1n46o8q\" title=\"Urd\"><svg class=\"brand-mark svelte-1n46o8q\" viewBox=\"0 0 40 40\" aria-hidden=\"true\"><path d=\"M12 32V10l16 6.5V32\" fill=\"none\" stroke=\"var(--urd-brand)\" stroke-width=\"3.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg> <span class=\"brand-word svelte-1n46o8q\">Urd</span></span> <!> <!> <!></span> <span class=\"topbar-group topbar-right svelte-1n46o8q\"><!></span></header> <!> <!> <!> <!> <!></div>   <!>", 1);
function dl(e, t) {
	Ue(t, !0);
	let n = (e, t = d, n = d) => {
		var r = ns(), i = R(r), a = L(i, !0);
		M(i);
		var s = z(i, 2);
		zr(s, 17, n, Fr, (e, r, i) => {
			var a = ts(), s = L(a), l = L(s);
			{
				let e = /* @__PURE__ */ P(() => Q("tip.bg.changeType")), n = /* @__PURE__ */ P(() => o.map(([e, t]) => [e, t.labelKey ? Q(t.labelKey) : t.label]));
				$(l, {
					get value() {
						return V(r).type;
					},
					get title() {
						return V(e);
					},
					get options() {
						return V(n);
					},
					onchange: (e) => cn(t(), i, e)
				});
			}
			var u = z(l, 2), d = L(u);
			d.disabled = i === 0, J(d, () => c.up, !0), M(d);
			var f = z(d, 2);
			J(f, () => c.down, !0), M(f);
			var p = z(f, 2);
			J(p, () => c.cross, !0), M(p), M(u), M(s);
			var m = z(s, 2), h = (e) => {
				var n = Ho(), a = R(n), o = L(a), s = z(o);
				{
					let e = /* @__PURE__ */ P(Sn), n = /* @__PURE__ */ P(() => Q("tip.bg.layerColor"));
					Vi(s, {
						get value() {
							return V(r).props.value;
						},
						get tokens() {
							return V(e);
						},
						get label() {
							return V(n);
						},
						onchange: (e) => Ht(t(), i, "value", e)
					});
				}
				M(a);
				var c = z(a, 2), l = L(c), u = z(l), d = L(u);
				M(u), M(c);
				var f = z(c, 2);
				Y(f), B((e, t, n) => {
					K(o, `${e ?? ""} `), K(l, `${t ?? ""} `), K(d, `${n ?? ""}%`), X(f, V(r).props.opacity ?? 1);
				}, [
					() => Q("lbl.color"),
					() => Q("lbl.strength"),
					() => Math.round((V(r).props.opacity ?? 1) * 100)
				]), H("input", f, (e) => Ht(t(), i, "opacity", Number(e.target.value))), G(e, n);
			}, g = (e) => {
				let n = /* @__PURE__ */ P(() => Jt(V(r))), a = /* @__PURE__ */ P(() => V(n).stops.reduce((e, t) => e + Math.max(0, Number(t.share) || 0), 0));
				var o = qo(), s = R(o), l = L(s), u = z(l);
				{
					let e = /* @__PURE__ */ P(() => V(n).kind ?? "linear"), r = /* @__PURE__ */ P(() => [["linear", Q("opt.grad.linear")], ["radial", Q("opt.grad.radial")]]);
					$(u, {
						get value() {
							return V(e);
						},
						get options() {
							return V(r);
						},
						onchange: (e) => Qt(t(), i, e)
					});
				}
				M(s);
				var d = z(s, 2);
				zr(d, 17, () => V(n).stops, Fr, (e, r, o) => {
					var s = Wo();
					let l;
					var u = L(s), d = z(u, 2);
					{
						let e = /* @__PURE__ */ P(Sn), n = /* @__PURE__ */ P(() => Q("tip.bg.stopColor"));
						Vi(d, {
							get value() {
								return V(r).color;
							},
							get tokens() {
								return V(e);
							},
							get label() {
								return V(n);
							},
							onchange: (e) => $t(t(), i, o, { color: e })
						});
					}
					var f = z(d, 2);
					Y(f);
					var p = z(f, 2), m = L(p);
					M(p);
					var h = z(p, 2), g = (e) => {
						var n = Uo();
						J(n, () => c.cross, !0), M(n), B((e) => Z(n, "title", e), [() => Q("tip.bg.removeStop")]), H("click", n, () => rn(t(), i, o)), G(e, n);
					};
					q(h, (e) => {
						V(n).stops.length > 2 && e(g);
					}), M(s), B((e, t, a) => {
						l = Xr(s, 1, "nav-line grad-stop svelte-1n46o8q", null, l, {
							dragging: V(on)?.layer === i && V(on).from === o,
							"drop-above": V(on)?.layer === i && V(on).insert === o,
							"drop-below": V(on)?.layer === i && V(on).insert === V(n).stops.length && o === V(n).stops.length - 1
						}), Z(u, "title", e), X(f, V(r).share ?? 50), Z(f, "title", t), K(m, `${a ?? ""}%`);
					}, [
						() => Q("tip.bg.dragStop"),
						() => Q("tip.bg.stopShare"),
						() => V(a) > 0 ? Math.round(Math.max(0, Number(V(r).share) || 0) / V(a) * 100) : Math.round(100 / V(n).stops.length)
					]), H("pointerdown", u, (e) => sn(t(), e, i, o)), H("input", f, (e) => $t(t(), i, o, { share: Number(e.target.value) })), G(e, s);
				});
				var f = z(d, 2), p = L(f, !0);
				M(f);
				var m = z(f, 2), h = (e) => {
					var r = Go(), a = R(r), o = L(a), s = z(o), c = L(s);
					M(s), M(a);
					var l = z(a, 2);
					Y(l);
					var u = z(l, 2), d = L(u), f = z(d), p = L(f);
					M(f), M(u);
					var m = z(u, 2);
					Y(m), B((e, t, r, i) => {
						K(o, `${e ?? ""} `), K(c, `${t ?? ""}%`), X(l, V(n).x ?? .5), K(d, `${r ?? ""} `), K(p, `${i ?? ""}%`), X(m, V(n).y ?? .5);
					}, [
						() => Q("lbl.centerX"),
						() => Math.round((V(n).x ?? .5) * 100),
						() => Q("lbl.centerY"),
						() => Math.round((V(n).y ?? .5) * 100)
					]), H("input", l, (e) => Xt(t(), i, "x", Number(e.target.value))), H("input", m, (e) => Xt(t(), i, "y", Number(e.target.value))), G(e, r);
				}, g = (e) => {
					var r = Ko(), a = R(r), o = L(a), s = z(o), c = L(s);
					M(s), M(a);
					var l = z(a, 2);
					Y(l), B((e) => {
						K(o, `${e ?? ""} `), K(c, `${V(n).angle ?? ""}°`), X(l, V(n).angle);
					}, [() => Q("lbl.angle")]), H("input", l, (e) => Xt(t(), i, "angle", Number(e.target.value))), G(e, r);
				};
				q(m, (e) => {
					(V(n).kind ?? "linear") === "radial" ? e(h) : e(g, -1);
				});
				var _ = z(m, 2), v = L(_), y = z(v), b = L(y);
				M(y), M(_);
				var x = z(_, 2);
				Y(x);
				var S = z(x, 2), C = L(S), w = z(C);
				{
					let e = /* @__PURE__ */ P(() => V(n).animation ?? "none");
					$(w, {
						get value() {
							return V(e);
						},
						get options() {
							return Zt[(V(n).kind ?? "linear") === "radial" ? "radial" : "linear"];
						},
						onchange: (e) => Xt(t(), i, "animation", e)
					});
				}
				M(S), B((e, t, r, i, a, o, s) => {
					K(l, `${e ?? ""} `), Z(f, "title", t), K(p, r), K(v, `${i ?? ""} `), K(b, `${a ?? ""}%`), X(x, V(n).opacity ?? 1), Z(S, "title", o), K(C, `${s ?? ""} `);
				}, [
					() => Q("blocks.shape"),
					() => Q("tip.bg.addStop"),
					() => Q("ui.addStop"),
					() => Q("lbl.strength"),
					() => Math.round((V(n).opacity ?? 1) * 100),
					() => Q("tip.bg.motion"),
					() => Q("lbl.motion")
				]), H("click", f, () => nn(t(), i)), H("input", x, (e) => Xt(t(), i, "opacity", Number(e.target.value))), G(e, o);
			}, _ = (e) => {
				var n = Jo(), a = R(n), o = L(a), s = z(o);
				{
					let e = /* @__PURE__ */ P(Sn), n = /* @__PURE__ */ P(() => Q("tip.bg.glowColor"));
					Vi(s, {
						get value() {
							return V(r).props.color;
						},
						get tokens() {
							return V(e);
						},
						get label() {
							return V(n);
						},
						onchange: (e) => Ht(t(), i, "color", e)
					});
				}
				M(a);
				var c = z(a, 2), l = L(c), u = z(l), d = L(u);
				M(u), M(c);
				var f = z(c, 2);
				Y(f);
				var p = z(f, 2), m = L(p), h = z(m), g = L(h);
				M(h), M(p);
				var _ = z(p, 2);
				Y(_);
				var v = z(_, 2), y = L(v), b = z(y), x = L(b);
				M(b), M(v);
				var S = z(v, 2);
				Y(S);
				var C = z(S, 2), w = L(C), T = z(w), E = L(T);
				M(T), M(C);
				var D = z(C, 2);
				Y(D), B((e, t, n, i, a, s, c, u, p) => {
					K(o, `${e ?? ""} `), K(l, `${t ?? ""} `), K(d, `${n ?? ""}%`), X(f, V(r).props.x), K(m, `${i ?? ""} `), K(g, `${a ?? ""}%`), X(_, V(r).props.y), K(y, `${s ?? ""} `), K(x, `${c ?? ""}%`), X(S, V(r).props.radius), K(w, `${u ?? ""} `), K(E, `${p ?? ""}%`), X(D, V(r).props.opacity);
				}, [
					() => Q("lbl.color"),
					() => Q("lbl.posX"),
					() => Math.round(V(r).props.x * 100),
					() => Q("lbl.posY"),
					() => Math.round(V(r).props.y * 100),
					() => Q("lbl.size"),
					() => Math.round(V(r).props.radius * 100),
					() => Q("lbl.strength"),
					() => Math.round(V(r).props.opacity * 100)
				]), H("input", f, (e) => Ht(t(), i, "x", Number(e.target.value))), H("input", _, (e) => Ht(t(), i, "y", Number(e.target.value))), H("input", S, (e) => Ht(t(), i, "radius", Number(e.target.value))), H("input", D, (e) => Ht(t(), i, "opacity", Number(e.target.value))), G(e, n);
			}, v = (e) => {
				var n = Yo(), a = R(n), o = L(a), s = z(o), c = L(s);
				M(s), M(a);
				var l = z(a, 2);
				Y(l), B((e, t) => {
					K(o, `${e ?? ""} `), K(c, `${t ?? ""}%`), X(l, V(r).props.opacity);
				}, [() => Q("lbl.strength"), () => Math.round(V(r).props.opacity * 100)]), H("input", l, (e) => Ht(t(), i, "opacity", Number(e.target.value))), G(e, n);
			}, y = (e) => {
				let n = /* @__PURE__ */ P(() => V(r).props.fit === "flislegg" || V(r).props.fit === "repeat");
				var a = Qo(), o = R(a), s = L(o), c = z(s);
				M(o);
				var l = z(o, 2), u = L(l), d = z(u);
				{
					let e = /* @__PURE__ */ P(() => V(n) ? "flislegg" : "vanlig"), r = /* @__PURE__ */ P(() => [["vanlig", Q("opt.img.plain")], ["flislegg", Q("opt.img.tile")]]);
					$(d, {
						get value() {
							return V(e);
						},
						get options() {
							return V(r);
						},
						onchange: (e) => Ht(t(), i, "fit", e)
					});
				}
				M(l);
				var f = z(l, 2), p = L(f, !0);
				M(f);
				var m = z(f, 2), h = L(m), g = z(h, 2);
				Y(g);
				var _ = z(g, 4);
				M(m);
				var v = z(m, 2), y = (e) => {
					var n = Xo(), a = R(n), o = L(a), s = L(o, !0);
					M(o);
					var c = z(o, 2), l = L(c, !0);
					M(c), M(a);
					var u = z(a, 2), d = L(u, !0);
					M(u);
					var f = z(u, 2), p = z(f, 2), m = L(p), h = z(m), g = L(h);
					M(h), M(p);
					var _ = z(p, 2);
					Y(_);
					var v = z(_, 2), y = L(v), b = z(y), x = L(b);
					M(b), M(v);
					var S = z(v, 2);
					Y(S), B((e, t, n, i, a, p, h, v, b, C, w, T) => {
						Z(o, "title", e), K(s, t), Z(c, "title", n), K(l, i), Z(u, "title", a), K(d, p), Qr(f, `--fx:${h ?? ""}%; --fy:${v ?? ""}%`), K(m, `${b ?? ""} `), K(g, `${C ?? ""}%`), X(_, V(r).props.x ?? .5), K(y, `${w ?? ""} `), K(x, `${T ?? ""}%`), X(S, V(r).props.y ?? .5);
					}, [
						() => Q("tip.bg.cover"),
						() => Q("ui.cover"),
						() => Q("opt.fitFrame.contain"),
						() => Q("opt.fit.contain"),
						() => Q("tip.bg.position"),
						() => Q("lbl.position"),
						() => Math.max(0, Math.min(1, V(r).props.x ?? .5)) * 100,
						() => Math.max(0, Math.min(1, V(r).props.y ?? .5)) * 100,
						() => Q("lbl.horizontal"),
						() => Math.round((V(r).props.x ?? .5) * 100),
						() => Q("lbl.vertical"),
						() => Math.round((V(r).props.y ?? .5) * 100)
					]), H("click", o, () => qt(t(), i, V(r), "cover")), H("click", c, () => qt(t(), i, V(r), "contain")), H("pointerdown", f, (e) => Ut(e, t(), i, "xy")), H("input", _, (e) => Ht(t(), i, "x", Number(e.target.value))), H("input", S, (e) => Ht(t(), i, "y", Number(e.target.value))), G(e, n);
				};
				q(v, (e) => {
					V(n) || e(y);
				});
				var b = z(v, 2), x = L(b), S = z(x), C = L(S);
				M(S), M(b);
				var w = z(b, 2);
				Y(w);
				var T = z(w, 2), E = L(T), D = z(E), ee = L(D);
				M(D), M(T);
				var te = z(T, 2);
				Y(te);
				var ne = z(te, 2), re = L(ne);
				Y(re);
				var ie = z(re);
				M(ne);
				var ae = z(ne, 2), oe = (e) => {
					var n = Zo(), a = R(n), o = L(a), s = z(o), c = L(s);
					M(s), M(a);
					var l = z(a, 2);
					Y(l);
					var u = z(l, 2), d = L(u), f = z(d);
					{
						let e = /* @__PURE__ */ P(() => V(r).props.bleed ?? "none"), n = /* @__PURE__ */ P(() => [
							["none", Q("common.none")],
							["up", Q("opt.bleed.up")],
							["down", Q("opt.bleed.down")],
							["both", Q("opt.brand.both")]
						]);
						$(f, {
							get value() {
								return V(e);
							},
							get options() {
								return V(n);
							},
							onchange: (e) => Ht(t(), i, "bleed", e)
						});
					}
					M(u), B((e, t, n, i) => {
						K(o, `${e ?? ""} `), K(c, `${t ?? ""}%`), X(l, V(r).props.parallax ?? .3), Z(u, "title", n), K(d, `${i ?? ""} `);
					}, [
						() => Q("lbl.parallaxStrength"),
						() => Math.round((V(r).props.parallax ?? 0) * 100),
						() => Q("tip.bg.bleed"),
						() => Q("lbl.bleed")
					]), H("input", l, (e) => Ht(t(), i, "parallax", Number(e.target.value))), G(e, n);
				};
				q(ae, (e) => {
					(V(r).props.parallax ?? 0) > 0 && e(oe);
				}), B((e, t, n, i, a, c, d, m, v, y, b, S, T, D) => {
					Z(o, "title", e), K(s, `${t ?? ""} `), Z(l, "title", n), K(u, `${i ?? ""} `), Z(f, "title", a), K(p, c), Z(h, "title", d), X(g, m), Z(_, "title", v), K(x, `${y ?? ""} `), K(C, `${V(r).props.blur ?? 0 ?? ""} px`), X(w, V(r).props.blur ?? 0), K(E, `${b ?? ""} `), K(ee, `${S ?? ""}%`), X(te, V(r).props.opacity ?? 1), Z(ne, "title", T), ri(re, (V(r).props.parallax ?? 0) > 0), K(ie, ` ${D ?? ""}`);
				}, [
					() => Q("tip.webpAuto"),
					() => V(r).props.src ? Q("ui.changeImage") : Q("ui.chooseImage"),
					() => Q("tip.bg.fit"),
					() => Q("lbl.fit"),
					() => Q("tip.bg.size"),
					() => Q("lbl.size"),
					() => Q("tip.smaller"),
					() => Math.round((V(r).props.size ?? 1) * 100),
					() => Q("tip.larger"),
					() => Q("lbl.blur"),
					() => Q("lbl.strength"),
					() => Math.round((V(r).props.opacity ?? 1) * 100),
					() => Q("tip.bg.parallax"),
					() => Q("lbl.parallax")
				]), H("change", c, (e) => fn(t(), i, e)), H("click", h, () => Gt(t(), i, V(r).props.size ?? 1, -.05)), H("change", g, (e) => Kt(t(), i, e.target.value)), H("click", _, () => Gt(t(), i, V(r).props.size ?? 1, .05)), H("input", w, (e) => Ht(t(), i, "blur", Number(e.target.value))), H("input", te, (e) => Ht(t(), i, "opacity", Number(e.target.value))), H("change", re, (e) => Ht(t(), i, "parallax", e.target.checked ? .3 : 0)), G(e, a);
			}, b = (e) => {
				var n = es(), a = R(n), o = L(a), s = z(o);
				M(a);
				var l = z(a, 2);
				zr(l, 17, () => V(r).props.images ?? [], Fr, (e, n, a) => {
					var o = $o(), s = R(o), l = L(s), u = z(l, 2), d = L(u);
					d.disabled = a === 0, J(d, () => c.up, !0), M(d);
					var f = z(d, 2);
					J(f, () => c.down, !0), M(f);
					var p = z(f, 2);
					J(p, () => c.cross, !0), M(p), M(u), M(s);
					var m = z(s, 2), h = L(m), g = z(h), _ = L(g);
					M(g), M(m);
					var v = z(m, 2);
					Y(v);
					var y = z(v, 2), b = L(y), x = z(b), S = L(x);
					M(x), M(y);
					var C = z(y, 2);
					Y(C), B((e, t, i, o, s) => {
						Z(l, "src", V(n).src), f.disabled = a === V(r).props.images.length - 1, Z(p, "title", e), K(h, `${t ?? ""} `), K(_, `${i ?? ""}%`), X(v, V(n).x ?? .5), K(b, `${o ?? ""} `), K(S, `${s ?? ""}%`), X(C, V(n).y ?? .5);
					}, [
						() => Q("tip.removeImage"),
						() => Q("lbl.focusX"),
						() => Math.round((V(n).x ?? .5) * 100),
						() => Q("lbl.focusY"),
						() => Math.round((V(n).y ?? .5) * 100)
					]), H("click", d, () => mn(t(), i, a, -1)), H("click", f, () => mn(t(), i, a, 1)), H("click", p, () => hn(t(), i, a)), H("input", v, (e) => gn(t(), i, a, "x", Number(e.target.value))), H("input", C, (e) => gn(t(), i, a, "y", Number(e.target.value))), G(e, o);
				});
				var u = z(l, 2), d = L(u), f = z(d);
				{
					let e = /* @__PURE__ */ P(() => V(r).props.fit ?? "cover"), n = /* @__PURE__ */ P(() => [["cover", Q("opt.fit.cover")], ["contain", Q("opt.fit.contain")]]);
					$(f, {
						get value() {
							return V(e);
						},
						get options() {
							return V(n);
						},
						onchange: (e) => Ht(t(), i, "fit", e)
					});
				}
				M(u);
				var p = z(u, 2), m = L(p), h = z(m);
				Y(h), M(p);
				var g = z(p, 2), _ = L(g), v = z(_), y = L(v);
				M(v), M(g);
				var b = z(g, 2);
				Y(b);
				var x = z(b, 2), S = L(x), C = z(S), w = L(C);
				M(C), M(x);
				var T = z(x, 2);
				Y(T);
				var E = z(T, 2), D = L(E), ee = z(D), te = L(ee);
				M(ee), M(E);
				var ne = z(E, 2);
				Y(ne);
				var re = z(ne, 2), ie = L(re, !0);
				M(re), B((e, t, n, i, s, c, l, u, f, p) => {
					Z(a, "title", e), K(o, `${t ?? ""} `), K(d, `${n ?? ""} `), K(m, `${i ?? ""} `), X(h, V(r).props.interval ?? 6), K(_, `${s ?? ""} `), K(y, `${c ?? ""} s`), X(b, V(r).props.fade ?? 1.5), K(S, `${l ?? ""} `), K(w, `${V(r).props.blur ?? 0 ?? ""} px`), X(T, V(r).props.blur ?? 0), K(D, `${u ?? ""} `), K(te, `${f ?? ""}%`), X(ne, V(r).props.opacity ?? 1), K(ie, p);
				}, [
					() => Q("tip.bg.addImages"),
					() => Q("ui.addImages"),
					() => Q("lbl.fit"),
					() => Q("lbl.secondsPerImage"),
					() => Q("lbl.transition"),
					() => (V(r).props.fade ?? 1.5).toFixed(1),
					() => Q("lbl.blur"),
					() => Q("lbl.strength"),
					() => Math.round((V(r).props.opacity ?? 1) * 100),
					() => Q("hint.bg.gallery")
				]), H("change", s, (e) => pn(t(), i, e)), H("change", h, (e) => Ht(t(), i, "interval", Number(e.target.value))), H("input", b, (e) => Ht(t(), i, "fade", Number(e.target.value))), H("input", T, (e) => Ht(t(), i, "blur", Number(e.target.value))), H("input", ne, (e) => Ht(t(), i, "opacity", Number(e.target.value))), G(e, n);
			};
			q(m, (e) => {
				V(r).type === "color" ? e(h) : V(r).type === "gradient" ? e(g, 1) : V(r).type === "glow" ? e(_, 2) : V(r).type === "grain" ? e(v, 3) : V(r).type === "image" ? e(y, 4) : V(r).type === "bildegalleri" && e(b, 5);
			}), M(a), B((e) => {
				f.disabled = i === n().length - 1, Z(p, "title", e);
			}, [() => Q("tip.bg.removeLayer")]), H("click", d, () => Vt(t(), i, -1)), H("click", f, () => Vt(t(), i, 1)), H("click", p, () => Bt(t(), i)), G(e, a);
		});
		var l = z(s, 2), u = L(l), f = z(u);
		{
			let e = /* @__PURE__ */ P(() => o.map(([e, t]) => [e, t.labelKey ? Q(t.labelKey) : t.label]));
			$(f, {
				get value() {
					return V(Rt);
				},
				get options() {
					return V(e);
				},
				onchange: (e) => I(Rt, e, !0)
			});
		}
		M(l);
		var p = z(l, 2), m = L(p, !0);
		M(p), B((e, t, n) => {
			K(a, e), K(u, `${t ?? ""} `), K(m, n);
		}, [
			() => Q("hint.bg.order"),
			() => Q("lbl.newLayer"),
			() => Q("ui.addLayer")
		]), H("click", p, () => zt(t(), V(Rt))), G(e, r);
	}, r = (e, t = d, n = d) => {
		var r = kr();
		zr(R(r), 17, n, Fr, (e, r, i) => {
			var a = is(), o = L(a);
			Y(o);
			var s = z(o, 2), l = L(s);
			l.disabled = i === 0, J(l, () => c.up, !0), M(l);
			var u = z(l, 2);
			J(u, () => c.down, !0), M(u);
			var d = z(u, 2);
			J(d, () => c.cross, !0), M(d), M(s);
			var f = z(s, 2), p = L(f);
			{
				let e = /* @__PURE__ */ P(() => V(r).page ?? "__href"), n = /* @__PURE__ */ P(() => Q("tip.linkTarget")), a = /* @__PURE__ */ P(() => [...V(A).pages.map((e) => [e.id, e.title]), ["__href", Q("opt.linkHref")]]);
				$(p, {
					get value() {
						return V(e);
					},
					get title() {
						return V(n);
					},
					get options() {
						return V(a);
					},
					onchange: (e) => Na(t(), i, e)
				});
			}
			M(f);
			var m = z(f, 2), h = (e) => {
				var n = rs();
				Y(n), B((e, t) => {
					X(n, V(r).href ?? ""), Z(n, "placeholder", e), Z(n, "title", t);
				}, [() => Q("ph.hrefAnchor"), () => Q("tip.hrefAnchor")]), H("change", n, (e) => Fa(t(), i, e.target.value)), G(e, n);
			};
			q(m, (e) => {
				V(r).page || e(h);
			}), M(a), B((e, t) => {
				X(o, V(r).label), Z(o, "title", e), u.disabled = i === n().length - 1, Z(d, "title", t);
			}, [() => Q("tip.linkLabel"), () => Q("tip.removeLink")]), H("input", o, (e) => Ma(t(), i, e.target.value)), H("click", l, () => ka(t(), i, -1)), H("click", u, () => ka(t(), i, 1)), H("click", d, () => Oa(t(), i)), G(e, a);
		}), G(e, r);
	}, i = (e) => {
		let t = /* @__PURE__ */ P(() => V(N).props.boxStyle ?? {});
		var n = ss(), r = R(n), i = L(r), a = z(i);
		{
			let e = /* @__PURE__ */ P(() => V(t).bg ?? ""), n = /* @__PURE__ */ P(Sn), r = /* @__PURE__ */ P(() => Q("tip.box.bg"));
			Vi(a, {
				get value() {
					return V(e);
				},
				get tokens() {
					return V(n);
				},
				allowClear: !0,
				get label() {
					return V(r);
				},
				onchange: (e) => mt({ bg: e || null })
			});
		}
		M(r);
		var o = z(r, 2), s = L(o), c = z(s);
		{
			let e = /* @__PURE__ */ P(() => V(t).shadow ?? ""), n = /* @__PURE__ */ P(() => [
				["", Q("common.none")],
				["soft", Q("opt.shadow.soft")],
				["strong", Q("opt.shadow.strong")]
			]);
			$(c, {
				get value() {
					return V(e);
				},
				get options() {
					return V(n);
				},
				onchange: (e) => mt({ shadow: e || null })
			});
		}
		M(o);
		var l = z(o, 2), u = (e) => {
			var n = as(), r = L(n), i = z(r);
			{
				let e = /* @__PURE__ */ P(() => V(t).shadowColor ?? ""), n = /* @__PURE__ */ P(Sn), r = /* @__PURE__ */ P(() => Q("tip.box.shadowColor"));
				Vi(i, {
					get value() {
						return V(e);
					},
					get tokens() {
						return V(n);
					},
					allowClear: !0,
					get label() {
						return V(r);
					},
					onchange: (e) => mt({ shadowColor: e || null })
				});
			}
			M(n), B((e) => K(r, `${e ?? ""} `), [() => Q("lbl.shadowColor")]), G(e, n);
		};
		q(l, (e) => {
			V(t).shadow && e(u);
		});
		var d = z(l, 2), f = L(d), p = z(f);
		{
			let e = /* @__PURE__ */ P(() => V(t).border === "none" ? "none" : V(t).border ? "custom" : ""), n = /* @__PURE__ */ P(() => [
				["", Q("opt.border.theme")],
				["none", Q("common.none")],
				["custom", Q("opt.border.custom")]
			]);
			$(p, {
				get value() {
					return V(e);
				},
				get options() {
					return V(n);
				},
				onchange: (e) => mt({ border: e === "custom" ? {
					color: "accent",
					width: 1
				} : e || null })
			});
		}
		M(d);
		var m = z(d, 2), h = (e) => {
			let n = /* @__PURE__ */ P(() => typeof V(t).border == "object" ? V(t).border : {
				color: "text",
				width: 1
			});
			var r = os(), i = R(r), a = L(i), o = z(a);
			{
				let e = /* @__PURE__ */ P(Sn), t = /* @__PURE__ */ P(() => Q("tip.box.borderColor"));
				Vi(o, {
					get value() {
						return V(n).color;
					},
					get tokens() {
						return V(e);
					},
					get label() {
						return V(t);
					},
					onchange: (e) => mt({ border: {
						...V(n),
						color: e
					} })
				});
			}
			M(i);
			var s = z(i, 2), c = L(s), l = z(c), u = L(l), d = z(u, 2);
			Y(d);
			var f = z(d, 2);
			M(l), M(s), B((e, t, r, i, o, s) => {
				K(a, `${e ?? ""} `), K(c, `${t ?? ""} `), Z(u, "title", r), Z(u, "aria-label", i), X(d, V(n).width), Z(f, "title", o), Z(f, "aria-label", s);
			}, [
				() => Q("lbl.borderColor"),
				() => Q("lbl.thicknessPx"),
				() => Q("tip.thinner"),
				() => Q("tip.thinner"),
				() => Q("tip.thicker"),
				() => Q("tip.thicker")
			]), H("click", u, () => mt({ border: {
				...V(n),
				width: Math.max(1, V(n).width - 1)
			} })), H("change", d, (e) => mt({ border: {
				...V(n),
				width: Math.min(12, Math.max(1, Number(e.target.value) || 1))
			} })), H("click", f, () => mt({ border: {
				...V(n),
				width: Math.min(12, V(n).width + 1)
			} })), G(e, r);
		};
		q(m, (e) => {
			V(t).border !== "none" && e(h);
		});
		var g = z(m, 2), _ = L(g);
		Y(_);
		var v = z(_);
		M(g), B((e, t, n, r, a, o) => {
			K(i, `${e ?? ""} `), K(s, `${t ?? ""} `), K(f, `${n ?? ""} `), Z(g, "title", r), ri(_, a), K(v, ` ${o ?? ""}`);
		}, [
			() => Q("lbl.blockColor"),
			() => Q("lbl.shadow"),
			() => Q("lbl.border"),
			() => Q("tip.box.glass"),
			() => !!V(t).glass,
			() => Q("lbl.glass")
		]), H("change", _, (e) => mt({ glass: e.target.checked || null })), G(e, n);
	}, a = (e) => {
		var t = js(), n = R(t), r = (e) => {
			var t = cs(), n = R(t), r = L(n), a = z(r);
			{
				let e = /* @__PURE__ */ P(() => V(N).props.align ?? "left"), t = /* @__PURE__ */ P(() => [
					["left", Q("common.left")],
					["center", Q("common.center")],
					["right", Q("common.right")]
				]);
				$(a, {
					get value() {
						return V(e);
					},
					get options() {
						return V(t);
					},
					onchange: (e) => ft("align", e)
				});
			}
			M(n);
			var o = z(n, 2), s = L(o);
			Y(s);
			var c = z(s);
			M(o);
			var l = z(o, 2), u = (e) => {
				i(e);
			};
			q(l, (e) => {
				V(N).props.box && e(u);
			}), B((e, t, n) => {
				K(r, `${e ?? ""} `), ri(s, t), K(c, ` ${n ?? ""}`);
			}, [
				() => Q("lbl.align"),
				() => !!V(N).props.box,
				() => Q("lbl.textBoxToggle")
			]), H("change", s, (e) => ft("box", e.target.checked)), G(e, t);
		}, a = (e) => {
			var t = us(), n = R(t), r = L(n);
			Y(r);
			var a = z(r);
			M(n);
			var o = z(n, 2), s = L(o, !0);
			M(o);
			var l = z(o, 2);
			zr(l, 17, () => V(N).props.items ?? [], Fr, (e, t, n) => {
				var r = ls(), i = L(r);
				Y(i);
				var a = z(i, 2), o = L(a);
				o.disabled = n === 0, J(o, () => c.up, !0), M(o);
				var s = z(o, 2);
				J(s, () => c.down, !0), M(s);
				var l = z(s, 2);
				J(l, () => c.cross, !0), M(l), M(a), M(r), B((e, r) => {
					X(i, V(t).q), Z(i, "title", e), s.disabled = n === (V(N).props.items?.length ?? 0) - 1, Z(l, "title", r);
				}, [() => Q("tip.faq.question"), () => Q("tip.faq.remove")]), H("change", i, (e) => ht(n, { q: e.target.value })), H("click", o, () => vt(n, -1)), H("click", s, () => vt(n, 1)), H("click", l, () => _t(n)), G(e, r);
			});
			var u = z(l, 2), d = L(u, !0);
			M(u);
			var f = z(u, 2), p = L(f, !0);
			M(f);
			var m = z(f, 2);
			i(m), B((e, t, i, o, c, l) => {
				Z(n, "title", e), ri(r, t), K(a, ` ${i ?? ""}`), K(s, o), K(d, c), K(p, l);
			}, [
				() => Q("tip.faq.multi"),
				() => !!V(N).props.multi,
				() => Q("lbl.faqMulti"),
				() => Q("lbl.questions"),
				() => Q("ui.addQuestion"),
				() => Q("lbl.cardStyle")
			]), H("change", r, (e) => ft("multi", e.target.checked)), H("click", u, gt), G(e, t);
		}, o = (e) => {
			var t = fs(), n = R(t), r = L(n), i = z(r);
			Y(i), M(n);
			var a = z(n, 2), o = L(a), s = z(o);
			{
				let e = /* @__PURE__ */ P(() => V(N).props.page ?? "__href"), t = /* @__PURE__ */ P(() => [...V(A).pages.map((e) => [e.id, e.title]), ["__href", Q("opt.externalLink")]]);
				$(s, {
					get value() {
						return V(e);
					},
					get options() {
						return V(t);
					},
					onchange: (e) => {
						let t = e === "__href" ? null : e;
						dt(`edit:${V(N).blockId}`, (e) => {
							e.props.page = t, t && (e.props.href = null);
						});
					}
				});
			}
			M(a);
			var c = z(a, 2), l = (e) => {
				var t = ds();
				Y(t), B((e) => {
					Z(t, "placeholder", e), X(t, V(N).props.href === "#" ? "" : V(N).props.href ?? "");
				}, [() => Q("ph.url")]), H("change", t, (e) => ft("href", e.target.value || null)), G(e, t);
			};
			q(c, (e) => {
				V(N).props.page || e(l);
			});
			var u = z(c, 2), d = L(u), f = z(d);
			{
				let e = /* @__PURE__ */ P(() => [["primary", Q("opt.btn.primary")], ["secondary", Q("opt.btn.secondary")]]);
				$(f, {
					get value() {
						return V(N).props.style;
					},
					get options() {
						return V(e);
					},
					onchange: (e) => ft("style", e)
				});
			}
			M(u), B((e, t, n) => {
				K(r, `${e ?? ""} `), X(i, V(N).props.label), K(o, `${t ?? ""} `), K(d, `${n ?? ""} `);
			}, [
				() => Q("blocks.text"),
				() => Q("lbl.goesTo"),
				() => Q("lbl.style")
			]), H("change", i, (e) => ft("label", e.target.value)), G(e, t);
		}, s = (e) => {
			var t = ms(), n = R(t), r = L(n), i = z(r);
			M(n);
			var a = z(n, 2), o = L(a), s = z(o);
			Y(s), M(a);
			var c = z(a, 2), l = L(c), u = z(l);
			{
				let e = /* @__PURE__ */ P(() => V(N).props.fit ?? "cover"), t = /* @__PURE__ */ P(() => [["cover", Q("opt.fitFrame.cover")], ["contain", Q("opt.fitFrame.contain")]]);
				$(u, {
					get value() {
						return V(e);
					},
					get options() {
						return V(t);
					},
					onchange: (e) => ft("fit", e)
				});
			}
			M(c);
			var d = z(c, 2), f = L(d), p = z(f);
			{
				let e = /* @__PURE__ */ P(() => V(N).props.radius ?? ""), t = /* @__PURE__ */ P(() => [
					["", Q("common.none")],
					["sm", Q("opt.size.sm")],
					["md", Q("opt.radius.md")]
				]);
				$(p, {
					get value() {
						return V(e);
					},
					get options() {
						return V(t);
					},
					onchange: (e) => ft("radius", e || null)
				});
			}
			M(d);
			var m = z(d, 2), h = L(m), g = z(h);
			Y(g), M(m);
			var _ = z(m, 2), v = (e) => {
				var t = ps(), n = L(t);
				Y(n);
				var r = z(n);
				M(t), B((e, i, a) => {
					Z(t, "title", e), ri(n, i), K(r, ` ${a ?? ""}`);
				}, [
					() => Q("tip.lightbox"),
					() => !!V(N).props.lightbox,
					() => Q("lbl.lightbox")
				]), H("change", n, (e) => ft("lightbox", e.target.checked)), G(e, t);
			};
			q(_, (e) => {
				V(N).props.href || e(v);
			});
			var y = z(_, 2), b = L(y), x = z(b), S = L(x);
			M(x), M(y);
			var C = z(y, 2);
			Y(C);
			var w = z(C, 2), T = L(w), E = z(T), D = L(E);
			M(E), M(w);
			var ee = z(w, 2);
			Y(ee);
			var te = z(ee, 2), ne = L(te), re = z(ne), ie = L(re);
			M(re), M(te);
			var ae = z(te, 2);
			Y(ae);
			var oe = z(ae, 2), se = L(oe), ce = z(se), le = L(ce);
			M(ce), M(oe);
			var ue = z(oe, 2);
			Y(ue);
			var de = z(ue, 2), fe = L(de), pe = z(fe), me = L(pe);
			M(pe), M(de);
			var he = z(de, 2);
			Y(he);
			var O = z(he, 2), ge = L(O), k = z(ge), A = L(k);
			M(k), M(O);
			var _e = z(O, 2);
			Y(_e);
			var ve = z(_e, 2), ye = L(ve, !0);
			M(ve), B((e, t, n, i, a, c, u, d, p, m, _, v, y, x, w, E, re, oe, ce, de, pe, O) => {
				K(r, `${e ?? ""} `), K(o, `${t ?? ""} `), X(s, V(N).props.alt ?? ""), Z(s, "placeholder", n), K(l, `${i ?? ""} `), K(f, `${a ?? ""} `), K(h, `${c ?? ""} `), X(g, V(N).props.href ?? ""), Z(g, "placeholder", u), K(b, `${d ?? ""} `), K(S, `${p ?? ""}%`), X(C, V(N).props.x ?? .5), K(T, `${m ?? ""} `), K(D, `${_ ?? ""}%`), X(ee, V(N).props.y ?? .5), Z(te, "title", v), K(ne, `${y ?? ""} `), K(ie, `${x ?? ""}x`), X(ae, V(N).props.zoom ?? 1), K(se, `${w ?? ""} `), K(le, `${E ?? ""}%`), X(ue, V(N).props.brightness ?? 1), K(fe, `${re ?? ""} `), K(me, `${oe ?? ""}%`), X(he, V(N).props.contrast ?? 1), K(ge, `${ce ?? ""} `), K(A, `${de ?? ""}%`), X(_e, V(N).props.saturate ?? 1), Z(ve, "title", pe), K(ye, O);
			}, [
				() => Q("ui.changeImage"),
				() => Q("lbl.description"),
				() => Q("ph.altText"),
				() => Q("lbl.fit"),
				() => Q("lbl.radius"),
				() => Q("lbl.link"),
				() => Q("ph.optionalImageLink"),
				() => Q("lbl.focusX"),
				() => Math.round((V(N).props.x ?? .5) * 100),
				() => Q("lbl.focusY"),
				() => Math.round((V(N).props.y ?? .5) * 100),
				() => Q("tip.zoomCrop"),
				() => Q("lbl.zoom"),
				() => (V(N).props.zoom ?? 1).toFixed(2),
				() => Q("lbl.brightness"),
				() => Math.round((V(N).props.brightness ?? 1) * 100),
				() => Q("lbl.contrast"),
				() => Math.round((V(N).props.contrast ?? 1) * 100),
				() => Q("lbl.saturate"),
				() => Math.round((V(N).props.saturate ?? 1) * 100),
				() => Q("tip.resetAdjust"),
				() => Q("ui.resetAdjust")
			]), H("change", i, bt), H("change", s, (e) => ft("alt", e.target.value)), H("change", g, (e) => ft("href", e.target.value || null)), H("input", C, (e) => ft("x", Number(e.target.value))), H("input", ee, (e) => ft("y", Number(e.target.value))), H("input", ae, (e) => ft("zoom", Number(e.target.value))), H("input", ue, (e) => ft("brightness", Number(e.target.value))), H("input", he, (e) => ft("contrast", Number(e.target.value))), H("input", _e, (e) => ft("saturate", Number(e.target.value))), H("click", ve, () => dt(`edit:${V(N).blockId}`, (e) => {
				e.props.brightness = 1, e.props.contrast = 1, e.props.saturate = 1;
			})), G(e, t);
		}, l = (e) => {
			var t = hs(), n = R(t), r = L(n, !0);
			M(n);
			var i = z(n, 2);
			Y(i);
			var a = z(i, 2), o = L(a), s = z(o);
			Y(s), M(a);
			var c = z(a, 2), l = L(c, !0);
			M(c), B((e, t, n, a) => {
				K(r, e), X(i, V(N).props.url ?? ""), Z(i, "placeholder", t), K(o, `${n ?? ""} `), X(s, V(N).props.title ?? ""), K(l, a);
			}, [
				() => Q("lbl.videoUrl"),
				() => Q("ph.videoUrl"),
				() => Q("lbl.videoTitle"),
				() => Q("hint.video")
			]), H("change", i, (e) => ft("url", e.target.value)), H("change", s, (e) => ft("title", e.target.value)), G(e, t);
		}, u = (e) => {
			var t = ys(), n = R(t), r = L(n), i = z(r), a = L(i);
			{
				let e = /* @__PURE__ */ P(() => V(N).props.glyph ?? "★"), t = /* @__PURE__ */ P(() => V(N).props.icon ?? null), n = /* @__PURE__ */ P(() => V(N).props.image ?? null);
				ya(a, {
					get value() {
						return V(e);
					},
					get icon() {
						return V(t);
					},
					get image() {
						return V(n);
					},
					onpick: (e) => dt(`edit:${V(N).blockId}`, (t) => {
						t.props.glyph = e, t.props.icon = null, t.props.image = null;
					}),
					onicon: (e) => dt(`edit:${V(N).blockId}`, (t) => {
						t.props.icon = e, t.props.image = null;
					}),
					onimage: (e) => ft("image", e)
				});
			}
			var o = z(a, 2), s = (e) => {
				var t = gs();
				Y(t), B((e) => {
					X(t, V(N).props.glyph ?? ""), Z(t, "title", e);
				}, [() => Q("tip.icon.typeGlyph")]), H("change", t, (e) => ft("glyph", e.target.value || "★")), G(e, t);
			}, c = (e) => {
				var t = _s(), n = L(t, !0);
				M(t), B((e, r) => {
					Z(t, "title", e), K(n, r);
				}, [() => Q("tip.icon.backToGlyph"), () => Q("ui.removeDrawnIcon")]), H("click", t, () => ft("icon", null)), G(e, t);
			};
			q(o, (e) => {
				V(N).props.icon ? e(c, -1) : e(s);
			}), M(i), M(n);
			var l = z(n, 2), u = (e) => {
				var t = vs(), n = R(t), r = L(n), i = z(r, 2), a = L(i, !0);
				M(i), M(n);
				var o = z(n, 2), s = L(o, !0);
				M(o), B((e, t, n) => {
					Z(r, "src", V(N).props.image), Z(r, "alt", e), K(a, t), K(s, n);
				}, [
					() => Q("gp.ownIcon"),
					() => Q("ui.removeOwnIcon"),
					() => Q("hint.icon.ownImage")
				]), H("click", i, () => ft("image", null)), G(e, t);
			};
			q(l, (e) => {
				V(N).props.image && e(u);
			});
			var d = z(l, 2), f = L(d), p = z(f);
			Y(p), M(d);
			var m = z(d, 2), h = L(m), g = z(h);
			{
				let e = /* @__PURE__ */ P(() => V(N).props.color ?? "accent"), t = /* @__PURE__ */ P(Sn);
				Vi(g, {
					get value() {
						return V(e);
					},
					get tokens() {
						return V(t);
					},
					onchange: (e) => ft("color", e)
				});
			}
			M(m);
			var _ = z(m, 2), v = L(_, !0);
			M(_), B((e, t, n, i) => {
				K(r, `${e ?? ""} `), K(f, `${t ?? ""} `), X(p, V(N).props.size ?? 48), K(h, `${n ?? ""} `), K(v, i);
			}, [
				() => Q("blocks.icon"),
				() => Q("lbl.sizePx"),
				() => Q("lbl.color"),
				() => Q("hint.icon.color")
			]), H("change", p, (e) => ft("size", Number(e.target.value))), G(e, t);
		}, d = (e) => {
			var t = bs(), n = R(t), r = L(n), i = z(r);
			{
				let e = /* @__PURE__ */ P(() => V(N).props.collection ?? ""), t = /* @__PURE__ */ P(() => [["", Q("common.choose")], ...V(pi).map((e) => [e, V(mi)[e]?.name ?? e])]);
				$(i, {
					get value() {
						return V(e);
					},
					get options() {
						return V(t);
					},
					onchange: (e) => ft("collection", e || null)
				});
			}
			M(n);
			var a = z(n, 2), o = L(a), s = z(o);
			{
				let e = /* @__PURE__ */ P(() => V(N).props.view ?? "cards"), t = /* @__PURE__ */ P(() => [
					["cards", Q("opt.collectionView.cards")],
					["list", Q("opt.collectionView.list")],
					["archive", Q("opt.collectionView.archive")]
				]);
				$(s, {
					get value() {
						return V(e);
					},
					get options() {
						return V(t);
					},
					onchange: (e) => ft("view", e)
				});
			}
			M(a);
			var c = z(a, 2), l = L(c), u = z(l);
			Y(u), M(c);
			var d = z(c, 2), f = L(d);
			Y(f);
			var p = z(f);
			M(d);
			var m = z(d, 2), h = L(m, !0);
			M(m), B((e, t, n, i, a) => {
				K(r, `${e ?? ""} `), K(o, `${t ?? ""} `), K(l, `${n ?? ""} `), X(u, V(N).props.limit ?? 6), ri(f, V(N).props.newestFirst !== !1), K(p, ` ${i ?? ""}`), K(h, a);
			}, [
				() => Q("blocks.samling"),
				() => Q("lbl.view"),
				() => Q("lbl.maxCount"),
				() => Q("lbl.newestFirst"),
				() => Q("hint.samling")
			]), H("change", u, (e) => ft("limit", Number(e.target.value))), H("change", f, (e) => ft("newestFirst", e.target.checked)), G(e, t);
		}, f = (e) => {
			var t = ws(), n = R(t), r = L(n), i = z(r);
			{
				let e = /* @__PURE__ */ P(() => V(N).props.view ?? "grid"), t = /* @__PURE__ */ P(() => [
					["grid", Q("opt.galleryView.grid")],
					["carousel", Q("opt.galleryView.carousel")],
					["slides", Q("opt.galleryView.slides")]
				]);
				$(i, {
					get value() {
						return V(e);
					},
					get options() {
						return V(t);
					},
					onchange: (e) => ft("view", e)
				});
			}
			M(n);
			var a = z(n, 2), o = (e) => {
				var t = xs(), n = R(t), r = L(n), i = z(r);
				Y(i), M(n);
				var a = z(n, 2), o = L(a), s = z(o), c = L(s);
				M(s), M(a);
				var l = z(a, 2);
				Y(l), B((e, t) => {
					K(r, `${e ?? ""} `), X(i, V(N).props.columns ?? 3), K(o, `${t ?? ""} `), K(c, `${V(N).props.gap ?? 12 ?? ""} px`), X(l, V(N).props.gap ?? 12);
				}, [() => Q("lbl.columns"), () => Q("lbl.imageGap")]), H("change", i, (e) => ft("columns", Number(e.target.value))), H("input", l, (e) => ft("gap", Number(e.target.value))), G(e, t);
			};
			q(a, (e) => {
				(V(N).props.view ?? "grid") === "grid" && e(o);
			});
			var s = z(a, 2), l = (e) => {
				var t = Ss(), n = L(t), r = z(n);
				Y(r), M(t), B((e) => {
					K(n, `${e ?? ""} `), X(r, V(N).props.interval ?? 5);
				}, [() => Q("lbl.secondsPerImage")]), H("change", r, (e) => ft("interval", Number(e.target.value))), G(e, t);
			};
			q(s, (e) => {
				V(N).props.view === "slides" && e(l);
			});
			var u = z(s, 2), d = L(u), f = z(d);
			{
				let e = /* @__PURE__ */ P(() => V(N).props.radius ?? ""), t = /* @__PURE__ */ P(() => [
					["", Q("common.none")],
					["sm", Q("opt.size.sm")],
					["md", Q("opt.radius.md")]
				]);
				$(f, {
					get value() {
						return V(e);
					},
					get options() {
						return V(t);
					},
					onchange: (e) => ft("radius", e || null)
				});
			}
			M(u);
			var p = z(u, 2), m = L(p);
			Y(m);
			var h = z(m);
			M(p);
			var g = z(p, 4), _ = L(g), v = z(_);
			M(g);
			var y = z(g, 2);
			zr(y, 17, () => V(N).props.images ?? [], Fr, (e, t, n) => {
				var r = Cs(), i = L(r), a = L(i), o = z(a, 2), s = L(o);
				s.disabled = n === 0, J(s, () => c.up, !0), M(s);
				var l = z(s, 2);
				J(l, () => c.down, !0), M(l);
				var u = z(l, 2);
				J(u, () => c.cross, !0), M(u), M(o), M(i);
				var d = z(i, 2), f = L(d), p = z(f);
				Y(p), M(d);
				var m = z(d, 2), h = L(m), g = z(h);
				Y(g), M(m), M(r), B((e, r, i, o, s) => {
					Z(a, "src", V(t).src), l.disabled = n === V(N).props.images.length - 1, Z(u, "title", e), K(f, `${r ?? ""} `), X(p, V(t).alt ?? ""), Z(p, "placeholder", i), K(h, `${o ?? ""} `), X(g, V(t).href ?? ""), Z(g, "placeholder", s);
				}, [
					() => Q("tip.removeImage"),
					() => Q("lbl.description"),
					() => Q("ph.altShort"),
					() => Q("lbl.link"),
					() => Q("ph.galleryHref")
				]), H("click", s, () => Kl(n, -1)), H("click", l, () => Kl(n, 1)), H("click", u, () => ql(n)), H("change", p, (e) => Jl(n, "alt", e.target.value)), H("change", g, (e) => Jl(n, "href", e.target.value || null)), G(e, r);
			});
			var b = z(y, 2), x = L(b, !0);
			M(b), B((e, t, n, i, a, o, s) => {
				K(r, `${e ?? ""} `), K(d, `${t ?? ""} `), Z(p, "title", n), ri(m, V(N).props.lightbox !== !1), K(h, ` ${i ?? ""}`), Z(g, "title", a), K(_, `${o ?? ""} `), K(x, s);
			}, [
				() => Q("lbl.view"),
				() => Q("lbl.radius"),
				() => Q("tip.lightbox"),
				() => Q("lbl.lightbox"),
				() => Q("tip.gallery.addImages"),
				() => Q("ui.addImages"),
				() => Q("hint.gallery")
			]), H("change", m, (e) => ft("lightbox", e.target.checked)), H("change", v, Wl), G(e, t);
		}, p = (e) => {
			var t = Ts(), n = R(t), r = L(n);
			$(z(r), {
				get value() {
					return V(N).props.kind;
				},
				get options() {
					return St;
				},
				onchange: (e) => ft("kind", e)
			}), M(n);
			var i = z(n, 2), a = L(i);
			$(z(a), {
				get value() {
					return V(N).props.color;
				},
				get options() {
					return Ct;
				},
				onchange: (e) => ft("color", e)
			}), M(i);
			var o = z(i, 2), s = L(o), c = z(s);
			Y(c), M(o);
			var l = z(o, 2), u = L(l);
			Y(u);
			var d = z(u);
			M(l), B((e, t, n, i, o, f) => {
				K(r, `${e ?? ""} `), K(a, `${t ?? ""} `), K(s, `${n ?? ""} `), X(c, V(N).props.thickness), Z(l, "title", i), ri(u, o), K(d, ` ${f ?? ""}`);
			}, [
				() => Q("blocks.shape"),
				() => Q("lbl.color"),
				() => Q("lbl.thickness"),
				() => Q("tip.shape.fill"),
				() => !!V(N).props.fill,
				() => Q("lbl.filled")
			]), H("change", c, (e) => ft("thickness", Number(e.target.value))), H("change", u, (e) => ft("fill", e.target.checked ? V(N).props.color : null)), G(e, t);
		}, m = (e) => {
			var t = Es(), n = R(t), r = L(n, !0);
			M(n);
			var i = z(n, 2), a = L(i, !0);
			M(i), B((e, t) => {
				K(r, e), K(a, t);
			}, [() => Q("ui.settings"), () => Q("hint.pluginBlock")]), H("click", n, () => k?.sendOpenConfig(V(N).blockId)), G(e, t);
		};
		q(n, (e) => {
			V(N).type === "text" ? e(r) : V(N).type === "faq" ? e(a, 1) : V(N).type === "button" ? e(o, 2) : V(N).type === "image" ? e(s, 3) : V(N).type === "video" ? e(l, 4) : V(N).type === "icon" ? e(u, 5) : V(N).type === "samling" ? e(d, 6) : V(N).type === "galleri" ? e(f, 7) : V(N).type === "shape" ? e(p, 8) : e(m, -1);
		});
		var h = z(n, 4), g = L(h), _ = z(g);
		{
			let e = /* @__PURE__ */ P(() => An(V(N).animation) ? V(N).animation.type : "");
			$(_, {
				get value() {
					return V(e);
				},
				get options() {
					return jn;
				},
				onchange: (e) => Pn(e || null)
			});
		}
		M(h);
		var v = z(h, 2), y = (e) => {
			var t = Ds(), n = R(t), r = L(n), i = z(r);
			Y(i), M(n);
			var a = z(n, 2), o = L(a), s = z(o);
			Y(s), M(a), B((e, t) => {
				K(r, `${e ?? ""} `), X(i, V(N).animation.props.duration), K(o, `${t ?? ""} `), X(s, V(N).animation.props.delay);
			}, [() => Q("lbl.durationMs"), () => Q("lbl.delayMs")]), H("change", i, (e) => In("duration", Number(e.target.value))), H("change", s, (e) => In("delay", Number(e.target.value))), G(e, t);
		}, b = /* @__PURE__ */ P(() => An(V(N).animation));
		q(v, (e) => {
			V(b) && e(y);
		});
		var x = z(v, 2), S = L(x), C = z(S);
		{
			let e = /* @__PURE__ */ P(() => V(N).hover?.type ?? (V(N).animation && !An(V(N).animation) ? V(N).animation.type : ""));
			$(C, {
				get value() {
					return V(e);
				},
				get options() {
					return Mn;
				},
				onchange: (e) => Fn(e || null)
			});
		}
		M(x);
		var w = z(x, 2), T = (e) => {
			var t = ks(), n = z(R(t), 2), r = L(n);
			Y(r);
			var i = z(r);
			M(n);
			var a = z(n, 2), o = (e) => {
				var t = Os(), n = R(t), r = L(n), i = z(r);
				Y(i), M(n);
				var a = z(n, 2), o = L(a), s = z(o);
				{
					let e = /* @__PURE__ */ P(() => V(N).sticky.until ?? ""), t = /* @__PURE__ */ P(lt);
					$(s, {
						get value() {
							return V(e);
						},
						get options() {
							return V(t);
						},
						onchange: (e) => dt(`edit:${V(N).blockId}`, (t) => {
							t.sticky = {
								...t.sticky,
								until: e || null
							};
						})
					});
				}
				M(a), B((e, t, s, c) => {
					Z(n, "title", e), K(r, `${t ?? ""} `), X(i, V(N).sticky.offset ?? 16), Z(a, "title", s), K(o, `${c ?? ""} `);
				}, [
					() => Q("tip.stickyOffset"),
					() => Q("lbl.stickyOffset"),
					() => Q("tip.stickyUntil"),
					() => Q("lbl.stickyUntil")
				]), H("change", i, (e) => dt(`edit:${V(N).blockId}`, (t) => {
					t.sticky = {
						...t.sticky,
						offset: Math.max(0, Number(e.target.value) || 0)
					};
				})), G(e, t);
			};
			q(a, (e) => {
				V(N).sticky && e(o);
			}), B((e, t, a) => {
				Z(n, "title", e), ri(r, t), K(i, ` ${a ?? ""}`);
			}, [
				() => Q("tip.sticky"),
				() => !!V(N).sticky,
				() => Q("lbl.sticky")
			]), H("change", r, (e) => dt(`edit:${V(N).blockId}`, (t) => {
				t.sticky = e.target.checked ? {
					offset: 16,
					until: null
				} : null;
			})), G(e, t);
		};
		q(w, (e) => {
			V(ee) === "desktop" && e(T);
		});
		var E = z(w, 4), D = L(E), te = L(D, !0);
		M(D);
		var ne = z(D, 2), re = L(ne), ie = L(re, !0);
		M(re);
		var ae = z(re, 2), oe = (e) => {
			var t = As(), n = L(t), r = L(n, !0), i = z(r);
			Y(i), M(n);
			var a = z(n, 2), o = L(a, !0), s = z(o);
			Y(s), M(a);
			var c = z(a, 2), l = L(c, !0), u = z(l);
			Y(u), M(c);
			var d = z(c, 2), f = L(d, !0), p = z(f);
			Y(p), M(d);
			var m = z(d, 2), h = L(m, !0), g = z(h);
			Y(g), M(m);
			var _ = z(m, 2), v = L(_, !0), y = z(v);
			Y(y), M(_), M(t), B((e, t, n, a, c, d, _) => {
				K(r, e), X(i, V(N).frame.x), K(o, t), X(s, V(N).frame.y), K(l, n), X(u, V(N).frame.w), K(f, a), X(p, V(N).frame.h), Z(m, "title", c), K(h, d), X(g, V(N).frame.z ?? 1), K(v, _), X(y, V(N).frame.rot ?? 0);
			}, [
				() => Q("frame.x"),
				() => Q("frame.y"),
				() => Q("frame.w"),
				() => Q("frame.h"),
				() => Q("tip.frameZ"),
				() => Q("frame.z"),
				() => Q("frame.rot")
			]), H("change", i, (e) => pt("x", Number(e.target.value))), H("change", s, (e) => pt("y", Number(e.target.value))), H("change", u, (e) => pt("w", Number(e.target.value))), H("change", p, (e) => pt("h", Number(e.target.value))), H("change", g, (e) => pt("z", Number(e.target.value))), H("change", y, (e) => pt("rot", Number(e.target.value))), G(e, t);
		};
		q(ae, (e) => {
			V(ee) === "desktop" && e(oe);
		});
		var se = z(ae, 2), ce = L(se);
		Y(ce);
		var le = z(ce);
		M(se), M(ne), M(E), B((e, t, n, r, i, a, o, s) => {
			Z(h, "title", e), K(g, `${t ?? ""} `), Z(x, "title", n), K(S, `${r ?? ""} `), K(te, i), K(ie, a), Z(se, "title", o), ri(ce, V(N).decor), K(le, ` ${s ?? ""}`);
		}, [
			() => Q("tip.props.blockAnim"),
			() => Q("lbl.animIn"),
			() => Q("tip.props.blockHover"),
			() => Q("lbl.onHover"),
			() => Q("group.placement"),
			() => Q("hint.placement"),
			() => Q("tip.decor"),
			() => Q("lbl.decor")
		]), H("change", ce, (e) => yt(e.target.checked)), G(e, t);
	}, o = [
		["color", qa],
		["gradient", ao],
		["glow", oo],
		["image", jo],
		["bildegalleri", Fo],
		["grain", co]
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
		fit: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4\"/></svg>"
	}, l = [
		["lilla", Q("adminTheme.lilla")],
		["bronn", Q("adminTheme.bronn")],
		["gull", Q("adminTheme.gull")],
		["graa", Q("adminTheme.graa")],
		["nordlys", Q("adminTheme.nordlys")],
		["skumring", Q("adminTheme.skumring")],
		["glo", Q("adminTheme.glo")]
	], u = /* @__PURE__ */ F(en(localStorage.getItem("urd-admin-theme") ?? "graa"));
	yn(() => {
		document.documentElement.dataset.adminTheme = V(u), localStorage.setItem("urd-admin-theme", V(u)), f();
	});
	function f() {
		let e = getComputedStyle(document.documentElement), t = e.getPropertyValue("--urd-color-accent").trim();
		k?.sendAdminTheme({
			bg: e.getPropertyValue("--urd-color-bg").trim(),
			surface: e.getPropertyValue("--urd-color-surface").trim(),
			accent: t,
			text: e.getPropertyValue("--urd-color-text").trim(),
			"accent-text": p(t)
		});
	}
	function p(e) {
		return Ga(e) == null || (Ka(e, "#ffffff") ?? 0) >= (Ka(e, "#0b0e14") ?? 0) ? "#ffffff" : "#0b0e14";
	}
	let h = /* @__PURE__ */ F(null), g = /* @__PURE__ */ F(null), _ = /* @__PURE__ */ F(!1), v = /* @__PURE__ */ F(""), y = /* @__PURE__ */ F("info"), b = 0;
	function x(e, t = "info") {
		I(v, e, !0), I(y, t, !0);
		let n = ++b;
		t === "ok" && setTimeout(() => {
			b === n && (I(v, ""), I(y, "info"));
		}, 8e3);
	}
	function S() {
		x(Q("status.storageFull"), "error");
	}
	function C(e, t) {
		try {
			localStorage.setItem(e, t);
		} catch {
			S();
		}
	}
	let w = /* @__PURE__ */ F(null), T = /* @__PURE__ */ F(null), E = /* @__PURE__ */ F(en({
		size: 16,
		snap: !0
	})), D = /* @__PURE__ */ F(!0), ee = /* @__PURE__ */ F("desktop"), te = /* @__PURE__ */ F(null), ne = /* @__PURE__ */ F(0), re = /* @__PURE__ */ F(0), ie = /* @__PURE__ */ F(en(typeof window < "u" ? window.innerWidth : 1280)), ae = /* @__PURE__ */ F("fit"), oe = /* @__PURE__ */ F(1), se = /* @__PURE__ */ P(() => V(ee) === "mobile" ? 390 : V(ie)), ce = /* @__PURE__ */ P(() => V(ae) === "manual" ? V(oe) : Sa(V(ne), V(se), "fit"));
	function le(e) {
		let t = Math.min(400, Math.max(10, (Math.round(Math.round(V(ce) * 100) / 10) + e) * 10));
		I(oe, t / 100), I(ae, "manual");
	}
	let ue = /* @__PURE__ */ P(() => V(ce) > 0 ? V(re) / V(ce) : V(re)), de = /* @__PURE__ */ P(() => V(se) * V(ce)), fe = /* @__PURE__ */ P(() => V(re));
	yn(() => {
		let e = () => k?.sendCloseMenus();
		return document.addEventListener("pointerdown", e, !0), () => document.removeEventListener("pointerdown", e, !0);
	}), yn(() => {
		let e = V(ee);
		k?.sendViewport(e);
	}), yn(() => {
		let e = () => {
			I(ie, window.innerWidth, !0);
		};
		return window.addEventListener("resize", e), () => window.removeEventListener("resize", e);
	}), yn(() => {
		let e = V(te);
		if (!e || typeof ResizeObserver > "u") return;
		let t = () => {
			let t = e.getBoundingClientRect();
			I(ne, t.width, !0), I(re, t.height, !0);
		};
		t();
		let n = new ResizeObserver(t);
		return n.observe(e), () => n.disconnect();
	});
	let pe = /* @__PURE__ */ F(0);
	function me() {
		I(pe, O?.data.sections.filter((e) => e.responsive?.mobile?.attention?.needed).length ?? 0, !0);
	}
	function he(e, t) {
		!e || e.responsive?.mobile?.mode !== "manual" || e.responsive.mobile.attention?.needed || (e.responsive.mobile.attention = {
			needed: !0,
			reason: t,
			since: (/* @__PURE__ */ new Date()).toISOString()
		}, me(), k?.sendAttention(e.id, !0));
	}
	let O = null, ge = null, k = null, A = /* @__PURE__ */ F(null);
	function _e() {
		I(A, ge.data, !0), ge.replace(V(A));
	}
	function ve() {
		k?.sendSite(ze(V(A)));
	}
	let ye = /* @__PURE__ */ new Set(), be = () => V(A).pages.find((e) => e.id === V(g));
	function j() {
		let e = V(A)?.pages?.some((e) => !ye.has(e.id) && localStorage.getItem(`urd-draft-${e.id}`) !== null) ?? !1, t = ci?.hasDraft() || Object.values(li).some((e) => e.hasDraft());
		I(_, e || O?.hasDraft() && !ye.has(V(g)) || ge?.hasDraft() || Pi?.hasDraft() || t || !1, !0);
	}
	let xe = [], Se = [], Ce = null;
	function we() {
		return JSON.stringify({
			pageId: V(g),
			page: O.data,
			site: ge.data,
			samlingerIndex: fi ? ci.data : null,
			samlinger: fi ? Object.fromEntries(Object.entries(li).map(([e, t]) => [e, t.data])) : {},
			plugins: Pi?.data ?? null
		});
	}
	function Te(e) {
		e === Ce && (e.startsWith("edit:") || e.startsWith("grid:")) || (xe.push(we()), xe.length > 50 && xe.shift(), Se.length = 0, Ce = e);
	}
	function Ee(e) {
		let { pageId: t, page: n, site: r, samlingerIndex: i, samlinger: a, plugins: o } = JSON.parse(e);
		if (ge.replace(r), _e(), ge.save(), I(E, {
			snap: !0,
			...V(A).grid
		}, !0), ve(), De(i, a ?? {}), Oe(o), t && t !== V(g) && V(A).pages.some((e) => e.id === t)) {
			C(`urd-draft-${t}`, JSON.stringify(n)), mr(t, { keepHistory: !0 }), j();
			return;
		}
		O.replace(n), O.save(), j(), me(), ot(), jt(O.data.sections.find((e) => e.id === V(wt))), V(A).pages.some((e) => e.id === V(g)) ? k?.sendPage(V(g), O.data) : mr(V(A).pages[0].id, { keepHistory: !0 });
	}
	function De(e, t) {
		if (!(!ci || !e) && JSON.stringify({
			index: ci.data,
			samlinger: Object.fromEntries(Object.entries(li).map(([e, t]) => [e, t.data]))
		}) !== JSON.stringify({
			index: e,
			samlinger: t
		})) {
			ci.replace(e), ci.save();
			for (let e of Object.keys(li)) e in t || (localStorage.removeItem(`urd-draft-samling-${e}`), delete li[e]);
			for (let [e, n] of Object.entries(t)) {
				if (!li[e]) {
					let t = ui[e] ?? {
						schemaVersion: 1,
						id: e,
						name: n.name ?? e,
						kind: n.kind ?? "custom",
						entries: []
					};
					li[e] = ki(`urd-draft-samling-${e}`, () => t, S);
				}
				li[e].replace(n), li[e].save();
			}
			I(pi, [...e.samlinger ?? []], !0), V(hi) && !V(pi).includes(V(hi)) && I(hi, null), bi();
		}
	}
	function Oe(e) {
		!Pi || !e || JSON.stringify(Pi.data) !== JSON.stringify(e) && (Pi.replace(e), Pi.save(), ea(), oa());
	}
	function ke() {
		xe.length && (Se.push(we()), Ee(xe.pop()), Ce = null, x(Q("status.undone")));
	}
	function Ae() {
		Se.length && (xe.push(we()), Ee(Se.pop()), Ce = null, x(Q("status.redone")));
	}
	function je(e) {
		V(ct) && (e.target instanceof Element && e.target.closest(".block-menu") || I(ct, null));
	}
	function Ne(e) {
		if (e.key === "Escape" && V(ct)) {
			I(ct, null);
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
			].includes(t.type)) || !V(N) || V(ee) === "mobile") return;
			e.preventDefault(), k?.sendDuplicate();
			return;
		}
		if (t !== "z" && t !== "y") return;
		let n = e.target;
		n instanceof HTMLElement && (n.isContentEditable || n.tagName === "TEXTAREA" || n.tagName === "INPUT" && ![
			"number",
			"checkbox",
			"range",
			"color"
		].includes(n.type)) || (e.preventDefault(), t === "y" || e.shiftKey ? Ae() : ke());
	}
	async function Pe() {
		I(h, Aa(await (await fetch("/content/site.json")).json()), !0), ge = ki("urd-draft-site", () => V(h), S), (ge.data.schemaVersion ?? 1) > 1 && (console.warn(`Urd: site-utkastet har schemaVersion ${ge.data.schemaVersion} (motoren har 1) og forkastes`), ge.replace(structuredClone(V(h)))), ge.replace(Aa(ge.data)), ge.save(), _e(), I(E, {
			snap: !0,
			...V(A).grid
		}, !0), await mr(new URLSearchParams(location.search).get("page") ?? V(A).pages[0].id), await ta(), await yi(), await Kn(), V(T) && Jn(), V(A).site.setup === !0 && !localStorage.getItem("urd-setup-done") && (I(Be, V(A).site.title, !0), I(Ve, V(A).theme.tokens.color.accent, !0), I(He, V(A).theme.tokens.color.bg, !0), I(Re, !0));
	}
	let Fe = /* @__PURE__ */ F(null);
	function Ie({ title: e, lines: t = [], okLabel: n = Q("confirm.ok"), cancelLabel: r = Q("confirm.cancel") }) {
		return new Promise((i) => {
			I(Fe, {
				title: e,
				lines: t,
				okLabel: n,
				cancelLabel: r,
				resolve: i
			}, !0);
		});
	}
	function Le(e) {
		V(Fe)?.resolve(e), I(Fe, null);
	}
	let Re = /* @__PURE__ */ F(!1), Be = /* @__PURE__ */ F(""), Ve = /* @__PURE__ */ F("#7c5cff"), He = /* @__PURE__ */ F("#0b0e14");
	function Ge() {
		localStorage.setItem("urd-setup-done", "1"), I(Re, !1);
	}
	function Ke() {
		let e = V(Be).trim();
		e && (U("setup", () => {
			V(A).site.title = e, V(A).nav.logo = {
				type: "text",
				value: e
			}, V(A).theme.tokens.color.accent = V(Ve), V(A).theme.tokens.color.bg = V(He), delete V(A).site.setup;
		}), Ge(), x(Q("status.setupDone"), "ok"));
	}
	let qe = /* @__PURE__ */ F(null), Je = [
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
	], Ye = Object.fromEntries(Je.flat().map((e) => [e, Q(`panel.${e}`)])), Xe = [
		["se", "Davvisámegiella"],
		["en-GB", "English (UK)"],
		["nb", "Norsk bokmål"],
		["nn", "Norsk nynorsk"],
		["tr", "Türkçe"]
	], Ze = (e) => [...e].sort((e, t) => e[1].localeCompare(t[1]));
	function Qe(e, t) {
		let n = [];
		for (let r of e) for (let e of Ri[r]?.languages ?? []) e?.[t] === !0 && (typeof e.code != "string" || typeof e.name != "string" || !e.name || Xe.some(([t]) => t === e.code) || n.some(([t]) => t === e.code) || n.push([e.code, e.name]));
		return n;
	}
	function $e() {
		let e = Ze([...Xe, ...Qe(V(Wi), "admin")]);
		return tt === "auto" || e.some(([e]) => e === tt) ? e : [[tt, tt], ...e];
	}
	let et = () => Qe(V(Li)?.enabled ?? [], "site"), tt = localStorage.getItem("urd-admin-lang") ?? "auto";
	function nt(e) {
		e !== tt && (e === "auto" ? localStorage.removeItem("urd-admin-lang") : localStorage.setItem("urd-admin-lang", e), location.reload());
	}
	function rt(e) {
		I(qe, V(qe) === e ? null : e, !0), k?.sendShowGrid(V(qe) === "grid"), V(qe) === "history" && $n(), V(qe) === "update" && !V(or) && cr();
	}
	let N = /* @__PURE__ */ F(null);
	function at(e, t) {
		let n = O?.data.sections.find((t) => t.id === e);
		return {
			section: n,
			block: n?.blocks.find((e) => e.id === t)
		};
	}
	function ot() {
		if (!V(N)) return;
		let { block: e } = at(V(N).sectionId, V(N).blockId);
		if (!e) {
			I(N, null);
			return;
		}
		I(N, {
			sectionId: V(N).sectionId,
			blockId: V(N).blockId,
			type: e.type,
			decor: !!e.decor,
			props: JSON.parse(JSON.stringify(e.props)),
			frame: { ...e.frames.desktop },
			animation: e.animation ? JSON.parse(JSON.stringify(e.animation)) : null,
			hover: e.hover ? JSON.parse(JSON.stringify(e.hover)) : null,
			sticky: e.sticky ? JSON.parse(JSON.stringify(e.sticky)) : null
		}, !0);
	}
	function st(e) {
		if (I(ct, null), !e.blockId) {
			I(N, null);
			return;
		}
		I(N, {
			sectionId: e.sectionId,
			blockId: e.blockId
		}, !0), e.sectionId && I(wt, e.sectionId, !0), ot();
	}
	let ct = /* @__PURE__ */ F(null);
	function lt() {
		let e = O?.data.sections ?? [], t = e.findIndex((e) => e.id === V(N)?.sectionId);
		return [["", Q("opt.sticky.ownSection")], ...e.slice(t + 1).map((e, n) => [e.id, Q("opt.sticky.atSection", { n: t + 2 + n })])];
	}
	function ut(e) {
		if (st(e), !V(N)) return;
		let t = V(w)?.getBoundingClientRect();
		if (!t) return;
		let n = t.left + V(ce) * e.rect.right + 12;
		n + 300 > window.innerWidth - 8 && (n = Math.max(8, t.left + V(ce) * e.rect.left - 300 - 12));
		let r = window.innerHeight - Math.min(window.innerHeight * .7, 560) - 8, i = Math.min(Math.max(8, t.top + V(ce) * e.rect.top), Math.max(8, r));
		I(ct, {
			left: n,
			top: i
		}, !0);
	}
	function dt(e, t) {
		let { section: n, block: r } = at(V(N)?.sectionId, V(N)?.blockId);
		r && (Te(e), t(r, n), he(n, "blokk-endret"), O.save(), j(), k?.sendSection(V(g), n), ot());
	}
	function ft(e, t) {
		dt(`edit:${V(N).blockId}:${e}`, (n) => {
			n.props[e] = t;
		});
	}
	function pt(e, t) {
		Number.isFinite(t) && dt(`edit:frame-${V(N).blockId}:${e}`, (n) => {
			n.frames.desktop = {
				...n.frames.desktop,
				[e]: t
			};
		});
	}
	function mt(e) {
		dt(`edit:${V(N).blockId}:boxStyle`, (t) => {
			let n = {
				...t.props.boxStyle ?? {},
				...e
			};
			for (let e of Object.keys(n)) n[e] ?? delete n[e];
			Object.keys(n).length ? t.props.boxStyle = n : delete t.props.boxStyle;
		});
	}
	function ht(e, t) {
		dt(`edit:${V(N).blockId}:faq${e}`, (n) => {
			n.props.items[e] = {
				...n.props.items[e],
				...t
			};
		});
	}
	function gt() {
		dt("faq-item", (e) => {
			(e.props.items ??= []).push({
				q: Q("seed.faq.newQ"),
				a: Q("seed.faq.answer")
			});
		});
	}
	function _t(e) {
		dt("faq-item", (t) => {
			t.props.items.splice(e, 1);
		});
	}
	function vt(e, t) {
		let n = e + t;
		dt("faq-item", (t) => {
			n < 0 || n >= t.props.items.length || ([t.props.items[e], t.props.items[n]] = [t.props.items[n], t.props.items[e]]);
		});
	}
	function yt(e) {
		dt("decor", (t) => {
			t.decor = e;
		});
	}
	async function bt(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", t) try {
			let e = await dn(t);
			dt(`edit:${V(N).blockId}`, (n) => {
				n.props.src = e.dataUrl, n.props.alt = n.props.alt || Qi(t.name).replaceAll("-", " ");
			});
		} catch {
			x(Q("status.imageReadError"), "error");
		}
	}
	let xt = {
		text: Q("blocks.text"),
		button: Q("blocks.button"),
		image: Q("blocks.image"),
		shape: Q("blocks.shape"),
		video: Q("blocks.video"),
		icon: Q("blocks.icon"),
		galleri: Q("blocks.galleri"),
		faq: Q("blocks.faq")
	}, St = [
		["line", Q("shape.line")],
		["arrow", Q("shape.arrow")],
		["circle", Q("shape.circle")],
		["rect", Q("shape.rect")],
		["triangle", Q("shape.triangle")]
	], Ct = [
		["accent", Q("color.accent")],
		["text", Q("color.text")],
		["surface", Q("color.surface")],
		["bg", Q("color.bg")]
	], wt = /* @__PURE__ */ F(null), Tt = /* @__PURE__ */ F(null), Et = /* @__PURE__ */ F(""), Dt = /* @__PURE__ */ F(en([])), Ot = /* @__PURE__ */ F(null), kt = /* @__PURE__ */ F(null), At = /* @__PURE__ */ F("");
	function jt(e) {
		I(Tt, e?.grid ? { ...e.grid } : null, !0), I(Et, e?.size?.minHeight ?? "", !0), I(Dt, JSON.parse(JSON.stringify(e?.background?.layers ?? [])), !0), I(Ot, e?.animation ? JSON.parse(JSON.stringify(e.animation)) : null, !0), I(kt, e?.hover ? JSON.parse(JSON.stringify(e.hover)) : null, !0), I(At, e?.theme ?? "", !0);
	}
	let Mt = /* @__PURE__ */ F(null), Nt = en({});
	function Pt() {
		try {
			let e = ((V(w)?.contentDocument)?.querySelector(`.urd-section[data-section-id="${V(wt)}"]`))?.getBoundingClientRect();
			I(Mt, e && e.width ? {
				w: e.width,
				h: e.height
			} : null, !0);
		} catch {
			I(Mt, null);
		}
	}
	yn(() => {
		V(wt), V(Dt), requestAnimationFrame(() => requestAnimationFrame(Pt));
	}), yn(() => {
		let e = V(w);
		if (!e || typeof ResizeObserver > "u") return;
		let t = new ResizeObserver(() => Pt());
		return t.observe(e), () => t.disconnect();
	}), yn(() => {
		for (let e of V(Dt)) {
			let t = e?.props?.src;
			if (e?.type === "image" && t && !Nt[t]) {
				let e = new Image();
				e.onload = () => {
					Nt[t] = {
						w: e.naturalWidth,
						h: e.naturalHeight
					};
				}, e.src = t;
			}
		}
	});
	function Ft(e) {
		Lt("section-theme", (t) => {
			e ? t.theme = e : delete t.theme;
		});
	}
	function It(e) {
		I(wt, e.sectionId, !0), jt(O?.data.sections.find((t) => t.id === e.sectionId));
	}
	function Lt(e, t) {
		let n = O.data.sections.find((e) => e.id === V(wt));
		n && (Te(e), t(n), O.save(), j(), k?.sendSection(V(g), n), jt(n));
	}
	let Rt = /* @__PURE__ */ F("color");
	function zt(e, t) {
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
	function Bt(e, t) {
		e.mutate(e.keyPrefix, (e) => {
			e.background.layers.splice(t, 1), e.background.layers.length || delete e.background;
		});
	}
	function Vt(e, t, n) {
		let r = t + n;
		e.mutate(e.keyPrefix, (e) => {
			let n = e.background.layers;
			r < 0 || r >= n.length || ([n[t], n[r]] = [n[r], n[t]]);
		});
	}
	function Ht(e, t, n, r) {
		e.mutate(`edit:${e.keyPrefix}-${e.keyId}-${t}-${n}`, (e) => {
			e.background.layers[t].props[n] = r;
		});
	}
	function Ut(e, t, n, r = "xy") {
		e.preventDefault();
		let i = e.currentTarget;
		i.setPointerCapture?.(e.pointerId);
		let a = (e) => {
			let a = i.getBoundingClientRect();
			if (r.includes("x")) {
				let r = Math.min(1, Math.max(0, (e.clientX - a.left) / a.width));
				Ht(t, n, "x", Math.round(r * 100) / 100);
			}
			if (r.includes("y")) {
				let r = Math.min(1, Math.max(0, (e.clientY - a.top) / a.height));
				Ht(t, n, "y", Math.round(r * 100) / 100);
			}
		};
		a(e);
		let o = () => {
			i.removeEventListener("pointermove", a), i.removeEventListener("pointerup", o), i.removeEventListener("pointercancel", o);
		};
		i.addEventListener("pointermove", a), i.addEventListener("pointerup", o), i.addEventListener("pointercancel", o);
	}
	let Wt = (e) => Math.min(4, Math.max(.1, e));
	function Gt(e, t, n, r) {
		Ht(e, t, "size", Wt(Math.round((n + r) * 100) / 100));
	}
	function Kt(e, t, n) {
		let r = Number(n);
		Number.isFinite(r) && Ht(e, t, "size", Wt(r / 100));
	}
	function qt(e, t, n, r) {
		let i = Nt[n.props.src];
		if (!i?.w || !i?.h || !V(Mt)?.w || !V(Mt)?.h) return;
		let a = V(Mt).h * i.w / (V(Mt).w * i.h), o = r === "cover" ? Math.max(1, a) : Math.min(1, a);
		(n.props.fit === "flislegg" || n.props.fit === "repeat") && Ht(e, t, "fit", "vanlig"), Ht(e, t, "size", Wt(Math.round(o * 100) / 100));
	}
	function Jt(e) {
		return e.props;
	}
	function Yt(e, t, n, r) {
		e.mutate(n, (e) => {
			r(e.background.layers[t].props);
		});
	}
	function Xt(e, t, n, r) {
		Yt(e, t, `edit:${e.keyPrefix}-${e.keyId}-${t}-${n}`, (e) => {
			e[n] = r;
		});
	}
	let Zt = {
		linear: [
			["none", Q("common.none")],
			["pan", Q("opt.gradAnim.pan")],
			["pan-loop", Q("opt.gradAnim.panLoop")],
			["rotate", Q("opt.gradAnim.rotate")]
		],
		radial: [
			["none", Q("common.none")],
			["pulse", Q("opt.gradAnim.pulse")],
			["orbit", Q("opt.gradAnim.orbit")]
		]
	};
	function Qt(e, t, n) {
		Yt(e, t, e.keyPrefix, (e) => {
			e.kind = n, Zt[n].some(([t]) => t === (e.animation ?? "none")) || (e.animation = "none");
		});
	}
	function $t(e, t, n, r) {
		Yt(e, t, `edit:${e.keyPrefix}-${e.keyId}-${t}-stop${n}`, (e) => {
			e.stops[n] = {
				...e.stops[n],
				...r
			};
		});
	}
	function nn(e, t) {
		Yt(e, t, e.keyPrefix, (e) => {
			let t = Math.round(e.stops.reduce((e, t) => e + (Number(t.share) || 0), 0) / e.stops.length) || 50;
			e.stops.push({
				color: e.stops[e.stops.length - 1]?.color ?? "#ffffff",
				share: t
			});
		});
	}
	function rn(e, t, n) {
		Yt(e, t, e.keyPrefix, (e) => {
			e.stops.length > 2 && e.stops.splice(n, 1);
		});
	}
	function an(e, t, n, r) {
		Yt(e, t, e.keyPrefix, (e) => {
			let [t] = e.stops.splice(n, 1);
			e.stops.splice(r, 0, t);
		});
	}
	let on = /* @__PURE__ */ F(null);
	function sn(e, t, n, r) {
		if (t.button !== 0) return;
		t.preventDefault();
		let i = t.currentTarget.closest(".bg-layer"), a = t.currentTarget.closest(".grad-stop");
		I(on, {
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
			I(on, {
				...V(on),
				insert: n
			}, !0);
		}, u = () => {
			window.removeEventListener("pointermove", l), window.removeEventListener("pointerup", u), c.remove();
			let t = V(on);
			if (I(on, null), !t) return;
			let n = t.insert > t.from ? t.insert - 1 : t.insert;
			n !== t.from && an(e, t.layer, t.from, n);
		};
		window.addEventListener("pointermove", l), window.addEventListener("pointerup", u);
	}
	function cn(e, t, n) {
		e.mutate(e.keyPrefix, (e) => {
			e.background.layers[t].type !== n && (e.background.layers[t] = {
				type: n,
				version: s[n].version ?? 1,
				props: s[n].defaults()
			});
		});
	}
	async function ln(e, t) {
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
	async function un(e) {
		let t = await e.text(), n = Ji(t), r = Xi(t);
		if (!r) return n;
		let i = await ln(n.dataUrl, r);
		if (!i) return n;
		let a = Yi(t, i);
		if (a === t) return n;
		try {
			return Ji(a);
		} catch {
			return n;
		}
	}
	async function dn(e) {
		return e.type === "image/svg+xml" || /\.svg$/i.test(e.name || "") ? un(e) : Gi(e);
	}
	async function fn(e, t, n) {
		let r = n.target.files?.[0];
		if (n.target.value = "", r) try {
			Ht(e, t, "src", (await dn(r)).dataUrl);
		} catch {
			x(Q("status.imageReadError"), "error");
		}
	}
	async function pn(e, t, n) {
		let r = [...n.target.files ?? []];
		if (n.target.value = "", !r.length) return;
		x(Q("status.compressingImages"));
		let { images: i, failed: a, big: o } = await Hl(r);
		i.length && e.mutate(e.keyPrefix, (e) => {
			let n = e.background.layers[t].props;
			n.images ??= [], n.images.push(...i.map(({ src: e }) => ({
				src: e,
				x: .5,
				y: .5
			})));
		}), Ul(i.length, a, o);
	}
	function mn(e, t, n, r) {
		e.mutate(e.keyPrefix, (e) => {
			let i = e.background.layers[t].props.images, a = n + r;
			a < 0 || a >= i.length || ([i[n], i[a]] = [i[a], i[n]]);
		});
	}
	function hn(e, t, n) {
		e.mutate(e.keyPrefix, (e) => {
			e.background.layers[t].props.images.splice(n, 1);
		});
	}
	function gn(e, t, n, r, i) {
		e.mutate(`edit:${e.keyPrefix}g-${e.keyId}-${t}-${n}-${r}`, (e) => {
			e.background.layers[t].props.images[n][r] = i;
		});
	}
	function _n(e, t) {
		U(e, () => {
			V(A).nav.style ??= {}, t(V(A).nav.style);
		});
	}
	let vn = /* @__PURE__ */ P(() => ({
		mutate: Lt,
		keyPrefix: "bg",
		keyId: V(wt)
	})), bn = {
		mutate: _n,
		keyPrefix: "navbg",
		keyId: "nav"
	}, xn = {
		mutate: pa,
		keyPrefix: "footerbg",
		keyId: "footer"
	}, Sn = () => Object.entries(V(A)?.theme.tokens.color ?? {}).map(([e, t]) => [e, t]), Cn = [
		[
			"bg",
			Q("palette.bg"),
			Q("palette.bgShort")
		],
		[
			"surface",
			Q("palette.surface"),
			Q("palette.surfaceShort")
		],
		[
			"text",
			Q("palette.text"),
			Q("palette.textShort")
		],
		[
			"accent",
			Q("palette.accent"),
			Q("palette.accentShort")
		],
		[
			"accent-text",
			Q("palette.accentText"),
			Q("palette.accentTextShort")
		]
	], wn = /* @__PURE__ */ P(() => !!V(A)?.theme.alt), Tn = /* @__PURE__ */ P(() => V(A)?.theme.alt?.auto === !0), En = /* @__PURE__ */ P(() => V(A)?.theme.scheme === "dark" ? "dark" : "light"), Dn = /* @__PURE__ */ P(() => V(A)?.theme.tokens.color ?? {}), On = /* @__PURE__ */ P(() => ({
		...V(A)?.theme.tokens.color ?? {},
		...V(A)?.theme.alt?.tokens?.color ?? {}
	}));
	function kn(e) {
		return {
			type: e,
			version: zo[e].version,
			props: zo[e].defaults()
		};
	}
	let An = (e) => !!(e && zo[e.type]?.entrance), jn = [["", Q("common.none")], ...Object.entries(zo).filter(([, e]) => e.entrance).map(([e, t]) => [e, t.labelKey ? Q(t.labelKey) : t.label])], Mn = [["", Q("common.none")], ...Object.entries(zo).filter(([, e]) => !e.entrance).map(([e, t]) => [e, t.labelKey ? Q(t.labelKey) : t.label])];
	function Nn(e) {
		e.animation && !An(e.animation) && (e.hover ??= e.animation, e.animation = null);
	}
	function Pn(e) {
		dt(`edit:anim-${V(N).blockId}`, (t) => {
			Nn(t), t.animation = e ? kn(e) : null;
		}), V(N) && k?.sendDemoAnim(V(N).sectionId, V(N).blockId);
	}
	function Fn(e) {
		dt(`edit:hover-${V(N).blockId}`, (t) => {
			Nn(t), t.hover = e ? kn(e) : null;
		});
	}
	function In(e, t) {
		Number.isFinite(t) && (dt(`edit:anim-${V(N).blockId}:${e}`, (n) => {
			n.animation && (n.animation.props[e] = t);
		}), V(N) && k?.sendDemoAnim(V(N).sectionId, V(N).blockId));
	}
	function Ln(e) {
		Lt("section-anim", (t) => {
			Nn(t), t.animation = e ? kn(e) : null;
		}), k?.sendDemoAnim(V(wt));
	}
	function Rn(e) {
		Lt("section-hover", (t) => {
			Nn(t), t.hover = e ? kn(e) : null;
		});
	}
	function zn(e, t) {
		Number.isFinite(t) && (Lt("edit:section-anim", (n) => {
			n.animation && (n.animation.props[e] = t);
		}), k?.sendDemoAnim(V(wt)));
	}
	function Bn(e) {
		Lt("edit:section-anim", (t) => {
			t.animation && (t.animation.props.pattern = e);
		}), k?.sendDemoAnim(V(wt));
	}
	function Vn(e) {
		let t = O.data.sections.find((e) => e.id === V(wt));
		if (!t) return;
		let n = e.trim();
		if (!n) return;
		let r = /^\d+$/.test(n) ? `${n}px` : n;
		Te("section-size"), t.size = {
			...t.size,
			minHeight: r
		}, I(Et, r, !0), O.save(), j(), k?.sendSection(V(g), t);
	}
	function Hn() {
		return O.data.sections.find((e) => e.id === V(wt)) ?? O.data.sections[0];
	}
	function Un(e) {
		let t = O.data.sections.find((e) => e.id === V(wt));
		t && (Te("grid:section"), t.grid = e ? { ...ge.data.grid } : null, I(Tt, t.grid ? { ...t.grid } : null, !0), O.save(), j(), k?.sendSection(V(g), t), V(qe) === "grid" && k?.sendShowGrid(!0));
	}
	function Wn(e, t) {
		let n = O.data.sections.find((e) => e.id === V(wt));
		n?.grid && (Te("grid:section"), n.grid = {
			...n.grid,
			[e]: t
		}, I(Tt, { ...n.grid }, !0), O.save(), j(), k?.sendSection(V(g), n), V(qe) === "grid" && k?.sendShowGrid(!0));
	}
	function Gn(e, t) {
		Te("grid:site"), I(E, {
			...V(E),
			[e]: t
		}, !0), ge.data.grid = {
			...ge.data.grid,
			[e]: t
		}, ge.save(), j(), ve(), V(qe) === "grid" && k?.sendShowGrid(!0);
	}
	async function Kn() {
		try {
			let e = await fetch("/api/github/me");
			e.ok ? I(T, await e.json(), !0) : e.status !== 503 && I(T, null);
		} catch {
			I(T, null);
		}
	}
	let qn = null;
	async function Jn() {
		try {
			let e = await fetch("/api/github/latest");
			e.ok && (qn = (await e.json()).head ?? null);
		} catch {}
	}
	async function Yn(e) {
		if (!qn) return await Jn(), {
			ok: await Ie({
				title: Q("confirm.conflictUnknown.title"),
				lines: [Q("confirm.conflictUnknown.body"), Q("confirm.conflictUnknown.warning")],
				okLabel: Q("confirm.publishAnyway"),
				cancelLabel: Q("confirm.cancel")
			}),
			head: qn
		};
		let t = null;
		try {
			let e = await fetch(`/api/github/latest?base=${qn}`);
			e.ok && (t = await e.json().catch(() => null));
		} catch {}
		if (!t?.head) return {
			ok: !0,
			head: null
		};
		let n = t.head;
		if (n === qn) return {
			ok: !0,
			head: n
		};
		let r = new Set(e.map((e) => e.path)), i = t.truncated ? [Q("confirm.conflict.truncated")] : (t.changedFiles ?? []).filter((e) => r.has(e));
		return i.length === 0 ? {
			ok: !0,
			head: n
		} : {
			ok: await Ie({
				title: Q("confirm.conflict.title"),
				lines: [
					Q("confirm.conflict.intro"),
					...i.map((e) => `• ${e}`),
					Q("confirm.conflict.warning")
				],
				okLabel: Q("confirm.publishAnyway"),
				cancelLabel: Q("confirm.cancel")
			}),
			head: n
		};
	}
	let Xn = /* @__PURE__ */ F(null), Zn = /* @__PURE__ */ F(""), Qn = /* @__PURE__ */ F(!1);
	async function $n() {
		I(Zn, "");
		try {
			let e = await fetch("/api/github/history");
			e.ok ? I(Xn, (await e.json()).commits, !0) : e.status === 401 ? (I(Xn, [], !0), I(Zn, Q("status.historyLoginRequired"), !0)) : (I(Xn, [], !0), I(Zn, wi(await e.json().catch(() => null)) ?? Q("status.historyFetchFailed"), !0));
		} catch {
			I(Xn, [], !0), I(Zn, Q("status.historyUnavailable"), !0);
		}
	}
	let er = (() => {
		let e = {
			dateStyle: "short",
			timeStyle: "short"
		};
		try {
			return new Intl.DateTimeFormat(Ti(), e);
		} catch {
			return new Intl.DateTimeFormat(void 0, e);
		}
	})(), tr = !1;
	async function nr() {
		let e = V(Xn)?.[0];
		if (!(!e || V(Qn)) && await Ie({
			title: Q("confirm.revert.title"),
			lines: [`«${e.message}»`, Q("confirm.revert.body")],
			okLabel: Q("confirm.revert.ok"),
			cancelLabel: Q("confirm.cancel")
		})) {
			I(Qn, !0), x(Q("status.reverting"));
			try {
				let t = await fetch("/api/github/revert", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ expect: e.sha })
				});
				if (t.ok) {
					let { sha: e } = await t.json().catch(() => ({}));
					e ? qn = e : Jn(), tr = !0, x(Q("status.revertDone"), "ok"), rr();
				} else t.status === 409 ? x(Q("status.revertConflict"), "error") : x(wi(await t.json().catch(() => null)) ?? Q("status.revertFailed"), "error");
			} catch {
				x(Q("status.publishLayerUnreachable"), "error");
			}
			I(Qn, !1), $n();
		}
	}
	async function rr() {
		let e = ["/content/site.json", ...V(A).pages.map((e) => `/${e.file}`)], t = async () => {
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
				x(Q("status.revertDeployed"), "ok");
				for (let e of Object.keys(localStorage).filter((e) => e.startsWith("urd-draft-"))) localStorage.removeItem(e);
				await new Promise((e) => setTimeout(e, 800)), location.reload();
				return;
			}
		}
		x(Q("status.revertDeployTimeout"), "error");
	}
	let ir = /* @__PURE__ */ F(null), ar = /* @__PURE__ */ F(null), or = /* @__PURE__ */ F(!1), sr = /* @__PURE__ */ F(en(/* @__PURE__ */ new Set()));
	async function cr() {
		I(or, !0), I(ar, null), I(ir, null);
		try {
			let e = await fetch("/api/github/update"), t = await e.json().catch(() => null);
			e.ok ? (I(ir, t, !0), I(sr, /* @__PURE__ */ new Set(), !0)) : I(ar, wi(t) ?? Q("update.checkFailed"), !0);
		} catch {
			I(ar, Q("status.publishLayerUnreachable"), !0);
		}
		I(or, !1);
	}
	function lr(e) {
		let t = new Set(V(sr));
		t.has(e) ? t.delete(e) : t.add(e), I(sr, t, !0);
	}
	async function ur() {
		if (!V(ir) || V(ir).upToDate || V(or)) return;
		let e = [...V(sr)], t = V(ir).changes.filter((e) => !V(sr).has(e.path)), n = t.filter((e) => e.atom && e.conflict);
		if (await Ie({
			title: Q("confirm.update.title"),
			lines: [Q("confirm.update.body", {
				target: V(ir).target,
				writes: t.filter((e) => e.action === "write").length,
				deletes: t.filter((e) => e.action === "delete").length
			}), ...n.length > 0 ? [Q("confirm.update.warnEdited", { paths: n.map((e) => e.path).join(", ") })] : []],
			okLabel: Q("confirm.update.ok"),
			cancelLabel: Q("confirm.cancel")
		})) {
			I(or, !0), x(Q("update.running", { target: V(ir).target }));
			try {
				let t = await fetch("/api/github/update", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({
						to: V(ir).target,
						expect: V(ir).head,
						skip: e
					})
				}), n = await t.json().catch(() => null);
				t.ok ? (x(Q("update.committed", { target: V(ir).target }), "ok"), await dr(V(ir).target.replace(/^v/, ""))) : t.status === 409 ? (x(wi(n) ?? Q("update.checkFailed"), "error"), await cr()) : x(wi(n) ?? Q("update.failed"), "error");
			} catch {
				x(Q("status.publishLayerUnreachable"), "error");
			}
			I(or, !1);
		}
	}
	async function dr(e) {
		for (let t = 0; t < 18; t++) {
			await new Promise((e) => setTimeout(e, 1e4));
			try {
				if ((await (await fetch("/urd.json", { cache: "no-store" })).json())?.engine === e) {
					x(Q("update.deployed"), "ok"), await new Promise((e) => setTimeout(e, 800)), location.reload();
					return;
				}
			} catch {}
		}
		x(Q("update.deployTimeout"), "error");
	}
	let fr = null;
	function pr(e) {
		return {
			schemaVersion: 1,
			meta: {
				id: e.id,
				title: e.title
			},
			sections: [{
				id: La("sec"),
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
	async function mr(e, { keepHistory: t = !1 } = {}) {
		I(g, e, !0), fr = (async () => {
			let n = be(), r = null;
			try {
				let e = await fetch(`/${n.file}`);
				e.ok && (r = ja(await e.json(), ge.data));
			} catch {}
			r ? ye.delete(e) : r = pr(n), O = ki(`urd-draft-${e}`, () => r, S), (O.data.schemaVersion ?? 1) > 1 && (console.warn(`Urd: utkastet for '${e}' har schemaVersion ${O.data.schemaVersion} (motoren har 1) og forkastes`), O.replace(structuredClone(r))), O.replace(ja(O.data, ge.data)), O.save(), t || (Ce = null), I(wt, null), I(Tt, null), j(), me(), I(v, "");
		})(), await fr;
	}
	function hr() {
		k?.destroy(), V(w)?.contentDocument?.addEventListener("pointerdown", () => {
			V(ct) && I(ct, null);
		}, !0), k = ba(V(w), {
			onEdit: yl,
			onMove: bl,
			onGrow: xl,
			onDelete: jl,
			onAddSection: El,
			onMoveSection: Dl,
			onDeleteSection: Ol,
			onSectionSize: kl,
			onUndo: (e) => e.redo ? Ae() : ke(),
			onSelectSection: It,
			onSelectBlock: st,
			onBlockMenu: ut,
			onReady: gr,
			onNavigate: Cr,
			onAddBlock: (e) => Fl(e.sectionId, e.block),
			onAddBlocks: (e) => Il(e.sectionId, e.blocks, e.minBottom, e.moves),
			onRequestBlock: Bl,
			onMoveBlockSection: Al,
			onMobileManual: Sl,
			onMobileAuto: Cl,
			onReviewDone: wl,
			onBlockFlag: Tl,
			onCollectionEdit: Ci,
			onPluginBlocks: (e) => {
				I(Rl, e.blocks ?? [], !0);
			},
			onNavWidth: (e) => U("edit:nav-width", () => {
				V(A).nav.style ??= {}, V(A).nav.style.width = e.width;
			})
		});
	}
	async function gr() {
		await fr, await Ii, k?.sendPlugins(ze(V(Li))?.enabled ?? []), k?.sendViewport(V(ee)), xi(), ge.hasDraft() && ve();
		let e = !V(h).pages.some((e) => e.id === V(g));
		(O.hasDraft() || e) && k?.sendPage(V(g), O.data), V(D) || k?.sendChrome(!1), V(qe) === "grid" && k?.sendShowGrid(!0), V(_r) && k?.sendShowGuides(!0), f();
	}
	let _r = /* @__PURE__ */ F(localStorage.getItem("urd-guides") === "1"), vr = /* @__PURE__ */ F(!1), br = /* @__PURE__ */ F(null);
	yn(() => {
		if (!V(vr)) return;
		let e = (e) => {
			V(br)?.contains(e.target) || I(vr, !1);
		}, t = (e) => {
			e.key === "Escape" && I(vr, !1);
		}, n = () => {
			I(vr, !1);
		};
		return document.addEventListener("pointerdown", e, !0), document.addEventListener("keydown", t), window.addEventListener("blur", n), () => {
			document.removeEventListener("pointerdown", e, !0), document.removeEventListener("keydown", t), window.removeEventListener("blur", n);
		};
	});
	function Sr() {
		I(_r, !V(_r)), localStorage.setItem("urd-guides", V(_r) ? "1" : "0"), k?.sendShowGuides(V(_r));
	}
	function Cr(e) {
		let t = e.path.replace(/\/$/, "") || "/", n = V(A).pages.find((e) => e.path === t);
		n && n.id !== V(g) && mr(n.id);
	}
	function U(e, t) {
		Te(e), t(), ge.save(), j(), ve();
	}
	let wr = /* @__PURE__ */ F(""), Tr = [
		"admin",
		"api",
		"assets",
		"content",
		"media",
		"plugins",
		"functions",
		"readme"
	];
	function Er(e, t = null) {
		return e ? Tr.includes(e) ? Q("error.reservedName", { slug: e }) : V(A).pages.some((n) => n.id !== t && (n.path === `/${e}` || n.id === e)) ? Q("error.pageExists") : null : Q("error.pageNeedsName");
	}
	function Dr() {
		let e = V(wr).trim(), t = Qi(e), n = Er(t);
		if (n) {
			x(n, "error");
			return;
		}
		U("pages", () => {
			V(A).pages.push({
				id: t,
				title: e,
				path: `/${t}`,
				file: `content/pages/${t}.json`
			}), V(A).nav.items.push({
				label: e,
				page: t
			});
		}), C(`urd-draft-${t}`, JSON.stringify(pr({
			id: t,
			title: e
		}))), j(), I(wr, ""), mr(t);
	}
	function W(e, t) {
		let n = t.trim();
		if (!n || n === e.title) return;
		let r = e.title;
		U("pages", () => {
			e.title = n;
			for (let t of V(A).nav.items) t.page === e.id && t.label === r && (t.label = n);
		}), e.id === V(g) ? (O.data.meta.title = n, O.save(), j(), k?.sendPage(V(g), O.data)) : Ar(e, (e) => {
			e.meta.title = n;
		});
	}
	async function Ar(e, t) {
		let n = `urd-draft-${e.id}`, r = null, i = localStorage.getItem(n);
		if (i) try {
			r = JSON.parse(i);
		} catch {}
		if (!r) try {
			let t = await fetch(`/${e.file}`);
			t.ok && (r = ja(await t.json(), ge.data));
		} catch {}
		r ||= pr(e), t(r), C(n, JSON.stringify(r)), j();
	}
	function jr(e, t) {
		let n = Qi(t);
		if (e.path === "/" || `/${n}` === e.path) return;
		let r = Er(n, e.id);
		if (r) {
			x(r, "error");
			return;
		}
		U("pages", () => {
			e.path = `/${n}`;
		});
	}
	function Mr(e) {
		e.path !== "/" && (U("pages", () => {
			V(A).pages = V(A).pages.filter((t) => t.id !== e.id), V(A).nav.items = V(A).nav.items.filter((t) => t.page !== e.id || t.children);
			for (let t of V(A).nav.items) t.page === e.id && delete t.page, t.children && (t.children = t.children.filter((t) => t.page !== e.id), t.children.length === 0 && delete t.children);
			V(A).nav.items = V(A).nav.items.filter((e) => e.page || e.href || e.children);
		}), e.id === V(g) && mr(V(A).pages[0].id), x(Q("status.pageRemoved")));
	}
	function Nr(e) {
		U("edit:nav-logo", () => {
			V(A).nav.logo = {
				type: "text",
				value: "",
				...V(A).nav.logo,
				...e
			};
		});
	}
	function Pr(e) {
		U("nav", () => {
			V(A).nav.logo ??= {
				type: "text",
				value: V(A).site.title
			};
			let t = V(A).nav.logo, n = t.type === "image";
			e === "both" ? (n && (t.image = t.value, t.value = V(A).site.title), t.image ??= "", t.size ??= 32) : e === "image" ? (n || (t.value = t.image ?? ""), delete t.image, t.size ??= 32) : (n && (t.value = V(A).site.title), delete t.image), t.type = e;
		});
	}
	async function Ir(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", t) try {
			let e = await dn(t);
			U("nav", () => {
				let t = V(A).nav.logo;
				t.type === "both" ? t.image = e.dataUrl : t.value = e.dataUrl;
			});
		} catch {
			x(Q("status.imageReadErrorSvg"), "error");
		}
	}
	let Lr = /* @__PURE__ */ F(null);
	async function Rr(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", !t) return;
		if (t.type === "image/svg+xml" || /\.svg$/i.test(t.name || "")) {
			try {
				let e = await un(t);
				I(Lr, e.dataUrl, !0);
			} catch {
				x(Q("status.imageReadErrorSvg"), "error");
			}
			return;
		}
		let n = new FileReader();
		n.onload = () => {
			I(Lr, String(n.result), !0);
		}, n.onerror = () => x(Q("status.imageReadError"), "error"), n.readAsDataURL(t);
	}
	function Br(e) {
		U("edit:site-icon", () => {
			V(A).site.icon = e;
		}), I(Lr, null);
	}
	function Vr() {
		U("edit:site-icon", () => {
			delete V(A).site.icon;
		});
	}
	function Hr(e) {
		U("edit:site-title", () => {
			V(A).site.title = e;
		});
	}
	function Ur(e) {
		U("edit:site-desc", () => {
			V(A).site.description = e;
		});
	}
	function Wr() {
		let e = V(A).site.lang ?? "no";
		return e === "no" ? "nb" : e;
	}
	function Gr() {
		let e = Wr(), t = Ze([...Xe, ...et()]);
		return [...t.some(([t]) => t === e) ? [] : [[e, e]], ...t];
	}
	function Kr(e) {
		U("site", () => {
			V(A).site.lang = e;
		});
	}
	let qr = /^(?:data:image\/[\w.+-]+;base64,[A-Za-z0-9+/=]+|\/(?!\/)[\w%./-]*)$/;
	yn(() => {
		if (!V(A)?.site) return;
		let e = V(A).site.icon, t = document.querySelector("link[rel=\"icon\"]");
		if (t) {
			if (typeof e != "string" || !e) {
				t.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230b0e14'/%3E%3Cpath d='M19.2 51.2V16l25.6 10.4V51.2' fill='none' stroke='%2315b39a' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";
				return;
			}
			qr.test(e) && (t.href = e);
		}
	});
	function Jr(e) {
		U("nav", () => {
			V(A).nav.layout = e;
		});
	}
	function Yr(e, t) {
		U(`edit:nav-style-${e}`, () => {
			V(A).nav.style ??= {}, t === void 0 ? delete V(A).nav.style[e] : V(A).nav.style[e] = t;
		});
	}
	let Zr = /* @__PURE__ */ P(() => V(A)?.nav?.variant === "side-left" || V(A)?.nav?.variant === "side-right"), $r = /* @__PURE__ */ P(() => [
		"floating",
		"floating-square",
		"floating-tab"
	].includes(V(A)?.nav?.variant)), ei = {
		underline: [Q("hoverColor.underline.label"), Q("hoverColor.underline.title")],
		pill: [Q("hoverColor.pill.label"), Q("hoverColor.pill.title")],
		lift: [Q("hoverColor.lift.label"), Q("hoverColor.lift.title")]
	}, ti = /* @__PURE__ */ P(() => ei[V(A)?.nav?.style?.hover] ?? null);
	function ni(e) {
		U("nav", () => {
			e === "bar" ? delete V(A).nav.variant : V(A).nav.variant = e;
		});
	}
	function ii(e) {
		U("nav", () => {
			V(A).nav.style ??= {}, e ? V(A).nav.style.glow = !0 : delete V(A).nav.style.glow;
		});
	}
	function ai(e) {
		U("nav", () => {
			V(A).nav.style ??= {}, e ? delete V(A).nav.style.topGap : V(A).nav.style.topGap = !1;
		});
	}
	function oi(e) {
		U("nav", () => {
			V(A).nav.style ??= {}, e === "standard" ? delete V(A).nav.style.hover : V(A).nav.style.hover = e;
		});
	}
	let ci = null, li = {}, ui = {}, fi = !1, pi = /* @__PURE__ */ F(en([])), mi = /* @__PURE__ */ F(en({})), hi = /* @__PURE__ */ F(null), gi = /* @__PURE__ */ F(""), _i = /* @__PURE__ */ F("news"), vi = [
		["news", Q("collectionKind.news")],
		["notices", Q("collectionKind.notices")],
		["publications", Q("collectionKind.publications")],
		["custom", Q("collectionKind.custom")]
	];
	async function yi() {
		let e = {
			version: 1,
			samlinger: []
		};
		try {
			e = await (await fetch("/content/samlinger.json")).json();
		} catch {}
		ci = ki("urd-draft-samlinger", () => e, S), I(pi, [...ci.data.samlinger ?? []], !0);
		for (let e of V(pi)) {
			let t = null;
			try {
				t = await (await fetch(`/content/samlinger/${e}.json`)).json();
			} catch {}
			t ??= {
				schemaVersion: 1,
				id: e,
				name: e,
				kind: "custom",
				entries: []
			}, ui[e] = t, li[e] = ki(`urd-draft-samling-${e}`, () => t, S);
		}
		fi = !0, bi();
	}
	function bi(e = !0) {
		let t = {};
		for (let e of V(pi)) li[e] && (t[e] = JSON.parse(JSON.stringify(li[e].data)));
		I(mi, t, !0), e && xi();
	}
	function xi() {
		k?.sendCollections(ze(V(mi)) ?? {});
	}
	function Si(e, t, n, r = !0) {
		let i = li[e];
		i && (Te(t), n(i.data), i.save(), j(), bi(r));
	}
	function Ci(e) {
		let { collection: t, entryId: n, field: r, value: i } = e;
		[
			"title",
			"text",
			"image",
			"imageAlt",
			"imageStyle"
		].includes(r) && (r === "title" && !String(i ?? "").replace(/<[^>]*>/g, "").trim() || Si(t, `edit:samling:${t}:${n}:${r}`, (e) => {
			let t = e.entries.find((e) => e.id === n);
			t && (i === "" && r !== "title" ? delete t[r] : t[r] = i);
		}, r === "image"));
	}
	function Ei() {
		let e = V(gi).trim();
		if (!e) return;
		let t = Qi(e);
		if (!t || V(pi).includes(t)) {
			x(Q(t ? "status.collectionExists" : "status.invalidName"), "error");
			return;
		}
		Te("samlinger");
		let n = {
			schemaVersion: 1,
			id: t,
			name: e,
			kind: V(_i),
			entries: []
		};
		ui[t] = {
			...n,
			entries: []
		}, li[t] = ki(`urd-draft-samling-${t}`, () => ({
			...n,
			entries: []
		}), S), li[t].replace(n), li[t].save(), ci.data.samlinger = [...V(pi), t], ci.save(), I(pi, [...V(pi), t], !0), I(hi, t, !0), I(gi, ""), j(), bi();
	}
	function Di(e) {
		Te("samlinger"), localStorage.removeItem(`urd-draft-samling-${e}`), delete li[e], ci.data.samlinger = V(pi).filter((t) => t !== e), ci.save(), I(pi, V(pi).filter((t) => t !== e), !0), V(hi) === e && I(hi, null), j(), bi();
	}
	function Oi(e) {
		Si(e, `samling:${e}:add-entry`, (e) => {
			e.entries.unshift({
				id: La("innslag"),
				title: Q("seed.newEntry"),
				date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
				text: ""
			});
		});
	}
	function Ai(e, t, n, r) {
		Si(e, `edit:samling:${e}:${t}:${n}`, (e) => {
			let i = e.entries.find((e) => e.id === t);
			i && (r === "" && n !== "title" ? delete i[n] : i[n] = r);
		});
	}
	function ji(e, t, n) {
		Si(e, `samling:${e}:move-entry`, (e) => {
			let r = t + n;
			r < 0 || r >= e.entries.length || ([e.entries[t], e.entries[r]] = [e.entries[r], e.entries[t]]);
		});
	}
	function Mi(e, t) {
		Si(e, `samling:${e}:remove-entry`, (e) => {
			e.entries = e.entries.filter((e) => e.id !== t);
		});
	}
	async function Ni(e, t, n) {
		let r = n.target.files?.[0];
		n.target.value = "", r && Ai(e, t, "image", (await dn(r)).dataUrl);
	}
	let Pi = null, Fi, Ii = new Promise((e) => {
		Fi = e;
	}), Li = /* @__PURE__ */ F(null), Ri = en({}), zi = /* @__PURE__ */ F("0.0.0"), Bi = /* @__PURE__ */ F(""), Hi = /* @__PURE__ */ F(""), Ui = /* @__PURE__ */ F(en([])), Wi = /* @__PURE__ */ F(en([])), Ki = /* @__PURE__ */ F("pending"), qi = () => [.../* @__PURE__ */ new Set([...V(Li)?.enabled ?? [], ...V(Li)?.disabled ?? []])];
	function ea() {
		I(Li, JSON.parse(JSON.stringify(Pi.data)), !0);
	}
	async function ta() {
		let e = {
			version: 1,
			enabled: []
		};
		try {
			e = await (await fetch("/plugins/plugins.json")).json();
		} catch {}
		I(Wi, e.enabled ?? [], !0), Pi = ki("urd-draft-plugins", () => e, S), ea();
		try {
			I(zi, (await (await fetch("/urd.json")).json()).engine ?? "0.0.0", !0);
		} catch {}
		for (let e of qi()) ia(e);
		na(), Fi(), k?.sendPlugins(ze(V(Li))?.enabled ?? []);
	}
	async function na() {
		try {
			let e = await fetch("/api/github/plugins");
			if (!e.ok) {
				ra();
				return;
			}
			let { plugins: t } = await e.json();
			localStorage.setItem("urd-plugins-found", JSON.stringify(t ?? [])), I(Ui, (t ?? []).filter((e) => !qi().includes(e)), !0);
			for (let e of V(Ui)) ia(e);
			I(Ki, "ok");
		} catch {
			ra();
		}
	}
	function ra() {
		try {
			let e = JSON.parse(localStorage.getItem("urd-plugins-found") ?? "[]");
			if (Array.isArray(e) && e.length) {
				I(Ui, e.filter((e) => !qi().includes(e)), !0);
				for (let e of V(Ui)) ia(e);
				I(Ki, "ok");
				return;
			}
		} catch {}
		I(Ki, "unavailable");
	}
	async function ia(e) {
		try {
			let t = await (await fetch(`/plugins/${e}/plugin.json`)).json(), n = Ia(t);
			Ri[e] = {
				...t,
				errors: n,
				satisfied: n.length === 0 && Pa(V(zi), t.requiresEngine)
			};
		} catch {
			Ri[e] = {
				name: e,
				errors: [Q("plugin.manifestNotFound", { id: e })],
				satisfied: !1
			};
		}
	}
	function aa(e, t) {
		Te("plugins");
		let n = Pi.data;
		n.enabled = (n.enabled ?? []).filter((t) => t !== e), n.disabled = (n.disabled ?? []).filter((t) => t !== e), t ? n.enabled.push(e) : n.disabled.push(e), Pi.save(), j(), ea(), oa();
	}
	function oa() {
		V(w) && (V(w).src = V(w).src);
	}
	function ua(e) {
		Te("plugins");
		let t = Pi.data;
		t.enabled = (t.enabled ?? []).filter((t) => t !== e), t.disabled = (t.disabled ?? []).filter((t) => t !== e), Pi.save(), j(), ea(), oa();
	}
	async function da() {
		I(Hi, "");
		let e = V(Bi).trim().toLowerCase();
		if (!/^[a-z0-9][a-z0-9-]*$/.test(e)) {
			I(Hi, Q("plugin.invalidId"), !0);
			return;
		}
		if (qi().includes(e)) {
			I(Hi, Q("plugin.alreadyListed"), !0);
			return;
		}
		if (await ia(e), Ri[e].errors.length) {
			I(Hi, Q("plugin.invalidManifest", { errors: Ri[e].errors.join("; ") }), !0);
			return;
		}
		aa(e, !0), I(Bi, "");
	}
	function fa(e) {
		I(Ui, V(Ui).filter((t) => t !== e), !0), aa(e, !0);
	}
	function pa(e, t) {
		U(e, () => {
			V(A).footer ??= {
				version: 1,
				show: !1,
				text: "",
				align: "center"
			}, t(V(A).footer);
		});
	}
	function ma(e, t) {
		pa(`edit:footer-brand-${e}`, (n) => {
			n.brand ??= {}, t.trim() ? n.brand[e] = t : delete n.brand[e], !n.brand.title && !n.brand.tagline && !n.brand.logo && delete n.brand;
		});
	}
	function ha(e) {
		pa("footer", (t) => {
			t.brand ??= {}, e === "image" || e === "both" ? t.brand.mode = e : delete t.brand.mode;
		});
	}
	async function ga(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", t) try {
			let e = await dn(t);
			pa("footer", (t) => {
				t.brand ??= {}, t.brand.logo = e.dataUrl, t.brand.mode || (t.brand.mode = "both");
			});
		} catch {
			x(Q("status.imageReadErrorSvg"), "error");
		}
	}
	function _a() {
		pa("footer", (e) => {
			e.brand && (delete e.brand.logo, delete e.brand.mode, delete e.brand.logoHeight, !e.brand.title && !e.brand.tagline && delete e.brand);
		});
	}
	function va(e) {
		pa("edit:footer-logo-height", (t) => {
			t.brand ??= {};
			let n = Number(e);
			Number.isFinite(n) && (t.brand.logoHeight = Math.min(160, Math.max(16, Math.round(n))));
		});
	}
	function xa(e) {
		pa("edit:footer-copyright", (t) => {
			e.trim() ? t.copyright = e : delete t.copyright;
		});
	}
	let Ca = [
		{
			id: "minimal",
			label: Q("footerTemplate.minimal"),
			thumb: {
				center: !0,
				social: 2,
				baselineLinks: 1
			}
		},
		{
			id: "sentrert",
			label: Q("footerTemplate.sentrert"),
			thumb: {
				center: !0,
				row: !0,
				social: 3
			}
		},
		{
			id: "kolonner",
			label: Q("footerTemplate.kolonner"),
			thumb: {
				tag: !0,
				cols: 3,
				social: 3,
				baselineLinks: 2
			}
		},
		{
			id: "sitemap",
			label: Q("footerTemplate.sitemap"),
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
			label: Q("footerTemplate.nyhetsbrev"),
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
			label: Q("footerTemplate.storcta"),
			thumb: {
				center: !0,
				bigcta: !0,
				baselineLinks: 2
			}
		},
		{
			id: "kontakt",
			label: Q("footerTemplate.kontakt"),
			thumb: {
				tag: !0,
				cols: 3,
				social: 2,
				baselineLinks: 1
			}
		},
		{
			id: "mega",
			label: Q("footerTemplate.mega"),
			thumb: {
				tag: !0,
				mega: !0,
				cols: 2,
				social: 4,
				baselineLinks: 2
			}
		}
	];
	function wa(e) {
		let t = Q("seed.orgName"), n = V(A).pages ?? [], r = (e) => n.slice(0, e).map((e) => ({
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
			baseline: [a(Q("seed.footer.privacy"), "#")]
		} : e === "sentrert" ? {
			align: "center",
			brand: { title: t },
			linkRow: r(5),
			social: i([
				"facebook",
				"instagram",
				"x"
			]),
			copyright: `${o} · ${Q("seed.footer.madeWith")}`
		} : e === "kolonner" ? {
			align: "left",
			brand: {
				title: t,
				tagline: Q("seed.footer.tagline1")
			},
			columns: [
				{
					title: Q("seed.footer.colPages"),
					links: r(4)
				},
				{
					title: Q("seed.footer.colCompany"),
					links: [
						a(Q("seed.footer.about"), "#"),
						a(Q("seed.join"), "#"),
						a(Q("seed.footer.press"), "#")
					]
				},
				{
					title: Q("seed.footer.colResources"),
					links: [
						a(Q("seed.footer.bylaws"), "#"),
						a(Q("seed.footer.privacy"), "#"),
						a(Q("seed.footer.contact"), "#")
					]
				}
			],
			social: i([
				"facebook",
				"instagram",
				"linkedin"
			]),
			copyright: o,
			baseline: [a(Q("seed.footer.privacy"), "#"), a(Q("seed.footer.terms"), "#")]
		} : e === "sitemap" ? {
			align: "left",
			brand: {
				title: t,
				tagline: Q("seed.footer.tagline2")
			},
			columns: [
				{
					title: Q("seed.footer.colExplore"),
					links: [
						a(Q("seed.footer.home"), "#"),
						a(Q("seed.footer.events"), "#"),
						a(Q("seed.footer.gallery"), "#"),
						a(Q("seed.footer.blog"), "#")
					]
				},
				{
					title: Q("seed.footer.colCompany"),
					links: [
						a(Q("seed.footer.about"), "#"),
						a(Q("seed.footer.history"), "#"),
						a(Q("seed.footer.press"), "#"),
						a(Q("seed.footer.contact"), "#")
					]
				},
				{
					title: Q("seed.footer.colSupport"),
					links: [
						a(Q("seed.join"), "#"),
						a(Q("seed.footer.faq"), "#"),
						a(Q("seed.footer.help"), "#")
					]
				},
				{
					title: Q("seed.footer.colLegal"),
					links: [
						a(Q("seed.footer.privacy"), "#"),
						a(Q("seed.footer.terms"), "#"),
						a(Q("seed.footer.bylaws"), "#")
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
				a(Q("seed.footer.privacy"), "#"),
				a(Q("seed.footer.terms"), "#"),
				a(Q("seed.footer.cookies"), "#")
			]
		} : e === "nyhetsbrev" ? {
			align: "left",
			brand: {
				title: t,
				tagline: Q("seed.footer.tagline3")
			},
			cta: {
				kind: "newsletter",
				heading: Q("seed.footer.newsletterHeading"),
				label: Q("seed.footer.newsletterButton"),
				recipient: Q("seed.email"),
				success: Q("seed.footer.newsletterSuccess")
			},
			columns: [{
				title: Q("seed.footer.colPages"),
				links: r(4)
			}, {
				title: Q("seed.footer.colMore"),
				links: [
					a(Q("seed.footer.about"), "#"),
					a(Q("seed.footer.contact"), "#"),
					a(Q("seed.footer.privacy"), "#")
				]
			}],
			social: i(["facebook", "instagram"]),
			copyright: o,
			baseline: [a(Q("seed.footer.privacy"), "#")]
		} : e === "storcta" ? {
			align: "center",
			cta: {
				kind: "button",
				big: !0,
				heading: Q("seed.footer.ctaHeading"),
				sub: Q("seed.footer.ctaSub"),
				label: Q("seed.join"),
				href: "#"
			},
			linkRow: r(4),
			social: i([
				"facebook",
				"instagram",
				"x"
			]),
			copyright: o,
			baseline: [a(Q("seed.footer.privacy"), "#"), a(Q("seed.footer.terms"), "#")]
		} : e === "kontakt" ? {
			align: "left",
			brand: {
				title: t,
				tagline: Q("seed.footer.tagline4")
			},
			columns: [
				{
					title: Q("seed.footer.colVisit"),
					links: [
						a(Q("seed.footer.address"), "#"),
						a(Q("seed.email"), "mailto:post@dinforening.no"),
						a("+47 22 00 00 00", "tel:+4722000000")
					]
				},
				{
					title: Q("seed.footer.colHours"),
					links: [a(Q("seed.footer.hours1"), "#"), a(Q("seed.footer.hours2"), "#")]
				},
				{
					title: Q("seed.footer.colPages"),
					links: r(4)
				}
			],
			social: i(["facebook", "instagram"]),
			copyright: o,
			baseline: [a(Q("seed.footer.privacy"), "#")]
		} : {
			align: "left",
			brand: {
				title: t,
				tagline: Q("seed.footer.tagline5")
			},
			columns: [{
				title: Q("seed.footer.colExplore"),
				links: r(4)
			}, {
				title: Q("seed.footer.colFollow"),
				links: [a(Q("seed.footer.newsletter"), "#"), a(Q("seed.email"), "mailto:post@dinforening.no")]
			}],
			social: i([
				"facebook",
				"instagram",
				"linkedin",
				"youtube"
			]),
			copyright: o,
			baseline: [a(Q("seed.footer.privacy"), "#"), a(Q("seed.footer.madeWith"), "#")],
			background: {
				version: 1,
				layers: [{
					type: "glow",
					version: oo.version ?? 1,
					props: {
						...oo.defaults(),
						color: "accent",
						x: .12,
						y: 0,
						radius: .6,
						opacity: .45
					}
				}, {
					type: "grain",
					version: co.version ?? 1,
					props: {
						...co.defaults(),
						opacity: .08
					}
				}]
			}
		};
	}
	function Ta(e) {
		pa("footer-template", (t) => {
			let n = wa(e);
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
	function Ea(e) {
		pa("footer", (t) => {
			t[e] ??= [], t[e].push(V(A).pages[0] ? {
				label: Q("seed.link"),
				page: V(A).pages[0].id
			} : {
				label: Q("seed.link"),
				href: "https://"
			});
		});
	}
	function Oa(e, t) {
		pa("footer", (n) => {
			n[e].splice(t, 1), n[e].length || delete n[e];
		});
	}
	function ka(e, t, n) {
		pa("footer", (r) => {
			let i = r[e], a = t + n;
			a < 0 || a >= i.length || ([i[t], i[a]] = [i[a], i[t]]);
		});
	}
	function Ma(e, t, n) {
		pa(`edit:footer-${e}-label-${t}`, (r) => {
			r[e][t].label = n;
		});
	}
	function Na(e, t, n) {
		pa("footer", (r) => {
			let i = r[e][t];
			n === "__href" ? (delete i.page, i.href = i.href ?? "https://") : (i.page = n, delete i.href);
		});
	}
	function Fa(e, t, n) {
		pa(`edit:footer-${e}-href-${t}`, (r) => {
			r[e][t].href = n;
		});
	}
	function Ra(e) {
		pa("footer", (t) => {
			e === "center" ? t.columnsAlign = "center" : delete t.columnsAlign;
		});
	}
	function za(e) {
		pa("footer", (t) => {
			e ? t.cta ??= {
				kind: "button",
				label: Q("seed.join")
			} : delete t.cta;
		});
	}
	function Ba(e, t) {
		pa(`edit:footer-cta-${e}`, (n) => {
			n.cta ??= {}, t === "" || t == null || t === !1 ? delete n.cta[e] : n.cta[e] = t;
		});
	}
	function Ha(e) {
		pa("footer", (t) => {
			t.cta ??= {}, e === "__href" ? (delete t.cta.page, t.cta.href = t.cta.href ?? "https://") : (t.cta.page = e, delete t.cta.href);
		});
	}
	function Ua(e, t) {
		pa("footer", (n) => {
			let r = new Set(n.hideOn ?? []);
			t ? r.delete(e) : r.add(e), r.size ? n.hideOn = [...r] : delete n.hideOn;
		});
	}
	function Ja() {
		pa("footer", (e) => {
			e.columns ??= [], e.columns.push({
				title: Q("seed.column"),
				links: [{
					label: Q("seed.link"),
					page: V(A).pages[0].id
				}]
			});
		});
	}
	function Ya(e) {
		pa("footer", (t) => {
			t.columns.splice(e, 1), t.columns.length || delete t.columns;
		});
	}
	function Xa(e, t) {
		pa("footer", (n) => {
			let r = e + t;
			r < 0 || r >= n.columns.length || ([n.columns[e], n.columns[r]] = [n.columns[r], n.columns[e]]);
		});
	}
	function Za(e, t) {
		pa(`edit:footer-col-title-${e}`, (n) => {
			n.columns[e].title = t;
		});
	}
	function Qa(e) {
		pa("footer", (t) => {
			t.columns[e].links ??= [], t.columns[e].links.push({
				label: Q("seed.link"),
				page: V(A).pages[0].id
			});
		});
	}
	function $a(e, t) {
		pa("footer", (n) => {
			n.columns[e].links.splice(t, 1);
		});
	}
	function eo(e, t, n) {
		pa("footer", (r) => {
			let i = r.columns[e].links, a = t + n;
			a < 0 || a >= i.length || ([i[t], i[a]] = [i[a], i[t]]);
		});
	}
	function to(e, t, n) {
		pa(`edit:footer-link-label-${e}-${t}`, (r) => {
			r.columns[e].links[t].label = n;
		});
	}
	function no(e, t, n) {
		pa("footer", (r) => {
			let i = r.columns[e].links[t];
			n === "__href" ? (delete i.page, i.href = i.href ?? "https://") : (i.page = n, delete i.href);
		});
	}
	function ro(e, t, n) {
		pa(`edit:footer-link-href-${e}-${t}`, (r) => {
			r.columns[e].links[t].href = n;
		});
	}
	function io() {
		pa("footer", (e) => {
			e.social ??= [], e.social.push({
				icon: "facebook",
				url: "https://"
			});
		});
	}
	function so(e) {
		pa("footer", (t) => {
			t.social.splice(e, 1), t.social.length || delete t.social;
		});
	}
	function lo(e, t) {
		pa("footer", (n) => {
			let r = e + t;
			r < 0 || r >= n.social.length || ([n.social[e], n.social[r]] = [n.social[r], n.social[e]]);
		});
	}
	function uo(e, t) {
		pa("footer", (n) => {
			n.social[e].icon = t;
		});
	}
	function fo(e, t) {
		pa(`edit:footer-social-url-${e}`, (n) => {
			n.social[e].url = t;
		});
	}
	let po = ca.filter(([e]) => e === "iconCat.social" || e === "iconCat.communication").flatMap(([, e]) => e.map((e) => [e, sa[e].label]));
	function mo(e, t) {
		U(`edit:nav-label-${e}`, () => {
			V(A).nav.items[e].label = t;
		});
	}
	function ho(e, t) {
		U("nav", () => {
			let n = V(A).nav.items[e];
			t === "__href" ? (delete n.page, n.href = n.href ?? "https://") : t === "__none" ? (delete n.page, delete n.href) : (n.page = t, delete n.href);
		});
	}
	function go(e, t) {
		U(`edit:nav-href-${e}`, () => {
			V(A).nav.items[e].href = t;
		});
	}
	function _o(e, t) {
		let n = e + t, r = V(A).nav.items;
		n < 0 || n >= r.length || U("nav", () => {
			[r[e], r[n]] = [r[n], r[e]];
		});
	}
	function vo(e) {
		U("nav", () => {
			V(A).nav.items.splice(e, 1);
		});
	}
	function yo() {
		U("nav", () => {
			V(A).nav.items.push({
				label: Q("seed.link"),
				page: V(A).pages[0].id
			});
		});
	}
	function bo(e) {
		U("nav", () => {
			let t = V(A).nav.items[e];
			t.children ??= [], t.children.push({
				label: Q("seed.link"),
				page: V(A).pages[0].id
			});
		});
	}
	function xo(e, t, n) {
		U(`edit:nav-child-label-${e}-${t}`, () => {
			V(A).nav.items[e].children[t].label = n;
		});
	}
	function So(e, t, n) {
		U("nav", () => {
			let r = V(A).nav.items[e].children[t];
			n === "__href" ? (delete r.page, r.href = r.href ?? "https://") : (r.page = n, delete r.href);
		});
	}
	function Co(e, t, n) {
		U(`edit:nav-child-href-${e}-${t}`, () => {
			V(A).nav.items[e].children[t].href = n;
		});
	}
	function wo(e, t, n) {
		let r = t + n, i = V(A).nav.items[e].children;
		r < 0 || r >= i.length || U("nav", () => {
			[i[t], i[r]] = [i[r], i[t]];
		});
	}
	function To(e, t) {
		U("nav", () => {
			let n = V(A).nav.items[e];
			n.children.splice(t, 1), n.children.length === 0 && (delete n.children, !n.page && !n.href && (n.page = V(A).pages[0].id));
		});
	}
	function Eo(e, t) {
		U(`edit:theme-color-${e}`, () => {
			V(A).theme.tokens.color[e] = t, V(A).theme.alt?.auto && (V(A).theme.alt.tokens.color = Ao());
		});
	}
	function Do(e, t) {
		U("theme", () => {
			V(A).theme.tokens.font[e] = t;
		});
	}
	function Oo(e, t) {
		U("theme", () => {
			V(A).theme.tokens.radius[e] = t;
		});
	}
	function ko(e) {
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
	function Ao() {
		return Object.fromEntries(Object.entries(V(A).theme.tokens.color).map(([e, t]) => [e, ko(t)]));
	}
	function Mo(e, t) {
		U(`edit:theme-alt-${e}`, () => {
			V(A).theme.alt.tokens.color[e] = t, V(A).theme.alt.auto = !1;
		});
	}
	function No(e) {
		U("theme", () => {
			e === "light" ? delete V(A).theme.scheme : V(A).theme.scheme = e;
		});
	}
	function Po(e) {
		U("theme", () => {
			e ? V(A).theme.alt = {
				auto: !0,
				tokens: { color: Ao() }
			} : delete V(A).theme.alt;
		});
	}
	function Lo(e) {
		U("theme", () => {
			V(A).theme.alt ??= { tokens: { color: Ao() } }, V(A).theme.alt.auto = e, e && (V(A).theme.alt.tokens.color = Ao());
		});
	}
	function Ro(e) {
		let t = V(A).theme.tokens.font[e];
		return [...Bo.some(([, e]) => e === t) ? [] : [[t, Q("opt.customFont")]], ...Bo.map(([e, t]) => [t, Q(e)])];
	}
	let dl = (e) => parseInt(e, 10) || 0;
	function fl(e, t) {
		Oo(e, `${t}px`);
	}
	let pl = (e, t) => e && t && t[e] ? t[e] : e, ml = [
		"bg",
		"surface",
		"text",
		"accent",
		"accent-text"
	], hl = [
		{
			id: "bronn",
			name: Q("themePreset.bronn.name"),
			note: Q("themePreset.bronn.note"),
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
			name: Q("themePreset.stein.name"),
			note: Q("themePreset.stein.note"),
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
			name: Q("themePreset.plomme.name"),
			note: Q("themePreset.plomme.note"),
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
			name: Q("themePreset.rose.name"),
			note: Q("themePreset.rose.note"),
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
			name: Q("themePreset.hav.name"),
			note: Q("themePreset.hav.note"),
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
			name: Q("themePreset.natt.name"),
			note: Q("themePreset.natt.note"),
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
	function gl(e) {
		U("theme", () => {
			let t = e.scheme === "dark", n = t ? e.dark : e.light, r = t ? e.light : e.dark;
			for (let e of ml) V(A).theme.tokens.color[e] = n[e];
			t ? V(A).theme.scheme = "dark" : delete V(A).theme.scheme, V(A).theme.alt = { tokens: { color: { ...r } } };
		});
	}
	let _l = /* @__PURE__ */ P(() => {
		if (!V(A)) return null;
		let e = V(A).theme.tokens.color, t = V(A).theme.alt?.tokens?.color ?? {}, n = V(A).theme.scheme === "dark";
		return hl.find((r) => {
			let i = n ? r.dark : r.light, a = n ? r.light : r.dark;
			return ml.every((n) => e[n] === i[n] && t[n] === a[n]);
		})?.id ?? null;
	});
	function vl() {
		I(D, !V(D)), k?.sendChrome(V(D));
	}
	function yl(e) {
		let t = O.data.sections.find((t) => t.id === e.sectionId), n = t?.blocks.find((t) => t.id === e.blockId);
		n && (Te(`edit:${e.blockId}`), n.props = e.props, O.save(), j(), V(N)?.blockId === e.blockId && ot(), e.rerender && k?.sendSection(V(g), t), I(v, ""));
	}
	function bl(e) {
		let t = O.data.sections.find((t) => t.id === e.sectionId), n = t?.blocks.find((t) => t.id === e.blockId);
		if (!n) return;
		Te(e.coalesce ? `edit:${e.groupKey ?? e.blockId}` : "move-block");
		let r = e.frameKey === "mobile" ? "mobile" : "desktop";
		n.frames[r] = e.frame, r === "desktop" && he(t, "desktop-endret-etter-mobil"), O.save(), j(), V(N)?.blockId === e.blockId && ot();
	}
	function xl(e) {
		let t = O.data.sections.find((t) => t.id === e.sectionId)?.blocks.find((t) => t.id === e.blockId);
		!t?.frames?.desktop || t.frames.desktop.h === e.h || (O.amendBaseline((t) => {
			let n = t.sections.find((t) => t.id === e.sectionId)?.blocks.find((t) => t.id === e.blockId);
			n?.frames?.desktop && (n.frames.desktop.h = e.h);
		}), O.hasDraft() && Te(`edit:${e.blockId}`), t.frames.desktop.h = e.h, O.save(), j(), V(N)?.blockId === e.blockId && ot());
	}
	function Sl(e) {
		let t = O.data.sections.find((t) => t.id === e.sectionId);
		if (t) {
			Te("mobile-manual");
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
			}, O.save(), j();
		}
	}
	function Cl(e) {
		let t = O.data.sections.find((t) => t.id === e.sectionId);
		if (t) {
			Te("mobile-auto");
			for (let e of t.blocks) e.frames.mobile = null;
			t.responsive = {
				...t.responsive ?? {},
				mobile: {
					mode: "auto",
					attention: null
				}
			}, O.save(), j(), me(), k?.sendSection(V(g), t);
		}
	}
	function wl(e) {
		let t = O.data.sections.find((t) => t.id === e.sectionId);
		t?.responsive?.mobile && (Te("review-done"), t.responsive.mobile.attention = null, O.save(), j(), me());
	}
	function Tl(e) {
		let t = O.data.sections.find((t) => t.id === e.sectionId)?.blocks.find((t) => t.id === e.blockId);
		t && (Te("decor"), t.decor = e.decor, O.save(), j(), V(N)?.blockId === e.blockId && ot());
	}
	function El(e) {
		Te("add-section"), e.section.id || (e.section.id = La("sec")), O.data.sections.splice(e.index, 0, e.section), O.save(), j(), k?.sendPage(V(g), O.data), I(wt, e.section.id, !0), jt(e.section), V(qe) !== "properties" && (I(qe, "properties"), k?.sendShowGrid(!1));
	}
	function Dl(e) {
		let t = O.data.sections, n = t.findIndex((t) => t.id === e.sectionId), r = n + e.dir;
		n < 0 || r < 0 || r >= t.length || (Te("move-section"), [t[n], t[r]] = [t[r], t[n]], O.save(), j(), k?.sendPage(V(g), O.data));
	}
	function Ol(e) {
		Te("delete-section"), e.sectionId === V(wt) && (I(wt, null), I(Tt, null)), V(N)?.sectionId === e.sectionId && I(N, null), O.data.sections = O.data.sections.filter((t) => t.id !== e.sectionId), O.save(), j(), k?.sendPage(V(g), O.data);
	}
	function kl(e) {
		let t = O.data.sections.find((t) => t.id === e.sectionId);
		if (t) {
			Te("section-size"), t.size = {
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
			e.moves?.length && (he(t, "seksjonshøyde"), V(N)?.sectionId === e.sectionId && ot()), e.sectionId === V(wt) && I(Et, e.minHeight, !0), O.save(), j();
		}
	}
	function Al(e) {
		let t = O.data.sections.find((t) => t.id === e.fromSectionId), n = O.data.sections.find((t) => t.id === e.toSectionId), r = t?.blocks.find((t) => t.id === e.blockId);
		!t || !n || !r || (Te("move-block"), t.blocks = t.blocks.filter((t) => t.id !== e.blockId), r.frames.desktop = e.frame, r.frames.mobile = null, n.blocks.push(r), he(t, "blokk-flyttet"), he(n, "blokk-flyttet"), O.save(), j(), me(), k?.sendPage(V(g), O.data), V(N)?.blockId === e.blockId && (I(N, {
			...V(N),
			sectionId: e.toSectionId
		}, !0), ot()));
	}
	function jl(e) {
		let t = O.data.sections.find((t) => t.id === e.sectionId);
		if (!t) return;
		let n = e.blockIds ?? [e.blockId];
		Te("delete-block"), t.blocks = t.blocks.filter((e) => !n.includes(e.id)), n.includes(V(N)?.blockId) && I(N, null), he(t, "blokk-slettet"), O.save(), j(), k?.sendSection(V(g), t);
	}
	let Ml = {
		text: {
			type: "text",
			props: {
				html: Q("seed.text"),
				align: "left"
			},
			w: 33,
			h: 28
		},
		"text-box": {
			type: "text",
			props: {
				html: Q("seed.textBox"),
				align: "left",
				box: !0
			},
			w: 30,
			h: 150
		},
		button: {
			type: "button",
			props: {
				label: Q("seed.newButton"),
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
						q: Q("seed.faq.q1"),
						a: Q("seed.faq.answer")
					},
					{
						q: Q("seed.faq.q2"),
						a: Q("seed.faq.answer")
					},
					{
						q: Q("seed.faq.q3"),
						a: Q("seed.faq.answer")
					}
				],
				multi: !1
			},
			w: 50,
			h: 220
		}
	};
	function Nl(e) {
		let t = Ml[e];
		return t ? {
			id: La("blk"),
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
	function Pl(e) {
		k ? k.sendPlaceBlock(e) : Fl(Hn()?.id, e);
	}
	function Fl(e, t) {
		let n = O.data.sections.find((t) => t.id === e) ?? O.data.sections[0];
		if (!n) return;
		Te("add-block");
		let r = Math.max(0, ...n.blocks.map((e) => e.frames?.desktop?.z ?? 1)) + 1;
		t.frames?.desktop && (t.frames.desktop = {
			...t.frames.desktop,
			z: r
		}), n.blocks.push(t), he(n, "blokk-lagt-til"), O.save(), j(), k?.sendSection(V(g), n);
	}
	function Il(e, t, n, r) {
		let i = O.data.sections.find((t) => t.id === e);
		if (!i || !t?.length) return;
		Te("add-blocks");
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
		}), he(i, "blokk-lagt-til"), O.save(), j(), k?.sendSection(V(g), i);
	}
	function Ll(e) {
		Pl(Nl(e));
	}
	let Rl = /* @__PURE__ */ F(en([]));
	function zl(e, t = {}) {
		Pl({
			id: La("blk"),
			type: e.type,
			version: e.version ?? 1,
			decor: !1,
			props: {
				...structuredClone(e.defaults ?? {}),
				...structuredClone(t)
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
	function Bl(e) {
		let t = Nl(e.kind);
		if (t) {
			if (e.at && typeof e.at.x == "number" && typeof e.at.y == "number") {
				let n = O.data.sections.find((t) => t.id === e.sectionId)?.grid ?? V(A).grid, r = Vo({
					x: e.at.x,
					y: e.at.y,
					w: t.frames.desktop.w,
					h: t.frames.desktop.h,
					grid: n
				});
				t.frames.desktop.x = r.x, t.frames.desktop.y = r.y;
			} else t.frames.desktop.x = Math.round((100 - t.frames.desktop.w) / 2 * 100) / 100, t.frames.desktop.y = 40;
			Fl(e.sectionId, t), k?.sendSelect(t.id), e.kind === "image" && x(Q("status.imageBlockAdded")), e.kind === "galleri" && x(Q("status.galleryBlockAdded"));
		}
	}
	async function Vl(e) {
		let t = e.target.files?.[0];
		if (e.target.value = "", !t) return;
		x(Q("status.compressingImage"));
		let n;
		try {
			n = await dn(t);
		} catch {
			x(Q("status.imageReadError"), "error");
			return;
		}
		let r = Math.round(n.height / n.width * .3 * (V(w)?.clientWidth ?? 1280));
		Pl({
			id: La("blk"),
			type: "image",
			version: 1,
			props: {
				src: n.dataUrl,
				alt: Qi(t.name).replaceAll("-", " "),
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
		}), n.bytes > 4e5 ? x(Q("status.imageLarge", { kb: Math.round(n.bytes / 1024) }), "error") : x("");
	}
	async function Hl(e) {
		let t = [], n = 0, r = 0;
		for (let i of e) try {
			let e = await dn(i);
			e.bytes > 4e5 && (r += 1), t.push({
				src: e.dataUrl,
				alt: Qi(i.name).replaceAll("-", " "),
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
	function Ul(e, t, n) {
		t ? x(Q("status.imagesReadFailed", { n: t }), "error") : n ? x(Q("status.imagesLarge", { n }), "error") : x(e ? "" : Q("status.noImagesAdded"));
	}
	async function Wl(e) {
		let t = [...e.target.files ?? []];
		if (e.target.value = "", !t.length) return;
		x(Q("status.compressingImages"));
		let { images: n, failed: r, big: i } = await Hl(t);
		n.length && dt("galleri-add", (e) => {
			e.props.images.push(...n);
		}), Ul(n.length, r, i);
	}
	async function Gl(e) {
		let t = [...e.target.files ?? []];
		if (e.target.value = "", !t.length) return;
		x(Q("status.compressingImages"));
		let { images: n, failed: r, big: i } = await Hl(t);
		if (!n.length) {
			Ul(0, r, i);
			return;
		}
		let a = Nl("galleri");
		a.props.images = n, Pl(a), Ul(n.length, r, i);
	}
	function Kl(e, t) {
		dt("galleri-move", (n) => {
			let r = e + t;
			r < 0 || r >= n.props.images.length || ([n.props.images[e], n.props.images[r]] = [n.props.images[r], n.props.images[e]]);
		});
	}
	function ql(e) {
		dt("galleri-remove", (t) => {
			t.props.images.splice(e, 1);
		});
	}
	function Jl(e, t, n) {
		dt(`edit:${V(N).blockId}:img${e}-${t}`, (r) => {
			r.props.images[e][t] = n;
		});
	}
	function Yl(e, t, n, r) {
		let i = e?.[t];
		if (!i?.startsWith("data:image/")) return;
		let a = i.split(",", 2)[1], o = `media/${Qi(n || "bilde")}-${$i(a)}.${Zi(i)}`;
		r.push({
			path: o,
			content: a,
			encoding: "base64"
		}), e[t] = `/${o}`;
	}
	function Xl(e, t) {
		for (let n of e?.layers ?? []) if (n.type === "image" && Yl(n.props, "src", "bakgrunn", t), n.type === "bildegalleri") for (let e of n.props.images ?? []) Yl(e, "src", "bakgrunn", t);
	}
	function Zl(e) {
		let t = [];
		for (let n of e.sections) {
			Xl(n.background, t);
			for (let e of n.blocks) if (e.type === "image" && Yl(e.props, "src", e.props.alt, t), e.type === "icon" && Yl(e.props, "image", "ikon", t), e.type === "galleri") for (let n of e.props.images ?? []) Yl(n, "src", n.alt || "galleri", t);
		}
		return t;
	}
	function Ql(e) {
		let t = [], n = e.nav?.logo;
		return n?.type === "image" && Yl(n, "value", "logo", t), n?.type === "both" && Yl(n, "image", "logo", t), e.nav?.style && Yl(e.nav.style, "image", "meny", t), Xl(e.nav?.style?.background, t), Xl(e.footer?.background, t), e.footer?.brand && Yl(e.footer.brand, "logo", "footer-logo", t), Yl(e.site, "icon", "ikon", t), t;
	}
	let $l = /* @__PURE__ */ F(!1);
	function eu() {
		if (!V($l)) {
			I($l, !0);
			return;
		}
		I($l, !1), tu();
	}
	yn(() => {
		if (!V($l)) return;
		let e = (e) => {
			e.target?.closest?.(".discard-btn") || I($l, !1);
		}, t = (e) => {
			e.key === "Escape" && I($l, !1);
		}, n = () => I($l, !1);
		return window.addEventListener("pointerdown", e, !0), window.addEventListener("keydown", t, !0), window.addEventListener("blur", n), () => {
			window.removeEventListener("pointerdown", e, !0), window.removeEventListener("keydown", t, !0), window.removeEventListener("blur", n);
		};
	});
	function tu() {
		Te("discard");
		for (let e of V(A).pages) e.id !== V(g) && !ye.has(e.id) && localStorage.removeItem(`urd-draft-${e.id}`);
		let e = O.reset();
		if (ge.reset(), Pi && (Pi.reset(), ea()), ci) {
			ci.reset(), I(pi, [...ci.data.samlinger ?? []], !0);
			for (let e of Object.keys(li)) V(pi).includes(e) ? li[e].reset() : delete li[e];
			bi();
		}
		_e(), I(E, {
			snap: !0,
			...V(A).grid
		}, !0), j(), I(v, ""), ve(), V(A).pages.some((e) => e.id === V(g)) ? k?.sendPage(V(g), e) : mr(V(A).pages[0].id);
	}
	async function nu() {
		if (tr) {
			x(Q("status.revertReloadBeforePublish"), "error");
			return;
		}
		if (V(or)) {
			x(Q("update.publishBlocked"), "error");
			return;
		}
		x(Q("status.publishing"));
		let e = [], t = [], n = [], r = [];
		for (let i of V(A).pages) {
			let a = `urd-draft-${i.id}`, o = ye.has(i.id) || !V(h).pages.some((e) => e.id === i.id), s = null;
			if (i.id === V(g) && (O.hasDraft() || o)) s = O.data;
			else if (i.id !== V(g)) {
				let e = localStorage.getItem(a);
				if (e) try {
					s = ja(JSON.parse(e), ge.data);
				} catch {}
			}
			if (!s && o && (s = pr(i)), !s) continue;
			let c = JSON.parse(JSON.stringify(s));
			e.push(...Zl(c)), e.push({
				path: i.file,
				content: JSON.stringify(c, null, 2) + "\n",
				encoding: "utf-8"
			}), t.push(i.title), o ? r.push(i.id) : n.push(a);
		}
		if (ge.hasDraft()) {
			let r = JSON.parse(JSON.stringify(V(A)));
			e.push(...Ql(r)), e.push({
				path: "content/site.json",
				content: JSON.stringify(r, null, 2) + "\n",
				encoding: "utf-8"
			}), e.push({
				path: "content/theme.css",
				content: Va(r.theme),
				encoding: "utf-8"
			}), n.push("urd-draft-site");
			let i = (e, t) => JSON.stringify(e ?? null) === JSON.stringify(t ?? null);
			i(V(h).theme, V(A).theme) || t.push("tema"), i(V(h).nav, V(A).nav) || t.push("menyen"), i(V(h).footer, V(A).footer) || t.push("footeren"), i(V(h).pages, V(A).pages) || t.push("sideregisteret"), i(V(h).grid, V(A).grid) || t.push("gridet"), (V(h).site.icon ?? null) !== (V(A).site.icon ?? null) && t.push("nettstedsikonet");
			let { icon: a, ...o } = V(h).site, { icon: s, ...c } = V(A).site;
			i(o, c) || t.push("nettstedsinfo");
		}
		let i = Object.entries(li).filter(([, e]) => e.hasDraft());
		if (i.length || ci?.hasDraft()) {
			for (let [t, r] of i) {
				let i = JSON.parse(JSON.stringify(r.data));
				for (let t of i.entries) Yl(t, "image", t.title, e);
				e.push({
					path: `content/samlinger/${t}.json`,
					content: JSON.stringify(i, null, 2) + "\n",
					encoding: "utf-8"
				}), n.push(`urd-draft-samling-${t}`);
			}
			if (ci?.hasDraft()) {
				e.push({
					path: "content/samlinger.json",
					content: JSON.stringify(ci.data, null, 2) + "\n",
					encoding: "utf-8"
				}), n.push("urd-draft-samlinger");
				let t = { samlinger: [] };
				try {
					t = await (await fetch("/content/samlinger.json")).json();
				} catch {}
				let r = new Set(e.map((e) => e.path));
				for (let n of t.samlinger ?? []) {
					let t = `content/samlinger/${n}.json`;
					!V(pi).includes(n) && !r.has(t) && e.push({
						path: t,
						delete: !0
					});
				}
			}
			t.push("samlinger");
		}
		Pi?.hasDraft() && (e.push({
			path: "plugins/plugins.json",
			content: JSON.stringify(Pi.data, null, 2) + "\n",
			encoding: "utf-8"
		}), n.push("urd-draft-plugins"), t.push("plugins"));
		try {
			let t = await (await fetch("/index.html")).text();
			for (let n of V(A).pages) n.path !== "/" && e.push({
				path: `${n.path.slice(1)}/index.html`,
				content: t,
				encoding: "utf-8"
			});
		} catch {}
		let a = new Set(e.map((e) => e.path)), o = (t) => {
			a.has(t) || e.push({
				path: t,
				delete: !0
			});
		};
		for (let e of V(h).pages) {
			let t = V(A).pages.find((t) => t.id === e.id);
			t ? t.path !== e.path && e.path !== "/" && o(`${e.path.slice(1)}/index.html`) : (o(e.file), e.path !== "/" && o(`${e.path.slice(1)}/index.html`));
		}
		let s = await Yn(e);
		if (!s.ok) {
			x(Q("status.publishAborted"), "error");
			return;
		}
		let c = {
			message: `Oppdater ${t.join(", ") || "nettstedet"} via Urd-admin`,
			files: e,
			...s.head ? { expect: s.head } : {}
		}, l = null;
		try {
			l = await fetch("/api/github/commit", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(c)
			});
		} catch {}
		if (l?.ok) {
			let { sha: e } = await l.json().catch(() => ({}));
			e ? qn = e : Jn(), Zl(O.data), Ql(V(A));
			for (let e of n) localStorage.removeItem(e);
			for (let e of r) ye.add(e);
			if (I(h, JSON.parse(JSON.stringify(V(A))), !0), ge = ki("urd-draft-site", () => V(h), S), _e(), Pi) {
				let e = JSON.parse(JSON.stringify(Pi.data));
				Pi = ki("urd-draft-plugins", () => e, S), ea();
			}
			if (ci) {
				for (let e of Object.values(li)) for (let t of e.data.entries) Yl(t, "image", t.title, []);
				let e = JSON.parse(JSON.stringify(ci.data));
				ci = ki("urd-draft-samlinger", () => e, S), ui = {};
				for (let e of V(pi)) {
					if (!li[e]) continue;
					let t = JSON.parse(JSON.stringify(li[e].data));
					ui[e] = t, li[e] = ki(`urd-draft-samling-${e}`, () => t, S);
				}
				bi();
			}
			I(E, {
				snap: !0,
				...V(A).grid
			}, !0);
			let t = JSON.parse(JSON.stringify(O.data));
			O = ki(`urd-draft-${V(g)}`, () => t, S), ye.has(V(g)) && C(`urd-draft-${V(g)}`, JSON.stringify(t)), j(), x(Q("status.published"), "ok");
		} else if (l?.status === 401) {
			let e = await l.json().catch(() => null);
			x(e?.code === "loginExpired" ? Q("status.loginExpired") : Q("status.loginRequired", { reason: wi(e) ?? Q("status.unknownReason") }), "error"), await Kn();
		} else l?.status === 403 ? x(wi(await l.json().catch(() => null)) ?? Q("status.noPublishAccess"), "error") : l?.status === 409 ? x(Q("status.publishRace"), "error") : x(l ? wi(await l.json().catch(() => null)) ?? Q("status.publishFailed") : Q("status.publishUnavailable"), "error");
	}
	Pe();
	var ru = ul();
	xr("keydown", tn, Ne), xr("pointerdown", tn, je);
	var iu = R(ru), au = L(iu), ou = (e) => {
		var t = Ms(), n = L(t);
		J(n, () => c.pencil);
		var r = z(n);
		M(t), B((e, n) => {
			Z(t, "title", e), K(r, ` ${n ?? ""}`);
		}, [() => Q("tip.backToEdit"), () => Q("ui.edit")]), H("click", t, vl), G(e, t);
	};
	q(au, (e) => {
		V(D) || e(ou);
	});
	var su = z(au, 2);
	let cu;
	var lu = L(su), uu = z(L(lu), 2), du = (e) => {
		var t = Ns(), n = R(t), r = L(n, !0);
		M(n);
		var i = z(n, 2), a = L(i);
		let o;
		J(a, () => c.desktop, !0), M(a);
		var s = z(a, 2);
		let l;
		J(s, () => c.phone, !0), M(s), M(i);
		var u = z(i, 2), d = L(u);
		let f;
		J(d, () => c.fit, !0), M(d);
		var p = z(d, 2);
		J(p, () => c.minus, !0), M(p);
		var m = z(p, 2), h = L(m);
		M(m);
		var g = z(m, 2);
		J(g, () => c.plus, !0), M(g), M(u);
		var _ = z(u, 2);
		let v;
		J(_, () => c.guides, !0), M(_), B((e, t, i, c, u, y, b, x, S, C) => {
			Z(n, "title", e), K(r, t), o = Xr(a, 1, "ghost svelte-1n46o8q", null, o, { active: V(ee) === "desktop" }), Z(a, "title", i), l = Xr(s, 1, "ghost svelte-1n46o8q", null, l, { active: V(ee) === "mobile" }), Z(s, "title", c), f = Xr(d, 1, "ghost svelte-1n46o8q", null, f, { active: V(ae) === "fit" }), Z(d, "title", u), Z(p, "title", y), Z(m, "title", b), K(h, `${x ?? ""}%`), Z(g, "title", S), v = Xr(_, 1, "ghost guides-btn svelte-1n46o8q", null, v, { active: V(_r) }), Z(_, "title", C);
		}, [
			() => Q("tip.switchPage"),
			() => be()?.title ?? "",
			() => Q("tip.desktopView"),
			() => Q("tip.mobileView"),
			() => Q("tip.zoomFit"),
			() => Q("tip.zoomOut"),
			() => Q("tip.zoomCurrent"),
			() => Math.round(V(ce) * 100),
			() => Q("tip.zoomIn"),
			() => Q("tip.guides")
		]), H("click", n, () => rt("pages")), H("click", a, () => I(ee, "desktop")), H("click", s, () => I(ee, "mobile")), H("click", d, () => I(ae, "fit")), H("click", p, () => le(-1)), H("click", g, () => le(1)), H("click", _, Sr), G(e, t);
	};
	q(uu, (e) => {
		V(h) && e(du);
	});
	var fu = z(uu, 2), pu = (e) => {
		var t = Ps(), n = L(t);
		J(n, () => c.phone);
		var r = z(n);
		M(t), B((e, n) => {
			Z(t, "title", e), K(r, ` ${n ?? ""}`);
		}, [() => Q("tip.attention"), () => Q(V(pe) === 1 ? "ui.attentionOne" : "ui.attentionMany", { n: V(pe) })]), H("click", t, () => I(ee, "mobile")), G(e, t);
	};
	q(fu, (e) => {
		V(pe) > 0 && e(pu);
	});
	var mu = z(fu, 2), hu = (e) => {
		var t = Fs(), n = R(t), r = L(n, !0);
		M(n);
		var i = z(n, 2);
		let a;
		var o = L(i, !0);
		M(i), B((e, t, n) => {
			K(r, e), a = Xr(i, 1, "ghost discard-btn svelte-1n46o8q", null, a, { armed: V($l) }), Z(i, "title", t), K(o, n);
		}, [
			() => Q("ui.unpublished"),
			() => V($l) ? Q("tip.discardArmed") : Q("tip.discard"),
			() => V($l) ? Q("ui.discardConfirm") : Q("ui.discard")
		]), H("click", i, eu), G(e, t);
	};
	q(mu, (e) => {
		V(_) && e(hu);
	}), M(lu);
	var gu = z(lu, 2), _u = L(gu), vu = (e) => {
		var t = zs(), n = R(t), r = L(n), i = (e) => {
			var t = Is(), n = R(t);
			J(n, () => c.eye);
			var r = z(n);
			B((e) => K(r, ` ${e ?? ""}`), [() => Q("ui.cleanView")]), G(e, t);
		}, a = (e) => {
			var t = Is(), n = R(t);
			J(n, () => c.pencil);
			var r = z(n);
			B((e) => K(r, ` ${e ?? ""}`), [() => Q("ui.edit")]), G(e, t);
		};
		q(r, (e) => {
			V(D) ? e(i) : e(a, -1);
		}), M(n);
		var o = z(n, 2), s = (e) => {
			var t = Ls(), n = L(t), r = (e) => {
				var t = kr();
				J(R(t), () => c.warn), G(e, t);
			};
			q(n, (e) => {
				V(T).allowed || e(r);
			});
			var i = z(n, 1, !0);
			M(t), B((e) => {
				Z(t, "title", e), K(i, V(T).login);
			}, [() => V(T).allowed ? Q("tip.hasPublishAccess") : Q("tip.noPublishAccess")]), G(e, t);
		}, l = (e) => {
			var t = Rs(), n = L(t, !0);
			M(t), B((e) => K(n, e), [() => Q("ui.loginGitHub")]), G(e, t);
		};
		q(o, (e) => {
			V(T)?.loggedIn ? e(s) : V(T) && e(l, 1);
		});
		var u = z(o, 2), d = L(u, !0);
		M(u);
		var f = z(u, 2), p = L(f, !0);
		M(f), B((e, t, r, i) => {
			Z(n, "title", e), Z(u, "href", t), K(d, r), f.disabled = !V(_), K(p, i);
		}, [
			() => V(D) ? Q("tip.chromeHide") : Q("tip.chromeShow"),
			() => be()?.path ?? "/",
			() => Q("ui.viewSite"),
			() => Q("ui.publish")
		]), H("click", n, vl), H("click", f, nu), G(e, t);
	};
	q(_u, (e) => {
		V(h) && e(vu);
	}), M(gu), M(su);
	var yu = z(su, 2), bu = (e) => {
		var t = rl(), i = L(t), o = (e) => {
			var t = nl(), i = R(t), o = L(i);
			zr(o, 17, () => Je, Fr, (e, t, n) => {
				var r = Hs(), i = R(r), a = (e) => {
					G(e, Bs());
				};
				q(i, (e) => {
					n > 0 && e(a);
				}), zr(z(i, 2), 16, () => V(t), (e) => e, (e, t) => {
					var n = Vs();
					let r;
					var i = L(n, !0);
					M(n), B(() => {
						r = Xr(n, 1, "svelte-1n46o8q", null, r, { active: V(qe) === t }), K(i, Ye[t]);
					}), H("click", n, () => rt(t)), G(e, n);
				}), G(e, r);
			});
			var s = z(o, 2), f = L(s);
			let p;
			J(f, () => c.gear, !0), M(f);
			var h = z(f, 2), _ = (e) => {
				var t = Us(), n = L(t), r = L(n, !0);
				M(n);
				var i = z(n, 2), a = L(i);
				$(z(a), {
					get value() {
						return V(u);
					},
					get options() {
						return l;
					},
					onchange: (e) => I(u, e, !0)
				}), M(i);
				var o = z(i, 2), s = L(o), c = z(s);
				{
					let e = /* @__PURE__ */ P(() => [["auto", Q("lang.auto")], ...$e()]);
					$(c, {
						get value() {
							return tt;
						},
						get options() {
							return V(e);
						},
						onchange: nt
					});
				}
				M(o), M(t), B((e, t, n, c, l) => {
					K(r, e), Z(i, "title", t), K(a, `${n ?? ""} `), Z(o, "title", c), K(s, `${l ?? ""} `);
				}, [
					() => Q("settings.title"),
					() => Q("topbar.adminTheme.title"),
					() => Q("settings.theme"),
					() => Q("topbar.language.title"),
					() => Q("settings.language")
				]), G(e, t);
			};
			q(h, (e) => {
				V(vr) && e(_);
			}), M(s), di(s, (e) => I(br, e), () => V(br)), M(i);
			var v = z(i, 2), y = (e) => {
				var t = tl(), i = L(t), o = L(i, !0);
				M(i);
				var s = z(i, 2), l = (e) => {
					var t = qs(), n = L(t), r = L(n, !0);
					M(n);
					var i = z(n, 2);
					zr(i, 17, () => V(A).pages, (e) => e.id, (e, t) => {
						var n = Ks();
						let r;
						var i = L(n);
						Y(i);
						var a = z(i, 2), o = (e) => {
							var t = Ws();
							B((e) => Z(t, "title", e), [() => Q("tip.pages.homeLocked")]), G(e, t);
						}, s = (e) => {
							var n = Gs();
							Y(n), B((e, t) => {
								X(n, e), Z(n, "title", t);
							}, [() => V(t).path.slice(1), () => Q("tip.pages.slug")]), H("change", n, (e) => jr(V(t), e.target.value)), G(e, n);
						};
						q(a, (e) => {
							V(t).path === "/" ? e(o) : e(s, -1);
						});
						var l = z(a, 2), u = L(l);
						J(u, () => c.right, !0), M(u);
						var d = z(u, 2), f = (e) => {
							var n = Uo();
							J(n, () => c.cross, !0), M(n), B((e) => Z(n, "title", e), [() => Q("tip.pages.delete")]), H("click", n, () => Mr(V(t))), G(e, n);
						};
						q(d, (e) => {
							V(t).path !== "/" && e(f);
						}), M(l), M(n), B((e, a) => {
							r = Xr(n, 1, "page-row svelte-1n46o8q", null, r, { current: V(t).id === V(g) }), X(i, V(t).title), Z(i, "title", e), Z(u, "title", a), u.disabled = V(t).id === V(g);
						}, [() => Q("tip.pages.title"), () => Q("tip.pages.open")]), H("change", i, (e) => W(V(t), e.target.value)), H("click", u, () => mr(V(t).id)), G(e, n);
					});
					var a = z(i, 4);
					Y(a);
					var o = z(a, 2), s = L(o, !0);
					M(o);
					var l = z(o, 2), u = L(l, !0);
					M(l), M(t), B((e, t, n, i, c) => {
						K(r, e), Z(a, "placeholder", t), o.disabled = n, K(s, i), K(u, c);
					}, [
						() => Q("hint.pages.drafts"),
						() => Q("ph.newPageName"),
						() => !V(wr).trim(),
						() => Q("ui.createPage"),
						() => Q("hint.pages.autoMenu")
					]), H("keydown", a, (e) => e.key === "Enter" && Dr()), si(a, () => V(wr), (e) => I(wr, e)), H("click", o, Dr), G(e, t);
				}, u = (e) => {
					var t = ec(), r = L(t), i = L(r, !0);
					M(r);
					var a = z(r, 2), o = L(a), s = L(o, !0);
					M(o);
					var l = z(o, 2), u = L(l), d = L(u), f = z(d);
					{
						let e = /* @__PURE__ */ P(() => V(A).nav.logo?.type ?? "text"), t = /* @__PURE__ */ P(() => [
							["text", Q("blocks.text")],
							["image", Q("blocks.image")],
							["both", Q("opt.logo.both")]
						]);
						$(f, {
							get value() {
								return V(e);
							},
							get options() {
								return V(t);
							},
							onchange: (e) => Pr(e)
						});
					}
					M(u);
					var p = z(u, 2), m = (e) => {
						var t = Js(), n = R(t);
						Y(n);
						var r = z(n, 2), i = L(r);
						{
							let e = /* @__PURE__ */ P(() => Q("tip.nav.logoFont")), t = /* @__PURE__ */ P(() => V(A).nav.logo?.font ?? ""), n = /* @__PURE__ */ P(() => [["", Q("common.inherit")], ...Bo.map(([e, t]) => [t, Q(e)])]);
							$(i, {
								get title() {
									return V(e);
								},
								get value() {
									return V(t);
								},
								get options() {
									return V(n);
								},
								onchange: (e) => Nr({ font: e || void 0 })
							});
						}
						var a = z(i, 2);
						Y(a);
						var o = z(a, 2);
						let s;
						var c = L(o), l = L(c, !0);
						M(c), M(o);
						var u = z(o, 2);
						let d;
						var f = L(u), p = L(f, !0);
						M(f), M(u), M(r), B((e, t, r, i, c, f, m) => {
							X(n, V(A).nav.logo?.value ?? ""), Z(n, "placeholder", e), Z(a, "title", t), X(a, V(A).nav.logo?.textSize ?? ""), s = Xr(o, 1, "tbtn svelte-1n46o8q", null, s, { active: V(A).nav.logo?.bold !== !1 }), Z(o, "title", r), K(l, i), d = Xr(u, 1, "tbtn svelte-1n46o8q", null, d, c), Z(u, "title", f), K(p, m);
						}, [
							() => Q("ph.nav.logoName"),
							() => Q("tip.nav.textSize"),
							() => Q("format.bold"),
							() => Q("format.boldLetter"),
							() => ({ active: !!V(A).nav.logo?.italic }),
							() => Q("format.italic"),
							() => Q("format.italicLetter")
						]), H("input", n, (e) => Nr({ value: e.target.value })), H("change", a, (e) => Nr({ textSize: e.target.value ? Number(e.target.value) : void 0 })), H("click", o, () => Nr({ bold: V(A).nav.logo?.bold === !1 })), H("click", u, () => Nr({ italic: !V(A).nav.logo?.italic })), G(e, t);
					};
					q(p, (e) => {
						(V(A).nav.logo?.type ?? "text") !== "image" && e(m);
					});
					var h = z(p, 2), g = (e) => {
						var t = Ys(), n = R(t), r = L(n), i = L(r), a = z(i);
						M(r);
						var o = z(r, 2);
						Y(o);
						var s = z(o, 2);
						Y(s), M(n);
						var c = z(n, 2), l = L(c, !0);
						M(c), B((e, t, n, a, c) => {
							Z(r, "title", e), K(i, `${t ?? ""} `), Z(o, "title", n), X(o, V(A).nav.logo?.size ?? 32), Z(s, "title", a), X(s, V(A).nav.logo?.radius ?? 0), K(l, c);
						}, [
							() => Q("tip.webpAuto"),
							() => (V(A).nav.logo?.type === "image" ? V(A).nav.logo?.value : V(A).nav.logo?.image) ? Q("ui.changeImage") : Q("ui.chooseImage"),
							() => Q("tip.nav.logoHeight"),
							() => Q("tip.nav.logoRadius"),
							() => Q("hint.nav.logoFields")
						]), H("change", a, Ir), H("change", o, (e) => Nr({ size: Number(e.target.value) })), H("change", s, (e) => Nr({ radius: Number(e.target.value) })), G(e, t);
					};
					q(h, (e) => {
						(V(A).nav.logo?.type ?? "text") !== "text" && e(g);
					});
					var _ = z(h, 2), v = (e) => {
						var t = as(), n = L(t), r = z(n);
						{
							let e = /* @__PURE__ */ P(() => V(A).nav.logo?.order ?? "image-first"), t = /* @__PURE__ */ P(() => [["image-first", Q("opt.logo.imageFirst")], ["text-first", Q("opt.logo.textFirst")]]);
							$(r, {
								get value() {
									return V(e);
								},
								get options() {
									return V(t);
								},
								onchange: (e) => Nr({ order: e })
							});
						}
						M(t), B((e) => K(n, `${e ?? ""} `), [() => Q("lbl.order")]), G(e, t);
					};
					q(_, (e) => {
						V(A).nav.logo?.type === "both" && e(v);
					});
					var y = z(_, 2), b = L(y, !0);
					M(y), M(l), M(a);
					var x = z(a, 2), S = L(x), C = L(S, !0);
					M(S);
					var w = z(S, 2), T = L(w), E = L(T), D = z(E);
					{
						let e = /* @__PURE__ */ P(() => V(A).nav.variant ?? "bar"), t = /* @__PURE__ */ P(() => [
							["bar", Q("opt.navVariant.bar")],
							["floating", Q("opt.navVariant.floating")],
							["floating-square", Q("opt.navVariant.floatingSquare")],
							["floating-tab", Q("opt.navVariant.floatingTab")],
							["side-left", Q("opt.navVariant.sideLeft")],
							["side-right", Q("opt.navVariant.sideRight")]
						]);
						$(D, {
							get value() {
								return V(e);
							},
							get options() {
								return V(t);
							},
							onchange: (e) => ni(e)
						});
					}
					M(T);
					var ee = z(T, 2), te = (e) => {
						var t = Xs(), n = R(t), r = L(n);
						Y(r);
						var i = z(r);
						M(n);
						var a = z(n, 2), o = L(a);
						Y(o);
						var s = z(o);
						M(a), B((e, t, c, l) => {
							Z(n, "title", e), ri(r, V(A).nav.style?.glow === !0), K(i, ` ${t ?? ""}`), Z(a, "title", c), ri(o, V(A).nav.style?.topGap !== !1), K(s, ` ${l ?? ""}`);
						}, [
							() => Q("tip.nav.glow"),
							() => Q("lbl.navGlow"),
							() => Q("tip.nav.topGap"),
							() => Q("lbl.navTopGap")
						]), H("change", r, (e) => ii(e.target.checked)), H("change", o, (e) => ai(e.target.checked)), G(e, t);
					};
					q(ee, (e) => {
						V($r) && e(te);
					});
					var ne = z(ee, 2), re = (e) => {
						var t = ps(), n = L(t);
						Y(n);
						var r = z(n);
						M(t), B((e, i) => {
							Z(t, "title", e), ri(n, V(A).nav.overlay === !0), K(r, ` ${i ?? ""}`);
						}, [() => Q("tip.nav.overlay"), () => Q("lbl.navOverlay")]), H("change", n, (e) => U("nav", () => {
							e.target.checked ? V(A).nav.overlay = !0 : delete V(A).nav.overlay;
						})), G(e, t);
					};
					q(ne, (e) => {
						!V($r) && !V(Zr) && e(re);
					});
					var ie = z(ne, 2), ae = (e) => {
						var t = as(), n = L(t), r = z(n);
						{
							let e = /* @__PURE__ */ P(() => V(A).nav.style?.sideAlign ?? "left"), t = /* @__PURE__ */ P(() => [
								["left", Q("common.left")],
								["center", Q("common.center")],
								["right", Q("common.right")]
							]);
							$(r, {
								get value() {
									return V(e);
								},
								get options() {
									return V(t);
								},
								onchange: (e) => Yr("sideAlign", e === "left" ? void 0 : e)
							});
						}
						M(t), B((e, r) => {
							Z(t, "title", e), K(n, `${r ?? ""} `);
						}, [() => Q("tip.nav.sideAlign"), () => Q("lbl.textAlign")]), G(e, t);
					};
					q(ie, (e) => {
						V(Zr) && e(ae);
					});
					var oe = z(ie, 2), se = L(oe);
					Y(se);
					var ce = z(se);
					M(oe);
					var le = z(oe, 2), ue = L(le), de = z(ue);
					{
						let e = /* @__PURE__ */ P(() => V(A).nav.style?.size ?? "md"), t = /* @__PURE__ */ P(() => [
							["sm", Q("opt.size.sm")],
							["md", Q("opt.size.md")],
							["lg", Q("opt.size.lg")],
							["xl", Q("opt.size.xl")]
						]);
						$(de, {
							get value() {
								return V(e);
							},
							get options() {
								return V(t);
							},
							onchange: (e) => Yr("size", e === "md" ? void 0 : e)
						});
					}
					M(le);
					var fe = z(le, 2), pe = L(fe), me = z(pe), he = (e) => {
						{
							let t = /* @__PURE__ */ P(() => V(A).nav.style?.sidePlacement ?? "top"), n = /* @__PURE__ */ P(() => [
								["top", Q("opt.place.top")],
								["middle", Q("opt.place.middle")],
								["bottom", Q("opt.place.bottom")]
							]);
							$(e, {
								get value() {
									return V(t);
								},
								get options() {
									return V(n);
								},
								onchange: (e) => Yr("sidePlacement", e === "top" ? void 0 : e)
							});
						}
					}, O = (e) => {
						{
							let t = /* @__PURE__ */ P(() => V(A).nav.layout ?? "right"), n = /* @__PURE__ */ P(() => [
								["right", Q("common.right")],
								["center", Q("common.center")],
								["left", Q("opt.layout.leftAfterLogo")]
							]);
							$(e, {
								get value() {
									return V(t);
								},
								get options() {
									return V(n);
								},
								onchange: (e) => Jr(e)
							});
						}
					};
					q(me, (e) => {
						V(Zr) ? e(he) : e(O, -1);
					}), M(fe);
					var ge = z(fe, 2), k = (e) => {
						var t = Zs(), n = R(t), r = L(n);
						Y(r);
						var i = z(r);
						M(n);
						var a = z(n, 2), o = (e) => {
							var t = as(), n = L(t), r = z(n);
							{
								let e = /* @__PURE__ */ P(() => V(A).nav.scroll ?? "none"), t = /* @__PURE__ */ P(() => [
									["none", Q("opt.scroll.none")],
									["shrink", Q("opt.scroll.shrink")],
									["hide", Q("opt.scroll.hide")]
								]);
								$(r, {
									get value() {
										return V(e);
									},
									get options() {
										return V(t);
									},
									onchange: (e) => U("nav", () => {
										e === "none" ? delete V(A).nav.scroll : V(A).nav.scroll = e;
									})
								});
							}
							M(t), B((e, r) => {
								Z(t, "title", e), K(n, `${r ?? ""} `);
							}, [() => Q("tip.nav.scroll"), () => Q("lbl.navScroll")]), G(e, t);
						};
						q(a, (e) => {
							V(A).nav.sticky !== !1 && e(o);
						}), B((e, t) => {
							Z(n, "title", e), ri(r, V(A).nav.sticky !== !1), K(i, ` ${t ?? ""}`);
						}, [() => Q("tip.nav.sticky"), () => Q("lbl.navSticky")]), H("change", r, (e) => U("nav", () => {
							V(A).nav.sticky = e.target.checked;
						})), G(e, t);
					};
					q(ge, (e) => {
						V(Zr) || e(k);
					});
					var _e = z(ge, 2), ve = L(_e), ye = z(ve);
					{
						let e = /* @__PURE__ */ P(() => V(A).nav.style?.hover ?? "standard"), t = /* @__PURE__ */ P(() => [
							["standard", Q("opt.hover.standard")],
							["underline", Q("opt.hover.underline")],
							["pill", Q("opt.hover.pill")],
							["lift-plain", Q("opt.hover.liftPlain")],
							["lift", Q("opt.hover.lift")]
						]);
						$(ye, {
							get value() {
								return V(e);
							},
							get options() {
								return V(t);
							},
							onchange: (e) => oi(e)
						});
					}
					M(_e);
					var be = z(_e, 2), j = (e) => {
						var t = Qs(), n = R(t), r = L(n), i = z(r), a = L(i);
						M(i), M(n);
						var o = z(n, 2);
						Y(o), B((e, t, i) => {
							Z(n, "title", e), K(r, `${t ?? ""} `), K(a, `${i ?? ""}%`), X(o, V(A).nav.style?.hoverGlow ?? .6);
						}, [
							() => Q("tip.nav.hoverGlow"),
							() => Q("lbl.glowStrength"),
							() => Math.round((V(A).nav.style?.hoverGlow ?? .6) * 100)
						]), H("input", o, (e) => Yr("hoverGlow", Number(e.target.value))), G(e, t);
					};
					q(be, (e) => {
						V(A).nav.style?.hover === "lift" && e(j);
					});
					var xe = z(be, 2), Se = (e) => {
						var t = as(), n = L(t), r = z(n);
						{
							let e = /* @__PURE__ */ P(() => V(A).nav.style?.hoverColor ?? "accent"), t = /* @__PURE__ */ P(Sn);
							Vi(r, {
								get value() {
									return V(e);
								},
								get tokens() {
									return V(t);
								},
								get label() {
									return V(ti)[1];
								},
								onchange: (e) => Yr("hoverColor", e)
							});
						}
						M(t), B(() => {
							Z(t, "title", V(ti)[1]), K(n, `${V(ti)[0] ?? ""} `);
						}), G(e, t);
					};
					q(xe, (e) => {
						V(ti) && e(Se);
					});
					var Ce = z(xe, 2), we = L(Ce), Te = z(we);
					{
						let e = /* @__PURE__ */ P(() => V(A).nav.style?.hoverTextColor ?? "accent"), t = /* @__PURE__ */ P(Sn), n = /* @__PURE__ */ P(() => Q("tip.nav.hoverTextColorPick"));
						Vi(Te, {
							get value() {
								return V(e);
							},
							get tokens() {
								return V(t);
							},
							get label() {
								return V(n);
							},
							onchange: (e) => Yr("hoverTextColor", e)
						});
					}
					M(Ce);
					var Ee = z(Ce, 2), De = L(Ee), Oe = z(De);
					{
						let e = /* @__PURE__ */ P(() => V(A).nav.style?.textColor ?? "text"), t = /* @__PURE__ */ P(Sn), n = /* @__PURE__ */ P(() => Q("tip.nav.textColorPick"));
						Vi(Oe, {
							get value() {
								return V(e);
							},
							get tokens() {
								return V(t);
							},
							get label() {
								return V(n);
							},
							onchange: (e) => Yr("textColor", e)
						});
					}
					M(Ee);
					var ke = z(Ee, 4), Ae = L(ke, !0);
					M(ke);
					var je = z(ke, 2);
					n(je, () => bn, () => V(A).nav?.style?.background?.layers ?? []), M(w), M(x);
					var Me = z(x, 2), Ne = L(Me), Pe = L(Ne, !0);
					M(Ne);
					var Fe = z(Ne, 2), Ie = L(Fe), Le = L(Ie), Re = z(Le);
					{
						let e = /* @__PURE__ */ P(() => V(A).nav.style?.subStyle ?? "card"), t = /* @__PURE__ */ P(() => V(Zr) ? [
							["card", Q("common.standard")],
							["pills", Q("opt.sub.pills")],
							["lines", Q("opt.sub.lines")]
						] : [
							["card", Q("opt.sub.card")],
							["flat", Q("opt.sub.flat")],
							["pills", Q("opt.sub.pills")],
							["lines", Q("opt.sub.lines")],
							["flyout", Q("opt.sub.flyout")]
						]);
						$(Re, {
							get value() {
								return V(e);
							},
							get options() {
								return V(t);
							},
							onchange: (e) => Yr("subStyle", e === "card" ? void 0 : e)
						});
					}
					M(Ie);
					var ze = z(Ie, 2), Be = (e) => {
						var t = as(), n = L(t), r = z(n);
						{
							let e = /* @__PURE__ */ P(() => V(A).nav.style?.subPillColor ?? "surface"), t = /* @__PURE__ */ P(Sn), n = /* @__PURE__ */ P(() => Q("tip.nav.subPillColorPick"));
							Vi(r, {
								get value() {
									return V(e);
								},
								get tokens() {
									return V(t);
								},
								get label() {
									return V(n);
								},
								onchange: (e) => Yr("subPillColor", e)
							});
						}
						M(t), B((e, r) => {
							Z(t, "title", e), K(n, `${r ?? ""} `);
						}, [() => Q("tip.nav.subPillColor"), () => Q("lbl.subPillColor")]), G(e, t);
					};
					q(ze, (e) => {
						V(A).nav.style?.subStyle === "pills" && e(Be);
					});
					var Ve = z(ze, 2), He = L(Ve), Ue = z(He);
					Y(Ue), M(Ve), M(Fe), M(Me);
					var We = z(Me, 2), Ge = L(We), Ke = L(Ge, !0);
					M(Ge);
					var qe = z(Ge, 2), Je = L(qe);
					zr(Je, 17, () => V(A).nav.items, Fr, (e, t, n) => {
						var r = $s(), i = R(r), a = L(i);
						Y(a);
						var o = z(a, 2), s = L(o);
						J(s, () => c.plus, !0), M(s);
						var l = z(s, 2);
						l.disabled = n === 0, J(l, () => c.up, !0), M(l);
						var u = z(l, 2);
						J(u, () => c.down, !0), M(u);
						var d = z(u, 2);
						J(d, () => c.cross, !0), M(d), M(o);
						var f = z(o, 2), p = L(f);
						{
							let e = /* @__PURE__ */ P(() => V(t).page ?? (V(t).href == null ? "__none" : "__href")), r = /* @__PURE__ */ P(() => Q("tip.linkTarget")), i = /* @__PURE__ */ P(() => [
								...V(A).pages.map((e) => [e.id, e.title]),
								["__href", Q("opt.linkHref")],
								...V(t).children ? [["__none", Q("opt.noLink")]] : []
							]);
							$(p, {
								get value() {
									return V(e);
								},
								get title() {
									return V(r);
								},
								get options() {
									return V(i);
								},
								onchange: (e) => ho(n, e)
							});
						}
						M(f);
						var m = z(f, 2), h = (e) => {
							var r = rs();
							Y(r), B((e, n) => {
								X(r, V(t).href), Z(r, "placeholder", e), Z(r, "title", n);
							}, [() => Q("ph.hrefAnchor"), () => Q("tip.hrefAnchor")]), H("change", r, (e) => go(n, e.target.value)), G(e, r);
						};
						q(m, (e) => {
							!V(t).page && V(t).href != null && e(h);
						}), M(i), zr(z(i, 2), 17, () => V(t).children ?? [], Fr, (e, r, i) => {
							var a = is(), o = L(a);
							Y(o);
							var s = z(o, 2), l = L(s);
							l.disabled = i === 0, J(l, () => c.up, !0), M(l);
							var u = z(l, 2);
							J(u, () => c.down, !0), M(u);
							var d = z(u, 2);
							J(d, () => c.cross, !0), M(d), M(s);
							var f = z(s, 2), p = L(f);
							{
								let e = /* @__PURE__ */ P(() => V(r).page ?? "__href"), t = /* @__PURE__ */ P(() => Q("tip.linkTarget")), a = /* @__PURE__ */ P(() => [...V(A).pages.map((e) => [e.id, e.title]), ["__href", Q("opt.linkHref")]]);
								$(p, {
									get value() {
										return V(e);
									},
									get title() {
										return V(t);
									},
									get options() {
										return V(a);
									},
									onchange: (e) => So(n, i, e)
								});
							}
							M(f);
							var m = z(f, 2), h = (e) => {
								var t = rs();
								Y(t), B((e, n) => {
									X(t, V(r).href ?? ""), Z(t, "placeholder", e), Z(t, "title", n);
								}, [() => Q("ph.hrefAnchor"), () => Q("tip.hrefAnchor")]), H("change", t, (e) => Co(n, i, e.target.value)), G(e, t);
							};
							q(m, (e) => {
								V(r).page || e(h);
							}), M(a), B((e, n) => {
								X(o, V(r).label), Z(o, "title", e), u.disabled = i === V(t).children.length - 1, Z(d, "title", n);
							}, [() => Q("tip.nav.childLabel"), () => Q("tip.nav.removeChild")]), H("input", o, (e) => xo(n, i, e.target.value)), H("click", l, () => wo(n, i, -1)), H("click", u, () => wo(n, i, 1)), H("click", d, () => To(n, i)), G(e, a);
						}), B((e, r, i) => {
							X(a, V(t).label), Z(a, "title", e), Z(s, "title", r), u.disabled = n === V(A).nav.items.length - 1, Z(d, "title", i);
						}, [
							() => Q("tip.nav.itemLabel"),
							() => Q("tip.nav.addChild"),
							() => Q("tip.nav.removeItem")
						]), H("input", a, (e) => mo(n, e.target.value)), H("click", s, () => bo(n)), H("click", l, () => _o(n, -1)), H("click", u, () => _o(n, 1)), H("click", d, () => vo(n)), G(e, r);
					});
					var Ye = z(Je, 2), Xe = L(Ye, !0);
					M(Ye);
					var Ze = z(Ye, 2), Qe = L(Ze, !0);
					M(Ze), M(qe), M(We), M(t), B((e, t, n, r, a, o, c, l, u, f, p, m, h, g, _, v, y, x, S, w, D, ee, te) => {
						K(i, e), K(s, t), K(d, `${n ?? ""} `), K(b, r), K(C, a), Z(T, "title", o), K(E, `${c ?? ""} `), Z(oe, "title", l), ri(se, V(A).nav.style?.blur !== !1), K(ce, ` ${u ?? ""}`), K(ue, `${f ?? ""} `), K(pe, `${p ?? ""} `), K(ve, `${m ?? ""} `), Z(Ce, "title", h), K(we, `${g ?? ""} `), K(De, `${_ ?? ""} `), K(Ae, v), K(Pe, y), K(Le, `${x ?? ""} `), Z(Ve, "title", S), K(He, `${w ?? ""} `), X(Ue, V(A).nav.style?.subColumns ?? 1), K(Ke, D), K(Xe, ee), K(Qe, te);
					}, [
						() => Q("hint.nav.intro"),
						() => Q("group.logo"),
						() => Q("common.type"),
						() => Q("hint.nav.logoHome"),
						() => Q("group.appearance"),
						() => Q("tip.nav.variant"),
						() => Q("lbl.navVariant"),
						() => Q("tip.nav.blur"),
						() => Q("lbl.navBlur"),
						() => Q("lbl.size"),
						() => Q("lbl.navPlacement"),
						() => Q("lbl.navHover"),
						() => Q("tip.nav.hoverTextColor"),
						() => Q("lbl.hoverTextColor"),
						() => Q("lbl.textColor"),
						() => Q("lbl.background"),
						() => Q("group.submenu"),
						() => Q("lbl.design"),
						() => Q("tip.nav.subColumns"),
						() => Q("lbl.columns"),
						() => Q("group.menuItems"),
						() => Q("ui.addMenuItem"),
						() => Q("hint.nav.submenu")
					]), H("change", se, (e) => Yr("blur", e.target.checked)), H("change", Ue, (e) => Yr("subColumns", Number(e.target.value) > 1 ? Number(e.target.value) : void 0)), H("click", Ye, yo), G(e, t);
				}, f = (e) => {
					var t = rc(), n = L(t), r = L(n), i = z(r);
					Y(i), M(n);
					var a = z(n, 2), o = L(a), s = z(o);
					Y(s), M(a);
					var l = z(a, 2), u = L(l), d = z(u);
					{
						let e = /* @__PURE__ */ P(Wr), t = /* @__PURE__ */ P(Gr);
						$(d, {
							get value() {
								return V(e);
							},
							get options() {
								return V(t);
							},
							onchange: (e) => Kr(e)
						});
					}
					M(l);
					var f = z(l, 4), p = L(f), m = z(p), h = (e) => {
						var t = tc();
						B((e) => {
							Z(t, "src", V(A).site.icon), Z(t, "alt", e);
						}, [() => Q("lbl.siteIcon")]), G(e, t);
					};
					q(m, (e) => {
						V(A).site.icon && e(h);
					}), M(f);
					var g = z(f, 2), _ = L(g), v = L(_), y = z(v);
					M(_);
					var b = z(_, 2), x = (e) => {
						var t = nc(), n = R(t);
						J(n, () => c.pencil ?? "✎", !0), M(n);
						var r = z(n, 2);
						J(r, () => c.cross, !0), M(r), B((e, t) => {
							Z(n, "title", e), Z(r, "title", t);
						}, [() => Q("tip.site.editIcon"), () => Q("tip.site.removeIcon")]), H("click", n, () => I(Lr, V(A).site.icon, !0)), H("click", r, Vr), G(e, t);
					};
					q(b, (e) => {
						V(A).site.icon && e(x);
					}), M(g), M(t), B((e, t, c, d, f, m, h, g, y, b, x) => {
						Z(n, "title", e), K(r, `${t ?? ""} `), X(i, V(A).site.title ?? ""), Z(i, "placeholder", c), Z(a, "title", d), K(o, `${f ?? ""} `), X(s, V(A).site.description ?? ""), Z(s, "placeholder", m), Z(l, "title", h), K(u, `${g ?? ""} `), K(p, `${y ?? ""} `), Z(_, "title", b), K(v, `${x ?? ""} `);
					}, [
						() => Q("tip.site.name"),
						() => Q("lbl.name"),
						() => Q("ph.site.name"),
						() => Q("tip.site.description"),
						() => Q("lbl.description"),
						() => Q("ph.site.description"),
						() => Q("site.langTitle"),
						() => Q("site.langLabel"),
						() => Q("lbl.siteIcon"),
						() => Q("tip.site.icon"),
						() => V(A).site.icon ? Q("ui.changeIcon") : Q("ui.chooseIcon")
					]), H("input", i, (e) => Hr(e.target.value)), H("input", s, (e) => Ur(e.target.value)), H("change", y, Rr), G(e, t);
				}, p = (e) => {
					var t = fc();
					{
						let e = (e, t = d, n = d) => {
							var r = ac(), i = L(r), a = (e) => {
								var t = ic(), r = L(t, !0);
								M(t), B(() => K(r, n())), G(e, t);
							};
							q(i, (e) => {
								n() && e(a);
							});
							var o = z(i, 2), s = L(o), c = L(s, !0);
							M(s);
							var l = z(s, 2), u = L(l, !0);
							M(l);
							var f = z(l, 2), p = L(f), m = L(p, !0);
							M(p);
							var h = z(p), g = L(h, !0);
							M(h), M(f), M(o), M(r), B((e, t, n, r, i, a, s, l, d) => {
								Qr(o, `--tv-bg:${e ?? ""};--tv-surface:${t ?? ""};--tv-text:${n ?? ""};--tv-accent:${r ?? ""};--tv-accent-ink:${i ?? ""}`), K(c, a), K(u, s), K(m, l), K(g, d);
							}, [
								() => pl(t().bg, t()),
								() => pl(t().surface, t()),
								() => pl(t().text, t()),
								() => pl(t().accent, t()),
								() => pl(t()["accent-text"] ?? t().bg, t()),
								() => Q("preview.heading"),
								() => Q("preview.cardBody"),
								() => Q("preview.button"),
								() => Q("preview.link")
							]), G(e, r);
						};
						var n = L(t), r = L(n, !0);
						M(n);
						var i = z(n, 2);
						zr(i, 21, () => hl, (e) => e.id, (e, t) => {
							var n = oc();
							let r;
							var i = L(n), a = L(i), o = z(a), s = z(o), c = z(s);
							M(i);
							var l = z(i, 2), u = L(l, !0);
							M(l), M(n), B(() => {
								r = Xr(n, 1, "theme-preset svelte-1n46o8q", null, r, { sel: V(_l) === V(t).id }), Z(n, "title", `${V(t).name} - ${V(t).note}`), Qr(a, `background:${V(t).light.bg ?? ""}`), Qr(o, `background:${V(t).light.surface ?? ""}`), Qr(s, `background:${V(t).light.accent ?? ""}`), Qr(c, `background:${V(t).light.text ?? ""}`), K(u, V(t).name);
							}), H("click", n, () => gl(V(t))), G(e, n);
						}), M(i);
						var a = z(i, 2), o = L(a, !0);
						M(a);
						var s = z(a, 2), c = L(s);
						Y(c);
						var l = z(c);
						M(s);
						var u = z(s, 2), f = (e) => {
							var t = sc(), n = L(t), r = L(n, !0);
							M(n);
							var i = z(n, 2), a = L(i);
							let o;
							var s = L(a, !0);
							M(a);
							var c = z(a, 2);
							let l;
							var u = L(c, !0);
							M(c), M(i), M(t), B((e, t, n) => {
								K(r, e), o = Xr(a, 1, "svelte-1n46o8q", null, o, { on: V(Tn) }), K(s, t), l = Xr(c, 1, "svelte-1n46o8q", null, l, { on: !V(Tn) }), K(u, n);
							}, [
								() => Q("lbl.darkColors"),
								() => Q("opt.auto"),
								() => Q("opt.custom")
							]), H("click", a, () => Lo(!0)), H("click", c, () => Lo(!1)), G(e, t);
						};
						q(u, (e) => {
							V(wn) && e(f);
						});
						var p = z(u, 2), h = L(p), g = (e) => {
							var t = cc(), n = L(t, !0);
							M(t), B((e) => K(n, e), [() => Q("lbl.light")]), G(e, t);
						};
						q(h, (e) => {
							V(wn) && e(g);
						});
						var _ = z(h, 2);
						let ke;
						var v = L(_, !0);
						M(_), M(p);
						var y = z(p, 2);
						zr(y, 21, () => Cn, ([e, t, n]) => e, (e, t) => {
							var n = /* @__PURE__ */ P(() => m(V(t), 3));
							let r = () => V(n)[0], i = () => V(n)[1], a = () => V(n)[2];
							var o = lc(), s = L(o);
							{
								let e = /* @__PURE__ */ P(() => V(A).theme.tokens.color[r()] ?? V(A).theme.tokens.color.bg), t = /* @__PURE__ */ P(Sn);
								Vi(s, {
									get value() {
										return V(e);
									},
									get tokens() {
										return V(t);
									},
									get label() {
										return i();
									},
									onchange: (e) => Eo(r(), e)
								});
							}
							var c = z(s, 2), l = L(c, !0);
							M(c);
							var u = z(c, 2), d = L(u, !0);
							M(u), M(o), B((e) => {
								K(l, a()), K(d, e);
							}, [() => pl(V(A).theme.tokens.color[r()] ?? V(A).theme.tokens.color.bg, V(Dn))]), G(e, o);
						}), M(y);
						var b = z(y, 2), x = (e) => {
							var t = dc(), n = R(t), r = L(n), i = L(r, !0);
							M(r);
							var a = z(r, 2);
							let o;
							var s = L(a, !0);
							M(a), M(n);
							var c = z(n, 2);
							let l;
							zr(c, 21, () => Cn, ([e, t, n]) => e, (e, t) => {
								var n = /* @__PURE__ */ P(() => m(V(t), 3));
								let r = () => V(n)[0], i = () => V(n)[1], a = () => V(n)[2];
								var o = lc(), s = L(o);
								{
									let e = /* @__PURE__ */ P(() => V(A).theme.alt.tokens.color[r()] ?? V(On)[r()] ?? V(A).theme.tokens.color.bg), t = /* @__PURE__ */ P(Sn), n = /* @__PURE__ */ P(() => Q("theme.darkColorLabel", { name: i() }));
									Vi(s, {
										get value() {
											return V(e);
										},
										get tokens() {
											return V(t);
										},
										get label() {
											return V(n);
										},
										onchange: (e) => Mo(r(), e)
									});
								}
								var c = z(s, 2), l = L(c, !0);
								M(c);
								var u = z(c, 2), d = L(u, !0);
								M(u), M(o), B((e) => {
									K(l, a()), K(d, e);
								}, [() => pl(V(A).theme.alt.tokens.color[r()] ?? V(On)[r()], V(On))]), G(e, o);
							}), M(c);
							var u = z(c, 2), d = (e) => {
								var t = uc(), n = L(t, !0);
								M(t), B((e) => K(n, e), [() => Q("hint.theme.autoDark")]), G(e, t);
							};
							q(u, (e) => {
								V(Tn) && e(d);
							}), B((e, t, n) => {
								K(i, e), o = Xr(a, 1, "stdtag svelte-1n46o8q", null, o, { ghost: V(En) !== "dark" }), Z(a, "title", t), K(s, n), l = Xr(c, 1, "palcells svelte-1n46o8q", null, l, { autopal: V(Tn) });
							}, [
								() => Q("lbl.dark"),
								() => Q("tip.theme.darkDefault"),
								() => Q("common.standard")
							]), H("click", a, () => No("dark")), G(e, t);
						};
						q(b, (e) => {
							V(wn) && e(x);
						});
						var S = z(b, 2), C = L(S);
						{
							let t = /* @__PURE__ */ P(() => V(wn) ? Q("lbl.light") : "");
							e(C, () => V(Dn), () => V(t));
						}
						var w = z(C, 2), T = (t) => {
							{
								let n = /* @__PURE__ */ P(() => Q("lbl.dark"));
								e(t, () => V(On), () => V(n));
							}
						};
						q(w, (e) => {
							V(wn) && e(T);
						}), M(S);
						var E = z(S, 2), D = L(E), ee = L(D, !0);
						M(D);
						var te = z(D, 2), ne = L(te), re = L(ne), ie = z(re);
						{
							let e = /* @__PURE__ */ P(() => Ro("heading"));
							$(ie, {
								get value() {
									return V(A).theme.tokens.font.heading;
								},
								get options() {
									return V(e);
								},
								onchange: (e) => Do("heading", e)
							});
						}
						M(ne);
						var ae = z(ne, 2), oe = L(ae), se = z(oe);
						{
							let e = /* @__PURE__ */ P(() => Ro("body"));
							$(se, {
								get value() {
									return V(A).theme.tokens.font.body;
								},
								get options() {
									return V(e);
								},
								onchange: (e) => Do("body", e)
							});
						}
						M(ae);
						var ce = z(ae, 2), le = L(ce), ue = L(le, !0);
						M(le);
						var de = z(le, 2), fe = L(de, !0);
						M(de), M(ce), M(te), M(E);
						var pe = z(E, 2), me = L(pe), he = L(me, !0);
						M(me);
						var O = z(me, 2), ge = L(O), k = L(ge), _e = L(k, !0);
						M(k);
						var ve = z(k, 2), ye = L(ve, !0);
						M(ve), M(ge);
						var be = z(ge, 2), j = L(be, !0), xe = z(j), Se = L(xe, !0);
						M(xe), M(be);
						var Ce = z(be, 2);
						Y(Ce);
						var we = z(Ce, 2), Te = L(we, !0), Ee = z(Te), De = L(Ee, !0);
						M(Ee), M(we);
						var Oe = z(we, 2);
						Y(Oe), M(O), M(pe), M(t), B((e, t, n, i, a, u, d, f, p, m, h, g, y, b, x, S, C, w) => {
							K(r, e), K(o, t), Z(s, "title", n), ri(c, V(wn)), K(l, ` ${i ?? ""}`), ke = Xr(_, 1, "stdtag svelte-1n46o8q", null, ke, { ghost: V(En) !== "light" }), Z(_, "title", a), K(v, u), K(ee, d), K(re, `${f ?? ""} `), K(oe, `${p ?? ""} `), Qr(le, `font-family:${V(A).theme.tokens.font.heading ?? ""}`), K(ue, m), Qr(de, `font-family:${V(A).theme.tokens.font.body ?? ""}`), K(fe, h), K(he, g), Qr(ge, `--r-sm:${V(A).theme.tokens.radius.sm ?? ""};--r-md:${V(A).theme.tokens.radius.md ?? ""}`), K(_e, y), K(ye, b), K(j, x), K(Se, V(A).theme.tokens.radius.sm), X(Ce, S), K(Te, C), K(De, V(A).theme.tokens.radius.md), X(Oe, w);
						}, [
							() => Q("lbl.themePresets"),
							() => Q("lbl.colors"),
							() => Q("tip.theme.dualMode"),
							() => Q("lbl.dualMode"),
							() => Q("tip.theme.defaultScheme"),
							() => Q("common.standard"),
							() => Q("group.typography"),
							() => Q("lbl.headings"),
							() => Q("lbl.bodyText"),
							() => Q("preview.heading"),
							() => Q("preview.bodySample"),
							() => Q("group.shape"),
							() => Q("preview.button"),
							() => Q("preview.card"),
							() => Q("lbl.smallCorners"),
							() => dl(V(A).theme.tokens.radius.sm),
							() => Q("lbl.largeCorners"),
							() => dl(V(A).theme.tokens.radius.md)
						]), H("change", c, (e) => Po(e.target.checked)), H("click", _, () => No("light")), H("input", Ce, (e) => fl("sm", Number(e.target.value))), H("input", Oe, (e) => fl("md", Number(e.target.value)));
					}
					G(e, t);
				}, h = (e) => {
					var t = mc();
					let n;
					var r = L(t), i = L(r, !0);
					M(r);
					var a = z(r, 2), o = L(a), s = L(o, !0);
					M(o);
					var c = z(o, 2), l = L(c), u = L(l, !0);
					M(l);
					var d = z(l, 2), f = L(d, !0);
					M(d), M(c), M(a);
					var p = z(a, 2), m = L(p, !0);
					M(p);
					var h = z(p, 2), g = L(h), _ = z(g);
					M(h);
					var v = z(h, 2), y = L(v, !0);
					M(v);
					var b = z(v, 2), x = L(b, !0);
					M(b);
					var S = z(b, 2), C = L(S, !0);
					M(S);
					var w = z(S, 2), T = L(w, !0);
					M(w);
					var E = z(w, 2), D = L(E), te = L(D, !0);
					M(D);
					var ne = z(D, 2), re = L(ne), ie = L(re, !0);
					M(re);
					var ae = z(re, 2), oe = L(ae), se = z(oe);
					M(ae), M(ne), M(E);
					var ce = z(E, 2), le = L(ce), ue = L(le, !0);
					M(le);
					var de = z(le, 2), fe = L(de), pe = L(fe, !0);
					M(fe);
					var me = z(fe, 2), he = L(me, !0);
					M(me);
					var O = z(me, 2), ge = L(O, !0);
					M(O);
					var k = z(O, 2), A = L(k, !0);
					M(k);
					var _e = z(k, 2), ve = L(_e, !0);
					M(_e), M(de), M(ce);
					var ye = z(ce, 2), be = (e) => {
						var t = pc(), n = L(t), r = L(n, !0);
						M(n);
						var i = z(n, 2);
						zr(i, 21, () => V(Rl), (e) => e.type, (e, t) => {
							var n = kr(), r = R(n), i = (e) => {
								var n = pc(), r = L(n), i = L(r, !0);
								M(r);
								var a = z(r, 2);
								zr(a, 21, () => V(t).variants, (e) => e.label, (e, n) => {
									var r = _s(), i = L(r, !0);
									M(r), B((e) => {
										Z(r, "title", e), K(i, V(n).label);
									}, [() => Q("tip.blocks.fromPlugin", { plugin: V(t).plugin })]), H("click", r, () => zl(V(t), V(n).props)), G(e, r);
								}), M(a), M(n), B(() => K(i, V(t).label)), G(e, n);
							}, a = (e) => {
								var n = _s(), r = L(n, !0);
								M(n), B((e) => {
									Z(n, "title", e), K(r, V(t).label);
								}, [() => Q("tip.blocks.fromPlugin", { plugin: V(t).plugin })]), H("click", n, () => zl(V(t))), G(e, n);
							};
							q(r, (e) => {
								V(t).variants?.length ? e(i) : e(a, -1);
							}), G(e, n);
						}), M(i), M(t), B((e) => K(r, e), [() => Q("panel.plugins")]), G(e, t);
					};
					q(ye, (e) => {
						V(Rl).length && e(be);
					}), M(t), B((e, r, a, o, c, l, p, _, E, D, ne, se, ce, le, de, fe, me, O, k, _e, ye, be, j, xe, Se, Ce, we, Te) => {
						n = Xr(t, 1, "panel-body svelte-1n46o8q", null, n, { locked: V(ee) === "mobile" }), Z(t, "title", e), K(i, r), K(s, a), K(u, o), Z(d, "title", c), K(f, l), K(m, p), Z(h, "title", _), K(g, `${E ?? ""} `), Z(v, "title", D), K(y, ne), Z(b, "title", se), K(x, ce), Z(S, "title", le), K(C, de), Z(w, "title", fe), K(T, me), K(te, O), Z(re, "title", k), K(ie, _e), Z(ae, "title", ye), K(oe, `${be ?? ""} `), K(ue, j), K(pe, xe), K(he, Se), K(ge, Ce), K(A, we), K(ve, Te);
					}, [
						() => V(ee) === "mobile" ? Q("tip.blocks.mobileLocked") : void 0,
						() => Q("hint.blocks.intro"),
						() => Q("blocks.text"),
						() => Q("blocks.text"),
						() => Q("tip.blocks.textBox"),
						() => Q("ui.textBox"),
						() => Q("blocks.button"),
						() => Q("tip.webpAuto"),
						() => Q("blocks.image"),
						() => Q("tip.blocks.video"),
						() => Q("blocks.video"),
						() => Q("tip.blocks.icon"),
						() => Q("blocks.icon"),
						() => Q("tip.blocks.samling"),
						() => Q("blocks.samling"),
						() => Q("tip.blocks.faq"),
						() => Q("blocks.faq"),
						() => Q("blocks.galleri"),
						() => Q("tip.blocks.gallery"),
						() => Q("ui.emptyGallery"),
						() => Q("tip.blocks.galleryImages"),
						() => Q("ui.galleryWithImages"),
						() => Q("group.shapes"),
						() => Q("shape.line"),
						() => Q("shape.arrow"),
						() => Q("shape.circle"),
						() => Q("shape.rect"),
						() => Q("shape.triangle")
					]), H("click", l, () => Ll("text")), H("click", d, () => Ll("text-box")), H("click", p, () => Ll("button")), H("change", _, Vl), H("click", v, () => Ll("video")), H("click", b, () => Ll("icon")), H("click", S, () => Ll("samling")), H("click", w, () => Ll("faq")), H("click", re, () => Ll("galleri")), H("change", se, Gl), H("click", fe, () => Ll("shape-line")), H("click", me, () => Ll("shape-arrow")), H("click", O, () => Ll("shape-circle")), H("click", k, () => Ll("shape-rect")), H("click", _e, () => Ll("shape-triangle")), G(e, t);
				}, _ = (e) => {
					var t = hc(), n = L(t), r = L(n, !0);
					M(n);
					var i = z(n, 2), a = L(i), o = z(a), s = L(o);
					M(o), M(i);
					var c = z(i, 2);
					Y(c);
					var l = z(c, 2), u = L(l);
					Y(u);
					var d = z(u);
					M(l);
					var f = z(l, 2), p = L(f, !0);
					M(f), M(t), B((e, t, n, i) => {
						K(r, e), K(a, `${t ?? ""} `), K(s, `${V(E).size ?? ""} px`), X(c, V(E).size), ri(u, V(E).snap !== !1), K(d, ` ${n ?? ""}`), K(p, i);
					}, [
						() => Q("hint.grid.intro"),
						() => Q("lbl.gridSize"),
						() => Q("lbl.gridSnap"),
						() => Q("hint.grid.section")
					]), H("input", c, (e) => Gn("size", Number(e.target.value))), H("change", u, (e) => Gn("snap", e.target.checked)), G(e, t);
				}, v = (e) => {
					var t = Sc(), r = L(t), i = (e) => {
						var t = gc(), n = R(t), r = L(n, !0);
						M(n);
						var i = z(n, 2);
						a(i), B((e) => K(r, e), [() => Q("blocks.suffix", { label: xt[V(N).type] ?? V(N).type })]), G(e, t);
					}, o = (e) => {
						var t = xc(), r = R(t), i = L(r, !0);
						M(r);
						var a = z(r, 2), o = L(a), s = z(o);
						Y(s), M(a);
						var l = z(a, 2), u = L(l, !0);
						M(l);
						var d = z(l, 4), f = L(d);
						Y(f);
						var p = z(f);
						M(d);
						var m = z(d, 2), h = (e) => {
							var t = _c(), n = R(t), r = L(n), i = z(r), a = L(i);
							M(i), M(n);
							var o = z(n, 2);
							Y(o), B((e) => {
								K(r, `${e ?? ""} `), K(a, `${V(Tt).size ?? ""} px`), X(o, V(Tt).size);
							}, [() => Q("lbl.gridSize")]), H("input", o, (e) => Wn("size", Number(e.target.value))), G(e, t);
						};
						q(m, (e) => {
							V(Tt) && e(h);
						});
						var g = z(m, 4), _ = L(g), v = z(_);
						{
							let e = /* @__PURE__ */ P(() => [["", Q("common.standard")], ...Object.entries(Wa).map(([e, t]) => [e, Q(t)])]);
							$(v, {
								get value() {
									return V(At);
								},
								get options() {
									return V(e);
								},
								onchange: (e) => Ft(e)
							});
						}
						M(g);
						var y = z(g, 2), b = L(y), x = z(b), S = L(x), C = L(S);
						M(S);
						var w = z(S, 2);
						J(w, () => c.copy, !0), M(w), M(x), M(y);
						var T = z(y, 4), E = L(T, !0);
						M(T);
						var D = z(T, 2);
						n(D, () => V(vn), () => V(Dt));
						var ee = z(D, 4), te = L(ee), ne = z(te);
						{
							let e = /* @__PURE__ */ P(() => An(V(Ot)) ? V(Ot).type : "");
							$(ne, {
								get value() {
									return V(e);
								},
								get options() {
									return jn;
								},
								onchange: (e) => Ln(e || null)
							});
						}
						M(ee);
						var re = z(ee, 2), ie = (e) => {
							var t = bc(), n = R(t), r = L(n), i = z(r);
							Y(i), M(n);
							var a = z(n, 2), o = (e) => {
								var t = vc(), n = R(t), r = L(n), i = z(r);
								Y(i), M(n);
								var a = z(n, 2), o = L(a), s = z(o);
								{
									let e = /* @__PURE__ */ P(() => V(Ot).props.pattern ?? "sequence"), t = /* @__PURE__ */ P(() => [["sequence", Q("opt.stagger.sequence")], ["columns", Q("opt.stagger.columns")]]);
									$(s, {
										get value() {
											return V(e);
										},
										get options() {
											return V(t);
										},
										onchange: (e) => Bn(e)
									});
								}
								M(a), B((e, t, s, c) => {
									Z(n, "title", e), K(r, `${t ?? ""} `), X(i, V(Ot).props.step ?? 90), Z(a, "title", s), K(o, `${c ?? ""} `);
								}, [
									() => Q("tip.props.staggerStep"),
									() => Q("lbl.stepMs"),
									() => Q("tip.props.staggerPattern"),
									() => Q("lbl.pattern")
								]), H("change", i, (e) => zn("step", Number(e.target.value))), G(e, t);
							}, s = (e) => {
								var t = yc(), n = L(t), r = z(n);
								Y(r), M(t), B((e) => {
									K(n, `${e ?? ""} `), X(r, V(Ot).props.delay);
								}, [() => Q("lbl.delayMs")]), H("change", r, (e) => zn("delay", Number(e.target.value))), G(e, t);
							};
							q(a, (e) => {
								V(Ot).type === "stagger" ? e(o) : e(s, -1);
							}), B((e) => {
								K(r, `${e ?? ""} `), X(i, V(Ot).props.duration);
							}, [() => Q("lbl.durationMs")]), H("change", i, (e) => zn("duration", Number(e.target.value))), G(e, t);
						}, ae = /* @__PURE__ */ P(() => An(V(Ot)));
						q(re, (e) => {
							V(ae) && e(ie);
						});
						var oe = z(re, 2), se = L(oe), ce = z(se);
						{
							let e = /* @__PURE__ */ P(() => V(kt)?.type ?? (V(Ot) && !An(V(Ot)) ? V(Ot).type : ""));
							$(ce, {
								get value() {
									return V(e);
								},
								get options() {
									return Mn;
								},
								onchange: (e) => Rn(e || null)
							});
						}
						M(oe), B((e, t, n, r, a, c, l, d, m, h, v, x, S, T, D) => {
							K(i, e), K(o, `${t ?? ""} `), X(s, V(Et)), Z(s, "placeholder", n), K(u, r), ri(f, V(Tt) !== null), K(p, ` ${a ?? ""}`), Z(g, "title", c), K(_, `${l ?? ""} `), Z(y, "title", d), K(b, `${m ?? ""} `), K(C, `#${V(wt) ?? ""}`), Z(w, "title", h), K(E, v), Z(ee, "title", x), K(te, `${S ?? ""} `), Z(oe, "title", T), K(se, `${D ?? ""} `);
						}, [
							() => Q("lbl.section"),
							() => Q("lbl.minHeight"),
							() => Q("ph.minHeight"),
							() => Q("hint.props.minHeight"),
							() => Q("lbl.sectionGrid"),
							() => Q("tip.props.sectionTheme"),
							() => Q("lbl.sectionTheme"),
							() => Q("tip.props.anchor"),
							() => Q("lbl.anchor"),
							() => Q("tip.props.copyAnchor"),
							() => Q("lbl.background"),
							() => Q("tip.props.sectionAnim"),
							() => Q("lbl.animIn"),
							() => Q("tip.props.sectionHover"),
							() => Q("lbl.onHover")
						]), H("change", s, (e) => Vn(e.target.value)), H("change", f, (e) => Un(e.target.checked)), H("click", w, () => navigator.clipboard?.writeText(`#${V(wt)}`)), G(e, t);
					}, s = (e) => {
						var t = uc(), n = L(t, !0);
						M(t), B((e) => K(n, e), [() => Q("hint.props.empty")]), G(e, t);
					};
					q(r, (e) => {
						V(N) ? e(i) : V(wt) ? e(o, 1) : e(s, -1);
					}), M(t), G(e, t);
				}, y = (e) => {
					var t = Mc(), i = L(t), a = L(i);
					Y(a);
					var o = z(a);
					M(i);
					var s = z(i, 2), l = (e) => {
						var t = pc(), n = L(t), r = L(n, !0);
						M(n);
						var i = z(n, 2);
						zr(i, 21, () => V(A).pages ?? [], (e) => e.id, (e, t) => {
							var n = ps(), r = L(n);
							Y(r);
							var i = z(r);
							M(n), B((e, a) => {
								Z(n, "title", e), ri(r, a), K(i, ` ${(V(t).title || V(t).id) ?? ""}`);
							}, [() => Q("tip.footer.hideOnPage"), () => !(V(A).footer?.hideOn ?? []).includes(V(t).id)]), H("change", r, (e) => Ua(V(t).id, e.target.checked)), G(e, n);
						}), M(i), M(t), B((e) => K(r, e), [() => Q("group.showOnPages")]), G(e, t);
					};
					q(s, (e) => {
						V(A).footer?.show && e(l);
					});
					var u = z(s, 2), d = L(u), f = L(d, !0);
					M(d);
					var p = z(d, 2), m = L(p);
					zr(m, 21, () => Ca, (e) => e.id, (e, t) => {
						var n = Cc(), r = L(n);
						J(r, () => Io(V(t).thumb), !0), M(r);
						var i = z(r, 2), a = L(i, !0);
						M(i), M(n), B((e) => {
							Z(n, "title", e), K(a, V(t).label);
						}, [() => Q("tip.footer.template", { label: V(t).label })]), H("click", n, () => Ta(V(t).id)), G(e, n);
					}), M(m), M(p), M(u);
					var h = z(u, 2), g = L(h), _ = L(g, !0);
					M(g);
					var v = z(g, 2), y = L(v), b = L(y), x = z(b);
					Y(x), M(y);
					var S = z(y, 2), C = L(S), w = z(C);
					Y(w), M(S);
					var T = z(S, 2), E = L(T), D = z(E);
					{
						let e = /* @__PURE__ */ P(() => V(A).footer?.brand?.mode ?? "text"), t = /* @__PURE__ */ P(() => [
							["text", Q("blocks.text")],
							["image", Q("opt.brand.image")],
							["both", Q("opt.brand.both")]
						]);
						$(D, {
							get value() {
								return V(e);
							},
							get options() {
								return V(t);
							},
							onchange: (e) => ha(e)
						});
					}
					M(T);
					var ee = z(T, 2), te = (e) => {
						var t = Tc(), n = R(t), r = L(n), i = L(r), a = z(i);
						M(r);
						var o = z(r, 2), s = (e) => {
							var t = Uo();
							J(t, () => c.cross, !0), M(t), B((e) => Z(t, "title", e), [() => Q("tip.footer.removeLogo")]), H("click", t, _a), G(e, t);
						};
						q(o, (e) => {
							V(A).footer?.brand?.logo && e(s);
						}), M(n);
						var l = z(n, 2), u = (e) => {
							var t = wc(), n = R(t), r = L(n), i = z(r), a = L(i);
							M(i), M(n);
							var o = z(n, 2);
							Y(o), B((e) => {
								K(r, `${e ?? ""} `), K(a, `${V(A).footer?.brand?.logoHeight ?? 40 ?? ""} px`), X(o, V(A).footer?.brand?.logoHeight ?? 40);
							}, [() => Q("lbl.logoHeight")]), H("input", o, (e) => va(e.target.value)), G(e, t);
						};
						q(l, (e) => {
							V(A).footer?.brand?.logo && e(u);
						}), B((e, t) => {
							Z(r, "title", e), K(i, `${t ?? ""} `);
						}, [() => Q("tip.webpAutoPublish"), () => V(A).footer?.brand?.logo ? Q("ui.changeLogo") : Q("ui.uploadLogo")]), H("change", a, ga), G(e, t);
					};
					q(ee, (e) => {
						(V(A).footer?.brand?.mode ?? "text") !== "text" && e(te);
					}), M(v), M(h);
					var ne = z(h, 2), re = L(ne), ie = L(re, !0);
					M(re);
					var ae = z(re, 2), oe = L(ae);
					zr(oe, 17, () => V(A).footer?.columns ?? [], Fr, (e, t, n) => {
						var r = Ec(), i = R(r), a = L(i);
						Y(a);
						var o = z(a, 2), s = L(o);
						J(s, () => c.plus, !0), M(s);
						var l = z(s, 2);
						l.disabled = n === 0, J(l, () => c.up, !0), M(l);
						var u = z(l, 2);
						J(u, () => c.down, !0), M(u);
						var d = z(u, 2);
						J(d, () => c.cross, !0), M(d), M(o), M(i), zr(z(i, 2), 17, () => V(t).links ?? [], Fr, (e, r, i) => {
							var a = is(), o = L(a);
							Y(o);
							var s = z(o, 2), l = L(s);
							l.disabled = i === 0, J(l, () => c.up, !0), M(l);
							var u = z(l, 2);
							J(u, () => c.down, !0), M(u);
							var d = z(u, 2);
							J(d, () => c.cross, !0), M(d), M(s);
							var f = z(s, 2), p = L(f);
							{
								let e = /* @__PURE__ */ P(() => V(r).page ?? "__href"), t = /* @__PURE__ */ P(() => Q("tip.linkTarget")), a = /* @__PURE__ */ P(() => [...V(A).pages.map((e) => [e.id, e.title]), ["__href", Q("opt.linkHref")]]);
								$(p, {
									get value() {
										return V(e);
									},
									get title() {
										return V(t);
									},
									get options() {
										return V(a);
									},
									onchange: (e) => no(n, i, e)
								});
							}
							M(f);
							var m = z(f, 2), h = (e) => {
								var t = rs();
								Y(t), B((e, n) => {
									X(t, V(r).href ?? ""), Z(t, "placeholder", e), Z(t, "title", n);
								}, [() => Q("ph.hrefAnchor"), () => Q("tip.hrefAnchor")]), H("change", t, (e) => ro(n, i, e.target.value)), G(e, t);
							};
							q(m, (e) => {
								V(r).page || e(h);
							}), M(a), B((e, n) => {
								X(o, V(r).label), Z(o, "title", e), u.disabled = i === V(t).links.length - 1, Z(d, "title", n);
							}, [() => Q("tip.linkLabel"), () => Q("tip.removeLink")]), H("input", o, (e) => to(n, i, e.target.value)), H("click", l, () => eo(n, i, -1)), H("click", u, () => eo(n, i, 1)), H("click", d, () => $a(n, i)), G(e, a);
						}), B((e, r, i) => {
							X(a, V(t).title), Z(a, "title", e), Z(s, "title", r), u.disabled = n === V(A).footer.columns.length - 1, Z(d, "title", i);
						}, [
							() => Q("tip.footer.columnTitle"),
							() => Q("tip.footer.addLink"),
							() => Q("tip.footer.removeColumn")
						]), H("input", a, (e) => Za(n, e.target.value)), H("click", s, () => Qa(n)), H("click", l, () => Xa(n, -1)), H("click", u, () => Xa(n, 1)), H("click", d, () => Ya(n)), G(e, r);
					});
					var se = z(oe, 2), ce = L(se, !0);
					M(se);
					var le = z(se, 2), ue = L(le), de = z(ue);
					{
						let e = /* @__PURE__ */ P(() => V(A).footer?.columnsAlign ?? "left"), t = /* @__PURE__ */ P(() => [["left", Q("common.left")], ["center", Q("common.center")]]);
						$(de, {
							get value() {
								return V(e);
							},
							get options() {
								return V(t);
							},
							onchange: (e) => Ra(e)
						});
					}
					M(le), M(ae), M(ne);
					var fe = z(ne, 2), pe = L(fe), me = L(pe, !0);
					M(pe);
					var he = z(pe, 2), O = L(he);
					zr(O, 17, () => V(A).footer?.social ?? [], Fr, (e, t, n) => {
						var r = Dc(), i = L(r), a = L(i);
						J(a, () => la(V(t).icon) || "", !0), M(a);
						var o = z(a, 2);
						{
							let e = /* @__PURE__ */ P(() => Q("blocks.icon"));
							$(o, {
								get value() {
									return V(t).icon;
								},
								get title() {
									return V(e);
								},
								get options() {
									return po;
								},
								onchange: (e) => uo(n, e)
							});
						}
						M(i);
						var s = z(i, 2), l = L(s);
						l.disabled = n === 0, J(l, () => c.up, !0), M(l);
						var u = z(l, 2);
						J(u, () => c.down, !0), M(u);
						var d = z(u, 2);
						J(d, () => c.cross, !0), M(d), M(s);
						var f = z(s, 2);
						Y(f), M(r), B((e, r) => {
							u.disabled = n === V(A).footer.social.length - 1, Z(d, "title", e), X(f, V(t).url), Z(f, "placeholder", r);
						}, [() => Q("tip.removeLink"), () => Q("ph.hrefMailto")]), H("click", l, () => lo(n, -1)), H("click", u, () => lo(n, 1)), H("click", d, () => so(n)), H("change", f, (e) => fo(n, e.target.value)), G(e, r);
					});
					var ge = z(O, 2), k = L(ge, !0);
					M(ge), M(he), M(fe);
					var _e = z(fe, 2), ve = L(_e), ye = L(ve, !0);
					M(ve);
					var be = z(ve, 2), j = L(be), xe = L(j);
					Y(xe);
					var Se = z(xe);
					M(j);
					var Ce = z(j, 2), we = (e) => {
						let t = /* @__PURE__ */ P(() => V(A).footer.cta);
						var n = Ac(), r = R(n), i = L(r), a = z(i);
						{
							let e = /* @__PURE__ */ P(() => V(t).kind ?? "button"), n = /* @__PURE__ */ P(() => [["button", Q("opt.cta.button")], ["newsletter", Q("opt.cta.newsletter")]]);
							$(a, {
								get value() {
									return V(e);
								},
								get options() {
									return V(n);
								},
								onchange: (e) => Ba("kind", e)
							});
						}
						M(r);
						var o = z(r, 2), s = L(o);
						Y(s);
						var c = z(s);
						M(o);
						var l = z(o, 2), u = L(l), d = z(u);
						Y(d), M(l);
						var f = z(l, 2), p = L(f), m = z(p);
						Y(m), M(f);
						var h = z(f, 2), g = L(h), _ = z(g);
						Y(_), M(h);
						var v = z(h, 2), y = (e) => {
							var n = Oc(), r = R(n), i = L(r), a = z(i);
							{
								let e = /* @__PURE__ */ P(() => V(t).page ?? "__href"), n = /* @__PURE__ */ P(() => [...V(A).pages.map((e) => [e.id, e.title]), ["__href", Q("opt.linkHrefMailto")]]);
								$(a, {
									get value() {
										return V(e);
									},
									get options() {
										return V(n);
									},
									onchange: (e) => Ha(e)
								});
							}
							M(r);
							var o = z(r, 2), s = (e) => {
								var n = ds();
								Y(n), B((e, r) => {
									X(n, V(t).href ?? ""), Z(n, "placeholder", e), Z(n, "title", r);
								}, [() => Q("ph.hrefMailtoAnchor"), () => Q("tip.hrefAnchor")]), H("change", n, (e) => Ba("href", e.target.value)), G(e, n);
							};
							q(o, (e) => {
								V(t).page || e(s);
							}), B((e, t) => {
								Z(r, "title", e), K(i, `${t ?? ""} `);
							}, [() => Q("tip.footer.ctaTarget"), () => Q("lbl.buttonTarget")]), G(e, n);
						}, b = (e) => {
							var n = kc(), r = R(n), i = L(r), a = z(i);
							Y(a), M(r);
							var o = z(r, 2), s = L(o), c = z(s);
							Y(c), M(o);
							var l = z(o, 2), u = L(l), d = z(u);
							Y(d), M(l), B((e, n, f, p, m, h, g, _, v) => {
								Z(r, "title", e), K(i, `${n ?? ""} `), X(a, V(t).endpoint ?? ""), Z(a, "placeholder", f), Z(o, "title", p), K(s, `${m ?? ""} `), X(c, V(t).recipient ?? ""), Z(c, "placeholder", h), Z(l, "title", g), K(u, `${_ ?? ""} `), X(d, V(t).success ?? ""), Z(d, "placeholder", v);
							}, [
								() => Q("tip.footer.ctaEndpoint"),
								() => Q("lbl.newsletterEndpoint"),
								() => Q("ph.endpoint"),
								() => Q("tip.footer.ctaRecipient"),
								() => Q("lbl.recipientFallback"),
								() => Q("ph.email"),
								() => Q("tip.footer.ctaSuccess"),
								() => Q("lbl.confirmation"),
								() => Q("ph.footer.ctaSuccess")
							]), H("change", a, (e) => Ba("endpoint", e.target.value)), H("change", c, (e) => Ba("recipient", e.target.value)), H("input", d, (e) => Ba("success", e.target.value)), G(e, n);
						};
						q(v, (e) => {
							(V(t).kind ?? "button") === "button" ? e(y) : e(b, -1);
						}), B((e, n, a, v, y, b, x, S, C, w, T, E) => {
							Z(r, "title", e), K(i, `${n ?? ""} `), Z(o, "title", a), ri(s, V(t).big === !0), K(c, ` ${v ?? ""}`), Z(l, "title", y), K(u, `${b ?? ""} `), X(d, V(t).heading ?? ""), Z(d, "placeholder", x), Z(f, "title", S), K(p, `${C ?? ""} `), X(m, V(t).sub ?? ""), Z(h, "title", w), K(g, `${T ?? ""} `), X(_, V(t).label ?? ""), Z(_, "placeholder", E);
						}, [
							() => Q("tip.footer.ctaKind"),
							() => Q("common.type"),
							() => Q("tip.footer.ctaBig"),
							() => Q("lbl.bigCentered"),
							() => Q("tip.footer.ctaHeading"),
							() => Q("lbl.heading"),
							() => Q("ph.footer.ctaHeading"),
							() => Q("tip.footer.ctaSub"),
							() => Q("lbl.subText"),
							() => Q("tip.footer.ctaLabel"),
							() => Q("lbl.buttonText"),
							() => Q("ph.footer.ctaLabel")
						]), H("change", s, (e) => Ba("big", e.target.checked)), H("input", d, (e) => Ba("heading", e.target.value)), H("input", m, (e) => Ba("sub", e.target.value)), H("input", _, (e) => Ba("label", e.target.value)), G(e, n);
					};
					q(Ce, (e) => {
						V(A).footer?.cta && e(we);
					}), M(be), M(_e);
					var Te = z(_e, 2), Ee = L(Te), De = L(Ee, !0);
					M(Ee);
					var Oe = z(Ee, 2), ke = L(Oe);
					r(ke, () => "linkRow", () => V(A).footer?.linkRow ?? []);
					var Ae = z(ke, 2), je = L(Ae, !0);
					M(Ae), M(Oe), M(Te);
					var Ne = z(Te, 2), Pe = L(Ne), Fe = L(Pe, !0);
					M(Pe);
					var Ie = z(Pe, 2), Le = L(Ie), Re = (e) => {
						var t = jc(), n = R(t), r = L(n), i = z(r);
						{
							let e = /* @__PURE__ */ P(() => V(A).footer?.align ?? "left"), t = /* @__PURE__ */ P(() => [
								["left", Q("common.left")],
								["center", Q("common.center")],
								["right", Q("common.right")]
							]);
							$(i, {
								get value() {
									return V(e);
								},
								get options() {
									return V(t);
								},
								onchange: (e) => pa("footer", (t) => {
									t.align = e;
								})
							});
						}
						M(n), Me(2), B((e, t) => {
							Z(n, "title", e), K(r, `${t ?? ""} `);
						}, [() => Q("tip.footer.align"), () => Q("lbl.align")]), G(e, t);
					};
					q(Le, (e) => {
						V(A).footer?.cta?.big !== !0 && e(Re);
					});
					var ze = z(Le, 2), Be = L(ze, !0);
					M(ze);
					var Ve = z(ze, 2);
					n(Ve, () => xn, () => V(A).footer?.background?.layers ?? []), M(Ie), M(Ne);
					var He = z(Ne, 2), Ue = L(He), We = L(Ue, !0);
					M(Ue);
					var Ge = z(Ue, 2), Ke = L(Ge), qe = L(Ke), Je = z(qe);
					Y(Je), M(Ke);
					var Ye = z(Ke, 2), Xe = L(Ye, !0);
					M(Ye);
					var Ze = z(Ye, 2);
					r(Ze, () => "baseline", () => V(A).footer?.baseline ?? []);
					var Qe = z(Ze, 2), $e = L(Qe, !0);
					M(Qe), M(Ge), M(He), M(t), B((e, t, n, r, s, c, l, u, d, p, m, h, g, v, D, ee, te, ne, re, ae, oe, se, de, fe, pe, he, O, ge, _e, ve, be, Ce) => {
						Z(i, "title", e), ri(a, t), K(o, ` ${n ?? ""}`), K(f, r), K(_, s), Z(y, "title", c), K(b, `${l ?? ""} `), X(x, V(A).footer?.brand?.title ?? ""), Z(x, "placeholder", u), Z(S, "title", d), K(C, `${p ?? ""} `), X(w, V(A).footer?.brand?.tagline ?? ""), Z(T, "title", m), K(E, `${h ?? ""} `), K(ie, g), K(ce, v), Z(le, "title", D), K(ue, `${ee ?? ""} `), K(me, te), K(k, ne), K(ye, re), Z(j, "title", ae), ri(xe, oe), K(Se, ` ${se ?? ""}`), K(De, de), K(je, fe), K(Fe, pe), K(Be, he), K(We, O), Z(Ke, "title", ge), K(qe, `${_e ?? ""} `), X(Je, V(A).footer?.copyright ?? ""), Z(Je, "placeholder", ve), K(Xe, be), K($e, Ce);
					}, [
						() => Q("tip.footer.show"),
						() => !!V(A).footer?.show,
						() => Q("lbl.showFooter"),
						() => Q("group.startpoint"),
						() => Q("group.brand"),
						() => Q("tip.footer.brandTitle"),
						() => Q("lbl.title"),
						() => Q("ph.footer.brandTitle"),
						() => Q("tip.footer.tagline"),
						() => Q("lbl.tagline"),
						() => Q("tip.footer.brandMode"),
						() => Q("lbl.brandMode"),
						() => Q("group.columns"),
						() => Q("ui.addColumn"),
						() => Q("tip.footer.columnsAlign"),
						() => Q("lbl.splitColumnAlign"),
						() => Q("group.social"),
						() => Q("ui.addSocial"),
						() => Q("group.cta"),
						() => Q("tip.footer.cta"),
						() => !!V(A).footer?.cta,
						() => Q("lbl.showCta"),
						() => Q("group.linkRow"),
						() => Q("ui.addRowLink"),
						() => Q("group.appearance"),
						() => Q("lbl.background"),
						() => Q("group.baseline"),
						() => Q("tip.footer.copyright"),
						() => Q("lbl.copyright"),
						() => Q("ph.footer.copyright"),
						() => Q("lbl.baselineLinks"),
						() => Q("ui.addBaselineLink")
					]), H("change", a, (e) => pa("footer", (t) => {
						t.show = e.target.checked;
					})), H("input", x, (e) => ma("title", e.target.value)), H("input", w, (e) => ma("tagline", e.target.value)), H("click", se, Ja), H("click", ge, io), H("change", xe, (e) => za(e.target.checked)), H("click", Ae, () => Ea("linkRow")), H("input", Je, (e) => xa(e.target.value)), H("click", Qe, () => Ea("baseline")), G(e, t);
				}, b = (e) => {
					var t = Ic(), n = L(t), r = L(n, !0);
					M(n);
					var i = z(n, 2), a = (e) => {
						var t = as(), n = L(t), r = z(n);
						{
							let e = /* @__PURE__ */ P(() => V(hi) ?? ""), t = /* @__PURE__ */ P(() => [["", Q("common.choose")], ...V(pi).map((e) => [e, V(mi)[e]?.name ?? e])]);
							$(r, {
								get value() {
									return V(e);
								},
								get options() {
									return V(t);
								},
								onchange: (e) => I(hi, e || null, !0)
							});
						}
						M(t), B((e) => K(n, `${e ?? ""} `), [() => Q("blocks.samling")]), G(e, t);
					};
					q(i, (e) => {
						V(pi).length && e(a);
					});
					var o = z(i, 2), s = (e) => {
						let t = /* @__PURE__ */ P(() => V(mi)[V(hi)]);
						var n = Fc(), r = R(n), i = L(r), a = L(i, !0);
						M(i);
						var o = z(i, 2);
						J(o, () => c.cross, !0), M(o), M(r);
						var s = z(r, 2);
						zr(s, 19, () => V(t).entries, (e) => e.id, (e, n, r) => {
							var i = Pc(), a = L(i), o = L(a);
							M(a);
							var s = z(a, 2), l = L(s), u = L(l);
							Y(u);
							var d = z(u, 2), f = L(d);
							J(f, () => c.up, !0), M(f);
							var p = z(f, 2);
							J(p, () => c.down, !0), M(p);
							var m = z(p, 2);
							J(m, () => c.cross, !0), M(m), M(d), M(l);
							var h = z(l, 2), g = L(h), _ = z(g);
							Y(_), M(h);
							var v = z(h, 2);
							it(v);
							var y = z(v, 2), b = L(y), x = z(b);
							Y(x), M(y);
							var S = z(y, 2), C = L(S), w = L(C), T = z(w);
							M(C);
							var E = z(C, 2), D = (e) => {
								var t = Nc(), r = R(t), i = z(r, 2);
								J(i, () => c.cross, !0), M(i), B((e) => {
									Z(r, "src", V(n).image), Z(i, "title", e);
								}, [() => Q("tip.removeImage")]), H("click", i, () => Ai(V(hi), V(n).id, "image", "")), G(e, t);
							};
							q(E, (e) => {
								V(n).image && e(D);
							}), M(S), M(s), M(i), B((e, i, a, s, c, l, d, h) => {
								K(o, `${e ?? ""}${V(n).date ? ` · ${V(n).date}` : ""}`), X(u, V(n).title), Z(u, "title", i), f.disabled = V(r) === 0, p.disabled = V(r) === V(t).entries.length - 1, Z(m, "title", a), K(g, `${s ?? ""} `), X(_, V(n).date ?? ""), Z(v, "placeholder", c), X(v, V(n).text ?? ""), K(b, `${l ?? ""} `), X(x, V(n).href ?? ""), Z(x, "placeholder", d), K(w, `${h ?? ""} `);
							}, [
								() => V(n).title.replace(/<[^>]*>/g, ""),
								() => Q("lbl.title"),
								() => Q("tip.collections.deleteEntry"),
								() => Q("lbl.date"),
								() => Q("ph.collections.text"),
								() => Q("lbl.link"),
								() => Q("ph.collections.href"),
								() => V(n).image ? Q("ui.changeImage") : Q("ui.addImage")
							]), H("change", u, (e) => Ai(V(hi), V(n).id, "title", e.target.value || "Uten tittel")), H("click", f, () => ji(V(hi), V(r), -1)), H("click", p, () => ji(V(hi), V(r), 1)), H("click", m, () => Mi(V(hi), V(n).id)), H("change", _, (e) => Ai(V(hi), V(n).id, "date", e.target.value)), H("change", v, (e) => Ai(V(hi), V(n).id, "text", e.target.value)), H("change", x, (e) => Ai(V(hi), V(n).id, "href", e.target.value)), H("change", T, (e) => Ni(V(hi), V(n).id, e)), G(e, i);
						});
						var l = z(s, 2), u = (e) => {
							var t = uc(), n = L(t, !0);
							M(t), B((e) => K(n, e), [() => Q("hint.collections.empty")]), G(e, t);
						};
						q(l, (e) => {
							V(t).entries.length || e(u);
						}), Me(2), B((e, t) => {
							K(a, e), Z(o, "title", t);
						}, [() => Q("ui.addEntry"), () => Q("tip.collections.deleteCollection")]), H("click", i, () => Oi(V(hi))), H("click", o, () => Di(V(hi))), G(e, n);
					};
					q(o, (e) => {
						V(hi) && V(mi)[V(hi)] && e(s);
					});
					var l = z(o, 2), u = L(l), d = z(u);
					Y(d), M(l);
					var f = z(l, 2), p = L(f);
					$(z(p), {
						get value() {
							return V(_i);
						},
						get options() {
							return vi;
						},
						onchange: (e) => I(_i, e, !0)
					}), M(f);
					var m = z(f, 2), h = L(m, !0);
					M(m), M(t), B((e, t, n, i, a, o) => {
						K(r, e), K(u, `${t ?? ""} `), Z(d, "placeholder", n), K(p, `${i ?? ""} `), m.disabled = a, K(h, o);
					}, [
						() => Q("hint.collections.intro"),
						() => Q("lbl.newCollectionName"),
						() => Q("ph.collections.name"),
						() => Q("common.type"),
						() => !V(gi).trim(),
						() => Q("ui.createCollection")
					]), H("keydown", d, (e) => e.key === "Enter" && Ei()), si(d, () => V(gi), (e) => I(gi, e)), H("click", m, Ei), G(e, t);
				}, x = (e) => {
					var t = Uc(), n = L(t), r = L(n, !0);
					M(n);
					var i = z(n, 2), a = (e) => {
						var t = uc(), n = L(t, !0);
						M(t), B((e) => K(n, e), [() => Q("hint.plugins.empty")]), G(e, t);
					}, o = /* @__PURE__ */ P(() => !qi().length);
					q(i, (e) => {
						V(o) && e(a);
					});
					var s = z(i, 2);
					zr(s, 16, qi, (e) => e, (e, t) => {
						let n = /* @__PURE__ */ P(() => Ri[t]), r = /* @__PURE__ */ P(() => (V(Li)?.enabled ?? []).includes(t));
						var i = zc();
						let a;
						var o = L(i), s = L(o), l = L(s, !0);
						M(s);
						var u = z(s, 2), d = (e) => {
							var t = Lc(), r = L(t);
							M(t), B(() => K(r, `v${V(n).version ?? ""}`)), G(e, t);
						};
						q(u, (e) => {
							V(n)?.version && e(d);
						});
						var f = z(u, 2), p = L(f), m = L(p);
						Y(m);
						var h = z(m);
						M(p);
						var g = z(p, 2);
						J(g, () => c.cross, !0), M(g), M(f), M(o);
						var _ = z(o, 2), v = (e) => {
							var t = Rc(), r = L(t, !0);
							M(t), B((e) => K(r, e), [() => V(n).errors.join("; ")]), G(e, t);
						}, y = (e) => {
							var t = Rc(), r = L(t, !0);
							M(t), B((e) => K(r, e), [() => Q("plugin.engineMismatch", {
								required: V(n).requiresEngine,
								current: V(zi)
							})]), G(e, t);
						}, b = (e) => {
							var t = Rc(), r = L(t, !0);
							M(t), B((e) => K(r, e), [() => Q("plugin.cspNeeded", { list: [...(V(n).csp.connectSrc ?? []).map((e) => `connect-src ${e}`), ...(V(n).csp.frameSrc ?? []).map((e) => `frame-src ${e}`)].join(", ") })]), G(e, t);
						};
						q(_, (e) => {
							V(n)?.errors?.length ? e(v) : V(n) && !V(n).satisfied ? e(y, 1) : V(n)?.csp && e(b, 2);
						});
						var x = z(_, 2), S = (e) => {
							var t = uc(), r = L(t, !0);
							M(t), B((e) => K(r, e), [() => Q("plugin.languages", { list: V(n).languages.map((e) => e.name).join(", ") })]), G(e, t);
						};
						q(x, (e) => {
							V(n)?.languages?.length && e(S);
						}), M(i), B((e, t, o, s, c) => {
							a = Xr(i, 1, "plugin-row svelte-1n46o8q", null, a, { "plugin-broken": V(n)?.errors?.length }), K(l, e), Z(p, "title", t), ri(m, V(r)), m.disabled = o, K(h, ` ${s ?? ""}`), Z(g, "title", c);
						}, [
							() => V(n)?.names?.[Ti()] ?? V(n)?.name ?? t,
							() => V(r) ? Q("tip.plugins.on") : Q("tip.plugins.off"),
							() => !!V(n)?.errors?.length,
							() => V(r) ? Q("ui.on") : Q("ui.off"),
							() => Q("tip.plugins.remove")
						]), H("change", m, (e) => aa(t, e.target.checked)), H("click", g, () => ua(t)), G(e, i);
					});
					var l = z(s, 2), u = (e) => {
						var t = Vc(), n = z(R(t), 2), r = L(n, !0);
						M(n), zr(z(n, 2), 16, () => V(Ui), (e) => e, (e, t) => {
							var n = Bc(), r = L(n), i = L(r), a = L(i, !0);
							M(i);
							var o = z(i, 2), s = (e) => {
								var n = Lc(), r = L(n);
								M(n), B(() => K(r, `v${Ri[t].version ?? ""}`)), G(e, n);
							};
							q(o, (e) => {
								Ri[t]?.version && e(s);
							});
							var l = z(o, 2), u = L(l);
							J(u, () => c.right, !0), M(u), M(l), M(r), M(n), B((e, t) => {
								K(a, e), Z(u, "title", t);
							}, [() => Ri[t]?.names?.[Ti()] ?? Ri[t]?.name ?? t, () => Q("tip.plugins.addFound")]), H("click", u, () => fa(t)), G(e, n);
						}), B((e) => K(r, e), [() => Q("hint.plugins.found")]), G(e, t);
					};
					q(l, (e) => {
						V(Ui).length && e(u);
					});
					var d = z(l, 2), f = (e) => {
						var t = kr(), n = R(t), r = (e) => {
							var t = uc(), n = L(t, !0);
							M(t), B((e) => K(n, e), [() => Q("hint.plugins.autoDiscover")]), G(e, t);
						};
						q(n, (e) => {
							V(Ui).length || e(r);
						}), G(e, t);
					}, p = (e) => {
						var t = Hc(), n = z(R(t), 2);
						Y(n);
						var r = z(n, 2), i = L(r, !0);
						M(r);
						var a = z(r, 2), o = (e) => {
							var t = Rc(), n = L(t, !0);
							M(t), B(() => K(n, V(Hi))), G(e, t);
						};
						q(a, (e) => {
							V(Hi) && e(o);
						}), B((e, t, a) => {
							Z(n, "placeholder", e), r.disabled = t, K(i, a);
						}, [
							() => Q("ph.plugins.folder"),
							() => !V(Bi).trim(),
							() => Q("ui.addPlugin")
						]), H("keydown", n, (e) => e.key === "Enter" && da()), si(n, () => V(Bi), (e) => I(Bi, e)), H("click", r, da), G(e, t);
					};
					q(d, (e) => {
						V(Ki) === "ok" ? e(f) : e(p, -1);
					}), M(t), B((e) => K(r, e), [() => Q("hint.plugins.intro")]), G(e, t);
				}, S = (e) => {
					var t = Kc(), n = L(t), r = L(n, !0);
					M(n);
					var i = z(n, 2), a = (e) => {
						var t = uc(), n = L(t, !0);
						M(t), B((e) => K(n, e), [() => Q("hint.history.loading")]), G(e, t);
					}, o = (e) => {
						var t = Hs(), n = R(t), r = (e) => {
							var t = uc(), n = L(t, !0);
							M(t), B(() => K(n, V(Zn))), G(e, t);
						};
						q(n, (e) => {
							V(Zn) && e(r);
						});
						var i = z(n, 2), a = (e) => {
							var t = Gc(), n = R(t), r = L(n, !0);
							M(n), zr(z(n, 2), 19, () => V(Xn), (e) => e.sha, (e, t, n) => {
								var r = Wc();
								let i;
								var a = L(r), o = L(a, !0);
								M(a);
								var s = z(a, 2), c = L(s);
								M(s), M(r), B((e) => {
									i = Xr(r, 1, "history-row svelte-1n46o8q", null, i, { head: V(n) === 0 }), Z(a, "title", V(t).sha), K(o, V(t).message), K(c, `${V(t).author ?? ""}${e ?? ""}`);
								}, [() => V(t).date ? ` · ${er.format(new Date(V(t).date))}` : ""]), G(e, r);
							}), B((e, t) => {
								n.disabled = V(Qn) || !V(T)?.allowed, Z(n, "title", e), K(r, t);
							}, [() => V(T)?.allowed ? Q("tip.history.revert") : Q("tip.history.needsAccess"), () => Q("ui.revertLast")]), H("click", n, nr), G(e, t);
						};
						q(i, (e) => {
							V(Xn).length > 0 && e(a);
						}), G(e, t);
					};
					q(i, (e) => {
						V(Xn) === null ? e(a) : e(o, -1);
					}), M(t), B((e) => K(r, e), [() => Q("hint.history.intro")]), G(e, t);
				}, C = (e) => {
					var t = Sc(), n = L(t), r = (e) => {
						var t = uc(), n = L(t, !0);
						M(t), B((e) => K(n, e), [() => Q("update.checking")]), G(e, t);
					}, i = (e) => {
						var t = qc(), n = R(t), r = L(n, !0);
						M(n);
						var i = z(n, 2), a = L(i, !0);
						M(i), B((e) => {
							K(r, V(ar)), K(a, e);
						}, [() => Q("update.retry")]), H("click", i, cr), G(e, t);
					}, a = (e) => {
						var t = el(), n = R(t), r = L(n), i = L(r, !0);
						M(r);
						var a = z(r, 2), o = (e) => {
							var t = Jc(), n = L(t, !0);
							M(t), B((e) => K(n, e), [() => Q("update.available", { target: V(ir).target })]), G(e, t);
						};
						q(a, (e) => {
							V(ir).upToDate || e(o);
						}), M(n);
						var s = z(n, 2), l = (e) => {
							var t = uc(), n = L(t, !0);
							M(t), B((e) => K(n, e), [() => Q("update.upToDate")]), G(e, t);
						}, u = (e) => {
							var t = $c(), n = R(t), r = (e) => {
								var t = Yc(), n = R(t), r = L(n, !0);
								M(n);
								var i = z(n, 2), a = L(i, !0);
								M(i), B((e) => {
									K(r, e), K(a, V(ir).headers.upstream);
								}, [() => Q("update.headersManual")]), G(e, t);
							};
							q(n, (e) => {
								V(ir).headers?.upstream && e(r);
							});
							var i = z(n, 2), a = L(i, !0);
							M(i);
							var o = z(i, 2);
							zr(o, 17, () => V(ir).changes.filter((e) => e.atom), (e) => e.path, (e, t) => {
								var n = Zc(), r = L(n), i = L(r, !0);
								M(r);
								var a = z(r, 2), o = L(a), s = (e) => {
									var t = Or();
									B((e) => K(t, e), [() => Q("update.actionDelete")]), G(e, t);
								};
								q(o, (e) => {
									V(t).action === "delete" && e(s);
								});
								var l = z(o, 2), u = (e) => {
									var n = Xc();
									J(n, () => c.warn, !0), M(n), B((e) => Z(n, "title", e), [() => Q(`update.conflict.${V(t).conflict}`)]), G(e, n);
								};
								q(l, (e) => {
									V(t).conflict && e(u);
								}), M(a), M(n), B(() => {
									Z(r, "title", V(t).path), K(i, V(t).path);
								}), G(e, n);
							});
							var s = z(o, 2), l = (e) => {
								var t = gc(), n = R(t), r = L(n, !0);
								M(n), zr(z(n, 2), 17, () => V(ir).changes.filter((e) => !e.atom), (e) => e.path, (e, t) => {
									var n = Qc(), r = L(n);
									let i;
									var a = L(r, !0);
									M(r);
									var o = z(r, 2), s = L(o), l = (e) => {
										var t = Or();
										B((e) => K(t, e), [() => Q("update.actionDelete")]), G(e, t);
									};
									q(s, (e) => {
										V(t).action === "delete" && e(l);
									});
									var u = z(s, 2), d = (e) => {
										var n = Xc();
										J(n, () => c.warn, !0), M(n), B((e) => Z(n, "title", e), [() => Q(`update.conflict.${V(t).conflict}`)]), G(e, n);
									};
									q(u, (e) => {
										V(t).conflict && e(d);
									});
									var f = z(u, 2), p = L(f);
									Y(p);
									var m = z(p);
									M(f), M(o), M(n), B((e, n, o, s) => {
										i = Xr(r, 1, "update-path svelte-1n46o8q", null, i, e), Z(r, "title", V(t).path), K(a, V(t).path), Z(f, "title", n), ri(p, o), K(m, ` ${s ?? ""}`);
									}, [
										() => ({ skipped: V(sr).has(V(t).path) }),
										() => Q("update.keepMine.title"),
										() => V(sr).has(V(t).path),
										() => Q("update.keepMine")
									]), H("change", p, () => lr(V(t).path)), G(e, n);
								}), B((e) => K(r, e), [() => Q("update.optionalTitle")]), G(e, t);
							}, u = /* @__PURE__ */ P(() => V(ir).changes.some((e) => !e.atom));
							q(s, (e) => {
								V(u) && e(l);
							});
							var d = z(s, 2), f = L(d, !0);
							M(d), B((e, t, n) => {
								K(a, e), d.disabled = V(or) || !V(T)?.allowed, Z(d, "title", t), K(f, n);
							}, [
								() => Q("update.atomTitle"),
								() => V(T)?.allowed ? Q("update.run.title") : Q("tip.history.needsAccess"),
								() => Q("update.run", { target: V(ir).target })
							]), H("click", d, ur), G(e, t);
						};
						q(s, (e) => {
							V(ir).upToDate ? e(l) : e(u, -1);
						}), B((e) => K(i, e), [() => Q("update.current", { version: V(ir).current })]), G(e, t);
					};
					q(n, (e) => {
						V(or) && !V(ir) ? e(r) : V(ar) ? e(i, 1) : V(ir) && e(a, 2);
					}), M(t), G(e, t);
				};
				q(s, (e) => {
					V(qe) === "pages" ? e(l) : V(qe) === "nav" ? e(u, 1) : V(qe) === "site" ? e(f, 2) : V(qe) === "theme" ? e(p, 3) : V(qe) === "blocks" ? e(h, 4) : V(qe) === "grid" ? e(_, 5) : V(qe) === "properties" ? e(v, 6) : V(qe) === "footer" ? e(y, 7) : V(qe) === "collections" ? e(b, 8) : V(qe) === "plugins" ? e(x, 9) : V(qe) === "history" ? e(S, 10) : V(qe) === "update" && e(C, 11);
				}), M(t), B(() => K(o, Ye[V(qe)])), G(e, t);
			};
			q(v, (e) => {
				V(qe) && e(y);
			}), B((e) => {
				p = Xr(f, 1, "rail-gear svelte-1n46o8q", null, p, { active: V(vr) }), Z(f, "title", e);
			}, [() => Q("settings.title")]), H("click", f, () => I(vr, !V(vr))), G(e, t);
		};
		q(i, (e) => {
			V(D) && e(o);
		});
		var s = z(i, 2);
		let f;
		var p = L(s), h = L(p);
		di(h, (e) => I(w, e), () => V(w)), M(p), M(s), di(s, (e) => I(te, e), () => V(te)), M(t), B((e) => {
			f = Xr(s, 1, "frame-wrap svelte-1n46o8q", null, f, { mobile: V(ee) === "mobile" }), Qr(p, `width:${V(de) ?? ""}px; height:${V(fe) ?? ""}px`), Z(h, "title", e), Z(h, "src", `/?page=${V(g)}&preview=1`), Qr(h, `width:${V(se) ?? ""}px; height:${V(ue) ?? ""}px; transform:scale(${V(ce) ?? ""}); transform-origin:top left`);
		}, [() => Q("ui.previewTitle")]), xr("load", h, hr), yr(h), G(e, t);
	}, xu = (e) => {
		var t = il(), n = L(t, !0);
		M(t), B((e) => K(n, e), [() => Q("ui.loading")]), G(e, t);
	};
	q(yu, (e) => {
		V(h) ? e(bu) : e(xu, -1);
	});
	var Su = z(yu, 2), Cu = (e) => {
		Da(e, {
			get image() {
				return V(Lr);
			},
			onapply: Br,
			oncancel: () => I(Lr, null)
		});
	};
	q(Su, (e) => {
		V(Lr) && e(Cu);
	});
	var wu = z(Su, 2), Tu = (e) => {
		var t = ol(), n = L(t), r = L(n), i = L(r, !0);
		M(r);
		var a = z(r, 2);
		zr(a, 16, () => V(Fe).lines, (e) => e, (e, t) => {
			var n = al(), r = L(n, !0);
			M(n), B(() => K(r, t)), G(e, n);
		});
		var o = z(a, 2), s = L(o), c = L(s, !0);
		M(s);
		var l = z(s, 2), u = L(l, !0);
		M(l), M(o), M(n), M(t), B(() => {
			K(i, V(Fe).title), K(c, V(Fe).cancelLabel), K(u, V(Fe).okLabel);
		}), H("click", s, () => Le(!1)), H("click", l, () => Le(!0)), G(e, t);
	};
	q(wu, (e) => {
		V(Fe) && e(Tu);
	});
	var Eu = z(wu, 2), Du = (e) => {
		var t = sl(), n = L(t), r = L(n), i = L(r, !0);
		M(r);
		var a = z(r, 2), o = L(a, !0);
		M(a);
		var s = z(a, 2), c = L(s), l = z(c);
		Y(l), M(s);
		var u = z(s, 2), d = L(u), f = z(d);
		{
			let e = /* @__PURE__ */ P(() => Q("setup.accentPick"));
			Vi(f, {
				get value() {
					return V(Ve);
				},
				get label() {
					return V(e);
				},
				onchange: (e) => I(Ve, e, !0)
			});
		}
		M(u);
		var p = z(u, 2), m = L(p), h = z(m);
		{
			let e = /* @__PURE__ */ P(() => Q("setup.bgLabel"));
			Vi(h, {
				get value() {
					return V(He);
				},
				get label() {
					return V(e);
				},
				onchange: (e) => I(He, e, !0)
			});
		}
		M(p);
		var g = z(p, 2), _ = L(g, !0);
		M(g);
		var v = z(g, 2), y = L(v), b = L(y, !0);
		M(y);
		var x = z(y, 2), S = L(x, !0);
		M(x), M(v), M(n), M(t), B((e, t, n, r, a, s, u, f, p, h) => {
			K(i, e), K(o, t), K(c, `${n ?? ""} `), Z(l, "placeholder", r), K(d, `${a ?? ""} `), K(m, `${s ?? ""} `), K(_, u), K(b, f), x.disabled = p, K(S, h);
		}, [
			() => Q("setup.title"),
			() => Q("setup.intro"),
			() => Q("setup.nameLabel"),
			() => Q("ph.setup.name"),
			() => Q("setup.accentLabel"),
			() => Q("setup.bgLabel"),
			() => Q("setup.outro"),
			() => Q("setup.skip"),
			() => !V(Be).trim(),
			() => Q("setup.start")
		]), H("keydown", l, (e) => e.key === "Enter" && Ke()), si(l, () => V(Be), (e) => I(Be, e)), H("click", y, Ge), H("click", x, Ke), G(e, t);
	};
	q(Eu, (e) => {
		V(Re) && e(Du);
	});
	var Ou = z(Eu, 2), ku = (e) => {
		var t = cl();
		let n;
		var r = L(t), i = L(r, !0);
		M(r);
		var a = z(r, 2);
		M(t), B((e) => {
			n = Xr(t, 1, "toast svelte-1n46o8q", null, n, {
				ok: V(y) === "ok",
				error: V(y) === "error"
			}), K(i, V(v)), Z(a, "title", e);
		}, [() => Q("ui.close")]), H("click", a, () => x("")), G(e, t);
	};
	q(Ou, (e) => {
		V(v) && e(ku);
	}), M(iu);
	var Au = z(iu, 2), ju = (e) => {
		var t = ll(), n = L(t), r = L(n), i = L(r, !0);
		M(r);
		var o = z(r, 2);
		J(o, () => c.cross, !0), M(o), M(n);
		var s = z(n, 2), l = L(s);
		a(l), M(s), M(t), B((e, n) => {
			Qr(t, `left: ${V(ct).left ?? ""}px; top: ${V(ct).top ?? ""}px`), K(i, e), Z(o, "title", n);
		}, [() => Q("blocks.suffix", { label: xt[V(N).type] ?? V(N).type }), () => Q("tip.closeEsc")]), H("click", o, () => I(ct, null)), G(e, t);
	};
	q(Au, (e) => {
		V(ct) && V(N) && e(ju);
	}), B(() => cu = Xr(su, 1, "topbar svelte-1n46o8q", null, cu, { hidden: !V(D) })), G(e, ru), We();
}
//#endregion
//#region src/main.js
Sr([
	"click",
	"input",
	"pointerdown",
	"change",
	"keydown"
]), document.documentElement.lang = await Oi();
var fl = Ar(dl, { target: document.getElementById("urd-admin") });
//#endregion
export { fl as default };
