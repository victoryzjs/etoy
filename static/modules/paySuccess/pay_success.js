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
	var $globalLoading = require('../ui/globalLoading/loading.js');
	$globalLoading.close();
	var $orderNum =  localStorage.getItem('orderNum')?localStorage.getItem('orderNum'):'';
	var $orderId = localStorage.getItem('orderId')?localStorage.getItem('orderId'):'';
	$('.orderNum').html($orderNum);
	$('.pay-success-detail a').on('click', function() {
		location.href = 'detail_order.html#'+$orderId;
	});
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
});