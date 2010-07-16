function update() {
	var updateDate = eval(GM_getValue('updateDate'));
	if (!updateDate) {
		updateDate = new Date();
		GM_setValue('updateDate', uneval(updateDate));
	}
	var currentDate = new Date();

	// if the last updateDate is more than 86 400 000 msec (1 day) ago - check for updates
	if (currentDate.getTime() - updateDate.getTime() > 86400000) {
		// set the new updateDate
		GM_setValue('updateDate', uneval(currentDate));
		// make the version request
		var details = {};
		details.method = 'GET';
		details.url = 'http://gc.madd.in/gm/updates.xml';
		details.onload = function (response) { parseUpdateXMLResponse(response.responseText); };
		details.onerror = function (response) { alert('An update error occour - please send an EMail to geocaching@madd.in!');};
		GM_xmlhttpRequest(details);
	}
}

function parseUpdateXMLResponse(xmlString) {
	var updateNode;
	var xmlDoc = (new DOMParser()).parseFromString(xmlString, "application/xml");
	var string = '';

	var scriptElements = xmlDoc.getElementsByTagName('script');

	for(var i = 0;i< scriptElements.length;i++) {
		if (scriptElements[i].getAttribute('id') == scriptId) {
			var versions = scriptElements[i].getElementsByTagName('version');
			var currentVersion = 0; 
			var currentVersionIndex; 
			for(var j = 0;j< versions.length;j++) {
				if (versions[j].getAttribute('number') > currentVersion) {
					currentVersion = versions[j].getAttribute('number');
					currentVersionIndex = j;
				}
			}

			if (currentVersion > version) {
				updateNode = versions[currentVersionIndex];
			}			
		}		
	}




	if (updateNode) {
		var confirmString = 'There is a new version of GcTour.\n\t'+ version +' -> '+ updateNode.getAttribute('number') +'\nChanges:\n';

		var changes = updateNode.getElementsByTagName('change');
		for(var j = 0;j< changes.length;j++) {
			confirmString += '\t+ '+ changes[j].textContent +'\n';
		}
		confirmString += '\nDo you want to update?';
		if (confirm(confirmString)) {
			GM_openInTab('http://gc.madd.in/gm/update.php?scriptId='+scriptId+'&fromVersion='+version+'&toVersion='+updateNode.getAttribute('number'));
		}
	}
}
