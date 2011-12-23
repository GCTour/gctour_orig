/**
 * 
 */

$(document).ready(function() {
	var donate = $("#donate")
	var timeOutDonate;
	$(donate).hover(function() { //when mouse hovers in
		donate.animate({
			marginLeft : "0px"
		}, 500);

		clearTimeout(timeOutDonate);
	}, function() { //when mouse hovers out
		
		timeOutDonate = setTimeout(function(){ // hide the donate div after 1sec
			donate.animate({
				marginLeft : "-180px"
			}, 1000);			
		}, 1000);
		
	});
	
	
	$("#donate_button").hover(function() { //when mouse hovers in
		$("#smilie").attr('src','/i/signal_laugh.gif');
	}, function() { //when mouse hovers out		
		$("#smilie").attr('src','/i/signal_sad.gif');		
	});
	
	
	
	
});


