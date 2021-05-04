/**
 * skylark-photoviewer - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-photoviewer/
 * @license MIT
 */
define(["./domq","./constants"],function(t,e){"use strict";return{draggable(o,s,n){let i=!1,E=0,c=0,T=0,_=0;const a=s=>{if((s=s||window.event).preventDefault(),i&&!e.PUBLIC_VARS.isMoving&&!e.PUBLIC_VARS.isResizing&&!this.isMaximized){const e="touchmove"===s.type?s.targetTouches[0].pageX:s.clientX,n="touchmove"===s.type?s.targetTouches[0].pageY:s.clientY,i=e-E,a=n-c;t(o).css({left:i+T+"px",top:a+_+"px"})}},N=()=>{e.$D.off(e.TOUCH_MOVE_EVENT+e.EVENT_NS,a).off(e.TOUCH_END_EVENT+e.EVENT_NS,N),i=!1};t(s).on(e.TOUCH_START_EVENT+e.EVENT_NS,s=>{if(s=s||window.event,o.get(0).focus(),t(s.target).closest(n).length)return!0;this.options.multiInstances&&o.css("z-index",++e.PUBLIC_VARS.zIndex),i=!0,E="touchstart"===s.type?s.targetTouches[0].pageX:s.clientX,c="touchstart"===s.type?s.targetTouches[0].pageY:s.clientY,T=t(o).offset().left,_=t(o).offset().top,e.$D.on(e.TOUCH_MOVE_EVENT+e.EVENT_NS,a).on(e.TOUCH_END_EVENT+e.EVENT_NS,N)})}}});
//# sourceMappingURL=sourcemaps/draggable.js.map
