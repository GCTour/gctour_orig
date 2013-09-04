/*
 * BETA begin GcTour send2cgeo
*/

  GM_addStyle(""+
      "#gctour_send2cgeo_progressbar {"+
      "  margin: 2px 0;"+
      "}"+
      ""+
  ".hide {"+
      "  display: none;"+
      "}"+
  ".ui-progressbar {"+
      "  position: relative;"+
      "}"+
      ""+
      ".ui-progressbar-value {"+
      //"  position: absolute;"+
      //"  left: 0;"+
      //"  width: 100%;"+
      //"  font-weight: bold;"+
      "  text-align: center;"+
      //"  text-shadow: 1px 1px 0 #fff;"+
      //"  background-color: transparent;"+
      "}"+
      "ol li {"+
      "  padding: 2px;"+
      "}"+
      "");

    function getSync(url, data){
        log([
        "---GET SYNCHRON---",
        "\turl: " + url,
        "\tdata: " + data,
        "---/GET SYNCHRON/---"
      ].join("\n"));

      log("getSync1: " + currentTime());

      var result = GM_xmlhttpRequest({
        method: "GET",
        url: url,
        headers:{'Content-type':'application/x-www-form-urlencoded'},
        data:encodeURI(data),
        synchronous:true
      })
      .responseText;

      log("getSync2: " + currentTime());

      return result;
    }

   function currentTime() {
     var cD = new Date();
     return (cD.getHours() + ":" + cD.getMinutes() + ":" + cD.getSeconds() + "." + cD.getMilliseconds());
   }

   function send2cgeo() {

     var cacheIDs = [],
        caches = currentTour.geocaches,
        cachesCount = caches.length,

        group = 1, // wieviel IDs sollen gleichzeitig übertragen werden
        start = 0,
        end = 0,
        param = "",
        url = "http://send2.cgeo.org/add.html",
        //url = "http://send2.cgeo.org/device.html", // TEST exception
        res = "",
        boo = true,

        $pBar = $( "#gctour_send2cgeo_progressbar" ),
        $btn  = $( "#btnSend2cgeo" ),

        txtReg = "Register first!",
        txtSuc = "Success!";

    // IDs only to array
    cacheIDs = jQuery.map(caches, function(n, i){
      return (n.id);
    });

    log(cacheIDs.join(","));
    log("START: " + currentTime());

    $btn.addClass("hide");
    $pBar.removeClass("hide");

    while (start < cachesCount && boo) {

      end = start + group;
      if (end > cachesCount) {
        end = cachesCount;
      }

      param = cacheIDs.slice(start, end).join(",");
      log("1: " + currentTime());

      // eins nach dem anderen
      res = getSync(url + "?cache=" + param, "");
      $pBar.progressbar( "option", "value", end );

      //get(url + "?cache=" + param, function(){});   // alles wird gleich abgefeuert = nicht erwünscht
      log("2: " + currentTime());

      // responseText to XML ?
      //$body = $( $.parseXML( res ) ).find( "body" );

      if (res.indexOf(txtReg) !== -1) {
        boo = false;
        alert("Browser not registred, Register first !");
      } else if (res.indexOf(txtSuc) === -1) {
        boo = false;
        alert("no success, error when adding");
      }

      log( res );
      // send2.cgeo.org/add.html?cache=GC4924F

      start = start + group;
    }

    if (!boo) {
      $pBar.addClass("hide");
      $btn.removeClass("hide");
    }

  }

  $('#gctour_tourHeader').find('.tourImage').eq(2).after(

    // sendcgeo
    $('<img>', {
      'class': 'tourImage',
      src:    "",
      title:  $.gctour.lang('send2cgeo'),
      alt :   $.gctour.lang('send2cgeo'),
      click: function(){
        openGcTour2cgeoDialog();
      }
    })

  );

  var openGcTour2cgeoDialog = function(){

    if (DEBUG_MODE) {

  /*
    $( "<div>TEST HALLO</div>" ).dialog({
      resizable: false,
      height:140,
      modal: true,
      buttons: {
        "Delete all items": function() {
          $( this ).dialog( "close" );
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      }
    });
  */

    var overLay = getOverlay({caption:"send from GCTour to c:geo"});
    overLay.innerHTML = '<div id="dlgsendtocgeo">'+
      '<div>'+
        '<br/><strong>send to c:geo</strong>'+
        '<ul>'+
          '<li><a target="_blank" href="http://send2.cgeo.org/home.html">Overview</a></li>'+
          '<li><a target="_blank" href="http://send2.cgeo.org/howto.html">How To</a></li>'+
        '</ul>'+
      '</div>'+
      '<div>'+
        '<strong>quick steps</strong>'+
        '<ol>'+
          '<li><a href="http://send2.cgeo.org/browser.html" target="_blank" title="http://send2.cgeo.org/browser.html">Register this browser ...</a></li>' +
          '<li>'+
            '<ol style="list-style-type:lower-alpha">'+
              '<li>Run c:geo on your android device and go to settings.</li>'+
              '<li>On the bottom of settings page you can set up your "device name". Afterwards click Request registration.</li>'+
              '<li>If registration is succesful you will get a five digit PIN number.</li>'+
            '</ol>'+
          '</li>'+

          '<li>'+
            '<a href="http://send2.cgeo.org/device.html" target="_blank" title="http://send2.cgeo.org/device.html">Add your device ...</a> and type that PIN into.' +
            '<form name="device" action="http://send2.cgeo.org/pin.html" target="_blank" method="post">'+
              '<label for="pin">quickly and directly from here</label> '+
              '<input name="pin" type="text" value="" />'+
              ' <input name="button" type="submit" value="send PIN and add device" class="button" />'+
            '</form>'+
          '</li>'+

          '<li><button id="btnSend2cgeo">GCTour send to c:geo... (' + currentTour.geocaches.length + ' Caches)</button><div id="gctour_send2cgeo_progressbar" class="hide"></div></li>' +
          '<li>Start c:geo.</li>'+
          '<li>Optional: Stored -> Menu -> List -> New List</li>'+
          '<li>Finally: Stored -> Menu -> Import -> Import from web</li>'+
        '</ol>'+
      '</div>'+
      '<div style="text-align:right; margin-right: 10px;">'+
        '<button id="btnCloseDialog">Close</button>'+
      '</div>'+
    '</div>';


      var progressbar = $( "#gctour_send2cgeo_progressbar" );

      progressbar.progressbar({
          value: false,
          max: currentTour.geocaches.length,
          change: function(e, ui) {
            var $pBar = $( this ),
              value = $pBar.progressbar( "value" ),
              max = $pBar.progressbar( "option", "max" );

            $( ".ui-progressbar-value" ).text(value + "/" + max);
          },
          complete: function() {
            var $t = $( ".ui-progressbar-value" );
            $t.text( $t.text() + " Complete!" );
          }
      });

      $( "input[type=submit], button", $("#dlgsendtocgeo"))
        .button();
        //.click(function( event ) {
        //  event.preventDefault();
        //});

      $("#btnSend2cgeo").bind('click', {}, function(e){
        send2cgeo();
      });

      $("#btnCloseDialog").bind('click', {}, function(e){
        closeOverlay();
      });

    }

  };

/*
 * BETA end GcTour send2cgeo
*/
