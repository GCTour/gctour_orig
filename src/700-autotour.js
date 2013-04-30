// autoTour gui

function updateAutoTourMap(lat,lon){

  //make the container visible
  $('#autoTourContainer').show();

  var radiusOrg = $.trim($("input#markerRadius").val());
  if (isNaN(radiusOrg) || radiusOrg == "") {// please break if radius is no number
    return;
  }

  var meterMiles = $("select#markerRadiusUnit").prop("selectedIndex");
  // 0: meter, 1: miles
  var radiusMiles = parseFloat(radiusOrg) * ((meterMiles == 1) ? 1 : 0.621371);

  if (radiusMiles == "") {
    return;
  }

  var staticGMap = $('div#staticGMap');
  staticGMap.html("");

  // create new static map with changed coordinates
  var SM = new StaticMap(staticGMap, {
    'lat': lat,
    'lon': lon,
    radius: radiusMiles,
    width: 570
  });

  $('b#markerCoordsPreview').html(new LatLon(lat,lon).toString());
  $('b#markerRadiusPreview').html(radiusOrg + " " + ((meterMiles == 1) ? "mi" : "km"));

  $("b#markerCoordsPreview, b#markerRadiusPreview")
    .css("background-color", "#FFE000")
    .animate({"background-color": "transparent"}, 2000);

  // get how many caches are in this area

  loadingTime1 = new Date();

  var url = "http://www.geocaching.com/seek/nearest.aspx?lat=" + lat + "&lng=" + lon + "&dist=" + radiusMiles;
  log("url: " + url);
  GM_xmlhttpRequest({
    method: 'GET',
    url: url,
    onload: function(responseDetails) {
      var dummyDiv = $(responseDetails.responseText),
          color,
          pagesSpan = $("td.PageBuilderWidget", dummyDiv).first();

      if (pagesSpan.length > 0) {
        var cacheCount = $("b", pagesSpan).first().text(),
            pageCount  = $("b", pagesSpan).last().text();

        color = "#FFE000";

        var miliseconds = new Date() - loadingTime1;
        var seconds = Math.floor((miliseconds * parseFloat(pageCount) ) / 1000);
        seconds = seconds + parseFloat(pageCount) * 2;

        var secondsMod = seconds % 60;
        var minutes = (seconds - secondsMod) / 60;

        $("b#markerCountPreview").html(cacheCount);
        $("b#markerDurationMin").html(minutes);
        $("b#markerDurationSec").html(secondsMod);
      } else {
        $("b#markerCountPreview, b#markerDurationMin, b#markerDurationSec").html("0");
        color = "#FF0000";
      }

      $("b#markerCountPreview")
        .css("background-color", color)
        .animate({"background-color": "transparent"}, 2000);
    }
  });

  // last, save the values
  $('input#coordsDivLat').val(lat);
  $('input#coordsDivLon').val(lon);
  $('input#coordsDivRadius').val(radiusMiles);
  $('b#markerCountPreview, b#markerDurationMin, b#markerDurationSec').html("<img src='http://madd.in/ajax-loader3.gif'>");

  // enable the startQuery button
  $('button#startQuery').removeAttr('disabled').css("opacity", 1);
}

function startAutoTour() {
  var i,
    typeFilter = {},
    sizeFilter = {},
    difficultyFilter = {},
    terrainFilter = {},
    specialFilter = {},
    ele = $("#autoTourContainer"),
    lat, lon, radius, url;

  ele.find("input[name='type']").each(function(index) {
    typeFilter[$(this).val()] = $(this).is(':checked');
  });

  ele.find("input[name='size']").each(function(index) {
    sizeFilter[$(this).val()] = $(this).is(':checked');
  });

  ele.find("input[name='Difficulty']").each(function(index) {
    difficultyFilter[$(this).val()] = $(this).is(':checked');
  });

  ele.find("input[name='Terrain']").each(function(index) {
    terrainFilter[$(this).val()] = $(this).is(':checked');
  });

  ele.find("input[name='special']").each(function(index) {
    specialFilter[$(this).val()] = $(this).is(':checked');
  });

  lat    = ele.find("input#coordsDivLat").val();
  lon    = ele.find("input#coordsDivLon").val();
  radius = ele.find("input#coordsDivRadius").val();
  url    = "http://www.geocaching.com/seek/nearest.aspx?lat=" + lat + "&lon=" + lon + "&dist=" + radius;

  if (specialFilter["I haven't found "]) {
    url += "&f=1";
  }

  GM_setValue('tq_url',           url);
  GM_setValue('tq_typeFilter',    JSON.stringify(typeFilter));
  GM_setValue('tq_sizeFilter',    JSON.stringify(sizeFilter));
  GM_setValue('tq_dFilter',       JSON.stringify(difficultyFilter));
  GM_setValue('tq_tFilter',       JSON.stringify(terrainFilter));
  GM_setValue('tq_specialFilter', JSON.stringify(specialFilter));
  GM_setValue('tq_StartUrl',      document.location.href);

  document.location.href = url;
}

function getMarkerCoord() {
  var markerCoords = $("input#markerCoords").val();
  var coords = parseCoordinates(markerCoords, true);
  if (coords) {
    updateAutoTourMap(coords._lat, coords._lon);
  } else { // Sehr seltener Fall wenn auch die google geolocate API versagt.
    alert("'" + markerCoords + "' is not an address!");
  }
}

function getSpecialFilter(){
  var specialDiv = document.createElement('div');
  specialDiv.style.cssFloat = "left";
  specialDiv.style.paddingRight = "10px";
  specialDiv.style.textAlign = "left";
  specialDiv.innerHTML = "<b>That</b><br/>";

  var specials = ['I haven\'t found ','is Active', 'is not a PM cache'];

  for(var i = 0; i<specials.length; i++ ){
    var checkboxSpan = createElement('span');

    var checkbox = createElement('input', {type: 'checkbox', name: "special", value: specials[i], checked: 'checked'});
    checkbox.style.margin = '0px';

    var caption = createElement('span');
    caption.innerHTML = specials[i];

    append(checkbox, checkboxSpan);
    append(caption, checkboxSpan);
    append(checkboxSpan, specialDiv);
    append(createElement('br'), specialDiv);
  }

  return specialDiv;
}

function getDtFiler(boxName){
  var checkboxesDiv = document.createElement('div');

  checkboxesDiv.style.cssFloat = "left";
  checkboxesDiv.style.textAlign = "left";
  checkboxesDiv.style.paddingRight = "10px";
  checkboxesDiv.innerHTML = "<b>"+boxName+"</b><br/>";
  for(var i = 1; i<=5; i = i+0.5){
    var checkboxDiv = createElement('span');

    checkboxDiv.style.border = '1px solid gray';
    checkboxDiv.style.margin = '2px';
    checkboxDiv.style.verticalAlign = 'middle';

    var checkbox = createElement('input', {type: 'checkbox', name: boxName, value: i, id:boxName+""+i, checked: 'checked'});
    checkbox.style.margin = '0px';

    var label = createElement('label');
    label.setAttribute("for", boxName+""+i);
    var caption = createElement('img');
    append(caption,label);
    var value = ""+i;
    value = value.replace(/\./g, "_");
    caption.src = "http://www.geocaching.com/images/stars/stars"+value+".gif";

    checkboxesDiv.appendChild(checkbox);
    checkboxesDiv.appendChild(label);
    checkboxesDiv.appendChild(createElement('br'));
  }

  return checkboxesDiv;
}

function getSizeFilter(){
  var sizes = ['micro','small','regular','large','other'];

  var sizesCheckboxesDiv = document.createElement('div');

  sizesCheckboxesDiv.style.cssFloat = "left";
  sizesCheckboxesDiv.style.textAlign = "left";
  sizesCheckboxesDiv.style.paddingRight = "10px";
  sizesCheckboxesDiv.innerHTML = "<b>Size</b><br/>";
  for(var i = 0; i<sizes.length; i++ ){
    var checkboxDiv = createElement('span');

    checkboxDiv.style.border = '1px solid gray';
    checkboxDiv.style.margin = '2px';
    checkboxDiv.style.verticalAlign = 'middle';

    var checkbox = createElement('input', {type: 'checkbox', name: "size", value: sizes[i], id:"size"+sizes[i], checked: 'checked'});
    checkbox.style.margin = '0px';
    var label = createElement('label');
    label.setAttribute("for", "size"+sizes[i]);

    var caption = createElement('img');
    append(caption,label);
    caption.src = "http://www.geocaching.com/images/icons/container/"+sizes[i]+".gif";
    caption.title = sizes[i];
    caption.alt = sizes[i];

    sizesCheckboxesDiv.appendChild(checkbox);
    sizesCheckboxesDiv.appendChild(label);
    sizesCheckboxesDiv.appendChild(createElement('br'));
  }

  return sizesCheckboxesDiv;
}

function getTypeFilter(){
  var typeDiv = document.createElement('div');
  typeDiv.style.textAlign = "left";
  typeDiv.style.paddingLeft = "10px";
  typeDiv.style.paddingRight = "10px";
  typeDiv.style.textAlign = "left";
  typeDiv.style.cssFloat = "left";
  typeDiv.innerHTML = "<b>Type</b><br/>";

  for(var i = 0; i< wptArray.length;i++){
    var checkboxDiv = createElement('span');

    var checkbox = createElement('input', {type: 'checkbox', name: "type", value: wptArray[i].wptTypeId, id: "type"+wptArray[i].wptTypeId, checked: 'checked'});
    append(checkbox,checkboxDiv);
    checkbox.style.margin = '0px';

    var label = createElement('label');
    label.setAttribute("for", "type"+wptArray[i].wptTypeId);

    append(label,checkboxDiv);
    var caption = createElement('img');
    append(caption,label);
    caption.src = 'http://www.geocaching.com/images/WptTypes/sm/'+wptArray[i].wptTypeId+'.gif';

    append(checkboxDiv,typeDiv);

    if((i+1) % 2 === 0){
      typeDiv.appendChild(createElement('br'));
      checkboxDiv.style.paddingLeft = '10px';
    }
  }

  return typeDiv;
}

function getLocateMeButton() {
  var button = $("<button>", {
    css: {
      "margin-left": 10,
      "font-size": 12
    },
    html: "<img id='locateImage' src='" + $.gctour.img.locateMe + "'><span style='vertical-align:top;margin-left:3px;font-weight:bold'>" + $.gctour.lang('findMe') + "</span>"
  })
  
  .click(function() {
    if (navigator.geolocation) {
      $('locateImage').attr("src","http://madd.in/ajax-loader3.gif");
      navigator.geolocation.getCurrentPosition(
        function(position){
          $('locateImage').attr("src", $.gctour.img.locateMe);
          var latitude  = position.coords.latitude;
          var longitude = position.coords.longitude;

          $("input#markerCoords").val(latitude + ' ' + longitude);
          $("input#markerRadius").val(2);
          getMarkerCoord();
        },

        function(error){
          $('locateImage').attr("src", $.gctour.img.locateMe);
          log('Unable to get current location: ' + error);
        }, { timeout:10000 }
      );
    } else {
      alert("Firefox 3.5? Please update to use this!");
    }    
  });

  return button;
}

function getCoordinatesTab() {
  var coordsDiv = $("<div>", {
    id: "coordsDiv",
    css: {
      "clear": "both",
      "align": "left"
    }
  });

  var findMeButton = getLocateMeButton();
  findMeButton.css("cssFloat", "right");
  coordsDiv.append(findMeButton);

  var divEbene = createElement('div', {className: 'ebene'});

  divEbene.innerHTML = '<b>'+$.gctour.lang('autoTourCenter')+'</b>&nbsp;&nbsp;&nbsp;&nbsp;'+
    '<input type="text" id="markerCoords" style="width:350px;"><br/>'+
    '<small>'+$.gctour.lang('autoTourHelp')+'</small>';

  coordsDiv.append(divEbene);

  divEbene = createElement('div', {className: 'ebene'});
  divEbene.innerHTML = '<b>'+$.gctour.lang('autoTourRadius')+'</b>&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" id="markerRadius" maxlength="4" value="2" style="width:40px;margin-right:5px"><select id="markerRadiusUnit"><option selected="selected" value="km">'+$.gctour.lang('units.km')+'</option><option value="sm">'+$.gctour.lang('units.mi')+'</option></select>';
  coordsDiv.append(divEbene);

  divEbene = createElement('div');
  divEbene.setAttribute('class','dialogFooter');

  var useButton = createElement('input',{type:"button",value:$.gctour.lang('autoTourRefresh'),style:"background-image:url("+$.gctour.img.autoTour+");margin-top:-24px;"});append(useButton,divEbene);
  useButton.addEventListener('click',getMarkerCoord ,false);

  coordsDiv.append(divEbene);

  return coordsDiv;
}

function getMapPreviewTab(){
  var coordsDiv = createElement('div');
  coordsDiv.align = "left";
  coordsDiv.style.clear = "both";

  var cordsInputLat = createElement('input', {type: 'hidden', id: "coordsDivLat"});
  coordsDiv.appendChild(cordsInputLat);

  var cordsInputLon = createElement('input', {type: 'hidden', id: "coordsDivLon"});
  coordsDiv.appendChild(cordsInputLon);

  var cordsInputRadius = createElement('input', {type: 'hidden', id: "coordsDivRadius"});
  coordsDiv.appendChild(cordsInputRadius);

  var coordsLabel = createElement('div');append(coordsLabel, coordsDiv);
  coordsLabel.innerHTML = $.gctour.lang('markerCoordinate')+": <b id='markerCoordsPreview'>???</b>&nbsp;&nbsp;&nbsp;"+$.gctour.lang('autoTourRadius')+": <b id='markerRadiusPreview'>???km</b>";

  // previewMap
  var staticGMap = createElement('div');
  staticGMap.id = 'staticGMap';

  //~ staticGMap.style.border = '2px solid gray';
  //~ staticGMap.style.backgroundImage = "url("+$.gctour.img.preview+")";
  //~ staticGMap.style.backgroundPosition = "center";
  //~ staticGMap.style.backgroundRepeat = "no-repeat";
//~
  //~ staticGMap.style.height = '200px';
  //~ staticGMap.style.width = '400px';
  //~ staticGMap.style.backgroundRepeat = 'no-repeat';

  coordsDiv.appendChild(staticGMap);

  var cacheCountLabel = createElement('div');append(cacheCountLabel, coordsDiv);
  cacheCountLabel.innerHTML = $.gctour.lang('autoTourCacheCounts')+" <b id='markerCountPreview'>???</b>";
  var tourDurationLabel = createElement('div');append(tourDurationLabel, coordsDiv);
  tourDurationLabel.innerHTML = $.gctour.lang('autoTourDuration') + " <b id='markerDurationMin'>???</b> min <b id='markerDurationSec'>???</b> sec";

  return coordsDiv;
}

function getAutoTourSubmit(){
  var queryFilterDiv = document.createElement('div');
  var getCachesButton = createElement('button');append(getCachesButton, queryFilterDiv);
  getCachesButton.id="startQuery";
  getCachesButton.innerHTML = "<img src ='"+$.gctour.img.startAutoTour+"'>";
  getCachesButton.style.marginTop = "15px";
  getCachesButton.style.opacity = "0.4";
  getCachesButton.disabled = "disabled";

  getCachesButton.addEventListener('click', startAutoTour,false);
  return queryFilterDiv;
}

// waypoint projecting
function CalcPrjWP(lat,lon, dist, angle){
  var B1 = parseFloat(lat);
  var L1 = parseFloat(lon);
  var Dist = parseFloat(dist);
  var Angle = parseFloat(angle);
  var a, b, c, g, q, B2, L2;

  while (Angle > 360) {
    Angle = Angle - 360;
  }
  while (Angle < 0) {
    Angle = Angle + 360;
  }

  //var c = Dist / 6371.0; // KM
  c = Dist /  3958.75587; // miles
  if (B1 >= 0) {
    a = (90 - B1) * Math.PI / 180;
  } else {
    a = B1 * Math.PI / 180;
  }
  q = (360 - Angle) * Math.PI / 180;
  b = Math.acos(Math.cos(q) * Math.sin(a) * Math.sin(c) + Math.cos(a) * Math.cos(c));
  B2 = 90 - (b * 180 / Math.PI);
  if (B2 > 90) {
    B2 = B2 - 180; //Suedhalbkugel
  }
  if ((a + b) === 0) {
    g = 0; //Nenner unendlich
  } else {
    g = Math.acos( (Math.cos(c) - Math.cos(a) * Math.cos(b)) / (Math.sin(a) * Math.sin(b)) );
  }
  if (Angle <= 180) {
    g = (-1) * g;
  }
  L2 = (L1 - g * 180 / Math.PI);

  return [Math.round(B2 * 100000) / 100000,Math.round(L2 * 100000) / 100000];
}

function showAutoTourDialog(center, radius) {
  var overLay, queryFilterDiv;

  if (!isLogedIn()) { return; }

  overLay = getOverlay({
    caption: $.gctour.lang('autoTour'), 
    minimized: true
  });

  var autoTourContainer = $("<div>", {
    id: "autoTourContainer",
    css: {
      "display": "none",
      "clear": "both",
      "border-top": "2px dashed #B2D4F3",
      "margin-top": 12
    }
  });
  
  autoTourContainer.append(getMapPreviewTab());
  queryFilterDiv = $('<div>'); 
  
  queryFilterDiv.append(getTypeFilter());
  queryFilterDiv.append(getSizeFilter());
  queryFilterDiv.append(getDtFiler('Difficulty'));
  queryFilterDiv.append(getDtFiler('Terrain'));
  queryFilterDiv.append(getSpecialFilter());
  autoTourContainer.append(queryFilterDiv);
  autoTourContainer.append(getAutoTourSubmit());
  
  $(overLay).append(
    getCoordinatesTab(), 
    autoTourContainer
  );

  if(center && radius){
    $("input#markerCoords").val(center.lat.toFixed(5) + ' ' + center.lng.toFixed(5));
    $("input#markerRadius").val(radius);
    getMarkerCoord();
  } else {
    $("input#markerRadius").val(2);
    document.getElementById('markerCoords').focus();
      // greasemonkey component is not available with jquery
      //$("input#markerCoords:first").focus();
  }
}

