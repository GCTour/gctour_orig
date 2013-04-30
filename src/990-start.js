// usefull snippet to escape HTML
/*  String.prototype.escapeHTML = function() {
    return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
*/

// setting hashcode to all strings
/*
String.prototype.hashCode = function(){
  var hash = 0;
  if (this.length === 0) { return code; }
  for (i = 0; i < this.length; i++) {
    character = this.charCodeAt(i);
    hash = 31 * hash + character;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};
*/
// ToDo: ohne Verwendung ???
String.prototype.hashCode = function() {
  for(var ret = 0, i = 0, len = this.length; i < len; i++) {
    ret = (31 * ret + this.charCodeAt(i)) << 0;
  }
  return ret;
};

String.prototype.endsWith = function(str){
  return (this.match(str+"$")==str);
};

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

  // test for gecko-version >= 1.9.2 (firefox >= 3.6)
  // http://docs.jquery.com/Browser_compatibility#About_Browser_Compatibility
  // http://de.wikipedia.org/wiki/Firefox#Wichtige_Versionen (Gecko Version)
  if ($.browser.mozilla) {
    var arrV = $.browser.version.split('.'),
      majorN = parseInt(((arrV[0]) ? arrV[0] : 0), 10),
      minorN = parseInt(((arrV[1]) ? arrV[1] : 0), 10),
      buildN = parseInt(((arrV[2]) ? arrV[2] : 0), 10);

    if (!( (majorN >= 2) ||  // >= FF 4
      (majorN === 1 && minorN === 9 && buildN === 2) // = FF 3.6.xx
    )) {
      alert("Sorry, but you are running 'Firefox " + $.browser.version  +
        "' which is not supported anymore.\nPlease update to 'Firefox 3.6' or above to use GCTour!");
    }
    //else { alert("okay: " + $.browser.version); }
  }

  if (isOpera) {
    // wait until document is loaded and init the core components (first tour, current tour)
    window.addEventListener('DOMContentLoaded', function(){
      initCore();
      init();
    }, true);
  } else {
    // init the core components (first tour, current tour)
    initCore();
    init();
  }

  //Opera has an autoupdate function
  if (!isOpera) {
    // check for updates
    update();
  }

})();

