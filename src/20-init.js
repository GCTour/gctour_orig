// init core variables
function initCore(){

	// setting up the language
	lang = languages[GM_getValue('language',1)];
	
	// getting all tours
	tours = loadValue('tours',new Array());
	
	//eval(GM_getValue('tours',new Array()));
	// structur a tour:
	// id 		<--- int
	// name 	<--- string
	// caches 	<--- caches
	
	
	
	// go get the current tour from the tour list
	currentTourId = GM_getValue('currentTour',-1);
	currentTour = getTourById(currentTourId);
	
	

	// oh - there is no current tour!? create one!
	if(!currentTour){
		currentTour = new Object();
		currentTour.id = getNewTourId();		
		currentTour.name = "Tour "+currentTour.id;
		currentTour.geocaches = new Array();
		tours.push(currentTour);
		log("found no currentTour! Creating new one: "+currentTour.id +" ; "+ currentTour.name);
		saveCurrentTour();
	} 
}

function initDojo(){
	// just dont start the script on the gc.com print page!
	if(document.URL.search("cdpf\.aspx")<=0) {

		var requiredModules, script;

        // required modules - add dojo stuff here
		requiredModules = [];
		requiredModules.push("dojo.fx");
	    requiredModules.push("dojo.parser");
		requiredModules.push("dojo.dnd.Source");

		unsafeWindow.djConfig = {afterOnLoad: true, require: requiredModules};  		
		script = appendScript(dojoPath + "/dojo/dojo.xd.js");
		
		
		// check after 20sec if dojo is loaded - otherwhise asume user is blocking Javascript (possible false positve)
		window.setTimeout(function(){
			if(!dojo){
			   alert(lang["SCRIPT_ERROR"]);
			}
		},20000);
		
		// only way to check if the dojo script is loaded - addOnLoad fails because of unsafeWindow scope
		script.addEventListener('load', function(event){
			dojo = unsafeWindow.dojo;
			
			// if dojo is ready to go ( include all required modules ), init GCTour
			dojo.addOnLoad(function(){ 
			        setTimeout(function() { // hack to prevent "access violation" from Greasemonkey http://wiki.greasespot.net/0.7.20080121.0_compatibility
                        init();
                    },0);
                });		
		}, 'false');
	}
}

function init(){			
	// init the core components (first tour, current tour)
	initCore();	
	// update the complete gui if the tab gets focus
	window.addEventListener("focus", updateTour,false);


	
	
	
    // process autoTour
	if(GM_getValue('tq_url')){

		// iff the cancelbutton is presssed 
		if(GM_getValue("stopTask",false)){
			GM_deleteValue('tq_url');
			GM_deleteValue('tq_caches');
			GM_setValue('stopTask',false);
			document.location.href = GM_getValue('tq_StartUrl',"http://www.geocaching.com");
			return; // then return!
		}




		var tq_url = GM_getValue('tq_url');

		if(tq_url == document.location.href){
			var tq_caches = eval(GM_getValue('tq_caches', new Array()));
			var tq_typeFilter = eval(GM_getValue('tq_typeFilter'));
			var tq_sizeFilter = eval(GM_getValue('tq_sizeFilter'));
			var tq_dFilter = eval(GM_getValue('tq_dFilter'));
			var tq_tFilter = eval(GM_getValue('tq_tFilter'));
			var tq_specialFilter = eval(GM_getValue('tq_specialFilter'));


			addOverlay(document,lang['pleaseWait']);

			var pagesSpan = dojo.query("td[class='PageBuilderWidget']> span")[0];

			if(!pagesSpan){
				alert("no caches here :-( pagesSpan missing");
				GM_deleteValue('tq_url');
				GM_deleteValue('tq_caches');
				document.location.href = GM_getValue('tq_StartUrl',"http://www.geocaching.com");
				return;
			}

			setProgress(parseFloat(pagesSpan.getElementsByTagName('b')[1].innerHTML)-1,parseFloat(pagesSpan.getElementsByTagName('b')[2].innerHTML),document);

            // locate the table
			var resultTable = dojo.query("tr[class = 'Data BorderTop']");
			var j = 0;
			for(var i = 0; i < resultTable.length;i++){ // iterate over each cache 
			
					var entryTds = resultTable[i].getElementsByTagName('td');
					var entry = new Object(); // gather informations line-by-line
        					entry.id = 'GC'+entryTds[5].textContent.split('(GC')[1].split(')')[0];		
							entry.name = entryTds[5].getElementsByTagName('a')[0].innerHTML;
							entry.guid = entryTds[5].getElementsByTagName('a')[0].href.split('guid=')[1];
							entry.image = entryTds[2].getElementsByTagName('img')[0].getAttribute('src').replace(/WptTypes\//, "WptTypes/sm/");

							var type = entry.image.split("/")[4].split(".")[0];
							var size = entryTds[3].getElementsByTagName('img')[0].getAttribute('src').split("/")[4].split(".")[0];
							var difficulty = trim(entryTds[3].textContent).split("/")[0].split("(")[1];
							var terrain = trim(entryTds[3].textContent).split("/")[1].split(")")[0];
							

							log(entry.id+" "+entry.name);
							log(type + " " + tq_typeFilter[type]);
							log(size + " " + tq_sizeFilter[size]);
							log(difficulty + " " + tq_dFilter[difficulty+""]);
							log(terrain + " " + tq_tFilter[terrain+""]);
							log("");


                            // autoTour magic starts here 
                            
                            // check whether the caches match against the given D/T values
							var addBool = tq_typeFilter[type] && tq_sizeFilter[size] && tq_dFilter[difficulty+""] && tq_tFilter[terrain+""];
							if(tq_specialFilter['is Active']){
								log("Check if "+entry.name+" is active:");
								log(addBool);
								addBool = addBool && (entry.name.indexOf('<span class="Strike">') < 0);// only add if active!
								log(addBool);
							}
							
							if(tq_specialFilter['is not a PM cache']){
								log("Check if "+entry.name+" is PM-Only cache!!")
								log(addBool);
								addBool = addBool && (entryTds[2].innerHTML.indexOf('small_profile.gif') < 0);
								log(addBool);
							}
							
							// autoTour parameter "haven't found" is not checked here because of URL parameter

                            // if all parameters match - add the cache
							if(addBool){ 
								tq_caches.push(entry);
							}
			}
			GM_setValue('tq_caches',uneval(tq_caches));

			var gcComLinks = document.getElementsByTagName("a");
			var nextLink;
			for(var i = 0; i<gcComLinks.length;i++){
				if(gcComLinks[i].innerHTML == "<b>&gt;&gt;</b>"){
					nextLink = gcComLinks[i+1];
					break;
				}
			}

			// check if there are some caches on this page (next link is not there)
            // TODO: bug here - in non-english versions of gc.com THIS WILL FAIL! Also "GCDeutsch" messes up here.
			if(!nextLink){
				alert("no caches here :-(");
				GM_deleteValue('tq_url');
				GM_deleteValue('tq_caches');
				document.location.href = GM_getValue('tq_StartUrl',"http://www.geocaching.com");
				return;
			}

			var action = nextLink.href.split("'")[1];
			if(action){
				var u = 500;
				var l = 2000;
				var waitingTime = Math.floor((Math.random() * (u-l+1))+l);
				// wait between 0.5 -> 2 seconds to do the next request
				window.setTimeout(function(){unsafeWindow.__doPostBack(action,'');},waitingTime);
			} else {

				currentTour = new Object();
				currentTour.id = getNewTourId();		
				currentTour.name = "autoTour "+currentTour.id;
				currentTour.geocaches =tq_caches;
				tours.push(currentTour);
				log("autoTour done - create new Tour: "+currentTour.id +" ; "+ currentTour.name);
				saveCurrentTour();

				document.location.href = GM_getValue('tq_StartUrl',"http://www.geocaching.com");
			}

			return;
		} else {
			GM_deleteValue('tq_url');
			GM_deleteValue('tq_caches');
		}
	}
    GM_addStyle(
	    '.dojoDndAvatar {font-size: 75%; color: black;min-width:130px;}'+
	    '.dojoDndAvatar .controls{display:none;}'+
	    '.dojoDndAvatarHeader td	{padding-left: 20px; padding-right: 4px;}'+
	    '.dojoDndAvatarHeader	{background: #ccc;}'+ 
	    '.dojoDndAvatarItem		{background: #eee;}'+
	    '.dojoDndItemBefore		{border-top:3px solid gray !important; }'+
	    '.dojoDndItemAfter		{border-bottom:3px solid gray !important;}'+
	    '.dojoDndItemOver		{background-color:#edf1f8;}'+
	    '.dojoDndMove .dojoDndAvatarHeader	{background-image: url(http://ajax.googleapis.com/ajax/libs/dojo/1.2.0/dojo/resources/images/dndNoMove.png); background-repeat: no-repeat;}'+
	    '.dojoDndCopy .dojoDndAvatarHeader	{background-image: url(http://ajax.googleapis.com/ajax/libs/dojo/1.2.0/dojo/resources/images/dndNoCopy.png); background-repeat: no-repeat;}'+
	    '.dojoDndMove .dojoDndAvatarCanDrop .dojoDndAvatarHeader	{background-image: url(http://ajax.googleapis.com/ajax/libs/dojo/1.2.0/dojo/resources/images/dndMove.png); background-repeat: no-repeat;}'+ 
	    '.dojoDndCopy .dojoDndAvatarCanDrop .dojoDndAvatarHeader	{background-image: url(http://ajax.googleapis.com/ajax/libs/dojo/1.2.0/dojo/resources/images/dndCopy.png); background-repeat: no-repeat;}'
	);


	// add global styles

	var head =document.getElementsByTagName('head')[0];    
	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML =
		'.cachelist li {'+
			'	-moz-border-radius-bottomright:10px;'+
				'	-moz-border-radius-topleft:10px;'+
				'	list-style-position:inside;'+
				'	color:#000000;'+
				'	margin:0.5em;'+
				'	padding:3px;'+
				'	width:120px;'+
				'	min-height:40px;'+
				'	-moz-background-clip:border;'+
				'	-moz-background-inline-policy:continuous;'+
				'	-moz-background-origin:padding;'+
				'	border:1pt dashed gray;'+
			//	'	background:#FFFFFF none repeat scroll 0 0;'+
				'	color:#000000;'+
				'}'+
				''+
				'.cachelist {'+
					'	font-size:80%;'+
						//~ '	list-style-type:disc;'+
						'	padding:0;'+
						'}';
	head.appendChild(style); 	



    
    // process "add to your GCTour"-link from gctour.madd.in    
	if(document.URL.search("webcode")>=0) {
		document.title = "GcTour";
		document.getElementsByTagName('body')[0].innerHTML = "<div align='center'><a href='http://www.geocaching.com'><img border='0' src='http://madd.in/icon.png'/></a></div>";
		downloadTourFunction(document.URL.split("webcode/")[1]);

		return;
	}



	var cacheListBody = document.getElementById('cacheListBody');


	if(cacheListBody){
		cacheListBody.addEventListener('DOMNodeInserted',
				function(evt){
				if(evt.relatedNode.tagName == 'TD' && evt.relatedNode.childNodes.length == 1 && evt.relatedNode.childNodes[0].nodeValue == " " ){

				var addToTourButton = document.createElement('img');
				addToTourButton.src = addToTourImageString;
				addToTourButton.style.cursor = 'pointer';
				addToTourButton.style.cssFloat = 'right';
				addToTourButton.addEventListener('click',addCacheToTourFromMap('http://www.geocaching.com/seek/cache_details.aspx?wp='+evt.relatedNode.previousSibling.firstChild.nodeValue),false);											
				addToTourButton.title = lang['addToTour'];
				addHoverEffects(addToTourButton);	
				evt.relatedNode.parentNode.childNodes[2].insertBefore(addToTourButton,evt.relatedNode.parentNode.childNodes[2].firstChild);


				}
				}
				,false);

		// next lines are for the button in the map bubbles
		var mapElement = document.getElementById('map');
		if(mapElement){
			mapElement.addEventListener('DOMNodeInserted',
					function(evt){
					var gmCacheInfo = getElementsByAttribute('id','gmCacheInfo',evt.relatedNode)[0];
					if(gmCacheInfo){
					if(!getElementsByAttribute('id','addCacheImageButton',evt.relatedNode)[0]){
					var typeImage = gmCacheInfo.getElementsByTagName('img')[0].src.split("/")[6];
					var guid = gmCacheInfo.getElementsByTagName('a')[0].href.split("=")[1];
					var wp = getElementsByAttribute('class','code',gmCacheInfo)[0].innerHTML;
					var name = gmCacheInfo.getElementsByTagName('a')[0].innerHTML;


					var addToTourButton = document.createElement('img');
					addToTourButton.alt = lang['addToTour'];
					addToTourButton.title = lang['addToTour'];
					addToTourButton.src = addToTourImageString;
					addToTourButton.id = 'addCacheImageButton';
					addToTourButton.style.cursor = 'pointer';
					addToTourButton.style.marginRight = '5px';

					addToTourButton.addEventListener('click', addElementFunction(wp,guid,name,typeImage), false);
					addHoverEffects(addToTourButton);


					var linksDiv = getElementsByAttribute('class','links',gmCacheInfo)[0];
					linksDiv.appendChild(document.createTextNode(' | '));
					linksDiv.appendChild(addToTourButton);

					}
					}
					}, false);
		}	
	}
	
	// add buttons to Bookmark site
	if(document.URL.search("\/bookmarks\/view\.aspx")>=0) {
		var bookmarkLines = dojo.query('tr[id*="row"]');
		
		for(var k = 0; k<bookmarkLines.length ; k++){
		    var bookmarkLine = dojo.query("td", bookmarkLines[k]);
            var entry = getEntryFromBookmarkTd(bookmarkLine);
            
			var addToTourButton = document.createElement('img');
			addToTourButton.alt = lang['addToTour'];
			addToTourButton.title = lang['addToTour'];
			addToTourButton.src = addToTourImageString;
			addToTourButton.style.cursor = 'pointer';
			addToTourButton.style.marginRight = '5px';

			addToTourButton.addEventListener('click', addElementFunction(entry.id,entry.guid,entry.name,entry.image), false);
			addHoverEffects(addToTourButton);
			bookmarkLine[4].appendChild(addToTourButton);   
		}
		
		
		
		
		
		// button to add all caches in list tu current tour
		dojo.query('div[id="ctl00_ContentBody_ListInfo_uxAbuseReport"]')[0].innerHTML = lang['showCaches']
		
		var addBookmarkButton = createElement('button',{style:"margin:10px"});
		addBookmarkButton.setAttribute('onclick','return false;');
		addBookmarkButton.innerHTML ="<img src='"+addToTourImageString+"'/>&nbsp;"+lang['addShownBookmarks'];
		addBookmarkButton.addEventListener('click', function () {
					
		
					for(var k = 0; k<bookmarkLines.length ; k++){
						var bookmarkLine = dojo.query("td", bookmarkLines[k]);
						var entry = getEntryFromBookmarkTd(bookmarkLine);
			
						if(entry){
							addElementFunction(entry.id,entry.guid,entry.name,entry.image)();
							
						}
					};		
				},false);		
		dojo.query('div[id="ctl00_ContentBody_ListInfo_uxAbuseReport"]')[0].appendChild(addBookmarkButton);
		
		// button to add all caches in list to a new tour
		var newBookmarkButton = createElement('button',{style:"margin:10px"});
		newBookmarkButton.setAttribute('onclick','return false;');
		newBookmarkButton.innerHTML ="<img src='"+newImageString+"'/>&nbsp;+&nbsp;<img src='"+addToTourImageString+"'/>&nbsp;"+lang['addShownBookmarksToNewTour'];
		newBookmarkButton.addEventListener('click', function () {
					var listName = dojo.query('span[id="ctl00_ContentBody_lbHeading"]')[0].textContent;
					if(newTourFunction(listName)()){
						for(var k = 0; k<bookmarkLines.length ; k++){
							var bookmarkLine = dojo.query("td", bookmarkLines[k]);
							var entry = getEntryFromBookmarkTd(bookmarkLine);
				
							if(entry){
								addElementFunction(entry.id,entry.guid,entry.name,entry.image)();								
							}
						}
					}
				},false);		
		dojo.query('div[id="ctl00_ContentBody_ListInfo_uxAbuseReport"]')[0].appendChild(newBookmarkButton);	
		
		
		var newButton = document.createElement("input");
		newButton.name = 'addAll';
		newButton.type = 'submit';
		newButton.value = lang['addMarkedToTour'];
		newButton.id = 'addAll';	
		newButton.setAttribute('onclick','return false;');	
		newButton.style.cssFloat = 'right';

		// on click add checked caches in bookmark table
		newButton.addEventListener('click',  function(){
					for(var k = 0; k<bookmarkLines.length ; k++){
						var bookmarkLine = dojo.query("td", bookmarkLines[k]);
						var entry = getEntryFromBookmarkTd(bookmarkLine);
			
						if(entry){
							if(entry.checked){
							addElementFunction(entry.id,entry.guid,entry.name,entry.image)();
							}
						}
					};		
				}, false)
		//add the button to the website
		dojo.query('input[id="ctl00_ContentBody_ListInfo_btnDownload"]')[0].parentNode.appendChild(newButton);
	}


	// add the buttons to the search table
	var searchResultTable = document.getElementById('ctl00_ContentBody_dlResults');
	if(searchResultTable){				
		
		
	
		// add after every entry a button 
		//~ var resultTrs = searchResultTable.getElementsByTagName('tr');
		var resultTrs = dojo.query("tr[class = 'Data BorderTop']");
		for(var k = 0; k<resultTrs.length ; k++){

			var entry = getEntryFromSearchTd(resultTrs[k]);
			

			//~ GM_log(entry.id +" "+entry.name + "  "+ entry.guid  + " " + entry.image +  " " + entry.checked);
			
			if(entry){
				var addToTourButton = document.createElement('img');
				addToTourButton.alt = lang['addToTour'];
				addToTourButton.title = lang['addToTour'];
				addToTourButton.src = addToTourImageString;
				addToTourButton.style.cursor = 'pointer';
				addToTourButton.style.marginRight = '5px';

				addToTourButton.addEventListener('click', addElementFunction(entry.id,entry.guid,entry.name,entry.image), false);
				addHoverEffects(addToTourButton);
				resultTrs[k].getElementsByTagName('td')[8].appendChild(addToTourButton);
			}
		}

		var newButton = document.createElement("input");
		newButton.name = 'btnGPXDL';
		newButton.type = 'submit';
		newButton.value = lang['addMarkedToTour'];
		newButton.id = 'btnGPXDL';	
		newButton.setAttribute('onclick','return false;');	
		newButton.style.cssFloat = 'right';

		// on click add an element	
		newButton.addEventListener('click',  function(){
					for(var k = 0; k<resultTrs.length ; k++){
						var entry = getEntryFromSearchTd(resultTrs[k]);
						//~ GM_log(entry.id +" "+entry.name + "  "+ entry.guid  + " " + entry.image +  " " + entry.checked);
			
						if(entry){
							if(entry.checked){
							addElementFunction(entry.id,entry.guid,entry.name,entry.image)();
							}
						}
					}	;		
				}, false)

		// add it under the search results
		searchResultTable.parentNode.insertBefore( newButton, searchResultTable.nextSibling);	
	}	

	// dont display the list on the sendtogpx page
	if(document.URL.search("sendtogps\.aspx")<=0) {
		initComponents();

		// add the button to the details page
		if(document.URL.search("cache_details\.aspx")>=0) {
			initButton();
		}		

		var loginLink = dojo.query('a[href="http://www.geocaching.com/my/"]')[0];

		if(loginLink)
			userName = loginLink.innerHTML;
	}


	// map to autotour button 
	var cacheListBounding = document.getElementById('cacheListBounding');
	if (cacheListBounding) {
		var autoTourDiv = createElement('div');
		autoTourDiv.align = 'center';
		autoTourDiv.style.padding = '10px';
		autoTourDiv.style.cursor = 'pointer';
		autoTourDiv.addEventListener('click',  function(e){
		
		        // get center of current viewport and pass it to autoTour
				var googleMap = unsafeWindow.map;
				var bounds = googleMap.getBounds();
				var center = googleMap.getCenter();
				var topCenter = unsafeWindow.GLatLng.fromUrlValue(bounds.getNorthEast().lat()+","+(bounds.getNorthEast().lng() - (bounds.getNorthEast().lng() - bounds.getSouthWest().lng())/2));
				
				var radius = Math.floor(topCenter.distanceFrom(center)) / 1000;

				showAutoTourDialog(center,radius);
				},false);
		addHoverEffects(autoTourDiv);

		var autoTourButton = createElement('img');
		autoTourButton.src=mapToAutoTour;


		append(autoTourButton,autoTourDiv);
		append(autoTourDiv,dojo.query('div[id="uxPremiumFeatures"]')[0]);

	}
	
	if(document.URL.search("sendtogps\.aspx")>=0) {
    	// show the GPX box, if the option is set
		if(GM_getValue('showGpx',false)){
			document.getElementById('dataString').parentNode.style.visibility = 'visible';
			document.getElementById('dataString').style.width = '100%';
		}


		// see, whether this windows is opened by the tour or by something else
		var qsParm = new Array();
		var query = window.location.search.substring(1);
		var parms = query.split('&');
		for (var i=0; i<parms.length; i++) {
			var pos = parms[i].indexOf('=');
			if (pos > 0) {
				var key = parms[i].substring(0,pos);
				var val = parms[i].substring(pos+1);
				qsParm[key] = val;
			}
		}


		if(qsParm['tour']){
			initGPXTour();
		} 	
	}
}
