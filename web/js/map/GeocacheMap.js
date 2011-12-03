var geocacheArray = [];
var waypointsArray = [];
var ownWaypointsArray = [];

var bounds;

function initialize() {
	bounds = new google.maps.LatLngBounds();
	
	
	var mapnik = new google.maps.ImageMapType({
		getTileUrl: function(ll, z) { return "http://tile.openstreetmap.org/" + z + "/" + ll.x + "/" + ll.y + ".png";},
		tileSize: new google.maps.Size(256, 256),
		isPng: true,
		maxZoom: 18,
		name: "OSM Mapnik",
		alt: "Open Streetmap tiles"
	});
	var osmde = new google.maps.ImageMapType({
		getTileUrl: function( ll, z ) { return 'http://a.tile.openstreetmap.de/tiles/osmde/'+z+'/'+ll.x+'/'+ll.y+'.png';},
		tileSize: new google.maps.Size(256, 256),
		isPng: true,
		maxZoom: 17,
		name: "OSM DE",
		alt: "Open Streetmap tiles"
	});

	var osmCycle = new google.maps.ImageMapType({
		getTileUrl: function( ll, z ) { return 'http://a.tile.opencyclemap.org/cycle/'+z+'/'+ll.x+'/'+ll.y+'.png';},
		tileSize: new google.maps.Size(256, 256),
		isPng: true,
		maxZoom: 18,
		name: "OSM Cycle",
		alt: "Open Streetmap tiles"
	});
				
	var osmPublic = new google.maps.ImageMapType({
		getTileUrl: function( ll, z ) { return 'http://tile.xn--pnvkarte-m4a.de/tilegen/'+z+'/'+ll.x+'/'+ll.y+'.png';},
		tileSize: new google.maps.Size(256, 256),
		isPng: true,
		maxZoom: 18,
		name: "OSM ÖPNV",
		alt: "Open Streetmap tiles"
	});

	var oda = new google.maps.ImageMapType({
		getTileUrl: function( ll, z ) { return "http://t3.outdooractive.com/portal/map/" + z + "/" +ll.x + "/" + ll.y + ".png";},
		tileSize: new google.maps.Size(256, 256),
		isPng: true,
		maxZoom: 16,
		minZoom: 8,
		name: "Topo Ger",
		alt: "Outdoor Active tiles"
	});

	

	var gcdeMap = new google.maps.ImageMapType({
		getTileUrl: function(tile, zoom) {return "http://maps.geocaching.de/tilecache/tilecache.py/1.0.0/caches/" + zoom + "/" + tile.x + "/" + tile.y +".png?type=google";},
		tileSize: new google.maps.Size(256, 256),
		opacity:0.60,
		name: "gcde",
		isPng: true,
		maxZoom: 16,
		minZoom: 8,
	});
	

	var options = {
		mapTypeControl: true,
		navigationControl: true,
		navigationControlOptions: {style: google.maps.NavigationControlStyle.DEFAULT},
		scaleControl: true,		
		streetViewControl: true
	}


	var map = new google.maps.Map(document.getElementById("map_canvas"),
							 options);
	
	
	map.overlayMapTypes.push(null); // create empty overlay entry
	
	
	if(settings.showOGC()){ // set it only if wanted
		map.overlayMapTypes.setAt("0",gcdeMap); // set the overlay, 0 index
	}






	 /**
	 * set mapTypes 
	 */
	map.mapTypes.set('mapnik', mapnik);
	map.mapTypes.set('osmde', osmde);
	map.mapTypes.set('osmaC', osmCycle);			
	map.mapTypes.set('osmaP', osmPublic);
	map.mapTypes.set('oda', oda);

	map.setMapTypeId(defaultMapt); // value is set in map.jsp!

	map.setOptions({
	  mapTypeControlOptions: {
		mapTypeIds: [
		  'mapnik',
		  'osmde',
		  'osmaC',
		  'osmaP',
		  'oda',
		  google.maps.MapTypeId.ROADMAP,
		  google.maps.MapTypeId.TERRAIN,
		  google.maps.MapTypeId.SATELLITE,
		  google.maps.MapTypeId.HYBRID
		],
		style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
	  }
	});


	setGeocaches(map, geocaches);
	setOwnWaypoints(map, ownWaypoints);
	

//	setupPolyline(map);// nice feature 
  
	// setup the controls
	
//	items = [];
//	item = {};
//	item.name = "";
//	item.func = function() {};
//	item.enabled = ;
//	items.push(item);
	
	var gcdeControl = new MapControl(map);		
	var items = [];
	var item = {};
	item.name = "";
	var timeOutAlpha;
	item.func = function(event, ui)	{
		
		document.getElementById('opacity').innerHTML = ui.value+"%";
		clearTimeout(timeOutAlpha);
		
		
		timeOutAlpha = setTimeout(function(){
			for (i in geocacheArray) {
				geocacheArray[i].setAlpha(ui.value);
			}
			for (i in ownWaypointsArray) {
				ownWaypointsArray[i].setAlpha(ui.value);
			}
			for (i in waypointsArray) {
				waypointsArray[i].setAlpha(ui.value);
			}			 
		}, 300);

	}
	item.slider = true;
	items.push(item);
	
	gcdeControl.createMenu("Label transparency:",items);
	
	
	
	items = [];
	item = {};
	item.name = "GCCode";
	item.func = function() {
		var enabled = false;
		if (geocacheArray) {
			for (i in geocacheArray) {
			  enabled = geocacheArray[i].toggleGCID();
			}
		}
		
		if(!enabled){
			addClass(this, "disabled");
		}else{
			removeClass(this, "disabled");
		}
	};
	item.enabled = settings.showGCID();
	items.push(item);
	
	
	item = {};
	item.name = "Name";
	item.func = function() {
		if (geocacheArray) {
			var enabled = false;
			for (i in geocacheArray) {
				enabled = geocacheArray[i].toggleName();
			}
			
			if(!enabled){
				addClass(this, "disabled");
			}else{
				removeClass(this, "disabled");
			}
		}
	};
	item.enabled = settings.showGCName();
	items.push(item);

	
	item = {};
	item.name = "Index";
	item.func = function() {
		 if (geocacheArray) {
			var enabled = false;
			for (i in geocacheArray) {
				enabled = geocacheArray[i].toggleGCIndex();
			}
			
			if(!enabled){
				addClass(this, "disabled");
			}else{
				removeClass(this, "disabled");
			}
		}
		
	};
	item.enabled = settings.showGCIndex();
	items.push(item);
	
	gcdeControl.createMenu("Geocaches",items);
	
	
	
	if(waypointsArray.length != 0){
		items = [];
		item = {};
		item.name = "Show Wpts";
		item.func = function() {
			if (waypointsArray) {
				var enabled = false;
				for (i in waypointsArray) {
					enabled = waypointsArray[i].toggleHide();
				}
				
				if(!enabled){
					addClass(this, "disabled");
				}else{
					removeClass(this, "disabled");
				}
			}
			
		};
		item.enabled = settings.showWPTs();
		items.push(item);
		
	
		item = {};
		item.name = "Name";
		item.func = function() {
			if (waypointsArray) {
				var enabled = false;
				for (i in waypointsArray) {
					enabled = waypointsArray[i].toggleName();
				}

				if(!enabled){
					addClass(this, "disabled");
				}else{
					removeClass(this, "disabled");
				}
			}
		};
		item.enabled = settings.showWPTName();
		items.push(item);
		
		
		//~ item = {};
		//~ item.name = "Lookup";
		//~ item.func = function() {
			//~ if (waypointsArray) {
				//~ var enabled = false;
				//~ for (i in waypointsArray) {
					//~ enabled = waypointsArray[i].toggleGCName();
				//~ }
				//~ 
				//~ if(!enabled){
					//~ addClass(this, "disabled");
				//~ }else{
					//~ removeClass(this, "disabled");
				//~ }
			//~ }
		//~ };
		//~ item.enabled = settings.showWPTLookup();
		//~ items.push(item);
		gcdeControl.createMenu("Additional Waypoints",items);
		
	}
	
	// own Waypoints control
	if(ownWaypointsArray.length != 0){
		items = [];
		item = {};
		item.name = "show";
		item.func = function() {
			if (ownWaypointsArray) {
				var enabled = false;
				for (i in ownWaypointsArray ) {
					enabled = ownWaypointsArray[i].toggleHide();
				}
				
				if(!enabled){
					addClass(this, "disabled");
				}else{
					removeClass(this, "disabled");
				}
			}			
		};
		item.enabled = settings.showOWPTs();
		items.push(item);
		

		item = {};
		item.name = "Name";
		item.func = function() {
			if (ownWaypointsArray) {
				var enabled = false;
				for (i in ownWaypointsArray) {
					enabled = ownWaypointsArray[i].toggleName();
				}

				if(!enabled){
					addClass(this, "disabled");
				}else{
					removeClass(this, "disabled");
				}
			}
		};
		item.enabled =  settings.showOWPTName();
		items.push(item);
		gcdeControl.createMenu("Own Waypoints",items);
	}

	
	/*
	



	
	

	

		var wptControl = new MapControl(map);	
		wptControl.createHead("");
		wptControl.createButton("display", function() {	  
		 
		}, );
		
		
		wptControl.createButton("Name", function() {	  
		 
		},);	
		
		map.controls[google.maps.ControlPosition.TOP_RIGHT].push(wptControl.controlDiv_);
	}
	
*/
	
}

function setGeocaches(map, geocaches){
	for (var i = 0; i < geocaches.length; i++) {
		var geocache = geocaches[i];
		var label = new Geocache2Label({
				latitude:geocache.latitude,
				longitude:geocache.longitude,
				icon:geocache.type,
				gcid:geocache.gcid,
				name:geocache.name,
				index:geocache.i+1
			}, map);
		setWaypoints(map, geocache.additional_waypoints);
		
		geocacheArray.push(label);
		bounds.extend(label.getLatLng())
	}
	map.fitBounds(bounds);
}


function setWaypoints(map, waypoints){
	for (var i = 0; i < waypoints.length; i++) {
		var waypoint = waypoints[i];
		var label = new WaypointLabel({
				latitude:waypoint.latitude,
				longitude:waypoint.longitude,
				icon:waypoint.symbol,
				name:waypoint.name,
				//~ prefix:waypoint.prefix
			}, map);
		
		
		waypointsArray.push(label);
		bounds.extend(label.getLatLng());
	}
	map.fitBounds(bounds);
}

function setOwnWaypoints(map, waypoints){
	for (var i = 0; i < waypoints.length; i++) {
		var waypoint = waypoints[i];
		var label = new WaypointLabel({
				latitude:waypoint.latitude,
				longitude:waypoint.longitude,
				icon:waypoint.image,
				name:waypoint.name,				
				index:waypoint.i+1
			}, map);
		
		ownWaypointsArray.push(label);
		bounds.extend(label.getLatLng());
	}
	map.fitBounds(bounds);
}

function setupPolyline(map){
	geocacheArray
	var gcCoordinates = [];
	for (var i = 0; i < geocacheArray.length; i++) {
		gcCoordinates.push(geocacheArray[i].getLatLng());
	}
	var flightPath = new google.maps.Polyline({
       path: gcCoordinates,
       strokeColor: "#FF0000",
       strokeOpacity: 1.0,
       strokeWeight: 2
    });

	 flightPath.setMap(map);

}

		
