function initButton(){
	
	 // if we are on a cache page the buttonGroup != null - so add the 'to tour'-button

	var buttonGroup = document.getElementById('ctl00_ContentBody_LatLon').parentNode;
	if (buttonGroup != null){
		var add_button = createElement('span',{style:"float:right;"});
		buttonGroup.insertBefore(add_button, buttonGroup.firstChild);		
		var newButton = document.createElement("button");
		newButton.name = 'btnGPXDL';
		newButton.type = 'submit';
		newButton.innerHTML = "<img src='"+addToTourImageString+"'/>&nbsp;"+lang['addToTour'];
		newButton.id = 'btnGPXDL';	
		newButton.setAttribute('onclick','return false;');	
		
		// locate the values and save it
		var cacheIdCode = document.getElementById('ctl00_uxWaypointName');
		var cacheId = trim(cacheIdCode.textContent);
		
		// get the guid
		var guidId = dojo.query("a[id='ctl00_ContentBody_lnkPrintFriendly5Logs']")[0].href.split("guid=")[1].split("&")[0];
		
		var cacheName = trim(document.getElementById('ctl00_ContentBody_CacheName').textContent);

		var cacheTypeImage = getElementsByAttribute('title',"About Cache Types")[0].getElementsByTagName('img')[0].src.split("/")[5];
		
		// on click add an element	
		newButton.addEventListener('click', addElementFunction(cacheId,guidId,cacheName,cacheTypeImage), false);
		
		// add it to the group
		append(newButton,add_button)

	}	
}

function populateAllTours(list){
	if(list){
		var tourList = list;
	} else {
		var tourList = dojo.byId('openTourList');
	}


	tourList.innerHTML = "";
	for (var tourIt = 0; tourIt<tours.length; tourIt++){
		var listElement = document.createElement('tr');


		var tourLink;
		if(tours[tourIt].id == currentTour.id){	
			tourLink = document.createElement('span');
			tourLink.innerHTML = tours[tourIt].name;
		} else {			
			tourLink = document.createElement('a');

			tourLink.innerHTML = tours[tourIt].name;
			tourLink.style.cursor = 'pointer';
			tourLink.addEventListener('click', loadTour(tours[tourIt].id),false);
		}	

		tourLink.innerHTML += "<span style='font-size:66%'>(&nbsp;"+tours[tourIt].geocaches.length+"&nbsp;)</span>";
		tourLink.style.fontSize ='10px';


		var infomationImage = document.createElement('img');
		infomationImage.src = informationImageString;

		infomationImage.addEventListener('mouseover',  showInformationDiv(tours[tourIt]), false);


		infomationImage.addEventListener('mouseout', 
				function(event) {
				var informationDiv = document.getElementById('infomationDiv');
				document.body.removeChild(informationDiv);
				}, false );

		var deleteButton = document.createElement('img');
		deleteButton.title = lang['removeTour'];
		deleteButton.src = deleteImageString;
		deleteButton.style.cursor = 'pointer';
		deleteButton.style.marginRight = '5px';
		deleteButton.addEventListener('click',deleteTourFunction(tours[tourIt].id,listElement), false);
		addHoverEffects(deleteButton);




		var tdElement = document.createElement('td');listElement.appendChild(tdElement);
		tdElement.appendChild(tourLink);
		tdElement.style.borderBottom = "1px solid lightgray";

		tdElement = document.createElement('td');listElement.appendChild(tdElement);
		tdElement.style.borderBottom = "1px solid lightgray";
		tdElement.appendChild(infomationImage);
		tdElement = document.createElement('td');listElement.appendChild(tdElement);
		tdElement.style.borderBottom = "1px solid lightgray";
		if(tours[tourIt].id != currentTour.id){
			tdElement.appendChild(deleteButton);
		} else {
			tdElement.appendChild(document.createTextNode(" "));
		}


		var uploadButton = document.createElement('img');
		uploadButton.title = lang['upload'];
		uploadButton.src = uploadImageString;
		uploadButton.style.cursor = 'pointer';
		uploadButton.style.marginRight = '5px';
		uploadButton.addEventListener('click',uploadTourFunction(tours[tourIt].id), false);
		addHoverEffects(uploadButton);

		tdElement = document.createElement('td');listElement.appendChild(tdElement);
		tdElement.style.borderBottom = "1px solid lightgray";
		tdElement.appendChild(uploadButton);




		tourList.appendChild(listElement);
	}
}







// the tour list under main navigation
function initComponents(){
	//~ var thisDiv = getElementsByAttribute('class','widget-navigation')[0];
	var thisDiv = getElementsByAttribute('id','Navigation')[0];


	var cacheList = document.createElement('ol');
    cacheList.className = 'cachelist container handles';
	cacheList.setAttribute("dojoType","dojo.dnd.Source");	
	cacheList.setAttribute("jsId","draglist");	

	cacheList.id = 'cacheList';
	cacheList.style.width = '100%';
	cacheList.setAttribute("border","0");


	var table = document.createElement('table');
	table.id = 'tourTable';
	table.style.width = '100%';
	table.setAttribute("border","0");


	var div = document.createElement('div');
	div.style.backgroundColor = '#ffffff';
	div.style.overflow = 'auto';	
	div.style.height = '100%';
	div.style.width = '100%'; 
	div.appendChild(table);
	div.appendChild(cacheList);
	
    // make it drag n drop - only available after dojo.addOnLoad fired - see init.js
    dojo.parser.parse(div);
    
    // persist the new order after some cache is draged
    dojo.subscribe("/dnd/drop", function(source, nodes, copy, target){
            var cachelist = dojo.query('ol[id="cacheList"]')[0];
            
            // iterate over current cachelist in DOM
            var idList = [];        
            for(var i = 0; i < cachelist.childNodes.length;i++){
                idList.push(cachelist.childNodes[i].id); // save every id - in right order
                GM_log("ids: "+cachelist.childNodes[i].id);
            }
            
            var tempCaches = [];
            for(var i = 0; i < idList.length;i++){ // for each id
                var position = getPositionsOfId(idList[i]); // find the position in the currentTour obj
                tempCaches.push(currentTour.geocaches[position]); // after this add the cache in the temporary array
                
                GM_log("position: "+position);
                GM_log("gcid: "+currentTour.geocaches[position].id);
                
                
            }        
            
            // ... and make it persistent
            currentTour.geocaches = tempCaches;	
            
            setTimeout(function() { // hack to prevent "access violation" from Greasemonkey
                saveCurrentTour();
            },0);
    
            // highlight the moved cache
	        dojo.fadeOut({
	        node: nodes[0],duration: 300,
		        onEnd: function(){
			        dojo.fadeIn({
					        node: nodes[0],duration: 300
			        }).play()
		        }
	        }).play();
    });





	var newButton = document.createElement('img');
	newButton.alt = lang['newList'];
	newButton.title = lang['newList'];
	newButton.src = newImageString;
	newButton.style.cursor = 'pointer';
	newButton.style.marginRight = '5px';
	newButton.addEventListener('click', newTourFunction(), false);
	addHoverEffects(newButton);  
	
	var downloadButton = document.createElement('img');
	downloadButton.alt = lang['onlineTour'];
	downloadButton.title = lang['onlineTour'];
	downloadButton.src = downloadImageString;
	downloadButton.style.cursor = 'pointer';
	downloadButton.style.marginRight = '5px';
	downloadButton.addEventListener('click', 
			function(){
				var webcode = window.prompt(lang['webcodePrompt']);
				if(webcode && webcode != ""){
					downloadTourFunction(webcode);
				} 
			},false);
	addHoverEffects(downloadButton);  


	var toggleSettingsButton = document.createElement('img');
	toggleSettingsButton.alt = lang['showSettings'];
	toggleSettingsButton.title = lang['showSettings'];
	toggleSettingsButton.src = settingsImageString;
	toggleSettingsButton.style.cursor = 'pointer';
	toggleSettingsButton.style.marginRight = '5px';
	toggleSettingsButton.addEventListener('click', toggleSettingsFunction(), false);
	addHoverEffects(toggleSettingsButton);


	var toggleTourListButton = document.createElement('img');
	toggleTourListButton.alt = lang['openTour'];
	toggleTourListButton.title = lang['openTour'];
	toggleTourListButton.src = openTourImageString;
	toggleTourListButton.style.cursor = 'pointer';
	toggleTourListButton.style.marginRight = '5px';
	toggleTourListButton.addEventListener('click', toggleTourListFunction(), false);
	addHoverEffects(toggleTourListButton);

	var autoTourButton = document.createElement('img');
	autoTourButton.alt = lang["autoTour"];
	autoTourButton.title = lang["autoTour"];
	autoTourButton.src = autoTourImage;
	autoTourButton.style.cursor = 'pointer';
	autoTourButton.style.marginRight = '5px';
	autoTourButton.addEventListener('click', showAutoTourDialog, false);
	addHoverEffects(autoTourButton);




	var openTourDiv = document.createElement('div');
	openTourDiv.id = 'tourlistDiv';
	openTourDiv.style.borderTop = "1px solid white";
	openTourDiv.style.display = 'none';
	openTourDiv.style.width = '100%'; 


	var tourList = document.createElement('table');
	tourList.id = 'openTourList';

	var tourListHeader = document.createElement('thead');tourList.appendChild(tourListHeader);
	tourListHeader.innerHTML = lang['loadTour'];
	tourListHeader.style.fontSize ='10px';


	

	populateAllTours(tourList);	

	openTourDiv.appendChild(tourList);



	var settingsDiv = document.createElement('div');
	settingsDiv.id = 'tourSettingsDiv';
	//~ settingsDiv.style.backgroundColor = '#f4f4f4';
	//~ settingsDiv.style.borderBottom = "1px solid white";
	settingsDiv.style.borderTop = "1px solid white";
	settingsDiv.style.display = 'none';
	//settingsDiv.style.overflow = 'auto';
	settingsDiv.style.width = '100%'; 

	var RADIO_BUTTONS = 0;
	var CHECK_BOX = 1;
	var HEADER = 2;
	var LANGUAGE = 3;
	var FONTSIZE = 4;
	var DEFAULTMAPTYPE = 5;
	var GPXSCHEMA = 6;
	var DEFAULTMAPSIZE = 7;

	var settingsArray = new Array(
			new Array(LANGUAGE,''),
			new Array(HEADER, 'printview'),
			new Array(RADIO_BUTTONS,''),
			new Array(FONTSIZE,'settingsFontSize', 'printFontSize',"x-small"),
			new Array(CHECK_BOX,'settingsDecryptHints', 'decryptPrintHints',true),
			new Array(CHECK_BOX,'settingsEditDescription', 'printEditMode',false),
			//~ new Array(CHECK_BOX,'settingsRemoveImages', 'printRemoveImages',true),
			new Array(CHECK_BOX,'settingsShowSpoiler', 'printSpoilerImages',true),			
			new Array(CHECK_BOX,'settingsAdditionalWaypoints', 'printAdditionalWaypoints',true),
			new Array(CHECK_BOX,'settingsLoggedVisits', 'printLoggedVisits',false),
			//~ new Array(CHECK_BOX,'settingsAttributes', 'printAttributes',true),
			new Array(CHECK_BOX,'settingsPageBreak', 'printPageBreak',false),
			new Array(CHECK_BOX,'settingsPageBreakAfterMap', 'printPageBreakAfterMap',true),
			new Array(CHECK_BOX,'settingsFrontPage', 'printFrontpage',true),
			new Array(CHECK_BOX,'settingsOutlineMap', 'printOutlineMap',true),
			new Array(CHECK_BOX,'settingsOutlineMapSinge', 'printOutlineMapSingle',true),
			new Array(DEFAULTMAPTYPE,'settingsMapType', 'printOutlineMapType',"Karte"),
			new Array(DEFAULTMAPSIZE,'settingsMapSize', 'defaultMapSize',"large"),
			new Array(HEADER, 'settingsGPXSchema'),
			new Array(GPXSCHEMA,''),
			new Array(HEADER, 'settingsSendToGPS'),
			new Array(CHECK_BOX,'settingsShowGPX', 'showGpx',false),
			new Array(HEADER, 'settingsDownladGPX'),		
			new Array(CHECK_BOX,'settingsGPXHtml', 'gpxhtml',true),
			new Array(CHECK_BOX,'settingsGPXStripGC', 'gpxstripgc',false),
			
			new Array(HEADER, 'settingsUploadTour'),		
			new Array(CHECK_BOX,'settingsTourMap', 'uploadMap',true)
				);



	var settingsTable = document.createElement('table');
	settingsTable.style.width = '98%';	
PSIZE:
	for(var i = 0; i<settingsArray.length;i++){
		switch (settingsArray[i][0]) { // which type of setting 
			case CHECK_BOX:     
				var trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				var tdElement = document.createElement('td');
				tdElement.style.fontSize = 'xx-small';
				tdElement.style.borderBottom = '1px solid lightgray';
				tdElement.innerHTML = lang[settingsArray[i][1]];
				trElement.appendChild(tdElement);

				//~ trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				tdElement = document.createElement('td');
				var inputElement = document.createElement('input');
				inputElement.type = 'checkbox';
				inputElement.checked = GM_getValue(settingsArray[i][2],settingsArray[i][3]);
				inputElement.addEventListener('click',toggleBoolValue(settingsArray[i][2],settingsArray[i][3]), false);
				tdElement.appendChild(inputElement);
				trElement.appendChild(tdElement);
				break;
			case HEADER:
				var trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				var thElement = document.createElement('th');
				thElement.colSpan = 2;
				thElement.style.fontSize = 'xx-small';
				thElement.style.textDecoration = 'underline';
				thElement.innerHTML = lang[settingsArray[i][1]];
				trElement.appendChild(thElement);
				break;
			case GPXSCHEMA:
				var trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				var gpxTd = document.createElement('td');
				gpxTd.colSpan='2';

				var languageRadioText = document.createElement('font');
				var languageRadio = document.createElement('input');
				languageRadio.type = 'radio';
				languageRadio.name = 'gpx';
				languageRadioText.innerHTML = lang['settingsGPXSchemaGS']+"<br>";
				languageRadioText.style.fontSize = 'xx-small';
				if (GM_getValue('gpxschema',1) == 0)
					languageRadio.checked = 'checked';
				languageRadio.addEventListener('click', function(){GM_setValue('gpxschema',0);}, false);
				gpxTd.appendChild(languageRadio);
				gpxTd.appendChild(languageRadioText);

				languageRadioText = document.createElement('font');
				languageRadio = document.createElement('input');
				languageRadio.type = 'radio';
				languageRadio.name = 'gpx';
				languageRadioText.innerHTML = lang['settingsGPXSchemaAU']+"<br>";
				languageRadioText.style.fontSize = 'xx-small';
				if (GM_getValue('gpxschema',1) == 1)
					languageRadio.checked = 'checked';
				languageRadio.addEventListener('click', function(){GM_setValue('gpxschema',1);}, false);
				gpxTd.appendChild(languageRadio);
				gpxTd.appendChild(languageRadioText);

				trElement.appendChild(gpxTd);
				break;
			case LANGUAGE:

				var trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				var languageHeaderTh = document.createElement('th');
				languageHeaderTh.colSpan = 2;
				languageHeaderTh.style.fontSize = 'xx-small';
				languageHeaderTh.style.textDecoration = 'underline';
				languageHeaderTh.innerHTML = lang['language'];
				trElement.appendChild(languageHeaderTh);


				var trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				var languageTd = document.createElement('td');
				languageTd.colSpan='2';

				for (var langi = 0; langi < languages.length; langi++){				
					var languageRadioText = document.createElement('font');
					var languageRadio = document.createElement('input');
					languageRadio.type = 'radio';
					languageRadio.name = 'language';
					languageRadioText.innerHTML = languages[langi]['name']+"<br>";
					languageRadioText.style.fontSize = 'xx-small';


					if (GM_getValue('language',1) == langi)
						languageRadio.checked = 'checked';

					languageRadio.addEventListener('click', setLanguage(langi), false);
					languageTd.appendChild(languageRadio);
					languageTd.appendChild(languageRadioText);
				}
				trElement.appendChild(languageTd);

				break;

			case DEFAULTMAPSIZE:
				var trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				var tdElement = document.createElement('td');
				tdElement.colSpan='2'; trElement.appendChild(tdElement);
				tdElement.style.fontSize = 'xx-small';
				tdElement.innerHTML = lang[settingsArray[i][1]];

				trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				tdElement = document.createElement('td');
				tdElement.colSpan='2'; trElement.appendChild(tdElement);
				tdElement.style.fontSize = 'xx-small';

				var select = document.createElement("select");
				select.style.width = "80%";

				var sizeArray = new Array('large','medium','small','very small');

				for(var fonti = 0; fonti<sizeArray.length; fonti++){
					var option = document.createElement("option");select.appendChild(option);
					option.value = sizeArray[fonti];
					option.innerHTML = sizeArray[fonti];

					if (GM_getValue("defaultMapSize","large") == sizeArray[fonti])
						option.selected = 'selected';

					option.addEventListener('click', 
							function(){
							var options = select.childNodes;
							for(var optionI = 0; optionI < options.length; optionI++){
								if(options[optionI].selected){
									GM_setValue("defaultMapSize",options[optionI].value);
								}
							}
							},false);
				}
				tdElement.appendChild(select);
			break;

			case DEFAULTMAPTYPE:
				var trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				var tdElement = document.createElement('td');
				tdElement.colSpan='2'; trElement.appendChild(tdElement);
				tdElement.style.fontSize = 'xx-small';
				tdElement.innerHTML = lang[settingsArray[i][1]];

				trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				tdElement = document.createElement('td');
				tdElement.colSpan='2'; trElement.appendChild(tdElement);
				tdElement.style.fontSize = 'xx-small';

				var select = document.createElement("select");
				select.id = "mapTypeSelect";
				select.style.width = "80%";

				var sizeArray = lang['mapTypes'];

				for(var fonti = 0; fonti<sizeArray.length; fonti++){
					var option = document.createElement("option");select.appendChild(option);
					option.value = sizeArray[fonti].value;
					option.innerHTML = sizeArray[fonti].caption;

					if (GM_getValue("printOutlineMapType","Karte") == sizeArray[fonti].value)
						option.selected = 'selected';



					option.addEventListener('click', 
							function(){
							//var options = select.childNodes;
							var options = dojo.byId('mapTypeSelect').childNodes;
							for(var optionI = 0; optionI < options.length; optionI++){
							if(options[optionI].selected){
							GM_setValue("printOutlineMapType",options[optionI].value);
							}
							}
							},false);
					//~ setPrintFontSize(sizeArray[fonti]), false);	


				}
				tdElement.appendChild(select);

				break;	

			case FONTSIZE:
				var trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				var tdElement = document.createElement('td');
				tdElement.colSpan='2'; trElement.appendChild(tdElement);
				tdElement.style.fontSize = 'xx-small';
				tdElement.innerHTML = lang[settingsArray[i][1]];

				trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				tdElement = document.createElement('td');
				tdElement.colSpan='2'; trElement.appendChild(tdElement);
				tdElement.style.fontSize = 'xx-small';

				var select = document.createElement("select");
				select.style.width = "80%";

				var sizeArray = new Array("xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large");

				for(var fonti = 0; fonti<sizeArray.length; fonti++){
					var option = document.createElement("option");select.appendChild(option);
					option.value = sizeArray[fonti];
					option.innerHTML = sizeArray[fonti];

					if (GM_getValue(settingsArray[i][2],settingsArray[i][3]) == sizeArray[fonti])
						option.selected = 'selected';

					option.addEventListener('click', setPrintFontSize(sizeArray[fonti]), false);	

				}
				tdElement.appendChild(select);

				break;	

			case RADIO_BUTTONS:
				var trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				var exportCaptionTd = document.createElement('td');trElement.appendChild(exportCaptionTd);
				exportCaptionTd.style.fontSize = 'xx-small';
				exportCaptionTd.innerHTML = lang['settingsLogCount'];


				var trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				var exportTd = document.createElement('td');trElement.appendChild(exportTd);
				exportTd.colSpan='2';
				exportTd.style.fontSize = 'xx-small';

				var exportRadioNone = document.createElement('input');
				var exportRadioNoneText = document.createElement('font');
				var exportRadioAll = document.createElement('input');
				var exportRadioAllText = document.createElement('font');
				var exportRadioCount = document.createElement('input');	
				var exportRadioCountText = document.createElement('font');

				var exportText = document.createElement('input');
				exportText.type = 'text';
				exportText.size = 1;
				exportText.style.verticalAlign = 'center';
				exportText.addEventListener('click', function(){exportRadioCount.checked = 'checked';GM_setValue('maxPrintLogs',exportText.value);},false);
				exportText.addEventListener('keyup', 
						function(){
						var check = true;
						var value = exportText.value; //get characters
						for(var i=0;i < value.length; ++i)
						{
						var new_key = value.charAt(i); //cycle through characters
						if(((new_key < "0") || (new_key > "9")) && !(new_key == ""))
						{
						//if(i!= 0 && new_key == "-"){
						check = false;
						break;
						//}
						}
						}
						if(!check) // highlight if something is wrong
						{
						exportText.style.backgroundColor = '#ff7f7f';
						}
						else
						{
							exportText.style.backgroundColor = '#ffffff';
							GM_setValue('maxPrintLogs',exportText.value);
						}
						}
				,false);



				exportRadioNone.type = 'radio';
				exportRadioNone.name = 'logcount';
				exportRadioNoneText.innerHTML = lang['settingsLogCountNone'];
				exportRadioAll.type = 'radio';
				exportRadioAll.name = 'logcount';
				exportRadioAllText.innerHTML = lang['settingsLogCountAll'];
				exportRadioCount.type = 'radio';
				exportRadioCount.name = 'logcount';
				exportRadioCountText.innerHTML = lang['settingsLogCountShow'];	
				exportRadioNone.addEventListener('click', function(){GM_setValue('maxPrintLogs',0);},false);
				exportRadioAll.addEventListener('click', function(){GM_setValue('maxPrintLogs',-1);},false);

				if(GM_getValue('maxPrintLogs',0) == 0){
					exportRadioNone.checked = 'checked';
				}else if ( GM_getValue('maxPrintLogs',0) <= -1){
					exportRadioAll.checked = 'checked';
				}else{
					exportText.value = GM_getValue('maxPrintLogs',0);
					exportRadioCount.checked = 'checked';

				}

				exportTd.appendChild(exportRadioNone);
				exportTd.appendChild(exportRadioNoneText);
				exportTd.appendChild(exportRadioAll);
				exportTd.appendChild(exportRadioAllText);
				exportTd.appendChild(exportRadioCount);
				exportTd.appendChild(exportText);
				exportTd.appendChild(exportRadioCountText);
				break;
		}
	}

	settingsDiv.appendChild(settingsTable);


	var tourHeaderDiv = document.createElement('div');
	tourHeaderDiv.innerHTML = '<u id="tourName">'+currentTour.name +'</u>&nbsp;<span style="font-size:66%" id="cachecount">('+currentTour.geocaches.length+')';
			append(createElement('br'),tourHeaderDiv)

			var renameButton = document.createElement('img');
			renameButton.src = editImageString;
			renameButton.title = lang['rename'];
			renameButton.alt = lang['rename'];
			renameButton.style.cursor = 'pointer';
			renameButton.style.marginRight = '5px';
			renameButton.addEventListener('click', 
				function(){
				var newTourName = prompt(lang['newTourDialog'], currentTour.name);  
				if(!newTourName) return;
				currentTour.name = newTourName;
				saveCurrentTour();
				updateTour();
				//~ window.location.reload();    				
				},false);
			addOpacityEffects(renameButton);


			var markerButton = document.createElement('img');
			markerButton.src = plusImageString;
			markerButton.alt = lang['addOwnWaypoint'];
			markerButton.title = lang['addOwnWaypoint'];	
			markerButton.style.cursor = 'pointer';
			markerButton.style.marginRight = '3px';
			markerButton.addEventListener('click', function(){showNewMarkerDialog();}, false);
			addOpacityEffects(markerButton);

			var sendGPSButton = document.createElement('img');
			sendGPSButton.alt = lang['sendToGps'];
			sendGPSButton.title = lang['sendToGps'];
			sendGPSButton.src = sensGPSImageString;
			sendGPSButton.style.cursor = 'pointer';
			sendGPSButton.style.marginRight = '5px';
			sendGPSButton.addEventListener('click', openSend2GpsFunctionLocal(), false);
			addOpacityEffects(sendGPSButton);

			var uploadTourButton = document.createElement('img');
			uploadTourButton.alt = lang['upload'];
			uploadTourButton.title = lang['upload'];
			uploadTourButton.src = uploadImageString;
			uploadTourButton.style.cursor = 'pointer';
			uploadTourButton.style.marginRight = '5px';
			uploadTourButton.addEventListener('click', function(){uploadTourFunction(currentTour.id)();}, false);
			addOpacityEffects(uploadTourButton);

			var requestPrintButton = document.createElement('img');
			requestPrintButton.alt = lang['printview'];
			requestPrintButton.title = lang['printview'];
			requestPrintButton.src = printerImageString;
			requestPrintButton.style.cursor = 'pointer';
			requestPrintButton.style.marginRight = '5px';
			requestPrintButton.addEventListener('click', printPageFunction(), false);
			addOpacityEffects(requestPrintButton);

			var downloadGPXButton= document.createElement('img');
			downloadGPXButton.alt = lang['downloadGpx'];
			downloadGPXButton.title = lang['downloadGpx'];
			downloadGPXButton.src = downloadGPXImageString;
			downloadGPXButton.style.cursor = 'pointer';
			downloadGPXButton.style.marginRight = '5px';
			downloadGPXButton.addEventListener('click',downloadGPXFunction(), false);
			addOpacityEffects(downloadGPXButton);	



			append(renameButton,tourHeaderDiv);
			append(requestPrintButton,tourHeaderDiv);
			append(sendGPSButton,tourHeaderDiv);
			append(downloadGPXButton,tourHeaderDiv);
			append(uploadTourButton,tourHeaderDiv);
			append(markerButton,tourHeaderDiv);

			// remove the ads under the menu - to be sure the gctour is visible ;-)
			var adDiv = getElementsByAttribute('class','BanManWidget')[0];
			if(adDiv)
				dojo.destroy(adDiv);


			var buttonsDiv = document.createElement('div');
			buttonsDiv.style.marginBottom = "5px";
			buttonsDiv.style.borderBottom = "1px solid white";

			buttonsDiv.appendChild(newButton);
			buttonsDiv.appendChild(toggleTourListButton);
			buttonsDiv.appendChild(downloadButton);
			buttonsDiv.appendChild(autoTourButton);
			buttonsDiv.appendChild(toggleSettingsButton);
			buttonsDiv.appendChild(openTourDiv);
			buttonsDiv.appendChild(settingsDiv);

			//~ thisDiv.parentNode.insertBefore(buttonsDiv, thisDiv.nextSibling); 	



			var header = document.createElement('div');
			header.style.backgroundImage = "url("+gctourLogoImage+")";
			header.style.backgroundPosition = "center left";
			header.style.backgroundRepeat = "no-repeat";
			header.style.cursor = "pointer";
			header.style.height = "30px";
			
			dojo.query(header).onmouseover(function(e){this.style.backgroundColor = "#cdd8e8"}).onmouseout(function(e){this.style.backgroundColor = "transparent"}).onclick(function(e){window.open('http://gctour.madd.in');});
			

			var imageLogo = document.createElement('img');
			imageLogo.src = gctourLogoImage;
			imageLogo.border = "0";
			//~ imageLogo.style.width = " 135px";
			imageLogo.style.marginBottom = " 5px";

			var tourLink = document.createElement('a');
			tourLink.href = "http://gctour.madd.in";
			//~ tourLink.innerHTML = "Gc Tour";
			tourLink.style.fontWeight = 'bold';
			tourLink.style.verticalAlign = "top";
			//~ tourLink.style.borderBottom = '1px solid black';
			//~ tourLink
			tourLink.style.color = '#003399';
			//~ tourLink.appendChild(imageLogo);
			
			//~ addHoverEffects(header);
			//~ header.appendChild(tourLink);

			//~ thisDiv.parentNode.insertBefore(header, thisDiv.nextSibling);


			var list_node = createElement('li');
			append(header, list_node);
			append(buttonsDiv, list_node);			
			append(tourHeaderDiv, list_node);
			append(div, list_node);
	
	
	
			append(list_node, thisDiv);




			// popultate the current list on load
			for (var i = 0; i < currentTour.geocaches.length; i++){
				addNewTableCell(currentTour.geocaches[i],false);
			}

			if(currentTour.geocaches.length == 0){
				var table = document.getElementById('tourTable');		
				table.innerHTML = lang['emptyList'];
			}
}
