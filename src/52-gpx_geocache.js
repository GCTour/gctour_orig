function getGPXGeoCache(gcid){

	var geocache = new Object();
	var geocache_obj = getGeocache(gcid);
	
	if(geocache_obj === "pm only"){
		return geocache_obj;
	}
	
	
	var isGroundspeak = (GM_getValue("gpxschema",0) == 0);
	//~ geocache.gcid
	//~ geocache.cacheid
	//~ geocache.name
	//~ geocache.type
	//~ geocache.owner
	//~ geocache.hidden
	//~ geocache.coordinates
	//~ geocache.lat
	//~ geocache.lon
	//~ geocache.location
	//~ geocache.state
	//~ geocache.country
	//~ geocache.bearing
	//~ geocache.distance
	//~ geocache.inventory
	//~ geocache.size
	//~ geocache.difficulty
	//~ geocache.terrain
	//~ geocache.attributes
	//~ geocache.short_description
	//~ geocache.long_description
	//~ geocache.hint
	//~ geocache.images
	//~ geocache.additional_waypoints
	//~ geocache.find_counts
	//~ geocache.logs
	
	geocache.gcid = geocache_obj.gcid;		
		if(GM_getValue('gpxstripgc',false)){
			geocache.gcid = geocache.gcid.replace(/GC/,'');			
		}	
	geocache.cacheid = geocache_obj.cacheid;	
	
	geocache.archived = (geocache_obj.archived)?"True":"False";
	geocache.available = (geocache_obj.available)?"True":"False";
		
	geocache.cacheName = geocache_obj.name;
	geocache.cacheOwner = geocache_obj.owner;
	geocache.cacheType = geocache_obj.type;
	geocache.cacheSize = geocache_obj.size;

	if(isGroundspeak){
		switch (geocache_obj.type) {
			case "micro":geocache.cacheSize = "Micro";break;
			case "small":geocache.cacheSize = "Small";break;
			case "regular":geocache.cacheSize = "Regular";break;
			case "large":geocache.cacheSize = "Large";break;
			case "other":geocache.cacheSize = "Other";break;
			case "not_chosen":geocache.cacheSize = "Not chosen";break;
			case "virtual":geocache.cacheSize = "Virtual";break;
		}
	} else {
		// if "Not chosen" is the Cachesize - REMOVE IT!
		geocache.cacheSize = (geocache_obj.size == "Not chosen")?"Other":geocache_obj.size;
	}
	
	// define the cache type
	// if the GPX type is Groundspeak - parse type through the wptArr from autotour:
	if(isGroundspeak) {
		for(var i = 0; i< wptArray.length;i++){	
			if(wptArray[i]['wptTypeId'] == geocache_obj.type){
				geocache.cacheType = wptArray[i]['name'];
			}
		}
	} else {
		 switch (geocache_obj.type) {
			case "2": 
				geocache.cacheType = "Traditional";
				break;
			case "3": 
				geocache.cacheType = "Multi";
				break;
			case "4": 
				geocache.cacheType = "Virtual";
				break;
			case "11": 
				geocache.cacheType = "Webcam";
				break;
			case "6": 
				geocache.cacheType = "Event";
				break;
			case "137": 
				geocache.cacheType = "Earthcache";
				break;
			case "453": 
				geocache.cacheType = "Event";
				break;
			default: 
				geocache.cacheType = "Other";
		  }	
	}

	
	geocache.attributes_array = geocache_obj.attributes_array;
	
	geocache.difficulty = geocache_obj.difficulty;		
	geocache.terrain = geocache_obj.terrain;
	
	// get the summery and the description
	var summary = geocache_obj.short_description;	
	var description = geocache_obj.long_description;	
	
	if(GM_getValue('gpxhtml',true)){
		geocache.longDescription = (description)?description.innerHTML:"";
		geocache.shortDescription = (summary)?summary.innerHTML:""
	} else {
		geocache.longDescription = (description)?description.textContent:"";
		geocache.shortDescription = (summary)?summary.textContent:"";	
	}
	
	geocache.hint = geocache_obj.hint;
	
	
	geocache.state = geocache_obj.state;
	geocache.country = geocache_obj.country;	
	
	// hidden Date
	geocache.dateHidden = geocache_obj.hidden;
	
	geocache.logs = new Array();
	
	
	for(var i = 0; i<geocache_obj.logs.length;i++){
		var logObj = new Object();
		
		//	from: "madd.in"
		//	type: "Found It", "Didn't find it", "Temporarily Disable Listing", "Write note", "Enable Listing",...
		//  text: "Netter Log eintrag."
		//	logdate: "August 18" oder "February 17, 2007"
		//	id: 12345679
		
		var gc_log =  geocache_obj.logs[i];
		logObj.cacherName = gc_log.from;
		
		switch (gc_log.type) {
			case "Found It":
				logObj.type = (isGroundspeak)?"Found it":"Found";
				break;
			case "Didn't find it":
				logObj.type = (isGroundspeak)?"Didn't find it":"Didn't find it";
				break;
			case "Needs Maintenance":
				logObj.type = (isGroundspeak)?"Needs Maintenance":"Note";
				break;
			case "Needs Archived":
				logObj.type = (isGroundspeak)?"Needs Archived":"Note";
				break;
			case "Owner Maintenance":
				logObj.type = (isGroundspeak)?"Owner Maintenance":"Note";
				break;
			case "Post Reviewer Note":
				logObj.type = (isGroundspeak)?"Post Reviewer Note":"Note";
				break;
			case "Write note":
				logObj.type = (isGroundspeak)?"Write note":"Note";
				break;
			default:
				logObj.type = (isGroundspeak)?"Write note":"Other";
				break;
				
		}
		
		// crazy founddate founder
		var month,day,year;
		var p = new RegExp(/((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sept(?:ember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)) (\d+), (\d+)/);
		var m = p.exec(gc_log.logdate);
		
		if(m != null){
			month =m[1];
			day=m[2];
			year=m[3];
		} else {
			p = new RegExp(/((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sept(?:ember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)) (\d+)/);
			m = p.exec(gc_log.logdate);
			month =m[1];
			day=m[2];
			year = new Date().getFullYear()
		}
		
		switch (month) {
			case "January": month=0;break;
			case "February": month=1;break;
			case "March": month=2;break;
			case "April": month=3;break;
			case "May": month=4;break;
			case "June": month=5;break;
			case "July": month=6;break;
			case "August": month=7;break;
			case "September": month=8;break;
			case "October": month=9;break;
			case "November": month=10;break;
			case "December": month=11;break;
		}

		var foundDate = new Date(year, month, day);
		logObj.foundDate = foundDate; // ITS DONE! peew
		
		logObj.content = gc_log.text;
		logObj.id = gc_log.id;
		
		
		// jobs done great - lets save this
		geocache.logs.push(logObj);
	}
	

	
	//additionalWaypoints
	geocache.additionalWaypoints = geocache_obj.additional_waypoints;
	
	geocache.latitude = geocache_obj.lat;
	geocache.longitude = geocache_obj.lon;
	
	
	log("--------------[START "+geocache.gcid+"]-------------");
	log("gcid:"+geocache.gcid);
	log("cacheName:"+geocache.cacheName);
	log("cacheOwner:"+geocache.cacheOwner);
	log("dateHidden:"+geocache.dateHidden);
	log("cacheType:"+geocache.cacheType);
	log("cacheSize:"+geocache.cacheSize);
	
	log("difficulty:"+geocache.difficulty);
	log("terrain:"+geocache.terrain);
	log("longDescription:"+geocache.longDescription);
	log("shortDescription:"+geocache.shortDescription);
	//~ log("latLon:"+geocache.latLon.innerHTML);
	log("latitude:"+geocache.latitude);
	log("longitude:"+geocache.longitude);
	log("state:"+geocache.state);
	log("country:"+geocache.country);
	
	//~ log("logs:"+geocache.logs.length);
	log("--------------[END "+geocache.gcid+"]--------------");
	
	return geocache;
}

function getGPXNew(){

	var gpxHeader = '<?xml version="1.0" encoding="utf-8"?>'+
				'<gpx xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'+
				'     xsi:schemaLocation="http://www.topografix.com/GPX/1/0 http://www.topografix.com/GPX/1/0/gpx.xsd http://geocaching.com.au/geocache/1 http://geocaching.com.au/geocache/1/geocache.xsd"'+
				'     xmlns="http://www.topografix.com/GPX/1/0"'+
				'     version="1.0"'+
				'     creator="gctour.madd.in">'+
				'  <desc>Geocache</desc>'+
				'  <author>GCTour</author>'+
				'  <url>http://gctour.madd.in</url>'+
				'  <urlname>gctour.madd.in</urlname>'+
				'  <time>'+ xsdDateTime(new Date()) +'</time>'+
				'</gpx>';
		

	
		var gpxString = '';

		var parser = new DOMParser();
		var gpxDom = parser.parseFromString(gpxHeader,"application/xml");
		var gpxElement = gpxDom.getElementsByTagName('gpx')[0];		
		
		var waypointTemplate =
				'<wpt xmlns="http://www.topografix.com/GPX/1/0" lat="##LAT##" lon="##LON##">'+
					'<time>##TIME##</time>'+
					'<name>##GCID##</name>'+
					'<desc>##CACHENAME##</desc>'+
					'<src>www.geocaching.com</src>'+
					'<url>http://www.geocaching.com/seek/cache_details.aspx?wp=##GCID##</url>'+
					'<urlname>##CACHENAME##</urlname>'+
					'<sym>Geocache</sym>'+
					'<type>Geocache</type>'+
					'<geocache status="Available" xmlns="http://geocaching.com.au/geocache/1">'+
					'	<name>##CACHENAME##</name>'+
					'	<owner>##OWNER##</owner>'+
					'	<locale></locale>'+
					'	<state>##STATE##</state>'+
					'	<country>##COUNTRY##</country>'+
					'	<type>##TYPE##</type>'+
					'	<container>##CONTAINER##</container>'+
					'	<difficulty>##DIFFICULTY##</difficulty>'+
					'	<terrain>##TERRAIN##</terrain>'+
					'	<summary html="true">##SUMMARY##</summary>'+
					'	<description html="true">##DESCRIPTION##</description>'+
					'	<hints>##HINT##</hints>'+
					'	<licence></licence>'+
					'	<logs>##LOGS##</logs>			'+
					'</geocache>'+
				'</wpt>';
		var waypointLogTemplate =		
			'<log id="##LOGID##">'+
			'	<time>##TIME##</time>'+
			'	<geocacher>##CACHERNAME##</geocacher>'+
			'	<type>##LOGTYPE##</type>'+
			'	<text>##LOGTEXT##</text>'+
			'</log>';
		
		for (var i = 0; i < currentTour.geocaches.length; i++){

			// iff the cancelbutton is presssed 
			if(GM_getValue("stopTask",false)){
				GM_setValue("stopTask",false);
				return "canceled"; // then return!
			}

			var costumMarker = (typeof(currentTour.geocaches[i].lat) != "undefined");
			
			if(!costumMarker){	
	
				var geocache = getGPXGeoCache(currentTour.geocaches[i].id);
				if(geocache !== "pm only"){
					var logsStringArray = new Array();
					
					var logs =  geocache.logs;			
					// just 11 logs in the gpx
					for (var j = 0; (j < logs.length && j <= 10); j++){
						var geocacheLogMapping = new Array(
							 new Array('LOGID',logs[j].id),
							 new Array('TIME',xsdDateTime(logs[j].foundDate)),
							 new Array('CACHERNAME',encodeHtml(logs[j].cacherName)),
							 new Array('LOGTYPE',logs[j].type),
							 new Array('LOGTEXT',encodeHtml(logs[j].content))
						);
						
						var cacheWaypointLog = waypointLogTemplate;
					
						for(var k = 0 ; k<geocacheLogMapping.length ; k++){
							cacheWaypointLog = cacheWaypointLog.replace(new RegExp("##"+geocacheLogMapping[k][0]+"##","g"),geocacheLogMapping[k][1]);
						}
						
						logsStringArray.push(cacheWaypointLog);
					}
					
					
					var geocacheMapping = new Array(
						 new Array('LAT',geocache.latitude),
						 new Array('LON',geocache.longitude),
						 new Array('TIME',xsdDateTime(geocache.dateHidden)),
						 new Array('GCID',geocache.gcid),
						 new Array('CACHENAME',encodeHtml(geocache.cacheName)),
						 new Array('OWNER',encodeHtml(geocache.cacheOwner)),
						 new Array('STATE',encodeHtml(geocache.state)),
						 new Array('COUNTRY',encodeHtml(geocache.country)),
						 new Array('TYPE', geocache.cacheType),					
						 new Array('CONTAINER',geocache.cacheSize),
						 new Array('DIFFICULTY',geocache.difficulty),
						 new Array('TERRAIN',geocache.terrain),
						 new Array('SUMMARY',encodeHtml(geocache.shortDescription)),
						 new Array('DESCRIPTION',encodeHtml(geocache.longDescription)),
						 new Array('HINT',encodeHtml(geocache.hint)),
						 new Array('LOGS',logsStringArray.join(""))
					);
					var cacheWaypoint = waypointTemplate;
					
					for(var j = 0 ; j<geocacheMapping.length ; j++){
						cacheWaypoint = cacheWaypoint.replace(new RegExp("##"+geocacheMapping[j][0]+"##","g"),geocacheMapping[j][1]);
					}
							
					var parser = new DOMParser();
					var dom = parser.parseFromString(cacheWaypoint,
						"text/xml");
					var waypoint = dom.getElementsByTagName('wpt')[0];
					gpxElement.appendChild(waypoint);
					
					
					if(GM_getValue('gpxwpts',true)){
						for(var k = 0;k<geocache.additionalWaypoints.length;k++){
							
							if(geocache.additionalWaypoints[k].coordinates != "???"){
								var parser = new DOMParser();
								var dom = parser.parseFromString(getWaypointsGPXFromGeocache(geocache.additionalWaypoints[k],geocache),
									"text/xml");
								var waypoint = dom.getElementsByTagName('wpt')[0];
								gpxElement.appendChild(waypoint);	
							}
						}
					}
				} // pm only check
				
			
			} else { // costum marker check
				var parser = new DOMParser();
				var dom = parser.parseFromString(getGPXfromMarker(currentTour.geocaches[i]),
					"text/xml");
				var waypoint = dom.getElementsByTagName('wpt')[0];
				gpxElement.appendChild(waypoint);	
			}
		setProgress(i,currentTour.geocaches.length,document);


		} // itertion end 
		
		var str = new XMLSerializer().serializeToString(gpxDom);
		return str;
		
}

function getGPX(){

	var gpxHeader = '<?xml version="1.0" encoding="utf-8"?>\n'+
				'<gpx xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" version="1.0" creator="GCTour" xsi:schemaLocation="http://www.topografix.com/GPX/1/0 http://www.topografix.com/GPX/1/0/gpx.xsd http://www.groundspeak.com/cache/1/0/1 http://www.groundspeak.com/cache/1/0/1/cache.xsd" xmlns="http://www.topografix.com/GPX/1/0">\n'+
				'	<name>'+currentTour.name+'</name>\n'+
				'	<desc>This is an individual cache generated from Geocaching.com</desc>\n'+
				'	<author>GCTour v'+version+'.'+build+'</author>\n'+
				'	<email>gctour@madd.in</email>\n'+
				'	<url>http://www.geocaching.com</url>\n'+
				'	<urlname>Geocaching - High Tech Treasure Hunting</urlname>\n'+
 				'	<time>'+ xsdDateTime(new Date()) +'</time>\n'+
 				'	<keywords>cache, geocache</keywords>\n'+
				'	<bounds minlat="##MINLAT##" minlon="##MINLON##" maxlat="##MAXLAT##" maxlon="##MAXLON##" />\n'+
				'##GEOCACHES##\n'+
				'##WAYPOINTS##\n'+
 				'</gpx>';		
		var geocacheTemplate =
				'	<wpt lat="##LAT##" lon="##LON##">\n'+
				'		<time>##TIME##</time>\n'+
				'		<name>##GCID##</name>\n'+
				'		<desc>##CACHENAME##</desc>\n'+
				'		<src>www.geocaching.com</src>\n'+
				'		<url>http://www.geocaching.com/seek/cache_details.aspx?wp=##GCID##</url>\n'+
				'		<urlname>##CACHENAME##</urlname>\n'+
				'		<sym>Geocache</sym>\n'+
				'		<type>Geocache|##TYPE##</type>\n'+
				'		<groundspeak:cache id="##CACHEID##" available="##AVAILABLE##" archived="##ARCHIVED##" xmlns:groundspeak="http://www.groundspeak.com/cache/1/0/1">\n'+
				'			<groundspeak:name>##CACHENAME##</groundspeak:name>\n'+
				'			<groundspeak:placed_by>##OWNER##</groundspeak:placed_by>\n'+
				'			<groundspeak:owner>##OWNER##</groundspeak:owner>\n'+
				'			<groundspeak:type>##TYPE##</groundspeak:type>\n'+
				'			<groundspeak:container>##CONTAINER##</groundspeak:container>\n'+
				'			<groundspeak:attributes>\n##ATTRIBUTES##			</groundspeak:attributes>\n'+
				'			<groundspeak:difficulty>##DIFFICULTY##</groundspeak:difficulty>\n'+
				'			<groundspeak:terrain>##TERRAIN##</groundspeak:terrain>\n'+
				'			<groundspeak:country>##COUNTRY##</groundspeak:country>\n'+
				'			<groundspeak:state>##STATE##</groundspeak:state>\n'+
				'			<groundspeak:short_description html="True">##SUMMARY##</groundspeak:short_description>\n'+
				'			<groundspeak:long_description html="True">##DESCRIPTION##</groundspeak:long_description>\n'+
				'			<groundspeak:encoded_hints>##HINT##</groundspeak:encoded_hints>\n'+					
				'			<groundspeak:logs>\n##LOGS##			</groundspeak:logs>\n'+
				'		</groundspeak:cache>\n'+
				'	</wpt>';
 		var geocacheLogTemplate =		
				'				<groundspeak:log id="##LOGID##">\n'+
				'					<groundspeak:date>##TIME##</groundspeak:date>\n'+
				'					<groundspeak:type>##LOGTYPE##</groundspeak:type>\n'+
				'					<groundspeak:finder>##CACHERNAME##</groundspeak:finder>\n'+
				'					<groundspeak:text>##LOGTEXT##</groundspeak:text>\n'+
				'				</groundspeak:log>\n';
		
		
		var gcStrArray = [];
		var wptStrArray = [];
		var minLat,minLon,maxLat,maxLon;
		
		
		for (var i = 0; i < currentTour.geocaches.length; i++){

			// iff the cancelbutton is presssed 
			if(GM_getValue("stopTask",false)){
				GM_setValue("stopTask",false);
				return "canceled"; // then return!
			}

			var costumMarker = (typeof(currentTour.geocaches[i].latitude) != "undefined");
			
			if(!costumMarker){		
				var geocache = getGPXGeoCache(currentTour.geocaches[i].id);
				if(geocache !== "pm only"){
					var logsStringArray = new Array();
					// create log with attributes!
					if(true){				
						
						for (var j = 0; (j < geocache.attributes_array.length); j++){
							attribute_a = geocache.attributes_array[j];
							GM_log(" id='"+attribute_a[0]+"' inc='"+attribute_a[3]+"' > "+attribute_a[2]);
						
						}
						/*
						var geocacheLogMapping = new Array(
							
							 new Array('LOGID',geocache.id), // Issue3
							 new Array('TIME',xsdDateTime(new Date())),
							 new Array('CACHERNAME',"GCTour"),
							 new Array('LOGTYPE', "Note"),
							 new Array('LOGTEXT',encodeHtml(logs[j].content))
						);
						
						var cacheWaypointLog = waypointLogTemplate;
					
						for(var k = 0 ; k<geocacheLogMapping.length ; k++){
							cacheWaypointLog = cacheWaypointLog.replace(new RegExp("##"+geocacheLogMapping[k][0]+"##","g"),geocacheLogMapping[k][1]);
						}
						
						logsStringArray.push(cacheWaypointLog);*/
					}
					
					debug("GS GPX: geocache.dateHidden:'"+geocache.dateHidden+"' -> xsd:'"+xsdDateTime(geocache.dateHidden)+"'");
					var logs =  geocache.logs;
					// just 11 logs in the gpx
					for (var j = 0; (j < logs.length && j <= 10); j++){
						var geocacheLogMapping = new Array(
												
							 new Array('LOGID',logs[j].id), // Issue3
							 new Array('TIME',xsdDateTime(logs[j].foundDate)),
							 new Array('CACHERNAME',encodeHtml(logs[j].cacherName)),
							 new Array('LOGTYPE',logs[j].type),
							 new Array('LOGTEXT',encodeHtml(logs[j].content))
						);
						
						var cacheWaypointLog = geocacheLogTemplate;
					
						for(var k = 0 ; k<geocacheLogMapping.length ; k++){
							cacheWaypointLog = cacheWaypointLog.replace(new RegExp("##"+geocacheLogMapping[k][0]+"##","g"),geocacheLogMapping[k][1]);
						}
						
						logsStringArray.push(cacheWaypointLog);
					}
					
					
					var attributesString = "";
					for (var j = 0; (j < geocache.attributes_array.length); j++){
						attributesString += getAttributeXML(geocache.attributes_array[j]);
					}
					
					var geocacheMapping = new Array(
						 new Array('LAT',geocache.latitude),
						 new Array('LON',geocache.longitude),
						 new Array('TIME',xsdDateTime(geocache.dateHidden)),
						 new Array('GCID',geocache.gcid),
						 new Array('CACHEID',geocache.cacheid),
						 new Array('AVAILABLE',geocache.available),
						 new Array('ARCHIVED',geocache.archived),
						 new Array('CACHENAME',encodeHtml(geocache.cacheName)),
						 new Array('OWNER',encodeHtml(geocache.cacheOwner)),
						 new Array('STATE',encodeHtml(geocache.state)),
						 new Array('COUNTRY',encodeHtml(geocache.country)),
						 new Array('TYPE', geocache.cacheType),					
						 new Array('CONTAINER',geocache.cacheSize),
						 new Array('ATTRIBUTES',attributesString),
						 new Array('DIFFICULTY',geocache.difficulty),
						 new Array('TERRAIN',geocache.terrain),
						 new Array('SUMMARY',encodeHtml(geocache.shortDescription)),
						 new Array('DESCRIPTION',encodeHtml(geocache.longDescription)),
						 new Array('HINT',encodeHtml(geocache.hint)),
						 new Array('LOGS',logsStringArray.join(""))
					);
					
					if(!maxLat){maxLat=geocache.latitude; minLat=geocache.latitude;maxLon=geocache.longitude; minLon=geocache.longitude;}
					
					maxLat = (maxLat < geocache.latitude)?geocache.latitude:maxLat;
					maxLon = (maxLon < geocache.longitude)?geocache.longitude:maxLon;
					minLon = (minLon > geocache.longitude)?geocache.longitude:minLon;
					minLat = (minLat > geocache.latitude)?geocache.latitude:minLon;
					
					
					var cacheWaypoint = geocacheTemplate;
					for(var j = 0 ; j<geocacheMapping.length ; j++){
						cacheWaypoint = cacheWaypoint.replace(new RegExp("##"+geocacheMapping[j][0]+"##","g"),geocacheMapping[j][1]);
					}	
					
					
					gcStrArray.push(cacheWaypoint);
					
					if(GM_getValue('gpxwpts',true)){
						for(var k = 0;k<geocache.additionalWaypoints.length;k++){
							
							if(geocache.additionalWaypoints[k].coordinates != "???"){
								
								
								wptStrArray.push(getWaypointsGPXFromGeocache(geocache.additionalWaypoints[k],geocache));
								//~ cacheWaypoint
								//~ 
								//~ var parser = new DOMParser();
								//~ var dom = parser.parseFromString(getWaypointsGPXFromGeocache(geocache.additionalWaypoints[k],geocache),
									//~ "text/xml");
								//~ var waypoint = dom.getElementsByTagName('wpt')[0];
								//~ gpxElement.appendChild(waypoint);	
							}
						}
					}
				} // pm only check
			
			} else { // costum marker check
				wptStrArray.push(getGPXfromMarker(currentTour.geocaches[i]));
					
			
				//~ var parser = new DOMParser();
				//~ var dom = parser.parseFromString(getGPXfromMarker(currentTour.geocaches[i]),
					//~ "text/xml");
				//~ var waypoint = dom.getElementsByTagName('wpt')[0];
				//~ gpxElement.appendChild(waypoint);	
			}
		setProgress(i,currentTour.geocaches.length,document);

		} // itertion end 
		//~ var str = new XMLSerializer().serializeToString(gpxDom);
		
		var str = gpxHeader;
			
		
		str = str.replace(new RegExp("##GEOCACHES##","g"),gcStrArray.join("\n"));
		
		str = str.replace(new RegExp("##WAYPOINTS##","g"),wptStrArray.join("\n"));
		str = str.replace(new RegExp("##MINLAT##","g"),minLat);
		str = str.replace(new RegExp("##MINLON##","g"),minLon);
		str = str.replace(new RegExp("##MAXLAT##","g"),maxLat);
		str = str.replace(new RegExp("##MAXLON##","g"),maxLon);
		
		//~ getKäse();
		return str;
}

function getAttributeXML(attribute_a){
	return "				<groundspeak:attribute id='"+attribute_a[0]+"' inc='"+attribute_a[3]+"'>"+attribute_a[2]+"</groundspeak:attribute>\n";
}

function getGPXfromMarker(marker){

	var gpx = 	'<wpt xmlns="http://www.topografix.com/GPX/1/0" lat="'+ marker.latitude +'" lon="'+ marker.longitude +'">\n';
	gpx += 		'	<time>'+ xsdDateTime(new Date()) +'</time>\n';
	gpx += 		'	<name>'+ encodeHtml(marker.name) +'</name>\n';
	gpx += 		'	<cmt>'+ encodeHtml(marker.content) +'</cmt>\n';
	gpx += 		'	<sym>'+ marker.symbol +'</sym>\n';
	gpx += 		'</wpt>\n';


	return gpx;
}

function getWaypointsGPXFromGeocache(waypoint,geocache){
    var waypointName = waypoint.prefix+geocache.gcid.replace(/GC/,'');
	var gpx = 	'<wpt xmlns="http://www.topografix.com/GPX/1/0" lat="'+ waypoint.latitude +'" lon="'+ waypoint.longitude +'">\n';
	gpx += 		'	<time>'+ xsdDateTime(geocache.dateHidden) +'</time>\n';
	gpx += 		'	<name>'+ encodeHtml(waypointName) +'</name>\n';
	gpx += 		'	<cmt>'+ encodeHtml(waypoint.note) +'</cmt>\n';
	gpx += 		'	<desc>'+ encodeHtml(waypoint.name) +'</desc>\n';
	gpx += 		'	<sym>'+ waypoint.symbol_groundspeak +'</sym>\n';
	gpx += 		'	<type>'+ waypoint.type_groundspeak +'</type>\n';
	gpx += 		'</wpt>\n';	

	return gpx;
}
