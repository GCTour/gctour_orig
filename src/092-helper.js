// helpers

// for map old and map beta
// googleMap center and radius: return object center and radius
var getMapCenterAndRadius = function(){

	var googleMap = unsafeWindow.map,
			ret = {},
			bounds;

	ret.center = "";
	ret.radius = "";

	if ( typeof(googleMap) !== "undefined" ) {
		bounds = googleMap.getBounds();
		ret.center = googleMap.getCenter();
		ret.radius = Math.floor(
			distanceBetween(
				ret.center.lat(), ret.center.lng(),
				bounds.getNorthEast().lat(),
				bounds.getNorthEast().lng() - (bounds.getNorthEast().lng() - bounds.getSouthWest().lng()) / 2
			)
		) / 1000;
	}

	return ret;
};
