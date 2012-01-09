// source of all evil asking groundspeak
function getGeocacheFromElement(element){
  var coordinates, logLink, minimal_geocache, $divCacheDetails, $lnkConversions;
  var geocache = {};

  /*~
  geocache
    .gcid
    .cacheid
    .guid
    .name
    .type
    .owner
    .hidden
    .coordinates
    .lat
    .lon
    .location
    .state
    .country
    .bearing
    .distance
    .inventory
    .attributes
    .size
    .difficulty
    .terrain
    .attributes
    .short_description
    .long_description
    .hint
    .images
    .additional_waypoints
    .find_counts
    .logs
  */

  // first check if really logged in
  // default, Challenges + Account + Membership ,Login
  logLink = $(element).find('a.SignedInProfileLink, a.CommonUsername, .LoginUsername');
  if (logLink.length === 0) {
    throw $.gctour.lang('notLogedIn');
  }

  if (dojo.query('input[id="ctl00_ContentBody_uxPremiumSubmitBottom"]',element)[0]) {
    return "pm only";
  }

  minimal_geocache = getMinimalGeocacheDetails(element);

  geocache.gcid = minimal_geocache.gccode;
  geocache.cacheid = minimal_geocache.cacheid;
  geocache.guid = minimal_geocache.guid;
  geocache.name = minimal_geocache.name;
  geocache.type =  minimal_geocache.type.split(".")[0];
  geocache.image = "http://www.geocaching.com/images/WptTypes/"+geocache.type+".gif";

  geocache.sym = "Geocache";
	if ( $('a#ctl00_ContentBody_hlFoundItLog', element).length >= 1 ) {
    geocache.sym = "Geocache Found";
	}

  geocache.owner = $.trim( $('a[href*="www.geocaching.com/profile/?guid="]', element).first().text() );

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

  $divCacheDetails = $('div#cacheDetails', element).first();
  geocache.hidden = parseDate(trim($('span', $divCacheDetails).eq(2).text().split(':').pop()));
  /* (01.2012)
    event caches =>
          LogedIn => okay, Example: 01/08/2012
        notLogedIn => unfortunately has an other format => Example: Wednesday, February 29, 2012
          solution approach => $.datepicker.parseDate("DD, MM d, yy", date_string)
          (http://docs.jquery.com/UI/Datepicker/parseDate)
  */

  geocache.difficulty = $.trim( $("span#ctl00_ContentBody_uxLegendScale > img", element).first().attr("alt").split(" out of ")[0] );
  geocache.terrain    = $.trim( $("span#ctl00_ContentBody_Localize12 > img",    element).first().attr("alt").split(" out of ")[0] );

  geocache.size       = $.trim( $('img[src*="/images/icons/container/"]',       element).first().attr("alt").split(": ")[1]);

  geocache.coordinates = $('span#uxLatLon', element).first().html();

  $lnkConversions = $('a#ctl00_ContentBody_lnkConversions', element).first().attr("href");
  geocache.lat = $lnkConversions.split("lat=")[1].split("&")[0];
  geocache.lon = $lnkConversions.split("lon=")[1].split("&")[0];

  // if the user changed the coordinates of this geocache
  if(GM_getValue('coords_'+geocache.gcid,"null") != "null"){ // use it
    coordinates = GM_getValue('coords_'+geocache.gcid,"null");
    geocache.lat = coordinates.split("#")[0];
    geocache.lon = coordinates.split("#")[1];
    geocache.coordinates = new LatLon(geocache.lat , geocache.lon ).toString();

  }

  geocache.location = $("span#ctl00_ContentBody_Location", element).first().text();

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
  geocache.attributes_array = [];

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
        geocache.attributes_array.push([attributes_array[attributesDef_i][0],attributes_array[attributesDef_i][1],attributes_array[attributesDef_i][2], ((attribute_array[1]=="yes")?1:0)]);
      }
    }
  }

  geocache.short_description = dojo.query('span[id="ctl00_ContentBody_ShortDescription"]',element)[0];
  geocache.long_description = dojo.query('span[id="ctl00_ContentBody_LongDescription"]',element)[0];
  geocache.images = dojo.query('a[rel="lightbox"]',element);

  geocache.additional_waypoints = [];

  var additional_waypoints = dojo.query('table[class="Table"] > tbody > tr',element);

  for(var i = 0;i < additional_waypoints.length;i = i+2){

    var row1 = additional_waypoints[i];
    var row2 = additional_waypoints[i+1];

    var row1_tds = row1.getElementsByTagName('td');
    var row2_tds = row2.getElementsByTagName('td');

    coordinates = parseCoordinates(row1_tds[6].textContent);
    var waypoint = {};
    waypoint.symbol = row1_tds[2].childNodes[1].src;
    waypoint.prefix = trim(row1_tds[3].textContent);
    waypoint.lookup = trim(row1_tds[4].textContent);
    waypoint.name = row1_tds[5].childNodes[1].textContent;
    waypoint.coordinates = trim(row1_tds[6].textContent);
    waypoint.latitude = coordinates._lat;
    waypoint.longitude = coordinates._lon;
    waypoint.note = trim(row2_tds[2].textContent);

    // Final Location        http://www.geocaching.com/images/wpttypes/sm/flag.jpg
    // Parking Area          http://www.geocaching.com/images/wpttypes/sm/pkg.jpg
    // Question to Answer       http://www.geocaching.com/images/wpttypes/sm/puzzle.jpg
    // Stages of a Multicache    http://www.geocaching.com/images/wpttypes/sm/stage.jpg
    // Trailhead          http://www.geocaching.com/images/wpttypes/sm/trailhead.jpg
    // Reference Point        http://www.geocaching.com/images/wpttypes/sm/waypoint.jpg
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
  geocache.logs = getLogs(userToken);

  log("fn getGeocacheFromElement - geocache.logs.length: " + geocache.logs.length);

  return geocache;
}

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

