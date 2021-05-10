define([
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