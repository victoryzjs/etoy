/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../lib/zepto.js
 * @require ../../lib/fastclick.js
 * @require ../../lib/baiduTemplate.js
 * @require ../ui/dropload/dropload.less
 * @require ../../lib/jweixin-1.0.0.js
 */
$(function() {
	FastClick.attach(document.body);
	var DropLoad = require('../ui/dropload/dropload.js');
	var $globalLoading = require('../ui/globalLoading/loading.js');
	var $prompt = require('../ui/prompt/prompt.js');
	var $loading = require('../ui/loading/loading.js');
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
	var $tip = require('../ui/tip/tip.js');
	var skip = 0;
	var bt = baidu.template;
	var listData = {'list':[]};
	var isAsc = true;
	var argu = '';
	var wxShare = require('../config/wxShareConfig.js');
	var listRes = 0;
	var rearchRes = 0;
	$globalLoading.close();
	$loading.init();

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

	function getAllList(condition1, id) {
		var condition1 = condition1 ? ('&'+condition1) : '';
		var condition = 'limit=8&isUsing=true&skip=' + skip + condition1;
		$.ajax({
			type: 'GET',
			url: '/good/find?'+condition,
			contentType: 'application/json',
			success: function(data){
				if(data.msg) {
					$prompt.init(data.msg);
				}
				if(data.code==234 ) {
					location.href = data.directUrl;
				}
				if(data.code == 200) {
					$('.result-null').hide();
					$loading.close();
					if(data.data.length <= 0 && listRes == 0) {
						$('.result-null').show();
						$dropload.stop();
					}else if (data.data.length <= 0) {
						$dropload.stop();
					}else {
						if(id == '.price') {
							isAsc = !isAsc;
						}
						listData.list = listData.list.concat(data.data);
						if(data.data.length < 8) {
							$dropload.stop();
						}else {
							skip+=data.data.length;
							$dropload.start();
						}	
						$('#wrap-list-tpl').html(bt('list-tpl', listData));						
						listRes++;		
					}
				}
	
			},
			error: function(xhr, type){
				alert('Ajax error!')
			}
		})
	}
	function getConditionList(condition) {
		$.ajax({
			type: 'GET',
			url: '/good/find?limit=8&isUsing=true&skip=' + skip + '&where='+condition,
			contentType: 'application/json',
			success: function(data){
				$('.result-null').hide();
				$loading.close();
				if(data.data.length <= 0 && rearchRes == 0) {
					$('.result-null').show();
					$dropload.stop();
				}else if (data.data.length <= 0) {
					$dropload.stop();
				}else {
					listData.list = listData.list.concat(data.data);
					if(data.data.length < 8) {
						$dropload.stop();
					}else {
						skip+=data.data.length;
						$dropload.start();
					}	
					$('#wrap-list-tpl').html(bt('list-tpl', listData));
					rearchRes++;					
				}
		
			},
			error: function(xhr, type){
				alert('Ajax error!')
			}
		})
	}
	//初次访问页面ajax请求数据
	var $dropload = new DropLoad(function() {
		getAllList('sort=createdAt%20DESC&'+(getQueryStringArgs()?getQueryStringArgs():''));
	});
	getAllList('sort=createdAt%20DESC&'+(getQueryStringArgs()?getQueryStringArgs():''));

	function getData(id, item) {
		$(id).on('click', function() {
			if(id == '.price') {
				if(isAsc == true) {
					item = 'sort=rentPrice%20ASC&';
				}else {
					item = 'sort=rentPrice%20DESC&';
				}
			}
			if(id == '.ranking') {
				item = 'sort=createdAt%20DESC&';
			}
			if(id == '.popularity') {
				item = 'sort=rentNum%20DESC&';
			}
			item = argu ? item + 'where=' + argu : item;
			listData.list = [];
			skip = 0;
			$loading.open();
			$dropload.stop();
			$('.switch-option-one').removeClass('active');
			$(this).addClass('active');
			$dropload = new DropLoad(function() {
				getAllList(item, id);
			});
			$('#wrap-list-tpl').html(' ');	
			getAllList(item, id);
		});		
	}
	getData('.ranking');
	getData('.popularity');
	getData('.price');
	//声明变量存储筛选条件
	var condition = {
		'age': [],
		'brand': [],
		'func': {}
	};
	var funcCondition = {};
	
	var infoBag = {
		'brand': [],
		'age': [],
		'func':  []
	};

	var inforBagTrue = {
		'brand': {},
		'age': {}
	};
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

				if(infoBag.age.length < condition.age.length) {
					$selectAll.html('全选');
				}else {
					$selectAll.html('取消');
				}
				

				$selectConditionList.attr('data-name', 'ul-age').html(insertData(condition['age'], 'age'));


			}else if($(item).hasClass('select-brand')) {
				$selectConditionList.attr('data-name', 'ul-brand').html(insertData(condition['brand'],'brand'));
				$selectAll.html('单选');
			}else if($(item).hasClass('select-function')) {
				if(infoBag.func.length < condition.func.length) {
					$selectAll.html('全选');
				}else {
					$selectAll.html('取消');
				}
				
				$selectConditionList.attr('data-name', 'ul-func').html(insertData(condition['func'], 'func'));	
			}
			$wrapScreenList.animate({
				'left': 0
			}, 200);
		})
	});
	//点击确认按钮dom插入数据
	$selectYes.on('click', function() {
		$wrapScreenList.animate({
			'left': $WW
		}, 200);


		if(infoBag.age.length != 0){
			var ageHtml = '';
			for(var i=0,len=infoBag.age.length; i<len; i++){
				ageHtml += infoBag.age[i] + ',';
			}
			$('.select-age span').eq(0).html(ageHtml.substring(0, ageHtml.length - 1));
		}else {
			$('.select-age span').eq(0).html('选择一项或多个');
		}


		$('.select-brand span').eq(0).html(infoBag.brand[0]?infoBag.brand[0]:'选择一项');
		if(infoBag.func.length != 0){
			var funcHtml = '';
			for(var i=0,len=infoBag.func.length; i<len; i++){
				funcHtml += infoBag.func[i] + ',';
			}
			$('.select-function span').eq(0).html(funcHtml.substring(0, funcHtml.length - 1));
		}else {
			$('.select-function span').eq(0).html('选择一项或多个');
		}
		

	});
	//全选
	$selectAll.on('click', function() {
		if($selectConditionList.attr('data-name') == 'ul-func') {
			if($selectAll.html() == '全选') {
				$selectConditionList.attr('data-name', 'ul-func').html(insertData(condition['func'], 'func'));
				$selectConditionList.find('li').each(function(index, item) {
					$(item).addClass('active');
				});
				for(var i=0,len=condition.func.length; i<len; i++) {
					infoBag['func'][i] = condition.func[i];
				}
				$selectAll.html('取消');
			}else if($selectAll.html() == '取消') {
				$selectConditionList.attr('data-name', 'ul-func').html(insertData(condition['func'], 'func'));
				$selectConditionList.find('li').each(function(index, item) {
					$(item).removeClass('active');
				});
				infoBag['func'] = [];
				$selectAll.html('全选');
			}
		}else if($selectConditionList.attr('data-name') == 'ul-age') {
			if($selectAll.html() == '全选') {
				$selectConditionList.attr('data-name', 'ul-age').html(insertData(condition['age'], 'age'));
				$selectConditionList.find('li').each(function(index, item) {
					$(item).addClass('active');
				});
				for(var i=0,len=condition.age.length; i<len; i++) {
					infoBag['age'][i] = condition.age[i];
				}
				$selectAll.html('取消');
			}else if($selectAll.html() == '取消') {
				$selectConditionList.attr('data-name', 'ul-age').html(insertData(condition['age'], 'age'));
				$selectConditionList.find('li').each(function(index, item) {
					$(item).removeClass('active');
				});
				infoBag['age'] = [];
				$selectAll.html('全选');
			}
		}

	});

	//单击选中或取消

	$selectConditionList.on('click', function(e) {
		var $li = $(e.target);
		var $ul = $li.parent();

		if($ul.attr('data-name') == 'ul-age') {
			if(isHave(infoBag['age'], $li.html())){
				infoBag['age'].push($li.html());
			}
			if(!$li.hasClass('active')) {
				$li.addClass('active');
			}else {
				$li.removeClass('active');
			}
			if(infoBag.func.length < condition.func.length) {
				$selectAll.html('全选');
			}else {
				$selectAll.html('取消');
			}

		}else if($ul.attr('data-name') == 'ul-brand') {

			if($li.hasClass('active')) {
				$li.removeClass('active');
				infoBag['brand'] =[];
			}else {
				$ul.find('li').each(function(index, item) {
					$(item).removeClass('active');
				});
				infoBag['brand'] = [$li.html()];
				$li.addClass('active');
			}

		}else if($ul.attr('data-name') == 'ul-func') {

			if(isHave(infoBag['func'], $li.html())){
				infoBag['func'].push($li.html());
			}
			if(!$li.hasClass('active')) {
				$li.addClass('active');
			}else {
				$li.removeClass('active');
			}
			if(infoBag.func.length < condition.func.length) {
				$selectAll.html('全选');
			}else {
				$selectAll.html('取消');
			}
			
		}
	});

	//点击confirm确认按钮提交
	$('.confirm').eq(0).on('click', function() {

		rearchRes = 0;
		$('#wrap-list-tpl').html(' ');	
		$wrapScreen.hide();
		var data = toPost(infoBag, funcCondition);
		skip = 0;
		listData.list = [];
		argu = JSON.stringify(data);
		$loading.open()
		$dropload.stop();
		$('.switch-option-one').removeClass('active');
		$dropload = new DropLoad(function() {
			getConditionList(argu);
		});
		getConditionList(argu);
	});

	//将func处理成数组
	function toArr(obj) {
		var arr = [];
		for(var attr in obj) {
			arr.push(obj[attr]);
		}
		return arr;
	}
	//将选中的数据插入
	function insertData(data, item) {
		var len = data.length;
		var cont = '';
		for(var i = 0; i < len; i++) {
			cont += '<li class="plr12 '+ (isActive(infoBag[item], data[i])?'active':'') +'">' + data[i] + '</li>';
		}
		return cont;
	}
	//插入数据的时候判断该数据是否已经选中过
	Array.prototype.S=String.fromCharCode(2);
	Array.prototype.in_array=function(e){
	    var r=new RegExp(this.S+e+this.S);
	    return (r.test(this.S+this.join(this.S)+this.S));
	};
	function isActive(nowData, data) {
		return (nowData.in_array(data));
	}
	
	//是否选中，选中再次选取删除
	function isHave(data, value) {
		var flag = true;
		data.forEach(function(item, index) {
			if(item == value){
				data.splice(index, 1);
				flag = false;
				return;
			}
		});
		return flag;
	}
	//解析infoBag为post请求参数形式
	function toPost(obj1, obj2) {
		var toBeJson = {};
		if(obj1.age.length != 0) {
			toBeJson.suitableAge = [];
			for(var attr in inforBagTrue['age']) {
				for(var i=0,len=obj1.age.length; i<len; i++) {
					if(inforBagTrue['age'][attr] == obj1.age[i]) {
					toBeJson.suitableAge.push(attr);
				}

				}
			}
		}
		if(obj1.brand.length != 0) {
			for(var attr in inforBagTrue['brand']) {
				if(inforBagTrue['brand'][attr] == obj1.brand[0]) {
					toBeJson.brand = attr;
				}
			}
		}
		if(obj1.func.length != 0) {
			for(var i=0,len=obj1.func.length; i<len; i++) {
				for(var attr in obj2){
					if(obj1.func[i] == obj2[attr]){
						toBeJson['fun.'+attr] = true;
					}
				}
			}
		}
		
		return toBeJson;
	}

	//对象深度克隆
	function deepClone(obj) {
		var o = obj instanceof Array ? [] : {};
		for(var k in obj) 
			o[k] = typeof obj[k] === Object ? deepClone(obj[k]) : obj[k];
		return o;
	}
	//获取参数
	function getQueryStringArgs() {
		var qs = (location.hash.length > 0 ? location.hash.substring(1) : "");
		if(qs == 'beLatest') {
			return "where="+JSON.stringify({"beLatest":true});
		}else if(qs == 'beHot') {
			return "where="+JSON.stringify({"beHot":true});
		}
	}

	//获取筛选条件
	function getCondition(con) {
		$.ajax({
			type: 'GET',
			url: '/datadict/list/' + con,
			contentType: 'application/json',
			success: function(data){
				if(data.code == 200) {
					if(data.data[0].dictType == '功能') {
						data.data.forEach(function(e) {
							condition.func[e.code] = e.dictVal;
						});
						funcCondition = deepClone(condition.func);
						condition.func = toArr(condition.func);
					}else if(data.data[0].dictType == '品牌') {
						data.data.forEach(function(e) {
							condition.brand.push(e.dictVal);
							inforBagTrue.brand[e.code] = e.dictVal;

						});
							
					}else if(data.data[0].dictType == '年龄段') {
						data.data.forEach(function(e) {
							condition.age.push(e.dictVal);
							inforBagTrue.age[e.code] = e.dictVal;
						});
							
					}
				}
			},
			error: function(xhr, type){
				alert('Ajax error!')
			}
		});		
	}
	getCondition('功能');
	getCondition('年龄段');
	getCondition('品牌');
});
