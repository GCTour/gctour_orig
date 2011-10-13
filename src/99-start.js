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
		hash = 31*hash+character;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}

String.prototype.endsWith = function(str)
{return (this.match(str+"$")==str)}

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

// test for firefox >= 3.5
if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){ //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
 var ffversion=new Number(RegExp.$1) // capture x.x portion and store as a number
 if (ffversion < 3.5){
    alert("Sorry, but you are running 'Firefox "+ffversion+"' which is not supported anymore.\nPlease update to 'Firefox 3.5' or above to use GCTour!");
 }
}
