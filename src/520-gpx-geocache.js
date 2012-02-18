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

function getGPXGeoCache(gcid){
  var i;  // for ()
  var geocache      = {},
      geocache_obj  = getGeocache(gcid);

  if (geocache_obj === "pm only") {
    return geocache_obj;
  }

  /*
  geocache.gcid
    .guid
    .cacheid
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

  geocache.gcid = geocache_obj.gcid;
  if (GM_getValue('gpxstripgc', false)) {
    geocache.gcid = geocache.gcid.replace(/GC/,'');
  }

  geocache.guid = geocache_obj.guid;

  geocache.cacheid   = geocache_obj.cacheid;
  geocache.archived  = (geocache_obj.archived)  ? "True" : "False";
  geocache.available = (geocache_obj.available) ? "True" : "False";

  geocache.cacheName  = geocache_obj.name;
  geocache.cacheOwner = geocache_obj.owner;
  geocache.cacheType  = geocache_obj.type;
  geocache.cacheSize  = geocache_obj.size;
  geocache.cacheSym   = geocache_obj.sym;

  switch (geocache_obj.type) {
      case "micro":      geocache.cacheSize = "Micro";      break;
      case "small":      geocache.cacheSize = "Small";      break;
      case "regular":    geocache.cacheSize = "Regular";    break;
      case "large":      geocache.cacheSize = "Large";      break;
      case "other":      geocache.cacheSize = "Other";      break;
      case "not_chosen": geocache.cacheSize = "Not chosen"; break;
      case "virtual":    geocache.cacheSize = "Virtual";    break;
      default:           geocache.cacheType = "";           break;
  }

  // define the cache type
  // if the GPX type is Groundspeak - parse type through the wptArr from autotour:

  for( i = 0; i < wptArray.length; i++){
    if(wptArray[i].wptTypeId == geocache_obj.type){
      geocache.cacheType = wptArray[i].name;
    }
  }

  geocache.attributes_array = geocache_obj.attributes_array;
  geocache.difficulty = geocache_obj.difficulty;
  geocache.terrain = geocache_obj.terrain;

  // get the summery and the description
  var summary     = geocache_obj.short_description,
      description = geocache_obj.long_description;

  if (GM_getValue('gpxhtml',true)) {
    geocache.longDescription  = (description.length === 1) ? description.html() : "";
    geocache.shortDescription = (summary.length === 1)     ? summary.html()     : "";
  } else {
    geocache.longDescription  = (description.length === 1) ? description.text() : "";
    geocache.shortDescription = (summary.length === 1)     ? summary.text()     : "";
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
    logObj.type = gc_log.LogType;

//    debug("Logtype: "+gc_log.LogType+ " to GPX Type:"+logObj.type);
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

  log([
    "--------------[START " + geocache.gcid + "]-------------",
    "gcid: \t\t"        + geocache.gcid,
    "guid: \t\t"        + geocache.guid,
    "cacheid: \t"       + geocache.cacheid,
    "archived: \t"      + geocache.archived,
    "available: \t"     + geocache.available,
    "cacheName:\t"      + geocache.cacheName,
    "cacheSym (GPX):\t" + geocache.cacheSym,
    "cacheOwner:\t"     + geocache.cacheOwner,
    "dateHidden:\t"     + geocache.dateHidden,
    "cacheType:\t"      + geocache.cacheType,
    "cacheSize:\t"      + geocache.cacheSize,
    "difficulty:\t"     + geocache.difficulty,
    "terrain:\t"        + geocache.terrain,
    //~ "latLon:\t"       + geocache.latLon.innerHTML,
    "latitude:\t"       + geocache.latitude,
    "longitude:\t"      + geocache.longitude,
    "state:\t\t"        + geocache.state,
    "country:\t"        + geocache.country,
    "shortDescription:\n\n" + geocache.shortDescription,
    "longDescription:\n\n"  + geocache.longDescription,
    "hint:\t\t"        + geocache.hint,
    "--------------[END " + geocache.gcid + "]--------------"
  ].join("\n"));

  return geocache;
}


function getGPX(){
  var i, ii, iii;  // for ()

  var gpxHeader =
    '<?xml version="1.0" encoding="utf-8"?>\n' +
    '<gpx xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" version="1.0" creator="GCTour" xsi:schemaLocation="http://www.topografix.com/GPX/1/0 http://www.topografix.com/GPX/1/0/gpx.xsd http://www.groundspeak.com/cache/1/0/1 http://www.groundspeak.com/cache/1/0/1/cache.xsd" xmlns="http://www.topografix.com/GPX/1/0">\n' +
    '  <name>' +currentTour.name+'</name>\n' +
    '  <desc>This is an individual cache generated from Geocaching.com</desc>\n' +
    '  <author>GCTour v' +VERSION+'.' +BUILD+'</author>\n' +
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
    '  <desc>##CACHENAME## by ##OWNER##, ##TYPE## (##DIFFICULTY##/##TERRAIN##)</desc>\n' + //'  <url>http://www.geocaching.com/seek/cache_details.aspx?wp=##GCID##</url>\n' +
    '  <url>http://www.geocaching.com/seek/cache_details.aspx?guid=##GUID##</url>\n' +
    '  <urlname>##CACHENAME##</urlname>\n' +
    '  <sym>##CACHESYM##</sym>\n' +
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
    '</wpt>';

  var geocacheLogTemplate =
    '      <groundspeak:log id="##LOGID##">\n' +
    '        <groundspeak:date>##TIME##</groundspeak:date>\n' +
    '        <groundspeak:type>##LOGTYPE##</groundspeak:type>\n' +
    '        <groundspeak:finder>##CACHERNAME##</groundspeak:finder>\n' +
    '        <groundspeak:text encoded="False">##LOGTEXT##</groundspeak:text>\n' +
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
        debug("GS GPX: geocache.dateHidden:'"+geocache.dateHidden+"' -> xsd:'"+xsdDateTime(geocache.dateHidden)+"'");
        var logs =  geocache.logs;
        var logsStringArray = [];

        // create log with attributes!
        var attributeLogtext = $.map(geocache.attributes_array, function(row, i){
                                 return row[2] + ": "+ ((row[3] === 1)?"yes":"no");
                               }).join("\n");

        var attributeLog = geocacheLogTemplate;
            attributeLog = attributeLog.replace(/##LOGID##/g,geocache.cacheid);
            attributeLog = attributeLog.replace(/##TIME##/g,xsdDateTime(new Date()));
            attributeLog = attributeLog.replace(/##CACHERNAME##/g,"GCTour");
            attributeLog = attributeLog.replace(/##LOGTYPE##/g,"Write note");
            attributeLog = attributeLog.replace(/##LOGTEXT##/g,attributeLogtext);
        logsStringArray.push(attributeLog);

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
          ['GUID',        geocache.guid],
          ['AVAILABLE',   geocache.available],
          ['ARCHIVED',    geocache.archived],
          ['CACHENAME',   encodeHtml(geocache.cacheName)],
          ['CACHESYM',    geocache.cacheSym],
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
        minLat = (minLat > geocache.latitude)  ? geocache.latitude  : minLat;

        var cacheWaypoint = geocacheTemplate;

        for( ii = 0 ; ii < geocacheMapping.length ; ii++){
          cacheWaypoint = cacheWaypoint.replace(new RegExp("##"+geocacheMapping[ii][0]+"##","g"),geocacheMapping[ii][1]);
        }

        gcStrArray.push(cacheWaypoint);

        if(GM_getValue('gpxwpts',true)){
          for( iii = 0;iii<geocache.additionalWaypoints.length;iii++){
            // vielleicht sollte man die ??? Wegpunkte in die Nähe des Geocaches legen => Man hätte sie auf dem Gerät!
            if(geocache.additionalWaypoints[iii].coordinates != "???"){
              wptStrArray.push(getWaypointsGPXFromGeocache(geocache.additionalWaypoints[iii],geocache));
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

