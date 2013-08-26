// is logged = true : false
function isLogedIn(){
  if(userName){
    return true;
  } else {
    alert($.gctour.lang('notLogedIn'));
    return false;
  }
}

// list is not empty = true : false
function isNotEmptyList(){
  if(currentTour.geocaches.length > 0){
    return true;
  } else {
    alert($.gctour.lang('emptyList'));
    return false;
  }
}


function showGeocacheNotification(geocache,event){
  
  if(event.type == "success"){
    $.gctour.notification.add({
      title: geocache.id+" wurde hinzugefügt!",
      text: currentTour.name+" enthält jetzt auch "+ geocache.name+".",
      icon: geocache.image,
      style: "green"
    });
  } else if(event.type == "contains"){
    $.gctour.notification.add({
      title: geocache.id+" wurde nicht hinzugefügt!",
      text: currentTour.name+" enthält "+ geocache.name+" schon.",
      icon: geocache.image,
      style: "yellow"
    });
  } else {
     $.gctour.notification.add({title:"ERROR",text:"Event '"+event+"' is not supported!",style:"red"});
  }
   

  return;
/*  
    var popup = $("<div>", {
      "class": "gct_popup gctourContainer"
    }).appendTo("body");
  
 
    popup.html("<div class='gctour-grand-default gct_popup_header'>"+geocache.name+"</div>");

    
     //getting height and width of the message box
    var height = popup.height();
    var width = popup.width();
    //calculating offset for displaying popup message
    leftVal=event.pageX-(width/2)+"px";
    topVal=event.pageY-(height/2)+"px";
    //show the popup message and hide with fading effect
  //  popup.css({left:leftVal,top:topVal}).show().fadeOut(1500);
    popup.css({left:leftVal,top:topVal});
    
    setTimeout(function() {popup.fadeOut("slow");}, 1000 );
   
*/
}

function handleResize(e) {
  // Change the height of the container and Cache List
  var container = $(window).height() - 55,
    header      = $("#gctourContainer #gctour_header").height(),  // 40
    toolbar     = $("#gctourContainer #gctour_toolbar").height(), // 20;
    tourheader  = $("#gctourContainer #gctour_tourHeader").height(),
    footer      = $("#gctourContainer #gctour_footer").height(),  // 14;
    minus       = header + toolbar + tourheader + footer,
    cachelist   = container - minus;

  // set the container height
  $('#gctourContainer').css("height", container );

  // set the cachelist height
  $('#cacheList').parent().css("height", cachelist );

  log(
    "handleResize change height:\n" +
    "\tcontainer:  " + container + "\n" +
    "\theader:     " + header + "\n" +
    "\ttoolbar:    " + toolbar + "\n" +
    "\ttourheader: " + tourheader + "\n" +
    "\tfooter:     " + footer + "\n" +
    "\t => cachelist:   " + cachelist
  )
}

function updateGUI(){
  var cacheList, i, table;

  // update the cache count
  updateCacheCount(currentTour.geocaches.length);
  // update tourName
  $("#tourName").html(currentTour.name);

  // update webcode
  var webcode = $("#webcode");

  if(currentTour.webcode){
    webcode
      .find("a:first")
        .attr('href', GCTOUR_HOST+'/tour/'+$.trim(currentTour.webcode))
        .text(currentTour.webcode)
        .end()
      .show();
  } else {
    webcode.hide();
  }

  cacheList = $('#cacheList');
  cacheList.html("");

  // popultate the current list on load
  for (i = 0; i < currentTour.geocaches.length; i++){
    addNewTableCell( currentTour.geocaches[i], false );
  }

  if(currentTour.geocaches.length <= 0){
    cacheList.html($.gctour.lang('emptyList'));
  }

  handleResize();

  var deleteButton = $('#gctourDeleteButton');
  if(tours.length == 1 && deleteButton){
    deleteButton.hide();
  } else {
    deleteButton.show();
  }

}

// ToDo: switch to $.fn.addOpacityEffects
var addOpacityEffects = function(elem) {
  $(elem)
    .css({opacity: "1"})
    .bind({
      mouseenter: function() {
        $(this).stop().animate({opacity:'0.4'},200);
      },
      mouseleave: function() {
        $(this).stop().animate({opacity:'1'},300);
      }
    });
};

function addClickEffect(element){return function(){  element.style.background = '#a9b2bf';}; }
function removeClickEffect(element){return function(){element.style.background = '#cdd8e8';}; }
function addHoverEffect(element){return function(){element.style.margin = '0px';element.style.border = '1px solid lightgray';element.style.background = '#cdd8e8';}; }
function removeHoverEffect(element){return function(){element.style.margin = '1px';element.style.border = '0px solid lightgray';element.style.background = '';}; }

function addHoverEffects(element){
  element.addEventListener('mouseover', addHoverEffect(element),false);
  element.addEventListener('mouseout',  removeHoverEffect(element),false);
  element.addEventListener('mousedown', addClickEffect(element),false);
  element.addEventListener('mouseup',  removeClickEffect(element),false);
  element.style.margin = '1px';
}

function openSend2GpsFunctionLocal(){
  return function(){
    var url = 'http://www.geocaching.com/seek/sendtogps.aspx?guid=9d2b4990-7222-4b1c-8062-8b753af24ac5&tour=true',
       h    = (GM_getValue('showGpx',false)) ? 610 : 280;
       conf = 'width=425,height=' + h +',toolbar=no,menubar=no,scrollbars=no,resizable=no,location=yes,directories=no,status=no';

    if(isLogedIn() && isNotEmptyList()){
      window.open(url, 's2gps', config=conf);
    }
  };
}

function downloadGPXFunction(){
//return false;
  return function(){
    var gpxForm, nameInput, contentArea, tourName, currentDate, currentDateString, dummyString;

    if(isLogedIn() && isNotEmptyList()){

      // add progressbar while loading
      addProgressbar();



      gpxForm = document.createElement('form');
      gpxForm.setAttribute('style','display:;');
      gpxForm.action = 'http://gc.madd.in/gm/download2.php';
      gpxForm.id="gpxForm";

      gpxForm.method = 'post';

      nameInput = document.createElement('input');nameInput.type = 'hidden';gpxForm.appendChild(nameInput);
      nameInput.name = 'name';

      contentArea = document.createElement('textarea');gpxForm.appendChild(contentArea);
      contentArea.name = 'content';


      tourName = currentTour.name.replace(/\s+/g,"_").replace(/[^A-Za-z0-9_]*/g,"");

      currentDate =  new Date();
      currentDateString =  currentDate.getFullYear()+"-"+(currentDate.getMonth()+1)+"-"+currentDate.getDate()+"_"+currentDate.getHours()+"-"+currentDate.getMinutes()+"-"+currentDate.getSeconds();

      nameInput.value = 'GCTour.'+tourName+'.'+currentDateString+'.gpx';

      try {
        dummyString = getGPX();

        //iff the cancel button is pressed the dummyString just contain canceled
        if(dummyString == "canceled"){
          closeOverlay();
          return;
        }

        contentArea.innerHTML = encodeURIComponent(dummyString);

        document.body.appendChild(gpxForm);
        document.getElementById('gpxForm').submit();
        document.body.removeChild(gpxForm);

        // all done - remove the overlay
        closeOverlay();

      } catch (e) {
        addErrorDialog({caption:"GPX error", _exception:e});
      }
    }
  };
}

function sendToGPS(){
  var dataStringElement, tourName, d, currentDateString;

  // add the overlay while loading
  addProgressbar();

  // fix width and height of the header
  $("div#dialogBody").find("h1").css({
    width:  486,
    height: 14
  });

  // first time send to GPS is clicked: Accept the License
  var accept_input = document.getElementById('chkAccept');
  if(accept_input){
    accept_input.checked = "checked";
    document.getElementById('btnSubmit').click();
    return;
  }

  // change ALWAYS to Garmin
  var garmin_tab = document.getElementById('uxGPSProviderTabsn2');
  if(garmin_tab.getElementsByTagName('table')[0].className != "Selected"){
    unsafeWindow.__doPostBack('uxGPSProviderTabs','2');
    return;
  }

  $('#uxGPSProviderTabs').html("<tbody><tr><td>GCTOUR: GARMIN ONLY</td></tr></tbody>");
  $('#premiumUpsellMessage').remove();

  try{
    dataStringElement = document.getElementById('dataString');
    dataStringElement.value = $.gctour.lang('pleaseWait');
    dataStringElement.value = getGPX();

    tourName = currentTour.name.replace(/\s+/g,"_").replace(/[^A-Za-z0-9_]*/g,"");

    d = new Date();
    currentDateString = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() +
                        "_" + d.getHours() + "-" + d.getMinutes() + "-" + d.getSeconds();

    $('#cacheID').val('GCTour.' + tourName + '.' + currentDateString + '.gpx');

    // all done - remove the overlay
    closeOverlay();
  }catch (e){
    addErrorDialog({caption:"Send to GPSr error", _exception:e});
  }

}

function getMapGeocache(gcid){

  var geocache = getGeocache(gcid);
  if(geocache !== "pm only"){
    var mapCache = {};
    mapCache.gcid = geocache.gcid;
    mapCache.guid = geocache.guid;
    mapCache.image = geocache.image;
    mapCache.name = geocache.name;
    mapCache.difficulty = geocache.difficulty;
    mapCache.terrain = geocache.terrain;
    mapCache.latitude = geocache.lat;
    mapCache.longitude = geocache.lon;

    // save additional waypoints
    var additional_waypoints = geocache.additional_waypoints;
    for(waypoint_i = 0 ; waypoint_i < additional_waypoints.length; waypoint_i++){
      additional_waypoints[waypoint_i].note = "";
    }

    mapCache.additional_waypoints = additional_waypoints;
    return mapCache;
  }

}

function getMapMarker(markerId){
  var position = getPositionsOfId(markerId),
      marker = currentTour.geocaches[position];
  marker.index = position;
  return marker;
}

function uploadMap(markerObj,callback){
  var jsonMap = JSON.stringify(markerObj).replace(/&/g," and ");// IMPORTANT! prevents critical errors in webapplication
  post(GCTOUR_HOST+'/map/save', "map="+jsonMap,callback);
}


//BUG: Entlossschleife, wenn PMO-Cache in Tour ist und der Cache noch nicht auf Server liegt!
function makeMapFunction(){
  var gcIds = [], wptIds = [], allIds = [], cache_i, result;

  if(isLogedIn() && isNotEmptyList()){
    // add the overlay while loading
    addProgressbar({caption:$.gctour.lang('makeMapWait')});


    for (cache_i = 0; cache_i < currentTour.geocaches.length; ++cache_i){
      var marker = currentTour.geocaches[cache_i];

      if(marker.id){
        gcIds.push(marker.id);
        allIds.push(marker.id);
      } else if(marker.wptcode){
        wptIds.push(marker.wptcode);
        allIds.push(marker.wptcode);
      }
    }
    debug("Map request (POST):"+GCTOUR_HOST+'/map/check');
    post(GCTOUR_HOST+'/map/check/',"gcIds="+gcIds.join(",")+"&wptIds="+wptIds.join(","),function(response){
      try{
        result = JSON.parse(response);

        if(result.missing_wptIds.length === 0 && result.missing_gcIds.length === 0){ // map is completly available in appengine
          GM_openInTab(getMapUrl(allIds.join(","))+"#gui");
          closeOverlay();
        } else {
            var geocaches = [];
            var costumMarkers = [];

            if(result.missing_gcIds.length > 0){
              for (cache_i= 0; cache_i < result.missing_gcIds.length; cache_i++){
                var temp =  getMapGeocache(result.missing_gcIds[cache_i]);
                if(temp){
                  geocaches.push(temp);
                }

                setProgress(cache_i,result.missing_gcIds.length+result.missing_wptIds.length-1,document);
              }
            }

            if(result.missing_wptIds.length > 0){
              for (cache_i = 0; cache_i < result.missing_wptIds.length; cache_i++){
                costumMarkers.push(getMapMarker(result.missing_wptIds[cache_i]));
                setProgress(cache_i + result.missing_gcIds.length,
                            result.missing_gcIds.length + result.missing_wptIds.length - 1,
                            document);
              }
            }

            var cacheObject = {};
            cacheObject.geocaches = geocaches;
            cacheObject.costumMarkers = costumMarkers;


            uploadMap(cacheObject, makeMapFunction);

        }


      } catch(e){addErrorDialog({caption:"Temporary map error", _exception:e});}

    });
/*
    get(GCTOUR_HOST+'/map/check/'+,
      function(text){

        var result = JSON.parse(text);
        if(result.length < 1){ // map is completly available in appengine
          GM_openInTab(getMapUrl(markerQuery.join(","))+"#gui");
          closeOverlay();
        } else {

          try{
            var geocaches = [];
            var costumMarkers = [];

            for ( var i= 0; i < result.length; i++){
              var id = result[i];
              if(id.indexOf("GC") === 0){
                var mapCache = getMapGeocache(id);
                if(mapCache){
                  geocaches.push(mapCache);
                }
              } else {
                costumMarkers.push(getMapMarker(id));
              }

              setProgress(i,result.length,document);

            }


            var cacheObject = {};
            cacheObject.geocaches = geocaches;
            cacheObject.costumMarkers = costumMarkers;

            uploadMap(cacheObject, makeMapFunction);
          } catch(e){addErrorDialog({caption:"Make map error", _exception:e});}
        }

      }
    );*/
  }
}

function upload(tour){
  if( !tour.password){ // vllt doch mit !tour.uuid || ????
    //~ var pw = prompt("passwort");
    //~ if(!pw){
      //~ closeOverlay();
      //~ return;
    //~ }
    //~ tour.password = pw;
    tour.password = "not yet implemented";
    upload(tour);
  } else {

    // maybe there are more CHARS than only '&'!
    var jsonTour = JSON.stringify(tour).replace(/&/g," and ");// IMPORTANT! prevents critical errors in webapplication

    post(GCTOUR_HOST+'/tour/save', "tour="+jsonTour,
      function(text){
        try{
          var tourServer = JSON.parse(text);
          // after an error you get this result, eg:
          // {"message":"wrong password","type":"error"}

          // only if the result is a message
          if(tourServer.message && tourServer.type == "error"){
              var pw = prompt("falsches Passwort - bitte richtiges eingeben");   // TODO !!! LANGUAGES!!

              //if pw is empty or dialog closed
              if(!pw){
                closeOverlay();
                return;
              }
              tour.password = pw;
              upload(tour);
          } else if (tourServer.message && tourServer.type == "info"){
            alert(tourServer.message);
            closeOverlay();
          } else {   // result is a tour and could be saved  - all done


            // remaind to local id!!
            tourServer.id = tour.id;

            // and the password
            tourServer.password = tour.password;


            currentTour = tourServer;
            saveCurrentTour();

            checkOnlineConsistent(currentTour);


            updateTour();

            closeOverlay();


            var codeString = $.gctour.lang('tourUploaded1')+currentTour.webcode+$.gctour.lang('tourUploaded2');
            alert(codeString);
          }
        }catch(e){addErrorDialog({caption:"Upload online tour error", _exception:e});}
      }
      );
  }
}

function uploadTourFunction(id){
  return function(){
    var i, geocaches, cache_i, costumMarker, geocache, mapCache, waypoint_i, codeString, costumMarkers;
    if(isLogedIn() && isNotEmptyList()){
      try{
        for (i = 0; i < tours.length; i++){
          if(tours[i].id == id){

            // add the overlay while loading
            addProgressbar();
            if (GM_getValue('uploadMap',true)){ // TODO - upload Map noch gewünscht?
              //create the overview map
              geocaches = [];
              costumMarkers = [];

              for (cache_i = 0; cache_i < tours[i].geocaches.length; ++cache_i){

                if(GM_getValue("stopTask",false) && cache_i !== 0){
                  GM_setValue("stopTask",false);
                  closeOverlay();
                  break;
                } else if (GM_getValue("stopTask",false) && cache_i === 0 ) {
                  GM_setValue("stopTask",false);
                }
                costumMarker = (typeof(tours[i].geocaches[cache_i].latitude) != "undefined");
                if(!costumMarker){
                    mapCache = getMapGeocache(tours[i].geocaches[cache_i].id);
                    if(mapCache){
                    geocaches.push(mapCache);
                  }
                } else {
                  var cm = tours[i].geocaches[cache_i];
                  cm.index = cache_i;
                  costumMarkers.push(cm);
                }

                setProgress(cache_i,tours[i].geocaches.length,document);
              }
            }


            // create request
            var tourObject = currentTour;
            tourObject.geocaches = geocaches;
            tourObject.costumMarkers = costumMarkers;
            tourObject.password = currentTour.password;
            upload(tourObject);


            break;
          }
        }
      } catch(e){addErrorDialog({caption:"Upload tour error", _exception:e});}
    }
  };
}

function openSend2GpsDialog(){
  if(isLogedIn() && isNotEmptyList()){
    var overlay= getOverlay({caption:"Send to GPS"});
    overlay.innerHTML = "<iframe src='http://www.geocaching.com/seek/sendtogps.aspx?guid=9d2b4990-7222-4b1c-8062-8b753af24ac5&tour=1' width='450px' height='350' scrolling='no' marginheight='0' marginwidth='0' frameborder='0'></iframe>";
  }
}

function openSettingsDialog(){
  var settings = new Settings();
  settings.show();
}

function sendMessageDialog(){
  if(isLogedIn()){
    var overLay = getOverlay({caption:$.gctour.lang('dlg.sendMessage.caption'),minimized:true});

    overLay.innerHTML = '<form style="clear:both" method="POST" action="'+GCTOUR_HOST+'/mail/gccom">'+
      $.gctour.lang('dlg.sendMessage.content')+'<br/>'+
      '<input type="hidden" name="redir" value='+window.location+'>'+
      '<input type="hidden" name="user" value='+userName+'>'+
      '<textarea rows="10" style="width:99%" name="message"></textarea>'+
      '<div class="dialogFooter"><input style="background-image:url('+$.gctour.img.sendMessage+')" type="submit" name="send" value="'+$.gctour.lang('dlg.sendMessage.submit')+'"></input></div>'+
      '</form>';
  }
}

function populateTours(){
  var tour, tourListLi, tourLink, tourIt;

  var tourList = $('#dialogListContainer');
  tourList.html("");

  var tourListUl = $('<ul>', {
    "class": "dialogList"
  });
  tourList.append(tourListUl);

  // construct tour list
  for (tourIt = 0; tourIt < tours.length; tourIt++){
    tour = tours[tourIt];
    tourListLi = $('<li>', {
      id: "tour" + tour.id
    });
    tourListUl.append(tourListLi);

    tourLink = $('<a>',{
      "css":{
        "cursor": "pointer",
        "font-size": 10,
        "color": "#003399"
      },
      html: tour.name + "&nbsp;<small>(" + tour.geocaches.length + ")</small>"
    })
    .bind('click', {tour: tour}, function(e){
      showCacheList(e.data.tour)();
    });

    // make the current Tour not clickable nor deletable!
    if (tour.id == currentTour.id) {
      //~ tourListLi.setAttribute("class", "activeTour");
      tourLink.css({'font-weight' : 'bolder'});
    } else {
      var deleteButton = $('<img>',{
        title: $.gctour.lang('removeTour'),
        src: $.gctour.img.del,
        "css": {
          "cursor": 'pointer',
          "margin-right": 3,
          "float": 'right'
        }
      })
      .bind('click', {tour: tour}, function(e){
        deleteTourFunction(e.data.tour.id)();
      });

      tourListLi.append(deleteButton);
    }

    if (tour.webcode) {
      var webImage = $('<img>',{
        src: $.gctour.img.globeImage,
        "css": {
          "float": "left",
          "margin-right": 3
        }
      });
      tourLink.append(webImage);
    }

    tourListLi.append(tourLink);
  }
}

function showCacheList(tour){
  return function(){
    var cacheList = document.getElementById('dialogDetails');
    cacheList.scrollTop=0;
    cacheList.setAttribute("tourid", tour.id);

    cacheList.innerHTML = "<u><b>"+tour.name+"</b>";
    if(tour.webcode){
      cacheList.innerHTML += "&nbsp;&nbsp;&nbsp;<i>Webcode: <a href='"+GCTOUR_HOST+"/tour/"+$.trim(tour.webcode)+"' title='"+$.gctour.lang('makeMap')+"' target='_blank'>"+tour.webcode+"</a></i>";
    }
    cacheList.innerHTML += "</u><br/>";

    var copyButton = document.createElement('img');
    copyButton.title = $.gctour.lang('copyTour');
    copyButton.src = $.gctour.img.copy;
    copyButton.style.cursor = 'pointer';
    copyButton.style.marginRight = '5px';
    copyButton.style.cssFloat = 'right';
    copyButton.addEventListener('click',function(){

      var newTour = JSON.parse(JSON.stringify(tour));
      newTour.id = getNewTourId();

      newTour.name = newTour.name + " - "+$.gctour.lang('copy');

      tours.push(newTour);
      log("Creating copy tour: "+newTour.id +" ; "+ newTour.name);

      saveTour(newTour,true);

      populateTours();

      showCacheList(newTour)();
    },false);

    var deleteButton = document.createElement('img');
    deleteButton.title = $.gctour.lang('removeTour');
    deleteButton.src = $.gctour.img.del;
    deleteButton.style.cursor = 'pointer';
    deleteButton.style.marginRight = '5px';
    deleteButton.style.cssFloat = 'right';
    deleteButton.addEventListener('click',deleteTourFunction(tour.id), false);

    var renameButton = document.createElement('img');
    renameButton.src = $.gctour.img.edit;
    renameButton.title = $.gctour.lang('rename');
    renameButton.alt = $.gctour.lang('rename');
    renameButton.style.cursor = 'pointer';
    renameButton.style.marginRight = '5px';
    renameButton.style.cssFloat = 'right';
    renameButton.addEventListener('click',

    function(){
      var newTourName = prompt($.gctour.lang('newTourDialog'), tour.name);
      if(!newTourName) { return; }
      tour.name = newTourName;
      saveTour(tour,true);
      populateTours();

      showCacheList(tour)();
      },false);

    if(tour.id != currentTour.id){
      cacheList.insertBefore(deleteButton,cacheList.firstChild);
    }

    cacheList.insertBefore(renameButton,cacheList.firstChild);
    cacheList.insertBefore(copyButton,cacheList.firstChild);

    var cacheListUl = createElement('ul');
    cacheListUl.setAttribute("class", "dialogList");

    for (var cacheIt = 0; cacheIt<tour.geocaches.length; cacheIt++){
      var geocache = tour.geocaches[cacheIt];

      var cacheListLi = createElement('li',{style:"b"});append(cacheListLi,cacheListUl);
      cacheListLi.innerHTML = "<img src='"+geocache.image+"' style='margin-left=10px'> "+geocache.name+"&nbsp;<small>("+((geocache.id !== undefined)?geocache.id:geocache.wptcode)+")</small>";

    }
    append(cacheListUl,cacheList);

    // make loadButton available


    var loadButton = document.getElementById('loadButton');
    loadButton.value = "'"+tour.name+"' "+$.gctour.lang('load');
    loadButton.removeAttribute('disabled');

    // first remove all active tour css classes
    $("ul.dialogList > li").removeClass("activeTour");
    //and then set it to the clicked
    $('#tour' + tour.id).addClass("activeTour");
  };
}

function openTourDialog(){
  var overLay = getOverlay({caption:$.gctour.lang('openTour')});
  var tourList = createElement('div',{id:"dialogListContainer"});append(tourList,overLay);
  var cacheList = createElement('div',{id:"dialogDetails"});append(cacheList,overLay);

  populateTours();

  // load,close buttons
  var buttonsDiv = createElement('div',{style:"width:580px;position: absolute; bottom: 10px;"});append(buttonsDiv,overLay);
    buttonsDiv.setAttribute('class','dialogFooter');

  var closeButton = createElement('input',{type:"button",value:$.gctour.lang('cancel'),style:"background-image:url("+$.gctour.img.closebutton+")"});append(closeButton,buttonsDiv);
    closeButton.addEventListener('click', closeOverlay, false);

  var loadButton = createElement('input',{type:"button",value:$.gctour.lang('load'),disabled:"",id:"loadButton",style:"background-image:url("+$.gctour.img.openTour+")"});append(loadButton,buttonsDiv);
    loadButton.addEventListener('click', function(){
      var id = $("#dialogDetails").attr("tourid"); // ToDo: to $().data
      loadTour(id)();
      closeOverlay();
    }, false);

  // load currentTour
  showCacheList(currentTour)();

  loadButton.setAttribute("disabled","disabled");
}

function downloadTourFunction(webcode){
  var details = {};
  var onlineTour;

  // 30c097a6, b5c082e3

  // add the overlay while loading
  addProgressbar();

  details.method = 'GET';
  //~ details.url = 'http://gctour.madd.in/query.php?crc='+ $.trim(webcode);
  details.url = GCTOUR_HOST + '/tour/' + $.trim(webcode) + '/json';

  details.onload = function(response) {

    responseInfo(response);

    var responseObject;
    var booResponse = (response.status === 200);     // only status 200
    var booIsJson   = isJSON(response.responseText); // is response json ?

    if (!booResponse || !booIsJson) {
      alert("webcode '" + webcode + "' could not be loaded.\n" +
        response.status + ", " + response.statusText + ((booIsJson) ? "" :  ", format is not valid"));
      closeOverlay();
      return false;
    }

    try{
      responseObject = JSON.parse(response.responseText);

      if (responseObject.type == "error" && responseObject.message == "no tour"){
        alert($.gctour.lang('webcodeerror'));

      } else if (responseObject.type == "oldtour"){
        onlineTour = JSON.parse(responseObject.message);
        onlineTour.id = getNewTourId();

        tours.push(onlineTour);
        saveCurrentTour();

        log("Download of an old online tour successfull: " + onlineTour.id + " ; " + onlineTour.name);
        alert("tour '" + onlineTour.name + "'\n" + $.gctour.lang('webcodesuccess') + "\n" + $.gctour.lang('webcodeOld'));
        loadTour(onlineTour.id)();

      } else {
        onlineTour = responseObject;
        onlineTour.id = getNewTourId();

        tours.push(onlineTour);
        saveCurrentTour();

        alert("tour '" + onlineTour.name + "'\n" + $.gctour.lang('webcodesuccess'));
        loadTour(onlineTour.id)();
      }

      closeOverlay();
    } catch(e){
      addErrorDialog({caption:"Download tour error", _exception:e});
    }
  };
  GM_xmlhttpRequest(details);
}

function downloadTourDialog(){
  var overlay= getOverlay({caption:$.gctour.lang('webcodeDownloadButton'),minimized:true});

  var divEbene = createElement('div');append(divEbene,overlay);

  divEbene.innerHTML = '<b>Webcode:</b>&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" id="webcodeInput" style="width:300px;"><br/>'+$.gctour.lang('webcodeDownloadHelp');

  divEbene = createElement('div');append(divEbene,overlay);
  divEbene.setAttribute('class','dialogFooter');

  var downloadButton = createElement('input',{type:"button",value:$.gctour.lang('webcodeDownloadButton'),style:"background-image:url("+$.gctour.img.download+")"});append(downloadButton,divEbene);
  downloadButton.addEventListener('click',function(){
    var webcode = $.trim($('#webcodeInput').val());
    if (webcode == "") { return; }
    downloadTourFunction(webcode);
  },false);

}
