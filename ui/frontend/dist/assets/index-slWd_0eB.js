(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const c of l.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function t(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function r(o){if(o.ep)return;o.ep=!0;const l=t(o);fetch(o.href,l)}})();function Tx(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var Mf={exports:{}},Eo={},Ef={exports:{}},bt={};var vg;function wx(){if(vg)return bt;vg=1;var s=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),r=Symbol.for("react.strict_mode"),o=Symbol.for("react.profiler"),l=Symbol.for("react.provider"),c=Symbol.for("react.context"),f=Symbol.for("react.forward_ref"),p=Symbol.for("react.suspense"),m=Symbol.for("react.memo"),_=Symbol.for("react.lazy"),y=Symbol.iterator;function g(z){return z===null||typeof z!="object"?null:(z=y&&z[y]||z["@@iterator"],typeof z=="function"?z:null)}var S={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},E=Object.assign,A={};function x(z,ne,Le){this.props=z,this.context=ne,this.refs=A,this.updater=Le||S}x.prototype.isReactComponent={},x.prototype.setState=function(z,ne){if(typeof z!="object"&&typeof z!="function"&&z!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,z,ne,"setState")},x.prototype.forceUpdate=function(z){this.updater.enqueueForceUpdate(this,z,"forceUpdate")};function v(){}v.prototype=x.prototype;function C(z,ne,Le){this.props=z,this.context=ne,this.refs=A,this.updater=Le||S}var U=C.prototype=new v;U.constructor=C,E(U,x.prototype),U.isPureReactComponent=!0;var R=Array.isArray,G=Object.prototype.hasOwnProperty,D={current:null},V={key:!0,ref:!0,__self:!0,__source:!0};function w(z,ne,Le){var We,ze={},ce=null,Te=null;if(ne!=null)for(We in ne.ref!==void 0&&(Te=ne.ref),ne.key!==void 0&&(ce=""+ne.key),ne)G.call(ne,We)&&!V.hasOwnProperty(We)&&(ze[We]=ne[We]);var ve=arguments.length-2;if(ve===1)ze.children=Le;else if(1<ve){for(var Ve=Array(ve),et=0;et<ve;et++)Ve[et]=arguments[et+2];ze.children=Ve}if(z&&z.defaultProps)for(We in ve=z.defaultProps,ve)ze[We]===void 0&&(ze[We]=ve[We]);return{$$typeof:s,type:z,key:ce,ref:Te,props:ze,_owner:D.current}}function I(z,ne){return{$$typeof:s,type:z.type,key:ne,ref:z.ref,props:z.props,_owner:z._owner}}function X(z){return typeof z=="object"&&z!==null&&z.$$typeof===s}function k(z){var ne={"=":"=0",":":"=2"};return"$"+z.replace(/[=:]/g,function(Le){return ne[Le]})}var K=/\/+/g;function le(z,ne){return typeof z=="object"&&z!==null&&z.key!=null?k(""+z.key):ne.toString(36)}function ue(z,ne,Le,We,ze){var ce=typeof z;(ce==="undefined"||ce==="boolean")&&(z=null);var Te=!1;if(z===null)Te=!0;else switch(ce){case"string":case"number":Te=!0;break;case"object":switch(z.$$typeof){case s:case e:Te=!0}}if(Te)return Te=z,ze=ze(Te),z=We===""?"."+le(Te,0):We,R(ze)?(Le="",z!=null&&(Le=z.replace(K,"$&/")+"/"),ue(ze,ne,Le,"",function(et){return et})):ze!=null&&(X(ze)&&(ze=I(ze,Le+(!ze.key||Te&&Te.key===ze.key?"":(""+ze.key).replace(K,"$&/")+"/")+z)),ne.push(ze)),1;if(Te=0,We=We===""?".":We+":",R(z))for(var ve=0;ve<z.length;ve++){ce=z[ve];var Ve=We+le(ce,ve);Te+=ue(ce,ne,Le,Ve,ze)}else if(Ve=g(z),typeof Ve=="function")for(z=Ve.call(z),ve=0;!(ce=z.next()).done;)ce=ce.value,Ve=We+le(ce,ve++),Te+=ue(ce,ne,Le,Ve,ze);else if(ce==="object")throw ne=String(z),Error("Objects are not valid as a React child (found: "+(ne==="[object Object]"?"object with keys {"+Object.keys(z).join(", ")+"}":ne)+"). If you meant to render a collection of children, use an array instead.");return Te}function W(z,ne,Le){if(z==null)return z;var We=[],ze=0;return ue(z,We,"","",function(ce){return ne.call(Le,ce,ze++)}),We}function $(z){if(z._status===-1){var ne=z._result;ne=ne(),ne.then(function(Le){(z._status===0||z._status===-1)&&(z._status=1,z._result=Le)},function(Le){(z._status===0||z._status===-1)&&(z._status=2,z._result=Le)}),z._status===-1&&(z._status=0,z._result=ne)}if(z._status===1)return z._result.default;throw z._result}var Y={current:null},Q={transition:null},pe={ReactCurrentDispatcher:Y,ReactCurrentBatchConfig:Q,ReactCurrentOwner:D};function me(){throw Error("act(...) is not supported in production builds of React.")}return bt.Children={map:W,forEach:function(z,ne,Le){W(z,function(){ne.apply(this,arguments)},Le)},count:function(z){var ne=0;return W(z,function(){ne++}),ne},toArray:function(z){return W(z,function(ne){return ne})||[]},only:function(z){if(!X(z))throw Error("React.Children.only expected to receive a single React element child.");return z}},bt.Component=x,bt.Fragment=t,bt.Profiler=o,bt.PureComponent=C,bt.StrictMode=r,bt.Suspense=p,bt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=pe,bt.act=me,bt.cloneElement=function(z,ne,Le){if(z==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+z+".");var We=E({},z.props),ze=z.key,ce=z.ref,Te=z._owner;if(ne!=null){if(ne.ref!==void 0&&(ce=ne.ref,Te=D.current),ne.key!==void 0&&(ze=""+ne.key),z.type&&z.type.defaultProps)var ve=z.type.defaultProps;for(Ve in ne)G.call(ne,Ve)&&!V.hasOwnProperty(Ve)&&(We[Ve]=ne[Ve]===void 0&&ve!==void 0?ve[Ve]:ne[Ve])}var Ve=arguments.length-2;if(Ve===1)We.children=Le;else if(1<Ve){ve=Array(Ve);for(var et=0;et<Ve;et++)ve[et]=arguments[et+2];We.children=ve}return{$$typeof:s,type:z.type,key:ze,ref:ce,props:We,_owner:Te}},bt.createContext=function(z){return z={$$typeof:c,_currentValue:z,_currentValue2:z,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},z.Provider={$$typeof:l,_context:z},z.Consumer=z},bt.createElement=w,bt.createFactory=function(z){var ne=w.bind(null,z);return ne.type=z,ne},bt.createRef=function(){return{current:null}},bt.forwardRef=function(z){return{$$typeof:f,render:z}},bt.isValidElement=X,bt.lazy=function(z){return{$$typeof:_,_payload:{_status:-1,_result:z},_init:$}},bt.memo=function(z,ne){return{$$typeof:m,type:z,compare:ne===void 0?null:ne}},bt.startTransition=function(z){var ne=Q.transition;Q.transition={};try{z()}finally{Q.transition=ne}},bt.unstable_act=me,bt.useCallback=function(z,ne){return Y.current.useCallback(z,ne)},bt.useContext=function(z){return Y.current.useContext(z)},bt.useDebugValue=function(){},bt.useDeferredValue=function(z){return Y.current.useDeferredValue(z)},bt.useEffect=function(z,ne){return Y.current.useEffect(z,ne)},bt.useId=function(){return Y.current.useId()},bt.useImperativeHandle=function(z,ne,Le){return Y.current.useImperativeHandle(z,ne,Le)},bt.useInsertionEffect=function(z,ne){return Y.current.useInsertionEffect(z,ne)},bt.useLayoutEffect=function(z,ne){return Y.current.useLayoutEffect(z,ne)},bt.useMemo=function(z,ne){return Y.current.useMemo(z,ne)},bt.useReducer=function(z,ne,Le){return Y.current.useReducer(z,ne,Le)},bt.useRef=function(z){return Y.current.useRef(z)},bt.useState=function(z){return Y.current.useState(z)},bt.useSyncExternalStore=function(z,ne,Le){return Y.current.useSyncExternalStore(z,ne,Le)},bt.useTransition=function(){return Y.current.useTransition()},bt.version="18.3.1",bt}var xg;function Mh(){return xg||(xg=1,Ef.exports=wx()),Ef.exports}var yg;function bx(){if(yg)return Eo;yg=1;var s=Mh(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),r=Object.prototype.hasOwnProperty,o=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function c(f,p,m){var _,y={},g=null,S=null;m!==void 0&&(g=""+m),p.key!==void 0&&(g=""+p.key),p.ref!==void 0&&(S=p.ref);for(_ in p)r.call(p,_)&&!l.hasOwnProperty(_)&&(y[_]=p[_]);if(f&&f.defaultProps)for(_ in p=f.defaultProps,p)y[_]===void 0&&(y[_]=p[_]);return{$$typeof:e,type:f,key:g,ref:S,props:y,_owner:o.current}}return Eo.Fragment=t,Eo.jsx=c,Eo.jsxs=c,Eo}var Sg;function Ax(){return Sg||(Sg=1,Mf.exports=bx()),Mf.exports}var P=Ax(),at=Mh(),Ql={},Tf={exports:{}},ai={},wf={exports:{}},bf={};var Mg;function Rx(){return Mg||(Mg=1,(function(s){function e(Q,pe){var me=Q.length;Q.push(pe);e:for(;0<me;){var z=me-1>>>1,ne=Q[z];if(0<o(ne,pe))Q[z]=pe,Q[me]=ne,me=z;else break e}}function t(Q){return Q.length===0?null:Q[0]}function r(Q){if(Q.length===0)return null;var pe=Q[0],me=Q.pop();if(me!==pe){Q[0]=me;e:for(var z=0,ne=Q.length,Le=ne>>>1;z<Le;){var We=2*(z+1)-1,ze=Q[We],ce=We+1,Te=Q[ce];if(0>o(ze,me))ce<ne&&0>o(Te,ze)?(Q[z]=Te,Q[ce]=me,z=ce):(Q[z]=ze,Q[We]=me,z=We);else if(ce<ne&&0>o(Te,me))Q[z]=Te,Q[ce]=me,z=ce;else break e}}return pe}function o(Q,pe){var me=Q.sortIndex-pe.sortIndex;return me!==0?me:Q.id-pe.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;s.unstable_now=function(){return l.now()}}else{var c=Date,f=c.now();s.unstable_now=function(){return c.now()-f}}var p=[],m=[],_=1,y=null,g=3,S=!1,E=!1,A=!1,x=typeof setTimeout=="function"?setTimeout:null,v=typeof clearTimeout=="function"?clearTimeout:null,C=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function U(Q){for(var pe=t(m);pe!==null;){if(pe.callback===null)r(m);else if(pe.startTime<=Q)r(m),pe.sortIndex=pe.expirationTime,e(p,pe);else break;pe=t(m)}}function R(Q){if(A=!1,U(Q),!E)if(t(p)!==null)E=!0,$(G);else{var pe=t(m);pe!==null&&Y(R,pe.startTime-Q)}}function G(Q,pe){E=!1,A&&(A=!1,v(w),w=-1),S=!0;var me=g;try{for(U(pe),y=t(p);y!==null&&(!(y.expirationTime>pe)||Q&&!k());){var z=y.callback;if(typeof z=="function"){y.callback=null,g=y.priorityLevel;var ne=z(y.expirationTime<=pe);pe=s.unstable_now(),typeof ne=="function"?y.callback=ne:y===t(p)&&r(p),U(pe)}else r(p);y=t(p)}if(y!==null)var Le=!0;else{var We=t(m);We!==null&&Y(R,We.startTime-pe),Le=!1}return Le}finally{y=null,g=me,S=!1}}var D=!1,V=null,w=-1,I=5,X=-1;function k(){return!(s.unstable_now()-X<I)}function K(){if(V!==null){var Q=s.unstable_now();X=Q;var pe=!0;try{pe=V(!0,Q)}finally{pe?le():(D=!1,V=null)}}else D=!1}var le;if(typeof C=="function")le=function(){C(K)};else if(typeof MessageChannel<"u"){var ue=new MessageChannel,W=ue.port2;ue.port1.onmessage=K,le=function(){W.postMessage(null)}}else le=function(){x(K,0)};function $(Q){V=Q,D||(D=!0,le())}function Y(Q,pe){w=x(function(){Q(s.unstable_now())},pe)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(Q){Q.callback=null},s.unstable_continueExecution=function(){E||S||(E=!0,$(G))},s.unstable_forceFrameRate=function(Q){0>Q||125<Q?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):I=0<Q?Math.floor(1e3/Q):5},s.unstable_getCurrentPriorityLevel=function(){return g},s.unstable_getFirstCallbackNode=function(){return t(p)},s.unstable_next=function(Q){switch(g){case 1:case 2:case 3:var pe=3;break;default:pe=g}var me=g;g=pe;try{return Q()}finally{g=me}},s.unstable_pauseExecution=function(){},s.unstable_requestPaint=function(){},s.unstable_runWithPriority=function(Q,pe){switch(Q){case 1:case 2:case 3:case 4:case 5:break;default:Q=3}var me=g;g=Q;try{return pe()}finally{g=me}},s.unstable_scheduleCallback=function(Q,pe,me){var z=s.unstable_now();switch(typeof me=="object"&&me!==null?(me=me.delay,me=typeof me=="number"&&0<me?z+me:z):me=z,Q){case 1:var ne=-1;break;case 2:ne=250;break;case 5:ne=1073741823;break;case 4:ne=1e4;break;default:ne=5e3}return ne=me+ne,Q={id:_++,callback:pe,priorityLevel:Q,startTime:me,expirationTime:ne,sortIndex:-1},me>z?(Q.sortIndex=me,e(m,Q),t(p)===null&&Q===t(m)&&(A?(v(w),w=-1):A=!0,Y(R,me-z))):(Q.sortIndex=ne,e(p,Q),E||S||(E=!0,$(G))),Q},s.unstable_shouldYield=k,s.unstable_wrapCallback=function(Q){var pe=g;return function(){var me=g;g=pe;try{return Q.apply(this,arguments)}finally{g=me}}}})(bf)),bf}var Eg;function Cx(){return Eg||(Eg=1,wf.exports=Rx()),wf.exports}var Tg;function Px(){if(Tg)return ai;Tg=1;var s=Mh(),e=Cx();function t(n){for(var i="https://reactjs.org/docs/error-decoder.html?invariant="+n,a=1;a<arguments.length;a++)i+="&args[]="+encodeURIComponent(arguments[a]);return"Minified React error #"+n+"; visit "+i+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var r=new Set,o={};function l(n,i){c(n,i),c(n+"Capture",i)}function c(n,i){for(o[n]=i,n=0;n<i.length;n++)r.add(i[n])}var f=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),p=Object.prototype.hasOwnProperty,m=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,_={},y={};function g(n){return p.call(y,n)?!0:p.call(_,n)?!1:m.test(n)?y[n]=!0:(_[n]=!0,!1)}function S(n,i,a,u){if(a!==null&&a.type===0)return!1;switch(typeof i){case"function":case"symbol":return!0;case"boolean":return u?!1:a!==null?!a.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function E(n,i,a,u){if(i===null||typeof i>"u"||S(n,i,a,u))return!0;if(u)return!1;if(a!==null)switch(a.type){case 3:return!i;case 4:return i===!1;case 5:return isNaN(i);case 6:return isNaN(i)||1>i}return!1}function A(n,i,a,u,d,h,T){this.acceptsBooleans=i===2||i===3||i===4,this.attributeName=u,this.attributeNamespace=d,this.mustUseProperty=a,this.propertyName=n,this.type=i,this.sanitizeURL=h,this.removeEmptyString=T}var x={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){x[n]=new A(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var i=n[0];x[i]=new A(i,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){x[n]=new A(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){x[n]=new A(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){x[n]=new A(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){x[n]=new A(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){x[n]=new A(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){x[n]=new A(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){x[n]=new A(n,5,!1,n.toLowerCase(),null,!1,!1)});var v=/[\-:]([a-z])/g;function C(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var i=n.replace(v,C);x[i]=new A(i,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var i=n.replace(v,C);x[i]=new A(i,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var i=n.replace(v,C);x[i]=new A(i,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){x[n]=new A(n,1,!1,n.toLowerCase(),null,!1,!1)}),x.xlinkHref=new A("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){x[n]=new A(n,1,!1,n.toLowerCase(),null,!0,!0)});function U(n,i,a,u){var d=x.hasOwnProperty(i)?x[i]:null;(d!==null?d.type!==0:u||!(2<i.length)||i[0]!=="o"&&i[0]!=="O"||i[1]!=="n"&&i[1]!=="N")&&(E(i,a,d,u)&&(a=null),u||d===null?g(i)&&(a===null?n.removeAttribute(i):n.setAttribute(i,""+a)):d.mustUseProperty?n[d.propertyName]=a===null?d.type===3?!1:"":a:(i=d.attributeName,u=d.attributeNamespace,a===null?n.removeAttribute(i):(d=d.type,a=d===3||d===4&&a===!0?"":""+a,u?n.setAttributeNS(u,i,a):n.setAttribute(i,a))))}var R=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,G=Symbol.for("react.element"),D=Symbol.for("react.portal"),V=Symbol.for("react.fragment"),w=Symbol.for("react.strict_mode"),I=Symbol.for("react.profiler"),X=Symbol.for("react.provider"),k=Symbol.for("react.context"),K=Symbol.for("react.forward_ref"),le=Symbol.for("react.suspense"),ue=Symbol.for("react.suspense_list"),W=Symbol.for("react.memo"),$=Symbol.for("react.lazy"),Y=Symbol.for("react.offscreen"),Q=Symbol.iterator;function pe(n){return n===null||typeof n!="object"?null:(n=Q&&n[Q]||n["@@iterator"],typeof n=="function"?n:null)}var me=Object.assign,z;function ne(n){if(z===void 0)try{throw Error()}catch(a){var i=a.stack.trim().match(/\n( *(at )?)/);z=i&&i[1]||""}return`
`+z+n}var Le=!1;function We(n,i){if(!n||Le)return"";Le=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(i)if(i=function(){throw Error()},Object.defineProperty(i.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(i,[])}catch(fe){var u=fe}Reflect.construct(n,[],i)}else{try{i.call()}catch(fe){u=fe}n.call(i.prototype)}else{try{throw Error()}catch(fe){u=fe}n()}}catch(fe){if(fe&&u&&typeof fe.stack=="string"){for(var d=fe.stack.split(`
`),h=u.stack.split(`
`),T=d.length-1,F=h.length-1;1<=T&&0<=F&&d[T]!==h[F];)F--;for(;1<=T&&0<=F;T--,F--)if(d[T]!==h[F]){if(T!==1||F!==1)do if(T--,F--,0>F||d[T]!==h[F]){var j=`
`+d[T].replace(" at new "," at ");return n.displayName&&j.includes("<anonymous>")&&(j=j.replace("<anonymous>",n.displayName)),j}while(1<=T&&0<=F);break}}}finally{Le=!1,Error.prepareStackTrace=a}return(n=n?n.displayName||n.name:"")?ne(n):""}function ze(n){switch(n.tag){case 5:return ne(n.type);case 16:return ne("Lazy");case 13:return ne("Suspense");case 19:return ne("SuspenseList");case 0:case 2:case 15:return n=We(n.type,!1),n;case 11:return n=We(n.type.render,!1),n;case 1:return n=We(n.type,!0),n;default:return""}}function ce(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case V:return"Fragment";case D:return"Portal";case I:return"Profiler";case w:return"StrictMode";case le:return"Suspense";case ue:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case k:return(n.displayName||"Context")+".Consumer";case X:return(n._context.displayName||"Context")+".Provider";case K:var i=n.render;return n=n.displayName,n||(n=i.displayName||i.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case W:return i=n.displayName||null,i!==null?i:ce(n.type)||"Memo";case $:i=n._payload,n=n._init;try{return ce(n(i))}catch{}}return null}function Te(n){var i=n.type;switch(n.tag){case 24:return"Cache";case 9:return(i.displayName||"Context")+".Consumer";case 10:return(i._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=i.render,n=n.displayName||n.name||"",i.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return i;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ce(i);case 8:return i===w?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof i=="function")return i.displayName||i.name||null;if(typeof i=="string")return i}return null}function ve(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function Ve(n){var i=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(i==="checkbox"||i==="radio")}function et(n){var i=Ve(n)?"checked":"value",a=Object.getOwnPropertyDescriptor(n.constructor.prototype,i),u=""+n[i];if(!n.hasOwnProperty(i)&&typeof a<"u"&&typeof a.get=="function"&&typeof a.set=="function"){var d=a.get,h=a.set;return Object.defineProperty(n,i,{configurable:!0,get:function(){return d.call(this)},set:function(T){u=""+T,h.call(this,T)}}),Object.defineProperty(n,i,{enumerable:a.enumerable}),{getValue:function(){return u},setValue:function(T){u=""+T},stopTracking:function(){n._valueTracker=null,delete n[i]}}}}function rt(n){n._valueTracker||(n._valueTracker=et(n))}function Pt(n){if(!n)return!1;var i=n._valueTracker;if(!i)return!0;var a=i.getValue(),u="";return n&&(u=Ve(n)?n.checked?"true":"false":n.value),n=u,n!==a?(i.setValue(n),!0):!1}function ht(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function Et(n,i){var a=i.checked;return me({},i,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:a??n._wrapperState.initialChecked})}function At(n,i){var a=i.defaultValue==null?"":i.defaultValue,u=i.checked!=null?i.checked:i.defaultChecked;a=ve(i.value!=null?i.value:a),n._wrapperState={initialChecked:u,initialValue:a,controlled:i.type==="checkbox"||i.type==="radio"?i.checked!=null:i.value!=null}}function Se(n,i){i=i.checked,i!=null&&U(n,"checked",i,!1)}function Ce(n,i){Se(n,i);var a=ve(i.value),u=i.type;if(a!=null)u==="number"?(a===0&&n.value===""||n.value!=a)&&(n.value=""+a):n.value!==""+a&&(n.value=""+a);else if(u==="submit"||u==="reset"){n.removeAttribute("value");return}i.hasOwnProperty("value")?st(n,i.type,a):i.hasOwnProperty("defaultValue")&&st(n,i.type,ve(i.defaultValue)),i.checked==null&&i.defaultChecked!=null&&(n.defaultChecked=!!i.defaultChecked)}function He(n,i,a){if(i.hasOwnProperty("value")||i.hasOwnProperty("defaultValue")){var u=i.type;if(!(u!=="submit"&&u!=="reset"||i.value!==void 0&&i.value!==null))return;i=""+n._wrapperState.initialValue,a||i===n.value||(n.value=i),n.defaultValue=i}a=n.name,a!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,a!==""&&(n.name=a)}function st(n,i,a){(i!=="number"||ht(n.ownerDocument)!==n)&&(a==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+a&&(n.defaultValue=""+a))}var H=Array.isArray;function xt(n,i,a,u){if(n=n.options,i){i={};for(var d=0;d<a.length;d++)i["$"+a[d]]=!0;for(a=0;a<n.length;a++)d=i.hasOwnProperty("$"+n[a].value),n[a].selected!==d&&(n[a].selected=d),d&&u&&(n[a].defaultSelected=!0)}else{for(a=""+ve(a),i=null,d=0;d<n.length;d++){if(n[d].value===a){n[d].selected=!0,u&&(n[d].defaultSelected=!0);return}i!==null||n[d].disabled||(i=n[d])}i!==null&&(i.selected=!0)}}function dt(n,i){if(i.dangerouslySetInnerHTML!=null)throw Error(t(91));return me({},i,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function Tt(n,i){var a=i.value;if(a==null){if(a=i.children,i=i.defaultValue,a!=null){if(i!=null)throw Error(t(92));if(H(a)){if(1<a.length)throw Error(t(93));a=a[0]}i=a}i==null&&(i=""),a=i}n._wrapperState={initialValue:ve(a)}}function Oe(n,i){var a=ve(i.value),u=ve(i.defaultValue);a!=null&&(a=""+a,a!==n.value&&(n.value=a),i.defaultValue==null&&n.defaultValue!==a&&(n.defaultValue=a)),u!=null&&(n.defaultValue=""+u)}function Gt(n){var i=n.textContent;i===n._wrapperState.initialValue&&i!==""&&i!==null&&(n.value=i)}function N(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function M(n,i){return n==null||n==="http://www.w3.org/1999/xhtml"?N(i):n==="http://www.w3.org/2000/svg"&&i==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var ee,xe=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(i,a,u,d){MSApp.execUnsafeLocalFunction(function(){return n(i,a,u,d)})}:n})(function(n,i){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=i;else{for(ee=ee||document.createElement("div"),ee.innerHTML="<svg>"+i.valueOf().toString()+"</svg>",i=ee.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;i.firstChild;)n.appendChild(i.firstChild)}});function Ee(n,i){if(i){var a=n.firstChild;if(a&&a===n.lastChild&&a.nodeType===3){a.nodeValue=i;return}}n.textContent=i}var Pe={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Ie=["Webkit","ms","Moz","O"];Object.keys(Pe).forEach(function(n){Ie.forEach(function(i){i=i+n.charAt(0).toUpperCase()+n.substring(1),Pe[i]=Pe[n]})});function _e(n,i,a){return i==null||typeof i=="boolean"||i===""?"":a||typeof i!="number"||i===0||Pe.hasOwnProperty(n)&&Pe[n]?(""+i).trim():i+"px"}function L(n,i){n=n.style;for(var a in i)if(i.hasOwnProperty(a)){var u=a.indexOf("--")===0,d=_e(a,i[a],u);a==="float"&&(a="cssFloat"),u?n.setProperty(a,d):n[a]=d}}var O=me({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function ie(n,i){if(i){if(O[n]&&(i.children!=null||i.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(i.dangerouslySetInnerHTML!=null){if(i.children!=null)throw Error(t(60));if(typeof i.dangerouslySetInnerHTML!="object"||!("__html"in i.dangerouslySetInnerHTML))throw Error(t(61))}if(i.style!=null&&typeof i.style!="object")throw Error(t(62))}}function ae(n,i){if(n.indexOf("-")===-1)return typeof i.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var he=null;function Ue(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var Ne=null,Ye=null,B=null;function Me(n){if(n=oo(n)){if(typeof Ne!="function")throw Error(t(280));var i=n.stateNode;i&&(i=pl(i),Ne(n.stateNode,n.type,i))}}function ge(n){Ye?B?B.push(n):B=[n]:Ye=n}function Be(){if(Ye){var n=Ye,i=B;if(B=Ye=null,Me(n),i)for(n=0;n<i.length;n++)Me(i[n])}}function be(n,i){return n(i)}function ye(){}var qe=!1;function ut(n,i,a){if(qe)return n(i,a);qe=!0;try{return be(n,i,a)}finally{qe=!1,(Ye!==null||B!==null)&&(ye(),Be())}}function Ut(n,i){var a=n.stateNode;if(a===null)return null;var u=pl(a);if(u===null)return null;a=u[i];e:switch(i){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(u=!u.disabled)||(n=n.type,u=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!u;break e;default:n=!1}if(n)return null;if(a&&typeof a!="function")throw Error(t(231,i,typeof a));return a}var Nt=!1;if(f)try{var dn={};Object.defineProperty(dn,"passive",{get:function(){Nt=!0}}),window.addEventListener("test",dn,dn),window.removeEventListener("test",dn,dn)}catch{Nt=!1}function Vn(n,i,a,u,d,h,T,F,j){var fe=Array.prototype.slice.call(arguments,3);try{i.apply(a,fe)}catch(Ae){this.onError(Ae)}}var Jn=!1,$i=null,Ki=!1,_t=null,Lt={onError:function(n){Jn=!0,$i=n}};function Wt(n,i,a,u,d,h,T,F,j){Jn=!1,$i=null,Vn.apply(Lt,arguments)}function Gn(n,i,a,u,d,h,T,F,j){if(Wt.apply(this,arguments),Jn){if(Jn){var fe=$i;Jn=!1,$i=null}else throw Error(t(198));Ki||(Ki=!0,_t=fe)}}function Hn(n){var i=n,a=n;if(n.alternate)for(;i.return;)i=i.return;else{n=i;do i=n,(i.flags&4098)!==0&&(a=i.return),n=i.return;while(n)}return i.tag===3?a:null}function Rn(n){if(n.tag===13){var i=n.memoizedState;if(i===null&&(n=n.alternate,n!==null&&(i=n.memoizedState)),i!==null)return i.dehydrated}return null}function li(n){if(Hn(n)!==n)throw Error(t(188))}function Dn(n){var i=n.alternate;if(!i){if(i=Hn(n),i===null)throw Error(t(188));return i!==n?null:n}for(var a=n,u=i;;){var d=a.return;if(d===null)break;var h=d.alternate;if(h===null){if(u=d.return,u!==null){a=u;continue}break}if(d.child===h.child){for(h=d.child;h;){if(h===a)return li(d),n;if(h===u)return li(d),i;h=h.sibling}throw Error(t(188))}if(a.return!==u.return)a=d,u=h;else{for(var T=!1,F=d.child;F;){if(F===a){T=!0,a=d,u=h;break}if(F===u){T=!0,u=d,a=h;break}F=F.sibling}if(!T){for(F=h.child;F;){if(F===a){T=!0,a=h,u=d;break}if(F===u){T=!0,u=h,a=d;break}F=F.sibling}if(!T)throw Error(t(189))}}if(a.alternate!==u)throw Error(t(190))}if(a.tag!==3)throw Error(t(188));return a.stateNode.current===a?n:i}function _i(n){return n=Dn(n),n!==null?Wn(n):null}function Wn(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var i=Wn(n);if(i!==null)return i;n=n.sibling}return null}var gn=e.unstable_scheduleCallback,Lr=e.unstable_cancelCallback,Zi=e.unstable_shouldYield,ms=e.unstable_requestPaint,jt=e.unstable_now,Xs=e.unstable_getCurrentPriorityLevel,In=e.unstable_ImmediatePriority,b=e.unstable_UserBlockingPriority,J=e.unstable_NormalPriority,de=e.unstable_LowPriority,se=e.unstable_IdlePriority,re=null,ke=null;function $e(n){if(ke&&typeof ke.onCommitFiberRoot=="function")try{ke.onCommitFiberRoot(re,n,void 0,(n.current.flags&128)===128)}catch{}}var Fe=Math.clz32?Math.clz32:pt,Je=Math.log,it=Math.LN2;function pt(n){return n>>>=0,n===0?32:31-(Je(n)/it|0)|0}var mt=64,tt=4194304;function It(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function Xt(n,i){var a=n.pendingLanes;if(a===0)return 0;var u=0,d=n.suspendedLanes,h=n.pingedLanes,T=a&268435455;if(T!==0){var F=T&~d;F!==0?u=It(F):(h&=T,h!==0&&(u=It(h)))}else T=a&~d,T!==0?u=It(T):h!==0&&(u=It(h));if(u===0)return 0;if(i!==0&&i!==u&&(i&d)===0&&(d=u&-u,h=i&-i,d>=h||d===16&&(h&4194240)!==0))return i;if((u&4)!==0&&(u|=a&16),i=n.entangledLanes,i!==0)for(n=n.entanglements,i&=u;0<i;)a=31-Fe(i),d=1<<a,u|=n[a],i&=~d;return u}function Qt(n,i){switch(n){case 1:case 2:case 4:return i+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return i+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Bt(n,i){for(var a=n.suspendedLanes,u=n.pingedLanes,d=n.expirationTimes,h=n.pendingLanes;0<h;){var T=31-Fe(h),F=1<<T,j=d[T];j===-1?((F&a)===0||(F&u)!==0)&&(d[T]=Qt(F,i)):j<=i&&(n.expiredLanes|=F),h&=~F}}function fn(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function je(){var n=mt;return mt<<=1,(mt&4194240)===0&&(mt=64),n}function Cn(n){for(var i=[],a=0;31>a;a++)i.push(n);return i}function Mt(n,i,a){n.pendingLanes|=i,i!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,i=31-Fe(i),n[i]=a}function Qn(n,i){var a=n.pendingLanes&~i;n.pendingLanes=i,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=i,n.mutableReadLanes&=i,n.entangledLanes&=i,i=n.entanglements;var u=n.eventTimes;for(n=n.expirationTimes;0<a;){var d=31-Fe(a),h=1<<d;i[d]=0,u[d]=-1,n[d]=-1,a&=~h}}function ei(n,i){var a=n.entangledLanes|=i;for(n=n.entanglements;a;){var u=31-Fe(a),d=1<<u;d&i|n[u]&i&&(n[u]|=i),a&=~d}}var wt=0;function dr(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var zt,$t,Ci,Vt,Pi,Ji=!1,gs=[],Dr=null,Ir=null,Ur=null,ja=new Map,Xa=new Map,Fr=[],X_="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function tp(n,i){switch(n){case"focusin":case"focusout":Dr=null;break;case"dragenter":case"dragleave":Ir=null;break;case"mouseover":case"mouseout":Ur=null;break;case"pointerover":case"pointerout":ja.delete(i.pointerId);break;case"gotpointercapture":case"lostpointercapture":Xa.delete(i.pointerId)}}function Ya(n,i,a,u,d,h){return n===null||n.nativeEvent!==h?(n={blockedOn:i,domEventName:a,eventSystemFlags:u,nativeEvent:h,targetContainers:[d]},i!==null&&(i=oo(i),i!==null&&$t(i)),n):(n.eventSystemFlags|=u,i=n.targetContainers,d!==null&&i.indexOf(d)===-1&&i.push(d),n)}function Y_(n,i,a,u,d){switch(i){case"focusin":return Dr=Ya(Dr,n,i,a,u,d),!0;case"dragenter":return Ir=Ya(Ir,n,i,a,u,d),!0;case"mouseover":return Ur=Ya(Ur,n,i,a,u,d),!0;case"pointerover":var h=d.pointerId;return ja.set(h,Ya(ja.get(h)||null,n,i,a,u,d)),!0;case"gotpointercapture":return h=d.pointerId,Xa.set(h,Ya(Xa.get(h)||null,n,i,a,u,d)),!0}return!1}function np(n){var i=_s(n.target);if(i!==null){var a=Hn(i);if(a!==null){if(i=a.tag,i===13){if(i=Rn(a),i!==null){n.blockedOn=i,Pi(n.priority,function(){Ci(a)});return}}else if(i===3&&a.stateNode.current.memoizedState.isDehydrated){n.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}n.blockedOn=null}function el(n){if(n.blockedOn!==null)return!1;for(var i=n.targetContainers;0<i.length;){var a=qc(n.domEventName,n.eventSystemFlags,i[0],n.nativeEvent);if(a===null){a=n.nativeEvent;var u=new a.constructor(a.type,a);he=u,a.target.dispatchEvent(u),he=null}else return i=oo(a),i!==null&&$t(i),n.blockedOn=a,!1;i.shift()}return!0}function ip(n,i,a){el(n)&&a.delete(i)}function q_(){Ji=!1,Dr!==null&&el(Dr)&&(Dr=null),Ir!==null&&el(Ir)&&(Ir=null),Ur!==null&&el(Ur)&&(Ur=null),ja.forEach(ip),Xa.forEach(ip)}function qa(n,i){n.blockedOn===i&&(n.blockedOn=null,Ji||(Ji=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,q_)))}function $a(n){function i(d){return qa(d,n)}if(0<gs.length){qa(gs[0],n);for(var a=1;a<gs.length;a++){var u=gs[a];u.blockedOn===n&&(u.blockedOn=null)}}for(Dr!==null&&qa(Dr,n),Ir!==null&&qa(Ir,n),Ur!==null&&qa(Ur,n),ja.forEach(i),Xa.forEach(i),a=0;a<Fr.length;a++)u=Fr[a],u.blockedOn===n&&(u.blockedOn=null);for(;0<Fr.length&&(a=Fr[0],a.blockedOn===null);)np(a),a.blockedOn===null&&Fr.shift()}var Ys=R.ReactCurrentBatchConfig,tl=!0;function $_(n,i,a,u){var d=wt,h=Ys.transition;Ys.transition=null;try{wt=1,Yc(n,i,a,u)}finally{wt=d,Ys.transition=h}}function K_(n,i,a,u){var d=wt,h=Ys.transition;Ys.transition=null;try{wt=4,Yc(n,i,a,u)}finally{wt=d,Ys.transition=h}}function Yc(n,i,a,u){if(tl){var d=qc(n,i,a,u);if(d===null)dd(n,i,u,nl,a),tp(n,u);else if(Y_(d,n,i,a,u))u.stopPropagation();else if(tp(n,u),i&4&&-1<X_.indexOf(n)){for(;d!==null;){var h=oo(d);if(h!==null&&zt(h),h=qc(n,i,a,u),h===null&&dd(n,i,u,nl,a),h===d)break;d=h}d!==null&&u.stopPropagation()}else dd(n,i,u,null,a)}}var nl=null;function qc(n,i,a,u){if(nl=null,n=Ue(u),n=_s(n),n!==null)if(i=Hn(n),i===null)n=null;else if(a=i.tag,a===13){if(n=Rn(i),n!==null)return n;n=null}else if(a===3){if(i.stateNode.current.memoizedState.isDehydrated)return i.tag===3?i.stateNode.containerInfo:null;n=null}else i!==n&&(n=null);return nl=n,null}function rp(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Xs()){case In:return 1;case b:return 4;case J:case de:return 16;case se:return 536870912;default:return 16}default:return 16}}var Or=null,$c=null,il=null;function sp(){if(il)return il;var n,i=$c,a=i.length,u,d="value"in Or?Or.value:Or.textContent,h=d.length;for(n=0;n<a&&i[n]===d[n];n++);var T=a-n;for(u=1;u<=T&&i[a-u]===d[h-u];u++);return il=d.slice(n,1<u?1-u:void 0)}function rl(n){var i=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&i===13&&(n=13)):n=i,n===10&&(n=13),32<=n||n===13?n:0}function sl(){return!0}function ap(){return!1}function ui(n){function i(a,u,d,h,T){this._reactName=a,this._targetInst=d,this.type=u,this.nativeEvent=h,this.target=T,this.currentTarget=null;for(var F in n)n.hasOwnProperty(F)&&(a=n[F],this[F]=a?a(h):h[F]);return this.isDefaultPrevented=(h.defaultPrevented!=null?h.defaultPrevented:h.returnValue===!1)?sl:ap,this.isPropagationStopped=ap,this}return me(i.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=sl)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=sl)},persist:function(){},isPersistent:sl}),i}var qs={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Kc=ui(qs),Ka=me({},qs,{view:0,detail:0}),Z_=ui(Ka),Zc,Jc,Za,al=me({},Ka,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:ed,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==Za&&(Za&&n.type==="mousemove"?(Zc=n.screenX-Za.screenX,Jc=n.screenY-Za.screenY):Jc=Zc=0,Za=n),Zc)},movementY:function(n){return"movementY"in n?n.movementY:Jc}}),op=ui(al),J_=me({},al,{dataTransfer:0}),Q_=ui(J_),ev=me({},Ka,{relatedTarget:0}),Qc=ui(ev),tv=me({},qs,{animationName:0,elapsedTime:0,pseudoElement:0}),nv=ui(tv),iv=me({},qs,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),rv=ui(iv),sv=me({},qs,{data:0}),lp=ui(sv),av={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},ov={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},lv={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function uv(n){var i=this.nativeEvent;return i.getModifierState?i.getModifierState(n):(n=lv[n])?!!i[n]:!1}function ed(){return uv}var cv=me({},Ka,{key:function(n){if(n.key){var i=av[n.key]||n.key;if(i!=="Unidentified")return i}return n.type==="keypress"?(n=rl(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?ov[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:ed,charCode:function(n){return n.type==="keypress"?rl(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?rl(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),dv=ui(cv),fv=me({},al,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),up=ui(fv),hv=me({},Ka,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:ed}),pv=ui(hv),mv=me({},qs,{propertyName:0,elapsedTime:0,pseudoElement:0}),gv=ui(mv),_v=me({},al,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),vv=ui(_v),xv=[9,13,27,32],td=f&&"CompositionEvent"in window,Ja=null;f&&"documentMode"in document&&(Ja=document.documentMode);var yv=f&&"TextEvent"in window&&!Ja,cp=f&&(!td||Ja&&8<Ja&&11>=Ja),dp=" ",fp=!1;function hp(n,i){switch(n){case"keyup":return xv.indexOf(i.keyCode)!==-1;case"keydown":return i.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function pp(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var $s=!1;function Sv(n,i){switch(n){case"compositionend":return pp(i);case"keypress":return i.which!==32?null:(fp=!0,dp);case"textInput":return n=i.data,n===dp&&fp?null:n;default:return null}}function Mv(n,i){if($s)return n==="compositionend"||!td&&hp(n,i)?(n=sp(),il=$c=Or=null,$s=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(i.ctrlKey||i.altKey||i.metaKey)||i.ctrlKey&&i.altKey){if(i.char&&1<i.char.length)return i.char;if(i.which)return String.fromCharCode(i.which)}return null;case"compositionend":return cp&&i.locale!=="ko"?null:i.data;default:return null}}var Ev={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function mp(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i==="input"?!!Ev[n.type]:i==="textarea"}function gp(n,i,a,u){ge(u),i=dl(i,"onChange"),0<i.length&&(a=new Kc("onChange","change",null,a,u),n.push({event:a,listeners:i}))}var Qa=null,eo=null;function Tv(n){Ip(n,0)}function ol(n){var i=ea(n);if(Pt(i))return n}function wv(n,i){if(n==="change")return i}var _p=!1;if(f){var nd;if(f){var id="oninput"in document;if(!id){var vp=document.createElement("div");vp.setAttribute("oninput","return;"),id=typeof vp.oninput=="function"}nd=id}else nd=!1;_p=nd&&(!document.documentMode||9<document.documentMode)}function xp(){Qa&&(Qa.detachEvent("onpropertychange",yp),eo=Qa=null)}function yp(n){if(n.propertyName==="value"&&ol(eo)){var i=[];gp(i,eo,n,Ue(n)),ut(Tv,i)}}function bv(n,i,a){n==="focusin"?(xp(),Qa=i,eo=a,Qa.attachEvent("onpropertychange",yp)):n==="focusout"&&xp()}function Av(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return ol(eo)}function Rv(n,i){if(n==="click")return ol(i)}function Cv(n,i){if(n==="input"||n==="change")return ol(i)}function Pv(n,i){return n===i&&(n!==0||1/n===1/i)||n!==n&&i!==i}var Ni=typeof Object.is=="function"?Object.is:Pv;function to(n,i){if(Ni(n,i))return!0;if(typeof n!="object"||n===null||typeof i!="object"||i===null)return!1;var a=Object.keys(n),u=Object.keys(i);if(a.length!==u.length)return!1;for(u=0;u<a.length;u++){var d=a[u];if(!p.call(i,d)||!Ni(n[d],i[d]))return!1}return!0}function Sp(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function Mp(n,i){var a=Sp(n);n=0;for(var u;a;){if(a.nodeType===3){if(u=n+a.textContent.length,n<=i&&u>=i)return{node:a,offset:i-n};n=u}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=Sp(a)}}function Ep(n,i){return n&&i?n===i?!0:n&&n.nodeType===3?!1:i&&i.nodeType===3?Ep(n,i.parentNode):"contains"in n?n.contains(i):n.compareDocumentPosition?!!(n.compareDocumentPosition(i)&16):!1:!1}function Tp(){for(var n=window,i=ht();i instanceof n.HTMLIFrameElement;){try{var a=typeof i.contentWindow.location.href=="string"}catch{a=!1}if(a)n=i.contentWindow;else break;i=ht(n.document)}return i}function rd(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i&&(i==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||i==="textarea"||n.contentEditable==="true")}function Nv(n){var i=Tp(),a=n.focusedElem,u=n.selectionRange;if(i!==a&&a&&a.ownerDocument&&Ep(a.ownerDocument.documentElement,a)){if(u!==null&&rd(a)){if(i=u.start,n=u.end,n===void 0&&(n=i),"selectionStart"in a)a.selectionStart=i,a.selectionEnd=Math.min(n,a.value.length);else if(n=(i=a.ownerDocument||document)&&i.defaultView||window,n.getSelection){n=n.getSelection();var d=a.textContent.length,h=Math.min(u.start,d);u=u.end===void 0?h:Math.min(u.end,d),!n.extend&&h>u&&(d=u,u=h,h=d),d=Mp(a,h);var T=Mp(a,u);d&&T&&(n.rangeCount!==1||n.anchorNode!==d.node||n.anchorOffset!==d.offset||n.focusNode!==T.node||n.focusOffset!==T.offset)&&(i=i.createRange(),i.setStart(d.node,d.offset),n.removeAllRanges(),h>u?(n.addRange(i),n.extend(T.node,T.offset)):(i.setEnd(T.node,T.offset),n.addRange(i)))}}for(i=[],n=a;n=n.parentNode;)n.nodeType===1&&i.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof a.focus=="function"&&a.focus(),a=0;a<i.length;a++)n=i[a],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var Lv=f&&"documentMode"in document&&11>=document.documentMode,Ks=null,sd=null,no=null,ad=!1;function wp(n,i,a){var u=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;ad||Ks==null||Ks!==ht(u)||(u=Ks,"selectionStart"in u&&rd(u)?u={start:u.selectionStart,end:u.selectionEnd}:(u=(u.ownerDocument&&u.ownerDocument.defaultView||window).getSelection(),u={anchorNode:u.anchorNode,anchorOffset:u.anchorOffset,focusNode:u.focusNode,focusOffset:u.focusOffset}),no&&to(no,u)||(no=u,u=dl(sd,"onSelect"),0<u.length&&(i=new Kc("onSelect","select",null,i,a),n.push({event:i,listeners:u}),i.target=Ks)))}function ll(n,i){var a={};return a[n.toLowerCase()]=i.toLowerCase(),a["Webkit"+n]="webkit"+i,a["Moz"+n]="moz"+i,a}var Zs={animationend:ll("Animation","AnimationEnd"),animationiteration:ll("Animation","AnimationIteration"),animationstart:ll("Animation","AnimationStart"),transitionend:ll("Transition","TransitionEnd")},od={},bp={};f&&(bp=document.createElement("div").style,"AnimationEvent"in window||(delete Zs.animationend.animation,delete Zs.animationiteration.animation,delete Zs.animationstart.animation),"TransitionEvent"in window||delete Zs.transitionend.transition);function ul(n){if(od[n])return od[n];if(!Zs[n])return n;var i=Zs[n],a;for(a in i)if(i.hasOwnProperty(a)&&a in bp)return od[n]=i[a];return n}var Ap=ul("animationend"),Rp=ul("animationiteration"),Cp=ul("animationstart"),Pp=ul("transitionend"),Np=new Map,Lp="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function zr(n,i){Np.set(n,i),l(i,[n])}for(var ld=0;ld<Lp.length;ld++){var ud=Lp[ld],Dv=ud.toLowerCase(),Iv=ud[0].toUpperCase()+ud.slice(1);zr(Dv,"on"+Iv)}zr(Ap,"onAnimationEnd"),zr(Rp,"onAnimationIteration"),zr(Cp,"onAnimationStart"),zr("dblclick","onDoubleClick"),zr("focusin","onFocus"),zr("focusout","onBlur"),zr(Pp,"onTransitionEnd"),c("onMouseEnter",["mouseout","mouseover"]),c("onMouseLeave",["mouseout","mouseover"]),c("onPointerEnter",["pointerout","pointerover"]),c("onPointerLeave",["pointerout","pointerover"]),l("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),l("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),l("onBeforeInput",["compositionend","keypress","textInput","paste"]),l("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var io="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Uv=new Set("cancel close invalid load scroll toggle".split(" ").concat(io));function Dp(n,i,a){var u=n.type||"unknown-event";n.currentTarget=a,Gn(u,i,void 0,n),n.currentTarget=null}function Ip(n,i){i=(i&4)!==0;for(var a=0;a<n.length;a++){var u=n[a],d=u.event;u=u.listeners;e:{var h=void 0;if(i)for(var T=u.length-1;0<=T;T--){var F=u[T],j=F.instance,fe=F.currentTarget;if(F=F.listener,j!==h&&d.isPropagationStopped())break e;Dp(d,F,fe),h=j}else for(T=0;T<u.length;T++){if(F=u[T],j=F.instance,fe=F.currentTarget,F=F.listener,j!==h&&d.isPropagationStopped())break e;Dp(d,F,fe),h=j}}}if(Ki)throw n=_t,Ki=!1,_t=null,n}function Kt(n,i){var a=i[_d];a===void 0&&(a=i[_d]=new Set);var u=n+"__bubble";a.has(u)||(Up(i,n,2,!1),a.add(u))}function cd(n,i,a){var u=0;i&&(u|=4),Up(a,n,u,i)}var cl="_reactListening"+Math.random().toString(36).slice(2);function ro(n){if(!n[cl]){n[cl]=!0,r.forEach(function(a){a!=="selectionchange"&&(Uv.has(a)||cd(a,!1,n),cd(a,!0,n))});var i=n.nodeType===9?n:n.ownerDocument;i===null||i[cl]||(i[cl]=!0,cd("selectionchange",!1,i))}}function Up(n,i,a,u){switch(rp(i)){case 1:var d=$_;break;case 4:d=K_;break;default:d=Yc}a=d.bind(null,i,a,n),d=void 0,!Nt||i!=="touchstart"&&i!=="touchmove"&&i!=="wheel"||(d=!0),u?d!==void 0?n.addEventListener(i,a,{capture:!0,passive:d}):n.addEventListener(i,a,!0):d!==void 0?n.addEventListener(i,a,{passive:d}):n.addEventListener(i,a,!1)}function dd(n,i,a,u,d){var h=u;if((i&1)===0&&(i&2)===0&&u!==null)e:for(;;){if(u===null)return;var T=u.tag;if(T===3||T===4){var F=u.stateNode.containerInfo;if(F===d||F.nodeType===8&&F.parentNode===d)break;if(T===4)for(T=u.return;T!==null;){var j=T.tag;if((j===3||j===4)&&(j=T.stateNode.containerInfo,j===d||j.nodeType===8&&j.parentNode===d))return;T=T.return}for(;F!==null;){if(T=_s(F),T===null)return;if(j=T.tag,j===5||j===6){u=h=T;continue e}F=F.parentNode}}u=u.return}ut(function(){var fe=h,Ae=Ue(a),Re=[];e:{var we=Np.get(n);if(we!==void 0){var Xe=Kc,Ze=n;switch(n){case"keypress":if(rl(a)===0)break e;case"keydown":case"keyup":Xe=dv;break;case"focusin":Ze="focus",Xe=Qc;break;case"focusout":Ze="blur",Xe=Qc;break;case"beforeblur":case"afterblur":Xe=Qc;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":Xe=op;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":Xe=Q_;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":Xe=pv;break;case Ap:case Rp:case Cp:Xe=nv;break;case Pp:Xe=gv;break;case"scroll":Xe=Z_;break;case"wheel":Xe=vv;break;case"copy":case"cut":case"paste":Xe=rv;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":Xe=up}var Qe=(i&4)!==0,on=!Qe&&n==="scroll",te=Qe?we!==null?we+"Capture":null:we;Qe=[];for(var q=fe,oe;q!==null;){oe=q;var De=oe.stateNode;if(oe.tag===5&&De!==null&&(oe=De,te!==null&&(De=Ut(q,te),De!=null&&Qe.push(so(q,De,oe)))),on)break;q=q.return}0<Qe.length&&(we=new Xe(we,Ze,null,a,Ae),Re.push({event:we,listeners:Qe}))}}if((i&7)===0){e:{if(we=n==="mouseover"||n==="pointerover",Xe=n==="mouseout"||n==="pointerout",we&&a!==he&&(Ze=a.relatedTarget||a.fromElement)&&(_s(Ze)||Ze[fr]))break e;if((Xe||we)&&(we=Ae.window===Ae?Ae:(we=Ae.ownerDocument)?we.defaultView||we.parentWindow:window,Xe?(Ze=a.relatedTarget||a.toElement,Xe=fe,Ze=Ze?_s(Ze):null,Ze!==null&&(on=Hn(Ze),Ze!==on||Ze.tag!==5&&Ze.tag!==6)&&(Ze=null)):(Xe=null,Ze=fe),Xe!==Ze)){if(Qe=op,De="onMouseLeave",te="onMouseEnter",q="mouse",(n==="pointerout"||n==="pointerover")&&(Qe=up,De="onPointerLeave",te="onPointerEnter",q="pointer"),on=Xe==null?we:ea(Xe),oe=Ze==null?we:ea(Ze),we=new Qe(De,q+"leave",Xe,a,Ae),we.target=on,we.relatedTarget=oe,De=null,_s(Ae)===fe&&(Qe=new Qe(te,q+"enter",Ze,a,Ae),Qe.target=oe,Qe.relatedTarget=on,De=Qe),on=De,Xe&&Ze)t:{for(Qe=Xe,te=Ze,q=0,oe=Qe;oe;oe=Js(oe))q++;for(oe=0,De=te;De;De=Js(De))oe++;for(;0<q-oe;)Qe=Js(Qe),q--;for(;0<oe-q;)te=Js(te),oe--;for(;q--;){if(Qe===te||te!==null&&Qe===te.alternate)break t;Qe=Js(Qe),te=Js(te)}Qe=null}else Qe=null;Xe!==null&&Fp(Re,we,Xe,Qe,!1),Ze!==null&&on!==null&&Fp(Re,on,Ze,Qe,!0)}}e:{if(we=fe?ea(fe):window,Xe=we.nodeName&&we.nodeName.toLowerCase(),Xe==="select"||Xe==="input"&&we.type==="file")var nt=wv;else if(mp(we))if(_p)nt=Cv;else{nt=Av;var ot=bv}else(Xe=we.nodeName)&&Xe.toLowerCase()==="input"&&(we.type==="checkbox"||we.type==="radio")&&(nt=Rv);if(nt&&(nt=nt(n,fe))){gp(Re,nt,a,Ae);break e}ot&&ot(n,we,fe),n==="focusout"&&(ot=we._wrapperState)&&ot.controlled&&we.type==="number"&&st(we,"number",we.value)}switch(ot=fe?ea(fe):window,n){case"focusin":(mp(ot)||ot.contentEditable==="true")&&(Ks=ot,sd=fe,no=null);break;case"focusout":no=sd=Ks=null;break;case"mousedown":ad=!0;break;case"contextmenu":case"mouseup":case"dragend":ad=!1,wp(Re,a,Ae);break;case"selectionchange":if(Lv)break;case"keydown":case"keyup":wp(Re,a,Ae)}var lt;if(td)e:{switch(n){case"compositionstart":var ft="onCompositionStart";break e;case"compositionend":ft="onCompositionEnd";break e;case"compositionupdate":ft="onCompositionUpdate";break e}ft=void 0}else $s?hp(n,a)&&(ft="onCompositionEnd"):n==="keydown"&&a.keyCode===229&&(ft="onCompositionStart");ft&&(cp&&a.locale!=="ko"&&($s||ft!=="onCompositionStart"?ft==="onCompositionEnd"&&$s&&(lt=sp()):(Or=Ae,$c="value"in Or?Or.value:Or.textContent,$s=!0)),ot=dl(fe,ft),0<ot.length&&(ft=new lp(ft,n,null,a,Ae),Re.push({event:ft,listeners:ot}),lt?ft.data=lt:(lt=pp(a),lt!==null&&(ft.data=lt)))),(lt=yv?Sv(n,a):Mv(n,a))&&(fe=dl(fe,"onBeforeInput"),0<fe.length&&(Ae=new lp("onBeforeInput","beforeinput",null,a,Ae),Re.push({event:Ae,listeners:fe}),Ae.data=lt))}Ip(Re,i)})}function so(n,i,a){return{instance:n,listener:i,currentTarget:a}}function dl(n,i){for(var a=i+"Capture",u=[];n!==null;){var d=n,h=d.stateNode;d.tag===5&&h!==null&&(d=h,h=Ut(n,a),h!=null&&u.unshift(so(n,h,d)),h=Ut(n,i),h!=null&&u.push(so(n,h,d))),n=n.return}return u}function Js(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function Fp(n,i,a,u,d){for(var h=i._reactName,T=[];a!==null&&a!==u;){var F=a,j=F.alternate,fe=F.stateNode;if(j!==null&&j===u)break;F.tag===5&&fe!==null&&(F=fe,d?(j=Ut(a,h),j!=null&&T.unshift(so(a,j,F))):d||(j=Ut(a,h),j!=null&&T.push(so(a,j,F)))),a=a.return}T.length!==0&&n.push({event:i,listeners:T})}var Fv=/\r\n?/g,Ov=/\u0000|\uFFFD/g;function Op(n){return(typeof n=="string"?n:""+n).replace(Fv,`
`).replace(Ov,"")}function fl(n,i,a){if(i=Op(i),Op(n)!==i&&a)throw Error(t(425))}function hl(){}var fd=null,hd=null;function pd(n,i){return n==="textarea"||n==="noscript"||typeof i.children=="string"||typeof i.children=="number"||typeof i.dangerouslySetInnerHTML=="object"&&i.dangerouslySetInnerHTML!==null&&i.dangerouslySetInnerHTML.__html!=null}var md=typeof setTimeout=="function"?setTimeout:void 0,zv=typeof clearTimeout=="function"?clearTimeout:void 0,zp=typeof Promise=="function"?Promise:void 0,kv=typeof queueMicrotask=="function"?queueMicrotask:typeof zp<"u"?function(n){return zp.resolve(null).then(n).catch(Bv)}:md;function Bv(n){setTimeout(function(){throw n})}function gd(n,i){var a=i,u=0;do{var d=a.nextSibling;if(n.removeChild(a),d&&d.nodeType===8)if(a=d.data,a==="/$"){if(u===0){n.removeChild(d),$a(i);return}u--}else a!=="$"&&a!=="$?"&&a!=="$!"||u++;a=d}while(a);$a(i)}function kr(n){for(;n!=null;n=n.nextSibling){var i=n.nodeType;if(i===1||i===3)break;if(i===8){if(i=n.data,i==="$"||i==="$!"||i==="$?")break;if(i==="/$")return null}}return n}function kp(n){n=n.previousSibling;for(var i=0;n;){if(n.nodeType===8){var a=n.data;if(a==="$"||a==="$!"||a==="$?"){if(i===0)return n;i--}else a==="/$"&&i++}n=n.previousSibling}return null}var Qs=Math.random().toString(36).slice(2),Qi="__reactFiber$"+Qs,ao="__reactProps$"+Qs,fr="__reactContainer$"+Qs,_d="__reactEvents$"+Qs,Vv="__reactListeners$"+Qs,Gv="__reactHandles$"+Qs;function _s(n){var i=n[Qi];if(i)return i;for(var a=n.parentNode;a;){if(i=a[fr]||a[Qi]){if(a=i.alternate,i.child!==null||a!==null&&a.child!==null)for(n=kp(n);n!==null;){if(a=n[Qi])return a;n=kp(n)}return i}n=a,a=n.parentNode}return null}function oo(n){return n=n[Qi]||n[fr],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function ea(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function pl(n){return n[ao]||null}var vd=[],ta=-1;function Br(n){return{current:n}}function Zt(n){0>ta||(n.current=vd[ta],vd[ta]=null,ta--)}function Yt(n,i){ta++,vd[ta]=n.current,n.current=i}var Vr={},Un=Br(Vr),ti=Br(!1),vs=Vr;function na(n,i){var a=n.type.contextTypes;if(!a)return Vr;var u=n.stateNode;if(u&&u.__reactInternalMemoizedUnmaskedChildContext===i)return u.__reactInternalMemoizedMaskedChildContext;var d={},h;for(h in a)d[h]=i[h];return u&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=i,n.__reactInternalMemoizedMaskedChildContext=d),d}function ni(n){return n=n.childContextTypes,n!=null}function ml(){Zt(ti),Zt(Un)}function Bp(n,i,a){if(Un.current!==Vr)throw Error(t(168));Yt(Un,i),Yt(ti,a)}function Vp(n,i,a){var u=n.stateNode;if(i=i.childContextTypes,typeof u.getChildContext!="function")return a;u=u.getChildContext();for(var d in u)if(!(d in i))throw Error(t(108,Te(n)||"Unknown",d));return me({},a,u)}function gl(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||Vr,vs=Un.current,Yt(Un,n),Yt(ti,ti.current),!0}function Gp(n,i,a){var u=n.stateNode;if(!u)throw Error(t(169));a?(n=Vp(n,i,vs),u.__reactInternalMemoizedMergedChildContext=n,Zt(ti),Zt(Un),Yt(Un,n)):Zt(ti),Yt(ti,a)}var hr=null,_l=!1,xd=!1;function Hp(n){hr===null?hr=[n]:hr.push(n)}function Hv(n){_l=!0,Hp(n)}function Gr(){if(!xd&&hr!==null){xd=!0;var n=0,i=wt;try{var a=hr;for(wt=1;n<a.length;n++){var u=a[n];do u=u(!0);while(u!==null)}hr=null,_l=!1}catch(d){throw hr!==null&&(hr=hr.slice(n+1)),gn(In,Gr),d}finally{wt=i,xd=!1}}return null}var ia=[],ra=0,vl=null,xl=0,vi=[],xi=0,xs=null,pr=1,mr="";function ys(n,i){ia[ra++]=xl,ia[ra++]=vl,vl=n,xl=i}function Wp(n,i,a){vi[xi++]=pr,vi[xi++]=mr,vi[xi++]=xs,xs=n;var u=pr;n=mr;var d=32-Fe(u)-1;u&=~(1<<d),a+=1;var h=32-Fe(i)+d;if(30<h){var T=d-d%5;h=(u&(1<<T)-1).toString(32),u>>=T,d-=T,pr=1<<32-Fe(i)+d|a<<d|u,mr=h+n}else pr=1<<h|a<<d|u,mr=n}function yd(n){n.return!==null&&(ys(n,1),Wp(n,1,0))}function Sd(n){for(;n===vl;)vl=ia[--ra],ia[ra]=null,xl=ia[--ra],ia[ra]=null;for(;n===xs;)xs=vi[--xi],vi[xi]=null,mr=vi[--xi],vi[xi]=null,pr=vi[--xi],vi[xi]=null}var ci=null,di=null,en=!1,Li=null;function jp(n,i){var a=Ei(5,null,null,0);a.elementType="DELETED",a.stateNode=i,a.return=n,i=n.deletions,i===null?(n.deletions=[a],n.flags|=16):i.push(a)}function Xp(n,i){switch(n.tag){case 5:var a=n.type;return i=i.nodeType!==1||a.toLowerCase()!==i.nodeName.toLowerCase()?null:i,i!==null?(n.stateNode=i,ci=n,di=kr(i.firstChild),!0):!1;case 6:return i=n.pendingProps===""||i.nodeType!==3?null:i,i!==null?(n.stateNode=i,ci=n,di=null,!0):!1;case 13:return i=i.nodeType!==8?null:i,i!==null?(a=xs!==null?{id:pr,overflow:mr}:null,n.memoizedState={dehydrated:i,treeContext:a,retryLane:1073741824},a=Ei(18,null,null,0),a.stateNode=i,a.return=n,n.child=a,ci=n,di=null,!0):!1;default:return!1}}function Md(n){return(n.mode&1)!==0&&(n.flags&128)===0}function Ed(n){if(en){var i=di;if(i){var a=i;if(!Xp(n,i)){if(Md(n))throw Error(t(418));i=kr(a.nextSibling);var u=ci;i&&Xp(n,i)?jp(u,a):(n.flags=n.flags&-4097|2,en=!1,ci=n)}}else{if(Md(n))throw Error(t(418));n.flags=n.flags&-4097|2,en=!1,ci=n}}}function Yp(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;ci=n}function yl(n){if(n!==ci)return!1;if(!en)return Yp(n),en=!0,!1;var i;if((i=n.tag!==3)&&!(i=n.tag!==5)&&(i=n.type,i=i!=="head"&&i!=="body"&&!pd(n.type,n.memoizedProps)),i&&(i=di)){if(Md(n))throw qp(),Error(t(418));for(;i;)jp(n,i),i=kr(i.nextSibling)}if(Yp(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,i=0;n;){if(n.nodeType===8){var a=n.data;if(a==="/$"){if(i===0){di=kr(n.nextSibling);break e}i--}else a!=="$"&&a!=="$!"&&a!=="$?"||i++}n=n.nextSibling}di=null}}else di=ci?kr(n.stateNode.nextSibling):null;return!0}function qp(){for(var n=di;n;)n=kr(n.nextSibling)}function sa(){di=ci=null,en=!1}function Td(n){Li===null?Li=[n]:Li.push(n)}var Wv=R.ReactCurrentBatchConfig;function lo(n,i,a){if(n=a.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(a._owner){if(a=a._owner,a){if(a.tag!==1)throw Error(t(309));var u=a.stateNode}if(!u)throw Error(t(147,n));var d=u,h=""+n;return i!==null&&i.ref!==null&&typeof i.ref=="function"&&i.ref._stringRef===h?i.ref:(i=function(T){var F=d.refs;T===null?delete F[h]:F[h]=T},i._stringRef=h,i)}if(typeof n!="string")throw Error(t(284));if(!a._owner)throw Error(t(290,n))}return n}function Sl(n,i){throw n=Object.prototype.toString.call(i),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(i).join(", ")+"}":n))}function $p(n){var i=n._init;return i(n._payload)}function Kp(n){function i(te,q){if(n){var oe=te.deletions;oe===null?(te.deletions=[q],te.flags|=16):oe.push(q)}}function a(te,q){if(!n)return null;for(;q!==null;)i(te,q),q=q.sibling;return null}function u(te,q){for(te=new Map;q!==null;)q.key!==null?te.set(q.key,q):te.set(q.index,q),q=q.sibling;return te}function d(te,q){return te=Kr(te,q),te.index=0,te.sibling=null,te}function h(te,q,oe){return te.index=oe,n?(oe=te.alternate,oe!==null?(oe=oe.index,oe<q?(te.flags|=2,q):oe):(te.flags|=2,q)):(te.flags|=1048576,q)}function T(te){return n&&te.alternate===null&&(te.flags|=2),te}function F(te,q,oe,De){return q===null||q.tag!==6?(q=gf(oe,te.mode,De),q.return=te,q):(q=d(q,oe),q.return=te,q)}function j(te,q,oe,De){var nt=oe.type;return nt===V?Ae(te,q,oe.props.children,De,oe.key):q!==null&&(q.elementType===nt||typeof nt=="object"&&nt!==null&&nt.$$typeof===$&&$p(nt)===q.type)?(De=d(q,oe.props),De.ref=lo(te,q,oe),De.return=te,De):(De=jl(oe.type,oe.key,oe.props,null,te.mode,De),De.ref=lo(te,q,oe),De.return=te,De)}function fe(te,q,oe,De){return q===null||q.tag!==4||q.stateNode.containerInfo!==oe.containerInfo||q.stateNode.implementation!==oe.implementation?(q=_f(oe,te.mode,De),q.return=te,q):(q=d(q,oe.children||[]),q.return=te,q)}function Ae(te,q,oe,De,nt){return q===null||q.tag!==7?(q=Rs(oe,te.mode,De,nt),q.return=te,q):(q=d(q,oe),q.return=te,q)}function Re(te,q,oe){if(typeof q=="string"&&q!==""||typeof q=="number")return q=gf(""+q,te.mode,oe),q.return=te,q;if(typeof q=="object"&&q!==null){switch(q.$$typeof){case G:return oe=jl(q.type,q.key,q.props,null,te.mode,oe),oe.ref=lo(te,null,q),oe.return=te,oe;case D:return q=_f(q,te.mode,oe),q.return=te,q;case $:var De=q._init;return Re(te,De(q._payload),oe)}if(H(q)||pe(q))return q=Rs(q,te.mode,oe,null),q.return=te,q;Sl(te,q)}return null}function we(te,q,oe,De){var nt=q!==null?q.key:null;if(typeof oe=="string"&&oe!==""||typeof oe=="number")return nt!==null?null:F(te,q,""+oe,De);if(typeof oe=="object"&&oe!==null){switch(oe.$$typeof){case G:return oe.key===nt?j(te,q,oe,De):null;case D:return oe.key===nt?fe(te,q,oe,De):null;case $:return nt=oe._init,we(te,q,nt(oe._payload),De)}if(H(oe)||pe(oe))return nt!==null?null:Ae(te,q,oe,De,null);Sl(te,oe)}return null}function Xe(te,q,oe,De,nt){if(typeof De=="string"&&De!==""||typeof De=="number")return te=te.get(oe)||null,F(q,te,""+De,nt);if(typeof De=="object"&&De!==null){switch(De.$$typeof){case G:return te=te.get(De.key===null?oe:De.key)||null,j(q,te,De,nt);case D:return te=te.get(De.key===null?oe:De.key)||null,fe(q,te,De,nt);case $:var ot=De._init;return Xe(te,q,oe,ot(De._payload),nt)}if(H(De)||pe(De))return te=te.get(oe)||null,Ae(q,te,De,nt,null);Sl(q,De)}return null}function Ze(te,q,oe,De){for(var nt=null,ot=null,lt=q,ft=q=0,Tn=null;lt!==null&&ft<oe.length;ft++){lt.index>ft?(Tn=lt,lt=null):Tn=lt.sibling;var Ot=we(te,lt,oe[ft],De);if(Ot===null){lt===null&&(lt=Tn);break}n&&lt&&Ot.alternate===null&&i(te,lt),q=h(Ot,q,ft),ot===null?nt=Ot:ot.sibling=Ot,ot=Ot,lt=Tn}if(ft===oe.length)return a(te,lt),en&&ys(te,ft),nt;if(lt===null){for(;ft<oe.length;ft++)lt=Re(te,oe[ft],De),lt!==null&&(q=h(lt,q,ft),ot===null?nt=lt:ot.sibling=lt,ot=lt);return en&&ys(te,ft),nt}for(lt=u(te,lt);ft<oe.length;ft++)Tn=Xe(lt,te,ft,oe[ft],De),Tn!==null&&(n&&Tn.alternate!==null&&lt.delete(Tn.key===null?ft:Tn.key),q=h(Tn,q,ft),ot===null?nt=Tn:ot.sibling=Tn,ot=Tn);return n&&lt.forEach(function(Zr){return i(te,Zr)}),en&&ys(te,ft),nt}function Qe(te,q,oe,De){var nt=pe(oe);if(typeof nt!="function")throw Error(t(150));if(oe=nt.call(oe),oe==null)throw Error(t(151));for(var ot=nt=null,lt=q,ft=q=0,Tn=null,Ot=oe.next();lt!==null&&!Ot.done;ft++,Ot=oe.next()){lt.index>ft?(Tn=lt,lt=null):Tn=lt.sibling;var Zr=we(te,lt,Ot.value,De);if(Zr===null){lt===null&&(lt=Tn);break}n&&lt&&Zr.alternate===null&&i(te,lt),q=h(Zr,q,ft),ot===null?nt=Zr:ot.sibling=Zr,ot=Zr,lt=Tn}if(Ot.done)return a(te,lt),en&&ys(te,ft),nt;if(lt===null){for(;!Ot.done;ft++,Ot=oe.next())Ot=Re(te,Ot.value,De),Ot!==null&&(q=h(Ot,q,ft),ot===null?nt=Ot:ot.sibling=Ot,ot=Ot);return en&&ys(te,ft),nt}for(lt=u(te,lt);!Ot.done;ft++,Ot=oe.next())Ot=Xe(lt,te,ft,Ot.value,De),Ot!==null&&(n&&Ot.alternate!==null&&lt.delete(Ot.key===null?ft:Ot.key),q=h(Ot,q,ft),ot===null?nt=Ot:ot.sibling=Ot,ot=Ot);return n&&lt.forEach(function(Ex){return i(te,Ex)}),en&&ys(te,ft),nt}function on(te,q,oe,De){if(typeof oe=="object"&&oe!==null&&oe.type===V&&oe.key===null&&(oe=oe.props.children),typeof oe=="object"&&oe!==null){switch(oe.$$typeof){case G:e:{for(var nt=oe.key,ot=q;ot!==null;){if(ot.key===nt){if(nt=oe.type,nt===V){if(ot.tag===7){a(te,ot.sibling),q=d(ot,oe.props.children),q.return=te,te=q;break e}}else if(ot.elementType===nt||typeof nt=="object"&&nt!==null&&nt.$$typeof===$&&$p(nt)===ot.type){a(te,ot.sibling),q=d(ot,oe.props),q.ref=lo(te,ot,oe),q.return=te,te=q;break e}a(te,ot);break}else i(te,ot);ot=ot.sibling}oe.type===V?(q=Rs(oe.props.children,te.mode,De,oe.key),q.return=te,te=q):(De=jl(oe.type,oe.key,oe.props,null,te.mode,De),De.ref=lo(te,q,oe),De.return=te,te=De)}return T(te);case D:e:{for(ot=oe.key;q!==null;){if(q.key===ot)if(q.tag===4&&q.stateNode.containerInfo===oe.containerInfo&&q.stateNode.implementation===oe.implementation){a(te,q.sibling),q=d(q,oe.children||[]),q.return=te,te=q;break e}else{a(te,q);break}else i(te,q);q=q.sibling}q=_f(oe,te.mode,De),q.return=te,te=q}return T(te);case $:return ot=oe._init,on(te,q,ot(oe._payload),De)}if(H(oe))return Ze(te,q,oe,De);if(pe(oe))return Qe(te,q,oe,De);Sl(te,oe)}return typeof oe=="string"&&oe!==""||typeof oe=="number"?(oe=""+oe,q!==null&&q.tag===6?(a(te,q.sibling),q=d(q,oe),q.return=te,te=q):(a(te,q),q=gf(oe,te.mode,De),q.return=te,te=q),T(te)):a(te,q)}return on}var aa=Kp(!0),Zp=Kp(!1),Ml=Br(null),El=null,oa=null,wd=null;function bd(){wd=oa=El=null}function Ad(n){var i=Ml.current;Zt(Ml),n._currentValue=i}function Rd(n,i,a){for(;n!==null;){var u=n.alternate;if((n.childLanes&i)!==i?(n.childLanes|=i,u!==null&&(u.childLanes|=i)):u!==null&&(u.childLanes&i)!==i&&(u.childLanes|=i),n===a)break;n=n.return}}function la(n,i){El=n,wd=oa=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&i)!==0&&(ii=!0),n.firstContext=null)}function yi(n){var i=n._currentValue;if(wd!==n)if(n={context:n,memoizedValue:i,next:null},oa===null){if(El===null)throw Error(t(308));oa=n,El.dependencies={lanes:0,firstContext:n}}else oa=oa.next=n;return i}var Ss=null;function Cd(n){Ss===null?Ss=[n]:Ss.push(n)}function Jp(n,i,a,u){var d=i.interleaved;return d===null?(a.next=a,Cd(i)):(a.next=d.next,d.next=a),i.interleaved=a,gr(n,u)}function gr(n,i){n.lanes|=i;var a=n.alternate;for(a!==null&&(a.lanes|=i),a=n,n=n.return;n!==null;)n.childLanes|=i,a=n.alternate,a!==null&&(a.childLanes|=i),a=n,n=n.return;return a.tag===3?a.stateNode:null}var Hr=!1;function Pd(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Qp(n,i){n=n.updateQueue,i.updateQueue===n&&(i.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function _r(n,i){return{eventTime:n,lane:i,tag:0,payload:null,callback:null,next:null}}function Wr(n,i,a){var u=n.updateQueue;if(u===null)return null;if(u=u.shared,(Ft&2)!==0){var d=u.pending;return d===null?i.next=i:(i.next=d.next,d.next=i),u.pending=i,gr(n,a)}return d=u.interleaved,d===null?(i.next=i,Cd(u)):(i.next=d.next,d.next=i),u.interleaved=i,gr(n,a)}function Tl(n,i,a){if(i=i.updateQueue,i!==null&&(i=i.shared,(a&4194240)!==0)){var u=i.lanes;u&=n.pendingLanes,a|=u,i.lanes=a,ei(n,a)}}function em(n,i){var a=n.updateQueue,u=n.alternate;if(u!==null&&(u=u.updateQueue,a===u)){var d=null,h=null;if(a=a.firstBaseUpdate,a!==null){do{var T={eventTime:a.eventTime,lane:a.lane,tag:a.tag,payload:a.payload,callback:a.callback,next:null};h===null?d=h=T:h=h.next=T,a=a.next}while(a!==null);h===null?d=h=i:h=h.next=i}else d=h=i;a={baseState:u.baseState,firstBaseUpdate:d,lastBaseUpdate:h,shared:u.shared,effects:u.effects},n.updateQueue=a;return}n=a.lastBaseUpdate,n===null?a.firstBaseUpdate=i:n.next=i,a.lastBaseUpdate=i}function wl(n,i,a,u){var d=n.updateQueue;Hr=!1;var h=d.firstBaseUpdate,T=d.lastBaseUpdate,F=d.shared.pending;if(F!==null){d.shared.pending=null;var j=F,fe=j.next;j.next=null,T===null?h=fe:T.next=fe,T=j;var Ae=n.alternate;Ae!==null&&(Ae=Ae.updateQueue,F=Ae.lastBaseUpdate,F!==T&&(F===null?Ae.firstBaseUpdate=fe:F.next=fe,Ae.lastBaseUpdate=j))}if(h!==null){var Re=d.baseState;T=0,Ae=fe=j=null,F=h;do{var we=F.lane,Xe=F.eventTime;if((u&we)===we){Ae!==null&&(Ae=Ae.next={eventTime:Xe,lane:0,tag:F.tag,payload:F.payload,callback:F.callback,next:null});e:{var Ze=n,Qe=F;switch(we=i,Xe=a,Qe.tag){case 1:if(Ze=Qe.payload,typeof Ze=="function"){Re=Ze.call(Xe,Re,we);break e}Re=Ze;break e;case 3:Ze.flags=Ze.flags&-65537|128;case 0:if(Ze=Qe.payload,we=typeof Ze=="function"?Ze.call(Xe,Re,we):Ze,we==null)break e;Re=me({},Re,we);break e;case 2:Hr=!0}}F.callback!==null&&F.lane!==0&&(n.flags|=64,we=d.effects,we===null?d.effects=[F]:we.push(F))}else Xe={eventTime:Xe,lane:we,tag:F.tag,payload:F.payload,callback:F.callback,next:null},Ae===null?(fe=Ae=Xe,j=Re):Ae=Ae.next=Xe,T|=we;if(F=F.next,F===null){if(F=d.shared.pending,F===null)break;we=F,F=we.next,we.next=null,d.lastBaseUpdate=we,d.shared.pending=null}}while(!0);if(Ae===null&&(j=Re),d.baseState=j,d.firstBaseUpdate=fe,d.lastBaseUpdate=Ae,i=d.shared.interleaved,i!==null){d=i;do T|=d.lane,d=d.next;while(d!==i)}else h===null&&(d.shared.lanes=0);Ts|=T,n.lanes=T,n.memoizedState=Re}}function tm(n,i,a){if(n=i.effects,i.effects=null,n!==null)for(i=0;i<n.length;i++){var u=n[i],d=u.callback;if(d!==null){if(u.callback=null,u=a,typeof d!="function")throw Error(t(191,d));d.call(u)}}}var uo={},er=Br(uo),co=Br(uo),fo=Br(uo);function Ms(n){if(n===uo)throw Error(t(174));return n}function Nd(n,i){switch(Yt(fo,i),Yt(co,n),Yt(er,uo),n=i.nodeType,n){case 9:case 11:i=(i=i.documentElement)?i.namespaceURI:M(null,"");break;default:n=n===8?i.parentNode:i,i=n.namespaceURI||null,n=n.tagName,i=M(i,n)}Zt(er),Yt(er,i)}function ua(){Zt(er),Zt(co),Zt(fo)}function nm(n){Ms(fo.current);var i=Ms(er.current),a=M(i,n.type);i!==a&&(Yt(co,n),Yt(er,a))}function Ld(n){co.current===n&&(Zt(er),Zt(co))}var tn=Br(0);function bl(n){for(var i=n;i!==null;){if(i.tag===13){var a=i.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||a.data==="$?"||a.data==="$!"))return i}else if(i.tag===19&&i.memoizedProps.revealOrder!==void 0){if((i.flags&128)!==0)return i}else if(i.child!==null){i.child.return=i,i=i.child;continue}if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return null;i=i.return}i.sibling.return=i.return,i=i.sibling}return null}var Dd=[];function Id(){for(var n=0;n<Dd.length;n++)Dd[n]._workInProgressVersionPrimary=null;Dd.length=0}var Al=R.ReactCurrentDispatcher,Ud=R.ReactCurrentBatchConfig,Es=0,nn=null,_n=null,Mn=null,Rl=!1,ho=!1,po=0,jv=0;function Fn(){throw Error(t(321))}function Fd(n,i){if(i===null)return!1;for(var a=0;a<i.length&&a<n.length;a++)if(!Ni(n[a],i[a]))return!1;return!0}function Od(n,i,a,u,d,h){if(Es=h,nn=i,i.memoizedState=null,i.updateQueue=null,i.lanes=0,Al.current=n===null||n.memoizedState===null?$v:Kv,n=a(u,d),ho){h=0;do{if(ho=!1,po=0,25<=h)throw Error(t(301));h+=1,Mn=_n=null,i.updateQueue=null,Al.current=Zv,n=a(u,d)}while(ho)}if(Al.current=Nl,i=_n!==null&&_n.next!==null,Es=0,Mn=_n=nn=null,Rl=!1,i)throw Error(t(300));return n}function zd(){var n=po!==0;return po=0,n}function tr(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Mn===null?nn.memoizedState=Mn=n:Mn=Mn.next=n,Mn}function Si(){if(_n===null){var n=nn.alternate;n=n!==null?n.memoizedState:null}else n=_n.next;var i=Mn===null?nn.memoizedState:Mn.next;if(i!==null)Mn=i,_n=n;else{if(n===null)throw Error(t(310));_n=n,n={memoizedState:_n.memoizedState,baseState:_n.baseState,baseQueue:_n.baseQueue,queue:_n.queue,next:null},Mn===null?nn.memoizedState=Mn=n:Mn=Mn.next=n}return Mn}function mo(n,i){return typeof i=="function"?i(n):i}function kd(n){var i=Si(),a=i.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var u=_n,d=u.baseQueue,h=a.pending;if(h!==null){if(d!==null){var T=d.next;d.next=h.next,h.next=T}u.baseQueue=d=h,a.pending=null}if(d!==null){h=d.next,u=u.baseState;var F=T=null,j=null,fe=h;do{var Ae=fe.lane;if((Es&Ae)===Ae)j!==null&&(j=j.next={lane:0,action:fe.action,hasEagerState:fe.hasEagerState,eagerState:fe.eagerState,next:null}),u=fe.hasEagerState?fe.eagerState:n(u,fe.action);else{var Re={lane:Ae,action:fe.action,hasEagerState:fe.hasEagerState,eagerState:fe.eagerState,next:null};j===null?(F=j=Re,T=u):j=j.next=Re,nn.lanes|=Ae,Ts|=Ae}fe=fe.next}while(fe!==null&&fe!==h);j===null?T=u:j.next=F,Ni(u,i.memoizedState)||(ii=!0),i.memoizedState=u,i.baseState=T,i.baseQueue=j,a.lastRenderedState=u}if(n=a.interleaved,n!==null){d=n;do h=d.lane,nn.lanes|=h,Ts|=h,d=d.next;while(d!==n)}else d===null&&(a.lanes=0);return[i.memoizedState,a.dispatch]}function Bd(n){var i=Si(),a=i.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var u=a.dispatch,d=a.pending,h=i.memoizedState;if(d!==null){a.pending=null;var T=d=d.next;do h=n(h,T.action),T=T.next;while(T!==d);Ni(h,i.memoizedState)||(ii=!0),i.memoizedState=h,i.baseQueue===null&&(i.baseState=h),a.lastRenderedState=h}return[h,u]}function im(){}function rm(n,i){var a=nn,u=Si(),d=i(),h=!Ni(u.memoizedState,d);if(h&&(u.memoizedState=d,ii=!0),u=u.queue,Vd(om.bind(null,a,u,n),[n]),u.getSnapshot!==i||h||Mn!==null&&Mn.memoizedState.tag&1){if(a.flags|=2048,go(9,am.bind(null,a,u,d,i),void 0,null),En===null)throw Error(t(349));(Es&30)!==0||sm(a,i,d)}return d}function sm(n,i,a){n.flags|=16384,n={getSnapshot:i,value:a},i=nn.updateQueue,i===null?(i={lastEffect:null,stores:null},nn.updateQueue=i,i.stores=[n]):(a=i.stores,a===null?i.stores=[n]:a.push(n))}function am(n,i,a,u){i.value=a,i.getSnapshot=u,lm(i)&&um(n)}function om(n,i,a){return a(function(){lm(i)&&um(n)})}function lm(n){var i=n.getSnapshot;n=n.value;try{var a=i();return!Ni(n,a)}catch{return!0}}function um(n){var i=gr(n,1);i!==null&&Fi(i,n,1,-1)}function cm(n){var i=tr();return typeof n=="function"&&(n=n()),i.memoizedState=i.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:mo,lastRenderedState:n},i.queue=n,n=n.dispatch=qv.bind(null,nn,n),[i.memoizedState,n]}function go(n,i,a,u){return n={tag:n,create:i,destroy:a,deps:u,next:null},i=nn.updateQueue,i===null?(i={lastEffect:null,stores:null},nn.updateQueue=i,i.lastEffect=n.next=n):(a=i.lastEffect,a===null?i.lastEffect=n.next=n:(u=a.next,a.next=n,n.next=u,i.lastEffect=n)),n}function dm(){return Si().memoizedState}function Cl(n,i,a,u){var d=tr();nn.flags|=n,d.memoizedState=go(1|i,a,void 0,u===void 0?null:u)}function Pl(n,i,a,u){var d=Si();u=u===void 0?null:u;var h=void 0;if(_n!==null){var T=_n.memoizedState;if(h=T.destroy,u!==null&&Fd(u,T.deps)){d.memoizedState=go(i,a,h,u);return}}nn.flags|=n,d.memoizedState=go(1|i,a,h,u)}function fm(n,i){return Cl(8390656,8,n,i)}function Vd(n,i){return Pl(2048,8,n,i)}function hm(n,i){return Pl(4,2,n,i)}function pm(n,i){return Pl(4,4,n,i)}function mm(n,i){if(typeof i=="function")return n=n(),i(n),function(){i(null)};if(i!=null)return n=n(),i.current=n,function(){i.current=null}}function gm(n,i,a){return a=a!=null?a.concat([n]):null,Pl(4,4,mm.bind(null,i,n),a)}function Gd(){}function _m(n,i){var a=Si();i=i===void 0?null:i;var u=a.memoizedState;return u!==null&&i!==null&&Fd(i,u[1])?u[0]:(a.memoizedState=[n,i],n)}function vm(n,i){var a=Si();i=i===void 0?null:i;var u=a.memoizedState;return u!==null&&i!==null&&Fd(i,u[1])?u[0]:(n=n(),a.memoizedState=[n,i],n)}function xm(n,i,a){return(Es&21)===0?(n.baseState&&(n.baseState=!1,ii=!0),n.memoizedState=a):(Ni(a,i)||(a=je(),nn.lanes|=a,Ts|=a,n.baseState=!0),i)}function Xv(n,i){var a=wt;wt=a!==0&&4>a?a:4,n(!0);var u=Ud.transition;Ud.transition={};try{n(!1),i()}finally{wt=a,Ud.transition=u}}function ym(){return Si().memoizedState}function Yv(n,i,a){var u=qr(n);if(a={lane:u,action:a,hasEagerState:!1,eagerState:null,next:null},Sm(n))Mm(i,a);else if(a=Jp(n,i,a,u),a!==null){var d=Xn();Fi(a,n,u,d),Em(a,i,u)}}function qv(n,i,a){var u=qr(n),d={lane:u,action:a,hasEagerState:!1,eagerState:null,next:null};if(Sm(n))Mm(i,d);else{var h=n.alternate;if(n.lanes===0&&(h===null||h.lanes===0)&&(h=i.lastRenderedReducer,h!==null))try{var T=i.lastRenderedState,F=h(T,a);if(d.hasEagerState=!0,d.eagerState=F,Ni(F,T)){var j=i.interleaved;j===null?(d.next=d,Cd(i)):(d.next=j.next,j.next=d),i.interleaved=d;return}}catch{}a=Jp(n,i,d,u),a!==null&&(d=Xn(),Fi(a,n,u,d),Em(a,i,u))}}function Sm(n){var i=n.alternate;return n===nn||i!==null&&i===nn}function Mm(n,i){ho=Rl=!0;var a=n.pending;a===null?i.next=i:(i.next=a.next,a.next=i),n.pending=i}function Em(n,i,a){if((a&4194240)!==0){var u=i.lanes;u&=n.pendingLanes,a|=u,i.lanes=a,ei(n,a)}}var Nl={readContext:yi,useCallback:Fn,useContext:Fn,useEffect:Fn,useImperativeHandle:Fn,useInsertionEffect:Fn,useLayoutEffect:Fn,useMemo:Fn,useReducer:Fn,useRef:Fn,useState:Fn,useDebugValue:Fn,useDeferredValue:Fn,useTransition:Fn,useMutableSource:Fn,useSyncExternalStore:Fn,useId:Fn,unstable_isNewReconciler:!1},$v={readContext:yi,useCallback:function(n,i){return tr().memoizedState=[n,i===void 0?null:i],n},useContext:yi,useEffect:fm,useImperativeHandle:function(n,i,a){return a=a!=null?a.concat([n]):null,Cl(4194308,4,mm.bind(null,i,n),a)},useLayoutEffect:function(n,i){return Cl(4194308,4,n,i)},useInsertionEffect:function(n,i){return Cl(4,2,n,i)},useMemo:function(n,i){var a=tr();return i=i===void 0?null:i,n=n(),a.memoizedState=[n,i],n},useReducer:function(n,i,a){var u=tr();return i=a!==void 0?a(i):i,u.memoizedState=u.baseState=i,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:i},u.queue=n,n=n.dispatch=Yv.bind(null,nn,n),[u.memoizedState,n]},useRef:function(n){var i=tr();return n={current:n},i.memoizedState=n},useState:cm,useDebugValue:Gd,useDeferredValue:function(n){return tr().memoizedState=n},useTransition:function(){var n=cm(!1),i=n[0];return n=Xv.bind(null,n[1]),tr().memoizedState=n,[i,n]},useMutableSource:function(){},useSyncExternalStore:function(n,i,a){var u=nn,d=tr();if(en){if(a===void 0)throw Error(t(407));a=a()}else{if(a=i(),En===null)throw Error(t(349));(Es&30)!==0||sm(u,i,a)}d.memoizedState=a;var h={value:a,getSnapshot:i};return d.queue=h,fm(om.bind(null,u,h,n),[n]),u.flags|=2048,go(9,am.bind(null,u,h,a,i),void 0,null),a},useId:function(){var n=tr(),i=En.identifierPrefix;if(en){var a=mr,u=pr;a=(u&~(1<<32-Fe(u)-1)).toString(32)+a,i=":"+i+"R"+a,a=po++,0<a&&(i+="H"+a.toString(32)),i+=":"}else a=jv++,i=":"+i+"r"+a.toString(32)+":";return n.memoizedState=i},unstable_isNewReconciler:!1},Kv={readContext:yi,useCallback:_m,useContext:yi,useEffect:Vd,useImperativeHandle:gm,useInsertionEffect:hm,useLayoutEffect:pm,useMemo:vm,useReducer:kd,useRef:dm,useState:function(){return kd(mo)},useDebugValue:Gd,useDeferredValue:function(n){var i=Si();return xm(i,_n.memoizedState,n)},useTransition:function(){var n=kd(mo)[0],i=Si().memoizedState;return[n,i]},useMutableSource:im,useSyncExternalStore:rm,useId:ym,unstable_isNewReconciler:!1},Zv={readContext:yi,useCallback:_m,useContext:yi,useEffect:Vd,useImperativeHandle:gm,useInsertionEffect:hm,useLayoutEffect:pm,useMemo:vm,useReducer:Bd,useRef:dm,useState:function(){return Bd(mo)},useDebugValue:Gd,useDeferredValue:function(n){var i=Si();return _n===null?i.memoizedState=n:xm(i,_n.memoizedState,n)},useTransition:function(){var n=Bd(mo)[0],i=Si().memoizedState;return[n,i]},useMutableSource:im,useSyncExternalStore:rm,useId:ym,unstable_isNewReconciler:!1};function Di(n,i){if(n&&n.defaultProps){i=me({},i),n=n.defaultProps;for(var a in n)i[a]===void 0&&(i[a]=n[a]);return i}return i}function Hd(n,i,a,u){i=n.memoizedState,a=a(u,i),a=a==null?i:me({},i,a),n.memoizedState=a,n.lanes===0&&(n.updateQueue.baseState=a)}var Ll={isMounted:function(n){return(n=n._reactInternals)?Hn(n)===n:!1},enqueueSetState:function(n,i,a){n=n._reactInternals;var u=Xn(),d=qr(n),h=_r(u,d);h.payload=i,a!=null&&(h.callback=a),i=Wr(n,h,d),i!==null&&(Fi(i,n,d,u),Tl(i,n,d))},enqueueReplaceState:function(n,i,a){n=n._reactInternals;var u=Xn(),d=qr(n),h=_r(u,d);h.tag=1,h.payload=i,a!=null&&(h.callback=a),i=Wr(n,h,d),i!==null&&(Fi(i,n,d,u),Tl(i,n,d))},enqueueForceUpdate:function(n,i){n=n._reactInternals;var a=Xn(),u=qr(n),d=_r(a,u);d.tag=2,i!=null&&(d.callback=i),i=Wr(n,d,u),i!==null&&(Fi(i,n,u,a),Tl(i,n,u))}};function Tm(n,i,a,u,d,h,T){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(u,h,T):i.prototype&&i.prototype.isPureReactComponent?!to(a,u)||!to(d,h):!0}function wm(n,i,a){var u=!1,d=Vr,h=i.contextType;return typeof h=="object"&&h!==null?h=yi(h):(d=ni(i)?vs:Un.current,u=i.contextTypes,h=(u=u!=null)?na(n,d):Vr),i=new i(a,h),n.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=Ll,n.stateNode=i,i._reactInternals=n,u&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=d,n.__reactInternalMemoizedMaskedChildContext=h),i}function bm(n,i,a,u){n=i.state,typeof i.componentWillReceiveProps=="function"&&i.componentWillReceiveProps(a,u),typeof i.UNSAFE_componentWillReceiveProps=="function"&&i.UNSAFE_componentWillReceiveProps(a,u),i.state!==n&&Ll.enqueueReplaceState(i,i.state,null)}function Wd(n,i,a,u){var d=n.stateNode;d.props=a,d.state=n.memoizedState,d.refs={},Pd(n);var h=i.contextType;typeof h=="object"&&h!==null?d.context=yi(h):(h=ni(i)?vs:Un.current,d.context=na(n,h)),d.state=n.memoizedState,h=i.getDerivedStateFromProps,typeof h=="function"&&(Hd(n,i,h,a),d.state=n.memoizedState),typeof i.getDerivedStateFromProps=="function"||typeof d.getSnapshotBeforeUpdate=="function"||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(i=d.state,typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount(),i!==d.state&&Ll.enqueueReplaceState(d,d.state,null),wl(n,a,d,u),d.state=n.memoizedState),typeof d.componentDidMount=="function"&&(n.flags|=4194308)}function ca(n,i){try{var a="",u=i;do a+=ze(u),u=u.return;while(u);var d=a}catch(h){d=`
Error generating stack: `+h.message+`
`+h.stack}return{value:n,source:i,stack:d,digest:null}}function jd(n,i,a){return{value:n,source:null,stack:a??null,digest:i??null}}function Xd(n,i){try{console.error(i.value)}catch(a){setTimeout(function(){throw a})}}var Jv=typeof WeakMap=="function"?WeakMap:Map;function Am(n,i,a){a=_r(-1,a),a.tag=3,a.payload={element:null};var u=i.value;return a.callback=function(){kl||(kl=!0,lf=u),Xd(n,i)},a}function Rm(n,i,a){a=_r(-1,a),a.tag=3;var u=n.type.getDerivedStateFromError;if(typeof u=="function"){var d=i.value;a.payload=function(){return u(d)},a.callback=function(){Xd(n,i)}}var h=n.stateNode;return h!==null&&typeof h.componentDidCatch=="function"&&(a.callback=function(){Xd(n,i),typeof u!="function"&&(Xr===null?Xr=new Set([this]):Xr.add(this));var T=i.stack;this.componentDidCatch(i.value,{componentStack:T!==null?T:""})}),a}function Cm(n,i,a){var u=n.pingCache;if(u===null){u=n.pingCache=new Jv;var d=new Set;u.set(i,d)}else d=u.get(i),d===void 0&&(d=new Set,u.set(i,d));d.has(a)||(d.add(a),n=fx.bind(null,n,i,a),i.then(n,n))}function Pm(n){do{var i;if((i=n.tag===13)&&(i=n.memoizedState,i=i!==null?i.dehydrated!==null:!0),i)return n;n=n.return}while(n!==null);return null}function Nm(n,i,a,u,d){return(n.mode&1)===0?(n===i?n.flags|=65536:(n.flags|=128,a.flags|=131072,a.flags&=-52805,a.tag===1&&(a.alternate===null?a.tag=17:(i=_r(-1,1),i.tag=2,Wr(a,i,1))),a.lanes|=1),n):(n.flags|=65536,n.lanes=d,n)}var Qv=R.ReactCurrentOwner,ii=!1;function jn(n,i,a,u){i.child=n===null?Zp(i,null,a,u):aa(i,n.child,a,u)}function Lm(n,i,a,u,d){a=a.render;var h=i.ref;return la(i,d),u=Od(n,i,a,u,h,d),a=zd(),n!==null&&!ii?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~d,vr(n,i,d)):(en&&a&&yd(i),i.flags|=1,jn(n,i,u,d),i.child)}function Dm(n,i,a,u,d){if(n===null){var h=a.type;return typeof h=="function"&&!mf(h)&&h.defaultProps===void 0&&a.compare===null&&a.defaultProps===void 0?(i.tag=15,i.type=h,Im(n,i,h,u,d)):(n=jl(a.type,null,u,i,i.mode,d),n.ref=i.ref,n.return=i,i.child=n)}if(h=n.child,(n.lanes&d)===0){var T=h.memoizedProps;if(a=a.compare,a=a!==null?a:to,a(T,u)&&n.ref===i.ref)return vr(n,i,d)}return i.flags|=1,n=Kr(h,u),n.ref=i.ref,n.return=i,i.child=n}function Im(n,i,a,u,d){if(n!==null){var h=n.memoizedProps;if(to(h,u)&&n.ref===i.ref)if(ii=!1,i.pendingProps=u=h,(n.lanes&d)!==0)(n.flags&131072)!==0&&(ii=!0);else return i.lanes=n.lanes,vr(n,i,d)}return Yd(n,i,a,u,d)}function Um(n,i,a){var u=i.pendingProps,d=u.children,h=n!==null?n.memoizedState:null;if(u.mode==="hidden")if((i.mode&1)===0)i.memoizedState={baseLanes:0,cachePool:null,transitions:null},Yt(fa,fi),fi|=a;else{if((a&1073741824)===0)return n=h!==null?h.baseLanes|a:a,i.lanes=i.childLanes=1073741824,i.memoizedState={baseLanes:n,cachePool:null,transitions:null},i.updateQueue=null,Yt(fa,fi),fi|=n,null;i.memoizedState={baseLanes:0,cachePool:null,transitions:null},u=h!==null?h.baseLanes:a,Yt(fa,fi),fi|=u}else h!==null?(u=h.baseLanes|a,i.memoizedState=null):u=a,Yt(fa,fi),fi|=u;return jn(n,i,d,a),i.child}function Fm(n,i){var a=i.ref;(n===null&&a!==null||n!==null&&n.ref!==a)&&(i.flags|=512,i.flags|=2097152)}function Yd(n,i,a,u,d){var h=ni(a)?vs:Un.current;return h=na(i,h),la(i,d),a=Od(n,i,a,u,h,d),u=zd(),n!==null&&!ii?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~d,vr(n,i,d)):(en&&u&&yd(i),i.flags|=1,jn(n,i,a,d),i.child)}function Om(n,i,a,u,d){if(ni(a)){var h=!0;gl(i)}else h=!1;if(la(i,d),i.stateNode===null)Il(n,i),wm(i,a,u),Wd(i,a,u,d),u=!0;else if(n===null){var T=i.stateNode,F=i.memoizedProps;T.props=F;var j=T.context,fe=a.contextType;typeof fe=="object"&&fe!==null?fe=yi(fe):(fe=ni(a)?vs:Un.current,fe=na(i,fe));var Ae=a.getDerivedStateFromProps,Re=typeof Ae=="function"||typeof T.getSnapshotBeforeUpdate=="function";Re||typeof T.UNSAFE_componentWillReceiveProps!="function"&&typeof T.componentWillReceiveProps!="function"||(F!==u||j!==fe)&&bm(i,T,u,fe),Hr=!1;var we=i.memoizedState;T.state=we,wl(i,u,T,d),j=i.memoizedState,F!==u||we!==j||ti.current||Hr?(typeof Ae=="function"&&(Hd(i,a,Ae,u),j=i.memoizedState),(F=Hr||Tm(i,a,F,u,we,j,fe))?(Re||typeof T.UNSAFE_componentWillMount!="function"&&typeof T.componentWillMount!="function"||(typeof T.componentWillMount=="function"&&T.componentWillMount(),typeof T.UNSAFE_componentWillMount=="function"&&T.UNSAFE_componentWillMount()),typeof T.componentDidMount=="function"&&(i.flags|=4194308)):(typeof T.componentDidMount=="function"&&(i.flags|=4194308),i.memoizedProps=u,i.memoizedState=j),T.props=u,T.state=j,T.context=fe,u=F):(typeof T.componentDidMount=="function"&&(i.flags|=4194308),u=!1)}else{T=i.stateNode,Qp(n,i),F=i.memoizedProps,fe=i.type===i.elementType?F:Di(i.type,F),T.props=fe,Re=i.pendingProps,we=T.context,j=a.contextType,typeof j=="object"&&j!==null?j=yi(j):(j=ni(a)?vs:Un.current,j=na(i,j));var Xe=a.getDerivedStateFromProps;(Ae=typeof Xe=="function"||typeof T.getSnapshotBeforeUpdate=="function")||typeof T.UNSAFE_componentWillReceiveProps!="function"&&typeof T.componentWillReceiveProps!="function"||(F!==Re||we!==j)&&bm(i,T,u,j),Hr=!1,we=i.memoizedState,T.state=we,wl(i,u,T,d);var Ze=i.memoizedState;F!==Re||we!==Ze||ti.current||Hr?(typeof Xe=="function"&&(Hd(i,a,Xe,u),Ze=i.memoizedState),(fe=Hr||Tm(i,a,fe,u,we,Ze,j)||!1)?(Ae||typeof T.UNSAFE_componentWillUpdate!="function"&&typeof T.componentWillUpdate!="function"||(typeof T.componentWillUpdate=="function"&&T.componentWillUpdate(u,Ze,j),typeof T.UNSAFE_componentWillUpdate=="function"&&T.UNSAFE_componentWillUpdate(u,Ze,j)),typeof T.componentDidUpdate=="function"&&(i.flags|=4),typeof T.getSnapshotBeforeUpdate=="function"&&(i.flags|=1024)):(typeof T.componentDidUpdate!="function"||F===n.memoizedProps&&we===n.memoizedState||(i.flags|=4),typeof T.getSnapshotBeforeUpdate!="function"||F===n.memoizedProps&&we===n.memoizedState||(i.flags|=1024),i.memoizedProps=u,i.memoizedState=Ze),T.props=u,T.state=Ze,T.context=j,u=fe):(typeof T.componentDidUpdate!="function"||F===n.memoizedProps&&we===n.memoizedState||(i.flags|=4),typeof T.getSnapshotBeforeUpdate!="function"||F===n.memoizedProps&&we===n.memoizedState||(i.flags|=1024),u=!1)}return qd(n,i,a,u,h,d)}function qd(n,i,a,u,d,h){Fm(n,i);var T=(i.flags&128)!==0;if(!u&&!T)return d&&Gp(i,a,!1),vr(n,i,h);u=i.stateNode,Qv.current=i;var F=T&&typeof a.getDerivedStateFromError!="function"?null:u.render();return i.flags|=1,n!==null&&T?(i.child=aa(i,n.child,null,h),i.child=aa(i,null,F,h)):jn(n,i,F,h),i.memoizedState=u.state,d&&Gp(i,a,!0),i.child}function zm(n){var i=n.stateNode;i.pendingContext?Bp(n,i.pendingContext,i.pendingContext!==i.context):i.context&&Bp(n,i.context,!1),Nd(n,i.containerInfo)}function km(n,i,a,u,d){return sa(),Td(d),i.flags|=256,jn(n,i,a,u),i.child}var $d={dehydrated:null,treeContext:null,retryLane:0};function Kd(n){return{baseLanes:n,cachePool:null,transitions:null}}function Bm(n,i,a){var u=i.pendingProps,d=tn.current,h=!1,T=(i.flags&128)!==0,F;if((F=T)||(F=n!==null&&n.memoizedState===null?!1:(d&2)!==0),F?(h=!0,i.flags&=-129):(n===null||n.memoizedState!==null)&&(d|=1),Yt(tn,d&1),n===null)return Ed(i),n=i.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((i.mode&1)===0?i.lanes=1:n.data==="$!"?i.lanes=8:i.lanes=1073741824,null):(T=u.children,n=u.fallback,h?(u=i.mode,h=i.child,T={mode:"hidden",children:T},(u&1)===0&&h!==null?(h.childLanes=0,h.pendingProps=T):h=Xl(T,u,0,null),n=Rs(n,u,a,null),h.return=i,n.return=i,h.sibling=n,i.child=h,i.child.memoizedState=Kd(a),i.memoizedState=$d,n):Zd(i,T));if(d=n.memoizedState,d!==null&&(F=d.dehydrated,F!==null))return ex(n,i,T,u,F,d,a);if(h){h=u.fallback,T=i.mode,d=n.child,F=d.sibling;var j={mode:"hidden",children:u.children};return(T&1)===0&&i.child!==d?(u=i.child,u.childLanes=0,u.pendingProps=j,i.deletions=null):(u=Kr(d,j),u.subtreeFlags=d.subtreeFlags&14680064),F!==null?h=Kr(F,h):(h=Rs(h,T,a,null),h.flags|=2),h.return=i,u.return=i,u.sibling=h,i.child=u,u=h,h=i.child,T=n.child.memoizedState,T=T===null?Kd(a):{baseLanes:T.baseLanes|a,cachePool:null,transitions:T.transitions},h.memoizedState=T,h.childLanes=n.childLanes&~a,i.memoizedState=$d,u}return h=n.child,n=h.sibling,u=Kr(h,{mode:"visible",children:u.children}),(i.mode&1)===0&&(u.lanes=a),u.return=i,u.sibling=null,n!==null&&(a=i.deletions,a===null?(i.deletions=[n],i.flags|=16):a.push(n)),i.child=u,i.memoizedState=null,u}function Zd(n,i){return i=Xl({mode:"visible",children:i},n.mode,0,null),i.return=n,n.child=i}function Dl(n,i,a,u){return u!==null&&Td(u),aa(i,n.child,null,a),n=Zd(i,i.pendingProps.children),n.flags|=2,i.memoizedState=null,n}function ex(n,i,a,u,d,h,T){if(a)return i.flags&256?(i.flags&=-257,u=jd(Error(t(422))),Dl(n,i,T,u)):i.memoizedState!==null?(i.child=n.child,i.flags|=128,null):(h=u.fallback,d=i.mode,u=Xl({mode:"visible",children:u.children},d,0,null),h=Rs(h,d,T,null),h.flags|=2,u.return=i,h.return=i,u.sibling=h,i.child=u,(i.mode&1)!==0&&aa(i,n.child,null,T),i.child.memoizedState=Kd(T),i.memoizedState=$d,h);if((i.mode&1)===0)return Dl(n,i,T,null);if(d.data==="$!"){if(u=d.nextSibling&&d.nextSibling.dataset,u)var F=u.dgst;return u=F,h=Error(t(419)),u=jd(h,u,void 0),Dl(n,i,T,u)}if(F=(T&n.childLanes)!==0,ii||F){if(u=En,u!==null){switch(T&-T){case 4:d=2;break;case 16:d=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:d=32;break;case 536870912:d=268435456;break;default:d=0}d=(d&(u.suspendedLanes|T))!==0?0:d,d!==0&&d!==h.retryLane&&(h.retryLane=d,gr(n,d),Fi(u,n,d,-1))}return pf(),u=jd(Error(t(421))),Dl(n,i,T,u)}return d.data==="$?"?(i.flags|=128,i.child=n.child,i=hx.bind(null,n),d._reactRetry=i,null):(n=h.treeContext,di=kr(d.nextSibling),ci=i,en=!0,Li=null,n!==null&&(vi[xi++]=pr,vi[xi++]=mr,vi[xi++]=xs,pr=n.id,mr=n.overflow,xs=i),i=Zd(i,u.children),i.flags|=4096,i)}function Vm(n,i,a){n.lanes|=i;var u=n.alternate;u!==null&&(u.lanes|=i),Rd(n.return,i,a)}function Jd(n,i,a,u,d){var h=n.memoizedState;h===null?n.memoizedState={isBackwards:i,rendering:null,renderingStartTime:0,last:u,tail:a,tailMode:d}:(h.isBackwards=i,h.rendering=null,h.renderingStartTime=0,h.last=u,h.tail=a,h.tailMode=d)}function Gm(n,i,a){var u=i.pendingProps,d=u.revealOrder,h=u.tail;if(jn(n,i,u.children,a),u=tn.current,(u&2)!==0)u=u&1|2,i.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=i.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&Vm(n,a,i);else if(n.tag===19)Vm(n,a,i);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===i)break e;for(;n.sibling===null;){if(n.return===null||n.return===i)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}u&=1}if(Yt(tn,u),(i.mode&1)===0)i.memoizedState=null;else switch(d){case"forwards":for(a=i.child,d=null;a!==null;)n=a.alternate,n!==null&&bl(n)===null&&(d=a),a=a.sibling;a=d,a===null?(d=i.child,i.child=null):(d=a.sibling,a.sibling=null),Jd(i,!1,d,a,h);break;case"backwards":for(a=null,d=i.child,i.child=null;d!==null;){if(n=d.alternate,n!==null&&bl(n)===null){i.child=d;break}n=d.sibling,d.sibling=a,a=d,d=n}Jd(i,!0,a,null,h);break;case"together":Jd(i,!1,null,null,void 0);break;default:i.memoizedState=null}return i.child}function Il(n,i){(i.mode&1)===0&&n!==null&&(n.alternate=null,i.alternate=null,i.flags|=2)}function vr(n,i,a){if(n!==null&&(i.dependencies=n.dependencies),Ts|=i.lanes,(a&i.childLanes)===0)return null;if(n!==null&&i.child!==n.child)throw Error(t(153));if(i.child!==null){for(n=i.child,a=Kr(n,n.pendingProps),i.child=a,a.return=i;n.sibling!==null;)n=n.sibling,a=a.sibling=Kr(n,n.pendingProps),a.return=i;a.sibling=null}return i.child}function tx(n,i,a){switch(i.tag){case 3:zm(i),sa();break;case 5:nm(i);break;case 1:ni(i.type)&&gl(i);break;case 4:Nd(i,i.stateNode.containerInfo);break;case 10:var u=i.type._context,d=i.memoizedProps.value;Yt(Ml,u._currentValue),u._currentValue=d;break;case 13:if(u=i.memoizedState,u!==null)return u.dehydrated!==null?(Yt(tn,tn.current&1),i.flags|=128,null):(a&i.child.childLanes)!==0?Bm(n,i,a):(Yt(tn,tn.current&1),n=vr(n,i,a),n!==null?n.sibling:null);Yt(tn,tn.current&1);break;case 19:if(u=(a&i.childLanes)!==0,(n.flags&128)!==0){if(u)return Gm(n,i,a);i.flags|=128}if(d=i.memoizedState,d!==null&&(d.rendering=null,d.tail=null,d.lastEffect=null),Yt(tn,tn.current),u)break;return null;case 22:case 23:return i.lanes=0,Um(n,i,a)}return vr(n,i,a)}var Hm,Qd,Wm,jm;Hm=function(n,i){for(var a=i.child;a!==null;){if(a.tag===5||a.tag===6)n.appendChild(a.stateNode);else if(a.tag!==4&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===i)break;for(;a.sibling===null;){if(a.return===null||a.return===i)return;a=a.return}a.sibling.return=a.return,a=a.sibling}},Qd=function(){},Wm=function(n,i,a,u){var d=n.memoizedProps;if(d!==u){n=i.stateNode,Ms(er.current);var h=null;switch(a){case"input":d=Et(n,d),u=Et(n,u),h=[];break;case"select":d=me({},d,{value:void 0}),u=me({},u,{value:void 0}),h=[];break;case"textarea":d=dt(n,d),u=dt(n,u),h=[];break;default:typeof d.onClick!="function"&&typeof u.onClick=="function"&&(n.onclick=hl)}ie(a,u);var T;a=null;for(fe in d)if(!u.hasOwnProperty(fe)&&d.hasOwnProperty(fe)&&d[fe]!=null)if(fe==="style"){var F=d[fe];for(T in F)F.hasOwnProperty(T)&&(a||(a={}),a[T]="")}else fe!=="dangerouslySetInnerHTML"&&fe!=="children"&&fe!=="suppressContentEditableWarning"&&fe!=="suppressHydrationWarning"&&fe!=="autoFocus"&&(o.hasOwnProperty(fe)?h||(h=[]):(h=h||[]).push(fe,null));for(fe in u){var j=u[fe];if(F=d?.[fe],u.hasOwnProperty(fe)&&j!==F&&(j!=null||F!=null))if(fe==="style")if(F){for(T in F)!F.hasOwnProperty(T)||j&&j.hasOwnProperty(T)||(a||(a={}),a[T]="");for(T in j)j.hasOwnProperty(T)&&F[T]!==j[T]&&(a||(a={}),a[T]=j[T])}else a||(h||(h=[]),h.push(fe,a)),a=j;else fe==="dangerouslySetInnerHTML"?(j=j?j.__html:void 0,F=F?F.__html:void 0,j!=null&&F!==j&&(h=h||[]).push(fe,j)):fe==="children"?typeof j!="string"&&typeof j!="number"||(h=h||[]).push(fe,""+j):fe!=="suppressContentEditableWarning"&&fe!=="suppressHydrationWarning"&&(o.hasOwnProperty(fe)?(j!=null&&fe==="onScroll"&&Kt("scroll",n),h||F===j||(h=[])):(h=h||[]).push(fe,j))}a&&(h=h||[]).push("style",a);var fe=h;(i.updateQueue=fe)&&(i.flags|=4)}},jm=function(n,i,a,u){a!==u&&(i.flags|=4)};function _o(n,i){if(!en)switch(n.tailMode){case"hidden":i=n.tail;for(var a=null;i!==null;)i.alternate!==null&&(a=i),i=i.sibling;a===null?n.tail=null:a.sibling=null;break;case"collapsed":a=n.tail;for(var u=null;a!==null;)a.alternate!==null&&(u=a),a=a.sibling;u===null?i||n.tail===null?n.tail=null:n.tail.sibling=null:u.sibling=null}}function On(n){var i=n.alternate!==null&&n.alternate.child===n.child,a=0,u=0;if(i)for(var d=n.child;d!==null;)a|=d.lanes|d.childLanes,u|=d.subtreeFlags&14680064,u|=d.flags&14680064,d.return=n,d=d.sibling;else for(d=n.child;d!==null;)a|=d.lanes|d.childLanes,u|=d.subtreeFlags,u|=d.flags,d.return=n,d=d.sibling;return n.subtreeFlags|=u,n.childLanes=a,i}function nx(n,i,a){var u=i.pendingProps;switch(Sd(i),i.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return On(i),null;case 1:return ni(i.type)&&ml(),On(i),null;case 3:return u=i.stateNode,ua(),Zt(ti),Zt(Un),Id(),u.pendingContext&&(u.context=u.pendingContext,u.pendingContext=null),(n===null||n.child===null)&&(yl(i)?i.flags|=4:n===null||n.memoizedState.isDehydrated&&(i.flags&256)===0||(i.flags|=1024,Li!==null&&(df(Li),Li=null))),Qd(n,i),On(i),null;case 5:Ld(i);var d=Ms(fo.current);if(a=i.type,n!==null&&i.stateNode!=null)Wm(n,i,a,u,d),n.ref!==i.ref&&(i.flags|=512,i.flags|=2097152);else{if(!u){if(i.stateNode===null)throw Error(t(166));return On(i),null}if(n=Ms(er.current),yl(i)){u=i.stateNode,a=i.type;var h=i.memoizedProps;switch(u[Qi]=i,u[ao]=h,n=(i.mode&1)!==0,a){case"dialog":Kt("cancel",u),Kt("close",u);break;case"iframe":case"object":case"embed":Kt("load",u);break;case"video":case"audio":for(d=0;d<io.length;d++)Kt(io[d],u);break;case"source":Kt("error",u);break;case"img":case"image":case"link":Kt("error",u),Kt("load",u);break;case"details":Kt("toggle",u);break;case"input":At(u,h),Kt("invalid",u);break;case"select":u._wrapperState={wasMultiple:!!h.multiple},Kt("invalid",u);break;case"textarea":Tt(u,h),Kt("invalid",u)}ie(a,h),d=null;for(var T in h)if(h.hasOwnProperty(T)){var F=h[T];T==="children"?typeof F=="string"?u.textContent!==F&&(h.suppressHydrationWarning!==!0&&fl(u.textContent,F,n),d=["children",F]):typeof F=="number"&&u.textContent!==""+F&&(h.suppressHydrationWarning!==!0&&fl(u.textContent,F,n),d=["children",""+F]):o.hasOwnProperty(T)&&F!=null&&T==="onScroll"&&Kt("scroll",u)}switch(a){case"input":rt(u),He(u,h,!0);break;case"textarea":rt(u),Gt(u);break;case"select":case"option":break;default:typeof h.onClick=="function"&&(u.onclick=hl)}u=d,i.updateQueue=u,u!==null&&(i.flags|=4)}else{T=d.nodeType===9?d:d.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=N(a)),n==="http://www.w3.org/1999/xhtml"?a==="script"?(n=T.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof u.is=="string"?n=T.createElement(a,{is:u.is}):(n=T.createElement(a),a==="select"&&(T=n,u.multiple?T.multiple=!0:u.size&&(T.size=u.size))):n=T.createElementNS(n,a),n[Qi]=i,n[ao]=u,Hm(n,i,!1,!1),i.stateNode=n;e:{switch(T=ae(a,u),a){case"dialog":Kt("cancel",n),Kt("close",n),d=u;break;case"iframe":case"object":case"embed":Kt("load",n),d=u;break;case"video":case"audio":for(d=0;d<io.length;d++)Kt(io[d],n);d=u;break;case"source":Kt("error",n),d=u;break;case"img":case"image":case"link":Kt("error",n),Kt("load",n),d=u;break;case"details":Kt("toggle",n),d=u;break;case"input":At(n,u),d=Et(n,u),Kt("invalid",n);break;case"option":d=u;break;case"select":n._wrapperState={wasMultiple:!!u.multiple},d=me({},u,{value:void 0}),Kt("invalid",n);break;case"textarea":Tt(n,u),d=dt(n,u),Kt("invalid",n);break;default:d=u}ie(a,d),F=d;for(h in F)if(F.hasOwnProperty(h)){var j=F[h];h==="style"?L(n,j):h==="dangerouslySetInnerHTML"?(j=j?j.__html:void 0,j!=null&&xe(n,j)):h==="children"?typeof j=="string"?(a!=="textarea"||j!=="")&&Ee(n,j):typeof j=="number"&&Ee(n,""+j):h!=="suppressContentEditableWarning"&&h!=="suppressHydrationWarning"&&h!=="autoFocus"&&(o.hasOwnProperty(h)?j!=null&&h==="onScroll"&&Kt("scroll",n):j!=null&&U(n,h,j,T))}switch(a){case"input":rt(n),He(n,u,!1);break;case"textarea":rt(n),Gt(n);break;case"option":u.value!=null&&n.setAttribute("value",""+ve(u.value));break;case"select":n.multiple=!!u.multiple,h=u.value,h!=null?xt(n,!!u.multiple,h,!1):u.defaultValue!=null&&xt(n,!!u.multiple,u.defaultValue,!0);break;default:typeof d.onClick=="function"&&(n.onclick=hl)}switch(a){case"button":case"input":case"select":case"textarea":u=!!u.autoFocus;break e;case"img":u=!0;break e;default:u=!1}}u&&(i.flags|=4)}i.ref!==null&&(i.flags|=512,i.flags|=2097152)}return On(i),null;case 6:if(n&&i.stateNode!=null)jm(n,i,n.memoizedProps,u);else{if(typeof u!="string"&&i.stateNode===null)throw Error(t(166));if(a=Ms(fo.current),Ms(er.current),yl(i)){if(u=i.stateNode,a=i.memoizedProps,u[Qi]=i,(h=u.nodeValue!==a)&&(n=ci,n!==null))switch(n.tag){case 3:fl(u.nodeValue,a,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&fl(u.nodeValue,a,(n.mode&1)!==0)}h&&(i.flags|=4)}else u=(a.nodeType===9?a:a.ownerDocument).createTextNode(u),u[Qi]=i,i.stateNode=u}return On(i),null;case 13:if(Zt(tn),u=i.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(en&&di!==null&&(i.mode&1)!==0&&(i.flags&128)===0)qp(),sa(),i.flags|=98560,h=!1;else if(h=yl(i),u!==null&&u.dehydrated!==null){if(n===null){if(!h)throw Error(t(318));if(h=i.memoizedState,h=h!==null?h.dehydrated:null,!h)throw Error(t(317));h[Qi]=i}else sa(),(i.flags&128)===0&&(i.memoizedState=null),i.flags|=4;On(i),h=!1}else Li!==null&&(df(Li),Li=null),h=!0;if(!h)return i.flags&65536?i:null}return(i.flags&128)!==0?(i.lanes=a,i):(u=u!==null,u!==(n!==null&&n.memoizedState!==null)&&u&&(i.child.flags|=8192,(i.mode&1)!==0&&(n===null||(tn.current&1)!==0?vn===0&&(vn=3):pf())),i.updateQueue!==null&&(i.flags|=4),On(i),null);case 4:return ua(),Qd(n,i),n===null&&ro(i.stateNode.containerInfo),On(i),null;case 10:return Ad(i.type._context),On(i),null;case 17:return ni(i.type)&&ml(),On(i),null;case 19:if(Zt(tn),h=i.memoizedState,h===null)return On(i),null;if(u=(i.flags&128)!==0,T=h.rendering,T===null)if(u)_o(h,!1);else{if(vn!==0||n!==null&&(n.flags&128)!==0)for(n=i.child;n!==null;){if(T=bl(n),T!==null){for(i.flags|=128,_o(h,!1),u=T.updateQueue,u!==null&&(i.updateQueue=u,i.flags|=4),i.subtreeFlags=0,u=a,a=i.child;a!==null;)h=a,n=u,h.flags&=14680066,T=h.alternate,T===null?(h.childLanes=0,h.lanes=n,h.child=null,h.subtreeFlags=0,h.memoizedProps=null,h.memoizedState=null,h.updateQueue=null,h.dependencies=null,h.stateNode=null):(h.childLanes=T.childLanes,h.lanes=T.lanes,h.child=T.child,h.subtreeFlags=0,h.deletions=null,h.memoizedProps=T.memoizedProps,h.memoizedState=T.memoizedState,h.updateQueue=T.updateQueue,h.type=T.type,n=T.dependencies,h.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),a=a.sibling;return Yt(tn,tn.current&1|2),i.child}n=n.sibling}h.tail!==null&&jt()>ha&&(i.flags|=128,u=!0,_o(h,!1),i.lanes=4194304)}else{if(!u)if(n=bl(T),n!==null){if(i.flags|=128,u=!0,a=n.updateQueue,a!==null&&(i.updateQueue=a,i.flags|=4),_o(h,!0),h.tail===null&&h.tailMode==="hidden"&&!T.alternate&&!en)return On(i),null}else 2*jt()-h.renderingStartTime>ha&&a!==1073741824&&(i.flags|=128,u=!0,_o(h,!1),i.lanes=4194304);h.isBackwards?(T.sibling=i.child,i.child=T):(a=h.last,a!==null?a.sibling=T:i.child=T,h.last=T)}return h.tail!==null?(i=h.tail,h.rendering=i,h.tail=i.sibling,h.renderingStartTime=jt(),i.sibling=null,a=tn.current,Yt(tn,u?a&1|2:a&1),i):(On(i),null);case 22:case 23:return hf(),u=i.memoizedState!==null,n!==null&&n.memoizedState!==null!==u&&(i.flags|=8192),u&&(i.mode&1)!==0?(fi&1073741824)!==0&&(On(i),i.subtreeFlags&6&&(i.flags|=8192)):On(i),null;case 24:return null;case 25:return null}throw Error(t(156,i.tag))}function ix(n,i){switch(Sd(i),i.tag){case 1:return ni(i.type)&&ml(),n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 3:return ua(),Zt(ti),Zt(Un),Id(),n=i.flags,(n&65536)!==0&&(n&128)===0?(i.flags=n&-65537|128,i):null;case 5:return Ld(i),null;case 13:if(Zt(tn),n=i.memoizedState,n!==null&&n.dehydrated!==null){if(i.alternate===null)throw Error(t(340));sa()}return n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 19:return Zt(tn),null;case 4:return ua(),null;case 10:return Ad(i.type._context),null;case 22:case 23:return hf(),null;case 24:return null;default:return null}}var Ul=!1,zn=!1,rx=typeof WeakSet=="function"?WeakSet:Set,Ke=null;function da(n,i){var a=n.ref;if(a!==null)if(typeof a=="function")try{a(null)}catch(u){sn(n,i,u)}else a.current=null}function ef(n,i,a){try{a()}catch(u){sn(n,i,u)}}var Xm=!1;function sx(n,i){if(fd=tl,n=Tp(),rd(n)){if("selectionStart"in n)var a={start:n.selectionStart,end:n.selectionEnd};else e:{a=(a=n.ownerDocument)&&a.defaultView||window;var u=a.getSelection&&a.getSelection();if(u&&u.rangeCount!==0){a=u.anchorNode;var d=u.anchorOffset,h=u.focusNode;u=u.focusOffset;try{a.nodeType,h.nodeType}catch{a=null;break e}var T=0,F=-1,j=-1,fe=0,Ae=0,Re=n,we=null;t:for(;;){for(var Xe;Re!==a||d!==0&&Re.nodeType!==3||(F=T+d),Re!==h||u!==0&&Re.nodeType!==3||(j=T+u),Re.nodeType===3&&(T+=Re.nodeValue.length),(Xe=Re.firstChild)!==null;)we=Re,Re=Xe;for(;;){if(Re===n)break t;if(we===a&&++fe===d&&(F=T),we===h&&++Ae===u&&(j=T),(Xe=Re.nextSibling)!==null)break;Re=we,we=Re.parentNode}Re=Xe}a=F===-1||j===-1?null:{start:F,end:j}}else a=null}a=a||{start:0,end:0}}else a=null;for(hd={focusedElem:n,selectionRange:a},tl=!1,Ke=i;Ke!==null;)if(i=Ke,n=i.child,(i.subtreeFlags&1028)!==0&&n!==null)n.return=i,Ke=n;else for(;Ke!==null;){i=Ke;try{var Ze=i.alternate;if((i.flags&1024)!==0)switch(i.tag){case 0:case 11:case 15:break;case 1:if(Ze!==null){var Qe=Ze.memoizedProps,on=Ze.memoizedState,te=i.stateNode,q=te.getSnapshotBeforeUpdate(i.elementType===i.type?Qe:Di(i.type,Qe),on);te.__reactInternalSnapshotBeforeUpdate=q}break;case 3:var oe=i.stateNode.containerInfo;oe.nodeType===1?oe.textContent="":oe.nodeType===9&&oe.documentElement&&oe.removeChild(oe.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(De){sn(i,i.return,De)}if(n=i.sibling,n!==null){n.return=i.return,Ke=n;break}Ke=i.return}return Ze=Xm,Xm=!1,Ze}function vo(n,i,a){var u=i.updateQueue;if(u=u!==null?u.lastEffect:null,u!==null){var d=u=u.next;do{if((d.tag&n)===n){var h=d.destroy;d.destroy=void 0,h!==void 0&&ef(i,a,h)}d=d.next}while(d!==u)}}function Fl(n,i){if(i=i.updateQueue,i=i!==null?i.lastEffect:null,i!==null){var a=i=i.next;do{if((a.tag&n)===n){var u=a.create;a.destroy=u()}a=a.next}while(a!==i)}}function tf(n){var i=n.ref;if(i!==null){var a=n.stateNode;n.tag,n=a,typeof i=="function"?i(n):i.current=n}}function Ym(n){var i=n.alternate;i!==null&&(n.alternate=null,Ym(i)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(i=n.stateNode,i!==null&&(delete i[Qi],delete i[ao],delete i[_d],delete i[Vv],delete i[Gv])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function qm(n){return n.tag===5||n.tag===3||n.tag===4}function $m(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||qm(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function nf(n,i,a){var u=n.tag;if(u===5||u===6)n=n.stateNode,i?a.nodeType===8?a.parentNode.insertBefore(n,i):a.insertBefore(n,i):(a.nodeType===8?(i=a.parentNode,i.insertBefore(n,a)):(i=a,i.appendChild(n)),a=a._reactRootContainer,a!=null||i.onclick!==null||(i.onclick=hl));else if(u!==4&&(n=n.child,n!==null))for(nf(n,i,a),n=n.sibling;n!==null;)nf(n,i,a),n=n.sibling}function rf(n,i,a){var u=n.tag;if(u===5||u===6)n=n.stateNode,i?a.insertBefore(n,i):a.appendChild(n);else if(u!==4&&(n=n.child,n!==null))for(rf(n,i,a),n=n.sibling;n!==null;)rf(n,i,a),n=n.sibling}var Pn=null,Ii=!1;function jr(n,i,a){for(a=a.child;a!==null;)Km(n,i,a),a=a.sibling}function Km(n,i,a){if(ke&&typeof ke.onCommitFiberUnmount=="function")try{ke.onCommitFiberUnmount(re,a)}catch{}switch(a.tag){case 5:zn||da(a,i);case 6:var u=Pn,d=Ii;Pn=null,jr(n,i,a),Pn=u,Ii=d,Pn!==null&&(Ii?(n=Pn,a=a.stateNode,n.nodeType===8?n.parentNode.removeChild(a):n.removeChild(a)):Pn.removeChild(a.stateNode));break;case 18:Pn!==null&&(Ii?(n=Pn,a=a.stateNode,n.nodeType===8?gd(n.parentNode,a):n.nodeType===1&&gd(n,a),$a(n)):gd(Pn,a.stateNode));break;case 4:u=Pn,d=Ii,Pn=a.stateNode.containerInfo,Ii=!0,jr(n,i,a),Pn=u,Ii=d;break;case 0:case 11:case 14:case 15:if(!zn&&(u=a.updateQueue,u!==null&&(u=u.lastEffect,u!==null))){d=u=u.next;do{var h=d,T=h.destroy;h=h.tag,T!==void 0&&((h&2)!==0||(h&4)!==0)&&ef(a,i,T),d=d.next}while(d!==u)}jr(n,i,a);break;case 1:if(!zn&&(da(a,i),u=a.stateNode,typeof u.componentWillUnmount=="function"))try{u.props=a.memoizedProps,u.state=a.memoizedState,u.componentWillUnmount()}catch(F){sn(a,i,F)}jr(n,i,a);break;case 21:jr(n,i,a);break;case 22:a.mode&1?(zn=(u=zn)||a.memoizedState!==null,jr(n,i,a),zn=u):jr(n,i,a);break;default:jr(n,i,a)}}function Zm(n){var i=n.updateQueue;if(i!==null){n.updateQueue=null;var a=n.stateNode;a===null&&(a=n.stateNode=new rx),i.forEach(function(u){var d=px.bind(null,n,u);a.has(u)||(a.add(u),u.then(d,d))})}}function Ui(n,i){var a=i.deletions;if(a!==null)for(var u=0;u<a.length;u++){var d=a[u];try{var h=n,T=i,F=T;e:for(;F!==null;){switch(F.tag){case 5:Pn=F.stateNode,Ii=!1;break e;case 3:Pn=F.stateNode.containerInfo,Ii=!0;break e;case 4:Pn=F.stateNode.containerInfo,Ii=!0;break e}F=F.return}if(Pn===null)throw Error(t(160));Km(h,T,d),Pn=null,Ii=!1;var j=d.alternate;j!==null&&(j.return=null),d.return=null}catch(fe){sn(d,i,fe)}}if(i.subtreeFlags&12854)for(i=i.child;i!==null;)Jm(i,n),i=i.sibling}function Jm(n,i){var a=n.alternate,u=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(Ui(i,n),nr(n),u&4){try{vo(3,n,n.return),Fl(3,n)}catch(Qe){sn(n,n.return,Qe)}try{vo(5,n,n.return)}catch(Qe){sn(n,n.return,Qe)}}break;case 1:Ui(i,n),nr(n),u&512&&a!==null&&da(a,a.return);break;case 5:if(Ui(i,n),nr(n),u&512&&a!==null&&da(a,a.return),n.flags&32){var d=n.stateNode;try{Ee(d,"")}catch(Qe){sn(n,n.return,Qe)}}if(u&4&&(d=n.stateNode,d!=null)){var h=n.memoizedProps,T=a!==null?a.memoizedProps:h,F=n.type,j=n.updateQueue;if(n.updateQueue=null,j!==null)try{F==="input"&&h.type==="radio"&&h.name!=null&&Se(d,h),ae(F,T);var fe=ae(F,h);for(T=0;T<j.length;T+=2){var Ae=j[T],Re=j[T+1];Ae==="style"?L(d,Re):Ae==="dangerouslySetInnerHTML"?xe(d,Re):Ae==="children"?Ee(d,Re):U(d,Ae,Re,fe)}switch(F){case"input":Ce(d,h);break;case"textarea":Oe(d,h);break;case"select":var we=d._wrapperState.wasMultiple;d._wrapperState.wasMultiple=!!h.multiple;var Xe=h.value;Xe!=null?xt(d,!!h.multiple,Xe,!1):we!==!!h.multiple&&(h.defaultValue!=null?xt(d,!!h.multiple,h.defaultValue,!0):xt(d,!!h.multiple,h.multiple?[]:"",!1))}d[ao]=h}catch(Qe){sn(n,n.return,Qe)}}break;case 6:if(Ui(i,n),nr(n),u&4){if(n.stateNode===null)throw Error(t(162));d=n.stateNode,h=n.memoizedProps;try{d.nodeValue=h}catch(Qe){sn(n,n.return,Qe)}}break;case 3:if(Ui(i,n),nr(n),u&4&&a!==null&&a.memoizedState.isDehydrated)try{$a(i.containerInfo)}catch(Qe){sn(n,n.return,Qe)}break;case 4:Ui(i,n),nr(n);break;case 13:Ui(i,n),nr(n),d=n.child,d.flags&8192&&(h=d.memoizedState!==null,d.stateNode.isHidden=h,!h||d.alternate!==null&&d.alternate.memoizedState!==null||(of=jt())),u&4&&Zm(n);break;case 22:if(Ae=a!==null&&a.memoizedState!==null,n.mode&1?(zn=(fe=zn)||Ae,Ui(i,n),zn=fe):Ui(i,n),nr(n),u&8192){if(fe=n.memoizedState!==null,(n.stateNode.isHidden=fe)&&!Ae&&(n.mode&1)!==0)for(Ke=n,Ae=n.child;Ae!==null;){for(Re=Ke=Ae;Ke!==null;){switch(we=Ke,Xe=we.child,we.tag){case 0:case 11:case 14:case 15:vo(4,we,we.return);break;case 1:da(we,we.return);var Ze=we.stateNode;if(typeof Ze.componentWillUnmount=="function"){u=we,a=we.return;try{i=u,Ze.props=i.memoizedProps,Ze.state=i.memoizedState,Ze.componentWillUnmount()}catch(Qe){sn(u,a,Qe)}}break;case 5:da(we,we.return);break;case 22:if(we.memoizedState!==null){tg(Re);continue}}Xe!==null?(Xe.return=we,Ke=Xe):tg(Re)}Ae=Ae.sibling}e:for(Ae=null,Re=n;;){if(Re.tag===5){if(Ae===null){Ae=Re;try{d=Re.stateNode,fe?(h=d.style,typeof h.setProperty=="function"?h.setProperty("display","none","important"):h.display="none"):(F=Re.stateNode,j=Re.memoizedProps.style,T=j!=null&&j.hasOwnProperty("display")?j.display:null,F.style.display=_e("display",T))}catch(Qe){sn(n,n.return,Qe)}}}else if(Re.tag===6){if(Ae===null)try{Re.stateNode.nodeValue=fe?"":Re.memoizedProps}catch(Qe){sn(n,n.return,Qe)}}else if((Re.tag!==22&&Re.tag!==23||Re.memoizedState===null||Re===n)&&Re.child!==null){Re.child.return=Re,Re=Re.child;continue}if(Re===n)break e;for(;Re.sibling===null;){if(Re.return===null||Re.return===n)break e;Ae===Re&&(Ae=null),Re=Re.return}Ae===Re&&(Ae=null),Re.sibling.return=Re.return,Re=Re.sibling}}break;case 19:Ui(i,n),nr(n),u&4&&Zm(n);break;case 21:break;default:Ui(i,n),nr(n)}}function nr(n){var i=n.flags;if(i&2){try{e:{for(var a=n.return;a!==null;){if(qm(a)){var u=a;break e}a=a.return}throw Error(t(160))}switch(u.tag){case 5:var d=u.stateNode;u.flags&32&&(Ee(d,""),u.flags&=-33);var h=$m(n);rf(n,h,d);break;case 3:case 4:var T=u.stateNode.containerInfo,F=$m(n);nf(n,F,T);break;default:throw Error(t(161))}}catch(j){sn(n,n.return,j)}n.flags&=-3}i&4096&&(n.flags&=-4097)}function ax(n,i,a){Ke=n,Qm(n)}function Qm(n,i,a){for(var u=(n.mode&1)!==0;Ke!==null;){var d=Ke,h=d.child;if(d.tag===22&&u){var T=d.memoizedState!==null||Ul;if(!T){var F=d.alternate,j=F!==null&&F.memoizedState!==null||zn;F=Ul;var fe=zn;if(Ul=T,(zn=j)&&!fe)for(Ke=d;Ke!==null;)T=Ke,j=T.child,T.tag===22&&T.memoizedState!==null?ng(d):j!==null?(j.return=T,Ke=j):ng(d);for(;h!==null;)Ke=h,Qm(h),h=h.sibling;Ke=d,Ul=F,zn=fe}eg(n)}else(d.subtreeFlags&8772)!==0&&h!==null?(h.return=d,Ke=h):eg(n)}}function eg(n){for(;Ke!==null;){var i=Ke;if((i.flags&8772)!==0){var a=i.alternate;try{if((i.flags&8772)!==0)switch(i.tag){case 0:case 11:case 15:zn||Fl(5,i);break;case 1:var u=i.stateNode;if(i.flags&4&&!zn)if(a===null)u.componentDidMount();else{var d=i.elementType===i.type?a.memoizedProps:Di(i.type,a.memoizedProps);u.componentDidUpdate(d,a.memoizedState,u.__reactInternalSnapshotBeforeUpdate)}var h=i.updateQueue;h!==null&&tm(i,h,u);break;case 3:var T=i.updateQueue;if(T!==null){if(a=null,i.child!==null)switch(i.child.tag){case 5:a=i.child.stateNode;break;case 1:a=i.child.stateNode}tm(i,T,a)}break;case 5:var F=i.stateNode;if(a===null&&i.flags&4){a=F;var j=i.memoizedProps;switch(i.type){case"button":case"input":case"select":case"textarea":j.autoFocus&&a.focus();break;case"img":j.src&&(a.src=j.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(i.memoizedState===null){var fe=i.alternate;if(fe!==null){var Ae=fe.memoizedState;if(Ae!==null){var Re=Ae.dehydrated;Re!==null&&$a(Re)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}zn||i.flags&512&&tf(i)}catch(we){sn(i,i.return,we)}}if(i===n){Ke=null;break}if(a=i.sibling,a!==null){a.return=i.return,Ke=a;break}Ke=i.return}}function tg(n){for(;Ke!==null;){var i=Ke;if(i===n){Ke=null;break}var a=i.sibling;if(a!==null){a.return=i.return,Ke=a;break}Ke=i.return}}function ng(n){for(;Ke!==null;){var i=Ke;try{switch(i.tag){case 0:case 11:case 15:var a=i.return;try{Fl(4,i)}catch(j){sn(i,a,j)}break;case 1:var u=i.stateNode;if(typeof u.componentDidMount=="function"){var d=i.return;try{u.componentDidMount()}catch(j){sn(i,d,j)}}var h=i.return;try{tf(i)}catch(j){sn(i,h,j)}break;case 5:var T=i.return;try{tf(i)}catch(j){sn(i,T,j)}}}catch(j){sn(i,i.return,j)}if(i===n){Ke=null;break}var F=i.sibling;if(F!==null){F.return=i.return,Ke=F;break}Ke=i.return}}var ox=Math.ceil,Ol=R.ReactCurrentDispatcher,sf=R.ReactCurrentOwner,Mi=R.ReactCurrentBatchConfig,Ft=0,En=null,hn=null,Nn=0,fi=0,fa=Br(0),vn=0,xo=null,Ts=0,zl=0,af=0,yo=null,ri=null,of=0,ha=1/0,xr=null,kl=!1,lf=null,Xr=null,Bl=!1,Yr=null,Vl=0,So=0,uf=null,Gl=-1,Hl=0;function Xn(){return(Ft&6)!==0?jt():Gl!==-1?Gl:Gl=jt()}function qr(n){return(n.mode&1)===0?1:(Ft&2)!==0&&Nn!==0?Nn&-Nn:Wv.transition!==null?(Hl===0&&(Hl=je()),Hl):(n=wt,n!==0||(n=window.event,n=n===void 0?16:rp(n.type)),n)}function Fi(n,i,a,u){if(50<So)throw So=0,uf=null,Error(t(185));Mt(n,a,u),((Ft&2)===0||n!==En)&&(n===En&&((Ft&2)===0&&(zl|=a),vn===4&&$r(n,Nn)),si(n,u),a===1&&Ft===0&&(i.mode&1)===0&&(ha=jt()+500,_l&&Gr()))}function si(n,i){var a=n.callbackNode;Bt(n,i);var u=Xt(n,n===En?Nn:0);if(u===0)a!==null&&Lr(a),n.callbackNode=null,n.callbackPriority=0;else if(i=u&-u,n.callbackPriority!==i){if(a!=null&&Lr(a),i===1)n.tag===0?Hv(rg.bind(null,n)):Hp(rg.bind(null,n)),kv(function(){(Ft&6)===0&&Gr()}),a=null;else{switch(dr(u)){case 1:a=In;break;case 4:a=b;break;case 16:a=J;break;case 536870912:a=se;break;default:a=J}a=fg(a,ig.bind(null,n))}n.callbackPriority=i,n.callbackNode=a}}function ig(n,i){if(Gl=-1,Hl=0,(Ft&6)!==0)throw Error(t(327));var a=n.callbackNode;if(pa()&&n.callbackNode!==a)return null;var u=Xt(n,n===En?Nn:0);if(u===0)return null;if((u&30)!==0||(u&n.expiredLanes)!==0||i)i=Wl(n,u);else{i=u;var d=Ft;Ft|=2;var h=ag();(En!==n||Nn!==i)&&(xr=null,ha=jt()+500,bs(n,i));do try{cx();break}catch(F){sg(n,F)}while(!0);bd(),Ol.current=h,Ft=d,hn!==null?i=0:(En=null,Nn=0,i=vn)}if(i!==0){if(i===2&&(d=fn(n),d!==0&&(u=d,i=cf(n,d))),i===1)throw a=xo,bs(n,0),$r(n,u),si(n,jt()),a;if(i===6)$r(n,u);else{if(d=n.current.alternate,(u&30)===0&&!lx(d)&&(i=Wl(n,u),i===2&&(h=fn(n),h!==0&&(u=h,i=cf(n,h))),i===1))throw a=xo,bs(n,0),$r(n,u),si(n,jt()),a;switch(n.finishedWork=d,n.finishedLanes=u,i){case 0:case 1:throw Error(t(345));case 2:As(n,ri,xr);break;case 3:if($r(n,u),(u&130023424)===u&&(i=of+500-jt(),10<i)){if(Xt(n,0)!==0)break;if(d=n.suspendedLanes,(d&u)!==u){Xn(),n.pingedLanes|=n.suspendedLanes&d;break}n.timeoutHandle=md(As.bind(null,n,ri,xr),i);break}As(n,ri,xr);break;case 4:if($r(n,u),(u&4194240)===u)break;for(i=n.eventTimes,d=-1;0<u;){var T=31-Fe(u);h=1<<T,T=i[T],T>d&&(d=T),u&=~h}if(u=d,u=jt()-u,u=(120>u?120:480>u?480:1080>u?1080:1920>u?1920:3e3>u?3e3:4320>u?4320:1960*ox(u/1960))-u,10<u){n.timeoutHandle=md(As.bind(null,n,ri,xr),u);break}As(n,ri,xr);break;case 5:As(n,ri,xr);break;default:throw Error(t(329))}}}return si(n,jt()),n.callbackNode===a?ig.bind(null,n):null}function cf(n,i){var a=yo;return n.current.memoizedState.isDehydrated&&(bs(n,i).flags|=256),n=Wl(n,i),n!==2&&(i=ri,ri=a,i!==null&&df(i)),n}function df(n){ri===null?ri=n:ri.push.apply(ri,n)}function lx(n){for(var i=n;;){if(i.flags&16384){var a=i.updateQueue;if(a!==null&&(a=a.stores,a!==null))for(var u=0;u<a.length;u++){var d=a[u],h=d.getSnapshot;d=d.value;try{if(!Ni(h(),d))return!1}catch{return!1}}}if(a=i.child,i.subtreeFlags&16384&&a!==null)a.return=i,i=a;else{if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return!0;i=i.return}i.sibling.return=i.return,i=i.sibling}}return!0}function $r(n,i){for(i&=~af,i&=~zl,n.suspendedLanes|=i,n.pingedLanes&=~i,n=n.expirationTimes;0<i;){var a=31-Fe(i),u=1<<a;n[a]=-1,i&=~u}}function rg(n){if((Ft&6)!==0)throw Error(t(327));pa();var i=Xt(n,0);if((i&1)===0)return si(n,jt()),null;var a=Wl(n,i);if(n.tag!==0&&a===2){var u=fn(n);u!==0&&(i=u,a=cf(n,u))}if(a===1)throw a=xo,bs(n,0),$r(n,i),si(n,jt()),a;if(a===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=i,As(n,ri,xr),si(n,jt()),null}function ff(n,i){var a=Ft;Ft|=1;try{return n(i)}finally{Ft=a,Ft===0&&(ha=jt()+500,_l&&Gr())}}function ws(n){Yr!==null&&Yr.tag===0&&(Ft&6)===0&&pa();var i=Ft;Ft|=1;var a=Mi.transition,u=wt;try{if(Mi.transition=null,wt=1,n)return n()}finally{wt=u,Mi.transition=a,Ft=i,(Ft&6)===0&&Gr()}}function hf(){fi=fa.current,Zt(fa)}function bs(n,i){n.finishedWork=null,n.finishedLanes=0;var a=n.timeoutHandle;if(a!==-1&&(n.timeoutHandle=-1,zv(a)),hn!==null)for(a=hn.return;a!==null;){var u=a;switch(Sd(u),u.tag){case 1:u=u.type.childContextTypes,u!=null&&ml();break;case 3:ua(),Zt(ti),Zt(Un),Id();break;case 5:Ld(u);break;case 4:ua();break;case 13:Zt(tn);break;case 19:Zt(tn);break;case 10:Ad(u.type._context);break;case 22:case 23:hf()}a=a.return}if(En=n,hn=n=Kr(n.current,null),Nn=fi=i,vn=0,xo=null,af=zl=Ts=0,ri=yo=null,Ss!==null){for(i=0;i<Ss.length;i++)if(a=Ss[i],u=a.interleaved,u!==null){a.interleaved=null;var d=u.next,h=a.pending;if(h!==null){var T=h.next;h.next=d,u.next=T}a.pending=u}Ss=null}return n}function sg(n,i){do{var a=hn;try{if(bd(),Al.current=Nl,Rl){for(var u=nn.memoizedState;u!==null;){var d=u.queue;d!==null&&(d.pending=null),u=u.next}Rl=!1}if(Es=0,Mn=_n=nn=null,ho=!1,po=0,sf.current=null,a===null||a.return===null){vn=1,xo=i,hn=null;break}e:{var h=n,T=a.return,F=a,j=i;if(i=Nn,F.flags|=32768,j!==null&&typeof j=="object"&&typeof j.then=="function"){var fe=j,Ae=F,Re=Ae.tag;if((Ae.mode&1)===0&&(Re===0||Re===11||Re===15)){var we=Ae.alternate;we?(Ae.updateQueue=we.updateQueue,Ae.memoizedState=we.memoizedState,Ae.lanes=we.lanes):(Ae.updateQueue=null,Ae.memoizedState=null)}var Xe=Pm(T);if(Xe!==null){Xe.flags&=-257,Nm(Xe,T,F,h,i),Xe.mode&1&&Cm(h,fe,i),i=Xe,j=fe;var Ze=i.updateQueue;if(Ze===null){var Qe=new Set;Qe.add(j),i.updateQueue=Qe}else Ze.add(j);break e}else{if((i&1)===0){Cm(h,fe,i),pf();break e}j=Error(t(426))}}else if(en&&F.mode&1){var on=Pm(T);if(on!==null){(on.flags&65536)===0&&(on.flags|=256),Nm(on,T,F,h,i),Td(ca(j,F));break e}}h=j=ca(j,F),vn!==4&&(vn=2),yo===null?yo=[h]:yo.push(h),h=T;do{switch(h.tag){case 3:h.flags|=65536,i&=-i,h.lanes|=i;var te=Am(h,j,i);em(h,te);break e;case 1:F=j;var q=h.type,oe=h.stateNode;if((h.flags&128)===0&&(typeof q.getDerivedStateFromError=="function"||oe!==null&&typeof oe.componentDidCatch=="function"&&(Xr===null||!Xr.has(oe)))){h.flags|=65536,i&=-i,h.lanes|=i;var De=Rm(h,F,i);em(h,De);break e}}h=h.return}while(h!==null)}lg(a)}catch(nt){i=nt,hn===a&&a!==null&&(hn=a=a.return);continue}break}while(!0)}function ag(){var n=Ol.current;return Ol.current=Nl,n===null?Nl:n}function pf(){(vn===0||vn===3||vn===2)&&(vn=4),En===null||(Ts&268435455)===0&&(zl&268435455)===0||$r(En,Nn)}function Wl(n,i){var a=Ft;Ft|=2;var u=ag();(En!==n||Nn!==i)&&(xr=null,bs(n,i));do try{ux();break}catch(d){sg(n,d)}while(!0);if(bd(),Ft=a,Ol.current=u,hn!==null)throw Error(t(261));return En=null,Nn=0,vn}function ux(){for(;hn!==null;)og(hn)}function cx(){for(;hn!==null&&!Zi();)og(hn)}function og(n){var i=dg(n.alternate,n,fi);n.memoizedProps=n.pendingProps,i===null?lg(n):hn=i,sf.current=null}function lg(n){var i=n;do{var a=i.alternate;if(n=i.return,(i.flags&32768)===0){if(a=nx(a,i,fi),a!==null){hn=a;return}}else{if(a=ix(a,i),a!==null){a.flags&=32767,hn=a;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{vn=6,hn=null;return}}if(i=i.sibling,i!==null){hn=i;return}hn=i=n}while(i!==null);vn===0&&(vn=5)}function As(n,i,a){var u=wt,d=Mi.transition;try{Mi.transition=null,wt=1,dx(n,i,a,u)}finally{Mi.transition=d,wt=u}return null}function dx(n,i,a,u){do pa();while(Yr!==null);if((Ft&6)!==0)throw Error(t(327));a=n.finishedWork;var d=n.finishedLanes;if(a===null)return null;if(n.finishedWork=null,n.finishedLanes=0,a===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var h=a.lanes|a.childLanes;if(Qn(n,h),n===En&&(hn=En=null,Nn=0),(a.subtreeFlags&2064)===0&&(a.flags&2064)===0||Bl||(Bl=!0,fg(J,function(){return pa(),null})),h=(a.flags&15990)!==0,(a.subtreeFlags&15990)!==0||h){h=Mi.transition,Mi.transition=null;var T=wt;wt=1;var F=Ft;Ft|=4,sf.current=null,sx(n,a),Jm(a,n),Nv(hd),tl=!!fd,hd=fd=null,n.current=a,ax(a),ms(),Ft=F,wt=T,Mi.transition=h}else n.current=a;if(Bl&&(Bl=!1,Yr=n,Vl=d),h=n.pendingLanes,h===0&&(Xr=null),$e(a.stateNode),si(n,jt()),i!==null)for(u=n.onRecoverableError,a=0;a<i.length;a++)d=i[a],u(d.value,{componentStack:d.stack,digest:d.digest});if(kl)throw kl=!1,n=lf,lf=null,n;return(Vl&1)!==0&&n.tag!==0&&pa(),h=n.pendingLanes,(h&1)!==0?n===uf?So++:(So=0,uf=n):So=0,Gr(),null}function pa(){if(Yr!==null){var n=dr(Vl),i=Mi.transition,a=wt;try{if(Mi.transition=null,wt=16>n?16:n,Yr===null)var u=!1;else{if(n=Yr,Yr=null,Vl=0,(Ft&6)!==0)throw Error(t(331));var d=Ft;for(Ft|=4,Ke=n.current;Ke!==null;){var h=Ke,T=h.child;if((Ke.flags&16)!==0){var F=h.deletions;if(F!==null){for(var j=0;j<F.length;j++){var fe=F[j];for(Ke=fe;Ke!==null;){var Ae=Ke;switch(Ae.tag){case 0:case 11:case 15:vo(8,Ae,h)}var Re=Ae.child;if(Re!==null)Re.return=Ae,Ke=Re;else for(;Ke!==null;){Ae=Ke;var we=Ae.sibling,Xe=Ae.return;if(Ym(Ae),Ae===fe){Ke=null;break}if(we!==null){we.return=Xe,Ke=we;break}Ke=Xe}}}var Ze=h.alternate;if(Ze!==null){var Qe=Ze.child;if(Qe!==null){Ze.child=null;do{var on=Qe.sibling;Qe.sibling=null,Qe=on}while(Qe!==null)}}Ke=h}}if((h.subtreeFlags&2064)!==0&&T!==null)T.return=h,Ke=T;else e:for(;Ke!==null;){if(h=Ke,(h.flags&2048)!==0)switch(h.tag){case 0:case 11:case 15:vo(9,h,h.return)}var te=h.sibling;if(te!==null){te.return=h.return,Ke=te;break e}Ke=h.return}}var q=n.current;for(Ke=q;Ke!==null;){T=Ke;var oe=T.child;if((T.subtreeFlags&2064)!==0&&oe!==null)oe.return=T,Ke=oe;else e:for(T=q;Ke!==null;){if(F=Ke,(F.flags&2048)!==0)try{switch(F.tag){case 0:case 11:case 15:Fl(9,F)}}catch(nt){sn(F,F.return,nt)}if(F===T){Ke=null;break e}var De=F.sibling;if(De!==null){De.return=F.return,Ke=De;break e}Ke=F.return}}if(Ft=d,Gr(),ke&&typeof ke.onPostCommitFiberRoot=="function")try{ke.onPostCommitFiberRoot(re,n)}catch{}u=!0}return u}finally{wt=a,Mi.transition=i}}return!1}function ug(n,i,a){i=ca(a,i),i=Am(n,i,1),n=Wr(n,i,1),i=Xn(),n!==null&&(Mt(n,1,i),si(n,i))}function sn(n,i,a){if(n.tag===3)ug(n,n,a);else for(;i!==null;){if(i.tag===3){ug(i,n,a);break}else if(i.tag===1){var u=i.stateNode;if(typeof i.type.getDerivedStateFromError=="function"||typeof u.componentDidCatch=="function"&&(Xr===null||!Xr.has(u))){n=ca(a,n),n=Rm(i,n,1),i=Wr(i,n,1),n=Xn(),i!==null&&(Mt(i,1,n),si(i,n));break}}i=i.return}}function fx(n,i,a){var u=n.pingCache;u!==null&&u.delete(i),i=Xn(),n.pingedLanes|=n.suspendedLanes&a,En===n&&(Nn&a)===a&&(vn===4||vn===3&&(Nn&130023424)===Nn&&500>jt()-of?bs(n,0):af|=a),si(n,i)}function cg(n,i){i===0&&((n.mode&1)===0?i=1:(i=tt,tt<<=1,(tt&130023424)===0&&(tt=4194304)));var a=Xn();n=gr(n,i),n!==null&&(Mt(n,i,a),si(n,a))}function hx(n){var i=n.memoizedState,a=0;i!==null&&(a=i.retryLane),cg(n,a)}function px(n,i){var a=0;switch(n.tag){case 13:var u=n.stateNode,d=n.memoizedState;d!==null&&(a=d.retryLane);break;case 19:u=n.stateNode;break;default:throw Error(t(314))}u!==null&&u.delete(i),cg(n,a)}var dg;dg=function(n,i,a){if(n!==null)if(n.memoizedProps!==i.pendingProps||ti.current)ii=!0;else{if((n.lanes&a)===0&&(i.flags&128)===0)return ii=!1,tx(n,i,a);ii=(n.flags&131072)!==0}else ii=!1,en&&(i.flags&1048576)!==0&&Wp(i,xl,i.index);switch(i.lanes=0,i.tag){case 2:var u=i.type;Il(n,i),n=i.pendingProps;var d=na(i,Un.current);la(i,a),d=Od(null,i,u,n,d,a);var h=zd();return i.flags|=1,typeof d=="object"&&d!==null&&typeof d.render=="function"&&d.$$typeof===void 0?(i.tag=1,i.memoizedState=null,i.updateQueue=null,ni(u)?(h=!0,gl(i)):h=!1,i.memoizedState=d.state!==null&&d.state!==void 0?d.state:null,Pd(i),d.updater=Ll,i.stateNode=d,d._reactInternals=i,Wd(i,u,n,a),i=qd(null,i,u,!0,h,a)):(i.tag=0,en&&h&&yd(i),jn(null,i,d,a),i=i.child),i;case 16:u=i.elementType;e:{switch(Il(n,i),n=i.pendingProps,d=u._init,u=d(u._payload),i.type=u,d=i.tag=gx(u),n=Di(u,n),d){case 0:i=Yd(null,i,u,n,a);break e;case 1:i=Om(null,i,u,n,a);break e;case 11:i=Lm(null,i,u,n,a);break e;case 14:i=Dm(null,i,u,Di(u.type,n),a);break e}throw Error(t(306,u,""))}return i;case 0:return u=i.type,d=i.pendingProps,d=i.elementType===u?d:Di(u,d),Yd(n,i,u,d,a);case 1:return u=i.type,d=i.pendingProps,d=i.elementType===u?d:Di(u,d),Om(n,i,u,d,a);case 3:e:{if(zm(i),n===null)throw Error(t(387));u=i.pendingProps,h=i.memoizedState,d=h.element,Qp(n,i),wl(i,u,null,a);var T=i.memoizedState;if(u=T.element,h.isDehydrated)if(h={element:u,isDehydrated:!1,cache:T.cache,pendingSuspenseBoundaries:T.pendingSuspenseBoundaries,transitions:T.transitions},i.updateQueue.baseState=h,i.memoizedState=h,i.flags&256){d=ca(Error(t(423)),i),i=km(n,i,u,a,d);break e}else if(u!==d){d=ca(Error(t(424)),i),i=km(n,i,u,a,d);break e}else for(di=kr(i.stateNode.containerInfo.firstChild),ci=i,en=!0,Li=null,a=Zp(i,null,u,a),i.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(sa(),u===d){i=vr(n,i,a);break e}jn(n,i,u,a)}i=i.child}return i;case 5:return nm(i),n===null&&Ed(i),u=i.type,d=i.pendingProps,h=n!==null?n.memoizedProps:null,T=d.children,pd(u,d)?T=null:h!==null&&pd(u,h)&&(i.flags|=32),Fm(n,i),jn(n,i,T,a),i.child;case 6:return n===null&&Ed(i),null;case 13:return Bm(n,i,a);case 4:return Nd(i,i.stateNode.containerInfo),u=i.pendingProps,n===null?i.child=aa(i,null,u,a):jn(n,i,u,a),i.child;case 11:return u=i.type,d=i.pendingProps,d=i.elementType===u?d:Di(u,d),Lm(n,i,u,d,a);case 7:return jn(n,i,i.pendingProps,a),i.child;case 8:return jn(n,i,i.pendingProps.children,a),i.child;case 12:return jn(n,i,i.pendingProps.children,a),i.child;case 10:e:{if(u=i.type._context,d=i.pendingProps,h=i.memoizedProps,T=d.value,Yt(Ml,u._currentValue),u._currentValue=T,h!==null)if(Ni(h.value,T)){if(h.children===d.children&&!ti.current){i=vr(n,i,a);break e}}else for(h=i.child,h!==null&&(h.return=i);h!==null;){var F=h.dependencies;if(F!==null){T=h.child;for(var j=F.firstContext;j!==null;){if(j.context===u){if(h.tag===1){j=_r(-1,a&-a),j.tag=2;var fe=h.updateQueue;if(fe!==null){fe=fe.shared;var Ae=fe.pending;Ae===null?j.next=j:(j.next=Ae.next,Ae.next=j),fe.pending=j}}h.lanes|=a,j=h.alternate,j!==null&&(j.lanes|=a),Rd(h.return,a,i),F.lanes|=a;break}j=j.next}}else if(h.tag===10)T=h.type===i.type?null:h.child;else if(h.tag===18){if(T=h.return,T===null)throw Error(t(341));T.lanes|=a,F=T.alternate,F!==null&&(F.lanes|=a),Rd(T,a,i),T=h.sibling}else T=h.child;if(T!==null)T.return=h;else for(T=h;T!==null;){if(T===i){T=null;break}if(h=T.sibling,h!==null){h.return=T.return,T=h;break}T=T.return}h=T}jn(n,i,d.children,a),i=i.child}return i;case 9:return d=i.type,u=i.pendingProps.children,la(i,a),d=yi(d),u=u(d),i.flags|=1,jn(n,i,u,a),i.child;case 14:return u=i.type,d=Di(u,i.pendingProps),d=Di(u.type,d),Dm(n,i,u,d,a);case 15:return Im(n,i,i.type,i.pendingProps,a);case 17:return u=i.type,d=i.pendingProps,d=i.elementType===u?d:Di(u,d),Il(n,i),i.tag=1,ni(u)?(n=!0,gl(i)):n=!1,la(i,a),wm(i,u,d),Wd(i,u,d,a),qd(null,i,u,!0,n,a);case 19:return Gm(n,i,a);case 22:return Um(n,i,a)}throw Error(t(156,i.tag))};function fg(n,i){return gn(n,i)}function mx(n,i,a,u){this.tag=n,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=i,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=u,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ei(n,i,a,u){return new mx(n,i,a,u)}function mf(n){return n=n.prototype,!(!n||!n.isReactComponent)}function gx(n){if(typeof n=="function")return mf(n)?1:0;if(n!=null){if(n=n.$$typeof,n===K)return 11;if(n===W)return 14}return 2}function Kr(n,i){var a=n.alternate;return a===null?(a=Ei(n.tag,i,n.key,n.mode),a.elementType=n.elementType,a.type=n.type,a.stateNode=n.stateNode,a.alternate=n,n.alternate=a):(a.pendingProps=i,a.type=n.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=n.flags&14680064,a.childLanes=n.childLanes,a.lanes=n.lanes,a.child=n.child,a.memoizedProps=n.memoizedProps,a.memoizedState=n.memoizedState,a.updateQueue=n.updateQueue,i=n.dependencies,a.dependencies=i===null?null:{lanes:i.lanes,firstContext:i.firstContext},a.sibling=n.sibling,a.index=n.index,a.ref=n.ref,a}function jl(n,i,a,u,d,h){var T=2;if(u=n,typeof n=="function")mf(n)&&(T=1);else if(typeof n=="string")T=5;else e:switch(n){case V:return Rs(a.children,d,h,i);case w:T=8,d|=8;break;case I:return n=Ei(12,a,i,d|2),n.elementType=I,n.lanes=h,n;case le:return n=Ei(13,a,i,d),n.elementType=le,n.lanes=h,n;case ue:return n=Ei(19,a,i,d),n.elementType=ue,n.lanes=h,n;case Y:return Xl(a,d,h,i);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case X:T=10;break e;case k:T=9;break e;case K:T=11;break e;case W:T=14;break e;case $:T=16,u=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return i=Ei(T,a,i,d),i.elementType=n,i.type=u,i.lanes=h,i}function Rs(n,i,a,u){return n=Ei(7,n,u,i),n.lanes=a,n}function Xl(n,i,a,u){return n=Ei(22,n,u,i),n.elementType=Y,n.lanes=a,n.stateNode={isHidden:!1},n}function gf(n,i,a){return n=Ei(6,n,null,i),n.lanes=a,n}function _f(n,i,a){return i=Ei(4,n.children!==null?n.children:[],n.key,i),i.lanes=a,i.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},i}function _x(n,i,a,u,d){this.tag=i,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Cn(0),this.expirationTimes=Cn(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Cn(0),this.identifierPrefix=u,this.onRecoverableError=d,this.mutableSourceEagerHydrationData=null}function vf(n,i,a,u,d,h,T,F,j){return n=new _x(n,i,a,F,j),i===1?(i=1,h===!0&&(i|=8)):i=0,h=Ei(3,null,null,i),n.current=h,h.stateNode=n,h.memoizedState={element:u,isDehydrated:a,cache:null,transitions:null,pendingSuspenseBoundaries:null},Pd(h),n}function vx(n,i,a){var u=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:D,key:u==null?null:""+u,children:n,containerInfo:i,implementation:a}}function hg(n){if(!n)return Vr;n=n._reactInternals;e:{if(Hn(n)!==n||n.tag!==1)throw Error(t(170));var i=n;do{switch(i.tag){case 3:i=i.stateNode.context;break e;case 1:if(ni(i.type)){i=i.stateNode.__reactInternalMemoizedMergedChildContext;break e}}i=i.return}while(i!==null);throw Error(t(171))}if(n.tag===1){var a=n.type;if(ni(a))return Vp(n,a,i)}return i}function pg(n,i,a,u,d,h,T,F,j){return n=vf(a,u,!0,n,d,h,T,F,j),n.context=hg(null),a=n.current,u=Xn(),d=qr(a),h=_r(u,d),h.callback=i??null,Wr(a,h,d),n.current.lanes=d,Mt(n,d,u),si(n,u),n}function Yl(n,i,a,u){var d=i.current,h=Xn(),T=qr(d);return a=hg(a),i.context===null?i.context=a:i.pendingContext=a,i=_r(h,T),i.payload={element:n},u=u===void 0?null:u,u!==null&&(i.callback=u),n=Wr(d,i,T),n!==null&&(Fi(n,d,T,h),Tl(n,d,T)),T}function ql(n){return n=n.current,n.child?(n.child.tag===5,n.child.stateNode):null}function mg(n,i){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var a=n.retryLane;n.retryLane=a!==0&&a<i?a:i}}function xf(n,i){mg(n,i),(n=n.alternate)&&mg(n,i)}function xx(){return null}var gg=typeof reportError=="function"?reportError:function(n){console.error(n)};function yf(n){this._internalRoot=n}$l.prototype.render=yf.prototype.render=function(n){var i=this._internalRoot;if(i===null)throw Error(t(409));Yl(n,i,null,null)},$l.prototype.unmount=yf.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var i=n.containerInfo;ws(function(){Yl(null,n,null,null)}),i[fr]=null}};function $l(n){this._internalRoot=n}$l.prototype.unstable_scheduleHydration=function(n){if(n){var i=Vt();n={blockedOn:null,target:n,priority:i};for(var a=0;a<Fr.length&&i!==0&&i<Fr[a].priority;a++);Fr.splice(a,0,n),a===0&&np(n)}};function Sf(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function Kl(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function _g(){}function yx(n,i,a,u,d){if(d){if(typeof u=="function"){var h=u;u=function(){var fe=ql(T);h.call(fe)}}var T=pg(i,u,n,0,null,!1,!1,"",_g);return n._reactRootContainer=T,n[fr]=T.current,ro(n.nodeType===8?n.parentNode:n),ws(),T}for(;d=n.lastChild;)n.removeChild(d);if(typeof u=="function"){var F=u;u=function(){var fe=ql(j);F.call(fe)}}var j=vf(n,0,!1,null,null,!1,!1,"",_g);return n._reactRootContainer=j,n[fr]=j.current,ro(n.nodeType===8?n.parentNode:n),ws(function(){Yl(i,j,a,u)}),j}function Zl(n,i,a,u,d){var h=a._reactRootContainer;if(h){var T=h;if(typeof d=="function"){var F=d;d=function(){var j=ql(T);F.call(j)}}Yl(i,T,n,d)}else T=yx(a,i,n,d,u);return ql(T)}zt=function(n){switch(n.tag){case 3:var i=n.stateNode;if(i.current.memoizedState.isDehydrated){var a=It(i.pendingLanes);a!==0&&(ei(i,a|1),si(i,jt()),(Ft&6)===0&&(ha=jt()+500,Gr()))}break;case 13:ws(function(){var u=gr(n,1);if(u!==null){var d=Xn();Fi(u,n,1,d)}}),xf(n,1)}},$t=function(n){if(n.tag===13){var i=gr(n,134217728);if(i!==null){var a=Xn();Fi(i,n,134217728,a)}xf(n,134217728)}},Ci=function(n){if(n.tag===13){var i=qr(n),a=gr(n,i);if(a!==null){var u=Xn();Fi(a,n,i,u)}xf(n,i)}},Vt=function(){return wt},Pi=function(n,i){var a=wt;try{return wt=n,i()}finally{wt=a}},Ne=function(n,i,a){switch(i){case"input":if(Ce(n,a),i=a.name,a.type==="radio"&&i!=null){for(a=n;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll("input[name="+JSON.stringify(""+i)+'][type="radio"]'),i=0;i<a.length;i++){var u=a[i];if(u!==n&&u.form===n.form){var d=pl(u);if(!d)throw Error(t(90));Pt(u),Ce(u,d)}}}break;case"textarea":Oe(n,a);break;case"select":i=a.value,i!=null&&xt(n,!!a.multiple,i,!1)}},be=ff,ye=ws;var Sx={usingClientEntryPoint:!1,Events:[oo,ea,pl,ge,Be,ff]},Mo={findFiberByHostInstance:_s,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Mx={bundleType:Mo.bundleType,version:Mo.version,rendererPackageName:Mo.rendererPackageName,rendererConfig:Mo.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:R.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=_i(n),n===null?null:n.stateNode},findFiberByHostInstance:Mo.findFiberByHostInstance||xx,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Jl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Jl.isDisabled&&Jl.supportsFiber)try{re=Jl.inject(Mx),ke=Jl}catch{}}return ai.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Sx,ai.createPortal=function(n,i){var a=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Sf(i))throw Error(t(200));return vx(n,i,null,a)},ai.createRoot=function(n,i){if(!Sf(n))throw Error(t(299));var a=!1,u="",d=gg;return i!=null&&(i.unstable_strictMode===!0&&(a=!0),i.identifierPrefix!==void 0&&(u=i.identifierPrefix),i.onRecoverableError!==void 0&&(d=i.onRecoverableError)),i=vf(n,1,!1,null,null,a,!1,u,d),n[fr]=i.current,ro(n.nodeType===8?n.parentNode:n),new yf(i)},ai.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var i=n._reactInternals;if(i===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=_i(i),n=n===null?null:n.stateNode,n},ai.flushSync=function(n){return ws(n)},ai.hydrate=function(n,i,a){if(!Kl(i))throw Error(t(200));return Zl(null,n,i,!0,a)},ai.hydrateRoot=function(n,i,a){if(!Sf(n))throw Error(t(405));var u=a!=null&&a.hydratedSources||null,d=!1,h="",T=gg;if(a!=null&&(a.unstable_strictMode===!0&&(d=!0),a.identifierPrefix!==void 0&&(h=a.identifierPrefix),a.onRecoverableError!==void 0&&(T=a.onRecoverableError)),i=pg(i,null,n,1,a??null,d,!1,h,T),n[fr]=i.current,ro(n),u)for(n=0;n<u.length;n++)a=u[n],d=a._getVersion,d=d(a._source),i.mutableSourceEagerHydrationData==null?i.mutableSourceEagerHydrationData=[a,d]:i.mutableSourceEagerHydrationData.push(a,d);return new $l(i)},ai.render=function(n,i,a){if(!Kl(i))throw Error(t(200));return Zl(null,n,i,!1,a)},ai.unmountComponentAtNode=function(n){if(!Kl(n))throw Error(t(40));return n._reactRootContainer?(ws(function(){Zl(null,null,n,!1,function(){n._reactRootContainer=null,n[fr]=null})}),!0):!1},ai.unstable_batchedUpdates=ff,ai.unstable_renderSubtreeIntoContainer=function(n,i,a,u){if(!Kl(a))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return Zl(n,i,a,!1,u)},ai.version="18.3.1-next-f1338f8080-20240426",ai}var wg;function Nx(){if(wg)return Tf.exports;wg=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(e){console.error(e)}}return s(),Tf.exports=Px(),Tf.exports}var bg;function Lx(){if(bg)return Ql;bg=1;var s=Nx();return Ql.createRoot=s.createRoot,Ql.hydrateRoot=s.hydrateRoot,Ql}var Dx=Lx();const Ix=Tx(Dx);const Ac="184",P0=0,lh=1,N0=2,Oo=1,L0=2,Ia=3,Pr=0,Zn=1,sr=2,lr=0,ks=1,uh=2,ch=3,dh=4,D0=5,ss=100,I0=101,U0=102,F0=103,O0=104,z0=200,k0=201,B0=202,V0=203,Iu=204,Uu=205,G0=206,H0=207,W0=208,j0=209,X0=210,Y0=211,q0=212,$0=213,K0=214,Fu=0,Ou=1,zu=2,Bs=3,ku=4,Bu=5,Vu=6,Gu=7,Eh=0,Z0=1,J0=2,ji=0,Th=1,wh=2,bh=3,Ah=4,Rh=5,Ch=6,Ph=7,Nh=300,ds=301,Vs=302,Au=303,Ru=304,Jo=306,Hu=1e3,or=1001,Wu=1002,bn=1003,Q0=1004,Uo=1005,Ln=1006,Cu=1007,as=1008,oi=1009,Lh=1010,Dh=1011,za=1012,Rc=1013,Yi=1014,Hi=1015,ur=1016,Cc=1017,Pc=1018,ka=1020,Ih=35902,Uh=35899,Fh=1021,Oh=1022,Ai=1023,cr=1026,os=1027,zh=1028,Nc=1029,fs=1030,Lc=1031,Dc=1033,zo=33776,ko=33777,Bo=33778,Vo=33779,ju=35840,Xu=35841,Yu=35842,qu=35843,$u=36196,Ku=37492,Zu=37496,Ju=37488,Qu=37489,Go=37490,ec=37491,tc=37808,nc=37809,ic=37810,rc=37811,sc=37812,ac=37813,oc=37814,lc=37815,uc=37816,cc=37817,dc=37818,fc=37819,hc=37820,pc=37821,mc=36492,gc=36494,_c=36495,vc=36283,xc=36284,Ho=36285,yc=36286,e_=3200,Sc=0,t_=1,br="",Kn="srgb",Wo="srgb-linear",jo="linear",kt="srgb",Os=7680,fh=519,n_=512,i_=513,r_=514,Ic=515,s_=516,a_=517,Uc=518,o_=519,Mc=35044,hh="300 es",Wi=2e3,Ba=2001;function Ux(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Xo(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function l_(){const s=Xo("canvas");return s.style.display="block",s}const Ag={};function Yo(...s){const e="THREE."+s.shift();console.log(e,...s)}function u_(s){const e=s[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=s[1];t&&t.isStackTrace?s[0]+=" "+t.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function ct(...s){s=u_(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...s)}}function Rt(...s){s=u_(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...s)}}function Ec(...s){const e=s.join(" ");e in Ag||(Ag[e]=!0,ct(...s))}function Fx(s,e,t){return new Promise(function(r,o){function l(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:o();break;case s.TIMEOUT_EXPIRED:setTimeout(l,t);break;default:r()}}setTimeout(l,t)})}const Ox={[Fu]:Ou,[zu]:Vu,[ku]:Gu,[Bs]:Bu,[Ou]:Fu,[Vu]:zu,[Gu]:ku,[Bu]:Bs};class hs{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const r=this._listeners;r[e]===void 0&&(r[e]=[]),r[e].indexOf(t)===-1&&r[e].push(t)}hasEventListener(e,t){const r=this._listeners;return r===void 0?!1:r[e]!==void 0&&r[e].indexOf(t)!==-1}removeEventListener(e,t){const r=this._listeners;if(r===void 0)return;const o=r[e];if(o!==void 0){const l=o.indexOf(t);l!==-1&&o.splice(l,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const r=t[e.type];if(r!==void 0){e.target=this;const o=r.slice(0);for(let l=0,c=o.length;l<c;l++)o[l].call(this,e);e.target=null}}}const kn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Af=Math.PI/180,ph=180/Math.PI;function cs(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(kn[s&255]+kn[s>>8&255]+kn[s>>16&255]+kn[s>>24&255]+"-"+kn[e&255]+kn[e>>8&255]+"-"+kn[e>>16&15|64]+kn[e>>24&255]+"-"+kn[t&63|128]+kn[t>>8&255]+"-"+kn[t>>16&255]+kn[t>>24&255]+kn[r&255]+kn[r>>8&255]+kn[r>>16&255]+kn[r>>24&255]).toLowerCase()}function Dt(s,e,t){return Math.max(e,Math.min(t,s))}function zx(s,e){return(s%e+e)%e}function Rf(s,e,t){return(1-t)*s+t*e}function ar(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Ht(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Kh=class Kh{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,r=this.y,o=e.elements;return this.x=o[0]*t+o[3]*r+o[6],this.y=o[1]*t+o[4]*r+o[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Dt(this.x,e.x,t.x),this.y=Dt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Dt(this.x,e,t),this.y=Dt(this.y,e,t),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Dt(r,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const r=this.dot(e)/t;return Math.acos(Dt(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,r=this.y-e.y;return t*t+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const r=Math.cos(t),o=Math.sin(t),l=this.x-e.x,c=this.y-e.y;return this.x=l*r-c*o+e.x,this.y=l*o+c*r+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Kh.prototype.isVector2=!0;let vt=Kh;class js{constructor(e=0,t=0,r=0,o=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=r,this._w=o}static slerpFlat(e,t,r,o,l,c,f){let p=r[o+0],m=r[o+1],_=r[o+2],y=r[o+3],g=l[c+0],S=l[c+1],E=l[c+2],A=l[c+3];if(y!==A||p!==g||m!==S||_!==E){let x=p*g+m*S+_*E+y*A;x<0&&(g=-g,S=-S,E=-E,A=-A,x=-x);let v=1-f;if(x<.9995){const C=Math.acos(x),U=Math.sin(C);v=Math.sin(v*C)/U,f=Math.sin(f*C)/U,p=p*v+g*f,m=m*v+S*f,_=_*v+E*f,y=y*v+A*f}else{p=p*v+g*f,m=m*v+S*f,_=_*v+E*f,y=y*v+A*f;const C=1/Math.sqrt(p*p+m*m+_*_+y*y);p*=C,m*=C,_*=C,y*=C}}e[t]=p,e[t+1]=m,e[t+2]=_,e[t+3]=y}static multiplyQuaternionsFlat(e,t,r,o,l,c){const f=r[o],p=r[o+1],m=r[o+2],_=r[o+3],y=l[c],g=l[c+1],S=l[c+2],E=l[c+3];return e[t]=f*E+_*y+p*S-m*g,e[t+1]=p*E+_*g+m*y-f*S,e[t+2]=m*E+_*S+f*g-p*y,e[t+3]=_*E-f*y-p*g-m*S,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,r,o){return this._x=e,this._y=t,this._z=r,this._w=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const r=e._x,o=e._y,l=e._z,c=e._order,f=Math.cos,p=Math.sin,m=f(r/2),_=f(o/2),y=f(l/2),g=p(r/2),S=p(o/2),E=p(l/2);switch(c){case"XYZ":this._x=g*_*y+m*S*E,this._y=m*S*y-g*_*E,this._z=m*_*E+g*S*y,this._w=m*_*y-g*S*E;break;case"YXZ":this._x=g*_*y+m*S*E,this._y=m*S*y-g*_*E,this._z=m*_*E-g*S*y,this._w=m*_*y+g*S*E;break;case"ZXY":this._x=g*_*y-m*S*E,this._y=m*S*y+g*_*E,this._z=m*_*E+g*S*y,this._w=m*_*y-g*S*E;break;case"ZYX":this._x=g*_*y-m*S*E,this._y=m*S*y+g*_*E,this._z=m*_*E-g*S*y,this._w=m*_*y+g*S*E;break;case"YZX":this._x=g*_*y+m*S*E,this._y=m*S*y+g*_*E,this._z=m*_*E-g*S*y,this._w=m*_*y-g*S*E;break;case"XZY":this._x=g*_*y-m*S*E,this._y=m*S*y-g*_*E,this._z=m*_*E+g*S*y,this._w=m*_*y+g*S*E;break;default:ct("Quaternion: .setFromEuler() encountered an unknown order: "+c)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const r=t/2,o=Math.sin(r);return this._x=e.x*o,this._y=e.y*o,this._z=e.z*o,this._w=Math.cos(r),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,r=t[0],o=t[4],l=t[8],c=t[1],f=t[5],p=t[9],m=t[2],_=t[6],y=t[10],g=r+f+y;if(g>0){const S=.5/Math.sqrt(g+1);this._w=.25/S,this._x=(_-p)*S,this._y=(l-m)*S,this._z=(c-o)*S}else if(r>f&&r>y){const S=2*Math.sqrt(1+r-f-y);this._w=(_-p)/S,this._x=.25*S,this._y=(o+c)/S,this._z=(l+m)/S}else if(f>y){const S=2*Math.sqrt(1+f-r-y);this._w=(l-m)/S,this._x=(o+c)/S,this._y=.25*S,this._z=(p+_)/S}else{const S=2*Math.sqrt(1+y-r-f);this._w=(c-o)/S,this._x=(l+m)/S,this._y=(p+_)/S,this._z=.25*S}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let r=e.dot(t)+1;return r<1e-8?(r=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=r):(this._x=0,this._y=-e.z,this._z=e.y,this._w=r)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=r),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Dt(this.dot(e),-1,1)))}rotateTowards(e,t){const r=this.angleTo(e);if(r===0)return this;const o=Math.min(1,t/r);return this.slerp(e,o),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const r=e._x,o=e._y,l=e._z,c=e._w,f=t._x,p=t._y,m=t._z,_=t._w;return this._x=r*_+c*f+o*m-l*p,this._y=o*_+c*p+l*f-r*m,this._z=l*_+c*m+r*p-o*f,this._w=c*_-r*f-o*p-l*m,this._onChangeCallback(),this}slerp(e,t){let r=e._x,o=e._y,l=e._z,c=e._w,f=this.dot(e);f<0&&(r=-r,o=-o,l=-l,c=-c,f=-f);let p=1-t;if(f<.9995){const m=Math.acos(f),_=Math.sin(m);p=Math.sin(p*m)/_,t=Math.sin(t*m)/_,this._x=this._x*p+r*t,this._y=this._y*p+o*t,this._z=this._z*p+l*t,this._w=this._w*p+c*t,this._onChangeCallback()}else this._x=this._x*p+r*t,this._y=this._y*p+o*t,this._z=this._z*p+l*t,this._w=this._w*p+c*t,this.normalize();return this}slerpQuaternions(e,t,r){return this.copy(e).slerp(t,r)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),r=Math.random(),o=Math.sqrt(1-r),l=Math.sqrt(r);return this.set(o*Math.sin(e),o*Math.cos(e),l*Math.sin(t),l*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Zh=class Zh{constructor(e=0,t=0,r=0){this.x=e,this.y=t,this.z=r}set(e,t,r){return r===void 0&&(r=this.z),this.x=e,this.y=t,this.z=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Rg.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Rg.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,r=this.y,o=this.z,l=e.elements;return this.x=l[0]*t+l[3]*r+l[6]*o,this.y=l[1]*t+l[4]*r+l[7]*o,this.z=l[2]*t+l[5]*r+l[8]*o,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,r=this.y,o=this.z,l=e.elements,c=1/(l[3]*t+l[7]*r+l[11]*o+l[15]);return this.x=(l[0]*t+l[4]*r+l[8]*o+l[12])*c,this.y=(l[1]*t+l[5]*r+l[9]*o+l[13])*c,this.z=(l[2]*t+l[6]*r+l[10]*o+l[14])*c,this}applyQuaternion(e){const t=this.x,r=this.y,o=this.z,l=e.x,c=e.y,f=e.z,p=e.w,m=2*(c*o-f*r),_=2*(f*t-l*o),y=2*(l*r-c*t);return this.x=t+p*m+c*y-f*_,this.y=r+p*_+f*m-l*y,this.z=o+p*y+l*_-c*m,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,r=this.y,o=this.z,l=e.elements;return this.x=l[0]*t+l[4]*r+l[8]*o,this.y=l[1]*t+l[5]*r+l[9]*o,this.z=l[2]*t+l[6]*r+l[10]*o,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Dt(this.x,e.x,t.x),this.y=Dt(this.y,e.y,t.y),this.z=Dt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Dt(this.x,e,t),this.y=Dt(this.y,e,t),this.z=Dt(this.z,e,t),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Dt(r,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this.z=e.z+(t.z-e.z)*r,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const r=e.x,o=e.y,l=e.z,c=t.x,f=t.y,p=t.z;return this.x=o*p-l*f,this.y=l*c-r*p,this.z=r*f-o*c,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const r=e.dot(this)/t;return this.copy(e).multiplyScalar(r)}projectOnPlane(e){return Cf.copy(this).projectOnVector(e),this.sub(Cf)}reflect(e){return this.sub(Cf.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const r=this.dot(e)/t;return Math.acos(Dt(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,r=this.y-e.y,o=this.z-e.z;return t*t+r*r+o*o}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,r){const o=Math.sin(t)*e;return this.x=o*Math.sin(r),this.y=Math.cos(t)*e,this.z=o*Math.cos(r),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,r){return this.x=e*Math.sin(t),this.y=r,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),r=this.setFromMatrixColumn(e,1).length(),o=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=r,this.z=o,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,r=Math.sqrt(1-t*t);return this.x=r*Math.cos(e),this.y=t,this.z=r*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Zh.prototype.isVector3=!0;let Z=Zh;const Cf=new Z,Rg=new js,Jh=class Jh{constructor(e,t,r,o,l,c,f,p,m){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,r,o,l,c,f,p,m)}set(e,t,r,o,l,c,f,p,m){const _=this.elements;return _[0]=e,_[1]=o,_[2]=f,_[3]=t,_[4]=l,_[5]=p,_[6]=r,_[7]=c,_[8]=m,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,r=e.elements;return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],this}extractBasis(e,t,r){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),r.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const r=e.elements,o=t.elements,l=this.elements,c=r[0],f=r[3],p=r[6],m=r[1],_=r[4],y=r[7],g=r[2],S=r[5],E=r[8],A=o[0],x=o[3],v=o[6],C=o[1],U=o[4],R=o[7],G=o[2],D=o[5],V=o[8];return l[0]=c*A+f*C+p*G,l[3]=c*x+f*U+p*D,l[6]=c*v+f*R+p*V,l[1]=m*A+_*C+y*G,l[4]=m*x+_*U+y*D,l[7]=m*v+_*R+y*V,l[2]=g*A+S*C+E*G,l[5]=g*x+S*U+E*D,l[8]=g*v+S*R+E*V,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],r=e[1],o=e[2],l=e[3],c=e[4],f=e[5],p=e[6],m=e[7],_=e[8];return t*c*_-t*f*m-r*l*_+r*f*p+o*l*m-o*c*p}invert(){const e=this.elements,t=e[0],r=e[1],o=e[2],l=e[3],c=e[4],f=e[5],p=e[6],m=e[7],_=e[8],y=_*c-f*m,g=f*p-_*l,S=m*l-c*p,E=t*y+r*g+o*S;if(E===0)return this.set(0,0,0,0,0,0,0,0,0);const A=1/E;return e[0]=y*A,e[1]=(o*m-_*r)*A,e[2]=(f*r-o*c)*A,e[3]=g*A,e[4]=(_*t-o*p)*A,e[5]=(o*l-f*t)*A,e[6]=S*A,e[7]=(r*p-m*t)*A,e[8]=(c*t-r*l)*A,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,r,o,l,c,f){const p=Math.cos(l),m=Math.sin(l);return this.set(r*p,r*m,-r*(p*c+m*f)+c+e,-o*m,o*p,-o*(-m*c+p*f)+f+t,0,0,1),this}scale(e,t){return this.premultiply(Pf.makeScale(e,t)),this}rotate(e){return this.premultiply(Pf.makeRotation(-e)),this}translate(e,t){return this.premultiply(Pf.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,-r,0,r,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,r=e.elements;for(let o=0;o<9;o++)if(t[o]!==r[o])return!1;return!0}fromArray(e,t=0){for(let r=0;r<9;r++)this.elements[r]=e[r+t];return this}toArray(e=[],t=0){const r=this.elements;return e[t]=r[0],e[t+1]=r[1],e[t+2]=r[2],e[t+3]=r[3],e[t+4]=r[4],e[t+5]=r[5],e[t+6]=r[6],e[t+7]=r[7],e[t+8]=r[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Jh.prototype.isMatrix3=!0;let gt=Jh;const Pf=new gt,Cg=new gt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Pg=new gt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function kx(){const s={enabled:!0,workingColorSpace:Wo,spaces:{},convert:function(o,l,c){return this.enabled===!1||l===c||!l||!c||(this.spaces[l].transfer===kt&&(o.r=Cr(o.r),o.g=Cr(o.g),o.b=Cr(o.b)),this.spaces[l].primaries!==this.spaces[c].primaries&&(o.applyMatrix3(this.spaces[l].toXYZ),o.applyMatrix3(this.spaces[c].fromXYZ)),this.spaces[c].transfer===kt&&(o.r=Fa(o.r),o.g=Fa(o.g),o.b=Fa(o.b))),o},workingToColorSpace:function(o,l){return this.convert(o,this.workingColorSpace,l)},colorSpaceToWorking:function(o,l){return this.convert(o,l,this.workingColorSpace)},getPrimaries:function(o){return this.spaces[o].primaries},getTransfer:function(o){return o===br?jo:this.spaces[o].transfer},getToneMappingMode:function(o){return this.spaces[o].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(o,l=this.workingColorSpace){return o.fromArray(this.spaces[l].luminanceCoefficients)},define:function(o){Object.assign(this.spaces,o)},_getMatrix:function(o,l,c){return o.copy(this.spaces[l].toXYZ).multiply(this.spaces[c].fromXYZ)},_getDrawingBufferColorSpace:function(o){return this.spaces[o].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(o=this.workingColorSpace){return this.spaces[o].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(o,l){return Ec("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(o,l)},toWorkingColorSpace:function(o,l){return Ec("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(o,l)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],r=[.3127,.329];return s.define({[Wo]:{primaries:e,whitePoint:r,transfer:jo,toXYZ:Cg,fromXYZ:Pg,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Kn},outputColorSpaceConfig:{drawingBufferColorSpace:Kn}},[Kn]:{primaries:e,whitePoint:r,transfer:kt,toXYZ:Cg,fromXYZ:Pg,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Kn}}}),s}const Ct=kx();function Cr(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Fa(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let ma;class c_{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let r;if(e instanceof HTMLCanvasElement)r=e;else{ma===void 0&&(ma=Xo("canvas")),ma.width=e.width,ma.height=e.height;const o=ma.getContext("2d");e instanceof ImageData?o.putImageData(e,0,0):o.drawImage(e,0,0,e.width,e.height),r=ma}return r.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Xo("canvas");t.width=e.width,t.height=e.height;const r=t.getContext("2d");r.drawImage(e,0,0,e.width,e.height);const o=r.getImageData(0,0,e.width,e.height),l=o.data;for(let c=0;c<l.length;c++)l[c]=Cr(l[c]/255)*255;return r.putImageData(o,0,0),t}else if(e.data){const t=e.data.slice(0);for(let r=0;r<t.length;r++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[r]=Math.floor(Cr(t[r]/255)*255):t[r]=Cr(t[r]);return{data:t,width:e.width,height:e.height}}else return ct("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Bx=0;class Fc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Bx++}),this.uuid=cs(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const r={uuid:this.uuid,url:""},o=this.data;if(o!==null){let l;if(Array.isArray(o)){l=[];for(let c=0,f=o.length;c<f;c++)o[c].isDataTexture?l.push(Nf(o[c].image)):l.push(Nf(o[c]))}else l=Nf(o);r.url=l}return t||(e.images[this.uuid]=r),r}}function Nf(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?c_.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(ct("Texture: Unable to serialize Texture."),{})}let Vx=0;const Lf=new Z;class An extends hs{constructor(e=An.DEFAULT_IMAGE,t=An.DEFAULT_MAPPING,r=or,o=or,l=Ln,c=as,f=Ai,p=oi,m=An.DEFAULT_ANISOTROPY,_=br){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Vx++}),this.uuid=cs(),this.name="",this.source=new Fc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=r,this.wrapT=o,this.magFilter=l,this.minFilter=c,this.anisotropy=m,this.format=f,this.internalFormat=null,this.type=p,this.offset=new vt(0,0),this.repeat=new vt(1,1),this.center=new vt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new gt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=_,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Lf).x}get height(){return this.source.getSize(Lf).y}get depth(){return this.source.getSize(Lf).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const r=e[t];if(r===void 0){ct(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const o=this[t];if(o===void 0){ct(`Texture.setValues(): property '${t}' does not exist.`);continue}o&&r&&o.isVector2&&r.isVector2||o&&r&&o.isVector3&&r.isVector3||o&&r&&o.isMatrix3&&r.isMatrix3?o.copy(r):this[t]=r}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const r={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(r.userData=this.userData),t||(e.textures[this.uuid]=r),r}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Nh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Hu:e.x=e.x-Math.floor(e.x);break;case or:e.x=e.x<0?0:1;break;case Wu:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Hu:e.y=e.y-Math.floor(e.y);break;case or:e.y=e.y<0?0:1;break;case Wu:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}An.DEFAULT_IMAGE=null;An.DEFAULT_MAPPING=Nh;An.DEFAULT_ANISOTROPY=1;const Qh=class Qh{constructor(e=0,t=0,r=0,o=1){this.x=e,this.y=t,this.z=r,this.w=o}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,r,o){return this.x=e,this.y=t,this.z=r,this.w=o,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,r=this.y,o=this.z,l=this.w,c=e.elements;return this.x=c[0]*t+c[4]*r+c[8]*o+c[12]*l,this.y=c[1]*t+c[5]*r+c[9]*o+c[13]*l,this.z=c[2]*t+c[6]*r+c[10]*o+c[14]*l,this.w=c[3]*t+c[7]*r+c[11]*o+c[15]*l,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,r,o,l;const p=e.elements,m=p[0],_=p[4],y=p[8],g=p[1],S=p[5],E=p[9],A=p[2],x=p[6],v=p[10];if(Math.abs(_-g)<.01&&Math.abs(y-A)<.01&&Math.abs(E-x)<.01){if(Math.abs(_+g)<.1&&Math.abs(y+A)<.1&&Math.abs(E+x)<.1&&Math.abs(m+S+v-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const U=(m+1)/2,R=(S+1)/2,G=(v+1)/2,D=(_+g)/4,V=(y+A)/4,w=(E+x)/4;return U>R&&U>G?U<.01?(r=0,o=.707106781,l=.707106781):(r=Math.sqrt(U),o=D/r,l=V/r):R>G?R<.01?(r=.707106781,o=0,l=.707106781):(o=Math.sqrt(R),r=D/o,l=w/o):G<.01?(r=.707106781,o=.707106781,l=0):(l=Math.sqrt(G),r=V/l,o=w/l),this.set(r,o,l,t),this}let C=Math.sqrt((x-E)*(x-E)+(y-A)*(y-A)+(g-_)*(g-_));return Math.abs(C)<.001&&(C=1),this.x=(x-E)/C,this.y=(y-A)/C,this.z=(g-_)/C,this.w=Math.acos((m+S+v-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Dt(this.x,e.x,t.x),this.y=Dt(this.y,e.y,t.y),this.z=Dt(this.z,e.z,t.z),this.w=Dt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Dt(this.x,e,t),this.y=Dt(this.y,e,t),this.z=Dt(this.z,e,t),this.w=Dt(this.w,e,t),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Dt(r,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this.z=e.z+(t.z-e.z)*r,this.w=e.w+(t.w-e.w)*r,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Qh.prototype.isVector4=!0;let rn=Qh;class d_ extends hs{constructor(e=1,t=1,r={}){super(),r=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ln,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},r),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=r.depth,this.scissor=new rn(0,0,e,t),this.scissorTest=!1,this.viewport=new rn(0,0,e,t),this.textures=[];const o={width:e,height:t,depth:r.depth},l=new An(o),c=r.count;for(let f=0;f<c;f++)this.textures[f]=l.clone(),this.textures[f].isRenderTargetTexture=!0,this.textures[f].renderTarget=this;this._setTextureOptions(r),this.depthBuffer=r.depthBuffer,this.stencilBuffer=r.stencilBuffer,this.resolveDepthBuffer=r.resolveDepthBuffer,this.resolveStencilBuffer=r.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=r.depthTexture,this.samples=r.samples,this.multiview=r.multiview}_setTextureOptions(e={}){const t={minFilter:Ln,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let r=0;r<this.textures.length;r++)this.textures[r].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,r=1){if(this.width!==e||this.height!==t||this.depth!==r){this.width=e,this.height=t,this.depth=r;for(let o=0,l=this.textures.length;o<l;o++)this.textures[o].image.width=e,this.textures[o].image.height=t,this.textures[o].image.depth=r,this.textures[o].isData3DTexture!==!0&&(this.textures[o].isArrayTexture=this.textures[o].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,r=e.textures.length;t<r;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const o=Object.assign({},e.textures[t].image);this.textures[t].source=new Fc(o)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Xi extends d_{constructor(e=1,t=1,r={}){super(e,t,r),this.isWebGLRenderTarget=!0}}class kh extends An{constructor(e=null,t=1,r=1,o=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:r,depth:o},this.magFilter=bn,this.minFilter=bn,this.wrapR=or,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class f_ extends An{constructor(e=null,t=1,r=1,o=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:r,depth:o},this.magFilter=bn,this.minFilter=bn,this.wrapR=or,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const bc=class bc{constructor(e,t,r,o,l,c,f,p,m,_,y,g,S,E,A,x){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,r,o,l,c,f,p,m,_,y,g,S,E,A,x)}set(e,t,r,o,l,c,f,p,m,_,y,g,S,E,A,x){const v=this.elements;return v[0]=e,v[4]=t,v[8]=r,v[12]=o,v[1]=l,v[5]=c,v[9]=f,v[13]=p,v[2]=m,v[6]=_,v[10]=y,v[14]=g,v[3]=S,v[7]=E,v[11]=A,v[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new bc().fromArray(this.elements)}copy(e){const t=this.elements,r=e.elements;return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],t[9]=r[9],t[10]=r[10],t[11]=r[11],t[12]=r[12],t[13]=r[13],t[14]=r[14],t[15]=r[15],this}copyPosition(e){const t=this.elements,r=e.elements;return t[12]=r[12],t[13]=r[13],t[14]=r[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,r){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),r.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),r.setFromMatrixColumn(this,2),this)}makeBasis(e,t,r){return this.set(e.x,t.x,r.x,0,e.y,t.y,r.y,0,e.z,t.z,r.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,r=e.elements,o=1/ga.setFromMatrixColumn(e,0).length(),l=1/ga.setFromMatrixColumn(e,1).length(),c=1/ga.setFromMatrixColumn(e,2).length();return t[0]=r[0]*o,t[1]=r[1]*o,t[2]=r[2]*o,t[3]=0,t[4]=r[4]*l,t[5]=r[5]*l,t[6]=r[6]*l,t[7]=0,t[8]=r[8]*c,t[9]=r[9]*c,t[10]=r[10]*c,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,r=e.x,o=e.y,l=e.z,c=Math.cos(r),f=Math.sin(r),p=Math.cos(o),m=Math.sin(o),_=Math.cos(l),y=Math.sin(l);if(e.order==="XYZ"){const g=c*_,S=c*y,E=f*_,A=f*y;t[0]=p*_,t[4]=-p*y,t[8]=m,t[1]=S+E*m,t[5]=g-A*m,t[9]=-f*p,t[2]=A-g*m,t[6]=E+S*m,t[10]=c*p}else if(e.order==="YXZ"){const g=p*_,S=p*y,E=m*_,A=m*y;t[0]=g+A*f,t[4]=E*f-S,t[8]=c*m,t[1]=c*y,t[5]=c*_,t[9]=-f,t[2]=S*f-E,t[6]=A+g*f,t[10]=c*p}else if(e.order==="ZXY"){const g=p*_,S=p*y,E=m*_,A=m*y;t[0]=g-A*f,t[4]=-c*y,t[8]=E+S*f,t[1]=S+E*f,t[5]=c*_,t[9]=A-g*f,t[2]=-c*m,t[6]=f,t[10]=c*p}else if(e.order==="ZYX"){const g=c*_,S=c*y,E=f*_,A=f*y;t[0]=p*_,t[4]=E*m-S,t[8]=g*m+A,t[1]=p*y,t[5]=A*m+g,t[9]=S*m-E,t[2]=-m,t[6]=f*p,t[10]=c*p}else if(e.order==="YZX"){const g=c*p,S=c*m,E=f*p,A=f*m;t[0]=p*_,t[4]=A-g*y,t[8]=E*y+S,t[1]=y,t[5]=c*_,t[9]=-f*_,t[2]=-m*_,t[6]=S*y+E,t[10]=g-A*y}else if(e.order==="XZY"){const g=c*p,S=c*m,E=f*p,A=f*m;t[0]=p*_,t[4]=-y,t[8]=m*_,t[1]=g*y+A,t[5]=c*_,t[9]=S*y-E,t[2]=E*y-S,t[6]=f*_,t[10]=A*y+g}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Gx,e,Hx)}lookAt(e,t,r){const o=this.elements;return hi.subVectors(e,t),hi.lengthSq()===0&&(hi.z=1),hi.normalize(),Jr.crossVectors(r,hi),Jr.lengthSq()===0&&(Math.abs(r.z)===1?hi.x+=1e-4:hi.z+=1e-4,hi.normalize(),Jr.crossVectors(r,hi)),Jr.normalize(),eu.crossVectors(hi,Jr),o[0]=Jr.x,o[4]=eu.x,o[8]=hi.x,o[1]=Jr.y,o[5]=eu.y,o[9]=hi.y,o[2]=Jr.z,o[6]=eu.z,o[10]=hi.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const r=e.elements,o=t.elements,l=this.elements,c=r[0],f=r[4],p=r[8],m=r[12],_=r[1],y=r[5],g=r[9],S=r[13],E=r[2],A=r[6],x=r[10],v=r[14],C=r[3],U=r[7],R=r[11],G=r[15],D=o[0],V=o[4],w=o[8],I=o[12],X=o[1],k=o[5],K=o[9],le=o[13],ue=o[2],W=o[6],$=o[10],Y=o[14],Q=o[3],pe=o[7],me=o[11],z=o[15];return l[0]=c*D+f*X+p*ue+m*Q,l[4]=c*V+f*k+p*W+m*pe,l[8]=c*w+f*K+p*$+m*me,l[12]=c*I+f*le+p*Y+m*z,l[1]=_*D+y*X+g*ue+S*Q,l[5]=_*V+y*k+g*W+S*pe,l[9]=_*w+y*K+g*$+S*me,l[13]=_*I+y*le+g*Y+S*z,l[2]=E*D+A*X+x*ue+v*Q,l[6]=E*V+A*k+x*W+v*pe,l[10]=E*w+A*K+x*$+v*me,l[14]=E*I+A*le+x*Y+v*z,l[3]=C*D+U*X+R*ue+G*Q,l[7]=C*V+U*k+R*W+G*pe,l[11]=C*w+U*K+R*$+G*me,l[15]=C*I+U*le+R*Y+G*z,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],r=e[4],o=e[8],l=e[12],c=e[1],f=e[5],p=e[9],m=e[13],_=e[2],y=e[6],g=e[10],S=e[14],E=e[3],A=e[7],x=e[11],v=e[15],C=p*S-m*g,U=f*S-m*y,R=f*g-p*y,G=c*S-m*_,D=c*g-p*_,V=c*y-f*_;return t*(A*C-x*U+v*R)-r*(E*C-x*G+v*D)+o*(E*U-A*G+v*V)-l*(E*R-A*D+x*V)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,r){const o=this.elements;return e.isVector3?(o[12]=e.x,o[13]=e.y,o[14]=e.z):(o[12]=e,o[13]=t,o[14]=r),this}invert(){const e=this.elements,t=e[0],r=e[1],o=e[2],l=e[3],c=e[4],f=e[5],p=e[6],m=e[7],_=e[8],y=e[9],g=e[10],S=e[11],E=e[12],A=e[13],x=e[14],v=e[15],C=t*f-r*c,U=t*p-o*c,R=t*m-l*c,G=r*p-o*f,D=r*m-l*f,V=o*m-l*p,w=_*A-y*E,I=_*x-g*E,X=_*v-S*E,k=y*x-g*A,K=y*v-S*A,le=g*v-S*x,ue=C*le-U*K+R*k+G*X-D*I+V*w;if(ue===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const W=1/ue;return e[0]=(f*le-p*K+m*k)*W,e[1]=(o*K-r*le-l*k)*W,e[2]=(A*V-x*D+v*G)*W,e[3]=(g*D-y*V-S*G)*W,e[4]=(p*X-c*le-m*I)*W,e[5]=(t*le-o*X+l*I)*W,e[6]=(x*R-E*V-v*U)*W,e[7]=(_*V-g*R+S*U)*W,e[8]=(c*K-f*X+m*w)*W,e[9]=(r*X-t*K-l*w)*W,e[10]=(E*D-A*R+v*C)*W,e[11]=(y*R-_*D-S*C)*W,e[12]=(f*I-c*k-p*w)*W,e[13]=(t*k-r*I+o*w)*W,e[14]=(A*U-E*G-x*C)*W,e[15]=(_*G-y*U+g*C)*W,this}scale(e){const t=this.elements,r=e.x,o=e.y,l=e.z;return t[0]*=r,t[4]*=o,t[8]*=l,t[1]*=r,t[5]*=o,t[9]*=l,t[2]*=r,t[6]*=o,t[10]*=l,t[3]*=r,t[7]*=o,t[11]*=l,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],r=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],o=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,r,o))}makeTranslation(e,t,r){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,r,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),r=Math.sin(e);return this.set(1,0,0,0,0,t,-r,0,0,r,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,0,r,0,0,1,0,0,-r,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,-r,0,0,r,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const r=Math.cos(t),o=Math.sin(t),l=1-r,c=e.x,f=e.y,p=e.z,m=l*c,_=l*f;return this.set(m*c+r,m*f-o*p,m*p+o*f,0,m*f+o*p,_*f+r,_*p-o*c,0,m*p-o*f,_*p+o*c,l*p*p+r,0,0,0,0,1),this}makeScale(e,t,r){return this.set(e,0,0,0,0,t,0,0,0,0,r,0,0,0,0,1),this}makeShear(e,t,r,o,l,c){return this.set(1,r,l,0,e,1,c,0,t,o,1,0,0,0,0,1),this}compose(e,t,r){const o=this.elements,l=t._x,c=t._y,f=t._z,p=t._w,m=l+l,_=c+c,y=f+f,g=l*m,S=l*_,E=l*y,A=c*_,x=c*y,v=f*y,C=p*m,U=p*_,R=p*y,G=r.x,D=r.y,V=r.z;return o[0]=(1-(A+v))*G,o[1]=(S+R)*G,o[2]=(E-U)*G,o[3]=0,o[4]=(S-R)*D,o[5]=(1-(g+v))*D,o[6]=(x+C)*D,o[7]=0,o[8]=(E+U)*V,o[9]=(x-C)*V,o[10]=(1-(g+A))*V,o[11]=0,o[12]=e.x,o[13]=e.y,o[14]=e.z,o[15]=1,this}decompose(e,t,r){const o=this.elements;e.x=o[12],e.y=o[13],e.z=o[14];const l=this.determinant();if(l===0)return r.set(1,1,1),t.identity(),this;let c=ga.set(o[0],o[1],o[2]).length();const f=ga.set(o[4],o[5],o[6]).length(),p=ga.set(o[8],o[9],o[10]).length();l<0&&(c=-c),Oi.copy(this);const m=1/c,_=1/f,y=1/p;return Oi.elements[0]*=m,Oi.elements[1]*=m,Oi.elements[2]*=m,Oi.elements[4]*=_,Oi.elements[5]*=_,Oi.elements[6]*=_,Oi.elements[8]*=y,Oi.elements[9]*=y,Oi.elements[10]*=y,t.setFromRotationMatrix(Oi),r.x=c,r.y=f,r.z=p,this}makePerspective(e,t,r,o,l,c,f=Wi,p=!1){const m=this.elements,_=2*l/(t-e),y=2*l/(r-o),g=(t+e)/(t-e),S=(r+o)/(r-o);let E,A;if(p)E=l/(c-l),A=c*l/(c-l);else if(f===Wi)E=-(c+l)/(c-l),A=-2*c*l/(c-l);else if(f===Ba)E=-c/(c-l),A=-c*l/(c-l);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+f);return m[0]=_,m[4]=0,m[8]=g,m[12]=0,m[1]=0,m[5]=y,m[9]=S,m[13]=0,m[2]=0,m[6]=0,m[10]=E,m[14]=A,m[3]=0,m[7]=0,m[11]=-1,m[15]=0,this}makeOrthographic(e,t,r,o,l,c,f=Wi,p=!1){const m=this.elements,_=2/(t-e),y=2/(r-o),g=-(t+e)/(t-e),S=-(r+o)/(r-o);let E,A;if(p)E=1/(c-l),A=c/(c-l);else if(f===Wi)E=-2/(c-l),A=-(c+l)/(c-l);else if(f===Ba)E=-1/(c-l),A=-l/(c-l);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+f);return m[0]=_,m[4]=0,m[8]=0,m[12]=g,m[1]=0,m[5]=y,m[9]=0,m[13]=S,m[2]=0,m[6]=0,m[10]=E,m[14]=A,m[3]=0,m[7]=0,m[11]=0,m[15]=1,this}equals(e){const t=this.elements,r=e.elements;for(let o=0;o<16;o++)if(t[o]!==r[o])return!1;return!0}fromArray(e,t=0){for(let r=0;r<16;r++)this.elements[r]=e[r+t];return this}toArray(e=[],t=0){const r=this.elements;return e[t]=r[0],e[t+1]=r[1],e[t+2]=r[2],e[t+3]=r[3],e[t+4]=r[4],e[t+5]=r[5],e[t+6]=r[6],e[t+7]=r[7],e[t+8]=r[8],e[t+9]=r[9],e[t+10]=r[10],e[t+11]=r[11],e[t+12]=r[12],e[t+13]=r[13],e[t+14]=r[14],e[t+15]=r[15],e}};bc.prototype.isMatrix4=!0;let Jt=bc;const ga=new Z,Oi=new Jt,Gx=new Z(0,0,0),Hx=new Z(1,1,1),Jr=new Z,eu=new Z,hi=new Z,Ng=new Jt,Lg=new js;class Nr{constructor(e=0,t=0,r=0,o=Nr.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=r,this._order=o}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,r,o=this._order){return this._x=e,this._y=t,this._z=r,this._order=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,r=!0){const o=e.elements,l=o[0],c=o[4],f=o[8],p=o[1],m=o[5],_=o[9],y=o[2],g=o[6],S=o[10];switch(t){case"XYZ":this._y=Math.asin(Dt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(-_,S),this._z=Math.atan2(-c,l)):(this._x=Math.atan2(g,m),this._z=0);break;case"YXZ":this._x=Math.asin(-Dt(_,-1,1)),Math.abs(_)<.9999999?(this._y=Math.atan2(f,S),this._z=Math.atan2(p,m)):(this._y=Math.atan2(-y,l),this._z=0);break;case"ZXY":this._x=Math.asin(Dt(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(-y,S),this._z=Math.atan2(-c,m)):(this._y=0,this._z=Math.atan2(p,l));break;case"ZYX":this._y=Math.asin(-Dt(y,-1,1)),Math.abs(y)<.9999999?(this._x=Math.atan2(g,S),this._z=Math.atan2(p,l)):(this._x=0,this._z=Math.atan2(-c,m));break;case"YZX":this._z=Math.asin(Dt(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(-_,m),this._y=Math.atan2(-y,l)):(this._x=0,this._y=Math.atan2(f,S));break;case"XZY":this._z=Math.asin(-Dt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(g,m),this._y=Math.atan2(f,l)):(this._x=Math.atan2(-_,S),this._y=0);break;default:ct("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,r===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,r){return Ng.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ng,t,r)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Lg.setFromEuler(this),this.setFromQuaternion(Lg,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Nr.DEFAULT_ORDER="XYZ";class Oc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Wx=0;const Dg=new Z,_a=new js,yr=new Jt,tu=new Z,To=new Z,jx=new Z,Xx=new js,Ig=new Z(1,0,0),Ug=new Z(0,1,0),Fg=new Z(0,0,1),Og={type:"added"},Yx={type:"removed"},va={type:"childadded",child:null},Df={type:"childremoved",child:null};class un extends hs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Wx++}),this.uuid=cs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=un.DEFAULT_UP.clone();const e=new Z,t=new Nr,r=new js,o=new Z(1,1,1);function l(){r.setFromEuler(t,!1)}function c(){t.setFromQuaternion(r,void 0,!1)}t._onChange(l),r._onChange(c),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:o},modelViewMatrix:{value:new Jt},normalMatrix:{value:new gt}}),this.matrix=new Jt,this.matrixWorld=new Jt,this.matrixAutoUpdate=un.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=un.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Oc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return _a.setFromAxisAngle(e,t),this.quaternion.multiply(_a),this}rotateOnWorldAxis(e,t){return _a.setFromAxisAngle(e,t),this.quaternion.premultiply(_a),this}rotateX(e){return this.rotateOnAxis(Ig,e)}rotateY(e){return this.rotateOnAxis(Ug,e)}rotateZ(e){return this.rotateOnAxis(Fg,e)}translateOnAxis(e,t){return Dg.copy(e).applyQuaternion(this.quaternion),this.position.add(Dg.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ig,e)}translateY(e){return this.translateOnAxis(Ug,e)}translateZ(e){return this.translateOnAxis(Fg,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(yr.copy(this.matrixWorld).invert())}lookAt(e,t,r){e.isVector3?tu.copy(e):tu.set(e,t,r);const o=this.parent;this.updateWorldMatrix(!0,!1),To.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?yr.lookAt(To,tu,this.up):yr.lookAt(tu,To,this.up),this.quaternion.setFromRotationMatrix(yr),o&&(yr.extractRotation(o.matrixWorld),_a.setFromRotationMatrix(yr),this.quaternion.premultiply(_a.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Rt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Og),va.child=e,this.dispatchEvent(va),va.child=null):Rt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.remove(arguments[r]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Yx),Df.child=e,this.dispatchEvent(Df),Df.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),yr.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),yr.multiply(e.parent.matrixWorld)),e.applyMatrix4(yr),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Og),va.child=e,this.dispatchEvent(va),va.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let r=0,o=this.children.length;r<o;r++){const c=this.children[r].getObjectByProperty(e,t);if(c!==void 0)return c}}getObjectsByProperty(e,t,r=[]){this[e]===t&&r.push(this);const o=this.children;for(let l=0,c=o.length;l<c;l++)o[l].getObjectsByProperty(e,t,r);return r}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(To,e,jx),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(To,Xx,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let r=0,o=t.length;r<o;r++)t[r].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let r=0,o=t.length;r<o;r++)t[r].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,r=e.y,o=e.z,l=this.matrix.elements;l[12]+=t-l[0]*t-l[4]*r-l[8]*o,l[13]+=r-l[1]*t-l[5]*r-l[9]*o,l[14]+=o-l[2]*t-l[6]*r-l[10]*o}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let r=0,o=t.length;r<o;r++)t[r].updateMatrixWorld(e)}updateWorldMatrix(e,t){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const o=this.children;for(let l=0,c=o.length;l<c;l++)o[l].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",r={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},r.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const o={};o.uuid=this.uuid,o.type=this.type,this.name!==""&&(o.name=this.name),this.castShadow===!0&&(o.castShadow=!0),this.receiveShadow===!0&&(o.receiveShadow=!0),this.visible===!1&&(o.visible=!1),this.frustumCulled===!1&&(o.frustumCulled=!1),this.renderOrder!==0&&(o.renderOrder=this.renderOrder),this.static!==!1&&(o.static=this.static),Object.keys(this.userData).length>0&&(o.userData=this.userData),o.layers=this.layers.mask,o.matrix=this.matrix.toArray(),o.up=this.up.toArray(),this.pivot!==null&&(o.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(o.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(o.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(o.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(o.type="InstancedMesh",o.count=this.count,o.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(o.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(o.type="BatchedMesh",o.perObjectFrustumCulled=this.perObjectFrustumCulled,o.sortObjects=this.sortObjects,o.drawRanges=this._drawRanges,o.reservedRanges=this._reservedRanges,o.geometryInfo=this._geometryInfo.map(f=>({...f,boundingBox:f.boundingBox?f.boundingBox.toJSON():void 0,boundingSphere:f.boundingSphere?f.boundingSphere.toJSON():void 0})),o.instanceInfo=this._instanceInfo.map(f=>({...f})),o.availableInstanceIds=this._availableInstanceIds.slice(),o.availableGeometryIds=this._availableGeometryIds.slice(),o.nextIndexStart=this._nextIndexStart,o.nextVertexStart=this._nextVertexStart,o.geometryCount=this._geometryCount,o.maxInstanceCount=this._maxInstanceCount,o.maxVertexCount=this._maxVertexCount,o.maxIndexCount=this._maxIndexCount,o.geometryInitialized=this._geometryInitialized,o.matricesTexture=this._matricesTexture.toJSON(e),o.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(o.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(o.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(o.boundingBox=this.boundingBox.toJSON()));function l(f,p){return f[p.uuid]===void 0&&(f[p.uuid]=p.toJSON(e)),p.uuid}if(this.isScene)this.background&&(this.background.isColor?o.background=this.background.toJSON():this.background.isTexture&&(o.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(o.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){o.geometry=l(e.geometries,this.geometry);const f=this.geometry.parameters;if(f!==void 0&&f.shapes!==void 0){const p=f.shapes;if(Array.isArray(p))for(let m=0,_=p.length;m<_;m++){const y=p[m];l(e.shapes,y)}else l(e.shapes,p)}}if(this.isSkinnedMesh&&(o.bindMode=this.bindMode,o.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(l(e.skeletons,this.skeleton),o.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const f=[];for(let p=0,m=this.material.length;p<m;p++)f.push(l(e.materials,this.material[p]));o.material=f}else o.material=l(e.materials,this.material);if(this.children.length>0){o.children=[];for(let f=0;f<this.children.length;f++)o.children.push(this.children[f].toJSON(e).object)}if(this.animations.length>0){o.animations=[];for(let f=0;f<this.animations.length;f++){const p=this.animations[f];o.animations.push(l(e.animations,p))}}if(t){const f=c(e.geometries),p=c(e.materials),m=c(e.textures),_=c(e.images),y=c(e.shapes),g=c(e.skeletons),S=c(e.animations),E=c(e.nodes);f.length>0&&(r.geometries=f),p.length>0&&(r.materials=p),m.length>0&&(r.textures=m),_.length>0&&(r.images=_),y.length>0&&(r.shapes=y),g.length>0&&(r.skeletons=g),S.length>0&&(r.animations=S),E.length>0&&(r.nodes=E)}return r.object=o,r;function c(f){const p=[];for(const m in f){const _=f[m];delete _.metadata,p.push(_)}return p}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let r=0;r<e.children.length;r++){const o=e.children[r];this.add(o.clone())}return this}}un.DEFAULT_UP=new Z(0,1,0);un.DEFAULT_MATRIX_AUTO_UPDATE=!0;un.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Bi extends un{constructor(){super(),this.isGroup=!0,this.type="Group"}}const qx={type:"move"};class Pu{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Bi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Bi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Bi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Z,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const r of e.hand.values())this._getHandJoint(t,r)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,r){let o=null,l=null,c=null;const f=this._targetRay,p=this._grip,m=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(m&&e.hand){c=!0;for(const A of e.hand.values()){const x=t.getJointPose(A,r),v=this._getHandJoint(m,A);x!==null&&(v.matrix.fromArray(x.transform.matrix),v.matrix.decompose(v.position,v.rotation,v.scale),v.matrixWorldNeedsUpdate=!0,v.jointRadius=x.radius),v.visible=x!==null}const _=m.joints["index-finger-tip"],y=m.joints["thumb-tip"],g=_.position.distanceTo(y.position),S=.02,E=.005;m.inputState.pinching&&g>S+E?(m.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!m.inputState.pinching&&g<=S-E&&(m.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else p!==null&&e.gripSpace&&(l=t.getPose(e.gripSpace,r),l!==null&&(p.matrix.fromArray(l.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,l.linearVelocity?(p.hasLinearVelocity=!0,p.linearVelocity.copy(l.linearVelocity)):p.hasLinearVelocity=!1,l.angularVelocity?(p.hasAngularVelocity=!0,p.angularVelocity.copy(l.angularVelocity)):p.hasAngularVelocity=!1,p.eventsEnabled&&p.dispatchEvent({type:"gripUpdated",data:e,target:this})));f!==null&&(o=t.getPose(e.targetRaySpace,r),o===null&&l!==null&&(o=l),o!==null&&(f.matrix.fromArray(o.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,o.linearVelocity?(f.hasLinearVelocity=!0,f.linearVelocity.copy(o.linearVelocity)):f.hasLinearVelocity=!1,o.angularVelocity?(f.hasAngularVelocity=!0,f.angularVelocity.copy(o.angularVelocity)):f.hasAngularVelocity=!1,this.dispatchEvent(qx)))}return f!==null&&(f.visible=o!==null),p!==null&&(p.visible=l!==null),m!==null&&(m.visible=c!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const r=new Bi;r.matrixAutoUpdate=!1,r.visible=!1,e.joints[t.jointName]=r,e.add(r)}return e.joints[t.jointName]}}const h_={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Qr={h:0,s:0,l:0},nu={h:0,s:0,l:0};function If(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class St{constructor(e,t,r){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,r)}set(e,t,r){if(t===void 0&&r===void 0){const o=e;o&&o.isColor?this.copy(o):typeof o=="number"?this.setHex(o):typeof o=="string"&&this.setStyle(o)}else this.setRGB(e,t,r);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Kn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ct.colorSpaceToWorking(this,t),this}setRGB(e,t,r,o=Ct.workingColorSpace){return this.r=e,this.g=t,this.b=r,Ct.colorSpaceToWorking(this,o),this}setHSL(e,t,r,o=Ct.workingColorSpace){if(e=zx(e,1),t=Dt(t,0,1),r=Dt(r,0,1),t===0)this.r=this.g=this.b=r;else{const l=r<=.5?r*(1+t):r+t-r*t,c=2*r-l;this.r=If(c,l,e+1/3),this.g=If(c,l,e),this.b=If(c,l,e-1/3)}return Ct.colorSpaceToWorking(this,o),this}setStyle(e,t=Kn){function r(l){l!==void 0&&parseFloat(l)<1&&ct("Color: Alpha component of "+e+" will be ignored.")}let o;if(o=/^(\w+)\(([^\)]*)\)/.exec(e)){let l;const c=o[1],f=o[2];switch(c){case"rgb":case"rgba":if(l=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(f))return r(l[4]),this.setRGB(Math.min(255,parseInt(l[1],10))/255,Math.min(255,parseInt(l[2],10))/255,Math.min(255,parseInt(l[3],10))/255,t);if(l=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(f))return r(l[4]),this.setRGB(Math.min(100,parseInt(l[1],10))/100,Math.min(100,parseInt(l[2],10))/100,Math.min(100,parseInt(l[3],10))/100,t);break;case"hsl":case"hsla":if(l=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(f))return r(l[4]),this.setHSL(parseFloat(l[1])/360,parseFloat(l[2])/100,parseFloat(l[3])/100,t);break;default:ct("Color: Unknown color model "+e)}}else if(o=/^\#([A-Fa-f\d]+)$/.exec(e)){const l=o[1],c=l.length;if(c===3)return this.setRGB(parseInt(l.charAt(0),16)/15,parseInt(l.charAt(1),16)/15,parseInt(l.charAt(2),16)/15,t);if(c===6)return this.setHex(parseInt(l,16),t);ct("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Kn){const r=h_[e.toLowerCase()];return r!==void 0?this.setHex(r,t):ct("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Cr(e.r),this.g=Cr(e.g),this.b=Cr(e.b),this}copyLinearToSRGB(e){return this.r=Fa(e.r),this.g=Fa(e.g),this.b=Fa(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Kn){return Ct.workingToColorSpace(Bn.copy(this),e),Math.round(Dt(Bn.r*255,0,255))*65536+Math.round(Dt(Bn.g*255,0,255))*256+Math.round(Dt(Bn.b*255,0,255))}getHexString(e=Kn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ct.workingColorSpace){Ct.workingToColorSpace(Bn.copy(this),t);const r=Bn.r,o=Bn.g,l=Bn.b,c=Math.max(r,o,l),f=Math.min(r,o,l);let p,m;const _=(f+c)/2;if(f===c)p=0,m=0;else{const y=c-f;switch(m=_<=.5?y/(c+f):y/(2-c-f),c){case r:p=(o-l)/y+(o<l?6:0);break;case o:p=(l-r)/y+2;break;case l:p=(r-o)/y+4;break}p/=6}return e.h=p,e.s=m,e.l=_,e}getRGB(e,t=Ct.workingColorSpace){return Ct.workingToColorSpace(Bn.copy(this),t),e.r=Bn.r,e.g=Bn.g,e.b=Bn.b,e}getStyle(e=Kn){Ct.workingToColorSpace(Bn.copy(this),e);const t=Bn.r,r=Bn.g,o=Bn.b;return e!==Kn?`color(${e} ${t.toFixed(3)} ${r.toFixed(3)} ${o.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(r*255)},${Math.round(o*255)})`}offsetHSL(e,t,r){return this.getHSL(Qr),this.setHSL(Qr.h+e,Qr.s+t,Qr.l+r)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,r){return this.r=e.r+(t.r-e.r)*r,this.g=e.g+(t.g-e.g)*r,this.b=e.b+(t.b-e.b)*r,this}lerpHSL(e,t){this.getHSL(Qr),e.getHSL(nu);const r=Rf(Qr.h,nu.h,t),o=Rf(Qr.s,nu.s,t),l=Rf(Qr.l,nu.l,t);return this.setHSL(r,o,l),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,r=this.g,o=this.b,l=e.elements;return this.r=l[0]*t+l[3]*r+l[6]*o,this.g=l[1]*t+l[4]*r+l[7]*o,this.b=l[2]*t+l[5]*r+l[8]*o,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Bn=new St;St.NAMES=h_;class zc{constructor(e,t=1,r=1e3){this.isFog=!0,this.name="",this.color=new St(e),this.near=t,this.far=r}clone(){return new zc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class p_ extends un{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Nr,this.environmentIntensity=1,this.environmentRotation=new Nr,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const zi=new Z,Sr=new Z,Uf=new Z,Mr=new Z,xa=new Z,ya=new Z,zg=new Z,Ff=new Z,Of=new Z,zf=new Z,kf=new rn,Bf=new rn,Vf=new rn;class gi{constructor(e=new Z,t=new Z,r=new Z){this.a=e,this.b=t,this.c=r}static getNormal(e,t,r,o){o.subVectors(r,t),zi.subVectors(e,t),o.cross(zi);const l=o.lengthSq();return l>0?o.multiplyScalar(1/Math.sqrt(l)):o.set(0,0,0)}static getBarycoord(e,t,r,o,l){zi.subVectors(o,t),Sr.subVectors(r,t),Uf.subVectors(e,t);const c=zi.dot(zi),f=zi.dot(Sr),p=zi.dot(Uf),m=Sr.dot(Sr),_=Sr.dot(Uf),y=c*m-f*f;if(y===0)return l.set(0,0,0),null;const g=1/y,S=(m*p-f*_)*g,E=(c*_-f*p)*g;return l.set(1-S-E,E,S)}static containsPoint(e,t,r,o){return this.getBarycoord(e,t,r,o,Mr)===null?!1:Mr.x>=0&&Mr.y>=0&&Mr.x+Mr.y<=1}static getInterpolation(e,t,r,o,l,c,f,p){return this.getBarycoord(e,t,r,o,Mr)===null?(p.x=0,p.y=0,"z"in p&&(p.z=0),"w"in p&&(p.w=0),null):(p.setScalar(0),p.addScaledVector(l,Mr.x),p.addScaledVector(c,Mr.y),p.addScaledVector(f,Mr.z),p)}static getInterpolatedAttribute(e,t,r,o,l,c){return kf.setScalar(0),Bf.setScalar(0),Vf.setScalar(0),kf.fromBufferAttribute(e,t),Bf.fromBufferAttribute(e,r),Vf.fromBufferAttribute(e,o),c.setScalar(0),c.addScaledVector(kf,l.x),c.addScaledVector(Bf,l.y),c.addScaledVector(Vf,l.z),c}static isFrontFacing(e,t,r,o){return zi.subVectors(r,t),Sr.subVectors(e,t),zi.cross(Sr).dot(o)<0}set(e,t,r){return this.a.copy(e),this.b.copy(t),this.c.copy(r),this}setFromPointsAndIndices(e,t,r,o){return this.a.copy(e[t]),this.b.copy(e[r]),this.c.copy(e[o]),this}setFromAttributeAndIndices(e,t,r,o){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,r),this.c.fromBufferAttribute(e,o),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return zi.subVectors(this.c,this.b),Sr.subVectors(this.a,this.b),zi.cross(Sr).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return gi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return gi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,r,o,l){return gi.getInterpolation(e,this.a,this.b,this.c,t,r,o,l)}containsPoint(e){return gi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return gi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const r=this.a,o=this.b,l=this.c;let c,f;xa.subVectors(o,r),ya.subVectors(l,r),Ff.subVectors(e,r);const p=xa.dot(Ff),m=ya.dot(Ff);if(p<=0&&m<=0)return t.copy(r);Of.subVectors(e,o);const _=xa.dot(Of),y=ya.dot(Of);if(_>=0&&y<=_)return t.copy(o);const g=p*y-_*m;if(g<=0&&p>=0&&_<=0)return c=p/(p-_),t.copy(r).addScaledVector(xa,c);zf.subVectors(e,l);const S=xa.dot(zf),E=ya.dot(zf);if(E>=0&&S<=E)return t.copy(l);const A=S*m-p*E;if(A<=0&&m>=0&&E<=0)return f=m/(m-E),t.copy(r).addScaledVector(ya,f);const x=_*E-S*y;if(x<=0&&y-_>=0&&S-E>=0)return zg.subVectors(l,o),f=(y-_)/(y-_+(S-E)),t.copy(o).addScaledVector(zg,f);const v=1/(x+A+g);return c=A*v,f=g*v,t.copy(r).addScaledVector(xa,c).addScaledVector(ya,f)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Ga{constructor(e=new Z(1/0,1/0,1/0),t=new Z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,r=e.length;t<r;t+=3)this.expandByPoint(ki.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,r=e.count;t<r;t++)this.expandByPoint(ki.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,r=e.length;t<r;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const r=ki.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(r),this.max.copy(e).add(r),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const r=e.geometry;if(r!==void 0){const l=r.getAttribute("position");if(t===!0&&l!==void 0&&e.isInstancedMesh!==!0)for(let c=0,f=l.count;c<f;c++)e.isMesh===!0?e.getVertexPosition(c,ki):ki.fromBufferAttribute(l,c),ki.applyMatrix4(e.matrixWorld),this.expandByPoint(ki);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),iu.copy(e.boundingBox)):(r.boundingBox===null&&r.computeBoundingBox(),iu.copy(r.boundingBox)),iu.applyMatrix4(e.matrixWorld),this.union(iu)}const o=e.children;for(let l=0,c=o.length;l<c;l++)this.expandByObject(o[l],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ki),ki.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,r;return e.normal.x>0?(t=e.normal.x*this.min.x,r=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,r=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,r+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,r+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,r+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,r+=e.normal.z*this.min.z),t<=-e.constant&&r>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(wo),ru.subVectors(this.max,wo),Sa.subVectors(e.a,wo),Ma.subVectors(e.b,wo),Ea.subVectors(e.c,wo),es.subVectors(Ma,Sa),ts.subVectors(Ea,Ma),Cs.subVectors(Sa,Ea);let t=[0,-es.z,es.y,0,-ts.z,ts.y,0,-Cs.z,Cs.y,es.z,0,-es.x,ts.z,0,-ts.x,Cs.z,0,-Cs.x,-es.y,es.x,0,-ts.y,ts.x,0,-Cs.y,Cs.x,0];return!Gf(t,Sa,Ma,Ea,ru)||(t=[1,0,0,0,1,0,0,0,1],!Gf(t,Sa,Ma,Ea,ru))?!1:(su.crossVectors(es,ts),t=[su.x,su.y,su.z],Gf(t,Sa,Ma,Ea,ru))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ki).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ki).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Er[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Er[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Er[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Er[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Er[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Er[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Er[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Er[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Er),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Er=[new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z],ki=new Z,iu=new Ga,Sa=new Z,Ma=new Z,Ea=new Z,es=new Z,ts=new Z,Cs=new Z,wo=new Z,ru=new Z,su=new Z,Ps=new Z;function Gf(s,e,t,r,o){for(let l=0,c=s.length-3;l<=c;l+=3){Ps.fromArray(s,l);const f=o.x*Math.abs(Ps.x)+o.y*Math.abs(Ps.y)+o.z*Math.abs(Ps.z),p=e.dot(Ps),m=t.dot(Ps),_=r.dot(Ps);if(Math.max(-Math.max(p,m,_),Math.min(p,m,_))>f)return!1}return!0}const pn=new Z,au=new vt;let $x=0;class Ri extends hs{constructor(e,t,r=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:$x++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=r,this.usage=Mc,this.updateRanges=[],this.gpuType=Hi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,r){e*=this.itemSize,r*=t.itemSize;for(let o=0,l=this.itemSize;o<l;o++)this.array[e+o]=t.array[r+o];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,r=this.count;t<r;t++)au.fromBufferAttribute(this,t),au.applyMatrix3(e),this.setXY(t,au.x,au.y);else if(this.itemSize===3)for(let t=0,r=this.count;t<r;t++)pn.fromBufferAttribute(this,t),pn.applyMatrix3(e),this.setXYZ(t,pn.x,pn.y,pn.z);return this}applyMatrix4(e){for(let t=0,r=this.count;t<r;t++)pn.fromBufferAttribute(this,t),pn.applyMatrix4(e),this.setXYZ(t,pn.x,pn.y,pn.z);return this}applyNormalMatrix(e){for(let t=0,r=this.count;t<r;t++)pn.fromBufferAttribute(this,t),pn.applyNormalMatrix(e),this.setXYZ(t,pn.x,pn.y,pn.z);return this}transformDirection(e){for(let t=0,r=this.count;t<r;t++)pn.fromBufferAttribute(this,t),pn.transformDirection(e),this.setXYZ(t,pn.x,pn.y,pn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let r=this.array[e*this.itemSize+t];return this.normalized&&(r=ar(r,this.array)),r}setComponent(e,t,r){return this.normalized&&(r=Ht(r,this.array)),this.array[e*this.itemSize+t]=r,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ar(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ht(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ar(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ht(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ar(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ht(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ar(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ht(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,r){return e*=this.itemSize,this.normalized&&(t=Ht(t,this.array),r=Ht(r,this.array)),this.array[e+0]=t,this.array[e+1]=r,this}setXYZ(e,t,r,o){return e*=this.itemSize,this.normalized&&(t=Ht(t,this.array),r=Ht(r,this.array),o=Ht(o,this.array)),this.array[e+0]=t,this.array[e+1]=r,this.array[e+2]=o,this}setXYZW(e,t,r,o,l){return e*=this.itemSize,this.normalized&&(t=Ht(t,this.array),r=Ht(r,this.array),o=Ht(o,this.array),l=Ht(l,this.array)),this.array[e+0]=t,this.array[e+1]=r,this.array[e+2]=o,this.array[e+3]=l,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Mc&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class Bh extends Ri{constructor(e,t,r){super(new Uint16Array(e),t,r)}}class Vh extends Ri{constructor(e,t,r){super(new Uint32Array(e),t,r)}}class qt extends Ri{constructor(e,t,r){super(new Float32Array(e),t,r)}}const Kx=new Ga,bo=new Z,Hf=new Z;class Qo{constructor(e=new Z,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const r=this.center;t!==void 0?r.copy(t):Kx.setFromPoints(e).getCenter(r);let o=0;for(let l=0,c=e.length;l<c;l++)o=Math.max(o,r.distanceToSquared(e[l]));return this.radius=Math.sqrt(o),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const r=this.center.distanceToSquared(e);return t.copy(e),r>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;bo.subVectors(e,this.center);const t=bo.lengthSq();if(t>this.radius*this.radius){const r=Math.sqrt(t),o=(r-this.radius)*.5;this.center.addScaledVector(bo,o/r),this.radius+=o}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Hf.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(bo.copy(e.center).add(Hf)),this.expandByPoint(bo.copy(e.center).sub(Hf))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Zx=0;const Ti=new Jt,Wf=new un,Ta=new Z,pi=new Ga,Ao=new Ga,wn=new Z;class cn extends hs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Zx++}),this.uuid=cs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ux(e)?Vh:Bh)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,r=0){this.groups.push({start:e,count:t,materialIndex:r})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const r=this.attributes.normal;if(r!==void 0){const l=new gt().getNormalMatrix(e);r.applyNormalMatrix(l),r.needsUpdate=!0}const o=this.attributes.tangent;return o!==void 0&&(o.transformDirection(e),o.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Ti.makeRotationFromQuaternion(e),this.applyMatrix4(Ti),this}rotateX(e){return Ti.makeRotationX(e),this.applyMatrix4(Ti),this}rotateY(e){return Ti.makeRotationY(e),this.applyMatrix4(Ti),this}rotateZ(e){return Ti.makeRotationZ(e),this.applyMatrix4(Ti),this}translate(e,t,r){return Ti.makeTranslation(e,t,r),this.applyMatrix4(Ti),this}scale(e,t,r){return Ti.makeScale(e,t,r),this.applyMatrix4(Ti),this}lookAt(e){return Wf.lookAt(e),Wf.updateMatrix(),this.applyMatrix4(Wf.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ta).negate(),this.translate(Ta.x,Ta.y,Ta.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const r=[];for(let o=0,l=e.length;o<l;o++){const c=e[o];r.push(c.x,c.y,c.z||0)}this.setAttribute("position",new qt(r,3))}else{const r=Math.min(e.length,t.count);for(let o=0;o<r;o++){const l=e[o];t.setXYZ(o,l.x,l.y,l.z||0)}e.length>t.count&&ct("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ga);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Rt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new Z(-1/0,-1/0,-1/0),new Z(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const l=t[r];pi.setFromBufferAttribute(l),this.morphTargetsRelative?(wn.addVectors(this.boundingBox.min,pi.min),this.boundingBox.expandByPoint(wn),wn.addVectors(this.boundingBox.max,pi.max),this.boundingBox.expandByPoint(wn)):(this.boundingBox.expandByPoint(pi.min),this.boundingBox.expandByPoint(pi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Rt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Qo);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Rt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new Z,1/0);return}if(e){const r=this.boundingSphere.center;if(pi.setFromBufferAttribute(e),t)for(let l=0,c=t.length;l<c;l++){const f=t[l];Ao.setFromBufferAttribute(f),this.morphTargetsRelative?(wn.addVectors(pi.min,Ao.min),pi.expandByPoint(wn),wn.addVectors(pi.max,Ao.max),pi.expandByPoint(wn)):(pi.expandByPoint(Ao.min),pi.expandByPoint(Ao.max))}pi.getCenter(r);let o=0;for(let l=0,c=e.count;l<c;l++)wn.fromBufferAttribute(e,l),o=Math.max(o,r.distanceToSquared(wn));if(t)for(let l=0,c=t.length;l<c;l++){const f=t[l],p=this.morphTargetsRelative;for(let m=0,_=f.count;m<_;m++)wn.fromBufferAttribute(f,m),p&&(Ta.fromBufferAttribute(e,m),wn.add(Ta)),o=Math.max(o,r.distanceToSquared(wn))}this.boundingSphere.radius=Math.sqrt(o),isNaN(this.boundingSphere.radius)&&Rt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Rt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const r=t.position,o=t.normal,l=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ri(new Float32Array(4*r.count),4));const c=this.getAttribute("tangent"),f=[],p=[];for(let w=0;w<r.count;w++)f[w]=new Z,p[w]=new Z;const m=new Z,_=new Z,y=new Z,g=new vt,S=new vt,E=new vt,A=new Z,x=new Z;function v(w,I,X){m.fromBufferAttribute(r,w),_.fromBufferAttribute(r,I),y.fromBufferAttribute(r,X),g.fromBufferAttribute(l,w),S.fromBufferAttribute(l,I),E.fromBufferAttribute(l,X),_.sub(m),y.sub(m),S.sub(g),E.sub(g);const k=1/(S.x*E.y-E.x*S.y);isFinite(k)&&(A.copy(_).multiplyScalar(E.y).addScaledVector(y,-S.y).multiplyScalar(k),x.copy(y).multiplyScalar(S.x).addScaledVector(_,-E.x).multiplyScalar(k),f[w].add(A),f[I].add(A),f[X].add(A),p[w].add(x),p[I].add(x),p[X].add(x))}let C=this.groups;C.length===0&&(C=[{start:0,count:e.count}]);for(let w=0,I=C.length;w<I;++w){const X=C[w],k=X.start,K=X.count;for(let le=k,ue=k+K;le<ue;le+=3)v(e.getX(le+0),e.getX(le+1),e.getX(le+2))}const U=new Z,R=new Z,G=new Z,D=new Z;function V(w){G.fromBufferAttribute(o,w),D.copy(G);const I=f[w];U.copy(I),U.sub(G.multiplyScalar(G.dot(I))).normalize(),R.crossVectors(D,I);const k=R.dot(p[w])<0?-1:1;c.setXYZW(w,U.x,U.y,U.z,k)}for(let w=0,I=C.length;w<I;++w){const X=C[w],k=X.start,K=X.count;for(let le=k,ue=k+K;le<ue;le+=3)V(e.getX(le+0)),V(e.getX(le+1)),V(e.getX(le+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let r=this.getAttribute("normal");if(r===void 0)r=new Ri(new Float32Array(t.count*3),3),this.setAttribute("normal",r);else for(let g=0,S=r.count;g<S;g++)r.setXYZ(g,0,0,0);const o=new Z,l=new Z,c=new Z,f=new Z,p=new Z,m=new Z,_=new Z,y=new Z;if(e)for(let g=0,S=e.count;g<S;g+=3){const E=e.getX(g+0),A=e.getX(g+1),x=e.getX(g+2);o.fromBufferAttribute(t,E),l.fromBufferAttribute(t,A),c.fromBufferAttribute(t,x),_.subVectors(c,l),y.subVectors(o,l),_.cross(y),f.fromBufferAttribute(r,E),p.fromBufferAttribute(r,A),m.fromBufferAttribute(r,x),f.add(_),p.add(_),m.add(_),r.setXYZ(E,f.x,f.y,f.z),r.setXYZ(A,p.x,p.y,p.z),r.setXYZ(x,m.x,m.y,m.z)}else for(let g=0,S=t.count;g<S;g+=3)o.fromBufferAttribute(t,g+0),l.fromBufferAttribute(t,g+1),c.fromBufferAttribute(t,g+2),_.subVectors(c,l),y.subVectors(o,l),_.cross(y),r.setXYZ(g+0,_.x,_.y,_.z),r.setXYZ(g+1,_.x,_.y,_.z),r.setXYZ(g+2,_.x,_.y,_.z);this.normalizeNormals(),r.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,r=e.count;t<r;t++)wn.fromBufferAttribute(e,t),wn.normalize(),e.setXYZ(t,wn.x,wn.y,wn.z)}toNonIndexed(){function e(f,p){const m=f.array,_=f.itemSize,y=f.normalized,g=new m.constructor(p.length*_);let S=0,E=0;for(let A=0,x=p.length;A<x;A++){f.isInterleavedBufferAttribute?S=p[A]*f.data.stride+f.offset:S=p[A]*_;for(let v=0;v<_;v++)g[E++]=m[S++]}return new Ri(g,_,y)}if(this.index===null)return ct("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new cn,r=this.index.array,o=this.attributes;for(const f in o){const p=o[f],m=e(p,r);t.setAttribute(f,m)}const l=this.morphAttributes;for(const f in l){const p=[],m=l[f];for(let _=0,y=m.length;_<y;_++){const g=m[_],S=e(g,r);p.push(S)}t.morphAttributes[f]=p}t.morphTargetsRelative=this.morphTargetsRelative;const c=this.groups;for(let f=0,p=c.length;f<p;f++){const m=c[f];t.addGroup(m.start,m.count,m.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const p=this.parameters;for(const m in p)p[m]!==void 0&&(e[m]=p[m]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const r=this.attributes;for(const p in r){const m=r[p];e.data.attributes[p]=m.toJSON(e.data)}const o={};let l=!1;for(const p in this.morphAttributes){const m=this.morphAttributes[p],_=[];for(let y=0,g=m.length;y<g;y++){const S=m[y];_.push(S.toJSON(e.data))}_.length>0&&(o[p]=_,l=!0)}l&&(e.data.morphAttributes=o,e.data.morphTargetsRelative=this.morphTargetsRelative);const c=this.groups;c.length>0&&(e.data.groups=JSON.parse(JSON.stringify(c)));const f=this.boundingSphere;return f!==null&&(e.data.boundingSphere=f.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const r=e.index;r!==null&&this.setIndex(r.clone());const o=e.attributes;for(const m in o){const _=o[m];this.setAttribute(m,_.clone(t))}const l=e.morphAttributes;for(const m in l){const _=[],y=l[m];for(let g=0,S=y.length;g<S;g++)_.push(y[g].clone(t));this.morphAttributes[m]=_}this.morphTargetsRelative=e.morphTargetsRelative;const c=e.groups;for(let m=0,_=c.length;m<_;m++){const y=c[m];this.addGroup(y.start,y.count,y.materialIndex)}const f=e.boundingBox;f!==null&&(this.boundingBox=f.clone());const p=e.boundingSphere;return p!==null&&(this.boundingSphere=p.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}class m_{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Mc,this.updateRanges=[],this.version=0,this.uuid=cs()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,r){e*=this.stride,r*=t.stride;for(let o=0,l=this.stride;o<l;o++)this.array[e+o]=t.array[r+o];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=cs()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),r=new this.constructor(t,this.stride);return r.setUsage(this.usage),r}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=cs()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Yn=new Z;class qo{constructor(e,t,r,o=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=r,this.normalized=o}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,r=this.data.count;t<r;t++)Yn.fromBufferAttribute(this,t),Yn.applyMatrix4(e),this.setXYZ(t,Yn.x,Yn.y,Yn.z);return this}applyNormalMatrix(e){for(let t=0,r=this.count;t<r;t++)Yn.fromBufferAttribute(this,t),Yn.applyNormalMatrix(e),this.setXYZ(t,Yn.x,Yn.y,Yn.z);return this}transformDirection(e){for(let t=0,r=this.count;t<r;t++)Yn.fromBufferAttribute(this,t),Yn.transformDirection(e),this.setXYZ(t,Yn.x,Yn.y,Yn.z);return this}getComponent(e,t){let r=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(r=ar(r,this.array)),r}setComponent(e,t,r){return this.normalized&&(r=Ht(r,this.array)),this.data.array[e*this.data.stride+this.offset+t]=r,this}setX(e,t){return this.normalized&&(t=Ht(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=ar(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=ar(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=ar(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=ar(t,this.array)),t}setXY(e,t,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ht(t,this.array),r=Ht(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=r,this}setXYZ(e,t,r,o){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ht(t,this.array),r=Ht(r,this.array),o=Ht(o,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=r,this.data.array[e+2]=o,this}setXYZW(e,t,r,o,l){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ht(t,this.array),r=Ht(r,this.array),o=Ht(o,this.array),l=Ht(l,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=r,this.data.array[e+2]=o,this.data.array[e+3]=l,this}clone(e){if(e===void 0){Yo("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let r=0;r<this.count;r++){const o=r*this.data.stride+this.offset;for(let l=0;l<this.itemSize;l++)t.push(this.data.array[o+l])}return new Ri(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new qo(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Yo("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let r=0;r<this.count;r++){const o=r*this.data.stride+this.offset;for(let l=0;l<this.itemSize;l++)t.push(this.data.array[o+l])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let Jx=0;class ps extends hs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Jx++}),this.uuid=cs(),this.name="",this.type="Material",this.blending=ks,this.side=Pr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Iu,this.blendDst=Uu,this.blendEquation=ss,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new St(0,0,0),this.blendAlpha=0,this.depthFunc=Bs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=fh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Os,this.stencilZFail=Os,this.stencilZPass=Os,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const r=e[t];if(r===void 0){ct(`Material: parameter '${t}' has value of undefined.`);continue}const o=this[t];if(o===void 0){ct(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}o&&o.isColor?o.set(r):o&&o.isVector3&&r&&r.isVector3?o.copy(r):this[t]=r}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const r={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.color&&this.color.isColor&&(r.color=this.color.getHex()),this.roughness!==void 0&&(r.roughness=this.roughness),this.metalness!==void 0&&(r.metalness=this.metalness),this.sheen!==void 0&&(r.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(r.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(r.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(r.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(r.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(r.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(r.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(r.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(r.shininess=this.shininess),this.clearcoat!==void 0&&(r.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(r.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(r.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(r.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(r.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,r.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(r.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(r.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(r.dispersion=this.dispersion),this.iridescence!==void 0&&(r.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(r.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(r.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(r.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(r.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(r.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(r.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(r.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(r.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(r.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(r.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(r.lightMap=this.lightMap.toJSON(e).uuid,r.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(r.aoMap=this.aoMap.toJSON(e).uuid,r.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(r.bumpMap=this.bumpMap.toJSON(e).uuid,r.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(r.normalMap=this.normalMap.toJSON(e).uuid,r.normalMapType=this.normalMapType,r.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(r.displacementMap=this.displacementMap.toJSON(e).uuid,r.displacementScale=this.displacementScale,r.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(r.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(r.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(r.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(r.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(r.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(r.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(r.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(r.combine=this.combine)),this.envMapRotation!==void 0&&(r.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(r.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(r.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(r.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(r.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(r.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(r.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(r.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(r.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(r.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(r.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(r.size=this.size),this.shadowSide!==null&&(r.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(r.sizeAttenuation=this.sizeAttenuation),this.blending!==ks&&(r.blending=this.blending),this.side!==Pr&&(r.side=this.side),this.vertexColors===!0&&(r.vertexColors=!0),this.opacity<1&&(r.opacity=this.opacity),this.transparent===!0&&(r.transparent=!0),this.blendSrc!==Iu&&(r.blendSrc=this.blendSrc),this.blendDst!==Uu&&(r.blendDst=this.blendDst),this.blendEquation!==ss&&(r.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(r.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(r.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(r.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(r.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(r.blendAlpha=this.blendAlpha),this.depthFunc!==Bs&&(r.depthFunc=this.depthFunc),this.depthTest===!1&&(r.depthTest=this.depthTest),this.depthWrite===!1&&(r.depthWrite=this.depthWrite),this.colorWrite===!1&&(r.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(r.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==fh&&(r.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(r.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(r.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Os&&(r.stencilFail=this.stencilFail),this.stencilZFail!==Os&&(r.stencilZFail=this.stencilZFail),this.stencilZPass!==Os&&(r.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(r.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(r.rotation=this.rotation),this.polygonOffset===!0&&(r.polygonOffset=!0),this.polygonOffsetFactor!==0&&(r.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(r.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(r.linewidth=this.linewidth),this.dashSize!==void 0&&(r.dashSize=this.dashSize),this.gapSize!==void 0&&(r.gapSize=this.gapSize),this.scale!==void 0&&(r.scale=this.scale),this.dithering===!0&&(r.dithering=!0),this.alphaTest>0&&(r.alphaTest=this.alphaTest),this.alphaHash===!0&&(r.alphaHash=!0),this.alphaToCoverage===!0&&(r.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(r.premultipliedAlpha=!0),this.forceSinglePass===!0&&(r.forceSinglePass=!0),this.allowOverride===!1&&(r.allowOverride=!1),this.wireframe===!0&&(r.wireframe=!0),this.wireframeLinewidth>1&&(r.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(r.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(r.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(r.flatShading=!0),this.visible===!1&&(r.visible=!1),this.toneMapped===!1&&(r.toneMapped=!1),this.fog===!1&&(r.fog=!1),Object.keys(this.userData).length>0&&(r.userData=this.userData);function o(l){const c=[];for(const f in l){const p=l[f];delete p.metadata,c.push(p)}return c}if(t){const l=o(e.textures),c=o(e.images);l.length>0&&(r.textures=l),c.length>0&&(r.images=c)}return r}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let r=null;if(t!==null){const o=t.length;r=new Array(o);for(let l=0;l!==o;++l)r[l]=t[l].clone()}return this.clippingPlanes=r,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class g_ extends ps{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new St(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let wa;const Ro=new Z,ba=new Z,Aa=new Z,Ra=new vt,Co=new vt,__=new Jt,ou=new Z,Po=new Z,lu=new Z,kg=new vt,jf=new vt,Bg=new vt;class Qx extends un{constructor(e=new g_){if(super(),this.isSprite=!0,this.type="Sprite",wa===void 0){wa=new cn;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),r=new m_(t,5);wa.setIndex([0,1,2,0,2,3]),wa.setAttribute("position",new qo(r,3,0,!1)),wa.setAttribute("uv",new qo(r,2,3,!1))}this.geometry=wa,this.material=e,this.center=new vt(.5,.5),this.count=1}raycast(e,t){e.camera===null&&Rt('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ba.setFromMatrixScale(this.matrixWorld),__.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Aa.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ba.multiplyScalar(-Aa.z);const r=this.material.rotation;let o,l;r!==0&&(l=Math.cos(r),o=Math.sin(r));const c=this.center;uu(ou.set(-.5,-.5,0),Aa,c,ba,o,l),uu(Po.set(.5,-.5,0),Aa,c,ba,o,l),uu(lu.set(.5,.5,0),Aa,c,ba,o,l),kg.set(0,0),jf.set(1,0),Bg.set(1,1);let f=e.ray.intersectTriangle(ou,Po,lu,!1,Ro);if(f===null&&(uu(Po.set(-.5,.5,0),Aa,c,ba,o,l),jf.set(0,1),f=e.ray.intersectTriangle(ou,lu,Po,!1,Ro),f===null))return;const p=e.ray.origin.distanceTo(Ro);p<e.near||p>e.far||t.push({distance:p,point:Ro.clone(),uv:gi.getInterpolation(Ro,ou,Po,lu,kg,jf,Bg,new vt),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function uu(s,e,t,r,o,l){Ra.subVectors(s,t).addScalar(.5).multiply(r),o!==void 0?(Co.x=l*Ra.x-o*Ra.y,Co.y=o*Ra.x+l*Ra.y):Co.copy(Ra),s.copy(e),s.x+=Co.x,s.y+=Co.y,s.applyMatrix4(__)}const Tr=new Z,Xf=new Z,cu=new Z,ns=new Z,Yf=new Z,du=new Z,qf=new Z;class kc{constructor(e=new Z,t=new Z(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Tr)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const r=t.dot(this.direction);return r<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,r)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Tr.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Tr.copy(this.origin).addScaledVector(this.direction,t),Tr.distanceToSquared(e))}distanceSqToSegment(e,t,r,o){Xf.copy(e).add(t).multiplyScalar(.5),cu.copy(t).sub(e).normalize(),ns.copy(this.origin).sub(Xf);const l=e.distanceTo(t)*.5,c=-this.direction.dot(cu),f=ns.dot(this.direction),p=-ns.dot(cu),m=ns.lengthSq(),_=Math.abs(1-c*c);let y,g,S,E;if(_>0)if(y=c*p-f,g=c*f-p,E=l*_,y>=0)if(g>=-E)if(g<=E){const A=1/_;y*=A,g*=A,S=y*(y+c*g+2*f)+g*(c*y+g+2*p)+m}else g=l,y=Math.max(0,-(c*g+f)),S=-y*y+g*(g+2*p)+m;else g=-l,y=Math.max(0,-(c*g+f)),S=-y*y+g*(g+2*p)+m;else g<=-E?(y=Math.max(0,-(-c*l+f)),g=y>0?-l:Math.min(Math.max(-l,-p),l),S=-y*y+g*(g+2*p)+m):g<=E?(y=0,g=Math.min(Math.max(-l,-p),l),S=g*(g+2*p)+m):(y=Math.max(0,-(c*l+f)),g=y>0?l:Math.min(Math.max(-l,-p),l),S=-y*y+g*(g+2*p)+m);else g=c>0?-l:l,y=Math.max(0,-(c*g+f)),S=-y*y+g*(g+2*p)+m;return r&&r.copy(this.origin).addScaledVector(this.direction,y),o&&o.copy(Xf).addScaledVector(cu,g),S}intersectSphere(e,t){Tr.subVectors(e.center,this.origin);const r=Tr.dot(this.direction),o=Tr.dot(Tr)-r*r,l=e.radius*e.radius;if(o>l)return null;const c=Math.sqrt(l-o),f=r-c,p=r+c;return p<0?null:f<0?this.at(p,t):this.at(f,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const r=-(this.origin.dot(e.normal)+e.constant)/t;return r>=0?r:null}intersectPlane(e,t){const r=this.distanceToPlane(e);return r===null?null:this.at(r,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let r,o,l,c,f,p;const m=1/this.direction.x,_=1/this.direction.y,y=1/this.direction.z,g=this.origin;return m>=0?(r=(e.min.x-g.x)*m,o=(e.max.x-g.x)*m):(r=(e.max.x-g.x)*m,o=(e.min.x-g.x)*m),_>=0?(l=(e.min.y-g.y)*_,c=(e.max.y-g.y)*_):(l=(e.max.y-g.y)*_,c=(e.min.y-g.y)*_),r>c||l>o||((l>r||isNaN(r))&&(r=l),(c<o||isNaN(o))&&(o=c),y>=0?(f=(e.min.z-g.z)*y,p=(e.max.z-g.z)*y):(f=(e.max.z-g.z)*y,p=(e.min.z-g.z)*y),r>p||f>o)||((f>r||r!==r)&&(r=f),(p<o||o!==o)&&(o=p),o<0)?null:this.at(r>=0?r:o,t)}intersectsBox(e){return this.intersectBox(e,Tr)!==null}intersectTriangle(e,t,r,o,l){Yf.subVectors(t,e),du.subVectors(r,e),qf.crossVectors(Yf,du);let c=this.direction.dot(qf),f;if(c>0){if(o)return null;f=1}else if(c<0)f=-1,c=-c;else return null;ns.subVectors(this.origin,e);const p=f*this.direction.dot(du.crossVectors(ns,du));if(p<0)return null;const m=f*this.direction.dot(Yf.cross(ns));if(m<0||p+m>c)return null;const _=-f*ns.dot(qf);return _<0?null:this.at(_/c,l)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class bi extends ps{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new St(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Nr,this.combine=Eh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Vg=new Jt,Ns=new kc,fu=new Qo,Gg=new Z,hu=new Z,pu=new Z,mu=new Z,$f=new Z,gu=new Z,Hg=new Z,_u=new Z;class ln extends un{constructor(e=new cn,t=new bi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,r=Object.keys(t);if(r.length>0){const o=t[r[0]];if(o!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,c=o.length;l<c;l++){const f=o[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[f]=l}}}}getVertexPosition(e,t){const r=this.geometry,o=r.attributes.position,l=r.morphAttributes.position,c=r.morphTargetsRelative;t.fromBufferAttribute(o,e);const f=this.morphTargetInfluences;if(l&&f){gu.set(0,0,0);for(let p=0,m=l.length;p<m;p++){const _=f[p],y=l[p];_!==0&&($f.fromBufferAttribute(y,e),c?gu.addScaledVector($f,_):gu.addScaledVector($f.sub(t),_))}t.add(gu)}return t}raycast(e,t){const r=this.geometry,o=this.material,l=this.matrixWorld;o!==void 0&&(r.boundingSphere===null&&r.computeBoundingSphere(),fu.copy(r.boundingSphere),fu.applyMatrix4(l),Ns.copy(e.ray).recast(e.near),!(fu.containsPoint(Ns.origin)===!1&&(Ns.intersectSphere(fu,Gg)===null||Ns.origin.distanceToSquared(Gg)>(e.far-e.near)**2))&&(Vg.copy(l).invert(),Ns.copy(e.ray).applyMatrix4(Vg),!(r.boundingBox!==null&&Ns.intersectsBox(r.boundingBox)===!1)&&this._computeIntersections(e,t,Ns)))}_computeIntersections(e,t,r){let o;const l=this.geometry,c=this.material,f=l.index,p=l.attributes.position,m=l.attributes.uv,_=l.attributes.uv1,y=l.attributes.normal,g=l.groups,S=l.drawRange;if(f!==null)if(Array.isArray(c))for(let E=0,A=g.length;E<A;E++){const x=g[E],v=c[x.materialIndex],C=Math.max(x.start,S.start),U=Math.min(f.count,Math.min(x.start+x.count,S.start+S.count));for(let R=C,G=U;R<G;R+=3){const D=f.getX(R),V=f.getX(R+1),w=f.getX(R+2);o=vu(this,v,e,r,m,_,y,D,V,w),o&&(o.faceIndex=Math.floor(R/3),o.face.materialIndex=x.materialIndex,t.push(o))}}else{const E=Math.max(0,S.start),A=Math.min(f.count,S.start+S.count);for(let x=E,v=A;x<v;x+=3){const C=f.getX(x),U=f.getX(x+1),R=f.getX(x+2);o=vu(this,c,e,r,m,_,y,C,U,R),o&&(o.faceIndex=Math.floor(x/3),t.push(o))}}else if(p!==void 0)if(Array.isArray(c))for(let E=0,A=g.length;E<A;E++){const x=g[E],v=c[x.materialIndex],C=Math.max(x.start,S.start),U=Math.min(p.count,Math.min(x.start+x.count,S.start+S.count));for(let R=C,G=U;R<G;R+=3){const D=R,V=R+1,w=R+2;o=vu(this,v,e,r,m,_,y,D,V,w),o&&(o.faceIndex=Math.floor(R/3),o.face.materialIndex=x.materialIndex,t.push(o))}}else{const E=Math.max(0,S.start),A=Math.min(p.count,S.start+S.count);for(let x=E,v=A;x<v;x+=3){const C=x,U=x+1,R=x+2;o=vu(this,c,e,r,m,_,y,C,U,R),o&&(o.faceIndex=Math.floor(x/3),t.push(o))}}}}function ey(s,e,t,r,o,l,c,f){let p;if(e.side===Zn?p=r.intersectTriangle(c,l,o,!0,f):p=r.intersectTriangle(o,l,c,e.side===Pr,f),p===null)return null;_u.copy(f),_u.applyMatrix4(s.matrixWorld);const m=t.ray.origin.distanceTo(_u);return m<t.near||m>t.far?null:{distance:m,point:_u.clone(),object:s}}function vu(s,e,t,r,o,l,c,f,p,m){s.getVertexPosition(f,hu),s.getVertexPosition(p,pu),s.getVertexPosition(m,mu);const _=ey(s,e,t,r,hu,pu,mu,Hg);if(_){const y=new Z;gi.getBarycoord(Hg,hu,pu,mu,y),o&&(_.uv=gi.getInterpolatedAttribute(o,f,p,m,y,new vt)),l&&(_.uv1=gi.getInterpolatedAttribute(l,f,p,m,y,new vt)),c&&(_.normal=gi.getInterpolatedAttribute(c,f,p,m,y,new Z),_.normal.dot(r.direction)>0&&_.normal.multiplyScalar(-1));const g={a:f,b:p,c:m,normal:new Z,materialIndex:0};gi.getNormal(hu,pu,mu,g.normal),_.face=g,_.barycoord=y}return _}class v_ extends An{constructor(e=null,t=1,r=1,o,l,c,f,p,m=bn,_=bn,y,g){super(null,c,f,p,m,_,o,l,y,g),this.isDataTexture=!0,this.image={data:e,width:t,height:r},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Kf=new Z,ty=new Z,ny=new gt;class wr{constructor(e=new Z(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,r,o){return this.normal.set(e,t,r),this.constant=o,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,r){const o=Kf.subVectors(r,t).cross(ty.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(o,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,r=!0){const o=e.delta(Kf),l=this.normal.dot(o);if(l===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const c=-(e.start.dot(this.normal)+this.constant)/l;return r===!0&&(c<0||c>1)?null:t.copy(e.start).addScaledVector(o,c)}intersectsLine(e){const t=this.distanceToPoint(e.start),r=this.distanceToPoint(e.end);return t<0&&r>0||r<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const r=t||ny.getNormalMatrix(e),o=this.coplanarPoint(Kf).applyMatrix4(e),l=this.normal.applyMatrix3(r).normalize();return this.constant=-o.dot(l),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ls=new Qo,iy=new vt(.5,.5),xu=new Z;class Bc{constructor(e=new wr,t=new wr,r=new wr,o=new wr,l=new wr,c=new wr){this.planes=[e,t,r,o,l,c]}set(e,t,r,o,l,c){const f=this.planes;return f[0].copy(e),f[1].copy(t),f[2].copy(r),f[3].copy(o),f[4].copy(l),f[5].copy(c),this}copy(e){const t=this.planes;for(let r=0;r<6;r++)t[r].copy(e.planes[r]);return this}setFromProjectionMatrix(e,t=Wi,r=!1){const o=this.planes,l=e.elements,c=l[0],f=l[1],p=l[2],m=l[3],_=l[4],y=l[5],g=l[6],S=l[7],E=l[8],A=l[9],x=l[10],v=l[11],C=l[12],U=l[13],R=l[14],G=l[15];if(o[0].setComponents(m-c,S-_,v-E,G-C).normalize(),o[1].setComponents(m+c,S+_,v+E,G+C).normalize(),o[2].setComponents(m+f,S+y,v+A,G+U).normalize(),o[3].setComponents(m-f,S-y,v-A,G-U).normalize(),r)o[4].setComponents(p,g,x,R).normalize(),o[5].setComponents(m-p,S-g,v-x,G-R).normalize();else if(o[4].setComponents(m-p,S-g,v-x,G-R).normalize(),t===Wi)o[5].setComponents(m+p,S+g,v+x,G+R).normalize();else if(t===Ba)o[5].setComponents(p,g,x,R).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ls.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ls.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ls)}intersectsSprite(e){Ls.center.set(0,0,0);const t=iy.distanceTo(e.center);return Ls.radius=.7071067811865476+t,Ls.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ls)}intersectsSphere(e){const t=this.planes,r=e.center,o=-e.radius;for(let l=0;l<6;l++)if(t[l].distanceToPoint(r)<o)return!1;return!0}intersectsBox(e){const t=this.planes;for(let r=0;r<6;r++){const o=t[r];if(xu.x=o.normal.x>0?e.max.x:e.min.x,xu.y=o.normal.y>0?e.max.y:e.min.y,xu.z=o.normal.z>0?e.max.z:e.min.z,o.distanceToPoint(xu)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let r=0;r<6;r++)if(t[r].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Gs extends ps{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new St(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Tc=new Z,wc=new Z,Wg=new Jt,No=new kc,yu=new Qo,Zf=new Z,jg=new Z;class $o extends un{constructor(e=new cn,t=new Gs){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,r=[0];for(let o=1,l=t.count;o<l;o++)Tc.fromBufferAttribute(t,o-1),wc.fromBufferAttribute(t,o),r[o]=r[o-1],r[o]+=Tc.distanceTo(wc);e.setAttribute("lineDistance",new qt(r,1))}else ct("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const r=this.geometry,o=this.matrixWorld,l=e.params.Line.threshold,c=r.drawRange;if(r.boundingSphere===null&&r.computeBoundingSphere(),yu.copy(r.boundingSphere),yu.applyMatrix4(o),yu.radius+=l,e.ray.intersectsSphere(yu)===!1)return;Wg.copy(o).invert(),No.copy(e.ray).applyMatrix4(Wg);const f=l/((this.scale.x+this.scale.y+this.scale.z)/3),p=f*f,m=this.isLineSegments?2:1,_=r.index,g=r.attributes.position;if(_!==null){const S=Math.max(0,c.start),E=Math.min(_.count,c.start+c.count);for(let A=S,x=E-1;A<x;A+=m){const v=_.getX(A),C=_.getX(A+1),U=Su(this,e,No,p,v,C,A);U&&t.push(U)}if(this.isLineLoop){const A=_.getX(E-1),x=_.getX(S),v=Su(this,e,No,p,A,x,E-1);v&&t.push(v)}}else{const S=Math.max(0,c.start),E=Math.min(g.count,c.start+c.count);for(let A=S,x=E-1;A<x;A+=m){const v=Su(this,e,No,p,A,A+1,A);v&&t.push(v)}if(this.isLineLoop){const A=Su(this,e,No,p,E-1,S,E-1);A&&t.push(A)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,r=Object.keys(t);if(r.length>0){const o=t[r[0]];if(o!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,c=o.length;l<c;l++){const f=o[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[f]=l}}}}}function Su(s,e,t,r,o,l,c){const f=s.geometry.attributes.position;if(Tc.fromBufferAttribute(f,o),wc.fromBufferAttribute(f,l),t.distanceSqToSegment(Tc,wc,Zf,jg)>r)return;Zf.applyMatrix4(s.matrixWorld);const m=e.ray.origin.distanceTo(Zf);if(!(m<e.near||m>e.far))return{distance:m,point:jg.clone().applyMatrix4(s.matrixWorld),index:c,face:null,faceIndex:null,barycoord:null,object:s}}const Xg=new Z,Yg=new Z;class Gh extends $o{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,r=[];for(let o=0,l=t.count;o<l;o+=2)Xg.fromBufferAttribute(t,o),Yg.fromBufferAttribute(t,o+1),r[o]=o===0?0:r[o-1],r[o+1]=r[o]+Xg.distanceTo(Yg);e.setAttribute("lineDistance",new qt(r,1))}else ct("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Hh extends An{constructor(e=[],t=ds,r,o,l,c,f,p,m,_){super(e,t,r,o,l,c,f,p,m,_),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class ry extends An{constructor(e,t,r,o,l,c,f,p,m){super(e,t,r,o,l,c,f,p,m),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Hs extends An{constructor(e,t,r=Yi,o,l,c,f=bn,p=bn,m,_=cr,y=1){if(_!==cr&&_!==os)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const g={width:e,height:t,depth:y};super(g,o,l,c,f,p,_,r,m),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Fc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class x_ extends Hs{constructor(e,t=Yi,r=ds,o,l,c=bn,f=bn,p,m=cr){const _={width:e,height:e,depth:1},y=[_,_,_,_,_,_];super(e,e,t,r,o,l,c,f,p,m),this.image=y,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Wh extends An{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Ha extends cn{constructor(e=1,t=1,r=1,o=1,l=1,c=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:r,widthSegments:o,heightSegments:l,depthSegments:c};const f=this;o=Math.floor(o),l=Math.floor(l),c=Math.floor(c);const p=[],m=[],_=[],y=[];let g=0,S=0;E("z","y","x",-1,-1,r,t,e,c,l,0),E("z","y","x",1,-1,r,t,-e,c,l,1),E("x","z","y",1,1,e,r,t,o,c,2),E("x","z","y",1,-1,e,r,-t,o,c,3),E("x","y","z",1,-1,e,t,r,o,l,4),E("x","y","z",-1,-1,e,t,-r,o,l,5),this.setIndex(p),this.setAttribute("position",new qt(m,3)),this.setAttribute("normal",new qt(_,3)),this.setAttribute("uv",new qt(y,2));function E(A,x,v,C,U,R,G,D,V,w,I){const X=R/V,k=G/w,K=R/2,le=G/2,ue=D/2,W=V+1,$=w+1;let Y=0,Q=0;const pe=new Z;for(let me=0;me<$;me++){const z=me*k-le;for(let ne=0;ne<W;ne++){const Le=ne*X-K;pe[A]=Le*C,pe[x]=z*U,pe[v]=ue,m.push(pe.x,pe.y,pe.z),pe[A]=0,pe[x]=0,pe[v]=D>0?1:-1,_.push(pe.x,pe.y,pe.z),y.push(ne/V),y.push(1-me/w),Y+=1}}for(let me=0;me<w;me++)for(let z=0;z<V;z++){const ne=g+z+W*me,Le=g+z+W*(me+1),We=g+(z+1)+W*(me+1),ze=g+(z+1)+W*me;p.push(ne,Le,ze),p.push(Le,We,ze),Q+=6}f.addGroup(S,Q,I),S+=Q,g+=Y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ha(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Ar extends cn{constructor(e=1,t=1,r=1,o=32,l=1,c=!1,f=0,p=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:r,radialSegments:o,heightSegments:l,openEnded:c,thetaStart:f,thetaLength:p};const m=this;o=Math.floor(o),l=Math.floor(l);const _=[],y=[],g=[],S=[];let E=0;const A=[],x=r/2;let v=0;C(),c===!1&&(e>0&&U(!0),t>0&&U(!1)),this.setIndex(_),this.setAttribute("position",new qt(y,3)),this.setAttribute("normal",new qt(g,3)),this.setAttribute("uv",new qt(S,2));function C(){const R=new Z,G=new Z;let D=0;const V=(t-e)/r;for(let w=0;w<=l;w++){const I=[],X=w/l,k=X*(t-e)+e;for(let K=0;K<=o;K++){const le=K/o,ue=le*p+f,W=Math.sin(ue),$=Math.cos(ue);G.x=k*W,G.y=-X*r+x,G.z=k*$,y.push(G.x,G.y,G.z),R.set(W,V,$).normalize(),g.push(R.x,R.y,R.z),S.push(le,1-X),I.push(E++)}A.push(I)}for(let w=0;w<o;w++)for(let I=0;I<l;I++){const X=A[I][w],k=A[I+1][w],K=A[I+1][w+1],le=A[I][w+1];(e>0||I!==0)&&(_.push(X,k,le),D+=3),(t>0||I!==l-1)&&(_.push(k,K,le),D+=3)}m.addGroup(v,D,0),v+=D}function U(R){const G=E,D=new vt,V=new Z;let w=0;const I=R===!0?e:t,X=R===!0?1:-1;for(let K=1;K<=o;K++)y.push(0,x*X,0),g.push(0,X,0),S.push(.5,.5),E++;const k=E;for(let K=0;K<=o;K++){const ue=K/o*p+f,W=Math.cos(ue),$=Math.sin(ue);V.x=I*$,V.y=x*X,V.z=I*W,y.push(V.x,V.y,V.z),g.push(0,X,0),D.x=W*.5+.5,D.y=$*.5*X+.5,S.push(D.x,D.y),E++}for(let K=0;K<o;K++){const le=G+K,ue=k+K;R===!0?_.push(ue,ue+1,le):_.push(ue+1,ue,le),w+=3}m.addGroup(v,w,R===!0?1:2),v+=w}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ar(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Vc extends Ar{constructor(e=1,t=1,r=32,o=1,l=!1,c=0,f=Math.PI*2){super(0,e,t,r,o,l,c,f),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:r,heightSegments:o,openEnded:l,thetaStart:c,thetaLength:f}}static fromJSON(e){return new Vc(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Ws extends cn{constructor(e=1,t=1,r=1,o=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:r,heightSegments:o};const l=e/2,c=t/2,f=Math.floor(r),p=Math.floor(o),m=f+1,_=p+1,y=e/f,g=t/p,S=[],E=[],A=[],x=[];for(let v=0;v<_;v++){const C=v*g-c;for(let U=0;U<m;U++){const R=U*y-l;E.push(R,-C,0),A.push(0,0,1),x.push(U/f),x.push(1-v/p)}}for(let v=0;v<p;v++)for(let C=0;C<f;C++){const U=C+m*v,R=C+m*(v+1),G=C+1+m*(v+1),D=C+1+m*v;S.push(U,R,D),S.push(R,G,D)}this.setIndex(S),this.setAttribute("position",new qt(E,3)),this.setAttribute("normal",new qt(A,3)),this.setAttribute("uv",new qt(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ws(e.width,e.height,e.widthSegments,e.heightSegments)}}class Gc extends cn{constructor(e=1,t=32,r=16,o=0,l=Math.PI*2,c=0,f=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:r,phiStart:o,phiLength:l,thetaStart:c,thetaLength:f},t=Math.max(3,Math.floor(t)),r=Math.max(2,Math.floor(r));const p=Math.min(c+f,Math.PI);let m=0;const _=[],y=new Z,g=new Z,S=[],E=[],A=[],x=[];for(let v=0;v<=r;v++){const C=[],U=v/r;let R=0;v===0&&c===0?R=.5/t:v===r&&p===Math.PI&&(R=-.5/t);for(let G=0;G<=t;G++){const D=G/t;y.x=-e*Math.cos(o+D*l)*Math.sin(c+U*f),y.y=e*Math.cos(c+U*f),y.z=e*Math.sin(o+D*l)*Math.sin(c+U*f),E.push(y.x,y.y,y.z),g.copy(y).normalize(),A.push(g.x,g.y,g.z),x.push(D+R,1-U),C.push(m++)}_.push(C)}for(let v=0;v<r;v++)for(let C=0;C<t;C++){const U=_[v][C+1],R=_[v][C],G=_[v+1][C],D=_[v+1][C+1];(v!==0||c>0)&&S.push(U,R,D),(v!==r-1||p<Math.PI)&&S.push(R,G,D)}this.setIndex(S),this.setAttribute("position",new qt(E,3)),this.setAttribute("normal",new qt(A,3)),this.setAttribute("uv",new qt(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Gc(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Ko extends cn{constructor(e=1,t=.4,r=12,o=48,l=Math.PI*2,c=0,f=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:r,tubularSegments:o,arc:l,thetaStart:c,thetaLength:f},r=Math.floor(r),o=Math.floor(o);const p=[],m=[],_=[],y=[],g=new Z,S=new Z,E=new Z;for(let A=0;A<=r;A++){const x=c+A/r*f;for(let v=0;v<=o;v++){const C=v/o*l;S.x=(e+t*Math.cos(x))*Math.cos(C),S.y=(e+t*Math.cos(x))*Math.sin(C),S.z=t*Math.sin(x),m.push(S.x,S.y,S.z),g.x=e*Math.cos(C),g.y=e*Math.sin(C),E.subVectors(S,g).normalize(),_.push(E.x,E.y,E.z),y.push(v/o),y.push(A/r)}}for(let A=1;A<=r;A++)for(let x=1;x<=o;x++){const v=(o+1)*A+x-1,C=(o+1)*(A-1)+x-1,U=(o+1)*(A-1)+x,R=(o+1)*A+x;p.push(v,C,R),p.push(C,U,R)}this.setIndex(p),this.setAttribute("position",new qt(m,3)),this.setAttribute("normal",new qt(_,3)),this.setAttribute("uv",new qt(y,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ko(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}function Va(s){const e={};for(const t in s){e[t]={};for(const r in s[t]){const o=s[t][r];if(qg(o))o.isRenderTargetTexture?(ct("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][r]=null):e[t][r]=o.clone();else if(Array.isArray(o))if(qg(o[0])){const l=[];for(let c=0,f=o.length;c<f;c++)l[c]=o[c].clone();e[t][r]=l}else e[t][r]=o.slice();else e[t][r]=o}}return e}function qn(s){const e={};for(let t=0;t<s.length;t++){const r=Va(s[t]);for(const o in r)e[o]=r[o]}return e}function qg(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function sy(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function y_(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ct.workingColorSpace}const S_={clone:Va,merge:qn};var ay=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,oy=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class qi extends ps{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ay,this.fragmentShader=oy,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Va(e.uniforms),this.uniformsGroups=sy(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const o in this.uniforms){const c=this.uniforms[o].value;c&&c.isTexture?t.uniforms[o]={type:"t",value:c.toJSON(e).uuid}:c&&c.isColor?t.uniforms[o]={type:"c",value:c.getHex()}:c&&c.isVector2?t.uniforms[o]={type:"v2",value:c.toArray()}:c&&c.isVector3?t.uniforms[o]={type:"v3",value:c.toArray()}:c&&c.isVector4?t.uniforms[o]={type:"v4",value:c.toArray()}:c&&c.isMatrix3?t.uniforms[o]={type:"m3",value:c.toArray()}:c&&c.isMatrix4?t.uniforms[o]={type:"m4",value:c.toArray()}:t.uniforms[o]={value:c}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const r={};for(const o in this.extensions)this.extensions[o]===!0&&(r[o]=!0);return Object.keys(r).length>0&&(t.extensions=r),t}}class M_ extends qi{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class mh extends ps{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new St(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new St(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Sc,this.normalScale=new vt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Nr,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class E_ extends ps{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=e_,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class T_ extends ps{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Nu={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&($g(s)||(this.files[s]=e))},get:function(s){if(this.enabled!==!1&&!$g(s))return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};function $g(s){try{const e=s.slice(s.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class w_{constructor(e,t,r){const o=this;let l=!1,c=0,f=0,p;const m=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=r,this._abortController=null,this.itemStart=function(_){f++,l===!1&&o.onStart!==void 0&&o.onStart(_,c,f),l=!0},this.itemEnd=function(_){c++,o.onProgress!==void 0&&o.onProgress(_,c,f),c===f&&(l=!1,o.onLoad!==void 0&&o.onLoad())},this.itemError=function(_){o.onError!==void 0&&o.onError(_)},this.resolveURL=function(_){return p?p(_):_},this.setURLModifier=function(_){return p=_,this},this.addHandler=function(_,y){return m.push(_,y),this},this.removeHandler=function(_){const y=m.indexOf(_);return y!==-1&&m.splice(y,2),this},this.getHandler=function(_){for(let y=0,g=m.length;y<g;y+=2){const S=m[y],E=m[y+1];if(S.global&&(S.lastIndex=0),S.test(_))return E}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const b_=new w_;class Hc{constructor(e){this.manager=e!==void 0?e:b_,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const r=this;return new Promise(function(o,l){r.load(e,o,t,l)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}Hc.DEFAULT_MATERIAL_NAME="__DEFAULT";const Ca=new WeakMap;class A_ extends Hc{constructor(e){super(e)}load(e,t,r,o){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const l=this,c=Nu.get(`image:${e}`);if(c!==void 0){if(c.complete===!0)l.manager.itemStart(e),setTimeout(function(){t&&t(c),l.manager.itemEnd(e)},0);else{let y=Ca.get(c);y===void 0&&(y=[],Ca.set(c,y)),y.push({onLoad:t,onError:o})}return c}const f=Xo("img");function p(){_(),t&&t(this);const y=Ca.get(this)||[];for(let g=0;g<y.length;g++){const S=y[g];S.onLoad&&S.onLoad(this)}Ca.delete(this),l.manager.itemEnd(e)}function m(y){_(),o&&o(y),Nu.remove(`image:${e}`);const g=Ca.get(this)||[];for(let S=0;S<g.length;S++){const E=g[S];E.onError&&E.onError(y)}Ca.delete(this),l.manager.itemError(e),l.manager.itemEnd(e)}function _(){f.removeEventListener("load",p,!1),f.removeEventListener("error",m,!1)}return f.addEventListener("load",p,!1),f.addEventListener("error",m,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(f.crossOrigin=this.crossOrigin),Nu.add(`image:${e}`,f),l.manager.itemStart(e),f.src=e,f}}class R_ extends Hc{constructor(e){super(e)}load(e,t,r,o){const l=new An,c=new A_(this.manager);return c.setCrossOrigin(this.crossOrigin),c.setPath(this.path),c.load(e,function(f){l.image=f,l.needsUpdate=!0,t!==void 0&&t(l)},r,o),l}}class jh extends un{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new St(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class C_ extends jh{constructor(e,t,r){super(e,r),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(un.DEFAULT_UP),this.updateMatrix(),this.groundColor=new St(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const Jf=new Jt,Kg=new Z,Zg=new Z;class ly{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new vt(512,512),this.mapType=oi,this.map=null,this.mapPass=null,this.matrix=new Jt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Bc,this._frameExtents=new vt(1,1),this._viewportCount=1,this._viewports=[new rn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,r=this.matrix;Kg.setFromMatrixPosition(e.matrixWorld),t.position.copy(Kg),Zg.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Zg),t.updateMatrixWorld(),Jf.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Jf,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===Ba||t.reversedDepth?r.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):r.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),r.multiply(Jf)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Mu=new Z,Eu=new js,ir=new Z;class Xh extends un{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Jt,this.projectionMatrix=new Jt,this.projectionMatrixInverse=new Jt,this.coordinateSystem=Wi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Mu,Eu,ir),ir.x===1&&ir.y===1&&ir.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Mu,Eu,ir.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(Mu,Eu,ir),ir.x===1&&ir.y===1&&ir.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Mu,Eu,ir.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const is=new Z,Jg=new vt,Qg=new vt;class mi extends Xh{constructor(e=50,t=1,r=.1,o=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=r,this.far=o,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ph*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Af*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ph*2*Math.atan(Math.tan(Af*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,r){is.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(is.x,is.y).multiplyScalar(-e/is.z),is.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),r.set(is.x,is.y).multiplyScalar(-e/is.z)}getViewSize(e,t){return this.getViewBounds(e,Jg,Qg),t.subVectors(Qg,Jg)}setViewOffset(e,t,r,o,l,c){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=r,this.view.offsetY=o,this.view.width=l,this.view.height=c,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Af*.5*this.fov)/this.zoom,r=2*t,o=this.aspect*r,l=-.5*o;const c=this.view;if(this.view!==null&&this.view.enabled){const p=c.fullWidth,m=c.fullHeight;l+=c.offsetX*o/p,t-=c.offsetY*r/m,o*=c.width/p,r*=c.height/m}const f=this.filmOffset;f!==0&&(l+=e*f/this.getFilmWidth()),this.projectionMatrix.makePerspective(l,l+o,t,t-r,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Wc extends Xh{constructor(e=-1,t=1,r=1,o=-1,l=.1,c=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=r,this.bottom=o,this.near=l,this.far=c,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,r,o,l,c){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=r,this.view.offsetY=o,this.view.width=l,this.view.height=c,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),r=(this.right+this.left)/2,o=(this.top+this.bottom)/2;let l=r-e,c=r+e,f=o+t,p=o-t;if(this.view!==null&&this.view.enabled){const m=(this.right-this.left)/this.view.fullWidth/this.zoom,_=(this.top-this.bottom)/this.view.fullHeight/this.zoom;l+=m*this.view.offsetX,c=l+m*this.view.width,f-=_*this.view.offsetY,p=f-_*this.view.height}this.projectionMatrix.makeOrthographic(l,c,f,p,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class uy extends ly{constructor(){super(new Wc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class P_ extends jh{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(un.DEFAULT_UP),this.updateMatrix(),this.target=new un,this.shadow=new uy}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}const Pa=-90,Na=1;class N_ extends un{constructor(e,t,r){super(),this.type="CubeCamera",this.renderTarget=r,this.coordinateSystem=null,this.activeMipmapLevel=0;const o=new mi(Pa,Na,e,t);o.layers=this.layers,this.add(o);const l=new mi(Pa,Na,e,t);l.layers=this.layers,this.add(l);const c=new mi(Pa,Na,e,t);c.layers=this.layers,this.add(c);const f=new mi(Pa,Na,e,t);f.layers=this.layers,this.add(f);const p=new mi(Pa,Na,e,t);p.layers=this.layers,this.add(p);const m=new mi(Pa,Na,e,t);m.layers=this.layers,this.add(m)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[r,o,l,c,f,p]=t;for(const m of t)this.remove(m);if(e===Wi)r.up.set(0,1,0),r.lookAt(1,0,0),o.up.set(0,1,0),o.lookAt(-1,0,0),l.up.set(0,0,-1),l.lookAt(0,1,0),c.up.set(0,0,1),c.lookAt(0,-1,0),f.up.set(0,1,0),f.lookAt(0,0,1),p.up.set(0,1,0),p.lookAt(0,0,-1);else if(e===Ba)r.up.set(0,-1,0),r.lookAt(-1,0,0),o.up.set(0,-1,0),o.lookAt(1,0,0),l.up.set(0,0,1),l.lookAt(0,1,0),c.up.set(0,0,-1),c.lookAt(0,-1,0),f.up.set(0,-1,0),f.lookAt(0,0,1),p.up.set(0,-1,0),p.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const m of t)this.add(m),m.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:r,activeMipmapLevel:o}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[l,c,f,p,m,_]=this.children,y=e.getRenderTarget(),g=e.getActiveCubeFace(),S=e.getActiveMipmapLevel(),E=e.xr.enabled;e.xr.enabled=!1;const A=r.texture.generateMipmaps;r.texture.generateMipmaps=!1;let x=!1;e.isWebGLRenderer===!0?x=e.state.buffers.depth.getReversed():x=e.reversedDepthBuffer,e.setRenderTarget(r,0,o),x&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(r,1,o),x&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(r,2,o),x&&e.autoClear===!1&&e.clearDepth(),e.render(t,f),e.setRenderTarget(r,3,o),x&&e.autoClear===!1&&e.clearDepth(),e.render(t,p),e.setRenderTarget(r,4,o),x&&e.autoClear===!1&&e.clearDepth(),e.render(t,m),r.texture.generateMipmaps=A,e.setRenderTarget(r,5,o),x&&e.autoClear===!1&&e.clearDepth(),e.render(t,_),e.setRenderTarget(y,g,S),e.xr.enabled=E,r.texture.needsPMREMUpdate=!0}}class L_ extends mi{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const e0=new Jt;class D_{constructor(e,t,r=0,o=1/0){this.ray=new kc(e,t),this.near=r,this.far=o,this.camera=null,this.layers=new Oc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Rt("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return e0.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(e0),this}intersectObject(e,t=!0,r=[]){return gh(e,this,r,t),r.sort(t0),r}intersectObjects(e,t=!0,r=[]){for(let o=0,l=e.length;o<l;o++)gh(e[o],this,r,t);return r.sort(t0),r}}function t0(s,e){return s.distance-e.distance}function gh(s,e,t,r){let o=!0;if(s.layers.test(e.layers)&&s.raycast(e,t)===!1&&(o=!1),o===!0&&r===!0){const l=s.children;for(let c=0,f=l.length;c<f;c++)gh(l[c],e,t,!0)}}const ep=class ep{constructor(e,t,r,o){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,r,o)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let r=0;r<4;r++)this.elements[r]=e[r+t];return this}set(e,t,r,o){const l=this.elements;return l[0]=e,l[2]=t,l[1]=r,l[3]=o,this}};ep.prototype.isMatrix2=!0;let _h=ep;class I_ extends Gh{constructor(e=10,t=10,r=4473924,o=8947848){r=new St(r),o=new St(o);const l=t/2,c=e/t,f=e/2,p=[],m=[];for(let g=0,S=0,E=-f;g<=t;g++,E+=c){p.push(-f,0,E,f,0,E),p.push(E,0,-f,E,0,f);const A=g===l?r:o;A.toArray(m,S),S+=3,A.toArray(m,S),S+=3,A.toArray(m,S),S+=3,A.toArray(m,S),S+=3}const _=new cn;_.setAttribute("position",new qt(p,3)),_.setAttribute("color",new qt(m,3));const y=new Gs({vertexColors:!0,toneMapped:!1});super(_,y),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}const n0=new Z;let Tu,Qf;class U_ extends un{constructor(e=new Z(0,0,1),t=new Z(0,0,0),r=1,o=16776960,l=r*.2,c=l*.2){super(),this.type="ArrowHelper",Tu===void 0&&(Tu=new cn,Tu.setAttribute("position",new qt([0,0,0,0,1,0],3)),Qf=new Vc(.5,1,5,1),Qf.translate(0,-.5,0)),this.position.copy(t),this.line=new $o(Tu,new Gs({color:o,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new ln(Qf,new bi({color:o,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(e),this.setLength(r,l,c)}setDirection(e){if(e.y>.99999)this.quaternion.set(0,0,0,1);else if(e.y<-.99999)this.quaternion.set(1,0,0,0);else{n0.set(e.z,0,-e.x).normalize();const t=Math.acos(e.y);this.quaternion.setFromAxisAngle(n0,t)}}setLength(e,t=e*.2,r=t*.2){this.line.scale.set(1,Math.max(1e-4,e-t),1),this.line.updateMatrix(),this.cone.scale.set(r,t,r),this.cone.position.y=e,this.cone.updateMatrix()}setColor(e){this.line.material.color.set(e),this.cone.material.color.set(e)}copy(e){return super.copy(e,!1),this.line.copy(e.line),this.cone.copy(e.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}}class F_ extends Gh{constructor(e=1){const t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],r=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],o=new cn;o.setAttribute("position",new qt(t,3)),o.setAttribute("color",new qt(r,3));const l=new Gs({vertexColors:!0,toneMapped:!1});super(o,l),this.type="AxesHelper"}setColors(e,t,r){const o=new St,l=this.geometry.attributes.color.array;return o.set(e),o.toArray(l,0),o.toArray(l,3),o.set(t),o.toArray(l,6),o.toArray(l,9),o.set(r),o.toArray(l,12),o.toArray(l,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}function i0(s,e,t,r){const o=cy(r);switch(t){case Fh:return s*e;case zh:return s*e/o.components*o.byteLength;case Nc:return s*e/o.components*o.byteLength;case fs:return s*e*2/o.components*o.byteLength;case Lc:return s*e*2/o.components*o.byteLength;case Oh:return s*e*3/o.components*o.byteLength;case Ai:return s*e*4/o.components*o.byteLength;case Dc:return s*e*4/o.components*o.byteLength;case zo:case ko:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Bo:case Vo:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Xu:case qu:return Math.max(s,16)*Math.max(e,8)/4;case ju:case Yu:return Math.max(s,8)*Math.max(e,8)/2;case $u:case Ku:case Ju:case Qu:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Zu:case Go:case ec:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case tc:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case nc:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case ic:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case rc:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case sc:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case ac:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case oc:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case lc:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case uc:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case cc:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case dc:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case fc:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case hc:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case pc:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case mc:case gc:case _c:return Math.ceil(s/4)*Math.ceil(e/4)*16;case vc:case xc:return Math.ceil(s/4)*Math.ceil(e/4)*8;case Ho:case yc:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function cy(s){switch(s){case oi:case Lh:return{byteLength:1,components:1};case za:case Dh:case ur:return{byteLength:2,components:1};case Cc:case Pc:return{byteLength:2,components:4};case Yi:case Rc:case Hi:return{byteLength:4,components:1};case Ih:case Uh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ac}}));typeof window<"u"&&(window.__THREE__?ct("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ac);function O_(){let s=null,e=!1,t=null,r=null;function o(l,c){t(l,c),r=s.requestAnimationFrame(o)}return{start:function(){e!==!0&&t!==null&&s!==null&&(r=s.requestAnimationFrame(o),e=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(r),e=!1},setAnimationLoop:function(l){t=l},setContext:function(l){s=l}}}function dy(s){const e=new WeakMap;function t(f,p){const m=f.array,_=f.usage,y=m.byteLength,g=s.createBuffer();s.bindBuffer(p,g),s.bufferData(p,m,_),f.onUploadCallback();let S;if(m instanceof Float32Array)S=s.FLOAT;else if(typeof Float16Array<"u"&&m instanceof Float16Array)S=s.HALF_FLOAT;else if(m instanceof Uint16Array)f.isFloat16BufferAttribute?S=s.HALF_FLOAT:S=s.UNSIGNED_SHORT;else if(m instanceof Int16Array)S=s.SHORT;else if(m instanceof Uint32Array)S=s.UNSIGNED_INT;else if(m instanceof Int32Array)S=s.INT;else if(m instanceof Int8Array)S=s.BYTE;else if(m instanceof Uint8Array)S=s.UNSIGNED_BYTE;else if(m instanceof Uint8ClampedArray)S=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+m);return{buffer:g,type:S,bytesPerElement:m.BYTES_PER_ELEMENT,version:f.version,size:y}}function r(f,p,m){const _=p.array,y=p.updateRanges;if(s.bindBuffer(m,f),y.length===0)s.bufferSubData(m,0,_);else{y.sort((S,E)=>S.start-E.start);let g=0;for(let S=1;S<y.length;S++){const E=y[g],A=y[S];A.start<=E.start+E.count+1?E.count=Math.max(E.count,A.start+A.count-E.start):(++g,y[g]=A)}y.length=g+1;for(let S=0,E=y.length;S<E;S++){const A=y[S];s.bufferSubData(m,A.start*_.BYTES_PER_ELEMENT,_,A.start,A.count)}p.clearUpdateRanges()}p.onUploadCallback()}function o(f){return f.isInterleavedBufferAttribute&&(f=f.data),e.get(f)}function l(f){f.isInterleavedBufferAttribute&&(f=f.data);const p=e.get(f);p&&(s.deleteBuffer(p.buffer),e.delete(f))}function c(f,p){if(f.isInterleavedBufferAttribute&&(f=f.data),f.isGLBufferAttribute){const _=e.get(f);(!_||_.version<f.version)&&e.set(f,{buffer:f.buffer,type:f.type,bytesPerElement:f.elementSize,version:f.version});return}const m=e.get(f);if(m===void 0)e.set(f,t(f,p));else if(m.version<f.version){if(m.size!==f.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(m.buffer,f,p),m.version=f.version}}return{get:o,remove:l,update:c}}var fy=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,hy=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,py=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,my=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,gy=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,_y=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,vy=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,xy=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,yy=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Sy=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,My=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ey=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ty=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,wy=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,by=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Ay=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Ry=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Cy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Py=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ny=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Ly=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Dy=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Iy=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Uy=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Fy=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Oy=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,zy=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ky=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,By=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Vy=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Gy="gl_FragColor = linearToOutputTexel( gl_FragColor );",Hy=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Wy=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,jy=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Xy=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Yy=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,qy=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,$y=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ky=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Zy=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Jy=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Qy=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,eS=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,tS=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,nS=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,iS=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,rS=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,sS=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,aS=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,oS=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lS=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,uS=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,cS=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,dS=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = inverseTransformDirection( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,fS=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,hS=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,pS=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,mS=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,gS=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,_S=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,vS=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,xS=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,yS=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,SS=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,MS=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ES=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,TS=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,wS=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,bS=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,AS=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,RS=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,CS=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,PS=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,NS=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,LS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,DS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,IS=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,US=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,FS=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,OS=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,zS=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,kS=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,BS=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,VS=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,GS=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,HS=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,WS=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,jS=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,XS=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,YS=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,qS=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,$S=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,KS=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,ZS=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,JS=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,QS=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,eM=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,tM=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,nM=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,iM=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,rM=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,sM=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,aM=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,oM=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,lM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,cM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,dM=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const fM=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,hM=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,mM=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,_M=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,xM=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,yM=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,SM=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,MM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,EM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,TM=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,wM=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,bM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,AM=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,RM=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,CM=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,PM=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,NM=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,LM=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,DM=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,IM=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,UM=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,FM=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,OM=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zM=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,kM=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,BM=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,VM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,GM=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,HM=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,WM=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,jM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,yt={alphahash_fragment:fy,alphahash_pars_fragment:hy,alphamap_fragment:py,alphamap_pars_fragment:my,alphatest_fragment:gy,alphatest_pars_fragment:_y,aomap_fragment:vy,aomap_pars_fragment:xy,batching_pars_vertex:yy,batching_vertex:Sy,begin_vertex:My,beginnormal_vertex:Ey,bsdfs:Ty,iridescence_fragment:wy,bumpmap_pars_fragment:by,clipping_planes_fragment:Ay,clipping_planes_pars_fragment:Ry,clipping_planes_pars_vertex:Cy,clipping_planes_vertex:Py,color_fragment:Ny,color_pars_fragment:Ly,color_pars_vertex:Dy,color_vertex:Iy,common:Uy,cube_uv_reflection_fragment:Fy,defaultnormal_vertex:Oy,displacementmap_pars_vertex:zy,displacementmap_vertex:ky,emissivemap_fragment:By,emissivemap_pars_fragment:Vy,colorspace_fragment:Gy,colorspace_pars_fragment:Hy,envmap_fragment:Wy,envmap_common_pars_fragment:jy,envmap_pars_fragment:Xy,envmap_pars_vertex:Yy,envmap_physical_pars_fragment:rS,envmap_vertex:qy,fog_vertex:$y,fog_pars_vertex:Ky,fog_fragment:Zy,fog_pars_fragment:Jy,gradientmap_pars_fragment:Qy,lightmap_pars_fragment:eS,lights_lambert_fragment:tS,lights_lambert_pars_fragment:nS,lights_pars_begin:iS,lights_toon_fragment:sS,lights_toon_pars_fragment:aS,lights_phong_fragment:oS,lights_phong_pars_fragment:lS,lights_physical_fragment:uS,lights_physical_pars_fragment:cS,lights_fragment_begin:dS,lights_fragment_maps:fS,lights_fragment_end:hS,lightprobes_pars_fragment:pS,logdepthbuf_fragment:mS,logdepthbuf_pars_fragment:gS,logdepthbuf_pars_vertex:_S,logdepthbuf_vertex:vS,map_fragment:xS,map_pars_fragment:yS,map_particle_fragment:SS,map_particle_pars_fragment:MS,metalnessmap_fragment:ES,metalnessmap_pars_fragment:TS,morphinstance_vertex:wS,morphcolor_vertex:bS,morphnormal_vertex:AS,morphtarget_pars_vertex:RS,morphtarget_vertex:CS,normal_fragment_begin:PS,normal_fragment_maps:NS,normal_pars_fragment:LS,normal_pars_vertex:DS,normal_vertex:IS,normalmap_pars_fragment:US,clearcoat_normal_fragment_begin:FS,clearcoat_normal_fragment_maps:OS,clearcoat_pars_fragment:zS,iridescence_pars_fragment:kS,opaque_fragment:BS,packing:VS,premultiplied_alpha_fragment:GS,project_vertex:HS,dithering_fragment:WS,dithering_pars_fragment:jS,roughnessmap_fragment:XS,roughnessmap_pars_fragment:YS,shadowmap_pars_fragment:qS,shadowmap_pars_vertex:$S,shadowmap_vertex:KS,shadowmask_pars_fragment:ZS,skinbase_vertex:JS,skinning_pars_vertex:QS,skinning_vertex:eM,skinnormal_vertex:tM,specularmap_fragment:nM,specularmap_pars_fragment:iM,tonemapping_fragment:rM,tonemapping_pars_fragment:sM,transmission_fragment:aM,transmission_pars_fragment:oM,uv_pars_fragment:lM,uv_pars_vertex:uM,uv_vertex:cM,worldpos_vertex:dM,background_vert:fM,background_frag:hM,backgroundCube_vert:pM,backgroundCube_frag:mM,cube_vert:gM,cube_frag:_M,depth_vert:vM,depth_frag:xM,distance_vert:yM,distance_frag:SM,equirect_vert:MM,equirect_frag:EM,linedashed_vert:TM,linedashed_frag:wM,meshbasic_vert:bM,meshbasic_frag:AM,meshlambert_vert:RM,meshlambert_frag:CM,meshmatcap_vert:PM,meshmatcap_frag:NM,meshnormal_vert:LM,meshnormal_frag:DM,meshphong_vert:IM,meshphong_frag:UM,meshphysical_vert:FM,meshphysical_frag:OM,meshtoon_vert:zM,meshtoon_frag:kM,points_vert:BM,points_frag:VM,shadow_vert:GM,shadow_frag:HM,sprite_vert:WM,sprite_frag:jM},Ge={common:{diffuse:{value:new St(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new gt},alphaMap:{value:null},alphaMapTransform:{value:new gt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new gt}},envmap:{envMap:{value:null},envMapRotation:{value:new gt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new gt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new gt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new gt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new gt},normalScale:{value:new vt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new gt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new gt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new gt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new gt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new St(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new Z},probesMax:{value:new Z},probesResolution:{value:new Z}},points:{diffuse:{value:new St(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new gt},alphaTest:{value:0},uvTransform:{value:new gt}},sprite:{diffuse:{value:new St(16777215)},opacity:{value:1},center:{value:new vt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new gt},alphaMap:{value:null},alphaMapTransform:{value:new gt},alphaTest:{value:0}}},Vi={basic:{uniforms:qn([Ge.common,Ge.specularmap,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.fog]),vertexShader:yt.meshbasic_vert,fragmentShader:yt.meshbasic_frag},lambert:{uniforms:qn([Ge.common,Ge.specularmap,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.fog,Ge.lights,{emissive:{value:new St(0)},envMapIntensity:{value:1}}]),vertexShader:yt.meshlambert_vert,fragmentShader:yt.meshlambert_frag},phong:{uniforms:qn([Ge.common,Ge.specularmap,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.fog,Ge.lights,{emissive:{value:new St(0)},specular:{value:new St(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:yt.meshphong_vert,fragmentShader:yt.meshphong_frag},standard:{uniforms:qn([Ge.common,Ge.envmap,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.roughnessmap,Ge.metalnessmap,Ge.fog,Ge.lights,{emissive:{value:new St(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:yt.meshphysical_vert,fragmentShader:yt.meshphysical_frag},toon:{uniforms:qn([Ge.common,Ge.aomap,Ge.lightmap,Ge.emissivemap,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.gradientmap,Ge.fog,Ge.lights,{emissive:{value:new St(0)}}]),vertexShader:yt.meshtoon_vert,fragmentShader:yt.meshtoon_frag},matcap:{uniforms:qn([Ge.common,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,Ge.fog,{matcap:{value:null}}]),vertexShader:yt.meshmatcap_vert,fragmentShader:yt.meshmatcap_frag},points:{uniforms:qn([Ge.points,Ge.fog]),vertexShader:yt.points_vert,fragmentShader:yt.points_frag},dashed:{uniforms:qn([Ge.common,Ge.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:yt.linedashed_vert,fragmentShader:yt.linedashed_frag},depth:{uniforms:qn([Ge.common,Ge.displacementmap]),vertexShader:yt.depth_vert,fragmentShader:yt.depth_frag},normal:{uniforms:qn([Ge.common,Ge.bumpmap,Ge.normalmap,Ge.displacementmap,{opacity:{value:1}}]),vertexShader:yt.meshnormal_vert,fragmentShader:yt.meshnormal_frag},sprite:{uniforms:qn([Ge.sprite,Ge.fog]),vertexShader:yt.sprite_vert,fragmentShader:yt.sprite_frag},background:{uniforms:{uvTransform:{value:new gt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:yt.background_vert,fragmentShader:yt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new gt}},vertexShader:yt.backgroundCube_vert,fragmentShader:yt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:yt.cube_vert,fragmentShader:yt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:yt.equirect_vert,fragmentShader:yt.equirect_frag},distance:{uniforms:qn([Ge.common,Ge.displacementmap,{referencePosition:{value:new Z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:yt.distance_vert,fragmentShader:yt.distance_frag},shadow:{uniforms:qn([Ge.lights,Ge.fog,{color:{value:new St(0)},opacity:{value:1}}]),vertexShader:yt.shadow_vert,fragmentShader:yt.shadow_frag}};Vi.physical={uniforms:qn([Vi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new gt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new gt},clearcoatNormalScale:{value:new vt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new gt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new gt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new gt},sheen:{value:0},sheenColor:{value:new St(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new gt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new gt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new gt},transmissionSamplerSize:{value:new vt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new gt},attenuationDistance:{value:0},attenuationColor:{value:new St(0)},specularColor:{value:new St(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new gt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new gt},anisotropyVector:{value:new vt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new gt}}]),vertexShader:yt.meshphysical_vert,fragmentShader:yt.meshphysical_frag};const wu={r:0,b:0,g:0},XM=new Jt,z_=new gt;z_.set(-1,0,0,0,1,0,0,0,1);function YM(s,e,t,r,o,l){const c=new St(0);let f=o===!0?0:1,p,m,_=null,y=0,g=null;function S(C){let U=C.isScene===!0?C.background:null;if(U&&U.isTexture){const R=C.backgroundBlurriness>0;U=e.get(U,R)}return U}function E(C){let U=!1;const R=S(C);R===null?x(c,f):R&&R.isColor&&(x(R,1),U=!0);const G=s.xr.getEnvironmentBlendMode();G==="additive"?t.buffers.color.setClear(0,0,0,1,l):G==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,l),(s.autoClear||U)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function A(C,U){const R=S(U);R&&(R.isCubeTexture||R.mapping===Jo)?(m===void 0&&(m=new ln(new Ha(1,1,1),new qi({name:"BackgroundCubeMaterial",uniforms:Va(Vi.backgroundCube.uniforms),vertexShader:Vi.backgroundCube.vertexShader,fragmentShader:Vi.backgroundCube.fragmentShader,side:Zn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),m.geometry.deleteAttribute("normal"),m.geometry.deleteAttribute("uv"),m.onBeforeRender=function(G,D,V){this.matrixWorld.copyPosition(V.matrixWorld)},Object.defineProperty(m.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(m)),m.material.uniforms.envMap.value=R,m.material.uniforms.backgroundBlurriness.value=U.backgroundBlurriness,m.material.uniforms.backgroundIntensity.value=U.backgroundIntensity,m.material.uniforms.backgroundRotation.value.setFromMatrix4(XM.makeRotationFromEuler(U.backgroundRotation)).transpose(),R.isCubeTexture&&R.isRenderTargetTexture===!1&&m.material.uniforms.backgroundRotation.value.premultiply(z_),m.material.toneMapped=Ct.getTransfer(R.colorSpace)!==kt,(_!==R||y!==R.version||g!==s.toneMapping)&&(m.material.needsUpdate=!0,_=R,y=R.version,g=s.toneMapping),m.layers.enableAll(),C.unshift(m,m.geometry,m.material,0,0,null)):R&&R.isTexture&&(p===void 0&&(p=new ln(new Ws(2,2),new qi({name:"BackgroundMaterial",uniforms:Va(Vi.background.uniforms),vertexShader:Vi.background.vertexShader,fragmentShader:Vi.background.fragmentShader,side:Pr,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),p.geometry.deleteAttribute("normal"),Object.defineProperty(p.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(p)),p.material.uniforms.t2D.value=R,p.material.uniforms.backgroundIntensity.value=U.backgroundIntensity,p.material.toneMapped=Ct.getTransfer(R.colorSpace)!==kt,R.matrixAutoUpdate===!0&&R.updateMatrix(),p.material.uniforms.uvTransform.value.copy(R.matrix),(_!==R||y!==R.version||g!==s.toneMapping)&&(p.material.needsUpdate=!0,_=R,y=R.version,g=s.toneMapping),p.layers.enableAll(),C.unshift(p,p.geometry,p.material,0,0,null))}function x(C,U){C.getRGB(wu,y_(s)),t.buffers.color.setClear(wu.r,wu.g,wu.b,U,l)}function v(){m!==void 0&&(m.geometry.dispose(),m.material.dispose(),m=void 0),p!==void 0&&(p.geometry.dispose(),p.material.dispose(),p=void 0)}return{getClearColor:function(){return c},setClearColor:function(C,U=1){c.set(C),f=U,x(c,f)},getClearAlpha:function(){return f},setClearAlpha:function(C){f=C,x(c,f)},render:E,addToRenderList:A,dispose:v}}function qM(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),r={},o=g(null);let l=o,c=!1;function f(k,K,le,ue,W){let $=!1;const Y=y(k,ue,le,K);l!==Y&&(l=Y,m(l.object)),$=S(k,ue,le,W),$&&E(k,ue,le,W),W!==null&&e.update(W,s.ELEMENT_ARRAY_BUFFER),($||c)&&(c=!1,R(k,K,le,ue),W!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function p(){return s.createVertexArray()}function m(k){return s.bindVertexArray(k)}function _(k){return s.deleteVertexArray(k)}function y(k,K,le,ue){const W=ue.wireframe===!0;let $=r[K.id];$===void 0&&($={},r[K.id]=$);const Y=k.isInstancedMesh===!0?k.id:0;let Q=$[Y];Q===void 0&&(Q={},$[Y]=Q);let pe=Q[le.id];pe===void 0&&(pe={},Q[le.id]=pe);let me=pe[W];return me===void 0&&(me=g(p()),pe[W]=me),me}function g(k){const K=[],le=[],ue=[];for(let W=0;W<t;W++)K[W]=0,le[W]=0,ue[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:K,enabledAttributes:le,attributeDivisors:ue,object:k,attributes:{},index:null}}function S(k,K,le,ue){const W=l.attributes,$=K.attributes;let Y=0;const Q=le.getAttributes();for(const pe in Q)if(Q[pe].location>=0){const z=W[pe];let ne=$[pe];if(ne===void 0&&(pe==="instanceMatrix"&&k.instanceMatrix&&(ne=k.instanceMatrix),pe==="instanceColor"&&k.instanceColor&&(ne=k.instanceColor)),z===void 0||z.attribute!==ne||ne&&z.data!==ne.data)return!0;Y++}return l.attributesNum!==Y||l.index!==ue}function E(k,K,le,ue){const W={},$=K.attributes;let Y=0;const Q=le.getAttributes();for(const pe in Q)if(Q[pe].location>=0){let z=$[pe];z===void 0&&(pe==="instanceMatrix"&&k.instanceMatrix&&(z=k.instanceMatrix),pe==="instanceColor"&&k.instanceColor&&(z=k.instanceColor));const ne={};ne.attribute=z,z&&z.data&&(ne.data=z.data),W[pe]=ne,Y++}l.attributes=W,l.attributesNum=Y,l.index=ue}function A(){const k=l.newAttributes;for(let K=0,le=k.length;K<le;K++)k[K]=0}function x(k){v(k,0)}function v(k,K){const le=l.newAttributes,ue=l.enabledAttributes,W=l.attributeDivisors;le[k]=1,ue[k]===0&&(s.enableVertexAttribArray(k),ue[k]=1),W[k]!==K&&(s.vertexAttribDivisor(k,K),W[k]=K)}function C(){const k=l.newAttributes,K=l.enabledAttributes;for(let le=0,ue=K.length;le<ue;le++)K[le]!==k[le]&&(s.disableVertexAttribArray(le),K[le]=0)}function U(k,K,le,ue,W,$,Y){Y===!0?s.vertexAttribIPointer(k,K,le,W,$):s.vertexAttribPointer(k,K,le,ue,W,$)}function R(k,K,le,ue){A();const W=ue.attributes,$=le.getAttributes(),Y=K.defaultAttributeValues;for(const Q in $){const pe=$[Q];if(pe.location>=0){let me=W[Q];if(me===void 0&&(Q==="instanceMatrix"&&k.instanceMatrix&&(me=k.instanceMatrix),Q==="instanceColor"&&k.instanceColor&&(me=k.instanceColor)),me!==void 0){const z=me.normalized,ne=me.itemSize,Le=e.get(me);if(Le===void 0)continue;const We=Le.buffer,ze=Le.type,ce=Le.bytesPerElement,Te=ze===s.INT||ze===s.UNSIGNED_INT||me.gpuType===Rc;if(me.isInterleavedBufferAttribute){const ve=me.data,Ve=ve.stride,et=me.offset;if(ve.isInstancedInterleavedBuffer){for(let rt=0;rt<pe.locationSize;rt++)v(pe.location+rt,ve.meshPerAttribute);k.isInstancedMesh!==!0&&ue._maxInstanceCount===void 0&&(ue._maxInstanceCount=ve.meshPerAttribute*ve.count)}else for(let rt=0;rt<pe.locationSize;rt++)x(pe.location+rt);s.bindBuffer(s.ARRAY_BUFFER,We);for(let rt=0;rt<pe.locationSize;rt++)U(pe.location+rt,ne/pe.locationSize,ze,z,Ve*ce,(et+ne/pe.locationSize*rt)*ce,Te)}else{if(me.isInstancedBufferAttribute){for(let ve=0;ve<pe.locationSize;ve++)v(pe.location+ve,me.meshPerAttribute);k.isInstancedMesh!==!0&&ue._maxInstanceCount===void 0&&(ue._maxInstanceCount=me.meshPerAttribute*me.count)}else for(let ve=0;ve<pe.locationSize;ve++)x(pe.location+ve);s.bindBuffer(s.ARRAY_BUFFER,We);for(let ve=0;ve<pe.locationSize;ve++)U(pe.location+ve,ne/pe.locationSize,ze,z,ne*ce,ne/pe.locationSize*ve*ce,Te)}}else if(Y!==void 0){const z=Y[Q];if(z!==void 0)switch(z.length){case 2:s.vertexAttrib2fv(pe.location,z);break;case 3:s.vertexAttrib3fv(pe.location,z);break;case 4:s.vertexAttrib4fv(pe.location,z);break;default:s.vertexAttrib1fv(pe.location,z)}}}}C()}function G(){I();for(const k in r){const K=r[k];for(const le in K){const ue=K[le];for(const W in ue){const $=ue[W];for(const Y in $)_($[Y].object),delete $[Y];delete ue[W]}}delete r[k]}}function D(k){if(r[k.id]===void 0)return;const K=r[k.id];for(const le in K){const ue=K[le];for(const W in ue){const $=ue[W];for(const Y in $)_($[Y].object),delete $[Y];delete ue[W]}}delete r[k.id]}function V(k){for(const K in r){const le=r[K];for(const ue in le){const W=le[ue];if(W[k.id]===void 0)continue;const $=W[k.id];for(const Y in $)_($[Y].object),delete $[Y];delete W[k.id]}}}function w(k){for(const K in r){const le=r[K],ue=k.isInstancedMesh===!0?k.id:0,W=le[ue];if(W!==void 0){for(const $ in W){const Y=W[$];for(const Q in Y)_(Y[Q].object),delete Y[Q];delete W[$]}delete le[ue],Object.keys(le).length===0&&delete r[K]}}}function I(){X(),c=!0,l!==o&&(l=o,m(l.object))}function X(){o.geometry=null,o.program=null,o.wireframe=!1}return{setup:f,reset:I,resetDefaultState:X,dispose:G,releaseStatesOfGeometry:D,releaseStatesOfObject:w,releaseStatesOfProgram:V,initAttributes:A,enableAttribute:x,disableUnusedAttributes:C}}function $M(s,e,t){let r;function o(p){r=p}function l(p,m){s.drawArrays(r,p,m),t.update(m,r,1)}function c(p,m,_){_!==0&&(s.drawArraysInstanced(r,p,m,_),t.update(m,r,_))}function f(p,m,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r,p,0,m,0,_);let g=0;for(let S=0;S<_;S++)g+=m[S];t.update(g,r,1)}this.setMode=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=f}function KM(s,e,t,r){let o;function l(){if(o!==void 0)return o;if(e.has("EXT_texture_filter_anisotropic")===!0){const V=e.get("EXT_texture_filter_anisotropic");o=s.getParameter(V.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else o=0;return o}function c(V){return!(V!==Ai&&r.convert(V)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function f(V){const w=V===ur&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(V!==oi&&r.convert(V)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&V!==Hi&&!w)}function p(V){if(V==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";V="mediump"}return V==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let m=t.precision!==void 0?t.precision:"highp";const _=p(m);_!==m&&(ct("WebGLRenderer:",m,"not supported, using",_,"instead."),m=_);const y=t.logarithmicDepthBuffer===!0,g=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&g===!1&&ct("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const S=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),E=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),A=s.getParameter(s.MAX_TEXTURE_SIZE),x=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),v=s.getParameter(s.MAX_VERTEX_ATTRIBS),C=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),U=s.getParameter(s.MAX_VARYING_VECTORS),R=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),G=s.getParameter(s.MAX_SAMPLES),D=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:l,getMaxPrecision:p,textureFormatReadable:c,textureTypeReadable:f,precision:m,logarithmicDepthBuffer:y,reversedDepthBuffer:g,maxTextures:S,maxVertexTextures:E,maxTextureSize:A,maxCubemapSize:x,maxAttributes:v,maxVertexUniforms:C,maxVaryings:U,maxFragmentUniforms:R,maxSamples:G,samples:D}}function ZM(s){const e=this;let t=null,r=0,o=!1,l=!1;const c=new wr,f=new gt,p={value:null,needsUpdate:!1};this.uniform=p,this.numPlanes=0,this.numIntersection=0,this.init=function(y,g){const S=y.length!==0||g||r!==0||o;return o=g,r=y.length,S},this.beginShadows=function(){l=!0,_(null)},this.endShadows=function(){l=!1},this.setGlobalState=function(y,g){t=_(y,g,0)},this.setState=function(y,g,S){const E=y.clippingPlanes,A=y.clipIntersection,x=y.clipShadows,v=s.get(y);if(!o||E===null||E.length===0||l&&!x)l?_(null):m();else{const C=l?0:r,U=C*4;let R=v.clippingState||null;p.value=R,R=_(E,g,U,S);for(let G=0;G!==U;++G)R[G]=t[G];v.clippingState=R,this.numIntersection=A?this.numPlanes:0,this.numPlanes+=C}};function m(){p.value!==t&&(p.value=t,p.needsUpdate=r>0),e.numPlanes=r,e.numIntersection=0}function _(y,g,S,E){const A=y!==null?y.length:0;let x=null;if(A!==0){if(x=p.value,E!==!0||x===null){const v=S+A*4,C=g.matrixWorldInverse;f.getNormalMatrix(C),(x===null||x.length<v)&&(x=new Float32Array(v));for(let U=0,R=S;U!==A;++U,R+=4)c.copy(y[U]).applyMatrix4(C,f),c.normal.toArray(x,R),x[R+3]=c.constant}p.value=x,p.needsUpdate=!0}return e.numPlanes=A,e.numIntersection=0,x}}const ls=4,r0=[.125,.215,.35,.446,.526,.582],zs=20,JM=256,Lo=new Wc,s0=new St;let eh=null,th=0,nh=0,ih=!1;const QM=new Z;class vh{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,r=.1,o=100,l={}){const{size:c=256,position:f=QM}=l;eh=this._renderer.getRenderTarget(),th=this._renderer.getActiveCubeFace(),nh=this._renderer.getActiveMipmapLevel(),ih=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(c);const p=this._allocateTargets();return p.depthBuffer=!0,this._sceneToCubeUV(e,r,o,p,f),t>0&&this._blur(p,0,0,t),this._applyPMREM(p),this._cleanup(p),p}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=l0(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=o0(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(eh,th,nh),this._renderer.xr.enabled=ih,e.scissorTest=!1,La(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ds||e.mapping===Vs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),eh=this._renderer.getRenderTarget(),th=this._renderer.getActiveCubeFace(),nh=this._renderer.getActiveMipmapLevel(),ih=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const r=t||this._allocateTargets();return this._textureToCubeUV(e,r),this._applyPMREM(r),this._cleanup(r),r}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,r={magFilter:Ln,minFilter:Ln,generateMipmaps:!1,type:ur,format:Ai,colorSpace:Wo,depthBuffer:!1},o=a0(e,t,r);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=a0(e,t,r);const{_lodMax:l}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=eE(l)),this._blurMaterial=nE(l,e,t),this._ggxMaterial=tE(l,e,t)}return o}_compileMaterial(e){const t=new ln(new cn,e);this._renderer.compile(t,Lo)}_sceneToCubeUV(e,t,r,o,l){const p=new mi(90,1,t,r),m=[1,-1,1,1,1,1],_=[1,1,1,-1,-1,-1],y=this._renderer,g=y.autoClear,S=y.toneMapping;y.getClearColor(s0),y.toneMapping=ji,y.autoClear=!1,y.state.buffers.depth.getReversed()&&(y.setRenderTarget(o),y.clearDepth(),y.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ln(new Ha,new bi({name:"PMREM.Background",side:Zn,depthWrite:!1,depthTest:!1})));const A=this._backgroundBox,x=A.material;let v=!1;const C=e.background;C?C.isColor&&(x.color.copy(C),e.background=null,v=!0):(x.color.copy(s0),v=!0);for(let U=0;U<6;U++){const R=U%3;R===0?(p.up.set(0,m[U],0),p.position.set(l.x,l.y,l.z),p.lookAt(l.x+_[U],l.y,l.z)):R===1?(p.up.set(0,0,m[U]),p.position.set(l.x,l.y,l.z),p.lookAt(l.x,l.y+_[U],l.z)):(p.up.set(0,m[U],0),p.position.set(l.x,l.y,l.z),p.lookAt(l.x,l.y,l.z+_[U]));const G=this._cubeSize;La(o,R*G,U>2?G:0,G,G),y.setRenderTarget(o),v&&y.render(A,p),y.render(e,p)}y.toneMapping=S,y.autoClear=g,e.background=C}_textureToCubeUV(e,t){const r=this._renderer,o=e.mapping===ds||e.mapping===Vs;o?(this._cubemapMaterial===null&&(this._cubemapMaterial=l0()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=o0());const l=o?this._cubemapMaterial:this._equirectMaterial,c=this._lodMeshes[0];c.material=l;const f=l.uniforms;f.envMap.value=e;const p=this._cubeSize;La(t,0,0,3*p,2*p),r.setRenderTarget(t),r.render(c,Lo)}_applyPMREM(e){const t=this._renderer,r=t.autoClear;t.autoClear=!1;const o=this._lodMeshes.length;for(let l=1;l<o;l++)this._applyGGXFilter(e,l-1,l);t.autoClear=r}_applyGGXFilter(e,t,r){const o=this._renderer,l=this._pingPongRenderTarget,c=this._ggxMaterial,f=this._lodMeshes[r];f.material=c;const p=c.uniforms,m=r/(this._lodMeshes.length-1),_=t/(this._lodMeshes.length-1),y=Math.sqrt(m*m-_*_),g=0+m*1.25,S=y*g,{_lodMax:E}=this,A=this._sizeLods[r],x=3*A*(r>E-ls?r-E+ls:0),v=4*(this._cubeSize-A);p.envMap.value=e.texture,p.roughness.value=S,p.mipInt.value=E-t,La(l,x,v,3*A,2*A),o.setRenderTarget(l),o.render(f,Lo),p.envMap.value=l.texture,p.roughness.value=0,p.mipInt.value=E-r,La(e,x,v,3*A,2*A),o.setRenderTarget(e),o.render(f,Lo)}_blur(e,t,r,o,l){const c=this._pingPongRenderTarget;this._halfBlur(e,c,t,r,o,"latitudinal",l),this._halfBlur(c,e,r,r,o,"longitudinal",l)}_halfBlur(e,t,r,o,l,c,f){const p=this._renderer,m=this._blurMaterial;c!=="latitudinal"&&c!=="longitudinal"&&Rt("blur direction must be either latitudinal or longitudinal!");const _=3,y=this._lodMeshes[o];y.material=m;const g=m.uniforms,S=this._sizeLods[r]-1,E=isFinite(l)?Math.PI/(2*S):2*Math.PI/(2*zs-1),A=l/E,x=isFinite(l)?1+Math.floor(_*A):zs;x>zs&&ct(`sigmaRadians, ${l}, is too large and will clip, as it requested ${x} samples when the maximum is set to ${zs}`);const v=[];let C=0;for(let V=0;V<zs;++V){const w=V/A,I=Math.exp(-w*w/2);v.push(I),V===0?C+=I:V<x&&(C+=2*I)}for(let V=0;V<v.length;V++)v[V]=v[V]/C;g.envMap.value=e.texture,g.samples.value=x,g.weights.value=v,g.latitudinal.value=c==="latitudinal",f&&(g.poleAxis.value=f);const{_lodMax:U}=this;g.dTheta.value=E,g.mipInt.value=U-r;const R=this._sizeLods[o],G=3*R*(o>U-ls?o-U+ls:0),D=4*(this._cubeSize-R);La(t,G,D,3*R,2*R),p.setRenderTarget(t),p.render(y,Lo)}}function eE(s){const e=[],t=[],r=[];let o=s;const l=s-ls+1+r0.length;for(let c=0;c<l;c++){const f=Math.pow(2,o);e.push(f);let p=1/f;c>s-ls?p=r0[c-s+ls-1]:c===0&&(p=0),t.push(p);const m=1/(f-2),_=-m,y=1+m,g=[_,_,y,_,y,y,_,_,y,y,_,y],S=6,E=6,A=3,x=2,v=1,C=new Float32Array(A*E*S),U=new Float32Array(x*E*S),R=new Float32Array(v*E*S);for(let D=0;D<S;D++){const V=D%3*2/3-1,w=D>2?0:-1,I=[V,w,0,V+2/3,w,0,V+2/3,w+1,0,V,w,0,V+2/3,w+1,0,V,w+1,0];C.set(I,A*E*D),U.set(g,x*E*D);const X=[D,D,D,D,D,D];R.set(X,v*E*D)}const G=new cn;G.setAttribute("position",new Ri(C,A)),G.setAttribute("uv",new Ri(U,x)),G.setAttribute("faceIndex",new Ri(R,v)),r.push(new ln(G,null)),o>ls&&o--}return{lodMeshes:r,sizeLods:e,sigmas:t}}function a0(s,e,t){const r=new Xi(s,e,t);return r.texture.mapping=Jo,r.texture.name="PMREM.cubeUv",r.scissorTest=!0,r}function La(s,e,t,r,o){s.viewport.set(e,t,r,o),s.scissor.set(e,t,r,o)}function tE(s,e,t){return new qi({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:JM,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:jc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:lr,depthTest:!1,depthWrite:!1})}function nE(s,e,t){const r=new Float32Array(zs),o=new Z(0,1,0);return new qi({name:"SphericalGaussianBlur",defines:{n:zs,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:o}},vertexShader:jc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:lr,depthTest:!1,depthWrite:!1})}function o0(){return new qi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:jc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:lr,depthTest:!1,depthWrite:!1})}function l0(){return new qi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:jc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:lr,depthTest:!1,depthWrite:!1})}function jc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class Yh extends Xi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const r={width:e,height:e,depth:1},o=[r,r,r,r,r,r];this.texture=new Hh(o),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const r={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},o=new Ha(5,5,5),l=new qi({name:"CubemapFromEquirect",uniforms:Va(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:Zn,blending:lr});l.uniforms.tEquirect.value=t;const c=new ln(o,l),f=t.minFilter;return t.minFilter===as&&(t.minFilter=Ln),new N_(1,10,this).update(e,c),t.minFilter=f,c.geometry.dispose(),c.material.dispose(),this}clear(e,t=!0,r=!0,o=!0){const l=e.getRenderTarget();for(let c=0;c<6;c++)e.setRenderTarget(this,c),e.clear(t,r,o);e.setRenderTarget(l)}}function iE(s){let e=new WeakMap,t=new WeakMap,r=null;function o(g,S=!1){return g==null?null:S?c(g):l(g)}function l(g){if(g&&g.isTexture){const S=g.mapping;if(S===Au||S===Ru)if(e.has(g)){const E=e.get(g).texture;return f(E,g.mapping)}else{const E=g.image;if(E&&E.height>0){const A=new Yh(E.height);return A.fromEquirectangularTexture(s,g),e.set(g,A),g.addEventListener("dispose",m),f(A.texture,g.mapping)}else return null}}return g}function c(g){if(g&&g.isTexture){const S=g.mapping,E=S===Au||S===Ru,A=S===ds||S===Vs;if(E||A){let x=t.get(g);const v=x!==void 0?x.texture.pmremVersion:0;if(g.isRenderTargetTexture&&g.pmremVersion!==v)return r===null&&(r=new vh(s)),x=E?r.fromEquirectangular(g,x):r.fromCubemap(g,x),x.texture.pmremVersion=g.pmremVersion,t.set(g,x),x.texture;if(x!==void 0)return x.texture;{const C=g.image;return E&&C&&C.height>0||A&&C&&p(C)?(r===null&&(r=new vh(s)),x=E?r.fromEquirectangular(g):r.fromCubemap(g),x.texture.pmremVersion=g.pmremVersion,t.set(g,x),g.addEventListener("dispose",_),x.texture):null}}}return g}function f(g,S){return S===Au?g.mapping=ds:S===Ru&&(g.mapping=Vs),g}function p(g){let S=0;const E=6;for(let A=0;A<E;A++)g[A]!==void 0&&S++;return S===E}function m(g){const S=g.target;S.removeEventListener("dispose",m);const E=e.get(S);E!==void 0&&(e.delete(S),E.dispose())}function _(g){const S=g.target;S.removeEventListener("dispose",_);const E=t.get(S);E!==void 0&&(t.delete(S),E.dispose())}function y(){e=new WeakMap,t=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:o,dispose:y}}function rE(s){const e={};function t(r){if(e[r]!==void 0)return e[r];const o=s.getExtension(r);return e[r]=o,o}return{has:function(r){return t(r)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(r){const o=t(r);return o===null&&Ec("WebGLRenderer: "+r+" extension not supported."),o}}}function sE(s,e,t,r){const o={},l=new WeakMap;function c(y){const g=y.target;g.index!==null&&e.remove(g.index);for(const E in g.attributes)e.remove(g.attributes[E]);g.removeEventListener("dispose",c),delete o[g.id];const S=l.get(g);S&&(e.remove(S),l.delete(g)),r.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,t.memory.geometries--}function f(y,g){return o[g.id]===!0||(g.addEventListener("dispose",c),o[g.id]=!0,t.memory.geometries++),g}function p(y){const g=y.attributes;for(const S in g)e.update(g[S],s.ARRAY_BUFFER)}function m(y){const g=[],S=y.index,E=y.attributes.position;let A=0;if(E===void 0)return;if(S!==null){const C=S.array;A=S.version;for(let U=0,R=C.length;U<R;U+=3){const G=C[U+0],D=C[U+1],V=C[U+2];g.push(G,D,D,V,V,G)}}else{const C=E.array;A=E.version;for(let U=0,R=C.length/3-1;U<R;U+=3){const G=U+0,D=U+1,V=U+2;g.push(G,D,D,V,V,G)}}const x=new(E.count>=65535?Vh:Bh)(g,1);x.version=A;const v=l.get(y);v&&e.remove(v),l.set(y,x)}function _(y){const g=l.get(y);if(g){const S=y.index;S!==null&&g.version<S.version&&m(y)}else m(y);return l.get(y)}return{get:f,update:p,getWireframeAttribute:_}}function aE(s,e,t){let r;function o(y){r=y}let l,c;function f(y){l=y.type,c=y.bytesPerElement}function p(y,g){s.drawElements(r,g,l,y*c),t.update(g,r,1)}function m(y,g,S){S!==0&&(s.drawElementsInstanced(r,g,l,y*c,S),t.update(g,r,S))}function _(y,g,S){if(S===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r,g,0,l,y,0,S);let A=0;for(let x=0;x<S;x++)A+=g[x];t.update(A,r,1)}this.setMode=o,this.setIndex=f,this.render=p,this.renderInstances=m,this.renderMultiDraw=_}function oE(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function r(l,c,f){switch(t.calls++,c){case s.TRIANGLES:t.triangles+=f*(l/3);break;case s.LINES:t.lines+=f*(l/2);break;case s.LINE_STRIP:t.lines+=f*(l-1);break;case s.LINE_LOOP:t.lines+=f*l;break;case s.POINTS:t.points+=f*l;break;default:Rt("WebGLInfo: Unknown draw mode:",c);break}}function o(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:o,update:r}}function lE(s,e,t){const r=new WeakMap,o=new rn;function l(c,f,p){const m=c.morphTargetInfluences,_=f.morphAttributes.position||f.morphAttributes.normal||f.morphAttributes.color,y=_!==void 0?_.length:0;let g=r.get(f);if(g===void 0||g.count!==y){let X=function(){w.dispose(),r.delete(f),f.removeEventListener("dispose",X)};var S=X;g!==void 0&&g.texture.dispose();const E=f.morphAttributes.position!==void 0,A=f.morphAttributes.normal!==void 0,x=f.morphAttributes.color!==void 0,v=f.morphAttributes.position||[],C=f.morphAttributes.normal||[],U=f.morphAttributes.color||[];let R=0;E===!0&&(R=1),A===!0&&(R=2),x===!0&&(R=3);let G=f.attributes.position.count*R,D=1;G>e.maxTextureSize&&(D=Math.ceil(G/e.maxTextureSize),G=e.maxTextureSize);const V=new Float32Array(G*D*4*y),w=new kh(V,G,D,y);w.type=Hi,w.needsUpdate=!0;const I=R*4;for(let k=0;k<y;k++){const K=v[k],le=C[k],ue=U[k],W=G*D*4*k;for(let $=0;$<K.count;$++){const Y=$*I;E===!0&&(o.fromBufferAttribute(K,$),V[W+Y+0]=o.x,V[W+Y+1]=o.y,V[W+Y+2]=o.z,V[W+Y+3]=0),A===!0&&(o.fromBufferAttribute(le,$),V[W+Y+4]=o.x,V[W+Y+5]=o.y,V[W+Y+6]=o.z,V[W+Y+7]=0),x===!0&&(o.fromBufferAttribute(ue,$),V[W+Y+8]=o.x,V[W+Y+9]=o.y,V[W+Y+10]=o.z,V[W+Y+11]=ue.itemSize===4?o.w:1)}}g={count:y,texture:w,size:new vt(G,D)},r.set(f,g),f.addEventListener("dispose",X)}if(c.isInstancedMesh===!0&&c.morphTexture!==null)p.getUniforms().setValue(s,"morphTexture",c.morphTexture,t);else{let E=0;for(let x=0;x<m.length;x++)E+=m[x];const A=f.morphTargetsRelative?1:1-E;p.getUniforms().setValue(s,"morphTargetBaseInfluence",A),p.getUniforms().setValue(s,"morphTargetInfluences",m)}p.getUniforms().setValue(s,"morphTargetsTexture",g.texture,t),p.getUniforms().setValue(s,"morphTargetsTextureSize",g.size)}return{update:l}}function uE(s,e,t,r,o){let l=new WeakMap;function c(m){const _=o.render.frame,y=m.geometry,g=e.get(m,y);if(l.get(g)!==_&&(e.update(g),l.set(g,_)),m.isInstancedMesh&&(m.hasEventListener("dispose",p)===!1&&m.addEventListener("dispose",p),l.get(m)!==_&&(t.update(m.instanceMatrix,s.ARRAY_BUFFER),m.instanceColor!==null&&t.update(m.instanceColor,s.ARRAY_BUFFER),l.set(m,_))),m.isSkinnedMesh){const S=m.skeleton;l.get(S)!==_&&(S.update(),l.set(S,_))}return g}function f(){l=new WeakMap}function p(m){const _=m.target;_.removeEventListener("dispose",p),r.releaseStatesOfObject(_),t.remove(_.instanceMatrix),_.instanceColor!==null&&t.remove(_.instanceColor)}return{update:c,dispose:f}}const cE={[Th]:"LINEAR_TONE_MAPPING",[wh]:"REINHARD_TONE_MAPPING",[bh]:"CINEON_TONE_MAPPING",[Ah]:"ACES_FILMIC_TONE_MAPPING",[Ch]:"AGX_TONE_MAPPING",[Ph]:"NEUTRAL_TONE_MAPPING",[Rh]:"CUSTOM_TONE_MAPPING"};function dE(s,e,t,r,o){const l=new Xi(e,t,{type:s,depthBuffer:r,stencilBuffer:o,depthTexture:r?new Hs(e,t):void 0}),c=new Xi(e,t,{type:ur,depthBuffer:!1,stencilBuffer:!1}),f=new cn;f.setAttribute("position",new qt([-1,3,0,-1,-1,0,3,-1,0],3)),f.setAttribute("uv",new qt([0,2,0,0,2,0],2));const p=new M_({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),m=new ln(f,p),_=new Wc(-1,1,1,-1,0,1);let y=null,g=null,S=!1,E,A=null,x=[],v=!1;this.setSize=function(C,U){l.setSize(C,U),c.setSize(C,U);for(let R=0;R<x.length;R++){const G=x[R];G.setSize&&G.setSize(C,U)}},this.setEffects=function(C){x=C,v=x.length>0&&x[0].isRenderPass===!0;const U=l.width,R=l.height;for(let G=0;G<x.length;G++){const D=x[G];D.setSize&&D.setSize(U,R)}},this.begin=function(C,U){if(S||C.toneMapping===ji&&x.length===0)return!1;if(A=U,U!==null){const R=U.width,G=U.height;(l.width!==R||l.height!==G)&&this.setSize(R,G)}return v===!1&&C.setRenderTarget(l),E=C.toneMapping,C.toneMapping=ji,!0},this.hasRenderPass=function(){return v},this.end=function(C,U){C.toneMapping=E,S=!0;let R=l,G=c;for(let D=0;D<x.length;D++){const V=x[D];if(V.enabled!==!1&&(V.render(C,G,R,U),V.needsSwap!==!1)){const w=R;R=G,G=w}}if(y!==C.outputColorSpace||g!==C.toneMapping){y=C.outputColorSpace,g=C.toneMapping,p.defines={},Ct.getTransfer(y)===kt&&(p.defines.SRGB_TRANSFER="");const D=cE[g];D&&(p.defines[D]=""),p.needsUpdate=!0}p.uniforms.tDiffuse.value=R.texture,C.setRenderTarget(A),C.render(m,_),A=null,S=!1},this.isCompositing=function(){return S},this.dispose=function(){l.depthTexture&&l.depthTexture.dispose(),l.dispose(),c.dispose(),f.dispose(),p.dispose()}}const k_=new An,xh=new Hs(1,1),B_=new kh,V_=new f_,G_=new Hh,u0=[],c0=[],d0=new Float32Array(16),f0=new Float32Array(9),h0=new Float32Array(4);function Wa(s,e,t){const r=s[0];if(r<=0||r>0)return s;const o=e*t;let l=u0[o];if(l===void 0&&(l=new Float32Array(o),u0[o]=l),e!==0){r.toArray(l,0);for(let c=1,f=0;c!==e;++c)f+=t,s[c].toArray(l,f)}return l}function yn(s,e){if(s.length!==e.length)return!1;for(let t=0,r=s.length;t<r;t++)if(s[t]!==e[t])return!1;return!0}function Sn(s,e){for(let t=0,r=e.length;t<r;t++)s[t]=e[t]}function Xc(s,e){let t=c0[e];t===void 0&&(t=new Int32Array(e),c0[e]=t);for(let r=0;r!==e;++r)t[r]=s.allocateTextureUnit();return t}function fE(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function hE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yn(t,e))return;s.uniform2fv(this.addr,e),Sn(t,e)}}function pE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(yn(t,e))return;s.uniform3fv(this.addr,e),Sn(t,e)}}function mE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yn(t,e))return;s.uniform4fv(this.addr,e),Sn(t,e)}}function gE(s,e){const t=this.cache,r=e.elements;if(r===void 0){if(yn(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Sn(t,e)}else{if(yn(t,r))return;h0.set(r),s.uniformMatrix2fv(this.addr,!1,h0),Sn(t,r)}}function _E(s,e){const t=this.cache,r=e.elements;if(r===void 0){if(yn(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Sn(t,e)}else{if(yn(t,r))return;f0.set(r),s.uniformMatrix3fv(this.addr,!1,f0),Sn(t,r)}}function vE(s,e){const t=this.cache,r=e.elements;if(r===void 0){if(yn(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Sn(t,e)}else{if(yn(t,r))return;d0.set(r),s.uniformMatrix4fv(this.addr,!1,d0),Sn(t,r)}}function xE(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function yE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yn(t,e))return;s.uniform2iv(this.addr,e),Sn(t,e)}}function SE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(yn(t,e))return;s.uniform3iv(this.addr,e),Sn(t,e)}}function ME(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yn(t,e))return;s.uniform4iv(this.addr,e),Sn(t,e)}}function EE(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function TE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yn(t,e))return;s.uniform2uiv(this.addr,e),Sn(t,e)}}function wE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(yn(t,e))return;s.uniform3uiv(this.addr,e),Sn(t,e)}}function bE(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yn(t,e))return;s.uniform4uiv(this.addr,e),Sn(t,e)}}function AE(s,e,t){const r=this.cache,o=t.allocateTextureUnit();r[0]!==o&&(s.uniform1i(this.addr,o),r[0]=o);let l;this.type===s.SAMPLER_2D_SHADOW?(xh.compareFunction=t.isReversedDepthBuffer()?Uc:Ic,l=xh):l=k_,t.setTexture2D(e||l,o)}function RE(s,e,t){const r=this.cache,o=t.allocateTextureUnit();r[0]!==o&&(s.uniform1i(this.addr,o),r[0]=o),t.setTexture3D(e||V_,o)}function CE(s,e,t){const r=this.cache,o=t.allocateTextureUnit();r[0]!==o&&(s.uniform1i(this.addr,o),r[0]=o),t.setTextureCube(e||G_,o)}function PE(s,e,t){const r=this.cache,o=t.allocateTextureUnit();r[0]!==o&&(s.uniform1i(this.addr,o),r[0]=o),t.setTexture2DArray(e||B_,o)}function NE(s){switch(s){case 5126:return fE;case 35664:return hE;case 35665:return pE;case 35666:return mE;case 35674:return gE;case 35675:return _E;case 35676:return vE;case 5124:case 35670:return xE;case 35667:case 35671:return yE;case 35668:case 35672:return SE;case 35669:case 35673:return ME;case 5125:return EE;case 36294:return TE;case 36295:return wE;case 36296:return bE;case 35678:case 36198:case 36298:case 36306:case 35682:return AE;case 35679:case 36299:case 36307:return RE;case 35680:case 36300:case 36308:case 36293:return CE;case 36289:case 36303:case 36311:case 36292:return PE}}function LE(s,e){s.uniform1fv(this.addr,e)}function DE(s,e){const t=Wa(e,this.size,2);s.uniform2fv(this.addr,t)}function IE(s,e){const t=Wa(e,this.size,3);s.uniform3fv(this.addr,t)}function UE(s,e){const t=Wa(e,this.size,4);s.uniform4fv(this.addr,t)}function FE(s,e){const t=Wa(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function OE(s,e){const t=Wa(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function zE(s,e){const t=Wa(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function kE(s,e){s.uniform1iv(this.addr,e)}function BE(s,e){s.uniform2iv(this.addr,e)}function VE(s,e){s.uniform3iv(this.addr,e)}function GE(s,e){s.uniform4iv(this.addr,e)}function HE(s,e){s.uniform1uiv(this.addr,e)}function WE(s,e){s.uniform2uiv(this.addr,e)}function jE(s,e){s.uniform3uiv(this.addr,e)}function XE(s,e){s.uniform4uiv(this.addr,e)}function YE(s,e,t){const r=this.cache,o=e.length,l=Xc(t,o);yn(r,l)||(s.uniform1iv(this.addr,l),Sn(r,l));let c;this.type===s.SAMPLER_2D_SHADOW?c=xh:c=k_;for(let f=0;f!==o;++f)t.setTexture2D(e[f]||c,l[f])}function qE(s,e,t){const r=this.cache,o=e.length,l=Xc(t,o);yn(r,l)||(s.uniform1iv(this.addr,l),Sn(r,l));for(let c=0;c!==o;++c)t.setTexture3D(e[c]||V_,l[c])}function $E(s,e,t){const r=this.cache,o=e.length,l=Xc(t,o);yn(r,l)||(s.uniform1iv(this.addr,l),Sn(r,l));for(let c=0;c!==o;++c)t.setTextureCube(e[c]||G_,l[c])}function KE(s,e,t){const r=this.cache,o=e.length,l=Xc(t,o);yn(r,l)||(s.uniform1iv(this.addr,l),Sn(r,l));for(let c=0;c!==o;++c)t.setTexture2DArray(e[c]||B_,l[c])}function ZE(s){switch(s){case 5126:return LE;case 35664:return DE;case 35665:return IE;case 35666:return UE;case 35674:return FE;case 35675:return OE;case 35676:return zE;case 5124:case 35670:return kE;case 35667:case 35671:return BE;case 35668:case 35672:return VE;case 35669:case 35673:return GE;case 5125:return HE;case 36294:return WE;case 36295:return jE;case 36296:return XE;case 35678:case 36198:case 36298:case 36306:case 35682:return YE;case 35679:case 36299:case 36307:return qE;case 35680:case 36300:case 36308:case 36293:return $E;case 36289:case 36303:case 36311:case 36292:return KE}}class JE{constructor(e,t,r){this.id=e,this.addr=r,this.cache=[],this.type=t.type,this.setValue=NE(t.type)}}class QE{constructor(e,t,r){this.id=e,this.addr=r,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ZE(t.type)}}class e1{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,r){const o=this.seq;for(let l=0,c=o.length;l!==c;++l){const f=o[l];f.setValue(e,t[f.id],r)}}}const rh=/(\w+)(\])?(\[|\.)?/g;function p0(s,e){s.seq.push(e),s.map[e.id]=e}function t1(s,e,t){const r=s.name,o=r.length;for(rh.lastIndex=0;;){const l=rh.exec(r),c=rh.lastIndex;let f=l[1];const p=l[2]==="]",m=l[3];if(p&&(f=f|0),m===void 0||m==="["&&c+2===o){p0(t,m===void 0?new JE(f,s,e):new QE(f,s,e));break}else{let y=t.map[f];y===void 0&&(y=new e1(f),p0(t,y)),t=y}}}class Lu{constructor(e,t){this.seq=[],this.map={};const r=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let c=0;c<r;++c){const f=e.getActiveUniform(t,c),p=e.getUniformLocation(t,f.name);t1(f,p,this)}const o=[],l=[];for(const c of this.seq)c.type===e.SAMPLER_2D_SHADOW||c.type===e.SAMPLER_CUBE_SHADOW||c.type===e.SAMPLER_2D_ARRAY_SHADOW?o.push(c):l.push(c);o.length>0&&(this.seq=o.concat(l))}setValue(e,t,r,o){const l=this.map[t];l!==void 0&&l.setValue(e,r,o)}setOptional(e,t,r){const o=t[r];o!==void 0&&this.setValue(e,r,o)}static upload(e,t,r,o){for(let l=0,c=t.length;l!==c;++l){const f=t[l],p=r[f.id];p.needsUpdate!==!1&&f.setValue(e,p.value,o)}}static seqWithValue(e,t){const r=[];for(let o=0,l=e.length;o!==l;++o){const c=e[o];c.id in t&&r.push(c)}return r}}function m0(s,e,t){const r=s.createShader(e);return s.shaderSource(r,t),s.compileShader(r),r}const n1=37297;let i1=0;function r1(s,e){const t=s.split(`
`),r=[],o=Math.max(e-6,0),l=Math.min(e+6,t.length);for(let c=o;c<l;c++){const f=c+1;r.push(`${f===e?">":" "} ${f}: ${t[c]}`)}return r.join(`
`)}const g0=new gt;function s1(s){Ct._getMatrix(g0,Ct.workingColorSpace,s);const e=`mat3( ${g0.elements.map(t=>t.toFixed(4))} )`;switch(Ct.getTransfer(s)){case jo:return[e,"LinearTransferOETF"];case kt:return[e,"sRGBTransferOETF"];default:return ct("WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function _0(s,e,t){const r=s.getShaderParameter(e,s.COMPILE_STATUS),l=(s.getShaderInfoLog(e)||"").trim();if(r&&l==="")return"";const c=/ERROR: 0:(\d+)/.exec(l);if(c){const f=parseInt(c[1]);return t.toUpperCase()+`

`+l+`

`+r1(s.getShaderSource(e),f)}else return l}function a1(s,e){const t=s1(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const o1={[Th]:"Linear",[wh]:"Reinhard",[bh]:"Cineon",[Ah]:"ACESFilmic",[Ch]:"AgX",[Ph]:"Neutral",[Rh]:"Custom"};function l1(s,e){const t=o1[e];return t===void 0?(ct("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const bu=new Z;function u1(){Ct.getLuminanceCoefficients(bu);const s=bu.x.toFixed(4),e=bu.y.toFixed(4),t=bu.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function c1(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Fo).join(`
`)}function d1(s){const e=[];for(const t in s){const r=s[t];r!==!1&&e.push("#define "+t+" "+r)}return e.join(`
`)}function f1(s,e){const t={},r=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let o=0;o<r;o++){const l=s.getActiveAttrib(e,o),c=l.name;let f=1;l.type===s.FLOAT_MAT2&&(f=2),l.type===s.FLOAT_MAT3&&(f=3),l.type===s.FLOAT_MAT4&&(f=4),t[c]={type:l.type,location:s.getAttribLocation(e,c),locationSize:f}}return t}function Fo(s){return s!==""}function v0(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function x0(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const h1=/^[ \t]*#include +<([\w\d./]+)>/gm;function yh(s){return s.replace(h1,m1)}const p1=new Map;function m1(s,e){let t=yt[e];if(t===void 0){const r=p1.get(e);if(r!==void 0)t=yt[r],ct('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,r);else throw new Error("Can not resolve #include <"+e+">")}return yh(t)}const g1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function y0(s){return s.replace(g1,_1)}function _1(s,e,t,r){let o="";for(let l=parseInt(e);l<parseInt(t);l++)o+=r.replace(/\[\s*i\s*\]/g,"[ "+l+" ]").replace(/UNROLLED_LOOP_INDEX/g,l);return o}function S0(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const v1={[Oo]:"SHADOWMAP_TYPE_PCF",[Ia]:"SHADOWMAP_TYPE_VSM"};function x1(s){return v1[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const y1={[ds]:"ENVMAP_TYPE_CUBE",[Vs]:"ENVMAP_TYPE_CUBE",[Jo]:"ENVMAP_TYPE_CUBE_UV"};function S1(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":y1[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const M1={[Vs]:"ENVMAP_MODE_REFRACTION"};function E1(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":M1[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const T1={[Eh]:"ENVMAP_BLENDING_MULTIPLY",[Z0]:"ENVMAP_BLENDING_MIX",[J0]:"ENVMAP_BLENDING_ADD"};function w1(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":T1[s.combine]||"ENVMAP_BLENDING_NONE"}function b1(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,r=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:r,maxMip:t}}function A1(s,e,t,r){const o=s.getContext(),l=t.defines;let c=t.vertexShader,f=t.fragmentShader;const p=x1(t),m=S1(t),_=E1(t),y=w1(t),g=b1(t),S=c1(t),E=d1(l),A=o.createProgram();let x,v,C=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(x=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E].filter(Fo).join(`
`),x.length>0&&(x+=`
`),v=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E].filter(Fo).join(`
`),v.length>0&&(v+=`
`)):(x=[S0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+_:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+p:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Fo).join(`
`),v=[S0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+m:"",t.envMap?"#define "+_:"",t.envMap?"#define "+y:"",g?"#define CUBEUV_TEXEL_WIDTH "+g.texelWidth:"",g?"#define CUBEUV_TEXEL_HEIGHT "+g.texelHeight:"",g?"#define CUBEUV_MAX_MIP "+g.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+p:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ji?"#define TONE_MAPPING":"",t.toneMapping!==ji?yt.tonemapping_pars_fragment:"",t.toneMapping!==ji?l1("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",yt.colorspace_pars_fragment,a1("linearToOutputTexel",t.outputColorSpace),u1(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Fo).join(`
`)),c=yh(c),c=v0(c,t),c=x0(c,t),f=yh(f),f=v0(f,t),f=x0(f,t),c=y0(c),f=y0(f),t.isRawShaderMaterial!==!0&&(C=`#version 300 es
`,x=[S,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,v=["#define varying in",t.glslVersion===hh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===hh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);const U=C+x+c,R=C+v+f,G=m0(o,o.VERTEX_SHADER,U),D=m0(o,o.FRAGMENT_SHADER,R);o.attachShader(A,G),o.attachShader(A,D),t.index0AttributeName!==void 0?o.bindAttribLocation(A,0,t.index0AttributeName):t.morphTargets===!0&&o.bindAttribLocation(A,0,"position"),o.linkProgram(A);function V(k){if(s.debug.checkShaderErrors){const K=o.getProgramInfoLog(A)||"",le=o.getShaderInfoLog(G)||"",ue=o.getShaderInfoLog(D)||"",W=K.trim(),$=le.trim(),Y=ue.trim();let Q=!0,pe=!0;if(o.getProgramParameter(A,o.LINK_STATUS)===!1)if(Q=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(o,A,G,D);else{const me=_0(o,G,"vertex"),z=_0(o,D,"fragment");Rt("THREE.WebGLProgram: Shader Error "+o.getError()+" - VALIDATE_STATUS "+o.getProgramParameter(A,o.VALIDATE_STATUS)+`

Material Name: `+k.name+`
Material Type: `+k.type+`

Program Info Log: `+W+`
`+me+`
`+z)}else W!==""?ct("WebGLProgram: Program Info Log:",W):($===""||Y==="")&&(pe=!1);pe&&(k.diagnostics={runnable:Q,programLog:W,vertexShader:{log:$,prefix:x},fragmentShader:{log:Y,prefix:v}})}o.deleteShader(G),o.deleteShader(D),w=new Lu(o,A),I=f1(o,A)}let w;this.getUniforms=function(){return w===void 0&&V(this),w};let I;this.getAttributes=function(){return I===void 0&&V(this),I};let X=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return X===!1&&(X=o.getProgramParameter(A,n1)),X},this.destroy=function(){r.releaseStatesOfProgram(this),o.deleteProgram(A),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=i1++,this.cacheKey=e,this.usedTimes=1,this.program=A,this.vertexShader=G,this.fragmentShader=D,this}let R1=0;class C1{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,r=e.fragmentShader,o=this._getShaderStage(t),l=this._getShaderStage(r),c=this._getShaderCacheForMaterial(e);return c.has(o)===!1&&(c.add(o),o.usedTimes++),c.has(l)===!1&&(c.add(l),l.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const r of t)r.usedTimes--,r.usedTimes===0&&this.shaderCache.delete(r.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let r=t.get(e);return r===void 0&&(r=new Set,t.set(e,r)),r}_getShaderStage(e){const t=this.shaderCache;let r=t.get(e);return r===void 0&&(r=new P1(e),t.set(e,r)),r}}class P1{constructor(e){this.id=R1++,this.code=e,this.usedTimes=0}}function N1(s){return s===fs||s===Go||s===Ho}function L1(s,e,t,r,o,l){const c=new Oc,f=new C1,p=new Set,m=[],_=new Map,y=r.logarithmicDepthBuffer;let g=r.precision;const S={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function E(w){return p.add(w),w===0?"uv":`uv${w}`}function A(w,I,X,k,K,le){const ue=k.fog,W=K.geometry,$=w.isMeshStandardMaterial||w.isMeshLambertMaterial||w.isMeshPhongMaterial?k.environment:null,Y=w.isMeshStandardMaterial||w.isMeshLambertMaterial&&!w.envMap||w.isMeshPhongMaterial&&!w.envMap,Q=e.get(w.envMap||$,Y),pe=Q&&Q.mapping===Jo?Q.image.height:null,me=S[w.type];w.precision!==null&&(g=r.getMaxPrecision(w.precision),g!==w.precision&&ct("WebGLProgram.getParameters:",w.precision,"not supported, using",g,"instead."));const z=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,ne=z!==void 0?z.length:0;let Le=0;W.morphAttributes.position!==void 0&&(Le=1),W.morphAttributes.normal!==void 0&&(Le=2),W.morphAttributes.color!==void 0&&(Le=3);let We,ze,ce,Te;if(me){const ut=Vi[me];We=ut.vertexShader,ze=ut.fragmentShader}else We=w.vertexShader,ze=w.fragmentShader,f.update(w),ce=f.getVertexShaderID(w),Te=f.getFragmentShaderID(w);const ve=s.getRenderTarget(),Ve=s.state.buffers.depth.getReversed(),et=K.isInstancedMesh===!0,rt=K.isBatchedMesh===!0,Pt=!!w.map,ht=!!w.matcap,Et=!!Q,At=!!w.aoMap,Se=!!w.lightMap,Ce=!!w.bumpMap,He=!!w.normalMap,st=!!w.displacementMap,H=!!w.emissiveMap,xt=!!w.metalnessMap,dt=!!w.roughnessMap,Tt=w.anisotropy>0,Oe=w.clearcoat>0,Gt=w.dispersion>0,N=w.iridescence>0,M=w.sheen>0,ee=w.transmission>0,xe=Tt&&!!w.anisotropyMap,Ee=Oe&&!!w.clearcoatMap,Pe=Oe&&!!w.clearcoatNormalMap,Ie=Oe&&!!w.clearcoatRoughnessMap,_e=N&&!!w.iridescenceMap,L=N&&!!w.iridescenceThicknessMap,O=M&&!!w.sheenColorMap,ie=M&&!!w.sheenRoughnessMap,ae=!!w.specularMap,he=!!w.specularColorMap,Ue=!!w.specularIntensityMap,Ne=ee&&!!w.transmissionMap,Ye=ee&&!!w.thicknessMap,B=!!w.gradientMap,Me=!!w.alphaMap,ge=w.alphaTest>0,Be=!!w.alphaHash,be=!!w.extensions;let ye=ji;w.toneMapped&&(ve===null||ve.isXRRenderTarget===!0)&&(ye=s.toneMapping);const qe={shaderID:me,shaderType:w.type,shaderName:w.name,vertexShader:We,fragmentShader:ze,defines:w.defines,customVertexShaderID:ce,customFragmentShaderID:Te,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:g,batching:rt,batchingColor:rt&&K._colorsTexture!==null,instancing:et,instancingColor:et&&K.instanceColor!==null,instancingMorph:et&&K.morphTexture!==null,outputColorSpace:ve===null?s.outputColorSpace:ve.isXRRenderTarget===!0?ve.texture.colorSpace:Ct.workingColorSpace,alphaToCoverage:!!w.alphaToCoverage,map:Pt,matcap:ht,envMap:Et,envMapMode:Et&&Q.mapping,envMapCubeUVHeight:pe,aoMap:At,lightMap:Se,bumpMap:Ce,normalMap:He,displacementMap:st,emissiveMap:H,normalMapObjectSpace:He&&w.normalMapType===t_,normalMapTangentSpace:He&&w.normalMapType===Sc,packedNormalMap:He&&w.normalMapType===Sc&&N1(w.normalMap.format),metalnessMap:xt,roughnessMap:dt,anisotropy:Tt,anisotropyMap:xe,clearcoat:Oe,clearcoatMap:Ee,clearcoatNormalMap:Pe,clearcoatRoughnessMap:Ie,dispersion:Gt,iridescence:N,iridescenceMap:_e,iridescenceThicknessMap:L,sheen:M,sheenColorMap:O,sheenRoughnessMap:ie,specularMap:ae,specularColorMap:he,specularIntensityMap:Ue,transmission:ee,transmissionMap:Ne,thicknessMap:Ye,gradientMap:B,opaque:w.transparent===!1&&w.blending===ks&&w.alphaToCoverage===!1,alphaMap:Me,alphaTest:ge,alphaHash:Be,combine:w.combine,mapUv:Pt&&E(w.map.channel),aoMapUv:At&&E(w.aoMap.channel),lightMapUv:Se&&E(w.lightMap.channel),bumpMapUv:Ce&&E(w.bumpMap.channel),normalMapUv:He&&E(w.normalMap.channel),displacementMapUv:st&&E(w.displacementMap.channel),emissiveMapUv:H&&E(w.emissiveMap.channel),metalnessMapUv:xt&&E(w.metalnessMap.channel),roughnessMapUv:dt&&E(w.roughnessMap.channel),anisotropyMapUv:xe&&E(w.anisotropyMap.channel),clearcoatMapUv:Ee&&E(w.clearcoatMap.channel),clearcoatNormalMapUv:Pe&&E(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ie&&E(w.clearcoatRoughnessMap.channel),iridescenceMapUv:_e&&E(w.iridescenceMap.channel),iridescenceThicknessMapUv:L&&E(w.iridescenceThicknessMap.channel),sheenColorMapUv:O&&E(w.sheenColorMap.channel),sheenRoughnessMapUv:ie&&E(w.sheenRoughnessMap.channel),specularMapUv:ae&&E(w.specularMap.channel),specularColorMapUv:he&&E(w.specularColorMap.channel),specularIntensityMapUv:Ue&&E(w.specularIntensityMap.channel),transmissionMapUv:Ne&&E(w.transmissionMap.channel),thicknessMapUv:Ye&&E(w.thicknessMap.channel),alphaMapUv:Me&&E(w.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(He||Tt),vertexNormals:!!W.attributes.normal,vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:K.isPoints===!0&&!!W.attributes.uv&&(Pt||Me),fog:!!ue,useFog:w.fog===!0,fogExp2:!!ue&&ue.isFogExp2,flatShading:w.wireframe===!1&&(w.flatShading===!0||W.attributes.normal===void 0&&He===!1&&(w.isMeshLambertMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isMeshPhysicalMaterial)),sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:y,reversedDepthBuffer:Ve,skinning:K.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:ne,morphTextureStride:Le,numDirLights:I.directional.length,numPointLights:I.point.length,numSpotLights:I.spot.length,numSpotLightMaps:I.spotLightMap.length,numRectAreaLights:I.rectArea.length,numHemiLights:I.hemi.length,numDirLightShadows:I.directionalShadowMap.length,numPointLightShadows:I.pointShadowMap.length,numSpotLightShadows:I.spotShadowMap.length,numSpotLightShadowsWithMaps:I.numSpotLightShadowsWithMaps,numLightProbes:I.numLightProbes,numLightProbeGrids:le.length,numClippingPlanes:l.numPlanes,numClipIntersection:l.numIntersection,dithering:w.dithering,shadowMapEnabled:s.shadowMap.enabled&&X.length>0,shadowMapType:s.shadowMap.type,toneMapping:ye,decodeVideoTexture:Pt&&w.map.isVideoTexture===!0&&Ct.getTransfer(w.map.colorSpace)===kt,decodeVideoTextureEmissive:H&&w.emissiveMap.isVideoTexture===!0&&Ct.getTransfer(w.emissiveMap.colorSpace)===kt,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===sr,flipSided:w.side===Zn,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:be&&w.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(be&&w.extensions.multiDraw===!0||rt)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return qe.vertexUv1s=p.has(1),qe.vertexUv2s=p.has(2),qe.vertexUv3s=p.has(3),p.clear(),qe}function x(w){const I=[];if(w.shaderID?I.push(w.shaderID):(I.push(w.customVertexShaderID),I.push(w.customFragmentShaderID)),w.defines!==void 0)for(const X in w.defines)I.push(X),I.push(w.defines[X]);return w.isRawShaderMaterial===!1&&(v(I,w),C(I,w),I.push(s.outputColorSpace)),I.push(w.customProgramCacheKey),I.join()}function v(w,I){w.push(I.precision),w.push(I.outputColorSpace),w.push(I.envMapMode),w.push(I.envMapCubeUVHeight),w.push(I.mapUv),w.push(I.alphaMapUv),w.push(I.lightMapUv),w.push(I.aoMapUv),w.push(I.bumpMapUv),w.push(I.normalMapUv),w.push(I.displacementMapUv),w.push(I.emissiveMapUv),w.push(I.metalnessMapUv),w.push(I.roughnessMapUv),w.push(I.anisotropyMapUv),w.push(I.clearcoatMapUv),w.push(I.clearcoatNormalMapUv),w.push(I.clearcoatRoughnessMapUv),w.push(I.iridescenceMapUv),w.push(I.iridescenceThicknessMapUv),w.push(I.sheenColorMapUv),w.push(I.sheenRoughnessMapUv),w.push(I.specularMapUv),w.push(I.specularColorMapUv),w.push(I.specularIntensityMapUv),w.push(I.transmissionMapUv),w.push(I.thicknessMapUv),w.push(I.combine),w.push(I.fogExp2),w.push(I.sizeAttenuation),w.push(I.morphTargetsCount),w.push(I.morphAttributeCount),w.push(I.numDirLights),w.push(I.numPointLights),w.push(I.numSpotLights),w.push(I.numSpotLightMaps),w.push(I.numHemiLights),w.push(I.numRectAreaLights),w.push(I.numDirLightShadows),w.push(I.numPointLightShadows),w.push(I.numSpotLightShadows),w.push(I.numSpotLightShadowsWithMaps),w.push(I.numLightProbes),w.push(I.shadowMapType),w.push(I.toneMapping),w.push(I.numClippingPlanes),w.push(I.numClipIntersection),w.push(I.depthPacking)}function C(w,I){c.disableAll(),I.instancing&&c.enable(0),I.instancingColor&&c.enable(1),I.instancingMorph&&c.enable(2),I.matcap&&c.enable(3),I.envMap&&c.enable(4),I.normalMapObjectSpace&&c.enable(5),I.normalMapTangentSpace&&c.enable(6),I.clearcoat&&c.enable(7),I.iridescence&&c.enable(8),I.alphaTest&&c.enable(9),I.vertexColors&&c.enable(10),I.vertexAlphas&&c.enable(11),I.vertexUv1s&&c.enable(12),I.vertexUv2s&&c.enable(13),I.vertexUv3s&&c.enable(14),I.vertexTangents&&c.enable(15),I.anisotropy&&c.enable(16),I.alphaHash&&c.enable(17),I.batching&&c.enable(18),I.dispersion&&c.enable(19),I.batchingColor&&c.enable(20),I.gradientMap&&c.enable(21),I.packedNormalMap&&c.enable(22),I.vertexNormals&&c.enable(23),w.push(c.mask),c.disableAll(),I.fog&&c.enable(0),I.useFog&&c.enable(1),I.flatShading&&c.enable(2),I.logarithmicDepthBuffer&&c.enable(3),I.reversedDepthBuffer&&c.enable(4),I.skinning&&c.enable(5),I.morphTargets&&c.enable(6),I.morphNormals&&c.enable(7),I.morphColors&&c.enable(8),I.premultipliedAlpha&&c.enable(9),I.shadowMapEnabled&&c.enable(10),I.doubleSided&&c.enable(11),I.flipSided&&c.enable(12),I.useDepthPacking&&c.enable(13),I.dithering&&c.enable(14),I.transmission&&c.enable(15),I.sheen&&c.enable(16),I.opaque&&c.enable(17),I.pointsUvs&&c.enable(18),I.decodeVideoTexture&&c.enable(19),I.decodeVideoTextureEmissive&&c.enable(20),I.alphaToCoverage&&c.enable(21),I.numLightProbeGrids>0&&c.enable(22),w.push(c.mask)}function U(w){const I=S[w.type];let X;if(I){const k=Vi[I];X=S_.clone(k.uniforms)}else X=w.uniforms;return X}function R(w,I){let X=_.get(I);return X!==void 0?++X.usedTimes:(X=new A1(s,I,w,o),m.push(X),_.set(I,X)),X}function G(w){if(--w.usedTimes===0){const I=m.indexOf(w);m[I]=m[m.length-1],m.pop(),_.delete(w.cacheKey),w.destroy()}}function D(w){f.remove(w)}function V(){f.dispose()}return{getParameters:A,getProgramCacheKey:x,getUniforms:U,acquireProgram:R,releaseProgram:G,releaseShaderCache:D,programs:m,dispose:V}}function D1(){let s=new WeakMap;function e(c){return s.has(c)}function t(c){let f=s.get(c);return f===void 0&&(f={},s.set(c,f)),f}function r(c){s.delete(c)}function o(c,f,p){s.get(c)[f]=p}function l(){s=new WeakMap}return{has:e,get:t,remove:r,update:o,dispose:l}}function I1(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.materialVariant!==e.materialVariant?s.materialVariant-e.materialVariant:s.z!==e.z?s.z-e.z:s.id-e.id}function M0(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function E0(){const s=[];let e=0;const t=[],r=[],o=[];function l(){e=0,t.length=0,r.length=0,o.length=0}function c(g){let S=0;return g.isInstancedMesh&&(S+=2),g.isSkinnedMesh&&(S+=1),S}function f(g,S,E,A,x,v){let C=s[e];return C===void 0?(C={id:g.id,object:g,geometry:S,material:E,materialVariant:c(g),groupOrder:A,renderOrder:g.renderOrder,z:x,group:v},s[e]=C):(C.id=g.id,C.object=g,C.geometry=S,C.material=E,C.materialVariant=c(g),C.groupOrder=A,C.renderOrder=g.renderOrder,C.z=x,C.group=v),e++,C}function p(g,S,E,A,x,v){const C=f(g,S,E,A,x,v);E.transmission>0?r.push(C):E.transparent===!0?o.push(C):t.push(C)}function m(g,S,E,A,x,v){const C=f(g,S,E,A,x,v);E.transmission>0?r.unshift(C):E.transparent===!0?o.unshift(C):t.unshift(C)}function _(g,S){t.length>1&&t.sort(g||I1),r.length>1&&r.sort(S||M0),o.length>1&&o.sort(S||M0)}function y(){for(let g=e,S=s.length;g<S;g++){const E=s[g];if(E.id===null)break;E.id=null,E.object=null,E.geometry=null,E.material=null,E.group=null}}return{opaque:t,transmissive:r,transparent:o,init:l,push:p,unshift:m,finish:y,sort:_}}function U1(){let s=new WeakMap;function e(r,o){const l=s.get(r);let c;return l===void 0?(c=new E0,s.set(r,[c])):o>=l.length?(c=new E0,l.push(c)):c=l[o],c}function t(){s=new WeakMap}return{get:e,dispose:t}}function F1(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new Z,color:new St};break;case"SpotLight":t={position:new Z,direction:new Z,color:new St,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new Z,color:new St,distance:0,decay:0};break;case"HemisphereLight":t={direction:new Z,skyColor:new St,groundColor:new St};break;case"RectAreaLight":t={color:new St,position:new Z,halfWidth:new Z,halfHeight:new Z};break}return s[e.id]=t,t}}}function O1(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new vt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new vt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new vt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let z1=0;function k1(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function B1(s){const e=new F1,t=O1(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let m=0;m<9;m++)r.probe.push(new Z);const o=new Z,l=new Jt,c=new Jt;function f(m){let _=0,y=0,g=0;for(let I=0;I<9;I++)r.probe[I].set(0,0,0);let S=0,E=0,A=0,x=0,v=0,C=0,U=0,R=0,G=0,D=0,V=0;m.sort(k1);for(let I=0,X=m.length;I<X;I++){const k=m[I],K=k.color,le=k.intensity,ue=k.distance;let W=null;if(k.shadow&&k.shadow.map&&(k.shadow.map.texture.format===fs?W=k.shadow.map.texture:W=k.shadow.map.depthTexture||k.shadow.map.texture),k.isAmbientLight)_+=K.r*le,y+=K.g*le,g+=K.b*le;else if(k.isLightProbe){for(let $=0;$<9;$++)r.probe[$].addScaledVector(k.sh.coefficients[$],le);V++}else if(k.isDirectionalLight){const $=e.get(k);if($.color.copy(k.color).multiplyScalar(k.intensity),k.castShadow){const Y=k.shadow,Q=t.get(k);Q.shadowIntensity=Y.intensity,Q.shadowBias=Y.bias,Q.shadowNormalBias=Y.normalBias,Q.shadowRadius=Y.radius,Q.shadowMapSize=Y.mapSize,r.directionalShadow[S]=Q,r.directionalShadowMap[S]=W,r.directionalShadowMatrix[S]=k.shadow.matrix,C++}r.directional[S]=$,S++}else if(k.isSpotLight){const $=e.get(k);$.position.setFromMatrixPosition(k.matrixWorld),$.color.copy(K).multiplyScalar(le),$.distance=ue,$.coneCos=Math.cos(k.angle),$.penumbraCos=Math.cos(k.angle*(1-k.penumbra)),$.decay=k.decay,r.spot[A]=$;const Y=k.shadow;if(k.map&&(r.spotLightMap[G]=k.map,G++,Y.updateMatrices(k),k.castShadow&&D++),r.spotLightMatrix[A]=Y.matrix,k.castShadow){const Q=t.get(k);Q.shadowIntensity=Y.intensity,Q.shadowBias=Y.bias,Q.shadowNormalBias=Y.normalBias,Q.shadowRadius=Y.radius,Q.shadowMapSize=Y.mapSize,r.spotShadow[A]=Q,r.spotShadowMap[A]=W,R++}A++}else if(k.isRectAreaLight){const $=e.get(k);$.color.copy(K).multiplyScalar(le),$.halfWidth.set(k.width*.5,0,0),$.halfHeight.set(0,k.height*.5,0),r.rectArea[x]=$,x++}else if(k.isPointLight){const $=e.get(k);if($.color.copy(k.color).multiplyScalar(k.intensity),$.distance=k.distance,$.decay=k.decay,k.castShadow){const Y=k.shadow,Q=t.get(k);Q.shadowIntensity=Y.intensity,Q.shadowBias=Y.bias,Q.shadowNormalBias=Y.normalBias,Q.shadowRadius=Y.radius,Q.shadowMapSize=Y.mapSize,Q.shadowCameraNear=Y.camera.near,Q.shadowCameraFar=Y.camera.far,r.pointShadow[E]=Q,r.pointShadowMap[E]=W,r.pointShadowMatrix[E]=k.shadow.matrix,U++}r.point[E]=$,E++}else if(k.isHemisphereLight){const $=e.get(k);$.skyColor.copy(k.color).multiplyScalar(le),$.groundColor.copy(k.groundColor).multiplyScalar(le),r.hemi[v]=$,v++}}x>0&&(s.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=Ge.LTC_FLOAT_1,r.rectAreaLTC2=Ge.LTC_FLOAT_2):(r.rectAreaLTC1=Ge.LTC_HALF_1,r.rectAreaLTC2=Ge.LTC_HALF_2)),r.ambient[0]=_,r.ambient[1]=y,r.ambient[2]=g;const w=r.hash;(w.directionalLength!==S||w.pointLength!==E||w.spotLength!==A||w.rectAreaLength!==x||w.hemiLength!==v||w.numDirectionalShadows!==C||w.numPointShadows!==U||w.numSpotShadows!==R||w.numSpotMaps!==G||w.numLightProbes!==V)&&(r.directional.length=S,r.spot.length=A,r.rectArea.length=x,r.point.length=E,r.hemi.length=v,r.directionalShadow.length=C,r.directionalShadowMap.length=C,r.pointShadow.length=U,r.pointShadowMap.length=U,r.spotShadow.length=R,r.spotShadowMap.length=R,r.directionalShadowMatrix.length=C,r.pointShadowMatrix.length=U,r.spotLightMatrix.length=R+G-D,r.spotLightMap.length=G,r.numSpotLightShadowsWithMaps=D,r.numLightProbes=V,w.directionalLength=S,w.pointLength=E,w.spotLength=A,w.rectAreaLength=x,w.hemiLength=v,w.numDirectionalShadows=C,w.numPointShadows=U,w.numSpotShadows=R,w.numSpotMaps=G,w.numLightProbes=V,r.version=z1++)}function p(m,_){let y=0,g=0,S=0,E=0,A=0;const x=_.matrixWorldInverse;for(let v=0,C=m.length;v<C;v++){const U=m[v];if(U.isDirectionalLight){const R=r.directional[y];R.direction.setFromMatrixPosition(U.matrixWorld),o.setFromMatrixPosition(U.target.matrixWorld),R.direction.sub(o),R.direction.transformDirection(x),y++}else if(U.isSpotLight){const R=r.spot[S];R.position.setFromMatrixPosition(U.matrixWorld),R.position.applyMatrix4(x),R.direction.setFromMatrixPosition(U.matrixWorld),o.setFromMatrixPosition(U.target.matrixWorld),R.direction.sub(o),R.direction.transformDirection(x),S++}else if(U.isRectAreaLight){const R=r.rectArea[E];R.position.setFromMatrixPosition(U.matrixWorld),R.position.applyMatrix4(x),c.identity(),l.copy(U.matrixWorld),l.premultiply(x),c.extractRotation(l),R.halfWidth.set(U.width*.5,0,0),R.halfHeight.set(0,U.height*.5,0),R.halfWidth.applyMatrix4(c),R.halfHeight.applyMatrix4(c),E++}else if(U.isPointLight){const R=r.point[g];R.position.setFromMatrixPosition(U.matrixWorld),R.position.applyMatrix4(x),g++}else if(U.isHemisphereLight){const R=r.hemi[A];R.direction.setFromMatrixPosition(U.matrixWorld),R.direction.transformDirection(x),A++}}}return{setup:f,setupView:p,state:r}}function T0(s){const e=new B1(s),t=[],r=[],o=[];function l(g){y.camera=g,t.length=0,r.length=0,o.length=0}function c(g){t.push(g)}function f(g){r.push(g)}function p(g){o.push(g)}function m(){e.setup(t)}function _(g){e.setupView(t,g)}const y={lightsArray:t,shadowsArray:r,lightProbeGridArray:o,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:l,state:y,setupLights:m,setupLightsView:_,pushLight:c,pushShadow:f,pushLightProbeGrid:p}}function V1(s){let e=new WeakMap;function t(o,l=0){const c=e.get(o);let f;return c===void 0?(f=new T0(s),e.set(o,[f])):l>=c.length?(f=new T0(s),c.push(f)):f=c[l],f}function r(){e=new WeakMap}return{get:t,dispose:r}}const G1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,H1=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,W1=[new Z(1,0,0),new Z(-1,0,0),new Z(0,1,0),new Z(0,-1,0),new Z(0,0,1),new Z(0,0,-1)],j1=[new Z(0,-1,0),new Z(0,-1,0),new Z(0,0,1),new Z(0,0,-1),new Z(0,-1,0),new Z(0,-1,0)],w0=new Jt,Do=new Z,sh=new Z;function X1(s,e,t){let r=new Bc;const o=new vt,l=new vt,c=new rn,f=new E_,p=new T_,m={},_=t.maxTextureSize,y={[Pr]:Zn,[Zn]:Pr,[sr]:sr},g=new qi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new vt},radius:{value:4}},vertexShader:G1,fragmentShader:H1}),S=g.clone();S.defines.HORIZONTAL_PASS=1;const E=new cn;E.setAttribute("position",new Ri(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const A=new ln(E,g),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Oo;let v=this.type;this.render=function(D,V,w){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||D.length===0)return;this.type===L0&&(ct("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Oo);const I=s.getRenderTarget(),X=s.getActiveCubeFace(),k=s.getActiveMipmapLevel(),K=s.state;K.setBlending(lr),K.buffers.depth.getReversed()===!0?K.buffers.color.setClear(0,0,0,0):K.buffers.color.setClear(1,1,1,1),K.buffers.depth.setTest(!0),K.setScissorTest(!1);const le=v!==this.type;le&&V.traverse(function(ue){ue.material&&(Array.isArray(ue.material)?ue.material.forEach(W=>W.needsUpdate=!0):ue.material.needsUpdate=!0)});for(let ue=0,W=D.length;ue<W;ue++){const $=D[ue],Y=$.shadow;if(Y===void 0){ct("WebGLShadowMap:",$,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;o.copy(Y.mapSize);const Q=Y.getFrameExtents();o.multiply(Q),l.copy(Y.mapSize),(o.x>_||o.y>_)&&(o.x>_&&(l.x=Math.floor(_/Q.x),o.x=l.x*Q.x,Y.mapSize.x=l.x),o.y>_&&(l.y=Math.floor(_/Q.y),o.y=l.y*Q.y,Y.mapSize.y=l.y));const pe=s.state.buffers.depth.getReversed();if(Y.camera._reversedDepth=pe,Y.map===null||le===!0){if(Y.map!==null&&(Y.map.depthTexture!==null&&(Y.map.depthTexture.dispose(),Y.map.depthTexture=null),Y.map.dispose()),this.type===Ia){if($.isPointLight){ct("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}Y.map=new Xi(o.x,o.y,{format:fs,type:ur,minFilter:Ln,magFilter:Ln,generateMipmaps:!1}),Y.map.texture.name=$.name+".shadowMap",Y.map.depthTexture=new Hs(o.x,o.y,Hi),Y.map.depthTexture.name=$.name+".shadowMapDepth",Y.map.depthTexture.format=cr,Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=bn,Y.map.depthTexture.magFilter=bn}else $.isPointLight?(Y.map=new Yh(o.x),Y.map.depthTexture=new x_(o.x,Yi)):(Y.map=new Xi(o.x,o.y),Y.map.depthTexture=new Hs(o.x,o.y,Yi)),Y.map.depthTexture.name=$.name+".shadowMap",Y.map.depthTexture.format=cr,this.type===Oo?(Y.map.depthTexture.compareFunction=pe?Uc:Ic,Y.map.depthTexture.minFilter=Ln,Y.map.depthTexture.magFilter=Ln):(Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=bn,Y.map.depthTexture.magFilter=bn);Y.camera.updateProjectionMatrix()}const me=Y.map.isWebGLCubeRenderTarget?6:1;for(let z=0;z<me;z++){if(Y.map.isWebGLCubeRenderTarget)s.setRenderTarget(Y.map,z),s.clear();else{z===0&&(s.setRenderTarget(Y.map),s.clear());const ne=Y.getViewport(z);c.set(l.x*ne.x,l.y*ne.y,l.x*ne.z,l.y*ne.w),K.viewport(c)}if($.isPointLight){const ne=Y.camera,Le=Y.matrix,We=$.distance||ne.far;We!==ne.far&&(ne.far=We,ne.updateProjectionMatrix()),Do.setFromMatrixPosition($.matrixWorld),ne.position.copy(Do),sh.copy(ne.position),sh.add(W1[z]),ne.up.copy(j1[z]),ne.lookAt(sh),ne.updateMatrixWorld(),Le.makeTranslation(-Do.x,-Do.y,-Do.z),w0.multiplyMatrices(ne.projectionMatrix,ne.matrixWorldInverse),Y._frustum.setFromProjectionMatrix(w0,ne.coordinateSystem,ne.reversedDepth)}else Y.updateMatrices($);r=Y.getFrustum(),R(V,w,Y.camera,$,this.type)}Y.isPointLightShadow!==!0&&this.type===Ia&&C(Y,w),Y.needsUpdate=!1}v=this.type,x.needsUpdate=!1,s.setRenderTarget(I,X,k)};function C(D,V){const w=e.update(A);g.defines.VSM_SAMPLES!==D.blurSamples&&(g.defines.VSM_SAMPLES=D.blurSamples,S.defines.VSM_SAMPLES=D.blurSamples,g.needsUpdate=!0,S.needsUpdate=!0),D.mapPass===null&&(D.mapPass=new Xi(o.x,o.y,{format:fs,type:ur})),g.uniforms.shadow_pass.value=D.map.depthTexture,g.uniforms.resolution.value=D.mapSize,g.uniforms.radius.value=D.radius,s.setRenderTarget(D.mapPass),s.clear(),s.renderBufferDirect(V,null,w,g,A,null),S.uniforms.shadow_pass.value=D.mapPass.texture,S.uniforms.resolution.value=D.mapSize,S.uniforms.radius.value=D.radius,s.setRenderTarget(D.map),s.clear(),s.renderBufferDirect(V,null,w,S,A,null)}function U(D,V,w,I){let X=null;const k=w.isPointLight===!0?D.customDistanceMaterial:D.customDepthMaterial;if(k!==void 0)X=k;else if(X=w.isPointLight===!0?p:f,s.localClippingEnabled&&V.clipShadows===!0&&Array.isArray(V.clippingPlanes)&&V.clippingPlanes.length!==0||V.displacementMap&&V.displacementScale!==0||V.alphaMap&&V.alphaTest>0||V.map&&V.alphaTest>0||V.alphaToCoverage===!0){const K=X.uuid,le=V.uuid;let ue=m[K];ue===void 0&&(ue={},m[K]=ue);let W=ue[le];W===void 0&&(W=X.clone(),ue[le]=W,V.addEventListener("dispose",G)),X=W}if(X.visible=V.visible,X.wireframe=V.wireframe,I===Ia?X.side=V.shadowSide!==null?V.shadowSide:V.side:X.side=V.shadowSide!==null?V.shadowSide:y[V.side],X.alphaMap=V.alphaMap,X.alphaTest=V.alphaToCoverage===!0?.5:V.alphaTest,X.map=V.map,X.clipShadows=V.clipShadows,X.clippingPlanes=V.clippingPlanes,X.clipIntersection=V.clipIntersection,X.displacementMap=V.displacementMap,X.displacementScale=V.displacementScale,X.displacementBias=V.displacementBias,X.wireframeLinewidth=V.wireframeLinewidth,X.linewidth=V.linewidth,w.isPointLight===!0&&X.isMeshDistanceMaterial===!0){const K=s.properties.get(X);K.light=w}return X}function R(D,V,w,I,X){if(D.visible===!1)return;if(D.layers.test(V.layers)&&(D.isMesh||D.isLine||D.isPoints)&&(D.castShadow||D.receiveShadow&&X===Ia)&&(!D.frustumCulled||r.intersectsObject(D))){D.modelViewMatrix.multiplyMatrices(w.matrixWorldInverse,D.matrixWorld);const le=e.update(D),ue=D.material;if(Array.isArray(ue)){const W=le.groups;for(let $=0,Y=W.length;$<Y;$++){const Q=W[$],pe=ue[Q.materialIndex];if(pe&&pe.visible){const me=U(D,pe,I,X);D.onBeforeShadow(s,D,V,w,le,me,Q),s.renderBufferDirect(w,null,le,me,D,Q),D.onAfterShadow(s,D,V,w,le,me,Q)}}}else if(ue.visible){const W=U(D,ue,I,X);D.onBeforeShadow(s,D,V,w,le,W,null),s.renderBufferDirect(w,null,le,W,D,null),D.onAfterShadow(s,D,V,w,le,W,null)}}const K=D.children;for(let le=0,ue=K.length;le<ue;le++)R(K[le],V,w,I,X)}function G(D){D.target.removeEventListener("dispose",G);for(const w in m){const I=m[w],X=D.target.uuid;X in I&&(I[X].dispose(),delete I[X])}}}function Y1(s,e){function t(){let B=!1;const Me=new rn;let ge=null;const Be=new rn(0,0,0,0);return{setMask:function(be){ge!==be&&!B&&(s.colorMask(be,be,be,be),ge=be)},setLocked:function(be){B=be},setClear:function(be,ye,qe,ut,Ut){Ut===!0&&(be*=ut,ye*=ut,qe*=ut),Me.set(be,ye,qe,ut),Be.equals(Me)===!1&&(s.clearColor(be,ye,qe,ut),Be.copy(Me))},reset:function(){B=!1,ge=null,Be.set(-1,0,0,0)}}}function r(){let B=!1,Me=!1,ge=null,Be=null,be=null;return{setReversed:function(ye){if(Me!==ye){const qe=e.get("EXT_clip_control");ye?qe.clipControlEXT(qe.LOWER_LEFT_EXT,qe.ZERO_TO_ONE_EXT):qe.clipControlEXT(qe.LOWER_LEFT_EXT,qe.NEGATIVE_ONE_TO_ONE_EXT),Me=ye;const ut=be;be=null,this.setClear(ut)}},getReversed:function(){return Me},setTest:function(ye){ye?ve(s.DEPTH_TEST):Ve(s.DEPTH_TEST)},setMask:function(ye){ge!==ye&&!B&&(s.depthMask(ye),ge=ye)},setFunc:function(ye){if(Me&&(ye=Ox[ye]),Be!==ye){switch(ye){case Fu:s.depthFunc(s.NEVER);break;case Ou:s.depthFunc(s.ALWAYS);break;case zu:s.depthFunc(s.LESS);break;case Bs:s.depthFunc(s.LEQUAL);break;case ku:s.depthFunc(s.EQUAL);break;case Bu:s.depthFunc(s.GEQUAL);break;case Vu:s.depthFunc(s.GREATER);break;case Gu:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}Be=ye}},setLocked:function(ye){B=ye},setClear:function(ye){be!==ye&&(be=ye,Me&&(ye=1-ye),s.clearDepth(ye))},reset:function(){B=!1,ge=null,Be=null,be=null,Me=!1}}}function o(){let B=!1,Me=null,ge=null,Be=null,be=null,ye=null,qe=null,ut=null,Ut=null;return{setTest:function(Nt){B||(Nt?ve(s.STENCIL_TEST):Ve(s.STENCIL_TEST))},setMask:function(Nt){Me!==Nt&&!B&&(s.stencilMask(Nt),Me=Nt)},setFunc:function(Nt,dn,Vn){(ge!==Nt||Be!==dn||be!==Vn)&&(s.stencilFunc(Nt,dn,Vn),ge=Nt,Be=dn,be=Vn)},setOp:function(Nt,dn,Vn){(ye!==Nt||qe!==dn||ut!==Vn)&&(s.stencilOp(Nt,dn,Vn),ye=Nt,qe=dn,ut=Vn)},setLocked:function(Nt){B=Nt},setClear:function(Nt){Ut!==Nt&&(s.clearStencil(Nt),Ut=Nt)},reset:function(){B=!1,Me=null,ge=null,Be=null,be=null,ye=null,qe=null,ut=null,Ut=null}}}const l=new t,c=new r,f=new o,p=new WeakMap,m=new WeakMap;let _={},y={},g={},S=new WeakMap,E=[],A=null,x=!1,v=null,C=null,U=null,R=null,G=null,D=null,V=null,w=new St(0,0,0),I=0,X=!1,k=null,K=null,le=null,ue=null,W=null;const $=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Y=!1,Q=0;const pe=s.getParameter(s.VERSION);pe.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(pe)[1]),Y=Q>=1):pe.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(pe)[1]),Y=Q>=2);let me=null,z={};const ne=s.getParameter(s.SCISSOR_BOX),Le=s.getParameter(s.VIEWPORT),We=new rn().fromArray(ne),ze=new rn().fromArray(Le);function ce(B,Me,ge,Be){const be=new Uint8Array(4),ye=s.createTexture();s.bindTexture(B,ye),s.texParameteri(B,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(B,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let qe=0;qe<ge;qe++)B===s.TEXTURE_3D||B===s.TEXTURE_2D_ARRAY?s.texImage3D(Me,0,s.RGBA,1,1,Be,0,s.RGBA,s.UNSIGNED_BYTE,be):s.texImage2D(Me+qe,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,be);return ye}const Te={};Te[s.TEXTURE_2D]=ce(s.TEXTURE_2D,s.TEXTURE_2D,1),Te[s.TEXTURE_CUBE_MAP]=ce(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),Te[s.TEXTURE_2D_ARRAY]=ce(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Te[s.TEXTURE_3D]=ce(s.TEXTURE_3D,s.TEXTURE_3D,1,1),l.setClear(0,0,0,1),c.setClear(1),f.setClear(0),ve(s.DEPTH_TEST),c.setFunc(Bs),Ce(!1),He(lh),ve(s.CULL_FACE),At(lr);function ve(B){_[B]!==!0&&(s.enable(B),_[B]=!0)}function Ve(B){_[B]!==!1&&(s.disable(B),_[B]=!1)}function et(B,Me){return g[B]!==Me?(s.bindFramebuffer(B,Me),g[B]=Me,B===s.DRAW_FRAMEBUFFER&&(g[s.FRAMEBUFFER]=Me),B===s.FRAMEBUFFER&&(g[s.DRAW_FRAMEBUFFER]=Me),!0):!1}function rt(B,Me){let ge=E,Be=!1;if(B){ge=S.get(Me),ge===void 0&&(ge=[],S.set(Me,ge));const be=B.textures;if(ge.length!==be.length||ge[0]!==s.COLOR_ATTACHMENT0){for(let ye=0,qe=be.length;ye<qe;ye++)ge[ye]=s.COLOR_ATTACHMENT0+ye;ge.length=be.length,Be=!0}}else ge[0]!==s.BACK&&(ge[0]=s.BACK,Be=!0);Be&&s.drawBuffers(ge)}function Pt(B){return A!==B?(s.useProgram(B),A=B,!0):!1}const ht={[ss]:s.FUNC_ADD,[I0]:s.FUNC_SUBTRACT,[U0]:s.FUNC_REVERSE_SUBTRACT};ht[F0]=s.MIN,ht[O0]=s.MAX;const Et={[z0]:s.ZERO,[k0]:s.ONE,[B0]:s.SRC_COLOR,[Iu]:s.SRC_ALPHA,[X0]:s.SRC_ALPHA_SATURATE,[W0]:s.DST_COLOR,[G0]:s.DST_ALPHA,[V0]:s.ONE_MINUS_SRC_COLOR,[Uu]:s.ONE_MINUS_SRC_ALPHA,[j0]:s.ONE_MINUS_DST_COLOR,[H0]:s.ONE_MINUS_DST_ALPHA,[Y0]:s.CONSTANT_COLOR,[q0]:s.ONE_MINUS_CONSTANT_COLOR,[$0]:s.CONSTANT_ALPHA,[K0]:s.ONE_MINUS_CONSTANT_ALPHA};function At(B,Me,ge,Be,be,ye,qe,ut,Ut,Nt){if(B===lr){x===!0&&(Ve(s.BLEND),x=!1);return}if(x===!1&&(ve(s.BLEND),x=!0),B!==D0){if(B!==v||Nt!==X){if((C!==ss||G!==ss)&&(s.blendEquation(s.FUNC_ADD),C=ss,G=ss),Nt)switch(B){case ks:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case uh:s.blendFunc(s.ONE,s.ONE);break;case ch:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case dh:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:Rt("WebGLState: Invalid blending: ",B);break}else switch(B){case ks:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case uh:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case ch:Rt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case dh:Rt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Rt("WebGLState: Invalid blending: ",B);break}U=null,R=null,D=null,V=null,w.set(0,0,0),I=0,v=B,X=Nt}return}be=be||Me,ye=ye||ge,qe=qe||Be,(Me!==C||be!==G)&&(s.blendEquationSeparate(ht[Me],ht[be]),C=Me,G=be),(ge!==U||Be!==R||ye!==D||qe!==V)&&(s.blendFuncSeparate(Et[ge],Et[Be],Et[ye],Et[qe]),U=ge,R=Be,D=ye,V=qe),(ut.equals(w)===!1||Ut!==I)&&(s.blendColor(ut.r,ut.g,ut.b,Ut),w.copy(ut),I=Ut),v=B,X=!1}function Se(B,Me){B.side===sr?Ve(s.CULL_FACE):ve(s.CULL_FACE);let ge=B.side===Zn;Me&&(ge=!ge),Ce(ge),B.blending===ks&&B.transparent===!1?At(lr):At(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),c.setFunc(B.depthFunc),c.setTest(B.depthTest),c.setMask(B.depthWrite),l.setMask(B.colorWrite);const Be=B.stencilWrite;f.setTest(Be),Be&&(f.setMask(B.stencilWriteMask),f.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),f.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),H(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?ve(s.SAMPLE_ALPHA_TO_COVERAGE):Ve(s.SAMPLE_ALPHA_TO_COVERAGE)}function Ce(B){k!==B&&(B?s.frontFace(s.CW):s.frontFace(s.CCW),k=B)}function He(B){B!==P0?(ve(s.CULL_FACE),B!==K&&(B===lh?s.cullFace(s.BACK):B===N0?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Ve(s.CULL_FACE),K=B}function st(B){B!==le&&(Y&&s.lineWidth(B),le=B)}function H(B,Me,ge){B?(ve(s.POLYGON_OFFSET_FILL),(ue!==Me||W!==ge)&&(ue=Me,W=ge,c.getReversed()&&(Me=-Me),s.polygonOffset(Me,ge))):Ve(s.POLYGON_OFFSET_FILL)}function xt(B){B?ve(s.SCISSOR_TEST):Ve(s.SCISSOR_TEST)}function dt(B){B===void 0&&(B=s.TEXTURE0+$-1),me!==B&&(s.activeTexture(B),me=B)}function Tt(B,Me,ge){ge===void 0&&(me===null?ge=s.TEXTURE0+$-1:ge=me);let Be=z[ge];Be===void 0&&(Be={type:void 0,texture:void 0},z[ge]=Be),(Be.type!==B||Be.texture!==Me)&&(me!==ge&&(s.activeTexture(ge),me=ge),s.bindTexture(B,Me||Te[B]),Be.type=B,Be.texture=Me)}function Oe(){const B=z[me];B!==void 0&&B.type!==void 0&&(s.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function Gt(){try{s.compressedTexImage2D(...arguments)}catch(B){Rt("WebGLState:",B)}}function N(){try{s.compressedTexImage3D(...arguments)}catch(B){Rt("WebGLState:",B)}}function M(){try{s.texSubImage2D(...arguments)}catch(B){Rt("WebGLState:",B)}}function ee(){try{s.texSubImage3D(...arguments)}catch(B){Rt("WebGLState:",B)}}function xe(){try{s.compressedTexSubImage2D(...arguments)}catch(B){Rt("WebGLState:",B)}}function Ee(){try{s.compressedTexSubImage3D(...arguments)}catch(B){Rt("WebGLState:",B)}}function Pe(){try{s.texStorage2D(...arguments)}catch(B){Rt("WebGLState:",B)}}function Ie(){try{s.texStorage3D(...arguments)}catch(B){Rt("WebGLState:",B)}}function _e(){try{s.texImage2D(...arguments)}catch(B){Rt("WebGLState:",B)}}function L(){try{s.texImage3D(...arguments)}catch(B){Rt("WebGLState:",B)}}function O(B){return y[B]!==void 0?y[B]:s.getParameter(B)}function ie(B,Me){y[B]!==Me&&(s.pixelStorei(B,Me),y[B]=Me)}function ae(B){We.equals(B)===!1&&(s.scissor(B.x,B.y,B.z,B.w),We.copy(B))}function he(B){ze.equals(B)===!1&&(s.viewport(B.x,B.y,B.z,B.w),ze.copy(B))}function Ue(B,Me){let ge=m.get(Me);ge===void 0&&(ge=new WeakMap,m.set(Me,ge));let Be=ge.get(B);Be===void 0&&(Be=s.getUniformBlockIndex(Me,B.name),ge.set(B,Be))}function Ne(B,Me){const Be=m.get(Me).get(B);p.get(Me)!==Be&&(s.uniformBlockBinding(Me,Be,B.__bindingPointIndex),p.set(Me,Be))}function Ye(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),c.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),_={},y={},me=null,z={},g={},S=new WeakMap,E=[],A=null,x=!1,v=null,C=null,U=null,R=null,G=null,D=null,V=null,w=new St(0,0,0),I=0,X=!1,k=null,K=null,le=null,ue=null,W=null,We.set(0,0,s.canvas.width,s.canvas.height),ze.set(0,0,s.canvas.width,s.canvas.height),l.reset(),c.reset(),f.reset()}return{buffers:{color:l,depth:c,stencil:f},enable:ve,disable:Ve,bindFramebuffer:et,drawBuffers:rt,useProgram:Pt,setBlending:At,setMaterial:Se,setFlipSided:Ce,setCullFace:He,setLineWidth:st,setPolygonOffset:H,setScissorTest:xt,activeTexture:dt,bindTexture:Tt,unbindTexture:Oe,compressedTexImage2D:Gt,compressedTexImage3D:N,texImage2D:_e,texImage3D:L,pixelStorei:ie,getParameter:O,updateUBOMapping:Ue,uniformBlockBinding:Ne,texStorage2D:Pe,texStorage3D:Ie,texSubImage2D:M,texSubImage3D:ee,compressedTexSubImage2D:xe,compressedTexSubImage3D:Ee,scissor:ae,viewport:he,reset:Ye}}function q1(s,e,t,r,o,l,c){const f=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,p=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),m=new vt,_=new WeakMap,y=new Set;let g;const S=new WeakMap;let E=!1;try{E=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function A(N,M){return E?new OffscreenCanvas(N,M):Xo("canvas")}function x(N,M,ee){let xe=1;const Ee=Gt(N);if((Ee.width>ee||Ee.height>ee)&&(xe=ee/Math.max(Ee.width,Ee.height)),xe<1)if(typeof HTMLImageElement<"u"&&N instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&N instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&N instanceof ImageBitmap||typeof VideoFrame<"u"&&N instanceof VideoFrame){const Pe=Math.floor(xe*Ee.width),Ie=Math.floor(xe*Ee.height);g===void 0&&(g=A(Pe,Ie));const _e=M?A(Pe,Ie):g;return _e.width=Pe,_e.height=Ie,_e.getContext("2d").drawImage(N,0,0,Pe,Ie),ct("WebGLRenderer: Texture has been resized from ("+Ee.width+"x"+Ee.height+") to ("+Pe+"x"+Ie+")."),_e}else return"data"in N&&ct("WebGLRenderer: Image in DataTexture is too big ("+Ee.width+"x"+Ee.height+")."),N;return N}function v(N){return N.generateMipmaps}function C(N){s.generateMipmap(N)}function U(N){return N.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:N.isWebGL3DRenderTarget?s.TEXTURE_3D:N.isWebGLArrayRenderTarget||N.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function R(N,M,ee,xe,Ee,Pe=!1){if(N!==null){if(s[N]!==void 0)return s[N];ct("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+N+"'")}let Ie;xe&&(Ie=e.get("EXT_texture_norm16"),Ie||ct("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let _e=M;if(M===s.RED&&(ee===s.FLOAT&&(_e=s.R32F),ee===s.HALF_FLOAT&&(_e=s.R16F),ee===s.UNSIGNED_BYTE&&(_e=s.R8),ee===s.UNSIGNED_SHORT&&Ie&&(_e=Ie.R16_EXT),ee===s.SHORT&&Ie&&(_e=Ie.R16_SNORM_EXT)),M===s.RED_INTEGER&&(ee===s.UNSIGNED_BYTE&&(_e=s.R8UI),ee===s.UNSIGNED_SHORT&&(_e=s.R16UI),ee===s.UNSIGNED_INT&&(_e=s.R32UI),ee===s.BYTE&&(_e=s.R8I),ee===s.SHORT&&(_e=s.R16I),ee===s.INT&&(_e=s.R32I)),M===s.RG&&(ee===s.FLOAT&&(_e=s.RG32F),ee===s.HALF_FLOAT&&(_e=s.RG16F),ee===s.UNSIGNED_BYTE&&(_e=s.RG8),ee===s.UNSIGNED_SHORT&&Ie&&(_e=Ie.RG16_EXT),ee===s.SHORT&&Ie&&(_e=Ie.RG16_SNORM_EXT)),M===s.RG_INTEGER&&(ee===s.UNSIGNED_BYTE&&(_e=s.RG8UI),ee===s.UNSIGNED_SHORT&&(_e=s.RG16UI),ee===s.UNSIGNED_INT&&(_e=s.RG32UI),ee===s.BYTE&&(_e=s.RG8I),ee===s.SHORT&&(_e=s.RG16I),ee===s.INT&&(_e=s.RG32I)),M===s.RGB_INTEGER&&(ee===s.UNSIGNED_BYTE&&(_e=s.RGB8UI),ee===s.UNSIGNED_SHORT&&(_e=s.RGB16UI),ee===s.UNSIGNED_INT&&(_e=s.RGB32UI),ee===s.BYTE&&(_e=s.RGB8I),ee===s.SHORT&&(_e=s.RGB16I),ee===s.INT&&(_e=s.RGB32I)),M===s.RGBA_INTEGER&&(ee===s.UNSIGNED_BYTE&&(_e=s.RGBA8UI),ee===s.UNSIGNED_SHORT&&(_e=s.RGBA16UI),ee===s.UNSIGNED_INT&&(_e=s.RGBA32UI),ee===s.BYTE&&(_e=s.RGBA8I),ee===s.SHORT&&(_e=s.RGBA16I),ee===s.INT&&(_e=s.RGBA32I)),M===s.RGB&&(ee===s.UNSIGNED_SHORT&&Ie&&(_e=Ie.RGB16_EXT),ee===s.SHORT&&Ie&&(_e=Ie.RGB16_SNORM_EXT),ee===s.UNSIGNED_INT_5_9_9_9_REV&&(_e=s.RGB9_E5),ee===s.UNSIGNED_INT_10F_11F_11F_REV&&(_e=s.R11F_G11F_B10F)),M===s.RGBA){const L=Pe?jo:Ct.getTransfer(Ee);ee===s.FLOAT&&(_e=s.RGBA32F),ee===s.HALF_FLOAT&&(_e=s.RGBA16F),ee===s.UNSIGNED_BYTE&&(_e=L===kt?s.SRGB8_ALPHA8:s.RGBA8),ee===s.UNSIGNED_SHORT&&Ie&&(_e=Ie.RGBA16_EXT),ee===s.SHORT&&Ie&&(_e=Ie.RGBA16_SNORM_EXT),ee===s.UNSIGNED_SHORT_4_4_4_4&&(_e=s.RGBA4),ee===s.UNSIGNED_SHORT_5_5_5_1&&(_e=s.RGB5_A1)}return(_e===s.R16F||_e===s.R32F||_e===s.RG16F||_e===s.RG32F||_e===s.RGBA16F||_e===s.RGBA32F)&&e.get("EXT_color_buffer_float"),_e}function G(N,M){let ee;return N?M===null||M===Yi||M===ka?ee=s.DEPTH24_STENCIL8:M===Hi?ee=s.DEPTH32F_STENCIL8:M===za&&(ee=s.DEPTH24_STENCIL8,ct("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Yi||M===ka?ee=s.DEPTH_COMPONENT24:M===Hi?ee=s.DEPTH_COMPONENT32F:M===za&&(ee=s.DEPTH_COMPONENT16),ee}function D(N,M){return v(N)===!0||N.isFramebufferTexture&&N.minFilter!==bn&&N.minFilter!==Ln?Math.log2(Math.max(M.width,M.height))+1:N.mipmaps!==void 0&&N.mipmaps.length>0?N.mipmaps.length:N.isCompressedTexture&&Array.isArray(N.image)?M.mipmaps.length:1}function V(N){const M=N.target;M.removeEventListener("dispose",V),I(M),M.isVideoTexture&&_.delete(M),M.isHTMLTexture&&y.delete(M)}function w(N){const M=N.target;M.removeEventListener("dispose",w),k(M)}function I(N){const M=r.get(N);if(M.__webglInit===void 0)return;const ee=N.source,xe=S.get(ee);if(xe){const Ee=xe[M.__cacheKey];Ee.usedTimes--,Ee.usedTimes===0&&X(N),Object.keys(xe).length===0&&S.delete(ee)}r.remove(N)}function X(N){const M=r.get(N);s.deleteTexture(M.__webglTexture);const ee=N.source,xe=S.get(ee);delete xe[M.__cacheKey],c.memory.textures--}function k(N){const M=r.get(N);if(N.depthTexture&&(N.depthTexture.dispose(),r.remove(N.depthTexture)),N.isWebGLCubeRenderTarget)for(let xe=0;xe<6;xe++){if(Array.isArray(M.__webglFramebuffer[xe]))for(let Ee=0;Ee<M.__webglFramebuffer[xe].length;Ee++)s.deleteFramebuffer(M.__webglFramebuffer[xe][Ee]);else s.deleteFramebuffer(M.__webglFramebuffer[xe]);M.__webglDepthbuffer&&s.deleteRenderbuffer(M.__webglDepthbuffer[xe])}else{if(Array.isArray(M.__webglFramebuffer))for(let xe=0;xe<M.__webglFramebuffer.length;xe++)s.deleteFramebuffer(M.__webglFramebuffer[xe]);else s.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&s.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&s.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let xe=0;xe<M.__webglColorRenderbuffer.length;xe++)M.__webglColorRenderbuffer[xe]&&s.deleteRenderbuffer(M.__webglColorRenderbuffer[xe]);M.__webglDepthRenderbuffer&&s.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const ee=N.textures;for(let xe=0,Ee=ee.length;xe<Ee;xe++){const Pe=r.get(ee[xe]);Pe.__webglTexture&&(s.deleteTexture(Pe.__webglTexture),c.memory.textures--),r.remove(ee[xe])}r.remove(N)}let K=0;function le(){K=0}function ue(){return K}function W(N){K=N}function $(){const N=K;return N>=o.maxTextures&&ct("WebGLTextures: Trying to use "+N+" texture units while this GPU supports only "+o.maxTextures),K+=1,N}function Y(N){const M=[];return M.push(N.wrapS),M.push(N.wrapT),M.push(N.wrapR||0),M.push(N.magFilter),M.push(N.minFilter),M.push(N.anisotropy),M.push(N.internalFormat),M.push(N.format),M.push(N.type),M.push(N.generateMipmaps),M.push(N.premultiplyAlpha),M.push(N.flipY),M.push(N.unpackAlignment),M.push(N.colorSpace),M.join()}function Q(N,M){const ee=r.get(N);if(N.isVideoTexture&&Tt(N),N.isRenderTargetTexture===!1&&N.isExternalTexture!==!0&&N.version>0&&ee.__version!==N.version){const xe=N.image;if(xe===null)ct("WebGLRenderer: Texture marked for update but no image data found.");else if(xe.complete===!1)ct("WebGLRenderer: Texture marked for update but image is incomplete");else{Ve(ee,N,M);return}}else N.isExternalTexture&&(ee.__webglTexture=N.sourceTexture?N.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,ee.__webglTexture,s.TEXTURE0+M)}function pe(N,M){const ee=r.get(N);if(N.isRenderTargetTexture===!1&&N.version>0&&ee.__version!==N.version){Ve(ee,N,M);return}else N.isExternalTexture&&(ee.__webglTexture=N.sourceTexture?N.sourceTexture:null);t.bindTexture(s.TEXTURE_2D_ARRAY,ee.__webglTexture,s.TEXTURE0+M)}function me(N,M){const ee=r.get(N);if(N.isRenderTargetTexture===!1&&N.version>0&&ee.__version!==N.version){Ve(ee,N,M);return}t.bindTexture(s.TEXTURE_3D,ee.__webglTexture,s.TEXTURE0+M)}function z(N,M){const ee=r.get(N);if(N.isCubeDepthTexture!==!0&&N.version>0&&ee.__version!==N.version){et(ee,N,M);return}t.bindTexture(s.TEXTURE_CUBE_MAP,ee.__webglTexture,s.TEXTURE0+M)}const ne={[Hu]:s.REPEAT,[or]:s.CLAMP_TO_EDGE,[Wu]:s.MIRRORED_REPEAT},Le={[bn]:s.NEAREST,[Q0]:s.NEAREST_MIPMAP_NEAREST,[Uo]:s.NEAREST_MIPMAP_LINEAR,[Ln]:s.LINEAR,[Cu]:s.LINEAR_MIPMAP_NEAREST,[as]:s.LINEAR_MIPMAP_LINEAR},We={[n_]:s.NEVER,[o_]:s.ALWAYS,[i_]:s.LESS,[Ic]:s.LEQUAL,[r_]:s.EQUAL,[Uc]:s.GEQUAL,[s_]:s.GREATER,[a_]:s.NOTEQUAL};function ze(N,M){if(M.type===Hi&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===Ln||M.magFilter===Cu||M.magFilter===Uo||M.magFilter===as||M.minFilter===Ln||M.minFilter===Cu||M.minFilter===Uo||M.minFilter===as)&&ct("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(N,s.TEXTURE_WRAP_S,ne[M.wrapS]),s.texParameteri(N,s.TEXTURE_WRAP_T,ne[M.wrapT]),(N===s.TEXTURE_3D||N===s.TEXTURE_2D_ARRAY)&&s.texParameteri(N,s.TEXTURE_WRAP_R,ne[M.wrapR]),s.texParameteri(N,s.TEXTURE_MAG_FILTER,Le[M.magFilter]),s.texParameteri(N,s.TEXTURE_MIN_FILTER,Le[M.minFilter]),M.compareFunction&&(s.texParameteri(N,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(N,s.TEXTURE_COMPARE_FUNC,We[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===bn||M.minFilter!==Uo&&M.minFilter!==as||M.type===Hi&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||r.get(M).__currentAnisotropy){const ee=e.get("EXT_texture_filter_anisotropic");s.texParameterf(N,ee.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,o.getMaxAnisotropy())),r.get(M).__currentAnisotropy=M.anisotropy}}}function ce(N,M){let ee=!1;N.__webglInit===void 0&&(N.__webglInit=!0,M.addEventListener("dispose",V));const xe=M.source;let Ee=S.get(xe);Ee===void 0&&(Ee={},S.set(xe,Ee));const Pe=Y(M);if(Pe!==N.__cacheKey){Ee[Pe]===void 0&&(Ee[Pe]={texture:s.createTexture(),usedTimes:0},c.memory.textures++,ee=!0),Ee[Pe].usedTimes++;const Ie=Ee[N.__cacheKey];Ie!==void 0&&(Ee[N.__cacheKey].usedTimes--,Ie.usedTimes===0&&X(M)),N.__cacheKey=Pe,N.__webglTexture=Ee[Pe].texture}return ee}function Te(N,M,ee){return Math.floor(Math.floor(N/ee)/M)}function ve(N,M,ee,xe){const Pe=N.updateRanges;if(Pe.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,M.width,M.height,ee,xe,M.data);else{Pe.sort((ie,ae)=>ie.start-ae.start);let Ie=0;for(let ie=1;ie<Pe.length;ie++){const ae=Pe[Ie],he=Pe[ie],Ue=ae.start+ae.count,Ne=Te(he.start,M.width,4),Ye=Te(ae.start,M.width,4);he.start<=Ue+1&&Ne===Ye&&Te(he.start+he.count-1,M.width,4)===Ne?ae.count=Math.max(ae.count,he.start+he.count-ae.start):(++Ie,Pe[Ie]=he)}Pe.length=Ie+1;const _e=t.getParameter(s.UNPACK_ROW_LENGTH),L=t.getParameter(s.UNPACK_SKIP_PIXELS),O=t.getParameter(s.UNPACK_SKIP_ROWS);t.pixelStorei(s.UNPACK_ROW_LENGTH,M.width);for(let ie=0,ae=Pe.length;ie<ae;ie++){const he=Pe[ie],Ue=Math.floor(he.start/4),Ne=Math.ceil(he.count/4),Ye=Ue%M.width,B=Math.floor(Ue/M.width),Me=Ne,ge=1;t.pixelStorei(s.UNPACK_SKIP_PIXELS,Ye),t.pixelStorei(s.UNPACK_SKIP_ROWS,B),t.texSubImage2D(s.TEXTURE_2D,0,Ye,B,Me,ge,ee,xe,M.data)}N.clearUpdateRanges(),t.pixelStorei(s.UNPACK_ROW_LENGTH,_e),t.pixelStorei(s.UNPACK_SKIP_PIXELS,L),t.pixelStorei(s.UNPACK_SKIP_ROWS,O)}}function Ve(N,M,ee){let xe=s.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(xe=s.TEXTURE_2D_ARRAY),M.isData3DTexture&&(xe=s.TEXTURE_3D);const Ee=ce(N,M),Pe=M.source;t.bindTexture(xe,N.__webglTexture,s.TEXTURE0+ee);const Ie=r.get(Pe);if(Pe.version!==Ie.__version||Ee===!0){if(t.activeTexture(s.TEXTURE0+ee),(typeof ImageBitmap<"u"&&M.image instanceof ImageBitmap)===!1){const ge=Ct.getPrimaries(Ct.workingColorSpace),Be=M.colorSpace===br?null:Ct.getPrimaries(M.colorSpace),be=M.colorSpace===br||ge===Be?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,be)}t.pixelStorei(s.UNPACK_ALIGNMENT,M.unpackAlignment);let L=x(M.image,!1,o.maxTextureSize);L=Oe(M,L);const O=l.convert(M.format,M.colorSpace),ie=l.convert(M.type);let ae=R(M.internalFormat,O,ie,M.normalized,M.colorSpace,M.isVideoTexture);ze(xe,M);let he;const Ue=M.mipmaps,Ne=M.isVideoTexture!==!0,Ye=Ie.__version===void 0||Ee===!0,B=Pe.dataReady,Me=D(M,L);if(M.isDepthTexture)ae=G(M.format===os,M.type),Ye&&(Ne?t.texStorage2D(s.TEXTURE_2D,1,ae,L.width,L.height):t.texImage2D(s.TEXTURE_2D,0,ae,L.width,L.height,0,O,ie,null));else if(M.isDataTexture)if(Ue.length>0){Ne&&Ye&&t.texStorage2D(s.TEXTURE_2D,Me,ae,Ue[0].width,Ue[0].height);for(let ge=0,Be=Ue.length;ge<Be;ge++)he=Ue[ge],Ne?B&&t.texSubImage2D(s.TEXTURE_2D,ge,0,0,he.width,he.height,O,ie,he.data):t.texImage2D(s.TEXTURE_2D,ge,ae,he.width,he.height,0,O,ie,he.data);M.generateMipmaps=!1}else Ne?(Ye&&t.texStorage2D(s.TEXTURE_2D,Me,ae,L.width,L.height),B&&ve(M,L,O,ie)):t.texImage2D(s.TEXTURE_2D,0,ae,L.width,L.height,0,O,ie,L.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Ne&&Ye&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Me,ae,Ue[0].width,Ue[0].height,L.depth);for(let ge=0,Be=Ue.length;ge<Be;ge++)if(he=Ue[ge],M.format!==Ai)if(O!==null)if(Ne){if(B)if(M.layerUpdates.size>0){const be=i0(he.width,he.height,M.format,M.type);for(const ye of M.layerUpdates){const qe=he.data.subarray(ye*be/he.data.BYTES_PER_ELEMENT,(ye+1)*be/he.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ge,0,0,ye,he.width,he.height,1,O,qe)}M.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ge,0,0,0,he.width,he.height,L.depth,O,he.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,ge,ae,he.width,he.height,L.depth,0,he.data,0,0);else ct("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ne?B&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,ge,0,0,0,he.width,he.height,L.depth,O,ie,he.data):t.texImage3D(s.TEXTURE_2D_ARRAY,ge,ae,he.width,he.height,L.depth,0,O,ie,he.data)}else{Ne&&Ye&&t.texStorage2D(s.TEXTURE_2D,Me,ae,Ue[0].width,Ue[0].height);for(let ge=0,Be=Ue.length;ge<Be;ge++)he=Ue[ge],M.format!==Ai?O!==null?Ne?B&&t.compressedTexSubImage2D(s.TEXTURE_2D,ge,0,0,he.width,he.height,O,he.data):t.compressedTexImage2D(s.TEXTURE_2D,ge,ae,he.width,he.height,0,he.data):ct("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ne?B&&t.texSubImage2D(s.TEXTURE_2D,ge,0,0,he.width,he.height,O,ie,he.data):t.texImage2D(s.TEXTURE_2D,ge,ae,he.width,he.height,0,O,ie,he.data)}else if(M.isDataArrayTexture)if(Ne){if(Ye&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Me,ae,L.width,L.height,L.depth),B)if(M.layerUpdates.size>0){const ge=i0(L.width,L.height,M.format,M.type);for(const Be of M.layerUpdates){const be=L.data.subarray(Be*ge/L.data.BYTES_PER_ELEMENT,(Be+1)*ge/L.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,Be,L.width,L.height,1,O,ie,be)}M.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,L.width,L.height,L.depth,O,ie,L.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,ae,L.width,L.height,L.depth,0,O,ie,L.data);else if(M.isData3DTexture)Ne?(Ye&&t.texStorage3D(s.TEXTURE_3D,Me,ae,L.width,L.height,L.depth),B&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,L.width,L.height,L.depth,O,ie,L.data)):t.texImage3D(s.TEXTURE_3D,0,ae,L.width,L.height,L.depth,0,O,ie,L.data);else if(M.isFramebufferTexture){if(Ye)if(Ne)t.texStorage2D(s.TEXTURE_2D,Me,ae,L.width,L.height);else{let ge=L.width,Be=L.height;for(let be=0;be<Me;be++)t.texImage2D(s.TEXTURE_2D,be,ae,ge,Be,0,O,ie,null),ge>>=1,Be>>=1}}else if(M.isHTMLTexture){if("texElementImage2D"in s){const ge=s.canvas;if(ge.hasAttribute("layoutsubtree")||ge.setAttribute("layoutsubtree","true"),L.parentNode!==ge){ge.appendChild(L),y.add(M),ge.onpaint=ut=>{const Ut=ut.changedElements;for(const Nt of y)Ut.includes(Nt.image)&&(Nt.needsUpdate=!0)},ge.requestPaint();return}const Be=0,be=s.RGBA,ye=s.RGBA,qe=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,Be,be,ye,qe,L),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Ue.length>0){if(Ne&&Ye){const ge=Gt(Ue[0]);t.texStorage2D(s.TEXTURE_2D,Me,ae,ge.width,ge.height)}for(let ge=0,Be=Ue.length;ge<Be;ge++)he=Ue[ge],Ne?B&&t.texSubImage2D(s.TEXTURE_2D,ge,0,0,O,ie,he):t.texImage2D(s.TEXTURE_2D,ge,ae,O,ie,he);M.generateMipmaps=!1}else if(Ne){if(Ye){const ge=Gt(L);t.texStorage2D(s.TEXTURE_2D,Me,ae,ge.width,ge.height)}B&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,O,ie,L)}else t.texImage2D(s.TEXTURE_2D,0,ae,O,ie,L);v(M)&&C(xe),Ie.__version=Pe.version,M.onUpdate&&M.onUpdate(M)}N.__version=M.version}function et(N,M,ee){if(M.image.length!==6)return;const xe=ce(N,M),Ee=M.source;t.bindTexture(s.TEXTURE_CUBE_MAP,N.__webglTexture,s.TEXTURE0+ee);const Pe=r.get(Ee);if(Ee.version!==Pe.__version||xe===!0){t.activeTexture(s.TEXTURE0+ee);const Ie=Ct.getPrimaries(Ct.workingColorSpace),_e=M.colorSpace===br?null:Ct.getPrimaries(M.colorSpace),L=M.colorSpace===br||Ie===_e?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(s.UNPACK_ALIGNMENT,M.unpackAlignment),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,L);const O=M.isCompressedTexture||M.image[0].isCompressedTexture,ie=M.image[0]&&M.image[0].isDataTexture,ae=[];for(let ye=0;ye<6;ye++)!O&&!ie?ae[ye]=x(M.image[ye],!0,o.maxCubemapSize):ae[ye]=ie?M.image[ye].image:M.image[ye],ae[ye]=Oe(M,ae[ye]);const he=ae[0],Ue=l.convert(M.format,M.colorSpace),Ne=l.convert(M.type),Ye=R(M.internalFormat,Ue,Ne,M.normalized,M.colorSpace),B=M.isVideoTexture!==!0,Me=Pe.__version===void 0||xe===!0,ge=Ee.dataReady;let Be=D(M,he);ze(s.TEXTURE_CUBE_MAP,M);let be;if(O){B&&Me&&t.texStorage2D(s.TEXTURE_CUBE_MAP,Be,Ye,he.width,he.height);for(let ye=0;ye<6;ye++){be=ae[ye].mipmaps;for(let qe=0;qe<be.length;qe++){const ut=be[qe];M.format!==Ai?Ue!==null?B?ge&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,qe,0,0,ut.width,ut.height,Ue,ut.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,qe,Ye,ut.width,ut.height,0,ut.data):ct("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):B?ge&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,qe,0,0,ut.width,ut.height,Ue,Ne,ut.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,qe,Ye,ut.width,ut.height,0,Ue,Ne,ut.data)}}}else{if(be=M.mipmaps,B&&Me){be.length>0&&Be++;const ye=Gt(ae[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,Be,Ye,ye.width,ye.height)}for(let ye=0;ye<6;ye++)if(ie){B?ge&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,0,0,ae[ye].width,ae[ye].height,Ue,Ne,ae[ye].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,Ye,ae[ye].width,ae[ye].height,0,Ue,Ne,ae[ye].data);for(let qe=0;qe<be.length;qe++){const Ut=be[qe].image[ye].image;B?ge&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,qe+1,0,0,Ut.width,Ut.height,Ue,Ne,Ut.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,qe+1,Ye,Ut.width,Ut.height,0,Ue,Ne,Ut.data)}}else{B?ge&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,0,0,Ue,Ne,ae[ye]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,Ye,Ue,Ne,ae[ye]);for(let qe=0;qe<be.length;qe++){const ut=be[qe];B?ge&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,qe+1,0,0,Ue,Ne,ut.image[ye]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ye,qe+1,Ye,Ue,Ne,ut.image[ye])}}}v(M)&&C(s.TEXTURE_CUBE_MAP),Pe.__version=Ee.version,M.onUpdate&&M.onUpdate(M)}N.__version=M.version}function rt(N,M,ee,xe,Ee,Pe){const Ie=l.convert(ee.format,ee.colorSpace),_e=l.convert(ee.type),L=R(ee.internalFormat,Ie,_e,ee.normalized,ee.colorSpace),O=r.get(M),ie=r.get(ee);if(ie.__renderTarget=M,!O.__hasExternalTextures){const ae=Math.max(1,M.width>>Pe),he=Math.max(1,M.height>>Pe);Ee===s.TEXTURE_3D||Ee===s.TEXTURE_2D_ARRAY?t.texImage3D(Ee,Pe,L,ae,he,M.depth,0,Ie,_e,null):t.texImage2D(Ee,Pe,L,ae,he,0,Ie,_e,null)}t.bindFramebuffer(s.FRAMEBUFFER,N),dt(M)?f.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,xe,Ee,ie.__webglTexture,0,xt(M)):(Ee===s.TEXTURE_2D||Ee>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&Ee<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,xe,Ee,ie.__webglTexture,Pe),t.bindFramebuffer(s.FRAMEBUFFER,null)}function Pt(N,M,ee){if(s.bindRenderbuffer(s.RENDERBUFFER,N),M.depthBuffer){const xe=M.depthTexture,Ee=xe&&xe.isDepthTexture?xe.type:null,Pe=G(M.stencilBuffer,Ee),Ie=M.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;dt(M)?f.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,xt(M),Pe,M.width,M.height):ee?s.renderbufferStorageMultisample(s.RENDERBUFFER,xt(M),Pe,M.width,M.height):s.renderbufferStorage(s.RENDERBUFFER,Pe,M.width,M.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Ie,s.RENDERBUFFER,N)}else{const xe=M.textures;for(let Ee=0;Ee<xe.length;Ee++){const Pe=xe[Ee],Ie=l.convert(Pe.format,Pe.colorSpace),_e=l.convert(Pe.type),L=R(Pe.internalFormat,Ie,_e,Pe.normalized,Pe.colorSpace);dt(M)?f.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,xt(M),L,M.width,M.height):ee?s.renderbufferStorageMultisample(s.RENDERBUFFER,xt(M),L,M.width,M.height):s.renderbufferStorage(s.RENDERBUFFER,L,M.width,M.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function ht(N,M,ee){const xe=M.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(s.FRAMEBUFFER,N),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Ee=r.get(M.depthTexture);if(Ee.__renderTarget=M,(!Ee.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),xe){if(Ee.__webglInit===void 0&&(Ee.__webglInit=!0,M.depthTexture.addEventListener("dispose",V)),Ee.__webglTexture===void 0){Ee.__webglTexture=s.createTexture(),t.bindTexture(s.TEXTURE_CUBE_MAP,Ee.__webglTexture),ze(s.TEXTURE_CUBE_MAP,M.depthTexture);const O=l.convert(M.depthTexture.format),ie=l.convert(M.depthTexture.type);let ae;M.depthTexture.format===cr?ae=s.DEPTH_COMPONENT24:M.depthTexture.format===os&&(ae=s.DEPTH24_STENCIL8);for(let he=0;he<6;he++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,ae,M.width,M.height,0,O,ie,null)}}else Q(M.depthTexture,0);const Pe=Ee.__webglTexture,Ie=xt(M),_e=xe?s.TEXTURE_CUBE_MAP_POSITIVE_X+ee:s.TEXTURE_2D,L=M.depthTexture.format===os?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(M.depthTexture.format===cr)dt(M)?f.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,L,_e,Pe,0,Ie):s.framebufferTexture2D(s.FRAMEBUFFER,L,_e,Pe,0);else if(M.depthTexture.format===os)dt(M)?f.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,L,_e,Pe,0,Ie):s.framebufferTexture2D(s.FRAMEBUFFER,L,_e,Pe,0);else throw new Error("Unknown depthTexture format")}function Et(N){const M=r.get(N),ee=N.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==N.depthTexture){const xe=N.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),xe){const Ee=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,xe.removeEventListener("dispose",Ee)};xe.addEventListener("dispose",Ee),M.__depthDisposeCallback=Ee}M.__boundDepthTexture=xe}if(N.depthTexture&&!M.__autoAllocateDepthBuffer)if(ee)for(let xe=0;xe<6;xe++)ht(M.__webglFramebuffer[xe],N,xe);else{const xe=N.texture.mipmaps;xe&&xe.length>0?ht(M.__webglFramebuffer[0],N,0):ht(M.__webglFramebuffer,N,0)}else if(ee){M.__webglDepthbuffer=[];for(let xe=0;xe<6;xe++)if(t.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer[xe]),M.__webglDepthbuffer[xe]===void 0)M.__webglDepthbuffer[xe]=s.createRenderbuffer(),Pt(M.__webglDepthbuffer[xe],N,!1);else{const Ee=N.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Pe=M.__webglDepthbuffer[xe];s.bindRenderbuffer(s.RENDERBUFFER,Pe),s.framebufferRenderbuffer(s.FRAMEBUFFER,Ee,s.RENDERBUFFER,Pe)}}else{const xe=N.texture.mipmaps;if(xe&&xe.length>0?t.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=s.createRenderbuffer(),Pt(M.__webglDepthbuffer,N,!1);else{const Ee=N.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Pe=M.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,Pe),s.framebufferRenderbuffer(s.FRAMEBUFFER,Ee,s.RENDERBUFFER,Pe)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function At(N,M,ee){const xe=r.get(N);M!==void 0&&rt(xe.__webglFramebuffer,N,N.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),ee!==void 0&&Et(N)}function Se(N){const M=N.texture,ee=r.get(N),xe=r.get(M);N.addEventListener("dispose",w);const Ee=N.textures,Pe=N.isWebGLCubeRenderTarget===!0,Ie=Ee.length>1;if(Ie||(xe.__webglTexture===void 0&&(xe.__webglTexture=s.createTexture()),xe.__version=M.version,c.memory.textures++),Pe){ee.__webglFramebuffer=[];for(let _e=0;_e<6;_e++)if(M.mipmaps&&M.mipmaps.length>0){ee.__webglFramebuffer[_e]=[];for(let L=0;L<M.mipmaps.length;L++)ee.__webglFramebuffer[_e][L]=s.createFramebuffer()}else ee.__webglFramebuffer[_e]=s.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){ee.__webglFramebuffer=[];for(let _e=0;_e<M.mipmaps.length;_e++)ee.__webglFramebuffer[_e]=s.createFramebuffer()}else ee.__webglFramebuffer=s.createFramebuffer();if(Ie)for(let _e=0,L=Ee.length;_e<L;_e++){const O=r.get(Ee[_e]);O.__webglTexture===void 0&&(O.__webglTexture=s.createTexture(),c.memory.textures++)}if(N.samples>0&&dt(N)===!1){ee.__webglMultisampledFramebuffer=s.createFramebuffer(),ee.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,ee.__webglMultisampledFramebuffer);for(let _e=0;_e<Ee.length;_e++){const L=Ee[_e];ee.__webglColorRenderbuffer[_e]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,ee.__webglColorRenderbuffer[_e]);const O=l.convert(L.format,L.colorSpace),ie=l.convert(L.type),ae=R(L.internalFormat,O,ie,L.normalized,L.colorSpace,N.isXRRenderTarget===!0),he=xt(N);s.renderbufferStorageMultisample(s.RENDERBUFFER,he,ae,N.width,N.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+_e,s.RENDERBUFFER,ee.__webglColorRenderbuffer[_e])}s.bindRenderbuffer(s.RENDERBUFFER,null),N.depthBuffer&&(ee.__webglDepthRenderbuffer=s.createRenderbuffer(),Pt(ee.__webglDepthRenderbuffer,N,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Pe){t.bindTexture(s.TEXTURE_CUBE_MAP,xe.__webglTexture),ze(s.TEXTURE_CUBE_MAP,M);for(let _e=0;_e<6;_e++)if(M.mipmaps&&M.mipmaps.length>0)for(let L=0;L<M.mipmaps.length;L++)rt(ee.__webglFramebuffer[_e][L],N,M,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,L);else rt(ee.__webglFramebuffer[_e],N,M,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0);v(M)&&C(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ie){for(let _e=0,L=Ee.length;_e<L;_e++){const O=Ee[_e],ie=r.get(O);let ae=s.TEXTURE_2D;(N.isWebGL3DRenderTarget||N.isWebGLArrayRenderTarget)&&(ae=N.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ae,ie.__webglTexture),ze(ae,O),rt(ee.__webglFramebuffer,N,O,s.COLOR_ATTACHMENT0+_e,ae,0),v(O)&&C(ae)}t.unbindTexture()}else{let _e=s.TEXTURE_2D;if((N.isWebGL3DRenderTarget||N.isWebGLArrayRenderTarget)&&(_e=N.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(_e,xe.__webglTexture),ze(_e,M),M.mipmaps&&M.mipmaps.length>0)for(let L=0;L<M.mipmaps.length;L++)rt(ee.__webglFramebuffer[L],N,M,s.COLOR_ATTACHMENT0,_e,L);else rt(ee.__webglFramebuffer,N,M,s.COLOR_ATTACHMENT0,_e,0);v(M)&&C(_e),t.unbindTexture()}N.depthBuffer&&Et(N)}function Ce(N){const M=N.textures;for(let ee=0,xe=M.length;ee<xe;ee++){const Ee=M[ee];if(v(Ee)){const Pe=U(N),Ie=r.get(Ee).__webglTexture;t.bindTexture(Pe,Ie),C(Pe),t.unbindTexture()}}}const He=[],st=[];function H(N){if(N.samples>0){if(dt(N)===!1){const M=N.textures,ee=N.width,xe=N.height;let Ee=s.COLOR_BUFFER_BIT;const Pe=N.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Ie=r.get(N),_e=M.length>1;if(_e)for(let O=0;O<M.length;O++)t.bindFramebuffer(s.FRAMEBUFFER,Ie.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+O,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,Ie.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+O,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,Ie.__webglMultisampledFramebuffer);const L=N.texture.mipmaps;L&&L.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ie.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ie.__webglFramebuffer);for(let O=0;O<M.length;O++){if(N.resolveDepthBuffer&&(N.depthBuffer&&(Ee|=s.DEPTH_BUFFER_BIT),N.stencilBuffer&&N.resolveStencilBuffer&&(Ee|=s.STENCIL_BUFFER_BIT)),_e){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Ie.__webglColorRenderbuffer[O]);const ie=r.get(M[O]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,ie,0)}s.blitFramebuffer(0,0,ee,xe,0,0,ee,xe,Ee,s.NEAREST),p===!0&&(He.length=0,st.length=0,He.push(s.COLOR_ATTACHMENT0+O),N.depthBuffer&&N.resolveDepthBuffer===!1&&(He.push(Pe),st.push(Pe),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,st)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,He))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),_e)for(let O=0;O<M.length;O++){t.bindFramebuffer(s.FRAMEBUFFER,Ie.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+O,s.RENDERBUFFER,Ie.__webglColorRenderbuffer[O]);const ie=r.get(M[O]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,Ie.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+O,s.TEXTURE_2D,ie,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ie.__webglMultisampledFramebuffer)}else if(N.depthBuffer&&N.resolveDepthBuffer===!1&&p){const M=N.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[M])}}}function xt(N){return Math.min(o.maxSamples,N.samples)}function dt(N){const M=r.get(N);return N.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function Tt(N){const M=c.render.frame;_.get(N)!==M&&(_.set(N,M),N.update())}function Oe(N,M){const ee=N.colorSpace,xe=N.format,Ee=N.type;return N.isCompressedTexture===!0||N.isVideoTexture===!0||ee!==Wo&&ee!==br&&(Ct.getTransfer(ee)===kt?(xe!==Ai||Ee!==oi)&&ct("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Rt("WebGLTextures: Unsupported texture color space:",ee)),M}function Gt(N){return typeof HTMLImageElement<"u"&&N instanceof HTMLImageElement?(m.width=N.naturalWidth||N.width,m.height=N.naturalHeight||N.height):typeof VideoFrame<"u"&&N instanceof VideoFrame?(m.width=N.displayWidth,m.height=N.displayHeight):(m.width=N.width,m.height=N.height),m}this.allocateTextureUnit=$,this.resetTextureUnits=le,this.getTextureUnits=ue,this.setTextureUnits=W,this.setTexture2D=Q,this.setTexture2DArray=pe,this.setTexture3D=me,this.setTextureCube=z,this.rebindTextures=At,this.setupRenderTarget=Se,this.updateRenderTargetMipmap=Ce,this.updateMultisampleRenderTarget=H,this.setupDepthRenderbuffer=Et,this.setupFrameBufferTexture=rt,this.useMultisampledRTT=dt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function H_(s,e){function t(r,o=br){let l;const c=Ct.getTransfer(o);if(r===oi)return s.UNSIGNED_BYTE;if(r===Cc)return s.UNSIGNED_SHORT_4_4_4_4;if(r===Pc)return s.UNSIGNED_SHORT_5_5_5_1;if(r===Ih)return s.UNSIGNED_INT_5_9_9_9_REV;if(r===Uh)return s.UNSIGNED_INT_10F_11F_11F_REV;if(r===Lh)return s.BYTE;if(r===Dh)return s.SHORT;if(r===za)return s.UNSIGNED_SHORT;if(r===Rc)return s.INT;if(r===Yi)return s.UNSIGNED_INT;if(r===Hi)return s.FLOAT;if(r===ur)return s.HALF_FLOAT;if(r===Fh)return s.ALPHA;if(r===Oh)return s.RGB;if(r===Ai)return s.RGBA;if(r===cr)return s.DEPTH_COMPONENT;if(r===os)return s.DEPTH_STENCIL;if(r===zh)return s.RED;if(r===Nc)return s.RED_INTEGER;if(r===fs)return s.RG;if(r===Lc)return s.RG_INTEGER;if(r===Dc)return s.RGBA_INTEGER;if(r===zo||r===ko||r===Bo||r===Vo)if(c===kt)if(l=e.get("WEBGL_compressed_texture_s3tc_srgb"),l!==null){if(r===zo)return l.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===ko)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Bo)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Vo)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(l=e.get("WEBGL_compressed_texture_s3tc"),l!==null){if(r===zo)return l.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===ko)return l.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Bo)return l.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Vo)return l.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===ju||r===Xu||r===Yu||r===qu)if(l=e.get("WEBGL_compressed_texture_pvrtc"),l!==null){if(r===ju)return l.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Xu)return l.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Yu)return l.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===qu)return l.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===$u||r===Ku||r===Zu||r===Ju||r===Qu||r===Go||r===ec)if(l=e.get("WEBGL_compressed_texture_etc"),l!==null){if(r===$u||r===Ku)return c===kt?l.COMPRESSED_SRGB8_ETC2:l.COMPRESSED_RGB8_ETC2;if(r===Zu)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:l.COMPRESSED_RGBA8_ETC2_EAC;if(r===Ju)return l.COMPRESSED_R11_EAC;if(r===Qu)return l.COMPRESSED_SIGNED_R11_EAC;if(r===Go)return l.COMPRESSED_RG11_EAC;if(r===ec)return l.COMPRESSED_SIGNED_RG11_EAC}else return null;if(r===tc||r===nc||r===ic||r===rc||r===sc||r===ac||r===oc||r===lc||r===uc||r===cc||r===dc||r===fc||r===hc||r===pc)if(l=e.get("WEBGL_compressed_texture_astc"),l!==null){if(r===tc)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:l.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===nc)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:l.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===ic)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:l.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===rc)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:l.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===sc)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:l.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===ac)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:l.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===oc)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:l.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===lc)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:l.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===uc)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:l.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===cc)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:l.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===dc)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:l.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===fc)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:l.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===hc)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:l.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===pc)return c===kt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:l.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===mc||r===gc||r===_c)if(l=e.get("EXT_texture_compression_bptc"),l!==null){if(r===mc)return c===kt?l.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:l.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===gc)return l.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===_c)return l.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===vc||r===xc||r===Ho||r===yc)if(l=e.get("EXT_texture_compression_rgtc"),l!==null){if(r===vc)return l.COMPRESSED_RED_RGTC1_EXT;if(r===xc)return l.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Ho)return l.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===yc)return l.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===ka?s.UNSIGNED_INT_24_8:s[r]!==void 0?s[r]:null}return{convert:t}}const $1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,K1=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Z1{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const r=new Wh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,r=new qi({vertexShader:$1,fragmentShader:K1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ln(new Ws(20,20),r)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class J1 extends hs{constructor(e,t){super();const r=this;let o=null,l=1,c=null,f="local-floor",p=1,m=null,_=null,y=null,g=null,S=null,E=null;const A=typeof XRWebGLBinding<"u",x=new Z1,v={},C=t.getContextAttributes();let U=null,R=null;const G=[],D=[],V=new vt;let w=null;const I=new mi;I.viewport=new rn;const X=new mi;X.viewport=new rn;const k=[I,X],K=new L_;let le=null,ue=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ce){let Te=G[ce];return Te===void 0&&(Te=new Pu,G[ce]=Te),Te.getTargetRaySpace()},this.getControllerGrip=function(ce){let Te=G[ce];return Te===void 0&&(Te=new Pu,G[ce]=Te),Te.getGripSpace()},this.getHand=function(ce){let Te=G[ce];return Te===void 0&&(Te=new Pu,G[ce]=Te),Te.getHandSpace()};function W(ce){const Te=D.indexOf(ce.inputSource);if(Te===-1)return;const ve=G[Te];ve!==void 0&&(ve.update(ce.inputSource,ce.frame,m||c),ve.dispatchEvent({type:ce.type,data:ce.inputSource}))}function $(){o.removeEventListener("select",W),o.removeEventListener("selectstart",W),o.removeEventListener("selectend",W),o.removeEventListener("squeeze",W),o.removeEventListener("squeezestart",W),o.removeEventListener("squeezeend",W),o.removeEventListener("end",$),o.removeEventListener("inputsourceschange",Y);for(let ce=0;ce<G.length;ce++){const Te=D[ce];Te!==null&&(D[ce]=null,G[ce].disconnect(Te))}le=null,ue=null,x.reset();for(const ce in v)delete v[ce];e.setRenderTarget(U),S=null,g=null,y=null,o=null,R=null,ze.stop(),r.isPresenting=!1,e.setPixelRatio(w),e.setSize(V.width,V.height,!1),r.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ce){l=ce,r.isPresenting===!0&&ct("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ce){f=ce,r.isPresenting===!0&&ct("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return m||c},this.setReferenceSpace=function(ce){m=ce},this.getBaseLayer=function(){return g!==null?g:S},this.getBinding=function(){return y===null&&A&&(y=new XRWebGLBinding(o,t)),y},this.getFrame=function(){return E},this.getSession=function(){return o},this.setSession=async function(ce){if(o=ce,o!==null){if(U=e.getRenderTarget(),o.addEventListener("select",W),o.addEventListener("selectstart",W),o.addEventListener("selectend",W),o.addEventListener("squeeze",W),o.addEventListener("squeezestart",W),o.addEventListener("squeezeend",W),o.addEventListener("end",$),o.addEventListener("inputsourceschange",Y),C.xrCompatible!==!0&&await t.makeXRCompatible(),w=e.getPixelRatio(),e.getSize(V),A&&"createProjectionLayer"in XRWebGLBinding.prototype){let ve=null,Ve=null,et=null;C.depth&&(et=C.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ve=C.stencil?os:cr,Ve=C.stencil?ka:Yi);const rt={colorFormat:t.RGBA8,depthFormat:et,scaleFactor:l};y=this.getBinding(),g=y.createProjectionLayer(rt),o.updateRenderState({layers:[g]}),e.setPixelRatio(1),e.setSize(g.textureWidth,g.textureHeight,!1),R=new Xi(g.textureWidth,g.textureHeight,{format:Ai,type:oi,depthTexture:new Hs(g.textureWidth,g.textureHeight,Ve,void 0,void 0,void 0,void 0,void 0,void 0,ve),stencilBuffer:C.stencil,colorSpace:e.outputColorSpace,samples:C.antialias?4:0,resolveDepthBuffer:g.ignoreDepthValues===!1,resolveStencilBuffer:g.ignoreDepthValues===!1})}else{const ve={antialias:C.antialias,alpha:!0,depth:C.depth,stencil:C.stencil,framebufferScaleFactor:l};S=new XRWebGLLayer(o,t,ve),o.updateRenderState({baseLayer:S}),e.setPixelRatio(1),e.setSize(S.framebufferWidth,S.framebufferHeight,!1),R=new Xi(S.framebufferWidth,S.framebufferHeight,{format:Ai,type:oi,colorSpace:e.outputColorSpace,stencilBuffer:C.stencil,resolveDepthBuffer:S.ignoreDepthValues===!1,resolveStencilBuffer:S.ignoreDepthValues===!1})}R.isXRRenderTarget=!0,this.setFoveation(p),m=null,c=await o.requestReferenceSpace(f),ze.setContext(o),ze.start(),r.isPresenting=!0,r.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(o!==null)return o.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function Y(ce){for(let Te=0;Te<ce.removed.length;Te++){const ve=ce.removed[Te],Ve=D.indexOf(ve);Ve>=0&&(D[Ve]=null,G[Ve].disconnect(ve))}for(let Te=0;Te<ce.added.length;Te++){const ve=ce.added[Te];let Ve=D.indexOf(ve);if(Ve===-1){for(let rt=0;rt<G.length;rt++)if(rt>=D.length){D.push(ve),Ve=rt;break}else if(D[rt]===null){D[rt]=ve,Ve=rt;break}if(Ve===-1)break}const et=G[Ve];et&&et.connect(ve)}}const Q=new Z,pe=new Z;function me(ce,Te,ve){Q.setFromMatrixPosition(Te.matrixWorld),pe.setFromMatrixPosition(ve.matrixWorld);const Ve=Q.distanceTo(pe),et=Te.projectionMatrix.elements,rt=ve.projectionMatrix.elements,Pt=et[14]/(et[10]-1),ht=et[14]/(et[10]+1),Et=(et[9]+1)/et[5],At=(et[9]-1)/et[5],Se=(et[8]-1)/et[0],Ce=(rt[8]+1)/rt[0],He=Pt*Se,st=Pt*Ce,H=Ve/(-Se+Ce),xt=H*-Se;if(Te.matrixWorld.decompose(ce.position,ce.quaternion,ce.scale),ce.translateX(xt),ce.translateZ(H),ce.matrixWorld.compose(ce.position,ce.quaternion,ce.scale),ce.matrixWorldInverse.copy(ce.matrixWorld).invert(),et[10]===-1)ce.projectionMatrix.copy(Te.projectionMatrix),ce.projectionMatrixInverse.copy(Te.projectionMatrixInverse);else{const dt=Pt+H,Tt=ht+H,Oe=He-xt,Gt=st+(Ve-xt),N=Et*ht/Tt*dt,M=At*ht/Tt*dt;ce.projectionMatrix.makePerspective(Oe,Gt,N,M,dt,Tt),ce.projectionMatrixInverse.copy(ce.projectionMatrix).invert()}}function z(ce,Te){Te===null?ce.matrixWorld.copy(ce.matrix):ce.matrixWorld.multiplyMatrices(Te.matrixWorld,ce.matrix),ce.matrixWorldInverse.copy(ce.matrixWorld).invert()}this.updateCamera=function(ce){if(o===null)return;let Te=ce.near,ve=ce.far;x.texture!==null&&(x.depthNear>0&&(Te=x.depthNear),x.depthFar>0&&(ve=x.depthFar)),K.near=X.near=I.near=Te,K.far=X.far=I.far=ve,(le!==K.near||ue!==K.far)&&(o.updateRenderState({depthNear:K.near,depthFar:K.far}),le=K.near,ue=K.far),K.layers.mask=ce.layers.mask|6,I.layers.mask=K.layers.mask&-5,X.layers.mask=K.layers.mask&-3;const Ve=ce.parent,et=K.cameras;z(K,Ve);for(let rt=0;rt<et.length;rt++)z(et[rt],Ve);et.length===2?me(K,I,X):K.projectionMatrix.copy(I.projectionMatrix),ne(ce,K,Ve)};function ne(ce,Te,ve){ve===null?ce.matrix.copy(Te.matrixWorld):(ce.matrix.copy(ve.matrixWorld),ce.matrix.invert(),ce.matrix.multiply(Te.matrixWorld)),ce.matrix.decompose(ce.position,ce.quaternion,ce.scale),ce.updateMatrixWorld(!0),ce.projectionMatrix.copy(Te.projectionMatrix),ce.projectionMatrixInverse.copy(Te.projectionMatrixInverse),ce.isPerspectiveCamera&&(ce.fov=ph*2*Math.atan(1/ce.projectionMatrix.elements[5]),ce.zoom=1)}this.getCamera=function(){return K},this.getFoveation=function(){if(!(g===null&&S===null))return p},this.setFoveation=function(ce){p=ce,g!==null&&(g.fixedFoveation=ce),S!==null&&S.fixedFoveation!==void 0&&(S.fixedFoveation=ce)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(K)},this.getCameraTexture=function(ce){return v[ce]};let Le=null;function We(ce,Te){if(_=Te.getViewerPose(m||c),E=Te,_!==null){const ve=_.views;S!==null&&(e.setRenderTargetFramebuffer(R,S.framebuffer),e.setRenderTarget(R));let Ve=!1;ve.length!==K.cameras.length&&(K.cameras.length=0,Ve=!0);for(let ht=0;ht<ve.length;ht++){const Et=ve[ht];let At=null;if(S!==null)At=S.getViewport(Et);else{const Ce=y.getViewSubImage(g,Et);At=Ce.viewport,ht===0&&(e.setRenderTargetTextures(R,Ce.colorTexture,Ce.depthStencilTexture),e.setRenderTarget(R))}let Se=k[ht];Se===void 0&&(Se=new mi,Se.layers.enable(ht),Se.viewport=new rn,k[ht]=Se),Se.matrix.fromArray(Et.transform.matrix),Se.matrix.decompose(Se.position,Se.quaternion,Se.scale),Se.projectionMatrix.fromArray(Et.projectionMatrix),Se.projectionMatrixInverse.copy(Se.projectionMatrix).invert(),Se.viewport.set(At.x,At.y,At.width,At.height),ht===0&&(K.matrix.copy(Se.matrix),K.matrix.decompose(K.position,K.quaternion,K.scale)),Ve===!0&&K.cameras.push(Se)}const et=o.enabledFeatures;if(et&&et.includes("depth-sensing")&&o.depthUsage=="gpu-optimized"&&A){y=r.getBinding();const ht=y.getDepthInformation(ve[0]);ht&&ht.isValid&&ht.texture&&x.init(ht,o.renderState)}if(et&&et.includes("camera-access")&&A){e.state.unbindTexture(),y=r.getBinding();for(let ht=0;ht<ve.length;ht++){const Et=ve[ht].camera;if(Et){let At=v[Et];At||(At=new Wh,v[Et]=At);const Se=y.getCameraImage(Et);At.sourceTexture=Se}}}}for(let ve=0;ve<G.length;ve++){const Ve=D[ve],et=G[ve];Ve!==null&&et!==void 0&&et.update(Ve,Te,m||c)}Le&&Le(ce,Te),Te.detectedPlanes&&r.dispatchEvent({type:"planesdetected",data:Te}),E=null}const ze=new O_;ze.setAnimationLoop(We),this.setAnimationLoop=function(ce){Le=ce},this.dispose=function(){}}}const Q1=new Jt,W_=new gt;W_.set(-1,0,0,0,1,0,0,0,1);function eT(s,e){function t(x,v){x.matrixAutoUpdate===!0&&x.updateMatrix(),v.value.copy(x.matrix)}function r(x,v){v.color.getRGB(x.fogColor.value,y_(s)),v.isFog?(x.fogNear.value=v.near,x.fogFar.value=v.far):v.isFogExp2&&(x.fogDensity.value=v.density)}function o(x,v,C,U,R){v.isNodeMaterial?v.uniformsNeedUpdate=!1:v.isMeshBasicMaterial?l(x,v):v.isMeshLambertMaterial?(l(x,v),v.envMap&&(x.envMapIntensity.value=v.envMapIntensity)):v.isMeshToonMaterial?(l(x,v),y(x,v)):v.isMeshPhongMaterial?(l(x,v),_(x,v),v.envMap&&(x.envMapIntensity.value=v.envMapIntensity)):v.isMeshStandardMaterial?(l(x,v),g(x,v),v.isMeshPhysicalMaterial&&S(x,v,R)):v.isMeshMatcapMaterial?(l(x,v),E(x,v)):v.isMeshDepthMaterial?l(x,v):v.isMeshDistanceMaterial?(l(x,v),A(x,v)):v.isMeshNormalMaterial?l(x,v):v.isLineBasicMaterial?(c(x,v),v.isLineDashedMaterial&&f(x,v)):v.isPointsMaterial?p(x,v,C,U):v.isSpriteMaterial?m(x,v):v.isShadowMaterial?(x.color.value.copy(v.color),x.opacity.value=v.opacity):v.isShaderMaterial&&(v.uniformsNeedUpdate=!1)}function l(x,v){x.opacity.value=v.opacity,v.color&&x.diffuse.value.copy(v.color),v.emissive&&x.emissive.value.copy(v.emissive).multiplyScalar(v.emissiveIntensity),v.map&&(x.map.value=v.map,t(v.map,x.mapTransform)),v.alphaMap&&(x.alphaMap.value=v.alphaMap,t(v.alphaMap,x.alphaMapTransform)),v.bumpMap&&(x.bumpMap.value=v.bumpMap,t(v.bumpMap,x.bumpMapTransform),x.bumpScale.value=v.bumpScale,v.side===Zn&&(x.bumpScale.value*=-1)),v.normalMap&&(x.normalMap.value=v.normalMap,t(v.normalMap,x.normalMapTransform),x.normalScale.value.copy(v.normalScale),v.side===Zn&&x.normalScale.value.negate()),v.displacementMap&&(x.displacementMap.value=v.displacementMap,t(v.displacementMap,x.displacementMapTransform),x.displacementScale.value=v.displacementScale,x.displacementBias.value=v.displacementBias),v.emissiveMap&&(x.emissiveMap.value=v.emissiveMap,t(v.emissiveMap,x.emissiveMapTransform)),v.specularMap&&(x.specularMap.value=v.specularMap,t(v.specularMap,x.specularMapTransform)),v.alphaTest>0&&(x.alphaTest.value=v.alphaTest);const C=e.get(v),U=C.envMap,R=C.envMapRotation;U&&(x.envMap.value=U,x.envMapRotation.value.setFromMatrix4(Q1.makeRotationFromEuler(R)).transpose(),U.isCubeTexture&&U.isRenderTargetTexture===!1&&x.envMapRotation.value.premultiply(W_),x.reflectivity.value=v.reflectivity,x.ior.value=v.ior,x.refractionRatio.value=v.refractionRatio),v.lightMap&&(x.lightMap.value=v.lightMap,x.lightMapIntensity.value=v.lightMapIntensity,t(v.lightMap,x.lightMapTransform)),v.aoMap&&(x.aoMap.value=v.aoMap,x.aoMapIntensity.value=v.aoMapIntensity,t(v.aoMap,x.aoMapTransform))}function c(x,v){x.diffuse.value.copy(v.color),x.opacity.value=v.opacity,v.map&&(x.map.value=v.map,t(v.map,x.mapTransform))}function f(x,v){x.dashSize.value=v.dashSize,x.totalSize.value=v.dashSize+v.gapSize,x.scale.value=v.scale}function p(x,v,C,U){x.diffuse.value.copy(v.color),x.opacity.value=v.opacity,x.size.value=v.size*C,x.scale.value=U*.5,v.map&&(x.map.value=v.map,t(v.map,x.uvTransform)),v.alphaMap&&(x.alphaMap.value=v.alphaMap,t(v.alphaMap,x.alphaMapTransform)),v.alphaTest>0&&(x.alphaTest.value=v.alphaTest)}function m(x,v){x.diffuse.value.copy(v.color),x.opacity.value=v.opacity,x.rotation.value=v.rotation,v.map&&(x.map.value=v.map,t(v.map,x.mapTransform)),v.alphaMap&&(x.alphaMap.value=v.alphaMap,t(v.alphaMap,x.alphaMapTransform)),v.alphaTest>0&&(x.alphaTest.value=v.alphaTest)}function _(x,v){x.specular.value.copy(v.specular),x.shininess.value=Math.max(v.shininess,1e-4)}function y(x,v){v.gradientMap&&(x.gradientMap.value=v.gradientMap)}function g(x,v){x.metalness.value=v.metalness,v.metalnessMap&&(x.metalnessMap.value=v.metalnessMap,t(v.metalnessMap,x.metalnessMapTransform)),x.roughness.value=v.roughness,v.roughnessMap&&(x.roughnessMap.value=v.roughnessMap,t(v.roughnessMap,x.roughnessMapTransform)),v.envMap&&(x.envMapIntensity.value=v.envMapIntensity)}function S(x,v,C){x.ior.value=v.ior,v.sheen>0&&(x.sheenColor.value.copy(v.sheenColor).multiplyScalar(v.sheen),x.sheenRoughness.value=v.sheenRoughness,v.sheenColorMap&&(x.sheenColorMap.value=v.sheenColorMap,t(v.sheenColorMap,x.sheenColorMapTransform)),v.sheenRoughnessMap&&(x.sheenRoughnessMap.value=v.sheenRoughnessMap,t(v.sheenRoughnessMap,x.sheenRoughnessMapTransform))),v.clearcoat>0&&(x.clearcoat.value=v.clearcoat,x.clearcoatRoughness.value=v.clearcoatRoughness,v.clearcoatMap&&(x.clearcoatMap.value=v.clearcoatMap,t(v.clearcoatMap,x.clearcoatMapTransform)),v.clearcoatRoughnessMap&&(x.clearcoatRoughnessMap.value=v.clearcoatRoughnessMap,t(v.clearcoatRoughnessMap,x.clearcoatRoughnessMapTransform)),v.clearcoatNormalMap&&(x.clearcoatNormalMap.value=v.clearcoatNormalMap,t(v.clearcoatNormalMap,x.clearcoatNormalMapTransform),x.clearcoatNormalScale.value.copy(v.clearcoatNormalScale),v.side===Zn&&x.clearcoatNormalScale.value.negate())),v.dispersion>0&&(x.dispersion.value=v.dispersion),v.iridescence>0&&(x.iridescence.value=v.iridescence,x.iridescenceIOR.value=v.iridescenceIOR,x.iridescenceThicknessMinimum.value=v.iridescenceThicknessRange[0],x.iridescenceThicknessMaximum.value=v.iridescenceThicknessRange[1],v.iridescenceMap&&(x.iridescenceMap.value=v.iridescenceMap,t(v.iridescenceMap,x.iridescenceMapTransform)),v.iridescenceThicknessMap&&(x.iridescenceThicknessMap.value=v.iridescenceThicknessMap,t(v.iridescenceThicknessMap,x.iridescenceThicknessMapTransform))),v.transmission>0&&(x.transmission.value=v.transmission,x.transmissionSamplerMap.value=C.texture,x.transmissionSamplerSize.value.set(C.width,C.height),v.transmissionMap&&(x.transmissionMap.value=v.transmissionMap,t(v.transmissionMap,x.transmissionMapTransform)),x.thickness.value=v.thickness,v.thicknessMap&&(x.thicknessMap.value=v.thicknessMap,t(v.thicknessMap,x.thicknessMapTransform)),x.attenuationDistance.value=v.attenuationDistance,x.attenuationColor.value.copy(v.attenuationColor)),v.anisotropy>0&&(x.anisotropyVector.value.set(v.anisotropy*Math.cos(v.anisotropyRotation),v.anisotropy*Math.sin(v.anisotropyRotation)),v.anisotropyMap&&(x.anisotropyMap.value=v.anisotropyMap,t(v.anisotropyMap,x.anisotropyMapTransform))),x.specularIntensity.value=v.specularIntensity,x.specularColor.value.copy(v.specularColor),v.specularColorMap&&(x.specularColorMap.value=v.specularColorMap,t(v.specularColorMap,x.specularColorMapTransform)),v.specularIntensityMap&&(x.specularIntensityMap.value=v.specularIntensityMap,t(v.specularIntensityMap,x.specularIntensityMapTransform))}function E(x,v){v.matcap&&(x.matcap.value=v.matcap)}function A(x,v){const C=e.get(v).light;x.referencePosition.value.setFromMatrixPosition(C.matrixWorld),x.nearDistance.value=C.shadow.camera.near,x.farDistance.value=C.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:o}}function tT(s,e,t,r){let o={},l={},c=[];const f=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function p(C,U){const R=U.program;r.uniformBlockBinding(C,R)}function m(C,U){let R=o[C.id];R===void 0&&(E(C),R=_(C),o[C.id]=R,C.addEventListener("dispose",x));const G=U.program;r.updateUBOMapping(C,G);const D=e.render.frame;l[C.id]!==D&&(g(C),l[C.id]=D)}function _(C){const U=y();C.__bindingPointIndex=U;const R=s.createBuffer(),G=C.__size,D=C.usage;return s.bindBuffer(s.UNIFORM_BUFFER,R),s.bufferData(s.UNIFORM_BUFFER,G,D),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,U,R),R}function y(){for(let C=0;C<f;C++)if(c.indexOf(C)===-1)return c.push(C),C;return Rt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function g(C){const U=o[C.id],R=C.uniforms,G=C.__cache;s.bindBuffer(s.UNIFORM_BUFFER,U);for(let D=0,V=R.length;D<V;D++){const w=Array.isArray(R[D])?R[D]:[R[D]];for(let I=0,X=w.length;I<X;I++){const k=w[I];if(S(k,D,I,G)===!0){const K=k.__offset,le=Array.isArray(k.value)?k.value:[k.value];let ue=0;for(let W=0;W<le.length;W++){const $=le[W],Y=A($);typeof $=="number"||typeof $=="boolean"?(k.__data[0]=$,s.bufferSubData(s.UNIFORM_BUFFER,K+ue,k.__data)):$.isMatrix3?(k.__data[0]=$.elements[0],k.__data[1]=$.elements[1],k.__data[2]=$.elements[2],k.__data[3]=0,k.__data[4]=$.elements[3],k.__data[5]=$.elements[4],k.__data[6]=$.elements[5],k.__data[7]=0,k.__data[8]=$.elements[6],k.__data[9]=$.elements[7],k.__data[10]=$.elements[8],k.__data[11]=0):ArrayBuffer.isView($)?k.__data.set(new $.constructor($.buffer,$.byteOffset,k.__data.length)):($.toArray(k.__data,ue),ue+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,K,k.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function S(C,U,R,G){const D=C.value,V=U+"_"+R;if(G[V]===void 0)return typeof D=="number"||typeof D=="boolean"?G[V]=D:ArrayBuffer.isView(D)?G[V]=D.slice():G[V]=D.clone(),!0;{const w=G[V];if(typeof D=="number"||typeof D=="boolean"){if(w!==D)return G[V]=D,!0}else{if(ArrayBuffer.isView(D))return!0;if(w.equals(D)===!1)return w.copy(D),!0}}return!1}function E(C){const U=C.uniforms;let R=0;const G=16;for(let V=0,w=U.length;V<w;V++){const I=Array.isArray(U[V])?U[V]:[U[V]];for(let X=0,k=I.length;X<k;X++){const K=I[X],le=Array.isArray(K.value)?K.value:[K.value];for(let ue=0,W=le.length;ue<W;ue++){const $=le[ue],Y=A($),Q=R%G,pe=Q%Y.boundary,me=Q+pe;R+=pe,me!==0&&G-me<Y.storage&&(R+=G-me),K.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),K.__offset=R,R+=Y.storage}}}const D=R%G;return D>0&&(R+=G-D),C.__size=R,C.__cache={},this}function A(C){const U={boundary:0,storage:0};return typeof C=="number"||typeof C=="boolean"?(U.boundary=4,U.storage=4):C.isVector2?(U.boundary=8,U.storage=8):C.isVector3||C.isColor?(U.boundary=16,U.storage=12):C.isVector4?(U.boundary=16,U.storage=16):C.isMatrix3?(U.boundary=48,U.storage=48):C.isMatrix4?(U.boundary=64,U.storage=64):C.isTexture?ct("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(C)?(U.boundary=16,U.storage=C.byteLength):ct("WebGLRenderer: Unsupported uniform value type.",C),U}function x(C){const U=C.target;U.removeEventListener("dispose",x);const R=c.indexOf(U.__bindingPointIndex);c.splice(R,1),s.deleteBuffer(o[U.id]),delete o[U.id],delete l[U.id]}function v(){for(const C in o)s.deleteBuffer(o[C]);c=[],o={},l={}}return{bind:p,update:m,dispose:v}}const nT=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let rr=null;function iT(){return rr===null&&(rr=new v_(nT,16,16,fs,ur),rr.name="DFG_LUT",rr.minFilter=Ln,rr.magFilter=Ln,rr.wrapS=or,rr.wrapT=or,rr.generateMipmaps=!1,rr.needsUpdate=!0),rr}class j_{constructor(e={}){const{canvas:t=l_(),context:r=null,depth:o=!0,stencil:l=!1,alpha:c=!1,antialias:f=!1,premultipliedAlpha:p=!0,preserveDrawingBuffer:m=!1,powerPreference:_="default",failIfMajorPerformanceCaveat:y=!1,reversedDepthBuffer:g=!1,outputBufferType:S=oi}=e;this.isWebGLRenderer=!0;let E;if(r!==null){if(typeof WebGLRenderingContext<"u"&&r instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");E=r.getContextAttributes().alpha}else E=c;const A=S,x=new Set([Dc,Lc,Nc]),v=new Set([oi,Yi,za,ka,Cc,Pc]),C=new Uint32Array(4),U=new Int32Array(4),R=new Z;let G=null,D=null;const V=[],w=[];let I=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ji,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const X=this;let k=!1,K=null;this._outputColorSpace=Kn;let le=0,ue=0,W=null,$=-1,Y=null;const Q=new rn,pe=new rn;let me=null;const z=new St(0);let ne=0,Le=t.width,We=t.height,ze=1,ce=null,Te=null;const ve=new rn(0,0,Le,We),Ve=new rn(0,0,Le,We);let et=!1;const rt=new Bc;let Pt=!1,ht=!1;const Et=new Jt,At=new Z,Se=new rn,Ce={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let He=!1;function st(){return W===null?ze:1}let H=r;function xt(b,J){return t.getContext(b,J)}try{const b={alpha:!0,depth:o,stencil:l,antialias:f,premultipliedAlpha:p,preserveDrawingBuffer:m,powerPreference:_,failIfMajorPerformanceCaveat:y};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ac}`),t.addEventListener("webglcontextlost",ye,!1),t.addEventListener("webglcontextrestored",qe,!1),t.addEventListener("webglcontextcreationerror",ut,!1),H===null){const J="webgl2";if(H=xt(J,b),H===null)throw xt(J)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw Rt("WebGLRenderer: "+b.message),b}let dt,Tt,Oe,Gt,N,M,ee,xe,Ee,Pe,Ie,_e,L,O,ie,ae,he,Ue,Ne,Ye,B,Me,ge;function Be(){dt=new rE(H),dt.init(),B=new H_(H,dt),Tt=new KM(H,dt,e,B),Oe=new Y1(H,dt),Tt.reversedDepthBuffer&&g&&Oe.buffers.depth.setReversed(!0),Gt=new oE(H),N=new D1,M=new q1(H,dt,Oe,N,Tt,B,Gt),ee=new iE(X),xe=new dy(H),Me=new qM(H,xe),Ee=new sE(H,xe,Gt,Me),Pe=new uE(H,Ee,xe,Me,Gt),Ue=new lE(H,Tt,M),ie=new ZM(N),Ie=new L1(X,ee,dt,Tt,Me,ie),_e=new eT(X,N),L=new U1,O=new V1(dt),he=new YM(X,ee,Oe,Pe,E,p),ae=new X1(X,Pe,Tt),ge=new tT(H,Gt,Tt,Oe),Ne=new $M(H,dt,Gt),Ye=new aE(H,dt,Gt),Gt.programs=Ie.programs,X.capabilities=Tt,X.extensions=dt,X.properties=N,X.renderLists=L,X.shadowMap=ae,X.state=Oe,X.info=Gt}Be(),A!==oi&&(I=new dE(A,t.width,t.height,o,l));const be=new J1(X,H);this.xr=be,this.getContext=function(){return H},this.getContextAttributes=function(){return H.getContextAttributes()},this.forceContextLoss=function(){const b=dt.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=dt.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return ze},this.setPixelRatio=function(b){b!==void 0&&(ze=b,this.setSize(Le,We,!1))},this.getSize=function(b){return b.set(Le,We)},this.setSize=function(b,J,de=!0){if(be.isPresenting){ct("WebGLRenderer: Can't change size while VR device is presenting.");return}Le=b,We=J,t.width=Math.floor(b*ze),t.height=Math.floor(J*ze),de===!0&&(t.style.width=b+"px",t.style.height=J+"px"),I!==null&&I.setSize(t.width,t.height),this.setViewport(0,0,b,J)},this.getDrawingBufferSize=function(b){return b.set(Le*ze,We*ze).floor()},this.setDrawingBufferSize=function(b,J,de){Le=b,We=J,ze=de,t.width=Math.floor(b*de),t.height=Math.floor(J*de),this.setViewport(0,0,b,J)},this.setEffects=function(b){if(A===oi){Rt("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let J=0;J<b.length;J++)if(b[J].isOutputPass===!0){ct("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}I.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(Q)},this.getViewport=function(b){return b.copy(ve)},this.setViewport=function(b,J,de,se){b.isVector4?ve.set(b.x,b.y,b.z,b.w):ve.set(b,J,de,se),Oe.viewport(Q.copy(ve).multiplyScalar(ze).round())},this.getScissor=function(b){return b.copy(Ve)},this.setScissor=function(b,J,de,se){b.isVector4?Ve.set(b.x,b.y,b.z,b.w):Ve.set(b,J,de,se),Oe.scissor(pe.copy(Ve).multiplyScalar(ze).round())},this.getScissorTest=function(){return et},this.setScissorTest=function(b){Oe.setScissorTest(et=b)},this.setOpaqueSort=function(b){ce=b},this.setTransparentSort=function(b){Te=b},this.getClearColor=function(b){return b.copy(he.getClearColor())},this.setClearColor=function(){he.setClearColor(...arguments)},this.getClearAlpha=function(){return he.getClearAlpha()},this.setClearAlpha=function(){he.setClearAlpha(...arguments)},this.clear=function(b=!0,J=!0,de=!0){let se=0;if(b){let re=!1;if(W!==null){const ke=W.texture.format;re=x.has(ke)}if(re){const ke=W.texture.type,$e=v.has(ke),Fe=he.getClearColor(),Je=he.getClearAlpha(),it=Fe.r,pt=Fe.g,mt=Fe.b;$e?(C[0]=it,C[1]=pt,C[2]=mt,C[3]=Je,H.clearBufferuiv(H.COLOR,0,C)):(U[0]=it,U[1]=pt,U[2]=mt,U[3]=Je,H.clearBufferiv(H.COLOR,0,U))}else se|=H.COLOR_BUFFER_BIT}J&&(se|=H.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),de&&(se|=H.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),se!==0&&H.clear(se)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),K=b},this.dispose=function(){t.removeEventListener("webglcontextlost",ye,!1),t.removeEventListener("webglcontextrestored",qe,!1),t.removeEventListener("webglcontextcreationerror",ut,!1),he.dispose(),L.dispose(),O.dispose(),N.dispose(),ee.dispose(),Pe.dispose(),Me.dispose(),ge.dispose(),Ie.dispose(),be.dispose(),be.removeEventListener("sessionstart",Ki),be.removeEventListener("sessionend",_t),Lt.stop()};function ye(b){b.preventDefault(),Yo("WebGLRenderer: Context Lost."),k=!0}function qe(){Yo("WebGLRenderer: Context Restored."),k=!1;const b=Gt.autoReset,J=ae.enabled,de=ae.autoUpdate,se=ae.needsUpdate,re=ae.type;Be(),Gt.autoReset=b,ae.enabled=J,ae.autoUpdate=de,ae.needsUpdate=se,ae.type=re}function ut(b){Rt("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function Ut(b){const J=b.target;J.removeEventListener("dispose",Ut),Nt(J)}function Nt(b){dn(b),N.remove(b)}function dn(b){const J=N.get(b).programs;J!==void 0&&(J.forEach(function(de){Ie.releaseProgram(de)}),b.isShaderMaterial&&Ie.releaseShaderCache(b))}this.renderBufferDirect=function(b,J,de,se,re,ke){J===null&&(J=Ce);const $e=re.isMesh&&re.matrixWorld.determinant()<0,Fe=Lr(b,J,de,se,re);Oe.setMaterial(se,$e);let Je=de.index,it=1;if(se.wireframe===!0){if(Je=Ee.getWireframeAttribute(de),Je===void 0)return;it=2}const pt=de.drawRange,mt=de.attributes.position;let tt=pt.start*it,It=(pt.start+pt.count)*it;ke!==null&&(tt=Math.max(tt,ke.start*it),It=Math.min(It,(ke.start+ke.count)*it)),Je!==null?(tt=Math.max(tt,0),It=Math.min(It,Je.count)):mt!=null&&(tt=Math.max(tt,0),It=Math.min(It,mt.count));const Xt=It-tt;if(Xt<0||Xt===1/0)return;Me.setup(re,se,Fe,de,Je);let Qt,Bt=Ne;if(Je!==null&&(Qt=xe.get(Je),Bt=Ye,Bt.setIndex(Qt)),re.isMesh)se.wireframe===!0?(Oe.setLineWidth(se.wireframeLinewidth*st()),Bt.setMode(H.LINES)):Bt.setMode(H.TRIANGLES);else if(re.isLine){let fn=se.linewidth;fn===void 0&&(fn=1),Oe.setLineWidth(fn*st()),re.isLineSegments?Bt.setMode(H.LINES):re.isLineLoop?Bt.setMode(H.LINE_LOOP):Bt.setMode(H.LINE_STRIP)}else re.isPoints?Bt.setMode(H.POINTS):re.isSprite&&Bt.setMode(H.TRIANGLES);if(re.isBatchedMesh)if(dt.get("WEBGL_multi_draw"))Bt.renderMultiDraw(re._multiDrawStarts,re._multiDrawCounts,re._multiDrawCount);else{const fn=re._multiDrawStarts,je=re._multiDrawCounts,Cn=re._multiDrawCount,Mt=Je?xe.get(Je).bytesPerElement:1,Qn=N.get(se).currentProgram.getUniforms();for(let ei=0;ei<Cn;ei++)Qn.setValue(H,"_gl_DrawID",ei),Bt.render(fn[ei]/Mt,je[ei])}else if(re.isInstancedMesh)Bt.renderInstances(tt,Xt,re.count);else if(de.isInstancedBufferGeometry){const fn=de._maxInstanceCount!==void 0?de._maxInstanceCount:1/0,je=Math.min(de.instanceCount,fn);Bt.renderInstances(tt,Xt,je)}else Bt.render(tt,Xt)};function Vn(b,J,de){b.transparent===!0&&b.side===sr&&b.forceSinglePass===!1?(b.side=Zn,b.needsUpdate=!0,Dn(b,J,de),b.side=Pr,b.needsUpdate=!0,Dn(b,J,de),b.side=sr):Dn(b,J,de)}this.compile=function(b,J,de=null){de===null&&(de=b),D=O.get(de),D.init(J),w.push(D),de.traverseVisible(function(re){re.isLight&&re.layers.test(J.layers)&&(D.pushLight(re),re.castShadow&&D.pushShadow(re))}),b!==de&&b.traverseVisible(function(re){re.isLight&&re.layers.test(J.layers)&&(D.pushLight(re),re.castShadow&&D.pushShadow(re))}),D.setupLights();const se=new Set;return b.traverse(function(re){if(!(re.isMesh||re.isPoints||re.isLine||re.isSprite))return;const ke=re.material;if(ke)if(Array.isArray(ke))for(let $e=0;$e<ke.length;$e++){const Fe=ke[$e];Vn(Fe,de,re),se.add(Fe)}else Vn(ke,de,re),se.add(ke)}),D=w.pop(),se},this.compileAsync=function(b,J,de=null){const se=this.compile(b,J,de);return new Promise(re=>{function ke(){if(se.forEach(function($e){N.get($e).currentProgram.isReady()&&se.delete($e)}),se.size===0){re(b);return}setTimeout(ke,10)}dt.get("KHR_parallel_shader_compile")!==null?ke():setTimeout(ke,10)})};let Jn=null;function $i(b){Jn&&Jn(b)}function Ki(){Lt.stop()}function _t(){Lt.start()}const Lt=new O_;Lt.setAnimationLoop($i),typeof self<"u"&&Lt.setContext(self),this.setAnimationLoop=function(b){Jn=b,be.setAnimationLoop(b),b===null?Lt.stop():Lt.start()},be.addEventListener("sessionstart",Ki),be.addEventListener("sessionend",_t),this.render=function(b,J){if(J!==void 0&&J.isCamera!==!0){Rt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(k===!0)return;K!==null&&K.renderStart(b,J);const de=be.enabled===!0&&be.isPresenting===!0,se=I!==null&&(W===null||de)&&I.begin(X,W);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),J.parent===null&&J.matrixWorldAutoUpdate===!0&&J.updateMatrixWorld(),be.enabled===!0&&be.isPresenting===!0&&(I===null||I.isCompositing()===!1)&&(be.cameraAutoUpdate===!0&&be.updateCamera(J),J=be.getCamera()),b.isScene===!0&&b.onBeforeRender(X,b,J,W),D=O.get(b,w.length),D.init(J),D.state.textureUnits=M.getTextureUnits(),w.push(D),Et.multiplyMatrices(J.projectionMatrix,J.matrixWorldInverse),rt.setFromProjectionMatrix(Et,Wi,J.reversedDepth),ht=this.localClippingEnabled,Pt=ie.init(this.clippingPlanes,ht),G=L.get(b,V.length),G.init(),V.push(G),be.enabled===!0&&be.isPresenting===!0){const $e=X.xr.getDepthSensingMesh();$e!==null&&Wt($e,J,-1/0,X.sortObjects)}Wt(b,J,0,X.sortObjects),G.finish(),X.sortObjects===!0&&G.sort(ce,Te),He=be.enabled===!1||be.isPresenting===!1||be.hasDepthSensing()===!1,He&&he.addToRenderList(G,b),this.info.render.frame++,Pt===!0&&ie.beginShadows();const re=D.state.shadowsArray;if(ae.render(re,b,J),Pt===!0&&ie.endShadows(),this.info.autoReset===!0&&this.info.reset(),(se&&I.hasRenderPass())===!1){const $e=G.opaque,Fe=G.transmissive;if(D.setupLights(),J.isArrayCamera){const Je=J.cameras;if(Fe.length>0)for(let it=0,pt=Je.length;it<pt;it++){const mt=Je[it];Hn($e,Fe,b,mt)}He&&he.render(b);for(let it=0,pt=Je.length;it<pt;it++){const mt=Je[it];Gn(G,b,mt,mt.viewport)}}else Fe.length>0&&Hn($e,Fe,b,J),He&&he.render(b),Gn(G,b,J)}W!==null&&ue===0&&(M.updateMultisampleRenderTarget(W),M.updateRenderTargetMipmap(W)),se&&I.end(X),b.isScene===!0&&b.onAfterRender(X,b,J),Me.resetDefaultState(),$=-1,Y=null,w.pop(),w.length>0?(D=w[w.length-1],M.setTextureUnits(D.state.textureUnits),Pt===!0&&ie.setGlobalState(X.clippingPlanes,D.state.camera)):D=null,V.pop(),V.length>0?G=V[V.length-1]:G=null,K!==null&&K.renderEnd()};function Wt(b,J,de,se){if(b.visible===!1)return;if(b.layers.test(J.layers)){if(b.isGroup)de=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(J);else if(b.isLightProbeGrid)D.pushLightProbeGrid(b);else if(b.isLight)D.pushLight(b),b.castShadow&&D.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||rt.intersectsSprite(b)){se&&Se.setFromMatrixPosition(b.matrixWorld).applyMatrix4(Et);const $e=Pe.update(b),Fe=b.material;Fe.visible&&G.push(b,$e,Fe,de,Se.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||rt.intersectsObject(b))){const $e=Pe.update(b),Fe=b.material;if(se&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Se.copy(b.boundingSphere.center)):($e.boundingSphere===null&&$e.computeBoundingSphere(),Se.copy($e.boundingSphere.center)),Se.applyMatrix4(b.matrixWorld).applyMatrix4(Et)),Array.isArray(Fe)){const Je=$e.groups;for(let it=0,pt=Je.length;it<pt;it++){const mt=Je[it],tt=Fe[mt.materialIndex];tt&&tt.visible&&G.push(b,$e,tt,de,Se.z,mt)}}else Fe.visible&&G.push(b,$e,Fe,de,Se.z,null)}}const ke=b.children;for(let $e=0,Fe=ke.length;$e<Fe;$e++)Wt(ke[$e],J,de,se)}function Gn(b,J,de,se){const{opaque:re,transmissive:ke,transparent:$e}=b;D.setupLightsView(de),Pt===!0&&ie.setGlobalState(X.clippingPlanes,de),se&&Oe.viewport(Q.copy(se)),re.length>0&&Rn(re,J,de),ke.length>0&&Rn(ke,J,de),$e.length>0&&Rn($e,J,de),Oe.buffers.depth.setTest(!0),Oe.buffers.depth.setMask(!0),Oe.buffers.color.setMask(!0),Oe.setPolygonOffset(!1)}function Hn(b,J,de,se){if((de.isScene===!0?de.overrideMaterial:null)!==null)return;if(D.state.transmissionRenderTarget[se.id]===void 0){const tt=dt.has("EXT_color_buffer_half_float")||dt.has("EXT_color_buffer_float");D.state.transmissionRenderTarget[se.id]=new Xi(1,1,{generateMipmaps:!0,type:tt?ur:oi,minFilter:as,samples:Math.max(4,Tt.samples),stencilBuffer:l,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ct.workingColorSpace})}const ke=D.state.transmissionRenderTarget[se.id],$e=se.viewport||Q;ke.setSize($e.z*X.transmissionResolutionScale,$e.w*X.transmissionResolutionScale);const Fe=X.getRenderTarget(),Je=X.getActiveCubeFace(),it=X.getActiveMipmapLevel();X.setRenderTarget(ke),X.getClearColor(z),ne=X.getClearAlpha(),ne<1&&X.setClearColor(16777215,.5),X.clear(),He&&he.render(de);const pt=X.toneMapping;X.toneMapping=ji;const mt=se.viewport;if(se.viewport!==void 0&&(se.viewport=void 0),D.setupLightsView(se),Pt===!0&&ie.setGlobalState(X.clippingPlanes,se),Rn(b,de,se),M.updateMultisampleRenderTarget(ke),M.updateRenderTargetMipmap(ke),dt.has("WEBGL_multisampled_render_to_texture")===!1){let tt=!1;for(let It=0,Xt=J.length;It<Xt;It++){const Qt=J[It],{object:Bt,geometry:fn,material:je,group:Cn}=Qt;if(je.side===sr&&Bt.layers.test(se.layers)){const Mt=je.side;je.side=Zn,je.needsUpdate=!0,li(Bt,de,se,fn,je,Cn),je.side=Mt,je.needsUpdate=!0,tt=!0}}tt===!0&&(M.updateMultisampleRenderTarget(ke),M.updateRenderTargetMipmap(ke))}X.setRenderTarget(Fe,Je,it),X.setClearColor(z,ne),mt!==void 0&&(se.viewport=mt),X.toneMapping=pt}function Rn(b,J,de){const se=J.isScene===!0?J.overrideMaterial:null;for(let re=0,ke=b.length;re<ke;re++){const $e=b[re],{object:Fe,geometry:Je,group:it}=$e;let pt=$e.material;pt.allowOverride===!0&&se!==null&&(pt=se),Fe.layers.test(de.layers)&&li(Fe,J,de,Je,pt,it)}}function li(b,J,de,se,re,ke){b.onBeforeRender(X,J,de,se,re,ke),b.modelViewMatrix.multiplyMatrices(de.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),re.onBeforeRender(X,J,de,se,b,ke),re.transparent===!0&&re.side===sr&&re.forceSinglePass===!1?(re.side=Zn,re.needsUpdate=!0,X.renderBufferDirect(de,J,se,re,b,ke),re.side=Pr,re.needsUpdate=!0,X.renderBufferDirect(de,J,se,re,b,ke),re.side=sr):X.renderBufferDirect(de,J,se,re,b,ke),b.onAfterRender(X,J,de,se,re,ke)}function Dn(b,J,de){J.isScene!==!0&&(J=Ce);const se=N.get(b),re=D.state.lights,ke=D.state.shadowsArray,$e=re.state.version,Fe=Ie.getParameters(b,re.state,ke,J,de,D.state.lightProbeGridArray),Je=Ie.getProgramCacheKey(Fe);let it=se.programs;se.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?J.environment:null,se.fog=J.fog;const pt=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;se.envMap=ee.get(b.envMap||se.environment,pt),se.envMapRotation=se.environment!==null&&b.envMap===null?J.environmentRotation:b.envMapRotation,it===void 0&&(b.addEventListener("dispose",Ut),it=new Map,se.programs=it);let mt=it.get(Je);if(mt!==void 0){if(se.currentProgram===mt&&se.lightsStateVersion===$e)return Wn(b,Fe),mt}else Fe.uniforms=Ie.getUniforms(b),K!==null&&b.isNodeMaterial&&K.build(b,de,Fe),b.onBeforeCompile(Fe,X),mt=Ie.acquireProgram(Fe,Je),it.set(Je,mt),se.uniforms=Fe.uniforms;const tt=se.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(tt.clippingPlanes=ie.uniform),Wn(b,Fe),se.needsLights=ms(b),se.lightsStateVersion=$e,se.needsLights&&(tt.ambientLightColor.value=re.state.ambient,tt.lightProbe.value=re.state.probe,tt.directionalLights.value=re.state.directional,tt.directionalLightShadows.value=re.state.directionalShadow,tt.spotLights.value=re.state.spot,tt.spotLightShadows.value=re.state.spotShadow,tt.rectAreaLights.value=re.state.rectArea,tt.ltc_1.value=re.state.rectAreaLTC1,tt.ltc_2.value=re.state.rectAreaLTC2,tt.pointLights.value=re.state.point,tt.pointLightShadows.value=re.state.pointShadow,tt.hemisphereLights.value=re.state.hemi,tt.directionalShadowMatrix.value=re.state.directionalShadowMatrix,tt.spotLightMatrix.value=re.state.spotLightMatrix,tt.spotLightMap.value=re.state.spotLightMap,tt.pointShadowMatrix.value=re.state.pointShadowMatrix),se.lightProbeGrid=D.state.lightProbeGridArray.length>0,se.currentProgram=mt,se.uniformsList=null,mt}function _i(b){if(b.uniformsList===null){const J=b.currentProgram.getUniforms();b.uniformsList=Lu.seqWithValue(J.seq,b.uniforms)}return b.uniformsList}function Wn(b,J){const de=N.get(b);de.outputColorSpace=J.outputColorSpace,de.batching=J.batching,de.batchingColor=J.batchingColor,de.instancing=J.instancing,de.instancingColor=J.instancingColor,de.instancingMorph=J.instancingMorph,de.skinning=J.skinning,de.morphTargets=J.morphTargets,de.morphNormals=J.morphNormals,de.morphColors=J.morphColors,de.morphTargetsCount=J.morphTargetsCount,de.numClippingPlanes=J.numClippingPlanes,de.numIntersection=J.numClipIntersection,de.vertexAlphas=J.vertexAlphas,de.vertexTangents=J.vertexTangents,de.toneMapping=J.toneMapping}function gn(b,J){if(b.length===0)return null;if(b.length===1)return b[0].texture!==null?b[0]:null;R.setFromMatrixPosition(J.matrixWorld);for(let de=0,se=b.length;de<se;de++){const re=b[de];if(re.texture!==null&&re.boundingBox.containsPoint(R))return re}return null}function Lr(b,J,de,se,re){J.isScene!==!0&&(J=Ce),M.resetTextureUnits();const ke=J.fog,$e=se.isMeshStandardMaterial||se.isMeshLambertMaterial||se.isMeshPhongMaterial?J.environment:null,Fe=W===null?X.outputColorSpace:W.isXRRenderTarget===!0?W.texture.colorSpace:Ct.workingColorSpace,Je=se.isMeshStandardMaterial||se.isMeshLambertMaterial&&!se.envMap||se.isMeshPhongMaterial&&!se.envMap,it=ee.get(se.envMap||$e,Je),pt=se.vertexColors===!0&&!!de.attributes.color&&de.attributes.color.itemSize===4,mt=!!de.attributes.tangent&&(!!se.normalMap||se.anisotropy>0),tt=!!de.morphAttributes.position,It=!!de.morphAttributes.normal,Xt=!!de.morphAttributes.color;let Qt=ji;se.toneMapped&&(W===null||W.isXRRenderTarget===!0)&&(Qt=X.toneMapping);const Bt=de.morphAttributes.position||de.morphAttributes.normal||de.morphAttributes.color,fn=Bt!==void 0?Bt.length:0,je=N.get(se),Cn=D.state.lights;if(Pt===!0&&(ht===!0||b!==Y)){const Vt=b===Y&&se.id===$;ie.setState(se,b,Vt)}let Mt=!1;se.version===je.__version?(je.needsLights&&je.lightsStateVersion!==Cn.state.version||je.outputColorSpace!==Fe||re.isBatchedMesh&&je.batching===!1||!re.isBatchedMesh&&je.batching===!0||re.isBatchedMesh&&je.batchingColor===!0&&re.colorTexture===null||re.isBatchedMesh&&je.batchingColor===!1&&re.colorTexture!==null||re.isInstancedMesh&&je.instancing===!1||!re.isInstancedMesh&&je.instancing===!0||re.isSkinnedMesh&&je.skinning===!1||!re.isSkinnedMesh&&je.skinning===!0||re.isInstancedMesh&&je.instancingColor===!0&&re.instanceColor===null||re.isInstancedMesh&&je.instancingColor===!1&&re.instanceColor!==null||re.isInstancedMesh&&je.instancingMorph===!0&&re.morphTexture===null||re.isInstancedMesh&&je.instancingMorph===!1&&re.morphTexture!==null||je.envMap!==it||se.fog===!0&&je.fog!==ke||je.numClippingPlanes!==void 0&&(je.numClippingPlanes!==ie.numPlanes||je.numIntersection!==ie.numIntersection)||je.vertexAlphas!==pt||je.vertexTangents!==mt||je.morphTargets!==tt||je.morphNormals!==It||je.morphColors!==Xt||je.toneMapping!==Qt||je.morphTargetsCount!==fn||!!je.lightProbeGrid!=D.state.lightProbeGridArray.length>0)&&(Mt=!0):(Mt=!0,je.__version=se.version);let Qn=je.currentProgram;Mt===!0&&(Qn=Dn(se,J,re),K&&se.isNodeMaterial&&K.onUpdateProgram(se,Qn,je));let ei=!1,wt=!1,dr=!1;const zt=Qn.getUniforms(),$t=je.uniforms;if(Oe.useProgram(Qn.program)&&(ei=!0,wt=!0,dr=!0),se.id!==$&&($=se.id,wt=!0),je.needsLights){const Vt=gn(D.state.lightProbeGridArray,re);je.lightProbeGrid!==Vt&&(je.lightProbeGrid=Vt,wt=!0)}if(ei||Y!==b){Oe.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),zt.setValue(H,"projectionMatrix",b.projectionMatrix),zt.setValue(H,"viewMatrix",b.matrixWorldInverse);const Pi=zt.map.cameraPosition;Pi!==void 0&&Pi.setValue(H,At.setFromMatrixPosition(b.matrixWorld)),Tt.logarithmicDepthBuffer&&zt.setValue(H,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(se.isMeshPhongMaterial||se.isMeshToonMaterial||se.isMeshLambertMaterial||se.isMeshBasicMaterial||se.isMeshStandardMaterial||se.isShaderMaterial)&&zt.setValue(H,"isOrthographic",b.isOrthographicCamera===!0),Y!==b&&(Y=b,wt=!0,dr=!0)}if(je.needsLights&&(Cn.state.directionalShadowMap.length>0&&zt.setValue(H,"directionalShadowMap",Cn.state.directionalShadowMap,M),Cn.state.spotShadowMap.length>0&&zt.setValue(H,"spotShadowMap",Cn.state.spotShadowMap,M),Cn.state.pointShadowMap.length>0&&zt.setValue(H,"pointShadowMap",Cn.state.pointShadowMap,M)),re.isSkinnedMesh){zt.setOptional(H,re,"bindMatrix"),zt.setOptional(H,re,"bindMatrixInverse");const Vt=re.skeleton;Vt&&(Vt.boneTexture===null&&Vt.computeBoneTexture(),zt.setValue(H,"boneTexture",Vt.boneTexture,M))}re.isBatchedMesh&&(zt.setOptional(H,re,"batchingTexture"),zt.setValue(H,"batchingTexture",re._matricesTexture,M),zt.setOptional(H,re,"batchingIdTexture"),zt.setValue(H,"batchingIdTexture",re._indirectTexture,M),zt.setOptional(H,re,"batchingColorTexture"),re._colorsTexture!==null&&zt.setValue(H,"batchingColorTexture",re._colorsTexture,M));const Ci=de.morphAttributes;if((Ci.position!==void 0||Ci.normal!==void 0||Ci.color!==void 0)&&Ue.update(re,de,Qn),(wt||je.receiveShadow!==re.receiveShadow)&&(je.receiveShadow=re.receiveShadow,zt.setValue(H,"receiveShadow",re.receiveShadow)),(se.isMeshStandardMaterial||se.isMeshLambertMaterial||se.isMeshPhongMaterial)&&se.envMap===null&&J.environment!==null&&($t.envMapIntensity.value=J.environmentIntensity),$t.dfgLUT!==void 0&&($t.dfgLUT.value=iT()),wt){if(zt.setValue(H,"toneMappingExposure",X.toneMappingExposure),je.needsLights&&Zi($t,dr),ke&&se.fog===!0&&_e.refreshFogUniforms($t,ke),_e.refreshMaterialUniforms($t,se,ze,We,D.state.transmissionRenderTarget[b.id]),je.needsLights&&je.lightProbeGrid){const Vt=je.lightProbeGrid;$t.probesSH.value=Vt.texture,$t.probesMin.value.copy(Vt.boundingBox.min),$t.probesMax.value.copy(Vt.boundingBox.max),$t.probesResolution.value.copy(Vt.resolution)}Lu.upload(H,_i(je),$t,M)}if(se.isShaderMaterial&&se.uniformsNeedUpdate===!0&&(Lu.upload(H,_i(je),$t,M),se.uniformsNeedUpdate=!1),se.isSpriteMaterial&&zt.setValue(H,"center",re.center),zt.setValue(H,"modelViewMatrix",re.modelViewMatrix),zt.setValue(H,"normalMatrix",re.normalMatrix),zt.setValue(H,"modelMatrix",re.matrixWorld),se.uniformsGroups!==void 0){const Vt=se.uniformsGroups;for(let Pi=0,Ji=Vt.length;Pi<Ji;Pi++){const gs=Vt[Pi];ge.update(gs,Qn),ge.bind(gs,Qn)}}return Qn}function Zi(b,J){b.ambientLightColor.needsUpdate=J,b.lightProbe.needsUpdate=J,b.directionalLights.needsUpdate=J,b.directionalLightShadows.needsUpdate=J,b.pointLights.needsUpdate=J,b.pointLightShadows.needsUpdate=J,b.spotLights.needsUpdate=J,b.spotLightShadows.needsUpdate=J,b.rectAreaLights.needsUpdate=J,b.hemisphereLights.needsUpdate=J}function ms(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return le},this.getActiveMipmapLevel=function(){return ue},this.getRenderTarget=function(){return W},this.setRenderTargetTextures=function(b,J,de){const se=N.get(b);se.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,se.__autoAllocateDepthBuffer===!1&&(se.__useRenderToTexture=!1),N.get(b.texture).__webglTexture=J,N.get(b.depthTexture).__webglTexture=se.__autoAllocateDepthBuffer?void 0:de,se.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,J){const de=N.get(b);de.__webglFramebuffer=J,de.__useDefaultFramebuffer=J===void 0};const jt=H.createFramebuffer();this.setRenderTarget=function(b,J=0,de=0){W=b,le=J,ue=de;let se=null,re=!1,ke=!1;if(b){const Fe=N.get(b);if(Fe.__useDefaultFramebuffer!==void 0){Oe.bindFramebuffer(H.FRAMEBUFFER,Fe.__webglFramebuffer),Q.copy(b.viewport),pe.copy(b.scissor),me=b.scissorTest,Oe.viewport(Q),Oe.scissor(pe),Oe.setScissorTest(me),$=-1;return}else if(Fe.__webglFramebuffer===void 0)M.setupRenderTarget(b);else if(Fe.__hasExternalTextures)M.rebindTextures(b,N.get(b.texture).__webglTexture,N.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const pt=b.depthTexture;if(Fe.__boundDepthTexture!==pt){if(pt!==null&&N.has(pt)&&(b.width!==pt.image.width||b.height!==pt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");M.setupDepthRenderbuffer(b)}}const Je=b.texture;(Je.isData3DTexture||Je.isDataArrayTexture||Je.isCompressedArrayTexture)&&(ke=!0);const it=N.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(it[J])?se=it[J][de]:se=it[J],re=!0):b.samples>0&&M.useMultisampledRTT(b)===!1?se=N.get(b).__webglMultisampledFramebuffer:Array.isArray(it)?se=it[de]:se=it,Q.copy(b.viewport),pe.copy(b.scissor),me=b.scissorTest}else Q.copy(ve).multiplyScalar(ze).floor(),pe.copy(Ve).multiplyScalar(ze).floor(),me=et;if(de!==0&&(se=jt),Oe.bindFramebuffer(H.FRAMEBUFFER,se)&&Oe.drawBuffers(b,se),Oe.viewport(Q),Oe.scissor(pe),Oe.setScissorTest(me),re){const Fe=N.get(b.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_CUBE_MAP_POSITIVE_X+J,Fe.__webglTexture,de)}else if(ke){const Fe=J;for(let Je=0;Je<b.textures.length;Je++){const it=N.get(b.textures[Je]);H.framebufferTextureLayer(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0+Je,it.__webglTexture,de,Fe)}}else if(b!==null&&de!==0){const Fe=N.get(b.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,Fe.__webglTexture,de)}$=-1},this.readRenderTargetPixels=function(b,J,de,se,re,ke,$e,Fe=0){if(!(b&&b.isWebGLRenderTarget)){Rt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Je=N.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&$e!==void 0&&(Je=Je[$e]),Je){Oe.bindFramebuffer(H.FRAMEBUFFER,Je);try{const it=b.textures[Fe],pt=it.format,mt=it.type;if(b.textures.length>1&&H.readBuffer(H.COLOR_ATTACHMENT0+Fe),!Tt.textureFormatReadable(pt)){Rt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Tt.textureTypeReadable(mt)){Rt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}J>=0&&J<=b.width-se&&de>=0&&de<=b.height-re&&H.readPixels(J,de,se,re,B.convert(pt),B.convert(mt),ke)}finally{const it=W!==null?N.get(W).__webglFramebuffer:null;Oe.bindFramebuffer(H.FRAMEBUFFER,it)}}},this.readRenderTargetPixelsAsync=async function(b,J,de,se,re,ke,$e,Fe=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Je=N.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&$e!==void 0&&(Je=Je[$e]),Je)if(J>=0&&J<=b.width-se&&de>=0&&de<=b.height-re){Oe.bindFramebuffer(H.FRAMEBUFFER,Je);const it=b.textures[Fe],pt=it.format,mt=it.type;if(b.textures.length>1&&H.readBuffer(H.COLOR_ATTACHMENT0+Fe),!Tt.textureFormatReadable(pt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Tt.textureTypeReadable(mt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const tt=H.createBuffer();H.bindBuffer(H.PIXEL_PACK_BUFFER,tt),H.bufferData(H.PIXEL_PACK_BUFFER,ke.byteLength,H.STREAM_READ),H.readPixels(J,de,se,re,B.convert(pt),B.convert(mt),0);const It=W!==null?N.get(W).__webglFramebuffer:null;Oe.bindFramebuffer(H.FRAMEBUFFER,It);const Xt=H.fenceSync(H.SYNC_GPU_COMMANDS_COMPLETE,0);return H.flush(),await Fx(H,Xt,4),H.bindBuffer(H.PIXEL_PACK_BUFFER,tt),H.getBufferSubData(H.PIXEL_PACK_BUFFER,0,ke),H.deleteBuffer(tt),H.deleteSync(Xt),ke}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,J=null,de=0){const se=Math.pow(2,-de),re=Math.floor(b.image.width*se),ke=Math.floor(b.image.height*se),$e=J!==null?J.x:0,Fe=J!==null?J.y:0;M.setTexture2D(b,0),H.copyTexSubImage2D(H.TEXTURE_2D,de,0,0,$e,Fe,re,ke),Oe.unbindTexture()};const Xs=H.createFramebuffer(),In=H.createFramebuffer();this.copyTextureToTexture=function(b,J,de=null,se=null,re=0,ke=0){let $e,Fe,Je,it,pt,mt,tt,It,Xt;const Qt=b.isCompressedTexture?b.mipmaps[ke]:b.image;if(de!==null)$e=de.max.x-de.min.x,Fe=de.max.y-de.min.y,Je=de.isBox3?de.max.z-de.min.z:1,it=de.min.x,pt=de.min.y,mt=de.isBox3?de.min.z:0;else{const $t=Math.pow(2,-re);$e=Math.floor(Qt.width*$t),Fe=Math.floor(Qt.height*$t),b.isDataArrayTexture?Je=Qt.depth:b.isData3DTexture?Je=Math.floor(Qt.depth*$t):Je=1,it=0,pt=0,mt=0}se!==null?(tt=se.x,It=se.y,Xt=se.z):(tt=0,It=0,Xt=0);const Bt=B.convert(J.format),fn=B.convert(J.type);let je;J.isData3DTexture?(M.setTexture3D(J,0),je=H.TEXTURE_3D):J.isDataArrayTexture||J.isCompressedArrayTexture?(M.setTexture2DArray(J,0),je=H.TEXTURE_2D_ARRAY):(M.setTexture2D(J,0),je=H.TEXTURE_2D),Oe.activeTexture(H.TEXTURE0),Oe.pixelStorei(H.UNPACK_FLIP_Y_WEBGL,J.flipY),Oe.pixelStorei(H.UNPACK_PREMULTIPLY_ALPHA_WEBGL,J.premultiplyAlpha),Oe.pixelStorei(H.UNPACK_ALIGNMENT,J.unpackAlignment);const Cn=Oe.getParameter(H.UNPACK_ROW_LENGTH),Mt=Oe.getParameter(H.UNPACK_IMAGE_HEIGHT),Qn=Oe.getParameter(H.UNPACK_SKIP_PIXELS),ei=Oe.getParameter(H.UNPACK_SKIP_ROWS),wt=Oe.getParameter(H.UNPACK_SKIP_IMAGES);Oe.pixelStorei(H.UNPACK_ROW_LENGTH,Qt.width),Oe.pixelStorei(H.UNPACK_IMAGE_HEIGHT,Qt.height),Oe.pixelStorei(H.UNPACK_SKIP_PIXELS,it),Oe.pixelStorei(H.UNPACK_SKIP_ROWS,pt),Oe.pixelStorei(H.UNPACK_SKIP_IMAGES,mt);const dr=b.isDataArrayTexture||b.isData3DTexture,zt=J.isDataArrayTexture||J.isData3DTexture;if(b.isDepthTexture){const $t=N.get(b),Ci=N.get(J),Vt=N.get($t.__renderTarget),Pi=N.get(Ci.__renderTarget);Oe.bindFramebuffer(H.READ_FRAMEBUFFER,Vt.__webglFramebuffer),Oe.bindFramebuffer(H.DRAW_FRAMEBUFFER,Pi.__webglFramebuffer);for(let Ji=0;Ji<Je;Ji++)dr&&(H.framebufferTextureLayer(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,N.get(b).__webglTexture,re,mt+Ji),H.framebufferTextureLayer(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,N.get(J).__webglTexture,ke,Xt+Ji)),H.blitFramebuffer(it,pt,$e,Fe,tt,It,$e,Fe,H.DEPTH_BUFFER_BIT,H.NEAREST);Oe.bindFramebuffer(H.READ_FRAMEBUFFER,null),Oe.bindFramebuffer(H.DRAW_FRAMEBUFFER,null)}else if(re!==0||b.isRenderTargetTexture||N.has(b)){const $t=N.get(b),Ci=N.get(J);Oe.bindFramebuffer(H.READ_FRAMEBUFFER,Xs),Oe.bindFramebuffer(H.DRAW_FRAMEBUFFER,In);for(let Vt=0;Vt<Je;Vt++)dr?H.framebufferTextureLayer(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,$t.__webglTexture,re,mt+Vt):H.framebufferTexture2D(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,$t.__webglTexture,re),zt?H.framebufferTextureLayer(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,Ci.__webglTexture,ke,Xt+Vt):H.framebufferTexture2D(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,Ci.__webglTexture,ke),re!==0?H.blitFramebuffer(it,pt,$e,Fe,tt,It,$e,Fe,H.COLOR_BUFFER_BIT,H.NEAREST):zt?H.copyTexSubImage3D(je,ke,tt,It,Xt+Vt,it,pt,$e,Fe):H.copyTexSubImage2D(je,ke,tt,It,it,pt,$e,Fe);Oe.bindFramebuffer(H.READ_FRAMEBUFFER,null),Oe.bindFramebuffer(H.DRAW_FRAMEBUFFER,null)}else zt?b.isDataTexture||b.isData3DTexture?H.texSubImage3D(je,ke,tt,It,Xt,$e,Fe,Je,Bt,fn,Qt.data):J.isCompressedArrayTexture?H.compressedTexSubImage3D(je,ke,tt,It,Xt,$e,Fe,Je,Bt,Qt.data):H.texSubImage3D(je,ke,tt,It,Xt,$e,Fe,Je,Bt,fn,Qt):b.isDataTexture?H.texSubImage2D(H.TEXTURE_2D,ke,tt,It,$e,Fe,Bt,fn,Qt.data):b.isCompressedTexture?H.compressedTexSubImage2D(H.TEXTURE_2D,ke,tt,It,Qt.width,Qt.height,Bt,Qt.data):H.texSubImage2D(H.TEXTURE_2D,ke,tt,It,$e,Fe,Bt,fn,Qt);Oe.pixelStorei(H.UNPACK_ROW_LENGTH,Cn),Oe.pixelStorei(H.UNPACK_IMAGE_HEIGHT,Mt),Oe.pixelStorei(H.UNPACK_SKIP_PIXELS,Qn),Oe.pixelStorei(H.UNPACK_SKIP_ROWS,ei),Oe.pixelStorei(H.UNPACK_SKIP_IMAGES,wt),ke===0&&J.generateMipmaps&&H.generateMipmap(je),Oe.unbindTexture()},this.initRenderTarget=function(b){N.get(b).__webglFramebuffer===void 0&&M.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?M.setTextureCube(b,0):b.isData3DTexture?M.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?M.setTexture2DArray(b,0):M.setTexture2D(b,0),Oe.unbindTexture()},this.resetState=function(){le=0,ue=0,W=null,Oe.reset(),Me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Wi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ct._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ct._getUnpackColorSpace()}}const ah=Object.freeze(Object.defineProperty({__proto__:null,ACESFilmicToneMapping:Ah,AddEquation:ss,AddOperation:J0,AdditiveBlending:uh,AgXToneMapping:Ch,AlphaFormat:Fh,AlwaysCompare:o_,AlwaysDepth:Ou,AlwaysStencilFunc:fh,ArrayCamera:L_,ArrowHelper:U_,AxesHelper:F_,BackSide:Zn,BasicDepthPacking:e_,Box3:Ga,BoxGeometry:Ha,BufferAttribute:Ri,BufferGeometry:cn,ByteType:Lh,Cache:Nu,Camera:Xh,CanvasTexture:ry,CineonToneMapping:bh,ClampToEdgeWrapping:or,Color:St,ColorManagement:Ct,ConeGeometry:Vc,ConstantAlphaFactor:$0,ConstantColorFactor:Y0,CubeCamera:N_,CubeDepthTexture:x_,CubeReflectionMapping:ds,CubeRefractionMapping:Vs,CubeTexture:Hh,CubeUVReflectionMapping:Jo,CullFaceBack:lh,CullFaceFront:N0,CullFaceNone:P0,CustomBlending:D0,CustomToneMapping:Rh,CylinderGeometry:Ar,Data3DTexture:f_,DataArrayTexture:kh,DataTexture:v_,DefaultLoadingManager:b_,DepthFormat:cr,DepthStencilFormat:os,DepthTexture:Hs,DirectionalLight:P_,DoubleSide:sr,DstAlphaFactor:G0,DstColorFactor:W0,EqualCompare:r_,EqualDepth:ku,EquirectangularReflectionMapping:Au,EquirectangularRefractionMapping:Ru,Euler:Nr,EventDispatcher:hs,ExternalTexture:Wh,Float32BufferAttribute:qt,FloatType:Hi,Fog:zc,FrontSide:Pr,Frustum:Bc,GLSL3:hh,GreaterCompare:s_,GreaterDepth:Vu,GreaterEqualCompare:Uc,GreaterEqualDepth:Bu,GridHelper:I_,Group:Bi,HalfFloatType:ur,HemisphereLight:C_,ImageLoader:A_,ImageUtils:c_,IntType:Rc,InterleavedBuffer:m_,InterleavedBufferAttribute:qo,KeepStencilOp:Os,Layers:Oc,LessCompare:i_,LessDepth:zu,LessEqualCompare:Ic,LessEqualDepth:Bs,Light:jh,Line:$o,LineBasicMaterial:Gs,LineSegments:Gh,LinearFilter:Ln,LinearMipmapLinearFilter:as,LinearMipmapNearestFilter:Cu,LinearSRGBColorSpace:Wo,LinearToneMapping:Th,LinearTransfer:jo,Loader:Hc,LoadingManager:w_,Material:ps,Matrix2:_h,Matrix3:gt,Matrix4:Jt,MaxEquation:O0,Mesh:ln,MeshBasicMaterial:bi,MeshDepthMaterial:E_,MeshDistanceMaterial:T_,MeshStandardMaterial:mh,MinEquation:F0,MirroredRepeatWrapping:Wu,MixOperation:Z0,MultiplyBlending:dh,MultiplyOperation:Eh,NearestFilter:bn,NearestMipmapLinearFilter:Uo,NearestMipmapNearestFilter:Q0,NeutralToneMapping:Ph,NeverCompare:n_,NeverDepth:Fu,NoBlending:lr,NoColorSpace:br,NoToneMapping:ji,NormalBlending:ks,NotEqualCompare:a_,NotEqualDepth:Gu,Object3D:un,ObjectSpaceNormalMap:t_,OneFactor:k0,OneMinusConstantAlphaFactor:K0,OneMinusConstantColorFactor:q0,OneMinusDstAlphaFactor:H0,OneMinusDstColorFactor:j0,OneMinusSrcAlphaFactor:Uu,OneMinusSrcColorFactor:V0,OrthographicCamera:Wc,PCFShadowMap:Oo,PCFSoftShadowMap:L0,PMREMGenerator:vh,PerspectiveCamera:mi,Plane:wr,PlaneGeometry:Ws,Quaternion:js,R11_EAC_Format:Ju,RED_GREEN_RGTC2_Format:Ho,RED_RGTC1_Format:vc,REVISION:Ac,RG11_EAC_Format:Go,RGBAFormat:Ai,RGBAIntegerFormat:Dc,RGBA_ASTC_10x10_Format:fc,RGBA_ASTC_10x5_Format:uc,RGBA_ASTC_10x6_Format:cc,RGBA_ASTC_10x8_Format:dc,RGBA_ASTC_12x10_Format:hc,RGBA_ASTC_12x12_Format:pc,RGBA_ASTC_4x4_Format:tc,RGBA_ASTC_5x4_Format:nc,RGBA_ASTC_5x5_Format:ic,RGBA_ASTC_6x5_Format:rc,RGBA_ASTC_6x6_Format:sc,RGBA_ASTC_8x5_Format:ac,RGBA_ASTC_8x6_Format:oc,RGBA_ASTC_8x8_Format:lc,RGBA_BPTC_Format:mc,RGBA_ETC2_EAC_Format:Zu,RGBA_PVRTC_2BPPV1_Format:qu,RGBA_PVRTC_4BPPV1_Format:Yu,RGBA_S3TC_DXT1_Format:ko,RGBA_S3TC_DXT3_Format:Bo,RGBA_S3TC_DXT5_Format:Vo,RGBFormat:Oh,RGB_BPTC_SIGNED_Format:gc,RGB_BPTC_UNSIGNED_Format:_c,RGB_ETC1_Format:$u,RGB_ETC2_Format:Ku,RGB_PVRTC_2BPPV1_Format:Xu,RGB_PVRTC_4BPPV1_Format:ju,RGB_S3TC_DXT1_Format:zo,RGFormat:fs,RGIntegerFormat:Lc,RawShaderMaterial:M_,Ray:kc,Raycaster:D_,RedFormat:zh,RedIntegerFormat:Nc,ReinhardToneMapping:wh,RenderTarget:d_,RepeatWrapping:Hu,ReverseSubtractEquation:U0,SIGNED_R11_EAC_Format:Qu,SIGNED_RED_GREEN_RGTC2_Format:yc,SIGNED_RED_RGTC1_Format:xc,SIGNED_RG11_EAC_Format:ec,SRGBColorSpace:Kn,SRGBTransfer:kt,Scene:p_,ShaderChunk:yt,ShaderLib:Vi,ShaderMaterial:qi,ShortType:Dh,Source:Fc,Sphere:Qo,SphereGeometry:Gc,Sprite:Qx,SpriteMaterial:g_,SrcAlphaFactor:Iu,SrcAlphaSaturateFactor:X0,SrcColorFactor:B0,StaticDrawUsage:Mc,SubtractEquation:I0,SubtractiveBlending:ch,TangentSpaceNormalMap:Sc,Texture:An,TextureLoader:R_,TorusGeometry:Ko,Triangle:gi,UVMapping:Nh,Uint16BufferAttribute:Bh,Uint32BufferAttribute:Vh,UniformsLib:Ge,UniformsUtils:S_,UnsignedByteType:oi,UnsignedInt101111Type:Uh,UnsignedInt248Type:ka,UnsignedInt5999Type:Ih,UnsignedIntType:Yi,UnsignedShort4444Type:Cc,UnsignedShort5551Type:Pc,UnsignedShortType:za,VSMShadowMap:Ia,Vector2:vt,Vector3:Z,Vector4:rn,WebGLCoordinateSystem:Wi,WebGLCubeRenderTarget:Yh,WebGLRenderTarget:Xi,WebGLRenderer:j_,WebGLUtils:H_,WebGPUCoordinateSystem:Ba,WebXRController:Pu,ZeroFactor:z0,createCanvasElement:l_,error:Rt,log:Yo,warn:ct,warnOnce:Ec},Symbol.toStringTag,{value:"Module"})),rT="",sT={horizontal_velocity_m_s:5,vertical_velocity_m_s:2,max_heading_rate_deg_s:60},Zo={ros_ready:!1,mission_topic:"/adaptive_mission_mode/mission_json",start_topic:"/adaptive_mission_mode/start",return_home_topic:"/adaptive_mission_mode/return_home",vehicle:{connected:!1,flight_mode:null,nav_state:null,executor_in_charge:null,armed:!1,preflight_checks_pass:null,failsafe:null,system_id:null,component_id:null,battery_percent:null,last_status_age_s:null,last_position_age_s:null,last_battery_age_s:null,position:{latitude_deg:null,longitude_deg:null,altitude_amsl_m:null}},mission_cache:{loaded:!1,mission_name:null,item_count:0,last_mission_publish_at:null,last_start_publish_at:null,last_return_home_publish_at:null},mission_runtime:{available:!1,runtime_state:null,mission_ready:null,mission_active:null,mission_start_in_progress:null,current_item_index:null,current_item_type:null,vehicle:{valid:null,armed:null,landed:null,nav_state:null,x_ned_m:null,y_ned_m:null,z_ned_m:null,local_reference_valid:null,ref_lat_deg:null,ref_lon_deg:null,ref_alt_msl_m:null},manual_altitude_active:null,altitude_offset_m:null,throttle_input:null,climb_rate_command_m_s:null,target:{valid:null,x_ned_m:null,y_ned_m:null,base_z_ned_m:null,effective_z_ned_m:null,altitude_offset_m:null},payload_servo:{active:null,item_index:null,channel:null,pwm_us:null,pulse_high:null},last_error:null,last_update_age_s:null},mavlink:{enabled:!1,connected:!1,connection_url:null,target_system:null,target_component:null,autopilot:null,mav_type:null,base_mode:null,custom_mode:null,system_status:null,armed:!1,battery_percent:null,voltage_battery_v:null,current_battery_a:null,latitude_deg:null,longitude_deg:null,altitude_amsl_m:null,relative_altitude_m:null,heading_deg:null,yaw_deg:null,roll_deg:null,pitch_deg:null,last_heartbeat_age_s:null,last_message_age_s:null,last_error:null,last_statustext:null,message_counts:{}}},wi=256,aT="https://tile.openstreetmap.org/{z}/{x}/{y}.png",b0={latitude_deg:10.823099,longitude_deg:106.629662},oT=120,lT={1:"MANUAL",2:"ALTCTL",3:"POSCTL",4:"AUTO",5:"ACRO",6:"OFFBOARD",7:"STABILIZED",8:"RATTITUDE",9:"SIMPLE"},uT={1:"READY",2:"TAKEOFF",3:"LOITER",4:"MISSION",5:"RTL",6:"LAND",7:"RTGS",8:"FOLLOW_TARGET",9:"PRECLAND",10:"VTOL_TAKEOFF",11:"EXTERNAL1",12:"EXTERNAL2",13:"EXTERNAL3",14:"EXTERNAL4",15:"EXTERNAL5",16:"EXTERNAL6",17:"EXTERNAL7",18:"EXTERNAL8"},cT={takeoff:"rocket_launch",waypoint:"add_location_alt",hold:"pause_circle",changeSettings:"tune",land:"flight_land",rtl:"home_pin",servoPulse:"settings_input_component",customAction:"extension"},dT={takeoff:"TO",waypoint:"WP",hold:"HOLD",changeSettings:"SET",land:"LAND",rtl:"RTL",servoPulse:"SERVO",customAction:"ACT"},fT=new Set(["waypoint"]);function $n(s,e,t){return Math.min(Math.max(s,e),t)}function qh(s){return $n(s,-85.05112878,85.05112878)}function xn(s,e){return Number.isFinite(Number(s))&&Number.isFinite(Number(e))}function hT(s){return!!(s?.mavlink?.armed||s?.vehicle?.armed)}function pT(s,e){if(!xn(s?.latitude_deg,s?.longitude_deg)||!xn(e?.latitude_deg,e?.longitude_deg))return Number.POSITIVE_INFINITY;const t=6371e3,r=Number(s.latitude_deg)*Math.PI/180,o=Number(e.latitude_deg)*Math.PI/180,l=(Number(e.latitude_deg)-Number(s.latitude_deg))*Math.PI/180,c=(Number(e.longitude_deg)-Number(s.longitude_deg))*Math.PI/180,f=Math.sin(l/2),p=Math.sin(c/2),m=f*f+Math.cos(r)*Math.cos(o)*p*p;return 2*t*Math.atan2(Math.sqrt(m),Math.sqrt(1-m))}function Rr(s){return fT.has(s?.type)}function mT(s,e){const t=s.find(r=>xn(r.latitude_deg,r.longitude_deg));return t?{latitude_deg:Number(t.latitude_deg),longitude_deg:Number(t.longitude_deg)}:xn(e?.latitude_deg,e?.longitude_deg)?{latitude_deg:Number(e.latitude_deg),longitude_deg:Number(e.longitude_deg)}:null}function A0(s,e,t,r){if(s.type==="rtl"){if(xn(r?.latitude_deg,r?.longitude_deg))return{latitude_deg:Number(r.latitude_deg),longitude_deg:Number(r.longitude_deg),fromFallback:!0,fromDrone:!0};const o=mT(t,null);return o?{...o,fromFallback:!0}:null}if(xn(s.latitude_deg,s.longitude_deg))return{latitude_deg:Number(s.latitude_deg),longitude_deg:Number(s.longitude_deg),fromFallback:!1};if(Rr(s)){const o=t.slice(0,e).reverse().find(l=>xn(l.latitude_deg,l.longitude_deg));if(o)return{latitude_deg:Number(o.latitude_deg),longitude_deg:Number(o.longitude_deg),fromFallback:!0}}return null}function gT(s){if(!Number.isFinite(Number(s)))return"--";const e=Number(s)>>>0,t=e>>16&255,r=e>>24&255,o=lT[t]??`MAIN_${t}`;return t===4&&r>0?`${o}/${uT[r]??`SUB_${r}`}`:o}function Oa(s){const e=s?.mavlink??{};if(e.connected&&xn(e.latitude_deg,e.longitude_deg))return{latitude_deg:e.latitude_deg,longitude_deg:e.longitude_deg,altitude_amsl_m:e.altitude_amsl_m,relative_altitude_m:e.relative_altitude_m,source:"MAVLink"};const t=s?.vehicle?.position??{};return xn(t.latitude_deg,t.longitude_deg)?{...t,relative_altitude_m:null,source:"ROS 2"}:{latitude_deg:null,longitude_deg:null,altitude_amsl_m:null,relative_altitude_m:null,source:"none"}}function $h(s){const e=s?.mavlink??{},t=s?.vehicle??{},r=e.enabled||e.connected||e.last_message_age_s!=null;return{id:`${e.target_system??t.system_id??1}:${e.target_component??t.component_id??1}`,name:`Drone ${e.target_system??t.system_id??1}`,source:r?"MAVLink":"ROS 2",connected:r?!!e.connected:!!t.connected,armed:r?!!e.armed:!!t.armed,mode:r?gT(e.custom_mode):t.flight_mode??"--",navState:t.nav_state??"--",preflight:t.preflight_checks_pass,failsafe:t.failsafe,batteryPercent:e.battery_percent??t.battery_percent,voltage:e.voltage_battery_v,current:e.current_battery_a,headingDeg:e.heading_deg??e.yaw_deg??null,yawDeg:e.yaw_deg??null,rollDeg:e.roll_deg??null,pitchDeg:e.pitch_deg??null,baseMode:e.base_mode,customMode:e.custom_mode,systemStatus:e.system_status,autopilot:e.autopilot,mavType:e.mav_type,targetSystem:e.target_system??t.system_id,targetComponent:e.target_component??t.component_id,heartbeatAge:e.last_heartbeat_age_s,messageAge:e.last_message_age_s??t.last_status_age_s,positionAge:t.last_position_age_s,connectionUrl:e.connection_url,lastError:e.last_error,lastStatustext:e.last_statustext,messageCounts:e.message_counts??{}}}function _T(s){return Array.isArray(s?.drones)&&s.drones.length>0?s.drones.map((t,r)=>({id:String(t.id??`${t.system_id??r+1}:${t.component_id??1}`),name:t.name??`Drone ${t.system_id??r+1}`,connected:!!t.connected,armed:!!t.armed,batteryPercent:t.battery_percent,mode:t.flight_mode??t.mode??"--"})):[$h(s)]}function R0(s,e,t){const r=qh(Number(s)),o=$n(Number(e),-180,180),l=Math.sin(r*Math.PI/180),c=wi*2**t;return{x:(o+180)/360*c,y:(.5-Math.log((1+l)/(1-l))/(4*Math.PI))*c}}function C0(s,e,t){const r=wi*2**t,o=s/r*360-180,l=Math.PI-2*Math.PI*e/r,c=180/Math.PI*Math.atan(Math.sinh(l));return{latitude_deg:qh(c),longitude_deg:(o+540)%360-180}}function vT(s,e,t){return aT.replaceAll("{z}",String(s)).replaceAll("{x}",String(e)).replaceAll("{y}",String(t))}function Ds(s,e){const t=Number(e.latitude_deg)*Math.PI/180,r=111320,o=Math.max(1,111320*Math.cos(t));return{x:(Number(s.longitude_deg)-Number(e.longitude_deg))*o,z:-(Number(s.latitude_deg)-Number(e.latitude_deg))*r}}function Io(s,e,t){const r=Number(t.latitude_deg)*Math.PI/180,o=111320,l=Math.max(1,111320*Math.cos(r));return{latitude_deg:qh(Number(t.latitude_deg)-e/o),longitude_deg:(Number(t.longitude_deg)+s/l+540)%360-180}}function Da(s){s.traverse?.(e=>{e.geometry&&e.geometry.dispose(),(Array.isArray(e.material)?e.material:[e.material]).filter(Boolean).forEach(r=>{r.map&&r.map.dispose(),r.dispose?.()})})}function oh(s,e,t={}){const r=document.createElement("canvas"),o=r.getContext("2d"),l=String(e).split(`
`),c=t.fontSize??34,f=20,p=14;o.font=`900 ${c}px Inter, system-ui, sans-serif`;const m=Math.ceil(Math.max(...l.map(x=>o.measureText(x).width))+f*2),_=Math.ceil(l.length*(c+5)+p*2);r.width=Math.max(128,Math.ceil(m/2)*2),r.height=Math.max(64,Math.ceil(_/2)*2),o.font=`900 ${c}px Inter, system-ui, sans-serif`,o.textAlign="center",o.textBaseline="middle",o.fillStyle=t.background??"rgba(2, 6, 23, 0.88)";const y=22;o.beginPath(),o.moveTo(y,0),o.lineTo(r.width-y,0),o.quadraticCurveTo(r.width,0,r.width,y),o.lineTo(r.width,r.height-y),o.quadraticCurveTo(r.width,r.height,r.width-y,r.height),o.lineTo(y,r.height),o.quadraticCurveTo(0,r.height,0,r.height-y),o.lineTo(0,y),o.quadraticCurveTo(0,0,y,0),o.closePath(),o.fill(),o.strokeStyle=t.border??"rgba(255,255,255,0.22)",o.lineWidth=3,o.stroke(),l.forEach((x,v)=>{o.fillStyle=v===0?t.color??"#ecfeff":t.subColor??"#cbd5e1",o.fillText(x,r.width/2,p+c/2+v*(c+5))});const g=new s.CanvasTexture(r);g.colorSpace=s.SRGBColorSpace;const S=new s.SpriteMaterial({map:g,transparent:!0,depthTest:!1,depthWrite:!1}),E=new s.Sprite(S),A=t.scale??.18;return E.scale.set(r.width*A,r.height*A,1),E}function xT(s){return s==null||!Number.isFinite(Number(s))?"--":`${Number(s).toFixed(1)}s`}function us(s){return s==null||s===""||!Number.isFinite(Number(s))?"--":Number(s).toFixed(7)}function Is(s,e=2,t=""){return s==null||s===""||!Number.isFinite(Number(s))?"--":`${Number(s).toFixed(e)}${t}`}function yT(s){if(!s)return"--";const e=String(s),t=e.match(/:(\d+)$/);return e.includes("udp")&&t?`UDP ${t[1]}`:e}function ST(s,e){return Number.isFinite(Number(s?.altitude_m))?Math.max(0,Number(s.altitude_m)):Number.isFinite(Number(e?.relative_altitude_m))?Math.max(0,Number(e.relative_altitude_m)):0}function Du(s){if(!Number.isFinite(Number(s)))return"-- m";const e=Number(s);return Math.abs(e)>=100?`${e.toFixed(0)} m`:`${e.toFixed(1)} m`}function rs(s){if(s===""||s===null||s===void 0)return null;const e=Number(s);return Number.isFinite(e)?e:null}function Sh(s,e){const t=Array.isArray(s)?s.find(o=>o.type==="takeoff"&&Number.isFinite(Number(o.altitude_m))):null;if(t)return Number(t.altitude_m);const r=Oa(e??Zo);return Number.isFinite(Number(r.relative_altitude_m))&&Number(r.relative_altitude_m)>.5?Number(r.relative_altitude_m):20}function MT(s,e,t=[]){const r=Oa(e??Zo),o=r.latitude_deg??"",l=r.longitude_deg??"",c=Sh(t,e??Zo),f=Number.isFinite(Number(c))?Number(c):20;return s==="waypoint"?{type:s,name:"Waypoint",latitude_deg:o,longitude_deg:l,altitude_m:f,hold_time_s:0}:s==="hold"?{type:s,name:"Hold",latitude_deg:"",longitude_deg:"",altitude_m:"",hold_time_s:5}:s==="takeoff"?{type:s,name:"Takeoff",latitude_deg:"",longitude_deg:"",altitude_m:f,hold_time_s:0}:s==="land"?{type:s,name:"Land",latitude_deg:"",longitude_deg:"",altitude_m:"",hold_time_s:0}:s==="changeSettings"?{type:s,name:"Change Settings",latitude_deg:"",longitude_deg:"",altitude_m:"",hold_time_s:0,reset_all:!1,horizontal_velocity_m_s:"",vertical_velocity_m_s:"",max_heading_rate_deg_s:""}:s==="servoPulse"?{type:s,name:"Servo Pulse",latitude_deg:"",longitude_deg:"",altitude_m:"",hold_time_s:0,servo_channel:1,servo_pwm_on_us:1900,servo_pwm_off_us:1500,servo_period_s:.5,servo_on_duration_s:.2}:s==="customAction"?{type:s,name:"Custom Action",latitude_deg:"",longitude_deg:"",altitude_m:"",hold_time_s:0,custom_type:"customAction",custom_json:"{}"}:{type:s,name:s.toUpperCase(),latitude_deg:"",longitude_deg:"",altitude_m:"",hold_time_s:0}}function ET(s,e,t){return{mission:{name:s,defaults:{horizontal_velocity_m_s:Number(e.horizontal_velocity_m_s),vertical_velocity_m_s:Number(e.vertical_velocity_m_s),max_heading_rate_deg_s:Number(e.max_heading_rate_deg_s)},items:t.map(r=>({type:r.type,name:r.name,latitude_deg:rs(r.latitude_deg),longitude_deg:rs(r.longitude_deg),altitude_m:rs(r.altitude_m),hold_time_s:Number(r.hold_time_s||0),reset_all:!!r.reset_all,horizontal_velocity_m_s:rs(r.horizontal_velocity_m_s),vertical_velocity_m_s:rs(r.vertical_velocity_m_s),max_heading_rate_deg_s:rs(r.max_heading_rate_deg_s),servo_channel:Number(r.servo_channel||1),servo_pwm_on_us:Number(r.servo_pwm_on_us||1900),servo_pwm_off_us:Number(r.servo_pwm_off_us||1500),servo_period_s:Number(r.servo_period_s||.5),servo_on_duration_s:Number(r.servo_on_duration_s||.2),custom_type:r.custom_type||"customAction",custom_json:r.custom_json||"{}"}))}}}async function Us(s,e={}){const t=await fetch(`${rT}${s}`,{headers:{"Content-Type":"application/json",...e.headers??{}},...e}),r=await t.json().catch(()=>({}));if(!t.ok)throw new Error(r.detail??"Request failed");return r}function an({name:s,className:e="",...t}){return P.jsx("span",{className:`material-symbols-rounded select-none ${e}`,...t,children:s})}function Ua({icon:s,label:e,tone:t="zinc",disabled:r=!1,onClick:o}){const l={zinc:"border-white/10 bg-white/10 text-zinc-100 hover:bg-white/20",cyan:"border-cyan-300/30 bg-cyan-400/15 text-cyan-50 hover:bg-cyan-400/25",emerald:"border-emerald-300/30 bg-emerald-400/15 text-emerald-50 hover:bg-emerald-400/25",amber:"border-amber-300/30 bg-amber-400/15 text-amber-50 hover:bg-amber-400/25",rose:"border-rose-300/30 bg-rose-400/15 text-rose-50 hover:bg-rose-400/25"};return P.jsxs("button",{type:"button",disabled:r,onPointerDown:c=>c.stopPropagation(),onClick:c=>{c.stopPropagation(),o?.(c)},className:`inline-flex items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${l[t]}`,children:[s?P.jsx(an,{name:s,className:"text-[20px]"}):null,e?P.jsx("span",{children:e}):null]})}function Gi({icon:s,label:e,onClick:t,disabled:r=!1}){return P.jsx("button",{type:"button",title:e,disabled:r,onPointerDown:o=>o.stopPropagation(),onClick:o=>{o.stopPropagation(),t?.(o)},className:"grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-zinc-950/80 text-zinc-100 shadow-[0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-sm transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40",children:P.jsx(an,{name:s,className:"text-[21px]"})})}function mn({label:s,children:e}){return P.jsxs("label",{className:"grid gap-1.5",children:[P.jsx("span",{className:"text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500",children:s}),e]})}const TT=at.memo(function({status:e,missionItems:t,selectedIndex:r,activeMapPickIndex:o,flightTrack:l,onSelectItem:c,onUpdateWaypointFromMap:f,onClearMapPick:p,onClearFlightTrack:m}){const _=at.useRef(null),y=at.useRef(null),g=at.useRef(null),S=at.useRef(null),E=at.useRef(null),A=at.useRef(null),x=at.useRef(null),v=at.useRef(null),C=at.useRef(null),U=at.useRef(null),R=at.useRef(null),G=at.useRef(null),D=at.useRef(null),V=at.useRef(null),w=at.useRef({mode:"idle",pointerId:null,lastX:0,lastY:0,startX:0,startY:0,moved:!1,selectedIndex:null,draftCoordinate:null,dragOffsetX:0,dragOffsetZ:0,startAltitudeM:0,dragGesture:null}),I=at.useRef({azimuth:-2.35,elevation:.82,distance:210,target:new Z(0,0,0)}),X=at.useRef(b0),k=at.useRef(!1),K=at.useRef(new Map),le=at.useRef(null),ue=at.useRef(""),W=at.useRef([]),$=at.useRef(null),Y=at.useRef(null),Q=at.useRef(""),[pe,me]=at.useState(b0),[z,ne]=at.useState({left:24,top:24,visible:!1,source:"none"}),Le=Oa(e),We=$h(e),ze=xn(Le.latitude_deg,Le.longitude_deg),ce=Number.isInteger(o)?t[o]:null,Te=Rr(ce),ve=18;at.useEffect(()=>{if(k.current)return;const L=t.find(ie=>xn(ie.latitude_deg,ie.longitude_deg)),O=L?{latitude_deg:Number(L.latitude_deg),longitude_deg:Number(L.longitude_deg)}:ze?{latitude_deg:Number(Le.latitude_deg),longitude_deg:Number(Le.longitude_deg)}:null;O&&(k.current=!0,X.current=O,me(O))},[t,ze,Le.latitude_deg,Le.longitude_deg]);function Ve(L){ne(O=>{const ie=Math.round(Number(L.left)||0),ae=Math.round(Number(L.top)||0),he=!!L.visible,Ue=L.source||"marker";return O.left===ie&&O.top===ae&&O.visible===he&&O.source===Ue?O:{left:ie,top:ae,visible:he,source:Ue}})}function et(L,O){const ie=_.current;return ie?{left:$n(L,12,Math.max(12,ie.clientWidth-310-12)),top:$n(O,12,Math.max(12,ie.clientHeight-138-12)),visible:!0}:{left:L,top:O,visible:!1}}function rt(L){const O=_.current;if(!O)return;const ie=O.getBoundingClientRect(),ae=et(L.clientX-ie.left+18,L.clientY-ie.top+18);Ve({...ae,source:"cursor"})}function Pt(){const L=S.current;if(!L)return;const O=I.current;O.elevation=$n(O.elevation,.18,1.45),O.distance=$n(O.distance,18,1200);const ie=Math.cos(O.elevation)*O.distance;L.position.set(O.target.x+Math.cos(O.azimuth)*ie,O.target.y+Math.sin(O.elevation)*O.distance,O.target.z+Math.sin(O.azimuth)*ie),L.lookAt(O.target)}function ht(L,O=null){I.current.target.copy(L),Number.isFinite(Number(O))&&(I.current.distance=Number(O)),Pt()}function Et(L){I.current.distance=$n(I.current.distance+L,18,1200),Pt()}function At(){I.current.azimuth=-2.35,I.current.elevation=.82,I.current.distance=210,Pt()}function Se(){if(!_.current||!E.current||!S.current)return;const L=Math.max(320,_.current.clientWidth),O=Math.max(360,_.current.clientHeight);S.current.aspect=L/O,S.current.updateProjectionMatrix(),E.current.setSize(L,O,!1)}function Ce(L){if(!_.current||!S.current||!V.current)return null;const O=_.current.getBoundingClientRect(),ie=new vt((L.clientX-O.left)/O.width*2-1,-((L.clientY-O.top)/O.height*2-1));V.current.setFromCamera(ie,S.current);const ae=new wr(new Z(0,1,0),0),he=new Z;return V.current.ray.intersectPlane(ae,he)?he:null}function He(L){let O=L;for(;O;){if(Number.isInteger(O.userData?.index))return O.userData;O=O.parent}return null}function st(L){if(!_.current||!S.current||!V.current||!x.current)return null;const O=_.current.getBoundingClientRect(),ie=new vt((L.clientX-O.left)/O.width*2-1,-((L.clientY-O.top)/O.height*2-1));V.current.setFromCamera(ie,S.current);const ae=V.current.intersectObjects(x.current.children,!0);for(const he of ae){const Ue=He(he.object);if(Ue)return{hit:he,userData:Ue}}return null}function H(L,O,ie={}){if(!O||!Number.isInteger(L))return;const ae=Io(O.x,O.z,X.current);f(L,ae.latitude_deg,ae.longitude_deg,ie)}function xt(){const L=le.current;if(!L)return;const O=W.current.map(ie=>new Z(ie.x,ie.y,ie.z));O.length<=1||(L.geometry.dispose(),L.geometry=new cn().setFromPoints(O))}function dt(L,O={}){if(!Number.isInteger(L))return null;const ie=K.current.get(L),ae=t[L];if(!ie||!ae||!Rr(ae))return null;const he=Number.isFinite(Number(O.latitude_deg))&&Number.isFinite(Number(O.longitude_deg))?{latitude_deg:Number(O.latitude_deg),longitude_deg:Number(O.longitude_deg)}:Io(ie.group.position.x,ie.group.position.z,X.current),Ue=Number.isFinite(Number(O.altitude_m))?Number(O.altitude_m):Number.isFinite(Number(ae.altitude_m))?Number(ae.altitude_m):Number(ie.altitudeY||0);return{index:L,name:ie.markerInfo?.label||ae.name||ae.type||`Step ${L+1}`,latitude_deg:he.latitude_deg,longitude_deg:he.longitude_deg,altitude_m:Ue,dragMode:O.dragMode||"hover"}}function Tt(L=Y.current){if(!Number.isInteger(L))return;const O=K.current.get(L);O?.infoSprite&&(O.group.remove(O.infoSprite),Da(O.infoSprite),O.infoSprite=null),Y.current===L&&(Y.current=null,Q.current="")}function Oe(L,O,ie="hover"){const ae=K.current.get(L);if(!ae||!O)return;const he=[`${O.name}  #${L+1}`,`Lat ${us(O.latitude_deg)}`,`Lon ${us(O.longitude_deg)}`,`Alt ${Du(O.altitude_m)}`].join(`
`),Ue=`${L}|${ie}|${he}`;if(Y.current!==L&&Tt(Y.current),ae.infoSprite&&Q.current===Ue)return;Tt(L);const Ne=oh(ah,he,{color:ie==="drag"?"#fef3c7":"#ecfeff",subColor:"#dbeafe",background:ie==="drag"?"rgba(20, 16, 4, 0.76)":"rgba(2, 6, 23, 0.72)",border:ie==="drag"?"rgba(251, 191, 36, 0.55)":"rgba(34, 211, 238, 0.34)",scale:.032,fontSize:30});Ne.position.set(0,5.2,0),Ne.renderOrder=30,Ne.userData={type:"mission-info",index:L},ae.infoSprite=Ne,ae.group.add(Ne),Y.current=L,Q.current=Ue}function Gt(L){if(w.current.mode!=="idle")return;const ie=st(L),ae=Number.isInteger(ie?.userData?.index)?ie.userData.index:null,he=Number.isInteger(ae)?t[ae]:null;if(!Number.isInteger(ae)||!Rr(he)){Number.isInteger($.current)&&Tt($.current),$.current=null;return}$.current=ae,Oe(ae,dt(ae),"hover")}function N(L,O,ie="xy"){if(!O||!Number.isInteger(L))return null;const ae=K.current.get(L),he=W.current.find(B=>B.index===L);if(!ae||!he)return null;ae.group.position.x=O.x,ae.group.position.z=O.z,he.x=O.x,he.z=O.z,xt();const Ue=Io(O.x,O.z,X.current),Ne=t[L],Ye={index:L,name:Ne?.name||Ne?.type||`Step ${L+1}`,latitude_deg:Ue.latitude_deg,longitude_deg:Ue.longitude_deg,altitude_m:Ne?.altitude_m,dragMode:ie};return Oe(L,Ye,"drag"),Ye}function M(L,O,ie="altitude"){if(!Number.isInteger(L)||!Number.isFinite(Number(O)))return null;const ae=K.current.get(L),he=W.current.find(ge=>ge.index===L);if(!ae||!he)return null;const Ue=$n(Number(O),0,500),Ne=Math.max(.65,Ue);ae.group.position.y=Ne,ae.altitudeY=Ne,he.y=Ne,xt();const Ye=Io(ae.group.position.x,ae.group.position.z,X.current),B=t[L],Me={index:L,name:B?.name||B?.type||`Step ${L+1}`,latitude_deg:Ye.latitude_deg,longitude_deg:Ye.longitude_deg,altitude_m:Number(Ue.toFixed(2)),dragMode:ie};return Oe(L,Me,"drag"),Me}at.useEffect(()=>{if(!_.current||!y.current)return;const L=_.current,O=y.current,ie=Math.max(320,L.clientWidth),ae=Math.max(360,L.clientHeight),he=new p_;he.background=new St(398106),he.fog=new zc(398106,420,1300);const Ue=new mi(50,ie/ae,.1,2500),Ne=new j_({antialias:!0,alpha:!1,powerPreference:"high-performance"});Ne.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6)),Ne.setSize(ie,ae,!1),Ne.domElement.style.width="100%",Ne.domElement.style.height="100%",Ne.domElement.style.display="block",Ne.outputColorSpace=Kn,O.appendChild(Ne.domElement);const Ye=new C_(14679039,988970,1.25),B=new P_(16777215,1.1);B.position.set(120,220,90),he.add(Ye,B);const Me=new Bi,ge=new Bi,Be=new Bi,be=new Bi,ye=new Bi;he.add(ge,Me,Be,be,ye);const qe=new I_(520,52,2282478,1981e3);qe.material.transparent=!0,qe.material.opacity=.22,Me.add(qe);const ut=new F_(32);ut.position.set(-220,.6,-220),Me.add(ut),g.current=he,S.current=Ue,E.current=Ne,A.current=ge,x.current=Be,v.current=Me,U.current=be,C.current=ye,D.current=new R_,D.current.setCrossOrigin("anonymous"),V.current=new D_,Pt();function Ut(){R.current=window.requestAnimationFrame(Ut),Ne.render(he,Ue)}return Ut(),typeof ResizeObserver<"u"&&(G.current=new ResizeObserver(()=>Se()),G.current.observe(L)),()=>{R.current&&(window.cancelAnimationFrame(R.current),R.current=null),G.current&&(G.current.disconnect(),G.current=null),Da(he),Ne.dispose(),Ne.domElement.parentNode===O&&O.removeChild(Ne.domElement),g.current=null,S.current=null,E.current=null,A.current=null,x.current=null,v.current=null,U.current=null,C.current=null,D.current=null,V.current=null}},[]),at.useEffect(()=>{const L=pe;X.current=L;const O=A.current,ie=x.current,ae=D.current;if(!O||!ie||!ae)return;ie.children.forEach(_t=>Da(_t)),ie.clear();const he={takeoff:3462041,waypoint:2282478,hold:16436245,land:10980346,rtl:16478597},Ue=[L];t.forEach((_t,Lt)=>{const Wt=A0(_t,Lt,t,null);Wt&&xn(Wt.latitude_deg,Wt.longitude_deg)&&Ue.push(Wt)});const Ne=Ue.map(_t=>R0(_t.latitude_deg,_t.longitude_deg,ve)),Ye=R0(L.latitude_deg,L.longitude_deg,ve),B=Math.floor(Math.min(...Ne.map(_t=>_t.x))/wi)-2,Me=Math.floor(Math.max(...Ne.map(_t=>_t.x))/wi)+2,ge=Math.floor(Math.min(...Ne.map(_t=>_t.y))/wi)-2,Be=Math.floor(Math.max(...Ne.map(_t=>_t.y))/wi)+2,be=Math.floor(Ye.x/wi),ye=Math.floor(Ye.y/wi),qe=$n(B,be-4,be+4),ut=$n(Me,be-4,be+4),Ut=$n(ge,ye-4,ye+4),Nt=$n(Be,ye-4,ye+4),dn=2**ve,Vn=`${ve}:${qe}:${ut}:${Ut}:${Nt}:${L.latitude_deg.toFixed(7)}:${L.longitude_deg.toFixed(7)}`;if(ue.current!==Vn){ue.current=Vn,O.children.forEach(Lt=>Da(Lt)),O.clear();for(let Lt=qe;Lt<=ut;Lt+=1)for(let Wt=Ut;Wt<=Nt;Wt+=1){if(Wt<0||Wt>=dn)continue;const Gn=(Lt%dn+dn)%dn,Hn=C0(Lt*wi,Wt*wi,ve),Rn=C0((Lt+1)*wi,(Wt+1)*wi,ve),li=Ds(Hn,L),Dn=Ds(Rn,L),_i=Math.max(1,Math.abs(Dn.x-li.x)),Wn=Math.max(1,Math.abs(Dn.z-li.z)),gn=ae.load(vT(ve,Gn,Wt));gn.colorSpace=Kn,gn.anisotropy=4;const Lr=new bi({map:gn,transparent:!1,toneMapped:!1}),Zi=new ln(new Ws(_i,Wn),Lr);Zi.rotation.x=-Math.PI/2,Zi.position.set((li.x+Dn.x)/2,-.04,(li.z+Dn.z)/2),O.add(Zi)}const _t=new ln(new Ws(900,900),new bi({color:726816,transparent:!0,opacity:.42}));_t.rotation.x=-Math.PI/2,_t.position.y=-.08,O.add(_t)}const Jn=[];let $i=0;const Ki=new Map;if(t.forEach((_t,Lt)=>{_t.type==="waypoint"&&($i+=1);const Wt=A0(_t,Lt,t,null);if(!Wt||!xn(Wt.latitude_deg,Wt.longitude_deg))return;const Gn=Ds(Wt,L),Hn=ST(_t,null),Rn=Math.max(.65,Hn),li=_t.type==="waypoint"?`WP${$i}`:dT[_t.type]??_t.type.toUpperCase(),Dn=he[_t.type]??he.waypoint,_i=r===Lt,Wn=_t.type==="takeoff"||_t.type==="land"?1.22:1.05,gn=new Bi;gn.position.set(Gn.x,Rn,Gn.z),gn.userData={type:"mission",index:Lt,altitudeY:Rn},ie.add(gn);const Lr=new mh({color:Dn,roughness:.28,metalness:.16,emissive:Dn,emissiveIntensity:_i||Lt===o?.58:.18}),Zi=new ln(new Ar(Wn,Wn,.46,36),Lr);Zi.userData={type:"mission",index:Lt},gn.add(Zi);const ms=new ln(new Ko(Wn+.3,.055,8,42),new bi({color:Dn,transparent:!0,opacity:_i||Lt===o?.95:.55}));if(ms.rotation.x=Math.PI/2,ms.userData={type:"mission",index:Lt},gn.add(ms),Rn>1.2){const In=new ln(new Ar(.075,.075,Rn,8),new bi({color:Dn,transparent:!0,opacity:.32}));In.position.set(0,-Rn/2,0),gn.add(In)}const jt=oh(ah,`${li}
${Du(Hn)}`,{color:_t.type==="waypoint"?"#020617":"#f8fafc",subColor:_t.type==="waypoint"?"#0f172a":"#e2e8f0",background:_t.type==="waypoint"?"rgba(34, 211, 238, 0.94)":"rgba(2, 6, 23, 0.88)",border:_i||Lt===o?"rgba(255,255,255,0.90)":"rgba(255,255,255,0.24)",scale:.056,fontSize:32});if(jt.position.set(0,3.1,0),jt.userData={type:"mission",index:Lt},gn.add(jt),Wt.fromFallback){const In=new ln(new Gc(.36,12,8),new bi({color:16777215}));In.position.set(-Wn-.42,.65,-Wn-.42),gn.add(In)}if((_i||Lt===o)&&Rr(_t)){const In=new ln(new Ar(Wn+.62,Wn+.62,.08,48),new bi({color:16777215,transparent:!0,opacity:.14,depthTest:!1}));In.position.y=-.34,In.renderOrder=18,In.userData={type:"mission",index:Lt},gn.add(In)}const Xs={x:Gn.x,y:Rn,z:Gn.z,index:Lt,item:_t,label:li,waypointOrder:$i};Jn.push(Xs),Ki.set(Lt,{group:gn,altitudeY:Rn,markerInfo:Xs,infoSprite:null})}),K.current=Ki,W.current=Jn,le.current=null,Jn.length>1){const _t=new cn().setFromPoints(Jn.map(Gn=>new Z(Gn.x,Gn.y,Gn.z))),Lt=new Gs({color:2282478,transparent:!0,opacity:.92}),Wt=new $o(_t,Lt);ie.add(Wt),le.current=Wt}},[pe,t,r,o]),at.useEffect(()=>{const L=U.current;if(!L)return;L.children.forEach(ie=>Da(ie)),L.clear();const O=(l??[]).filter(ie=>xn(ie.latitude_deg,ie.longitude_deg)).map(ie=>{const ae=Ds(ie,X.current),he=Number.isFinite(Number(ie.relative_altitude_m))?Math.max(.65,Number(ie.relative_altitude_m)):.65;return new Z(ae.x,he,ae.z)});if(O.length>1){const ie=new cn().setFromPoints(O),ae=new Gs({color:1096065,transparent:!0,opacity:.9});L.add(new $o(ie,ae))}},[l]),at.useEffect(()=>{const L=C.current;if(!L||(L.children.forEach(be=>Da(be)),L.clear(),!ze))return;const O=Ds(Le,X.current),ie=Number.isFinite(Number(Le.relative_altitude_m))?Math.max(.65,Number(Le.relative_altitude_m)):.65,ae=new Z(O.x,ie,O.z),he=new mh({color:1096065,roughness:.2,metalness:.22,emissive:1096065,emissiveIntensity:.68}),Ue=new ln(new Ar(1.42,1.42,.54,42),he);Ue.position.copy(ae),L.add(Ue);const Ne=new ln(new Ko(2.05,.075,8,48),new bi({color:8843180,transparent:!0,opacity:.82}));if(Ne.rotation.x=Math.PI/2,Ne.position.copy(ae),L.add(Ne),ie>1.2){const be=new ln(new Ar(.095,.095,ie,8),new bi({color:8843180,transparent:!0,opacity:.3}));be.position.set(O.x,ie/2,O.z),L.add(be)}const B=(Number.isFinite(Number(We.headingDeg))?Number(We.headingDeg):0)*Math.PI/180,Me=new Z(Math.sin(B),0,-Math.cos(B)).normalize(),ge=new U_(Me,ae.clone().add(new Z(0,.76,0)),4.5,15793652,1.25,.72);L.add(ge);const Be=oh(ah,`UAV
${Du(ie)}`,{color:"#ecfdf5",subColor:"#bbf7d0",background:"rgba(2, 6, 23, 0.92)",border:"rgba(134,239,172,0.82)",scale:.056,fontSize:32});Be.position.set(O.x,ie+3.8,O.z),L.add(Be)},[ze,Le.latitude_deg,Le.longitude_deg,Le.relative_altitude_m,Le.altitude_amsl_m,We.headingDeg]);function ee(){if(!ze)return;const L=Ds(Le,X.current);ht(new Z(L.x,0,L.z),170)}function xe(){const L=[...W.current];if(ze){const Ye=Ds(Le,X.current);L.push({x:Ye.x,y:Number(Le.relative_altitude_m)||0,z:Ye.z})}if(L.length===0){At();return}const O=Math.min(...L.map(Ye=>Ye.x)),ie=Math.max(...L.map(Ye=>Ye.x)),ae=Math.min(...L.map(Ye=>Ye.z)),he=Math.max(...L.map(Ye=>Ye.z)),Ue=new Z((O+ie)/2,0,(ae+he)/2),Ne=Math.max(ie-O,he-ae,80);ht(Ue,$n(Ne*1.55,90,850))}function Ee(L){if(L.button!==0&&L.button!==1&&L.button!==2)return;const O=L.button===0?st(L):null;if(O){L.stopPropagation();const ie=O.userData.index,ae=t[ie],he=K.current.get(ie),Ue=Ce(L),Ne=Rr(ae),Ye=Ne?"marker-combo-drag":"marker-select",B=Number.isFinite(Number(ae?.altitude_m))?Number(ae.altitude_m):he?.altitudeY??0;if(w.current={mode:Ye,pointerId:L.pointerId,lastX:L.clientX,lastY:L.clientY,startX:L.clientX,startY:L.clientY,moved:!1,selectedIndex:ie,draftCoordinate:null,dragOffsetX:he&&Ue?he.group.position.x-Ue.x:0,dragOffsetZ:he&&Ue?he.group.position.z-Ue.z:0,startAltitudeM:B,dragGesture:null},Ne&&he){$.current=ie;const Me=Io(he.group.position.x,he.group.position.z,X.current);Oe(ie,{name:he.markerInfo?.label||ae?.name||ae?.type||`Step ${ie+1}`,latitude_deg:Me.latitude_deg,longitude_deg:Me.longitude_deg,altitude_m:B},"drag")}L.currentTarget.setPointerCapture(L.pointerId);return}w.current={mode:Te&&L.button===0?"pick":L.shiftKey||L.button===1||L.button===2?"pan":"orbit",pointerId:L.pointerId,lastX:L.clientX,lastY:L.clientY,startX:L.clientX,startY:L.clientY,moved:!1,selectedIndex:null,draftCoordinate:null,dragOffsetX:0,dragOffsetZ:0,startAltitudeM:0,dragGesture:null},L.currentTarget.setPointerCapture(L.pointerId)}function Pe(L){const O=w.current;if(O.mode==="idle"){Gt(L);return}if(O.pointerId!==L.pointerId)return;const ie=L.clientX-O.lastX,ae=L.clientY-O.lastY;O.lastX=L.clientX,O.lastY=L.clientY;const he=L.clientX-O.startX,Ue=L.clientY-O.startY;if(O.mode==="marker-combo-drag"?Math.abs(he)+Math.abs(Ue)>7&&(O.moved=!0):Math.abs(ie)+Math.abs(ae)>3&&(O.moved=!0),O.mode==="marker-combo-drag"&&Number.isInteger(O.selectedIndex)){const Ne=Math.abs(he),Ye=Math.abs(Ue);if(!O.dragGesture&&Ne+Ye>7&&(O.dragGesture=Ye>Ne*1.15?"altitude":"xy"),O.dragGesture==="altitude"){const ge=$n(I.current.distance*2e-4,.015,.08),Be=O.startAltitudeM-Ue*ge,be=M(O.selectedIndex,Be,"altitude");be&&(O.draftCoordinate=be);return}const B=Ce(L);B&&(B.x+=O.dragOffsetX||0,B.z+=O.dragOffsetZ||0);const Me=N(O.selectedIndex,B,O.dragGesture==="xy"?"xy":"auto");Me&&(O.draftCoordinate=Me,rt(L));return}if(O.mode==="orbit"){I.current.azimuth+=ie*.007,I.current.elevation=$n(I.current.elevation+ae*.0045,.18,1.45),Pt();return}if(O.mode==="pan"){const Ne=S.current;if(!Ne)return;const Ye=new Z().setFromMatrixColumn(Ne.matrix,0),B=new Z;Ne.getWorldDirection(B),B.y=0,B.normalize();const Me=I.current.distance*.0026;I.current.target.add(Ye.multiplyScalar(-ie*Me)),I.current.target.add(B.multiplyScalar(ae*Me)),Pt()}}function Ie(L){const O=w.current;if(!(O.mode==="idle"||O.pointerId!==L.pointerId)){if(O.mode==="pick"&&!O.moved&&Number.isInteger(o)){const ie=Ce(L);H(o,ie)}if(O.mode==="marker-combo-drag"&&O.moved&&Number.isInteger(O.selectedIndex)&&O.draftCoordinate){const ie=O.dragGesture==="altitude"?{altitude_m:O.draftCoordinate.altitude_m,silent:!1}:{silent:!1};f(O.selectedIndex,O.draftCoordinate.latitude_deg,O.draftCoordinate.longitude_deg,ie),c(O.selectedIndex)}(O.mode==="marker-select"||O.mode==="marker-combo-drag")&&!O.moved&&Number.isInteger(O.selectedIndex)&&c(O.selectedIndex),Number.isInteger(O.selectedIndex)&&Tt(O.selectedIndex),window.requestAnimationFrame(()=>Gt(L)),w.current={mode:"idle",pointerId:null,lastX:0,lastY:0,startX:0,startY:0,moved:!1,selectedIndex:null,draftCoordinate:null,dragOffsetX:0,dragOffsetZ:0,startAltitudeM:0,dragGesture:null}}}function _e(L){L.preventDefault(),Et(L.deltaY*.18)}return P.jsxs("div",{ref:_,role:"application","aria-label":"True Three.js 3D mission map planner with direct waypoint drag",onPointerDown:Ee,onPointerMove:Pe,onPointerUp:Ie,onPointerCancel:Ie,onPointerLeave:()=>{Number.isInteger($.current)&&Tt($.current),$.current=null},onWheel:_e,onContextMenu:L=>L.preventDefault(),className:`relative h-full w-full touch-none select-none overflow-hidden bg-[#06131a] ${Te?"cursor-crosshair":"cursor-grab active:cursor-grabbing"}`,children:[P.jsx("div",{ref:y,className:"pointer-events-none absolute inset-0 z-0"}),P.jsxs("div",{className:"pointer-events-none absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full border border-cyan-300/20 bg-zinc-950/62 px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-cyan-100 shadow-xl backdrop-blur-sm",children:[P.jsx(an,{name:"deployed_code",className:"text-[17px]"}),"3D Mission Map"]}),Te?P.jsxs("div",{className:"pointer-events-none absolute left-5 top-[56px] z-10 rounded-2xl border border-amber-300/35 bg-amber-400/12 px-3 py-2 text-xs font-bold text-amber-50 shadow-xl backdrop-blur-sm",children:["Chọn vị trí step #",o+1,": click mặt sàn hoặc kéo marker."]}):null,P.jsxs("div",{className:"pointer-events-auto absolute bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1.5 rounded-3xl border border-white/15 bg-zinc-950/82 p-1.5 shadow-[0_16px_45px_rgba(0,0,0,0.40)] backdrop-blur-sm",children:[P.jsx(Gi,{icon:"add",label:"Zoom in",onClick:()=>Et(-28)}),P.jsx(Gi,{icon:"remove",label:"Zoom out",onClick:()=>Et(28)}),P.jsx(Gi,{icon:"my_location",label:"Center UAV",disabled:!ze,onClick:ee}),P.jsx(Gi,{icon:"route",label:"Fit mission",onClick:xe}),P.jsx(Gi,{icon:"center_focus_strong",label:"Reset camera",onClick:At}),Te?P.jsx(Gi,{icon:"close",label:"Tắt chọn vị trí",onClick:p}):null]})]})},(s,e)=>s.status===e.status&&s.missionItems===e.missionItems&&s.selectedIndex===e.selectedIndex&&s.activeMapPickIndex===e.activeMapPickIndex&&s.flightTrack===e.flightTrack);function wT({item:s,index:e,expanded:t,dragOver:r,compactInputClass:o,onSelect:l,onChange:c,onRemove:f,onApplyLivePosition:p,onDragStart:m,onDragOver:_,onDrop:y,onDragEnd:g}){const S=Rr(s),E=s.type==="hold",A=s.type==="takeoff",x=s.type==="rtl",v=s.type==="changeSettings",C=s.type==="servoPulse",U=s.type==="customAction";return P.jsxs("div",{onDragOver:R=>_(R,e),onDrop:R=>y(R,e),onDragEnd:g,className:`overflow-hidden rounded-3xl border transition ${t?"border-cyan-300/60 bg-cyan-400/[0.10] shadow-[0_18px_45px_rgba(34,211,238,0.10)]":r?"border-amber-300/70 bg-amber-400/[0.10]":"border-white/10 bg-zinc-950/62 hover:bg-white/[0.08]"}`,children:[P.jsx("button",{type:"button",onClick:()=>l(e),className:"w-full px-3 py-3 text-left",children:P.jsxs("div",{className:"flex items-center gap-3",children:[P.jsx("span",{draggable:!0,onPointerDown:R=>R.stopPropagation(),onDragStart:R=>m(R,e),onDragEnd:g,className:"grid h-9 w-9 shrink-0 cursor-grab place-items-center rounded-2xl border border-white/10 bg-white/8 text-zinc-300 active:cursor-grabbing",title:"Kéo để đổi thứ tự",children:P.jsx(an,{name:cT[s.type]??"radio_button_checked",className:"text-[21px]"})}),P.jsxs("div",{className:"min-w-0 flex-1",children:[P.jsxs("div",{className:"flex items-center justify-between gap-3",children:[P.jsx("strong",{className:"truncate text-sm text-zinc-100",children:s.name||s.type}),P.jsxs("span",{className:"rounded-full bg-white/8 px-2 py-1 text-[10px] font-black text-zinc-300",children:["#",e+1]})]}),P.jsxs("div",{className:"mt-1 flex items-center gap-2 text-[11px] text-zinc-500",children:[P.jsx(an,{name:"drag_indicator",className:"text-[16px]"}),P.jsx("span",{children:s.type.toUpperCase()}),S?P.jsxs("span",{className:"truncate",children:["· ",us(s.latitude_deg),", ",us(s.longitude_deg)]}):null,A?P.jsxs("span",{className:"truncate",children:["· target ",Du(s.altitude_m)," AGL"]}):null,C?P.jsxs("span",{className:"truncate",children:["· CH ",s.servo_channel??"--"," PWM ",s.servo_pwm_on_us??"--"]}):null,U?P.jsxs("span",{className:"truncate",children:["· ",s.custom_type||"customAction"]}):null]})]}),P.jsx(an,{name:"keyboard_arrow_down",className:`text-[26px] text-zinc-400 transition ${t?"rotate-180":""}`})]})}),t?P.jsxs("div",{className:"grid gap-3 border-t border-white/10 px-3 pb-4 pt-3",children:[P.jsxs("div",{className:"grid grid-cols-[1fr_auto] gap-2",children:[P.jsx(mn,{label:"Name",children:P.jsx("input",{value:s.name,onChange:R=>c(e,"name",R.target.value),className:o})}),P.jsx("button",{type:"button",onPointerDown:R=>R.stopPropagation(),onClick:R=>{R.stopPropagation(),f(e)},className:"mt-[22px] grid h-[42px] w-[42px] place-items-center rounded-2xl border border-rose-300/30 bg-rose-400/10 text-rose-100 transition hover:bg-rose-400/20",title:"Xóa step này",children:P.jsx(an,{name:"delete",className:"text-[21px]"})})]}),A?P.jsxs(P.Fragment,{children:[P.jsx(mn,{label:"Target Altitude (m AGL)",children:P.jsx("input",{value:s.altitude_m,onChange:R=>c(e,"altitude_m",R.target.value),className:o})}),P.jsx("div",{className:"rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-3 py-3 text-xs font-semibold text-emerald-100",children:"Takeoff dùng độ cao tương đối so với home và chạy qua PX4 takeoff mode."})]}):S?P.jsxs(P.Fragment,{children:[P.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[P.jsx(mn,{label:"Lat",children:P.jsx("input",{value:s.latitude_deg,onChange:R=>c(e,"latitude_deg",R.target.value),className:o})}),P.jsx(mn,{label:"Lon",children:P.jsx("input",{value:s.longitude_deg,onChange:R=>c(e,"longitude_deg",R.target.value),className:o})})]}),P.jsx(mn,{label:"Relative Alt (m AGL)",children:P.jsx("input",{value:s.altitude_m,onChange:R=>c(e,"altitude_m",R.target.value),className:o})}),P.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[P.jsx(Ua,{icon:"my_location",label:"Use UAV",tone:"cyan",onClick:()=>p(e)}),P.jsx(Ua,{icon:"open_with",label:"Drag on map",tone:"amber",onClick:()=>l(e)})]})]}):x?P.jsx("div",{className:"rounded-2xl border border-rose-300/20 bg-rose-400/10 px-3 py-3 text-xs font-semibold text-rose-100",children:"RTL không cần nhập tọa độ. Icon RTL được neo ngay tại vị trí drone hiện tại; nếu chưa có GPS live thì mới fallback về tọa độ đầu mission."}):v?P.jsxs(P.Fragment,{children:[P.jsxs("label",{className:"flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-950/55 px-3 py-3 text-xs font-bold text-zinc-200",children:[P.jsx("input",{type:"checkbox",checked:!!s.reset_all,onChange:R=>c(e,"reset_all",R.target.checked),className:"h-4 w-4 accent-cyan-400"}),"Reset all settings before applying values"]}),P.jsxs("div",{className:"grid grid-cols-3 gap-2",children:[P.jsx(mn,{label:"H Vel",children:P.jsx("input",{value:s.horizontal_velocity_m_s??"",onChange:R=>c(e,"horizontal_velocity_m_s",R.target.value),className:o})}),P.jsx(mn,{label:"V Vel",children:P.jsx("input",{value:s.vertical_velocity_m_s??"",onChange:R=>c(e,"vertical_velocity_m_s",R.target.value),className:o})}),P.jsx(mn,{label:"Yaw",children:P.jsx("input",{value:s.max_heading_rate_deg_s??"",onChange:R=>c(e,"max_heading_rate_deg_s",R.target.value),className:o})})]})]}):C?P.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[P.jsx(mn,{label:"Channel",children:P.jsx("input",{value:s.servo_channel??1,onChange:R=>c(e,"servo_channel",R.target.value),className:o})}),P.jsx(mn,{label:"PWM On",children:P.jsx("input",{value:s.servo_pwm_on_us??1900,onChange:R=>c(e,"servo_pwm_on_us",R.target.value),className:o})}),P.jsx(mn,{label:"PWM Off",children:P.jsx("input",{value:s.servo_pwm_off_us??1500,onChange:R=>c(e,"servo_pwm_off_us",R.target.value),className:o})}),P.jsx(mn,{label:"Period (s)",children:P.jsx("input",{value:s.servo_period_s??.5,onChange:R=>c(e,"servo_period_s",R.target.value),className:o})}),P.jsx(mn,{label:"On Time (s)",children:P.jsx("input",{value:s.servo_on_duration_s??.2,onChange:R=>c(e,"servo_on_duration_s",R.target.value),className:o})})]}):U?P.jsxs(P.Fragment,{children:[P.jsx(mn,{label:"Action Type",children:P.jsx("input",{value:s.custom_type??"customAction",onChange:R=>c(e,"custom_type",R.target.value),className:o})}),P.jsx(mn,{label:"Action JSON",children:P.jsx("textarea",{value:s.custom_json??"{}",onChange:R=>c(e,"custom_json",R.target.value),className:`${o} min-h-[96px] resize-y font-mono text-xs`})})]}):P.jsx("div",{className:"rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-xs font-semibold text-zinc-300",children:"Item này không cần tham số bổ sung."}),E?P.jsx(mn,{label:"Hold Time (s)",children:P.jsx("input",{value:s.hold_time_s,onChange:R=>c(e,"hold_time_s",R.target.value),className:o})}):null]}):null]})}function bT({open:s,busyAction:e,missionName:t,setMissionName:r,defaults:o,setDefaults:l,missionItems:c,waypointCount:f,selectedMissionIndex:p,activeMapPickIndex:m,dragOverIndex:_,draggedIndex:y,compactInputClass:g,livePositionForStatus:S,onClose:E,onClearMapPick:A,onClearMissionItems:x,onSave:v,onStart:C,onRun:U,onReturnHome:R,onAppendItem:G,onAppendWaypointFromMap:D,onUpdateMissionItem:V,onRemoveMissionItem:w,onApplyLivePosition:I,onSelectMissionIndex:X,onItemDragStart:k,onItemDragOver:K,onItemDrop:le,onItemDragEnd:ue,missionRuntime:W}){return s?P.jsxs("aside",{className:"pointer-events-auto absolute bottom-4 left-4 top-4 z-40 flex w-[390px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[34px] border border-white/15 bg-zinc-950/[0.84] shadow-[0_28px_85px_rgba(0,0,0,0.55)] backdrop-blur-sm",children:[P.jsxs("div",{className:"border-b border-white/10 p-4",children:[P.jsxs("div",{className:"flex items-center justify-between gap-3",children:[P.jsxs("div",{className:"flex min-w-0 items-center gap-3",children:[P.jsx("div",{className:"grid h-12 w-12 place-items-center rounded-3xl bg-cyan-400/15 text-cyan-100",children:P.jsx(an,{name:"route",className:"text-[28px]"})}),P.jsxs("div",{className:"min-w-0",children:[P.jsx("h1",{className:"truncate text-lg font-black tracking-[-0.04em] text-zinc-50",children:"Mission"}),P.jsxs("p",{className:"text-xs text-zinc-400",children:[c.length," steps · ",f," WP"]})]})]}),P.jsx(Gi,{icon:"keyboard_double_arrow_left",label:"Collapse",onClick:E})]}),P.jsxs("div",{className:"mt-4 flex items-center gap-2 rounded-3xl border border-white/10 bg-white/[0.045] p-1.5",children:[P.jsx(Ua,{icon:"save",label:e==="save"?"Saving":"Save",tone:"cyan",disabled:e!==""||c.length===0,onClick:v}),P.jsx(Ua,{icon:"play_arrow",label:e==="start"?"Starting":"Start",tone:"amber",disabled:e!=="",onClick:C}),P.jsx(Ua,{icon:"rocket_launch",label:e==="run"?"Running":"Save + Start",tone:"emerald",disabled:e!==""||c.length===0,onClick:U}),P.jsx(Ua,{icon:"home_pin",label:e==="return-home"?"Returning":"Return",tone:"rose",disabled:e!=="",onClick:R}),P.jsx("div",{className:"ml-auto",children:P.jsx(Gi,{icon:"delete_sweep",label:"Xóa toàn bộ danh sách mission",disabled:c.length===0||e!=="",onClick:x})})]}),Number.isInteger(m)?P.jsxs("div",{className:"mt-3 grid gap-2 rounded-2xl border border-amber-300/35 bg-amber-400/12 px-3 py-3 text-sm font-bold text-amber-50",children:[P.jsxs("div",{className:"flex items-center gap-2",children:[P.jsx(an,{name:"edit_location_alt",className:"text-[22px]"}),P.jsxs("span",{children:["Đang chọn vị trí cho step #",m+1]})]}),P.jsx("button",{type:"button",onPointerDown:$=>$.stopPropagation(),onClick:$=>{$.stopPropagation(),A()},className:"rounded-xl border border-white/10 bg-zinc-950/55 px-3 py-2 text-xs font-black text-zinc-100 transition hover:bg-white/10",children:"Tắt chế độ chọn vị trí"})]}):P.jsx("div",{className:"mt-3 rounded-2xl border border-white/10 bg-white/[0.055] px-3 py-3 text-xs font-semibold leading-5 text-zinc-300",children:"Nhấn WP để tạo waypoint rồi click lên map 3D để đặt tọa độ. Các action như Hold, Land, RTL, Settings, Servo và Custom không dùng tọa độ map."})]}),P.jsx("div",{className:"flex-1 overflow-y-auto p-4",children:P.jsxs("div",{className:"grid gap-3",children:[P.jsxs("section",{className:"rounded-[26px] border border-white/10 bg-white/[0.045] p-3",children:[P.jsxs("div",{className:"mb-3 grid grid-cols-2 gap-2 text-xs",children:[P.jsxs("div",{className:"rounded-2xl border border-white/10 bg-zinc-950/55 px-3 py-2",children:[P.jsx("p",{className:"text-zinc-500",children:"Runtime"}),P.jsx("p",{className:"mt-1 font-bold text-zinc-100",children:W.runtime_state??"--"})]}),P.jsxs("div",{className:"rounded-2xl border border-white/10 bg-zinc-950/55 px-3 py-2",children:[P.jsx("p",{className:"text-zinc-500",children:"Mission Active"}),P.jsx("p",{className:"mt-1 font-bold text-zinc-100",children:W.mission_active?"YES":"NO"})]}),P.jsxs("div",{className:"rounded-2xl border border-white/10 bg-zinc-950/55 px-3 py-2",children:[P.jsx("p",{className:"text-zinc-500",children:"Ready"}),P.jsx("p",{className:"mt-1 font-bold text-zinc-100",children:W.mission_ready?"YES":"NO"})]}),P.jsxs("div",{className:"rounded-2xl border border-white/10 bg-zinc-950/55 px-3 py-2",children:[P.jsx("p",{className:"text-zinc-500",children:"Start"}),P.jsx("p",{className:"mt-1 font-bold text-zinc-100",children:W.mission_start_in_progress?"PENDING":"IDLE"})]}),P.jsxs("div",{className:"rounded-2xl border border-white/10 bg-zinc-950/55 px-3 py-2",children:[P.jsx("p",{className:"text-zinc-500",children:"Current Item"}),P.jsxs("p",{className:"mt-1 truncate font-bold text-zinc-100",children:["#",W.current_item_index??"--"," ",W.current_item_type??""]})]}),P.jsxs("div",{className:"rounded-2xl border border-white/10 bg-zinc-950/55 px-3 py-2",children:[P.jsx("p",{className:"text-zinc-500",children:"Nav State"}),P.jsx("p",{className:"mt-1 font-bold text-zinc-100",children:W.vehicle?.nav_state??"--"})]})]}),P.jsx(mn,{label:"Mission Name",children:P.jsx("input",{value:t,onChange:$=>r($.target.value),className:g})}),P.jsxs("div",{className:"mt-3 grid grid-cols-3 gap-2",children:[P.jsx(mn,{label:"H Vel",children:P.jsx("input",{value:o.horizontal_velocity_m_s,onChange:$=>l(Y=>({...Y,horizontal_velocity_m_s:$.target.value})),className:g})}),P.jsx(mn,{label:"V Vel",children:P.jsx("input",{value:o.vertical_velocity_m_s,onChange:$=>l(Y=>({...Y,vertical_velocity_m_s:$.target.value})),className:g})}),P.jsx(mn,{label:"Yaw",children:P.jsx("input",{value:o.max_heading_rate_deg_s,onChange:$=>l(Y=>({...Y,max_heading_rate_deg_s:$.target.value})),className:g})})]})]}),P.jsxs("section",{className:"rounded-[26px] border border-white/10 bg-white/[0.045] p-3",children:[P.jsxs("div",{className:"mb-2 flex items-center justify-between px-1",children:[P.jsx("p",{className:"text-[11px] font-black uppercase tracking-[0.14em] text-zinc-500",children:"Add step"}),P.jsxs("button",{type:"button",onPointerDown:$=>$.stopPropagation(),onClick:()=>D(S.latitude_deg,S.longitude_deg),disabled:!xn(S.latitude_deg,S.longitude_deg),className:"inline-flex items-center gap-1 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-2 py-1 text-[11px] font-black text-emerald-100 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-40",children:[P.jsx(an,{name:"my_location",className:"text-[16px]"}),"WP tại UAV"]})]}),P.jsx("div",{className:"grid grid-cols-4 gap-1.5",children:[["takeoff","flight_takeoff","TO"],["waypoint","add_location_alt","WP"],["hold","pause_circle","Hold"],["changeSettings","tune","Set"],["land","flight_land","Land"],["rtl","home_pin","RTL"],["servoPulse","settings_input_component","Servo"],["customAction","extension","Action"]].map(([$,Y,Q])=>P.jsxs("button",{type:"button",onClick:()=>G($),className:"grid gap-1 rounded-2xl border border-white/10 bg-zinc-900/70 px-1.5 py-2 text-center text-[10px] font-black text-zinc-200 transition hover:border-cyan-300/40 hover:bg-cyan-400/10",children:[P.jsx(an,{name:Y,className:"mx-auto text-[20px]"}),Q]},$))})]}),P.jsx("section",{className:"grid gap-2",children:c.length===0?P.jsxs("div",{className:"rounded-[26px] border border-dashed border-white/15 bg-zinc-950/45 px-4 py-6 text-center",children:[P.jsx("p",{className:"text-sm font-bold text-zinc-100",children:"Chưa có mission local trên UI"}),P.jsx("p",{className:"mt-2 text-xs leading-6 text-zinc-500",children:"Thêm step bằng các nút phía trên hoặc đặt waypoint trực tiếp trên map."})]}):c.map(($,Y)=>P.jsx(wT,{item:$,index:Y,expanded:p===Y,dragOver:_===Y&&y!==Y,compactInputClass:g,onSelect:X,onChange:V,onRemove:w,onApplyLivePosition:I,onDragStart:k,onDragOver:K,onDrop:le,onDragEnd:ue},`${$.type}-${Y}`))})]})})]}):P.jsx("div",{className:"pointer-events-auto absolute left-4 top-4 z-40",children:P.jsx(Gi,{icon:"route",label:"Open mission planner",onClick:E})})}function Fs({icon:s,value:e,caption:t,tone:r="zinc"}){const o={zinc:"bg-white/[0.055] text-zinc-100",emerald:"bg-emerald-400/12 text-emerald-50",cyan:"bg-cyan-400/12 text-cyan-50",amber:"bg-amber-400/12 text-amber-50",rose:"bg-rose-400/12 text-rose-50"};return P.jsx("div",{className:`rounded-[24px] border border-white/10 p-3 ${o[r]}`,children:P.jsxs("div",{className:"flex items-center gap-3",children:[P.jsx("div",{className:"grid h-11 w-11 place-items-center rounded-2xl bg-zinc-950/42",children:P.jsx(an,{name:s,className:"text-[25px]"})}),P.jsxs("div",{className:"min-w-0",children:[P.jsx("p",{className:"truncate text-base font-black tracking-[-0.03em]",children:e}),P.jsx("p",{className:"truncate text-[11px] font-semibold text-zinc-400",children:t})]})]})})}function AT({open:s,loading:e,status:t,drone:r,droneOptions:o,selectedDroneId:l,setSelectedDroneId:c,livePositionForStatus:f,logs:p,onClose:m}){const _=Object.entries(r.messageCounts).sort((S,E)=>Number(E[1])-Number(S[1])).slice(0,8);if(!s)return P.jsxs("div",{className:"pointer-events-auto absolute right-4 top-4 z-40 grid gap-2",children:[P.jsx(Gi,{icon:"sensors",label:"Open drone status",onClick:m}),P.jsx("div",{className:`grid h-11 w-11 place-items-center rounded-2xl border border-white/10 ${r.connected?"bg-emerald-400/20 text-emerald-50":"bg-rose-400/20 text-rose-50"}`,children:P.jsx(an,{name:r.connected?"link":"link_off",className:"text-[22px]"})})]});const y=r.connected?"emerald":"rose",g=Number(r.batteryPercent)>30?"emerald":"amber";return P.jsxs("aside",{className:"pointer-events-auto absolute bottom-4 right-4 top-4 z-40 flex w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[34px] border border-white/15 bg-zinc-950/[0.84] shadow-[0_28px_85px_rgba(0,0,0,0.55)] backdrop-blur-sm",children:[P.jsxs("div",{className:"border-b border-white/10 p-4",children:[P.jsxs("div",{className:"flex items-center justify-between gap-3",children:[P.jsxs("div",{className:"flex min-w-0 items-center gap-3",children:[P.jsx("div",{className:`grid h-12 w-12 place-items-center rounded-3xl ${r.connected?"bg-emerald-400/15 text-emerald-100":"bg-rose-400/15 text-rose-100"}`,children:P.jsx(an,{name:"flight",className:"text-[29px]"})}),P.jsxs("div",{className:"min-w-0",children:[P.jsx("h2",{className:"truncate text-lg font-black tracking-[-0.04em] text-zinc-50",children:r.armed?"ARMED":"DISARMED"}),P.jsx("p",{className:"text-xs text-zinc-400",children:e?"Polling...":r.connected?"MAVLink live":"MAVLink stale"})]})]}),P.jsx(Gi,{icon:"keyboard_double_arrow_right",label:"Collapse",onClick:m})]}),P.jsxs("div",{className:"mt-4 rounded-[24px] border border-white/10 bg-white/[0.04] p-2",children:[P.jsxs("div",{className:"mb-2 flex items-center gap-2 px-2 text-[11px] font-black uppercase tracking-[0.16em] text-zinc-500",children:[P.jsx(an,{name:"groups",className:"text-[17px]"}),"Drone list"]}),P.jsx("div",{className:"grid gap-2",children:o.map(S=>P.jsxs("button",{type:"button",onClick:()=>c(S.id),className:`flex items-center gap-3 rounded-2xl border px-3 py-2 text-left transition ${l===S.id?"border-cyan-300/60 bg-cyan-400/12":"border-white/10 bg-zinc-950/45 hover:bg-white/[0.08]"}`,children:[P.jsx("div",{className:`grid h-9 w-9 place-items-center rounded-xl ${S.connected?"bg-emerald-400/16 text-emerald-100":"bg-zinc-800 text-zinc-400"}`,children:P.jsx(an,{name:"flight",className:"text-[20px]"})}),P.jsxs("div",{className:"min-w-0 flex-1",children:[P.jsxs("div",{className:"flex items-center justify-between gap-2",children:[P.jsx("strong",{className:"truncate text-sm text-zinc-100",children:S.name}),P.jsx("span",{className:`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black ${S.connected?"bg-emerald-400/15 text-emerald-100":"bg-zinc-700/70 text-zinc-300"}`,children:S.connected?"LIVE":"STALE"})]}),P.jsxs("p",{className:"mt-0.5 truncate text-[11px] text-zinc-500",children:[S.mode," · ",S.batteryPercent??"--","%"]})]})]},S.id))})]})]}),P.jsxs("div",{className:"flex-1 overflow-y-auto p-4",children:[P.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[P.jsx(Fs,{icon:"link",value:r.connected?"LIVE":"STALE",caption:"Connection",tone:y}),P.jsx(Fs,{icon:"mode_standby",value:r.mode,caption:"Mode",tone:"cyan"}),P.jsx(Fs,{icon:"battery_full",value:r.batteryPercent==null?"--":`${r.batteryPercent}%`,caption:Is(r.voltage,2," V"),tone:g}),P.jsx(Fs,{icon:"warning",value:r.failsafe?"YES":"NO",caption:"Failsafe",tone:r.failsafe?"rose":"emerald"})]}),P.jsxs("div",{className:"mt-3 grid grid-cols-2 gap-3",children:[P.jsx(Fs,{icon:"explore",value:r.headingDeg==null?"--":`${Number(r.headingDeg).toFixed(0)}°`,caption:"Heading",tone:"cyan"}),P.jsx(Fs,{icon:"height",value:Is(f.relative_altitude_m??f.altitude_amsl_m,2," m"),caption:"Altitude",tone:"zinc"}),P.jsx(Fs,{icon:"schedule",value:xT(r.heartbeatAge),caption:"Heartbeat",tone:"zinc"})]}),P.jsxs("section",{className:"mt-3 rounded-[26px] border border-white/10 bg-white/[0.045] p-4",children:[P.jsxs("div",{className:"flex items-center gap-3",children:[P.jsx(an,{name:"gps_fixed",className:"text-[24px] text-emerald-100"}),P.jsxs("div",{children:[P.jsx("h3",{className:"text-sm font-black text-zinc-100",children:"GPS"}),P.jsx("p",{className:"text-xs text-zinc-500",children:f.source})]})]}),P.jsxs("div",{className:"mt-3 grid gap-2 font-mono text-sm text-zinc-100",children:[P.jsxs("div",{className:"flex justify-between gap-3",children:[P.jsx("span",{className:"text-zinc-500",children:"Lat"}),P.jsx("span",{children:us(f.latitude_deg)})]}),P.jsxs("div",{className:"flex justify-between gap-3",children:[P.jsx("span",{className:"text-zinc-500",children:"Lon"}),P.jsx("span",{children:us(f.longitude_deg)})]}),P.jsxs("div",{className:"flex justify-between gap-3",children:[P.jsx("span",{className:"text-zinc-500",children:"AMSL"}),P.jsx("span",{children:Is(f.altitude_amsl_m,2," m")})]})]})]}),P.jsxs("section",{className:"mt-3 rounded-[26px] border border-white/10 bg-white/[0.045] p-4",children:[P.jsxs("div",{className:"flex items-center justify-between gap-3",children:[P.jsxs("div",{className:"flex items-center gap-3",children:[P.jsx(an,{name:"settings_input_antenna",className:"text-[24px] text-cyan-100"}),P.jsx("h3",{className:"text-sm font-black text-zinc-100",children:"MAVLink"})]}),P.jsx("span",{className:"rounded-full bg-white/8 px-2 py-1 text-[11px] text-zinc-400",children:r.id})]}),P.jsxs("div",{className:"mt-3 grid grid-cols-3 gap-2 text-center",children:[P.jsxs("div",{className:"rounded-2xl bg-zinc-950/55 p-2",children:[P.jsx("p",{className:"text-xs text-zinc-500",children:"Base"}),P.jsx("strong",{children:r.baseMode??"--"})]}),P.jsxs("div",{className:"rounded-2xl bg-zinc-950/55 p-2",children:[P.jsx("p",{className:"text-xs text-zinc-500",children:"Custom"}),P.jsx("strong",{children:r.customMode??"--"})]}),P.jsxs("div",{className:"rounded-2xl bg-zinc-950/55 p-2",children:[P.jsx("p",{className:"text-xs text-zinc-500",children:"Sys"}),P.jsx("strong",{children:r.systemStatus??"--"})]})]}),P.jsxs("div",{className:"mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/45 px-3 py-1.5 text-[11px] font-bold text-zinc-300",children:[P.jsx(an,{name:"settings_ethernet",className:"text-[16px]"}),yT(r.connectionUrl)]})]}),P.jsxs("section",{className:"mt-3 rounded-[26px] border border-white/10 bg-white/[0.045] p-4",children:[P.jsxs("div",{className:"flex items-center justify-between gap-3",children:[P.jsxs("div",{className:"flex items-center gap-3",children:[P.jsx(an,{name:"topic",className:"text-[23px] text-amber-100"}),P.jsxs("div",{children:[P.jsx("h3",{className:"text-sm font-black text-zinc-100",children:"Mission Bridge"}),P.jsx("p",{className:"text-xs text-zinc-500",children:t.mission_runtime?.available?"ROS mission runtime live":"Waiting mission runtime status"})]})]}),P.jsx("span",{className:`rounded-full px-2 py-1 text-[10px] font-black ${t.mission_runtime?.mission_active?"bg-emerald-400/12 text-emerald-100":"bg-zinc-700/70 text-zinc-300"}`,children:t.mission_runtime?.runtime_state??"--"})]}),P.jsxs("div",{className:"mt-3 grid grid-cols-2 gap-2 text-xs",children:[P.jsxs("div",{className:"rounded-2xl bg-zinc-950/55 p-2",children:[P.jsx("p",{className:"text-zinc-500",children:"Ready"}),P.jsx("strong",{children:t.mission_runtime?.mission_ready?"YES":"NO"})]}),P.jsxs("div",{className:"rounded-2xl bg-zinc-950/55 p-2",children:[P.jsx("p",{className:"text-zinc-500",children:"Start"}),P.jsx("strong",{children:t.mission_runtime?.mission_start_in_progress?"PENDING":"IDLE"})]}),P.jsxs("div",{className:"rounded-2xl bg-zinc-950/55 p-2",children:[P.jsx("p",{className:"text-zinc-500",children:"Step"}),P.jsx("strong",{children:t.mission_runtime?.current_item_index??"--"})]}),P.jsxs("div",{className:"rounded-2xl bg-zinc-950/55 p-2",children:[P.jsx("p",{className:"text-zinc-500",children:"Item"}),P.jsx("strong",{children:t.mission_runtime?.current_item_type??"--"})]}),P.jsxs("div",{className:"rounded-2xl bg-zinc-950/55 p-2",children:[P.jsx("p",{className:"text-zinc-500",children:"Armed"}),P.jsx("strong",{children:t.mission_runtime?.vehicle?.armed?"YES":"NO"})]}),P.jsxs("div",{className:"rounded-2xl bg-zinc-950/55 p-2",children:[P.jsx("p",{className:"text-zinc-500",children:"Landed"}),P.jsx("strong",{children:t.mission_runtime?.vehicle?.landed?"YES":"NO"})]})]}),P.jsxs("div",{className:"mt-3 rounded-2xl border border-white/10 bg-zinc-950/55 px-3 py-3 text-xs",children:[P.jsx("p",{className:"text-zinc-500",children:"Local NED"}),P.jsxs("p",{className:"mt-1 font-semibold text-zinc-100",children:["X ",Is(t.mission_runtime?.vehicle?.x_ned_m,2," m")," · Y ",Is(t.mission_runtime?.vehicle?.y_ned_m,2," m")," · Z ",Is(t.mission_runtime?.vehicle?.z_ned_m,2," m")]}),P.jsx("p",{className:"mt-2 text-zinc-500",children:"Local Reference"}),P.jsxs("p",{className:"mt-1 font-semibold text-zinc-100",children:[t.mission_runtime?.vehicle?.local_reference_valid?"VALID":"INVALID"," · Lat ",us(t.mission_runtime?.vehicle?.ref_lat_deg)," · Lon ",us(t.mission_runtime?.vehicle?.ref_lon_deg)," · AMSL ",Is(t.mission_runtime?.vehicle?.ref_alt_msl_m,2," m")]}),t.mission_runtime?.last_error?P.jsx("p",{className:"mt-2 text-rose-200",children:t.mission_runtime.last_error}):null]})]}),P.jsxs("section",{className:"mt-3 rounded-[26px] border border-white/10 bg-white/[0.045] p-4",children:[P.jsxs("div",{className:"mb-3 flex items-center justify-between gap-3",children:[P.jsxs("div",{className:"flex items-center gap-3",children:[P.jsx(an,{name:"dns",className:"text-[23px] text-zinc-200"}),P.jsx("h3",{className:"text-sm font-black text-zinc-100",children:"Messages"})]}),P.jsxs("span",{className:"text-xs text-zinc-500",children:["top ",_.length]})]}),P.jsx("div",{className:"grid max-h-[155px] gap-1.5 overflow-y-auto pr-1 font-mono text-[11px]",children:_.length===0?P.jsx("p",{className:"text-sm text-zinc-500",children:"No messages."}):_.map(([S,E])=>P.jsxs("div",{className:"flex justify-between gap-3 rounded-2xl border border-white/10 bg-zinc-950/50 px-3 py-2",children:[P.jsx("span",{className:"truncate text-zinc-400",children:S}),P.jsx("span",{className:"text-zinc-100",children:E})]},S))})]}),P.jsxs("section",{className:"mt-3 rounded-[26px] border border-white/10 bg-white/[0.045] p-4",children:[P.jsxs("div",{className:"mb-3 flex items-center gap-3",children:[P.jsx(an,{name:"history",className:"text-[23px] text-zinc-200"}),P.jsx("h3",{className:"text-sm font-black text-zinc-100",children:"Log"})]}),P.jsxs("div",{className:"grid max-h-[180px] gap-2 overflow-y-auto pr-1",children:[r.lastError?P.jsx("div",{className:"rounded-2xl border border-rose-400/25 bg-rose-400/10 p-3 text-xs text-rose-100",children:r.lastError}):null,r.lastStatustext?P.jsx("div",{className:"rounded-2xl border border-amber-400/25 bg-amber-400/10 p-3 text-xs text-amber-100",children:r.lastStatustext}):null,p.length===0?P.jsx("p",{className:"text-sm text-zinc-500",children:"No action yet."}):p.map(S=>P.jsxs("div",{className:"rounded-2xl border border-white/10 bg-zinc-950/55 p-3",children:[P.jsxs("div",{className:"flex items-center justify-between gap-3",children:[P.jsx("strong",{className:"truncate text-sm text-zinc-100",children:S.title}),P.jsx("span",{className:"font-mono text-[10px] text-zinc-500",children:S.timestamp})]}),P.jsx("p",{className:"mt-2 text-xs leading-5 text-zinc-400",children:S.detail})]},S.id))]})]})]})]})}function RT(){const[s,e]=at.useState(Zo),[t,r]=at.useState("adaptive-run"),[o,l]=at.useState(sT),[c,f]=at.useState([]),[p,m]=at.useState(""),[_,y]=at.useState(!0),[g,S]=at.useState([]),[E,A]=at.useState(null),[x,v]=at.useState(null),[C,U]=at.useState(null),[R,G]=at.useState(!0),[D,V]=at.useState(!0),[w,I]=at.useState("1:1"),[X,k]=at.useState(null),[K,le]=at.useState([]);at.useEffect(()=>{let Se=!0;async function Ce(){try{const st=await Us("/api/status");try{st.mavlink||(st.mavlink=await Us("/api/mavlink/status"))}catch{}if(!Se)return;e(st)}catch(st){Se&&ue("error","Status poll failed",st.message)}finally{Se&&y(!1)}}Ce();const He=window.setInterval(Ce,1e3);return()=>{Se=!1,window.clearInterval(He)}},[]),at.useEffect(()=>{const Se=Oa(s);if(!hT(s)){le(Ce=>Ce.length>0?[]:Ce);return}xn(Se.latitude_deg,Se.longitude_deg)&&le(Ce=>{const He={latitude_deg:Number(Se.latitude_deg),longitude_deg:Number(Se.longitude_deg),altitude_amsl_m:rs(Se.altitude_amsl_m),relative_altitude_m:rs(Se.relative_altitude_m),timestamp:Date.now()},st=Ce[Ce.length-1];if(st){const H=pT(st,He),xt=He.timestamp-st.timestamp;if(H>oT&&xt<1e4)return[He];if(H<.35&&xt<4500)return Ce}return[...Ce,He].slice(-450)})},[s]);function ue(Se,Ce,He){S(st=>[{id:crypto.randomUUID(),level:Se,title:Ce,detail:He,timestamp:new Date().toLocaleTimeString()},...st].slice(0,12))}const W=at.useMemo(()=>ET(t,o,c),[t,o,c]);async function $(Se,Ce,He){m(Se);try{const st=await Ce();ue("success",He,st.detail);const H=await Us("/api/status");e(H)}catch(st){ue("error",`${He} failed`,st.message)}finally{m("")}}function Y(Se,Ce,He){f(st=>st.map((H,xt)=>xt===Se?{...H,[Ce]:He}:H))}function Q(Se){A(Se),G(!0);const Ce=c[Se];Rr(Ce)?k(Se):k(null)}function pe(Se){f(Ce=>{const He=MT(Se,s,Ce),st=[...Ce,He],H=st.length-1;return A(H),G(!0),k(Rr(He)?H:null),st})}function me(Se,Ce){if(!xn(Se,Ce)){ue("warn","Không có tọa độ map hợp lệ","Không thể thêm waypoint vì lat/lon không hợp lệ.");return}f(He=>{const st=Sh(He,s),H={type:"waypoint",name:`Waypoint ${He.filter(dt=>dt.type==="waypoint").length+1}`,latitude_deg:Number(Se),longitude_deg:Number(Ce),altitude_m:st,hold_time_s:0},xt=[...He,H];return A(xt.length-1),G(!0),k(xt.length-1),xt}),ue("success","Waypoint added",`${Number(Se).toFixed(7)}, ${Number(Ce).toFixed(7)}`)}function z(Se,Ce,He,st={}){if(!xn(Ce,He))return;const H=Number.isFinite(Number(st.altitude_m)),xt=H?Number(Number(st.altitude_m).toFixed(2)):null;if(f(dt=>dt.map((Tt,Oe)=>Oe===Se?{...Tt,latitude_deg:Number(Ce),longitude_deg:Number(He),...H?{altitude_m:xt}:{}}:Tt)),!st.silent){const dt=H?`, alt ${xt.toFixed(2)} m`:"";ue("success","Mission item updated",`Step ${Se+1}: ${Number(Ce).toFixed(7)}, ${Number(He).toFixed(7)}${dt}`)}}function ne(){f([]),A(null),k(null),v(null),U(null),ue("warn","Mission list cleared","Đã xóa toàn bộ danh sách mission local trên UI.")}function Le(Se){f(Ce=>Ce.filter((He,st)=>st!==Se)),A(Ce=>{if(Ce==null)return null;if(Ce===Se){const He=Se-1;return He>=0?He:null}return Ce>Se?Ce-1:Ce}),k(Ce=>Ce==null||Ce===Se?null:Ce>Se?Ce-1:Ce),ue("warn","Mission step removed",`Đã xóa step #${Se+1} khỏi danh sách local.`)}function We(Se){const Ce=Oa(s);if(!xn(Ce.latitude_deg,Ce.longitude_deg)){ue("warn","No live position","Backend chưa có global position hợp lệ từ MAVLink/ROS.");return}f(He=>He.map((st,H)=>H===Se?{...st,latitude_deg:Ce.latitude_deg,longitude_deg:Ce.longitude_deg,altitude_m:Sh(He,s)}:st))}function ze(Se,Ce){Se===Ce||Se==null||Ce==null||(f(He=>{const st=[...He],[H]=st.splice(Se,1);return st.splice(Ce,0,H),st}),A(Ce),k(He=>He==null?null:He===Se?Ce:Se<Ce&&He>Se&&He<=Ce?He-1:Se>Ce&&He>=Ce&&He<Se?He+1:He))}function ce(Se,Ce){v(Ce),Se.dataTransfer.effectAllowed="move",Se.dataTransfer.setData("text/plain",String(Ce))}function Te(Se,Ce){Se.preventDefault(),Se.dataTransfer.dropEffect="move",U(Ce)}function ve(Se,Ce){Se.preventDefault();const He=Number(Se.dataTransfer.getData("text/plain"));ze(Number.isFinite(He)?He:x,Ce),v(null),U(null)}function Ve(){v(null),U(null)}const et=$h(s),rt=Oa(s),Pt=at.useMemo(()=>({vehicle:{position:s?.vehicle?.position??{}},mavlink:{connected:!!s?.mavlink?.connected,latitude_deg:s?.mavlink?.latitude_deg??null,longitude_deg:s?.mavlink?.longitude_deg??null,altitude_amsl_m:s?.mavlink?.altitude_amsl_m??null,relative_altitude_m:s?.mavlink?.relative_altitude_m??null,heading_deg:s?.mavlink?.heading_deg??null,yaw_deg:s?.mavlink?.yaw_deg??null}}),[s?.vehicle?.position?.latitude_deg,s?.vehicle?.position?.longitude_deg,s?.vehicle?.position?.altitude_amsl_m,s?.mavlink?.connected,s?.mavlink?.latitude_deg,s?.mavlink?.longitude_deg,s?.mavlink?.altitude_amsl_m,s?.mavlink?.relative_altitude_m,s?.mavlink?.heading_deg,s?.mavlink?.yaw_deg]),ht=c.filter(Se=>Se.type==="waypoint").length,Et="w-full rounded-2xl border border-white/10 bg-zinc-950/75 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-cyan-400/70",At=at.useMemo(()=>_T(s),[s]);return at.useEffect(()=>{At.some(Se=>Se.id===w)||I(At[0]?.id??"1:1")},[At,w]),P.jsxs("div",{className:"relative h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 [contain:layout_paint_style]",children:[P.jsx(TT,{status:Pt,missionItems:c,selectedIndex:E,activeMapPickIndex:X,flightTrack:K,onSelectItem:Q,onUpdateWaypointFromMap:z,onClearMapPick:()=>k(null),onClearFlightTrack:()=>le([])}),P.jsxs("div",{className:"pointer-events-none absolute inset-0 z-30",children:[P.jsx(bT,{open:R,busyAction:p,missionName:t,setMissionName:r,defaults:o,setDefaults:l,missionItems:c,waypointCount:ht,selectedMissionIndex:E,activeMapPickIndex:X,dragOverIndex:C,draggedIndex:x,compactInputClass:Et,livePositionForStatus:rt,onClose:()=>G(Se=>!Se),onClearMapPick:()=>k(null),onClearMissionItems:ne,onSave:()=>$("save",()=>Us("/api/mission",{method:"POST",body:JSON.stringify(W)}),"Mission saved"),onStart:()=>$("start",()=>Us("/api/mission/start",{method:"POST"}),"Start sent"),onRun:()=>$("run",()=>Us("/api/mission/run",{method:"POST",body:JSON.stringify(W)}),"Save + start sent"),onReturnHome:()=>$("return-home",()=>Us("/api/mission/return-home",{method:"POST"}),"Return-home sent"),onAppendItem:pe,onAppendWaypointFromMap:me,onUpdateMissionItem:Y,onRemoveMissionItem:Le,onApplyLivePosition:We,onSelectMissionIndex:Q,onItemDragStart:ce,onItemDragOver:Te,onItemDrop:ve,onItemDragEnd:Ve,missionRuntime:s.mission_runtime??Zo.mission_runtime}),P.jsx(AT,{open:D,loading:_,status:s,drone:et,droneOptions:At,selectedDroneId:w,setSelectedDroneId:I,livePositionForStatus:rt,logs:g,onClose:()=>V(Se=>!Se)})]})]})}Ix.createRoot(document.getElementById("root")).render(P.jsx(RT,{}));
