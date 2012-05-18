function getTourById(id){
  var currentTourId = GM_getValue('currentTour',-1);
  var tours = loadValue('tours', []);
  for (var i = 0; i<tours.length;i++){
    if(tours[i].id == currentTourId){
      return tours[i];
    }
  }
  return;
}

function getNewTourId(){
  var tourId = 0;
  for (var i = 0; i<tours.length;i++){
    if(tours[i].id >= tourId){
      tourId = tours[i].id + 1;
    }
  }
  return tourId;
}

function isIdInTable(gcId){
  for (var i = 0; i < currentTour.geocaches.length; i++) {
    if(currentTour.geocaches[i].id == gcId){
      return true;
    }
  }
  return false;
}

function getPositionsOfId(theId){
  var id = -1;
  $.each(currentTour.geocaches, function(i, obj) {
    if(obj.id == theId || obj.wptcode == theId){
      id = i;
      return false; // break each
    }
  });
  return id;
}

function checkOnlineConsistent(t){
  // Creates way to much traffic :(
  // maybe in the next version

  /*

  if(t.webcode){
    geocaches = new Array();
    waypoints = new Array();
    costumMarkers = new Array();

    var list = {webcode:t.webcode,geocaches:[]};
    for (cache_i = 0; cache_i < t.geocaches.length; ++cache_i){
      list.geocaches.push((typeof(t.geocaches[cache_i].latitude) != "undefined")?t.geocaches[cache_i].wptcode:t.geocaches[cache_i].id );
    }

    var jsonTour = JSON.stringify(list);
    post(API_HOST+'/tour/check', "tour="+jsonTour,
      function(text){
        log("checkOnlineConsistent:"+text)

        if(text == "false"){
          if (document.getElementById("inconsistentTour")){
            document.getElementById("inconsistentTour").style.display="inline";
          } else {
            window.setTimeout(function(){document.getElementById("inconsistentTour").style.display="inline"},3000);
          }
        } else {

          if (document.getElementById("inconsistentTour")){
            document.getElementById("inconsistentTour").style.display="none";
          } else {
            window.setTimeout(function(){document.getElementById("inconsistentTour").style.display="none"},3000);
          }
        }
      }
    );
  } */
}

function saveTour(tour, notLoad){
  var i;
  for (i= 0; i < tours.length; ++i){
    if(tours[i].id == tour.id){
      tours[i] = tour;
    }
  }

  GM_setValue('tours', JSON.stringify(tours));
  if(notLoad === undefined){
    GM_setValue('currentTour', tour.id);
    log("updating "+tour.name);

    checkOnlineConsistent(tour);
  }
}

function saveCurrentTour(){
  saveTour(currentTour);
}

function addNewTableCell(theEntry,effects){
  var costumMarker = (typeof(theEntry.latitude) !== "undefined");

  // if this is a cosutm marker user other id
  var theId = (!costumMarker)?theEntry.id:theEntry.wptcode;

  var entryLi = createElement('li', {id: theId, style: "position:relative;opacity:0;width:90%;list-style-image='url('"+theEntry.image+"');background-color:pink;"});

  // set the background image
  //~ entryLi.style.background = "transparent url(http://stats.madd.in/counter/digit.php?digit="+(getPositionsOfId(theEntry.id || theEntry.wptcode)+1)+") fixed no-repeat bottom right";
  //entryLi.style.backgroundImage = "url(http://stats.madd.in/counter/digit.php?digit="+(getPositionsOfId(theEntry.id || theEntry.wptcode)+1)+")";
  //entryLi.style.backgroundRepeat = "no-repeat";
  //entryLi.style.backgroundPosition = "bottom right";

  //set the type
    entryLi.style.listStyleImage="url('"+theEntry.image+"')";

  // make the gcid link
  var nameCite = createElement('span',{style:"vertical-align:top"});

  //~ var indexDiv = createElement('span',{style:"margin-right: 6px;"});
    //~ indexDiv.innerHTML = "<b>"+(getPositionsOfId(theEntry.id || theEntry.wptcode)+1)+"</b>";
    //~ append(indexDiv,nameCite);

  if(!costumMarker){
    var coordinates = GM_getValue('coords_'+theId,"null");

    if(coordinates != "null"){
      var moveCoords = createElement('img',{src:'http://www.geocaching.com/images/icons/coord_update.gif',height:"12",style:"float:right;margin-right:5px", alt:$.gctour.lang('movedGeocache'), title:$.gctour.lang('movedGeocache')});
      nameCite.appendChild(moveCoords);
    }
    var linkElement = document.createElement('a');
    //linkElement.style.fontSize = '9px'; to small!
    linkElement.style.fontFamily = 'arial,sans-serif';
    linkElement.href = 'http://www.geocaching.com/seek/cache_details.aspx?guid='+theEntry.guid;
    linkElement.target = '_self';
    linkElement.textContent = theId;
    nameCite.appendChild(linkElement);

  } else {
    nameCite.innerHTML += theEntry.name;
    nameCite.style.textDecoration = "underline";
  }

  // the log/edit button and the delete button
  var functionButtonsDiv = document.createElement('div');
  functionButtonsDiv.style.cssFloat = 'right';
  functionButtonsDiv.setAttribute("class", "controls");

  if(!costumMarker){
    var logVisitImage = document.createElement('img');
    logVisitImage.alt = $.gctour.lang('logYourVisit');
    logVisitImage.title = $.gctour.lang('logYourVisit');
    logVisitImage.style.cursor = 'pointer';
    logVisitImage.src = "http://www.geocaching.com/images/stockholm/16x16/add_comment.gif";
    logVisitImage.addEventListener('click', function(){window.location.href = 'http://www.geocaching.com/seek/log.aspx?wp='+theId;}, true);
    addOpacityEffects(logVisitImage);
    functionButtonsDiv.appendChild(logVisitImage);
  } else {
    var editMarkerButton = document.createElement('img');
    editMarkerButton.alt = $.gctour.lang('edit');
    editMarkerButton.title = $.gctour.lang('edit');
    editMarkerButton.style.cursor = 'pointer';
    editMarkerButton.src = $.gctour.img.edit;
    editMarkerButton.addEventListener('click', function(){showNewMarkerDialog(theEntry);}, false);
    addOpacityEffects(editMarkerButton);
    functionButtonsDiv.appendChild(editMarkerButton);
  }

  var deleteImage = document.createElement('img');
    deleteImage.alt = $.gctour.lang('removeFromList');
    deleteImage.title = $.gctour.lang('removeFromList');
    deleteImage.style.cursor = 'pointer';
    deleteImage.src = $.gctour.img.del;
  deleteImage.addEventListener('click', deleteElementFunction(theId), true);
  addOpacityEffects(deleteImage);
  functionButtonsDiv.appendChild(deleteImage);

  // thanks to adam r
  /* unneeded  since the list uses drag and drop
  var upDownDiv = document.createElement('div');
  upDownDiv.align = "right";

  var topButton = document.createElement('img');
    topButton.alt = "top";
    topButton.title = "top";
    topButton.style.cursor = 'pointer';
    topButton.src = $.gctour.img.topArrow;
    topButton.addEventListener('click', moveTop(theId), true);
    addOpacityEffects(topButton);

  var upButton = document.createElement('img');
    upButton.alt = "up";
    upButton.title = "up";
    upButton.style.marginRight = '5px';
    upButton.style.cursor = 'pointer';
    upButton.src = $.gctour.img.upArrow;
    upButton.addEventListener('click', moveUp(theId), true);
    addOpacityEffects(upButton);

  var downButton = document.createElement('img');
    downButton.alt = "down";
    downButton.title = "down";
    downButton.style.cursor = 'pointer';
  downButton.style.marginRight = '5px';
    downButton.src = $.gctour.img.downArrow;
    downButton.addEventListener('click', moveDown(theId), true);
    addOpacityEffects(downButton);

  var bottomButton = document.createElement('img');
    bottomButton.alt = "bottom";
    bottomButton.title = "bottom";
    bottomButton.style.cursor = 'pointer';
    bottomButton.src = $.gctour.img.bottomArrow;
    bottomButton.addEventListener('click', moveBottom(theId), true);
    addOpacityEffects(bottomButton);

  functionButtonsDiv.appendChild(document.createElement('br'));
  upDownDiv.appendChild(upButton);
  upDownDiv.appendChild(topButton);
  upDownDiv.appendChild(document.createElement('br'));
  upDownDiv.appendChild(downButton);
  upDownDiv.appendChild(bottomButton);
  functionButtonsDiv.appendChild(upDownDiv);*/

  entryLi.appendChild(functionButtonsDiv);
  entryLi.appendChild(nameCite);

  var nameDiv = document.createElement('div');
  nameDiv.style.clear = 'left';
  nameDiv.style.position = 'relative';
  nameDiv.style.zIndex = 2;

  if(!costumMarker){
    nameDiv.innerHTML += theEntry.name;
  }else {
    nameDiv.innerHTML += new LatLon(theEntry.latitude,theEntry.longitude).toString() + " " + theEntry.content;
  }
  entryLi.appendChild(nameDiv);

  var counterDiv = document.createElement('div');
  counterDiv.className='counter unselectable';
  counterDiv.innerHTML = (getPositionsOfId(theEntry.id || theEntry.wptcode)+1);
  entryLi.appendChild(counterDiv);
  /*
  // todo: jquery
  var counterDiv = $('<div>', {
    "class": 'counter unselectable',
    html: (getPositionsOfId(theEntry.id +3|| theEntry.wptcode) + 1)
  });
  */

  $('#cacheList').append(entryLi);
  if(unsafeWindow.draglist){
    unsafeWindow.draglist.sync(); // needed to function properly
  }

  if (effects) {
    $("#" + theId).fadeTo(1000, 1);
  } else {
    $("#" + theId).css({opacity: 1});
  }

}

// function to move an cache to an given position in the list
function move(id,positionDelta){
  var i;

  // locate the selected cache in the list
  var position = getPositionsOfId(id);

  // return if we are at the end or at top of the list!
  if((position === 0  && positionDelta < 0) || (position == currentTour.geocaches.length-1 && positionDelta > 0) ){
    return;
  }

  // save clicked cache
  var geoCache = currentTour.geocaches[position];

  // remove it from the current geocaches
  currentTour.geocaches.splice(position,1);

  var tempCaches = [];

  // first push all caches in front of the selected in the new array
  for(i = 0; i < position+positionDelta; i++){
    tempCaches.push(currentTour.geocaches[i]);
  }

  // then the selected
  tempCaches.push(geoCache);

  // and now the rest
  for(i = position+positionDelta; i < currentTour.geocaches.length; i++){
    tempCaches.push(currentTour.geocaches[i]);
  }

  // ... and make it persistent
  currentTour.geocaches = tempCaches;
  saveCurrentTour();

  // redraw the list:
  var cacheList = document.getElementById('cacheList');

  // just clear the list
  while(cacheList.firstChild) { cacheList.removeChild(cacheList.firstChild); }
  for (i = 0; i < currentTour.geocaches.length; i++){
    addNewTableCell(currentTour.geocaches[i],false);
  }
}

function moveUp(id){
  return function(){
    move(id,-1);
  };
}

function moveDown(id){
  return function(){
    move(id,1);
  };
}

function moveTop(id){
  return function(){
    var position = getPositionsOfId(id);
    move(id,-position);
  };
}

function moveBottom(id){
  return function(){
    var position = getPositionsOfId(id);
    move(id,currentTour.geocaches.length-position-1);
  };
}

function saveNewCache(entry){
  currentTour = getTourById(currentTourId);
  currentTour.geocaches.push(entry);
  saveCurrentTour();
  log("saving "+ entry.id +" to "+currentTour.name);
}

function updateCacheCount(count){
  $("#cachecount")
    .html('(' + count + ')')
    .stop(true, true)
    .animate({backgroundColor: '#ffe000'}, 800)
    .animate({backgroundColor: '#ffffff'}, 700);

  if (!sticky) { // nur wenn sichtbar
    $("#gctourButtonWrapper")
      .stop(true, true)
      .toggleClass( "gctour-grand-highlight", 300 )
      .toggleClass( "gctour-grand-highlight", 1200 );
  }
}

function addCustomMarker(name, lat, lon, content, typeImage, typeSymbol,wptcode){

  if(!isNotEmptyList){
    var table = document.getElementById('cacheList');
    table.innerHTML = '';
  }

  // customMarker:                e.g.:
  //    name  ->  the cachename    parking area
  //    image  ->  the typeimage    http://gctour.madd.in/map/icons/flag.png
  //    lat    ->  latitude    51.12342
  //    lon    ->  longitude    -12.33456
  //    content  ->  the content    "Test\nLINEBREAK"
  //    symbol  ->  GPX symbol name "Red Flag"

  var entry = {};

  entry.wptcode = (wptcode)?wptcode:(new Date().getTime()-Math.round(lat+lon*1000)).toString(16);
  entry.name = name;
  entry.latitude = lat;
  entry.longitude = lon;
  entry.image = typeImage;
  entry.content = content;
  entry.symbol = typeSymbol;

  log("New custommarker: " + entry.name +" lat:"+entry.lat+" lon:"+entry.lon+" Type:"+entry.symbol +" content:"+entry.content);

  // add the newbie
  addNewTableCell(entry,true);

  // and make it persistence
  saveNewCache(entry);

  // update the cache count
  updateCacheCount(currentTour.geocaches.length);

  return entry;
}

function addElementFunction(theId, theGuId, theName, theTypeImage){
  return function () {

    if(!isNotEmptyList){
      var table = document.getElementById('cacheList');
      table.innerHTML ='';
    }

    if(!isIdInTable(theId)){
      // entry:                e.g.:
      //    id    ->  the gc.com id    GC00815
      //    guid  ->  the guid      6e974919-2b47-46e2-8661-3fc62a5a9650
      //    name  ->  the cachename    Echo the tomcat
      //    image  ->  the typeimage    http://www.geocaching.com/images/WptTypes/sm/2.gif
      var entry = {};
      entry.id = theId;
      //~ entry.name = theName.textContent;
      entry.name = theName;
      entry.guid = theGuId;

      // split the src an take only x.gif
      //~ var typeGif = theTypeImage.getAttribute('src').split("/")[3];
      var typeGif = theTypeImage.replace("http://www.geocaching.com/images/WptTypes/sm/", ""); // ggf. schon komplette url kürzen
      entry.image = 'http://www.geocaching.com/images/WptTypes/sm/' + typeGif;

      // add the newbie
      addNewTableCell(entry,true);

      // and make it persistence
      saveNewCache(entry);

      // update the cache count
      updateCacheCount(currentTour.geocaches.length);

    }
  };
}

function deleteElementFunction(theId){
  return function () {
    // effect
    $("#" + theId)
      .fadeOut(500, function() {
        $(this).remove();
      });

    // locate the element to delete
    for (var i = 0; i < currentTour.geocaches.length; i++){
      if(currentTour.geocaches[i].id == theId || currentTour.geocaches[i].wptcode == theId){
        // array in js are dumb - where is removeAt ??
        currentTour.geocaches.splice(i, 1);
        log("removing '" + theId +"' from '" + currentTour.name + "'");
        break;
      }
    }

    saveCurrentTour();

    // update the cache count
    updateCacheCount(currentTour.geocaches.length);

    if (!isNotEmptyList) {
      $('#cacheList').html($.gctour.lang('emptyList'));
    }
  };
}

function removeElementsFunction(descriptionElement, id, tagName){
  return function () {
    var elements = descriptionElement.getElementsByTagName(tagName);
    for (var x = 0; x<elements.length; x++) {
      if(elements[x].id == id){
        elements[x].style.display = "none";
      }
    }
  };
}

function updateTour(){
  initCore();
  updateGUI();
}

function loadTour(id){
  return function(){
    GM_setValue('currentTour',id);
    if (document.getElementById("inconsistentTour")){
      document.getElementById("inconsistentTour").style.display="none";
    }

    if(document.URL.search("webcode")>=0){
      window.location = "http://www.geocaching.com";
    } else {
      updateTour();
    }

  };
}

function newTourFunction(preset){
  return function(){
    var newTour = {};
    newTour.id = getNewTourId();

    var tourName = (preset) ? preset : "Tour " + newTour.id;
    newTour.name = prompt($.gctour.lang('newTourDialog'), tourName);
    newTour.geocaches = [];
    if(!newTour.name) { return false; }

    tours.push(newTour);
    log("Creating new tour: "+newTour.id +" ; "+ newTour.name);

    saveTour(newTour);

    //~ window.location.reload();
    updateTour();

    return true;
  };
}

function deleteTourFunction(id, force){
  return function(){
    if (force || confirm($.gctour.lang('removeTourDialog'))) {

      for (var i = 0; i < tours.length; i++){
        if (tours[i].id == id) {
          log("removing '" + tours[i].name + "'");
          // array in js are dumb - where is removeAt ??

          var cachelist = $('#dialogDetails');

          if (cachelist.length > 0 && cachelist.attr("tourid") == tours[i].id) {
            showCacheList(currentTour)();
            $('#loadButton').attr("disabled", "disabled");
          }

          $("#tour" + id).remove();

          tours.splice(i,1);
          saveCurrentTour();

          //updateTour();

          break;
        }
      }
    }
  };
}

function deleteCurrentTour(){
  if (confirm($.gctour.lang('removeTourDialog'))) {
    var tableId;
    for (tableId = 0; tableId<tours.length;tableId++){
      if(tours[tableId].id == currentTour.id){
         break;
      }
    }

    var nextTourId = tours[(tableId + 1) % tours.length].id;
    var currentTourId = currentTour.id;

    loadTour(nextTourId)();
    deleteTourFunction(currentTourId, true)();
  }
}
