/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../lib/zepto.js
 * @require ../../lib/baiduTemplate.js
 * @require ../ui/loading/loading.less
 * @require ../../lib/fastclick.js
 * @require ../../lib/swiper/swiper-3.3.1.min.css
 */

$(function() {
	//进去页面加载loading
	var $globalLoading = require('../ui/globalLoading/loading.js');
	var $loading = require('../ui/loading/loading.js');
	var prompt = require('../ui/prompt/prompt.js');
	var bt=baidu.template;
	var flag = false;
	var mySwiper = new Swiper('.swiper-container',{
		loop: true,
		lazyLoading : true,
		pagination: '.swiper-pagination'
	});
	var search = getQueryStringArgs();
	$loading.init()
	//ajax请求数据
	$.ajax({
		type: 'GET',
		url: '/good/' + search.id,
		contentType: 'application/json',
		success: function(data){
			console.log(data.data);
			flag = true;
			$globalLoading.close();
			if(data.code == 200) {
				var goodsData = {
					detailInfo: data.data
				};
				var bannerData = {
					banner : (data.data.goodPic ? data.data.goodPic : [data.data.thumb])
				}

				$('.goods-detail-desc').eq(0).html(bt('detail-tpl', goodsData));
				$('.goods-detail-switch-cont').eq(0).html(bt('good-parameter-cont-tpl', goodsData));

				$('#wrap-banner').html(bt('banner-tpl', bannerData));		
			}else if(data.code==234 ) {
				location.href = data.directUrl;
			}

		},
		error: function(xhr, type){
			$globalLoading.close();
			alert('Ajax error!')
		}
	});
	//加入购物车
	$('.add-cart').eq(0).on('click', function() {
		$loading.open();
		$.ajax({
			type: 'POST',
			url: '/wxApi/shoppingCart/add/' + search.id,
			contentType: 'application/json',
			success: function(data){
				$loading.close();
				prompt.init('添加该商品成功！');
			},
			error: function(xhr, type){
				$globalLoading.close();
				alert('Ajax error!')
			}
		});
	});

	//轮播图
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
	//获取查询字符串参数
	function getQueryStringArgs() {
		var qs = (location.search.length > 0 ? location.search.substring(1) : ""),
		args = {},
		items = qs.length ? qs.split("&") : [],
		item = null,
		name = null,
		value = null,
		i = 0,
		len = items.length;
		for(i = 0; i < len; i++) {
			item = items[i].split("=");
			name = decodeURIComponent(item[0]);
			value = decodeURIComponent(item[1]);
			if(name.length) {
				args[name] = value;
			}
		}
		return args;
	}
});

