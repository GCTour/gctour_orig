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
    $('.CoordInfoCode', detailsPage).first(),
    $('input#ctl00_ContentBody_btnSendToPhone', detailsPage).first(), // Fallback #1
    $('meta[name="og:url"]', detailsPage).first()                     // Fallback #2
  ];

  geocache_details.gccode =
    ($obj.gcc[0].length && $.trim($obj.gcc[0].text())) ||
    ($obj.gcc[1].length && $.trim($obj.gcc[1].attr('onclick').split("'")[1])) ||
    ($obj.gcc[2].length && $.trim($obj.gcc[2].attr('content').split('/')[3])) ||
    null;

  if (!geocache_details.gccode)  {
    throw "Fatal: Error getting GCCode! (getMinimalGeocacheDetails)";
  } else {
    debug(
      "getMinimalGeocacheDetails - GCCode: " + geocache_details.gccode + "\n" +
      "\t1: " + ( ($obj.gcc[0].length) ? $obj.gcc[0].text() : "null" ) + "\n" +
      "\t2: " + ( ($obj.gcc[1].length) ? $obj.gcc[1].attr('onclick').split("'")[1] : "null" ) + "\n" +
      "\t3: " + ( ($obj.gcc[2].length) ? $obj.gcc[2].attr('content').split('/')[3] : "null" )
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
    $('span#ctl00_ContentBody_CacheName', detailsPage).first(),
    $('meta[name="og:title"]', detailsPage).first() // Fallback #1
  ];

  geocache_details.name =
    ($obj.name[0].length && $.trim($obj.name[0].text())) ||
    ($obj.name[1].length && $.trim($obj.name[1].attr('content'))) ||
    null;

  if (!geocache_details.name) {
    throw "Error getting 'cacheName' from " + geocache_details.gccode;
  } else {
    debug(
      "getMinimalGeocacheDetails - Name: " + geocache_details.name + "\n" +
      "\t1: " + ( ($obj.name[0].length) ? $obj.name[0].text() : "null" ) + "\n" +
      "\t2: " + ( ($obj.name[1].length) ? $obj.name[1].attr('content') : "null" )
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
    $("form[name='aspnetForm']", detailsPage).first(),
    $("a#ctl00_ContentBody_lnkPrintFriendly5Logs", detailsPage).first(),
    $("a#ctl00_ContentBody_uxTravelBugList_uxTrackableItemsHistory", detailsPage).first(),
    $("a#ctl00_ContentBody_uxLogbookLink", detailsPage).first()
  ];

  geocache_details.guid =
    ($obj.guid[0].length && $.trim($obj.guid[0].attr("action").split("guid=")[1].split("&")[0])) ||
    ($obj.guid[1].length && $.trim($obj.guid[1].attr("href").split("guid=")[1].split("&")[0])) ||
    ($obj.guid[2].length && $.trim($obj.guid[2].attr("href").split("wid=")[1].split("&")[0])) ||
    ($obj.guid[3].length && $.trim($obj.guid[3].attr("href").split("guid=")[1].split("&")[0])) ||
    null;

  if (!geocache_details.guid) {
    throw "Error getting 'guid' from " + geocache_details.gccode;
  } else {
    debug(
      "getMinimalGeocacheDetails - Guid: " + geocache_details.guid + "\n" +
      "\t1: " + ( ($obj.guid[0].length) ? $obj.guid[0].attr("action").split("guid=")[1].split("&")[0] : "null" ) + "\n" +
      "\t2: " + ( ($obj.guid[1].length) ? $obj.guid[1].attr("href").split("guid=")[1].split("&")[0] : "null" ) + "\n" +
      "\t3: " + ( ($obj.guid[2].length) ? $obj.guid[2].attr("href").split("wid=")[1].split("&")[0] : "null" ) + "\n" +
      "\t4: " + ( ($obj.guid[3].length) ? $obj.guid[3].attr("href").split("guid=")[1].split("&")[0] : "null" )
    );
  }

  /* Hole type
   *
  */
   try{
     geocache_details.type = dojo.query('meta[name="og:imageXX"]',detailsPage)[0].getAttribute("content").split("/")[6].split('.')[0]+".gif";
   } catch(e){
    try{
       geocache_details.type = dojo.query('a[title="About Cache Types"] > img',detailsPage)[0].src.split("/")[5];
    } catch(e){
      throw "Error getting 'type' from "+geocache_details.gccode;
    }
   }
   debug("getMinimalGeocacheDetails - Type:"+geocache_details.type);


  /* Todo vorhergehendes zu nachfolgendes ändern und debuggen

  $obj.type = [
    $('meta[name="og:imageXX"]', detailsPage).first(),
    $('a[title="About Cache Types"] > img', detailsPage).first()
  ];

  geocache_details.type =
    ($obj.type[0].length && $.trim($obj.type[0].attr("content").split("/")[6].split('.')[0] + ".gif"))||
    ($obj.type[1].length && $.trim($obj.type[1].attr("src").split("/")[5])) ||
    null;

  if (!geocache_details.type) {
    throw "Error getting 'type' from " + geocache_details.gccode;
  } else {
    debug(
      "getMinimalGeocacheDetails - Type: " + geocache_details.type + "\n" +
      "\t1: " + ( ($obj.type[0].length) ? $obj.type[0].attr("content").split("/")[6].split('.')[0] + ".gif" : "null" ) + "\n" +
      "\t2: " + ( ($obj.type[1].length) ? $obj.type[1].attr("src").split("/")[5] : "null" )
    );
  }
  */

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

