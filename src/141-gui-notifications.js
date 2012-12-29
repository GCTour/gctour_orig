
$.gctour.notification = $.gctour.notification || {};
$.gctour.notification.init = function(){
	
	var $noteBlock = $('<ul>',{
		id: "gctour-notification-box"
	}).appendTo('body');
	
	
	
}

$.gctour.notification.add = function(title, icon, text){
	
	var $note = $('<li>',{
			"class": 'gctour-notification-green',
			click: function(){
					 $(this).animate({height: 0}, 150,"linear",function()
						{
							$(this).remove();
						}
					);
				}
			}
		)
    .disableSelection()
    .append(
			$('<div>',{
				html: "<img style='float:left;' src='"+icon+"'/>"+text,
				css: {
						'font-size': '13px',
						'line-height': '16px',
						'padding': '8px 10px 9px',
						'position': 'relative',
						'text-align': 'left',
						'width': 'auto'
					}
				}
			)
		)
	//~ .prependTo(  $('#gctour-notification-box') ).show("slide", { direction: "down" }, 150);
	//~ .prependTo(  $('#gctour-notification-box') ).show('fast');
	.prependTo(  $('#gctour-notification-box') );
   
   setTimeout(function() {
	  $note.animate({height: 0}, 150,"linear",function()
				{
					$note.remove();
				}
			);
	}, 5000);
};



$.gctour.notification.init();


setTimeout(function() {
	$.gctour.notification.add("GC0815", "http://www.geocaching.com/images/WptTypes/sm/2.gif", "eine test Nachricht!");
	$.gctour.notification.add("GC0815", "http://www.geocaching.com/images/WptTypes/sm/4.gif", "eine zweite test Nachricht!");
}, 500);

setTimeout(function() {
	$.gctour.notification.add("GC0815", "http://www.geocaching.com/images/WptTypes/sm/9.gif", "eine zwasdasdchricht!");
}, 1000);

setTimeout(function() {
	$.gctour.notification.add("GC0815", "http://www.geocaching.com/images/WptTypes/sm/8.gif", "eine zwasdasasdasdht!");
}, 1500);

setTimeout(function() {
	$.gctour.notification.add("GC0815", "http://www.geocaching.com/images/WptTypes/sm/8.gif", "eine zwasdasasdasdht!");
}, 5500);

setTimeout(function() {
	$.gctour.notification.add("GC0815", "http://www.geocaching.com/images/WptTypes/sm/8.gif", "eine zwasdasasdasdht!");
}, 6500);

setTimeout(function() {
	$.gctour.notification.add("GC0815", "http://www.geocaching.com/images/WptTypes/sm/8.gif", "eine zwasdasasdasdht!");
}, 7500);

