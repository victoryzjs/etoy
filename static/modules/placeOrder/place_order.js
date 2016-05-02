/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../common/css/common_list.less
 * @require ../../lib/zepto.js
 * @require ../../lib/baiduTemplate.js
 * @require ../../lib/fastclick.js
 * @require ../../lib/jweixin-1.0.0.js
 */
$(function() {
	FastClick.attach(document.body);
	var wxShare = require('../config/wxShareConfig.js');
	//全局加载loading
	var $globalLoading = require('../ui/globalLoading/loading.js');
	$globalLoading.close();
	var $prompt = require('../ui/prompt/prompt.js');
	var bt=baidu.template;
	var flag = true;
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

	
	$.ajax({
		type: 'POST',
		url: '/wxApi/order/defaultInfo',
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify({cartIds:getQueryStringArgs()}),
		success: function(data){
			data.data.parseDelivertyDays = [];
			data.data.deliveryDays.forEach(function(value, index, arr) {
				data.data.parseDelivertyDays.push(userDate(value));
			});
			handingData(data);		
		},
		error: function(xhr, type){
			alert('Ajax error!');
		}
	})

	function handingData(data) {
		if(data.msg) {
			$prompt.init(data.msg);
		}
		if(data.code == 234){
			location.href = data.directUrl;
		}
		var listData = {
			initData: data.data
		}
		
		$('.wrap-init-tpl').eq(0).html(bt('init-tpl', listData));
		countMoney(data);
		//订单提交
		$('.submit-order').on('click', function() {
			var res = getData();
			var obj = {};
			if(res) {
				$.ajax({
						type: 'POST',
						url: '/wxApi/order/submit',
						contentType: 'application/json',
						data: JSON.stringify(res),
						success: function(data){
							if(data.msg) {
								$prompt.init(data.msg);
							}
							if(data.code == 234) {
								location.href = data.directUrl;
							}
							if(data.code == 200) {

								window.location.href = 'pay.html#'+data.data.orderId;		
							}
						},
						error: function(xhr, type){
							alert('Ajax error!')
						}
					})
			}
		});
		//同意协议
		$('.agreen').on('click', function() {
			if(!flag) {
				$(this).addClass('active');
				flag = true;
			}else {
				$(this).removeClass('active');
				flag = false;
			}
		});
	}
	// handingData(testData);
	//计算金额
	function countMoney(data) {	
		var count = 0;
		var freight = 0;
		for(var i=0,len=data.data.goods.length; i<len; i++) {
			count +=data.data.goods[i].rentWeek==1 ? data.data.goods[i].good.rentPrice['1']/100 : (data.data.goods[i].rentWeek==2 ? data.data.goods[i].good.rentPrice['2']/100 : (data.data.goods[i].rentWeek == 3 ? data.data.goods[i].good.rentPrice['3']/100 : data.data.goods[i].good.rentPrice['4']/100));
		}
		if(count < 150) {
			$('.freight-span span').html(20);
			freight = 20;
		}else {
			$('.freight-span span').html(0);
		}
		$('.rent-price span').html(count);
		$('.allCount span').html(count+freight);
	}
	//获取信息
	function getData() {
		//提交对象
		var postData = {};
		var recipient = $.trim($('.user-name input').val());
		var phone = $.trim($('.user-phone input').val());
		var district = $('.district').val();
		var ring = $('.ring').val();
		var address = $.trim($('.address').val());
		var deliveryDay = $('.deliveryDay').val();
		var mark = $('.mark').val();
		if(recipient.length != 0) {
			postData.recipient = recipient;
		}else {
			$prompt.init('请填写姓名！');
			return false;
		}
		if(phone.length == 0){
			$prompt.init('请填写手机号！');
			return false;
		}else if(!isTelOrMobile(phone)) {
			$prompt.init('手机号不正确！');
			return false;
		}else {
			postData.phone = phone;
		}
		if(district.length != 0) {
			postData.district = district;
		}else {
			$prompt.init('请选择地区！');
			return false;
		}
		if(ring.length != 0) {
			postData.ring = ring;
		}else {
			$prompt.init('请选择范围！');
			return false;
		}
		if(address.length != 0) {
			postData.address = address;
		}else {
			$prompt.init('请填写详细地址！');
			return false;
		}
		if(deliveryDay.length != 0) {
			postData.deliveryDay = deliveryDay;
		}else {
			$prompt.init('请选择配送时间');
			return false;
		}
		postData.mark = mark ? mark : '';
		if(!flag) {
			$prompt.init('请同意租赁协议');
			return false;
		}
		postData.cartIds = getQueryStringArgs();
		return 	postData;
	}

	//获取cartId
	function getQueryStringArgs() {
		var qs = (location.search.length > 0 ? location.search.substring(1) : "");
		
		return qs.replace(/\&/g,",");
	}
	//判断电话号码是否正确
	function isTelOrMobile(telephone){  
	    var teleReg = /^((0\d{2,3})-)(\d{7,8})$/;  
	    var mobileReg =/^1[358]\d{9}$/;   
	    if (!teleReg.test(telephone) && !mobileReg.test(telephone)){  
	        return false;  
	    }else{  
	        return true;  
	    }
	}
	//将时间戳转为日期格式
	function userDate(uData){
	  var myDate = new Date(uData);
	  var year = myDate.getFullYear();
	  var month = (myDate.getMonth() + 1) > 9 ? (myDate.getMonth() + 1) : ('0'+(myDate.getMonth() + 1)) ;
	  var day = myDate.getDate()>9 ? myDate.getDate() : ('0'+myDate.getDate());
	  return year + '-' + month + '-' + day;
	}
});