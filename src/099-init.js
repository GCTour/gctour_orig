// init core variables
function initCore(){
  debug("Start: init_core()");

  // setting up the language (style from 10.2011)
  var l = GM_getValue('language',$.gctour.defaultLang);

    // ToDO: switch in der "übernächsten" Veröffentlichung wieder entfernen !
    // Nur um ggf. von alter zur neuer Version zu wechseln
    // START: switch from old to new style
    if (typeof(l) === "number") {
      l = ['de','en','fr','nl','pt'][parseInt(l, 10)] || $.gctour.defaultLang;
      debug("current language:" + l);
      GM_setValue('language',l);
    }
    // END: switch from old to new style

  $.gctour.currentLang = l;

  // getting all tours
  tours = loadValue('tours',[]);

  //eval(GM_getValue('tours',[]));
  // structur a tour:
  // id     <--- int
  // name   <--- string
  // caches   <--- caches

  // go get the current tour from the tour list
  currentTourId = GM_getValue('currentTour',-1);
  currentTour = getTourById(currentTourId);

  // oh - there is no current tour!? create one!
  if(!currentTour){
    currentTour = {};
    currentTour.id = getNewTourId();
    currentTour.name = "Tour "+currentTour.id;
    currentTour.geocaches = [];
    tours.push(currentTour);
    log("found no currentTour! Creating new one: "+currentTour.id +" ; "+ currentTour.name);
    saveCurrentTour();
  }

  checkOnlineConsistent(currentTour);
}

function init(){
  var i;

  // set Styles (GM_addStyle)
  initStyle();

  // add global styles
  var head  = document.getElementsByTagName('head')[0],
      style = document.createElement('style');

  style.type = 'text/css';

  head.appendChild(style);

  // first filter blacklist
    // process "add to your GCTour"-link from gctour.madd.in
  if(document.URL.search("webcode")>=0) {
    document.title = "GcTour";
    document.getElementsByTagName('body')[0].innerHTML = "<div align='center'><a href='http://www.geocaching.com'><img border='0' src='http://madd.in/icon.png'/></a></div>";
    downloadTourFunction(document.URL.split("webcode/")[1]);

    return;
  }


  // start sepcial script on send-to-gps page
  if(document.URL.search("http://www.geocaching.com/seek/sendtogps.aspx")>=0) {
          // show the GPX box, if the option is set
    if(GM_getValue('showGpx',false)){
      document.getElementById('dataString').parentNode.style.visibility = 'visible';
      document.getElementById('dataString').style.width = '100%';
    }


    // see, whether this windows is opened by the tour or by something else
    var qsParm = [];
    var query = window.location.search.substring(1);
    var parms = query.split('&');
    for (i=0; i<parms.length; i++) {
      var pos = parms[i].indexOf('=');
      if (pos > 0) {
        var key = parms[i].substring(0,pos);
        var val = parms[i].substring(pos+1);
        qsParm[key] = val;
      }
    }


    if(qsParm['tour']){
      sendToGPS();
    }

    return;
  }

  $(window).bind({
    // update the complete gui if the tab gets focus
    'focus': function(e) {
      updateTour();
    },
    'resize': function(e) {
      handleResize(e);
    }
  });

  // process autoTour
  if ( GM_getValue('tq_url') ) {

    // if the cancelbutton is presssed
    if( GM_getValue("stopTask", false) ) {
      GM_deleteValue('tq_url');
      GM_deleteValue('tq_caches');
      GM_setValue('stopTask', false);
      document.location.href = GM_getValue('tq_StartUrl', 'http://www.geocaching.com');
      return; // then return!
    }

    var tq_url = GM_getValue('tq_url');

    if ( tq_url == document.location.href ) {

      addProgressbar( { caption: $.gctour.lang('autoTourWait') } );

      var tq_caches        = loadValue('tq_caches', []),
          tq_typeFilter    = JSON.parse(GM_getValue('tq_typeFilter')),
          tq_sizeFilter    = JSON.parse(GM_getValue('tq_sizeFilter')),
          tq_dFilter       = JSON.parse(GM_getValue('tq_dFilter')),
          tq_tFilter       = JSON.parse(GM_getValue('tq_tFilter')),
          tq_specialFilter = JSON.parse(GM_getValue('tq_specialFilter'));

      var pagesSpan = $("td.PageBuilderWidget > span:first");

      if ( pagesSpan.length <= 0 ) {
        alert("no caches here :-( pagesSpan missing");
        GM_deleteValue('tq_url');
        GM_deleteValue('tq_caches');
        document.location.href = GM_getValue('tq_StartUrl','http://www.geocaching.com');
        return;
      }

      var pagesSpanBolds = $('b', pagesSpan);
      setProgress(
        parseFloat(pagesSpanBolds.eq(1).text()) - 1,
        parseFloat(pagesSpanBolds.eq(2).text()),
        document
      );

      // find all dtsize images and extract the temporary code
      var images_array = $.map($('img[id$="uxDTCacheTypeImage"]'), function(e, i) {
        return $(e).attr("src").split("=")[1].split("&")[0];
      });

      var dtImageQuery = images_array.join("-");

      debug('http://geocaching-ocr.appspot.com/geocachingocr?il=' + dtImageQuery);

      // use the geocaching OCR in the google cloud to find difficulty,terrain and size
      GM_xmlhttpRequest({
        method: 'GET',
        url: 'http://geocaching-ocr.appspot.com/geocachingocr?il=' + dtImageQuery,
        onload: function(responseDetails) {
          var dtsize_details = JSON.parse(responseDetails.responseText);

          var $resultTable = $("table.SearchResultsTable tbody tr:not(:first)");  // without header

           // BEGIN for each cache
          $resultTable.each(function(i, val) {

            var entryTds = $(this).find('td');
            var entry = {};
            var lnk, type, size, difficulty, terrain, pm_only, addBool;

            // RegEx gc-id
            entryTds.eq(5).find("span").eq(1).text().search(/\|\s*GC(\S{2,9})\s*\|/);
            entry.id = "GC" + RegExp.$1;

            lnk = entryTds.eq(5).find("a.lnk:first");
            entry.name = $.trim(lnk.text());

            entry.guid = entryTds.eq(4).find("a:first").attr("href").split('guid=')[1];
            entry.image = entryTds.eq(4).find("img:first").attr("src").replace(/wpttypes\//, "WptTypes/sm/");

            entry.available = (lnk.css('text-decoration') !== "line-through");
            //~ alternativ:   entry.available = (lnk.attr('class') == 'lnk  ');
            //~ alternativ:   entry.available = (!(lnk.hasClass('Strike')));

            type = entry.image.split("/")[6].split(".")[0];
            type = (type == "earthcache") ? 137 : type;

            size = dtsize_details[i].size;

            difficulty = dtsize_details[i].difficulty;
            terrain = dtsize_details[i].terrain;

            // autoTour magic starts here
            // check whether the caches match against the given D/T values
            addBool = tq_typeFilter[type] && tq_sizeFilter[size] && tq_dFilter[difficulty+""] && tq_tFilter[terrain+""];

            debug("##### 1: "+addBool);
            if(tq_specialFilter['is Active']){
              log("Check if " + entry.name + " is active:\n" +
                  "available: " + entry.available);
              addBool = addBool && (entry.available);// only add if active!
            }

            debug("##### 2: "+addBool);
            if(tq_specialFilter['is not a PM cache']){
              pm_only = (entryTds.eq(6).find("img[src$='small_profile.gif']").length > 0);
              addBool = addBool && !pm_only;
            }
              debug("##### 3: "+addBool);
            // autoTour parameter "haven't found" is not checked here because of URL parameter

            /*
            // Alle Geocaches die von madd.in gefunden wurden. Damit wir autoTour auch mit meinem Zweitaccount brauchbar ;-)
            var maddinGeocaches =["1T51H", "1QC72", "1KARH", "1RBBE", "1PEBN", "1FAYJ", "1ERQE", "1F093", "1EWH4", "1C068", "1R91D", "1PPZG", "1BXA7", "1PYPN", "1FEJD", "14PB1", "KARW", "1BX9N", "14743", "1NXG0", "1Q0NA", "1PN3W", "1PY8K", "1NWE0", "1D6KQ", "1NQAF", "YN3G", "MFTR", "1QH9J", "VT7D", "XBMV", "14FEY", "ZQ1V", "1Q0NW", "1QHKE", "1PDA5", "1Q59B", "1Q49G", "1JB9B", "1HBFF", "1G8VV", "1P4XG", "13481", "15GZT", "16H37", "1HBPR", "1Q5PP", "1ND1A", "ZVG5", "Y7VH", "MJ4W", "WJQ4", "ZQJX", "16FR7", "N8A1", "VAD4", "1NKEZ", "1NFFK", "1JQYH", "1ABRC", "1HH3Q", "1JZGF", "1KF0E", "1NDBF", "1MEYF", "1H76A", "1MG3M", "1NBF8", "1FNGG", "1JZB6", "156F9", "1HWPZ", "11J9Y", "N9EM", "17QZ6", "1EBQY", "YKV0", "15TH0", "H73R", "1MM0F", "19T6R", "1K40H", "1AXVX", "14TP0", "12AQP", "VEAJ", "VE84", "1K9V0", "1MY7K", "1N4JH", "1HGQJ", "1JNP2", "1GD3Z", "1MZVZ", "1KWJC", "1MY1P", "1M0X6", "VCF4", "1M9B8", "1KFC1", "1MMWC", "1KYY7", "1G24R", "1J3A8", "QVGP", "1JTTV", "1J9CA", "1FBWT", "K2HZ", "T47Y", "TAX8", "1J6EB", "1JBAD", "MG58", "19FVE", "16F7N", "1K5D3", "1EAD8", "1K1DD", "XDFK", "NA43", "1DBT8", "1DHNR", "1HH26", "KCHR", "1JKZY", "1JW04", "1J1NB", "1D1XY", "1D29W", "1H2R5", "18M3W", "175F8", "1HJ75", "192CY", "1G9BB", "12C2Z", "N2EN", "ZH3N", "19PKN", "1HE9P", "1FVM4", "18V3Q", "16YH5", "1H3FF", "14PCD", "YK51", "N5DM", "1E43W", "TYEQ", "1FAAK", "1FAAF", "1E7NC", "NXYZ", "18P9K", "17ZCN", "VD4E", "1G7QA", "15J88", "RBQQ", "QQJ4", "1EVRW", "1FFJC", "GNCW", "16PMP", "10ZXY", "15J2W", "15J2C", "139YE", "WDME", "1GCZK", "15CFG", "18P9D", "HX0H", "TJMM", "VNRV", "VEA0", "TRKC", "1F53F", "1BK3B", "159MQ", "1196K", "RHX3", "T5KW", "TN4A", "WZXA", "RWZW", "12Q9J", "124V4", "1GEMC", "1BGB2", "1BZ0K", "1GAB9", "1CFFQ", "VABH", "131GR", "1FYA3", "1CFG9", "18YF8", "18CJF", "16EB4", "Q139", "17VHA", "1A75J", "N0V3", "YK2K", "QYRJ", "10P4G", "127K5", "11Z8Q", "RCG5", "127GA", "127G6", "127G3", "127G0", "127FZ", "1DG6G", "1DF0X", "127GC", "127FQ", "127FF", "11V8A", "1CGR0", "1CGR4", "PH47", "1FJJ5", "1DZ3J", "WDKY", "174BB", "WDKP", "ZAGR", "WDK6", "N9VG", "10A44", "10A4B", "10CCH", "10A3X", "XDT0", "10A59", "XDRN", "X1JQ", "ZAGE", "XDRK", "X1JN", "XDR8", "X1JM", "X1JC", "XDR0", "1FGVX", "17QR6", "1DFZE", "1D0WW", "17T06", "17QR8", "1EACF", "15YA3", "1DKWQ", "15DEZ", "17PXH", "11YRW", "16F6Z", "WDKH", "12WMX", "QV1Y", "1BKQ4", "1DFE4", "1FFX8", "13A0N", "13F65", "1F9AW", "1CFFK", "12Y3V", "T61B", "1BZ1A", "13DV5", "1DG4E", "1DTV2", "1A7B3", "NDZ7", "V9CN", "1C6G6", "WDMD", "RY5V", "RB1Z", "1F9BF", "114WA", "11H5X", "198WY", "110E9", "10R03", "198WJ", "119AZ", "198XD", "19ERD", "11GKY", "1119C", "115BG", "117N1", "114XB", "10R0V", "10NRF", "138TN", "114JE", "11H45", "10QE3", "1BEA6", "138VM", "129Q4", "1AHPR", "1AHPA", "12ATD", "152KC", "P4XY", "TGWP", "15EAD", "1752N", "1BZAA", "P6D2", "136WW", "GM8H", "19BMX", "19BN3", "1AQ1A", "V3TN", "JA2E", "V5RZ", "1CWT3", "NCQY", "G6HQ", "14MBG", "XKBE", "MBFQ", "NK7D", "1C7FC", "QJ7J", "1A4PW", "1DRY7", "1C9VC", "J41M", "148VH", "14GD2", "1E8NM", "1F0JB", "YJ6M", "H8GZ", "144K5", "GHRQ", "V5PW", "1B0X6", "10V62", "1D5Q8", "168N5", "1A3X8", "YZTQ", "WDMC", "119VP", "QJHK", "1DCK5", "VDPM", "126G2", "T05X", "WDM9", "R9AH", "M80P", "1D6JZ", "1212Y", "QJHK", "1D8KX", "R4DE", "192DY", "10W9R", "1BAZ8", "ZR4C", "ZDPG", "11CQM", "16AVV", "YN3W", "11E5N", "QZFE", "R8ZN", "12Y7J", "YN56", "R9K2", "M44T", "GJY9", "192DV", "XK6Z", "QEA3", "15E9W", "15EA7", "1548J", "19RN7", "1CFG1", "16V5D", "15361", "14F38", "W1KT", "V5RD", "1C28J", "1AYXM", "1BGH9", "1BKM3", "TH0V", "1D5Q7", "1BRJQ", "H0DN", "J698", "18HKA", "1D48Y", "WBWM", "RQBQ", "W4G8", "19680", "ZDQK", "ZG48", "PHW4", "XZF5", "XZF8", "XZFC", "12WDT", "12VTN", "XZVB", "1CGR3", "1CGR1", "1CDV1", "1CDTQ", "150J6", "18AGZ", "19Q5V", "TKJ9", "VCVR", "11RBJ", "18VY2", "1BR9E", "191R9", "R18H", "19ED2", "14HQV", "1BAX9", "11MMP", "P5ZQ", "11RWF", "12B6H", "1598X", "1753H", "NFQ9", "NFQ4", "NGA0", "11YNV", "157VV", "10K61", "188J0", "WH9Y", "164A9", "MCH7", "M6KY", "T02D", "M6KX", "18QR8", "QXC3", "Q2VP", "185RY", "RB1V", "VAHD", "YVN2", "Z38V", "Z36X", "Z0GC", "Z0F7", "W6Y9", "ZRW9", "RXG9", "1BE4G", "R4HF", "NRGM", "13R1A", "1AWNW", "19PFG", "TGTX", "J7JT", "1B3DF", "1823H", "11E4K", "W5A2", "WPHE", "ZYF2", "1AHC2", "YHMJ", "N978", "131XN", "Y3W1", "YN8Y", "14KH4", "1593G", "17VHK", "17VH9", "ZHTP", "17VHE", "14WQJ", "1C01D", "17Q2X", "Y3TG", "Y3VN", "Y3VW", "PXJE", "131X0", "175YQ", "RB1T", "1AACB", "1AJVT", "QMYK", "QMYH", "14GT5", "QPG5", "14GTC", "14BJ5", "14CBR", "NXCA", "VPWF", "W546", "A9B5", "ZDN2", "NXDE", "18NJX", "19EAE", "193B9", "VK0B", "17MXT", "YK33", "16AY3", "14PCG", "13BMK", "15EK7", "175EV", "1A761", "VE2G", "WPNA", "15HF9", "16AW0", "XYHG", "10EBJ", "157XG", "1140G", "ZMWT", "15HEX", "17DP9", "ZMX1", "WHA2", "1264X", "14G1N", "17MXM", "WDMB", "N95X", "190R1", "142C8", "10Q97", "129Q2", "1A20K", "1A20R", "193FE", "12C3N", "12AZ2", "198XZ", "110ER", "11H64", "121GE", "10C4W", "11H4F", "11GMJ", "11XG9", "16D4Z", "121KT", "13C49", "VADH", "16CYR", "NCQZ", "13ZG7", "H28R", "NWHN", "NW4V", "RNDH", "MKV3", "195TN", "R179", "18DMK", "W98A", "X20D", "VWZQ", "NQVT", "1207T", "151M6", "XHJN", "113EJ", "110F7", "18V7G", "W0Q2"];

            for(var maddinI = 0; maddinI < maddinGeocaches.length; maddinI++){
              if("GC"+maddinGeocaches[maddinI] == entry.id){
                addBool = false;
                break;
              }
            }
            */

            // if all parameters match - add the cache
            if(addBool){
              tq_caches.push(entry);
            }

            debug(entry.id + " " + entry.name +
              "\n\tvalue:" + type + " filter:" + tq_typeFilter[type] +
              "\n\tvalue:" + size + " filter:" + tq_sizeFilter[size] +
              "\n\tvalue:" + difficulty + " filter:" + tq_dFilter[difficulty + ""] +
              "\n\tvalue:" + terrain + " filter:" + tq_tFilter[terrain + ""] +
              "\n\tavailable:" + entry.available +
              "\n\tpm only:" + pm_only +
              "\n\t ==> Add to tour: " + addBool);

          }); // END for each cache

          GM_setValue('tq_caches', JSON.stringify(tq_caches));

          var gcComLinks = $("td.PageBuilderWidget > a", document),
              nextLink   = false;

          // next Link finden
          gcComLinks.each(function(index) {
            if($(this).html() == "<b>&gt;&gt;</b>") {
              nextLink = gcComLinks.eq(index + 1);
              return false; // each schleife verlassen
            }
          });

          // check if there are some caches on this page (next link is not there)
          if(!nextLink){
            alert("no caches here :-(");
            GM_deleteValue('tq_url');
            GM_deleteValue('tq_caches');
            document.location.href = GM_getValue('tq_StartUrl', "http://www.geocaching.com");
            return;
          }

          // action finden aus next link
          var action = (nextLink.attr("href")) ? nextLink.attr("href").split("'")[1] : false;
          if(action){
            var u = 500,
                l = 2000,
                waitingTime = Math.floor( ( Math.random() * (u - l + 1) ) + l);
            // wait between 0.5 -> 2 seconds to do the next request
            window.setTimeout(function(){
              unsafeWindow.__doPostBack(action, '');
            }, waitingTime);
          } else {

            currentTour = {};
            currentTour.id = getNewTourId();
            currentTour.name = "autoTour " + currentTour.id;
            currentTour.geocaches = tq_caches;
            tours.push(currentTour);
            log("autoTour done - create new Tour: " + currentTour.id + " ; " + currentTour.name);
            saveCurrentTour();

            document.location.href = GM_getValue('tq_StartUrl', "http://www.geocaching.com");
          }

        } // end ONLOAD
      });
      return;
    } else {
      GM_deleteValue('tq_url');
      GM_deleteValue('tq_caches');
    }
  }

  // maps - map/default.aspx
  if(document.URL.search("\/map\/")>=0) {

     $("<div>",{
      "class": "header",
      "css": {
        'width': 100,
        'height': 30,
        'margin-top': 10,
        'overflow': "hidden",
        'border-radius': 5,
        'background-color': "#FFF",
        'border': "4px solid #999",
        'cursor': 'pointer',
        'float': 'right'
      },
      "html": $("<h1>", {
        "css": {'padding': 0},
        click: function(e) {
          var gooMap = getMapCenterAndRadius();
          showAutoTourDialog(gooMap.center, gooMap.radius);
        },
        "html": $("<img>", {
          "src": mapToAutoTour
        })
      })
      .hover(
        function(){ $(this).css({'backgroundColor': 'orange'}); },
        function(){ $(this).css({'backgroundColor': '#B2D4F3'}); }
      )
    }).prependTo($(".ui-block-a", "header:first"));

    // ToDo: Template erweitern bzw. anpassen mit Add2Tour Button
    $('#cacheDetailsTemplate').text(
      function(index, text) {
        var tmpAddToTour = '{{#if $ctx.userIsLoggedIn() }}'+
        '<a class="lnk" href="javascript:add2tour();">'+
          '<img src="'+addToTourImageString+'">&nbsp;<span>'+$.gctour.lang('addToTour')+'</span>'+
        '</a>';
        return text.replace(/\{\{\#if \$ctx.userIsLoggedIn\(\) \}\}/g, tmpAddToTour);
      }
    );

    unsafeWindow.add2tour = function(){
      setTimeout(function() {
        var gccode         = $('#gmCacheInfo div[class="code"]:visible:first').text().trim();
        var name           = $("#gmCacheInfo a[href*='cache_details.aspx']:visible:first").text().trim();
        var guid           = getUrlVars($("#gmCacheInfo a[href*='/seek/log.aspx?guid']:visible:first").attr("href"))["guid"];

        var imageUrl       = $("#gmCacheInfo img[src*='http://www.geocaching.com/images/WptTypes/sm/']:visible:first").attr("src");
        var imageUrlArr    = imageUrl.split('/');
        var cacheTypeImage = imageUrlArr[imageUrlArr.length-1];
        // alternativ imageUrl.substring(imageUrl.lastIndexOf('/') + 1) oder imageUrl.split('/')[imageUrl.split('/').length-1]

        debug("map add2tour: gccode:'" + gccode + "' name:'" + name + "' image:'" + cacheTypeImage + "' guid:'" + guid + "'");
        addElementFunction(gccode, guid, name, cacheTypeImage)();
      }, 0);
    };

    // unsafeWindow.google steht nicht gleich zur Verfügung !
    // ToDo: "unsafeWindow.google".ready function realisieren
    window.setTimeout(function(){
      unsafeWindow.google.maps.event.addListener(unsafeWindow.map, "rightclick", function(event) {
        var lat = event.latLng.lat(),
            lng = event.latLng.lng();

        // populate yor box/field with lat, lng
        // alert("Lat=" + lat + "; Lng=" + lng);
      });
    }, 3000);

  }

  // old maps
  /*
  if($("#cacheListBody").length){

    unsafeWindow.origUpdateSideBarList = unsafeWindow.updateSideBarList;
    unsafeWindow.updateSideBarList = gctourMapFunction;
    unsafeWindow.updateSideBarList();

    // also override the "build discription" function
    unsafeWindow.buildCDPage = gctourBuildCDPage;

    // and the parseCacheJSON function  - not used at the moment!
    //~ unsafeWindow.origParseCacheJSON = unsafeWindow.parseCacheJSON;
    //~ unsafeWindow.parseCacheJSON = gctourParseCacheJSON;
    //~ unsafeWindow.origCreateMarker = unsafeWindow.createMarker;
    //~ unsafeWindow.createMarker = gctourCreateMarker;
  }
  */

  // add buttons to Bookmark site
  if(document.URL.search("\/bookmarks\/view\.aspx")>=0) {
    var k, bookmarkLine, entry;
    var bookmarkLines = $('tr[id$="Row"]'); // id muss mit Row enden

    debug("bookmarkLines.length = " + bookmarkLines.length);

    for(k = 0; k < bookmarkLines.length; k++){
      bookmarkLine = $("td", bookmarkLines[k]);
      entry = getEntryFromBookmarkTd(bookmarkLine);

      $("<img>", {
        "alt": $.gctour.lang('addToTour'),
        "title": $.gctour.lang('addToTour'),
        "src": addToTourImageString,
        "css": {
          "cursor": "pointer",
          "margin": "0 15px 0 0"
        }
      })
      .bind('click', {entry: entry}, function(e){
        addElementFunction(e.data.entry.id, e.data.entry.guid, e.data.entry.name, e.data.entry.image)();
      })
      .appendTo(bookmarkLine[4]);

    }

    // helper function
    var addEntryFromBookmark = function(e) {
      var ck = e.data.checkedOnly || false;
      $.each(e.data.bLs, function(i, v) {
        var bookmarkLine = $("td", v);
        var entry = getEntryFromBookmarkTd(bookmarkLine);
        if ( (entry) && (!ck || (ck && entry.checked)) ){
          addElementFunction(entry.id, entry.guid, entry.name, entry.image)();
        }
      });
    };

    // button to add all caches in list to current tour
    var $divAbuseReport = $('div#ctl00_ContentBody_ListInfo_uxAbuseReport');
    $divAbuseReport.html($.gctour.lang('showCaches'));
    $("<button>", {
      "css": { "margin": 10 },
      "html": "<img src='" + addToTourImageString + "'/>&nbsp;" + $.gctour.lang('addToCurrentTour')
    })
    .bind('click', {bLs: bookmarkLines, checkedOnly: false}, function(e){
      e.preventDefault();
      addEntryFromBookmark(e);
    })
    .appendTo($divAbuseReport);

    // button to add all caches in list to a new tour
    $("<button>", {
      "css": { "margin": 10 },
      "html": "<img src='" + newImageString + "'/>&nbsp;+&nbsp;<img src='" + addToTourImageString + "'/>&nbsp;" + $.gctour.lang('addToNewTour')
    })
    .bind('click', {bLs: bookmarkLines, checkedOnly: false}, function(e){
      e.preventDefault();
      var listName = $("span#ctl00_ContentBody_lbHeading").text();
      if (newTourFunction(listName)() ){
        addEntryFromBookmark(e);
      }
    })
    .appendTo($divAbuseReport);

    // button to add all checked caches in list to current tour
    $("<button>", {
      "html": "<img src='" + addToTourImageString + "'/>&nbsp;" + $.gctour.lang('addMarkedToTour'),
      "css": { "float": "right" }
    })
    .bind('click', {bLs: bookmarkLines, checkedOnly: true}, function(e){
      e.preventDefault();
      addEntryFromBookmark(e);
    })
    .insertAfter($("input#ctl00_ContentBody_ListInfo_btnDownload"));

  }


  // add the buttons to the search table
  //~ var searchResultTable = document.getElementById('ctl00_ContentBody_dlResults');
  //~ if(searchResultTable){
  if(document.URL.search("\/seek\/nearest\.aspx")>=0) {
    var entry_i, entry;
    var entries = getEntriesFromSearchpage();

    // helper function
    var addEntryFromSearchpage = function(e) {
      var i, entry, entries;
      var ck = e.data.checkedOnly || false;
      var nt = e.data.newTour || false; 
      entries = getEntriesFromSearchpage();

      if (!nt || (nt && newTourFunction()())){ // ggf. neue Tour
        for(i = 0; i < entries.length; i++){
          entry = entries[i];
          if ( (entry) && (!ck || (ck && entry.checked)) ){ // alle oder nur ausgewählte
            addElementFunction(entry.id,entry.guid,entry.name,entry.image)();
          }
        }      
      }
    };

    for(entry_i = 0; entry_i < entries.length; entry_i++){
      entry = entries[entry_i];

      $("<img>", {
        "alt": $.gctour.lang('addToTour'),
        "title": $.gctour.lang('addToTour'),
        "src": addToTourImageString,
        "css": {
          "cursor": "pointer",
          "margin": "0 5px 0 0"
        }
      })
      .bind('click', {entry: entry}, function(e){
        addElementFunction(e.data.entry.id, e.data.entry.guid, e.data.entry.name, e.data.entry.image)();
      })
      .appendTo(entry.position);

    }
    
    // buttons to add all caches in list to current and new tour
    $("<div>",{
      "css": { "margin": '10px 0 10px 0' },
      html: $.gctour.lang('showCaches')
    })
    .append(
      // button to add show caches in list to current tour
      $("<button>", {
        "css": { "margin-left": 10 },
        "html": "<img src='" + addToTourImageString + "'/>&nbsp;" + $.gctour.lang('addToCurrentTour')
      })
      .bind('click', {checkedOnly:false, newTour:false}, function(e){
        e.preventDefault();
        addEntryFromSearchpage(e);
      })
    )
    .append(
      // button to add show caches in list to new tour
      $("<button>", {
        "css": { "margin-left": 10 },
        "html": "<img src='" + newImageString + "'/>&nbsp;+&nbsp;<img src='" + addToTourImageString + "'/>&nbsp;" + $.gctour.lang('addToNewTour')
      })
      .bind('click', {checkedOnly:false, newTour:true}, function(e){
        e.preventDefault();
        addEntryFromSearchpage(e);
      })
    )
    .prependTo("div#ctl00_ContentBody_ResultsPanel");

    // buttons to add all checked caches in list to current and new tour
    $("<div>",{
      "css": { 'margin': '2px 0 20px 0' },
      html: $.gctour.lang('markedCaches')
    })
    .append(    
      // button to add all checked caches in list to current tour
      $("<button>", {
        "css": { 'margin-left': 10 },
        "html": "<img src='" + addToTourImageString + "'/>&nbsp;" + $.gctour.lang('addToCurrentTour')
      })
      .bind('click', {checkedOnly:true, newTour:false}, function(e){
        e.preventDefault();
        addEntryFromSearchpage(e);
      })
    )
    .append(    
      // button to add all checked caches in list to new tour
      $("<button>", {
        "css": { 'margin-left': 10 },
        "html": "<img src='" + newImageString + "'/>&nbsp;+&nbsp;<img src='" + addToTourImageString + "'/>&nbsp;" + $.gctour.lang('addToNewTour')
      })
      .bind('click', {checkedOnly:true, newTour:true}, function(e){
        e.preventDefault();
        addEntryFromSearchpage(e);
      })
    )
    .insertAfter($('table.SearchResultsTable:first').next('table'));

  }

  // dont display the list on the sendtogpx page
  if(document.URL.search("sendtogps\.aspx")<=0) {
    initComponents();

    // add the button to the details page
    if(document.URL.search("cache_details\.aspx")>=0) {
      initButton();
    }

    var userLink = $('a.SignedInProfileLink, a.CommonUsername, .LoginUsername'); // default, Challenges + Account + Membership ,Login
    if (userLink) {
      userName = userLink.eq(0).text().trim();
      debug("Username: " + userName);
    } else {
      debug("Username not found");
    }

    if (DEBUG_MODE && console && console.timeEnd) {
      console.timeEnd('gcTour load time');
    }
  }


  // map to autotour button // old map
  var cacheListBounding = document.getElementById('cacheListBounding');
  if (cacheListBounding) {

     $("<div>",{
      "class": "header",
      "css": {
        'width': 100,
        'height': 30,
        'margin': "0 auto",
        'overflow': "hidden",
        'border-radius': 5,
        'background-color': "#FFF",
        'border': "1px solid #999",
        'cursor': 'pointer'
      },
      "html": $("<h1>", {
        "css": {'padding': 0},
        click: function(e) {
          var gooMap = getMapCenterAndRadius();
          showAutoTourDialog(gooMap.center, gooMap.radius);
        },
        "html": $("<img>", {
          "src": mapToAutoTour
        })
      })
      .hover(
        function(){ $(this).css({'backgroundColor': 'orange'}); },
        function(){ $(this).css({'backgroundColor': '#B2D4F3'}); }
      )
    })
    .appendTo($('div#uxPremiumFeatures'));

  }
}
/* END init() */

