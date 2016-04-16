/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../lib/zepto.js
 * @require ../../lib/fastclick.js
 */

$(function() {
	//全局加载loading
	var $globalLoading = require('../ui/globalLoading/loading.js');
	$globalLoading.close();
	//ajax请求数据
	$.ajax({
		type: 'GET',
		url: '/wxApi/userInfo',
		contentType: 'application/json',
		success: function(data){
			if(data.code == 200) {
				$('.head-bg').attr('src', data.data.avatar);
				$('.head-portrait img').attr('src', data.data.avatar);
				$('.person-name').html(data.data.aliasName);
				$('.person-phone').html(data.data.phone);
				$('.center-my-balance p:first-child').html(data.data.balance);
				$('.center-my-deposit p:first-child').html(data.data.deposit);
			}else {
				alert("获取数据失败！");
			}
		},
		error: function(xhr, type){
			alert('Ajax error!')
		}
	});
});


