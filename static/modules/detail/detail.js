/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../lib/zepto.js
 * @require ../../lib/fastclick.js
 * @require ../../lib/swiper/swiper-3.3.1.min.css
 */

$(function() {
	//轮播图
	var mySwiper = new Swiper('.swiper-container',{
		loop: true,
		lazyLoading : true,
		pagination: '.swiper-pagination',
	})
	//fastclick初始化
	FastClick.attach(document.body);

	$('.goods-detail-switch').on('click', function(event) {
		if($.trim($(event.target).html()) == '玩乐指导') {
			$('.goods-guide-cont').show();
			$('.goods-guide-btn').addClass('active');
			$('.good-parameter-cont').hide();
			$('.goods-parameter').removeClass('active');
		}else if($.trim($(event.target).html()) == '商品参数') {
			$('.goods-guide-cont').hide();
			$('.goods-guide-btn').removeClass('active');
			$('.good-parameter-cont').show();
			$('.goods-parameter').addClass('active');

		}
	});
});

