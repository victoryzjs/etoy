/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../lib/zepto.js
 * @require ../../lib/fastclick.js
 * @require ../ui/dropload/dropload.less
 */


$(function() {
	var $dropload = new(require('../ui/dropload/dropload.js'));
	var $globalLoading = require('../ui/globalLoading/loading.js');
	var $wrapScreen = $('.wrap-screen').eq(0);
	var $shaixuan = $('.shaixuan').eq(0);
	var $cancel = $('.cancel').eq(0);
	var $WH = $(window).height();
	var $WW = $(window).width();
	var $wrapScreenList = $('.wrap-screen-list').eq(0);
	var $selectValue = $('.select-value');
	var $selectYes = $('.select-yes').eq(0);
	var $selectAll = $('.select-all').eq(0);
	var $selectConditionList = $('.select-condition-list').eq(0);
	$dropload.init();
	$dropload.start();
	$globalLoading.close();

	$wrapScreen.css('height', $WH);
	$shaixuan.on('click', function() {
		$wrapScreen.show();
	});
	$cancel.on('click', function() {
		$wrapScreen.hide();
	});

	$wrapScreenList.css({
		'width': $WW,
		'height': $WH,
		'left': $WW
	});

	$selectValue.each(function(index, item) {

		$(item).on('click', function() {
			if($(item).hasClass('select-age')) {
				$selectConditionList.attr('data-name', 'ul-age').html(insertData(condition['age']));
				console.log($selectConditionList.attr('data-name'));

			}else if($(item).hasClass('select-brand')) {
				$selectConditionList.attr('data-name', 'ul-brand').html(insertData(condition['brand']));
			}else if($(item).hasClass('select-function')) {
				$selectConditionList.attr('data-name', 'ul-func').html(insertData(condition['func']));	
			}
			$wrapScreenList.animate({
				'left': 0
			}, 200);
		})
	});
	$selectYes.on('click', function() {
		$wrapScreenList.animate({
			'left': $WW
		}, 200);
	});

	//全选
	$selectAll.on('click', function() {
		$selectConditionList.find('li').addClass('active');
	});
	//发送ajax请求获取信息
	$.get('../../../test.txt', function(response){
	})

	//单击选中或取消

	$selectConditionList.on('click', function(e) {
		var $li = $(e.target);
		var $ul = $li.parent();
		if($ul.attr('data-name') == 'ul-age') {

			if(isHave(infoBag['age'], $li.html())){
				infoBag['age'].push($li.html());
			}
			console.log(infoBag['age']);

		}else if($ul.attr('data-name') == 'ul-brand') {

			if(isHave(infoBag['brand'], $li.html())){
				infoBag['brand'].push($li.html());
			}

		}else if($ul.attr('data-name') == 'ul-func') {

			if(isHave(infoBag['func'], $li.html())){
				infoBag['func'].push($li.html());
			}


			
		}
		if(!$li.hasClass('active')) {
			$li.addClass('active');
		}else {
			$li.removeClass('active');
		}
		console.log(infoBag);
	});



	//测试数据
	var condition = {
		'brand': ['美德斯邦威', '贵人鸟', '安踏', '微星', '戴尔'],
		'age': ['11-15', '16-24', '25-30', '31-35'],
		'func': ['吃', '喝', '玩', '乐']
	};

	function insertData(data) {
		var len = data.length;
		var cont = '';
		for(var i = 0; i < len; i++) {
			cont += '<li class="plr12">' + data[i] + '</li>';
		}
		return cont;
	}
	var infoBag = {
		'brand': [],
		'age': [],
		'func': []
	};
	//是否选中，选中再次选取删除
	function isHave(data, value) {
		var flag = true;
		data.forEach(function(item, index) {
			if(item == value){
				data.splice(index, 1);
				flag = false;
				console.log(11122)
				return;
			}
		});
		return flag;
	}
	

});