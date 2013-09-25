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
"ul {"+
"    list-style-type: disc;"+
"}"+
"ul, ol {"+
"    padding-left: 1.5em;"+
"    margin-bottom: 0.5em;"+
"    margin-left: 1.5em;"+
"}"+
      "");

    function getSync(url, data){
      data = data || "";
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
        url = "http://send2.cgeo.org/add.html",
        //url = "http://send2.cgeo.org/device.html", // TEST exception

        $pBar = $( "#gctour_send2cgeo_progressbar" ),
        $btn  = $( "#btnSend2cgeo" ),

        txtReg = "Register first!", // möglicher response wenn der Browser noch nicht registriert ist
        txtSuc = "Success!",        // möglicher response wenn das hinzufügen erfolgreich war
        waitTime = 1500;            // warten zwischen den urls, Millisekunden

    // IDs only to array
    cacheIDs = $.map(caches, function(n, i){
      return (n.id);
    });

    $pBar.progressbar( "option", "value", 0 );

    log("START: " + currentTime() + " => " + cacheIDs.join(","));

    $btn.addClass("hide");
    $pBar.removeClass("hide");

    // sendet die url, wartet dann um die function erneut aufzurufen
    // vererbte Variablen
    // group, cachesCount, cacheIDs, url
    // $pBar, txtReg, txtSuc, waitTime
    function sendRequests(fromPos) {

      var toPos = fromPos + group,
        param = "",
        res = "",
        boo = true;

      // toPos darf nicht größer sein als die Liste
      toPos = (toPos > cachesCount) ? cachesCount : toPos;

      param = cacheIDs.slice(fromPos, toPos).join(",");
      log("1: " + currentTime());

      // eins nach dem anderen, response abwarten
      res = getSync(url + "?cache=" + param);
      $pBar.progressbar( "option", "value", toPos );

      //get(url + "?cache=" + param, function(){});   // alles wird ohne pause abgefeuert (in while) = nicht erwünscht
      log("2: " + currentTime());

      // responseText to XML ?
      //$body = $( $.parseXML( res ) ).find( "body" );

      if (res.indexOf(txtReg) !== -1) {  // Browser nicht registriert
        boo = false;
        alert("Browser not registred, Register first !");
        $pBar.addClass("hide");
        $btn.removeClass("hide");
      } else if (res.indexOf(txtSuc) === -1) {  // response nicht okay (Cache konnte wahrscheinlich nicht hinzugefügt werden)
        boo = false;
        alert("no success, error when adding");
        $pBar.addClass("hide");
        $btn.removeClass("hide");
      }

      log( res ); // send2.cgeo.org/add.html?cache=GC4924F
      fromPos = toPos;
      log("next Pos: " + fromPos);
      if (cachesCount > fromPos && boo) {
        setTimeout(sendRequests, waitTime, fromPos);
        //sendRequests(array, nextPos);
      }

    };

    if (cachesCount > 0) {
      setTimeout(sendRequests, waitTime, 0);
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

    if (!DEBUG_MODE) { return; }

    var $content = $('<div id="dlgsendtocgeo">'+
      '<div>'+
        '<strong>send to c:geo</strong>'+
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

          '<li>Start c:geo.</li>'+
          '<li>Optional: Stored -> Menu -> List -> ...</li>'+
          '<li>Finally: Stored -> Menu -> Manage -> Import from web</li>'+

          '<li><button id="btnSend2cgeo">' + $.gctour.lang('send2cgeo') + ' (' + currentTour.geocaches.length + ' Caches)</button><div id="gctour_send2cgeo_progressbar" class="hide"></div></li>' +

        '</ol>'+
      '</div>'+
    '</div>');

    var $overLay = $content.dialog(
      $.gctour.dialog.basis(),
      {
        title: "send from GCTour to c:geo",
        autoOpen: true,
        height: 530,
        create: function( event, ui ) {
          var $thisDlg = $(this).dialog("widget"),
            $progressbar = $thisDlg.find( "#gctour_send2cgeo_progressbar" );

          $thisDlg.find("input[type=submit], button").button();

          $progressbar.progressbar({
              value: false,
              max: currentTour.geocaches.length,
              change: function(e, ui) {
                var $pBar = $( this ),
                  value = $pBar.progressbar( "value" ),
                  max = $pBar.progressbar( "option", "max" );

                $pBar.find( ".ui-progressbar-value" ).text(value + " / " + max);
              },
              complete: function() {
                var $t = $( this ).find( ".ui-progressbar-value" );
                $t.text( $t.text() + " Complete!" );
              }
          });

          $thisDlg.find("#btnSend2cgeo").on('click', {}, function(e){
            send2cgeo();
          });

        }
      }
    );

  };

/*
 * BETA end GcTour send2cgeo
*/
