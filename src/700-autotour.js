// autoTour gui

function updateAutoTourMap(lat,lon){

	//make the container visible
	dojo.byId('autoTourContainer').style.display = 'block';

	var radiusOrg = dojo.query("input[id='markerRadius']")[0].value;
	if(isNaN(radiusOrg) || radiusOrg == "") {// please break if radius is no number
		return;
	}

	var meterMiles = dojo.query("select[id='markerRadiusUnit']")[0].selectedIndex;
	// meter: meterMiles == 0		miles: meterMiles == 1
	var radiusMiles = (meterMiles==1)?parseFloat(radiusOrg):parseFloat(radiusOrg)*0.621371;

	if(radiusMiles == "") {
		return;
	}

	var staticGMap = dojo.query('div[id="staticGMap"]')[0];
	staticGMap.innerHTML = "";

	// create new static map with changed coordinates
	var SM = new StaticMap(staticGMap,{'lat':lat,'lon':lon,radius:radiusMiles,width:470});

	dojo.query('b[id="markerCoordsPreview"]')[0].innerHTML = new LatLon(lat,lon).toString();

	dojo.query('b[id="markerRadiusPreview"]')[0].innerHTML = radiusOrg+""+((meterMiles==1)?"mi":"km");

	dojo.animateProperty({
		node: "markerCoordsPreview",duration: 1000,
		properties: {
			//~ color:         { start: "black", end: "white" },
			backgroundColor:   { start: "#FFE000", end: "#FFFFFF" }
		}
	}).play();

	dojo.animateProperty({
		node: "markerRadiusPreview",duration: 1000,
		properties: {
			//~ color:         { start: "black", end: "white" },
			backgroundColor:   { start: "#FFE000", end: "#FFFFFF" }
		}
	}).play();

	// get how many caches are in this area

	loadingTime1 = new Date();

	log("url: http://www.geocaching.com/seek/nearest.aspx?lat="+lat+"&lng="+lon+"&dist="+radiusMiles);
		GM_xmlhttpRequest({
		method: 'GET',
		url: "http://www.geocaching.com/seek/nearest.aspx?lat="+lat+"&lng="+lon+"&dist="+radiusMiles,
		onload: function(responseDetails) {
			var dummyDiv = createElement('div');
			dummyDiv.innerHTML = responseDetails.responseText;

			var pagesSpan = dojo.query("td[class='PageBuilderWidget']",dummyDiv)[0];

			if(pagesSpan){
				dojo.query("b[id='markerCountPreview']")[0].innerHTML = pagesSpan.getElementsByTagName('b')[0].innerHTML;

				dojo.animateProperty({
					node: "markerCountPreview",duration: 1000,
					properties: {backgroundColor:   { start: "#FFE000", end: "#FFFFFF" }}
				}).play();

				var miliseconds = new Date() - loadingTime1;
				var seconds = Math.floor((miliseconds * parseFloat(pagesSpan.getElementsByTagName('b')[2].innerHTML) )/1000);
				seconds = seconds + parseFloat(pagesSpan.getElementsByTagName('b')[2].innerHTML) * 2;
				var secondsMod = seconds % 60;
				var minutes = (seconds - secondsMod) /60;

				dojo.query("b[id='markerDurationMin']")[0].innerHTML = minutes;
				dojo.query("b[id='markerDurationSec']")[0].innerHTML = secondsMod;
			} else {
				dojo.query("b[id='markerCountPreview']")[0].innerHTML = 0;

				dojo.animateProperty({
					node: "markerCountPreview",duration: 2000,
					properties: {backgroundColor:{ start: "#FF0005", end: "#FFFFFF" }}
				}).play();

				dojo.query("b[id='markerDurationMin']")[0].innerHTML = 0;
				dojo.query("b[id='markerDurationSec']")[0].innerHTML = 0;
			}
		}
	});

	// last, save the values
	dojo.query('input[id="coordsDivLat"]')[0].value = lat;
	dojo.query('input[id="coordsDivLon"]')[0].value = lon;
	dojo.query('input[id="coordsDivRadius"]')[0].value = radiusMiles;
	dojo.query('b[id="markerCountPreview"]')[0].innerHTML = "<img src='http://madd.in/ajax-loader3.gif'>";
	dojo.query("b[id='markerDurationMin']")[0].innerHTML = "<img src='http://madd.in/ajax-loader3.gif'>";
	dojo.query("b[id='markerDurationSec']")[0].innerHTML = "<img src='http://madd.in/ajax-loader3.gif'>";

	// enable the startQuery button
	var startQuery = dojo.query('button[id="startQuery"]')[0];
	startQuery.removeAttribute('disabled');
	startQuery.style.opacity = "1";
}

function startAutoTour(){
	var typeInputs = dojo.query("input[name='type']");
	var sizeInputs = dojo.query("input[name='size']");
	var difficultyInputs = dojo.query("input[name='Difficulty']");
	var terrainInputs = dojo.query("input[name='Terrain']");
	var specialInputs = dojo.query("input[name='special']");
	var i;

	var typeFilter = {};
	for(i = 0; i<typeInputs.length;i++){
		typeFilter[typeInputs[i].value] = typeInputs[i].checked;
	}

	var sizeFilter = {};
	for(i = 0; i<sizeInputs.length;i++){
		sizeFilter[sizeInputs[i].value] = sizeInputs[i].checked;
	}

	var difficultyFilter = {};
	for(i = 0; i<difficultyInputs.length;i++){
		difficultyFilter[difficultyInputs[i].value] = difficultyInputs[i].checked;
	}

	var terrainFilter = {};
	for(i = 0; i<terrainInputs.length;i++){
		terrainFilter[terrainInputs[i].value+""] = terrainInputs[i].checked;
	}
	var specialFilter = {};
	for(i = 0; i<specialInputs.length;i++){
		//~ GM_log(">"+specialInputs[i].value+"<");
		specialFilter[specialInputs[i].value+""] = specialInputs[i].checked;
	}

	var lat = dojo.query("input[id='coordsDivLat']")[0].value;
	var lon = dojo.query("input[id='coordsDivLon']")[0].value;
	var radius = dojo.query("input[id='coordsDivRadius']")[0].value;
	var url = "http://www.geocaching.com/seek/nearest.aspx?lat="+lat+"&lon="+lon+"&dist="+radius;

	if(specialFilter["I haven't found "]){
		url += "&f=1";
	}

	GM_setValue('tq_url', url);
	GM_setValue('tq_typeFilter', JSON.stringify(typeFilter));
	GM_setValue('tq_sizeFilter', JSON.stringify(sizeFilter));
	GM_setValue('tq_dFilter', JSON.stringify(difficultyFilter));
	GM_setValue('tq_tFilter', JSON.stringify(terrainFilter));
	GM_setValue('tq_specialFilter', JSON.stringify(specialFilter));
	GM_setValue('tq_StartUrl', document.location.href);

	document.location.href = url;
}

function getMarkerCoord(){
	var markerCoords = dojo.query("input[id='markerCoords']")[0].value;
	var coords = parseCoordinates(markerCoords,true);
	if(coords){
		updateAutoTourMap(coords._lat, coords._lon);
	} else { // Sehr seltener Fall wenn auch die google geolocate API versagt.
		alert("'"+markerCoords+"' is not an address!");
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

		var checkbox = createElement('input', {type: 'checkbox', name: "type", value: wptArray[i]['wptTypeId'], id: "type"+wptArray[i]['wptTypeId'], checked: 'checked'});
		append(checkbox,checkboxDiv);
		checkbox.style.margin = '0px';

		var label = createElement('label');
		label.setAttribute("for", "type"+wptArray[i]['wptTypeId']);

		append(label,checkboxDiv);
		var caption = createElement('img');
		append(caption,label);
		caption.src = 'http://www.geocaching.com/images/WptTypes/sm/'+wptArray[i]['wptTypeId']+'.gif';

		append(checkboxDiv,typeDiv);

		if((i+1) % 2 === 0){
			typeDiv.appendChild(createElement('br'));
			checkboxDiv.style.paddingLeft = '10px';
		}
	}

	return typeDiv;
}

function getLocateMeButton(){
	var button = createElement('button',{style:"margin-left:10px;font-size:12px"});
	button.innerHTML = "<img id='locateImage' src='"+locateMeImage+"'><span style='vertical-align:top;margin-left:3px;font-weight:bold'>"+$.gctour.lang('findMe')+"</span>";

	button.addEventListener('click',
		function(){

			if(navigator.geolocation){
				dojo.byId('locateImage').src = "http://madd.in/ajax-loader3.gif";
				navigator.geolocation.getCurrentPosition(
					function(position){
						dojo.byId('locateImage').src = locateMeImage;
						var latitude = position.coords.latitude;
						var longitude = position.coords.longitude;

						dojo.query("input[id='markerCoords']")[0].value = latitude +' '+longitude;
						dojo.query("input[id='markerRadius']")[0].value = 1;
						getMarkerCoord();
					},

					function(error){
						dojo.byId('locateImage').src = locateMeImage;
						log('Unable to get current location: ' + error);
					}, {timeout:10000}
				);
			} else {
				alert("Firefox 3.5? Please update to use this!");
			}

		},false);

	return button;
}

function getCoordinatesTab(){
	var coordsDiv = createElement('div',{style:"clear:both"});
	coordsDiv.id = 'coordsDiv';
	coordsDiv.align = "left";

	var findMeButton = getLocateMeButton();
	findMeButton.style.cssFloat = 'right';
	append(findMeButton,coordsDiv);

	var divEbene = createElement('div', {className: 'ebene'});

	divEbene.innerHTML = '<b>'+$.gctour.lang('autoTourCenter')+'</b>&nbsp;&nbsp;&nbsp;&nbsp;'+
		'<input type="text" id="markerCoords"><br/>'+
		'<small>'+$.gctour.lang('autoTourHelp')+'</small>';

	append(divEbene, coordsDiv);

	divEbene = createElement('div', {className: 'ebene'});
	divEbene.innerHTML = '<b>'+$.gctour.lang('autoTourRadius')+'</b>&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" id="markerRadius" maxlength="4" value="2" style="width:40px;margin-right:5px"><select id="markerRadiusUnit"><option selected="selected" value="km">'+$.gctour.lang('kilometer')+'</option><option value="sm">'+$.gctour.lang('mile')+'</option></select>';
	append(divEbene, coordsDiv);

	divEbene = createElement('div');
	divEbene.setAttribute('class','dialogFooter');

	var useButton = createElement('input',{type:"button",value:$.gctour.lang('autoTourRefresh'),style:"background-image:url("+autoTourImage+");margin-top:-24px;"});append(useButton,divEbene);
	useButton.addEventListener('click',getMarkerCoord ,false);

	append(divEbene, coordsDiv);

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
	//~ staticGMap.style.backgroundImage = "url("+previewImage+")";
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
	tourDurationLabel.innerHTML = $.gctour.lang('autoTourDuration')+" <b id='markerDurationMin'>???</b> min<b id='markerDurationSec'>???</b> sec";

	return coordsDiv;
}

function getAutoTourSubmit(){
	var queryFilterDiv = document.createElement('div');
	var getCachesButton = createElement('button');append(getCachesButton, queryFilterDiv);
	getCachesButton.id="startQuery";
	getCachesButton.innerHTML = "<img src ='"+startAutoTourImage+"'>";
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

function showAutoTourDialog(center,radius){
	var overLay, queryFilterDiv;

  if(!isLogedIn()) { return; }

	overLay = getOverlay({caption:$.gctour.lang('autoTour'),minimized:true});
	overLay.appendChild(getCoordinatesTab());

	var autoTourContainer = createElement('div',{id:'autoTourContainer',style:'clear:both;border-top:2px dashed #B2D4F3;margin-top:12px;'});
	autoTourContainer.style.display = 'none';

	autoTourContainer.appendChild(getMapPreviewTab());
	queryFilterDiv = document.createElement('div');append(queryFilterDiv,autoTourContainer);
	queryFilterDiv.appendChild(getTypeFilter());
	queryFilterDiv.appendChild(getSizeFilter());
	queryFilterDiv.appendChild(getDtFiler('Difficulty'));
	queryFilterDiv.appendChild(getDtFiler('Terrain'));
	queryFilterDiv.appendChild(getSpecialFilter());
	autoTourContainer.appendChild(getAutoTourSubmit());

	overLay.appendChild(autoTourContainer);

	if(center && radius){
		dojo.query("input[id='markerCoords']")[0].value = center.lat() +' '+center.lng();
		dojo.query("input[id='markerRadius']")[0].value = radius;
		getMarkerCoord();
	} else {
    dojo.query("input[id='markerRadius']")[0].value = 2;
    dojo.query("input[id='markerCoords']")[0].focus();
  }
}
