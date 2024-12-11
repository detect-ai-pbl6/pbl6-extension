(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[284],{5011:function(t,e,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/redirect",function(){return a(2531)}])},2531:function(t,e,a){"use strict";a.r(e),a.d(e,{default:function(){return i}});var r=a(7294),o=a(6501);function i(){let t=(0,r.useRef)(!1);return(0,r.useEffect)(()=>{if(t.current)return;t.current=!0;let e=async()=>{try{let t=await fetch("".concat("https://pbl6.site/api","/auth/tokens"),{credentials:"include"});if(!t.ok)throw Error("Failed to fetch tokens");let e=await t.json(),a=Date.now()+3e5;localStorage.setItem("access",e.access),localStorage.setItem("refresh",e.refresh),localStorage.setItem("expiration",a.toString()),o.ZP.success("Login successful!"),window.location.href="/"}catch(t){console.error("Error:",t),o.ZP.error("Login failed. Please try again.")}};e()},[]),null}},6501:function(t,e,a){"use strict";let r,o;a.d(e,{ZP:function(){return Q}});var i,s=a(7294);let n={data:""},c=t=>"object"==typeof window?((t?t.querySelector("#_goober"):window._goober)||Object.assign((t||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:t||n,l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,d=/\/\*[^]*?\*\/|  +/g,p=/\n+/g,u=(t,e)=>{let a="",r="",o="";for(let i in t){let s=t[i];"@"==i[0]?"i"==i[1]?a=i+" "+s+";":r+="f"==i[1]?u(s,i):i+"{"+u(s,"k"==i[1]?"":e)+"}":"object"==typeof s?r+=u(s,e?e.replace(/([^,])+/g,t=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,e=>/&/.test(e)?e.replace(/&/g,t):t?t+" "+e:e)):i):null!=s&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=u.p?u.p(i,s):i+":"+s+";")}return a+(e&&o?e+"{"+o+"}":o)+r},f={},m=t=>{if("object"==typeof t){let e="";for(let a in t)e+=a+m(t[a]);return e}return t},g=(t,e,a,r,o)=>{var i,s;let n=m(t),c=f[n]||(f[n]=(t=>{let e=0,a=11;for(;e<t.length;)a=101*a+t.charCodeAt(e++)>>>0;return"go"+a})(n));if(!f[c]){let e=n!==t?t:(t=>{let e,a,r=[{}];for(;e=l.exec(t.replace(d,""));)e[4]?r.shift():e[3]?(a=e[3].replace(p," ").trim(),r.unshift(r[0][a]=r[0][a]||{})):r[0][e[1]]=e[2].replace(p," ").trim();return r[0]})(t);f[c]=u(o?{["@keyframes "+c]:e}:e,a?"":"."+c)}let g=a&&f.g?f.g:null;return a&&(f.g=f[c]),i=f[c],s=e,g?s.data=s.data.replace(g,i):-1===s.data.indexOf(i)&&(s.data=r?i+s.data:s.data+i),c},h=(t,e,a)=>t.reduce((t,r,o)=>{let i=e[o];if(i&&i.call){let t=i(a),e=t&&t.props&&t.props.className||/^go/.test(t)&&t;i=e?"."+e:t&&"object"==typeof t?t.props?"":u(t,""):!1===t?"":t}return t+r+(null==i?"":i)},"");function y(t){let e=this||{},a=t.call?t(e.p):t;return g(a.unshift?a.raw?h(a,[].slice.call(arguments,1),e.p):a.reduce((t,a)=>Object.assign(t,a&&a.call?a(e.p):a),{}):a,c(e.target),e.g,e.o,e.k)}y.bind({g:1});let b,x,w,v=y.bind({k:1});function E(t,e){let a=this||{};return function(){let r=arguments;function o(i,s){let n=Object.assign({},i),c=n.className||o.className;a.p=Object.assign({theme:x&&x()},n),a.o=/ *go\d+/.test(c),n.className=y.apply(a,r)+(c?" "+c:""),e&&(n.ref=s);let l=t;return t[0]&&(l=n.as||t,delete n.as),w&&l[0]&&w(n),b(l,n)}return e?e(o):o}}var k=t=>"function"==typeof t,$=(t,e)=>k(t)?t(e):t,_=(r=0,()=>(++r).toString()),j=()=>{if(void 0===o&&"u">typeof window){let t=matchMedia("(prefers-reduced-motion: reduce)");o=!t||t.matches}return o},N=new Map,I=t=>{if(N.has(t))return;let e=setTimeout(()=>{N.delete(t),S({type:4,toastId:t})},1e3);N.set(t,e)},z=t=>{let e=N.get(t);e&&clearTimeout(e)},P=(t,e)=>{switch(e.type){case 0:return{...t,toasts:[e.toast,...t.toasts].slice(0,20)};case 1:return e.toast.id&&z(e.toast.id),{...t,toasts:t.toasts.map(t=>t.id===e.toast.id?{...t,...e.toast}:t)};case 2:let{toast:a}=e;return t.toasts.find(t=>t.id===a.id)?P(t,{type:1,toast:a}):P(t,{type:0,toast:a});case 3:let{toastId:r}=e;return r?I(r):t.toasts.forEach(t=>{I(t.id)}),{...t,toasts:t.toasts.map(t=>t.id===r||void 0===r?{...t,visible:!1}:t)};case 4:return void 0===e.toastId?{...t,toasts:[]}:{...t,toasts:t.toasts.filter(t=>t.id!==e.toastId)};case 5:return{...t,pausedAt:e.time};case 6:let o=e.time-(t.pausedAt||0);return{...t,pausedAt:void 0,toasts:t.toasts.map(t=>({...t,pauseDuration:t.pauseDuration+o}))}}},A=[],O={toasts:[],pausedAt:void 0},S=t=>{O=P(O,t),A.forEach(t=>{t(O)})},C=(t,e="blank",a)=>({createdAt:Date.now(),visible:!0,type:e,ariaProps:{role:"status","aria-live":"polite"},message:t,pauseDuration:0,...a,id:(null==a?void 0:a.id)||_()}),F=t=>(e,a)=>{let r=C(e,t,a);return S({type:2,toast:r}),r.id},T=(t,e)=>F("blank")(t,e);T.error=F("error"),T.success=F("success"),T.loading=F("loading"),T.custom=F("custom"),T.dismiss=t=>{S({type:3,toastId:t})},T.remove=t=>S({type:4,toastId:t}),T.promise=(t,e,a)=>{let r=T.loading(e.loading,{...a,...null==a?void 0:a.loading});return t.then(t=>(T.success($(e.success,t),{id:r,...a,...null==a?void 0:a.success}),t)).catch(t=>{T.error($(e.error,t),{id:r,...a,...null==a?void 0:a.error})}),t};var D=E("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${t=>t.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${v`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${v`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${t=>t.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${v`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,L=E("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${t=>t.secondary||"#e0e0e0"};
  border-right-color: ${t=>t.primary||"#616161"};
  animation: ${v`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`} 1s linear infinite;
`,Z=E("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${t=>t.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${v`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${v`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${t=>t.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,M=E("div")`
  position: absolute;
`,X=E("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,q=E("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${v`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,H=({toast:t})=>{let{icon:e,type:a,iconTheme:r}=t;return void 0!==e?"string"==typeof e?s.createElement(q,null,e):e:"blank"===a?null:s.createElement(X,null,s.createElement(L,{...r}),"loading"!==a&&s.createElement(M,null,"error"===a?s.createElement(D,{...r}):s.createElement(Z,{...r})))},R=t=>`
0% {transform: translate3d(0,${-200*t}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,B=t=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*t}%,-1px) scale(.6); opacity:0;}
`,G=E("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,J=E("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,K=(t,e)=>{let a=t.includes("top")?1:-1,[r,o]=j()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[R(a),B(a)];return{animation:e?`${v(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${v(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}};s.memo(({toast:t,position:e,style:a,children:r})=>{let o=t.height?K(t.position||e||"top-center",t.visible):{opacity:0},i=s.createElement(H,{toast:t}),n=s.createElement(J,{...t.ariaProps},$(t.message,t));return s.createElement(G,{className:t.className,style:{...o,...a,...t.style}},"function"==typeof r?r({icon:i,message:n}):s.createElement(s.Fragment,null,i,n))}),i=s.createElement,u.p=void 0,b=i,x=void 0,w=void 0,y`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;var Q=T}},function(t){t.O(0,[774,888,179],function(){return t(t.s=5011)}),_N_E=t.O()}]);