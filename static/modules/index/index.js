/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../lib/zepto.js
 * @require ../../lib/fastclick.js
 * @require ../../lib/baiduTemplate.js
 * @require ../../lib/swiper/swiper-3.3.1.min.css
 * @require ../ui/loading/loading.less
 * @require ../../lib/jweixin-1.0.0.js
 */

$(function() {
	FastClick.attach(document.body);
	var wxShare = require('../config/wxShareConfig.js');
	var $loading = require('../ui/loading/loading.js');
	// $loading.init().open();
	var $globalLoading = require('../ui/globalLoading/loading.js');
	var $tip = require('../ui/tip/tip.js');
	var $prompt = require('../ui/prompt/prompt.js');
	var bt=baidu.template;
	var flag = false;

	//ajax请求数据
	$.ajax({
		type: 'GET',
		url: '/wxApi/home',
		contentType: 'application/json',
		success: function(data){
			if(data.msg) {
				$prompt.init(data.msg);
			}
			flag = true;
			$globalLoading.close();
			if(data.code == 200) {
				var bannerData = {
					banner: data.data.banners
				};
				var hotGoodData = {
					hotGood: data.data.hotGood
				};
				var latestGoodData = {
					latestGood: data.data.hotGood
				};

				$('#wrap-banner').html(bt('banner-tpl', bannerData));
				$('#wrap-goods-new').html(bt('new-tpl', latestGoodData));
				$('#wrap-hot-goods').html(bt('hot-tpl', hotGoodData));			
			}else if(data.code==234 ) {
				location.href = data.directUrl;
			}

		},
		error: function(xhr, type){
			$globalLoading.close();
			alert('Ajax error!')
		}
	});
	var swiperTimer = setInterval(function() {
		if(flag) {
			clearInterval(swiperTimer);
			var mySwiper = new Swiper('.swiper-container',{
				loop: true,
				lazyLoading : true,
				pagination: '.swiper-pagination',
			})
		}

	}, 100);

	$.ajax({
		type: 'GET',
		url: '/weChat/jsApiTicket?url='+location.href,
		contentType: 'application/json',
		success: function(data){
			wxShare.init(data.data);
		},
		error: function(xhr, type){
			alert('Ajax error!')
		}
	});
	
});


