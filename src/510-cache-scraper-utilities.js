// return an object with this attributes: gcid, cacheid, guid, typeimage, name
function getMinimalGeocacheDetails(detailsPage){
  /* gcid, cacheid, guid, typeimage, name */

  var geocache_details = {};
  var $obj = {}; // temp jquery container

  /* GCCode Stand 07.10.2011
   * <span id="ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode" class="CoordInfoCode">GC2HFRB</span> <--- holen über 'class'!
   * Fallback#1: nur wenn eingeloggt: <input type="submit" name="ctl00$ContentBody$btnSendToPhone" value="Send to My Phone" onclick="s2phone(&#39;GC2HFRB&#39;);return false;" id="ctl00_ContentBody_btnSendToPhone" />
   * Fallback#2: steht im HEAD: <meta property="og:url" content="http://coord.info/GC2HFRB" name="og:url">
  */
  $obj.gcc = [
    $('.CoordInfoCode', detailsPage).first().text(),
    $('input#ctl00_ContentBody_btnSendToPhone', detailsPage).first().attr('onclick'), // Fallback #1
    $('meta[name="og:url"]', detailsPage).first().attr('content')                     // Fallback #2
  ];

  geocache_details.gccode =
    ($obj.gcc[0] && $.trim($obj.gcc[0])) ||
    ($obj.gcc[1] && $.trim($obj.gcc[1].split("'")[1])) ||
    ($obj.gcc[2] && $.trim($obj.gcc[2].split('/')[3])) ||
    null;

  if (!geocache_details.gccode)  {
    throw "Fatal: Error getting GCCode! (getMinimalGeocacheDetails)";
  } else {
    debug(
      "getMinimalGeocacheDetails - GCCode: " + geocache_details.gccode + "\n" +
      "\t1: " + ( ($obj.gcc[0]) ? $obj.gcc[0] : "null" ) + "\n" +
      "\t2: " + ( ($obj.gcc[1]) ? $obj.gcc[1].split("'")[1] : "null" ) + "\n" +
      "\t3: " + ( ($obj.gcc[2]) ? $obj.gcc[2].split('/')[3] : "null" )
    );
  }


  /* CacheId aus einer diesen Quellen:
   *  HTML          REGEXP          Quelle
    ccid=1957539"      ccid=(\d+)        "View all Trackables" Link
    "CacheID":1957539  \"CacheID\":(\d+) teil der vorgeladenen Logs
    w=1957539"         \Ww=(\d+)         "Watch Listing" link
  */
  try{
    var cacheid_regex = /ccid=\d+|\"CacheID\":\d+|\Wws=\d+/;
    var cacheid_arr = cacheid_regex.exec(detailsPage.innerHTML);
    geocache_details.cacheid = cacheid_arr[0].split(/:|=/)[1];
    debug("getMinimalGeocacheDetails - CacheID:" + geocache_details.cacheid);
  } catch(e){
    throw "Error getting 'cacheid' from " + geocache_details.gccode;
  }


  /* Cachename:
   *  <span id="ctl00_ContentBody_CacheName">3, 2, 1 ... Lift-Off</span></h2>
   *  <meta name="og:title" content="3, 2, 1 ... Lift-Off" property="og:title" />
  */
  $obj.name = [
    $('span#ctl00_ContentBody_CacheName', detailsPage).first().text(),
    $('meta[name="og:title"]', detailsPage).first().attr('content')   // Fallback #1
  ];

  geocache_details.name =
    ($obj.name[0] && $.trim($obj.name[0])) ||
    ($obj.name[1] && $.trim($obj.name[1])) ||
    null;

  if (!geocache_details.name) {
    throw "Error getting 'cacheName' from " + geocache_details.gccode;
  } else {
    debug(
      "getMinimalGeocacheDetails - Name: " + geocache_details.name + "\n" +
      "\t1: " + ( ($obj.name[0]) ? $obj.name[0] : "null" ) + "\n" +
      "\t2: " + ( ($obj.name[1]) ? $obj.name[1] : "null" )
    );
  }


  /* Hole guid
   *  <form name="aspnetForm" method="post" action="cache_details.aspx?guid=712fed16-77ab-48f4-a269-18cc27bb2a14" onsubmit="javascript:return WebForm_OnSubmit();" id="aspnetForm">
   *  <a id="ctl00_ContentBody_lnkPrintFriendly5Logs" href="cdpf.aspx?guid=712fed16-77ab-48f4-a269-18cc27bb2a14&amp;lc=5" target="_blank">5 Logs</a>&nbsp;
   *  <a id="ctl00_ContentBody_uxTravelBugList_uxTrackableItemsHistory" href="../track/search.aspx?wid=712fed16-77ab-48f4-a269-18cc27bb2a14">View past Trackables</a>
   *  <a id="ctl00_ContentBody_uxLogbookLink" href="cache_logbook.aspx?guid=712fed16-77ab-48f4-a269-18cc27bb2a14">View Logbook</a>
   *  lat=51.167083; lng=10.533383; guid='712fed16-77ab-48f4-a269-18cc27bb2a14';
  */
  $obj.guid = [
    $("form[name='aspnetForm'][action*='guid=']", detailsPage).first().attr("action"),
    $("a#ctl00_ContentBody_lnkPrintFriendly5Logs[href*='guid=']", detailsPage).first().attr("href"),
    $("a#ctl00_ContentBody_uxTravelBugList_uxTrackableItemsHistory[href*='wid=']", detailsPage).first().attr("href"),
    $("a#ctl00_ContentBody_uxLogbookLink[href*='guid=']", detailsPage).first().attr("href")
  ];

  //alert($("form[name='aspnetForm']", detailsPage).first().attr("action"));

  geocache_details.guid =
    ($obj.guid[0] && $.trim($obj.guid[0].split("guid=")[1].split("&")[0])) ||
    ($obj.guid[1] && $.trim($obj.guid[1].split("guid=")[1].split("&")[0])) ||
    ($obj.guid[2] && $.trim($obj.guid[2].split("wid=")[1].split("&")[0])) ||
    ($obj.guid[3] && $.trim($obj.guid[3].split("guid=")[1].split("&")[0])) ||
    null;

  if (!geocache_details.guid) {
    throw "Error getting 'guid' from " + geocache_details.gccode;
  } else {
    debug(
      "getMinimalGeocacheDetails - Guid: " + geocache_details.guid + "\n" +
      "\t1: " + ( ($obj.guid[0]) ? $obj.guid[0].split("guid=")[1].split("&")[0] : "null" ) + "\n" +
      "\t2: " + ( ($obj.guid[1]) ? $obj.guid[1].split("guid=")[1].split("&")[0] : "null" ) + "\n" +
      "\t3: " + ( ($obj.guid[2]) ? $obj.guid[2].split("wid=")[1].split("&")[0] : "null" ) + "\n" +
      "\t4: " + ( ($obj.guid[3]) ? $obj.guid[3].split("guid=")[1].split("&")[0] : "null" )
    );
  }

  /* Hole type
   *  <a href="/about/cache_types.aspx" target="_blank" title="About Cache Types"><img src="/images/WptTypes/2.gif" alt="Traditional Cache" title="Traditional Cache" /></a>
  */
  $obj.type = [
    $('a[title="About Cache Types"] > img', detailsPage).first().attr("src")
  ];

  geocache_details.type =
    ($obj.type[0] && $.trim($obj.type[0].split("/")[3])) ||
    null;

  if (!geocache_details.type) {
    throw "Error getting 'type' from " + geocache_details.gccode;
  } else {
    debug(
      "getMinimalGeocacheDetails - Type: " + geocache_details.type + "\n" +
      "\t1: " + ( ($obj.type[0]) ? $obj.type[0].split("/")[3] : "null" )
    );
  }

  return geocache_details;

}

function getLogs(userToken, maxLogsCount){
  maxLogsCount = maxLogsCount || 25; // optionaler Parameter default = 25
  var i = 1,
      numLogsPages = (maxLogsCount < 100) ? 25 : 100,
      logs = [],
      urlTemplate = 'http://www.geocaching.com/seek/geocache.logbook?tkn='+userToken+'&idx=#PAGE#&num=#NUM#&decrypt=false',
      url, n,
      log_obj = {},
      req = new XMLHttpRequest(),
      booA, booB;

  do {
    url = urlTemplate.replace("#PAGE#", i).replace("#NUM#", numLogsPages);

    req.open("GET", url, false);
    // execute the request synchron
    req.send(null);
    // after execution parse the result
    log_obj = JSON.parse(req.responseText);

    // füge alle ankommenden logs an das bestehende Array einfach hinten dran!
    logs = logs.concat(log_obj.data);

    // ein Log Obj sieht wir folgt aus:
    //~ LogID  189964204
    //~ CacheID  2071649
    //~ LogGuid  "f04c620c-7ec0-4e3d-840d-e887e8257a76"
    //~ Latitude  null
    //~ Longitude  null
    //~ LatLonString  ""
    //~ LogType  "Found it"
    //~ LogTypeImage  "icon_smile.gif"
    //~ LogText  "Heute Vormittag konnten... ahhr, die Zwergpiraten"
    //~ Created  "10/02/2011"
    //~ Visited  "10/02/2011"
    //~ UserName  "Zwergpiraten"
    //~ MembershipLevel  1
    //~ AccountID  2455575
    //~ AccountGuid  "d0421737-e9ee-4a10-9c7e-be4ed9399d6d"
    //~ Email  ""
    //~ AvatarImage  "c77832e3-6051-4c3b-a37d-113ca51acd14.jpg"
    //~ GeocacheFindCount  572
    //~ GeocacheHideCount  0
    //~ ChallengesCompleted  1
    //~ IsEncoded  false
    //~ creator  Object { GroupTitle="Member", GroupImageUrl="/images/icons/reg_user.gif"}
    //~ GroupTitle  "Member"
    //~ GroupImageUrl  "/images/icons/reg_user.gif"
    //~ Images  []
    //~ debug(logs[0].UserName);

    i++;
    booA = (i <= log_obj.pageInfo.totalPages); // gibt es noch eine Seite danach ?
    booB = (logs.length < maxLogsCount);       // maximale gewünschte Anzahl Logs noch nicht erreicht ?

  } while (booA && booB); // nächster Request ?

  // LogArray ggf. kürzen
  if (logs.length > maxLogsCount) {
      n = maxLogsCount - logs.length;
      logs = logs.slice(0, n);
  }

  return logs;
}


