// static map object

function StaticMap(container,options){
	this._options = options;
	this._container = container;
	this._zoom = 13;
	this._minZoom = 0;
	this._maxZoom = 19;

	this.build();
	this.update();
}

StaticMap.prototype.zoomIn = function(thiz){
	return function(){
		thiz._zoom = thiz._zoom+1;
		thiz.update();
	};
};

StaticMap.prototype.zoomOut = function(thiz){
	return function(){
		thiz._zoom = thiz._zoom-1;
		thiz.update();
	};
};

StaticMap.prototype.hide = function(){
	this._staticGMap.style.display = "none";
};

StaticMap.prototype.show = function(){
	this._staticGMap.style.display = "block";
};

StaticMap.prototype.setNewCoordinates = function(lat,lon){
	this._options.newLat = lat;
	this._options.newLon = lon;
	this.update();
};

StaticMap.prototype.setCoordinates = function(lat,lon){
	this._options.lat = lat;
	this._options.lon = lon;
	this.update();
};

StaticMap.prototype.setIcon = function(icon){
	this._options.icon = icon;
	this.update();
};

StaticMap.prototype.update = function(){
	if (this._zoom < this._minZoom || this._zoom > this._maxZoom) { return; }

	if(this._options.radius){

		var pathString = "";
		// to draw a circle - add 24 edges und combine them
		for(var i = 1; i<=361;i = i+15){
			var waypoint = CalcPrjWP(this._options.lat,this._options.lon,this._options.radius,i);
			pathString += waypoint[0]+","+waypoint[1];

			if(i != 361) {
				pathString += "|";
			}

		}

		this._staticGMap.style.backgroundImage = 'url(http://maps.google.com/maps/api/staticmap?path=color:0xB2D4F3FF|weight:5|fillcolor:0xB2D4F366|'+pathString+'&size='+((this._options.width)?this._options.width:'350')+'x'+((this._options.height)?this._options.height:'200')+'&sensor=false)';
		this.show();

	} else {
		var markerString = "markers=";

		if(this._options.geocache_type){
			markerString += "icon:http://www.geocaching.com/images/wpttypes/pins/"+this._options.geocache_type+".png";
		} else if (this._options.icon){
			markerString += "icon:"+this._options.icon;
		} else {
			markerString += "color:blue";
		}
		markerString +=  "|"+this._options.lat+","+this._options.lon;

		if(this._options.newLat && this._options.newLon){
			markerString += "&markers=color:green|"+(this._options.newLat)+","+(this._options.newLon);
			markerString += "&center="+(this._options.newLat)+","+(this._options.newLon);
		}

		this._staticGMap.style.backgroundImage = 'url(http://maps.google.com/maps/api/staticmap?zoom='+this._zoom+'&size='+((this._options.width)?this._options.width:'350')+'x'+((this._options.height)?this._options.height:'200')+'&maptype=roadmap&'+markerString+'&sensor=false)';
		this.show();
	}
};

StaticMap.prototype.build = function(){
	var staticGMap = document.createElement('div');
	staticGMap.style.display = "none";
	//~ staticGMap.id = 'staticGMap2';
	staticGMap.style.border = '2px solid gray';
	staticGMap.style.height = (this._options.height)?this._options.height+'px':'200px';
	staticGMap.style.width = (this._options.width)?this._options.width+'px':'350px';
	staticGMap.style.backgroundRepeat = 'no-repeat';
	this._staticGMap = staticGMap;

	if(!this._options.radius){  // just make marker maps zoomable
		var staticGMapControl = document.createElement('div');staticGMap.appendChild(staticGMapControl);
		staticGMapControl.style.padding = '3px 0px 0px 3px';
		staticGMapControl.style.width = '16px';
		staticGMapControl.style.cssFloat = 'left';

		var zoomPlusButton = document.createElement('img');
		zoomPlusButton.style.opacity = '0.75';
		zoomPlusButton.style.cursor = 'pointer';
		zoomPlusButton.src = "http://www.geocaching.com/images/zoom_in.png";
		zoomPlusButton.addEventListener('click', this.zoomIn(this), false);
		staticGMapControl.appendChild(zoomPlusButton);

		var zoomMinusButton = document.createElement('img');
		zoomMinusButton.style.opacity = '0.75';
		zoomMinusButton.style.cursor = 'pointer';
		zoomMinusButton.src = "http://www.geocaching.com/images/zoom_out.png";
		zoomMinusButton.addEventListener('click', this.zoomOut(this), false);
		staticGMapControl.appendChild(zoomMinusButton);
	}

	this._container.appendChild(staticGMap);

};

function changeCoordinates(coordinates){
  var coordinates_org;
	var coordinates_ele = dojo.byId('uxLatLon');
	try{
		coordinates_org = coordinates_ele.textContent.split("(")[1].split(")")[0];
	} catch(e){
		coordinates_org = coordinates_ele.textContent;
	}

	if(!coordinates){
		coordinates_ele.innerHTML = coordinates_org;
	} else {
		coordinates_ele.innerHTML = "<div style='font-weight:bold;'>"+coordinates+"&nbsp;&nbsp;-&nbsp;&nbsp;changed by GCTour <small><a style='cursor:pointer'>"+$.gctour.lang('makeMap')+"</a></small></div><small>("+coordinates_org+")</small>";
		var showLink = coordinates_ele.getElementsByTagName('a')[0];

		showLink.addEventListener('click', function(){
			var overlay = getOverlay({caption:$.gctour.lang('settings_map'),minimized:true});

			var originalCoordinates = parseCoordinates(coordinates_org);
			var newCoordinates = parseCoordinates(coordinates);

			var gc_type = dojo.query('a[href="/about/cache_types.aspx"] > img')[0].src.split("/")[5].split(".")[0];
			var staticMap = new StaticMap(overlay,{lat:originalCoordinates._lat,lon:originalCoordinates._lon,newLat:newCoordinates._lat,newLon:newCoordinates._lon,width:475,height:300,geocache_type:gc_type});

		}, false);
	}
}

function openChangeCoordinates(){
    var overlayMarker, dangerDanger, anTable, tr, td, nameInput, cordsInputLat, cordsInputLon, cordsInput,
        exampleCoords, staticGMap, staticGMapControl, zoomPlusButton, zoomMinusButton, contentTextarea,
        markerTypeTable, typeInput, trElement, i , tdElement, cancel, submit, errors, makerName, markerContent,
        markerType, markerTypeSym, latitude, longitude,markerPosition, markerPositionDelta, entry, latArray,
        lonArray, latOrigin, lonOrigin, latlng;

	overlayMarker = getOverlay({caption:$.gctour.lang('moveGeocache'),minimized:true});

	anTable = createElement('table',{style:"clear:both;"});overlayMarker.appendChild(anTable);
	anTable.style.width = '100%';
	anTable.align = 'center';

	tr = document.createElement('tr');anTable.appendChild(tr);
	td = document.createElement('td');tr.appendChild(td);
	td.colSpan = 2;
	td.innerHTML = $.gctour.lang('moveGeocacheHelp');

  tr = document.createElement('tr');anTable.appendChild(tr);
	td = document.createElement('td');tr.appendChild(td);
	td.style.width = '20%';
	td.textContent = $.gctour.lang('originalCoordinates');

	var coordinates = dojo.byId('uxLatLon').textContent;

	try{
		coordinates = coordinates.split("(")[1].split(")")[0];
	} catch(e){
		coordinates = coordinates;
	}

	var  mapTd = document.createElement('td');
	mapTd.align = 'left';

	var minimal_geocache = getMinimalGeocacheDetails(document.getElementsByTagName('html')[0]);
	var gc_type = minimal_geocache.type;

	var coords = parseCoordinates(coordinates);
	var staticMap = new StaticMap(mapTd,{lat:coords._lat,lon:coords._lon,geocache_type:gc_type.split(".")[0]});

	var cacheId = minimal_geocache.gccode;

	td = document.createElement('td');tr.appendChild(td);
	nameInput = document.createElement('input');td.appendChild(nameInput);
	nameInput.type = 'text';
	nameInput.id = 'markerName';
	nameInput.value = coords;
	nameInput.style.width = '350px';
	nameInput.style.marginRight = '5px';
	nameInput.disabled = 'disabled';

	tr = document.createElement('tr');anTable.appendChild(tr);
	td = document.createElement('td');tr.appendChild(td);
	td.textContent = $.gctour.lang('newCoordinates');

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

	var checkMarkerCoord = function(input){
		return function(){
			var coords = parseCoordinates(input.value);

			if(coords === false){
				cordsInput.style.backgroundColor = "#FF8888";
			} else {
				cordsInput.style.backgroundColor = "#88DC3B";
				cordsInputLat.value = coords._lat;
				cordsInputLon.value = coords._lon;

				staticMap.setNewCoordinates(coords._lat,coords._lon);

			}
		};
	};

	cordsInput.addEventListener('keyup',checkMarkerCoord(cordsInput),false);
	cordsInput.addEventListener('paste',checkMarkerCoord(cordsInput),false);

	exampleCoords = document.createElement('div');
	exampleCoords.innerHTML = "<small>"+$.gctour.lang('example')+" "+$.gctour.lang('exampleCoords')+"</small>";

	td.appendChild(exampleCoords);

	tr = document.createElement('tr');anTable.appendChild(tr);
	td = document.createElement('td');tr.appendChild(td);
	tr.appendChild(mapTd);

	// in the end please add a save and cancel button

	var buttonsDiv = createElement('div');append(buttonsDiv,overlayMarker);
	buttonsDiv.setAttribute('class','dialogFooter');

	cancel = createElement('input',{type:"button",value:$.gctour.lang('cancel'),style:"background-image:url("+closebuttonImage+")"});append(cancel,buttonsDiv);
	cancel.addEventListener('click', closeOverlay, false);

	var delete_btn = createElement('input',{type:"button",value:$.gctour.lang('deleteCoordinates'),style:"background-image:url("+closebuttonImage+")"});append(delete_btn,buttonsDiv);
	delete_btn.addEventListener('click', function(){
			GM_deleteValue('coords_'+cacheId);

			changeCoordinates();
			updateGUI();
			closeOverlay();

	}, false);

	submit = createElement('input',{type:"button",value:$.gctour.lang('save'),style:"background-image:url("+saveImage+")"});append(submit,buttonsDiv);
	submit.addEventListener('click', function(){
			GM_setValue('coords_'+cacheId, cordsInputLat.value+'#'+cordsInputLon.value);

			changeCoordinates(new LatLon(cordsInputLat.value,cordsInputLon.value).toString());
			closeOverlay();
	}, false);

	// now set all previous values IFF a marker is given

	if(GM_getValue('coords_'+cacheId,"null") != "null"){
		var coords_cacheId = GM_getValue('coords_'+cacheId);
		latlng =  new LatLon(coords_cacheId.split('#')[0],coords_cacheId.split('#')[1]);

		cordsInputLat.value = latlng._lat;	// 51.123123
		cordsInputLon.value = latlng._lon;	// 123.12333

		cordsInput.value = latlng.toString();
		cordsInput.style.backgroundColor = "#88DC3B";

		staticMap.setNewCoordinates(cordsInputLat.value ,cordsInputLon.value);

	} else {
		latlng =  parseCoordinates(coordinates);
		cordsInputLat.value = latlng._lat;	// 51.123123
		cordsInputLon.value = latlng._lon;	// 123.12333
		cordsInput.value = latlng.toString();
		cordsInput.style.backgroundColor = "#88DC3B";

		staticMap.setNewCoordinates(cordsInputLat.value ,cordsInputLon.value);
	}

}
