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
	var $hash = window.location.hash.substring(1);
	var $orderDetail = $('.order-detail');
	var $chuxuka = $('.chuxuka');
	var $detailedListUl = $('.detailed-list-ul');
	var $deposit = $('.deposit');
	var $totalPage = $('total-page');
	var $weixinPay = $('.weixin-pay');
	var $cardPay = $('.card-pay');
	var $giveMoney = $('.give-money');
	var money1 = 0;
	var money2 = 500;
	var money3 = 0;
	var money4 = 0;
	var money5 = 0;
	var total = 0;
	var argu = {};
	var give = 0;
	var payFlag = true;
	argu.orderId = $hash;
	argu.cardType = 1;
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
	
	//请求数据
	$.ajax({
		type: 'GET',
		url: '/wxApi/order/pay/'+$hash,
		dataType: 'json',
		success: function(data){
			$globalLoading.close();
			if(data.msg) {
				$prompt.init(data.msg);
			}
			if(data.code == 234) {
				location.href = data.directUrl;
			}else {
				handleData(data.data);
			}
		},
		error: function(xhr, type){
			$globalLoading.close();
			alert('Ajax error!')
		}
	})
	function handleData(data) {
		$orderDetail.find('span').html(data.orderPrice/100);
		if(data.currentBalance >= data.orderPrice) {
			$cardPay.addClass('active');
			$('.balance span').html(data.currentBalance/100);
			argu = {
				"orderId" : $hash
			};
		}else {
			money1 = data.currentBalance/100;
			money3 = (data.orderPrice/100).toFixed(2);
			$orderDetail.addClass('active');
			$weixinPay.addClass('active');
			$chuxuka.show();
			$('.money').eq(0).html(data.currentBalance/100);
			$('.money').eq(2).html(data.orderPrice/100);
			if(data.currentDeposit == 0) {
				$('.money').eq(4).html(1000);
				money4 = 1000;
			}
		}
		calculate();
		$('.orderNum').html(data.orderNum);
		localStorage.setItem('orderNum', data.orderNum);
		localStorage.setItem('orderId', $hash);
	}
	//选择储蓄卡
	$('.number-choice>label').on('click', function() {
		var num = Number($(this).attr('data-num'));
		var $money1 = $('.money').eq(1);
		$('.number-choice>label').removeClass('active');
		$(this).addClass('active');
		if(num == 500) {
			$money1.html(500);
			money2 = 500;
			argu.cardType = 1;
			$giveMoney.html(0);
			give = 0;
		}else if(num == 1000) {
			$money1.html(1000);
			money2 = 1000;
			argu.cardType = 2;
			$giveMoney.html(100);
			give = 100;
		}else if(num == 2000) {
			$money1.html(2000);
			money2 = 2000;
			argu.cardType = 3;
			$giveMoney.html(300);
			give = 300;
		}
		calculate();
	});
	//动态计算购买后结余和计费总价
	function calculate() {
		$('.money').eq(3).html((give + money1 + money2 - money3).toFixed(2));
		$('.money').eq(5).html(money2  + money4);
	}
	//点击微信支付
	$weixinPay.on('click', function() {
		console.log(payFlag);
		if(payFlag) {
			payFlag = false;
			$.ajax({
				type: 'POST',
				url: '/wxApi/bill/orderAfterCard',
				data: "orderId="+argu.orderId+'&cardType='+argu.cardType,
				success: function(data){
					payFlag = true;
					if(data.code == 234) {
						location.href = data.directUrl;
					}else {
						function onBridgeReady(){
							WeixinJSBridge.invoke(
							   'getBrandWCPayRequest', data.data,
							   function(res){     
							       if(res.err_msg == "get_brand_wcpay_request：ok" ) {
							       		alert('error');
							       }
							   }
							); 
						}
						if(typeof WeixinJSBridge == "undefined") {
							$(document).on('WeixinJSBridgeReady', onBridgeReady);
						}else {
							onBridgeReady();
						}
					}
				},
				error: function(xhr, type){
					payFlag = true;
					alert('Ajax error!')
				}
			});	
		}else {
			return false;
		}
	});
	//点击储蓄卡支付
	$cardPay.on('click', function() {
		$.ajax({
			type: 'POST',
			url: '/wxApi/bill/payOrderByBalance',
			data: "orderId="+argu.orderId,
			success: function(data){
				if(data.code == 234) {
					location.href = data.directUrl;
				}else {
					window.location.href = 'pay_success.html';
				}
			},
			error: function(xhr, type){
				alert('Ajax error!')
			}
		});	
	});
});