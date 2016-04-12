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
			url: '/good/570a639a2a3178482c5251a9',
			contentType: 'application/json',
			dataType: 'json',
			success: function(data){
				console.log(data);		
			},
			error: function(xhr, type){
				alert('Ajax error!')
			}
		})
});