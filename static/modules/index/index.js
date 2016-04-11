/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../lib/zepto.js
 * @require ../../lib/fastclick.js
 * @require ../../lib/baiduTemplate.js
 * @require ../../lib/swiper/swiper-3.3.1.min.css
 * @require ../ui/loading/loading.less
 */

$(function() {
	var $loading = require('../ui/loading/loading.js');
	// $loading.init().open();
	var $globalLoading = require('../ui/globalLoading/loading.js');
	var $tip = require('../ui/tip/tip.js');
	var bt=baidu.template;
	var flag = false;

	//ajax请求数据
	$.ajax({
		type: 'POST',
		url: '/wxApi/home',
		contentType: 'application/json',
		success: function(data){
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
			}else {
				$tip.init().open();
				setTimeout(function() {
					$tip.close();
				}, 3000);
			}

		},
		error: function(xhr, type){
			$globalLoading.close();
			alert('Ajax error!')
		}
	})
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
});


