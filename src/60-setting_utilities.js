function setLanguage(i){
	return function(){
		GM_setValue('language',i);
		window.location.reload();
	}
}

function setGPXSchema(value){
	return function(){
		GM_setValue('gpxschema',value);
	}
}

function toggleBoolValue(valueName, defaultValue){
	return function(){
		GM_setValue(valueName, !GM_getValue(valueName, defaultValue));
	}
}


function  setPrintFontSize(fontSize){
	return function(){
		GM_setValue('printFontSize',fontSize);
	}
}

function  setPrintMapType(mapType){
	return function(){
		GM_setValue('printOutlineMapType',mapType);
	}
}

function  setPrintMapSize(mapSize){
	return function(){
		GM_setValue('defaultMapSize',mapSize);
	}
}

