function printPageFunction(){
	return function(){
		if(!userName){
			alert(lang['notLogedIn']);
		} else if( currentTour.geocaches.length == 0) {
			alert(lang['emptyList']);
		} else {		
			
			var minimal = GM_getValue('printMinimal',false);
			
			var cacheDetailTemplate = 
				'<div class="cacheDetail" id="###GUID###">'+
				'	<div class="geocache_count ###HIDDENSTYLE###"><span>###CACHECOUNT###</span></div>'+
				'	<div class="geocache_id">###GCID###</div>'+
				'	<div>'+
				'		<img src="http://www.geocaching.com/images/WptTypes/sm/###TYPE###.gif">'+
				'		<span style="font-weight: bold;">###CACHENAME###</span>'+
				'		<span style="margin-right: 3px;"> (###OWNER### - ###HIDDEN###)</span>'+
				'	</div>'+
				'	<div class="details">'+
				'		<span>###COORDINATES###</span>'+
				'		<span><img src="http://www.geocaching.com/images/icons/compass/###BEARING###.gif"/>###DISTANCE###&nbsp;</span>'+
				'		<span>D:<img src="http://www.geocaching.com/images/stars/stars###DIFFICULTY###.gif"/></span>'+
				'		<span>T:<img src="http://www.geocaching.com/images/stars/stars###TERRAIN###.gif"/></span>'+
				'		<span>S:<img src="http://www.geocaching.com/images/icons/container/###SIZE###.gif"/></span>'+
				'	</div>'+
				'	<div>'+
				'		<span>###ATTRIBUTES###</span>'+
				'		<span><img alt="Inventory" src="http://www.geocaching.com/images/WptTypes/sm/tb_coin.gif"/>Inventory:</span>'+
				'		<span>###INVENTORY###</span>'+
				'	</div>'+
				'	<div class="content">'+
				'		<div class="short ###HIDDENSTYLE###">###SHORT_DESCRIPTION###</div>'+
				'		<div class="long ###HIDDENSTYLE###">###LONG_DESCRIPTION###</div>'+
				'		<div><b>Hint:</b>###HINT###</div>'+
				'		<div class="waypoints ###HIDDENSTYLE###">###ADDITIONAL_WAYPOINTS###</div>'+
				'		<div class="images">###IMAGES###</div>'+
				'		<div id = "###MAPID###" class="map ###HIDDENSTYLE###">###MAP###</div>'+
				'		<div class="removable ###HIDDENSTYLE###">###LOGCOUNTER###</div>'+
				'		<div class="logs ###HIDDENSTYLE###">###LOGS###</div>'+
				'		<div style="clear:both">&nbsp;</span>'+
				'	</div>'+
				'</div>';
			var ownMarkerTemplate = 
				'<div class="cacheDetail">'+
				'	<div class="geocache_count ###HIDDENSTYLE###" style="padding:5px !important"><span>###CACHECOUNT###</span></div>'+
				'	<div class="wpt_id">###GCID###</div>'+
				'	<div>'+
				'		<img src="###TYPE###">'+
				'		<span style="font-weight: bold;">###NAME###</span><br/>'+
				'		<span>###COORDINATES###</span>'+
				'	</div>'+
				'	<div>'+
				'		<div class="long">###CONTENT###</div>'+
				'	</div>'+
				'</div>';
			
				
			var costumMarker = (typeof(currentTour.geocaches[0].lat) != "undefined");
			if(!costumMarker){		
				var newwindow2=window.open('http://www.geocaching.com/seek/cdpf.aspx?guid='+currentTour.geocaches[0].guid,'printview','fullscreen,scrollbars=yes,toolbar=yes,menubar=yes');
			} else {
				var newwindow2=window.open('http://www.geocaching.com/seek/cdpf.aspx?guid=39eedff9-69ea-4a18-97b0-bde6bfbccfb7','printview','fullscreen,scrollbars=yes,toolbar=yes,menubar=yes');
			}
			
	
			// trick to wait until the page from gc-com is loaded, to prevent tour detection
			newwindow2.window.addEventListener ("DOMContentLoaded", function() {
				try {
					var body = newwindow2.document.getElementsByTagName('body')[0];	
					
					
					// set the title of the print view
					var now = new Date();
					var Jahresmonat = now.getMonth();
					var Monat = lang['months']
					var Std = now.getHours();
					var Min = now.getMinutes();
					var StdAusgabe = ((Std < 10) ? "0" + Std : Std);
					var MinAusgabe = ((Min < 10) ? "0" + Min : Min);
					newwindow2.document.title = currentTour.name +' - '+ now.getDate()+'.'+(Jahresmonat+1)+'.'+now.getFullYear()+' '+StdAusgabe+':'+MinAusgabe +" - "+lang['prinviewTitle'];
					
					
					body.innerHTML = '';
					addOverlay(newwindow2.document,lang['pleaseWait']);
					
					
					var head = newwindow2.document.getElementsByTagName('head')[0];    
					var style = document.createElement('style');
					style.type = 'text/css';
					//~ style.innerHTML = 'font {font-size:x-small !important}  td {font-size:x-small !important} span {font-size:x-small !important}'+
									  //~ 'div {font-size:x-small !important} p {font-size:x-small !important}';
					//~ style.innerHTML = 'font,td,th,span,div, p {font-size:'+GM_getValue("printFontSize","x-small")+'!important} ';
					style.innerHTML = '*{ font-size:'+GM_getValue("printFontSize","x-small")+' } .cacheDetail{ border: 1px solid lightgray; width: 100%; text-align: left;} .cacheDetail div{ padding-left:5px; } .wpt_id{ position:relative; padding:5px !important; float:right;  font-size:medium; font-weight:bold; } .geocache_id{ position:relative; padding:20px !important; float:right;  font-size:medium; font-weight:bold; }  .content{ clear:both; border-top:2px dashed lightgray; margin-top:10px; padding-top:10px; }  img{ vertical-align:middle; }  #details span{ margin-left: 10px } .images{clear:both;height:auto}';
					style.innerHTML += '.removable{margin:2px;} .map{clear:both} .logs{clear:both} .logs div{margin:2px} .hidden{display:none} .highlight{background-color:pink}';
					style.innerHTML += '.geocache_count{ position:relative; padding:20px !important; float:right;  font-size:medium; font-weight:bold; } .geocache_count span{padding: 5px; font-weight: bold; font-size: 18px; -moz-border-radius: 5px;border:2px dotted black;}';
					
					
					
					head.appendChild(style); 

					style = document.createElement('style');
					style.media = 'print';
					style.type = 'text/css';
					//hide the map control in print
					style.innerHTML = '.noprint   { display: none; } body {margin: 0;padding: 0;color: black;background: transparent;}';

					head.appendChild(style); 

					var printInfo = document.createElement('div');
					printInfo.className = 'noprint';
					//~ cacheMapControl.style.width = "20cm"; 
					printInfo.style.border = '1px solid #EBEFC2';
					printInfo.style.backgroundColor = '#FBFFCF';
					printInfo.style.textAlign = 'left';
					printInfo.innerHTML = lang["dontPrintHint"];
					
					body.appendChild(printInfo);

					// front page				
					if(GM_getValue('printFrontpage',true) && !minimal){
						var title = document.createElement('div');
						title.id = 'printTitle';
						title.style.width = "100%"; 
						title.style.textAlign = 'left';
						//~ title.style.marginLeft = 'auto';
						//~ title.style.marginRight = 'auto';
						title.innerHTML = "<h1>"+currentTour.name+"</h1>";					
						if (GM_getValue('printPageBreakAfterMap', true)) {
							title.style.pageBreakAfter = 'always';
						} else {
							title.style.pageBreakAfter = 'never';
						}
						body.appendChild(title);
						
						var coverTable = document.createElement('table');					
						coverTable.style.width = "100%"; 
						coverTable.style.textAlign = 'left';
						//~ coverTable.style.marginLeft = 'auto';
						//~ coverTable.style.marginRight = 'auto';
						coverTable.style.border = '1px solid lightgray';
						
						coverTable.innerHTML = 
							'<tr>		 			'+
							'	<td colspan="3" style="border-bottom-color:lightgray;border-bottom-style:dashed;border-bottom-width:1px"><b>'+lang['printviewCache']+'</b></td>		'+
							'	<td style="border-bottom-color:lightgray;border-bottom-style:dashed;border-bottom-width:1px"><b>'+lang['printviewFound']+'</b></td>		'+
							'	<td style="border-bottom-color:lightgray;border-bottom-style:dashed;border-bottom-width:1px"><b>'+lang['printviewNote']+'</b></td>		'+
							'</tr>';
							
						var isCostumMarker = false;	
						for (var i = 0; i < currentTour.geocaches.length; ++i){
							var costumMarker = (typeof(currentTour.geocaches[i].lat) != "undefined");
						
							if(!costumMarker){
								
								var tr = document.createElement('tr');coverTable.appendChild(tr);
								var td = document.createElement('td');tr.appendChild(td);
								td.innerHTML = "<b>"+(i+1)+"</b>";
								
					
								td = document.createElement('td');tr.appendChild(td);
								td.innerHTML = "<img src='"+currentTour.geocaches[i].image+"'>";
								
								td = document.createElement('td');tr.appendChild(td);
								td.style.verticalAlign = "middle";
								td.style.width = "30%";					
								td.style.borderBottomColor = 'lightgray';
								td.style.borderBottomStyle = 'dashed';
								td.style.borderBottomWidth = '1px';
								td.innerHTML = "<a style='color:#000000;text-decoration: none' href='http://www.geocaching.com/seek/cache_details.aspx?guid="+currentTour.geocaches[i].guid+"'>"+currentTour.geocaches[i].name + "<font style='font-size:xx-small'>(" + currentTour.geocaches[i].id + ")</font></a>";
								
								td = document.createElement('td');tr.appendChild(td);
								td.style.verticalAlign = "middle";				
								//~ td.style.border = '1px solid lightgray';
								td.innerHTML = "<div style='margin-left:auto;margin-right:auto;width:10px;height:10px;border:1px solid lightgray;'>&nbsp;</div>";
								
								td = document.createElement('td');tr.appendChild(td);
								td.style.verticalAlign = "middle";
								td.style.width = "70%";					
								td.innerHTML = "&nbsp;";
								td.style.borderBottomColor = 'lightgray';
								td.style.borderBottomStyle = 'dashed';
								td.style.borderBottomWidth = '1px';
							} else {
								isCostumMarker = costumMarker;
							}
						}
						
						if(isCostumMarker){
							coverTable.innerHTML += 
							'<tr>		 			'+
							'	<td colspan=3 style="border-bottom-color:lightgray;border-bottom-style:dashed;border-bottom-width:1px"><b>'+lang['printviewMarker']+'</b></td>		'+
							'	<td colspan=3 style="border-bottom-color:lightgray;border-bottom-style:dashed;border-bottom-width:1px"><b>'+lang['printviewNote']+'</b></td>		'+
							'</tr>';
							
							for (var i = 0; i < currentTour.geocaches.length; ++i){
								var costumMarker = (typeof(currentTour.geocaches[i].lat) != "undefined");
							
								if(costumMarker){
									var tr = document.createElement('tr');coverTable.appendChild(tr);
									var td = document.createElement('td');tr.appendChild(td);
									
									td.innerHTML = "<b>"+(i+1)+"</b>";
									
									td = document.createElement('td');tr.appendChild(td);
									td.innerHTML = "<img src='"+currentTour.geocaches[i].image+"'>";
									
									
									td = document.createElement('td');tr.appendChild(td);
									td.style.verticalAlign = "middle";
									td.style.width = "30%";				
									td.colSpan = "3";	
									td.style.borderBottomColor = 'lightgray';
									td.style.borderBottomStyle = 'dashed';
									td.style.borderBottomWidth = '1px';
									td.innerHTML = currentTour.geocaches[i].name;
									
									var latArray = Dec2DM(currentTour.geocaches[i].lat);
									var lonArray = Dec2DM(currentTour.geocaches[i].lon);
									td.innerHTML += "&nbsp;-&nbsp;&nbsp;"+latArray[0]+ "° " +latArray[1] ;
									td.innerHTML += "&nbsp;/&nbsp;"+lonArray[0]+ "° " +lonArray[1];
									
								} 
							}
							
						}
							

						title.appendChild(coverTable);		
						
						
						
						var overview_map = createElement('div',{id:"overview_map"});
						title.appendChild(overview_map);
					}
					
					
					
					var geocaches = new Array();
					
	
					for (var i = 0; i < currentTour.geocaches.length; ++i){
						if(GM_getValue("stopTask",false) && i != 0){
							GM_setValue("stopTask",false);
							newwindow2.close();
						} else if (GM_getValue("stopTask",false) && i == 0 ) {
							GM_setValue("stopTask",false);
						}
						var costumMarker = (typeof(currentTour.geocaches[i].lat) != "undefined");
						
						if(!costumMarker){
							var geocache = getGeocache(currentTour.geocaches[i].id);
							
						
							//log
							var logs_div = createElement('div');
							
							
							var logs = geocache.logs;															
							var maxPrintLogs = parseInt(GM_getValue('maxPrintLogs',0));
							// if maxprintlogs is <= -1, export all logs to the print overview
							if(maxPrintLogs <= -1)
								maxPrintLogs = logs.length;
							maxPrintLogs = maxPrintLogs;
							for (var log_i = 0; (log_i < logs.length && (log_i < maxPrintLogs)); log_i++){
								var log_div = createElement('div', {style:"width:95%;page-break-inside:avoid;"});
								log_div.setAttribute("class", "removable");
								log_div.innerHTML = logs[log_i].from.replace(/href=".*?"/,"")+"<br>";
								log_div.innerHTML += logs[log_i].text;
								append(log_div, logs_div);
							}
							
													
							var dummy_additional_waypoints = createElement('div');
							if (GM_getValue('printAdditionalWaypoints',true)){								
								var wpts_table = createElement('table', {style:"width:100%;border-collapse:separate;"} );append(wpts_table,dummy_additional_waypoints);
								wpts_table.setAttribute("class", "removable");
								var content = "<tr>";
								for(var waypoints_i = 0; waypoints_i < geocache.additional_waypoints.length; waypoints_i++){
									
								if(waypoints_i % 2 == 0 || waypoints_i == geocache.additional_waypoints.length-1){
										if(waypoints_i != 0 && waypoints_i != 1){
											content += "</tr>";
										}
										if(waypoints_i == geocache.additional_waypoints.length-1 && waypoints_i != 1){
											content += "<tr>";
										}
									}
									content += "<td style='width:50%;'>";
									content +="<img src='"+geocache.additional_waypoints[waypoints_i].symbol+"'>";
									content +="<b>"+geocache.additional_waypoints[waypoints_i].name+"</b>";
									content +=" | "+geocache.additional_waypoints[waypoints_i].coordinates + "<br>";
									content += "<i>"+geocache.additional_waypoints[waypoints_i].note + "</i><br>";	
								}
								content += "</tr>";
								
								wpts_table.innerHTML = content;
							}
							
							//images							
							var dummy_images = createElement('div');
							if (GM_getValue('printSpoilerImages',true)){
								var image_table = createElement('table',{style:"border-collapse:seperate;border-spacing:2px;width:100%"});append(image_table,dummy_images);
								var content = "<tr>";
								for(var images_i = 0; images_i < geocache.images.length; images_i++){
									if(images_i % 2 == 0 || images_i == geocache.images.length-1){
										if(images_i != 0 && images_i != 1){
											content += "</tr>";
										}
										if(images_i == geocache.images.length-1 && images_i != 1){
											content += "<tr>";
										}
									}
									
									content += "<td class='removable'>";
									content += "<img style='max-width:8cm;' src='"+geocache.images[images_i].href+"'><br>";
									content += "<b>"+geocache.images[images_i].textContent+"</b>";
									content += "</td>";
								}
								content += "</tr>";
								image_table.innerHTML = content;
							}
					
							
							// inventory
							var inventory = createElement('span');
							for (var inventory_i = 0; inventory_i < geocache.inventory.length; inventory_i++){
								var image = createElement('img');
								image.src = geocache.inventory[inventory_i].src;
								append(image,inventory);
							}
							if(geocache.inventory.length == 0){
								var empty_inventory = createElement('span');
								empty_inventory.innerHTML = "empty";							
								append(empty_inventory,inventory);
							}
							
							
							//attributes
							var attributes = createElement('span');
							for (var attributes_i = 0; attributes_i < geocache.attributes.length; attributes_i++){
								var attribute = geocache.attributes[attributes_i];
								attribute.style.width = "16px";
								attribute.style.height = "16px";
								attribute.style.marginRight = "3px";
								attribute.style.opacity = "0.5";
								if(attribute.src != "http://www.geocaching.com/images/attributes/attribute-blank.gif")
									append(attribute, attributes);
							}
								
							
							var geocacheArray = new Array();
							var mapCache = new Object();
							mapCache.gcid = geocache.gcid;
							mapCache.type = geocache.type;
							mapCache.name = geocache.name;
							mapCache.latitude = geocache.lat;
							mapCache.longitude = geocache.lon;
							mapCache.additional_waypoints = geocache.additional_waypoints;
							for(var waypoint_i = 0 ; waypoint_i < mapCache.additional_waypoints.length; waypoint_i++){
								mapCache.additional_waypoints[waypoint_i].note = "";
							}
							
							geocacheArray.push(mapCache);
							geocaches.push(mapCache);
							
							
							var map_element_dummy = createElement('div');
							var map_element = createElement('div');append(map_element, map_element_dummy);
							
							if (GM_getValue('printOutlineMapSingle',true) && !minimal){	
								getOverviewMap(geocacheArray,newwindow2, "MAP_"+geocache.gcid);
							}
							
												
							var latArray = Dec2DM(geocache.latitude);
							var lonArray = Dec2DM(currentTour.geocaches[i].lon);					
							
							
						var geocacheMapping = new Array(
							new Array('GCID',geocache.gcid),
							new Array('CACHECOUNT',i+1),
							new Array('GUID',geocache.guid),
							new Array('TYPE',geocache.type),
							new Array('CACHENAME',geocache.name),
							new Array('OWNER',geocache.owner),
							new Array('HIDDEN',geocache.hidden),
							new Array('ATTRIBUTES',attributes.innerHTML),
							new Array('BEARING',geocache.bearing),
							new Array('DISTANCE',geocache.distance),
							new Array('INVENTORY',inventory.innerHTML),
							new Array('COORDINATES',geocache.coordinates),
							new Array('DIFFICULTY',geocache.difficulty.replace(/\./,"_")),
							new Array('TERRAIN',geocache.terrain.replace(/\./,"_")),
							new Array('SIZE',geocache.size.toLowerCase()),
							new Array('SHORT_DESCRIPTION',(geocache.short_description)?geocache.short_description.innerHTML:""),
							new Array('LONG_DESCRIPTION',(geocache.long_description)?geocache.long_description.innerHTML:""),
							new Array('HINT',(GM_getValue('decryptPrintHints',true))?geocache.hint:convertROTStringWithBrackets(geocache.hint)),
							new Array('ADDITIONAL_WAYPOINTS',dummy_additional_waypoints.innerHTML),
							new Array('IMAGES',dummy_images.innerHTML),
							new Array('MAP', map_element_dummy.innerHTML),
							new Array('MAPID', "MAP_"+geocache.gcid),
							new Array('LOGCOUNTER',(GM_getValue('printLoggedVisits',false))?geocache.find_counts.innerHTML:""),
							new Array('LOGS',logs_div.innerHTML)
						);
							
						if(minimal){
							geocacheMapping.push(new Array('HIDDENSTYLE',"hidden"));
						} else {
							geocacheMapping.push(new Array('HIDDENSTYLE',""));
						}
						
						var cacheDetailTemp = fillTemplate(geocacheMapping,cacheDetailTemplate);
												
						dojo.query("*[class='removable']",cacheDetailTemp).onclick(function(e){e.stopPropagation();dojo.destroy(this); }).onmouseover(function(e){ this.style.opacity="0.5";this.style.cursor = "url('"+deleteImageString+"'),pointer";}).onmouseout(function(e){ this.style.opacity="1";});
						
						// remove images in description
						
						dojo.query("img",dojo.query("div[class*='long']",cacheDetailTemp)[0]).onclick(function(e){e.stopPropagation();dojo.destroy(this); }).onmouseover(function(e){ this.style.opacity="0.5";this.style.cursor = "url('"+deleteImageString+"'),pointer";}).onmouseout(function(e){ this.style.opacity="1";});
						dojo.query("a",dojo.query("div[class*='long']",cacheDetailTemp)[0]).forEach(function(node, index, nodeList){
							node.removeAttribute("href");
						});
						
						
						if(GM_getValue('printEditMode',false)){
							dojo.query("div[class*='long']",cacheDetailTemp)[0].contentEditable = "true";
							dojo.query("div[class*='short']",cacheDetailTemp)[0].contentEditable = "true";
							
						}
						
						if(GM_getValue('printPageBreak',false)){
							if(i < currentTour.geocaches.length-1)
								cacheDetailTemp.style.pageBreakAfter = 'always';
						}
						
						
						
						body.appendChild(cacheDetailTemp);
						body.appendChild(document.createElement('br'));
					
							
						} else {
									
									
							var latArray = Dec2DM(currentTour.geocaches[i].lat);
							var lonArray = Dec2DM(currentTour.geocaches[i].lon);
								
										
							var markerMapping = new Array(
								new Array('GCID',lang["printviewMarker"]),
								new Array('CACHECOUNT',(i+1)),
								new Array('TYPE',currentTour.geocaches[i].image),
								new Array('NAME',currentTour.geocaches[i].name),
								new Array('COORDINATES',latArray[0]+ "°&nbsp;"+ latArray[1] + "&nbsp;&nbsp;" + lonArray[0]+ "°&nbsp;"+ lonArray[1]),
								new Array('CONTENT',currentTour.geocaches[i].content.replace(/\n/g, "<br />"))
							);
							if(minimal){
								markerMapping.push(new Array('HIDDENSTYLE',"hidden"));
							} else {
								markerMapping.push(new Array('HIDDENSTYLE',""));
							}								
										
							var cacheDetailTemp = fillTemplate(markerMapping,ownMarkerTemplate);							
							body.appendChild(cacheDetailTemp);
							body.appendChild(document.createElement('br'));
							
							geocaches.push(currentTour.geocaches[i]);
						}
						
						// set the progress
						setProgress(i,currentTour.geocaches.length,newwindow2.document);
					

						//~ // in the end - remove the overlay
						//~ if(i == currentTour.geocaches.length -1)
									
					}
					
					if(GM_getValue('printOutlineMap',true) && !minimal){	
						var anotherelement = document.createElement("div");
						
						if(GM_getValue('printFrontpage',true)){
							
							getOverviewMap(geocaches,newwindow2,"overview_map");
							var titlepage = newwindow2.document.getElementById('printTitle');
							insertAfter(titlepage.lastChild, document.createElement('br'));
							insertAfter(titlepage.lastChild, anotherelement);
						} else { 
							getOverviewMap(geocaches,newwindow2,"overview_map");
							body.appendChild(anotherelement);
						}								
				
					}
					
					

					
					removeOverlay(newwindow2.document);	
				
				} catch (e) {
					addErrorDialog(e,"PRINT ERROR",newwindow2.document); 
				}
				
			}
			, false);	
			
			
			
		}


	}


}
