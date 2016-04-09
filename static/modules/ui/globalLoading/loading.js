module.exports = {
	close: function() {
		setTimeout(function() {
			$('#loading').animate({
				opacity: 0
			}, 400, function() {
				$(this).hide();
			});
		}, 1000)
	}
} 	