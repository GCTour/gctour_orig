function showNewMarkerDialog(marker){
    var overlayMarker, dangerDanger, anTable, tr, td, nameInput, cordsInputLat, cordsInputLon, cordsInput,
        exampleCoords, staticGMap, staticGMapControl, zoomPlusButton, zoomMinusButton, contentTextarea,
        markerTypeTable, typeInput, trElement, i , tdElement, cancel, submit, errors, makerName, markerContent, 
        markerType, markerTypeSym, latitude, longitude,markerPosition, markerPositionDelta, entry, latArray,
        lonArray, latOrigin, lonOrigin;
 
	overlayMarker = getOverlay({caption:lang['printviewMarker'],minimized:true});

	dangerDanger = document.createElement('div');dangerDanger.id = "dangerdanger";
	dangerDanger.style.visibility = "hidden";
	dangerDanger.style.cssFloat = "right";
	dangerDanger.innerHTML = "<img src='"+dangerImageString+"'>";
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
	cordsInput.style.width = '350px';
	cordsInput.style.marginRight = '5px';
	
	
	var wptcodeInput = document.createElement('input');td.appendChild(wptcodeInput);
	wptcodeInput.type = "hidden";
	wptcodeInput.id = 'wptcodeInput';

	



	exampleCoords = document.createElement('div');
	exampleCoords.innerHTML = 	lang["example"] + ' <i>N51° 12.123 E010° 23.123</i> or <i>51.123 10.123</i>'

	td.appendChild(exampleCoords);



	tr = document.createElement('tr');anTable.appendChild(tr);
	td = document.createElement('td');tr.appendChild(td);
	td = document.createElement('td');tr.appendChild(td);	
	td.align = 'left';



	staticGMap = document.createElement('div');
	
	
	var staticMap = new StaticMap(staticGMap,{});

	
	var checkMarkerCoord = function(input){
		return function(){
			var coords = parseCoordinates(input.value);
			
			if(coords == false){
				cordsInput.style.backgroundColor = "#FF8888";
			} else {
				cordsInput.style.backgroundColor = "#88DC3B";
				cordsInputLat.value = coords.latitude;
				cordsInputLon.value = coords.longitude;
				
				staticMap.setCoordinates(coords.latitude,coords.longitude);
				
			}
		}
	};
	
	
	cordsInput.addEventListener('keyup',checkMarkerCoord(cordsInput),false);
	cordsInput.addEventListener('paste',checkMarkerCoord(cordsInput),false);

	td.appendChild(staticGMap);

	tr = document.createElement('tr');anTable.appendChild(tr);
	td = document.createElement('td');tr.appendChild(td);
	td.innerHTML = lang["markerContent"]+'<br><div style="font-size:xx-small">('+lang["markerContentHint"]+')</div>';

	td = document.createElement('td');tr.appendChild(td);
	contentTextarea = document.createElement('textarea');td.appendChild(contentTextarea);
	contentTextarea.style.width = '350px';
	contentTextarea.id = 'markerContent';
	contentTextarea.rows = '5';



	// type buttons

	tr = document.createElement('tr');anTable.appendChild(tr);
	td = document.createElement('td');tr.appendChild(td);
	td.style.width = '20%';
	td.textContent = lang["markerType"];

	td = document.createElement('td');tr.appendChild(td);
	markerTypeTable = createElement('table',{style:"width:auto;"});td.appendChild(markerTypeTable);
	markerTypeTable.id = 'markerType';

	typeArray = new Array(
			new Array('http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/RedFlag.png','Red Flag'),
			new Array('http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/BlueFlag.png','Blue Flag'),
			new Array('http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/GreenFlag.png','Green Flag'),
			new Array('http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/Geocache.png','Geocache'),
			new Array('http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/GeocacheFound.png','Geocache Found'),
			new Array('http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/Information.png','Information'),
			new Array('http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/Park.png','Park'),
			new Array('http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/ParkingArea.png','Parking'),
			new Array('http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/SkullAndBones.png','Skull And Crossbones')
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

	trElement = createElement('tr',{style:"height:27px;"});	markerTypeTable.appendChild(trElement);
	for(i = 0; i< 	typeArray.length ; i++ ){		
		tdElement = createElement('td',{style:"width:25px;"});		
		
		tdElement.style.background ="url("+typeArray[i][0]+") center center no-repeat";
		if(!marker){
			if (i == 0) tdElement.style.backgroundColor = '#B2D4F3';
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
	
	
	cancel = createElement('input',{type:"button",value:lang["cancel"],style:"background-image:url("+closebuttonImage+")"});append(cancel,buttonsDiv);
	cancel.addEventListener('click', closeOverlay, false);


	submit = createElement('input',{type:"button",value:lang["save"],style:"background-image:url("+saveImage+")"});append(submit,buttonsDiv);
	

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
				deleteElementFunction((marker.id)?marker.id:marker.wptcode)();
			} else {
				markerPositionDelta = 0;
			}
		
			var wptCode =  document.getElementById('wptcodeInput').value;

			entry = addCustomMarker(markerName.value, latitude, longitude, markerContent.value, markerType.value, markerTypeSym.value,wptCode);
			move(entry.id, markerPositionDelta);

			closeOverlay()

	}

	, false);



	// now set all previous values IFF a marker is given

	if(marker){
		nameInput.value = marker.name;
		cordsInputLat.value = marker.latitude;	// 51.123123
		cordsInputLon.value = marker.longitude;	// 123.12333
		wptcodeInput.value = marker.wptcode;	// 123.12333#12312412312


		latArray = Dec2DM(marker.latitude);
		lonArray = Dec2DM(marker.longitude);

		latOrigin = (latArray[0]<0)?"S":"N";
		lonOrigin = (lonArray[0]<0)?"W":"E";

		latArray[0] = (latArray[0]<0)?latArray[0]*(-1):latArray[0];
		lonArray[0] = (lonArray[0]<0)?lonArray[0]*(-1):lonArray[0];

		cordsInput.value = (Dec2DM_String(marker.latitude,marker.longitude));

		//~ cordsInput.value = latOrigin+""+latArray[0]+"° "+latArray[1]+" ";
		//~ cordsInput.value += lonOrigin+""+lonArray[0]+"° "+lonArray[1];
		cordsInput.style.backgroundColor = "#88DC3B";
		//~ updateMarkerOverviewMap(cordsInputLat.value ,cordsInputLon.value,13); // update map

		contentTextarea.innerHTML = marker.content;
		checkMarkerCoord(cordsInput)();
	}

	// set the focus to the maker name input
	nameInput.focus();
}

function zoomInMarkerOverviewMap(){
	return function(){
        var staticGMap, zoom, lat, lon;

		staticGMap = document.getElementById('staticGMap');
	    zoom = staticGMap.style.backgroundImage.split('&zoom=')[1].split('&')[0];
		lat = staticGMap.style.backgroundImage.split('&markers=')[1].split(',')[0];
		lon = staticGMap.style.backgroundImage.split('&markers=')[1].split(',')[1];
		updateMarkerOverviewMap(lat,lon,zoom-(-1));
	}
}

function zoomOutMarkerOverviewMap(){
	return function(){
	    var staticGMap, zoom, lat, lon;

		staticGMap = document.getElementById('staticGMap');
	    zoom = staticGMap.style.backgroundImage.split('&zoom=')[1].split('&')[0];
		lat = staticGMap.style.backgroundImage.split('&markers=')[1].split(',')[0];
		lon = staticGMap.style.backgroundImage.split('&markers=')[1].split(',')[1];
		updateMarkerOverviewMap(lat,lon,zoom-1);
	}
}


function updateMarkerOverviewMap(lat,lon,zoom){
	var minZoom = 0,
	    maxZoom = 19,
        apiKey = "ABQIAAAAKUykc2Tomn0DYkEZVrVaaRSNBTQkd3ybMgPO53QyT8hP9fzjBxSrEmDQGeGO-AZdQ4ogAvc8mRcV-g",
        staticGMap;
	// zoom out of range? please stop doing it ;-)
	if(zoom < minZoom || zoom > maxZoom)
		return;

	debug("Updating map in marker window: " +lat + " " + lon + " Zoom:"+zoom);

    staticGMap = document.getElementById('staticGMap');
    staticGMap.style.display = 'block'
	staticGMap.style.backgroundImage = 'url(http://maps.google.com/staticmap?sensor=false&size=350x200&zoom='+zoom+'&markers='+lat+','+lon+',midred&key='+apiKey+')';
}

function changeType(value,table,typeArray,staticMap){
	return function(){
	    var trElement, i, tdElement;
	
		document.getElementById('typeInput').value = value[0];
		document.getElementById('typeInputSym').value = value[1];
		
		staticMap.setIcon(value[0]);
		
		table.innerHTML = "";

		trElement = createElement('tr',{style:"height:27px"});	table.appendChild(trElement);
		for( i = 0; i< 	typeArray.length ; i++ ){
			tdElement = createElement('td',{style:"width:25px;"});
			tdElement.style.cursor = 'pointer';
			tdElement.style.padding = '0px';
			tdElement.style.border = '1px solid silver';
			tdElement.style.background ="url("+typeArray[i][0]+") center center no-repeat";
			if (typeArray[i][0] == value[0]){tdElement.style.backgroundColor = '#B2D4F3';}
			tdElement.addEventListener('click', changeType(typeArray[i],table,typeArray,staticMap), false);

			trElement.appendChild(tdElement);
		}
	}	
}

function saveMarkerCoord(cordsInput,cordsInputLat,cordsInputLon){
	return function(){
		var regex = new RegExp(/(N|S)(\s*)(\d{0,2})(\s*)°(\s*)(\d{0,2}[\.,]\d+)(\s*)(E|W)(\s*)(\d{0,3})(\s*)°(\s*)(\d{0,2}[\.,]\d+)/);
		var regex2 = new RegExp(/(-{0,1}\d{0,2}[\.,]\d+)(\s*)(-{0,1}\d{0,3}[\.,]\d+)/);
		window.setTimeout(
				function(){
				var result = regex.exec(cordsInput.value);
				var result2 = regex2.exec(cordsInput.value);

				log(result +" " +result2);
				if (!result && !result2) {
				cordsInput.style.backgroundColor = "#FF8888";

				} else if (result) {
				cordsInput.style.backgroundColor = "#88DC3B";

				var lat = DM2Dec(result[3],result[6]);
				if(result[1] == 'S') lat = lat * (-1);
				cordsInputLat.value = lat;

				var lon = DM2Dec(result[10],result[13]);
				if(result[8] == 'W') lon = lon * (-1);
				cordsInputLon.value = lon;
				document.getElementById('staticGMap').style.display = 'block';
				updateMarkerOverviewMap(cordsInputLat.value ,cordsInputLon.value,13);
				}else if (result2) {
					cordsInput.style.backgroundColor = "#88DC3B";
					var lat = parseFloat(result2[1]+""+result2[2]);
					var lon = parseFloat(result2[3]+""+result2[4]);

					cordsInputLat.value = lat;
					cordsInputLon.value = lon;
					document.getElementById('staticGMap').style.display = 'block';
					updateMarkerOverviewMap(cordsInputLat.value ,cordsInputLon.value,13);
				}

				},10);
	}
}
