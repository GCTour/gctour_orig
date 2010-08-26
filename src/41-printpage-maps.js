function getOverviewMap(geocaches, newwindow2, theElement){
		log('POST: http://gctour.madd.in/map/save.php - caches='+JSON.stringify(geocaches));
		//~ post('http://gctour.madd.in/map/save.php', 'caches='+uneval(geocaches).replace(/&/g,"\\u0026") ,
		//~ post('http://localhost/martin/map/save.php', 'tour='+JSON.stringify(geocaches).replace(/&/g," und "),
		post('http://gctour.madd.in/map/save.php', 'tour='+JSON.stringify(geocaches).replace(/&/g," und "),
						function(text){
							var mapId = text+ "#" + (new Date()).getTime();
							
							var cacheMapControl = document.createElement('div');
							cacheMapControl.className = 'noprint';
							//~ cacheMapControl.style.width = "20cm"; 
							cacheMapControl.style.border = '1px solid #EBEFC2';
							cacheMapControl.style.backgroundColor = '#FBFFCF';
							
							cacheMapControl.style.marginLeft = "auto" ;
							cacheMapControl.style.marginRight = "auto" ;
							
							cacheMapControl.style.marginBottom = "5px" ;
							cacheMapControl.style.paddingBottom = "5px" ;
							cacheMapControl.style.textAlign = "center" ;
			
							var divElement = document.createElement('div');cacheMapControl.appendChild(divElement);
							divElement.style.marginRight = '10px';
							divElement.style.display = "inline";			
							divElement.appendChild(document.createTextNode(	lang['printviewAdditionalWaypoint'] ));

							var divElement = document.createElement('div');cacheMapControl.appendChild(divElement);
							divElement.style.border = '1px solid lightgray';
							divElement.style.marginRight = '10px';
							divElement.style.display = "inline";										
							
							var inputElement = document.createElement('input');
							inputElement.id = 'mapMarker'+mapId;								
							inputElement.checked = 'checked';
							inputElement.type = 'checkbox';							
							inputElement.addEventListener('click',updateMap(newwindow2.document,mapId), false);
							divElement.appendChild(inputElement);
							divElement.appendChild(document.createTextNode(lang['settingsLogCountShow']));
							
							inputElement = document.createElement('input');
							inputElement.id = 'mapMarkerName'+mapId;								
							inputElement.checked = 'checked';
							inputElement.type = 'checkbox';							
							inputElement.addEventListener('click',updateMap(newwindow2.document,mapId), false);
							divElement.appendChild(inputElement);
							divElement.appendChild(document.createTextNode(	lang["markerCaption"]));
							
												
							
							divElement = document.createElement('div');cacheMapControl.appendChild(divElement);
							divElement.style.marginRight = '10px';
							divElement.style.display = "inline";							
							divElement.appendChild(document.createTextNode('Geocache:'));		
							
							 divElement = document.createElement('div');cacheMapControl.appendChild(divElement);
							divElement.style.border = '1px solid lightgray';
							divElement.style.marginRight = '10px';
							divElement.style.display = "inline";			
														
							inputElement = document.createElement('input');
							inputElement.id = 'mapName'+mapId;
							inputElement.type = 'checkbox';							
							inputElement.addEventListener('click',updateMap(newwindow2.document,mapId), false);
							
							divElement.appendChild(inputElement);
							divElement.appendChild(document.createTextNode(lang["markerCaption"]));
							
							inputElement = document.createElement('input');
							inputElement.id = 'mapGcId'+mapId;
							inputElement.type = 'checkbox';			
							inputElement.checked = 'checked';				
							inputElement.addEventListener('click',updateMap(newwindow2.document,mapId), false);
							
							divElement.appendChild(inputElement);
							divElement.appendChild(document.createTextNode('GC-Code'));
							
							// map size buttons
							divElement = document.createElement('div');cacheMapControl.appendChild(divElement);
							divElement.style.marginRight = '10px';
							divElement.style.display = "inline";							
							divElement.appendChild(document.createTextNode('Size:'));
													
								
							divElement = document.createElement('div');cacheMapControl.appendChild(divElement);
							divElement.style.border = '1px solid lightgray';
							divElement.style.marginRight = '10px';
							divElement.style.display = "inline";	
							
							
							var factor = 1;
							inputElement = document.createElement('input');divElement.appendChild(inputElement);
							inputElement.name = 'mapSize'+mapId;
							inputElement.type = 'radio';
							if(GM_getValue('defaultMapSize', 'large') == "large"){
								inputElement.checked = 'checked';
								factor = 1;
							}
							inputElement.addEventListener('click',updateMapSize(newwindow2.document,mapId,1), false);
							divElement.appendChild(document.createTextNode("large"));
							
							
							inputElement = document.createElement('input');divElement.appendChild(inputElement);
							inputElement.name = 'mapSize'+mapId;
							inputElement.type = 'radio';							
							if(GM_getValue('defaultMapSize', 'large') == "medium"){
								inputElement.checked = 'checked';
								factor = 0.75;
							}
							inputElement.addEventListener('click',updateMapSize(newwindow2.document,mapId,0.75), false);
							divElement.appendChild(document.createTextNode("medium"));
			
							
							inputElement = document.createElement('input');divElement.appendChild(inputElement);
							inputElement.name = 'mapSize'+mapId;
							inputElement.type = 'radio';							
							if(GM_getValue('defaultMapSize', 'large') == "small"){
								inputElement.checked = 'checked';
								factor = 0.5;
							}
							inputElement.addEventListener('click',updateMapSize(newwindow2.document,mapId,0.5), false);
							divElement.appendChild(document.createTextNode("small"));
			
							
							inputElement = document.createElement('input');divElement.appendChild(inputElement);
							inputElement.name = 'mapSize'+mapId;
							if(GM_getValue('defaultMapSize', 'large') ==  'very small'){
								inputElement.checked = 'checked';
								factor = 0.3;
							}
							inputElement.type = 'radio';							
							inputElement.addEventListener('click',updateMapSize(newwindow2.document,mapId,0.3), false);
							divElement.appendChild(document.createTextNode("very small"));
			
			
							
							// delete map button
							divElement = document.createElement('div');cacheMapControl.appendChild(divElement);
							divElement.style.border = '1px solid lightgray';
							divElement.style.marginRight = '10px';
							divElement.style.display = "inline";
							divElement.style.cursor = "pointer";
							divElement.addEventListener('click', function(){newwindow2.document.getElementById(mapId).style.display= "none"}, true);	
									
							addOpacityEffects(divElement); 
							
							
						    var deleteImage = document.createElement('img');
							deleteImage.style.cursor = 'pointer'; 
							deleteImage.src = deleteImageString;
							
						
							
			
							divElement.appendChild(deleteImage);
							divElement.appendChild(document.createTextNode(lang['printviewRemoveMap']));
							
							
							
							
							var cacheMap = document.createElement('iframe');
							cacheMap.className = 'cacheMap';
							//~ cacheMap.id = text;
						
							cacheMap.style.width = (factor * 20) + "cm"; 
							cacheMap.style.height = (factor * 500) + 'px';
							cacheMap.style.border = '1px solid lightgray';
							//~ cacheMap.src = "http://localhost/martin/map/show2.php?crc="+text+"&maptype="+GM_getValue('printOutlineMapType',"Karte");
							cacheMap.src = "http://gctour.madd.in/map/show2.php?crc="+text+"&maptype="+GM_getValue('printOutlineMapType',"Karte");
							
							
							var map = document.createElement('div');
							//~ map.id = 'mapDiv';
							map.id = mapId ;
							map.style.textAlign = 'center';
							map.style.marginLeft = 'auto';
							map.style.marginRight = 'auto';
							
			
			
							map.appendChild(cacheMapControl);
							map.appendChild(cacheMap);
							
							
							dojo.query("div[id='"+theElement+"']",newwindow2.document)[0].appendChild(map);					
						
							
						});
}

function updateMap(newDocument, mapId){
	return function(){
		
		var mapCrc = mapId.split('#')[0];
		
		var map = newDocument.getElementById(mapId).getElementsByTagName('iframe')[0];
		var nameInput = newDocument.getElementById('mapName'+mapId);
		var gcIdInput = newDocument.getElementById('mapGcId'+mapId);
		var markerInput = newDocument.getElementById('mapMarker'+mapId);
		var markerNameInput = newDocument.getElementById('mapMarkerName'+mapId);
		var mapURL = "http://gctour.madd.in/map/show2.php?crc="+mapCrc+"&name="+nameInput.checked+"&gcid="+gcIdInput.checked+"&marker="+markerInput.checked+"&markername="+markerNameInput.checked+"&maptype="+GM_getValue('printOutlineMapType',"Karte");
		map.src = mapURL;
	
		
	}
}
function updateMapSize(newDocument, mapId,factor){
	return function(){
		var map = newDocument.getElementById(mapId).getElementsByTagName('iframe')[0];
		map.style.width = (factor * 20) +"cm";
		map.style.height = (factor * 500) +"px";
	}
}
