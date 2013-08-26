
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
  }, 6000);

};

$.gctour.notification.init();

/* TEST AREA BEGIN */
if (DEBUG_MODE){

  var dummyNote = [
    {title:"test",icon:"http://www.geocaching.com/images/WptTypes/sm/2.gif",text:"1. eine test Nachricht!",style:"yellow"},
    {title:"test",icon:"http://www.geocaching.com/images/WptTypes/sm/3.gif",text:"2. eine test Nachricht! mit längeren Text",style:"red"},
    {title:"test",icon:"http://www.geocaching.com/images/WptTypes/sm/4.gif",text:"3. eine test Nachricht! mit wirlich sehr langem langem Text, oder ?",style:"blue"},
    {title:"test",icon:"http://www.geocaching.com/images/WptTypes/sm/2.gif",text:"4. eine test Nachricht!"}
  ],
  dummyNoteZaehler = 0,
  dummyNoteLength = dummyNote.length,
  dummyNoteInterval,

  foo = function() {
    if ((0 <= dummyNoteZaehler ) && (dummyNoteZaehler <= dummyNote.length)) {
      $.gctour.notification.add( dummyNote[dummyNoteZaehler] );
    }
    dummyNoteZaehler ++;
    if (dummyNoteZaehler >= dummyNoteLength) {
      clearInterval(dummyNoteInterval);
      dummyNoteZaehler = 0;
    }
  };

  $('#ctl00_HDHomeLink').hover(function(){
    clearInterval(dummyNoteInterval);
    dummyNoteZaehler = 0;
    dummyNoteInterval = window.setInterval(foo, 500);
  });

}
/* TEST AREA END */
