function getTourById(id){
	currentTourId = GM_getValue('currentTour',-1);
	tours = eval(GM_getValue('tours',new Array()));
	for (var i = 0; i<tours.length;i++){
		if(tours[i].id == currentTourId){
			return tours[i];
		}
	}	
	return;
}

function getNewTourId(){
	var tourId = 0;
	for (var i = 0; i<tours.length;i++){
		if(tours[i].id >= tourId){
			tourId = tours[i].id + 1;
		}
	}
	
	return tourId;	
}	

function isIdInTable(gcId){
	 
	for (var i = 0; i < currentTour.geocaches.length; i++) 
	{
		if(currentTour.geocaches[i].id == gcId){
			return true;
		} 
	}
	
	return false;
}

function addNewTableCell(theEntry,effects){
	
	var costumMarker = (typeof(theEntry.lat) != "undefined");

	var entryLi = createElement('li', {id: theEntry.id, style: "opacity:0;width:88%;list-style-image='url('"+theEntry.image+"')"});	
	//set the image
    entryLi.style.listStyleImage="url('"+theEntry.image+"')";
	
	// make the gcid link
	var nameCite = createElement('span',{style:"vertical-align:top"});
	if(!costumMarker){	          
		var linkElement = document.createElement('a');
		linkElement.style.fontSize = '9px';
		linkElement.style.fontFamily = 'arial,sans-serif';
		linkElement.href = 'http://www.geocaching.com/seek/cache_details.aspx?guid='+theEntry.guid;
		linkElement.textContent = theEntry.id;
		nameCite.appendChild(linkElement);
	} else {
		nameCite.textContent = theEntry.name;
	}
	entryLi.appendChild(nameCite);
	
	// the log/edit button and the delete button
	var functionButtonsDiv = document.createElement('div');
	functionButtonsDiv.style.cssFloat = 'right';
	functionButtonsDiv.style.cssFloat = 'right';
	
	if(!costumMarker){
		var logVisitImage = document.createElement('img');
		logVisitImage.alt = lang['logYourVisit'];
		logVisitImage.title = lang['logYourVisit'];
		logVisitImage.style.cursor = 'pointer';    
		logVisitImage.src = "http://www.geocaching.com/images/stockholm/16x16/add_comment.gif";
		logVisitImage.addEventListener('click', function(){window.location.href = 'http://www.geocaching.com/seek/log.aspx?wp='+theEntry.id;}, true);	
		addOpacityEffects(logVisitImage); 
		functionButtonsDiv.appendChild(logVisitImage);
	} else {
		var editMarkerButton = document.createElement('img');
		editMarkerButton.alt = lang['edit'];
		editMarkerButton.title = lang['edit'];
		editMarkerButton.style.cursor = 'pointer';    
		editMarkerButton.src = editImageString;
		editMarkerButton.addEventListener('click',  function(){showNewMarkerDialog(theEntry);}, false);	
		addOpacityEffects(editMarkerButton); 
		functionButtonsDiv.appendChild(editMarkerButton);
	}
	
	var deleteImage = document.createElement('img');
    deleteImage.alt = lang['removeFromList'];
    deleteImage.title = lang['removeFromList'];
    deleteImage.style.cursor = 'pointer'; 
    deleteImage.src = deleteImageString;
	deleteImage.addEventListener('click', deleteElementFunction(theEntry.id), true);	
	addOpacityEffects(deleteImage); 
	functionButtonsDiv.appendChild(deleteImage);	


	// thanks to adam r
	var upDownDiv = document.createElement('div');
	upDownDiv.align = "right";
	
	var topButton = document.createElement('img');
    topButton.alt = "top";
    topButton.title = "top";
    topButton.style.cursor = 'pointer';
    topButton.src = topArrowImageString;
    topButton.addEventListener('click', moveTop(theEntry.id), true);
    addOpacityEffects(topButton);
	
	var upButton = document.createElement('img');
    upButton.alt = "up";
    upButton.title = "up";
    upButton.style.marginRight = '5px';
    upButton.style.cursor = 'pointer';
    upButton.src = upArrowImageString;
    upButton.addEventListener('click', moveUp(theEntry.id), true);
    addOpacityEffects(upButton);
    
	
	var downButton = document.createElement('img');
    downButton.alt = "down";
    downButton.title = "down";
    downButton.style.cursor = 'pointer';    
	downButton.style.marginRight = '5px';
    downButton.src = downArrowImageString;    
    downButton.addEventListener('click', moveDown(theEntry.id), true);
    addOpacityEffects(downButton);
	
	var bottomButton = document.createElement('img');
    bottomButton.alt = "bottom";
    bottomButton.title = "bottom";
    bottomButton.style.cursor = 'pointer';
    bottomButton.src = bottomArrowImageString;
    bottomButton.addEventListener('click', moveBottom(theEntry.id), true);
    addOpacityEffects(bottomButton);
		
	functionButtonsDiv.appendChild(document.createElement('br'));
	upDownDiv.appendChild(upButton);
	upDownDiv.appendChild(topButton);
	upDownDiv.appendChild(document.createElement('br'));
	upDownDiv.appendChild(downButton);
	upDownDiv.appendChild(bottomButton);
	functionButtonsDiv.appendChild(upDownDiv);
	entryLi.appendChild(functionButtonsDiv);
	
	
	var nameDiv = document.createElement('div');
	nameDiv.style.clear = 'left';
	if(!costumMarker){
		nameDiv.innerHTML = theEntry.name;
	}else {
		nameDiv.innerHTML = theEntry.content;
	}
	entryLi.appendChild(nameDiv);
	
	
	document.getElementById('cacheList').appendChild(entryLi);
	
	if(effects){
		dojo.fadeIn({node: entryLi,duration: 1000}).play()
	} else {
		entryLi.style.opacity = "1";
	
	}
	
}


function getPositionsOfId(theId){
	for (var i = 0; i < currentTour.geocaches.length; i++){
		if(currentTour.geocaches[i].id == theId){
			return i;
		}
	}
	return -1;
}


// function to move an cache to an given position in the list
function move(id,positionDelta){
	
	
	// locate the selected cache in the list
	var position = getPositionsOfId(id);
	
	
	// return if we are at the end or at top of the list!
	if((position == 0  && positionDelta < 0) || (position == currentTour.geocaches.length-1 && positionDelta > 0) ){
		return;
	}
	
	// save clicked cache
	var geoCache = currentTour.geocaches[position];
	
	// remove it from the current geocaches
	currentTour.geocaches.splice(position,1);
	
	var tempCaches = new Array();
	
	// first push all caches in front of the selected in the new array
	for(var i = 0; i < position+positionDelta; i++){
		tempCaches.push(currentTour.geocaches[i]);
	}
	
	// then the selected
	tempCaches.push(geoCache);
	
	// and now the rest
	for(var i = position+positionDelta; i < currentTour.geocaches.length; i++){
		tempCaches.push(currentTour.geocaches[i]);
	}
	
	// ... and make it persistent
	currentTour.geocaches = tempCaches;	
	saveCurrentTour();
	
	
	// redraw the list:
	var cacheList = document.getElementById('cacheList');
	
	// just clear the list
	while(cacheList.firstChild) cacheList.removeChild(cacheList.firstChild);
	for (var i = 0; i < currentTour.geocaches.length; i++){
		addNewTableCell(currentTour.geocaches[i],false);
	}
}

function moveUp(id){
	return function(){
		move(id,-1);
	}
}
function moveDown(id){
	return function(){
		move(id,1);
	}
}

function moveTop(id){
	return function(){
		var position = getPositionsOfId(id);
		move(id,-position);
	}
}

function moveBottom(id){
	return function(){
		var position = getPositionsOfId(id);
		move(id,currentTour.geocaches.length-position-1);
	}
}

function addCustomMarker(name, lat, lon, content, typeImage, typeSymbol){
	
	if(currentTour.geocaches.length == 0){
		var table = document.getElementById('tourTable');		
		table.innerHTML ='';
	}
	
	// customMarker:								e.g.:
	//		name	->	the cachename		parking area
	//		image	->	the typeimage		http://gctour.madd.in/map/icons/flag.png
	//		lat		->	latitude		51.12342
	//		lon		->	longitude		-12.33456
	//		content	->	the content		"Test\nLINEBREAK"
	//		symbol	->	GPX symbol name "Red Flag"
	
	var entry = new Object();
	entry.id = name+lat+lon;	
	entry.name = name;		
	entry.latitude = lat;
	entry.longitude = lon;
	entry.lat = lat;
	entry.lon = lon;
	entry.image = typeImage;
	entry.content = content;
	entry.symbol = typeSymbol;
	
	log("New custommarker: " + entry.name +" lat:"+entry.lat+" lon:"+entry.lon+" Type:"+entry.symbol +" content:"+entry.content);
	
	// add the newbie
	addNewTableCell(entry,true);
	
	
	// and make it persistence
	saveNewCache(entry);
	
	// update the cache count	
	updateCacheCount(currentTour.geocaches.length);;
	
	return entry;
}

function addElementFunction(theId, theGuId, theName, theTypeImage){
   return function () {
   		
			if(currentTour.geocaches.length == 0){
				var table = document.getElementById('tourTable');		
				table.innerHTML ='';
			}
   			if(!isIdInTable(theId)){
   				// entry:								e.g.:
   				//		id		->	the gc.com id		GC00815
   				//		guid	->	the guid			6e974919-2b47-46e2-8661-3fc62a5a9650
   				//		name	->	the cachename		Echo the tomcat
   				//		image	->	the typeimage		http://www.geocaching.com/images/WptTypes/sm/2.gif
				var entry = new Object();
				entry.id = theId;		
				//~ entry.name = theName.textContent;
				entry.name = theName;
				entry.guid = theGuId;
				
				// split the src an take only x.gif
				//~ var typeGif = theTypeImage.getAttribute('src').split("/")[3];
				var typeGif = theTypeImage;
				entry.image = 'http://www.geocaching.com/images/WptTypes/sm/'+typeGif;

				// add the newbie
				addNewTableCell(entry,true);
				
				// and make it persistence
				saveNewCache(entry);
				
				// update the cache count	
				updateCacheCount(currentTour.geocaches.length);
	
				
			}
	}
}

function saveNewCache(entry){
	
	currentTour = getTourById(currentTourId);
	
	currentTour.geocaches.push(entry);
	saveCurrentTour();
	
	log("saving "+ entry.id +" to "+currentTour.name);
}


function newTourFunction(preset){
	return function(){
		var newTour = new Object();
		newTour.id = getNewTourId();
		
		var tourName = (preset)?preset:"Tour "+newTour.id
		newTour.name = prompt(lang['newTourDialog'], tourName);
		newTour.geocaches = new Array();
		if(!newTour.name) return false;
		
		
		
		tours.push(newTour);
		log("Creating new tour: "+newTour.id +" ; "+ newTour.name);
		
		saveTour(newTour);	
		
		//~ window.location.reload();		
		updateTour();
		
		return true;
	}
}

function saveCurrentTour(){
	saveTour(currentTour);
}
	
function saveTour(tour){	
	var i;
	for (i= 0; i < tours.length; ++i){
		if(tours[i].id == tour.id){
			tours[i] = tour;
		}
	}
		
	GM_setValue('currentTour', tour.id);
	GM_setValue('tours', uneval(tours));
	log("updating "+tour.name);
}

function updateCacheCount(count){
	dojo.query("span[id='cachecount']")[0].innerHTML = '('+count+')';
	
	dojo.animateProperty(
    {
      node: "cachecount",duration: 1000,
      properties: {
        //~ color:         { start: "black", end: "white" },
        backgroundColor:   { start: "#FFE000", end: "#EEEEEE" }
      }
    }).play();
}

function deleteElementFunction(theId){
   return function () {
   	
   	
   				
   				var theElement = document.getElementById(theId);				
				//~ var trWithElement = theElement.parentNode.parentNode;
				
				// cool sliding effect:
				var elementRemoval = dojo.fadeOut({node: theElement,duration: 500});
				dojo.connect(elementRemoval,"onEnd",function(){ theElement.parentNode.removeChild(theElement); });
				elementRemoval.play();
				
				// locate the element to delete
				for (var i = 0; i < currentTour.geocaches.length; i++){
					if(currentTour.geocaches[i].id == theId){
						// array in js are dumb - where is removeAt ??
						currentTour.geocaches.splice(i,1);
						log("removing '"+theId +"' from '"+ currentTour.name+"'");
						break;
					}
				}
				
				saveCurrentTour();
				
				// update the cache count	
				updateCacheCount(currentTour.geocaches.length);
	
				
				if(currentTour.geocaches.length == 0){
					var table = document.getElementById('tourTable');		
					table.innerHTML = lang['emptyList'];
				}
            }
}



function removeElementsFunction(descriptionElement, id, tagName){
	return function () {
		var elements = descriptionElement.getElementsByTagName(tagName);
		for (var x = 0; x<elements.length; x++) {
			if(elements[x].id == id){
				elements[x].style.display = "none";
			}			
		}
	}
}

function loadTour(id){
	return function(){
		GM_setValue('currentTour',id);

		if(document.URL.search("webcode")>=0){
			window.location = "http://www.geocaching.com";
		} else {
			updateTour();
		}

	}
}

function deleteTourFunction(id,listElement){
	return function(){
		if (confirm(lang['removeTourDialog'])) {  
			for (var i = 0; i < tours.length; i++){
				if(tours[i].id == id){
					log("removing '"+tours[i].name +"'");
					// array in js are dumb - where is removeAt ??
					tours.splice(i,1);
					saveCurrentTour();
					updateTour();
					
					break;
				}
			}
			//~ window.location.reload();
		}
	}
}