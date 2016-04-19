/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../lib/zepto.js
 * @require ../../lib/fastclick.js
 */

$(function() {
	var $globalLoading = require('../ui/globalLoading/loading.js');
	$globalLoading.close();
	var $orderNum =  localStorage.getItem('orderNum')?localStorage.getItem('orderNum'):'';
	var $orderId = localStorage.getItem('orderId')?localStorage.getItem('orderId'):'';
	$('.orderNum').html($orderNum);
	$('.pay-success-detail a').on('click', function() {
		location.href = 'detail_order.html#'+$orderId;
	});
});