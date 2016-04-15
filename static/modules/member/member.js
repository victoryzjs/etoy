/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../lib/zepto.js
 * @require ../../lib/fastclick.js
 */
$(function() {
	//全局加载loading
	var $globalLoading = require('../ui/globalLoading/loading.js');
	var data = {};
	$globalLoading.close();
	$.ajax({
		type: 'GET',
		url: '/wxApi/bill/card/1',
		contentType: 'application/x-www-form-urlencoded; charset=utf-8',
		dataType: 'json',
		success: function(data){
			if(data.code != 200) {
				alert('请求失败！');
			}else {
				data = data.data;
				open(data);
			}
		},
		error: function(xhr, type){
			alert('Ajax error!');
		}
	})

	function open(data) {
			function onBridgeReady(){
			   WeixinJSBridge.invoke(
			       'getBrandWCPayRequest', {
			           "appId" : data.appId,    
			           "timeStamp": Math.floor(data.timeStamp/1000),  
			           "nonceStr" : data.nonceStr,
			           "package" : data.package,     
			           "signType" : "MD5",
			           "paySign" :data.paySign
			       },
			       function(res){     
			           if(res.err_msg == "get_brand_wcpay_request：ok" ) {
			           		alert(111);
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