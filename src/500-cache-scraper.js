function getGeocache(gcid){
	var req = new XMLHttpRequest();							
	var myUrl = 'http://www.geocaching.com/seek/cache_details.aspx?log=y&wp='+gcid;
	req.open("GET", myUrl, false);
	// execute the request synchron
	req.send(null);
	// after execution parse the result
	var response_div = createElement('div');
	response_div.innerHTML = req.responseText;
	
	GM_setValue("debug_lastgcid",gcid);
	GM_setValue("debug_lastcachesite",req.responseText);
	
	
	return getGeocacheFromElement(response_div);
	
}

// source of all evil asking groundspeak
function getGeocacheFromElement(element){

	//~ geocache.gcid
	//~ geocache.cacheid
	//~ geocache.guid
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
	//~ geocache.attributes
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


	// first check if really logged in 
	// default, Challenges + Account + Membership ,Login
	var logLink = $(element).find('a.SignedInProfileLink, a.CommonUsername, .LoginUsername');
	if (logLink.length === 0) {
		throw $.gctour.lang('notLogedIn');
	}
	

	var upper_tables = dojo.query('table[id="cacheDetails"] table',element);
	
	if(dojo.query('input[id="ctl00_ContentBody_uxPremiumSubmitBottom"]',element)[0]){
		return "pm only";
	}
	
	
	
	var minimal_geocache = getMinimalGeocacheDetails(element);
	
	var geocache = new Object();
	geocache.gcid = minimal_geocache.gccode;
	geocache.cacheid = minimal_geocache.cacheid;
	geocache.guid = minimal_geocache.guid;
	geocache.name = minimal_geocache.name;
	geocache.type =	minimal_geocache.type.split(".")[0];
	geocache.image = "http://www.geocaching.com/images/WptTypes/"+geocache.type+".gif";
	
	geocache.owner = trim(dojo.query('a[href*="http://www.geocaching.com/profile/?guid="]',element)[0].textContent);
	
	
	if(unsafeWindow.getGCComment){
		var comment = unsafeWindow.getGCComment(geocache.guid);
		if(comment){
			geocache.comment = comment;
		}
	}
	var usernote = dojo.query('[id="cache_note"]',element)[0];
	if(usernote){
		geocache.cache_note = usernote.innerHTML;
	}
	
	
	// check availability
	var warning_element = dojo.query('ul[class="OldWarning"]',element)[0]; // contains text like
	//This cache is temporarily unavailable. Read the logs below to read the status for this cache.
	//This cache has been archived, but is available for viewing for archival purposes.
	
	if(warning_element){	
		if(warning_element.textContent.indexOf("archived") != -1){
			geocache.archived = true;
		} else {
			geocache.archived = false;
		}
		geocache.available = false;
	} else {
		geocache.available = true;
		geocache.archived = false;
	}
	

	var ownerDateTable = upper_tables[1];
	var ownerDateSpans = dojo.query('span',ownerDateTable);
	
	
	var cacheDetails = dojo.query('div[id="cacheDetails"]',element)[0];

	//~ geocache.hidden = trim(ownerDateSpans[1].textContent.split(':').pop());
	geocache.hidden = parseDate(trim(dojo.query('span',cacheDetails)[2].textContent.split(':').pop()));

	/* not in the latest version of gc.com
	// unfortnaly event caches has an other format - parse this also -
	// may unessesary after latest update - TODO
	if(geocache.hidden.match(",")){
 	 	 	 	 	
		dateArray = trim(geocache.hidden.split(",")[1]).split(" ");
		var hiddenDay = dateArray[0];
		switch(dateArray[1]){
			case "January": var hiddenMonth = 1;break;
			case "February": var hiddenMonth = 2;break;
			case "March": var hiddenMonth = 3;break;
			case "April": var hiddenMonth = 4;break;
			case "May": var hiddenMonth = 5;break;
			case "June": var hiddenMonth = 6;break;
			case "July": var hiddenMonth = 7;break;
			case "August": var hiddenMonth = 8;break;
			case "September": var hiddenMonth = 9;break;
			case "October": var hiddenMonth = 10;break;
			case "November": var hiddenMonth = 11;break;
			case "December": var hiddenMonth = 12;break;
		}
		
		var hiddenYear = dateArray[2];
		
		geocache.hidden = hiddenMonth+"/"+hiddenDay+"/"+hiddenYear;
	}*/
	

	geocache.difficulty = dojo.query('span[id="ctl00_ContentBody_uxLegendScale"] > img',element)[0].alt.split(" out of ")[0];
	geocache.terrain = dojo.query('span[id="ctl00_ContentBody_Localize12"] > img',element)[0].alt.split(" out of ")[0];


	geocache.size = trim(dojo.query('img[src*="/images/icons/container/"]',element)[0].alt.split(": ")[1]);


	geocache.coordinates = dojo.query('span[id="ctl00_ContentBody_LatLon"]',element)[0].innerHTML;
	geocache.lat = dojo.query('a[id="ctl00_ContentBody_lnkConversions"]',element)[0].href.split("lat=")[1].split("&")[0];
	geocache.lon = dojo.query('a[id="ctl00_ContentBody_lnkConversions"]',element)[0].href.split("lon=")[1].split("&")[0];
	

	// if the user changed the coordinates of this geocache
	if(GM_getValue('coords_'+geocache.gcid,"null") != "null"){ // use it
		var coordinates = GM_getValue('coords_'+geocache.gcid,"null");
		geocache.lat = coordinates.split("#")[0];
		geocache.lon = coordinates.split("#")[1];	
		geocache.coordinates = new LatLon(geocache.lat , geocache.lon ).toString();
		
	}

	geocache.location = dojo.query("span[id='ctl00_ContentBody_Location']",element)[0].textContent;
	
	// get the country and (if exists) the state!
	if(geocache.location.indexOf(",") < 0){ // if the index of "," < 0 then the state is not given! 
		geocache.state = "";
		geocache.country = trim(geocache.location.split("In ")[1]);
	} else {
		geocache.state = trim(geocache.location.split("In ")[1].split(',')[0]);
		geocache.country = trim(geocache.location.split("In ")[1].split(',')[1]);
	}
	

	
  	try{
		geocache.bearing =  dojo.query('span[id="ctl00_ContentBody_lblDistFromHome"] > img',element)[0].alt;
		geocache.distance =  dojo.query('span[id="ctl00_ContentBody_lblDistFromHome"]',element)[0].textContent.replace(" from your home location","");
	} catch(e) {geocache.bearing = "";geocache.distance = "";} // if homecoordinates are not set
	
	geocache.inventory = dojo.query('ul > li > a > img', dojo.query('div[class="WidgetBody"]',element)[2]);
	
	geocache.attributes = dojo.query('div[class="CacheDetailNavigationWidget BottomSpacing"] >div > img',element);
	geocache.attributes_array = new Array();

	for (var attributes_i = 0; attributes_i < geocache.attributes.length; attributes_i++){
		// get current attribute image
		var attribute = geocache.attributes[attributes_i];
		
		//  remove garbage from source address und split it at the "-"
		var attribute_array = attribute.src.replace("http://www.geocaching.com/images/attributes/","").replace(".gif", "").split("-");
		
		// iterate over every attributes defined in the global attributes array
		for (var attributesDef_i = 0; attributesDef_i < attributes_array.length; attributesDef_i++){
			// ... and check whether the image is equal to the definition
			if(attribute_array[0] == attributes_array[attributesDef_i][1]){
				// add this attribute as array with id-0, image-1, name-2 and yes/no-4 
				geocache.attributes_array.push(new Array(attributes_array[attributesDef_i][0],attributes_array[attributesDef_i][1],attributes_array[attributesDef_i][2], ((attribute_array[1]=="yes")?1:0)));
			}
		}
	}
	
	
	geocache.short_description = dojo.query('span[id="ctl00_ContentBody_ShortDescription"]',element)[0];
	geocache.long_description = dojo.query('span[id="ctl00_ContentBody_LongDescription"]',element)[0];
	geocache.images = dojo.query('a[rel="lightbox"]',element);
	
	geocache.additional_waypoints = new Array();
	
	var additional_waypoints = dojo.query('table[class="Table"] > tbody > tr',element);


	for(var i = 0;i < additional_waypoints.length;i = i+2){

		var row1 = additional_waypoints[i];
		var row2 = additional_waypoints[i+1];
		
		var row1_tds = row1.getElementsByTagName('td');
		var row2_tds = row2.getElementsByTagName('td');

		var coordinates = parseCoordinates(row1_tds[6].textContent);		
		var waypoint = new Object();
		waypoint.symbol = row1_tds[2].childNodes[1].src;
		waypoint.prefix = trim(row1_tds[3].textContent);
		waypoint.lookup = trim(row1_tds[4].textContent);
		waypoint.name = row1_tds[5].childNodes[1].textContent;
		waypoint.coordinates = trim(row1_tds[6].textContent);
		waypoint.latitude = coordinates._lat;
		waypoint.longitude = coordinates._lon;	
		waypoint.note = trim(row2_tds[2].textContent);



		// Final Location				http://www.geocaching.com/images/wpttypes/sm/flag.jpg
		// Parking Area					http://www.geocaching.com/images/wpttypes/sm/pkg.jpg
		// Question to Answer 			http://www.geocaching.com/images/wpttypes/sm/puzzle.jpg
		// Stages of a Multicache		http://www.geocaching.com/images/wpttypes/sm/stage.jpg
		// Trailhead					http://www.geocaching.com/images/wpttypes/sm/trailhead.jpg
		// Reference Point				http://www.geocaching.com/images/wpttypes/sm/waypoint.jpg
		switch (waypoint.symbol) {
			case "http://www.geocaching.com/images/wpttypes/sm/flag.jpg":
				waypoint.symbol_groundspeak = "Final Location";
				waypoint.type_groundspeak = "Waypoint|Final Location";
				break;
			case "http://www.geocaching.com/images/wpttypes/sm/pkg.jpg":
				waypoint.symbol_groundspeak = "Parking Area";
				waypoint.type_groundspeak = "Waypoint|Parking Area";
				break;
			case "http://www.geocaching.com/images/wpttypes/sm/puzzle.jpg":
				waypoint.symbol_groundspeak = "Question to Answer";
				waypoint.type_groundspeak = "Waypoint|Question to Answer";
				break;
			case "http://www.geocaching.com/images/wpttypes/sm/stage.jpg":
				waypoint.symbol_groundspeak = "Stages of a Multicache";
				waypoint.type_groundspeak = "Waypoint|Stages of a Multicache";
				break;
			case "http://www.geocaching.com/images/wpttypes/sm/trailhead.jpg":
				waypoint.symbol_groundspeak = "Trailhead";
				waypoint.type_groundspeak = "Waypoint|Trailhead";
				break;
			case "http://www.geocaching.com/images/wpttypes/sm/waypoint.jpg":
				waypoint.symbol_groundspeak = "Reference Point";
				waypoint.type_groundspeak = "Waypoint|Reference Point";
				break;
			default:
				waypoint.symbol_groundspeak = "Unknown Type";
				waypoint.type_groundspeak = "Waypoint|Unknown Type";
				break;
			
		}
		
		
		
		geocache.additional_waypoints.push(waypoint);    
	}
	

	
	var hints_element = dojo.query('div[id="div_hint"]',element)[0];
	if(hints_element){
		geocache.hint = convertROTStringWithBrackets(trim(hints_element.textContent));
	} else {
		geocache.hint = "";
	}
	
	geocache.find_counts = dojo.query('span[id="ctl00_ContentBody_lblFindCounts"] > p ',element)[0];
	
	
	// hole den UserToken und benutze ihn um die Logs einzusammeln
	var userToken = element.innerHTML.split("userToken = '")[1].split("'")[0];
	geocache.logs = getAllLogs(userToken);
	
	
	
	
	/* old code - nicht mehr benötigt seit dem man die Logs mittels JSON abholen kann 
	var logs_td = dojo.query('table[class="LogsTable"] > tbody > tr > td',element);
	for(var log_i = 0;log_i < logs_td.length-1;log_i++){
		var log_object = new Object();
		
		
		// log
		//	from: "madd.in"
		//	type: "Found It", "Didn't find it", "Temporarily Disable Listing", "Write note", "Enable Listing",...
		//  text: "Netter Log eintrag."
		//	logdate: "August 18" oder "February 17, 2007"
		//	id: 12345679
		var log = logs_td[log_i];
		log_object.from = dojo.query('p[class="logOwnerProfileName"] > strong > a',log)[0].innerHTML;	
		log_object.typeImg = dojo.query('div[class="HalfLeft LogType"] > strong > img',log)[0];
		log_object.type = log_object.typeImg.alt;
		log_object.text = dojo.query('p[class="LogText"]',log)[0].innerHTML;
		log_object.logdate = parseDate(dojo.query("span[class='minorDetails LogDate']",log)[0].innerHTML);
		var log_uid = dojo.query("a:last-child",log)[0].href.split("=")[1]; // get the log id from the link
		log_object.id = parseInt(log_uid.replace(/-/g,""),16)%10000000; // and create a semi unique id
		
	/ * nicht genutzter Quelltext für die kurze umstellunge des Datums
		// bestimme den ungefähren tag des Logs
			// today
			// about a day ago
			// about 2 days ago
			// about 25 days ago
			// about a month ago
			// about 2 months ago
			// about a year ago
			// about 2 year ago
			var days = 0;
			var today = new Date();
			var p = new RegExp(/about (a|\d+) (day|month|year)/);
			var m = p.exec(dojo.query("span[class='minorDetails LogDate']",logs_td[0])[0].innerHTML);
			if(m != null){
				var quantity = (m[1] == "a")?1:m[1];
		
				switch (m[2]) {
					case "day": 
						days = quantity * 1;
						break;
					case "month": 
						days = quantity * 30;
						break;
					case "year": 
						days = quantity * 365;
						break;
				}

				

			} 
			var millisecs = days * 24 * 60 * 60 * 1000; // wenn regex nicht greift - dann wird das Datum auf den aktuellen Tag datiert - z.B. bei "today"
		log_object.date = new Date(today.getTime()-millisecs);
* /

		

		geocache.logs.push(log_object);
	} */
	
	return geocache;
}
