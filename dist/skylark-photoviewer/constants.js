/**
 * skylark-photoviewer - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-photoviewer/
 * @license MIT
 */
define(["./domq","./utilities"],function(o,e){"use strict";const E="photoviewer";return{$W:o(window),$D:o(e.document),CLICK_EVENT:"click",RESIZE_EVENT:"resize",KEYDOWN_EVENT:"keydown",WHEEL_EVENT:"wheel mousewheel DOMMouseScroll",TOUCH_START_EVENT:e.supportTouch()?"touchstart":"mousedown",TOUCH_MOVE_EVENT:e.supportTouch()?"touchmove":"mousemove",TOUCH_END_EVENT:e.supportTouch()?"touchend":"mouseup",NS:E,CLASS_NS:".photoviewer",EVENT_NS:".photoviewer",PUBLIC_VARS:{isMoving:!1,isResizing:!1,zIndex:0}}});
//# sourceMappingURL=sourcemaps/constants.js.map
