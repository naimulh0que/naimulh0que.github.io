
$("a").click(function() {
	id = $(this).attr('id')
	div_id = '#'+id+'_div'
	$(".section").hide()
    $(div_id).show()
});