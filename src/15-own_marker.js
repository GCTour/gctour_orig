function showNewMarkerDialog(marker){
    var overlayMarker, dangerDanger, anTable, tr, td, nameInput, cordsInputLat, cordsInputLon, cordsInput,
        exampleCoords, staticGMap, staticGMapControl, zoomPlusButton, zoomMinusButton, contentTextarea,
        markerTypeTable, typeInput, trElement, i , tdElement, cancel, submit, errors, makerName, markerContent, 
        markerType, markerTypeSym, latitude, longitude,markerPosition, markerPositionDelta, entry, latArray,
        lonArray, latOrigin, lonOrigin;
 
	overlayMarker = getOverlay(lang['printviewMarker']);

	dangerDanger = document.createElement('div');dangerDanger.id = "dangerdanger";
	dangerDanger.style.visibility = "hidden";
	dangerDanger.style.cssFloat = "right";
	dangerDanger.innerHTML = "<img src='"+dangerImageString+"'>";
	overlayMarker.appendChild(dangerDanger);

	anTable = document.createElement('table');overlayMarker.appendChild(anTable);
	anTable.style.width = '100%';
	anTable.align = 'center';

    tr = document.createElement('tr');anTable.appendChild(tr);
	td = document.createElement('td');tr.appendChild(td);
	td.style.width = '20%';
	td.textContent = 'Name';

	td = document.createElement('td');tr.appendChild(td);
	vnameInput = document.createElement('input');td.appendChild(nameInput);
	nameInput.type = 'text';
	nameInput.id = 'markerName';


	tr = document.createElement('tr');anTable.appendChild(tr);
	td = document.createElement('td');tr.appendChild(td);
	td.textContent = lang["markerCoordinate"];

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
	cordsInput.style.width = '400px';
	cordsInput.style.marginRight = '5px';

	//~ cordsInput.addEventListener('keyup',window.setTimeout(saveMarkerCoord(cordsInput,cordsInputLon,cordsInputLon),0),false);
	cordsInput.addEventListener('keyup',saveMarkerCoord(cordsInput,cordsInputLat,cordsInputLon),false);
	cordsInput.addEventListener('paste',saveMarkerCoord(cordsInput,cordsInputLat,cordsInputLon),false);


	exampleCoords = document.createElement('div');
	exampleCoords.innerHTML = 	lang["example"] + ' <i>N51° 12.123 E010° 23.123</i> or <i>51.123 10.123</i>'

		td.appendChild(exampleCoords);



	tr = document.createElement('tr');anTable.appendChild(tr);
	td = document.createElement('td');tr.appendChild(td);
	td = document.createElement('td');tr.appendChild(td);	
	td.align = 'left';



	staticGMap = document.createElement('div');
	staticGMap.style.display = "none";
	staticGMap.id = 'staticGMap';
	staticGMap.style.border = '2px solid gray';
	staticGMap.style.height = '200px';
	staticGMap.style.width = '400px';
	staticGMap.style.marginBottom = '10px';
	staticGMap.style.backgroundRepeat = 'no-repeat';

	staticGMapControl = document.createElement('div');staticGMap.appendChild(staticGMapControl);
	staticGMapControl.style.padding = '3px 0px 0px 3px';
	staticGMapControl.style.width = '16px';
	staticGMapControl.style.cssFloat = 'left';

	zoomPlusButton = document.createElement('img');td.appendChild(zoomPlusButton);
	zoomPlusButton.style.opacity = '0.75';	
	zoomPlusButton.style.cursor = 'pointer';	
	zoomPlusButton.src = "http://www.geocaching.com/images/zoom_in.png";
	zoomPlusButton.addEventListener('click', zoomInMarkerOverviewMap(), false);		
	staticGMapControl.appendChild(zoomPlusButton);

	zoomMinusButton = document.createElement('img');td.appendChild(zoomMinusButton);
	zoomMinusButton.style.opacity = '0.75';	
	zoomMinusButton.style.cursor = 'pointer';	
	zoomMinusButton.src = "http://www.geocaching.com/images/zoom_out.png";
	zoomMinusButton.addEventListener('click', zoomOutMarkerOverviewMap(), false);		
	staticGMapControl.appendChild(zoomMinusButton);

	td.appendChild(staticGMap);

	tr = document.createElement('tr');anTable.appendChild(tr);
	td = document.createElement('td');tr.appendChild(td);
	td.innerHTML = lang["markerContent"]+'<br><div style="font-size:xx-small">('+lang["markerContentHint"]+')</div>';

	td = document.createElement('td');tr.appendChild(td);
	contentTextarea = document.createElement('textarea');td.appendChild(contentTextarea);
	contentTextarea.style.width = '400px';
	contentTextarea.id = 'markerContent';
	contentTextarea.rows = '5';



	// type buttons

	tr = document.createElement('tr');anTable.appendChild(tr);
	td = document.createElement('td');tr.appendChild(td);
	td.style.width = '20%';
	td.textContent = lang["markerType"];

	td = document.createElement('td');tr.appendChild(td);
	markerTypeTable = document.createElement('table');td.appendChild(markerTypeTable);
	markerTypeTable.id = 'markerType';

	typeArray = new Array(
			new Array('http://gctour.madd.in/map/icons/neu/RedFlag.png','Red Flag'),
			new Array('http://gctour.madd.in/map/icons/neu/BlueFlag.png','Blue Flag'),
			new Array('http://gctour.madd.in/map/icons/neu/GreenFlag.png','Green Flag'),
			new Array('http://gctour.madd.in/map/icons/neu/Geocache.png','Geocache'),
			new Array('http://gctour.madd.in/map/icons/neu/GeocacheFound.png','Geocache Found'),
			new Array('http://gctour.madd.in/map/icons/neu/Information.png','Information'),
			new Array('http://gctour.madd.in/map/icons/neu/Park.png','Park'),
			new Array('http://gctour.madd.in/map/icons/neu/ParkingArea.png','Parking'),
			new Array('http://gctour.madd.in/map/icons/neu/SkullAndBones.png','Skull And Crossbones')
			);
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

	trElement = document.createElement('tr');	markerTypeTable.appendChild(trElement);
	for(i = 0; i< 	typeArray.length ; i++ ){		
		tdElement = document.createElement('td');		
		if(!marker){
			if (i == 0) tdElement.style.backgroundColor = '#8C9E65';
		} else {
			if(typeArray[i][0] == marker.image){
				tdElement.style.backgroundColor = '#8C9E65';
			}
		}
		tdElement.style.cursor = 'pointer';
		tdElement.style.padding = '5px';
		tdElement.style.border = '1px solid silver';
		tdElement.innerHTML = "<img src='"+typeArray[i][0]+"'>";
		tdElement.addEventListener('click', changeType(typeArray[i],markerTypeTable,typeArray), false);

		trElement.appendChild(tdElement);
	}




	// in the end please add a save and cancel button	
	tr = document.createElement('tr');anTable.appendChild(tr);
	td = document.createElement('td');tr.appendChild(td);
	td.colSpan = '2';
	td.align = 'right';

	cancel = document.createElement('input');
	cancel.type = "button";
	cancel.value = lang["cancel"];
	cancel.style.marginRight= "10px";
	cancel.addEventListener('click', closeOverlay, false);
	td.appendChild(cancel);


	submit = document.createElement('input');
	submit.type = "button";
	submit.value = lang["save"];
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

			if(errors != 0){

				document.getElementById('dangerdanger').style.visibility = "visible";

				return;
			} 



			latitude =  document.getElementById('cordsInputLat').value*1;
			longitude =  document.getElementById('cordsInputLon').value*1;

			if(marker){
				markerPosition = getPositionsOfId(marker.id);
				markerPositionDelta = markerPosition -  currentTour.geocaches.length +1;
				deleteElementFunction(marker.id)();
			} else {
				markerPositionDelta = 0;
			}

			entry = addCustomMarker(markerName.value, latitude, longitude, markerContent.value, markerType.value, markerTypeSym.value);
			move(entry.id, markerPositionDelta);

			closeOverlay()

	}

	, false);

	td.appendChild(submit);



	// now set all previous values IFF a marker is given

	if(marker){
		nameInput.value = marker.name;
		cordsInputLat.value = marker.lat;	// 51.123123
		cordsInputLon.value = marker.lon;	// 123.12333


		latArray = Dec2DM(marker.lat);
		lonArray = Dec2DM(marker.lon);

		latOrigin = (latArray[0]<0)?"S":"N";
		lonOrigin = (lonArray[0]<0)?"W":"E";

		latArray[0] = (latArray[0]<0)?latArray[0]*(-1):latArray[0];
		lonArray[0] = (lonArray[0]<0)?lonArray[0]*(-1):lonArray[0];

		cordsInput.value = latOrigin+""+latArray[0]+"° "+latArray[1]+" ";
		cordsInput.value += lonOrigin+""+lonArray[0]+"° "+lonArray[1];
		cordsInput.style.backgroundColor = "#88DC3B";
		//~ updateMarkerOverviewMap(cordsInputLat.value ,cordsInputLon.value,13); // update map

		contentTextarea.innerHTML = marker.content;

	}

	// set the focus to the maker name input
	nameInput.focus();
}

function zoomInMarkerOverviewMap(){
	return function(){

		var staticGMap = document.getElementById('staticGMap');
		var zoom = staticGMap.style.backgroundImage.split('&zoom=')[1].split('&')[0];
		var lat = staticGMap.style.backgroundImage.split('&markers=')[1].split(',')[0];
		var lon = staticGMap.style.backgroundImage.split('&markers=')[1].split(',')[1];
		updateMarkerOverviewMap(lat,lon,zoom-(-1));
	}
}

function zoomOutMarkerOverviewMap(){
	return function(){

		var staticGMap = document.getElementById('staticGMap');
		var zoom = staticGMap.style.backgroundImage.split('&zoom=')[1].split('&')[0];
		var lat = staticGMap.style.backgroundImage.split('&markers=')[1].split(',')[0];
		var lon = staticGMap.style.backgroundImage.split('&markers=')[1].split(',')[1];
		updateMarkerOverviewMap(lat,lon,zoom-1);
	}
}


function updateMarkerOverviewMap(lat,lon,zoom){
	var minZoom = 0;
	var maxZoom = 19;

	// zoom out of range? please stop doing it ;-)
	if(zoom < minZoom || zoom > maxZoom)
		return;

	debug("Updating map in marker window: " +lat + " " + lon + " Zoom:"+zoom);

	var apiKey = "ABQIAAAAKUykc2Tomn0DYkEZVrVaaRSNBTQkd3ybMgPO53QyT8hP9fzjBxSrEmDQGeGO-AZdQ4ogAvc8mRcV-g";
	var staticGMap = document.getElementById('staticGMap');
	staticGMap.style.backgroundImage = 'url(http://maps.google.com/staticmap?sensor=false&size=400x200&zoom='+zoom+'&markers='+lat+','+lon+',midred&key='+apiKey+')';
}

function changeType(value,table,typeArray){
	return function(){
		document.getElementById('typeInput').value = value[0];
		document.getElementById('typeInputSym').value = value[1];
		table.innerHTML = "";

		var trElement = document.createElement('tr');	table.appendChild(trElement);
		for( var i = 0; i< 	typeArray.length ; i++ ){
			var tdElement = document.createElement('td');
			if (typeArray[i][0] == value[0]) tdElement.style.backgroundColor = '#8C9E65';
			tdElement.style.cursor = 'pointer';
			tdElement.style.padding = '5px';
			tdElement.style.border = '1px solid silver';
			tdElement.innerHTML = "<img src='"+typeArray[i][0]+"'>";
			tdElement.addEventListener('click', changeType(typeArray[i],table,typeArray), false);

			trElement.appendChild(tdElement);
		}
	}	
}
