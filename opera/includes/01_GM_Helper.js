// ==UserScript==
// @include        http://*geocaching.com/*
// @include        https://*geocaching.com/*
// ==/UserScript==

//Helper script for greasemonkey-scripts with Opera extension
//Copyright (C) 2011  Skywalker90

var scriptName = "_GCTour";
var backgroundScript;
var date = new Date();
var callBack = new Array();

var unsafeWindow = window;
var DOMParser = window.DOMParser;
var XMLSerializer = window.XMLSerializer;
var navigator = window.navigator;
var XMLHttpRequest = window.XMLHttpRequest;


//GM_log
GM_log = opera.postError;

function uneval(object)
{	
	return JSON.stringify(object);
}

function newEval(string)
{
	if(typeof string == "object")
	{
		return string;
	}
	else if(typeof string == "undefined")
	{
		return string;
	}
	else
	{
		return JSON.parse(string);
	}
}



function GM_setValue(name, value) {
    window.localStorage.setItem(name+scriptName, value)
}

function GM_getValue(name, defaultValue) {
    return window.localStorage.getItem(name+scriptName) == null ? defaultValue : window.localStorage.getItem(name+scriptName);
}

function GM_deleteValue(oKey) {
    try {
        window.localStorage.removeItem(oKey+scriptName);
    }
    catch (e) { }
}

function GM_listValues() {
    var keys = new Array();
    for (i = 0; i < window.localStorage.length; i++) {
        keys[i] = window.localStorage.key(i).replace(scriptName,"");
    }
    return keys;
}

function GM_openInTab(url)
{
	window.open(url);
}

function GM_addStyle(style)
{
	var sheet = document.createElement('style')
	sheet.innerHTML = style;
	document.body.appendChild(sheet);
}

function GM_xmlhttpRequest(details) {
	//Add an random id
	details["id"]= date.getTime() * (1 + parseInt( Math.random() * 100));
	
	//Save the callbacks if required
	if(details["onreadystatechange"] || details["onerror"] || details["onload"])
	{
		callBack[details["id"]] = {onreadystatechange: details["onreadystatechange"] , onerror: details["onerror"], onload: details["onload"]} ;
	}
	
	//Send request to background worker
	backgroundScript.postMessage(JSON.stringify(details));	
}
	
opera.extension.onmessage = function(event){
	if(event.data == null)
	{
		backgroundScript=event.source;
	}
	else
	{
		//Got an result/status update
		
		//Are there callbacks?
		var myCallback = callBack[event.data.id];
		if (myCallback)
		{
			var resultData = event.data;
			
			
			//Notify the onreadystatechange function, if there is any
			if (myCallback["onreadystatechange"]) {
			    myCallback["onreadystatechange"]({
				status: (resultData.readyState < 4 ? 0 : resultData.status),
				statusText: (resultData.readyState < 4 ? "" : resultData.statusText),
				responseHeaders: (resultData.readyState < 4 ? "" : resultData.getAllResponseHeaders),
				responseText: (resultData.readyState < 4 ? "" : resultData.responseText),				
				readyState: resultData.readyState
			    });
			}

			//Request finished
			if (resultData.readyState == 4) {
			    if (resultData.status < 200 || resultData.status >= 300) {
				//An error occured
				//Notify the onerror function, if there is any
				if (myCallback["onerror"]) {
				    myCallback["onerror"]({
					status: (resultData.status),
					statusText: (resultData.statusText),
					responseHeaders: (resultData.getAllResponseHeaders),
					responseText: (resultData.responseText),					
					//API Reference says unsed, but set it
					readyState: resultData.readyState
				    });
				}
			    }
			    else {
				//Everything is ok
				//Notify the onload function, if there is any
				if (myCallback["onload"]) {
				    myCallback["onload"]({
					status: (resultData.status),
					statusText: (resultData.statusText),
					responseHeaders: (resultData.getAllResponseHeaders),
					responseText: (resultData.responseText),					
					//API Reference says unsed, but set it to 4
					readyState: resultData.readyState,
					//Hope this works
					finalUrl: resultData.finalUrl
				    });				   
				}
			    }
			}
		}
 	}
};

