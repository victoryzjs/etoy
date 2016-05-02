/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../lib/baiduTemplate.js
 * @require ../../lib/zepto.js
 * @require ../../lib/fastclick.js
 * @require ../../lib/alert/zepto.alert.js
 * @require ../../lib/jweixin-1.0.0.js
 */

$(function() {
	FastClick.attach(document.body);
	var wxShare = require('../config/wxShareConfig.js');
	var $globalLoading = require('../ui/globalLoading/loading.js');
	var $allChoiceBtn = $('.all-choice-btn').eq(0);
	var $cartList = $('.cart-list').eq(0);
	var checkedFlag = 0;
	var wrapCartId = [];
	var allPrice = 0;
	var bt=baidu.template;
	var $prompt = require('../ui/prompt/prompt.js');
	var deleteFlag = false;
	var isAllHave = true;
	var goodsObject = {};
	var isChoice = {};
	//获取分享参数
	$.ajax({
		type: 'GET',
		url: '/weChat/jsApiTicket',
		contentType: 'application/json',
		success: function(data){
			wxShare.init(data.data);
		},
		error: function(xhr, dataTypepe){
			alert('Ajax error!')
		}
	});
	//请求数据
	$.ajax({
		type: 'GET',
		url: '/wxApi/shoppingCart/goods',
		contentType: 'application/json',
		dataType: 'json',
		success: function(data){
			$globalLoading.close();
			handingData(data)
		},
		error: function(xhr, type){
			alert('Ajax error!')
		}
	})
	//删除数据
	function deleteData(id, dataId) {
		$.ajax({
			type: 'GET',
			url: '/wxApi/shoppingCart/remove/'+id,
			contentType: 'application/json',
			dataType: 'json',
			success: function(data){
				if(data.code = 200) {
					deleteFlag = true;
					$prompt.init(data.msg);
					goodsObject[dataId]['num']--;
				}else if(data.code==234 ) {
					location.href = data.directUrl;
				}else {
					$prompt.init(data.msg);
				}
			},
			error: function(xhr, type){
				alert('Ajax error!')
			}
		})
	}
	//处理数据
	function handingData(data) {
		if(data.msg) {
			$prompt.init(data.msg);
		}
		if(data.code != 200){
			location.href = data.directUrl;
			return;
		}else if(data.data.length == 0) {
			$('.cart-null').show();
		}
		var listData = {
			listData: data.data
		}
	
		$('.cart-list').eq(0).html(bt('list-tpl', listData));
		handleSame(data.data);
		// isHave();
	}


	$cartList.on('click', function(e) {
		var $aBtn = $('.settlement-btn a');
		var $span = $('.settlement-btn span');
		if($(e.target).hasClass('cart-list-one')) {
			$li = $(e.target);
		}else {
			$li = $(e.target).parents('li');
		}
		var dataId = $li.find('input').attr('data-id');
	
		var $allLi = $li.parent('ul').find('li');

		if(!$li.hasClass('active') && !($(e.target).hasClass('delete-btn'))) {
			if(Number($li.attr('data-left'))) {
				if(!isChoice[dataId]) {
					isChoice[dataId] = 1;
				}else{
					isChoice[dataId]++
				}

				if(goodsObject[$li.find('input').attr('data-id')].leftNum>= isChoice[dataId]) {
					$li.addClass('active');
					wrapCartId.push($li.find('input').val());
					allPrice += Number($li.find('input').attr('data-price'));
				}else {
					$prompt.init('该商品存货不足！');
				}

				
			}else {
				$prompt.init('该商品无货！');
			}

		}else if(!$(e.target).hasClass('delete-btn')) {
			isChoice[dataId]--;
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
					deleteData($li.find('input').val(), $li.find('input').attr('data-id'));
					var deleteTimer = setInterval(function() {
						if(deleteFlag) {
							$li.remove();
							deleteFlag = false;
							if($('.cart-list li').length.length == 0){
								wrapCartId = [];
								$allChoiceBtn.removeClass('active');
							}
							if($('.cart-list li').length == 0) {
								$('.cart-null').show();
								$('.all-choice-btn').eq(0).removeClass('active');
							}
							clearInterval(deleteTimer);
							if($li.hasClass('active')) {
								$('.total-money span').html(allPrice);
							}
							
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
		$('.total-money span').html(allPrice);
		// isHave();
	});
	//处理相同商品
	function handleSame(data) {
		data.forEach(function(value, index, array) {
			if(!goodsObject[value.good.id]) {
				goodsObject[value.good.id] = {
					'leftNum' : value.good.leftNum,
					'num' : 1,
					'title' : value.good.title
				}
			}else {
				goodsObject[value.good.id]['num']++;
			}
		});
	}
	//判断商品是否不足
	function goodsIsHave(obj) {
		var value = '';
		var res = {
			isHave: true,
			goods: []
		};
		for(var val in obj) {
			if(obj[val]['leftNum'] < obj[val]['num']) {
				res.isHave = false;
				

				res.goods.push([obj[val]['title'], val]);

			}else if(obj[val]['leftNum'] >= obj[val]['num']) {
				// res.goods.remove(obj[val]['title']);
				
				res.goods.forEach(function(value, index ,array) {
					if(value[1] == val) {
						res.goods.remove(value);
					}
				});
			}
		}
		return res;
	}
	//判断是否都有货
	function isHave() {
		var index = 0;
		$cartList.find('li').each(function() {
			if(Number($(this).attr('data-left')) != 0) {
				index++;
			}
		});
		if(index == $cartList.find('li').length) {
			isAllHave = true;
		}else {
			isAllHave = false;
		}
	}

	//全选
	$allChoiceBtn.on('click', function(e) {
		if(goodsIsHave(goodsObject).isHave) {
			if($('.cart-list li').length != 0) {

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
					isChoice = {};
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
				$('.total-money span').html(allPrice);
			}
		}else {
			$prompt.init(goodsIsHave(goodsObject).goods[0][0] + '商品存货不足！');
		}
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
	//将时间戳转为日期格式
	function userDate(uData){
	  var myDate = new Date(uData*1000);
	  var year = myDate.getFullYear();
	  var month = (myDate.getMonth() + 1) > 9 ? (myDate.getMonth() + 1) : ('0'+(myDate.getMonth() + 1)) ;
	  var day = myDate.getDate()>9 ? myDate.getDate() : ('0'+myDate.getDate());
	  return year + '-' + month + '-' + day;
	}

	Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };

});