function changeType(value,table,typeArray,staticMap){
  return function(){
    var trElement, i, tdElement;

    document.getElementById('typeInput').value = value[0];
    document.getElementById('typeInputSym').value = value[1];

    staticMap.setIcon(value[0]);

    table.innerHTML = "";

    trElement = createElement('tr',{style:"height:27px"});  table.appendChild(trElement);
    for( i = 0; i<   typeArray.length ; i++ ){
      tdElement = createElement('td',{style:"width:25px;"});
      tdElement.style.cursor = 'pointer';
      tdElement.style.padding = '0px';
      tdElement.style.border = '1px solid silver';
      tdElement.style.background ="url("+typeArray[i][0]+") center center no-repeat";
      if (typeArray[i][0] == value[0]){tdElement.style.backgroundColor = '#B2D4F3';}
      tdElement.addEventListener('click', changeType(typeArray[i],table,typeArray,staticMap), false);

      trElement.appendChild(tdElement);
    }
  };
}

function showNewMarkerDialog(marker){
  var overlayMarker, dangerDanger, anTable, tr, td, nameInput, cordsInputLat, cordsInputLon, cordsInput,
      exampleCoords, staticGMap, staticGMapControl, zoomPlusButton, zoomMinusButton, contentTextarea,
      markerTypeTable, typeInput, trElement, i , tdElement, cancel, submit, errors, makerName, markerContent,
      markerType, markerTypeSym, latitude, longitude,markerPosition, markerPositionDelta, entry, latArray,
      lonArray, latOrigin, lonOrigin;

  overlayMarker = getOverlay({caption:$.gctour.lang('printviewMarker'),minimized:true});

  dangerDanger = document.createElement('div');dangerDanger.id = "dangerdanger";
  dangerDanger.style.visibility = "hidden";
  dangerDanger.style.cssFloat = "right";
  dangerDanger.innerHTML = "<img src='"+$.gctour.img.danger+"'>";
  overlayMarker.appendChild(dangerDanger);

  anTable = document.createElement('table');overlayMarker.appendChild(anTable);
  anTable.style.width = '100%';
  anTable.style.clear = 'both';
  anTable.align = 'center';

    tr = document.createElement('tr');anTable.appendChild(tr);
  td = document.createElement('td');tr.appendChild(td);
  td.style.width = '20%';
  td.textContent = 'Name';

  td = document.createElement('td');tr.appendChild(td);
  nameInput = document.createElement('input');td.appendChild(nameInput);
  nameInput.type = 'text';
  nameInput.id = 'markerName';


  tr = document.createElement('tr');anTable.appendChild(tr);
  td = document.createElement('td');tr.appendChild(td);
  td.textContent = $.gctour.lang('markerCoordinate');

  td = document.createElement('td');tr.appendChild(td);

  cordsInputLat = document.createElement('input');td.appendChild(cordsInputLat);
  cordsInputLat.type = "hidden";
  cordsInputLat.id = 'cordsInputLat';
  cordsInputLon = document.createElement('input');td.appendChild(cordsInputLon);
  cordsInputLon.type = "hidden";
  cordsInputLon.id = 'cordsInputLon';

  cordsInput = document.createElement('input');td.appendChild(cordsInput);
  cordsInput.type = 'text';
  cordsInput.id = 'markerCoords';
  cordsInput.style.width = '450px';
  cordsInput.style.marginRight = '5px';

  var wptcodeInput = document.createElement('input');td.appendChild(wptcodeInput);
  wptcodeInput.type = "hidden";
  wptcodeInput.id = 'wptcodeInput';

  exampleCoords = document.createElement('div');
  exampleCoords.innerHTML = $.gctour.lang('example') + ' <i>N51° 12.123 E010° 23.123</i> or <i>51.123 10.123</i>';

  td.appendChild(exampleCoords);

  tr = document.createElement('tr');anTable.appendChild(tr);
  td = document.createElement('td');tr.appendChild(td);
  td = document.createElement('td');tr.appendChild(td);
  td.align = 'left';

  staticGMap = document.createElement('div');

  var staticMap = new StaticMap($(staticGMap),{width: 450, height: 300,});

  var checkMarkerCoord = function(input){
    return function(){
      var coords = parseCoordinates(input.value);

      if(coords === false){
        cordsInput.style.backgroundColor = "#FF8888";
      } else {
        cordsInput.style.backgroundColor = "#88DC3B";
        cordsInputLat.value = coords._lat;
        cordsInputLon.value = coords._lon;

        staticMap.setCoordinates(coords._lat,coords._lon);
      }
    };
  };

  cordsInput.addEventListener('keyup',checkMarkerCoord(cordsInput),false);
  cordsInput.addEventListener('paste',checkMarkerCoord(cordsInput),false);

  td.appendChild(staticGMap);

  tr = document.createElement('tr');anTable.appendChild(tr);
  td = document.createElement('td');tr.appendChild(td);
  td.innerHTML = $.gctour.lang('markerContent')+'<br/><div style="font-size:xx-small">('+$.gctour.lang('markerContentHint')+')</div>';

  td = document.createElement('td');tr.appendChild(td);
  contentTextarea = document.createElement('textarea');td.appendChild(contentTextarea);
  contentTextarea.style.width = '450px';
  contentTextarea.id = 'markerContent';
  contentTextarea.rows = '5';

  // type buttons

  tr = document.createElement('tr');anTable.appendChild(tr);
  td = document.createElement('td');tr.appendChild(td);
  td.style.width = '20%';
  td.textContent = $.gctour.lang('markerType');

  td = document.createElement('td');tr.appendChild(td);
  markerTypeTable = createElement('table',{style:"width:auto;"});td.appendChild(markerTypeTable);
  markerTypeTable.id = 'markerType';

  typeArray = [
      ['http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/RedFlag.png','Red Flag'],
      ['http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/BlueFlag.png','Blue Flag'],
      ['http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/GreenFlag.png','Green Flag'],
      ['http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/Geocache.png','Geocache'],
      ['http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/GeocacheFound.png','Geocache Found'],
      ['http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/Information.png','Information'],
      ['http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/Park.png','Park'],
      ['http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/ParkingArea.png','Parking'],
      ['http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/SkullAndBones.png','Skull And Crossbones']
  ];
  // iff we are editing a marker - so please set the right type
  typeInput = document.createElement('input');
  typeInput.id = 'typeInput';
  typeInput.type = 'hidden';
  if(!marker){
    typeInput.value = typeArray[0][0];
  } else {
    typeInput.value = marker.image;
  }
  overlayMarker.appendChild(typeInput);

  typeInput = document.createElement('input');
  typeInput.id = 'typeInputSym';
  typeInput.type = 'hidden';
  if(!marker){
    typeInput.value = typeArray[0][1];
  } else {
    typeInput.value = marker.symbol;
  }
  overlayMarker.appendChild(typeInput);

  trElement = createElement('tr',{style:"height:27px;"});  markerTypeTable.appendChild(trElement);
  for(i = 0; i<   typeArray.length ; i++ ){
    tdElement = createElement('td',{style:"width:25px;"});

    tdElement.style.background ="url("+typeArray[i][0]+") center center no-repeat";
    if(!marker){
      if (i === 0) { tdElement.style.backgroundColor = '#B2D4F3'; }
      staticMap.setIcon(typeArray[0][0]);
    } else {
      if(typeArray[i][0] == marker.image){
        tdElement.style.backgroundColor = '#B2D4F3';
        staticMap.setIcon(marker.image);
      }
    }
    tdElement.style.cursor = 'pointer';
    tdElement.style.padding = '0px';
    tdElement.style.border = '1px solid silver';
    //~ tdElement.innerHTML = "<img src='"+typeArray[i][0]+"'>";
    tdElement.addEventListener('click', changeType(typeArray[i],markerTypeTable,typeArray,staticMap), false);

    trElement.appendChild(tdElement);
  }

  staticMap.hide();

  // in the end please add a save and cancel button
  tr = document.createElement('tr');anTable.appendChild(tr);
  td = document.createElement('td');tr.appendChild(td);
  td.colSpan = '2';
  td.align = 'right';

  var buttonsDiv = createElement('div');append(buttonsDiv,overlayMarker);
  buttonsDiv.setAttribute('class','dialogFooter');

  cancel = createElement('input',{type:"button",value:$.gctour.lang('cancel'),style:"background-image:url("+$.gctour.img.closebutton+")"});append(cancel,buttonsDiv);
  cancel.addEventListener('click', closeOverlay, false);

  submit = createElement('input',{type:"button",value:$.gctour.lang('save'),style:"background-image:url("+$.gctour.img.save+")"});append(submit,buttonsDiv);

  submit.addEventListener('click', function(){
    errors = 0;
    markerName = document.getElementById('markerName');
    if (markerName.value != "") {
    markerName.style.backgroundColor = "#FFFFFF";
    } else {
    markerName.style.backgroundColor = "#FF8888";
    errors++;
    }
    markerCoords = document.getElementById('markerCoords');

    if(markerCoords.style.backgroundColor != "rgb(136, 220, 59)"){
    markerCoords.style.backgroundColor = "#FF8888";
    errors++;
    }
    markerContent = document.getElementById('markerContent');

    markerType = document.getElementById('typeInput');
    markerTypeSym = document.getElementById('typeInputSym');
    if(errors !== 0){
      document.getElementById('dangerdanger').style.visibility = "visible";
      return;
    }

    latitude =  document.getElementById('cordsInputLat').value*1;
    longitude =  document.getElementById('cordsInputLon').value*1;
    if(marker){
      markerPosition = getPositionsOfId(marker.id);
      markerPositionDelta = markerPosition - currentTour.geocaches.length +1;
      deleteElementFunction((marker.id)?marker.id:marker.wptcode)();
    } else {
      markerPositionDelta = 0;
    }

    var wptCode =  document.getElementById('wptcodeInput').value;

    entry = addCustomMarker(markerName.value, latitude, longitude, markerContent.value, markerType.value, markerTypeSym.value,wptCode);
    move(entry.id, markerPositionDelta);

    closeOverlay();

  }, false);

  // now set all previous values IFF a marker is given

  if(marker){
    nameInput.value = marker.name;
    cordsInputLat.value = marker.latitude;  // 51.123123
    cordsInputLon.value = marker.longitude;  // 123.12333
    wptcodeInput.value = marker.wptcode;  // 123.12333#12312412312

    var latLon = new LatLon(marker.latitude,marker.longitude);
    cordsInput.value = latLon.toString("dm");
    cordsInput.style.backgroundColor = "#88DC3B";
    contentTextarea.innerHTML = marker.content;
    checkMarkerCoord(cordsInput)();
  }

  // set the focus to the maker name input
  nameInput.focus();
}

