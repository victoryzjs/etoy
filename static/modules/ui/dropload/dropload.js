/**
 * 下拉加载组件
 * @class DropLoad
 */
var Base=require('../Base/Base.js');

var $window = $(window);
var DropLoad = Base.extend({
    init : function(loadDownFn){
        this.loadDownFn = loadDownFn || function(){};
        this.$loadTip = $('<div class="dropLoad-Tip"></div>');
        this.contents = {
            loadMore:'上拉加载更多',
            loading:'<span class="loading"></span>努力加载中...'
        };
        this.delayTime = null;
        this.$loadTip.appendTo('body');
        this.scrollHandlerProxy = this.proxy(this.scrollHandler);
    },
    scrollHandler: function(){
        clearTimeout(this.delayTime);
        this.delayTime = setTimeout(this.proxy(function(){
            var scrollTop = $window.scrollTop();
            var scrollBtm = scrollTop + $window.height();
            var loadTop = this.$loadTip.offset().top;
            if(loadTop <= scrollBtm){
                this.$loadTip.html(this.contents.loading);
                $window.off('scroll',this.scrollHandlerProxy);
                this.loadDownFn();
            }
        }),300);
    },
    //停止
    stop:function(){
        $window.off('scroll',this.scrollHandlerProxy);
        this.$loadTip.hide();
    },
    
    //启动监听
    start:function(){
        this.$loadTip.show();
        this.$loadTip.html(this.contents.loadMore);
        $window.scroll(this.scrollHandlerProxy);
    }
});

module.exports = DropLoad;