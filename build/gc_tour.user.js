// ==UserScript==
// @name           GC Tour
// @namespace      madd.in
// @version        1.97
// @description    Cachetour planing made easy. Pick some Caches, order the list and print it out. Free for all users of geocaching.com! 
// @include        http://*geocaching.com/*
// @copyright      2008, 2009, 2010 Martin Georgi
// @author         madd.in
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// ==/UserScript==

/*****************************************************************************
 * Copyright (C) 2008, 2009, 2010 Martin Georgi
 *
 * This is free software; you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 3 of the License, or (at your option) any later
 * version.
 *
 * This is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Public License for more details
 *
 * To obtain a copy of the GNU General Public License, please see
 * <http://www.gnu.org.licenses/>
 *****************************************************************************/
/* 
 * Changelog:
 *
 * version 1.97
 *		- GPX: add <groundspeak:name> to GPX
 *      - GPX: changed Groundspeak "Multi-Cache" to "Multi-cache"
 *		- FIXED: caches can remain in watchlist without getting an error  
 *      - Code Review
 * 		- Publish code now an http://code.google.com/p/gctour/
 *
 * version 1.96
 * 		- gc.com layout update 6/29/10 fixed
 *		- new groundspeak GPX implementation
 * 		- close-window-button get a function in printview
 *		- removing annoying debug messages on maps
 * 		- add an check after 20sec if gctour is loaded - important for no script users
 * 		- caches on printview are now numbered
 * 		- own waypoints are now uploaded again  
 * 		- tour uploads had now a map on gctour.madd.in
 * 		- autoTour gets an option to filter PM-Only caches
 * 		- update to dojo 1.4
 *
 *
 * version 1.95
 * 		- gc.com layout fixes
 *		- repair the "add selected caches"-to-tour button 
 *
 * version 1.94
 * 		- hints are now in the printout again
 *
 * version 1.93
 * 		- fixed major functions after layout update
 * 		- new code for the printview
 * 		- remove the download-complete-map-button from maps page - please use autotour instead
 *		- some minor bugfixes
 * 
 * version 1.92
 * 		- add gpx option - old groundspeak schema or new geocaching.com.au schema
 * 		- autoTour now part of GcTour
 * 		- GUI improvements - now every tab is up-to-date
 * 		- strip 'GC'-Option for GPX-Files
 *		- add OSM-Maps to the overview maps 
 * 		- append OSM and Topo Germany to default Maptype-Option
 *		-   
 * version 1.91
 * 		- Fast GPX-File bugfix! Type of caches is now correctly set!
 * 
 * version 1.9
 * 		- New-GcTour-GPX with geocaching.com.au/opencaching.de schema! Contains now logs and description for _ALL_ users.
 * 		- Add dojo to make some DOM operations MUCH faster. Printview e.g. is now MUCH faster.
 * 		- GUI improvments
 * 		- Attributes are now shown in the printview
 * 
 * version 1.85
 * 		- fixed bug that own marker have wrong coordinates in printview
 * 		- redesign of the cache list
 * 		- redesign of "create new marker"-dialog
 * 		- adding preview map to "create new marker"-dialog
 * 		- adding "move to top/bottom" button to cache list - thanks to adam r
 * 		- adding map size control in printview maps
 * 
 * version 1.8
 * 		- adding overview page to printpage
 * 		- creating map with all caches on it
 * 		- outline map for every cache + additional waypoints 
 * 		- adding costum waypoints
 * 		- the GPX contains now the current date 
 * 		- adding information button to show which cache is in tour before loading
 * 
 * version 1.7
 * 		- adding upload feature
 * 		- removed bug, that gctour is not able to handle multiple tabs
 * 		- implement sorting 
 * 		- adding text size option for the printview
 * 
 * version 1.6
 * 		- fixed downloaded gpxfile - html-/ no-html-mode
 * 		- add some fancy sliding effects
 * 		- add multiple tour function
 * 		- add trackables to printview
 * 		- some minor bugfix (e.g. extended table on gc.com map)
 * 
 * version 1.5
 * 		- add download GPX-button
 * 		- add additional waypoints to printview
 * 		- add an add all button to the map. thx atornedging
 * 		- fixed some mutated vowel bugs in GPX
 * 		- tweak update function
 * 		- adding changelog to updatedialog
 * 	
 * version 1.4
 * 		- fixing bug, that premiummembers dont have coordinates in the printview
 * 		- adding logcounter to printview
 * 
 * version 1.3
 * 		- adding buttons to the search tables
 * 		- progress is now displayed in the print view and GPS Export
 * 		- adding language support
 * 
 * version 1.2
 * 		- optimizing printview
 * 		- add the possibility to export the spoiler images to the printview
 * 		- add an add-to-tour-button in the GC-Table on the right side of the map view
 * 		- fixed minor bug in the settings
 * 	
 * version 1.1
 * 		- extended printview - it is now possible export logs and remove images/logs
 * 		- update function is now working ...
 * 
 * version 1.0
 * 		- initial release
 * 
 */
// globals
const version="1.97" // will be checked once the day
const scriptId = 'gctour'; 
const DEBUG = false;


var tours;
var currentTour;
var userName;
var lang; // the language file


var dojoPath = "http://o.aolcdn.com/dojo/1.4"; 
var head = document.getElementsByTagName('head')[0];
var dojo;



var wptArray = [
	{wptTypeId: "2",     hash: "32bc9333-5e52-4957-b0f6-5a2c8fc7b257", name: "Traditional Cache"   },
	{wptTypeId: "3",     hash: "a5f6d0ad-d2f2-4011-8c14-940a9ebf3c74", name: "Multi-Cache"         },
	{wptTypeId: "8",     hash: "40861821-1835-4e11-b666-8d41064d03fe", name: "Unknown Cache"       },
	{wptTypeId: "5",     hash: "4bdd8fb2-d7bc-453f-a9c5-968563b15d24", name: "Letterbox Hybrid"     },
	{wptTypeId: "11",    hash: "31d2ae3c-c358-4b5f-8dcd-2185bf472d3d", name: "Webcam Cache"        },
	{wptTypeId: "4",     hash: "294d4360-ac86-4c83-84dd-8113ef678d7e", name: "Virtual  Cache"      },
	{wptTypeId: "1858",  hash: "0544fa55-772d-4e5c-96a9-36a51ebcf5c9", name: "Wherigo Cache",      },
	{wptTypeId: "earthcache",   hash: "c66f5cf3-9523-4549-b8dd-759cd2f18db8", name: "Earthcache"			},
	{wptTypeId: "6",     hash: "69eb8534-b718-4b35-ae3c-a856a55b0874", name: "Event Cache"         },
	{wptTypeId: "13",    hash: "57150806-bc1a-42d6-9cf0-538d171a2d22", name: "Cache In Trash Out Event"	},
    {wptTypeId: "3653",    hash: "3ea6533d-bb52-42fe-b2d2-79a3424d4728", name: "Lost and Found Event Cache"	},
	{wptTypeId: "453",   hash: "69eb8535-b718-4b35-ae3c-a856a55b0874", name: "Mega-Event Cache"	}
];	
// ---------------------- THE LANGUAGES --------------------

var lang_ger = new Object();
	lang_ger['name'] = 'Deutsch';
	lang_ger['language'] = 'Sprache';
	lang_ger['addToTour'] = 'zur Tour hinzufügen';
	lang_ger['addMarkedToTour'] = 'markierte zur Tour hinzufügen';	
	lang_ger['newVersionDialog'] = 'Es gibt eine neuer Version der GCTour.\nZum update gehen? \n\n';
	lang_ger['removeTourDialog'] = "Soll die Tour wirklich gelöscht werden?";
	lang_ger['logYourVisit'] = "log your visit";
	lang_ger['removeFromList'] = "aus Liste entfernen";
	lang_ger['emptyList'] = 'Die Liste ist leer.';
	lang_ger['notLogedIn'] = 'Bitte einloggen ...';
	lang_ger['months'] = new Array("Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember");
	lang_ger['prinviewTitle'] = 'GCTour - http://gctour.madd.in';
	lang_ger['pleaseWait'] = 'Bitte warten - Daten werden geladen...';
	lang_ger['newList'] = 'neue Tour erstellen';	
	lang_ger['sendToGps'] = 'an GPS senden';
	lang_ger['printview'] = 'Druckansicht';
	lang_ger['downloadGpx'] = 'GPX downloaden';
	lang_ger['showSettings'] = 'Einstellungen anzeigen';
	lang_ger['settingsLogCount'] = 'Anzahl der Logs in Druckansicht'
	lang_ger['settingsLogCountNone'] = 'keine<br/>';
	lang_ger['settingsLogCountAll'] = 'alle<br/>';
	lang_ger['settingsLogCountShow'] = 'anzeigen';
	lang_ger['settingsEditDescription'] = 'Beschreibung editierbar';
	lang_ger['settingsRemoveImages'] = 'Bilder bei Klick entfernen';
	lang_ger['settingsShowSpoiler'] = 'Spoiler Bilder anzeigen';
	lang_ger['settingsAdditionalWaypoints'] = 'Additional Waypoints anzeigen';
	lang_ger['settingsLoggedVisits'] = 'Log-Counter anzeigen';
	lang_ger['settingsAttributes'] = 'Attributes anzeigen';
	lang_ger['settingsDecryptHints'] = 'Hints entschl&uuml;sseln';
	lang_ger['settingsSendToGPS'] = 'An GPS senden';
	lang_ger['settingsShowGPX'] = 'GPX anzeigen';
	lang_ger['settingsDownladGPX'] = 'GPX download<br/>';
	lang_ger['settingsGPXHtml'] = 'Beschreibung mit HTML';
	lang_ger['settingsGPXStripGC'] = 'Entferne "GC" in GC-Code';
	lang_ger['settingsGPXSchema'] = 'GPX-Version';
	lang_ger['settingsGPXSchemaGS'] = 'groundspeak';
	lang_ger['settingsGPXSchemaAU'] = 'geocaching.com.au';
	lang_ger['settingsUploadTour'] = 'Tour upload';
	lang_ger['settingsTourMap'] = 'Karte beim upload erzeugen';
	lang_ger['loadTour'] = 'Tour laden:<br/>';
	lang_ger['openTour'] = 'eine Tour laden';
	lang_ger['removeTour'] = 'diese Tour löschen';
	lang_ger['newTourDialog'] = 'Bitte gib einen Namen für die neue Tour ein ...';
	lang_ger['rename'] = 'umbenennen';
	lang_ger['upload'] = 'Tour hochladen';
	lang_ger['onlineTour'] = 'Webcode runterladen';
	lang_ger['webcodeerror'] = 'Der angegebene Webcode existiert leider nicht!';
	lang_ger['tourUploaded1'] ='Die Tour wurde erfolgreich hochgeladen!\nDer Webcode lautet:\n      ';
	lang_ger['tourUploaded2'] = '\nDie Onlineabfrage kann unter http://gctour.madd.in geschehen.\nWichtig: Bitte Webcode notieren um die Tour wieder aufzurufen!!';					
	lang_ger['settingsFontSize'] = 'Schriftgr&ouml;&szlig;e:';
	lang_ger['settingsPageBreak'] = 'Seitenumbruch nach Cache:';
	lang_ger['settingsPageBreakAfterMap'] = 'Seitenumbruch nach Übersichtskarte:';
	lang_ger['webcodePrompt'] = 'Tour download\nBitte gib einen gültigen Webcode ein,\num die dazu passende Tour zu laden:';
	lang_ger['webcodesuccess'] = 'wurde erfolgreich geladen!';
	lang_ger['printviewCache'] = 'Cache';
	lang_ger['printviewFound'] = 'Fund';
	lang_ger['printviewNote'] = 'Notiz';
	lang_ger['printviewMarker'] = "Eigene Wegpunkte";
	lang_ger['printviewAdditionalWaypoint'] = "Zusätzliche Wegpunkte";
	lang_ger['printviewRemoveMap'] = "Karte entfernen";
	lang_ger['settingsFrontPage'] = 'Titelseite:';
	lang_ger['settingsOutlineMap'] = 'Übersichtskarte für alle Caches:';
	lang_ger['settingsOutlineMapSinge'] = 'Übersichtskarte für jeden Cache:';
	lang_ger['settingsMapType'] = 'Standard Kartentyp';
	lang_ger['settingsMapSize'] = 'Standard Kartengröße';
	lang_ger['addOwnWaypoint'] = 'eigener Wegpunkt hinzufügen';
	lang_ger["markerCoordinate"] = "Koordinaten"
	lang_ger["markerContent"] = "Inhalt"
	lang_ger["markerType"] = "Typ"		
	lang_ger["markerContentHint"] = "wird in Druckansicht angezeigt";
	lang_ger["markerCaption"] = "Beschriftung";
	lang_ger["autoTour"] = "autoTour";
	lang_ger["autoTourRadius"] = "Radius";
	lang_ger["autoTourCenter"] = "Mittelpunkt<br><span style='font-size:66%'>Koordinaten oder Adresse</span>";
	lang_ger["autoTourRefresh"] = "autoTour aktualisieren";
	lang_ger["autoTourCacheCounts"] = "Geschätze gesamt Anzahl Caches in dieser Region:";
	lang_ger["autoTourDuration"] = "Geschätze Dauer der autoTour:";
	lang_ger["kilometer"] = "Kilometer";
	lang_ger["mile"] = "Meilen";
	lang_ger["save"] = "speichern";
	lang_ger["cancel"] = "abbrechen";
	lang_ger["edit"] = "bearbeiten";
	lang_ger["example"] = "Beispiel:";
	lang_ger["dontPrintHint"] = "<b>Hinweis:</b><br/>Elemente in einem solchen Kasten werden <u>nicht</u> mit gedruckt!";
	lang_ger['ERROR_DIALOG'] = "<img src='http://img.groundspeak.com/forums/emoticons/signal/sad.gif'>&nbsp;&nbsp;Es tut mir leid, aber es ist ein Fehler aufgetreten:<br/>##ERROR##<br/>Versuch es einfach noch einmal!<div align='center' style='border-bottom: 1px solid gray; padding: 5px; margin-bottom: 10px;'><input type='button' value='Fenster schließen'></div>Wenn dieser Fehler jedesmal auftaucht, dann zöger nicht und schicke mir diesen Fehlerreport:";
    lang_ger["ERROR_REPORT_SUBMIT"] = "Fehlerbericht schicken"; 
    lang_ger["SCRIPT_ERROR"] = "Es sieht so aus, als blockierst du benötigte Javascript-Quellen nicht zu (z.B. durch Firefox-Addon NoScript). Bitte lasse 'aolcdn.com' und 'geocaching.com' dauerhaft zu, um GcTour zu nutzen!" ;
	lang_ger['mapTypes'] = [{"caption":"Google Karte","value":"Map"}, {"caption":"Google Satellit","value":"Satellite"}, {"caption":"Google Hybrid","value":"Hybrid"}, {"caption":"Google Gelände","value":"Terrain"},{"caption":"Topo Deutschland","value":"Topo"}, {"caption":"OSM Mapnik","value":"Mapnik"}, {"caption":"OSM Osma","value":"Osma"}, {"caption":"OSM Cycle","value":"Cycle"}];

var lang_eng = new Object();
	lang_eng['name'] = 'English';
	lang_eng['language'] = 'Language';
	lang_eng['addToTour'] = 'Add to Tour';
	lang_eng['addMarkedToTour'] = 'Add checked to Tour';	
	lang_eng['newVersionDialog'] = 'There is a new version of  GCTour.\nWant to update? \n\n';
	lang_eng['removeTourDialog'] = "Are you sure to remove this tour?";
	lang_eng['logYourVisit'] = "log your visit";
	lang_eng['removeFromList'] = "remove from list";
	lang_eng['emptyList'] = 'The list is empty.';
	lang_eng['notLogedIn'] = 'Please login ...';
	lang_eng['months'] = new Array("jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec");
	lang_eng['prinviewTitle'] = 'http://gctour.madd.in';
	lang_eng['pleaseWait'] = 'Please wait - loading data ...';
	lang_eng['newList'] = 'new Tour';	
	lang_eng['sendToGps'] = 'send to GPS';
	lang_eng['printview'] = 'printview';
	lang_eng['downloadGpx'] = 'download GPX';
	lang_eng['showSettings'] = 'show settings';
	lang_eng['settingsLogCount'] = 'number of logs in printview'
	lang_eng['settingsLogCountNone'] = 'none<br/>';
	lang_eng['settingsLogCountAll'] = 'all<br/>';
	lang_eng['settingsLogCountShow'] = 'show';
	lang_eng['settingsEditDescription'] = 'description editable';
	lang_eng['settingsRemoveImages'] = 'remove images on click';
	lang_eng['settingsShowSpoiler'] = 'display spoiler';
	lang_eng['settingsAdditionalWaypoints'] = 'show Additional Waypoints';
	lang_eng['settingsLoggedVisits'] = 'show log counter';
	lang_eng['settingsAttributes'] = 'show Attributes';
	lang_eng['settingsDecryptHints'] = 'decrypt hints';
	lang_eng['settingsSendToGPS'] = 'send to GPS';
	lang_eng['settingsShowGPX'] = 'show the GPX-File';
	lang_eng['settingsDownladGPX'] = 'GPX download<br/>';
	lang_eng['settingsGPXHtml'] = 'Description with HTML';
	lang_eng['settingsUploadTour'] = 'Tour upload';
	lang_eng['settingsTourMap'] = 'create map on upload';
	lang_eng['settingsGPXStripGC'] = 'Strip "GC" in GC-Code';
	lang_eng['settingsGPXSchema'] = 'GPX-Version';
	lang_eng['settingsGPXSchemaGS'] = 'groundspeak';
	lang_eng['settingsGPXSchemaAU'] = 'geocaching.com.au';
	lang_eng['loadTour'] = 'load tour:<br/>';
	lang_eng['openTour'] = 'load a tour';
	lang_eng['removeTour'] = 'delete this tour';
	lang_eng['newTourDialog'] = 'Please enter a name for the new tour ...';
	lang_eng['rename'] = 'rename';
	lang_eng['upload'] = 'upload tour';
	lang_eng['onlineTour'] = 'download Webcode';
	lang_eng['webcodeerror'] = 'The choosen Webcode does not exist!';
	lang_eng['tourUploaded1'] ='Uploading tour was successful!\nWebcode:\n      ';
	lang_eng['tourUploaded2'] = '\nYou can view the tour at http://gctour.madd.in.\nImportant: Please note webcode to recall the tour!!';					
	lang_eng['settingsFontSize'] = 'Fontsize:';
	lang_eng['settingsPageBreak'] = 'page break after cache:';
	lang_eng['settingsPageBreakAfterMap'] = 'page break after map:';
	lang_eng['webcodePrompt'] = 'Download tour\nPlease enter a valid Webcode, to load the tour:';
	lang_eng['webcodesuccess'] = 'was successfully loaded!';
	lang_eng['printviewCache'] = 'cache';
	lang_eng['printviewFound'] = 'found';
	lang_eng['printviewNote'] = 'note';	
	lang_eng['printviewMarker'] = "own waypoint";	
	lang_eng['printviewAdditionalWaypoint'] = "additional waypoints";
	lang_eng['printviewRemoveMap'] = "remove map";
	lang_eng['settingsFrontPage'] = 'front page:';
	lang_eng['settingsOutlineMap'] = 'outline map for all caches:';	
	lang_eng['settingsOutlineMapSinge'] = ' outline map for every cache:';
	lang_eng['settingsMapType'] = 'Default Maptype';
	lang_eng['settingsMapSize'] = 'Default Mapsize';
	lang_eng['addOwnWaypoint'] = 'add own waypoint';
	lang_eng["markerCoordinate"] = "Coordinates"
	lang_eng["markerContent"] = "Content"
	lang_eng["markerType"] = "Type";		
	lang_eng["markerContentHint"] = "will be shown in the printview";
	lang_eng["markerCaption"] = "caption";
	lang_eng["autoTour"] = "autoTour";
	lang_eng["autoTourRadius"] = "Radius";
	lang_eng["autoTourCenter"] = "Center<br><span style='font-size:66%'>coordinates or address</span>";
	lang_eng["autoTourRefresh"] = "refresh autoTour";
	lang_eng["autoTourCacheCounts"] = "Estimated total number of caches in this region:";
	lang_eng["autoTourDuration"] = "Estimated duration of this autoTour:";
	lang_eng["kilometer"] = "Kilometer";
	lang_eng["mile"] = "Miles";
	lang_eng["save"] = "save";
	lang_eng["cancel"] = "cancel";	
	lang_eng["edit"] = "edit";	
	lang_eng["example"] = "e.g. ";
	lang_eng["dontPrintHint"] = "<b>Information :</b><br/>Elements in such a box will <u>not</u> be printed!";
	lang_eng['ERROR_DIALOG'] = "<img src='http://img.groundspeak.com/forums/emoticons/signal/sad.gif'>&nbsp;&nbsp;I'm sorry but an error occurs:<br/>##ERROR##<br/> Please just try again!<div align='center' style='border-bottom: 1px solid gray; padding: 5px; margin-bottom: 10px;'><input type='button' value='close window'></div><hr>If this error comes every time, please send this error report.";
    lang_eng["ERROR_REPORT_SUBMIT"] = "send report"; 
    lang_eng["SCRIPT_ERROR"] = "It appears, that you are blocking some javascript sources (e.g. NoScript). Please allow 'aolcdn.com' and 'geocaching.com' permanently to use GcTour!" ;
	lang_eng['mapTypes'] = [{"caption":"Google Map","value":"Map"}, {"caption":"Google Satellite","value":"Satellite"}, {"caption":"Google Hybrid","value":"Hybrid"}, {"caption":"Google Terrain","value":"Terrain"}, {"caption":"Topo Germany","value":"Topo"}, {"caption":"OSM Mapnik","value":"Mapnik"}, {"caption":"OSM Osma","value":"Osma"}, {"caption":"OSM Cycle","value":"Cycle"}];

var languages = new Array();
languages[0] = lang_ger;
languages[1] = lang_eng;
/* ----- DEBUG OUTPUT FUNCTIONS ------*/
function log(arguments) {
  if (DEBUG) {
  	GM_log("Log: " + arguments);
  }
}
function warn(arguments) {
  if (DEBUG) {
    GM_log("Warning: " + arguments);
  }
}
function error(arguments) {
  if (DEBUG) {
    GM_log("Error: " + arguments);
  }
}
/* USAGE: createElement('table',{style:"border-collapse:seperate;"});append(image_table,dummy_images);
/* */function createElement(type, attributes){
/* */	var node = document.createElement(type);
/* */	for (var attr in attributes) if (attributes.hasOwnProperty(attr)){
/* */		node.setAttribute(attr, attributes[attr]);
/* */	}
/* */	return node;
/* */}
/* */function createElementIn(type, attributes, toThis){	
/* */	var node = createElement(type, attributes);
/* */	if (toThis){
/* */		append(node, toThis);
/* */	}
/* */	return node;
/* */}
/* */
/* */function append(thisElement, toThis){
/* */	return toThis.appendChild(thisElement);
/* */}
/* */


function fillTemplate(mapping, template){
	for(var j = 0 ; j<mapping.length ; j++){
		template = template.replace(new RegExp("###"+mapping[j][0]+"###","g"),mapping[j][1]);
	}
	
	var dummy = createElement('div');
	dummy.innerHTML = template
	return dummy.firstChild;
}

function trim (zeichenkette) {
  // Erst führende, dann Abschließende Whitespaces entfernen
  // und das Ergebnis dieser Operationen zurückliefern
  return zeichenkette.replace (/^\s+/, '').replace (/\s+$/, '');
}

// rot13.js from gc.com
var rot13array;
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
	x = parseFloat(cor1) + parseFloat(cor2) / 60;
	x = Math.round(x * 100000) / 100000;
	debug("DM2Dec:"+cor1+ "  " +cor2+" "+x);
	return x;
}

function Dec2DM(coord){
	d = parseFloat(coord);
	m = Math.floor(((d - Math.floor(d)) * 60)*1000)/1000;
	d = Math.floor(d);
	var coords = new Array();
	coords[0] = d;
	coords[1] = m;
	return coords;
}


/* TODO: remove this function */
function getElementsByAttribute(the_attribute, the_value, the_node) {
        if ( the_node == null )
             the_node = document;
             
             
    var node_tags = the_node.getElementsByTagName('*');
	var results = new Array();
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

  var yyyy = date.getFullYear();
  var mm1  = pad(date.getMonth()+1);
  var dd   = pad(date.getDate());
  var hh   = pad(date.getHours());
  var mm2  = pad(date.getMinutes());
  var ss   = pad(date.getSeconds());

  return yyyy +'-' +mm1 +'-' +dd +'T' +hh +':' +mm2 +':' +ss+'Z';
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
	// Go through all the properties of the passed-in object
	for (var i in obj) {
		// if a parent (2nd parameter) was passed in, then use that to
		// build the message. Message includes i (the object's property name)
		// then the object's property value on a new line
		if (parent) { var msg = parent + "." + i + "\n" + obj[i]; } else { var msg = i + "\n" + obj[i]; }
		// Display the message. If the user clicks "OK", then continue. If they
		// click "CANCEL" then quit this level of recursion
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
function updateTour(e){
	initCore();
	updateGUI();
}

function toggleSettingsFunction(){
	return function(){
		var tourSettingsDiv = dojo.byId('tourSettingsDiv');
		if (tourSettingsDiv.style.display == 'none'){
			dojo.fx.wipeIn({
				node: tourSettingsDiv,
				duration: 400
			}).play();
 	  	} else {
			dojo.fx.wipeOut({
				node: tourSettingsDiv,
				duration: 400
			}).play();
		}
	}
}
function toggleTourListFunction(){
	return function(){
		var tourlistDiv = dojo.byId('tourlistDiv');
		if (tourlistDiv.style.display == 'none'){
			dojo.fx.wipeIn({
				node: tourlistDiv,
				duration: 400
			}).play();
 	  	} else {
			dojo.fx.wipeOut({
				node: tourlistDiv,
				duration: 400
			}).play();
		}
	}
}

function updateGUI(){

	// update the cache count	
	updateCacheCount(currentTour.geocaches.length);
	// update tourName
	dojo.byId("tourName").innerHTML = currentTour.name;
	// update the opendialog
	populateAllTours();

	var cacheList = document.getElementById('cacheList');	
	cacheList.innerHTML = "";
	// popultate the current list on load
	for (var i = 0; i < currentTour.geocaches.length; i++){
		addNewTableCell(currentTour.geocaches[i],false);
	}

	var table = dojo.byId('tourTable');	
	if(currentTour.geocaches.length == 0){
		table.innerHTML = lang['emptyList'];
	} else {
		table.innerHTML = "";
	}
}

function addOpacityEffects(element){
	element.style.opacity = '0.4';
	element.addEventListener('mouseover', addOpacityEffect(element),false);
	element.addEventListener('mouseout',  removeOpacityEffect(element),false);
}

function addOpacityEffect(element){return function(){	element.style.opacity = '1';}}
function removeOpacityEffect(element){return function(){element.style.opacity = '0.4'}}

function addHoverEffects(element){
	element.addEventListener('mouseover', addHoverEffect(element),false);
	element.addEventListener('mouseout',  removeHoverEffect(element),false);
	element.addEventListener('mousedown', addClickEffect(element),false);
	element.addEventListener('mouseup',  removeClickEffect(element),false);
	element.style.margin = '1px';
}

function addClickEffect(element){return function(){	element.style.background = '#a9b2bf';}}
function removeClickEffect(element){return function(){element.style.background = '#cdd8e8';}}
function addHoverEffect(element){return function(){element.style.margin = '0px';element.style.border = '1px solid lightgray';element.style.background = '#cdd8e8';}}
function removeHoverEffect(element){return function(){element.style.margin = '1px';element.style.border = '0px solid lightgray';element.style.background = '';}}



function openSend2GpsFunctionLocal(){
	return function(){
		if(!userName){
			alert(lang['notLogedIn']);
			// goto the login page
			//~ window.location.href = 'http://www.geocaching.com/login/default.aspx?RESET=Y&redir='+window.location.href;
		} else if( currentTour.geocaches.length == 0) {
			alert(lang['emptyList']);
		} else {
			if(GM_getValue('showGpx',false)){
				window.open('http://www.geocaching.com/seek/sendtogps.aspx?guid=9d2b4990-7222-4b1c-8062-8b753af24ac5&tour=true', 's2gps', config='width=425,height=610,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=yes,directories=no,status=no');			
			} else {
				window.open('http://www.geocaching.com/seek/sendtogps.aspx?guid=9d2b4990-7222-4b1c-8062-8b753af24ac5&tour=true', 's2gps', config='width=425,height=280,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=yes,directories=no,status=no');			
			}
		}
	}
}

function downloadGPXFunction(){
	return function(){		

		if(!userName){
			alert(lang['notLogedIn']);
		} else if( currentTour.geocaches.length == 0) {
			alert(lang['emptyList']);
		} else {	

			// add the overlay while loading
			addOverlay(document,lang['pleaseWait']);

			var gpxForm = document.createElement('form');
			gpxForm.setAttribute('style','display:;');
			gpxForm.action = 'http://gc.madd.in/gm/download2.php';		
			gpxForm.id="gpxForm";

			gpxForm.method = 'post';
			var nameInput = document.createElement('input');nameInput.type = 'hidden';gpxForm.appendChild(nameInput);
			nameInput.name = 'name';
			var contentArea = document.createElement('textarea');gpxForm.appendChild(contentArea);
			contentArea.name = 'content';


			var tourName = currentTour.name.replace(/\s+/g,"_").replace(/[^A-Za-z0-9_]*/g,"");

			var currentDate =  new Date();
			var currentDateString =  currentDate.getFullYear()+"-"+(currentDate.getMonth()+1)+"-"+currentDate.getDate()+"_"+currentDate.getHours()+"-"+currentDate.getMinutes()+"-"+currentDate.getSeconds();


			nameInput.value = 'GCTour.'+tourName+'.'+currentDateString+'.gpx';

			try {
				if (GM_getValue('gpxschema',1) == 0){
					var dummyString = getGPX();	
				} else {
					var dummyString = getGPXNew();
				} 

				//iff the cancel button is pressed the dummyString just contain canceled
				if(dummyString == "canceled"){
					removeOverlay(document);
					return;
				}


				contentArea.innerHTML = encodeURIComponent(dummyString);

				document.body.appendChild(gpxForm);
				document.getElementById('gpxForm').submit();
				document.body.removeChild(gpxForm);

				// all done - remove the overlay
				removeOverlay(document); 


			} catch (e) {
				addErrorDialog(e,"GPX ERROR",document); 
			}
		}
	}
}


// TODO: rename this function to sendToGPSTour
function initGPXTour(){

	// add the overlay while loading
	addOverlay(document,lang['pleaseWait']);
	//~ document.getElementsByClassName('dark_msg_overlay')[0].getElementsByTagName('div')[0].innerHTML = "0 / "+currentTour.geocaches.length;
	try{	
		var dataStringElement = document.getElementById('dataString');
		dataStringElement.value = lang['pleaseWait'];
		if (GM_getValue('gpxschema',1) == 0){
			dataStringElement.value = getGPX();	
		} else {
			dataStringElement.value = getGPXNew();
		}

		var tourName = currentTour.name.replace(/\s+/g,"_").replace(/[^A-Za-z0-9_]*/g,"");

		var currentDate =  new Date();
		var currentDateString =  currentDate.getFullYear()+"-"+(currentDate.getMonth()+1)+"-"+currentDate.getDate()+"_"+currentDate.getHours()+"-"+currentDate.getMinutes()+"-"+currentDate.getSeconds();


		dojo.byId('cacheID').value = 'GCTour.'+tourName+'.'+currentDateString+'.gpx';

		// all done - remove the overlay
		removeOverlay(document);
	}catch (e){
		addErrorDialog(e,"GPX2 ERROR",document); 
	}

}

function uploadTourFunction(id){
	return function(){ 
		try{
			if(!userName){
				alert(lang['notLogedIn']);
			} else if( currentTour.geocaches.length == 0) {
				alert(lang['emptyList']);
			} else {	
				
		
				for (var i = 0; i < tours.length; i++){
					if(tours[i].id == id){
						// add the overlay while loading
						addOverlay(document,lang['pleaseWait']);
						if (GM_getValue('uploadMap',true)){
							//create the overview map
							var geocaches = new Array();
							for (var cache_i = 0; cache_i < tours[i].geocaches.length; ++cache_i){
								
								if(GM_getValue("stopTask",false) && cache_i != 0){
									GM_setValue("stopTask",false);
									removeOverlay(document);
									break;
								} else if (GM_getValue("stopTask",false) && cache_i == 0 ) {
									GM_setValue("stopTask",false);
								}
								var costumMarker = (typeof(tours[i].geocaches[cache_i].lat) != "undefined");
								if(!costumMarker){
									var geocache = getGeocache(tours[i].geocaches[cache_i].id);

									var mapCache = new Object();
									mapCache.gcid = geocache.gcid;
									mapCache.type = geocache.type;
									mapCache.name = geocache.name;
									mapCache.latitude = geocache.lat;
									mapCache.longitude = geocache.lon;
									mapCache.additional_waypoints = geocache.additional_waypoints;
									for(var waypoint_i = 0 ; waypoint_i < mapCache.additional_waypoints.length; waypoint_i++){
										mapCache.additional_waypoints[waypoint_i].note = "";
									}
									geocaches.push(mapCache);
								} else {
									geocaches.push(tours[i].geocaches[cache_i]);
								}
								
								setProgress(cache_i,tours[i].geocaches.length,document);
							}	
						}
						// first upload tour
						post('http://gctour.madd.in/save.php', 'tour='+uneval(tours[i]).replace(/&/g,"\\u0026"),
								function(text){			
									var codeString = lang['tourUploaded1']+text+lang['tourUploaded2'];
									
									if (GM_getValue('uploadMap',true)){
										// if this is complete upload map file also!
										post('http://gctour.madd.in/map/saveUpload.php', 'tour='+JSON.stringify(geocaches).replace(/&/g," und ")+'&crc='+text,
											function(text){
												var codeString = lang['tourUploaded1']+text+lang['tourUploaded2'];
												alert(codeString);
												removeOverlay(document);
											});
									} else {
										var codeString = lang['tourUploaded1']+text+lang['tourUploaded2'];
										alert(codeString);
										removeOverlay(document);
									}
								});
						break;
					}
				}
			}
		} catch(e){addErrorDialog(e,"UPLOAD TOUR ERROR",document); }	
	}
}

function showAutoTourDialog(center,radius){

	if(!userName){
		alert(lang['notLogedIn']);
		return;
	}


	var overLay = getOverlay(lang['autoTour']);
	overLay.appendChild(getCoordinatesTab());
	overLay.appendChild(getMapPreviewTab());

	var queryFilterDiv = document.createElement('div');append(queryFilterDiv,overLay);
	queryFilterDiv.appendChild(getTypeFilter());
	queryFilterDiv.appendChild(getSizeFilter());
	queryFilterDiv.appendChild(getDtFiler('Difficulty'));
	queryFilterDiv.appendChild(getDtFiler('Terrain'));
	queryFilterDiv.appendChild(getSpecialFilter());

	overLay.appendChild(getAutoTourSubmit());

	if(center && radius){

		dojo.query("input[id='markerCoords']")[0].value = center.lat() +' '+center.lng();
		dojo.query("input[id='markerRadius']")[0].value = radius;
		getMarkerCoord()();
	}
}

function downloadTourFunction(webcode){

	// add the overlay while loading
	addOverlay(document,lang['pleaseWait']);

	var details = new Object();
	details.method = 'GET';
	details.url = 'http://gctour.madd.in/query.php?crc='+trim(webcode);
	details.onload = function(response) {parseTourQuery(response)};
	GM_xmlhttpRequest(details);	
}


function showInformationDiv(tour){
	return function(){
		var infomationDiv = document.createElement('div');
		document.body.appendChild(infomationDiv);



		infomationDiv.id = "infomationDiv";
		infomationDiv.style.position = "fixed";
		infomationDiv.style.right = "15%";
		infomationDiv.style.top = "30px";
		infomationDiv.style.textAlign = "left";
		infomationDiv.style.padding = "10px";

		infomationDiv.style.border  = '1px solid #448e35';
		infomationDiv.style.backgroundColor  = '#c6e3c0';

		infomationDiv.innerHTML = "<b>"+tour.name+" ("+tour.geocaches.length+ " Caches)</b><br/>";

		for( var i = 0; i < tour.geocaches.length ; i++){
			if(i > 20){
				infomationDiv.innerHTML += "... (" +(tour.geocaches.length - i) +" more) ...";
				break;
			}
			infomationDiv.innerHTML +=  "<div style='border-bottom: 1px dotted  #448e35'> <img src='"+tour.geocaches[i].image+"' style='margin-left=10px'> "+tour.geocaches[i].name + "</div>";
		}
	};
}


function parseTourQuery(response){
	try{
		var onlineTour = eval(response.responseText);

		// all done - remove the overlay
		removeOverlay(document);



		if(onlineTour.geocaches.length == 0){
			alert(lang['webcodeerror']);
			return;
		}

		onlineTour.id = getNewTourId();		

		tours.push(onlineTour);
		saveCurrentTour();

		log("Download of an an online tour successfull: "+onlineTour.id +" ; "+ onlineTour.name);
		alert("'"+onlineTour.name+"'\n"+lang['webcodesuccess']);

		loadTour(onlineTour.id)();
	} catch(e){
		addErrorDialog(e,"TOUR DONWLOAD ERROR",newwindow2.document);
	}
}


function getOverlay(caption){
	var bodyNew = document.getElementsByTagName('body')[0];	
	var head = document.getElementsByTagName('head')[0];    
	overlayStyle = document.createElement('style');
	overlayStyle.type = 'text/css';
	overlayStyle.id = 'overlayStyle';
	overlayStyle.innerHTML = 'textarea{border:1px solid black;} .overlay_marker{max-height:90%;overflow:hidden;opacity:1;text-align:left; padding:10px;background-color:white;margin-top:40px;border:2px solid #8C9E65; -moz-border-radius-topright:30px;-moz-border-radius-topleft:30px;width:60%;color:black;} .tour_overlay  '+
		'{background:#666666 url('+backgroundStripeImage+') repeat scroll 50% 50%;color: #ffffff;opacity: 0.6;opacity: 0.6;z-index: 9998;position: fixed;top: 0px;left: 0px;display: block;width: 100%;height: 100%;}'+
		'.label {float:left;padding:3px 0 0;width:10em;} .ebene {clear:both;padding-bottom:2px;padding-left:10px;padding-top:2px;} .feldbreite {font-size:1em;overflow:auto;width:30em;} .submit {clear:both;margin:1em 0 5px 11em; padding:2px; border-bottom: 1px solid gray}';
	head.appendChild(overlayStyle); 


	var overLay = document.createElement('div');
	overLay.align = 'center';
	overLay.className = 'tour_overlay';
	overLay.id = "tour_overlay";


	var overlayMarker = document.createElement('div');
	overlayMarker.id = "overlayMarker";

	overlayMarker.style.zIndex='9999';
	overlayMarker.style.padding = '5px';
	overlayMarker.style.backgroundColor='#EEEEEE';
	overlayMarker.style.width='500px';
	overlayMarker.style.marginLeft = "-250px";

	overlayMarker.style.top='50px';
	overlayMarker.style.left='50%';
	overlayMarker.style.position='fixed';
	overlayMarker.style.maxHeight='90%';
	overlayMarker.style.overflow='auto';
	overlayMarker.style.overflowX='hidden';


	overlayMarker.style.top='25px';
	overlayMarker.align = 'center';
	overlayMarker.style.setProperty("-moz-border-radius", "6px", "");



	var title = document.createElement('h2');
	title.style.background = "#F6A828";
	title.style.border = "1px solid #E78F08";
	title.style.padding = "2px";
	title.style.margin = "2px";
	title.style.setProperty("-moz-border-radius", "4px", "");

	title.textContent = caption;

	var closeDiv = createElement('div', {style:"float:right;-moz-border-radius: 6px;border:1px solid #E78F08; background-color:#F6A828;padding:2px"});append(closeDiv,overlayMarker );
	var closeButton = createElement('img', {style:"cursor:pointer;"});append(closeButton, closeDiv);
	closeButton.style.cssFloat = "right";
	closeButton.src = closebuttonImage;
	closeButton.addEventListener('click', closeOverlay, false);
	addOpacityEffects(closeButton);


	overlayMarker.appendChild(title);


	bodyNew.appendChild(overLay);
	bodyNew.appendChild(overlayMarker);

	return overlayMarker;
	//~ overlayMarker.appendChild(content);
}

function closeOverlay(){
	dojo.destroy("tour_overlay");
	dojo.destroy("overlayStyle");
	dojo.destroy("overlayMarker");
}

function addErrorDialog(exception, errorString,theDocument){

	var body = theDocument.body;

	dojo.destroy("progressOverlay");


	var overLayContent = document.createElement('div');
	overLayContent.id = 'progressOverlay';
	overLayContent.style.zIndex='9999';
	overLayContent.style.backgroundColor='#EEEEEE';
	overLayContent.style.width='40%';
	overLayContent.style.maxHeight = '90%';
	overLayContent.style.overflowX = 'hidden';
	overLayContent.style.overflowY = 'auto';

	
	
	overLayContent.style.marginLeft = "-20%";

	overLayContent.style.top='50px';
	overLayContent.style.left='50%';
	overLayContent.style.position='fixed';
	overLayContent.style.setProperty("-moz-border-radius", "6px", "");
	


	var overLayTitle = document.createElement('div');
	overLayTitle.style.background = "#FC231E";
	overLayTitle.style.border = "1px solid #E70D08";
	overLayTitle.style.padding = "2px";
	overLayTitle.style.margin = "2px";
	overLayTitle.style.color = "white";
	overLayTitle.style.fontWeight = "bold";
	overLayTitle.style.setProperty("-moz-border-radius", "4px", "");
	overLayTitle.style.setProperty("-moz-user-select", "none", "");
	overLayTitle.innerHTML = errorString;
	overLayContent.appendChild(overLayTitle);

	var errorDiv = document.createElement('div');
	errorDiv.style.padding = '5px';
	errorDiv.style.textAlign = 'left';

	
	var errorReport = "last GCID: "+GM_getValue("debug_lastgcid","")+"\n";
	errorReport+= "error: "+errorString+"\n";
	errorReport+= "username: "+userName+"\n";
	errorReport+= "exception: "+exception+"\n";
	errorReport+= "useragent: "+unsafeWindow.navigator.userAgent+"\n";
	errorReport+= "gpxschema: "+GM_getValue('gpxschema',1)+"\n";
	errorReport+= "gpxhtml: "+GM_getValue('gpxhtml',true)+"\n";
	errorReport+= "tour:\n";
	errorReport+= uneval(currentTour)+"\n";
	errorReport+= "--------\n";
	errorReport+= GM_getValue('debug_lastcachesite',"");
	
	
	lang["ERROR_DIALOG"]=lang["ERROR_DIALOG"].replace(/##ERROR##/, '<br><div style="border: 1px dashed red;padding:3px;width: 98%;">'+GM_getValue("debug_lastgcid","")+':<b>'+exception+'</b></div>');
	
	errorDiv.innerHTML = ''+lang["ERROR_DIALOG"]+'<br>'+
		'<div style="border:1px solid gray;-moz-border-radius:4px; padding: 10px;margin:5px 0">'+
		'<div style=" margin: 2px; padding: 2px; background-color:gray;color: white; font-weight: bold;-moz-border-radius: 4px; "> Report </div>'+
		'<form action="http://gctour.madd.in/errorreport.php" method="post">'+
		'	<input type="hidden" name="redir" value="'+window.location+'">'+
		'	<input type="hidden" name="user" value="'+userName+'">'+
		'	'+lang['printviewNote']+':'+
		'	<textarea name="comment" cols="2" rows="2" style="width:100%;"></textarea>'+
		'	Details:'+
		'	<textarea name="report" cols="2" rows="10" style="width:100%;" >'+errorReport+'</textarea>'+
		'	<div align="right" style="margin-top:10px;"><button>'+lang["ERROR_REPORT_SUBMIT"]+'</button></div>'+
		'</form>';
		'</div>';
		
	var buttons = dojo.query('input',errorDiv);
	
	// if we are on the main page - close only the error dialog
	if(theDocument == document){
		buttons[0].addEventListener('click',function(){removeOverlay(document);},false);
	} else { // if we are on the printview - close the whole window
		buttons[0].addEventListener('click',function(){theDocument.defaultView.close();},false);
	}


	overLayContent.appendChild(errorDiv);

	body.appendChild(overLayContent);
}


function addOverlay(theDocument, caption){
	var bodyNew = theDocument.getElementsByTagName('body')[0];	
	var head = theDocument.getElementsByTagName('head')[0];    
	overlayStyle = theDocument.createElement('style');
	overlayStyle.type = 'text/css';
	overlayStyle.innerHTML = '.dark_msg_overlay {background:#666666 url('+backgroundStripeImage+') repeat scroll 50% 50%;color: #ffffff;opacity: 0.6;opacity: 0.6;z-index: 9998;position: fixed;top: 0px;left: 0px;display: block;width: 100%;height: 100%;}';
	head.appendChild(overlayStyle); 



	var overLay = document.createElement('div');
	overLay.align = 'center';
	overLay.className = 'dark_msg_overlay';


	var overLayContent = document.createElement('div');
	overLayContent.id = 'progressOverlay';
	overLayContent.style.zIndex='9999';
	overLayContent.style.backgroundColor='#EEEEEE';
	overLayContent.style.left='40%';
	overLayContent.style.top='50px';
	overLayContent.style.width='350px';
	overLayContent.style.position='fixed';
	overLayContent.align = 'center';
	overLayContent.style.setProperty("-moz-border-radius", "6px", "");


	var overLayTitle = document.createElement('div');
	//~ overLayTitle.style.background = "#F6A828 url(http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/themes/ui-lightness/images/ui-bg_gloss-wave_35_f6a828_500x100.png) repeat-x scroll 50% 50%";
	overLayTitle.style.background = "#F6A828";
	overLayTitle.style.border = "1px solid #E78F08";
	overLayTitle.style.padding = "2px";
	overLayTitle.style.margin = "2px";
	overLayTitle.style.setProperty("-moz-border-radius", "4px", "");
	overLayTitle.style.setProperty("-moz-user-select", "none", "");
	overLayTitle.innerHTML = caption;
	overLayContent.appendChild(overLayTitle);

	var progressBar = document.createElement('div');
	progressBar.style.border = '1px solid lightgray';
	progressBar.style.height = '13px';
	progressBar.style.width = '208px';
	progressBar.style.cssFloat = 'left';
	progressBar.style.margin = '10px';
	progressBar.style.align = 'center';
	progressBar.style.lineHeight = '13px';
	progressBar.style.verticalAlign = 'middle';	
	progressBar.style.background = "url(http://madd.in/ajax-loader2.gif)";
	progressBar.style.setProperty("-moz-border-radius", "4px", "");

	var progressBarElement = document.createElement('div');
	progressBarElement.id = 'progressbar';
	progressBarElement.style.opacity = '0.6';
	progressBarElement.style.width = '0px';
	progressBarElement.style.height = '13px';
	progressBarElement.style.fontSize = '10px';
	progressBarElement.style.backgroundColor = '#E78F08';
	progressBarElement.style.position = 'absolute';
	progressBar.appendChild(progressBarElement);
	progressBarElement.style.setProperty("-moz-border-radius", "4px", "");

	overLayContent.appendChild(progressBar);

	var cancelDiv = createElement('div', {style: "margin-top:7px"});append(cancelDiv, overLayContent);
	var cancelButton = createElement('button');append(cancelButton, cancelDiv);
	cancelButton.innerHTML = lang["cancel"];
	cancelButton.addEventListener('click', function(e){
			this.disabled = true;
			GM_setValue("stopTask",true);
			},false);

	bodyNew.appendChild(overLay);
	bodyNew.appendChild(overLayContent);
}

function setProgress(i,count,theDocument){

	var width = ((208 * (i+1))/count);

	var progressBar = dojo.query("div[id='progressbar']",theDocument)[0];
	progressBar.style.width = width+'px';
	progressBar.innerHTML = "<b>"+(i+1)+"/"+count+"</b>";
}

function removeOverlay(theDocument) {
	var overLay = theDocument.getElementsByClassName('dark_msg_overlay')[0];
	var progressElement = overLay.nextSibling;

	var body = theDocument.getElementsByTagName('body')[0];	
	var head = theDocument.getElementsByTagName('head')[0];  

	head.removeChild(overlayStyle);
	body.removeChild(overLay);	
	body.removeChild(progressElement);	



}

function showNewMarkerDialog(marker){


	var overlayMarker = getOverlay(lang['printviewMarker']);

	var dangerDanger = document.createElement('div');dangerDanger.id = "dangerdanger";
	dangerDanger.style.visibility = "hidden";
	dangerDanger.style.cssFloat = "right";
	dangerDanger.innerHTML = "<img src='"+dangerImageString+"'>";
	overlayMarker.appendChild(dangerDanger);

	var anTable = document.createElement('table');overlayMarker.appendChild(anTable);
	anTable.style.width = '100%';
	anTable.align = 'center';

	var tr = document.createElement('tr');anTable.appendChild(tr);
	var td = document.createElement('td');tr.appendChild(td);
	td.style.width = '20%';
	td.textContent = 'Name';

	var td = document.createElement('td');tr.appendChild(td);
	var nameInput = document.createElement('input');td.appendChild(nameInput);
	nameInput.type = 'text';
	nameInput.id = 'markerName';


	var tr = document.createElement('tr');anTable.appendChild(tr);
	var td = document.createElement('td');tr.appendChild(td);
	td.textContent = lang["markerCoordinate"];

	var td = document.createElement('td');tr.appendChild(td);

	var cordsInputLat = document.createElement('input');td.appendChild(cordsInputLat);
	cordsInputLat.type = "hidden";
	cordsInputLat.id = 'cordsInputLat';
	var cordsInputLon = document.createElement('input');td.appendChild(cordsInputLon);
	cordsInputLon.type = "hidden";
	cordsInputLon.id = 'cordsInputLon';

	var cordsInput = document.createElement('input');td.appendChild(cordsInput);
	cordsInput.type = 'text';
	cordsInput.id = 'markerCoords';
	cordsInput.style.width = '400px';
	cordsInput.style.marginRight = '5px';

	//~ cordsInput.addEventListener('keyup',window.setTimeout(saveMarkerCoord(cordsInput,cordsInputLon,cordsInputLon),0),false);
	cordsInput.addEventListener('keyup',saveMarkerCoord(cordsInput,cordsInputLat,cordsInputLon),false);
	cordsInput.addEventListener('paste',saveMarkerCoord(cordsInput,cordsInputLat,cordsInputLon),false);


	var exampleCoords = document.createElement('div');
	exampleCoords.innerHTML = 	lang["example"] + ' <i>N51° 12.123 E010° 23.123</i> or <i>51.123 10.123</i>'

		td.appendChild(exampleCoords);



	var tr = document.createElement('tr');anTable.appendChild(tr);
	var td = document.createElement('td');tr.appendChild(td);
	var td = document.createElement('td');tr.appendChild(td);	
	td.align = 'left';



	var staticGMap = document.createElement('div');
	staticGMap.style.display = "none";
	staticGMap.id = 'staticGMap';
	staticGMap.style.border = '2px solid gray';
	staticGMap.style.height = '200px';
	staticGMap.style.width = '400px';
	staticGMap.style.marginBottom = '10px';
	staticGMap.style.backgroundRepeat = 'no-repeat';

	var staticGMapControl = document.createElement('div');staticGMap.appendChild(staticGMapControl);
	staticGMapControl.style.padding = '3px 0px 0px 3px';
	staticGMapControl.style.width = '16px';
	staticGMapControl.style.cssFloat = 'left';

	var zoomPlusButton = document.createElement('img');td.appendChild(zoomPlusButton);
	zoomPlusButton.style.opacity = '0.75';	
	zoomPlusButton.style.cursor = 'pointer';	
	zoomPlusButton.src = "http://www.geocaching.com/images/zoom_in.png";
	zoomPlusButton.addEventListener('click', zoomInMarkerOverviewMap(), false);		
	staticGMapControl.appendChild(zoomPlusButton);

	var zoomMinusButton = document.createElement('img');td.appendChild(zoomMinusButton);
	zoomMinusButton.style.opacity = '0.75';	
	zoomMinusButton.style.cursor = 'pointer';	
	zoomMinusButton.src = "http://www.geocaching.com/images/zoom_out.png";
	zoomMinusButton.addEventListener('click', zoomOutMarkerOverviewMap(), false);		
	staticGMapControl.appendChild(zoomMinusButton);

	td.appendChild(staticGMap);

	var tr = document.createElement('tr');anTable.appendChild(tr);
	var td = document.createElement('td');tr.appendChild(td);
	td.innerHTML = lang["markerContent"]+'<br><div style="font-size:xx-small">('+lang["markerContentHint"]+')</div>';

	var td = document.createElement('td');tr.appendChild(td);
	var contentTextarea = document.createElement('textarea');td.appendChild(contentTextarea);
	contentTextarea.style.width = '400px';
	contentTextarea.id = 'markerContent';
	contentTextarea.rows = '5';



	// type buttons

	var tr = document.createElement('tr');anTable.appendChild(tr);
	var td = document.createElement('td');tr.appendChild(td);
	td.style.width = '20%';
	td.textContent = lang["markerType"];

	var td = document.createElement('td');tr.appendChild(td);
	var markerTypeTable = document.createElement('table');td.appendChild(markerTypeTable);
	markerTypeTable.id = 'markerType';

	var typeArray = new Array(
			new Array('http://gctour.madd.in/map/icons/neu/RedFlag.png','Red Flag'),
			new Array('http://gctour.madd.in/map/icons/neu/BlueFlag.png','Blue Flag'),
			new Array('http://gctour.madd.in/map/icons/neu/GreenFlag.png','Green Flag'),
			new Array('http://gctour.madd.in/map/icons/neu/Geocache.png','Geocache'),
			new Array('http://gctour.madd.in/map/icons/neu/GeocacheFound.png','Geocache Found'),
			new Array('http://gctour.madd.in/map/icons/neu/Information.png','Information'),
			new Array('http://gctour.madd.in/map/icons/neu/Park.png','Park'),
			new Array('http://gctour.madd.in/map/icons/neu/ParkingArea.png','Parking'),
			new Array('http://gctour.madd.in/map/icons/neu/SkullAndBones.png','Skull And Crossbones')
			);
	// iff we are editing a marker - so please set the right type
	var typeInput = document.createElement('input');
	typeInput.id = 'typeInput';
	typeInput.type = 'hidden';
	if(!marker){
		typeInput.value = typeArray[0][0];
	} else {
		typeInput.value = marker.image;
	}
	overlayMarker.appendChild(typeInput);

	typeInput = document.createElement('input');
	typeInput.id = 'typeInputSym';
	typeInput.type = 'hidden';
	if(!marker){
		typeInput.value = typeArray[0][1];
	} else {
		typeInput.value = marker.symbol;
	}	
	overlayMarker.appendChild(typeInput);	

	var trElement = document.createElement('tr');	markerTypeTable.appendChild(trElement);
	for( var i = 0; i< 	typeArray.length ; i++ ){		
		var tdElement = document.createElement('td');		
		if(!marker){
			if (i == 0) tdElement.style.backgroundColor = '#8C9E65';
		} else {
			if(typeArray[i][0] == marker.image){
				tdElement.style.backgroundColor = '#8C9E65';
			}
		}
		tdElement.style.cursor = 'pointer';
		tdElement.style.padding = '5px';
		tdElement.style.border = '1px solid silver';
		tdElement.innerHTML = "<img src='"+typeArray[i][0]+"'>";
		tdElement.addEventListener('click', changeType(typeArray[i],markerTypeTable,typeArray), false);

		trElement.appendChild(tdElement);
	}




	// in the end please add a save and cancel button	
	var tr = document.createElement('tr');anTable.appendChild(tr);
	var td = document.createElement('td');tr.appendChild(td);
	td.colSpan = '2';
	td.align = 'right';

	var cancel = document.createElement('input');
	cancel.type = "button";
	cancel.value = lang["cancel"];
	cancel.style.marginRight= "10px";
	cancel.addEventListener('click', closeOverlay, false);
	td.appendChild(cancel);


	var submit = document.createElement('input');
	submit.type = "button";
	submit.value = lang["save"];
	submit.addEventListener('click', function(){			
			var errors = 0;
			var markerName = document.getElementById('markerName');
			if (markerName.value != "") {
			markerName.style.backgroundColor = "#FFFFFF";
			} else {
			markerName.style.backgroundColor = "#FF8888";
			errors++;
			}

			var markerCoords = document.getElementById('markerCoords');

			if(markerCoords.style.backgroundColor != "rgb(136, 220, 59)"){
			markerCoords.style.backgroundColor = "#FF8888";
			errors++;
			}

			var markerContent = document.getElementById('markerContent');

			var markerType = document.getElementById('typeInput');
			var markerTypeSym = document.getElementById('typeInputSym');

			if(errors != 0){

				document.getElementById('dangerdanger').style.visibility = "visible";

				return;
			} 



			var latitude =  document.getElementById('cordsInputLat').value*1;
			var longitude =  document.getElementById('cordsInputLon').value*1;

			if(marker){
				var markerPosition = getPositionsOfId(marker.id);
				var markerPositionDelta = markerPosition -  currentTour.geocaches.length +1;
				deleteElementFunction(marker.id)();
			} else {
				var markerPositionDelta = 0;
			}

			var entry = addCustomMarker(markerName.value, latitude, longitude, markerContent.value, markerType.value, markerTypeSym.value);
			move(entry.id, markerPositionDelta);

			closeOverlay()

	}

	, false);

	td.appendChild(submit);



	// now set all previous values IFF a marker is given

	if(marker){
		nameInput.value = marker.name;
		cordsInputLat.value = marker.lat;	// 51.123123
		cordsInputLon.value = marker.lon;	// 123.12333


		var latArray = Dec2DM(marker.lat);
		var lonArray = Dec2DM(marker.lon);

		var latOrigin = (latArray[0]<0)?"S":"N";
		var lonOrigin = (lonArray[0]<0)?"W":"E";

		latArray[0] = (latArray[0]<0)?latArray[0]*(-1):latArray[0];
		lonArray[0] = (lonArray[0]<0)?lonArray[0]*(-1):lonArray[0];

		cordsInput.value = latOrigin+""+latArray[0]+"° "+latArray[1]+" ";
		cordsInput.value += lonOrigin+""+lonArray[0]+"° "+lonArray[1];
		cordsInput.style.backgroundColor = "#88DC3B";
		//~ updateMarkerOverviewMap(cordsInputLat.value ,cordsInputLon.value,13); // update map

		contentTextarea.innerHTML = marker.content;

	}

	// set the focus to the maker name input
	nameInput.focus();
}

function zoomInMarkerOverviewMap(){
	return function(){

		var staticGMap = document.getElementById('staticGMap');
		var zoom = staticGMap.style.backgroundImage.split('&zoom=')[1].split('&')[0];
		var lat = staticGMap.style.backgroundImage.split('&markers=')[1].split(',')[0];
		var lon = staticGMap.style.backgroundImage.split('&markers=')[1].split(',')[1];
		updateMarkerOverviewMap(lat,lon,zoom-(-1));
	}
}

function zoomOutMarkerOverviewMap(){
	return function(){

		var staticGMap = document.getElementById('staticGMap');
		var zoom = staticGMap.style.backgroundImage.split('&zoom=')[1].split('&')[0];
		var lat = staticGMap.style.backgroundImage.split('&markers=')[1].split(',')[0];
		var lon = staticGMap.style.backgroundImage.split('&markers=')[1].split(',')[1];
		updateMarkerOverviewMap(lat,lon,zoom-1);
	}
}


function updateMarkerOverviewMap(lat,lon,zoom){
	var minZoom = 0;
	var maxZoom = 19;

	// zoom out of range? please stop doing it ;-)
	if(zoom < minZoom || zoom > maxZoom)
		return;

	debug("Updating map in marker window: " +lat + " " + lon + " Zoom:"+zoom);

	var apiKey = "ABQIAAAAKUykc2Tomn0DYkEZVrVaaRSNBTQkd3ybMgPO53QyT8hP9fzjBxSrEmDQGeGO-AZdQ4ogAvc8mRcV-g";
	var staticGMap = document.getElementById('staticGMap');
	staticGMap.style.backgroundImage = 'url(http://maps.google.com/staticmap?sensor=false&size=400x200&zoom='+zoom+'&markers='+lat+','+lon+',midred&key='+apiKey+')';
}

function changeType(value,table,typeArray){
	return function(){
		document.getElementById('typeInput').value = value[0];
		document.getElementById('typeInputSym').value = value[1];
		table.innerHTML = "";

		var trElement = document.createElement('tr');	table.appendChild(trElement);
		for( var i = 0; i< 	typeArray.length ; i++ ){
			var tdElement = document.createElement('td');
			if (typeArray[i][0] == value[0]) tdElement.style.backgroundColor = '#8C9E65';
			tdElement.style.cursor = 'pointer';
			tdElement.style.padding = '5px';
			tdElement.style.border = '1px solid silver';
			tdElement.innerHTML = "<img src='"+typeArray[i][0]+"'>";
			tdElement.addEventListener('click', changeType(typeArray[i],table,typeArray), false);

			trElement.appendChild(tdElement);
		}
	}	
}
// ---------------------- THE IMAGES ----------------------

deleteImageString = 'data:image/gif;base64,R0lGODlhEgASANUlAJaWluXl5dfX197e3pSU'+
					'lNnZ2aampre3t3p6eubm5qioqLW1taenp9zc3LOzs7a2toGBgdra2t3d3'+
					'YuLi3x8fKSkpHV1dc%2FPz%2BHh4ZiYmH5%2BfpeXl4qKioyMjMXFxaKi'+
					'or%2B%2Fv8vLy9DQ0LS0tDs7OwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
					'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
					'AAAAAAAAAAAAAAAAAAACH5BAEAACUALAAAAAASABIAAAZ4wJJwSCwaj8g'+
					'jaZkcLp9QJOkhGHgACM2EQzJCv9EiaQSKBEQGAiHT9Y5IGFKBpCAB2uJ3'+
					'gNQgOUgfeEQkCyR7EmN0gk4PJAl8iQyLQiQHjnKRkyWEhiQCfiQbmiQVJ'+
					'AMkFyQGJBSjCAAHISMAHRAWmptgTE28vUdBADs%3D';
					
gcTourIconString =  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAYAAADtc08vAAAAAXNSR0IArs4c6QA'+
'AAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAAAd0SU1FB9kGHQc1Mrt%2FGBYAAAJ2SURBVCjPfdNfaJYFFM'+
'fxz3neOTWNojF9zZyEUF2EFIjrD0TxrmWRWRdu0IUVMiWyoCgIwotC8qKCsAtpEgh2sXctEoLaYANvkkLcNEm8KLqKEpeWpPlu7%2FucL'+
'rbZuuncHDic8z2%2FwzknLLLhHvrGqdfUImzL1IywJNPdWB7hOD7pG%2FfDcM9cTZQDFIf%2BhdRrXolwDhN941rzMRHaM70W4d1MX%2F'+
'ZP2LYAUQ54Ondrq9esGu7x8CLYSL1mywJk3lfrNT8P9zgLRe7SgT3xsWaENzIdWzTVCHqhf2Iu0D%2FhtwhPYOccID0f4cMjj7gHpxcS5'+
'5OH0Hld6pyCddiY6ZnhHtW2CC9k2rS0Ym%2FfuLcgX1bER0qI8Bke%2FKLXk42WGjpwDZdnWkbbMt0ehUTnQpcrf%2Bmd3qH7xAXbL8%2'+
'F4Jrm0db1fMh0%2BOW3wvqOajZ26MFlEuCpVy1TAUM3QmYu%2B7lhm05b1Rvon7A62zrY8UAm3bu7ULAfsba843V5xY5HpfZyr3uDa0V7'+
'3Y9%2Bfs26LQVuzZTR3ORnhwIlpf0Qo5lf%2BDm6aLWnDB5nWPVT10kxp%2B9KKA1bY7yuwFkfLdOT8VY8JK8sB36KFSqPl1QLN4pA9Ea'+
'qV8OmVWftc0SoHPBvhcKbv%2Bu%2BwpmulBhrojkJlalpj%2Fyn1mD%2Bk69f4%2BaNeX7vCe92ryATNCCWWZIoI2SzF5LQdm1f7vgJvT'+
'84Vjz7OU2OO39thLEPXmuU2NFNRhEqjFOf%2F5sxFl2ZKUxs7XMi0IRY%2FUzlAhNWZuuMWY83fHTx41tDNS92V6VdMPXfMj%2Fmi9my6'+
'Ez%2F9B5C7LMObmdpxJsJsDBrxP%2FYPYYz40LZq7AUAAAAASUVORK5CYII%3D';
			
					
addToTourImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAAAd0SU1FB9kFFAUXKNiDRngAAAJmSURBVDjLjZPPS1RRFMc%2F972n1qiUpqMRaj8UXPVj46Igw0WrKIKkwEWSCC4jjKLoX5BoU5GUJg6KFrVpFYiBEAouAkH0Of4endHRKSSY53v3tHgzbyxddFb3Xu753O%2F3nHMVwOBw5LpSvBQtFQIggpAJkV1lGCOe53a13Ln7lYNicKg%2FtrWdlIMinU7LenxNPn4e%2Ft0%2F8P7Jv7kGgOu6x48eKWEzmWA9ESMWX2FlbYml1XnimzF%2BplLcuHbzcEW48mlfpOfxPoAWQRBcz2XWnsWetbFtmzl7jpmZWaILUQzD4MrlplBB%2FqFn73q7G7MAC0C0BgHPc6mprvaBotGiEa1ZXl7hw6ch8q0Czp09H%2Fo%2BPtYJjAYArTUArreLbUcR0YgIon2QJ5q8vDzCleUopXB33atv3r6y2u91uFbWgg%2FQVFdXAeIDBH5cbMTZ2AQgXV5GQzzB6LcRU0RbgJuzkGnfQnQeUf4awNnY5FJbGyjFWHc3%2FoMa0cI%2BC0opTp05jVIqqPJGVqEEk4FoHajOAPyNaZoszi%2BSuHUbN7nlXwiFfIVKkVdYSMQwKAJTGcYiUGFlJfkAi9q6WmLJLRpaW4MXdUbRhebm4Gy8pyf8dxsVWIaJPb8AwK%2BpKf4nAgsKMAyTuro61sNhpicmAMgvKuJkfT0AC9PTODs7mRE0EmjNHgsK0zQBaJqeyhRS8aXkWFAwZ2eHFtE8f9HliUgN9x%2F6AMu0Vre2kydKS8vI1T%2B30ns6kEqlsCwznk476cCC4zjtA4OR147jVOV%2BsZ9UXlxMdHLSBxUX09vXs%2BJ5bkfng0cC8AdIoVh%2Ffv3rlAAAAABJRU5ErkJggg%3D%3D';

autoTourImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAFMAIwADJfKnZwAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9kKEg8hB1Dip48AAAJvSURBVDjLjdNLSFVBHMfx73%2FOued4r14wpSLQNj0JokUtFIKCgqIXPQgikqSijUrqoqA21lIkywoiCAqyRUZRFBGFoIEkFdHGoPcLF75S79Nz7sy0UK6kIf03s5j%2FfGZ%2BzIwwR7UecLYrl91a0yOiuxpu82Vmj8wFXDzopPedeRrtf98V9r24lRsf%2BpkRpbpzob43tlK3NzVhBODK0ZILYSZRa612ZiI1NzMEqRGUDciO%2FmDwUw8f3z7na9%2BLz3U3s0tdgCAzXlfV%2Bk3F4vPwPD%2B%2F%2BFKVB0B65DvhyAeYGKE4HqNy23E%2BvutcAuACYI1y%2FRjZbIZsNjOdTzlYnaMgXoprFhEMjRIM90GYAGuZBgCbHsCEKbBmatKwbN0ueu%2BcpGxFJb5fgHKL8OML0clf%2BU3yAAMvMalB%2FPmriC1aizgRNh1upvPaETrfPCOdGsOGKUoXLGbL9j0UFcWBsWlATyTo%2F9DL4KtuhpPwO4gxmnWpPtTAhtIyQAhTAwTj%2FSCQTCZmRLCa4iKX4rjHcnEQ16Oh%2FjqvO9r%2FupXmlmpiC1fPjqBzOYJsCqNDrMlhTI6zp9ajdci5ll5On1iD0SFDX3ooceOzAQuIAjGKx9eeA7D12EYcNfnWnIiP47oYrXFcfzagRCGiUI6ws2YHVmseXX3CtuObAYh4UazRWNf8G0AEpSIYDA%2Fb7k03RKKTo1%2BItQZrNK4XnQ2ICCKKB2132duwHwvcb%2B3A8QsmT%2BAXIlNRI35sBiBickFaxcorOHS%2BgluNjfmGwrJKoIPC8sopQNBhGkRM%2FjdeqY5eCIOg1lrr8B8lIjrieZdrbmTq%2FwA8AAC7ufHXbAAAAABJRU5ErkJggg%3D%3D';
mapToAutoTour = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAeCAYAAADTsBuJAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAExgAABMYBQzIXCgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAA1rSURBVGiB7Zp5lFT1lcc%2F9%2Fdevdp6q%2B4GekGWRhYbg6IYCBqJo4i44IwBVBSPxkCjTkbHMzOZjMlxOjNzJqPRURmNoMQcF1yYk8kxGeMSd0QQjIqgLAo0SyM00NB7d9X73fnjVRfVbTXKYpyj%2BZ7zTr3ffn%2F3vt%2FdfiWqypHi6X86bl9jU8fSLa17Zt76kHYc8URfY5ijGdxv4MjY%2Bd%2B77cLhA6rX3jFLRh0ror5OOCwB1NaKqZ0pXndZ%2FC4Tsu0y5ZKaqlMmXrxswdzS6489iV9tuJ%2FV4e7ZMjLkFV0YjRVOP3XQeVWtQ9c3AcMBsF2qfhdd%2BzZSfcKoRFnl0DsXXVd%2BQefeTy69%2Filt%2BaKJ%2FyrgUwKYf6UMFDc2JRJLXJaXKB81burfxo8bdUZRUf8hEooW8tL9l2aMhvWtqigiQqq1gbho%2BOwLZk5989Vn1tw127vkpke6%2Fvin3c5BiIgBilV1z5dFw%2BeBZBvhB68re6B44Il%2FWVI1IVE2uNqJxIpAFQVc1yVW2J8Vj3y%2Fs6Gxc4%2FjiFaVRctGTrzcTe7fjJ%2FsINXVTirVgarDmjVrGj%2FeuHbCzU%2Fohi9lYyJFwC9U9fIvY%2F3Pi8wJmH%2B%2BhBPVw6cOGnN%2B6bpN9exqWkc4EscLR%2FHCEaKxGOUSo6ioODzsWxdXFhXE2f7WIlRcjBvG%2Bl2IcRAMNtXGiOHHJ3btqr8W%2BGHvRUXkBGATMAn4WFU%2FFpGzgKSqLu3V9xtAGbAUGK6qq0VkDLAdmAisVtWtvcbkAWcA%2FUXkNFVdma4fDFSq6rJjx8KjQ8YIayJ89pARYws%2B2bUT1wHPFbyQIew5hMMeYc%2FDcR38rmY6m7bS1bSV0iGnUffWYppbWnGipYgxwSMORjsJh9xpfax7C7AI6A%2FMF5HFwDTgVBF5HEBEEiLyG%2BAi4BvA48D89PglwKMEgrleRB7sNb8HDALiQKUE%2BCUwFzhJRP5HRI4%2FevYdPTInIJof%2F35Z5ZD8uvUHiMXi5Id9wmGLFxG8iCEaDeGFHEyqDduykyQRHGMoHTSGtsY66rYsp2jgaYQdxZouRITyivIBd8%2BSATcu1l051r5bVVeKyHvAXao6C0BEqkWkHJgOLFLV36brVwL%2FlR5bCUxU1b3ptr8TkUmq%2BiqAqu5LC%2FXbqvobEZkMvKuq96T7LyUQxj98ATw9LAQnQERcxxnbkVRcx%2BC4EdQrxomX4eVXgAitu99nxxv34RPGiRQRySsmmh88JYPGUDrsTPbu%2BJCdDY2kJA8xDhUDygtD4dh3%2B1h7U%2Fp3M1CfVb8NqABOB17Pql8JdKXfP%2BxmfhqvAd85xD7PBN7IKq8BRh%2Bi%2F58MLsB%2FzuK0EwZWFTTs78JxPaxN0tawgdYt29HWHdhkB0mTTzi%2FH4mikWiqHU2C2qwwwk%2FiFg1j375GdjRsIy8%2FweAExguHZwP3HQFtjwPXAneky5cTqBaAk0VktKquTZevAO49xFyPEXzxb6fL5wJ%2FOAKajjlcgLx40ayqquHFO%2FfvpsDvwvg%2BGAP5CSjsjxgH14sQj%2BWRlxcnFovhxeMYMYAP1iccbaMg1IIbLSHW2kxrcxPEBlBc3H9Iba2YW29Ve5i0%2FQ74qYg8SaDL64BuVbYS%2BHcRaQcUWKrat7elqutEZEtaLSWBZuAnh0nPFwIXwBgpi4ZdqgY4gAfiYETAcRHHQ4yHOB4YD3EMOBab7MCKA4C1KQQlHjHEXZfieBRbLBgxFCaKonyAB2RyRap6ZdZ7CzA7q%2FyvWfTdIiIOEFbVtqz6JlWdJiL5qtqca2Oqup%2Fg1HSX7wHuEZGoqrYfBc%2BOKTJG2KpF1KLWR9WSsj5kYgTFVxBVFEXTsQGqCIqqDR7ro9bH%2BinUphCvgGR76%2BF%2B%2BT2gqj7Q1qt6W7qtJ%2FOvkjhRdgATWKDr%2BpivB%2FOfPkPyO6M8krOvsHDm8%2FrMkdL%2BeZARgIigvo%2Bqj1qLtTbr3Wftig3U7WolFHbxW9vgQDMdrsfoCUM4riwOHBRe929IPFTtkadb%2B4CqzsnZkI%2BQohDF%2Bbxz%2BRE84OJcbaJfvJ3ICEAxWHtQAKoWTXahRli%2FegtN4TwmTxnI2ne2UT1pKDaV4q3ldex4%2FQPejCaYPnUwaLcAAuGBpJ%2F%2Fv4h4tLSkuAYAZT6QB9yO8IERln%2FR62cJQNJfbloAfor6FavJHzmUT1otp5%2BaQNVSt76e46v74znKN8dXsm9wHiue3c6Blk4KYhKcnO7TAxxSAHNlGvDXCGOBZpTluPwYnwsRjuN%2B%2FXvmyBgMC2nkdJ5Sv8f4GpkFTKKR60nwBhm3msXUSDtwdUYVzZOLsdyAcAqBEV6JUjv1GV0L%2FApgyWS5HchTeH7m83rw6xeRJecwB7gMOBHYJMLzkQg%2Fu%2FDpwDY9NVnmCFyB8vSMP%2Bid3UOfOkceEGE48OMPzmBZ9VJeAg4QRPY%2FOOhHiknr8ECFtK3byJY9nbzzdh0nVfdDsGAt5YOK%2Bai%2Bma6OLprq99JU38ikwQ6NLcngBGWEmOaV9KGB5sntCIsRXsFwAcLVGHbj8zpwAcrI9CeSD4xndE5JlqOMZgkW5S407e4qj6DchZP2mmrkbpSHEV7AMgX4HrAPYRVz5a9yExigtlbMknP4HbAAOAvoB4xX5Sft7ax%2B%2FBwZEMicKmCSGkZkjxdhHDBJldLqtQhB%2BuUi4Dag4mA2VAyqPtZarO%2BTrN%2BJFvajqaGFeNhAZyep%2FU1UloRY8%2FYmGsMOO1uVPV1ChZuk44%2B7qDy7LEsNBb%2FkunGbK%2Bcg3IhhPL%2FQd7JaXqNG3iLw2397KMb0QJBRfIIbJI8UDwG%2FZ2E6Rpgn5wHzgHEs0PezRr3MXPkQYSE18joLcmdNT1jKzcD5QKMI%2F6YuD5NkMvDPwHBXWEgfNuQQEIRlKvwoK5IymS%2FYaoqOpFLqKamUz56tu2l8aSX23Q9ZtqmdlBi%2BU5KkPRLhxskJbhiWZEhnM%2B2dyYwnpNZH%2FRQ5bbBwDfBoL%2BYHWKCLgRWHuaG%2BocwGHu3F%2FACVzCeIC87ta7gIVwfTcM%2F05%2FWOGc9ow4wXdLEoN6e7XPTY%2BVJw2GQJP5v5nL6WEYCIk2Ec1rI5WsrY1m2MCHfSLg4PNyZ4s6SKiV4TgwcX8H4jlISV4k92U%2BT47G6z7G1KBS5q%2BrF%2BirTD2hsnEwRTfeG9w93QIXASmomAe%2BJWtWjfaYmF4ySEcgKAwpPZbVrM74EmQNwk1SrpjWomWu9GONfcFt6F7CtJ4wbLAEaEseOrWNTYj6JUG6dt%2F4Cbxkf5i6ooWCXev5CdLcp1xY2U%2Bh2sbIDH6sNU9ovhuF7mMY5BVHNde%2B5CqcjJlABlmbdUOk%2B0m9Ic%2FUbkqOsJpR6hX5%2FtQgLIqX7mrtIksAPA9M41HeBkoAAg5FCHsjmYjhO7u9TWigGG5prb6wqYbQCsqjFOCMRBxAFjcF2H704bjf32t%2Fj5xgj1a3cw6uM1nFHYwaRd6%2FnBsE4KHEtzEpZsNfxo%2BkBCoTBOyMNxw7ihCMZxEEGWvEphr%2FWXIszkGol8irJrpYLszT6gm4HtJBmbYx9n5trcp9aCS6iVT1%2B%2F1sgwYAyHcDcF%2Fjf9euOSKXIqwJLJMgjlX9L1717yrO4UzST7xvz6PCmvrRVT%2FQZXAZ%2FeYxYMgG9xcUI4xoAxGONijItjHCpKYlxx9QRe0AEs2234uAnW77P8ehPUvufwq7owkyocNm9pwRLCdSO4XiAA13goxhxoIT99RRjA5TYghMejXC%2BJTP0cGYjLfwM9o2fhVYSbuErimbp5ciXdd9OHQog7gUJ2sIhrJT9Tf50MAZ5AeZr79c2%2Bhiv8I7AVGIll1ZLJshbYhDIV6LBOYCNmvMiHwF4g7Ptsrl7KRpSHPou8bgE4BoIckNN9ChyM6yImRKJ5PzUnehRWlHDLxiLu2l%2FJc94QuqqGMejMk9gxZBRVoyqIxmI44SiuF8ONxHE8DwySTBGFrOj0Xm3B51yUEnzqqJFXqJHXMWwAXkX5ZQ8qU9wC9CfKNmrkOWrkfZQfovz8MwVwr7bgMAXDUFy2MU9epEaWYVkHbCBJ7qg6jRkv6AFCjJMgO9sJVKebXrZwyqXPamCvVFUs0whUVpjALX0ZeOVQ8wfHUhFVP7jNUkUNGEl7d6Is225ZtbqN8hEDueLiGNWDCzGGwMUUGDX4YM6ILKNrXA%2FXGKzi0jsie1A%2FAs5ijoxBOAVDCljB%2FbqRGhmGIZrVt46%2FkQm0800MJyJsQHkTpRg3yzg20E4JZ2EDfZzBfboekUnUMAbL2CCBxaqMq3qQ2TltxYxntAGYtXCchBJFDO9wqJv9nLb27jf9RV0GDHzybBlmLK0zXtZPckzXgw%2BiqtwxO3%2F%2B9MuuvcExQaNaRcUiNtAEyVSKxqYOSgvDqAUxmvbvFVUfUVD8QB6ablMFo6x6a%2FmBa%2B7eMrGli42qmsy1wa8zXICnlrf8R370kQuKi4ti1oqAIt1yEjBWsaJs0qCc%2BdBFMYCKilXIqPn0IejoTJrVHzUubOmiBeiZRvgzgPQJEJEwUEJw43RU6eNeiBPcAzSm8%2FN%2FRi9k%2FhckIlEgBKSO4fwxgnvcZj2afwF%2FhfF%2F%2BkeeoREnKEoAAAAASUVORK5CYII%3D';

uploadImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAA'+
'XNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9kGAgsHHfy%2B'+
'z5MAAAMGSURBVDjLhZNfaFtlGIef75yTHJamSZqkp0m6pja2KAu6TleZFMFOUUEQbyxzbBeVua1FBUUmuAtvZE4ogoiIF'+
'2LFMfTCPxeCMoRZCgM75phYJ9tscVnaLknTrE1yTk%2FO%2BT4vdHPWC39X78X7ey5e3kewKXuOTB0CDuqGsU2BqaRsKM'+
'WspmsnTh7b9%2FHmfXGr%2BNong0Fd%2B26gL9W1695e%2BroThEyT1brNlUKZc3MFLl8tnRVCHDh5bN%2FP%2FwKMvvz'+
'RUFtky49Pj2wX2wcsVus25cWrGGELtnRAs0x3V4LZuSLfzsytIMTumxADIJEIf%2F%2FYcF7ck4tTrSyTzOaJJtM0nRbL'+
'hXkM6aL5No8M5fClSpw6c%2FFD4EEA7bmjn76ZsjoiI0P9BDSJZ4RBEwQMg2DAIGQadCXaSVuddMbaGMpvpTcT37X39RN'+
'jAFokGjqwM5%2Bltlrh%2BkYIK3MHSoFUgNAQ0mWp2uDr6V84NXOOqKnY1p8BeAbAWG%2B2OntTHcxeLpEbsJDqn8vWa1'+
'UeGMwjhEApRXHpOo5tk%2B6MAuwEMBzX00wziBa2qNUdfKkImzq%2B7%2BPWywiRBOCpd3ejlGJl9QaTo98AxAEMXdfkj'+
'YajtTmLhA2TUiNJJRDE8yVO1WOw1WJjwwXAetGncTxAw3YBqgBGQNOWF65VMjv6U%2BR60vxRKDJzZQ2XILbbxuQXFzCF'+
'j5QS3%2FdpP2hz9L1RymsVHcBQvv%2Fl%2Bd%2BuvZDPWQD09nRz%2BPOHKFYdQOBLiZSKnrhJYdIjMm4SPexSfGu9FBv'+
'ntAAYe%2BOz9eH77ww%2FvCNLJtHOo8eHMQ8JpFJIqZBKkY0HcH1F01XUNmprztb5nxYm%2Fn6kWqmyf%2Fqs%2FEpKuO'+
'%2BuLlbqHt6kdgugaeBHwXEloecbnpteurQwscmFJ8fefjab65mKRGPBu3MpUskIphmg6bRYKtd4Z3qM2EvNpmst%2Fvr'+
'7K3YdoPYBI%2BJ2s2LxvuDj%2B1%2Bd0s3QE%2BhGDIRQSnrKa83%2F0DxC%2Bv2VxYWJv4r%2FsfH%2FEhvn9M35dsCf'+
'3LtHH3G572IAAAAASUVORK5CYII%3D';

downloadImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9oCARELF8DONKcAAAMLSURBVDjLdZNdaJtlFMd%2Fz%2Fu%2BSWiaNG2zpEm6NmtsmSyr7XQdkyG4rfiBsk1wssl6Ua22KV4oiIpe1AsZilcqcwgbVhxjUNAiiDJ2M4LC2o6xYTdh3eb64domS2Lz8aZv8j6PF9rJKvtdHTjn%2FC%2FO%2F%2FwF6zj0zugg8LpuGFsUuJSURaWY0HTt1OmjR75ePy%2FuLb77TbdT137uaAs17XwkSluzH7fLRbZgMjOX4uL0HNdnlyeFEAOnjx65cp%2FAS2%2Bd7Kmtq7lwYHeX6OoIki2YpP6cxfAEoaYBSimam%2FxMTC%2FwU3L6LkLsWRMxAPx%2Bz7mndsVFZ6yRTHqRDa1xfBvClMoVFuduYkgLzTbZ2xPDlsp%2F9tdrXwGPA2ivfPDtR6FgQ93unnYcmqRqeEATOAwDp8PA7TJo8nsJBwME6mvpiW8kGmnc%2BfL7p%2FoBtDqfe2B7vJVcNs3SqptgZBNKgVSA0BDS4k6myPj53zibvIjPpdjSHgE4CGDkS5VANNTAxPVlYh1BpPrvsoVchh3dcYQQKKVYuLNE2TQJB3wA2wGMslXVXC4nmidIrlDGlgqPS8e2baxCivHuvfcse35qih%2FPJQm0bAZoBNB0XZN%2FFcvUlufxmLMsp7L8sbTCraU8t%2B9WUUqxf2gIgFKpxKbmAEXTAsgAGA5NW7w1n45saw8Rawlze26B5MwK1mv7kFKxb3CQzEoZpRT5fJ5LV2%2BANwowBWAo2%2F7u0u%2Fzb8RjQQCiLc1MPttJsWrzQmIYqRRjx74k4HWQ7O2FisRcrfJENr11D1wWAP0jZ%2FK7HnvI8%2BS2ViJ%2BL2NbO%2Bl9dfhfNxRKKQJeg6pUrFYUFXO1FNYqMydHRv55pNxyuu%2F8pPxeSnh0cxMrpmTsi2McSCRQSjF%2B%2FDgNtQZWVVIqle2aXGper1r3Z%2BG5%2Fk8Ot8ZaRut89c6HYyHEm4fRhGD%2FUIJK1ebMZ5%2FzS9%2BH14RuHPpfFtaob2xzPt339qjucj%2BDbtSDEDtOvKdeTCSsHz79OD1s5jc%2BMI0P4gRcXqsHoGt9%2F2%2FVizwwXdoGLgAAAABJRU5ErkJggg%3D%3D';

					
printerImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAA'+
'AXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9kDBw4xF2yCC'+
'lEAAAG1SURBVDjLpZM%2FaFNRFMZ%2F99rgK0bSgFCfPHBSpwyhKU5xcNNFKNRKoYI4KtgsuuiLzegfyOagixS0SaC73T'+
'I4BbpkzKjwOjg8fGBfcn33OMT8I2kqeOFwz7nc853vnO9e%2BM%2BlxoN6o7YD%2BP%2BQV7m7vlGeOq03atLtdudaHMd'+
'Sb9RkkLMwC77Vap1YulAoTMQzAXK53KhHpSZ2EZkPYK2l3W4DoLWeAsrn86cz8DwPrTVKqSk7lYGI0Gw2hxW11hSLRR5%'+
'2B2gAglUrx4PLjSRlf%2BM93AN9xHK5euYa1doI%2BwOvDMu42BFW4c36TOI4BKgMAKfsvSZIEY8zM6a%2B%2Fu8XFUt%'+
'2F%2F%2FuY3CsX1XzdHLSil6HQ6uK7L7bc3yGazGGOGrQB8ewXL28LZ%2ByHR%2B3Psh7sjgCiKiI%2BPCcOQdDrNhUcD'+
'JoKMPVkRwRjD8hPhhz82RK01P6OIg4MvBEcBwbP%2BZfU3SRAUCrekyGQyBNUZKiRJwkphlRVWx%2BQSrBUqX59yqdTnc'+
'VRVnFmAtaWtEUCv18PzvBNf3OLhIo7TV%2BHD5kestdTqe0MZPwP35n2%2F%2FXB36K8tbQ3cvT8oBcB%2FjD7SRwAAAA'+
'BJRU5ErkJggg%3D%3D';		
				
newImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAB'+
'mJLR0QA%2FADpAE8017ENAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1QISDiYc07YZKQAAAWpJREFUOMutk'+
'E9LW1EQxX9z741WJH0lgtDKWxbc1O5cZqkb8w2ycVm%2FRd6y3XcjBMSC38BNN90qhVJKslJKSVqEEP9FYpved8eFJ'+
'sYYk1R6NjMMc%2BacM1Iul7drtVqREZid%2FcvcXJtn0W%2Fyy5%2Ff5aJvH%2BHPvmTDGaVSScfh%2FHhTL0%2Ffa'+
'Oe8oJcnK52LxuKutrLr2jIzrqvSbDYJIQAgIj31jNlj2n4h474iZgnrTCbY9mrHt1tTzld7BwbJ3WrkCGvqiHmFuAJ'+
'gMSpG01%2BL4F66%2FqyD5OtebzoLTIE4EAuCABduNFkIOk%2FQ59hQRdNpQNC0ot6besamFffQ57uHAq%2Fx4Sfgs'+
'VoBFO9f6OlZ69PM%2FPeDkRFEBOUpHV1DdYE0%2FQE8YWvn0GxsbL8FcKPItzWL1zwiQhRFNBpJT9QwIfp%2F0497E'+
'YY5eIh8x8GwpcHZsB0zqd2xEXK5HI%2BBi%2BP4Q5IkxX8hxXH8nv%2BFK8w9mWB7rBTJAAAAAElFTkSuQmCC';		

sendImageString = 	'data:image/gif;base64,R0lGODlhEgASAIQDADs7OxBpAI6OjjH%2FAML'+
					'CwtHR0dbW1tvb29zc3OLi4uPj4%2Bbm5urq6uzs7O%2Fv7%2FDw8PLy8vX'+
					'19fb29vf39%2Fj4%2BPn5%2Bfr6%2Bvv7%2B%2Fz8%2FP39%2Ff7%2B%2F'+
					'v%2F%2F%2FzH%2FADH%2FADH%2FADH%2FACH%2BEUNyZWF0ZWQgd2l0aCB'+
					'HSU1QACH5BAEKAB8ALAAAAAASABIAAAV74CeOZGmeaAqsq8pGDqMA53ooj'+
					'ERVEkSXAANi4ZhcBEjM5jdaMZDIzUYjZTYll4wUKsBYRQAMd2ORLk0Aqtm'+
					'CDLi%2FH8BmvAkMAvC0emu%2FB4ATAm6DbgN%2BJAAPE32GjYZ%2FiAyEg'+
					'4%2BQTQcJDWUAfW5oBAUsH3aWQKIigyMhADs%3D';
				
sensGPSImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAA'+
'AXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9kDBw42Fc3N%'+
'2FboAAADvSURBVDjLrZIxCsJAEEXfiqlEiGWQFB7BzqCgghY2egqLpNILiKfQC3iHFBGioNh4hwgeQHuLWMRgVndDQD8M'+
'O8XM4%2B%2FMCN6KM7mgoEr8KB0g%2FoeDQhDxWfy4DgEw7EBXqwakjSq9YEpAWVEoKQ%2F8BQBYLpZ0nDYAg9G72XQJ0'+
'%2Fy%2Bpq8dYtqsUmNVwMHhdMwFNVYQkbi5r%2BlLQzTsgK0fMPOnAESXC12nxv50w6izy7qIPI2DwWhIZQzWHCzAaiVR'+
'7SmceJo1TjZnqTjPARlAnPeaLmEzTsJ0k5C%2BYNjB187TuWQVefIaRcHbF7o7eAJiRWHsHd8OaQAAAABJRU5ErkJggg%'+
'3D%3D';
				
downloadGPXImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9h'+
'AAAAAXNSR0IArs4c6QAAAAZiS0dEAO0A7QDtVoZlJwAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9kDBw8FH9ixG'+
'6MAAAFLSURBVDjLlZM9T8JAGMd%2FT1N3QspA4g1%2BAOPmzm7LrHHqBi5iZDUpcXKRCRfBQRfjQgmDG4vfAwwmOBzE2a'+
'E4NFdpaUCf5e65y%2F%2FtXqTX6z1Op9NT%2FlFKKXzfFwCCIFj%2Bt4IgWBoy20zm8zlRFAEgIomaZVkp9WKxmOoTgii'+
'KGA6HyYbneQwGg6SvVqu5cazsguu6eJ63FbhGYGyLSEo5DMONBHZ2wYAN4TYHKQJjPQ980o33bHuHQyqbI4RhmIyrVT7%'+
'2FwyEa5X6%2Fn2u%2F3ICXxQOFGqO1CCKCiHB876K15ll3U%2BBZG1QzdvJxA4UaIzsbAUBrzf61g9Yap1RCclzudWBcz'+
'7kFAMdxmLVBKPEJrDLsXsbjuJ65hdUn%2Btp8WyM9uq1QbvxGAfi6o2IrpZ5ardbW3%2Fi%2BmPA9icEXB1cd3%2FfPMu'+
'Y2lzl1o2zmP0Dsk%2FeAbIdSAAAAAElFTkSuQmCC';
						
mailImageString = 	'data:image/gif,GIF89a%0F%00%0D%00%C6f%00PR%A4SS%9Dae%BAdh'+
					'%B8nl%AAwv%B3uw%C2%7B%7D%CB~~%BC%7B~%CE%82%81%BE%7F%81%C8'+
					'%87%87%C3%8B%8B%CA%8A%8C%D1%8C%8D%C6%90%8E%CF%90%8F%CD%8F'+
					'%90%D5%8F%92%CF%91%94%D5%90%96%CF%93%96%D7%97%98%DE%97%99'+
					'%D9%9D%A0%DC%A8%A7%D5%AE%B0%E4%A9%B2%EC%B3%B2%DC%B1%B3%E8'+
					'%B0%B5%E3%AC%B6%E5%B7%B6%E4%B7%B9%E3%B7%B9%E4%B9%B9%E3%B9'+
					'%BC%EC%BC%BE%EF%BF%BF%E8%C0%C3%F0%C4%C3%E9%C2%C4%EE%BF%C4'+
					'%F8%C0%C6%F9%C7%C8%F6%C3%CB%F6%CD%CC%F3%CF%CE%F0%CE%CF%F6'+
					'%CF%D0%F7%D2%D1%EF%D2%D1%F4%CB%D3%FC%D3%D3%EF%D3%D3%F8%D4'+
					'%D4%F7%CF%D6%FC%D6%D5%F3%D5%D6%F4%D7%D6%F5%D7%D7%F8%D5%D8'+
					'%FA%D9%D9%F4%D6%D9%FD%D9%DB%FA%DD%DD%F5%DA%DD%FE%DA%DD%FF'+
					'%DD%E0%FA%DE%E0%FD%DF%E0%FC%E1%E2%FF%E4%E4%F8%E3%E4%FE%E5'+
					'%E5%FF%E6%E6%FA%E6%E7%FA%E7%E7%FB%E8%E8%FA%E8%E8%FF%E9%E8'+
					'%FE%EA%EB%FE%EC%EC%FF%ED%ED%FE%ED%ED%FF%ED%EE%FE%EE%EE%FE'+
					'%F0%F0%FE%F0%F0%FF%F1%F1%FF%F2%F2%FE%F2%F2%FF%F2%F3%FD%F3'+
					'%F3%FE%F3%F3%FF%F4%F4%FF%F5%F5%FE%F5%F5%FF%F6%F6%FE%F8%F8'+
					'%FD%F9%F9%FE%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00'+
					'%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00'+
					'%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00'+
					'%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00'+
					'%00%00%00%00%00%00!%FE%11Created%20with%20GIMP%00!%F9%04%'+
					'01%0A%00%7F%00%2C%00%00%00%00%0F%00%0D%00%00%07%85%80%7F%'+
					'82%83%84%85%86%83%0E%17%09%87%83%12%1E1%2B%1C%03%86%06%18'+
					'%25AR2%2C5%14%84%0B%19(FVbL-%40C%26%93%7F%0F%22%3BM%5Ded4'+
					'7JKG%16%82%15%20%1F%23)30%2FQSUW*%02%7F%13.9%3E%3D%3C%3AN'+
					'Y%5C_%5EE%07%82%1BDHPTX_bcO\'%0D%00%82%108PUZ%60aI%24%0C%0'+
					'1%85!U%5B%5BB%1D%08%8C%11%3F6%1A%05%8C%83%0A%08%FC%0B%04%'+
					'00%3B';	
					
					
settingsImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAA'+
'ABmJLR0QA%2FwD%2FAP%2BgvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1QkaDBM5i2PCSAAAAfBJREFUOM'+
'ulkktoE2EUhb%2BZ%2BEyKTRQKgkqwzMaFtt1FrC40FGJm60JwIVSkqLUtElICFQNDQqBrQXRlQIriwomN0GJXgtI2iUk'+
'XFYJVadOXhiBERDozbmaGMR3rwrP7ueece%2B%2B5P%2FwnBOcjnVGigArI8Vgi9xdNNJ1RbI7YUlT7r%2FYDqKaZq%2F'+
'j6tQHNbLQd6YxiNBp1I51RDPdaw6pFAcR0RolaZKur19vmZhwFePDwPvFYQgZyACKgDt4cMp4%2BmzAA9fatETbX15A6J'+
'er1r%2Fdas4ndGRUsMYBgFW8MDBqatiXoum7oukZhfk4ovC8CyDsFK7R0sBHpu0i5UmG59gUgGY8l7v7zjE68yr80SpUS'+
'3Sd7KJYLmBNMArqrQTCSOgzUrPeVkE7XCYmjR47RbDZ5N%2FcWtzU8TvH4cJi%2BUCcdAS%2FZmU2Ot39LLn1eOtd9qoe'+
'AP8BKbfnyhfD5%2Bemp11XAABCDkVQXUHs0JjNbXmS2vEjHQR8A5t5yLv8CSZI4e7rX%2BmR2HiJQHB8OM%2FWmxJamI%'+
'2B7zs1Fv2iOaI8vZJ4850O7nTKgXYMxpAMDuXR72%2BA7x88cvsvkFgHCrSS6vUv1Y%2FSNsEWBl4zv7fQHa9np4PvMBI'+
'PxpcnTaSTRNkmvrqwtA0r5CMJK6BEw4uNvEO%2BE3N%2BLV9uq8VLwAAAAASUVORK5CYII%3D';

openTourImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAA'+
'Af8%2F9hAAAABmJLR0QA%2FwD%2FAP%2BgvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH1QsV'+
'ETINEBVQCwAAAaZJREFUOMulkb9PU1EUxz8vfajv0QYLDE1MNxlgc0ITIwODfwAIRgYkDBIQHNwMBAYXBx'+
'Y2E34OBNQwA9FBRwYTEgxshGhMhCZtbeC95%2B279zi0aa15TTF%2BcpN7T8493%2FO951oPBvtmU6nUHH'+
'%2BhlCrtv9TYyvLaa%2BpgTT6bkJHh0chkEPgsrSxSKBQevXuztREpMP50TAb6Bzk8OgTAboqRSMRpRC6f'+
'fTn%2BZGrG1lrjOC7XW5IlxZjh4cBQQ4HNt%2BvTwIytlML3PfI%2FcwAkW1sA8LyLusWu21w522EY1jgA'+
'U0kelZ%2F1J52dXTWxDUQ6iLocxaUdxOMJ0ul0tIDve7z%2Fcs5BxgVg%2FsN6nX6fa6LeiSWxARzH5SDj'+
'svD8PoHSXIZrV2JMze9WZwDwIxdwfHbRsFhrQ7rdrQ7RcUqBACKCZVmICCJgRNBGCLVQ1AYVGkIttCWu1v'+
'7CzaRP9lzxPeuDWBiE8kIEBEGkLAwERVMVOM2ccevOXfZP8uWiUncRMAiCBSIVV90drexu75AMvq1a9x6%'+
'2F%2Bug13ejhH2kuft37tPriNv%2FLbzdmyosZb3GLAAAAAElFTkSuQmCC';
						
upArrowImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAALCAYAAACtWacbAAAAA'+
'XNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9kGAgwRCf%2B'+
'zuLwAAABTSURBVBjTY2RAAgKZDP9h7A%2FTGRhhbCZ0BYrTMDUwYlPAwMDAcD8LYSIjNgXoCpmQFcAEYTRMnAVZEJspG'+
'EAgk%2BG%2F4X%2BG%2F8iORvEdPkBDRdgcDADKCBwts29RswAAAABJRU5ErkJggg%3D%3D';

downArrowImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAALCAYAAACtWacbAAAAA'+
'XNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9kGAgwQGfsfmZk'+
'AAABUSURBVBjTY2RAAgKZDP9h7A%2FTGRhhbCYGNKA4jQEDMDEQAainiAXZsbg8wQRzLLqDkcUYYTqw%2Bep%2BFlQRstH'+
'ICmEKPkxnYGREd4PiNFQFcJMIhTgApRsaD06xHyUAAAAASUVORK5CYII%3D';

bottomArrowImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAALCAIAAAAiOzBMAAAA'+
'BGdBTUEAALGPC%2FxhBQAAAF5JREFUKFNlj4ERgDAIA%2BkGOopj6UBd0xEQfC5tleO4NAFKmrvbG%2FvV'+
'AHcvxkIjttMOt6hi8qFEUyYKClYVUF3ISkaXhVowNH3zAWPn%2F6K8GHY%2BByflZpZlcfFOh7w%2FGL9uQ'+
'pYVEKEAAAAASUVORK5CYII%3D';

topArrowImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAALCAIAAAAiOzBMA'+
'AAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAAB'+
'dwnLpRPAAAAF1JREFUKFNdT4ENwCAIww%2B2U3bWdpBv7gTEtamdhCBpS4WWmfHF%2BTQ0bycSxVUcd1ReOWslwPk'+
'44TSFgnz6ZyUFGs5BjsQXixPhND0hV909fQt64hRcArmQ1WkFcQM2uW5CM3XOpAAAAABJRU5ErkJggg%3D%3D';


										
dangerImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABHNCSVQICAgIf'+
'AhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAIwSURBVDiNjdO9T5NRHM'+
'Xx7%2B%2Fe573tU%2FoUCpTy1kjlTTExIRol0ZiY4OTE0iZuuhgHIxvRuGhcUAeMcXNwcwH%2FARcHjUpYTExUEsWQ6CAEWiiFXhc1QYv'+
'hLHc593OXc8UYQ6MsXJACyn4mZqdcM%2FXzRx%2Bbz416quFtQDnBk47j431to%2BdGHMt5uGev4eslORvrOTIUtmQk2ZpRXnbw1EJRRv'+
'cHiIhOJGda%2BoZ98SOUl6Tl4CFPfP%2FBvoC3RSYSPSNZ11WojiFUtp%2FAtyWWGxiYL8n4f4Hnp8Vy48l7UbY9EMtBpbKo5jxYFs1dX'+
'YH2%2FRluitoTaOrgYjzXFzpSRbUXmJyeZXJ6Ft3ej6drxNvymfmPFBsCby5JoILErSgdBOIGqGQLzaFNpslBRR2I45LOhDFl%2B9Mfro'+
'j7D6A2uNaUydh2vYLuHMRsb5BN2WQjG7Ozie4cxmWDMJ32yytc3gW8m5DIcrzJVIJAEhESC2G7QnezTb7Vhe0KEqYRSxM5qzED11%2BWJ'+
'PwD1DxuJELXsswGunsQamWorjHWH3CsV8P6EpS%2FojsL2PU1wgDLF6YAZKFIzmje53Nu4OQK2IfP%2FB4E%2BuRdAHZeXAVjwNTZej3H'+
'1vIin5ap7BgOWGjuNMWxtami23upb64iokAUS09LgGCq64DBmDq6awDr2yKpOPrHGrctYCzuYQNsvZrbNZLUr7P693qAwMNdKXPCMoZHX'+
'74zZQxug97eETaV4b7s9Z33m5%2BP5JF%2FA6jokgAAAABJRU5ErkJggg%3D%3D';
										
plusImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABHNCSVQICAgIf'+
'AhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFQSURBVDiNpZM7SwNB'+
'FIXPTB47TYioMAErLSz9BYJFIJ2FheA%2FEO2CTTB1go2ktrMSxFIQjFgIgkU6SxtthAyIGC0yz10LzSaz7AYlt7pzOXzcc7hDoijCL'+
'JVPG9aa5b5zIZ%2Bc5XJUdFuDyp8AzoW8tXvszZonBzxNmwoAAGMVnt%2FuAQDLi%2BtZsikAp2CdjfupgNphue%2FCsWcWBNIYxZx1'+
'PwCjwIJAVhulOPEcpaLbHlTyAODCkNd36pNgltxgb2ufAQB%2BEZ3zDvcsGKPw%2Bv6YuuaL6Hnvpfk13wIAaCNhrc30OlnayBSAlVg'+
'orXhC8fEEAOBzqz7AJgCUEnF6dRaHWCwU5PbG5jhELXFxdym1MWykoZSIGHDT%2FvQurNooRcqOQ1RWQRvDbo%2B%2BSNJO5h1oPcRoA'+
'62HWbJsgDJDsGI57v8FoISI694DT87StGTW7%2FwNezmaY41c7QEAAAAASUVORK5CYII%3D';		


informationImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABHNCSVQI'+
'CAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKvSURBVDiNlVNPS'+
'NNhGH6%2B7%2Fttv%2BU2nZuy0dLooEEgpa5LWVtonXaQPGQ3j52FPBQkBQVJeO64m5KkEJ7UwIUdohGVnTKsnNPNtZ%2FT7bf9%2Fn5f'+
'B204DKIH3svD%2Bz4878v7ECEEjmJgeKyDEDLCJCnGbbsLAChjq7ZlLQshEkvTE2tH%2B8kfgYHhMUopHfU1eR7dvnldPh0O0kCzFwBQ2'+
'C3hZybHp2YX9eJe%2BQHnfHJpeoLXBAaGxyiTpDc3opHIUDwqGyaHqhkwTAsA4HRIcLuccDooXs4n9YVkKmVb1tWl6QkuAQCldPTyxa7e'+
'oXhM3i6UUNGMurVQNaDsV9DgcmIoHpPVit678u7TKIBnpP%2FW3Q6XS%2F745P6dBqWsQa3otbn2YDMYI%2Fi%2BpdQ4d4MMv8eFe4%2B'+
'fVzRNv0AJISPRvohcNSwUiio0w6pVZ3srzp0J1XGFooqqYSHaF5EJISMSk6RYWzjINnf2oBlWnfPF919BCTnGb%2B7soS0cZEySYpTbdl'+
'eo1Y%2BN3C40w6yr8x0n0XP21DF%2BI7eLUKsf3La7pNqddBNV3USj2wVCCAAg0OSG7GA1B0II7KtanRuJMraazSuXGt0uZAslaLoFlyy'+
'BMQoc%2Fki5qsO2OTTdAhcCoYAX2bwCytgqtS1rOZ3J2SH%2FwdNwIVDRTJRUHVwICAGUVB0VzQQ%2FFAz5vUhncrZtWctUCJFIrqR0n0'+
'dGi8%2BNf6HF54bPIyO5ktKFEAm2%2FuWtknixYOR%2F7V7p7%2Bt27KsaKpoJALBsjh%2FbCjZyxdpwd2cYs69eV3fyyvji1NN5CQA45'+
'5Nr6%2BnBmbmFnsH4tRPFso6sUsLnb1sHlgNehPxe%2BDwyZuYWqmvr6Q%2Bc80ngL2FyOh0Po30RuS0cZKFWPwAgm1eQzuTs5EpKNwxz'+
'%2FFiYjuJ%2F4%2Fwb%2FIaMwXzlO4gAAAAASUVORK5CYII%3D';

			
editImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAKQ2lDQ1BJQ0MgcH'+
'JvZmlsZQAAeNqdU3dYk%2FcWPt%2F3ZQ9WQtjwsZdsgQAiI6wIyBBZohCSAGGEEBJAxYWIClYUFRGcSFXEgtUKSJ2I4qAouGdBiohai1'+
'VcOO4f3Ke1fXrv7e371%2Fu855zn%2FM55zw%2BAERImkeaiagA5UoU8Otgfj09IxMm9gAIVSOAEIBDmy8JnBcUAAPADeXh%2BdLA%2F'+
'%2FAGvbwACAHDVLiQSx%2BH%2Fg7pQJlcAIJEA4CIS5wsBkFIAyC5UyBQAyBgAsFOzZAoAlAAAbHl8QiIAqg0A7PRJPgUA2KmT3BcA2K'+
'IcqQgAjQEAmShHJAJAuwBgVYFSLALAwgCgrEAiLgTArgGAWbYyRwKAvQUAdo5YkA9AYACAmUIszAAgOAIAQx4TzQMgTAOgMNK%2F4Klf'+
'cIW4SAEAwMuVzZdL0jMUuJXQGnfy8ODiIeLCbLFCYRcpEGYJ5CKcl5sjE0jnA0zODAAAGvnRwf44P5Dn5uTh5mbnbO%2F0xaL%2Ba%2F'+
'BvIj4h8d%2F%2BvIwCBAAQTs%2Fv2l%2Fl5dYDcMcBsHW%2Fa6lbANpWAGjf%2BV0z2wmgWgrQevmLeTj8QB6eoVDIPB0cCgsL7SViob'+
'0w44s%2B%2FzPhb%2BCLfvb8QB7%2B23rwAHGaQJmtwKOD%2FXFhbnauUo7nywRCMW735yP%2Bx4V%2F%2FY4p0eI0sVwsFYrxWIm4UC'+
'JNx3m5UpFEIcmV4hLpfzLxH5b9CZN3DQCshk%2FATrYHtctswH7uAQKLDljSdgBAfvMtjBoLkQAQZzQyefcAAJO%2F%2BY9AKwEAzZek'+
'4wAAvOgYXKiUF0zGCAAARKCBKrBBBwzBFKzADpzBHbzAFwJhBkRADCTAPBBCBuSAHAqhGJZBGVTAOtgEtbADGqARmuEQtMExOA3n4BJc'+
'getwFwZgGJ7CGLyGCQRByAgTYSE6iBFijtgizggXmY4EImFINJKApCDpiBRRIsXIcqQCqUJqkV1II%2FItchQ5jVxA%2BpDbyCAyivyK'+
'vEcxlIGyUQPUAnVAuagfGorGoHPRdDQPXYCWomvRGrQePYC2oqfRS%2Bh1dAB9io5jgNExDmaM2WFcjIdFYIlYGibHFmPlWDVWjzVjHV'+
'g3dhUbwJ5h7wgkAouAE%2BwIXoQQwmyCkJBHWExYQ6gl7CO0EroIVwmDhDHCJyKTqE%2B0JXoS%2BcR4YjqxkFhGrCbuIR4hniVeJw4T'+
'X5NIJA7JkuROCiElkDJJC0lrSNtILaRTpD7SEGmcTCbrkG3J3uQIsoCsIJeRt5APkE%2BS%2B8nD5LcUOsWI4kwJoiRSpJQSSjVlP%2B'+
'UEpZ8yQpmgqlHNqZ7UCKqIOp9aSW2gdlAvU4epEzR1miXNmxZDy6Qto9XQmmlnafdoL%2Bl0ugndgx5Fl9CX0mvoB%2Bnn6YP0dwwNhg2'+
'Dx0hiKBlrGXsZpxi3GS%2BZTKYF05eZyFQw1zIbmWeYD5hvVVgq9ip8FZHKEpU6lVaVfpXnqlRVc1U%2F1XmqC1SrVQ%2BrXlZ9pkZVs'+
'1DjqQnUFqvVqR1Vu6k2rs5Sd1KPUM9RX6O%2BX%2F2C%2BmMNsoaFRqCGSKNUY7fGGY0hFsYyZfFYQtZyVgPrLGuYTWJbsvnsTHYF%2B'+
'xt2L3tMU0NzqmasZpFmneZxzQEOxrHg8DnZnErOIc4NznstAy0%2FLbHWaq1mrX6tN9p62r7aYu1y7Rbt69rvdXCdQJ0snfU6bTr3dQm'+
'6NrpRuoW623XP6j7TY%2Bt56Qn1yvUO6d3RR%2FVt9KP1F%2Brv1u%2FRHzcwNAg2kBlsMThj8MyQY%2BhrmGm40fCE4agRy2i6kcRoo'+
'9FJoye4Ju6HZ%2BM1eBc%2BZqxvHGKsNN5l3Gs8YWJpMtukxKTF5L4pzZRrmma60bTTdMzMyCzcrNisyeyOOdWca55hvtm82%2FyNhaV'+
'FnMVKizaLx5balnzLBZZNlvesmFY%2BVnlW9VbXrEnWXOss623WV2xQG1ebDJs6m8u2qK2brcR2m23fFOIUjynSKfVTbtox7PzsCuya7'+
'AbtOfZh9iX2bfbPHcwcEh3WO3Q7fHJ0dcx2bHC866ThNMOpxKnD6VdnG2ehc53zNRemS5DLEpd2lxdTbaeKp26fesuV5RruutK10%2FW'+
'jm7ub3K3ZbdTdzD3Ffav7TS6bG8ldwz3vQfTw91jicczjnaebp8LzkOcvXnZeWV77vR5Ps5wmntYwbcjbxFvgvct7YDo%2BPWX6zukDP'+
'sY%2BAp96n4e%2Bpr4i3z2%2BI37Wfpl%2BB%2Fye%2Bzv6y%2F2P%2BL%2FhefIW8U4FYAHBAeUBvYEagbMDawMfBJkEpQc1BY0FuwY'+
'vDD4VQgwJDVkfcpNvwBfyG%2FljM9xnLJrRFcoInRVaG%2FowzCZMHtYRjobPCN8Qfm%2Bm%2BUzpzLYIiOBHbIi4H2kZmRf5fRQpKjK'+
'qLupRtFN0cXT3LNas5Fn7Z72O8Y%2BpjLk722q2cnZnrGpsUmxj7Ju4gLiquIF4h%2FhF8ZcSdBMkCe2J5MTYxD2J43MC52yaM5zkmlS'+
'WdGOu5dyiuRfm6c7Lnnc8WTVZkHw4hZgSl7I%2F5YMgQlAvGE%2Flp25NHRPyhJuFT0W%2Boo2iUbG3uEo8kuadVpX2ON07fUP6aIZPR'+
'nXGMwlPUit5kRmSuSPzTVZE1t6sz9lx2S05lJyUnKNSDWmWtCvXMLcot09mKyuTDeR55m3KG5OHyvfkI%2Flz89sVbIVM0aO0Uq5QDhZ'+
'ML6greFsYW3i4SL1IWtQz32b%2B6vkjC4IWfL2QsFC4sLPYuHhZ8eAiv0W7FiOLUxd3LjFdUrpkeGnw0n3LaMuylv1Q4lhSVfJqedzyj'+
'lKD0qWlQyuCVzSVqZTJy26u9Fq5YxVhlWRV72qX1VtWfyoXlV%2BscKyorviwRrjm4ldOX9V89Xlt2treSrfK7etI66Trbqz3Wb%2BvS'+
'r1qQdXQhvANrRvxjeUbX21K3nShemr1js20zcrNAzVhNe1bzLas2%2FKhNqP2ep1%2FXctW%2Fa2rt77ZJtrWv913e%2FMOgx0VO97vl'+
'Oy8tSt4V2u9RX31btLugt2PGmIbur%2Fmft24R3dPxZ6Pe6V7B%2FZF7%2BtqdG9s3K%2B%2Fv7IJbVI2jR5IOnDlm4Bv2pvtmne1cFo'+
'qDsJB5cEn36Z8e%2BNQ6KHOw9zDzd%2BZf7f1COtIeSvSOr91rC2jbaA9ob3v6IyjnR1eHUe%2Bt%2F9%2B7zHjY3XHNY9XnqCdKD3x%'+
'2BeSCk%2BOnZKeenU4%2FPdSZ3Hn3TPyZa11RXb1nQ8%2BePxd07ky3X%2FfJ897nj13wvHD0Ivdi2yW3S609rj1HfnD94UivW2%2FrZ'+
'ffL7Vc8rnT0Tes70e%2FTf%2FpqwNVz1%2FjXLl2feb3vxuwbt24m3Ry4Jbr1%2BHb27Rd3Cu5M3F16j3iv%2FL7a%2FeoH%2Bg%2Fqf'+
'7T%2BsWXAbeD4YMBgz8NZD%2B8OCYee%2FpT%2F04fh0kfMR9UjRiONj50fHxsNGr3yZM6T4aeypxPPyn5W%2F3nrc6vn3%2F3i%2B0v'+
'PWPzY8Av5i8%2B%2Frnmp83Lvq6mvOscjxx%2B8znk98ab8rc7bfe%2B477rfx70fmSj8QP5Q89H6Y8en0E%2F3Pud8%2Fvwv94Tz%2B'+
'4A5JREAAAAGYktHRADVAJ8AvxXHGoYAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfZBwcIASdkENZ8AAABgUlEQVQ4y5VTvUtCU'+
'RT%2FmUmSWCqaSUtbEA1R4GRfFARBNfV%2FRNYUjY1JTY0N4VAiDdEgSNIQTUVDtgZBiPmBVkrq8%2FwaHj6VZ6%2B8cOGcc%2Fl9nHP'+
'vBbpckeAWW%2FOebsHjE6ttJKZGcH4WphHYVn3EqLKi5c9Pl9g4CJk0MEmKkPV6nYqisFarslqpsFL55tXpDpXXMJMnCSZPEmx10NvUI'+
'NLplE75IX6I5blJpLNFjC0CF0f3CGwHgYNQO4EI4fEMgUKQ6o5H9jSw1z2I2M0j6J9GxyEKBZnMO7K5DHL5bEdwYH1X57B5C0K4XG44n'+
'S7V9oK%2FHby2C4p%2Bzs0WSOTzWe0g%2FZ6B1zuM2PUdppY2US6XYO2zGhCIwOFwQkhEo7dqMfmiKpMgBWLkABQUigUAwP5xRCuXyyU'+
'ttlgsvxOQhN0%2BoN0AKZBGLKLVDVogPr8%2BDJ%2By2Ww2ciCw9dtUVaiqQgKi5oqigCI6gn%2F%2FhcaamZ2Hzzdi0hEAQCr19idJK'+
'xgAfgDG6PPJecMc5gAAAABJRU5ErkJggg%3D%3D'
						
backgroundStripeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM%2F'+
'rhtAAAAwklEQVRYhe3XXQqDMBhE0dtsIKvNwrOC%2BmIhTfNrlAzlm0eR4ShomFcI4U2WGGN%2B6Sfe%2B%2B49d%'+
'2FS5O8tKWe37AqrhIAEq4uAEquIAnDIOCh%2FJStkTD9sE7sZB4w0q4KACVMFBAaiEgwyohoMEqIiDE6iKA3DKOBj'+
'4Uc%2BUPfGwQ8Cdx2EXuPusbgJ346ABVMBBBaiCA9sktknmyj6xTXK1zDbJalkrtklGykqxTTJTlsY2yZUysE2yVj'+
'Ya2yS1sl7%2BcpMcegPyrqBRcaoAAAAASUVORK5CYII%3D';
	
gctourLogoImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIcAAAAYCAYAAADQ1%2B6cAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oGHRYbDZ1uh%2B4AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAHE0lEQVRo3u3afbDUVRkH8M%2FeywVEkRcpCEsEUytTAbFSCBtd06AGRd3KyjnmtImZb0W%2BpU4v2oxiaE5Zm9ZRG4W9TDPiEDaujqlpMSpOCg6mF0FeQl6St3tBvHf7g0OzrXsvl1FixP3O7Oz%2Bzu95zvmd83zP83J%2BSx111FHHriLTXcFi1hn4ClahAwfiU2jFE7gXj%2BRKyvVlfR%2BRo5h1A97AbbmStor2RmTxPZyMZ3FpruSx%2BtK%2BD1DMmlLMOr7i%2Bohi1oQacuOKWfOKWR3FrOvrK%2FfeR0N1QzlvcDnvi8ngn8CGXMmTFSIjcEO1Xq7kCYzDo7gq6XYLIYTGEELjrjx4CKFHCKGhbsL%2FY1gp592LmzIF84tZP8Z1lXlEMWs%2FtGBIrqSjhgcZis9hZq6kvQvjDknh6DQckppfwWxMjzEuq6FzCKZiIj6MdryQ8p1fxhg3V8k%2FjME1hn8sxnhB3fy74DnKeaNxBhYUs47CiuoEM1eyCc106hlW4W8Y3gUxsngRRyWCHIShmJIS3YUhhIlVOmfieQxAwJA0xk8wGc%2BEEIZVDfVDXIhbcET6fSFur5t%2BFz1HOe9WjM8UjEp5w525kpYa3uGjmJQrubmYNSTt5HE4FoehCU%2FmSsbWIMYnMQ9X45YYY7mGTB634pgY48IQwrGpIjo%2Fxvj7WmEJv8NIjIkxbqu6PxLzY4yZusm7jx5V1yclw8EoLK4gzv6pbO3R3OJ1ZItZxzVmlHs3erX1Lc%2BW%2BQvexBZc9dQk%2FY673%2FqqMX6O5hjj9M4eKsZYCCEsrSDvtO3NbydGkm8PIUxJpXVvbOtm3jIM1%2BDz2B%2BLcAfujDF2pLD07Rjjy1V6Z2NkjPEHSeZGXIKVMcZv7q3kgCXpu8%2BOkLLhXKOXbfaNpgYnrtisnHbxAqyZPNwKfAG3ZgqWJSL1XrvFLfs2mYlTq%2FKMk3Hkzh4sxvhg0hmK8cjvRL41JcPdTWhH4RE8gLOxGsfjpxgfQjgHJ2C%2FGuoHpZAoyRyJu3DP3uw52vHp9LupmJXB5Adf89vRg%2FQfso%2FWAb1cOWqQ25tbZJoaLGgvm9OYMQb9saycdxWuPqC3Plvbravq%2FwhsTsTqLj6OTXjp3Zp0qnLuTt7o0opbi0IIj%2BIfOH0Xuvx1jPHavT2szMLV5byJzS2W4uBklIfKzO3RYFZK6J49a4QJzS2e%2FtNSL35pmJMyBS%2BU8wbg6%2BgDjRmDqvpvxLbKPCOEkEs7sTNsQnut3OQdYGRKqE%2Bo4YEWhxDuSt6ku5jbxb0d5Ju%2Bkz6OT6F8G%2F6cPHh%2FnJKS74Zu9LFbzzmmpTJ19oSDHHZ4f9%2FPlTyfK%2FnyoTPETMEm3Jzi82A8uaXdKego52XxmbTTwcZtClX9L0L%2FEEIlGT6Cj9X4jMVNWI5%2BNSqRd4KDsSrGuK6T%2Bwu6qrZqHAG0dSHbXYMegyLux2crcsDWVF1N36OeI1PQVs4bg5%2Ft28N3jhpodEfeuAzXY1amoAPn4s1MwTPFrLa0M87DnemADLy8QeuAnv87oRjjkhDC33EBrkhtN3fi%2Bq%2FAoZiDhUnn8i5CRSaVwWtijFt2Mu%2FVGBhC6N2J7AexNu3iXjXu99kNtnjO9ndXr2BgahuK%2B1KSv%2BdPSDMFrZmCizH49TbTt7Y7GDOxsJw3BddhSTlv5Fkj9Dz6AM%2Blc4T%2FEmPtFm%2FMX%2BO6QXfbWGPMqbgkhDChC0Mfh2sxNcbYgStxWQjh1C7m8iM8hZ7dmPc8bMA5NcbulULK3ORFR9bQH7sbbPE4bkvPVq7wUMfiuxXeZM%2BRo4Ikawff47I5S1309GqLOsr64leJzVnMx%2FzD%2BpmMoyuPS1ZvsXHsEHeU82%2FfdTHGx%2FEtzAoh3FQZLkIIB4QQLkcJ18YY5yad2elcZHYI4Sep6tmhc3gI4Q%2B4CKfHGDd0oxLamuSnhxDOCyH0TH0dmA743sJvUvVxTapshBB6hhCuTOFzd6Ap9b08Xf%2Fb9peZMzoh6Z4hxw6c%2BZC7Fm90%2FgNLbNrwpmVdiLa9tsm8f663dnhfM4f2MQNf7cQ496RFOAQvhRBWhxBW4HVMwmkxxmlVOjemsng8locQVoYQVqdT014YHWN8ursTjzHOwNdSeFsfQliOV5MLPzGVxtPwR8wLIfwL61KC%2BItdWONLq751cX0B9sXDqe0J218v5PDMHj0h7QzlvKbmFob3NXXMB1y%2Fqs2S3o029mjQsLXdllVtti3eoGnzW%2BZMGmZZz0YTsR6XZQrW7KSs3CeFpJ5Y0kWSWKnTLyWVHWipfqeyi2VtJvXVv7Px03gjbP%2FbwqvvcuX03jg%2Br0GKTEqOTs8U3FHO6411zS0GpmSxR3J9K3MlWyvJhEGZgpX1Q%2Bi9lxz74eKURN6Xdk7fTMGF9aV7n5MjEWQcPoQVmYK%2F1pesjjrqqKOOzvEflCqEWSmh%2BPAAAAAASUVORK5CYII%3D';

previewImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQoAAAB4CAYAAAAKVry3AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAKbAAACmwB9fwntgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAACAASURBVHic7L15jKRnft%2F3%2FT3P895v3X0fczSHQ84MzyV3V1RE7W68sODE3iQOZq1AkJHDIATIGyQIEgQI4plBBERBpChZO3KWsOFAtuCEYzgRvJEcaANRkiWvY2kpc3nskHP23V131Xu%2Fz5E%2Fqqs5wz14zCx3FqkP8KKqp4vset%2B369u%2F%2B0fGGMyYMWPGD4L9qN%2FAjBkzHn5mQjFjxowPZCYUM2bM%2BEBmQjFjxowPRPyo38BHgYju%2BfL7ve7y5csAgEuXLhkiwixgO2PG%2FUE%2FLh%2BiK1euULPZpDfeeIPeeadPQJuCIECv18NoNDp6VRXVahXN0y2shqERQmBhYUEDMJcuXfrxONEZMx5CHmqhICK88sorFMcx7e3tidFoZG1ubvLt7Q6XUgrNBIujlJIkgVIKnm%2BjWqmiWQtMELg6rFdks1otHMcpHceR58%2BfN1%2F%2B8pfNw3zOM2Y8jDzUQnHlyhU2GAx4UZCdq8IrktzfP%2Bw5%2B%2B2BJSW3DRgvckNpKaGVhutwVEIbtdA2FV8oP7Rz33UTxigGeLq6Olc6jiMxszBmzPhIPHRCMbUi3nrrLXbz5r6VpokXp3kYp0WlKHk4HBt7EJEolCM0bKYUI6UJMARLGFR8Qj00phZo7bmy5JSnWuWx4%2FCo2awknPMky7J8Z2dHvfrqqzPrYsaMD8FDFcwkIly%2BfJlu3rzJDw8H7mDQD9v9pDYcm0qc2X6uA6dQNZ6qOlM6JEMODAQMYyAAJQNgDAQUHFZAYGgp1bON7nsmz8N%2BP4kNU0NVqJHneelLL71UEtFMLGbM%2BAAeKqG4ePEiDQYQqdrxOp1hrd1LGwc9Ux0mVTfVi5bEPNOsBc3qZJgLkIA5yvASAZqAFAArAVaUgEh4xR0wl7UFyQM3y7teWUSulJnNuelvbW1FFy9elESkZ2IxY8b356ERiitXrtCFCxf41ta%2B2%2BkP6wftrHXY49VePOclepVLtk6GNWGYD5CFSQnIexlSQ4ABoVAEnQHSeCh0CM0aZFXmeeg3mcq2mFK3ucoLVhQ5OC8BIL58%2BXIJQP9oznzGjIefh0YoAFAcx%2FYozmoH7bS132a1frbgJvoUl3yVDG8A5GIiDhowJQA1eQ4CDANIQBuOEgw6Y5BKoJQC0jhYbfpUq1a54%2FjOoHcDabIPrRlz3ZAARK%2B%2B%2Bmrx%2Bc9%2FfmZWzJjxPXgohOLq1auU27bob7eDwSCr9wa8Okibbmw2uBInyfAaAAuAAUwK0jGgY5DJDUEBAAwsGPLIsADGeFDGQWo4pGKQmsOgArHgYb7hk23bTq9NpNSQiEgrpeRbb72lfv%2F3f1%2FNsiEzZnw3P3KhmAYw%2B%2Fv7Yu%2Bg6x20i2CQVJ1Er3ElVsiw%2BsTVMBKkIzDdBtcHhqm%2B5izXjBSMAZTmJI1PhtdJs3kyfIG0CVEYC8N44qYI7sB1FqleMVRXuR2NboV5rorBYBy7rpt97nOfUz%2Fq6zFjxsPIj1woAOD27du4s7fHuweZdTAMxKhsMMmXybAGwCzAGJCOwdUOPHZb%2B85hyfUoA%2FKCCNpoQCrDtbEsaUI7V0tWaVKu%2BBoZ1FBKC6MY2OkQbEvAWpqDXzlJZTGy4njXbbe7HmN29O1vf7v8whe%2BMMuCzJjxPh4Kofj2t79N3W5GUSZYrCqstBqkRR0gB5OgZQHSQ9jYMi1%2Fv1xqyrHgrB%2BNy1jKUpZSEhdCcCa9oiwqoyyvjAvlpkpwRRYZqqCQhGGksdMhVDwHJ%2BfmyXaa1O9tiiQZiDwvGGPl9%2B0fmTHj%2F888FEKxt7eHwQAkWZ2k5cDYIcBcgDgAgKAgKIXPh7peyYr1ldpovrXQGwy60e7urhoOOZaXQy6E6yW5Ltq9gkzvkJdFlWldI8NcGDAUUmMUE3pjjqW6CyYClCUwGPVpNBrQ5ub1H%2FGVmDHj4eShEIrd3V3AmgezBDS8SXaDBAACESCYgcslfCFN4EIFnpW3WvP5yZNr5dmzZ9Wbb76JCxcuyPF4rAZxDM8d28pIr%2Bj2bKV6kLoKMAvGcJTSICuAQnE4sKANkEQJtE5Qq9V%2B1JdixoyHkodsHgUDGOHu%2BghGgGNxVHwblcAmwcDTNHY6nT17a2tLAKALFy7g0qVL%2BrOf%2Fax89NSpdGV1MVmaC%2FLQyxTHyJDJMC2TmAQ%2BDZQy0MbAGEBDoyx%2FJCc8Y8aPBQ%2BFUKysrMAPLNhCQyADmRQwEoABQOBcwPcrqFbmmWVV7Sgqq7u7nWa73a9sb2%2Fbb775JhER3nrrLVOtVmWtHua%2BxzPBc0kmNjDF0f8LIDKAUZAyQ1mkIDIIfd80m01j2%2FaP8jLMmPHQ8okIxXTgDBF913H58mVaXl7G6dUF02o4xrEyMDOc1EoYCWMMlOEAb8CtnCG%2FsmGBVcMkka3xOG4Oh7HfaDTY5cuX6dKlS8YYY7gRUikplZLaGDkxI2BAZMDIgEyKIm2bNOkYzrVqNOpyfX1JP%2F%2F887N0x4wZ34Mfeozi1Vdfpd%2F%2B7d%2BmX%2Fu1X6OXXnoJe3t7x99bXl4GALz44otsb6%2BDrZ2uFocw3bRnUt2F0j4MVVBKjrjwkZsVtAKXCUfYQ1VQnvdK2y4ix3GS5eVldfXqVSIiUkoK4kIwEoxIAEQgEBgZ2LwE033E403Y%2BlDaNqVhUM9arXrZarVmqdEZM74HPzShuHr1KsVxTMYYobW2RqMRL4oCaZpSURSwbRtRFJnRaISFhQUTBAFz3VALdyyxF5lOvGtS7ZEhASldjFOBXuxirjaHMEwpT%2Fe5kpFbrVa8%2Bfl5C0C5v79vksSIKEqdNC1daVxhKCCQDZABpwI2G4OpHVOk24qLURaEPG42a%2BnKyoo6f%2F48rly58ommSGeVoDN%2BHHjgQnHlyhU6efIkxXEsdnZ2LMuyPK213%2B127SiKmNaToKLWGkmSYDAY6CzLJICy0agwJixpzEDq%2FQPWjQXLlSFtGihyH%2BPYwiiW8FkJrTU4J7Ish1lWwJaWlujGjRtsPB65h72%2B3%2B5lTpy1uKIagSyQycHNGFztGZR3lCUGWRjyaH6%2BGZ85c1ouLy%2FzarVKP3H%2B%2FIO%2BJPcwuuu57%2Ft4%2BeWXTRzHZm1tTc%2Bmb814WHmgQnH16lXa2NhgeZ47%2FX7f73Q6QZZlAec81FrbQghqNBrHw26FEEjT1IxGoyLLstzzPFOp1PhSi6uyiLSWt6ifRijUEhk0UMQWhv3MWPmO0VlPGp1mSRKnUiZlFEWUZZl7cNCptDvjSm9EdiJrpFkVMAqkBuBmB7a1ZTw%2BLGsVipcXW8n6%2BjwqFSfQZYSD3RFpfXfY5kFUdPN7vlIAlAKM0Tg8hCnLVI5Gcf6nf%2Fqn2cWLFxWmUdcZMx4iHphQXLlyhc6fP8%2F39vbcOI6ro9GoURRFyBhzK5WKHQQBdxyHhBAgIpRliSzLkCSJGQ6HqixLGUWRLkvJLMvmjUphsjRSZCKK8i6VZQUm5SbuF8YpRtLh49iy1DDPkzhNUzUYDOxeL60c9sb1bt%2BEcV63pGmRMQQyHTjYNlV3H63KWM81TVmr2lKwmMejvMbUoR3bnDNDZBQApR%2BMRkzhADiDZoBUQJRqJKlBWRhdlGWW5%2BUgjmOdJEk2G6Qz42HkgQgFEeGrX%2F0qvf7663aSJNU4jueIqDY%2FP%2B8tLy%2Fz5eVl1mg04Hkecc5hjEGe54iiCMPh0PR6Pd7pdKxer2dGoxGSJIFWha74heasVJU8V3nR0wYwwmjJQVkYWmPXrQ6DwE2JiG5u7vh7B4PG%2FmFZ7458N5HzXEMQ04dwsGsa3r5ZbuZYmuPGt0sm856XmsTzmBRGMItpzqk0pBMNnWiYEtDG3N%2Ffd8KkNMRigE8oOcMwNdhra3T72qS51kWh47wo86KQ0WAQz0rIZzyUPBChuHz5Mn3zm9%2FknHPPGFNzXbe2srLinz17VjzyyCO0uLiIIAggxOTHaa0hpUSapoiiiIbDIXq9Hu3v72NnZwe7u7um0%2BlAykJxpot6jSWW5WTSUImyzG2b8larklWr1TzLuLmxuekOB2W121PV3a7rDrOmUMYljg4c2jMVa980%2FNiENiOSmpV6YHvW0Kr7BVttGbbQAHOYgUk08lKihIJSBuY%2BHQEiABbBMAbJGEaaoUw00rFCHhsUGdQ41mIwVjxPDNqD%2BEHcjhkzHjj3LRREhM9%2F%2FvMUhqGttQ4rlUpldXXVfeKJJ8T58%2BdpcXERYRhi6nIAgDEGWmsopVAUBbIsw2g0wtzcHBqNBur1Om1tbbHt7W3e7w8ZI2kaNSutVptjLZDKhJXz855mjFEU9dzOYVTbb2e1ztDzRnkoSuOC09D4%2FAAV5wCB3SOBFFlUktAZNasJa1VLzNeBekjkWgShDUqjYIyCIgXFAHO%2F4QJGMIJQGsIoInQSoB8Z2NxgdZFMXhD2D7VJM2WKWWhixkPMfQvFxYsXSUop8jz3hRDVer0ebGxsWI8%2B%2BigtLS3Bdd3j1zI2nW852d4lhIBlWbBt%2B%2Fi54zjwPA%2Bu65IQggO33eFwqEajUSaEGK%2BtrZXOvCOr1Srt7e3ZozitDcdlqz8W1XFatUvjEmcRQqurW2HX1IIxc%2FmIuBkR5zlVfYlmVaMaAowTxjEhywCjAJlpZJlBYQiaAYbu0xOgSbhjNDI4GChEGWDbhErA4ToMRKRcRxSVUJTccbRft83t27fv72fOmPFD4L6Egojwla98hba2toSU0guCwF9ZWbEfeeQRWlhYABFhOBxCKQXf9xEEASzLOhYMYwzKskQURUiSBMYYNBqNYyFRSrE8z0VRFH6WZWVZlnGWZempU6fUO%2B%2B8w7vdKBiO8vpgLKpRFrqFqXBGOXzRlY1gWDYrqamHidWqplYtyMh3FDzXIPAYHAcQnMDYkXfBAeYy2IKBazMt5rwvDICiNJBtjUEM5CWD69lQxkJ7yPU4oiJTVhw2qvFi0CxPnjxnvva1r93fD50x44fAfQnFxYsXiXPOhRAOEflBEDirq6tsdXWVgiBAlmXY29tDp9NBEARYXl7G%2FPw8fN%2BHMQZJkqDdbmNvbw9JkmB%2Bfh7z8%2FNoNps4Ks7CeDxmw%2BFQ9Ho9X2tdybIsvnPnjjw46Fv7hz3%2FoK2DfhS4mapzRkBoD1WzEmfzdSSepYhREvp2wZs18NAXsG0GwSddqUTv0wIOcAawadbBHLkf5uO5IcYA0mhoKJSKoIwPZrXAnIopU2OiIs3zwkTVaj1dWDglV1ZW7ud2zJjxQ%2BNDC8Xd8YUpX%2FziF7G5uSkcx%2FGMMV6z2bQWFxep0WjAcRwURYHRaIS33noLWZZhY2MD58%2Bfx9raGowx2NrawhtvvIE7d%2B4gCAJ4nofV1VVwzlGv1zEajdBqtTA3N8fiOLaTJPGIyDHGFGmauYNhHvbGrhsXdaaNC5f3VS1MspVFa9Sqh1GZKyuLbHHQFXycGKoEDgtDH7Ztv3c%2BdwvB0eM0hiKlRFmUUGrSc2ImF%2BD4%2FN%2F%2F9fTfaHLBYLRBlit0%2BxKDiKNaX0Fr6Rxac0sIupGRd7ZVp9Mu8nxcbm1t6d%2F4jd%2BYBSpmPJR8KKG4evUqvfLKK7S%2Fv4%2BXX37Z7O3t4dKlS2Zvb4%2FiOOaMMcf3fbfRaIhGo0Gu6x7HHIgIBwcHePfdd3Hnzh1kWXbsWnzrW9%2FCH%2F%2FxH6Pb7eLxxx8HANi2DcuyEIYhKpUKarUams0mHRwcsMFgYAFwwjAs81KFubKCXFVtaerMkDQWG8uqW8ZzjfpgebEVjfqwD4qMuiNjemMZLC0t2tWFUyys1cA5hwFgtD5qN38vwFqWJYo0wXDcR6%2FXQRyPoVT5nkjebWEcC8jxl9AGMIaglEFeEPKCYNkVtOY3cObRT2FhcQnb29sYjTMzHsem1%2BvpN9989UHe1xkzHigfKBRXr14lALzb7dpSSjoqt5Zf%2FvKXdaPRoOFwyJRSolariUajQZVKhaYCwRgDESFJEty%2BfRtbW1twXRetVgsA8Nprr%2BG1116DMQbr6%2BsAAM45LMuC67rwfR%2Be5x0%2FMsa4UsaO08KL08JPc%2BGVuiIMeWC6YyyWlraNOKh441otjJUqOOv1yrQQ0verfHHlgnjq2c%2Bw1dVV2JY1iYNoDa0UlFLIiwJxHKHf7%2BHwYBdFoWGPOyhFDk0FYI5mWtxzhd4TCq0nMYk8M4gSICsmcy8Ajjnfw9zcElbXTqLZbGA0iuA4Nji%2Ft3JzxoyHkQ9jUbDxeOwmSVLpdrsiSZKUiKKlpaXi2rVr0FqTEILq9TqCICDf948FArg3YJllGXZ3d9Hv9wEA%2B%2Fv7ODw8hOd5KIri%2BC82YwxCiOPjKCtCRMS0VjzLUitLczfPHavUjMEU4BQbS0jp2nZe8cLcsqxSKVUcHnZVFGVWszlfW1hYNo9sPGpOb2yQ4zjvuRdlgSRJ0Ot1kWcJ8nSIIt5BwHdRW%2BrDZjEEkwDdNVKH3js0AVIDaWbQ7Wts7yuUpYFWBpoRtHFgWwxhGKBarSIIQliWBc4figFjM2Z8ID%2FwN%2FXKlSt05swZStPUHg6H1YODA28wGERaayWEUJxzk6YpgIklME1zTrMaU44yGBOTvihQHo2TKooCUkoopSYxgLv8%2FffPrTgSHzLGcKOMgNGCKOc2hhA8gyeGphIYaXGW57ksl5eX1Ztvvon9%2FX0lhFCMcW3bNjzfRxiGcBwHUkokSYzxKEX7cA%2FbW9exdecNDNvvwlY7WKv1sFJNUXclLGZwnC2lo3GeNoOyCDkIw9TgoGsguEGWGRA0SkkoJTBOCLbNYNuT9O%2FUvSKimUUx48eCD%2FUnLc9z6vf71u7urt%2Fr9TjnvKzX66pWqxV5ntPUgrjbkvhevF8MpkzF4O7Xaa2PYwZHBxERc13X9n2P1UtjSSMp8BOAcoQeTKteV3MNX3leqL%2FxjW%2Fg6tWrqFarptlsHv8cYFIZWhQFxuMR9na3cfv2O9jdehvj3jtAdhvLdhvLTowVN0eLKbi5mWRCCCBGgAUYwaBsYCwYDlKD4digN5hYEtUKg2VxJBnDMBIolAfLciCEBcuyji2lmUjM%2BHHhBwrFpUuXzMsvv2yKopC9Xq%2FodDo0HA4D13W153kQQozn5uZ4mqZsMjBGQWv9XZbBNO4w%2FZBwzkFEsG0bruvCdd3j%2Bop7Mg5libIskSQJ0jQlrbXgnPvC4qZRDx3HlawoQYxxE%2Fi%2BaTRC02pUUK1W2RNPfBFXr16953wmlaA5BoM%2B4jjCzvZt3L75bRzsfBsmu4U5p42VxhgLPEe9LOEnElauwcqJSEAQyCNojyNjQE8ZbKcKt7oGB32DtACIJpZDoRyUsQ1pbAjHg%2BOGEGJyjh8kqDNmPGx8GItCt9vtot%2Fvp3mel0opVylVK8uSyrJ0ms2miqLIAcCmbsVULIwxsCwL9Xodi4uLSNMUrVbruO9jdXUV%2FX4fnudhYWHhuIpTSok8z6fdpRgMBuj3%2B4iiyNLGMCkVDARTmpFSDCCaBCPTnI%2BF5SilnDRN1UsvvSS%2F%2FvWvE2Ps2M042N%2FDaNjBwd4d7Gy%2BhWTwHVT4FlarI6z7OeZNCS%2BVEJECpZMuUnPUs6EFQbocscNxUBBuDgzu9AwGMQBiEJaA1C4KXYXhTQjPgW0AoRkcxz8%2BtzRNkaapUUrNBGPGjwUfKBR7e3sYDocSQOb7fk5Eoeu6juu6dQCelFIaY0SWZWI8HlOWZZMPbZ4jTVMIIbCxsQEAKMsSp0%2BfxurqKmzbxmc%2B8xmsrq5CCIETJ07A8zykaQrGGJIkQZIkGA6HODw8RKfToSiKUJZKjMYlcukhVwEZOPBcgYqneBxH3mA0qvuupcLQ0ysrK9kzzzzDd3Y2RRKP%2Bc72bVQCDc%2FKkAxvQcW3sczbOFlNsOqWqJUKViRBsQbKo2G8LsG4DIXNMBIMXcPQiQj7MbDbN%2BiNAA0Bz%2FchnAaI5uHaK3C8RYzjEocHXcRJDMY4kiTB3t4eiMjs7%2B%2Broiik7%2Ftqfn7%2Bh3mPZ8y4bz5QKC5fvmx%2B%2Fud%2FXgdBUBRFkdq2XVQqFWt%2Bft5xHMdOkkSPRiMwxni326UoipDnOYqiwPb2NobDIVZXV7G%2Bvg7bttFoNLCwsADOOarVKs6ePTvJeGiN0WiEOI7huu5RDGF8bE1Mxue5ZGBhMOYYpDXkZhXcnkOdu%2BQFKVc4cONoH0UWac6hiqKgtbUlKx73vWjcsfa236BQ3KKTiwVWvAGa3ggtnaKhJYKhAs80kE2sCLIABBymypF6DG3JcHtgsDUA%2BrmBBCAVA7gFKavQbAVh8wyac6dRb67BdkJsb%2B8gSQpkeY48z7GzswMAWilVDgaDFEDSarXKtbU18%2Bqrr86KrWY8tHygUBhjcOXKFbO1tVUURRELIZJKpeIsLi46tVqN9ft9XpYlRqMRBoMBjcdjZFmGfr%2BPa9eu4eDgAM1mE6dOnsTiwgIq1Sosa7JP1HNdFFmG0WCAnZ0dtDsd2I6D1dVVeJ6H8XiM8XgMYwzm5uYgLBf9kUE68jGWGyjZBgSa8JgD5pdUCatCJtIr8wOtlFGjUdcusp5dCbKaZ8XOUn3IVqsMZ%2Boa675ETRZwIgmeKlCmATmJRRifQVcYyorAyGbYLwi3ewZbXWCYGGgwMC6gjQvwJsLwFJbWzuORRy5gcWkNQViFLCVGowicc0gpMRqNTBzHut%2Fvl5ZlxUKIQa1WGy4sLOSj0UjPhtXMeJj5UFmPN99806yurso8zxPOeUxEAefcWlpa4idOnKBWq4Xr169Da42pUOR5jm63i7fefBMEYH9rC6dPnUKr2cS0hiGJInQODnD7zh3c2tpCUpY4ceoUqtUqiAhxHCNNU1QqFSwtLaMogX4cIdMtlLQOxRYB4yNXApoRwioR7BEfD2NPyqQx7LUDI%2FfFcqvvLTZL%2B8yaoo0FYNE2qBQSItEgBzBggEswADQjlDZD5DB0DMNOH9jsaRwODbKCwC0LnLmQpgrDF9FonMbaiQvYOHMBa6sn4Pn%2B8Xt3HAdlWZo4jk0URcoYUxhj4nq9PnBdtx8EQfzYY48VN2%2FenKnEjIeaD1vCbb761a8qIUQ%2BGAziNE3T4XDoJEnC19fX0Wq1IITA%2Fv4%2BxuMx0jSF53loNpsgALffeQedd97BTqOBVq02EQqlUEQRhv0%2Bdns9tJVCfX0dtWr1eLVfmqYoy3Liriwuot2JoIxEaSowrApDDrThKBVBagHLDmGxGmWJLbQ8CAQ78JqNDltfzPmJFU3ri4waHuAUGjpjKAQBgQH0pPTaGCBTQCcFNsfA7tCgHwNRBuSlgDI2YKrg9hJqlZNotDawtHIa6yc2sLKyimq1BmMMpJSQUkIIYcqyVHEcF8aYzLbtuFarjefm5oZBEMT1er28efOmBvChpn9funTJTMvfZ8z4JPlQQmGMwdWrV41SqgQQF0UxHgwG7vb2tlhYWOArKyu0srKC0Wh0fCwvL2NjYwM7m5vo376N7Pp1ZNevQwkBcA6uNURZgpUlGOeora%2FjzMYGzp07h4WFBfR6PRRFAaUU6vU6ms0m0tRAiP5k2xfuPo7fKIxRIJTMFin5boKKl8G1JUlJOOwBfcLExVAANMGY9z6fSgPjxGC3q7HT0UgKgmVxMG6DWSEMzcGvnsTS8lksr57B%2FMIKGo0W6vU6qtUabNuGlBIAjiovuTHGSK11HIbhqNFoRK1WK6lUKnmapubmzZs8TdMPtYQpCAL84i%2F%2BovnKV76ir1y5YmZj%2Fmd8knzoGuKLFy%2BaK1euKMdxUtu2h1EUOQcHB%2Fz69ese55xblkW%2B72M8HqPdbmNpaQmrKyt48oknMNrawt7%2BPha3t3Euz7FkDAhAF8C7to10cRHh2bP41PPP47HHHoNl2xgOh8c1FUQEwQUc10LoGbh8hLjsQ2sfjBkIJsBRosgHKLI2jO4j8BNy7RxlqXDYVeiPJntMCXhPW%2B7WGABSGgwjg3ZPI84YbNtGEIbwnHlUKifRaJ3B0sqjWFk9iVZr0i5v2w5c14XjOJjOAz2e3lUWAADXdeB5PizH4lEauXE8spVSRv%2Bg1KhSk%2Fm%2BCtCkjZRSK1LlQnMhD4KguHLlip6JxYxPio%2FUbHDp0iV95cqVMgzDSEpppWnKb926RQDcVqvFjTE0Ho9xeHiINE2xtLSEM2fPor%2B%2FD7mzAzEcoprnWJcSBkBsWZDVKqqPPorHPvMZXHjySSwtLSFOkuPCJGMMRqMRDg8PkUSJca3chE6EcWKRNiU41WBpGzpXNOofgMk7CKwOWtUh6mE%2BWSEIOrJC3sdxM%2BhkMIUyBKk1klwgzV1wZw5OeApLq49h%2FeQ5rKxtoNVaQBiGsCz7%2BD06jjMJ0B4hpZxka3o90kYJr%2BL6xDRPyqjyl5qv%2FVWfkj%2FfTdzf%2Bcbw2b%2F%2Fva7zpORdQxYKZT5pcbdtR0olU4usgWVZY9d1ZxO7Z3xifOSupPPnz%2BubN29mSqlhkiTU7%2FehtaZer%2BeWZcmiKKJGo4EkSWBZFuYXFrBx7hwO79xB5%2FAQB0mCufEYkgg7YYj05EksPfssHnvmGaysr8MPAuRFcdxByhjD%2Fv4%2But2uFsKSDIWs%2B6mJoltcp10GXSWkFrJBScOyR4HbZjU3JUY5YEoIbiDEUZn4XedhcDSVXwLGTLIYgjiEDXBLwOELWFy9gHPnP4VHzpzD8soaarU6bNu5p%2BGNMXZcVTpdQdDr9XBn8w6297dI8ZwHTcstUTjnxdbptUr2C0VJnCN%2B9N9gf%2FxTf1Sc%2FW9HrDqevjutDXSpkCcF4jRFOiqgtTGO4yilytRxHZqbm5PLy8vylVdeKTHbAzLjE%2BAjC8WXv%2Fxlc%2FnyZcU5TznnUEpRv9%2FnvV6PsiyzjTG82WzStFnMDwKsnjiBjaeeQrS7i61%2BH6oooBjD3tISKk8%2FjbPPP48TGxuoVCrHnaOO4yAMQ3iehzt37pgoispKpRI3Gs24VWdqOOqJPG3zorBJJZwKh4SytaPt0k0y4tv7INdSaFQ06lXAsSd9GoSjyVNq0go%2BGDGUykNYacEPZYk5YQAAIABJREFUaoDF4FU55isn8eTTL%2BCppz%2BFlZUVBEEAzsVxxem0%2BnRajp3nOfr9PnZ2d7C1tYl3b15De7QHCgvyfcYVY1jKozMOZ%2FzxL%2FwCxv0D%2FKvf%2F4ef%2Binz9te2qmu%2FvN967C2jgSItEQ9TZEpCsQJK5CAiKA6Ry5S0VgVjLAaQhmE4Xfk%2BY8YPlY8sFMYYEJG5fPmyHAwGqeM4LMsy3uv1TKfTCRljzmg0soqiIK01hBBoNJs4%2FdhjaO%2Fs4K2dHXTiGMyyUHnsMZx67jmcOXcOzVYLtm1j%2Bt94nodarYZGowHXdU2%2F35dpmibNJgaNWpDV%2Fb4ZDvusVIANl9XCmuv7Vr0sc9bJtGsUqO4D1QCohgyVkMCPwoZaA3EGRAnDOPWh2RrmahewvHoSpTQIezFqjUU8evYcTpw4iWq1etwRO21Wu7thbVo3cvPWTVx7521s722in7SRsiG0l0HZEppKSKmVZRGEcHDuJ%2F89LJ56Bt%2F4B5caq%2F07v1wvx%2F%2Fg9snP%2FqM8y02eFZBlCeEwVN1JulXlxjADmMkqM0az2u8ZnyAfayDC3WIBIDk8PMR4PC6llAVjrF6WJSvLkmutiYjgeR6WVlZw%2BsIF7Gxt4Xqew%2FN9nH3uOTz65JNYXF6G67rHXaS2bSMMQ9TrdczNzWFpaYnSNOVFUVhRFPGFhQX59NNnskajIW%2FcaJu1tZCdOrUajIddZ3e%2FH6ZJYjhJBDYDYwKMT%2F7qEwMAgtGA0hzgIWqtE2guPIPzFz6N1dV1RHGCra1tOI6HRqN5PBB4mpacfj6nAtHr93BwcICd3W3c2bqFzb1b6CdtSCuBclIUMkFZZFBaITOFtHwGLTMAGo3F0%2Fi3%2F%2FrL9Af%2Fx%2F%2BAW9%2F5k7965u3fffJfmlO%2FGo%2BsoTEGjjcZ2SdzbaRWCsQyECJpZJrnuVpYWJhZEzM%2BET725JSpWHzta18rB4NBDEBKKbUQQiil7LIsmdaagMmsimqlgpOPPILOpz8N43kIfB%2Fnnn8e6ydPIgzD445SxibZhkqlgmaziaWlJYxGIxRFYR0cHIR5nqs4jun06dPjRx99NH7hhaQAaqosO%2FJaNFBlKY2UBpbnwzAHvbGG2gIcm8DYZHWXNgzS%2BLDcNTxy9lmcffwz2Ng4iyCs4PDwEIPB%2BNgFmgYs70YphfF4jJ3dHVy%2F%2Fi5u3LqOdv8AiRwhwQC520emI%2BR5glLnkEdj9ApHlwCgZAEYIG%2B%2FDea38IWL%2FwWdeP338Pu%2F9beffYFu%2FK13ndZ%2F%2F6ZaeZ0ZDl0QirQwyFG6FX%2Fs2s6QNMW1Wq38%2Bte%2Fjueee%2B4%2Bbv%2BMGR%2BO%2BxqxNBWLixcvys3NTYzH47RSqeRaayWlxHRzOWMMtuNgYWEBTz%2F7LOaXluDYNtZPnECtXr9nORARQQiBIAjQarWQpimO3BhGRE673a5nWeYcHBx4URQNGGPjeh0lY4w5joNarYaFhTnMzzdQDS0w5ChMCaUJnDg4F%2BDCQuBVsbR8Cmcfewobj5xFq9mCPup2nc6JeP9A4Wnn5zRY%2BZ1rb%2BP6rXdw0N9FhjHglihYhNgMkZYxpCqgjT4%2BJwNWAhpa5jDQ0OUYstMGd1s49fjzWFj%2Fn%2FBP%2Fu7fqD1m2r%2B0wNL%2F%2FQ322X9ohTUdicSMh2NZqzby%2Bfm5JAiCwnXdWXp0xifGfc9im4rFhQsXjOM4xrZtY1mWmVoIUxhjCIIA6ydOYG5%2BHowx%2BL4Px3G%2Bq9WaMQbXdVGv16HUZFuwEII459y2bbfb7Vq9Xs%2Fu9%2FuWEMKO4zheWFigSqXCGWO0vr6Oxx9%2FDGHoI4knO0MAMxkcY1twHRd%2BEKLVmsPS0goajSZsx0ZRlHef0%2FHzaTfsYDDA%2Fv4%2B7mzexo1b13F7%2BwZ68SEYa7vrxZ0L9WT4dIXKZwUn823j%2FO0%2FE97bQgjYlg3H8cA1SSAGtAQMQCBAFSijHah8ANufx8Wv%2FCr9s3%2Fydwze%2FubP%2Fmv8m0%2BoUxd%2FZTdeO9za3DKe5%2BkwrOsgCPTFixdnIjHjE%2BOBDW0MwxBhGLIgCITv%2B9y2bdwtFtMBNr7v3xOPeL9Zf%2FdrPc9Dq9U6rlVwHIeCIKDNzU3a39%2F3hsMhH4%2FHdpIkjuM4hWVZolar0draGs6dO4dms3W0CHmAspTgnN01LMdDEARH2QwOY3A8rk8pBc45tNbI8xxxHOPw8BA3b93AjVs3sLd7k%2FPOH5xdzneePq2jZywtHwcMt4SFhbXHTDrYoqfK4kvfcby3XceFa3sQ5EBGeQnE0Hqa1ZwsFyFjoLIhVJmCJR385J%2F%2FK3Ty7Kfw6m%2F9%2BhPi9m%2F%2BzbXm87%2FSCx75PcbYcdftjBmfJA9EKI7WCrIoioTrupbnedxxHHq%2FCPwgcXg%2FU3N9OqzXdV0EQYBarYZWq0W3bt3i77zzjrOzs0NRFJnxeBz7vs8450ci46PRaCAIAjiOgzRNobU%2Bnu3pOM6xyzPNYEwH5uR5DsuyMB6PIaVEr92m7%2FzR3z05vPPNpyk7fHrJZE%2BS0S4RQ6W1ajae%2BRlaP%2F8i5taegO1V6eu%2F%2FDnkcT%2BsVxuwhQuUHPlQIk50iRpgtDya6P3eEE4igpYpZJlCFREWWjX85b%2F2S%2Fid%2F%2B1XQt3%2B55fPs7fP3eJ%2F7r95EPdrxoyPygMRihdffJFef%2F11IaV0LMuyfN9nnufdY1G8fzzeh%2BFuy8K2bXied7zrw7Is6vf7rNfrMaUUAVB5nsMYo%2BI4NtP9IUEQHA%2FCKcvyuPZhGoeY1kQA703WStMUg5t%2FsND55mvPlIPbT5t8%2BLTRZc0G4FWa5sS5n6H1Jz6HxVPPImwsE%2BMWcFwwJcEBCMaZywIUY4N0kCMZ5RhbsgAAo9Sk%2BOEua2uy55QAI6HyMajMQayLv%2FhX%2Fjp961%2F8P%2BbGG%2F%2F8Z8%2Fmv3VO7b7281j7z9%2B633s2Y8ZH4b6F4uWXX6bxeGxxzn3XdYMgCJxWq8XCMKT39z5orY8%2FpB92buRULO5%2BfZqm04YrZVlW4ft%2B4nlePB6PRVEU4eHhodnd3TWtVovq9frxZrC7J35Pmbob7dt%2FUn3z9%2F7OUwc3%2FuUz%2BfjgGah8EQCE7WP5sc%2Bak%2Bc%2Fh8Uzz6O%2BcJqE5QLEYIyCLlOofAStJIRbBUiAMw1OxKLDEnE%2FQ56WgCGUllUCgFbl8Y6Qo5PE1KowRCBMrAsDgipu4sknn6Sl9TP4o9%2F5%2B0%2Bz5PYfJX%2F4H%2F%2BHeOmlf3S%2F927GjA%2FLxxaKK1eu0Pnz52lvb09sb2%2F7cRzXhBDVpaUlZ319ndWOtnEppZCmKfr9PrIsg%2Bu6qFar8DzvnoXFHzS9ezo5ezAYYHt729y%2BfVv1er1Maz3inA9834%2BklL4xRnY6HfX2229zzjlWVlbo%2FQHTu4Wic%2F2ftV7%2FP%2F%2FL%2F6pMB2cAEOMW5pbPmPVzP4mVR57H3OpjsLwaEWOA0TA6h0zjI%2FcBALH31gpgYlEIBjBVnP3C6E%2F%2FF3AA4eR7jBEDAhgjj376va7HVCSOrQstoY0GkgINS%2BMv%2FLv%2FEf7gd%2F9xEI%2F6V%2F%2FHn%2BNX%2FpPfVJc%2F7v2bMeOj8LGE4tVXX6UXXniB3bx50zo8PPTa7XZNSllfWFgI1tfXrfX1dQqCAEopRFGE3d1dvPvuu%2Bh2u6jVajh58iQWFxdRrVbhuu49FsP7BWM6kTtJEnQ6Hdy8edO8%2Ffbb%2Btq1a3mv1xsbY%2Fqc86her8tarYZ2u60Gg4G8du0aH4%2FHfH5%2BnqY9I1P3RQhhABhjDPb%2B6aV%2FX%2BXRo49%2F%2Bt%2FE0sanYNdPw6%2B2jtwJYDSOoYdDaDX5cBPjIGJHjwQifvz%2BPQoAGFiWgOtW7XrLW2UEsKNiLzIawAhG6e%2FaWYq7RGJ6HQwRSBtoLUHGgCV7%2BOnPfZ79qz97HbtbN%2F7rv%2Fll%2Bp%2B%2F8oppf5x7OGPGR%2BEjC8XVq1fpxIkTvNvtuoeHh2Gv16sMh8Oq4ziVMAztRqNBQghEUYR%2Bv492u43vfOc75s033zSHh4emUqng1KlTdPr0aVpZWaF6vQ7P846Di9O4xt1pyWnr%2BtbWFm7duoXNzU3ZbrdTrXXseV6plBIHBwdOpVLxAYiiKEy%2F39e9Xo95nmcmW8YYXNdBo9EwlUpF2bYtKXq3YsXtn1p99Dn8xF%2F4a3j3ziFu3dyD1ttQSgIgcCEmtRdcgPHJ%2B2NcgHEOzjgY53AcG7ZlowkPtsXhh01U1x%2FBk4%2F%2FJTi2BdsWsC0BBok3XvkFeMFEUHBXUPdukTDTbAgIhhiINLRWMNBAEeHcufPY3brBpOB%2FEcDfe2C%2FDTNmfB8%2BslBsbGwgyzIRx7Hf6%2FXqnU6nHkWR7ziOzRjjw%2BEQN27cMIwxjMdj7O3t6c3NTbm%2Fv1%2FGcax6vR4bDodid3fXWlhYYM1mkyqVCgVBcLzfYxpPyPMcURSh2%2B2i3W5jMBggiiITRZGSUmqttYjjuHK0Nd2uVqs%2BY8w1xliWZXHGGFNK0WTqlMJoNES32zNB4KtarZaujf%2FvnzZGi0effBFGFrjx7jVIZcCFBc6tiUgQgTMCZwyMEThnYHxSrck4g%2BACnHFwzkDEJjUScgxTJijTAbgS4MqCVhaIGYAI2WAP0BIiXIGRKXSZAMC9IkHfQziOnttUgBgDtPoSZkIx4xPgY7kew%2BHQHBwcmE6nw6Io4lmWUZZlutfr6WvXrtH169eRZZlJksQkSVKWZZkyxuJms1lorXmSJN7m5mawu7vr2LYtbNsm27anYkEAaLrTI01TJElyNIV7soPUGCMA%2BFJK58iloCNhEJ7vi2azRZ7nket6k%2FgEY0jTFLs7O7h16yZtbt6B53nlydX9F7mwzPKJx2g07KMsS3BhgxGBcToKvLIjcZgEVadWBGNHVZ78veAsYwRjJIyMoVWBMu6CSwtcWRDaAnGGxtqz6G99C9%2F5p7%2BE9U%2F%2FHPz5J1AM7kCnHRit7hGEux%2Fvfq6VxMYjj%2BPGu2%2F%2FzJX%2FgNxLf89kD%2FbXYsaMe%2FnIQvHcc8%2Fh13%2F919XBwUE2Ho%2BHR0t%2F3OFwyHZ2dtButyGlnC4d1o7jFLVaLWk2m9Hi4qI0xohut%2Bt3u91iNBr5eZ47eZ4LYwxzHIdXq1XOGGNJktBRuvO4psLzfQS%2BT7ZtW47jcCGEcV2PXNeF53nkBwEFfkC%2BH8DzffieD9txwbhAEidgzMbNW7ewt7dPdSdxxar6yaWTT5CwLRzu7k3iCMwcicTkIIbjfg%2FGCWwqHEcWxcQNYRPxIDYZcKEng3mMLmE03juIYeHcF2GHLXTe%2FUO887v%2FHeqnPoO1p%2F4dcLcGObgFUyYwR1O9zF1BzknAk8HQ5Hsrq6u48e5bXi3jfw7A%2F%2FXAfzNmzLiLjywUR12jqiiKVGutjTFpWZaWUoqUUrAsC1prMsbQUfBQMcbKoihKzjlzXdc6yl6UZVnmRxvBdFEUvCxLc%2FSaSXDwKHYxPVzXhe8HCIKAgiDgvu9jKgquO3FdbMeFbTuwLRuWPdn3CeIYDgcI7myCMQ4pJb14dvyCgbFPPPIUoCX2DrtgIHAiMCJwAjgDOCMwAsSRePCjYyoYnE%2FcEcEnFoVWJYzRIC1hZArDJDQroZkFrSYxidrSOYTNU%2Bjc%2FCMM7vy%2FGG19C0tPfgmt05%2BFGWzCJIcw5v0icW9WJHCm8Q3zJcyEYsYPmY89j%2BLixYsqiqLUtu1cSklaa9RqNVpYWJiKgVWWpSAiPhwO3U6n48VxbDebzUBr7eZ5Lhhj7Mj14JzzqUVBlUoVnufC8%2Fzjkm%2FHORIN18ORBTH5t6Pv2bYH23EghH3kCkxcBAIhLwp0e30kSQatDSzbxnJd%2FTSIsHryLMosQRSlYMKaiAQzqPIBOHfAhQ3ObTBugwsLTNhHQU0LjFtgXEEwDU4KHAWMjCdDfvMeZP8d5BaH4hylxcDfl9HxaosQtofhwTvY%2FbN%2FjIPvfAMrT%2F9lVBqPoOjdgNIKPyh1urS0ag72d78Eol%2BYjeae8cPkY8%2BjAGBoMojyuBb5i1%2F8Irmu60ZR5JVlGZZl6TLGbGOMMMaw0WgkjDGO67rC931WqVTIsiw4jkue55HneQiCkIIwIM%2BbuA6OOxEI23Zh2e5RnMKGZdkQlgUhJgfn7wkEsaMPEwhKSYyjGJ32ITqdQwAazYrPQ4debC2uwvN87Hf7IBgwmiQiGGNQvAJwG2D25JFbIG6DuAUzPYQAuAVYFogLMMuDpqO6EBGAe3OwLH6U9ZgEPN%2BPW11EZfEMxoc30d9%2BHVv%2F4n%2BFt3AeK0%2F8DETRRxm17xGJu1Onp06fov39naVf%2B1k8958Cf%2FKxfgNmzPgQ3Heb%2BfQpEeH27dvctm27KIq6lLJhjHF937dc12W2bZPrehRWQhYGIYVhiCAI4Pk%2Bea4Hz%2FPhupOYguO6sKxJylFYk8G1wrJhWc4kG8GPAorEQcf1F%2B9Vbk4eJinWolAYDPrY2d7CcNCF53l44XT0BEFXTp46C9ISh53hRCCmNQ%2FEoEQdsCxAWCBhgYQ9eeQCJCxA2OC2N3m%2FR7EQLgQMJqXhzG3Aqp2A41hwbAHXsWAJ%2Fn2vZTh3BvWTL2D%2FnVcR730bt%2F94H9VH%2FnW05jcgB7egtPqu1GmtEkzOF%2BxLmAnFjB8iD6x7FADdvn2bOOcWEfmO4wSVSsURQjDf91GtVlGvN2h%2BfgH1RhOVShW%2BH8BxXNiOc%2BQ%2BTOIL%2FH3uA2PvZRuI7i7MomNR%2BF4opRDHMQ72d7G3twWtJFqtJlbz0U8CwNrJR2GMQneUgJg4DmAyRiBdgLQBaYAMgdOkFsJxA1iOB8v2wIQFGI20exv93jXknWuQnUkbhjYGOulAKQElJwcTP7gZzhQS1eWnIIJljHdew%2BD676G%2Fu4T5k8%2Bh4hcoosN7C7O0RBhUTJzE%2FxaAv%2FEA7%2BWMGffwIIUCvV4PjDHuuq7gnAvOOdNaU5qmIGJwPR%2FEBCrVBubmllCt1uC4HizLPhoYYx8VNrG7hOBeQfhBwnA3RmuUZYFet43trTsYDvoIwgCVSgXBbvZCENRMrblAwyiHVICwpm7LJO0pLAHL9eE4Piw3gGVPrJkijxAdvIW88y7U6Dp4vAnkXZij3g3DbOjgNLg7D6MLGKUnTWBKwdAHCIVSMFqC2QHs5Z9APtqGivax%2BfYfwqqdwNrqOkSxd491cebsWfqz1%2F70qV%2F9OTr5n%2F2muXOft3DGjO%2FJAxWK0WiESqUCy7LQaDRoeXkZnudBSomyLNHpdEFkgcgCFx5cr4IgdOC4PizLBr8rvvBhBeF7YYyBVArR%2F9femUdJltV1%2FnPfEntERkRm5L7U1lU0DfbC1mw9MpA6CCo6Js4cR9QGqpoeRT3qoCJ094jogAe0W6CrwWlGxeN0DnOG0TMKyYwCHqSBXqC32pesrNyXWDK2t9w7f9wXkZFrZWVXdQGV3zpR8d6N%2B27c9yLf9%2F3uby2VmJycYGryAkIourt6SFWf2CeU2zm07xBgsFAoaf8I08YORwmF49iRKJYdBgWV4iz1iWnc0gSydAHbncOUZWzhYiApyxh1owtppTHCaaxwnEho88uqVDNodPX%2B2lMVQLQbV2SQ5RnKS5M8Ob9IR88e%2BtJhRH0JIQS5jnYALIwfB%2F5sRxdsF7u4BK4oUaSCSuWJRILu7m72799PJpPB8zwKhSL5QoFCfpETtRr5QoGlxSV6%2BwbIdXaRTmeIRGJYwnpeJAGaKGq1KrOz04yPn6VUypPJZOgf2EPtsb%2B%2B3QcG9h0CIZgvOIElw8R16tQqRdxqEbc8j3CWMGQFizohoZPNVKRFnU5qKkZNauVlNGQTMSyiwsLc0Paggpz6CkOIVfn1DdGYc3Pyq%2BuPCBPH7sSTVZRfZHx8nDMXYrxoMEVntITpu9iWrVzP%2BQl2iWIXVwlXlCiAZmKYeDxOR0cHPT19WLZNrVpjcVG7Yi8tLXFx4izzc7NcuHCOwcG9DAzuobOrh1QyRTgSwTR3Thie51Es5BkfP8vU5AVMw6Cnt4%2Be3n7O%2FvPk7eFwRHXk%2BoRTqzI5NYnv1nFdB6UkJh4WLrZw0GVKbSoihqtC%2BCrIpcmKqUcggkRVBhgGhhkoP4N3ww5hhCzMkI1hN45fe04KocDAxVAuQrkIz0WYrq5FYoA0I9SEia%2BqOG6VJ0%2B5DN9%2BCNud49CNN4pnnv7uDz%2FwH0TqV%2F5KFXf%2B6%2B1iFxvjihMFrOSQsO0Q8USSZLINw7DIdfbQ2TnP9Mw0M9NTLOULTEycJZ9fYGZ2ioGBPfT3D9KR6yKRSOrlSOAevV3ocPQa8%2FOzTFw4x3KpQGdnJ319g1iV01nfWd43dMOL8WpLLFfq7G1XoEIII6LvfAUYhjaFaldNwGwSgTBsMEwwTAxMlGEG1pmQNtU2zLaB6da2Q1imhWXbmKYRSA5Kh6w3XTZ9lPSxPRfh1gk5LhHHwfM0gbmui%2Bc0th2UV0f6EtcXZLpvpMs1efqp79o%2B1iuBL1%2BN33QX1zeuClGA0Ux5p8mijVgshVKKdKaDTDZHLtfJ3OwMs3Oz5PMFzp4%2BxtzsFFOTE%2FQPDNHd3Ud7Ry6oEh5elS1rM%2BjgL5dCPs%2FFiXFmZ6ewbYve3j66unpZPv3tNEBPbz%2FSrRO1FQf7E0F8hYkwLRA2hmmCYQMWwjIRwgbT0uRh2Ppl2tCyLQxzZd%2BwwLAQwYvG2BiArjCG1OSA9JDSQ0mXkHSxPTdoc1C%2BB76jtz0H6dfB95B%2BHeXXQSo8CfFEqnH%2BfVfn99zF9Y6rRBQBhMAwTEKhCNF4EsuyicVTJJJp0pkOOnJd5OZmmJmeYnZ2hkKxyMkTzzA5eYHu7j6G9uyjv19XDo%2B3FAbejDCklFQqFSanJjh%2F7jS1apme7h56%2BwZIZzqoWTrHRMi2tdYgKA8olEIKCb6LEBWkEs1UdUIRKBKChYZhBtrH4F1o709laOlDYATthj5GBPvK2HAVpaWK1RKGUlKTiJKggrIHyteSh%2B8HfTwQFrbK4tWLjcu9Wz1sF1cFV5coIHhaG8FSJIxtay%2FLSDROPJEklcqQzXbQkcsxPTXJzMwMxdISZ8olFhfnmJmeon9giL6%2BATLZdqLRWOCJuVrCUEriOHUWFuY4d%2FY0U1MT2LZFd08fuVw3sXhCLx9ALy8CkkApJAqkWmeRECh8QEgR3OyBfiGoOKaJAWSDGIL4DBqOUc0s2wSu1wpU8C5AyYYGU%2BqPlNQEJmXQ10dJpWehJMiARJSvtw0Lw0uCriu0i11cNVx9omhCE4Z2aNLRliE7TDSaIJlM05bOks3m6OicZm52loX5OQr5eQr5RaamLjDZP0R%2F%2FxCdnd1ksx3EE8lVqfQa%2BSbOnz%2FDqRPPMT8%2FS39%2FP23pDPF4CtsOtZDACkm0Shag9I2p5Ko%2BND09QQiFaEoczf8aw2oe0HGfemyhjzMaSs9G1xUzRyBR6LkoJUHquUhkQGB%2BUBRZ6iWLkkhfYpg2WHHc%2Bm6U%2BS6uLq44UegsVcYWSwQRKDsFpmFi2SFC4SiRaJxEMk0m20Fnbp65uWmmJi8yMzPD1OQ4kxcvcPLEMYaG9rFv%2Fw309w9pk2o02syyPT11kZPHn%2BPcudMslwq0Z9upVKrUHSdIqqtnoIJ5KBqi%2FmrSWEckcoVIpFrfRyqF9CWO5%2BO4Pq6vcF0fJTTxCCWwbYjYAtvUPiJGMBMhFFKuIQqlaQKplyQyUH6unaOwohixGr6%2FK1Hs4uriihNFKBRqJJjRZLFJv4aIbqIlDMu0CIUjRKMJEok2Um0ZUqk0kUiU6vHnOHfuPJOTEyzMz7KwMMvs7DR9fYPkcl2EwiHyS4ucPPEcFy6cxXVq2CGb5eUS58%2BfJdWWxbJCeJ7XOoHgYb6xZLFKythC%2BvB9SbnmMH12hvL0ArJSBddFSU1APgauYeGFIphtceJdbaTjFpm4RSSkQ9i17LHxd66VOFr7CKVAmKvXSz%2BI%2BGXRjsvPAyB4lAfVv1zjGV13uOIOV7q4jo7wNI1LWypaJQxhmFimrfNJhKMoJVhYWNDmRdMAE3y%2FzvTkeQr5RSYunCOX6yYSiVAoLDExcR7XqTIw0E8oHKZWqzEzfRHDMHFdl3CpEHwjgbKRjQlgA6lhoz6eL5mbWmL60aeo%2BjATSkG8nXB7GMsAWakiCyXilRLZahEKUD5v8pSdJDrUyWB3jFzKIhoyAserLUhrozk2z%2BMHnCgcuhF8HADFHwBXnShGh8X%2FBgZ3cOj7R8bUD1x%2BkKvicKVf26vb0USQMEYIXUzHtBzqjsdSvki1ViOTzdLZ2Uk6ncZxHAqFItNT48xMTyCEgfQ9DFPQ29tNX%2B8A0VicxcUFLk5cYGpynFqtxoA9CbCiaGxIFBsSQkOhuLFk4XsrJHEh2oGfTNGTDZNN2rpyugAlU9TdDpZKLhcm85gzs%2FRQYa%2BXp3yyyBPn2mjfm%2BNAb5T2pEXIFGjN53YlGwIl6hX%2BEXcBcCNwYAfHZa70RL4XcNUcri6LJFqgQ8MdlhYXGR8%2Fz%2BTFCVAwODDEgRtuIJNpx3HqzM%2FPMT8%2Fx3KphOd7hOw4mWyWvv5BensGiEZjFIp5otEop0%2BfYn5uCtuYpLPxPSJQNrJeR7HuxlRKVyVXgNDLjfxSmZnHjzHduYdsW4T%2BXJRs0sYrV1maL2JlU7TFLCIhm55MiKFcmLlimonxAsbkFF1GjZv8JS48u8zXZru49WCK%2FlyYiNXw%2BmqVbDaZowjMND%2FoS49dXHO8gFaPS0NKSa1WZW5uhpMnj3Hq5HNUKiU6Ozs5cPBF7N93kFRbBt93yXX2UiwuUSkv43kelmWTSqXItneRznQQCkVIpfW7ZdmcOnWC%2BnQl%2BCaFwNC6QrX1U1tKRd31MJcW8NIZQpagVveZfPwYi7k%2BOrNxBjujpGIWAsX587NUjp%2FlZNc%2Bbr2xnb72MCFLYCUs4hGDzpTNzECC6ROz5BZnGAi5FCdn%2BGdX8sZb0vRmbUzBpXUmwbvA2OWJXVx1fM8QhVJKh4UvLnDq1DGee%2Fa7LC7MkkmnOXDDQfbtO0hXTz%2FRWAKlFG3pDuo76P5%2FAAAb7UlEQVS1Ko5Tx%2Fe9oOJ5hEgsQSQSwzQswpFYy1LIZLL8bSgATR8HLkkSjucjzp2lvlylYidIxiymT0xQCsVJpGMM5KK0xS1MoXUWJGIAzE%2FmmetN0JW2CFnaWGqbimTMIBqKkI33MP6UJDY7R1%2FY4%2FGZGkvLLl0pC2EFCs5L6kxAlza8Rj%2FaDza%2BCpxu2Q8DP7ymz0Xg6TVtk1dxTtcM3xNEoUnCpVDIc%2F7caY4fe5qZmYskE3H27NvPnr030NnVSyKRxrZDIAThcIxYLIUvvWbWap3oxmr6VpiYRKJxMpkcfX1VqmezqELwpcHafisdhZSS%2FGKJl82c4n8yRGfdxcCndH6SWv9e9rWFSMUMDBE83QXE25PkTZuE51JYdqk7Esswmje%2BQGGZkI6ZGC%2Ft5eSzFo9O%2BexPWzphrlABf11asUrDT%2BMHXZl5DTAypt7Zuj86LPqAiTXd%2FmFkTL3rhZvVtcM1J4oGSRQLec6fO8PxY08zPTVBNBJmz5697Nt3A13d%2FSSSaexQuCXDlfb2tJSNCqSCRo1S13XwXAfHqVOtVigW8pSWS0gpV26pwFNyM6WlkopK3SNz%2FgQRPC44IbqA2dOTFEJxUjGLdNLCNMQqM2YiYiBzWXIzRUpVj5rrEw0LDFaPrQTEIgZ7D3WQ6tWRqtmEGZAOG%2BhM5CaWGaHNpJeLI%2BKlKG4HbgNuQ3AQmEPfDF%2FC4G%2F4lDrX7H9Y3IlgEChwVH181ViHxZsQvC7Y%2BzhHm3S8nXm8C%2BhHscRD6k%2BD8V6B4C3NPga5psJWcAdHxL0tIzgcVR%2Fe8jvuEq8GXo7iVuBWoA8tCTyJ4gkkX%2BUzVz%2Fpz%2BiwiKCv9yuC1w8B54DH0KkMvzUypmYvMcbLgmNb8RcjY6qySX8DOLym%2BbsjY%2BrrLX3eAgy0fP4t4HHgncAdwK3XlCgaZQOXl0uMj5%2FluWe%2Fy4XxM9i2wZ6hPezff5Ce3kFSbVlCoUjTBVsFTlJSyqBSuofnujhOjWq1SrVaZrlUpFQqUCzmVX5pkaWlBZid8bUyUwArkZwbPbV9JSkUq9xem%2BeiY2GGLUBRuzBNsa2H3phJxDZWLREECtsSZPf3IOYWWXQl1bpPOmbgB%2FN2PUl5qUJ5aZl6qYZfriPrDrV4glpPmv4Om0TYQIj15LWhZNE4ne3iXSKLyZ8AP7%2FBcWngBuANSD7MXeJ%2BYvwOH1NVBO8EXgNcAD6%2B5rg3Ae8DwOdhggXedmcEvArBOeBPg%2FN5JXBPs0crDypeD7y%2BpaUMbEwU7xb9GDwILaSzgjcAb0CH7dQ5LO4jz0d4RPmXMfdtY3RYDAOfYb3J9aXAjwfb7uiw%2BCPgQyNjytlkqLcA961p%2BwKwIVGghYFPrWm7H%2Fh6y%2F57gR9p2b8HeEfQDqCuKVFI6VOtlJmamuD4sWc4d%2B4UKJ%2F%2BviH2BSSRTGaw7RCNyFDp%2B3i%2B15QY6vUa1WqF8nJJk0J%2BkWKhIPP5JUqlgqrXqsrzXOW6jt%2FuLFVpuB0EGsC1yszGtudJrJlposLnxHKYtqxFveoga3WMzhCxSMvTv%2BlRqT0tM202%2BUyKSL3CciVKUbgsTy1RnS2iiuUglkPDCF6lgse3puHNt7WxtyuEbcL65dAaxWZDktiuQHFEvA2TTwHdLa0TKB5DcArBIRS3Ab1oNcmvUuaN3C3ueB4%2F805QZzXZGECy5bNWn%2FXyuqOFEBzmMAYfAVJBqwJOIXgCxUX0DXobkAXCCD5Mhp%2FmPeKX%2BJRaq3fYMUaHRRL4KHBkG91t4APAT40OiztHxtS3rtQ8LhOH0VJXE9eMKHzfp1KpMDU1yYnjz3L2zHE8p0Z%2Ffx979x%2Bgp3eAeCKFAqrVCq7jrJBCeZlKucTyclGVl0uUSgVVKpVUoVCQhcKiVyqVvGql6rtu3bdty89ksjKdbnPTFZWgTlMJCGxqDq3UXJLFRQDOOTbxsEFtsUBFaI%2FKiL2y5PCVQvl%2B04piG4JQT5ae58apPpVn2nNwQmHmXYOCF6XqQt1T1H39qrmKt%2BXqzM05zORderO65umlPDZVoEtRyI0u8WocESPAIy0tX0JyF59WZ9f1PSwOIngI%2BFfAS5B8AYjs9Le%2BbBxVn0E%2FfRvzuQnRVBr%2BMUfV7215%2FGF%2BhYZ0ovEZfN7HZ9Tiur7vFq%2FH4GFgP%2FByJF%2FhPeJGPrX1EmA7GB0WFjo%2FyCsv89CXAP8yOixeNzKmvvF857EDrEtX8IITRWPJUK1WmJme5Pixpzlx%2FGkq5SK5XI7%2BgUHa23OYpsXycgnHWaBSXqZUKlAo5FWxkKdYLFAo5GW5vCyrtYqsV6u%2B73uelNKt1ar1SqVS8zzpAK5hRN1YLCp7enq8xPhykjqrgrnUBjEUUknqjg%2BuDzbMyCgHQwbOXI2abwQxG%2FpcPF9Sq7lkpiYo1iWFsstiwcGvO5iey4lKhFA8Qc6EiAlG1MKxonRFDUKWJhtDSQ6VL%2FLRzir%2FdS7KQIdFb8ZCJ%2B1ukINcNcdmm%2FKDILItcKfIYfOJYM9B8Cs8qB7atP9D6gRCvCG44T4WiPvfH7hL3AD8YbA3D%2FwcR9WXNu3%2FafU1%2FqO4BZdPIHgHkEVyP%2FDvrsBsfpeNSeI08H%2FReoAh4Ha0RaV1MWgCnx0dFreMjF3T2rLPAE9eNaJYUTBKpPSRvo%2FveUglqVarzM5Mcey5p3n2mSdZWJihLZUkk0ljmib5%2FBIL84tquVymWFxSxUJBFUsFVSmXlefWleM6frVScSqVsuO6ruv7yg2HbTcejzupVKpmWVZdCOEqpbxIJOKHw2HV2dkpa6fmKxK0scDQ6sXNRHspZfP%2B64jq4kC%2Bpy0sZmBZrSzXsE6dob1cYCjsMV%2BH%2FHKIR2ttyHAbabNEt1nmrBfmzu4SUUPywEI7PRmbAz0hEpYkWS6TKpfYF1I40uPpZ6v0t1tkYoJERDTns%2BnyQ25DorD4JJDTPwz3cnQLkmj9AeF%2Bjoge4Ld39EfwQuM%2BYSB5GEEsaLl7S5Jo4BNqmbeLO8nwUrSy82c5LP6Kh9Tf7XQqgdLxA2uaJfDHwAfW6iBGh8W%2FAT4LdLU0HwI%2BBPzmTufxPFAG3jkypv47XCWJoqFg9H1drLhWLWNaYYRRoby8zOzsDKdOHefZZ55kemqCcMgiEY%2BqQiFPpVrF96SqVGtyebnoFwsFr1qt%2BI7n%2BgLlJeIJP5VKupaZqHqeX%2FV931HK92zb9hOJhN%2Fe3u5Vq1XP9325tLSkAJXL5Th8%2BLD6k68ckWAEuSEC8%2BhGFg%2BltId3oMc4ZFWYcn2kYWLj4%2FmK4kKJ%2BW88A57PvhSUDUHRFXxj0aIeM3lRd4SQGSF1vEgmWmXZE1SVYLlQI9EeI2wJBktLdBaXiEqtPwsZMJ93WSh5uL5EKgNjy%2BWHTnCjtpIo7hKvRvAzACi%2BSZ6PXNaPGeZe6rwNeNHl%2Fh284LjIWxG8Ntj7W46q0W0f%2B4jyuUscRvENwETwYWDHRIHWS6y9v353ZEz9l406j4ypfxgdFncA32H1Mu%2FXR4fF%2FSNjavx5zGUn%2BMMGScBVIArf93Ech0qlokqlIouL89RqdSx7jlrdYWZmmrNnTnP27Ck1M30Rz3VUMpmUvu%2BpxcUFhRBSSeUJYfhK%2BfXl5eWq67p10zQ90zSdUMj2crmcF4vF3IWFBWd8fNyv1WoynU6rbDbLoUOH5Je%2F%2FGUeeeQRJYRgo5Kc64LCNlAaWgacJslrWOLWWJWpfAHXsokrj7zjUVRhqpi4nuJCVfDOJ6K8phvetcfhpsQMX0VRTGUpRyPkix5fdm1%2BtL3OsbLFkA1Jt0quVGiSBEDdh6GIT6Xua%2Bct1XAz33iOUiqU9EBtIVFIXtkUaAUfuGyt%2Fv2qzhHx%2B8DnLuu4awHBy5vbRovVZLt4UH2bI%2BILwE8DN3FExDi6sdlxK4wOCxN41Zrmx9DSxKYYGVMnRofFB2EVmRtoc%2BgLTRRHW3euKFFkMhkMw1Ce58mFhQV55swZf35%2BQRiGvqHK5bLOLzF1UeWXlpQQUkYiEa9cXq67ruNGIhEVDoc90zSdtrY2N5Foc2KxWNVxnHokEvFd1%2FXi8bhMp9Myk8morq4umclkuPfee5tsoJTi8OHDze3N0eJHseYGNIQiEhLUMxm%2BemGGOzJ1fso9wz%2B5WfKGol6o4GfDzPXv4bFTRUQN3vKqCD2ZEF%2Bq%2BVQqU9wSmuez0zHa4zG6qwt8sxymo1eSiJpEbJO22jKxNXkkFh24WIF%2BX%2BBLE53Ut%2BGoJbUzVjBXIXRyHKRCiC2IQnBr49IAj%2B7oh935cS80bgve68h1HpPbxeNoojDQlpGdnPtN0Fz%2BNPBXI2PbIuk%2Fh3VS323A53cwj52iODKm5lsbriRRqP7%2BfuU4juu6bnVxcXE5n8%2FbQhhI6eP72rxZr9epVCo%2BKD%2BdTnupVKruum65Xq%2FXfd%2F3bduW4XDYS6fTfjab9S3L8mZnZ%2F3Ozs7AMwpqtRqHDx9ussA991zew0MIAYYZFP8FpVqSTRp6PxKyGMzF%2BMpEN%2B3FCW5K%2BfxIaIH6IDxbnuJCNcKNgwkGuyJYpqAtahENC5arHv3npni6YDPpuGQyMQQL1B1JwlTc3V3EqfgIf%2F3fzIeeENQNi2xSh54LQye50S4VJg3JokkWhvbkbKTB2QS3BO8nL8sRqhVH1WmOiCW%2B9yMjNSkKnuZBtbNsPoqnWlSKt7AzothIgfn4dg4cGVOLo8PiPFrJ2cBtm%2FXfBnbitruwtuGKShQHDhyQCwsLtUKhsDgzM1NfWloyy%2BWykFJiGAaxWIx4PK7a2lKeUsrNZDJeR0eH47puvVQqeUIIGeTCVJ7nqc7OTrW4uKg6Ozu599571dYSwvahQGfdFiY6Ya5CqUbYuTZLGoZBR1uYQzfkeOAJePH8LEf2VAkbcGvS4ZbScc5V00zn%2BjAzSUKWwDAUycoyQ6LC54ppYimTeEcUf8IgbiruO5fmrdkyrzWXoCWHTt2Hx%2Bbh8xdMXnUozL7uKPGojWmuxHzod1ZIQgVE0eJE4csNGWNv8D79PC%2FbJFeDKNQGZU52gvuEAXQEY%2B483kJxbiVfYfPaXS7SG7RdzhJmLaH3XKL%2FWumlFfHL%2BN5NccWIQinFfffdp8LhcF0IIYvFYmVqakoUi0UBOvNVMplUHR0dJJNJ6bquF4lE5ODgoKxWq3J6elrddNNNAOuWEnD5UsNG8HxdJ1in5jdbEuGuwAhuSENAKCzY2x3jR17eyZOnw%2Fzis4vsVyXeMeRwMKXY6%2BXZM5XnwlyKqc4%2BRDzKSy6eAeCpZZvX7gnTkYkylUyS9hyyMcWN8fWSxNNL8NGnBB1tIV66J05fe5hwyGp6ZzbJIlC%2BNsjCMBsJ9fQZOJ6yhRCmUqtE3OPoNe7NbKa0uRTeLkJkOLjp54Jqc9skelljC9ovez4b4R4lOSKeRUsBN%2B14HJO9zT8Ig5M7HGWjyvK3bNK%2BCqPDIozOhdGKJ1q2SxsclmV1AFsrUpu0XxauqERxzz33qPvuu0%2FG4%2FG6aZqOUkpUKppI0%2Bk0qVSKjo4Ouru7VXt7u2ocs%2Fbv90qQwkYo1bEy0Ua%2BDCuo8tXIkt0MJtXvAixMEjGT%2FX0m2VSI%2Fb1xTl5c5n3nS7w1PMdrOySH0opBr8jgZJEaJhH0Pfq7%2FXmSskJ00uAlHS6d7TVMUV03J1fCN2bg0SWLV78oyqH%2BOKlYCFOvNJrKzBVdxQppaOX8SkiY42MBIaD1i55AE0Ub72Q%2FcOqyL1yaF6O9BjeGYrLlKdwFHLuM0bsv3WWbEDyJ4hZgL%2B8VKe7fQdU0xUta9r6zw5k8hjaFtkp4b6LViWxz3MH6a926%2FJlnPbJbjNexje%2B8JK641eOee%2B5RAEKIVU%2BuyclJJicneeyxx4DVisYrtaTYCkII8z%2F9GDbRFR1F0%2FIhdNCWJEilqYJ6HsF%2BJGSRazNoS4QY6orzooEk3zoWZXJighcvuRzKCl7SppokAfBDKRdwoWEt30C8lgqqHnzutGBvZ4Tb98foyUawbFOLNA1igI0lCyNYOgVmXC8gCiGEp1SwRtcuyxomP8pOiELwxkv0mGrZvpSYvIJfEmlCV0Y0BkDyZHCdBXVeD1x%2BSjrFK4IxfOo7U4iOjKnS6LA4Bry4pflnR4fFQyNj6v9tdlwgTdy%2FwUffbNme2%2BDz1wNf3GTYt15qvtvB9mv1XSZaIzo3el0D2DVXE6NecegKXga6aI8K3lFBdKqhSwgqYaAQmJZJOGTRmYlw05423viyLpYH9vK1Yoyn5xVfmd7%2BQnuxBn97Hp5agotV6EpZfPw2l9tSPlKCVFp%2FYhgmhmFhNrdNTMMK3s0gJylBBXjwJBb6abTyAJB8DZoeWR8KHKi2j%2FeIPuCDW%2FYRLToBwfC2xw7x7y9rLpeCwT%2Bxcq4f45fE5bmd3yXuQPATACge4%2BHn5RH5iQ3aHh4dFi%2FfoJ3RYZEC%2FoL1%2FirfZLVkM7PB4e8cHRbr9BSjw%2BIlwF3bm%2B7WuOZh5i8gTNdHVwlGE4GWLLQSExXEiRmAXKnJIRrrEpTOPCUFkbBgsDOObRo8HrP4wvE59hTz3JB06d3k%2BaiA00U4tgTLLkzXBN9eMvjVG30%2B8xoPw5T8fcGl4FXZN2SRS9pYVnAgLTkq1MpSwzAtTWoB3%2FsSE%2F2bWkIIQykleUg9wxHxceA3gDSKTwFv2%2FZV8%2FkE4hLr3CW%2BQ4ZxdGTkCO8Vv35Jsf%2FtwiTDL297HtvBg%2Bo7HBH3A78GHCTEB4D3b%2BvY94owiofQsp9ENCMnd4rGdW4lzkHg66PD4mPoGJDvAv3opeFvA3vWjFEBfn6NWfVJ4CQ6yreB7mDc3wzGHEBLGfewsWL1snFdEIXQ5o0mUQRGUbS5UW8bwVMZia7H0VTGN%2ByTIlAgaj1GNGTQn4vSqSrk0gM8eTrJgxOz%2FOdDy3z6GGRCEA6uri9hugJTVcFMTXC2anHRD3NzTvD5GY%2BapzjuRakg6O7yyVUk2YTAFtqPAlaUmKvOK5AoGnMPrB4WOk5AFzoFcPg9QrwZeDGCn%2BSI%2BDvg3RxVU2wGnSL%2FKIKfDFpcNtNTPKJ8DosHEHwUSFLnyxwRP8ZRtdF6Gt4rUmR5BLVKNL9SeD86bHs%2F8NscETYOH9xSOjgiBtHu04cAEDzAg%2Bp5%2BY6MjCk1OizuBJ5i9c1qo0Py37eNYX5rZEyd2GDcP2N10BvAzcDY85jylrguiAJ905ieDCQKwUqot7Gij2j2bDyjFYGrdEuJr%2BCGNdw6hlRk3TI37umjtyPGubMh4BgPnovhWTaxsBkoTrXgYhgC0xa0pS3e0BFlsDNKXsDUTBnLEPRGLPpyETKpCHbIxjADpzDYMDmNCCSKholUKX2ewWtlLfSwqvFu8Q4Mvoo2pb0FeJq7xPsx%2BEe6OMk9gXvnu8QQFq9H8RFW9A2fQNvyX73pFRZ8Gp2%2FYAD9hPwad4nfQPHNJmG8S2QxeBWCj6AjJGfQWvydZLveGEdVhbvEnSi%2BiHaF%2Fi1CvJW7xO%2Fg8i3%2BXOllkg5F3xcslf4IaAtGOEllm1LIJTAypiZGh8XbgL9kdWKYS8EDPjIypj65yecPA7%2FA9v0rgj%2FineN6IQoBiEaCq2b9TqFL%2Fa1YPETTiiAb4n5AJKppXRD4nkd08gLZpTlS9RLp%2BSmkbXN7yKXsmOwdynLzgTayiRCuJ1GAbQnCtkE0bBIJGSSjNsmoiQLyQylcT2Fb0Ba1ScZNbNNoropYRxJ6X5gmhhCoYOkhVTO9RZAUtAWfVo9xt3gpPkfRGvgsik%2FhA5OUOSKOA0OYtLP66%2F6SXt7LJF%2Fb8gofVQXeLV6B4PNBvMWLUIEy8Yg4CziYHGyZl4%2FgThQf5EoSBcCD6qvcLW7B5zPA64AbUfwvLOCImAfOcZiDQGrNuT5MmF%2FjqFqf42KHGBlTXwl0BR9DZ4y6FL4D3DkypjZ10AqUpa9H6zT%2B7RZjuegkN6%2BEQPeyQ1xXRLGyY6zcfEIQ5KkKOgmUUEFhYu3wJAyaegqkoK4EeTdEuRonUvE5rtooZrpQyufCYoUDfRa33dBOVyYCSuIrgSnAsgwsi6B%2BiX5XSpJJRPCDUoKG0ahvorTeBLXps8BYs%2FRQK%2Be58RGfVGeAYY6IX0DHHTRMZ3HWP50WgN%2FgqPpvABzZxgPp02qGt4t%2FTYYH0JmrGsrytY5LU8DP8aD6R46IrRWlO8Un1XGEuIPD3A38ASsSQwfrTYYXgSMc3bJwTx34ypq249uZysiYKgLvGh0Wf42%2BYV%2BG9qtIAD7wHNqk%2BnXg4ZGxS3uVjoypyuiwGAHuRmenehUrkafTaF3F%2B0fG1LdHh8Xvs3L%2BwDr%2FkO%2Bikwc3sM5hTVwjC8QLCiFEGEi847W88tZB4%2F8Mv%2FlnaB%2B6GSd%2FDrc8H%2FRp4Q7V0FOo5j40nu6CmuuxeHGBR8%2BUiCxMM2skSHdliUVNpIRsMsSBviRtCTuoBcKK74PRiDJZj0aC3vUSxCbnZZgYoQT1coEvfukfOLfAB%2F70S%2FJzwDJQUGrTdGpa9D7CgcDv4GYEL0ZSQjCNzkD9JY62%2FMG%2BR9wKtOFR49PbSKbyDhEnzG0YvBydr1JgcBHJVxB8sTn2EXEbBikkVY5uohc4ImIYgVu0x%2FkNk%2B1sBa04vQHFLQhuRnEAwSngcXye4M85%2FUKb4oJclnuAqZExtd7BZmdjDgDlkbENEvQ8T1wvRBECEr%2FwOl55y4Dx929880%2BTG7yZen4cWVkEoYJCwATOi40I00CJKVTz5lVK4Lo%2BS8sOZ6eXmVqokorZ9HZEScVDhExBOGwSC5mYho7XWM1Aq2ZGUwfRbGsoLzd%2Fgjd8SYUwwY5qovji33N%2Bgd%2F7kxWiKG5JFLvYxWXgell6SEDWHZ1f0fddUD5mNI1pR2m9WfU9HSg61cpTvqkrUBJTQXvcI9rmMlRxiYZN4tEQIbtRdFgvW5p6jYaJs5ljszEWTduECv6teFq2MopqjtG0gUiauT9VEKrueiw3znXlJHaxi%2BeP64ko%2FL%2F5JidfsU%2FMnj3%2BTK5z8KXCNCMoK6xjJ4IbsXHL0uIB2Ug%2F14AhFVZYEYlJ2lI%2BpiEwgkhPPYxs%2Bj00ZYZgOWOimiZYoUA2dBGqlSBWTKI0UnIpQEgtTShQhp6XUpK52WkA%2BehZ%2BS9ojbnPLlHs4griuiAKpZQUQniAV66p%2F3H%2B%2FJm7q3%2F7WTq7OoMq4q1ifsPBClByJfCjISGoRn%2FVekTz%2F8YnQptOgixZLRILjYhQmqUAN7RdrZpCoGxdiaegobosFIqMj49Trat%2F%2BvZZZtFE4Sm1VTabXezi8nBd6CgAhC6THo9B7H0%2FZdybivCLVyS8%2BXsAlbr65wf%2BUf3y9CIFtDdfRSlVv9bz2sUPDq4bogAQQsSAKNoRJ8xWEZHf%2B1Do%2Bftoe7mDrndRRRPFrkSxiyuG62Lp0QKHFa9FBc1wz%2B9XtvTQuggPfW51wNkliV1caVxXRKGU8oQQDZG8lSi%2BH28sgf79%2FODlAPVdk%2Bgurgauq6VHA4Ffhc1K8NRVqTd5ldFw125IFO4uSeziauG6JAoAoSseW%2Bgn8%2FcjUTSWUBLw16S%2F28Uurij%2BP4dVQiup8F5NAAAAAElFTkSuQmCC';

//~ startAutoTourImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAAA6CAYAAAAOeSEWAAAAAXNSR0IArs4c6QAAAAZiS0dEADEA%2FwAA25oepAAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9kKDQ4TN5Lz7qwAAAe%2FSURBVGje7Zp%2FcBRnGcc%2Fm4T8gOS4%2FBqb0npHHAKttKQMTqtjJFEzLZ3RIAg6DjoXdbCJCmc6RKsDXew4I8LgRTtqO44ko06RATxBFMgMnvUP0dHOaUeLtU1Ch5QOCWEPaJNsjlv%2F2PfS947d%2B7kX4pRnZifZd997nv2%2Bz693d79wWwBQAB%2FwEhAFXgG2iXGAfsCwOb5ho3OvuP6ipCdZknXNAK8BPwPenYftlLLNRtmuHA0uAq5Ic1ozBCsfl4ClToNdAEyIH58AvgScFOdvARXAB4AtQK9kaIs4Vlro3Jp0U0fTgO0FPitsPw1MivFf5WA7pTRKShaJMRdwUBx3SHNXSHNTpcSLYs6fxd8bgDcF2BVJ458T41qWttPKYnEz8bAoTTE3E4Ot0pyVwHnx%2F%2FeyALtaymFHwQL8RFI0BnxfKhDZgj0qrv9FnH9bnE9IkZMK7ELg52I8XAiwpcAekaNxhdeAD2YJ1iNFyWMWabLVBuxfgT8CfwfelMY%2FUwiwcXEDXwZGhdL%2FJrWNdAa%2Fm6bCJrchu3lXgK4coionuVdS7M3QYAVwOQ1YA2izAHtA%2Bv8NsegUAux3gAtAUBqrlRQvydDgF6Rr68Rc%2BfiXuPZrC7D3JPXTHxUK7CZJyU9FXp0R569mGMaKKCYG8DcbO70WbUguUGXA89LY%2BkKALQYGbUJuc4YGW6Txbhs7d0rFa69NNa4TC2yIlLirEDlbATwleuIN4Bzw6SxC6ZAYmwKqU9g5KRWgRTat5x6xmTBEhS4udIG6Le9YCYfD6VpMVoeqqo6Gp5KvAk3TjGAwSCAQYPjVfzA0WAfA1LNjWesq31pvbq%2Fax%2Fna40%2Biqqoj9%2BgIWJ%2FPZwSDQTRNw7OkmBeO1OR9Q43t47MLVvvQ2PwAGw6HjbUtD9B87wLn0uDfMwlAVVVFVVXHwJbkEb64XUUc7VvsGNgPd14xn%2BU2TgA4CjRvCQQCjhYkwPAsKTYuXbpUkN7pxMoZZ86coaWlhWg0yszMDNFolKGhIfbs2cPpk4dnQ9NORG6aygyDSCSC2%2B12NF8BihxZMUWhpKSEsrIypqen2bdvH2vWrGFh7LcMDdYx9exYwlE6PJ1QkDray1j74NsvQ8rKygoSiSVOKuvr60NVVZpXTHL5bD2xU5GbWlD51np0kZfeu4rxfbKC%2FsOTRK4ZuLugutt0ptt8cjW0H6PMK7ChUAifz4d74ShDp6pRzupMWoAE2LA9wsiFG7Nt6v6NpQSPneATh9oKXmPyWrVwOGysX7%2BeK5fPMzRYx4Jzk1x7%2FrolyJ691wmenprN38aHdfx%2BP52dnXg8nlmPLhVPrcNJz0lOeDgnz46MjBiqqrK25QFx8yIvLXZEMsj9OyppbB%2Bn7SMdhEJP0tzczOjo6Jx1j6zBBgIBo7m5GU3TuHy2%2FiYPJrz73DjBC0dq2L%2BjktUbJ2i4%2B3388rkDLF%2B%2BnIqKCgBisZilnWQPu7vMVpSPh7MG6%2Ff7ReUsZcP2iP2m42oM7WqMDdsjDF%2B8g94n%2Bti0aRPRaJRoNIrL5ZqtvJqmzYlnc1klQ%2FaonfTsvc7AkUl27txJd3c3lZWV3N1blbGRpUlvnOQcztW7OXm28eEDRCL2Xu3o6BCbggF2796NYRjUfqXYMQ%2B5u3JrSVmDdbvdRCIRFlcpN%2B2MGtvH8ffsQlVVQqEQAwMDKIqCoii2HsvW08Pdt6DP%2Bnt2UfvQ7oSx48ePs27dunn7ciFnsKqqsnnzZsbGxqiqqsLlcuFyudB1nfLyctvfZeqZVDl7S%2FbGy5Yto6GhAV3X0XWd6elpdF1PaCeapuHz%2BeA5t2MemrMC5fV68Xg85vOs201TUxPRaJSpqSmKioos57e1tREOh%2FF6vUqqopOJR%2Be0z%2Fp8PqW1tdWorq5OOW%2FVqlV4vV76%2B%2FtpbW1VgsHgLc%2FZefMmINmzhdgbF%2FEOknnnWaeK0bwGawXYSaC3RXi7A%2FgNJsnqBjAO%2FA74lE2e2zFc7L6y2b1dPJdiTjLTrVGMGZhUhpsah%2FTbj1pGEvB7Ur%2Fu%2FAPmV%2Fi5BmvFdHtanEcw6Uxy4Y1%2F1R%2B06rMLgGOYH5HB%2FFp%2BDLgINGB%2B9V6NyWk6AXwI0POMoq8Dr0vnV23mXMSkB92HSV2oF97cBnRiEtIew2T3ADyKyQEBeMLKcJyrGMOkFSgW4d0tra7fAc%2BuSPXcTGZMt6fE%2BUUgvin%2Fkxg7ZKf8PyR%2B7reTH4h5L90isMlMt8WipsQ5Ve8X%2F0eBJivFdZLy96QBu1yaW%2BNwzv4iDVg7pluPGHtFpJ4BPGMHoElS%2Fl5hoBFrzmKJNLdpDsBmwnQrF5U6fm2SRPpSgtTYGJ8S1fljUg43SNfflSfYR0nkRd2ZwYJYMd0QhcpI0YoS5J9pyv1pAe6r4vy8tADxfpfM9b1fyp9cczYTphuYDBo5OlNKnI2mAxtEaNwHfEsYMYAR0R4MYIf82EkiETMuXdLC5Ao2E6ZbNnpnG%2FEJ6Qch4JvA5zGp8jPStTeBR0TBAAiI8WlRrb8o%2Fupi%2FIc2N9XL2wzwLcDHbW48HdMta7DxaneQzD8ex5XWAi%2FbzHlZVPtcd1CZMN1yAhuXduCwCN%2BYCN2Q8PJKTALnW0lKazAJ2BfEfvo1YL%2FUnvIFC%2FZMt7zA3pb%2Fd%2FkfiMwJzNzUadkAAAAASUVORK5CYII%3D';
startAutoTourImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAAAcCAYAAAAZSVOEAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAKTgAACk4BGCrFqwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAiJSURBVGiB7Zl%2FjFxVFcc%2F571582t3ZnZ39vcWWnZpKW3X8qMtCogCIhUBoURChEIUAYEGY43aAEIwEPwRqbEICpGQ4h8qqIhGBBpsEEpLoKTQ1ha32x%2B7bEt32w77a3Zm3rvHP2aWvp3OtrNlIUH4JjeZe%2B455577nfvOvec9UVU%2BQWn86ZbELeHaaXd1dfVc%2Bq2He1ePp2d9iDF95GAFrGnzF95cdc4l1z%2B98tutP0NESupNxmQislREtvhacDL8HkUc04riuGIi9vddITMeWTLl1se%2Bc9wDABgv446kSAQz4fMWfXPpE7fPe2XF5VJXbBeYpPjrgRN8%2FZL%2F2IeAYFEc1YdT%2FsViaYpG6y%2BOV9ctSh479%2Fjzr7u%2Frv6Y2bGOl1buAW7yVEc818U2WUx%2Fp%2FXpz5w%2Bb0tNzYYHb6q%2F9sYH9j496meySPzIYeV3p6%2BeftrVsxqPOylZ3dBqWXYARfHUAvXif7jz9E3hxNQ4eACIWLjpPlqb4k3x6GmP3%2F%2BN5GVLHtn3DHxMSVxxlcyae9bX2rvSNTUDO3uJ9I4QilQSikSpq4dgwI6e%2FNnLZlXYwwz1dhBubMN4exDLBpRE2KuoqU4sAZ6BMnKiiIREZLaIJCZzIZJHm4i0vE8%2FSRFpmohNNFF3fTzZUoPnUulkiIVcYmFDLCyEg4JmD5Deuxl3aA%2B2pfRsepbBkSy2E0EsG8uyqK%2Btnjt60IxLooicICLPAkPARuCAiGwVkQt8Op8TkR3AjUXmW0Vkh4i0lvB7rYi8BPQDHUC3iOwVkb%2BKSLOILCjYjrZwwe48n2yriLSIyOtAH3CNiLwCPF803d0F%2FR%2F4heFQ6MyhdBbHAStUTSBaSyTRTLS6GZM%2BgJsZIBRNUFFZQ6J2Ki0nno2bHmB3Txc5qUQsm7ramsYVVzqnwTiPs4i0A%2BuAiF8MzAD%2BLiLLVPWnhfGpJVyMyhyfz0bgYeDCEvp1wMXAKcBPinyOHlJRn9wDVgPH%2B%2FSmAMU7ssbXAFh%2BubScePKC5v0DORwngpdNMdDdQf%2BWbnKDe7CClcRqmollBjBZ7z1H4cokqRGHjs7tWOEqjquOOPGa5A3A2vFy4krGEuiHAPeIyFPjjB9qIBIAngXaj6A6BfhlGS5txhJYNqJV8UVtx5%2FQ2N3XB54LBqxQBURasZpmEolUUBmLU1kZw4lGUQH1XILpYZLBdwnF6uhP7cOLVlCb3DEPSuzEQo46ySd6GrgZuBT4eUEWAM4FngS%2BDnwVuMBncx3gArsL%2Fe8xlsBh4E7guYLOp4BbgIuY2PXoDWBFwU8n0Arc6xtfCfwLeHNUYEugLuRY0tYQAkKIJfnUJgaxDNgZxDoAI0MMZwKICKoG4%2BWIkCUUyVAdCCCSIxQOx0fJKEZxHntZVbeLyHLgJd8i31bVt4FHRWQmY0l8TFUzkE%2F8wB2%2BsUFggar%2BxydbBawSkR8DY%2FLXYbAVmK%2Bq2UJ%2Fp4jMYCyJa1X10WJDNQbURY3B5DzU5JvxXN56Yye9qRFyQ2kCToD2eS2EQwKeh6ceeC7G87DDcbKZdA5Kk7gVUA6SdZuIRIE%2Fquq6MhfoxylA2Nf%2FURGBftwBLAKml%2BH3IR%2BBE4NYGPcgeWo8jHqsX%2FtfrOo4ba0hqmuaeWXdTlY%2F8SpespqF5xyD6kFdC0F1nNNZVfcCv%2FWJQsAyYL2IvCgiF8k4NeQ4KM6DfxlPsUDK38r0u30CMYydB0GNixoXY1x61m%2Bmq2M38eYkc1rjrP13J1nXZf6CZs5d1E5%2FKs07B9IYz8V4Luq5AIyyMN4V5yZgCdBbJD8DeAp4XkScQ6xKw1%2BGueRz1%2BGwuUy%2F6TL1SkAwxsMYj5HuHrq6U3TuPMC0xjDqucyeXc%2BWbfvo27aHTWu20RrOsmv3oI94D%2F%2FLr5IkqmpOVX8FtAH3AKkilc8DPywz4m7f7wBQewT993X5LgtioYVd1bvrHax4BdmRLJn9KYbWbmDX2yn2buwi1b2P3ZEEzS0x6Op9j%2Fj3iCTP5GErFlUdUNXbCwtbWjS8sMyQNxT1zzqC%2Fnll%2Bj1qqFgFMjyGIjGah%2FdjeS6rXtjJk1szJDVLLBFm34DLuVOFL9l9BIfSZLO5%2FCNtXNTL5g8oSpAoIneJyD8L7XERCarqsKouB172qTaXGfPrgP%2FN730iUlVKUUQuAc4s0%2B9RQ2wbUYOitM1q4i27ii84fSycarH48hM5NuSSaIhR40BbTxe7BmDlDodgMIgVcLDtICIWaowFpU%2Fnd4Dzff0OEbmX%2FInpPyReLSdgVe0SkYeAGwqiY4ANIrIUeAHYR%2F7ifBVw60TIOFqIhFCxsAC1lDPPnsH6znp612xk0eAbtDmG2ZlhYg2GzgF4rVdYfMEUHCeEUYMaDzsQALFsEYmWIvHP5C%2Bwo7t0GfB9Dt21v59A3MuArwCNhf6xwBOF3zl85eEHjUxOg5btYFkBjBosFYwqc9uSDNbO5%2FFVm5gjKbb1K9vSDsNOhFMTWbZ3j3DyrHosFNRgOxHUpAJA1SEkquqews67zSc%2BhEBVLZtEVU2JyIXA74CZRcN%2BAvcDDxbNPalwjQZAEUuwsVEVLMDyPDIb32LO9CQvdlVx6hebaQ3aNFWHAKU95%2BIE5eBh4oRQy7KBcMnaWVVvF5GN5Ms8f%2B4bLdeWTzR4VX1NRE4B7gauBBr8awPWANeQ36UfIIluP8bDqWhA8UBBUIwa3p05n%2Bb6Sq4%2BwyH%2FAc8UsrkSVs3nUQGMQSwb9VwDIEf62leopecCPcDmo64SDvXbWPC7H3hTVUcmw%2B%2BRcE67NFz%2F5RlrGmrrKgyIZRRPEEERLZSElqJGUdX8hVo1T7aQ34kKOdfV59Z1%2Fmb5PwZ%2FfUQS%2Fx9ReImbf0199IiSz%2Be9H1cSLfJ53rwPN0HAqGr2Y0niZOOTj%2FeTgE9InAT8D1d5WQk3kn0aAAAAAElFTkSuQmCC';

//~ closebuttonImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAPCAYAAADphp8SAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAFPwAABT8BE2RkrAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAK9SURBVDiNfZNLaBNRFIb%2FO5lJJjGSNtO0lNAm0xZaWxeCpMG4KSrUirpxI0TduLIIPkAQBXEhSBe6EEHQhYoNWKuID%2BgLfODGUrCIGlsKtmBfE1MjQ5Kaedzjog%2FGRjzwcy%2Fn3P%2FjHC4HRASnBurrz77Zvv11L%2BDfWCMiDKrq5Vfbto30Al5nXoQjBiORi2oicV6yLL9LkkZSjHUmifS1%2BnBDw1U1Hj8l2rbXJYrDKca6kkR5AGBEtAKpq7sU2bHjvJDJeEEEV2UlFjVtbHZsbO9hy%2Fo5pKrXou3t3dA0GURwKQpmZ2bez42P704SFdc7Mg1DM02z6GbMS7YNvrSE6lAohlhsZCAS%2BRCNxY7y%2BXmPYwBulUpZAMZfHQHAs2DwcF0icd2Tz9eSaQIAXIEASJaJaxpbeyeEQvb3dPpRdmrqSJKIl4EA4GlFxb5wLHbLZ1n1vFRCWSjK77nPn%2B92TU93O9NlIADo93p3qx0d%2FeKvX5Vw1KWaGnwbHX1wYHHx2EaPsDGRYkyuiEYviLZdaXMOm2hdRi6HYFPTzsc%2BX8t%2FQSnGPFVNTS%2BU2tpdZi4HzvmKAHDOYS0vQxaEBqW5uf%2BhJFX%2FE5RizB1U1WdKOLzH1HVwInAikN9vmm53hgQBnAhWsYjNgcDWYGPj8xRjvjKQv6rqnhKNdhq6Dptz2JyDb9pkLE5M3F74%2BPF4SRA0DsDmHIauoyIcjvtDoftlIKNQ6NGz2UmIIjjnIJ%2BvpH39evPgwsLJQ7r%2B8kc6fc50uXKcCJAk6JnMpJHPX1mfzbkvfbLcOtzWln6XSBSeKEoPAAmAZ1XuvkDgzNt4XB9qafnSJ8utTu%2F69zPGPADk06K4pdnj2X%2BiULgHwL0KEwBwAOYNny%2F5yTCG7ljWBIASgN9EVHKCGABx1bwmz%2BopALAAmFhZCcNxN4mI%2FgBbEHoE%2FKbG8wAAAABJRU5ErkJggg%3D%3D';
closebuttonImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAPCAYAAADphp8SAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAFPwAABT8BE2RkrAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAK9SURBVDiNfZNLaBNRFIb%2FO5lJJjGSNtO0lNAm0xZaWxeCpMG4KSrUirpxI0TduLIIPkAQBXEhSBe6EEHQhYoNWKuID%2BgLfODGUrCIGlsKtmBfE1MjQ5Kaedzjog%2FGRjzwcy%2Fn3P%2FjHC4HRASnBurrz77Zvv11L%2BDfWCMiDKrq5Vfbto30Al5nXoQjBiORi2oicV6yLL9LkkZSjHUmifS1%2BnBDw1U1Hj8l2rbXJYrDKca6kkR5AGBEtAKpq7sU2bHjvJDJeEEEV2UlFjVtbHZsbO9hy%2Fo5pKrXou3t3dA0GURwKQpmZ2bez42P704SFdc7Mg1DM02z6GbMS7YNvrSE6lAohlhsZCAS%2BRCNxY7y%2BXmPYwBulUpZAMZfHQHAs2DwcF0icd2Tz9eSaQIAXIEASJaJaxpbeyeEQvb3dPpRdmrqSJKIl4EA4GlFxb5wLHbLZ1n1vFRCWSjK77nPn%2B92TU93O9NlIADo93p3qx0d%2FeKvX5Vw1KWaGnwbHX1wYHHx2EaPsDGRYkyuiEYviLZdaXMOm2hdRi6HYFPTzsc%2BX8t%2FQSnGPFVNTS%2BU2tpdZi4HzvmKAHDOYS0vQxaEBqW5uf%2BhJFX%2FE5RizB1U1WdKOLzH1HVwInAikN9vmm53hgQBnAhWsYjNgcDWYGPj8xRjvjKQv6rqnhKNdhq6Dptz2JyDb9pkLE5M3F74%2BPF4SRA0DsDmHIauoyIcjvtDoftlIKNQ6NGz2UmIIjjnIJ%2BvpH39evPgwsLJQ7r%2B8kc6fc50uXKcCJAk6JnMpJHPX1mfzbkvfbLcOtzWln6XSBSeKEoPAAmAZ1XuvkDgzNt4XB9qafnSJ8utTu%2F69zPGPADk06K4pdnj2X%2BiULgHwL0KEwBwAOYNny%2F5yTCG7ljWBIASgN9EVHKCGABx1bwmz%2BopALAAmFhZCcNxN4mI%2FgBbEHoE%2FKbG8wAAAABJRU5ErkJggg%3D%3D';
			
locateMeImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAQCAYAAAAmlE46AAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9kKGwgzGjNX4ooAAAJcSURBVCjPhZE%2FaBNxFMe%2Fd7mUpnfpL71LQkg9IVr%2FZCikf9SC7WAJSRRrrUPpoMEiSRdxcwnoJOggRboIWhIc2qLE4iTYDqU4WB38Q6HqItKKtZfalMsld81d8nOqBGrqg7d9P%2B%2FzHo%2FBf6o6N3oF5tYY7LwflvUMHH%2BHjWQ0Zl%2Fo5cVJprx6DfJ5oNELUAY09%2BknTPOYbR9TO7P95jGkEMA2ALQKMCwYu%2BCEtm5ydXXU7MfOOlDeBsABpgFwRcDGA%2FrGhfpgefMkKmVAWwMcVcBWAmwaUMoBDJuvD1a046AA8l8AQwXsImDqgFEA5Ni9%2BqBVbAUFUK0AhTWgugY0eEB9fXfZSGZ%2BF2xvaWmZNgwjwPN8ibMxm9TSvQwFsNvC4Qp1d8fZc0%2BnAYAjhBwslUrvOzo6fg8MDFyfmZlx9ncf8rHW6xQoAMYO6u5SQIJRNpL5%2BHejzs7ORx6Pp5JOp0Wfz%2FdWkqSdG5fDOZpxUvrERxfHzxaDbQce7DklEok8F0VRBwBCiDUyMjJenRu9amVPa2OXThR6e3tHA4GA6na7T9VybDAYnFVVtdHv9%2Ff19PSsLiwsnPmxWfzONh9tXf5l%2F6AoSiIUCr0SBOHhHmssFlsnhGwkk8muaDSaFwRhixDymeO4yuDg4Gw4HL7t9Xq1WoYDgOHh4T5N05anpqbmnU5ncmJionllZWWI5%2FlFVVVvZbPZdy6Xq6goyt63pdPptng8%2Fk2SJMPhcOREUXwhiuJiU1NTgRBCE4nEzdo8848BQ0tLS6l8Pn9E13Uiy%2FJXWZbvp1KpydrcHyPz5blPQjIYAAAAAElFTkSuQmCC";		
// init core variables
function initCore(){

	// setting up the language
	lang = languages[GM_getValue('language',1)];
	
	// getting all tours
	tours = eval(GM_getValue('tours',new Array()));
	// structur a tour:
	// id 		<--- int
	// name 	<--- string
	// caches 	<--- caches
	
	
	
	// go get the current tour from the tour list
	currentTourId = GM_getValue('currentTour',-1);
	currentTour = getTourById(currentTourId);
	
	

	// oh - there is no current tour!? create one!
	if(!currentTour){
		currentTour = new Object();
		currentTour.id = getNewTourId();		
		currentTour.name = "Tour "+currentTour.id;
		currentTour.geocaches = new Array();
		tours.push(currentTour);
		log("found no currentTour! Creating new one: "+currentTour.id +" ; "+ currentTour.name);
		saveCurrentTour();
	} 
}

function initDojo(){
	// just dont start the script on the gc.com print page!
	if(document.URL.search("cdpf\.aspx")<=0) {

		unsafeWindow.djConfig = {afterOnLoad: true};  
		
		var script = appendScript(dojoPath + "/dojo/dojo.xd.js");
		// check after 5sec iff dojo is loaded - otherwhise asume user is blocking Javascript (possible not right)
		window.setTimeout(function(){
			if(!dojo){
			   alert(lang["SCRIPT_ERROR"]);
			}
		},20000);
		
		script.addEventListener('load', function(event){
				dojo = unsafeWindow.dojo;
				dojo.require("dojo.fx");

				init();
				}, 'false');
	}
}

function init(){
	// init the core components (first tour, current tour)
	initCore();
	
	
	// update the complete gui if the tab gets focus
	window.addEventListener("focus", updateTour,false);

	if(GM_getValue('tq_url')){

		// iff the cancelbutton is presssed 
		if(GM_getValue("stopTask",false)){
			GM_deleteValue('tq_url');
			GM_deleteValue('tq_caches');
			GM_setValue('stopTask',false);
			document.location.href = GM_getValue('tq_StartUrl',"http://www.geocaching.com");
			return; // then return!
		}




		var tq_url = GM_getValue('tq_url');

		if(tq_url == document.location.href){
			var tq_caches = eval(GM_getValue('tq_caches', new Array()));
			var tq_typeFilter = eval(GM_getValue('tq_typeFilter'));
			var tq_sizeFilter = eval(GM_getValue('tq_sizeFilter'));
			var tq_dFilter = eval(GM_getValue('tq_dFilter'));
			var tq_tFilter = eval(GM_getValue('tq_tFilter'));
			var tq_specialFilter = eval(GM_getValue('tq_specialFilter'));


			addOverlay(document,lang['pleaseWait']);

			//~ var pagesSpan = dojo.query("div[class='widget-pagebuilder']> table > tbody > tr > td > span")[0];
			var pagesSpan = dojo.query("td[class='PageBuilderWidget']> span")[0];

			if(!pagesSpan){
				alert("no caches here :-( pagesSpan missing");
				GM_deleteValue('tq_url');
				GM_deleteValue('tq_caches');
				document.location.href = GM_getValue('tq_StartUrl',"http://www.geocaching.com");
				return;
			}

			//~ alert(pagesSpan.getElementsByTagName('b')[1].innerHTML);
			setProgress(parseFloat(pagesSpan.getElementsByTagName('b')[1].innerHTML)-1,parseFloat(pagesSpan.getElementsByTagName('b')[2].innerHTML),document);


			//~ var resultTable = dojo.query('table[id="ctl00_ContentBody_dlResults"] > tbody > tr');
			var resultTable = dojo.query("tr[class = 'Data BorderTop']");
			var j = 0;
			for(var i = 0; i < resultTable.length;i++){
				//~ if(resultTable[i].innerHTML.indexOf('<img src="../images/silk/building_go.png" alt="Send to GPS" title="Send to GPS" border="0">') >=0){

					var entryTds = resultTable[i].getElementsByTagName('td');





					var entry = new Object();
					entry.id = 'GC'+entryTds[5].textContent.split('(GC')[1].split(')')[0];		
							entry.name = entryTds[5].getElementsByTagName('a')[0].innerHTML;
							entry.guid = entryTds[5].getElementsByTagName('a')[0].href.split('guid=')[1];
							//~ entry.image = entryTds[2].getElementsByTagName('img')[0].getAttribute('src').split("/")[3];
							entry.image = entryTds[2].getElementsByTagName('img')[0].getAttribute('src').replace(/WptTypes\//, "WptTypes/sm/");

							var type = entry.image.split("/")[4].split(".")[0];
							var size = entryTds[3].getElementsByTagName('img')[0].getAttribute('src').split("/")[4].split(".")[0];
							var difficulty = trim(entryTds[3].textContent).split("/")[0].split("(")[1];
							var terrain = trim(entryTds[3].textContent).split("/")[1].split(")")[0];
							

							log(entry.id+" "+entry.name);
							log(type + " " + tq_typeFilter[type]);
							log(size + " " + tq_sizeFilter[size]);
							log(difficulty + " " + tq_dFilter[difficulty+""]);
							log(terrain + " " + tq_tFilter[terrain+""]);
							log("");


							var addBool = tq_typeFilter[type] && tq_sizeFilter[size] && tq_dFilter[difficulty+""] && tq_tFilter[terrain+""];

							if(tq_specialFilter['is Active']){
								log("Check if "+entry.name+" is active:");
								log(addBool);
								addBool = addBool && (entry.name.indexOf('<span class="Strike">') < 0);// only add if active!
								log(addBool);
							}
							
							if(tq_specialFilter['is not a PM cache']){
								log("Check if "+entry.name+" is PM-Only cache!!")
								log(addBool);
								addBool = addBool && (entryTds[2].innerHTML.indexOf('small_profile.gif') < 0);
								log(addBool);
							}

							if(addBool){ 
								tq_caches.push(entry);
							}
				//~ }
			}
			GM_setValue('tq_caches',uneval(tq_caches));

			var gcComLinks = document.getElementsByTagName("a");
			var nextLink;
			for(var i = 0; i<gcComLinks.length;i++){
				if(gcComLinks[i].innerHTML == "<b>Next</b>"){
					nextLink = gcComLinks[i];
					break;
				}
			}

			// check if there are some caches on this page (next link ist not there)

			if(!nextLink){
				alert("no caches here :-(");
				GM_deleteValue('tq_url');
				GM_deleteValue('tq_caches');
				document.location.href = GM_getValue('tq_StartUrl',"http://www.geocaching.com");
				return;
			}

			var action = nextLink.href.split("'")[1];
			//~ 
			if(action){
				var u = 500;
				var l = 2000;
				var waitingTime = Math.floor((Math.random() * (u-l+1))+l);
				// wait between 0.5 -> 2 seconds to do the next request
				window.setTimeout(function(){unsafeWindow.__doPostBack(action,'');},waitingTime);
			} else {

				currentTour = new Object();
				currentTour.id = getNewTourId();		
				currentTour.name = "autoTour "+currentTour.id;
				currentTour.geocaches =tq_caches;
				tours.push(currentTour);
				log("autoTour done - create new Tour: "+currentTour.id +" ; "+ currentTour.name);
				saveCurrentTour();

				document.location.href = GM_getValue('tq_StartUrl',"http://www.geocaching.com");
			}

			return;
		} else {
			GM_deleteValue('tq_url');
			GM_deleteValue('tq_caches');
		}
	}



	// add global styles

	var head =document.getElementsByTagName('head')[0];    
	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML =
		'.cachelist li {'+
			'	-moz-border-radius-bottomright:10px;'+
				'	-moz-border-radius-topleft:10px;'+
				'	list-style-position:inside;'+
				'	color:#000000;'+
				'	margin:0.5em;'+
				'	padding:3px;'+
				'	width:120px;'+
				'	min-height:40px;'+
				'	-moz-background-clip:border;'+
				'	-moz-background-inline-policy:continuous;'+
				'	-moz-background-origin:padding;'+
				'	border:1pt dashed gray;'+
				'	background:#FFFFFF none repeat scroll 0 0;'+
				'	color:#000000;'+
				'}'+
				''+
				'.cachelist {'+
					'	font-size:80%;'+
						//~ '	list-style-type:disc;'+
						'	padding:0;'+
						'}';
	head.appendChild(style); 	




	if(document.URL.search("webcode")>=0) {
		document.title = "GcTour";
		document.getElementsByTagName('body')[0].innerHTML = "<div align='center'><a href='http://www.geocaching.com'><img border='0' src='http://madd.in/icon.png'/></a></div>";
		downloadTourFunction(document.URL.split("webcode/")[1]);

		return;
	}



	var cacheListBody = document.getElementById('cacheListBody');


	if(cacheListBody){
		cacheListBody.addEventListener('DOMNodeInserted',
				function(evt){
				if(evt.relatedNode.tagName == 'TD' && evt.relatedNode.childNodes.length == 1 && evt.relatedNode.childNodes[0].nodeValue == " " ){

				var addToTourButton = document.createElement('img');
				addToTourButton.src = addToTourImageString;
				addToTourButton.style.cursor = 'pointer';
				addToTourButton.style.cssFloat = 'right';
				addToTourButton.addEventListener('click',addCacheToTourFromMap('http://www.geocaching.com/seek/cache_details.aspx?wp='+evt.relatedNode.previousSibling.firstChild.nodeValue),false);											
				addToTourButton.title = lang['addToTour'];
				addHoverEffects(addToTourButton);	
				evt.relatedNode.parentNode.childNodes[2].insertBefore(addToTourButton,evt.relatedNode.parentNode.childNodes[2].firstChild);


				}
				}
				,false);

		// next lines are for the button in the map bubbles
		var mapElement = document.getElementById('map');
		if(mapElement){
			mapElement.addEventListener('DOMNodeInserted',
					function(evt){
					var gmCacheInfo = getElementsByAttribute('id','gmCacheInfo',evt.relatedNode)[0];
					if(gmCacheInfo){
					if(!getElementsByAttribute('id','addCacheImageButton',evt.relatedNode)[0]){
					var typeImage = gmCacheInfo.getElementsByTagName('img')[0].src.split("/")[6];
					var guid = gmCacheInfo.getElementsByTagName('a')[0].href.split("=")[1];
					var wp = getElementsByAttribute('class','code',gmCacheInfo)[0].innerHTML;
					var name = gmCacheInfo.getElementsByTagName('a')[0].innerHTML;


					var addToTourButton = document.createElement('img');
					addToTourButton.alt = lang['addToTour'];
					addToTourButton.title = lang['addToTour'];
					addToTourButton.src = addToTourImageString;
					addToTourButton.id = 'addCacheImageButton';
					addToTourButton.style.cursor = 'pointer';
					addToTourButton.style.marginRight = '5px';

					addToTourButton.addEventListener('click', addElementFunction(wp,guid,name,typeImage), false);
					addHoverEffects(addToTourButton);


					var linksDiv = getElementsByAttribute('class','links',gmCacheInfo)[0];
					linksDiv.appendChild(document.createTextNode(' | '));
					linksDiv.appendChild(addToTourButton);

					}
					}
					}, false);
		}	
	}


	// add the buttons to the search table
	var searchResultTable = document.getElementById('ctl00_ContentBody_dlResults');
	if(searchResultTable){				
		
		
	
		// add after every entry a button 
		//~ var resultTrs = searchResultTable.getElementsByTagName('tr');
		var resultTrs = dojo.query("tr[class = 'Data BorderTop']");
		for(var k = 0; k<resultTrs.length ; k++){

			var entry = getEntryFromSearchTd(resultTrs[k]);
			

			//~ GM_log(entry.id +" "+entry.name + "  "+ entry.guid  + " " + entry.image +  " " + entry.checked);
			
			if(entry){
				var addToTourButton = document.createElement('img');
				addToTourButton.alt = lang['addToTour'];
				addToTourButton.title = lang['addToTour'];
				addToTourButton.src = addToTourImageString;
				addToTourButton.style.cursor = 'pointer';
				addToTourButton.style.marginRight = '5px';

				addToTourButton.addEventListener('click', addElementFunction(entry.id,entry.guid,entry.name,entry.image), false);
				addHoverEffects(addToTourButton);
				resultTrs[k].getElementsByTagName('td')[8].appendChild(addToTourButton);
			}
		}

		var newButton = document.createElement("input");
		newButton.name = 'btnGPXDL';
		newButton.type = 'submit';
		newButton.value = lang['addMarkedToTour'];
		newButton.id = 'btnGPXDL';	
		newButton.setAttribute('onclick','return false;');	
		newButton.style.cssFloat = 'right';

		// on click add an element	
		newButton.addEventListener('click',  function(){
					for(var k = 0; k<resultTrs.length ; k++){
						var entry = getEntryFromSearchTd(resultTrs[k]);
						//~ GM_log(entry.id +" "+entry.name + "  "+ entry.guid  + " " + entry.image +  " " + entry.checked);
			
						if(entry){
							if(entry.checked){
							addElementFunction(entry.id,entry.guid,entry.name,entry.image)();
							}
						}
					}	;		
				}, false)

		// add it under the search results
		searchResultTable.parentNode.insertBefore( newButton, searchResultTable.nextSibling);	

		//alert(resultTrs[4].innerHTML);
	}	

	// dont display the list on the sendtogpx page
	if(document.URL.search("sendtogps\.aspx")<=0) {
		initComponents();

		// add the button to the details page
		if(document.URL.search("cache_details\.aspx")>=0) {
			initButton();
		}		

		var loginLink = dojo.query('a[href="http://www.geocaching.com/my/"]')[0];

		if(loginLink)
			userName = loginLink.innerHTML;
	}


	//========GC Tour===============    // thanks to atornedging
	var cacheListBounding = document.getElementById('cacheListBounding');
	if (cacheListBounding) {
		var autoTourDiv = createElement('div');
		autoTourDiv.align = 'center';
		autoTourDiv.style.padding = '10px';
		autoTourDiv.style.cursor = 'pointer';
		autoTourDiv.addEventListener('click',  function(e){
				var googleMap = unsafeWindow.map;
				var bounds = googleMap.getBounds();
				var center = googleMap.getCenter();
				var topCenter = unsafeWindow.GLatLng.fromUrlValue(bounds.getNorthEast().lat()+","+(bounds.getNorthEast().lng() - (bounds.getNorthEast().lng() - bounds.getSouthWest().lng())/2));
				var radius = Math.floor(topCenter.distanceFrom(center)) / 1000;

				showAutoTourDialog(center,radius);
				},false);
		addHoverEffects(autoTourDiv);

		var autoTourButton = createElement('img');
		autoTourButton.src=mapToAutoTour;


		append(autoTourButton,autoTourDiv);
		append(autoTourDiv,dojo.query('div[id="uxPremiumFeatures"]')[0]);

	}

	//===================================   

	if(document.URL.search("sendtogps\.aspx")>=0) {


		// show the GPX box, if the option is set
		if(GM_getValue('showGpx',false)){
			document.getElementById('dataString').parentNode.style.visibility = 'visible';
			document.getElementById('dataString').style.width = '100%';
		}


		// see, whether this windows is opened by the tour or by something else
		var qsParm = new Array();
		var query = window.location.search.substring(1);
		var parms = query.split('&');
		for (var i=0; i<parms.length; i++) {
			var pos = parms[i].indexOf('=');
			if (pos > 0) {
				var key = parms[i].substring(0,pos);
				var val = parms[i].substring(pos+1);
				qsParm[key] = val;
			}
		}


		if(qsParm['tour']){
			initGPXTour();
		} 	
	}
}
function initButton(){
	
	 // if we are on a cache page the buttonGroup != null - so add the 'to tour'-button

	var buttonGroup = document.getElementById('ctl00_ContentBody_LatLon').parentNode;
	if (buttonGroup != null){
		var add_button = createElement('span',{style:"float:right;"});
		buttonGroup.insertBefore(add_button, buttonGroup.firstChild);		
		var newButton = document.createElement("button");
		newButton.name = 'btnGPXDL';
		newButton.type = 'submit';
		newButton.innerHTML = "<img src='"+addToTourImageString+"'/>&nbsp;"+lang['addToTour'];
		newButton.id = 'btnGPXDL';	
		newButton.setAttribute('onclick','return false;');	
		
		// locate the values and save it
		var cacheIdCode = document.getElementById('ctl00_uxWaypointName');
		var cacheId = trim(cacheIdCode.textContent);
		
		// get the guid
		var guidId = dojo.query("a[id='ctl00_ContentBody_lnkPrintFriendly5Logs']")[0].href.split("guid=")[1].split("&")[0];
		
		var cacheName = trim(document.getElementById('ctl00_ContentBody_CacheName').textContent);

		var cacheTypeImage = getElementsByAttribute('title',"About Cache Types")[0].getElementsByTagName('img')[0].src.split("/")[5];
		
		// on click add an element	
		newButton.addEventListener('click', addElementFunction(cacheId,guidId,cacheName,cacheTypeImage), false);
		
		// add it to the group
		//buttonGroup.appendChild(newButton);
		append(newButton,add_button)

	}	
}

function populateAllTours(list){
	if(list){
		var tourList = list;
	} else {
		var tourList = dojo.byId('openTourList');
	}


	tourList.innerHTML = "";
	for (var tourIt = 0; tourIt<tours.length; tourIt++){
		var listElement = document.createElement('tr');


		var tourLink;
		if(tours[tourIt].id == currentTour.id){	
			tourLink = document.createElement('span');
			tourLink.innerHTML = tours[tourIt].name;
		} else {			
			tourLink = document.createElement('a');

			tourLink.innerHTML = tours[tourIt].name;
			tourLink.style.cursor = 'pointer';
			tourLink.addEventListener('click', loadTour(tours[tourIt].id),false);
		}	

		tourLink.innerHTML += "<span style='font-size:66%'>(&nbsp;"+tours[tourIt].geocaches.length+"&nbsp;)</span>";
		tourLink.style.fontSize ='10px';


		var infomationImage = document.createElement('img');
		infomationImage.src = informationImageString;

		infomationImage.addEventListener('mouseover',  showInformationDiv(tours[tourIt]), false);


		infomationImage.addEventListener('mouseout', 
				function(event) {
				var informationDiv = document.getElementById('infomationDiv');
				document.body.removeChild(informationDiv);
				}, false );

		var deleteButton = document.createElement('img');
		deleteButton.title = lang['removeTour'];
		deleteButton.src = deleteImageString;
		deleteButton.style.cursor = 'pointer';
		deleteButton.style.marginRight = '5px';
		deleteButton.addEventListener('click',deleteTourFunction(tours[tourIt].id,listElement), false);
		addHoverEffects(deleteButton);




		var tdElement = document.createElement('td');listElement.appendChild(tdElement);
		tdElement.appendChild(tourLink);
		tdElement.style.borderBottom = "1px solid lightgray";

		tdElement = document.createElement('td');listElement.appendChild(tdElement);
		tdElement.style.borderBottom = "1px solid lightgray";
		tdElement.appendChild(infomationImage);
		tdElement = document.createElement('td');listElement.appendChild(tdElement);
		tdElement.style.borderBottom = "1px solid lightgray";
		if(tours[tourIt].id != currentTour.id){
			tdElement.appendChild(deleteButton);
		} else {
			tdElement.appendChild(document.createTextNode(" "));
		}


		var uploadButton = document.createElement('img');
		uploadButton.title = lang['upload'];
		uploadButton.src = uploadImageString;
		uploadButton.style.cursor = 'pointer';
		uploadButton.style.marginRight = '5px';
		uploadButton.addEventListener('click',uploadTourFunction(tours[tourIt].id), false);
		addHoverEffects(uploadButton);

		tdElement = document.createElement('td');listElement.appendChild(tdElement);
		tdElement.style.borderBottom = "1px solid lightgray";
		tdElement.appendChild(uploadButton);




		tourList.appendChild(listElement);
	}
}







// the tour list under main navigation
function initComponents(){
	//~ var thisDiv = getElementsByAttribute('class','widget-navigation')[0];
	var thisDiv = getElementsByAttribute('id','Navigation')[0];


	var cacheList = document.createElement('ol');
	cacheList.className = 'cachelist';
	cacheList.id = 'cacheList';
	cacheList.style.width = '100%';
	cacheList.setAttribute("border","0");


	var table = document.createElement('table');
	table.id = 'tourTable';
	table.style.width = '100%';
	table.setAttribute("border","0");


	var div = document.createElement('div');
	div.style.backgroundColor = '#f4f4f4';
	div.style.overflow = 'auto';	
	div.style.height = '100%';
	div.style.width = '100%';    
	div.appendChild(table);
	div.appendChild(cacheList);





	var newButton = document.createElement('img');
	newButton.alt = lang['newList'];
	newButton.title = lang['newList'];
	newButton.src = newImageString;
	newButton.style.cursor = 'pointer';
	newButton.style.marginRight = '5px';
	newButton.addEventListener('click', newTourFunction(), false);
	addHoverEffects(newButton);  
	
	var downloadButton = document.createElement('img');
	downloadButton.alt = lang['onlineTour'];
	downloadButton.title = lang['onlineTour'];
	downloadButton.src = downloadImageString;
	downloadButton.style.cursor = 'pointer';
	downloadButton.style.marginRight = '5px';
	downloadButton.addEventListener('click', 
			function(){
				var webcode = window.prompt(lang['webcodePrompt']);
				if(webcode && webcode != ""){
					downloadTourFunction(webcode);
				} 
			},false);
	addHoverEffects(downloadButton);  


	var toggleSettingsButton = document.createElement('img');
	toggleSettingsButton.alt = lang['showSettings'];
	toggleSettingsButton.title = lang['showSettings'];
	toggleSettingsButton.src = settingsImageString;
	toggleSettingsButton.style.cursor = 'pointer';
	toggleSettingsButton.style.marginRight = '5px';
	toggleSettingsButton.addEventListener('click', toggleSettingsFunction(), false);
	addHoverEffects(toggleSettingsButton);


	var toggleTourListButton = document.createElement('img');
	toggleTourListButton.alt = lang['openTour'];
	toggleTourListButton.title = lang['openTour'];
	toggleTourListButton.src = openTourImageString;
	toggleTourListButton.style.cursor = 'pointer';
	toggleTourListButton.style.marginRight = '5px';
	toggleTourListButton.addEventListener('click', toggleTourListFunction(), false);
	addHoverEffects(toggleTourListButton);

	var autoTourButton = document.createElement('img');
	autoTourButton.alt = lang["autoTour"];
	autoTourButton.title = lang["autoTour"];
	autoTourButton.src = autoTourImage;
	autoTourButton.style.cursor = 'pointer';
	autoTourButton.style.marginRight = '5px';
	autoTourButton.addEventListener('click', showAutoTourDialog, false);
	addHoverEffects(autoTourButton);




	var openTourDiv = document.createElement('div');
	openTourDiv.id = 'tourlistDiv';
	openTourDiv.style.borderTop = "1px solid white";
	openTourDiv.style.display = 'none';
	openTourDiv.style.width = '100%'; 


	var tourList = document.createElement('table');
	tourList.id = 'openTourList';

	var tourListHeader = document.createElement('thead');tourList.appendChild(tourListHeader);
	tourListHeader.innerHTML = lang['loadTour'];
	tourListHeader.style.fontSize ='10px';


	

	populateAllTours(tourList);	

	openTourDiv.appendChild(tourList);



	var settingsDiv = document.createElement('div');
	settingsDiv.id = 'tourSettingsDiv';
	//~ settingsDiv.style.backgroundColor = '#f4f4f4';
	//~ settingsDiv.style.borderBottom = "1px solid white";
	settingsDiv.style.borderTop = "1px solid white";
	settingsDiv.style.display = 'none';
	//settingsDiv.style.overflow = 'auto';
	settingsDiv.style.width = '100%'; 

	var RADIO_BUTTONS = 0;
	var CHECK_BOX = 1;
	var HEADER = 2;
	var LANGUAGE = 3;
	var FONTSIZE = 4;
	var DEFAULTMAPTYPE = 5;
	var GPXSCHEMA = 6;
	var DEFAULTMAPSIZE = 7;

	var settingsArray = new Array(
			new Array(LANGUAGE,''),
			new Array(HEADER, 'printview'),
			new Array(RADIO_BUTTONS,''),
			new Array(FONTSIZE,'settingsFontSize', 'printFontSize',"x-small"),
			new Array(CHECK_BOX,'settingsDecryptHints', 'decryptPrintHints',true),
			new Array(CHECK_BOX,'settingsEditDescription', 'printEditMode',false),
			//~ new Array(CHECK_BOX,'settingsRemoveImages', 'printRemoveImages',true),
			new Array(CHECK_BOX,'settingsShowSpoiler', 'printSpoilerImages',true),			
			new Array(CHECK_BOX,'settingsAdditionalWaypoints', 'printAdditionalWaypoints',true),
			new Array(CHECK_BOX,'settingsLoggedVisits', 'printLoggedVisits',false),
			//~ new Array(CHECK_BOX,'settingsAttributes', 'printAttributes',true),
			new Array(CHECK_BOX,'settingsPageBreak', 'printPageBreak',false),
			new Array(CHECK_BOX,'settingsPageBreakAfterMap', 'printPageBreakAfterMap',true),
			new Array(CHECK_BOX,'settingsFrontPage', 'printFrontpage',true),
			new Array(CHECK_BOX,'settingsOutlineMap', 'printOutlineMap',true),
			new Array(CHECK_BOX,'settingsOutlineMapSinge', 'printOutlineMapSingle',true),
			new Array(DEFAULTMAPTYPE,'settingsMapType', 'printOutlineMapType',"Karte"),
			new Array(DEFAULTMAPSIZE,'settingsMapSize', 'defaultMapSize',"large"),
			new Array(HEADER, 'settingsGPXSchema'),
			new Array(GPXSCHEMA,''),
			new Array(HEADER, 'settingsSendToGPS'),
			new Array(CHECK_BOX,'settingsShowGPX', 'showGpx',false),
			new Array(HEADER, 'settingsDownladGPX'),		
			new Array(CHECK_BOX,'settingsGPXHtml', 'gpxhtml',true),
			new Array(CHECK_BOX,'settingsGPXStripGC', 'gpxstripgc',false),
			
			new Array(HEADER, 'settingsUploadTour'),		
			new Array(CHECK_BOX,'settingsTourMap', 'uploadMap',true)
				);



	var settingsTable = document.createElement('table');
	settingsTable.style.width = '98%';	
PSIZE:
	for(var i = 0; i<settingsArray.length;i++){
		switch (settingsArray[i][0]) { // which type of setting 
			case CHECK_BOX:     
				var trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				var tdElement = document.createElement('td');
				tdElement.style.fontSize = 'xx-small';
				tdElement.style.borderBottom = '1px solid lightgray';
				tdElement.innerHTML = lang[settingsArray[i][1]];
				trElement.appendChild(tdElement);

				//~ trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				tdElement = document.createElement('td');
				var inputElement = document.createElement('input');
				inputElement.type = 'checkbox';
				inputElement.checked = GM_getValue(settingsArray[i][2],settingsArray[i][3]);
				inputElement.addEventListener('click',toggleBoolValue(settingsArray[i][2],settingsArray[i][3]), false);
				tdElement.appendChild(inputElement);
				trElement.appendChild(tdElement);
				break;
			case HEADER:
				var trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				var thElement = document.createElement('th');
				thElement.colSpan = 2;
				thElement.style.fontSize = 'xx-small';
				thElement.style.textDecoration = 'underline';
				thElement.innerHTML = lang[settingsArray[i][1]];
				trElement.appendChild(thElement);
				break;
			case GPXSCHEMA:
				var trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				var gpxTd = document.createElement('td');
				gpxTd.colSpan='2';

				var languageRadioText = document.createElement('font');
				var languageRadio = document.createElement('input');
				languageRadio.type = 'radio';
				languageRadio.name = 'gpx';
				languageRadioText.innerHTML = lang['settingsGPXSchemaGS']+"<br>";
				languageRadioText.style.fontSize = 'xx-small';
				if (GM_getValue('gpxschema',1) == 0)
					languageRadio.checked = 'checked';
				languageRadio.addEventListener('click', function(){GM_setValue('gpxschema',0);}, false);
				gpxTd.appendChild(languageRadio);
				gpxTd.appendChild(languageRadioText);

				languageRadioText = document.createElement('font');
				languageRadio = document.createElement('input');
				languageRadio.type = 'radio';
				languageRadio.name = 'gpx';
				languageRadioText.innerHTML = lang['settingsGPXSchemaAU']+"<br>";
				languageRadioText.style.fontSize = 'xx-small';
				if (GM_getValue('gpxschema',1) == 1)
					languageRadio.checked = 'checked';
				languageRadio.addEventListener('click', function(){GM_setValue('gpxschema',1);}, false);
				gpxTd.appendChild(languageRadio);
				gpxTd.appendChild(languageRadioText);

				trElement.appendChild(gpxTd);
				break;
			case LANGUAGE:

				var trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				var languageHeaderTh = document.createElement('th');
				languageHeaderTh.colSpan = 2;
				languageHeaderTh.style.fontSize = 'xx-small';
				languageHeaderTh.style.textDecoration = 'underline';
				languageHeaderTh.innerHTML = lang['language'];
				trElement.appendChild(languageHeaderTh);


				var trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				var languageTd = document.createElement('td');
				languageTd.colSpan='2';

				for (var langi = 0; langi < languages.length; langi++){				
					var languageRadioText = document.createElement('font');
					var languageRadio = document.createElement('input');
					languageRadio.type = 'radio';
					languageRadio.name = 'language';
					languageRadioText.innerHTML = languages[langi]['name']+"<br>";
					languageRadioText.style.fontSize = 'xx-small';


					if (GM_getValue('language',1) == langi)
						languageRadio.checked = 'checked';

					languageRadio.addEventListener('click', setLanguage(langi), false);
					languageTd.appendChild(languageRadio);
					languageTd.appendChild(languageRadioText);
				}
				trElement.appendChild(languageTd);

				break;

			case DEFAULTMAPSIZE:
				var trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				var tdElement = document.createElement('td');
				tdElement.colSpan='2'; trElement.appendChild(tdElement);
				tdElement.style.fontSize = 'xx-small';
				tdElement.innerHTML = lang[settingsArray[i][1]];

				trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				tdElement = document.createElement('td');
				tdElement.colSpan='2'; trElement.appendChild(tdElement);
				tdElement.style.fontSize = 'xx-small';

				var select = document.createElement("select");
				select.style.width = "80%";

				var sizeArray = new Array('large','medium','small','very small');

				for(var fonti = 0; fonti<sizeArray.length; fonti++){
					var option = document.createElement("option");select.appendChild(option);
					option.value = sizeArray[fonti];
					option.innerHTML = sizeArray[fonti];

					if (GM_getValue("defaultMapSize","large") == sizeArray[fonti])
						option.selected = 'selected';

					option.addEventListener('click', 
							function(){
							var options = select.childNodes;
							for(var optionI = 0; optionI < options.length; optionI++){
								if(options[optionI].selected){
									GM_setValue("defaultMapSize",options[optionI].value);
								}
							}
							},false);
				}
				tdElement.appendChild(select);
			break;

			case DEFAULTMAPTYPE:
				var trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				var tdElement = document.createElement('td');
				tdElement.colSpan='2'; trElement.appendChild(tdElement);
				tdElement.style.fontSize = 'xx-small';
				tdElement.innerHTML = lang[settingsArray[i][1]];

				trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				tdElement = document.createElement('td');
				tdElement.colSpan='2'; trElement.appendChild(tdElement);
				tdElement.style.fontSize = 'xx-small';

				var select = document.createElement("select");
				select.id = "mapTypeSelect";
				select.style.width = "80%";

				var sizeArray = lang['mapTypes'];

				for(var fonti = 0; fonti<sizeArray.length; fonti++){
					var option = document.createElement("option");select.appendChild(option);
					option.value = sizeArray[fonti].value;
					option.innerHTML = sizeArray[fonti].caption;

					if (GM_getValue("printOutlineMapType","Karte") == sizeArray[fonti].value)
						option.selected = 'selected';



					option.addEventListener('click', 
							function(){
							//var options = select.childNodes;
							var options = dojo.byId('mapTypeSelect').childNodes;
							for(var optionI = 0; optionI < options.length; optionI++){
							if(options[optionI].selected){
							GM_setValue("printOutlineMapType",options[optionI].value);
							}
							}
							},false);
					//~ setPrintFontSize(sizeArray[fonti]), false);	


				}
				tdElement.appendChild(select);

				break;	

			case FONTSIZE:
				var trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				var tdElement = document.createElement('td');
				tdElement.colSpan='2'; trElement.appendChild(tdElement);
				tdElement.style.fontSize = 'xx-small';
				tdElement.innerHTML = lang[settingsArray[i][1]];

				trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				tdElement = document.createElement('td');
				tdElement.colSpan='2'; trElement.appendChild(tdElement);
				tdElement.style.fontSize = 'xx-small';

				var select = document.createElement("select");
				select.style.width = "80%";

				var sizeArray = new Array("xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large");

				for(var fonti = 0; fonti<sizeArray.length; fonti++){
					var option = document.createElement("option");select.appendChild(option);
					option.value = sizeArray[fonti];
					option.innerHTML = sizeArray[fonti];

					if (GM_getValue(settingsArray[i][2],settingsArray[i][3]) == sizeArray[fonti])
						option.selected = 'selected';

					option.addEventListener('click', setPrintFontSize(sizeArray[fonti]), false);	

				}
				tdElement.appendChild(select);

				break;	

			case RADIO_BUTTONS:
				var trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				var exportCaptionTd = document.createElement('td');trElement.appendChild(exportCaptionTd);
				exportCaptionTd.style.fontSize = 'xx-small';
				exportCaptionTd.innerHTML = lang['settingsLogCount'];


				var trElement = document.createElement('tr');settingsTable.appendChild(trElement);
				var exportTd = document.createElement('td');trElement.appendChild(exportTd);
				exportTd.colSpan='2';
				exportTd.style.fontSize = 'xx-small';

				var exportRadioNone = document.createElement('input');
				var exportRadioNoneText = document.createElement('font');
				var exportRadioAll = document.createElement('input');
				var exportRadioAllText = document.createElement('font');
				var exportRadioCount = document.createElement('input');	
				var exportRadioCountText = document.createElement('font');

				var exportText = document.createElement('input');
				exportText.type = 'text';
				exportText.size = 1;
				exportText.style.verticalAlign = 'center';
				exportText.addEventListener('click', function(){exportRadioCount.checked = 'checked';GM_setValue('maxPrintLogs',exportText.value);},false);
				exportText.addEventListener('keyup', 
						function(){
						var check = true;
						var value = exportText.value; //get characters
						for(var i=0;i < value.length; ++i)
						{
						var new_key = value.charAt(i); //cycle through characters
						if(((new_key < "0") || (new_key > "9")) && !(new_key == ""))
						{
						//if(i!= 0 && new_key == "-"){
						check = false;
						break;
						//}
						}
						}
						if(!check)
						{
						exportText.style.backgroundColor = '#ff7f7f';
						}
						else
						{
							exportText.style.backgroundColor = '#ffffff';
							GM_setValue('maxPrintLogs',exportText.value);
						}
						}
				,false);



				exportRadioNone.type = 'radio';
				exportRadioNone.name = 'logcount';
				exportRadioNoneText.innerHTML = lang['settingsLogCountNone'];
				exportRadioAll.type = 'radio';
				exportRadioAll.name = 'logcount';
				exportRadioAllText.innerHTML = lang['settingsLogCountAll'];
				exportRadioCount.type = 'radio';
				exportRadioCount.name = 'logcount';
				exportRadioCountText.innerHTML = lang['settingsLogCountShow'];	
				exportRadioNone.addEventListener('click', function(){GM_setValue('maxPrintLogs',0);},false);
				exportRadioAll.addEventListener('click', function(){GM_setValue('maxPrintLogs',-1);},false);

				if(GM_getValue('maxPrintLogs',0) == 0){
					exportRadioNone.checked = 'checked';
				}else if ( GM_getValue('maxPrintLogs',0) <= -1){
					exportRadioAll.checked = 'checked';
				}else{
					exportText.value = GM_getValue('maxPrintLogs',0);
					exportRadioCount.checked = 'checked';

				}

				exportTd.appendChild(exportRadioNone);
				exportTd.appendChild(exportRadioNoneText);
				exportTd.appendChild(exportRadioAll);
				exportTd.appendChild(exportRadioAllText);
				exportTd.appendChild(exportRadioCount);
				exportTd.appendChild(exportText);
				exportTd.appendChild(exportRadioCountText);
				break;
		}
	}

	settingsDiv.appendChild(settingsTable);


	var tourHeaderDiv = document.createElement('div');
	tourHeaderDiv.innerHTML = '<u id="tourName">'+currentTour.name +'</u>&nbsp;<span style="font-size:66%" id="cachecount">('+currentTour.geocaches.length+')';
			append(createElement('br'),tourHeaderDiv)

			var renameButton = document.createElement('img');
			renameButton.src = editImageString;
			renameButton.title = lang['rename'];
			renameButton.alt = lang['rename'];
			renameButton.style.cursor = 'pointer';
			renameButton.style.marginRight = '5px';
			renameButton.addEventListener('click', 
				function(){
				var newTourName = prompt(lang['newTourDialog'], currentTour.name);  
				if(!newTourName) return;
				currentTour.name = newTourName;
				saveCurrentTour();
				updateTour();
				//~ window.location.reload();    				
				},false);
			addOpacityEffects(renameButton);


			var markerButton = document.createElement('img');
			markerButton.src = plusImageString;
			markerButton.alt = lang['addOwnWaypoint'];
			markerButton.title = lang['addOwnWaypoint'];	
			markerButton.style.cursor = 'pointer';
			markerButton.style.marginRight = '3px';
			markerButton.addEventListener('click', function(){showNewMarkerDialog();}, false);
			addOpacityEffects(markerButton);

			var sendGPSButton = document.createElement('img');
			sendGPSButton.alt = lang['sendToGps'];
			sendGPSButton.title = lang['sendToGps'];
			sendGPSButton.src = sensGPSImageString;
			sendGPSButton.style.cursor = 'pointer';
			sendGPSButton.style.marginRight = '5px';
			sendGPSButton.addEventListener('click', openSend2GpsFunctionLocal(), false);
			addOpacityEffects(sendGPSButton);

			var uploadTourButton = document.createElement('img');
			uploadTourButton.alt = lang['upload'];
			uploadTourButton.title = lang['upload'];
			uploadTourButton.src = uploadImageString;
			uploadTourButton.style.cursor = 'pointer';
			uploadTourButton.style.marginRight = '5px';
			uploadTourButton.addEventListener('click', function(){uploadTourFunction(currentTour.id)();}, false);
			addOpacityEffects(uploadTourButton);

			var requestPrintButton = document.createElement('img');
			requestPrintButton.alt = lang['printview'];
			requestPrintButton.title = lang['printview'];
			requestPrintButton.src = printerImageString;
			requestPrintButton.style.cursor = 'pointer';
			requestPrintButton.style.marginRight = '5px';
			requestPrintButton.addEventListener('click', printPageFunction(), false);
			addOpacityEffects(requestPrintButton);

			var downloadGPXButton= document.createElement('img');
			downloadGPXButton.alt = lang['downloadGpx'];
			downloadGPXButton.title = lang['downloadGpx'];
			downloadGPXButton.src = downloadGPXImageString;
			downloadGPXButton.style.cursor = 'pointer';
			downloadGPXButton.style.marginRight = '5px';
			downloadGPXButton.addEventListener('click',downloadGPXFunction(), false);
			addOpacityEffects(downloadGPXButton);	



			append(renameButton,tourHeaderDiv);
			append(requestPrintButton,tourHeaderDiv);
			append(sendGPSButton,tourHeaderDiv);
			append(downloadGPXButton,tourHeaderDiv);
			append(uploadTourButton,tourHeaderDiv);
			append(markerButton,tourHeaderDiv);
			//~ 
			//~ buttonsDiv.appendChild(requestPrintButton);
			//~ buttonsDiv.appendChild(sendGPSButton);
			//~ buttonsDiv.appendChild(downloadGPXButton);
			//~ buttonsDiv.appendChild(uploadTourButton);
			//~ 
			//~ tourHeaderDiv.appendChild(renameButton);
			//~ tourHeaderDiv.appendChild(markerButton);



			// remove the ads under the menu - to be sure the gctour is visible ;-)
			var adDiv = getElementsByAttribute('class','BanManWidget')[0];
			if(adDiv)
				dojo.destroy(adDiv);


			var buttonsDiv = document.createElement('div');
			//~ buttonsDiv.style.width = "135px";
			buttonsDiv.style.marginBottom = "5px";
			buttonsDiv.style.borderBottom = "1px solid white";

			buttonsDiv.appendChild(newButton);
			buttonsDiv.appendChild(toggleTourListButton);
			buttonsDiv.appendChild(downloadButton);
			buttonsDiv.appendChild(autoTourButton);
			buttonsDiv.appendChild(toggleSettingsButton);
			buttonsDiv.appendChild(openTourDiv);
			buttonsDiv.appendChild(settingsDiv);

			//~ thisDiv.parentNode.insertBefore(buttonsDiv, thisDiv.nextSibling); 	



			var header = document.createElement('div');
			header.style.backgroundImage = "url("+gctourLogoImage+")";
			header.style.backgroundPosition = "center left";
			header.style.backgroundRepeat = "no-repeat";
			header.style.cursor = "pointer";
			header.style.height = "30px";
			
			dojo.query(header).onmouseover(function(e){this.style.backgroundColor = "#cdd8e8"}).onmouseout(function(e){this.style.backgroundColor = "transparent"}).onclick(function(e){window.open('http://gctour.madd.in');});
			

			var imageLogo = document.createElement('img');
			imageLogo.src = gctourLogoImage;
			imageLogo.border = "0";
			//~ imageLogo.style.width = " 135px";
			imageLogo.style.marginBottom = " 5px";

			var tourLink = document.createElement('a');
			tourLink.href = "http://gctour.madd.in";
			//~ tourLink.innerHTML = "Gc Tour";
			tourLink.style.fontWeight = 'bold';
			tourLink.style.verticalAlign = "top";
			//~ tourLink.style.borderBottom = '1px solid black';
			//~ tourLink
			tourLink.style.color = '#003399';
			//~ tourLink.appendChild(imageLogo);
			
			//~ addHoverEffects(header);
			//~ header.appendChild(tourLink);

			//~ thisDiv.parentNode.insertBefore(header, thisDiv.nextSibling);


			var list_node = createElement('li');
			append(header, list_node);
			append(buttonsDiv, list_node);			
			append(tourHeaderDiv, list_node);
			append(div, list_node);
	
	
	
			append(list_node, thisDiv);




			// popultate the current list on load
			for (var i = 0; i < currentTour.geocaches.length; i++){
				addNewTableCell(currentTour.geocaches[i],false);
			}


			if(currentTour.geocaches.length == 0){
				var table = document.getElementById('tourTable');		
				table.innerHTML = lang['emptyList'];
			}




}
function addCacheToTourFromMap(cacheUrl){
	return function(e)
	{
		e.stopPropagation();
		var req = new XMLHttpRequest();

		var myUrl = cacheUrl;
		//var myUrl = 'http://www.geocaching.com/seek/cdpf.aspx?guid='+currentTour.geocaches[i].guid;
		req.open("GET", myUrl, false);
		req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		// execute the request synchron
		req.send(null);
		// after execution parse the result
		var responseDetails = req;

		var cacheDetails = document.createElement('div');
		cacheDetails.innerHTML = responseDetails.responseText;

		// locate the values and save it
		var cacheIdCode = dojo.query('span[id="ctl00_uxWaypointName"]',cacheDetails)[0];
		var cacheId = trim(cacheIdCode.textContent);
		var guidId = dojo.query("a[id='ctl00_ContentBody_lnkPrintFriendly5Logs']",cacheDetails)[0].href.split("guid=")[1].split("&")[0];
	
		var cacheName = trim(dojo.query('span[id ="ctl00_ContentBody_CacheName"]',cacheDetails)[0].textContent);
		var cacheTypeImage = dojo.query('a[title="About Cache Types"]',cacheDetails)[0].getElementsByTagName('img')[0].src.split("/")[5];
		


		addElementFunction(cacheId,guidId,cacheName,cacheTypeImage)();

	}
}

function getEntryFromSearchTd(theTd){
		var entryTds = theTd.getElementsByTagName('td');
		var entry = new Object();
		entry.id = 'GC'+entryTds[5].textContent.split('(GC')[1].split(')')[0];		
		entry.name = entryTds[5].getElementsByTagName('a')[0].textContent;
		entry.guid = entryTds[5].getElementsByTagName('a')[0].href.split('guid=')[1];
		entry.image = entryTds[2].getElementsByTagName('img')[0].getAttribute('src').split("/")[3];
		if(entryTds[7].childNodes[1]){
			entry.checked = entryTds[7].childNodes[1].checked;
		}
		return entry;
}
function update(){
	var updateDate = eval(GM_getValue('updateDate'));
	if(!updateDate){
		updateDate = new Date();
		GM_setValue('updateDate',uneval(updateDate));
	}
	var currentDate = new Date();

	// if the last updateDate is more than 86 400 000 msec (1 day) ago - check for updates
	if(currentDate.getTime() - updateDate.getTime() > 86400000){
		// set the new updateDate
		GM_setValue('updateDate',uneval(currentDate));
		// make the version request
		var details = new Object();
		details.method = 'GET';
		details.url = 'http://gc.madd.in/gm/updates.xml';
		details.onload = function(response) {parseUpdateXMLResponse(response.responseText)};
		details.onerror = function(response) { alert('An error occour - please send an EMail to geocaching@madd.in!');};
		GM_xmlhttpRequest(details);
	}
}

function parseUpdateXMLResponse(xmlString){
	var updateNode;
	var xmlDoc = (new DOMParser()).parseFromString(xmlString, "application/xml");
	var string = '';

	var scriptElements = xmlDoc.getElementsByTagName('script');

	for(var i = 0;i< scriptElements.length;i++){
		if ( scriptElements[i].getAttribute ('id') == scriptId){
			var versions = scriptElements[i].getElementsByTagName('version');
			var currentVersion = 0; 
			var currentVersionIndex; 
			for(var j = 0;j< versions.length;j++){
				if(versions[j].getAttribute('number') > currentVersion){
					currentVersion = versions[j].getAttribute('number');
					currentVersionIndex = j;
				}
			}

			if (currentVersion > version){
				updateNode = versions[currentVersionIndex];
			}			
		}		
	}




	if(updateNode){
		var confirmString = 'There is a new version of GcTour.\n\t'+version+' -> '+updateNode.getAttribute('number')+'\nChanges:\n';

		var changes = updateNode.getElementsByTagName('change');
		for(var j = 0;j< changes.length;j++){
			confirmString += '\t+ '+changes[j].textContent+'\n';
		}
		confirmString += '\nDo you want to update?';
		if (confirm(confirmString)) {
			GM_openInTab('http://gc.madd.in/gm/update.php?scriptId='+scriptId+'&fromVersion='+version+'&toVersion='+updateNode.getAttribute('number'));
		}
	}
}
function getTourById(id){
	currentTourId = GM_getValue('currentTour',-1);
	tours = eval(GM_getValue('tours',new Array()));
	for (var i = 0; i<tours.length;i++){
		if(tours[i].id == currentTourId){
			return tours[i];
		}
	}	
	return;
}

function getNewTourId(){
	var tourId = 0;
	for (var i = 0; i<tours.length;i++){
		if(tours[i].id >= tourId){
			tourId = tours[i].id + 1;
		}
	}
	
	return tourId;	
}	

function isIdInTable(gcId){
	 
	for (var i = 0; i < currentTour.geocaches.length; i++) 
	{
		if(currentTour.geocaches[i].id == gcId){
			return true;
		} 
	}
	
	return false;
}

function addNewTableCell(theEntry,effects){
	
	var costumMarker = (typeof(theEntry.lat) != "undefined");

	var entryLi = createElement('li', {id: theEntry.id, style: "opacity:0;width:88%;list-style-image='url('"+theEntry.image+"')"});	
	//set the image
    entryLi.style.listStyleImage="url('"+theEntry.image+"')";
	
	// make the gcid link
	var nameCite = createElement('span',{style:"vertical-align:top"});
	if(!costumMarker){	          
		var linkElement = document.createElement('a');
		linkElement.style.fontSize = '9px';
		linkElement.style.fontFamily = 'arial,sans-serif';
		linkElement.href = 'http://www.geocaching.com/seek/cache_details.aspx?guid='+theEntry.guid;
		linkElement.textContent = theEntry.id;
		nameCite.appendChild(linkElement);
	} else {
		nameCite.textContent = theEntry.name;
	}
	entryLi.appendChild(nameCite);
	
	// the log/edit button and the delete button
	var functionButtonsDiv = document.createElement('div');
	functionButtonsDiv.style.cssFloat = 'right';
	functionButtonsDiv.style.cssFloat = 'right';
	
	if(!costumMarker){
		var logVisitImage = document.createElement('img');
		logVisitImage.alt = lang['logYourVisit'];
		logVisitImage.title = lang['logYourVisit'];
		logVisitImage.style.cursor = 'pointer';    
		logVisitImage.src = "http://www.geocaching.com/images/stockholm/16x16/add_comment.gif";
		logVisitImage.addEventListener('click', function(){window.location.href = 'http://www.geocaching.com/seek/log.aspx?wp='+theEntry.id;}, true);	
		addOpacityEffects(logVisitImage); 
		functionButtonsDiv.appendChild(logVisitImage);
	} else {
		var editMarkerButton = document.createElement('img');
		editMarkerButton.alt = lang['edit'];
		editMarkerButton.title = lang['edit'];
		editMarkerButton.style.cursor = 'pointer';    
		editMarkerButton.src = editImageString;
		editMarkerButton.addEventListener('click',  function(){showNewMarkerDialog(theEntry);}, false);	
		addOpacityEffects(editMarkerButton); 
		functionButtonsDiv.appendChild(editMarkerButton);
	}
	
	var deleteImage = document.createElement('img');
    deleteImage.alt = lang['removeFromList'];
    deleteImage.title = lang['removeFromList'];
    deleteImage.style.cursor = 'pointer'; 
    deleteImage.src = deleteImageString;
	deleteImage.addEventListener('click', deleteElementFunction(theEntry.id), true);	
	addOpacityEffects(deleteImage); 
	functionButtonsDiv.appendChild(deleteImage);	


	// thanks to adam r
	var upDownDiv = document.createElement('div');
	upDownDiv.align = "right";
	
	var topButton = document.createElement('img');
    topButton.alt = "top";
    topButton.title = "top";
    topButton.style.cursor = 'pointer';
    topButton.src = topArrowImageString;
    topButton.addEventListener('click', moveTop(theEntry.id), true);
    addOpacityEffects(topButton);
	
	var upButton = document.createElement('img');
    upButton.alt = "up";
    upButton.title = "up";
    upButton.style.marginRight = '5px';
    upButton.style.cursor = 'pointer';
    upButton.src = upArrowImageString;
    upButton.addEventListener('click', moveUp(theEntry.id), true);
    addOpacityEffects(upButton);
    
	
	var downButton = document.createElement('img');
    downButton.alt = "down";
    downButton.title = "down";
    downButton.style.cursor = 'pointer';    
	downButton.style.marginRight = '5px';
    downButton.src = downArrowImageString;    
    downButton.addEventListener('click', moveDown(theEntry.id), true);
    addOpacityEffects(downButton);
	
	var bottomButton = document.createElement('img');
    bottomButton.alt = "bottom";
    bottomButton.title = "bottom";
    bottomButton.style.cursor = 'pointer';
    bottomButton.src = bottomArrowImageString;
    bottomButton.addEventListener('click', moveBottom(theEntry.id), true);
    addOpacityEffects(bottomButton);
		
	functionButtonsDiv.appendChild(document.createElement('br'));
	upDownDiv.appendChild(upButton);
	upDownDiv.appendChild(topButton);
	upDownDiv.appendChild(document.createElement('br'));
	upDownDiv.appendChild(downButton);
	upDownDiv.appendChild(bottomButton);
	functionButtonsDiv.appendChild(upDownDiv);
	entryLi.appendChild(functionButtonsDiv);
	
	
	var nameDiv = document.createElement('div');
	nameDiv.style.clear = 'left';
	if(!costumMarker){
		nameDiv.innerHTML = theEntry.name;
	}else {
		nameDiv.innerHTML = theEntry.content;
	}
	entryLi.appendChild(nameDiv);
	
	
	document.getElementById('cacheList').appendChild(entryLi);
	
	if(effects){
		dojo.fadeIn({node: entryLi,duration: 1000}).play()
	} else {
		entryLi.style.opacity = "1";
	
	}
	
}


function getPositionsOfId(theId){
	for (var i = 0; i < currentTour.geocaches.length; i++){
		if(currentTour.geocaches[i].id == theId){
			return i;
		}
	}
	return -1;
}


// function to move an cache to an given position in the list
function move(id,positionDelta){
	
	
	// locate the selected cache in the list
	var position = getPositionsOfId(id);
	
	
	// return if we are at the end or at top of the list!
	if((position == 0  && positionDelta < 0) || (position == currentTour.geocaches.length-1 && positionDelta > 0) ){
		return;
	}
	
	// save clicked cache
	var geoCache = currentTour.geocaches[position];
	
	// remove it from the current geocaches
	currentTour.geocaches.splice(position,1);
	
	var tempCaches = new Array();
	
	// first push all caches in front of the selected in the new array
	for(var i = 0; i < position+positionDelta; i++){
		tempCaches.push(currentTour.geocaches[i]);
	}
	
	// then the selected
	tempCaches.push(geoCache);
	
	// and now the rest
	for(var i = position+positionDelta; i < currentTour.geocaches.length; i++){
		tempCaches.push(currentTour.geocaches[i]);
	}
	
	// ... and make it persistent
	currentTour.geocaches = tempCaches;	
	saveCurrentTour();
	
	
	// redraw the list:
	var cacheList = document.getElementById('cacheList');
	
	// just clear the list
	while(cacheList.firstChild) cacheList.removeChild(cacheList.firstChild);
	for (var i = 0; i < currentTour.geocaches.length; i++){
		addNewTableCell(currentTour.geocaches[i],false);
	}
}

function moveUp(id){
	return function(){
		move(id,-1);
	}
}
function moveDown(id){
	return function(){
		move(id,1);
	}
}

function moveTop(id){
	return function(){
		var position = getPositionsOfId(id);
		move(id,-position);
	}
}

function moveBottom(id){
	return function(){
		var position = getPositionsOfId(id);
		move(id,currentTour.geocaches.length-position-1);
	}
}

function addCustomMarker(name, lat, lon, content, typeImage, typeSymbol){
	
	if(currentTour.geocaches.length == 0){
		var table = document.getElementById('tourTable');		
		table.innerHTML ='';
	}
	
	// customMarker:								e.g.:
	//		name	->	the cachename		parking area
	//		image	->	the typeimage		http://gctour.madd.in/map/icons/flag.png
	//		lat		->	latitude		51.12342
	//		lon		->	longitude		-12.33456
	//		content	->	the content		"Test\nLINEBREAK"
	//		symbol	->	GPX symbol name "Red Flag"
	
	var entry = new Object();
	entry.id = name+lat+lon;	
	entry.name = name;		
	entry.latitude = lat;
	entry.longitude = lon;
	entry.lat = lat;
	entry.lon = lon;
	entry.image = typeImage;
	entry.content = content;
	entry.symbol = typeSymbol;
	
	log("New custommarker: " + entry.name +" lat:"+entry.lat+" lon:"+entry.lon+" Type:"+entry.symbol +" content:"+entry.content);
	
	// add the newbie
	addNewTableCell(entry,true);
	
	
	// and make it persistence
	saveNewCache(entry);
	
	// update the cache count	
	updateCacheCount(currentTour.geocaches.length);;
	
	return entry;
}

function addElementFunction(theId, theGuId, theName, theTypeImage){
   return function () {
   		
			if(currentTour.geocaches.length == 0){
				var table = document.getElementById('tourTable');		
				table.innerHTML ='';
			}
   			if(!isIdInTable(theId)){
   				// entry:								e.g.:
   				//		id		->	the gc.com id		GC00815
   				//		guid	->	the guid			6e974919-2b47-46e2-8661-3fc62a5a9650
   				//		name	->	the cachename		Echo the tomcat
   				//		image	->	the typeimage		http://www.geocaching.com/images/WptTypes/sm/2.gif
				var entry = new Object();
				entry.id = theId;		
				//~ entry.name = theName.textContent;
				entry.name = theName;
				entry.guid = theGuId;
				
				// split the src an take only x.gif
				//~ var typeGif = theTypeImage.getAttribute('src').split("/")[3];
				var typeGif = theTypeImage;
				entry.image = 'http://www.geocaching.com/images/WptTypes/sm/'+typeGif;

				// add the newbie
				addNewTableCell(entry,true);
				
				// and make it persistence
				saveNewCache(entry);
				
				// update the cache count	
				updateCacheCount(currentTour.geocaches.length);
	
				
			}
	}
}

function saveNewCache(entry){
	
	currentTour = getTourById(currentTourId);
	
	currentTour.geocaches.push(entry);
	saveCurrentTour();
	
	log("saving "+ entry.id +" to "+currentTour.name);
}


function newTourFunction(){
	return function(){
		var newTour = new Object();
		newTour.id = getNewTourId();
		newTour.name = prompt(lang['newTourDialog'], "Tour "+newTour.id);
		newTour.geocaches = new Array();
		if(!newTour.name) return;
		
		
		
		tours.push(newTour);
		log("Creating new tour: "+newTour.id +" ; "+ newTour.name);
		
		saveTour(newTour);	
		
		//~ window.location.reload();		
		updateTour();
	}
}

function saveCurrentTour(){
	saveTour(currentTour);
}
	
function saveTour(tour){	
	var i;
	for (i= 0; i < tours.length; ++i){
		if(tours[i].id == tour.id){
			tours[i] = tour;
		}
	}
		
	GM_setValue('currentTour', tour.id);
	GM_setValue('tours', uneval(tours));
	log("updating "+tour.name);
}

function updateCacheCount(count){
	dojo.query("span[id='cachecount']")[0].innerHTML = '('+count+')';
	
	dojo.animateProperty(
    {
      node: "cachecount",duration: 1000,
      properties: {
        //~ color:         { start: "black", end: "white" },
        backgroundColor:   { start: "#FFE000", end: "#EEEEEE" }
      }
    }).play();
}

function deleteElementFunction(theId){
   return function () {
   	
   	
   				
   				var theElement = document.getElementById(theId);				
				//~ var trWithElement = theElement.parentNode.parentNode;
				
				// cool sliding effect:
				var elementRemoval = dojo.fadeOut({node: theElement,duration: 500});
				dojo.connect(elementRemoval,"onEnd",function(){ theElement.parentNode.removeChild(theElement); });
				elementRemoval.play();
				
				// locate the element to delete
				for (var i = 0; i < currentTour.geocaches.length; i++){
					if(currentTour.geocaches[i].id == theId){
						// array in js are dumb - where is removeAt ??
						currentTour.geocaches.splice(i,1);
						log("removing '"+theId +"' from '"+ currentTour.name+"'");
						break;
					}
				}
				
				saveCurrentTour();
				
				// update the cache count	
				updateCacheCount(currentTour.geocaches.length);
	
				
				if(currentTour.geocaches.length == 0){
					var table = document.getElementById('tourTable');		
					table.innerHTML = lang['emptyList'];
				}
            }
}



function removeElementsFunction(descriptionElement, id, tagName){
	return function () {
		var elements = descriptionElement.getElementsByTagName(tagName);
		for (var x = 0; x<elements.length; x++) {
			if(elements[x].id == id){
				elements[x].style.display = "none";
			}			
		}
	}
}

function loadTour(id){
	return function(){
		GM_setValue('currentTour',id);

		if(document.URL.search("webcode")>=0){
			window.location = "http://www.geocaching.com";
		} else {
			updateTour();
		}

	}
}

function deleteTourFunction(id,listElement){
	return function(){
		if (confirm(lang['removeTourDialog'])) {  
			for (var i = 0; i < tours.length; i++){
				if(tours[i].id == id){
					log("removing '"+tours[i].name +"'");
					// array in js are dumb - where is removeAt ??
					tours.splice(i,1);
					saveCurrentTour();

					listElement.parentNode.removeChild(listElement);

					break;
				}
			}
			//~ window.location.reload();
		}
	}
}
function printPageFunction(){
	return function(){
		if(!userName){
			alert(lang['notLogedIn']);
		} else if( currentTour.geocaches.length == 0) {
			alert(lang['emptyList']);
		} else {		
			
			
			var cacheDetailTemplate = 
				'<div class="cacheDetail" id="###GUID###">'+
				'	<div class="geocache_count"><span>###CACHECOUNT###</span></div>'+
				'	<div class="geocache_id">###GCID###</div>'+
				'	<div>'+
				'		<img src="http://www.geocaching.com/images/WptTypes/sm/###TYPE###.gif">'+
				'		<span style="font-weight: bold;">###CACHENAME###</span>'+
				'		<span style="margin-right: 3px;"> (###OWNER### - ###HIDDEN###)</span>'+
				'	</div>'+
				'	<div class="details">'+
				'		<span>###COORDINATES###</span>'+
				'		<span><img src="http://www.geocaching.com/images/icons/compass/###BEARING###.gif"/>###DISTANCE###&nbsp;</span>'+
				'		<span>D:<img src="http://www.geocaching.com/images/stars/stars###DIFFICULTY###.gif"/></span>'+
				'		<span>T:<img src="http://www.geocaching.com/images/stars/stars###TERRAIN###.gif"/></span>'+
				'		<span>S:<img src="http://www.geocaching.com/images/icons/container/###SIZE###.gif"/></span>'+
				'	</div>'+
				'	<div>'+
				'		<span>###ATTRIBUTES###</span>'+
				'		<span><img alt="Inventory" src="http://www.geocaching.com/images/WptTypes/sm/tb_coin.gif"/>Inventory:</span>'+
				'		<span>###INVENTORY###</span>'+
				'	</div>'+
				'	<div class="content">'+
				'		<div class="short">###SHORT_DESCRIPTION###</div>'+
				'		<div class="long">###LONG_DESCRIPTION###</div>'+
				'		<div><b>Hint:</b>###HINT###</div>'+
				'		<div class="waypoints">###ADDITIONAL_WAYPOINTS###</div>'+
				'		<div class="images"}">###IMAGES###</div>'+
				'		<div id = "###MAPID###" class="map">###MAP###</div>'+
				'		<div class="removable">###LOGCOUNTER###</div>'+
				'		<div class="logs">###LOGS###</div>'+
				'		<div style="clear:both">&nbsp;</span>'+
				'	</div>'+
				'</div>';
			var ownMarkerTemplate = 
				'<div class="cacheDetail">'+
				'	<div class="geocache_count" style="padding:5px !important"><span>###CACHECOUNT###</span></div>'+
				'	<div class="wpt_id">###GCID###</div>'+
				'	<div>'+
				'		<img src="###TYPE###">'+
				'		<span style="font-weight: bold;">###NAME###</span><br/>'+
				'		<span>###COORDINATES###</span>'+
				'	</div>'+
				'	<div>'+
				'		<div class="long">###CONTENT###</div>'+
				'	</div>'+
				'</div>';
			
				
			var costumMarker = (typeof(currentTour.geocaches[0].lat) != "undefined");
			if(!costumMarker){		
				var newwindow2=window.open('http://www.geocaching.com/seek/cdpf.aspx?guid='+currentTour.geocaches[0].guid,'printview','fullscreen,scrollbars=yes,toolbar=yes,menubar=yes');
			} else {
				var newwindow2=window.open('http://www.geocaching.com/seek/cdpf.aspx?guid=39eedff9-69ea-4a18-97b0-bde6bfbccfb7','printview','fullscreen,scrollbars=yes,toolbar=yes,menubar=yes');
			}
			
	
			// trick to wait until the page from gc-com is loaded, to prevent tour detection
			newwindow2.window.addEventListener ("DOMContentLoaded", function() {
				try {
					var body = newwindow2.document.getElementsByTagName('body')[0];	
					
					
					// set the title of the print view
					var now = new Date();
					var Jahresmonat = now.getMonth();
					var Monat = lang['months']
					var Std = now.getHours();
					var Min = now.getMinutes();
					var StdAusgabe = ((Std < 10) ? "0" + Std : Std);
					var MinAusgabe = ((Min < 10) ? "0" + Min : Min);
					newwindow2.document.title = currentTour.name +' - '+ now.getDate()+'.'+(Jahresmonat+1)+'.'+now.getFullYear()+' '+StdAusgabe+':'+MinAusgabe +" - "+lang['prinviewTitle'];
					
					
					body.innerHTML = '';
					addOverlay(newwindow2.document,lang['pleaseWait']);
					//~ newwindow2.document.getElementsByClassName('dark_msg_overlay')[0].getElementsByTagName('div')[0].innerHTML = "0 / "+currentTour.geocaches.length;
					
					
					var head = newwindow2.document.getElementsByTagName('head')[0];    
					var style = document.createElement('style');
					style.type = 'text/css';
					//~ style.innerHTML = 'font {font-size:x-small !important}  td {font-size:x-small !important} span {font-size:x-small !important}'+
									  //~ 'div {font-size:x-small !important} p {font-size:x-small !important}';
					//~ style.innerHTML = 'font,td,th,span,div, p {font-size:'+GM_getValue("printFontSize","x-small")+'!important} ';
					style.innerHTML = '*{ font-size:'+GM_getValue("printFontSize","x-small")+' } .cacheDetail{ border: 1px solid lightgray; width: 100%; text-align: left;} .cacheDetail div{ padding-left:5px; } .wpt_id{ position:relative; padding:5px !important; float:right;  font-size:medium; font-weight:bold; } .geocache_id{ position:relative; padding:20px !important; float:right;  font-size:medium; font-weight:bold; }  .content{ clear:both; border-top:2px dashed lightgray; margin-top:10px; padding-top:10px; }  img{ vertical-align:middle; }  #details span{ margin-left: 10px } .images{clear:both;height:auto}';
					style.innerHTML += '.removable{margin:2px;} .map{clear:both} .logs{clear:both} .logs div{margin:2px}';
					style.innerHTML += '.geocache_count{ position:relative; padding:20px !important; float:right;  font-size:medium; font-weight:bold; } .geocache_count span{padding: 5px; font-weight: bold; font-size: 18px; -moz-border-radius: 5px;border:2px dotted black;}';
					
					
					
					head.appendChild(style); 

					style = document.createElement('style');
					style.media = 'print';
					style.type = 'text/css';
					//hide the map control in print
					style.innerHTML = '.noprint   { display: none; } body {margin: 0;padding: 0;color: black;background: transparent;}';

					head.appendChild(style); 

					var printInfo = document.createElement('div');
					printInfo.className = 'noprint';
					//~ cacheMapControl.style.width = "20cm"; 
					printInfo.style.border = '1px solid #EBEFC2';
					printInfo.style.backgroundColor = '#FBFFCF';
					printInfo.style.textAlign = 'left';
					printInfo.innerHTML = lang["dontPrintHint"];
					
					body.appendChild(printInfo);

					// front page				
					if(GM_getValue('printFrontpage',true)){
						var title = document.createElement('div');
						title.id = 'printTitle';
						title.style.width = "100%"; 
						title.style.textAlign = 'left';
						//~ title.style.marginLeft = 'auto';
						//~ title.style.marginRight = 'auto';
						title.innerHTML = "<h1>"+currentTour.name+"</h1>";					
						if (GM_getValue('printPageBreakAfterMap', true)) {
							title.style.pageBreakAfter = 'always';
						} else {
							title.style.pageBreakAfter = 'never';
						}
						body.appendChild(title);
						
						var coverTable = document.createElement('table');					
						coverTable.style.width = "100%"; 
						coverTable.style.textAlign = 'left';
						//~ coverTable.style.marginLeft = 'auto';
						//~ coverTable.style.marginRight = 'auto';
						coverTable.style.border = '1px solid lightgray';
						
						coverTable.innerHTML = 
							'<tr>		 			'+
							'	<td colspan="3" style="border-bottom-color:lightgray;border-bottom-style:dashed;border-bottom-width:1px"><b>'+lang['printviewCache']+'</b></td>		'+
							'	<td style="border-bottom-color:lightgray;border-bottom-style:dashed;border-bottom-width:1px"><b>'+lang['printviewFound']+'</b></td>		'+
							'	<td style="border-bottom-color:lightgray;border-bottom-style:dashed;border-bottom-width:1px"><b>'+lang['printviewNote']+'</b></td>		'+
							'</tr>';
							
						var isCostumMarker = false;	
						for (var i = 0; i < currentTour.geocaches.length; ++i){
							var costumMarker = (typeof(currentTour.geocaches[i].lat) != "undefined");
						
							if(!costumMarker){
								
								var tr = document.createElement('tr');coverTable.appendChild(tr);
								var td = document.createElement('td');tr.appendChild(td);
								td.innerHTML = "<b>"+(i+1)+"</b>";
								
					
								td = document.createElement('td');tr.appendChild(td);
								td.innerHTML = "<img src='"+currentTour.geocaches[i].image+"'>";
								
								td = document.createElement('td');tr.appendChild(td);
								td.style.verticalAlign = "middle";
								td.style.width = "30%";					
								td.style.borderBottomColor = 'lightgray';
								td.style.borderBottomStyle = 'dashed';
								td.style.borderBottomWidth = '1px';
								td.innerHTML = "<a style='color:#000000;text-decoration: none' href='http://www.geocaching.com/seek/cache_details.aspx?guid="+currentTour.geocaches[i].guid+"'>"+currentTour.geocaches[i].name + "<font style='font-size:xx-small'>(" + currentTour.geocaches[i].id + ")</font></a>";
								
								td = document.createElement('td');tr.appendChild(td);
								td.style.verticalAlign = "middle";				
								//~ td.style.border = '1px solid lightgray';
								td.innerHTML = "<div style='margin-left:auto;margin-right:auto;width:10px;height:10px;border:1px solid lightgray;'>&nbsp;</div>";
								
								td = document.createElement('td');tr.appendChild(td);
								td.style.verticalAlign = "middle";
								td.style.width = "70%";					
								td.innerHTML = "&nbsp;";
								td.style.borderBottomColor = 'lightgray';
								td.style.borderBottomStyle = 'dashed';
								td.style.borderBottomWidth = '1px';
							} else {
								isCostumMarker = costumMarker;
							}
						}
						
						if(isCostumMarker){
							coverTable.innerHTML += 
							'<tr>		 			'+
							'	<td colspan=3 style="border-bottom-color:lightgray;border-bottom-style:dashed;border-bottom-width:1px"><b>'+lang['printviewMarker']+'</b></td>		'+
							'	<td colspan=3 style="border-bottom-color:lightgray;border-bottom-style:dashed;border-bottom-width:1px"><b>'+lang['printviewNote']+'</b></td>		'+
							'</tr>';
							
							for (var i = 0; i < currentTour.geocaches.length; ++i){
								var costumMarker = (typeof(currentTour.geocaches[i].lat) != "undefined");
							
								if(costumMarker){
									var tr = document.createElement('tr');coverTable.appendChild(tr);
									var td = document.createElement('td');tr.appendChild(td);
									
									td.innerHTML = "<b>"+(i+1)+"</b>";
									
									td = document.createElement('td');tr.appendChild(td);
									td.innerHTML = "<img src='"+currentTour.geocaches[i].image+"'>";
									
									
									td = document.createElement('td');tr.appendChild(td);
									td.style.verticalAlign = "middle";
									td.style.width = "30%";				
									td.colSpan = "3";	
									td.style.borderBottomColor = 'lightgray';
									td.style.borderBottomStyle = 'dashed';
									td.style.borderBottomWidth = '1px';
									td.innerHTML = currentTour.geocaches[i].name;
									
									var latArray = Dec2DM(currentTour.geocaches[i].lat);
									var lonArray = Dec2DM(currentTour.geocaches[i].lon);
									td.innerHTML += "&nbsp;-&nbsp;&nbsp;"+latArray[0]+ "° " +latArray[1] ;
									td.innerHTML += "&nbsp;/&nbsp;"+lonArray[0]+ "° " +lonArray[1];
									
								} 
							}
							
						}
							

						title.appendChild(coverTable);		
						
						
						
						var overview_map = createElement('div',{id:"overview_map"});
						title.appendChild(overview_map);
					}
					
					
					
					var geocaches = new Array();
					
	
					for (var i = 0; i < currentTour.geocaches.length; ++i){
						if(GM_getValue("stopTask",false) && i != 0){
							GM_setValue("stopTask",false);
							newwindow2.close();
						} else if (GM_getValue("stopTask",false) && i == 0 ) {
							GM_setValue("stopTask",false);
						}
						var costumMarker = (typeof(currentTour.geocaches[i].lat) != "undefined");
						
						if(!costumMarker){
							var geocache = getGeocache(currentTour.geocaches[i].id);
							
						
							//log
							var logs_div = createElement('div');							
							var maxPrintLogs = parseInt(GM_getValue('maxPrintLogs',0));
							// if maxprintlogs is <= -1, export all logs to the print overview
							if(maxPrintLogs <= -1)
								maxPrintLogs = logs.length;
							maxPrintLogs = maxPrintLogs;
							var logs = geocache.logs;	
							for (var log_i = 0; (log_i < logs.length && (log_i < maxPrintLogs)); log_i++){
								var log_div = createElement('div', {style:"width:95%;page-break-inside:avoid;", className:"removable"});
								log_div.innerHTML = logs[log_i].from.replace(/href=".*?"/,"")+"<br>";
								log_div.innerHTML += logs[log_i].text;
								append(log_div, logs_div);
								
							}
							
													
							var dummy_additional_waypoints = createElement('div');
							if (GM_getValue('printAdditionalWaypoints',true)){								
								var wpts_table = createElement('table', {className:"removable",style:"width:100%;border-collapse:separate;"} );append(wpts_table,dummy_additional_waypoints);
								var content = "<tr>";
								for(var waypoints_i = 0; waypoints_i < geocache.additional_waypoints.length; waypoints_i++){
									
								if(waypoints_i % 2 == 0 || waypoints_i == geocache.additional_waypoints.length-1){
										if(waypoints_i != 0 && waypoints_i != 1){
											content += "</tr>";
										}
										if(waypoints_i == geocache.additional_waypoints.length-1 && waypoints_i != 1){
											content += "<tr>";
										}
									}
									content += "<td style='width:50%;'>";
									content +="<img src='"+geocache.additional_waypoints[waypoints_i].symbol+"'>";
									content +="<b>"+geocache.additional_waypoints[waypoints_i].name+"</b>";
									content +=" | "+geocache.additional_waypoints[waypoints_i].coordinates + "<br>";
									content += "<i>"+geocache.additional_waypoints[waypoints_i].note + "</i><br>";	
								}
								content += "</tr>";
								
								wpts_table.innerHTML = content;
							}
							
							//images							
							var dummy_images = createElement('div');
							if (GM_getValue('printSpoilerImages',true)){
								var image_table = createElement('table',{style:"border-collapse:seperate;border-spacing:2px;width:100%"});append(image_table,dummy_images);
								var content = "<tr>";
								for(var images_i = 0; images_i < geocache.images.length; images_i++){
									if(images_i % 2 == 0 || images_i == geocache.images.length-1){
										if(images_i != 0 && images_i != 1){
											content += "</tr>";
										}
										if(images_i == geocache.images.length-1 && images_i != 1){
											content += "<tr>";
										}
									}
									
									content += "<td class='removable'>";
									content += "<img style='max-width:8cm;' src='"+geocache.images[images_i].href+"'><br>";
									content += "<b>"+geocache.images[images_i].textContent+"</b>";
									content += "</td>";
								}
								content += "</tr>";
								image_table.innerHTML = content;
							}
					
							
							// inventory
							var inventory = createElement('span');
							for (var inventory_i = 0; inventory_i < geocache.inventory.length; inventory_i++){
								var image = createElement('img');
								image.src = geocache.inventory[inventory_i].src;
								append(image,inventory);
							}
							if(geocache.inventory.length == 0){
								var empty_inventory = createElement('span');
								empty_inventory.innerHTML = "empty";							
								append(empty_inventory,inventory);
							}
							
							
							//attributes
							var attributes = createElement('span');
							for (var attributes_i = 0; attributes_i < geocache.attributes.length; attributes_i++){
								var attribute = geocache.attributes[attributes_i];
								attribute.style.width = "16px";
								attribute.style.height = "16px";
								attribute.style.marginRight = "3px";
								attribute.style.opacity = "0.5";
								if(attribute.src != "http://www.geocaching.com/images/attributes/attribute-blank.gif")
									append(attribute, attributes);
							}
								
							
							var geocacheArray = new Array();
							var mapCache = new Object();
							mapCache.gcid = geocache.gcid;
							mapCache.type = geocache.type;
							mapCache.name = geocache.name;
							mapCache.latitude = geocache.lat;
							mapCache.longitude = geocache.lon;
							mapCache.additional_waypoints = geocache.additional_waypoints;
							for(var waypoint_i = 0 ; waypoint_i < mapCache.additional_waypoints.length; waypoint_i++){
								mapCache.additional_waypoints[waypoint_i].note = "";
							}
							
							geocacheArray.push(mapCache);
							geocaches.push(mapCache);
							
							
							var map_element_dummy = createElement('div');
							var map_element = createElement('div');append(map_element, map_element_dummy);
							
							if (GM_getValue('printOutlineMapSingle',true)){	
								getOverviewMap(geocacheArray,newwindow2, "MAP_"+geocache.gcid);
							}
							
												
							var latArray = Dec2DM(geocache.latitude);
							var lonArray = Dec2DM(currentTour.geocaches[i].lon);					
							
							
						var geocacheMapping = new Array(
							new Array('GCID',geocache.gcid),
							new Array('CACHECOUNT',i+1),
							new Array('GUID',geocache.guid),
							new Array('TYPE',geocache.type),
							new Array('CACHENAME',geocache.name),
							new Array('OWNER',geocache.owner),
							new Array('HIDDEN',geocache.hidden),
							new Array('ATTRIBUTES',attributes.innerHTML),
							new Array('BEARING',geocache.bearing),
							new Array('DISTANCE',geocache.distance),
							new Array('INVENTORY',inventory.innerHTML),
							new Array('COORDINATES',geocache.coordinates),
							new Array('DIFFICULTY',geocache.difficulty.replace(/\./,"_")),
							new Array('TERRAIN',geocache.terrain.replace(/\./,"_")),
							new Array('SIZE',geocache.size.toLowerCase()),
							new Array('SHORT_DESCRIPTION',(geocache.short_description)?geocache.short_description.innerHTML:""),
							new Array('LONG_DESCRIPTION',(geocache.long_description)?geocache.long_description.innerHTML:""),
							new Array('HINT',(GM_getValue('decryptPrintHints',true))?geocache.hint:convertROTStringWithBrackets(geocache.hint)),
							new Array('ADDITIONAL_WAYPOINTS',dummy_additional_waypoints.innerHTML),
							new Array('IMAGES',dummy_images.innerHTML),
							new Array('MAP', map_element_dummy.innerHTML),
							new Array('MAPID', "MAP_"+geocache.gcid),
							new Array('LOGCOUNTER',(GM_getValue('printLoggedVisits',false))?geocache.find_counts.innerHTML:""),
							new Array('LOGS',logs_div.innerHTML)
						);
						
						var cacheDetailTemp = fillTemplate(geocacheMapping,cacheDetailTemplate);
												
						dojo.query("*[class='removable']",cacheDetailTemp).onclick(function(e){e.stopPropagation();dojo.destroy(this); }).onmouseover(function(e){ this.style.opacity="0.5";this.style.cursor = "url('"+deleteImageString+"'),pointer";}).onmouseout(function(e){ this.style.opacity="1";});
						
						// remove images in description
						
						dojo.query("img",dojo.query("div[class='long']",cacheDetailTemp)[0]).onclick(function(e){e.stopPropagation();dojo.destroy(this); }).onmouseover(function(e){ this.style.opacity="0.5";this.style.cursor = "url('"+deleteImageString+"'),pointer";}).onmouseout(function(e){ this.style.opacity="1";});
						dojo.query("a",dojo.query("div[class='long']",cacheDetailTemp)[0]).forEach(function(node, index, nodeList){
							node.removeAttribute("href");
						});
						
						
						if(GM_getValue('printEditMode',false)){
							dojo.query("div[class='long']",cacheDetailTemp)[0].contentEditable = "true";
							dojo.query("div[class='short']",cacheDetailTemp)[0].contentEditable = "true";
							
						}
						
						if(GM_getValue('printPageBreak',false)){
							if(i < currentTour.geocaches.length-1)
								cacheDetailTemp.style.pageBreakAfter = 'always';
						}
						
						
						
						body.appendChild(cacheDetailTemp);
						body.appendChild(document.createElement('br'));
					
							
						} else {
									
									
							var latArray = Dec2DM(currentTour.geocaches[i].lat);
							var lonArray = Dec2DM(currentTour.geocaches[i].lon);
								
										
							var markerMapping = new Array(
								new Array('GCID',lang["printviewMarker"]),
								new Array('CACHECOUNT',(i+1)),
								new Array('TYPE',currentTour.geocaches[i].image),
								new Array('NAME',currentTour.geocaches[i].name),
								new Array('COORDINATES',latArray[0]+ "°&nbsp;"+ latArray[1] + "&nbsp;&nbsp;" + lonArray[0]+ "°&nbsp;"+ lonArray[1]),
								new Array('CONTENT',currentTour.geocaches[i].content.replace(/\n/g, "<br />"))
							);
															
										
							var cacheDetailTemp = fillTemplate(markerMapping,ownMarkerTemplate);							
							body.appendChild(cacheDetailTemp);
							body.appendChild(document.createElement('br'));
							
							geocaches.push(currentTour.geocaches[i]);
						}
						
						// set the progress
						//~ newwindow2.document.getElementsByClassName('dark_msg_overlay')[0].getElementsByTagName('div')[0].innerHTML = (i+1)+" / "+currentTour.geocaches.length;
						setProgress(i,currentTour.geocaches.length,newwindow2.document);
					

						//~ // in the end - remove the overlay
						//~ if(i == currentTour.geocaches.length -1)
									
					}
					
					if(GM_getValue('printOutlineMap',true)){
						var anotherelement = document.createElement("div");
						
						if(GM_getValue('printFrontpage',true)){
							
							getOverviewMap(geocaches,newwindow2,"overview_map");
							var titlepage = newwindow2.document.getElementById('printTitle');
							insertAfter(titlepage.lastChild, document.createElement('br'));
							insertAfter(titlepage.lastChild, anotherelement);
						} else { 
							getOverviewMap(geocaches,newwindow2,"overview_map");
							body.appendChild(anotherelement);
						}								
				
					}
					
					

					
					removeOverlay(newwindow2.document);	
				
				} catch (e) {
					addErrorDialog(e,"PRINT ERROR",newwindow2.document); 
				}
				
			}
			, false);	
			
			
			
		}


	}


}
function getOverviewMap(geocaches, newwindow2, theElement){
		log('POST: http://gctour.madd.in/map/save.php - caches='+JSON.stringify(geocaches));
		//~ post('http://gctour.madd.in/map/save.php', 'caches='+uneval(geocaches).replace(/&/g,"\\u0026") ,
		//~ post('http://localhost/martin/map/save.php', 'tour='+JSON.stringify(geocaches).replace(/&/g," und "),
		post('http://gctour.madd.in/map/save.php', 'tour='+JSON.stringify(geocaches).replace(/&/g," und "),
						function(text){
							var mapId = text+ "#" + (new Date()).getTime();
							
							var cacheMapControl = document.createElement('div');
							cacheMapControl.className = 'noprint';
							//~ cacheMapControl.style.width = "20cm"; 
							cacheMapControl.style.border = '1px solid #EBEFC2';
							cacheMapControl.style.backgroundColor = '#FBFFCF';
							
							cacheMapControl.style.marginLeft = "auto" ;
							cacheMapControl.style.marginRight = "auto" ;
							
							cacheMapControl.style.marginBottom = "5px" ;
							cacheMapControl.style.paddingBottom = "5px" ;
							cacheMapControl.style.textAlign = "center" ;
			
							var divElement = document.createElement('div');cacheMapControl.appendChild(divElement);
							divElement.style.marginRight = '10px';
							divElement.style.display = "inline";			
							divElement.appendChild(document.createTextNode(	lang['printviewAdditionalWaypoint'] ));

							var divElement = document.createElement('div');cacheMapControl.appendChild(divElement);
							divElement.style.border = '1px solid lightgray';
							divElement.style.marginRight = '10px';
							divElement.style.display = "inline";										
							
							var inputElement = document.createElement('input');
							inputElement.id = 'mapMarker'+mapId;								
							inputElement.checked = 'checked';
							inputElement.type = 'checkbox';							
							inputElement.addEventListener('click',updateMap(newwindow2.document,mapId), false);
							divElement.appendChild(inputElement);
							divElement.appendChild(document.createTextNode(lang['settingsLogCountShow']));
							
							inputElement = document.createElement('input');
							inputElement.id = 'mapMarkerName'+mapId;								
							inputElement.checked = 'checked';
							inputElement.type = 'checkbox';							
							inputElement.addEventListener('click',updateMap(newwindow2.document,mapId), false);
							divElement.appendChild(inputElement);
							divElement.appendChild(document.createTextNode(	lang["markerCaption"]));
							
												
							
							divElement = document.createElement('div');cacheMapControl.appendChild(divElement);
							divElement.style.marginRight = '10px';
							divElement.style.display = "inline";							
							divElement.appendChild(document.createTextNode('Geocache:'));		
							
							 divElement = document.createElement('div');cacheMapControl.appendChild(divElement);
							divElement.style.border = '1px solid lightgray';
							divElement.style.marginRight = '10px';
							divElement.style.display = "inline";			
														
							inputElement = document.createElement('input');
							inputElement.id = 'mapName'+mapId;
							inputElement.type = 'checkbox';							
							inputElement.addEventListener('click',updateMap(newwindow2.document,mapId), false);
							
							divElement.appendChild(inputElement);
							divElement.appendChild(document.createTextNode(lang["markerCaption"]));
							
							inputElement = document.createElement('input');
							inputElement.id = 'mapGcId'+mapId;
							inputElement.type = 'checkbox';			
							inputElement.checked = 'checked';				
							inputElement.addEventListener('click',updateMap(newwindow2.document,mapId), false);
							
							divElement.appendChild(inputElement);
							divElement.appendChild(document.createTextNode('GC-Code'));
							
							// map size buttons
							divElement = document.createElement('div');cacheMapControl.appendChild(divElement);
							divElement.style.marginRight = '10px';
							divElement.style.display = "inline";							
							divElement.appendChild(document.createTextNode('Size:'));
													
								
							divElement = document.createElement('div');cacheMapControl.appendChild(divElement);
							divElement.style.border = '1px solid lightgray';
							divElement.style.marginRight = '10px';
							divElement.style.display = "inline";	
							
							
							var factor = 1;
							inputElement = document.createElement('input');divElement.appendChild(inputElement);
							inputElement.name = 'mapSize'+mapId;
							inputElement.type = 'radio';
							if(GM_getValue('defaultMapSize', 'large') == "large"){
								inputElement.checked = 'checked';
								factor = 1;
							}
							inputElement.addEventListener('click',updateMapSize(newwindow2.document,mapId,1), false);
							divElement.appendChild(document.createTextNode("large"));
							
							
							inputElement = document.createElement('input');divElement.appendChild(inputElement);
							inputElement.name = 'mapSize'+mapId;
							inputElement.type = 'radio';							
							if(GM_getValue('defaultMapSize', 'large') == "medium"){
								inputElement.checked = 'checked';
								factor = 0.75;
							}
							inputElement.addEventListener('click',updateMapSize(newwindow2.document,mapId,0.75), false);
							divElement.appendChild(document.createTextNode("medium"));
			
							
							inputElement = document.createElement('input');divElement.appendChild(inputElement);
							inputElement.name = 'mapSize'+mapId;
							inputElement.type = 'radio';							
							if(GM_getValue('defaultMapSize', 'large') == "small"){
								inputElement.checked = 'checked';
								factor = 0.5;
							}
							inputElement.addEventListener('click',updateMapSize(newwindow2.document,mapId,0.5), false);
							divElement.appendChild(document.createTextNode("small"));
			
							
							inputElement = document.createElement('input');divElement.appendChild(inputElement);
							inputElement.name = 'mapSize'+mapId;
							if(GM_getValue('defaultMapSize', 'large') ==  'very small'){
								inputElement.checked = 'checked';
								factor = 0.3;
							}
							inputElement.type = 'radio';							
							inputElement.addEventListener('click',updateMapSize(newwindow2.document,mapId,0.3), false);
							divElement.appendChild(document.createTextNode("very small"));
			
			
							
							// delete map button
							divElement = document.createElement('div');cacheMapControl.appendChild(divElement);
							divElement.style.border = '1px solid lightgray';
							divElement.style.marginRight = '10px';
							divElement.style.display = "inline";
							divElement.style.cursor = "pointer";
							divElement.addEventListener('click', function(){newwindow2.document.getElementById(mapId).style.display= "none"}, true);	
									
							addOpacityEffects(divElement); 
							
							
						    var deleteImage = document.createElement('img');
							deleteImage.style.cursor = 'pointer'; 
							deleteImage.src = deleteImageString;
							
						
							
			
							divElement.appendChild(deleteImage);
							divElement.appendChild(document.createTextNode(lang['printviewRemoveMap']));
							
							
							
							
							var cacheMap = document.createElement('iframe');
							cacheMap.className = 'cacheMap';
							//~ cacheMap.id = text;
						
							cacheMap.style.width = (factor * 20) + "cm"; 
							cacheMap.style.height = (factor * 500) + 'px';
							cacheMap.style.border = '1px solid lightgray';
							//~ cacheMap.src = "http://localhost/martin/map/show2.php?crc="+text+"&maptype="+GM_getValue('printOutlineMapType',"Karte");
							cacheMap.src = "http://gctour.madd.in/map/show2.php?crc="+text+"&maptype="+GM_getValue('printOutlineMapType',"Karte");
							
							
							var map = document.createElement('div');
							//~ map.id = 'mapDiv';
							map.id = mapId ;
							map.style.textAlign = 'center';
							map.style.marginLeft = 'auto';
							map.style.marginRight = 'auto';
							
			
			
							map.appendChild(cacheMapControl);
							map.appendChild(cacheMap);
							
							
							dojo.query("div[id='"+theElement+"']",newwindow2.document)[0].appendChild(map);					
						
							
						});
}

function updateMap(newDocument, mapId){
	return function(){
		
		var mapCrc = mapId.split('#')[0];
		
		var map = newDocument.getElementById(mapId).getElementsByTagName('iframe')[0];
		var nameInput = newDocument.getElementById('mapName'+mapId);
		var gcIdInput = newDocument.getElementById('mapGcId'+mapId);
		var markerInput = newDocument.getElementById('mapMarker'+mapId);
		var markerNameInput = newDocument.getElementById('mapMarkerName'+mapId);
		var mapURL = "http://gctour.madd.in/map/show2.php?crc="+mapCrc+"&name="+nameInput.checked+"&gcid="+gcIdInput.checked+"&marker="+markerInput.checked+"&markername="+markerNameInput.checked+"&maptype="+GM_getValue('printOutlineMapType',"Karte");
		map.src = mapURL;
	
		
	}
}
function updateMapSize(newDocument, mapId,factor){
	return function(){
		var map = newDocument.getElementById(mapId).getElementsByTagName('iframe')[0];
		map.style.width = (factor * 20) +"cm";
		map.style.height = (factor * 500) +"px";
	}
}
function getGeocache(gcid){
	var req = new XMLHttpRequest();
							
	var myUrl = 'http://www.geocaching.com/seek/cache_details.aspx?log=y&wp='+gcid;
	//var myUrl = 'http://www.geocaching.com/seek/cdpf.aspx?guid='+currentTour.geocaches[i].guid;
	req.open("GET", myUrl, false);
	// execute the request synchron
	req.send(null);
	// after execution parse the result
	var response_div = createElement('div');
	response_div.innerHTML = req.responseText;
	
	GM_setValue("debug_lastgcid",gcid);
	GM_setValue("debug_lastcachesite",req.responseText);
	
	
	return getGeocacheFromElement(response_div);
	
}

function getGeocacheFromElement(element){

	//~ geocache.gcid
	//~ geocache.cacheid
	//~ geocache.guid
	//~ geocache.name
	//~ geocache.type
	//~ geocache.owner
	//~ geocache.hidden
	//~ geocache.coordinates
	//~ geocache.lat
	//~ geocache.lon
	//~ geocache.location
	//~ geocache.state
	//~ geocache.country
	//~ geocache.bearing
	//~ geocache.distance
	//~ geocache.inventory
	//~ geocache.attributes
	//~ geocache.size
	//~ geocache.difficulty
	//~ geocache.terrain
	//~ geocache.attributes
	//~ geocache.short_description
	//~ geocache.long_description
	//~ geocache.hint
	//~ geocache.images
	//~ geocache.additional_waypoints
	//~ geocache.find_counts
	//~ geocache.logs

	
	var geocache = new Object();
	geocache.gcid = trim(dojo.query('span[id="ctl00_uxWaypointName"]',element)[0].textContent);
	geocache.cacheid = trim(dojo.query('a[href*="http://www.geocaching.com/seek/log.aspx?ID="]',element)[0].href.split("=")[1]);
	geocache.guid = dojo.query("a[id='ctl00_ContentBody_lnkPrintFriendly']",element)[0].href.split("guid=")[1];
	geocache.name = trim(dojo.query('span[id="ctl00_ContentBody_CacheName"]',element)[0].textContent);
	geocache.type =	dojo.query('a[href="/about/cache_types.aspx"] > img',element)[0].src.split("/")[5].split(".")[0];
	geocache.owner = trim(dojo.query('a[href*="http://www.geocaching.com/profile/?guid="]',element)[0].textContent);
	

	var strongs = dojo.query('strong',element);
	geocache.hidden = trim(strongs[1].parentNode.textContent.split(':')[1]);
	
	// unfortnaly event caches has an other format - parse this also
	if(geocache.hidden.match(",")){
 	 	 	 	 	
		dateArray = trim(geocache.hidden.split(",")[1]).split(" ");
		var hiddenDay = dateArray[0];
		switch(dateArray[1]){
			case "January": var hiddenMonth = 1;break;
			case "February": var hiddenMonth = 2;break;
			case "March": var hiddenMonth = 3;break;
			case "April": var hiddenMonth = 4;break;
			case "May": var hiddenMonth = 5;break;
			case "June": var hiddenMonth = 6;break;
			case "July": var hiddenMonth = 7;break;
			case "August": var hiddenMonth = 8;break;
			case "September": var hiddenMonth = 9;break;
			case "October": var hiddenMonth = 10;break;
			case "November": var hiddenMonth = 11;break;
			case "December": var hiddenMonth = 12;break;
		}
		
		var hiddenYear = dateArray[2];
		
		geocache.hidden = hiddenMonth+"/"+hiddenDay+"/"+hiddenYear;
	}
	
	geocache.size = dojo.query('small',element)[0].textContent.split("(")[1].split(")")[0];
	geocache.difficulty = dojo.query('img',strongs[3].parentNode)[0].alt.split(" out of ")[0];
	geocache.terrain = dojo.query('img',strongs[4].parentNode)[0].alt.split(" out of ")[0];


	geocache.coordinates = dojo.query('span[id="ctl00_ContentBody_LatLon"]',element)[0].innerHTML;
	geocache.lat = dojo.query('a[id="ctl00_ContentBody_lnkConversions"]',element)[0].href.split("lat=")[1].split("&")[0];
	geocache.lon = dojo.query('a[id="ctl00_ContentBody_lnkConversions"]',element)[0].href.split("lon=")[1].split("&")[0];
	
	geocache.location = dojo.query("span[id='ctl00_ContentBody_Location']",element)[0].textContent;
	
	// get the country and (if exists) the state!
	if(geocache.location.indexOf(",") < 0){ // if the index of "," < 0 then the state is not given! 
		geocache.state = "";
		geocache.country = trim(geocache.location.split("In ")[1]);
	} else {
		geocache.state = trim(geocache.location.split("In ")[1].split(',')[0]);
		geocache.country = trim(geocache.location.split("In ")[1].split(',')[1]);
	}
	

	
  	try{
		geocache.bearing =  dojo.query('span[id="ctl00_ContentBody_lblDistFromHome"] > img',element)[0].alt;
		geocache.distance =  dojo.query('span[id="ctl00_ContentBody_lblDistFromHome"]',element)[0].textContent.replace(" from your home coordinates","");
	} catch(e) {geocache.bearing = "";geocache.distance = "";}
	
	geocache.inventory = dojo.query('ul > li > a > img', dojo.query('div[class="WidgetBody"]',element)[1]);

	geocache.attributes = dojo.query('div[class="CacheDetailNavigationWidget Spacing"] > img',element);
	geocache.short_description = dojo.query('span[id="ctl00_ContentBody_ShortDescription"]',element)[0];
	geocache.long_description = dojo.query('span[id="ctl00_ContentBody_LongDescription"]',element)[0];
	geocache.images = dojo.query('span[id="ctl00_ContentBody_Images"] > a',element);
	
	geocache.additional_waypoints = new Array();
	
	var additional_waypoints = dojo.query('table[class="Table"] > tbody > tr',element);


	for(var i = 0;i < additional_waypoints.length;i = i+2){

		var row1 = additional_waypoints[i];
		var row2 = additional_waypoints[i+1];
		
		var row1_tds = row1.getElementsByTagName('td');
		var row2_tds = row2.getElementsByTagName('td');

		
		var coordinates_array = parse_coordinates(row1_tds[6].textContent);
		


		
		var waypoint = new Object();
		waypoint.symbol = row1_tds[2].childNodes[1].src;
		waypoint.lookup = trim(row1_tds[4].textContent);
		waypoint.name = row1_tds[5].childNodes[1].textContent;
		waypoint.coordinates = trim(row1_tds[6].textContent);
		waypoint.latitude = coordinates_array[0];
		waypoint.longitude = coordinates_array[1];		
		waypoint.note = trim(row2_tds[2].textContent);
		
		geocache.additional_waypoints.push(waypoint);		
	}
	
	var hints_element = dojo.query('div[id="div_hint"]',element)[0];
	if(hints_element){
		geocache.hint = convertROTStringWithBrackets(trim(hints_element.textContent));
	} else {
		geocache.hint = "";
	}
	
	geocache.find_counts = dojo.query('span[id="ctl00_ContentBody_lblFindCounts"] > p ',element)[0];
	geocache.logs = new Array();
	var logs =  dojo.query('table[class="LogsTable Table"] > tbody > tr > td',element);
 
	for(var log_i = 0;log_i < logs.length-1;log_i++){		
		var log_object = new Object();
		log_object.from = logs[log_i].firstChild.innerHTML;
		log_object.text = logs[log_i].textContent.replace(logs[log_i].firstChild.textContent, "").replace("View Log","").replace(/\(\d+ found\)/, "");
	
		geocache.logs.push(log_object);
		
	}
	return geocache;
}
function parse_coordinates(coords_string){
		// coordinates regex 'N 51° 18.795 E 012° 24.437'

	  var re1='(N|S)';	// Any Single Character 1
	  var re2='.*?';	// Non-greedy match on filler
	  var re3='(\\d+)';	// Integer Number 1
	  var re4='.*?';	// Non-greedy match on filler
	  var re5='([+-]?\\d*\\.\\d+)(?![-+0-9\\.])';	// Float 1
	  var re6='.*?';	// Non-greedy match on filler
	  var re7='(E|W)';	// Any Single Character 2
	  var re8='.*?';	// Non-greedy match on filler
	  var re9='(\\d+)';	// Integer Number 2
	  var re10='.*?';	// Non-greedy match on filler
	  var re11='([+-]?\\d*\\.\\d+)(?![-+0-9\\.])';	// Float 2

	  var p = new RegExp(re1+re2+re3+re4+re5+re6+re7+re8+re9+re10+re11,["i"]);
	  var m = p.exec(coords_string);

	  if (m != null) {
		  var c1=m[1];
		  var lat1=m[2];
		  var lat2=m[3];
		  var c2=m[4];
		  var lon1=m[5];
		  var lon2=m[6];

			var lat = DM2Dec(lat1,lat2);	
			var lon = DM2Dec(lon1,lon2);
			
			if(c1 == 'S'){
				lat = lat * (-1);
			}
			
			if(c2 == 'W'){
				lon = lon * (-1);
			}	
	  }
	  
	  return new Array(lat,lon);
}
function getGPXGeoCache(gcid){
	var geocache = new Object();
	var geocache_obj = getGeocache(gcid);
	
	
	var isGroundspeak = (GM_getValue("gpxschema",1) == 0);
	//~ geocache.gcid
	//~ geocache.cacheid
	//~ geocache.name
	//~ geocache.type
	//~ geocache.owner
	//~ geocache.hidden
	//~ geocache.coordinates
	//~ geocache.lat
	//~ geocache.lon
	//~ geocache.location
	//~ geocache.state
	//~ geocache.country
	//~ geocache.bearing
	//~ geocache.distance
	//~ geocache.inventory
	//~ geocache.size
	//~ geocache.difficulty
	//~ geocache.terrain
	//~ geocache.attributes
	//~ geocache.short_description
	//~ geocache.long_description
	//~ geocache.hint
	//~ geocache.images
	//~ geocache.additional_waypoints
	//~ geocache.find_counts
	//~ geocache.logs
	
	geocache.gcid = geocache_obj.gcid;		
		if(GM_getValue('gpxstripgc',false)){
			geocache.gcid = geocache.gcid.replace(/GC/,'');			
		}	
	geocache.cacheid = geocache_obj.cacheid;	
		
	geocache.cacheName = geocache_obj.name;
	geocache.cacheOwner = geocache_obj.owner;
	geocache.cacheType = geocache_obj.type;
	geocache.cacheSize = geocache_obj.size;

	if(isGroundspeak){
		switch (geocache_obj.type) {
			case "micro":geocache.cacheSize = "Micro";break;
			case "small":geocache.cacheSize = "Small";break;
			case "regular":geocache.cacheSize = "Regular";break;
			case "large":geocache.cacheSize = "Large";break;
			case "other":geocache.cacheSize = "Other";break;
			case "not_chosen":geocache.cacheSize = "Not chosen";break;
			case "virtual":geocache.cacheSize = "Virtual";break;
		}
	} else {
		// if "Not chosen" is the Cachesize - REMOVE IT!
		geocache.cacheSize = (geocache_obj.size == "Not chosen")?"Other":geocache_obj.size;
	}
	
	// define the cache type
	// if the GPX type is Groundspeak - parse type through the wptArr from autotour:
	if(isGroundspeak) {
		for(var i = 0; i< wptArray.length;i++){	
			if(wptArray[i]['wptTypeId'] == geocache_obj.type){
				geocache.cacheType = wptArray[i]['name'];
			}
		}
	} else {
		 switch (geocache_obj.type) {
			case "2": 
				geocache.cacheType = "Traditional";
				break;
			case "3": 
				geocache.cacheType = "Multi";
				break;
			case "4": 
				geocache.cacheType = "Virtual";
				break;
			case "11": 
				geocache.cacheType = "Webcam";
				break;
			case "6": 
				geocache.cacheType = "Event";
				break;
			case "453": 
				geocache.cacheType = "Event";
				break;
			default: 
				geocache.cacheType = "Other";
		  }	
	}

	
	geocache.difficulty = geocache_obj.difficulty;		
	geocache.terrain = geocache_obj.terrain;
	
	// get the summery and the description
	var summary = geocache_obj.short_description;	
	var description = geocache_obj.long_description;	
	
	if(GM_getValue('gpxhtml',true)){
		geocache.longDescription = (description)?description.innerHTML:"";
		geocache.shortDescription = (summary)?summary.innerHTML:""
	} else {
		geocache.longDescription = (description)?description.textContent:"";
		geocache.shortDescription = (summary)?summary.textContent:"";	
	}
	
	geocache.hint = geocache_obj.hint;
	
	
	geocache.state = geocache_obj.state;
	geocache.country = geocache_obj.country;	
	
	// hidden Date
	var dateHiddenArray = geocache_obj.hidden.split("/");

	geocache.dateHidden =  new Date(dateHiddenArray[2],dateHiddenArray[0]-1,dateHiddenArray[1]);
	
	geocache.logs = new Array();
	
	
	for(var i = 0; i<geocache_obj.logs.length;i++){
		var logObj = new Object();
		
		var from_element = createElement('div');from_element.innerHTML = geocache_obj.logs[i].from;
		//~ var text_element = dojo.create(geocache_obj.logs[i].text);
		//get cacher name from link
		logObj.cacherName =  dojo.query("a",from_element)[0].innerHTML;
		//~ logObj.cacherName = logObj.cacherName;
		//and log type from image
		var typeImage = dojo.query("img",from_element)[0].src;
		// specify the logtyo to fit into GPX
		
		if(typeImage == "http://www.geocaching.com/images/icons/icon_smile.gif"){
			logObj.type = (isGroundspeak)?"Found it":"Found";
		}else if(typeImage == "http://www.geocaching.com/images/icons/icon_sad.gif"){
			logObj.type = (isGroundspeak)?"Didn't find it":"Didn't find it";
		}else if(typeImage == "http://www.geocaching.com/images/icons/icon_needsmaint.gif"){
			logObj.type = (isGroundspeak)?"Needs Maintenance":"Note";
		}else if(typeImage == "http://www.geocaching.com/images/icons/icon_remove.gif"){
			logObj.type = (isGroundspeak)?"Needs Archived":"Note";
		}else if(typeImage == "http://www.geocaching.com/images/icons/big_smile.gif"){
			logObj.type = (isGroundspeak)?"Post Reviewer Note":"Note";
		}else if(typeImage == "http://www.geocaching.com/images/icons/icon_maint.gif"){
			logObj.type = (isGroundspeak)?"Owner Maintenance":"Note";
		}else if(typeImage == "http://www.geocaching.com/images/icons/icon_note.gif"){
			logObj.type = (isGroundspeak)?"Write note":"Note";
		}else{
			logObj.type = (isGroundspeak)?"Write note":"Other";
		}
		
		
		
		// crazy founddate founder
		var month,day,year;
		var p = new RegExp(/((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sept(?:ember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)) (\d+), (\d+)/);
		var m = p.exec(geocache_obj.logs[i].from);
		if(m != null){
			month =m[1];
			day=m[2];
			year=m[3];
		} else {
			p = new RegExp(/((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sept(?:ember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)) (\d+)/);
			m = p.exec(geocache_obj.logs[i].from);
			month =m[1];
			day=m[2];
			year = new Date().getFullYear()
		}
		
		switch (month) {
			case "January": month=0;break;
			case "February": month=1;break;
			case "March": month=2;break;
			case "April": month=3;break;
			case "May": month=4;break;
			case "June": month=5;break;
			case "July": month=6;break;
			case "August": month=7;break;
			case "September": month=8;break;
			case "October": month=9;break;
			case "November": month=10;break;
			case "December": month=11;break;
		}

		var foundDate = new Date(year, month, day);
		logObj.foundDate = foundDate; // ITS DONE! peew
		
		logObj.content = geocache_obj.logs[i].text;
		
		//~ GM_log("--------["+i+"]-------");
		//~ GM_log(logObj.cacherName);
		//~ GM_log(logObj.type);
		//~ GM_log(logObj.foundDate);
		//~ GM_log(logObj.content);
		
		// jobs done great - lets save this
		geocache.logs.push(logObj);
	}
	

	
	//additionalWaypoints
	geocache.additionalWaypoints = geocache_obj.additional_waypoints;
	
	geocache.latitude = geocache_obj.lat;
	geocache.longitude = geocache_obj.lon;
	
	
	log("--------------[START "+geocache.gcid+"]-------------");
	log("gcid:"+geocache.gcid);
	log("cacheName:"+geocache.cacheName);
	log("cacheOwner:"+geocache.cacheOwner);
	log("dateHidden:"+geocache.dateHidden);
	log("cacheType:"+geocache.cacheType);
	log("cacheSize:"+geocache.cacheSize);
	
	log("difficulty:"+geocache.difficulty);
	log("terrain:"+geocache.terrain);
	log("longDescription:"+geocache.longDescription);
	log("shortDescription:"+geocache.shortDescription);
	//~ log("latLon:"+geocache.latLon.innerHTML);
	log("latitude:"+geocache.latitude);
	log("longitude:"+geocache.longitude);
	log("state:"+geocache.state);
	log("country:"+geocache.country);
	
	//~ log("logs:"+geocache.logs.length);
	log("--------------[END "+geocache.gcid+"]--------------");
	
	return geocache;
}

function getGPXNew(){
var gpxHeader = '<?xml version="1.0" encoding="utf-8"?>'+
				'<gpx xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'+
				'     xsi:schemaLocation="http://www.topografix.com/GPX/1/0 http://www.topografix.com/GPX/1/0/gpx.xsd http://geocaching.com.au/geocache/1 http://geocaching.com.au/geocache/1/geocache.xsd"'+
				'     xmlns="http://www.topografix.com/GPX/1/0"'+
				'     version="1.0"'+
				'     creator="gctour.madd.in">'+
				'  <desc>Geocache</desc>'+
				'  <author>GcTour</author>'+
				'  <url>http://gctour.madd.in</url>'+
				'  <urlname>gctour.madd.in</urlname>'+
				'  <time>'+ xsdDateTime(new Date()) +'</time>'+
				'</gpx>';
		

	
		var gpxString = '';

		var parser = new DOMParser();
		var gpxDom = parser.parseFromString(gpxHeader,"application/xml");
		var gpxElement = gpxDom.getElementsByTagName('gpx')[0];		
		
		var waypointTemplate =
				'<wpt xmlns="http://www.topografix.com/GPX/1/0" lat="##LAT##" lon="##LON##">'+
					'<time>##TIME##</time>'+
					'<name>##GCID##</name>'+
					'<desc>##CACHENAME##</desc>'+
					'<src>www.geocaching.com</src>'+
					'<url>http://www.geocaching.com/seek/cache_details.aspx?wp=##GCID##</url>'+
					'<urlname>##CACHENAME##</urlname>'+
					'<sym>Geocache</sym>'+
					'<type>Geocache</type>'+
					'<geocache status="Available" xmlns="http://geocaching.com.au/geocache/1">'+
					'	<name>##CACHENAME##</name>'+
					'	<owner>##OWNER##</owner>'+
					'	<locale></locale>'+
					'	<state>##STATE##</state>'+
					'	<country>##COUNTRY##</country>'+
					'	<type>##TYPE##</type>'+
					'	<container>##CONTAINER##</container>'+
					'	<difficulty>##DIFFICULTY##</difficulty>'+
					'	<terrain>##TERRAIN##</terrain>'+
					'	<summary html="true">##SUMMARY##</summary>'+
					'	<description html="true">##DESCRIPTION##</description>'+
					'	<hints>##HINT##</hints>'+
					'	<licence></licence>'+
					'	<logs>##LOGS##</logs>			'+
					'</geocache>'+
				'</wpt>';
		var waypointLogTemplate =		
			'<log id="##LOGID##">'+
			'	<time>##TIME##</time>'+
			'	<geocacher>##CACHERNAME##</geocacher>'+
			'	<type>##LOGTYPE##</type>'+
			'	<text>##LOGTEXT##</text>'+
			'</log>';
		
		for (var i = 0; i < currentTour.geocaches.length; i++){

			// iff the cancelbutton is presssed 
			if(GM_getValue("stopTask",false)){
				GM_setValue("stopTask",false);
				return "canceled"; // then return!
			}

			var costumMarker = (typeof(currentTour.geocaches[i].lat) != "undefined");
			
			if(!costumMarker){	
	
				var geocache = getGPXGeoCache(currentTour.geocaches[i].id);
				
				var logsStringArray = new Array();
				
				var logs =  geocache.logs;			
				// just 11 logs in the gpx
				for (var j = 0; (j < logs.length && j <= 10); j++){
					var geocacheLogMapping = new Array(
						 new Array('LOGID',new Date().getTime()),
						 new Array('TIME',xsdDateTime(logs[j].foundDate)),
						 new Array('CACHERNAME',encodeHtml(logs[j].cacherName)),
						 new Array('LOGTYPE',logs[j].type),
						 new Array('LOGTEXT',encodeHtml(logs[j].content))
					);
					
					var cacheWaypointLog = waypointLogTemplate;
				
					for(var k = 0 ; k<geocacheLogMapping.length ; k++){
						cacheWaypointLog = cacheWaypointLog.replace(new RegExp("##"+geocacheLogMapping[k][0]+"##","g"),geocacheLogMapping[k][1]);
					}
					
					logsStringArray.push(cacheWaypointLog);
				}
				
				
				var geocacheMapping = new Array(
					 new Array('LAT',geocache.latitude),
					 new Array('LON',geocache.longitude),
					 new Array('TIME',xsdDateTime(geocache.dateHidden)),
					 new Array('GCID',geocache.gcid),
					 new Array('CACHENAME',encodeHtml(geocache.cacheName)),
					 new Array('OWNER',encodeHtml(geocache.cacheOwner)),
					 new Array('STATE',encodeHtml(geocache.state)),
					 new Array('COUNTRY',encodeHtml(geocache.country)),
					 new Array('TYPE', geocache.cacheType),					
					 new Array('CONTAINER',geocache.cacheSize),
					 new Array('DIFFICULTY',geocache.difficulty),
					 new Array('TERRAIN',geocache.terrain),
					 new Array('SUMMARY',encodeHtml(geocache.shortDescription)),
					 new Array('DESCRIPTION',encodeHtml(geocache.longDescription)),
					 new Array('HINT',encodeHtml(geocache.hint)),
					 new Array('LOGS',logsStringArray.join(""))
				);
				var cacheWaypoint = waypointTemplate;
				
				for(var j = 0 ; j<geocacheMapping.length ; j++){
					cacheWaypoint = cacheWaypoint.replace(new RegExp("##"+geocacheMapping[j][0]+"##","g"),geocacheMapping[j][1]);
				}
							//~ alert(cacheWaypoint);	
				var parser = new DOMParser();
				var dom = parser.parseFromString(cacheWaypoint,
					"text/xml");
				var waypoint = dom.getElementsByTagName('wpt')[0];
				gpxElement.appendChild(waypoint);
				
				
				for(var k = 0;k<geocache.additionalWaypoints.length;k++){
					
					if(geocache.additionalWaypoints[k].coordinates != "???"){
						var parser = new DOMParser();
						var dom = parser.parseFromString(getWaypointsGPXFromGeocache(geocache.additionalWaypoints[k],geocache),
							"text/xml");
						var waypoint = dom.getElementsByTagName('wpt')[0];
						gpxElement.appendChild(waypoint);	
					}
				}
				
				
			
			} else {
				var parser = new DOMParser();
				var dom = parser.parseFromString(getGPXfromMarker(currentTour.geocaches[i]),
					"text/xml");
				var waypoint = dom.getElementsByTagName('wpt')[0];
				gpxElement.appendChild(waypoint);	
			}
		setProgress(i,currentTour.geocaches.length,document);


		} // itertion end 
		
		var str = new XMLSerializer().serializeToString(gpxDom);
		return str;
		
}


function getGPX(){
	var gpxHeader = '<?xml version="1.0" encoding="utf-8"?>'+
				'<gpx xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'+
				' xmlns:xsd="http://www.w3.org/2001/XMLSchema" version="1.0"'+
				' creator="GcTour http://gctour.madd.in"'+
				' xsi:schemaLocation="http://www.topografix.com/GPX/1/0 http://www.topografix.com/GPX/1/0/gpx.xsd http://www.groundspeak.com/cache/1/0 http://www.groundspeak.com/cache/1/0/cache.xsd" '+
				' xmlns="http://www.topografix.com/GPX/1/0">'+
				'<name>'+currentTour.name+'</name>'+
				'<desc>This is an individual tour generated by GcTour</desc>'+
				'<email>gctour@madd.in</email>'+
				'<url>http://www.geocaching.com</url>'+
				'<urlname>Geocaching - High Tech Treasure Hunting</urlname>'+
 				'  <time>'+ xsdDateTime(new Date()) +'</time>'+
 				'<keywords>cache, geocache</keywords>'+
				'<bounds minlat="50" minlon="11" maxlat="51" maxlon="12" />'+
 				'</gpx>';

	
		var gpxString = '';

		var parser = new DOMParser();
		var gpxDom = parser.parseFromString(gpxHeader,"application/xml");
		var gpxElement = gpxDom.getElementsByTagName('gpx')[0];		
		
		var waypointTemplate =
				//~ '<wpt xmlns="http://www.groundspeak.com/cache/1/0" xmlns:groundspeak="http://www.groundspeak.com/cache/1/0" lat="##LAT##" lon="##LON##">'+
				'<wpt xmlns="http://www.topografix.com/GPX/1/0" lat="##LAT##" lon="##LON##">'+
					'<time>##TIME##</time>'+
					'<name>##GCID##</name>'+
					'<desc>##CACHENAME##</desc>'+
					'<src>www.geocaching.com</src>'+
					'<url>http://www.geocaching.com/seek/cache_details.aspx?wp=##GCID##</url>'+
					'<urlname>##CACHENAME##</urlname>'+
					'<sym>Geocache</sym>'+
					'<type>Geocache|##TYPE##</type>'+
					'<groundspeak:cache xmlns:groundspeak="http://www.groundspeak.com/cache/1/0"  id="##CACHEID##" available="True" archived="False">'+
					'	<groundspeak:name>##CACHENAME##</groundspeak:name>'+
					'	<groundspeak:placed_by>##OWNER##</groundspeak:placed_by>'+
					'	<groundspeak:owner>##OWNER##</groundspeak:owner>'+
					'	<groundspeak:type>##TYPE##</groundspeak:type>'+
					'	<groundspeak:container>##CONTAINER##</groundspeak:container>'+
					'	<groundspeak:difficulty>##DIFFICULTY##</groundspeak:difficulty>'+
					'	<groundspeak:terrain>##TERRAIN##</groundspeak:terrain>'+
					'	<groundspeak:country>##COUNTRY##</groundspeak:country>'+
					'	<groundspeak:state>##STATE##</groundspeak:state>'+
					'	<groundspeak:short_description html="true">##SUMMARY##</groundspeak:short_description>'+
					'	<groundspeak:long_description html="true">##DESCRIPTION##</groundspeak:long_description>'+
					'	<groundspeak:encoded_hints>##HINT##</groundspeak:encoded_hints>'+					
					'	<groundspeak:logs>##LOGS##</groundspeak:logs>			'+
					'</groundspeak:cache>'+
				'</wpt>';
 		var waypointLogTemplate =		
			'<groundspeak:log id="##LOGID##">'+
			'	<groundspeak:date>##TIME##</groundspeak:date>'+
			'	<groundspeak:type>##LOGTYPE##</groundspeak:type>'+
			'	<groundspeak:finder>##CACHERNAME##</groundspeak:finder>'+
			'	<groundspeak:text>##LOGTEXT##</groundspeak:text>'+
			'</groundspeak:log>';
		
		for (var i = 0; i < currentTour.geocaches.length; i++){

			// iff the cancelbutton is presssed 
			if(GM_getValue("stopTask",false)){
				GM_setValue("stopTask",false);
				return "canceled"; // then return!
			}

			var costumMarker = (typeof(currentTour.geocaches[i].lat) != "undefined");
			
			if(!costumMarker){	
	
				var geocache = getGPXGeoCache(currentTour.geocaches[i].id);
				
				var logsStringArray = new Array();
				
				var logs =  geocache.logs;
				// just 11 logs in the gpx
				for (var j = 0; (j < logs.length && j <= 10); j++){
					var geocacheLogMapping = new Array(
						 new Array('LOGID',new Date().getTime()),
						 new Array('TIME',xsdDateTime(logs[j].foundDate)),
						 new Array('CACHERNAME',encodeHtml(logs[j].cacherName)),
						 new Array('LOGTYPE',logs[j].type),
						 new Array('LOGTEXT',encodeHtml(logs[j].content))
					);
					
					var cacheWaypointLog = waypointLogTemplate;
				
					for(var k = 0 ; k<geocacheLogMapping.length ; k++){
						cacheWaypointLog = cacheWaypointLog.replace(new RegExp("##"+geocacheLogMapping[k][0]+"##","g"),geocacheLogMapping[k][1]);
					}
					
					logsStringArray.push(cacheWaypointLog);
				}
				
				
				var geocacheMapping = new Array(
					 new Array('LAT',geocache.latitude),
					 new Array('LON',geocache.longitude),
					 new Array('TIME',xsdDateTime(geocache.dateHidden)),
					 new Array('GCID',geocache.gcid),
					 new Array('CACHEID',geocache.cacheid),
					 new Array('CACHENAME',encodeHtml(geocache.cacheName)),
					 new Array('OWNER',encodeHtml(geocache.cacheOwner)),
					 new Array('STATE',encodeHtml(geocache.state)),
					 new Array('COUNTRY',encodeHtml(geocache.country)),
					 new Array('TYPE', geocache.cacheType),					
					 new Array('CONTAINER',geocache.cacheSize),
					 new Array('DIFFICULTY',geocache.difficulty),
					 new Array('TERRAIN',geocache.terrain),
					 new Array('SUMMARY',encodeHtml(geocache.shortDescription)),
					 new Array('DESCRIPTION',encodeHtml(geocache.longDescription)),
					 new Array('HINT',encodeHtml(geocache.hint)),
					 new Array('LOGS',logsStringArray.join(""))
				);
				var cacheWaypoint = waypointTemplate;
				
				for(var j = 0 ; j<geocacheMapping.length ; j++){
					cacheWaypoint = cacheWaypoint.replace(new RegExp("##"+geocacheMapping[j][0]+"##","g"),geocacheMapping[j][1]);
				}	
				var parser = new DOMParser();
				var dom = parser.parseFromString(cacheWaypoint,
					"text/xml");
				var waypoint = dom.getElementsByTagName('wpt')[0];
				gpxElement.appendChild(waypoint);
				
				
				for(var k = 0;k<geocache.additionalWaypoints.length;k++){
					
					if(geocache.additionalWaypoints[k].coordinates != "???"){
						var parser = new DOMParser();
						var dom = parser.parseFromString(getWaypointsGPXFromGeocache(geocache.additionalWaypoints[k],geocache),
							"text/xml");
						var waypoint = dom.getElementsByTagName('wpt')[0];
						gpxElement.appendChild(waypoint);	
					}
				}
				
				
			
			} else {
				var parser = new DOMParser();
				var dom = parser.parseFromString(getGPXfromMarker(currentTour.geocaches[i]),
					"text/xml");
				var waypoint = dom.getElementsByTagName('wpt')[0];
				gpxElement.appendChild(waypoint);	
			}
		setProgress(i,currentTour.geocaches.length,document);


		} // itertion end 
		
		var str = new XMLSerializer().serializeToString(gpxDom);
		return str;
}

function getGPXfromMarker(marker){

	var gpx = 	'<wpt xmlns="http://www.topografix.com/GPX/1/0" lat="'+ marker.lat +'" lon="'+ marker.lon +'">';
	gpx += 		'	<time>'+ xsdDateTime(new Date()) +'</time>';
	gpx += 		'	<name>'+ encodeHtml(marker.name) +'</name>';
	gpx += 		'	<cmt>'+ encodeHtml(marker.content) +'</cmt>';
	gpx += 		'	<sym>'+ marker.symbol +'</sym>';
	gpx += 		'</wpt>';


	return gpx;
}

function getWaypointsGPXFromGeocache(waypoint,geocache){
	var gpx = 	'<wpt xmlns="http://www.topografix.com/GPX/1/0" lat="'+ waypoint.latitude +'" lon="'+ waypoint.longitude +'">';
	gpx += 		'	<time>'+ xsdDateTime(geocache.dateHidden) +'</time>';
	gpx += 		'	<name>'+ encodeHtml(waypoint.lookup) +'</name>';
	gpx += 		'	<cmt>'+ encodeHtml(waypoint.note) +'</cmt>';
	gpx += 		'	<desc>'+ encodeHtml(waypoint.name) +'</desc>';
	gpx += 		'	<sym>'+ waypoint.symbol +'</sym>';
	gpx += 		'</wpt>';	

	return gpx;
}
function setLanguage(i){
	return function(){
		GM_setValue('language',i);
		window.location.reload();
	}
}

function toggleBoolValue(valueName, defaultValue){
	return function(){
		GM_setValue(valueName, !GM_getValue(valueName, defaultValue));
	}
}


function  setPrintFontSize(fontSize){
	return function(){
		GM_setValue('printFontSize',fontSize);
	}
}

function startAutoTour(){
	var typeInputs = dojo.query("input[name='type']");
	var sizeInputs = dojo.query("input[name='size']");
	var difficultyInputs = dojo.query("input[name='Difficulty']");
	var terrainInputs = dojo.query("input[name='Terrain']");
	var specialInputs = dojo.query("input[name='special']");

	var typeFilter = new Object();
	for(var i = 0; i<typeInputs.length;i++){
		typeFilter[typeInputs[i].value] = typeInputs[i].checked;
	}

	var sizeFilter = new Object();
	for(var i = 0; i<sizeInputs.length;i++){
		sizeFilter[sizeInputs[i].value] = sizeInputs[i].checked;
	}

	var difficultyFilter = new Object();
	for(var i = 0; i<difficultyInputs.length;i++){
		difficultyFilter[difficultyInputs[i].value] = difficultyInputs[i].checked;
	}

	var terrainFilter = new Object();
	for(var i = 0; i<terrainInputs.length;i++){
		terrainFilter[terrainInputs[i].value+""] = terrainInputs[i].checked;
	}
	var specialFilter = new Object();
	for(var i = 0; i<specialInputs.length;i++){
		//~ GM_log(">"+specialInputs[i].value+"<");
		specialFilter[specialInputs[i].value+""] = specialInputs[i].checked;
	}

	var lat = dojo.query("input[id='coordsDivLat']")[0].value;
	var lon = dojo.query("input[id='coordsDivLon']")[0].value;
	var radius = dojo.query("input[id='coordsDivRadius']")[0].value;
	var url = "http://www.geocaching.com/seek/nearest.aspx?lat="+lat+"&lon="+lon+"&dist="+radius;

	if(specialFilter["I haven't found "]){
		url += "&f=1";
	}


	GM_setValue('tq_url', url);
	GM_setValue('tq_typeFilter', uneval(typeFilter));
	GM_setValue('tq_sizeFilter', uneval(sizeFilter));
	GM_setValue('tq_dFilter', uneval(difficultyFilter));
	GM_setValue('tq_tFilter', uneval(terrainFilter));
	GM_setValue('tq_specialFilter', uneval(specialFilter));
	GM_setValue('tq_StartUrl', document.location.href);

	document.location.href = url;

}

function getMarkerCoord(latitude,longitude){
	return function(){

		if(latitude && longitude){
			updateAutoTourMap(latitude,longitude);
			return;
		}


		var markerCoords = dojo.query("input[id='markerCoords']")[0].value;
		var regex = new RegExp(/(N|S)(\s*)(\d{0,2})(\s*)°(\s*)(\d{0,2}[\.,]\d+)(\s*)(E|W)(\s*)(\d{0,3})(\s*)°(\s*)(\d{0,2}[\.,]\d+)/);
		var regex2 = new RegExp(/(-{0,1}\d{0,2}[\.,]\d+)(\s*)(-{0,1}\d{0,3}[\.,]\d+)/);
		var lat,lon;
		if(markerCoords.match(regex)){

			var ergebnis = regex.exec(markerCoords);

			lat = DM2Dec(ergebnis[3],ergebnis[6]);
			if(ergebnis[1] == 'S') lat = lat * (-1);

			lon = DM2Dec(ergebnis[10],ergebnis[13]);
			if(ergebnis[8] == 'W') lon = lon * (-1);


		} else if(markerCoords.match(regex2)){
			lat = parseFloat(RegExp.$1+""+RegExp.$2);
			lon = parseFloat(RegExp.$3+""+RegExp.$4);
		} else {
			log("Google req://maps.google.com/maps/geo?q="+markerCoords+"&output=json&oe=utf8&sensor=true_or_false&key=ABQIAAAAKUykc2Tomn0DYkEZVrVaaRSNBTQkd3ybMgPO53QyT8hP9fzjBxSrEmDQGeGO-AZdQ4ogAvc8mRcV-g");
			GM_xmlhttpRequest({
				method: 'GET',
				url: "http://maps.google.com/maps/geo?q="+markerCoords+"&output=json&oe=utf8&sensor=false&key=ABQIAAAAKUykc2Tomn0DYkEZVrVaaRSNBTQkd3ybMgPO53QyT8hP9fzjBxSrEmDQGeGO-AZdQ4ogAvc8mRcV-g",
				onload: function(responseDetails) {
						if(typeof JSON === "undefined"){
							var jsonResponse = eval("("+responseDetails.responseText+")");
						} else {
							var jsonResponse = JSON.parse(responseDetails.responseText);
						}
						if(jsonResponse.Placemark){
							var lat = parseFloat(jsonResponse.Placemark[0].Point.coordinates[1]);
							var lon = parseFloat(jsonResponse.Placemark[0].Point.coordinates[0]);
							getMarkerCoord(lat,lon)();
						}
					}
			});
			return;
		}
		updateAutoTourMap(lat, lon);
	}
}


function saveMarkerCoord(cordsInput,cordsInputLat,cordsInputLon){
	return function(){
		//~ var cordsInput = $('#markerCoords');//document.getElementById('markerCoords');

		var regex = new RegExp(/(N|S)(\s*)(\d{0,2})(\s*)°(\s*)(\d{0,2}[\.,]\d+)(\s*)(E|W)(\s*)(\d{0,3})(\s*)°(\s*)(\d{0,2}[\.,]\d+)/);
		var regex2 = new RegExp(/(-{0,1}\d{0,2}[\.,]\d+)(\s*)(-{0,1}\d{0,3}[\.,]\d+)/);
		window.setTimeout(
				function(){
				var result = regex.exec(cordsInput.value);
				var result2 = regex2.exec(cordsInput.value);

				log(result +" " +result2);
				if (!result && !result2) {
				cordsInput.style.backgroundColor = "#FF8888";

				//~ document.getElementById('staticGMap').style.display = 'none';
				} else if (result) {
				cordsInput.style.backgroundColor = "#88DC3B";

				var lat = DM2Dec(result[3],result[6]);
				if(result[1] == 'S') lat = lat * (-1);
				cordsInputLat.value = lat;

				var lon = DM2Dec(result[10],result[13]);
				if(result[8] == 'W') lon = lon * (-1);
				cordsInputLon.value = lon;
				document.getElementById('staticGMap').style.display = 'block';
				updateMarkerOverviewMap(cordsInputLat.value ,cordsInputLon.value,13);
				}else if (result2) {
					cordsInput.style.backgroundColor = "#88DC3B";
					var lat = parseFloat(result2[1]+""+result2[2]);
					var lon = parseFloat(result2[3]+""+result2[4]);

					cordsInputLat.value = lat;
					cordsInputLon.value = lon;
					document.getElementById('staticGMap').style.display = 'block';
					updateMarkerOverviewMap(cordsInputLat.value ,cordsInputLon.value,13);
				}

				},10);
	}
}

function getSpecialFilter(){
	var specialDiv = document.createElement('div');
	specialDiv.style.cssFloat = "left";	
	specialDiv.style.paddingRight = "10px";
	specialDiv.style.textAlign = "left";
	specialDiv.innerHTML = "<b>That</b><br/>";


	var specials = ['I haven\'t found ','is Active', 'is not a PM cache'];
	//~ var specials = ['I haven\'t found ','is Active', 'i don\'t own'];

	for(var i = 0; i<specials.length; i++ ){
		var checkboxSpan = createElement('span');

		var checkbox = createElement('input', {type: 'checkbox', name: "special", value: specials[i], checked: 'checked'});
		checkbox.style.margin = '0px';

		var caption = createElement('span');
		caption.innerHTML = specials[i];

		append(checkbox, checkboxSpan);
		append(caption, checkboxSpan);
		append(checkboxSpan, specialDiv);
		append(createElement('br'), specialDiv);

	}

	return specialDiv;

}

function getDtFiler(boxName){

	var checkboxesDiv = document.createElement('div');

	checkboxesDiv.style.cssFloat = "left";	
	checkboxesDiv.style.textAlign = "left";
	checkboxesDiv.style.paddingRight = "10px";
	checkboxesDiv.innerHTML = "<b>"+boxName+"</b><br/>";
	for(var i = 1; i<=5; i = i+0.5){
		var checkboxDiv = createElement('span');

		checkboxDiv.style.border = '1px solid gray';
		checkboxDiv.style.margin = '2px';
		checkboxDiv.style.verticalAlign = 'middle';

		var checkbox = createElement('input', {type: 'checkbox', name: boxName, value: i, id:boxName+""+i, checked: 'checked'});
		checkbox.style.margin = '0px';

		var label = createElement('label');
		label.setAttribute("for", boxName+""+i);
		var caption = createElement('img');
		append(caption,label);
		var value = ""+i;
		value = value.replace(/\./g, "_");
		caption.src = "http://www.geocaching.com/images/stars/stars"+value+".gif";




		checkboxesDiv.appendChild(checkbox);
		checkboxesDiv.appendChild(label);
		checkboxesDiv.appendChild(createElement('br'));
	}

	return checkboxesDiv;
}


function getSizeFilter(){

	//~ http://www.geocaching.com/images/icons/container/micro.gif
	//~ http://www.geocaching.com/images/icons/container/small.gif
	//~ http://www.geocaching.com/images/icons/container/regular.gif
	//~ http://www.geocaching.com/images/icons/container/large.gif
	//~ http://www.geocaching.com/images/icons/container/other.gif
	//~ http://www.geocaching.com/images/icons/container/virtual.gif
	//~ http://www.geocaching.com/images/icons/container/not_chosen.gif

	var sizes = ['micro','small','regular','large','other','virtual','not_chosen'];

	var sizesCheckboxesDiv = document.createElement('div');

	sizesCheckboxesDiv.style.cssFloat = "left";	
	sizesCheckboxesDiv.style.textAlign = "left";
	sizesCheckboxesDiv.style.paddingRight = "10px";
	sizesCheckboxesDiv.innerHTML = "<b>Size</b><br/>";
	for(var i = 0; i<sizes.length; i++ ){
		var checkboxDiv = createElement('span');

		checkboxDiv.style.border = '1px solid gray';
		checkboxDiv.style.margin = '2px';
		checkboxDiv.style.verticalAlign = 'middle';

		var checkbox = createElement('input', {type: 'checkbox', name: "size", value: sizes[i], id:"size"+sizes[i], checked: 'checked'});
		checkbox.style.margin = '0px';
		var label = createElement('label');
		label.setAttribute("for", "size"+sizes[i]);
		
		var caption = createElement('img');
		append(caption,label);
		caption.src = "http://www.geocaching.com/images/icons/container/"+sizes[i]+".gif";
		caption.title = sizes[i];
		caption.alt = sizes[i];

		sizesCheckboxesDiv.appendChild(checkbox);
		sizesCheckboxesDiv.appendChild(label);
		sizesCheckboxesDiv.appendChild(createElement('br'));
	}

	return sizesCheckboxesDiv;

	//~ 
	//~ http://www.geocaching.com/images/icons/container/micro.gif
}

function getTypeFilter(){


	var typeDiv = document.createElement('div');
	typeDiv.style.textAlign = "left";
	typeDiv.style.paddingLeft = "10px";
	typeDiv.style.paddingRight = "10px";
	typeDiv.style.textAlign = "left";
	typeDiv.style.cssFloat = "left";
	typeDiv.innerHTML = "<b>Type</b><br/>";

	for(var i = 0; i< wptArray.length;i++){	
		var checkboxDiv = createElement('span');

		var checkbox = createElement('input', {type: 'checkbox', name: "type", value: wptArray[i]['wptTypeId'], id: "type"+wptArray[i]['wptTypeId'], checked: 'checked'});
		append(checkbox,checkboxDiv);
		checkbox.style.margin = '0px';

		var label = createElement('label');
		label.setAttribute("for", "type"+wptArray[i]['wptTypeId']);
		
		append(label,checkboxDiv);
		var caption = createElement('img');
		append(caption,label);
		caption.src = 'http://www.geocaching.com/images/WptTypes/sm/'+wptArray[i]['wptTypeId']+'.gif';

		append(checkboxDiv,typeDiv);

		if((i+1) % 2 == 0){
			typeDiv.appendChild(createElement('br'));
			checkboxDiv.style.paddingLeft = '10px';
		}
	}



	return typeDiv;
}


function getCoordinatesTab(){
	var coordsDiv = createElement('div');
	coordsDiv.id = 'coordsDiv';
	coordsDiv.align = "left";

	var divEbene = createElement('div', {className: 'ebene'});
	var spanLabel = createElement('span', {className: 'label'});append(spanLabel, divEbene);
	var spanFeld = createElement('span', {});append(spanFeld, divEbene);
	spanLabel.innerHTML = lang["autoTourCenter"];
	var cordsInput = createElement('input', {type: 'text', id: "markerCoords"});
	append(cordsInput,spanFeld);
	append(getLocateMeButton(),spanFeld);
	var coordsExample = createElement('span',{style: "font-size:66%"});append(coordsExample,spanFeld);
	coordsExample.innerHTML = "<br/><i>N51° 12.123 E010° 23.123</i> or <i>40.597 -75.542</i> or <i>Berlin</i> ";
	append(divEbene, coordsDiv);

	divEbene = createElement('div', {className: 'ebene'});
	spanLabel = createElement('span', {className: 'label'});append(spanLabel, divEbene);
	spanFeld = createElement('span', {});append(spanFeld, divEbene);
	spanLabel.innerHTML = lang["autoTourRadius"];
	var cordsRadiusInput = createElement('input', {type: 'text', id: "markerRadius", maxlength: "4", style:"width:50px;margin-right:5px"});append(cordsRadiusInput,spanFeld);
	var coordsSelect = createElement('select', {id: "markerRadiusUnit"});append(coordsSelect, spanFeld);
	var coordsSelectElement = createElement("option", {selected:"selected", value: "km"});append(coordsSelectElement, coordsSelect);
	coordsSelectElement.innerHTML = lang["kilometer"];
	coordsSelectElement = createElement("option", {value: "sm"});append(coordsSelectElement, coordsSelect);
	coordsSelectElement.innerHTML = lang["mile"];
	append(divEbene, coordsDiv);



	divEbene = createElement('div', {className: 'submit'});
	var useButton = createElement('button');append(useButton,divEbene);
	useButton.innerHTML = lang["autoTourRefresh"];
	useButton.addEventListener('click',getMarkerCoord() ,false);
	append(divEbene, coordsDiv);

	return coordsDiv;
}

function getMapPreviewTab(){
	var coordsDiv = createElement('div');
	coordsDiv.id = 'coordsDiv';
	coordsDiv.align = "left";

	var cordsInputLat = createElement('input', {type: 'hidden', id: "coordsDivLat"});
	coordsDiv.appendChild(cordsInputLat);

	var cordsInputLon = createElement('input', {type: 'hidden', id: "coordsDivLon"});
	coordsDiv.appendChild(cordsInputLon);

	var cordsInputRadius = createElement('input', {type: 'hidden', id: "coordsDivRadius"});
	coordsDiv.appendChild(cordsInputRadius);

	var coordsLabel = createElement('div');append(coordsLabel, coordsDiv);
	coordsLabel.innerHTML = lang["markerCoordinate"]+": <b id='markerCoordsPreview'>???</b>&nbsp;&nbsp;&nbsp;"+lang["autoTourRadius"]+": <b id='markerRadiusPreview'>???km</b>"

		// previewMap	
		var staticGMap = createElement('div');
	staticGMap.id = 'staticGMap';

	staticGMap.style.border = '2px solid gray';
	staticGMap.style.backgroundImage = "url("+previewImage+")";
	staticGMap.style.backgroundPosition = "center";
	staticGMap.style.backgroundRepeat = "no-repeat";

	staticGMap.style.height = '200px';
	staticGMap.style.width = '400px';
	//~ staticGMap.style.marginBottom = '10px';
	staticGMap.style.backgroundRepeat = 'no-repeat';

	coordsDiv.appendChild(staticGMap);

	var cacheCountLabel = createElement('div');append(cacheCountLabel, coordsDiv);
	cacheCountLabel.innerHTML = lang["autoTourCacheCounts"]+"<b id='markerCountPreview'>???</b>"
		var tourDurationLabel = createElement('div');append(tourDurationLabel, coordsDiv);
	tourDurationLabel.innerHTML = lang['autoTourDuration']+"<b id='markerDurationMin'>???</b>min<b id='markerDurationSec'>???</b>sec"

		return coordsDiv;
}

function getLocateMeButton(){
	var button = createElement('button',{style:"margin-left:10px"});
	button.innerHTML = "<img id='locateImage' src='"+locateMeImage+"'><span style='vertical-align:top;margin-left:3px;color:#F6A828;font-weight:bold'>Locate Me</span>";

	button.addEventListener('click',
			function(){

			if(navigator.geolocation){
			dojo.byId('locateImage').src = "http://madd.in/ajax-loader3.gif";
			navigator.geolocation.getCurrentPosition(
				function(position){
				dojo.byId('locateImage').src = locateMeImage;
				var latitude = position.coords.latitude;
				var longitude = position.coords.longitude;

				dojo.query("input[id='markerCoords']")[0].value = latitude +' '+longitude;
				dojo.query("input[id='markerRadius']")[0].value = 1;
				getMarkerCoord()();
				},

				function(error){
				dojo.byId('locateImage').src = locateMeImage;
				log('Unable to get current location: ' + error);
				}, {timeout:10000});
			} else {
				alert("Firefox 3.5? Please update to use this!");
			}


			},false);



	return button;
}

function getAutoTourSubmit(){
	var queryFilterDiv = document.createElement('div');
	var getCachesButton = createElement('button');append(getCachesButton, queryFilterDiv);
	getCachesButton.id="startQuery";
	getCachesButton.innerHTML = "<img src ='"+startAutoTourImage+"'>";
	getCachesButton.style.marginTop = "15px";
	getCachesButton.style.opacity = "0.4";
	getCachesButton.disabled = "disabled";

	getCachesButton.addEventListener('click',
			startAutoTour,false);


	return queryFilterDiv;

}

function CalcPrjWP(lat,lon, dist, angle)
{  
	//~ B1 = parseFloat(NorthGrad.replace(/,/, ".")) + parseFloat(NorthMin.replace(/,/, ".")) / 60;
	//~ L1 = parseFloat(EastGrad.replace(/,/, ".")) + parseFloat(EastMin.replace(/,/, ".")) / 60;
	//~ Dist = parseFloat(Distance.replace(/,/, "."));
	//~ Angle = parseFloat(DirAngle.replace(/,/, "."));
	var B1 = parseFloat(lat);
	var L1 = parseFloat(lon);
	var Dist = parseFloat(dist);
	var Angle = parseFloat(angle);

	while (Angle > 360) {
		Angle = Angle - 360;
	}
	while (Angle < 0) {
		Angle = Angle + 360;
	}

	//var c = Dist / 6371.0; // KM
	var c = Dist /  3958.75587; // miles
	if (B1 >= 0) {
		var a = (90 - B1) * Math.PI / 180
	} else {
		var a = B1 * Math.PI / 180;
	}
	var q = (360 - Angle) * Math.PI / 180;
	var b = Math.acos(Math.cos(q) * Math.sin(a) * Math.sin(c) + Math.cos(a) * Math.cos(c));
	var  B2 = 90 - (b * 180 / Math.PI);
	if (B2 > 90) {
		B2 = B2 - 180; //Suedhalbkugel
	}
	if ((a + b) == 0) {
		var g = 0; //Nenner unendlich
	} else {
		var g = Math.acos( (Math.cos(c) - Math.cos(a) * Math.cos(b)) / (Math.sin(a) * Math.sin(b)) );
	}
	if (Angle <= 180) {
		var g = (-1) * g;
	}
	var L2 = (L1 - g * 180 / Math.PI);

	return [Math.round(B2 * 100000) / 100000,Math.round(L2 * 100000) / 100000];
}

function updateAutoTourMap(lat,lon){

	//~ var meterMiles = dojo.query("select[id='markerRadiusUnit'] > option[selected='selected']")[0].value;


	var radiusOrg = dojo.query("input[id='markerRadius']")[0].value;
	if(isNaN(radiusOrg) || radiusOrg == "")// please break if radius is no number
		return;


	var meterMiles = dojo.query("select[id='markerRadiusUnit']")[0].selectedIndex;
	// meter: meterMiles == 0		miles: meterMiles == 1
	var radiusMiles = (meterMiles==1)?parseFloat(radiusOrg):parseFloat(radiusOrg)*0.621371;

	if(radiusMiles == "")
		return;

	var apiKey = "ABQIAAAAKUykc2Tomn0DYkEZVrVaaRSNBTQkd3ybMgPO53QyT8hP9fzjBxSrEmDQGeGO-AZdQ4ogAvc8mRcV-g";

	var path = "path=fillcolor:0xF6A8287F|color:0xF6A828FF|"
		for(var i = 1; i<=361;i = i+15){


			var waypoint = CalcPrjWP(lat,lon,radiusMiles,i);
			debug("WPT PRJ lat:"+lat+" lon:"+lon+" radius:"+radiusMiles+"Miles i:"+i);
			debug("WPT PRJ "+waypoint[0]+","+waypoint[1]);
			debug("");

			path += waypoint[0]+","+waypoint[1];

			if(i != 361)
				path += "|";

		}
	var staticGMap = dojo.query('div[id="staticGMap"]')[0];
	staticGMap.style.backgroundImage = 'url(http://maps.google.com/maps/api/staticmap?'+path+'&size=400x200&sensor=false&key='+apiKey+')';

	var latArray = Dec2DM(lat);
	var lonArray = Dec2DM(lon);

	var latOrigin = (latArray[0]<0)?"S":"N";
	var lonOrigin = (lonArray[0]<0)?"W":"E";

	latArray[0] = (latArray[0]<0)?latArray[0]*(-1):latArray[0];
	lonArray[0] = (lonArray[0]<0)?lonArray[0]*(-1):lonArray[0];


	dojo.query('b[id="markerCoordsPreview"]')[0].innerHTML = latOrigin+""+latArray[0]+"° "+latArray[1]+" ";
	dojo.query('b[id="markerCoordsPreview"]')[0].innerHTML += lonOrigin+""+lonArray[0]+"° "+lonArray[1];
	dojo.query('b[id="markerRadiusPreview"]')[0].innerHTML = radiusOrg+""+((meterMiles==1)?"mi":"km");

	dojo.animateProperty(
					{
	node: "markerCoordsPreview",duration: 1000,
	properties: {
	//~ color:         { start: "black", end: "white" },
	backgroundColor:   { start: "#FFE000", end: "#EEEEEE" }
	}
	}).play();
	dojo.animateProperty(
			{
	node: "markerRadiusPreview",duration: 1000,
	properties: {
	//~ color:         { start: "black", end: "white" },
	backgroundColor:   { start: "#FFE000", end: "#EEEEEE" }
	}
	}).play();

	// get how many caches are in this area

	loadingTime1 = new Date();


	log("url: http://www.geocaching.com/seek/nearest.aspx?lat="+lat+"&lng="+lon+"&dist="+radiusMiles);
		GM_xmlhttpRequest({
		method: 'GET',
		url: "http://www.geocaching.com/seek/nearest.aspx?lat="+lat+"&lng="+lon+"&dist="+radiusMiles,
		onload: function(responseDetails) {
			var dummyDiv = createElement('div');
			dummyDiv.innerHTML = responseDetails.responseText;

			//~ var pagesSpan = dojo.query("div[class='widget-pagebuilder']> table > tbody > tr > td > span",dummyDiv)[0];
			//~ <td class="PageBuilderWidget"><span>Total Records: <b>
			
			var pagesSpan = dojo.query("td[class='PageBuilderWidget']",dummyDiv)[0];
			
			if(pagesSpan){
				dojo.query("b[id='markerCountPreview']")[0].innerHTML = pagesSpan.getElementsByTagName('b')[0].innerHTML;

				dojo.animateProperty({
					node: "markerCountPreview",duration: 1000,
					properties: {backgroundColor:   { start: "#FFE000", end: "#EEEEEE" }}
				}).play();


				var miliseconds = new Date() - loadingTime1;
				var seconds = Math.floor((miliseconds * parseFloat(pagesSpan.getElementsByTagName('b')[2].innerHTML) )/1000);
				seconds = seconds + parseFloat(pagesSpan.getElementsByTagName('b')[2].innerHTML) * 2;
				var secondsMod = seconds % 60;
				var minutes = (seconds - secondsMod) /60;

				dojo.query("b[id='markerDurationMin']")[0].innerHTML = minutes;
				dojo.query("b[id='markerDurationSec']")[0].innerHTML = secondsMod;
			} else {
				dojo.query("b[id='markerCountPreview']")[0].innerHTML = 0;

				dojo.animateProperty({
					node: "markerCountPreview",duration: 2000,
					properties: {backgroundColor:{ start: "#FF0005", end: "#EEEEEE" }}
				}).play();


				dojo.query("b[id='markerDurationMin']")[0].innerHTML = 0;
				dojo.query("b[id='markerDurationSec']")[0].innerHTML = 0;
			}
		}
	});



	// last, save the values
	dojo.query('input[id="coordsDivLat"]')[0].value = lat;
	dojo.query('input[id="coordsDivLon"]')[0].value = lon;
	dojo.query('input[id="coordsDivRadius"]')[0].value = radiusMiles;
	dojo.query('b[id="markerCountPreview"]')[0].innerHTML = "<img src='http://madd.in/ajax-loader3.gif'>";
	dojo.query("b[id='markerDurationMin']")[0].innerHTML = "<img src='http://madd.in/ajax-loader3.gif'>";
	dojo.query("b[id='markerDurationSec']")[0].innerHTML = "<img src='http://madd.in/ajax-loader3.gif'>";



	// enable the startQuery button
	var startQuery = dojo.query('button[id="startQuery"]')[0];
	startQuery.removeAttribute('disabled');
	startQuery.style.opacity = "1";
}
// init the whole script - started with dojo
initDojo();

// check for updates
update();



