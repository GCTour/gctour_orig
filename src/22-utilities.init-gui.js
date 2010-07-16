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
		var cacheIdCode = dojo.query('span[id="ctl00_uxWaypointName"]',cacheDetails)[0];
		var cacheId = trim(cacheIdCode.textContent);
		var guidId = dojo.query("a[id='ctl00_ContentBody_lnkPrintFriendly5Logs']",cacheDetails)[0].href.split("guid=")[1].split("&")[0];
	
		var cacheName = trim(dojo.query('span[id ="ctl00_ContentBody_CacheName"]',cacheDetails)[0].textContent);
		var cacheTypeImage = dojo.query('a[title="About Cache Types"]',cacheDetails)[0].getElementsByTagName('img')[0].src.split("/")[5];
		


		addElementFunction(cacheId,guidId,cacheName,cacheTypeImage)();

	}
}

function getEntryFromSearchTd(theTd){
		var entryTds = theTd.getElementsByTagName('td');
		var entry = new Object();
		entry.id = 'GC'+entryTds[5].textContent.split('(GC')[1].split(')')[0];		
		entry.name = entryTds[5].getElementsByTagName('a')[0].textContent;
		entry.guid = entryTds[5].getElementsByTagName('a')[0].href.split('guid=')[1];
		entry.image = entryTds[2].getElementsByTagName('img')[0].getAttribute('src').split("/")[3];
		if(entryTds[7].childNodes[1]){
			entry.checked = entryTds[7].childNodes[1].checked;
		}
		return entry;
}