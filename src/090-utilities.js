/* ----- utilities ------*/

// Read a GET URL variables and return them as an associative array.
function getUrlVars(url) {
  var vars = [], hash;
  var hashes = url.slice( url.indexOf('?') + 1 ).split('&');
  for(var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);		
    vars[hash[0]] = hash[1];
  }
  return vars;
}

/* USAGE: createElement('table',{style:"border-collapse:seperate;"});append(image_table,dummy_images); */
function createElement(type, attributes) {
  var node = document.createElement(type), attr;
  for (attr in attributes) {
    if (attributes.hasOwnProperty(attr)){
      node.setAttribute(attr, attributes[attr]);
    }
  }
  return node;
}

function append(thisElement, toThis) {
  return toThis.appendChild(thisElement);
}

function createElementIn(type, attributes, toThis){  
  var node = createElement(type, attributes);
  if (toThis){
    append(node, toThis);
  }
  return node;
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
  dummy.innerHTML = template;
  return dummy.firstChild;
}

function trim (zeichenkette) {
  // Erst führende, dann Abschließende Whitespaces entfernen
  // und das Ergebnis dieser Operationen zurückliefern
  return zeichenkette.replace (/^\s+/, '').replace (/\s+$/, '');
}

// rot13.js from gc.com
function createROT13array() {
  var A = 0, 
      C = [], 
      D = "abcdefghijklmnopqrstuvwxyz", 
      B = D.length;
  for (A = 0; A < B; A++) {
    C[D.charAt(A)] = D.charAt((A + 13) % 26);
  }
  for (A = 0; A < B; A++) {
    C[D.charAt(A).toUpperCase()] = D.charAt((A + 13) % 26).toUpperCase();
  }
  return C;
}

function convertROT13Char(A) {
  return (A >= "A" && A <= "Z" || A >= "a" && A <= "z" ? rot13array[A] : A);
}

function convertROT13String(C) {
  var A = 0, 
      B = C.length, 
      D = "";
  if (!rot13array) {
    rot13array = createROT13array();
  }
  for (A = 0; A < B; A++) {
    D += convertROT13Char(C.charAt(A));
  }
  return D;
}

function convertROTStringWithBrackets(C) {
  var F = "", 
      D = "", 
      E = true, 
      A = 0, 
      B = C.length;

  if (!rot13array) {
    rot13array = createROT13array();
  }

  for (A = 0; A < B; A++) {
    F = C.charAt(A);

    if (A < (B - 4)) {
      if (C.toLowerCase().substr(A, 4) == "<br/>") {
        D += "<br/>";
        A += 3;
        continue;
      }
    }

    if (F == "[" || F == "<") {
      E = false;
    } else {
      if (F == "]" || F == ">") {
        E = true;
      } else {
        if ((F === " ") || (F === "&dhbg;")) {
        } else {
          if (E) {
            F = convertROT13Char(F);
          }
        }
      }
    }

    D += F;
  }
  return D;
}

/* TODO: remove this function */
function getElementsByAttribute(the_attribute, the_value, the_node) {
  var node_tags, results, i, j;

  the_node  = ( the_node == null ) ? document : the_node;            
  node_tags = the_node.getElementsByTagName('*');
  results   = [];

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
function insertAfter( referenceNode, newNode ) {
  referenceNode.parentNode.insertBefore( newNode, referenceNode.nextSibling );
}

/* Replace all  &,< and > with there HTML tag */
function encodeHtml(htmlString) {
  return (!htmlString) ? "" : htmlString.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
} 

function xsdDateTime(date) {
  function pad(n) {
   var s = n.toString();
   return (s.length < 2) ? '0'+s : s;
  }

  var yyyy = date.getFullYear(),
      mm1  = pad(date.getMonth()+1),
      dd   = pad(date.getDate()),
      hh   = pad(date.getHours()),
      mm2  = pad(date.getMinutes()),
      ss   = pad(date.getSeconds());

  return yyyy +'-' +mm1 +'-' +dd +'T' +hh +':' +mm2 +':' +ss+'Z';
}

function get(url, cb) {
  log([
    "---GET---",
    "\turl: " + url,
    "---/GET/---"
  ].join("\n"));

  GM_xmlhttpRequest({
    method: "GET",
    url: url,
    headers:{'Content-type':'application/x-www-form-urlencoded'},
    onload: function(xhr) {
      responseInfo(xhr);
      cb(xhr.responseText);
    }
  });
}


function postSync(url, data){

  var result = GM_xmlhttpRequest({
    method: "POST",
    url: url,
    headers:{'Content-type':'application/x-www-form-urlencoded'},
    data:encodeURI(data),
    synchronous:true
  }).responseText;
  
  return result;

}

function post(url, data, cb) {
  log([
    "---POST---",
    "\turl: " + url,
    "\tdata: " + data,
    "---/POST/---"
  ].join("\n"));

  GM_xmlhttpRequest({
    method: "POST",
    url: url,
    headers:{'Content-type':'application/x-www-form-urlencoded'},
    data:encodeURI(data),
    onload: function(xhr) {
      responseInfo(xhr);
      cb(xhr.responseText); 
    }
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

  if (href) {
    script.setAttribute("src", href);
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
  var date_format_update = new Date(GM_getValue('date_format_update')),
      current_date = new Date(),
      req = new XMLHttpRequest(),
      myUrl = 'http://www.geocaching.com/account/ManagePreferences.aspx',
      response_div;

  // get date format every 30 minutes
  if (force || !date_format_update || dojo.date.difference(date_format_update, current_date, "minute") > 30) {
    //replace updatedate
    GM_setValue('date_format_update',current_date.toString());

    // load prefences page
    req.open("GET", myUrl, false);
    // execute the request synchron
    req.send(null);
    // after execution parse the result
    response_div = createElement('div');
    response_div.innerHTML = req.responseText;
    // and save the selected option
    GM_setValue('date_format',dojo.query('select[id="ctl00_ContentBody_uxDateTimeFormat"] > option[selected="selected"]',response_div)[0].value);
  }

  // allways set! otherwise something went wrong...
  return GM_getValue('date_format');
}

function parseDate(date_string){
  var date_format = getDateFormat(),
      date = dojo.date.locale.parse(date_string, {datePattern: date_format, selector: "date",locale: "en"});

  if(!date){
    getDateFormat(true);
    return parseDate(date_string);
  }

  debug("Parse Datestring: '"+date_string+"' -> Date: '"+date+"'");
  return date;
}

function formatDate(date){
  var date_format = getDateFormat(),
      date_string = dojo.date.locale.format(date, {datePattern: date_format, selector: "date",locale: "en"});
  
  debug("Format Date: '"+date+"' -> Datestring: '"+date_string+"'");
  
  return date_string;
}

