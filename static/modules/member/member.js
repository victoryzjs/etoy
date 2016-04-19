/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../lib/zepto.js
 * @require ../../lib/fastclick.js
 */
$(function() {
	//全局加载loading
	var $globalLoading = require('../ui/globalLoading/loading.js');
	var $loading = require('../ui/loading/loading.js');
	var data = {};
	$loading.init();
	$globalLoading.close();
	var $choice1 = $('.choice1');
	var $choice2 = $('.choice2');
	var $choice3 = $('.choice3');
	$('.choice1').on('click', function() {
		$loading.open();
		getData(1);
	});
	$('.choice2').on('click', function() {
		$loading.open();
		getData(2);
	});
	$('.choice3').on('click', function() {
		$loading.open();
		getData(3);
	});


	function getData(id) {
		$.ajax({
			type: 'GET',
			url: '/wxApi/bill/card/' + id,
			contentType: 'application/x-www-form-urlencoded; charset=utf-8',
			dataType: 'json',
			success: function(data){
				$loading.close();
				if(data.code == 234) {
					location.href = data.directUrl;
				}else {
					data = data.data;
					open(data);
				}
			},
			error: function(xhr, type){
				$loading.close();
				alert('Ajax error!');
			}
		})		
	}



	function open(data) {
			function onBridgeReady(){
			   WeixinJSBridge.invoke(
			       'getBrandWCPayRequest', data,
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
});