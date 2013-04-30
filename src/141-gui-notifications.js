
$.gctour.notification = $.gctour.notification || {};
$.gctour.notification.init = function(){
  
  var $noteBlock = $('<ul>',{
    id: "gctour-notification-box"
  }).appendTo('body');
  
  
  
}




$.gctour.notification.add = function(options){
  
  
  //~ var content = (options.title != null)?:"nix title"s;
  var content = (options.title)? "<b>"+options.title+"</b><br/>":"";
      content += (options.icon)? "<img style='float:left;'src='"+options.icon+"'/>":"";
      content += (options.text)? options.text:"";

  var $note = $('<li>',{
      "class": "gctour-notification-"+((options.style)?options.style:"green"),
      click: function(){
           $(this).animate({height: 0}, 300,"linear",function()
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
        css: {
            'font-size': '13px',
            'line-height': '16px',
            'padding': '8px 10px 9px',
            'position': 'relative',
            'text-align': 'left',
            'width': 'auto'
          }
        }).append(
          $("<img>", {
            "src": $.gctour.img.gctourLogo,
            css: {
              'float': 'left'
            }
          }),
          $('<div>', {
            html: content
          })
        )
      )
    
  //~ .prependTo(  $('#gctour-notification-box') ).show("slide", { direction: "down" }, 150);
  //~ .prependTo(  $('#gctour-notification-box') ).show('fast');
  .prependTo(  $('#gctour-notification-box') );
   
   setTimeout(function() {
    $note.animate({height: 0}, 300,"linear",function()
        {
          $note.remove();
        }
      );
  }, 500000);
};



$.gctour.notification.init();

$('#ctl00_HDHomeLink').hover(function(){
        

  $.gctour.notification.add({title:"test",icon:"http://www.geocaching.com/images/WptTypes/sm/2.gif",text:"eine test Nachricht!",style:"yellow"});
  $.gctour.notification.add({title:"test",icon:"http://www.geocaching.com/images/WptTypes/sm/2.gif",text:"eine test Nachricht!",style:"red"});
  $.gctour.notification.add({title:"test",icon:"http://www.geocaching.com/images/WptTypes/sm/2.gif",text:"eine test Nachricht!",style:"blue"});
  $.gctour.notification.add({title:"test",icon:"http://www.geocaching.com/images/WptTypes/sm/2.gif",text:"eine test Nachricht!"});
  
  });
/*
for(int k = 0; k < 20; k++){
  $.gctour.notification.add("GC0815", "http://www.geocaching.com/images/WptTypes/sm/2.gif", "eine test Nachricht!");
  
}


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

*/
