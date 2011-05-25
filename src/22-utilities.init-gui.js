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
function getEntryFromSearchTr(cache_row){
	var information_cell = dojo.query("td:nth-child(5)",cache_row)[0];
	var spans = dojo.query('span',information_cell);
	
	var entry = {};
	alert(spans[1].textContent);
	//~ alert(spans[1].textContent.search(/|\s*GC(\S{3,9}\s*|)/g));	

	spans[1].textContent.search(/\|\s*GC(\S{3,9})\s*\|/)
	entry.id = "GC"+RegExp.$1;		
	//~ entry.id = trim(spans[1].textContent.split('|')[1]);
	entry.name = trim(spans[0].textContent);
	entry.guid = information_cell.getElementsByTagName('a')[0].href.split('guid=')[1];
	entry.image = information_cell.getElementsByTagName('img')[0].getAttribute('src').split("/")[5];//.replace(/WptTypes\//, "WptTypes/sm/");
	entry.position = cache_row.getElementsByTagName('td')[9];
	
	
	var check = dojo.query("td",cache_row)[0].childNodes[1]
	if(check){
			entry.checked = check.checked;
	}
			
	return entry;
}


function getEntriesFromSearchpage(){
	var q = dojo.query('table[class = "SearchResultsTable Table"] > tbody > tr');
	var entries = [];
	
	for(var j = 1 ; j < q.length; j++){
		var cache_row = q[j];		

		var entry = getEntryFromSearchTr(cache_row);					
		debug("cache row - id:'"+entry.id+"' Name:'"+entry.name+"' Guid:'"+entry.guid+"' image:'"+entry.image+"' checke:'"+entry.checked+"'");		
		entries.push(entry);
	}
	
	return entries;
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
