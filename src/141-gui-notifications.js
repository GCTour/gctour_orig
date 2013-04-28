
$.gctour.notification = $.gctour.notification || {};

$.gctour.notification.init = function(){

  var $noteBlock = $('<ul>',{
    id: "gctour-notification-box"
  }).appendTo('body');

};

$.gctour.notification.add = function(options){

  //~ var content = (options.title != null)?:"nix title"s;
  var content = (options.icon)? "<img style='float:left;padding-right:6px;'src='"+options.icon+"'/>":"";
      content += (options.title)? "<b>"+options.title+"</b><br/>":"";
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
    })
    .disableSelection()
    .append(
      $('<div>',{
        html: content,
        css: {
          'font-size': '13px',
          'line-height': '16px',
          'padding': '8px 10px 9px',
          'position': 'relative',
          'text-align': 'left',
          'width': 'auto'
        }
      })
    )
  //~ .prependTo(  $('#gctour-notification-box') ).show("slide", { direction: "down" }, 150);
  //~ .prependTo(  $('#gctour-notification-box') ).show('fast');
  .prependTo(  $('#gctour-notification-box') );

   setTimeout(function() {
    $note.animate({height: 0}, 600, "linear", function()
      {
        $note.remove();
      }
    );
  }, 30000);

};

$.gctour.notification.init();

$('#ctl00_HDHomeLink').hover(function(){

  $.gctour.notification.add({title:"test",icon:"http://www.geocaching.com/images/WptTypes/sm/2.gif",text:"eine test Nachricht!",style:"yellow"});
  $.gctour.notification.add({title:"test",icon:"http://www.geocaching.com/images/WptTypes/sm/3.gif",text:"eine test Nachricht! mit längeren Text",style:"red"});
  $.gctour.notification.add({title:"test",icon:"http://www.geocaching.com/images/WptTypes/sm/4.gif",text:"eine test Nachricht! mit wirlich sehr langem langem Text, oder ?",style:"blue"});
  $.gctour.notification.add({title:"test",icon:"http://www.geocaching.com/images/WptTypes/sm/2.gif",text:"eine test Nachricht!"});

});
