/*
* set jquery and ui
*/

(function () {

  var str = "";
  str += "jQuery und UI geladen = " + isjQuery;
	if (isjQuery) {
    str += "\n\tjQuery Version    = " + $.fn.jquery;
    str += "\n\tjQueryUI Version  = " + $.ui.version;
	}

//  str += "\n\tisunsafeWindow.jQuery = " + isjQueryWindow;
//  str += "\n\tunsafeWindow.jQuery Version = " + ((isjQueryWindow) ? unsafeWindow.jQuery.fn.jquery : "");

  str += "\n\tBrowser Opera ?   = " + isOpera;
//  str += "\n\tBrowser Mozilla ? = " + $.browser.mozilla;

  debug(str);
//  alert(str);

})();
