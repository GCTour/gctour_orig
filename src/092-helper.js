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
