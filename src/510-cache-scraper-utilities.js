// return an object with this attributes: gcid, cacheid, guid, typeimage, name 
function getMinimalGeocacheDetails(detailsPage){
  /* gcid, cacheid, guid, typeimage, name */
  
  var geocache_details = {};
  
  
  /* GCCode Stand 07.10.2011
   * <span id="ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode" class="CoordInfoCode">GC2HFRB</span> <--- holen über 'class'!
   * Fallback#1: <input type="submit" name="ctl00$ContentBody$btnSendToPhone" value="Send to My Phone" onclick="s2phone(&#39;GC2HFRB&#39;);return false;" id="ctl00_ContentBody_btnSendToPhone" />
   * Fallback#2: steht im HEAD: <meta property="og:url" content="http://coord.info/GC2HFRB" name="og:url">*/
  try{
    geocache_details.gccode = dojo.query('.CoordInfoCode',detailsPage)[0].textContent;
  }catch(e){// Fallback #1
    try{
      geocache_details.gccode = dojo.query('input[id="ctl00_ContentBody_btnSendToPhone"]',detailsPage)[0].getAttribute('onclick').split("'")[1];
    } catch(e){ // Fallback #2
      try{
        geocache_details.gccode = dojo.query('meta[name="og:url"]',detailsPage)[0].getAttribute('content').split('/')[3];
      } catch(e){
        throw "Fatal: Error getting GCCode!";
      }
    }
  } 
  
  debug("getMinimalGeocacheDetails - GCCode:"+geocache_details.gccode);    
  
  
  

  /* suche die CacheId aus einer diesen Quellen:
   *  HTML          REGEXP          Quelle
    ccid=1957539"      ccid=(\d+)        "View all Trackables" Link
    "CacheID":1957539     \"CacheID\":(\d+)    teil der vorgeladenen Logs
    w=1957539"        \Ww=(\d+)        "Watch Listing" link
  */  
  try{
    var cacheid_regex = /ccid=\d+|\"CacheID\":\d+|\Wws=\d+/;
    var cacheid_arr = cacheid_regex.exec(detailsPage.innerHTML);  
    geocache_details.cacheid = cacheid_arr[0].split(/:|=/)[1];
    debug("getMinimalGeocacheDetails - CacheID:"+geocache_details.cacheid);
  } catch(e){
    throw "Error getting 'cacheid' from "+geocache_details.gccode;
  }
  
  
  /* hole den Cachenamen:
   *  <span id="ctl00_ContentBody_CacheName">3, 2, 1 ... Lift-Off</span></h2>
   *   <meta name="og:title" content="3, 2, 1 ... Lift-Off" property="og:title" />
   */
  try{
    geocache_details.name = trim(dojo.query('span[id="ctl00_ContentBody_CacheName"]',detailsPage)[0].textContent);
  } catch(e){  
    try{
      geocache_details.name = dojo.query('meta[name="og:title"]',detailsPage)[0].getAttribute('content');
    } catch(e){
      throw "Error getting 'name' from "+geocache_details.gccode;
    }
  }
  debug("getMinimalGeocacheDetails - Name:"+geocache_details.name);
  
  
  /* Hole guid
   *  <a id="ctl00_ContentBody_lnkPrintFriendly5Logs" href="cdpf.aspx?guid=712fed16-77ab-48f4-a269-18cc27bb2a14&amp;lc=5" target="_blank">5 Logs</a>&nbsp;
   *  lat=51.167083; lng=10.533383; guid='712fed16-77ab-48f4-a269-18cc27bb2a14'; 
   */
   
   try{
     geocache_details.guid = dojo.query("a[id='ctl00_ContentBody_lnkPrintFriendly5Logs']")[0].href.split("guid=")[1].split("&")[0];
   } catch(e){
    try{      
      var guid_regex = /guid='(.*)'/;
      var guid_arr = guid_regex.exec(detailsPage.innerHTML);  
      geocache_details.guid = guid_arr[1];
    } catch(e){
      throw "Error getting 'guid' from "+geocache_details.gccode;
    }
   }
   debug("getMinimalGeocacheDetails - Guid:"+geocache_details.guid);
  
   
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
  
   
   
  return geocache_details;
  
}

function getAllLogs(userToken){
  
  var totalPages = 1;
  var logs = [];
  
  for(var i = 1;i<= totalPages;i++){
    var req = new XMLHttpRequest();            
    var myUrl = 'http://www.geocaching.com/seek/geocache.logbook?tkn='+userToken+'&idx=1&num=100&decrypt=false';
    req.open("GET", myUrl, false);
    // execute the request synchron
    req.send(null);
    // after execution parse the result
    var log_obj =  JSON.parse(req.responseText);

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
    
    totalPages = log_obj.pageInfo.totalPages;
  }
  
  return logs;
}
