/** Orientiert an  Geodesy representation conversion functions (c) Chris Veness 2002-2011  **/


var Geo = {} // Geo namespace, representing static class
/**
 * Interpretiert einen String als Gradzahl. Diese Funktion verarbeitet alle 3 möglichen Formate (d, dm, dms)
 * 
 * @param   {String} dmsStr: Koordinaten String
 * @returns {Number} deg: Degrees
 */
Geo.parseDMS = function(dmsStr){
	// entferne alle nicht Zahlen (Regex:[^\d.\s]) und teile den String an den verbleibenden Leerzeichen (Regex:[^0-9.,])
	var dms = dmsStr.replace(/[^\d.\s]/g,'').trim().split(/[^0-9.,]+/);
	
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
      var min = (deg*60).toFixed(30);  // convert degrees to minutes & round
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

