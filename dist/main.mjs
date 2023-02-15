/*! For license information please see main.mjs.LICENSE.txt */
import*as e from"react";var t={123:(e,t,r)=>{function n(e){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n(e)}Object.defineProperty(t,"__esModule",{value:!0}),t.swipeThreshold=t.INITIAL_TOUCH_STATE=t.GalleryContext=t.Gallery=void 0;var o=f(r(697)),i=r(564),a=f(r(133)),l=function(e,t){if(e&&e.__esModule)return e;if(null===e||"object"!==n(e)&&"function"!=typeof e)return{default:e};var r=c(t);if(r&&r.has(e))return r.get(e);var o={},i=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var a in e)if("default"!==a&&Object.prototype.hasOwnProperty.call(e,a)){var l=i?Object.getOwnPropertyDescriptor(e,a):null;l&&(l.get||l.set)?Object.defineProperty(o,a,l):o[a]=e[a]}return o.default=e,r&&r.set(e,o),o}(r(645)),u=r(893);function c(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(c=function(e){return e?r:t})(e)}function f(e){return e&&e.__esModule?e:{default:e}}function s(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,o,i,a,l=[],u=!0,c=!1;try{if(i=(r=r.call(e)).next,0===t){if(Object(r)!==r)return;u=!1}else for(;!(u=(n=i.call(r)).done)&&(l.push(n.value),l.length!==t);u=!0);}catch(e){c=!0,o=e}finally{try{if(!u&&null!=r.return&&(a=r.return(),Object(a)!==a))return}finally{if(c)throw o}}return l}}(e,t)||function(e,t){if(e){if("string"==typeof e)return y(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?y(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function y(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var p=(0,i.createContext)();t.GalleryContext=p;var b={isDragging:!1,start:0,xOffset:0,offsetting:!1,scrolling:!0};t.INITIAL_TOUCH_STATE=b,t.swipeThreshold=50;var d=function(e){var t=e.items,r=e.loop,n=e.draggable,o=e.onChange,c=e.startIndex,f=e.visibleRange,y=e.ariaLiveText,d=e.className,g=e.children,v=s((0,i.useState)((function(){return c||0})),2),O=v[0],m=v[1],j=s((0,i.useState)((function(){return c||0})),2),h=j[0],P=j[1],w=s((0,i.useState)((function(){return b})),2),_=w[0],S=w[1],x=(0,i.useRef)([]);if(!Array.isArray(t))throw new Error("<Gallery> items prop must be an Array.");var I={galleryItems:t,itemNodes:x,startIndex:c,activeIndex:O,setActiveIndex:m,previouslyActiveIndex:h,setPreviouslyActiveIndex:P,goToIndex:function(e){P(O),m(e),o&&o({oldIndex:O,newIndex:e,direction:e-O>0?1:0})},next:function(){P(O),m((function(e){var n=e+1;return e===t.length-1&&(n=r?0:e),o&&o({oldIndex:e,newIndex:n,direction:1}),n}))},previous:function(){P(O),m((function(e){var n=e-1;return 0===e&&(n=r?t.length-1:e),o&&o({oldIndex:e,newIndex:n,direction:0}),n}))},loop:r,draggable:n,touchState:_,setTouchState:S,swipeThreshold:50,onChange:o,visibleRange:f};return(0,u.jsx)(p.Provider,{value:I,children:(0,u.jsxs)("div",{className:(0,a.default)([l.gallery,"gallery",d]),style:{"--touch-offset":_.xOffset},children:[g,y&&(0,u.jsx)("p",{"aria-live":"polite",className:"visually-hidden",children:y.replace("$i",O+1).replace("$t",t.length)})]})})};t.Gallery=d,d.propTypes={items:o.default.array.isRequired,loop:o.default.bool,draggable:o.default.bool,onChange:o.default.func,startIndex:o.default.number,visibleRange:o.default.number,ariaLiveText:o.default.string,className:o.default.string,children:o.default.node},d.defaultProps={loop:!1,draggable:!0,startIndex:0,visibleRange:-1,ariaLiveText:"Item $i of $t."}},944:(e,t,r)=>{function n(e){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n(e)}Object.defineProperty(t,"__esModule",{value:!0}),t.GalleryItem=void 0;var o,i=r(543),a=(o=r(133))&&o.__esModule?o:{default:o},l=function(e,t){if(e&&e.__esModule)return e;if(null===e||"object"!==n(e)&&"function"!=typeof e)return{default:e};var r=f(t);if(r&&r.has(e))return r.get(e);var o={},i=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var a in e)if("default"!==a&&Object.prototype.hasOwnProperty.call(e,a)){var l=i?Object.getOwnPropertyDescriptor(e,a):null;l&&(l.get||l.set)?Object.defineProperty(o,a,l):o[a]=e[a]}return o.default=e,r&&r.set(e,o),o}(r(645)),u=r(893),c=["index","active","className","children"];function f(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(f=function(e){return e?r:t})(e)}function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function y(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){p(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function p(e,t,r){return(t=function(e){var t=function(e,t){if("object"!==n(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var o=r.call(e,t);if("object"!==n(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e,"string");return"symbol"===n(t)?t:String(t)}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}t.GalleryItem=function(e){var t=e.index,r=e.active,n=e.className,o=e.children,f=function(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}(e,c),s=(0,i.useGallery)(),p=s.itemNodes,b=s.activeIndex,d=s.previouslyActiveIndex,g=s.draggable,v=s.touchState,O=s.visibleRange,m={"aria-hidden":r?null:"true",tabIndex:r?0:-1};return(0,u.jsx)("li",y(y(y({ref:function(e){return p.current[t]=e}},m),f),{},{className:(0,a.default)([l.item,g&&v.offsetting&&l.itemDragging,"gallery__item",g&&"gallery__item--draggable",r&&"gallery__item--active",t===d&&"gallery__item--was-active",t<b&&"gallery__item--left",t>b&&"gallery__item--right",(-1===O||Math.abs(t-b)<=O)&&"gallery__item--visible",n]),style:{"--i":t,"--center-offset":Math.abs(t-b),"--index-offset":t-b,"--side":t<b?-1:t>b?1:0,"--active":r?1:0},children:o}))}},533:(e,t,r)=>{function n(e){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n(e)}Object.defineProperty(t,"__esModule",{value:!0}),t.GalleryMain=void 0;var o=p(r(697)),i=r(564),a=r(543),l=r(944),u=p(r(133)),c=function(e,t){if(e&&e.__esModule)return e;if(null===e||"object"!==n(e)&&"function"!=typeof e)return{default:e};var r=y(t);if(r&&r.has(e))return r.get(e);var o={},i=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var a in e)if("default"!==a&&Object.prototype.hasOwnProperty.call(e,a)){var l=i?Object.getOwnPropertyDescriptor(e,a):null;l&&(l.get||l.set)?Object.defineProperty(o,a,l):o[a]=e[a]}return o.default=e,r&&r.set(e,o),o}(r(645)),f=r(893),s=["renderGalleryItem","className"];function y(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(y=function(e){return e?r:t})(e)}function p(e){return e&&e.__esModule?e:{default:e}}function b(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function d(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?b(Object(r),!0).forEach((function(t){g(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):b(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function g(e,t,r){return(t=function(e){var t=function(e,t){if("object"!==n(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var o=r.call(e,t);if("object"!==n(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e,"string");return"symbol"===n(t)?t:String(t)}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var v=function(e){var t=e.renderGalleryItem,r=e.className,n=function(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}(e,s),o=(0,a.useGallery)(),y=o.activeIndex,p=o.galleryItems,b=o.next,g=o.previous,v=o.draggable,O=o.touchState,m=o.setTouchState,j=o.swipeThreshold,h=(0,i.useCallback)((function(e){v&&m((function(e){return d(d({},e),{},{isDragging:!0})}))}),[v]),P=(0,i.useCallback)((function(e){if(v&&!O.scrolling&&!0===O.isDragging&&e.clientY)if(O.start){var t=e.clientX-O.start.x,r=e.clientY-O.start.y;O.offsetting?m((function(e){return d(d({},e),{},{xOffset:t})})):(Math.abs(r)>20&&m((function(e){return d(d({},e),{},{scrolling:!0})})),Math.abs(t)>10&&m((function(e){return d(d({},e),{},{offsetting:!0,xOffset:t})})))}else m((function(t){return d(d({},t),{},{start:{x:e.clientX,y:e.clientY}})}))}),[O,v]),w=(0,i.useCallback)((function(e){v&&O.isDragging&&(Math.abs(O.xOffset)>j&&(O.xOffset<0?b():g()),m((function(e){return d(d({},e),{},{isDragging:!1,xOffset:0,start:0,offsetting:!1,scrolling:!1})})))}),[O,v]);return(0,f.jsx)("ul",d(d({className:(0,u.default)([c.main,"gallery__main",r]),onPointerDown:v&&h,onPointerMove:v&&P,onPointerUp:v&&w,style:{"--selected":y,"--total":p.length}},n),{},{children:p.map((function(e,r){var n=y===r;return(0,f.jsx)(l.GalleryItem,{index:r,active:n,children:t({item:e,i:r,activeIndex:y,active:n})},r)}))}))};t.GalleryMain=v,v.propTypes={renderGalleryItem:o.default.func.isRequired,className:o.default.string}},254:(e,t,r)=>{function n(e){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n(e)}Object.defineProperty(t,"__esModule",{value:!0}),t.GalleryNav=void 0;var o=c(r(697)),i=r(543),a=c(r(133)),l=r(893),u=["direction","renderNavItem","className","children"];function c(e){return e&&e.__esModule?e:{default:e}}function f(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?f(Object(r),!0).forEach((function(t){y(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):f(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function y(e,t,r){return(t=function(e){var t=function(e,t){if("object"!==n(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var o=r.call(e,t);if("object"!==n(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e,"string");return"symbol"===n(t)?t:String(t)}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var p=function(e){var t=e.direction,r=e.renderNavItem,n=e.className,o=e.children,c=function(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}(e,u),f=(0,i.useGallery)(),y=f.next,p=f.previous,b=f.loop,d=f.activeIndex,g=f.galleryItems,v=t&&d===g.length-1||!t&&0===d,O=b?{}:{disabled:!!v||null,"aria-disabled":v?"true":null};return o||r?(0,l.jsx)("button",s(s(s({className:(0,a.default)([n,"gallery__nav","gallery__nav--".concat(t?"next":"previous")]),onClick:function(e){t?y():p()}},O),c),{},{children:o||r({activeIndex:d,disabled:v})})):null};t.GalleryNav=p,p.propTypes={direction:o.default.oneOf([0,1]).isRequired,renderNavItem:o.default.func,className:o.default.string,children:o.default.node}},706:(e,t,r)=>{function n(e){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n(e)}Object.defineProperty(t,"__esModule",{value:!0}),t.GalleryPaginationItem=void 0;var o=s(r(697)),i=r(543),a=s(r(133)),l=function(e,t){if(e&&e.__esModule)return e;if(null===e||"object"!==n(e)&&"function"!=typeof e)return{default:e};var r=f(t);if(r&&r.has(e))return r.get(e);var o={},i=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var a in e)if("default"!==a&&Object.prototype.hasOwnProperty.call(e,a)){var l=i?Object.getOwnPropertyDescriptor(e,a):null;l&&(l.get||l.set)?Object.defineProperty(o,a,l):o[a]=e[a]}return o.default=e,r&&r.set(e,o),o}(r(645)),u=r(893),c=["index","active","className","children"];function f(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(f=function(e){return e?r:t})(e)}function s(e){return e&&e.__esModule?e:{default:e}}function y(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function p(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?y(Object(r),!0).forEach((function(t){b(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):y(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function b(e,t,r){return(t=function(e){var t=function(e,t){if("object"!==n(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var o=r.call(e,t);if("object"!==n(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e,"string");return"symbol"===n(t)?t:String(t)}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var d=function(e){var t=e.index,r=e.active,n=e.className,o=e.children,f=function(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}(e,c),s=(0,i.useGallery)(),y=s.goToIndex,b=s.itemNodes;return(0,u.jsx)("li",p(p({className:(0,a.default)([l.paginationItem,"gallery__pagination-item",n])},f),{},{children:(0,u.jsx)("button",{onClick:function(){return y(e=t),void b.current[e].focus({preventScroll:!0});var e},"aria-current":r?"true":null,children:o})}))};t.GalleryPaginationItem=d,d.propTypes={index:o.default.number.isRequired,active:o.default.bool.isRequired,className:o.default.string}},167:(e,t,r)=>{function n(e){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n(e)}Object.defineProperty(t,"__esModule",{value:!0}),t.GalleryPagination=void 0;var o=y(r(697)),i=r(543),a=r(706),l=y(r(133)),u=function(e,t){if(e&&e.__esModule)return e;if(null===e||"object"!==n(e)&&"function"!=typeof e)return{default:e};var r=s(t);if(r&&r.has(e))return r.get(e);var o={},i=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var a in e)if("default"!==a&&Object.prototype.hasOwnProperty.call(e,a)){var l=i?Object.getOwnPropertyDescriptor(e,a):null;l&&(l.get||l.set)?Object.defineProperty(o,a,l):o[a]=e[a]}return o.default=e,r&&r.set(e,o),o}(r(645)),c=r(893),f=["renderPaginationItem","className"];function s(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(s=function(e){return e?r:t})(e)}function y(e){return e&&e.__esModule?e:{default:e}}function p(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function b(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?p(Object(r),!0).forEach((function(t){d(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):p(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function d(e,t,r){return(t=function(e){var t=function(e,t){if("object"!==n(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var o=r.call(e,t);if("object"!==n(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e,"string");return"symbol"===n(t)?t:String(t)}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var g=function(e){var t=e.renderPaginationItem,r=e.className,n=function(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}(e,f),o=(0,i.useGallery)(),s=o.activeIndex,y=o.galleryItems;return(0,c.jsx)("ul",b(b({className:(0,l.default)([u.pagination,"gallery__pagination",r])},n),{},{children:y.map((function(e,r){var n=s===r;return(0,c.jsx)(a.GalleryPaginationItem,{index:r,active:n,children:t({item:e,i:r,activeIndex:s,active:n})},r)}))}))};t.GalleryPagination=g,g.propTypes={renderPaginationItem:o.default.func.isRequired,className:o.default.string}},543:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.useGallery=void 0;var n=r(564),o=r(123);t.useGallery=function(){var e=(0,n.useContext)(o.GalleryContext);if(!e)throw new Error("useGallery must be called from within a <Gallery>.");return e}},133:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];if(!e||!Array.isArray(e)||!e.length)return null;var t=[];return e.forEach((function(e){"string"==typeof e&&t.push(e)})),t.join(" ")}},645:(e,t,r)=>{r.r(t),r.d(t,{default:()=>n});const n={gallery:"wethegit-react-gallery__gallery--xtLyCg_","gallery__item--draggable":"gallery__item--draggable",main:"wethegit-react-gallery__main--zD9z_d6",item:"wethegit-react-gallery__item--hVuJYEA",itemDragging:"wethegit-react-gallery__itemDragging--WWKb4Q9",pagination:"wethegit-react-gallery__pagination--Hr04OuP",paginationItem:"wethegit-react-gallery__paginationItem--FGPQuM7"}},418:e=>{var t=Object.getOwnPropertySymbols,r=Object.prototype.hasOwnProperty,n=Object.prototype.propertyIsEnumerable;function o(e){if(null==e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}e.exports=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},r=0;r<10;r++)t["_"+String.fromCharCode(r)]=r;if("0123456789"!==Object.getOwnPropertyNames(t).map((function(e){return t[e]})).join(""))return!1;var n={};return"abcdefghijklmnopqrst".split("").forEach((function(e){n[e]=e})),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},n)).join("")}catch(e){return!1}}()?Object.assign:function(e,i){for(var a,l,u=o(e),c=1;c<arguments.length;c++){for(var f in a=Object(arguments[c]))r.call(a,f)&&(u[f]=a[f]);if(t){l=t(a);for(var s=0;s<l.length;s++)n.call(a,l[s])&&(u[l[s]]=a[l[s]])}}return u}},703:(e,t,r)=>{var n=r(414);function o(){}function i(){}i.resetWarningCache=o,e.exports=function(){function e(e,t,r,o,i,a){if(a!==n){var l=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw l.name="Invariant Violation",l}}function t(){return e}e.isRequired=e;var r={array:e,bigint:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:i,resetWarningCache:o};return r.PropTypes=r,r}},697:(e,t,r)=>{e.exports=r(703)()},414:e=>{e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},251:(e,t,r)=>{r(418);var n=r(564),o=60103;if(t.Fragment=60107,"function"==typeof Symbol&&Symbol.for){var i=Symbol.for;o=i("react.element"),t.Fragment=i("react.fragment")}var a=n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l=Object.prototype.hasOwnProperty,u={key:!0,ref:!0,__self:!0,__source:!0};function c(e,t,r){var n,i={},c=null,f=null;for(n in void 0!==r&&(c=""+r),void 0!==t.key&&(c=""+t.key),void 0!==t.ref&&(f=t.ref),t)l.call(t,n)&&!u.hasOwnProperty(n)&&(i[n]=t[n]);if(e&&e.defaultProps)for(n in t=e.defaultProps)void 0===i[n]&&(i[n]=t[n]);return{$$typeof:o,type:e,key:c,ref:f,props:i,_owner:a.current}}t.jsx=c,t.jsxs=c},893:(e,t,r)=>{e.exports=r(251)},564:t=>{t.exports=e}},r={};function n(e){var o=r[e];if(void 0!==o)return o.exports;var i=r[e]={exports:{}};return t[e](i,i.exports,n),i.exports}n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var o={};(()=>{var e=o;Object.defineProperty(e,"X$",{value:!0}),Object.defineProperty(e,"ri",{enumerable:!0,get:function(){return t.Gallery}}),Object.defineProperty(e,"nH",{enumerable:!0,get:function(){return r.GalleryMain}}),Object.defineProperty(e,"__",{enumerable:!0,get:function(){return a.GalleryNav}}),Object.defineProperty(e,"oL",{enumerable:!0,get:function(){return i.GalleryPagination}}),Object.defineProperty(e,"d5",{enumerable:!0,get:function(){return l.useGallery}});var t=n(123),r=n(533),i=n(167),a=n(254),l=n(543)})();var i=o.ri,a=o.nH,l=o.__,u=o.oL,c=o.X$,f=o.d5;export{i as Gallery,a as GalleryMain,l as GalleryNav,u as GalleryPagination,c as __esModule,f as useGallery};