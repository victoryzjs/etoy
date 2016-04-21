/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../lib/zepto.js
 * @require ../../lib/fastclick.js
 * @require ../../lib/baiduTemplate.js
 * @require ../ui/dropload/dropload.less
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
	$globalLoading.close();
	$loading.init();

	function getAllList(condition1, id) {
		var condition1 = condition1 ? ('&'+condition1) : '';
		var condition = 'limit=8&skip=' + skip + condition1;
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
					if(data.data.length <= 0) {
						$('.result-null').show();
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
			url: '/good/find?limit=8&skip=' + skip + '&where='+condition,
			contentType: 'application/json',
			success: function(data){
				$('.result-null').hide();
				$loading.close();
				if(data.data.length <= 0) {
					$('.result-null').show();
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
			// item = item + 'where=' + argu;
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

	//筛选数据
	var condition = {
		'age': ['0-6个月（趟着玩）', '6-9个月（学坐爬）', '9-18个月（学走路）', '18-36个月（兴趣发展）', '3岁以上（综合锻炼）'],
		'brand': ['Anpanman面包超人', 'Bright starts美国', 'Btoys美国', 'Chicco智高', 'Evenflo美国', 'Fisher Price费雪', 'Grow up高思维', 'Haba国德', 'Kiddieland童梦圆', 'Leap frog美国跳蛙', 'Lego乐高', 'Little tike小泰克', 'Playskool孩之宝', 'Pororo韩国', 'Radio flyer美国', 'Rastar星辉', 'Simba德国仙霸', 'Step2美国晋阶', 'Toyroyal日本皇室', 'V-tech伟易达', 'Weplay台湾', 'Gonge丹麦', 'Baghera法国', '其他'],
		'func': {
			'fun0': '健身架',
			'fun1': '摇摇椅',
			'fun2': '学爬玩具',
			'fun3': '角色扮演',
			'fun4': '敲弹击琴',
			'fun5': '手工拼插',
			'fun6': '滑梯组合',
			'fun7': '玩沙嬉水',
			'fun8': '学习屋/桌',
			'fun9': '益智玩具',
			'fun10': '学步车',
			'fun11': '手推车',
			'fun12': '电动车',
			'fun13': '滑行车',
			'fun14': '脚踏车',
			'fun15': '感统训练'
		}
	};
	var funcCondition = {};
	funcCondition = deepClone(condition.func);
	condition.func = toArr(condition.func);
	var infoBag = {
		'brand': [],
		'age': [],
		'func': []
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
				$selectAll.html('单选');
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
		$('.select-age span').eq(0).html(infoBag.age[0]?infoBag.age[0]:'选择一项');
		$('.select-brand span').eq(0).html(infoBag.brand[0]?infoBag.brand[0]:'选择一项');
		if(infoBag.func.length != 0){
			var funcHtml = '';
			for(var i=0,len=infoBag.func.length; i<len; i++){
				funcHtml += infoBag.func[i] + ',';
			}
			$('.select-function span').eq(0).html(funcHtml);
		}else {
			$('.select-function span').eq(0).html('选择一项或多个');
		}
		

	});
	//全选
	$selectAll.on('click', function() {
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
	});

	//单击选中或取消

	$selectConditionList.on('click', function(e) {
		var $li = $(e.target);
		var $ul = $li.parent();

		if($ul.attr('data-name') == 'ul-age') {
			if($li.hasClass('active')) {
				$li.removeClass('active');
				infoBag['age'] =[];

			}else {
				$ul.find('li').each(function(index, item) {
					$(item).removeClass('active');
				});
				infoBag['age'] = [$li.html()];
				$li.addClass('active');
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
			toBeJson.suitableAge = obj1.age[0];
		}
		if(obj1.brand.length != 0) {
			toBeJson.brand = obj1.brand[0];
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
});
