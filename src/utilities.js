define([
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