define([
    './domq',
    './utilities'
], function ($, utilities) {
    'use strict';
    const $W = $(window);
    const $D = $(utilities.document);
    const CLICK_EVENT = 'click';
    const RESIZE_EVENT = 'resize';
    const KEYDOWN_EVENT = 'keydown';
    const WHEEL_EVENT = 'wheel mousewheel DOMMouseScroll';
    const TOUCH_START_EVENT = utilities.supportTouch() ? 'touchstart' : 'mousedown';
    const TOUCH_MOVE_EVENT = utilities.supportTouch() ? 'touchmove' : 'mousemove';
    const TOUCH_END_EVENT = utilities.supportTouch() ? 'touchend' : 'mouseup';
    const NS = 'photoviewer';
    const CLASS_NS = '.' + NS;
    const EVENT_NS = '.' + NS;
    const PUBLIC_VARS = {
        isMoving: false,
        isResizing: false,
        zIndex: 0
    };
    return {
        $W: $W,
        $D: $D,
        CLICK_EVENT: CLICK_EVENT,
        RESIZE_EVENT: RESIZE_EVENT,
        KEYDOWN_EVENT: KEYDOWN_EVENT,
        WHEEL_EVENT: WHEEL_EVENT,
        TOUCH_START_EVENT: TOUCH_START_EVENT,
        TOUCH_MOVE_EVENT: TOUCH_MOVE_EVENT,
        TOUCH_END_EVENT: TOUCH_END_EVENT,
        NS: NS,
        CLASS_NS: CLASS_NS,
        EVENT_NS: EVENT_NS,
        PUBLIC_VARS: PUBLIC_VARS
    };
});