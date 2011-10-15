/*
* greasemonkey settings and function
*/
/* ----- DEBUG OUTPUT FUNCTIONS ------*/
function toLog(typ,msg) {
  if (DEBUG_MODE) {
  	GM_log(typ + ": " + msg.toString());
  }
}

function log(msg) {
  toLog("Log",msg);
}
function debug(msg) {
  toLog("DEBUG",msg);
}

function warn(msg) {
  toLog("Warning",msg);
}

function error(msg) {
  toLog("Error",msg);
}