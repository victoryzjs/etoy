/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../lib/zepto.js
 * @require ../../lib/fastclick.js
 */

$(function() {
	//全局加载loading
	// var $globalLoading = require('../ui/globalLoading/loading.js');
	// $globalLoading.close();
	var $tobepaid = $('#tobepaid');
	var $tobegetgoods = $('#tobegetgoods');
	var $tosigned = $('#tosigned');
	var $togone = $('#togone');
	var $wrapStatus = $('.wrap-status>div');
	//请求数据
	$.ajax({
		type: 'POST',
		url: '/wxApi/order/1',
		dataType: 'json',
		success: function(data){
			console.log(data);
		},
		error: function(xhr, type){
			alert('Ajax error!')
		}
	})






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
			$tobepaid.show();
		}else if($(e.target).attr('data-name') == $tobegetgoods.attr('id')) {
			$tobegetgoods.show();
		}else if($(e.target).attr('data-name') == $tosigned.attr('id')) {
			$tosigned.show();
		}else if($(e.target).attr('data-name') == $togone.attr('id')) {
			$togone.show();
		}
	});
});