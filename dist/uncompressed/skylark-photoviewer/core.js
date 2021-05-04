define([
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