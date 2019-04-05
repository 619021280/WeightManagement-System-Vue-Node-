
$(document).ready(function($){
	
	$('#loginSpan').click(function(){
		$('.loginMask').show();
		$('.loginMask').height($(document).height());
		$('.loginBox').slideDown(200);
	})
	$('.topBox .close').click(function(){
		$('.loginMask').hide();
		$('.loginBox').slideUp(200);
	})

});
$(document).ready(function($){
	$('#signBut').hover(function(){
		$('#loginMainBox').slideUp()
		$('#signMainBox').slideDown()
		$(this).css({"background": "#ccc"})
		$('#loginBut').css({"background": "white"})
		$('#signNicheng').focus()
	})
	$('#loginBut').hover(function(){
		$('#loginMainBox').slideDown()
		$('#signMainBox').slideUp()
		$(this).css({"background": "#ccc"})
		$('#signBut').css({"background": "white"})
	})
})
