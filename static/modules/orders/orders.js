/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../lib/zepto.js
 * @require ../../lib/baiduTemplate.js
 * @require ../../lib/fastclick.js
 */

$(function() {
	//全局加载loading
	var $globalLoading = require('../ui/globalLoading/loading.js');
	$globalLoading.close();
	var $loading = require('../ui/loading/loading.js');
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

	$ajax(1, $($initObj), 'tobepaid-tpl');

	function $ajax(arg, obj, tpl) {
		$.ajax({
			type: 'GET',
			url: '/wxApi/order/'+arg,
			dataType: 'json',
			success: function(data){
				if(data.code != 200) {
					alert('没有接收到数据！');
				}else {
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
		$('.delete-order').on('click', function() {
			alert();
		});
	}
	


	//将时间戳转为日期
	function getLocalTime(nS) {     
    	return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,9)
	} 

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


});