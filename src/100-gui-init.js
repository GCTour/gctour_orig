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
				var entry = {};
				entry.id = cacheId;
				entry.name = cacheName;
				entry.guid = guidId;
				entry.image = 'http://www.geocaching.com/images/WptTypes/sm/'+cacheTypeImage;


				temp_tour = {};
				temp_tour.name = entry.name;
				temp_tour.geocaches = new Array(entry);

				printPageFunction(temp_tour)();

		}, false);


		append(newButton,gcTourFieldset);


		// change coordinates
		newButton = createElement('input',{type:"button",value:$.gctour.lang('moveGeocache'),style:"float:left;background-image:url(http://www.geocaching.com/images/icons/coord_update.gif)"});append(newButton,gcTourFieldset);
		newButton.setAttribute('onclick','return false;');
		newButton.addEventListener('click', openChangeCoordinates, false);
		append(newButton,gcTourFieldset);


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
		style:'height: 30px !important;'+
			'padding: 0 !important;'+
			'position: fixed !important;'+
			'top: 30px !important;'+
			'width: 35px !important;'+
			'background-color:#fff;'+
			'z-index: 100001 !important;'+
			'border: 1px solid #333333;border-width: 1px 1px 1px 0;border-radius:0 5px 5px 0;'+
			'-moz-user-select:none;'
		}
	);
	menuButton.className = "header";

	menuButton.innerHTML = "<h1 style='height: 16px;border-radius: 0 5px 5px 0;'><img src='"+gctourLogoSmall+"'></h1>";

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
		style:'background-color: #fff;'+
			'overflow: hidden;'+
			'left:-210px;'+
			'padding: 0 !important;'+
			'position: fixed !important;'+
			'top: 30px !important;'+
			'width: 200px;'+
			'z-index: 100002 !important;'+
			'border: 1px solid #333333;border-left:0px;border-radius:0 5px 5px 0;',
		id:"gctourContainer"}
	);

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


	var geocacheList = document.createElement('ul');
	geocacheList.id ="cacheList";
	geocacheList.className = 'cachelist';
	geocacheList.style.width = '100%';


	$(geocacheList).sortable({
		axis: 'y',
		placeholder: 'ui-sortable-placeholder',
		opacity: 0.8,
		revert: true,
		stop: function(event, ui){

			// TODO: Geht vielleicht schneller ;-)
			//~ var geocache_code = ui.item.attr('id');

			// save the current sortation
			var idList = [];

			$("#cacheList").find("li").each(function(i){idList.push(this.id);});
			// make an geocache array with the new sort

			debug("Drag n Drop in progress:");
			var tempCaches = [];
			for(var i = 0; i < idList.length;i++){ // for each id
				var position = getPositionsOfId(idList[i]); // find the position in the currentTour obj
				var geocache = currentTour.geocaches[position];
				tempCaches.push(geocache); // and add it to the temporary array
				debug("\tMove "+geocache.id+" from '"+position+"' to '"+i+"'.");
			}

			// Overwrite the old sortation
			currentTour.geocaches = tempCaches;
			// ... and save the new tour object
			setTimeout(function() { // hack to prevent "access violation" from Greasemonkey
				saveCurrentTour();
			},0);

			return;
		}
	}).disableSelection();

	var geocacheListContainer = document.createElement('div');
	geocacheListContainer.style.overflow = 'auto';
	geocacheListContainer.style.height = '80%';
	geocacheListContainer.style.width = '100%';
	geocacheListContainer.appendChild(geocacheList);

	// if the webcode is visable - the menu must be 20px higher
	var tourHeaderDiv = createElement('div');
	tourHeaderDiv.style.height = ((currentTour.webcode)?55:35)+"px";

	tourHeaderDiv.innerHTML = '<img id="inconsistentTour" src="'+dangerImageString+'" style="float:right;padding:3px;display:none"/><u id="tourName">'+currentTour.name +'</u>&nbsp;<span style="font-size:66%" id="cachecount">('+currentTour.geocaches.length+')</span>';
	tourHeaderDiv.innerHTML+="<span id='webcode'><br/>Webcode:<b>"+currentTour.webcode+"</b>&nbsp;</span>";
	// show the webcode if it is available
	if(!currentTour.webcode){
		dojo.query("span[id='webcode']",tourHeaderDiv)[0].style.display = 'none';
	}

	append(createElement('br'),tourHeaderDiv);

	$(tourHeaderDiv).append(

		// rename
		$('<img>', {
			'class': 'tourImage',
			src:    editImageString,
			title:  $.gctour.lang('rename'),
			alt :   $.gctour.lang('rename'),
			click: function(){
				var newTourName = prompt($.gctour.lang('newTourDialog'), currentTour.name);
				if(!newTourName) { return; }
				currentTour.name = newTourName;
				saveCurrentTour();
				updateTour();
			}
		}),

		// print
		$('<img>', {
			'class': 'tourImage',
			src:    printerImageString,
			title:  $.gctour.lang('printview'),
			alt :   $.gctour.lang('printview'),
			click: function(){
				printPageFunction(currentTour)();
			}
		}),

		// sendGPS
		$('<img>', {
			'class': 'tourImage',
			src:    sensGPSImageString,
			title:  $.gctour.lang('sendToGps'),
			alt :   $.gctour.lang('sendToGps'),
			click: function(){
				openSend2GpsDialog();
			}
		}),

		// downloadGPX
		$('<img>', {
			'class': 'tourImage',
			src:    downloadGPXImageString,
			title:  $.gctour.lang('downloadGpx'),
			alt :   $.gctour.lang('downloadGpx'),
			click: function(){
				downloadGPXFunction()();
			}
		}),

		// makeMap
		$('<img>', {
			'class': 'tourImage',
			src:    mapImageString,
			title:  $.gctour.lang('makeMap'),
			alt :   $.gctour.lang('makeMap'),
			click: function(){
				makeMapFunction();
			}
		}),

		// uploadTour
		$('<img>', {
			'class': 'tourImage',
			src:    uploadImageString,
			title:  $.gctour.lang('upload'),
			alt :   $.gctour.lang('upload'),
			click: function(){
				uploadTourFunction(currentTour.id)();
			}
		}),

		// addWaypoint
		$('<img>', {
			'class': 'tourImage',
			src:    plusImageString,
			title:  $.gctour.lang('addOwnWaypoint'),
			alt :   $.gctour.lang('addOwnWaypoint'),
			click: function(){
				showNewMarkerDialog();
			}
		}),

		// deleteTour
		$('<img>', {
			id:      'gctourDeleteButton',
			'class': 'tourImage',
			src:     deleteImageString,
			title:   $.gctour.lang('removeTour'),
			alt :    $.gctour.lang('removeTour'),
			css: {'display' : (tours.length  <= 1) ? 'none' : 'inline'},
			click: function(){
				deleteCurrentTour();
			}
		})

	).find("img.tourImage").addShadowEffect().addOpacityEffect();

	/*
	var buttonsDiv = $('<div>',{
		"css": {
			"height":20,
			"-moz-user-select":"none"
		}
	});
	*/
	var buttonsDiv = createElement('div',{style:"height:20px;-moz-user-select:none;'"});

	$(buttonsDiv).append(
		// newTourButton
		$('<img>', {
			'class': 'tourImage',
			src:    newImageString,
			title:  $.gctour.lang('newList'),
			alt :   $.gctour.lang('newList'),
			click: function(){
				newTourFunction()();
			}
		}),

		// toggleTourListButton
		$('<img>', {
			'class': 'tourImage',
			src:    openTourImageString,
			title:  $.gctour.lang('openTour'),
			alt :   $.gctour.lang('openTour'),
			click: function(){
				openTourDialog();
			}
		}),

		// downloadButton
		$('<img>', {
			'class': 'tourImage',
			src:    downloadImageString,
			title:  $.gctour.lang('onlineTour'),
			alt :   $.gctour.lang('onlineTour'),
			click: function(){
				downloadTourDialog();
				//~ var webcode = window.prompt($.gctour.lang('webcodePrompt'));
				//~ if(webcode && trim(webcode) != ""){
					//~ downloadTourFunction(webcode);
				//~ }
			}
		}),

		// autoTourButton
		$('<img>', {
			'class': 'tourImage',
			src:    autoTourImage,
			title:  $.gctour.lang('autoTour'),
			alt :   $.gctour.lang('autoTour'),
			click: function(){
				var gooMap = getMapCenterAndRadius();
				showAutoTourDialog(gooMap.center, gooMap.radius);
			}
		}),

		// toggleSettingsButton
		$('<img>', {
			'class': 'tourImage',
			src:    settingsImageString,
			title:  $.gctour.lang('showSettings'),
			alt :   $.gctour.lang('showSettings'),
			click: function(){
				openSettingsDialog();
			}
		}),

		// sendMessageButton
		$('<img>', {
			'class': 'tourImage',
			src:    sendMessageImage,
			title:  $.gctour.lang('sendMessageTitle'),
			alt :   $.gctour.lang('sendMessageTitle'),
			click: function(){
				sendMessageDialog();
			}
		})

	);

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

	dojo.query("h1",header)
		.onmouseover(function(e){
			this.style.backgroundColor = "orange";
		})
		.onmouseout(function(e){
			this.style.backgroundColor = (sticky) ? "orange" : "#B2D4F3";
		})
		.onclick(function(e){
			sticky = !sticky;GM_setValue('sticky',sticky);
			dojo.query("img",header)[1].src = (sticky)?pinned_image:pin_image;
		});

	var footerDiv = createElement('div',{style:"font-size: 70%;height:13px;"});
	footerDiv.innerHTML = "<div style='float:left;margin-left: 5px;'><a href='http://gctour.madd.in'>http://gctour.madd.in</a></div><div style='float:right;margin-right: 5px;'>v"+ VERSION + "." + BUILD + "</div>";

	append(header, thisDiv);
	append(buttonsDiv, thisDiv);
	append(tourHeaderDiv, thisDiv);
	append(geocacheListContainer, thisDiv);
	append(footerDiv, thisDiv);

	// popultate the current list on load
	for (var i = 0; i < currentTour.geocaches.length; i++){
		addNewTableCell(currentTour.geocaches[i],false);
	}

	if(currentTour.geocaches.length <= 0){
		var table = document.getElementById('cacheList');
		table.innerHTML = $.gctour.lang('emptyList');
	}

	//finally: set new heights and layout!
	handleResize();

}
