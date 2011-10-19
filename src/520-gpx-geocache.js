function getGPXGeoCache(gcid){
	var i;  // for ()

	var geocache      = {},
			geocache_obj  = getGeocache(gcid),
			isGroundspeak = (GM_getValue("gpxschema",0) === 0);

	if(geocache_obj === "pm only"){
		return geocache_obj;
	}

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

	geocache.cacheid   = geocache_obj.cacheid;
	geocache.archived  = (geocache_obj.archived)  ? "True" : "False";
	geocache.available = (geocache_obj.available) ? "True" : "False";

	geocache.cacheName  = geocache_obj.name;
	geocache.cacheOwner = geocache_obj.owner;
	geocache.cacheType  = geocache_obj.type;
	geocache.cacheSize  = geocache_obj.size;

	if(isGroundspeak){
		switch (geocache_obj.type) {
			case "micro":      geocache.cacheSize = "Micro";break;
			case "small":      geocache.cacheSize = "Small";break;
			case "regular":    geocache.cacheSize = "Regular";break;
			case "large":      geocache.cacheSize = "Large";break;
			case "other":      geocache.cacheSize = "Other";break;
			case "not_chosen": geocache.cacheSize = "Not chosen";break;
			case "virtual":    geocache.cacheSize = "Virtual";break;
			default:           geocache.cacheType = "";break;
		}
	} else {
		// if "Not chosen" is the Cachesize - REMOVE IT!
		geocache.cacheSize = (geocache_obj.size == "Not chosen") ? "Other" : geocache_obj.size;
	}

	// define the cache type
	// if the GPX type is Groundspeak - parse type through the wptArr from autotour:
	if(isGroundspeak){
		for( i = 0; i < wptArray.length; i++){	
			if(wptArray[i]['wptTypeId'] == geocache_obj.type){
				geocache.cacheType = wptArray[i]['name'];
			}
		}
	} else {
		switch (geocache_obj.type){
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
				break;
		}	
	}

	geocache.attributes_array = geocache_obj.attributes_array;
	geocache.difficulty = geocache_obj.difficulty;
	geocache.terrain = geocache_obj.terrain;

	// get the summery and the description
	var summary     = geocache_obj.short_description,
	    description = geocache_obj.long_description;

	if(GM_getValue('gpxhtml',true)){
		geocache.longDescription  = (description) ? description.innerHTML   : "";
		geocache.shortDescription = (summary)     ? summary.innerHTML       : "";
	} else {
		geocache.longDescription  = (description) ? description.textContent : "";
		geocache.shortDescription = (summary)     ? summary.textContent     : "";
	}

	geocache.hint    = geocache_obj.hint;
	geocache.state   = geocache_obj.state;
	geocache.country = geocache_obj.country;

	// hidden Date
	geocache.dateHidden = geocache_obj.hidden;

	geocache.logs = [];

	for( i = 0; i < geocache_obj.logs.length; i++){
		var logObj = {};

		// from: "madd.in"
		// type: "Found It", "Didn't find it", "Temporarily Disable Listing", "Write note", "Enable Listing",...
		//  text: "Netter Log eintrag."
		// logdate: "August 18" oder "February 17, 2007"
		// id: 12345679

		var gc_log = geocache_obj.logs[i];
		logObj.cacherName = gc_log.UserName;

		if(!isGroundspeak){
			switch (gc_log.LogType) {
				case "Found it":
				logObj.type = "Found";
				break;
			case "Didn't find it":
				logObj.type = "Not Found";
				break;
			case "Write note":
				logObj.type = "Note";
				break;
			default:
				logObj.type ="Other";
				break;
			}
		} else {
			logObj.type = gc_log.LogType;
		}
/*
		switch (gc_log.LogType) {
			case "Found it":
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
			case "Temporarily Disable Listing":
				logObj.type = (isGroundspeak)?"Temporarily Disable Listing":"Note";
				break;
			case "Enable Listing":
				logObj.type = (isGroundspeak)?"Enable Listing":"Note";
				break;
			case "Unarchive":
				logObj.type = (isGroundspeak)?"Unarchive":"Note";
				break;
			case "Archive":
				logObj.type = (isGroundspeak)?"Archive":"Note";
				break;
			case "Publish Listing":
				logObj.type = (isGroundspeak)?"Publish Listing":"Note";
				break;
			case "Enable Listing":
				logObj.type = (isGroundspeak)?"Enable Listing":"Note";
				break;
			case "Update Coordinates":
				logObj.type = (isGroundspeak)?"Update Coordinates":"Note";
				break;
			default:
				logObj.type = (isGroundspeak)?"Write note":"Other";
				break;
			
		}
*/
		debug("Logtype: "+gc_log.LogType+ " to GPX Type:"+logObj.type);
		logObj.foundDate = parseDate(gc_log.Created);
		logObj.content   = gc_log.LogText;
		logObj.id        = gc_log.LogID;

		// jobs done great - lets save this
		geocache.logs.push(logObj);
	}

	//additionalWaypoints
	geocache.additionalWaypoints = geocache_obj.additional_waypoints;

	geocache.latitude  = geocache_obj.lat;
	geocache.longitude = geocache_obj.lon;

	log("--------------[START "+geocache.gcid+"]-------------");
	log("gcid:"       + geocache.gcid);
	log("cacheName:"  + geocache.cacheName);
	log("cacheOwner:" + geocache.cacheOwner);
	log("dateHidden:" + geocache.dateHidden);
	log("cacheType:"  + geocache.cacheType);
	log("cacheSize:"  + geocache.cacheSize);

	log("difficulty:" + geocache.difficulty);
	log("terrain:"    + geocache.terrain);
	log("longDescription:"  + geocache.longDescription);
	log("shortDescription:" + geocache.shortDescription);
	//~ log("latLon:"    + geocache.latLon.innerHTML);
	log("latitude:"   + geocache.latitude);
	log("longitude:"  + geocache.longitude);
	log("state:"      + geocache.state);
	log("country:"    + geocache.country);

	//~ log("logs:"      + geocache.logs.length);
	log("--------------[END "+geocache.gcid+"]--------------");

	return geocache;
}

function getGPXNew(){
	var i, ii, iii;  // for ()
	var dom = null,
	    waypoint = null;

	var gpxHeader =
		'<?xml version="1.0" encoding="utf-8"?>' +
		'<gpx xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
		'     xsi:schemaLocation="http://www.topografix.com/GPX/1/0 http://www.topografix.com/GPX/1/0/gpx.xsd http://geocaching.com.au/geocache/1 http://geocaching.com.au/geocache/1/geocache.xsd"' +
		'     xmlns="http://www.topografix.com/GPX/1/0"' +
		'     version="1.0"' +
		'     creator="gctour.madd.in">' +
		'  <desc>Geocache</desc>' +
		'  <author>GCTour</author>' +
		'  <url>http://gctour.madd.in</url>' +
		'  <urlname>gctour.madd.in</urlname>' +
		'  <time>' + xsdDateTime(new Date()) +'</time>' +
		'</gpx>';

	var gpxDom = parseXml(gpxHeader,"application/xml");
	var gpxElement = gpxDom.getElementsByTagName('gpx')[0];		

	var waypointTemplate =
		'  <wpt xmlns="http://www.topografix.com/GPX/1/0" lat="##LAT##" lon="##LON##">' +
		'    <time>##TIME##</time>' +
		'    <name>##GCID##</name>' +
		'    <desc>##CACHENAME##</desc>' +
		'    <src>www.geocaching.com</src>' +
		'    <url>http://www.geocaching.com/seek/cache_details.aspx?wp=##GCID##</url>' +
		'    <urlname>##CACHENAME##</urlname>' +
		'    <sym>Geocache</sym>' +
		'    <type>Geocache</type>' +
		'    <geocache status="Available" xmlns="http://geocaching.com.au/geocache/1">' +
		'      <name>##CACHENAME##</name>' +
		'      <owner>##OWNER##</owner>' +
		'      <locale></locale>' +
		'      <state>##STATE##</state>' +
		'      <country>##COUNTRY##</country>' +
		'      <type>##TYPE##</type>' +
		'      <container>##CONTAINER##</container>' +
		'      <difficulty>##DIFFICULTY##</difficulty>' +
		'      <terrain>##TERRAIN##</terrain>' +
		'      <summary html="true">##SUMMARY##</summary>' +
		'      <description html="true">##DESCRIPTION##</description>' +
		'      <hints>##HINT##</hints>' +
		'      <licence></licence>' +
		'      <logs>##LOGS##</logs>' +
		'    </geocache>' +
		'  </wpt>';

	var waypointLogTemplate =
		'<log id="##LOGID##">' +
		'  <time>##TIME##</time>' +
		'  <geocacher>##CACHERNAME##</geocacher>' +
		'  <type>##LOGTYPE##</type>' +
		'  <text>##LOGTEXT##</text>' +
		'</log>';
		
	for ( i = 0; i < currentTour.geocaches.length; i++){

		// if the cancel-button is pressed 
		if(GM_getValue("stopTask",false)){
			GM_setValue("stopTask",false);
			return "canceled"; // then return!
		}

		var costumMarker = (typeof(currentTour.geocaches[i].lat) != "undefined");

		if(!costumMarker){

			var geocache = getGPXGeoCache(currentTour.geocaches[i].id);

			if(geocache !== "pm only"){

				var logsStringArray = [];

				var logs = geocache.logs;
				// just 10 logs in the gpx
				for ( ii = 0; (ii < logs.length && ii < 10); ii++){
					var geocacheLogMapping = [
						['LOGID',      logs[ii].id],
						['TIME',       xsdDateTime(logs[ii].foundDate)],
						['CACHERNAME', encodeHtml(logs[ii].cacherName)],
						['LOGTYPE',    logs[ii].type],
						['LOGTEXT',    encodeHtml($("<div/>").html(logs[ii].content.br2space()).text().trimAll())]
					];
					
					var cacheWaypointLog = waypointLogTemplate;

					for( iii = 0 ; iii < geocacheLogMapping.length ; iii++){
						cacheWaypointLog = cacheWaypointLog.replace(new RegExp("##"+geocacheLogMapping[iii][0]+"##","g"),geocacheLogMapping[iii][1]);
					}

					logsStringArray.push(cacheWaypointLog);
				}

				var geocacheMapping = [
					['LAT',         geocache.latitude],
					['LON',         geocache.longitude],
					['TIME',        xsdDateTime(geocache.dateHidden)],
					['GCID',        geocache.gcid],
					['CACHENAME',   encodeHtml(geocache.cacheName)],
					['OWNER',       encodeHtml(geocache.cacheOwner)],
					['STATE',       encodeHtml(geocache.state)],
					['COUNTRY',     encodeHtml(geocache.country)],
					['TYPE',        geocache.cacheType],
					['CONTAINER',   geocache.cacheSize],
					['DIFFICULTY',  geocache.difficulty],
					['TERRAIN',     geocache.terrain],
					['SUMMARY',     encodeHtml(geocache.shortDescription)],
					['DESCRIPTION', encodeHtml(geocache.longDescription)],
					['HINT',        encodeHtml(geocache.hint)],
					['LOGS',        logsStringArray.join("")]
				];

				var cacheWaypoint = waypointTemplate;

				for( ii = 0 ; ii<geocacheMapping.length ; ii++){
					cacheWaypoint = cacheWaypoint.replace(new RegExp("##"+geocacheMapping[ii][0]+"##","g"),geocacheMapping[ii][1]);
				}

				dom = parseXml(cacheWaypoint, "text/xml");
				waypoint = dom.getElementsByTagName('wpt')[0];
				gpxElement.appendChild(waypoint);

				if(GM_getValue('gpxwpts',true)){
					for( iii = 0;iii<geocache.additionalWaypoints.length;iii++){
						
						if(geocache.additionalWaypoints[iii].coordinates != "???"){
							dom = parseXml(getWaypointsGPXFromGeocache(geocache.additionalWaypoints[iii],geocache),"text/xml");
							waypoint = dom.getElementsByTagName('wpt')[0];
							gpxElement.appendChild(waypoint);	
						}
					}
				}
			} // pm only check

		} else { // costum marker check
			dom = parseXml(getGPXfromMarker(currentTour.geocaches[i]),"text/xml");
			waypoint = dom.getElementsByTagName('wpt')[0];
			gpxElement.appendChild(waypoint);	
		}
	setProgress(i,currentTour.geocaches.length,document);

	} // itertion end 

	var str = new XMLSerializer().serializeToString(gpxDom);
	return str;

}

function getGPX(){
	var i, ii, iii;  // for ()

	var gpxHeader = 
		'<?xml version="1.0" encoding="utf-8"?>\n' +
		'<gpx xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" version="1.0" creator="GCTour" xsi:schemaLocation="http://www.topografix.com/GPX/1/0 http://www.topografix.com/GPX/1/0/gpx.xsd http://www.groundspeak.com/cache/1/0/1 http://www.groundspeak.com/cache/1/0/1/cache.xsd" xmlns="http://www.topografix.com/GPX/1/0">\n' +
		'  <name>' +currentTour.name+'</name>\n' +
		'  <desc>This is an individual cache generated from Geocaching.com</desc>\n' +
		'  <author>GCTour v' +version+'.' +build+'</author>\n' +
		'  <email>gctour@madd.in</email>\n' +
		'  <url>http://www.geocaching.com</url>\n' +
		'  <urlname>Geocaching - High Tech Treasure Hunting</urlname>\n' +
		'  <time>' + xsdDateTime(new Date()) +'</time>\n' +
		'  <keywords>cache, geocache</keywords>\n' +
		'  <bounds minlat="##MINLAT##" minlon="##MINLON##" maxlat="##MAXLAT##" maxlon="##MAXLON##" />\n' +
		'##GEOCACHES##\n' +
		'##WAYPOINTS##\n' +
		'</gpx>';

	var geocacheTemplate =
		'<wpt lat="##LAT##" lon="##LON##">\n' +
		'  <time>##TIME##</time>\n' +
		'  <name>##GCID##</name>\n' +
		'  <desc>##CACHENAME##</desc>\n' +
		'  <src>www.geocaching.com</src>\n' +
		'  <url>http://www.geocaching.com/seek/cache_details.aspx?wp=##GCID##</url>\n' +
		'  <urlname>##CACHENAME##</urlname>\n' +
		'  <sym>Geocache</sym>\n' +
		'  <type>Geocache|##TYPE##</type>\n' +
		'  <groundspeak:cache id="##CACHEID##" available="##AVAILABLE##" archived="##ARCHIVED##" xmlns:groundspeak="http://www.groundspeak.com/cache/1/0/1">\n' +
		'    <groundspeak:name>##CACHENAME##</groundspeak:name>\n' +
		'    <groundspeak:placed_by>##OWNER##</groundspeak:placed_by>\n' +
		'    <groundspeak:owner>##OWNER##</groundspeak:owner>\n' +
		'    <groundspeak:type>##TYPE##</groundspeak:type>\n' +
		'    <groundspeak:container>##CONTAINER##</groundspeak:container>\n' +
		'    <groundspeak:attributes>\n##ATTRIBUTES##    </groundspeak:attributes>\n' +
		'    <groundspeak:difficulty>##DIFFICULTY##</groundspeak:difficulty>\n' +
		'    <groundspeak:terrain>##TERRAIN##</groundspeak:terrain>\n' +
		'    <groundspeak:country>##COUNTRY##</groundspeak:country>\n' +
		'    <groundspeak:state>##STATE##</groundspeak:state>\n' +
		'    <groundspeak:short_description html="True">##SUMMARY##</groundspeak:short_description>\n' +
		'    <groundspeak:long_description html="True">##DESCRIPTION##</groundspeak:long_description>\n' +
		'    <groundspeak:encoded_hints>##HINT##</groundspeak:encoded_hints>\n' +
		'    <groundspeak:logs>\n##LOGS##    </groundspeak:logs>\n' +
		'  </groundspeak:cache>\n' +
		'  </wpt>';

	var geocacheLogTemplate =
		'      <groundspeak:log id="##LOGID##">\n' +
		'        <groundspeak:date>##TIME##</groundspeak:date>\n' +
		'        <groundspeak:type>##LOGTYPE##</groundspeak:type>\n' +
		'        <groundspeak:finder>##CACHERNAME##</groundspeak:finder>\n' +
		'        <groundspeak:text>##LOGTEXT##</groundspeak:text>\n' +
		'      </groundspeak:log>\n';

	var gcStrArray  = [],
	    wptStrArray = [],
	    minLat, minLon,
			maxLat, maxLon;

	for ( i = 0; i < currentTour.geocaches.length; i++){

		// iff the cancelbutton is presssed 
		if(GM_getValue("stopTask",false)){
			GM_setValue("stopTask",false);
			return "canceled"; // then return!
		}

		var costumMarker = (typeof(currentTour.geocaches[i].latitude) != "undefined");

		if(!costumMarker){

			var geocache = getGPXGeoCache(currentTour.geocaches[i].id);
			if(geocache !== "pm only"){
				var logsStringArray = [];
				// create log with attributes!
				// if(true){  ??????

					for ( ii = 0; (ii < geocache.attributes_array.length); ii++){
						attribute_a = geocache.attributes_array[ii];
						GM_log(" id='"+attribute_a[0]+"' inc='"+attribute_a[3]+"' > "+attribute_a[2]);
					}
					/*
					var geocacheLogMapping = [
						['LOGID',geocache.id], // Issue3
						['TIME',xsdDateTime(new Date())],
						['CACHERNAME',"GCTour"],
						['LOGTYPE', "Note"],
						['LOGTEXT',encodeHtml($("<div/>").html(logs[ii].content.br2space()).text().trimAll())]
					];

					var cacheWaypointLog = waypointLogTemplate;

					for ( iii = 0 ; iii<geocacheLogMapping.length ; iii++){
						cacheWaypointLog = cacheWaypointLog.replace(new RegExp("##"+geocacheLogMapping[iii][0]+"##","g"),geocacheLogMapping[iii][1]);
					}
					
					logsStringArray.push(cacheWaypointLog);
					*/
				//}

				debug("GS GPX: geocache.dateHidden:'"+geocache.dateHidden+"' -> xsd:'"+xsdDateTime(geocache.dateHidden)+"'");
				var logs =  geocache.logs;
				// just 10 logs in the gpx
				for ( ii = 0; (ii < logs.length && ii < 10); ii++){
					var geocacheLogMapping = [
						['LOGID',      logs[ii].id], // Issue3
						['TIME',       xsdDateTime(logs[ii].foundDate)],
						['CACHERNAME', encodeHtml(logs[ii].cacherName)],
						['LOGTYPE',    logs[ii].type],
						['LOGTEXT',    encodeHtml($("<div/>").html(logs[ii].content.br2space()).text().trimAll())]
					];

					var cacheWaypointLog = geocacheLogTemplate;

					for ( iii = 0 ; iii<geocacheLogMapping.length ; iii++){
						cacheWaypointLog = cacheWaypointLog.replace(new RegExp("##"+geocacheLogMapping[iii][0]+"##","g"),geocacheLogMapping[iii][1]);
					}

					logsStringArray.push(cacheWaypointLog);
				}

				var attributesString = "";
				for ( ii = 0; (ii < geocache.attributes_array.length); ii++){
					attributesString += getAttributeXML(geocache.attributes_array[ii]);
				}

				var geocacheMapping = [
					['LAT',         geocache.latitude],
					['LON',         geocache.longitude],
					['TIME',        xsdDateTime(geocache.dateHidden)],
					['GCID',        geocache.gcid],
					['CACHEID',     geocache.cacheid],
					['AVAILABLE',   geocache.available],
					['ARCHIVED',    geocache.archived],
					['CACHENAME',   encodeHtml(geocache.cacheName)],
					['OWNER',       encodeHtml(geocache.cacheOwner)],
					['STATE',       encodeHtml(geocache.state)],
					['COUNTRY',     encodeHtml(geocache.country)],
					['TYPE',        geocache.cacheType],
					['CONTAINER',   geocache.cacheSize],
					['ATTRIBUTES',  attributesString],
					['DIFFICULTY',  geocache.difficulty],
					['TERRAIN',     geocache.terrain],
					['SUMMARY',     encodeHtml(geocache.shortDescription)],
					['DESCRIPTION', encodeHtml(geocache.longDescription)],
					['HINT',        encodeHtml(geocache.hint)],
					['LOGS',        logsStringArray.join("")]
				];

				if (!maxLat){
					maxLat = geocache.latitude;
					minLat = geocache.latitude;
					maxLon = geocache.longitude;
					minLon = geocache.longitude;
			  }

				maxLat = (maxLat < geocache.latitude)  ? geocache.latitude  : maxLat;
				maxLon = (maxLon < geocache.longitude) ? geocache.longitude : maxLon;
				minLon = (minLon > geocache.longitude) ? geocache.longitude : minLon;
				minLat = (minLat > geocache.latitude)  ? geocache.latitude  : minLon;

				var cacheWaypoint = geocacheTemplate;
				for( ii = 0 ; ii < geocacheMapping.length ; ii++){
					cacheWaypoint = cacheWaypoint.replace(new RegExp("##"+geocacheMapping[ii][0]+"##","g"),geocacheMapping[ii][1]);
				}

				gcStrArray.push(cacheWaypoint);

				if(GM_getValue('gpxwpts',true)){
					for( iii = 0;iii<geocache.additionalWaypoints.length;iii++){

						if(geocache.additionalWaypoints[iii].coordinates != "???"){

							wptStrArray.push(getWaypointsGPXFromGeocache(geocache.additionalWaypoints[iii],geocache));
							//~ cacheWaypoint
							//~ var dom = parseXml(getWaypointsGPXFromGeocache(geocache.additionalWaypoints[iii],geocache),"text/xml");
							//~ var waypoint = dom.getElementsByTagName('wpt')[0];
							//~ gpxElement.appendChild(waypoint);	
						}
					}
				}
			} // pm only check

		} else { // costum marker check
			wptStrArray.push(getGPXfromMarker(currentTour.geocaches[i]));

			//~ var dom = parseXml(getGPXfromMarker(currentTour.geocaches[i]),"text/xml");
			//~ var waypoint = dom.getElementsByTagName('wpt')[0];
			//~ gpxElement.appendChild(waypoint);	
		}
		setProgress(i,currentTour.geocaches.length,document);

	} // itertion end 
	//~ var str = new XMLSerializer().serializeToString(gpxDom);

	var str = gpxHeader;

	str = str.replace(new RegExp("##GEOCACHES##","g"), gcStrArray.join("\n"));
	str = str.replace(new RegExp("##WAYPOINTS##","g"), wptStrArray.join("\n"));
	str = str.replace(new RegExp("##MINLAT##","g"),    minLat);
	str = str.replace(new RegExp("##MINLON##","g"),    minLon);
	str = str.replace(new RegExp("##MAXLAT##","g"),    maxLat);
	str = str.replace(new RegExp("##MAXLON##","g"),    maxLon);
	//~ getKäse();
	return str;
}

function getAttributeXML(attribute_a){
	return "        <groundspeak:attribute id='"+attribute_a[0]+"' inc='"+attribute_a[3]+"'>"+attribute_a[2]+"</groundspeak:attribute>\n";
}

function getGPXfromMarker(marker){
  var gpx = '';
	gpx += '<wpt xmlns="http://www.topografix.com/GPX/1/0" lat="' + marker.latitude +'" lon="' + marker.longitude +'">\n';
	gpx += '  <time>' + xsdDateTime(new Date())    + '</time>\n';
	gpx += '  <name>' + encodeHtml(marker.name)    + '</name>\n';
	gpx += '  <cmt>'  + encodeHtml(marker.content) + '</cmt>\n';
	gpx += '  <sym>'  + marker.symbol              + '</sym>\n';
	gpx += '</wpt>\n';
	return gpx;
}

function getWaypointsGPXFromGeocache(waypoint,geocache){
	var waypointName = waypoint.prefix+geocache.gcid.replace(/GC/,'');
	var gpx = '';
	gpx += '<wpt xmlns="http://www.topografix.com/GPX/1/0" lat="' + waypoint.latitude +'" lon="' + waypoint.longitude +'">\n';
	gpx += '  <time>' + xsdDateTime(geocache.dateHidden) + '</time>\n';
	gpx += '  <name>' + encodeHtml(waypointName)         + '</name>\n';
	gpx += '  <cmt>'  + encodeHtml(waypoint.note)        + '</cmt>\n';
	gpx += '  <desc>' + encodeHtml(waypoint.name)        + '</desc>\n';
	gpx += '  <sym>'  + waypoint.symbol_groundspeak      + '</sym>\n';
	gpx += '  <type>' + waypoint.type_groundspeak        + '</type>\n';
	gpx += '</wpt>\n';
	return gpx;
}
