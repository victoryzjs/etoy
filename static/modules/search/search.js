/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../common/css/common_list.less
 * @require ../../lib/zepto.js
 * @require ../../lib/fastclick.js
 */


$(function() {
	$.ajax({
		type: 'GET',
		url: '/good/find?where='+encodeURI(JSON.stringify({ "title": { "like": "%飞%" }})),
		contentType: 'application/json',
		success: function(data){
			alert(data.data[0]);
		},
		error: function(xhr, type){
			alert('Ajax error!')
		}
	})
});