/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../common/css/common_list.less
 * @require ../../lib/zepto.js
 * @require ../../lib/baiduTemplate.js
 * @require ../../lib/fastclick.js
 * @require ../../lib/alert/zepto.alert.js
 */
$(function() {
	FastClick.attach(document.body);
	//全局加载loading
	var $globalLoading = require('../ui/globalLoading/loading.js');
	$globalLoading.close();
	var $prompt = require('../ui/prompt/prompt.js');
	var bt=baidu.template;
	var flag = false;
	//ajax请求默认信息
	$.ajax({
		type: 'GET',
		url: '/wxApi/order/detail/'+getQueryStringArgs(),
		dataType: 'json',
		success: function(data){
			handingData(data);	

		},
		error: function(xhr, type){
			alert('Ajax error!')
		}
	})

	function handingData(data) {
		if(data.msg) {
			$prompt.init(data.msg);
		}
		if(data.code == 234 ) {
			location.href = data.directUrl;
		}
		data.data.deliveryDay = userDate(data.data.deliveryDay);
		data.data.rentBackDay = userDate(data.data.rentBackDay);
		var listData = {
			initData: data.data
		}
		$('.wrap-init-tpl').eq(0).html(bt('init-tpl', listData));
		if(data.data.state == 's1') {
			$('.state1').show();
		}else {
			$('.state2').show();
		}
		$('.cancel-btn').on('click', function(e) {
			e.stopPropagation();
			$.dialog({
				content : '是否确认删除？',
				title: null,
		        ok : function() {
					$.ajax({
						type: 'GET',
						url: '/wxApi/order/cancel/'+encodeURI(getQueryStringArgs()),
						dataType: 'json',
						success: function(data){
							if(data.code != 200) {
								$prompt.init(data.msg);
							}else {
								location.reload();
							}
						},
						error: function(xhr, type){
							alert('Ajax error!')
						}
					})
		            return true;
		        },
		        cancel : function() {
		            return true;
		        },
		        lock : true
			});
		});
	}
	//将时间戳转为日期格式
	function userDate(uData){
	  var myDate = new Date(uData);
	  var year = myDate.getFullYear();
	  var month = (myDate.getMonth() + 1) > 9 ? (myDate.getMonth() + 1) : ('0'+(myDate.getMonth() + 1)) ;
	  var day = myDate.getDate()>9 ? myDate.getDate() : ('0'+myDate.getDate());
	  return year + '-' + month + '-' + day;
	}
	//获取cartId
	function getQueryStringArgs() {
		var qs = (location.hash.length > 0 ? location.hash.substring(1) : "");
		return decodeURI(qs);
	}
});