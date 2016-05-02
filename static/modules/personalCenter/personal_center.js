/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../lib/zepto.js
 * @require ../../lib/fastclick.js
 * @require ../../lib/jweixin-1.0.0.js
 */

$(function() {
	FastClick.attach(document.body);
	var wxShare = require('../config/wxShareConfig.js');
	//全局加载loading
	var $globalLoading = require('../ui/globalLoading/loading.js');
	var $prompt = require('../ui/prompt/prompt.js');
	$globalLoading.close();
	var $orderIcon = $('.order-icon');
	//获取分享参数
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
	//ajax请求数据
	$.ajax({
		type: 'GET',
		url: '/wxApi/userInfo',
		contentType: 'application/json',
		success: function(data){
			if(data.msg) {
				$prompt.init(data.msg);
			}
			if(data.code == 200) {
				$('.head-bg').attr('src', data.data.avatar);
				$('.head-portrait img').attr('src', data.data.avatar);
				$('.person-name').html(data.data.aliasName);
				$('.person-phone').html(data.data.phone);
				$('.center-my-balance p:first-child').html(data.data.balance/100);
				$('.center-my-deposit p:first-child').html(data.data.deposit/100);
				$orderIcon.each(function(index) {
					console.log(data.data.orderCntInfo['s'+(index+1)]);
					if(data.data.orderCntInfo['s'+(index+1)]) {
						$(this).find('i').show();
						$(this).find('i').html(data.data.orderCntInfo['s'+(index+1)]);
					}else {
						$(this).find('i').hide();
					}
				});

			}else if(data.code == 234){
				location.href = data.directUrl;
			}
		},
		error: function(xhr, type){
			alert('Ajax error!')
		}
	});
});


