/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../lib/zepto.js
 * @require ../../lib/baiduTemplate.js
 * @require ../ui/loading/loading.less
 * @require ../../lib/fastclick.js
 * @require ../../lib/swiper/swiper-3.3.1.min.css
 * @require ../../lib/jweixin-1.0.0.js
 */

$(function() {
	FastClick.attach(document.body);
	//进去页面加载loading
	var $globalLoading = require('../ui/globalLoading/loading.js');
	var $loading = require('../ui/loading/loading.js');
	var $prompt = require('../ui/prompt/prompt.js');
	var wxShare = require('../config/wxShareConfig.js');
	var title = '';
	var bt=baidu.template;
	var flag = false;
	var mySwiper = new Swiper('.swiper-container',{
		loop: true,
		lazyLoading : true,
		pagination: '.swiper-pagination'
	});
	var search = getQueryStringArgs();
	var isGoods = true;
	var rentWeek = 1;
	var ageFlag = false;
	var brnadFlag = false;
	var funcFlag = false;

	$loading.init()

	//声明变量存储筛选条件
	var condition = {
		'age': {},
		'brand': {},
		'func': {}
	};

	//获取筛选条件
	function getCondition(con) {
		$.ajax({
			type: 'GET',
			url: '/datadict/list/' + con,
			contentType: 'application/json',
			success: function(data){
				if(data.code == 200) {
					if(data.data[0].dictType == '功能') {
						ageFlag = true;
						data.data.forEach(function(e) {
							condition.func[e.code] = e.dictVal;
						});
					}else if(data.data[0].dictType == '品牌') {
						brnadFlag = true;
						data.data.forEach(function(e) {
							condition.brand[e.code] = e.dictVal;
						});
							
					}else if(data.data[0].dictType == '年龄段') {
						funcFlag = true;
						data.data.forEach(function(e) {
							condition.age[e.code] = e.dictVal;
						});
							
					}
				}
			},
			error: function(xhr, type){
				alert('Ajax error!')
			}
		});		
	}
	getCondition('功能');
	getCondition('年龄段');
	getCondition('品牌');
	//设定定时器，当条件成立时发动请求
	var timeFlag = setInterval(function() {
		if(ageFlag && brnadFlag && funcFlag) {
				clearInterval(timeFlag);
			//ajax请求数据
			$.ajax({
				type: 'GET',
				url: '/good/' + search.id,
				contentType: 'application/json',
				success: function(data){
					if(data.msg) {
						$prompt.init(data.msg);
					}
					flag = true;
					$globalLoading.close();
					if(data.code == 200) {

						title = data.data.title;
						for(var attr in condition) {
							if(attr == 'age') {
								for(var val in condition['age']) {
									if(val == data.data.suitableAge) {
										data.data.suitableAge = condition['age'][val]
									}
								}
							}else if(attr == 'brand') {
								for(var val in condition['brand']) {
									if(val == data.data.brand) {
										data.data.brand = condition['brand'][val]
									}
								}
							}else if(attr == 'func') {
								for(var val in condition['func']) {

								}
							}
						}
						// data.data.suitableAge = condition.age.





						if(data.data.leftNum == 0) {
							isGoods = false;
						}
						var goodsData = {
							detailInfo: data.data
						};
						var bannerData = {
							banner : (data.data.goodPic ? data.data.goodPic : [data.data.thumb])
						}

						$('.goods-detail-desc').eq(0).html(bt('detail-tpl', goodsData));
						$('.goods-detail-switch-cont').eq(0).html(bt('good-parameter-cont-tpl', goodsData));

						$('#wrap-banner').html(bt('banner-tpl', bannerData));
						$('.goods-guide-cont').html(data.data.content);

						//选择周数
						var $priceListLi = $('.price-list li');
						$priceListLi.on('click', function() {
							$priceListLi.find('span').removeClass('active');
							$(this).find('span').addClass('active');
							rentWeek = $(this).attr('data-week');
							console.log($(this).attr('data-week'));
						});
					}else if(data.code==234 ) {
						location.href = data.directUrl;
					}

				},
				error: function(xhr, type){
					$globalLoading.close();
					alert('Ajax error!')
				}
			});			
		}
	}, 50);
	//加入购物车
	$('.add-cart').eq(0).on('click', function() {
		if(isGoods) {
			$loading.open();
			$.ajax({
				type: 'POST',
				url: '/wxApi/shoppingCart/add/' + search.id + '?rentWeek=' + rentWeek,
				contentType: 'application/json',
				success: function(data){
					$loading.close();
					if(data.msg) {
						$prompt.init(data.msg);
					}
					if(data.code == 200) {
						$prompt.init('添加该商品成功！');
					}			
				},
				error: function(xhr, type){
					$globalLoading.close();
					alert('Ajax error!')
				}
			});
		}else if(!isGoods) {
			$prompt.init('该商品无货！');
			return false;
		}
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

	//获取分享参数
	$.ajax({
		type: 'GET',
		url: '/weChat/jsApiTicket?url=' + location.href,
		contentType: 'application/json',
		success: function(data){
			data.data.shareTitle = title;
			wxShare.init(data.data);
		},
		error: function(xhr, type){
			alert('Ajax error!')
		}
	});
});

