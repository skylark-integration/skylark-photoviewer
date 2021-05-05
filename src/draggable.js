define([
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