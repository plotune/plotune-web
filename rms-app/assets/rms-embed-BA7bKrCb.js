// \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t, t.exports), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, o) => (o = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)), l = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.for("react.activity"), p = Symbol.for("react.view_transition"), m = Symbol.iterator;
	function h(e) {
		return typeof e != "object" || !e ? null : (e = m && e[m] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var g = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, _ = Object.assign, v = {};
	function y(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	y.prototype.isReactComponent = {}, y.prototype.setState = function(e, t) {
		if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, e, t, "setState");
	}, y.prototype.forceUpdate = function(e) {
		this.updater.enqueueForceUpdate(this, e, "forceUpdate");
	};
	function b() {}
	b.prototype = y.prototype;
	function x(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	var S = x.prototype = new b();
	S.constructor = x, _(S, y.prototype), S.isPureReactComponent = !0;
	var C = Array.isArray;
	function w() {}
	var T = {
		H: null,
		A: null,
		T: null,
		S: null
	}, E = Object.prototype.hasOwnProperty;
	function D(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function O(e, t) {
		return D(e.type, t, e.props);
	}
	function k(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function A(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var j = /\/+/g;
	function M(e, t) {
		return typeof e == "object" && e && e.key != null ? A("" + e.key) : t.toString(36);
	}
	function N(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(w, w) : (e.status = "pending", e.then(function(t) {
				e.status === "pending" && (e.status = "fulfilled", e.value = t);
			}, function(t) {
				e.status === "pending" && (e.status = "rejected", e.reason = t);
			})), e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
			}
		}
		throw e;
	}
	function P(e, r, i, a, o) {
		var s = typeof e;
		(s === "undefined" || s === "boolean") && (e = null);
		var c = !1;
		if (e === null) c = !0;
		else switch (s) {
			case "bigint":
			case "string":
			case "number":
				c = !0;
				break;
			case "object": switch (e.$$typeof) {
				case t:
				case n:
					c = !0;
					break;
				case d: return c = e._init, P(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + M(e, 0) : a, C(o) ? (i = "", c != null && (i = c.replace(j, "$&/") + "/"), P(o, r, i, "", function(e) {
			return e;
		})) : o != null && (k(o) && (o = O(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(j, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (C(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + M(a, u), c += P(a, r, i, s, o);
		else if (u = h(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + M(a, u++), c += P(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return P(N(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function F(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return P(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function I(e) {
		if (e._status === -1) {
			var t = e._result, n = t();
			n.then(function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 1, e._result = t, n.status === void 0 && (n.status = "fulfilled", n.value = t));
			}, function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 2, e._result = t, n.status === void 0 && (n.status = "rejected", n.reason = t));
			}), e._status === -1 && (e._status = 0, e._result = n);
		}
		if (e._status === 1) return e._result.default;
		throw e._result;
	}
	var ee = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	};
	function te(e) {
		var t = T.T, n = {};
		n.types = t === null ? null : t.types, T.T = n;
		try {
			var r = e(), i = T.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(w, ee);
		} catch (e) {
			ee(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), T.T = t;
		}
	}
	function ne(e) {
		var t = T.T;
		if (t !== null) {
			var n = t.types;
			n === null ? t.types = [e] : n.indexOf(e) === -1 && n.push(e);
		} else te(ne.bind(null, e));
	}
	var re = {
		map: F,
		forEach: function(e, t, n) {
			F(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return F(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return F(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!k(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = re, e.Component = y, e.Fragment = r, e.Profiler = a, e.PureComponent = x, e.StrictMode = i, e.Suspense = l, e.ViewTransition = p, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = T, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return T.H.useMemoCache(e);
		}
	}, e.addTransitionType = ne, e.cache = function(e) {
		return function() {
			return e.apply(null, arguments);
		};
	}, e.cacheSignal = function() {
		return null;
	}, e.cloneElement = function(e, t, n) {
		if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
		var r = _({}, e.props), i = e.key;
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !E.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return D(e.type, i, r);
	}, e.createContext = function(e) {
		return e = {
			$$typeof: s,
			_currentValue: e,
			_currentValue2: e,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		}, e.Provider = e, e.Consumer = {
			$$typeof: o,
			_context: e
		}, e;
	}, e.createElement = function(e, t, n) {
		var r, i = {}, a = null;
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) E.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return D(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = k, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: I
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = te, e.unstable_useCacheRefresh = function() {
		return T.H.useCacheRefresh();
	}, e.use = function(e) {
		return T.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return T.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return T.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return T.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return T.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return T.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return T.H.useEffectEvent(e);
	}, e.useId = function() {
		return T.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return T.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return T.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return T.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return T.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return T.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return T.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return T.H.useRef(e);
	}, e.useState = function(e) {
		return T.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return T.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return T.H.useTransition();
	}, e.version = "19.3.1";
})), u = /* @__PURE__ */ o(((e, t) => {
	t.exports = l();
})), d = /* @__PURE__ */ o(((e) => {
	function t(e, t) {
		var n = e.length;
		e.push(t);
		a: for (; 0 < n;) {
			var r = n - 1 >>> 1, a = e[r];
			if (0 < i(a, t)) e[r] = t, e[n] = a, n = r;
			else break a;
		}
	}
	function n(e) {
		return e.length === 0 ? null : e[0];
	}
	function r(e) {
		if (e.length === 0) return null;
		var t = e[0], n = e.pop();
		if (n !== t) {
			e[0] = n;
			a: for (var r = 0, a = e.length, o = a >>> 1; r < o;) {
				var s = 2 * (r + 1) - 1, c = e[s], l = s + 1, u = e[l];
				if (0 > i(c, n)) l < a && 0 > i(u, c) ? (e[r] = u, e[l] = n, r = l) : (e[r] = c, e[s] = n, r = s);
				else if (l < a && 0 > i(u, n)) e[r] = u, e[l] = n, r = l;
				else break a;
			}
		}
		return t;
	}
	function i(e, t) {
		var n = e.sortIndex - t.sortIndex;
		return n === 0 ? e.id - t.id : n;
	}
	if (e.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
		var a = performance;
		e.unstable_now = function() {
			return a.now();
		};
	} else {
		var o = Date, s = o.now();
		e.unstable_now = function() {
			return o.now() - s;
		};
	}
	var c = [], l = [], u = 1, d = null, f = 3, p = !1, m = !1, h = !1, g = !1, _ = typeof setTimeout == "function" ? setTimeout : null, v = typeof clearTimeout == "function" ? clearTimeout : null, y = typeof setImmediate < "u" ? setImmediate : null;
	function b(e) {
		for (var i = n(l); i !== null;) {
			if (i.callback === null) r(l);
			else if (i.startTime <= e) r(l), i.sortIndex = i.expirationTime, t(c, i);
			else break;
			i = n(l);
		}
	}
	function x(e) {
		if (h = !1, b(e), !m) {
			if (n(c) !== null) m = !0, S || (S = !0, O());
			else {
				var t = n(l);
				t !== null && j(x, t.startTime - e);
			}
		}
	}
	var S = !1, C = -1, w = 5, T = -1;
	function E() {
		return g ? !0 : !(e.unstable_now() - T < w);
	}
	function D() {
		if (g = !1, S) {
			var t = e.unstable_now();
			T = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(C), C = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && E());) {
								var o = d.callback;
								if (typeof o == "function") {
									d.callback = null, f = d.priorityLevel;
									var s = o(d.expirationTime <= t);
									if (t = e.unstable_now(), typeof s == "function") {
										d.callback = s, b(t), i = !0;
										break b;
									}
									d === n(c) && r(c), b(t);
								} else r(c);
								d = n(c);
							}
							if (d !== null) i = !0;
							else {
								var u = n(l);
								u !== null && j(x, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? O() : S = !1;
			}
		}
	}
	var O;
	if (typeof y == "function") O = function() {
		y(D);
	};
	else if (typeof MessageChannel < "u") {
		var k = new MessageChannel(), A = k.port2;
		k.port1.onmessage = D, O = function() {
			A.postMessage(null);
		};
	} else O = function() {
		_(D, 0);
	};
	function j(t, n) {
		C = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : w = 0 < e ? Math.floor(1e3 / e) : 5;
	}, e.unstable_getCurrentPriorityLevel = function() {
		return f;
	}, e.unstable_next = function(e) {
		switch (f) {
			case 1:
			case 2:
			case 3:
				var t = 3;
				break;
			default: t = f;
		}
		var n = f;
		f = t;
		try {
			return e();
		} finally {
			f = n;
		}
	}, e.unstable_requestPaint = function() {
		g = !0;
	}, e.unstable_runWithPriority = function(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: e = 3;
		}
		var n = f;
		f = e;
		try {
			return t();
		} finally {
			f = n;
		}
	}, e.unstable_scheduleCallback = function(r, i, a) {
		var o = e.unstable_now();
		switch (typeof a == "object" && a ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, r) {
			case 1:
				var s = -1;
				break;
			case 2:
				s = 250;
				break;
			case 5:
				s = 1073741823;
				break;
			case 4:
				s = 1e4;
				break;
			default: s = 5e3;
		}
		return s = a + s, r = {
			id: u++,
			callback: i,
			priorityLevel: r,
			startTime: a,
			expirationTime: s,
			sortIndex: -1
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(C), C = -1) : h = !0, j(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, S || (S = !0, O()))), r;
	}, e.unstable_shouldYield = E, e.unstable_wrapCallback = function(e) {
		var t = f;
		return function() {
			var n = f;
			f = t;
			try {
				return e.apply(this, arguments);
			} finally {
				f = n;
			}
		};
	};
})), f = /* @__PURE__ */ o(((e, t) => {
	t.exports = d();
})), p = /* @__PURE__ */ o(((e) => {
	var t = u();
	function n(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function r() {}
	var i = {
		d: {
			f: r,
			r: function() {
				throw Error(n(522));
			},
			D: r,
			C: r,
			L: r,
			m: r,
			X: r,
			S: r,
			M: r
		},
		p: 0,
		findDOMNode: null
	}, a = Symbol.for("react.portal"), o = Symbol.for("react.recoverable"), s = Symbol.for("react.optimistic_key");
	function c(e, t, n) {
		var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: a,
			key: r == null ? null : r === s ? s : "" + r,
			children: e,
			containerInfo: t,
			implementation: n
		};
	}
	var l = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function d(e, t) {
		if (e === "font") return "";
		if (typeof t == "string") return t === "use-credentials" ? t : "";
	}
	e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i, e.browser = function(e) {
		return {
			$$typeof: o,
			_reason: e
		};
	}, e.createPortal = function(e, t) {
		var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(n(299));
		return c(e, t, null, r);
	}, e.flushSync = function(e) {
		var t = l.T, n = i.p;
		try {
			if (l.T = null, i.p = 2, e) return e();
		} finally {
			l.T = t, i.p = n, i.d.f();
		}
	}, e.preconnect = function(e, t) {
		typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, i.d.C(e, t));
	}, e.prefetchDNS = function(e) {
		typeof e == "string" && i.d.D(e);
	}, e.preinit = function(e, t) {
		if (typeof e == "string" && t && typeof t.as == "string") {
			var n = t.as, r = d(n, t.crossOrigin), a = typeof t.integrity == "string" ? t.integrity : void 0, o = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
			n === "style" ? i.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o
			}) : n === "script" && i.d.X(e, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			});
		}
	}, e.preinitModule = function(e, t) {
		if (typeof e == "string") {
			if (typeof t == "object" && t) {
				if (t.as == null || t.as === "script") {
					var n = d(t.as, t.crossOrigin);
					i.d.M(e, {
						crossOrigin: n,
						integrity: typeof t.integrity == "string" ? t.integrity : void 0,
						nonce: typeof t.nonce == "string" ? t.nonce : void 0,
						fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
					});
				}
			} else t ?? i.d.M(e);
		}
	}, e.preload = function(e, t) {
		if (typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
			var n = t.as, r = d(n, t.crossOrigin);
			i.d.L(e, n, {
				crossOrigin: r,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0,
				type: typeof t.type == "string" ? t.type : void 0,
				fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
				referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
				imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
				imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
				media: typeof t.media == "string" ? t.media : void 0
			});
		}
	}, e.preloadModule = function(e, t) {
		if (typeof e == "string") {
			if (t) {
				var n = d(t.as, t.crossOrigin);
				i.d.m(e, {
					as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
					crossOrigin: n,
					integrity: typeof t.integrity == "string" ? t.integrity : void 0,
					nonce: typeof t.nonce == "string" ? t.nonce : void 0,
					fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
				});
			} else i.d.m(e);
		}
	}, e.requestFormReset = function(e) {
		i.d.r(e);
	}, e.unstable_batchedUpdates = function(e, t) {
		return e(t);
	}, e.useFormState = function(e, t, n) {
		return l.H.useFormState(e, t, n);
	}, e.useFormStatus = function() {
		return l.H.useHostTransitionStatus();
	}, e.version = "19.3.1";
})), m = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = p();
})), h = /* @__PURE__ */ o(((e) => {
	var t = f(), n = u(), r = m();
	function i(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function a(e) {
		return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
	}
	function o(e) {
		for (var t = e, n = t; n && !n.alternate;) t = n, t.flags & 4098 && (e = t.return), n = t.return;
		for (; t.return;) t = t.return;
		return t.tag === 3 ? e : null;
	}
	function s(e) {
		if (e.tag === 13) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function c(e) {
		if (e.tag === 31) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function l(e) {
		if (o(e) !== e) throw Error(i(188));
	}
	function d(e) {
		var t = e.alternate;
		if (!t) {
			if (t = o(e), t === null) throw Error(i(188));
			return t === e ? e : null;
		}
		for (var n = e, r = t;;) {
			var a = n.return;
			if (a === null) break;
			var s = a.alternate;
			if (s === null) {
				if (r = a.return, r !== null) {
					n = r;
					continue;
				}
				break;
			}
			if (a.child === s.child) {
				for (s = a.child; s;) {
					if (s === n) return l(a), e;
					if (s === r) return l(a), t;
					s = s.sibling;
				}
				throw Error(i(188));
			}
			if (n.return !== r.return) n = a, r = s;
			else {
				for (var c = !1, u = a.child; u;) {
					if (u === n) {
						c = !0, n = a, r = s;
						break;
					}
					if (u === r) {
						c = !0, r = a, n = s;
						break;
					}
					u = u.sibling;
				}
				if (!c) {
					for (u = s.child; u;) {
						if (u === n) {
							c = !0, n = s, r = a;
							break;
						}
						if (u === r) {
							c = !0, r = s, n = a;
							break;
						}
						u = u.sibling;
					}
					if (!c) throw Error(i(189));
				}
			}
			if (n.alternate !== r) throw Error(i(190));
		}
		if (n.tag !== 3) throw Error(i(188));
		return n.stateNode.current === n ? e : t;
	}
	function p(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null;) {
			if (t = p(e), t !== null) return t;
			e = e.sibling;
		}
		return null;
	}
	function h(e, t, n, r, i, a) {
		for (; e !== null;) {
			if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && n(e, r, i, a) || (e.tag !== 22 || e.memoizedState === null) && (t || e.tag !== 5 && e.tag !== 27) && h(e.child, t, n, r, i, a)) return !0;
			e = e.sibling;
		}
		return !1;
	}
	function g(e) {
		for (e = e.return; e !== null;) {
			if (e.tag === 3 || e.tag === 5 || e.tag === 27) return e;
			e = e.return;
		}
		return null;
	}
	function _(e) {
		var t = !1;
		for (e = e.return; e !== null && (e.tag === 4 && (t = !0), e.tag !== 3 && e.tag !== 5 && e.tag !== 27);) e = e.return;
		return t;
	}
	function v(e) {
		var t = [null, null], n = g(e);
		return n === null || y(t, e, n.child, { foundSelf: !1 }), t;
	}
	function y(e, t, n, r) {
		for (; n !== null;) {
			if (n === t) r.foundSelf = !0;
			else if (n.tag === 5 || n.tag === 27 || n.tag === 6) {
				if (r.foundSelf) return e[1] = n, !0;
				e[0] = n;
			} else if ((n.tag !== 22 || n.memoizedState === null) && y(e, t, n.child, r)) return !0;
			n = n.sibling;
		}
		return !1;
	}
	function b(e) {
		switch (e.tag) {
			case 5:
			case 27:
			case 6: return e.stateNode;
			case 3: return e.stateNode.containerInfo;
			default: throw Error(i(559));
		}
	}
	var x = null, S = null;
	function C(e, t, n) {
		return e === n || e === t && (x = e, !0);
	}
	function w(e, t, n) {
		return e === n ? (S = e, !1) : e === t && (S !== null && (x = e), !0);
	}
	function T(e) {
		if (e === null) return null;
		do
			e = e === null ? null : e.return;
		while (e && e.tag !== 5 && e.tag !== 27 && e.tag !== 3);
		return e || null;
	}
	function E(e, t, n) {
		for (var r = 0, i = e; i; i = n(i)) r++;
		i = 0;
		for (var a = t; a; a = n(a)) i++;
		for (; 0 < r - i;) e = n(e), r--;
		for (; 0 < i - r;) t = n(t), i--;
		for (; r--;) {
			if (e === t || t !== null && e === t.alternate) return e;
			e = n(e), t = n(t);
		}
		return null;
	}
	var D = Object.assign, O = Symbol.for("react.element"), k = Symbol.for("react.transitional.element"), A = Symbol.for("react.portal"), j = Symbol.for("react.fragment"), M = Symbol.for("react.strict_mode"), N = Symbol.for("react.profiler"), P = Symbol.for("react.consumer"), F = Symbol.for("react.context"), I = Symbol.for("react.forward_ref"), ee = Symbol.for("react.suspense"), te = Symbol.for("react.suspense_list"), ne = Symbol.for("react.memo"), re = Symbol.for("react.lazy"), ie = Symbol.for("react.activity"), ae = Symbol.for("react.legacy_hidden"), oe = Symbol.for("react.memo_cache_sentinel"), se = Symbol.for("react.view_transition"), ce = Symbol.for("react.recoverable"), le = Symbol.iterator;
	function ue(e) {
		return typeof e != "object" || !e ? null : (e = le && e[le] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var de = Symbol.for("react.client.reference");
	function fe(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === de ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case j: return "Fragment";
			case N: return "Profiler";
			case M: return "StrictMode";
			case ee: return "Suspense";
			case te: return "SuspenseList";
			case ie: return "Activity";
			case se: return "ViewTransition";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case A: return "Portal";
			case F: return e.displayName || "Context";
			case P: return (e._context.displayName || "Context") + ".Consumer";
			case I:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case ne: return t = e.displayName || null, t === null ? fe(e.type) || "Memo" : t;
			case re:
				t = e._payload, e = e._init;
				try {
					return fe(e(t));
				} catch {}
		}
		return null;
	}
	var pe = Array.isArray, L = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, R = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, me = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, he = [], ge = -1;
	function _e(e) {
		return { current: e };
	}
	function ve(e) {
		0 > ge || (e.current = he[ge], he[ge] = null, ge--);
	}
	function ye(e, t) {
		ge++, he[ge] = e.current, e.current = t;
	}
	var be = _e(null), xe = _e(null), Se = _e(null), Ce = _e(null);
	function we(e, t) {
		switch (ye(Se, t), ye(xe, e), ye(be, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? up(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = up(t), e = dp(t, e);
			else switch (e) {
				case "svg":
					e = 1;
					break;
				case "math":
					e = 2;
					break;
				default: e = 0;
			}
		}
		ve(be), ye(be, e);
	}
	function Te() {
		ve(be), ve(xe), ve(Se);
	}
	function Ee(e) {
		var t = e.memoizedState;
		t !== null && (sh._currentValue = t.memoizedState, ye(Ce, e)), t = be.current;
		var n = dp(t, e.type);
		t !== n && (ye(xe, e), ye(be, n));
	}
	function De(e) {
		xe.current === e && (ve(be), ve(xe)), Ce.current === e && (ve(Ce), sh._currentValue = me);
	}
	var Oe, ke;
	function Ae(e) {
		if (Oe === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			Oe = t && t[1] || "", ke = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + Oe + e + ke;
	}
	var je = !1;
	function Me(e, t) {
		if (!e || je) return "";
		je = !0;
		var n = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var r = { DetermineComponentFrameRoot: function() {
				try {
					if (t) {
						var n = function() {
							throw Error();
						};
						if (Object.defineProperty(n.prototype, "props", { set: function() {
							throw Error();
						} }), typeof Reflect == "object" && Reflect.construct) {
							try {
								Reflect.construct(n, []);
							} catch (e) {
								var r = e;
							}
							Reflect.construct(e, [], n);
						} else {
							try {
								n.call();
							} catch (e) {
								r = e;
							}
							n = !1;
							try {
								var i = Object.getOwnPropertyDescriptor(e.prototype, "props");
								Object.defineProperty(e.prototype, "props", {
									configurable: !0,
									set: function() {
										throw Error();
									}
								}), n = !0, new e();
							} finally {
								n && (i === void 0 ? delete e.prototype.props : Object.defineProperty(e.prototype, "props", i));
							}
						}
					} else {
						try {
							throw Error();
						} catch (e) {
							r = e;
						}
						(n = e()) && typeof n.catch == "function" && n.catch(function() {});
					}
				} catch (e) {
					if (e && r && typeof e.stack == "string") return [e.stack, r.stack];
				}
				return [null, null];
			} };
			r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var i = Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot, "name");
			i && i.configurable && Object.defineProperty(r.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var a = r.DetermineComponentFrameRoot(), o = a[0], s = a[1];
			if (o && s) {
				var c = o.split("\n"), l = s.split("\n");
				for (i = r = 0; r < c.length && !c[r].includes("DetermineComponentFrameRoot");) r++;
				for (; i < l.length && !l[i].includes("DetermineComponentFrameRoot");) i++;
				if (r === c.length || i === l.length) for (r = c.length - 1, i = l.length - 1; 1 <= r && 0 <= i && c[r] !== l[i];) i--;
				for (; 1 <= r && 0 <= i; r--, i--) if (c[r] !== l[i]) {
					if (r !== 1 || i !== 1) do
						if (r--, i--, 0 > i || c[r] !== l[i]) {
							var u = "\n" + c[r].replace(" at new ", " at ");
							return e.displayName && u.includes("<anonymous>") && (u = u.replace("<anonymous>", e.displayName)), u;
						}
					while (1 <= r && 0 <= i);
					break;
				}
			}
		} finally {
			je = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? Ae(n) : "";
	}
	function Ne(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return Ae(e.type);
			case 16: return Ae("Lazy");
			case 13: return e.child !== t && t !== null ? Ae("Suspense Fallback") : Ae("Suspense");
			case 19: return Ae("SuspenseList");
			case 0:
			case 15: return Me(e.type, !1);
			case 11: return Me(e.type.render, !1);
			case 1: return Me(e.type, !0);
			case 31: return Ae("Activity");
			case 30: return Ae("ViewTransition");
			default: return "";
		}
	}
	function Pe(e) {
		try {
			var t = "", n = null;
			do
				t += Ne(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var Fe = Object.prototype.hasOwnProperty, Ie = t.unstable_scheduleCallback, Le = t.unstable_cancelCallback, Re = t.unstable_shouldYield, ze = t.unstable_requestPaint, Be = t.unstable_now, Ve = t.unstable_getCurrentPriorityLevel, He = t.unstable_ImmediatePriority, Ue = t.unstable_UserBlockingPriority, We = t.unstable_NormalPriority, Ge = t.unstable_LowPriority, Ke = t.unstable_IdlePriority, qe = t.log, Je = t.unstable_setDisableYieldValue, Ye = null, z = null;
	function Xe(e) {
		if (typeof qe == "function" && Je(e), z && typeof z.setStrictMode == "function") try {
			z.setStrictMode(Ye, e);
		} catch {}
	}
	var B = Math.clz32 ? Math.clz32 : $e, Ze = Math.log, Qe = Math.LN2;
	function $e(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (Ze(e) / Qe | 0) | 0;
	}
	var et = 256, tt = 262144, nt = 4194304;
	function rt(e) {
		var t = e & 42;
		if (t !== 0) return t;
		switch (e & -e) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
			case 64: return 64;
			case 128: return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072: return e & -e;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return e & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return e & 62914560;
			case 67108864: return 67108864;
			case 134217728: return 134217728;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 1073741824: return 0;
			default: return e;
		}
	}
	function it(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = rt(n))) : i = rt(o) : i = rt(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = rt(n))) : i = rt(o)) : i = rt(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function at(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function ot(e, t) {
		t & 8 && (t |= t & 32);
		var n = e.entangledLanes;
		if (n !== 0) for (e = e.entanglements, n &= t; 0 < n;) {
			var r = 31 - B(n), i = 1 << r;
			t |= e[r], n &= ~i;
		}
		return t;
	}
	function st(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64: return t + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return t + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824: return -1;
			default: return -1;
		}
	}
	function ct() {
		var e = nt;
		return nt <<= 1, !(nt & 62914560) && (nt = 4194304), e;
	}
	function lt(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function ut(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function dt(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - B(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && ft(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function ft(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - B(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function pt(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - B(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function mt(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : ht(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function ht(e) {
		switch (e) {
			case 2:
				e = 1;
				break;
			case 8:
				e = 4;
				break;
			case 32:
				e = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				e = 128;
				break;
			case 268435456:
				e = 134217728;
				break;
			default: e = 0;
		}
		return e;
	}
	function gt(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function _t() {
		var e = R.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : Ch(e.type)) : e;
	}
	function vt(e, t) {
		var n = R.p;
		try {
			return R.p = e, t();
		} finally {
			R.p = n;
		}
	}
	var yt = Math.random().toString(36).slice(2), bt = "__reactFiber$" + yt, xt = "__reactProps$" + yt, St = "__reactContainer$" + yt, Ct = "__reactEvents$" + yt, wt = "__reactListeners$" + yt, Tt = "__reactHandles$" + yt, Et = "__reactResources$" + yt, Dt = "__reactMarker$" + yt, Ot = "__reactLoad$" + yt;
	function kt(e) {
		delete e[bt], delete e[xt], delete e[wt], delete e[Tt];
	}
	function At(e) {
		var t;
		if (t = e[bt]) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[St] || n[bt]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = fm(e); e !== null;) {
					if (n = e[bt]) return n;
					e = fm(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function jt(e) {
		if (e = e[bt] || e[St]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function Mt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function Nt(e) {
		var t = e[Et];
		return t ||= e[Et] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function Pt(e) {
		e[Dt] = !0;
	}
	function Ft(e) {
		e[Ot] = void 0;
	}
	var It = /* @__PURE__ */ new Set(), Lt = {};
	function Rt(e, t) {
		zt(e, t), zt(e + "Capture", t);
	}
	function zt(e, t) {
		for (Lt[e] = t, e = 0; e < t.length; e++) It.add(t[e]);
	}
	var Bt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Vt = {}, Ht = {};
	function V(e) {
		return Fe.call(Ht, e) ? !0 : Fe.call(Vt, e) ? !1 : Bt.test(e) ? Ht[e] = !0 : (Vt[e] = !0, !1);
	}
	var H = !1;
	function U() {
		var e = H;
		return H = !1, e;
	}
	function Ut(e, t, n) {
		if (V(t)) {
			if (n === null) e.removeAttribute(t);
			else {
				switch (typeof n) {
					case "undefined":
					case "function":
					case "symbol":
						e.removeAttribute(t);
						return;
					case "boolean":
						var r = t.toLowerCase().slice(0, 5);
						if (r !== "data-" && r !== "aria-") {
							e.removeAttribute(t);
							return;
						}
				}
				e.setAttribute(t, n);
			}
		}
	}
	function Wt(e, t, n) {
		if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(t);
					return;
			}
			e.setAttribute(t, n);
		}
	}
	function W(e, t, n, r) {
		if (r === null) e.removeAttribute(n);
		else {
			switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(n);
					return;
			}
			e.setAttributeNS(t, n, r);
		}
	}
	function Gt(e) {
		switch (typeof e) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined": return e;
			case "object": return e;
			default: return "";
		}
	}
	function Kt(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function qt(e, t, n) {
		var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
		if (!e.hasOwnProperty(t) && r !== void 0 && typeof r.get == "function" && typeof r.set == "function") {
			var i = r.get, a = r.set;
			return Object.defineProperty(e, t, {
				configurable: !0,
				get: function() {
					return i.call(this);
				},
				set: function(e) {
					n = "" + e, a.call(this, e);
				}
			}), Object.defineProperty(e, t, { enumerable: r.enumerable }), {
				getValue: function() {
					return n;
				},
				setValue: function(e) {
					n = "" + e;
				},
				stopTracking: function() {
					e._valueTracker = null, delete e[t];
				}
			};
		}
	}
	function Jt(e) {
		if (!e._valueTracker) {
			var t = Kt(e) ? "checked" : "value";
			e._valueTracker = qt(e, t, "" + e[t]);
		}
	}
	function G(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = Kt(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
	}
	var Yt = /[\n"\\]/g;
	function Xt(e) {
		return e.replace(Yt, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function K(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Gt(t)) : e.value !== "" + Gt(t) && (e.value = "" + Gt(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : Qt(e, Gt(n)) : o === "number" && e.value == t ? Qt(e, Gt(e.value)) : Qt(e, Gt(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + Gt(s) : e.removeAttribute("name");
	}
	function Zt(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				Jt(e);
				return;
			}
			n = n == null ? "" : "" + Gt(n), t = t == null ? n : "" + Gt(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), Jt(e);
	}
	function Qt(e, t) {
		e.defaultValue !== "" + t && (e.defaultValue = "" + t);
	}
	function $t(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + Gt(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function en(e, t, n) {
		t != null && (t = "" + Gt(t), t !== e.value && (e.value = t), n == null) ? e.defaultValue !== t && (e.defaultValue = t) : e.defaultValue = n == null ? "" : "" + Gt(n);
	}
	function tn(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (pe(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = Gt(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), Jt(e);
	}
	function nn(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var rn = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function an(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || rn.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function on(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "", H = !0);
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && (an(e, a, r), H = !0);
		} else for (var o in t) t.hasOwnProperty(o) && an(e, o, t[o]);
	}
	function sn(e) {
		if (e.indexOf("-") === -1) return !1;
		switch (e) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return !1;
			default: return !0;
		}
	}
	var cn = /* @__PURE__ */ new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["maskType", "mask-type"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]), ln = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function un(e) {
		return ln.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function dn() {}
	var fn = null;
	function pn(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var mn = null, hn = null;
	function gn(e) {
		var t = jt(e);
		if (t && (e = t.stateNode)) {
			var n = e[xt] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (K(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + Xt("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[xt] || null;
								if (!a) throw Error(i(90));
								K(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && G(r);
					}
					break a;
				case "textarea":
					en(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && $t(e, !!n.multiple, t, !1);
			}
		}
	}
	var _n = !1;
	function vn(e, t, n) {
		if (_n) return e(t, n);
		_n = !0;
		try {
			return e(t);
		} finally {
			if (_n = !1, (mn !== null || hn !== null) && (Ld(), mn && (t = mn, e = hn, hn = mn = null, gn(t), e))) for (t = 0; t < e.length; t++) gn(e[t]);
		}
	}
	function yn(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[xt] || null;
		if (r === null) return null;
		n = r[t];
		a: switch (t) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(r = !r.disabled) || (e = e.type, r = e !== "button" && e !== "input" && e !== "select" && e !== "textarea"), e = !r;
				break a;
			default: e = !1;
		}
		if (e) return null;
		if (n && typeof n != "function") throw Error(i(231, t, typeof n));
		return n;
	}
	var bn = typeof window < "u" && window.document !== void 0 && window.document.createElement !== void 0, xn = !1;
	if (bn) try {
		var Sn = {};
		Object.defineProperty(Sn, "passive", { get: function() {
			xn = !0;
		} }), window.addEventListener("test", Sn, Sn), window.removeEventListener("test", Sn, Sn);
	} catch {
		xn = !1;
	}
	var Cn = null, wn = null, Tn = null;
	function En() {
		if (Tn) return Tn;
		var e, t = wn, n = t.length, r, i = "value" in Cn ? Cn.value : Cn.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return Tn = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function Dn(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function On() {
		return !0;
	}
	function kn() {
		return !1;
	}
	function An(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? On : kn, this.isPropagationStopped = kn, this;
		}
		return D(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = On);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = On);
			},
			persist: function() {},
			isPersistent: On
		}), t;
	}
	var jn = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, Mn = An(jn), Nn = D({}, jn, {
		view: 0,
		detail: 0
	}), Pn = An(Nn), Fn, In, Ln, Rn = D({}, Nn, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: Yn,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== Ln && (Ln && e.type === "mousemove" ? (Fn = e.screenX - Ln.screenX, In = e.screenY - Ln.screenY) : In = Fn = 0, Ln = e), Fn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : In;
		}
	}), zn = An(Rn), Bn = An(D({}, Rn, { dataTransfer: 0 })), Vn = An(D({}, Nn, { relatedTarget: 0 })), Hn = An(D({}, jn, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Un = An(D({}, jn, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), Wn = An(D({}, jn, { data: 0 })), Gn = {
		Esc: "Escape",
		Spacebar: " ",
		Left: "ArrowLeft",
		Up: "ArrowUp",
		Right: "ArrowRight",
		Down: "ArrowDown",
		Del: "Delete",
		Win: "OS",
		Menu: "ContextMenu",
		Apps: "ContextMenu",
		Scroll: "ScrollLock",
		MozPrintableKey: "Unidentified"
	}, Kn = {
		8: "Backspace",
		9: "Tab",
		12: "Clear",
		13: "Enter",
		16: "Shift",
		17: "Control",
		18: "Alt",
		19: "Pause",
		20: "CapsLock",
		27: "Escape",
		32: " ",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "ArrowLeft",
		38: "ArrowUp",
		39: "ArrowRight",
		40: "ArrowDown",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "NumLock",
		145: "ScrollLock",
		224: "Meta"
	}, qn = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function Jn(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = qn[e]) ? !!t[e] : !1;
	}
	function Yn() {
		return Jn;
	}
	var Xn = An(D({}, Nn, {
		key: function(e) {
			if (e.key) {
				var t = Gn[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = Dn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Kn[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: Yn,
		charCode: function(e) {
			return e.type === "keypress" ? Dn(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? Dn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), Zn = An(D({}, Rn, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0
	})), Qn = An(D({}, jn, { submitter: 0 })), $n = An(D({}, Nn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: Yn
	})), er = An(D({}, jn, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), tr = An(D({}, Rn, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), nr = An(D({}, jn, {
		newState: 0,
		oldState: 0,
		source: 0
	})), rr = [
		9,
		13,
		27,
		32
	], ir = bn && "CompositionEvent" in window, ar = null;
	bn && "documentMode" in document && (ar = document.documentMode);
	var or = bn && "TextEvent" in window && !ar, sr = bn && (!ir || ar && 8 < ar && 11 >= ar), cr = " ", lr = !1;
	function ur(e, t) {
		switch (e) {
			case "keyup": return rr.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function dr(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var fr = !1;
	function pr(e, t) {
		switch (e) {
			case "compositionend": return dr(t);
			case "keypress": return t.which === 32 ? (lr = !0, cr) : null;
			case "textInput": return e = t.data, e === cr && lr ? null : e;
			default: return null;
		}
	}
	function mr(e, t) {
		if (fr) return e === "compositionend" || !ir && ur(e, t) ? (e = En(), Tn = wn = Cn = null, fr = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return sr && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var hr = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0
	};
	function gr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!hr[e.type] : t === "textarea";
	}
	function _r(e, t, n, r) {
		mn ? hn ? hn.push(r) : hn = [r] : mn = r, t = qf(t, "onChange"), 0 < t.length && (n = new Mn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var vr = null, yr = null;
	function br(e) {
		Bf(e, 0);
	}
	function xr(e) {
		if (G(Mt(e))) return e;
	}
	function Sr(e, t) {
		if (e === "change") return t;
	}
	var Cr = !1;
	if (bn) {
		var wr;
		if (bn) {
			var Tr = "oninput" in document;
			if (!Tr) {
				var Er = document.createElement("div");
				Er.setAttribute("oninput", "return;"), Tr = typeof Er.oninput == "function";
			}
			wr = Tr;
		} else wr = !1;
		Cr = wr && (!document.documentMode || 9 < document.documentMode);
	}
	function Dr() {
		vr && (vr.detachEvent("onpropertychange", Or), yr = vr = null);
	}
	function Or(e) {
		if (e.propertyName === "value" && xr(yr)) {
			var t = [];
			_r(t, yr, e, pn(e)), vn(br, t);
		}
	}
	function kr(e, t, n) {
		e === "focusin" ? (Dr(), vr = t, yr = n, vr.attachEvent("onpropertychange", Or)) : e === "focusout" && Dr();
	}
	function Ar(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return xr(yr);
	}
	function jr(e, t) {
		if (e === "click") return xr(t);
	}
	function Mr(e, t) {
		if (e === "input" || e === "change") return xr(t);
	}
	function Nr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var Pr = typeof Object.is == "function" ? Object.is : Nr;
	function Fr(e, t) {
		if (Pr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!Fe.call(t, i) || !Pr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function Ir(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	function Lr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function Rr(e, t) {
		var n = Lr(e);
		e = 0;
		for (var r; n;) {
			if (n.nodeType === 3) {
				if (r = e + n.textContent.length, e <= t && r >= t) return {
					node: n,
					offset: t - e
				};
				e = r;
			}
			a: {
				for (; n;) {
					if (n.nextSibling) {
						n = n.nextSibling;
						break a;
					}
					n = n.parentNode;
				}
				n = void 0;
			}
			n = Lr(n);
		}
	}
	function zr(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? zr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function Br(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Ir(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Ir(e.document);
		}
		return t;
	}
	function Vr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var Hr = bn && "documentMode" in document && 11 >= document.documentMode, Ur = null, Wr = null, Gr = null, Kr = !1;
	function qr(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		Kr || Ur == null || Ur !== Ir(r) || (r = Ur, "selectionStart" in r && Vr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), Gr && Fr(Gr, r) || (Gr = r, r = qf(Wr, "onSelect"), 0 < r.length && (t = new Mn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = Ur)));
	}
	function Jr(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var Yr = {
		animationend: Jr("Animation", "AnimationEnd"),
		animationiteration: Jr("Animation", "AnimationIteration"),
		animationstart: Jr("Animation", "AnimationStart"),
		transitionrun: Jr("Transition", "TransitionRun"),
		transitionstart: Jr("Transition", "TransitionStart"),
		transitioncancel: Jr("Transition", "TransitionCancel"),
		transitionend: Jr("Transition", "TransitionEnd")
	}, Xr = {}, Zr = {};
	bn && (Zr = document.createElement("div").style, "AnimationEvent" in window || (delete Yr.animationend.animation, delete Yr.animationiteration.animation, delete Yr.animationstart.animation), "TransitionEvent" in window || delete Yr.transitionend.transition);
	function Qr(e) {
		if (Xr[e]) return Xr[e];
		if (!Yr[e]) return e;
		var t = Yr[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in Zr) return Xr[e] = t[n];
		return e;
	}
	var $r = Qr("animationend"), ei = Qr("animationiteration"), ti = Qr("animationstart"), ni = Qr("transitionrun"), ri = Qr("transitionstart"), ii = Qr("transitioncancel"), ai = Qr("transitionend"), oi = /* @__PURE__ */ new Map(), si = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	si.push("scrollEnd");
	function ci(e, t) {
		oi.set(e, t), Rt(t, [e]);
	}
	var li = 0;
	function ui(e, t) {
		if (e.name != null && e.name !== "auto") return e.name;
		if (t.autoName !== null) return t.autoName;
		e = vd.identifierPrefix;
		var n = li++;
		return e = "_" + e + "t_" + n.toString(32) + "_", t.autoName = e;
	}
	function di(e) {
		if (e == null || typeof e == "string") return e;
		var t = null, n = Ed;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = e[n[r]];
			if (i != null) {
				if (i === "none") return "none";
				t = t == null ? i : t + (" " + i);
			}
		}
		return t ?? e.default;
	}
	function fi(e, t) {
		return e = di(e), t = di(t), t == null ? e === "auto" ? null : e : t === "auto" ? null : t;
	}
	var pi = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, mi = [], hi = 0, gi = 0;
	function _i() {
		for (var e = hi, t = gi = hi = 0; t < e;) {
			var n = mi[t];
			mi[t++] = null;
			var r = mi[t];
			mi[t++] = null;
			var i = mi[t];
			mi[t++] = null;
			var a = mi[t];
			if (mi[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && xi(n, i, a);
		}
	}
	function vi(e, t, n, r) {
		mi[hi++] = e, mi[hi++] = t, mi[hi++] = n, mi[hi++] = r, gi |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function yi(e, t, n, r) {
		return vi(e, t, n, r), Si(e);
	}
	function bi(e, t) {
		return vi(e, null, null, t), Si(e);
	}
	function xi(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - B(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function Si(e) {
		if (50 < Dd) throw Dd = 0, Od = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var Ci = {};
	function wi(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function Ti(e, t, n, r) {
		return new wi(e, t, n, r);
	}
	function Ei(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function Di(e, t) {
		var n = e.alternate;
		return n === null ? (n = Ti(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 1206910976, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function Oi(e, t) {
		e.flags &= 1206910978;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function ki(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof r == "function") Ei(r) && (s = 1);
		else if (typeof r == "string") s = qm(e, n, be.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (r) {
			case ie: return e = Ti(31, n, t, a), e.elementType = ie, e.lanes = o, e;
			case j: return Ai(n.children, a, o, t);
			case M:
				s = 8, a |= 24;
				break;
			case N: return e = Ti(12, n, t, a | 2), e.elementType = N, e.lanes = o, e;
			case ee: return e = Ti(13, n, t, a), e.elementType = ee, e.lanes = o, e;
			case te: return e = Ti(19, n, t, a), e.elementType = te, e.lanes = o, e;
			case ae:
			case se: return e = a | 32, e = Ti(30, n, t, e), e.elementType = se, e.lanes = o, e.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}, e;
			default:
				if (typeof r == "object" && r) switch (r.$$typeof) {
					case F:
						s = 10;
						break a;
					case P:
						s = 9;
						break a;
					case I:
						s = 11;
						break a;
					case ne:
						s = 14;
						break a;
					case re:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(i(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = Ti(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function Ai(e, t, n, r) {
		return e = Ti(7, e, r, t), e.lanes = n, e;
	}
	function ji(e, t, n) {
		return e = Ti(6, e, null, t), e.lanes = n, e;
	}
	function Mi(e) {
		var t = Ti(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function Ni(e, t, n) {
		return t = Ti(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var Pi = /* @__PURE__ */ new WeakMap();
	function Fi(e, t) {
		if (typeof e == "object" && e) {
			var n = Pi.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: Pe(t)
			}, Pi.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: Pe(t)
		};
	}
	var Ii = [], Li = 0, Ri = null, zi = 0, Bi = [], Vi = 0, Hi = null, Ui = 1, Wi = "";
	function Gi(e, t) {
		Ii[Li++] = zi, Ii[Li++] = Ri, Ri = e, zi = t;
	}
	function Ki(e, t, n) {
		Bi[Vi++] = Ui, Bi[Vi++] = Wi, Bi[Vi++] = Hi, Hi = e;
		var r = Ui;
		e = Wi;
		var i = 32 - B(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - B(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Ui = 1 << 32 - B(t) + i | n << i | r, Wi = a + e;
		} else Ui = 1 << a | n << i | r, Wi = e;
	}
	function qi(e) {
		e.return !== null && (Gi(e, 1), Ki(e, 1, 0));
	}
	function Ji(e) {
		for (; e === Ri;) Ri = Ii[--Li], Ii[Li] = null, zi = Ii[--Li], Ii[Li] = null;
		for (; e === Hi;) Hi = Bi[--Vi], Bi[Vi] = null, Wi = Bi[--Vi], Bi[Vi] = null, Ui = Bi[--Vi], Bi[Vi] = null;
	}
	function Yi(e, t) {
		Bi[Vi++] = Ui, Bi[Vi++] = Wi, Bi[Vi++] = Hi, Ui = t.id, Wi = t.overflow, Hi = e;
	}
	var Xi = null, Zi = null, q = !1, Qi = null, $i = !1, ea = Error(i(519));
	function ta(e) {
		throw sa(Fi(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), ea;
	}
	function na(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[bt] = e, t[xt] = r, n) {
			case "dialog":
				$("cancel", t), $("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				$("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < Rf.length; n++) $(Rf[n], t);
				break;
			case "source":
				$("error", t);
				break;
			case "img":
			case "image":
			case "link":
				$("error", t), $("load", t);
				break;
			case "details":
				$("toggle", t);
				break;
			case "input":
				$("invalid", t), Zt(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				$("invalid", t);
				break;
			case "textarea": $("invalid", t), tn(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || $f(t.textContent, n) ? (r.popover != null && ($("beforetoggle", t), $("toggle", t)), r.onScroll != null && $("scroll", t), r.onScrollEnd != null && $("scrollend", t), r.onClick != null && (t.onclick = dn), t = !0) : t = !1, t || ta(e, !0);
	}
	function ra(e) {
		for (Xi = e.return; Xi;) switch (Xi.tag) {
			case 5:
			case 31:
			case 13:
				$i = !1;
				return;
			case 27:
			case 3:
				$i = !0;
				return;
			default: Xi = Xi.return;
		}
	}
	function ia(e) {
		if (e !== Xi) return !1;
		if (!q) return ra(e), q = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || pp(e.type, e.memoizedProps)), n = !n), n && Zi && ta(e), ra(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Zi = dm(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Zi = dm(e);
		} else t === 27 ? (t = Zi, Sp(e.type) ? (e = um, um = null, Zi = e) : Zi = t) : Zi = Xi ? lm(e.stateNode.nextSibling) : null;
		return !0;
	}
	function aa() {
		Zi = Xi = null, q = !1;
	}
	function oa() {
		var e = Qi;
		return e !== null && (ud === null ? ud = e : ud.push.apply(ud, e), Qi = null), e;
	}
	function sa(e) {
		Qi === null ? Qi = [e] : Qi.push(e);
	}
	var ca = _e(null), la = null, ua = null;
	function da(e, t, n) {
		ye(ca, t._currentValue), t._currentValue = n;
	}
	function fa(e) {
		e._currentValue = ca.current, ve(ca);
	}
	function pa(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function ma(e, t, n, r) {
		var a = e.child;
		for (a !== null && (a.return = e); a !== null;) {
			var o = a.dependencies;
			if (o !== null) {
				var s = a.child;
				o = o.firstContext;
				a: for (; o !== null;) {
					var c = o;
					o = a;
					for (var l = 0; l < t.length; l++) if (c.context === t[l]) {
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), pa(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), pa(s, n, e), s = null;
			} else a.tag === 13 && a.memoizedState !== null && a.memoizedState.dehydrated === null ? (a.lanes |= n, s = a.alternate, s !== null && (s.lanes |= n), pa(a.return, n, e), s = a.child, s = s === null ? null : s.sibling) : s = a.child;
			if (s !== null) s.return = a;
			else for (s = a; s !== null;) {
				if (s === e) {
					s = null;
					break;
				}
				if (a = s.sibling, a !== null) {
					a.return = s.return, s = a;
					break;
				}
				s = s.return;
			}
			a = s;
		}
	}
	function ha(e, t, n, r) {
		e = null;
		for (var a = t, o = !1; a !== null;) {
			if (!o) {
				if (a.flags & 524288) o = !0;
				else if (a.flags & 262144) break;
			}
			if (a.tag === 10) {
				var s = a.alternate;
				if (s === null) throw Error(i(387));
				if (s = s.memoizedProps, s !== null) {
					var c = a.type;
					Pr(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === Ce.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [sh] : e.push(sh));
			}
			a = a.return;
		}
		return e !== null && ma(t, e, n, r), t.flags |= 262144, e !== null;
	}
	function ga(e) {
		for (e = e.firstContext; e !== null;) {
			if (!Pr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function _a(e) {
		la = e, ua = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function va(e) {
		return ba(la, e);
	}
	function ya(e, t) {
		return la === null && _a(e), ba(e, t);
	}
	function ba(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, ua === null) {
			if (e === null) throw Error(i(308));
			ua = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else ua = ua.next = t;
		return n;
	}
	var xa = typeof AbortController < "u" ? AbortController : function() {
		var e = [], t = this.signal = {
			aborted: !1,
			addEventListener: function(t, n) {
				e.push(n);
			}
		};
		this.abort = function() {
			t.aborted = !0, e.forEach(function(e) {
				return e();
			});
		};
	}, Sa = t.unstable_scheduleCallback, Ca = t.unstable_NormalPriority, wa = {
		$$typeof: F,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function Ta() {
		return {
			controller: new xa(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function Ea(e) {
		e.refCount--, e.refCount === 0 && Sa(Ca, function() {
			e.controller.abort();
		});
	}
	function Da(e, t) {
		if (e.pendingLanes & 4194048) {
			var n = e.transitionTypes;
			for (n === null && (n = e.transitionTypes = []), e = 0; e < t.length; e++) {
				var r = t[e];
				n.indexOf(r) === -1 && n.push(r);
			}
		}
	}
	var Oa = null;
	function ka(e) {
		var t = e.transitionTypes;
		return e.transitionTypes = null, t;
	}
	var Aa = null, ja = 0, Ma = 0, Na = null;
	function Pa(e, t) {
		if (Aa === null) {
			var n = Aa = [];
			ja = 0, Ma = Nf(), Na = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return ja++, t.then(Fa, Fa), t;
	}
	function Fa() {
		if (--ja === 0 && (Oa = null, Aa !== null)) {
			Na !== null && (Na.status = "fulfilled");
			var e = Aa;
			Aa = null, Ma = 0, Na = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function Ia(e, t) {
		var n = [], r = {
			status: "pending",
			value: null,
			reason: null,
			then: function(e) {
				n.push(e);
			}
		};
		return e.then(function() {
			r.status = "fulfilled", r.value = t;
			for (var e = 0; e < n.length; e++) (0, n[e])(t);
		}, function(e) {
			for (r.status = "rejected", r.reason = e, e = 0; e < n.length; e++) (0, n[e])(void 0);
		}), r;
	}
	var La = L.S;
	L.S = function(e, t) {
		if (pd = Be(), typeof t == "object" && t && typeof t.then == "function" && Pa(e, t), Oa !== null) for (var n = yf; n !== null;) Da(n, Oa), n = n.next;
		if (n = e.types, n !== null) {
			for (var r = yf; r !== null;) Da(r, n), r = r.next;
			if (Ma !== 0) {
				r = Oa, r === null && (r = Oa = []);
				for (var i = 0; i < n.length; i++) {
					var a = n[i];
					r.indexOf(a) === -1 && r.push(a);
				}
			}
		}
		La !== null && La(e, t);
	};
	var Ra = _e(null);
	function za() {
		var e = Ra.current;
		return e === null ? Xu.pooledCache : e;
	}
	function Ba(e, t) {
		t === null ? ye(Ra, Ra.current) : ye(Ra, t.pool);
	}
	function Va() {
		var e = za();
		return e === null ? null : {
			parent: wa._currentValue,
			pool: e
		};
	}
	var Ha = Error(i(460)), Ua = Error(i(474)), Wa = Error(i(542)), Ga = { then: function() {} };
	function Ka(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function qa(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(dn, dn), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, Za(e), e === void 0 && !("reason" in t) ? Error(i(600)) : e;
			default:
				if (typeof t.status == "string") t.then(dn, dn);
				else {
					if (e = Xu, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
					e = t, e.status = "pending", e.then(function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "fulfilled", n.value = e;
						}
					}, function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "rejected", n.reason = e;
						}
					});
				}
				switch (t.status) {
					case "fulfilled": return t.value;
					case "rejected": throw e = t.reason, Za(e), e;
				}
				throw Ya = t, Ha;
		}
	}
	function Ja(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (Ya = e, Ha) : e;
		}
	}
	var Ya = null;
	function Xa() {
		if (Ya === null) throw Error(i(459));
		var e = Ya;
		return Ya = null, e;
	}
	function Za(e) {
		if (e === Ha || e === Wa) throw Error(i(483));
	}
	var Qa = null, $a = 0;
	function eo(e) {
		var t = $a;
		return $a += 1, Qa === null && (Qa = []), qa(Qa, e, t);
	}
	function to(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function no(e, t) {
		throw t.$$typeof === O ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function ro(e) {
		function t(t, n) {
			if (e) {
				var r = t.deletions;
				r === null ? (t.deletions = [n], t.flags |= 16) : r.push(n);
			}
		}
		function n(n, r) {
			if (!e) return null;
			for (; r !== null;) t(n, r), r = r.sibling;
			return null;
		}
		function r(e) {
			for (var t = /* @__PURE__ */ new Map(); e !== null;) e.key === null ? t.set(e.index, e) : t.set(e.key, e), e = e.sibling;
			return t;
		}
		function a(e, t) {
			return e = Di(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 134217730, n) : (r = r.index, r < n ? (t.flags |= 2, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 134217730), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = ji(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === j ? (e = d(e, t, n.props.children, r, n.key), to(e, n), e) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === re && Ja(i) === t.type) ? (t = a(t, n.props), to(t, n), t.return = e, t) : (t = ki(n.type, n.key, n.props, null, e.mode, r), to(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = Ni(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = Ai(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = ji("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case k: return n = ki(t.type, t.key, t.props, null, e.mode, n), to(n, t), n.return = e, n;
					case A: return t = Ni(t, e.mode, n), t.return = e, t;
					case re: return t = Ja(t), f(e, t, n);
				}
				if (pe(t) || ue(t)) return t = Ai(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, eo(t), n);
				if (t.$$typeof === F) return f(e, ya(e, t), n);
				no(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case k: return n.key === i ? l(e, t, n, r) : null;
					case A: return n.key === i ? u(e, t, n, r) : null;
					case re: return n = Ja(n), p(e, t, n, r);
				}
				if (pe(n) || ue(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, eo(n), r);
				if (n.$$typeof === F) return p(e, t, ya(e, n), r);
				no(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case k: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case A: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case re: return r = Ja(r), m(e, t, n, r, i);
				}
				if (pe(r) || ue(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, eo(r), i);
				if (r.$$typeof === F) return m(e, t, n, ya(t, r), i);
				no(t, r);
			}
			return null;
		}
		function h(i, a, s, c) {
			for (var l = null, u = null, d = a, h = a = 0, g = null; d !== null && h < s.length; h++) {
				d.index > h ? (g = d, d = null) : g = d.sibling;
				var _ = p(i, d, s[h], c);
				if (_ === null) {
					d === null && (d = g);
					break;
				}
				e && d && _.alternate === null && t(i, d), a = o(_, a, h), u === null ? l = _ : u.sibling = _, u = _, d = g;
			}
			if (h === s.length) return n(i, d), q && Gi(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return q && Gi(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && (_ = g.alternate, _ !== null && d.delete(_.key === null ? h : _.key)), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), q && Gi(i, h), l;
		}
		function g(a, s, c, l) {
			if (c == null) throw Error(i(151));
			for (var u = null, d = null, h = s, g = s = 0, _ = null, v = c.next(); h !== null && !v.done; g++, v = c.next()) {
				h.index > g ? (_ = h, h = null) : _ = h.sibling;
				var y = p(a, h, v.value, l);
				if (y === null) {
					h === null && (h = _);
					break;
				}
				e && h && y.alternate === null && t(a, h), s = o(y, s, g), d === null ? u = y : d.sibling = y, d = y, h = _;
			}
			if (v.done) return n(a, h), q && Gi(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return q && Gi(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && (_ = v.alternate, _ !== null && h.delete(_.key === null ? g : _.key)), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), q && Gi(a, g), u;
		}
		function _(e, r, o, c) {
			if (typeof o == "object" && o && o.type === j && o.key === null && o.props.ref === void 0 && (o = o.props.children), typeof o == "object" && o) {
				switch (o.$$typeof) {
					case k:
						a: {
							for (var l = o.key; r !== null;) {
								if (r.key === l) {
									if (l = o.type, l === j) {
										if (r.tag === 7) {
											n(e, r.sibling), c = a(r, o.props.children), to(c, o), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === re && Ja(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), to(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							o.type === j ? (c = Ai(o.props.children, e.mode, c, o.key), to(c, o), c.return = e, e = c) : (c = ki(o.type, o.key, o.props, null, e.mode, c), to(c, o), c.return = e, e = c);
						}
						return s(e);
					case A:
						a: {
							for (l = o.key; r !== null;) {
								if (r.key === l) {
									if (r.tag === 4 && r.stateNode.containerInfo === o.containerInfo && r.stateNode.implementation === o.implementation) {
										n(e, r.sibling), c = a(r, o.children || []), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							c = Ni(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case re: return o = Ja(o), _(e, r, o, c);
				}
				if (pe(o)) return h(e, r, o, c);
				if (ue(o)) {
					if (l = ue(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return _(e, r, eo(o), c);
				if (o.$$typeof === F) return _(e, r, ya(e, o), c);
				no(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = ji(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				$a = 0;
				var i = _(e, t, n, r);
				return Qa = null, i;
			} catch (t) {
				if (t === Ha || t === Wa) throw t;
				var a = Ti(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var io = ro(!0), ao = ro(!1), oo = !1;
	function so(e) {
		e.updateQueue = {
			baseState: e.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		};
	}
	function co(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function lo(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function uo(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, X & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = Si(e), xi(e, null, n), t;
		}
		return vi(e, r, t, n), Si(e);
	}
	function fo(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, pt(e, n);
		}
	}
	function po(e, t) {
		var n = e.updateQueue, r = e.alternate;
		if (r !== null && (r = r.updateQueue, n === r)) {
			var i = null, a = null;
			if (n = n.firstBaseUpdate, n !== null) {
				do {
					var o = {
						lane: n.lane,
						tag: n.tag,
						payload: n.payload,
						callback: null,
						next: null
					};
					a === null ? i = a = o : a = a.next = o, n = n.next;
				} while (n !== null);
				a === null ? i = a = t : a = a.next = t;
			} else i = a = t;
			n = {
				baseState: r.baseState,
				firstBaseUpdate: i,
				lastBaseUpdate: a,
				shared: r.shared,
				callbacks: r.callbacks
			}, e.updateQueue = n;
		} else e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
	}
	var mo = !1;
	function ho() {
		if (mo) {
			var e = Na;
			if (e !== null) throw e;
		}
	}
	function go(e, t, n, r) {
		mo = !1;
		var i = e.updateQueue;
		oo = !1;
		var a = i.firstBaseUpdate, o = i.lastBaseUpdate, s = i.shared.pending;
		if (s !== null) {
			i.shared.pending = null;
			var c = s, l = c.next;
			c.next = null, o === null ? a = l : o.next = l, o = c;
			var u = e.alternate;
			u !== null && (u = u.updateQueue, s = u.lastBaseUpdate, s !== o && (s === null ? u.firstBaseUpdate = l : s.next = l, u.lastBaseUpdate = c));
		}
		if (a !== null) {
			var d = i.baseState;
			o = 0, u = l = c = null, s = a;
			do {
				var f = s.lane & -536870913, p = f !== s.lane;
				if (p ? (Q & f) === f : (r & f) === f) {
					f !== 0 && f === Ma && (mo = !0), u !== null && (u = u.next = {
						lane: 0,
						tag: s.tag,
						payload: s.payload,
						callback: null,
						next: null
					});
					a: {
						var m = e, h = s;
						f = t;
						var g = n;
						switch (h.tag) {
							case 1:
								if (m = h.payload, typeof m == "function") {
									d = m.call(g, d, f);
									break a;
								}
								d = m;
								break a;
							case 3: m.flags = m.flags & -65537 | 128;
							case 0:
								if (m = h.payload, f = typeof m == "function" ? m.call(g, d, f) : m, f == null) break a;
								d = D({}, d, f);
								break a;
							case 2: oo = !0;
						}
					}
					f = s.callback, f !== null && (e.flags |= 64, p && (e.flags |= 8192), p = i.callbacks, p === null ? i.callbacks = [f] : p.push(f));
				} else p = {
					lane: f,
					tag: s.tag,
					payload: s.payload,
					callback: s.callback,
					next: null
				}, u === null ? (l = u = p, c = d) : u = u.next = p, o |= f;
				if (s = s.next, s === null) {
					if (s = i.shared.pending, s === null) break;
					p = s, s = p.next, p.next = null, i.lastBaseUpdate = p, i.shared.pending = null;
				}
			} while (1);
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), id |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function _o(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function vo(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) _o(n[e], t);
	}
	var yo = _e(null), bo = _e(0);
	function xo(e, t) {
		e = nd, ye(bo, e), ye(yo, t), nd = e | t.baseLanes;
	}
	function So() {
		ye(bo, nd), ye(yo, yo.current);
	}
	function Co() {
		nd = bo.current, ve(yo), ve(bo);
	}
	var wo = _e(null), To = null;
	function Eo(e) {
		var t = e.alternate;
		ye(jo, jo.current & 1), ye(wo, e), To === null && (t === null || yo.current !== null || t.memoizedState !== null) && (To = e);
	}
	function Do(e) {
		ye(jo, jo.current), ye(wo, e), To === null && (To = e);
	}
	function Oo(e) {
		e.tag === 22 ? (ye(jo, jo.current), ye(wo, e), To === null && (To = e)) : ko();
	}
	function ko() {
		ye(jo, jo.current), ye(wo, wo.current);
	}
	function Ao(e) {
		ve(wo), To === e && (To = null), ve(jo);
	}
	var jo = _e(0);
	function Mo(e, t) {
		ye(wo, wo.current), ye(jo, t);
	}
	function No(e) {
		ve(jo), ve(wo), To === e && (To = null);
	}
	function Po(e) {
		for (var t = e; t !== null;) {
			if (t.tag === 13) {
				var n = t.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || om(n) || sm(n))) return t;
			} else if (t.tag === 19 && t.memoizedProps.revealOrder !== "independent") {
				if (t.flags & 128) return t;
			} else if (t.child !== null) {
				t.child.return = t, t = t.child;
				continue;
			}
			if (t === e) break;
			for (; t.sibling === null;) {
				if (t.return === null || t.return === e) return null;
				t = t.return;
			}
			t.sibling.return = t.return, t = t.sibling;
		}
		return null;
	}
	var Fo = 0, J = null, Io = null, Lo = null, Ro = !1, zo = !1, Bo = !1, Vo = 0, Ho = 0, Uo = null, Wo = 0;
	function Go() {
		throw Error(i(321));
	}
	function Ko(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!Pr(e[n], t[n])) return !1;
		return !0;
	}
	function qo(e, t, n, r, i, a) {
		return Fo = a, J = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, L.H = e === null || e.memoizedState === null ? uc : dc, Bo = !1, a = n(r, i), Bo = !1, zo && (a = Yo(t, n, r, i)), Jo(e), a;
	}
	function Jo(e) {
		L.H = lc;
		var t = Io !== null && Io.next !== null;
		if (Fo = 0, Lo = Io = J = null, Ro = !1, Ho = 0, Uo = null, t) throw Error(i(300));
		e === null || Oc || (e = e.dependencies, e !== null && ga(e) && (Oc = !0));
	}
	function Yo(e, t, n, r) {
		J = e;
		var a = 0;
		do {
			if (zo && (Uo = null), Ho = 0, zo = !1, 25 <= a) throw Error(i(301));
			if (a += 1, Lo = Io = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			L.H = fc, o = t(n, r);
		} while (zo);
		return o;
	}
	function Xo() {
		var e = L.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? rs(t) : t, e = e.useState()[0], (Io === null ? null : Io.memoizedState) !== e && (J.flags |= 1024), t;
	}
	function Zo() {
		var e = Vo !== 0;
		return Vo = 0, e;
	}
	function Qo(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function $o(e) {
		if (Ro) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			Ro = !1;
		}
		Fo = 0, Lo = Io = J = null, zo = !1, Ho = Vo = 0, Uo = null;
	}
	function es() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return Lo === null ? J.memoizedState = Lo = e : Lo = Lo.next = e, Lo;
	}
	function ts() {
		if (Io === null) {
			var e = J.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = Io.next;
		var t = Lo === null ? J.memoizedState : Lo.next;
		if (t !== null) Lo = t, Io = e;
		else {
			if (e === null) throw J.alternate === null ? Error(i(467)) : Error(i(310));
			Io = e, e = {
				memoizedState: Io.memoizedState,
				baseState: Io.baseState,
				baseQueue: Io.baseQueue,
				queue: Io.queue,
				next: null
			}, Lo === null ? J.memoizedState = Lo = e : Lo = Lo.next = e;
		}
		return Lo;
	}
	function ns() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function rs(e) {
		var t = Ho;
		return Ho += 1, Uo === null && (Uo = []), e = qa(Uo, e, t), t = J, (Lo === null ? t.memoizedState : Lo.next) === null && (t = t.alternate, L.H = t === null || t.memoizedState === null ? uc : dc), e;
	}
	function is(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return rs(e);
			if (e.$$typeof === ce) return;
			if (e.$$typeof === F) return va(e);
		}
		throw Error(i(438, String(e)));
	}
	function as(e) {
		var t = null, n = J.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = J.alternate;
			r !== null && (r = r.updateQueue, r !== null && (r = r.memoCache, r != null && (t = {
				data: r.data.map(function(e) {
					return e.slice();
				}),
				index: 0
			})));
		}
		if (t ??= {
			data: [],
			index: 0
		}, n === null && (n = ns(), J.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = oe;
		return t.index++, n;
	}
	function os(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function ss(e) {
		return cs(ts(), Io, e);
	}
	function cs(e, t, n) {
		var r = e.queue;
		if (r === null) throw Error(i(311));
		r.lastRenderedReducer = n;
		var a = e.baseQueue, o = r.pending;
		if (o !== null) {
			if (a !== null) {
				var s = a.next;
				a.next = o.next, o.next = s;
			}
			t.baseQueue = a = o, r.pending = null;
		}
		if (o = e.baseState, a === null) e.memoizedState = o;
		else {
			t = a.next;
			var c = s = null, l = null, u = t, d = !1;
			do {
				var f = u.lane & -536870913;
				if (f === u.lane ? (Fo & f) === f : (Q & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === Ma && (d = !0);
					else if ((Fo & p) === p) {
						u = u.next, p === Ma && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, J.lanes |= p, id |= p;
					f = u.action, Bo && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, J.lanes |= f, id |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !Pr(o, e.memoizedState) && (Oc = !0, d && (n = Na, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function ls(e) {
		var t = ts(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			Pr(o, t.memoizedState) || (Oc = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function us(e, t, n) {
		var r = J, a = ts(), o = q;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !Pr((Io || a).memoizedState, n);
		if (s && (a.memoizedState = n, Oc = !0), a = a.queue, Fs(ps.bind(null, r, a, e), [e]), e = a.getSnapshot !== t || s || Lo !== null && !!(Lo.memoizedState.tag & 1), As(e ? 9 : 8, { destroy: void 0 }, fs.bind(null, r, a, n, t), null), e) {
			if (r.flags |= 2048, Xu === null) throw Error(i(349));
			o || Fo & 127 || ds(r, t, n);
		}
		return n;
	}
	function ds(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = J.updateQueue, t === null ? (t = ns(), J.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function fs(e, t, n, r) {
		t.value = n, t.getSnapshot = r, ms(t) && hs(e);
	}
	function ps(e, t, n) {
		return n(function() {
			ms(t) && hs(e);
		});
	}
	function ms(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !Pr(e, n);
		} catch {
			return !0;
		}
	}
	function hs(e) {
		var t = bi(e, 2);
		t !== null && Md(t, e, 2);
	}
	function gs(e) {
		var t = es();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), Bo) {
				Xe(!0);
				try {
					n();
				} finally {
					Xe(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: os,
			lastRenderedState: e
		}, t;
	}
	function _s(e, t, n, r) {
		return e.baseState = n, cs(e, Io, typeof r == "function" ? r : os);
	}
	function vs(e, t, n, r, a) {
		if (oc(e)) throw Error(i(485));
		if (e = t.action, e !== null) {
			var o = {
				payload: a,
				action: e,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(e) {
					o.listeners.push(e);
				}
			};
			L.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, ys(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function ys(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = L.T, o = {};
			o.types = a === null ? null : a.types, L.T = o;
			try {
				var s = n(i, r), c = L.S;
				c !== null && c(o, s), bs(e, t, s);
			} catch (n) {
				Ss(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), L.T = a;
			}
		} else try {
			a = n(i, r), bs(e, t, a);
		} catch (n) {
			Ss(e, t, n);
		}
	}
	function bs(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			xs(e, t, n);
		}, function(n) {
			return Ss(e, t, n);
		}) : xs(e, t, n);
	}
	function xs(e, t, n) {
		t.status = "fulfilled", t.value = n, Cs(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, ys(e, n)));
	}
	function Ss(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, Cs(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function Cs(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function ws(e, t) {
		return t;
	}
	function Ts(e, t) {
		if (q) {
			var n = Xu.formState;
			if (n !== null) {
				a: {
					var r = J;
					if (q) {
						if (Zi) {
							b: {
								for (var i = Zi, a = $i; i.nodeType !== 8;) if (!a || (i = lm(i.nextSibling), i === null)) {
									i = null;
									break b;
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								Zi = lm(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						ta(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = es(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: ws,
			lastRenderedState: t
		}, n.queue = r, n = rc.bind(null, J, r), r.dispatch = n, r = gs(!1), a = ac.bind(null, J, !1, r.queue), r = es(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = vs.bind(null, J, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function Es(e) {
		return Ds(ts(), Io, e);
	}
	function Ds(e, t, n) {
		if (t = cs(e, t, ws)[0], e = ss(os)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = rs(t);
		} catch (e) {
			throw e === Ha ? Wa : e;
		}
		else r = t;
		t = ts();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (J.flags |= 2048, As(9, { destroy: void 0 }, Os.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function Os(e, t) {
		e.action = t;
	}
	function ks(e) {
		var t = ts(), n = Io;
		if (n !== null) return Ds(t, n, e);
		ts(), t = t.memoizedState, n = ts();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function As(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = J.updateQueue, t === null && (t = ns(), J.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function js() {
		return ts().memoizedState;
	}
	function Ms(e, t, n, r) {
		var i = es();
		J.flags |= e, i.memoizedState = As(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function Ns(e, t, n, r) {
		var i = ts();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		Io !== null && r !== null && Ko(r, Io.memoizedState.deps) ? i.memoizedState = As(t, a, n, r) : (J.flags |= e, i.memoizedState = As(1 | t, a, n, r));
	}
	function Ps(e, t) {
		Ms(8390656, 8, e, t);
	}
	function Fs(e, t) {
		Ns(2048, 8, e, t);
	}
	function Is(e) {
		J.flags |= 4;
		var t = J.updateQueue;
		if (t === null) t = ns(), J.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function Ls(e) {
		var t = ts().memoizedState;
		return Is({
			ref: t,
			nextImpl: e
		}), function() {
			if (X & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function Rs(e, t) {
		return Ns(4, 2, e, t);
	}
	function zs(e, t) {
		return Ns(4, 4, e, t);
	}
	function Bs(e, t) {
		if (typeof t == "function") {
			e = e();
			var n = t(e);
			return function() {
				typeof n == "function" ? n() : t(null);
			};
		}
		if (t != null) return e = e(), t.current = e, function() {
			t.current = null;
		};
	}
	function Vs(e, t, n) {
		n = n == null ? null : n.concat([e]), Ns(4, 4, Bs.bind(null, t, e), n);
	}
	function Hs() {}
	function Us(e, t) {
		var n = ts();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && Ko(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function Ws(e, t) {
		var n = ts();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && Ko(t, r[1])) return r[0];
		if (r = e(), Bo) {
			Xe(!0);
			try {
				e();
			} finally {
				Xe(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function Gs(e, t, n) {
		return n === void 0 || Fo & 1073741824 && !(Q & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = Ad(), J.lanes |= e, id |= e, n);
	}
	function Ks(e, t, n, r) {
		return Pr(n, t) ? n : yo.current === null ? !(Fo & 106) || Fo & 1073741824 && !(Q & 261930) ? (Oc = !0, e.memoizedState = n) : (e = Ad(), J.lanes |= e, id |= e, t) : (e = Gs(e, n, r), Pr(e, t) || (Oc = !0), e);
	}
	function qs(e, t, n, r, i) {
		var a = R.p;
		R.p = a !== 0 && 8 > a ? a : 8;
		var o = L.T, s = {};
		s.types = o === null ? null : o.types, L.T = s, ac(e, !1, t, n);
		try {
			var c = i(), l = L.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? ic(e, t, Ia(c, r), kd(e)) : ic(e, t, r, kd(e));
		} catch (n) {
			ic(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, kd());
		} finally {
			R.p = a, o !== null && s.types !== null && (o.types = s.types), L.T = o;
		}
	}
	function Js() {}
	function Ys(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = Xs(e).queue;
		qs(e, a, t, me, n === null ? Js : function() {
			return Zs(e), n(r);
		});
	}
	function Xs(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: me,
			baseState: me,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: os,
				lastRenderedState: me
			},
			next: null
		};
		var n = {};
		return t.next = {
			memoizedState: n,
			baseState: n,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: os,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function Zs(e) {
		var t = Xs(e);
		t.next === null && (t = e.alternate.memoizedState), ic(e, t.next.queue, {}, kd());
	}
	function Qs() {
		return va(sh);
	}
	function $s() {
		return ts().memoizedState;
	}
	function ec() {
		return ts().memoizedState;
	}
	function tc(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = kd();
					e = lo(n);
					var r = uo(t, e, n);
					r !== null && (Md(r, t, n), fo(r, t, n)), t = { cache: Ta() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function nc(e, t, n) {
		var r = kd();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, oc(e) ? sc(t, n) : (n = yi(e, t, n, r), n !== null && (Md(n, e, r), cc(n, t, r)));
	}
	function rc(e, t, n) {
		ic(e, t, n, kd());
	}
	function ic(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (oc(e)) sc(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, Pr(s, o)) return vi(e, t, i, 0), Xu === null && _i(), !1;
			} catch {}
			if (n = yi(e, t, i, r), n !== null) return Md(n, e, r), cc(n, t, r), !0;
		}
		return !1;
	}
	function ac(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: Nf(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, oc(e)) {
			if (t) throw Error(i(479));
		} else t = yi(e, n, r, 2), t !== null && Md(t, e, 2);
	}
	function oc(e) {
		var t = e.alternate;
		return e === J || t !== null && t === J;
	}
	function sc(e, t) {
		zo = Ro = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function cc(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, pt(e, n);
		}
	}
	var lc = {
		readContext: va,
		use: is,
		useCallback: Go,
		useContext: Go,
		useEffect: Go,
		useImperativeHandle: Go,
		useLayoutEffect: Go,
		useInsertionEffect: Go,
		useMemo: Go,
		useReducer: Go,
		useRef: Go,
		useState: Go,
		useDebugValue: Go,
		useDeferredValue: Go,
		useTransition: Go,
		useSyncExternalStore: Go,
		useId: Go,
		useHostTransitionStatus: Go,
		useFormState: Go,
		useActionState: Go,
		useOptimistic: Go,
		useMemoCache: Go,
		useCacheRefresh: Go,
		useEffectEvent: Go
	}, uc = {
		readContext: va,
		use: is,
		useCallback: function(e, t) {
			return es().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: va,
		useEffect: Ps,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), Ms(4194308, 4, Bs.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return Ms(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			Ms(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = es();
			t = t === void 0 ? null : t;
			var r = e();
			if (Bo) {
				Xe(!0);
				try {
					e();
				} finally {
					Xe(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = es();
			if (n !== void 0) {
				var i = n(t);
				if (Bo) {
					Xe(!0);
					try {
						n(t);
					} finally {
						Xe(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = nc.bind(null, J, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = es();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = gs(e);
			var t = e.queue, n = rc.bind(null, J, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: Hs,
		useDeferredValue: function(e, t) {
			return Gs(es(), e, t);
		},
		useTransition: function() {
			var e = gs(!1);
			return e = qs.bind(null, J, e.queue, !0, !1), es().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = J, a = es();
			if (q) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), Xu === null) throw Error(i(349));
				Q & 127 || ds(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, Ps(ps.bind(null, r, o, e), [e]), r.flags |= 2048, As(9, { destroy: void 0 }, fs.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = es(), t = Xu.identifierPrefix;
			if (q) {
				var n = Wi, r = Ui;
				n = (r & ~(1 << 32 - B(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = Vo++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = Wo++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: Qs,
		useFormState: Ts,
		useActionState: Ts,
		useOptimistic: function(e) {
			var t = es();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = ac.bind(null, J, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: as,
		useCacheRefresh: function() {
			return es().memoizedState = tc.bind(null, J);
		},
		useEffectEvent: function(e) {
			var t = es(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (X & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, dc = {
		readContext: va,
		use: is,
		useCallback: Us,
		useContext: va,
		useEffect: Fs,
		useImperativeHandle: Vs,
		useInsertionEffect: Rs,
		useLayoutEffect: zs,
		useMemo: Ws,
		useReducer: ss,
		useRef: js,
		useState: function() {
			return ss(os);
		},
		useDebugValue: Hs,
		useDeferredValue: function(e, t) {
			return Ks(ts(), Io.memoizedState, e, t);
		},
		useTransition: function() {
			var e = ss(os)[0], t = ts().memoizedState;
			return [typeof e == "boolean" ? e : rs(e), t];
		},
		useSyncExternalStore: us,
		useId: $s,
		useHostTransitionStatus: Qs,
		useFormState: Es,
		useActionState: Es,
		useOptimistic: function(e, t) {
			return _s(ts(), Io, e, t);
		},
		useMemoCache: as,
		useCacheRefresh: ec,
		useEffectEvent: Ls
	}, fc = {
		readContext: va,
		use: is,
		useCallback: Us,
		useContext: va,
		useEffect: Fs,
		useImperativeHandle: Vs,
		useInsertionEffect: Rs,
		useLayoutEffect: zs,
		useMemo: Ws,
		useReducer: ls,
		useRef: js,
		useState: function() {
			return ls(os);
		},
		useDebugValue: Hs,
		useDeferredValue: function(e, t) {
			var n = ts();
			return Io === null ? Gs(n, e, t) : Ks(n, Io.memoizedState, e, t);
		},
		useTransition: function() {
			var e = ls(os)[0], t = ts().memoizedState;
			return [typeof e == "boolean" ? e : rs(e), t];
		},
		useSyncExternalStore: us,
		useId: $s,
		useHostTransitionStatus: Qs,
		useFormState: ks,
		useActionState: ks,
		useOptimistic: function(e, t) {
			var n = ts();
			return Io === null ? (n.baseState = e, [e, n.queue.dispatch]) : _s(n, Io, e, t);
		},
		useMemoCache: as,
		useCacheRefresh: ec,
		useEffectEvent: Ls
	};
	function pc(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : D({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var mc = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = kd(), i = lo(r);
			i.payload = t, n != null && (i.callback = n), t = uo(e, i, r), t !== null && (Md(t, e, r), fo(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = kd(), i = lo(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = uo(e, i, r), t !== null && (Md(t, e, r), fo(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = kd(), r = lo(n);
			r.tag = 2, t != null && (r.callback = t), t = uo(e, r, n), t !== null && (Md(t, e, n), fo(t, e, n));
		}
	};
	function hc(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !Fr(n, r) || !Fr(i, a) : !0;
	}
	function gc(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && mc.enqueueReplaceState(t, t.state, null);
	}
	function _c(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = D({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function vc(e) {
		pi(e);
	}
	function yc(e) {
		console.error(e);
	}
	function bc(e) {
		pi(e);
	}
	function xc(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Sc(e, t, n) {
		try {
			var r = e.onCaughtError;
			r(n.value, {
				componentStack: n.stack,
				errorBoundary: t.tag === 1 ? t.stateNode : null
			});
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Cc(e, t, n) {
		return n = lo(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			xc(e, t);
		}, n;
	}
	function wc(e) {
		return e = lo(e), e.tag = 3, e;
	}
	function Tc(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				Sc(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			Sc(t, n, r), typeof i != "function" && (gd === null ? gd = /* @__PURE__ */ new Set([this]) : gd.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function Ec(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && ha(t, n, a, !0), n = wo.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13:
					case 19: return To === null ? Wd() : n.alternate === null && rd === 0 && (rd = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === Ga ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), pf(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === Ga ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), pf(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return pf(e, r, a), Wd(), !1;
		}
		if (q) return t = wo.current, t === null ? (r !== ea && (t = Error(i(423), { cause: r }), sa(Fi(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = Fi(r, n), a = Cc(e.stateNode, r, a), po(e, a), rd !== 4 && (rd = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== ea && (e = Error(i(422), { cause: r }), sa(Fi(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = Fi(o, n), ld === null ? ld = [o] : ld.push(o), rd !== 4 && (rd = 2), t === null) return !0;
		r = Fi(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = Cc(n.stateNode, r, e), po(n, e), !1;
				case 1:
					if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (gd === null || !gd.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = wc(a), Tc(a, e, n, r), po(n, a), !1;
					break;
				case 22: if (n.memoizedState !== null) return n.flags |= 65536, !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var Dc = Error(i(461)), Oc = !1;
	function kc(e, t, n, r) {
		t.child = e === null ? ao(t, null, n, r) : io(t, e.child, n, r);
	}
	function Ac(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return _a(t), r = qo(e, t, n, o, a, i), s = Zo(), e !== null && !Oc ? (Qo(e, t, i), il(e, t, i)) : (q && s && qi(t), t.flags |= 1, kc(e, t, r, i), t.child);
	}
	function jc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !Ei(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, Mc(e, t, a, r, i)) : (e = ki(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !al(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? Fr : n, n(o, r) && e.ref === t.ref) return il(e, t, i);
		}
		return t.flags |= 1, e = Di(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function Mc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (Fr(a, r) && e.ref === t.ref) {
				if (Oc = !1, t.pendingProps = r = a, al(e, i)) e.flags & 131072 && (Oc = !0);
				else return t.lanes = e.lanes, il(e, t, i);
			}
		}
		return Bc(e, t, n, r, i);
	}
	function Nc(e, t, n, r) {
		var i = r.children, a = e === null ? null : e.memoizedState;
		if (e === null && t.stateNode === null && (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), r.mode === "hidden") {
			if (t.flags & 128) {
				if (a = a === null ? n : a.baseLanes | n, e !== null) {
					for (r = t.child = e.child, i = 0; r !== null;) i = i | r.lanes | r.childLanes, r = r.sibling;
					r = i & ~a;
				} else r = 0, t.child = null;
				return Fc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && Ba(t, a === null ? null : a.cachePool), a === null ? So() : xo(t, a), Oo(t);
			else return r = t.lanes = 536870912, Fc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && Ba(t, null), So(), ko()) : (Ba(t, a.cachePool), xo(t, a), ko(), t.memoizedState = null);
		return kc(e, t, i, n), t.child;
	}
	function Pc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function Fc(e, t, n, r, i) {
		var a = za();
		return a = a === null ? null : {
			parent: wa._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && Ba(t, null), So(), Oo(t), e !== null && ha(e, t, r, !0), t.childLanes = i, null;
	}
	function Ic(e, t) {
		return t = Yc({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function Lc(e, t, n) {
		return io(t, e.child, null, n), e = Ic(t, t.pendingProps), e.flags |= 2, Ao(t), t.memoizedState = null, e;
	}
	function Rc(e, t, n) {
		var r = t.pendingProps, a = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (q) {
				if (r.mode === "hidden") return e = Ic(t, r), t.lanes = 536870912, e.memoizedState = {
					baseLanes: 0,
					cachePool: null
				}, Pc(null, e);
				if (Do(t), (e = Zi) ? (e = am(e, $i), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Hi === null ? null : {
						id: Ui,
						overflow: Wi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Mi(e), n.return = t, t.child = n, Xi = t, Zi = null)) : e = null, e === null) throw ta(t);
				return t.lanes = 536870912, null;
			}
			return Ic(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (Do(t), a) {
				if (t.flags & 256) t.flags &= -257, t = Lc(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(i(558));
			} else if (Oc || ha(e, t, n, !1), a = (n & e.childLanes) !== 0, Oc || a) {
				if (yo.current === null) {
					if (r = Xu, r !== null && (s = mt(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, bi(e, s), Md(r, e, s), Dc;
					Wd();
				}
				t = Lc(e, t, n);
			} else e = o.treeContext, Zi = lm(s.nextSibling), Xi = t, q = !0, Qi = null, $i = !1, e !== null && Yi(t, e), t = Ic(t, r), t.flags |= 134221824;
			return t;
		}
		return e = Di(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function zc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function Bc(e, t, n, r, i) {
		return _a(t), n = qo(e, t, n, r, void 0, i), r = Zo(), e !== null && !Oc ? (Qo(e, t, i), il(e, t, i)) : (q && r && qi(t), t.flags |= 1, kc(e, t, n, i), t.child);
	}
	function Vc(e, t, n, r, i, a) {
		return _a(t), t.updateQueue = null, n = Yo(t, r, n, i), Jo(e), r = Zo(), e !== null && !Oc ? (Qo(e, t, a), il(e, t, a)) : (q && r && qi(t), t.flags |= 1, kc(e, t, n, a), t.child);
	}
	function Hc(e, t, n, r, i) {
		if (_a(t), t.stateNode === null) {
			var a = Ci, o = n.contextType;
			typeof o == "object" && o && (a = va(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = mc, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, so(t), o = n.contextType, a.context = typeof o == "object" && o ? va(o) : Ci, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (pc(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && mc.enqueueReplaceState(a, a.state, null), go(t, r, a, i), ho(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = _c(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = Ci, typeof u == "object" && u && (o = va(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && gc(t, a, r, o), oo = !1;
			var f = t.memoizedState;
			a.state = f, go(t, r, a, i), ho(), l = t.memoizedState, s || f !== l || oo ? (typeof d == "function" && (pc(t, n, d, r), l = t.memoizedState), (c = oo || hc(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, co(e, t), o = t.memoizedProps, u = _c(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = Ci, typeof l == "object" && l && (c = va(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && gc(t, a, r, c), oo = !1, f = t.memoizedState, a.state = f, go(t, r, a, i), ho();
			var p = t.memoizedState;
			o !== d || f !== p || oo || e !== null && e.dependencies !== null && ga(e.dependencies) ? (typeof s == "function" && (pc(t, n, s, r), p = t.memoizedState), (u = oo || hc(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && ga(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, zc(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = io(t, e.child, null, i), t.child = io(t, null, n, i)) : kc(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = il(e, t, i), e;
	}
	function Uc(e, t, n, r) {
		return aa(), t.flags |= 256, kc(e, t, n, r), t.child;
	}
	var Wc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function Gc(e) {
		return {
			baseLanes: e,
			cachePool: Va()
		};
	}
	function Kc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= sd), e;
	}
	function qc(e, t, n) {
		var r = t.pendingProps, i = !1, a = !!(t.flags & 128), o;
		if ((o = a) || (o = e !== null && e.memoizedState === null ? !1 : !!(jo.current & 2)), o && (i = !0, t.flags &= -129), o = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (q) {
				if (i ? Eo(t) : ko(), (e = Zi) ? (e = am(e, $i), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Hi === null ? null : {
						id: Ui,
						overflow: Wi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = Mi(e), n.return = t, t.child = n, Xi = t, Zi = null)) : e = null, e === null) throw ta(t);
				return t.lanes = sm(e) ? 32 : 536870912, null;
			}
			return a = r.children, r = r.fallback, i ? (ko(), i = t.mode, a = Yc({
				mode: "hidden",
				children: a
			}, i), r = Ai(r, i, n, null), a.return = t, r.return = t, a.sibling = r, t.child = a, r = t.child, r.memoizedState = Gc(n), r.childLanes = Kc(e, o, n), t.memoizedState = Wc, Pc(null, r)) : (Eo(t), Jc(t, a));
		}
		var s = e.memoizedState;
		if (s !== null) {
			var c = s.dehydrated;
			if (c !== null) return Zc(e, t, a, o, r, c, s, n);
		}
		return i ? (ko(), i = r.fallback, a = t.mode, s = e.child, c = s.sibling, r = Di(s, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = s.subtreeFlags & 1206910976, c === null ? (i = Ai(i, a, n, null), i.flags |= 2) : i = Di(c, i), i.return = t, r.return = t, r.sibling = i, t.child = r, Pc(null, r), r = t.child, i = e.child.memoizedState, i === null ? i = Gc(n) : (a = i.cachePool, a === null ? a = Va() : (s = wa._currentValue, a = a.parent === s ? a : {
			parent: s,
			pool: s
		}), i = {
			baseLanes: i.baseLanes | n,
			cachePool: a
		}), r.memoizedState = i, r.childLanes = Kc(e, o, n), t.memoizedState = Wc, Pc(e.child, r)) : (Eo(t), n = e.child, e = n.sibling, n = Di(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (o = t.deletions, o === null ? (t.deletions = [e], t.flags |= 16) : o.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function Jc(e, t) {
		return t = Yc({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function Yc(e, t) {
		return e = Ti(22, e, null, t), e.lanes = 0, e;
	}
	function Xc(e, t, n) {
		return io(t, e.child, null, n), e = Jc(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function Zc(e, t, n, r, a, o, s, c) {
		if (n) return t.flags & 256 ? (Eo(t), t.flags &= -257, Xc(e, t, c)) : t.memoizedState === null ? (ko(), o = a.fallback, s = t.mode, a = Yc({
			mode: "visible",
			children: a.children
		}, s), o = Ai(o, s, c, null), o.flags |= 2, a.return = t, o.return = t, a.sibling = o, t.child = a, io(t, e.child, null, c), a = t.child, a.memoizedState = Gc(c), a.childLanes = Kc(e, r, c), t.memoizedState = Wc, Pc(null, a)) : (ko(), t.child = e.child, t.flags |= 128, null);
		if (Eo(t), sm(o)) {
			if (r = o.nextSibling && o.nextSibling.dataset, r) var l = r.dgst;
			return r = l, r !== "" && (a = Error(i(419)), a.stack = "", a.digest = r, sa({
				value: a,
				source: null,
				stack: null
			})), Xc(e, t, c);
		}
		if (Oc || ha(e, t, c, !1), r = (c & e.childLanes) !== 0, Oc || r) {
			if (yo.current !== null) return Xc(e, t, c);
			if (r = Xu, r !== null && (a = mt(r, c), a !== 0 && a !== s.retryLane)) throw s.retryLane = a, bi(e, a), Md(r, e, a), Dc;
			return om(o) || Wd(), Xc(e, t, c);
		}
		return om(o) ? (t.flags |= 192, t.child = e.child, null) : (e = s.treeContext, Zi = lm(o.nextSibling), Xi = t, q = !0, Qi = null, $i = !1, e !== null && Yi(t, e), t = Jc(t, a.children), t.flags |= 134221824, t);
	}
	function Qc(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), pa(e.return, t, n);
	}
	function $c(e) {
		for (var t = null; e !== null;) {
			var n = e.alternate;
			n !== null && Po(n) === null && (t = e), e = e.sibling;
		}
		return t;
	}
	function el(e, t, n, r, i, a) {
		var o = e.memoizedState;
		o === null ? e.memoizedState = {
			isBackwards: t,
			rendering: null,
			renderingStartTime: 0,
			last: r,
			tail: n,
			tailMode: i,
			treeForkCount: a
		} : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = i, o.treeForkCount = a);
	}
	function tl(e) {
		var t = e.child;
		for (e.child = null; t !== null;) {
			var n = t.sibling;
			t.sibling = e.child, e.child = t, t = n;
		}
	}
	function nl(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = jo.current;
		if (t.flags & 128) return Mo(t, o), null;
		var s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, Mo(t, o), i === "backwards" && e !== null ? (tl(e), kc(e, t, r, n), tl(e)) : kc(e, t, r, n), r = q ? zi : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && Qc(e, n, t);
			else if (e.tag === 19) Qc(e, n, t);
			else if (e.child !== null) {
				e.child.return = e, e = e.child;
				continue;
			}
			if (e === t) break a;
			for (; e.sibling === null;) {
				if (e.return === null || e.return === t) break a;
				e = e.return;
			}
			e.sibling.return = e.return, e = e.sibling;
		}
		switch (i) {
			case "backwards":
				n = $c(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null, tl(t)), el(t, !0, i, null, a, r);
				break;
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && Po(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				el(t, !0, n, null, a, r);
				break;
			case "together":
				el(t, !1, null, null, void 0, r);
				break;
			case "independent":
				t.memoizedState = null;
				break;
			default: n = $c(t.child), n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), el(t, !1, i, n, a, r);
		}
		return t.child;
	}
	function rl(e, t, n) {
		var r = t.pendingProps;
		return da(t, t.type, r.value), kc(e, t, r.children, n), t.child;
	}
	function il(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), id |= t.lanes, (n & t.childLanes) === 0) {
			if (e !== null) {
				if (ha(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = Di(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = Di(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function al(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && ga(e)));
	}
	function ol(e, t, n) {
		switch (t.tag) {
			case 3:
				we(t, t.stateNode.containerInfo), da(t, wa, e.memoizedState.cache), aa();
				break;
			case 27:
			case 5:
				Ee(t);
				break;
			case 4:
				we(t, t.stateNode.containerInfo);
				break;
			case 10:
				da(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, Do(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) {
					if (r.dehydrated !== null) return Eo(t), t.flags |= 128, null;
					r = ha(e, t, n, !1);
					var i = t.child.childLanes;
					return r || (n & i) !== 0 ? qc(e, t, n) : (Eo(t), e = il(e, t, n), e === null ? null : e.sibling);
				}
				Eo(t);
				break;
			case 19:
				if (t.flags & 128) return nl(e, t, n);
				if (i = !!(e.flags & 128), r = (n & t.childLanes) !== 0, r ||= (ha(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return nl(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), Mo(t, jo.current), r) break;
				return null;
			case 22: return t.lanes = 0, Nc(e, t, n, t.pendingProps);
			case 24: da(t, wa, e.memoizedState.cache);
		}
		return il(e, t, n);
	}
	function sl(e, t, n) {
		if (e !== null) {
			if (e.memoizedProps !== t.pendingProps) Oc = !0;
			else {
				if (!al(e, n) && !(t.flags & 128)) return Oc = !1, ol(e, t, n);
				Oc = !!(e.flags & 131072);
			}
		} else Oc = !1, q && t.flags & 1048576 && Ki(t, zi, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = Ja(t.elementType), t.type = e, typeof e == "function") Ei(e) ? (r = _c(e, r), t.tag = 1, t = Hc(null, t, e, r, n)) : (t.tag = 0, t = Bc(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === I) {
								t.tag = 11, t = Ac(null, t, e, r, n);
								break a;
							}
							if (a === ne) {
								t.tag = 14, t = jc(null, t, e, r, n);
								break a;
							}
							if (a === F) {
								t.tag = 10, t.type = e, t = rl(null, t, n);
								break a;
							}
						}
						throw t = fe(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return Bc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = _c(r, t.pendingProps), Hc(e, t, r, a, n);
			case 3:
				a: {
					if (we(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, co(e, t), go(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, da(t, wa, r), r !== o.cache && ma(t, [wa], n, !0), ho(), r = s.element, o.isDehydrated) {
						if (o = {
							element: r,
							isDehydrated: !1,
							cache: s.cache
						}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
							t = Uc(e, t, r, n);
							break a;
						}
						if (r !== a) {
							a = Fi(Error(i(424)), t), sa(a), t = Uc(e, t, r, n);
							break a;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (Zi = lm(e.firstChild), Xi = t, q = !0, Qi = null, $i = !0, n = ao(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 134221824, n = n.sibling;
					} else {
						if (aa(), r === a) {
							t = il(e, t, n);
							break a;
						}
						kc(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return zc(e, t), e === null ? (n = Nm(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : q || (t.stateNode = fp(t.type, t.pendingProps, Se.current, t)) : t.memoizedState = Nm(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return Ee(t), e === null && q && (r = t.stateNode = hm(t.type, t.pendingProps, Se.current), Xi = t, $i = !0, a = Zi, Sp(t.type) ? (um = a, Zi = lm(r.firstChild)) : Zi = a), kc(e, t, t.pendingProps.children, n), zc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && q && ((a = r = Zi) && (r = rm(r, t.type, t.pendingProps, $i), r === null ? a = !1 : (t.stateNode = r, Xi = t, Zi = lm(r.firstChild), $i = !1, a = !0)), a || ta(t)), Ee(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, pp(a, o) ? r = null : s !== null && pp(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = qo(e, t, Xo, null, null, n), sh._currentValue = a), zc(e, t), kc(e, t, r, n), t.child;
			case 6: return e === null && q && ((e = n = Zi) && (n = im(n, t.pendingProps, $i), n === null ? e = !1 : (t.stateNode = n, Xi = t, Zi = null, e = !0)), e || ta(t)), null;
			case 13: return qc(e, t, n);
			case 4: return we(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = io(t, null, r, n) : kc(e, t, r, n), t.child;
			case 11: return Ac(e, t, t.type, t.pendingProps, n);
			case 7: return r = t.pendingProps, zc(e, t), kc(e, t, r, n), t.child;
			case 8: return kc(e, t, t.pendingProps.children, n), t.child;
			case 12: return kc(e, t, t.pendingProps.children, n), t.child;
			case 10: return rl(e, t, n);
			case 9: return a = t.type._context, r = t.pendingProps.children, _a(t), a = va(a), r = r(a), t.flags |= 1, kc(e, t, r, n), t.child;
			case 14: return jc(e, t, t.type, t.pendingProps, n);
			case 15: return Mc(e, t, t.type, t.pendingProps, n);
			case 19: return nl(e, t, n);
			case 31: return Rc(e, t, n);
			case 22: return Nc(e, t, n, t.pendingProps);
			case 24: return _a(t), r = va(wa), e === null ? (a = za(), a === null && (a = Xu, o = Ta(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, so(t), da(t, wa, a)) : ((e.lanes & n) !== 0 && (co(e, t), go(t, null, null, n), ho()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, da(t, wa, r), r !== a.cache && ma(t, [wa], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), da(t, wa, r))), kc(e, t, t.pendingProps.children, n), t.child;
			case 30: return t.stateNode === null && (t.stateNode = {
				autoName: null,
				paired: null,
				clones: null,
				ref: null
			}), r = t.pendingProps, r.name != null && r.name !== "auto" ? t.flags |= e === null ? 18882560 : 18874368 : q && qi(t), e !== null && e.memoizedProps.name !== r.name ? t.flags |= 4194816 : zc(e, t), kc(e, t, r.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function cl(e) {
		e.flags |= 4;
	}
	function ll(e, t, n, r, i) {
		var a;
		if ((a = !!(e.mode & 32)) && (a = n === null ? Jm(t, r) : Jm(t, r) && (r.src !== n.src || r.srcSet !== n.srcSet)), a) {
			if (e.flags |= 16777216, (i & 335544128) === i) {
				if (e.stateNode.complete) e.flags |= 8192;
				else if (Vd()) e.flags |= 8192;
				else throw Ya = Ga, Ua;
			}
		} else e.flags &= -16777217;
	}
	function ul(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Ym(t)) {
			if (Vd()) e.flags |= 8192;
			else throw Ya = Ga, Ua;
		}
	}
	function dl(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : ct(), e.lanes |= t, cd |= t);
	}
	function fl(e, t) {
		if (!q) switch (e.tailMode) {
			case "visible": break;
			case "collapsed":
				for (var n = e.tail, r = null; n !== null;) n.alternate !== null && (r = n), n = n.sibling;
				r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
				break;
			default:
				for (t = e.tail, n = null; t !== null;) t.alternate !== null && (n = t), t = t.sibling;
				n === null ? e.tail = null : n.sibling = null;
		}
	}
	function pl(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 1206910976, r |= i.flags & 1206910976, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function ml(e, t, n) {
		var r = t.pendingProps;
		switch (Ji(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return pl(t), null;
			case 1: return pl(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), fa(wa), Te(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (ia(t) ? cl(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, oa())), pl(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (cl(t), o === null ? (pl(t), ll(t, a, null, r, n)) : (pl(t), ul(t, o))) : o ? o === e.memoizedState ? (pl(t), t.flags &= -16777217) : (cl(t), pl(t), ul(t, o)) : (e = e.memoizedProps, e !== r && cl(t), pl(t), ll(t, a, e, r, n)), null;
			case 27:
				if (De(t), n = Se.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && cl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return pl(t), t.subtreeFlags &= -33554433, null;
					}
					e = be.current, ia(t) ? na(t, e) : (e = hm(a, r, n), t.stateNode = e, cl(t));
				}
				return pl(t), t.subtreeFlags &= -33554433, null;
			case 5:
				if (De(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && cl(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return pl(t), t.subtreeFlags &= -33554433, null;
					}
					if (o = be.current, ia(t)) na(t, o);
					else {
						var s = lp(Se.current);
						switch (o) {
							case 1:
								o = s.createElementNS("http://www.w3.org/2000/svg", a);
								break;
							case 2:
								o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
								break;
							default: switch (a) {
								case "svg":
									o = s.createElementNS("http://www.w3.org/2000/svg", a);
									break;
								case "math":
									o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
									break;
								case "script":
									o = s.createElement("div"), o.innerHTML = "<script><\/script>", o = o.removeChild(o.firstChild);
									break;
								case "select":
									o = typeof r.is == "string" ? s.createElement("select", { is: r.is }) : s.createElement("select"), r.multiple ? o.multiple = !0 : r.size && (o.size = r.size);
									break;
								default: o = typeof r.is == "string" ? s.createElement(a, { is: r.is }) : s.createElement(a);
							}
						}
						o[bt] = t, o[xt] = r;
						a: for (s = t.child; s !== null;) {
							if (s.tag === 5 || s.tag === 6) o.appendChild(s.stateNode);
							else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
								s.child.return = s, s = s.child;
								continue;
							}
							if (s === t) break a;
							for (; s.sibling === null;) {
								if (s.return === null || s.return === t) break a;
								s = s.return;
							}
							s.sibling.return = s.return, s = s.sibling;
						}
						t.stateNode = o;
						a: switch (np(o, a, r), a) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								r = !!r.autoFocus;
								break a;
							case "img":
								r = !0;
								break a;
							default: r = !1;
						}
						r && cl(t);
					}
				}
				return pl(t), t.subtreeFlags &= -33554433, ll(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && cl(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = Se.current, ia(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = Xi, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[bt] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || $f(e.nodeValue, n)), e || ta(t, !0);
					} else e = lp(e).createTextNode(r), e[bt] = t, t.stateNode = e;
				}
				return pl(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = ia(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[bt] = t;
						} else aa(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						pl(t), e = !1;
					} else n = oa(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (Ao(t), t) : (Ao(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return pl(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = ia(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[bt] = t;
						} else aa(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						pl(t), a = !1;
					} else a = oa(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (Ao(t), t) : (Ao(t), null);
				}
				return Ao(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), dl(t, t.updateQueue), pl(t), null);
			case 4: return Te(), e === null && Uf(t.stateNode.containerInfo), t.flags |= 67108864, pl(t), null;
			case 10: return fa(t.type), pl(t), null;
			case 19:
				if (No(t), r = t.memoizedState, r === null) return pl(t), null;
				if (a = !!(t.flags & 128), o = r.rendering, o === null) {
					if (a) fl(r, !1);
					else {
						if (rd !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (o = Po(e), o !== null) {
								for (t.flags |= 128, fl(r, !1), e = o.updateQueue, t.updateQueue = e, dl(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) Oi(n, e), n = n.sibling;
								return Mo(t, jo.current & 1 | 2), q && Gi(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && Be() > md && (t.flags |= 128, a = !0, fl(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!a) {
						if (e = Po(o), e !== null) {
							if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, dl(t, e), fl(r, !0), r.tail === null && r.tailMode !== "collapsed" && r.tailMode !== "visible" && !o.alternate && !q) return pl(t), null;
						} else 2 * Be() - r.renderingStartTime > md && n !== 536870912 && (t.flags |= 128, a = !0, fl(r, !1), t.lanes = 4194304);
					}
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				if (r.tail !== null) {
					e = r.tail;
					a: {
						for (n = e; n !== null;) {
							if (n.alternate !== null) {
								n = !1;
								break a;
							}
							n = n.sibling;
						}
						n = !0;
					}
					return r.rendering = e, r.tail = e.sibling, r.renderingStartTime = Be(), e.sibling = null, o = jo.current, o = a ? o & 1 | 2 : o & 1, r.tailMode === "visible" || r.tailMode === "collapsed" || !n || q ? Mo(t, o) : (n = o, ye(wo, t), ye(jo, n), To === null && (To = t)), q && Gi(t, r.treeForkCount), e;
				}
				return pl(t), null;
			case 22:
			case 23: return Ao(t), Co(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (pl(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : pl(t), n = t.updateQueue, n !== null && dl(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && ve(Ra), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), fa(wa), pl(t), null;
			case 25: return null;
			case 30: return t.flags |= 33554432, pl(t), null;
		}
		throw Error(i(156, t.tag));
	}
	function hl(e, t) {
		switch (Ji(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return fa(wa), Te(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return De(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (Ao(t), t.alternate === null) throw Error(i(340));
					aa();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (Ao(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					aa();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return No(t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null), t.flags |= 4, t) : null;
			case 4: return Te(), null;
			case 10: return fa(t.type), null;
			case 22:
			case 23: return Ao(t), Co(), e !== null && ve(Ra), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return fa(wa), null;
			case 25: return null;
			default: return null;
		}
	}
	function gl(e, t) {
		switch (Ji(t), t.tag) {
			case 3:
				fa(wa), Te();
				break;
			case 26:
			case 27:
			case 5:
				De(t);
				break;
			case 4:
				Te();
				break;
			case 31:
				t.memoizedState !== null && Ao(t);
				break;
			case 13:
				Ao(t);
				break;
			case 19:
				No(t);
				break;
			case 10:
				fa(t.type);
				break;
			case 22:
			case 23:
				Ao(t), Co(), e !== null && ve(Ra);
				break;
			case 24: fa(wa);
		}
	}
	function _l(e, t) {
		try {
			var n = t.updateQueue, r = n === null ? null : n.lastEffect;
			if (r !== null) {
				var i = r.next;
				n = i;
				do {
					if ((n.tag & e) === e) {
						r = void 0;
						var a = n.create, o = n.inst;
						r = a(), o.destroy = r;
					}
					n = n.next;
				} while (n !== i);
			}
		} catch (e) {
			ff(t, t.return, e);
		}
	}
	function vl(e, t, n) {
		try {
			var r = t.updateQueue, i = r === null ? null : r.lastEffect;
			if (i !== null) {
				var a = i.next;
				r = a;
				do {
					if ((r.tag & e) === e) {
						var o = r.inst, s = o.destroy;
						if (s !== void 0) {
							o.destroy = void 0, i = t;
							var c = n, l = s;
							try {
								l();
							} catch (e) {
								ff(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			ff(t, t.return, e);
		}
	}
	function yl(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				vo(t, n);
			} catch (t) {
				ff(e, e.return, t);
			}
		}
	}
	function bl(e, t, n) {
		n.props = _c(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			ff(e, t, n);
		}
	}
	function xl(e, t) {
		try {
			var n = e.ref;
			if (n !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var r = e.stateNode;
						break;
					case 30:
						var i = e.stateNode, a = ui(e.memoizedProps, i);
						(i.ref === null || i.ref.name !== a) && (i.ref = Pp(a)), r = i.ref;
						break;
					case 7:
						if (e.stateNode === null) {
							var o = new Fp(e);
							h(e.child, !1, Qp, o, void 0, void 0), e.stateNode = o;
						}
						r = e.stateNode;
						break;
					default: r = e.stateNode;
				}
				typeof n == "function" ? e.refCleanup = n(r) : n.current = r;
			}
		} catch (n) {
			ff(e, t, n);
		}
	}
	function Sl(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) {
			if (typeof r == "function") try {
				r();
			} catch (n) {
				ff(e, t, n);
			} finally {
				e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
			}
			else if (typeof n == "function") try {
				n(null);
			} catch (n) {
				ff(e, t, n);
			}
			else n.current = null;
		}
	}
	function Cl(e, t) {
		if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && e.alternate === null && t !== null) for (var n = 0; n < t.length; n++) em(e.stateNode, t[n]);
	}
	function wl(e) {
		for (var t = e.return; t !== null && (Dl(t) && em(e.stateNode, t.stateNode), !El(t));) t = t.return;
	}
	function Tl(e) {
		for (var t = e.return; t !== null && (Dl(t) && tm(e.stateNode, t.stateNode), !El(t));) t = t.return;
	}
	function El(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 27;
	}
	function Dl(e) {
		return e && e.tag === 7 && e.stateNode !== null;
	}
	function Ol(e) {
		var t = e.type, n = e.memoizedProps, r = e.stateNode;
		try {
			a: switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && r.focus();
					break a;
				case "img": n.src ? r.src = n.src : n.srcSet && (r.srcset = n.srcSet);
			}
		} catch (t) {
			ff(e, e.return, t);
		}
	}
	function kl(e, t, n) {
		try {
			var r = e.stateNode;
			ip(r, e.type, n, t), r[xt] = t;
		} catch (t) {
			ff(e, e.return, t);
		}
	}
	function Al(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Sp(e.type) || e.tag === 4;
	}
	function jl(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || Al(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && Sp(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function Ml(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(i, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(i), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = dn)), Cl(e, r), H = !0;
		else if (i !== 4 && (i === 27 && (Cl(e, r), r = null, Sp(e.type) && (n = e.stateNode, t = null)), e = e.child, e !== null)) for (Ml(e, t, n, r), e = e.sibling; e !== null;) Ml(e, t, n, r), e = e.sibling;
	}
	function Nl(e, t, n, r) {
		var i = e.tag;
		if (i === 5 || i === 6) i = e.stateNode, t ? n.insertBefore(i, t) : n.appendChild(i), Cl(e, r), H = !0;
		else if (i !== 4 && (i === 27 && (Cl(e, r), r = null, Sp(e.type) && (n = e.stateNode)), e = e.child, e !== null)) for (Nl(e, t, n, r), e = e.sibling; e !== null;) Nl(e, t, n, r), e = e.sibling;
	}
	function Pl(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			np(t, r, n), t[bt] = e, t[xt] = n;
		} catch (t) {
			ff(e, e.return, t);
		}
	}
	var Fl = !1, Il = null;
	function Ll(e) {
		(e.tag === 30 || e.subtreeFlags & 33554432) && (Fl = !0);
	}
	var Rl = null;
	function zl() {
		var e = Rl;
		return Rl = null, e;
	}
	var Bl = 0;
	function Vl(e, t, n, r, i) {
		return Bl = 0, Hl(e.child, t, n, r, i);
	}
	function Hl(e, t, n, r, i) {
		for (var a = !1; e !== null;) {
			if (e.tag === 5) {
				var o = e.stateNode;
				if (r !== null) {
					var s = Op(o);
					r.push(s), s.view && (a = !0);
				} else a || Op(o).view && (a = !0);
				Fl = !0, Tp(o, Bl === 0 ? t : t + "_" + Bl, n), Bl++;
			} else e.tag === 22 && e.memoizedState !== null || e.tag === 30 && i || Hl(e.child, t, n, r, i) && (a = !0);
			e = e.sibling;
		}
		return a;
	}
	function Ul(e, t) {
		for (; e !== null;) e.tag === 5 ? Ep(e.stateNode, e.memoizedProps) : e.tag === 22 && e.memoizedState !== null || e.tag === 30 && t || Ul(e.child, t), e = e.sibling;
	}
	function Wl(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if ((e.tag !== 22 || e.memoizedState === null) && (Wl(e), e.tag === 30 && e.flags & 18874368 && e.stateNode.paired)) {
				var t = e.memoizedProps;
				if (t.name == null || t.name === "auto") throw Error(i(544));
				var n = t.name;
				t = fi(t.default, t.share), t !== "none" && (Vl(e, n, t, null, !1) || Ul(e.child, !1));
			}
			e = e.sibling;
		}
	}
	function Gl(e, t) {
		if (e.tag === 30) {
			var n = e.stateNode, r = e.memoizedProps, i = ui(r, n), a = fi(r.default, n.paired ? r.share : r.enter);
			a === "none" ? Wl(e) : Vl(e, i, a, null, !1) ? (Wl(e), n.paired || t || jd(e, r.onEnter)) : Ul(e.child, !1);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Gl(e, t), e = e.sibling;
		else Wl(e);
	}
	function Kl(e) {
		if (Il !== null && Il.size !== 0) {
			var t = Il;
			if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
				if (e.tag !== 22 || e.memoizedState === null) {
					if (e.tag === 30 && e.flags & 18874368) {
						var n = e.memoizedProps, r = n.name;
						if (r != null && r !== "auto") {
							var i = t.get(r);
							if (i !== void 0) {
								var a = fi(n.default, n.share);
								if (a !== "none" && (Vl(e, r, a, null, !1) ? (a = e.stateNode, i.paired = a, a.paired = i, jd(e, n.onShare)) : Ul(e.child, !1)), t.delete(r), t.size === 0) break;
							}
						}
					}
					Kl(e);
				}
				e = e.sibling;
			}
		}
	}
	function ql(e) {
		if (e.tag === 30) {
			var t = e.memoizedProps, n = ui(t, e.stateNode), r = Il === null ? void 0 : Il.get(n), i = fi(t.default, r === void 0 ? t.exit : t.share);
			i !== "none" && (Vl(e, n, i, null, !1) ? r === void 0 ? jd(e, t.onExit) : (i = e.stateNode, r.paired = i, i.paired = r, Il.delete(n), jd(e, t.onShare)) : Ul(e.child, !1)), Il !== null && Kl(e);
		} else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) ql(e), e = e.sibling;
		else Il !== null && Kl(e);
	}
	function Jl(e) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var t = e.memoizedProps, n = ui(t, e.stateNode);
				t = fi(t.default, t.update), e.flags &= -5, t !== "none" && Vl(e, n, t, e.memoizedState = [], !1);
			} else e.subtreeFlags & 33554432 && Jl(e);
			e = e.sibling;
		}
	}
	function Yl(e) {
		if (e.subtreeFlags & 18874368) for (e = e.child; e !== null;) {
			if (e.tag !== 22 || e.memoizedState === null) {
				if (e.tag === 30 && e.flags & 18874368) {
					var t = e.stateNode;
					t.paired !== null && (t.paired = null, Ul(e.child, !1));
				}
				Yl(e);
			}
			e = e.sibling;
		}
	}
	function Xl(e) {
		if (e.tag === 30) e.stateNode.paired = null, Ul(e.child, !1), Yl(e);
		else if (e.subtreeFlags & 33554432) for (e = e.child; e !== null;) Xl(e), e = e.sibling;
		else Yl(e);
	}
	function Zl(e) {
		for (e = e.child; e !== null;) e.tag === 30 ? Ul(e.child, !1) : e.subtreeFlags & 33554432 && Zl(e), e = e.sibling;
	}
	function Ql(e, t, n, r, i, a, o) {
		for (var s = !1; t !== null;) {
			if (t.tag === 5) {
				var c = t.stateNode;
				if (a !== null && Bl < a.length) {
					var l = a[Bl], u = Op(c);
					(l.view || u.view) && (s = !0);
					var d;
					if (d = !(e.flags & 4)) {
						if (u.clip) d = !0;
						else {
							d = l.rect;
							var f = u.rect;
							d = d.y !== f.y || d.x !== f.x || d.height !== f.height || d.width !== f.width;
						}
					}
					d && (e.flags |= 4), u.abs ? u = !l.abs : (l = l.rect, u = u.rect, u = l.height !== u.height || l.width !== u.width), u && (e.flags |= 32);
				} else e.flags |= 32;
				e.flags & 4 && Tp(c, Bl === 0 ? n : n + "_" + Bl, i), s && e.flags & 4 || (Rl === null && (Rl = []), Rl.push(c, Bl === 0 ? r : r + "_" + Bl, t.memoizedProps)), Bl++;
			} else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && o ? e.flags |= t.flags & 32 : Ql(e, t.child, n, r, i, a, o) && (s = !0));
			t = t.sibling;
		}
		return s;
	}
	function $l(e, t) {
		for (e = e.child; e !== null;) {
			if (e.tag === 30) {
				var n = e.memoizedProps, r = e.stateNode, i = ui(n, r), a = fi(n.default, n.update);
				if (t) {
					r = r.clones;
					var o = r === null ? null : r.map(kp);
				} else o = e.memoizedState, e.memoizedState = null;
				r = e;
				var s = e.child;
				Bl = 0, i = Ql(r, s, i, i, a, o, !1), e.flags & 4 && i && (t || jd(e, n.onUpdate));
			} else e.subtreeFlags & 33554432 && $l(e, t);
			e = e.sibling;
		}
	}
	var eu = !1, Y = !1, tu = !1, nu = !1, ru = typeof WeakSet == "function" ? WeakSet : Set, iu = null, au = !1, ou = !1, su = !1, cu = !1;
	function lu(e, t, n) {
		if (e = e.containerInfo, sp = gh, e = Br(e), Vr(e)) {
			if ("selectionStart" in e) var r = {
				start: e.selectionStart,
				end: e.selectionEnd
			};
			else a: {
				r = (r = e.ownerDocument) && r.defaultView || window;
				var i = r.getSelection && r.getSelection();
				if (i && i.rangeCount !== 0) {
					r = i.anchorNode;
					var a = i.anchorOffset, o = i.focusNode;
					i = i.focusOffset;
					try {
						r.nodeType, o.nodeType;
					} catch {
						r = null;
						break a;
					}
					var s = 0, c = -1, l = -1, u = 0, d = 0, f = e, p = null;
					b: for (;;) {
						for (var m; f !== r || a !== 0 && f.nodeType !== 3 || (c = s + a), f !== o || i !== 0 && f.nodeType !== 3 || (l = s + i), f.nodeType === 3 && (s += f.nodeValue.length), (m = f.firstChild) !== null;) p = f, f = m;
						for (;;) {
							if (f === e) break b;
							if (p === r && ++u === a && (c = s), p === o && ++d === i && (l = s), (m = f.nextSibling) !== null) break;
							f = p, p = f.parentNode;
						}
						f = m;
					}
					r = c === -1 || l === -1 ? null : {
						start: c,
						end: l
					};
				} else r = null;
			}
			r ||= {
				start: 0,
				end: 0
			};
		} else r = null;
		for (cp = {
			focusedElem: e,
			selectionRange: r
		}, gh = !1, n = (n & 335544064) === n, iu = t, t = n ? 9270 : 1024; iu !== null;) {
			if (e = iu, n && (r = e.deletions, r !== null)) for (a = 0; a < r.length; a++) n && ql(r[a]);
			if (e.alternate === null && e.flags & 2) n && Ll(e), uu(n);
			else {
				if (e.tag === 22) {
					if (r = e.alternate, e.memoizedState !== null) {
						r !== null && r.memoizedState === null && n && ql(r), uu(n);
						continue;
					}
					if (r !== null && r.memoizedState !== null) {
						n && Ll(e), uu(n);
						continue;
					}
				}
				r = e.child, (e.subtreeFlags & t) !== 0 && r !== null ? (r.return = e, iu = r) : (n && Jl(e), uu(n));
			}
		}
		Il = null;
	}
	function uu(e) {
		for (; iu !== null;) {
			var t = iu, n = e, r = t.alternate, a = t.flags;
			switch (t.tag) {
				case 0:
				case 11:
				case 15: break;
				case 1:
					if (a & 1024 && r !== null) {
						n = void 0, a = r.memoizedProps, r = r.memoizedState;
						var o = t.stateNode;
						try {
							var s = _c(t.type, a);
							n = o.getSnapshotBeforeUpdate(s, r), o.__reactInternalSnapshotBeforeUpdate = n;
						} catch (e) {
							ff(t, t.return, e);
						}
					}
					break;
				case 3:
					if (a & 1024) {
						if (r = t.stateNode.containerInfo, n = r.nodeType, n === 9) nm(r);
						else if (n === 1) switch (r.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								nm(r);
								break;
							default: r.textContent = "";
						}
					}
					break;
				case 5:
				case 26:
				case 27:
				case 6:
				case 4:
				case 17: break;
				case 30:
					n && r !== null && (n = ui(r.memoizedProps, r.stateNode), a = t.memoizedProps, a = fi(a.default, a.update), a !== "none" && Vl(r, n, a, r.memoizedState = [], !0));
					break;
				default: if (a & 1024) throw Error(i(163));
			}
			if (r = t.sibling, r !== null) {
				r.return = t.return, iu = r;
				break;
			}
			iu = t.return;
		}
	}
	function du(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				ju(e, n), r & 4 && _l(5, n);
				break;
			case 1:
				if (ju(e, n), r & 4) {
					if (e = n.stateNode, t === null) try {
						e.componentDidMount();
					} catch (e) {
						ff(n, n.return, e);
					}
					else {
						var i = _c(n.type, t.memoizedProps);
						t = t.memoizedState;
						try {
							e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
						} catch (e) {
							ff(n, n.return, e);
						}
					}
				}
				r & 64 && yl(n), r & 512 && xl(n, n.return);
				break;
			case 3:
				if (ju(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						vo(e, t);
					} catch (e) {
						ff(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && Pl(n);
			case 26:
			case 5:
				ju(e, n), t === null && r & 4 && Ol(n), r & 512 && xl(n, n.return);
				break;
			case 12:
				ju(e, n);
				break;
			case 31:
				ju(e, n), r & 4 && bu(e, n);
				break;
			case 13:
				ju(e, n), r & 4 && xu(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = gf.bind(null, n), cm(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || eu, !r) {
					var a = t !== null && t.memoizedState !== null || Y;
					t = eu, i = Y, eu = r, (Y = a) && !i ? (r = 2, n.subtreeFlags & 8772 && (r |= 1), Nu(e, n, r)) : ju(e, n), eu = t, Y = i;
				}
				break;
			case 30:
				ju(e, n), r & 512 && xl(n, n.return);
				break;
			case 7: r & 512 && xl(n, n.return);
			default: ju(e, n);
		}
	}
	function fu(e, t) {
		for (e = e.child; e !== null;) pu(e, t), e = e.sibling;
	}
	function pu(e, t) {
		switch (e.tag) {
			case 5:
			case 26:
				try {
					var n = e.stateNode;
					if (t) {
						var r = n.style;
						typeof r.setProperty == "function" ? r.setProperty("display", "none", "important") : r.display = "none";
					} else {
						var i = e.stateNode, a = e.memoizedProps.style, o = a != null && a.hasOwnProperty("display") ? a.display : null;
						i.style.display = o == null || typeof o == "boolean" ? "" : ("" + o).trim();
					}
				} catch (t) {
					ff(e, e.return, t);
				}
				mu(e, t);
				break;
			case 6:
				try {
					e.stateNode.nodeValue = t ? "" : e.memoizedProps, H = !0;
				} catch (t) {
					ff(e, e.return, t);
				}
				break;
			case 18:
				try {
					var s = e.stateNode;
					t ? wp(s, !0) : wp(e.stateNode, !1);
				} catch (t) {
					ff(e, e.return, t);
				}
				break;
			case 22:
			case 23:
				e.memoizedState === null && fu(e, t);
				break;
			default: fu(e, t);
		}
	}
	function mu(e, t) {
		if (e.subtreeFlags & 67108864) for (e = e.child; e !== null;) {
			a: {
				var n = e, r = t;
				switch (n.tag) {
					case 4:
						pu(n, r);
						break a;
					case 22:
						n.memoizedState === null && mu(n, r);
						break a;
					default: mu(n, r);
				}
			}
			e = e.sibling;
		}
	}
	function hu(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, hu(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && kt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var gu = null, _u = !1;
	function vu(e, t, n) {
		for (n = n.child; n !== null;) yu(e, t, n), n = n.sibling;
	}
	function yu(e, t, n) {
		if (z && typeof z.onCommitFiberUnmount == "function") try {
			z.onCommitFiberUnmount(Ye, n);
		} catch {}
		switch (n.tag) {
			case 26:
				Y || Sl(n, t), vu(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && !Y && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				Y || Sl(n, t), Tl(n);
				var r = gu, i = _u;
				Sp(n.type) && (gu = n.stateNode, _u = !1), vu(e, t, n), gm(n.stateNode, n.type, n.memoizedProps), gu = r, _u = i;
				break;
			case 5: Y || Sl(n, t), Tl(n);
			case 6:
				if (n.tag === 6 && Tl(n), r = gu, i = _u, gu = null, vu(e, t, n), gu = r, _u = i, gu !== null) {
					if (_u) try {
						(gu.nodeType === 9 ? gu.body : gu.nodeName === "HTML" ? gu.ownerDocument.body : gu).removeChild(n.stateNode), H = !0;
					} catch (e) {
						ff(n, t, e);
					}
					else try {
						gu.removeChild(n.stateNode), H = !0;
					} catch (e) {
						ff(n, t, e);
					}
				}
				break;
			case 18:
				gu !== null && (_u ? (e = gu, Cp(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Hh(e)) : Cp(gu, n.stateNode));
				break;
			case 4:
				r = gu, i = _u, gu = n.stateNode.containerInfo, _u = !0, vu(e, t, n), gu = r, _u = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				vl(2, n, t), Y || vl(4, n, t), vu(e, t, n);
				break;
			case 1:
				Y || (Sl(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && bl(n, t, r)), vu(e, t, n);
				break;
			case 21:
				vu(e, t, n);
				break;
			case 22:
				Y = (r = Y) || n.memoizedState !== null, vu(e, t, n), Y = r;
				break;
			case 30:
				Sl(n, t), vu(e, t, n);
				break;
			case 7:
				Y || Sl(n, t), vu(e, t, n);
				break;
			default: vu(e, t, n);
		}
	}
	function bu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Hh(e);
			} catch (e) {
				ff(t, t.return, e);
			}
		}
	}
	function xu(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Hh(e);
		} catch (e) {
			ff(t, t.return, e);
		}
	}
	function Su(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new ru()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new ru()), t;
			default: throw Error(i(435, e.tag));
		}
	}
	function Cu(e, t) {
		var n = Su(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = _f.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function wu(e, t, n) {
		var r = t.deletions;
		if (r !== null) for (var a = 0; a < r.length; a++) {
			var o = r[a], s = e, c = t, l = c;
			a: for (; l !== null;) {
				switch (l.tag) {
					case 27:
						if (Sp(l.type)) {
							gu = l.stateNode, _u = !1;
							break a;
						}
						break;
					case 5:
						gu = l.stateNode, _u = !1;
						break a;
					case 3:
					case 4:
						gu = l.stateNode.containerInfo, _u = !0;
						break a;
				}
				l = l.return;
			}
			if (gu === null) throw Error(i(160));
			yu(s, c, o), gu = null, _u = !1, s = o.alternate, s !== null && (s.return = null), o.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) Eu(t, e, n), t = t.sibling;
	}
	var Tu = null;
	function Eu(e, t, n) {
		var r = e.alternate, a = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				if (a & 4 && (r = e.updateQueue, r = r === null ? null : r.events, r !== null)) for (var o = 0; o < r.length; o++) {
					var s = r[o];
					s.ref.impl = s.nextImpl;
				}
				wu(t, e, n), Du(e), a & 4 && (vl(3, e, e.return), _l(3, e), vl(5, e, e.return));
				break;
			case 1:
				wu(t, e, n), Du(e), a & 512 && (Y || r === null || Sl(r, r.return)), a & 64 && eu && (e = e.updateQueue, e !== null && (t = e.callbacks, t !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? t : n.concat(t))));
				break;
			case 26:
				if (o = Tu, wu(t, e, n), Du(e), a & 512 && (Y || r === null || Sl(r, r.return)), a & 4) {
					if (a = r === null ? null : r.memoizedState, n = e.memoizedState, r === null) {
						if (n === null) {
							if (e.stateNode === null) {
								if (eu) e.stateNode = fp(e.type, e.memoizedProps, t.containerInfo, e);
								else {
									a: {
										t = e.type, n = e.memoizedProps, a = o.ownerDocument || o;
										b: switch (t) {
											case "title":
												r = a.getElementsByTagName("title")[0], (!r || r[Dt] || r[bt] || r.namespaceURI === "http://www.w3.org/2000/svg" || r.hasAttribute("itemprop")) && (r = a.createElement(t), a.head.insertBefore(r, a.querySelector("head > title"))), np(r, t, n), r[bt] = e, Pt(r), t = r;
												break a;
											case "link":
												if (o = Gm("link", "href", a).get(t + (n.href || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && r.getAttribute("rel") === (n.rel == null ? null : n.rel) && r.getAttribute("title") === (n.title == null ? null : n.title) && r.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), np(r, t, n), a.head.appendChild(r);
												break;
											case "meta":
												if (o = Gm("meta", "content", a).get(t + (n.content || ""))) {
													for (s = 0; s < o.length; s++) if (r = o[s], r.getAttribute("content") === (n.content == null ? null : "" + n.content) && r.getAttribute("name") === (n.name == null ? null : n.name) && r.getAttribute("property") === (n.property == null ? null : n.property) && r.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && r.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
														o.splice(s, 1);
														break b;
													}
												}
												r = a.createElement(t), np(r, t, n), a.head.appendChild(r);
												break;
											default: throw Error(i(468, t));
										}
										r[bt] = e, Pt(r), t = r;
									}
									e.stateNode = t;
								}
							} else eu || Km(o, e.type, e.stateNode);
						} else e.stateNode = Bm(o, n, e.memoizedProps);
					} else a === n ? n === null && e.stateNode !== null && kl(e, e.memoizedProps, r.memoizedProps) : (a === null ? (t = r.stateNode, t === null || Y || t.parentNode.removeChild(t)) : a.count--, n === null ? eu || Km(o, e.type, e.stateNode) : Bm(o, n, e.memoizedProps));
				}
				break;
			case 27:
				wu(t, e, n), Du(e), a & 512 && (Y || r === null || Sl(r, r.return)), r !== null && a & 4 && kl(e, e.memoizedProps, r.memoizedProps);
				break;
			case 5:
				if (o = tu, tu = !1, wu(t, e, n), tu = o, Du(e), a & 512 && (Y || r === null || Sl(r, r.return)), e.flags & 32) {
					t = e.stateNode;
					try {
						nn(t, ""), H = !0;
					} catch (t) {
						ff(e, e.return, t);
					}
				}
				a & 4 && e.stateNode != null && (t = e.memoizedProps, kl(e, t, r === null ? t : r.memoizedProps)), a & 1024 && (nu = !0);
				break;
			case 6:
				if (wu(t, e, n), Du(e), a & 4) {
					if (e.stateNode === null) throw Error(i(162));
					t = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = t, H = !0;
					} catch (t) {
						ff(e, e.return, t);
					}
				}
				break;
			case 3:
				if (H = !1, Wm = null, o = Tu, Tu = bm(t.containerInfo), wu(t, e, n), Tu = o, Du(e), a & 4 && r !== null && r.memoizedState.isDehydrated) try {
					Hh(t.containerInfo);
				} catch (t) {
					ff(e, e.return, t);
				}
				nu && (nu = !1, Ou(e)), H = !1;
				break;
			case 4:
				a = tu, tu = eu, r = U(), o = Tu, Tu = bm(e.stateNode.containerInfo), wu(t, e, n), Du(e), Tu = o, H && ou && (su = !0), H = r, tu = a;
				break;
			case 12:
				wu(t, e, n), Du(e);
				break;
			case 31:
				wu(t, e, n), Du(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Cu(e, t)));
				break;
			case 13:
				wu(t, e, n), Du(e), e.child.flags & 8192 && e.memoizedState !== null != (r !== null && r.memoizedState !== null) && (fd = Be()), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Cu(e, t)));
				break;
			case 22:
				o = e.memoizedState !== null, s = r !== null && r.memoizedState !== null;
				var c = eu, l = Y, u = tu;
				eu = c || o, tu = u || o, Y = l || s, wu(t, e, n), Y = l, tu = u, eu = c, Du(e), a & 8192 && (t = e.stateNode, t._visibility = o ? t._visibility & -2 : t._visibility | 1, !o || r === null || s || eu || Y || (t = s || Y, n = eu, r = Y, eu = o || eu, Y = t, Mu(e, 2), eu = n, Y = r), !o && tu || fu(e, o)), a & 4 && (t = e.updateQueue, t !== null && (n = t.retryQueue, n !== null && (t.retryQueue = null, Cu(e, n))));
				break;
			case 19:
				wu(t, e, n), Du(e), a & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Cu(e, t)));
				break;
			case 30:
				a & 512 && (Y || r === null || Sl(r, r.return)), a = U(), o = ou, s = (n & 335544064) === n, c = e.memoizedProps, ou = s && fi(c.default, c.update) !== "none", wu(t, e, n), Du(e), s && r !== null && H && (e.flags |= 4), ou = o, H = a;
				break;
			case 21: break;
			case 7: a & 512 && (Y || r === null || Sl(r, r.return)), r && r.stateNode !== null && (r.stateNode._fragmentFiber = e);
			default: wu(t, e, n), Du(e);
		}
	}
	function Du(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (Al(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				r = null;
				for (var a = e.return; a !== null;) {
					if (Dl(a)) {
						var o = a.stateNode;
						r === null ? r = [o] : r.push(o);
					}
					if (El(a)) break;
					a = a.return;
				}
				var s = r;
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var c = n.stateNode;
						Nl(e, jl(e), c, s);
						break;
					case 5:
						var l = n.stateNode;
						n.flags & 32 && (nn(l, ""), n.flags &= -33), Nl(e, jl(e), l, s);
						break;
					case 3:
					case 4:
						var u = n.stateNode.containerInfo;
						Ml(e, jl(e), u, s);
						break;
					default: throw Error(i(161));
				}
			} catch (t) {
				ff(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function Ou(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			Ou(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, gh = !0, t.reset(), gh = !1), e = e.sibling;
		}
	}
	function ku(e, t) {
		if (t.subtreeFlags & 9270) for (t = t.child; t !== null;) Au(t, e), t = t.sibling;
		else $l(t, !1);
	}
	function Au(e, t) {
		var n = e.alternate;
		if (n === null) Gl(e, !1);
		else switch (e.tag) {
			case 3:
				if (cu = au = !1, zl(), ku(t, e), !au && !su) {
					if (e = Rl, e !== null) for (var r = 0; r < e.length; r += 3) {
						n = e[r];
						var i = e[r + 1];
						Ep(n, e[r + 2]), n = n.ownerDocument.documentElement, n !== null && n.animate({
							opacity: [0, 0],
							pointerEvents: ["none", "none"]
						}, {
							duration: 0,
							fill: "forwards",
							pseudoElement: "::view-transition-group(" + i + ")"
						});
					}
					e = t.containerInfo, e = e.nodeType === 9 ? e.documentElement : e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "" && (e.style.viewTransitionName = "none", e.animate({
						opacity: [0, 0],
						pointerEvents: ["none", "none"]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition-group(root)"
					}), e.animate({
						width: [0, 0],
						height: [0, 0]
					}, {
						duration: 0,
						fill: "forwards",
						pseudoElement: "::view-transition"
					})), cu = !0;
				}
				Rl = null;
				break;
			case 5:
				ku(t, e);
				break;
			case 4:
				r = au, au = !1, ku(t, e), au && (su = !0), au = r;
				break;
			case 22:
				e.memoizedState === null && (n.memoizedState === null ? ku(t, e) : Gl(e, !1));
				break;
			case 30:
				r = au, i = zl(), au = !1, ku(t, e), au && (e.flags |= 4);
				var a = e.memoizedProps, o = e.stateNode;
				t = ui(a, o), o = ui(n.memoizedProps, o);
				var s = fi(a.default, a.update);
				s === "none" ? t = !1 : (a = n.memoizedState, n.memoizedState = null, n = e.child, Bl = 0, t = Ql(e, n, t, o, s, a, !0), Bl !== (a === null ? 0 : a.length) && (e.flags |= 32)), e.flags & 4 && t ? (jd(e, e.memoizedProps.onUpdate), Rl = i) : i !== null && (i.push.apply(i, Rl), Rl = i), au = e.flags & 32 ? !0 : r;
				break;
			default: ku(t, e);
		}
	}
	function ju(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) du(e, t.alternate, t), t = t.sibling;
	}
	function Mu(e, t) {
		for (e = e.child; e !== null;) {
			var n = e, r = t;
			switch (n.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					vl(4, n, n.return), Mu(n, r);
					break;
				case 1:
					Sl(n, n.return);
					var i = n.stateNode;
					typeof i.componentWillUnmount == "function" && bl(n, n.return, i), Mu(n, r);
					break;
				case 27: r & 2 && gm(n.stateNode, n.type, n.memoizedProps);
				case 5:
					Sl(n, n.return), n.tag !== 5 && n.tag !== 27 || Tl(n), Mu(n, r);
					break;
				case 6:
					Tl(n);
					break;
				case 26:
					Sl(n, n.return), i = n.stateNode, n.memoizedState !== null || i === null || Y || i.parentNode.removeChild(i), Mu(n, r);
					break;
				case 22:
					n.memoizedState === null && Mu(n, r);
					break;
				case 30:
					Sl(n, n.return), Mu(n, r);
					break;
				case 7: Sl(n, n.return);
				default: Mu(n, r);
			}
			e = e.sibling;
		}
	}
	function Nu(e, t, n) {
		for (n = t.subtreeFlags & 8772 ? n : n & -2, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags, s = !!(n & 1);
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					Nu(i, a, n), _l(4, a);
					break;
				case 1:
					if (Nu(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						ff(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var c = r.stateNode;
						try {
							var l = i.shared.hiddenCallbacks;
							if (l !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < l.length; i++) _o(l[i], c);
						} catch (e) {
							ff(r, r.return, e);
						}
					}
					s && o & 64 && yl(a), xl(a, a.return);
					break;
				case 27: n & 2 && Pl(a);
				case 5:
					a.tag !== 5 && a.tag !== 27 || wl(a), Nu(i, a, n), s && r === null && o & 4 && Ol(a), xl(a, a.return);
					break;
				case 6:
					wl(a);
					break;
				case 26:
					c = a.stateNode, a.memoizedState !== null || c === null || eu || Km(bm(c.ownerDocument), a.type, c), Nu(i, a, n), s && r === null && o & 4 && Ol(a), xl(a, a.return);
					break;
				case 12:
					Nu(i, a, n);
					break;
				case 31:
					Nu(i, a, n), s && o & 4 && bu(i, a);
					break;
				case 13:
					Nu(i, a, n), s && o & 4 && xu(i, a);
					break;
				case 22:
					a.memoizedState === null && Nu(i, a, n), xl(a, a.return);
					break;
				case 30:
					Nu(i, a, n), xl(a, a.return);
					break;
				case 7: xl(a, a.return);
				default: Nu(i, a, n);
			}
			t = t.sibling;
		}
	}
	function Pu(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && Ea(n));
	}
	function Fu(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Ea(e));
	}
	function Iu(e, t, n, r) {
		var i = (n & 335544064) === n;
		if (t.subtreeFlags & (i ? 10262 : 10256)) for (t = t.child; t !== null;) Lu(e, t, n, r), t = t.sibling;
		else i && Zl(t);
	}
	function Lu(e, t, n, r) {
		var i = (n & 335544064) === n;
		i && t.alternate === null && t.return !== null && t.return.alternate !== null && Xl(t);
		var a = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Iu(e, t, n, r), a & 2048 && _l(9, t);
				break;
			case 1:
				Iu(e, t, n, r);
				break;
			case 3:
				Iu(e, t, n, r), i && cu && (e = e.containerInfo, e = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, e.style.viewTransitionName === "root" && (e.style.viewTransitionName = ""), e = e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "none" && (e.style.viewTransitionName = "")), a & 2048 && (a = null, t.alternate !== null && (a = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== a && (t.refCount++, a != null && Ea(a)));
				break;
			case 12:
				if (a & 2048) {
					Iu(e, t, n, r), a = t.stateNode;
					try {
						var o = t.memoizedProps, s = o.id, c = o.onPostCommit;
						typeof c == "function" && c(s, t.alternate === null ? "mount" : "update", a.passiveEffectDuration, -0);
					} catch (e) {
						ff(t, t.return, e);
					}
				} else Iu(e, t, n, r);
				break;
			case 31:
				Iu(e, t, n, r);
				break;
			case 13:
				Iu(e, t, n, r);
				break;
			case 23: break;
			case 22:
				o = t.stateNode, s = t.alternate, t.memoizedState === null ? (i && s !== null && s.memoizedState !== null && Xl(t), o._visibility & 2 ? Iu(e, t, n, r) : (o._visibility |= 2, Ru(e, t, n, r, !!(t.subtreeFlags & 10256) || !1))) : (i && s !== null && s.memoizedState === null && Xl(s), o._visibility & 2 ? Iu(e, t, n, r) : zu(e, t)), a & 2048 && Pu(s, t);
				break;
			case 24:
				Iu(e, t, n, r), a & 2048 && Fu(t.alternate, t);
				break;
			case 30:
				i && (a = t.alternate, a !== null && (Ul(a.child, !0), Ul(t.child, !0))), Iu(e, t, n, r);
				break;
			default: Iu(e, t, n, r);
		}
	}
	function Ru(e, t, n, r, i) {
		for (i &&= !!(t.subtreeFlags & 10256) || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Ru(a, o, s, c, i), _l(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Ru(a, o, s, c, i)) : u._visibility & 2 ? Ru(a, o, s, c, i) : zu(a, o), i && l & 2048 && Pu(o.alternate, o);
					break;
				case 24:
					Ru(a, o, s, c, i), i && l & 2048 && Fu(o.alternate, o);
					break;
				default: Ru(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function zu(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					zu(n, r), i & 2048 && Pu(r.alternate, r);
					break;
				case 24:
					zu(n, r), i & 2048 && Fu(r.alternate, r);
					break;
				default: zu(n, r);
			}
			t = t.sibling;
		}
	}
	var Bu = 8192;
	function Vu(e, t, n) {
		if (e.subtreeFlags & Bu) for (e = e.child; e !== null;) Hu(e, t, n), e = e.sibling;
	}
	function Hu(e, t, n) {
		switch (e.tag) {
			case 26:
				Vu(e, t, n), e.flags & Bu && (e.memoizedState === null ? (e = e.stateNode, (t & 335544128) === t && Zm(n, e)) : Qm(n, Tu, e.memoizedState, e.memoizedProps));
				break;
			case 5:
				Vu(e, t, n), e.flags & Bu && (e = e.stateNode, (t & 335544128) === t && Zm(n, e));
				break;
			case 3:
			case 4:
				var r = Tu;
				Tu = bm(e.stateNode.containerInfo), Vu(e, t, n), Tu = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = Bu, Bu = 16777216, Vu(e, t, n), Bu = r) : Vu(e, t, n));
				break;
			case 30:
				if ((e.flags & Bu) !== 0 && (r = e.memoizedProps.name, r != null && r !== "auto")) {
					var i = e.stateNode;
					i.paired = null, Il === null && (Il = /* @__PURE__ */ new Map()), Il.set(r, i);
				}
				Vu(e, t, n);
				break;
			default: Vu(e, t, n);
		}
	}
	function Uu(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function Wu(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				iu = r, qu(r, e);
			}
			Uu(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Gu(e), e = e.sibling;
	}
	function Gu(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				Wu(e), e.flags & 2048 && vl(9, e, e.return);
				break;
			case 3:
				Wu(e);
				break;
			case 12:
				Wu(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Ku(e)) : Wu(e);
				break;
			default: Wu(e);
		}
	}
	function Ku(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				iu = r, qu(r, e);
			}
			Uu(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					vl(8, t, t.return), Ku(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, Ku(t));
					break;
				default: Ku(t);
			}
			e = e.sibling;
		}
	}
	function qu(e, t) {
		for (; iu !== null;) {
			var n = iu;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					vl(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: Ea(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, iu = r;
			else a: for (n = e; iu !== null;) {
				r = iu;
				var i = r.sibling, a = r.return;
				if (hu(r), r === n) {
					iu = null;
					break a;
				}
				if (i !== null) {
					i.return = a, iu = i;
					break a;
				}
				iu = a;
			}
		}
	}
	var Ju = {
		getCacheForType: function(e) {
			var t = va(wa), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return va(wa).controller.signal;
		}
	}, Yu = typeof WeakMap == "function" ? WeakMap : Map, X = 0, Xu = null, Z = null, Q = 0, Zu = 0, Qu = null, $u = !1, ed = !1, td = !1, nd = 0, rd = 0, id = 0, ad = 0, od = 0, sd = 0, cd = 0, ld = null, ud = null, dd = !1, fd = 0, pd = 0, md = Infinity, hd = null, gd = null, _d = 0, vd = null, yd = null, bd = 0, xd = 0, Sd = null, Cd = null, wd = null, Td = null, Ed = null, Dd = 0, Od = null;
	function kd() {
		return X & 2 && Q !== 0 ? Q & -Q : L.T === null ? _t() : Nf();
	}
	function Ad() {
		if (sd === 0) {
			if (!(Q & 536870912) || q) {
				var e = tt;
				tt <<= 1, !(tt & 3932160) && (tt = 262144), sd = e;
			} else sd = 536870912;
		}
		return e = wo.current, e !== null && (e.flags |= 32), sd;
	}
	function jd(e, t) {
		if (t != null) {
			var n = e.stateNode, r = n.ref;
			r === null && (r = n.ref = Pp(ui(e.memoizedProps, n))), Td === null && (Td = []), Td.push(t.bind(null, r));
		}
	}
	function Md(e, t, n) {
		(e === Xu && (Zu === 2 || Zu === 9) || e.cancelPendingCommit !== null) && (zd(e, 0), Id(e, Q, sd, !1)), ut(e, n), X & 2 && e === Xu || (e === Xu && (!(X & 2) && (ad |= n), rd === 4 && Id(e, Q, sd, !1)), Tf(e));
	}
	function Nd(e, t, n) {
		if (X & 6) throw Error(i(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || at(e, t), a = r ? qd(e, t) : Gd(e, t, !0), o = r;
		do {
			if (a === 0) {
				ed && !r && Id(e, t, 0, !1);
				break;
			}
			if (n = e.current.alternate, o && !Fd(n)) a = Gd(e, t, !1), o = !1;
			else {
				if (a === 2) {
					if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
					else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
					if (s !== 0) {
						t = s;
						a: {
							var c = e;
							a = ld;
							var l = c.current.memoizedState.isDehydrated;
							if (l && (zd(c, s).flags |= 256), s = Gd(c, s, !1), s !== 2 && s !== 6) {
								if (td && !l) {
									c.errorRecoveryDisabledLanes |= o, ad |= o, a = 4;
									break a;
								}
								o = ud, ud = a, o !== null && (ud === null ? ud = o : ud.push.apply(ud, o));
							}
							a = s;
						}
						if (o = !1, a !== 2) continue;
					}
				}
				if (a === 1) {
					zd(e, 0), Id(e, t, 0, !0);
					break;
				}
				a: {
					switch (r = e, o = a, o) {
						case 0:
						case 1: throw Error(i(345));
						case 4: if ((t & 4194048) !== t && (t & 62914560) !== t) break;
						case 6:
							Id(r, t, sd, !$u);
							break a;
						case 2:
							ud = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(i(329));
					}
					if ((t & 62914560) === t && (a = fd + 300 - Be(), 10 < a)) {
						if (Id(r, t, sd, !$u), it(r, 0, !0) !== 0) break a;
						bd = t, r.timeoutHandle = gp(Pd.bind(null, r, n, ud, hd, dd, t, sd, ad, cd, $u, o, "Throttled", -0, 0), a);
						break a;
					}
					Pd(r, n, ud, hd, dd, t, sd, ad, cd, $u, o, null, -0, 0);
				}
				break;
			}
		} while (1);
		Tf(e);
	}
	function Pd(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		e.timeoutHandle = -1;
		var m = t.subtreeFlags, h = (a & 335544064) === a;
		d = null, (h || m & 8192 || (m & 16785408) == 16785408) && (d = {
			stylesheets: null,
			count: 0,
			imgCount: 0,
			imgBytes: 0,
			suspenseyImages: [],
			waitingForImages: !0,
			waitingForViewTransition: !1,
			unsuspend: dn
		}, Il = null, Hu(t, a, d), h && (m = d, h = e.containerInfo, h = (h.nodeType === 9 ? h : h.ownerDocument).__reactViewTransition, h != null && (m.count++, m.waitingForViewTransition = !0, m = nh.bind(m), h.finished.then(m, m))), m = (a & 62914560) === a ? fd - Be() : (a & 4194048) === a ? pd - Be() : 0, m = eh(d, m), m !== null) ? (bd = a, e.cancelPendingCommit = m(ef.bind(null, e, t, a, n, r, i, o, s, c, l, u, d, null, f, p)), Id(e, a, o, !l)) : ef(e, t, a, n, r, i, o, s, c, l, u, d);
	}
	function Fd(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!Pr(a(), i)) return !1;
				} catch {
					return !1;
				}
			}
			if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
			else {
				if (t === e) break;
				for (; t.sibling === null;) {
					if (t.return === null || t.return === e) return !0;
					t = t.return;
				}
				t.sibling.return = t.return, t = t.sibling;
			}
		}
		return !0;
	}
	function Id(e, t, n, r) {
		t = ot(e, t), t &= ~od, t &= ~ad, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - B(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && ft(e, n, t);
	}
	function Ld() {
		return X & 6 ? !0 : (Ef(0, !1), !1);
	}
	function Rd() {
		if (Z !== null) {
			if (Zu === 0) var e = Z.return;
			else e = Z, ua = la = null, $o(e), Qa = null, $a = 0, e = Z;
			for (; e !== null;) gl(e.alternate, e), e = e.return;
			Z = null;
		}
	}
	function zd(e, t) {
		var n = e.timeoutHandle;
		return n !== -1 && (e.timeoutHandle = -1, _p(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), bd = 0, Rd(), Xu = e, Z = n = Di(e.current, null), Q = t, Zu = 0, Qu = null, $u = !1, ed = at(e, t), td = !1, cd = sd = od = ad = id = rd = 0, ud = ld = null, dd = !1, nd = ot(e, t), _i(), n;
	}
	function Bd(e, t) {
		J = null, L.H = lc, t === Ha || t === Wa ? (t = Xa(), Zu = 3) : t === Ua ? (t = Xa(), Zu = 4) : Zu = t === Dc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, Qu = t, Z === null && (rd = 1, xc(e, Fi(t, e.current)));
	}
	function Vd() {
		var e = wo.current;
		return e === null ? !0 : (Q & 4194048) === Q ? To === null : (Q & 62914560) === Q || Q & 536870912 ? e === To : !1;
	}
	function Hd() {
		var e = L.H;
		return L.H = lc, e === null ? lc : e;
	}
	function Ud() {
		var e = L.A;
		return L.A = Ju, e;
	}
	function Wd() {
		rd = 4, $u || (Q & 4194048) !== Q && wo.current !== null || (ed = !0), !(id & 134217727) && !(ad & 134217727) || Xu === null || Id(Xu, Q, sd, !1);
	}
	function Gd(e, t, n) {
		var r = X;
		X |= 2;
		var i = Hd(), a = Ud();
		(Xu !== e || Q !== t) && (hd = null, zd(e, t)), t = !1;
		var o = rd;
		a: do
			try {
				if (Zu !== 0 && Z !== null) {
					var s = Z, c = Qu;
					switch (Zu) {
						case 8:
							Rd(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							wo.current === null && (t = !0);
							var l = Zu;
							if (Zu = 0, Qu = null, Zd(e, s, c, l), n && ed) {
								o = 0;
								break a;
							}
							break;
						default: l = Zu, Zu = 0, Qu = null, Zd(e, s, c, l);
					}
				}
				Kd(), o = rd;
				break;
			} catch (t) {
				Bd(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, ua = la = null, X = r, L.H = i, L.A = a, Z === null && (Xu = null, Q = 0, _i()), o;
	}
	function Kd() {
		for (; Z !== null;) Yd(Z);
	}
	function qd(e, t) {
		var n = X;
		X |= 2;
		var r = Hd(), a = Ud();
		Xu !== e || Q !== t ? (hd = null, md = Be() + 500, zd(e, t)) : ed = at(e, t);
		a: do
			try {
				if (Zu !== 0 && Z !== null) {
					t = Z;
					var o = Qu;
					b: switch (Zu) {
						case 1:
							Zu = 0, Qu = null, Zd(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (Ka(o)) {
								Zu = 0, Qu = null, Xd(t);
								break;
							}
							t = function() {
								Zu !== 2 && Zu !== 9 || Xu !== e || (Zu = 7), Tf(e);
							}, o.then(t, t);
							break a;
						case 3:
							Zu = 7;
							break a;
						case 4:
							Zu = 5;
							break a;
						case 7:
							Ka(o) ? (Zu = 0, Qu = null, Xd(t)) : (Zu = 0, Qu = null, Zd(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (Z.tag) {
								case 26: s = Z.memoizedState;
								case 5:
								case 27:
									var c = Z;
									if (s ? Ym(s) : c.stateNode.complete) {
										Zu = 0, Qu = null;
										var l = c.sibling;
										if (l !== null) Z = l;
										else {
											var u = c.return;
											u === null ? Z = null : (Z = u, Qd(u));
										}
										break b;
									}
							}
							Zu = 0, Qu = null, Zd(e, t, o, 5);
							break;
						case 6:
							Zu = 0, Qu = null, Zd(e, t, o, 6);
							break;
						case 8:
							Rd(), rd = 6;
							break a;
						default: throw Error(i(462));
					}
				}
				Jd();
				break;
			} catch (t) {
				Bd(e, t);
			}
		while (1);
		return ua = la = null, L.H = r, L.A = a, X = n, Z === null ? (Xu = null, Q = 0, _i(), rd) : 0;
	}
	function Jd() {
		for (; Z !== null && !Re();) Yd(Z);
	}
	function Yd(e) {
		var t = sl(e.alternate, e, nd);
		e.memoizedProps = e.pendingProps, t === null ? Qd(e) : Z = t;
	}
	function Xd(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = Vc(n, t, t.pendingProps, t.type, void 0, Q);
				break;
			case 11:
				t = Vc(n, t, t.pendingProps, t.type.render, t.ref, Q);
				break;
			case 5:
				$o(t);
				var r = t;
				r === Xi && (q ? (ra(r), r.tag === 5 && r.stateNode != null && (Zi = r.stateNode)) : (ra(r), q = !0));
			default: gl(n, t), t = Z = Oi(t, nd), t = sl(n, t, nd);
		}
		e.memoizedProps = e.pendingProps, t === null ? Qd(e) : Z = t;
	}
	function Zd(e, t, n, r) {
		ua = la = null, $o(t), Qa = null, $a = 0;
		var i = t.return;
		try {
			if (Ec(e, i, t, n, Q)) {
				rd = 1, xc(e, Fi(n, e.current)), Z = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw Z = i, t;
			rd = 1, xc(e, Fi(n, e.current)), Z = null;
			return;
		}
		t.flags & 32768 ? (q || r === 1 ? e = !0 : ed || Q & 536870912 ? e = !1 : ($u = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = wo.current, r !== null && r.tag === 13 && (r.flags |= 16384))), $d(t, e)) : Qd(t);
	}
	function Qd(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				$d(t, $u);
				return;
			}
			e = t.return;
			var n = ml(t.alternate, t, nd);
			if (n !== null) {
				Z = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				Z = t;
				return;
			}
			Z = t = e;
		} while (t !== null);
		rd === 0 && (rd = 5);
	}
	function $d(e, t) {
		do {
			var n = hl(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, Z = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				Z = e;
				return;
			}
			Z = e = n;
		} while (e !== null);
		rd = 6, Z = null;
	}
	function ef(e, t, n, r, a, o, s, c, l, u, d, f) {
		e.cancelPendingCommit = null;
		do
			lf();
		while (_d !== 0);
		if (X & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			e === Xu && (Z = Xu = null, Q = 0), yd = t, vd = e, bd = n, Sd = a, Cd = r, tf(e, t, n, s, c, l, f);
		}
	}
	function tf(e, t, n, r, i, a, o) {
		var s = t.lanes | t.childLanes;
		if (xd = s, s |= gi, dt(e, n, s, r, i, a), Td = null, (n & 335544064) === n ? (Ed = ka(e), r = 10262) : (Ed = null, r = 10256), (t.subtreeFlags & r) !== 0 || (t.flags & r) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, vf(We, function() {
			return uf(), null;
		})) : (e.callbackNode = null, e.callbackPriority = 0), Fl = !1, r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
			r = L.T, L.T = null, i = R.p, R.p = 2, a = X, X |= 4;
			try {
				lu(e, t, n);
			} finally {
				X = a, R.p = i, L.T = r;
			}
		}
		_d = 1, Fl ? wd = Mp(o, e.containerInfo, Ed, af, of, rf, sf, uf, nf, null, null) : (af(), of(), sf());
	}
	function nf(e) {
		if (_d !== 0) {
			var t = vd.onRecoverableError;
			t(e, { componentStack: null });
		}
	}
	function rf() {
		_d === 3 && (_d = 0, Au(yd, vd), _d = 4);
	}
	function af() {
		if (_d === 1) {
			_d = 0;
			var e = vd, t = yd, n = bd, r = !!(t.flags & 13878);
			if (t.subtreeFlags & 13878 || r) {
				r = L.T, L.T = null;
				var i = R.p;
				R.p = 2;
				var a = X;
				X |= 4;
				try {
					ou = su = !1, Eu(t, e, n), n = cp;
					var o = Br(e.containerInfo), s = n.focusedElem, c = n.selectionRange;
					if (o !== s && s && s.ownerDocument && zr(s.ownerDocument.documentElement, s)) {
						if (c !== null && Vr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = Rr(s, h), v = Rr(s, g);
									if (_ && v && (p.rangeCount !== 1 || p.anchorNode !== _.node || p.anchorOffset !== _.offset || p.focusNode !== v.node || p.focusOffset !== v.offset)) {
										var y = d.createRange();
										y.setStart(_.node, _.offset), p.removeAllRanges(), h > g ? (p.addRange(y), p.extend(v.node, v.offset)) : (y.setEnd(v.node, v.offset), p.addRange(y));
									}
								}
							}
						}
						for (d = [], p = s; p = p.parentNode;) p.nodeType === 1 && d.push({
							element: p,
							left: p.scrollLeft,
							top: p.scrollTop
						});
						for (typeof s.focus == "function" && s.focus(), s = 0; s < d.length; s++) {
							var b = d[s];
							b.element.scrollLeft = b.left, b.element.scrollTop = b.top;
						}
					}
					gh = !!sp, cp = sp = null;
				} finally {
					X = a, R.p = i, L.T = r;
				}
			}
			e.current = t, _d = 2;
		}
	}
	function of() {
		if (_d === 2) {
			_d = 0;
			var e = vd, t = yd, n = !!(t.flags & 8772);
			if (t.subtreeFlags & 8772 || n) {
				n = L.T, L.T = null;
				var r = R.p;
				R.p = 2;
				var i = X;
				X |= 4;
				try {
					du(e, t.alternate, t);
				} finally {
					X = i, R.p = r, L.T = n;
				}
			}
			_d = 3;
		}
	}
	function sf() {
		if (_d === 4 || _d === 3) {
			_d = 0;
			var e = wd;
			wd = null, ze();
			var t = vd, n = yd, r = bd, i = Cd, a = (r & 335544064) === r ? 10262 : 10256;
			if ((n.subtreeFlags & a) !== 0 || (n.flags & a) !== 0 ? _d = 5 : (_d = 0, yd = vd = null, cf(t, t.pendingLanes)), a = t.pendingLanes, a === 0 && (gd = null), gt(r), n = n.stateNode, z && typeof z.onCommitFiberRoot == "function") try {
				z.onCommitFiberRoot(Ye, n, void 0, (n.current.flags & 128) == 128);
			} catch {}
			if (i !== null) {
				n = L.T, a = R.p, R.p = 2, L.T = null;
				try {
					for (var o = t.onRecoverableError, s = 0; s < i.length; s++) {
						var c = i[s];
						o(c.value, { componentStack: c.stack });
					}
				} finally {
					L.T = n, R.p = a;
				}
			}
			if (i = Td, o = Ed, Ed = null, i !== null && (Td = null, o === null && (o = []), e !== null)) for (c = 0; c < i.length; c++) n = (0, i[c])(o), n !== void 0 && e.finished.finally(n);
			bd & 3 && lf(), Tf(t), a = t.pendingLanes, r & 261930 && a & 42 ? t === Od ? Dd++ : (Dd = 0, Od = t) : (Dd = 0, Od = null), Ef(0, !1);
		}
	}
	function cf(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Ea(t)));
	}
	function lf() {
		return wd !== null && (wd.skipTransition(), wd = null), af(), of(), sf(), uf();
	}
	function uf() {
		if (_d !== 5) return !1;
		var e = vd, t = xd;
		xd = 0;
		var n = gt(bd), r = L.T, a = R.p;
		try {
			R.p = 32 > n ? 32 : n, L.T = null, n = Sd, Sd = null;
			var o = vd, s = bd;
			if (_d = 0, yd = vd = null, bd = 0, X & 6) throw Error(i(331));
			var c = X;
			if (X |= 4, Gu(o.current), Lu(o, o.current, s, n), X = c, Ef(0, !1), z && typeof z.onPostCommitFiberRoot == "function") try {
				z.onPostCommitFiberRoot(Ye, o);
			} catch {}
			return !0;
		} finally {
			R.p = a, L.T = r, cf(e, t);
		}
	}
	function df(e, t, n) {
		t = Fi(n, t), t = Cc(e.stateNode, t, 2), e = uo(e, t, 2), e !== null && (ut(e, 2), Tf(e));
	}
	function ff(e, t, n) {
		if (e.tag === 3) df(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				df(t, e, n);
				break;
			}
			if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (gd === null || !gd.has(r))) {
					e = Fi(n, e), n = wc(2), r = uo(t, n, 2), r !== null && (Tc(n, r, t, e), ut(r, 2), Tf(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function pf(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new Yu();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (td = !0, i.add(n), e = mf.bind(null, e, t, n), t.then(e, e));
	}
	function mf(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, Xu === e && (Q & n) === n && (rd === 4 || rd === 3 && (Q & 62914560) === Q && 300 > Be() - fd ? X & 2 ? od |= n : zd(e, 0) : od |= n, cd === Q && (cd = 0)), Tf(e);
	}
	function hf(e, t) {
		t === 0 && (t = ct()), e = bi(e, t), e !== null && (ut(e, t), Tf(e));
	}
	function gf(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), hf(e, n);
	}
	function _f(e, t) {
		var n = 0;
		switch (e.tag) {
			case 31:
			case 13:
				var r = e.stateNode, a = e.memoizedState;
				a !== null && (n = a.retryLane);
				break;
			case 19:
				r = e.stateNode;
				break;
			case 22:
				r = e.stateNode._retryCache;
				break;
			default: throw Error(i(314));
		}
		r !== null && r.delete(t), hf(e, n);
	}
	function vf(e, t) {
		return Ie(e, t);
	}
	var yf = null, bf = null, xf = !1, Sf = !1, Cf = !1, wf = 0;
	function Tf(e) {
		e !== bf && e.next === null && (bf === null ? yf = bf = e : bf = bf.next = e), Sf = !0, xf || (xf = !0, Mf());
	}
	function Ef(e, t) {
		if (!Cf && Sf) {
			Cf = !0;
			do
				for (var n = !1, r = yf; r !== null;) {
					if (!t) {
						if (e !== 0) {
							var i = r.pendingLanes;
							if (i === 0) var a = 0;
							else {
								var o = r.suspendedLanes, s = r.pingedLanes;
								a = (1 << 31 - B(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
							}
							a !== 0 && (n = !0, jf(r, a));
						} else a = Q, a = it(r, r === Xu ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || at(r, a) || (n = !0, jf(r, a));
					}
					r = r.next;
				}
			while (n);
			Cf = !1;
		}
	}
	function Df() {
		Of();
	}
	function Of() {
		Sf = xf = !1;
		var e = 0;
		wf !== 0 && hp() && (e = wf);
		for (var t = Be(), n = null, r = yf; r !== null;) {
			var i = r.next, a = kf(r, t);
			a === 0 ? (r.next = null, n === null ? yf = i : n.next = i, i === null && (bf = n)) : (n = r, (e !== 0 || a & 3) && (Sf = !0)), r = i;
		}
		_d !== 0 && _d !== 5 || Ef(e, !1), wf !== 0 && (wf = 0);
	}
	function kf(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - B(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = st(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = Xu, n = Q, n = it(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (Zu === 2 || Zu === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && Le(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || at(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && Le(r), gt(n)) {
				case 2:
				case 8:
					n = Ue;
					break;
				case 32:
					n = We;
					break;
				case 268435456:
					n = Ke;
					break;
				default: n = We;
			}
			return r = Af.bind(null, e), n = Ie(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && Le(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function Af(e, t) {
		if (_d !== 0 && _d !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (lf() && e.callbackNode !== n) return null;
		var r = Q;
		return r = it(e, e === Xu ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (Nd(e, r, t), kf(e, Be()), e.callbackNode != null && e.callbackNode === n ? Af.bind(null, e) : null);
	}
	function jf(e, t) {
		if (lf()) return null;
		Nd(e, t, !0);
	}
	function Mf() {
		bp(function() {
			X & 6 ? Ie(He, Df) : Of();
		});
	}
	function Nf() {
		if (wf === 0) {
			var e = Ma;
			e === 0 && (e = et, et <<= 1, !(et & 261888) && (et = 256)), wf = e;
		}
		return wf;
	}
	function Pf(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : un(e);
	}
	function Ff(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = Pf((i[xt] || null).action), o = r.submitter;
			o && (t = (t = o[xt] || null) ? Pf(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new Mn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (wf !== 0) {
								var e = new FormData(i, o);
								Ys(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = new FormData(i, o), Ys(n, {
							pending: !0,
							data: e,
							method: i.method,
							action: a
						}, a, e));
					},
					currentTarget: i
				}]
			});
		}
	}
	for (var If = 0; If < si.length; If++) {
		var Lf = si[If];
		ci(Lf.toLowerCase(), "on" + (Lf[0].toUpperCase() + Lf.slice(1)));
	}
	ci($r, "onAnimationEnd"), ci(ei, "onAnimationIteration"), ci(ti, "onAnimationStart"), ci("dblclick", "onDoubleClick"), ci("focusin", "onFocus"), ci("focusout", "onBlur"), ci(ni, "onTransitionRun"), ci(ri, "onTransitionStart"), ci(ii, "onTransitionCancel"), ci(ai, "onTransitionEnd"), zt("onMouseEnter", ["mouseout", "mouseover"]), zt("onMouseLeave", ["mouseout", "mouseover"]), zt("onPointerEnter", ["pointerout", "pointerover"]), zt("onPointerLeave", ["pointerout", "pointerover"]), Rt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Rt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Rt("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), Rt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Rt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Rt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var Rf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), zf = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Rf));
	function Bf(e, t) {
		t = !!(t & 4);
		for (var n = 0; n < e.length; n++) {
			var r = e[n], i = r.event;
			r = r.listeners;
			a: {
				var a = void 0;
				if (t) for (var o = r.length - 1; 0 <= o; o--) {
					var s = r[o], c = s.instance, l = s.currentTarget;
					if (s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						pi(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						pi(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function $(e, t) {
		var n = t[Ct];
		n === void 0 && (n = t[Ct] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (Wf(t, e, 2, !1), n.add(r));
	}
	function Vf(e, t, n) {
		var r = 0;
		t && (r |= 4), Wf(n, e, r, t);
	}
	var Hf = "_reactListening" + Math.random().toString(36).slice(2);
	function Uf(e) {
		if (!e[Hf]) {
			e[Hf] = !0, It.forEach(function(t) {
				t !== "selectionchange" && (zf.has(t) || Vf(t, !1, e), Vf(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[Hf] || (t[Hf] = !0, Vf("selectionchange", !1, t));
		}
	}
	function Wf(e, t, n, r) {
		switch (Ch(t)) {
			case 2:
				var i = _h;
				break;
			case 8:
				i = vh;
				break;
			default: i = yh;
		}
		n = i.bind(null, t, n, e), i = void 0, !xn || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function Gf(e, t, n, r, i) {
		var a = r;
		if (!(t & 1) && !(t & 2) && r !== null) a: for (;;) {
			if (r === null) return;
			var s = r.tag;
			if (s === 3 || s === 4) {
				var c = r.stateNode.containerInfo;
				if (c === i) break;
				if (s === 4) for (s = r.return; s !== null;) {
					var l = s.tag;
					if ((l === 3 || l === 4) && s.stateNode.containerInfo === i) return;
					s = s.return;
				}
				for (; c !== null;) {
					if (s = At(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		vn(function() {
			var r = a, i = pn(n), s = [];
			a: {
				var c = oi.get(e);
				if (c !== void 0) {
					var l = Mn, u = e;
					switch (e) {
						case "keypress": if (Dn(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = Xn;
							break;
						case "focusin":
							u = "focus", l = Vn;
							break;
						case "focusout":
							u = "blur", l = Vn;
							break;
						case "beforeblur":
						case "afterblur":
							l = Vn;
							break;
						case "click": if (n.button === 2) break a;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							l = zn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = Bn;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = $n;
							break;
						case $r:
						case ei:
						case ti:
							l = Hn;
							break;
						case ai:
							l = er;
							break;
						case "scroll":
						case "scrollend":
							l = Pn;
							break;
						case "wheel":
							l = tr;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = Un;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = Zn;
							break;
						case "submit":
							l = Qn;
							break;
						case "toggle":
						case "beforetoggle": l = nr;
					}
					var d = !!(t & 4), f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = yn(m, p), g != null && d.push(Kf(m, g, h))), f) break;
						m = m.return;
					}
					0 < d.length && (c = new l(c, u, null, n, i), s.push({
						event: c,
						listeners: d
					}));
				}
			}
			if (!(t & 7)) {
				a: {
					if (l = e === "mouseover" || e === "pointerover", c = e === "mouseout" || e === "pointerout", l && n !== fn && (u = n.relatedTarget || n.fromElement) && (At(u) || u[St])) break a;
					(c || l) && (u = i.window === i ? i : (l = i.ownerDocument) ? l.defaultView || l.parentWindow : window, c ? (l = n.relatedTarget || n.toElement, c = r, l = l ? At(l) : null, l !== null && (f = o(l), d = l.tag, l !== f || d !== 5 && d !== 27 && d !== 6) && (l = null)) : (c = null, l = r), c !== l && (d = zn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = Zn, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = c == null ? u : Mt(c), h = l == null ? u : Mt(l), u = new d(g, m + "leave", c, n, i), u.target = f, u.relatedTarget = h, g = null, At(i) === r && (d = new d(p, m + "enter", l, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, d = c && l ? E(c, l, Jf) : null, c !== null && Yf(s, u, c, d, !1), l !== null && f !== null && Yf(s, f, l, d, !0)));
				}
				a: {
					if (c = r ? Mt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var _ = Sr;
					else if (gr(c)) {
						if (Cr) _ = Mr;
						else {
							_ = Ar;
							var v = kr;
						}
					} else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && sn(r.elementType) && (_ = Sr) : _ = jr;
					if (_ &&= _(e, r)) {
						_r(s, _, n, i);
						break a;
					}
					v && v(e, c, r);
				}
				switch (v = r ? Mt(r) : window, e) {
					case "focusin":
						(gr(v) || v.contentEditable === "true") && (Ur = v, Wr = r, Gr = null);
						break;
					case "focusout":
						Gr = Wr = Ur = null;
						break;
					case "mousedown":
						Kr = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						Kr = !1, qr(s, n, i);
						break;
					case "selectionchange": if (Hr) break;
					case "keydown":
					case "keyup": qr(s, n, i);
				}
				var y;
				if (ir) b: {
					switch (e) {
						case "compositionstart":
							var b = "onCompositionStart";
							break b;
						case "compositionend":
							b = "onCompositionEnd";
							break b;
						case "compositionupdate":
							b = "onCompositionUpdate";
							break b;
					}
					b = void 0;
				}
				else fr ? ur(e, n) && (b = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (b = "onCompositionStart");
				b && (sr && n.locale !== "ko" && (fr || b !== "onCompositionStart" ? b === "onCompositionEnd" && fr && (y = En()) : (Cn = i, wn = "value" in Cn ? Cn.value : Cn.textContent, fr = !0)), v = qf(r, b), 0 < v.length && (b = new Wn(b, e, null, n, i), s.push({
					event: b,
					listeners: v
				}), y ? b.data = y : (y = dr(n), y !== null && (b.data = y)))), (y = or ? pr(e, n) : mr(e, n)) && (b = qf(r, "onBeforeInput"), 0 < b.length && (v = new Wn("onBeforeInput", "beforeinput", null, n, i), s.push({
					event: v,
					listeners: b
				}), v.data = y)), Ff(s, e, r, n, i);
			}
			Bf(s, t);
		});
	}
	function Kf(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function qf(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = yn(e, n), i != null && r.unshift(Kf(e, i, a)), i = yn(e, t), i != null && r.push(Kf(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function Jf(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function Yf(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = yn(n, a), l != null && o.unshift(Kf(n, l, c))) : i || (l = yn(n, a), l != null && o.push(Kf(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var Xf = /\r\n?/g, Zf = /\u0000|\uFFFD/g;
	function Qf(e) {
		return (typeof e == "string" ? e : "" + e).replace(Xf, "\n").replace(Zf, "");
	}
	function $f(e, t) {
		return t = Qf(t), Qf(e) === t;
	}
	function ep(e, t, n, r, a, o) {
		switch (n) {
			case "children":
				if (typeof r == "string") t === "body" || t === "textarea" && r === "" || nn(e, r);
				else if (typeof r == "number" || typeof r == "bigint") t !== "body" && nn(e, "" + r);
				else return;
				break;
			case "className":
				Wt(e, "class", r);
				break;
			case "tabIndex":
				Wt(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				Wt(e, n, r);
				break;
			case "style":
				on(e, r, o);
				return;
			case "data": if (t !== "object") {
				Wt(e, "data", r);
				break;
			}
			case "src":
			case "href":
				if (r === "" && (t !== "a" || n !== "href") || r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = un(r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				}
				if (typeof o == "function" && (n === "formAction" ? (t !== "input" && ep(e, t, "name", a.name, a, null), ep(e, t, "formEncType", a.formEncType, a, null), ep(e, t, "formMethod", a.formMethod, a, null), ep(e, t, "formTarget", a.formTarget, a, null)) : (ep(e, t, "encType", a.encType, a, null), ep(e, t, "method", a.method, a, null), ep(e, t, "target", a.target, a, null))), r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = un(r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = dn);
				return;
			case "onScroll":
				r != null && $("scroll", e);
				return;
			case "onScrollEnd":
				r != null && $("scrollend", e);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "multiple":
				e.multiple = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "muted":
				e.muted = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref": break;
			case "autoFocus": break;
			case "xlinkHref":
				if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
					e.removeAttribute("xlink:href");
					break;
				}
				n = un(r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "credentialless":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				r && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
				break;
			case "capture":
			case "download":
				!0 === r ? e.setAttribute(n, "") : !1 !== r && r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "rowSpan":
			case "start":
				r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(n) : e.setAttribute(n, r);
				break;
			case "popover":
				$("beforetoggle", e), $("toggle", e), Ut(e, "popover", r);
				break;
			case "xlinkActuate":
				W(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				W(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				W(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				W(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				W(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				W(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				W(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				W(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				W(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				Ut(e, "is", r);
				break;
			case "innerText":
			case "textContent": return;
			default: if (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") n = cn.get(n) || n, Ut(e, n, r);
			else return;
		}
		H = !0;
	}
	function tp(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				on(e, r, o);
				return;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						o?.__html !== n && (e.innerHTML = n);
					}
				}
				break;
			case "children":
				if (typeof r == "string") nn(e, r);
				else if (typeof r == "number" || typeof r == "bigint") nn(e, "" + r);
				else return;
				break;
			case "onScroll":
				r != null && $("scroll", e);
				return;
			case "onScrollEnd":
				r != null && $("scrollend", e);
				return;
			case "onClick":
				r != null && (e.onclick = dn);
				return;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": return;
			case "innerText":
			case "textContent": return;
			default:
				if (!Lt.hasOwnProperty(n)) a: {
					if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), o = n.slice(2, a ? n.length - 7 : void 0), t = e[xt] || null, t = t == null ? null : t[n], typeof t == "function" && e.removeEventListener(o, t, a), typeof r == "function")) {
						typeof t != "function" && t !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(o, r, a);
						break a;
					}
					H = !0, n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : Ut(e, n, r);
				}
				return;
		}
		H = !0;
	}
	function np(e, t, n) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "img":
				$("error", e), $("load", e);
				var r = !1, a = !1, o;
				for (o in n) if (n.hasOwnProperty(o)) {
					var s = n[o];
					if (s != null) switch (o) {
						case "src":
							r = !0;
							break;
						case "srcSet":
							a = !0;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(i(137, t));
						default: ep(e, t, o, s, n, null);
					}
				}
				a && ep(e, t, "srcSet", n.srcSet, n, null), r && ep(e, t, "src", n.src, n, null);
				return;
			case "input":
				$("invalid", e);
				var c = o = s = a = null, l = null, u = null;
				for (r in n) if (n.hasOwnProperty(r)) {
					var d = n[r];
					if (d != null) switch (r) {
						case "name":
							a = d;
							break;
						case "type":
							s = d;
							break;
						case "checked":
							l = d;
							break;
						case "defaultChecked":
							u = d;
							break;
						case "value":
							o = d;
							break;
						case "defaultValue":
							c = d;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (d != null) throw Error(i(137, t));
							break;
						default: ep(e, t, r, d, n, null);
					}
				}
				Zt(e, o, c, l, u, s, a, !1);
				return;
			case "select":
				for (a in $("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(a) && (c = n[a], c != null)) switch (a) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: ep(e, t, a, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && $t(e, !!r, n, !0) : $t(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in $("invalid", e), o = a = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
					case "value":
						r = c;
						break;
					case "defaultValue":
						a = c;
						break;
					case "children":
						o = c;
						break;
					case "dangerouslySetInnerHTML":
						if (c != null) throw Error(i(91));
						break;
					default: ep(e, t, s, c, n, null);
				}
				tn(e, r, a, o);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: ep(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				$("beforetoggle", e), $("toggle", e), $("cancel", e), $("close", e);
				break;
			case "iframe":
			case "object":
				$("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < Rf.length; r++) $(Rf[r], e);
				break;
			case "image":
				$("error", e), $("load", e);
				break;
			case "details":
				$("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": $("error", e), $("load", e);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (u in n) if (n.hasOwnProperty(u) && (r = n[u], r != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(i(137, t));
					default: ep(e, t, u, r, n, null);
				}
				return;
			default: if (sn(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && tp(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && ep(e, t, c, r, n, null));
	}
	var rp = {};
	function ip(e, t, n, r) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "input":
				var a = null, o = null, s = null, c = null, l = null, u = null, d = null;
				for (m in n) {
					var f = n[m];
					if (n.hasOwnProperty(m) && f != null) switch (m) {
						case "checked": break;
						case "value": break;
						case "defaultValue": l = f;
						default: r.hasOwnProperty(m) || ep(e, t, m, null, r, f);
					}
				}
				for (var p in r) {
					var m = r[p];
					if (f = n[p], r.hasOwnProperty(p) && (m != null || f != null)) switch (p) {
						case "type":
							m !== f && (H = !0), o = m;
							break;
						case "name":
							m !== f && (H = !0), a = m;
							break;
						case "checked":
							m !== f && (H = !0), u = m;
							break;
						case "defaultChecked":
							m !== f && (H = !0), d = m;
							break;
						case "value":
							m !== f && (H = !0), s = m;
							break;
						case "defaultValue":
							m !== f && (H = !0), c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(i(137, t));
							break;
						default: m !== f && ep(e, t, p, m, r, f);
					}
				}
				K(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || ep(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						o !== l && (H = !0), p = o;
						break;
					case "defaultValue":
						o !== l && (H = !0), c = o;
						break;
					case "multiple": o !== l && (H = !0), s = o;
					default: o !== l && ep(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? $t(e, !!n, n ? [] : "", !1) : $t(e, !!n, t, !0)) : $t(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: ep(e, t, c, null, r, a);
				}
				for (s in r) if (a = r[s], o = n[s], r.hasOwnProperty(s) && (a != null || o != null)) switch (s) {
					case "value":
						a !== o && (H = !0), p = a;
						break;
					case "defaultValue":
						a !== o && (H = !0), m = a;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (a != null) throw Error(i(91));
						break;
					default: a !== o && ep(e, t, s, a, r, o);
				}
				en(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: ep(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						p !== m && (H = !0), e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: ep(e, t, l, p, r, m);
				}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && ep(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(i(137, t));
						break;
					default: ep(e, t, u, p, r, m);
				}
				return;
			default: if (sn(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && tp(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || tp(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && ep(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || ep(e, t, f, p, r, m);
	}
	function ap(e) {
		switch (e) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link": return !0;
			default: return !1;
		}
	}
	function op() {
		if (typeof performance.getEntriesByType == "function") {
			for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
				var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
				if (a && s && ap(o)) {
					for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
						var c = n[r], l = c.startTime;
						if (l > s) break;
						var u = c.transferSize, d = c.initiatorType;
						u && ap(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
					}
					if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
	}
	var sp = null, cp = null;
	function lp(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function up(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function dp(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function fp(e, t, n, r) {
		return n = lp(n).createElement(e), n[bt] = r, n[xt] = t, np(n, e, t), Pt(n), n;
	}
	function pp(e, t) {
		return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
	}
	var mp = null;
	function hp() {
		var e = window.event;
		return e && e.type === "popstate" ? e !== mp && (mp = e, !0) : (mp = null, !1);
	}
	var gp = typeof setTimeout == "function" ? setTimeout : void 0, _p = typeof clearTimeout == "function" ? clearTimeout : void 0, vp = typeof Promise == "function" ? Promise : void 0, yp = typeof requestAnimationFrame == "function" ? requestAnimationFrame : gp, bp = typeof queueMicrotask == "function" ? queueMicrotask : vp === void 0 ? gp : function(e) {
		return vp.resolve(null).then(e).catch(xp);
	};
	function xp(e) {
		setTimeout(function() {
			throw e;
		});
	}
	function Sp(e) {
		return e === "head";
	}
	function Cp(e, t) {
		var n = t, r = 0;
		do {
			var i = n.nextSibling;
			if (e.removeChild(n), i && i.nodeType === 8) {
				if (n = i.data, n === "/$" || n === "/&") {
					if (r === 0) {
						e.removeChild(i), Hh(t);
						return;
					}
					r--;
				} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") r++;
				else if (n === "html") _m(e.ownerDocument.documentElement);
				else if (n === "head") {
					n = e.ownerDocument.head, _m(n);
					for (var a = n.firstChild; a;) {
						var o = a.nextSibling, s = a.nodeName;
						a[Dt] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
					}
				} else n === "body" && _m(e.ownerDocument.body);
			}
			n = i;
		} while (n);
		Hh(t);
	}
	function wp(e, t) {
		var n = e;
		e = 0;
		do {
			var r = n.nextSibling;
			if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), r && r.nodeType === 8) {
				if (n = r.data, n === "/$") {
					if (e === 0) break;
					e--;
				} else n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
			}
			n = r;
		} while (n);
	}
	function Tp(e, t, n) {
		if (t = CSS.escape(t) === t ? t : "r-" + btoa(t).replace(/=/g, ""), e.style.viewTransitionName = t, n != null && (e.style.viewTransitionClass = n), n = getComputedStyle(e), n.display === "inline") {
			if (t = e.getClientRects(), t.length === 1) var r = 1;
			else for (var i = r = 0; i < t.length; i++) {
				var a = t[i];
				0 < a.width && 0 < a.height && r++;
			}
			r === 1 && (e = e.style, e.display = t.length === 1 ? "inline-block" : "block", e.marginTop = "-" + n.paddingTop, e.marginBottom = "-" + n.paddingBottom);
		}
	}
	function Ep(e, t) {
		e = e.style, t = t.style;
		var n = t == null ? null : t.hasOwnProperty("viewTransitionName") ? t.viewTransitionName : t.hasOwnProperty("view-transition-name") ? t["view-transition-name"] : null;
		e.viewTransitionName = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), n = t == null ? null : t.hasOwnProperty("viewTransitionClass") ? t.viewTransitionClass : t.hasOwnProperty("view-transition-class") ? t["view-transition-class"] : null, e.viewTransitionClass = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), e.display === "inline-block" && (t == null ? e.display = e.margin = "" : (n = t.display, e.display = n == null || typeof n == "boolean" ? "" : n, n = t.margin, n == null ? (n = t.hasOwnProperty("marginTop") ? t.marginTop : t["margin-top"], e.marginTop = n == null || typeof n == "boolean" ? "" : n, t = t.hasOwnProperty("marginBottom") ? t.marginBottom : t["margin-bottom"], e.marginBottom = t == null || typeof t == "boolean" ? "" : t) : e.margin = n));
	}
	function Dp(e, t, n) {
		return n = n.ownerDocument.defaultView, {
			rect: e,
			abs: t.position === "absolute" || t.position === "fixed",
			clip: t.clipPath !== "none" || t.overflow !== "visible" || t.filter !== "none" || t.mask !== "none" || t.mask !== "none" || t.borderRadius !== "0px",
			view: 0 <= e.bottom && 0 <= e.right && e.top <= n.innerHeight && e.left <= n.innerWidth
		};
	}
	function Op(e) {
		return Dp(e.getBoundingClientRect(), getComputedStyle(e), e);
	}
	function kp(e) {
		var t = e.getBoundingClientRect();
		t = new DOMRect(t.x + 2e4, t.y + 2e4, t.width, t.height);
		var n = getComputedStyle(e);
		return Dp(t, n, e);
	}
	function Ap(e) {
		return e.documentElement.clientHeight;
	}
	function jp(e) {
		this.addEventListener("load", e), this.addEventListener("error", e);
	}
	function Mp(e, t, n, r, i, a, o, s, c) {
		var l = t.nodeType === 9 ? t : t.ownerDocument;
		try {
			var u = l.startViewTransition({
				update: function() {
					var t = l.defaultView, n = t.navigation && t.navigation.transition, o = l.fonts.status;
					r();
					var s = [];
					if (o === "loaded" && (Ap(l), l.fonts.status === "loading" && s.push(l.fonts.ready)), o = s.length, e !== null) for (var c = e.suspenseyImages, u = 0, d = 0; d < c.length; d++) {
						var f = c[d];
						if (!f.complete) {
							var p = f.getBoundingClientRect();
							if (0 < p.bottom && 0 < p.right && p.top < t.innerHeight && p.left < t.innerWidth) {
								if (u += Xm(f), u > $m) {
									s.length = o;
									break;
								}
								f = new Promise(jp.bind(f)), s.push(f);
							}
						}
					}
					if (0 < s.length) return t = Promise.race([Promise.all(s), new Promise(function(e) {
						return setTimeout(e, 500);
					})]).then(i, i), (n ? Promise.allSettled([n.finished, t]) : t).then(a, a);
					if (i(), n) return n.finished.then(a, a);
					a();
				},
				types: n
			});
			l.__reactViewTransition = u;
			var d = [];
			return u.ready.then(function() {
				for (var e = l.documentElement.getAnimations({ subtree: !0 }), t = 0; t < e.length; t++) {
					var n = e[t], r = n.effect, i = r.pseudoElement;
					if (i != null && i.startsWith("::view-transition")) {
						d.push(n), n = r.getKeyframes();
						for (var a = i = void 0, s = !0, c = 0; c < n.length; c++) {
							var u = n[c], f = u.width;
							if (i === void 0) i = f;
							else if (i !== f) {
								s = !1;
								break;
							}
							if (f = u.height, a === void 0) a = f;
							else if (a !== f) {
								s = !1;
								break;
							}
							delete u.width, delete u.height, u.transform === "none" && delete u.transform;
						}
						s && i !== void 0 && a !== void 0 && (r.setKeyframes(n), s = getComputedStyle(r.target, r.pseudoElement), s.width !== i || s.height !== a) && (s = n[0], s.width = i, s.height = a, s = n[n.length - 1], s.width = i, s.height = a, r.setKeyframes(n));
					}
				}
				o();
			}, function(e) {
				l.__reactViewTransition === u && (l.__reactViewTransition = null);
				try {
					if (typeof e == "object" && e) switch (e.name) {
						case "InvalidStateError": (e.message === "View transition was skipped because document visibility state is hidden." || e.message === "Skipping view transition because document visibility state has become hidden." || e.message === "Skipping view transition because viewport size changed." || e.message === "Transition was aborted because of invalid state") && (e = null);
					}
					e !== null && c(e);
				} finally {
					r(), i(), o();
				}
			}), u.finished.finally(function() {
				for (var e = 0; e < d.length; e++) d[e].cancel();
				l.__reactViewTransition === u && (l.__reactViewTransition = null), s();
			}), u;
		} catch {
			return r(), i(), o(), null;
		}
	}
	function Np(e, t) {
		this._scope = document.documentElement, this._selector = "::view-transition-" + e + "(" + t + ")";
	}
	Np.prototype.animate = function(e, t) {
		return t = typeof t == "number" ? { duration: t } : D({}, t), t.pseudoElement = this._selector, this._scope.animate(e, t);
	}, Np.prototype.getAnimations = function() {
		for (var e = this._scope, t = this._selector, n = e.getAnimations({ subtree: !0 }), r = [], i = 0; i < n.length; i++) {
			var a = n[i].effect;
			a !== null && a.target === e && a.pseudoElement === t && r.push(n[i]);
		}
		return r;
	}, Np.prototype.getComputedStyle = function() {
		return getComputedStyle(this._scope, this._selector);
	};
	function Pp(e) {
		return {
			name: e,
			group: new Np("group", e),
			imagePair: new Np("image-pair", e),
			old: new Np("old", e),
			new: new Np("new", e)
		};
	}
	function Fp(e) {
		this._fragmentFiber = e, this._observers = this._eventListeners = null;
	}
	Fp.prototype.addEventListener = function(e, t, n) {
		var r = null, i = null;
		if (!(n != null && typeof n != "boolean" && (r = n.signal || null, r !== null && r.aborted))) {
			this._eventListeners === null && (this._eventListeners = []);
			var a = this._eventListeners;
			if (Bp(a, e, t, n) === -1) {
				var o = this, s = t;
				n != null && typeof n != "boolean" && !0 === n.once && (s = function(r) {
					o.removeEventListener(e, t, n), typeof t == "function" ? t.call(this, r) : t.handleEvent(r);
				}), r !== null && (i = o.removeEventListener.bind(o, e, t, n), r.addEventListener("abort", i, { once: !0 }), i = r.removeEventListener.bind(r, "abort", i)), r = Rp(n), a.push({
					type: e,
					listener: t,
					optionsOrUseCapture: n,
					attachedListener: s,
					cleanup: i
				}), h(this._fragmentFiber.child, !1, Ip, e, s, r);
			}
			this._eventListeners = a;
		}
	};
	function Ip(e, t, n, r) {
		return b(e).addEventListener(t, n, r), !1;
	}
	Fp.prototype.removeEventListener = function(e, t, n) {
		var r = this._eventListeners;
		if (r !== null && (t = Bp(r, e, t, n), t !== -1)) {
			var i = r[t];
			n = i.attachedListener;
			var a = i.cleanup;
			i = Rp(i.optionsOrUseCapture), h(this._fragmentFiber.child, !1, Lp, e, n, i), r.splice(t, 1), a !== null && a();
		}
	};
	function Lp(e, t, n, r) {
		return b(e).removeEventListener(t, n, r), !1;
	}
	function Rp(e) {
		return e != null && typeof e != "boolean" && (!0 === e.once || e.signal instanceof AbortSignal) ? {
			capture: e.capture,
			passive: e.passive
		} : e;
	}
	function zp(e) {
		return e == null ? "c=0" : typeof e == "boolean" ? "c=" + (e ? "1" : "0") : "c=" + (e.capture ? "1" : "0");
	}
	function Bp(e, t, n, r) {
		if (e.length === 0) return -1;
		r = zp(r);
		for (var i = 0; i < e.length; i++) {
			var a = e[i];
			if (a.type === t && a.listener === n && zp(a.optionsOrUseCapture) === r) return i;
		}
		return -1;
	}
	Fp.prototype.dispatchEvent = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return !0;
		t = b(t);
		var n = this._eventListeners;
		if (n !== null && 0 < n.length || !e.bubbles) {
			var r = t.nodeType === 9 ? t.createComment("") : document.createTextNode("");
			if (n) for (var i = 0; i < n.length; i++) {
				var a = n[i];
				r.addEventListener(a.type, a.attachedListener, Rp(a.optionsOrUseCapture));
			}
			if (t.appendChild(r), e = r.dispatchEvent(e), n) for (i = 0; i < n.length; i++) a = n[i], r.removeEventListener(a.type, a.attachedListener, Rp(a.optionsOrUseCapture));
			return t.removeChild(r), e;
		}
		return t.dispatchEvent(e);
	}, Fp.prototype.focus = function(e) {
		h(this._fragmentFiber.child, !0, Vp, e, void 0, void 0);
	};
	function Vp(e, t) {
		return e.tag !== 6 && (e = b(e), pm(e, t));
	}
	Fp.prototype.focusLast = function(e) {
		var t = [];
		h(this._fragmentFiber.child, !0, Hp, t, void 0, void 0);
		for (var n = t.length - 1; 0 <= n && !Vp(t[n], e); n--);
	};
	function Hp(e, t) {
		return t.push(e), !1;
	}
	Fp.prototype.blur = function() {
		var e = g(this._fragmentFiber);
		e !== null && (e = b(e), e = lp(e).activeElement, e !== null && h(this._fragmentFiber.child, !1, Up, e, void 0, void 0));
	};
	function Up(e, t) {
		return e.tag !== 6 && (e = b(e), e === t || e.contains(t) ? (t.blur(), !0) : !1);
	}
	Fp.prototype.observeUsing = function(e) {
		this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(e), h(this._fragmentFiber.child, !1, Wp, e, void 0, void 0);
	};
	function Wp(e, t) {
		return e.tag === 6 || (e = b(e), t.observe(e)), !1;
	}
	Fp.prototype.unobserveUsing = function(e) {
		var t = this._observers;
		if (t !== null && t.has(e)) {
			t.delete(e), h(this._fragmentFiber.child, !1, Gp, e, void 0, void 0);
			for (var n = t = 0; n < Kp.length; n++) {
				var r = Kp[n];
				r.fragmentInstance === this && r.observer === e ? e.unobserve(r.instance) : Kp[t++] = r;
			}
			Kp.length = t;
		}
	};
	function Gp(e, t) {
		return e.tag === 6 || (e = b(e), t.unobserve(e)), !1;
	}
	var Kp = [], qp = !1;
	function Jp(e, t, n) {
		Kp.push({
			fragmentInstance: e,
			observer: t,
			instance: n
		}), qp || (qp = !0, mm(function() {
			qp = !1;
			var e = Kp;
			Kp = [];
			for (var t = 0; t < e.length; t++) {
				var n = e[t];
				n.observer.unobserve(n.instance);
			}
		}));
	}
	Fp.prototype.getClientRects = function() {
		var e = [];
		return h(this._fragmentFiber.child, !1, Yp, e, void 0, void 0), e;
	};
	function Yp(e, t) {
		if (e.tag === 6) {
			e = e.stateNode;
			var n = e.ownerDocument.createRange();
			n.selectNodeContents(e), t.push.apply(t, n.getClientRects());
		} else e = b(e), t.push.apply(t, e.getClientRects());
		return !1;
	}
	Fp.prototype.getRootNode = function(e) {
		var t = g(this._fragmentFiber);
		return t === null ? this : b(t).getRootNode(e);
	}, Fp.prototype.compareDocumentPosition = function(e) {
		var t = g(this._fragmentFiber);
		if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		var n = [];
		h(this._fragmentFiber.child, !1, Hp, n, void 0, void 0);
		var r = b(t);
		if (n.length === 0) {
			if (n = r, _(this._fragmentFiber)) {
				a: {
					for (t = this._fragmentFiber.return; t !== null;) {
						if (t.tag === 4) {
							t = t.stateNode.containerInfo;
							break a;
						}
						if (t.tag === 3 || t.tag === 5 || t.tag === 27) break;
						t = t.return;
					}
					t = null;
				}
				t != null && (n = t);
			}
			t = this._fragmentFiber;
			var i = r = n.compareDocumentPosition(e);
			return n === e ? i = Node.DOCUMENT_POSITION_CONTAINS : r & Node.DOCUMENT_POSITION_CONTAINED_BY && (n = v(t)[1], n === null ? i = Node.DOCUMENT_POSITION_PRECEDING : (e = b(n).compareDocumentPosition(e), i = e === 0 || e & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), i |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
		}
		t = b(n[0]), i = b(n[n.length - 1]);
		var a = _(this._fragmentFiber) ? t.parentElement : r;
		if (a == null) return Node.DOCUMENT_POSITION_DISCONNECTED;
		r = a.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY, a = a.compareDocumentPosition(i) & Node.DOCUMENT_POSITION_CONTAINED_BY;
		var o = t.compareDocumentPosition(e), s = i.compareDocumentPosition(e), c = o & Node.DOCUMENT_POSITION_CONTAINED_BY || s & Node.DOCUMENT_POSITION_CONTAINED_BY;
		return s = r && a && o & Node.DOCUMENT_POSITION_FOLLOWING && s & Node.DOCUMENT_POSITION_PRECEDING, t = r && t === e || a && i === e || c || s ? Node.DOCUMENT_POSITION_CONTAINED_BY : !r && t === e || !a && i === e ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : o, t & Node.DOCUMENT_POSITION_DISCONNECTED || t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || Xp(t, this._fragmentFiber, n[0], n[n.length - 1], e) ? t : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
	};
	function Xp(e, t, n, r, i) {
		var a = At(i);
		if (e & Node.DOCUMENT_POSITION_CONTAINED_BY) {
			if (n = !!a) a: {
				for (; a !== null;) {
					if (a.tag === 7 && (a === t || a.alternate === t)) {
						n = !0;
						break a;
					}
					a = a.return;
				}
				n = !1;
			}
			return n;
		}
		if (e & Node.DOCUMENT_POSITION_CONTAINS) {
			if (a === null) return a = i.ownerDocument, i === a || i === a.documentElement || i === a.body;
			a: {
				for (a = t, t = g(t); a !== null;) {
					if (!(a.tag !== 5 && a.tag !== 3 && a.tag !== 27 || a !== t && a.alternate !== t)) {
						a = !0;
						break a;
					}
					a = a.return;
				}
				a = !1;
			}
			return a;
		}
		return e & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!a) && !(t = a === n) && (t = E(n, a, T), t === null ? t = !1 : (h(t, !0, C, a, n), a = x, x = null, t = a !== null)), t) : e & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!a) && !(t = a === r) && (t = E(r, a, T), t === null ? t = !1 : (h(t, !0, w, a, r), a = x, S = x = null, t = a !== null)), t) : !1;
	}
	function Zp(e, t) {
		var n = e.ownerDocument.createRange();
		n.selectNodeContents(e), e = n.getBoundingClientRect(), window.scrollTo(window.scrollX + e.left, t ? window.scrollY + e.top : window.scrollY + e.bottom - window.innerHeight);
	}
	Fp.prototype.scrollIntoView = function(e) {
		if (typeof e == "object") throw Error(i(566));
		var t = [];
		h(this._fragmentFiber.child, !1, Hp, t, void 0, void 0);
		var n = !1 !== e;
		if (t.length === 0) {
			var r = v(this._fragmentFiber);
			if (r = n ? r[1] || r[0] || g(this._fragmentFiber) : r[0] || r[1], r === null) return;
			if (r.tag === 6) {
				e = b(r), Zp(e, n);
				return;
			}
			if (r = b(r), r.nodeType !== 9) {
				if (r.nodeType === 11) {
					n = "host" in r ? r.host : null, n !== null && n.scrollIntoView(e);
					return;
				}
				r.scrollIntoView(e);
			}
		}
		for (r = n ? t.length - 1 : 0; r !== (n ? -1 : t.length);) {
			var a = t[r];
			a.tag === 6 ? (a = b(a), Zp(a, n)) : b(a).scrollIntoView(e), r += n ? -1 : 1;
		}
	};
	function Qp(e, t) {
		return e = b(e), $p(e, t), !1;
	}
	function $p(e, t) {
		e.reactFragments ??= /* @__PURE__ */ new Set(), e.reactFragments.add(t);
	}
	function em(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.addEventListener(i.type, i.attachedListener, Rp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			for (var r = 0, i = 0; i < Kp.length; i++) {
				var a = Kp[i];
				(a.fragmentInstance !== t || a.observer !== n || a.instance !== e) && (Kp[r++] = a);
			}
			Kp.length = r, n.observe(e);
		}), $p(e, t));
	}
	function tm(e, t) {
		var n = t._eventListeners;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r];
			e.removeEventListener(i.type, i.attachedListener, Rp(i.optionsOrUseCapture));
		}
		e.nodeType !== 3 && (n = t._observers, n !== null && n.forEach(function(n) {
			typeof n.rootMargin == "string" ? Jp(t, n, e) : n.unobserve(e);
		}), e.reactFragments != null && e.reactFragments.delete(t));
	}
	function nm(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
			var n = t;
			switch (t = t.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					nm(n), kt(n);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(n);
		}
	}
	function rm(e, t, n, r) {
		for (; e.nodeType === 1;) {
			var i = n;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (!r) {
				if (t === "input" && e.type === "hidden") {
					var a = i.name == null ? null : "" + i.name;
					if (i.type === "hidden" && e.getAttribute("name") === a) return e;
				} else return e;
			} else if (!e[Dt]) switch (t) {
				case "meta":
					if (!e.hasAttribute("itemprop")) break;
					return e;
				case "link":
					if (a = e.getAttribute("rel"), a === "stylesheet" && e.hasAttribute("data-precedence") || a !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title)) break;
					return e;
				case "style":
					if (e.hasAttribute("data-precedence")) break;
					return e;
				case "script":
					if (a = e.getAttribute("src"), (a !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && a && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
					return e;
				default: return e;
			}
			if (e = lm(e.nextSibling), e === null) break;
		}
		return null;
	}
	function im(e, t, n) {
		if (t === "") return null;
		for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = lm(e.nextSibling), e === null)) return null;
		return e;
	}
	function am(e, t) {
		for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = lm(e.nextSibling), e === null)) return null;
		return e;
	}
	function om(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function sm(e) {
		return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
	}
	function cm(e, t) {
		var n = e.ownerDocument;
		if (e.data === "$~") e._reactRetry = t;
		else if (e.data !== "$?" || n.readyState !== "loading") t();
		else {
			var r = function() {
				t(), n.removeEventListener("DOMContentLoaded", r);
			};
			n.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
		}
	}
	function lm(e) {
		for (; e != null; e = e.nextSibling) {
			var t = e.nodeType;
			if (t === 1 || t === 3) break;
			if (t === 8) {
				if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F") break;
				if (t === "/$" || t === "/&") return null;
			}
		}
		return e;
	}
	var um = null;
	function dm(e) {
		e = e.nextSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "/$" || n === "/&") {
					if (t === 0) return lm(e.nextSibling);
					t--;
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function fm(e) {
		e = e.previousSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
					if (t === 0) return e;
					t--;
				} else n !== "/$" && n !== "/&" || t++;
			}
			e = e.previousSibling;
		}
		return null;
	}
	function pm(e, t) {
		function n() {
			r = !0;
		}
		if (e.ownerDocument.activeElement === e) return !0;
		var r = !1;
		try {
			e.ownerDocument.addEventListener("focus", n, !0), (e.focus || HTMLElement.prototype.focus).call(e, t);
		} finally {
			e.ownerDocument.removeEventListener("focus", n, !0);
		}
		return r;
	}
	function mm(e) {
		yp(function() {
			yp(function(t) {
				return e(t);
			});
		});
	}
	function hm(e, t, n) {
		switch (t = lp(n), e) {
			case "html":
				if (e = t.documentElement, !e) throw Error(i(452));
				return e;
			case "head":
				if (e = t.head, !e) throw Error(i(453));
				return e;
			case "body":
				if (e = t.body, !e) throw Error(i(454));
				return e;
			default: throw Error(i(451));
		}
	}
	function gm(e, t, n) {
		for (var r in n) {
			var i = n[r];
			n.hasOwnProperty(r) && i != null && ep(e, t, r, null, rp, i);
		}
		n.dangerouslySetInnerHTML != null && (e.textContent = ""), e.onclick === dn && (e.onclick = null), kt(e);
	}
	function _m(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		kt(e);
	}
	var vm = /* @__PURE__ */ new Map(), ym = /* @__PURE__ */ new Set();
	function bm(e) {
		if (typeof e.getRootNode == "function") {
			var t = e.getRootNode();
			if (t.nodeType === 9 || t.nodeType === 11) return t;
		}
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	var xm = R.d;
	R.d = {
		f: Sm,
		r: Cm,
		D: Em,
		C: Dm,
		L: Om,
		m: km,
		X: jm,
		S: Am,
		M: Mm
	};
	function Sm() {
		var e = xm.f(), t = Ld();
		return e || t;
	}
	function Cm(e) {
		var t = jt(e);
		t !== null && t.tag === 5 && t.type === "form" ? Zs(t) : xm.r(e);
	}
	var wm = typeof document > "u" ? null : document;
	function Tm(e, t, n) {
		var r = wm;
		if (r && typeof t == "string" && t) {
			var i = Xt(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), ym.has(i) || (ym.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), np(t, "link", e), Pt(t), r.head.appendChild(t)));
		}
	}
	function Em(e) {
		xm.D(e), Tm("dns-prefetch", e, null);
	}
	function Dm(e, t) {
		xm.C(e, t), Tm("preconnect", e, t);
	}
	function Om(e, t, n) {
		xm.L(e, t, n);
		var r = wm;
		if (r && e && t) {
			var i = "link[rel=\"preload\"][as=\"" + Xt(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + Xt(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + Xt(n.imageSizes) + "\"]")) : i += "[href=\"" + Xt(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = Pm(e);
					break;
				case "script": a = Rm(e);
			}
			if (!(vm.has(a) || (e = D({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), vm.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(Fm(a)) || t === "script" && r.querySelector(zm(a))))) {
				var o = r.createElement("link");
				np(o, "link", e), t === "style" && (o[Ot] = !0, o.onload = o.onerror = function() {
					Ft(o);
				}), Pt(o), r.head.appendChild(o);
			}
		}
	}
	function km(e, t) {
		xm.m(e, t);
		var n = wm;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + Xt(r) + "\"][href=\"" + Xt(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = Rm(e);
			}
			if (!vm.has(a) && (e = D({
				rel: "modulepreload",
				href: e
			}, t), vm.set(a, e), n.querySelector(i) === null)) {
				switch (r) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (n.querySelector(zm(a))) return;
				}
				r = n.createElement("link"), np(r, "link", e), Pt(r), n.head.appendChild(r);
			}
		}
	}
	function Am(e, t, n) {
		xm.S(e, t, n);
		var r = wm;
		if (r && e) {
			var i = Nt(r).hoistableStyles, a = Pm(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(Fm(a))) s.loading = 5;
				else {
					e = D({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = vm.get(a)) && Hm(e, n);
					var c = o = r.createElement("link");
					Pt(c), np(c, "link", e), c._p = new Promise(function(e, t) {
						c.onload = e, c.onerror = t;
					}), c.addEventListener("load", function() {
						s.loading |= 1;
					}), c.addEventListener("error", function() {
						s.loading |= 2;
					}), s.loading |= 4, Vm(o, t, r);
				}
				o = {
					type: "stylesheet",
					instance: o,
					count: 1,
					state: s
				}, i.set(a, o);
			}
		}
	}
	function jm(e, t) {
		xm.X(e, t);
		var n = wm;
		if (n && e) {
			var r = Nt(n).hoistableScripts, i = Rm(e), a = r.get(i);
			a || (a = n.querySelector(zm(i)), a || (e = D({
				src: e,
				async: !0
			}, t), (t = vm.get(i)) && Um(e, t), a = n.createElement("script"), Pt(a), np(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Mm(e, t) {
		xm.M(e, t);
		var n = wm;
		if (n && e) {
			var r = Nt(n).hoistableScripts, i = Rm(e), a = r.get(i);
			a || (a = n.querySelector(zm(i)), a || (e = D({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = vm.get(i)) && Um(e, t), a = n.createElement("script"), Pt(a), np(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Nm(e, t, n, r) {
		var a = (a = Se.current) ? bm(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (n = Pm(n.href), t = Nt(a).hoistableStyles, r = t.get(n), r || (r = {
				type: "style",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			case "link":
				if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
					e = Pm(n.href);
					var o = Nt(a).hoistableStyles, s = o.get(e);
					if (s || (a = a.ownerDocument || a, s = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, o.set(e, s), (o = a.querySelector(Fm(e))) ? o._p || (s.instance = o, s.state.loading = 5) : (o = vm.get(e), o || (o = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, vm.set(e, o)), Lm(a, e, o, s.state))), t && r === null) throw Error(i(528, ""));
					return s;
				}
				if (t && r !== null) throw Error(i(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (n = Rm(n), t = Nt(a).hoistableScripts, r = t.get(n), r || (r = {
				type: "script",
				instance: null,
				count: 0,
				state: null
			}, t.set(n, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			default: throw Error(i(444, e));
		}
	}
	function Pm(e) {
		return "href=\"" + Xt(e) + "\"";
	}
	function Fm(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function Im(e) {
		return D({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function Lm(e, t, n, r) {
		if (t = e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]")) {
			if (!0 !== t[Ot]) {
				r.loading = 1;
				return;
			}
		} else t = e.createElement("link"), t[Ot] = !0, t.onload = t.onerror = Ft.bind(null, t), np(t, "link", n), Pt(t), e.head.appendChild(t);
		r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		});
	}
	function Rm(e) {
		return "[src=\"" + Xt(e) + "\"]";
	}
	function zm(e) {
		return "script[async]" + e;
	}
	function Bm(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + Xt(n.href) + "\"]");
				if (r) return t.instance = r, Pt(r), r;
				var a = D({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), Pt(r), np(r, "style", a), Vm(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = Pm(n.href);
				var o = e.querySelector(Fm(a));
				if (o) return t.state.loading |= 4, t.instance = o, Pt(o), o;
				r = Im(n), (a = vm.get(a)) && Hm(r, a), o = (e.ownerDocument || e).createElement("link"), Pt(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), np(o, "link", r), t.state.loading |= 4, Vm(o, n.precedence, e), t.instance = o;
			case "script": return o = Rm(n.src), (a = e.querySelector(zm(o))) ? (t.instance = a, Pt(a), a) : (r = n, (a = vm.get(o)) && (r = D({}, n), Um(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), Pt(a), np(a, "link", r), e.head.appendChild(a), t.instance = a);
			case "void": return null;
			default: throw Error(i(443, t.type));
		}
		else t.type === "stylesheet" && !(t.state.loading & 4) && (r = t.instance, t.state.loading |= 4, Vm(r, n.precedence, e));
		return t.instance;
	}
	function Vm(e, t, n) {
		for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
			var s = r[o];
			if (s.dataset.precedence === t) a = s;
			else if (a !== i) break;
		}
		a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
	}
	function Hm(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
	}
	function Um(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
	}
	var Wm = null;
	function Gm(e, t, n) {
		if (Wm === null) {
			var r = /* @__PURE__ */ new Map(), i = Wm = /* @__PURE__ */ new Map();
			i.set(n, r);
		} else i = Wm, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
		if (r.has(e)) return r;
		for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
			var a = n[i];
			if (!(a[Dt] || a[bt] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
				var o = a.getAttribute(t) || "";
				o = e + o;
				var s = r.get(o);
				s ? s.push(a) : r.set(o, [a]);
			}
		}
		return r;
	}
	function Km(e, t, n) {
		e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
	}
	function qm(e, t, n) {
		if (n === 1 || t.itemProp != null) return !1;
		switch (e) {
			case "meta":
			case "title": return !0;
			case "style":
				if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
				return !0;
			case "link":
				if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
				switch (t.rel) {
					case "stylesheet": return e = t.disabled, typeof t.precedence == "string" && e == null;
					default: return !0;
				}
			case "script": if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string") return !0;
		}
		return !1;
	}
	function Jm(e, t) {
		return e === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
	}
	function Ym(e) {
		return !(e.type === "stylesheet" && !(e.state.loading & 3));
	}
	function Xm(e) {
		return (e.width || 100) * (e.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * .25;
	}
	function Zm(e, t) {
		typeof t.decode == "function" && (e.imgCount++, t.complete || (e.imgBytes += Xm(t), e.suspenseyImages.push(t)), e = rh.bind(e), t.decode().then(e, e));
	}
	function Qm(e, t, n, r) {
		if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && !(n.state.loading & 4)) {
			if (n.instance === null) {
				var i = Pm(r.href), a = t.querySelector(Fm(i));
				if (a) {
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = nh.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, Pt(a);
					return;
				}
				a = t.ownerDocument || t, r = Im(r), (i = vm.get(i)) && Hm(r, i), a = a.createElement("link"), Pt(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), np(a, "link", r), n.instance = a;
			}
			e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && !(n.state.loading & 3) && (e.count++, n = nh.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
		}
	}
	var $m = 0;
	function eh(e, t) {
		return e.stylesheets && e.count === 0 && ah(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
			var r = setTimeout(function() {
				if (e.stylesheets && ah(e, e.stylesheets), e.unsuspend) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, 6e4 + t);
			0 < e.imgBytes && $m === 0 && ($m = 62500 * op());
			var i = setTimeout(function() {
				if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && ah(e, e.stylesheets), e.unsuspend)) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, (e.imgBytes > $m ? 50 : 800) + t);
			return e.unsuspend = n, function() {
				e.unsuspend = null, clearTimeout(r), clearTimeout(i);
			};
		} : null;
	}
	function th(e) {
		if (e.count === 0 && (e.imgCount === 0 || !e.waitingForImages)) {
			if (e.stylesheets) ah(e, e.stylesheets);
			else if (e.unsuspend) {
				var t = e.unsuspend;
				e.unsuspend = null, t();
			}
		}
	}
	function nh() {
		this.count--, th(this);
	}
	function rh() {
		this.imgCount--, th(this);
	}
	var ih = null;
	function ah(e, t) {
		e.stylesheets = null, e.unsuspend !== null && (e.count++, ih = /* @__PURE__ */ new Map(), t.forEach(oh, e), ih = null, nh.call(e));
	}
	function oh(e, t) {
		if (!(t.state.loading & 4)) {
			var n = ih.get(e);
			if (n) var r = n.get(null);
			else {
				n = /* @__PURE__ */ new Map(), ih.set(e, n);
				for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
					var o = i[a];
					(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
				}
				r && n.set(null, r);
			}
			i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(null, i), n.set(o, i), this.count++, r = nh.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
		}
	}
	var sh = {
		$$typeof: F,
		Provider: null,
		Consumer: null,
		_currentValue: me,
		_currentValue2: me,
		_threadCount: 0
	};
	function ch(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = lt(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = lt(0), this.hiddenUpdates = lt(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function lh(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new ch(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = Ti(3, null, null, t), e.current = a, a.stateNode = e, t = Ta(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, so(a), e;
	}
	function uh(e) {
		return e ? (e = Ci, e) : Ci;
	}
	function dh(e, t, n, r, i, a) {
		i = uh(i), r.context === null ? r.context = i : r.pendingContext = i, r = lo(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = uo(e, r, t), n !== null && (Md(n, e, t), fo(n, e, t));
	}
	function fh(e, t) {
		if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
			var n = e.retryLane;
			e.retryLane = n !== 0 && n < t ? n : t;
		}
	}
	function ph(e, t) {
		fh(e, t), (e = e.alternate) && fh(e, t);
	}
	function mh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = bi(e, 67108864);
			t !== null && Md(t, e, 67108864), ph(e, 67108864);
		}
	}
	function hh(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = kd();
			t = ht(t);
			var n = bi(e, t);
			n !== null && Md(n, e, t), ph(e, t);
		}
	}
	var gh = !0;
	function _h(e, t, n, r) {
		var i = L.T;
		L.T = null;
		var a = R.p;
		try {
			R.p = 2, yh(e, t, n, r);
		} finally {
			R.p = a, L.T = i;
		}
	}
	function vh(e, t, n, r) {
		var i = L.T;
		L.T = null;
		var a = R.p;
		try {
			R.p = 8, yh(e, t, n, r);
		} finally {
			R.p = a, L.T = i;
		}
	}
	function yh(e, t, n, r) {
		if (gh) {
			var i = bh(r);
			if (i === null) Gf(e, t, r, xh, n), Mh(e, r);
			else if (Ph(i, e, t, n, r)) r.stopPropagation();
			else if (Mh(e, r), t & 4 && -1 < jh.indexOf(e)) {
				for (; i !== null;) {
					var a = jt(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = rt(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - B(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									Tf(a), !(X & 6) && (md = Be() + 500, Ef(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = bi(a, 2), s !== null && Md(s, a, 2), Ld(), ph(a, 2);
					}
					if (a = bh(r), a === null && Gf(e, t, r, xh, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else Gf(e, t, r, null, n);
		}
	}
	function bh(e) {
		return e = pn(e), Sh(e);
	}
	var xh = null;
	function Sh(e) {
		if (xh = null, e = At(e), e !== null) {
			var t = o(e);
			if (t === null) e = null;
			else {
				var n = t.tag;
				if (n === 13) {
					if (e = s(t), e !== null) return e;
					e = null;
				} else if (n === 31) {
					if (e = c(t), e !== null) return e;
					e = null;
				} else if (n === 3) {
					if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
					e = null;
				} else t !== e && (e = null);
			}
		}
		return xh = e, null;
	}
	function Ch(e) {
		switch (e) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "fullscreenerror":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart": return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "resize":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave": return 8;
			case "message": switch (Ve()) {
				case He: return 2;
				case Ue: return 8;
				case We:
				case Ge: return 32;
				case Ke: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var wh = !1, Th = null, Eh = null, Dh = null, Oh = /* @__PURE__ */ new Map(), kh = /* @__PURE__ */ new Map(), Ah = [], jh = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function Mh(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				Th = null;
				break;
			case "dragenter":
			case "dragleave":
				Eh = null;
				break;
			case "mouseover":
			case "mouseout":
				Dh = null;
				break;
			case "pointerover":
			case "pointerout":
				Oh.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": kh.delete(t.pointerId);
		}
	}
	function Nh(e, t, n, r, i, a) {
		return e === null || e.nativeEvent !== a ? (e = {
			blockedOn: t,
			domEventName: n,
			eventSystemFlags: r,
			nativeEvent: a,
			targetContainers: [i]
		}, t !== null && (t = jt(t), t !== null && mh(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
	}
	function Ph(e, t, n, r, i) {
		switch (t) {
			case "focusin": return Th = Nh(Th, e, t, n, r, i), !0;
			case "dragenter": return Eh = Nh(Eh, e, t, n, r, i), !0;
			case "mouseover": return Dh = Nh(Dh, e, t, n, r, i), !0;
			case "pointerover":
				var a = i.pointerId;
				return Oh.set(a, Nh(Oh.get(a) || null, e, t, n, r, i)), !0;
			case "gotpointercapture": return a = i.pointerId, kh.set(a, Nh(kh.get(a) || null, e, t, n, r, i)), !0;
		}
		return !1;
	}
	function Fh(e) {
		var t = At(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, vt(e.priority, function() {
							hh(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, vt(e.priority, function() {
							hh(n);
						});
						return;
					}
				} else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
					e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
					return;
				}
			}
		}
		e.blockedOn = null;
	}
	function Ih(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length;) {
			var n = bh(e.nativeEvent);
			if (n === null) {
				n = e.nativeEvent;
				var r = new n.constructor(n.type, n);
				fn = r, n.target.dispatchEvent(r), fn = null;
			} else return t = jt(n), t !== null && mh(t), e.blockedOn = n, !1;
			t.shift();
		}
		return !0;
	}
	function Lh(e, t, n) {
		Ih(e) && n.delete(t);
	}
	function Rh() {
		wh = !1, Th !== null && Ih(Th) && (Th = null), Eh !== null && Ih(Eh) && (Eh = null), Dh !== null && Ih(Dh) && (Dh = null), Oh.forEach(Lh), kh.forEach(Lh);
	}
	function zh(e, n) {
		e.blockedOn === n && (e.blockedOn = null, wh || (wh = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, Rh)));
	}
	var Bh = null;
	function Vh(e) {
		Bh !== e && (Bh = e, t.unstable_scheduleCallback(t.unstable_NormalPriority, function() {
			Bh === e && (Bh = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (Sh(r || n) === null) continue;
					break;
				}
				var a = jt(n);
				a !== null && (e.splice(t, 3), t -= 3, Ys(a, {
					pending: !0,
					data: i,
					method: n.method,
					action: r
				}, r, i));
			}
		}));
	}
	function Hh(e) {
		function t(t) {
			return zh(t, e);
		}
		Th !== null && zh(Th, e), Eh !== null && zh(Eh, e), Dh !== null && zh(Dh, e), Oh.forEach(t), kh.forEach(t);
		for (var n = 0; n < Ah.length; n++) {
			var r = Ah[n];
			r.blockedOn === e && (r.blockedOn = null);
		}
		for (; 0 < Ah.length && (n = Ah[0], n.blockedOn === null);) Fh(n), n.blockedOn === null && Ah.shift();
		if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
			var i = n[r], a = n[r + 1], o = i[xt] || null;
			if (typeof a == "function") o || Vh(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[xt] || null) s = o.formAction;
					else if (Sh(i) !== null) continue;
				} else s = o.action;
				typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Vh(n);
			}
		}
	}
	function Uh() {
		function e(e) {
			e.canIntercept && e.info === "react-transition" && e.intercept({
				handler: function() {
					return new Promise(function(e) {
						return i = e;
					});
				},
				focusReset: "manual",
				scroll: "manual"
			});
		}
		function t() {
			i !== null && (i(), i = null), r || setTimeout(n, 20);
		}
		function n() {
			if (!r && !navigation.transition) {
				var e = navigation.currentEntry;
				e && e.url != null && navigation.navigate(e.url, {
					state: e.getState(),
					info: "react-transition",
					history: "replace"
				});
			}
		}
		if (typeof navigation == "object") {
			var r = !1, i = null;
			return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
				r = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
			};
		}
	}
	function Wh(e) {
		this._internalRoot = e;
	}
	Gh.prototype.render = Wh.prototype.render = function(e) {
		var t = this._internalRoot;
		if (t === null) throw Error(i(409));
		var n = t.current;
		dh(n, kd(), e, t, null, null);
	}, Gh.prototype.unmount = Wh.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			dh(e.current, 2, null, e, null, null), Ld(), t[St] = null;
		}
	};
	function Gh(e) {
		this._internalRoot = e;
	}
	Gh.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = _t();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < Ah.length && t !== 0 && t < Ah[n].priority; n++);
			Ah.splice(n, 0, e), n === 0 && Fh(e);
		}
	};
	var Kh = n.version;
	if (Kh !== "19.3.1") throw Error(i(527, Kh, "19.3.1"));
	R.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = d(t), e = e === null ? null : p(e), e = e === null ? null : e.stateNode, e;
	};
	var qh = {
		bundleType: 0,
		version: "19.3.1",
		rendererPackageName: "react-dom",
		currentDispatcherRef: L,
		reconcilerVersion: "19.3.1"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var Jh = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!Jh.isDisabled && Jh.supportsFiber) try {
			Ye = Jh.inject(qh), z = Jh;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = vc, s = yc, c = bc;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = lh(e, 1, !1, null, null, n, r, null, o, s, c, Uh), e[St] = t.current, Uf(e), new Wh(t);
	};
})), g = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = h();
})), _ = /* @__PURE__ */ c(u(), 1), v = g(), y = class extends Error {
	status;
	code;
	constructor(e, t, n) {
		super(n), this.status = e, this.code = t;
	}
}, b = new Uint32Array([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]);
function x(e) {
	let t = typeof e == "string" ? new TextEncoder().encode(e) : e, n = new Uint32Array([
		1779033703,
		3144134277,
		1013904242,
		2773480762,
		1359893119,
		2600822924,
		528734635,
		1541459225
	]), r = new Uint8Array(t.length + 9 + 63 >> 6 << 6);
	r.set(t), r[t.length] = 128;
	let i = new DataView(r.buffer);
	i.setUint32(r.length - 8, Math.floor(t.length * 8 / 4294967296)), i.setUint32(r.length - 4, t.length * 8 >>> 0);
	let a = /* @__PURE__ */ new Uint32Array(64), o = (e, t) => e >>> t | e << 32 - t;
	for (let e = 0; e < r.length; e += 64) {
		for (let t = 0; t < 16; t++) a[t] = i.getUint32(e + t * 4);
		for (let e = 16; e < 64; e++) {
			let t = o(a[e - 15], 7) ^ o(a[e - 15], 18) ^ a[e - 15] >>> 3, n = o(a[e - 2], 17) ^ o(a[e - 2], 19) ^ a[e - 2] >>> 10;
			a[e] = a[e - 16] + t + a[e - 7] + n | 0;
		}
		let [t, r, s, c, l, u, d, f] = n;
		for (let e = 0; e < 64; e++) {
			let n = f + (o(l, 6) ^ o(l, 11) ^ o(l, 25)) + (l & u ^ ~l & d) + b[e] + a[e] | 0, i = (o(t, 2) ^ o(t, 13) ^ o(t, 22)) + (t & r ^ t & s ^ r & s) | 0;
			f = d, d = u, u = l, l = c + n | 0, c = s, s = r, r = t, t = n + i | 0;
		}
		n[0] += t, n[1] += r, n[2] += s, n[3] += c, n[4] += l, n[5] += u, n[6] += d, n[7] += f;
	}
	return [...n].map((e) => e.toString(16).padStart(8, "0")).join("");
}
// src/reqif/xml.ts
var S = 256, C = 4e6, w = 134217728, T = /^[A-Za-z_][A-Za-z0-9_.:-]*/, E = (e) => {
	throw new y(422, "invalid_reqif", e);
};
function D(e) {
	return e.includes("&") ? e.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|lt|gt|amp|quot|apos);?/g, (e, t) => {
		if (!e.endsWith(";")) return E(`Malformed character reference "${e}"`);
		if (t[0] === "#") {
			let n = t[1] === "x" ? parseInt(t.slice(2), 16) : parseInt(t.slice(1), 10);
			return !Number.isFinite(n) || n > 1114111 || n === 0 ? E(`Invalid character reference "${e}"`) : String.fromCodePoint(n);
		}
		return {
			lt: "<",
			gt: ">",
			amp: "&",
			quot: "\"",
			apos: "'"
		}[t];
	}) : e;
}
function O(e) {
	e.length > w && E("ReqIF document exceeds 128 MiB");
	let t = +(e.charCodeAt(0) === 65279), n = 0, r = [], i = null, a = (e) => {
		++n > C && E("ReqIF document has too many XML nodes");
		let t = r[r.length - 1];
		t ? t.children.push(e) : typeof e == "string" ? e.trim() && E("Text outside the root element") : i ? E("More than one root element") : i = e;
	};
	for (; t < e.length;) {
		let n = e.indexOf("<", t);
		if (n < 0) {
			a(D(e.slice(t)));
			break;
		}
		if (n > t && a(D(e.slice(t, n))), e.startsWith("<!--", n)) {
			let r = e.indexOf("-->", n + 4);
			r < 0 && E("Unterminated comment"), t = r + 3;
			continue;
		}
		if (e.startsWith("<![CDATA[", n)) {
			let i = e.indexOf("]]>", n + 9);
			i < 0 && E("Unterminated CDATA section"), r.length || E("CDATA outside the root element"), a(e.slice(n + 9, i)), t = i + 3;
			continue;
		}
		if (e.startsWith("<?", n)) {
			let r = e.indexOf("?>", n + 2);
			r < 0 && E("Unterminated processing instruction"), t = r + 2;
			continue;
		}
		if (e.startsWith("<!", n) && E("DOCTYPE and entity declarations are not accepted in ReqIF files"), e[n + 1] === "/") {
			let i = e.indexOf(">", n);
			i < 0 && E("Unterminated end tag");
			let a = e.slice(n + 2, i).trim(), o = r.pop();
			o && o.name === a || E(`Mismatched end tag </${a}>`), t = i + 1;
			continue;
		}
		let i = T.exec(e.slice(n + 1, n + 201));
		i || E("Malformed start tag");
		let o = {
			name: i[0],
			attrs: {},
			children: []
		}, s = n + 1 + o.name.length;
		for (;;) {
			for (; /\s/.test(e[s] ?? "");) s++;
			if (s >= e.length && E(`Unterminated start tag <${o.name}>`), e[s] === ">" || e.startsWith("/>", s)) break;
			let t = T.exec(e.slice(s, s + 200));
			for (t || E(`Malformed attribute in <${o.name}>`), s += t[0].length; /\s/.test(e[s] ?? "");) s++;
			for (e[s] !== "=" && E(`Attribute ${t[0]} needs a value`), s++; /\s/.test(e[s] ?? "");) s++;
			let n = e[s];
			n !== "\"" && n !== "'" && E(`Attribute ${t[0]} value must be quoted`);
			let r = e.indexOf(n, s + 1);
			r < 0 && E(`Unterminated attribute ${t[0]}`);
			let i = e.slice(s + 1, r);
			i.includes("<") && E(`Attribute ${t[0]} contains "<"`), Object.hasOwn(o.attrs, t[0]) && E(`Duplicate attribute ${t[0]}`), o.attrs[t[0]] = D(i.replace(/[\t\n\r]/g, " ")), s = r + 1;
		}
		let c = e[s] === "/";
		a(o), c || (r.push(o), r.length > S && E("ReqIF document nests too deeply")), t = s + (c ? 2 : 1);
	}
	return r.length && E(`Unclosed element <${r[r.length - 1].name}>`), i || E("Empty XML document"), i;
}
var k = (e) => e.slice(e.indexOf(":") + 1), A = (e) => e?.children.filter((e) => typeof e != "string") ?? [], j = (e, t) => A(e).find((e) => k(e.name) === t), M = (e, t) => A(e).filter((e) => k(e.name) === t), N = (e) => e ? e.children.map((e) => typeof e == "string" ? e : N(e)).join("") : "";
function P(e) {
	return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function F(e) {
	return P(e).replace(/"/g, "&quot;").replace(/\r\n|\r|\n/g, "&#10;").replace(/\t/g, "&#9;");
}
function I(e) {
	if (typeof e == "string") return P(e);
	let t = Object.entries(e.attrs).map(([e, t]) => ` ${e}="${F(t)}"`).join("");
	return e.children.length ? `<${e.name}${t}>${e.children.map(I).join("")}</${e.name}>` : `<${e.name}${t}/>`;
}
var ee = /* @__PURE__ */ new Set([
	"p",
	"div",
	"li",
	"tr",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"pre",
	"blockquote",
	"table",
	"ul",
	"ol",
	"dl",
	"dt",
	"dd"
]);
function te(e) {
	let t = "", n = (e) => {
		if (typeof e == "string") {
			/^\s*\n\s*$/.test(e) || (t += e);
			return;
		}
		let r = k(e.name).toLowerCase();
		if (r === "br") {
			t += "\n";
			return;
		}
		let i = ee.has(r);
		i && t && !t.endsWith("\n") && (t += "\n"), r === "li" && (t += "- "), r !== "td" && r !== "th" || !t || t.endsWith("\n") || t.endsWith("	") || (t += "	"), e.children.forEach(n), i && !t.endsWith("\n") && (t += "\n");
	};
	return e.forEach(n), t.replace(/^\n+|\n+$/g, "");
}
function ne(e) {
	return `<xhtml:div>${e.split(/\r\n|\r|\n/).map(P).join("<xhtml:br/>")}</xhtml:div>`;
}
// src/reqif/reqif.ts
var re = "http://www.omg.org/spec/ReqIF/20110401/reqif.xsd", ie = "http://www.w3.org/1999/xhtml", ae = "Plotune RMS", oe = "rms_parent", se = "RMS.Attr.", ce = {
	text: "STRING",
	number: "REAL",
	integer: "INTEGER",
	boolean: "BOOLEAN",
	enum: "ENUMERATION",
	date: "DATE",
	quantity: "REAL",
	reference: "STRING"
};
function le(e, t) {
	return t.map((t) => {
		let n = ce[t.type];
		return {
			identifier: `rms-ad-${e}-attr-${t.key.replace(/_/g, "-")}`,
			name: `${se}${t.key}`,
			kind: n,
			field: `attributes.${t.key}`,
			editable: !0,
			attribute: t,
			datatype: n === "ENUMERATION" ? `rms-dt-attr-${e}-${t.key.replace(/_/g, "-")}` : n === "REAL" ? "rms-dt-real" : n === "DATE" ? "rms-dt-date" : n === "INTEGER" ? "rms-dt-integer-signed" : n === "BOOLEAN" ? "rms-dt-boolean" : "rms-dt-string",
			desc: t.type === "quantity" ? `${t.label} (unit: ${t.unit})` : t.label,
			...t.type === "enum" ? {
				options: t.options,
				multi: t.multi === !0
			} : {}
		};
	});
}
var ue = [
	{
		identifier: "rms-ad-req-foreign-id",
		name: "ReqIF.ForeignID",
		kind: "STRING",
		datatype: "rms-dt-string",
		field: "id"
	},
	{
		identifier: "rms-ad-req-text",
		name: "ReqIF.Text",
		kind: "XHTML",
		datatype: "rms-dt-xhtml",
		field: "statement",
		editable: !0
	},
	{
		identifier: "rms-ad-req-criteria",
		name: "RMS.AcceptanceCriteria",
		kind: "XHTML",
		datatype: "rms-dt-xhtml",
		field: "criteria",
		editable: !0
	},
	{
		identifier: "rms-ad-req-rationale",
		name: "RMS.Rationale",
		kind: "XHTML",
		datatype: "rms-dt-xhtml",
		field: "rationale",
		editable: !0
	},
	{
		identifier: "rms-ad-req-category",
		name: "RMS.Category",
		kind: "STRING",
		datatype: "rms-dt-string",
		field: "category",
		editable: !0
	},
	{
		identifier: "rms-ad-req-comment",
		name: "RMS.Comment",
		kind: "STRING",
		datatype: "rms-dt-string",
		field: "comment",
		editable: !0
	},
	{
		identifier: "rms-ad-req-source-url",
		name: "RMS.SourceURL",
		kind: "STRING",
		datatype: "rms-dt-string",
		field: "sourceUrl",
		editable: !0
	},
	{
		identifier: "rms-ad-req-product",
		name: "RMS.Product",
		kind: "STRING",
		datatype: "rms-dt-string",
		field: "productId"
	},
	{
		identifier: "rms-ad-req-applies-to",
		name: "RMS.AppliesTo",
		kind: "STRING",
		datatype: "rms-dt-string",
		field: "appliesTo",
		editable: !0
	},
	{
		identifier: "rms-ad-req-rev",
		name: "RMS.Revision",
		kind: "INTEGER",
		datatype: "rms-dt-integer",
		field: "rev"
	},
	{
		identifier: "rms-ad-req-record-revision",
		name: "RMS.RecordRevision",
		kind: "INTEGER",
		datatype: "rms-dt-integer",
		field: "revision"
	},
	{
		identifier: "rms-ad-req-state",
		name: "RMS.LifecycleStatus",
		kind: "ENUMERATION",
		datatype: "rms-dt-lifecycle",
		field: "state"
	},
	{
		identifier: "rms-ad-req-verification",
		name: "RMS.VerificationStatus",
		kind: "ENUMERATION",
		datatype: "rms-dt-verification",
		field: "verificationStatus"
	},
	{
		identifier: "rms-ad-req-verified-level",
		name: "RMS.HighestVerifiedLevel",
		kind: "STRING",
		datatype: "rms-dt-string",
		field: "highestVerifiedLevel"
	}
], de = [
	{
		identifier: "rms-ad-tc-foreign-id",
		name: "ReqIF.ForeignID",
		kind: "STRING",
		datatype: "rms-dt-string",
		field: "id"
	},
	{
		identifier: "rms-ad-tc-name",
		name: "ReqIF.Name",
		kind: "STRING",
		datatype: "rms-dt-string",
		field: "name"
	},
	{
		identifier: "rms-ad-tc-text",
		name: "ReqIF.Text",
		kind: "XHTML",
		datatype: "rms-dt-xhtml",
		field: "objective"
	},
	{
		identifier: "rms-ad-tc-procedure",
		name: "RMS.Procedure",
		kind: "XHTML",
		datatype: "rms-dt-xhtml",
		field: "acceptanceCriteriaProcedure"
	},
	{
		identifier: "rms-ad-tc-requirement",
		name: "RMS.RequirementID",
		kind: "STRING",
		datatype: "rms-dt-string",
		field: "requirementId"
	},
	{
		identifier: "rms-ad-tc-requirement-rev",
		name: "RMS.RequirementRevision",
		kind: "INTEGER",
		datatype: "rms-dt-integer",
		field: "requirementRev"
	},
	{
		identifier: "rms-ad-tc-method",
		name: "RMS.Method",
		kind: "STRING",
		datatype: "rms-dt-string",
		field: "method"
	},
	{
		identifier: "rms-ad-tc-mandatory",
		name: "RMS.Mandatory",
		kind: "BOOLEAN",
		datatype: "rms-dt-boolean",
		field: "mandatory"
	},
	{
		identifier: "rms-ad-tc-status",
		name: "RMS.TestCaseStatus",
		kind: "ENUMERATION",
		datatype: "rms-dt-test-case-status",
		field: "status"
	},
	{
		identifier: "rms-ad-tc-min-level",
		name: "RMS.MinLevel",
		kind: "STRING",
		datatype: "rms-dt-string",
		field: "minLevel"
	},
	{
		identifier: "rms-ad-tc-target-level",
		name: "RMS.TargetLevel",
		kind: "STRING",
		datatype: "rms-dt-string",
		field: "targetLevel"
	},
	{
		identifier: "rms-ad-tc-levels",
		name: "RMS.ApplicableLevels",
		kind: "STRING",
		datatype: "rms-dt-string",
		field: "applicableLevels"
	},
	{
		identifier: "rms-ad-tc-coverage",
		name: "RMS.Coverage",
		kind: "STRING",
		datatype: "rms-dt-string",
		field: "coverage"
	},
	{
		identifier: "rms-ad-tc-result",
		name: "RMS.LatestResult",
		kind: "STRING",
		datatype: "rms-dt-string",
		field: "latestResult"
	},
	{
		identifier: "rms-ad-tc-record-revision",
		name: "RMS.RecordRevision",
		kind: "INTEGER",
		datatype: "rms-dt-integer",
		field: "revision"
	}
], fe = {
	identifier: "rms-sot-requirement",
	name: "RMS Requirement"
}, pe = {
	identifier: "rms-sot-test-case",
	name: "RMS Test Case"
}, L = {
	identifier: "rms-st-specification",
	name: "RMS Specification"
}, R = [
	"Verified",
	"Failed",
	"Not Verified"
], me = [
	"Draft",
	"Active",
	"Retired"
], he = (e) => `rms-srt-${e.replace(/_/g, "-")}`, ge = (e) => e.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "x";
function _e(e, t, n) {
	let r = x(`${e}\u0000${t}\u0000${n}`);
	return `_${r.slice(0, 8)}-${r.slice(8, 12)}-${r.slice(12, 16)}-${r.slice(16, 20)}-${r.slice(20, 32)}`;
}
function ve(e, t, n) {
	let r = n.reqif?.identifier;
	return typeof r == "string" && r ? r : _e(e, t, String(n.id));
}
var ye = (e, t) => {
	let n = t.startsWith("attributes.") ? e.attributes?.[t.slice(11)] : e[t];
	return Array.isArray(n) && !t.startsWith("attributes.") ? n.join(", ") : n;
};
function be(e) {
	let t = e.exportedAt, n = [], r = (n, r) => e.lastChanged.get(`${n}\u0000${r}`) ?? t, i = (e, n, r, i = "", a = "") => `<${e} IDENTIFIER="${F(n)}" LAST-CHANGE="${t}" LONG-NAME="${F(r)}"${i}${a ? `>${a}</${e}>` : "/>"}`, a = (e, t, n, r = !1) => i("DATATYPE-DEFINITION-ENUMERATION", e, t, "", `<SPECIFIED-VALUES>${n.map((t, n) => i("ENUM-VALUE", `${e}-${r ? n : ge(t)}`, t, "", `<PROPERTIES><EMBEDDED-VALUE KEY="${n}" OTHER-CONTENT=""/></PROPERTIES>`)).join("")}</SPECIFIED-VALUES>`), o = (e) => e.map((e) => i(`ATTRIBUTE-DEFINITION-${e.kind}`, e.identifier, e.name, `${e.desc ? ` DESC="${F(e.desc)}"` : ""}${e.kind === "ENUMERATION" ? ` IS-EDITABLE="${e.editable ? "true" : "false"}" MULTI-VALUED="${e.multi ? "true" : "false"}"` : ` IS-EDITABLE="${e.editable ? "true" : "false"}"`}`, `<TYPE><DATATYPE-DEFINITION-${e.kind}-REF>${e.datatype}</DATATYPE-DEFINITION-${e.kind}-REF></TYPE>`)).join(""), s = (e, t) => t.map((t) => {
		let n = ye(e, t.field);
		if (n == null || n === "") return "";
		let r = `<DEFINITION><ATTRIBUTE-DEFINITION-${t.kind}-REF>${t.identifier}</ATTRIBUTE-DEFINITION-${t.kind}-REF></DEFINITION>`;
		if (t.kind === "XHTML") return `<ATTRIBUTE-VALUE-XHTML>${r}<THE-VALUE>${ne(String(n))}</THE-VALUE></ATTRIBUTE-VALUE-XHTML>`;
		if (t.kind === "ENUMERATION" && t.options) {
			let e = (Array.isArray(n) ? n : String(n).split(", ")).map((e) => t.options.indexOf(String(e))).filter((e) => e >= 0);
			return e.length ? `<ATTRIBUTE-VALUE-ENUMERATION>${r}<VALUES>${e.map((e) => `<ENUM-VALUE-REF>${t.datatype}-${e}</ENUM-VALUE-REF>`).join("")}</VALUES></ATTRIBUTE-VALUE-ENUMERATION>` : "";
		}
		if (t.kind === "ENUMERATION") return `<ATTRIBUTE-VALUE-ENUMERATION>${r}<VALUES><ENUM-VALUE-REF>${t.datatype}-${ge(String(n))}</ENUM-VALUE-REF></VALUES></ATTRIBUTE-VALUE-ENUMERATION>`;
		if (t.kind === "REAL") {
			let e = typeof n == "object" ? n.value : n;
			return typeof e == "number" && Number.isFinite(e) ? `<ATTRIBUTE-VALUE-REAL THE-VALUE="${e}">${r}</ATTRIBUTE-VALUE-REAL>` : "";
		}
		return t.kind === "DATE" ? typeof n == "string" && /^\d{4}-\d{2}-\d{2}$/.test(n) ? `<ATTRIBUTE-VALUE-DATE THE-VALUE="${n}T00:00:00Z">${r}</ATTRIBUTE-VALUE-DATE>` : "" : t.kind === "BOOLEAN" ? `<ATTRIBUTE-VALUE-BOOLEAN THE-VALUE="${n === !0 ? "true" : "false"}">${r}</ATTRIBUTE-VALUE-BOOLEAN>` : t.kind === "INTEGER" ? Number.isInteger(n) ? `<ATTRIBUTE-VALUE-INTEGER THE-VALUE="${n}">${r}</ATTRIBUTE-VALUE-INTEGER>` : "" : `<ATTRIBUTE-VALUE-STRING THE-VALUE="${F(String(n))}">${r}</ATTRIBUTE-VALUE-STRING>`;
	}).join(""), c = [.../* @__PURE__ */ new Set([...e.states, ...e.requirements.map((e) => String(e.state))])], l = /* @__PURE__ */ new Map();
	for (let t of e.requirements) l.set(`requirement\u0000${t.id}`, ve(e.workspace, "requirement", t));
	for (let t of e.testCases) l.set(`test_case\u0000${t.id}`, ve(e.workspace, "test_case", t));
	n.push(`<?xml version="1.0" encoding="UTF-8"?>\n<REQ-IF xmlns="${re}" xmlns:xhtml="${ie}">`), n.push(`<THE-HEADER><REQ-IF-HEADER IDENTIFIER="${F(e.exportId)}">${e.comment ? `<COMMENT>${P(e.comment)}</COMMENT>` : ""}<CREATION-TIME>${t}</CREATION-TIME><REPOSITORY-ID>${P(`plotune-rms:${e.workspace}`)}</REPOSITORY-ID><REQ-IF-TOOL-ID>${ae}</REQ-IF-TOOL-ID><REQ-IF-VERSION>1.0</REQ-IF-VERSION><SOURCE-TOOL-ID>${ae}</SOURCE-TOOL-ID><TITLE>${P(e.title)}</TITLE></REQ-IF-HEADER></THE-HEADER>`), n.push("<CORE-CONTENT><REQ-IF-CONTENT><DATATYPES>"), n.push(i("DATATYPE-DEFINITION-STRING", "rms-dt-string", "RMS String", " MAX-LENGTH=\"1000000\"")), n.push(i("DATATYPE-DEFINITION-XHTML", "rms-dt-xhtml", "RMS Formatted Text")), n.push(i("DATATYPE-DEFINITION-INTEGER", "rms-dt-integer", "RMS Integer", " MAX=\"2147483647\" MIN=\"0\"")), n.push(i("DATATYPE-DEFINITION-BOOLEAN", "rms-dt-boolean", "RMS Boolean"));
	let u = [...ue, ...le("req", e.attributeDefinitions?.requirement ?? [])], d = [...de, ...le("tc", e.attributeDefinitions?.test_case ?? [])], f = [...u, ...d].filter((e) => e.attribute);
	f.some((e) => e.kind === "REAL") && n.push(i("DATATYPE-DEFINITION-REAL", "rms-dt-real", "RMS Real", " ACCURACY=\"12\" MAX=\"1.7976931348623157E308\" MIN=\"-1.7976931348623157E308\"")), f.some((e) => e.kind === "INTEGER") && n.push(i("DATATYPE-DEFINITION-INTEGER", "rms-dt-integer-signed", "RMS Signed Integer", " MAX=\"9007199254740991\" MIN=\"-9007199254740991\"")), f.some((e) => e.kind === "DATE") && n.push(i("DATATYPE-DEFINITION-DATE", "rms-dt-date", "RMS Date"));
	for (let e of f) e.options && n.push(a(e.datatype, `${e.name} values`, e.options, !0));
	n.push(a("rms-dt-lifecycle", "RMS Lifecycle Status", c)), n.push(a("rms-dt-verification", "RMS Verification Status", R)), n.push(a("rms-dt-test-case-status", "RMS Test Case Status", me)), n.push("</DATATYPES><SPEC-TYPES>"), n.push(i("SPEC-OBJECT-TYPE", fe.identifier, fe.name, "", `<SPEC-ATTRIBUTES>${o(u)}</SPEC-ATTRIBUTES>`)), n.push(i("SPEC-OBJECT-TYPE", pe.identifier, pe.name, "", `<SPEC-ATTRIBUTES>${o(d)}</SPEC-ATTRIBUTES>`));
	let p = [...e.relationTypes, {
		id: oe,
		label: "Refines (child of)"
	}];
	for (let e of p) n.push(i("SPEC-RELATION-TYPE", he(e.id), e.id, ` DESC="${F(e.label)}"`));
	n.push(i("SPECIFICATION-TYPE", L.identifier, L.name)), n.push("</SPEC-TYPES><SPEC-OBJECTS>");
	let m = (e, t) => {
		let n = e === "requirement" ? fe : pe, i = e === "requirement" ? u : d;
		return `<SPEC-OBJECT IDENTIFIER="${F(l.get(`${e}\u0000${t.id}`))}" LAST-CHANGE="${r(e, String(t.id))}" LONG-NAME="${F(String(t.id))}"><VALUES>${s(t, i)}</VALUES><TYPE><SPEC-OBJECT-TYPE-REF>${n.identifier}</SPEC-OBJECT-TYPE-REF></TYPE></SPEC-OBJECT>`;
	};
	for (let t of e.requirements) n.push(m("requirement", t));
	for (let t of e.testCases) n.push(m("test_case", t));
	n.push("</SPEC-OBJECTS><SPEC-RELATIONS>");
	let h = 0, g = (e, t, r, i, a) => {
		h++, n.push(`<SPEC-RELATION IDENTIFIER="${F(e)}" LAST-CHANGE="${t}"><SOURCE><SPEC-OBJECT-REF>${P(i)}</SPEC-OBJECT-REF></SOURCE><TARGET><SPEC-OBJECT-REF>${P(a)}</SPEC-OBJECT-REF></TARGET><TYPE><SPEC-RELATION-TYPE-REF>${he(r)}</SPEC-RELATION-TYPE-REF></TYPE></SPEC-RELATION>`);
	};
	for (let t of e.requirements) for (let n of t.parents ?? []) {
		let i = l.get(`requirement\u0000${n}`);
		i && g(_e(e.workspace, "parent", `${t.id}\u0000${n}`), r("requirement", String(t.id)), oe, l.get(`requirement\u0000${t.id}`), i);
	}
	for (let t of e.links) {
		let n = l.get(`${t.fromKind ?? "requirement"}\u0000${t.from}`), i = l.get(`${t.toKind ?? "requirement"}\u0000${t.to}`);
		n && i && g(ve(e.workspace, "trace", t), r("trace", String(t.id)), String(t.type), n, i);
	}
	n.push("</SPEC-RELATIONS><SPECIFICATIONS>");
	let _ = /* @__PURE__ */ new Map();
	for (let t of e.requirements) _.set(String(t.productId), [..._.get(String(t.productId)) ?? [], t]);
	let v = new Map(e.products.map((e) => [String(e.id), String(e.name ?? e.id)])), y = /* @__PURE__ */ new Map();
	for (let t of e.testCases) y.set(String(t.requirementId), [...y.get(String(t.requirementId)) ?? [], t]);
	let b = 0;
	for (let [r, i] of _) {
		b++;
		let a = new Set(i.map((e) => String(e.id))), o = /* @__PURE__ */ new Map();
		for (let e of i) o.set(String(e.id), (e.parents ?? []).find((t) => a.has(t) && t !== e.id) ?? "");
		for (let e of o.keys()) {
			let t = /* @__PURE__ */ new Set([e]), n = o.get(e);
			for (; n;) {
				if (t.has(n)) {
					o.set(e, "");
					break;
				}
				t.add(n), n = o.get(n) ?? "";
			}
		}
		let s = /* @__PURE__ */ new Map();
		for (let e of i) {
			let t = o.get(String(e.id));
			s.set(t, [...s.get(t) ?? [], String(e.id)]);
		}
		let c = (n, i, a) => `<SPEC-HIERARCHY IDENTIFIER="${F(_e(e.workspace, `hierarchy:${r}`, `${n}\u0000${i}`))}" LAST-CHANGE="${t}"><OBJECT><SPEC-OBJECT-REF>${P(l.get(`${n}\u0000${i}`))}</SPEC-OBJECT-REF></OBJECT>${a ? `<CHILDREN>${a}</CHILDREN>` : ""}</SPEC-HIERARCHY>`, u = (e) => c("requirement", e, [...(y.get(e) ?? []).map((e) => c("test_case", String(e.id), "")), ...(s.get(e) ?? []).map(u)].join(""));
		n.push(`<SPECIFICATION IDENTIFIER="${F(_e(e.workspace, "specification", r))}" LAST-CHANGE="${t}" LONG-NAME="${F(`${v.get(r) ?? r} (${r})`)}"><TYPE><SPECIFICATION-TYPE-REF>${L.identifier}</SPECIFICATION-TYPE-REF></TYPE><CHILDREN>${(s.get("") ?? []).map(u).join("")}</CHILDREN></SPECIFICATION>`);
	}
	return n.push("</SPECIFICATIONS></REQ-IF-CONTENT></CORE-CONTENT></REQ-IF>\n"), {
		xml: n.join("\n"),
		objects: e.requirements.length + e.testCases.length,
		relations: h,
		specifications: b
	};
}
var xe = (e) => N(A(e)[0]).trim();
function Se(e) {
	let t = O(e);
	if (k(t.name) !== "REQ-IF") throw new y(422, "invalid_reqif", "The root element must be REQ-IF");
	let n = Object.entries(t.attrs).find(([e]) => e === "xmlns" || e.startsWith("xmlns:") && t.name.startsWith(`${e.slice(6)}:`))?.[1];
	if (n !== "http://www.omg.org/spec/ReqIF/20110401/reqif.xsd") throw new y(422, "invalid_reqif", `Unsupported ReqIF namespace ${n ?? "(none)"}; ReqIF 1.0.1-1.2 use ${re}`);
	let r = j(j(t, "THE-HEADER"), "REQ-IF-HEADER");
	if (!r) throw new y(422, "invalid_reqif", "THE-HEADER/REQ-IF-HEADER is missing");
	let i = (e) => N(j(r, e)).trim(), a = j(j(t, "CORE-CONTENT"), "REQ-IF-CONTENT");
	if (!a) throw new y(422, "invalid_reqif", "CORE-CONTENT/REQ-IF-CONTENT is missing");
	let o = [], s = /* @__PURE__ */ new Map();
	for (let e of A(j(a, "DATATYPES"))) for (let t of M(j(e, "SPECIFIED-VALUES"), "ENUM-VALUE")) s.set(t.attrs.IDENTIFIER, t.attrs["LONG-NAME"] ?? t.attrs.IDENTIFIER);
	let c = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map();
	for (let e of A(j(a, "SPEC-TYPES"))) {
		let t = e.attrs["LONG-NAME"] ?? e.attrs.IDENTIFIER;
		k(e.name) === "SPEC-OBJECT-TYPE" && l.set(e.attrs.IDENTIFIER, t), k(e.name) === "SPEC-RELATION-TYPE" && u.set(e.attrs.IDENTIFIER, t);
		for (let t of A(j(e, "SPEC-ATTRIBUTES"))) c.set(t.attrs.IDENTIFIER, t.attrs["LONG-NAME"] ?? t.attrs.IDENTIFIER);
	}
	let d = (e) => A(j(e, "VALUES")).map((e) => {
		let t = k(e.name).replace("ATTRIBUTE-VALUE-", ""), n = xe(j(e, "DEFINITION")), r = c.get(n) ?? n;
		if (t === "XHTML") {
			let i = j(e, "THE-VALUE");
			return {
				definition: n,
				name: r,
				kind: t,
				text: te(i?.children ?? []),
				xhtml: (i?.children ?? []).map(I).join("")
			};
		}
		if (t === "ENUMERATION") {
			let i = A(j(e, "VALUES")).map((e) => s.get(N(e).trim()) ?? N(e).trim());
			return {
				definition: n,
				name: r,
				kind: t,
				text: i.join(", "),
				raw: i
			};
		}
		let i = e.attrs["THE-VALUE"] ?? "";
		return {
			definition: n,
			name: r,
			kind: t,
			text: i,
			raw: t === "INTEGER" ? Number(i) : t === "BOOLEAN" ? i === "true" : i
		};
	}), f = M(j(a, "SPEC-OBJECTS"), "SPEC-OBJECT").map((e) => {
		let t = xe(j(e, "TYPE"));
		return {
			identifier: e.attrs.IDENTIFIER,
			type: t,
			typeName: l.get(t) ?? t,
			lastChange: e.attrs["LAST-CHANGE"] ?? "",
			longName: e.attrs["LONG-NAME"] ?? "",
			values: d(e)
		};
	}), p = M(j(a, "SPEC-RELATIONS"), "SPEC-RELATION").map((e) => {
		let t = xe(j(e, "TYPE"));
		return j(e, "VALUES") && A(j(e, "VALUES")).length && o.push(`Relation ${e.attrs.IDENTIFIER} has attribute values; RMS keeps them only in the import record`), {
			identifier: e.attrs.IDENTIFIER,
			type: t,
			typeName: u.get(t) ?? t,
			source: xe(j(e, "SOURCE")),
			target: xe(j(e, "TARGET"))
		};
	}), m = [];
	for (let e of M(j(a, "SPECIFICATIONS"), "SPECIFICATION")) {
		let t = (n, r) => {
			for (let i of M(j(n, "CHILDREN"), "SPEC-HIERARCHY")) {
				let n = xe(j(i, "OBJECT"));
				m.push({
					specification: e.attrs.IDENTIFIER,
					specificationName: e.attrs["LONG-NAME"] ?? e.attrs.IDENTIFIER,
					object: n,
					parent: r
				}), t(i, n);
			}
		};
		t(e, null);
	}
	return M(j(a, "SPEC-RELATION-GROUPS"), "RELATION-GROUP").length && o.push("Relation groups are not used by RMS; their member relations are imported individually"), j(t, "TOOL-EXTENSIONS") && A(j(t, "TOOL-EXTENSIONS")).length && o.push("Tool extensions are not interpreted"), {
		header: {
			identifier: r.attrs.IDENTIFIER ?? "",
			title: i("TITLE"),
			sourceTool: i("SOURCE-TOOL-ID"),
			toolId: i("REQ-IF-TOOL-ID"),
			creationTime: i("CREATION-TIME"),
			repositoryId: i("REPOSITORY-ID"),
			comment: i("COMMENT")
		},
		objectTypes: l,
		relationTypes: u,
		objects: f,
		relations: p,
		hierarchy: m,
		unsupported: o
	};
}
// src/reqif/mapping.ts
var Ce = {
	statement: [
		"reqif.text",
		"rms.statement",
		"primary text",
		"object text",
		"requirement text",
		"requirement",
		"text",
		"description"
	],
	criteria: [
		"rms.acceptancecriteria",
		"acceptance criteria",
		"verification criteria",
		"fit criterion"
	],
	rationale: [
		"rms.rationale",
		"rationale",
		"justification"
	],
	category: [
		"rms.category",
		"category",
		"requirement type"
	],
	comment: [
		"rms.comment",
		"comment",
		"comments",
		"notes"
	],
	sourceUrl: ["rms.sourceurl", "source url"],
	appliesTo: ["rms.appliesto"],
	foreignId: [
		"reqif.foreignid",
		"id",
		"absolute number",
		"object identifier",
		"global id",
		"item id"
	],
	name: [
		"reqif.name",
		"name",
		"title",
		"object heading",
		"heading",
		"reqif.chaptername"
	],
	recordRevision: ["rms.recordrevision"],
	rev: ["rms.revision"],
	state: ["rms.lifecyclestatus"],
	verificationStatus: ["rms.verificationstatus"],
	highestVerifiedLevel: ["rms.highestverifiedlevel"],
	productId: ["rms.product"]
};
function we(e, t, n) {
	let r = {}, i = {}, a = /* @__PURE__ */ new Map(), o = (e, t) => Ce[e]?.indexOf(t) ?? -1;
	for (let s of e.values) {
		let e = s.name.toLowerCase();
		if (e.startsWith("rms.attr.") && !t[e]) {
			a.set(e.slice(se.length), s);
			continue;
		}
		let c = t[e] ?? Object.keys(Ce).find((t) => Ce[t].includes(e));
		if (c === "ignore") continue;
		if (!c || c === "extension") {
			i[s.name] = s.text, e.startsWith("rms.") || n?.add(s.name);
			continue;
		}
		let l = r[c];
		l && !t[e] && o(c, e) > o(c, l.name ?? "") ? i[s.name] = s.text : r[c] = {
			text: s.text,
			xhtml: s.xhtml,
			raw: s.raw,
			name: e
		};
	}
	return {
		fields: r,
		extension: i,
		attrs: a
	};
}
var Te = (e) => Object.fromEntries(Object.entries(e ?? {}).map(([e, t]) => [e.toLowerCase(), String(t)])), Ee = 67108864, De = (() => {
	let e = /* @__PURE__ */ new Uint32Array(256);
	for (let t = 0; t < 256; t++) {
		let n = t;
		for (let e = 0; e < 8; e++) n = n & 1 ? 3988292384 ^ n >>> 1 : n >>> 1;
		e[t] = n >>> 0;
	}
	return e;
})();
function Oe(e) {
	let t = 4294967295;
	for (let n = 0; n < e.length; n++) t = De[(t ^ e[n]) & 255] ^ t >>> 8;
	return (t ^ 4294967295) >>> 0;
}
async function ke(e, t, n = Infinity) {
	let r = t.writable.getWriter(), i = r.write(e).then(() => r.close());
	i.catch(() => void 0);
	let a = [], o = 0, s = t.readable.getReader();
	for (;;) {
		let { done: e, value: t } = await s.read();
		if (e) break;
		if (o += t.length, o > n) throw await s.cancel(), Error("entry is larger than declared");
		a.push(t);
	}
	await i.catch(() => void 0);
	let c = new Uint8Array(o), l = 0;
	for (let e of a) c.set(e, l), l += e.length;
	return c;
}
async function Ae(e) {
	let t = [], n = [], r = 0;
	for (let i of e) {
		let e = new TextEncoder().encode(i.name), a = await ke(i.data, new CompressionStream("deflate-raw")), o = Oe(i.data), s = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(30));
		s.setUint32(0, 67324752, !0), s.setUint16(4, 20, !0), s.setUint16(6, 2048, !0), s.setUint16(8, 8, !0), s.setUint16(10, 0, !0), s.setUint16(12, 33, !0), s.setUint32(14, o, !0), s.setUint32(18, a.length, !0), s.setUint32(22, i.data.length, !0), s.setUint16(26, e.length, !0);
		let c = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(46));
		c.setUint32(0, 33639248, !0), c.setUint16(4, 20, !0), c.setUint16(6, 20, !0), c.setUint16(8, 2048, !0), c.setUint16(10, 8, !0), c.setUint16(12, 0, !0), c.setUint16(14, 33, !0), c.setUint32(16, o, !0), c.setUint32(20, a.length, !0), c.setUint32(24, i.data.length, !0), c.setUint16(28, e.length, !0), c.setUint32(42, r, !0), t.push(new Uint8Array(s.buffer), e, a), n.push(new Uint8Array(c.buffer), e), r += 30 + e.length + a.length;
	}
	let i = n.reduce((e, t) => e + t.length, 0), a = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(22));
	a.setUint32(0, 101010256, !0), a.setUint16(8, e.length, !0), a.setUint16(10, e.length, !0), a.setUint32(12, i, !0), a.setUint32(16, r, !0);
	let o = [
		...t,
		...n,
		new Uint8Array(a.buffer)
	], s = new Uint8Array(o.reduce((e, t) => e + t.length, 0)), c = 0;
	for (let e of o) s.set(e, c), c += e.length;
	return s;
}
var je = (e) => {
	throw new y(422, "invalid_reqif", `Not a readable .reqifz archive: ${e}`);
};
async function Me(e) {
	let t = new DataView(e.buffer, e.byteOffset, e.byteLength), n = -1;
	for (let r = e.length - 22; r >= Math.max(0, e.length - 22 - 65535); r--) if (t.getUint32(r, !0) === 101010256) {
		n = r;
		break;
	}
	if (n < 0) return je("end of central directory not found (truncated?)");
	let r = t.getUint16(n + 10, !0), i = t.getUint32(n + 16, !0), a = /* @__PURE__ */ new Map();
	for (let n = 0; n < r; n++) {
		if (i + 46 > e.length || t.getUint32(i, !0) !== 33639248) return je("damaged central directory");
		let n = t.getUint16(i + 8, !0), r = t.getUint16(i + 10, !0), o = t.getUint32(i + 16, !0), s = t.getUint32(i + 20, !0), c = t.getUint32(i + 24, !0), l = t.getUint16(i + 28, !0), u = t.getUint16(i + 30, !0), d = t.getUint16(i + 32, !0), f = t.getUint32(i + 42, !0), p = new TextDecoder().decode(e.subarray(i + 46, i + 46 + l));
		if (i += 46 + l + u + d, p.endsWith("/")) continue;
		if (n & 1) return je(`${p} is encrypted`);
		if (c > Ee) return je(`${p} declares more than 64 MiB`);
		if (f + 30 > e.length || t.getUint32(f, !0) !== 67324752) return je(`${p} has a damaged header`);
		let m = f + 30 + t.getUint16(f + 26, !0) + t.getUint16(f + 28, !0);
		if (m + s > e.length) return je(`${p} is truncated`);
		let h = e.subarray(m, m + s), g;
		if (r === 0) g = h;
		else if (r === 8) try {
			g = await ke(h, new DecompressionStream("deflate-raw"), Math.max(1, c));
		} catch {
			return je(`${p} is corrupt`);
		}
		else return je(`${p} uses an unsupported compression method`);
		if (g.length !== c || Oe(g) !== o) return je(`${p} is corrupt (checksum mismatch)`);
		a.set(p, g);
	}
	return a;
}
async function Ne(e) {
	let t = await Me(e), n = [], r = [];
	for (let [e, i] of t) if (!e.toLowerCase().endsWith(".reqif")) r.push(e);
	else try {
		n.push({
			name: e,
			xml: new TextDecoder("utf-8", { fatal: !0 }).decode(i)
		});
	} catch {
		throw new y(422, "invalid_reqif", `${e} is not UTF-8`);
	}
	if (!n.length) throw new y(422, "invalid_reqif", "The .reqifz archive contains no .reqif document");
	return {
		documents: n,
		otherEntries: r
	};
}
// src/reqif/exchange.ts
var Pe = 25, Fe = (e) => {
	Number.isInteger(e) && e >= 1 && e <= 100 && (Pe = e);
}, Ie = 33554432, Le = (e) => e.replace(/[-:T]/g, "").slice(0, 14), Re = (e) => [...crypto.getRandomValues(new Uint8Array(e))].map((e) => e.toString(16).padStart(2, "0")).join("").toUpperCase(), ze = (e, t = Pe) => {
	let n = [];
	for (let r = 0; r < e.length; r += t) n.push(e.slice(r, r + t));
	return n;
}, Be = (e, t, n) => {
	throw new y(e, t, n);
};
async function Ve(e, t) {
	let n = t.format ?? "reqifz", r = t.includeTestCases !== !1;
	["reqif", "reqifz"].includes(n) || Be(422, "invalid_format", "Format is reqif or reqifz"), t.reason?.trim() || Be(422, "invalid_input", "A reason (for example who the file is for) is required");
	let i = [], a = [], o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), c;
	for (let n;;) {
		let l = await e("reqif.export", {
			...t.productId ? { productId: t.productId } : {},
			includeTestCases: r,
			...n ? { cursor: n } : {}
		});
		c ??= l.header, i.push(...l.requirements), a.push(...l.testCases);
		for (let e of l.links) o.set(e.id, e);
		for (let [e, t] of l.lastChanged) s.set(e, t);
		if (!l.nextCursor) break;
		n = l.nextCursor;
	}
	if (!c) return Be(422, "empty_export", "No requirements in the selected scope");
	let l = (/* @__PURE__ */ new Date()).toISOString(), u = `RQX-${Le(l)}-${Re(3)}`, d = be({
		workspace: c.workspace,
		exportId: u,
		exportedAt: l,
		comment: t.reason.slice(0, 500),
		title: t.title?.trim() ? t.title.slice(0, 200) : `Plotune RMS ${t.productId ?? c.workspace} requirements`,
		products: c.products,
		requirements: i,
		testCases: a,
		links: [...o.values()],
		relationTypes: c.relationTypes,
		states: c.states,
		lastChanged: s,
		attributeDefinitions: c.attributeDefinitions
	}), f = new TextEncoder().encode(d.xml), p = n === "reqif" ? f : await Ae([{
		name: `${u}.reqif`,
		data: f
	}]), m = x(p), h = Object.fromEntries([...i.map((e) => [`requirement:${e.id}`, e.revision]), ...a.map((e) => [`test_case:${e.id}`, e.revision])]), g = {
		requirements: i.length,
		testCases: a.length,
		relations: d.relations,
		specifications: d.specifications
	}, _ = await e("reqif.export.record", {
		exportId: u,
		format: n,
		exportedAt: l,
		sha256: m,
		productId: t.productId ?? "",
		includeTestCases: r,
		objects: h,
		counts: g,
		reason: t.reason
	});
	return {
		exportId: u,
		fileName: _.fileName,
		mediaType: n === "reqif" ? "application/xml" : "application/zip",
		sha256: m,
		counts: _.counts,
		bytes: p
	};
}
async function He(e, t = "upload.reqif") {
	let n = typeof e == "string" ? new TextEncoder().encode(e) : e;
	(!n.length || n.length > Ie) && Be(413, "too_large", "ReqIF files must be between 1 byte and 32 MiB");
	let r = [], i;
	if (n[0] === 80 && n[1] === 75) {
		let { documents: e, otherEntries: t } = await Ne(n);
		i = e.map((e) => e.xml), t.length && r.push({
			level: "warning",
			code: "attachments_not_imported",
			message: `The archive also contains ${t.length} other file(s) (for example ${t.slice(0, 3).join(", ")}); RMS does not import attachments`
		});
	} else try {
		i = [new TextDecoder("utf-8", { fatal: !0 }).decode(n)];
	} catch {
		return Be(422, "invalid_reqif", "The file is not UTF-8 XML");
	}
	let a = i.map(Se);
	for (let e of a) for (let t of e.unsupported) r.push({
		level: "warning",
		code: "unsupported_content",
		message: t
	});
	let o = a[0].header;
	return {
		name: t.slice(0, 200),
		sha256: x(n),
		header: {
			identifier: o.identifier,
			title: o.title,
			sourceTool: o.sourceTool,
			creationTime: o.creationTime
		},
		objects: a.flatMap((e) => e.objects),
		relations: a.flatMap((e) => e.relations),
		hierarchy: a.flatMap((e) => e.hierarchy),
		issues: r
	};
}
var Ue = () => ({
	new: 0,
	changed: 0,
	unchanged: 0,
	conflict: 0,
	removed: 0,
	skipped: 0,
	invalid: 0
});
async function We(e, t, n) {
	let r = [...t.issues], i = Te(n.mapping), a = {
		mapping: n.mapping ?? {},
		objectTypes: n.objectTypes ?? {},
		productId: n.productId ?? "",
		allowMissingCriteria: n.allowMissingCriteria === !0,
		resolutions: n.resolutions ?? {},
		relationTypes: n.relationTypes ?? {}
	}, o = t.header, s = /* @__PURE__ */ new Set(), c = [];
	for (let e of t.objects) s.has(e.identifier) ? r.push({
		level: "error",
		code: "duplicate_identifier",
		message: `SPEC-OBJECT ${e.identifier} appears twice`,
		identifier: e.identifier
	}) : (s.add(e.identifier), c.push(e));
	let l = /* @__PURE__ */ new Map();
	for (let t of ze(c)) {
		let i = await e("reqif.import.preview", {
			step: "match",
			objects: t,
			mapping: n.mapping ?? {},
			objectTypes: n.objectTypes ?? {}
		});
		for (let e of i.matches) l.set(e.identifier, {
			role: e.role,
			id: e.id
		});
		r.push(...i.issues);
	}
	let u = new Map(c.map((e) => [e.identifier, we(e, i).fields])), d = c.filter((e) => l.get(e.identifier)?.id && u.get(e.identifier).recordRevision).map((e) => [`${l.get(e.identifier).role}:${l.get(e.identifier).id}`, Number(u.get(e.identifier).recordRevision.raw)]), f = await e("reqif.import.begin", {
		header: o,
		productId: n.productId ?? "",
		baseExportId: n.baseExportId ?? "",
		fileRevisions: d
	});
	r.push(...f.issues), !f.baseExportId && [...l.values()].some((e) => e.id) && r.push({
		level: "warning",
		code: "base_export_unknown",
		message: "The RMS export this file came from was not found, so objects and relations removed in the file cannot be detected"
	});
	let p = 0, m = /* @__PURE__ */ new Map(), h = {};
	for (let e of c) {
		let t = l.get(e.identifier);
		m.set(e.identifier, t.id ?? `new:${++p}`);
	}
	let g = /* @__PURE__ */ new Map();
	for (let e of t.hierarchy) g.has(e.object) || g.set(e.object, e.parent);
	let _ = (e) => l.get(e)?.role === "requirement" && !!u.get(e)?.statement?.text.trim(), v = /* @__PURE__ */ new Map();
	for (let e of t.hierarchy) {
		let t = e.parent, n = /* @__PURE__ */ new Set();
		for (; t && !n.has(t) && (n.add(t), !_(t));) t = g.get(t) ?? null;
		t && v.set(e.object, [.../* @__PURE__ */ new Set([...v.get(e.object) ?? [], t])]);
	}
	let y = t.relations.some((e) => e.typeName === oe), b = /* @__PURE__ */ new Map();
	for (let e of t.relations) e.typeName === "rms_parent" && b.set(e.source, [...b.get(e.source) ?? [], e.target]);
	for (let e of c) {
		let t = l.get(e.identifier);
		h[e.identifier] = {
			ref: m.get(e.identifier),
			role: t.role,
			existing: !!t.id,
			...b.has(e.identifier) ? { relationParents: b.get(e.identifier) } : {},
			...v.has(e.identifier) ? { hierarchyParents: v.get(e.identifier) } : {}
		};
	}
	let x = new Map(c.map((e) => [e.identifier, e])), S = [], C = /* @__PURE__ */ new Map(), w = (e) => {
		if (C.get(e.identifier) === 2) return !0;
		if (C.get(e.identifier) === 1) return !1;
		C.set(e.identifier, 1);
		let t = h[e.identifier];
		for (let n of t.relationParents ?? t.hierarchyParents ?? []) {
			let t = x.get(n);
			t && t !== e && !w(t) && r.push({
				level: "error",
				code: "hierarchy_cycle",
				message: `The file's parent structure would make a cycle through ${e.identifier}`
			});
		}
		return C.set(e.identifier, 2), S.push(e), !0;
	};
	for (let e of c) w(e);
	let T = {
		ordered: S,
		meta: h,
		fileIds: [...new Set([...l.values()].map((e) => e.id).filter((e) => !!e))],
		fileHasParentRelations: y,
		relations: t.relations.filter((e) => e.typeName !== oe),
		baseSentAt: f.baseSentAt,
		baseExportId: f.baseExportId,
		workspace: f.workspace,
		allObjects: c
	}, E = Object.fromEntries(m), D = [], O = /* @__PURE__ */ new Set(), k = /* @__PURE__ */ new Set(), A = [], j = [];
	for (let t of ze(S)) {
		let n = new Set(t.flatMap((e) => [...h[e.identifier].relationParents ?? [], ...h[e.identifier].hierarchyParents ?? []])), i = await e("reqif.import.preview", {
			step: "objects",
			objects: t,
			meta: Object.fromEntries(t.map((e) => [e.identifier, h[e.identifier]])),
			refs: Object.fromEntries([...n].filter((e) => E[e]).map((e) => [e, E[e]])),
			fileIds: T.fileIds,
			fileHasParentRelations: y,
			header: o,
			...a
		});
		D.push(...i.items), r.push(...i.issues);
		for (let e of i.unmapped) O.add(e);
		for (let e of i.items) e.status === "new" && e.kind === "requirement" && k.add(e.identifier);
		A.push(t), j.push(i.changes);
	}
	let M = (e) => {
		let t = l.get(e);
		return t && t.role !== "skip" && (t.id || k.has(e)) ? {
			kind: t.role,
			ref: E[e]
		} : void 0;
	}, N = [], P = [], F = [];
	for (let t of ze(T.relations)) {
		let n = Object.fromEntries(t.flatMap((e) => [e.source, e.target]).map((e) => [e, M(e)]).filter(([, e]) => e)), i = Object.values(n).map((e) => e.ref), o = await e("reqif.import.preview", {
			step: "relations",
			relations: t,
			refs: n,
			seenKeys: P.filter((e) => i.some((t) => e.includes(t))),
			...a
		});
		D.push(...o.items), r.push(...o.issues), N.push(...o.fileKeys), P.push(...o.newKeys), F.push(t);
	}
	let I = [...l].filter(([, e]) => e.id && e.role !== "skip").map(([, e]) => `${e.role}:${e.id}`);
	if (f.baseExportId) {
		let t = new Set(I);
		for (let e of f.baseObjects) if (!t.has(e)) {
			let t = e.slice(0, e.indexOf(":")), n = e.slice(e.indexOf(":") + 1);
			D.push({
				kind: t,
				status: "removed",
				identifier: _e(f.workspace, t, n),
				id: n,
				message: "Removed in the file; RMS keeps it. Retire it in RMS if that is intended"
			});
		}
		let n = [...new Set(I.map((e) => e.slice(e.indexOf(":") + 1)))];
		for (let t of ze(n, 100)) D.push(...(await e("reqif.import.preview", {
			step: "removed",
			ids: t,
			present: n,
			fileKeys: N.filter((e) => t.some((t) => e.includes(t))),
			sentAt: f.baseSentAt
		})).items);
	}
	let ee = Ue();
	for (let e of D) ee[e.status]++;
	ee.invalid && r.push({
		level: "error",
		code: "invalid_objects",
		message: `${ee.invalid} object(s) cannot be imported as they are; see the items marked invalid`
	}), ee.conflict && r.push({
		level: "error",
		code: "unresolved_conflicts",
		message: `${ee.conflict} requirement(s) changed both in RMS and in the file; choose keep RMS or take the file for each`
	}), O.size && r.push({
		level: "warning",
		code: "unmapped_attributes",
		message: `Kept as extension data on each requirement: ${[...O].slice(0, 20).join(", ")}`
	});
	let te = j.reduce((e, t) => e + t, 0) + P.length;
	return {
		run: {
			preview: {
				ok: !r.some((e) => e.level === "error"),
				workspaceRevision: f.workspaceRevision,
				file: {
					name: t.name,
					sha256: t.sha256,
					title: o.title,
					sourceTool: o.sourceTool,
					identifier: o.identifier,
					created: o.creationTime
				},
				baseExportId: f.baseExportId,
				counts: ee,
				items: D.slice(0, 5e3),
				issues: r,
				unmappedAttributes: [...O],
				changes: te
			},
			chunks: {
				objects: j,
				relations: []
			},
			skipped: D.filter((e) => e.status === "skipped"),
			present: I,
			objectsToCommit: A,
			plan: T
		},
		items: D,
		issues: r,
		unmapped: O,
		newCreated: k
	};
}
async function Ge(e, t, n) {
	return (await We(e, t, n)).run.preview;
}
async function Ke(e, t, n, r) {
	r.reason?.trim() || Be(422, "invalid_input", "A reason is required"), Number.isInteger(r.expectedWorkspaceRevision) || Be(422, "invalid_input", "Pass expectedWorkspaceRevision from the preview you reviewed"), await e("reqif.import.commit", { step: "check" });
	let { run: i, newCreated: a, items: o } = await We(e, t, n), s = i.preview;
	if (s.workspaceRevision !== r.expectedWorkspaceRevision) return Be(409, "conflict", "RMS changed since the preview; preview again");
	if (!s.ok) return Be(422, "import_blocked", s.issues.filter((e) => e.level === "error").map((e) => e.message).join("; "));
	if (!s.changes) return {
		...s,
		committed: 0,
		importId: null
	};
	let c = `RQI-${Le((/* @__PURE__ */ new Date()).toISOString())}-${Re(3)}`, l = i.plan;
	Te(n.mapping);
	let u = {
		mapping: n.mapping ?? {},
		objectTypes: n.objectTypes ?? {},
		productId: n.productId ?? "",
		allowMissingCriteria: n.allowMissingCriteria === !0,
		resolutions: n.resolutions ?? {},
		relationTypes: n.relationTypes ?? {},
		reason: r.reason,
		importId: c,
		fileName: t.name
	}, d = s.workspaceRevision, f = 0, p = {}, m = [];
	new Map(l.allObjects.map((e) => [e.identifier, l.meta[e.identifier]]));
	for (let e of l.allObjects) p[e.identifier] = l.meta[e.identifier].ref;
	for (let [n, r] of i.objectsToCommit.entries()) {
		if (!i.chunks.objects[n]) continue;
		let a = new Set(r.flatMap((e) => [...l.meta[e.identifier].relationParents ?? [], ...l.meta[e.identifier].hierarchyParents ?? []])), o = await e("reqif.import.commit", {
			step: "objects",
			objects: r,
			meta: Object.fromEntries(r.map((e) => [e.identifier, {
				...l.meta[e.identifier],
				ref: p[e.identifier]
			}])),
			refs: Object.fromEntries([...a].filter((e) => p[e]).map((e) => [e, p[e]])),
			fileIds: l.fileIds,
			fileHasParentRelations: l.fileHasParentRelations,
			header: t.header,
			expectedWorkspaceRevision: d,
			...u
		});
		d = o.workspaceRevision, f += o.committed;
		for (let e of o.created) {
			m.push(e);
			for (let t of r) p[t.identifier] === e.ref && (p[t.identifier] = e.id);
		}
	}
	let h = (e) => {
		let t = l.meta[e];
		return t && t.role !== "skip" && (t.existing || a.has(e)) ? {
			kind: t.role,
			ref: p[e]
		} : void 0;
	}, g = [];
	for (let t of ze(l.relations)) {
		let n = await e("reqif.import.commit", {
			step: "relations",
			relations: t,
			refs: Object.fromEntries(t.flatMap((e) => [e.source, e.target]).map((e) => [e, h(e)]).filter(([, e]) => e)),
			seenKeys: g,
			expectedWorkspaceRevision: d,
			...u
		});
		d = n.workspaceRevision, f += n.committed, g.push(...n.newKeys);
	}
	let _ = await e("reqif.import.commit", {
		step: "record",
		header: t.header,
		file: { sha256: t.sha256 },
		counts: s.counts,
		baseExportId: s.baseExportId ?? "",
		expectedWorkspaceRevision: d,
		reason: r.reason,
		importId: c,
		fileName: t.name,
		skipped: i.skipped.slice(0, 2e3).map((e) => ({
			identifier: e.identifier,
			kind: e.kind,
			title: e.title,
			reason: e.message,
			values: l.allObjects.find((t) => t.identifier === e.identifier)?.values.map((e) => ({
				name: e.name,
				text: e.text.slice(0, 4e3)
			}))
		})),
		unappliedRelations: t.relations.filter((e) => i.skipped.some((t) => t.identifier === e.identifier)).slice(0, 5e3).map((e) => ({
			identifier: e.identifier,
			typeName: e.typeName,
			source: e.source,
			target: e.target
		})),
		removed: s.items.filter((e) => e.status === "removed").slice(0, 5e3).map((e) => ({
			kind: e.kind,
			id: e.id,
			title: e.title
		}))
	});
	return {
		...s,
		committed: f + _.committed,
		importId: c,
		created: m,
		workspaceRevision: _.workspaceRevision
	};
}
// client/src/api.ts
var qe = class extends Error {
	code;
	status;
	constructor(e, t, n) {
		super(e), this.code = t, this.status = n, this.name = "ApiError";
	}
}, Je = [
	"claim_expired",
	"claim_revoked",
	"invalid_token"
];
function Ye(e, t, n = () => !0, r) {
	async function i(a, o = {}, s = !1) {
		if (!n()) throw new qe("This response belongs to an earlier session.", "session_changed", 0);
		let c = r ? await r.getClaim(s) : e, l = await fetch(r ? r.base + a : a, {
			...o,
			credentials: "omit",
			redirect: "error",
			headers: {
				Authorization: `Bearer ${c}`,
				...o.body ? { "Content-Type": "application/json" } : {}
			}
		});
		if (!n()) throw new qe("This response belongs to an earlier session.", "session_changed", 0);
		let u;
		try {
			u = await l.json();
		} catch {
			throw new qe("The server returned an unexpected response.", void 0, l.status);
		}
		if (!n()) throw new qe("This response belongs to an earlier session.", "session_changed", 0);
		if (!l.ok) {
			if (r && !s && l.status === 401 && Je.includes(u.error?.code ?? "")) return i(a, o, !0);
			throw l.status === 401 && t(), new qe(u.error?.message ?? "The request could not be completed.", u.error?.code, l.status);
		}
		return u.result ?? u;
	}
	return {
		embedded: !!r,
		srcdocFrames: !!r && (r.frames === "srcdoc" || r.frames !== "url" && typeof document < "u" && !document.querySelector("meta[http-equiv=\"Content-Security-Policy\" i]")),
		session: () => i("/api/session").then((e) => (Fe(e.limits?.batch ?? 25), e)),
		command: (e, t = {}) => i("/api/command", {
			method: "POST",
			body: JSON.stringify({
				operation: e,
				input: t
			})
		}),
		diagramFrame: (e, t) => i(`/api/diagram-frame?id=${encodeURIComponent(e)}&revision=${t}`).then((e) => ({
			...e,
			url: r && e.url.startsWith("/") ? r.base + e.url : e.url
		})),
		exchange: (e, t = {}) => i(r ? "/api/command" : "/api/exchange", {
			method: "POST",
			body: JSON.stringify({
				operation: e,
				input: t
			})
		})
	};
}
function z(e) {
	return e instanceof qe && e.code === "session_changed";
}
// client/src/context.ts
var Xe = (0, _.createContext)(null);
function B() {
	let e = (0, _.useContext)(Xe);
	if (!e) throw Error("Workbench context is missing");
	return e;
}
// client/src/contextState.ts
var Ze = [
	"Draft",
	"Active",
	"Retired"
], Qe = (e) => e.state ?? "Draft";
function $e(e) {
	return e === "all" || Ze.includes(String(e)) ? e : "";
}
function et(e, t) {
	return t === "all" ? e : t === "" ? e.filter((e) => Qe(e) !== "Retired") : e.filter((e) => Qe(e) === t);
}
var tt = (e) => e.filter((e) => Qe(e) !== "Retired");
function nt(e) {
	let t = {
		Draft: 0,
		Active: 0,
		Retired: 0,
		inUse: 0,
		all: e.length
	};
	for (let n of e) {
		let e = Qe(n);
		(e === "Draft" || e === "Active" || e === "Retired") && t[e]++;
	}
	return t.inUse = e.filter((e) => Qe(e) !== "Retired").length, t;
}
function rt(e) {
	switch (e) {
		case "Draft": return [{
			to: "Active",
			label: "Activate",
			done: "activated"
		}, {
			to: "Retired",
			label: "Retire",
			done: "retired"
		}];
		case "Active": return [{
			to: "Retired",
			label: "Retire",
			done: "retired"
		}, {
			to: "Draft",
			label: "Back to Draft",
			done: "moved back to Draft"
		}];
		case "Retired": return [{
			to: "Draft",
			label: "Restore to Draft",
			done: "restored to Draft"
		}, {
			to: "Active",
			label: "Restore to Active",
			done: "restored to Active"
		}];
		default: return [];
	}
}
// client/src/model.ts
var it = {
	reader: "Viewer",
	editor: "Requirements engineer",
	approver: "Product owner",
	admin: "Administrator"
}, at = (e) => [
	"editor",
	"approver",
	"admin"
].includes(e?.role ?? ""), ot = (e) => ["approver", "admin"].includes(e?.role ?? ""), st = "Viewers can read but not change records. Ask an administrator for editor access.", ct = [
	"Draft",
	"In Review",
	"Approved",
	"Rejected",
	"Superseded",
	"Retired"
], lt = [
	"text",
	"number",
	"integer",
	"boolean",
	"enum",
	"date",
	"quantity",
	"reference"
], ut = {
	id: "workspace",
	revision: 0,
	elementTypes: [],
	recordAttributes: {
		requirement: [],
		test_case: [],
		actor: [],
		use_case: []
	},
	relationRules: []
}, dt = {
	id: "workspace",
	revision: 0,
	approvals: {
		selfApproval: "allowed",
		agentDecisions: "allowed",
		decisionReason: "prefilled"
	},
	verification: { newTestCaseStatus: "Active" }
}, ft = {
	products: [],
	requirements: [],
	links: [],
	testCases: [],
	executions: [],
	actors: [],
	useCases: [],
	baselines: [],
	settings: dt,
	process: {
		states: ct,
		transitions: []
	},
	verification: [],
	relationTypes: [],
	elements: [],
	metamodel: ut,
	violations: []
}, pt = (e, t) => e.metamodel.elementTypes.find((e) => e.id === t)?.label ?? t, mt = [
	"family",
	"product",
	"component",
	"edition"
], ht = (e) => Number(e?.rev ?? 1), gt = {
	human: "Human",
	external_system: "External system",
	device: "Device",
	software_agent: "Software agent"
}, _t = {
	coverage_not_attested: "Coverage not attested",
	coverage_partial: "Coverage attested as partial",
	test_case_not_active: "Test case not active",
	no_executed_run: "No run yet",
	no_run_at_target_level: "No run at target level",
	latest_run_failed: "Latest run failed",
	latest_run_blocked: "Latest run blocked",
	latest_pass_incomplete: "Latest pass lacks complete coverage or evidence",
	target_level_missing: "Target level not set",
	no_mandatory_test_cases: "No mandatory test case for this revision"
}, vt = (e) => _t[e] ?? e.replaceAll("_", " ");
function yt(e) {
	let t = /^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)#(\d+)$/.exec(e);
	if (!t) return null;
	let [, n, r, i] = t;
	return {
		url: `https://github.com/${n}/${r}/issues/${i}`,
		label: `GitHub ${n}/${r}#${i}`
	};
}
var bt = (e) => Array.isArray(e) ? e : e?.items ?? [];
async function xt(e, t) {
	try {
		return await e();
	} catch {
		return t;
	}
}
function St(e, t) {
	let n = new Set(t.map((e) => e.id)), r = 0;
	for (let t of e) n.has(t.testCaseId) && r++;
	return r;
}
var Ct = 1e5;
async function wt(e, t, n = {}, r = Ct) {
	let i = [], a, o = 100;
	for (;;) try {
		let s = await e.command(t, {
			...n,
			limit: o,
			...a ? { cursor: a } : {}
		});
		if (i.push(...bt(s)), !s.nextCursor) return i;
		if (i.length >= r) throw new qe("This list is larger than the browser can load. Narrow the view (pick a product) or use the API or an export for the full list.", "list_too_large", 0);
		a = s.nextCursor;
	} catch (e) {
		if (e instanceof qe && e.code === "page_too_large" && o > 1) {
			o = Math.max(1, Math.floor(o / 2));
			continue;
		}
		throw e;
	}
}
var Tt = {
	requirements: "requirements.list",
	links: "traceability.list",
	testCases: "test_cases.list",
	executions: "test_executions.list",
	actors: "actors.list",
	useCases: "use_cases.list",
	baselines: "baselines.list",
	elements: "elements.list"
};
async function Et(e) {
	let [t, n, r, i, a] = await Promise.all([
		wt(e, "products.list"),
		e.command("processes.get"),
		xt(async () => bt((await e.command("traceability.types")).types), []),
		e.command("metamodel.get"),
		xt(() => e.command("settings.get"), dt)
	]);
	return {
		products: t,
		process: n,
		relationTypes: r,
		metamodel: {
			...ut,
			...i.metamodel ?? {}
		},
		violations: i.violations ?? [],
		settings: a
	};
}
async function Dt(e, t) {
	return t === "verification" ? xt(() => wt(e, "verification.summary"), []) : wt(e, Tt[t]);
}
async function Ot(e, t, n) {
	return wt(e, "traceability.list", {
		id: n,
		kind: t
	});
}
var kt = (e, t) => e.some((e) => e.id === t.id) ? e.map((e) => e.id === t.id ? {
	...e,
	...t
} : e) : [...e, t], At = {
	"requirements.create": "requirements",
	"requirements.revise": "requirements",
	"requirements.transition": "requirements",
	"hierarchy.set": "requirements",
	"test_cases.create": "testCases",
	"test_cases.update": "testCases",
	"test_cases.setStatus": "testCases",
	"test_executions.create": "executions",
	"traceability.add": "links",
	"verification.attest": "links",
	"actors.create": "actors",
	"actors.update": "actors",
	"use_cases.create": "useCases",
	"use_cases.update": "useCases",
	"elements.create": "elements",
	"elements.update": "elements"
}, jt = (e, t) => `${e}:${t}`, Mt = {
	requirement: "Requirement",
	test_case: "Test case",
	actor: "Actor",
	use_case: "Use case",
	product: "Product",
	family: "Family",
	component: "Component",
	edition: "Edition",
	project: "Project",
	release: "Release",
	baseline: "Baseline",
	external: "Document",
	process: "Process",
	github: "GitHub",
	element: "Element"
};
function Nt(e, t, n) {
	return e === "depends_on" ? t ? "Depends on" : "Needed by" : e === "verifies" ? t ? "Verifies" : "Verified by" : n?.get(e) ?? "Related to";
}
function Pt(e) {
	let t = new Map(e.requirements.map((e) => [e.id, e])), n = /* @__PURE__ */ new Map();
	for (let t of e.requirements) for (let e of t.parents ?? []) n.has(e) || n.set(e, []), n.get(e).push(t);
	let r = /* @__PURE__ */ new Map();
	for (let t of e.links) {
		let e = jt(t.fromKind ?? "requirement", t.from), n = jt(t.toKind ?? "requirement", t.to);
		for (let i of [e, n]) r.has(i) || r.set(i, []), r.get(i).push(t);
	}
	let i = /* @__PURE__ */ new Map();
	for (let t of e.testCases) i.has(t.requirementId) || i.set(t.requirementId, []), i.get(t.requirementId).push(t);
	let a = /* @__PURE__ */ new Map();
	for (let t of e.executions) a.has(t.testCaseId) || a.set(t.testCaseId, []), a.get(t.testCaseId).push(t);
	for (let e of a.values()) e.sort((e, t) => String(t.recordedAt).localeCompare(String(e.recordedAt)));
	let o = new Map(e.products.map((e) => [e.id, e])), s = new Map(e.verification.map((e) => [e.requirementId, e])), c = new Map(e.relationTypes.map((e) => [e.id, e.label])), l = /* @__PURE__ */ new Map();
	for (let [t, n] of [
		["requirement", e.requirements],
		["test_case", e.testCases],
		["actor", e.actors],
		["use_case", e.useCases],
		["baseline", e.baselines],
		["element", e.elements]
	]) for (let e of n) l.set(jt(t, e.id), e);
	for (let t of e.products) l.set(jt(t.kind, t.id), t);
	return {
		reqById: t,
		product: o,
		records: l,
		childrenOf: (e) => n.get(e) ?? [],
		linksOf: (e, t) => r.get(jt(e, t)) ?? [],
		casesOf: (e) => i.get(e) ?? [],
		latestRun: (e) => a.get(e)?.[0],
		runsOf: (e) => a.get(e) ?? [],
		isStale: (e) => {
			let n = t.get(e.requirementId);
			return !!n && Number(e.requirementRev ?? 1) !== ht(n);
		},
		verificationOf: (e) => s.get(e),
		relation: (e, t) => Nt(e, t, c),
		title: (e, t) => {
			let n = l.get(jt(e, t));
			return n?.statement ?? n?.name ?? "";
		}
	};
}
function Ft(e, t) {
	let n = e.products.find((e) => e.id === t);
	return n && ["project", "release"].includes(n.kind) ? e.products.find((e) => e.id === n.productId) : n;
}
function It(e, t, n) {
	let r = Ft(e, t);
	if (!r) return !0;
	if (r.kind === "family") {
		let t = new Set(e.products.filter((e) => e.parentId === r.id).map((e) => e.id));
		return t.has(n.productId) || (n.appliesTo ?? []).some((e) => t.has(e));
	}
	return n.productId === r.id || (n.appliesTo ?? []).includes(r.id);
}
function Lt(e, t, n) {
	return [...new Set((e.transitions ?? []).filter((e) => e.from === t && e.roles?.includes(n)).map((e) => String(e.to)))];
}
var Rt = (e) => ({
	"In Review": "Submit for review",
	Approved: "Approve",
	Rejected: "Reject",
	Draft: "Send back to draft",
	Superseded: "Mark superseded",
	Retired: "Retire"
})[e] ?? `Move to ${e}`, zt = (e) => e === "Rejected" || e === "Draft", Bt = (e) => e === "Rejected" ? "Why is this rejected? What would make it acceptable?" : e === "Draft" ? "What needs to be revised before it can be resubmitted?" : "", Vt = (e) => zt(e) ? "" : {
	"In Review": "Ready for product owner review",
	Approved: "Reviewed and approved",
	Superseded: "Superseded by a newer requirement",
	Retired: "No longer required"
}[e] ?? `Moved to ${e}`;
function Ht(e) {
	if (!e) return "";
	let t = Date.parse(e);
	if (Number.isNaN(t)) return e;
	let n = Math.round((Date.now() - t) / 1e3);
	if (n < 60) return "just now";
	let r = [
		[60, "minute"],
		[3600, "hour"],
		[86400, "day"],
		[604800, "week"],
		[2629800, "month"],
		[31557600, "year"]
	], i = r[0];
	for (let e of r) n >= e[0] && (i = e);
	let a = Math.floor(n / i[0]);
	return `${a} ${i[1]}${a === 1 ? "" : "s"} ago`;
}
function V(e, t) {
	return e instanceof qe ? e.status === 401 ? "Your sign-in is no longer valid. Sign in again to continue." : e.status === 403 && e.code === "forbidden" ? `${(e.message || "Your role cannot do this").replace(/\.$/, "")}. Ask a workspace admin if you need this.` : e.status === 409 && (e.code === "conflict" || e.code?.startsWith("stale")) ? "Someone else changed this record after you opened it, so nothing was saved. Your text is still here: reload the record to see their change, then apply yours again." : e.status === 429 ? "Too many requests right now. Wait a moment and try again." : e.status >= 500 ? "RMS could not complete this right now. Try again in a moment; if it keeps happening, tell your administrator." : e.message || t : e instanceof TypeError && /fetch|network|load failed/i.test(e.message) ? "RMS could not be reached. Check your connection (or that the RMS server is running) and try again." : e instanceof Error ? e.message : t;
}
// node_modules/react/cjs/react-jsx-runtime.production.js
var H = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
	function r(e, n, r) {
		var i = null;
		if (r !== void 0 && (i = "" + r), n.key !== void 0 && (i = "" + n.key), "key" in n) for (var a in r = {}, n) a !== "key" && (r[a] = n[a]);
		else r = n;
		return n = r.ref, {
			$$typeof: t,
			type: e,
			key: i,
			ref: n === void 0 ? null : n,
			props: r
		};
	}
	e.Fragment = n, e.jsx = r, e.jsxs = r;
})), U = (/* @__PURE__ */ o(((e, t) => {
	t.exports = H();
})))();
function Ut() {
	let e = (0, _.useRef)(null);
	if (e.current === null && typeof document < "u") {
		let t = document.activeElement;
		e.current = t && t !== document.body && t.closest("a, button") ? t : document.querySelector(".spec-main a[aria-current=\"true\"]");
	}
	(0, _.useEffect)(() => () => {
		let t = e.current, n = document.activeElement;
		t && t.isConnected && (!n || n === document.body) && t.focus();
	}, []);
}
var Wt = () => !!document.querySelector("dialog[open], .palette");
function W({ state: e }) {
	return /* @__PURE__ */ (0, U.jsx)("span", {
		className: "pill",
		"data-state": e,
		children: e
	});
}
function Gt({ result: e }) {
	return e ? /* @__PURE__ */ (0, U.jsx)("span", {
		className: "pill",
		"data-result": e,
		children: e === "NOT VERIFIED" ? "Not verified" : e === "PASS" ? "Pass" : e === "FAIL" ? "Fail" : e === "BLOCKED" ? "Blocked" : e
	}) : /* @__PURE__ */ (0, U.jsx)("span", {
		className: "pill",
		"data-result": "none",
		children: "No run yet"
	});
}
var Kt = (0, _.createContext)(() => void 0), qt = () => (0, _.useContext)(Kt);
function Jt({ children: e }) {
	let [t, n] = (0, _.useState)([]), r = (0, _.useMemo)(() => (e, t = "info") => {
		let r = Date.now() + Math.random();
		n((n) => [...n.slice(-2), {
			id: r,
			text: e,
			tone: t,
			at: Date.now()
		}]), window.setTimeout(() => n((e) => e.filter((e) => e.id !== r)), t === "error" ? 8e3 : 4e3);
	}, []);
	return (0, _.useEffect)(() => {
		let e = () => n((e) => e.filter((e) => Date.now() - e.at < 1e3));
		return window.addEventListener("hashchange", e), () => window.removeEventListener("hashchange", e);
	}, []), /* @__PURE__ */ (0, U.jsxs)(Kt.Provider, {
		value: r,
		children: [e, /* @__PURE__ */ (0, U.jsx)("div", {
			className: "toasts",
			role: "status",
			"aria-live": "polite",
			children: t.map((e) => /* @__PURE__ */ (0, U.jsxs)("div", {
				className: "toast",
				"data-tone": e.tone,
				children: [/* @__PURE__ */ (0, U.jsx)("span", { children: e.text }), /* @__PURE__ */ (0, U.jsx)("button", {
					type: "button",
					className: "toast-close",
					"aria-label": "Dismiss",
					onClick: () => n((t) => t.filter((t) => t.id !== e.id)),
					children: "×"
				})]
			}, e.id))
		})]
	});
}
function G({ children: e, onClick: t, disabledReason: n, className: r, title: i, busy: a }) {
	let o = qt();
	return /* @__PURE__ */ (0, U.jsxs)("button", {
		type: "button",
		className: r,
		"aria-disabled": n ? !0 : void 0,
		title: n || i,
		disabled: a,
		onClick: () => n ? o(n) : t(),
		children: [
			n && /* @__PURE__ */ (0, U.jsxs)("svg", {
				className: "lock",
				viewBox: "0 0 24 24",
				width: "12",
				height: "12",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, U.jsx)("rect", {
					x: "5",
					y: "11",
					width: "14",
					height: "10",
					rx: "2",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2"
				}), /* @__PURE__ */ (0, U.jsx)("path", {
					d: "M8 11V8a4 4 0 0 1 8 0v3",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2"
				})]
			}),
			e,
			n && /* @__PURE__ */ (0, U.jsxs)("span", {
				className: "visually-hidden",
				children: [". Unavailable: ", n]
			})
		]
	});
}
function Yt({ label: e, name: t, button: n, children: r, className: i = "" }) {
	let [a, o] = (0, _.useState)(!1), s = (0, _.useRef)(null), c = () => [...s.current?.querySelectorAll(".menu-pop [role^=menuitem]") ?? []];
	(0, _.useEffect)(() => {
		if (!a) return;
		(c().find((e) => e.getAttribute("aria-checked") === "true") ?? c()[0])?.focus();
		let e = (e) => {
			s.current?.contains(e.target) || o(!1);
		};
		return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
	}, [a]);
	let l = () => {
		o(!1), s.current?.querySelector(".menu-button")?.focus();
	};
	return /* @__PURE__ */ (0, U.jsxs)("div", {
		className: `menu ${i}`.trim(),
		ref: s,
		onKeyDown: (e) => {
			if (e.key === "Escape" && a) {
				e.stopPropagation(), l();
				return;
			}
			if (!a || e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
			e.preventDefault();
			let t = c();
			t[(t.indexOf(document.activeElement) + (e.key === "ArrowDown" ? 1 : t.length - 1)) % t.length]?.focus();
		},
		children: [/* @__PURE__ */ (0, U.jsxs)("button", {
			type: "button",
			className: "menu-button",
			"aria-haspopup": "menu",
			"aria-expanded": a,
			"aria-label": `${e}: ${t}`,
			title: `${e}: ${t}`,
			onClick: () => o((e) => !e),
			children: [n, /* @__PURE__ */ (0, U.jsx)("svg", {
				className: "menu-caret",
				viewBox: "0 0 24 24",
				width: "14",
				height: "14",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, U.jsx)("path", { d: "m6 9 6 6 6-6" })
			})]
		}), a && /* @__PURE__ */ (0, U.jsx)("div", {
			className: "menu-pop",
			role: "menu",
			"aria-label": e,
			children: r(l)
		})]
	});
}
function Xt({ title: e, children: t, footer: n, onClose: r, wide: i }) {
	let a = (0, _.useRef)(null), o = (0, _.useId)();
	return (0, _.useEffect)(() => {
		let e = a.current;
		if (e) return e.open || e.showModal(), e.querySelector("[autofocus],input:not([type=checkbox]):not([readonly]),textarea,select")?.focus(), () => {
			e.open && e.close();
		};
	}, []), /* @__PURE__ */ (0, U.jsxs)("dialog", {
		ref: a,
		className: `dialog${i ? " wide" : ""}`,
		"aria-labelledby": o,
		onCancel: (e) => {
			e.preventDefault(), r();
		},
		children: [
			/* @__PURE__ */ (0, U.jsxs)("header", { children: [/* @__PURE__ */ (0, U.jsx)("h2", {
				id: o,
				children: e
			}), /* @__PURE__ */ (0, U.jsx)("button", {
				type: "button",
				className: "icon",
				"aria-label": "Close",
				onClick: r,
				children: "×"
			})] }),
			/* @__PURE__ */ (0, U.jsx)("div", {
				className: "dialog-body",
				children: t
			}),
			n && /* @__PURE__ */ (0, U.jsx)("footer", { children: n })
		]
	});
}
function K({ label: e, hint: t, children: n }) {
	return /* @__PURE__ */ (0, U.jsxs)("label", {
		className: "field",
		children: [
			/* @__PURE__ */ (0, U.jsx)("span", { children: e }),
			n,
			t && /* @__PURE__ */ (0, U.jsx)("small", { children: t })
		]
	});
}
function Zt({ options: e, value: t, onChange: n, multiple: r, placeholder: i, label: a, exclude: o = [] }) {
	let [s, c] = (0, _.useState)(""), [l, u] = (0, _.useState)(!1), [d, f] = (0, _.useState)(0), p = (0, _.useId)(), m = new Set(t.map((e) => `${e.kind}:${e.id}`)), h = new Set(o), g = s.trim().toLowerCase(), v = e.filter((e) => !m.has(`${e.kind}:${e.id}`) && !h.has(`${e.kind}:${e.id}`) && (!g || `${e.id} ${e.title} ${e.meta ?? ""}`.toLowerCase().includes(g))).slice(0, 30), y = (e) => {
		n(r ? [...t, e] : [e]), c(""), f(0), u(!1);
	};
	return /* @__PURE__ */ (0, U.jsxs)("div", {
		className: "picker",
		children: [
			t.length > 0 && /* @__PURE__ */ (0, U.jsx)("ul", {
				className: "chips",
				"aria-label": `Selected ${a}`,
				children: t.map((e) => /* @__PURE__ */ (0, U.jsxs)("li", {
					className: "chip",
					title: e.title,
					children: [
						/* @__PURE__ */ (0, U.jsx)("span", {
							className: "mono",
							children: e.id
						}),
						/* @__PURE__ */ (0, U.jsx)("span", {
							className: "chip-title",
							children: e.title
						}),
						/* @__PURE__ */ (0, U.jsx)("button", {
							type: "button",
							"aria-label": `Remove ${e.id}`,
							onClick: () => n(t.filter((t) => t.kind !== e.kind || t.id !== e.id)),
							children: "×"
						})
					]
				}, `${e.kind}:${e.id}`))
			}),
			(r || t.length === 0) && /* @__PURE__ */ (0, U.jsx)("input", {
				role: "combobox",
				"aria-label": a,
				"aria-expanded": l,
				"aria-controls": p,
				"aria-autocomplete": "list",
				"aria-activedescendant": l && v[d] ? `${p}-${d}` : void 0,
				placeholder: i ?? "Search by ID or text…",
				value: s,
				onChange: (e) => {
					c(e.currentTarget.value), u(!0), f(0);
				},
				onFocus: () => u(!0),
				onClick: () => u(!0),
				onBlur: () => window.setTimeout(() => u(!1), 150),
				onKeyDown: (e) => {
					e.key === "ArrowDown" ? (e.preventDefault(), u(!0), f((e) => Math.min(v.length - 1, e + 1))) : e.key === "ArrowUp" ? (e.preventDefault(), f((e) => Math.max(0, e - 1))) : e.key === "Enter" && l && v[d] ? (e.preventDefault(), y(v[d])) : e.key === "Escape" && l ? (e.stopPropagation(), e.preventDefault(), u(!1)) : e.key === "Backspace" && !s && t.length && n(t.slice(0, -1));
				}
			}),
			l && (r || t.length === 0) && /* @__PURE__ */ (0, U.jsx)("ul", {
				className: "picker-list",
				role: "listbox",
				id: p,
				children: v.length ? v.map((e, t) => /* @__PURE__ */ (0, U.jsx)("li", {
					id: `${p}-${t}`,
					role: "option",
					"aria-selected": t === d,
					onMouseDown: (t) => {
						t.preventDefault(), y(e);
					},
					onMouseEnter: () => f(t),
					children: e.typeLabel ? /* @__PURE__ */ (0, U.jsxs)("span", {
						className: "picker-label",
						children: [
							`${e.typeLabel} · `,
							/* @__PURE__ */ (0, U.jsx)("span", {
								className: "mono",
								children: e.id
							}),
							` · ${e.title}`
						]
					}) : /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [
						/* @__PURE__ */ (0, U.jsx)("span", {
							className: "mono",
							children: e.id
						}),
						/* @__PURE__ */ (0, U.jsx)("span", {
							className: "picker-title",
							children: e.title
						}),
						e.meta && /* @__PURE__ */ (0, U.jsx)("small", { children: e.meta })
					] })
				}, `${e.kind}:${e.id}`)) : /* @__PURE__ */ (0, U.jsx)("li", {
					className: "picker-empty",
					children: "No matching records"
				})
			})
		]
	});
}
function Qt({ title: e, children: t, action: n }) {
	return /* @__PURE__ */ (0, U.jsxs)("div", {
		className: "empty",
		children: [
			/* @__PURE__ */ (0, U.jsx)("h2", { children: e }),
			t && /* @__PURE__ */ (0, U.jsx)("p", { children: t }),
			n
		]
	});
}
function $t({ children: e }) {
	return /* @__PURE__ */ (0, U.jsxs)("details", {
		className: "explain",
		children: [/* @__PURE__ */ (0, U.jsx)("summary", { children: "How is this calculated?" }), /* @__PURE__ */ (0, U.jsx)("div", { children: e })]
	});
}
function en({ verification: e }) {
	return e ? e.status === "Verified" ? /* @__PURE__ */ (0, U.jsx)("span", {
		className: "pill",
		"data-tone": "good",
		children: e.highestVerifiedLevel ? `Verified ${e.highestVerifiedLevel}` : "Verified"
	}) : e.status === "Failed" ? /* @__PURE__ */ (0, U.jsx)("span", {
		className: "pill",
		"data-tone": "bad",
		children: "Failed"
	}) : /* @__PURE__ */ (0, U.jsx)("span", {
		className: "pill",
		children: "Not verified"
	}) : null;
}
function tn({ id: e }) {
	let t = yt(e);
	return t ? /* @__PURE__ */ (0, U.jsxs)("a", {
		className: "mono",
		href: t.url,
		target: "_blank",
		rel: "noreferrer",
		children: [t.label, " ↗"]
	}) : /* @__PURE__ */ (0, U.jsx)("span", {
		className: "mono",
		children: e
	});
}
function nn({ text: e }) {
	let [t, n] = (0, _.useState)(!1);
	if (!e) return null;
	let r = e.length > 140, i = r && !t ? `${e.slice(0, 140).trimEnd()}…` : e;
	return /* @__PURE__ */ (0, U.jsxs)("span", {
		className: "note-line muted small",
		children: [i, r && /* @__PURE__ */ (0, U.jsx)("button", {
			type: "button",
			className: "link small",
			"aria-expanded": t,
			onClick: () => n((e) => !e),
			children: t ? "less" : "more"
		})]
	});
}
// client/src/attributes.tsx
function rn(e, t = {}) {
	let n = {};
	for (let r of e) {
		let e = t[r.key];
		e == null ? n[r.key] = r.multi ? [] : "" : r.multi ? n[r.key] = Array.isArray(e) ? e.map(String) : [] : r.type === "boolean" ? n[r.key] = e ? "true" : "false" : r.type === "quantity" ? n[r.key] = String(e.value ?? "") : n[r.key] = String(e);
	}
	return n;
}
function an(e, t) {
	if (e.multi) {
		let e = Array.isArray(t) ? t : [];
		return { value: e.length ? e : void 0 };
	}
	let n = typeof t == "string" ? t : "";
	if (!n.trim()) return {};
	switch (e.type) {
		case "text": return n.length > (e.maxLength ?? 2e3) ? { error: `Use at most ${e.maxLength ?? 2e3} characters.` } : { value: n };
		case "number":
		case "integer":
		case "quantity": {
			let t = Number(n);
			return Number.isFinite(t) ? e.type === "integer" && !Number.isInteger(t) ? { error: "Enter a whole number." } : e.min !== void 0 && t < e.min ? { error: `Must be at least ${e.min}.` } : e.max !== void 0 && t > e.max ? { error: `Must be at most ${e.max}.` } : { value: e.type === "quantity" ? {
				value: t,
				unit: e.unit
			} : t } : { error: "Enter a number." };
		}
		case "boolean": return { value: n === "true" };
		case "enum": return (e.options ?? []).includes(n) ? { value: n } : { error: "Choose one of the options." };
		case "date": return /^\d{4}-\d{2}-\d{2}$/.test(n) ? { value: n } : { error: "Use a date." };
		case "reference": return { value: n };
	}
}
function on(e, t, n) {
	let r = {}, i = {};
	for (let a of e) {
		let { value: e, error: o } = an(a, n[a.key]);
		o ? i[a.key] = o : e === void 0 ? a.required ? i[a.key] = "Required." : t[a.key] !== void 0 && (r[a.key] = null) : JSON.stringify(e) !== JSON.stringify(t[a.key]) && (r[a.key] = e);
	}
	return {
		patch: r,
		errors: i
	};
}
function sn(e, t, n) {
	return n ? e.multi ? Array.isArray(t) && t.includes(n) : e.type === "quantity" ? !!t && String(t.value) === n : t != null && String(t) === n : !0;
}
function cn(e, t) {
	if (t == null || t === "") return "";
	if (e.type === "boolean") return t ? "Yes" : "No";
	if (e.type === "quantity") {
		let e = t;
		return `${e.value} ${e.unit}`;
	}
	return Array.isArray(t) ? t.join(", ") : String(t);
}
var ln = {
	requirement: "requirements",
	test_case: "verification",
	actor: "library",
	use_case: "library",
	element: "elements"
};
function un(e, t, n = !1) {
	let r = (e, t) => (n ? e : tt(e)).map((e) => ({
		kind: t,
		id: e.id,
		title: Qe(e) === "Retired" ? `${e.name} (Retired)` : e.name
	}));
	switch (t) {
		case "requirement": return e.requirements.map((e) => ({
			kind: "requirement",
			id: e.id,
			title: e.statement,
			meta: e.state
		}));
		case "test_case": return e.testCases.map((e) => ({
			kind: "test_case",
			id: e.id,
			title: e.name
		}));
		case "actor": return r(e.actors, "actor");
		case "use_case": return r(e.useCases, "use_case");
		case "element": return e.elements.map((t) => ({
			kind: "element",
			id: t.id,
			title: t.name,
			typeLabel: pt(e, String(t.elementType))
		}));
		case "product": return e.products.map((e) => ({
			kind: "product",
			id: e.id,
			title: e.name
		}));
		default: return [];
	}
}
function dn({ id: e, def: t, value: n, error: r, onChange: i }) {
	let { ws: a } = B(), o = typeof n == "string" ? n : "", s = `${t.label}${t.required ? " *" : ""}`, c = r ? `${e}-error` : void 0, l = r ? !0 : void 0, u;
	switch (t.type) {
		case "boolean":
			u = /* @__PURE__ */ (0, U.jsxs)("select", {
				id: e,
				value: o,
				"aria-invalid": l,
				"aria-describedby": c,
				onChange: (e) => i(e.currentTarget.value),
				children: [
					/* @__PURE__ */ (0, U.jsx)("option", {
						value: "",
						children: "Not set"
					}),
					/* @__PURE__ */ (0, U.jsx)("option", {
						value: "true",
						children: "Yes"
					}),
					/* @__PURE__ */ (0, U.jsx)("option", {
						value: "false",
						children: "No"
					})
				]
			});
			break;
		case "enum":
			if (t.multi) {
				let e = Array.isArray(n) ? n : [];
				return /* @__PURE__ */ (0, U.jsxs)("fieldset", {
					className: "attr-multi",
					"aria-describedby": c,
					children: [
						/* @__PURE__ */ (0, U.jsx)("legend", { children: s }),
						/* @__PURE__ */ (0, U.jsx)("div", {
							className: "kind-grid",
							children: (t.options ?? []).map((t) => /* @__PURE__ */ (0, U.jsxs)("label", {
								className: "check",
								children: [
									/* @__PURE__ */ (0, U.jsx)("input", {
										type: "checkbox",
										checked: e.includes(t),
										onChange: (n) => i(n.currentTarget.checked ? [...e, t] : e.filter((e) => e !== t))
									}),
									" ",
									t
								]
							}, t))
						}),
						r && /* @__PURE__ */ (0, U.jsx)("small", {
							className: "error",
							id: c,
							children: r
						})
					]
				});
			}
			u = /* @__PURE__ */ (0, U.jsxs)("select", {
				id: e,
				value: o,
				required: t.required,
				"aria-invalid": l,
				"aria-describedby": c,
				onChange: (e) => i(e.currentTarget.value),
				children: [/* @__PURE__ */ (0, U.jsx)("option", {
					value: "",
					children: t.required ? "Choose…" : "Not set"
				}), (t.options ?? []).map((e) => /* @__PURE__ */ (0, U.jsx)("option", {
					value: e,
					children: e
				}, e))]
			});
			break;
		case "date":
			u = /* @__PURE__ */ (0, U.jsx)("input", {
				id: e,
				type: "date",
				value: o,
				required: t.required,
				"aria-invalid": l,
				"aria-describedby": c,
				onChange: (e) => i(e.currentTarget.value)
			});
			break;
		case "number":
		case "integer":
		case "quantity":
			u = /* @__PURE__ */ (0, U.jsxs)("span", {
				className: "with-unit",
				children: [/* @__PURE__ */ (0, U.jsx)("input", {
					id: e,
					type: "number",
					inputMode: t.type === "number" ? "decimal" : "numeric",
					step: t.type === "number" || t.type === "quantity" ? "any" : 1,
					min: t.min,
					max: t.max,
					required: t.required,
					value: o,
					"aria-invalid": l,
					"aria-describedby": c,
					onChange: (e) => i(e.currentTarget.value)
				}), t.type === "quantity" && t.unit && /* @__PURE__ */ (0, U.jsx)("em", { children: t.unit })]
			});
			break;
		case "reference": {
			let e = t.targetKind ?? "", n = un(a, e), l = o ? [un(a, e, !0).find((e) => e.id === o) ?? {
				kind: e,
				id: o,
				title: "Not in the workspace"
			}] : [];
			return /* @__PURE__ */ (0, U.jsxs)("div", {
				className: "field",
				children: [
					/* @__PURE__ */ (0, U.jsx)("span", { children: s }),
					/* @__PURE__ */ (0, U.jsx)(Zt, {
						label: t.label,
						options: n,
						value: l,
						placeholder: `Search ${e.replace("_", " ")}s by ID or text…`,
						onChange: (e) => i(e[0]?.id ?? "")
					}),
					r && /* @__PURE__ */ (0, U.jsx)("small", {
						className: "error",
						id: c,
						children: r
					})
				]
			});
		}
		default: u = /* @__PURE__ */ (0, U.jsx)("input", {
			id: e,
			value: o,
			maxLength: t.type === "text" ? t.maxLength ?? 2e3 : void 0,
			required: t.required,
			"aria-invalid": l,
			"aria-describedby": c,
			onChange: (e) => i(e.currentTarget.value)
		});
	}
	return /* @__PURE__ */ (0, U.jsxs)("label", {
		className: "field",
		htmlFor: e,
		children: [
			/* @__PURE__ */ (0, U.jsx)("span", { children: s }),
			u,
			t.description && /* @__PURE__ */ (0, U.jsx)("small", {
				className: "muted",
				children: t.description
			}),
			r && /* @__PURE__ */ (0, U.jsx)("small", {
				className: "error",
				id: c,
				children: r
			})
		]
	});
}
function fn({ idPrefix: e, defs: t, draft: n, onChange: r, errors: i = {}, collapseOptional: a }) {
	if (!t.length) return null;
	let o = (t) => /* @__PURE__ */ (0, U.jsx)(dn, {
		id: `${e}-${t.key}`,
		def: t,
		value: n[t.key],
		error: i[t.key],
		onChange: (e) => r({
			...n,
			[t.key]: e
		})
	}, t.key), s = t.filter((e) => e.required), c = t.filter((e) => !e.required), l = c.some((e) => {
		let t = n[e.key];
		return Array.isArray(t) ? t.length > 0 : !!t;
	}) || c.some((e) => i[e.key]);
	return /* @__PURE__ */ (0, U.jsxs)("fieldset", {
		className: "attr-fields",
		children: [
			/* @__PURE__ */ (0, U.jsx)("legend", { children: "Attributes" }),
			s.map(o),
			c.length > 0 && (a ? /* @__PURE__ */ (0, U.jsxs)("details", {
				className: "attr-more",
				open: l || void 0,
				children: [/* @__PURE__ */ (0, U.jsxs)("summary", { children: [
					"More attributes (",
					c.length,
					")"
				] }), /* @__PURE__ */ (0, U.jsx)("div", {
					className: "form",
					children: c.map(o)
				})]
			}) : c.map(o))
		]
	});
}
function pn({ def: e, value: t }) {
	let { ws: n, ix: r, link: i } = B();
	if (t == null || t === "") return /* @__PURE__ */ (0, U.jsx)("span", {
		className: "muted",
		children: "Not set"
	});
	if (e.type === "enum") return /* @__PURE__ */ (0, U.jsx)(U.Fragment, { children: (Array.isArray(t) ? t : [t]).map((e) => /* @__PURE__ */ (0, U.jsx)("span", {
		className: "chip",
		children: String(e)
	}, String(e))) });
	if (e.type === "reference") {
		let a = String(t), o = ln[e.targetKind ?? ""], s = r.title(e.targetKind ?? "", a) || (n.products.find((e) => e.id === a)?.name ?? ""), c = /* @__PURE__ */ (0, U.jsx)("span", {
			className: "mono",
			children: a
		});
		return /* @__PURE__ */ (0, U.jsxs)("span", {
			className: "attr-ref",
			children: [o ? /* @__PURE__ */ (0, U.jsx)("a", {
				href: i(o, a, e.targetKind === "actor" ? { tab: "actors" } : e.targetKind === "use_case" ? { tab: "use_cases" } : void 0),
				children: c
			}) : c, s && /* @__PURE__ */ (0, U.jsxs)("span", {
				className: "muted",
				children: [" ", s]
			})]
		});
	}
	return /* @__PURE__ */ (0, U.jsx)(U.Fragment, { children: cn(e, t) });
}
function mn({ defs: e, values: t }) {
	let n = new Set(e.map((e) => e.key)), r = Object.keys(t).filter((e) => !n.has(e));
	return !e.length && !r.length ? null : /* @__PURE__ */ (0, U.jsxs)("section", {
		className: "attr-section",
		"aria-label": "Attributes",
		children: [/* @__PURE__ */ (0, U.jsx)("h3", { children: "Attributes" }), /* @__PURE__ */ (0, U.jsxs)("dl", {
			className: "facts",
			children: [e.map((e) => /* @__PURE__ */ (0, U.jsxs)(_.Fragment, { children: [/* @__PURE__ */ (0, U.jsx)("dt", { children: e.label }), /* @__PURE__ */ (0, U.jsx)("dd", { children: /* @__PURE__ */ (0, U.jsx)(pn, {
				def: e,
				value: t[e.key]
			}) })] }, e.key)), r.map((e) => /* @__PURE__ */ (0, U.jsxs)(_.Fragment, { children: [/* @__PURE__ */ (0, U.jsxs)("dt", { children: [
				e,
				" ",
				/* @__PURE__ */ (0, U.jsx)("span", {
					className: "pill",
					children: "Former attribute"
				})
			] }), /* @__PURE__ */ (0, U.jsx)("dd", {
				className: "muted",
				children: JSON.stringify(t[e])
			})] }, e))]
		})]
	});
}
function hn({ defs: e, attribute: t, value: n, onChange: r }) {
	let i = e.find((e) => e.key === t), a = (e) => r({
		attribute: t,
		value: e
	}), o = null;
	return i && (o = i.type === "enum" && !i.multi ? /* @__PURE__ */ (0, U.jsxs)("select", {
		"aria-label": "Attribute value",
		className: "attr-value",
		value: n,
		onChange: (e) => a(e.currentTarget.value),
		children: [/* @__PURE__ */ (0, U.jsx)("option", {
			value: "",
			children: "Any value"
		}), (i.options ?? []).map((e) => /* @__PURE__ */ (0, U.jsx)("option", {
			value: e,
			children: e
		}, e))]
	}) : i.type === "enum" ? /* @__PURE__ */ (0, U.jsxs)("select", {
		"aria-label": "Attribute value",
		className: "attr-value",
		value: n,
		onChange: (e) => a(e.currentTarget.value),
		children: [/* @__PURE__ */ (0, U.jsx)("option", {
			value: "",
			children: "Any value"
		}), (i.options ?? []).map((e) => /* @__PURE__ */ (0, U.jsxs)("option", {
			value: e,
			children: [e, " (includes)"]
		}, e))]
	}) : i.type === "boolean" ? /* @__PURE__ */ (0, U.jsxs)("select", {
		"aria-label": "Attribute value",
		className: "attr-value",
		value: n,
		onChange: (e) => a(e.currentTarget.value),
		children: [
			/* @__PURE__ */ (0, U.jsx)("option", {
				value: "",
				children: "Any value"
			}),
			/* @__PURE__ */ (0, U.jsx)("option", {
				value: "true",
				children: "Yes"
			}),
			/* @__PURE__ */ (0, U.jsx)("option", {
				value: "false",
				children: "No"
			})
		]
	}) : i.type === "date" ? /* @__PURE__ */ (0, U.jsx)("input", {
		"aria-label": "Attribute value",
		className: "attr-value",
		type: "date",
		value: n,
		onChange: (e) => a(e.currentTarget.value)
	}) : i.type === "number" || i.type === "integer" || i.type === "quantity" ? /* @__PURE__ */ (0, U.jsx)("input", {
		"aria-label": "Attribute value",
		className: "attr-value",
		type: "number",
		value: n,
		placeholder: i.unit ? `Value in ${i.unit}` : "Value",
		onChange: (e) => a(e.currentTarget.value)
	}) : /* @__PURE__ */ (0, U.jsx)("input", {
		"aria-label": "Attribute value",
		className: "attr-value",
		value: n,
		placeholder: "Exact value",
		onChange: (e) => a(e.currentTarget.value)
	})), /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [/* @__PURE__ */ (0, U.jsxs)("select", {
		"aria-label": "Attribute",
		value: t,
		onChange: (e) => r({
			attribute: e.currentTarget.value,
			value: ""
		}),
		children: [/* @__PURE__ */ (0, U.jsx)("option", {
			value: "",
			children: "Any attribute"
		}), e.map((e) => /* @__PURE__ */ (0, U.jsx)("option", {
			value: e.key,
			children: e.label
		}, e.key))]
	}), o] });
}
function gn(e, t) {
	return e.slice(0, 3).map((e) => cn(e, t?.[e.key]) || "—");
}
// client/src/dialogs.tsx
function _n(e, t, n) {
	let { api: r } = B(), [i, a] = (0, _.useState)(null);
	return (0, _.useEffect)(() => {
		let i = !0;
		return r.command("ids.propose", {
			recordType: e,
			...t ? { productId: t } : {},
			...n ? { parentId: n } : {}
		}).then((e) => {
			i && a({
				id: String(e.id),
				allowOverride: e.policy?.allowOverride !== !1
			});
		}).catch(() => {
			i && a(null);
		}), () => {
			i = !1;
		};
	}, [
		r,
		e,
		t,
		n
	]), i;
}
var vn = [
	"L1",
	"L2",
	"L3",
	"L4",
	"L5",
	"L6"
], yn = {
	L1: "Model / simulation",
	L2: "Component / unit",
	L3: "Integration / prototype",
	L4: "System / representative",
	L5: "Operational / acceptance",
	L6: "Release / production"
};
function bn(e, t) {
	let n = [];
	return t.includes("requirement") && n.push(...e.requirements.map((e) => ({
		kind: "requirement",
		id: e.id,
		title: e.statement,
		meta: `${e.state} · ${e.productId}`
	}))), t.includes("test_case") && n.push(...e.testCases.map((e) => ({
		kind: "test_case",
		id: e.id,
		title: e.name,
		meta: `Test case · ${e.requirementId}`
	}))), t.includes("use_case") && n.push(...tt(e.useCases).map((e) => ({
		kind: "use_case",
		id: e.id,
		title: e.name,
		meta: "Use case"
	}))), t.includes("actor") && n.push(...tt(e.actors).map((e) => ({
		kind: "actor",
		id: e.id,
		title: e.name,
		meta: e.actorType === "external_system" ? "External system" : "Person"
	}))), t.includes("product") && n.push(...e.products.map((e) => ({
		kind: e.kind,
		id: e.id,
		title: e.name,
		meta: Mt[e.kind]
	}))), t.includes("element") && n.push(...e.elements.map((t) => ({
		kind: "element",
		id: t.id,
		title: t.name,
		meta: pt(e, String(t.elementType)),
		typeLabel: pt(e, String(t.elementType))
	}))), n;
}
var xn = (e) => ({
	kind: "requirement",
	id: e.id,
	title: e.statement,
	meta: `${e.state} · ${e.productId}`
});
function Sn({ title: e, submit: t, children: n, onSubmit: r, wide: i, secondary: a }) {
	let { close: o } = B(), [s, c] = (0, _.useState)(!1), [l, u] = (0, _.useState)("");
	async function d(e) {
		if (e.preventDefault(), !s) {
			c(!0), u("");
			try {
				await r();
			} catch (e) {
				u(V(e, "The change could not be saved."));
			} finally {
				c(!1);
			}
		}
	}
	return /* @__PURE__ */ (0, U.jsx)(Xt, {
		title: e,
		onClose: o,
		wide: i,
		children: /* @__PURE__ */ (0, U.jsxs)("form", {
			onSubmit: d,
			className: "form",
			children: [
				n,
				l && /* @__PURE__ */ (0, U.jsx)("p", {
					className: "error",
					role: "alert",
					children: l
				}),
				/* @__PURE__ */ (0, U.jsxs)("footer", { children: [
					/* @__PURE__ */ (0, U.jsx)("button", {
						type: "button",
						className: "quiet",
						onClick: o,
						disabled: s,
						children: "Cancel"
					}),
					a,
					/* @__PURE__ */ (0, U.jsx)("button", {
						type: "submit",
						className: "primary",
						disabled: s,
						children: s ? "Saving…" : t
					})
				] })
			]
		})
	});
}
function Cn({ value: e, onChange: t, prompt: n }) {
	return n ? /* @__PURE__ */ (0, U.jsx)(K, {
		label: n,
		hint: "Required. The author sees this in the requirement's history.",
		children: /* @__PURE__ */ (0, U.jsx)("textarea", {
			autoFocus: !0,
			rows: 3,
			value: e,
			onChange: (e) => t(e.currentTarget.value),
			required: !0,
			maxLength: 2e3
		})
	}) : /* @__PURE__ */ (0, U.jsx)(K, {
		label: "Reason for the record",
		hint: "Prefilled; edit it if you want to add context. Stored in the audit history with your name.",
		children: /* @__PURE__ */ (0, U.jsx)("input", {
			value: e,
			onChange: (e) => t(e.currentTarget.value),
			required: !0,
			maxLength: 2e3
		})
	});
}
function wn({ parent: e }) {
	let { ws: t, scope: n, run: r, close: i, go: a, session: o } = B(), s = e ? t.products.find((t) => t.id === e.productId) : Ft(t, n), c = t.products.filter((e) => mt.includes(e.kind)), [l, u] = (0, _.useState)(s && mt.includes(s.kind) ? s.id : c[0]?.id ?? ""), d = _n("requirement", l, e?.id), [f, p] = (0, _.useState)(""), [m, h] = (0, _.useState)(""), [g, v] = (0, _.useState)(""), [y, b] = (0, _.useState)(""), x = [.../* @__PURE__ */ new Set([
		"Functional",
		"Interface",
		"Performance",
		"Reliability",
		"Safety",
		"Security",
		"Usability",
		"Electrical",
		"Mechanical",
		"Software",
		...t.requirements.map((e) => e.category)
	])], [S, C] = (0, _.useState)(e?.category ?? "Functional"), [w, T] = (0, _.useState)(e ? [xn(e)] : []), [E, D] = (0, _.useState)(e ? `Refines ${e.id}` : "New requirement drafted"), O = o.role !== "reader";
	async function k(t) {
		if (Object.keys(F.errors).length) throw Error("Check the attributes marked in red.");
		let n = await r("requirements.create", {
			...f.trim() ? { id: f.trim() } : {},
			productId: l,
			...e ? { parentId: e.id } : {},
			statement: m,
			criteria: g,
			rationale: y,
			category: S,
			reason: E,
			...Object.keys(F.patch).length ? { attributes: F.patch } : {}
		}), o = String(n.id);
		w.length && (n = await r("hierarchy.set", {
			id: o,
			expectedRevision: n.revision,
			parents: w.map((e) => e.id),
			reason: E
		})), t && await r("requirements.transition", {
			id: o,
			state: "In Review",
			expectedRevision: n.revision,
			reason: Vt("In Review")
		}), i(), a("requirements", o);
	}
	let [A, j] = (0, _.useState)(!1), M = t.metamodel.recordAttributes.requirement, [N, P] = (0, _.useState)(() => rn(M)), F = on(M, {}, N);
	return /* @__PURE__ */ (0, U.jsxs)(Sn, {
		title: e ? `Add a requirement under ${e.id}` : "New requirement",
		submit: A ? "Create and submit for review" : "Create draft",
		wide: !0,
		onSubmit: () => k(A),
		children: [
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "grid-2",
				children: [d?.allowOverride === !1 ? /* @__PURE__ */ (0, U.jsx)(K, {
					label: "Requirement ID",
					hint: "Assigned by the workspace numbering policy when you create it",
					children: /* @__PURE__ */ (0, U.jsx)("input", {
						className: "mono",
						value: d.id,
						readOnly: !0,
						"aria-readonly": "true"
					})
				}) : /* @__PURE__ */ (0, U.jsx)(K, {
					label: "Requirement ID",
					hint: d ? `Leave empty and RMS assigns the next number (${d.id} now)` : "Leave empty and RMS assigns the next number",
					children: /* @__PURE__ */ (0, U.jsx)("input", {
						className: "mono",
						value: f,
						placeholder: d?.id ?? "",
						onChange: (e) => p(e.currentTarget.value),
						maxLength: 100
					})
				}), /* @__PURE__ */ (0, U.jsx)(K, {
					label: "Owned by",
					children: /* @__PURE__ */ (0, U.jsx)("select", {
						value: l,
						onChange: (e) => u(e.currentTarget.value),
						children: c.map((e) => /* @__PURE__ */ (0, U.jsxs)("option", {
							value: e.id,
							children: [
								e.name,
								" (",
								e.id,
								")"
							]
						}, e.id))
					})
				})]
			}),
			/* @__PURE__ */ (0, U.jsx)(K, {
				label: "The system shall…",
				children: /* @__PURE__ */ (0, U.jsx)("textarea", {
					autoFocus: !0,
					rows: 3,
					required: !0,
					value: m,
					onChange: (e) => h(e.currentTarget.value),
					placeholder: "One verifiable obligation, written as a shall statement."
				})
			}),
			/* @__PURE__ */ (0, U.jsx)(K, {
				label: "How will we know it is met?",
				hint: "Acceptance criteria: observable, measurable outcomes.",
				children: /* @__PURE__ */ (0, U.jsx)("textarea", {
					rows: 3,
					required: !0,
					value: g,
					onChange: (e) => v(e.currentTarget.value)
				})
			}),
			/* @__PURE__ */ (0, U.jsx)(K, {
				label: "Why does it matter? (optional)",
				children: /* @__PURE__ */ (0, U.jsx)("textarea", {
					rows: 2,
					value: y,
					onChange: (e) => b(e.currentTarget.value)
				})
			}),
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "grid-2",
				children: [/* @__PURE__ */ (0, U.jsxs)(K, {
					label: "Category",
					children: [/* @__PURE__ */ (0, U.jsx)("input", {
						list: "rms-categories",
						value: S,
						onChange: (e) => C(e.currentTarget.value),
						required: !0,
						maxLength: 100
					}), /* @__PURE__ */ (0, U.jsx)("datalist", {
						id: "rms-categories",
						children: x.map((e) => /* @__PURE__ */ (0, U.jsx)("option", { value: e }, e))
					})]
				}), /* @__PURE__ */ (0, U.jsx)(K, {
					label: "Refines (parent requirements)",
					children: /* @__PURE__ */ (0, U.jsx)(Zt, {
						label: "parent requirements",
						multiple: !0,
						options: t.requirements.map(xn),
						value: w,
						onChange: T
					})
				})]
			}),
			/* @__PURE__ */ (0, U.jsx)(fn, {
				idPrefix: "new-req-attr",
				defs: M,
				draft: N,
				onChange: P,
				errors: F.errors,
				collapseOptional: !0
			}),
			/* @__PURE__ */ (0, U.jsx)(Cn, {
				value: E,
				onChange: D
			}),
			O && /* @__PURE__ */ (0, U.jsxs)("label", {
				className: "check",
				children: [/* @__PURE__ */ (0, U.jsx)("input", {
					type: "checkbox",
					checked: A,
					onChange: (e) => j(e.currentTarget.checked)
				}), " Submit for product owner review right away"]
			})
		]
	});
}
function Tn({ records: e, to: t }) {
	let { api: n, refresh: r, close: i, ws: a } = B(), o = a.settings.approvals.decisionReason === "typed" && t !== "In Review", [s, c] = (0, _.useState)(o ? "" : Vt(t)), [l, u] = (0, _.useState)([]), [d, f] = (0, _.useState)(/* @__PURE__ */ new Set());
	return /* @__PURE__ */ (0, U.jsxs)(Sn, {
		title: e.length === 1 ? `${Rt(t)} · ${e[0].id}` : `${Rt(t)} ${e.length} requirements`,
		submit: Rt(t),
		onSubmit: async () => {
			if ((zt(t) || o) && !s.trim()) throw Error(o && !zt(t) ? "Please give the reason for this decision." : "Please say what needs to change.");
			let a = [], c = new Set(d);
			for (let r of e) if (!c.has(r.id)) try {
				await n.command("requirements.transition", {
					id: r.id,
					state: t,
					expectedRevision: r.revision,
					reason: s.trim()
				}), c.add(r.id);
			} catch (e) {
				a.push(`${r.id}: ${V(e, "failed")}`);
			}
			if (f(c), await r(), a.length) throw u(a), Error(`${c.size} of ${e.length} recorded. The others were not changed.`);
			i();
		},
		children: [
			/* @__PURE__ */ (0, U.jsx)("ul", {
				className: "decision-list",
				children: e.map((e) => /* @__PURE__ */ (0, U.jsxs)("li", { children: [
					/* @__PURE__ */ (0, U.jsx)("span", {
						className: "mono",
						children: e.id
					}),
					/* @__PURE__ */ (0, U.jsx)("span", { children: e.statement }),
					d.has(e.id) ? /* @__PURE__ */ (0, U.jsx)(W, { state: t }) : /* @__PURE__ */ (0, U.jsx)(W, { state: e.state })
				] }, e.id))
			}),
			/* @__PURE__ */ (0, U.jsx)(Cn, {
				value: s,
				onChange: c,
				prompt: Bt(t) || (o ? "Why this decision?" : void 0)
			}),
			l.length > 0 && /* @__PURE__ */ (0, U.jsx)("ul", {
				className: "error",
				children: l.map((e) => /* @__PURE__ */ (0, U.jsx)("li", { children: e }, e))
			})
		]
	});
}
function En({ record: e }) {
	let { ws: t, run: n, close: r, ix: i } = B(), [a, o] = (0, _.useState)((e.parents ?? []).map((e) => ({
		kind: "requirement",
		id: e,
		title: i.title("requirement", e)
	}))), [s, c] = (0, _.useState)("Updated parent requirements");
	return /* @__PURE__ */ (0, U.jsxs)(Sn, {
		title: `What does ${e.id} refine?`,
		submit: "Save parents",
		onSubmit: async () => {
			await n("hierarchy.set", {
				id: e.id,
				expectedRevision: e.revision,
				parents: a.map((e) => e.id),
				reason: s
			}, "Parent requirements updated"), r();
		},
		children: [
			/* @__PURE__ */ (0, U.jsx)(Zt, {
				label: "parent requirements",
				multiple: !0,
				options: t.requirements.map(xn),
				value: a,
				onChange: o,
				exclude: [`requirement:${e.id}`]
			}),
			/* @__PURE__ */ (0, U.jsx)("p", {
				className: "muted small",
				children: "Cycles are rejected. Changing parents keeps the lifecycle state; the change is recorded in history."
			}),
			/* @__PURE__ */ (0, U.jsx)(Cn, {
				value: s,
				onChange: c
			})
		]
	});
}
var Dn = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+#\d+$/;
function On({ from: e }) {
	let { ws: t, run: n, close: r } = B(), i = t.relationTypes.filter((e) => e.id !== "verifies"), a = i.length ? i : [{
		id: "related_to",
		label: "Related to"
	}, {
		id: "depends_on",
		label: "Depends on"
	}], [o, s] = (0, _.useState)("related_to"), [c, l] = (0, _.useState)([]), [u, d] = (0, _.useState)(""), [f, p] = (0, _.useState)(""), [m, h] = (0, _.useState)("Traceability link"), g = u.trim(), v = c.length + +!!g;
	return /* @__PURE__ */ (0, U.jsxs)(Sn, {
		title: `Connect ${e.id}`,
		submit: v > 1 ? `Create ${v} links` : "Create link",
		onSubmit: async () => {
			if (!v) throw Error("Choose at least one record, or enter a GitHub reference.");
			if (g && !Dn.test(g)) throw Error("Use owner/repo#number for a GitHub issue or pull request.");
			let t = [...c.map((e) => ({
				to: e.id,
				toKind: e.kind
			})), ...g ? [{
				to: g,
				toKind: "github"
			}] : []];
			for (let r of t) await n("traceability.add", {
				from: e.id,
				fromKind: e.kind,
				...r,
				type: o,
				reason: m,
				...f.trim() ? { note: f.trim() } : {}
			}, void 0);
			r();
		},
		children: [
			/* @__PURE__ */ (0, U.jsx)(K, {
				label: "Relationship",
				children: /* @__PURE__ */ (0, U.jsx)("select", {
					value: o,
					onChange: (e) => s(e.currentTarget.value),
					children: a.map((e) => /* @__PURE__ */ (0, U.jsx)("option", {
						value: e.id,
						children: e.label
					}, e.id))
				})
			}),
			/* @__PURE__ */ (0, U.jsx)(K, {
				label: "Records",
				children: /* @__PURE__ */ (0, U.jsx)(Zt, {
					label: "records to connect",
					multiple: !0,
					options: bn(t, [
						"requirement",
						"use_case",
						"actor",
						"test_case",
						"element"
					]),
					value: c,
					onChange: l,
					exclude: [`${e.kind}:${e.id}`]
				})
			}),
			/* @__PURE__ */ (0, U.jsx)(K, {
				label: "GitHub issue or pull request (optional)",
				hint: "Enter owner/repo#number, for example plotune/rms#12.",
				children: /* @__PURE__ */ (0, U.jsx)("input", {
					className: "mono",
					value: u,
					onChange: (e) => d(e.currentTarget.value),
					maxLength: 200,
					placeholder: "owner/repo#12"
				})
			}),
			/* @__PURE__ */ (0, U.jsx)(K, {
				label: "Note (optional)",
				hint: "Shown under the link.",
				children: /* @__PURE__ */ (0, U.jsx)("input", {
					value: f,
					onChange: (e) => p(e.currentTarget.value),
					maxLength: 2e3
				})
			}),
			/* @__PURE__ */ (0, U.jsx)(Cn, {
				value: m,
				onChange: h
			})
		]
	});
}
function kn({ testCase: e, requirement: t }) {
	let { ws: n, run: r, close: i, ensureLinksOf: a } = B();
	(0, _.useEffect)(() => {
		a("test_case", e.id).catch(() => void 0);
	}, [e.id, a]);
	let o = n.links.find((n) => n.type === "verifies" && n.from === e.id && n.to === t.id && n.fromRevision === e.revision) ?? n.links.find((n) => n.type === "verifies" && n.from === e.id && n.to === t.id), [s, c] = (0, _.useState)(o?.attestation?.coverage === "Partial" ? "Partial" : "Full"), [l, u] = (0, _.useState)(""), [d, f] = (0, _.useState)(`Coverage attested for ${t.id} Rev ${ht(t)}`);
	return /* @__PURE__ */ (0, U.jsxs)(Sn, {
		title: `Attest coverage · ${e.id}`,
		submit: "Attest coverage",
		onSubmit: async () => {
			if (!o) throw Error("This test case has no verifies link for its current revision.");
			if (!l.trim()) throw Error("Say what the test covers and what it leaves out.");
			await r("verification.attest", {
				testCaseId: e.id,
				coverage: s,
				rationale: l.trim(),
				reason: d.trim(),
				expectedRevision: o.revision
			}, `Coverage attested as ${s}`), i();
		},
		children: [
			/* @__PURE__ */ (0, U.jsxs)("p", {
				className: "muted small",
				children: [
					"How fully ",
					/* @__PURE__ */ (0, U.jsx)("span", {
						className: "mono",
						children: e.id
					}),
					" covers ",
					/* @__PURE__ */ (0, U.jsx)("span", {
						className: "mono",
						children: t.id
					}),
					" Rev ",
					ht(t),
					". Only Full coverage counts toward verification."
				]
			}),
			/* @__PURE__ */ (0, U.jsx)("div", {
				className: "segmented",
				role: "radiogroup",
				"aria-label": "Coverage",
				children: ["Full", "Partial"].map((e) => /* @__PURE__ */ (0, U.jsx)("button", {
					type: "button",
					role: "radio",
					"aria-checked": s === e,
					onClick: () => c(e),
					children: e
				}, e))
			}),
			/* @__PURE__ */ (0, U.jsx)(K, {
				label: "Rationale",
				hint: "Required. Stored with the coverage decision.",
				children: /* @__PURE__ */ (0, U.jsx)("textarea", {
					rows: 3,
					required: !0,
					value: l,
					maxLength: 2e3,
					onChange: (e) => u(e.currentTarget.value)
				})
			}),
			/* @__PURE__ */ (0, U.jsx)(Cn, {
				value: d,
				onChange: f
			})
		]
	});
}
function An({ requirement: e }) {
	let { ws: t, run: n, close: r, go: i } = B(), [a, o] = (0, _.useState)(`Verify ${e.id}`), [s, c] = (0, _.useState)(e.criteria ?? ""), [l, u] = (0, _.useState)("Test"), [d, f] = (0, _.useState)("L3"), [p, m] = (0, _.useState)("L4"), [h, g] = (0, _.useState)(!0), [v, y] = (0, _.useState)(`Test case for ${e.id}`), b = t.metamodel.recordAttributes.test_case, [x, S] = (0, _.useState)(() => rn(b)), C = on(b, {}, x);
	return /* @__PURE__ */ (0, U.jsxs)(Sn, {
		title: `Add a test case for ${e.id}`,
		submit: "Create test case",
		wide: !0,
		onSubmit: async () => {
			let t = vn.indexOf(d), o = vn.indexOf(p);
			if (t > o) throw Error("The minimum level cannot be above the target level.");
			if (Object.keys(C.errors).length) throw Error("Check the attributes marked in red.");
			let c = await n("test_cases.create", {
				name: a,
				objective: a,
				requirementId: e.id,
				requirementRevision: e.revision,
				method: l,
				minLevel: d,
				targetLevel: p,
				applicableLevels: vn.slice(t, o + 1),
				mandatory: h,
				acceptanceCriteriaProcedure: s,
				reason: v,
				...Object.keys(C.patch).length ? { attributes: C.patch } : {}
			});
			await n("traceability.add", {
				from: c.id,
				fromKind: "test_case",
				fromRevision: c.revision,
				to: e.id,
				toKind: "requirement",
				toRevision: e.revision,
				type: "verifies",
				reason: v
			}, `${c.id} now verifies ${e.id}`), r(), i("verification", c.id);
		},
		children: [
			/* @__PURE__ */ (0, U.jsxs)("p", {
				className: "muted small",
				children: [
					"Pinned to ",
					/* @__PURE__ */ (0, U.jsx)("span", {
						className: "mono",
						children: e.id
					}),
					" Rev ",
					ht(e),
					". The verifies link is created for you."
				]
			}),
			/* @__PURE__ */ (0, U.jsx)(K, {
				label: "Test case name",
				children: /* @__PURE__ */ (0, U.jsx)("input", {
					value: a,
					onChange: (e) => o(e.currentTarget.value),
					required: !0,
					maxLength: 200
				})
			}),
			/* @__PURE__ */ (0, U.jsx)(K, {
				label: "Procedure and pass criteria",
				hint: "Prefilled from the requirement's acceptance criteria. Make it reproducible.",
				children: /* @__PURE__ */ (0, U.jsx)("textarea", {
					rows: 5,
					value: s,
					onChange: (e) => c(e.currentTarget.value),
					required: !0
				})
			}),
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "grid-3",
				children: [
					/* @__PURE__ */ (0, U.jsx)(K, {
						label: "Method",
						children: /* @__PURE__ */ (0, U.jsx)("select", {
							value: l,
							onChange: (e) => u(e.currentTarget.value),
							children: [
								"Test",
								"Analysis",
								"Inspection",
								"Demonstration",
								"Review"
							].map((e) => /* @__PURE__ */ (0, U.jsx)("option", { children: e }, e))
						})
					}),
					/* @__PURE__ */ (0, U.jsx)(K, {
						label: "Minimum level",
						children: /* @__PURE__ */ (0, U.jsx)("select", {
							value: d,
							onChange: (e) => f(e.currentTarget.value),
							children: vn.map((e) => /* @__PURE__ */ (0, U.jsxs)("option", {
								value: e,
								children: [
									e,
									" · ",
									yn[e]
								]
							}, e))
						})
					}),
					/* @__PURE__ */ (0, U.jsx)(K, {
						label: "Target level",
						children: /* @__PURE__ */ (0, U.jsx)("select", {
							value: p,
							onChange: (e) => m(e.currentTarget.value),
							children: vn.map((e) => /* @__PURE__ */ (0, U.jsxs)("option", {
								value: e,
								children: [
									e,
									" · ",
									yn[e]
								]
							}, e))
						})
					})
				]
			}),
			/* @__PURE__ */ (0, U.jsxs)("label", {
				className: "check",
				children: [/* @__PURE__ */ (0, U.jsx)("input", {
					type: "checkbox",
					checked: h,
					onChange: (e) => g(e.currentTarget.checked)
				}), " Mandatory for verification"]
			}),
			/* @__PURE__ */ (0, U.jsx)(fn, {
				idPrefix: "new-case-attr",
				defs: b,
				draft: x,
				onChange: S,
				errors: C.errors,
				collapseOptional: !0
			}),
			/* @__PURE__ */ (0, U.jsx)(Cn, {
				value: v,
				onChange: y
			})
		]
	});
}
function jn() {
	let { ws: e, scope: t, close: n } = B(), [r, i] = (0, _.useState)([]), [a, o] = (0, _.useState)();
	if (a) return /* @__PURE__ */ (0, U.jsx)(An, { requirement: a });
	let s = e.requirements.filter((n) => It(e, t, n)).map(xn);
	return /* @__PURE__ */ (0, U.jsx)(Xt, {
		title: "New test case",
		onClose: n,
		footer: /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [/* @__PURE__ */ (0, U.jsx)("button", {
			className: "quiet",
			onClick: n,
			children: "Cancel"
		}), /* @__PURE__ */ (0, U.jsx)("button", {
			className: "primary",
			disabled: !r.length,
			onClick: () => o(e.requirements.find((e) => e.id === r[0].id)),
			children: "Continue"
		})] }),
		children: /* @__PURE__ */ (0, U.jsx)("div", {
			className: "form",
			style: { minHeight: 280 },
			children: /* @__PURE__ */ (0, U.jsx)(K, {
				label: "Which requirement does it verify?",
				children: /* @__PURE__ */ (0, U.jsx)(Zt, {
					label: "Which requirement does it verify?",
					options: s,
					value: r,
					onChange: i
				})
			})
		})
	});
}
function Mn({ testCase: e }) {
	let { ws: t, ix: n, run: r, close: i } = B(), a = n.latestRun(e.id), [o, s] = (0, _.useState)("PASS"), [c, l] = (0, _.useState)("Complete"), [u, d] = (0, _.useState)(e.targetLevel), [f, p] = (0, _.useState)(""), [m, h] = (0, _.useState)(""), [g, v] = (0, _.useState)(a?.setup ?? ""), [y, b] = (0, _.useState)(a?.buildCommit ?? ""), [x, S] = (0, _.useState)("Test result recorded"), C = !["Planned", "NOT VERIFIED"].includes(o), w = (e) => {
		s(e), e === "PASS" && l("Complete"), e === "Planned" && l("Pending");
	};
	return /* @__PURE__ */ (0, U.jsxs)(Sn, {
		title: `Record a result · ${e.id}`,
		submit: "Save result",
		wide: !0,
		onSubmit: async () => {
			await r("test_executions.create", {
				testCaseId: e.id,
				testCaseRevision: e.revision,
				maturityLevel: u,
				method: e.method,
				result: o,
				coverage: c,
				...f ? { evidenceUrl: f } : {},
				...m ? { evidenceSummary: m } : {},
				...g ? { setup: g } : {},
				...y ? { buildCommit: y } : {},
				reason: x
			}, "Result recorded"), i();
		},
		children: [
			/* @__PURE__ */ (0, U.jsx)("div", {
				className: "segmented",
				role: "radiogroup",
				"aria-label": "Result",
				children: [
					"PASS",
					"FAIL",
					"BLOCKED",
					"NOT VERIFIED",
					"Planned"
				].map((e) => /* @__PURE__ */ (0, U.jsx)("button", {
					type: "button",
					role: "radio",
					"aria-checked": o === e,
					"data-result": e,
					onClick: () => w(e),
					children: e === "NOT VERIFIED" ? "Not verified" : e[0] + e.slice(1).toLowerCase()
				}, e))
			}),
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "grid-2",
				children: [/* @__PURE__ */ (0, U.jsx)(K, {
					label: "Criteria covered",
					children: /* @__PURE__ */ (0, U.jsx)("select", {
						value: c,
						onChange: (e) => l(e.currentTarget.value),
						disabled: o === "PASS" || o === "Planned",
						children: [
							"Complete",
							"Partial",
							"Pending"
						].map((e) => /* @__PURE__ */ (0, U.jsx)("option", { children: e }, e))
					})
				}), /* @__PURE__ */ (0, U.jsx)(K, {
					label: "Maturity level",
					children: /* @__PURE__ */ (0, U.jsx)("select", {
						value: u,
						onChange: (e) => d(e.currentTarget.value),
						children: (e.applicableLevels ?? []).map((e) => /* @__PURE__ */ (0, U.jsxs)("option", {
							value: e,
							children: [
								e,
								" · ",
								yn[e]
							]
						}, e))
					})
				})]
			}),
			/* @__PURE__ */ (0, U.jsx)(K, {
				label: `Evidence link${o === "PASS" ? "" : " (optional)"}`,
				hint: "HTTPS link to a report, CI run or commit.",
				children: /* @__PURE__ */ (0, U.jsx)("input", {
					type: "url",
					value: f,
					required: o === "PASS",
					onChange: (e) => p(e.currentTarget.value),
					placeholder: "https://"
				})
			}),
			/* @__PURE__ */ (0, U.jsx)(K, {
				label: "What was observed?",
				children: /* @__PURE__ */ (0, U.jsx)("textarea", {
					rows: 3,
					value: m,
					onChange: (e) => h(e.currentTarget.value)
				})
			}),
			C && /* @__PURE__ */ (0, U.jsxs)("div", {
				className: "grid-2",
				children: [/* @__PURE__ */ (0, U.jsx)(K, {
					label: "Setup / tools",
					hint: a?.setup ? "Carried over from the last run." : void 0,
					children: /* @__PURE__ */ (0, U.jsx)("input", {
						value: g,
						required: !0,
						onChange: (e) => v(e.currentTarget.value)
					})
				}), /* @__PURE__ */ (0, U.jsx)(K, {
					label: "Build, commit or hardware revision",
					children: /* @__PURE__ */ (0, U.jsx)("input", {
						value: y,
						required: !0,
						onChange: (e) => b(e.currentTarget.value)
					})
				})]
			}),
			/* @__PURE__ */ (0, U.jsx)(Cn, {
				value: x,
				onChange: S
			})
		]
	});
}
function Nn({ preselected: e }) {
	let { ws: t, scope: n, run: r, close: i, go: a } = B(), o = Ft(t, n), s = t.requirements.filter((e) => e.state === "Approved" && It(t, n, e)), [c, l] = (0, _.useState)(new Set(e?.length ? e.filter((e) => s.some((t) => t.id === e)) : s.map((e) => e.id))), u = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), [d, f] = (0, _.useState)(""), p = _n("baseline", o && mt.includes(o.kind) ? o.id : void 0), m = `${o?.name ?? "Workspace"} specification ${u}`, [h, g] = (0, _.useState)(""), [v, y] = (0, _.useState)("Freeze approved requirement set"), [b, x] = (0, _.useState)(!1), S = (e) => l((t) => {
		let n = new Set(t);
		return n.has(e) ? n.delete(e) : n.add(e), n;
	});
	return /* @__PURE__ */ (0, U.jsxs)(Sn, {
		title: "Freeze a baseline",
		submit: b ? "Save draft" : `Freeze ${c.size} requirements`,
		wide: !0,
		onSubmit: async () => {
			if (!c.size) throw Error("Select at least one approved requirement.");
			if (c.size > 100) throw Error("A baseline can hold at most 100 requirements.");
			let e = await r("baselines.create", {
				...d.trim() ? { id: d.trim() } : {},
				...o && mt.includes(o.kind) ? { productId: o.id } : {},
				name: h.trim() || m,
				requirements: [...c],
				reason: v,
				...b ? { state: "Draft" } : {}
			}, b ? "Baseline saved as draft" : "Baseline frozen");
			i(), a("baselines", String(e.id));
		},
		children: [
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "grid-2",
				children: [/* @__PURE__ */ (0, U.jsx)(K, {
					label: "Baseline ID",
					hint: p ? `Leave empty and RMS assigns ${p.id}` : "Leave empty and RMS assigns the next number",
					children: /* @__PURE__ */ (0, U.jsx)("input", {
						className: "mono",
						value: d,
						placeholder: p?.id ?? "",
						readOnly: p?.allowOverride === !1,
						onChange: (e) => f(e.currentTarget.value)
					})
				}), /* @__PURE__ */ (0, U.jsx)(K, {
					label: "Name",
					hint: `Leave empty and RMS names it “${m}”`,
					children: /* @__PURE__ */ (0, U.jsx)("input", {
						value: h,
						placeholder: m,
						onChange: (e) => g(e.currentTarget.value)
					})
				})]
			}),
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "checklist-head",
				children: [
					/* @__PURE__ */ (0, U.jsxs)("strong", { children: [
						c.size,
						" of ",
						s.length,
						" approved requirements"
					] }),
					/* @__PURE__ */ (0, U.jsx)("button", {
						type: "button",
						className: "link",
						onClick: () => l(new Set(s.map((e) => e.id))),
						children: "Select all"
					}),
					/* @__PURE__ */ (0, U.jsx)("button", {
						type: "button",
						className: "link",
						onClick: () => l(/* @__PURE__ */ new Set()),
						children: "Clear"
					})
				]
			}),
			/* @__PURE__ */ (0, U.jsxs)("label", {
				className: "check",
				children: [/* @__PURE__ */ (0, U.jsx)("input", {
					type: "checkbox",
					checked: b,
					onChange: (e) => x(e.currentTarget.checked)
				}), " Save as a draft to freeze later"]
			}),
			s.length ? /* @__PURE__ */ (0, U.jsx)("ul", {
				className: "checklist",
				children: s.map((e) => /* @__PURE__ */ (0, U.jsx)("li", { children: /* @__PURE__ */ (0, U.jsxs)("label", { children: [
					/* @__PURE__ */ (0, U.jsx)("input", {
						type: "checkbox",
						checked: c.has(e.id),
						onChange: () => S(e.id)
					}),
					/* @__PURE__ */ (0, U.jsx)("span", {
						className: "mono",
						children: e.id
					}),
					/* @__PURE__ */ (0, U.jsx)("span", { children: e.statement }),
					/* @__PURE__ */ (0, U.jsxs)("span", {
						className: "muted",
						children: ["Rev ", ht(e)]
					})
				] }) }, e.id))
			}) : /* @__PURE__ */ (0, U.jsx)("p", {
				className: "muted",
				children: "Nothing is approved in this scope yet. Approve requirements first."
			}),
			/* @__PURE__ */ (0, U.jsx)(Cn, {
				value: v,
				onChange: y
			})
		]
	});
}
function Pn() {
	let { ws: e, run: t, close: n } = B(), [r, i] = (0, _.useState)("product"), [a, o] = (0, _.useState)(""), [s, c] = (0, _.useState)(""), [l, u] = (0, _.useState)(""), [d, f] = (0, _.useState)(e.products.find((e) => e.kind === "product")?.id ?? ""), [p, m] = (0, _.useState)("New engineering scope");
	return /* @__PURE__ */ (0, U.jsxs)(Sn, {
		title: "New product, project or release",
		submit: "Create",
		onSubmit: async () => {
			await t("products.create", {
				id: a,
				kind: r,
				name: s,
				...mt.includes(r) && l ? { parentId: l } : {},
				...["project", "release"].includes(r) ? { productId: d } : {},
				reason: p
			}, `${s} created`), n(), window.location.hash = `#/${encodeURIComponent(a)}/home`;
		},
		children: [
			/* @__PURE__ */ (0, U.jsx)("div", {
				className: "segmented",
				role: "radiogroup",
				"aria-label": "Kind",
				children: [
					"family",
					"product",
					"component",
					"edition",
					"project",
					"release"
				].map((e) => /* @__PURE__ */ (0, U.jsx)("button", {
					type: "button",
					role: "radio",
					"aria-checked": r === e,
					onClick: () => i(e),
					children: Mt[e]
				}, e))
			}),
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "grid-2",
				children: [/* @__PURE__ */ (0, U.jsx)(K, {
					label: "ID",
					children: /* @__PURE__ */ (0, U.jsx)("input", {
						className: "mono",
						value: a,
						onChange: (e) => o(e.currentTarget.value),
						required: !0,
						placeholder: "BR-CAN"
					})
				}), /* @__PURE__ */ (0, U.jsx)(K, {
					label: "Name",
					children: /* @__PURE__ */ (0, U.jsx)("input", {
						value: s,
						onChange: (e) => c(e.currentTarget.value),
						required: !0
					})
				})]
			}),
			mt.includes(r) && r !== "family" && /* @__PURE__ */ (0, U.jsx)(K, {
				label: "Parent (optional)",
				children: /* @__PURE__ */ (0, U.jsxs)("select", {
					value: l,
					onChange: (e) => u(e.currentTarget.value),
					children: [/* @__PURE__ */ (0, U.jsx)("option", {
						value: "",
						children: "None"
					}), e.products.filter((e) => mt.includes(e.kind) && e.id !== a).map((e) => /* @__PURE__ */ (0, U.jsxs)("option", {
						value: e.id,
						children: [
							e.name,
							" (",
							Mt[e.kind],
							")"
						]
					}, e.id))]
				})
			}),
			["project", "release"].includes(r) && /* @__PURE__ */ (0, U.jsx)(K, {
				label: "For product",
				children: /* @__PURE__ */ (0, U.jsx)("select", {
					value: d,
					onChange: (e) => f(e.currentTarget.value),
					children: e.products.filter((e) => e.kind === "product").map((e) => /* @__PURE__ */ (0, U.jsx)("option", {
						value: e.id,
						children: e.name
					}, e.id))
				})
			}),
			/* @__PURE__ */ (0, U.jsx)(Cn, {
				value: p,
				onChange: m
			})
		]
	});
}
var Fn = {
	exact_baseline_binding_unconfigured: "No frozen baseline is chosen for this release",
	mandatory_test_policy_unconfigured: "No mandatory test cases are chosen",
	approval_policy_unconfigured: "No approval gates are declared",
	requirement_verification_not_assessed: "Requirement verification cannot be assessed yet",
	requirement_criteria_coverage_mapping_missing: "No mapping shows that the test procedures cover each requirement's criteria",
	baseline_scope_invalid: "The chosen baseline is not frozen, is empty, or holds requirements of another product",
	configured_baseline_unavailable: "The chosen baseline could not be read",
	mandatory_test_verification_unavailable: "Mandatory test evidence cannot count toward release yet",
	mandatory_test_case_not_verified: "Mandatory test case not verified for release",
	baseline_requirement_not_verified: "A requirement in the baseline is not verified",
	baseline_requirement_not_approved: "A requirement in the baseline is no longer Approved at its baselined revision",
	approval_gate_not_met: "An approval gate is not met: a requirement it covers is no longer Approved at its baselined revision",
	approval_evidence_unavailable: "Approvals are declared but RMS does not record approval evidence yet",
	approval_gate_not_assessed: "Approval gate not assessed",
	workspace_changed_during_assessment: "Records changed while this report was assembled; open it again"
};
function In({ release: e }) {
	let { api: t, session: n, open: r, close: i, link: a, ws: o } = B(), [s, c] = (0, _.useState)(null), [l, u] = (0, _.useState)("");
	(0, _.useEffect)(() => {
		let n = !0;
		return t.command("release.readiness", { releaseId: e.id }).then((e) => {
			n && c(e);
		}).catch((e) => {
			n && u(V(e, "Readiness could not be loaded."));
		}), () => {
			n = !1;
		};
	}, [
		t,
		e.id,
		o
	]);
	let d = Array.isArray(s?.unmetGates) ? s.unmetGates : [], f = s?.baselineBinding, p = /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [n.role === "admin" && /* @__PURE__ */ (0, U.jsx)("button", {
		type: "button",
		className: "quiet",
		onClick: () => r(/* @__PURE__ */ (0, U.jsx)(Ln, { release: e })),
		children: "Configure gates"
	}), /* @__PURE__ */ (0, U.jsx)("button", {
		type: "button",
		className: "primary",
		onClick: i,
		children: "Close"
	})] });
	return /* @__PURE__ */ (0, U.jsxs)(Xt, {
		title: `Release readiness · ${e.name}`,
		onClose: i,
		footer: p,
		wide: !0,
		children: [
			l && /* @__PURE__ */ (0, U.jsx)("p", {
				className: "error",
				role: "alert",
				children: l
			}),
			!s && !l && /* @__PURE__ */ (0, U.jsx)("p", {
				className: "muted small",
				role: "status",
				children: "Checking readiness…"
			}),
			s && /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [
				/* @__PURE__ */ (0, U.jsxs)("p", { children: [
					/* @__PURE__ */ (0, U.jsx)("span", {
						className: "pill",
						"data-tone": s.qualified ? "good" : "warn",
						children: s.qualified ? "Qualified" : "Not qualified"
					}),
					" ",
					/* @__PURE__ */ (0, U.jsxs)("span", {
						className: "muted small",
						children: [
							d.length,
							" open gate",
							d.length === 1 ? "" : "s",
							f?.baselineId ? ` · baseline ${f.baselineId}` : "",
							" · checked ",
							new Date(String(s.evaluatedAt)).toLocaleString()
						]
					})
				] }),
				/* @__PURE__ */ (0, U.jsx)("ul", {
					className: "readiness-gates",
					children: d.map((e, t) => /* @__PURE__ */ (0, U.jsxs)("li", { children: [
						/* @__PURE__ */ (0, U.jsx)("strong", { children: Fn[e.code] ?? e.code }),
						e.testCaseId && /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [" · ", /* @__PURE__ */ (0, U.jsx)("a", {
							href: a("verification", String(e.testCaseId)),
							onClick: i,
							children: /* @__PURE__ */ (0, U.jsx)("span", {
								className: "mono",
								children: e.testCaseId
							})
						})] }),
						e.label && /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [
							" · ",
							e.label,
							e.declaredAuthorityReference ? ` (${e.declaredAuthorityReference})` : ""
						] }),
						/* @__PURE__ */ (0, U.jsx)("span", {
							className: "pill",
							"data-tone": e.status === "UNCONFIGURED" ? void 0 : "warn",
							children: String(e.status).toLowerCase().replace(/^./, (e) => e.toUpperCase())
						}),
						e.message && /* @__PURE__ */ (0, U.jsx)("p", {
							className: "muted small",
							children: e.message
						})
					] }, `${e.code}-${t}`))
				}),
				/* @__PURE__ */ (0, U.jsx)("p", {
					className: "muted small",
					children: "Each mandatory test case and each approval gate counts as its own open gate, so configuring gates can raise the count without any record changing."
				}),
				n.role !== "admin" && /* @__PURE__ */ (0, U.jsx)("p", {
					className: "muted small",
					children: "An administrator configures the baseline, mandatory test cases and approval gates."
				})
			] })
		]
	});
}
function Ln({ release: e }) {
	let { ws: t, api: n, run: r, close: i } = B(), a = t.baselines, [o, s] = (0, _.useState)(a[a.length - 1]?.id ?? ""), c = t.testCases.filter((e) => e.mandatory).map((e) => ({
		kind: "test_case",
		id: e.id,
		title: e.name,
		meta: `${e.requirementId} · r${e.revision}`
	})), [l, u] = (0, _.useState)([]), [d, f] = (0, _.useState)([{
		id: "PO-APPROVAL",
		label: "Product owner release approval",
		authorityReference: "Product owner"
	}]), [p, m] = (0, _.useState)("Release gates configured");
	return (0, _.useEffect)(() => {
		let t = !0;
		return n.command("release.config.get", { releaseId: e.id }).then((e) => {
			let n = e?.configuration;
			t && n && (n.baselineId && s(String(n.baselineId)), Array.isArray(n.mandatoryTestCases) && u(n.mandatoryTestCases.map((e) => c.find((t) => t.id === e.testCaseId) ?? {
				kind: "test_case",
				id: String(e.testCaseId),
				title: String(e.testCaseId),
				meta: ""
			})), Array.isArray(n.approvalGates) && n.approvalGates.length && f(n.approvalGates.map((e) => ({
				id: String(e.id ?? ""),
				label: String(e.label ?? ""),
				authorityReference: String(e.authorityReference ?? "")
			}))), m("Release gates updated"));
		}).catch(() => void 0), () => {
			t = !1;
		};
	}, [n, e.id]), /* @__PURE__ */ (0, U.jsxs)(Sn, {
		title: `Release gates · ${e.name}`,
		submit: "Save gates",
		wide: !0,
		onSubmit: async () => {
			let a = await n.command("release.config.get", { releaseId: e.id });
			await r("release.config.set", {
				releaseId: e.id,
				baselineId: o,
				approvalGates: d.filter((e) => e.id && e.label && e.authorityReference),
				mandatoryTestCases: l.map((e) => ({
					testCaseId: e.id,
					testCaseRevision: t.testCases.find((t) => t.id === e.id)?.revision
				})),
				expectedRevision: a.configuration?.revision ?? 0,
				reason: p
			}, "Release gates saved"), i();
		},
		children: [
			/* @__PURE__ */ (0, U.jsx)(K, {
				label: "Frozen baseline",
				children: /* @__PURE__ */ (0, U.jsx)("select", {
					value: o,
					onChange: (e) => s(e.currentTarget.value),
					required: !0,
					children: a.map((e) => /* @__PURE__ */ (0, U.jsxs)("option", {
						value: e.id,
						children: [
							e.name,
							" (",
							e.id,
							")"
						]
					}, e.id))
				})
			}),
			/* @__PURE__ */ (0, U.jsx)(K, {
				label: "Mandatory test cases",
				hint: "Each must verify a requirement in the baseline.",
				children: /* @__PURE__ */ (0, U.jsx)(Zt, {
					label: "mandatory test cases",
					multiple: !0,
					options: c,
					value: l,
					onChange: u
				})
			}),
			/* @__PURE__ */ (0, U.jsxs)("fieldset", {
				className: "gates",
				children: [
					/* @__PURE__ */ (0, U.jsx)("legend", { children: "Approval gates" }),
					d.map((e, t) => /* @__PURE__ */ (0, U.jsxs)("div", {
						className: "grid-3",
						children: [
							/* @__PURE__ */ (0, U.jsx)("input", {
								"aria-label": "Gate ID",
								className: "mono",
								value: e.id,
								onChange: (e) => {
									let n = e.currentTarget.value;
									f((e) => e.map((e, r) => r === t ? {
										...e,
										id: n
									} : e));
								}
							}),
							/* @__PURE__ */ (0, U.jsx)("input", {
								"aria-label": "Gate label",
								value: e.label,
								onChange: (e) => {
									let n = e.currentTarget.value;
									f((e) => e.map((e, r) => r === t ? {
										...e,
										label: n
									} : e));
								}
							}),
							/* @__PURE__ */ (0, U.jsx)("input", {
								"aria-label": "Who decides",
								value: e.authorityReference,
								onChange: (e) => {
									let n = e.currentTarget.value;
									f((e) => e.map((e, r) => r === t ? {
										...e,
										authorityReference: n
									} : e));
								}
							})
						]
					}, t)),
					/* @__PURE__ */ (0, U.jsx)("button", {
						type: "button",
						className: "link",
						onClick: () => f((e) => [...e, {
							id: "",
							label: "",
							authorityReference: ""
						}]),
						children: "+ Add gate"
					})
				]
			}),
			/* @__PURE__ */ (0, U.jsx)(Cn, {
				value: p,
				onChange: m
			})
		]
	});
}
function Rn({ title: e, submit: t, initial: n, onConfirm: r, decision: i }) {
	let { close: a, ws: o } = B(), s = !!i && o.settings.approvals.decisionReason === "typed", [c, l] = (0, _.useState)(s ? "" : n), u = Bt(e.includes("Rejected") ? "Rejected" : e.includes("Draft") ? "Draft" : "") || (s ? "Why this decision?" : "");
	return /* @__PURE__ */ (0, U.jsx)(Sn, {
		title: e,
		submit: t,
		onSubmit: async () => {
			if (u && !c.trim()) throw Error("Please say what needs to change.");
			await r(c.trim()), a();
		},
		children: /* @__PURE__ */ (0, U.jsx)(Cn, {
			value: c,
			onChange: l,
			prompt: u || void 0
		})
	});
}
// client/src/people.tsx
var zn = /* @__PURE__ */ new Map(), Bn = !1, Vn = /* @__PURE__ */ new Set();
function Hn(e, t, n) {
	zn = new Map(e.map((e) => [e.id, e.name])), Bn = t, n?.name && zn.set(n.id, n.name), Vn.forEach((e) => e());
}
function Un(e) {
	let t = e == null ? "" : String(e);
	return zn.get(t) ?? (Bn && /^\d+$/.test(t) ? `Account ${t}` : t);
}
function Wn() {
	let [, e] = (0, _.useState)(0);
	(0, _.useEffect)(() => {
		let t = () => e((e) => e + 1);
		return Vn.add(t), () => {
			Vn.delete(t);
		};
	}, []);
}
function Gn({ id: e }) {
	return Wn(), /* @__PURE__ */ (0, U.jsx)("span", {
		title: e == null ? void 0 : String(e),
		children: Un(e)
	});
}
// client/src/router.ts
var Kn = [
	"home",
	"requirements",
	"trace",
	"flow",
	"verification",
	"baselines",
	"library",
	"elements",
	"diagrams",
	"exchange",
	"agents",
	"datamodel",
	"governance"
];
function qn(e) {
	let [t, n = ""] = e.replace(/^#\/?/, "").split("?"), [r = "", i = "home", ...a] = t.split("/").map((e) => decodeURIComponent(e));
	return {
		scope: r,
		view: Kn.includes(i) ? i : "home",
		id: a.join("/"),
		params: new URLSearchParams(n)
	};
}
function Jn(e, t) {
	let n = new URLSearchParams();
	for (let [e, r] of Object.entries(t ?? {})) r && n.set(e, r);
	let r = n.toString();
	return `#/${encodeURIComponent(e.scope)}/${e.view ?? "home"}${e.id ? `/${encodeURIComponent(e.id)}` : ""}${r ? `?${r}` : ""}`;
}
function Yn() {
	let [e, t] = (0, _.useState)(() => qn(window.location.hash));
	return (0, _.useEffect)(() => {
		let e = () => t(qn(window.location.hash));
		return window.addEventListener("hashchange", e), () => window.removeEventListener("hashchange", e);
	}, []), [e, (0, _.useCallback)((e, n = !1) => {
		n ? window.history.replaceState(null, "", e) : window.history.pushState(null, "", e), t(qn(e));
	}, [])];
}
// client/src/diff.ts
function Xn(e, t) {
	let n = [{
		text: e,
		op: "del"
	}, {
		text: t,
		op: "ins"
	}];
	if (e === t) return e ? [{
		text: e,
		op: "same"
	}] : [];
	if (!e) return [{
		text: t,
		op: "ins"
	}];
	if (!t) return [{
		text: e,
		op: "del"
	}];
	let r = e.split(/(\s+)/), i = t.split(/(\s+)/);
	if (r.length * i.length > 25e4) return n;
	let a = (e) => !e || /^\s+$/.test(e), o = (e, t) => e === t && !a(e), s = Array.from({ length: r.length + 1 }, () => new Uint16Array(i.length + 1));
	for (let e = r.length - 1; e >= 0; e--) for (let t = i.length - 1; t >= 0; t--) s[e][t] = o(r[e], i[t]) ? s[e + 1][t + 1] + 1 : Math.max(s[e + 1][t], s[e][t + 1]);
	let c = (e) => e.filter((e) => !a(e)).length;
	if (s[0][0] * 2 < Math.max(c(r), c(i))) {
		let e = 0, t = 0;
		for (; e < r.length && e < i.length && r[e] === i[e];) e++;
		for (; t < r.length - e && t < i.length - e && r[r.length - 1 - t] === i[i.length - 1 - t];) t++;
		for (; e > 0 && !a(r[e - 1]);) e--;
		for (; t > 0 && !a(r[r.length - t]);) t--;
		let o = r.slice(0, e).join(""), s = r.slice(r.length - t).join(""), c = r.slice(e, r.length - t).join(""), l = i.slice(e, i.length - t).join("");
		return !o && !s ? n : [
			{
				text: o,
				op: "same"
			},
			{
				text: c,
				op: "del"
			},
			{
				text: " ",
				op: "same"
			},
			{
				text: l,
				op: "ins"
			},
			{
				text: s,
				op: "same"
			}
		].filter((e) => e.text && (e.op !== "same" || e.text !== " " || !!c && !!l));
	}
	let l = [], u = 0, d = 0;
	for (; u < r.length || d < i.length;) u < r.length && d < i.length && o(r[u], i[d]) || u < r.length && d < i.length && a(r[u]) && a(i[d]) && r[u] === i[d] ? (l.push({
		text: r[u],
		op: "same"
	}), u++, d++) : d >= i.length || u < r.length && s[u + 1][d] >= s[u][d + 1] ? l.push({
		text: r[u++],
		op: "del"
	}) : l.push({
		text: i[d++],
		op: "ins"
	});
	let f = [], p = (e, t) => {
		if (!e) return;
		let n = f[f.length - 1];
		n?.op === t ? n.text += e : f.push({
			text: e,
			op: t
		});
	}, m = 0;
	for (; m < l.length;) {
		if (l[m].op === "same") {
			p(l[m].text, "same"), m++;
			continue;
		}
		let e = "", t = "", n = m;
		for (let e = m; e < l.length; e++) {
			let t = l[e];
			if (t.op === "same" && !a(t.text)) break;
			if (t.op === "same") {
				let t = l.slice(e + 1).find((e) => !(e.op === "same" && a(e.text)));
				if (!t || t.op === "same") break;
			}
			n = e + 1;
		}
		for (let r = m; r < n; r++) {
			let n = l[r];
			n.op !== "ins" && (e += n.text), n.op !== "del" && (t += n.text);
		}
		let r = /^\s*/.exec(e)[0] === /^\s*/.exec(t)[0] ? /^\s*/.exec(e)[0] : "", i = /\s*$/.exec(e)[0] === /\s*$/.exec(t)[0] ? /\s*$/.exec(e)[0] : "";
		p(r, "same"), p(e.slice(r.length, e.length - i.length), "del"), e.trim() && t.trim() && p(" ", "same"), p(t.slice(r.length, t.length - i.length), "ins"), p(i, "same"), m = n;
	}
	return f;
}
// client/src/views/History.tsx
var Zn = /* @__PURE__ */ new Set([
	"revision",
	"rev",
	"id",
	"depth",
	"state",
	"metamodelRevision"
]), Qn = {
	statement: "Statement",
	criteria: "Acceptance criteria",
	rationale: "Rationale",
	category: "Category",
	parents: "Parents",
	appliesTo: "Applies to",
	name: "Name",
	intendedOutcome: "Intended outcome",
	description: "Description",
	objective: "Objective",
	acceptanceCriteriaProcedure: "Procedure",
	method: "Method",
	minLevel: "Minimum level",
	targetLevel: "Target level",
	applicableLevels: "Applicable levels",
	mandatory: "Mandatory",
	requirementRevision: "Requirement revision",
	actorType: "Actor type",
	title: "Title",
	owner: "Owner",
	versionUrl: "Source link",
	comment: "Comment",
	sourceUrl: "Source link"
}, $n = {
	"requirements.create": "Created",
	"requirements.revise": "Revised",
	"requirements.transition": "Lifecycle decision",
	"hierarchy.set": "Parents changed",
	"hierarchy.batchSet": "Parents changed",
	"test_cases.create": "Created",
	"test_cases.update": "Revised",
	"actors.create": "Created",
	"actors.update": "Revised",
	"use_cases.create": "Created",
	"use_cases.update": "Revised",
	"traceability.add": "Linked"
}, er = (e) => $n[e] ?? e;
function tr(e) {
	if (e.clientName) return String(e.clientName);
	let t = e.clientId === void 0 || e.clientId === null ? "" : String(e.clientId);
	return t.startsWith("token:") ? "access token" : t || (e.connectionId ? "agent connection" : "");
}
var nr = (e) => Array.isArray(e) ? e.length ? e.join(", ") : "none" : typeof e == "boolean" ? e ? "Yes" : "No" : e == null || e === "" ? "—" : String(e);
function rr({ field: e, before: t, after: n }) {
	let r = Qn[e] ?? e;
	if (typeof t == "string" && typeof n == "string" && (t.length > 40 || n.length > 40)) {
		let e = Xn(t, n);
		return e.some((e) => e.op === "same") ? /* @__PURE__ */ (0, U.jsxs)("div", {
			className: "change",
			children: [/* @__PURE__ */ (0, U.jsx)("span", {
				className: "change-label",
				children: r
			}), /* @__PURE__ */ (0, U.jsx)("p", {
				className: "diff",
				children: e.map((e, t) => e.op === "same" ? /* @__PURE__ */ (0, U.jsx)("span", { children: e.text }, t) : e.op === "del" ? /* @__PURE__ */ (0, U.jsx)("del", { children: e.text }, t) : /* @__PURE__ */ (0, U.jsx)("ins", { children: e.text }, t))
			})]
		}) : /* @__PURE__ */ (0, U.jsxs)("div", {
			className: "change",
			children: [/* @__PURE__ */ (0, U.jsx)("span", {
				className: "change-label",
				children: r
			}), e.map((e, t) => /* @__PURE__ */ (0, U.jsx)("p", {
				className: "diff diff-whole",
				children: e.op === "del" ? /* @__PURE__ */ (0, U.jsx)("del", { children: e.text }) : /* @__PURE__ */ (0, U.jsx)("ins", { children: e.text })
			}, t))]
		});
	}
	return /* @__PURE__ */ (0, U.jsxs)("div", {
		className: "change",
		children: [/* @__PURE__ */ (0, U.jsx)("span", {
			className: "change-label",
			children: r
		}), /* @__PURE__ */ (0, U.jsxs)("p", { children: [
			/* @__PURE__ */ (0, U.jsx)("del", { children: nr(t) }),
			" → ",
			/* @__PURE__ */ (0, U.jsx)("ins", { children: nr(n) })
		] })]
	});
}
function ir({ recordId: e, recordKind: t }) {
	let { api: n } = B();
	Wn();
	let [r, i] = (0, _.useState)([]), [a, o] = (0, _.useState)(!0), [s, c] = (0, _.useState)(""), [l, u] = (0, _.useState)(0);
	(0, _.useEffect)(() => {
		let r = !0;
		return o(!0), c(""), wt(n, "audit.list", {
			recordId: e,
			recordKind: t
		}).then((e) => {
			r && i(e);
		}).catch((e) => {
			r && !z(e) && c(V(e, "History could not be loaded."));
		}).finally(() => {
			r && o(!1);
		}), () => {
			r = !1;
		};
	}, [
		n,
		e,
		t,
		l
	]);
	let d = [...r].reverse();
	return /* @__PURE__ */ (0, U.jsxs)("div", {
		className: "detail-body history",
		children: [
			a && !r.length && /* @__PURE__ */ (0, U.jsx)("p", {
				role: "status",
				className: "muted",
				children: "Loading history…"
			}),
			s && /* @__PURE__ */ (0, U.jsxs)("p", {
				className: "error",
				role: "alert",
				children: [
					s,
					" ",
					!r.length && /* @__PURE__ */ (0, U.jsx)("button", {
						type: "button",
						className: "link",
						onClick: () => u((e) => e + 1),
						children: "Retry history"
					})
				]
			}),
			/* @__PURE__ */ (0, U.jsx)("ol", {
				className: "timeline",
				children: d.map((e) => {
					let n = e.before ?? {}, r = e.after ?? {}, i = Object.keys({
						...n,
						...r
					}).filter((t) => !Zn.has(t) && JSON.stringify(n[t]) !== JSON.stringify(r[t]) && e.before), a = e.before && n.state !== r.state, o = e.at ?? e.createdAt;
					return /* @__PURE__ */ (0, U.jsxs)("li", { children: [
						/* @__PURE__ */ (0, U.jsxs)("div", {
							className: "timeline-head",
							children: [
								/* @__PURE__ */ (0, U.jsx)("strong", { children: er(e.operation) }),
								t === "requirement" && r.rev !== void 0 ? /* @__PURE__ */ (0, U.jsxs)("span", {
									className: "muted small",
									children: ["Rev ", r.rev]
								}) : r.revision !== void 0 && /* @__PURE__ */ (0, U.jsxs)("span", {
									className: "muted small",
									children: ["revision ", r.revision]
								}),
								/* @__PURE__ */ (0, U.jsxs)("span", {
									className: "muted small attribution",
									title: o,
									children: [
										e.actorType && e.actorType !== "human" && /* @__PURE__ */ (0, U.jsx)("span", {
											className: "pill",
											children: e.actorType === "agent" ? "Agent" : "Automation"
										}),
										/* @__PURE__ */ (0, U.jsxs)("span", { children: [
											/* @__PURE__ */ (0, U.jsx)(Gn, { id: e.actor }),
											" · ",
											Ht(o)
										] }),
										(e.clientId || e.connectionId) && /* @__PURE__ */ (0, U.jsxs)("span", {
											className: "via-id",
											title: e.clientId ?? e.connectionId,
											children: ["via ", tr(e)]
										}),
										e.reportedModel && /* @__PURE__ */ (0, U.jsxs)("span", { children: [
											"model ",
											e.reportedModel,
											" (reported)"
										] })
									]
								})
							]
						}),
						a && /* @__PURE__ */ (0, U.jsxs)("p", {
							className: "state-change",
							children: [
								/* @__PURE__ */ (0, U.jsx)(W, { state: n.state }),
								" → ",
								/* @__PURE__ */ (0, U.jsx)(W, { state: r.state })
							]
						}),
						!e.before && r.state && /* @__PURE__ */ (0, U.jsxs)("p", {
							className: "state-change",
							children: ["Started as ", /* @__PURE__ */ (0, U.jsx)(W, { state: r.state })]
						}),
						i.map((e) => /* @__PURE__ */ (0, U.jsx)(rr, {
							field: e,
							before: n[e],
							after: r[e]
						}, e)),
						/* @__PURE__ */ (0, U.jsxs)("p", {
							className: "reason",
							children: [
								"“",
								e.reason,
								"”"
							]
						})
					] }, e.id);
				})
			}),
			!a && !r.length && !s && /* @__PURE__ */ (0, U.jsx)("p", {
				className: "muted",
				children: "No history recorded."
			}),
			/* @__PURE__ */ (0, U.jsx)(ar, { recordId: e })
		]
	});
}
function ar({ recordId: e }) {
	let { api: t } = B();
	Wn();
	let [n, r] = (0, _.useState)([]);
	(0, _.useEffect)(() => {
		let n = !0;
		return r([]), t.command("imported.list", {
			kind: "historical_change",
			recordId: e
		}).then((e) => {
			n && r(Array.isArray(e.items) ? e.items : []);
		}).catch(() => {
			n && r([]);
		}), () => {
			n = !1;
		};
	}, [t, e]);
	let i = [...n].sort((e, t) => String(t.at ?? "").localeCompare(String(e.at ?? "")));
	return i.length ? /* @__PURE__ */ (0, U.jsxs)("section", {
		className: "workbook-history",
		"aria-label": "Workbook history",
		children: [/* @__PURE__ */ (0, U.jsx)("h3", { children: "Workbook history (read-only)" }), /* @__PURE__ */ (0, U.jsx)("ol", {
			className: "timeline",
			children: i.map((e, t) => /* @__PURE__ */ (0, U.jsxs)("li", { children: [
				/* @__PURE__ */ (0, U.jsxs)("div", {
					className: "timeline-head",
					children: [
						/* @__PURE__ */ (0, U.jsx)("strong", { children: e.action }),
						e.field && /* @__PURE__ */ (0, U.jsx)("span", {
							className: "muted small",
							children: e.field
						}),
						/* @__PURE__ */ (0, U.jsxs)("span", {
							className: "muted small",
							title: `${e.at} · ${e.actor ?? ""}`,
							children: [
								[Un(e.actor), e.model].filter(Boolean).join(" · "),
								" · ",
								Ht(e.at)
							]
						})
					]
				}),
				(e.oldValue !== void 0 || e.newValue !== void 0) && /* @__PURE__ */ (0, U.jsx)(rr, {
					field: e.field ?? "value",
					before: e.oldValue,
					after: e.newValue
				}),
				e.reason && /* @__PURE__ */ (0, U.jsxs)("p", {
					className: "reason",
					children: [
						"“",
						e.reason,
						"”"
					]
				})
			] }, `${e.at}-${t}`))
		})]
	}) : null;
}
// client/src/operations.ts
var or = {
	"admin.projects.list": "List RMS projects (System Admin)",
	"admin.projects.setState": "Change an RMS project state (System Admin)",
	"members.list": "List member roles",
	"members.setRole": "Change a member role",
	"people.list": "List people",
	"maturity.levels": "Read maturity levels",
	"products.setMaturityLevels": "Set maturity levels",
	"release.readiness": "Check release readiness",
	"release.config.get": "Read release gates",
	"release.config.set": "Configure release gates",
	"settings.get": "Read governance settings",
	"settings.set": "Change governance settings",
	"security.events.list": "List blocked attempts",
	"audit.list": "Read the audit trail",
	"flow.get": "Open the flow view",
	"imported.list": "List imported history",
	"ids.propose": "Propose an ID",
	"requirements.impact": "Preview requirement impact",
	"verification.evaluate": "Evaluate verification",
	"verification.summary": "Read verification summary",
	"verification.attest": "Attest test coverage",
	"traceability.types": "Read link types",
	"traceability.types.set": "Change link types",
	"hierarchy.get": "Read the hierarchy",
	"baselines.compare": "Compare baselines",
	"diagrams.acceptBindings": "Accept diagram bindings",
	"reqif.export": "Export ReqIF",
	"reqif.export.record": "Record a ReqIF export",
	"reqif.import.begin": "Start a ReqIF import",
	"reqif.import.preview": "Preview a ReqIF import",
	"reqif.import.commit": "Import ReqIF"
}, sr = {
	requirements: "requirement",
	test_cases: "test case",
	test_executions: "test run",
	use_cases: "use case",
	actors: "actor",
	baselines: "baseline",
	traceability: "link",
	hierarchy: "parents",
	products: "product",
	external_documents: "external document",
	elements: "element",
	diagrams: "diagram",
	processes: "lifecycle process",
	metamodel: "data model",
	connections: "agent connection",
	id_policies: "ID policy"
}, cr = {
	version: "document version",
	versions: "document versions",
	pins: "review pin"
}, lr = {
	create: "Create",
	revise: "Revise",
	update: "Update",
	transition: "Change state of",
	batchCreate: "Create several",
	batchTransition: "Change state of several",
	add: "Add",
	remove: "Remove",
	set: "Set",
	batchSet: "Set",
	freeze: "Freeze",
	revoke: "Revoke",
	list: "List",
	get: "Read",
	setStatus: "Set status of",
	reply: "Reply to",
	resolve: "Resolve"
};
function ur(e) {
	if (or[e]) return or[e];
	let t = e.split("."), n = lr[t.at(-1) ?? ""], r = t.length === 3 ? cr[t[1]] : sr[t[0]];
	return n && r ? `${n} ${r}` : e.replace(/[._]/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase().replace(/^./, (e) => e.toUpperCase());
}
// client/src/views/Agents.tsx
var dr = {
	full: "Full access",
	"read-only": "Read-only"
}, fr = {
	human: "Person",
	agent: "Agent",
	automation: "Automation"
}, pr = {
	forbidden: "Not permitted",
	governance_refused: "Refused by the lifecycle rules",
	self_approval_refused: "Approving own work refused",
	agent_decision_refused: "Decision left to a person",
	read_only_write_denied: "Write blocked on read-only connection",
	authority_field: "Tried to set authority fields"
}, mr = (e) => e.state === "Active", hr = ur;
function gr() {
	let { api: e, session: t, open: n, run: r } = B(), [i, a] = (0, _.useState)([]), o = new Map(i.map((e) => [String(e.id), String(e.clientName || "Unnamed client")])), [s, c] = (0, _.useState)(!0), [l, u] = (0, _.useState)(""), [d, f] = (0, _.useState)(0), p = (0, _.useCallback)(() => f((e) => e + 1), []);
	(0, _.useEffect)(() => {
		let t = !0;
		return c(!0), u(""), e.command("connections.list").then((e) => {
			t && a(e.items ?? []);
		}).catch((e) => {
			t && !z(e) && u(V(e, "Connections could not be loaded."));
		}).finally(() => {
			t && c(!1);
		}), () => {
			t = !1;
		};
	}, [e, d]);
	let m = [...i].sort((e, t) => Number(mr(t)) - Number(mr(e)) || String(t.approvedAt ?? "").localeCompare(String(e.approvedAt ?? "")));
	return /* @__PURE__ */ (0, U.jsxs)("div", {
		className: "page",
		children: [
			/* @__PURE__ */ (0, U.jsx)("h1", {
				className: "vh",
				children: "Agent connections"
			}),
			/* @__PURE__ */ (0, U.jsx)(vr, {}),
			/* @__PURE__ */ (0, U.jsxs)("section", {
				"aria-labelledby": "connections-title",
				children: [
					/* @__PURE__ */ (0, U.jsx)("h2", {
						id: "connections-title",
						className: "section-title",
						title: "Agents act on your behalf with the access you approved. Revoking stops them immediately.",
						children: "Connected agents"
					}),
					i.length > 0 && /* @__PURE__ */ (0, U.jsx)("p", {
						className: "muted small",
						children: "Revoking stops an agent immediately."
					}),
					l && /* @__PURE__ */ (0, U.jsxs)("p", {
						className: "error",
						role: "alert",
						children: [
							l,
							" ",
							/* @__PURE__ */ (0, U.jsx)("button", {
								type: "button",
								className: "link",
								onClick: p,
								children: "Try again"
							})
						]
					}),
					s && !i.length && /* @__PURE__ */ (0, U.jsx)("p", {
						role: "status",
						className: "muted",
						children: "Loading connections…"
					}),
					!s && !l && !i.length && /* @__PURE__ */ (0, U.jsx)(Qt, {
						title: "No agents connected yet",
						children: "Connect an agent above. It appears here once you approve it. Agents act with the access you approved, and revoking stops them immediately."
					}),
					m.length > 0 && /* @__PURE__ */ (0, U.jsx)("div", {
						className: "table-wrap",
						children: /* @__PURE__ */ (0, U.jsxs)("table", {
							className: "matrix",
							"aria-label": "Agent connections",
							children: [/* @__PURE__ */ (0, U.jsx)("thead", { children: /* @__PURE__ */ (0, U.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, U.jsx)("th", {
									scope: "col",
									children: "Client"
								}),
								/* @__PURE__ */ (0, U.jsx)("th", {
									scope: "col",
									children: "Access"
								}),
								/* @__PURE__ */ (0, U.jsx)("th", {
									scope: "col",
									children: "Approved by"
								}),
								/* @__PURE__ */ (0, U.jsx)("th", {
									scope: "col",
									children: "Returns to"
								}),
								/* @__PURE__ */ (0, U.jsx)("th", {
									scope: "col",
									children: "Status"
								}),
								/* @__PURE__ */ (0, U.jsx)("th", {
									scope: "col",
									children: /* @__PURE__ */ (0, U.jsx)("span", {
										className: "visually-hidden",
										children: "Actions"
									})
								})
							] }) }), /* @__PURE__ */ (0, U.jsx)("tbody", { children: m.map((e) => /* @__PURE__ */ (0, U.jsx)(yr, {
								connection: e,
								onRevoke: () => n(/* @__PURE__ */ (0, U.jsx)(Rn, {
									title: `Revoke access · ${e.id}`,
									submit: "Revoke access",
									initial: "No longer needed",
									onConfirm: async (t) => {
										await r("connections.revoke", {
											id: e.id,
											expectedRevision: e.revision,
											reason: t
										}, `${e.clientName ?? "Agent"} access revoked`), p();
									}
								}))
							}, e.id)) })]
						})
					})
				]
			}),
			t.role === "admin" && /* @__PURE__ */ (0, U.jsx)(xr, { clients: o })
		]
	});
}
function _r({ label: e, value: t }) {
	let n = (0, _.useId)(), [r, i] = (0, _.useState)("");
	async function a() {
		try {
			await navigator.clipboard.writeText(t), i("Copied to the clipboard.");
		} catch {
			i("Copy is not available here. Select the text and copy it manually.");
		}
	}
	return /* @__PURE__ */ (0, U.jsxs)("div", {
		className: "copy-field",
		role: "group",
		"aria-labelledby": n,
		children: [
			/* @__PURE__ */ (0, U.jsx)("span", {
				id: n,
				children: e
			}),
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "copy-row",
				children: [/* @__PURE__ */ (0, U.jsx)("input", {
					readOnly: !0,
					"aria-labelledby": n,
					value: t,
					onFocus: (e) => e.currentTarget.select()
				}), /* @__PURE__ */ (0, U.jsx)("button", {
					type: "button",
					onClick: () => void a(),
					"aria-label": `Copy ${e.toLowerCase()}`,
					children: "Copy"
				})]
			}),
			/* @__PURE__ */ (0, U.jsx)("small", {
				role: "status",
				className: "copy-status",
				children: r
			})
		]
	});
}
function vr() {
	let e = `${window.location.origin}/mcp`, t = `claude mcp add --transport http rms ${e} --header "Authorization: Bearer <agent token>"`;
	return /* @__PURE__ */ (0, U.jsxs)("section", {
		className: "card connect",
		"aria-labelledby": "connect-title",
		children: [/* @__PURE__ */ (0, U.jsx)("h2", {
			id: "connect-title",
			children: "Connect an agent"
		}), /* @__PURE__ */ (0, U.jsxs)("div", {
			className: "connect-grid",
			children: [/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "connect-option",
				children: [
					/* @__PURE__ */ (0, U.jsx)("h3", { children: "Claude app or claude.ai" }),
					/* @__PURE__ */ (0, U.jsx)("p", { children: "Add a custom connector with this URL, then approve it here." }),
					/* @__PURE__ */ (0, U.jsx)(_r, {
						label: "Connector URL",
						value: e
					})
				]
			}), /* @__PURE__ */ (0, U.jsxs)("div", {
				className: "connect-option",
				children: [
					/* @__PURE__ */ (0, U.jsx)("h3", { children: "Claude Code, Codex or scripts" }),
					/* @__PURE__ */ (0, U.jsx)("p", { children: "Ask your administrator for an agent token, then:" }),
					/* @__PURE__ */ (0, U.jsx)(_r, {
						label: "Claude Code command",
						value: t
					})
				]
			})]
		})]
	});
}
function yr({ connection: e, onRevoke: t }) {
	let [n, r] = (0, _.useState)(!1), i = (0, _.useId)(), a = e.clientName || "Unnamed client", o = mr(e);
	return /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [/* @__PURE__ */ (0, U.jsxs)("tr", { children: [
		/* @__PURE__ */ (0, U.jsx)("th", {
			scope: "row",
			children: /* @__PURE__ */ (0, U.jsx)("span", {
				className: "clamp",
				children: a
			})
		}),
		/* @__PURE__ */ (0, U.jsx)("td", { children: /* @__PURE__ */ (0, U.jsx)("span", {
			className: "pill",
			children: dr[e.mode] ?? e.mode
		}) }),
		/* @__PURE__ */ (0, U.jsxs)("td", { children: [
			/* @__PURE__ */ (0, U.jsx)(Gn, { id: e.principalId }),
			/* @__PURE__ */ (0, U.jsx)("br", {}),
			/* @__PURE__ */ (0, U.jsx)("small", {
				className: "muted",
				children: Ht(e.approvedAt)
			})
		] }),
		/* @__PURE__ */ (0, U.jsx)("td", {
			className: "mono small",
			children: e.redirectHost || "—"
		}),
		/* @__PURE__ */ (0, U.jsx)("td", { children: o ? /* @__PURE__ */ (0, U.jsx)("span", {
			className: "pill",
			"data-tone": "good",
			children: "Active"
		}) : /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [
			/* @__PURE__ */ (0, U.jsx)("span", {
				className: "pill",
				"data-state": "Retired",
				children: "Revoked"
			}),
			/* @__PURE__ */ (0, U.jsx)("br", {}),
			/* @__PURE__ */ (0, U.jsxs)("small", {
				className: "muted",
				children: [Ht(e.revokedAt), e.revokedBy ? /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [" by ", /* @__PURE__ */ (0, U.jsx)(Gn, { id: e.revokedBy })] }) : ""]
			})
		] }) }),
		/* @__PURE__ */ (0, U.jsx)("td", { children: /* @__PURE__ */ (0, U.jsxs)("div", {
			className: "actions",
			children: [/* @__PURE__ */ (0, U.jsx)("button", {
				type: "button",
				className: "small",
				"aria-expanded": n,
				"aria-controls": n ? i : void 0,
				"aria-label": `Activity for ${a}`,
				onClick: () => r((e) => !e),
				children: "Activity"
			}), o && /* @__PURE__ */ (0, U.jsx)(G, {
				className: "small",
				onClick: t,
				children: "Revoke"
			})]
		}) })
	] }), n && /* @__PURE__ */ (0, U.jsx)("tr", {
		id: i,
		children: /* @__PURE__ */ (0, U.jsx)("td", {
			colSpan: 6,
			className: "activity-cell",
			children: /* @__PURE__ */ (0, U.jsx)(br, { connectionId: e.id })
		})
	})] });
}
function br({ connectionId: e }) {
	let { api: t, session: n } = B(), [r, i] = (0, _.useState)(null), [a, o] = (0, _.useState)("");
	if ((0, _.useEffect)(() => {
		let r = !0, a = [];
		return (async () => {
			let o;
			for (let n = 0; n < 200; n++) {
				let n = await t.command("audit.list", {
					connectionId: e,
					limit: 50,
					...o ? { cursor: o } : {}
				});
				if (a.push(...(n.items ?? []).map((e) => ({
					...e,
					kind: "change"
				}))), !n.nextCursor) break;
				o = n.nextCursor;
			}
			if (n.role === "admin") {
				let n = await t.command("security.events.list", {
					connectionId: e,
					limit: 100
				});
				a.push(...(n.items ?? []).map((e) => ({
					...e,
					kind: "blocked"
				})));
			}
			a.sort((e, t) => String(t.at).localeCompare(String(e.at))), r && i(a);
		})().catch((e) => {
			r && !z(e) && o(V(e, "Activity could not be loaded."));
		}), () => {
			r = !1;
		};
	}, [
		t,
		e,
		n.role
	]), a) return /* @__PURE__ */ (0, U.jsx)("p", {
		className: "error",
		role: "alert",
		children: a
	});
	if (!r) return /* @__PURE__ */ (0, U.jsx)("p", {
		role: "status",
		className: "muted small",
		children: "Loading activity…"
	});
	let s = /* @__PURE__ */ (0, U.jsxs)("p", {
		className: "muted small",
		children: [
			"Changes",
			n.role === "admin" ? " and blocked attempts" : "",
			" are listed. Reads are not recorded."
		]
	});
	return r.length ? /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [/* @__PURE__ */ (0, U.jsx)("ol", {
		className: "activity-list",
		"aria-label": "Activity, newest first",
		children: r.map((e) => /* @__PURE__ */ (0, U.jsxs)("li", { children: [
			/* @__PURE__ */ (0, U.jsx)("span", {
				className: "muted",
				title: e.at,
				children: Ht(e.at)
			}),
			e.kind === "blocked" ? /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [
				/* @__PURE__ */ (0, U.jsx)("span", {
					className: "pill",
					"data-tone": "bad",
					children: "Blocked"
				}),
				/* @__PURE__ */ (0, U.jsx)("strong", { children: e.operation ? hr(e.operation) : pr[e.event] ?? e.event }),
				/* @__PURE__ */ (0, U.jsx)("span", {
					className: "muted small",
					children: pr[e.event] ?? e.event
				})
			] }) : /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [/* @__PURE__ */ (0, U.jsx)("strong", { children: er(e.operation) }), /* @__PURE__ */ (0, U.jsx)("span", {
				className: "mono small",
				children: e.record_id
			})] }),
			e.reportedModel && /* @__PURE__ */ (0, U.jsxs)("span", {
				className: "muted small",
				children: [
					"model ",
					e.reportedModel,
					" (reported)"
				]
			})
		] }, `${e.kind}:${e.id}`))
	}), s] }) : /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [/* @__PURE__ */ (0, U.jsxs)("p", {
		className: "muted small",
		children: [
			"No changes",
			n.role === "admin" ? " or blocked attempts" : "",
			" recorded for this connection yet."
		]
	}), s] });
}
function xr({ clients: e }) {
	let { api: t } = B(), [n, r] = (0, _.useState)([]), [i, a] = (0, _.useState)(null), [o, s] = (0, _.useState)(!0), [c, l] = (0, _.useState)("");
	(0, _.useEffect)(() => {
		let e = !0;
		return s(!0), l(""), t.command("security.events.list", { limit: 50 }).then((t) => {
			e && (r(t.items ?? []), a(t.nextCursor ?? null));
		}).catch((t) => {
			e && !z(t) && l(V(t, "Blocked attempts could not be loaded."));
		}).finally(() => {
			e && s(!1);
		}), () => {
			e = !1;
		};
	}, [t]);
	async function u() {
		if (i) {
			s(!0), l("");
			try {
				let e = await t.command("security.events.list", {
					limit: 50,
					cursor: i
				});
				r((t) => [...t, ...e.items ?? []]), a(e.nextCursor ?? null);
			} catch (e) {
				z(e) || l(V(e, "Blocked attempts could not be loaded."));
			} finally {
				s(!1);
			}
		}
	}
	return /* @__PURE__ */ (0, U.jsxs)("section", {
		className: "blocked-attempts",
		"aria-labelledby": "blocked-title",
		children: [
			/* @__PURE__ */ (0, U.jsx)("h2", {
				id: "blocked-title",
				className: "section-title",
				title: "Requests the workspace refused, from people, agents and automations. Only administrators see this list.",
				children: "Blocked attempts"
			}),
			/* @__PURE__ */ (0, U.jsx)("p", {
				className: "muted small",
				children: "Only administrators see this list."
			}),
			c && /* @__PURE__ */ (0, U.jsx)("p", {
				className: "error",
				role: "alert",
				children: c
			}),
			o && !n.length && /* @__PURE__ */ (0, U.jsx)("p", {
				role: "status",
				className: "muted",
				children: "Loading blocked attempts…"
			}),
			!o && !c && !n.length && /* @__PURE__ */ (0, U.jsx)(Qt, {
				title: "No blocked attempts",
				children: "Nothing has been refused in this workspace."
			}),
			n.length > 0 && /* @__PURE__ */ (0, U.jsx)("div", {
				className: "table-wrap",
				children: /* @__PURE__ */ (0, U.jsxs)("table", {
					className: "matrix",
					"aria-label": "Blocked attempts",
					children: [/* @__PURE__ */ (0, U.jsx)("thead", { children: /* @__PURE__ */ (0, U.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, U.jsx)("th", {
							scope: "col",
							children: "When"
						}),
						/* @__PURE__ */ (0, U.jsx)("th", {
							scope: "col",
							children: "Who"
						}),
						/* @__PURE__ */ (0, U.jsx)("th", {
							scope: "col",
							children: "What happened"
						}),
						/* @__PURE__ */ (0, U.jsx)("th", {
							scope: "col",
							children: "Operation"
						}),
						/* @__PURE__ */ (0, U.jsx)("th", {
							scope: "col",
							children: "Detail"
						})
					] }) }), /* @__PURE__ */ (0, U.jsx)("tbody", { children: n.map((t) => /* @__PURE__ */ (0, U.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, U.jsx)("td", { children: /* @__PURE__ */ (0, U.jsx)("span", {
							title: t.at,
							children: Ht(t.at)
						}) }),
						/* @__PURE__ */ (0, U.jsx)("td", { children: t.connectionId ? /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [
							/* @__PURE__ */ (0, U.jsx)("strong", { children: e.get(String(t.connectionId)) ?? "Agent connection" }),
							" ",
							/* @__PURE__ */ (0, U.jsx)("span", {
								className: "pill",
								children: fr[t.actorType] ?? "Agent"
							}),
							/* @__PURE__ */ (0, U.jsx)("br", {}),
							/* @__PURE__ */ (0, U.jsxs)("small", {
								className: "muted",
								children: [
									"approved by ",
									/* @__PURE__ */ (0, U.jsx)(Gn, { id: t.principal }),
									" · ",
									/* @__PURE__ */ (0, U.jsx)("span", {
										className: "mono",
										children: t.connectionId
									})
								]
							})
						] }) : /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [
							/* @__PURE__ */ (0, U.jsx)(Gn, { id: t.principal }),
							" ",
							/* @__PURE__ */ (0, U.jsx)("span", {
								className: "pill",
								children: fr[t.actorType] ?? "Person"
							})
						] }) }),
						/* @__PURE__ */ (0, U.jsx)("td", { children: pr[t.event] ?? t.event }),
						/* @__PURE__ */ (0, U.jsx)("td", { children: t.operation ? hr(t.operation) : "—" }),
						/* @__PURE__ */ (0, U.jsx)("td", {
							className: "muted small",
							children: t.detail || "—"
						})
					] }, t.id)) })]
				})
			}),
			i && /* @__PURE__ */ (0, U.jsx)("button", {
				type: "button",
				className: "small",
				disabled: o,
				onClick: () => void u(),
				children: "Load older attempts"
			})
		]
	});
}
// client/src/views/Baselines.tsx
var Sr = "Freezing a baseline needs the Product owner role.", Cr = (e) => (e.state ?? "Frozen") === "Frozen", wr = (e) => e.frozenBy ?? e.approvedBy, Tr = (e) => Number(e.rev ?? e.revision ?? 1);
function Er({ baseline: e }) {
	let t = Cr(e);
	return /* @__PURE__ */ (0, U.jsx)("span", {
		className: "pill",
		"data-state": t ? "Approved" : "Draft",
		children: t ? "Frozen" : "Draft"
	});
}
function Dr(e) {
	if (!Cr(e)) return "Draft, not frozen yet";
	let t = wr(e);
	return `Frozen${e.frozenAt ? ` ${Ht(e.frozenAt)}` : ""}${t ? ` by ${Un(t)}` : ""}`;
}
function Or() {
	let { ws: e, ix: t, scope: n, link: r, route: i, ensureBaselineMembers: a } = B();
	Wn();
	let o = e.baselines.filter((t) => !t.productId || It(e, n, {
		productId: t.productId,
		appliesTo: []
	})), s = (i.id ? o.concat(e.baselines).filter((e) => e.id === i.id).slice(0, 1) : o).filter((e) => !e.requirements).map((e) => e.id).join(",");
	(0, _.useEffect)(() => {
		a(s ? s.split(",") : []).catch(() => void 0);
	}, [s, a]);
	let c = i.id ? e.baselines.find((e) => e.id === i.id) : void 0;
	return c && !c.requirements ? /* @__PURE__ */ (0, U.jsx)("p", {
		className: "loading",
		role: "status",
		children: "Loading…"
	}) : c ? /* @__PURE__ */ (0, U.jsx)(kr, { baseline: c }) : /* @__PURE__ */ (0, U.jsxs)("div", {
		className: "page",
		children: [/* @__PURE__ */ (0, U.jsx)("h1", {
			className: "vh",
			children: "Baselines"
		}), o.length ? /* @__PURE__ */ (0, U.jsx)("div", {
			className: "card baseline-list",
			children: o.map((e) => {
				let n = e.requirements, i = n ? n.filter((e) => {
					let n = t.reqById.get(e.id);
					return !n || Tr(n) !== Tr(e);
				}).length : 0, a = Cr(e);
				return /* @__PURE__ */ (0, U.jsxs)("a", {
					className: "baseline-row",
					href: r("baselines", e.id),
					children: [
						/* @__PURE__ */ (0, U.jsx)("span", {
							className: "mono muted",
							children: e.id
						}),
						/* @__PURE__ */ (0, U.jsxs)("span", {
							className: "baseline-name",
							children: [
								e.name,
								e.productVersion && /* @__PURE__ */ (0, U.jsxs)("small", {
									className: "muted",
									children: [" · Version ", e.productVersion]
								}),
								/* @__PURE__ */ (0, U.jsxs)("small", {
									className: "muted baseline-count",
									children: [
										" · ",
										n?.length ?? e.memberCount ?? 0,
										" requirements"
									]
								})
							]
						}),
						/* @__PURE__ */ (0, U.jsxs)("span", {
							className: "muted",
							children: [n?.length ?? e.memberCount ?? 0, " requirements"]
						}),
						/* @__PURE__ */ (0, U.jsx)(Er, { baseline: e }),
						/* @__PURE__ */ (0, U.jsx)("span", {
							className: a ? i ? "warn-text" : "ok" : "muted",
							children: a ? i ? `${i} changed since freeze` : "Matches the live specification" : "Not frozen yet"
						})
					]
				}, e.id);
			})
		}) : /* @__PURE__ */ (0, U.jsx)(Qt, {
			title: "No baselines yet",
			children: "A baseline freezes the approved requirements as a reference you can compare against. Use Freeze a baseline above to create the first."
		})]
	});
}
function kr({ baseline: e }) {
	let { ws: t, ix: n, link: r, session: i, open: a, run: o } = B(), s = t.baselines.filter((t) => t.id !== e.id), [c, l] = (0, _.useState)("live"), { ensureBaselineMembers: u } = B();
	(0, _.useEffect)(() => {
		c !== "live" && u([c]).catch(() => void 0);
	}, [c, u]);
	let d = e.requirements ?? [], f = Cr(e), p = c === "live", m = p ? [] : t.baselines.find((e) => e.id === c)?.requirements ?? [], h = p ? d : m, g = p ? d.map((e) => n.reqById.get(e.id)).filter(Boolean) : d, v = new Map(h.map((e) => [e.id, e])), y = new Map(g.map((e) => [e.id, e])), b = p ? [] : [...y.keys()].filter((e) => !v.has(e)), x = p ? d.filter((e) => !n.reqById.has(e.id)).map((e) => e.id) : [...v.keys()].filter((e) => !y.has(e)), S = [...v.keys()].filter((e) => y.has(e) && Tr(y.get(e)) !== Tr(v.get(e))), C = t.baselines.find((e) => e.id === c)?.name;
	return /* @__PURE__ */ (0, U.jsxs)("div", {
		className: "page",
		children: [
			/* @__PURE__ */ (0, U.jsx)("a", {
				className: "back",
				href: r("baselines"),
				children: "← All baselines"
			}),
			/* @__PURE__ */ (0, U.jsxs)("header", {
				className: "page-head compact",
				children: [/* @__PURE__ */ (0, U.jsxs)("div", { children: [
					/* @__PURE__ */ (0, U.jsxs)("p", {
						className: "eyebrow mono",
						children: [
							e.id,
							" · ",
							/* @__PURE__ */ (0, U.jsx)(Er, { baseline: e })
						]
					}),
					/* @__PURE__ */ (0, U.jsx)("h1", { children: e.name }),
					/* @__PURE__ */ (0, U.jsxs)("p", {
						className: "lede",
						children: [
							d.length,
							" ",
							f ? "frozen" : "draft",
							" requirements",
							e.productVersion ? ` · version ${e.productVersion}` : ""
						]
					}),
					/* @__PURE__ */ (0, U.jsx)("p", {
						className: "muted small",
						children: Dr(e)
					})
				] }), /* @__PURE__ */ (0, U.jsxs)("div", {
					className: "actions",
					children: [!f && /* @__PURE__ */ (0, U.jsx)(G, {
						disabledReason: !ot(i) && Sr,
						onClick: () => a(/* @__PURE__ */ (0, U.jsx)(Rn, {
							title: `Freeze baseline · ${e.id}`,
							submit: "Freeze baseline",
							initial: "Baseline approved for release",
							decision: !0,
							onConfirm: async (t) => {
								await o("baselines.freeze", {
									id: e.id,
									expectedRevision: e.revision,
									reason: t
								}, "Baseline frozen");
							}
						})),
						children: "Freeze this baseline"
					}), /* @__PURE__ */ (0, U.jsxs)("label", {
						className: "field inline",
						children: [/* @__PURE__ */ (0, U.jsx)("span", { children: "Compare with" }), /* @__PURE__ */ (0, U.jsxs)("select", {
							value: c,
							onChange: (e) => l(e.currentTarget.value),
							children: [/* @__PURE__ */ (0, U.jsx)("option", {
								value: "live",
								children: "Current specification"
							}), s.map((e) => /* @__PURE__ */ (0, U.jsx)("option", {
								value: e.id,
								children: e.name
							}, e.id))]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, U.jsx)("p", {
				className: "muted small",
				children: p ? "Changes in the live specification since this baseline was frozen." : `Changes from ${C} to this baseline.`
			}),
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "diff-summary",
				children: [
					/* @__PURE__ */ (0, U.jsxs)("span", {
						className: "pill",
						"data-tone": "good",
						children: [
							"+",
							b.length,
							" added"
						]
					}),
					/* @__PURE__ */ (0, U.jsxs)("span", {
						className: "pill",
						"data-tone": "bad",
						children: [
							"−",
							x.length,
							" removed"
						]
					}),
					/* @__PURE__ */ (0, U.jsxs)("span", {
						className: "pill",
						"data-tone": "warn",
						children: [S.length, " revised"]
					})
				]
			}),
			b.length + x.length + S.length > 0 ? /* @__PURE__ */ (0, U.jsxs)("ul", {
				className: "diff-list",
				children: [
					b.map((e) => /* @__PURE__ */ (0, U.jsxs)("li", {
						"data-change": "added",
						children: [
							/* @__PURE__ */ (0, U.jsx)("strong", { children: "Added" }),
							" ",
							/* @__PURE__ */ (0, U.jsx)("a", {
								className: "mono",
								href: r("requirements", e),
								children: e
							}),
							" ",
							/* @__PURE__ */ (0, U.jsx)("span", { children: y.get(e)?.statement })
						]
					}, e)),
					x.map((e) => /* @__PURE__ */ (0, U.jsxs)("li", {
						"data-change": "removed",
						children: [
							/* @__PURE__ */ (0, U.jsx)("strong", { children: "Removed" }),
							" ",
							/* @__PURE__ */ (0, U.jsx)("span", {
								className: "mono",
								children: e
							}),
							" ",
							/* @__PURE__ */ (0, U.jsx)("span", { children: v.get(e)?.statement })
						]
					}, e)),
					S.map((e) => {
						let t = v.get(e), n = y.get(e);
						return /* @__PURE__ */ (0, U.jsxs)("li", {
							"data-change": "revised",
							children: [
								/* @__PURE__ */ (0, U.jsxs)("div", { children: [
									/* @__PURE__ */ (0, U.jsx)("strong", { children: "Revised" }),
									" ",
									/* @__PURE__ */ (0, U.jsx)("a", {
										className: "mono",
										href: r("requirements", e),
										children: e
									}),
									" ",
									/* @__PURE__ */ (0, U.jsxs)("span", {
										className: "muted small",
										children: [
											"Rev ",
											Tr(t),
											" → Rev ",
											Tr(n)
										]
									}),
									" ",
									n.state && /* @__PURE__ */ (0, U.jsx)("span", {
										className: "pill",
										children: n.state
									})
								] }),
								t.statement !== n.statement && /* @__PURE__ */ (0, U.jsx)(rr, {
									field: "statement",
									before: t.statement,
									after: n.statement
								}),
								t.criteria !== n.criteria && /* @__PURE__ */ (0, U.jsx)(rr, {
									field: "criteria",
									before: t.criteria,
									after: n.criteria
								}),
								t.statement === n.statement && t.criteria === n.criteria && /* @__PURE__ */ (0, U.jsx)("p", {
									className: "muted small",
									children: "Wording unchanged (lifecycle or links changed)."
								})
							]
						}, e);
					})
				]
			}) : /* @__PURE__ */ (0, U.jsx)("p", {
				className: "ok",
				children: "No differences."
			}),
			/* @__PURE__ */ (0, U.jsx)("h2", {
				className: "section-title",
				children: f ? "Frozen membership" : "Members"
			}),
			/* @__PURE__ */ (0, U.jsx)("div", {
				className: "table-wrap",
				children: /* @__PURE__ */ (0, U.jsxs)("table", {
					className: "matrix",
					children: [/* @__PURE__ */ (0, U.jsx)("thead", { children: /* @__PURE__ */ (0, U.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, U.jsx)("th", { children: "Requirement" }),
						/* @__PURE__ */ (0, U.jsx)("th", { children: f ? "Frozen revision" : "Revision" }),
						/* @__PURE__ */ (0, U.jsx)("th", { children: "Live" })
					] }) }), /* @__PURE__ */ (0, U.jsx)("tbody", { children: d.map((e) => {
						let t = n.reqById.get(e.id);
						return /* @__PURE__ */ (0, U.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, U.jsx)("th", {
								scope: "row",
								children: /* @__PURE__ */ (0, U.jsxs)("a", {
									href: r("requirements", e.id),
									children: [
										/* @__PURE__ */ (0, U.jsx)("span", {
											className: "mono",
											children: e.id
										}),
										" ",
										/* @__PURE__ */ (0, U.jsx)("span", {
											className: "clamp small-text",
											children: e.statement
										})
									]
								})
							}),
							/* @__PURE__ */ (0, U.jsxs)("td", { children: ["Rev ", Tr(e)] }),
							/* @__PURE__ */ (0, U.jsx)("td", { children: t ? /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [
								Tr(t) === Tr(e) ? /* @__PURE__ */ (0, U.jsx)("span", {
									className: "ok",
									children: "Same"
								}) : /* @__PURE__ */ (0, U.jsxs)("span", {
									className: "warn-text",
									children: ["Rev ", Tr(t)]
								}),
								" ",
								/* @__PURE__ */ (0, U.jsx)("span", {
									className: "pill",
									"data-state": t.state,
									children: t.state
								})
							] }) : "Missing" })
						] }, e.id);
					}) })]
				})
			})
		]
	});
}
// client/src/views/DataModel.tsx
var Ar = [
	{
		kind: "requirement",
		label: "Requirements"
	},
	{
		kind: "test_case",
		label: "Test cases"
	},
	{
		kind: "actor",
		label: "Actors"
	},
	{
		kind: "use_case",
		label: "Use cases"
	}
], jr = {
	text: "Text",
	number: "Number",
	integer: "Whole number",
	boolean: "Yes or no",
	enum: "Choice from a list",
	date: "Date",
	quantity: "Quantity with a unit",
	reference: "Link to a record"
}, Mr = [
	["requirement", "Requirement"],
	["test_case", "Test case"],
	["actor", "Actor"],
	["use_case", "Use case"],
	["element", "Element"],
	["product", "Product"]
], Nr = [
	["requirement", "Requirements"],
	["test_case", "Test cases"],
	["actor", "Actors"],
	["use_case", "Use cases"],
	["product", "Products"],
	["external", "External documents"],
	["github", "GitHub issues and pull requests"]
], Pr = /^[a-z][a-z0-9_]{0,39}$/, Fr = (e) => JSON.parse(JSON.stringify({
	elementTypes: e.elementTypes,
	recordAttributes: e.recordAttributes,
	relationRules: e.relationRules
})), Ir = (e) => {
	if (e.trim() === "") return;
	let t = Number(e);
	return Number.isFinite(t) ? t : void 0;
}, Lr = (e) => (e.options ?? []).map((e) => e.trim()).filter(Boolean);
function Rr(e) {
	let t = {
		key: e.key,
		label: e.label.trim(),
		type: e.type
	};
	return e.required && (t.required = !0), e.description && (t.description = e.description), e.type === "enum" && (t.options = Lr(e), e.multi && (t.multi = !0)), e.type === "quantity" && (t.unit = (e.unit ?? "").trim()), (e.type === "number" || e.type === "integer" || e.type === "quantity") && (e.min !== void 0 && (t.min = e.min), e.max !== void 0 && (t.max = e.max)), e.type === "text" && e.maxLength !== void 0 && (t.maxLength = e.maxLength), e.type === "reference" && (t.targetKind = e.targetKind), t;
}
function zr(e) {
	return {
		elementTypes: e.elementTypes.map((e) => ({
			id: e.id,
			label: e.label.trim(),
			...e.discipline?.trim() ? { discipline: e.discipline.trim() } : {},
			...e.description?.trim() ? { description: e.description.trim() } : {},
			attributes: e.attributes.map(Rr)
		})),
		recordAttributes: Object.fromEntries(Ar.map(({ kind: t }) => [t, e.recordAttributes[t].map(Rr)])),
		relationRules: e.relationRules.map((e) => ({
			type: e.type,
			from: e.from,
			to: e.to,
			...e.maxPerSource === void 0 ? {} : { maxPerSource: e.maxPerSource },
			...e.maxPerTarget === void 0 ? {} : { maxPerTarget: e.maxPerTarget }
		}))
	};
}
function Br(e, t) {
	let n = [], r = /* @__PURE__ */ new Set();
	for (let i of t) {
		let t = `${e}, attribute “${i.label.trim() || i.key || "new"}”`;
		if (Pr.test(i.key) ? r.has(i.key) && n.push(`${e}: the key ${i.key} is used twice.`) : n.push(`${t}: the key must start with a lowercase letter and use only lowercase letters, digits and underscores.`), r.add(i.key), i.label.trim() || n.push(`${t}: give it a label.`), i.type === "enum") {
			let e = Lr(i);
			e.length ? new Set(e).size !== e.length && n.push(`${t}: options must be different from each other.`) : n.push(`${t}: add at least one option.`);
		}
		i.type === "quantity" && !(i.unit ?? "").trim() && n.push(`${t}: give the unit, for example ms.`), i.type === "reference" && !i.targetKind && n.push(`${t}: choose the kind of record it refers to.`), i.min !== void 0 && i.max !== void 0 && i.min > i.max && n.push(`${t}: the minimum is above the maximum.`);
	}
	return n;
}
function Vr(e) {
	let t = [], n = /* @__PURE__ */ new Set();
	e.elementTypes.forEach((e, r) => {
		let i = e.label.trim() || e.id || `Element type ${r + 1}`;
		Pr.test(e.id) ? n.has(e.id) && t.push(`The element type ID ${e.id} is used twice.`) : t.push(`${i}: the ID must start with a lowercase letter and use only lowercase letters, digits and underscores.`), n.add(e.id), e.label.trim() || t.push(`Element type ${e.id || r + 1}: give it a label.`), t.push(...Br(i, e.attributes));
	});
	for (let { kind: n, label: r } of Ar) t.push(...Br(r, e.recordAttributes[n]));
	return e.relationRules.forEach((e, n) => {
		e.type || t.push(`Relation rule ${n + 1}: choose a relation type.`), e.from.length || t.push(`Relation rule ${n + 1}: choose at least one kind to link from.`), e.to.length || t.push(`Relation rule ${n + 1}: choose at least one kind to link to.`);
		for (let [r, i] of [[e.maxPerSource, "source"], [e.maxPerTarget, "target"]]) r !== void 0 && (!Number.isInteger(r) || r < 1) && t.push(`Relation rule ${n + 1}: the maximum per ${i} is a whole number of at least 1.`);
	}), t;
}
function Hr() {
	let { ws: e, session: t, open: n } = B(), r = t.role === "admin", i = (0, _.useMemo)(() => Fr(e.metamodel), [e.metamodel]), [a, o] = (0, _.useState)(i), [s, c] = (0, _.useState)("types"), l = e.metamodel.revision;
	(0, _.useEffect)(() => {
		o(Fr(e.metamodel));
	}, [l]);
	let u = zr(a), d = zr(i), f = JSON.stringify(u) !== JSON.stringify(d), p = JSON.stringify(u.relationRules) !== JSON.stringify(d.relationRules), m = Vr(a), h = /* @__PURE__ */ new Set();
	e.metamodel.elementTypes.forEach((e) => e.attributes.forEach((t) => h.add(`type:${e.id}|${t.key}`)));
	for (let { kind: t } of Ar) e.metamodel.recordAttributes[t].forEach((e) => h.add(`${t}|${e.key}`));
	let g = new Set(e.metamodel.elementTypes.map((e) => e.id)), v = (e) => o((t) => ({
		...t,
		elementTypes: e(t.elementTypes)
	})), y = (e, t) => o((n) => ({
		...n,
		recordAttributes: {
			...n.recordAttributes,
			[e]: t
		}
	})), b = (e) => o((t) => ({
		...t,
		relationRules: e(t.relationRules)
	})), x = (t) => e.violations.find((e) => e.rule === t), S = r ? f ? m.length ? "Fix the problems listed above first." : !1 : "No changes to save yet." : "Only administrators change the data model. You can read it here.", C = [
		{
			id: "types",
			label: "Element types",
			count: a.elementTypes.length,
			hint: "Design elements such as signals, connectors or components. Each type has its own attributes."
		},
		{
			id: "records",
			label: "Record attributes",
			hint: "Extra fields on each kind of record. Required ones must be filled before a record is saved."
		},
		{
			id: "rules",
			label: "Relation rules",
			count: a.relationRules.length,
			hint: "When a relation type has rules, a new link of that type must match one of them. Relation types without rules stay unrestricted. Existing links are kept; the count shows how many would break a rule."
		}
	];
	return /* @__PURE__ */ (0, U.jsxs)("div", {
		className: "page",
		children: [
			/* @__PURE__ */ (0, U.jsx)("h1", {
				className: "vh",
				children: "Data model"
			}),
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "toolbar dm-bar",
				children: [
					/* @__PURE__ */ (0, U.jsx)("div", {
						className: "segmented small",
						role: "radiogroup",
						"aria-label": "Part of the data model",
						children: C.map((e) => /* @__PURE__ */ (0, U.jsxs)("button", {
							type: "button",
							role: "radio",
							"aria-checked": s === e.id,
							title: e.hint,
							onClick: () => c(e.id),
							children: [e.label, e.count !== void 0 && /* @__PURE__ */ (0, U.jsx)("span", {
								className: "count",
								children: e.count
							})]
						}, e.id))
					}),
					/* @__PURE__ */ (0, U.jsx)("span", {
						className: "muted small dm-status",
						role: "status",
						children: f ? "Unsaved changes" : `Revision ${l}`
					}),
					/* @__PURE__ */ (0, U.jsx)(G, {
						className: "primary",
						disabledReason: S,
						onClick: () => n(/* @__PURE__ */ (0, U.jsx)(qr, {
							payload: u,
							revision: l
						})),
						children: "Save"
					})
				]
			}),
			!r && /* @__PURE__ */ (0, U.jsx)("p", {
				className: "muted",
				role: "note",
				children: "Only administrators change the data model. You can read it here."
			}),
			m.length > 0 && /* @__PURE__ */ (0, U.jsxs)("div", {
				className: "error",
				role: "alert",
				children: [/* @__PURE__ */ (0, U.jsx)("strong", { children: "Fix before saving" }), /* @__PURE__ */ (0, U.jsx)("ul", { children: m.map((e) => /* @__PURE__ */ (0, U.jsx)("li", { children: e }, e)) })]
			}),
			/* @__PURE__ */ (0, U.jsxs)("fieldset", {
				className: "dm-fields",
				disabled: !r,
				children: [
					s === "types" && /* @__PURE__ */ (0, U.jsxs)("section", {
						className: "dm-section",
						"aria-label": "Element types",
						children: [
							a.elementTypes.length === 0 && /* @__PURE__ */ (0, U.jsxs)("p", {
								className: "muted",
								children: ["No element types yet. ", C[0].hint]
							}),
							a.elementTypes.map((e, t) => {
								let n = g.has(e.id);
								return /* @__PURE__ */ (0, U.jsxs)("article", {
									className: "card dm-card",
									"aria-label": `Element type ${e.label || e.id}`,
									children: [
										/* @__PURE__ */ (0, U.jsxs)("div", {
											className: "dm-grid",
											children: [
												/* @__PURE__ */ (0, U.jsx)(K, {
													label: "ID",
													hint: n ? "Saved; cannot change." : "Lowercase letters, digits and underscores.",
													children: n ? /* @__PURE__ */ (0, U.jsx)("span", {
														className: "mono",
														children: e.id
													}) : /* @__PURE__ */ (0, U.jsx)("input", {
														className: "mono",
														value: e.id,
														maxLength: 40,
														onChange: (e) => {
															let n = e.currentTarget.value;
															v((e) => e.map((e, r) => r === t ? {
																...e,
																id: n
															} : e));
														}
													})
												}),
												/* @__PURE__ */ (0, U.jsx)(K, {
													label: "Label",
													children: /* @__PURE__ */ (0, U.jsx)("input", {
														value: e.label,
														maxLength: 100,
														onChange: (e) => {
															let n = e.currentTarget.value;
															v((e) => e.map((e, r) => r === t ? {
																...e,
																label: n
															} : e));
														}
													})
												}),
												/* @__PURE__ */ (0, U.jsx)(K, {
													label: "Discipline (optional)",
													children: /* @__PURE__ */ (0, U.jsx)("input", {
														value: e.discipline ?? "",
														maxLength: 100,
														placeholder: "Electronics, Mechanics…",
														onChange: (e) => {
															let n = e.currentTarget.value;
															v((e) => e.map((e, r) => r === t ? {
																...e,
																discipline: n
															} : e));
														}
													})
												}),
												/* @__PURE__ */ (0, U.jsx)(K, {
													label: "Description (optional)",
													children: /* @__PURE__ */ (0, U.jsx)("input", {
														value: e.description ?? "",
														maxLength: 500,
														onChange: (e) => {
															let n = e.currentTarget.value;
															v((e) => e.map((e, r) => r === t ? {
																...e,
																description: n
															} : e));
														}
													})
												})
											]
										}),
										/* @__PURE__ */ (0, U.jsx)("h3", {
											className: "dm-sub",
											children: "Attributes"
										}),
										/* @__PURE__ */ (0, U.jsx)(Wr, {
											idPrefix: `type-${t}`,
											defs: e.attributes,
											locked: (t) => h.has(`type:${e.id}|${t}`),
											onChange: (e) => v((n) => n.map((n, r) => r === t ? {
												...n,
												attributes: e
											} : n))
										}),
										/* @__PURE__ */ (0, U.jsx)("div", {
											className: "actions",
											children: /* @__PURE__ */ (0, U.jsx)("button", {
												type: "button",
												className: "quiet small",
												onClick: () => v((e) => e.filter((e, n) => n !== t)),
												children: "Remove element type"
											})
										})
									]
								}, t);
							}),
							/* @__PURE__ */ (0, U.jsx)("div", { children: /* @__PURE__ */ (0, U.jsx)(G, {
								className: "link small",
								onClick: () => v((e) => [...e, {
									id: "",
									label: "",
									attributes: []
								}]),
								children: "Add element type"
							}) })
						]
					}),
					s === "records" && /* @__PURE__ */ (0, U.jsx)("section", {
						className: "dm-section",
						"aria-label": "Record attributes",
						children: Ar.map(({ kind: e, label: t }) => /* @__PURE__ */ (0, U.jsxs)("article", {
							className: "card dm-card",
							"aria-label": `${t} attributes`,
							children: [/* @__PURE__ */ (0, U.jsx)("h3", { children: t }), /* @__PURE__ */ (0, U.jsx)(Wr, {
								idPrefix: `rec-${e}`,
								defs: a.recordAttributes[e],
								locked: (t) => h.has(`${e}|${t}`),
								onChange: (t) => y(e, t)
							})]
						}, e))
					}),
					s === "rules" && /* @__PURE__ */ (0, U.jsxs)("section", {
						className: "dm-section",
						"aria-label": "Relation rules",
						children: [
							/* @__PURE__ */ (0, U.jsx)("p", {
								className: "muted small",
								children: "A type with rules only allows links that match one."
							}),
							a.relationRules.length === 0 && /* @__PURE__ */ (0, U.jsx)("p", {
								className: "muted",
								children: "No rules yet. Relation types without rules stay unrestricted."
							}),
							a.relationRules.map((t, n) => {
								let r = x(n);
								return /* @__PURE__ */ (0, U.jsxs)("article", {
									className: "card dm-card",
									"aria-label": `Relation rule ${n + 1}`,
									children: [
										/* @__PURE__ */ (0, U.jsxs)("div", {
											className: "dm-grid",
											children: [
												/* @__PURE__ */ (0, U.jsx)(K, {
													label: "Relation type",
													children: /* @__PURE__ */ (0, U.jsxs)("select", {
														value: t.type,
														onChange: (e) => {
															let t = e.currentTarget.value;
															b((e) => e.map((e, r) => r === n ? {
																...e,
																type: t
															} : e));
														},
														children: [
															/* @__PURE__ */ (0, U.jsx)("option", {
																value: "",
																children: "Choose…"
															}),
															e.relationTypes.map((e) => /* @__PURE__ */ (0, U.jsx)("option", {
																value: e.id,
																children: e.label
															}, e.id)),
															t.type && !e.relationTypes.some((e) => e.id === t.type) && /* @__PURE__ */ (0, U.jsx)("option", {
																value: t.type,
																children: t.type
															})
														]
													})
												}),
												/* @__PURE__ */ (0, U.jsx)(K, {
													label: "Most per source (optional)",
													children: /* @__PURE__ */ (0, U.jsx)("input", {
														type: "number",
														min: 1,
														value: t.maxPerSource ?? "",
														onChange: (e) => {
															let t = Ir(e.currentTarget.value);
															b((e) => e.map((e, r) => r === n ? {
																...e,
																maxPerSource: t
															} : e));
														}
													})
												}),
												/* @__PURE__ */ (0, U.jsx)(K, {
													label: "Most per target (optional)",
													children: /* @__PURE__ */ (0, U.jsx)("input", {
														type: "number",
														min: 1,
														value: t.maxPerTarget ?? "",
														onChange: (e) => {
															let t = Ir(e.currentTarget.value);
															b((e) => e.map((e, r) => r === n ? {
																...e,
																maxPerTarget: t
															} : e));
														}
													})
												})
											]
										}),
										/* @__PURE__ */ (0, U.jsxs)("div", {
											className: "dm-grid",
											children: [/* @__PURE__ */ (0, U.jsx)(Ur, {
												label: "Links from",
												value: t.from,
												types: a.elementTypes,
												onChange: (e) => b((t) => t.map((t, r) => r === n ? {
													...t,
													from: e
												} : t))
											}), /* @__PURE__ */ (0, U.jsx)(Ur, {
												label: "Links to",
												value: t.to,
												types: a.elementTypes,
												onChange: (e) => b((t) => t.map((t, r) => r === n ? {
													...t,
													to: e
												} : t))
											})]
										}),
										/* @__PURE__ */ (0, U.jsx)("p", {
											className: `small ${r && r.count ? "warn-text" : "muted"}`,
											role: "status",
											children: p ? "Save to see how many existing links would break this rule." : r ? r.count ? `${r.count} existing ${r.count === 1 ? "link" : "links"} would break this rule.` : "No existing links break this rule." : ""
										}),
										/* @__PURE__ */ (0, U.jsx)("div", {
											className: "actions",
											children: /* @__PURE__ */ (0, U.jsx)("button", {
												type: "button",
												className: "quiet small",
												onClick: () => b((e) => e.filter((e, t) => t !== n)),
												children: "Remove rule"
											})
										})
									]
								}, n);
							}),
							/* @__PURE__ */ (0, U.jsx)("div", { children: /* @__PURE__ */ (0, U.jsx)(G, {
								className: "link small",
								onClick: () => b((e) => [...e, {
									type: "",
									from: [],
									to: []
								}]),
								children: "Add relation rule"
							}) })
						]
					})
				]
			})
		]
	});
}
function Ur({ label: e, value: t, types: n, onChange: r }) {
	let i = [
		...Nr,
		["element:*", "Any element"],
		...n.filter((e) => e.id).map((e) => [`element:${e.id}`, `Element: ${e.label || e.id}`])
	];
	return /* @__PURE__ */ (0, U.jsxs)("fieldset", {
		className: "kind-fieldset",
		children: [/* @__PURE__ */ (0, U.jsx)("legend", { children: e }), /* @__PURE__ */ (0, U.jsx)("div", {
			className: "kind-grid",
			children: i.map(([e, n]) => /* @__PURE__ */ (0, U.jsxs)("label", {
				className: "check",
				children: [
					/* @__PURE__ */ (0, U.jsx)("input", {
						type: "checkbox",
						checked: t.includes(e),
						onChange: (n) => r(n.currentTarget.checked ? [...t, e] : t.filter((t) => t !== e))
					}),
					" ",
					n
				]
			}, e))
		})]
	});
}
function Wr({ idPrefix: e, defs: t, locked: n, onChange: r }) {
	return /* @__PURE__ */ (0, U.jsxs)("div", {
		className: "dm-attrs",
		children: [
			t.length === 0 && /* @__PURE__ */ (0, U.jsx)("p", {
				className: "muted small",
				children: "No attributes yet."
			}),
			t.map((i, a) => /* @__PURE__ */ (0, U.jsx)(Kr, {
				id: `${e}-${a}`,
				def: i,
				locked: n(i.key),
				onChange: (e) => r(t.map((t, n) => n === a ? {
					...t,
					...e
				} : t)),
				onRemove: () => r(t.filter((e, t) => t !== a))
			}, `${e}-${a}`)),
			/* @__PURE__ */ (0, U.jsx)("div", { children: /* @__PURE__ */ (0, U.jsx)(G, {
				className: "link small",
				onClick: () => r([...t, {
					key: "",
					label: "",
					type: "text"
				}]),
				children: "Add attribute"
			}) })
		]
	});
}
function Gr(e) {
	let t = e.min !== void 0 && e.max !== void 0 ? `${e.min} to ${e.max}` : e.min === void 0 ? e.max === void 0 ? "" : `≤ ${e.max}` : `≥ ${e.min}`, n = e.type === "quantity" ? [e.unit, t].filter(Boolean).join(", ") : e.type === "enum" ? `${(e.options ?? []).filter(Boolean).length} options${e.multi ? ", several" : ""}` : e.type === "reference" ? Mr.find(([t]) => t === e.targetKind)?.[1] ?? "" : e.type === "text" ? e.maxLength ? `up to ${e.maxLength}` : "" : t;
	return `${jr[e.type]}${n ? ` (${n})` : ""}`;
}
function Kr({ id: e, def: t, locked: n, onChange: r, onRemove: i }) {
	let a = t.type === "number" || t.type === "integer" || t.type === "quantity", [o, s] = (0, _.useState)(!n), c = t.label || t.key || "New attribute";
	return o ? /* @__PURE__ */ (0, U.jsxs)("div", {
		className: "attr-row",
		role: "group",
		"aria-label": `Attribute ${c}`,
		children: [/* @__PURE__ */ (0, U.jsxs)("div", {
			className: "attr-row-head",
			children: [/* @__PURE__ */ (0, U.jsx)("strong", {
				className: "small",
				children: c
			}), /* @__PURE__ */ (0, U.jsxs)("span", {
				className: "attr-row-actions",
				children: [n && /* @__PURE__ */ (0, U.jsx)("button", {
					type: "button",
					className: "quiet small",
					onClick: () => s(!1),
					children: "Done"
				}), /* @__PURE__ */ (0, U.jsx)("button", {
					type: "button",
					className: "quiet small",
					onClick: i,
					children: "Remove attribute"
				})]
			})]
		}), /* @__PURE__ */ (0, U.jsxs)("div", {
			className: "attr-row-fields",
			children: [
				/* @__PURE__ */ (0, U.jsx)(K, {
					label: "Key",
					hint: n ? "Saved; cannot change." : void 0,
					children: n ? /* @__PURE__ */ (0, U.jsx)("span", {
						className: "mono",
						children: t.key
					}) : /* @__PURE__ */ (0, U.jsx)("input", {
						id: `${e}-key`,
						className: "mono",
						value: t.key,
						maxLength: 40,
						placeholder: "owner_note",
						onChange: (e) => r({ key: e.currentTarget.value })
					})
				}),
				/* @__PURE__ */ (0, U.jsx)(K, {
					label: "Label",
					children: /* @__PURE__ */ (0, U.jsx)("input", {
						value: t.label,
						maxLength: 100,
						onChange: (e) => r({ label: e.currentTarget.value })
					})
				}),
				/* @__PURE__ */ (0, U.jsx)(K, {
					label: "Type",
					children: /* @__PURE__ */ (0, U.jsx)("select", {
						value: t.type,
						onChange: (e) => r({ type: e.currentTarget.value }),
						children: lt.map((e) => /* @__PURE__ */ (0, U.jsx)("option", {
							value: e,
							children: jr[e]
						}, e))
					})
				}),
				/* @__PURE__ */ (0, U.jsxs)("label", {
					className: "check",
					children: [/* @__PURE__ */ (0, U.jsx)("input", {
						type: "checkbox",
						checked: !!t.required,
						onChange: (e) => r({ required: e.currentTarget.checked })
					}), " Required"]
				}),
				t.type === "enum" && /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [/* @__PURE__ */ (0, U.jsxs)("label", {
					className: "check",
					children: [/* @__PURE__ */ (0, U.jsx)("input", {
						type: "checkbox",
						checked: !!t.multi,
						onChange: (e) => r({ multi: e.currentTarget.checked })
					}), " Several options can be chosen"]
				}), /* @__PURE__ */ (0, U.jsx)(K, {
					label: "Options, one per line",
					children: /* @__PURE__ */ (0, U.jsx)("textarea", {
						rows: 3,
						value: (t.options ?? []).join("\n"),
						onChange: (e) => r({ options: e.currentTarget.value.split("\n") })
					})
				})] }),
				t.type === "quantity" && /* @__PURE__ */ (0, U.jsx)(K, {
					label: "Unit",
					children: /* @__PURE__ */ (0, U.jsx)("input", {
						value: t.unit ?? "",
						maxLength: 20,
						placeholder: "ms",
						onChange: (e) => r({ unit: e.currentTarget.value })
					})
				}),
				a && /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [/* @__PURE__ */ (0, U.jsx)(K, {
					label: "Minimum (optional)",
					children: /* @__PURE__ */ (0, U.jsx)("input", {
						type: "number",
						value: t.min ?? "",
						onChange: (e) => r({ min: Ir(e.currentTarget.value) })
					})
				}), /* @__PURE__ */ (0, U.jsx)(K, {
					label: "Maximum (optional)",
					children: /* @__PURE__ */ (0, U.jsx)("input", {
						type: "number",
						value: t.max ?? "",
						onChange: (e) => r({ max: Ir(e.currentTarget.value) })
					})
				})] }),
				t.type === "text" && /* @__PURE__ */ (0, U.jsx)(K, {
					label: "Longest text (optional)",
					children: /* @__PURE__ */ (0, U.jsx)("input", {
						type: "number",
						min: 1,
						max: 2e4,
						value: t.maxLength ?? "",
						placeholder: "2000",
						onChange: (e) => r({ maxLength: Ir(e.currentTarget.value) })
					})
				}),
				t.type === "reference" && /* @__PURE__ */ (0, U.jsx)(K, {
					label: "Refers to",
					children: /* @__PURE__ */ (0, U.jsxs)("select", {
						value: t.targetKind ?? "",
						onChange: (e) => r({ targetKind: e.currentTarget.value }),
						children: [/* @__PURE__ */ (0, U.jsx)("option", {
							value: "",
							children: "Choose…"
						}), Mr.map(([e, t]) => /* @__PURE__ */ (0, U.jsx)("option", {
							value: e,
							children: t
						}, e))]
					})
				})
			]
		})]
	}) : /* @__PURE__ */ (0, U.jsxs)("div", {
		className: "attr-row attr-row-collapsed",
		role: "group",
		"aria-label": `Attribute ${c}`,
		children: [/* @__PURE__ */ (0, U.jsxs)("span", {
			className: "attr-summary",
			children: [
				/* @__PURE__ */ (0, U.jsx)("strong", { children: c }),
				" ",
				/* @__PURE__ */ (0, U.jsx)("span", {
					className: "mono muted",
					children: t.key
				}),
				" ",
				/* @__PURE__ */ (0, U.jsxs)("span", {
					className: "muted",
					children: ["· ", Gr(t)]
				}),
				t.required && /* @__PURE__ */ (0, U.jsx)("span", {
					className: "pill",
					children: "Required"
				})
			]
		}), /* @__PURE__ */ (0, U.jsxs)("span", {
			className: "attr-row-actions",
			children: [/* @__PURE__ */ (0, U.jsx)("button", {
				type: "button",
				className: "quiet small",
				"aria-label": `Edit attribute ${c}`,
				onClick: () => s(!0),
				children: "Edit"
			}), /* @__PURE__ */ (0, U.jsx)("button", {
				type: "button",
				className: "quiet small",
				"aria-label": `Remove attribute ${c}`,
				onClick: i,
				children: "Remove"
			})]
		})]
	});
}
function qr({ payload: e, revision: t }) {
	let { run: n, close: r } = B(), [i, a] = (0, _.useState)("Data model updated");
	return /* @__PURE__ */ (0, U.jsxs)(Sn, {
		title: "Save data model",
		submit: "Save data model",
		onSubmit: async () => {
			await n("metamodel.set", {
				...e,
				expectedRevision: t,
				reason: i.trim() || "Data model updated"
			}, `Data model saved as revision ${t + 1}`), r();
		},
		children: [/* @__PURE__ */ (0, U.jsx)("p", {
			className: "muted small",
			children: "Values already stored keep what they hold. An attribute you remove stays visible on its records as a Former attribute."
		}), /* @__PURE__ */ (0, U.jsx)(Cn, {
			value: i,
			onChange: a
		})]
	});
}
// client/src/views/Governance.tsx
var Jr = [{
	group: "approvals",
	title: "Approvals",
	settings: [
		{
			group: "approvals",
			key: "selfApproval",
			label: "Self-approval",
			note: "Approving a revision you wrote. Applies to agents too.",
			options: [
				{
					value: "allowed",
					label: "Allowed",
					hint: "Authors may approve their own revision."
				},
				{
					value: "flagged",
					label: "Marked",
					hint: "Allowed, and shown as \"Approved by its author\"."
				},
				{
					value: "blocked",
					label: "Blocked",
					hint: "Another approver must decide. Needs two approvers."
				}
			]
		},
		{
			group: "approvals",
			key: "agentDecisions",
			label: "Agent decisions",
			note: "Approve, reject, freeze or activate through an agent.",
			options: [{
				value: "allowed",
				label: "Allowed",
				hint: "Agents decide with the role of the person who connected them."
			}, {
				value: "blocked",
				label: "People only",
				hint: "Agents draft and submit for review; a person decides."
			}]
		},
		{
			group: "approvals",
			key: "decisionReason",
			label: "Decision reasons",
			note: "The reason recorded with each decision.",
			options: [{
				value: "prefilled",
				label: "Suggested",
				hint: "A reason is suggested and can be edited."
			}, {
				value: "typed",
				label: "Written",
				hint: "Every decision needs a reason in your own words."
			}]
		}
	]
}, {
	group: "verification",
	title: "Verification",
	settings: [{
		group: "verification",
		key: "newTestCaseStatus",
		label: "New test cases",
		note: "Whether a new test case counts toward verification at once.",
		options: [{
			value: "Active",
			label: "Active",
			hint: "Counts toward verification as soon as it is created."
		}, {
			value: "Draft",
			label: "Draft",
			hint: "Someone reviews and activates it before it counts."
		}]
	}]
}], Yr = (e, t) => String(e[t.group][t.key]);
function Xr() {
	let { session: e, run: t, ws: n } = B(), r = n.settings, [i, a] = (0, _.useState)({}), [o, s] = (0, _.useState)(null), [c, l] = (0, _.useState)(""), u = e.role === "admin", d = u ? void 0 : "Only administrators change governance settings.";
	(0, _.useEffect)(() => {
		let e = Jr.flatMap((e) => e.settings);
		a((t) => Object.fromEntries(Object.entries(t).filter(([t, n]) => {
			let i = e.find((e) => e.key === t);
			return n !== Yr(r, i);
		})));
	}, [r]);
	let f = (e) => Jr.find((t) => t.group === e).settings.filter((e) => i[e.key] !== void 0 && i[e.key] !== Yr(r, e));
	async function p(e) {
		let n = f(e);
		if (n.length) {
			s(e), l("");
			try {
				await t("settings.set", {
					[e]: Object.fromEntries(n.map((e) => [e.key, i[e.key]])),
					expectedRevision: r.revision,
					reason: n.map((e) => `${e.label}: ${e.options.find((t) => t.value === i[e.key]).label.toLowerCase()}`).join("; ")
				}, "Governance settings saved");
			} catch (e) {
				l(V(e, "Settings could not be saved."));
			} finally {
				s(null);
			}
		}
	}
	return /* @__PURE__ */ (0, U.jsxs)("div", {
		className: "page",
		children: [/* @__PURE__ */ (0, U.jsx)("h1", {
			className: "vh",
			children: "Governance"
		}), Jr.map(({ group: e, title: t, settings: n }) => {
			let s = f(e).length > 0;
			return /* @__PURE__ */ (0, U.jsxs)("section", {
				className: "card settings-card",
				"aria-labelledby": `gov-${e}`,
				children: [
					/* @__PURE__ */ (0, U.jsxs)("header", {
						className: "settings-head",
						children: [/* @__PURE__ */ (0, U.jsx)("h2", {
							id: `gov-${e}`,
							className: "settings-group",
							title: `Settings revision ${r.revision}`,
							children: t
						}), u && s && /* @__PURE__ */ (0, U.jsxs)("span", {
							className: "settings-actions",
							children: [/* @__PURE__ */ (0, U.jsx)("button", {
								type: "button",
								className: "quiet small",
								disabled: !!o,
								onClick: () => a((e) => Object.fromEntries(Object.entries(e).filter(([e]) => !n.some((t) => t.key === e)))),
								children: "Cancel"
							}), /* @__PURE__ */ (0, U.jsx)("button", {
								type: "button",
								className: "primary small",
								disabled: !!o,
								onClick: () => void p(e),
								children: o === e ? "Saving…" : "Save"
							})]
						})]
					}),
					c && o === null && s && /* @__PURE__ */ (0, U.jsx)("p", {
						className: "error",
						role: "alert",
						children: c
					}),
					n.map((e) => {
						let t = i[e.key] ?? Yr(r, e), n = e.options.find((e) => e.value === t) ?? e.options[0];
						return /* @__PURE__ */ (0, U.jsxs)("div", {
							className: "setting-row",
							children: [/* @__PURE__ */ (0, U.jsxs)("div", {
								className: "setting-label",
								children: [/* @__PURE__ */ (0, U.jsx)("strong", { children: e.label }), /* @__PURE__ */ (0, U.jsx)("small", {
									className: "muted",
									children: e.note
								})]
							}), /* @__PURE__ */ (0, U.jsxs)("div", {
								className: "setting-control",
								title: d,
								children: [/* @__PURE__ */ (0, U.jsx)("div", {
									className: "segmented small",
									role: "radiogroup",
									"aria-label": e.label,
									"aria-description": d,
									children: e.options.map((n) => /* @__PURE__ */ (0, U.jsx)("button", {
										type: "button",
										role: "radio",
										"aria-checked": t === n.value,
										disabled: !u || !!o,
										title: d ?? n.hint,
										onClick: () => a((t) => ({
											...t,
											[e.key]: n.value
										})),
										children: n.label
									}, n.value))
								}), /* @__PURE__ */ (0, U.jsx)("small", {
									className: "muted",
									children: n.hint
								})]
							})]
						}, e.key);
					})
				]
			}, e);
		})]
	});
}
// client/src/diagramFit.ts
function Zr(e, t, n) {
	if (!t || !(e > 0) || !(t.width > 0) || !(t.height > 0)) return null;
	let r = Math.round(e * t.height / t.width);
	return r >= 1 && r <= n ? r : null;
}
function Qr(e, t, n) {
	return e.width > 0 && e.height > 0 ? {
		x: (t - e.left) / e.width,
		y: (n - e.top) / e.height
	} : null;
}
// src/diagrams/frame.ts
var $r = "default-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'";
function ei(e, t = {}) {
	return `<!doctype html><html><head>${t.meta ? `<meta http-equiv="Content-Security-Policy" content="${$r}">` : ""}<meta charset="utf-8"><meta name="referrer" content="no-referrer"><style>html,body{margin:0;background:#fff}${t.fit ? "body>svg{display:block;width:100%;height:auto}" : ""}</style></head><body>${e}</body></html>`;
}
// client/src/views/DiagramViewer.tsx
var ti = 560, ni = 2e4, ri = 120, ii = 2e3, ai = 6, oi = {
	"diagrams.create": "Created",
	"diagrams.revise": "Revised",
	"diagrams.transition": "Lifecycle decision",
	"diagrams.acceptBindings": "Accepted drawing as is"
}, si = (e, t) => `${e} ${t}${e === 1 ? "" : "s"}`;
function ci(e) {
	if (!e.current.exists) return {
		word: "Record not found",
		tone: "bad",
		glyph: "!"
	};
	let t = e.current.verification?.status;
	return t === "Verified" ? {
		word: "Verified",
		tone: "good",
		glyph: "●"
	} : t === "Failed" ? {
		word: "Failed",
		tone: "bad",
		glyph: "✕"
	} : t ? {
		word: "Not verified",
		tone: "neutral",
		glyph: "○"
	} : {
		word: e.current.state ?? "Unknown",
		tone: "neutral",
		glyph: "◆"
	};
}
function li({ id: e }) {
	let { api: t, session: n, open: r, run: i, link: a } = B(), o = qt(), [s, c] = (0, _.useState)(null), [l, u] = (0, _.useState)(!0), [d, f] = (0, _.useState)(""), [p, m] = (0, _.useState)(0), [h, g] = (0, _.useState)(!0), [v, y] = (0, _.useState)(null), [b, x] = (0, _.useState)([]), [S, C] = (0, _.useState)(null), [w, T] = (0, _.useState)({
		x: 0,
		y: 0
	}), [E, D] = (0, _.useState)(null), [O, k] = (0, _.useState)(""), [A, j] = (0, _.useState)(0), [M, N] = (0, _.useState)(!1), [P, F] = (0, _.useState)(null), I = (0, _.useRef)(null);
	I.current = s;
	let ee = (0, _.useRef)(null), te = (0, _.useRef)(null), ne = (0, _.useRef)(null), re = (0, _.useRef)(null), ie = (0, _.useRef)(() => void 0), ae = !!s, oe = s ? `${s.diagram.id}@${s.diagram.revision}` : "", se = s?.diagram.revision ?? 0, [ce, le] = (0, _.useState)(""), ue = t.srcdocFrames, de = t.embedded && !ue, fe = (0, _.useMemo)(() => s ? ei(String(s.diagram.content), {
		fit: s.diagram.format === "svg",
		meta: !0
	}) : "", [
		s?.diagram.id,
		s?.diagram.revision,
		s?.diagram.content
	]);
	(0, _.useEffect)(() => {
		if (!s || ue) {
			le("");
			return;
		}
		let e = !0;
		return t.diagramFrame(s.diagram.id, s.diagram.revision).then((t) => {
			e && le(t.url);
		}).catch((t) => {
			e && !z(t) && f(V(t, "The diagram could not be shown."));
		}), () => {
			e = !1;
		};
	}, [t, oe]), (0, _.useEffect)(() => {
		let n = !0;
		return u(!0), f(""), t.command("diagrams.get", { id: e }).then((e) => {
			n && c(e);
		}).catch((e) => {
			n && !z(e) && (c(null), f(V(e, "The diagram could not be loaded.")));
		}).finally(() => {
			n && u(!1);
		}), () => {
			n = !1;
		};
	}, [
		t,
		e,
		p
	]), (0, _.useEffect)(() => {
		if (!se) return;
		let n = !0;
		return k(""), t.command("diagrams.pins.list", {
			diagramId: e,
			diagramRevision: se
		}).then((e) => {
			n && D(e);
		}).catch((e) => {
			n && !z(e) && k(V(e, "Review pins could not be loaded."));
		}), () => {
			n = !1;
		};
	}, [
		t,
		e,
		se,
		A
	]);
	let pe = (0, _.useCallback)(() => {
		let e = ee.current, t = e?.contentWindow, n = e?.contentDocument;
		if (de) {
			if (!e) return;
			let t = e.clientWidth, n = Zr(t, I.current?.diagram.dimensions, ni), r = n ?? ti;
			e.style.height = `${r}px`, x([]), T({
				x: 0,
				y: 0
			}), C(n === null ? null : {
				key: "root",
				left: 0,
				top: 0,
				width: t,
				height: r
			});
			return;
		}
		if (!e || !t || !n?.documentElement) return;
		let r = t.scrollX, i = t.scrollY;
		e.style.height = "0px";
		let a = Math.min(Math.max(n.documentElement.scrollHeight, ri), ii);
		e.style.height = `${a}px`, t.scrollTo(r, i);
		let o = [];
		n.querySelectorAll("[data-rms]").forEach((e) => {
			let n = e.getAttribute("data-rms"), r = e.getBoundingClientRect();
			!n || r.width === 0 && r.height === 0 || o.push({
				key: n,
				left: r.left + t.scrollX,
				top: r.top + t.scrollY,
				width: r.width,
				height: r.height
			});
		}), x(o);
		let s = n.body?.firstElementChild;
		if (s) {
			let e = s.getBoundingClientRect();
			C({
				key: "root",
				left: e.left + t.scrollX,
				top: e.top + t.scrollY,
				width: e.width,
				height: e.height
			});
		} else C(null);
		T((e) => e.x === t.scrollX && e.y === t.scrollY ? e : {
			x: t.scrollX,
			y: t.scrollY
		});
	}, []);
	function L() {
		ie.current();
		let e = ee.current?.contentWindow;
		if (e && !de) try {
			let t = () => T({
				x: e.scrollX,
				y: e.scrollY
			});
			e.addEventListener("scroll", t), ie.current = () => e.removeEventListener("scroll", t);
		} catch {}
		pe();
	}
	if ((0, _.useEffect)(() => () => ie.current(), []), (0, _.useEffect)(() => {
		let e = te.current;
		if (!e) return;
		let t = () => pe();
		window.addEventListener("resize", t);
		let n = typeof ResizeObserver > "u" ? null : new ResizeObserver(t);
		return n?.observe(e), () => {
			window.removeEventListener("resize", t), n?.disconnect();
		};
	}, [pe, ae]), (0, _.useEffect)(() => {
		if (!M) return;
		ne.current?.focus();
		let e = (e) => {
			e.key === "Escape" && N(!1);
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [M]), l && !s) return /* @__PURE__ */ (0, U.jsx)("div", {
		className: "page",
		children: /* @__PURE__ */ (0, U.jsx)("p", {
			className: "loading",
			role: "status",
			children: "Loading diagram…"
		})
	});
	if (!s) return /* @__PURE__ */ (0, U.jsxs)("div", {
		className: "page",
		children: [/* @__PURE__ */ (0, U.jsx)("p", {
			className: "error",
			role: "alert",
			children: d || "The diagram could not be found."
		}), /* @__PURE__ */ (0, U.jsx)("a", {
			href: a("diagrams"),
			children: "Back to diagrams"
		})]
	});
	let { diagram: R, bindings: me, history: he } = s, ge = new Map(me.map((e) => [e.key, e])), _e = me.filter((e) => e.outdated), ve = [...he].reverse().find((e) => e.operation === "diagrams.create") ?? he[he.length - 1], ye = v?.key ? ge.get(v.key) : void 0, be = at(n), xe = E?.items.filter((e) => e.state === "Open").length ?? 0, Se = () => m((e) => e + 1), Ce = () => j((e) => e + 1), we = (e, t, n) => r(/* @__PURE__ */ (0, U.jsx)(Rn, {
		title: `${t} · ${R.id}`,
		submit: t,
		initial: n,
		decision: e === "Approved",
		onConfirm: async (t) => {
			await i("diagrams.transition", {
				id: R.id,
				expectedRevision: R.revision,
				state: e,
				reason: t
			}, `${R.id} is now ${e}`), Se();
		}
	})), Te = () => r(/* @__PURE__ */ (0, U.jsx)(Rn, {
		title: `Accept drawing as is · ${R.id}`,
		submit: "Accept drawing",
		initial: "Drawing reviewed; bindings accepted as drawn",
		onConfirm: async (e) => {
			await i("diagrams.acceptBindings", {
				id: R.id,
				expectedRevision: R.revision,
				reason: e
			}, `${R.id} bindings accepted`), Se();
		}
	})), Ee = [
		{
			tab: "selection",
			label: "Selection"
		},
		{
			tab: "pins",
			label: xe ? `Review pins (${xe} open)` : "Review pins"
		},
		{
			tab: "revisions",
			label: "Revisions"
		}
	], De = (e, t) => {
		if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
		e.preventDefault();
		let n = Ee.findIndex((e) => e.tab === t), r = Ee[(n + (e.key === "ArrowRight" ? 1 : Ee.length - 1)) % Ee.length].tab;
		y({
			tab: r,
			key: v?.key
		}), document.getElementById(`diagram-tab-${r}`)?.focus();
	}, Oe = (e, t) => {
		let n = ee.current;
		if (de) return !n || !S ? null : Qr(n.getBoundingClientRect(), e, t);
		let r = n?.contentDocument?.body?.firstElementChild;
		if (!n || !r) return null;
		let i = n.getBoundingClientRect(), a = r.getBoundingClientRect();
		return !a.width || !a.height ? null : {
			x: (e - i.left - a.left) / a.width,
			y: (t - i.top - a.top) / a.height
		};
	}, ke = (e) => e >= 0 && e <= 1, Ae = (e) => {
		N(!1), r(/* @__PURE__ */ (0, U.jsx)(ui, {
			diagram: R,
			shape: e,
			onSaved: Ce
		}));
	}, je = (e) => {
		let t = re.current;
		re.current = null;
		let n = Oe(e.clientX, e.clientY);
		if (!n) return;
		let r = t ? Math.hypot(e.clientX - t.x, e.clientY - t.y) : 0, i = t ? Oe(t.x, t.y) : null;
		if (i && r >= ai) {
			let e = Math.min(i.x, n.x), t = Math.min(i.y, n.y), r = Math.max(i.x, n.x), a = Math.max(i.y, n.y), o = Math.max(0, e), s = Math.max(0, t), c = Math.min(1, r), l = Math.min(1, a);
			if (c - o > .005 && l - s > .005) {
				Ae({
					x: o,
					y: s,
					w: c - o,
					h: l - s
				});
				return;
			}
		}
		!ke(n.x) || !ke(n.y) ? o("Place the pin on the diagram itself.") : Ae({
			x: n.x,
			y: n.y
		});
	}, Me = () => Ae({
		x: .5,
		y: .5
	});
	return /* @__PURE__ */ (0, U.jsxs)("div", {
		className: `page specification${v ? " with-detail" : ""} diagram-view`,
		children: [/* @__PURE__ */ (0, U.jsxs)("div", {
			className: "spec-main",
			children: [
				/* @__PURE__ */ (0, U.jsxs)("header", {
					className: "page-head compact",
					children: [/* @__PURE__ */ (0, U.jsxs)("div", { children: [
						/* @__PURE__ */ (0, U.jsx)("p", {
							className: "small",
							children: /* @__PURE__ */ (0, U.jsx)("a", {
								href: a("diagrams"),
								children: "← Diagrams"
							})
						}),
						/* @__PURE__ */ (0, U.jsx)("h1", { children: R.title }),
						/* @__PURE__ */ (0, U.jsxs)("p", {
							className: "lede",
							children: [/* @__PURE__ */ (0, U.jsx)("span", {
								className: "mono",
								children: R.id
							}), R.description && ` · ${R.description}`]
						})
					] }), /* @__PURE__ */ (0, U.jsxs)("div", {
						className: "diagram-actions",
						children: [
							/* @__PURE__ */ (0, U.jsx)(G, {
								disabledReason: !be && "Viewers can read but not change records. Ask an administrator for editor access." || R.state !== "Draft" && "Only a Draft diagram can be submitted for review.",
								onClick: () => we("In Review", "Submit for review", "Ready for review"),
								children: "Submit for review"
							}),
							/* @__PURE__ */ (0, U.jsx)(G, {
								disabledReason: !ot(n) && "Approval decisions need the Product owner (approver) role." || R.state !== "In Review" && "Submit the diagram for review first; only a diagram in review can be approved.",
								onClick: () => we("Approved", "Approve", "Reviewed and approved"),
								children: "Approve"
							}),
							/* @__PURE__ */ (0, U.jsx)("button", {
								type: "button",
								onClick: () => y({ tab: "revisions" }),
								children: "Revision history"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, U.jsxs)("ul", {
					className: "chips",
					"aria-label": "Diagram details",
					children: [
						/* @__PURE__ */ (0, U.jsx)("li", { children: /* @__PURE__ */ (0, U.jsxs)("span", {
							className: "pill",
							"data-state": R.state,
							children: [
								"Rev ",
								R.revision,
								" · ",
								R.state
							]
						}) }),
						ve && /* @__PURE__ */ (0, U.jsx)("li", { children: /* @__PURE__ */ (0, U.jsxs)("span", {
							className: "pill",
							children: [
								"Authored by ",
								/* @__PURE__ */ (0, U.jsx)(Gn, { id: ve.actor }),
								" · ",
								gt[ve.actorType] ?? ve.actorType
							]
						}) }),
						/* @__PURE__ */ (0, U.jsx)("li", { children: /* @__PURE__ */ (0, U.jsxs)("span", {
							className: "pill",
							children: [String(R.format).toUpperCase(), " · shown sandboxed"]
						}) })
					]
				}),
				_e.length > 0 && /* @__PURE__ */ (0, U.jsxs)("section", {
					className: "card banner diagram-banner",
					"aria-label": "Drawing status",
					children: [
						/* @__PURE__ */ (0, U.jsx)("span", {
							className: "banner-icon",
							"data-tone": "warn",
							"aria-hidden": "true",
							children: "!"
						}),
						/* @__PURE__ */ (0, U.jsxs)("div", {
							className: "banner-text",
							children: [/* @__PURE__ */ (0, U.jsxs)("strong", { children: ["Drawn against an older revision: ", _e.map((e) => e.recordId).join(", ")] }), /* @__PURE__ */ (0, U.jsx)("small", { children: "Regeneration is requested from the authoring agent. Accepting keeps this drawing and re-pins its blocks to the current records." })]
						}),
						/* @__PURE__ */ (0, U.jsx)(G, {
							disabledReason: !be && "Viewers can read but not change records. Ask an administrator for editor access.",
							onClick: Te,
							children: "Accept drawing as is"
						})
					]
				}),
				/* @__PURE__ */ (0, U.jsxs)("div", {
					className: "diagram-toolbar",
					children: [
						M && /* @__PURE__ */ (0, U.jsx)("p", {
							className: "muted small",
							role: "status",
							children: "Click the diagram to place a pin, or drag to mark a region. Esc cancels."
						}),
						/* @__PURE__ */ (0, U.jsxs)("button", {
							type: "button",
							className: "quiet small",
							onClick: () => g((e) => !e),
							children: ["Status overlay: ", h ? "on" : "off"]
						}),
						/* @__PURE__ */ (0, U.jsx)("button", {
							type: "button",
							className: "quiet small",
							onClick: () => y({ tab: "pins" }),
							children: E ? `Review pins: ${xe} open` : "Review pins"
						}),
						/* @__PURE__ */ (0, U.jsx)(G, {
							className: "small",
							disabledReason: !be && "Viewers can read but not change records. Ask an administrator for editor access." || de && !S && "Pins can be placed on SVG diagrams here; this drawing has no stored size.",
							onClick: () => N((e) => !e),
							children: M ? "Stop adding pins" : "Add pin"
						})
					]
				}),
				/* @__PURE__ */ (0, U.jsx)("div", {
					className: "diagram-stage",
					ref: te,
					"data-embedded": de || void 0,
					children: /* @__PURE__ */ (0, U.jsxs)("div", {
						className: "diagram-canvas",
						children: [
							/* @__PURE__ */ (0, U.jsx)("iframe", {
								ref: ee,
								className: "diagram-frame",
								sandbox: "allow-same-origin",
								src: ue ? void 0 : ce || void 0,
								srcDoc: ue ? fe : void 0,
								title: `Diagram ${R.id}: ${R.title}`,
								onLoad: L
							}),
							M && /* @__PURE__ */ (0, U.jsx)("div", {
								ref: ne,
								className: "diagram-capture",
								role: "button",
								tabIndex: 0,
								"aria-label": "Place a pin: click a point, drag for a region, or press Enter for the centre of the diagram",
								onPointerDown: (e) => {
									re.current = {
										x: e.clientX,
										y: e.clientY
									};
								},
								onPointerUp: je,
								onKeyDown: (e) => {
									(e.key === "Enter" || e.key === " ") && (e.preventDefault(), Me());
								}
							}),
							/* @__PURE__ */ (0, U.jsx)("div", {
								className: "diagram-layer",
								children: /* @__PURE__ */ (0, U.jsxs)("div", {
									className: "diagram-layer-inner",
									style: { transform: `translate(${-w.x}px, ${-w.y}px)` },
									children: [h && b.flatMap((e, t) => {
										let n = ge.get(e.key);
										if (!n) return [];
										let r = ci(n), i = `${n.recordId}, ${r.word}${n.outdated ? ", drawn against an older revision" : ""}`;
										return [/* @__PURE__ */ (0, U.jsx)("div", {
											className: "diagram-outline",
											"data-outdated": n.outdated || void 0,
											style: {
												left: e.left,
												top: e.top,
												width: e.width,
												height: e.height
											}
										}, `outline-${t}`), /* @__PURE__ */ (0, U.jsxs)("button", {
											type: "button",
											className: "diagram-chip",
											"data-tone": r.tone,
											"data-compact": e.width < 110 || void 0,
											"data-selected": v?.key === n.key || void 0,
											"aria-label": i,
											title: i,
											style: {
												left: e.left,
												top: Math.max(0, e.top - 26)
											},
											onClick: () => y({
												tab: "selection",
												key: n.key
											}),
											children: [/* @__PURE__ */ (0, U.jsx)("span", {
												"aria-hidden": "true",
												children: r.glyph
											}), e.width >= 110 && ` ${n.recordId}`]
										}, `chip-${t}`)];
									}), S && E?.items.map((e, t) => {
										let n = S.left + e.x * S.width, r = S.top + e.y * S.height, i = e.w !== null && e.h !== null, a = e.thread.length;
										return /* @__PURE__ */ (0, U.jsxs)(_.Fragment, { children: [i && /* @__PURE__ */ (0, U.jsx)("div", {
											className: "diagram-region",
											"data-state": e.state,
											style: {
												left: n,
												top: r,
												width: (e.w ?? 0) * S.width,
												height: (e.h ?? 0) * S.height
											}
										}), /* @__PURE__ */ (0, U.jsx)("button", {
											type: "button",
											className: "diagram-pin",
											"data-state": e.state,
											"data-selected": P === e.id || void 0,
											"aria-label": `Review pin ${t + 1}, ${e.state}, ${si(a, "comment")}`,
											style: i ? {
												left: n + (e.w ?? 0) * S.width - 15,
												top: r + 15
											} : {
												left: n,
												top: r
											},
											onClick: () => {
												F(e.id), y({ tab: "pins" });
											},
											children: t + 1
										})] }, e.id);
									})]
								})
							})
						]
					})
				}),
				O && /* @__PURE__ */ (0, U.jsx)("p", {
					className: "error",
					role: "alert",
					children: O
				})
			]
		}), v && /* @__PURE__ */ (0, U.jsxs)("aside", {
			className: "detail",
			"aria-label": `Diagram ${R.id} details`,
			children: [
				/* @__PURE__ */ (0, U.jsxs)("header", {
					className: "detail-head",
					children: [/* @__PURE__ */ (0, U.jsxs)("div", {
						className: "detail-id",
						children: [/* @__PURE__ */ (0, U.jsx)("span", {
							className: "mono",
							children: R.id
						}), /* @__PURE__ */ (0, U.jsxs)("span", {
							className: "muted small",
							children: ["Rev ", R.revision]
						})]
					}), /* @__PURE__ */ (0, U.jsx)("button", {
						type: "button",
						className: "icon",
						"aria-label": "Close details",
						onClick: () => y(null),
						children: "×"
					})]
				}),
				/* @__PURE__ */ (0, U.jsx)("div", {
					className: "tabs",
					role: "tablist",
					"aria-label": "Diagram panels",
					children: Ee.map((e) => /* @__PURE__ */ (0, U.jsx)("button", {
						type: "button",
						role: "tab",
						id: `diagram-tab-${e.tab}`,
						"aria-selected": v.tab === e.tab,
						"aria-controls": "diagram-panel",
						tabIndex: v.tab === e.tab ? 0 : -1,
						onKeyDown: (t) => De(t, e.tab),
						onClick: () => y({
							tab: e.tab,
							key: v.key
						}),
						children: e.label
					}, e.tab))
				}),
				/* @__PURE__ */ (0, U.jsx)("div", {
					className: "detail-body",
					role: "tabpanel",
					id: "diagram-panel",
					"aria-labelledby": `diagram-tab-${v.tab}`,
					children: v.tab === "selection" ? ye ? /* @__PURE__ */ (0, U.jsx)(pi, {
						binding: ye,
						link: a
					}) : /* @__PURE__ */ (0, U.jsx)("p", {
						className: "muted",
						children: "Select a highlighted block to see the record it is bound to."
					}) : v.tab === "pins" ? /* @__PURE__ */ (0, U.jsx)(di, {
						diagram: R,
						pins: E,
						editor: be,
						selectedId: P,
						onSelect: F,
						onChanged: Ce
					}) : /* @__PURE__ */ (0, U.jsx)(mi, { history: he })
				})
			]
		})]
	});
}
function ui({ diagram: e, shape: t, onSaved: n }) {
	let { run: r, close: i } = B(), [a, o] = (0, _.useState)(""), [s, c] = (0, _.useState)(`Review comment on ${e.id} revision ${e.revision}`), l = t.w !== void 0 && t.h !== void 0 ? `region ${Math.round(t.x * 100)}%, ${Math.round(t.y * 100)}% (${Math.round(t.w * 100)}% × ${Math.round(t.h * 100)}%)` : `point ${Math.round(t.x * 100)}%, ${Math.round(t.y * 100)}%`;
	return /* @__PURE__ */ (0, U.jsxs)(Sn, {
		title: `Add review pin · ${e.id}`,
		submit: "Add pin",
		onSubmit: async () => {
			if (!a.trim()) throw Error("Write the comment before adding the pin.");
			await r("diagrams.pins.create", {
				diagramId: e.id,
				diagramRevision: e.revision,
				x: t.x,
				y: t.y,
				...t.w !== void 0 && t.h !== void 0 ? {
					w: t.w,
					h: t.h
				} : {},
				text: a.trim(),
				reason: s.trim()
			}, "Review pin added"), n(), i();
		},
		children: [
			/* @__PURE__ */ (0, U.jsxs)("p", {
				className: "muted small",
				children: [
					"Pinned at ",
					l,
					" of the diagram."
				]
			}),
			/* @__PURE__ */ (0, U.jsx)(K, {
				label: "Comment",
				hint: "Visible to everyone who can read this diagram.",
				children: /* @__PURE__ */ (0, U.jsx)("textarea", {
					autoFocus: !0,
					rows: 3,
					maxLength: 4e3,
					required: !0,
					value: a,
					onChange: (e) => o(e.currentTarget.value)
				})
			}),
			/* @__PURE__ */ (0, U.jsx)(K, {
				label: "Reason for the record",
				hint: "Stored in the audit history with your name.",
				children: /* @__PURE__ */ (0, U.jsx)("input", {
					value: s,
					maxLength: 2e3,
					required: !0,
					onChange: (e) => c(e.currentTarget.value)
				})
			})
		]
	});
}
function di({ diagram: e, pins: t, editor: n, selectedId: r, onSelect: i, onChanged: a }) {
	if (!t) return /* @__PURE__ */ (0, U.jsx)("p", {
		className: "loading",
		role: "status",
		children: "Loading review pins…"
	});
	let o = t.items.filter((e) => e.state === "Open").length, s = t.items.length - o, c = t.otherRevisions.filter((e) => e.open > 0);
	return /* @__PURE__ */ (0, U.jsxs)("section", {
		className: "review-pins",
		"aria-label": "Review pins",
		children: [
			/* @__PURE__ */ (0, U.jsxs)("p", {
				className: "small",
				children: [
					o,
					" open · ",
					s,
					" resolved on Rev ",
					e.revision
				]
			}),
			c.map((e) => /* @__PURE__ */ (0, U.jsxs)("p", {
				className: "muted small",
				children: [
					si(e.open, "open pin"),
					" on revision ",
					e.diagramRevision
				]
			}, e.diagramRevision)),
			t.items.length ? /* @__PURE__ */ (0, U.jsx)("ul", {
				className: "pin-list",
				children: t.items.map((e, t) => /* @__PURE__ */ (0, U.jsx)(fi, {
					pin: e,
					number: t + 1,
					editor: n,
					selected: r === e.id,
					onSelect: () => i(e.id),
					onChanged: a
				}, e.id))
			}) : /* @__PURE__ */ (0, U.jsxs)("p", {
				className: "muted",
				children: ["No review pins on this revision.", n ? " Use Add pin to comment on a part of the diagram." : ""]
			})
		]
	});
}
function fi({ pin: e, number: t, editor: n, selected: r, onSelect: i, onChanged: a }) {
	let { run: o } = B(), [s, c] = (0, _.useState)(""), [l, u] = (0, _.useState)(""), [d, f] = (0, _.useState)(!1), p = e.state === "Resolved", m = async (e) => {
		f(!0), u("");
		try {
			await e(), a();
		} catch (e) {
			z(e) || u(V(e, "The change could not be saved."));
		} finally {
			f(!1);
		}
	};
	return /* @__PURE__ */ (0, U.jsxs)("li", {
		className: "pin-item",
		"data-state": e.state,
		"data-selected": r || void 0,
		onFocus: i,
		children: [
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "pin-actions",
				children: [
					/* @__PURE__ */ (0, U.jsxs)("strong", { children: ["Pin ", t] }),
					/* @__PURE__ */ (0, U.jsx)("span", {
						className: "pill",
						"data-tone": p ? void 0 : "warn",
						children: p ? "Resolved" : "Open"
					}),
					e.anchor && /* @__PURE__ */ (0, U.jsxs)("span", {
						className: "muted small",
						children: ["Near ", /* @__PURE__ */ (0, U.jsx)("span", {
							className: "mono",
							children: e.anchor
						})]
					}),
					/* @__PURE__ */ (0, U.jsx)("span", {
						className: "muted small",
						children: e.w === null ? "Point" : "Region"
					})
				]
			}),
			/* @__PURE__ */ (0, U.jsx)("ol", {
				className: "pin-thread",
				"aria-label": `Thread for pin ${t}`,
				children: e.thread.map((e, t) => /* @__PURE__ */ (0, U.jsxs)("li", { children: [/* @__PURE__ */ (0, U.jsxs)("span", {
					className: "small",
					children: [
						/* @__PURE__ */ (0, U.jsx)("strong", { children: /* @__PURE__ */ (0, U.jsx)(Gn, { id: e.by }) }),
						" · ",
						gt[e.actorType] ?? e.actorType,
						" · ",
						/* @__PURE__ */ (0, U.jsx)("span", {
							className: "muted",
							title: e.at,
							children: Ht(e.at)
						})
					]
				}), /* @__PURE__ */ (0, U.jsx)("p", { children: e.text })] }, `${e.at}-${t}`))
			}),
			/* @__PURE__ */ (0, U.jsxs)("label", {
				className: "field",
				children: [/* @__PURE__ */ (0, U.jsxs)("span", {
					className: "small",
					children: ["Reply to pin ", t]
				}), /* @__PURE__ */ (0, U.jsx)("textarea", {
					rows: 2,
					maxLength: 4e3,
					value: s,
					disabled: !n || d,
					onChange: (e) => c(e.currentTarget.value)
				})]
			}),
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "pin-actions",
				children: [/* @__PURE__ */ (0, U.jsx)(G, {
					disabledReason: !n && "Viewers can read but not change records. Ask an administrator for editor access.",
					onClick: () => {
						s.trim() ? m(async () => {
							await o("diagrams.pins.reply", {
								id: e.id,
								expectedRevision: e.revision,
								text: s.trim(),
								reason: `Reply to review pin ${e.id}`
							}, "Reply added"), c("");
						}) : u("Write the reply first.");
					},
					children: "Reply"
				}), /* @__PURE__ */ (0, U.jsx)(G, {
					disabledReason: !n && "Viewers can read but not change records. Ask an administrator for editor access.",
					onClick: () => void m(() => o("diagrams.pins.resolve", {
						id: e.id,
						expectedRevision: e.revision,
						resolved: !p,
						reason: p ? `Reopened review pin ${e.id}` : `Resolved review pin ${e.id}`
					}, p ? "Pin reopened" : "Pin resolved")),
					children: p ? "Reopen" : "Resolve"
				})]
			}),
			l && /* @__PURE__ */ (0, U.jsx)("p", {
				className: "error",
				role: "alert",
				children: l
			})
		]
	});
}
function pi({ binding: e, link: t }) {
	let n = e.recordKind === "requirement", { current: r } = e;
	return /* @__PURE__ */ (0, U.jsxs)("section", {
		className: "diagram-selection",
		children: [
			/* @__PURE__ */ (0, U.jsxs)("p", {
				className: "detail-id",
				children: [/* @__PURE__ */ (0, U.jsx)("span", {
					className: "mono",
					children: e.recordId
				}), r.verification ? /* @__PURE__ */ (0, U.jsx)(en, { verification: r.verification }) : r.exists && r.state ? /* @__PURE__ */ (0, U.jsx)(W, { state: r.state }) : /* @__PURE__ */ (0, U.jsx)("span", {
					className: "pill",
					"data-tone": "bad",
					children: "Record not found"
				})]
			}),
			r.title && /* @__PURE__ */ (0, U.jsx)("p", {
				className: "statement-lg",
				children: r.title
			}),
			/* @__PURE__ */ (0, U.jsxs)("dl", {
				className: "facts",
				children: [
					/* @__PURE__ */ (0, U.jsx)("dt", { children: "Kind" }),
					/* @__PURE__ */ (0, U.jsx)("dd", { children: Mt[e.recordKind] ?? e.recordKind }),
					/* @__PURE__ */ (0, U.jsx)("dt", { children: "Drawn against" }),
					/* @__PURE__ */ (0, U.jsx)("dd", { children: n ? `Rev ${e.rev ?? 1}` : `Revision ${e.revision}` }),
					/* @__PURE__ */ (0, U.jsx)("dt", { children: "Current" }),
					/* @__PURE__ */ (0, U.jsx)("dd", { children: r.exists ? n ? `Rev ${r.rev ?? 1}` : `Revision ${r.revision}` : "Not found in this workspace" })
				]
			}),
			e.outdated && /* @__PURE__ */ (0, U.jsx)("p", { children: /* @__PURE__ */ (0, U.jsx)("span", {
				className: "pill",
				"data-tone": "warn",
				children: "Drawn against an older revision"
			}) }),
			r.exists && n && /* @__PURE__ */ (0, U.jsx)("p", { children: /* @__PURE__ */ (0, U.jsxs)("a", {
				href: t("requirements", e.recordId),
				children: ["Open ", /* @__PURE__ */ (0, U.jsx)("span", {
					className: "mono",
					children: e.recordId
				})]
			}) })
		]
	});
}
function mi({ history: e }) {
	return e.length ? /* @__PURE__ */ (0, U.jsx)("ol", {
		className: "timeline",
		children: e.map((e, t) => /* @__PURE__ */ (0, U.jsxs)("li", { children: [/* @__PURE__ */ (0, U.jsxs)("div", {
			className: "timeline-head",
			children: [/* @__PURE__ */ (0, U.jsxs)("span", {
				className: "pill",
				children: ["Rev ", e.revision]
			}), /* @__PURE__ */ (0, U.jsx)("strong", { children: oi[e.operation] ?? e.operation })]
		}), /* @__PURE__ */ (0, U.jsxs)("p", {
			className: "muted small",
			children: [
				/* @__PURE__ */ (0, U.jsx)("span", {
					title: e.at,
					children: Ht(e.at)
				}),
				" · ",
				/* @__PURE__ */ (0, U.jsx)(Gn, { id: e.actor }),
				" · ",
				gt[e.actorType] ?? e.actorType
			]
		})] }, `${e.revision}-${e.at}-${t}`))
	}) : /* @__PURE__ */ (0, U.jsx)("p", {
		className: "muted",
		children: "No changes recorded."
	});
}
// client/src/views/Diagrams.tsx
function hi() {
	let { route: e } = B();
	return e.id ? /* @__PURE__ */ (0, U.jsx)(li, { id: e.id }, e.id) : /* @__PURE__ */ (0, U.jsx)(gi, {});
}
function gi() {
	let { api: e, scopeRecord: t, link: n } = B(), r = t?.id, [i, a] = (0, _.useState)(null), [o, s] = (0, _.useState)("");
	return (0, _.useEffect)(() => {
		let t = !0;
		return a(null), s(""), wt(e, "diagrams.list", r ? { productId: r } : {}).then((e) => {
			t && a(e);
		}).catch((e) => {
			t && !z(e) && s(V(e, "Diagrams could not be loaded."));
		}), () => {
			t = !1;
		};
	}, [e, r]), /* @__PURE__ */ (0, U.jsxs)("div", {
		className: "page",
		children: [
			/* @__PURE__ */ (0, U.jsx)("h1", {
				className: "vh",
				children: "Diagrams"
			}),
			o && /* @__PURE__ */ (0, U.jsx)("p", {
				className: "error",
				role: "alert",
				children: o
			}),
			!o && !i && /* @__PURE__ */ (0, U.jsx)("p", {
				className: "loading",
				role: "status",
				children: "Loading diagrams…"
			}),
			i && !i.length && /* @__PURE__ */ (0, U.jsxs)(Qt, {
				title: "No diagrams yet",
				children: [
					"Functional diagrams are drawn by agents; each highlighted block is bound to a requirement and shows its live status. Agents create diagrams over MCP with ",
					/* @__PURE__ */ (0, U.jsx)("span", {
						className: "mono",
						children: "diagrams_create"
					}),
					". They submit SVG or HTML, RMS checks and stores it, and each block that names a requirement is bound to it. Uploading a file by hand comes later."
				]
			}),
			i && i.length > 0 && /* @__PURE__ */ (0, U.jsx)("div", {
				className: "table-wrap",
				title: "Functional diagrams drawn by agents. Each highlighted block is bound to a requirement and shows its live status.",
				children: /* @__PURE__ */ (0, U.jsxs)("table", {
					className: "matrix",
					"aria-label": "Diagrams",
					children: [/* @__PURE__ */ (0, U.jsx)("thead", { children: /* @__PURE__ */ (0, U.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, U.jsx)("th", {
							scope: "col",
							children: "ID"
						}),
						/* @__PURE__ */ (0, U.jsx)("th", {
							scope: "col",
							children: "Title"
						}),
						/* @__PURE__ */ (0, U.jsx)("th", {
							scope: "col",
							children: "Format"
						}),
						/* @__PURE__ */ (0, U.jsx)("th", {
							scope: "col",
							children: "State"
						}),
						/* @__PURE__ */ (0, U.jsx)("th", {
							scope: "col",
							children: "Revision"
						})
					] }) }), /* @__PURE__ */ (0, U.jsx)("tbody", { children: i.map((e) => /* @__PURE__ */ (0, U.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, U.jsx)("th", {
							scope: "row",
							children: /* @__PURE__ */ (0, U.jsx)("a", {
								className: "mono",
								href: n("diagrams", e.id),
								children: e.id
							})
						}),
						/* @__PURE__ */ (0, U.jsx)("td", { children: e.title }),
						/* @__PURE__ */ (0, U.jsx)("td", { children: String(e.format).toUpperCase() }),
						/* @__PURE__ */ (0, U.jsx)("td", { children: /* @__PURE__ */ (0, U.jsx)(W, { state: e.state }) }),
						/* @__PURE__ */ (0, U.jsxs)("td", { children: ["Rev ", e.revision] })
					] }, e.id)) })]
				})
			})
		]
	});
}
// client/src/views/RequirementDetail.tsx
var _i = [
	"statement",
	"criteria",
	"rationale",
	"category",
	"comment",
	"sourceUrl"
], vi = ["statement", "criteria"], yi = [
	"statement",
	"criteria",
	"rationale",
	"category"
], bi = {
	hierarchy: "below this requirement",
	baseline_member: "contains this requirement"
}, xi = {
	statement: "statement",
	criteria: "acceptance criteria",
	rationale: "rationale",
	category: "category",
	comment: "comment",
	sourceUrl: "source link"
};
function Si({ record: e, onClose: t }) {
	let { ws: n, ix: r, session: i, open: a, link: o, run: s, api: c } = B(), [l, u] = (0, _.useState)(!1), [d, f] = (0, _.useState)("overview"), p = (0, _.useRef)(null);
	Ut(), (0, _.useEffect)(() => {
		p.current?.focus();
	}, []), (0, _.useEffect)(() => {
		let e = (e) => {
			e.key === "Escape" && !Wt() && !l && t();
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [l, t]);
	let m = Lt(n.process, e.state, i.role), h = [...new Set((n.process.transitions ?? []).filter((t) => t.from === e.state).map((e) => String(e.to)))], g = m.includes("Approved") ? "Approved" : m.includes("In Review") ? "In Review" : void 0, v = !g && h.includes("Approved") ? "Approved" : !g && h.includes("In Review") ? "In Review" : void 0, y = e.parents ?? [], b = r.childrenOf(e.id), x = r.casesOf(e.id), S = r.linksOf("requirement", e.id).filter((e) => e.type !== "verifies"), C = r.product.get(e.productId), w = at(i), T = ht(e);
	async function E() {
		try {
			await navigator.clipboard.writeText(window.location.href);
		} catch {}
	}
	return /* @__PURE__ */ (0, U.jsxs)("aside", {
		className: "detail",
		ref: p,
		tabIndex: -1,
		"aria-label": `Requirement ${e.id}`,
		children: [
			/* @__PURE__ */ (0, U.jsxs)("header", {
				className: "detail-head",
				children: [/* @__PURE__ */ (0, U.jsxs)("div", {
					className: "detail-id",
					children: [
						/* @__PURE__ */ (0, U.jsx)("span", {
							className: "mono",
							children: e.id
						}),
						/* @__PURE__ */ (0, U.jsx)(W, { state: e.state }),
						e.selfApprovedBy && e.state === "Approved" && /* @__PURE__ */ (0, U.jsx)("span", {
							className: "pill",
							"data-tone": "warn",
							title: "The approver also wrote this revision (workspace setting: allowed and marked).",
							children: "Approved by its author"
						}),
						/* @__PURE__ */ (0, U.jsxs)("span", {
							className: "muted small",
							children: ["Rev ", T]
						})
					]
				}), /* @__PURE__ */ (0, U.jsxs)("div", {
					className: "detail-tools",
					children: [/* @__PURE__ */ (0, U.jsx)("button", {
						type: "button",
						className: "quiet small",
						onClick: () => void E(),
						title: "Copy a link to this requirement",
						children: "Copy link"
					}), /* @__PURE__ */ (0, U.jsx)("button", {
						type: "button",
						className: "icon",
						"aria-label": "Close details",
						onClick: t,
						children: "×"
					})]
				})]
			}),
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "next-step",
				children: [
					g && /* @__PURE__ */ (0, U.jsx)(G, {
						className: "primary",
						onClick: () => a(/* @__PURE__ */ (0, U.jsx)(Tn, {
							records: [e],
							to: g
						})),
						children: Rt(g)
					}),
					v && /* @__PURE__ */ (0, U.jsx)(G, {
						className: "primary",
						disabledReason: v === "Approved" ? "Approval decisions need the Product owner (approver) role." : "Viewers can read but not change records. Ask an administrator for editor access.",
						onClick: () => void 0,
						children: Rt(v)
					}),
					m.filter((e) => e !== g).map((t) => /* @__PURE__ */ (0, U.jsx)(G, {
						onClick: () => a(/* @__PURE__ */ (0, U.jsx)(Tn, {
							records: [e],
							to: t
						})),
						children: Rt(t)
					}, t)),
					!l && /* @__PURE__ */ (0, U.jsx)(G, {
						disabledReason: !w && "Viewers can read but not change records. Ask an administrator for editor access.",
						onClick: () => {
							f("overview"), u(!0);
						},
						children: "Edit"
					}),
					/* @__PURE__ */ (0, U.jsx)("p", {
						className: "muted small next-hint",
						children: Ci(e, m)
					})
				]
			}),
			/* @__PURE__ */ (0, U.jsxs)("nav", {
				className: "tabs",
				"aria-label": "Requirement sections",
				children: [/* @__PURE__ */ (0, U.jsx)("button", {
					type: "button",
					"aria-current": d === "overview" ? "page" : void 0,
					onClick: () => f("overview"),
					children: "Overview"
				}), /* @__PURE__ */ (0, U.jsx)("button", {
					type: "button",
					"aria-current": d === "history" ? "page" : void 0,
					onClick: () => f("history"),
					children: "History"
				})]
			}),
			d === "history" ? /* @__PURE__ */ (0, U.jsx)(ir, {
				recordId: e.id,
				recordKind: "requirement"
			}) : l ? /* @__PURE__ */ (0, U.jsx)(Di, {
				record: e,
				onDone: () => u(!1)
			}) : /* @__PURE__ */ (0, U.jsxs)("div", {
				className: "detail-body",
				children: [
					/* @__PURE__ */ (0, U.jsx)("p", {
						className: "statement-lg",
						children: e.statement
					}),
					/* @__PURE__ */ (0, U.jsxs)("section", { children: [/* @__PURE__ */ (0, U.jsx)("h3", { children: "Acceptance criteria" }), /* @__PURE__ */ (0, U.jsx)("p", {
						className: "prose",
						children: e.criteria
					})] }),
					e.rationale && /* @__PURE__ */ (0, U.jsxs)("section", { children: [/* @__PURE__ */ (0, U.jsx)("h3", { children: "Rationale" }), /* @__PURE__ */ (0, U.jsx)("p", {
						className: "prose muted-ink",
						children: e.rationale
					})] }),
					e.comment && /* @__PURE__ */ (0, U.jsxs)("section", { children: [/* @__PURE__ */ (0, U.jsx)("h3", { children: "Comment" }), /* @__PURE__ */ (0, U.jsx)("p", {
						className: "prose pre",
						children: e.comment
					})] }),
					e.sourceUrl && /* @__PURE__ */ (0, U.jsxs)("section", { children: [/* @__PURE__ */ (0, U.jsx)("h3", { children: "Source" }), /* @__PURE__ */ (0, U.jsx)("p", {
						className: "prose break",
						children: /* @__PURE__ */ (0, U.jsxs)("a", {
							href: e.sourceUrl,
							target: "_blank",
							rel: "noreferrer",
							children: [e.sourceUrl, " ↗"]
						})
					})] }),
					/* @__PURE__ */ (0, U.jsxs)("dl", {
						className: "facts",
						children: [
							/* @__PURE__ */ (0, U.jsx)("dt", { children: "Category" }),
							/* @__PURE__ */ (0, U.jsx)("dd", { children: e.category }),
							/* @__PURE__ */ (0, U.jsx)("dt", { children: "Owner" }),
							/* @__PURE__ */ (0, U.jsx)("dd", { children: C?.name ?? e.productId }),
							(e.appliesTo ?? []).length > 0 && /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [/* @__PURE__ */ (0, U.jsx)("dt", { children: "Also applies to" }), /* @__PURE__ */ (0, U.jsx)("dd", { children: e.appliesTo.join(", ") })] })
						]
					}),
					/* @__PURE__ */ (0, U.jsx)(mn, {
						defs: n.metamodel.recordAttributes.requirement,
						values: e.attributes ?? {}
					}),
					e.provenance?.source === "workbook" && /* @__PURE__ */ (0, U.jsxs)("p", {
						className: "muted small",
						children: ["Imported from workbook row ", e.provenance.row]
					}),
					/* @__PURE__ */ (0, U.jsxs)("section", {
						className: "connections",
						children: [
							/* @__PURE__ */ (0, U.jsxs)("div", {
								className: "conn-head",
								children: [/* @__PURE__ */ (0, U.jsx)("h3", { children: "Refines" }), /* @__PURE__ */ (0, U.jsx)(G, {
									className: "link",
									disabledReason: !w && "Viewers can read but not change records. Ask an administrator for editor access.",
									onClick: () => a(/* @__PURE__ */ (0, U.jsx)(En, { record: e })),
									children: "Change"
								})]
							}),
							y.length ? /* @__PURE__ */ (0, U.jsx)("ul", {
								className: "refs",
								children: y.map((e) => /* @__PURE__ */ (0, U.jsx)(wi, {
									kind: "requirement",
									id: e
								}, e))
							}) : /* @__PURE__ */ (0, U.jsx)("p", {
								className: "muted small",
								children: "Top-level requirement."
							}),
							/* @__PURE__ */ (0, U.jsxs)("div", {
								className: "conn-head",
								children: [/* @__PURE__ */ (0, U.jsxs)("h3", { children: ["Refined by ", /* @__PURE__ */ (0, U.jsx)("span", {
									className: "count",
									children: b.length
								})] }), /* @__PURE__ */ (0, U.jsx)(G, {
									className: "link",
									disabledReason: !w && "Viewers can read but not change records. Ask an administrator for editor access.",
									onClick: () => a(/* @__PURE__ */ (0, U.jsx)(wn, { parent: e })),
									children: "+ Add child"
								})]
							}),
							b.length ? /* @__PURE__ */ (0, U.jsx)("ul", {
								className: "refs",
								children: b.map((e) => /* @__PURE__ */ (0, U.jsx)(wi, {
									kind: "requirement",
									id: e.id
								}, e.id))
							}) : /* @__PURE__ */ (0, U.jsx)("p", {
								className: "muted small",
								children: "No child requirements."
							}),
							/* @__PURE__ */ (0, U.jsxs)("div", {
								className: "conn-head",
								children: [/* @__PURE__ */ (0, U.jsxs)("h3", { children: ["Verified by ", /* @__PURE__ */ (0, U.jsx)("span", {
									className: "count",
									children: x.length
								})] }), /* @__PURE__ */ (0, U.jsx)(G, {
									className: "link",
									disabledReason: !w && "Viewers can read but not change records. Ask an administrator for editor access.",
									onClick: () => a(/* @__PURE__ */ (0, U.jsx)(An, { requirement: e })),
									children: "+ Add test case"
								})]
							}),
							x.length ? /* @__PURE__ */ (0, U.jsx)("ul", {
								className: "refs",
								children: x.map((e) => /* @__PURE__ */ (0, U.jsxs)("li", { children: [
									/* @__PURE__ */ (0, U.jsxs)("a", {
										href: o("verification", e.id),
										children: [/* @__PURE__ */ (0, U.jsx)("span", {
											className: "mono",
											children: e.id
										}), /* @__PURE__ */ (0, U.jsx)("span", {
											className: "clamp",
											children: e.name
										})]
									}),
									/* @__PURE__ */ (0, U.jsxs)("span", {
										className: "ref-meta",
										children: [
											e.mandatory ? "Mandatory" : "Optional",
											" · ",
											e.targetLevel
										]
									}),
									/* @__PURE__ */ (0, U.jsx)(Gt, { result: r.latestRun(e.id)?.result }),
									e.status && e.status !== "Active" && /* @__PURE__ */ (0, U.jsx)(W, { state: e.status }),
									r.isStale(e) && /* @__PURE__ */ (0, U.jsx)("span", {
										className: "pill",
										"data-tone": "warn",
										title: `Written for Rev ${e.requirementRev ?? 1}; the requirement is now Rev ${T}.`,
										children: "Re-check"
									})
								] }, e.id))
							}) : /* @__PURE__ */ (0, U.jsx)("p", {
								className: "muted small",
								children: "Not covered by any test case yet."
							}),
							/* @__PURE__ */ (0, U.jsx)(Ti, { record: e }),
							/* @__PURE__ */ (0, U.jsxs)("div", {
								className: "conn-head",
								children: [/* @__PURE__ */ (0, U.jsxs)("h3", { children: ["Connected ", /* @__PURE__ */ (0, U.jsx)("span", {
									className: "count",
									children: S.length
								})] }), /* @__PURE__ */ (0, U.jsx)(G, {
									className: "link",
									disabledReason: !w && "Viewers can read but not change records. Ask an administrator for editor access.",
									onClick: () => a(/* @__PURE__ */ (0, U.jsx)(On, { from: {
										kind: "requirement",
										id: e.id,
										title: e.statement
									} })),
									children: "+ Connect"
								})]
							}),
							S.length ? /* @__PURE__ */ (0, U.jsx)("ul", {
								className: "refs",
								children: S.map((t) => {
									let n = (t.fromKind ?? "requirement") === "requirement" && t.from === e.id, i = n ? t.toKind ?? "requirement" : t.fromKind ?? "requirement", a = n ? t.to : t.from;
									return /* @__PURE__ */ (0, U.jsx)(wi, {
										kind: i,
										id: a,
										label: r.relation(t.type, n),
										review: t.needsReview,
										note: t.note
									}, t.id);
								})
							}) : /* @__PURE__ */ (0, U.jsx)("p", {
								className: "muted small",
								children: "No use cases, actors or other requirements connected."
							})
						]
					})
				]
			})
		]
	});
}
function Ci(e, t) {
	return e.state === "Draft" ? t.includes("In Review") ? "When the wording is final, submit it for product owner review." : "A requirements engineer will submit this for review." : e.state === "In Review" ? t.includes("Approved") ? "Read the statement and criteria, then approve or reject." : "Waiting for the product owner's decision." : e.state === "Approved" ? "Changing the statement or criteria starts the next revision as a draft; other edits keep it approved." : e.state === "Rejected" ? "Edit the wording to start a new draft, then resubmit." : "";
}
function wi({ kind: e, id: t, label: n, review: r, note: i }) {
	let { ix: a, link: o } = B(), s = a.records.get(`${e}:${t}`);
	if (e === "github") return /* @__PURE__ */ (0, U.jsxs)("li", { children: [
		/* @__PURE__ */ (0, U.jsx)(tn, { id: t }),
		/* @__PURE__ */ (0, U.jsxs)("span", {
			className: "ref-meta",
			children: [n ? `${n} · ` : "", Mt.github]
		}),
		/* @__PURE__ */ (0, U.jsx)(nn, { text: i })
	] });
	let c = e === "requirement" ? o("requirements", t) : e === "test_case" ? o("verification", t) : ["actor", "use_case"].includes(e) ? o("library", t) : e === "element" ? o("elements", t) : void 0, l = /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [/* @__PURE__ */ (0, U.jsx)("span", {
		className: "mono",
		children: t
	}), /* @__PURE__ */ (0, U.jsx)("span", {
		className: "clamp",
		children: a.title(e, t) || Mt[e]
	})] });
	return /* @__PURE__ */ (0, U.jsxs)("li", { children: [
		c ? /* @__PURE__ */ (0, U.jsx)("a", {
			href: c,
			children: l
		}) : /* @__PURE__ */ (0, U.jsx)("span", {
			className: "ref",
			children: l
		}),
		/* @__PURE__ */ (0, U.jsxs)("span", {
			className: "ref-meta",
			children: [n ? `${n} · ` : "", Mt[e] ?? e]
		}),
		s?.state && /* @__PURE__ */ (0, U.jsx)(W, { state: s.state }),
		r && /* @__PURE__ */ (0, U.jsx)("span", {
			className: "pill",
			"data-tone": "warn",
			title: "One side changed revision after this link was made.",
			children: "Re-check"
		}),
		/* @__PURE__ */ (0, U.jsx)(nn, { text: i })
	] });
}
function Ti({ record: e }) {
	let { api: t, ws: n, ix: r } = B(), [i, a] = (0, _.useState)(null), [o, s] = (0, _.useState)("");
	(0, _.useEffect)(() => {
		let n = !0;
		return s(""), t.command("verification.evaluate", { requirementId: e.id }).then((e) => {
			n && a(e);
		}).catch((e) => {
			n && !z(e) && s(V(e, "Verification could not be loaded."));
		}), () => {
			n = !1;
		};
	}, [
		t,
		e.id,
		n
	]);
	let c = i ?? r.verificationOf(e.id);
	return /* @__PURE__ */ (0, U.jsxs)("section", {
		className: "verification",
		"aria-label": "Verification",
		children: [
			/* @__PURE__ */ (0, U.jsx)("div", {
				className: "conn-head",
				children: /* @__PURE__ */ (0, U.jsx)("h3", { children: "Verification" })
			}),
			o && /* @__PURE__ */ (0, U.jsx)("p", {
				className: "error",
				role: "alert",
				children: o
			}),
			!i && !o && /* @__PURE__ */ (0, U.jsx)("p", {
				className: "muted small",
				role: "status",
				children: "Checking verification…"
			}),
			i && c && /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [
				/* @__PURE__ */ (0, U.jsxs)("p", {
					className: "verify-line",
					children: [/* @__PURE__ */ (0, U.jsx)(en, { verification: c }), /* @__PURE__ */ (0, U.jsxs)("span", {
						className: "small",
						children: [
							"Highest verified level: ",
							i.highestVerifiedLevel ?? "none yet",
							" · ",
							i.passingCaseCount,
							" of ",
							i.mandatoryCaseCount,
							" mandatory cases pass"
						]
					})]
				}),
				i.cases.length === 0 && /* @__PURE__ */ (0, U.jsxs)("p", {
					className: "muted small",
					children: [vt("no_mandatory_test_cases"), "."]
				}),
				/* @__PURE__ */ (0, U.jsx)("ul", {
					className: "verify-cases",
					children: i.cases.map((t) => /* @__PURE__ */ (0, U.jsx)(Ei, {
						verdict: t,
						record: e
					}, t.testCaseId))
				})
			] })
		]
	});
}
function Ei({ verdict: e, record: t }) {
	let { ws: n, session: r, open: i, link: a } = B(), o = n.testCases.find((t) => t.id === e.testCaseId), s = e.attestation, c = !!o && Number(o.requirementRev ?? 1) !== ht(t), l = at(r) ? o ? c ? `Update ${o.id} for Rev ${ht(t)} before attesting coverage.` : !1 : "This test case is not in the workspace." : st;
	return /* @__PURE__ */ (0, U.jsxs)("li", {
		className: "verify-case",
		children: [
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "verify-case-head",
				children: [/* @__PURE__ */ (0, U.jsxs)("a", {
					href: a("verification", e.testCaseId),
					children: [
						/* @__PURE__ */ (0, U.jsx)("span", {
							className: "mono",
							children: e.testCaseId
						}),
						" ",
						/* @__PURE__ */ (0, U.jsx)("span", {
							className: "clamp",
							children: o?.name ?? ""
						})
					]
				}), /* @__PURE__ */ (0, U.jsxs)("span", {
					className: "ref-meta",
					children: [e.targetLevel || "No target", " target"]
				})]
			}),
			/* @__PURE__ */ (0, U.jsxs)("dl", {
				className: "verify-facts",
				children: [
					/* @__PURE__ */ (0, U.jsx)("dt", { children: "Coverage" }),
					/* @__PURE__ */ (0, U.jsxs)("dd", { children: [s ? String(s.coverage) : "None", s?.provenance === "historical" && /* @__PURE__ */ (0, U.jsx)("span", {
						className: "pill",
						children: "Historical"
					})] }),
					/* @__PURE__ */ (0, U.jsx)("dt", { children: "Deciding run" }),
					/* @__PURE__ */ (0, U.jsx)("dd", { children: e.decidingResult ? /* @__PURE__ */ (0, U.jsx)(Gt, { result: e.decidingResult }) : /* @__PURE__ */ (0, U.jsx)("span", {
						className: "muted small",
						children: "No run yet"
					}) })
				]
			}),
			e.reasons.length > 0 && /* @__PURE__ */ (0, U.jsx)("ul", {
				className: "verify-reasons",
				children: e.reasons.map((e) => /* @__PURE__ */ (0, U.jsx)("li", { children: vt(e) }, e))
			}),
			/* @__PURE__ */ (0, U.jsx)(G, {
				className: "small",
				disabledReason: l,
				onClick: () => o && i(/* @__PURE__ */ (0, U.jsx)(kn, {
					testCase: o,
					requirement: t
				})),
				children: "Attest coverage"
			})
		]
	});
}
function Di({ record: e, onDone: t }) {
	let { api: n, run: r, ws: i, ix: a, refresh: o } = B(), [s, c] = (0, _.useState)(e), [l, u] = (0, _.useState)(null), d = (0, _.useRef)(null);
	(0, _.useEffect)(() => {
		l && d.current?.scrollIntoView({
			block: "nearest",
			behavior: "smooth"
		});
	}, [l]);
	let f = i.metamodel.recordAttributes.requirement, [p, m] = (0, _.useState)(() => rn(f, s.attributes ?? {})), h = on(f, s.attributes ?? {}, p), g = Object.keys(h.patch).length > 0, v = Object.keys(h.patch).map((e) => f.find((t) => t.key === e)?.label ?? e), [y, b] = (0, _.useState)(() => Object.fromEntries(_i.map((e) => [e, String(s[e] ?? "")]))), x = _i.filter((e) => y[e] !== String(s[e] ?? "")), S = x.filter((e) => vi.includes(e)), C = x.filter((e) => yi.includes(e)), w = S.length > 0 && s.state !== "Draft", T = x.length || g ? `Updated ${[...x.map((e) => xi[e]), ...v.map((e) => `${e} attribute`)].join(" and ")}` : "", [E, D] = (0, _.useState)(""), [O, k] = (0, _.useState)(null), [A, j] = (0, _.useState)("idle"), [M, N] = (0, _.useState)(""), [P, F] = (0, _.useState)(!1);
	(0, _.useEffect)(() => {
		if (!C.length) {
			k(null), j("idle");
			return;
		}
		let e = !0;
		j("loading");
		let t = window.setTimeout(() => {
			let t = Object.fromEntries(C.map((e) => [e, y[e]]));
			n.command("requirements.impact", {
				id: s.id,
				expectedRevision: s.revision,
				proposed: t
			}).then((t) => {
				e && (k(t), j("idle"));
			}).catch(() => {
				e && j("error");
			});
		}, 600);
		return () => {
			e = !1, window.clearTimeout(t);
		};
	}, [y, s.revision]);
	async function I(e) {
		if (e.preventDefault(), !x.length && !g) t();
		else {
			F(!0), N("");
			try {
				await r("requirements.revise", {
					id: s.id,
					expectedRevision: s.revision,
					reason: E.trim() || T,
					...Object.fromEntries(x.map((e) => [e, y[e]])),
					...g ? { attributes: h.patch } : {}
				}, w ? `${s.id} saved as draft Rev ${ht(s) + 1}` : S.length ? `${s.id} saved as Rev ${ht(s) + 1}` : `${s.id} saved`), t();
			} catch (e) {
				if (e instanceof qe && e.status === 409) {
					let e = await n.command("requirements.get", { id: s.id }).catch(() => null);
					if (e && e.revision !== s.revision) {
						u(e), N("");
						return;
					}
				}
				N(V(e, "The revision could not be saved."));
			} finally {
				F(!1);
			}
		}
	}
	function ee(e) {
		b((t) => Object.fromEntries(_i.map((n) => [n, t[n] === String(s[n] ?? "") ? String(e[n] ?? "") : t[n]]))), c(e), u(null), o();
	}
	let te = Array.isArray(O?.affected) ? O.affected : [], ne = Array.isArray(O?.warnings) ? O.warnings : [], re = Array.isArray(O?.external) ? O.external.filter((e) => e.reason === "github") : [], ie = (e) => (t) => {
		let n = t.currentTarget.value;
		b((t) => ({
			...t,
			[e]: n
		}));
	};
	return /* @__PURE__ */ (0, U.jsxs)("form", {
		className: "detail-body edit",
		onSubmit: I,
		children: [
			/* @__PURE__ */ (0, U.jsxs)("label", {
				className: "field",
				children: [/* @__PURE__ */ (0, U.jsx)("span", { children: "Statement" }), /* @__PURE__ */ (0, U.jsx)("textarea", {
					rows: 4,
					value: y.statement,
					onChange: ie("statement"),
					required: !0,
					autoFocus: !0
				})]
			}),
			/* @__PURE__ */ (0, U.jsxs)("label", {
				className: "field",
				children: [/* @__PURE__ */ (0, U.jsx)("span", { children: "Acceptance criteria" }), /* @__PURE__ */ (0, U.jsx)("textarea", {
					rows: 5,
					value: y.criteria,
					onChange: ie("criteria"),
					required: !0
				})]
			}),
			/* @__PURE__ */ (0, U.jsxs)("label", {
				className: "field",
				children: [/* @__PURE__ */ (0, U.jsx)("span", { children: "Rationale" }), /* @__PURE__ */ (0, U.jsx)("textarea", {
					rows: 3,
					value: y.rationale,
					onChange: ie("rationale")
				})]
			}),
			/* @__PURE__ */ (0, U.jsxs)("label", {
				className: "field",
				children: [/* @__PURE__ */ (0, U.jsx)("span", { children: "Category" }), /* @__PURE__ */ (0, U.jsx)("input", {
					value: y.category,
					onChange: ie("category"),
					required: !0
				})]
			}),
			/* @__PURE__ */ (0, U.jsxs)("label", {
				className: "field",
				children: [
					/* @__PURE__ */ (0, U.jsx)("span", { children: "Comment" }),
					/* @__PURE__ */ (0, U.jsx)("textarea", {
						rows: 3,
						value: y.comment,
						onChange: ie("comment")
					}),
					/* @__PURE__ */ (0, U.jsx)("small", {
						className: "muted",
						children: "Optional. Does not change the revision."
					})
				]
			}),
			/* @__PURE__ */ (0, U.jsxs)("label", {
				className: "field",
				children: [
					/* @__PURE__ */ (0, U.jsx)("span", { children: "Source URL" }),
					/* @__PURE__ */ (0, U.jsx)("input", {
						type: "url",
						inputMode: "url",
						value: y.sourceUrl,
						onChange: ie("sourceUrl"),
						placeholder: "https://"
					}),
					/* @__PURE__ */ (0, U.jsx)("small", {
						className: "muted",
						children: "Optional HTTPS link. Clear it to remove."
					})
				]
			}),
			/* @__PURE__ */ (0, U.jsx)(fn, {
				idPrefix: "req-attr",
				defs: f,
				draft: p,
				onChange: m,
				errors: h.errors
			}),
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "impact",
				"aria-live": "polite",
				children: [
					x.length ? C.length ? A === "loading" ? /* @__PURE__ */ (0, U.jsx)("p", {
						className: "muted small",
						children: "Checking impact…"
					}) : A === "error" ? /* @__PURE__ */ (0, U.jsx)("p", {
						className: "muted small",
						children: "Impact could not be checked right now. You can still save."
					}) : /* @__PURE__ */ (0, U.jsx)("p", { children: /* @__PURE__ */ (0, U.jsx)("strong", { children: te.length ? `${te.length} linked record${te.length === 1 ? "" : "s"} may need review` : "No linked records are affected." }) }) : /* @__PURE__ */ (0, U.jsx)("p", {
						className: "muted small",
						children: "Metadata changes keep the revision; linked records are not affected."
					}) : /* @__PURE__ */ (0, U.jsx)("p", {
						className: "muted small",
						children: "Change the text to see what else is affected."
					}),
					te.length > 0 && /* @__PURE__ */ (0, U.jsx)("ul", {
						className: "refs compact",
						children: te.slice(0, 8).map((e) => /* @__PURE__ */ (0, U.jsxs)("li", { children: [/* @__PURE__ */ (0, U.jsx)("span", {
							className: "mono",
							children: e.record?.id
						}), /* @__PURE__ */ (0, U.jsxs)("span", {
							className: "ref-meta",
							children: [
								Mt[e.record?.kind] ?? e.record?.kind,
								bi[e.via] ? ` · ${bi[e.via]}` : e.path?.[0]?.relationType ? ` · ${a.relation(e.path[e.path.length - 1].relationType, !1)}` : "",
								e.baseline?.state ? ` · ${e.baseline.state}` : ""
							]
						})] }, `${e.record?.kind}:${e.record?.id}`))
					}),
					te.length > 8 && /* @__PURE__ */ (0, U.jsxs)("p", {
						className: "muted small",
						children: [
							"and ",
							te.length - 8,
							" more."
						]
					}),
					re.length > 0 && /* @__PURE__ */ (0, U.jsxs)("p", {
						className: "muted small",
						children: [
							"Also linked outside RMS: ",
							re.map((e) => e.id).join(", "),
							"."
						]
					}),
					ne.map((e, t) => /* @__PURE__ */ (0, U.jsx)("p", {
						className: "muted small",
						role: "note",
						children: String(e.message)
					}, t)),
					w && /* @__PURE__ */ (0, U.jsxs)("p", {
						className: "muted small",
						children: [
							"Saving creates draft Rev ",
							ht(s) + 1,
							". The ",
							s.state.toLowerCase(),
							" Rev ",
							ht(s),
							" stays in history."
						]
					}),
					!S.length && C.length > 0 && /* @__PURE__ */ (0, U.jsxs)("p", {
						className: "muted small",
						children: [
							"Rationale and category changes keep Rev ",
							ht(s),
							s.state === "Draft" ? "" : ` and the ${s.state.toLowerCase()} state`,
							"."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, U.jsxs)("label", {
				className: "field",
				children: [/* @__PURE__ */ (0, U.jsx)("span", { children: "Reason" }), /* @__PURE__ */ (0, U.jsx)("input", {
					value: E,
					placeholder: T || "What changed and why",
					onChange: (e) => D(e.currentTarget.value),
					maxLength: 2e3
				})]
			}),
			l && /* @__PURE__ */ (0, U.jsxs)("div", {
				className: "conflict",
				role: "alert",
				ref: d,
				children: [
					/* @__PURE__ */ (0, U.jsxs)("p", { children: [
						/* @__PURE__ */ (0, U.jsx)("strong", { children: "Someone saved this requirement while you were editing" }),
						" (now revision ",
						String(l.revision),
						l.state === s.state ? "" : `, ${l.state}`,
						"). Nothing of yours was saved, and your text is still in the form."
					] }),
					_i.filter((e) => String(l[e] ?? "") !== String(s[e] ?? "")).map((e) => /* @__PURE__ */ (0, U.jsx)(rr, {
						field: e,
						before: s[e] ?? "",
						after: l[e] ?? ""
					}, e)),
					/* @__PURE__ */ (0, U.jsxs)("div", {
						className: "row-actions",
						children: [/* @__PURE__ */ (0, U.jsx)("button", {
							type: "button",
							className: "primary small",
							onClick: () => ee(l),
							children: "Keep my changes on their version"
						}), /* @__PURE__ */ (0, U.jsx)("button", {
							type: "button",
							className: "quiet small",
							onClick: () => {
								o(), t();
							},
							children: "Discard mine and show theirs"
						})]
					})
				]
			}),
			M && /* @__PURE__ */ (0, U.jsx)("p", {
				className: "error",
				role: "alert",
				children: M
			}),
			/* @__PURE__ */ (0, U.jsxs)("footer", {
				className: "edit-actions",
				children: [/* @__PURE__ */ (0, U.jsx)("button", {
					type: "button",
					className: "quiet",
					onClick: t,
					disabled: P,
					children: "Cancel"
				}), /* @__PURE__ */ (0, U.jsx)("button", {
					type: "submit",
					className: "primary",
					disabled: P || !x.length && !g || Object.keys(h.errors).length > 0,
					children: P ? "Saving…" : "Save revision"
				})]
			})
		]
	});
}
// client/src/views/Elements.tsx
var Oi = [
	"Draft",
	"Active",
	"Retired"
];
function ki() {
	let { ws: e, scope: t, link: n, route: r, go: i } = B(), a = r.params.get("type") ?? "", o = r.params.get("attr") ?? "", s = r.params.get("av") ?? "", [c, l] = (0, _.useState)(""), u = e.metamodel.elementTypes, d = u.find((e) => e.id === a), f = d?.attributes ?? [], p = f.find((e) => e.key === o), m = e.elements.filter((n) => It(e, t, n)), h = c.trim().toLowerCase(), g = m.filter((e) => (!a || e.elementType === a) && (!p || !s || sn(p, e.attributes?.[p.key], s)) && (!h || `${e.id} ${e.name} ${e.description ?? ""}`.toLowerCase().includes(h))), v = r.id ? e.elements.find((e) => e.id === r.id) : void 0, y = !!(h || a || s), b = (e) => ({
		type: a,
		attr: o,
		av: s,
		...e
	}), x = (t) => e.products.find((e) => e.id === t)?.name ?? t;
	return /* @__PURE__ */ (0, U.jsxs)("div", {
		className: `page specification${r.id ? " with-detail" : ""}`,
		children: [
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "spec-main",
				children: [
					/* @__PURE__ */ (0, U.jsx)("h1", {
						className: "vh",
						children: "Elements"
					}),
					/* @__PURE__ */ (0, U.jsxs)("div", {
						className: "toolbar",
						children: [
							/* @__PURE__ */ (0, U.jsx)("input", {
								type: "search",
								className: "search",
								"aria-label": "Filter elements",
								title: "Elements are design facts, such as signals or connectors, that requirements and tests link to.",
								placeholder: `Filter ${m.length} elements by ID, name or description`,
								value: c,
								onChange: (e) => l(e.currentTarget.value)
							}),
							/* @__PURE__ */ (0, U.jsxs)("select", {
								"aria-label": "Element type",
								value: a,
								onChange: (e) => i("elements", r.id || void 0, b({
									type: e.currentTarget.value,
									attr: "",
									av: ""
								}), !0),
								children: [/* @__PURE__ */ (0, U.jsx)("option", {
									value: "",
									children: "All types"
								}), u.map((e) => /* @__PURE__ */ (0, U.jsx)("option", {
									value: e.id,
									children: e.label
								}, e.id))]
							}),
							d && f.length > 0 && /* @__PURE__ */ (0, U.jsx)(hn, {
								defs: f,
								attribute: o,
								value: s,
								onChange: (e) => i("elements", r.id || void 0, b({
									attr: e.attribute,
									av: e.value
								}), !0)
							})
						]
					}),
					g.length ? /* @__PURE__ */ (0, U.jsx)("div", {
						className: "table-wrap",
						children: /* @__PURE__ */ (0, U.jsxs)("table", {
							className: "matrix elements-matrix",
							"aria-label": "Elements",
							children: [/* @__PURE__ */ (0, U.jsx)("thead", { children: /* @__PURE__ */ (0, U.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, U.jsx)("th", {
									scope: "col",
									children: "ID"
								}),
								/* @__PURE__ */ (0, U.jsx)("th", {
									scope: "col",
									children: "Name"
								}),
								/* @__PURE__ */ (0, U.jsx)("th", {
									scope: "col",
									children: "Type"
								}),
								/* @__PURE__ */ (0, U.jsx)("th", {
									scope: "col",
									children: "Product"
								}),
								/* @__PURE__ */ (0, U.jsx)("th", {
									scope: "col",
									children: "State"
								}),
								f.slice(0, 3).map((e) => /* @__PURE__ */ (0, U.jsx)("th", {
									scope: "col",
									children: e.label
								}, e.key))
							] }) }), /* @__PURE__ */ (0, U.jsx)("tbody", { children: g.map((t) => /* @__PURE__ */ (0, U.jsxs)("tr", {
								"data-selected": t.id === r.id || void 0,
								children: [
									/* @__PURE__ */ (0, U.jsx)("th", {
										scope: "row",
										children: /* @__PURE__ */ (0, U.jsx)("a", {
											href: n("elements", t.id, b({})),
											children: /* @__PURE__ */ (0, U.jsx)("span", {
												className: "mono",
												children: t.id
											})
										})
									}),
									/* @__PURE__ */ (0, U.jsx)("td", { children: t.name }),
									/* @__PURE__ */ (0, U.jsx)("td", { children: pt(e, String(t.elementType)) }),
									/* @__PURE__ */ (0, U.jsx)("td", { children: x(String(t.productId)) }),
									/* @__PURE__ */ (0, U.jsx)("td", { children: /* @__PURE__ */ (0, U.jsx)(W, { state: String(t.state) }) }),
									(d ? gn(f, t.attributes) : []).map((e, t) => /* @__PURE__ */ (0, U.jsx)("td", { children: e }, t))
								]
							}, t.id)) })]
						})
					}) : /* @__PURE__ */ (0, U.jsx)(Qt, {
						title: y ? "No elements match these filters" : u.length ? "No elements yet" : "No element types yet",
						action: y ? /* @__PURE__ */ (0, U.jsx)("button", {
							onClick: () => {
								l(""), i("elements");
							},
							children: "Clear filters"
						}) : void 0,
						children: y ? "Try a different word, type or value." : u.length ? "Elements are design facts, such as signals or connectors, that requirements are satisfied by and tests link to. Add the first with New element." : "An administrator defines element types under Settings › Data model first."
					})
				]
			}),
			v && /* @__PURE__ */ (0, U.jsx)(Ai, {
				element: v,
				onClose: () => i("elements", void 0, b({}))
			}, v.id),
			r.id && !v && /* @__PURE__ */ (0, U.jsx)("aside", {
				className: "detail",
				children: /* @__PURE__ */ (0, U.jsxs)(Qt, {
					title: "Element not found",
					children: [r.id, " does not exist in this workspace."]
				})
			})
		]
	});
}
function Ai({ element: e, onClose: t }) {
	let { ws: n, ix: r, session: i, open: a } = B(), o = n.metamodel.elementTypes.find((t) => t.id === e.elementType), s = r.linksOf("element", e.id);
	return /* @__PURE__ */ (0, U.jsxs)("aside", {
		className: "detail",
		"aria-label": `Element ${e.id}`,
		children: [
			/* @__PURE__ */ (0, U.jsxs)("header", {
				className: "detail-head",
				children: [/* @__PURE__ */ (0, U.jsxs)("div", {
					className: "detail-id",
					children: [
						/* @__PURE__ */ (0, U.jsx)("span", {
							className: "mono",
							children: e.id
						}),
						/* @__PURE__ */ (0, U.jsx)(W, { state: String(e.state) }),
						/* @__PURE__ */ (0, U.jsxs)("span", {
							className: "muted small",
							children: ["Rev ", e.revision]
						})
					]
				}), /* @__PURE__ */ (0, U.jsx)("button", {
					type: "button",
					className: "icon",
					"aria-label": "Close details",
					onClick: t,
					children: "×"
				})]
			}),
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "next-step",
				children: [/* @__PURE__ */ (0, U.jsx)(G, {
					disabledReason: !at(i) && "Viewers can read but not change records. Ask an administrator for editor access.",
					onClick: () => a(/* @__PURE__ */ (0, U.jsx)(ji, { element: e })),
					children: "Edit"
				}), /* @__PURE__ */ (0, U.jsx)("p", {
					className: "muted small next-hint",
					children: o ? `${o.label}${o.discipline ? ` · ${o.discipline}` : ""}` : "This element type is no longer defined; its values are read only."
				})]
			}),
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "detail-body",
				children: [
					/* @__PURE__ */ (0, U.jsx)("p", {
						className: "statement-lg",
						children: e.name
					}),
					e.description && /* @__PURE__ */ (0, U.jsx)("p", {
						className: "prose muted-ink",
						children: e.description
					}),
					/* @__PURE__ */ (0, U.jsxs)("dl", {
						className: "facts",
						children: [
							/* @__PURE__ */ (0, U.jsx)("dt", { children: "Type" }),
							/* @__PURE__ */ (0, U.jsx)("dd", { children: pt(n, String(e.elementType)) }),
							/* @__PURE__ */ (0, U.jsx)("dt", { children: "Product" }),
							/* @__PURE__ */ (0, U.jsx)("dd", { children: n.products.find((t) => t.id === e.productId)?.name ?? e.productId })
						]
					}),
					/* @__PURE__ */ (0, U.jsx)(mn, {
						defs: o?.attributes ?? [],
						values: e.attributes ?? {}
					}),
					/* @__PURE__ */ (0, U.jsxs)("section", {
						className: "connections",
						children: [/* @__PURE__ */ (0, U.jsxs)("div", {
							className: "conn-head",
							children: [/* @__PURE__ */ (0, U.jsxs)("h3", { children: ["Connected ", /* @__PURE__ */ (0, U.jsx)("span", {
								className: "count",
								children: s.length
							})] }), /* @__PURE__ */ (0, U.jsx)(G, {
								className: "link",
								disabledReason: !at(i) && "Viewers can read but not change records. Ask an administrator for editor access.",
								onClick: () => a(/* @__PURE__ */ (0, U.jsx)(On, { from: {
									kind: "element",
									id: e.id,
									title: e.name
								} })),
								children: "+ Connect"
							})]
						}), s.length ? /* @__PURE__ */ (0, U.jsx)("ul", {
							className: "refs",
							children: s.map((t) => {
								let n = t.fromKind === "element" && t.from === e.id;
								return /* @__PURE__ */ (0, U.jsx)(wi, {
									kind: String(n ? t.toKind : t.fromKind),
									id: String(n ? t.to : t.from),
									label: r.relation(t.type, n),
									review: t.needsReview,
									note: t.note
								}, t.id);
							})
						}) : /* @__PURE__ */ (0, U.jsx)("p", {
							className: "muted small",
							children: "Not connected to any requirement, test case or other record yet."
						})]
					})
				]
			})
		]
	});
}
function ji({ element: e }) {
	let { ws: t, scope: n, run: r, close: i, go: a } = B(), o = t.metamodel.elementTypes, s = t.products.filter((e) => mt.includes(e.kind)), c = Ft(t, n), [l, u] = (0, _.useState)(String(e?.elementType ?? o[0]?.id ?? "")), d = o.find((e) => e.id === l)?.attributes ?? [], [f, p] = (0, _.useState)(c && mt.includes(c.kind) ? c.id : s[0]?.id ?? ""), m = _n("element", f), [h, g] = (0, _.useState)(""), [v, y] = (0, _.useState)(String(e?.name ?? "")), [b, x] = (0, _.useState)(String(e?.description ?? "")), [S, C] = (0, _.useState)(String(e?.state ?? "Active")), [w, T] = (0, _.useState)(() => rn(d, e?.attributes ?? {})), [E, D] = (0, _.useState)(e ? "Element revised" : "New element added"), O = on(d, e?.attributes ?? {}, w), k = (e) => {
		u(e), T(rn(o.find((t) => t.id === e)?.attributes ?? []));
	}, A = Object.keys(O.patch).length > 0;
	return /* @__PURE__ */ (0, U.jsxs)(Sn, {
		title: e ? `Edit ${e.id}` : "New element",
		submit: e ? "Save element" : "Create element",
		wide: !0,
		onSubmit: async () => {
			if (Object.keys(O.errors).length) throw Error("Check the attributes marked in red.");
			if (e) {
				let t = {};
				if (v !== e.name && (t.name = v), b !== String(e.description ?? "") && (t.description = b), S !== e.state && (t.state = S), A && (t.attributes = O.patch), !Object.keys(t).length) throw Error("Nothing has changed yet.");
				await r("elements.update", {
					id: e.id,
					expectedRevision: e.revision,
					...t,
					reason: E.trim() || "Element revised"
				}, `${e.id} saved`), i();
				return;
			}
			if (!l) throw Error("Define an element type in Settings › Data model first.");
			let t = await r("elements.create", {
				...h.trim() ? { id: h.trim() } : {},
				elementType: l,
				name: v,
				productId: f,
				description: b,
				...A ? { attributes: O.patch } : {},
				reason: E.trim() || "New element added"
			}, `${v} added`);
			i(), a("elements", String(t.id));
		},
		children: [
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "grid-2",
				children: [/* @__PURE__ */ (0, U.jsx)(K, {
					label: "Element type",
					hint: e ? "The type of an existing element cannot change." : void 0,
					children: /* @__PURE__ */ (0, U.jsx)("select", {
						value: l,
						onChange: (e) => k(e.currentTarget.value),
						disabled: !!e,
						required: !0,
						children: o.map((e) => /* @__PURE__ */ (0, U.jsx)("option", {
							value: e.id,
							children: e.label
						}, e.id))
					})
				}), e ? /* @__PURE__ */ (0, U.jsx)(K, {
					label: "Product",
					children: /* @__PURE__ */ (0, U.jsx)("input", {
						value: t.products.find((t) => t.id === e.productId)?.name ?? String(e.productId),
						readOnly: !0,
						"aria-readonly": "true"
					})
				}) : /* @__PURE__ */ (0, U.jsx)(K, {
					label: "Owned by",
					children: /* @__PURE__ */ (0, U.jsx)("select", {
						value: f,
						onChange: (e) => p(e.currentTarget.value),
						children: s.map((e) => /* @__PURE__ */ (0, U.jsxs)("option", {
							value: e.id,
							children: [
								e.name,
								" (",
								e.id,
								")"
							]
						}, e.id))
					})
				})]
			}),
			!e && /* @__PURE__ */ (0, U.jsx)(K, {
				label: "Element ID",
				hint: m ? `Leave empty and RMS assigns ${m.id}` : "Leave empty and RMS assigns the next number",
				children: /* @__PURE__ */ (0, U.jsx)("input", {
					className: "mono",
					value: h,
					placeholder: m?.id ?? "",
					readOnly: m?.allowOverride === !1,
					onChange: (e) => g(e.currentTarget.value),
					maxLength: 100
				})
			}),
			/* @__PURE__ */ (0, U.jsx)(K, {
				label: "Name",
				children: /* @__PURE__ */ (0, U.jsx)("input", {
					value: v,
					onChange: (e) => y(e.currentTarget.value),
					required: !0,
					maxLength: 200,
					autoFocus: !0
				})
			}),
			/* @__PURE__ */ (0, U.jsx)(K, {
				label: "Description (optional)",
				children: /* @__PURE__ */ (0, U.jsx)("textarea", {
					rows: 2,
					value: b,
					onChange: (e) => x(e.currentTarget.value)
				})
			}),
			e && /* @__PURE__ */ (0, U.jsx)(K, {
				label: "State",
				children: /* @__PURE__ */ (0, U.jsx)("select", {
					value: S,
					onChange: (e) => C(e.currentTarget.value),
					children: Oi.map((e) => /* @__PURE__ */ (0, U.jsx)("option", { children: e }, e))
				})
			}),
			/* @__PURE__ */ (0, U.jsx)(fn, {
				idPrefix: "element-attr",
				defs: d,
				draft: w,
				onChange: T,
				errors: O.errors,
				collapseOptional: !0
			}),
			/* @__PURE__ */ (0, U.jsx)(Cn, {
				value: E,
				onChange: D
			})
		]
	});
}
// client/src/views/Exchange.tsx
var Mi = 33554432, Ni = [
	".reqif",
	".reqifz",
	".xml"
], Pi = "Viewers can read but not send exports. Ask an administrator for editor access.", Fi = "Importing needs an editor role. Viewers can preview a file but not apply it.", Ii = {
	new: "New",
	changed: "Changed",
	unchanged: "Unchanged",
	conflict: "Conflict",
	removed: "Removed",
	skipped: "Skipped",
	invalid: "Invalid"
}, Li = {
	conflict: "warn",
	removed: "warn",
	invalid: "bad"
}, Ri = {
	requirement: "Requirement",
	test_case: "Test case",
	relation: "Link",
	object: "Other item"
}, zi = [
	"new",
	"changed",
	"conflict",
	"removed",
	"skipped",
	"invalid"
], Bi = (e) => e == null || e === "" ? "—" : typeof e == "string" ? e : JSON.stringify(e), Vi = (e, t = 80) => {
	let n = Bi(e);
	return n.length > t ? `${n.slice(0, t - 1).trimEnd()}…` : n;
};
function Hi(e, t) {
	let n = URL.createObjectURL(t), r = document.createElement("a");
	r.href = n, r.download = e, r.style.display = "none", document.body.appendChild(r), r.click(), r.remove(), window.setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
var Ui = (e) => (e / 1048576).toFixed(1);
function Wi() {
	let { scope: e } = B();
	return /* @__PURE__ */ (0, U.jsxs)("div", {
		className: "page exchange",
		children: [
			/* @__PURE__ */ (0, U.jsx)("h1", {
				className: "vh",
				children: "Exchange (ReqIF)"
			}),
			/* @__PURE__ */ (0, U.jsx)(Gi, {}, `export-${e}`),
			/* @__PURE__ */ (0, U.jsx)(Ki, {}, `import-${e}`)
		]
	});
}
function Gi() {
	let { api: e, session: t, scopeRecord: n } = B(), r = (t, n) => e.exchange(t, n), i = qt(), a = at(t), o = n && mt.includes(n.kind) ? n : void 0, [s, c] = (0, _.useState)(o ? "product" : "workspace"), [l, u] = (0, _.useState)(!0), [d, f] = (0, _.useState)("reqifz"), [p, m] = (0, _.useState)(""), [h, g] = (0, _.useState)(!1), [v, y] = (0, _.useState)(""), [b, x] = (0, _.useState)(""), [S, C] = (0, _.useState)(null), w = a ? "" : Pi;
	async function T(e) {
		if (e.preventDefault(), w) {
			i(w);
			return;
		}
		let t = p.trim();
		if (t) {
			g(!0), x(""), C(null), y("Preparing the export…");
			try {
				let e = await Ve(r, {
					format: d,
					includeTestCases: l,
					reason: t,
					...s === "product" && o ? { productId: o.id } : {}
				});
				Hi(e.fileName, new Blob([e.bytes], { type: e.mediaType })), C(e), y(`Exported ${e.fileName}. The download has started.`);
			} catch (e) {
				z(e) || (x(V(e, "The export could not be prepared.")), y(""));
			} finally {
				g(!1);
			}
		}
	}
	return /* @__PURE__ */ (0, U.jsxs)("section", {
		className: "card exchange-section",
		"aria-labelledby": "export-title",
		children: [
			/* @__PURE__ */ (0, U.jsx)("h2", {
				id: "export-title",
				title: "Send requirements to a partner tool. Nothing is approved by an exchange.",
				children: "Send to a partner tool"
			}),
			/* @__PURE__ */ (0, U.jsx)("p", {
				className: "muted small",
				children: "Nothing is approved by an exchange."
			}),
			/* @__PURE__ */ (0, U.jsx)("p", {
				className: "muted small",
				children: "Creates a ReqIF file of the current requirements and test cases for another tool to read. The export is recorded in the history."
			}),
			/* @__PURE__ */ (0, U.jsxs)("form", {
				className: "form",
				onSubmit: T,
				children: [
					/* @__PURE__ */ (0, U.jsxs)("div", {
						className: "exchange-grid",
						children: [/* @__PURE__ */ (0, U.jsx)(K, {
							label: "What to send",
							children: /* @__PURE__ */ (0, U.jsxs)("select", {
								value: s,
								disabled: !!w,
								onChange: (e) => c(e.currentTarget.value),
								children: [o && /* @__PURE__ */ (0, U.jsxs)("option", {
									value: "product",
									children: [o.name, " (current product)"]
								}), /* @__PURE__ */ (0, U.jsx)("option", {
									value: "workspace",
									children: "Whole workspace"
								})]
							})
						}), /* @__PURE__ */ (0, U.jsx)(K, {
							label: "Format",
							children: /* @__PURE__ */ (0, U.jsxs)("select", {
								value: d,
								disabled: !!w,
								onChange: (e) => f(e.currentTarget.value),
								children: [/* @__PURE__ */ (0, U.jsx)("option", {
									value: "reqifz",
									children: ".reqifz (zipped, recommended)"
								}), /* @__PURE__ */ (0, U.jsx)("option", {
									value: "reqif",
									children: ".reqif"
								})]
							})
						})]
					}),
					/* @__PURE__ */ (0, U.jsxs)("label", {
						className: "check",
						children: [/* @__PURE__ */ (0, U.jsx)("input", {
							type: "checkbox",
							checked: l,
							disabled: !!w,
							onChange: (e) => u(e.currentTarget.checked)
						}), " Include test cases and verification status"]
					}),
					/* @__PURE__ */ (0, U.jsx)(K, {
						label: "Who is this for?",
						hint: "Required. Recorded with the export, for example the supplier or partner team.",
						children: /* @__PURE__ */ (0, U.jsx)("input", {
							required: !0,
							value: p,
							disabled: !!w,
							maxLength: 2e3,
							placeholder: "e.g. Supplier engineering team",
							onChange: (e) => m(e.currentTarget.value),
							"aria-describedby": w ? "export-blocked" : void 0
						})
					}),
					w && /* @__PURE__ */ (0, U.jsx)("p", {
						id: "export-blocked",
						className: "muted small",
						children: w
					}),
					b && /* @__PURE__ */ (0, U.jsx)("p", {
						className: "error",
						role: "alert",
						children: b
					}),
					/* @__PURE__ */ (0, U.jsx)("div", {
						className: "actions",
						children: /* @__PURE__ */ (0, U.jsx)("button", {
							type: "submit",
							className: "primary",
							disabled: h,
							"aria-disabled": w ? !0 : void 0,
							children: h ? "Exporting…" : "Export"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, U.jsx)("p", {
				role: "status",
				"aria-live": "polite",
				className: "muted small",
				children: v
			}),
			S && /* @__PURE__ */ (0, U.jsxs)("div", {
				className: "exchange-result",
				children: [
					/* @__PURE__ */ (0, U.jsxs)("p", { children: [
						/* @__PURE__ */ (0, U.jsx)("strong", { children: S.fileName }),
						" ",
						/* @__PURE__ */ (0, U.jsxs)("span", {
							className: "muted small",
							children: ["· ", S.mediaType]
						})
					] }),
					/* @__PURE__ */ (0, U.jsxs)("ul", {
						className: "chips",
						"aria-label": "Exported counts",
						children: [
							/* @__PURE__ */ (0, U.jsxs)("li", {
								className: "pill",
								children: [S.counts.requirements, " requirements"]
							}),
							/* @__PURE__ */ (0, U.jsxs)("li", {
								className: "pill",
								children: [S.counts.testCases, " test cases"]
							}),
							/* @__PURE__ */ (0, U.jsxs)("li", {
								className: "pill",
								children: [S.counts.relations, " links"]
							}),
							/* @__PURE__ */ (0, U.jsxs)("li", {
								className: "pill",
								children: [S.counts.specifications, " specifications"]
							})
						]
					}),
					/* @__PURE__ */ (0, U.jsxs)("p", {
						className: "muted small",
						children: ["Export ID ", /* @__PURE__ */ (0, U.jsx)("span", {
							className: "mono",
							children: S.exportId
						})]
					})
				]
			})
		]
	});
}
function Ki() {
	let { api: e, session: t, ws: n, scopeRecord: r, refresh: i, link: a } = B(), o = (t, n) => e.exchange(t, n), s = at(t), c = n.products.filter((e) => mt.includes(e.kind)), l = r && mt.includes(r.kind) ? r.id : c[0]?.id ?? "", [u, d] = (0, _.useState)(null), [f, p] = (0, _.useState)(l), [m, h] = (0, _.useState)(!1), [g, v] = (0, _.useState)({}), [y, b] = (0, _.useState)(null), [x, S] = (0, _.useState)(!1), [C, w] = (0, _.useState)(""), [T, E] = (0, _.useState)(!1), [D, O] = (0, _.useState)(null), [k, A] = (0, _.useState)(""), [j, M] = (0, _.useState)(""), N = (0, _.useRef)(0), P = (0, _.useRef)(0), F = (e) => ({
		...f ? { productId: f } : {},
		allowMissingCriteria: m,
		resolutions: e
	});
	async function I(e) {
		if (!u) return;
		let t = ++N.current;
		S(!0), M(""), O(null), A("Checking the file against RMS…");
		try {
			let n = await Ge(o, u, F(e));
			if (t !== N.current) return;
			b(n), A(`Preview ready: ${n.changes} ${n.changes === 1 ? "change" : "changes"} to apply.`);
		} catch (e) {
			t === N.current && !z(e) && (b(null), M(V(e, "The file could not be previewed.")), A(""));
		} finally {
			t === N.current && S(!1);
		}
	}
	async function ee(e) {
		let t = e.currentTarget.files?.[0], n = ++P.current;
		if (N.current++, d(null), b(null), O(null), v({}), M(""), A(""), S(!1), t) {
			if (!Ni.find((e) => t.name.toLowerCase().endsWith(e))) M("Choose a .reqif, .reqifz or .xml file."), e.currentTarget.value = "";
			else if (t.size > Mi) M(`${t.name} is ${Ui(t.size)} MB. ReqIF files can be up to 32 MB. Split the file or export a smaller scope.`), e.currentTarget.value = "";
			else {
				A(`Reading ${t.name}…`);
				try {
					let e = await He(new Uint8Array(await t.arrayBuffer()), t.name);
					if (n !== P.current) return;
					d(e), A(`${t.name} is ready. Choose Preview to see what would change.`);
				} catch (e) {
					n === P.current && M(V(e, "The file could not be read. Choose it again."));
				}
			}
		}
	}
	function te(e) {
		e(), N.current++, b(null), O(null), v({}), S(!1), A("");
	}
	function ne(e, t) {
		let n = {
			...g,
			[e]: t
		};
		v(n), y && I(n);
	}
	async function re(e) {
		if (e.preventDefault(), !u || !y || !ae) return;
		let t = C.trim(), n = N.current;
		E(!0), M(""), A("Applying the import…");
		try {
			let e = await Ke(o, u, F(g), {
				expectedWorkspaceRevision: y.workspaceRevision,
				reason: t
			});
			O(e), b(null), v({}), w(""), A(`Imported ${e.changes} ${e.changes === 1 ? "change" : "changes"} (import ID ${e.importId}).`), await i();
		} catch (e) {
			if (z(e)) return;
			M(V(e, "The import could not be applied.")), A(""), e instanceof qe && e.code === "conflict" && n === N.current && b(null);
		} finally {
			E(!1);
		}
	}
	let ie = s ? y ? y.ok ? y.changes === 0 ? "Nothing to apply: RMS already matches this file." : C.trim() ? "" : "Add a reason to apply the import." : "Fix the errors in the list before applying." : "Preview the file before applying it." : Fi, ae = s && !!y?.ok && y.changes > 0 && C.trim().length > 0 && !T && !x, oe = y ? y.items.filter((e) => e.status !== "unchanged") : [], se = y ? [...y.issues].sort((e, t) => Number(t.level === "error") - Number(e.level === "error")) : [];
	return /* @__PURE__ */ (0, U.jsxs)("section", {
		className: "card exchange-section",
		"aria-labelledby": "import-title",
		children: [
			/* @__PURE__ */ (0, U.jsx)("h2", {
				id: "import-title",
				title: "Bring a ReqIF file back for review. Imports only create Drafts; nothing is approved by an exchange.",
				children: "Bring back a ReqIF file"
			}),
			/* @__PURE__ */ (0, U.jsx)("p", {
				className: "muted small",
				children: "Imports create Drafts only."
			}),
			/* @__PURE__ */ (0, U.jsx)("p", {
				className: "muted small",
				children: "Compare a file from a partner tool with RMS. Preview writes nothing; applying creates or updates records in one step."
			}),
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "exchange-grid",
				children: [/* @__PURE__ */ (0, U.jsx)(K, {
					label: "ReqIF file",
					hint: "Accepts .reqif, .reqifz or .xml, up to 32 MB.",
					children: /* @__PURE__ */ (0, U.jsx)("input", {
						type: "file",
						accept: Ni.join(","),
						onChange: (e) => void ee(e)
					})
				}), /* @__PURE__ */ (0, U.jsx)(K, {
					label: "Product for new requirements",
					children: /* @__PURE__ */ (0, U.jsx)("select", {
						value: f,
						onChange: (e) => te(() => p(e.currentTarget.value)),
						disabled: !c.length,
						children: c.map((e) => /* @__PURE__ */ (0, U.jsx)("option", {
							value: e.id,
							children: e.name
						}, e.id))
					})
				})]
			}),
			/* @__PURE__ */ (0, U.jsxs)("label", {
				className: "check",
				children: [/* @__PURE__ */ (0, U.jsx)("input", {
					type: "checkbox",
					checked: m,
					onChange: (e) => te(() => h(e.currentTarget.checked))
				}), " Allow requirements without acceptance criteria (marked for definition before approval)"]
			}),
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "actions",
				children: [/* @__PURE__ */ (0, U.jsx)("button", {
					type: "button",
					disabled: !u || x || T,
					onClick: () => void I(g),
					children: x ? "Checking…" : "Preview"
				}), !u && /* @__PURE__ */ (0, U.jsx)("span", {
					className: "muted small",
					children: "Choose a file to preview it."
				})]
			}),
			j && /* @__PURE__ */ (0, U.jsx)("p", {
				className: "error",
				role: "alert",
				children: j
			}),
			/* @__PURE__ */ (0, U.jsx)("p", {
				role: "status",
				"aria-live": "polite",
				className: "muted small",
				children: k
			}),
			y && /* @__PURE__ */ (0, U.jsxs)("div", {
				className: "import-preview",
				children: [
					/* @__PURE__ */ (0, U.jsxs)("p", {
						className: "muted small",
						children: [
							y.file.name,
							y.file.title && ` · ${y.file.title}`,
							y.file.sourceTool && ` · from ${y.file.sourceTool}`
						]
					}),
					/* @__PURE__ */ (0, U.jsxs)("ul", {
						className: "chips",
						"aria-label": "Summary by status",
						children: [zi.map((e) => /* @__PURE__ */ (0, U.jsx)("li", { children: /* @__PURE__ */ (0, U.jsxs)("span", {
							className: "pill",
							"data-tone": Li[e],
							children: [
								y.counts[e] ?? 0,
								" ",
								Ii[e].toLowerCase()
							]
						}) }, e)), /* @__PURE__ */ (0, U.jsx)("li", { children: /* @__PURE__ */ (0, U.jsxs)("span", {
							className: "pill",
							children: [y.counts.unchanged ?? 0, " unchanged"]
						}) })]
					}),
					se.length > 0 && /* @__PURE__ */ (0, U.jsx)("ul", {
						className: "issue-list",
						"aria-label": "Issues",
						children: se.map((e, t) => /* @__PURE__ */ (0, U.jsxs)("li", {
							className: "issue",
							"data-level": e.level,
							children: [
								/* @__PURE__ */ (0, U.jsx)("strong", { children: e.level === "error" ? "Error" : "Warning" }),
								e.identifier && /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [" ", /* @__PURE__ */ (0, U.jsx)("span", {
									className: "mono",
									children: e.identifier
								})] }),
								" ",
								e.message
							]
						}, `${e.code}-${t}`))
					}),
					y.unmappedAttributes.length > 0 && /* @__PURE__ */ (0, U.jsxs)("p", {
						className: "muted small",
						children: ["Not mapped to RMS fields, so left out: ", y.unmappedAttributes.join(", ")]
					}),
					oe.length > 0 ? /* @__PURE__ */ (0, U.jsx)("div", {
						className: "table-wrap",
						children: /* @__PURE__ */ (0, U.jsxs)("table", {
							className: "matrix",
							"aria-label": "Import preview",
							children: [/* @__PURE__ */ (0, U.jsx)("thead", { children: /* @__PURE__ */ (0, U.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, U.jsx)("th", {
									scope: "col",
									children: "Status"
								}),
								/* @__PURE__ */ (0, U.jsx)("th", {
									scope: "col",
									children: "Kind"
								}),
								/* @__PURE__ */ (0, U.jsx)("th", {
									scope: "col",
									children: "RMS ID or identifier"
								}),
								/* @__PURE__ */ (0, U.jsx)("th", {
									scope: "col",
									children: "Title"
								}),
								/* @__PURE__ */ (0, U.jsx)("th", {
									scope: "col",
									children: "Details"
								})
							] }) }), /* @__PURE__ */ (0, U.jsx)("tbody", { children: oe.map((e, t) => {
								let n = `${e.kind}:${e.identifier}:${t}`, r = e.id;
								return /* @__PURE__ */ (0, U.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, U.jsx)("td", { children: /* @__PURE__ */ (0, U.jsx)("span", {
										className: "pill",
										"data-tone": Li[e.status],
										children: Ii[e.status] ?? e.status
									}) }),
									/* @__PURE__ */ (0, U.jsx)("td", { children: Ri[e.kind] ?? e.kind }),
									/* @__PURE__ */ (0, U.jsx)("td", {
										className: "mono",
										children: e.id ?? e.identifier
									}),
									/* @__PURE__ */ (0, U.jsx)("td", { children: /* @__PURE__ */ (0, U.jsx)("span", {
										className: "clamp",
										title: e.title,
										children: e.title || "—"
									}) }),
									/* @__PURE__ */ (0, U.jsxs)("td", {
										className: "import-details",
										children: [
											e.message && /* @__PURE__ */ (0, U.jsx)("p", { children: e.message }),
											e.fields && e.fields.length > 0 && /* @__PURE__ */ (0, U.jsx)("ul", {
												className: "field-changes",
												children: e.fields.map((e) => /* @__PURE__ */ (0, U.jsxs)("li", { children: [
													/* @__PURE__ */ (0, U.jsx)("span", {
														className: "mono",
														children: e.field
													}),
													": ",
													/* @__PURE__ */ (0, U.jsx)("span", {
														title: Bi(e.rms),
														children: Vi(e.rms)
													}),
													" → ",
													/* @__PURE__ */ (0, U.jsx)("span", {
														title: Bi(e.file),
														children: Vi(e.file)
													})
												] }, e.field))
											}),
											e.conflicts && e.conflicts.length > 0 && /* @__PURE__ */ (0, U.jsx)("ul", {
												className: "field-changes",
												children: e.conflicts.map((e) => /* @__PURE__ */ (0, U.jsxs)("li", { children: [
													/* @__PURE__ */ (0, U.jsx)("span", {
														className: "mono",
														children: e.field
													}),
													": RMS ",
													/* @__PURE__ */ (0, U.jsx)("span", {
														title: Bi(e.rms),
														children: Vi(e.rms)
													}),
													" · file ",
													/* @__PURE__ */ (0, U.jsx)("span", {
														title: Bi(e.file),
														children: Vi(e.file)
													})
												] }, e.field))
											}),
											e.status === "conflict" && r && /* @__PURE__ */ (0, U.jsxs)("fieldset", {
												className: "resolve",
												children: [
													/* @__PURE__ */ (0, U.jsx)("legend", { children: "Which version to keep?" }),
													/* @__PURE__ */ (0, U.jsxs)("label", {
														className: "check",
														children: [/* @__PURE__ */ (0, U.jsx)("input", {
															type: "radio",
															name: `resolve-${r}`,
															checked: g[r] === "rms",
															onChange: () => ne(r, "rms")
														}), " Keep RMS"]
													}),
													/* @__PURE__ */ (0, U.jsxs)("label", {
														className: "check",
														children: [/* @__PURE__ */ (0, U.jsx)("input", {
															type: "radio",
															name: `resolve-${r}`,
															checked: g[r] === "file",
															onChange: () => ne(r, "file")
														}), " Take file"]
													})
												]
											})
										]
									})
								] }, n);
							}) })]
						})
					}) : /* @__PURE__ */ (0, U.jsx)("p", {
						className: "ok",
						children: "Nothing to change in RMS for this file."
					}),
					/* @__PURE__ */ (0, U.jsxs)("form", {
						className: "form import-apply",
						onSubmit: re,
						children: [
							/* @__PURE__ */ (0, U.jsx)(K, {
								label: "Reason for the import",
								hint: "Recorded in the history with your name.",
								children: /* @__PURE__ */ (0, U.jsx)("input", {
									required: !0,
									value: C,
									disabled: !s,
									maxLength: 2e3,
									placeholder: "e.g. Partner review round 2",
									onChange: (e) => w(e.currentTarget.value),
									"aria-describedby": "apply-reason"
								})
							}),
							ie && /* @__PURE__ */ (0, U.jsx)("p", {
								id: "apply-reason",
								className: "muted small",
								children: ie
							}),
							/* @__PURE__ */ (0, U.jsx)("div", {
								className: "actions",
								children: /* @__PURE__ */ (0, U.jsx)("button", {
									type: "submit",
									className: "primary",
									disabled: !ae,
									children: T ? "Applying…" : "Apply import"
								})
							}),
							/* @__PURE__ */ (0, U.jsx)("p", {
								className: "muted small",
								children: "New requirements are created as Draft. Edited requirements become their next Draft revision. Nothing is approved by an import."
							})
						]
					})
				]
			}),
			D && D.created.length > 0 && /* @__PURE__ */ (0, U.jsxs)("div", {
				className: "exchange-result",
				children: [/* @__PURE__ */ (0, U.jsx)("h3", { children: "Created" }), /* @__PURE__ */ (0, U.jsx)("ul", {
					className: "refs compact",
					children: D.created.map((e) => /* @__PURE__ */ (0, U.jsx)("li", { children: /* @__PURE__ */ (0, U.jsx)("a", {
						className: "mono",
						href: a("requirements", e.id),
						children: e.id
					}) }, e.ref + e.id))
				})]
			})
		]
	});
}
// client/src/views/Flow.tsx
var qi = [
	{
		id: "actor",
		label: "Actors"
	},
	{
		id: "use_case",
		label: "Use cases"
	},
	{
		id: "product",
		label: "Product"
	},
	{
		id: "parent",
		label: "Parent requirement"
	},
	{
		id: "lifecycle",
		label: "Lifecycle"
	},
	{
		id: "status",
		label: "Verification status"
	}
], Ji = [
	"actor",
	"use_case",
	"product",
	"status"
], Yi = Ji.join(","), Xi = (e) => qi.find((t) => t.id === e)?.label ?? e;
function Zi(e) {
	let t = (e ?? "").split(",").map((e) => e.trim()).filter((e) => qi.some((t) => t.id === e)), n = [...new Set(t)];
	return n.length >= 2 && n.length <= 6 && n.length === t.length ? n : Ji;
}
var q = (e, t = 34) => e.length > t ? `${e.slice(0, t - 1).trimEnd()}…` : e, Qi = (e) => `${e} requirement${e === 1 ? "" : "s"}`, $i = (e) => e.id.endsWith(":unlinked"), ea = (e) => e === "Verified" ? "good" : e === "Failed" ? "bad" : "neutral", ta = 560, na = 1200, ra = 44, ia = 12, aa = 440, oa = 14, sa = 10, ca = 6, la = 250, ua = 12;
function da(e, t) {
	let n = e.stages.length, r = new Map(e.nodes.map((e, t) => [e.id, t])), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
	for (let t of e.links) a.set(t.source, (a.get(t.source) ?? 0) + t.value), i.set(t.target, (i.get(t.target) ?? 0) + t.value);
	let o = (e) => Math.max(e.value, i.get(e.id) ?? 0, a.get(e.id) ?? 0), s = Infinity;
	for (let t = 0; t < n; t++) {
		let n = e.nodes.filter((e) => e.stage === t), r = n.reduce((e, t) => e + o(t), 0);
		r > 0 && (s = Math.min(s, (aa - sa * Math.max(0, n.length - 1)) / r));
	}
	(!Number.isFinite(s) || s < 0) && (s = 0);
	let c = Math.min(la, Math.round(t * .24)), l = n > 1 ? (t - c - 24 - oa) / (n - 1) : 0, u = /* @__PURE__ */ new Map(), d = 484;
	for (let t = 0; t < n; t++) {
		let n = ra;
		for (let r of e.nodes.filter((e) => e.stage === t)) {
			let e = Math.max(ca, o(r) * s);
			u.set(r.id, {
				node: r,
				x: ua + t * l,
				y: n,
				h: e
			}), n += e + sa;
		}
		d = Math.max(d, n - sa);
	}
	let f = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map();
	for (let t of r.keys()) {
		let n = u.get(t);
		if (!n) continue;
		let i = n.y;
		e.links.map((e, t) => ({
			l: e,
			i: t
		})).filter(({ l: e }) => e.source === t && u.has(e.target) && e.value > 0).sort((e, t) => (r.get(e.l.target) ?? 0) - (r.get(t.l.target) ?? 0)).forEach(({ l: e, i: t }) => {
			f.set(t, i), i += e.value * s;
		}), i = n.y, e.links.map((e, t) => ({
			l: e,
			i: t
		})).filter(({ l: e }) => e.target === t && u.has(e.source) && e.value > 0).sort((e, t) => (r.get(e.l.source) ?? 0) - (r.get(t.l.source) ?? 0)).forEach(({ l: e, i: t }) => {
			p.set(t, i), i += e.value * s;
		});
	}
	let m = n - 1, h = [];
	return e.links.forEach((t, n) => {
		let r = u.get(t.source), i = u.get(t.target), a = f.get(n), o = p.get(n);
		if (!r || !i || a === void 0 || o === void 0 || t.value <= 0) return;
		let c = r.x + oa, l = i.x, d = t.value * s, g = (c + l) / 2, _ = `M${c},${a} C${g},${a} ${g},${o} ${l},${o} L${l},${o + d} C${g},${o + d} ${g},${a + d} ${c},${a + d} Z`, v = i.node.stage === m && e.stages[m]?.id === "status" ? ea(i.node.status) : "neutral";
		h.push({
			index: n,
			link: t,
			d: _,
			tone: v,
			x1: c,
			y1: a,
			x2: l,
			y2: o,
			w: d
		});
	}), {
		placed: [...u.values()],
		bands: h,
		height: d + ia,
		step: l,
		count: n
	};
}
function fa(e, t) {
	if (!t) return null;
	let n = t.kind === "link" ? [e.links[t.index]].filter(Boolean) : e.links.filter((e) => e.source === t.id || e.target === t.id), r = /* @__PURE__ */ new Set();
	for (let e of n) for (let t of e.requirementIds) r.add(t);
	return {
		ids: r,
		list: [...r].sort(),
		truncated: n.some((e) => e.truncated)
	};
}
function pa() {
	let { api: e, ws: t, ix: n, scopeRecord: r, route: i, go: a, link: o, session: s } = B(), c = Zi(i.params.get("stages")), l = i.params.get("baseline") ?? "", u = r?.id ? String(r.id) : void 0, d = c.join(","), [f, p] = (0, _.useState)(null), [m, h] = (0, _.useState)(!0), [g, v] = (0, _.useState)(""), [y, b] = (0, _.useState)(null), [x, S] = (0, _.useState)(!1), C = !!s.limits?.flowRequiresProduct && !u;
	(0, _.useEffect)(() => {
		let t = !0;
		if (C) p(null), v(""), h(!1), b(null);
		else return h(!0), v(""), b(null), e.command("flow.get", {
			...u ? { productId: u } : {},
			stages: d.split(","),
			...l ? { baselineId: l } : {}
		}).then((e) => {
			t && p(e);
		}).catch((e) => {
			t && !z(e) && (p(null), v(V(e, "The flow could not be loaded.")));
		}).finally(() => {
			t && h(!1);
		}), () => {
			t = !1;
		};
	}, [
		e,
		u,
		d,
		l,
		C
	]);
	let w = (e, t = l) => a("flow", void 0, {
		stages: e.join(",") === Yi ? void 0 : e.join(","),
		baseline: t || void 0
	}, !0), T = (e) => {
		let t = f?.nodes.find((t) => t.id === e);
		return t ? `${Xi(f?.stages[t.stage]?.id ?? "")}: ${t.label}` : e;
	}, E = (0, _.useMemo)(() => f && y ? fa(f, y) : null, [f, y]), D = !f || !y ? "" : y.kind === "node" ? T(y.id) : (() => {
		let e = f.links[y.index];
		return e ? `${T(e.source)} → ${T(e.target)}` : "";
	})();
	return /* @__PURE__ */ (0, U.jsxs)("div", {
		className: `page specification${y ? " with-detail" : ""}`,
		children: [/* @__PURE__ */ (0, U.jsxs)("div", {
			className: "spec-main",
			children: [
				/* @__PURE__ */ (0, U.jsx)("h1", {
					className: "vh",
					children: "Flow"
				}),
				/* @__PURE__ */ (0, U.jsxs)("div", {
					className: "toolbar flow-toolbar",
					children: [
						/* @__PURE__ */ (0, U.jsxs)("ol", {
							className: "flow-stages",
							"aria-label": "Stages, left to right",
							title: "How requirements flow from one stage to the next, and where the gaps are. Band width is the number of requirements; a requirement on several paths counts on each.",
							children: [c.map((e, t) => /* @__PURE__ */ (0, U.jsxs)("li", { children: [/* @__PURE__ */ (0, U.jsx)("select", {
								"aria-label": `Stage ${t + 1}`,
								value: e,
								onChange: (e) => w(c.map((n, r) => r === t ? e.currentTarget.value : n)),
								children: qi.filter((t) => t.id === e || !c.includes(t.id)).map((e) => /* @__PURE__ */ (0, U.jsx)("option", {
									value: e.id,
									children: e.label
								}, e.id))
							}), /* @__PURE__ */ (0, U.jsxs)(G, {
								disabledReason: c.length <= 2 && "A flow needs at least two stages.",
								className: "quiet small",
								onClick: () => w(c.filter((e, n) => n !== t)),
								children: [/* @__PURE__ */ (0, U.jsx)("span", {
									"aria-hidden": "true",
									children: "×"
								}), /* @__PURE__ */ (0, U.jsxs)("span", {
									className: "visually-hidden",
									children: [" Remove stage ", t + 1]
								})]
							})] }, `${t}-${e}`)), c.length < 6 && /* @__PURE__ */ (0, U.jsx)("li", { children: /* @__PURE__ */ (0, U.jsx)("button", {
								type: "button",
								className: "small",
								onClick: () => {
									let e = qi.find((e) => !c.includes(e.id));
									e && w([...c, e.id]);
								},
								children: "+ Add stage"
							}) })]
						}),
						/* @__PURE__ */ (0, U.jsxs)("select", {
							"aria-label": "Baseline",
							value: l,
							onChange: (e) => w(c, e.currentTarget.value),
							children: [/* @__PURE__ */ (0, U.jsx)("option", {
								value: "",
								children: "Current"
							}), t.baselines.map((e) => /* @__PURE__ */ (0, U.jsx)("option", {
								value: e.id,
								children: e.name
							}, e.id))]
						}),
						/* @__PURE__ */ (0, U.jsx)("button", {
							type: "button",
							"aria-pressed": x,
							className: "small",
							onClick: () => S((e) => !e),
							children: "Show as table"
						})
					]
				}),
				C ? /* @__PURE__ */ (0, U.jsx)(Qt, {
					title: "Choose a product to see its flow",
					children: "The flow of a whole workspace is too large to draw here. Pick a product or release in the product selector and the flow of that product opens."
				}) : m && !f ? /* @__PURE__ */ (0, U.jsx)("p", {
					className: "loading",
					role: "status",
					children: "Loading flow…"
				}) : g ? /* @__PURE__ */ (0, U.jsx)("p", {
					className: "error",
					role: "alert",
					children: g
				}) : !f || !f.requirements ? /* @__PURE__ */ (0, U.jsx)(Qt, {
					title: "No requirements to show",
					children: "Add requirements to this product, or choose another scope or baseline."
				}) : x ? /* @__PURE__ */ (0, U.jsx)(ga, {
					model: f,
					nodeName: T
				}) : /* @__PURE__ */ (0, U.jsx)(ha, {
					model: f,
					selection: y,
					onSelect: (e) => b((t) => ma(t, e) ? null : e),
					selected: E
				})
			]
		}), y && E && /* @__PURE__ */ (0, U.jsxs)("aside", {
			className: "detail",
			"aria-label": `Flow selection: ${D}`,
			children: [/* @__PURE__ */ (0, U.jsxs)("header", {
				className: "detail-head",
				children: [/* @__PURE__ */ (0, U.jsx)("div", {
					className: "detail-id",
					children: /* @__PURE__ */ (0, U.jsx)("strong", { children: D })
				}), /* @__PURE__ */ (0, U.jsx)("button", {
					type: "button",
					className: "icon",
					"aria-label": "Close details",
					onClick: () => b(null),
					children: "×"
				})]
			}), /* @__PURE__ */ (0, U.jsxs)("div", {
				className: "detail-body",
				children: [
					/* @__PURE__ */ (0, U.jsxs)("p", { children: [Qi(E.ids.size), " on the highlighted paths."] }),
					y.kind === "node" && /* @__PURE__ */ (0, U.jsx)("p", {
						className: "muted small",
						children: "Lists the requirements that reach the stages next to this node."
					}),
					E.truncated && /* @__PURE__ */ (0, U.jsx)("p", {
						className: "muted small",
						children: "The server lists at most 500 IDs per path, so some requirements may be missing from this list."
					}),
					/* @__PURE__ */ (0, U.jsx)("ul", {
						className: "flow-ids",
						children: E.list.map((e) => /* @__PURE__ */ (0, U.jsxs)("li", { children: [
							/* @__PURE__ */ (0, U.jsx)("a", {
								className: "mono",
								href: o("requirements", e),
								children: e
							}),
							" ",
							/* @__PURE__ */ (0, U.jsx)("span", {
								className: "muted small",
								children: n.title("requirement", e)
							})
						] }, e))
					})
				]
			})]
		})]
	});
}
function ma(e, t) {
	return !e || !t ? !1 : e.kind === t.kind && (e.kind === "node" ? e.id === t.id : e.index === t.index);
}
function ha({ model: e, selection: t, onSelect: n, selected: r }) {
	let i = (0, _.useRef)(null), [a, o] = (0, _.useState)(900);
	(0, _.useEffect)(() => {
		let e = i.current;
		if (!e) return;
		let t = () => o(Math.max(ta, Math.min(na, Math.floor(e.clientWidth - 16))));
		t();
		let n = new ResizeObserver(t);
		return n.observe(e), () => n.disconnect();
	}, []);
	let s = (0, _.useMemo)(() => da(e, a), [e, a]), c = e.stages[e.stages.length - 1]?.id, l = (e) => (t) => {
		(t.key === "Enter" || t.key === " ") && (t.preventDefault(), e());
	}, u = (e) => !!r && e.link.requirementIds.some((e) => r.ids.has(e));
	return /* @__PURE__ */ (0, U.jsxs)("div", {
		className: "flow-chart",
		ref: i,
		children: [
			/* @__PURE__ */ (0, U.jsxs)("svg", {
				viewBox: `0 0 ${a} ${s.height}`,
				width: a,
				height: s.height,
				role: "group",
				"aria-label": "Requirement flow diagram. Use Tab to reach nodes and bands, Enter to select, or Show as table for a text version.",
				onClick: (e) => {
					e.target === e.currentTarget && n(null);
				},
				children: [
					/* @__PURE__ */ (0, U.jsx)("defs", { children: /* @__PURE__ */ (0, U.jsxs)("pattern", {
						id: "flow-hatch",
						width: "6",
						height: "6",
						patternUnits: "userSpaceOnUse",
						patternTransform: "rotate(45)",
						children: [/* @__PURE__ */ (0, U.jsx)("rect", {
							className: "flow-hatch-base",
							width: "6",
							height: "6"
						}), /* @__PURE__ */ (0, U.jsx)("line", {
							className: "flow-hatch-line",
							x1: "0",
							y1: "0",
							x2: "0",
							y2: "6"
						})]
					}) }),
					e.stages.map((e, t) => /* @__PURE__ */ (0, U.jsx)("text", {
						className: "flow-head",
						x: ua + t * s.step,
						y: 26,
						children: e.label
					}, e.id)),
					s.bands.map((i) => {
						let a = t?.kind === "link" && t.index === i.index, o = !!r && !u(i), s = e.nodes.find((e) => e.id === i.link.source), c = e.nodes.find((e) => e.id === i.link.target), d = `${s?.label ?? i.link.source} to ${c?.label ?? i.link.target}: ${Qi(i.link.value)}`;
						return /* @__PURE__ */ (0, U.jsx)("path", {
							className: "flow-band",
							d: i.d,
							"data-tone": i.tone,
							"data-selected": a || void 0,
							"data-dim": o || void 0,
							role: "button",
							tabIndex: 0,
							"aria-pressed": a,
							"aria-label": d,
							onClick: () => n({
								kind: "link",
								index: i.index
							}),
							onKeyDown: l(() => n({
								kind: "link",
								index: i.index
							})),
							children: /* @__PURE__ */ (0, U.jsx)("title", { children: d })
						}, `band-${i.index}`);
					}),
					s.placed.map(({ node: r, x: i, y: a, h: o }) => {
						let u = t?.kind === "node" && t.id === r.id, d = $i(r), f = c === "status" && r.stage === e.stages.length - 1 ? ea(r.status) : "neutral", p = `${Xi(e.stages[r.stage]?.id ?? "")}: ${r.label}`;
						return /* @__PURE__ */ (0, U.jsxs)("g", {
							className: "flow-node",
							role: "button",
							tabIndex: 0,
							"aria-pressed": u,
							"data-tone": f,
							"data-unlinked": d || void 0,
							"aria-label": `${p}, ${Qi(r.value)}${d ? ", not linked to this stage" : ""}`,
							onClick: () => n({
								kind: "node",
								id: r.id
							}),
							onKeyDown: l(() => n({
								kind: "node",
								id: r.id
							})),
							children: [/* @__PURE__ */ (0, U.jsx)("rect", {
								x: i,
								y: a,
								width: oa,
								height: o,
								rx: 2
							}), /* @__PURE__ */ (0, U.jsx)("text", {
								x: i + oa + 6,
								y: a + o / 2,
								dominantBaseline: "middle",
								children: `${q(r.label, Math.max(8, Math.min(32, Math.floor((s.step - 48) / 7))))} · ${r.value}`
							})]
						}, r.id);
					})
				]
			}),
			/* @__PURE__ */ (0, U.jsx)("p", {
				className: "muted small flow-legend",
				children: "Band width: number of requirements."
			}),
			/* @__PURE__ */ (0, U.jsx)("p", {
				className: "muted small flow-legend",
				children: "Verified bands are green, Failed bands red. Hatched nodes are requirements with no link to that stage."
			})
		]
	});
}
function ga({ model: e, nodeName: t }) {
	let { link: n } = B();
	return /* @__PURE__ */ (0, U.jsx)("div", {
		className: "table-wrap",
		children: /* @__PURE__ */ (0, U.jsxs)("table", {
			className: "matrix",
			"aria-label": "Flow links",
			children: [/* @__PURE__ */ (0, U.jsx)("thead", { children: /* @__PURE__ */ (0, U.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, U.jsx)("th", {
					scope: "col",
					children: "From"
				}),
				/* @__PURE__ */ (0, U.jsx)("th", {
					scope: "col",
					children: "To"
				}),
				/* @__PURE__ */ (0, U.jsx)("th", {
					scope: "col",
					children: "Requirements"
				}),
				/* @__PURE__ */ (0, U.jsx)("th", {
					scope: "col",
					children: "Requirement IDs"
				})
			] }) }), /* @__PURE__ */ (0, U.jsx)("tbody", { children: e.links.map((e) => /* @__PURE__ */ (0, U.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, U.jsx)("td", { children: t(e.source) }),
				/* @__PURE__ */ (0, U.jsx)("td", { children: t(e.target) }),
				/* @__PURE__ */ (0, U.jsxs)("td", { children: [e.value, e.truncated && /* @__PURE__ */ (0, U.jsx)("span", {
					className: "muted small",
					children: " (list truncated)"
				})] }),
				/* @__PURE__ */ (0, U.jsx)("td", { children: e.requirementIds.map((e, t) => /* @__PURE__ */ (0, U.jsxs)("span", { children: [t > 0 && ", ", /* @__PURE__ */ (0, U.jsx)("a", {
					className: "mono",
					href: n("requirements", e),
					children: e
				})] }, e)) })
			] }, `${e.source}>${e.target}`)) })]
		})
	});
}
// client/src/views/Home.tsx
var _a = {
	Verified: "Verified",
	Failed: "Failed",
	"Not Verified": "Not verified"
}, va = [
	"L1",
	"L2",
	"L3",
	"L4",
	"L5",
	"L6"
], ya = {
	L1: "Model / simulation",
	L2: "Component / unit",
	L3: "Integration / prototype",
	L4: "System / representative",
	L5: "Operational / acceptance",
	L6: "Release / production"
}, ba = [
	{
		key: "PASS",
		label: "Pass",
		glyph: "✓"
	},
	{
		key: "FAIL",
		label: "Fail",
		glyph: "✕"
	},
	{
		key: "BLOCKED",
		label: "Blocked",
		glyph: "!"
	},
	{
		key: "NOT VERIFIED",
		label: "Not verified",
		glyph: "–"
	},
	{
		key: "Planned",
		label: "Planned",
		glyph: "…"
	},
	{
		key: "none",
		label: "No run yet",
		glyph: "○"
	}
], xa = (e, t) => t ? Math.round(e / t * 1e3) / 10 : 0;
function Sa() {
	let { ws: e, ix: t, scope: n, ensureBaselineMembers: r } = B(), i = e.baselines.filter((t) => !t.productId || It(e, n, {
		productId: t.productId,
		appliesTo: []
	})).at(-1), a = i?.id, o = !!i && !i.requirements;
	return (0, _.useEffect)(() => {
		a && o && r([a]).catch(() => void 0);
	}, [
		a,
		o,
		r
	]), (0, _.useMemo)(() => {
		let r = e.requirements.filter((t) => It(e, n, t)), i = r.filter((e) => e.state === "Approved"), a = r.flatMap((e) => t.casesOf(e.id)), o = new Set(a.map((e) => e.id)), s = e.executions.filter((e) => o.has(e.testCaseId)), c = (e) => t.latestRun(e.id)?.result ?? "none", l = Object.fromEntries(ba.map((e) => [e.key, a.filter((t) => c(t) === e.key)])), u = [
			{
				key: "untested",
				label: "Approved without a mandatory test",
				hint: "Approved requirements with no mandatory test case written for them.",
				records: i.filter((e) => !t.casesOf(e.id).some((e) => e.mandatory)),
				tone: "warn"
			},
			{
				key: "stale",
				label: "Test written for an earlier revision",
				hint: "The requirement changed after its test case was written.",
				records: r.filter((e) => t.casesOf(e.id).some((e) => t.isStale(e))),
				tone: "bad"
			},
			{
				key: "failing",
				label: "Failing or blocked latest run",
				hint: "The most recent run of a linked test case failed or was blocked.",
				records: r.filter((e) => t.casesOf(e.id).some((e) => ["FAIL", "BLOCKED"].includes(c(e)))),
				tone: "bad"
			},
			{
				key: "links",
				label: "Link to a changed record",
				hint: "One side of a trace link changed revision after the link was made.",
				records: r.filter((e) => t.linksOf("requirement", e.id).some((e) => e.needsReview)),
				tone: "warn"
			},
			{
				key: "orphans",
				label: "Not connected to anything",
				hint: "No parent, child, test case or link.",
				records: r.filter((e) => !(e.parents ?? []).length && !t.childrenOf(e.id).length && !t.casesOf(e.id).length && !t.linksOf("requirement", e.id).length),
				tone: "neutral"
			}
		], d = new Set(u.flatMap((e) => e.records.map((e) => e.id))), f = e.baselines.filter((t) => !t.productId || It(e, n, {
			productId: t.productId,
			appliesTo: []
		})), p = f[f.length - 1]?.requirements ? f[f.length - 1] : void 0, m = p ? p.requirements.filter((e) => {
			let n = t.reqById.get(e.id);
			return !n || ht(n) !== Number(e.rev ?? e.revision ?? 1);
		}) : [], h = {
			Verified: [],
			Failed: [],
			"Not Verified": []
		};
		for (let e of r) h[t.verificationOf(e.id)?.status ?? "Not Verified"]?.push(e);
		return {
			scoped: r,
			approved: i,
			cases: a,
			runs: s,
			byResult: l,
			gaps: u,
			affected: d,
			baseline: p,
			drift: m,
			verifyGroups: h
		};
	}, [
		e,
		t,
		n
	]);
}
function Ca() {
	let { ws: e, ix: t, scope: n, session: r, open: i, link: a, go: o } = B(), s = Ft(e, n), { scoped: c, cases: l, byResult: u, gaps: d, affected: f, verifyGroups: p } = Sa(), [m, h, g] = ka(), _ = c.filter((e) => e.state === "In Review"), v = c.filter((e) => e.state === "Draft"), y = ot(r), b = y ? _ : v, x = e.products.filter((e) => e.kind === "release" && (e.productId === s?.id || e.id === n)), S = /* @__PURE__ */ new Set([
		...b.map((e) => e.id),
		...f,
		...c.filter((e) => e.state === "Rejected").map((e) => e.id)
	]);
	return /* @__PURE__ */ (0, U.jsxs)("div", {
		className: "page home",
		children: [/* @__PURE__ */ (0, U.jsxs)("h1", {
			className: "vh",
			children: [s?.name ?? "Workspace", " overview"]
		}), c.length ? /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [
			/* @__PURE__ */ (0, U.jsxs)("section", {
				className: "statbar",
				"aria-label": "Summary",
				children: [
					/* @__PURE__ */ (0, U.jsxs)("div", {
						className: "stat",
						children: [/* @__PURE__ */ (0, U.jsx)("strong", {
							"data-tone": S.size ? "warn" : "good",
							children: S.size
						}), /* @__PURE__ */ (0, U.jsx)("span", { children: S.size === 1 ? "needs action" : "need action" })]
					}),
					/* @__PURE__ */ (0, U.jsx)(Ta, {
						pressed: m === "Verified",
						onClick: () => h("Verified"),
						value: /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [p.Verified.length, /* @__PURE__ */ (0, U.jsxs)("small", { children: [" / ", c.length] })] }),
						label: "verified",
						tone: "good"
					}),
					/* @__PURE__ */ (0, U.jsx)(Ta, {
						pressed: m === "Failed",
						onClick: () => h("Failed"),
						value: p.Failed.length,
						label: "failed",
						tone: p.Failed.length ? "bad" : void 0
					}),
					/* @__PURE__ */ (0, U.jsx)(Ta, {
						pressed: m === "Not Verified",
						onClick: () => h("Not Verified"),
						value: p["Not Verified"].length,
						label: "not verified",
						tone: p["Not Verified"].length ? "warn" : void 0
					}),
					/* @__PURE__ */ (0, U.jsx)(wa, {
						href: a("requirements", void 0, { state: "In Review" }),
						value: _.length,
						label: "awaiting approval",
						tone: _.length ? "warn" : void 0
					}),
					/* @__PURE__ */ (0, U.jsx)(wa, {
						href: a("trace", void 0, { gap: f.size ? d.find((e) => e.records.length)?.key : void 0 }),
						value: f.size,
						label: "traceability findings",
						tone: f.size ? "bad" : "good"
					})
				]
			}),
			m && /* @__PURE__ */ (0, U.jsx)("section", {
				className: "card",
				"aria-label": "Verification drill-down",
				children: /* @__PURE__ */ (0, U.jsx)(Oa, {
					title: `${_a[m]} requirements`,
					onClose: g,
					href: a("requirements"),
					items: p[m].map((e) => ja(e, a, /* @__PURE__ */ (0, U.jsx)(en, { verification: t.verificationOf(e.id) })))
				})
			}),
			b.length > 0 && /* @__PURE__ */ (0, U.jsx)(Da, {
				records: b,
				to: y ? "Approved" : "In Review"
			}),
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "dash-grid",
				children: [
					/* @__PURE__ */ (0, U.jsx)(Ma, {}),
					/* @__PURE__ */ (0, U.jsx)(Na, { releases: x }),
					/* @__PURE__ */ (0, U.jsx)(Fa, {}),
					/* @__PURE__ */ (0, U.jsx)(Ia, {})
				]
			}),
			/* @__PURE__ */ (0, U.jsx)(La, { exclude: new Set(b.map((e) => e.id)) })
		] }) : /* @__PURE__ */ (0, U.jsx)(Qt, {
			title: "Start the specification",
			action: /* @__PURE__ */ (0, U.jsx)("button", {
				className: "primary",
				onClick: () => o("requirements"),
				children: "Open requirements"
			}),
			children: "Capture the first requirement for this product."
		})]
	});
}
function wa({ href: e, value: t, label: n, tone: r }) {
	return /* @__PURE__ */ (0, U.jsxs)("a", {
		className: "stat",
		href: e,
		children: [/* @__PURE__ */ (0, U.jsx)("strong", {
			"data-tone": r,
			children: t
		}), /* @__PURE__ */ (0, U.jsx)("span", { children: n })]
	});
}
function Ta({ pressed: e, onClick: t, value: n, label: r, tone: i }) {
	return /* @__PURE__ */ (0, U.jsxs)("button", {
		type: "button",
		className: "stat",
		"aria-pressed": e,
		onClick: t,
		children: [/* @__PURE__ */ (0, U.jsx)("strong", {
			"data-tone": i,
			children: n
		}), /* @__PURE__ */ (0, U.jsx)("span", { children: r })]
	});
}
function Ea({ title: e, badge: t, badgeTone: n }) {
	return /* @__PURE__ */ (0, U.jsxs)("header", {
		className: "dash-head",
		children: [/* @__PURE__ */ (0, U.jsx)("h2", { children: e }), t !== void 0 && /* @__PURE__ */ (0, U.jsx)("span", {
			className: "dash-badge",
			"data-tone": n,
			children: t
		})]
	});
}
function Da({ records: e, to: t }) {
	let { open: n, link: r, session: i, ws: a } = B(), [o, s] = (0, _.useState)(!1), c = o ? e : e.slice(0, 5), l = (e) => Lt(a.process, e.state, i.role).includes(t), u = t === "Approved" ? !ot(i) && "Approval decisions need the Product owner (approver) role." : !at(i) && "Viewers can read but not change records. Ask an administrator for editor access.", d = t === "Approved" ? "Approve" : "Submit", f = t === "Approved" ? "Awaiting approval" : "Drafts";
	return /* @__PURE__ */ (0, U.jsxs)("section", {
		className: "task",
		"aria-label": f,
		children: [/* @__PURE__ */ (0, U.jsxs)("div", {
			className: "task-head",
			children: [/* @__PURE__ */ (0, U.jsxs)("h2", {
				title: t === "Approved" ? "Submitted requirements you can approve or reject." : "Send to the product owner when the wording is final.",
				children: [
					f,
					" ",
					/* @__PURE__ */ (0, U.jsx)("span", {
						className: "count",
						children: e.length
					})
				]
			}), /* @__PURE__ */ (0, U.jsxs)("div", {
				className: "actions",
				children: [e.length > 1 && /* @__PURE__ */ (0, U.jsxs)(G, {
					className: "link small",
					disabledReason: u || !e.every(l) && "Some of these cannot move to that state for your role.",
					onClick: () => n(/* @__PURE__ */ (0, U.jsx)(Tn, {
						records: e,
						to: t
					})),
					children: [
						d,
						" all ",
						e.length
					]
				}), /* @__PURE__ */ (0, U.jsx)("a", {
					className: "small",
					href: r("requirements", void 0, { state: t === "Approved" ? "In Review" : "Draft" }),
					children: "View list"
				})]
			})]
		}), /* @__PURE__ */ (0, U.jsxs)("ul", {
			className: "task-rows",
			children: [c.map((e) => /* @__PURE__ */ (0, U.jsxs)("li", { children: [/* @__PURE__ */ (0, U.jsxs)("a", {
				href: r("requirements", e.id),
				className: "task-link",
				title: e.statement,
				children: [/* @__PURE__ */ (0, U.jsx)("span", {
					className: "mono",
					children: e.id
				}), /* @__PURE__ */ (0, U.jsx)("span", {
					className: "ellipsis",
					children: e.statement
				})]
			}), /* @__PURE__ */ (0, U.jsxs)("div", {
				className: "row-actions",
				children: [t === "Approved" && /* @__PURE__ */ (0, U.jsx)(G, {
					className: "small",
					disabledReason: u || !l(e) && "Not allowed from this state.",
					onClick: () => n(/* @__PURE__ */ (0, U.jsx)(Tn, {
						records: [e],
						to: "Rejected"
					})),
					children: "Reject"
				}), /* @__PURE__ */ (0, U.jsx)(G, {
					className: "small primary-ghost",
					disabledReason: u || !l(e) && "Not allowed from this state.",
					onClick: () => n(/* @__PURE__ */ (0, U.jsx)(Tn, {
						records: [e],
						to: t
					})),
					children: d
				})]
			})] }, e.id)), e.length > 5 && /* @__PURE__ */ (0, U.jsx)("li", {
				className: "task-more",
				children: /* @__PURE__ */ (0, U.jsx)("button", {
					type: "button",
					className: "link",
					onClick: () => s((e) => !e),
					children: o ? "Show fewer" : `Show all ${e.length}`
				})
			})]
		})]
	});
}
function Oa({ title: e, items: t, href: n, onClose: r }) {
	return /* @__PURE__ */ (0, U.jsxs)("div", {
		className: "drill",
		role: "region",
		"aria-label": `${e} records`,
		"aria-live": "polite",
		children: [
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "drill-head",
				children: [
					/* @__PURE__ */ (0, U.jsx)("strong", { children: e }),
					/* @__PURE__ */ (0, U.jsx)("span", {
						className: "count",
						children: t.length
					}),
					/* @__PURE__ */ (0, U.jsx)("button", {
						type: "button",
						className: "icon small-icon",
						"aria-label": "Close preview",
						onClick: r,
						children: "×"
					})
				]
			}),
			t.length ? /* @__PURE__ */ (0, U.jsx)("ul", { children: t.slice(0, 5).map((e) => /* @__PURE__ */ (0, U.jsx)("li", { children: /* @__PURE__ */ (0, U.jsxs)("a", {
				href: e.href,
				title: e.text,
				children: [
					/* @__PURE__ */ (0, U.jsx)("span", {
						className: "mono",
						children: e.id
					}),
					/* @__PURE__ */ (0, U.jsx)("span", {
						className: "ellipsis",
						children: e.text
					}),
					e.right
				]
			}) }, e.key)) }) : /* @__PURE__ */ (0, U.jsx)("p", {
				className: "muted small",
				children: "No records."
			}),
			/* @__PURE__ */ (0, U.jsx)("a", {
				className: "drill-all",
				href: n,
				children: t.length > 5 ? `Open all ${t.length} →` : "Open in full view →"
			})
		]
	});
}
function ka() {
	let [e, t] = (0, _.useState)(null);
	return [
		e,
		(e) => t((t) => t === e ? null : e),
		() => t(null)
	];
}
function Aa(e, t, n) {
	return {
		key: e.id,
		id: e.id,
		text: e.name,
		href: n("verification", e.id),
		right: /* @__PURE__ */ (0, U.jsx)(Gt, { result: t.latestRun(e.id)?.result })
	};
}
function ja(e, t, n) {
	return {
		key: e.id,
		id: e.id,
		text: e.statement,
		href: t("requirements", e.id),
		right: n ?? /* @__PURE__ */ (0, U.jsx)(W, { state: e.state })
	};
}
function Ma() {
	let { ix: e, link: t } = B(), { cases: n } = Sa(), [r, i, a] = ka(), o = (t, n) => e.runsOf(t.id).some((e) => e.maturityLevel === n && e.result === "PASS" && e.coverage === "Complete"), s = va.map((e) => {
		let t = n.filter((t) => t.targetLevel === e);
		return {
			level: e,
			target: t,
			total: t.length,
			done: t.filter((t) => o(t, e)).length
		};
	}), c = Math.max(1, ...s.map((e) => e.total)), l = s.filter((e) => e.total && e.done < e.total).map((e) => e.level), u = s.reduce((e, t) => e + t.done, 0), d = s.find((e) => e.level === r);
	return /* @__PURE__ */ (0, U.jsxs)("section", {
		className: "card dash",
		"aria-label": "Maturity by target level",
		children: [
			/* @__PURE__ */ (0, U.jsx)(Ea, {
				title: "Maturity by target level",
				badge: l.length ? `${l[0]}${l.length > 1 ? `–${l[l.length - 1]}` : ""} need focus` : "On target",
				badgeTone: l.length ? "warn" : "good"
			}),
			/* @__PURE__ */ (0, U.jsx)("div", {
				className: `levels${r ? " has-sel" : ""}`,
				children: s.map((e) => /* @__PURE__ */ (0, U.jsxs)("button", {
					type: "button",
					className: "level",
					"aria-pressed": r === e.level,
					disabled: !e.total,
					onClick: () => i(e.level),
					title: `${e.level} · ${ya[e.level]}: ${e.done} of ${e.total} test cases passed at target`,
					"aria-label": `${e.level}: ${e.done} of ${e.total} passed at target`,
					children: [
						/* @__PURE__ */ (0, U.jsx)("span", {
							className: "level-name",
							children: e.level
						}),
						/* @__PURE__ */ (0, U.jsx)("span", {
							className: "level-track",
							children: /* @__PURE__ */ (0, U.jsx)("span", {
								className: "level-total",
								style: { height: `${e.total / c * 100}%` },
								children: /* @__PURE__ */ (0, U.jsx)("span", {
									className: "level-done",
									style: { height: `${e.total ? e.done / e.total * 100 : 0}%` }
								})
							})
						}),
						/* @__PURE__ */ (0, U.jsxs)("span", {
							className: "level-value",
							children: [
								e.done,
								"/",
								e.total
							]
						})
					]
				}, e.level))
			}),
			/* @__PURE__ */ (0, U.jsxs)("ul", {
				className: "key",
				children: [/* @__PURE__ */ (0, U.jsxs)("li", { children: [/* @__PURE__ */ (0, U.jsx)("span", { className: "swatch total" }), "Test cases targeting the level"] }), /* @__PURE__ */ (0, U.jsxs)("li", { children: [/* @__PURE__ */ (0, U.jsx)("span", { className: "swatch done" }), "Passed at target"] })]
			}),
			d && /* @__PURE__ */ (0, U.jsx)(Oa, {
				title: `Target ${d.level} · ${ya[d.level]}`,
				onClose: a,
				href: t("verification", void 0, { level: d.level }),
				items: [...d.target].sort((e, t) => Number(o(e, d.level)) - Number(o(t, d.level))).map((n) => Aa(n, e, t))
			}),
			/* @__PURE__ */ (0, U.jsxs)("footer", {
				className: "dash-foot",
				children: [/* @__PURE__ */ (0, U.jsxs)("span", { children: [/* @__PURE__ */ (0, U.jsxs)("strong", { children: [
					u,
					" / ",
					n.length
				] }), " test cases passed at their target level"] }), /* @__PURE__ */ (0, U.jsx)("span", { children: "Select a level to see its test cases" })]
			})
		]
	});
}
function Na({ releases: e }) {
	let { link: t } = B(), { scoped: n, baseline: r, drift: i } = Sa(), [a, o, s] = ka(), c = ct.map((e) => ({
		state: e,
		n: n.filter((t) => t.state === e).length
	}));
	return /* @__PURE__ */ (0, U.jsxs)("section", {
		className: "card dash",
		"aria-label": "Requirements lifecycle",
		children: [
			/* @__PURE__ */ (0, U.jsx)(Ea, {
				title: "Requirements lifecycle",
				badge: r ? `${r.requirements.length} in baseline` : "No baseline",
				badgeTone: r ? "good" : void 0
			}),
			/* @__PURE__ */ (0, U.jsxs)("p", {
				className: "hero",
				children: [/* @__PURE__ */ (0, U.jsx)("strong", { children: n.length }), /* @__PURE__ */ (0, U.jsx)("span", { children: "requirements in this product scope" })]
			}),
			/* @__PURE__ */ (0, U.jsx)("div", {
				className: `segbar${a ? " has-sel" : ""}`,
				"aria-hidden": "true",
				children: c.filter((e) => e.n).map((e) => /* @__PURE__ */ (0, U.jsx)("span", {
					role: "presentation",
					"data-state": e.state,
					"data-selected": a === e.state || void 0,
					style: { flexGrow: e.n },
					onClick: () => o(e.state),
					title: `${e.state}: ${e.n}`
				}, e.state))
			}),
			/* @__PURE__ */ (0, U.jsx)("ul", {
				className: `legend-grid${a ? " has-sel" : ""}`,
				children: c.map((e) => /* @__PURE__ */ (0, U.jsx)("li", { children: /* @__PURE__ */ (0, U.jsxs)("button", {
					type: "button",
					"aria-pressed": a === e.state,
					disabled: !e.n,
					onClick: () => o(e.state),
					children: [
						/* @__PURE__ */ (0, U.jsx)("span", {
							className: "dot",
							"data-state": e.state
						}),
						e.state,
						/* @__PURE__ */ (0, U.jsx)("strong", { children: e.n })
					]
				}) }, e.state))
			}),
			a && /* @__PURE__ */ (0, U.jsx)(Oa, {
				title: a,
				onClose: s,
				href: t("requirements", void 0, { state: a }),
				items: n.filter((e) => e.state === a).map((e) => ja(e, t, /* @__PURE__ */ (0, U.jsxs)("span", {
					className: "muted small",
					children: ["Rev ", ht(e)]
				})))
			}),
			/* @__PURE__ */ (0, U.jsxs)("footer", {
				className: "dash-foot",
				children: [r ? /* @__PURE__ */ (0, U.jsxs)("a", {
					href: t("baselines", r.id),
					children: [
						r.name,
						": ",
						i.length ? `${i.length} changed since freeze` : "no changes since freeze"
					]
				}) : /* @__PURE__ */ (0, U.jsx)("a", {
					href: t("baselines"),
					children: "Freeze a baseline"
				}), e.map((e) => /* @__PURE__ */ (0, U.jsx)(Ra, { release: e }, e.id))]
			})
		]
	});
}
function Pa({ parts: e, center: t, sub: n, sel: r, onSelect: i }) {
	let a = e.reduce((e, t) => e + t.n, 0) || 1, o = 2 * Math.PI * 52, s = e.filter((e) => e.n).length > 1 ? 2.5 : 0, c = 0;
	return /* @__PURE__ */ (0, U.jsxs)("svg", {
		viewBox: "0 0 140 140",
		className: `donut${r ? " has-sel" : ""}`,
		role: "img",
		"aria-label": `${t} ${n}`,
		children: [
			/* @__PURE__ */ (0, U.jsx)("circle", {
				cx: "70",
				cy: "70",
				r: 52,
				className: "donut-track"
			}),
			e.filter((e) => e.n).map((e) => {
				let t = e.n / a * o, n = /* @__PURE__ */ (0, U.jsx)("circle", {
					cx: "70",
					cy: "70",
					r: 52,
					className: "donut-seg",
					"data-result": e.key,
					"data-selected": r === e.key || void 0,
					strokeDasharray: `${Math.max(0, t - s)} ${o}`,
					strokeDashoffset: -c,
					transform: "rotate(-90 70 70)",
					onClick: () => i(e.key),
					children: /* @__PURE__ */ (0, U.jsx)("title", { children: `${ba.find((t) => t.key === e.key)?.label}: ${e.n}` })
				}, e.key);
				return c += t, n;
			}),
			/* @__PURE__ */ (0, U.jsx)("text", {
				x: "70",
				y: "68",
				textAnchor: "middle",
				className: "donut-value",
				children: t
			}),
			/* @__PURE__ */ (0, U.jsx)("text", {
				x: "70",
				y: "88",
				textAnchor: "middle",
				className: "donut-sub",
				children: n
			})
		]
	});
}
function Fa() {
	let { ix: e, link: t } = B(), { cases: n, runs: r, byResult: i } = Sa(), [a, o, s] = ka(), c = ba.map((e) => ({
		key: e.key,
		n: i[e.key].length
	})), l = r.filter((e) => e.evidenceUrl).length, u = (e, t, n, r) => /* @__PURE__ */ (0, U.jsxs)("button", {
		type: "button",
		"aria-pressed": a === e,
		onClick: () => o(e),
		children: [/* @__PURE__ */ (0, U.jsx)("strong", {
			"data-tone": r,
			children: t
		}), /* @__PURE__ */ (0, U.jsx)("span", { children: n })]
	});
	return /* @__PURE__ */ (0, U.jsxs)("section", {
		className: "card dash",
		"aria-label": "Verification and test execution",
		children: [
			/* @__PURE__ */ (0, U.jsx)(Ea, {
				title: "Verification & test execution",
				badge: i.FAIL.length ? `${i.FAIL.length} open failure${i.FAIL.length === 1 ? "" : "s"}` : "No failures",
				badgeTone: i.FAIL.length ? "bad" : "good"
			}),
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "exec",
				children: [/* @__PURE__ */ (0, U.jsx)(Pa, {
					parts: c,
					center: `${xa(i.PASS.length, n.length)}%`,
					sub: "passing",
					sel: a,
					onSelect: o
				}), /* @__PURE__ */ (0, U.jsxs)("div", {
					className: "exec-stats",
					children: [
						u("PASS", `${i.PASS.length} / ${n.length}`, "Test cases passing", "good"),
						/* @__PURE__ */ (0, U.jsxs)("a", {
							href: t("verification"),
							children: [/* @__PURE__ */ (0, U.jsx)("strong", { children: r.length }), /* @__PURE__ */ (0, U.jsx)("span", { children: "Recorded runs" })]
						}),
						u("FAIL", i.FAIL.length, "Open failures", i.FAIL.length ? "bad" : void 0),
						u("none", i.none.length, "Never run", i.none.length ? "warn" : void 0)
					]
				})]
			}),
			/* @__PURE__ */ (0, U.jsx)("ul", {
				className: `result-legend${a ? " has-sel" : ""}`,
				children: c.filter((e) => e.n).map((e) => {
					let t = ba.find((t) => t.key === e.key);
					return /* @__PURE__ */ (0, U.jsx)("li", { children: /* @__PURE__ */ (0, U.jsxs)("button", {
						type: "button",
						"aria-pressed": a === e.key,
						onClick: () => o(e.key),
						children: [
							/* @__PURE__ */ (0, U.jsx)("span", {
								className: "glyph",
								"data-result": e.key,
								"aria-hidden": "true",
								children: t.glyph
							}),
							t.label,
							/* @__PURE__ */ (0, U.jsx)("strong", { children: e.n })
						]
					}) }, e.key);
				})
			}),
			a && /* @__PURE__ */ (0, U.jsx)(Oa, {
				title: `Latest result: ${((e) => ba.find((t) => t.key === e)?.label ?? e)(a)}`,
				onClose: s,
				href: t("verification", void 0, { result: a }),
				items: i[a].map((n) => Aa(n, e, t))
			}),
			/* @__PURE__ */ (0, U.jsxs)("footer", {
				className: "dash-foot",
				children: [/* @__PURE__ */ (0, U.jsxs)("span", { children: [/* @__PURE__ */ (0, U.jsxs)("strong", { children: [
					l,
					" / ",
					r.length
				] }), " runs have an evidence link"] }), /* @__PURE__ */ (0, U.jsx)("span", { children: "Latest run per test case" })]
			})
		]
	});
}
function Ia() {
	let { link: e } = B(), { gaps: t, affected: n } = Sa(), [r, i, a] = ka(), o = Math.max(1, ...t.map((e) => e.records.length)), s = t.find((e) => e.key === r);
	return /* @__PURE__ */ (0, U.jsxs)("section", {
		className: "card dash",
		"aria-label": "Traceability and engineering gaps",
		children: [
			/* @__PURE__ */ (0, U.jsx)(Ea, {
				title: "Traceability & engineering gaps",
				badge: `${t.filter((e) => e.records.length).length} of ${t.length} checks open`,
				badgeTone: n.size ? "warn" : "good"
			}),
			/* @__PURE__ */ (0, U.jsxs)("p", {
				className: "hero",
				children: [/* @__PURE__ */ (0, U.jsx)("strong", {
					"data-tone": n.size ? "bad" : "good",
					children: n.size
				}), /* @__PURE__ */ (0, U.jsx)("span", { children: "affected requirements · findings may overlap" })]
			}),
			/* @__PURE__ */ (0, U.jsx)("ul", {
				className: `gaps${r ? " has-sel" : ""}`,
				children: t.map((e) => /* @__PURE__ */ (0, U.jsx)("li", { children: /* @__PURE__ */ (0, U.jsxs)("button", {
					type: "button",
					"aria-pressed": r === e.key,
					disabled: !e.records.length,
					onClick: () => i(e.key),
					title: e.hint,
					children: [
						/* @__PURE__ */ (0, U.jsx)("span", {
							className: "gap-label",
							children: e.label
						}),
						/* @__PURE__ */ (0, U.jsx)("span", {
							className: "gap-track",
							children: /* @__PURE__ */ (0, U.jsx)("span", {
								"data-tone": e.tone,
								style: { width: `${e.records.length / o * 100}%` }
							})
						}),
						/* @__PURE__ */ (0, U.jsx)("strong", { children: e.records.length })
					]
				}) }, e.key))
			}),
			s && /* @__PURE__ */ (0, U.jsx)(Oa, {
				title: s.label,
				onClose: a,
				href: e("trace", void 0, { gap: s.key }),
				items: s.records.map((t) => ja(t, e))
			}),
			/* @__PURE__ */ (0, U.jsxs)("footer", {
				className: "dash-foot",
				children: [/* @__PURE__ */ (0, U.jsx)("span", { children: "Select a check to see its requirements" }), /* @__PURE__ */ (0, U.jsx)("a", {
					href: e("trace"),
					children: "Investigate →"
				})]
			})
		]
	});
}
function La({ exclude: e }) {
	let { ix: t, link: n } = B(), { scoped: r, gaps: i } = Sa(), [a, o] = (0, _.useState)(!1), s = (e) => e.state === "Rejected" ? {
		label: "Rejected",
		tone: "bad"
	} : i[2].records.includes(e) ? {
		label: t.casesOf(e.id).some((e) => t.latestRun(e.id)?.result === "FAIL") ? "Failed" : "Blocked",
		tone: "bad"
	} : i[1].records.includes(e) ? {
		label: "Test on earlier revision",
		tone: "warn"
	} : i[0].records.includes(e) ? {
		label: "No test case",
		tone: "warn"
	} : i[3].records.includes(e) ? {
		label: "Link changed",
		tone: "warn"
	} : e.state === "In Review" ? {
		label: "In review",
		tone: "warn"
	} : null, c = r.filter((t) => !e.has(t.id)).map((e) => ({
		r: e,
		s: s(e)
	})).filter((e) => !!e.s).sort((e, t) => (e.s.tone === "bad" ? 0 : 1) - (t.s.tone === "bad" ? 0 : 1));
	if (!c.length) return null;
	let l = a ? c : c.slice(0, 6);
	return /* @__PURE__ */ (0, U.jsxs)("section", {
		className: "card dash list-card",
		"aria-label": "Needs attention",
		children: [
			/* @__PURE__ */ (0, U.jsxs)("header", {
				className: "list-head",
				children: [/* @__PURE__ */ (0, U.jsxs)("h2", { children: ["Needs attention ", /* @__PURE__ */ (0, U.jsx)("span", {
					className: "count",
					children: c.length
				})] }), /* @__PURE__ */ (0, U.jsx)("span", {
					className: "muted small",
					children: "Current revisions"
				})]
			}),
			/* @__PURE__ */ (0, U.jsx)("ul", {
				className: "attention",
				children: l.map(({ r: e, s: r }) => /* @__PURE__ */ (0, U.jsx)("li", { children: /* @__PURE__ */ (0, U.jsxs)("a", {
					href: n("requirements", e.id),
					children: [
						/* @__PURE__ */ (0, U.jsx)("span", {
							className: "mono",
							children: e.id
						}),
						/* @__PURE__ */ (0, U.jsxs)("span", {
							className: "att-text",
							children: [/* @__PURE__ */ (0, U.jsx)("span", {
								className: "ellipsis",
								children: e.statement
							}), /* @__PURE__ */ (0, U.jsxs)("small", { children: [
								"Rev ",
								ht(e),
								" · ",
								e.category,
								(e.parents ?? []).length ? ` · parent ${e.parents[0]}` : "",
								t.casesOf(e.id).length ? ` · ${t.casesOf(e.id).length} test case${t.casesOf(e.id).length === 1 ? "" : "s"}` : ""
							] })]
						}),
						/* @__PURE__ */ (0, U.jsx)("span", {
							className: "att-status",
							"data-tone": r.tone,
							children: r.label
						})
					]
				}) }, e.id))
			}),
			c.length > 6 && /* @__PURE__ */ (0, U.jsx)("button", {
				type: "button",
				className: "link list-more",
				onClick: () => o((e) => !e),
				children: a ? "Show fewer" : `Show all ${c.length}`
			})
		]
	});
}
function Ra({ release: e }) {
	let { api: t, ws: n, open: r } = B(), [i, a] = (0, _.useState)(null);
	(0, _.useEffect)(() => {
		let n = !0;
		return t.command("release.readiness", { releaseId: e.id }).then((e) => {
			n && a(e);
		}).catch(() => {
			n && a({ status: "UNAVAILABLE" });
		}), () => {
			n = !1;
		};
	}, [
		t,
		e.id,
		n
	]);
	let o = Array.isArray(i?.unmetGates) ? i.unmetGates.length : null;
	return /* @__PURE__ */ (0, U.jsxs)("span", {
		className: "release-line",
		children: [/* @__PURE__ */ (0, U.jsxs)("span", { children: [
			/* @__PURE__ */ (0, U.jsx)("strong", { children: e.name }),
			" · ",
			i ? /* @__PURE__ */ (0, U.jsx)("span", {
				className: "pill",
				"data-tone": i.status === "NOT QUALIFIED" ? "warn" : void 0,
				children: String(i.status).toLowerCase().replace(/^./, (e) => e.toUpperCase())
			}) : "…"
		] }), o !== null && /* @__PURE__ */ (0, U.jsxs)("button", {
			type: "button",
			className: "link",
			onClick: () => r(/* @__PURE__ */ (0, U.jsx)(In, { release: e })),
			children: [
				o,
				" open gate",
				o === 1 ? "" : "s"
			]
		})]
	});
}
// client/src/views/Library.tsx
var za = (e) => {
	let t = e.params.get("tab");
	return t === "actors" || t === "use_cases" || t === "documents" ? t : e.id.startsWith("UC-") ? "use_cases" : e.id.startsWith("DOC-") ? "documents" : "actors";
}, Ba = () => window.dispatchEvent(new Event("rms-documents"));
function Va(e) {
	let t = (0, _.useRef)(null);
	return Ut(), (0, _.useEffect)(() => {
		t.current?.focus();
	}, []), (0, _.useEffect)(() => {
		let t = (t) => {
			t.key === "Escape" && !Wt() && e();
		};
		return window.addEventListener("keydown", t), () => window.removeEventListener("keydown", t);
	}, [e]), t;
}
function Ha() {
	let { route: e } = B(), t = za(e);
	return t === "documents" ? /* @__PURE__ */ (0, U.jsx)(Ja, {}) : /* @__PURE__ */ (0, U.jsx)(Ua, { kind: t === "actors" ? "actor" : "use_case" });
}
function Ua({ kind: e }) {
	let { ws: t, route: n, link: r, go: i } = B(), a = e === "actor" ? t.actors : t.useCases, o = e === "actor" ? "actors" : "use_cases", s = e === "actor" ? "actors" : "use cases", c = $e(n.params.get("state")), l = nt(a), u = et(a, c), d = n.id ? a.find((e) => e.id === n.id) : void 0, f = (e) => ({
		tab: o,
		state: e || void 0
	}), p = (e, t, r) => /* @__PURE__ */ (0, U.jsxs)("button", {
		type: "button",
		className: "filter",
		"data-state": e === "all" || e === "" ? void 0 : e,
		"aria-pressed": c === e,
		onClick: () => i("library", n.id || void 0, f(e), !0),
		children: [
			t,
			" ",
			/* @__PURE__ */ (0, U.jsx)("span", { children: r })
		]
	}, e || "in-use");
	return /* @__PURE__ */ (0, U.jsxs)("div", {
		className: `page specification library${n.id ? " with-detail" : ""}`,
		children: [
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "spec-main",
				children: [
					/* @__PURE__ */ (0, U.jsx)("h1", {
						className: "vh",
						children: e === "actor" ? "Actors" : "Use cases"
					}),
					a.length > 0 && /* @__PURE__ */ (0, U.jsx)("div", {
						className: "toolbar",
						children: /* @__PURE__ */ (0, U.jsxs)("div", {
							className: "chips-row",
							role: "group",
							"aria-label": "Lifecycle state",
							children: [
								p("", "In use", l.inUse),
								p("Draft", "Draft", l.Draft),
								p("Active", "Active", l.Active),
								p("Retired", "Retired", l.Retired),
								p("all", "All", l.all)
							]
						})
					}),
					u.length ? /* @__PURE__ */ (0, U.jsx)("ul", {
						className: "case-list rec-list",
						children: u.map((t) => /* @__PURE__ */ (0, U.jsxs)("li", {
							"data-selected": t.id === n.id || void 0,
							children: [/* @__PURE__ */ (0, U.jsxs)("a", {
								href: r("library", t.id, f(c)),
								"aria-current": t.id === n.id ? "true" : void 0,
								children: [
									/* @__PURE__ */ (0, U.jsx)("span", {
										className: "mono id",
										children: t.id
									}),
									/* @__PURE__ */ (0, U.jsx)("span", {
										className: "statement",
										children: t.name
									}),
									/* @__PURE__ */ (0, U.jsx)("span", {
										className: "meta",
										children: (e === "actor" ? [gt[t.actorType] ?? "Human", t.description] : [t.intendedOutcome ?? t.description]).filter(Boolean).join(" · ")
									})
								]
							}), /* @__PURE__ */ (0, U.jsx)(W, { state: Qe(t) })]
						}, t.id))
					}) : a.length ? /* @__PURE__ */ (0, U.jsx)(Qt, {
						title: `No ${c === "" ? "draft or active " : c === "all" ? "" : `${c.toLowerCase()} `}${s}`,
						children: c === "" && l.Retired > 0 ? `${l.Retired} retired ${s} are hidden. Choose Retired or All to see them.` : "Choose another state to see more."
					}) : /* @__PURE__ */ (0, U.jsx)(Qt, {
						title: `No ${s} yet`,
						children: e === "actor" ? "Actors are the people and external systems that interact with the product. Requirements and tests link to them." : "Use cases describe the interactions the product must support and what success looks like. Requirements and tests link to them."
					})
				]
			}),
			d && /* @__PURE__ */ (0, U.jsx)(Wa, {
				kind: e,
				record: d,
				onClose: () => i("library", void 0, f(c), !0)
			}, d.id),
			n.id && !d && /* @__PURE__ */ (0, U.jsx)("aside", {
				className: "detail",
				children: /* @__PURE__ */ (0, U.jsxs)(Qt, {
					title: "Record not found",
					children: [n.id, " does not exist in this workspace."]
				})
			})
		]
	});
}
function Wa({ kind: e, record: t, onClose: n }) {
	let { ws: r, ix: i, session: a, open: o, close: s } = B(), c = Va(n), l = r.metamodel.recordAttributes[e === "actor" ? "actor" : "use_case"], u = i.linksOf(e, t.id);
	return /* @__PURE__ */ (0, U.jsxs)("aside", {
		className: "detail library-detail",
		ref: c,
		tabIndex: -1,
		"aria-label": `${e === "actor" ? "Actor" : "Use case"} ${t.id}`,
		children: [
			/* @__PURE__ */ (0, U.jsxs)("header", {
				className: "detail-head",
				children: [/* @__PURE__ */ (0, U.jsxs)("div", {
					className: "detail-id",
					children: [
						/* @__PURE__ */ (0, U.jsx)("span", {
							className: "mono",
							children: t.id
						}),
						e === "actor" && /* @__PURE__ */ (0, U.jsx)("span", {
							className: "pill",
							children: gt[t.actorType] ?? "Human"
						}),
						/* @__PURE__ */ (0, U.jsx)(W, { state: Qe(t) }),
						/* @__PURE__ */ (0, U.jsxs)("span", {
							className: "muted small",
							children: ["r", t.revision]
						})
					]
				}), /* @__PURE__ */ (0, U.jsx)("button", {
					type: "button",
					className: "icon",
					"aria-label": "Close details",
					onClick: n,
					children: "×"
				})]
			}),
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "next-step",
				children: [
					/* @__PURE__ */ (0, U.jsx)(G, {
						disabledReason: !at(a) && "Viewers can read but not change records. Ask an administrator for editor access.",
						onClick: () => o(/* @__PURE__ */ (0, U.jsx)(qa, {
							kind: e,
							record: t
						})),
						children: "Edit"
					}),
					rt(Qe(t)).map((n) => /* @__PURE__ */ (0, U.jsx)(G, {
						disabledReason: !at(a) && "Viewers can read but not change records. Ask an administrator for editor access.",
						onClick: () => o(/* @__PURE__ */ (0, U.jsx)(Ga, {
							kind: e,
							record: t,
							action: n
						})),
						children: n.label
					}, n.to)),
					/* @__PURE__ */ (0, U.jsx)(G, {
						disabledReason: !at(a) && "Viewers can read but not change records. Ask an administrator for editor access." || Qe(t) === "Retired" && "A Retired record takes no new links. Restore it first; its existing links stay.",
						onClick: () => o(/* @__PURE__ */ (0, U.jsx)(On, { from: {
							kind: e,
							id: t.id,
							title: t.name
						} })),
						children: "Connect"
					}),
					/* @__PURE__ */ (0, U.jsx)("button", {
						type: "button",
						className: "quiet",
						onClick: () => o(/* @__PURE__ */ (0, U.jsx)(Xt, {
							title: `History · ${t.id}`,
							onClose: s,
							children: /* @__PURE__ */ (0, U.jsx)(ir, {
								recordId: t.id,
								recordKind: e
							})
						})),
						children: "History"
					})
				]
			}),
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "detail-body",
				children: [
					/* @__PURE__ */ (0, U.jsx)("p", {
						className: "statement-lg",
						children: t.name
					}),
					e === "actor" && t.boundary && /* @__PURE__ */ (0, U.jsxs)("p", {
						className: "muted-ink small",
						children: ["Boundary: ", t.boundary]
					}),
					t.intendedOutcome && /* @__PURE__ */ (0, U.jsxs)("p", { children: [
						/* @__PURE__ */ (0, U.jsx)("strong", { children: "Goal:" }),
						" ",
						t.intendedOutcome
					] }),
					t.description && /* @__PURE__ */ (0, U.jsx)("p", {
						className: "prose muted-ink",
						children: t.description
					}),
					/* @__PURE__ */ (0, U.jsx)(mn, {
						defs: l,
						values: t.attributes ?? {}
					}),
					e === "use_case" && (t.operationalContext || t.trigger || t.preconditions || t.mainFlow || t.alternateFlows) && /* @__PURE__ */ (0, U.jsxs)("dl", {
						className: "facts",
						children: [
							t.operationalContext && /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [/* @__PURE__ */ (0, U.jsx)("dt", { children: "Context" }), /* @__PURE__ */ (0, U.jsx)("dd", { children: t.operationalContext })] }),
							t.trigger && /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [/* @__PURE__ */ (0, U.jsx)("dt", { children: "Trigger" }), /* @__PURE__ */ (0, U.jsx)("dd", { children: t.trigger })] }),
							t.preconditions && /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [/* @__PURE__ */ (0, U.jsx)("dt", { children: "Preconditions" }), /* @__PURE__ */ (0, U.jsx)("dd", {
								className: "pre",
								children: t.preconditions
							})] }),
							t.mainFlow && /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [/* @__PURE__ */ (0, U.jsx)("dt", { children: "Main flow" }), /* @__PURE__ */ (0, U.jsx)("dd", {
								className: "pre",
								children: t.mainFlow
							})] }),
							t.alternateFlows && /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [/* @__PURE__ */ (0, U.jsx)("dt", { children: "Alternate flows" }), /* @__PURE__ */ (0, U.jsx)("dd", {
								className: "pre",
								children: t.alternateFlows
							})] })
						]
					}),
					/* @__PURE__ */ (0, U.jsxs)("section", {
						className: "connections",
						children: [/* @__PURE__ */ (0, U.jsx)("div", {
							className: "conn-head",
							children: /* @__PURE__ */ (0, U.jsxs)("h3", { children: ["Connected ", /* @__PURE__ */ (0, U.jsx)("span", {
								className: "count",
								children: u.length
							})] })
						}), u.length ? /* @__PURE__ */ (0, U.jsx)("ul", {
							className: "refs compact",
							children: u.map((n) => {
								let a = n.from === t.id && n.fromKind === e, o = a ? n.toKind : n.fromKind, s = a ? n.to : n.from;
								return o === "github" ? /* @__PURE__ */ (0, U.jsxs)("li", { children: [
									/* @__PURE__ */ (0, U.jsx)(tn, { id: s }),
									/* @__PURE__ */ (0, U.jsxs)("span", {
										className: "ref-meta",
										children: [i.relation(n.type, a), " · GitHub"]
									}),
									/* @__PURE__ */ (0, U.jsx)(nn, { text: n.note })
								] }, n.id) : /* @__PURE__ */ (0, U.jsxs)("li", { children: [
									/* @__PURE__ */ (0, U.jsx)("span", {
										className: "mono",
										children: s
									}),
									/* @__PURE__ */ (0, U.jsx)("span", {
										className: "clamp",
										children: i.title(o, s)
									}),
									/* @__PURE__ */ (0, U.jsxs)("span", {
										className: "ref-meta",
										children: [
											i.relation(n.type, a),
											" · ",
											Mt[o],
											Ka(r, o, s) === "Retired" ? " · Retired" : ""
										]
									}),
									/* @__PURE__ */ (0, U.jsx)(nn, { text: n.note })
								] }, n.id);
							})
						}) : /* @__PURE__ */ (0, U.jsx)("p", {
							className: "muted small",
							children: "Not connected to any requirement, test case or other record yet."
						})]
					})
				]
			})
		]
	});
}
function Ga({ kind: e, record: t, action: n }) {
	let { run: r, close: i } = B(), [a, o] = (0, _.useState)(""), [s, c] = (0, _.useState)(""), [l, u] = (0, _.useState)(!1), d = e === "actor" ? "Actor" : "Use case";
	async function f() {
		u(!0), c("");
		try {
			await r(`${e === "actor" ? "actors" : "use_cases"}.update`, {
				id: t.id,
				expectedRevision: t.revision,
				state: n.to,
				name: t.name,
				...e === "actor" ? { actorType: t.actorType } : { intendedOutcome: t.intendedOutcome },
				reason: a.trim()
			}, `${t.id} ${n.done}`), i();
		} catch (e) {
			c(V(e, "Could not change the state."));
		} finally {
			u(!1);
		}
	}
	return /* @__PURE__ */ (0, U.jsx)(Xt, {
		title: `${n.label} · ${t.id}`,
		onClose: i,
		footer: /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [/* @__PURE__ */ (0, U.jsx)("button", {
			className: "quiet",
			onClick: i,
			children: "Cancel"
		}), /* @__PURE__ */ (0, U.jsx)("button", {
			className: "primary",
			disabled: l || !a.trim(),
			onClick: () => void f(),
			children: l ? "Saving…" : n.label
		})] }),
		children: /* @__PURE__ */ (0, U.jsxs)("div", {
			className: "form",
			children: [
				/* @__PURE__ */ (0, U.jsxs)("p", { children: [
					d,
					" ",
					/* @__PURE__ */ (0, U.jsx)("strong", { children: t.name }),
					" moves from ",
					Qe(t),
					" to ",
					n.to,
					". ",
					n.to === "Retired" ? "It is hidden from default lists and link pickers but is never deleted: its links and history stay." : "Its links and history stay as they are.",
					" Linked requirements and their verification are not changed."
				] }),
				/* @__PURE__ */ (0, U.jsx)(K, {
					label: "Why?",
					hint: "Required. Recorded in the history with your name.",
					children: /* @__PURE__ */ (0, U.jsx)("textarea", {
						rows: 3,
						autoFocus: !0,
						required: !0,
						maxLength: 2e3,
						value: a,
						onChange: (e) => o(e.currentTarget.value)
					})
				}),
				s && /* @__PURE__ */ (0, U.jsx)("p", {
					className: "error",
					role: "alert",
					children: s
				})
			]
		})
	});
}
var Ka = (e, t, n) => (t === "actor" ? e.actors : t === "use_case" ? e.useCases : []).find((e) => e.id === n)?.state;
function qa({ kind: e, record: t }) {
	let { ws: n, scope: r, run: i, close: a } = B(), o = [
		"family",
		"product",
		"component",
		"edition"
	].includes(n.products.find((e) => e.id === r)?.kind), [s, c] = (0, _.useState)(t?.name ?? ""), [l, u] = (0, _.useState)(t?.actorType ?? "human"), [d, f] = (0, _.useState)(t?.intendedOutcome ?? ""), [p, m] = (0, _.useState)(t?.description ?? ""), [h, g] = (0, _.useState)({
		operationalContext: t?.operationalContext ?? "",
		trigger: t?.trigger ?? "",
		preconditions: t?.preconditions ?? "",
		mainFlow: t?.mainFlow ?? "",
		alternateFlows: t?.alternateFlows ?? ""
	}), v = (e) => (t) => {
		let n = t.currentTarget.value;
		g((t) => ({
			...t,
			[e]: n
		}));
	}, [y, b] = (0, _.useState)([]), [x, S] = (0, _.useState)(""), [C, w] = (0, _.useState)(!1), T = n.metamodel.recordAttributes[e === "actor" ? "actor" : "use_case"], [E, D] = (0, _.useState)(() => rn(T, t?.attributes ?? {})), O = on(T, t?.attributes ?? {}, E), k = `${e === "actor" ? "actors" : "use_cases"}.${t ? "update" : "create"}`;
	async function A() {
		w(!0), S("");
		try {
			if (Object.keys(O.errors).length) throw Error("Check the attributes marked in red.");
			let n = t ? "Context record revised" : "Context record created", c = await i(k, {
				...t ? { id: t.id } : {},
				...!t && o ? { productId: r } : {},
				name: s,
				description: p,
				...e === "actor" ? { actorType: l } : {
					intendedOutcome: d,
					...h
				},
				...t ? { expectedRevision: t.revision } : {},
				...Object.keys(O.patch).length ? { attributes: O.patch } : {},
				reason: n
			}, t ? `${t.id} saved` : `${e === "actor" ? "Actor" : "Use case"} created`), u = String(c.id);
			for (let t of y) await i("traceability.add", {
				from: u,
				fromKind: e,
				to: t.id,
				toKind: t.kind,
				type: "related_to",
				reason: "Context link"
			});
			a();
		} catch (e) {
			S(V(e, "Could not save."));
		} finally {
			w(!1);
		}
	}
	return /* @__PURE__ */ (0, U.jsx)(Xt, {
		title: t ? `Edit ${t.id}` : `New ${e === "actor" ? "actor" : "use case"}`,
		onClose: a,
		footer: /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [/* @__PURE__ */ (0, U.jsx)("button", {
			className: "quiet",
			onClick: a,
			children: "Cancel"
		}), /* @__PURE__ */ (0, U.jsx)("button", {
			className: "primary",
			disabled: C || !s || e === "use_case" && !d || Object.keys(O.errors).length > 0,
			onClick: () => void A(),
			children: C ? "Saving…" : "Save"
		})] }),
		children: /* @__PURE__ */ (0, U.jsxs)("div", {
			className: "form",
			children: [
				t && /* @__PURE__ */ (0, U.jsx)("p", {
					className: "muted small mono",
					children: t.id
				}),
				/* @__PURE__ */ (0, U.jsx)(K, {
					label: "Name",
					children: /* @__PURE__ */ (0, U.jsx)("input", {
						value: s,
						onChange: (e) => c(e.currentTarget.value),
						autoFocus: !0
					})
				}),
				e === "actor" ? /* @__PURE__ */ (0, U.jsx)("div", {
					className: "segmented",
					role: "radiogroup",
					"aria-label": "Actor type",
					children: Object.entries(gt).map(([e, t]) => /* @__PURE__ */ (0, U.jsx)("button", {
						type: "button",
						role: "radio",
						"aria-checked": l === e,
						onClick: () => u(e),
						children: t
					}, e))
				}) : /* @__PURE__ */ (0, U.jsx)(K, {
					label: "What does success look like?",
					children: /* @__PURE__ */ (0, U.jsx)("textarea", {
						rows: 3,
						value: d,
						onChange: (e) => f(e.currentTarget.value)
					})
				}),
				/* @__PURE__ */ (0, U.jsx)(K, {
					label: "Description (optional)",
					children: /* @__PURE__ */ (0, U.jsx)("textarea", {
						rows: 3,
						value: p,
						onChange: (e) => m(e.currentTarget.value)
					})
				}),
				e === "use_case" && /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [
					/* @__PURE__ */ (0, U.jsx)(K, {
						label: "Where does it happen? (optional)",
						children: /* @__PURE__ */ (0, U.jsx)("textarea", {
							rows: 2,
							value: h.operationalContext,
							onChange: v("operationalContext")
						})
					}),
					/* @__PURE__ */ (0, U.jsx)(K, {
						label: "What starts it? (optional)",
						children: /* @__PURE__ */ (0, U.jsx)("textarea", {
							rows: 2,
							value: h.trigger,
							onChange: v("trigger")
						})
					}),
					/* @__PURE__ */ (0, U.jsx)(K, {
						label: "What must be true before? (optional)",
						children: /* @__PURE__ */ (0, U.jsx)("textarea", {
							rows: 2,
							value: h.preconditions,
							onChange: v("preconditions")
						})
					}),
					/* @__PURE__ */ (0, U.jsx)(K, {
						label: "Main flow (optional)",
						children: /* @__PURE__ */ (0, U.jsx)("textarea", {
							rows: 5,
							value: h.mainFlow,
							onChange: v("mainFlow")
						})
					}),
					/* @__PURE__ */ (0, U.jsx)(K, {
						label: "Alternate or failure flows (optional)",
						children: /* @__PURE__ */ (0, U.jsx)("textarea", {
							rows: 4,
							value: h.alternateFlows,
							onChange: v("alternateFlows")
						})
					})
				] }),
				/* @__PURE__ */ (0, U.jsx)(fn, {
					idPrefix: `${e}-attr`,
					defs: T,
					draft: E,
					onChange: D,
					errors: O.errors,
					collapseOptional: !0
				}),
				!t && /* @__PURE__ */ (0, U.jsx)(K, {
					label: "Connect to (optional)",
					children: /* @__PURE__ */ (0, U.jsx)(Zt, {
						label: "records",
						multiple: !0,
						options: bn(n, [
							"requirement",
							"use_case",
							"actor",
							"test_case",
							"element"
						]),
						value: y,
						onChange: b
					})
				}),
				x && /* @__PURE__ */ (0, U.jsx)("p", {
					className: "error",
					role: "alert",
					children: x
				})
			]
		})
	});
}
function Ja() {
	let { api: e, route: t, link: n, go: r } = B(), [i, a] = (0, _.useState)(null), [o, s] = (0, _.useState)(""), [c, l] = (0, _.useState)(0);
	(0, _.useEffect)(() => {
		let t = !0;
		return wt(e, "external_documents.list").then((e) => {
			t && a(e);
		}).catch((e) => {
			t && !z(e) && s(V(e, "Documents could not be loaded."));
		}), () => {
			t = !1;
		};
	}, [e, c]), (0, _.useEffect)(() => {
		let e = () => l((e) => e + 1);
		return window.addEventListener("rms-documents", e), () => window.removeEventListener("rms-documents", e);
	}, []);
	let u = t.id ? i?.find((e) => e.id === t.id) : void 0;
	return /* @__PURE__ */ (0, U.jsxs)("div", {
		className: `page specification${t.id ? " with-detail" : ""}`,
		children: [
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "spec-main",
				children: [
					/* @__PURE__ */ (0, U.jsx)("h1", {
						className: "vh",
						children: "Documents"
					}),
					o && /* @__PURE__ */ (0, U.jsx)("p", {
						className: "error",
						children: o
					}),
					i?.length ? /* @__PURE__ */ (0, U.jsx)("ul", {
						className: "case-list rec-list",
						children: i.map((e) => /* @__PURE__ */ (0, U.jsx)("li", {
							"data-selected": e.id === t.id || void 0,
							children: /* @__PURE__ */ (0, U.jsxs)("a", {
								href: n("library", e.id, { tab: "documents" }),
								"aria-current": e.id === t.id ? "true" : void 0,
								children: [
									/* @__PURE__ */ (0, U.jsx)("span", {
										className: "mono id",
										children: e.id
									}),
									/* @__PURE__ */ (0, U.jsx)("span", {
										className: "statement",
										children: e.currentApprovedVersion?.title ?? e.externalId
									}),
									/* @__PURE__ */ (0, U.jsxs)("span", {
										className: "meta",
										children: [
											e.sourceSystem,
											" · ",
											e.externalId,
											e.currentApprovedVersion ? ` · approved ${e.currentApprovedVersion.externalVersion}` : " · no approved version"
										]
									})
								]
							})
						}, e.id))
					}) : i && /* @__PURE__ */ (0, U.jsx)(Qt, {
						title: "No documents referenced",
						children: "Register specifications, datasheets or standards that live elsewhere. RMS tracks their versions and approvals; the files stay where they are."
					})
				]
			}),
			u && /* @__PURE__ */ (0, U.jsx)(Ya, {
				document: u,
				onClose: () => r("library", void 0, { tab: "documents" }, !0)
			}, u.id),
			i && t.id && !u && /* @__PURE__ */ (0, U.jsx)("aside", {
				className: "detail",
				children: /* @__PURE__ */ (0, U.jsxs)(Qt, {
					title: "Document not found",
					children: [t.id, " does not exist in this workspace."]
				})
			})
		]
	});
}
function Ya({ document: e, onClose: t }) {
	let { api: n, ws: r, session: i, open: a, run: o } = B(), s = Va(t), [c, l] = (0, _.useState)([]);
	(0, _.useEffect)(() => {
		let t = !0;
		return n.command("external_documents.versions.list", {
			documentId: e.id,
			limit: 100
		}).then((e) => {
			t && l(e.items ?? []);
		}).catch(() => void 0), () => {
			t = !1;
		};
	}, [n, e]);
	let u = e.currentApprovedVersion;
	return /* @__PURE__ */ (0, U.jsxs)("aside", {
		className: "detail",
		ref: s,
		tabIndex: -1,
		"aria-label": `Document ${e.id}`,
		children: [
			/* @__PURE__ */ (0, U.jsxs)("header", {
				className: "detail-head",
				children: [/* @__PURE__ */ (0, U.jsxs)("div", {
					className: "detail-id",
					children: [/* @__PURE__ */ (0, U.jsx)("span", {
						className: "mono",
						children: e.id
					}), /* @__PURE__ */ (0, U.jsxs)("span", {
						className: "muted small",
						children: [
							e.sourceSystem,
							" · ",
							e.externalId
						]
					})]
				}), /* @__PURE__ */ (0, U.jsx)("button", {
					type: "button",
					className: "icon",
					"aria-label": "Close details",
					onClick: t,
					children: "×"
				})]
			}),
			/* @__PURE__ */ (0, U.jsx)("div", {
				className: "next-step",
				children: /* @__PURE__ */ (0, U.jsx)(G, {
					disabledReason: !at(i) && "Viewers can read but not change records. Ask an administrator for editor access.",
					onClick: () => a(/* @__PURE__ */ (0, U.jsx)(Xa, { document: e })),
					children: "Add version"
				})
			}),
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "detail-body",
				children: [
					/* @__PURE__ */ (0, U.jsx)("p", {
						className: "statement-lg",
						children: u?.title ?? c[0]?.title ?? e.externalId
					}),
					/* @__PURE__ */ (0, U.jsx)("p", { children: u ? /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [
						"Current approved version ",
						/* @__PURE__ */ (0, U.jsx)("strong", { children: u.externalVersion }),
						" · owner ",
						u.owner,
						" · ",
						/* @__PURE__ */ (0, U.jsx)("a", {
							href: u.versionUrl,
							target: "_blank",
							rel: "noreferrer",
							children: "Open ↗"
						})
					] }) : /* @__PURE__ */ (0, U.jsx)("span", {
						className: "muted",
						children: "No approved version yet."
					}) }),
					/* @__PURE__ */ (0, U.jsx)("ul", {
						className: "versions",
						children: c.map((t) => {
							let n = (r.process.transitions ?? []).filter((e) => e.from === t.state && e.roles?.includes(i.role) && e.to !== "Superseded").map((e) => String(e.to));
							return /* @__PURE__ */ (0, U.jsxs)("li", { children: [
								/* @__PURE__ */ (0, U.jsx)("span", {
									className: "mono",
									children: t.externalVersion
								}),
								/* @__PURE__ */ (0, U.jsx)(W, { state: t.state }),
								e.approvedVersionId === t.id && /* @__PURE__ */ (0, U.jsx)("span", {
									className: "pill",
									"data-tone": "good",
									children: "Current"
								}),
								/* @__PURE__ */ (0, U.jsx)("span", {
									className: "clamp",
									children: t.title
								}),
								/* @__PURE__ */ (0, U.jsxs)("span", {
									className: "row-actions",
									children: [n.map((n) => /* @__PURE__ */ (0, U.jsx)("button", {
										type: "button",
										className: "small",
										onClick: () => a(/* @__PURE__ */ (0, U.jsx)(Rn, {
											title: `${n === "Approved" ? "Approve" : `Move to ${n}`} · ${t.externalVersion}`,
											submit: "Record decision",
											decision: n !== "In Review",
											initial: n === "Approved" ? "Document version reviewed and approved" : ["Rejected", "Draft"].includes(n) ? "" : `Moved to ${n}`,
											onConfirm: async (r) => {
												await o("external_documents.version.transition", {
													id: t.id,
													state: n,
													expectedRevision: t.revision,
													documentRevision: e.revision,
													reason: r
												}, "Decision recorded"), Ba();
											}
										})),
										children: n === "Approved" ? "Approve" : n
									}, n)), at(i) && /* @__PURE__ */ (0, U.jsx)("button", {
										type: "button",
										className: "small",
										onClick: () => a(/* @__PURE__ */ (0, U.jsx)(Za, { version: t })),
										children: "Connect"
									})]
								})
							] }, t.id);
						})
					})
				]
			})
		]
	});
}
function Xa({ document: e }) {
	let { run: t, close: n, scope: r } = B(), [i, a] = (0, _.useState)({
		id: e ? "" : `DOC-${r}-${Date.now().toString(36).toUpperCase()}`,
		sourceSystem: "",
		externalId: "",
		externalVersion: "",
		title: "",
		owner: "",
		versionUrl: ""
	}), [o, s] = (0, _.useState)(""), c = (e) => (t) => {
		let n = t.currentTarget.value;
		a((t) => ({
			...t,
			[e]: n
		}));
	};
	async function l() {
		s("");
		let r = `${e?.id ?? i.id}-V-${i.externalVersion.replace(/[^A-Za-z0-9_.:-]/g, "-")}`;
		try {
			e ? await t("external_documents.version.create", {
				id: r,
				documentId: e.id,
				externalVersion: i.externalVersion,
				title: i.title,
				owner: i.owner,
				versionUrl: i.versionUrl,
				reason: "New document version referenced"
			}, "Version added as draft") : await t("external_documents.create", {
				id: i.id,
				versionId: r,
				sourceSystem: i.sourceSystem,
				externalId: i.externalId,
				externalVersion: i.externalVersion,
				title: i.title,
				owner: i.owner,
				versionUrl: i.versionUrl,
				reason: "Document reference registered"
			}, "Document registered"), Ba(), n();
		} catch (e) {
			s(V(e, "Could not save."));
		}
	}
	return /* @__PURE__ */ (0, U.jsx)(Xt, {
		title: e ? `New version · ${e.externalId}` : "Register a document",
		onClose: n,
		footer: /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [/* @__PURE__ */ (0, U.jsx)("button", {
			className: "quiet",
			onClick: n,
			children: "Cancel"
		}), /* @__PURE__ */ (0, U.jsx)("button", {
			className: "primary",
			onClick: () => void l(),
			children: "Save"
		})] }),
		children: /* @__PURE__ */ (0, U.jsxs)("div", {
			className: "form",
			children: [
				!e && /* @__PURE__ */ (0, U.jsxs)("div", {
					className: "grid-2",
					children: [/* @__PURE__ */ (0, U.jsx)(K, {
						label: "Where it lives",
						children: /* @__PURE__ */ (0, U.jsx)("input", {
							value: i.sourceSystem,
							onChange: c("sourceSystem"),
							placeholder: "SharePoint, Git, PLM…"
						})
					}), /* @__PURE__ */ (0, U.jsx)(K, {
						label: "ID in that system",
						children: /* @__PURE__ */ (0, U.jsx)("input", {
							value: i.externalId,
							onChange: c("externalId")
						})
					})]
				}),
				/* @__PURE__ */ (0, U.jsx)(K, {
					label: "Title",
					children: /* @__PURE__ */ (0, U.jsx)("input", {
						value: i.title,
						onChange: c("title")
					})
				}),
				/* @__PURE__ */ (0, U.jsxs)("div", {
					className: "grid-2",
					children: [/* @__PURE__ */ (0, U.jsx)(K, {
						label: "Version label",
						children: /* @__PURE__ */ (0, U.jsx)("input", {
							value: i.externalVersion,
							onChange: c("externalVersion"),
							placeholder: "v1.2"
						})
					}), /* @__PURE__ */ (0, U.jsx)(K, {
						label: "Owner",
						children: /* @__PURE__ */ (0, U.jsx)("input", {
							value: i.owner,
							onChange: c("owner")
						})
					})]
				}),
				/* @__PURE__ */ (0, U.jsx)(K, {
					label: "Link (HTTPS)",
					children: /* @__PURE__ */ (0, U.jsx)("input", {
						type: "url",
						value: i.versionUrl,
						onChange: c("versionUrl"),
						placeholder: "https://"
					})
				}),
				o && /* @__PURE__ */ (0, U.jsx)("p", {
					className: "error",
					role: "alert",
					children: o
				})
			]
		})
	});
}
function Za({ version: e }) {
	let { ws: t, run: n, close: r, ix: i } = B(), [a, o] = (0, _.useState)([]), [s, c] = (0, _.useState)("");
	return /* @__PURE__ */ (0, U.jsxs)(Xt, {
		title: `Connect ${e.externalVersion}`,
		onClose: r,
		footer: /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [/* @__PURE__ */ (0, U.jsx)("button", {
			className: "quiet",
			onClick: r,
			children: "Cancel"
		}), /* @__PURE__ */ (0, U.jsx)("button", {
			className: "primary",
			onClick: () => void (async () => {
				try {
					for (let t of a) {
						let r = i.records.get(`${t.kind}:${t.id}`);
						await n("traceability.add", {
							from: e.id,
							fromKind: "external",
							fromRevision: e.revision,
							to: t.id,
							toKind: t.kind,
							toRevision: r?.revision,
							type: "related_to",
							reason: "Document reference"
						});
					}
					r();
				} catch (e) {
					c(V(e, "Could not connect."));
				}
			})(),
			children: "Connect"
		})] }),
		children: [
			/* @__PURE__ */ (0, U.jsx)(Zt, {
				label: "records",
				multiple: !0,
				options: bn(t, [
					"requirement",
					"use_case",
					"actor",
					"test_case"
				]),
				value: a,
				onChange: o
			}),
			/* @__PURE__ */ (0, U.jsx)("p", {
				className: "muted small",
				children: "Links pin the exact document version and record revision."
			}),
			s && /* @__PURE__ */ (0, U.jsx)("p", {
				className: "error",
				role: "alert",
				children: s
			})
		]
	});
}
// client/src/views/Requirements.tsx
function Qa() {
	let { ws: e, ix: t, scope: n, session: r, open: i, go: a, link: o, route: s } = B(), c = s.params, l = s.id, [u, d] = (0, _.useState)(c.get("q") ?? ""), f = c.get("state") ?? "", p = c.get("category") ?? "", m = c.get("attr") ?? "", h = c.get("av") ?? "", g = e.metamodel.recordAttributes.requirement, v = g.find((e) => e.key === m), [y, b] = (0, _.useState)("outline"), [x, S] = (0, _.useState)(/* @__PURE__ */ new Set()), [C, w] = (0, _.useState)(/* @__PURE__ */ new Set()), T = (0, _.useRef)(null), E = (0, _.useMemo)(() => e.requirements.filter((t) => It(e, n, t)), [e, n]), D = (0, _.useMemo)(() => new Set(E.map((e) => e.id)), [E]), O = u.trim().toLowerCase(), k = E.filter((e) => (!f || e.state === f) && (!p || e.category === p) && (!v || !h || sn(v, e.attributes?.[v.key], h)) && (!O || `${e.id} ${e.statement} ${e.criteria} ${e.category}`.toLowerCase().includes(O))), A = !!(O || f || p || v && h), j = [...new Set(E.map((e) => e.category))].sort(), M = (e) => ({
		state: f,
		category: p,
		q: u,
		attr: m,
		av: h,
		...e
	}), N = (e, t) => a("requirements", l || void 0, M({ [e]: t }), !0), P = (e) => a("requirements", l || void 0, M({
		attr: e.attribute,
		av: e.value
	}), !0);
	(0, _.useEffect)(() => {
		let e = (e) => {
			e.key === "/" && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) && (e.preventDefault(), T.current?.focus());
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, []);
	let F = E.filter((e) => !(e.parents ?? []).some((e) => D.has(e))), I = [];
	if (A || y === "list") for (let e of k) I.push({
		r: e,
		depth: 0,
		hasChildren: !1
	});
	else {
		let e = /* @__PURE__ */ new Set(), n = (r, i) => {
			if (e.has(r.id)) return;
			e.add(r.id);
			let a = t.childrenOf(r.id).filter((e) => D.has(e.id) && (e.parents ?? []).find((e) => D.has(e)) === r.id);
			if (I.push({
				r,
				depth: i,
				hasChildren: a.length > 0
			}), !C.has(r.id)) for (let e of a) n(e, i + 1);
		};
		for (let e of F) n(e, 0);
	}
	let ee = A || y === "list", te = (e, t) => {
		let n = e.parents ?? [];
		if (ee || t === 0) return n.length ? ` · refines ${n.join(", ")}` : "";
		let r = n.find((e) => D.has(e)), i = n.filter((e) => e !== r);
		return i.length ? ` · also refines ${i.join(", ")}` : "";
	}, ne = E.filter((e) => x.has(e.id)), re = ne.length ? Lt(e.process, ne[0].state, r.role).filter((t) => ne.every((n) => Lt(e.process, n.state, r.role).includes(t))) : [], ie = (e) => S((t) => {
		let n = new Set(t);
		return n.has(e) ? n.delete(e) : n.add(e), n;
	}), ae = l ? t.reqById.get(l) : void 0, oe = I.map((e) => e.r.id);
	return /* @__PURE__ */ (0, U.jsxs)("div", {
		className: `page specification${ae ? " with-detail" : ""}`,
		children: [
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "spec-main",
				children: [
					/* @__PURE__ */ (0, U.jsx)("h1", {
						className: "vh",
						children: "Requirements"
					}),
					/* @__PURE__ */ (0, U.jsxs)("div", {
						className: "toolbar",
						children: [
							/* @__PURE__ */ (0, U.jsx)("input", {
								ref: T,
								type: "search",
								className: "search",
								"aria-label": "Filter requirements",
								placeholder: "Filter by ID, text or criteria   /",
								value: u,
								onChange: (e) => d(e.currentTarget.value)
							}),
							/* @__PURE__ */ (0, U.jsxs)("div", {
								className: "chips-row",
								role: "group",
								"aria-label": "Lifecycle state",
								children: [/* @__PURE__ */ (0, U.jsxs)("button", {
									type: "button",
									className: "filter",
									"aria-pressed": !f,
									onClick: () => N("state", ""),
									children: ["All ", /* @__PURE__ */ (0, U.jsx)("span", { children: E.length })]
								}), ct.map((e) => {
									let t = E.filter((t) => t.state === e).length;
									return t ? /* @__PURE__ */ (0, U.jsxs)("button", {
										type: "button",
										className: "filter",
										"data-state": e,
										"aria-pressed": f === e,
										onClick: () => N("state", f === e ? "" : e),
										children: [
											e,
											" ",
											/* @__PURE__ */ (0, U.jsx)("span", { children: t })
										]
									}, e) : null;
								})]
							}),
							/* @__PURE__ */ (0, U.jsxs)("select", {
								"aria-label": "Category",
								value: p,
								onChange: (e) => N("category", e.currentTarget.value),
								children: [/* @__PURE__ */ (0, U.jsx)("option", {
									value: "",
									children: "All categories"
								}), j.map((e) => /* @__PURE__ */ (0, U.jsx)("option", { children: e }, e))]
							}),
							g.length > 0 && /* @__PURE__ */ (0, U.jsx)(hn, {
								defs: g,
								attribute: m,
								value: h,
								onChange: P
							}),
							/* @__PURE__ */ (0, U.jsxs)("div", {
								className: "segmented small",
								role: "radiogroup",
								"aria-label": "Layout",
								children: [/* @__PURE__ */ (0, U.jsx)("button", {
									type: "button",
									role: "radio",
									"aria-checked": y === "outline",
									onClick: () => b("outline"),
									disabled: A,
									title: A ? "Filters show a flat list" : void 0,
									children: "Outline"
								}), /* @__PURE__ */ (0, U.jsx)("button", {
									type: "button",
									role: "radio",
									"aria-checked": y === "list" || A,
									onClick: () => b("list"),
									children: "List"
								})]
							})
						]
					}),
					I.length ? /* @__PURE__ */ (0, U.jsxs)("div", {
						className: "spec-table",
						role: "table",
						"aria-label": "Requirements",
						children: [/* @__PURE__ */ (0, U.jsxs)("div", {
							className: "spec-row head",
							role: "row",
							children: [
								/* @__PURE__ */ (0, U.jsx)("span", {
									role: "columnheader",
									children: /* @__PURE__ */ (0, U.jsx)("input", {
										type: "checkbox",
										"aria-label": "Select all shown",
										checked: oe.length > 0 && oe.every((e) => x.has(e)),
										onChange: (e) => S(e.currentTarget.checked ? new Set(oe) : /* @__PURE__ */ new Set())
									})
								}),
								/* @__PURE__ */ (0, U.jsx)("span", {
									role: "columnheader",
									children: "Requirement"
								}),
								/* @__PURE__ */ (0, U.jsx)("span", {
									role: "columnheader",
									children: "Tests"
								}),
								/* @__PURE__ */ (0, U.jsx)("span", {
									role: "columnheader",
									children: "State"
								})
							]
						}), I.map(({ r: e, depth: r, hasChildren: i }, a) => {
							let s = t.casesOf(e.id), c = s.some((e) => t.isStale(e)), u = t.verificationOf(e.id), d = u?.reasons?.[0];
							return /* @__PURE__ */ (0, U.jsxs)("div", {
								role: "row",
								className: "spec-row",
								"aria-selected": e.id === l,
								"data-depth": r,
								children: [
									/* @__PURE__ */ (0, U.jsx)("span", {
										role: "cell",
										children: /* @__PURE__ */ (0, U.jsx)("input", {
											type: "checkbox",
											"aria-label": `Select ${e.id}`,
											checked: x.has(e.id),
											onChange: () => ie(e.id)
										})
									}),
									/* @__PURE__ */ (0, U.jsxs)("span", {
										role: "cell",
										className: "spec-text",
										style: { paddingLeft: Math.min(r, 5) * 16 },
										children: [i ? /* @__PURE__ */ (0, U.jsx)("button", {
											type: "button",
											className: "twisty",
											"aria-expanded": !C.has(e.id),
											"aria-label": `${C.has(e.id) ? "Expand" : "Collapse"} ${e.id}`,
											onClick: () => w((t) => {
												let n = new Set(t);
												return n.has(e.id) ? n.delete(e.id) : n.add(e.id), n;
											}),
											children: C.has(e.id) ? "▸" : "▾"
										}) : /* @__PURE__ */ (0, U.jsx)("span", { className: "twisty-gap" }), /* @__PURE__ */ (0, U.jsxs)("a", {
											href: o("requirements", e.id, M({})),
											className: "spec-link",
											children: [
												/* @__PURE__ */ (0, U.jsx)("span", {
													className: "mono id",
													children: e.id
												}),
												/* @__PURE__ */ (0, U.jsx)("span", {
													className: "statement",
													children: e.statement
												}),
												/* @__PURE__ */ (0, U.jsxs)("span", {
													className: "meta",
													children: [
														e.category,
														e.productId !== n && ` · ${e.productId}`,
														te(e, r)
													]
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, U.jsxs)("span", {
										role: "cell",
										className: "tests",
										title: d ? vt(d) : s.length ? `${s.length} test case(s) written for this requirement` : "No test case yet",
										children: [
											/* @__PURE__ */ (0, U.jsx)(en, { verification: u }),
											/* @__PURE__ */ (0, U.jsx)("span", {
												className: "muted small",
												children: s.length ? `${s.length} ${s.length === 1 ? "test" : "tests"}` : "no tests"
											}),
											c && /* @__PURE__ */ (0, U.jsx)("span", {
												className: "pill",
												"data-tone": "warn",
												children: "To re-check"
											})
										]
									}),
									/* @__PURE__ */ (0, U.jsx)("span", {
										role: "cell",
										children: /* @__PURE__ */ (0, U.jsx)(W, { state: e.state })
									})
								]
							}, `${e.id}:${a}`);
						})]
					}) : /* @__PURE__ */ (0, U.jsx)(Qt, {
						title: A ? "Nothing matches these filters" : "No requirements yet",
						action: A ? /* @__PURE__ */ (0, U.jsx)("button", {
							onClick: () => {
								d(""), a("requirements");
							},
							children: "Clear filters"
						}) : void 0,
						children: A ? "Try a different word or state." : "Create the first requirement for this product."
					}),
					ne.length > 0 && /* @__PURE__ */ (0, U.jsxs)("div", {
						className: "bulkbar",
						role: "region",
						"aria-label": "Bulk actions",
						children: [
							/* @__PURE__ */ (0, U.jsxs)("strong", { children: [ne.length, " selected"] }),
							re.map((e) => /* @__PURE__ */ (0, U.jsx)(G, {
								className: e === "Approved" || e === "In Review" ? "primary" : void 0,
								disabledReason: e === "Approved" && !ot(r) && "Approval decisions need the Product owner (approver) role.",
								onClick: () => i(/* @__PURE__ */ (0, U.jsx)(Tn, {
									records: ne,
									to: e
								})),
								children: e === "In Review" ? "Submit for review" : e === "Approved" ? "Approve" : e === "Draft" ? "Send back to draft" : e === "Rejected" ? "Reject" : `Mark ${e.toLowerCase()}`
							}, e)),
							!re.length && /* @__PURE__ */ (0, U.jsx)("span", {
								className: "muted",
								children: at(r) ? "No shared next step for this mix of states." : "Viewers can read but not change records. Ask an administrator for editor access."
							}),
							ne.every((e) => e.state === "Approved") && /* @__PURE__ */ (0, U.jsx)(G, {
								disabledReason: !ot(r) && "Freezing a baseline needs the Product owner role.",
								onClick: () => i(/* @__PURE__ */ (0, U.jsx)(Nn, { preselected: ne.map((e) => e.id) })),
								children: "Freeze as baseline"
							}),
							/* @__PURE__ */ (0, U.jsx)("button", {
								type: "button",
								className: "quiet",
								onClick: () => S(/* @__PURE__ */ new Set()),
								children: "Clear"
							})
						]
					})
				]
			}),
			ae && /* @__PURE__ */ (0, U.jsx)(Si, {
				record: ae,
				onClose: () => a("requirements", void 0, M({}))
			}, ae.id),
			l && !ae && /* @__PURE__ */ (0, U.jsx)("aside", {
				className: "detail",
				children: /* @__PURE__ */ (0, U.jsxs)(Qt, {
					title: "Requirement not found",
					children: [l, " does not exist in this workspace."]
				})
			})
		]
	});
}
// client/src/views/Trace.tsx
var $a = [
	{
		key: "",
		label: "Everything",
		test: () => !0,
		hint: "All requirements in scope with their upstream and downstream connections."
	},
	{
		key: "untested",
		label: "No test case",
		test: (e, t) => e.state === "Approved" && !t.casesOf(e.id).some((e) => e.mandatory),
		hint: "Approved requirements without a mandatory test case."
	},
	{
		key: "failing",
		label: "Failing tests",
		test: (e, t) => t.casesOf(e.id).some((e) => ["FAIL", "BLOCKED"].includes(t.latestRun(e.id)?.result)),
		hint: "The latest run of a linked test case failed or was blocked."
	},
	{
		key: "stale",
		label: "Tests to re-check",
		test: (e, t) => t.casesOf(e.id).some((e) => t.isStale(e)),
		hint: "The requirement changed after its test case was written."
	},
	{
		key: "links",
		label: "Links to re-check",
		test: (e, t) => t.linksOf("requirement", e.id).some((e) => e.needsReview),
		hint: "A linked record changed after the link was made."
	},
	{
		key: "orphans",
		label: "Unconnected",
		test: (e, t) => !(e.parents ?? []).length && !t.childrenOf(e.id).length && !t.casesOf(e.id).length && !t.linksOf("requirement", e.id).length,
		hint: "No parent, child, test case or link at all."
	}
];
function eo() {
	let { ws: e, ix: t, scope: n, link: r, route: i } = B(), a = i.params.get("gap") ?? "", o = $a.find((e) => e.key === a) ?? $a[0], s = e.requirements.filter((t) => It(e, n, t)), c = s.filter((e) => o.test(e, t));
	return /* @__PURE__ */ (0, U.jsxs)("div", {
		className: "page",
		children: [
			/* @__PURE__ */ (0, U.jsx)("h1", {
				className: "vh",
				children: "Traceability"
			}),
			/* @__PURE__ */ (0, U.jsx)("div", {
				className: "chips-row",
				role: "group",
				"aria-label": "Gap filter",
				children: $a.map((e) => {
					let n = s.filter((n) => e.test(n, t)).length;
					return /* @__PURE__ */ (0, U.jsxs)("a", {
						className: "filter",
						title: e.hint,
						"aria-current": e.key === o.key ? "true" : void 0,
						href: r("trace", void 0, { gap: e.key }),
						children: [
							e.label,
							" ",
							/* @__PURE__ */ (0, U.jsx)("span", { children: n })
						]
					}, e.key);
				})
			}),
			o.key !== "" && /* @__PURE__ */ (0, U.jsx)("p", {
				className: "muted small",
				children: o.hint
			}),
			c.length ? /* @__PURE__ */ (0, U.jsx)("div", {
				className: "table-wrap",
				children: /* @__PURE__ */ (0, U.jsxs)("table", {
					className: "matrix",
					children: [/* @__PURE__ */ (0, U.jsx)("thead", { children: /* @__PURE__ */ (0, U.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, U.jsx)("th", {
							scope: "col",
							children: "Requirement"
						}),
						/* @__PURE__ */ (0, U.jsx)("th", {
							scope: "col",
							children: "Refines"
						}),
						/* @__PURE__ */ (0, U.jsx)("th", {
							scope: "col",
							children: "Refined by"
						}),
						/* @__PURE__ */ (0, U.jsx)("th", {
							scope: "col",
							children: "Test cases · latest result"
						}),
						/* @__PURE__ */ (0, U.jsx)("th", {
							scope: "col",
							children: "Use cases & links"
						})
					] }) }), /* @__PURE__ */ (0, U.jsx)("tbody", { children: c.map((e) => {
						let n = t.casesOf(e.id), i = t.linksOf("requirement", e.id).filter((e) => e.type !== "verifies");
						return /* @__PURE__ */ (0, U.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, U.jsx)("th", {
								scope: "row",
								children: /* @__PURE__ */ (0, U.jsxs)("a", {
									href: r("requirements", e.id),
									children: [
										/* @__PURE__ */ (0, U.jsx)("span", {
											className: "mono",
											children: e.id
										}),
										" ",
										/* @__PURE__ */ (0, U.jsx)(W, { state: e.state }),
										/* @__PURE__ */ (0, U.jsx)("span", {
											className: "clamp small-text",
											children: e.statement
										})
									]
								})
							}),
							/* @__PURE__ */ (0, U.jsxs)("td", { children: [(e.parents ?? []).map((e) => /* @__PURE__ */ (0, U.jsx)("a", {
								className: "mono tag",
								href: r("requirements", e),
								children: e
							}, e)), !(e.parents ?? []).length && /* @__PURE__ */ (0, U.jsx)("span", {
								className: "muted",
								children: "—"
							})] }),
							/* @__PURE__ */ (0, U.jsxs)("td", { children: [t.childrenOf(e.id).map((e) => /* @__PURE__ */ (0, U.jsx)("a", {
								className: "mono tag",
								href: r("requirements", e.id),
								children: e.id
							}, e.id)), !t.childrenOf(e.id).length && /* @__PURE__ */ (0, U.jsx)("span", {
								className: "muted",
								children: "—"
							})] }),
							/* @__PURE__ */ (0, U.jsx)("td", { children: n.length ? n.map((e) => /* @__PURE__ */ (0, U.jsxs)("a", {
								className: "case-line",
								href: r("verification", e.id),
								children: [
									/* @__PURE__ */ (0, U.jsx)("span", {
										className: "mono",
										children: e.id
									}),
									" ",
									/* @__PURE__ */ (0, U.jsx)(Gt, { result: t.latestRun(e.id)?.result }),
									t.isStale(e) && /* @__PURE__ */ (0, U.jsx)("span", {
										className: "pill",
										"data-tone": "warn",
										children: "Re-check"
									})
								]
							}, e.id)) : /* @__PURE__ */ (0, U.jsx)("span", {
								className: "pill",
								"data-tone": "warn",
								children: "None"
							}) }),
							/* @__PURE__ */ (0, U.jsx)("td", { children: i.length ? i.map((n) => {
								let r = n.from === e.id && (n.fromKind ?? "requirement") === "requirement", i = r ? n.toKind ?? "requirement" : n.fromKind ?? "requirement", a = r ? n.to : n.from;
								return /* @__PURE__ */ (0, U.jsxs)("span", {
									className: "link-cell",
									"data-tone": n.needsReview ? "warn" : void 0,
									children: [
										i === "github" ? /* @__PURE__ */ (0, U.jsx)(tn, { id: a }) : /* @__PURE__ */ (0, U.jsx)("span", {
											className: "mono tag",
											title: t.title(i, a),
											children: a
										}),
										/* @__PURE__ */ (0, U.jsxs)("span", {
											className: "ref-meta",
											children: [t.relation(n.type, r), n.needsReview ? " · re-check" : ""]
										}),
										/* @__PURE__ */ (0, U.jsx)(nn, { text: n.note })
									]
								}, n.id);
							}) : /* @__PURE__ */ (0, U.jsx)("span", {
								className: "muted",
								children: "—"
							}) })
						] }, e.id);
					}) })]
				})
			}) : /* @__PURE__ */ (0, U.jsxs)(Qt, {
				title: "No gaps here",
				children: [
					"Nothing in this scope matches “",
					o.label,
					"”."
				]
			}),
			/* @__PURE__ */ (0, U.jsx)($t, { children: "Rows are requirements owned by or applicable to the selected product. Test cases are those written for the requirement; “Re-check” means the test case pins an older requirement revision. Latest result is the most recently recorded run." })
		]
	});
}
// client/src/views/Verification.tsx
function to() {
	let { ws: e, ix: t, scope: n, link: r, route: i, go: a } = B(), o = i.params.get("result") ?? "", s = i.params.get("level") ?? "", [c, l] = (0, _.useState)(""), { cases: u, runs: d } = (0, _.useMemo)(() => {
		let t = new Set(e.requirements.filter((t) => It(e, n, t)).map((e) => e.id)), r = e.testCases.filter((e) => t.has(e.requirementId));
		return {
			cases: r,
			runs: St(e.executions, r)
		};
	}, [e, n]), f = c.trim().toLowerCase(), p = u.filter((e) => (!s || e.targetLevel === s) && (!o || (t.latestRun(e.id)?.result ?? "none") === o) && (!f || `${e.id} ${e.name} ${e.requirementId}`.toLowerCase().includes(f))), m = i.id ? e.testCases.find((e) => e.id === i.id) : void 0;
	return /* @__PURE__ */ (0, U.jsxs)("div", {
		className: `page specification${m ? " with-detail" : ""}`,
		children: [/* @__PURE__ */ (0, U.jsxs)("div", {
			className: "spec-main",
			children: [
				/* @__PURE__ */ (0, U.jsx)("h1", {
					className: "vh",
					children: "Verification"
				}),
				/* @__PURE__ */ (0, U.jsxs)("div", {
					className: "toolbar",
					children: [
						/* @__PURE__ */ (0, U.jsx)("input", {
							type: "search",
							className: "search",
							"aria-label": "Filter test cases",
							placeholder: "Filter test cases",
							value: c,
							onChange: (e) => l(e.currentTarget.value)
						}),
						s && /* @__PURE__ */ (0, U.jsxs)("a", {
							className: "filter",
							"aria-current": "true",
							href: r("verification", i.id || void 0, { result: o || void 0 }),
							title: "Clear target level filter",
							children: [
								"Target ",
								s,
								" ×"
							]
						}),
						/* @__PURE__ */ (0, U.jsxs)("div", {
							className: "chips-row",
							role: "group",
							"aria-label": "Latest result",
							children: [/* @__PURE__ */ (0, U.jsxs)("a", {
								className: "filter",
								"aria-current": o ? void 0 : "true",
								href: r("verification", i.id || void 0),
								children: ["All ", /* @__PURE__ */ (0, U.jsx)("span", { children: u.length })]
							}), [
								"PASS",
								"FAIL",
								"BLOCKED",
								"NOT VERIFIED",
								"Planned",
								"none"
							].map((e) => {
								let n = u.filter((n) => (t.latestRun(n.id)?.result ?? "none") === e).length;
								return n ? /* @__PURE__ */ (0, U.jsxs)("a", {
									className: "filter",
									"aria-current": o === e ? "true" : void 0,
									href: r("verification", i.id || void 0, { result: o === e ? void 0 : e }),
									children: [
										e === "none" ? "No run yet" : e === "NOT VERIFIED" ? "Not verified" : e[0] + e.slice(1).toLowerCase(),
										" ",
										/* @__PURE__ */ (0, U.jsx)("span", { children: n })
									]
								}, e) : null;
							})]
						}),
						/* @__PURE__ */ (0, U.jsxs)("span", {
							className: "muted small toolbar-count",
							children: [
								u.length,
								" test cases · ",
								d,
								" recorded runs"
							]
						})
					]
				}),
				p.length ? /* @__PURE__ */ (0, U.jsx)("ul", {
					className: "case-list",
					children: p.map((e) => {
						let n = t.latestRun(e.id);
						return /* @__PURE__ */ (0, U.jsxs)("li", {
							"data-selected": e.id === i.id || void 0,
							children: [
								/* @__PURE__ */ (0, U.jsxs)("a", {
									href: r("verification", e.id, { result: o || void 0 }),
									"aria-current": e.id === i.id ? "true" : void 0,
									children: [
										/* @__PURE__ */ (0, U.jsx)("span", {
											className: "mono id",
											children: e.id
										}),
										/* @__PURE__ */ (0, U.jsx)("span", {
											className: "statement",
											children: e.name
										}),
										/* @__PURE__ */ (0, U.jsxs)("span", {
											className: "meta",
											children: [
												"for ",
												/* @__PURE__ */ (0, U.jsx)("span", {
													className: "mono",
													children: e.requirementId
												}),
												" · ",
												e.method,
												" · ",
												e.minLevel,
												"–",
												e.targetLevel,
												e.mandatory ? " · mandatory" : "",
												n ? ` · last run ${Ht(n.recordedAt)}` : ""
											]
										})
									]
								}),
								e.status && e.status !== "Active" && /* @__PURE__ */ (0, U.jsx)(W, { state: e.status }),
								t.isStale(e) && /* @__PURE__ */ (0, U.jsx)("span", {
									className: "pill",
									"data-tone": "warn",
									children: "Re-check"
								}),
								/* @__PURE__ */ (0, U.jsx)(Gt, { result: n?.result })
							]
						}, e.id);
					})
				}) : /* @__PURE__ */ (0, U.jsx)(Qt, {
					title: "No test cases match",
					children: "Add one with New test case, or from a requirement's “Verified by” section."
				})
			]
		}), m && /* @__PURE__ */ (0, U.jsx)(no, {
			testCase: m,
			onClose: () => a("verification", void 0, { result: o || void 0 })
		}, m.id)]
	});
}
function no({ testCase: e, onClose: t }) {
	let { ws: n, ix: r, session: i, open: a, link: o, run: s } = B(), c = String(e.status ?? "Active"), l = n.metamodel.recordAttributes.test_case, u = (t, n, r) => a(/* @__PURE__ */ (0, U.jsx)(Rn, {
		title: `${n} · ${e.id}`,
		submit: n,
		initial: r,
		decision: !0,
		onConfirm: async (n) => {
			await s("test_cases.setStatus", {
				id: e.id,
				status: t,
				expectedRevision: e.revision,
				reason: n
			}, `${e.id} is now ${t}`);
		}
	})), [d, f] = (0, _.useState)("runs"), p = r.runsOf(e.id), m = r.reqById.get(e.requirementId);
	return /* @__PURE__ */ (0, U.jsxs)("aside", {
		className: "detail",
		"aria-label": `Test case ${e.id}`,
		children: [
			/* @__PURE__ */ (0, U.jsxs)("header", {
				className: "detail-head",
				children: [/* @__PURE__ */ (0, U.jsxs)("div", {
					className: "detail-id",
					children: [
						/* @__PURE__ */ (0, U.jsx)("span", {
							className: "mono",
							children: e.id
						}),
						e.status && e.status !== "Active" && /* @__PURE__ */ (0, U.jsx)(W, { state: e.status }),
						/* @__PURE__ */ (0, U.jsxs)("span", {
							className: "muted small",
							children: ["revision ", e.revision]
						})
					]
				}), /* @__PURE__ */ (0, U.jsx)("button", {
					type: "button",
					className: "icon",
					"aria-label": "Close details",
					onClick: t,
					children: "×"
				})]
			}),
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "next-step",
				children: [
					/* @__PURE__ */ (0, U.jsx)(G, {
						disabledReason: !at(i) && "Viewers can read but not change records. Ask an administrator for editor access.",
						onClick: () => a(/* @__PURE__ */ (0, U.jsx)(Mn, { testCase: e })),
						children: "Record a result"
					}),
					c === "Draft" && /* @__PURE__ */ (0, U.jsx)(G, {
						disabledReason: !at(i) && "Viewers can read but not change records. Ask an administrator for editor access.",
						onClick: () => u("Active", "Activate", "Procedure reviewed and ready to count toward verification"),
						children: "Activate"
					}),
					c === "Active" && /* @__PURE__ */ (0, U.jsx)(G, {
						disabledReason: !at(i) && "Viewers can read but not change records. Ask an administrator for editor access.",
						onClick: () => u("Retired", "Retire", "Test case no longer applies"),
						children: "Retire"
					}),
					c === "Retired" && /* @__PURE__ */ (0, U.jsx)(G, {
						disabledReason: !at(i) && "Viewers can read but not change records. Ask an administrator for editor access.",
						onClick: () => u("Draft", "Back to draft", ""),
						children: "Back to draft"
					}),
					l.length > 0 && /* @__PURE__ */ (0, U.jsx)(G, {
						disabledReason: !at(i) && "Viewers can read but not change records. Ask an administrator for editor access.",
						onClick: () => a(/* @__PURE__ */ (0, U.jsx)(ro, { testCase: e })),
						children: "Edit attributes"
					}),
					/* @__PURE__ */ (0, U.jsx)("p", {
						className: "muted small next-hint",
						children: "Setup and build are carried over from the previous run."
					})
				]
			}),
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: "detail-body",
				children: [
					/* @__PURE__ */ (0, U.jsx)("p", {
						className: "statement-lg",
						children: e.name
					}),
					m && /* @__PURE__ */ (0, U.jsxs)("p", { children: [
						"Verifies ",
						/* @__PURE__ */ (0, U.jsx)("a", {
							href: o("requirements", m.id),
							children: /* @__PURE__ */ (0, U.jsx)("span", {
								className: "mono",
								children: m.id
							})
						}),
						" ",
						/* @__PURE__ */ (0, U.jsx)(W, { state: m.state }),
						r.isStale(e) && /* @__PURE__ */ (0, U.jsxs)("span", {
							className: "pill",
							"data-tone": "warn",
							title: `Written for Rev ${e.requirementRev ?? 1}; now Rev ${ht(m)}.`,
							children: [
								"Written for Rev ",
								e.requirementRev ?? 1,
								"; now Rev ",
								ht(m),
								" — re-check"
							]
						})
					] }),
					/* @__PURE__ */ (0, U.jsxs)("dl", {
						className: "facts",
						children: [
							/* @__PURE__ */ (0, U.jsx)("dt", { children: "Method" }),
							/* @__PURE__ */ (0, U.jsx)("dd", { children: e.method }),
							/* @__PURE__ */ (0, U.jsx)("dt", { children: "Levels" }),
							/* @__PURE__ */ (0, U.jsxs)("dd", { children: [
								e.minLevel,
								" minimum · ",
								e.targetLevel,
								" target"
							] }),
							/* @__PURE__ */ (0, U.jsx)("dt", { children: "Mandatory" }),
							/* @__PURE__ */ (0, U.jsx)("dd", { children: e.mandatory ? "Yes" : "No" })
						]
					}),
					/* @__PURE__ */ (0, U.jsx)(mn, {
						defs: l,
						values: e.attributes ?? {}
					}),
					/* @__PURE__ */ (0, U.jsxs)("section", { children: [/* @__PURE__ */ (0, U.jsx)("h3", { children: "Procedure and pass criteria" }), /* @__PURE__ */ (0, U.jsx)("p", {
						className: "prose",
						children: e.acceptanceCriteriaProcedure
					})] }),
					/* @__PURE__ */ (0, U.jsxs)("nav", {
						className: "tabs",
						children: [/* @__PURE__ */ (0, U.jsxs)("button", {
							type: "button",
							"aria-current": d === "runs" ? "page" : void 0,
							onClick: () => f("runs"),
							children: ["Runs ", p.length]
						}), /* @__PURE__ */ (0, U.jsx)("button", {
							type: "button",
							"aria-current": d === "history" ? "page" : void 0,
							onClick: () => f("history"),
							children: "History"
						})]
					}),
					d === "history" ? /* @__PURE__ */ (0, U.jsx)(ir, {
						recordId: e.id,
						recordKind: "test_case"
					}) : p.length ? /* @__PURE__ */ (0, U.jsx)("ol", {
						className: "timeline",
						children: p.map((e) => /* @__PURE__ */ (0, U.jsxs)("li", { children: [
							/* @__PURE__ */ (0, U.jsxs)("div", {
								className: "timeline-head",
								children: [
									/* @__PURE__ */ (0, U.jsx)(Gt, { result: e.result }),
									e.provenance?.historical && /* @__PURE__ */ (0, U.jsx)("span", {
										className: "pill",
										children: "Historical · imported"
									}),
									/* @__PURE__ */ (0, U.jsxs)("span", {
										className: "small",
										children: [
											e.coverage,
											" coverage · ",
											e.maturityLevel,
											" ",
											e.maturityName
										]
									}),
									/* @__PURE__ */ (0, U.jsxs)("span", {
										className: "muted small",
										title: e.testedAt ?? e.recordedAt,
										children: [
											/* @__PURE__ */ (0, U.jsx)(Gn, { id: e.testedBy ?? e.recordedBy }),
											" · ",
											Ht(e.testedAt ?? e.recordedAt)
										]
									})
								]
							}),
							e.evidenceSummary && /* @__PURE__ */ (0, U.jsx)("p", {
								className: "prose small-text",
								children: e.evidenceSummary
							}),
							(e.setup || e.buildCommit) && /* @__PURE__ */ (0, U.jsxs)("p", {
								className: "muted small",
								children: [e.setup, e.buildCommit && /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [" · ", /* @__PURE__ */ (0, U.jsx)("span", {
									className: "mono",
									children: String(e.buildCommit).slice(0, 12)
								})] })]
							}),
							e.evidenceUrl && /* @__PURE__ */ (0, U.jsx)("a", {
								href: e.evidenceUrl,
								target: "_blank",
								rel: "noreferrer",
								className: "small",
								children: "Open evidence ↗"
							})
						] }, e.id))
					}) : /* @__PURE__ */ (0, U.jsx)("p", {
						className: "muted",
						children: "No runs recorded yet."
					})
				]
			})
		]
	});
}
function ro({ testCase: e }) {
	let { ws: t, run: n, close: r } = B(), i = t.metamodel.recordAttributes.test_case, [a, o] = (0, _.useState)(() => rn(i, e.attributes ?? {})), [s, c] = (0, _.useState)("Test case attributes updated"), { patch: l, errors: u } = on(i, e.attributes ?? {}, a);
	return /* @__PURE__ */ (0, U.jsxs)(Sn, {
		title: `Attributes · ${e.id}`,
		submit: "Save attributes",
		onSubmit: async () => {
			if (Object.keys(u).length) throw Error("Check the attributes marked in red.");
			if (!Object.keys(l).length) throw Error("Nothing has changed yet.");
			await n("test_cases.update", {
				id: e.id,
				expectedRevision: e.revision,
				name: e.name,
				objective: e.objective ?? e.name,
				requirementId: e.requirementId,
				requirementRevision: e.requirementRevision,
				method: e.method,
				minLevel: e.minLevel,
				targetLevel: e.targetLevel,
				applicableLevels: e.applicableLevels,
				mandatory: e.mandatory,
				acceptanceCriteriaProcedure: e.acceptanceCriteriaProcedure,
				description: e.description ?? "",
				status: e.status ?? "Active",
				attributes: l,
				reason: s.trim() || "Test case attributes updated"
			}, `${e.id} attributes saved`), r();
		},
		children: [/* @__PURE__ */ (0, U.jsx)(fn, {
			idPrefix: "case-attr",
			defs: i,
			draft: a,
			onChange: o,
			errors: u
		}), /* @__PURE__ */ (0, U.jsx)(Cn, {
			value: s,
			onChange: c
		})]
	});
}
// client/src/App.tsx
var io = [
	{
		view: "home",
		hint: "What needs you",
		label: "Home",
		icon: /* @__PURE__ */ (0, U.jsx)("path", { d: "M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z" })
	},
	{
		view: "requirements",
		hint: "The specification",
		label: "Requirements",
		icon: /* @__PURE__ */ (0, U.jsx)("path", { d: "M5 4h14M5 9h14M5 14h9M5 19h9" })
	},
	{
		view: "verification",
		hint: "Tests and results",
		label: "Verification",
		icon: /* @__PURE__ */ (0, U.jsx)("path", { d: "m5 12 4 4 10-10" })
	},
	{
		view: "baselines",
		hint: "Frozen sets",
		label: "Baselines",
		icon: /* @__PURE__ */ (0, U.jsx)("path", { d: "M12 3 3 8l9 5 9-5zM3 13l9 5 9-5" })
	},
	{
		view: "library",
		hint: "Actors, use cases, documents",
		label: "Library",
		icon: /* @__PURE__ */ (0, U.jsx)("path", { d: "M5 4h4v16H5zM11 4h4v16h-4zM17 5l3 .8-3.5 14-3-.8" })
	}
], ao = /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [/* @__PURE__ */ (0, U.jsx)("circle", {
	cx: "12",
	cy: "12",
	r: "3"
}), /* @__PURE__ */ (0, U.jsx)("path", { d: "M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" })] }), oo = {
	home: "home",
	requirements: "requirements",
	trace: "requirements",
	flow: "requirements",
	verification: "verification",
	baselines: "baselines",
	library: "library",
	elements: "library",
	diagrams: "library",
	exchange: "settings",
	agents: "settings",
	datamodel: "settings",
	governance: "settings"
}, so = {
	requirements: {
		label: "Requirement views",
		tabs: [
			{
				view: "requirements",
				label: "Browse"
			},
			{
				view: "trace",
				label: "Trace"
			},
			{
				view: "flow",
				label: "Flow"
			}
		]
	},
	library: {
		label: "Library sections",
		tabs: [
			{
				view: "library",
				tab: "actors",
				label: "Actors"
			},
			{
				view: "library",
				tab: "use_cases",
				label: "Use cases"
			},
			{
				view: "library",
				tab: "documents",
				label: "Documents",
				short: "Docs"
			},
			{
				view: "elements",
				label: "Elements"
			},
			{
				view: "diagrams",
				label: "Diagrams"
			}
		]
	},
	settings: {
		label: "Settings sections",
		tabs: [
			{
				view: "agents",
				label: "Agent connections",
				short: "Agents"
			},
			{
				view: "exchange",
				label: "Data exchange (ReqIF)",
				short: "ReqIF"
			},
			{
				view: "datamodel",
				label: "Data model"
			},
			{
				view: "governance",
				label: "Governance"
			}
		]
	}
}, co = [
	"requirements",
	"testCases",
	"actors",
	"useCases",
	"baselines",
	"elements"
], lo = {
	home: [
		"requirements",
		"testCases",
		"executions",
		"baselines",
		"verification",
		"links"
	],
	requirements: [
		"requirements",
		"testCases",
		"executions",
		"verification"
	],
	trace: [
		"requirements",
		"testCases",
		"executions",
		"links"
	],
	flow: ["baselines"],
	verification: [
		"requirements",
		"testCases",
		"executions",
		"verification"
	],
	baselines: ["baselines", "requirements"],
	library: [
		"actors",
		"useCases",
		"links",
		"requirements"
	],
	elements: ["elements", "requirements"],
	diagrams: [],
	exchange: [],
	agents: [],
	datamodel: [],
	governance: []
}, uo = [
	{
		view: "home",
		label: "Home"
	},
	{
		view: "requirements",
		label: "Requirements"
	},
	{
		view: "trace",
		label: "Traceability"
	},
	{
		view: "flow",
		label: "Flow"
	},
	{
		view: "verification",
		label: "Verification"
	},
	{
		view: "baselines",
		label: "Baselines"
	},
	{
		view: "library",
		label: "Library"
	},
	{
		view: "diagrams",
		label: "Diagrams"
	},
	{
		view: "exchange",
		label: "Data exchange (ReqIF)"
	},
	{
		view: "agents",
		label: "Agent connections"
	},
	{
		view: "elements",
		label: "Elements"
	},
	{
		view: "datamodel",
		label: "Data model"
	},
	{
		view: "governance",
		label: "Governance"
	}
], fo = ({ children: e }) => /* @__PURE__ */ (0, U.jsx)("svg", {
	viewBox: "0 0 24 24",
	width: "18",
	height: "18",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "1.7",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	"aria-hidden": "true",
	children: e
});
function po({ scope: e, current: t, tab: n, section: r }) {
	let i = (0, _.useRef)(null), [a, o] = (0, _.useState)({
		left: !1,
		right: !1
	}), s = (0, _.useCallback)(() => {
		let e = i.current;
		if (!e) return;
		let t = e.scrollLeft > 2, n = e.scrollLeft + e.clientWidth < e.scrollWidth - 2;
		o((e) => e.left === t && e.right === n ? e : {
			left: t,
			right: n
		});
	}, []);
	return (0, _.useEffect)(() => {
		let e = i.current;
		if (!e) return;
		let t = e.querySelector("[aria-current=page]");
		return t && e.scrollWidth > e.clientWidth && (e.scrollLeft = Math.max(0, t.offsetLeft - (e.clientWidth - t.offsetWidth) / 2)), s(), window.addEventListener("resize", s), () => window.removeEventListener("resize", s);
	}, [
		t,
		n,
		s
	]), /* @__PURE__ */ (0, U.jsx)("nav", {
		ref: i,
		"aria-label": r.label,
		className: "tabs",
		"data-more-left": a.left || void 0,
		"data-more-right": a.right || void 0,
		onScroll: s,
		children: r.tabs.map((r) => /* @__PURE__ */ (0, U.jsx)("a", {
			href: Jn({
				scope: e,
				view: r.view
			}, r.tab ? { tab: r.tab } : void 0),
			"aria-current": r.view === t && (!r.tab || r.tab === n) ? "page" : void 0,
			"aria-label": r.short ? r.label : void 0,
			children: r.short ? /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [/* @__PURE__ */ (0, U.jsx)("span", {
				className: "tab-full",
				children: r.label
			}), /* @__PURE__ */ (0, U.jsx)("span", {
				className: "tab-short",
				"aria-hidden": "true",
				children: r.short
			})] }) : r.label
		}, r.label))
	});
}
function mo() {
	return /* @__PURE__ */ (0, U.jsxs)("div", {
		className: "brand",
		children: [/* @__PURE__ */ (0, U.jsx)("img", {
			className: "brand-logo",
			src: "/logo.png",
			alt: "",
			ref: _o
		}), /* @__PURE__ */ (0, U.jsxs)("span", {
			className: "brand-name",
			children: ["Plotune", /* @__PURE__ */ (0, U.jsx)("small", { children: "RMS" })]
		})]
	});
}
var ho = "/", go = (e) => {
	ho = e;
}, _o = (e) => {
	e && ho !== "/" && (e.src = ho + "logo.png");
}, vo = (e) => e.displayName || (/^\d+$/.test(e.id) ? `Account ${e.id}` : e.id);
function yo({ api: e, session: t, onDisconnect: n, chrome: r = "standalone", switcher: i, account: a }) {
	let o = qt(), [s, c] = Yn(), [l, u] = (0, _.useState)(ft), [d, f] = (0, _.useState)(!1), [p, m] = (0, _.useState)(""), [h, g] = (0, _.useState)(null), [v, y] = (0, _.useState)(!1), [b, x] = (0, _.useState)(() => {
		try {
			return window.localStorage.getItem("rms-rail") === "wide";
		} catch {
			return !1;
		}
	}), S = () => x((e) => {
		try {
			window.localStorage.setItem("rms-rail", e ? "slim" : "wide");
		} catch {}
		return !e;
	});
	(0, _.useEffect)(() => {
		Hn([], !!t.limits, {
			id: t.id,
			name: t.displayName
		});
	}, [t]), (0, _.useEffect)(() => {
		let n = !0;
		return e.command("people.list").then((e) => {
			n && Hn(e.items, !!t.limits, {
				id: t.id,
				name: t.displayName
			});
		}).catch(() => void 0), () => {
			n = !1;
		};
	}, [
		e,
		t,
		s.view,
		s.id
	]);
	let [C, w] = (0, _.useState)(/* @__PURE__ */ new Set()), T = (0, _.useRef)(/* @__PURE__ */ new Map()), E = (0, _.useRef)(/* @__PURE__ */ new Set()), D = (0, _.useRef)(/* @__PURE__ */ new Set()), O = (0, _.useCallback)(async () => {
		try {
			let t = await Et(e);
			u((e) => ({
				...e,
				...t
			})), m("");
		} catch (e) {
			z(e) || m(V(e, "The workspace could not be loaded."));
		} finally {
			f(!0);
		}
	}, [e]), k = (0, _.useCallback)((t, n = !1) => {
		if (!n && E.current.has(t)) return Promise.resolve();
		let r = T.current.get(t);
		if (r && !n) return r;
		let i = Dt(e, t).then((e) => {
			E.current.add(t), u((n) => {
				if (t !== "baselines") return {
					...n,
					[t]: e
				};
				let r = e.map((e) => {
					let t = n.baselines.find((t) => t.id === e.id && t.revision === e.revision);
					return t?.requirements && !e.requirements ? {
						...e,
						requirements: t.requirements
					} : (D.current.delete(String(e.id)), e);
				});
				return {
					...n,
					baselines: r
				};
			}), w(new Set(E.current));
		}).finally(() => {
			T.current.get(t) === i && T.current.delete(t);
		});
		return T.current.set(t, i), i;
	}, [e]), A = (0, _.useCallback)(async (e) => {
		try {
			await Promise.all(e.map((e) => k(e)));
		} catch (e) {
			z(e) || m(V(e, "The workspace could not be loaded."));
		}
	}, [k]), j = (0, _.useCallback)(async (t, n) => {
		if (!E.current.has("links")) try {
			let r = await Ot(e, t, n);
			u((e) => ({
				...e,
				links: r.reduce(kt, e.links)
			}));
		} catch (e) {
			if (!z(e)) throw e;
		}
	}, [e]), M = (0, _.useCallback)(async (t) => {
		let n = t.filter((e) => !D.current.has(e));
		for (let e of n) D.current.add(e);
		await Promise.all(n.map(async (t) => {
			try {
				let n = await e.command("baselines.get", { id: t });
				u((e) => ({
					...e,
					baselines: kt(e.baselines, n)
				}));
			} catch (e) {
				if (D.current.delete(t), !z(e)) throw e;
			}
		}));
	}, [e]), N = (0, _.useCallback)(async () => {
		try {
			await Promise.all([O(), ...[...E.current].map((e) => k(e, !0))]);
		} catch (e) {
			z(e) || m(V(e, "The workspace could not be loaded."));
		}
	}, [O, k]);
	(0, _.useEffect)(() => {
		O();
	}, [O]);
	let P = (0, _.useCallback)(async (t) => {
		if (E.current.has("verification")) for (let n of [...new Set(t)]) try {
			let t = await e.command("verification.evaluate", { requirementId: n });
			u((e) => ({
				...e,
				verification: e.verification.some((e) => e.requirementId === n) ? e.verification.map((e) => e.requirementId === n ? t : e) : [...e.verification, t]
			}));
		} catch {}
	}, [e]), F = (0, _.useMemo)(() => {
		let e = l.products.filter((e) => mt.includes(e.kind));
		return e.find((e) => e.kind === "product")?.id ?? e[0]?.id ?? l.products[0]?.id ?? "all";
	}, [l.products]), I = s.scope || F;
	(0, _.useEffect)(() => {
		d && !s.scope && !qn(window.location.hash).scope && c(Jn({
			scope: F,
			view: "home"
		}), !0);
	}, [
		d,
		s.scope,
		F,
		c
	]), (0, _.useEffect)(() => {
		let e = (e) => {
			(e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k" && (e.preventDefault(), y((e) => !e));
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, []);
	let ee = (0, _.useMemo)(() => Pt(l), [l]), te = Ft(l, I), ne = (0, _.useMemo)(() => lo[s.view], [s.view]);
	(0, _.useEffect)(() => {
		d && A(ne);
	}, [
		d,
		ne,
		A
	]), (0, _.useEffect)(() => {
		d && s.view === "requirements" && s.id && j("requirement", s.id).catch(() => void 0);
	}, [
		d,
		s.view,
		s.id,
		j
	]), (0, _.useEffect)(() => {
		d && s.view === "elements" && s.id && j("element", s.id).catch(() => void 0);
	}, [
		d,
		s.view,
		s.id,
		j
	]);
	let re = ne.every((e) => C.has(e)), ie = async (e, t) => {
		let n = At[e];
		if (e.startsWith("hierarchy.")) await k("requirements", !0);
		else if (e === "baselines.create" || e === "baselines.freeze") {
			let { requirements: e, ...n } = t;
			D.current.add(String(t.id)), E.current.has("baselines") && u((t) => ({
				...t,
				baselines: kt(t.baselines, {
					...n,
					requirements: e,
					memberCount: Array.isArray(e) ? e.length : n.memberCount
				})
			}));
		} else if (n && t?.id) {
			E.current.has(n) && u((r) => ({
				...r,
				[n]: kt(r[n], e === "requirements.create" ? {
					depth: 0,
					...t
				} : t)
			}));
			let r = e.startsWith("requirements.") ? [String(t.id)] : e.startsWith("test_cases.") || e === "test_executions.create" ? [String(t.requirementId)] : n === "links" && t.type === "verifies" ? [String(t.to)] : [];
			e === "test_cases.setStatus" && !E.current.has("links") ? await j("test_case", String(t.id)).catch(() => void 0) : e === "test_cases.setStatus" && await k("links", !0), await P(r);
		} else /^(external_documents|diagrams|connections|id_policies|reqif)\./.test(e) || await N();
	}, ae = {
		api: e,
		session: t,
		ws: l,
		ix: ee,
		scope: I,
		scopeRecord: te,
		route: s,
		refresh: N,
		ensure: A,
		ensureLinksOf: j,
		ensureBaselineMembers: M,
		loaded: C,
		link: (e, t, n) => Jn({
			scope: I,
			view: e,
			id: t
		}, n),
		go: (e, t, n, r) => c(Jn({
			scope: I,
			view: e,
			id: t
		}, n), r),
		open: (e) => {
			A(co), g(e);
		},
		close: () => g(null),
		run: async (t, n, r) => {
			try {
				let i = await e.command(t, n);
				return await ie(t, i), r && o(r), i;
			} catch (e) {
				if (!z(e)) throw e;
				return;
			}
		}
	}, oe = {
		home: /* @__PURE__ */ (0, U.jsx)(Ca, {}),
		requirements: /* @__PURE__ */ (0, U.jsx)(Qa, {}),
		trace: /* @__PURE__ */ (0, U.jsx)(eo, {}),
		flow: /* @__PURE__ */ (0, U.jsx)(pa, {}),
		verification: /* @__PURE__ */ (0, U.jsx)(to, {}),
		baselines: /* @__PURE__ */ (0, U.jsx)(Or, {}),
		library: /* @__PURE__ */ (0, U.jsx)(Ha, {}),
		elements: /* @__PURE__ */ (0, U.jsx)(ki, {}),
		diagrams: /* @__PURE__ */ (0, U.jsx)(hi, {}),
		exchange: /* @__PURE__ */ (0, U.jsx)(Wi, {}),
		agents: /* @__PURE__ */ (0, U.jsx)(gr, {}),
		datamodel: /* @__PURE__ */ (0, U.jsx)(Hr, {}),
		governance: /* @__PURE__ */ (0, U.jsx)(Xr, {})
	}, se = l.products.filter((e) => e.kind !== "release"), ce = so[oo[s.view]], le = i?.groups.find((e) => e.workspaceId === i.workspaceId), ue = le?.projects.find((e) => e.id === i?.projectId), de = se.find((e) => e.id === I)?.name ?? (I === "all" ? "All products" : I), fe = vo(t), pe = za(s), L = !at(t) && "Viewers can read but not change records. Ask an administrator for editor access.", R = oo[s.view] === "settings" || s.view === "diagrams" ? null : s.view === "baselines" ? {
		label: "Freeze a baseline",
		reason: !ot(t) && "Freezing a baseline needs the Product owner role.",
		dialog: /* @__PURE__ */ (0, U.jsx)(Nn, {})
	} : s.view === "verification" ? {
		label: "New test case",
		reason: L,
		dialog: /* @__PURE__ */ (0, U.jsx)(jn, {})
	} : s.view === "elements" ? {
		label: "New element",
		reason: L,
		dialog: /* @__PURE__ */ (0, U.jsx)(ji, {})
	} : s.view === "library" ? pe === "documents" ? {
		label: "New document",
		reason: L,
		dialog: /* @__PURE__ */ (0, U.jsx)(Xa, {})
	} : {
		label: pe === "actors" ? "New actor" : "New use case",
		reason: L,
		dialog: /* @__PURE__ */ (0, U.jsx)(qa, { kind: pe === "actors" ? "actor" : "use_case" })
	} : {
		label: "New requirement",
		reason: L,
		dialog: /* @__PURE__ */ (0, U.jsx)(wn, {})
	};
	return /* @__PURE__ */ (0, U.jsxs)(Xe.Provider, {
		value: ae,
		children: [
			/* @__PURE__ */ (0, U.jsxs)("div", {
				className: `shell${b ? " rail-wide" : ""}`,
				children: [/* @__PURE__ */ (0, U.jsxs)("aside", {
					className: "sidebar",
					children: [
						r !== "embedded" && /* @__PURE__ */ (0, U.jsx)(mo, {}),
						/* @__PURE__ */ (0, U.jsx)("button", {
							type: "button",
							className: "rail-toggle quiet",
							"aria-pressed": b,
							"aria-label": b ? "Collapse navigation" : "Expand navigation",
							title: b ? "Collapse navigation" : "Expand navigation",
							onClick: S,
							children: /* @__PURE__ */ (0, U.jsx)(fo, { children: /* @__PURE__ */ (0, U.jsx)("path", { d: b ? "m14 6-6 6 6 6" : "m10 6 6 6-6 6" }) })
						}),
						/* @__PURE__ */ (0, U.jsx)("nav", {
							"aria-label": "Workspace",
							className: "nav",
							children: io.map((e) => /* @__PURE__ */ (0, U.jsxs)("a", {
								href: Jn({
									scope: I,
									view: e.view
								}),
								"aria-current": s.view === e.view ? "page" : oo[s.view] === e.view ? "true" : void 0,
								title: b ? void 0 : e.label,
								children: [/* @__PURE__ */ (0, U.jsx)(fo, { children: e.icon }), /* @__PURE__ */ (0, U.jsxs)("span", {
									className: "nav-text",
									children: [/* @__PURE__ */ (0, U.jsx)("span", {
										className: "nav-label",
										children: e.label
									}), /* @__PURE__ */ (0, U.jsx)("small", { children: e.hint })]
								})]
							}, e.view))
						}),
						/* @__PURE__ */ (0, U.jsx)("div", {
							className: "sidebar-foot",
							children: /* @__PURE__ */ (0, U.jsx)("nav", {
								"aria-label": "Settings",
								className: "nav",
								children: /* @__PURE__ */ (0, U.jsxs)("a", {
									href: Jn({
										scope: I,
										view: "agents"
									}),
									"aria-current": oo[s.view] === "settings" ? s.view === "agents" ? "page" : "true" : void 0,
									children: [/* @__PURE__ */ (0, U.jsx)(fo, { children: ao }), /* @__PURE__ */ (0, U.jsxs)("span", {
										className: "nav-text",
										children: [/* @__PURE__ */ (0, U.jsx)("span", {
											className: "nav-label",
											children: "Settings"
										}), /* @__PURE__ */ (0, U.jsx)("small", { children: "Agents, exchange, data model, governance" })]
									})]
								})
							})
						})
					]
				}), /* @__PURE__ */ (0, U.jsxs)("div", {
					className: "workarea",
					children: [/* @__PURE__ */ (0, U.jsxs)("header", {
						className: "topbar",
						children: [
							/* @__PURE__ */ (0, U.jsxs)("div", {
								className: "crumbs",
								role: "group",
								"aria-label": "Context",
								children: [i && le && /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [
									i.manageHref ? /* @__PURE__ */ (0, U.jsx)("a", {
										className: "crumb",
										href: i.manageHref,
										title: "Workspace settings",
										children: le.workspaceName
									}) : /* @__PURE__ */ (0, U.jsx)("span", {
										className: "crumb",
										children: le.workspaceName
									}),
									/* @__PURE__ */ (0, U.jsx)("span", {
										className: "crumb-sep",
										"aria-hidden": "true",
										children: "/"
									}),
									/* @__PURE__ */ (0, U.jsx)(Yt, {
										className: "switcher",
										label: "Project",
										name: ue?.name ?? i.projectId,
										button: /* @__PURE__ */ (0, U.jsx)("span", {
											className: "crumb-value",
											children: ue?.name ?? i.projectId
										}),
										children: (e) => /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [i.groups.map((t) => /* @__PURE__ */ (0, U.jsxs)("div", {
											role: "group",
											"aria-label": t.workspaceName,
											children: [i.groups.length > 1 && /* @__PURE__ */ (0, U.jsx)("p", {
												className: "menu-group",
												children: t.workspaceName
											}), t.projects.map((n) => /* @__PURE__ */ (0, U.jsx)("button", {
												type: "button",
												role: "menuitemradio",
												"aria-checked": n.id === i.projectId,
												onClick: () => {
													e(), n.id !== i.projectId && i.onSelect(t.workspaceId, n.id);
												},
												children: n.name
											}, n.id))]
										}, t.workspaceId)), i.manageHref && /* @__PURE__ */ (0, U.jsx)("a", {
											role: "menuitem",
											className: "menu-foot",
											href: i.manageHref,
											children: "Workspace settings"
										})] })
									}),
									/* @__PURE__ */ (0, U.jsx)("span", {
										className: "crumb-sep",
										"aria-hidden": "true",
										children: "/"
									})
								] }), /* @__PURE__ */ (0, U.jsx)(Yt, {
									className: "scope",
									label: "Product",
									name: de,
									button: /* @__PURE__ */ (0, U.jsx)("span", {
										className: "crumb-value",
										children: de
									}),
									children: (e) => /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [
										se.map((t) => /* @__PURE__ */ (0, U.jsxs)("button", {
											type: "button",
											role: "menuitemradio",
											"aria-checked": t.id === I,
											onClick: () => {
												e(), c(Jn({
													scope: t.id,
													view: s.view
												}));
											},
											children: [t.name, t.kind !== "product" && /* @__PURE__ */ (0, U.jsx)("small", { children: Mt[t.kind] })]
										}, t.id)),
										!se.some((e) => e.id === I) && /* @__PURE__ */ (0, U.jsx)("button", {
											type: "button",
											role: "menuitemradio",
											"aria-checked": "true",
											onClick: e,
											children: de
										}),
										t.role === "admin" && /* @__PURE__ */ (0, U.jsx)("button", {
											type: "button",
											role: "menuitem",
											className: "menu-foot",
											onClick: () => {
												e(), g(/* @__PURE__ */ (0, U.jsx)(Pn, {}));
											},
											children: "New product or release"
										})
									] })
								})]
							}),
							ce && /* @__PURE__ */ (0, U.jsx)(po, {
								scope: I,
								current: s.view,
								tab: s.view === "library" ? za(s) : void 0,
								section: ce
							}),
							/* @__PURE__ */ (0, U.jsxs)("div", {
								className: "topbar-end",
								children: [
									/* @__PURE__ */ (0, U.jsxs)("button", {
										type: "button",
										className: "search-trigger",
										"aria-label": "Search",
										onClick: () => y(!0),
										children: [
											/* @__PURE__ */ (0, U.jsxs)(fo, { children: [/* @__PURE__ */ (0, U.jsx)("circle", {
												cx: "11",
												cy: "11",
												r: "7"
											}), /* @__PURE__ */ (0, U.jsx)("path", { d: "m20 20-3.5-3.5" })] }),
											/* @__PURE__ */ (0, U.jsx)("span", { children: "Search" }),
											/* @__PURE__ */ (0, U.jsx)("kbd", { children: "Ctrl K" })
										]
									}),
									l.products.length > 0 && R && /* @__PURE__ */ (0, U.jsxs)(G, {
										className: "primary new-req",
										title: R.label,
										disabledReason: R.reason,
										onClick: () => ae.open(R.dialog),
										children: [/* @__PURE__ */ (0, U.jsx)("span", {
											className: "plus",
											"aria-hidden": "true",
											children: "+"
										}), /* @__PURE__ */ (0, U.jsx)("span", {
											className: "new-req-label",
											children: R.label
										})]
									}),
									/* @__PURE__ */ (0, U.jsx)(Yt, {
										className: "me-menu",
										label: "Account",
										name: fe,
										button: /* @__PURE__ */ (0, U.jsx)("span", {
											className: "avatar",
											"aria-hidden": "true",
											children: fe.slice(0, 1).toUpperCase()
										}),
										children: (e) => /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [
											/* @__PURE__ */ (0, U.jsxs)("div", {
												className: "me",
												children: [/* @__PURE__ */ (0, U.jsx)("strong", { children: fe }), /* @__PURE__ */ (0, U.jsx)("small", { children: it[t.role] ?? t.role })]
											}),
											a?.links ? a.links.map((e) => /* @__PURE__ */ (0, U.jsx)("a", {
												role: "menuitem",
												href: e.href,
												children: e.label
											}, e.href + e.label)) : i && /* @__PURE__ */ (0, U.jsxs)(U.Fragment, { children: [
												/* @__PURE__ */ (0, U.jsx)("a", {
													role: "menuitem",
													href: "/profile",
													children: "Profile"
												}),
												/* @__PURE__ */ (0, U.jsx)("a", {
													role: "menuitem",
													href: "/workspaces",
													children: "All workspaces"
												}),
												/* @__PURE__ */ (0, U.jsx)("a", {
													role: "menuitem",
													href: "/dashboard",
													children: "Dashboard"
												})
											] }),
											a?.onSignOut && /* @__PURE__ */ (0, U.jsx)("button", {
												type: "button",
												role: "menuitem",
												onClick: () => {
													e(), a.onSignOut?.();
												},
												children: "Log out"
											}),
											n && /* @__PURE__ */ (0, U.jsx)("button", {
												type: "button",
												role: "menuitem",
												onClick: () => {
													e(), n();
												},
												children: "Sign out"
											})
										] })
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, U.jsx)("main", {
						id: "main",
						className: "main",
						tabIndex: -1,
						children: d ? p ? /* @__PURE__ */ (0, U.jsxs)("div", {
							className: "page",
							children: [/* @__PURE__ */ (0, U.jsx)("p", {
								className: "error",
								role: "alert",
								children: p
							}), /* @__PURE__ */ (0, U.jsx)("button", {
								onClick: () => void N(),
								children: "Try again"
							})]
						}) : l.products.length ? re ? oe[s.view] : /* @__PURE__ */ (0, U.jsx)("p", {
							className: "loading",
							role: "status",
							children: "Loading…"
						}) : /* @__PURE__ */ (0, U.jsx)(bo, {}) : /* @__PURE__ */ (0, U.jsx)("p", {
							className: "loading",
							role: "status",
							children: "Loading workspace…"
						})
					})]
				})]
			}),
			v && /* @__PURE__ */ (0, U.jsx)(xo, { onClose: () => y(!1) }),
			h
		]
	});
}
function bo() {
	let { session: e, open: t } = B();
	return /* @__PURE__ */ (0, U.jsx)("div", {
		className: "page",
		children: /* @__PURE__ */ (0, U.jsxs)("div", {
			className: "empty big",
			children: [
				/* @__PURE__ */ (0, U.jsx)("h2", { children: "Welcome to Plotune RMS" }),
				/* @__PURE__ */ (0, U.jsx)("p", { children: "Start by creating the product you are specifying. Requirements, tests and baselines all live under a product." }),
				e.role === "admin" ? /* @__PURE__ */ (0, U.jsx)("button", {
					className: "primary",
					onClick: () => t(/* @__PURE__ */ (0, U.jsx)(Pn, {})),
					children: "Create a product"
				}) : /* @__PURE__ */ (0, U.jsx)("p", {
					className: "muted",
					children: "Ask an administrator to create the first product."
				})
			]
		})
	});
}
function xo({ onClose: e }) {
	let { ws: t, go: n, open: r, session: i, scope: a, ensure: o } = B();
	(0, _.useEffect)(() => {
		o([
			"requirements",
			"testCases",
			"useCases",
			"actors",
			"baselines",
			"elements"
		]);
	}, [o]);
	let [s, c] = (0, _.useState)(""), [l, u] = (0, _.useState)(0), d = (0, _.useRef)(null);
	(0, _.useEffect)(() => {
		d.current?.focus();
	}, []);
	let f = s.trim().toLowerCase(), p = [
		...at(i) ? [{
			key: "a:new",
			label: "New requirement",
			meta: "Action",
			go: () => r(/* @__PURE__ */ (0, U.jsx)(wn, {}))
		}] : [],
		...uo.map((e) => ({
			key: `n:${e.view}`,
			label: `Go to ${e.label}`,
			meta: "Navigate",
			go: () => n(e.view)
		})),
		...t.products.filter((e) => e.id !== a && e.kind !== "release").map((e) => ({
			key: `p:${e.id}`,
			label: `Switch to ${e.name}`,
			meta: Mt[e.kind],
			go: () => {
				window.location.hash = Jn({
					scope: e.id,
					view: "home"
				});
			}
		}))
	], m = [
		...t.requirements.map((e) => ({
			key: `r:${e.id}`,
			label: `${e.id} — ${e.statement}`,
			meta: `Requirement · ${e.state}`,
			go: () => n("requirements", e.id)
		})),
		...t.testCases.map((e) => ({
			key: `t:${e.id}`,
			label: `${e.id} — ${e.name}`,
			meta: "Test case",
			go: () => n("verification", e.id)
		})),
		...t.useCases.map((e) => ({
			key: `u:${e.id}`,
			label: `${e.id} — ${e.name}`,
			meta: e.state === "Retired" ? "Use case · Retired" : "Use case",
			go: () => n("library", e.id, { tab: "use_cases" })
		})),
		...t.actors.map((e) => ({
			key: `c:${e.id}`,
			label: `${e.id} — ${e.name}`,
			meta: e.state === "Retired" ? "Actor · Retired" : "Actor",
			go: () => n("library", e.id, { tab: "actors" })
		})),
		...t.baselines.map((e) => ({
			key: `b:${e.id}`,
			label: `${e.id} — ${e.name}`,
			meta: "Baseline",
			go: () => n("baselines", e.id)
		})),
		...t.elements.map((e) => ({
			key: `e:${e.id}`,
			label: `${e.id} — ${e.name}`,
			meta: "Element",
			go: () => n("elements", e.id)
		}))
	], h = (f ? [...p, ...m].filter((e) => e.label.toLowerCase().includes(f)) : p).slice(0, 12), g = (t) => {
		t && (e(), t.go());
	};
	return /* @__PURE__ */ (0, U.jsx)("div", {
		className: "palette-backdrop",
		onMouseDown: e,
		children: /* @__PURE__ */ (0, U.jsxs)("div", {
			className: "palette",
			role: "dialog",
			"aria-label": "Search and commands",
			onMouseDown: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, U.jsx)("input", {
				ref: d,
				role: "combobox",
				"aria-expanded": "true",
				"aria-controls": "palette-list",
				"aria-label": "Search records or type a command",
				placeholder: "Search requirements, tests, use cases… or type a command",
				value: s,
				onChange: (e) => {
					c(e.currentTarget.value), u(0);
				},
				onKeyDown: (t) => {
					t.key === "Escape" ? e() : t.key === "ArrowDown" ? (t.preventDefault(), u((e) => Math.min(h.length - 1, e + 1))) : t.key === "ArrowUp" ? (t.preventDefault(), u((e) => Math.max(0, e - 1))) : t.key === "Enter" && (t.preventDefault(), g(h[l]));
				}
			}), /* @__PURE__ */ (0, U.jsxs)("ul", {
				id: "palette-list",
				role: "listbox",
				children: [h.map((e, t) => /* @__PURE__ */ (0, U.jsxs)("li", {
					role: "option",
					"aria-selected": t === l,
					onMouseEnter: () => u(t),
					onMouseDown: (t) => {
						t.preventDefault(), g(e);
					},
					children: [/* @__PURE__ */ (0, U.jsx)("span", {
						className: "clamp",
						children: e.label
					}), /* @__PURE__ */ (0, U.jsx)("small", { children: e.meta })]
				}, e.key)), !h.length && /* @__PURE__ */ (0, U.jsxs)("li", {
					className: "picker-empty",
					children: [
						"Nothing found for “",
						s,
						"”."
					]
				})]
			})]
		})
	});
}
// client/src/embed.tsx
function So({ apiBase: e, getClaim: t, projectId: n, frames: r, chrome: i = "standalone", switcher: a, account: o, onSessionEnd: s, onError: c }) {
	let [l, u] = (0, _.useState)(null), [d, f] = (0, _.useState)(""), p = e.replace(/\/+$/, ""), m = (0, _.useRef)({
		getClaim: t,
		onSessionEnd: s,
		onError: c
	});
	m.current = {
		getClaim: t,
		onSessionEnd: s,
		onError: c
	};
	let h = (0, _.useMemo)(() => {
		let e = !1;
		return Ye("", () => {
			e || (e = !0, m.current.onSessionEnd ? m.current.onSessionEnd() : f("Your session expired. Reload the page to continue."));
		}, () => !0, {
			base: p,
			getClaim: (e) => m.current.getClaim(e),
			frames: r
		});
	}, [
		p,
		n,
		r
	]);
	return (0, _.useEffect)(() => {
		let e = !0;
		return u(null), f(""), h.session().then((t) => {
			e && u(t);
		}).catch((t) => {
			if (!e || z(t) || t instanceof qe && t.status === 401) return;
			let n = t instanceof Error ? t : Error(String(t));
			m.current.onError ? m.current.onError(n) : f(V(t, "RMS could not be opened."));
		}), () => {
			e = !1;
		};
	}, [h]), d ? /* @__PURE__ */ (0, U.jsx)("main", {
		id: "main",
		className: "gate",
		children: /* @__PURE__ */ (0, U.jsx)("div", {
			className: "gate-card",
			children: /* @__PURE__ */ (0, U.jsx)("p", {
				className: "error",
				role: "alert",
				children: d
			})
		})
	}) : l ? /* @__PURE__ */ (0, U.jsx)(yo, {
		api: h,
		session: l,
		chrome: i,
		switcher: a,
		account: o
	}, `${p}|${n}`) : /* @__PURE__ */ (0, U.jsx)("main", {
		id: "main",
		className: "gate",
		children: /* @__PURE__ */ (0, U.jsx)("p", {
			className: "loading",
			role: "status",
			children: "Opening RMS…"
		})
	});
}
function Co(e, t) {
	go(t.assetBase ?? new URL("../", "" + import.meta.url).href), e.classList.add("rms-mount");
	let n = (0, v.createRoot)(e);
	return n.render(/* @__PURE__ */ (0, U.jsx)(_.StrictMode, { children: /* @__PURE__ */ (0, U.jsx)("div", {
		className: "rms-root",
		children: /* @__PURE__ */ (0, U.jsx)(Jt, { children: /* @__PURE__ */ (0, U.jsx)(So, { ...t }) })
	}) })), { unmount: () => {
		n.unmount(), e.classList.remove("rms-mount");
	} };
}
export { Co as mount };
