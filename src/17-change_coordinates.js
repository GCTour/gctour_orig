function openChangeCoordinates(){
    var overlayMarker, dangerDanger, anTable, tr, td, nameInput, cordsInputLat, cordsInputLon, cordsInput,
        exampleCoords, staticGMap, staticGMapControl, zoomPlusButton, zoomMinusButton, contentTextarea,
        markerTypeTable, typeInput, trElement, i , tdElement, cancel, submit, errors, makerName, markerContent, 
        markerType, markerTypeSym, latitude, longitude,markerPosition, markerPositionDelta, entry, latArray,
        lonArray, latOrigin, lonOrigin;
 
	overlayMarker = getOverlay({caption:lang['moveGeocache'],minimized:true});

	anTable = document.createElement('table');overlayMarker.appendChild(anTable);
	anTable.style.width = '100%';
	anTable.align = 'center';
	
	tr = document.createElement('tr');anTable.appendChild(tr);
	td = document.createElement('td');tr.appendChild(td);
	td.colSpan = 2;
	td.innerHTML = lang.moveGeocacheHelp;
	

    tr = document.createElement('tr');anTable.appendChild(tr);
	td = document.createElement('td');tr.appendChild(td);
	td.style.width = '20%';
	td.textContent = lang['originalCoordinates'];


	var coordinates = dojo.byId('ctl00_ContentBody_LatLon').textContent;
	
	try{
		coordinates = coordinates.split("(")[1].split(")")[0];
	} catch(e){
		coordinates = coordinates;
	}
	
	var cacheId = trim(document.getElementById('ctl00_uxWaypointName').textContent);
			
	
	td = document.createElement('td');tr.appendChild(td);
	nameInput = document.createElement('input');td.appendChild(nameInput);
	nameInput.type = 'text';
	nameInput.id = 'markerName';	
	nameInput.value = coordinates;
	nameInput.style.width = '350px';
	nameInput.style.marginRight = '5px';
	nameInput.disabled = 'disabled';


	tr = document.createElement('tr');anTable.appendChild(tr);
	td = document.createElement('td');tr.appendChild(td);
	td.textContent = lang['newCoordinates'];

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

	

	cordsInput.addEventListener('keyup',saveMarkerCoord(cordsInput,cordsInputLat,cordsInputLon),false);
	cordsInput.addEventListener('paste',saveMarkerCoord(cordsInput,cordsInputLat,cordsInputLon),false);


	exampleCoords = document.createElement('div');
	exampleCoords.innerHTML = 	"<small>"+lang["example"]+" " + lang['exampleCoords'] + "</small>";

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
	staticGMap.style.width = '350px';
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


	// in the end please add a save and cancel button	
	
	var buttonsDiv = createElement('div');append(buttonsDiv,overlayMarker);
	buttonsDiv.setAttribute('class','dialogFooter');
	
	
	cancel = createElement('input',{type:"button",value:lang["cancel"],style:"background-image:url("+closebuttonImage+")"});append(cancel,buttonsDiv);
	cancel.addEventListener('click', closeOverlay, false);


	submit = createElement('input',{type:"button",value:lang["save"],style:"background-image:url("+saveImage+")"});append(submit,buttonsDiv);
	submit.addEventListener('click', function(){	
			GM_setValue('coords_'+cacheId, cordsInputLat.value+'#'+cordsInputLon.value);
			changeCoordinates(Dec2DM_String(cordsInputLat.value,cordsInputLon.value));
			
			closeOverlay();

	}

	, false);




	// now set all previous values IFF a marker is given

	if(GM_getValue('coords_'+cacheId,"null") != "null"){
		var coords_cacheId = GM_getValue('coords_'+cacheId);
		marker = [];
		marker.latitude = coords_cacheId.split('#')[0];
		marker.longitude = coords_cacheId.split('#')[1];
		
		
		cordsInputLat.value = marker.latitude;	// 51.123123
		cordsInputLon.value = marker.longitude;	// 123.12333


		latArray = Dec2DM(marker.latitude);
		lonArray = Dec2DM(marker.longitude);

		latOrigin = (latArray[0]<0)?"S":"N";
		lonOrigin = (lonArray[0]<0)?"W":"E";

		latArray[0] = (latArray[0]<0)?latArray[0]*(-1):latArray[0];
		lonArray[0] = (lonArray[0]<0)?lonArray[0]*(-1):lonArray[0];

		cordsInput.value = latOrigin+""+latArray[0]+"° "+latArray[1]+" ";
		cordsInput.value += lonOrigin+""+lonArray[0]+"° "+lonArray[1];
		cordsInput.style.backgroundColor = "#88DC3B";

		updateMarkerOverviewMap(cordsInputLat.value ,cordsInputLon.value,13); // update map
		
		

	} else {
		cordsInput.value = coordinates;
		saveMarkerCoord(cordsInput,cordsInputLat,cordsInputLon)();
	}

}

function changeCoordinates(coordinates){
	var coordinates_ele = dojo.byId('ctl00_ContentBody_LatLon');
	try{
		var coordinates_org = coordinates_ele.textContent.split("(")[1].split(")")[0];
	} catch(e){
		var coordinates_org = coordinates_ele.textContent;
	}
	
	coordinates_ele.innerHTML = "<div style='font-size:110%'>"+coordinates+"&nbsp;&nbsp;<small>changed by GCTour</small></div><small>("+coordinates_org+")</small>";
	
}
