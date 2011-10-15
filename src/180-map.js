function gctourMapFunction(){
	// check if completly loaded
	if (unsafeWindow.isLoaded === false)
        return;

	
	unsafeWindow.clearCacheTable();

    //we need to iterate throught the marker collection and determine if the marker is in the current viewport.
    // we can do with this with a gbounds 
    var cnt = 0;
    var gb = unsafeWindow.map.getBounds();
    //var sbList = document.getElementById('sidebar-list');
    for (var i = 0, l = unsafeWindow.mrks.length; i < l; i++) {
        //don't bother if the marker is hidden.
        var cacheInfo = unsafeWindow.getMarker(i);
        if (gb.containsLatLng(cacheInfo.getLatLng())) {
            if (cacheInfo.isHidden() == false) {
                cnt++;
                unsafeWindow.addCacheTableRow(cacheInfo);
                extendCacheTableRow(cacheInfo);
            }
        }
    }
//    unsafeWindow.$('spanCacheCount').update(cnt);
	unsafeWindow.setMapLabelDisplay(dojo.byId('chkShowNumbers').checked);	
	
    //With opera GCTour breaks the GCVote script (no stars on the map) -> let us fix this!
    if(isOpera)
    {
	//For GCVote Map-Compatibility 
	var cb=document.getElementById("autoupdatemapinput");	
	if(cb)
	{
		if(cb.checked) {
			var input=document.getElementById("hiddenTriggerInput");
			var event=document.createEvent("MouseEvents");
			event.initEvent("click", true, false);
			input.dispatchEvent(event);
		}
	}
    }
}

function extendCacheTableRow(info){
	
	var row = dojo.byId('ctRow'+info.mrkrIndex);
	var tds =  dojo.query('td',row);
	var lastTd = tds[2];
	
	
	var addToTourButton = document.createElement('img');
		addToTourButton.src = addToTourImageString;
		addToTourButton.style.cursor = 'pointer';
		addToTourButton.style.cssFloat = 'right';
		addToTourButton.addEventListener('click',addCacheToTourFromMap('http://www.geocaching.com/seek/cache_details.aspx?wp='+info.waypointId),false);											
		addToTourButton.title = lang['addToTour'];
		addHoverEffects(addToTourButton);
	
	lastTd.insertBefore(addToTourButton,lastTd.firstChild);
	
	//append(addToTourButton,lastTd);
}


function gctourBuildCDPage(id) {
    unsafeWindow.dlgStatusBar.status("Requesting Cache Description...");
    var b = { c: 2, m: '', d: '' + id + '' };
    //eo_Callback('cbAjax', Object.toJSON(b));

	unsafeWindow.jQuery.pageMethod("MapAction", JSON.stringify({ dto: { data: b, ut: unsafeWindow.userToken} }), function (r) {
		var r = JSON.parse(r.d);
		
		var jsonData = r; //.evalJSON();

		if (jsonData.cs.pm) { pm = jsonData.cs.pm; }
		if (jsonData.cs.li) { li = jsonData.cs.li; }
	
		unsafeWindow.dlgStatusBar.status("Parsing Cache Description...");
		var cdr_template = '<div id="gmCacheInfo"><div id="box"><div class="title"><img src="../images/WptTypes/sm/#{ci}.gif" align="absmiddle"/>&nbsp;<a href="#{curl}" target="_blank">' + ((jsonData.cs.ia == false) ? '<strike>' : '') + '#{cn}' + ((jsonData.cs.ia == false) ? '</strike>' : '') + '</a></div><div class="code">#{cgc}</div><div id="mapAddButton" style="float:right"></div><div class="createdby"><b>Created by:</b> <a href="#{cburl}" target="_blank">#{cb}</a></div><div class="left"><b>Difficulty:</b> #{d}</div><div class="right"><b>Terrain:</b> #{t}</div><div class="left"><b>Date Hidden:</b> #{dh}</div><div class="right"><b>Cache Size:</b> #{cz}</div></div>';
		
		if (jsonData.cs.tc > 1) {
				cdr_template += '<div style="clear:both;width: 350px;"><b style="float:left">Trackables:</b>'
				var tb_template = '<a style="float:left" href="../track/details.aspx?guid=#{tbg}" class="lnk" target="_blank"><img src="#{tbi}" alt="#{tbn}" title="#{tbn}" border="0" height="16" width="16" /></a>';
				for(var tb_i = 0; tb_i < jsonData.cs.tbs.length; tb_i++){
					cdr_template += evaluateTemplate(jsonData.cs.tbs[tb_i],tb_template);
				}				
				cdr_template +='</div>';
		}
				
		if (li === true) {
			cdr_template += '<div class="links"><a href="../bookmarks/mark.aspx?guid=#{cg}&WptTypeID=#{ci}" target="_blank" class="lnk"><img src="../images/silk/book_add.png" align="absmiddle" border="0"> <span>Bookmark It</span></a> | <a href="javascript:void(0);" onclick="send2gps(\'#{cg}\');return false;" class="lnk"><img src="../images/sendtogps/sendtogps_icon.png" align="absmiddle" border="0"> <span>Send to GPS</span></a> | <a href="../seek/log.aspx?guid=#{cg}" target="_blank" class="lnk"><img src="../images/silk/comment_add.png" align="absmiddle" border="0"> <span>Log Visit</span></a></div>';
		}
		
		var detailsHtml = dojo._toDom(evaluateTemplate(jsonData.cs,cdr_template));
	

	
		var addToTourLink = document.createElement('a');
		addToTourLink.style.cursor = 'pointer';
		addToTourLink.style.cssFloat = 'right';
		
		var addToTourButton = document.createElement('img');
		addToTourButton.src = addToTourImageString;
		addToTourButton.title = lang['addToTour'];
		append(addToTourButton,addToTourLink);
		
		addToTourLink.innerHTML = addToTourLink.innerHTML +"&nbsp;<span style='text-decoration:underline'>"+ lang['addToTour']+"</span>";
		addToTourLink.addEventListener('click', addElementFunction(jsonData.cs.cgc,jsonData.cs.cg,jsonData.cs.cn,jsonData.cs.ci+".gif"), false);
		append(addToTourLink,dojo.query("div[id='mapAddButton']",detailsHtml)[0]);
		
	
		unsafeWindow.mrker.openInfoWindowHtml(detailsHtml);
		unsafeWindow.dlgStatusBar.hide();
	

    });  
    

}

function evaluateTemplate(obj,template){
	for (i in obj) {
		template = template.replace(new RegExp("#{"+i+"}","g"),obj[i]);
	}
	
	return template;
}


// not USED!!!:
// hijack the parse method to mmanipulate the coordinates
function gctourParseCacheJSON(jsonData){
	setTimeout(function() {
		// move the marker on the map which have changed coordinates
		for (var i = 0, l = jsonData.cc.length; i < l; i++) {
			geocache = jsonData.cc[i];
			if(GM_getValue('coords_'+geocache.gc,"null") != "null"){ // only change coordinates from known marker
				var coordinates = GM_getValue('coords_'+geocache.gc,"null");
				geocache.lat = coordinates.split("#")[0];
				geocache.lon = coordinates.split("#")[1];	
				geocache.nn = geocache.nn + "(moved)";	
			}
		}
			
		return unsafeWindow.origParseCacheJSON(jsonData);
	},0);
}

// not USED!!!:
function gctourCreateMarker(geocache){

		/*
		if(GM_getValue('coords_'+geocache.waypointId,"null") != "null"){ // only change coordinates from known marker
					var coordinates = GM_getValue('coords_'+geocache.waypointId,"null");
					geocache.lat = coordinates.split("#")[0];
					geocache.lon = coordinates.split("#")[1];	
				}*/
				
		
		var marker = unsafeWindow.origCreateMarker(geocache);
		if (marker.waypointTitle.indexOf("(moved)") > 0){
			// not working :(
			marker.setImage(unsafeWindow.getIcon(geocache.wptTypeId, geocache.found, true, geocache.isAvailable));

		}
		
		
		//dumpProps(marker);
		
		return marker;
	
}

