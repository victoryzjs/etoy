/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../lib/zepto.js
 * @require ../../lib/baiduTemplate.js
 * @require ../../lib/fastclick.js
 * @require ../../lib/alert/zepto.alert.js
 * @require ../../lib/jweixin-1.0.0.js
 */

$(function() {
	FastClick.attach(document.body);
	var wxShare = require('../config/wxShareConfig.js');
	//全局加载loading
	var $globalLoading = require('../ui/globalLoading/loading.js');
	var $loading = require('../ui/loading/loading.js');
	var $prompt = require('../ui/prompt/prompt.js');
	var $tobepaid = $('#tobepaid');
	var $tobegetgoods = $('#tobegetgoods');
	var $tosigned = $('#tosigned');
	var $togone = $('#togone');
	var $wrapStatus = $('.wrap-status>div');
	var bt=baidu.template;
	var $obj = $('#tobepaid');
	var $tpl = 'tobepaid-tpl';
	$loading.init();
	var $initObj = window.location.hash ? window.location.hash : '#tobepaid';
	if($initObj == '#tobepaid') {
		$ajax(1, $($initObj), 'tobepaid-tpl');	
	}else if($initObj == '#tobegetgoods') {
		$ajax(2, $($initObj), 'left-tpl');	
	}else if($initObj == '#tosigned') {
		$ajax(3, $($initObj), 'left-tpl');	
	}else if($initObj == '#togone') {
		$ajax(4, $($initObj), 'left-tpl');	
	}
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

	function $ajax(arg, obj, tpl) {
		$.ajax({
			type: 'GET',
			url: '/wxApi/order/'+arg,
			dataType: 'json',
			success: function(data){
				$globalLoading.close();
				if(data.msg) {
					$prompt.init(data.msg);
				}
				if(data.code == 234) {
					location.href = data.directUrl;
				}else {
					data.data.forEach(function(value, index, array) {
						value.goods.forEach(function(value, index, array) {
							value.rentBackDay = userDate(value.rentBackDay);
						});
					});
					console.log(data.data);
					handleData(obj, tpl, data);
				}
			},
			error: function(xhr, type){
				alert('Ajax error!')
			}
		})

	}

	function handleData(obj, tpl, data) {
		$loading.close();
		var listData = {
			initData: data.data
		}
		obj.html(bt(tpl, listData));
		$('.wrap-all-one').on('click', function() {

			console.log(this);
			location.href="detail_order.html#"+encodeURI($(this).attr('data-order'));
		});
		$('.delete-order').on('click', function(e) {
			e.stopPropagation();
			var $parent = $(e.target).parents('.wrap-all-one');
			var $this = $(this);
			$.dialog({
				content : '是否确认删除？',
				title: null,
		        ok : function() {
					$.ajax({
						type: 'GET',
						url: '/wxApi/order/cancel/'+encodeURI($this.parents('.wrap-all-one').attr('data-order')),
						dataType: 'json',
						success: function(data){
							if(data.code != 200) {
								alert('没有接收到数据！');
							}else {
								$parent.remove();
								$prompt.init(data.msg);
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
	//将时间戳转为日期
	// function getLocalTime(nS) {     
 //    	return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,9)
	// } 

	//获取url的hash值
	function getHash() {
		return location.hash.substring(1);
	}
	//根据hash判断显示或隐藏
	function isDisplay() {
		var hash = getHash();
		$wrapStatus.removeClass('active');
		if(!hash) {
			 $('.tobepaid').addClass('active');
		}else {
			$('.'+hash).addClass('active');			
		}

		$('.is-show').hide();
		if(hash == '' || hash==$tobepaid.attr('id') ) {
			$tobepaid.show();
		}else if(hash==$tobegetgoods.attr('id')) {
			$tobegetgoods.show();
		}else if(hash==$tosigned.attr('id')) {
			$tosigned.show();
		}else if(hash==$togone.attr('id')) {
			$togone.show();
		}
	}
	isDisplay();

	//点击切换
	$('.wrap-status').on('click', function(e) {
		var $target = $(e.target);
		$wrapStatus.removeClass('active');
		$target.addClass('active');
		$('.is-show').hide();
		if($(e.target).attr('data-name') == $tobepaid.attr('id') ) {
			//实际操作打开
			$ajax(1, $('#tobepaid'), 'tobepaid-tpl');
			$loading.open();
			$tobepaid.show();
		}else if($(e.target).attr('data-name') == $tobegetgoods.attr('id')) {
			//实际操作打开
			$ajax(2, $('#tobegetgoods'), 'left-tpl');
			$loading.open();
			$tobegetgoods.show();
		}else if($(e.target).attr('data-name') == $tosigned.attr('id')) {
			//实际操作打开
			$ajax(3, $('#tosigned'), 'left-tpl');
			$loading.open();
			$tosigned.show();
		}else if($(e.target).attr('data-name') == $togone.attr('id')) {
			//实际操作打开
			$ajax(4, $('#togone'), 'left-tpl');
			$loading.open();
			$togone.show();
		}
	});
	//点击电话按钮弹窗
	$('.tobecall').on('click', function() {
		$('.mask').show();
		$('.phone-dialog').show();
	});
	$('.phone-dialog div').on('click', function() {
		$('.mask').hide();
		$('.phone-dialog').hide();
	});
	//将时间戳转为日期格式
	function userDate(uData){
	  var myDate = new Date(uData);
	  var year = myDate.getFullYear();
	  var month = (myDate.getMonth() + 1) > 9 ? (myDate.getMonth() + 1) : ('0'+(myDate.getMonth() + 1)) ;
	  var day = myDate.getDate()>9 ? myDate.getDate() : ('0'+myDate.getDate());
	  return year + '-' + month + '-' + day;
	}
});