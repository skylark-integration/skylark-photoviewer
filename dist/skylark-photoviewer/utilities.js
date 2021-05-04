/**
 * skylark-photoviewer - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-photoviewer/
 * @license MIT
 */
define(["skylark-langx","skylark-domx-browser","skylark-domx-noder","skylark-domx-geom","skylark-domx-images"],function(r,e,o,l,s){"use strict";return{document:window.document,throttle:r.debounce,preloadImage:function(r,e,o){s.preload(r).then(function(r){e(r.imgs[0])},o)},requestFullscreen:o.fullscreen,exitFullscreen:o.fullscreen,getImageNameFromUrl:function(r){return r.replace(/^.*?\/*([^/?]*)\.[a-z]+(\?.+|$)/gi,"$1")},hasScrollbar:l.hasScrollbar,getScrollbarWidth:l.scrollbarWidth,setGrabCursor:function(r,e,o,l){const s=l?r.h:r.w,n=l?r.w:r.h;(n>e.h||s>e.w)&&o.addClass("is-grab"),n<=e.h&&s<=e.w&&o.removeClass("is-grab")},supportTouch:function(){return e.support.tocuh}}});
//# sourceMappingURL=sourcemaps/utilities.js.map
