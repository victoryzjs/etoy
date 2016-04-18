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
	var $prompt = require('../ui/prompt/prompt.js');
	var bt=baidu.template;
	var flag = false;
	//fastclick初始化
	FastClick.attach(document.body);
	$.ajax({
		type: 'POST',
		url: '/wxApi/order/defaultInfo',
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify({cartIds:getQueryStringArgs()}),
		success: function(data){
			console.log(data);
			handingData(data);		
		},
		error: function(xhr, type){
			alert('Ajax error!')
		}
	})

	function handingData(data) {
		if(data.code != 200){
			alert("没接收到数据！");
			return;
		}
		var listData = {
			initData: data.data
		}
		
		$('.wrap-init-tpl').eq(0).html(bt('init-tpl', listData));
		countMoney(data);
		//日期选择
		$('.lease-week input').mdater({ 
	    	minDate : new Date(2015, 10, 1)
		});
		console.log($('.lease-week input'));
		console.log($('.lease-week input').mdater);
		//订单提交
		$('.submit-order').on('click', function() {
			var res = getData();
			console.log(res);
			var obj = {};
			if(res) {
				$.ajax({
						type: 'POST',
						url: '/wxApi/order/submit',
						contentType: 'application/json',
						dataType: 'html',
						data: JSON.stringify(res),
						success: function(data){
							console.log();
							window.location.href = 'pay.html#'+JSON.parse(data).data.orderId;		
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
	//获取信息
	function getData() {
		//提交对象
		var postData = {};
		var recipient = $.trim($('.user-name input').val());
		var phone = $.trim($('.user-phone input').val());
		console.log(phone);
		var district = $('.district').val();
		var ring = $('.ring').val();
		var address = $.trim($('.address').val());
		var rentWeeks = $('.rentWeeks').val();
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
		if(rentWeeks.length != 0) {
			postData.rentWeeks = rentWeeks;
		}else {
			$prompt.init('请选择租赁周数');
			return false;
		}
		if(deliveryDay.length != 0) {
			postData.deliveryDay = get_unix_time(deliveryDay);
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
	//将日期转为时间戳
	function get_unix_time(dateStr)
	{
	    var newstr = dateStr.replace(/-/g,'/'); 
	    var date =  new Date(newstr); 
	    var time_str = date.getTime().toString();
	    return time_str.substr(0, 10);
	}
});