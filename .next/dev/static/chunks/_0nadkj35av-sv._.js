(()=>{"use strict";(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/@paypal/react-paypal-js/dist/esm/react-paypal-js.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BraintreePayPalButtons",
    ()=>BraintreePayPalButtons,
    "DISPATCH_ACTION",
    ()=>DISPATCH_ACTION,
    "FUNDING",
    ()=>FUNDING,
    "PAYPAL_HOSTED_FIELDS_TYPES",
    ()=>PAYPAL_HOSTED_FIELDS_TYPES,
    "PayPalButtons",
    ()=>PayPalButtons,
    "PayPalCVVField",
    ()=>PayPalCVVField,
    "PayPalCardFieldsContext",
    ()=>PayPalCardFieldsContext,
    "PayPalCardFieldsForm",
    ()=>PayPalCardFieldsForm,
    "PayPalCardFieldsProvider",
    ()=>PayPalCardFieldsProvider,
    "PayPalExpiryField",
    ()=>PayPalExpiryField,
    "PayPalHostedField",
    ()=>PayPalHostedField,
    "PayPalHostedFieldsProvider",
    ()=>PayPalHostedFieldsProvider,
    "PayPalMarks",
    ()=>PayPalMarks,
    "PayPalMessages",
    ()=>PayPalMessages,
    "PayPalNameField",
    ()=>PayPalNameField,
    "PayPalNumberField",
    ()=>PayPalNumberField,
    "PayPalScriptProvider",
    ()=>PayPalScriptProvider,
    "SCRIPT_LOADING_STATE",
    ()=>SCRIPT_LOADING_STATE,
    "ScriptContext",
    ()=>ScriptContext,
    "destroySDKScript",
    ()=>destroySDKScript,
    "getScriptID",
    ()=>getScriptID,
    "scriptReducer",
    ()=>scriptReducer,
    "usePayPalCardFields",
    ()=>usePayPalCardFields,
    "usePayPalHostedFields",
    ()=>usePayPalHostedFields,
    "usePayPalScriptReducer",
    ()=>usePayPalScriptReducer,
    "useScriptProviderContext",
    ()=>useScriptProviderContext
]);
/*!
 * react-paypal-js v10.6.0 (2026-10-05T16:18:52.115Z)
 * Copyright 2020-present, PayPal, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
/**
 * Enum for the SDK script resolve status,
 *
 * @enum {string}
 */ var SCRIPT_LOADING_STATE;
(function(SCRIPT_LOADING_STATE) {
    SCRIPT_LOADING_STATE["INITIAL"] = "initial";
    SCRIPT_LOADING_STATE["PENDING"] = "pending";
    SCRIPT_LOADING_STATE["REJECTED"] = "rejected";
    SCRIPT_LOADING_STATE["RESOLVED"] = "resolved";
})(SCRIPT_LOADING_STATE || (SCRIPT_LOADING_STATE = {}));
/**
 * Enum for the PayPalScriptProvider context dispatch actions
 *
 * @enum {string}
 */ var DISPATCH_ACTION;
(function(DISPATCH_ACTION) {
    DISPATCH_ACTION["LOADING_STATUS"] = "setLoadingStatus";
    DISPATCH_ACTION["RESET_OPTIONS"] = "resetOptions";
    DISPATCH_ACTION["SET_BRAINTREE_INSTANCE"] = "braintreeInstance";
})(DISPATCH_ACTION || (DISPATCH_ACTION = {}));
/**
 * Enum for all the available hosted fields
 *
 * @enum {string}
 */ var PAYPAL_HOSTED_FIELDS_TYPES;
(function(PAYPAL_HOSTED_FIELDS_TYPES) {
    PAYPAL_HOSTED_FIELDS_TYPES["NUMBER"] = "number";
    PAYPAL_HOSTED_FIELDS_TYPES["CVV"] = "cvv";
    PAYPAL_HOSTED_FIELDS_TYPES["EXPIRATION_DATE"] = "expirationDate";
    PAYPAL_HOSTED_FIELDS_TYPES["EXPIRATION_MONTH"] = "expirationMonth";
    PAYPAL_HOSTED_FIELDS_TYPES["EXPIRATION_YEAR"] = "expirationYear";
    PAYPAL_HOSTED_FIELDS_TYPES["POSTAL_CODE"] = "postalCode";
})(PAYPAL_HOSTED_FIELDS_TYPES || (PAYPAL_HOSTED_FIELDS_TYPES = {}));
var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(d, b) {
        d.__proto__ = b;
    } || function(d, b) {
        for(var p in b)if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
    };
    return extendStatics(d, b);
};
function __extends(d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for(var s, i = 1, n = arguments.length; i < n; i++){
            s = arguments[i];
            for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
function __rest$1(s, e) {
    var t = {};
    for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for(var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++){
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
}
function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for(var i = 0, l = from.length, ar; i < l; i++){
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}
typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
/*********************************************
 * Common reference to the script identifier *
 *********************************************/ // keep this script id value in kebab-case format
var SCRIPT_ID = "data-react-paypal-script-id";
var SDK_SETTINGS = {
    DATA_CLIENT_TOKEN: "dataClientToken",
    DATA_JS_SDK_LIBRARY: "dataJsSdkLibrary",
    DATA_LIBRARY_VALUE: "react-paypal-js",
    DATA_NAMESPACE: "dataNamespace",
    DATA_SDK_INTEGRATION_SOURCE: "dataSdkIntegrationSource",
    DATA_USER_ID_TOKEN: "dataUserIdToken"
};
var LOAD_SCRIPT_ERROR = "Failed to load the PayPal JS SDK script.";
/****************************
 * Braintree error messages *
 ****************************/ var EMPTY_BRAINTREE_AUTHORIZATION_ERROR_MESSAGE = "Invalid authorization data. Use dataClientToken or dataUserIdToken to authorize.";
var braintreeVersion = "3.117.0";
var BRAINTREE_SOURCE = "https://js.braintreegateway.com/web/".concat(braintreeVersion, "/js/client.min.js");
var BRAINTREE_PAYPAL_CHECKOUT_SOURCE = "https://js.braintreegateway.com/web/".concat(braintreeVersion, "/js/paypal-checkout.min.js");
/*********************
 * PayPal namespaces *
 *********************/ var DEFAULT_PAYPAL_NAMESPACE = "paypal";
var DEFAULT_BRAINTREE_NAMESPACE = "braintree";
/*****************
 * Hosted Fields *
 *****************/ var HOSTED_FIELDS_CHILDREN_ERROR = "To use HostedFields you must use it with at least 3 children with types: [number, cvv, expirationDate] includes";
var HOSTED_FIELDS_DUPLICATE_CHILDREN_ERROR = "Cannot use duplicate HostedFields as children";
/*******************
 * Script Provider *
 *******************/ var SCRIPT_PROVIDER_REDUCER_ERROR = "usePayPalScriptReducer must be used within a PayPalScriptProvider";
var CARD_FIELDS_DUPLICATE_CHILDREN_ERROR = "Cannot use duplicate CardFields as children";
var CARD_FIELDS_CONTEXT_ERROR = "Individual CardFields must be rendered inside the PayPalCardFieldsProvider";
/**
 * Get the namespace from the window in the browser
 * this is useful to get the paypal object from window
 * after load PayPal SDK script
 *
 * @param namespace the name space to return
 * @returns the namespace if exists or undefined otherwise
 */ function getPayPalWindowNamespace$1(namespace) {
    if (namespace === void 0) {
        namespace = DEFAULT_PAYPAL_NAMESPACE;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return window[namespace];
}
/**
 * Get a namespace from the window in the browser
 * this is useful to get the braintree from window
 * after load Braintree script
 *
 * @param namespace the name space to return
 * @returns the namespace if exists or undefined otherwise
 */ function getBraintreeWindowNamespace(namespace) {
    if (namespace === void 0) {
        namespace = DEFAULT_BRAINTREE_NAMESPACE;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return window[namespace];
}
/**
 * Creates a string hash code based on the string argument
 *
 * @param str the source input string to hash
 * @returns string hash code
 */ function hashStr(str) {
    var hash = "";
    for(var i = 0; i < str.length; i++){
        var total = str[i].charCodeAt(0) * i;
        if (str[i + 1]) {
            total += str[i + 1].charCodeAt(0) * (i - 1);
        }
        hash += String.fromCharCode(97 + Math.abs(total) % 26);
    }
    return hash;
}
/**
 * Read an own property from an options object, ignoring any value inherited
 * from the prototype chain, to prevent prototype-polluted values (CWE-1321)
 * from being silently accepted when the caller's options object omits the
 * property. Local copy of the equivalent helper in @paypal/paypal-js's
 * src/utils.ts, which isn't exported from that package's public entry points.
 */ function getOwnProperty$1(options, key) {
    return Object.prototype.hasOwnProperty.call(options, key) ? options[key] : undefined;
}
function generateErrorMessage(_a) {
    var reactComponentName = _a.reactComponentName, sdkComponentKey = _a.sdkComponentKey, _b = _a.sdkRequestedComponents, sdkRequestedComponents = _b === void 0 ? "" : _b, _c = _a.sdkDataNamespace, sdkDataNamespace = _c === void 0 ? DEFAULT_PAYPAL_NAMESPACE : _c;
    var requiredOptionCapitalized = sdkComponentKey.charAt(0).toUpperCase().concat(sdkComponentKey.substring(1));
    var errorMessage = "Unable to render <".concat(reactComponentName, " /> because window.").concat(sdkDataNamespace, ".").concat(requiredOptionCapitalized, " is undefined.");
    // The JS SDK only loads the buttons component by default.
    // All other components like messages and marks must be requested using the "components" query parameter
    var requestedComponents = typeof sdkRequestedComponents === "string" ? sdkRequestedComponents : sdkRequestedComponents.join(",");
    if (!requestedComponents.includes(sdkComponentKey)) {
        var expectedComponents = [
            requestedComponents,
            sdkComponentKey
        ].filter(Boolean).join();
        errorMessage += "\nTo fix the issue, add '".concat(sdkComponentKey, "' to the list of components passed to the parent PayPalScriptProvider:") + "\n`<PayPalScriptProvider options={{ components: '".concat(expectedComponents, "'}}>`.");
    }
    return errorMessage;
}
/**
 * Generate a new random identifier for react-paypal-js
 *
 * @returns the {@code string} containing the random library name
 */ function getScriptID(options) {
    // exclude the data-react-paypal-script-id value from the options hash
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    var _a = options, _b = SCRIPT_ID;
    _a[_b];
    var paypalScriptOptions = __rest$1(_a, [
        _b + ""
    ]);
    return "react-paypal-js-".concat(hashStr(JSON.stringify(paypalScriptOptions)));
}
/**
 * Destroy the PayPal SDK from the document page
 *
 * @param reactPayPalScriptID the script identifier
 */ function destroySDKScript(reactPayPalScriptID) {
    var scriptNode = self.document.querySelector("script[".concat(SCRIPT_ID, "=\"").concat(reactPayPalScriptID, "\"]"));
    if (scriptNode === null || scriptNode === void 0 ? void 0 : scriptNode.parentNode) {
        scriptNode.parentNode.removeChild(scriptNode);
    }
}
/**
 * Reducer function to handle complex state changes on the context
 *
 * @param state  the current state on the context object
 * @param action the action to be executed on the previous state
 * @returns a the same state if the action wasn't found, or a new state otherwise
 */ function scriptReducer(state, action) {
    var _a, _b;
    switch(action.type){
        case DISPATCH_ACTION.LOADING_STATUS:
            if (typeof action.value === "object") {
                return __assign(__assign({}, state), {
                    loadingStatus: action.value.state,
                    loadingStatusErrorMessage: action.value.message
                });
            }
            return __assign(__assign({}, state), {
                loadingStatus: action.value
            });
        case DISPATCH_ACTION.RESET_OPTIONS:
            // destroy existing script to make sure only one script loads at a time
            destroySDKScript(state.options[SCRIPT_ID]);
            return __assign(__assign({}, state), {
                loadingStatus: SCRIPT_LOADING_STATE.PENDING,
                options: __assign(__assign((_a = {}, _a[SDK_SETTINGS.DATA_SDK_INTEGRATION_SOURCE] = SDK_SETTINGS.DATA_LIBRARY_VALUE, _a), action.value), (_b = {}, _b[SCRIPT_ID] = "".concat(getScriptID(action.value)), _b))
            });
        case DISPATCH_ACTION.SET_BRAINTREE_INSTANCE:
            return __assign(__assign({}, state), {
                braintreePayPalCheckoutInstance: action.value
            });
        default:
            {
                return state;
            }
    }
}
// Create the React context to use in the script provider component
var ScriptContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
/**
 * Check if the context is valid and ready to dispatch actions.
 *
 * @param scriptContext the result of connecting to the context provider
 * @returns strict context avoiding null values in the type
 */ function validateReducer(scriptContext) {
    if (typeof (scriptContext === null || scriptContext === void 0 ? void 0 : scriptContext.dispatch) === "function" && scriptContext.dispatch.length !== 0) {
        return scriptContext;
    }
    throw new Error(SCRIPT_PROVIDER_REDUCER_ERROR);
}
/**
 * Check if the dataClientToken or the dataUserIdToken are
 * set in the options of the context.
 * @type dataClientToken is use to pass a client token
 * @type dataUserIdToken is use to pass a client tokenization key
 *
 * @param scriptContext the result of connecting to the context provider
 * @throws an {@link Error} if both dataClientToken and the dataUserIdToken keys are null or undefined
 * @returns strict context if one of the keys are defined
 */ var validateBraintreeAuthorizationData = function(scriptContext) {
    var _a, _b;
    if (!((_a = scriptContext === null || scriptContext === void 0 ? void 0 : scriptContext.options) === null || _a === void 0 ? void 0 : _a[SDK_SETTINGS.DATA_CLIENT_TOKEN]) && !((_b = scriptContext === null || scriptContext === void 0 ? void 0 : scriptContext.options) === null || _b === void 0 ? void 0 : _b[SDK_SETTINGS.DATA_USER_ID_TOKEN])) {
        throw new Error(EMPTY_BRAINTREE_AUTHORIZATION_ERROR_MESSAGE);
    }
    return scriptContext;
};
/**
 * Custom hook to get access to the Script context and
 * dispatch actions to modify the state on the {@link ScriptProvider} component
 *
 * @returns a tuple containing the state of the context and
 * a dispatch function to modify the state
 */ function usePayPalScriptReducer() {
    var scriptContext = validateReducer((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ScriptContext));
    var derivedStatusContext = __assign(__assign({}, scriptContext), {
        isInitial: scriptContext.loadingStatus === SCRIPT_LOADING_STATE.INITIAL,
        isPending: scriptContext.loadingStatus === SCRIPT_LOADING_STATE.PENDING,
        isResolved: scriptContext.loadingStatus === SCRIPT_LOADING_STATE.RESOLVED,
        isRejected: scriptContext.loadingStatus === SCRIPT_LOADING_STATE.REJECTED
    });
    return [
        derivedStatusContext,
        scriptContext.dispatch
    ];
}
/**
 * Custom hook to get access to the ScriptProvider context
 *
 * @returns the latest state of the context
 */ function useScriptProviderContext() {
    var scriptContext = validateBraintreeAuthorizationData(validateReducer((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ScriptContext)));
    return [
        scriptContext,
        scriptContext.dispatch
    ];
}
// Create the React context to use in the PayPal hosted fields provider
var PayPalHostedFieldsContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({});
/**
 * Custom hook to get access to the PayPal Hosted Fields instance.
 * The instance represent the returned object after the render process
 * With this object a user can submit the fields and dynamically modify the cards
 *
 * @returns the hosted fields instance if is available in the component
 */ function usePayPalHostedFields() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(PayPalHostedFieldsContext);
}
/**
 * `useProxyProps` can be used to maintain a reference to an updated props, without that change triggering
 * another re-render. This is useful if, for example, some props should be passed through a parent component to
 * a child function that contains code that needs the most up-to-date-reference, without causing the parent to
 * rerender.
 */ function useProxyProps(props) {
    var proxyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Proxy({}, {
        get: {
            "useProxyProps.useRef[proxyRef]": function(target, prop, receiver) {
                /**
       *
       * If target[prop] is a function, return a function that accesses
       * this function off the target object. We can mutate the target with
       * new copies of this function without having to re-render the
       * SDK components to pass new callbacks.
       *
       * */ if (typeof target[prop] === "function") {
                    return ({
                        "useProxyProps.useRef[proxyRef]": function() {
                            var args = [];
                            for(var _i = 0; _i < arguments.length; _i++){
                                args[_i] = arguments[_i];
                            }
                            return target[prop].apply(target, args);
                        }
                    })["useProxyProps.useRef[proxyRef]"];
                }
                return Reflect.get(target, prop, receiver);
            }
        }["useProxyProps.useRef[proxyRef]"]
    }));
    proxyRef.current = Object.assign(proxyRef.current, props);
    return proxyRef.current;
}
var PayPalButtonsErrorBoundary = /** @class */ function(_super) {
    __extends(PayPalButtonsErrorBoundary, _super);
    function PayPalButtonsErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            hasError: false
        };
        return _this;
    }
    PayPalButtonsErrorBoundary.getDerivedStateFromError = function() {
        return {
            hasError: true
        };
    };
    PayPalButtonsErrorBoundary.prototype.componentDidCatch = function(error, errorInfo) {
        console.error("Error in PayPalButtons component:", error, errorInfo);
        // if onError callback is provided, call it with the error details
        // don't rethrow the error, as we want to prevent the entire app from crashing
        if (typeof this.props.onError === "function") {
            this.props.onError({
                message: error.message,
                name: error.name,
                stack: error.stack,
                componentStack: errorInfo.componentStack
            });
        }
    };
    PayPalButtonsErrorBoundary.prototype.render = function() {
        if (this.state.hasError) {
            return null;
        }
        return this.props.children;
    };
    return PayPalButtonsErrorBoundary;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Component"]);
/**
The inner component that renders the PayPal buttons. This component is wrapped in an error boundary to catch and handle any errors that may occur during rendering or interaction with the PayPal buttons.
 */ var PayPalButtonsInner = function(_a) {
    var _b;
    var _c = _a.className, className = _c === void 0 ? "" : _c, _d = _a.disabled, disabled = _d === void 0 ? false : _d, children = _a.children, _e = _a.forceReRender, forceReRender = _e === void 0 ? [] : _e, buttonProps = __rest$1(_a, [
        "className",
        "disabled",
        "children",
        "forceReRender"
    ]);
    var isDisabledStyle = disabled ? {
        opacity: 0.38
    } : {};
    var classNames = "".concat(className, " ").concat(disabled ? "paypal-buttons-disabled" : "").trim();
    var buttonsContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    var buttons = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    var proxyProps = useProxyProps(buttonProps);
    var _f = usePayPalScriptReducer()[0], isResolved = _f.isResolved, options = _f.options;
    var _g = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null), initActions = _g[0], setInitActions = _g[1];
    var _h = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true), isEligible = _h[0], setIsEligible = _h[1];
    var _j = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null), setErrorState = _j[1];
    function closeButtonsComponent() {
        if (buttons.current !== null) {
            buttons.current.close().catch(function() {
            // ignore errors when closing the component
            });
        }
    }
    if ((_b = buttons.current) === null || _b === void 0 ? void 0 : _b.updateProps) {
        buttons.current.updateProps({
            message: buttonProps.message
        });
    }
    // useEffect hook for rendering the buttons
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PayPalButtonsInner.useEffect": function() {
            // verify the sdk script has successfully loaded
            if (isResolved === false) {
                return closeButtonsComponent;
            }
            var paypalWindowNamespace = getPayPalWindowNamespace$1(getOwnProperty$1(options, "dataNamespace"));
            // verify dependency on window object
            if (paypalWindowNamespace === undefined || paypalWindowNamespace.Buttons === undefined) {
                setErrorState({
                    "PayPalButtonsInner.useEffect": function() {
                        throw new Error(generateErrorMessage({
                            reactComponentName: PayPalButtons.displayName,
                            sdkComponentKey: "buttons",
                            sdkRequestedComponents: options.components,
                            sdkDataNamespace: getOwnProperty$1(options, "dataNamespace")
                        }));
                    }
                }["PayPalButtonsInner.useEffect"]);
                return closeButtonsComponent;
            }
            var decoratedOnInit = {
                "PayPalButtonsInner.useEffect.decoratedOnInit": function(data, actions) {
                    setInitActions(actions);
                    if (typeof buttonProps.onInit === "function") {
                        buttonProps.onInit(data, actions);
                    }
                }
            }["PayPalButtonsInner.useEffect.decoratedOnInit"];
            try {
                buttons.current = paypalWindowNamespace.Buttons(__assign(__assign({}, proxyProps), {
                    onInit: decoratedOnInit
                }));
            } catch (err) {
                return setErrorState({
                    "PayPalButtonsInner.useEffect": function() {
                        throw new Error("Failed to render <PayPalButtons /> component. Failed to initialize:  ".concat(err));
                    }
                }["PayPalButtonsInner.useEffect"]);
            }
            // only render the button when eligible
            if (buttons.current.isEligible() === false) {
                setIsEligible(false);
                return closeButtonsComponent;
            }
            if (!buttonsContainerRef.current) {
                return closeButtonsComponent;
            }
            buttons.current.render(buttonsContainerRef.current).catch({
                "PayPalButtonsInner.useEffect": function(err) {
                    // component failed to render, possibly because it was closed or destroyed.
                    if (buttonsContainerRef.current === null || buttonsContainerRef.current.children.length === 0) {
                        // paypal buttons container is no longer in the DOM, we can safely ignore the error
                        return;
                    }
                    // paypal buttons container is still in the DOM
                    setErrorState({
                        "PayPalButtonsInner.useEffect": function() {
                            throw new Error("Failed to render <PayPalButtons /> component. ".concat(err));
                        }
                    }["PayPalButtonsInner.useEffect"]);
                }
            }["PayPalButtonsInner.useEffect"]);
            return closeButtonsComponent;
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["PayPalButtonsInner.useEffect"], __spreadArray(__spreadArray([
        isResolved
    ], forceReRender, true), [
        buttonProps.fundingSource
    ], false));
    // useEffect hook for managing disabled state
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PayPalButtonsInner.useEffect": function() {
            if (initActions === null) {
                return;
            }
            if (disabled === true) {
                initActions.disable().catch({
                    "PayPalButtonsInner.useEffect": function() {
                    // ignore errors when disabling the component
                    }
                }["PayPalButtonsInner.useEffect"]);
            } else {
                initActions.enable().catch({
                    "PayPalButtonsInner.useEffect": function() {
                    // ignore errors when enabling the component
                    }
                }["PayPalButtonsInner.useEffect"]);
            }
        }
    }["PayPalButtonsInner.useEffect"], [
        disabled,
        initActions
    ]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, null, isEligible ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("div", {
        ref: buttonsContainerRef,
        style: isDisabledStyle,
        className: classNames
    }) : children);
};
PayPalButtonsInner.displayName = "PayPalButtons";
/**
This `<PayPalButtons />` component supports rendering [buttons](https://developer.paypal.com/docs/business/javascript-sdk/javascript-sdk-reference/#buttons) for PayPal, Venmo, and alternative payment methods.
It relies on the `<PayPalScriptProvider />` parent component for managing state related to loading the JS SDK script.
*/ var PayPalButtons = function(props) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(PayPalButtonsErrorBoundary, {
        onError: props.onError
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(PayPalButtonsInner, __assign({}, props)));
};
PayPalButtons.displayName = "PayPalButtons";
function __rest(s, e) {
    var t = {};
    for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for(var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++){
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
}
typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
function findScript(url, attributes) {
    var currentScript = document.querySelector("script[src=\"".concat(url, "\"]"));
    if (currentScript === null) return null;
    var nextScript = createScriptElement(url, attributes);
    var currentScriptClone = currentScript.cloneNode();
    delete currentScriptClone.dataset.uidAuto;
    if (Object.keys(currentScriptClone.dataset).length !== Object.keys(nextScript.dataset).length) {
        return null;
    }
    var isExactMatch = true;
    Object.keys(currentScriptClone.dataset).forEach(function(key) {
        if (currentScriptClone.dataset[key] !== nextScript.dataset[key]) {
            isExactMatch = false;
        }
    });
    return isExactMatch ? currentScript : null;
}
function insertScriptElement(_a) {
    var url = _a.url, attributes = _a.attributes, onSuccess = _a.onSuccess, onError = _a.onError;
    var newScript = createScriptElement(url, attributes);
    newScript.onerror = onError;
    newScript.onload = onSuccess;
    document.head.insertBefore(newScript, document.head.firstElementChild);
}
function processOptions(options) {
    var customSdkBaseUrl = getOwnProperty(options, "sdkBaseUrl");
    var environment = getOwnProperty(options, "environment");
    options.environment;
    options.sdkBaseUrl;
    var rest = __rest(options, [
        "environment",
        "sdkBaseUrl"
    ]);
    var sdkBaseUrl = customSdkBaseUrl || processSdkBaseUrl(environment);
    var optionsWithStringIndex = rest;
    var _a = Object.keys(optionsWithStringIndex).filter(function(key) {
        return typeof optionsWithStringIndex[key] !== "undefined" && optionsWithStringIndex[key] !== null && optionsWithStringIndex[key] !== "";
    }).reduce(function(accumulator, key) {
        var value = optionsWithStringIndex[key].toString();
        key = camelCaseToKebabCase(key);
        if (key.substring(0, 4) === "data" || key === "crossorigin") {
            accumulator.attributes[key] = value;
        } else {
            accumulator.queryParams[key] = value;
        }
        return accumulator;
    }, {
        queryParams: {},
        attributes: {}
    }), queryParams = _a.queryParams, attributes = _a.attributes;
    var merchantId = getOwnProperty(queryParams, "merchant-id");
    if (merchantId && merchantId.indexOf(",") !== -1) {
        attributes["data-merchant-id"] = merchantId;
        queryParams["merchant-id"] = "*";
    }
    return {
        url: "".concat(sdkBaseUrl, "?").concat(objectToQueryString(queryParams)),
        attributes: attributes
    };
}
function camelCaseToKebabCase(str) {
    var replacer = function(match, indexOfMatch) {
        return (indexOfMatch ? "-" : "") + match.toLowerCase();
    };
    return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, replacer);
}
function objectToQueryString(params) {
    var queryString = "";
    Object.keys(params).forEach(function(key) {
        if (queryString.length !== 0) queryString += "&";
        queryString += key + "=" + params[key];
    });
    return queryString;
}
function processSdkBaseUrl(environment) {
    return environment === "sandbox" ? "https://www.sandbox.paypal.com/sdk/js" : "https://www.paypal.com/sdk/js";
}
function createScriptElement(url, attributes) {
    if (attributes === void 0) {
        attributes = {};
    }
    var newScript = document.createElement("script");
    newScript.src = url;
    Object.keys(attributes).forEach(function(key) {
        newScript.setAttribute(key, attributes[key]);
        if (key === "data-csp-nonce") {
            newScript.setAttribute("nonce", attributes["data-csp-nonce"]);
        }
    });
    return newScript;
}
function getOwnProperty(options, key) {
    return Object.prototype.hasOwnProperty.call(options, key) ? options[key] : undefined;
}
function loadScript(options, PromisePonyfill) {
    if (PromisePonyfill === void 0) {
        PromisePonyfill = Promise;
    }
    validateArguments(options, PromisePonyfill);
    if (typeof document === "undefined") return PromisePonyfill.resolve(null);
    var _a = processOptions(options), url = _a.url, attributes = _a.attributes;
    var namespace = getOwnProperty(attributes, "data-namespace") || "paypal";
    var existingWindowNamespace = getPayPalWindowNamespace(namespace);
    if (!getOwnProperty(attributes, "data-js-sdk-library")) {
        attributes["data-js-sdk-library"] = "paypal-js";
    }
    if (findScript(url, attributes) && existingWindowNamespace) {
        return PromisePonyfill.resolve(existingWindowNamespace);
    }
    return loadCustomScript({
        url: url,
        attributes: attributes
    }, PromisePonyfill).then(function() {
        var newWindowNamespace = getPayPalWindowNamespace(namespace);
        if (newWindowNamespace) {
            return newWindowNamespace;
        }
        throw new Error("The window.".concat(namespace, " global variable is not available."));
    });
}
function loadCustomScript(options, PromisePonyfill) {
    if (PromisePonyfill === void 0) {
        PromisePonyfill = Promise;
    }
    validateArguments(options, PromisePonyfill);
    var url = getOwnProperty(options, "url");
    var attributes = getOwnProperty(options, "attributes");
    if (typeof url !== "string" || url.length === 0) {
        throw new Error("Invalid url.");
    }
    if (typeof attributes !== "undefined" && typeof attributes !== "object") {
        throw new Error("Expected attributes to be an object.");
    }
    return new PromisePonyfill(function(resolve, reject) {
        if (typeof document === "undefined") return resolve();
        insertScriptElement({
            url: url,
            attributes: attributes,
            onSuccess: function() {
                return resolve();
            },
            onError: function() {
                var defaultError = new Error("The script \"".concat(url, "\" failed to load. Check the HTTP status code and response body in DevTools to learn more."));
                return reject(defaultError);
            }
        });
    });
}
function getPayPalWindowNamespace(namespace) {
    return window[namespace];
}
function validateArguments(options, PromisePonyfill) {
    if (typeof options !== "object" || options === null) {
        throw new Error("Expected an options object.");
    }
    var environment = getOwnProperty(options, "environment");
    if (environment && environment !== "production" && environment !== "sandbox") {
        throw new Error('The `environment` option must be either "production" or "sandbox".');
    }
    if (typeof PromisePonyfill !== "undefined" && typeof PromisePonyfill !== "function") {
        throw new Error("Expected PromisePonyfill to be a function.");
    }
}
/**
 * Simple check to determine if the Braintree is a valid namespace.
 *
 * @param braintreeSource the source {@link BraintreeNamespace}
 * @returns a boolean representing if the namespace is valid.
 */ var isValidBraintreeNamespace = function(braintreeSource) {
    var _a, _b;
    if (typeof ((_a = braintreeSource === null || braintreeSource === void 0 ? void 0 : braintreeSource.client) === null || _a === void 0 ? void 0 : _a.create) !== "function" && typeof ((_b = braintreeSource === null || braintreeSource === void 0 ? void 0 : braintreeSource.paypalCheckout) === null || _b === void 0 ? void 0 : _b.create) !== "function") {
        throw new Error("The braintreeNamespace property is not a valid BraintreeNamespace type.");
    }
    return true;
};
/**
 * Use `actions.braintree` to provide an interface for the paypalCheckoutInstance
 * through the createOrder, createBillingAgreement and onApprove callbacks
 *
 * @param braintreeButtonProps the component button options
 * @returns a new copy of the component button options casted as {@link PayPalButtonsComponentProps}
 */ var decorateActions = function(buttonProps, payPalCheckoutInstance) {
    var createOrderRef = buttonProps.createOrder;
    var createBillingAgreementRef = buttonProps.createBillingAgreement;
    var onApproveRef = buttonProps.onApprove;
    if (typeof createOrderRef === "function") {
        buttonProps.createOrder = function(data, actions) {
            return createOrderRef(data, __assign(__assign({}, actions), {
                braintree: payPalCheckoutInstance
            }));
        };
    }
    if (typeof createBillingAgreementRef === "function") {
        buttonProps.createBillingAgreement = function(data, actions) {
            return createBillingAgreementRef(data, __assign(__assign({}, actions), {
                braintree: payPalCheckoutInstance
            }));
        };
    }
    if (typeof onApproveRef === "function") {
        buttonProps.onApprove = function(data, actions) {
            return onApproveRef(data, __assign(__assign({}, actions), {
                braintree: payPalCheckoutInstance
            }));
        };
    }
    return __assign({}, buttonProps);
};
/**
 * Get the Braintree namespace from the component props.
 * If the prop `braintreeNamespace` is undefined will try to load it from the CDN.
 * This function allows users to set the braintree manually on the `BraintreePayPalButtons` component.
 *
 * Use case can be for example legacy sites using AMD/UMD modules,
 * trying to integrate the `BraintreePayPalButtons` component.
 * If we attempt to load the Braintree from the CDN won't define the braintree namespace.
 * This happens because the braintree script is an UMD module.
 * After detecting the AMD on the global scope will create an anonymous module using `define`
 * and the `BraintreePayPalButtons` won't be able to get access to the `window.braintree` namespace
 * from the global context.
 *
 * @param braintreeSource the source {@link BraintreeNamespace}
 * @returns the {@link BraintreeNamespace}
 */ var getBraintreeNamespace = function(braintreeSource) {
    if (braintreeSource && isValidBraintreeNamespace(braintreeSource)) {
        return Promise.resolve(braintreeSource);
    }
    return Promise.all([
        loadCustomScript({
            url: BRAINTREE_SOURCE
        }),
        loadCustomScript({
            url: BRAINTREE_PAYPAL_CHECKOUT_SOURCE
        })
    ]).then(function() {
        return getBraintreeWindowNamespace();
    });
};
/**
This `<BraintreePayPalButtons />` component renders the [Braintree PayPal Buttons](https://developer.paypal.com/braintree/docs/guides/paypal/overview) for Braintree Merchants.
It relies on the `<PayPalScriptProvider />` parent component for managing state related to loading the JS SDK script.

Note: You are able to make your integration using the client token or using the tokenization key.

- To use the client token integration set the key `dataClientToken` in the `PayPayScriptProvider` component's options.
- To use the tokenization key integration set the key `dataUserIdToken` in the `PayPayScriptProvider` component's options.
*/ var BraintreePayPalButtons = function(_a) {
    var _b = _a.className, className = _b === void 0 ? "" : _b, _c = _a.disabled, disabled = _c === void 0 ? false : _c, children = _a.children, _d = _a.forceReRender, forceReRender = _d === void 0 ? [] : _d, braintreeNamespace = _a.braintreeNamespace, merchantAccountId = _a.merchantAccountId, buttonProps = __rest$1(_a, [
        "className",
        "disabled",
        "children",
        "forceReRender",
        "braintreeNamespace",
        "merchantAccountId"
    ]);
    var _e = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null), setErrorState = _e[1];
    var _f = useScriptProviderContext(), providerContext = _f[0], dispatch = _f[1];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BraintreePayPalButtons.useEffect": function() {
            getBraintreeNamespace(braintreeNamespace).then({
                "BraintreePayPalButtons.useEffect": function(braintree) {
                    var clientTokenizationKey = providerContext.options[SDK_SETTINGS.DATA_USER_ID_TOKEN];
                    var clientToken = providerContext.options[SDK_SETTINGS.DATA_CLIENT_TOKEN];
                    return braintree.client.create({
                        authorization: clientTokenizationKey || clientToken
                    }).then({
                        "BraintreePayPalButtons.useEffect": function(clientInstance) {
                            var merchantProp = merchantAccountId ? {
                                merchantAccountId: merchantAccountId
                            } : {};
                            return braintree.paypalCheckout.create(__assign(__assign({}, merchantProp), {
                                client: clientInstance
                            }));
                        }
                    }["BraintreePayPalButtons.useEffect"]).then({
                        "BraintreePayPalButtons.useEffect": function(paypalCheckoutInstance) {
                            dispatch({
                                type: DISPATCH_ACTION.SET_BRAINTREE_INSTANCE,
                                value: paypalCheckoutInstance
                            });
                        }
                    }["BraintreePayPalButtons.useEffect"]);
                }
            }["BraintreePayPalButtons.useEffect"]).catch({
                "BraintreePayPalButtons.useEffect": function(err) {
                    setErrorState({
                        "BraintreePayPalButtons.useEffect": function() {
                            throw new Error("".concat(LOAD_SCRIPT_ERROR, " ").concat(err));
                        }
                    }["BraintreePayPalButtons.useEffect"]);
                }
            }["BraintreePayPalButtons.useEffect"]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["BraintreePayPalButtons.useEffect"], [
        providerContext.options
    ]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, null, providerContext.braintreePayPalCheckoutInstance && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(PayPalButtons, __assign({
        className: className,
        disabled: disabled,
        forceReRender: forceReRender
    }, decorateActions(buttonProps, providerContext.braintreePayPalCheckoutInstance)), children));
};
/**
The `<PayPalMarks />` component is used for conditionally rendering different payment options using radio buttons.
The [Display PayPal Buttons with other Payment Methods guide](https://developer.paypal.com/docs/business/checkout/add-capabilities/buyer-experience/#display-paypal-buttons-with-other-payment-methods) describes this style of integration in detail.
It relies on the `<PayPalScriptProvider />` parent component for managing state related to loading the JS SDK script.

This component can also be configured to use a single funding source similar to the [standalone buttons](https://developer.paypal.com/docs/business/checkout/configure-payments/standalone-buttons/) approach.
A `FUNDING` object is exported by this library which has a key for every available funding source option.
*/ var PayPalMarks = function(_a) {
    var _b = _a.className, className = _b === void 0 ? "" : _b, children = _a.children, markProps = __rest$1(_a, [
        "className",
        "children"
    ]);
    var _c = usePayPalScriptReducer()[0], isResolved = _c.isResolved, options = _c.options;
    var markContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    var _d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true), isEligible = _d[0], setIsEligible = _d[1];
    var _e = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null), setErrorState = _e[1];
    /**
   * Render PayPal Mark into the DOM
   */ var renderPayPalMark = function(mark) {
        var current = markContainerRef.current;
        // only render the mark when eligible
        if (!current || !mark.isEligible()) {
            return setIsEligible(false);
        }
        // Remove any children before render it again
        if (current.firstChild) {
            current.removeChild(current.firstChild);
        }
        mark.render(current).catch(function(err) {
            // component failed to render, possibly because it was closed or destroyed.
            if (current === null || current.children.length === 0) {
                // paypal marks container is no longer in the DOM, we can safely ignore the error
                return;
            }
            // paypal marks container is still in the DOM
            setErrorState(function() {
                throw new Error("Failed to render <PayPalMarks /> component. ".concat(err));
            });
        });
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PayPalMarks.useEffect": function() {
            // verify the sdk script has successfully loaded
            if (isResolved === false) {
                return;
            }
            var paypalWindowNamespace = getPayPalWindowNamespace$1(getOwnProperty$1(options, "dataNamespace"));
            // verify dependency on window object
            if (paypalWindowNamespace === undefined || paypalWindowNamespace.Marks === undefined) {
                return setErrorState({
                    "PayPalMarks.useEffect": function() {
                        throw new Error(generateErrorMessage({
                            reactComponentName: PayPalMarks.displayName,
                            sdkComponentKey: "marks",
                            sdkRequestedComponents: options.components,
                            sdkDataNamespace: getOwnProperty$1(options, "dataNamespace")
                        }));
                    }
                }["PayPalMarks.useEffect"]);
            }
            renderPayPalMark(paypalWindowNamespace.Marks(__assign({}, markProps)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["PayPalMarks.useEffect"], [
        isResolved,
        markProps.fundingSource
    ]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, null, isEligible ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("div", {
        ref: markContainerRef,
        className: className
    }) : children);
};
PayPalMarks.displayName = "PayPalMarks";
/**
This `<PayPalMessages />` messages component renders a credit messaging on upstream merchant sites.
It relies on the `<PayPalScriptProvider />` parent component for managing state related to loading the JS SDK script.
*/ var PayPalMessages = function(_a) {
    var _b = _a.className, className = _b === void 0 ? "" : _b, _c = _a.forceReRender, forceReRender = _c === void 0 ? [] : _c, messageProps = __rest$1(_a, [
        "className",
        "forceReRender"
    ]);
    var _d = usePayPalScriptReducer()[0], isResolved = _d.isResolved, options = _d.options;
    var messagesContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    var messages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    var _e = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null), setErrorState = _e[1];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PayPalMessages.useEffect": function() {
            // verify the sdk script has successfully loaded
            if (isResolved === false) {
                return;
            }
            var paypalWindowNamespace = getPayPalWindowNamespace$1(getOwnProperty$1(options, "dataNamespace"));
            // verify dependency on window object
            if (paypalWindowNamespace === undefined || paypalWindowNamespace.Messages === undefined) {
                return setErrorState({
                    "PayPalMessages.useEffect": function() {
                        throw new Error(generateErrorMessage({
                            reactComponentName: PayPalMessages.displayName,
                            sdkComponentKey: "messages",
                            sdkRequestedComponents: options.components,
                            sdkDataNamespace: getOwnProperty$1(options, "dataNamespace")
                        }));
                    }
                }["PayPalMessages.useEffect"]);
            }
            messages.current = paypalWindowNamespace.Messages(__assign({}, messageProps));
            messages.current.render(messagesContainerRef.current).catch({
                "PayPalMessages.useEffect": function(err) {
                    // component failed to render, possibly because it was closed or destroyed.
                    if (messagesContainerRef.current === null || messagesContainerRef.current.children.length === 0) {
                        // paypal messages container is no longer in the DOM, we can safely ignore the error
                        return;
                    }
                    // paypal messages container is still in the DOM
                    setErrorState({
                        "PayPalMessages.useEffect": function() {
                            throw new Error("Failed to render <PayPalMessages /> component. ".concat(err));
                        }
                    }["PayPalMessages.useEffect"]);
                }
            }["PayPalMessages.useEffect"]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["PayPalMessages.useEffect"], __spreadArray([
        isResolved
    ], forceReRender, true));
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("div", {
        ref: messagesContainerRef,
        className: className
    });
};
PayPalMessages.displayName = "PayPalMessages";
/**
This `<PayPalScriptProvider />` component takes care of loading the JS SDK `<script>`.
It manages state for script loading so children components like `<PayPalButtons />` know when it's safe to use the `window.paypal` global namespace.

Note: You always should use this component as a wrapper for  `PayPalButtons`, `PayPalMarks`, `PayPalMessages` and `BraintreePayPalButtons` components.
 */ var PayPalScriptProvider = function(_a) {
    var _b;
    var _c = _a.options, options = _c === void 0 ? {
        clientId: "test"
    } : _c, children = _a.children, _d = _a.deferLoading, deferLoading = _d === void 0 ? false : _d;
    var _e = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducer"])(scriptReducer, {
        options: __assign(__assign({}, options), (_b = {}, _b[SDK_SETTINGS.DATA_JS_SDK_LIBRARY] = SDK_SETTINGS.DATA_LIBRARY_VALUE, _b[SDK_SETTINGS.DATA_SDK_INTEGRATION_SOURCE] = SDK_SETTINGS.DATA_LIBRARY_VALUE, _b[SCRIPT_ID] = "".concat(getScriptID(options)), _b)),
        loadingStatus: deferLoading ? SCRIPT_LOADING_STATE.INITIAL : SCRIPT_LOADING_STATE.PENDING
    }), state = _e[0], dispatch = _e[1];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PayPalScriptProvider.useEffect": function() {
            if (deferLoading === false && state.loadingStatus === SCRIPT_LOADING_STATE.INITIAL) {
                return dispatch({
                    type: DISPATCH_ACTION.LOADING_STATUS,
                    value: SCRIPT_LOADING_STATE.PENDING
                });
            }
            if (state.loadingStatus !== SCRIPT_LOADING_STATE.PENDING) {
                return;
            }
            var isSubscribed = true;
            loadScript(state.options).then({
                "PayPalScriptProvider.useEffect": function() {
                    if (isSubscribed) {
                        dispatch({
                            type: DISPATCH_ACTION.LOADING_STATUS,
                            value: SCRIPT_LOADING_STATE.RESOLVED
                        });
                    }
                }
            }["PayPalScriptProvider.useEffect"]).catch({
                "PayPalScriptProvider.useEffect": function(err) {
                    console.error("".concat(LOAD_SCRIPT_ERROR, " ").concat(err));
                    if (isSubscribed) {
                        dispatch({
                            type: DISPATCH_ACTION.LOADING_STATUS,
                            value: {
                                state: SCRIPT_LOADING_STATE.REJECTED,
                                message: String(err)
                            }
                        });
                    }
                }
            }["PayPalScriptProvider.useEffect"]);
            return ({
                "PayPalScriptProvider.useEffect": function() {
                    isSubscribed = false;
                }
            })["PayPalScriptProvider.useEffect"];
        }
    }["PayPalScriptProvider.useEffect"], [
        state.options,
        deferLoading,
        state.loadingStatus
    ]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(ScriptContext.Provider, {
        value: __assign(__assign({}, state), {
            dispatch: dispatch
        })
    }, children);
};
/**
 * Custom hook to store registered hosted fields children
 * Each `PayPalHostedField` component should be registered on the parent provider
 *
 * @param initialValue the initially registered components
 * @returns at first, an {@link Object} containing the registered hosted fields,
 * and at the second a function handler to register the hosted fields components
 */ var useHostedFieldsRegister = function(initialValue) {
    if (initialValue === void 0) {
        initialValue = {};
    }
    var registeredFields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(initialValue);
    var registerHostedField = function(component) {
        registeredFields.current = __assign(__assign({}, registeredFields.current), component);
    };
    return [
        registeredFields,
        registerHostedField
    ];
};
/**
 * Throw an exception if the HostedFields is not found in the paypal namespace
 * Probably cause for this problem is not sending the hosted-fields string
 * as part of the components props in options
 * {@code <PayPalScriptProvider options={{ components: 'hosted-fields'}}>}
 *
 * @param param0 and object containing the components and namespace defined in options
 * @throws {@code Error}
 *
 */ var generateMissingHostedFieldsError = function(_a) {
    var _b = _a.components, components = _b === void 0 ? "" : _b, _c = SDK_SETTINGS.DATA_NAMESPACE, _d = _a[_c], dataNamespace = _d === void 0 ? DEFAULT_PAYPAL_NAMESPACE : _d;
    var expectedComponents = components ? "".concat(components, ",hosted-fields") : "hosted-fields";
    var errorMessage = "Unable to render <PayPalHostedFieldsProvider /> because window.".concat(dataNamespace, ".HostedFields is undefined.");
    if (!components.includes("hosted-fields")) {
        errorMessage += "\nTo fix the issue, add 'hosted-fields' to the list of components passed to the parent PayPalScriptProvider: <PayPalScriptProvider options={{ components: '".concat(expectedComponents, "'}}>");
    }
    return errorMessage;
};
/**
 * Validate the expiration date component. Valid combinations are:
 * 1- Only the `expirationDate` field exists.
 * 2- Only the `expirationMonth` and `expirationYear` fields exist. Cannot be used with the `expirationDate` field.
 *
 * @param registerTypes
 * @returns @type {true} when the children are valid
 */ var validateExpirationDate = function(registerTypes) {
    return !registerTypes.includes(PAYPAL_HOSTED_FIELDS_TYPES.EXPIRATION_DATE) && !registerTypes.includes(PAYPAL_HOSTED_FIELDS_TYPES.EXPIRATION_MONTH) && !registerTypes.includes(PAYPAL_HOSTED_FIELDS_TYPES.EXPIRATION_YEAR);
};
/**
 * Check if we find the [number, expiration, cvv] in children
 *
 * @param requiredChildren the list with required children [number, expiration, cvv]
 * @param registerTypes    the list of all the children types pass to the parent
 * @throw an @type {Error} when not find the default children
 */ var hasDefaultChildren = function(registerTypes) {
    if (!registerTypes.includes(PAYPAL_HOSTED_FIELDS_TYPES.NUMBER) || !registerTypes.includes(PAYPAL_HOSTED_FIELDS_TYPES.CVV) || validateExpirationDate(registerTypes)) {
        throw new Error(HOSTED_FIELDS_CHILDREN_ERROR);
    }
};
/**
 * Check if we don't have duplicate children types
 *
 * @param registerTypes the list of all the children types pass to the parent
 * @throw an @type {Error} when duplicate types was found
 */ var noDuplicateChildren = function(registerTypes) {
    if (registerTypes.length !== new Set(registerTypes).size) {
        throw new Error(HOSTED_FIELDS_DUPLICATE_CHILDREN_ERROR);
    }
};
/**
 * Validate the hosted field children in the PayPalHostedFieldsProvider component.
 * These are the rules:
 * 1- We need to find 3 default children for number, expiration, cvv
 * 2- No duplicate children are allowed
 * 3- No invalid combinations of `expirationDate`, `expirationMonth`, and `expirationYear`
 *
 * @param childrenList     the list of children
 * @param requiredChildren the list with required children [number, expiration, cvv]
 */ var validateHostedFieldChildren = function(registeredFields) {
    hasDefaultChildren(registeredFields);
    noDuplicateChildren(registeredFields);
};
/**
This `<PayPalHostedFieldsProvider />` provider component wraps the form field elements and accepts props like `createOrder()`.

This provider component is designed to be used with the `<PayPalHostedField />` component.

Warning: If you don't see anything in the screen probably your client is ineligible.
To handle this problem make sure to use the prop `notEligibleError` and pass a component with a custom message.
Take a look to this link if that is the case: https://developer.paypal.com/docs/checkout/advanced/integrate/
*/ var PayPalHostedFieldsProvider = function(_a) {
    var styles = _a.styles, createOrder = _a.createOrder, notEligibleError = _a.notEligibleError, children = _a.children, installments = _a.installments;
    var _b = useScriptProviderContext()[0], options = _b.options, loadingStatus = _b.loadingStatus;
    var _c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true), isEligible = _c[0], setIsEligible = _c[1];
    var _d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(), cardFields = _d[0], setCardFields = _d[1];
    var _e = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null), setErrorState = _e[1];
    var hostedFieldsContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    var hostedFields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    var _f = useHostedFieldsRegister(), registeredFields = _f[0], registerHostedField = _f[1];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PayPalHostedFieldsProvider.useEffect": function() {
            validateHostedFieldChildren(Object.keys(registeredFields.current));
            // Only render the hosted fields when script is loaded and hostedFields is eligible
            if (!(loadingStatus === SCRIPT_LOADING_STATE.RESOLVED)) {
                return;
            }
            // Get the hosted fields from the [window.paypal.HostedFields] SDK
            hostedFields.current = getPayPalWindowNamespace$1(getOwnProperty$1(options, "dataNamespace")).HostedFields;
            if (!hostedFields.current) {
                throw new Error(generateMissingHostedFieldsError({
                    components: options.components,
                    dataNamespace: getOwnProperty$1(options, "dataNamespace")
                }));
            }
            if (!hostedFields.current.isEligible()) {
                return setIsEligible(false);
            }
            // Clean all the fields before the rerender
            if (cardFields) {
                cardFields.teardown();
            }
            hostedFields.current.render({
                // Call your server to set up the transaction
                createOrder: createOrder,
                fields: registeredFields.current,
                installments: installments,
                styles: styles
            }).then({
                "PayPalHostedFieldsProvider.useEffect": function(cardFieldsInstance) {
                    if (hostedFieldsContainerRef.current) {
                        setCardFields(cardFieldsInstance);
                    }
                }
            }["PayPalHostedFieldsProvider.useEffect"]).catch({
                "PayPalHostedFieldsProvider.useEffect": function(err) {
                    setErrorState({
                        "PayPalHostedFieldsProvider.useEffect": function() {
                            throw new Error("Failed to render <PayPalHostedFieldsProvider /> component. ".concat(err));
                        }
                    }["PayPalHostedFieldsProvider.useEffect"]);
                }
            }["PayPalHostedFieldsProvider.useEffect"]);
        }
    }["PayPalHostedFieldsProvider.useEffect"], [
        loadingStatus,
        styles
    ]); // eslint-disable-line react-hooks/exhaustive-deps
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("div", {
        ref: hostedFieldsContainerRef
    }, isEligible ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(PayPalHostedFieldsContext.Provider, {
        value: {
            cardFields: cardFields,
            registerHostedField: registerHostedField
        }
    }, children) : notEligibleError);
};
/**
This `<PayPalHostedField />` component renders individual fields for [Hosted Fields](https://developer.paypal.com/docs/business/checkout/advanced-card-payments/integrate#3-add-javascript-sdk-and-card-form) integrations.
It relies on the `<PayPalHostedFieldsProvider />` parent component for managing state related to loading the JS SDK script
and execute some validations before the rendering the fields.

To use the PayPal hosted fields you need to define at least three fields:

- A card number field
- The CVV code from the client card
- The expiration date

You can define the expiration date as a single field similar to the example below,
or you are able to define it in [two separate fields](https://paypal.github.io/paypal-js/web-sdk-v5-react-storybook/?path=/docs/paypal-paypalhostedfields--expiration-date). One for the month and second for year.

Note: Take care when using multiple instances of the PayPal Hosted Fields on the same page.
The component will fail to render when any of the selectors return more than one element.
*/ var PayPalHostedField = function(_a) {
    var hostedFieldType = _a.hostedFieldType, // eslint-disable-line @typescript-eslint/no-unused-vars
    options = _a.options, // eslint-disable-line @typescript-eslint/no-unused-vars
    props = __rest$1(_a, [
        "hostedFieldType",
        "options"
    ]);
    var hostedFieldContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(PayPalHostedFieldsContext);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PayPalHostedField.useEffect": function() {
            var _a;
            if (!(hostedFieldContext === null || hostedFieldContext === void 0 ? void 0 : hostedFieldContext.registerHostedField)) {
                throw new Error("The HostedField cannot be register in the PayPalHostedFieldsProvider parent component");
            }
            // Register in the parent provider
            hostedFieldContext.registerHostedField((_a = {}, _a[hostedFieldType] = {
                selector: options.selector,
                placeholder: options.placeholder,
                type: options.type,
                formatInput: options.formatInput,
                maskInput: options.maskInput,
                select: options.select,
                maxlength: options.maxlength,
                minlength: options.minlength,
                prefill: options.prefill,
                rejectUnsupportedCards: options.rejectUnsupportedCards
            }, _a));
        }
    }["PayPalHostedField.useEffect"], []); // eslint-disable-line react-hooks/exhaustive-deps
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("div", __assign({}, props));
};
/**
 * Throw an exception if the CardFields is not found in the paypal namespace
 * Probably cause for this problem is not sending the card-fields string
 * as part of the components props in options
 * {@code <PayPalScriptProvider options={{ components: 'card-fields'}}>}
 *
 * @param param0 and object containing the components and namespace defined in options
 * @throws {@code Error}
 *
 */ var generateMissingCardFieldsError = function(_a) {
    var _b = _a.components, components = _b === void 0 ? "" : _b, _c = SDK_SETTINGS.DATA_NAMESPACE, _d = _a[_c], dataNamespace = _d === void 0 ? DEFAULT_PAYPAL_NAMESPACE : _d;
    var expectedComponents = components ? "".concat(components, ",card-fields") : "card-fields";
    var errorMessage = "Unable to render <PayPalCardFieldsProvider /> because window.".concat(dataNamespace, ".CardFields is undefined.");
    if (!components.includes("card-fields")) {
        errorMessage += "\nTo fix the issue, add 'card-fields' to the list of components passed to the parent PayPalScriptProvider: <PayPalScriptProvider options={{ components: '".concat(expectedComponents, "'}}>");
    }
    return errorMessage;
};
function ignore() {
    return;
}
function hasChildren(container) {
    var _a;
    return !!((_a = container.current) === null || _a === void 0 ? void 0 : _a.children.length);
}
var PayPalCardFieldsContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    cardFieldsForm: null,
    fields: {},
    registerField: ignore,
    // implementation is inside hook and passed through the provider
    unregisterField: ignore // implementation is inside hook and passed through the provider
});
var usePayPalCardFields = function() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(PayPalCardFieldsContext);
};
var usePayPalCardFieldsRegistry = function() {
    var _a = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null), setError = _a[1];
    var registeredFields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    var registerField = function() {
        var props = [];
        for(var _i = 0; _i < arguments.length; _i++){
            props[_i] = arguments[_i];
        }
        var fieldName = props[0], options = props[1], cardFields = props[2];
        if (registeredFields.current[fieldName]) {
            setError(function() {
                throw new Error(CARD_FIELDS_DUPLICATE_CHILDREN_ERROR);
            });
        }
        registeredFields.current[fieldName] = cardFields === null || cardFields === void 0 ? void 0 : cardFields[fieldName](options);
        return registeredFields.current[fieldName];
    };
    var unregisterField = function(fieldName) {
        var field = registeredFields.current[fieldName];
        if (field) {
            field.close().catch(ignore);
            delete registeredFields.current[fieldName];
        }
    };
    return {
        fields: registeredFields.current,
        registerField: registerField,
        unregisterField: unregisterField
    };
};
var FullWidthContainer = function(_a) {
    var children = _a.children;
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("div", {
        style: {
            width: "100%"
        }
    }, children);
};
/**
The `<PayPalCardFieldsProvider />` is a context provider that is designed to support the rendering and state management of PayPal CardFields in your application.

The context provider will initialize the `CardFields` instance from the JS SDK and determine eligibility to render the CardField components. Once the `CardFields` are initialized, the context provider will manage the state of the `CardFields` instance as well as the reference to each individual card field.

Passing the `inputEvents` and `style` props to the context provider will apply them to each of the individual field components.

The state managed by the provider is accessible through our custom hook `usePayPalCardFields`.

*/ var PayPalCardFieldsProvider = function(_a) {
    var children = _a.children, props = __rest$1(_a, [
        "children"
    ]);
    var proxyInputEvents = useProxyProps(props.inputEvents);
    var proxyProps = useProxyProps(props);
    var _b = usePayPalScriptReducer()[0], isResolved = _b.isResolved, options = _b.options;
    var _c = usePayPalCardFieldsRegistry(), fields = _c.fields, registerField = _c.registerField, unregisterField = _c.unregisterField;
    var _d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null), cardFieldsForm = _d[0], setCardFieldsForm = _d[1];
    var cardFieldsInstance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    var _e = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false), isEligible = _e[0], setIsEligible = _e[1];
    // We set the error inside state so that it can be caught by React's error boundary
    var _f = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null), setError = _f[1];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PayPalCardFieldsProvider.useEffect": function() {
            var _a, _b, _c;
            if (!isResolved) {
                return;
            }
            if (props.inputEvents) {
                proxyProps.inputEvents = proxyInputEvents;
            }
            try {
                cardFieldsInstance.current = (_c = (_b = (_a = getPayPalWindowNamespace$1(getOwnProperty$1(options, "dataNamespace"))).CardFields) === null || _b === void 0 ? void 0 : _b.call(_a, __assign({}, proxyProps))) !== null && _c !== void 0 ? _c : null;
            } catch (error) {
                setError({
                    "PayPalCardFieldsProvider.useEffect": function() {
                        throw new Error("Failed to render <PayPalCardFieldsProvider /> component. Failed to initialize:  ".concat(error));
                    }
                }["PayPalCardFieldsProvider.useEffect"]);
                return;
            }
            if (!cardFieldsInstance.current) {
                setError({
                    "PayPalCardFieldsProvider.useEffect": function() {
                        throw new Error(generateMissingCardFieldsError({
                            components: options.components,
                            dataNamespace: getOwnProperty$1(options, "dataNamespace")
                        }));
                    }
                }["PayPalCardFieldsProvider.useEffect"]);
                return;
            }
            setIsEligible(cardFieldsInstance.current.isEligible());
            setCardFieldsForm(cardFieldsInstance.current);
            return ({
                "PayPalCardFieldsProvider.useEffect": function() {
                    setCardFieldsForm(null);
                    cardFieldsInstance.current = null;
                }
            })["PayPalCardFieldsProvider.useEffect"];
        }
    }["PayPalCardFieldsProvider.useEffect"], [
        isResolved
    ]); // eslint-disable-line react-hooks/exhaustive-deps
    if (!isEligible) {
        // TODO: What should be returned here?
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("div", null);
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(FullWidthContainer, null, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(PayPalCardFieldsContext.Provider, {
        value: {
            cardFieldsForm: cardFieldsForm,
            fields: fields,
            registerField: registerField,
            unregisterField: unregisterField
        }
    }, children));
};
var PayPalCardField = function(_a) {
    var className = _a.className, fieldName = _a.fieldName, options = __rest$1(_a, [
        "className",
        "fieldName"
    ]);
    var _b = usePayPalCardFields(), cardFieldsForm = _b.cardFieldsForm, registerField = _b.registerField, unregisterField = _b.unregisterField;
    var containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    var proxyInputEvents = useProxyProps(options.inputEvents);
    // Set errors is state so that they can be caught by React's error boundary
    var _c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null), setError = _c[1];
    function closeComponent() {
        unregisterField(fieldName);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PayPalCardField.useEffect": function() {
            if (!cardFieldsForm) {
                setError({
                    "PayPalCardField.useEffect": function() {
                        throw new Error(CARD_FIELDS_CONTEXT_ERROR);
                    }
                }["PayPalCardField.useEffect"]);
                return closeComponent;
            }
            if (!containerRef.current) {
                return closeComponent;
            }
            if (options.inputEvents) {
                options.inputEvents = proxyInputEvents;
            }
            var registeredField = registerField(fieldName, options, cardFieldsForm);
            registeredField === null || registeredField === void 0 ? void 0 : registeredField.render(containerRef.current).catch({
                "PayPalCardField.useEffect": function(err) {
                    if (!hasChildren(containerRef)) {
                        // Component no longer in the DOM, we can safely ignore the error
                        return;
                    }
                    // Component is still in the DOM
                    setError({
                        "PayPalCardField.useEffect": function() {
                            throw new Error("Failed to render <PayPal".concat(fieldName, " /> component. ").concat(err));
                        }
                    }["PayPalCardField.useEffect"]);
                }
            }["PayPalCardField.useEffect"]);
            return closeComponent;
        }
    }["PayPalCardField.useEffect"], []); // eslint-disable-line react-hooks/exhaustive-deps
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("div", {
        ref: containerRef,
        className: className
    });
};
var PayPalNameField = function(options) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(PayPalCardField, __assign({
        fieldName: "NameField"
    }, options));
};
var PayPalNumberField = function(options) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(PayPalCardField, __assign({
        fieldName: "NumberField"
    }, options));
};
var PayPalExpiryField = function(options) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(PayPalCardField, __assign({
        fieldName: "ExpiryField"
    }, options));
};
var PayPalCVVField = function(options) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(PayPalCardField, __assign({
        fieldName: "CVVField"
    }, options));
};
var FlexContainer = function(_a) {
    var children = _a.children;
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("div", {
        style: {
            display: "flex",
            width: "100%"
        }
    }, children);
};
/**
This `<PayPalCardFieldsForm />` component renders the 4 individual fields for [Card Fields](https://developer.paypal.com/docs/business/checkout/advanced-card-payments/integrate#3-add-javascript-sdk-and-card-form) integrations.
This setup relies on the `<PayPalCardFieldsProvider />` parent component, which manages the state related to loading the JS SDK script and performs certain validations before rendering the fields.



Note: If you want to have more granular control over the layout of how the fields are rendered, you can alternatively use our Individual Fields.
*/ var PayPalCardFieldsForm = function(_a) {
    var className = _a.className;
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("div", {
        className: className
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(PayPalCardField, {
        fieldName: "NameField"
    }), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(PayPalCardField, {
        fieldName: "NumberField"
    }), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(FlexContainer, null, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(FullWidthContainer, null, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(PayPalCardField, {
        fieldName: "ExpiryField"
    })), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(FullWidthContainer, null, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(PayPalCardField, {
        fieldName: "CVVField"
    }))));
};
var FUNDING$1 = {
    PAYPAL: "paypal",
    VENMO: "venmo",
    APPLEPAY: "applepay",
    ITAU: "itau",
    CREDIT: "credit",
    PAYLATER: "paylater",
    CARD: "card",
    IDEAL: "ideal",
    SEPA: "sepa",
    BANCONTACT: "bancontact",
    GIROPAY: "giropay",
    SOFORT: "sofort",
    EPS: "eps",
    MYBANK: "mybank",
    P24: "p24",
    PAYU: "payu",
    BLIK: "blik",
    TRUSTLY: "trustly",
    OXXO: "oxxo",
    BOLETO: "boleto",
    BOLETOBANCARIO: "boletobancario",
    WECHATPAY: "wechatpay",
    MERCADOPAGO: "mercadopago",
    MULTIBANCO: "multibanco",
    SATISPAY: "satispay",
    PAIDY: "paidy",
    ZIMPLER: "zimpler",
    MAXIMA: "maxima"
};
[
    FUNDING$1.IDEAL,
    FUNDING$1.BANCONTACT,
    FUNDING$1.GIROPAY,
    FUNDING$1.SOFORT,
    FUNDING$1.EPS,
    FUNDING$1.MYBANK,
    FUNDING$1.P24,
    FUNDING$1.PAYU,
    FUNDING$1.BLIK,
    FUNDING$1.TRUSTLY,
    FUNDING$1.OXXO,
    FUNDING$1.BOLETO,
    FUNDING$1.BOLETOBANCARIO,
    FUNDING$1.WECHATPAY,
    FUNDING$1.MERCADOPAGO,
    FUNDING$1.MULTIBANCO,
    FUNDING$1.SATISPAY,
    FUNDING$1.PAIDY,
    FUNDING$1.MAXIMA,
    FUNDING$1.ZIMPLER
];
// We do not re-export `FUNDING` from the `sdk-constants` module
// directly because it has no type definitions.
//
// See https://github.com/paypal/react-paypal-js/issues/125
var FUNDING = FUNDING$1;
;
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$paypal$2f$react$2d$paypal$2d$js$2f$dist$2f$esm$2f$react$2d$paypal$2d$js$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@paypal/react-paypal-js/dist/esm/react-paypal-js.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$voice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/voice.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
"use client";
;
;
;
const usd = (c)=>`$${(c / 100).toFixed(2)}`;
const mask = (e)=>e && e.includes("@") ? `${e[0]}•••@${e.split("@")[1]}` : "";
const time = (iso)=>new Date(iso).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
const STAGES = [
    "Ask",
    "Review",
    "Pay",
    "Arrives"
];
const STEPS = [
    {
        key: "paid",
        label: "Payment received"
    },
    {
        key: "payout_pending",
        label: "Sent to their PayPal"
    },
    {
        key: "delivered",
        label: "Arrived"
    }
];
const L = {
    en: {
        get: "They get",
        amount: "Transfer amount",
        fee: "Fee",
        pay: "You pay",
        forr: "For",
        confirm: "Confirm and pay",
        change: "Change details"
    },
    sw: {
        get: "Anapokea",
        amount: "Kiasi cha kutuma",
        fee: "Ada",
        pay: "Unalipa",
        forr: "Kwa ajili ya",
        confirm: "Thibitisha na ulipe",
        change: "Badilisha maelezo"
    },
    fr: {
        get: "Il reçoit",
        amount: "Montant du transfert",
        fee: "Frais",
        pay: "Vous payez",
        forr: "Pour",
        confirm: "Confirmer et payer",
        change: "Modifier les détails"
    },
    pcm: {
        get: "Dem go get",
        amount: "Money wey you dey send",
        fee: "Fee",
        pay: "Wetin you go pay",
        forr: "For",
        confirm: "Confirm am and pay",
        change: "Change am"
    }
};
// Stable callback ref: moves keyboard/screen-reader focus to a card when it first appears.
const focusOnMount = (el)=>el?.focus({
        preventScroll: true
    });
const subscribeOnline = (cb)=>{
    window.addEventListener("online", cb);
    window.addEventListener("offline", cb);
    return ()=>{
        window.removeEventListener("online", cb);
        window.removeEventListener("offline", cb);
    };
};
const CHIPS = [
    "Send $50 to mama for rent",
    "Tuma $30 kwa mama",
    "Envoie 40 dollars à mama",
    "Abeg send $20 give mama"
];
function useCountUp(target, ms = 700) {
    _s();
    const [v, setV] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCountUp.useEffect": ()=>{
            const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            let raf = 0;
            const t0 = performance.now();
            const tick = {
                "useCountUp.useEffect.tick": (t)=>{
                    const p = reduce ? 1 : Math.min(1, (t - t0) / ms);
                    setV(target * (1 - Math.pow(1 - p, 3)));
                    if (p < 1) raf = requestAnimationFrame(tick);
                }
            }["useCountUp.useEffect.tick"];
            raf = requestAnimationFrame(tick);
            return ({
                "useCountUp.useEffect": ()=>cancelAnimationFrame(raf)
            })["useCountUp.useEffect"];
        }
    }["useCountUp.useEffect"], [
        target,
        ms
    ]);
    return v;
}
_s(useCountUp, "dQPPPz8j9S+d2miNCAw/i+MhJ60=");
function Stepper({ stage }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
        className: "flex gap-1.5",
        "aria-label": `Progress: step ${stage + 1} of ${STAGES.length}`,
        children: STAGES.map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                className: "flex-1",
                "aria-current": i === stage ? "step" : undefined,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-1 overflow-hidden rounded-full bg-line",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full rounded-full bg-brand transition-[width] duration-700 ease-out",
                            style: {
                                width: i <= stage ? "100%" : "0%"
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 55,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 54,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `mt-1 block text-xs ${i === stage ? "font-semibold" : "text-muted"}`,
                        children: s
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 57,
                        columnNumber: 11
                    }, this)
                ]
            }, s, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 53,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
_c = Stepper;
const Typing = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "pop inline-flex gap-1 rounded-2xl rounded-tl-md bg-them px-4 py-3 ring-1 ring-line",
        role: "status",
        "aria-label": "Tuma is typing",
        children: [
            0,
            1,
            2
        ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "dot h-1.5 w-1.5 rounded-full bg-muted"
            }, i, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 66,
                columnNumber: 27
            }, ("TURBOPACK compile-time value", void 0)))
    }, void 0, false, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 65,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c1 = Typing;
const Row = ({ k, v, strong })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex justify-between ${strong ? "border-t border-line pt-2 font-semibold" : "text-muted"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                children: k
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 72,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                className: `tabular-nums ${strong ? "" : "text-foreground"}`,
                children: v
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 73,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 71,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c2 = Row;
function RecipientForm({ p, onSubmit, onCancel }) {
    _s1();
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(p.recipientName);
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(String(p.recipientEmail ?? ""));
    const [save, setSave] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [err, setErr] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const field = "min-h-11 w-full rounded-xl bg-background px-3 text-[0.9375rem] outline-none ring-1 ring-edge focus:ring-2 focus:ring-brand";
    async function submit(e) {
        e.preventDefault();
        const n = name.trim(), em = email.trim();
        if (!n) return setErr("Enter the recipient's name.");
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) return setErr("Enter a valid PayPal email, like name@example.com.");
        setErr("");
        setSaving(true);
        if (save) {
            try {
                await fetch("/api/recipients", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: n,
                        email: em,
                        country: p.country
                    })
                });
            } catch  {}
        }
        setSaving(false);
        onSubmit({
            name: n,
            email: em
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        ref: focusOnMount,
        tabIndex: -1,
        "aria-label": "Recipient details",
        className: "slide-up rounded-3xl bg-surface p-5 ring-1 ring-line",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-lg font-bold",
                children: [
                    "Who is receiving ",
                    usd(p.quote.amountUsdCents),
                    "?"
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1 text-sm text-muted",
                children: "PayPal needs the email of the recipient's PayPal account. Check it carefully: a payment to the wrong email can't be undone."
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: submit,
                noValidate: true,
                className: "mt-4 space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "r-name",
                                className: "mb-1 block text-sm font-medium",
                                children: "Recipient name"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                id: "r-name",
                                value: name,
                                onChange: (e)=>setName(e.target.value),
                                autoComplete: "off",
                                className: field
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 105,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "r-email",
                                className: "mb-1 block text-sm font-medium",
                                children: "Recipient's PayPal email"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 108,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                id: "r-email",
                                type: "email",
                                inputMode: "email",
                                autoComplete: "off",
                                autoCapitalize: "none",
                                spellCheck: false,
                                value: email,
                                onChange: (e)=>setEmail(e.target.value),
                                "aria-describedby": "r-email-help r-err",
                                "aria-invalid": Boolean(err),
                                placeholder: "name@example.com",
                                className: field
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 109,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                id: "r-email-help",
                                className: "mt-1 text-xs text-muted",
                                children: "If they don't have a PayPal account yet, PayPal emails them a link to claim the money."
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 111,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "flex min-h-11 items-center gap-3 text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "checkbox",
                                checked: save,
                                onChange: (e)=>setSave(e.target.checked),
                                className: "h-5 w-5 accent-[var(--brand)]"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 114,
                                columnNumber: 11
                            }, this),
                            "Remember this recipient for next time"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        id: "r-err",
                        role: "alert",
                        className: "text-sm font-medium text-danger",
                        children: err
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 117,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: saving,
                                className: "min-h-12 flex-1 rounded-full bg-brand py-3 font-semibold text-on-brand transition active:scale-[.98] disabled:opacity-60",
                                children: "Continue to review"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 119,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: onCancel,
                                className: "min-h-12 rounded-full px-4 text-sm font-medium text-muted hover:text-foreground",
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 120,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
_s1(RecipientForm, "DfXDbL8vhRp9FUtfuT5CXNCTrSo=");
_c3 = RecipientForm;
function QuoteCard({ p, onConfirm, onChange, confirming }) {
    _s2();
    const q = p.quote;
    const shown = useCountUp(q.amountUsdCents / 100);
    const lang = String(p.language) in L ? String(p.language) : "en";
    const t = L[lang];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        ref: focusOnMount,
        tabIndex: -1,
        lang: lang,
        className: "slide-up rounded-3xl bg-surface p-5 ring-1 ring-line",
        "aria-label": `Review transfer to ${p.recipientName}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid h-10 w-10 place-items-center rounded-full bg-brand-soft font-semibold text-brand-ink",
                        children: p.recipientName.slice(0, 1).toUpperCase()
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 135,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-semibold capitalize",
                                children: p.recipientName
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 137,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "truncate text-xs text-muted",
                                children: [
                                    "PayPal ",
                                    mask(p.recipientEmail)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 138,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 136,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 134,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-5 text-sm text-muted",
                children: t.get
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-4xl font-bold tabular-nums tracking-tight",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": "true",
                        children: [
                            "$",
                            shown.toFixed(2)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 142,
                        columnNumber: 69
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "sr-only",
                        children: [
                            "$",
                            (q.amountUsdCents / 100).toFixed(2)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 142,
                        columnNumber: 120
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 142,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-muted",
                children: [
                    "in their PayPal account, about ",
                    q.payoutLocalAmount.toLocaleString(),
                    " ",
                    q.payoutCurrency,
                    " at an indicative rate"
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 143,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                className: "mt-4 space-y-2 border-t border-line pt-4 text-sm",
                children: [
                    typeof p.purpose === "string" && p.purpose && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                        k: t.forr,
                        v: p.purpose
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 145,
                        columnNumber: 56
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                        k: t.amount,
                        v: usd(q.amountUsdCents)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                        k: t.fee,
                        v: usd(q.feeUsdCents)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                        k: t.pay,
                        v: usd(q.totalUsdCents),
                        strong: true
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onConfirm,
                disabled: confirming,
                "aria-busy": confirming,
                className: "mt-4 min-h-12 w-full rounded-full bg-brand py-3 font-semibold text-on-brand transition active:scale-[.98] disabled:opacity-60",
                children: confirming ? "Starting payment…" : t.confirm
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 150,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onChange,
                className: "mt-1 min-h-11 w-full rounded-full py-2 text-sm font-medium text-muted hover:text-foreground",
                children: t.change
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 151,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 133,
        columnNumber: 5
    }, this);
}
_s2(QuoteCard, "8FLAbCVHPE/QfFcu/7UkOIkZXKw=", false, function() {
    return [
        useCountUp
    ];
});
_c4 = QuoteCard;
function Check() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 52 52",
        className: "h-14 w-14 text-brand",
        "aria-hidden": "true",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "26",
                cy: "26",
                r: "24",
                className: "draw-circle",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "3"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 159,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M15 27l8 8 14-16",
                className: "draw-check",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "4",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 160,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 158,
        columnNumber: 5
    }, this);
}
_c5 = Check;
function Timeline({ t }) {
    const done = new Set(t.events.map((e)=>e.to_status));
    const failed = t.transfer.status === "failed";
    const firstOpen = STEPS.findIndex((s)=>!done.has(s.key));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
        className: "space-y-3",
        children: STEPS.map((s, i)=>{
            const isDone = done.has(s.key);
            const active = !isDone && i === firstOpen && !failed;
            const label = s.key === "delivered" && active && t.payoutStatus === "UNCLAIMED" ? "Waiting for them to claim it" : s.label;
            const at = t.events.find((e)=>e.to_status === s.key)?.created_at;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                className: "flex items-center gap-3 text-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `relative grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs ${isDone ? "bg-brand text-on-brand" : active ? "bg-warn-soft text-warn" : "bg-line text-muted"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-hidden": "true",
                                children: isDone ? "✓" : i + 1
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 179,
                                columnNumber: 15
                            }, this),
                            active && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-hidden": "true",
                                className: "ring absolute inset-0 rounded-full bg-warn-soft"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 180,
                                columnNumber: 26
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 178,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: isDone || active ? "font-medium" : "text-muted",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sr-only",
                                children: isDone ? "Done: " : active ? "In progress: " : "Not started: "
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 182,
                                columnNumber: 79
                            }, this),
                            label
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 182,
                        columnNumber: 13
                    }, this),
                    at && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-auto text-xs text-muted",
                        children: time(at)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 183,
                        columnNumber: 20
                    }, this)
                ]
            }, s.key, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 177,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 170,
        columnNumber: 5
    }, this);
}
_c6 = Timeline;
function Home() {
    _s3();
    const [msgs, setMsgs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            role: "assistant",
            content: "Hi, I'm Tuma. Tell me who you're sending money to and how much. You can write in English, Swahili, French or Pidgin, or tap the mic."
        }
    ]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pending, setPending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [checkout, setCheckout] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [details, setDetails] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [captured, setCaptured] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [track, setTrack] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [receipt, setReceipt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [transcribing, setTranscribing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const recRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [listening, setListening] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const endRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [confirming, setConfirming] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const online = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribeOnline, {
        "Home.useSyncExternalStore[online]": ()=>navigator.onLine
    }["Home.useSyncExternalStore[online]"], {
        "Home.useSyncExternalStore[online]": ()=>true
    }["Home.useSyncExternalStore[online]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            endRef.current?.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                block: "end"
            });
        }
    }["Home.useEffect"], [
        msgs,
        pending,
        checkout,
        captured,
        track,
        receipt,
        busy
    ]);
    // the quote plus the recipient details the sender confirmed in the form
    const effective = pending && details ? {
        ...pending,
        recipientName: details.name,
        recipientEmail: details.email
    } : null;
    const stage = captured || track ? 3 : checkout ? 2 : pending ? 1 : 0;
    const finished = track ? [
        "delivered",
        "failed"
    ].includes(track.transfer.status) : false;
    // Spoken to screen readers whenever the transfer moves forward
    const announce = track ? track.transfer.status === "delivered" ? `Delivered to ${track.transfer.recipient_name}.` : track.transfer.status === "failed" ? "The transfer didn't go through." : track.events.some((e)=>e.to_status === "payout_pending") ? "Sent to their PayPal account." : "Payment received." : captured ? "Payment approved. Confirming with PayPal." : "";
    async function send(override) {
        const text = (override ?? input).trim();
        if (!text || busy || !online) return;
        const next = [
            ...msgs,
            {
                role: "user",
                content: text
            }
        ];
        const awaiting = pending && !checkout && !track ? {
            recipient: pending.recipientName,
            amountUsd: pending.amountUsd
        } : null;
        setMsgs(next);
        setInput("");
        setBusy(true);
        setError("");
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messages: next,
                    awaiting
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setMsgs([
                ...next,
                {
                    role: "assistant",
                    content: data.reply
                }
            ]);
            if (data.pending) {
                // a new quote replaces the old state; keep the confirmed details only if it is the same recipient
                const np = data.pending;
                setDetails((d)=>d && d.name.toLowerCase() === np.recipientName.toLowerCase() ? d : null);
                setPending(np);
                setCheckout(null);
                setTrack(null);
                setReceipt("");
                setCaptured(false);
            }
        } catch (e) {
            setMsgs(msgs);
            setInput(text); // put the message back so nothing is lost
            setError(`Tuma couldn't reply: ${e.message}. Your message is back in the box. Check your connection, then press Send.`);
        }
        setBusy(false);
    }
    async function toggleVoice() {
        if (listening) {
            recRef.current?.stop();
            return;
        }
        if (transcribing || busy) return;
        try {
            const rec = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$voice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startRecording"])();
            recRef.current = rec;
            setListening(true);
            setError("");
            const wav = await rec.result;
            setListening(false);
            setTranscribing(true);
            const res = await fetch("/api/transcribe", {
                method: "POST",
                headers: {
                    "Content-Type": "audio/wav"
                },
                body: wav
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            if (!data.text) setError("I couldn't hear anything. Tap the mic and try again, closer to your phone.");
            else await send(data.text); // the confirmation card re-checks the amount before any money moves
        } catch (e) {
            setListening(false);
            setError(e.name === "NotAllowedError" ? "Microphone access is blocked. Allow it in your browser settings, or type your message." : e.message);
        }
        setTranscribing(false);
    }
    async function confirm() {
        if (!effective || confirming) return;
        setConfirming(true);
        setError("");
        try {
            const res = await fetch("/api/transfers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(effective)
            });
            const data = await res.json();
            if (!res.ok) setError(`Couldn't start the payment: ${data.error}`);
            else {
                setTrack(null);
                setReceipt("");
                setCaptured(false);
                setCheckout({
                    transferId: data.transferId,
                    orderId: data.orderId
                });
            }
        } catch  {
            setError("Couldn't reach the server. Check your connection, then press Confirm again.");
        }
        setConfirming(false);
    }
    async function poll(id) {
        for(let i = 0; i < 30; i++){
            const r = await fetch(`/api/transfers/${id}`);
            if (!r.ok) break;
            const d = await r.json();
            setTrack(d);
            if ([
                "delivered",
                "failed"
            ].includes(d.transfer.status)) {
                const rr = await fetch(`/api/transfers/${id}/receipt`, {
                    method: "POST"
                });
                if (rr.ok) {
                    const text = (await rr.json()).text;
                    setReceipt(text);
                    // keep a record of the transaction in the conversation itself
                    setMsgs((m)=>[
                            ...m,
                            {
                                role: "assistant",
                                content: `${text}\n\nReference: ${id.slice(0, 8).toUpperCase()}`
                            }
                        ]);
                }
                return;
            }
            await new Promise((r)=>setTimeout(r, 2000));
        }
        setError("This is taking longer than usual. Send “where is my money?” to check again.");
    }
    function reset() {
        setTrack(null);
        setReceipt("");
        setPending(null);
        setDetails(null);
        setCheckout(null);
        setCaptured(false);
        setError("");
        inputRef.current?.focus();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "mx-auto flex h-dvh max-w-md flex-col bg-background md:my-4 md:h-[calc(100dvh-2rem)] md:overflow-hidden md:rounded-[2rem] md:shadow-xl md:ring-1 md:ring-line",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "sr-only",
                role: "status",
                "aria-live": "polite",
                children: announce
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 314,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "px-5 pb-3 pt-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "grid h-9 w-9 place-items-center rounded-xl bg-brand text-on-brand",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            viewBox: "0 0 24 24",
                                            className: "h-5 w-5",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2.5",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            "aria-hidden": "true",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M5 12h14M13 6l6 6-6 6"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 319,
                                                columnNumber: 176
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 319,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 318,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "text-lg font-bold leading-none",
                                                children: "Tuma"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 322,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted",
                                                children: "Send money home"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 323,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 321,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 317,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "rounded-full bg-warn-soft px-2.5 py-1 text-xs font-semibold text-warn",
                                children: "Sandbox: no real money"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 326,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 316,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stepper, {
                        stage: stage
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 328,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 315,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-4",
                role: "log",
                "aria-live": "polite",
                "aria-label": "Conversation with Tuma",
                tabIndex: 0,
                children: [
                    msgs.map((m, i)=>{
                        const me = m.role === "user";
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: me ? "flex justify-end" : "flex",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `pop max-w-[85%] whitespace-pre-wrap px-3.5 py-2 text-[0.9375rem] leading-snug ${me ? "pop-me rounded-2xl rounded-tr-md bg-me" : "rounded-2xl rounded-tl-md bg-them ring-1 ring-line"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "sr-only",
                                        children: me ? "You: " : "Tuma: "
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 336,
                                        columnNumber: 214
                                    }, this),
                                    m.content
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 336,
                                columnNumber: 15
                            }, this)
                        }, i, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 335,
                            columnNumber: 13
                        }, this);
                    }),
                    busy && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Typing, {}, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 340,
                        columnNumber: 18
                    }, this),
                    msgs.length === 1 && !busy && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2 pt-1",
                        children: CHIPS.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>send(c),
                                className: "min-h-11 rounded-full bg-surface px-4 py-2 text-sm font-medium text-brand-ink ring-1 ring-edge transition hover:bg-brand-soft active:scale-95",
                                children: c
                            }, c, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 345,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 343,
                        columnNumber: 11
                    }, this),
                    pending && !checkout && !details && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RecipientForm, {
                        p: pending,
                        onSubmit: setDetails,
                        onCancel: ()=>{
                            setPending(null);
                            inputRef.current?.focus();
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 350,
                        columnNumber: 46
                    }, this),
                    effective && !checkout && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuoteCard, {
                        p: effective,
                        confirming: confirming,
                        onConfirm: confirm,
                        onChange: ()=>setDetails(null)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 351,
                        columnNumber: 36
                    }, this),
                    pending && checkout && !captured && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "slide-up rounded-3xl bg-surface p-5 ring-1 ring-line",
                        "aria-label": "Pay with PayPal",
                        ref: focusOnMount,
                        tabIndex: -1,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-muted",
                                children: "You pay"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 355,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-3xl font-bold tabular-nums",
                                children: usd(pending.quote.totalUsdCents)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 356,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mb-4 text-sm text-muted",
                                children: [
                                    "to send ",
                                    usd(pending.quote.amountUsdCents),
                                    " to ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "capitalize",
                                        children: (effective ?? pending).recipientName
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 357,
                                        columnNumber: 99
                                    }, this),
                                    ", including the ",
                                    usd(pending.quote.feeUsdCents),
                                    " fee."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 357,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$paypal$2f$react$2d$paypal$2d$js$2f$dist$2f$esm$2f$react$2d$paypal$2d$js$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PayPalScriptProvider"], {
                                options: {
                                    clientId: ("TURBOPACK compile-time value", "Ad15u4BqG4AF1bGzRx-VKmgma3BTYwQhRSnOg9EOkslvNeuc6ZxlbCQ2Pb2s3S-xA93p2DkLSIAEOFCM"),
                                    currency: "USD"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$paypal$2f$react$2d$paypal$2d$js$2f$dist$2f$esm$2f$react$2d$paypal$2d$js$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PayPalButtons"], {
                                    style: {
                                        layout: "vertical",
                                        shape: "pill",
                                        label: "pay"
                                    },
                                    createOrder: async ()=>checkout.orderId,
                                    onApprove: async ()=>{
                                        setCaptured(true);
                                        const r = await fetch(`/api/transfers/${checkout.transferId}/capture`, {
                                            method: "POST"
                                        });
                                        if (!r.ok) {
                                            setCaptured(false);
                                            return setError(`PayPal approved the payment, but we couldn't confirm it: ${(await r.json()).error}`);
                                        }
                                        poll(checkout.transferId);
                                    },
                                    onCancel: ()=>setError("Payment cancelled. Press the PayPal button to try again, or change the details."),
                                    onError: ()=>setError("PayPal couldn't complete the payment. Try again, or use a different payment method.")
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 359,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 358,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 354,
                        columnNumber: 11
                    }, this),
                    captured && !track && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "slide-up flex items-center gap-3 rounded-3xl bg-surface p-5 text-sm ring-1 ring-line",
                        role: "status",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "spinner h-5 w-5 rounded-full border-2 border-line border-t-brand"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 377,
                                columnNumber: 13
                            }, this),
                            "Payment approved. Confirming with PayPal…"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 376,
                        columnNumber: 11
                    }, this),
                    track && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "slide-up rounded-3xl bg-surface p-5 ring-1 ring-line",
                        "aria-label": "Transfer status",
                        ref: focusOnMount,
                        tabIndex: -1,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-4 flex items-center gap-3",
                                children: [
                                    track.transfer.status === "delivered" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {}, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 385,
                                        columnNumber: 57
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-lg font-bold",
                                                children: track.transfer.status === "delivered" ? `Delivered to ${track.transfer.recipient_name}` : track.transfer.status === "failed" ? "Transfer didn't go through" : `On its way to ${track.transfer.recipient_name}`
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 387,
                                                columnNumber: 17
                                            }, this),
                                            track.payoutStatus === "UNCLAIMED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-warn",
                                                children: "That email has no PayPal account yet. PayPal emailed them a link to claim the money."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 390,
                                                columnNumber: 56
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 386,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 384,
                                columnNumber: 13
                            }, this),
                            track.transfer.status !== "failed" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Timeline, {
                                t: track
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 393,
                                columnNumber: 52
                            }, this),
                            finished && !receipt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-4 text-sm text-muted",
                                children: "Writing your receipt…"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 394,
                                columnNumber: 38
                            }, this),
                            finished && checkout && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-3 text-xs text-muted",
                                children: [
                                    "Reference ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "select-all font-semibold text-foreground",
                                        children: checkout.transferId.slice(0, 8).toUpperCase()
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 395,
                                        columnNumber: 87
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 395,
                                columnNumber: 38
                            }, this),
                            finished && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: reset,
                                className: "mt-4 w-full rounded-full bg-brand py-3 font-semibold text-on-brand transition active:scale-[.98]",
                                children: "Send another"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 397,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 383,
                        columnNumber: 11
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        role: "alert",
                        className: "slide-up rounded-2xl bg-danger/10 p-3 text-sm text-danger",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 402,
                        columnNumber: 19
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: endRef
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 403,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 331,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "border-t border-line bg-surface/80 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: (e)=>{
                            e.preventDefault();
                            send();
                        },
                        "aria-label": "Message Tuma",
                        className: "flex items-center gap-1 rounded-full bg-background py-1.5 pl-3 pr-1.5 ring-1 ring-edge focus-within:ring-2 focus-within:ring-brand",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "message",
                                className: "sr-only",
                                children: "Message to Tuma. Say who to pay and how much."
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 408,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                id: "message",
                                ref: inputRef,
                                value: input,
                                onChange: (e)=>setInput(e.target.value),
                                enterKeyHint: "send",
                                autoComplete: "off",
                                placeholder: "Send $50 to mama…",
                                className: "min-w-0 flex-1 bg-transparent px-1 py-2 text-[0.9375rem] outline-none placeholder:text-muted"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 409,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: toggleVoice,
                                disabled: transcribing || !online,
                                "aria-label": listening ? "Stop and send" : "Speak your request",
                                className: "relative grid h-11 w-11 place-items-center rounded-full text-muted hover:text-foreground",
                                children: [
                                    listening && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ring absolute inset-0 rounded-full bg-danger/30"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 411,
                                        columnNumber: 27
                                    }, this),
                                    transcribing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "spinner absolute h-5 w-5 rounded-full border-2 border-line border-t-brand"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 412,
                                        columnNumber: 30
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        viewBox: "0 0 24 24",
                                        className: `relative h-5 w-5 ${listening ? "text-danger" : ""} ${transcribing ? "opacity-0" : ""}`,
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        "aria-hidden": "true",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "9",
                                                y: "3",
                                                width: "6",
                                                height: "11",
                                                rx: "3"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 413,
                                                columnNumber: 252
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M5 11a7 7 0 0 0 14 0M12 18v3"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 413,
                                                columnNumber: 301
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 413,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 410,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: busy || !online || !input.trim(),
                                "aria-label": "Send message",
                                className: "grid h-11 w-11 place-items-center rounded-full bg-brand text-on-brand transition active:scale-90 disabled:opacity-40",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    viewBox: "0 0 24 24",
                                    className: "h-5 w-5",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "2.5",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    "aria-hidden": "true",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M5 12h14M13 6l6 6-6 6"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 416,
                                        columnNumber: 174
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 416,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 415,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 407,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1.5 h-4 text-center text-xs text-muted",
                        "aria-live": "polite",
                        children: !online ? "You're offline. Reconnect to send." : listening ? "Listening… tap the mic when you're done" : transcribing ? "Understanding what you said…" : ""
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 419,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 406,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 313,
        columnNumber: 5
    }, this);
}
_s3(Home, "UamdgRTIZDn3MRdDRQRN1LZ4DGE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
_c7 = Home;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
__turbopack_context__.k.register(_c, "Stepper");
__turbopack_context__.k.register(_c1, "Typing");
__turbopack_context__.k.register(_c2, "Row");
__turbopack_context__.k.register(_c3, "RecipientForm");
__turbopack_context__.k.register(_c4, "QuoteCard");
__turbopack_context__.k.register(_c5, "Check");
__turbopack_context__.k.register(_c6, "Timeline");
__turbopack_context__.k.register(_c7, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/voice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Browser-side voice capture. Records the mic, converts to 16 kHz mono WAV (works on every browser),
// and hands it to /api/transcribe.
__turbopack_context__.s([
    "startRecording",
    ()=>startRecording
]);
async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
            echoCancellation: true,
            noiseSuppression: true
        }
    });
    const rec = new MediaRecorder(stream);
    const chunks = [];
    rec.ondataavailable = (e)=>{
        if (e.data.size) chunks.push(e.data);
    };
    const result = new Promise((resolve, reject)=>{
        rec.onstop = async ()=>{
            stream.getTracks().forEach((t)=>t.stop());
            try {
                resolve(await toWav(new Blob(chunks, {
                    type: rec.mimeType
                })));
            } catch (e) {
                reject(e);
            }
        };
        rec.onerror = ()=>reject(new Error("Recording failed"));
    });
    rec.start();
    const timer = setTimeout(()=>{
        if (rec.state === "recording") rec.stop();
    }, 20000); // 20 s cap
    return {
        result,
        stop: ()=>{
            clearTimeout(timer);
            if (rec.state === "recording") rec.stop();
        }
    };
}
async function toWav(blob) {
    const ctx = new AudioContext();
    const decoded = await ctx.decodeAudioData(await blob.arrayBuffer());
    await ctx.close();
    if (decoded.duration < 0.4) throw new Error("That was too short. Tap the mic, speak, then tap it again.");
    const rate = 16000;
    const off = new OfflineAudioContext(1, Math.ceil(decoded.duration * rate), rate);
    const src = off.createBufferSource();
    src.buffer = decoded;
    src.connect(off.destination);
    src.start();
    const pcm = (await off.startRendering()).getChannelData(0);
    const out = new DataView(new ArrayBuffer(44 + pcm.length * 2));
    const tag = (o, s)=>[
            ...s
        ].forEach((c, i)=>out.setUint8(o + i, c.charCodeAt(0)));
    tag(0, "RIFF");
    out.setUint32(4, 36 + pcm.length * 2, true);
    tag(8, "WAVE");
    tag(12, "fmt ");
    out.setUint32(16, 16, true);
    out.setUint16(20, 1, true);
    out.setUint16(22, 1, true);
    out.setUint32(24, rate, true);
    out.setUint32(28, rate * 2, true);
    out.setUint16(32, 2, true);
    out.setUint16(34, 16, true);
    tag(36, "data");
    out.setUint32(40, pcm.length * 2, true);
    pcm.forEach((s, i)=>{
        const v = Math.max(-1, Math.min(1, s));
        out.setInt16(44 + i * 2, v < 0 ? v * 0x8000 : v * 0x7fff, true);
    });
    return new Blob([
        out
    ], {
        type: "audio/wav"
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);})()

//# sourceMappingURL=_0nadkj35av-sv._.js.map