(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/context/AuthContext.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2d$4NFEPWkC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$__as__onAuthStateChanged$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index-4NFEPWkC.js [app-client] (ecmascript) <export _ as onAuthStateChanged>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2d$4NFEPWkC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__af__as__signInWithEmailAndPassword$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index-4NFEPWkC.js [app-client] (ecmascript) <export af as signInWithEmailAndPassword>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2d$4NFEPWkC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__ak__as__signOut$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index-4NFEPWkC.js [app-client] (ecmascript) <export ak as signOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebaseClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebaseClient.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function AuthProvider({ children }) {
    _s();
    const [firebaseUser, setFirebaseUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [profile, setProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // staff_profiles doc: { email, role, name }
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [authError, setAuthError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // Auth initialization with guard for missing Firebase config
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebaseClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirebaseAuth"])();
            if (!auth) {
                // No Firebase config, skip auth listener
                setLoading(false);
                return;
            }
            const unsub = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2d$4NFEPWkC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$__as__onAuthStateChanged$3e$__["onAuthStateChanged"])(auth, {
                "AuthProvider.useEffect.unsub": async (user)=>{
                    setFirebaseUser(user);
                    if (user) {
                        try {
                            const token = await user.getIdToken();
                            const res = await fetch("/api/auth/me", {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            });
                            if (res.ok) {
                                setProfile(await res.json());
                                setAuthError("");
                            } else if (res.status === 401) {
                                // Token invalid or expired – sign out the user
                                setAuthError("Session expired, please sign in again.");
                                setProfile(null);
                                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2d$4NFEPWkC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__ak__as__signOut$3e$__["signOut"])(auth);
                            } else if (res.status === 403) {
                                setAuthError("This account has no ParkPay staff profile provisioned yet.");
                                setProfile(null);
                            } else {
                                setProfile(null);
                            }
                        } catch  {
                            setProfile(null);
                        }
                    } else {
                        setProfile(null);
                    }
                    setLoading(false);
                }
            }["AuthProvider.useEffect.unsub"]);
            return unsub;
        }
    }["AuthProvider.useEffect"], []);
    async function login(email, password) {
        setAuthError("");
        const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebaseClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirebaseAuth"])();
        if (!auth) throw new Error("Firebase not configured");
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2d$4NFEPWkC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__af__as__signInWithEmailAndPassword$3e$__["signInWithEmailAndPassword"])(auth, email, password);
    }
    async function logout() {
        const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebaseClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirebaseAuth"])();
        if (!auth) return;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2d$4NFEPWkC$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__ak__as__signOut$3e$__["signOut"])(auth);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            firebaseUser,
            profile,
            loading,
            authError,
            login,
            logout
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/AuthContext.jsx",
        lineNumber: 68,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "cjhQ1YKt56kH0xX7qLsWHvtFbQ0=");
_c = AuthProvider;
function useAuth() {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
}
_s1(useAuth, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/firebaseClient.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getFirebaseAuth",
    ()=>getFirebaseAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * Firebase Client SDK — browser-side only (used for the login form to sign
 * the user in and obtain an ID token, which is then sent as a Bearer token
 * on every API request).
 *
 * Requires the NEXT_PUBLIC_FIREBASE_* values from your Firebase web app
 * config — see .env.example. These are safe to expose to the browser (that
 * is how Firebase web apps are meant to be configured); they are not secret
 * credentials on their own.
 *
 * Initialized lazily (on first use, not at module import time) so the app
 * can still be built/prerendered without real Firebase config present.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
;
;
let _auth;
function getFirebaseAuth() {
    if (_auth) return _auth;
    const firebaseConfig = {
        apiKey: ("TURBOPACK compile-time value", ""),
        authDomain: ("TURBOPACK compile-time value", ""),
        projectId: ("TURBOPACK compile-time value", ""),
        appId: ("TURBOPACK compile-time value", "")
    };
    if ("TURBOPACK compile-time truthy", 1) {
        console.warn('Firebase configuration missing. Skipping Firebase initialization.');
        return null;
    }
    //TURBOPACK unreachable
    ;
    const app = undefined;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_056n6t2._.js.map