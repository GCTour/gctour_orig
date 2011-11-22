/**
 * Interpretiert eine Koordinaten Eingabe des Formats "N51° 12.123 E010° 23.123" oder "51.123 10.123" bzw. benutzt Googles Geocoding API um die Koordinaten zu finde.
 *
 * @param   {String} coord_string: Koordinaten in einem Format
 * @param   {Boolean} [force_Geocoding=false]: Wenn gesetzt sucht die Methode bei nicht numerischer Eingabe mittels Geocoding nach den Koordinaten
 * @returns {LatLon} Koordinaten Object
 */

function parseCoordinates(coord_string,force_Geocoding){
	
	// entferne alle "," in Koordinaten String
	if(typeof coord_string == "string") coord_string = coord_string.replace(/,/g,".");
	
	
	// regex for N51° 12.123 E12° 34.123
	var regex_coord_ns = new RegExp(/(N|S)\s*(\d{0,2})\s*°\s*(\d{0,2}[\.,]\d+)/);
	var regex_coord_ew = new RegExp(/(E|W)\s*(\d{0,3})\s*°\s*(\d{0,2}[\.,]\d+)/);
	
	//regex for 51.123 12.123
	var regex_coord_dec = new RegExp(/(-{0,1}\d{0,2}[\.,]\d+)\s*(-{0,1}\d{0,3}[\.,]\d+)/);
	
	
	var result_coord_ns = regex_coord_ns.exec(coord_string);
	var result_coord_ew = regex_coord_ew.exec(coord_string);
	var result_coord_dec = regex_coord_dec.exec(coord_string);
	
	
	// Koordinate ist keins der beiden numerischen Formate
	if (!(result_coord_ns && result_coord_ew) && !result_coord_dec) {
	
		// ... jetzt hilft nur noch Google ...
		if(force_Geocoding){	
			var geocoding_obj = JSON.parse(GM_xmlhttpRequest({ // sende einen synchronen request an die geocoding api von google - Doc: http://code.google.com/apis/maps/documentation/javascript/services.html#GeocodingRequests
			  method: "GET",
			  synchronous: true,
			  url: "http://maps.googleapis.com/maps/api/geocode/json?address="+coord_string+"&sensor=false"
			}).responseText);
			
			if(geocoding_obj.status === "ZERO_RESULTS"){ // noch nicht einmal Google kann mit der eingabe etwas anfangen
				return false;
			}
						
			var lat = geocoding_obj.results[0].geometry.location.lat;
			var lon = geocoding_obj.results[0].geometry.location.lng;
			return new LatLon(lat, lon);			
		} else {
			return false;
		}
	} else if (result_coord_ns && result_coord_ew) {
		// result_coord_ns[0] = "N51° 12.123"
		// result_coord_ew[0] = "E010° 23.123"
		var lat = Geo.parseDMS(result_coord_ns[0]);
		var lon = Geo.parseDMS(result_coord_ew[0]);
		return new LatLon(lat,lon);
		
	} else {
		// result enthält beide Teile der Koordinate
		var lat = Geo.parseDMS(result_coord_dec[1]);
		var lon = Geo.parseDMS(result_coord_dec[2]);	
		
		return new LatLon(lat,lon);
	}
}

function distanceBetween(lat1,lon1, lat2,lon2) {
	var R = 6371000; // meters (change this constant to get miles)	
	var dLat = (lat2-lat1) * Math.PI / 180;
	var dLon = (lon2-lon1) * Math.PI / 180;
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 )
	*
	Math.sin(dLon/2) * Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	return d;
}




/** Orientiert an  Geodesy representation conversion functions (c) Chris Veness 2002-2011  **/


var Geo = {} // Geo namespace, representing static class
/**
 * Interpretiert einen String als Gradzahl. Diese Funktion verarbeitet alle 3 möglichen Formate (d, dm, dms)
 * Limitiert auf eine Komponente pro Aufruf.
 * 
 * @param   {String} dmsStr: Koordinaten String
 * @returns {Number} deg: Degrees
 */
Geo.parseDMS = function(dmsStr){
	// entferne alle nicht Zahlen (Regex:[^\d.\s]) und teile den String an den verbleibenden Leerzeichen (Regex:[^0-9.,])
	var dms = dmsStr.replace(/[^\d.\s]/g,' ').trim().split(/[^0-9.,]+/);
	
	// wenn nix mehr übrig bleibt -> keine Koordinate
	if (dms == '') return NaN;
  
	// Anhand der Länge von dms wird ermittelt im welchem Format die Koordinaten vorliegen
	switch (dms.length) {
		case 3:  // interpret 3-part result as d/m/s
			var deg = dms[0]/1 + dms[1]/60 + dms[2]/3600; 
			break;
		case 2:  // interpret 2-part result as d/m
			var deg = dms[0]/1 + dms[1]/60; 
			break;
		case 1:  // just d (possibly decimal) or non-separated dddmmss
			var deg = dms[0];
			break;
		default:
			return NaN;
	}
	
	// anschließend negiere Wert wenn der String ein S oder W beinhaltet
	if (/^-|^[WS]/i.test(dmsStr.trim())) deg = -deg;
	return deg;
}


/**
 * Konvertiert dezimal Gradzahlen zu dem festgelgegten Format ('d', 'dm', 'dms') - Vorangestellt N/S
 *
 * @param   {Number} deg: Degrees
 * @param   {String} [format=dms]: Return value as 'd', 'dm', 'dms'
 * @param   {Number} [dp=0|2|4]: No of decimal places to use - default 0 for dms, 2 for dm, 4 for d
 * @returns {String} Deg/min/seconds
 */
Geo.toLat = function(deg, format) {
  var lat = Geo.toDMS(deg, format);
  return lat=='' ? '' : (deg<0 ? 'S' : 'N')+ " " +lat.slice(1);  // erste '0' abschneiden für Lat
}

/**
 * Konvertiert dezimal Gradzahlen zu dem festgelgegten Format ('d', 'dm', 'dms') - Vorangestellt E/W
 *
 * @param   {Number} deg: Degrees
 * @param   {String} [format=dms]: Return value as 'd', 'dm', 'dms'
 * @returns {String} Deg/min/seconds
 */
Geo.toLon = function(deg, format) {
  var lon = Geo.toDMS(deg, format);
  return lon=='' ? '' : (deg<0 ? 'W' : 'E')+ " " +lon;
}

/**
 * Konvertiert dezimal Gradzahlen in das "deg°"(d), "deg° min" (dm) oder "deg°min'sec''"(dms) Format
 *
 * @private
 * @param   {Number} deg: Degrees
 * @param   {String} [format=dm]: Return Format 'd', 'dm', 'dms'
 * @returns {String} Koordinaten String in dem festgelegten Format
 * @throws  {TypeError} wenn deg ein Object ist
 */
Geo.toDMS = function(deg, format) {
  if (typeof deg == 'object') throw new TypeError('Geo.toDMS - deg is an object');
  if (isNaN(deg)) return 'NaN';  // give up here if we can't make a number from deg
  
  // default value of format = dms
  if (typeof format == 'undefined') format = 'dm';
  deg = Math.abs(deg);  // (unsigned result ready for appending NS|WE)
  
  switch (format) {
    case 'd':
      d = deg.toFixed(8);     // round degrees
      if (d<100) d = '0' + d;  // pad with leading zeros
      if (d<10) d = '0' + d;
      dms = d;      // add ° symbol
      break;
    case 'dm':
      var min = (deg*60).toFixed(8);  // convert degrees to minutes & round
      var d = Math.floor(min / 60);    // get component deg/min
      var m = (min % 60).toFixed(3);  // pad with trailing zeros
      if (d<100) d = '0' + d;          // pad with leading zeros
      if (d<10) d = '0' + d;
      if (m<10) m = '0' + m;
      dms = d + '\u00B0' + m;  // add ° symbols
      break;
    case 'dms':
      var sec = (deg*3600).toFixed(0);  // convert degrees to seconds & round
      var d = Math.floor(sec / 3600);    // get component deg/min/sec
      var m = Math.floor(sec/60) % 60;
      var s = (sec % 60).toFixed(0);    // pad with trailing zeros
      if (d<100) d = '0' + d;            // pad with leading zeros
      if (d<10) d = '0' + d;
      if (m<10) m = '0' + m;
      if (s<10) s = '0' + s;
      dms = d + '\u00B0' + m + '\u2032' + s + '\u2033';  // add °, ', " symbols
      break;
  }
  
  return dms;
}


// LatLon Object:

/**
 * Erzeugt einen Punkt mit den gegebenen Latitude und Longitude
 * @constructor
 * @param {Number} lat: latitude in numeric degrees
 * @param {Number} lon: longitude in numeric degrees
 */
function LatLon(lat, lon) {
  // only accept numbers or valid numeric strings
  this._lat = typeof(lat)=='number' ? lat : typeof(lat)=='string' && lat.trim()!='' ? +lat : NaN;
  this._lon = typeof(lon)=='number' ? lon : typeof(lon)=='string' && lon.trim()!='' ? +lon : NaN;
}

/**
 * Gibt einen String mit "lat() lon()" von diesem Punkt zurück
 *
 * @param   {String} [format]: Return value als 'd', 'dm', 'dms'
 * @returns {String} Space-separated latitude/longitude
 * 
 */
LatLon.prototype.toString = function(format) {
  if (typeof format == 'undefined') format = 'dm';  
  if (isNaN(this._lat) || isNaN(this._lon)) return '-,-';  
  return Geo.toLat(this._lat, format) + ' ' + Geo.toLon(this._lon, format);
}

