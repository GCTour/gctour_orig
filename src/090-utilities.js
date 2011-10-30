/* ----- utilities ------*/

/* USAGE: createElement('table',{style:"border-collapse:seperate;"});append(image_table,dummy_images); */
function createElement(type, attributes){
	var node = document.createElement(type), attr;
	for (attr in attributes) if (attributes.hasOwnProperty(attr)){
		node.setAttribute(attr, attributes[attr]);
	}
	return node;
}
function createElementIn(type, attributes, toThis){	
	var node = createElement(type, attributes);
	if (toThis){
		append(node, toThis);
	}
	return node;
}

function append(thisElement, toThis){
	return toThis.appendChild(thisElement);
}

function parseXml(str, typ) {
	// typ z.B. 'text/xml'
	return (new DOMParser()).parseFromString(str, typ);
}

function fillTemplate(mapping, template){
    var j, dummy;
	for(j = 0 ; j<mapping.length ; j++){
		template = template.replace(new RegExp("###"+mapping[j][0]+"###","g"),mapping[j][1]);
	}
	
	dummy = createElement('div');
	dummy.innerHTML = template
	return dummy.firstChild;
}

function trim (zeichenkette) {
  // Erst führende, dann Abschließende Whitespaces entfernen
  // und das Ergebnis dieser Operationen zurückliefern
  return zeichenkette.replace (/^\s+/, '').replace (/\s+$/, '');
}

// rot13.js from gc.com
function createROT13array() {
	var A = 0, C = [], D = "abcdefghijklmnopqrstuvwxyz", B = D.length;
	for (A = 0; A < B; A++) {
		C[D.charAt(A)] = D.charAt((A + 13) % 26)
	}
	for (A = 0; A < B; A++) {
		C[D.charAt(A).toUpperCase()] = D.charAt((A + 13) % 26).toUpperCase()
	}
	return C
}
function convertROT13String(C) {
	var A = 0, B = C.length, D = "";
	if (!rot13array) {
		rot13array = createROT13array()
	}
	for (A = 0; A < B; A++) {
		D += convertROT13Char(C.charAt(A))
	}
	return D
}
function convertROT13Char(A) {
	return (A >= "A" && A <= "Z" || A >= "a" && A <= "z" ? rot13array[A] : A)
}

function convertROTStringWithBrackets(C) {
	var F = "", D = "", E = true, A = 0, B = C.length;
	if (!rot13array) {
		rot13array = createROT13array()
	}
	for (A = 0; A < B; A++) {
		F = C.charAt(A);
		if (A < (B - 4)) {
			if (C.toLowerCase().substr(A, 4) == "<br/>") {
				D += "<br>";
				A += 3;
				continue
			}
		}
		if (F == "[" || F == "<") {
			E = false
		} else {
			if (F == "]" || F == ">") {
				E = true
			} else {
				if ((F == " ") || (F == "&dhbg;")) {
				} else {
					if (E) {
						F = convertROT13Char(F)
					}
				}
			}
		}
		D += F
	}
	return D
}

function DM2Dec(cor1, cor2){
	debug("---DEBUG DM2Dec---");
	debug("\tcor1:'"+cor1+"' cor2:'"+cor2+"'");
	var x = parseFloat(cor1) + parseFloat(cor2) / 60;
	debug("\tx:'"+x+"'");

	//~ x = Math.round(x * 10000000) / 10000000;
	//~ debug("\tMath.round(x):'"+x+"'");
	return x;
}

function Dec2DM(coord){
	var d,m,coords;
	debug("---DEBUG Dec2DM---");
	debug("\tcoord:'"+coord+"'");
	d = parseFloat(coord);
	debug("\td:'"+d+"'");	
	m = Math.floor(((d - Math.floor(d)) * 60)*1000000)/1000000;
	debug("\tm:'"+m+"'");
	d = Math.floor(d);
	debug("\tfloor(d):'"+d+"'")
	
	coords = new Array();
	
	coords[0] = d;
	coords[1] = m;
	return coords;
}

function Dec2DM_String(latitude, longitude){
		
	latArray = Dec2DM(latitude);
	lonArray = Dec2DM(longitude);

	latOrigin = (latArray[0]<0)?"S":"N";
	lonOrigin = (lonArray[0]<0)?"W":"E";

	latArray[0] = (latArray[0]<0)?latArray[0]*(-1):latArray[0];
	lonArray[0] = (lonArray[0]<0)?lonArray[0]*(-1):lonArray[0];

	var value = latOrigin+" "+latArray[0]+"° "+dojo.number.format(latArray[1],{pattern:"##.000"})+" ";
	value += lonOrigin+" "+dojo.number.format(lonArray[0],{pattern:"000"})+"° "+dojo.number.format(lonArray[1],{pattern:"##.000"})+" ";

	return value;
}

function parseCoordinates(coordinates){
	// regex for N51° 12.123 E12° 34.123
	var regex = new RegExp(/(N|S)(\s*)(\d{0,2})(\s*)°(\s*)(\d{0,2}[\.,]\d+)(\s*)(E|W)(\s*)(\d{0,3})(\s*)°(\s*)(\d{0,2}[\.,]\d+)/);
	
	//regex for 51.123 12.123
	var regex2 = new RegExp(/(-{0,1}\d{0,2}[\.,]\d+)(\s*)(-{0,1}\d{0,3}[\.,]\d+)/);
	
	
	var result = regex.exec(coordinates);
	var result2 = regex2.exec(coordinates);
	
	if (!result && !result2) {
		return false;
	} else if (result) {
		
		var lat = DM2Dec(result[3],result[6]);
		if(result[1] == 'S') lat = lat * (-1);

		var lon = DM2Dec(result[10],result[13]);
		if(result[8] == 'W') lon = lon * (-1);
		
		return new LatLon(lat,lon);
		
	} else {
		var lat = parseFloat(result2[1]+""+result2[2]);
		var lon = parseFloat(result2[3]+""+result2[4]);
		
		return new LatLon(lat,lon);
	}
}

function distanceBetween(lat1,lon1, lat2,lon2) {
	//var R = 6371; // km (change this constant to get miles)
	var R = 6371000; // meters
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



/* TODO: remove this function */
function getElementsByAttribute(the_attribute, the_value, the_node) {
    var node_tags, results, i,j;
        if ( the_node == null )
             the_node = document;
             
             
    node_tags = the_node.getElementsByTagName('*');
	results = new Array();
	for (i=0, j=0; i<node_tags.length;i++) {
		if (node_tags[i].hasAttribute(the_attribute)) {
			if (node_tags[i].getAttribute(the_attribute) == the_value) {			
			  	results[j] = node_tags[i];
            	                j++;
			}
		}
	}
	return results;
}

/* TODO: remove this function */
function insertAfter( referenceNode, newNode )
{
    referenceNode.parentNode.insertBefore( newNode, referenceNode.nextSibling );
}

/* Replace all  &,< and > with there HTML tag */
function encodeHtml(htmlString) {
	if(!htmlString) return "";
	return htmlString.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
} 

function xsdDateTime(date)
{
  function pad(n) {
	 var s = n.toString();
	 return s.length < 2 ? '0'+s : s;
  };

  var yyyy = date.getFullYear(),
      mm1  = pad(date.getMonth()+1),
      dd   = pad(date.getDate()),
      hh   = pad(date.getHours()),
      mm2  = pad(date.getMinutes()),
      ss   = pad(date.getSeconds());

  return yyyy +'-' +mm1 +'-' +dd +'T' +hh +':' +mm2 +':' +ss+'Z';
}


function get(url, cb) {
	log("---GET---");
	log(url);
	log("---/GET/---");
	GM_xmlhttpRequest({
		method: "GET",
		url: url,
		headers:{'Content-type':'application/x-www-form-urlencoded'},
		onload: function(xhr) { cb(xhr.responseText); }
	});
}

function post(url, data, cb) {
	log("---POST---");
	log(url);
	log(data);
	log("---/POST/---");

	GM_xmlhttpRequest({
		method: "POST",
		url: url,
		headers:{'Content-type':'application/x-www-form-urlencoded'},
		data:encodeURI(data),
		onload: function(xhr) { cb(xhr.responseText); }
	});
}

function dumpProps(obj, parent) {
    var i, msg;
	// Go through all the properties of the passed-in object
	for (i in obj) {
		// if a parent (2nd parameter) was passed in, then use that to
		// build the message. Message includes i (the object's property name)
		// then the object's property value on a new line
		if (parent) {msg = parent + "." + i + "\n" + obj[i]; } else {msg = i + "\n" + obj[i]; }
		GM_log(msg);
		//~ if (!confirm(msg)) { return; }
		// If this property (i) is an object, then recursively process the object
		//~ if (typeof obj[i] == "object") {
			//~ if (parent) { dumpProps(obj[i], parent + "." + i); } else { dumpProps(obj[i], i); }
		//~ }
	}
}

function appendScript(href, domNode) {

   var script = document.createElement("script");
   script.setAttribute("type", "text/javascript");
     if (href) {        script.setAttribute("src", href);
   }

   (domNode || head).appendChild(script);
     return script;
}


  /* Test code for all date pattern
                        
                        var dates = [
							{pattern:"yyyy-MM-dd",example:"2011-05-15"},
							{pattern:"yyyy/MM/dd",example:"2011/05/15"},
							{pattern:"MM/dd/yyyy",example:"05/15/2011"},
							{pattern:"dd/MM/yyyy",example:"15/05/2011"},
							{pattern:"dd/MMM/yyyy",example:"15/May/2011"},
							{pattern:"MMM/dd/yyyy",example:"May/15/2011"},
							{pattern:"dd MMM yy",example:"15 May 11"}
						];				                   
                        
                        
                        for(var monat = 0; monat <= 11 ; monat++){
							for(var tag = 1; tag <= 31; tag++){
								var date = new Date(2011,monat,tag);
								//~ GM_log(date);
								for (i in dates) {
									var date_obj = dates[i];
									
									var date_string = dojo.date.locale.format(date, {datePattern: date_obj.pattern, selector: "date",locale: "en"});
									//~ GM_log("\t"+date_string);
									
									var paresed_date = dojo.date.locale.parse(date_string, {datePattern: date_obj.pattern, selector: "date",locale: "en"});
									//~ GM_log("\t"+paresed_date);
									if(dojo.date.compare(date,paresed_date) != 0){
											GM_log("Asdasd");
									}
									//~ GM_log(date_obj.pattern+": '"+date+"'->'"+dojo.date.locale.parse(date_obj.example, {datePattern: date_obj.pattern, selector: "date",locale: "en"})+"'");
									
								}
							}
						}
						
*/


function getDateFormat(force){
	
	
	var date_format_update = new Date(GM_getValue('date_format_update'));
	
	var current_date = new Date();
	// get date format every 30 minutes
	if (force || !date_format_update || dojo.date.difference(date_format_update, current_date, "minute") > 30){
			//replace updatedate
			GM_setValue('date_format_update',current_date.toString());

			// load prefences page
			var req = new XMLHttpRequest();							
			var myUrl = 'http://www.geocaching.com/account/ManagePreferences.aspx';
			req.open("GET", myUrl, false);
			// execute the request synchron
			req.send(null);
			// after execution parse the result
			var response_div = createElement('div');
			response_div.innerHTML = req.responseText;
			// and save the selected option
			GM_setValue('date_format',dojo.query('select[id="ctl00_ContentBody_uxDateTimeFormat"] > option[selected="selected"]',response_div)[0].value);
			
	}
	

	// allways set! otherwise something went wrong...
	return GM_getValue('date_format');
	
}

function parseDate(date_string){
	var date_format = getDateFormat();
	
	var date = dojo.date.locale.parse(date_string, {datePattern: date_format, selector: "date",locale: "en"});
	
	if(!date){
		getDateFormat(true);
		return parseDate(date_string);
	}
	
	debug("Parse Datestring: '"+date_string+"' -> Date: '"+date+"'");
	return date;
	
}

function formatDate(date){
	var date_format = getDateFormat();
	var date_string = dojo.date.locale.format(date, {datePattern: date_format, selector: "date",locale: "en"});
	
	debug("Format Date: '"+date+"' -> Datestring: '"+date_string+"'");
	
	return date_string;
	
}

