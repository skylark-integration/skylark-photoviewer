/**
 * skylark-photoviewer - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-photoviewer/
 * @license MIT
 */
define(["skylark-domx-eventer","skylark-domx-plugins-interact/movable","./domq","./constants"],function(t,n,i,s){"use strict";s.NS,s.NS,s.NS,s.NS;return{movable:(s,e)=>n(e[0],{starting:function(t){if(!s.hasClass("is-grab"))return!1;const n=i(e).width(),r=i(e).height(),a=i(s).width(),o=i(s).height();let m,c,u,d;return a>=n?m=u=(a-n)/2:(m=a-n,u=0),o>=r?c=d=(o-r)/2:(c=o-r,d=0),{constraints:{minX:m,maxX:u,minY:c,maxY:d}}},started:function(n){t.stop(n)}})}});
//# sourceMappingURL=sourcemaps/movable.js.map
