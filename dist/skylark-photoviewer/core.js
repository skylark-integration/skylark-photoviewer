/**
 * skylark-photoviewer - A version of dat.gui.js  that ported to running on skylarkjs.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-photoviewer/
 * @license MIT
 */
define(["./domq","./defaults","./constants","./utilities","./draggable","./movable","./resizable"],function(t,i,e,s,o,h,a){"use strict";class n{constructor(e,s,o){this.options=t.extend(!0,{},i,s),s&&t.isArray(s.footerToolbar)&&(this.options.footerToolbar=s.footerToolbar),s&&t.isArray(s.headerToolbar)&&(this.options.headerToolbar=s.headerToolbar),this.$el=t(o),this.isOpened=!1,this.isMaximized=!1,this.isRotated=!1,this.rotateAngle=0,this.isDoResize=!1,this.imageData={},this.modalData={width:null,height:null,left:null,top:null},this.init(e,this.options)}init(t,i){this.groupData=t,this.groupIndex=i.index,e.PUBLIC_VARS.zIndex=0===e.PUBLIC_VARS.zIndex?i.zIndex:e.PUBLIC_VARS.zIndex;const s=t[this.groupIndex].src;this.open(),this.loadImage(s),i.draggable&&this.draggable(this.$photoviewer,this.dragHandle,e.CLASS_NS+"-button"),i.movable&&this.movable(this.$stage,this.$image),i.resizable&&this.resizable(this.$photoviewer,this.$stage,this.$image,i.modalWidth,i.modalHeight)}_createBtns(i){const s=["minimize","maximize","close","zoomIn","zoomOut","prev","next","fullscreen","actualSize","rotateLeft","rotateRight"];let o="";return t.each(i,(t,i)=>{const h=`${e.NS}-button ${e.NS}-button-${i}`;s.indexOf(i)>=0?o+=`<button class="${h}" title="${this.options.i18n[i]}">\n          ${this.options.icons[i]}\n          </button>`:this.options.customButtons[i]&&(o+=`<button class="${h}" title="${this.options.customButtons[i].title||""}">\n          ${this.options.customButtons[i].text}\n          </button>`)}),o}_createTitle(){return this.options.title?`<div class="${e.NS}-title"></div>`:""}_createTemplate(){return`<div class="${e.NS}-modal" tabindex="0">\n        <div class="${e.NS}-inner">\n          <div class="${e.NS}-header">\n            <div class="${e.NS}-toolbar ${e.NS}-toolbar-header">\n            ${this._createBtns(this.options.headerToolbar)}\n            </div>\n            ${this._createTitle()}\n          </div>\n          <div class="${e.NS}-stage">\n            <img class="${e.NS}-image" src="" alt="" />\n          </div>\n          <div class="${e.NS}-footer">\n            <div class="${e.NS}-toolbar ${e.NS}-toolbar-footer">\n            ${this._createBtns(this.options.footerToolbar)}\n            </div>\n          </div>\n        </div>\n      </div>`}build(){const i=this._createTemplate(),s=t(i);this.$photoviewer=s,this.$stage=s.find(e.CLASS_NS+"-stage"),this.$title=s.find(e.CLASS_NS+"-title"),this.$image=s.find(e.CLASS_NS+"-image"),this.$close=s.find(e.CLASS_NS+"-button-close"),this.$maximize=s.find(e.CLASS_NS+"-button-maximize"),this.$minimize=s.find(e.CLASS_NS+"-button-minimize"),this.$zoomIn=s.find(e.CLASS_NS+"-button-zoomIn"),this.$zoomOut=s.find(e.CLASS_NS+"-button-zoomOut"),this.$actualSize=s.find(e.CLASS_NS+"-button-actualSize"),this.$fullscreen=s.find(e.CLASS_NS+"-button-fullscreen"),this.$rotateLeft=s.find(e.CLASS_NS+"-button-rotateLeft"),this.$rotateRight=s.find(e.CLASS_NS+"-button-rotateRight"),this.$prev=s.find(e.CLASS_NS+"-button-prev"),this.$next=s.find(e.CLASS_NS+"-button-next"),this.$stage.addClass("stage-ready"),this.$image.addClass("image-ready"),this.$photoviewer.css("z-index",e.PUBLIC_VARS.zIndex),this.options.dragHandle&&this.options.dragHandle!==e.CLASS_NS+"-modal"?this.dragHandle=this.$photoviewer.find(this.options.dragHandle):this.dragHandle=this.$photoviewer,t(this.options.appendTo).eq(0).append(this.$photoviewer),this._addEvents(),this._addCustomButtonEvents()}open(){if(this._triggerHook("beforeOpen",this),this.options.multiInstances||t(e.CLASS_NS+"-modal").eq(0).remove(),!t(e.CLASS_NS+"-modal").length&&this.options.fixedContent&&(t("html").css({overflow:"hidden"}),s.hasScrollbar())){const i=s.getScrollbarWidth();i&&t("html").css({"padding-right":i})}this.build(),this.setModalPos(this.$photoviewer),this.$photoviewer.get(0).focus(),this._triggerHook("opened",this)}close(){this._triggerHook("beforeClose",this),this.$photoviewer.remove(),this.isOpened=!1,this.isMaximized=!1,this.isRotated=!1,this.rotateAngle=0,t(e.CLASS_NS+"-modal").length||(this.options.fixedContent&&t("html").css({overflow:"","padding-right":""}),this.options.multiInstances&&(e.PUBLIC_VARS.zIndex=this.options.zIndex),e.$W.off(e.RESIZE_EVENT+e.EVENT_NS)),this._triggerHook("closed",this)}setModalPos(t){const i=e.$W.width(),s=e.$W.height(),o=e.$D.scrollLeft(),h=e.$D.scrollTop(),a=this.options.modalWidth,n=this.options.modalHeight;this.options.initMaximized?(t.addClass(e.NS+"-maximize"),t.css({width:"100%",height:"100%",left:0,top:0}),this.isOpened=!0,this.isMaximized=!0):t.css({width:a,height:n,left:(i-a)/2+o+"px",top:(s-n)/2+h+"px"})}setModalSize(t){const i=e.$W.width(),s=e.$W.height(),o=e.$D.scrollLeft(),h=e.$D.scrollTop(),a={left:this.$stage.css("left"),right:this.$stage.css("right"),top:this.$stage.css("top"),bottom:this.$stage.css("bottom"),borderLeft:this.$stage.css("border-left-width"),borderRight:this.$stage.css("border-right-width"),borderTop:this.$stage.css("border-top-width"),borderBottom:this.$stage.css("border-bottom-width")},n=t.width+parseFloat(a.left)+parseFloat(a.right)+parseFloat(a.borderLeft)+parseFloat(a.borderRight),r=t.height+parseFloat(a.top)+parseFloat(a.bottom)+parseFloat(a.borderTop)+parseFloat(a.borderBottom),d=(this.options.gapThreshold>0?this.options.gapThreshold:0)+1,l=Math.min(i/(n*d),s/(r*d),1);let g=Math.max(n*l,this.options.modalWidth),m=Math.max(r*l,this.options.modalHeight);const p={width:(g=this.options.fixedModalSize?this.options.modalWidth:Math.round(g))+"px",height:(m=this.options.fixedModalSize?this.options.modalHeight:Math.round(m))+"px",left:(i-g)/2+o+"px",top:(s-m)/2+h+"px"};this.options.initAnimation?this.$photoviewer.animate(p,400,"ease-in-out",()=>{this.setImageSize(t)}):(this.$photoviewer.css(p),this.setImageSize(t)),this.isOpened=!0}getImageScaleToStage(t,i){let e=1;return e=this.isRotated?Math.min(t/this.img.height,i/this.img.width,1):Math.min(t/this.img.width,i/this.img.height,1)}setImageSize(i){const o={w:this.$stage.width(),h:this.$stage.height()},h=this.getImageScaleToStage(o.w,o.h);this.$image.css({width:Math.ceil(i.width*h)+"px",height:Math.ceil(i.height*h)+"px",left:(o.w-Math.ceil(i.width*h))/2+"px",top:(o.h-Math.ceil(i.height*h))/2+"px"}),t.extend(this.imageData,{initWidth:i.width*h,initHeight:i.height*h,initLeft:(o.w-i.width*h)/2,initTop:(o.h-i.height*h)/2,width:i.width*h,height:i.height*h,left:(o.w-i.width*h)/2,top:(o.h-i.height*h)/2}),s.setGrabCursor({w:this.$image.width(),h:this.$image.height()},{w:this.$stage.width(),h:this.$stage.height()},this.$stage,this.isRotated),this.imageLoaded||(this.$photoviewer.find(e.CLASS_NS+"-loader").remove(),this.$stage.removeClass("stage-ready"),this.$image.removeClass("image-ready"),this.options.initAnimation&&!this.options.progressiveLoading&&this.$image.fadeIn(),this.imageLoaded=!0)}loadImage(t,i,o){this.$image.removeAttr("style").attr("src",""),this.isRotated=!1,this.rotateAngle=0,this.imageLoaded=!1,this.$photoviewer.append(`<div class="${e.NS}-loader"></div>`),this.$stage.addClass("stage-ready"),this.$image.addClass("image-ready"),this.options.initAnimation&&!this.options.progressiveLoading&&this.$image.hide(),this.$image.attr("src",t),s.preloadImage(t,t=>{this.img=t,this.imageData={originalWidth:t.width,originalHeight:t.height},this.isMaximized||this.isOpened&&this.options.fixedModalPos?this.setImageSize(t):this.setModalSize(t),i&&i.call()},()=>{this.$photoviewer.find(e.CLASS_NS+"-loader").remove(),o&&o.call()}),this.options.title&&this.setImageTitle(t)}setImageTitle(t){const i=this.groupData[this.groupIndex].title||s.getImageNameFromUrl(t);this.$title.html(i)}jump(t){this._triggerHook("beforeChange",[this,this.groupIndex]),this.groupIndex=this.groupIndex+t,this.jumpTo(this.groupIndex)}jumpTo(t){(t%=this.groupData.length)>=0?t%=this.groupData.length:t<0&&(t=(this.groupData.length+t)%this.groupData.length),this.groupIndex=t,this.loadImage(this.groupData[t].src,()=>{this._triggerHook("changed",[this,t])},()=>{this._triggerHook("changed",[this,t])})}wheel(t){t.preventDefault();let i=1;t.deltaY?i=t.deltaY>0?1:-1:t.wheelDelta?i=-t.wheelDelta/120:t.detail&&(i=t.detail>0?1:-1);const s=-i*this.options.ratioThreshold,o={x:t.clientX-this.$stage.offset().left+e.$D.scrollLeft(),y:t.clientY-this.$stage.offset().top+e.$D.scrollTop()};this.zoom(s,o,t)}zoom(t,i,e){t=t<0?1/(1-t):1+t,(t=this.$image.width()/this.imageData.originalWidth*t)>this.options.maxRatio||t<this.options.minRatio||this.zoomTo(t,i,e)}zoomTo(i,e,o){const h=this.$image,a=this.$stage,n=this.imageData.width,r=this.imageData.height,d=this.imageData.left,l=this.imageData.top,g={w:a.width(),h:a.height(),x:a.offset().left,y:a.offset().top},m=this.imageData.originalWidth*i,p=this.imageData.originalHeight*i;let $=e.x-(e.x-d)/n*m,S=e.y-(e.y-l)/r*p;const c=this.isRotated?(m-p)/2:0,f=this.isRotated?p:m,E=this.isRotated?m:p,N=g.w-m,u=g.h-p;S=E<=g.h?(g.h-p)/2:S>c?c:S>u-c?S:u-c,$=f<=g.w?(g.w-m)/2:$>-c?-c:$>N+c?$:N+c,Math.abs(this.imageData.initWidth-m)<.05*this.imageData.initWidth?this.setImageSize(this.img):(h.css({width:Math.round(m)+"px",height:Math.round(p)+"px",left:Math.round($)+"px",top:Math.round(S)+"px"}),s.setGrabCursor({w:Math.round(f),h:Math.round(E)},{w:g.w,h:g.h},this.$stage)),t.extend(this.imageData,{width:m,height:p,left:$,top:S})}rotate(t){this.rotateAngle=this.rotateAngle+t,this.rotateAngle/90%2==0?this.isRotated=!1:this.isRotated=!0,this.rotateTo(this.rotateAngle)}rotateTo(t){this.$image.css({transform:"rotate("+t+"deg)"}),this.setImageSize({width:this.imageData.originalWidth,height:this.imageData.originalHeight}),this.$stage.removeClass("is-grab")}resize(){return s.throttle(()=>{this.isOpened&&(this.isMaximized?this.setImageSize({width:this.imageData.originalWidth,height:this.imageData.originalHeight}):this.setModalSize({width:this.imageData.originalWidth,height:this.imageData.originalHeight}))},500)}maximize(){if(this.$photoviewer.get(0).focus(),this.isMaximized){this.$photoviewer.removeClass(e.NS+"-maximize");const t=(e.$W.width()-this.options.modalWidth)/2+e.$D.scrollLeft(),i=(e.$W.height()-this.options.modalHeight)/2+e.$D.scrollTop();this.$photoviewer.css({width:this.modalData.width?this.modalData.width:this.options.modalWidth,height:this.modalData.height?this.modalData.height:this.options.modalHeight,left:this.modalData.left?this.modalData.left:t,top:this.modalData.top?this.modalData.top:i}),this.isMaximized=!1}else this.modalData={width:this.$photoviewer.width(),height:this.$photoviewer.height(),left:this.$photoviewer.offset().left,top:this.$photoviewer.offset().top},this.$photoviewer.addClass(e.NS+"-maximize"),this.$photoviewer.css({width:"100%",height:"100%",left:0,top:0}),this.isMaximized=!0;this.setImageSize({width:this.imageData.originalWidth,height:this.imageData.originalHeight})}fullscreen(){this.$photoviewer.get(0).focus(),s.requestFullscreen(this.$photoviewer[0])}_keydown(t){if(!this.options.keyboard)return!1;const i=t.keyCode||t.which||t.charCode,e=t.ctrlKey||t.metaKey,s=t.altKey||t.metaKey;switch(i){case 37:this.jump(-1);break;case 39:this.jump(1);break;case 187:this.zoom(3*this.options.ratioThreshold,{x:this.$stage.width()/2,y:this.$stage.height()/2},t);break;case 189:this.zoom(3*-this.options.ratioThreshold,{x:this.$stage.width()/2,y:this.$stage.height()/2},t);break;case 61:this.zoom(3*this.options.ratioThreshold,{x:this.$stage.width()/2,y:this.$stage.height()/2},t);break;case 173:this.zoom(3*-this.options.ratioThreshold,{x:this.$stage.width()/2,y:this.$stage.height()/2},t);break;case 48:e&&s&&this.zoomTo(1,{x:this.$stage.width()/2,y:this.$stage.height()/2},t);break;case 188:e&&this.rotate(-90);break;case 190:e&&this.rotate(90);break;case 81:this.close()}}_addEvents(){this.$close.off(e.CLICK_EVENT+e.EVENT_NS).on(e.CLICK_EVENT+e.EVENT_NS,t=>{this.close()}),this.$stage.off(e.WHEEL_EVENT+e.EVENT_NS).on(e.WHEEL_EVENT+e.EVENT_NS,t=>{this.wheel(t)}),this.$zoomIn.off(e.CLICK_EVENT+e.EVENT_NS).on(e.CLICK_EVENT+e.EVENT_NS,t=>{this.zoom(3*this.options.ratioThreshold,{x:this.$stage.width()/2,y:this.$stage.height()/2},t)}),this.$zoomOut.off(e.CLICK_EVENT+e.EVENT_NS).on(e.CLICK_EVENT+e.EVENT_NS,t=>{this.zoom(3*-this.options.ratioThreshold,{x:this.$stage.width()/2,y:this.$stage.height()/2},t)}),this.$actualSize.off(e.CLICK_EVENT+e.EVENT_NS).on(e.CLICK_EVENT+e.EVENT_NS,t=>{this.zoomTo(1,{x:this.$stage.width()/2,y:this.$stage.height()/2},t)}),this.$prev.off(e.CLICK_EVENT+e.EVENT_NS).on(e.CLICK_EVENT+e.EVENT_NS,()=>{this.jump(-1)}),this.$fullscreen.off(e.CLICK_EVENT+e.EVENT_NS).on(e.CLICK_EVENT+e.EVENT_NS,()=>{this.fullscreen()}),this.$next.off(e.CLICK_EVENT+e.EVENT_NS).on(e.CLICK_EVENT+e.EVENT_NS,()=>{this.jump(1)}),this.$rotateLeft.off(e.CLICK_EVENT+e.EVENT_NS).on(e.CLICK_EVENT+e.EVENT_NS,()=>{this.rotate(-90)}),this.$rotateRight.off(e.CLICK_EVENT+e.EVENT_NS).on(e.CLICK_EVENT+e.EVENT_NS,()=>{this.rotate(90)}),this.$maximize.off(e.CLICK_EVENT+e.EVENT_NS).on(e.CLICK_EVENT+e.EVENT_NS,()=>{this.maximize()}),this.$photoviewer.off(e.KEYDOWN_EVENT+e.EVENT_NS).on(e.KEYDOWN_EVENT+e.EVENT_NS,t=>{this._keydown(t)}),e.$W.on(e.RESIZE_EVENT+e.EVENT_NS,this.resize())}_addCustomButtonEvents(){for(const t in this.options.customButtons)this.$photoviewer.find(e.CLASS_NS+"-button-"+t).off(e.CLICK_EVENT+e.EVENT_NS).on(e.CLICK_EVENT+e.EVENT_NS,i=>{this.options.customButtons[t].click.apply(this,[this,i])})}_triggerHook(i,e){this.options.callbacks[i]&&this.options.callbacks[i].apply(this,t.isArray(e)?e:[e])}}return t.extend(n.prototype,o,h,a),window.PhotoViewer=n,n});
//# sourceMappingURL=sourcemaps/core.js.map
