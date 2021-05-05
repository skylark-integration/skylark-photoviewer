/**
 * skylark-photoviewer - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-photoviewer/
 * @license MIT
 */
define(["skylark-domx-plugins-interact/movable","./domq","./constants"],function(t,n,e){"use strict";return{draggable(i,s,a){var r=this;t(n(i)[0],{handle:n(s)[0],starting:function(t){return!n(t.target).closest(a).length&&(!e.PUBLIC_VARS.isResizing&&!r.isMaximized)}})}}});
//# sourceMappingURL=sourcemaps/draggable.js.map
