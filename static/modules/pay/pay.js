/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../lib/zepto.js
 * @require ../../lib/fastclick.js
 */

$(function() {
	var $hash = window.location.hash.substring(1);
	var $orderDetail = $('.order-detail');
	var $chuxuka = $('.chuxuka');
	var $detailedListUl = $('.detailed-list-ul');
	var $deposit = $('.deposit');
	var $totalPage = $('total-page');
	var $weixinPay = $('.weixin-pay');
	var $cardPay = $('.card-pay');
	var money1 = 0;
	var money2 = 500;
	var money3 = 0;
	var money4 = 0;
	var money5 = 0;
	var total = 0;
	var argu = {};
	argu.orderId = $hash;
	argu.cartType = 1;
	// {
	//   "code": 200,
	//   "data": {
	//     "currentBalance": 679,
	//     "currentDeposit": 0,
	//     "orderPrice": 116400
	//   }
	// }
	//请求数据
	$.ajax({
		type: 'GET',
		url: '/wxApi/order/pay/'+$hash,
		dataType: 'json',
		success: function(data){
			if(data.code != 200) {
				alert('请求有误');
			}else {
				handleData(data.data);
			}
		},
		error: function(xhr, type){
			alert('Ajax error!')
		}
	})
	function handleData(data) {
		$orderDetail.find('span').html(data.orderPrice);
		if(data.currentBalance >= data.orderPrice) {
			$cardPay.addClass('active');
			$('.balance span').html(data.currentBalance);
			argu = {
				"orderId" : $hash
			};
		}else {
			money1 = data.currentBalance;
			money3 = data.orderPrice;
			$orderDetail.addClass('active');
			$weixinPay.addClass('active');
			$chuxuka.show();
			$('.money').eq(0).html(data.currentBalance);
			$('.money').eq(2).html(data.orderPrice);
			if(data.currentDeposit == 0) {
				$('.money').eq(4).html(1000);
				money4 = 1000;
			}
		}
		calculate();
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
			argu.cartType = 1;
		}else if(num == 1000) {
			$money1.html(1000);
			money2 = 1000;
			argu.cartType = 2;
		}else if(num == 2000) {
			$money1.html(2000);
			money2 = 2000;
			argu.cartType = 3;
		}
		calculate();
		console.log(argu);
	});
	//动态计算购买后结余和计费总价
	function calculate() {
		$('.money').eq(3).html(money1 + money2 - money3);
		$('.money').eq(5).html(money1 + money2 - money3 + money4);
	}
	//点击微信支付
	$weixinPay.on('click', function() {
		pay();
	});
	//点击储蓄卡支付
	$cardPay.on('click', function() {
		pay();
	});
	function pay() {
		$.ajax({
			type: 'POST',
			url: '/wxApi/bill/payOrderByBalance',
			data: JSON.stringify(argu),
			success: function(data){
				if(data.code != 200) {
					alert('请求有误');
				}else {
					window.location.href = 'pay_success.html';
				}
			},
			error: function(xhr, type){
				alert('Ajax error!')
			}
		})			
	}
});