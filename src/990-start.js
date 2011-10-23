// usefull snippet to escape HTML
/*  String.prototype.escapeHTML = function() {
    return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }*/

// setting hashcode to all strings
String.prototype.hashCode = function(){
	var hash = 0;
	if (this.length == 0) return code;
	for (i = 0; i < this.length; i++) {
		character = this.charCodeAt(i);
		hash = 31 * hash + character;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}

String.prototype.endsWith = function(str){
	return (this.match(str+"$")==str);
}

// Convert HTML breaks to spaces
String.prototype.br2space = function() {
	return this.replace(/<br\s*\/?>/mg," ");
};

// Return a new string without leading and trailing whitespace
// Double spaces whithin the string are removed as well
String.prototype.trimAll = function() {
	return this.replace(/^\s+|(\s+(?!\S))/mg,"");
};




(function () {

	// test for firefox >= 3.5
	if ($.browser.mozilla) {
		var splitVersion = $.browser.version.split('.');
		var majorNumber = parseInt(((splitVersion[0]) ? splitVersion[0] : 0), 10);
		var minorNumber = parseInt(((splitVersion[1]) ? splitVersion[1] : 0), 10);

		if ( !((majorNumber > 3) || (majorNumber === 3 && minorNumber >= 5)) ) {
			alert("Sorry, but you are running 'Firefox " + $.browser.version  + 
				"' which is not supported anymore.\nPlease update to 'Firefox 3.5' or above to use GCTour!");
		}
	}

	// init the whole script - started with dojo
	initDojo();

	if(isOpera){
		//wait until document is loaded and init the core components (first tour, current tour)
		window.addEventListener('DOMContentLoaded',function(){		
			initCore();
		},true);
	}
	else
	{
		// init the core components (first tour, current tour)
		initCore();	
	}

	//Opera has an autoupdate function
	if(!isOpera){
		// check for updates
		update();
	}

})();