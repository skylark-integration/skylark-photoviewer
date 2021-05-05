/**
 * skylark-photoviewer - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-photoviewer/
 * @license MIT
 */
define(["skylark-domx-eventer","skylark-domx-plugins-interact/resizable","./domq","./constants","./utilities"],function(e,t,i,n,s){"use strict";n.NS,n.NS,n.NS;return{resizable(e,s,o,l,a){new t(i(e)[0],{handle:{border:{directions:{top:!0,left:!0,right:!0,bottom:!0,topLeft:!0,topRight:!0,bottomLeft:!0,bottomRight:!0},classes:{all:`${n.NS}-resizable-handle`,top:`${n.NS}-resizable-handle-n`,left:`${n.NS}-resizable-handle-w`,right:`${n.NS}-resizable-handle-e`,bottom:`${n.NS}-resizable-handle-s`,topLeft:`${n.NS}-resizable-handle-nw`,topRight:`${n.NS}-resizable-handle-ne`,bottomLeft:`${n.NS}-resizable-handle-sw`,bottomRight:`${n.NS}-resizable-handle-se`}}},constraints:{minWidth:l,minHeight:a},started:function(){n.PUBLIC_VARS.isResizing=!0},moving:function(e){const t=i(o).width(),n=i(o).height(),l=(i(s).width()-t)/2,a=(i(s).height()-n)/2;i(o).css({left:l,top:a})},stopped:function(){n.PUBLIC_VARS.isResizing=!1}})}}});
//# sourceMappingURL=sourcemaps/resizable.js.map
