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
	var logIOLink = dojo.byId('ctl00_LoginUrl');
	logIOLink = dojo.query("a[href*='http://www.geocaching.com/my/']")[0];
	if(!logIOLink){
		throw "No longer logged in.";
	}

	var geocache = new Object();
	geocache.gcid = trim(dojo.query('span[id="ctl00_uxWaypointName"]',element)[0].textContent);
	geocache.cacheid = trim(dojo.query('a[href*="http://www.geocaching.com/seek/log.aspx?ID="]',element)[0].href.split("=")[1]);
	geocache.guid = dojo.query("a[id='ctl00_ContentBody_lnkPrintFriendly']",element)[0].href.split("guid=")[1];
	geocache.name = trim(dojo.query('span[id="ctl00_ContentBody_CacheName"]',element)[0].textContent);
	geocache.type =	dojo.query('a[href="/about/cache_types.aspx"] > img',element)[0].src.split("/")[5].split(".")[0];
	geocache.owner = trim(dojo.query('a[href*="http://www.geocaching.com/profile/?guid="]',element)[0].textContent);
	

	var strongs = dojo.query('strong',element);
	geocache.hidden = trim(strongs[1].parentNode.textContent.split(':').pop());
	
	// unfortnaly event caches has an other format - parse this also
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
	}
	
	geocache.size = dojo.query('small',element)[0].textContent.split("(")[1].split(")")[0];
	geocache.difficulty = dojo.query('img',strongs[3].parentNode)[0].alt.split(" out of ")[0];
	geocache.terrain = dojo.query('img',strongs[4].parentNode)[0].alt.split(" out of ")[0];


	geocache.coordinates = dojo.query('span[id="ctl00_ContentBody_LatLon"]',element)[0].innerHTML;
	geocache.lat = dojo.query('a[id="ctl00_ContentBody_lnkConversions"]',element)[0].href.split("lat=")[1].split("&")[0];
	geocache.lon = dojo.query('a[id="ctl00_ContentBody_lnkConversions"]',element)[0].href.split("lon=")[1].split("&")[0];
	
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
		geocache.distance =  dojo.query('span[id="ctl00_ContentBody_lblDistFromHome"]',element)[0].textContent.replace(" from your home coordinates","");
	} catch(e) {geocache.bearing = "";geocache.distance = "";}
	
	geocache.inventory = dojo.query('ul > li > a > img', dojo.query('div[class="WidgetBody"]',element)[1]);

	geocache.attributes = dojo.query('div[class="CacheDetailNavigationWidget Spacing"] > img',element);
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
	geocache.images = dojo.query('span[id="ctl00_ContentBody_Images"] > a',element);
	
	geocache.additional_waypoints = new Array();
	
	var additional_waypoints = dojo.query('table[class="Table"] > tbody > tr',element);


	for(var i = 0;i < additional_waypoints.length;i = i+2){

		var row1 = additional_waypoints[i];
		var row2 = additional_waypoints[i+1];
		
		var row1_tds = row1.getElementsByTagName('td');
		var row2_tds = row2.getElementsByTagName('td');

		
		var coordinates_array = parse_coordinates(row1_tds[6].textContent);
		


		
		var waypoint = new Object();
		waypoint.symbol = row1_tds[2].childNodes[1].src;
		waypoint.prefix = trim(row1_tds[3].textContent);
		waypoint.lookup = trim(row1_tds[4].textContent);
		waypoint.name = row1_tds[5].childNodes[1].textContent;
		waypoint.coordinates = trim(row1_tds[6].textContent);
		waypoint.latitude = coordinates_array[0];
		waypoint.longitude = coordinates_array[1];		
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
	geocache.logs = new Array();
	var logs =  dojo.query('table[class="LogsTable Table"] > tbody > tr > td',element);
 
	for(var log_i = 0;log_i < logs.length-1;log_i++){		
		var log_object = new Object();
		log_object.from = logs[log_i].firstChild.innerHTML;
		log_object.text = logs[log_i].textContent.replace(logs[log_i].firstChild.textContent, "").replace("View Log","").replace(/\(\d+ found\)/, "");
	
		geocache.logs.push(log_object);
		
	}
	return geocache;
}
