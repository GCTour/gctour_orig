// helpers

// for map page
// googleMap center and radius: return object center and radius
var getMapCenterAndRadius = function(){

  var googleMap = unsafeWindow.MapSettings.Map,
      ret = {},
      bounds;

  ret.center = "";
  ret.radius = "";


  if ( typeof(googleMap) !== "undefined" ) {

    bounds = googleMap.getBounds();
    ret.center = googleMap.getCenter();

    ret.radius = Math.floor(
      distanceBetween(
        ret.center.lat, ret.center.lng,
        bounds.getNorthEast().lat,
        bounds.getNorthEast().lng - (bounds.getNorthEast().lng - bounds.getSouthWest().lng) / 2
      )
    ) / 1000;
  }

  return ret;
};

// is string json, isJSON(response.responseText)
// fn from js-Framework prototype v1.7
var isJSON = function (str) {
  if (str.length === 0) { return false; }
  str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
           .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
           .replace(/(?:^|:|,)(?:\s*\[)+/g, '');
  return (/^[\],:{}\s]*$/).test(str);
};

// is String a GCCode ?
// begin with 'GC' + 1 to 6 chars, current is 5 (05.2012)
// return Boolean
var isGCCode = function (gccode) {
  return (/^\s*(GC[0-9A-Z]{1,6})\s*$/).test(gccode);
};

// find GCID (GCCode) in String
// first 'GC' + 1 to 6 chars in a string, current is 5 (05.2012)
// return String
// example: http://jsfiddle.net/NUFGq/15/
var findGCCodeFromString = function (str) {
  if (!str || str.length === 0) { return false; }
  var treffer = str.match(/\bGC([0-9A-Z]{1,6})\b/) || [];
  return (treffer[0] || "");
};
