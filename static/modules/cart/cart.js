/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../lib/zepto.js
 * @require ../../lib/fastclick.js
 */

$(function() {
	// $loading.init().open();
	var $globalLoading = require('../ui/globalLoading/loading.js');
	$globalLoading.close();
	var $allChoiceBtn = $('.all-choice-btn').eq(0);
	var $cartList = $('.cart-list').eq(0);
	var checkedFlag = 0;


	$cartList.find('li').on('click', function(e) {
		var $parents = $(e.target).parents('li');
		var $allLi = $parents.parent('ul').find('li');
		if($(e.target).hasClass('delete-btn')){
			$parents.remove();
		}

		if(!$parents.hasClass('active')) {
			$parents.addClass('active');
		}else {
			$parents.removeClass('active');
		}
		$allLi.each(function() {
			if(!$(this).hasClass('active')) {
				checkedFlag++;
			}
		});
		if($cartList.find('li').length == $cartList.find('li.active').length ) {
			$('.all-choice-btn').addClass('active');
		}else {
			$('.all-choice-btn').removeClass('active');
		}

	});


	//全选
	$allChoiceBtn.on('click', function(e) {
		var $parents = $(e.target).parents('div', '.all-choice-btn');
		if(!$parents.hasClass('active')) {
			$parents.addClass('active');
			$cartList.find('li').addClass('active');
			console.log(11);
		}else {
			$parents.removeClass('active');
			$cartList.find('li').removeClass('active');
		}
	});


});