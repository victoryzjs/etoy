/**
 * @require ../../common/css/base.css
 * @require ../../common/css/common.css
 * @require ../../common/css/common_list.less
 * @require ../../lib/zepto.js
 * @require ../../lib/fastclick.js
 */


$(function() {
	$.ajax({
		type: 'POST',
		url: '/good/find?where='+encodeURI(JSON.stringify({ "title": { "like": "%f%" }})),
		contentType: 'application/json',
		success: function(data){
			if(data.code == 234) {
				location.href = data.directUrl;
			}
		},
		error: function(xhr, type){
			alert('Ajax error!')
		}
	})
});