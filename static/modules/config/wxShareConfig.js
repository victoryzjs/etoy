module.exports.init=function (APPCONF) {
    if (APPCONF && typeof(APPCONF) == 'object') {
        var appId = APPCONF.appid || '';
        var timestamp = APPCONF.timestamp || (new Date()) / 1000;
        var nonceStr = APPCONF.nonceStr || '';
        var signature = APPCONF.signature.signature || '';
        var title = APPCONF.shareTitle || '易玩具';
        var link = APPCONF.url || window.location.href;
        var imgUrl = APPCONF.shareImgUrl || 'http://www.e-toy.cn/images/share_wx.png';
        var desc = APPCONF.shareDesc || 'kiss baby 玩具租赁  — 描述”';
        var success = (APPCONF.shareSuccess && typeof(APPCONF.shareSuccess) == 'function') ? APPCONF.shareSuccess : function() {};
        var cancel = (APPCONF.shareCancel && typeof(APPCONF.shareCancel) == 'function') ? APPCONF.shareCancel : function() {};

        // 主动显示右上角三个点
        try {
            WeixinJSBridge.call('showOptionMenu');
        } catch (e) {
            //
        }

        wx.config({
            debug: true,
            appId: appId,
            timestamp: timestamp,
            nonceStr: nonceStr,
            signature: signature,
            jsApiList: ['showOptionMenu', 'onMenuShareTimeline', 'onMenuShareAppMessage']
        });

        wx.ready(function() {
            wx.showOptionMenu(); // 主动显示右上角三个点

            wx.onMenuShareTimeline({
                title: desc,
                link: link,
                imgUrl: imgUrl,
                success: function() {
                    
                },
                cancel: function() {
                    
                }
            });

            wx.onMenuShareAppMessage({
                title: title,
                desc: desc,
                link: link,
                imgUrl: imgUrl,
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function() {
                    
                },
                cancel: function() {
                    
                }
            });
        });

        wx.error(function(res) {
            console.log('微信分享config信息验证失败');
        });
    } else {
        console.log('请正确添加微信分享所需要的配置');
    }
}