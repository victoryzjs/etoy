/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../common/css/common_list.less
 * @require ../../lib/zepto.js
 * @require ../../lib/baiduTemplate.js
 * @require ../../lib/fastclick.js
 * @require ../../lib/mdater/zepto.mdater.js
 */
$(function() {
	//全局加载loading
	var $globalLoading = require('../ui/globalLoading/loading.js');
	$globalLoading.close();
	var prompt = require('../ui/prompt/prompt.js');
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
		if(data.code != 200){
			alert("没接收到数据！");
		}
		var listData = {
			initData: data.data
		}
		
		$('.wrap-init-tpl').eq(0).html(bt('init-tpl', listData));
		countMoney(data);

	}
	//计算金额
	function countMoney(data) {
		var count = 0;
		var allCount = 0;
		for(var i=0,len=data.data.goods.length; i<len; i++) {
			count +=data.data.goods[i].good.rentPrice;
			allCount += data.data.goods[i].good.rentPrice;
		}
		if(count < 150) {
			$('.freight-span span').html(20);
			allCount +=20;
		}
		$('.rent-price span').html(count);
		$('.allCount span').html(allCount+1000);

	}
	//将时间戳转为日期格式
	function userDate(uData){
	  var myDate = new Date(uData*1000);
	  var year = myDate.getFullYear();
	  var month = myDate.getMonth() + 1;
	  var day = myDate.getDate();
	  return year + '-' + month + '-' + day;
	}
	//获取cartId
	function getQueryStringArgs() {
		var qs = (location.hash.length > 0 ? location.hash.substring(1) : "");
		return decodeURI(qs);
	}
});