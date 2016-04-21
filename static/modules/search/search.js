/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../common/css/common_list.less
 * @require ../../lib/zepto.js
 * @require ../../lib/baiduTemplate.js
 * @require ../../lib/fastclick.js
 */


$(function() {
	FastClick.attach(document.body);
	var $globalLoading = require('../ui/globalLoading/loading.js');
	var $prompt = require('../ui/prompt/prompt.js');
	var $loading = require('../ui/loading/loading.js');
	var $searchCont = $('.search-cont input');

	var bt = baidu.template;
	var $searchResultNull = $('.search-result-null');
	$globalLoading.close();
	$loading.init();
	function $ajax(text) {
		$.ajax({
			type: 'POST',
			url: '/good/find?where='+encodeURI(JSON.stringify({ "title": { "like": "%"+text+"%" }})),
			contentType: 'application/json',
			success: function(data){
				$loading.close();
				if(data.msg) {
					$prompt.init(data.msg);
				}
				if(data.code == 234) {
					location.href = data.directUrl;
				}else if(data.data.length == 0) {
					$searchResultNull.show();
					$('.search-result-have').hide();
				}else {
					$('.search-result-have').show();
					var listData = {
						list : data.data
					};
					$('.search-result-have ul').html(bt('list-tpl', listData));
				}
			},
			error: function(xhr, type){
				alert('Ajax error!')
			}
		})		
	}

	$('.search-close').on('click', function() {
		$searchCont.val('');
	});
	$('.search-btn').on('click', function(e) {
		e.preventDefault();
		var cont = $.trim($searchCont.val());
		if(cont.length != 0) {
			$loading.open();
			$searchResultNull.hide();
			$ajax(cont);
		}
	});
});