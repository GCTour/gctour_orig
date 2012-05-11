function initButton(){

   // if we are on a cache page the buttonGroup != null - so add the 'to tour'-button

  var cacheControl = $("div.CacheInformationTable:first");
  if (cacheControl.length > 0){

    var div_element = createElement('div',{style:"border-top: 1px solid rgb(192, 206, 227);"});
    cacheControl.append(div_element);

    var gcTourFieldset = createElement('fieldset',{style:"background-color: #EFF4F9;border-color: #C0CEE3 !important;margin-top:0;padding: 0.5em;"});
    append(gcTourFieldset,div_element);

    gcTourFieldset.setAttribute('class','dialogFooter');
    gcTourFieldset.innerHTML = "<legend class='note' style='background:url(\""+gctourLogoSmall+"\") no-repeat scroll 0 0 transparent'>GCTour</legend>";

    var newButton = createElement('input',{type:"button",value:$.gctour.lang('addToTour'),style:"float:left;background-image:url("+addToTourImageString+")"});
    append(newButton,gcTourFieldset);

    newButton.setAttribute('onclick','return false;');

    //~ var newButton = document.createElement("button");
    //~ newButton.name = 'btnGPXDL';
    //~ newButton.type = 'submit';
    //~ newButton.innerHTML = "<img src='"+addToTourImageString+"'/>&nbsp;"+$.gctour.lang('addToTour');
    //~ newButton.id = 'btnGPXDL';

    // locate the values and save it
    var minimal_geocache = getMinimalGeocacheDetails(document.getElementsByTagName('html')[0]);
    var cacheId = minimal_geocache.gccode;
    var guidId = minimal_geocache.guid;
    var cacheName = minimal_geocache.name;
    var cacheTypeImage = minimal_geocache.type;

    // on click add an element
    newButton.addEventListener('click', addElementFunction(cacheId,guidId,cacheName,cacheTypeImage), false);

    // add it to the group
    //~ append(newButton,add_button)
    //~ append(newButton,gcTourFieldset)

    // make direct print button
    newButton = createElement('input',{type:"button",value:$.gctour.lang('directPrint'),style:"float:left;background-image:url("+printerImageString+")"});append(newButton,gcTourFieldset);
    newButton.setAttribute('onclick','return false;');

    // on click add an element
    newButton.addEventListener('click', function(){
        var entry = {};
        entry.id = cacheId;
        entry.name = cacheName;
        entry.guid = guidId;
        entry.image = 'http://www.geocaching.com/images/WptTypes/sm/'+cacheTypeImage;


        temp_tour = {};
        temp_tour.name = entry.name;
        temp_tour.geocaches = new Array(entry);

        printPageFunction(temp_tour)();

    }, false);


    append(newButton,gcTourFieldset);


    // change coordinates
    newButton = createElement('input',{type:"button",value:$.gctour.lang('moveGeocache'),style:"float:left;background-image:url(http://www.geocaching.com/images/icons/coord_update.gif)"});append(newButton,gcTourFieldset);
    newButton.setAttribute('onclick','return false;');
    newButton.addEventListener('click', openChangeCoordinates, false);
    append(newButton,gcTourFieldset);


    // update the coordinates if it is already changed:

    if(GM_getValue('coords_'+cacheId,"null") != "null"){
      var coords_cacheId = GM_getValue('coords_'+cacheId);
      changeCoordinates(new LatLon(coords_cacheId.split('#')[0], coords_cacheId.split('#')[1]).toString());
    }

  }
}


// the tour list under main navigation
function initComponents(){

  // gcTour Button +++++++++++++++++++++++++++++++++++
  $("<div>",{
    id: "gctourButtonWrapper",
    "class": "header gctour-grand-default",
    "html":
      $("<img>", {
        "src": gctourLogoSmall
      })
  })
  .hover(
    function(){
      $(this).addClass('gctour-grand-hover');
      $("#gctourContainer").animate({
          left: 0
        }, 500 );
    },
    function(){ $(this).removeClass('gctour-grand-hover'); }
  )
  .appendTo("body");

  // gcTour Container +++++++++++++++++++++++++++++++++++
  $("<div>", {
    id: "gctourContainer",
    "css": {
      left: (sticky) ? 0 : -210
    }
  })
  .hover(
    function(){
      clearTimeout(timeout);
    },
    function(){
      if(!sticky){
        timeout = setTimeout(function(){
          $("#gctourContainer").animate({
            left: -210
          }, 500 );
        }, 1000);
      }
    }
  )
  .appendTo("body");

  var $geocacheList = $('<div>',{
    id: "gctour_geocacheList",
    "css": {
      overflow: 'auto',
      height: '80%',
      width: '100%'
    },
    "html":
      $('<ul>',{
        id: "cacheList",
        'class': 'cachelist'
      })
      .sortable({
        axis: 'y',
        placeholder: 'ui-sortable-placeholder',
        opacity: 0.8,
        revert: true,
        start: function(e, ui) {
          // save old position
          $(this).data('old-pos', ui.item.index());
        },
        stop: function(e, ui){

          // init
          var newPos = ui.item.index();
          var oldPos = $(this).data('old-pos');
          $(this).removeData('old-pos');

          debug("Drag n Drop in progress:\n" +
            "\tMove " + currentTour.geocaches[oldPos].id + "(=" + ui.item.attr('id') + ") from '" + oldPos + "' to '" + newPos + "'");

          // ignore the same position
          if (oldPos === newPos) { return; }

          // determine positions
          var insertPos = (oldPos > newPos) ? newPos : newPos + 1;
          var removePos = (oldPos < newPos) ? oldPos : oldPos + 1;

          // changing the position
          currentTour.geocaches.splice(insertPos, 0, currentTour.geocaches[oldPos]);
          currentTour.geocaches.splice(removePos, 1);

          // ... and save the new tour object
          setTimeout(function() { // hack to prevent "access violation" from Greasemonkey
            saveCurrentTour();
          }, 0);

          return;
        }
      })
      .disableSelection()
  });

  var webcodelink = GCTOUR_HOST+'/tour/'+$.trim(currentTour.webcode);
  var $tourHeader = $("<div>",{
    id: "gctour_tourHeader",
    "css": {
    },
    "html": '<img id="inconsistentTour" src="'+dangerImageString+'" style="float:right;padding:3px;display:none"/>' +
              '<u id="tourName">'+currentTour.name +'</u>&nbsp;<span style="font-size:66%" id="cachecount">('+currentTour.geocaches.length+')</span>' +
              '<span id="webcode" style="display:'+ ((!currentTour.webcode) ? "none" : "inline") + ';"><br/>'+
              'Webcode: <b><a href="'+webcodelink+'" title="'+$.gctour.lang('makeMap')+'" target="_blank">'+currentTour.webcode+'</a></b>&nbsp;</span><br/>'
  });

  $tourHeader.append(

    // rename
    $('<img>', {
      'class': 'tourImage',
      src:    editImageString,
      title:  $.gctour.lang('rename'),
      alt :   $.gctour.lang('rename'),
      click: function(){
        var newTourName = prompt($.gctour.lang('newTourDialog'), currentTour.name);
        if(!newTourName) { return; }
        currentTour.name = newTourName;
        saveCurrentTour();
        updateTour();
      }
    }),

    // print
    $('<img>', {
      'class': 'tourImage',
      src:    printerImageString,
      title:  $.gctour.lang('printview'),
      alt :   $.gctour.lang('printview'),
      click: function(){
        printPageFunction(currentTour)();
      }
    }),

    // sendGPS
    $('<img>', {
      'class': 'tourImage',
      src:    sensGPSImageString,
      title:  $.gctour.lang('sendToGps'),
      alt :   $.gctour.lang('sendToGps'),
      click: function(){
        openSend2GpsDialog();
      }
    }),

    // downloadGPX
    $('<img>', {
      'class': 'tourImage',
      src:    downloadGPXImageString,
      title:  $.gctour.lang('downloadGpx'),
      alt :   $.gctour.lang('downloadGpx'),
      click: function(){
        downloadGPXFunction()();
      }
    }),

    // makeMap
    $('<img>', {
      'class': 'tourImage',
      src:    mapImageString,
      title:  $.gctour.lang('makeMap'),
      alt :   $.gctour.lang('makeMap'),
      click: function(){
        makeMapFunction();
      }
    }),

    // uploadTour
    $('<img>', {
      'class': 'tourImage',
      src:    uploadImageString,
      title:  $.gctour.lang('upload'),
      alt :   $.gctour.lang('upload'),
      click: function(){
        uploadTourFunction(currentTour.id)();
      }
    }),

    // addWaypoint
    $('<img>', {
      'class': 'tourImage',
      src:    plusImageString,
      title:  $.gctour.lang('addOwnWaypoint'),
      alt :   $.gctour.lang('addOwnWaypoint'),
      click: function(){
        showNewMarkerDialog();
      }
    }),

    // deleteTour
    $('<img>', {
      id:      'gctourDeleteButton',
      'class': 'tourImage',
      src:     deleteImageString,
      title:   $.gctour.lang('removeTour'),
      alt :    $.gctour.lang('removeTour'),
      css: {'display' : (tours.length  <= 1) ? 'none' : 'inline'},
      click: function(){
        deleteCurrentTour();
      }
    })

  ).find("img.tourImage").addShadowEffect().addOpacityEffect();

  var $toolbar = $("<div>", {
    id: "gctour_toolbar",
    "css": {
      height: 20,
      '-moz-user-select': "none"
    }
  });

  $toolbar.append(
    // newTourButton
    $('<img>', {
      'class': 'tourImage',
      src:    newImageString,
      title:  $.gctour.lang('newList'),
      alt :   $.gctour.lang('newList'),
      click: function(){
        newTourFunction()();
      }
    }),

    // toggleTourListButton
    $('<img>', {
      'class': 'tourImage',
      src:    openTourImageString,
      title:  $.gctour.lang('openTour'),
      alt :   $.gctour.lang('openTour'),
      click: function(){
        openTourDialog();
      }
    }),

    // downloadButton
    $('<img>', {
      'class': 'tourImage',
      src:    downloadImageString,
      title:  $.gctour.lang('onlineTour'),
      alt :   $.gctour.lang('onlineTour'),
      click: function(){
        downloadTourDialog();
        //~ var webcode = window.prompt($.gctour.lang('webcodePrompt'));
        //~ if(webcode && $.trim(webcode) != ""){
          //~ downloadTourFunction(webcode);
        //~ }
      }
    }),

    // autoTourButton
    $('<img>', {
      'class': 'tourImage',
      src:    autoTourImage,
      title:  $.gctour.lang('autoTour'),
      alt :   $.gctour.lang('autoTour'),
      click: function(){
       // var gooMap = getMapCenterAndRadius();
        showAutoTourDialog();
      }
    }),

    // toggleSettingsButton
    $('<img>', {
      'class': 'tourImage',
      src:    settingsImageString,
      title:  $.gctour.lang('showSettings'),
      alt :   $.gctour.lang('showSettings'),
      click: function(){
        openSettingsDialog();
      }
    }),

    // sendMessageButton
    $('<img>', {
      'class': 'tourImage',
      src:    sendMessageImage,
      title:  $.gctour.lang('sendMessageTitle'),
      alt :   $.gctour.lang('sendMessageTitle'),
      click: function(){
        sendMessageDialog();
      }
    })

  );

  var $header = $("<div>",{
    id: "gctour_header",
    "class": "header gctour-grand-default" + ((sticky) ? " gctour-grand-hover" : ""),
    "css": {
      height: 40,
      'cursor': "pointer",
      '-moz-user-select': "none"
    },
    "html": "<img src='"+gctourLogoImage+"' style='margin: 6px 0 0 6px;'/>" +
            "<img id='gcTourPin' style='float:right;margin: 6px 2px 0 0;' src='" + ((sticky) ? pinned_image : pin_image) + "'>",
    click: function(e) {
      sticky = !sticky;
      GM_setValue('sticky', sticky);
      $("img#gcTourPin").attr("src", ((sticky) ? pinned_image : pin_image) );
    }
  })
  .hover(
    function(){ $(this).addClass('gctour-grand-hover'); },
    function(){
      if (!sticky) {
        $(this).removeClass('gctour-grand-hover');
      }
    }
  );

  var $footer = $('<div>',{
    id: "gctour_footer",
    "css":{
      position: "absolute",
      bottom: 0,
      "font-size": "75%",
      width: "100%",
      height: 14
    },
    "html":
      $("<div>",{
        "css": {
          'width': '100%'
        }
      }).append(
        $("<a>",{
          "css": {
            'padding-left': 5
          },
          href: 'http://gctour.madd.in',
          title: 'http://gctour.madd.in',
          text: 'http://gctour.madd.in'
        })
        .click(function(){
          window.open(this.href);
          return false;
        })
      ).append(
        $("<div>", {
          "css": {
            'float': 'right',
            'margin-right': 5
          },
          "html": "v "+ VERSION + "." + BUILD
        })
      )
  });

  $("#gctourContainer").append(
    $header,
    $toolbar,
    $tourHeader,
    $geocacheList,
    $footer
  );

  // popultate the current list on load
  for (var i = 0; i < currentTour.geocaches.length; i++){
    addNewTableCell(currentTour.geocaches[i],false);
  }

  if(currentTour.geocaches.length <= 0){
    var table = document.getElementById('cacheList');
    table.innerHTML = $.gctour.lang('emptyList');
  }

  //finally: set new heights and layout!
  handleResize();

}

