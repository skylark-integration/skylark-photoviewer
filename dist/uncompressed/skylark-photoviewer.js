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
define('skylark-photoviewer/core',[
    "skylark-domx-plugins-pictures/viewer",
    "skylark-domx-plugins-panels/floating",
    './domq',
    './defaults',
    './constants',
    './utilities'
], function (Imager,Window,$, DEFAULTS, Constants, Utilities) {
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
            ///if (opts.draggable) {
            ///    this.draggable(this.$photoviewer, this.dragHandle, Constants.CLASS_NS + '-button');
            ///}
            ///if (opts.movable) {
            ///    this.movable(this.$stage, this.$image);
            ///}
            ///if (opts.resizable) {
            ///    this.resizable(this.$photoviewer, this.$stage, this.$image, opts.modalWidth, opts.modalHeight);
            ///}
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

            this._window = new Window(this.$photoviewer[0],{
                selectors : {
                    headerPane  : "",
                    contentPane : "",
                    footerPane  : "",
                    titlebar : "",
                    buttons : {
                        "fullscreen" : ".photoviewer-button-fullscreen",
                        "maximize" : ".photoviewer-button-maximize",
                        "minimize" : ".photoviewer-button-minimize",     
                        "close" : ".photoviewer-button-close"
                    }
                },
                classes : {
                    "maximize" : Constants.NS + '-maximize',
                },
                fixedContent: true,
                initMaximized: false,



                movable : {

                    dragHandle: this.options.dragHandle,
                    dragCancel: Constants.CLASS_NS + '-button'
                },
                resizable : {
                    minWidth: 320,
                    minHeight: 320,
                    border : {
                        classes :  {
                            all : `${ Constants.NS }-resizable-handle`,
                            top : `${ Constants.NS }-resizable-handle-n`,
                            left: `${ Constants.NS }-resizable-handle-w`,
                            right: `${ Constants.NS }-resizable-handle-e`,
                            bottom: `${ Constants.NS }-resizable-handle-s`, 
                            topLeft : `${ Constants.NS }-resizable-handle-nw`, 
                            topRight : `${ Constants.NS }-resizable-handle-ne`,
                            bottomLeft : `${ Constants.NS }-resizable-handle-sw`,             
                            bottomRight : `${ Constants.NS }-resizable-handle-se`   
                        }
                    }
                }
            });
            this._imager = new Imager(this.$stage[0],{
                ratioThreshold: this.options.ratioThreshold,
                minRatio: this.options.minRatio,
                maxRatio: this.options.maxRatio,
                movable : true,

                classes : {
                    grab : "is-grab",
                    loader : "${ Constants.NS }-loader"
                }                
            });

            this._addEvents();
            this._addCustomButtonEvents();

            this.$photoviewer.on("resized",()=>{
                this._imager.resize();;
            });
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
            this._window.close();
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

        setImageSize(img) {
            this._imager.setImageSize(img);
        }
        loadImage(imgSrc, fn, err) {
            this._imager.loadImage(imgSrc,(img) => {
                this.setModalSize(img);
                if (fn) {
                    fn.call();
                }
            },err);
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
        zoom(ratio, origin, e) {
            this._imager.zoom(ratio,origin,e);
        }
        zoomTo(ratio, origin, e) {
            this._imager.zoomTo(ratio,origin,e);
        }
        rotate(angle) {
            this._imager.rotate(angle);
        }
        rotateTo(angle) {
            this._imager.rotateTo(angle);
        }
        resize() {
            return this._imager.resize();
        }
        maximize() {
            this._window.maximize();
        }
        fullscreen() {
            this._window.fullscreen();
        }
        _keydown(e) {
            if (!this.options.keyboard) {
                return false;
            }
            const keyCode = e.keyCode || e.which || e.charCode;
            const ctrlKey = e.ctrlKey || e.metaKey;
            const altKey = e.altKey || e.metaKey;
            switch (keyCode) {
                // ←
                case 37:
                    this.jump(-1);
                    break;
                // →
                case 39:
                    this.jump(1);
                    break;
                // Q
                case 81:
                    this.close();
                    break;
                default:
            }
        }
        _addEvents() {

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

            this.$next.off(Constants.CLICK_EVENT + Constants.EVENT_NS).on(Constants.CLICK_EVENT + Constants.EVENT_NS, () => {
                this.jump(1);
            });
            this.$rotateLeft.off(Constants.CLICK_EVENT + Constants.EVENT_NS).on(Constants.CLICK_EVENT + Constants.EVENT_NS, () => {
                this.rotate(-90);
            });
            this.$rotateRight.off(Constants.CLICK_EVENT + Constants.EVENT_NS).on(Constants.CLICK_EVENT + Constants.EVENT_NS, () => {
                this.rotate(90);
            });

            this.$photoviewer.off(Constants.KEYDOWN_EVENT + Constants.EVENT_NS).on(Constants.KEYDOWN_EVENT + Constants.EVENT_NS, e => {
                this._keydown(e);
            });
            ///Constants.$W.on(Constants.RESIZE_EVENT + Constants.EVENT_NS, this.resize());
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
    //$.extend(PhotoViewer.prototype, draggable, movable, resizable);

    ///$.extend(PhotoViewer.prototype, movable);

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
