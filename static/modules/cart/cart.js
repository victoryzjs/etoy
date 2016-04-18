/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../lib/baiduTemplate.js
 * @require ../../lib/zepto.js
 * @require ../../lib/fastclick.js
 * @require ../../lib/alert/zepto.alert.js
 */

$(function() {
	var $globalLoading = require('../ui/globalLoading/loading.js');
	$globalLoading.close();
	var $allChoiceBtn = $('.all-choice-btn').eq(0);
	var $cartList = $('.cart-list').eq(0);
	var checkedFlag = 0;
	var wrapCartId = [];
	var allPrice = 0;
	var bt=baidu.template;
	var $prompt = require('../ui/prompt/prompt.js');
	var deleteFlag = false;
	//请求数据
	$.ajax({
		type: 'GET',
		url: '/wxApi/shoppingCart/goods',
		contentType: 'application/json',
		dataType: 'json',
		success: function(data){
			$globalLoading.close();
			handingData(data)
			console.log(data);
		},
		error: function(xhr, type){
			alert('Ajax error!')
		}
	})
	//删除数据
	function deleteData(id, flag) {
		
		$.ajax({
			type: 'GET',
			url: '/wxApi/shoppingCart/remove/'+id,
			contentType: 'application/json',
			dataType: 'json',
			success: function(data){
				if(data.code = 200) {
					deleteFlag = true;
					$prompt.init('删除成功！');
				}else {
					$prompt.init('删除失败！');
				}
				

			},
			error: function(xhr, type){
				alert('Ajax error!')
			}
		})
	}
	//处理数据
	function handingData(data) {
		if(data.code != 200){
			alert("没接收到数据！");
		}else if(data.data.length == 0) {
			$('.cart-null').show();
		}
		var listData = {
			listData: data.data
		}
	
		$('.cart-list').eq(0).html(bt('list-tpl', listData));
	}


	$cartList.on('click', function(e) {
		var $aBtn = $('.settlement-btn a');
		var $span = $('.settlement-btn span');
		
		if($(e.target).hasClass('cart-list-one')) {
			$li = $(e.target);
		}else {
			$li = $(e.target).parents('li');
		}
	
		var $allLi = $li.parent('ul').find('li');

		if(!$li.hasClass('active') && !($(e.target).hasClass('delete-btn'))) {
			$li.addClass('active');
			wrapCartId.push($li.find('input').val());
			allPrice += Number($li.find('input').attr('data-price'));

		}else if(!$(e.target).hasClass('delete-btn')) {
			$li.removeClass('active');
			wrapCartId.splice(wrapCartId.indexOf($li.find('input').val()), 1);
			allPrice -= Number($li.find('input').attr('data-price'));
		}
		if($(e.target).hasClass('delete-btn')){
			e.stopPropagation();
			$.dialog({
				content : '是否确认删除？',
				title: null,
		        ok : function() {
					if(wrapCartId.indexOf($li.find('input').val()) >  -1) {
						wrapCartId.splice(wrapCartId.indexOf($li.find('input').val()), 1);
						allPrice -= Number($li.find('input').attr('data-price'));
					}
					
					//发送删除请求
					deleteData($li.find('input').val(), deleteFlag);
					if($cartList.find('li').length = 0){
						wrapCartId = [];
						$('.all-choice-btn').removeClass('active');
					}
					if($('.cart-list li').length == 0) {
						$('.cart-null').show();
						$('.all-choice-btn').eq(0).removeClass('active');
					}
					var deleteTimer = setInterval(function() {
						if(deleteFlag) {
							$li.remove();
							deleteFlag = false;
							clearInterval(deleteTimer);
						}
						if($cartList.find('li').length == 0) {
							$('.cart-null').show();
						}
					}, 100);
		            return true;
		        },
		        cancel : function() {
		            return true;
		        },
		        lock : true
			});



		}
		if($cartList.find('li').length == $cartList.find('li.active').length && $cartList.find('li').length != 0) {
			$('.all-choice-btn').addClass('active');
		}else {
			$('.all-choice-btn').removeClass('active');
		}
		$('.settlement-btn span').html(wrapCartId.length);

		var num = Number($span.html());
		if(num > 0) {
			$('.settlement-btn').css({
				backgroundColor: '#f1633d'
			});
		}else {
			$('.settlement-btn').css({
				backgroundColor: '#eee'
			});
		}
		$('.total-money span').html(allPrice.toFixed(2));
	});


	//全选
	$allChoiceBtn.on('click', function(e) {
		if(!$(this).hasClass('active')) {
			$(this).addClass('active');
			$cartList.find('li').addClass('active');
			$('.settlement-btn span').html($('.cart-list li').length);
			$('.cart-list input').each(function() {
				wrapCartId.push($(this).val());
				allPrice += Number($(this).attr('data-price'));
			});
		}else {
			$(this).removeClass('active');
			$cartList.find('li').removeClass('active');
			$('.settlement-btn span').html(0);
			wrapCartId = [];
			allPrice = 0;
		}
		var $aBtn = $('.settlement-btn a');
		var $span = $('.settlement-btn span');
		var num = Number($span.html());
		if(num > 0) {
			$('.settlement-btn').css({
				backgroundColor: '#f1633d'
			});
		}else {
			$('.settlement-btn').css({
				backgroundColor: '#eee'
			});
		}
		$('.total-money span').html(allPrice.toFixed(2));
	});
	//结算
	$('.settlement-btn').on('click', function() {
		var $aBtn = $(this).find('a');
		var $span = $(this).find('span');
		var num = Number($span.html());
		if(num > 0) {
			window.location.href = 'place_order.html?'+wrapCartId.join('&');
		}
	});


});