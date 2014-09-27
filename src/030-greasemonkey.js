if (DEBUG_MODE && console && console.time) {
  console.time('gcTour load time');
}

/*
* greasemonkey settings and function
*/
/* ----- DEBUG OUTPUT FUNCTIONS ------*/
function toLog(typ, msg) {
  //var console = unsafeWindow.console; //firebug console - http://getfirebug.com/wiki/index.php/Console_API
  if (DEBUG_MODE) {
    //if(console && console.firebug){ //use the firebug console is available
    if (console && console[typ.toLowerCase()]) {
      console[typ.toLowerCase()](msg);
    } else {
      GM_log(typ + ": " + msg.toString());   
    }
  }
}

function log(msg) {
  toLog("Log",msg);
}

function debug(msg) {
  toLog("Debug",msg);
}

function warn(msg) {
  toLog("Warn",msg);
}

function error(msg) {
  toLog("Error",msg);
}

function info(msg) {
  toLog("Info",msg);
}

function log_exception(ex) {
  toLog("Exception",ex);
}

/* wrapper functions for persistence */
function saveValue(name, value){
  return (GM_setValue(name,JSON.stringify(value)));
}

function loadValue(name, defaultValue){

  debug("loadValue: '"+name+"', with default '"+defaultValue+"' (typeof "+(typeof defaultValue)+")");

  //~ alert(GM_getValue(name, defaultValue));
  var result = GM_getValue(name, "");
  debug("loadValue: result -> '"+result.substr(0,20)+"...'");
  try{
    return result!=""?JSON.parse(result):defaultValue;
  } catch(e){ // fallback eval
    debug("loadValue: FALLBACK :-(");
    return eval(result);
  }
}

// GM_xmlhttpRequest response info
function responseInfo(r){
  debug([
    "",
    "finalUrl: \t\t"        + (r.finalUrl        || "-"),
    "status: \t\t"          + (r.status          || "-"),
    "statusText: \t\t"      + (r.statusText      || "-"),
    "readyState: \t\t"      + (r.readyState      || "-"),
    "responseHeaders: \n\t" + (r.responseHeaders || "-"),
    "responseXML: \t\t"     + (r.responseXML     || "-"),
    "responseText: \t\t"    + (r.responseText    || "-")
  ].join("\n"));
}