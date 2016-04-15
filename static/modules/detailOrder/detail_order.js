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
	//测试数据
	var testData = {
		"code": 200,
		"data": {
			"goods": [
					{
						"good": {
							"title": "f",
							"rentPrice": 32,
							"leftNum": 2,
							"id": "570a639a2a3178482c5251a9",
							"thumb": "/img/570a63942a3178482c5251a8"
						},
						"createdAt": "2016-04-10T14:56:51.563Z",
						"id": "570a69b3c31d56004d08dfd9"
					},
					{
						"good": {
							"title": "这是小飞机小飞机",
							"rentPrice": 15,
							"leftNum": 3,
							"id": "570ae7cc7485edd82d76e2ca",
							"thumb": "/img/570a63942a3178482c5251a8"
						},
						"createdAt": "2016-04-11T06:30:00.079Z",
						"id": "570b44681df8973e5851f006"
					}
				],
			"address": {
				"recipient": "接收人",
				"phone": "15245013200",
				"city": "北京",
				"district": "西城区",
				"ring": "5环到6环之间",
				"address": "这是详细地址呀这是详细地址呀"
			},
			"deliveryDays": [
					1460390400000,
					1460476800000,
					1460563200000,
					1460649600000
				]
			}
		}
	// //ajax请求默认信息
	// $.ajax({
	// 	type: 'POST',
	// 	url: '/wxApi/order/defaultInfo',
	// 	contentType: 'application/json',
	// 	dataType: 'json',
	// 	data: getQueryStringArgs(),
	// 	success: function(data){
	// 		handingData(testData);		
	// 	},
	// 	error: function(xhr, type){
	// 		alert('Ajax error!')
	// 	}
	// })

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
	handingData(testData);
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
	console.log(userDate(1460304000));
});