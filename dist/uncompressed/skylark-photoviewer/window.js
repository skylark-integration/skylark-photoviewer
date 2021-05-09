define([
    "skylark-domx-eventer",
    "skylark-domx-plugins-base",
    'skylark-jquery',
    "skylark-domx-plugins-interact/movable",
    "skylark-domx-plugins-interact/resizable",
    './constants',
    './utilities'

], function (eventer,plugins,$,  Movable, Resizable, Constants, Utilities,) {
    'use strict';

    var Window = plugins.Plugin.inherit({
        klassName : "Window",

        pluginName : "lark.domx.window",

        options : {
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

            fixedContent: true,
            initMaximized: false,




            movable : {
                dragHandle: false
            },
            resizable : {
                minWidth: 320,
                minHeight: 320,
            }
        },

        _construct : function(elm,options) {
            plugins.Plugin.prototype._construct.call(this,elm,options);
            this.isOpened = false;
            this.isMaximized = false;

            this.$photoviewer = $(this._elm);

            this._velm = this.elmx();

            if (this.options.movable) {
                this._movable = new Movable(elm,{
                    handle : this.options.movable.dragHandle,
                    starting : (e) => {
                        const   dragCancel = Constants.CLASS_NS + '-button', 
                                elemCancel = $(e.target).closest(dragCancel);
                        if (elemCancel.length) {
                            return false;
                        }
                        if (Constants.PUBLIC_VARS['isResizing'] || this.isMaximized) {
                            return false;
                        }

                        return true;
                    }
                });

            }

            if (this.options.resizable) {

                this._resizable = new Resizable(elm,{
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
                        minWidth : this.options.resizable.minWidth,
                        minHeight : this.options.resizable.minHeight
                    },
                    started : function(){
                        Constants.PUBLIC_VARS['isResizing'] = true;
                    },
                    moving : function(e) {
                        /*
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
                        */
                    },
                    stopped :function () {
                        Constants.PUBLIC_VARS['isResizing'] = false;
                    }
                });

            }

            this.$close = this._velm.$(this.options.selectors.buttons.close);
            this.$maximize = this._velm.$(this.options.selectors.buttons.maximize);
            this.$minimize = this._velm.$(this.options.selectors.buttons.minimize);
            this.$fullscreen = this._velm.$(this.options.selectors.buttons.fullscreen);


            this.$close.off(Constants.CLICK_EVENT + Constants.EVENT_NS).on(Constants.CLICK_EVENT + Constants.EVENT_NS, e => {
                this.close();
            });
            this.$fullscreen.off(Constants.CLICK_EVENT + Constants.EVENT_NS).on(Constants.CLICK_EVENT + Constants.EVENT_NS, () => {
                this.fullscreen();
            });
            this.$maximize.off(Constants.CLICK_EVENT + Constants.EVENT_NS).on(Constants.CLICK_EVENT + Constants.EVENT_NS, () => {
                this.maximize();
            });
            this.$photoviewer.off(Constants.KEYDOWN_EVENT + Constants.EVENT_NS).on(Constants.KEYDOWN_EVENT + Constants.EVENT_NS, e => {
                this._keydown(e);
            });
            Constants.$W.on(Constants.RESIZE_EVENT + Constants.EVENT_NS, ()=>{
                            eventer.resized(this._elm);
                        });
        },
        close: function() {
            this.trigger('closing', this);
            this.$photoviewer.remove();
            this.isOpened = false;
            this.isMaximized = false;

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
            this.trigger('closed', this);
        },

        maximize: function() {
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

            eventer.resized(this._elm);
        },
        fullscreen: function() {
            this.$photoviewer.get(0).focus();
            Utilities.requestFullscreen(this.$photoviewer[0]);
        },
        _keydown: function(e) {
            if (!this.options.keyboard) {
                return false;
            }
            const keyCode = e.keyCode || e.which || e.charCode;
            const ctrlKey = e.ctrlKey || e.metaKey;
            const altKey = e.altKey || e.metaKey;
            switch (keyCode) {

                // Q
                case 81:
                    this.close();
                    break;
                default:
            }
        }

    });


    return Window;
});