function addCacheToTourFromMap(cacheUrl){
	return function(e)
	{
		e.stopPropagation();
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

		// locate the values and save it
		var cacheId = trim(dojo.query('span[id="ctl00_ContentBody_uxWaypointName"]',cacheDetails)[0].textContent);
		var guidId = dojo.query("a[id='ctl00_ContentBody_lnkPrintFriendly']",cacheDetails)[0].href.split("guid=")[1];
	
		var cacheName = trim(dojo.query('span[id="ctl00_ContentBody_CacheName"]',cacheDetails)[0].textContent);
		var cacheTypeImage = dojo.query('a[href="/about/cache_types.aspx"] > img',cacheDetails)[0].src.split("/")[5];

		addElementFunction(cacheId,guidId,cacheName,cacheTypeImage)();

	}
}

function getEntryFromBookmarkTd(bookmarkLine){
    var entry = {};
    entry.id = trim(bookmarkLine[2].textContent);
	
	var nameSpan = dojo.query("span",bookmarkLine[3])[0];
	var name = (nameSpan)?nameSpan.parentNode.innerHTML.replace(/<img.*?>/,""):trim(bookmarkLine[3].textContent);
	
    entry.name = name;
    entry.guid = bookmarkLine[2].getElementsByTagName('a')[0].href.split('guid=')[1];
    entry.image = bookmarkLine[3].getElementsByTagName('img')[0].getAttribute('src').split("/")[6];
    entry.checked = bookmarkLine[0].childNodes[0].checked;
            
    return entry;
}

function getEntryFromSearchTd(theTd){
		var entryTds = theTd.getElementsByTagName('td');
		var entry = new Object();
		
		entry.id = 'GC'+entryTds[4].textContent.split('(GC')[1].split(')')[0];		
		entry.name = entryTds[4].getElementsByTagName('a')[1].innerHTML;
		entry.guid = entryTds[4].getElementsByTagName('a')[0].href.split('guid=')[1];
		entry.image = entryTds[4].getElementsByTagName('img')[0].getAttribute('src').split("/")[6];

		if(entryTds[0].childNodes[1]){
			entry.checked = entryTds[0].childNodes[1].checked;
		}
		return entry;
}
