function updateTour(e){
	initCore();
	updateGUI();
}

function toggleSettingsFunction(){
	return function(){
		var tourSettingsDiv = dojo.byId('tourSettingsDiv');
		if (tourSettingsDiv.style.display == 'none'){
			dojo.fx.wipeIn({
				node: tourSettingsDiv,
				duration: 400
			}).play();
 	  	} else {
			dojo.fx.wipeOut({
				node: tourSettingsDiv,
				duration: 400
			}).play();
		}
	}
}
function toggleTourListFunction(){
	return function(){
		var tourlistDiv = dojo.byId('tourlistDiv');
		if (tourlistDiv.style.display == 'none'){
			dojo.fx.wipeIn({
				node: tourlistDiv,
				duration: 400
			}).play();
 	  	} else {
			dojo.fx.wipeOut({
				node: tourlistDiv,
				duration: 400
			}).play();
		}
	}
}

function updateGUI(){
    var cacheList, i, table;

	// update the cache count	
	updateCacheCount(currentTour.geocaches.length);
	// update tourName
	dojo.byId("tourName").innerHTML = currentTour.name;
	// update the opendialog
	populateAllTours();

    cacheList = document.getElementById('cacheList');	
	cacheList.innerHTML = "";
	// popultate the current list on load
	for (i = 0; i < currentTour.geocaches.length; i++){
		addNewTableCell(currentTour.geocaches[i],false);
	}

	table = dojo.byId('tourTable');	
	if(currentTour.geocaches.length == 0){
		table.innerHTML = lang['emptyList'];
	} else {
		table.innerHTML = "";
	}
}

function addOpacityEffects(element){
	element.style.opacity = '0.4';
	element.addEventListener('mouseover', addOpacityEffect(element),false);
	element.addEventListener('mouseout',  removeOpacityEffect(element),false);
}

function addOpacityEffect(element){return function(){	element.style.opacity = '1';}}
function removeOpacityEffect(element){return function(){element.style.opacity = '0.4'}}

function addHoverEffects(element){
	element.addEventListener('mouseover', addHoverEffect(element),false);
	element.addEventListener('mouseout',  removeHoverEffect(element),false);
	element.addEventListener('mousedown', addClickEffect(element),false);
	element.addEventListener('mouseup',  removeClickEffect(element),false);
	element.style.margin = '1px';
}

function addClickEffect(element){return function(){	element.style.background = '#a9b2bf';}}
function removeClickEffect(element){return function(){element.style.background = '#cdd8e8';}}
function addHoverEffect(element){return function(){element.style.margin = '0px';element.style.border = '1px solid lightgray';element.style.background = '#cdd8e8';}}
function removeHoverEffect(element){return function(){element.style.margin = '1px';element.style.border = '0px solid lightgray';element.style.background = '';}}



function openSend2GpsFunctionLocal(){
	return function(){
		if(!userName){
			alert(lang['notLogedIn']);
		} else if( currentTour.geocaches.length == 0) {
			alert(lang['emptyList']);
		} else {
			if(GM_getValue('showGpx',false)){
				window.open('http://www.geocaching.com/seek/sendtogps.aspx?guid=9d2b4990-7222-4b1c-8062-8b753af24ac5&tour=true', 's2gps', config='width=425,height=610,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=yes,directories=no,status=no');			
			} else {
				window.open('http://www.geocaching.com/seek/sendtogps.aspx?guid=9d2b4990-7222-4b1c-8062-8b753af24ac5&tour=true', 's2gps', config='width=425,height=280,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=yes,directories=no,status=no');			
			}
		}
	}
}

function downloadGPXFunction(){
	return function(){		
        var gpxForm, nameInput, contentArea, tourName, currentDate, currentDateString, dummyString;
		if(!userName){
			alert(lang['notLogedIn']);
		} else if( currentTour.geocaches.length == 0) {
			alert(lang['emptyList']);
		} else {	

			// add the overlay while loading
			addOverlay(document,lang['pleaseWait']);

			gpxForm = document.createElement('form');
			gpxForm.setAttribute('style','display:;');
			gpxForm.action = 'http://gc.madd.in/gm/download2.php';		
			gpxForm.id="gpxForm";

			gpxForm.method = 'post';
			
			nameInput = document.createElement('input');nameInput.type = 'hidden';gpxForm.appendChild(nameInput);
			nameInput.name = 'name';
			
			contentArea = document.createElement('textarea');gpxForm.appendChild(contentArea);
			contentArea.name = 'content';


			tourName = currentTour.name.replace(/\s+/g,"_").replace(/[^A-Za-z0-9_]*/g,"");

			currentDate =  new Date();
			currentDateString =  currentDate.getFullYear()+"-"+(currentDate.getMonth()+1)+"-"+currentDate.getDate()+"_"+currentDate.getHours()+"-"+currentDate.getMinutes()+"-"+currentDate.getSeconds();


			nameInput.value = 'GCTour.'+tourName+'.'+currentDateString+'.gpx';

			try {
				if (GM_getValue('gpxschema',1) == 0){
					dummyString = getGPX();	
				} else {
					dummyString = getGPXNew();
				} 

				//iff the cancel button is pressed the dummyString just contain canceled
				if(dummyString == "canceled"){
					removeOverlay(document);
					return;
				}

				// pretty print the gpx
				// remove <?xml version="1.0" encoding="utf-8"?> to prevent error message from E4X
				dummyString = dummyString.replace(/^<\?xml\s+version\s*=\s*(["'])[^\1]+\1[^?]*\?>/, ""); 
				dummyString =  XML(dummyString).toXMLString();				
				// and add it again - to be sure!
				dummyString = '<?xml version="1.0" encoding="utf-8"?>\n'+dummyString;
				

				contentArea.innerHTML = encodeURIComponent(dummyString);

				document.body.appendChild(gpxForm);
				document.getElementById('gpxForm').submit();
				document.body.removeChild(gpxForm);

				// all done - remove the overlay
				removeOverlay(document); 


			} catch (e) {
				addErrorDialog(e,"GPX ERROR",document); 
			}
		}
	}
}


// TODO: rename this function to sendToGPSTour
function initGPXTour(){
    var dataStringElement, tourName, currentDate, currentDateString;
	// add the overlay while loading
	addOverlay(document,lang['pleaseWait']);
	//~ document.getElementsByClassName('dark_msg_overlay')[0].getElementsByTagName('div')[0].innerHTML = "0 / "+currentTour.geocaches.length;
	try{	
		dataStringElement = document.getElementById('dataString');
		dataStringElement.value = lang['pleaseWait'];
		if (GM_getValue('gpxschema',1) == 0){
			dataStringElement.value = getGPX();	
		} else {
			dataStringElement.value = getGPXNew();
		}

		tourName = currentTour.name.replace(/\s+/g,"_").replace(/[^A-Za-z0-9_]*/g,"");

		currentDate =  new Date();
		currentDateString =  currentDate.getFullYear()+"-"+(currentDate.getMonth()+1)+"-"+currentDate.getDate()+"_"+currentDate.getHours()+"-"+currentDate.getMinutes()+"-"+currentDate.getSeconds();


		dojo.byId('cacheID').value = 'GCTour.'+tourName+'.'+currentDateString+'.gpx';

		// all done - remove the overlay
		removeOverlay(document);
	}catch (e){
		addErrorDialog(e,"GPX2 ERROR",document); 
	}

}

function uploadTourFunction(id){
	return function(){ 
	    var i, geocaches, cache_i, costumMarker, geocache, mapCache, waypoint_i, codeString;
		try{
			if(!userName){
				alert(lang['notLogedIn']);
			} else if( currentTour.geocaches.length == 0) {
				alert(lang['emptyList']);
			} else {	
				
		
				for (i = 0; i < tours.length; i++){
					if(tours[i].id == id){
						// add the overlay while loading
						addOverlay(document,lang['pleaseWait']);
						if (GM_getValue('uploadMap',true)){
							//create the overview map
							geocaches = new Array();
							for (cache_i = 0; cache_i < tours[i].geocaches.length; ++cache_i){
								
								if(GM_getValue("stopTask",false) && cache_i != 0){
									GM_setValue("stopTask",false);
									removeOverlay(document);
									break;
								} else if (GM_getValue("stopTask",false) && cache_i == 0 ) {
									GM_setValue("stopTask",false);
								}
								costumMarker = (typeof(tours[i].geocaches[cache_i].lat) != "undefined");
								if(!costumMarker){
								    geocache = getGeocache(tours[i].geocaches[cache_i].id);

									mapCache = new Object();
									mapCache.gcid = geocache.gcid;
									mapCache.type = geocache.type;
									mapCache.name = geocache.name;
									mapCache.latitude = geocache.lat;
									mapCache.longitude = geocache.lon;
									mapCache.additional_waypoints = geocache.additional_waypoints;
									for(waypoint_i = 0 ; waypoint_i < mapCache.additional_waypoints.length; waypoint_i++){
										mapCache.additional_waypoints[waypoint_i].note = "";
									}
									geocaches.push(mapCache);
								} else {
									geocaches.push(tours[i].geocaches[cache_i]);
								}
								
								setProgress(cache_i,tours[i].geocaches.length,document);
							}	
						}
						// first upload tour 
						post('http://gctour.madd.in/save.php', 'tour='+uneval(tours[i]).replace(/&/g,"\\u0026"),
								function(text){				
									if (GM_getValue('uploadMap',true)){
										// if this is complete upload map file also!
										post('http://gctour.madd.in/map/saveUpload.php', 'tour='+JSON.stringify(geocaches).replace(/&/g," und ")+'&crc='+text,
											function(text){
												codeString = lang['tourUploaded1']+text+lang['tourUploaded2'];
												alert(codeString);
												removeOverlay(document);
											});
									} else {
										codeString = lang['tourUploaded1']+text+lang['tourUploaded2'];
										alert(codeString);
										removeOverlay(document);
									}
								});
						break;
					}
				}
			}
		} catch(e){addErrorDialog(e,"UPLOAD TOUR ERROR",document); }	
	}
}

function showAutoTourDialog(center,radius){
    var overLay, queryFilterDiv;

	if(!userName){
		alert(lang['notLogedIn']);
		return;
	}


	overLay = getOverlay(lang['autoTour']);
	overLay.appendChild(getCoordinatesTab());
	overLay.appendChild(getMapPreviewTab());

	queryFilterDiv = document.createElement('div');append(queryFilterDiv,overLay);
	queryFilterDiv.appendChild(getTypeFilter());
	queryFilterDiv.appendChild(getSizeFilter());
	queryFilterDiv.appendChild(getDtFiler('Difficulty'));
	queryFilterDiv.appendChild(getDtFiler('Terrain'));
	queryFilterDiv.appendChild(getSpecialFilter());

	overLay.appendChild(getAutoTourSubmit());

	if(center && radius){

		dojo.query("input[id='markerCoords']")[0].value = center.lat() +' '+center.lng();
		dojo.query("input[id='markerRadius']")[0].value = radius;
		getMarkerCoord()();
	}
}

function downloadTourFunction(webcode){
    var details;

	// add the overlay while loading
	addOverlay(document,lang['pleaseWait']);

	details = new Object();
	details.method = 'GET';
	details.url = 'http://gctour.madd.in/query.php?crc='+trim(webcode);
	details.onload = function(response) {parseTourQuery(response)};
	GM_xmlhttpRequest(details);	
}


function showInformationDiv(tour){
	return function(){
	    var infomationDiv, i;
	
		infomationDiv = document.createElement('div');
		document.body.appendChild(infomationDiv);



		infomationDiv.id = "infomationDiv";
		infomationDiv.style.position = "fixed";
		infomationDiv.style.right = "15%";
		infomationDiv.style.top = "30px";
		infomationDiv.style.textAlign = "left";
		infomationDiv.style.padding = "10px";

		infomationDiv.style.border  = '1px solid #448e35';
		infomationDiv.style.backgroundColor  = '#c6e3c0';

		infomationDiv.innerHTML = "<b>"+tour.name+" ("+tour.geocaches.length+ " Caches)</b><br/>";

		for(i = 0; i < tour.geocaches.length ; i++){
			if(i > 20){
				infomationDiv.innerHTML += "... (" +(tour.geocaches.length - i) +" more) ...";
				break;
			}
			infomationDiv.innerHTML +=  "<div style='border-bottom: 1px dotted  #448e35'> <img src='"+tour.geocaches[i].image+"' style='margin-left=10px'> "+tour.geocaches[i].name + "</div>";
		}
	};
}


function parseTourQuery(response){
    var onlineTour;

	try{
		onlineTour = eval(response.responseText);

		// all done - remove the overlay
		removeOverlay(document);



		if(onlineTour.geocaches.length == 0){
			alert(lang['webcodeerror']);
			return;
		}

		onlineTour.id = getNewTourId();		

		tours.push(onlineTour);
		saveCurrentTour();

		log("Download of an an online tour successfull: "+onlineTour.id +" ; "+ onlineTour.name);
		alert("'"+onlineTour.name+"'\n"+lang['webcodesuccess']);

		loadTour(onlineTour.id)();
	} catch(e){
		addErrorDialog(e,"TOUR DONWLOAD ERROR",newwindow2.document);
	}
}

