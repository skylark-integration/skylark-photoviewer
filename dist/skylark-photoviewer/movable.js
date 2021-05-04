/**
 * skylark-photoviewer - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-photoviewer/
 * @license MIT
 */
define(["./domq","./constants"],function(t,e){"use strict";const o=`html, body, .${e.NS}-modal, .${e.NS}-stage, .${e.NS}-button, .${e.NS}-resizable-handle`;return{movable(s,i){let a=!1,n=0,E=0,h=0,N=0,T=0,c=0,g=0;const l=e=>{if((e=e||window.event).preventDefault(),a){const o="touchmove"===e.type?e.targetTouches[0].pageX:e.clientX,s="touchmove"===e.type?e.targetTouches[0].pageY:e.clientY,a=o-n,l=s-E;let p=a+h,_=l+N;c>0?l+N>g?_=g:l+N<-c+g&&(_=-c+g):_=N,T>0?a+h>-g?p=-g:a+h<-T-g&&(p=-T-g):p=h,t(i).css({left:p+"px",top:_+"px"}),t.extend(this.imageData,{left:p,top:_})}},p=()=>{e.$D.off(e.TOUCH_MOVE_EVENT+e.EVENT_NS,l).off(e.TOUCH_END_EVENT+e.EVENT_NS,p),a=!1,e.PUBLIC_VARS.isMoving=!1,t(o).removeClass("is-grabbing")};t(s).on(e.TOUCH_START_EVENT+e.EVENT_NS,_=>{(_=_||window.event).preventDefault();const r=t(i).width(),d=t(i).height(),u=t(s).width(),V=t(s).height();n="touchstart"===_.type?_.targetTouches[0].pageX:_.clientX,E="touchstart"===_.type?_.targetTouches[0].pageY:_.clientY,g=this.isRotated?(r-d)/2:0,T=this.isRotated?d-u:r-u,c=this.isRotated?r-V:d-V,a=T>0||c>0,e.PUBLIC_VARS.isMoving=T>0||c>0,h=t(i).position().left-g,N=t(i).position().top+g,s.hasClass("is-grab")&&t(o).addClass("is-grabbing"),e.$D.on(e.TOUCH_MOVE_EVENT+e.EVENT_NS,l).on(e.TOUCH_END_EVENT+e.EVENT_NS,p)})}}});
//# sourceMappingURL=sourcemaps/movable.js.map
