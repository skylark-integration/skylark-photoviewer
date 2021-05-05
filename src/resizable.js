define([
    "skylark-domx-eventer",
    "skylark-domx-plugins-interact/resizable",
    './domq',
    './constants',
    './utilities'
], function (eventer,_Resizable,$, Constants, Utilities) {
    'use strict';
    const ELEMS_WITH_RESIZE_CURSOR = `html, body, .${ Constants.NS }-modal, .${ Constants.NS }-stage, .${ Constants.NS }-button`;
    return {
        resizable(modal, stage, image, minWidth, minHeight) {
            /*
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
            */
            let self = this;
            let resizer = new _Resizable($(modal)[0],{
                handle : {
                    border : {
                        directions : {
                            top: true, //n
                            left: true, //w
                            right: true, //e
                            bottom: true, //s
                            topLeft : true, // nw
                            topRight : true, // ne
                            bottomLeft : true, // sw
                            bottomRight : true // se                         
                        },
                        classes : {
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
                },
                constraints : {
                    minWidth,
                    minHeight
                },
                started : function(){
                    Constants.PUBLIC_VARS['isResizing'] = true;
                },
                moving : function(e) {
                    const imageWidth = $(image).width();
                    const imageHeight = $(image).height();
                    const stageWidth = $(stage).width();
                    const stageHeight = $(stage).height();
                    const left = (stageWidth - imageWidth) /2;
                    const top = (stageHeight- imageHeight) /2;
                    $(image).css({
                        left,
                        top
                    });
                },
                stopped :function () {
                    Constants.PUBLIC_VARS['isResizing'] = false;
                }
            });
        }
    };
});