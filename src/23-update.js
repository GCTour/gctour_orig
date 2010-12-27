function update() {
	var updateDate = eval(GM_getValue('updateDate'));
	if (!updateDate) {
		updateDate = new Date();
		GM_setValue('updateDate', uneval(updateDate));
	}
	
	var currentDate = new Date();
    // if the last updateDate is more than 86 400 000 msec (1 day) ago - check for updates
	//if (currentDate.getTime() - updateDate.getTime() > 86400000) {
	if (true) { // ATTENTION!!
		// set the new updateDate
		GM_setValue('updateDate', uneval(currentDate));
	    var update_request = {'script':scriptId,'version':version,'build':build};

	    post(API_HOST+'/update', 'update='+JSON.stringify(update_request),
		    function(text){
			    //alert(text);
			    var update_obj = JSON.parse(text);
				log("update check: returns "+text);
				if(update_obj.changes[0] == "none" || update_obj.changes[0] == "error"){
					log("update check: version "+version+" build:"+build);
					log("update check: result from GAE:"+update_obj.changes[0]);
					return;
				}
			
			
			    var overlayBody = getOverlay("new version available");
		

			    var versions_string = ""
			    for(var ver_i =0 ; ver_i<update_obj.changes.length; ver_i++){
				    var version_obj = update_obj.changes[ver_i];
				    versions_string += "<div style='margin-top: 0.75em;'><strong>v"+version_obj.version+"."+version_obj.build+"</strong></div>";
				    versions_string += "<ul>";
				    for(var chg_i =0 ; chg_i<version_obj.changes.length; chg_i++){
					    versions_string += "<li>";
					    versions_string += version_obj.changes[chg_i];
					    versions_string += "</li>";
				    }
				    versions_string += "</ul>";
			    }

			    var updateMapping = new Array(
				    new Array('VERSION_OLD',version+"."+build),
				    new Array('VERSION_NEW',update_obj.version+"."+update_obj.build),
				    new Array('VERSION_HISTORY',versions_string)
			    );	

			    //{"update":"http:\/\/userscripts.org\/scripts\/source\/36273.user.js","build":12345,"script":"gctour","changes":[{"build":12345,"changes":["1.98 test1","1.98 test4","1.98 test6"],"version":1.98},{"build":12343,"changes":["1.97 test1","1.97test2","1.97 test3"],"version":1.97}],"version":1.98}
			
			    var confirmString = lang['updateDialog'];			

			
			    var update_dom = fillTemplate(updateMapping,confirmString);
			    var footer = update_dom.getElementsByTagName('div')[2];
			
			    // if install is pressed set the document.location to the url given by the update object
			    var install_button = document.createElement('input');
			    install_button.type = "button";
			    install_button.value = lang['install'] ;
			    install_button.style.backgroundImage = "url("+userscript_image+")";
			    install_button.addEventListener('click', function() {
				    setTimeout(closeOverlay, 500);
				    document.location = update_obj.update;
			    }, true);
			
			
			    var close_button = document.createElement('input');
			    close_button.type = "button";
			    close_button.value = lang['cancel'] ;
			    close_button.style.backgroundImage = "url("+closebuttonImage+")";
			    close_button.addEventListener('click', closeOverlay, false);
			
			    footer.appendChild(close_button);
			    footer.appendChild(install_button);
				
			
			
			
			
						
			    overlayBody.appendChild(update_dom);			
		
		    }
	    );
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
