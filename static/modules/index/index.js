/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../lib/zepto.js
 * @require ../../lib/fastclick.js
 * @require ../../lib/swiper/swiper-3.3.1.min.css
 * @require ../ui/loading/loading.less
 */

$(function() {
	//轮播图
	var mySwiper = new Swiper('.swiper-container',{
		loop: true,
		lazyLoading : true,
		pagination: '.swiper-pagination',
	})
	var $loading = require('../ui/loading/loading.js');
	// $loading.init().open();
	var $globalLoading = require('../ui/globalLoading/loading.js');
	$globalLoading.close();



});


