function addCacheToTourFromMap(cacheUrl){ // old Map only
  var req = new XMLHttpRequest();

  var myUrl = cacheUrl;
  //var myUrl = 'http://www.geocaching.com/seek/cdpf.aspx?guid='+currentTour.geocaches[i].guid;
  req.open("GET", myUrl, false);
  req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  // execute the request synchron
  req.send(null);
  // after execution parse the result
  var responseDetails = req;

  var cacheDetails = document.createElement('div');
  cacheDetails.innerHTML = responseDetails.responseText;

  var minimal_geocache = getMinimalGeocacheDetails(cacheDetails);
  addElementFunction(minimal_geocache.gccode,minimal_geocache.guid,minimal_geocache.name,minimal_geocache.type)();
}

function getEntryFromBookmarkTd(bmLine){
/*
  http://code.google.com/p/gctour/issues/detail?id=31
  noPremiumMember - Tabellenstruktur
    1. checkbox
    2. Richtung und Entfernung
    3. GC Code
    4. Cache Name
    5. "extra Feld"
  premiumMember - Tabellenstruktur
    1. checkbox...
    2. Richtung und Entfernung
    3. Found
    4. GC Code
    5. Cache Name
    6. "extra Feld"
*/

  var entry = {},
    colID = 2, // default column CacheID = noPremiumMember
    nameSpan = $("span", bmLine.eq(colID)).eq(0);
    
  if ( bmLine.eq(2).text().length == 0 ) {
    colID++; // premiumMember
  } 

  entry.id      = $.trim(bmLine.eq(colID).text());
  entry.name    = (nameSpan.length > 0) ? nameSpan.parent().html().replace(/<img.*?>/,"") : $.trim(bmLine.eq(colID+1).text());
  entry.guid    = bmLine.eq(colID+1).find('a:first').attr("href").split('guid=')[1];
  entry.image   = bmLine.eq(colID+1).find('img:first').attr('src').split("/")[6];
  entry.checked = bmLine.eq(0).find("input:checkbox:first").is(':checked');

  debug("Bookmarklist cache row" +
    "\n id: '"      + entry.id + "'" +
    "\n Name: '"    + entry.name + "'" +
    "\n Guid: '"    + entry.guid + "'" +
    "\n image: '"   + entry.image + "'" +
    "\n checked: '" + entry.checked + "'"
  );

  return entry;
}

// Searchpage http://www.geocaching.com/seek/nearest.aspx
// ToDo: erweitern um autoTour wieder lauffähig zu bekommen
function getEntriesFromSearchpage(){

  // Data Rows without header and without GCVote tr
  // <tr class="SolidRow Data BorderTop"> and
  // <tr class="AlternatingRow Data BorderTop">
  var q = $("table.SearchResultsTable tbody tr.Data");

  var entries = [];

  entries = q.map(function() {
    // ToDo: in 099... bei process autoTour ~ Zeile 172 fast gleich ~~ beide zusammenlegen ?!

    var entryTds = $(this).find('td');
    var entry = {};
    var lnk, checkbox, dt;

    // RegEx gc-id
    entryTds.eq(5).find("span").eq(1).text().search(/\|\s*GC(\S{2,9})\s*\|/);
    entry.id = "GC" + RegExp.$1;

    lnk = entryTds.eq(5).find("a.lnk:first");
    entry.name = $.trim(lnk.text());
    entry.available = (lnk.css('text-decoration') !== "line-through");

//~ alert(entryTds.html());
    entry.guid = entryTds.eq(4).find("a:first").attr("href").split('guid=')[1];
    entry.image = entryTds.eq(4).find("img:first").attr("src").replace(/wpttypes\//, "WptTypes/sm/");

    entry.type = entry.image.split("/")[6].split(".")[0];

    entry.pm_only = (entryTds.eq(6).find("img[src$='premium_only.png']").length > 0);

    dt = $.trim(entryTds.eq(7).find('img[src*="/images/icons/container/"]:first').closest('td').find('span.small').text());
    entry.difficulty = dt.split("/")[0];
    entry.terrain = dt.split("/")[1];

    entry.size = $.trim(entryTds.eq(7).find('img[src*="/images/icons/container/"]:first').attr("src").split("/")[4].split(".")[0]);

    entry.addBtnPosition = entryTds.eq(10);

    entry.checked = entryTds.eq(0).find("input:checkbox:first").is(':checked');

    debug(
      "getEntriesFromSearchpage cache row: " + "\n" +
      "\tid:\t\t" + entry.id + "\n" +
      "\tname:\t\t" + entry.name + "\n" +
      "\tguid:\t\t" + entry.guid + "\n" +
      "\tavailable:\t" + entry.available + "\n" +
      "\timage:\t\t" + entry.image + "\n" +
      "\tsize:\t\t" + entry.size + "\n" +
      "\ttype:\t\t" + entry.type + "\n" +
      "\tdifficulty:\t" + entry.difficulty + "\n" +
      "\tterrain:\t" + entry.terrain + "\n" +
      "\tpm_only:\t" + entry.pm_only + "\n" +
      "\tchecked:\t" + entry.checked + "\n"
    );

    return entry;
  }).get();

  return entries;
}

