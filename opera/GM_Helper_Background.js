// ==UserScript==
// @include        http://*geocaching.com/*
// @include        https://*geocaching.com/*
// ==/UserScript==

//Helper script for greasemonkey-scripts with Opera extension
//Copyright (C) 2011  Skywalker90

var injectedScript;

 
window.addEventListener("load", setupConnection, false);


function setupConnection()
{
	
	opera.extension.onconnect = function(event) {		
		injectedScript=event.source;
		injectedScript.postMessage(null);	
	}
 
	opera.extension.onmessage = function(event){
		data = JSON.parse(event.data);		
		injectedScript=event.source;
 		xmlhttpRequestBackground(data);
	}
}

	
function xmlhttpRequestBackground(details) {		
	var httpReq = new window.XMLHttpRequest();
	httpReq.onreadystatechange = function() { 
    
	var resultData = {
		"status": (httpReq.readyState < 4 ? "" : httpReq.status),
		"statusText":  (httpReq.readyState < 4 ? "" : httpReq.statusText),
		"responseHeaders": (httpReq.readyState < 4 ? "" : httpReq.getAllResponseHeaders()),
		"responseText": (httpReq.readyState < 4 ? "" : httpReq.responseText),
		"readyState": (httpReq.readyState < 4 ? "" : httpReq.readyState),
		//Hope this works
		"finalUrl": (httpReq.readyState < 4 ? "" : httpReq.responseXML.documentURI),
		"id": details.id
	};
	
	sendUpdate(resultData);	
};

    //open
    httpReq.open(details.method, details.url);

    //headers
    if (details.headers) {
        for (var header in details.headers) {
            httpReq.setRequestHeader(header, details.headers[header]);
        }
    }

    //send
    httpReq.send(typeof details.data == 'undefined' ? null : details.data);    
}

function openInTabBackground(url)
{
	opera.extension.tabs.create({"url":url,"focused":true});
}

function sendUpdate(data)
{	
	injectedScript.postMessage(data); 	
}
