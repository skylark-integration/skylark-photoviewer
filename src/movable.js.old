define([
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