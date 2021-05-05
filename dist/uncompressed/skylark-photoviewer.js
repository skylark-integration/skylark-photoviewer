/**
 * skylark-photoviewer - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-photoviewer/
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-photoviewer/domq',['skylark-jquery'], function ($) {
    'use strict';

    return $;
});
define('skylark-photoviewer/defaults',[
    './domq'
], function ($) {
    'use strict';
    return {
        draggable: true,
        resizable: true,
        movable: true,
        keyboard: true,
        title: true,
        modalWidth: 320,
        modalHeight: 320,
        fixedContent: true,
        fixedModalSize: false,
        initMaximized: false,
        gapThreshold: 0.02,
        ratioThreshold: 0.1,
        minRatio: 0.05,
        maxRatio: 16,
        headerToolbar: [
            'maximize',
            'close'
        ],
        footerToolbar: [
            'zoomIn',
            'zoomOut',
            'prev',
            'fullscreen',
            'next',
            'actualSize',
            'rotateRight'
        ],
        icons: {
            minimize: `<svg viewBox="0 0 24 24" class="svg-inline-icon">
        <path fill="currentColor" d="M20,14H4V10H20"></path>
      </svg>`,
            maximize: `<svg viewBox="0 0 24 24" class="svg-inline-icon">
        <path fill="currentColor" d="M4,4H20V20H4V4M6,8V18H18V8H6Z"></path>
      </svg>`,
            close: `<svg viewBox="0 0 24 24" class="svg-inline-icon">
        <path fill="currentColor" d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12
        L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z"></path>
      </svg>`,
            zoomIn: `<svg viewBox="0 0 24 24" class="svg-inline-icon">
        <path fill="currentColor" d="M15.5,14L20.5,19L19,20.5L14,15.5V14.71L13.73,14.43
        C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3A6.5,6.5 0 0,1 16,9.5
        C16,11.11 15.41,12.59 14.43,13.73L14.71,14H15.5M9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5
        C7,5 5,7 5,9.5C5,12 7,14 9.5,14M12,10H10V12H9V10H7V9H9V7H10V9H12V10Z"></path>
      </svg>`,
            zoomOut: `<svg viewBox="0 0 24 24" class="svg-inline-icon">
        <path fill="currentColor" d="M15.5,14H14.71L14.43,13.73C15.41,12.59 16,11.11 16,9.5
        A6.5,6.5 0 0,0 9.5,3A6.5,6.5 0 0,0 3,9.5A6.5,6.5 0 0,0 9.5,16
        C11.11,16 12.59,15.41 13.73,14.43L14,14.71V15.5L19,20.5L20.5,19L15.5,14M9.5,14
        C7,14 5,12 5,9.5C5,7 7,5 9.5,5C12,5 14,7 14,9.5C14,12 12,14 9.5,14M7,9H12V10H7V9Z"></path>
      </svg>`,
            prev: `<svg viewBox="0 0 24 24" class="svg-inline-icon">
        <path fill="currentColor" d="M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z"></path>
      </svg>`,
            next: `<svg viewBox="0 0 24 24" class="svg-inline-icon">
        <path fill="currentColor" d="M16,18H18V6H16M6,18L14.5,12L6,6V18Z"></path>
      </svg>`,
            fullscreen: `<svg viewBox="0 0 24 24" class="svg-inline-icon">
        <path fill="currentColor" d="M8.5,12.5L11,15.5L14.5,11L19,17H5M23,18V6A2,2 0 0,0 21,4H3
        A2,2 0 0,0 1,6V18A2,2 0 0,0 3,20H21A2,2 0 0,0 23,18Z"></path>
      </svg>`,
            actualSize: `<svg viewBox="0 0 24 24" class="svg-inline-icon">
        <path fill="currentColor" d="M9.5,13.09L10.91,14.5L6.41,19H10V21H3V14H5V17.59L9.5,13.09
        M10.91,9.5L9.5,10.91L5,6.41V10H3V3H10V5H6.41L10.91,9.5M14.5,13.09L19,17.59V14H21V21H14V19
        H17.59L13.09,14.5L14.5,13.09M13.09,9.5L17.59,5H14V3H21V10H19V6.41L14.5,10.91
        L13.09,9.5Z"></path>
      </svg>`,
            rotateLeft: `<svg viewBox="0 0 24 24" class="svg-inline-icon">
        <path fill="currentColor" d="M13,4.07V1L8.45,5.55L13,10V6.09C15.84,6.57 18,9.03 18,12
        C18,14.97 15.84,17.43 13,17.91V19.93C16.95,19.44 20,16.08 20,12C20,7.92 16.95,4.56 13,4.07
        M7.1,18.32C8.26,19.22 9.61,19.76 11,19.93V17.9C10.13,17.75 9.29,17.41 8.54,16.87L7.1,18.32
        M6.09,13H4.07C4.24,14.39 4.79,15.73 5.69,16.89L7.1,15.47C6.58,14.72 6.23,13.88 6.09,13
        M7.11,8.53L5.7,7.11C4.8,8.27 4.24,9.61 4.07,11H6.09C6.23,10.13 6.58,9.28 7.11,8.53Z"></path>
      </svg>`,
            rotateRight: `<svg viewBox="0 0 24 24" class="svg-inline-icon">
        <path fill="currentColor" d="M16.89,15.5L18.31,16.89C19.21,15.73 19.76,14.39 19.93,13H17.91
        C17.77,13.87 17.43,14.72 16.89,15.5M13,17.9V19.92C14.39,19.75 15.74,19.21 16.9,18.31
        L15.46,16.87C14.71,17.41 13.87,17.76 13,17.9M19.93,11C19.76,9.61 19.21,8.27 18.31,7.11
        L16.89,8.53C17.43,9.28 17.77,10.13 17.91,11M15.55,5.55L11,1V4.07C7.06,4.56 4,7.92 4,12
        C4,16.08 7.05,19.44 11,19.93V17.91C8.16,17.43 6,14.97 6,12C6,9.03 8.16,6.57 11,6.09V10
        L15.55,5.55Z"></path>
      </svg>`
        },
        i18n: {
            minimize: 'minimize',
            maximize: 'maximize',
            close: 'close',
            zoomIn: 'zoom-in (+)',
            zoomOut: 'zoom-out (-)',
            prev: 'prev (\u2190)',
            next: 'next (\u2192)',
            fullscreen: 'fullscreen',
            actualSize: 'actual-size (Ctrl+Alt+0)',
            rotateLeft: 'rotate-left (Ctrl+,)',
            rotateRight: 'rotate-right (Ctrl+.)'
        },
        multiInstances: true,
        initAnimation: true,
        fixedModalPos: false,
        zIndex: 1090,
        dragHandle: false,
        callbacks: {
            beforeOpen: $.noop,
            opened: $.noop,
            beforeClose: $.noop,
            closed: $.noop,
            beforeChange: $.noop,
            changed: $.noop
        },
        index: 0,
        progressiveLoading: true,
        appendTo: 'body',
        customButtons: {}
    };
});
define('skylark-photoviewer/utilities',[
    "skylark-langx",
    "skylark-domx-browser",
    "skylark-domx-noder",
    "skylark-domx-geom",
    "skylark-domx-images"
],function (langx,browser,noder,geom,images) {
    'use strict';
    const document = window.document;

    /*
    function throttle(fn, delay) {
        let timer = null;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    }
    function preloadImage(src, success, error) {
        const img = new Image();
        img.onload = function () {
            success(img);
        };
        img.onerror = function () {
            error(img);
        };
        img.src = src;
    }
    function requestFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }
    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }


    function getScrollbarWidth() {
        const scrollDiv = document.createElement('div');
        scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
        document.body.appendChild(scrollDiv);
        const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        return scrollbarWidth;
    }

    function hasScrollbar() {
        return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
    }


    function supportTouch() {
        return !!('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch);
    }

    */
 

     function setGrabCursor(imageData, stageData, stage, isRotated) {
        const imageWidth = !isRotated ? imageData.w : imageData.h;
        const imageHeight = !isRotated ? imageData.h : imageData.w;
        if (imageHeight > stageData.h || imageWidth > stageData.w) {
            stage.addClass('is-grab');
        }
        if (imageHeight <= stageData.h && imageWidth <= stageData.w) {
            stage.removeClass('is-grab');
        }
    }

    function getImageNameFromUrl(url) {
        const reg = /^.*?\/*([^/?]*)\.[a-z]+(\?.+|$)/gi;
        const txt = url.replace(reg, '$1');
        return txt;
    }

    return {
        document: document,
        throttle: langx.debounce,
        preloadImage: function preloadImage(src, success, error) {
            images.preload(src).then(function(data){
                success(data.imgs[0]);
            },error);
        },
        requestFullscreen: noder.fullscreen,
        exitFullscreen: noder.fullscreen,
        getImageNameFromUrl: getImageNameFromUrl,
        hasScrollbar: geom.hasScrollbar,
        getScrollbarWidth: geom.scrollbarWidth,
        setGrabCursor: setGrabCursor,
        supportTouch: function() {
            return browser.support.tocuh;
        }
    }
});
define('skylark-photoviewer/constants',[
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
define('skylark-domx-plugins-interact/movable',[
    "skylark-langx/langx",
    "skylark-domx-noder",
    "skylark-domx-data",
    "skylark-domx-geom",
    "skylark-domx-eventer",
    "skylark-domx-styler",
    "skylark-domx-plugins",
    "./interact"
],function(langx,noder,datax,geom,eventer,styler,plugins,interact){
    var on = eventer.on,
        off = eventer.off,
        attr = datax.attr,
        removeAttr = datax.removeAttr,
        offset = geom.pagePosition,
        addClass = styler.addClass,
        height = geom.height,
        some = Array.prototype.some,
        map = Array.prototype.map;

    var Movable = plugins.Plugin.inherit({
        klassName: "Movable",

        pluginName : "lark.movable",


        _construct : function (elm, options) {
            this.overrided(elm,options);



            function updateWithTouchData(e) {
                var keys, i;

                if (e.changedTouches) {
                    keys = "screenX screenY pageX pageY clientX clientY".split(' ');
                    for (i = 0; i < keys.length; i++) {
                        e[keys[i]] = e.changedTouches[0][keys[i]];
                    }
                }
            }

            function updateWithMoveData(e) {
                e.movable = self;
                e.moveEl = elm;
                e.handleEl = handleEl;
            }

            options = this.options;
            var self = this,
                handleEl = options.handle || elm,
                auto = options.auto === false ? false : true,
                constraints = options.constraints,
                overlayDiv,
                doc = options.document || document,
                downButton,
                start,
                stop,
                drag,
                startX,
                startY,
                originalPos,
                size,
                startingCallback = options.starting,
                startedCallback = options.started,
                movingCallback = options.moving,
                stoppedCallback = options.stopped,

                start = function(e) {
                    var docSize = geom.getDocumentSize(doc),
                        cursor;

                    updateWithTouchData(e);
                    updateWithMoveData(e);

                    if (startingCallback) {
                        var ret = startingCallback(e)
                        if ( ret === false) {
                            return;
                        } else if (langx.isPlainObject(ret)) {
                            if (ret.constraints) {
                                constraints = ret.constraints;
                            }
                            if (ret.started) {
                                startedCallback = ret.started;
                            }
                            if (ret.moving) {
                                movingCallback = ret.moving;
                            }                            
                            if (ret.stopped) {
                                stoppedCallback = ret.stopped;
                            }     
                        }
                    }

                    e.preventDefault();

                    downButton = e.button;
                    //handleEl = getHandleEl();
                    startX = e.screenX;
                    startY = e.screenY;

                    originalPos = geom.relativePosition(elm);
                    size = geom.size(elm);

                    // Grab cursor from handle so we can place it on overlay
                    cursor = styler.css(handleEl, "curosr");

                    overlayDiv = noder.createElement("div");
                    styler.css(overlayDiv, {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: docSize.width,
                        height: docSize.height,
                        zIndex: 0x7FFFFFFF,
                        opacity: 0.0001,
                        cursor: cursor
                    });
                    noder.append(doc.body, overlayDiv);

                    eventer.on(doc, "mousemove touchmove", move).on(doc, "mouseup touchend", stop);

                    if (startedCallback) {
                        startedCallback(e);
                    }
                },

                move = function(e) {
                    updateWithTouchData(e);
                    updateWithMoveData(e);

                    if (e.button !== 0) {
                        return stop(e);
                    }

                    e.deltaX = e.screenX - startX;
                    e.deltaY = e.screenY - startY;

                    if (auto) {
                        var l = originalPos.left + e.deltaX,
                            t = originalPos.top + e.deltaY;
                        if (constraints) {

                            if (l < constraints.minX) {
                                l = constraints.minX;
                            }

                            if (l > constraints.maxX) {
                                l = constraints.maxX;
                            }

                            if (t < constraints.minY) {
                                t = constraints.minY;
                            }

                            if (t > constraints.maxY) {
                                t = constraints.maxY;
                            }
                        }
                    }

                    geom.relativePosition(elm, {
                        left: l,
                        top: t
                    })

                    e.preventDefault();
                    if (movingCallback) {
                        movingCallback(e);
                    }
                },

                stop = function(e) {
                    updateWithTouchData(e);

                    eventer.off(doc, "mousemove touchmove", move).off(doc, "mouseup touchend", stop);

                    noder.remove(overlayDiv);

                    if (stoppedCallback) {
                        stoppedCallback(e);
                    }
                };

            eventer.on(handleEl, "mousedown touchstart", start);

            this._handleEl = handleEl;

        },

        remove : function() {
            eventer.off(this._handleEl);
        }
    });

    plugins.register(Movable,"movable");

    return interact.Movable = Movable;
});

define('skylark-photoviewer/draggable',[
    "skylark-domx-plugins-interact/movable",
    './domq',
    './constants'
], function (_movable,$, Constants) {
    'use strict';
    return {
        draggable(modal, dragHandle, dragCancel) {
            /*
            let isDragging = false;
            let startX = 0;
            let startY = 0;
            let left = 0;
            let top = 0;
            const dragStart = e => {
                e = e || window.event;
                modal.get(0).focus();
                const elemCancel = $(e.target).closest(dragCancel);
                if (elemCancel.length) {
                    return true;
                }
                if (this.options.multiInstances) {
                    modal.css('z-index', ++Constants.PUBLIC_VARS['zIndex']);
                }
                isDragging = true;
                startX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.clientX;
                startY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.clientY;
                left = $(modal).offset().left;
                top = $(modal).offset().top;
                Constants.$D.on(Constants.TOUCH_MOVE_EVENT + Constants.EVENT_NS, dragMove).on(Constants.TOUCH_END_EVENT + Constants.EVENT_NS, dragEnd);
            };
            const dragMove = e => {
                e = e || window.event;
                e.preventDefault();
                if (isDragging && !Constants.PUBLIC_VARS['isMoving'] && !Constants.PUBLIC_VARS['isResizing'] && !this.isMaximized) {
                    const endX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.clientX;
                    const endY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.clientY;
                    const relativeX = endX - startX;
                    const relativeY = endY - startY;
                    $(modal).css({
                        left: relativeX + left + 'px',
                        top: relativeY + top + 'px'
                    });
                }
            };
            const dragEnd = () => {
                Constants.$D.off(Constants.TOUCH_MOVE_EVENT + Constants.EVENT_NS, dragMove).off(Constants.TOUCH_END_EVENT + Constants.EVENT_NS, dragEnd);
                isDragging = false;
            };
            $(dragHandle).on(Constants.TOUCH_START_EVENT + Constants.EVENT_NS, dragStart);
            */
            _movable($(modal)[0]);
        }
    };
});
define('skylark-photoviewer/movable',[
    "skylark-domx-eventer",
    "skylark-domx-plugins-interact/movable",
    './domq',
    './constants'
], function (eventer,_movable,$, Constants) {
    'use strict';
    const ELEMS_WITH_GRABBING_CURSOR = `html, body, .${ Constants.NS }-modal, .${ Constants.NS }-stage, .${ Constants.NS }-button, .${ Constants.NS }-resizable-handle`;
    return {
        movable(stage, image) {
            /*
            let isDragging = false;
            let startX = 0;
            let startY = 0;
            let left = 0;
            let top = 0;
            let widthDiff = 0;
            let heightDiff = 0;
            let δ = 0;
            const dragStart = e => {
                e = e || window.event;
                e.preventDefault();
                const imageWidth = $(image).width();
                const imageHeight = $(image).height();
                const stageWidth = $(stage).width();
                const stageHeight = $(stage).height();
                startX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.clientX;
                startY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.clientY;
                δ = !this.isRotated ? 0 : (imageWidth - imageHeight) / 2;
                widthDiff = !this.isRotated ? imageWidth - stageWidth : imageHeight - stageWidth;
                heightDiff = !this.isRotated ? imageHeight - stageHeight : imageWidth - stageHeight;
                isDragging = widthDiff > 0 || heightDiff > 0 ? true : false;
                Constants.PUBLIC_VARS['isMoving'] = widthDiff > 0 || heightDiff > 0 ? true : false;
                left = $(image).position().left - δ;
                top = $(image).position().top + δ;
                if (stage.hasClass('is-grab')) {
                    $(ELEMS_WITH_GRABBING_CURSOR).addClass('is-grabbing');
                }
                Constants.$D.on(Constants.TOUCH_MOVE_EVENT + Constants.EVENT_NS, dragMove).on(Constants.TOUCH_END_EVENT + Constants.EVENT_NS, dragEnd);
            };
            const dragMove = e => {
                e = e || window.event;
                e.preventDefault();
                if (isDragging) {
                    const endX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.clientX;
                    const endY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.clientY;
                    const relativeX = endX - startX;
                    const relativeY = endY - startY;
                    let newLeft = relativeX + left;
                    let newTop = relativeY + top;
                    if (heightDiff > 0) {
                        if (relativeY + top > δ) {
                            newTop = δ;
                        } else if (relativeY + top < -heightDiff + δ) {
                            newTop = -heightDiff + δ;
                        }
                    } else {
                        newTop = top;
                    }
                    if (widthDiff > 0) {
                        if (relativeX + left > -δ) {
                            newLeft = -δ;
                        } else if (relativeX + left < -widthDiff - δ) {
                            newLeft = -widthDiff - δ;
                        }
                    } else {
                        newLeft = left;
                    }
                    $(image).css({
                        left: newLeft + 'px',
                        top: newTop + 'px'
                    });
                    $.extend(this.imageData, {
                        left: newLeft,
                        top: newTop
                    });
                }
            };
            const dragEnd = () => {
                Constants.$D.off(Constants.TOUCH_MOVE_EVENT + Constants.EVENT_NS, dragMove).off(Constants.TOUCH_END_EVENT + Constants.EVENT_NS, dragEnd);
                isDragging = false;
                Constants.PUBLIC_VARS['isMoving'] = false;
                $(ELEMS_WITH_GRABBING_CURSOR).removeClass('is-grabbing');
            };
            $(stage).on(Constants.TOUCH_START_EVENT + Constants.EVENT_NS, dragStart);
            */
            
            

            return _movable(image[0],{
                starting : function(e) {
                    if (stage.hasClass('is-grab')) {

                    } else {
                        return false;
                    }
                    const imageWidth = $(image).width();
                    const imageHeight = $(image).height();
                    const stageWidth = $(stage).width();
                    const stageHeight = $(stage).height();
                    let minX,minY,maxX,maxY;

                    if (stageWidth>=imageWidth) {
                        minX=maxX=(stageWidth-imageWidth) / 2;
                    } else {
                        minX = stageWidth - imageWidth;
                        maxX = 0;
                    }

                    if (stageHeight>=imageHeight) {
                        minY=maxY=(stageHeight-imageHeight) / 2;
                    } else {
                        minY = stageHeight - imageHeight;
                        maxY = 0;
                    }

                    return {
                        constraints : {
                             minX,
                            maxX,
                            minY,
                            maxY
                        }
                    };
                },
                started : function(e) {
                    eventer.stop(e);
                }
            });
        }
    };
});
define('skylark-photoviewer/resizable',[
    './domq',
    './constants',
    './utilities'
], function ($, Constants, Utilities) {
    'use strict';
    const ELEMS_WITH_RESIZE_CURSOR = `html, body, .${ Constants.NS }-modal, .${ Constants.NS }-stage, .${ Constants.NS }-button`;
    return {
        resizable(modal, stage, image, minWidth, minHeight) {
            const resizableHandleE = $(`<div class="${ Constants.NS }-resizable-handle ${ Constants.NS }-resizable-handle-e"></div>`);
            const resizableHandleW = $(`<div class="${ Constants.NS }-resizable-handle ${ Constants.NS }-resizable-handle-w"></div>`);
            const resizableHandleS = $(`<div class="${ Constants.NS }-resizable-handle ${ Constants.NS }-resizable-handle-s"></div>`);
            const resizableHandleN = $(`<div class="${ Constants.NS }-resizable-handle ${ Constants.NS }-resizable-handle-n"></div>`);
            const resizableHandleSE = $(`<div class="${ Constants.NS }-resizable-handle ${ Constants.NS }-resizable-handle-se"></div>`);
            const resizableHandleSW = $(`<div class="${ Constants.NS }-resizable-handle ${ Constants.NS }-resizable-handle-sw"></div>`);
            const resizableHandleNE = $(`<div class="${ Constants.NS }-resizable-handle ${ Constants.NS }-resizable-handle-ne"></div>`);
            const resizableHandleNW = $(`<div class="${ Constants.NS }-resizable-handle ${ Constants.NS }-resizable-handle-nw"></div>`);
            const resizableHandles = {
                e: resizableHandleE,
                s: resizableHandleS,
                se: resizableHandleSE,
                n: resizableHandleN,
                w: resizableHandleW,
                nw: resizableHandleNW,
                ne: resizableHandleNE,
                sw: resizableHandleSW
            };
            $(modal).append(resizableHandleE, resizableHandleW, resizableHandleS, resizableHandleN, resizableHandleSE, resizableHandleSW, resizableHandleNE, resizableHandleNW);
            let isDragging = false;
            let startX = 0;
            let startY = 0;
            let modalData = {
                w: 0,
                h: 0,
                l: 0,
                t: 0
            };
            let stageData = {
                w: 0,
                h: 0,
                l: 0,
                t: 0
            };
            let imageData = {
                w: 0,
                h: 0,
                l: 0,
                t: 0
            };
            let δ = 0;
            let imgWidth = 0;
            let imgHeight = 0;
            let direction = '';
            const getModalOpts = function (dir, offsetX, offsetY) {
                const modalLeft = -offsetX + modalData.w > minWidth ? offsetX + modalData.l : modalData.l + modalData.w - minWidth;
                const modalTop = -offsetY + modalData.h > minHeight ? offsetY + modalData.t : modalData.t + modalData.h - minHeight;
                const opts = {
                    e: { width: Math.max(offsetX + modalData.w, minWidth) + 'px' },
                    s: { height: Math.max(offsetY + modalData.h, minHeight) + 'px' },
                    se: {
                        width: Math.max(offsetX + modalData.w, minWidth) + 'px',
                        height: Math.max(offsetY + modalData.h, minHeight) + 'px'
                    },
                    w: {
                        width: Math.max(-offsetX + modalData.w, minWidth) + 'px',
                        left: modalLeft + 'px'
                    },
                    n: {
                        height: Math.max(-offsetY + modalData.h, minHeight) + 'px',
                        top: modalTop + 'px'
                    },
                    nw: {
                        width: Math.max(-offsetX + modalData.w, minWidth) + 'px',
                        height: Math.max(-offsetY + modalData.h, minHeight) + 'px',
                        top: modalTop + 'px',
                        left: modalLeft + 'px'
                    },
                    ne: {
                        width: Math.max(offsetX + modalData.w, minWidth) + 'px',
                        height: Math.max(-offsetY + modalData.h, minHeight) + 'px',
                        top: modalTop + 'px'
                    },
                    sw: {
                        width: Math.max(-offsetX + modalData.w, minWidth) + 'px',
                        height: Math.max(offsetY + modalData.h, minHeight) + 'px',
                        left: modalLeft + 'px'
                    }
                };
                return opts[dir];
            };
            const getImageOpts = function (dir, offsetX, offsetY) {
                const widthDiff = offsetX + modalData.w > minWidth ? stageData.w - imgWidth + offsetX - δ : minWidth - (modalData.w - stageData.w) - imgWidth - δ;
                const heightDiff = offsetY + modalData.h > minHeight ? stageData.h - imgHeight + offsetY + δ : minHeight - (modalData.h - stageData.h) - imgHeight + δ;
                const widthDiff2 = -offsetX + modalData.w > minWidth ? stageData.w - imgWidth - offsetX - δ : minWidth - (modalData.w - stageData.w) - imgWidth - δ;
                const heightDiff2 = -offsetY + modalData.h > minHeight ? stageData.h - imgHeight - offsetY + δ : minHeight - (modalData.h - stageData.h) - imgHeight + δ;
                const imgLeft = (widthDiff > 0 ? $(image).position().left : $(image).position().left < 0 ? $(image).position().left : 0) - δ;
                const imgTop = (heightDiff > 0 ? $(image).position().top : $(image).position().top < 0 ? $(image).position().top : 0) + δ;
                const imgLeft2 = (widthDiff2 > 0 ? $(image).position().left : $(image).position().left < 0 ? $(image).position().left : 0) - δ;
                const imgTop2 = (heightDiff2 > 0 ? $(image).position().top : $(image).position().top < 0 ? $(image).position().top : 0) + δ;
                const opts = {
                    e: { left: widthDiff >= -δ ? (widthDiff - δ) / 2 + 'px' : imgLeft > widthDiff ? imgLeft + 'px' : widthDiff + 'px' },
                    s: { top: heightDiff >= δ ? (heightDiff + δ) / 2 + 'px' : imgTop > heightDiff ? imgTop + 'px' : heightDiff + 'px' },
                    se: {
                        top: heightDiff >= δ ? (heightDiff + δ) / 2 + 'px' : imgTop > heightDiff ? imgTop + 'px' : heightDiff + 'px',
                        left: widthDiff >= -δ ? (widthDiff - δ) / 2 + 'px' : imgLeft > widthDiff ? imgLeft + 'px' : widthDiff + 'px'
                    },
                    w: { left: widthDiff2 >= -δ ? (widthDiff2 - δ) / 2 + 'px' : imgLeft2 > widthDiff2 ? imgLeft2 + 'px' : widthDiff2 + 'px' },
                    n: { top: heightDiff2 >= δ ? (heightDiff2 + δ) / 2 + 'px' : imgTop2 > heightDiff2 ? imgTop2 + 'px' : heightDiff2 + 'px' },
                    nw: {
                        top: heightDiff2 >= δ ? (heightDiff2 + δ) / 2 + 'px' : imgTop2 > heightDiff2 ? imgTop2 + 'px' : heightDiff2 + 'px',
                        left: widthDiff2 >= -δ ? (widthDiff2 - δ) / 2 + 'px' : imgLeft2 > widthDiff2 ? imgLeft2 + 'px' : widthDiff2 + 'px'
                    },
                    ne: {
                        top: heightDiff2 >= δ ? (heightDiff2 + δ) / 2 + 'px' : imgTop2 > heightDiff2 ? imgTop2 + 'px' : heightDiff2 + 'px',
                        left: widthDiff >= -δ ? (widthDiff - δ) / 2 + 'px' : imgLeft > widthDiff ? imgLeft + 'px' : widthDiff + 'px'
                    },
                    sw: {
                        top: heightDiff >= δ ? (heightDiff + δ) / 2 + 'px' : imgTop > heightDiff ? imgTop + 'px' : heightDiff + 'px',
                        left: widthDiff2 >= -δ ? (widthDiff2 - δ) / 2 + 'px' : imgLeft2 > widthDiff2 ? imgLeft2 + 'px' : widthDiff2 + 'px'
                    }
                };
                return opts[dir];
            };
            const dragStart = (dir, e) => {
                e = e || window.event;
                e.preventDefault();
                isDragging = true;
                Constants.PUBLIC_VARS['isResizing'] = true;
                startX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.clientX;
                startY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.clientY;
                modalData = {
                    w: $(modal).width(),
                    h: $(modal).height(),
                    l: $(modal).offset().left,
                    t: $(modal).offset().top
                };
                stageData = {
                    w: $(stage).width(),
                    h: $(stage).height(),
                    l: $(stage).offset().left,
                    t: $(stage).offset().top
                };
                imageData = {
                    w: $(image).width(),
                    h: $(image).height(),
                    l: $(image).position().left,
                    t: $(image).position().top
                };
                δ = !this.isRotated ? 0 : (imageData.w - imageData.h) / 2;
                imgWidth = !this.isRotated ? imageData.w : imageData.h;
                imgHeight = !this.isRotated ? imageData.h : imageData.w;
                direction = dir;
                $(ELEMS_WITH_RESIZE_CURSOR).css('cursor', dir + '-resize');
                Constants.$D.on(Constants.TOUCH_MOVE_EVENT + Constants.EVENT_NS, dragMove).on(Constants.TOUCH_END_EVENT + Constants.EVENT_NS, dragEnd);
            };
            const dragMove = e => {
                e = e || window.event;
                e.preventDefault();
                if (isDragging && !this.isMaximized) {
                    const endX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.clientX;
                    const endY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.clientY;
                    const relativeX = endX - startX;
                    const relativeY = endY - startY;
                    const modalOpts = getModalOpts(direction, relativeX, relativeY);
                    $(modal).css(modalOpts);
                    const imageOpts = getImageOpts(direction, relativeX, relativeY);
                    $(image).css(imageOpts);
                    this.isDoResize = true;
                }
            };
            const dragEnd = () => {
                Constants.$D.off(Constants.TOUCH_MOVE_EVENT + Constants.EVENT_NS, dragMove).off(Constants.TOUCH_END_EVENT + Constants.EVENT_NS, dragEnd);
                if (Constants.PUBLIC_VARS['isResizing']) {
                    Utilities.setGrabCursor({
                        w: imgWidth,
                        h: imgHeight
                    }, {
                        w: $(stage).width(),
                        h: $(stage).height()
                    }, stage);
                }
                isDragging = false;
                Constants.PUBLIC_VARS['isResizing'] = false;
                $(ELEMS_WITH_RESIZE_CURSOR).css('cursor', '');
                const scale = this.getImageScaleToStage($(stage).width(), $(stage).height());
                $.extend(this.imageData, {
                    initWidth: this.img.width * scale,
                    initHeight: this.img.height * scale,
                    initLeft: ($(stage).width() - this.img.width * scale) / 2,
                    initTop: ($(stage).height() - this.img.height * scale) / 2
                });
            };
            $.each(resizableHandles, function (dir, handle) {
                handle.on(Constants.TOUCH_START_EVENT + Constants.EVENT_NS, function (e) {
                    dragStart(dir, e);
                });
            });
        }
    };
});
define('skylark-photoviewer/core',[
    './domq',
    './defaults',
    './constants',
    './utilities',
    './draggable',
    './movable',
    './resizable'
], function ($, DEFAULTS, Constants, Utilities, draggable, movable, resizable) {
    'use strict';
    class PhotoViewer {
        constructor(items, options, el) {
            this.options = $.extend(true, {}, DEFAULTS, options);
            if (options && $.isArray(options.footerToolbar)) {
                this.options.footerToolbar = options.footerToolbar;
            }
            if (options && $.isArray(options.headerToolbar)) {
                this.options.headerToolbar = options.headerToolbar;
            }
            this.$el = $(el);
            this.isOpened = false;
            this.isMaximized = false;
            this.isRotated = false;
            this.rotateAngle = 0;
            this.isDoResize = false;
            this.imageData = {};
            this.modalData = {
                width: null,
                height: null,
                left: null,
                top: null
            };
            this.init(items, this.options);
        }
        init(items, opts) {
            this.groupData = items;
            this.groupIndex = opts['index'];
            Constants.PUBLIC_VARS['zIndex'] = Constants.PUBLIC_VARS['zIndex'] === 0 ? opts['zIndex'] : Constants.PUBLIC_VARS['zIndex'];
            const imgSrc = items[this.groupIndex]['src'];
            this.open();
            this.loadImage(imgSrc);
            if (opts.draggable) {
                this.draggable(this.$photoviewer, this.dragHandle, Constants.CLASS_NS + '-button');
            }
            if (opts.movable) {
                this.movable(this.$stage, this.$image);
            }
            if (opts.resizable) {
                this.resizable(this.$photoviewer, this.$stage, this.$image, opts.modalWidth, opts.modalHeight);
            }
        }
        _createBtns(toolbar) {
            const btns = [
                'minimize',
                'maximize',
                'close',
                'zoomIn',
                'zoomOut',
                'prev',
                'next',
                'fullscreen',
                'actualSize',
                'rotateLeft',
                'rotateRight'
            ];
            let btnsHTML = '';
            $.each(toolbar, (index, item) => {
                const btnClass = `${ Constants.NS }-button ${ Constants.NS }-button-${ item }`;
                if (btns.indexOf(item) >= 0) {
                    btnsHTML += `<button class="${ btnClass }" title="${ this.options.i18n[item] }">
          ${ this.options.icons[item] }
          </button>`;
                } else if (this.options.customButtons[item]) {
                    btnsHTML += `<button class="${ btnClass }" title="${ this.options.customButtons[item].title || '' }">
          ${ this.options.customButtons[item].text }
          </button>`;
                }
            });
            return btnsHTML;
        }
        _createTitle() {
            return this.options.title ? `<div class="${ Constants.NS }-title"></div>` : '';
        }
        _createTemplate() {
            const photoviewerHTML = `<div class="${ Constants.NS }-modal" tabindex="0">
        <div class="${ Constants.NS }-inner">
          <div class="${ Constants.NS }-header">
            <div class="${ Constants.NS }-toolbar ${ Constants.NS }-toolbar-header">
            ${ this._createBtns(this.options.headerToolbar) }
            </div>
            ${ this._createTitle() }
          </div>
          <div class="${ Constants.NS }-stage">
            <img class="${ Constants.NS }-image" src="" alt="" />
          </div>
          <div class="${ Constants.NS }-footer">
            <div class="${ Constants.NS }-toolbar ${ Constants.NS }-toolbar-footer">
            ${ this._createBtns(this.options.footerToolbar) }
            </div>
          </div>
        </div>
      </div>`;
            return photoviewerHTML;
        }
        build() {
            const photoviewerHTML = this._createTemplate();
            const $photoviewer = $(photoviewerHTML);
            this.$photoviewer = $photoviewer;
            this.$stage = $photoviewer.find(Constants.CLASS_NS + '-stage');
            this.$title = $photoviewer.find(Constants.CLASS_NS + '-title');
            this.$image = $photoviewer.find(Constants.CLASS_NS + '-image');
            this.$close = $photoviewer.find(Constants.CLASS_NS + '-button-close');
            this.$maximize = $photoviewer.find(Constants.CLASS_NS + '-button-maximize');
            this.$minimize = $photoviewer.find(Constants.CLASS_NS + '-button-minimize');
            this.$zoomIn = $photoviewer.find(Constants.CLASS_NS + '-button-zoomIn');
            this.$zoomOut = $photoviewer.find(Constants.CLASS_NS + '-button-zoomOut');
            this.$actualSize = $photoviewer.find(Constants.CLASS_NS + '-button-actualSize');
            this.$fullscreen = $photoviewer.find(Constants.CLASS_NS + '-button-fullscreen');
            this.$rotateLeft = $photoviewer.find(Constants.CLASS_NS + '-button-rotateLeft');
            this.$rotateRight = $photoviewer.find(Constants.CLASS_NS + '-button-rotateRight');
            this.$prev = $photoviewer.find(Constants.CLASS_NS + '-button-prev');
            this.$next = $photoviewer.find(Constants.CLASS_NS + '-button-next');
            this.$stage.addClass('stage-ready');
            this.$image.addClass('image-ready');
            this.$photoviewer.css('z-index', Constants.PUBLIC_VARS['zIndex']);
            if (!this.options.dragHandle || this.options.dragHandle === Constants.CLASS_NS + '-modal') {
                this.dragHandle = this.$photoviewer;
            } else {
                this.dragHandle = this.$photoviewer.find(this.options.dragHandle);
            }
            $(this.options.appendTo).eq(0).append(this.$photoviewer);
            this._addEvents();
            this._addCustomButtonEvents();
        }
        open() {
            this._triggerHook('beforeOpen', this);
            if (!this.options.multiInstances) {
                $(Constants.CLASS_NS + '-modal').eq(0).remove();
            }
            if (!$(Constants.CLASS_NS + '-modal').length && this.options.fixedContent) {
                $('html').css({ overflow: 'hidden' });
                if (Utilities.hasScrollbar()) {
                    const scrollbarWidth = Utilities.getScrollbarWidth();
                    if (scrollbarWidth) {
                        $('html').css({ 'padding-right': scrollbarWidth });
                    }
                }
            }
            this.build();
            this.setModalPos(this.$photoviewer);
            this.$photoviewer.get(0).focus();
            this._triggerHook('opened', this);
        }
        close() {
            this._triggerHook('beforeClose', this);
            this.$photoviewer.remove();
            this.isOpened = false;
            this.isMaximized = false;
            this.isRotated = false;
            this.rotateAngle = 0;
            if (!$(Constants.CLASS_NS + '-modal').length) {
                if (this.options.fixedContent) {
                    $('html').css({
                        overflow: '',
                        'padding-right': ''
                    });
                }
                if (this.options.multiInstances) {
                    Constants.PUBLIC_VARS['zIndex'] = this.options.zIndex;
                }
                Constants.$W.off(Constants.RESIZE_EVENT + Constants.EVENT_NS);
            }
            this._triggerHook('closed', this);
        }
        setModalPos(modal) {
            const winWidth = Constants.$W.width();
            const winHeight = Constants.$W.height();
            const scrollLeft = Constants.$D.scrollLeft();
            const scrollTop = Constants.$D.scrollTop();
            const modalWidth = this.options.modalWidth;
            const modalHeight = this.options.modalHeight;
            if (this.options.initMaximized) {
                modal.addClass(Constants.NS + '-maximize');
                modal.css({
                    width: '100%',
                    height: '100%',
                    left: 0,
                    top: 0
                });
                this.isOpened = true;
                this.isMaximized = true;
            } else {
                modal.css({
                    width: modalWidth,
                    height: modalHeight,
                    left: (winWidth - modalWidth) / 2 + scrollLeft + 'px',
                    top: (winHeight - modalHeight) / 2 + scrollTop + 'px'
                });
            }
        }
        setModalSize(img) {
            const winWidth = Constants.$W.width();
            const winHeight = Constants.$W.height();
            const scrollLeft = Constants.$D.scrollLeft();
            const scrollTop = Constants.$D.scrollTop();
            const stageCSS = {
                left: this.$stage.css('left'),
                right: this.$stage.css('right'),
                top: this.$stage.css('top'),
                bottom: this.$stage.css('bottom'),
                borderLeft: this.$stage.css('border-left-width'),
                borderRight: this.$stage.css('border-right-width'),
                borderTop: this.$stage.css('border-top-width'),
                borderBottom: this.$stage.css('border-bottom-width')
            };
            const modalWidth = img.width + parseFloat(stageCSS.left) + parseFloat(stageCSS.right) + parseFloat(stageCSS.borderLeft) + parseFloat(stageCSS.borderRight);
            const modalHeight = img.height + parseFloat(stageCSS.top) + parseFloat(stageCSS.bottom) + parseFloat(stageCSS.borderTop) + parseFloat(stageCSS.borderBottom);
            const gapThreshold = (this.options.gapThreshold > 0 ? this.options.gapThreshold : 0) + 1;
            const scale = Math.min(winWidth / (modalWidth * gapThreshold), winHeight / (modalHeight * gapThreshold), 1);
            let minWidth = Math.max(modalWidth * scale, this.options.modalWidth);
            let minHeight = Math.max(modalHeight * scale, this.options.modalHeight);
            minWidth = this.options.fixedModalSize ? this.options.modalWidth : Math.round(minWidth);
            minHeight = this.options.fixedModalSize ? this.options.modalHeight : Math.round(minHeight);
            const modalCSSObj = {
                width: minWidth + 'px',
                height: minHeight + 'px',
                left: (winWidth - minWidth) / 2 + scrollLeft + 'px',
                top: (winHeight - minHeight) / 2 + scrollTop + 'px'
            };
            if (this.options.initAnimation) {
                this.$photoviewer.animate(modalCSSObj, 400, 'ease-in-out', () => {
                    this.setImageSize(img);
                });
            } else {
                this.$photoviewer.css(modalCSSObj);
                this.setImageSize(img);
            }
            this.isOpened = true;
        }
        getImageScaleToStage(stageWidth, stageHeight) {
            let scale = 1;
            if (!this.isRotated) {
                scale = Math.min(stageWidth / this.img.width, stageHeight / this.img.height, 1);
            } else {
                scale = Math.min(stageWidth / this.img.height, stageHeight / this.img.width, 1);
            }
            return scale;
        }
        setImageSize(img) {
            const stageData = {
                w: this.$stage.width(),
                h: this.$stage.height()
            };
            const scale = this.getImageScaleToStage(stageData.w, stageData.h);
            this.$image.css({
                width: Math.ceil(img.width * scale) + 'px',
                height: Math.ceil(img.height * scale) + 'px',
                left: (stageData.w - Math.ceil(img.width * scale)) / 2 + 'px',
                top: (stageData.h - Math.ceil(img.height * scale)) / 2 + 'px'
            });
            $.extend(this.imageData, {
                initWidth: img.width * scale,
                initHeight: img.height * scale,
                initLeft: (stageData.w - img.width * scale) / 2,
                initTop: (stageData.h - img.height * scale) / 2,
                width: img.width * scale,
                height: img.height * scale,
                left: (stageData.w - img.width * scale) / 2,
                top: (stageData.h - img.height * scale) / 2
            });
            Utilities.setGrabCursor({
                w: this.$image.width(),
                h: this.$image.height()
            }, {
                w: this.$stage.width(),
                h: this.$stage.height()
            }, this.$stage, this.isRotated);
            if (!this.imageLoaded) {
                this.$photoviewer.find(Constants.CLASS_NS + '-loader').remove();
                this.$stage.removeClass('stage-ready');
                this.$image.removeClass('image-ready');
                if (this.options.initAnimation && !this.options.progressiveLoading) {
                    this.$image.fadeIn();
                }
                this.imageLoaded = true;
            }
        }
        loadImage(imgSrc, fn, err) {
            this.$image.removeAttr('style').attr('src', '');
            this.isRotated = false;
            this.rotateAngle = 0;
            this.imageLoaded = false;
            this.$photoviewer.append(`<div class="${ Constants.NS }-loader"></div>`);
            this.$stage.addClass('stage-ready');
            this.$image.addClass('image-ready');
            if (this.options.initAnimation && !this.options.progressiveLoading) {
                this.$image.hide();
            }
            this.$image.attr('src', imgSrc);
            Utilities.preloadImage(imgSrc, img => {
                this.img = img;
                this.imageData = {
                    originalWidth: img.width,
                    originalHeight: img.height
                };
                if (this.isMaximized || this.isOpened && this.options.fixedModalPos) {
                    this.setImageSize(img);
                } else {
                    this.setModalSize(img);
                }
                if (fn) {
                    fn.call();
                }
            }, () => {
                this.$photoviewer.find(Constants.CLASS_NS + '-loader').remove();
                if (err) {
                    err.call();
                }
            });
            if (this.options.title) {
                this.setImageTitle(imgSrc);
            }
        }
        setImageTitle(url) {
            const title = this.groupData[this.groupIndex].title || Utilities.getImageNameFromUrl(url);
            this.$title.html(title);
        }
        jump(step) {
            this._triggerHook('beforeChange', [
                this,
                this.groupIndex
            ]);
            this.groupIndex = this.groupIndex + step;
            this.jumpTo(this.groupIndex);
        }
        jumpTo(index) {
            index = index % this.groupData.length;
            if (index >= 0) {
                index = index % this.groupData.length;
            } else if (index < 0) {
                index = (this.groupData.length + index) % this.groupData.length;
            }
            this.groupIndex = index;
            this.loadImage(this.groupData[index].src, () => {
                this._triggerHook('changed', [
                    this,
                    index
                ]);
            }, () => {
                this._triggerHook('changed', [
                    this,
                    index
                ]);
            });
        }
        wheel(e) {
            e.preventDefault();
            let delta = 1;
            if (e.deltaY) {
                delta = e.deltaY > 0 ? 1 : -1;
            } else if (e.wheelDelta) {
                delta = -e.wheelDelta / 120;
            } else if (e.detail) {
                delta = e.detail > 0 ? 1 : -1;
            }
            const ratio = -delta * this.options.ratioThreshold;
            const pointer = {
                x: e.clientX - this.$stage.offset().left + Constants.$D.scrollLeft(),
                y: e.clientY - this.$stage.offset().top + Constants.$D.scrollTop()
            };
            this.zoom(ratio, pointer, e);
        }
        zoom(ratio, origin, e) {
            ratio = ratio < 0 ? 1 / (1 - ratio) : 1 + ratio;
            ratio = this.$image.width() / this.imageData.originalWidth * ratio;
            if (ratio > this.options.maxRatio || ratio < this.options.minRatio) {
                return;
            }
            this.zoomTo(ratio, origin, e);
        }
        zoomTo(ratio, origin, e) {
            const $image = this.$image;
            const $stage = this.$stage;
            const imgData = {
                w: this.imageData.width,
                h: this.imageData.height,
                x: this.imageData.left,
                y: this.imageData.top
            };
            const stageData = {
                w: $stage.width(),
                h: $stage.height(),
                x: $stage.offset().left,
                y: $stage.offset().top
            };
            const newWidth = this.imageData.originalWidth * ratio;
            const newHeight = this.imageData.originalHeight * ratio;
            let newLeft = origin.x - (origin.x - imgData.x) / imgData.w * newWidth;
            let newTop = origin.y - (origin.y - imgData.y) / imgData.h * newHeight;
            const δ = !this.isRotated ? 0 : (newWidth - newHeight) / 2;
            const imgNewWidth = !this.isRotated ? newWidth : newHeight;
            const imgNewHeight = !this.isRotated ? newHeight : newWidth;
            const offsetX = stageData.w - newWidth;
            const offsetY = stageData.h - newHeight;
            if (imgNewHeight <= stageData.h) {
                newTop = (stageData.h - newHeight) / 2;
            } else {
                newTop = newTop > δ ? δ : newTop > offsetY - δ ? newTop : offsetY - δ;
            }
            if (imgNewWidth <= stageData.w) {
                newLeft = (stageData.w - newWidth) / 2;
            } else {
                newLeft = newLeft > -δ ? -δ : newLeft > offsetX + δ ? newLeft : offsetX + δ;
            }
            if (Math.abs(this.imageData.initWidth - newWidth) < this.imageData.initWidth * 0.05) {
                this.setImageSize(this.img);
            } else {
                $image.css({
                    width: Math.round(newWidth) + 'px',
                    height: Math.round(newHeight) + 'px',
                    left: Math.round(newLeft) + 'px',
                    top: Math.round(newTop) + 'px'
                });
                Utilities.setGrabCursor({
                    w: Math.round(imgNewWidth),
                    h: Math.round(imgNewHeight)
                }, {
                    w: stageData.w,
                    h: stageData.h
                }, this.$stage);
            }
            $.extend(this.imageData, {
                width: newWidth,
                height: newHeight,
                left: newLeft,
                top: newTop
            });
        }
        rotate(angle) {
            this.rotateAngle = this.rotateAngle + angle;
            if (this.rotateAngle / 90 % 2 === 0) {
                this.isRotated = false;
            } else {
                this.isRotated = true;
            }
            this.rotateTo(this.rotateAngle);
        }
        rotateTo(angle) {
            this.$image.css({ transform: 'rotate(' + angle + 'deg)' });
            this.setImageSize({
                width: this.imageData.originalWidth,
                height: this.imageData.originalHeight
            });
            this.$stage.removeClass('is-grab');
        }
        resize() {
            const resizeHandler = Utilities.throttle(() => {
                if (this.isOpened) {
                    if (this.isMaximized) {
                        this.setImageSize({
                            width: this.imageData.originalWidth,
                            height: this.imageData.originalHeight
                        });
                    } else {
                        this.setModalSize({
                            width: this.imageData.originalWidth,
                            height: this.imageData.originalHeight
                        });
                    }
                }
            }, 500);
            return resizeHandler;
        }
        maximize() {
            this.$photoviewer.get(0).focus();
            if (!this.isMaximized) {
                this.modalData = {
                    width: this.$photoviewer.width(),
                    height: this.$photoviewer.height(),
                    left: this.$photoviewer.offset().left,
                    top: this.$photoviewer.offset().top
                };
                this.$photoviewer.addClass(Constants.NS + '-maximize');
                this.$photoviewer.css({
                    width: '100%',
                    height: '100%',
                    left: 0,
                    top: 0
                });
                this.isMaximized = true;
            } else {
                this.$photoviewer.removeClass(Constants.NS + '-maximize');
                const initModalLeft = (Constants.$W.width() - this.options.modalWidth) / 2 + Constants.$D.scrollLeft();
                const initModalTop = (Constants.$W.height() - this.options.modalHeight) / 2 + Constants.$D.scrollTop();
                this.$photoviewer.css({
                    width: this.modalData.width ? this.modalData.width : this.options.modalWidth,
                    height: this.modalData.height ? this.modalData.height : this.options.modalHeight,
                    left: this.modalData.left ? this.modalData.left : initModalLeft,
                    top: this.modalData.top ? this.modalData.top : initModalTop
                });
                this.isMaximized = false;
            }
            this.setImageSize({
                width: this.imageData.originalWidth,
                height: this.imageData.originalHeight
            });
        }
        fullscreen() {
            this.$photoviewer.get(0).focus();
            Utilities.requestFullscreen(this.$photoviewer[0]);
        }
        _keydown(e) {
            if (!this.options.keyboard) {
                return false;
            }
            const keyCode = e.keyCode || e.which || e.charCode;
            const ctrlKey = e.ctrlKey || e.metaKey;
            const altKey = e.altKey || e.metaKey;
            switch (keyCode) {
            case 37:
                this.jump(-1);
                break;
            case 39:
                this.jump(1);
                break;
            case 187:
                this.zoom(this.options.ratioThreshold * 3, {
                    x: this.$stage.width() / 2,
                    y: this.$stage.height() / 2
                }, e);
                break;
            case 189:
                this.zoom(-this.options.ratioThreshold * 3, {
                    x: this.$stage.width() / 2,
                    y: this.$stage.height() / 2
                }, e);
                break;
            case 61:
                this.zoom(this.options.ratioThreshold * 3, {
                    x: this.$stage.width() / 2,
                    y: this.$stage.height() / 2
                }, e);
                break;
            case 173:
                this.zoom(-this.options.ratioThreshold * 3, {
                    x: this.$stage.width() / 2,
                    y: this.$stage.height() / 2
                }, e);
                break;
            case 48:
                if (ctrlKey && altKey) {
                    this.zoomTo(1, {
                        x: this.$stage.width() / 2,
                        y: this.$stage.height() / 2
                    }, e);
                }
                break;
            case 188:
                if (ctrlKey) {
                    this.rotate(-90);
                }
                break;
            case 190:
                if (ctrlKey) {
                    this.rotate(90);
                }
                break;
            case 81:
                this.close();
                break;
            default:
            }
        }
        _addEvents() {
            this.$close.off(Constants.CLICK_EVENT + Constants.EVENT_NS).on(Constants.CLICK_EVENT + Constants.EVENT_NS, e => {
                this.close();
            });
            this.$stage.off(Constants.WHEEL_EVENT + Constants.EVENT_NS).on(Constants.WHEEL_EVENT + Constants.EVENT_NS, e => {
                this.wheel(e);
            });
            this.$zoomIn.off(Constants.CLICK_EVENT + Constants.EVENT_NS).on(Constants.CLICK_EVENT + Constants.EVENT_NS, e => {
                this.zoom(this.options.ratioThreshold * 3, {
                    x: this.$stage.width() / 2,
                    y: this.$stage.height() / 2
                }, e);
            });
            this.$zoomOut.off(Constants.CLICK_EVENT + Constants.EVENT_NS).on(Constants.CLICK_EVENT + Constants.EVENT_NS, e => {
                this.zoom(-this.options.ratioThreshold * 3, {
                    x: this.$stage.width() / 2,
                    y: this.$stage.height() / 2
                }, e);
            });
            this.$actualSize.off(Constants.CLICK_EVENT + Constants.EVENT_NS).on(Constants.CLICK_EVENT + Constants.EVENT_NS, e => {
                this.zoomTo(1, {
                    x: this.$stage.width() / 2,
                    y: this.$stage.height() / 2
                }, e);
            });
            this.$prev.off(Constants.CLICK_EVENT + Constants.EVENT_NS).on(Constants.CLICK_EVENT + Constants.EVENT_NS, () => {
                this.jump(-1);
            });
            this.$fullscreen.off(Constants.CLICK_EVENT + Constants.EVENT_NS).on(Constants.CLICK_EVENT + Constants.EVENT_NS, () => {
                this.fullscreen();
            });
            this.$next.off(Constants.CLICK_EVENT + Constants.EVENT_NS).on(Constants.CLICK_EVENT + Constants.EVENT_NS, () => {
                this.jump(1);
            });
            this.$rotateLeft.off(Constants.CLICK_EVENT + Constants.EVENT_NS).on(Constants.CLICK_EVENT + Constants.EVENT_NS, () => {
                this.rotate(-90);
            });
            this.$rotateRight.off(Constants.CLICK_EVENT + Constants.EVENT_NS).on(Constants.CLICK_EVENT + Constants.EVENT_NS, () => {
                this.rotate(90);
            });
            this.$maximize.off(Constants.CLICK_EVENT + Constants.EVENT_NS).on(Constants.CLICK_EVENT + Constants.EVENT_NS, () => {
                this.maximize();
            });
            this.$photoviewer.off(Constants.KEYDOWN_EVENT + Constants.EVENT_NS).on(Constants.KEYDOWN_EVENT + Constants.EVENT_NS, e => {
                this._keydown(e);
            });
            Constants.$W.on(Constants.RESIZE_EVENT + Constants.EVENT_NS, this.resize());
        }
        _addCustomButtonEvents() {
            for (const btnKey in this.options.customButtons) {
                this.$photoviewer.find(Constants.CLASS_NS + '-button-' + btnKey).off(Constants.CLICK_EVENT + Constants.EVENT_NS).on(Constants.CLICK_EVENT + Constants.EVENT_NS, e => {
                    this.options.customButtons[btnKey].click.apply(this, [
                        this,
                        e
                    ]);
                });
            }
        }
        _triggerHook(e, data) {
            if (this.options.callbacks[e]) {
                this.options.callbacks[e].apply(this, $.isArray(data) ? data : [data]);
            }
        }
    }
    $.extend(PhotoViewer.prototype, draggable, movable, resizable);
    window.PhotoViewer = PhotoViewer;
    return PhotoViewer;
});
define('skylark-photoviewer/main',[
	'./core'
], function (PhotoViewer) {
    'use strict';
    return PhotoViewer;
});
define('skylark-photoviewer', ['skylark-photoviewer/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-photoviewer.js.map
