(self.webpackChunkbang_ggood=self.webpackChunkbang_ggood||[]).push([[529],{2912:function(n,r,t){"use strict";var e=t(6540);const i=t(2568).default.h1.withConfig({displayName:"Title__Wrapper",componentId:"sc-1v07c7t-0"})(["margin-bottom:24px;font-size:",";font-weight:700;line-height:1.3;color:",";word-break:break-all;& > a{text-decoration:none;color:inherit;transition:all 0.2s;}& > a:hover{color:",";}"],(n=>n.size),(n=>n.theme.colors.text),(n=>n.theme.colors.secondaryText));r.A=n=>{let{size:r,children:t}=n;return e.createElement(i,{size:{sm:"19.2px",md:"25.6px",bg:"32px"}[r]}," ",t," ")}},698:function(n,r,t){"use strict";var e=t(2568);r.A=e.default.div.withConfig({displayName:"VerticalSpace",componentId:"sc-1aoh9e0-0"})(["height:","px;"],(n=>n.size))},1033:function(n){n.exports=function(n,r,t){switch(t.length){case 0:return n.call(r);case 1:return n.call(r,t[0]);case 2:return n.call(r,t[0],t[1]);case 3:return n.call(r,t[0],t[1],t[2])}return n.apply(r,t)}},909:function(n,r,t){var e=t(641),i=t(8329)(e);n.exports=i},3120:function(n,r,t){var e=t(4528),i=t(5891);n.exports=function n(r,t,o,u,a){var c=-1,f=r.length;for(o||(o=i),a||(a=[]);++c<f;){var l=r[c];t>0&&o(l)?t>1?n(l,t-1,o,u,a):e(a,l):u||(a[a.length]=l)}return a}},6649:function(n,r,t){var e=t(3221)();n.exports=e},641:function(n,r,t){var e=t(6649),i=t(5950);n.exports=function(n,r){return n&&e(n,r,i)}},5128:function(n,r,t){var e=t(909),i=t(4894);n.exports=function(n,r){var t=-1,o=i(n)?Array(n.length):[];return e(n,(function(n,e,i){o[++t]=r(n,e,i)})),o}},6155:function(n,r,t){var e=t(4932),i=t(7422),o=t(5389),u=t(5128),a=t(3937),c=t(7301),f=t(3714),l=t(3488),v=t(6449);n.exports=function(n,r,t){r=r.length?e(r,(function(n){return v(n)?function(r){return i(r,1===n.length?n[0]:n)}:n})):[l];var s=-1;r=e(r,c(o));var p=u(n,(function(n,t,i){return{criteria:e(r,(function(r){return r(n)})),index:++s,value:n}}));return a(p,(function(n,r){return f(n,r,t)}))}},9302:function(n,r,t){var e=t(3488),i=t(6757),o=t(2865);n.exports=function(n,r){return o(i(n,r,e),n+"")}},9570:function(n,r,t){var e=t(7334),i=t(3243),o=t(3488),u=i?function(n,r){return i(n,"toString",{configurable:!0,enumerable:!1,value:e(r),writable:!0})}:o;n.exports=u},3937:function(n){n.exports=function(n,r){var t=n.length;for(n.sort(r);t--;)n[t]=n[t].value;return n}},3730:function(n,r,t){var e=t(4394);n.exports=function(n,r){if(n!==r){var t=void 0!==n,i=null===n,o=n==n,u=e(n),a=void 0!==r,c=null===r,f=r==r,l=e(r);if(!c&&!l&&!u&&n>r||u&&a&&f&&!c&&!l||i&&a&&f||!t&&f||!o)return 1;if(!i&&!u&&!l&&n<r||l&&t&&o&&!i&&!u||c&&t&&o||!a&&o||!f)return-1}return 0}},3714:function(n,r,t){var e=t(3730);n.exports=function(n,r,t){for(var i=-1,o=n.criteria,u=r.criteria,a=o.length,c=t.length;++i<a;){var f=e(o[i],u[i]);if(f)return i>=c?f:f*("desc"==t[i]?-1:1)}return n.index-r.index}},8329:function(n,r,t){var e=t(4894);n.exports=function(n,r){return function(t,i){if(null==t)return t;if(!e(t))return n(t,i);for(var o=t.length,u=r?o:-1,a=Object(t);(r?u--:++u<o)&&!1!==i(a[u],u,a););return t}}},3221:function(n){n.exports=function(n){return function(r,t,e){for(var i=-1,o=Object(r),u=e(r),a=u.length;a--;){var c=u[n?a:++i];if(!1===t(o[c],c,o))break}return r}}},3243:function(n,r,t){var e=t(6110),i=function(){try{var n=e(Object,"defineProperty");return n({},"",{}),n}catch(r){}}();n.exports=i},5891:function(n,r,t){var e=t(1873),i=t(2428),o=t(6449),u=e?e.isConcatSpreadable:void 0;n.exports=function(n){return o(n)||i(n)||!!(u&&n&&n[u])}},6800:function(n,r,t){var e=t(5288),i=t(4894),o=t(361),u=t(3805);n.exports=function(n,r,t){if(!u(t))return!1;var a=typeof r;return!!("number"==a?i(t)&&o(r,t.length):"string"==a&&r in t)&&e(t[r],n)}},6757:function(n,r,t){var e=t(1033),i=Math.max;n.exports=function(n,r,t){return r=i(void 0===r?n.length-1:r,0),function(){for(var o=arguments,u=-1,a=i(o.length-r,0),c=Array(a);++u<a;)c[u]=o[r+u];u=-1;for(var f=Array(r+1);++u<r;)f[u]=o[u];return f[r]=t(c),e(n,this,f)}}},2865:function(n,r,t){var e=t(9570),i=t(1811)(e);n.exports=i},1811:function(n){var r=Date.now;n.exports=function(n){var t=0,e=0;return function(){var i=r(),o=16-(i-e);if(e=i,o>0){if(++t>=800)return arguments[0]}else t=0;return n.apply(void 0,arguments)}}},7334:function(n){n.exports=function(n){return function(){return n}}},8221:function(n,r,t){var e=t(3805),i=t(124),o=t(9374),u=Math.max,a=Math.min;n.exports=function(n,r,t){var c,f,l,v,s,p,x=0,h=!1,d=!1,g=!0;if("function"!=typeof n)throw new TypeError("Expected a function");function m(r){var t=c,e=f;return c=f=void 0,x=r,v=n.apply(e,t)}function b(n){var t=n-p;return void 0===p||t>=r||t<0||d&&n-x>=l}function y(){var n=i();if(b(n))return w(n);s=setTimeout(y,function(n){var t=r-(n-p);return d?a(t,l-(n-x)):t}(n))}function w(n){return s=void 0,g&&c?m(n):(c=f=void 0,v)}function T(){var n=i(),t=b(n);if(c=arguments,f=this,p=n,t){if(void 0===s)return function(n){return x=n,s=setTimeout(y,r),h?m(n):v}(p);if(d)return clearTimeout(s),s=setTimeout(y,r),m(p)}return void 0===s&&(s=setTimeout(y,r)),v}return r=o(r)||0,e(t)&&(h=!!t.leading,l=(d="maxWait"in t)?u(o(t.maxWait)||0,r):l,g="trailing"in t?!!t.trailing:g),T.cancel=function(){void 0!==s&&clearTimeout(s),x=0,c=p=f=s=void 0},T.flush=function(){return void 0===s?v:w(i())},T}},124:function(n,r,t){var e=t(9325);n.exports=function(){return e.Date.now()}},3031:function(n,r,t){var e=t(3120),i=t(6155),o=t(9302),u=t(6800),a=o((function(n,r){if(null==n)return[];var t=r.length;return t>1&&u(n,r[0],r[1])?r=[]:t>2&&u(r[0],r[1],r[2])&&(r=[r[0]]),i(n,e(r,1),[])}));n.exports=a},7350:function(n,r,t){var e=t(8221),i=t(3805);n.exports=function(n,r,t){var o=!0,u=!0;if("function"!=typeof n)throw new TypeError("Expected a function");return i(t)&&(o="leading"in t?!!t.leading:o,u="trailing"in t?!!t.trailing:u),e(n,r,{leading:o,maxWait:r,trailing:u})}}}]);
//# sourceMappingURL=cb7ab91d38516542e1d5693fa891944ec5dd0678-90225a9b98a5ad624846.js.map