
$("a").click(function() {
	id = $(this).attr('id')
	div_id = '#'+id+'_div'
    $('html, body').animate({
        scrollTop: $(div_id).offset().top
    }, 2000);
});