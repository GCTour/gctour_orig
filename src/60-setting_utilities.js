function setLanguage(i){
	return function(){
		GM_setValue('language',i);
		window.location.reload();
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
