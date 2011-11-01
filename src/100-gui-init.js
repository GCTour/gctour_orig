function initButton(){

	 // if we are on a cache page the buttonGroup != null - so add the 'to tour'-button

	var cacheControl = dojo.query("div[class='CacheInformationTable']")[0];
	if (cacheControl != null){


		var div_element = createElement('div',{style:"border-top: 1px solid rgb(192, 206, 227);"});append(div_element,cacheControl);



		var gcTourFieldset = createElement('fieldset',{style:"background-color: #EFF4F9;border-color: #C0CEE3 !important;margin-top:0;padding: 0.5em;"});append(gcTourFieldset,div_element);
		gcTourFieldset.setAttribute('class','dialogFooter');
		gcTourFieldset.innerHTML = "<legend class='note' style='background:url(\""+gctourLogoSmall+"\") no-repeat scroll 0 0 transparent'>GCTour</legend>";

		var newButton = createElement('input',{type:"button",value:$.gctour.lang('addToTour'),style:"float:left;background-image:url("+addToTourImageString+")"});append(newButton,gcTourFieldset);
		newButton.setAttribute('onclick','return false;');

		//~ var newButton = document.createElement("button");
		//~ newButton.name = 'btnGPXDL';
		//~ newButton.type = 'submit';
		//~ newButton.innerHTML = "<img src='"+addToTourImageString+"'/>&nbsp;"+$.gctour.lang('addToTour');
		//~ newButton.id = 'btnGPXDL';


		// locate the values and save it
		var minimal_geocache = getMinimalGeocacheDetails(document.getElementsByTagName('html')[0]);
		var cacheId = minimal_geocache.gccode;
		var guidId = minimal_geocache.guid;
		var cacheName = minimal_geocache.name;
		var cacheTypeImage = minimal_geocache.type;

		// on click add an element
		newButton.addEventListener('click', addElementFunction(cacheId,guidId,cacheName,cacheTypeImage), false);

		// add it to the group
		//~ append(newButton,add_button)
		//~ append(newButton,gcTourFieldset)

		// make direct print button
		newButton = createElement('input',{type:"button",value:$.gctour.lang('directPrint'),style:"float:left;background-image:url("+printerImageString+")"});append(newButton,gcTourFieldset);
		newButton.setAttribute('onclick','return false;');

		// on click add an element
		newButton.addEventListener('click', function(){
				var entry = new Object();
				entry.id = cacheId;
				entry.name = cacheName;
				entry.guid = guidId;
				entry.image = 'http://www.geocaching.com/images/WptTypes/sm/'+cacheTypeImage;


				temp_tour = new Object();
				temp_tour.name = entry.name;
				temp_tour.geocaches = new Array(entry);

				printPageFunction(temp_tour)();

		}, false);


		append(newButton,gcTourFieldset)


		// change coordinates
		newButton = createElement('input',{type:"button",value:$.gctour.lang('moveGeocache'),style:"float:left;background-image:url(http://www.geocaching.com/images/icons/coord_update.gif)"});append(newButton,gcTourFieldset);
		newButton.setAttribute('onclick','return false;');
		newButton.addEventListener('click', openChangeCoordinates, false);
		append(newButton,gcTourFieldset)



		// update the coordinates if it is already changed:

		if(GM_getValue('coords_'+cacheId,"null") != "null"){
			var coords_cacheId = GM_getValue('coords_'+cacheId);
			changeCoordinates(new LatLon(coords_cacheId.split('#')[0], coords_cacheId.split('#')[1]).toString());

		}

	}
}


// the tour list under main navigation
function initComponents(){
	//~ var thisDiv = getElementsByAttribute('class','widget-navigation')[0];

	var menuButton = createElement('div',{
		style:'height: 29px !important;\
		padding: 0 !important;\
		position: fixed !important;\
		top: 30px !important;\
		width: 35px !important;\
		background-color:#fff;\
		z-index: 100001 !important;\
		border: 1px solid #333333;border-width: 1px 1px 1px 0;border-radius:0 5px 5px 0;\
		-moz-user-select:none;'});
	menuButton.className = "header";

	menuButton.innerHTML = "<h1 style='height: 10px;border-radius: 0 5px 0 0;'><img src='"+gctourLogoSmall+"'></h1>";

	dojo.query("h1",menuButton)[0].id = "gctourButton";
	dojo.query("h1",menuButton).onmouseover(function(e){
		dojo.animateProperty(
		{
		node: "gctourContainer",
		duration: 250,
		properties: {
			left:   { start: "-210", end: "0" }
		 }
		}).play();

	});

	dojo.body().appendChild(menuButton);




	var thisDiv = createElement('div',{
		style:'background-color: #fff;\
		overflow: hidden;\
		left:-210px;\
		padding: 0 !important;\
		position: fixed !important;\
		top: 30px !important;\
		width: 200px !important;\
		z-index: 100002 !important;\
		border: 1px solid #333333;border-left:0px;border-radius:0 5px 5px 0;',
		id:"gctourContainer"});

	if(sticky){
		thisDiv.style.left = "0px";
	}

			//~ border-color: #C1CAA8 #C1CAA8 #C1CAA8 -moz-use-text-color;border-style: outset outset outset none;border-width: 1px 1px 1px medium;'});
	dojo.body().appendChild(thisDiv);


	dojo.query(thisDiv).onmouseenter(function(e){ clearTimeout(timeout);});
	dojo.query(thisDiv).onmouseleave(function(e){

		if(!sticky){
			timeout = setTimeout(function(){
				if(dojo.byId("gctourContainer").style.left == "0px"){
					dojo.animateProperty({
						node: "gctourContainer",
						duration: 1000,
						properties: { left:   { start: "0", end: "-210" } }
					}).play();
				}
			}, 1000);
		}
	});


	var cacheList = document.createElement('ol');
    cacheList.className = 'cachelist container handles';
	cacheList.setAttribute("dojoType","dojo.dnd.Source");
	cacheList.setAttribute("jsId","draglist");

	cacheList.id = 'cacheList';
	cacheList.style.width = '100%';
	cacheList.setAttribute("border","0");




	var div = document.createElement('div');
	div.style.overflow = 'auto';
	div.style.height = '80%';
	div.style.width = '100%';
	div.appendChild(cacheList);

    // make it drag n drop - only available after dojo.addOnLoad fired - see init.js
    dojo.parser.parse(div);

	dojo.subscribe("/dnd/start", function(){
		dojo.body().style.cursor = 'url("'+closedHand+'"), default';
	});

	dojo.subscribe("/dnd/cancel", function(){
		dojo.body().style.cursor = '';
	});

    // persist the new order after some cache is draged
    dojo.subscribe("/dnd/drop", function(source, nodes, copy, target){
		    dojo.body().style.cursor = '';
            var cachelist = dojo.query('ol[id="cacheList"]')[0];

            // iterate over current cachelist in DOM
            var idList = [];
            for(var i = 0; i < cachelist.childNodes.length;i++){
                idList.push(cachelist.childNodes[i].id); // save every id - in right order
                debug("ids: "+cachelist.childNodes[i].id);
            }

            var tempCaches = [];
            for(var i = 0; i < idList.length;i++){ // for each id
                var position = getPositionsOfId(idList[i]); // find the position in the currentTour obj
                tempCaches.push(currentTour.geocaches[position]); // after this add the cache in the temporary array

                debug("position: "+position);
                debug("gcid: "+currentTour.geocaches[position].id);


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
	newButton.alt = $.gctour.lang('newList');
	newButton.title = $.gctour.lang('newList');
	newButton.src = newImageString;
	newButton.style.cursor = 'pointer';
	newButton.style.marginRight = '5px';
	newButton.addEventListener('click', newTourFunction(), false);
	addHoverEffects(newButton);

	var downloadButton = document.createElement('img');
	downloadButton.alt = $.gctour.lang('onlineTour');
	downloadButton.title = $.gctour.lang('onlineTour');
	downloadButton.src = downloadImageString;
	downloadButton.style.cursor = 'pointer';
	downloadButton.style.marginRight = '5px';
	downloadButton.addEventListener('click', downloadTourDialog, false);
	//~ downloadButton.addEventListener('click',
			//~ function(){
				//~ var webcode = window.prompt($.gctour.lang('webcodePrompt'));
				//~ if(webcode && trim(webcode) != ""){
					//~ downloadTourFunction(webcode);
				//~ }
			//~ },false);
	addHoverEffects(downloadButton);


	var toggleSettingsButton = document.createElement('img');
	toggleSettingsButton.alt = $.gctour.lang('showSettings');
	toggleSettingsButton.title = $.gctour.lang('showSettings');
	toggleSettingsButton.src = settingsImageString;
	toggleSettingsButton.style.cursor = 'pointer';
	toggleSettingsButton.style.marginRight = '5px';
	toggleSettingsButton.addEventListener('click', openSettingsDialog, false);
	addHoverEffects(toggleSettingsButton);


	var toggleTourListButton = document.createElement('img');
	toggleTourListButton.alt = $.gctour.lang('openTour');
	toggleTourListButton.title = $.gctour.lang('openTour');
	toggleTourListButton.src = openTourImageString;
	toggleTourListButton.style.cursor = 'pointer';
	toggleTourListButton.style.marginRight = '5px';
	toggleTourListButton.addEventListener('click', openTourDialog, false);
	addHoverEffects(toggleTourListButton);

	var sendMessageButton = document.createElement('img');
	sendMessageButton.alt = $.gctour.lang('sendMessageTitle');
	sendMessageButton.title = $.gctour.lang('sendMessageTitle');
	sendMessageButton.src = sendMessageImage;
	sendMessageButton.style.cursor = 'pointer';
	sendMessageButton.style.marginRight = '5px';
	sendMessageButton.addEventListener('click', sendMessageDialog, false);
	addHoverEffects(sendMessageButton);

	var autoTourButton = document.createElement('img');
	autoTourButton.alt = $.gctour.lang('autoTour');
	autoTourButton.title = $.gctour.lang('autoTour');
	autoTourButton.src = autoTourImage;
	autoTourButton.style.cursor = 'pointer';
	autoTourButton.style.marginRight = '5px';
	autoTourButton.addEventListener('click', showAutoTourDialog, false);
	addHoverEffects(autoTourButton);

	// if the webcode is visable - the menu must be 20px higher
	var tourHeaderDiv = createElement('div');
	tourHeaderDiv.style.height = ((currentTour.webcode)?55:35)+"px";

	tourHeaderDiv.innerHTML = '<img id="inconsistentTour" src="'+dangerImageString+'" style="float:right;padding:3px;display:none"/><u id="tourName">'+currentTour.name +'</u>&nbsp;<span style="font-size:66%" id="cachecount">('+currentTour.geocaches.length+')</span>';
	tourHeaderDiv.innerHTML+="<span id='webcode'><br/>Webcode:<b>"+currentTour.webcode+"</b>&nbsp;</span>"
	// show the webcode if it is available
	if(!currentTour.webcode){
		dojo.query("span[id='webcode']",tourHeaderDiv)[0].style.display = 'none';
	}

			append(createElement('br'),tourHeaderDiv)

			var renameButton = document.createElement('img');
			renameButton.src = editImageString;
			renameButton.title = $.gctour.lang('rename');
			renameButton.alt = $.gctour.lang('rename');
			renameButton.style.cursor = 'pointer';
			renameButton.style.marginRight = '5px';
			renameButton.addEventListener('click',
				function(){
				var newTourName = prompt($.gctour.lang('newTourDialog'), currentTour.name);
				if(!newTourName) return;
				currentTour.name = newTourName;
				saveCurrentTour();
				updateTour();
				//~ window.location.reload();
				},false);
			addOpacityEffects(renameButton);

			var deleteButton = document.createElement('img');
			deleteButton.id = "gctourDeleteButton";
			deleteButton.src = deleteImageString;
			deleteButton.alt = $.gctour.lang('removeTour');
			deleteButton.title = $.gctour.lang('removeTour');
			deleteButton.style.cursor = 'pointer';
			deleteButton.style.marginRight = '3px';
			deleteButton.style.display = (tours.length == 1)?'none':'inline';

			deleteButton.addEventListener('click', deleteCurrentTour, false);
			addOpacityEffects(deleteButton);


			var markerButton = document.createElement('img');
			markerButton.src = plusImageString;
			markerButton.alt = $.gctour.lang('addOwnWaypoint');
			markerButton.title = $.gctour.lang('addOwnWaypoint');
			markerButton.style.cursor = 'pointer';
			markerButton.style.marginRight = '3px';
			markerButton.addEventListener('click', function(){showNewMarkerDialog();}, false);
			addOpacityEffects(markerButton);

			var sendGPSButton = document.createElement('img');
			sendGPSButton.alt = $.gctour.lang('sendToGps');
			sendGPSButton.title = $.gctour.lang('sendToGps');
			sendGPSButton.src = sensGPSImageString;
			sendGPSButton.style.cursor = 'pointer';
			sendGPSButton.style.marginRight = '5px';
			//sendGPSButton.addEventListener('click', openSend2GpsFunctionLocal(), false);
			sendGPSButton.addEventListener('click', openSend2GpsDialog, false);
			addOpacityEffects(sendGPSButton);

			var makeMapButton = document.createElement('img');
			makeMapButton.alt = $.gctour.lang('makeMap');
			makeMapButton.title = $.gctour.lang('makeMap');
			makeMapButton.src = mapImageString;
			makeMapButton.style.cursor = 'pointer';
			makeMapButton.style.marginRight = '5px';
			//sendGPSButton.addEventListener('click', openSend2GpsFunctionLocal(), false);
			makeMapButton.addEventListener('click', makeMapFunction, false);
			addOpacityEffects(makeMapButton);

			var uploadTourButton = document.createElement('img');
			uploadTourButton.alt = $.gctour.lang('upload');
			uploadTourButton.title = $.gctour.lang('upload');
			uploadTourButton.src = uploadImageString;
			uploadTourButton.style.cursor = 'pointer';
			uploadTourButton.style.marginRight = '5px';
			uploadTourButton.addEventListener('click', function(){uploadTourFunction(currentTour.id)();}, false);
			addOpacityEffects(uploadTourButton);

			var requestPrintButton = document.createElement('img');
			requestPrintButton.alt = $.gctour.lang('printview');
			requestPrintButton.title = $.gctour.lang('printview');
			requestPrintButton.src = printerImageString;
			requestPrintButton.style.cursor = 'pointer';
			requestPrintButton.style.marginRight = '5px';
			requestPrintButton.addEventListener('click', function(){printPageFunction(currentTour)();}, false);
			addOpacityEffects(requestPrintButton);

			var downloadGPXButton= document.createElement('img');
			downloadGPXButton.alt = $.gctour.lang('downloadGpx');
			downloadGPXButton.title = $.gctour.lang('downloadGpx');
			downloadGPXButton.src = downloadGPXImageString;
			downloadGPXButton.style.cursor = 'pointer';
			downloadGPXButton.style.marginRight = '5px';
			downloadGPXButton.addEventListener('click',downloadGPXFunction(), false);
			addOpacityEffects(downloadGPXButton);

			append(renameButton,tourHeaderDiv);
			append(requestPrintButton,tourHeaderDiv);
			append(sendGPSButton,tourHeaderDiv);
			append(downloadGPXButton,tourHeaderDiv);
			append(makeMapButton,tourHeaderDiv);
			append(uploadTourButton,tourHeaderDiv);
			append(markerButton,tourHeaderDiv);

			append(deleteButton,tourHeaderDiv);


			var buttonsDiv = createElement('div',{style:"height:20px;-moz-user-select:none;'"});

			buttonsDiv.appendChild(newButton);
			buttonsDiv.appendChild(toggleTourListButton);
			buttonsDiv.appendChild(downloadButton);
			buttonsDiv.appendChild(autoTourButton);
			buttonsDiv.appendChild(toggleSettingsButton);
			buttonsDiv.appendChild(sendMessageButton);


			var header = createElement('div',{style:"height:40px;cursor:pointer;-moz-user-select:none;'"});
			header.className= "header";

			header.innerHTML = "<h1><img src='"+gctourLogoImage+"'/><img style='float:right' src='"+pin_image+"'></h1";

			if(sticky){
				dojo.query("h1",header)[0].style.backgroundColor = "orange";
				dojo.query("img",header)[1].src = pinned_image;
			}

			//~ header.style.backgroundImage = "url("+gctourLogoImage+")";
			//~ header.style.backgroundPosition = "center left";
			//~ header.style.backgroundRepeat = "no-repeat";
			//~ header.style.cursor = "pointer";
			//~ header.style.height = "30px";

			dojo.query("h1",header).onmouseover(function(e){this.style.backgroundColor = "orange"}).onmouseout(function(e){this.style.backgroundColor = (sticky)?"orange":"#B2D4F3"}).onclick(function(e){sticky = !sticky;GM_setValue('sticky',sticky);dojo.query("img",header)[1].src = (sticky)?pinned_image:pin_image;});

			var footerDiv = createElement('div',{style:"font-size: 70%;height:13px;"});
			footerDiv.innerHTML = "<div style='float:left;margin-left: 5px;'><a href='http://gctour.madd.in'>http://gctour.madd.in</a></div><div style='float:right;margin-right: 5px;'>v"+ VERSION + "." + BUILD + "</div>";






			append(header, thisDiv);
			append(buttonsDiv, thisDiv);
			append(tourHeaderDiv, thisDiv);
			append(div, thisDiv);
			append(footerDiv, thisDiv);






			// popultate the current list on load
			for (var i = 0; i < currentTour.geocaches.length; i++){
				addNewTableCell(currentTour.geocaches[i],false);
			}

			if(currentTour.geocaches.length == 0){
				var table = document.getElementById('cacheList');
				table.innerHTML = $.gctour.lang('emptyList');
			}


			//finally: set new heights and layout!
			handleResize();
}
