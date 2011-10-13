// ==UserScript==
// @name           GC Tour
// @namespace      madd.in
// @version        2.1
// @build		   11277
// @description    Cachetour planing made easy. Pick some Caches, sort the list and print it out. Free for all users of geocaching.com! 
// @include        http://www.geocaching.com/*
// @include			http://gctour-spot.appspot.com*#gui
// @include        https://www.geocaching.com/*
// @copyright      2008, 2009, 2010, 2011 Martin Georgi
// @author         madd.in
// @icon		   http://www.madd.in/geocaching/gm/gctourextension/icon.png
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// ==/UserScript==

/*****************************************************************************
 * Copyright (C) 2008, 2009, 2010, 2011 Martin Georgi
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
 * version 2.1.11277
 * 		- FIXED: autoTour
 * 		- FIXED: GCTour on the search page
 * 		- FIXED: Logs in printout
 * 		- FIXED: Logs in GPX
 * 		- UPDATED: french translation
 * 		- GPX: New Groundspeak implementation to prevent XML errors
 *		- NEW: Titlepage in the printview now contains coordinates and basic informations
 *		- NEW: printview contains now the PM cache note!
 * 		- NEW: delete button for current tour
 * 		- NEW: "Last4Logs" (L4L) has been added to the printout - similar to http://www.gsak.net/help/hs11980.htm
 * 
 * version 2.0.11239
 * 		- FIXED: GPX bug 
 * 
 * version 2.0.11206
 * 		- FIXED: GPX bug after gc.com update
 * 		- FIXED: Printview after gc.com update
 * 
 * version 2.0.11158
 * 		- FIXED: scrollbar bug Firefox 3.6
 * 		- FIXED: "Search For Geocaches" page in Firefox 3.6
 * 		- FIXED: Bug with new GCComment version
 * 		- FIXED: bug in popup after uploading an tour
 * 		- UPDATED: french translation
 * version 2.0.11158
 * 		- FIXED: Event-Cache bug
 * 		- FIXED: Printout need some work
 * 		- FIXED: Update dialog bug
 * 		- FIXED: autoTour dialog
 * 		- FIXED: Layout modifications from gc.com
 * 		- FIXED: autoTour find now earthcaches
 * 		- FIXED: own waypoints coordinates were sometimes wrong rounded
 * 		- GPX: Logs does now have an unique id
 * 		- GPX: Archived/Unavailable geocaches are marked so
 * 		- MAP: Tweak code on the map site. The use of the map will now be much faster.
 * 		- NEW: Coordinates of geocaches can now be moved.
 * 		- NEW: Added a dialog to send me a message.
 * 		- NEW: Geocaches can now printed directly from their detailspage
 * 		- NEW: Tour upload has been completöy redesigned
 * 		- NEW: Support for the new beta Maps
 * 		- NEW: Dutch translation (thanks to searchjaunt)
 * 		- NEW: Portuguese translation (thanks to Ruben)
 * 		- NEW: French translation (thanks to flashmoon)
 * 		- NEW: Added support for all GC.com date formats
 * 		- NEW: GCComment print view implementation
 * 		- ... and much more i already forgot
 * 
 *
 * version 1.97.11033
 * 		- FIXED: gccom layout change.
 * 
 * version 1.97.10361
 * 		- FIXED: autotour with new OCR program
 * 		- FIXED: GPX/Print now contains correct hidden date
 * 		- FIXED: geocaches lists now are shown correctly again
 * 		- NEW: Google-Appengine program to decode D/T/Size images
 * 
 * version 1.97.10356
 * 		- FIXED: GCTour is now working after gc.com update #2
 *
 * version 1.97.10313
 * 		- FIXED: GCTour is now working after gc.com update
 * 
 * version 1.97
 *		- GPX: add <groundspeak:name> to GPX
 *      - GPX: Additional Waypoints now named - Waypoint.Prefix + (GCID without leading GC)
 *      - GPX: changed Groundspeak "Multi-Cache" to "Multi-cache"
 *      - GPX: fixed earthcache type
 *      - GPX: changed log id to a usable value - Issue3
 *      - GPX: added attributes to Groundspeak GPX
 *		- FIXED: caches can remain in watchlist without error  
 *		- FIXED: that a tour remains in list after deleting
 *		- FIXED: autoTour is working after update 7/28/10
 *		- FIXED: superscript text is now shown correct in printview
 *      - NEW: Bookmark Lists now have "add to tour" buttons
 *      - NEW: Tour can now sorted via drag n' drop
 * 		- NEW: Add check on Firefox >= 3.5
 *		- NEW: Minimal-printview containing cacheheader, hint and spoiler images
 *		- NEW: Recode the complete update routine
 *		- NEW: Add check whether the script is still logged on when scraping data
 *		- CHANGED: Renew the buttons
 *      - MISC: Code Review
 * 		- MISC: Create repository at http://code.google.com/p/gctour/
 *		- MISC: Start implementing http://gctour-spot.appspot.com/
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
const version="2.1" // will be checked once the day 
const build="11277" // will be checked once the day 
const scriptId = 'gctour'; 
const DEBUG_MODE = false;
//~ const API_HOST = 'http://localhost:8888/api';
//~ const GCTOUR_HOST = 'http://localhost:8888';
const API_HOST = 'http://gctour-spot.appspot.com/api'; 
const GCTOUR_HOST = 'http://gctour-spot.appspot.com';


var tours,
    currentTour,
    userName,
    lang,lang_ger,lang_eng,languages, // the language file
    dojoPath = "http://o.aolcdn.com/dojo/1.6",
    head = document.getElementsByTagName('head')[0],
    dojo,
    wptArray, attributes_array,
    rot13array,
    timeout,
    sticky = GM_getValue('sticky',false);


wptArray = [
	{wptTypeId: "2",     hash: "32bc9333-5e52-4957-b0f6-5a2c8fc7b257", name: "Traditional Cache"   },
	{wptTypeId: "3",     hash: "a5f6d0ad-d2f2-4011-8c14-940a9ebf3c74", name: "Multi-cache"         },
	{wptTypeId: "8",     hash: "40861821-1835-4e11-b666-8d41064d03fe", name: "Unknown Cache"       },
	{wptTypeId: "5",     hash: "4bdd8fb2-d7bc-453f-a9c5-968563b15d24", name: "Letterbox Hybrid"    },
	{wptTypeId: "11",    hash: "31d2ae3c-c358-4b5f-8dcd-2185bf472d3d", name: "Webcam Cache"        },
	{wptTypeId: "4",     hash: "294d4360-ac86-4c83-84dd-8113ef678d7e", name: "Virtual  Cache"      },
	{wptTypeId: "1858",  hash: "0544fa55-772d-4e5c-96a9-36a51ebcf5c9", name: "Wherigo Cache"       },
	{wptTypeId: "137",   hash: "c66f5cf3-9523-4549-b8dd-759cd2f18db8", name: "Earthcache"		   },
	{wptTypeId: "6",     hash: "69eb8534-b718-4b35-ae3c-a856a55b0874", name: "Event Cache"         },
	{wptTypeId: "13",    hash: "57150806-bc1a-42d6-9cf0-538d171a2d22", name: "Cache In Trash Out Event"	},
    {wptTypeId: "3653",  hash: "3ea6533d-bb52-42fe-b2d2-79a3424d4728", name: "Lost and Found Event Cache"	},
	{wptTypeId: "453",   hash: "69eb8535-b718-4b35-ae3c-a856a55b0874", name: "Mega-Event Cache"	}
];	


attributes_array = new Array(
	// Attribute array ID, image, name
	new Array('1','dogs','Dogs'),
	new Array('2','fee','Access or parking fee'),
	new Array('3','rappelling','Climbing gear'),
	new Array('4','boat','Boat'),
	new Array('5','scuba','Scuba gear'),
	new Array('6','kids','Recommended for kids'),
	new Array('7','onehour','Takes less than an hour'),
	new Array('8','scenic','Scenic view'),
	new Array('9','hiking','Significant hike'),
	new Array('10','climbing','Difficult climbing'),
	new Array('11','wading','May require wading'),
	new Array('12','swimming','May require swimming'),
	new Array('13','available','Available at all times'),
	new Array('14','night','Recommended at night'),
	new Array('15','winter','Available during winter'),
	new Array('17','poisonoak','Poison plants'),
	new Array('18','snakes','Snakes'),
	new Array('19','ticks','Ticks'),
	new Array('20','mine','Abandoned mines'),
	new Array('21','cliff','Cliff / falling rocks'),
	new Array('22','hunting','Hunting'),
	new Array('23','danger','Dangerous area'),
	new Array('24','wheelchair','Wheelchair accessible'),
	new Array('25','parking','Parking available'),
	new Array('26','public','Public transportation'),
	new Array('27','water','Drinking water nearby'),
	new Array('28','restrooms','Public restrooms nearby'),
	new Array('29','phone','Telephone nearby'),
	new Array('30','picnic','Picnic tables nearby'),
	new Array('31','camping','Camping available'),
	new Array('32','bicycles','Bicycles'),
	new Array('33','motorcycles','Motorcycles'),
	new Array('34','quads','Quads'),
	new Array('35','jeeps','Off-road vehicles'),
	new Array('36','snowmobiles','Snowmobiles'),
	new Array('37','horses','Horses'),
	new Array('38','campfires','Campfires'),
	new Array('39','thorn','Thorns'),
	new Array('40','stealth','Stealth required'),
	new Array('41','stroller','Stroller accessible'),
	new Array('42','firstaid','Needs maintenance'),
	new Array('43','cow','Watch for livestock'),
	new Array('44','flashlight','Flashlight required'),
	new Array('45','landf','Lost and Found Tour'),
	new Array('47','field_puzzle','Field Puzzle'),
	new Array('48','UV','UV Light required'),
	new Array('49','snowshoes','Snowshoes'),
	new Array('50','skiis','Cross Country Skis'),
	new Array('51','tools','Special Tool required'),
	new Array('52','nightcache','Night Cache'),
	new Array('53','parkngrab','Park and grab'),
	new Array('54','abandonedbuilding','Abandoned structure'),
	new Array('55','hike_short','Short hike'),
	new Array('56','hike_med','Medium Hike'),
	new Array('57','hike_long','Long Hike'),
	new Array('58','fuel','Fuel nearby'),
	new Array('59','food','Food nearby')
);
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
			
sendMessageImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKLSURBVDiNfZPNbxNXFMV%2Fd2bMjDtYiZMYJRhivgoxiRtACV8SXXRLhdQdUrsICzb9D5DYVwWxqopYtkLdFLGBVt1WbVWh7mhiywgFMFEkKLKdEI8%2F5uPdLpwEVTE90tu8d9%2B595zznqgqg9BqncqJRCcskmlgHEbVUK84sf2nO7S4vFUngwiC4KMSxlwU0QNgJrq16iUAt1D8TdA1FetH3y%2F%2FAODs7Dw7I8bkxTJvgdlurXo2e7yDiEejLB97halVUd0TbMyk%2FMzSd%2F%2BZoNmcG3JTncvdWuXO1t7Q1F9q2%2FMCoLqmzUpWts52FYolVHV7tVrTJ%2BpLaBz%2B%2FMyY0Oj%2FIImfhPUl7smNWzc%2BtYW7URwNFyZXye99zfTIfbLHI0R2KNxGoyxE2flHjkmi7xeuXB3OjeUIw19Q85hg%2BT5h7zq73K8QkR2Xk6TSN7vjzVnGmBHPdXn40wNsywdsvAOfEyx%2FjZrmwO7r1WncQokg8BzLsiw%2B8H0OHTrMr78vYVkZRDL9jK3MeyUIWV79k8MCEBH25fPkxk7yePEltjXeL5IUqh0aZaFRFkzy5h2BTPCilt98Bwq2Y7M3f4SVlZNUqn9QnLpGo9zX7xVKQMRadQ8A7uSXWM4nNBpP%2BgSqSpzE9LodOt1xDk5%2Bxt%2BL99jtf4HrbuDUOwwP%2BcRjR0mlRuhF53DTl4CbmwQo7aBFc73J%2BTMXaLcDPG8%2FIk%2Bx5DnQwLY9RvwPefrMJZ0%2BQmbTnj6BUZLEMFOc5e3GOiZJQLIop0l0vh9dDL0IisdGeV5bRtX0CZyUU0%2BSeHT%2FvgJRFJL20ttG7fxmShj2OFg4TLvTxkk5dccYWfj29jd34yQefm9mA%2BDYzppBFv4FO4Au%2FTAT%2FmYAAAAASUVORK5CYII%3D';			
			
mapImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9sBEQ0rMteXYLwAAAKiSURBVDjLlZPLaxRBEIe%2F3Z11N%2FvMxpFoXgfRQDBCRGIEEQQfIOJBEERRFG8eQvCg%2FgMiHjzpQcQHBvTiTRAVMSpqVAxEgxoMxmiMT5KY7EzPTM9Mz4yHmCwqItalmh%2FFr7%2FqroqtWrsqam5dipZI8L8xOPAarbl1KedOnftnsaOcP7TOg51oszfHgsuIW88o9diMH2kim88xNPSIQXGWrxMG2Vyeb5MGCS2JYUn2bYlIaSnis25GeZJyq4YhBPaNQYT4gmkKYm4%2Fjm1gCRPPETiOQElrjkKbPRSK84kin0yXDsf6SW3Xqa2rI%2BO%2FxVHN5Et50sk4WnIewpYkEhKgQlCe%2Fo6wppnSFUZJ4VwZhiAksh%2FguwJpOfiujSOm8Vz7T4Jidf3PXINxQFI6PYlat4iU7tLkTpDMN5LWYiRTSUzLA4wZgkRsxkNKF0vYGOVJzGzAVDPI7pGZIu86115s5fbIFqQQhF7lDeZaqKqqRq%2FWKRQbyOcWkNzTRtWoRtqrpV7%2FhKs8GvQWrg5vpq3%2BPMl4%2FNcWzLKFISQ6U%2FR9%2BsrNV31EGxTe42G8QFFXWkLLog5MaXG4p5uTO3b%2B9gvVCzGUy2Nh895No0KPja17CaKQIAwIifg8PcbyxjUIz2HPxQ7a2F0xeDL2jr6PQxRyGSxbIJVHEIWMTrzBDxUq9PEDH8M1aWtci%2FBt7skLMwaOchgPfLKpLKV0AS%2BjkEqiAkVtsQkVBARRyJfyB2pyC%2Bkf66V3uJf1xv4KQZ4CTsomEWXJxFwc5dL96ARe6CGVz2K9hdWLN9E3%2BpCe1%2Ffp6XrO8aMn0YJIAdBQs5KGmsqidCzZ9svi7DrTTixexdORAe4cGpjTY%2B1r2qNlK1qYnYe%2Fxd3iJfwwYJO5d057%2BewFPwAsnUE8ZPBqbQAAAABJRU5ErkJggg%3D%3D';		
			
addToTourImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAAAd0SU1FB9kFFAUXKNiDRngAAAJmSURBVDjLjZPPS1RRFMc%2F972n1qiUpqMRaj8UXPVj46Igw0WrKIKkwEWSCC4jjKLoX5BoU5GUJg6KFrVpFYiBEAouAkH0Of4endHRKSSY53v3tHgzbyxddFb3Xu753O%2F3nHMVwOBw5LpSvBQtFQIggpAJkV1lGCOe53a13Ln7lYNicKg%2FtrWdlIMinU7LenxNPn4e%2Ft0%2F8P7Jv7kGgOu6x48eKWEzmWA9ESMWX2FlbYml1XnimzF%2BplLcuHbzcEW48mlfpOfxPoAWQRBcz2XWnsWetbFtmzl7jpmZWaILUQzD4MrlplBB%2FqFn73q7G7MAC0C0BgHPc6mprvaBotGiEa1ZXl7hw6ch8q0Czp09H%2Fo%2BPtYJjAYArTUArreLbUcR0YgIon2QJ5q8vDzCleUopXB33atv3r6y2u91uFbWgg%2FQVFdXAeIDBH5cbMTZ2AQgXV5GQzzB6LcRU0RbgJuzkGnfQnQeUf4awNnY5FJbGyjFWHc3%2FoMa0cI%2BC0opTp05jVIqqPJGVqEEk4FoHajOAPyNaZoszi%2BSuHUbN7nlXwiFfIVKkVdYSMQwKAJTGcYiUGFlJfkAi9q6WmLJLRpaW4MXdUbRhebm4Gy8pyf8dxsVWIaJPb8AwK%2BpKf4nAgsKMAyTuro61sNhpicmAMgvKuJkfT0AC9PTODs7mRE0EmjNHgsK0zQBaJqeyhRS8aXkWFAwZ2eHFtE8f9HliUgN9x%2F6AMu0Vre2kydKS8vI1T%2B30ns6kEqlsCwznk476cCC4zjtA4OR147jVOV%2BsZ9UXlxMdHLSBxUX09vXs%2BJ5bkfng0cC8AdIoVh%2Ffv3rlAAAAABJRU5ErkJggg%3D%3D';

autoTourImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAFMAIwADJfKnZwAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9kKEg8hB1Dip48AAAJvSURBVDjLjdNLSFVBHMfx73%2FOued4r14wpSLQNj0JokUtFIKCgqIXPQgikqSijUrqoqA21lIkywoiCAqyRUZRFBGFoIEkFdHGoPcLF75S79Nz7sy0UK6kIf03s5j%2FfGZ%2BzIwwR7UecLYrl91a0yOiuxpu82Vmj8wFXDzopPedeRrtf98V9r24lRsf%2BpkRpbpzob43tlK3NzVhBODK0ZILYSZRa612ZiI1NzMEqRGUDciO%2FmDwUw8f3z7na9%2BLz3U3s0tdgCAzXlfV%2Bk3F4vPwPD%2B%2F%2BFKVB0B65DvhyAeYGKE4HqNy23E%2BvutcAuACYI1y%2FRjZbIZsNjOdTzlYnaMgXoprFhEMjRIM90GYAGuZBgCbHsCEKbBmatKwbN0ueu%2BcpGxFJb5fgHKL8OML0clf%2BU3yAAMvMalB%2FPmriC1aizgRNh1upvPaETrfPCOdGsOGKUoXLGbL9j0UFcWBsWlATyTo%2F9DL4KtuhpPwO4gxmnWpPtTAhtIyQAhTAwTj%2FSCQTCZmRLCa4iKX4rjHcnEQ16Oh%2FjqvO9r%2FupXmlmpiC1fPjqBzOYJsCqNDrMlhTI6zp9ajdci5ll5On1iD0SFDX3ooceOzAQuIAjGKx9eeA7D12EYcNfnWnIiP47oYrXFcfzagRCGiUI6ws2YHVmseXX3CtuObAYh4UazRWNf8G0AEpSIYDA%2Fb7k03RKKTo1%2BItQZrNK4XnQ2ICCKKB2132duwHwvcb%2B3A8QsmT%2BAXIlNRI35sBiBickFaxcorOHS%2BgluNjfmGwrJKoIPC8sopQNBhGkRM%2FjdeqY5eCIOg1lrr8B8lIjrieZdrbmTq%2FwA8AAC7ufHXbAAAAABJRU5ErkJggg%3D%3D';
mapToAutoTour = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAeCAYAAADTsBuJAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAExgAABMYBQzIXCgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAA1rSURBVGiB7Zp5lFT1lcc%2F9%2Fdevdp6q%2B4GekGWRhYbg6IYCBqJo4i44IwBVBSPxkCjTkbHMzOZjMlxOjNzJqPRURmNoMQcF1yYk8kxGeMSd0QQjIqgLAo0SyM00NB7d9X73fnjVRfVbTXKYpyj%2BZ7zTr3ffn%2F3vt%2FdfiWqypHi6X86bl9jU8fSLa17Zt76kHYc8URfY5ijGdxv4MjY%2Bd%2B77cLhA6rX3jFLRh0ror5OOCwB1NaKqZ0pXndZ%2FC4Tsu0y5ZKaqlMmXrxswdzS6489iV9tuJ%2FV4e7ZMjLkFV0YjRVOP3XQeVWtQ9c3AcMBsF2qfhdd%2BzZSfcKoRFnl0DsXXVd%2BQefeTy69%2Filt%2BaKJ%2FyrgUwKYf6UMFDc2JRJLXJaXKB81burfxo8bdUZRUf8hEooW8tL9l2aMhvWtqigiQqq1gbho%2BOwLZk5989Vn1tw127vkpke6%2Fvin3c5BiIgBilV1z5dFw%2BeBZBvhB68re6B44Il%2FWVI1IVE2uNqJxIpAFQVc1yVW2J8Vj3y%2Fs6Gxc4%2FjiFaVRctGTrzcTe7fjJ%2FsINXVTirVgarDmjVrGj%2FeuHbCzU%2Fohi9lYyJFwC9U9fIvY%2F3Pi8wJmH%2B%2BhBPVw6cOGnN%2B6bpN9exqWkc4EscLR%2FHCEaKxGOUSo6ioODzsWxdXFhXE2f7WIlRcjBvG%2Bl2IcRAMNtXGiOHHJ3btqr8W%2BGHvRUXkBGATMAn4WFU%2FFpGzgKSqLu3V9xtAGbAUGK6qq0VkDLAdmAisVtWtvcbkAWcA%2FUXkNFVdma4fDFSq6rJjx8KjQ8YIayJ89pARYws%2B2bUT1wHPFbyQIew5hMMeYc%2FDcR38rmY6m7bS1bSV0iGnUffWYppbWnGipYgxwSMORjsJh9xpfax7C7AI6A%2FMF5HFwDTgVBF5HEBEEiLyG%2BAi4BvA48D89PglwKMEgrleRB7sNb8HDALiQKUE%2BCUwFzhJRP5HRI4%2FevYdPTInIJof%2F35Z5ZD8uvUHiMXi5Id9wmGLFxG8iCEaDeGFHEyqDduykyQRHGMoHTSGtsY66rYsp2jgaYQdxZouRITyivIBd8%2BSATcu1l051r5bVVeKyHvAXao6C0BEqkWkHJgOLFLV36brVwL%2FlR5bCUxU1b3ptr8TkUmq%2BiqAqu5LC%2FXbqvobEZkMvKuq96T7LyUQxj98ATw9LAQnQERcxxnbkVRcx%2BC4EdQrxomX4eVXgAitu99nxxv34RPGiRQRySsmmh88JYPGUDrsTPbu%2BJCdDY2kJA8xDhUDygtD4dh3%2B1h7U%2Fp3M1CfVb8NqABOB17Pql8JdKXfP%2BxmfhqvAd85xD7PBN7IKq8BRh%2Bi%2F58MLsB%2FzuK0EwZWFTTs78JxPaxN0tawgdYt29HWHdhkB0mTTzi%2FH4mikWiqHU2C2qwwwk%2FiFg1j375GdjRsIy8%2FweAExguHZwP3HQFtjwPXAneky5cTqBaAk0VktKquTZevAO49xFyPEXzxb6fL5wJ%2FOAKajjlcgLx40ayqquHFO%2FfvpsDvwvg%2BGAP5CSjsjxgH14sQj%2BWRlxcnFovhxeMYMYAP1iccbaMg1IIbLSHW2kxrcxPEBlBc3H9Iba2YW29Ve5i0%2FQ74qYg8SaDL64BuVbYS%2BHcRaQcUWKrat7elqutEZEtaLSWBZuAnh0nPFwIXwBgpi4ZdqgY4gAfiYETAcRHHQ4yHOB4YD3EMOBab7MCKA4C1KQQlHjHEXZfieBRbLBgxFCaKonyAB2RyRap6ZdZ7CzA7q%2FyvWfTdIiIOEFbVtqz6JlWdJiL5qtqca2Oqup%2Fg1HSX7wHuEZGoqrYfBc%2BOKTJG2KpF1KLWR9WSsj5kYgTFVxBVFEXTsQGqCIqqDR7ro9bH%2BinUphCvgGR76%2BF%2B%2BT2gqj7Q1qt6W7qtJ%2FOvkjhRdgATWKDr%2BpivB%2FOfPkPyO6M8krOvsHDm8%2FrMkdL%2BeZARgIigvo%2Bqj1qLtTbr3Wftig3U7WolFHbxW9vgQDMdrsfoCUM4riwOHBRe929IPFTtkadb%2B4CqzsnZkI%2BQohDF%2Bbxz%2BRE84OJcbaJfvJ3ICEAxWHtQAKoWTXahRli%2FegtN4TwmTxnI2ne2UT1pKDaV4q3ldex4%2FQPejCaYPnUwaLcAAuGBpJ%2F%2Fv4h4tLSkuAYAZT6QB9yO8IERln%2FR62cJQNJfbloAfor6FavJHzmUT1otp5%2BaQNVSt76e46v74znKN8dXsm9wHiue3c6Blk4KYhKcnO7TAxxSAHNlGvDXCGOBZpTluPwYnwsRjuN%2B%2FXvmyBgMC2nkdJ5Sv8f4GpkFTKKR60nwBhm3msXUSDtwdUYVzZOLsdyAcAqBEV6JUjv1GV0L%2FApgyWS5HchTeH7m83rw6xeRJecwB7gMOBHYJMLzkQg%2Fu%2FDpwDY9NVnmCFyB8vSMP%2Bid3UOfOkceEGE48OMPzmBZ9VJeAg4QRPY%2FOOhHiknr8ECFtK3byJY9nbzzdh0nVfdDsGAt5YOK%2Bai%2Bma6OLprq99JU38ikwQ6NLcngBGWEmOaV9KGB5sntCIsRXsFwAcLVGHbj8zpwAcrI9CeSD4xndE5JlqOMZgkW5S407e4qj6DchZP2mmrkbpSHEV7AMgX4HrAPYRVz5a9yExigtlbMknP4HbAAOAvoB4xX5Sft7ax%2B%2FBwZEMicKmCSGkZkjxdhHDBJldLqtQhB%2BuUi4Dag4mA2VAyqPtZarO%2BTrN%2BJFvajqaGFeNhAZyep%2FU1UloRY8%2FYmGsMOO1uVPV1ChZuk44%2B7qDy7LEsNBb%2FkunGbK%2Bcg3IhhPL%2FQd7JaXqNG3iLw2397KMb0QJBRfIIbJI8UDwG%2FZ2E6Rpgn5wHzgHEs0PezRr3MXPkQYSE18joLcmdNT1jKzcD5QKMI%2F6YuD5NkMvDPwHBXWEgfNuQQEIRlKvwoK5IymS%2FYaoqOpFLqKamUz56tu2l8aSX23Q9ZtqmdlBi%2BU5KkPRLhxskJbhiWZEhnM%2B2dyYwnpNZH%2FRQ5bbBwDfBoL%2BYHWKCLgRWHuaG%2BocwGHu3F%2FACVzCeIC87ta7gIVwfTcM%2F05%2FWOGc9ow4wXdLEoN6e7XPTY%2BVJw2GQJP5v5nL6WEYCIk2Ec1rI5WsrY1m2MCHfSLg4PNyZ4s6SKiV4TgwcX8H4jlISV4k92U%2BT47G6z7G1KBS5q%2BrF%2BirTD2hsnEwRTfeG9w93QIXASmomAe%2BJWtWjfaYmF4ySEcgKAwpPZbVrM74EmQNwk1SrpjWomWu9GONfcFt6F7CtJ4wbLAEaEseOrWNTYj6JUG6dt%2F4Cbxkf5i6ooWCXev5CdLcp1xY2U%2Bh2sbIDH6sNU9ovhuF7mMY5BVHNde%2B5CqcjJlABlmbdUOk%2B0m9Ic%2FUbkqOsJpR6hX5%2FtQgLIqX7mrtIksAPA9M41HeBkoAAg5FCHsjmYjhO7u9TWigGG5prb6wqYbQCsqjFOCMRBxAFjcF2H704bjf32t%2Fj5xgj1a3cw6uM1nFHYwaRd6%2FnBsE4KHEtzEpZsNfxo%2BkBCoTBOyMNxw7ihCMZxEEGWvEphr%2FWXIszkGol8irJrpYLszT6gm4HtJBmbYx9n5trcp9aCS6iVT1%2B%2F1sgwYAyHcDcF%2Fjf9euOSKXIqwJLJMgjlX9L1717yrO4UzST7xvz6PCmvrRVT%2FQZXAZ%2FeYxYMgG9xcUI4xoAxGONijItjHCpKYlxx9QRe0AEs2234uAnW77P8ehPUvufwq7owkyocNm9pwRLCdSO4XiAA13goxhxoIT99RRjA5TYghMejXC%2BJTP0cGYjLfwM9o2fhVYSbuErimbp5ciXdd9OHQog7gUJ2sIhrJT9Tf50MAZ5AeZr79c2%2Bhiv8I7AVGIll1ZLJshbYhDIV6LBOYCNmvMiHwF4g7Ptsrl7KRpSHPou8bgE4BoIckNN9ChyM6yImRKJ5PzUnehRWlHDLxiLu2l%2FJc94QuqqGMejMk9gxZBRVoyqIxmI44SiuF8ONxHE8DwySTBGFrOj0Xm3B51yUEnzqqJFXqJHXMWwAXkX5ZQ8qU9wC9CfKNmrkOWrkfZQfovz8MwVwr7bgMAXDUFy2MU9epEaWYVkHbCBJ7qg6jRkv6AFCjJMgO9sJVKebXrZwyqXPamCvVFUs0whUVpjALX0ZeOVQ8wfHUhFVP7jNUkUNGEl7d6Is225ZtbqN8hEDueLiGNWDCzGGwMUUGDX4YM6ILKNrXA%2FXGKzi0jsie1A%2FAs5ijoxBOAVDCljB%2FbqRGhmGIZrVt46%2FkQm0800MJyJsQHkTpRg3yzg20E4JZ2EDfZzBfboekUnUMAbL2CCBxaqMq3qQ2TltxYxntAGYtXCchBJFDO9wqJv9nLb27jf9RV0GDHzybBlmLK0zXtZPckzXgw%2BiqtwxO3%2F%2B9MuuvcExQaNaRcUiNtAEyVSKxqYOSgvDqAUxmvbvFVUfUVD8QB6ablMFo6x6a%2FmBa%2B7eMrGli42qmsy1wa8zXICnlrf8R370kQuKi4ti1oqAIt1yEjBWsaJs0qCc%2BdBFMYCKilXIqPn0IejoTJrVHzUubOmiBeiZRvgzgPQJEJEwUEJw43RU6eNeiBPcAzSm8%2FN%2FRi9k%2FhckIlEgBKSO4fwxgnvcZj2afwF%2FhfF%2F%2BkeeoREnKEoAAAAASUVORK5CYII%3D';

uploadImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9oIGQoqEWpcrzEAAAMVSURBVDjLlZPfa1t1AMU%2F33tvE5pmSZvfSZfWXlNnF7sfsrjqnqq4OUUQRFHZkJWhD4ooDIXpg4gWhPkH%2BCBWHJtPUwYyGSpspdN1raOyYqWlW5N2bZqmTdsk9%2Fbm3vv1ycn65ufxcM55OHAE23jl%2FaE3gTdUTdstwStdtyYlo4qqnD03eOzr7X5xL%2FjBN%2Fs8qvJTd1ci3renk672MD6vl7WqwUyhxPhkgen88g0hxMlzg8f%2BvK%2Fg5fe%2ByrUEmq%2B%2F0L9X7O2OsVY1KN3No%2Flj0NwG9RLt8TCjkwtcGp4sI8ST%2F5ZoAOGw%2F%2BfDh7KiVw%2BxurJEpCNLMJKkbjZYKsyiuRaKY%2FBUTsdxZfjytb%2B%2BBB4HUAY%2B%2FPbTRKwt0J%2FL0KS42JofFEGTpuFp0vB5NeLhHSRjUaKtLeSyO%2BlMhfpeO332BIASCPpOHsh2UFlbobjlI5Z6ACnBlYBQEK7F4mqNH67c4vLwOEGvZHcmBfASgLZZb0Q7E22MTi%2Bjd8dw5X%2FLViurPLYvixACKSULi0VMwyAZDQIcANBMy1a8Xg%2BKP0alauK4Er9XxXEcrGoJISIAvHu%2BH8Pa4Nn4GaLpXQAhAEVVFXe9ZtJizuM38iyX1rhT3OB2cZO5so3VaLBZrbFlW%2ByM9PBd%2Fi1qhgWwCqA1KcrS7fmV1P5MAj2dZK6wwPDMBmOLA0jX5tfzNpZjk2rL0JM8yKZZ48zIE8T4YgxAk45z4ebU%2FNtZPQZAZ7qdwI51fl%2BwePqR13Gki%2BM6uEjuVgr0pg9RtQzGjIGjAOrNqxcuZXLPnxKq6gm2NNHsUflt%2FBYTqxfJxPcztzJNuVaiXC1St6psmBs8GO2lbhvU9xQ%2B1gAqyyvHr9xwv3ddeHRXnB8n1jF9JrZjEw92YDsOjnRZXM8T8if4ozDCyMwIdz5D3PvCcyc%2Bf7VDTw8Fgq2eh%2FUEF%2FMvYloWlmth2g30SA99%2BmHG8tf4Zeoq%2BcEtcd%2BZAFpDXZ4jx08NqV7fM6haKwghpWtLuzH7d%2Bidh3pTBxmdnWDqk7Lg%2F6J%2F5JHp06rcrv8D001PzAwk7SYAAAAASUVORK5CYII%3D';

downloadImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9oIGQorAW7wjhQAAAMSSURBVDjLnZNNaFxlFIaf797v3tvMTOd%2FJjOZ%2FHSGhAyZmh%2FIlEhjSS00gihxoUatQqXqxoWFRkHBlVTcCi5ciBFLXQiiq0oRQw0qpoS0IaFiiyGJSabJOBPNZO783s%2BFaDBLHzibw%2Fs%2BiwNHcIjJ16dfAV7WpexTYCnH2VeKOU3Xrly9fO7jw3nxb%2FGNTwZNXfu6JxlrHenvIpkI4bIsiiWbe%2Bs7zC%2Bvc3dt%2B6YQ4sLVy%2BcW%2FyN46uJHWbe35aeJ0wNioCdKsWSzs7mG9EShJQDlHRKtIeaWN7g2u%2Fw7Qjz8j0QChEKeb86ezIgHUkEK%2BRzhzgy%2BcJxypU5u%2FVekU0Nr2pzJpmg6KnT9hzsfAg8CaC%2B%2B9ek7sWjAezrbjaE5NKQHNIEhJaYhcVmS1tBR4tEIEb%2BbbKadrrbgyLNvXjkPoHl9rgvDmU52i3nuV11E246hFDgKEBrCqbFV2OfLG0tcn53HZyn6utsAngSQe%2BV6pCsWYO7uNqmeKI46uGxpt8CJwQxCCJRSbGzdp2LbxCM%2BgGEAWak1NMsy0TxRdksVmo7CY%2Bk0m01qpR2ECANwa3wczeNh5aVXiXT0AgQBpK5rzh%2F7Fc1d2cQjLbb3w%2BQNk0bToVJoMFivc2t0FO%2FwMPbKCscSEbbtGkABQBqallv5Ld821B0j1RFndX2D2Xt%2FUsPErrn5dmSE9nSaowMDqGoV%2B%2BJrRAyDKdOMTE1MKH3ooSeSpWr9RKY7Qdjvxu%2Fz0hHQmVncou3tp0l1dhI4dYrq5ibuvj48x4%2F%2FPZkMpcVF9IXvvrjWnX3sktB10%2Bc2aDF1fpxfojb1Av3xOIGxMSqrqzTLZRrFIvVCgUaxiBEMsnf7NjpAsm%2FsztauPekgkVLj8%2B%2FX%2BaX%2FcZwbn9Fq27jTaZxKhSPt7UifDyMYBKXYW1g4%2BIVHz7%2F3TGeqY9rr85vpVIxY2ItlGSxNnuVkMol%2FdJTizAxr%2BTxHNA0JeKQ8EAD4g0lz%2FPlL07rlegRd%2BkEIpZzGma%2FelUOJBD%2Fncjy3tCT4P7zf26s%2BSKfV4f1fpUgaHTdq5X0AAAAASUVORK5CYII%3D';

tabBgImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEcAAABWCAYAAACdOoshAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oKAwcSHqDAeZMAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAArElEQVR42u3XMQ5AUBRFwU9ESEgIlmn%2F5bMBt9Ap5ixhutNVVTXpa11V3RjeG1prF4aMc2LIOAeGjLNjyDgbhoyzYsg4C4aMM2PIOBOGjDNiyPtgPEM9Ajhw4MCBAwcOHDiCAwcOHDhw4MCBA0dw4MCBAwcOHDhwBAcOHDhw4MCBAweO4MCBAwcOHDhw4AgOHDhw4MCBAwcOHMGBAwcOHDhw4MARHDhw4MD5TQ9jZAyriwnP2QAAAABJRU5ErkJggg%3D%3D';
					
printerImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9oIGQopDsx58QcAAAHySURBVDjLpZNNaxNRFIafuWYRQRCLoCnTQIsfFAwxGFGQLBVRXPqJQfFHCEqd2iIupK6q7lwIfiVZ6EKrVkRGjQUDlRJQIVqoRd0Ixk7aTGbm3uuqTYbUVPDC4XIOnOe897xc%2BM9jtCb5Qm4IsP6hb%2FjI4aODbdV8IacbjUbHcF1X5ws5vdgTWQ5fKpX%2BOjqdTofyZQGJRKL5RsMI3VrrzgClFOVyGQAhRBsolUqtrMA0TYQQGIbRFisq0Fpj2%2FbSRCEEmUyGkddZ6t4co8cn2m28YA0MAVY0GmXL5q0opULyAZ7PX6W7q5cP3yZJ%2Fsriui7A8KICa9C6iJQS3%2FcBOP9wP1oFeCrAkwHd6zbRH9uF487zsj7K7TNTXL9xzYq0LqlSqRCLxbBtm0B57N12CqkVUkkUmu%2FVWRI9e6h5dQ7ejHOAs80dOI6DW69TrVZJJpM8sj2kVsz8rOCrgED5%2BNJnruGwvSdDzV%2Fg7vSlJkAIwZzjMD7%2BjFqthtvrEsiADWvjBFIiteLH7690rdnI5GyR4uci2VUDYReklOxI7wTg45cct96O4CkPN%2FDpW9%2FP7r59lGbe8OLTK3KHJhh78rgJ8DwP0zSX7LscHwu5cOJBGkOs5t30FE9PvkcpFbLxHnCs0%2Fe7o67gK8npyLnW8v0%2F5Gb7fMJoZowAAAAASUVORK5CYII%3D';		

dialogMaskImage = 'data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%08%00%00%00%08%08%06%00%00%00%C4%0F%BE%8B%00%00%00%01sRGB%00%AE%CE%1C%E9%00%00%00%06bKGD%00%FF%00%FF%00%FF%A0%BD%A7%93%00%00%00%09pHYs%00%00%0E%C4%00%00%0E%C4%01%95%2B%0E%1B%00%00%00%07tIME%07%DB%03%17%0C%03%0F%8C%CB%E4%8C%00%00%00%19tEXtComment%00Created%20with%20GIMPW%81%0E%17%00%00%00%26IDAT%18%D3c%F8%FF%FF%FF%FFMW%3E%FF%C7E3%FC%87%02%98%20%3A%9F%81%A0%09%B8t%C2%00%C3%20p%03%00%DA%B4%F2%A1%8A%CD%18%A3%00%00%00%00IEND%AEB%60%82';
		
saveImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9sDHAwxAVECGvsAAAJVSURBVDjLpZBNS1RRGICfO15HZ1BsphDHclHYLoXA0NBqkdQu6EMNEvoiSDI37SpJaBERbSRCyMrIXT%2FAjLKwUMfEFMMPJL8tU9FRcu54557zthgdKTKIHg6czXue8%2FAap0pP3AoEAjX8hm3bsTuyejm0732dx0wi2Uwm2XRjutzUln8wAMxAIFBz%2FuxF%2FkQkYvH4aX1dxLYpy6vCTDBJMFy0fH4en3EppVheXqIj2E5HsJ2u7k6GhvsZGu5nfHKU4uLD2NrG0Yrx%2BWGUaGzt8LCu9jaAqZTC4%2FGyJc0HgJGgOV165peSB%2FcqcZQiqh2UVtjKwefz3wSqTdu2sawwoaVFAHz%2BNADC4RVy7vhJ8yayJyMXJRpHR9EImb5s3i4%2F4GrjQXE5jhMvWK9YJ6oVOZn5FOw6wrelCaIqykxoitysIjL9O7HsZVxAvGC9Yp3BG0t0jvTSNdGGPyUDl8uNLyWdztEW%2Bqe7qb%2FQY%2Fy1YGCgn8ZjTbwZbOXTZBvpqTto%2F%2FKa3qkgx%2F3VsZ2VlJ2UKxWVPHs1TN%2Bcl82YTy%2BnMLuQwa8fMcaeAJDmXsUE8Hi89M15qb12lIitNlHMcOlFBo9KZgBIdidQdb85JrCscGxkMcLI7MqmFRV5g3SPhlBKk7UtVhsvABBARDAMAxFBBLQISguOEqJKYzsaRwlbU5M2BJYVJttnsfDDZnrBAjHQCGsHERAEkTUxEInqDcH3uVn27i%2BiZyy09ij2uwhoBMEAkXhV%2Fm4%2FzU0v8YUnGowD5%2B6%2BsxK3H%2BIf8UYngq0N1wv4X34Ck8Uv%2BymvOfsAAAAASUVORK5CYII%3D';		
copyImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAATdEVYdFRpdGxlAE9wdGljYWwgRHJpdmU%2BZ7oMAAABg0lEQVQ4jZWSy2oUQRSGv6qucaXuRFwqvorOmB7fIgR0J0iDZCUowoCCFxS84EJ8BS%2BTCT6NqCE7jWZyTtfvonvGMd2LSUFBURTfOf9XJ7x7%2F%2Fa%2B1V4pK0lCEsqZxTlLSHgqisnW5o1tjq9Xb16Y1liPnz60ZYGVncw9AXz78ZUQQrsBAgCSOH%2FuAkdmqVMdSG7eHFJiNp1BCLQEAIZXrwCweNcBmFsLGLBRbhBCJKwAJAFgZv2ABbkoCqafp00EYpNAMLo2agDuvHz9XMfFLjsoYkFZlhSxIMZICLH5hVy3EYytzZv%2FFX%2Fy7FGVVrN9%2FPCJGCMxBsbj681lG8fc2dv%2F3hGbFtlyzgxHwyXA3RBCWTBoOtjd%2FdIRm%2BqcHUhnTp%2FtlbSUCYzLsiM2hRgmt6tbVV3X6Z%2BgpvJiWGIMXLp4mZ2dWUdsZ7Ikce%2FBXUnSr4Of%2Bv3nQPP5ocyO5O4yM83nh5KkO9uVeqfrJGJ7AScR2wtYV2yds%2FcC1hEbAj4YnJr8Bf6RZNsaEpA%2FAAAAAElFTkSuQmCC';		
		
				
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
				
sensGPSImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9oIGQooOW3fZUkAAAFtSURBVDjLrZPLK0RhGMZ%2Fx62UEimSo0wihSxphhXKwsLGdsrextKt2fAnsJGVlX%2FAwqXIIRPCSpHLjEjJdcJ857vYOBhzjhRPfX3f4n1%2Bve%2FT%2B1l8ynx5W%2FxSOfxRQQDzHx38CmJ9L3aTXQDk24tBtf4Az%2Bind5gvIM%2BnMEM%2FgbMAALHxGJG2MACdPZ%2FmwbkO8yIemRnYs34M0TN%2FV1oKqsoa6J%2BuN4EZ5NuLxMZjANzWLWG0RGiJUJLKklqa7Qjx0xX2L7ZYGrq2fEeItIVZ33SQWtDVGEUZjdIKjeHyPkmTHSYlXribWDU7I8LKAnhzD8y2oIzm%2FOYIV0ukdnGVy2P6iRa7nZT7zP2YY%2FKCEo8uJJFKUl5cjVQKZTRXDwlKiyrYTTo4xw5nE1hZGXh331QNr0IgtOBVuoTKGmgNdbOd2GD5cI3EZDozA8%2Fsab63NmM3nicPsHIKiZ%2Fsf5j9dj%2FoEBotMPZwbtb%2FeAM%2Bw7BUpUnjdQAAAABJRU5ErkJggg%3D%3D';
				
downloadGPXImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9oIGQotDqgVNAMAAAG4SURBVDjLlZPPaxNBFMc%2Fs41CD1oMlVp1FUIPBhR6UxCPestucvIiqPtn%2BAOyET2I5yoUAmL%2FgMwS9OTBH%2FGgqHgT%2FAF1QTwYLG01yezsjKeN3TS25J3mveH74715I5rN5qM4ji8xQbiuSxAEAoAwDO2kEYahzcgK2aHb7WKMAUAIMVRzHCenXiwWc%2FmQwBhDu90eXnieRxRFw9z3%2FbHtOKOFSqWC53m7ArcRZLaFEDllKeWOBIXRQgbOCHdzkCPIrI8D15%2FU6Kl1lq%2B%2B%2F38LURQhhEBKmXsJgIFWHJ0tc%2FHBiZ0dSCnxfZ%2F6Yw9rNMpoVKo5fGCB8vxpNvq%2FedFbGk%2BwdZDaKM6fvExqDalJMVi%2Br8Wccs%2ByqXr8uv3Mvr2uRGErWEpJtVql1WrRR5Faw%2BrPTyRGo01CkiasDzZYdM%2Bxmfxh7WbH5vYgG1qtVqOv%2B%2BhUMzdzjEP7jzM%2FU2LP1DQH9x3hXdyh87nDl1v8czC6oj094OGreyij6OuE0myZM6ULvFl9ydOPz%2Fl2BwFQcF13pdFobPuNi1zJ5a0fdxHONK%2B%2FfqC%2BcH8pIGCiKN3Ya91rU3a0%2FheAk99ghKc72QAAAABJRU5ErkJggg%3D%3D';
						
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
						
upArrowImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAOCAMAAADKSsaaAAAAAXNSR0IArs4c6QAAAKhQTFRFEnMAFXUAIncAHXoDHnoHIHsAInwGI30AKH4TK4AAM4UGMYYLO4oQQ44VRI4XSZAbUZYhVpcnWpooYZ0wXZ45Yp4wW587ZJ4wXqBCZ6A0ZqA4YaJFaqI2baI4ZaRHZ6RFbaQ%2BbqQ8c6pOe65UgLJZf7JggbRmhLVlhLVpiLdqjbluj7tzlcB%2FlsGBl8GCncSHoMWJoMeJpMiMqMqPp8uPqcuQrM2Tr86VayLUTgAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsRAAALEQF%2FZF%2BRAAAAB3RJTUUH2ggZCiUstaz%2F7wAAAFNJREFUCNdjYCABsMMYrGJcEAaLnJ48H4jBIa2rZqgkyMDALKGjoaptqiLOwMYtoq9uoiylAJTmMdA0FQbr4DXSMpMEs%2FiNzcxlwSwBIVEZRQYGABF%2FBmSnRdN1AAAAAElFTkSuQmCC';

downArrowImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAOCAMAAADKSsaaAAAAAXNSR0IArs4c6QAAAKhQTFRFEnMAFXUAIncAHXoDHnoHIHsAInwGI30AKH4TK4AAM4UGMYYLO4oQQ44VRI4XSZAbUZYhVpcnWpooYZ0wXZ45Yp4wW587ZJ4wXqBCZ6A0ZqA4YaJFaqI2baI4ZaRHZ6RFbaQ%2BbqQ8c6pOe65UgLJZf7JggbRmhLVlhLVpiLdqjbluj7tzlcB%2FlsGBl8GCncSHoMWJoMeJpMiMqMqPp8uPqcuQrM2Tr86VayLUTgAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsRAAALEQF%2FZF%2BRAAAAB3RJTUUH2ggZCiMw9%2FcEJgAAAFZJREFUCNdjYGAQEBKVUWQAAX5jM3NZMIvXSMtMEsziMdA0FQbSbNwi%2BuomylIKDMwSOhqq2qYq4gwMHNK6aoZKgiB1LHJ68nxgHQysYlwMUMDOQAIAAGnkBmRhpsy5AAAAAElFTkSuQmCC';

bottomArrowImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAOCAMAAADKSsaaAAAAAXNSR0IArs4c6QAAAKtQTFRFHwAWEnMAFXUAIncAHXoDHnoHIHsAInwGI30AKH4TK4AAM4UGMYYLO4oQQ44VRI4XSZAbUZYhVpcnWpooYZ0wXZ45Yp4wW587ZJ4wXqBCZ6A0ZqA4YaJFaqI2baI4ZaRHZ6RFbaQ%2BbqQ8c6pOe65UgLJZf7JggbRmhLVlhLVpiLdqjbluj7tzlcB%2FlsGBl8GCncSHoMWJoMeJpMiMqMqPp8uPqcuQrM2Tr86VhHe%2ByAAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsRAAALEQF%2FZF%2BRAAAAB3RJTUUH2ggZCg4FgW6a6gAAAGBJREFUCNdjYGAQFBaTVWIAAQETcws5MIvPWNtcCsziNdQyEwHS7DyiBhqmKtKKDCySuppqOmaqEgwMnDJ66kbKQiB1rPL6CvxgdYxs4txcEHVMHMy41AEBUB0DFHCACADfrAlJwjTUvQAAAABJRU5ErkJggg%3D%3D';

topArrowImageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAOCAMAAADKSsaaAAAAAXNSR0IArs4c6QAAAKtQTFRFOwAWEnMAFXUAIncAHXoDHnoHIHsAInwGI30AKH4TK4AAM4UGMYYLO4oQQ44VRI4XSZAbUZYhVpcnWpooYZ0wXZ45Yp4wW587ZJ4wXqBCZ6A0ZqA4YaJFaqI2baI4ZaRHZ6RFbaQ%2BbqQ8c6pOe65UgLJZf7JggbRmhLVlhLVpiLdqjbluj7tzlcB%2FlsGBl8GCncSHoMWJoMeJpMiMqMqPp8uPqcuQrM2Tr86Vse9UEgAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsRAAALEQF%2FZF%2BRAAAAB3RJTUUH2ggZChAKxZC4pAAAAF9JREFUCNdjYAACDgYoYBPnhjBY5fUV%2BEEMThk9dSNlIQYGFkldJg5mM1UJBnYeRqA6LmlFXOo01XQg6kQNNExVwOp4DbXMRMAm8xlrm0uBWQIm5hZyYJagsJisEgMDAC4YCUlXya0PAAAAAElFTkSuQmCC';


										
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
						
	
//gctourLogoImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIcAAAAYCAYAAADQ1%2B6cAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oICQ4hHdcOxZIAAAAdaVRYdENvbW1lbnQAAAAAAENyZWF0ZWQgd2l0aCBHSU1QZC5lBwAABpNJREFUaN7t2nuM3FUVB%2FDPb19dSgttqbYWpbQVUJHa1qICTSEwCLaQ8hwRBS9qRoqElxZ5CI0PMEKxoBJ0BL1AgnS2MRGCkDASJAjaACVCiyBuWVhaSh%2FS5%2FbB7vgHV9kMs9ttICa0800mM3N%2F59z7%2B91z7jnfc2aoo4466thZZAMVLOWcijOwEj3YF5%2FBZjyKu%2FBQvqxS39bdyDlKOdfiDfw8X9bVa7wROXwbx%2BIpXJwve6S%2BtbsBSjmzSzmH9%2Fp%2BcClnRg25aaWcRaWcnlLONfWde%2F%2BjoXqgUjCqUnBCMvgnsD5f9lgvkfG4tlovX%2FYopuFhXJF0B4QQQmMIoXFnbjyE0BRCaKib8P%2BYVioFd%2BH6rGhxKecHmNubR5RyhqAdo%2FNlPTUiyBgchQX5su5%2BjDs6paOTMCEN%2Fwv3YH6MsbOGzgTMwUx8GN14NvGdm2OMm6rk%2F4RRNZZ%2FJMZ4Xt38OxE5KgVTcCqWlHImYnk1wcyXbUQbfUaGlfgrxvXjGDk8h4nJQfbDGMxORHdpCGFmlc5peAbDETA6rfFDnIInQwhjq5b6Hs7HjTg4fT4ft9RNv5ORo1JwE6ZnRZMTb7gtX9ZeIzp8FLPyZTeUckankzwNh%2BJANOOxfNkRNRzjk1iEK3FjjLFSQ6aAm%2FDpGOPSEMKhqSI6N8b421ppCb%2FBJEyNMW6vuj4Ji2OMWd3kA0dT1fdjkuFgMpb1cpy9Utna1NbudeRKOYc1ZiqtjV7a%2FKanKvwZ27AFVzw%2By96H%2FcG6qjV%2BirYY4%2Fy%2BbirGWAwhvNzLeee9NfxOx0jy3SGE2am0bsX2AfKWsbgKn8deeB634rYYY09KS9%2BMMb5YpXcmJsUYL00y1%2BEirIgxfm1XdQ7oSO%2BD%2F5tS1p9jSucmZzU3OHr5JpV0ipdg9SnjLMcXcFNW1JkcqXXNFjfu2WwBjq%2FiGcfikB3dWIzxgaQzBtNR2IH85kSGB0poJ%2BMh3IszsQqH40eYHkI4G0diSA31%2FVJKlGQOwe24c1eOHN34bPrcXMrJcMoDr%2Fj1lJGGjd7D5uGDXD55pFva2mXNDZZ0V9zXmJmKYeisFFyBK%2FdpNXhrt7VV8x%2BMTcmxBoqPYyNeeK8eOlU5d6RodHGvS8%2BHEB7G33HyTkz5yxjj1bt6WlmIKysFM9vavYz9k1EerHB%2FU4OFidA9dfp4M9raPfHHlz134ljHZEXPVgqG4ysYDI2ZkVXzN2J7b54RQsink9gXNqK7Fjd5F5iUCPWRNSLQshDC7SmaDBT37w59jnmpTL1nxn4OPGiY7%2BTLnsmXffGAu8WsaCNuSPl5FB7b0u049FQKcvhcOulgw3bFqvmfx7AQQm9n%2BAg%2BVuN1BK7Hq9i7RiXybrA%2FVsYY1%2FZxfUl%2F1VaNFkDXLk9Is6KuSsFU%2FHjPJt%2BaOMKUnoJpGddgYVbUg3OwLSt6spTThYvxddyWGmTgxfU2D28xv%2BpUdoQQ%2FobzcFkau6GP0H8ZDsB9WJp0vttPqshSGbw6xrhlB8%2B9CiNCCK19yH4QaxKxHVTj%2BuDdskOaFW3Oii7EqNe7zN%2FabX8swNJKwWzMRUelYNLp47V8ah9Ppz7C%2FxxjzRZvLF5t7sg7bKix5hxcFEKY0Y%2BhD8PVmBNj7MHluCSEcHw%2Fz%2FJ9PI6WATz3IqzH2TXWHpRSyv0pik6qoX%2FEbtkhrcbCY3117BCXTxlpaENmzADmrPzjDZ17tZg4ZrCurGhrDQOchV%2FhZvwixtiRxvfBN5JjzI0xzuulc2mqJH6SuqGvpfGDUjl6AnIxxidqrPeOPkcI4YwU7S7AnTHGbSGEfVODbELq2VyQONaJMcbFIYSW1LS7KnVZjw8hvJl6K0%2Fv8pGjGqc96PZlG5x7b4eN67fp7Ee065WNFv1znTXjhlowZrC78aU%2Bys47Ez%2BZgBdCCKtCCMvxOmbhpN6OkXSuS2XxdLwaQlgRQliVuqaDMKWWY%2FRT%2Bt6NL6f0ti6E8CpeSn2ao1NpPA%2B%2Fx6IQwmtYi%2BPws3rkeLsB1tzWzrih5kz9gGtWdulobbShqUHD1m5bVnbZvmy95k1vum%2FWWJ0tjWZiHS7JilbvoKzcI6WkFnT0QxJ76%2BydSGUP2qt%2FU9nJsjZLcw3ra%2F203nhv%2FW3hpfe4cnp%2FOkelIMMInJwV3VopaMXatnYjEllswr%2BxIl9%2BO31UCpoxMitaoY5d1jmG4MJEIn%2BXTs7QrOj8%2BtbV04pKwTR8CMuzor%2FUt6yOOuqoo46%2B8R8zB2ZOLT0sIgAAAABJRU5ErkJggg%3D%3D';
gctourLogoImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIcAAAAYCAYAAADQ1%2B6cAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9oIGQo6LQ%2FxwecAAAAdaVRYdENvbW1lbnQAAAAAAENyZWF0ZWQgd2l0aCBHSU1QZC5lBwAAEBBJREFUaN7tW2tUVFeW%2Fu6jHlRB8S5eIo8SRFAQFaKxfSW2qBgjMmpixkfSJplMllkaku6OkzG2vZJxTDR20tMmrCahk8YsO3REDGjHFyrYohGiRsQSQZRnBSwKq6iqW3Xrzo%2Bcq8ebinavNT8GV%2B5aZ91bt86rzv7O3t%2Fe%2BxQDckmSxODOxQDgAKgAqAFoAGjJsxoAT75nSX0RgADABcBJ7m7yTgQgMQwjUf0rx%2FvBpax%2Fvzb%2FF%2F3%2FdCnWSLGQDBE4RwCgAaADoCclgAKJDBCGAscQADuAQQC3yGc3AK8MEMVY9P22XBX3H8z3n2hzL4BIPwHl3hdPhEWDQgaGmoBBDyDw1JtP5vdfOvVzdVConeVVrMdhCx%2F6riOJ5VWCPia5ZcTUxX9Pe%2BLX5xiOsxFAqUi%2FPrlIkkQDkC4MJTAfuYvkLinaMD%2FSRllfWY8GhUTNS5IkifkJIH52oiRJLAGDijIbKlI0AHRfPZe5Xh0UJjy0YdeRgPBY2cxwouDmzH%2Fdnta2v%2BQRR%2FfV0dqw6I7Uf3nls9FLik4D6AXQA%2BAmAAfRHrLAeGoc2jzJQvaQ%2Bl5K2Dw1T568k4Xspdr4KLOoNH%2ByCaTHEClA%2FlMmyJ%2FpepBAxkiSpFKYDy0lNO7o%2BmlLw9Ieupb1%2FDtXARiuH%2F1s9K0Oc0zGijeayOICAH%2F1yw%2FGXCp783FnX0ecccLsAzP%2B%2B%2BBOAJ0EJINEGBylkWgTxVGC8xDO4qI4C0fxHnp%2BEqnvJlzHTc1JBrGGApNP0b%2BTfJYB4s80SfcyyT9mrh4EkLBkoQMABAOIxMUDY%2FDJLxYCCDOXb09X6YOdWc%2B%2Fc44somegpTH86t7%2FWUgtsgOA07Tg38x5HzUVB8aOumZpODSv%2FXDZGACBFABkAIYAiAQQDSAOQJwgCPGCIMSTz7EAYgAYAYSTEgkginwXByDO5XLFezweum4kgFAABqqEkfcxVL9yvSAyHy0FIo0f7UlzK4bSShylyeh6HNl0zP1I8f97zkHKHaH9ZX0RHl1XBSDkRs3uvFm%2Fqy0mu8ELwGta%2BGLTlYr3g31eQWJ5tUjeswB8qoAgccrG8orrRz%2BLGzGtUOYeOgIiiTyHAQi5fPlyfHl5eUFHR8ckl8tlBACtVmuJi4trWLRo0d6xY8feIO188hzPnj2buG%2FfvkU9PT3j3W53KACfXq%2B%2FkZCQcGzlypXlUVFRfYQE%2BwCo1q5dWyyKYgTDMCxD2LAkST6DwdC4ZcuWN8i8XRRf8fm5eynzIykIuz%2BT6KW0kTTcwSFrDgOOf5iNXnMucp7cfe3gJxkBEXF2llNpyI%2FkAHD6qAQh1JTd0Fm7Jz5%2B5rI2SvvwADjDyDGu2MkLer67cDw%2BeuKcfmKqPKQPA4DwL7744mfV1dXrQkND22bNmrU7MzOzjed578WLF0eePn16xo4dO3bk5eX9YcmSJV%2BTdvyuXbsePnz48Jro6Ohz%2Bfn5Jenp6ddcLhfT0NCQfObMmQWbNm16dNWqVa9Onjy5lZgjdvr06R%2FxPB%2Fe39%2BfXFdXt2rJkiXveDyeIZ1O1000h1pBZH2KQpssgbzjKG0je23y5nETsDGySZQkadiaGP4ul%2FXUp7MQZLQgwKC9fmTX1JRFaw8S0yDzAh0AbfrKN05c%2B1tpZvzMZRar%2BWxga3Vx5kDr%2BVRHT9tIwdYXLvlEVmcc2Z5f1n6FtPcQEIXU1dWNq6qqenXChAl7XnjhhS9ZlnWQhZRGjRrV8fjjjzcUFxfn7d%2B%2Ff21iYuKbOTk5lhMnTiQfOnTouenTp5etXr36IHGX3QDEjIyMK0uXLj20cePG9aWlpb9NT09fYTAYvADEJUuWNAKIqK2tZevq6jB%2F%2FvwW0tZOwBFImQp%2F3pKL1LUR8%2Bkja6GnzJKa1HcR932Q0iK%2B4aw9%2BLtsZ0%2FzGESP7gagGeptT4jOmSsQM%2BDFd616BEcz8Lj0hoQMceBq45ivnh9v4hhIQRExAyHJmZbIzBm9nCYAnErraan8fa6rtzVCG5U8SHkqQRUVFStHjBhx9sUXX6wiiz5IdqYkg%2FS5556rioiI6Jd3aWVl5eLk5OT61atXHwZgJUUWFqvRaFQvvfTS5urq6rTu7m6vwWAYojiVSxRFjyK4FwBAe%2F78eWN5eXlhb2%2FvWFEUA%2FR6fU9GRsaxZ5555jjP8%2BK6deteXbx48dvTp0%2F%2FhjIxAVu3bl1qt9uzNm%2FevPvll1%2FePGXKlL0nT57MY1m2e9u2bS%2BT38PeJ84yLMBxJ%2FbAMAxC4gYBqCXRq2VYLhCA1nNqV8zA0Y8noevbUb1OlrkZnnEjMHbUTXVQ2FBuSswtXK4ZhcK3ziM%2B2wmAh3OQMx77r1nMe3OfxZvm3xBhMC0tLcb%2B%2Fv6MwsLC31C7cpDiJLdV9%2BLFixsAGNra2mL6%2BvqSly9f%2FikBhBVAH3mWPRlVXFwc9%2Byzz3bKxJkyd4IkSSIFFjUArra2Nqm0tLQoJibmXEFBQXFERMTghQsXRtfX1y%2Fu6uoat3HjxjKbzZYhCEIExZtYABqXyzXSbrenAgixWq1jDh48ODI%2BPv7o%2BPHj9yi00LDnHHfsLcP60NU0AoBKkny85PMFXvrsrdTmXW%2FlZxlc2oRglSd01ppj%2FNJt57w%2BH75akfiMqMu9yvW1xmLQ8r35%2BNMzD6G%2BLCfMJ%2FBuZ4CDsstobm5OYFnWnZub26Egej6K1NGBLO7KlSsxHMcJWVlZXZR35FCAg1e4w%2FJ7D7H7Eg0OURSZ3bt3%2F8JkMp167bXXPpWJ76RJkzpyc3Ovvvvuu69XVlZOBACO4%2BiUAQCoOY7jWZZlCegxevTo40VFRX8C0PWPxk6GCzjk2IKAxJyz%2BPbAPBzaYdKEGG%2FdNJ%2BJDEudZA9OzmwPmfpIG5%2B%2FzowvXpuA10et4tdW7dHGploua9MG0vlvRGTk2WC9ocPFA2kQBR4AOMGuozSTJIoiyzCM%2BP26fi%2F87du3z7NarZEMwzAsy3JqtVqj0WgC1Gp1gEqlCtDpdD6GYXwsyzL3iT3cKxIqXxwAtr6%2BPt5ut8esWrVqGwHGIFmHgIyMjE6TyXSmoaFhPACwLMtT7i0LQMNxHM8wjKyZkJWVdYEioy6ynsMeHCwVr7BjxR8roAvpx%2BcvF07RdIYO%2FnVTTnTOXOuj75%2FaH%2F7EW5cQZBTx5O8b4HFq0N8eFJY6qaf73IkkMCxQ91EizlfFwtYdKnfuSp19ilLzYnJycocoirrm5mYjYfwBLpdrpMvlSnU6nSlOpzPF4XCYbDZbQk9PT1p9ff2CiIgIh9fr1VJtdFSeR0dIpRzXCCLfqanYhBJAbHd3d7hGo7kVGxt76%2FbGoJKFRqOx69atW6FEcyiDhDqO41QEHCwAqNXqIQocbipSO6yDYTxZHAcAG4Kju%2FHGhY344%2FJ%2F1ZmPTU0avBEl%2FWpELDPz389gzi9bwPES9r0xFiwvImthX6wUJF0%2Fsisbr2w7is%2BLZsH%2BnUHuuMWh8iQ99d4hatHYcePGdQUHB7fu27dvRlpa2ucAxA0bNuyXXU8ihEAAhp07dy6w2%2B1ReXl55gMHDli%2B%2FPLLmWlpaddJAEsi4PDJYX5RFPn6%2BvqwpKSkzpiYmH7SJ6PQND4ACAkJuSUIgs5ut6sDAwNld17WLIzdbg%2FSaDRDLMv6vF5vAJmT7N7qJEkKIuDgSRjdR8YTFDERPAiaY4gQPQuCY9pRdPRDbLq4YcA0p85t6zOg4j%2Fm49cjVuDzoiycKH4IQUY7vt1vNPIubnxach%2F2vv4zGhj9YoD7Zubyo1x4vI0wd6fME2bPnl126dKlR%2Fbu3ZtNFj2YCDyEPOtrampSvv7669lz5szZx3Gcffbs2dVNTU0zKysrJxHvKUoR9YzasmXL2tLS0hKn0xlMhdcZkliTBeUFIEyePLmF53nX7t27pxCQBZGxAx0Oh85sNk80mUzNer2%2Bv7W1NYHMM5REa0MsFstowjk4Ag7RD9eQhnsIXeYcTmqHfR%2F4iRnjDvnl3%2F58%2FsOiHt%2BpP8%2FKFFwa9tD2mQAAp02P9%2BcvBYCRfkx%2Fv6h2T3h6099h7%2FciMNxFwCcBQH5%2B%2Fpne3t6SysrKZ5ubm2see%2ByxI%2Bnp6X0A0NnZadizZ8%2F0xsbGednZ2ZX5%2BfknAYgLFy480d7ebqioqHjBbDYnFxQUfGUymfoBSGfOnImtqKhY1NvbO76goGBDcnKyg%2BIbIgCRcmWdALx6vZ6ZNm1aWU1NzdMMw4hPPPFEnU6nE8xmc3hJSckKhmHEZcuW1bjdbpw%2BfXpuWlpa28MPP9w6NDTEl5SUzLVarUlGo7FNzuOQ%2FkVKuzwwiTc6gynb9GAq%2FxHVWlU88fIn%2F7lwaoSgMngHAv32xKm8Xaq474asluCECTMaVH3mcCTmHsGaXWXE9fSQ%2FkMBhB4%2FfnxsdXX1UovFksXzvIthGFEQBENwcHDrjBkzygsKCk7LwpTD53v37p147NixQqvVmqJSqQYlSWJFUdQZjcazhYWFH%2BXk5JgB9BMt6CZmKqyqqmpyeXn5Bx9%2F%2FHEBlenVlJWVTa2trX3K7XaHqVQqhyAIQdHR0Y1r1qwpNZlMNrfbrX777beXt7a2zuJ53i6KoiYkJKQ9Kiqqra%2BvL37r1q3vPf30039YtmzZS3Pnzq0FYCGxGzcA33DXHHRyiKWipYEAIm4nutyOGC%2BYoBvFL05N%2BrZ0qoUNHdRqtG6OESFIvKdP4MTrNi%2BrMU26NNkUfZO%2FejwNLGfDUx%2B8h5RpZkpYHCF1MoHUWa1W%2FYULF2IFQeBTUlIsCQkJVsoMDZEdyRP1HwhA29nZabh8%2BXI0y7K%2BjIyMrsjISBupayPFTkCgIeOEEGDKsRRJzg6LoqhtbGyMs1qtgSkpKT2JiYlWilByAFSdnZ2GpqammLCwMEd2draFZVmaw7jImP1UcE54EMyK8iSY7J7pAYRD9Mah69tUHP%2FwETy18yKGBrQoinxF2GrZ1NtwKMjrsnsCwmJtoaMn9WsM4e7bUcShAREttTwyF7SSBRukhKL1k7JnFSl1OgVPp%2BzlNjxpI7uqAqk%2FhDunz2SyqiPt1FSUU6L6VKb0vRQ4WCrFwCpC7LQZdhJAOqg5PxjgoADCULs0FDe%2BScJf1q%2FB1ZMFSJh4FppAJ9x2FX51skSxGN57JKwclO8v4e6TZjwlGIbiCbL7qxSSSkk2cfcBIQ91BgSKsVhFck1Or6sU4KRPldEn5FiKy9BCF6lx5TlLD8J5Dv42Sr7PaNOpZwHx4%2FuQMLEeEUmdMI4axLwNTZTA7WSXCpQQ7yKClMA8ioSWl3JfWT%2FBK3%2FH%2FgRKSMr4hU8hWCiA4KXA9GNHD3%2Fg8lIbiFGMKfmZr%2B9BcWH9RhWJ9mApdRxEipYIRs5UOnH3ySufQtX6S4Hf64CxUjjSPaKgyvYS7n0oGfdJgNH9%2BevH33jwA5QH5gTYDzSH4seKVDLMTal%2B%2BjCLQGkI6Ud21A8WTb7fCT34F%2BiP%2FDXhXgC411lPv3UIUO8nzH9I2A%2FiAeX%2FBUPhQRLDQ08NAAAAAElFTkSuQmCC';
gctourLogoSmall = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAQCAYAAADwMZRfAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sDGQg7CZXhIq0AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAD30lEQVQ4yy3M2W8UBRwH8O9vjj2ms92rpUsPutClLdjVQi0WS%2BHBNCq2QCKJhoemLxhr9QlTEhIjPIgxKiRINKSiQEKEBINIsVpSSRpQMLZKCU3tfQBdeyzda3Z3ZnZ%2Bvvj5Az5kWZaLiOwAFAAeZl6z%2BNevNRM%2FnGoB4JEUl5ReeuRNRaY9joKSZFnT%2Fpny5rYRu7tgEsA%2FAMaImSsBuP5P8mb7L25%2BfPvqzuo3D8%2F5qupVQ0sUyoqLLNPgse9Pls%2FevFCua3E5tOedBxWtHX2ykn9HAlDFM39uIFESkjZveuH367X1Xed%2FkZ15%2Fid3e8omrp1%2Brul47z1BklPVb3TFK%2FZ0LE799HVo%2BMz729jQ9eoDR2YkTixtxc3PX%2BP2s7cfnuiorDvUfUNyKGlmThc3tDy5d%2FzAbiLKAkgBEGWnyxXa%2B%2B5TpaAUeYGgJYhSoUBDVxqxMh2MR6MVzoISu%2Bx0qUTkJCKZmaXSptdnouNDfmZWcnpG1RNR1UhEHe4NYcHQ4r6ckQ2Q9UnjAoVeNEesYi0QbpzyVdWPA0gDUAEEsvGVwgfdh4Nrt7dGVifv58dnR%2FypyJRLj6%2BIejrFzWeGr0mIRVQE65%2Fqg4MeW76%2FAIDAc0OO5G%2BXS1aXI66Et9LKrC45kyMDtuJsxFa2721NKgpZDn%2BxOH%2BqzS5c%2F2CrBLaAlVkHBMkm2hyF030XSsa%2F6ija5taENTvbk4H9h%2BKr44P68qUjHq8tKiDPyXD7BZxvz1s3elk2fEESEN49hzvfuFQzJqXmR92e0BZ74KX2jHpiftn27KuWfLS6SFFdtmTx85wmhVASlhAZdfAfl2RiE5RNigL2fnSLFa9W8fCcU%2FiuU%2FUaS1K483RW8pWKqN1ngS2SVa%2FIVk7U3OsIfZ8pfOsLG1kGMjnAbO6akEhx3%2Bf3eon%2BvvqCMnCu0jz5ikuq3GFy01smhm%2FI8Ach%2B0ul4vUbybaQIP75Y5GMDHIWMO8OZ8sb26eImRuYOQSgiixz8%2FjFYw3ywJeBYD4IWpwgiIBdZTZ1gpEBLBNEQEwHzLZv53y72vqJmQPMXARgIxHVAtgy1tNdZ%2FR%2BWrCJZ0XkTBAIAMMCYAl2XvDWZO2ymCtSZY2D9UPEzA4AbgBBAHVs6ttJT4ZTpuB3HK1aG9vUkhB0zQDYyNjcmccJy%2FLW7Fhab08amLwro%2FXYFQmAwcwZIkrC1OP48cMAj%2FSVKU0Hl1BYHvMdPNuvJVZXQMKKR81PBACdmU0iymJXZ4yZ%2F5WYmYnIYGYNorwI1TeGZ142UBKOoLMnAuCRU3VHAESZWQNgEpHFzCYAnYhS%2FwF8odAV4EB4aAAAAABJRU5ErkJggg%3D%3D';
userscript_image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAALZSURBVBgZBcFLiFVlAADg7zzuPLzjzDjOMINMitIie5gF+UAkIZSgRQuXLZIWrY021dYIggJdJURElJsoqlWRYA9GshGFCNQeOjoTk6bjeOd5zzn/f07flzRNA459ObcHJ3cM9+1fq2prVa2qa+uh7mAZ9xCxiAV8iu9zgDqEvU9ODOx//dkxALBa1kNrZT202I2TZcVyEd28t+Lb66uHcTwHqEMYH+xJwNyDqJUk8oQsp7eV2tqbytJUK+OpyX5bhtojH07Pv58CxKoabOeEmuUy0al4UNDp0umysM5/KxG8eWbW/u1tj4+2xnKAWFUjG3tSqwWr3ShNEzmyjDQjk8gSaiRxyYUbiy7PduZzgFiW40P9mc56sFY00rSRpaQxkaVkGlmGJnNnqXDq7N9LOJYDhLLcNj7Y0uk2AjRkMZE2iGQaeZOqG2IrCmXY/s1rB+6nALEstk0M9VotG0lKliRSpEjw+YUjPjq3RxkKoSjEsoiQwvMnvusXQ09vK1VGUg1qjVrUqDWKUJoc3emVj3dbWeuEUJZLkEMoyrF2u0+aUEPD19OHNXVQ1kEZgy2bHrZzYq/l7qr766/m3VC0ub+SQyyLDXm7R56SpYlYJ0JdOvzYy2JTi3VUa8x35jwxecBKue7S7E+dXW+nI/nB42dGcWLPI1vdXmrcvBO1++iGUmxqtxb+UtVBqCtVrCwVy3Y/dNBKtZb+OjO1kMeyfA4vXLo6Y3E9t1I0qtjo6goxGB/cKtRRbGr/dmaNDEy4PHfe+etTd8vgSB6r6ukXD+3qf+ulfQDg6OnCJ7+8p6xL3VDaMfqofTuOuHhryrk/fl4tokPz7zRX8lhVM7fvdXx29qrhgX7Dg32G271OHv3dxg09entSvXnqmXcHJGm/6Ru/ad89dmrm9AdXIK9D+GLq4rXJqYvXtmEzNmMTNmGor6fV6utr6YxWfvjzR0P/vDGTh7GvAP4H2uh1wse2x/0AAAAASUVORK5CYII%3D';

pin_image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89%2BbN%2FrXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz%2FSMBAPh%2BPDwrIsAHvgABeNMLCADATZvAMByH%2Fw%2FqQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf%2BbTAICd%2BJl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA%2Fg88wAAKCRFRHgg%2FP9eM4Ors7ONo62Dl8t6r8G%2FyJiYuP%2B5c%2BrcEAAAOF0ftH%2BLC%2BzGoA7BoBt%2FqIl7gRoXgugdfeLZrIPQLUAoOnaV%2FNw%2BH48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl%2FAV%2F1s%2BX48%2FPf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H%2FLcL%2F%2Fwd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s%2BwM%2B3zUAsGo%2BAXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93%2F%2B8%2F%2FUegJQCAZkmScQAAXkQkLlTKsz%2FHCAAARKCBKrBBG%2FTBGCzABhzBBdzBC%2FxgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD%2FphCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8%2BQ8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8%2BxdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR%2BcQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI%2BksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG%2BQh8lsKnWJAcaT4U%2BIoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr%2Bh0uhHdlR5Ol9BX0svpR%2BiX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK%2BYTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI%2BpXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q%2FpH5Z%2FYkGWcNMw09DpFGgsV%2FjvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY%2FR27iz2qqaE5QzNKM1ezUvOUZj8H45hx%2BJx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4%2FOBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up%2B6Ynr5egJ5Mb6feeb3n%2Bhx9L%2F1U%2FW36p%2FVHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm%2Beb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw%2B6TvZN9un2N%2FT0HDYfZDqsdWh1%2Bc7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc%2BLpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26%2FuNu5p7ofcn8w0nymeWTNz0MPIQ%2BBR5dE%2FC5%2BVMGvfrH5PQ0%2BBZ7XnIy9jL5FXrdewt6V3qvdh7xc%2B9j5yn%2BM%2B4zw33jLeWV%2FMN8C3yLfLT8Nvnl%2BF30N%2FI%2F9k%2F3r%2F0QCngCUBZwOJgUGBWwL7%2BHp8Ib%2BOPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo%2Bqi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt%2F87fOH4p3iC%2BN7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi%2FRNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z%2Bpn5mZ2y6xlhbL%2BxW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a%2FzYnKOZarnivN7cyzytuQN5zvn%2F%2FtEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1%2B1dT1gvWd%2B1YfqGnRs%2BFYmKrhTbF5cVf9go3HjlG4dvyr%2BZ3JS0qavEuWTPZtJm6ebeLZ5bDpaql%2BaXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO%2FPLi8ZafJzs07P1SkVPRU%2BlQ27tLdtWHX%2BG7R7ht7vPY07NXbW7z3%2FT7JvttVAVVN1WbVZftJ%2B7P3P66Jqun4lvttXa1ObXHtxwPSA%2F0HIw6217nU1R3SPVRSj9Yr60cOxx%2B%2B%2Fp3vdy0NNg1VjZzG4iNwRHnk6fcJ3%2FceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w%2B0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb%2B%2B6EHTh0kX%2Fi%2Bc7vDvOXPK4dPKy2%2BUTV7hXmq86X23qdOo8%2FpPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb%2F1tWeOT3dvfN6b%2FfF9%2FXfFt1%2Bcif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v%2B3Njv3H9qwHeg89HcR%2FcGhYPP%2FpH1jw9DBY%2BZj8uGDYbrnjg%2BOTniP3L96fynQ89kzyaeF%2F6i%2FsuuFxYvfvjV69fO0ZjRoZfyl5O%2FbXyl%2FerA6xmv28bCxh6%2ByXgzMV70VvvtwXfcdx3vo98PT%2BR8IH8o%2F2j5sfVT0Kf7kxmTk%2F8EA5jz%2FGMzLdsAAAAGYktHRAD%2FAP8A%2F6C9p5MAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfbBQcMJyOQosv2AAAD4UlEQVRYw8WXzU9cVRiHn3PuvXOH%2BWLK8FmhkDZltEAqdeHCnbGbmqgJqfEvcOMsTFyw6ca4mhgTE9HEhf9BiV8JqyZGo4AYDCpCIY0x6IAQmDIznZl758651wUXuWmwDJQpJ3lzc3PevOc5v%2Fc9X3DGTRzHeXAsG9E0%2BZ6uaa8p1015HniAEGLHVeq253nvrk6OV5oCMDiW7WwJh%2B4%2B%2B8xA4vLFPq2ORqFSp1Cpky9W%2BGd9QxV2NsuqXr%2B8Ojm%2B1WhcvVFHTZPLAz1t525ef45CVVGoOBiGg6bXkbqBGYlp24ab2NjY%2FBp4vtG4smFSTeb%2B%2BHubuYUVUlHJhY4Il7pjpJ%2BKMdIboVVts76xiRBi%2FjgpaFgBIdixanW%2B%2Bn6JL7%2F7HV3XEAKkAM%2F1qNoOSrkgZakpAHhsADiuIHVpiO4L%2FVzrj%2FFCH6hiiTezn6NJiXLd6nEAGk6Bo9wNKQ9qNhRuIRqL0tYaPQgmhQ0UmgKglLula7J%2BRJoU0BwFgLw%2Fw0esaeE2E6AoEMYRCoQA1RQAwzDeDptGKB4xD%2B1vT0aJtZghAR8OjmWTp7oKht744JNUZ%2BdQSNdIhBQXB2K0dxn0JjQcq8J2sUo8YrK5XcSQJBXiG2D0VLbiwbHs1Ugs9u2LN260SilZWfyNrfUcxUIJ8AjpGoYmcewauq9nte4VFXy0cnv81mMrEDaNt4bTA1Ep96Knh0cYuTZKe3sc6SpWfl3k55mf8ALJjIS0RM0TrwC3HrsGLNt5Z35hyes2ykTNPfdarU7%2Bfhl0jfTVYa6Mjvzn33EuxoXzKQdYbOiMOcphZ%2FlOre3plz69e2%2FtZVW%2BH073Js3z7XHCGkR0SUfCZHCgi85kC8loiJ2SXfhrq7hg1eo3d5bvOKd6H7jy%2BvvZSEvo1dIDKx2PHqyGUtnGNI2SFOLHilX7eHVy%2FIumXEj228TExG5rqqe15jjYtoVrP1jLZDL9J4klOVmbT0R0OpIRYnt1MXPSK9lJAeYcx8E0TTzPOxOAedu2MU0Tx3HOBGChWq1iGAaWZVWBhScKkMlk7lmWlbdtG2Auk8nUnrQCAPPlchlg7qSr6aitWPgblQyY2DfLshZLpdL13d3dX4A4e0%2BEh831j2fXt4YB9gcPAWH%2FawSBcrncn%2FF4nKmpqTWgJzCQB9R9s32rBaCOBWACUd%2FCPoQOyJmZmc2%2Bvr7c9PS0DnQFABTgABaw%2F0pSvnmN1oAX%2BD4sqQt4s7Oz6%2Fl8%2FofArIP9buCfwwZupAaUL5%2FwZxRMgQDk0tLSZ8B6YLBg3oMpUP8HIY4oQnlIERIoxsMU4xA13EepcKbtX%2BRcieZqbkRNAAAAAElFTkSuQmCC';
pinned_image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89%2BbN%2FrXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz%2FSMBAPh%2BPDwrIsAHvgABeNMLCADATZvAMByH%2Fw%2FqQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf%2BbTAICd%2BJl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA%2Fg88wAAKCRFRHgg%2FP9eM4Ors7ONo62Dl8t6r8G%2FyJiYuP%2B5c%2BrcEAAAOF0ftH%2BLC%2BzGoA7BoBt%2FqIl7gRoXgugdfeLZrIPQLUAoOnaV%2FNw%2BH48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl%2FAV%2F1s%2BX48%2FPf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H%2FLcL%2F%2Fwd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s%2BwM%2B3zUAsGo%2BAXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93%2F%2B8%2F%2FUegJQCAZkmScQAAXkQkLlTKsz%2FHCAAARKCBKrBBG%2FTBGCzABhzBBdzBC%2FxgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD%2FphCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8%2BQ8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8%2BxdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR%2BcQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI%2BksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG%2BQh8lsKnWJAcaT4U%2BIoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr%2Bh0uhHdlR5Ol9BX0svpR%2BiX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK%2BYTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI%2BpXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q%2FpH5Z%2FYkGWcNMw09DpFGgsV%2FjvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY%2FR27iz2qqaE5QzNKM1ezUvOUZj8H45hx%2BJx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4%2FOBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up%2B6Ynr5egJ5Mb6feeb3n%2Bhx9L%2F1U%2FW36p%2FVHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm%2Beb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw%2B6TvZN9un2N%2FT0HDYfZDqsdWh1%2Bc7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc%2BLpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26%2FuNu5p7ofcn8w0nymeWTNz0MPIQ%2BBR5dE%2FC5%2BVMGvfrH5PQ0%2BBZ7XnIy9jL5FXrdewt6V3qvdh7xc%2B9j5yn%2BM%2B4zw33jLeWV%2FMN8C3yLfLT8Nvnl%2BF30N%2FI%2F9k%2F3r%2F0QCngCUBZwOJgUGBWwL7%2BHp8Ib%2BOPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo%2Bqi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt%2F87fOH4p3iC%2BN7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi%2FRNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z%2Bpn5mZ2y6xlhbL%2BxW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a%2FzYnKOZarnivN7cyzytuQN5zvn%2F%2FtEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1%2B1dT1gvWd%2B1YfqGnRs%2BFYmKrhTbF5cVf9go3HjlG4dvyr%2BZ3JS0qavEuWTPZtJm6ebeLZ5bDpaql%2BaXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO%2FPLi8ZafJzs07P1SkVPRU%2BlQ27tLdtWHX%2BG7R7ht7vPY07NXbW7z3%2FT7JvttVAVVN1WbVZftJ%2B7P3P66Jqun4lvttXa1ObXHtxwPSA%2F0HIw6217nU1R3SPVRSj9Yr60cOxx%2B%2B%2Fp3vdy0NNg1VjZzG4iNwRHnk6fcJ3%2FceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w%2B0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb%2B%2B6EHTh0kX%2Fi%2Bc7vDvOXPK4dPKy2%2BUTV7hXmq86X23qdOo8%2FpPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb%2F1tWeOT3dvfN6b%2FfF9%2FXfFt1%2Bcif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v%2B3Njv3H9qwHeg89HcR%2FcGhYPP%2FpH1jw9DBY%2BZj8uGDYbrnjg%2BOTniP3L96fynQ89kzyaeF%2F6i%2FsuuFxYvfvjV69fO0ZjRoZfyl5O%2FbXyl%2FerA6xmv28bCxh6%2ByXgzMV70VvvtwXfcdx3vo98PT%2BR8IH8o%2F2j5sfVT0Kf7kxmTk%2F8EA5jz%2FGMzLdsAAAAGYktHRAD%2FAP8A%2F6C9p5MAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfbBQcMJy13GubxAAADKElEQVRYw%2B2Wz4tbVRTHP%2Ffe915%2BvWTSJJNW7XTCDM0o08G2LlwIKoILuyozCP4F7irShbPppnSVhSAI%2FQNcSjv%2BWrhQFEWoWBTRtppBFH9M0kwzMyQxP9%2B797no04m2dDLYgGAOHC7cczn3e7%2Ffc857MLGJTWxiE%2Fu%2Fm9jP4eJKKa6UvGApdVobkw0CCAAhxJbR%2BlIQBOfXL692xgKguFLKx6LO98cfKaSOzs0oH0Wj49Po%2BGw3O9ysVHVjq9bWvn90%2FfLq5qh5rVEPKiW%2FKzyQOfD8s4%2FR6GoaHQ%2Fb9lCWj7RsInFX1W2TqlZr7wGPj5pXjoxUyY0ff6vzxddlsgnJkek484dcFh5yWTocZ0rXqVRrCCG%2B3I8EIzMgBFu9gc%2B7n93gnU%2BvY1kKIUAKCExAt%2B%2BhtQEpW2MBQEAVwDOC7Pwih47McnLW5YkZ0M0WL5beQkmJNqa7HwAjS%2BBpU5Vyt2adaIyEmyAzldhNJkUfaIwFgNZm01LS30MmDYyHAWA7fOE9elqYcQJoCoS9BwMOoMcCwLbtl6MR20nGI3eN59IJ3FjEEfBacaWUvq9dsPjCqxez%2BfyiYylSjmau4JI7aHM4pfB6HerNLsl4hFq9iS1Ja8THwIn7MoqLK6VH4677yTOnTk1JKSlf%2B5bNygbNRgsIcCyFrSRef4AV8tn1g6aG18uXVs%2F9GwYEoCK2OnNsoZCQ8nb2hWNLLJ08QS6XRBpN%2BZtrfHXlKsGQmHFHpfomOA1cCGvChH7niL%2FX5YAz6LavtmT2pSePF1RgR%2FF0gNYGzzfE3Qi5%2FDRGa2qVmwBMH3DJZpJ%2Bfafx%2Ba0bH73%2F1xi77SMDkCE7sd7Or86gtf32L83I0357J%2FLwTMZ%2BMJckqiBuSaZTEYqFg%2BTTMdIJh3qj%2B%2FvP1VvlHz68eFb3WiZk4E8WglFrQAAOEANcIAFE55975exUZvqpds%2FMJhO73dBq93Fs1Qn83vXtjfU3K1fe%2BADoA%2B0h9%2B4mg9hDAhuIhmDscE%2BGcbm8vDy3trb2U%2FgyM7RqwA9B9IFBuBfspwtEeNmwi6GY%2BNun6s7V%2FMOD%2F%2BQ%2F4R%2FRviSbeGCJRgAAAABJRU5ErkJggg%3D%3D';

previewImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQoAAAB4CAYAAAAKVry3AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAKbAAACmwB9fwntgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAACAASURBVHic7L15jKRnft%2F3%2FT3P895v3X0fczSHQ84MzyV3V1RE7W68sODE3iQOZq1AkJHDIATIGyQIEgQI4plBBERBpChZO3KWsOFAtuCEYzgRvJEcaANRkiWvY2kpc3nskHP23V131Xu%2Fz5E%2Fqqs5wz14zCx3FqkP8KKqp4vset%2B369u%2F%2B0fGGMyYMWPGD4L9qN%2FAjBkzHn5mQjFjxowPZCYUM2bM%2BEBmQjFjxowPRPyo38BHgYju%2BfL7ve7y5csAgEuXLhkiwixgO2PG%2FUE%2FLh%2BiK1euULPZpDfeeIPeeadPQJuCIECv18NoNDp6VRXVahXN0y2shqERQmBhYUEDMJcuXfrxONEZMx5CHmqhICK88sorFMcx7e3tidFoZG1ubvLt7Q6XUgrNBIujlJIkgVIKnm%2BjWqmiWQtMELg6rFdks1otHMcpHceR58%2BfN1%2F%2B8pfNw3zOM2Y8jDzUQnHlyhU2GAx4UZCdq8IrktzfP%2Bw5%2B%2B2BJSW3DRgvckNpKaGVhutwVEIbtdA2FV8oP7Rz33UTxigGeLq6Olc6jiMxszBmzPhIPHRCMbUi3nrrLXbz5r6VpokXp3kYp0WlKHk4HBt7EJEolCM0bKYUI6UJMARLGFR8Qj00phZo7bmy5JSnWuWx4%2FCo2awknPMky7J8Z2dHvfrqqzPrYsaMD8FDFcwkIly%2BfJlu3rzJDw8H7mDQD9v9pDYcm0qc2X6uA6dQNZ6qOlM6JEMODAQMYyAAJQNgDAQUHFZAYGgp1bON7nsmz8N%2BP4kNU0NVqJHneelLL71UEtFMLGbM%2BAAeKqG4ePEiDQYQqdrxOp1hrd1LGwc9Ux0mVTfVi5bEPNOsBc3qZJgLkIA5yvASAZqAFAArAVaUgEh4xR0wl7UFyQM3y7teWUSulJnNuelvbW1FFy9elESkZ2IxY8b356ERiitXrtCFCxf41ta%2B2%2BkP6wftrHXY49VePOclepVLtk6GNWGYD5CFSQnIexlSQ4ABoVAEnQHSeCh0CM0aZFXmeeg3mcq2mFK3ucoLVhQ5OC8BIL58%2BXIJQP9oznzGjIefh0YoAFAcx%2FYozmoH7bS132a1frbgJvoUl3yVDG8A5GIiDhowJQA1eQ4CDANIQBuOEgw6Y5BKoJQC0jhYbfpUq1a54%2FjOoHcDabIPrRlz3ZAARK%2B%2B%2Bmrx%2Bc9%2FfmZWzJjxPXgohOLq1auU27bob7eDwSCr9wa8Okibbmw2uBInyfAaAAuAAUwK0jGgY5DJDUEBAAwsGPLIsADGeFDGQWo4pGKQmsOgArHgYb7hk23bTq9NpNSQiEgrpeRbb72lfv%2F3f1%2FNsiEzZnw3P3KhmAYw%2B%2Fv7Yu%2Bg6x20i2CQVJ1Er3ElVsiw%2BsTVMBKkIzDdBtcHhqm%2B5izXjBSMAZTmJI1PhtdJs3kyfIG0CVEYC8N44qYI7sB1FqleMVRXuR2NboV5rorBYBy7rpt97nOfUz%2Fq6zFjxsPIj1woAOD27du4s7fHuweZdTAMxKhsMMmXybAGwCzAGJCOwdUOPHZb%2B85hyfUoA%2FKCCNpoQCrDtbEsaUI7V0tWaVKu%2BBoZ1FBKC6MY2OkQbEvAWpqDXzlJZTGy4njXbbe7HmN29O1vf7v8whe%2BMMuCzJjxPh4Kofj2t79N3W5GUSZYrCqstBqkRR0gB5OgZQHSQ9jYMi1%2Fv1xqyrHgrB%2BNy1jKUpZSEhdCcCa9oiwqoyyvjAvlpkpwRRYZqqCQhGGksdMhVDwHJ%2BfmyXaa1O9tiiQZiDwvGGPl9%2B0fmTHj%2F888FEKxt7eHwQAkWZ2k5cDYIcBcgDgAgKAgKIXPh7peyYr1ldpovrXQGwy60e7urhoOOZaXQy6E6yW5Ltq9gkzvkJdFlWldI8NcGDAUUmMUE3pjjqW6CyYClCUwGPVpNBrQ5ub1H%2FGVmDHj4eShEIrd3V3AmgezBDS8SXaDBAACESCYgcslfCFN4EIFnpW3WvP5yZNr5dmzZ9Wbb76JCxcuyPF4rAZxDM8d28pIr%2Bj2bKV6kLoKMAvGcJTSICuAQnE4sKANkEQJtE5Qq9V%2B1JdixoyHkodsHgUDGOHu%2BghGgGNxVHwblcAmwcDTNHY6nT17a2tLAKALFy7g0qVL%2BrOf%2Fax89NSpdGV1MVmaC%2FLQyxTHyJDJMC2TmAQ%2BDZQy0MbAGEBDoyx%2FJCc8Y8aPBQ%2BFUKysrMAPLNhCQyADmRQwEoABQOBcwPcrqFbmmWVV7Sgqq7u7nWa73a9sb2%2Fbb775JhER3nrrLVOtVmWtHua%2BxzPBc0kmNjDF0f8LIDKAUZAyQ1mkIDIIfd80m01j2%2FaP8jLMmPHQ8okIxXTgDBF913H58mVaXl7G6dUF02o4xrEyMDOc1EoYCWMMlOEAb8CtnCG%2FsmGBVcMkka3xOG4Oh7HfaDTY5cuX6dKlS8YYY7gRUikplZLaGDkxI2BAZMDIgEyKIm2bNOkYzrVqNOpyfX1JP%2F%2F887N0x4wZ34Mfeozi1Vdfpd%2F%2B7d%2BmX%2Fu1X6OXXnoJe3t7x99bXl4GALz44otsb6%2BDrZ2uFocw3bRnUt2F0j4MVVBKjrjwkZsVtAKXCUfYQ1VQnvdK2y4ix3GS5eVldfXqVSIiUkoK4kIwEoxIAEQgEBgZ2LwE033E403Y%2BlDaNqVhUM9arXrZarVmqdEZM74HPzShuHr1KsVxTMYYobW2RqMRL4oCaZpSURSwbRtRFJnRaISFhQUTBAFz3VALdyyxF5lOvGtS7ZEhASldjFOBXuxirjaHMEwpT%2Fe5kpFbrVa8%2Bfl5C0C5v79vksSIKEqdNC1daVxhKCCQDZABpwI2G4OpHVOk24qLURaEPG42a%2BnKyoo6f%2F48rly58ommSGeVoDN%2BHHjgQnHlyhU6efIkxXEsdnZ2LMuyPK213%2B127SiKmNaToKLWGkmSYDAY6CzLJICy0agwJixpzEDq%2FQPWjQXLlSFtGihyH%2BPYwiiW8FkJrTU4J7Ish1lWwJaWlujGjRtsPB65h72%2B3%2B5lTpy1uKIagSyQycHNGFztGZR3lCUGWRjyaH6%2BGZ85c1ouLy%2FzarVKP3H%2B%2FIO%2BJPcwuuu57%2Ft4%2BeWXTRzHZm1tTc%2Bmb814WHmgQnH16lXa2NhgeZ47%2FX7f73Q6QZZlAec81FrbQghqNBrHw26FEEjT1IxGoyLLstzzPFOp1PhSi6uyiLSWt6ifRijUEhk0UMQWhv3MWPmO0VlPGp1mSRKnUiZlFEWUZZl7cNCptDvjSm9EdiJrpFkVMAqkBuBmB7a1ZTw%2BLGsVipcXW8n6%2BjwqFSfQZYSD3RFpfXfY5kFUdPN7vlIAlAKM0Tg8hCnLVI5Gcf6nf%2Fqn2cWLFxWmUdcZMx4iHphQXLlyhc6fP8%2F39vbcOI6ro9GoURRFyBhzK5WKHQQBdxyHhBAgIpRliSzLkCSJGQ6HqixLGUWRLkvJLMvmjUphsjRSZCKK8i6VZQUm5SbuF8YpRtLh49iy1DDPkzhNUzUYDOxeL60c9sb1bt%2BEcV63pGmRMQQyHTjYNlV3H63KWM81TVmr2lKwmMejvMbUoR3bnDNDZBQApR%2BMRkzhADiDZoBUQJRqJKlBWRhdlGWW5%2BUgjmOdJEk2G6Qz42HkgQgFEeGrX%2F0qvf7663aSJNU4jueIqDY%2FP%2B8tLy%2Fz5eVl1mg04Hkecc5hjEGe54iiCMPh0PR6Pd7pdKxer2dGoxGSJIFWha74heasVJU8V3nR0wYwwmjJQVkYWmPXrQ6DwE2JiG5u7vh7B4PG%2FmFZ7458N5HzXEMQ04dwsGsa3r5ZbuZYmuPGt0sm856XmsTzmBRGMItpzqk0pBMNnWiYEtDG3N%2Ffd8KkNMRigE8oOcMwNdhra3T72qS51kWh47wo86KQ0WAQz0rIZzyUPBChuHz5Mn3zm9%2FknHPPGFNzXbe2srLinz17VjzyyCO0uLiIIAggxOTHaa0hpUSapoiiiIbDIXq9Hu3v72NnZwe7u7um0%2BlAykJxpot6jSWW5WTSUImyzG2b8larklWr1TzLuLmxuekOB2W121PV3a7rDrOmUMYljg4c2jMVa980%2FNiENiOSmpV6YHvW0Kr7BVttGbbQAHOYgUk08lKihIJSBuY%2BHQEiABbBMAbJGEaaoUw00rFCHhsUGdQ41mIwVjxPDNqD%2BEHcjhkzHjj3LRREhM9%2F%2FvMUhqGttQ4rlUpldXXVfeKJJ8T58%2BdpcXERYRhi6nIAgDEGWmsopVAUBbIsw2g0wtzcHBqNBur1Om1tbbHt7W3e7w8ZI2kaNSutVptjLZDKhJXz855mjFEU9dzOYVTbb2e1ztDzRnkoSuOC09D4%2FAAV5wCB3SOBFFlUktAZNasJa1VLzNeBekjkWgShDUqjYIyCIgXFAHO%2F4QJGMIJQGsIoInQSoB8Z2NxgdZFMXhD2D7VJM2WKWWhixkPMfQvFxYsXSUop8jz3hRDVer0ebGxsWI8%2B%2BigtLS3Bdd3j1zI2nW852d4lhIBlWbBt%2B%2Fi54zjwPA%2Bu65IQggO33eFwqEajUSaEGK%2BtrZXOvCOr1Srt7e3ZozitDcdlqz8W1XFatUvjEmcRQqurW2HX1IIxc%2FmIuBkR5zlVfYlmVaMaAowTxjEhywCjAJlpZJlBYQiaAYbu0xOgSbhjNDI4GChEGWDbhErA4ToMRKRcRxSVUJTccbRft83t27fv72fOmPFD4L6Egojwla98hba2toSU0guCwF9ZWbEfeeQRWlhYABFhOBxCKQXf9xEEASzLOhYMYwzKskQURUiSBMYYNBqNYyFRSrE8z0VRFH6WZWVZlnGWZempU6fUO%2B%2B8w7vdKBiO8vpgLKpRFrqFqXBGOXzRlY1gWDYrqamHidWqplYtyMh3FDzXIPAYHAcQnMDYkXfBAeYy2IKBazMt5rwvDICiNJBtjUEM5CWD69lQxkJ7yPU4oiJTVhw2qvFi0CxPnjxnvva1r93fD50x44fAfQnFxYsXiXPOhRAOEflBEDirq6tsdXWVgiBAlmXY29tDp9NBEARYXl7G%2FPw8fN%2BHMQZJkqDdbmNvbw9JkmB%2Bfh7z8%2FNoNps4Ks7CeDxmw%2BFQ9Ho9X2tdybIsvnPnjjw46Fv7hz3%2FoK2DfhS4mapzRkBoD1WzEmfzdSSepYhREvp2wZs18NAXsG0GwSddqUTv0wIOcAawadbBHLkf5uO5IcYA0mhoKJSKoIwPZrXAnIopU2OiIs3zwkTVaj1dWDglV1ZW7ud2zJjxQ%2BNDC8Xd8YUpX%2FziF7G5uSkcx%2FGMMV6z2bQWFxep0WjAcRwURYHRaIS33noLWZZhY2MD58%2Bfx9raGowx2NrawhtvvIE7d%2B4gCAJ4nofV1VVwzlGv1zEajdBqtTA3N8fiOLaTJPGIyDHGFGmauYNhHvbGrhsXdaaNC5f3VS1MspVFa9Sqh1GZKyuLbHHQFXycGKoEDgtDH7Ztv3c%2BdwvB0eM0hiKlRFmUUGrSc2ImF%2BD4%2FN%2F%2F9fTfaHLBYLRBlit0%2BxKDiKNaX0Fr6Rxac0sIupGRd7ZVp9Mu8nxcbm1t6d%2F4jd%2BYBSpmPJR8KKG4evUqvfLKK7S%2Fv4%2BXX37Z7O3t4dKlS2Zvb4%2FiOOaMMcf3fbfRaIhGo0Gu6x7HHIgIBwcHePfdd3Hnzh1kWXbsWnzrW9%2FCH%2F%2FxH6Pb7eLxxx8HANi2DcuyEIYhKpUKarUams0mHRwcsMFgYAFwwjAs81KFubKCXFVtaerMkDQWG8uqW8ZzjfpgebEVjfqwD4qMuiNjemMZLC0t2tWFUyys1cA5hwFgtD5qN38vwFqWJYo0wXDcR6%2FXQRyPoVT5nkjebWEcC8jxl9AGMIaglEFeEPKCYNkVtOY3cObRT2FhcQnb29sYjTMzHsem1%2BvpN9989UHe1xkzHigfKBRXr14lALzb7dpSSjoqt5Zf%2FvKXdaPRoOFwyJRSolariUajQZVKhaYCwRgDESFJEty%2BfRtbW1twXRetVgsA8Nprr%2BG1116DMQbr6%2BsAAM45LMuC67rwfR%2Be5x0%2FMsa4UsaO08KL08JPc%2BGVuiIMeWC6YyyWlraNOKh441otjJUqOOv1yrQQ0verfHHlgnjq2c%2Bw1dVV2JY1iYNoDa0UlFLIiwJxHKHf7%2BHwYBdFoWGPOyhFDk0FYI5mWtxzhd4TCq0nMYk8M4gSICsmcy8Ajjnfw9zcElbXTqLZbGA0iuA4Nji%2Ft3JzxoyHkQ9jUbDxeOwmSVLpdrsiSZKUiKKlpaXi2rVr0FqTEILq9TqCICDf948FArg3YJllGXZ3d9Hv9wEA%2B%2Fv7ODw8hOd5KIri%2BC82YwxCiOPjKCtCRMS0VjzLUitLczfPHavUjMEU4BQbS0jp2nZe8cLcsqxSKVUcHnZVFGVWszlfW1hYNo9sPGpOb2yQ4zjvuRdlgSRJ0Ot1kWcJ8nSIIt5BwHdRW%2BrDZjEEkwDdNVKH3js0AVIDaWbQ7Wts7yuUpYFWBpoRtHFgWwxhGKBarSIIQliWBc4figFjM2Z8ID%2FwN%2FXKlSt05swZStPUHg6H1YODA28wGERaayWEUJxzk6YpgIklME1zTrMaU44yGBOTvihQHo2TKooCUkoopSYxgLv8%2FffPrTgSHzLGcKOMgNGCKOc2hhA8gyeGphIYaXGW57ksl5eX1Ztvvon9%2FX0lhFCMcW3bNjzfRxiGcBwHUkokSYzxKEX7cA%2FbW9exdecNDNvvwlY7WKv1sFJNUXclLGZwnC2lo3GeNoOyCDkIw9TgoGsguEGWGRA0SkkoJTBOCLbNYNuT9O%2FUvSKimUUx48eCD%2FUnLc9z6vf71u7urt%2Fr9TjnvKzX66pWqxV5ntPUgrjbkvhevF8MpkzF4O7Xaa2PYwZHBxERc13X9n2P1UtjSSMp8BOAcoQeTKteV3MNX3leqL%2FxjW%2Fg6tWrqFarptlsHv8cYFIZWhQFxuMR9na3cfv2O9jdehvj3jtAdhvLdhvLTowVN0eLKbi5mWRCCCBGgAUYwaBsYCwYDlKD4digN5hYEtUKg2VxJBnDMBIolAfLciCEBcuyji2lmUjM%2BHHhBwrFpUuXzMsvv2yKopC9Xq%2FodDo0HA4D13W153kQQozn5uZ4mqZsMjBGQWv9XZbBNO4w%2FZBwzkFEsG0bruvCdd3j%2Bop7Mg5libIskSQJ0jQlrbXgnPvC4qZRDx3HlawoQYxxE%2Fi%2BaTRC02pUUK1W2RNPfBFXr16953wmlaA5BoM%2B4jjCzvZt3L75bRzsfBsmu4U5p42VxhgLPEe9LOEnElauwcqJSEAQyCNojyNjQE8ZbKcKt7oGB32DtACIJpZDoRyUsQ1pbAjHg%2BOGEGJyjh8kqDNmPGx8GItCt9vtot%2Fvp3mel0opVylVK8uSyrJ0ms2miqLIAcCmbsVULIwxsCwL9Xodi4uLSNMUrVbruO9jdXUV%2FX4fnudhYWHhuIpTSok8z6fdpRgMBuj3%2B4iiyNLGMCkVDARTmpFSDCCaBCPTnI%2BF5SilnDRN1UsvvSS%2F%2FvWvE2Ps2M042N%2FDaNjBwd4d7Gy%2BhWTwHVT4FlarI6z7OeZNCS%2BVEJECpZMuUnPUs6EFQbocscNxUBBuDgzu9AwGMQBiEJaA1C4KXYXhTQjPgW0AoRkcxz8%2BtzRNkaapUUrNBGPGjwUfKBR7e3sYDocSQOb7fk5Eoeu6juu6dQCelFIaY0SWZWI8HlOWZZMPbZ4jTVMIIbCxsQEAKMsSp0%2BfxurqKmzbxmc%2B8xmsrq5CCIETJ07A8zykaQrGGJIkQZIkGA6HODw8RKfToSiKUJZKjMYlcukhVwEZOPBcgYqneBxH3mA0qvuupcLQ0ysrK9kzzzzDd3Y2RRKP%2Bc72bVQCDc%2FKkAxvQcW3sczbOFlNsOqWqJUKViRBsQbKo2G8LsG4DIXNMBIMXcPQiQj7MbDbN%2BiNAA0Bz%2FchnAaI5uHaK3C8RYzjEocHXcRJDMY4kiTB3t4eiMjs7%2B%2Broiik7%2Ftqfn7%2Bh3mPZ8y4bz5QKC5fvmx%2B%2Fud%2FXgdBUBRFkdq2XVQqFWt%2Bft5xHMdOkkSPRiMwxni326UoipDnOYqiwPb2NobDIVZXV7G%2Bvg7bttFoNLCwsADOOarVKs6ePTvJeGiN0WiEOI7huu5RDGF8bE1Mxue5ZGBhMOYYpDXkZhXcnkOdu%2BQFKVc4cONoH0UWac6hiqKgtbUlKx73vWjcsfa236BQ3KKTiwVWvAGa3ggtnaKhJYKhAs80kE2sCLIABBymypF6DG3JcHtgsDUA%2BrmBBCAVA7gFKavQbAVh8wyac6dRb67BdkJsb%2B8gSQpkeY48z7GzswMAWilVDgaDFEDSarXKtbU18%2Bqrr86KrWY8tHygUBhjcOXKFbO1tVUURRELIZJKpeIsLi46tVqN9ft9XpYlRqMRBoMBjcdjZFmGfr%2BPa9eu4eDgAM1mE6dOnsTiwgIq1Sosa7JP1HNdFFmG0WCAnZ0dtDsd2I6D1dVVeJ6H8XiM8XgMYwzm5uYgLBf9kUE68jGWGyjZBgSa8JgD5pdUCatCJtIr8wOtlFGjUdcusp5dCbKaZ8XOUn3IVqsMZ%2Boa675ETRZwIgmeKlCmATmJRRifQVcYyorAyGbYLwi3ewZbXWCYGGgwMC6gjQvwJsLwFJbWzuORRy5gcWkNQViFLCVGowicc0gpMRqNTBzHut%2Fvl5ZlxUKIQa1WGy4sLOSj0UjPhtXMeJj5UFmPN99806yurso8zxPOeUxEAefcWlpa4idOnKBWq4Xr169Da42pUOR5jm63i7fefBMEYH9rC6dPnUKr2cS0hiGJInQODnD7zh3c2tpCUpY4ceoUqtUqiAhxHCNNU1QqFSwtLaMogX4cIdMtlLQOxRYB4yNXApoRwioR7BEfD2NPyqQx7LUDI%2FfFcqvvLTZL%2B8yaoo0FYNE2qBQSItEgBzBggEswADQjlDZD5DB0DMNOH9jsaRwODbKCwC0LnLmQpgrDF9FonMbaiQvYOHMBa6sn4Pn%2B8Xt3HAdlWZo4jk0URcoYUxhj4nq9PnBdtx8EQfzYY48VN2%2FenKnEjIeaD1vCbb761a8qIUQ%2BGAziNE3T4XDoJEnC19fX0Wq1IITA%2Fv4%2BxuMx0jSF53loNpsgALffeQedd97BTqOBVq02EQqlUEQRhv0%2Bdns9tJVCfX0dtWr1eLVfmqYoy3Liriwuot2JoIxEaSowrApDDrThKBVBagHLDmGxGmWJLbQ8CAQ78JqNDltfzPmJFU3ri4waHuAUGjpjKAQBgQH0pPTaGCBTQCcFNsfA7tCgHwNRBuSlgDI2YKrg9hJqlZNotDawtHIa6yc2sLKyimq1BmMMpJSQUkIIYcqyVHEcF8aYzLbtuFarjefm5oZBEMT1er28efOmBvChpn9funTJTMvfZ8z4JPlQQmGMwdWrV41SqgQQF0UxHgwG7vb2tlhYWOArKyu0srKC0Wh0fCwvL2NjYwM7m5vo376N7Pp1ZNevQwkBcA6uNURZgpUlGOeora%2FjzMYGzp07h4WFBfR6PRRFAaUU6vU6ms0m0tRAiP5k2xfuPo7fKIxRIJTMFin5boKKl8G1JUlJOOwBfcLExVAANMGY9z6fSgPjxGC3q7HT0UgKgmVxMG6DWSEMzcGvnsTS8lksr57B%2FMIKGo0W6vU6qtUabNuGlBIAjiovuTHGSK11HIbhqNFoRK1WK6lUKnmapubmzZs8TdMPtYQpCAL84i%2F%2BovnKV76ir1y5YmZj%2Fmd8knzoGuKLFy%2BaK1euKMdxUtu2h1EUOQcHB%2Fz69ese55xblkW%2B72M8HqPdbmNpaQmrKyt48oknMNrawt7%2BPha3t3Euz7FkDAhAF8C7to10cRHh2bP41PPP47HHHoNl2xgOh8c1FUQEwQUc10LoGbh8hLjsQ2sfjBkIJsBRosgHKLI2jO4j8BNy7RxlqXDYVeiPJntMCXhPW%2B7WGABSGgwjg3ZPI84YbNtGEIbwnHlUKifRaJ3B0sqjWFk9iVZr0i5v2w5c14XjOJjOAz2e3lUWAADXdeB5PizH4lEauXE8spVSRv%2Bg1KhSk%2Fm%2BCtCkjZRSK1LlQnMhD4KguHLlip6JxYxPio%2FUbHDp0iV95cqVMgzDSEpppWnKb926RQDcVqvFjTE0Ho9xeHiINE2xtLSEM2fPor%2B%2FD7mzAzEcoprnWJcSBkBsWZDVKqqPPorHPvMZXHjySSwtLSFOkuPCJGMMRqMRDg8PkUSJca3chE6EcWKRNiU41WBpGzpXNOofgMk7CKwOWtUh6mE%2BWSEIOrJC3sdxM%2BhkMIUyBKk1klwgzV1wZw5OeApLq49h%2FeQ5rKxtoNVaQBiGsCz7%2BD06jjMJ0B4hpZxka3o90kYJr%2BL6xDRPyqjyl5qv%2FVWfkj%2FfTdzf%2Bcbw2b%2F%2Fva7zpORdQxYKZT5pcbdtR0olU4usgWVZY9d1ZxO7Z3xifOSupPPnz%2BubN29mSqlhkiTU7%2FehtaZer%2BeWZcmiKKJGo4EkSWBZFuYXFrBx7hwO79xB5%2FAQB0mCufEYkgg7YYj05EksPfssHnvmGaysr8MPAuRFcdxByhjD%2Fv4%2But2uFsKSDIWs%2B6mJoltcp10GXSWkFrJBScOyR4HbZjU3JUY5YEoIbiDEUZn4XedhcDSVXwLGTLIYgjiEDXBLwOELWFy9gHPnP4VHzpzD8soaarU6bNu5p%2BGNMXZcVTpdQdDr9XBn8w6297dI8ZwHTcstUTjnxdbptUr2C0VJnCN%2B9N9gf%2FxTf1Sc%2FW9HrDqevjutDXSpkCcF4jRFOiqgtTGO4yilytRxHZqbm5PLy8vylVdeKTHbAzLjE%2BAjC8WXv%2Fxlc%2FnyZcU5TznnUEpRv9%2FnvV6PsiyzjTG82WzStFnMDwKsnjiBjaeeQrS7i61%2BH6oooBjD3tISKk8%2FjbPPP48TGxuoVCrHnaOO4yAMQ3iehzt37pgoispKpRI3Gs24VWdqOOqJPG3zorBJJZwKh4SytaPt0k0y4tv7INdSaFQ06lXAsSd9GoSjyVNq0go%2BGDGUykNYacEPZYk5YQAAIABJREFUaoDF4FU55isn8eTTL%2BCppz%2BFlZUVBEEAzsVxxem0%2BnRajp3nOfr9PnZ2d7C1tYl3b15De7QHCgvyfcYVY1jKozMOZ%2FzxL%2FwCxv0D%2FKvf%2F4ef%2Binz9te2qmu%2FvN967C2jgSItEQ9TZEpCsQJK5CAiKA6Ry5S0VgVjLAaQhmE4Xfk%2BY8YPlY8sFMYYEJG5fPmyHAwGqeM4LMsy3uv1TKfTCRljzmg0soqiIK01hBBoNJs4%2FdhjaO%2Fs4K2dHXTiGMyyUHnsMZx67jmcOXcOzVYLtm1j%2Bt94nodarYZGowHXdU2%2F35dpmibNJgaNWpDV%2Fb4ZDvusVIANl9XCmuv7Vr0sc9bJtGsUqO4D1QCohgyVkMCPwoZaA3EGRAnDOPWh2RrmahewvHoSpTQIezFqjUU8evYcTpw4iWq1etwRO21Wu7thbVo3cvPWTVx7521s722in7SRsiG0l0HZEppKSKmVZRGEcHDuJ%2F89LJ56Bt%2F4B5caq%2F07v1wvx%2F%2Fg9snP%2FqM8y02eFZBlCeEwVN1JulXlxjADmMkqM0az2u8ZnyAfayDC3WIBIDk8PMR4PC6llAVjrF6WJSvLkmutiYjgeR6WVlZw%2BsIF7Gxt4Xqew%2FN9nH3uOTz65JNYXF6G67rHXaS2bSMMQ9TrdczNzWFpaYnSNOVFUVhRFPGFhQX59NNnskajIW%2FcaJu1tZCdOrUajIddZ3e%2FH6ZJYjhJBDYDYwKMT%2F7qEwMAgtGA0hzgIWqtE2guPIPzFz6N1dV1RHGCra1tOI6HRqN5PBB4mpacfj6nAtHr93BwcICd3W3c2bqFzb1b6CdtSCuBclIUMkFZZFBaITOFtHwGLTMAGo3F0%2Fi3%2F%2FrL9Af%2Fx%2F%2BAW9%2F5k7965u3fffJfmlO%2FGo%2BsoTEGjjcZ2SdzbaRWCsQyECJpZJrnuVpYWJhZEzM%2BET725JSpWHzta18rB4NBDEBKKbUQQiil7LIsmdaagMmsimqlgpOPPILOpz8N43kIfB%2Fnnn8e6ydPIgzD445SxibZhkqlgmaziaWlJYxGIxRFYR0cHIR5nqs4jun06dPjRx99NH7hhaQAaqosO%2FJaNFBlKY2UBpbnwzAHvbGG2gIcm8DYZHWXNgzS%2BLDcNTxy9lmcffwz2Ng4iyCs4PDwEIPB%2BNgFmgYs70YphfF4jJ3dHVy%2F%2Fi5u3LqOdv8AiRwhwQC520emI%2BR5glLnkEdj9ApHlwCgZAEYIG%2B%2FDea38IWL%2FwWdeP338Pu%2F9beffYFu%2FK13ndZ%2F%2F6ZaeZ0ZDl0QirQwyFG6FX%2Fs2s6QNMW1Wq38%2Bte%2Fjueee%2B4%2Bbv%2BMGR%2BO%2BxqxNBWLixcvys3NTYzH47RSqeRaayWlxHRzOWMMtuNgYWEBTz%2F7LOaXluDYNtZPnECtXr9nORARQQiBIAjQarWQpimO3BhGRE673a5nWeYcHBx4URQNGGPjeh0lY4w5joNarYaFhTnMzzdQDS0w5ChMCaUJnDg4F%2BDCQuBVsbR8Cmcfewobj5xFq9mCPup2nc6JeP9A4Wnn5zRY%2BZ1rb%2BP6rXdw0N9FhjHglihYhNgMkZYxpCqgjT4%2BJwNWAhpa5jDQ0OUYstMGd1s49fjzWFj%2Fn%2FBP%2Fu7fqD1m2r%2B0wNL%2F%2FQ322X9ohTUdicSMh2NZqzby%2Bfm5JAiCwnXdWXp0xifGfc9im4rFhQsXjOM4xrZtY1mWmVoIUxhjCIIA6ydOYG5%2BHowx%2BL4Px3G%2Bq9WaMQbXdVGv16HUZFuwEII459y2bbfb7Vq9Xs%2Fu9%2FuWEMKO4zheWFigSqXCGWO0vr6Oxx9%2FDGHoI4knO0MAMxkcY1twHRd%2BEKLVmsPS0goajSZsx0ZRlHef0%2FHzaTfsYDDA%2Fv4%2B7mzexo1b13F7%2BwZ68SEYa7vrxZ0L9WT4dIXKZwUn823j%2FO0%2FE97bQgjYlg3H8cA1SSAGtAQMQCBAFSijHah8ANufx8Wv%2FCr9s3%2Fydwze%2FubP%2Fmv8m0%2BoUxd%2FZTdeO9za3DKe5%2BkwrOsgCPTFixdnIjHjE%2BOBDW0MwxBhGLIgCITv%2B9y2bdwtFtMBNr7v3xOPeL9Zf%2FdrPc9Dq9U6rlVwHIeCIKDNzU3a39%2F3hsMhH4%2FHdpIkjuM4hWVZolar0draGs6dO4dms3W0CHmAspTgnN01LMdDEARH2QwOY3A8rk8pBc45tNbI8xxxHOPw8BA3b93AjVs3sLd7k%2FPOH5xdzneePq2jZywtHwcMt4SFhbXHTDrYoqfK4kvfcby3XceFa3sQ5EBGeQnE0Hqa1ZwsFyFjoLIhVJmCJR385J%2F%2FK3Ty7Kfw6m%2F9%2BhPi9m%2F%2BzbXm87%2FSCx75PcbYcdftjBmfJA9EKI7WCrIoioTrupbnedxxHHq%2FCPwgcXg%2FU3N9OqzXdV0EQYBarYZWq0W3bt3i77zzjrOzs0NRFJnxeBz7vs8450ci46PRaCAIAjiOgzRNobU%2Bnu3pOM6xyzPNYEwH5uR5DsuyMB6PIaVEr92m7%2FzR3z05vPPNpyk7fHrJZE%2BS0S4RQ6W1ajae%2BRlaP%2F8i5taegO1V6eu%2F%2FDnkcT%2BsVxuwhQuUHPlQIk50iRpgtDya6P3eEE4igpYpZJlCFREWWjX85b%2F2S%2Fid%2F%2B1XQt3%2B55fPs7fP3eJ%2F7r95EPdrxoyPygMRihdffJFef%2F11IaV0LMuyfN9nnufdY1G8fzzeh%2BFuy8K2bXied7zrw7Is6vf7rNfrMaUUAVB5nsMYo%2BI4NtP9IUEQHA%2FCKcvyuPZhGoeY1kQA703WStMUg5t%2FsND55mvPlIPbT5t8%2BLTRZc0G4FWa5sS5n6H1Jz6HxVPPImwsE%2BMWcFwwJcEBCMaZywIUY4N0kCMZ5RhbsgAAo9Sk%2BOEua2uy55QAI6HyMajMQayLv%2FhX%2Fjp961%2F8P%2BbGG%2F%2F8Z8%2Fmv3VO7b7281j7z9%2B633s2Y8ZH4b6F4uWXX6bxeGxxzn3XdYMgCJxWq8XCMKT39z5orY8%2FpB92buRULO5%2BfZqm04YrZVlW4ft%2B4nlePB6PRVEU4eHhodnd3TWtVovq9frxZrC7J35Pmbob7dt%2FUn3z9%2F7OUwc3%2FuUz%2BfjgGah8EQCE7WP5sc%2Bak%2Bc%2Fh8Uzz6O%2BcJqE5QLEYIyCLlOofAStJIRbBUiAMw1OxKLDEnE%2FQ56WgCGUllUCgFbl8Y6Qo5PE1KowRCBMrAsDgipu4sknn6Sl9TP4o9%2F5%2B0%2Bz5PYfJX%2F4H%2F%2BHeOmlf3S%2F927GjA%2FLxxaKK1eu0Pnz52lvb09sb2%2F7cRzXhBDVpaUlZ319ndWOtnEppZCmKfr9PrIsg%2Bu6qFar8DzvnoXFHzS9ezo5ezAYYHt729y%2BfVv1er1Maz3inA9834%2BklL4xRnY6HfX2229zzjlWVlbo%2FQHTu4Wic%2F2ftV7%2FP%2F%2FL%2F6pMB2cAEOMW5pbPmPVzP4mVR57H3OpjsLwaEWOA0TA6h0zjI%2FcBALH31gpgYlEIBjBVnP3C6E%2F%2FF3AA4eR7jBEDAhgjj376va7HVCSOrQstoY0GkgINS%2BMv%2FLv%2FEf7gd%2F9xEI%2F6V%2F%2FHn%2BNX%2FpPfVJc%2F7v2bMeOj8LGE4tVXX6UXXniB3bx50zo8PPTa7XZNSllfWFgI1tfXrfX1dQqCAEopRFGE3d1dvPvuu%2Bh2u6jVajh58iQWFxdRrVbhuu49FsP7BWM6kTtJEnQ6Hdy8edO8%2Ffbb%2Btq1a3mv1xsbY%2Fqc86her8tarYZ2u60Gg4G8du0aH4%2FHfH5%2BnqY9I1P3RQhhABhjDPb%2B6aV%2FX%2BXRo49%2F%2Bt%2FE0sanYNdPw6%2B2jtwJYDSOoYdDaDX5cBPjIGJHjwQifvz%2BPQoAGFiWgOtW7XrLW2UEsKNiLzIawAhG6e%2FaWYq7RGJ6HQwRSBtoLUHGgCV7%2BOnPfZ79qz97HbtbN%2F7rv%2Fll%2Bp%2B%2F8oppf5x7OGPGR%2BEjC8XVq1fpxIkTvNvtuoeHh2Gv16sMh8Oq4ziVMAztRqNBQghEUYR%2Bv492u43vfOc75s033zSHh4emUqng1KlTdPr0aVpZWaF6vQ7P846Di9O4xt1pyWnr%2BtbWFm7duoXNzU3ZbrdTrXXseV6plBIHBwdOpVLxAYiiKEy%2F39e9Xo95nmcmW8YYXNdBo9EwlUpF2bYtKXq3YsXtn1p99Dn8xF%2F4a3j3ziFu3dyD1ttQSgIgcCEmtRdcgPHJ%2B2NcgHEOzjgY53AcG7ZlowkPtsXhh01U1x%2FBk4%2F%2FJTi2BdsWsC0BBok3XvkFeMFEUHBXUPdukTDTbAgIhhiINLRWMNBAEeHcufPY3brBpOB%2FEcDfe2C%2FDTNmfB8%2BslBsbGwgyzIRx7Hf6%2FXqnU6nHkWR7ziOzRjjw%2BEQN27cMIwxjMdj7O3t6c3NTbm%2Fv1%2FGcax6vR4bDodid3fXWlhYYM1mkyqVCgVBcLzfYxpPyPMcURSh2%2B2i3W5jMBggiiITRZGSUmqttYjjuHK0Nd2uVqs%2BY8w1xliWZXHGGFNK0WTqlMJoNES32zNB4KtarZaujf%2FvnzZGi0effBFGFrjx7jVIZcCFBc6tiUgQgTMCZwyMEThnYHxSrck4g%2BACnHFwzkDEJjUScgxTJijTAbgS4MqCVhaIGYAI2WAP0BIiXIGRKXSZAMC9IkHfQziOnttUgBgDtPoSZkIx4xPgY7kew%2BHQHBwcmE6nw6Io4lmWUZZlutfr6WvXrtH169eRZZlJksQkSVKWZZkyxuJms1lorXmSJN7m5mawu7vr2LYtbNsm27anYkEAaLrTI01TJElyNIV7soPUGCMA%2BFJK58iloCNhEJ7vi2azRZ7nket6k%2FgEY0jTFLs7O7h16yZtbt6B53nlydX9F7mwzPKJx2g07KMsS3BhgxGBcToKvLIjcZgEVadWBGNHVZ78veAsYwRjJIyMoVWBMu6CSwtcWRDaAnGGxtqz6G99C9%2F5p7%2BE9U%2F%2FHPz5J1AM7kCnHRit7hGEux%2Fvfq6VxMYjj%2BPGu2%2F%2FzJX%2FgNxLf89kD%2FbXYsaMe%2FnIQvHcc8%2Fh13%2F919XBwUE2Ho%2BHR0t%2F3OFwyHZ2dtButyGlnC4d1o7jFLVaLWk2m9Hi4qI0xohut%2Bt3u91iNBr5eZ47eZ4LYwxzHIdXq1XOGGNJktBRuvO4psLzfQS%2BT7ZtW47jcCGEcV2PXNeF53nkBwEFfkC%2BH8DzffieD9txwbhAEidgzMbNW7ewt7dPdSdxxar6yaWTT5CwLRzu7k3iCMwcicTkIIbjfg%2FGCWwqHEcWxcQNYRPxIDYZcKEng3mMLmE03juIYeHcF2GHLXTe%2FUO887v%2FHeqnPoO1p%2F4dcLcGObgFUyYwR1O9zF1BzknAk8HQ5Hsrq6u48e5bXi3jfw7A%2F%2FXAfzNmzLiLjywUR12jqiiKVGutjTFpWZaWUoqUUrAsC1prMsbQUfBQMcbKoihKzjlzXdc6yl6UZVnmRxvBdFEUvCxLc%2FSaSXDwKHYxPVzXhe8HCIKAgiDgvu9jKgquO3FdbMeFbTuwLRuWPdn3CeIYDgcI7myCMQ4pJb14dvyCgbFPPPIUoCX2DrtgIHAiMCJwAjgDOCMwAsSRePCjYyoYnE%2FcEcEnFoVWJYzRIC1hZArDJDQroZkFrSYxidrSOYTNU%2Bjc%2FCMM7vy%2FGG19C0tPfgmt05%2BFGWzCJIcw5v0icW9WJHCm8Q3zJcyEYsYPmY89j%2BLixYsqiqLUtu1cSklaa9RqNVpYWJiKgVWWpSAiPhwO3U6n48VxbDebzUBr7eZ5Lhhj7Mj14JzzqUVBlUoVnufC8%2Fzjkm%2FHORIN18ORBTH5t6Pv2bYH23EghH3kCkxcBAIhLwp0e30kSQatDSzbxnJd%2FTSIsHryLMosQRSlYMKaiAQzqPIBOHfAhQ3ObTBugwsLTNhHQU0LjFtgXEEwDU4KHAWMjCdDfvMeZP8d5BaH4hylxcDfl9HxaosQtofhwTvY%2FbN%2FjIPvfAMrT%2F9lVBqPoOjdgNIKPyh1urS0ag72d78Eol%2BYjeae8cPkY8%2BjAGBoMojyuBb5i1%2F8Irmu60ZR5JVlGZZl6TLGbGOMMMaw0WgkjDGO67rC931WqVTIsiw4jkue55HneQiCkIIwIM%2BbuA6OOxEI23Zh2e5RnMKGZdkQlgUhJgfn7wkEsaMPEwhKSYyjGJ32ITqdQwAazYrPQ4debC2uwvN87Hf7IBgwmiQiGGNQvAJwG2D25JFbIG6DuAUzPYQAuAVYFogLMMuDpqO6EBGAe3OwLH6U9ZgEPN%2BPW11EZfEMxoc30d9%2BHVv%2F4n%2BFt3AeK0%2F8DETRRxm17xGJu1Onp06fov39naVf%2B1k8958Cf%2FKxfgNmzPgQ3Heb%2BfQpEeH27dvctm27KIq6lLJhjHF937dc12W2bZPrehRWQhYGIYVhiCAI4Pk%2Bea4Hz%2FPhupOYguO6sKxJylFYk8G1wrJhWc4kG8GPAorEQcf1F%2B9Vbk4eJinWolAYDPrY2d7CcNCF53l44XT0BEFXTp46C9ISh53hRCCmNQ%2FEoEQdsCxAWCBhgYQ9eeQCJCxA2OC2N3m%2FR7EQLgQMJqXhzG3Aqp2A41hwbAHXsWAJ%2Fn2vZTh3BvWTL2D%2FnVcR730bt%2F94H9VH%2FnW05jcgB7egtPqu1GmtEkzOF%2BxLmAnFjB8iD6x7FADdvn2bOOcWEfmO4wSVSsURQjDf91GtVlGvN2h%2BfgH1RhOVShW%2BH8BxXNiOc%2BQ%2BTOIL%2FH3uA2PvZRuI7i7MomNR%2BF4opRDHMQ72d7G3twWtJFqtJlbz0U8CwNrJR2GMQneUgJg4DmAyRiBdgLQBaYAMgdOkFsJxA1iOB8v2wIQFGI20exv93jXknWuQnUkbhjYGOulAKQElJwcTP7gZzhQS1eWnIIJljHdew%2BD676G%2Fu4T5k8%2Bh4hcoosN7C7O0RBhUTJzE%2FxaAv%2FEA7%2BWMGffwIIUCvV4PjDHuuq7gnAvOOdNaU5qmIGJwPR%2FEBCrVBubmllCt1uC4HizLPhoYYx8VNrG7hOBeQfhBwnA3RmuUZYFet43trTsYDvoIwgCVSgXBbvZCENRMrblAwyiHVICwpm7LJO0pLAHL9eE4Piw3gGVPrJkijxAdvIW88y7U6Dp4vAnkXZij3g3DbOjgNLg7D6MLGKUnTWBKwdAHCIVSMFqC2QHs5Z9APtqGivax%2BfYfwqqdwNrqOkSxd491cebsWfqz1%2F70qV%2F9OTr5n%2F2muXOft3DGjO%2FJAxWK0WiESqUCy7LQaDRoeXkZnudBSomyLNHpdEFkgcgCFx5cr4IgdOC4PizLBr8rvvBhBeF7YYyBVArR%2F9femUdJltV1%2FnPfEntERkRm5L7U1lU0DfbC1mw9MpA6CCo6Js4cR9QGqpoeRT3qoCJ094jogAe0W6CrwWlGxeN0DnOG0TMKyYwCHqSBXqC32pesrNyXWDK2t9w7f9wXkZFrZWVXdQGV3zpR8d6N%2B27c9yLf9%2F3uby2VmJycYGryAkIourt6SFWf2CeU2zm07xBgsFAoaf8I08YORwmF49iRKJYdBgWV4iz1iWnc0gSydAHbncOUZWzhYiApyxh1owtppTHCaaxwnEho88uqVDNodPX%2B2lMVQLQbV2SQ5RnKS5M8Ob9IR88e%2BtJhRH0JIQS5jnYALIwfB%2F5sRxdsF7u4BK4oUaSCSuWJRILu7m72799PJpPB8zwKhSL5QoFCfpETtRr5QoGlxSV6%2BwbIdXaRTmeIRGJYwnpeJAGaKGq1KrOz04yPn6VUypPJZOgf2EPtsb%2B%2B3QcG9h0CIZgvOIElw8R16tQqRdxqEbc8j3CWMGQFizohoZPNVKRFnU5qKkZNauVlNGQTMSyiwsLc0Paggpz6CkOIVfn1DdGYc3Pyq%2BuPCBPH7sSTVZRfZHx8nDMXYrxoMEVntITpu9iWrVzP%2BQl2iWIXVwlXlCiAZmKYeDxOR0cHPT19WLZNrVpjcVG7Yi8tLXFx4izzc7NcuHCOwcG9DAzuobOrh1QyRTgSwTR3Thie51Es5BkfP8vU5AVMw6Cnt4%2Be3n7O%2FvPk7eFwRHXk%2BoRTqzI5NYnv1nFdB6UkJh4WLrZw0GVKbSoihqtC%2BCrIpcmKqUcggkRVBhgGhhkoP4N3ww5hhCzMkI1hN45fe04KocDAxVAuQrkIz0WYrq5FYoA0I9SEia%2BqOG6VJ0%2B5DN9%2BCNud49CNN4pnnv7uDz%2FwH0TqV%2F5KFXf%2B6%2B1iFxvjihMFrOSQsO0Q8USSZLINw7DIdfbQ2TnP9Mw0M9NTLOULTEycJZ9fYGZ2ioGBPfT3D9KR6yKRSOrlSOAevV3ocPQa8%2FOzTFw4x3KpQGdnJ319g1iV01nfWd43dMOL8WpLLFfq7G1XoEIII6LvfAUYhjaFaldNwGwSgTBsMEwwTAxMlGEG1pmQNtU2zLaB6da2Q1imhWXbmKYRSA5Kh6w3XTZ9lPSxPRfh1gk5LhHHwfM0gbmui%2Bc0th2UV0f6EtcXZLpvpMs1efqp79o%2B1iuBL1%2BN33QX1zeuClGA0Ux5p8mijVgshVKKdKaDTDZHLtfJ3OwMs3Oz5PMFzp4%2BxtzsFFOTE%2FQPDNHd3Ud7Ry6oEh5elS1rM%2BjgL5dCPs%2FFiXFmZ6ewbYve3j66unpZPv3tNEBPbz%2FSrRO1FQf7E0F8hYkwLRA2hmmCYQMWwjIRwgbT0uRh2Ppl2tCyLQxzZd%2BwwLAQwYvG2BiArjCG1OSA9JDSQ0mXkHSxPTdoc1C%2BB76jtz0H6dfB95B%2BHeXXQSo8CfFEqnH%2BfVfn99zF9Y6rRBQBhMAwTEKhCNF4EsuyicVTJJJp0pkOOnJd5OZmmJmeYnZ2hkKxyMkTzzA5eYHu7j6G9uyjv19XDo%2B3FAbejDCklFQqFSanJjh%2F7jS1apme7h56%2BwZIZzqoWTrHRMi2tdYgKA8olEIKCb6LEBWkEs1UdUIRKBKChYZhBtrH4F1o709laOlDYATthj5GBPvK2HAVpaWK1RKGUlKTiJKggrIHyteSh%2B8HfTwQFrbK4tWLjcu9Wz1sF1cFV5coIHhaG8FSJIxtay%2FLSDROPJEklcqQzXbQkcsxPTXJzMwMxdISZ8olFhfnmJmeon9giL6%2BATLZdqLRWOCJuVrCUEriOHUWFuY4d%2FY0U1MT2LZFd08fuVw3sXhCLx9ALy8CkkApJAqkWmeRECh8QEgR3OyBfiGoOKaJAWSDGIL4DBqOUc0s2wSu1wpU8C5AyYYGU%2BqPlNQEJmXQ10dJpWehJMiARJSvtw0Lw0uCriu0i11cNVx9omhCE4Z2aNLRliE7TDSaIJlM05bOks3m6OicZm52loX5OQr5eQr5RaamLjDZP0R%2F%2FxCdnd1ksx3EE8lVqfQa%2BSbOnz%2FDqRPPMT8%2FS39%2FP23pDPF4CtsOtZDACkm0Shag9I2p5Ko%2BND09QQiFaEoczf8aw2oe0HGfemyhjzMaSs9G1xUzRyBR6LkoJUHquUhkQGB%2BUBRZ6iWLkkhfYpg2WHHc%2Bm6U%2BS6uLq44UegsVcYWSwQRKDsFpmFi2SFC4SiRaJxEMk0m20Fnbp65uWmmJi8yMzPD1OQ4kxcvcPLEMYaG9rFv%2Fw309w9pk2o02syyPT11kZPHn%2BPcudMslwq0Z9upVKrUHSdIqqtnoIJ5KBqi%2FmrSWEckcoVIpFrfRyqF9CWO5%2BO4Pq6vcF0fJTTxCCWwbYjYAtvUPiJGMBMhFFKuIQqlaQKplyQyUH6unaOwohixGr6%2FK1Hs4uriihNFKBRqJJjRZLFJv4aIbqIlDMu0CIUjRKMJEok2Um0ZUqk0kUiU6vHnOHfuPJOTEyzMz7KwMMvs7DR9fYPkcl2EwiHyS4ucPPEcFy6cxXVq2CGb5eUS58%2BfJdWWxbJCeJ7XOoHgYb6xZLFKythC%2BvB9SbnmMH12hvL0ArJSBddFSU1APgauYeGFIphtceJdbaTjFpm4RSSkQ9i17LHxd66VOFr7CKVAmKvXSz%2BI%2BGXRjsvPAyB4lAfVv1zjGV13uOIOV7q4jo7wNI1LWypaJQxhmFimrfNJhKMoJVhYWNDmRdMAE3y%2FzvTkeQr5RSYunCOX6yYSiVAoLDExcR7XqTIw0E8oHKZWqzEzfRHDMHFdl3CpEHwjgbKRjQlgA6lhoz6eL5mbWmL60aeo%2BjATSkG8nXB7GMsAWakiCyXilRLZahEKUD5v8pSdJDrUyWB3jFzKIhoyAserLUhrozk2z%2BMHnCgcuhF8HADFHwBXnShGh8X%2FBgZ3cOj7R8bUD1x%2BkKvicKVf26vb0USQMEYIXUzHtBzqjsdSvki1ViOTzdLZ2Uk6ncZxHAqFItNT48xMTyCEgfQ9DFPQ29tNX%2B8A0VicxcUFLk5cYGpynFqtxoA9CbCiaGxIFBsSQkOhuLFk4XsrJHEh2oGfTNGTDZNN2rpyugAlU9TdDpZKLhcm85gzs%2FRQYa%2BXp3yyyBPn2mjfm%2BNAb5T2pEXIFGjN53YlGwIl6hX%2BEXcBcCNwYAfHZa70RL4XcNUcri6LJFqgQ8MdlhYXGR8%2Fz%2BTFCVAwODDEgRtuIJNpx3HqzM%2FPMT8%2Fx3KphOd7hOw4mWyWvv5BensGiEZjFIp5otEop0%2BfYn5uCtuYpLPxPSJQNrJeR7HuxlRKVyVXgNDLjfxSmZnHjzHduYdsW4T%2BXJRs0sYrV1maL2JlU7TFLCIhm55MiKFcmLlimonxAsbkFF1GjZv8JS48u8zXZru49WCK%2FlyYiNXw%2BmqVbDaZowjMND%2FoS49dXHO8gFaPS0NKSa1WZW5uhpMnj3Hq5HNUKiU6Ozs5cPBF7N93kFRbBt93yXX2UiwuUSkv43kelmWTSqXItneRznQQCkVIpfW7ZdmcOnWC%2BnQl%2BCaFwNC6QrX1U1tKRd31MJcW8NIZQpagVveZfPwYi7k%2BOrNxBjujpGIWAsX587NUjp%2FlZNc%2Bbr2xnb72MCFLYCUs4hGDzpTNzECC6ROz5BZnGAi5FCdn%2BGdX8sZb0vRmbUzBpXUmwbvA2OWJXVx1fM8QhVJKh4UvLnDq1DGee%2Fa7LC7MkkmnOXDDQfbtO0hXTz%2FRWAKlFG3pDuo76P5%2FAAAb7UlEQVS1Ko5Tx%2Fe9oOJ5hEgsQSQSwzQswpFYy1LIZLL8bSgATR8HLkkSjucjzp2lvlylYidIxiymT0xQCsVJpGMM5KK0xS1MoXUWJGIAzE%2FmmetN0JW2CFnaWGqbimTMIBqKkI33MP6UJDY7R1%2FY4%2FGZGkvLLl0pC2EFCs5L6kxAlza8Rj%2FaDza%2BCpxu2Q8DP7ymz0Xg6TVtk1dxTtcM3xNEoUnCpVDIc%2F7caY4fe5qZmYskE3H27NvPnr030NnVSyKRxrZDIAThcIxYLIUvvWbWap3oxmr6VpiYRKJxMpkcfX1VqmezqELwpcHafisdhZSS%2FGKJl82c4n8yRGfdxcCndH6SWv9e9rWFSMUMDBE83QXE25PkTZuE51JYdqk7Esswmje%2BQGGZkI6ZGC%2Ft5eSzFo9O%2BexPWzphrlABf11asUrDT%2BMHXZl5DTAypt7Zuj86LPqAiTXd%2FmFkTL3rhZvVtcM1J4oGSRQLec6fO8PxY08zPTVBNBJmz5697Nt3A13d%2FSSSaexQuCXDlfb2tJSNCqSCRo1S13XwXAfHqVOtVigW8pSWS0gpV26pwFNyM6WlkopK3SNz%2FgQRPC44IbqA2dOTFEJxUjGLdNLCNMQqM2YiYiBzWXIzRUpVj5rrEw0LDFaPrQTEIgZ7D3WQ6tWRqtmEGZAOG%2BhM5CaWGaHNpJeLI%2BKlKG4HbgNuQ3AQmEPfDF%2FC4G%2F4lDrX7H9Y3IlgEChwVH181ViHxZsQvC7Y%2BzhHm3S8nXm8C%2BhHscRD6k%2BD8V6B4C3NPga5psJWcAdHxL0tIzgcVR%2Fe8jvuEq8GXo7iVuBWoA8tCTyJ4gkkX%2BUzVz%2Fpz%2BiwiKCv9yuC1w8B54DH0KkMvzUypmYvMcbLgmNb8RcjY6qySX8DOLym%2BbsjY%2BrrLX3eAgy0fP4t4HHgncAdwK3XlCgaZQOXl0uMj5%2FluWe%2Fy4XxM9i2wZ6hPezff5Ce3kFSbVlCoUjTBVsFTlJSyqBSuofnujhOjWq1SrVaZrlUpFQqUCzmVX5pkaWlBZid8bUyUwArkZwbPbV9JSkUq9xem%2BeiY2GGLUBRuzBNsa2H3phJxDZWLREECtsSZPf3IOYWWXQl1bpPOmbgB%2FN2PUl5qUJ5aZl6qYZfriPrDrV4glpPmv4Om0TYQIj15LWhZNE4ne3iXSKLyZ8AP7%2FBcWngBuANSD7MXeJ%2BYvwOH1NVBO8EXgNcAD6%2B5rg3Ae8DwOdhggXedmcEvArBOeBPg%2FN5JXBPs0crDypeD7y%2BpaUMbEwU7xb9GDwILaSzgjcAb0CH7dQ5LO4jz0d4RPmXMfdtY3RYDAOfYb3J9aXAjwfb7uiw%2BCPgQyNjytlkqLcA961p%2BwKwIVGghYFPrWm7H%2Fh6y%2F57gR9p2b8HeEfQDqCuKVFI6VOtlJmamuD4sWc4d%2B4UKJ%2F%2BviH2BSSRTGaw7RCNyFDp%2B3i%2B15QY6vUa1WqF8nJJk0J%2BkWKhIPP5JUqlgqrXqsrzXOW6jt%2FuLFVpuB0EGsC1yszGtudJrJlposLnxHKYtqxFveoga3WMzhCxSMvTv%2BlRqT0tM202%2BUyKSL3CciVKUbgsTy1RnS2iiuUglkPDCF6lgse3puHNt7WxtyuEbcL65dAaxWZDktiuQHFEvA2TTwHdLa0TKB5DcArBIRS3Ab1oNcmvUuaN3C3ueB4%2F805QZzXZGECy5bNWn%2FXyuqOFEBzmMAYfAVJBqwJOIXgCxUX0DXobkAXCCD5Mhp%2FmPeKX%2BJRaq3fYMUaHRRL4KHBkG91t4APAT40OiztHxtS3rtQ8LhOH0VJXE9eMKHzfp1KpMDU1yYnjz3L2zHE8p0Z%2Ffx979x%2Bgp3eAeCKFAqrVCq7jrJBCeZlKucTyclGVl0uUSgVVKpVUoVCQhcKiVyqVvGql6rtu3bdty89ksjKdbnPTFZWgTlMJCGxqDq3UXJLFRQDOOTbxsEFtsUBFaI%2FKiL2y5PCVQvl%2B04piG4JQT5ae58apPpVn2nNwQmHmXYOCF6XqQt1T1H39qrmKt%2BXqzM05zORderO65umlPDZVoEtRyI0u8WocESPAIy0tX0JyF59WZ9f1PSwOIngI%2BFfAS5B8AYjs9Le%2BbBxVn0E%2FfRvzuQnRVBr%2BMUfV7215%2FGF%2BhYZ0ovEZfN7HZ9Tiur7vFq%2FH4GFgP%2FByJF%2FhPeJGPrX1EmA7GB0WFjo%2FyCsv89CXAP8yOixeNzKmvvF857EDrEtX8IITRWPJUK1WmJme5Pixpzlx%2FGkq5SK5XI7%2BgUHa23OYpsXycgnHWaBSXqZUKlAo5FWxkKdYLFAo5GW5vCyrtYqsV6u%2B73uelNKt1ar1SqVS8zzpAK5hRN1YLCp7enq8xPhykjqrgrnUBjEUUknqjg%2BuDzbMyCgHQwbOXI2abwQxG%2FpcPF9Sq7lkpiYo1iWFsstiwcGvO5iey4lKhFA8Qc6EiAlG1MKxonRFDUKWJhtDSQ6VL%2FLRzir%2FdS7KQIdFb8ZCJ%2B1ukINcNcdmm%2FKDILItcKfIYfOJYM9B8Cs8qB7atP9D6gRCvCG44T4WiPvfH7hL3AD8YbA3D%2FwcR9WXNu3%2FafU1%2FqO4BZdPIHgHkEVyP%2FDvrsBsfpeNSeI08H%2FReoAh4Ha0RaV1MWgCnx0dFreMjF3T2rLPAE9eNaJYUTBKpPSRvo%2FveUglqVarzM5Mcey5p3n2mSdZWJihLZUkk0ljmib5%2FBIL84tquVymWFxSxUJBFUsFVSmXlefWleM6frVScSqVsuO6ruv7yg2HbTcejzupVKpmWVZdCOEqpbxIJOKHw2HV2dkpa6fmKxK0scDQ6sXNRHspZfP%2B64jq4kC%2Bpy0sZmBZrSzXsE6dob1cYCjsMV%2BH%2FHKIR2ttyHAbabNEt1nmrBfmzu4SUUPywEI7PRmbAz0hEpYkWS6TKpfYF1I40uPpZ6v0t1tkYoJERDTns%2BnyQ25DorD4JJDTPwz3cnQLkmj9AeF%2Bjoge4Ld39EfwQuM%2BYSB5GEEsaLl7S5Jo4BNqmbeLO8nwUrSy82c5LP6Kh9Tf7XQqgdLxA2uaJfDHwAfW6iBGh8W%2FAT4LdLU0HwI%2BBPzmTufxPFAG3jkypv47XCWJoqFg9H1drLhWLWNaYYRRoby8zOzsDKdOHefZZ55kemqCcMgiEY%2BqQiFPpVrF96SqVGtyebnoFwsFr1qt%2BI7n%2BgLlJeIJP5VKupaZqHqeX%2FV931HK92zb9hOJhN%2Fe3u5Vq1XP9325tLSkAJXL5Th8%2BLD6k68ckWAEuSEC8%2BhGFg%2BltId3oMc4ZFWYcn2kYWLj4%2FmK4kKJ%2BW88A57PvhSUDUHRFXxj0aIeM3lRd4SQGSF1vEgmWmXZE1SVYLlQI9EeI2wJBktLdBaXiEqtPwsZMJ93WSh5uL5EKgNjy%2BWHTnCjtpIo7hKvRvAzACi%2BSZ6PXNaPGeZe6rwNeNHl%2Fh284LjIWxG8Ntj7W46q0W0f%2B4jyuUscRvENwETwYWDHRIHWS6y9v353ZEz9l406j4ypfxgdFncA32H1Mu%2FXR4fF%2FSNjavx5zGUn%2BMMGScBVIArf93Ech0qlokqlIouL89RqdSx7jlrdYWZmmrNnTnP27Ck1M30Rz3VUMpmUvu%2BpxcUFhRBSSeUJYfhK%2BfXl5eWq67p10zQ90zSdUMj2crmcF4vF3IWFBWd8fNyv1WoynU6rbDbLoUOH5Je%2F%2FGUeeeQRJYRgo5Kc64LCNlAaWgacJslrWOLWWJWpfAHXsokrj7zjUVRhqpi4nuJCVfDOJ6K8phvetcfhpsQMX0VRTGUpRyPkix5fdm1%2BtL3OsbLFkA1Jt0quVGiSBEDdh6GIT6Xua%2Bct1XAz33iOUiqU9EBtIVFIXtkUaAUfuGyt%2Fv2qzhHx%2B8DnLuu4awHBy5vbRovVZLt4UH2bI%2BILwE8DN3FExDi6sdlxK4wOCxN41Zrmx9DSxKYYGVMnRofFB2EVmRtoc%2BgLTRRHW3euKFFkMhkMw1Ce58mFhQV55swZf35%2BQRiGvqHK5bLOLzF1UeWXlpQQUkYiEa9cXq67ruNGIhEVDoc90zSdtrY2N5Foc2KxWNVxnHokEvFd1%2FXi8bhMp9Myk8morq4umclkuPfee5tsoJTi8OHDze3N0eJHseYGNIQiEhLUMxm%2BemGGOzJ1fso9wz%2B5WfKGol6o4GfDzPXv4bFTRUQN3vKqCD2ZEF%2Bq%2BVQqU9wSmuez0zHa4zG6qwt8sxymo1eSiJpEbJO22jKxNXkkFh24WIF%2BX%2BBLE53Ut%2BGoJbUzVjBXIXRyHKRCiC2IQnBr49IAj%2B7oh935cS80bgve68h1HpPbxeNoojDQlpGdnPtN0Fz%2BNPBXI2PbIuk%2Fh3VS323A53cwj52iODKm5lsbriRRqP7%2BfuU4juu6bnVxcXE5n8%2FbQhhI6eP72rxZr9epVCo%2BKD%2BdTnupVKruum65Xq%2FXfd%2F3bduW4XDYS6fTfjab9S3L8mZnZ%2F3Ozs7AMwpqtRqHDx9ussA991zew0MIAYYZFP8FpVqSTRp6PxKyGMzF%2BMpEN%2B3FCW5K%2BfxIaIH6IDxbnuJCNcKNgwkGuyJYpqAtahENC5arHv3npni6YDPpuGQyMQQL1B1JwlTc3V3EqfgIf%2F3fzIeeENQNi2xSh54LQye50S4VJg3JokkWhvbkbKTB2QS3BO8nL8sRqhVH1WmOiCW%2B9yMjNSkKnuZBtbNsPoqnWlSKt7AzothIgfn4dg4cGVOLo8PiPFrJ2cBtm%2FXfBnbitruwtuGKShQHDhyQCwsLtUKhsDgzM1NfWloyy%2BWykFJiGAaxWIx4PK7a2lKeUsrNZDJeR0eH47puvVQqeUIIGeTCVJ7nqc7OTrW4uKg6Ozu599571dYSwvahQGfdFiY6Ya5CqUbYuTZLGoZBR1uYQzfkeOAJePH8LEf2VAkbcGvS4ZbScc5V00zn%2BjAzSUKWwDAUycoyQ6LC54ppYimTeEcUf8IgbiruO5fmrdkyrzWXoCWHTt2Hx%2Bbh8xdMXnUozL7uKPGojWmuxHzod1ZIQgVE0eJE4csNGWNv8D79PC%2FbJFeDKNQGZU52gvuEAXQEY%2B483kJxbiVfYfPaXS7SG7RdzhJmLaH3XKL%2FWumlFfHL%2BN5NccWIQinFfffdp8LhcF0IIYvFYmVqakoUi0UBOvNVMplUHR0dJJNJ6bquF4lE5ODgoKxWq3J6elrddNNNAOuWEnD5UsNG8HxdJ1in5jdbEuGuwAhuSENAKCzY2x3jR17eyZOnw%2Fzis4vsVyXeMeRwMKXY6%2BXZM5XnwlyKqc4%2BRDzKSy6eAeCpZZvX7gnTkYkylUyS9hyyMcWN8fWSxNNL8NGnBB1tIV66J05fe5hwyGp6ZzbJIlC%2BNsjCMBsJ9fQZOJ6yhRCmUqtE3OPoNe7NbKa0uRTeLkJkOLjp54Jqc9skelljC9ovez4b4R4lOSKeRUsBN%2B14HJO9zT8Ig5M7HGWjyvK3bNK%2BCqPDIozOhdGKJ1q2SxsclmV1AFsrUpu0XxauqERxzz33qPvuu0%2FG4%2FG6aZqOUkpUKppI0%2Bk0qVSKjo4Ouru7VXt7u2ocs%2Fbv90qQwkYo1bEy0Ua%2BDCuo8tXIkt0MJtXvAixMEjGT%2FX0m2VSI%2Fb1xTl5c5n3nS7w1PMdrOySH0opBr8jgZJEaJhH0Pfq7%2FXmSskJ00uAlHS6d7TVMUV03J1fCN2bg0SWLV78oyqH%2BOKlYCFOvNJrKzBVdxQppaOX8SkiY42MBIaD1i55AE0Ub72Q%2FcOqyL1yaF6O9BjeGYrLlKdwFHLuM0bsv3WWbEDyJ4hZgL%2B8VKe7fQdU0xUta9r6zw5k8hjaFtkp4b6LViWxz3MH6a926%2FJlnPbJbjNexje%2B8JK641eOee%2B5RAEKIVU%2BuyclJJicneeyxx4DVisYrtaTYCkII8z%2F9GDbRFR1F0%2FIhdNCWJEilqYJ6HsF%2BJGSRazNoS4QY6orzooEk3zoWZXJighcvuRzKCl7SppokAfBDKRdwoWEt30C8lgqqHnzutGBvZ4Tb98foyUawbFOLNA1igI0lCyNYOgVmXC8gCiGEp1SwRtcuyxomP8pOiELwxkv0mGrZvpSYvIJfEmlCV0Y0BkDyZHCdBXVeD1x%2BSjrFK4IxfOo7U4iOjKnS6LA4Bry4pflnR4fFQyNj6v9tdlwgTdy%2FwUffbNme2%2BDz1wNf3GTYt15qvtvB9mv1XSZaIzo3el0D2DVXE6NecegKXga6aI8K3lFBdKqhSwgqYaAQmJZJOGTRmYlw05423viyLpYH9vK1Yoyn5xVfmd7%2BQnuxBn97Hp5agotV6EpZfPw2l9tSPlKCVFp%2FYhgmhmFhNrdNTMMK3s0gJylBBXjwJBb6abTyAJB8DZoeWR8KHKi2j%2FeIPuCDW%2FYRLToBwfC2xw7x7y9rLpeCwT%2Bxcq4f45fE5bmd3yXuQPATACge4%2BHn5RH5iQ3aHh4dFi%2FfoJ3RYZEC%2FoL1%2FirfZLVkM7PB4e8cHRbr9BSjw%2BIlwF3bm%2B7WuOZh5i8gTNdHVwlGE4GWLLQSExXEiRmAXKnJIRrrEpTOPCUFkbBgsDOObRo8HrP4wvE59hTz3JB06d3k%2BaiA00U4tgTLLkzXBN9eMvjVG30%2B8xoPw5T8fcGl4FXZN2SRS9pYVnAgLTkq1MpSwzAtTWoB3%2FsSE%2F2bWkIIQykleUg9wxHxceA3gDSKTwFv2%2FZV8%2FkE4hLr3CW%2BQ4ZxdGTkCO8Vv35Jsf%2FtwiTDL297HtvBg%2Bo7HBH3A78GHCTEB4D3b%2BvY94owiofQsp9ENCMnd4rGdW4lzkHg66PD4mPoGJDvAv3opeFvA3vWjFEBfn6NWfVJ4CQ6yreB7mDc3wzGHEBLGfewsWL1snFdEIXQ5o0mUQRGUbS5UW8bwVMZia7H0VTGN%2ByTIlAgaj1GNGTQn4vSqSrk0gM8eTrJgxOz%2FOdDy3z6GGRCEA6uri9hugJTVcFMTXC2anHRD3NzTvD5GY%2BapzjuRakg6O7yyVUk2YTAFtqPAlaUmKvOK5AoGnMPrB4WOk5AFzoFcPg9QrwZeDGCn%2BSI%2BDvg3RxVU2wGnSL%2FKIKfDFpcNtNTPKJ8DosHEHwUSFLnyxwRP8ZRtdF6Gt4rUmR5BLVKNL9SeD86bHs%2F8NscETYOH9xSOjgiBtHu04cAEDzAg%2Bp5%2BY6MjCk1OizuBJ5i9c1qo0Py37eNYX5rZEyd2GDcP2N10BvAzcDY85jylrguiAJ905ieDCQKwUqot7Gij2j2bDyjFYGrdEuJr%2BCGNdw6hlRk3TI37umjtyPGubMh4BgPnovhWTaxsBkoTrXgYhgC0xa0pS3e0BFlsDNKXsDUTBnLEPRGLPpyETKpCHbIxjADpzDYMDmNCCSKholUKX2ewWtlLfSwqvFu8Q4Mvoo2pb0FeJq7xPsx%2BEe6OMk9gXvnu8QQFq9H8RFW9A2fQNvyX73pFRZ8Gp2%2FYAD9hPwad4nfQPHNJmG8S2QxeBWCj6AjJGfQWvydZLveGEdVhbvEnSi%2BiHaF%2Fi1CvJW7xO%2Fg8i3%2BXOllkg5F3xcslf4IaAtGOEllm1LIJTAypiZGh8XbgL9kdWKYS8EDPjIypj65yecPA7%2FA9v0rgj%2FineN6IQoBiEaCq2b9TqFL%2Fa1YPETTiiAb4n5AJKppXRD4nkd08gLZpTlS9RLp%2BSmkbXN7yKXsmOwdynLzgTayiRCuJ1GAbQnCtkE0bBIJGSSjNsmoiQLyQylcT2Fb0Ba1ScZNbNNoropYRxJ6X5gmhhCoYOkhVTO9RZAUtAWfVo9xt3gpPkfRGvgsik%2FhA5OUOSKOA0OYtLP66%2F6SXt7LJF%2Fb8gofVQXeLV6B4PNBvMWLUIEy8Yg4CziYHGyZl4%2FgThQf5EoSBcCD6qvcLW7B5zPA64AbUfwvLOCImAfOcZiDQGrNuT5MmF%2FjqFqf42KHGBlTXwl0BR9DZ4y6FL4D3DkypjZ10AqUpa9H6zT%2B7RZjuegkN6%2BEQPeyQ1xXRLGyY6zcfEIQ5KkKOgmUUEFhYu3wJAyaegqkoK4EeTdEuRonUvE5rtooZrpQyufCYoUDfRa33dBOVyYCSuIrgSnAsgwsi6B%2BiX5XSpJJRPCDUoKG0ahvorTeBLXps8BYs%2FRQK%2Be58RGfVGeAYY6IX0DHHTRMZ3HWP50WgN%2FgqPpvABzZxgPp02qGt4t%2FTYYH0JmrGsrytY5LU8DP8aD6R46IrRWlO8Un1XGEuIPD3A38ASsSQwfrTYYXgSMc3bJwTx34ypq249uZysiYKgLvGh0Wf42%2BYV%2BG9qtIAD7wHNqk%2BnXg4ZGxS3uVjoypyuiwGAHuRmenehUrkafTaF3F%2B0fG1LdHh8Xvs3L%2BwDr%2FkO%2Bikwc3sM5hTVwjC8QLCiFEGEi847W88tZB4%2F8Mv%2FlnaB%2B6GSd%2FDrc8H%2FRp4Q7V0FOo5j40nu6CmuuxeHGBR8%2BUiCxMM2skSHdliUVNpIRsMsSBviRtCTuoBcKK74PRiDJZj0aC3vUSxCbnZZgYoQT1coEvfukfOLfAB%2F70S%2FJzwDJQUGrTdGpa9D7CgcDv4GYEL0ZSQjCNzkD9JY62%2FMG%2BR9wKtOFR49PbSKbyDhEnzG0YvBydr1JgcBHJVxB8sTn2EXEbBikkVY5uohc4ImIYgVu0x%2FkNk%2B1sBa04vQHFLQhuRnEAwSngcXye4M85%2FUKb4oJclnuAqZExtd7BZmdjDgDlkbENEvQ8T1wvRBECEr%2FwOl55y4Dx929880%2BTG7yZen4cWVkEoYJCwATOi40I00CJKVTz5lVK4Lo%2BS8sOZ6eXmVqokorZ9HZEScVDhExBOGwSC5mYho7XWM1Aq2ZGUwfRbGsoLzd%2Fgjd8SYUwwY5qovji33N%2Bgd%2F7kxWiKG5JFLvYxWXgell6SEDWHZ1f0fddUD5mNI1pR2m9WfU9HSg61cpTvqkrUBJTQXvcI9rmMlRxiYZN4tEQIbtRdFgvW5p6jYaJs5ljszEWTduECv6teFq2MopqjtG0gUiauT9VEKrueiw3znXlJHaxi%2BeP64ko%2FL%2F5JidfsU%2FMnj3%2BTK5z8KXCNCMoK6xjJ4IbsXHL0uIB2Ug%2F14AhFVZYEYlJ2lI%2BpiEwgkhPPYxs%2Bj00ZYZgOWOimiZYoUA2dBGqlSBWTKI0UnIpQEgtTShQhp6XUpK52WkA%2BehZ%2BS9ojbnPLlHs4griuiAKpZQUQniAV66p%2F3H%2B%2FJm7q3%2F7WTq7OoMq4q1ifsPBClByJfCjISGoRn%2FVekTz%2F8YnQptOgixZLRILjYhQmqUAN7RdrZpCoGxdiaegobosFIqMj49Trat%2F%2BvZZZtFE4Sm1VTabXezi8nBd6CgAhC6THo9B7H0%2FZdybivCLVyS8%2BXsAlbr65wf%2BUf3y9CIFtDdfRSlVv9bz2sUPDq4bogAQQsSAKNoRJ8xWEZHf%2B1Do%2Bftoe7mDrndRRRPFrkSxiyuG62Lp0QKHFa9FBc1wz%2B9XtvTQuggPfW51wNkliV1caVxXRKGU8oQQDZG8lSi%2BH28sgf79%2FODlAPVdk%2Bgurgauq6VHA4Ffhc1K8NRVqTd5ldFw125IFO4uSeziauG6JAoAoSseW%2Bgn8%2FcjUTSWUBLw16S%2F28Uurij%2BP4dVQiup8F5NAAAAAElFTkSuQmCC';
startAutoTourImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAAAcCAYAAAAZSVOEAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAKTgAACk4BGCrFqwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAiJSURBVGiB7Zl%2FjFxVFcc%2F571582t3ZnZ39vcWWnZpKW3X8qMtCogCIhUBoURChEIUAYEGY43aAEIwEPwRqbEICpGQ4h8qqIhGBBpsEEpLoKTQ1ha32x%2B7bEt32w77a3Zm3rvHP2aWvp3OtrNlIUH4JjeZe%2B455577nfvOvec9UVU%2BQWn86ZbELeHaaXd1dfVc%2Bq2He1ePp2d9iDF95GAFrGnzF95cdc4l1z%2B98tutP0NESupNxmQislREtvhacDL8HkUc04riuGIi9vddITMeWTLl1se%2Bc9wDABgv446kSAQz4fMWfXPpE7fPe2XF5VJXbBeYpPjrgRN8%2FZL%2F2IeAYFEc1YdT%2FsViaYpG6y%2BOV9ctSh479%2Fjzr7u%2Frv6Y2bGOl1buAW7yVEc818U2WUx%2Fp%2FXpz5w%2Bb0tNzYYHb6q%2F9sYH9j496meySPzIYeV3p6%2BeftrVsxqPOylZ3dBqWXYARfHUAvXif7jz9E3hxNQ4eACIWLjpPlqb4k3x6GmP3%2F%2BN5GVLHtn3DHxMSVxxlcyae9bX2rvSNTUDO3uJ9I4QilQSikSpq4dgwI6e%2FNnLZlXYwwz1dhBubMN4exDLBpRE2KuoqU4sAZ6BMnKiiIREZLaIJCZzIZJHm4i0vE8%2FSRFpmohNNFF3fTzZUoPnUulkiIVcYmFDLCyEg4JmD5Deuxl3aA%2B2pfRsepbBkSy2E0EsG8uyqK%2Btnjt60IxLooicICLPAkPARuCAiGwVkQt8Op8TkR3AjUXmW0Vkh4i0lvB7rYi8BPQDHUC3iOwVkb%2BKSLOILCjYjrZwwe48n2yriLSIyOtAH3CNiLwCPF803d0F%2FR%2F4heFQ6MyhdBbHAStUTSBaSyTRTLS6GZM%2BgJsZIBRNUFFZQ6J2Ki0nno2bHmB3Txc5qUQsm7ramsYVVzqnwTiPs4i0A%2BuAiF8MzAD%2BLiLLVPWnhfGpJVyMyhyfz0bgYeDCEvp1wMXAKcBPinyOHlJRn9wDVgPH%2B%2FSmAMU7ssbXAFh%2BubScePKC5v0DORwngpdNMdDdQf%2BWbnKDe7CClcRqmollBjBZ7z1H4cokqRGHjs7tWOEqjquOOPGa5A3A2vFy4krGEuiHAPeIyFPjjB9qIBIAngXaj6A6BfhlGS5txhJYNqJV8UVtx5%2FQ2N3XB54LBqxQBURasZpmEolUUBmLU1kZw4lGUQH1XILpYZLBdwnF6uhP7cOLVlCb3DEPSuzEQo46ySd6GrgZuBT4eUEWAM4FngS%2BDnwVuMBncx3gArsL%2Fe8xlsBh4E7guYLOp4BbgIuY2PXoDWBFwU8n0Arc6xtfCfwLeHNUYEugLuRY0tYQAkKIJfnUJgaxDNgZxDoAI0MMZwKICKoG4%2BWIkCUUyVAdCCCSIxQOx0fJKEZxHntZVbeLyHLgJd8i31bVt4FHRWQmY0l8TFUzkE%2F8wB2%2BsUFggar%2BxydbBawSkR8DY%2FLXYbAVmK%2Bq2UJ%2Fp4jMYCyJa1X10WJDNQbURY3B5DzU5JvxXN56Yye9qRFyQ2kCToD2eS2EQwKeh6ceeC7G87DDcbKZdA5Kk7gVUA6SdZuIRIE%2Fquq6MhfoxylA2Nf%2FURGBftwBLAKml%2BH3IR%2BBE4NYGPcgeWo8jHqsX%2FtfrOo4ba0hqmuaeWXdTlY%2F8SpespqF5xyD6kFdC0F1nNNZVfcCv%2FWJQsAyYL2IvCgiF8k4NeQ4KM6DfxlPsUDK38r0u30CMYydB0GNixoXY1x61m%2Bmq2M38eYkc1rjrP13J1nXZf6CZs5d1E5%2FKs07B9IYz8V4Luq5AIyyMN4V5yZgCdBbJD8DeAp4XkScQ6xKw1%2BGueRz1%2BGwuUy%2F6TL1SkAwxsMYj5HuHrq6U3TuPMC0xjDqucyeXc%2BWbfvo27aHTWu20RrOsmv3oI94D%2F%2FLr5IkqmpOVX8FtAH3AKkilc8DPywz4m7f7wBQewT993X5LgtioYVd1bvrHax4BdmRLJn9KYbWbmDX2yn2buwi1b2P3ZEEzS0x6Op9j%2Fj3iCTP5GErFlUdUNXbCwtbWjS8sMyQNxT1zzqC%2Fnll%2Bj1qqFgFMjyGIjGah%2FdjeS6rXtjJk1szJDVLLBFm34DLuVOFL9l9BIfSZLO5%2FCNtXNTL5g8oSpAoIneJyD8L7XERCarqsKouB172qTaXGfPrgP%2FN730iUlVKUUQuAc4s0%2B9RQ2wbUYOitM1q4i27ii84fSycarH48hM5NuSSaIhR40BbTxe7BmDlDodgMIgVcLDtICIWaowFpU%2Fnd4Dzff0OEbmX%2FInpPyReLSdgVe0SkYeAGwqiY4ANIrIUeAHYR%2F7ifBVw60TIOFqIhFCxsAC1lDPPnsH6znp612xk0eAbtDmG2ZlhYg2GzgF4rVdYfMEUHCeEUYMaDzsQALFsEYmWIvHP5C%2Bwo7t0GfB9Dt21v59A3MuArwCNhf6xwBOF3zl85eEHjUxOg5btYFkBjBosFYwqc9uSDNbO5%2FFVm5gjKbb1K9vSDsNOhFMTWbZ3j3DyrHosFNRgOxHUpAJA1SEkquqews67zSc%2BhEBVLZtEVU2JyIXA74CZRcN%2BAvcDDxbNPalwjQZAEUuwsVEVLMDyPDIb32LO9CQvdlVx6hebaQ3aNFWHAKU95%2BIE5eBh4oRQy7KBcMnaWVVvF5GN5Ms8f%2B4bLdeWTzR4VX1NRE4B7gauBBr8awPWANeQ36UfIIluP8bDqWhA8UBBUIwa3p05n%2Bb6Sq4%2BwyH%2FAc8UsrkSVs3nUQGMQSwb9VwDIEf62leopecCPcDmo64SDvXbWPC7H3hTVUcmw%2B%2BRcE67NFz%2F5RlrGmrrKgyIZRRPEEERLZSElqJGUdX8hVo1T7aQ34kKOdfV59Z1%2Fmb5PwZ%2FfUQS%2Fx9ReImbf0199IiSz%2Be9H1cSLfJ53rwPN0HAqGr2Y0niZOOTj%2FeTgE9InAT8D1d5WQk3kn0aAAAAAElFTkSuQmCC';
closebuttonImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAPCAYAAADphp8SAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAFPwAABT8BE2RkrAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAK9SURBVDiNfZNLaBNRFIb%2FO5lJJjGSNtO0lNAm0xZaWxeCpMG4KSrUirpxI0TduLIIPkAQBXEhSBe6EEHQhYoNWKuID%2BgLfODGUrCIGlsKtmBfE1MjQ5Kaedzjog%2FGRjzwcy%2Fn3P%2FjHC4HRASnBurrz77Zvv11L%2BDfWCMiDKrq5Vfbto30Al5nXoQjBiORi2oicV6yLL9LkkZSjHUmifS1%2BnBDw1U1Hj8l2rbXJYrDKca6kkR5AGBEtAKpq7sU2bHjvJDJeEEEV2UlFjVtbHZsbO9hy%2Fo5pKrXou3t3dA0GURwKQpmZ2bez42P704SFdc7Mg1DM02z6GbMS7YNvrSE6lAohlhsZCAS%2BRCNxY7y%2BXmPYwBulUpZAMZfHQHAs2DwcF0icd2Tz9eSaQIAXIEASJaJaxpbeyeEQvb3dPpRdmrqSJKIl4EA4GlFxb5wLHbLZ1n1vFRCWSjK77nPn%2B92TU93O9NlIADo93p3qx0d%2FeKvX5Vw1KWaGnwbHX1wYHHx2EaPsDGRYkyuiEYviLZdaXMOm2hdRi6HYFPTzsc%2BX8t%2FQSnGPFVNTS%2BU2tpdZi4HzvmKAHDOYS0vQxaEBqW5uf%2BhJFX%2FE5RizB1U1WdKOLzH1HVwInAikN9vmm53hgQBnAhWsYjNgcDWYGPj8xRjvjKQv6rqnhKNdhq6Dptz2JyDb9pkLE5M3F74%2BPF4SRA0DsDmHIauoyIcjvtDoftlIKNQ6NGz2UmIIjjnIJ%2BvpH39evPgwsLJQ7r%2B8kc6fc50uXKcCJAk6JnMpJHPX1mfzbkvfbLcOtzWln6XSBSeKEoPAAmAZ1XuvkDgzNt4XB9qafnSJ8utTu%2F69zPGPADk06K4pdnj2X%2BiULgHwL0KEwBwAOYNny%2F5yTCG7ljWBIASgN9EVHKCGABx1bwmz%2BopALAAmFhZCcNxN4mI%2FgBbEHoE%2FKbG8wAAAABJRU5ErkJggg%3D%3D';
			
locateMeImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAQCAYAAAAmlE46AAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9kKGwgzGjNX4ooAAAJcSURBVCjPhZE%2FaBNxFMe%2Fd7mUpnfpL71LQkg9IVr%2FZCikf9SC7WAJSRRrrUPpoMEiSRdxcwnoJOggRboIWhIc2qLE4iTYDqU4WB38Q6HqItKKtZfalMsld81d8nOqBGrqg7d9P%2B%2FzHo%2FBf6o6N3oF5tYY7LwflvUMHH%2BHjWQ0Zl%2Fo5cVJprx6DfJ5oNELUAY09%2BknTPOYbR9TO7P95jGkEMA2ALQKMCwYu%2BCEtm5ydXXU7MfOOlDeBsABpgFwRcDGA%2FrGhfpgefMkKmVAWwMcVcBWAmwaUMoBDJuvD1a046AA8l8AQwXsImDqgFEA5Ni9%2BqBVbAUFUK0AhTWgugY0eEB9fXfZSGZ%2BF2xvaWmZNgwjwPN8ibMxm9TSvQwFsNvC4Qp1d8fZc0%2BnAYAjhBwslUrvOzo6fg8MDFyfmZlx9ncf8rHW6xQoAMYO6u5SQIJRNpL5%2BHejzs7ORx6Pp5JOp0Wfz%2FdWkqSdG5fDOZpxUvrERxfHzxaDbQce7DklEok8F0VRBwBCiDUyMjJenRu9amVPa2OXThR6e3tHA4GA6na7T9VybDAYnFVVtdHv9%2Ff19PSsLiwsnPmxWfzONh9tXf5l%2F6AoSiIUCr0SBOHhHmssFlsnhGwkk8muaDSaFwRhixDymeO4yuDg4Gw4HL7t9Xq1WoYDgOHh4T5N05anpqbmnU5ncmJionllZWWI5%2FlFVVVvZbPZdy6Xq6goyt63pdPptng8%2Fk2SJMPhcOREUXwhiuJiU1NTgRBCE4nEzdo8848BQ0tLS6l8Pn9E13Uiy%2FJXWZbvp1KpydrcHyPz5blPQjIYAAAAAElFTkSuQmCC";		

closedHand = "data:image/x-icon;base64,AAACAAEAICACAAcABQAwAQAAFgAAACgAAAAgAAAAQAAAAAEAAQAAAAAAAAEAAAAAAAAAAAAAAgAAAAAAAAAAAAAA%2F%2F%2F%2FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8AAAA%2FAAAAfwAAAP%2BAAAH%2FgAAB%2F8AAAH%2FAAAB%2FwAAA%2F0AAANsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FgH%2F%2F%2F4B%2F%2F%2F8Af%2F%2F%2BAD%2F%2F%2FAA%2F%2F%2FwAH%2F%2F%2BAB%2F%2F%2FwAf%2F%2F4AH%2F%2F%2BAD%2F%2F%2FyT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8%3D";

globeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEQAACxEBf2RfkQAAAAd0SU1FB9oLCAk1NEFBgZsAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAC40lEQVQoz12ST2hbdQDHP7%2F3Xt5rmixpmj9Nm7VdQ8vGimsrqyieVNTJULwoFbrDxnAguwjDHbxKQRTvO4gVpSDiPMlEvOhgamctK%2B1WtqyzaZtmeVn%2B5yXvveT9dhDn5vf8%2BXwPX76C%2F2Xug8VzwLuqph2VYEjPa0rJsqIqXy8tzH%2FxOCseSRe%2FnNZV5ceJseTAs8dGGUtF6TUMyo0WmR2TlY0d7mQL14UQZ5cW5tceyW%2B%2F%2F%2FlsIOT%2F480XpsTURIJyo4WZy6IFE%2BCPgGWSGoiyvLHHlasbDxDixaWF%2BTUNIBoN%2FvzK85PiqXQ%2FpWKe2Mgk4dggVtslv7OF5jko3RYvzabpejL607Vbl4Dn1DMffvXRwVTs5bkTM3Rsi5qrEgxHUBUFKcG1qsTCPaQGk4SCfnp6fGTzlYMj069ltVC49%2BzxyREq5SJFJ0BiaAgpQQIIBeE57Jc8VjLrRPySqSOHODo%2BxHau9JZWt9z4aDLC8p0C6YkEnvxvxUalxDPTkwghkFKyt3%2BfdqvFYDwMcFxpOx3FMHSUYIJKo41Zd7DsLnXLwWmYCPFPlRCCgXiUtc27GD4NoF9TVcWrNttKoJ0jqBkUmjGKPp1O16Nd6jDtuti2w4FgAMuyOJSKU2g5ACXNpyj5e7vFoZnxJOnhQbZ39riaqeGg03ICfPrdDQzR5b03jlGv11m9eRcOjAL8qchu9%2FLq5i6OpwEwOpzi5Eyc%2FUKJB9UmVVuwXfYwTZNqtUpPJMXmVh7gW3X118tXxmdfvyBUVQ8HfPh1ld9W1lnPS%2BpNm1rTpmbZzA6rFGoOu2WPm5nc70sL8%2Bc1gEqheOqX6973ngdPHx7ghxtVyo6O0%2BliOx0MnyBbkfxdcLn2V6YshDj3xLdPnv74nZH08GIo3KcfSSdJxkIYhg%2Br7bJvVrh9L89urnhLqNrcE9%2F%2BN339Y%2Fqrpy4sqkbvCVStD4SQ0uvIjrslhfLZN5%2BcvvQ4%2FxDbSUHA5o8CrwAAAABJRU5ErkJggg%3D%3D';
lang_dut = {
	'name' : 'Nederlands',
	'language' : 'Taal',
	'addToTour' : 'Aan toer toevoegen',
	'directPrint' : 'Deze geocache afdrukken',
	'moveGeocache' : 'Verplaats de coördinaten', 
	'movedGeocache' : 'De coördinaten voor deze geocache zijn verplaatst.',
	'moveGeocacheHelp' : 'Je kan de originele coördinaten van deze geocache verplaatsen. Deze worden dan gebruikt in de afdrukweergave en in het GPX bestand. Dit kan handig zijn bij een opgeloste mystery.',
	'originalCoordinates' : 'Originele coördinaten',
	'newCoordinates':"Nieuwe coördinaten",
	'addMarkedToTour' : 'Selectie toevoegen aan toer',
	'addShownBookmarks' : "aan <b>huidige</b> toer",
	'addShownBookmarksToNewTour' : 'aan <b>nieuwe</b> toer',
	'showCaches' : 'Getoonde geocaches toevoegen:',
	'newVersionDialog' : 'Er is een nieuwe versie van GCTour beschikbaar.\nWil je upgraden? \n\n',
	'removeTourDialog' : "Ben je zeker dat je deze toer wil verwijderen?",
	'logYourVisit' : "Log je bezoek",
	'removeFromList' : "Van lijst verwijderen",
	'emptyList' : 'De lijst is leeg.',
	'notLogedIn' : 'Gelieve aan te loggen ...',
	'months' : ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
	'prinviewTitle' : 'http://gctour.madd.in',
	'pleaseWait' : 'Even geduld  - gegevens worden geladen ...',
	'newList' : 'Nieuwe toer',
	'sendToGps' : 'Naar GPS versturen',
	'makeMap' : 'Kaart aanmaken',	
	'makeMapWait' : 'Beschikbaarheid kaart wordt getest',
	'printview' : 'Afdrukweergave',
	'downloadGpx' : 'GPX downloaden',
	'sendMessage' : "Heb je een bug gevonden?  Suggesties betreffende GCTour? Ik had graag je mening gehoord.<br/>Stuur me gerust een <b>bericht</b>:",
	'sendMessageTitle' : "Bericht naar auteur versturen.",
	'sendMessageSubmit' : "Bericht versturen!",
	'showSettings' : 'Instellingen tonen',	
	'settings_caption' : 'Instellingen',
	'settingsPrintMinimal' : 'Minimale afdrukweergave',
	'settingsLogCount' : 'Aantal logs in afdrukweergave',
	'settingsLogCountNone' : 'geen<br/>',
	'settingsLogCountAll' : 'alle<br/>',
	'settingsLogCountShow' : 'tonen',
	'settingsEditDescription' : 'Beschrijving wijzigbaar',
	'settingsRemoveImages' : 'Verwijder afbeeldingen met een klik',
	'settingsShowSpoiler' : 'Spoiler tonen',
	'settingsAdditionalWaypoints' : 'Additional waypoints tonen',
	'settingsLoggedVisits' : 'Log teller tonen',
	'settingsAttributes' : 'Attributen tonen',
	'settingsDecryptHints' : 'Decodeer hints',
	'settingsSendToGPS' : 'Naar GPS versturen',
	'settingsShowGPX' : 'GPX bestand tonen',
	'settingsDownladGPX' : 'GPX downloaden<br/>',
	'settingsGPX' : 'GPX instellingen',
	'settingsGPXHtml' : 'Beschrijving met HTML',
	'settingsUploadTour' : 'Toer uploaden',
	'settingsGPXStripGC' : '"GC" in GC-Code verwijderen',
	'settingsGPXWpts' : 'Exporteer additional waypoints',
	'settingsGPXSchema' : 'GPX-Version',
	'settingsGPXSchemaGS' : 'groundspeak',
	'settingsGPXSchemaAU' : 'geocaching.com.au',	
	'settings_map' : 'Kaart',
	'settings_map_geocacheid' : 'Toon geocache id',	
	'settings_map_geocacheindex' : 'Toon geocache index',
	'settings_map_geocachename' : 'Toon geocache naam',
	'settings_map_awpts' : 'Toon additional waypoints',
	'settings_map_awpt_name' : 'Toon naam additional waypoints',
	'settings_map_awpt_lookup' : 'Toon lookup code additional waypoints',	
	'settings_map_owpts' : 'Toon eigen waypoints',
	'settings_map_owpt_name' : 'Toon naam eigen waypoints',
	'settings_map_gcde' : 'Toon kaart van geocaching.de',	
	'loadTour' : 'Laad toer:<br/>',
	'openTour' : 'Een toer laden',
	'load' : 'Laden',
	'removeTour' : 'Deze toer wissen',	
	'deleteCoordinates' : 'Verwijderen coördinaten',
	'copyTour' : 'Toer kopiëren',
	'copy' : 'Kopiëren',
	'newTourDialog' : 'Gelieve de naam van de nieuwe toer in te vullen ...',
	'rename' : 'Hernoem',
	'upload' : 'Toer uploaden',
	'onlineTour' : 'Toer downloaden',
	'webcodeDownloadHelp':'Gelieve de ontvangen webcode in te vullen en klik op "Toer downloaden".',	
	'webcodeDownloadButton':'Download toer',	
	'findMe' : 'Vind me!',
	'webcodeerror' : 'De gekozen webcode bestaat niet!',
	'tourUploaded1' : 'Uploaden toer was succesvol!\nwebcode:\n      ',
	'tourUploaded2' : '\nJe kan de toer bekijken op http://gctour.madd.in.\nBelangrijk: gelieve de webcode te noteren om later terug te kunnen opvragen!!',	
	'settingsFontSize' : 'Fontgrootte:',
	'settingsPageBreak' : 'Pagina einde achter cache:',
	'settingsPageBreakAfterMap' : 'Pagina einde achter kaart:',
	'webcodePrompt' : 'Toer downloaden.\nGelieve een geldige webcode in te vullen om een toer te laden:',
	'webcodesuccess' : ' is succesvol geladen!',
	'webcodeOld' : '\n    !!AANDACHT!!\nDeze webcode bevat een oude toer. Om alle voordelen van GCTour 2.0 te benutten moet deze toer opnieuw worden geüpload worden.',
	'printviewCache' : 'geocache',
	'printviewFound' : 'gevonden',
	'printviewNote' : 'note',
	'printviewMarker' : "eigen waypoint",
	'printviewAdditionalWaypoint' : "additional waypoints",
	'printviewRemoveMap' : "kaart verwijderen",
	'printviewZoomMap' : "Open deze kaart in een nieuwe tab.",
	'settingsFrontPage' : 'Frontpagina:',
	'settingsOutlineMap' : 'Kaart maken voor alle geocaches:',
	'settingsOutlineMapSinge' : 'Kaart maken voor elke cache afzonderlijk:',	
	'settingsDecryptHintsDesc' : 'Hints worden  gedecodeerd bij het afdrukken.',
	'settingsPrintMinimalDesc' : 'Dit bevat enkel de hint en spoiler van een geocache.',
	'settingsEditDescriptionDesc' : 'De beschrijving van de geocache kan aangepast worden.',
	'settingsShowSpoilerDesc' : 'Spoilers worden afgedrukt.',
	'settingsAdditionalWaypointsDesc' : 'De afdrukweergave zal een tabel met de "additional waypoints" van een geocache bevatten.',
	'settingsLoggedVisitsDesc' : 'Dit toont een "Find Counts" overzicht.',
	'settingsPageBreakDesc' : 'Bij het afdrukken komt achter elke geocache een nieuwe pagina.',
	'settingsPageBreakAfterMapDesc' : 'Er komt een nieuwe pagina tussen het overzicht en de geocaches.',
	'settingsFrontPageDesc' : 'Een overzicht wordt gemaakt met de volledige lijst van de geocaches met een index en plaats voor notities. ',
	'settingsOutlineMapDesc' : 'Het overzicht  zal een kaart met alle geocaches bevatten.',
	'settingsOutlineMapSingeDesc' : 'Na iedere geocache komt een kaart met de geocache en de additional waypoints.',
	'settingsGPXSchemaDesc' : "<ul><li><b>Groundspeak:</b> volgens het  originele Groundspeak GPX bestandsindeling dat alle info bevat voor elk modern GPS toestel.</li>\
	<li><b>Geocaching.com.au:</b> implementatie van het gratis geocaching.com.au formaat. Niet alle GPS toestellen en programma\'s kunnen dit formaat aan.</li></ul>\
	<b>Indien bij het inlezen van de gegevens, probeer je best nogmaals met het \"Groundspeak\"\  formaat!</b>",
	'settingsGPXHtmlDesc' : 'Sommige programma\'s en GPS toestellen hebben problemen met geocache beschrijvingen in HTML. Indien dit het geval is, kan je best deze optie afzetten.',
	'settingsGPXWptsDesc' : 'Additional waypoints worden geëxporteerd als extra waypoint naar GPX. Alle paarkeerplaatsen zullen zichtbaar zijn op je toestel.',
	'settingsGPXStripGCDesc' : 'Oudere GPS toestellen kunnen problemen hebben met waypoints waarvan de naam langer is dan 8 tekens. Gebruik deze optie indien dit het geval is.',	
	'settings_map_geocacheidDesc' : 'De GCCode (eg. GC2NTTG) wordt getoond op de kaart.',
	'settings_map_geocacheindexDesc' : 'De volgorde binnen de toer wordt getoond op de kaart.',
	'settings_map_geocachenameDesc' : 'De naam van de geocache wordt getoond op de kaart.',
	'settings_map_awptsDesc' : 'Additional waypoints worden getoond op de kaart.',
	'settings_map_awpt_nameDesc' : 'De naam van het additional waypoint wordt getoond op de kaart.',
	'settings_map_awpt_lookupDesc' : 'De lookup code van het additional waypoints wordt getoond op de kaart.',
	'settings_map_owptsDesc' : 'Eigen waypoints worden getoond op de kaart.',
	'settings_map_owpt_nameDesc' : 'De naam van het eigen waypoint wordt getoond op de kaart.',
	'settings_map_gcdeDesc' : 'Met deze optie kan je ook de geocaching.de  kaart in de toer zetten.',	
	'settingsMapType' : 'Standaard kaarttype',
	'settingsMapSize' : 'Standaard kaartgrootte',
	'addOwnWaypoint' : 'Eigen waypoint toevoegen',
	"markerCoordinate" : "Coördinaten",
	"markerContent" : "Inhoud",
	"markerType" : "Type",
	"markerContentHint" : "zal getoond worden in afdrukweergave",
	"markerCaption" : "Onderschrift",
	"autoTour" : "autoTour",
	"autoTourWait" : "Even geduld – autoTour wordt aangemaakt!",
	"autoTourRadius" : "Radius",
	"autoTourCenter" : "Middelpunt",
	"autoTourHelp" : "coördinaten of adres:<i>N50° 53.692 E004° 20.478</i> or <i>50.894867 4.341300</i> of <i>Atomium</i>",
	"autoTourRefresh" : "Maak een autoTour aan met deze waarden!",
	"autoTourCacheCounts" : "Geschat <i>aantal</i> geocaches in deze regio:",
	"autoTourDuration" : "Geschatte tijd om deze autoTour aan te maken:",
	"kilometer" : "Kilometer",
	"mile" : "Miles",
	"save" : "Bewaren",
	"cancel" : "Annuleren",
	"close" : "Sluiten",
	'install' : 'Annuleren',
	"edit" : "Editeren",
	"example" : "bv. ",	
	"exampleCoords" : "<i>N50°53.692 E004° 20.478</i> or <i>50.894867 4.341300</i>",	
	"dontPrintHint" : "<b>Ter info :</b><br/>Gegevens in dit kader worden <u>niet</u> be afgedrukt!",
	'ERROR_DIALOG' : "<img src='http://img.groundspeak.com/forums/emoticons/signal/sad.gif'>&nbsp;&nbsp;Spijtig genoeg is er een fout gebeurd:<br/>##ERROR##<br/> probeer het nogmaals!<div align='center' style='border-bottom: 1px solid gray; padding: 5px; margin-bottom: 10px;'></div>Als de fout blijft voorkomen, gelieve dan een foutenrapport te versturen.<br><div align='right'  class='dialogFooter' style='padding: 5px; margin-bottom: 10px;'><form action='"+GCTOUR_HOST+"/error' method='post'><input type='hidden' name='redir' value='##LOCATION##'><input type='hidden' name='user' value='##USERNAME##'><textarea name='report' style='display:none;' >##ERRORREPORT##</textarea><input onclick='return false;' type='button' value='close window' style='background-image:url("+closebuttonImage+")'><input type='submit' value='foutenrapport versturen'  style='background-image:url("+sendMessageImage+")'></form></div>",
    "ERROR_REPORT_SUBMIT" : "send report",
    "SCRIPT_ERROR" : "Blijkbaar blokkeer je javascript functionaliteiten (bv. NoScript). Gelieve 'aolcdn.com' en 'geocaching.com' niet te filteren om gebruik te kunnen maken van GCTour!" ,
	'mapTypes' : 
		[{"caption":"Google Map","value":"roadmap"}, 
		 {"caption":"Google Satellite","value":"satellite"}, 
		 {"caption":"Google Hybrid","value":"hybrid"}, 
		 {"caption":"Google Terrain","value":"terrain"}, 
		 {"caption":"Topo Germany","value":"oda"}, 
		 {"caption":"OSM Mapnik","value":"mapnik"}, 
		 {"caption":"OSM Osma","value":"osma"}, 
		 {"caption":"OSM Cycle","value":"osmaC"},
		 {"caption":"OSM Public Transport","value":"osmaP"}],
	'updateDialog' : "<div><img src='http://gctour.madd.in/images/antenna.gif' style='float:right'><p>Er is een nieuwe versie van&nbsp;&nbsp;&nbsp;<a target='_blank' href='http://gctour.madd.in'><b>GCTour</b></a>&nbsp;&nbsp;&nbsp;beschikbaar voor installatie.</p><p>Versie <b>###VERSION_OLD###</b> is momenteel geïnstalleerd. De recentste versie is <b>###VERSION_NEW###</b></p><p><b>Versie geschiedenis:</b></p><div class='dialogHistory'>###VERSION_HISTORY###</div><div class='dialogFooter'></div>"
	};
    lang_eng = {		
	'name' : 'English',
	'language' : 'Language',
	'addToTour' : 'Add to Tour',
	'directPrint' : 'Print this geocache',
	'moveGeocache' : 'Move the coordinates', 
	'movedGeocache' : 'The coordinates to this geocaches are moved.',
	'moveGeocacheHelp' : 'You have the chance to change the original coordinates of this geocache. These will than used in the printview and also in the GPX file. This is quiet handy if you solve a mystery.',
	'originalCoordinates' : 'Original coordinates',
	'newCoordinates':"New coordinates",
	'addMarkedToTour' : 'Add checked to tour',
	'addShownBookmarks' : "to <b>curent</b> tour",
	'addShownBookmarksToNewTour' : 'to <b>new</b> tour',
	'showCaches' : 'Add shown geocaches:',
	'newVersionDialog' : 'There is a new version of GCTour.\nDo you want to update? \n\n',
	'removeTourDialog' : "Are you sure to remove this tour?",
	'logYourVisit' : "Log your visit",
	'removeFromList' : "Remove from list",
	'emptyList' : 'The list is empty.',
	'notLogedIn' : 'Please login ...',
	'months' : ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
	'prinviewTitle' : 'http://gctour.madd.in',
	'pleaseWait' : 'Please wait - loading data ...',
	'newList' : 'New Tour',
	'sendToGps' : 'Send to GPS',
	'makeMap' : 'Make map',	
	'makeMapWait' : 'Testing availablity of this map',
	'printview' : 'Printview',
	'downloadGpx' : 'Download GPX',
	'sendMessage' : "You have found a bug? Do you have suggestion on GCTour? I would like to hear your opinion.<br/>Feel free to send me a <b>message</b>:",
	'sendMessageTitle' : "Send a message to the author.",
	'sendMessageSubmit' : "Submit this message!",
	'showSettings' : 'Show settings',	
	'settings_caption' : 'Settings',
	'settingsPrintMinimal' : 'Minimal printview',
	'settingsLogCount' : 'Number of logs in printview',
	'settingsLogCountNone' : 'none<br/>',
	'settingsLogCountAll' : 'all<br/>',
	'settingsLogCountShow' : 'show',
	'settingsEditDescription' : 'Description editable',
	'settingsRemoveImages' : 'Remove images on click',
	'settingsShowSpoiler' : 'Display spoiler',
	'settingsAdditionalWaypoints' : 'Show additional waypoints',
	'settingsLoggedVisits' : 'Show log counter',
	'settingsAttributes' : 'Show attributes',
	'settingsDecryptHints' : 'Decrypt hints',
	'settingsSendToGPS' : 'Send to GPS',
	'settingsShowGPX' : 'Show the GPX-File',
	'settingsDownladGPX' : 'GPX download<br/>',
	'settingsGPX' : 'GPX Settings',
	'settingsGPXHtml' : 'Description with HTML',
	'settingsUploadTour' : 'Tour upload',
	'settingsGPXStripGC' : 'Strip "GC" in GC-Code',
	'settingsGPXWpts' : 'Export additional waypoints',
	'settingsGPXSchema' : 'GPX-Version',
	'settingsGPXSchemaGS' : 'groundspeak',
	'settingsGPXSchemaAU' : 'geocaching.com.au',	
	'settings_map' : 'Map',
	'settings_map_geocacheid' : 'Show geocache id',	
	'settings_map_geocacheindex' : 'Show geocache index',
	'settings_map_geocachename' : 'Show geocache name',
	'settings_map_awpts' : 'Display addtional waypoints',
	'settings_map_awpt_name' : 'Show name of the additional waypoints',
	'settings_map_awpt_lookup' : 'Show lookup code of additional waypoints',	
	'settings_map_owpts' : 'Display own waypoints',
	'settings_map_owpt_name' : 'Show name of own waypoints',
	'settings_map_gcde' : 'Show map from geocaching.de',	
	'loadTour' : 'Load tour:<br/>',
	'openTour' : 'Load a tour',
	'load' : 'Load',
	'removeTour' : 'Delete this tour',	
	'deleteCoordinates' : 'Delete coordinates',
	'copyTour' : 'Copy tour',
	'copy' : 'Copy',
	'newTourDialog' : 'Please enter a name for the new tour ...',
	'rename' : 'Rename',
	'upload' : 'Upload tour',
	'onlineTour' : 'Download Tour',
	'webcodeDownloadHelp':'Please enter here the webcode you receive from your friend and click on "Download tour".',	
	'webcodeDownloadButton':'Download tour',	
	'findMe' : 'Find me!',
	'webcodeerror' : 'The choosen webcode does not exist!',
	'tourUploaded1' : 'Uploading tour was successful!\nWebcode:\n      ',
	'tourUploaded2' : '\nYou can view the tour at http://gctour.madd.in.\nImportant: Please note webcode in order to retrieve the tour!!',	
	'settingsFontSize' : 'Fontsize:',
	'settingsPageBreak' : 'Page break after cache:',
	'settingsPageBreakAfterMap' : 'Page break after map:',
	'webcodePrompt' : 'Download tour\nPlease enter a valid webcode, to load the tour:',
	'webcodesuccess' : ' was successfully loaded!',
	'webcodeOld' : '\n    !!ATTENTION!!\nThis webcode is connected with an old tour. To get all benefits of GCTour 2.0 you must upload this tour again.',
	'printviewCache' : 'Geocache',
	'printviewFound' : 'Found',
	'printviewNote' : 'Note',
	'printviewMarker' : "Own waypoint",
	'printviewAdditionalWaypoint' : "Additional waypoints",
	'printviewRemoveMap' : "remove map",
	'printviewZoomMap' : "Open this map in a new tab.",
	'settingsFrontPage' : 'Front page:',
	'settingsOutlineMap' : 'Outline map for all caches:',
	'settingsOutlineMapSinge' : 'Outline map for every cache:',	
	'settingsDecryptHintsDesc' : 'Hints will be already decrypted in the printout.',
	'settingsPrintMinimalDesc' : 'This contains only the hint and spoiler of a geocache.',
	'settingsEditDescriptionDesc' : 'The description can be edited in the way you want it.',
	'settingsShowSpoilerDesc' : 'Spoiler images will be on the printout.',
	'settingsAdditionalWaypointsDesc' : 'The printview will contain a table with all "Additional waypoints" from a geocache.',
	'settingsLoggedVisitsDesc' : 'This will show the "Find counts" overview.',
	'settingsPageBreakDesc' : 'After each geocache there will be a page break. Visiable after printing.',
	'settingsPageBreakAfterMapDesc' : 'It will be a page break after the overview to seperate it from the geocaches.',
	'settingsFrontPageDesc' : 'An overview will be generated containing the complete list of geocaches including index and space to take notes. ',
	'settingsOutlineMapDesc' : 'The overview will contain a map with all geocaches.',
	'settingsOutlineMapSingeDesc' : 'After each geocache a map containing the geocache and its "Additional waypoints" will be shown.',
	'settingsGPXSchemaDesc' : "<ul><li><b>Groundspeak:</b> a rebuild of the original Groundspeak GPX file containing all information for modern GPSr.</li>\
	<li><b>Geocaching.com.au:</b> Implementation of the free geocaching.com.au format. Unfortunately some GPSr/programms have problems using this format.</li></ul>\
	<b>If you are unable to show some information in your program or on your GPSr be sure that you select \"Groundspeak\"\ and then try it again!</b>",
	'settingsGPXHtmlDesc' : 'Some programs/GPSr have problems to show geocaches when their description is HTML formated. If you only see scrabbled descriptions then please disable this option.',
	'settingsGPXWptsDesc' : 'Additional waypoints will be exported as extra waypoint to the GPX. You will see every parking place on your unit.',
	'settingsGPXStripGCDesc' : 'Older GPSr still have problems with waypoints having their name longer than 8 characters. Please use this option if you own such an unit.',	
	'settings_map_geocacheidDesc' : 'The GCCode (eg. GC0815) will be shown on the map.',
	'settings_map_geocacheindexDesc' : 'The position of each waypoint in the current tour will be shown on the map.',
	'settings_map_geocachenameDesc' : 'The name of an geocache will be shown on the map.',
	'settings_map_awptsDesc' : 'If enabled, additional waypoints will be shown on the map.',
	'settings_map_awpt_nameDesc' : 'The name of the additional waypoints will be shown on the map.',
	'settings_map_awpt_lookupDesc' : 'The lookup code of the additional waypoints will be shown on the map.',
	'settings_map_owptsDesc' : 'Own waypoints in the current tour will be shown on the map.',
	'settings_map_owpt_nameDesc' : 'Display the name of your own waypoints',
	'settings_map_gcdeDesc' : 'You will see the geocaching.de map in addition to your tour.',	
	'settingsMapType' : 'Default map type',
	'settingsMapSize' : 'Default map size',
	'addOwnWaypoint' : 'Add own waypoint',
	"markerCoordinate" : "Coordinates",
	"markerContent" : "Content",
	"markerType" : "Type",
	"markerContentHint" : "Will be shown in the printview",
	"markerCaption" : "Caption",
	"autoTour" : "autoTour",
	"autoTourWait" : "Please wait - generating autoTour!",
	"autoTourRadius" : "Radius",
	"autoTourCenter" : "Center",
	"autoTourHelp" : "Coordinates or address:<i>N51° 12.123 E010° 23.123</i> or <i>40.597 -75.542</i> or <i>Paris Eiffel Tower</i>",
	"autoTourRefresh" : "Create autoTour with this values!",
	"autoTourCacheCounts" : "Estimated <i>total number</i> of caches in this region:",
	"autoTourDuration" : "Estimated duration to produce this autoTour:",
	"kilometer" : "Kilometer",
	"mile" : "Miles",
	"save" : "Save",
	"cancel" : "Cancel",
	"close" : "Close",
	'install' : 'Install',
	"edit" : "edit",
	"example" : "eg. ",	
	"exampleCoords" : "<i>N51° 12.123 E010° 23.123</i> or <i>40.597 -75.542</i>",	
	"dontPrintHint" : "<b>Information :</b><br/>Elements in such a box will <u>not</u> be printed!",
	'ERROR_DIALOG' : "<img src='http://img.groundspeak.com/forums/emoticons/signal/sad.gif'>&nbsp;&nbsp;I'm sorry but an error occurs:<br/>##ERROR##<br/> Please just try again!<div align='center' style='border-bottom: 1px solid gray; padding: 5px; margin-bottom: 10px;'></div>If this error comes every time, please send this error report.<br><div align='right'  class='dialogFooter' style='padding: 5px; margin-bottom: 10px;'><form action='"+GCTOUR_HOST+"/error' method='post'><input type='hidden' name='redir' value='##LOCATION##'><input type='hidden' name='user' value='##USERNAME##'><textarea name='report' style='display:none;' >##ERRORREPORT##</textarea><input onclick='return false;' type='button' value='close window' style='background-image:url("+closebuttonImage+")'><input type='submit' value='send error report'  style='background-image:url("+sendMessageImage+")'></form></div>",
    "ERROR_REPORT_SUBMIT" : "send report",
    "SCRIPT_ERROR" : "It appears, that you are blocking some javascript sources (e.g. NoScript). Please allow 'aolcdn.com' and 'geocaching.com' permanently to use GCTour!" ,
	'mapTypes' : 
		[{"caption":"Google Map","value":"roadmap"}, 
		 {"caption":"Google Satellite","value":"satellite"}, 
		 {"caption":"Google Hybrid","value":"hybrid"}, 
		 {"caption":"Google Terrain","value":"terrain"}, 
		 {"caption":"Topo Germany","value":"oda"}, 
		 {"caption":"OSM Mapnik","value":"mapnik"}, 
		 {"caption":"OSM Osma","value":"osma"}, 
		 {"caption":"OSM Cycle","value":"osmaC"},
		 {"caption":"OSM Public Transport","value":"osmaP"}],
	'updateDialog' : "<div><img src='http://gctour.madd.in/images/antenna.gif' style='float:right'><p>There is a new version of&nbsp;&nbsp;&nbsp;<a target='_blank' href='http://gctour.madd.in'><b>GCTour</b></a>&nbsp;&nbsp;&nbsp;available for installation.</p><p>You currently have version <b>###VERSION_OLD###</b> installed. The latest version is <b>###VERSION_NEW###</b></p><p><b>Version History:</b></p><div class='dialogHistory'>###VERSION_HISTORY###</div><div class='dialogFooter'></div>"
	};
lang_fre= {		
	'name' : 'Français',
	'language' : 'Language',
	'addToTour' : 'Ajouter au Tour',
	'directPrint' : 'Imprimer cette geocache',
	'moveGeocache' : 'Ajuster les coordonnées', 
	'movedGeocache' : 'Les coordonnées de cette cache ont été ajustées.',
	'moveGeocacheHelp' : 'Vous avez la possibilité d\'ajuster les coordonnées de cette cache. Ces coordonnées seront utilisées dans la version imprimable et dans le fichier GPX . Très utile pour la saisie des solutions des caches Mystery.',
	'originalCoordinates' : 'Coordonnées initiales',
	'newCoordinates':"Nouvelles coordonnées",
	'addMarkedToTour' : 'Ajouter la selection au Tour',
	'addShownBookmarks' : "au tour <b>curent</b>",
	'addShownBookmarksToNewTour' : 'à un <b>nouveau</b> Tour',
	'showCaches' : 'Ajouter les caches affichées:',
	'newVersionDialog' : 'Une nouvelle version de GCTour est disponible.\n Voulez-vous mettre à jour? \n\n',
	'removeTourDialog' : "Etes-vous sûrs de vouloir supprimer ce Tour?",
	'logYourVisit' : "Loguer votre visite",
	'removeFromList' : "Supprimer de la liste",
	'emptyList' : 'La liste est vide.',
	'notLogedIn' : 'Merci de vous connecter ...',
	'months' : ["jan", "fév", "mar", "avr", "mai", "jui", "jul", "aou", "sep", "oct", "nov", "dec"],
	'prinviewTitle' : 'http://gctour.madd.in',
	'pleaseWait' : 'Veuillez patienter...',
	'newList' : 'Nouveau Tour',
	'sendToGps' : 'Transférer vers GPS',
	'makeMap' : 'Générer la carte',	
	'makeMapWait' : 'Vérification de la disponibilité et création de la carte... ',
	'printview' : 'Générer la version imprimable',
	'downloadGpx' : 'Télécharger le GPX',
	'sendMessage' : "Vous avez trouvé un bug ? Vous avez une suggestion à propos de GCTour? Votre opinion m'intéresse.<br/>Envoyez-moi un<b>message</b>:",
	'sendMessageTitle' : "Contacter l'auteur",
	'sendMessageSubmit' : "Envoyer le message!",
	'showSettings' : 'Configurer',	
	'settings_caption' : 'Configuration',
	'settingsPrintMinimal' : 'Version imprimable minimale',
	'settingsLogCount' : 'Nombre de logs à inclure dans la version imprimable',
	'settingsLogCountNone' : 'aucun<br/>',
	'settingsLogCountAll' : 'tous<br/>',
	'settingsLogCountShow' : 'afficher',
	'settingsEditDescription' : 'Description éditable',
	'settingsRemoveImages' : 'Suppression des images par simple clic',
	'settingsShowSpoiler' : 'Afficher les spoilers',
	'settingsAdditionalWaypoints' : 'Afficher les Waypoints additionnels',
	'settingsLoggedVisits' : 'Afficher le nombre de logs',
	'settingsAttributes' : 'Afficher les attributs',
	'settingsDecryptHints' : 'Decrypter les hints',
	'settingsSendToGPS' : 'Envoyer vers le GPS',
	'settingsShowGPX' : 'Afficher le fichier GPX',
	'settingsDownladGPX' : 'Téléchargement du GPX<br/>',
	'settingsGPX' : 'Paramètres du GPX',
	'settingsGPXHtml' : 'Description au format HTML',
	'settingsUploadTour' : 'Soumettre un Tour',
	'settingsGPXStripGC' : 'Tronquer "GC" dans le GC-Code',
	'settingsGPXWpts' : 'Exporter les Waypoints additionnels',
	'settingsGPXSchema' : 'version GPX',
	'settingsGPXSchemaGS' : 'groundspeak',
	'settingsGPXSchemaAU' : 'geocaching.com.au',	
	'settings_map' : 'Carte',
	'settings_map_geocacheid' : 'Afficher l\'Id de la cache',	
	'settings_map_geocacheindex' : 'Afficher le sommaire des caches',
	'settings_map_geocachename' : 'Afficher le nom des caches',
	'settings_map_awpts' : 'Afficher les Waypoints',
	'settings_map_awpt_name' : 'Afficher les Waypoints additionnels',
	'settings_map_awpt_lookup' : 'Afficher les codes lookup des Waypoints additionnels',	
	'settings_map_owpts' : 'Afficher les waypoints personnels',
	'settings_map_owpt_name' : 'Afficher le nom des waypoints personnels',
	'settings_map_gcde' : 'Afficher la carte depuis geocaching.de',	
	'loadTour' : 'Charger un Tour:<br/>',
	'openTour' : 'Ouvrir un Tour',
	'load' : ' : Le charger',
	'removeTour' : 'Supprimer ce Tour',	
	'deleteCoordinates' : 'Supprimer les coordonnées',
	'copyTour' : 'Copier le Tour',
	'copy' : 'Copier',
	'newTourDialog' : 'Veuillez saisir un nom pour le nouveau Tour ...',
	'rename' : 'Renommer',
	'upload' : 'Soumettre un Tour',
	'onlineTour' : 'Télécharger un Tour',
	'webcodeDownloadHelp':'Entrer ici le webcode que vous avez reçu et cliquer sur "Télécharger le Tour".',	
	'webcodeDownloadButton':'Télécharger le Tour',	
	'findMe' : 'Localisez-moi!',
	'webcodeerror' : 'Le webcode saisi est inexistant!',
	'tourUploaded1' : 'Le Tour a été correctement transféré!\nWebcode:\n      ',
	'tourUploaded2' : '\nVous pouvez visualiser ce Tour sur http://gctour.madd.in.\nImportant: Notez bien le webcode pour une utilisation ultérieure!!',	
	'settingsFontSize' : 'Taille des caractères:',
	'settingsPageBreak' : 'Saut de page entre les caches:',
	'settingsPageBreakAfterMap' : 'Saut de page après la carte',
	'webcodePrompt' : 'Téléchargement du Tour\nMerci de sasir un webcode pour le téléchargement du Tour:',
	'webcodesuccess' : ' a été chargé avec succès!',
	'webcodeOld' : '\n    !!ATTENTION!!\nCe webcode corrrespond à un ancien tour. Pour profiter pleinement de GCTour 2.0 vous devez soumettre de nouveau ce Tour.',
	'printviewCache' : 'Geocache',
	'printviewFound' : 'Trouvée',
	'printviewNote' : 'Note',
	'printviewMarker' : "Waypoint personnel",
	'printviewAdditionalWaypoint' : "Waypoints Additionnels",
	'printviewRemoveMap' : "Supprimer la carte",
	'printviewZoomMap' : "Ouvrir cette carte dans un nouvel onglet.",
	'settingsFrontPage' : 'Page d\'accueil',
	'settingsOutlineMap' : 'Vue d\'ensemble de toutes les caches:',
	'settingsOutlineMapSinge' : 'Vue d\'ensemble pour chaque cache:',	
	'settingsDecryptHintsDesc' : 'Les indices seront décryptés dans la version imprimable.',
	'settingsPrintMinimalDesc' : 'Ne contient que l\'indice et le spoiler de la cache.',
	'settingsEditDescriptionDesc' : 'La description est éditable comme bon vous semble.',
	'settingsShowSpoilerDesc' : 'Les images Spoiler seront visibles dans la version imprimables.',
	'settingsAdditionalWaypointsDesc' : 'La version imprimable contiendra un tableau avec tous les "Waypoints additionnels" de la cache.',
	'settingsLoggedVisitsDesc' : 'Affiche un récapitulatif des "Trouvé(s)".',
	'settingsPageBreakDesc' : 'Il y aura un saut de page après chaque cache. Visible à l\'impression.',
	'settingsPageBreakAfterMapDesc' : 'Il y aura un saut de page après la vue globale du Tour pour la séparer des pages de caches qui suivent.',
	'settingsFrontPageDesc' : 'Une vue d\'ensemble sera générée et incluera un index avec des cases dédiées à la prise de notes. ',
	'settingsOutlineMapDesc' : 'La vue d\'ensemble incluera une carte avec toutes les caches.',
	'settingsOutlineMapSingeDesc' : 'Après chaque cache, une carte indiquant l\'emplacement de la cache et de ses Waypoints additionnels sera affichée.',
	'settingsGPXSchemaDesc' : "<ul><li><b>Groundspeak:</b> une regénération du GPX original de Groundspeak contenant toutes les informations destinées aux GPSr modernes.</li>\
	<li><b>Geocaching.com.au:</b> Utilisation du GPX au format gratuit geocaching.com.au. Malheureusement certains GPSr/programmes n'affichent pas correctement ce format.</li></ul>\
	<b>Si vous ne parvenez pas à afficher certaines informations dans votre programme ou GPSr, vérifiez que vous avez sélectionné \"Groundspeak\"\ et recommencez!</b>",
	'settingsGPXHtmlDesc' : 'Certains programmes/GPSr ont des problèmes pour afficher les description au format HTML. Si vous ne voyez qu\'une description tronquée de la cache, désactivez cette option.',
	'settingsGPXWptsDesc' : 'Les Waypoints additionnels seront exportés vers votres GPS. Les parkings conseillés seront visibles sur votre GPS.',
	'settingsGPXStripGCDesc' : 'Les anciens GPSr ont parfois des problèmes avec les noms de Waypoints de plus de 8 caractères. Dans ce cas cochez cette option.',	
	'settings_map_geocacheidDesc' : 'Les codes GC (eg. GC1S5ZE) seront affichés sur la carte.',
	'settings_map_geocacheindexDesc' : 'Les Waypoints seront affichés sur la carte.',
	'settings_map_geocachenameDesc' : 'Les noms des caches seront affichés sur la carte.',
	'settings_map_awptsDesc' : 'Si cette option est cochée les Waypoints associées aux caches seront affichés sur la carte.',
	'settings_map_awpt_nameDesc' : 'Les noms des waypoint additionnels seront affichés sur la carte.',
	'settings_map_awpt_lookupDesc' : 'Les codes lookup des Waypoints seront affichés sur la carte.',
	'settings_map_owptsDesc' : 'Les Waypoints personnels seront visibles sur la carte.',
	'settings_map_owpt_nameDesc' : 'Affiche le nom des Waypoints personnels sur la carte',
	'settings_map_gcdeDesc' : 'La carte de geocaching.de sera ajoutée à la version imprimable de votre Tour.',	
	'settingsMapType' : 'Type de carte par défaut',
	'settingsMapSize' : 'Taille de carte par défaut',
	'addOwnWaypoint' : 'Ajouter un Waypoint personnel',
	"markerCoordinate" : "Coordonnées",
	"markerContent" : "Description",
	"markerType" : "Type",
	"markerContentHint" : "sera visble dans la version imprimable",
	"markerCaption" : "Légende",
	"autoTour" : "autoTour",
	"autoTourWait" : "Veuillez patienter pendant la génération automatique du Tour ...",
	"autoTourRadius" : "Rayon",
	"autoTourCenter" : "Centre",
	"autoTourHelp" : "Coordonnées ou adresse:<i>N51° 12.123 E010° 23.123</i> ou <i>40.597 -75.542</i> ou <i>Paris Tour Eiffel</i>",
	"autoTourRefresh" : "Créer un autoTour avec ces valeurs",
	"autoTourCacheCounts" : "Estimation du<i>nombre total</i> de cache dans cette zone:",
	"autoTourDuration" : "Durée estimée de création de cet autoTour:",
	"kilometer" : "Kilomètre",
	"mile" : "Miles",
	"save" : "Enregistrer",
	"cancel" : "Abandonner",
	"close" : "Fermer",
	'install' : 'Installer',
	"edit" : "Editer",
	"example" : "Ex. ",	
	"exampleCoords" : "<i>N51° 12.123 E010° 23.123</i> ou <i>40.597 -75.542</i>",	
	"dontPrintHint" : "<b>Information :</b><br/>Les éléménts ayant cette apparence ne seront <u>pas</u> imprimés!",
	'ERROR_DIALOG' : "<img src='http://img.groundspeak.com/forums/emoticons/signal/sad.gif'>&nbsp;&nbsp;Désolé une erreur est survenue:<br/>##ERREUR##<br/> Réessayez SVP !<div align='center' style='border-bottom: 1px solid gray; padding: 5px; margin-bottom: 10px;'></div>Si cette erreur se reproduit, merci d'envoyer le rapport d'erreur.<br><div align='right'  class='dialogFooter' style='padding: 5px; margin-bottom: 10px;'><form action='"+GCTOUR_HOST+"/error' method='post'><input type='hidden' name='redir' value='##LOCATION##'><input type='hidden' name='user' value='##USERNAME##'><textarea name='report' style='display:none;' >##ERRORREPORT##</textarea><input onclick='return false;' type='button' value='close window' style='background-image:url("+closebuttonImage+")'><input type='submit' value='send error report'  style='background-image:url("+sendMessageImage+")'></form></div>",
    "ERROR_REPORT_SUBMIT" : "envoi du rapport",
    "SCRIPT_ERROR" : "Il semble que des javascripts ne peuvent s'exécuter sur votre ordinateur (e.g. NoScript). Merci d'autoriser 'aolcdn.com' et 'geocaching.com' à utiliser GCTour de manière permanente!" ,
	'mapTypes' : 
		[{"caption":"Google Map","value":"roadmap"}, 
		 {"caption":"Google Satellite","value":"satellite"}, 
		 {"caption":"Google Hybrid","value":"hybrid"}, 
		 {"caption":"Google Terrain","value":"terrain"}, 
		 {"caption":"Topo Germany","value":"oda"}, 
		 {"caption":"OSM Mapnik","value":"mapnik"}, 
		 {"caption":"OSM Osma","value":"osma"}, 
		 {"caption":"OSM Cycle","value":"osmaC"},
		 {"caption":"OSM Public Transport","value":"osmaP"}],
	'updateDialog' : "<div><img src='http://gctour.madd.in/images/antenna.gif' style='float:right'><p>Une nouvelle version de&nbsp;&nbsp;&nbsp;<a target='_blank' href='http://gctour.madd.in'><b>GCTour</b></a>&nbsp;&nbsp;&nbsp;est disponible.</p><p>Version installée : <b>###VERSION_OLD###</b>. Version la plus récente disponible: <b>###VERSION_NEW###</b></p><p><b>Historique des versions:</b></p><div class='dialogHistory'>###VERSION_HISTORY###</div><div class='dialogFooter'></div>"
	};
    lang_ger = {
    
	'name' : 'Deutsch',
	'language' : 'Sprache',
	'addToTour' : 'Zur Tour hinzufügen',
	'directPrint' : 'Drucke diesen Geocache',
	'moveGeocache' : 'Verschiebe die Koordinaten',
	'movedGeocache' : 'Die Koordinaten zu diesem Geocache wurden verschoben!',
	'moveGeocacheHelp' : 'Hier hast du die Möglichkeit die original Koordinaten dieses Geocaches durch Neue zu ersetzen. Diese werden dann in der Druckansicht wie auch in der GPX verwendet. Praktisch bei der Lösung eines Mystery.',
	'originalCoordinates' : 'Original Koordinaten',
	'newCoordinates':"Neue Koordinaten",
	'addMarkedToTour' : 'markierte zur Tour hinzufügen',
	'addShownBookmarks' : 'zur <b>aktuellen</b> Tour hinzufügen',
	'addShownBookmarksToNewTour' : 'zu <b>neuer</b> Tour hinzufügen',
	'showCaches' : 'Angezeigte Caches:',
	'newVersionDialog' : 'Es gibt eine neuer Version der GCTour.\nZum update gehen? \n\n',
	'removeTourDialog' : "Soll die Tour wirklich gelöscht werden?",
	'logYourVisit' : "log your visit",
	'removeFromList' : "aus Liste entfernen",
	'emptyList' : 'Die Liste ist leer.',
	'notLogedIn' : 'Bitte einloggen ...',
	'months' : ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
	'prinviewTitle' : 'GCTour - http://gctour.madd.in',
	'pleaseWait' : 'Bitte warten - Daten werden geladen...',
	'newList' : 'neue Tour erstellen',
	'sendToGps' : 'an GPS senden',
	'makeMap' : 'Karte erzeugen',
	'makeMapWait' : 'Verfügbarkeit der Karte wird getestet.',
	'printview' : 'Druckansicht',
	'downloadGpx' : 'GPX downloaden',	
	'sendMessage' : "Du hast einen Fehler gefunden? Du möchtest eine Verbesserung vorschlagen oder deine Meinung zu GCTour loswerden? Dann schreibe mir eine <b>Nachricht:</b>",
	'sendMessageTitle' : "Sende eine Nachricht an den Entwickler.",
	'sendMessageSubmit' : "Schicke diese Nachricht ab!",
	'showSettings' : 'Einstellungen anzeigen',	
	'settings_caption' : 'Einstellungen',
	'settingsPrintMinimal' : 'Minimierte Druckansicht',
	'settingsLogCount' : 'Anzahl der Logs in Druckansicht',
	'settingsLogCountNone' : 'keine<br/>',
	'settingsLogCountAll' : 'alle<br/>',
	'settingsLogCountShow' : 'anzeigen',
	'settingsEditDescription' : 'Beschreibung editierbar',
	'settingsRemoveImages' : 'Bilder bei Klick entfernen',
	'settingsShowSpoiler' : 'Spoiler Bilder anzeigen',
	'settingsAdditionalWaypoints' : 'Additional Waypoints anzeigen',
	'settingsLoggedVisits' : 'Log-Counter anzeigen',
	'settingsAttributes' : 'Attributes anzeigen',
	'settingsDecryptHints' : 'Hints entschl&uuml;sseln',
	'settingsSendToGPS' : 'An GPS senden',
	'settingsShowGPX' : 'GPX anzeigen',
	'settingsDownladGPX' : 'GPX download<br/>',
	'settingsGPX' : 'GPX Einstellungen',
	'settingsGPXHtml' : 'Beschreibung mit HTML',
	'settingsGPXStripGC' : 'Entferne "GC" in GC-Code',
	'settingsGPXWpts' : 'Additional-Waypoints exportieren',
	'settingsGPXSchema' : 'GPX-Version',
	'settingsGPXSchemaGS' : 'groundspeak',
	'settingsGPXSchemaAU' : 'geocaching.com.au',
	'settingsUploadTour' : 'Tour upload',
	'settingsFontSize' : 'Schriftgr&ouml;&szlig;e:',
	'settingsPageBreak' : 'Seitenumbruch nach Geocache:',
	'settingsPageBreakAfterMap' : 'Seitenumbruch nach Übersichtskarte:',
	'settingsFrontPage' : 'Titelseite:',
	'settingsOutlineMap' : 'Übersichtskarte für alle Caches:',
	'settingsOutlineMapSinge' : 'Übersichtskarte für jeden Cache:',		
	'settingsDecryptHintsDesc' : 'Die Hinweise werden schon mittels Rot13 auf der Druckansicht entschlüsselt.',
	'settingsPrintMinimalDesc' : 'Beinhaltet nur noch Hint und Spoiler zu jedem Geocache.',
	'settingsEditDescriptionDesc' : 'Die Beschreibung lässt sich komplett nach eigenem Belieben anpassen.',
	'settingsShowSpoilerDesc' : 'Es werden die Spoiler mit gedruckt.',
	'settingsAdditionalWaypointsDesc' : 'In der Druckansicht findet sich eine Tabelle mit allen "Zusätzlichen Wegpunkten".',
	'settingsLoggedVisitsDesc' : 'Eine Übersicht wie oft der Geocache schon gefunden wurde.',
	'settingsPageBreakDesc' : 'Es wird nach jedem Geocache eine neue Seite angefangen. Sieht man erst beim Ausdrucken.',
	'settingsPageBreakAfterMapDesc' : 'Es wird ein Seitenumbruch nach der Übersichtseite gemacht, um das Deckblatt abzuheben.',
	'settingsFrontPageDesc' : 'Es wird eine Titelseite erzeugt mit allen Geocaches, Index und Platz für Notizen.',
	'settingsOutlineMapDesc' : 'Auf der Titelseite wird eine Karte mit allen Geocaches in der Tour angezeigt.',
	'settingsOutlineMapSingeDesc' : 'Unter jedem Geocache erscheint eine Karte mit seinen "Additional Waypoints"',
	'settingsGPXSchemaDesc' : "<ul><li><b>Groundspeak:</b> Ist ein Nachbau der Geocaching.com GPX Datei. Beinhaltet alle Information für moderne GPSr von Garmin.</li>\
	<li><li><b>Geocaching.com.au:</b> Implementierung des freien Formats von geocaching.com.au. Leider kann es hier zu einigen Problemen mit GPSr-Geräten kömmen.</li></ul>\
	<b>Bei Fehlern bitte einfach auf \"Groundspeak\"\ stellen und noch einmal versuchen!</b>",
	'settingsGPXHtmlDesc' : 'Manche Geräte/Programme haben Probleme beim Anzeigen eines Geocaches mit HTML-Formatierung. Wenn du nur noch kryptische Beschreibungen siehst, dann Bitte diese Option deaktivieren.',
	'settingsGPXWptsDesc' : 'Additional-Waypoints Werden als extra Wegpunkt mit in die GPX exportiert. Damit hat man jeden Parkplatz direkt auf dem Gerät.',
	'settingsGPXStripGCDesc' : 'Alte Geräte haben Probleme mit Wegpunkten deren Name länger als 8 Zeichen sind. Wenn du so ein altes Garmin hast, dann bitte diese Option anwählen!',	
	'settings_map' : 'Karten',
	'settings_map_geocacheid' : 'Geocache Code anzeigen',
	'settings_map_geocacheindex' : 'Geocache Index anzeigen',
	'settings_map_geocachename' : 'Geocache Namen anzeigen',
	'settings_map_awpts' : 'Additional Waypoints anzeigen',
	'settings_map_awpt_name' : 'Additional Waypoints Namen einblenden',
	'settings_map_awpt_lookup' : 'Additional Waypoints Lookup einblenden',
	'settings_map_owpts' : 'Eigene Wegpunkte einblenden',
	'settings_map_owpt_name' : 'Eigener Wegpunkt Name anzeigen',
	'settings_map_gcde' : 'Karte von geocaching.de einblenden',	
	'settings_map_geocacheidDesc' : 'Es wird immer der GCCode (z.B. GC0815) mit auf der Karte angezeigt.',
	'settings_map_geocacheindexDesc' : 'Die Postion innerhalb der Tour wird mit angezeigt.',
	'settings_map_geocachenameDesc' : 'Der Name eines Geocache wird zusätzlich mit eingeblendet.',
	'settings_map_awptsDesc' : 'Wenn aktiviert, dann werden die "Additional Waypoints" eines Geocaches mit angezeigt.',
	'settings_map_awpt_nameDesc' : 'Der Name eines "Additional Waypoints" wir mit angezeigt.',
	'settings_map_awpt_lookupDesc' : 'Der Lookupcode eines "Additional Waypoints" wir mit angezeigt.',
	'settings_map_owptsDesc' : 'Wenn du "Eigene Wegpunkte" mit in deiner Tour hast, so werden diese auch mit auf der Karte angezeigt.',
	'settings_map_owpt_nameDesc' : 'Zusätzlich kann man sich noch den Namen zu jedem Wegpunkt anzeigen lassen.',
	'settings_map_gcdeDesc' : 'Wenn das aktiviert wurde, werden automatisch zusätzliche zu deiner Tour, die Karte von Geocaching.de mit eingeblendet.',
	'loadTour' : 'Tour laden:<br/>',
	'openTour' : 'eine Tour laden',
	'load' : 'laden',
	'removeTour' : 'diese Tour löschen',
	'deleteCoordinates' : 'Koordinaten löschen',
	'copyTour' : 'Tour kopieren',
	'copy' : 'Kopie',
	'newTourDialog' : 'Bitte gib einen Namen für die neue Tour ein ...',
	'rename' : 'umbenennen',
	'upload' : 'Tour hochladen',
	'onlineTour' : 'Tour runterladen',
	'webcodeDownloadHelp':'Bitte gib hier den Webcode an, den du von deinem Freund bekommen hast und drücke dann auf "Tour runterladen".',
	'webcodeDownloadButton':'Tour runterladen',	
	'findMe' : 'Finde mich!',
	'webcodeerror' : 'Der angegebene Webcode existiert leider nicht!',
	'tourUploaded1' : 'Die Tour wurde erfolgreich hochgeladen!\nDer Webcode lautet:\n      ',
	'tourUploaded2' : '\nDie Onlineabfrage kann unter http://gctour.madd.in geschehen.\nWichtig: Bitte Webcode notieren um die Tour wieder aufzurufen!!',
	'webcodePrompt' : 'Tour download\nBitte gib einen gültigen Webcode ein,\num die dazu passende Tour zu laden:',
	'webcodesuccess' : ' wurde erfolgreich geladen!',
	'webcodeOld' : '\n    !!ACHTUNG!!\nEs handelt sich bei diesem Webcode um eine alte Tour. Um sie auch mit den Vorzügen von GCTour 2.0 nutzen zu können musst du sie bitte jetzt erneut hochladen.',
	'printviewCache' : 'Geocache',
	'printviewFound' : 'Fund',
	'printviewNote' : 'Notiz',
	'printviewMarker' : "Eigene Wegpunkte",
	'printviewAdditionalWaypoint' : "Zusätzliche Wegpunkte",
	'printviewRemoveMap' : "Karte entfernen",
	'printviewZoomMap' : "Diese Karte in einem neuem Tab öffen.",
	'settingsMapType' : 'Standard Kartentyp',
	'settingsMapSize' : 'Standard Kartengröße',
	'addOwnWaypoint' : 'eigener Wegpunkt hinzufügen',
	"markerCoordinate" : "Koordinaten",
	"markerContent" : "Inhalt",
	"markerType" : "Typ",
	"markerContentHint" : "wird in Druckansicht angezeigt",
	"markerCaption" : "Beschriftung",
	"autoTour" : "autoTour",
	"autoTourWait" : "Bitte warten - autoTour wird erzeugt!",
	"autoTourRadius" : "Radius",
	"autoTourCenter" : "Mittelpunkt",
	"autoTourHelp" : "Koordinaten oder Adresse:<i>N51° 12.123 E010° 23.123</i> oder <i>40.597 -75.542</i> oder <i>Berlin Ernst-Reuter-Platz</i>",
	"autoTourRefresh" : "Erzeuge eine autoTour mit diesen Werten!",
	"autoTourCacheCounts" : "Geschätze <i>gesamt</i> Anzahl Caches in dieser Region:",
	"autoTourDuration" : "Geschätze Dauer der Erzeugung dieser autoTour:",
	"kilometer" : "Kilometer",
	"mile" : "Meilen",
	"save" : "Speichern",
	"cancel" : "Abbrechen",
	"close" : "Schließen",
	'install' : 'Installieren',
	"edit" : "bearbeiten",
	"example" : "Beispiel:",
	"exampleCoords" : "<i>N51° 12.123 E010° 23.123</i> oder <i>40.597 -75.542</i>",	
	"dontPrintHint" : "<b>Hinweis:</b><br/>Elemente in einem solchen Kasten werden <u>nicht</u> mit gedruckt!",
	'ERROR_DIALOG' : "<img src='http://img.groundspeak.com/forums/emoticons/signal/sad.gif'>&nbsp;&nbsp;Es tut mir leid, aber es ist ein Fehler aufgetreten:<br/>##ERROR##<br/>Versuch es einfach noch einmal!<br><br>Wenn dieser Fehler öfter auftritt, dann schicke mir bitte einen Fehlerbericht.<br><div align='right' class='dialogFooter' style='padding: 5px; margin-bottom: 10px;'><form action='"+GCTOUR_HOST+"/error' method='post'><input type='hidden' name='redir' value='##LOCATION##'><input type='hidden' name='user' value='##USERNAME##'><textarea name='report' style='display:none;' >##ERRORREPORT##</textarea><input onclick='return false;' type='button' value='schließen' style='background-image:url("+closebuttonImage+")'><input type='submit' value='Fehlerbericht senden'  style='background-image:url("+sendMessageImage+")'></form></div>",
	"SCRIPT_ERROR" : "Es sieht so aus, als blockierst du benötigte Javascript-Quellen (z.B. durch das Firefox-Addon NoScript). Bitte lasse 'aolcdn.com' und 'geocaching.com' dauerhaft zu, um GCTour zu nutzen!" ,
	'mapTypes' : 
		[{"caption":"Google Karte","value":"roadmap"}, 
		 {"caption":"Google Satellit","value":"satellite"}, 
		 {"caption":"Google Hybrid","value":"hybrid"}, 
		 {"caption":"Google Gelände","value":"terrain"},
		 {"caption":"Topo Deutschland","value":"oda"}, 
		 {"caption":"OSM Mapnik","value":"mapnik"}, 
		 {"caption":"OSM Osma","value":"osma"}, 
		 {"caption":"OSM Fahrrad","value":"osmaC"},
		 {"caption":"OSM ÖPNV","value":"osmaP"}],
	'updateDialog' : "<div><img src='http://gctour.madd.in/images/antenna.gif' style='float:right'><p>Es ist eine neue Version von &nbsp;&nbsp;&nbsp;<a target='_blank' href='http://gctour.madd.in'><b>GCTour</b></a>&nbsp;&nbsp;&nbsp;verf&uuml;gbar.</p><p>Du benutzt die Version <b>###VERSION_OLD###</b>. Die aktuellste Version ist <b>###VERSION_NEW###</b></p><p><b>Versions Historie:</b></p><div class='dialogHistory'>###VERSION_HISTORY###</div><div class='dialogFooter'></div>"
	};
	
	
lang_por = {
	'name' : 'Portugu&#234;s',
	'language' : 'Idioma',
	'addToTour' : 'Adicionar &#224; rota',
	'directPrint' : 'Imprimir esta Geocache',
	'moveGeocache' : 'Mover as coordenadas', 
	'movedGeocache' : 'As coordenadas desta geocache foram mudadas.',
	'moveGeocacheHelp' : 'Tens a oportunidade de mudar as coordenadas originais desta geocache. Ser&#227;o usadas no modo de impress&#227;o e tamb&#233;m no ficheiro GPX. &#201; util se resolver o enigma.',
	'originalCoordinates' : 'Coordenadas Originais',
	'newCoordinates':"Novas Coordenadas",
	'addMarkedToTour' : 'Adicionar seleccionadas para a Rota',
	'addShownBookmarks' : "para a rota <b>seleccionada</b>",
	'addShownBookmarksToNewTour' : 'para uma <b>nova</b> rota',
	'showCaches' : 'Adicionar Geocaches vis&#237;veis:',
	'newVersionDialog' : 'Existe uma nova vers&#227;o de GCTour.\nDeseja actualizar? \n\n',
	'removeTourDialog' : "Deseja mesmo remover esta rota?",
	'logYourVisit' : "Registar a sua Visita",
	'removeFromList' : "Remover da lista",
	'emptyList' : 'A lista est&#225; vazia.',
	'notLogedIn' : 'Fa&#231;a login ...',
	'months' : ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
	'prinviewTitle' : 'http://gctour.madd.in',
	'pleaseWait' : 'Por favor aguarde - a carregar conte&#250;do ...',
	'newList' : 'Nova Rota',
	'sendToGps' : 'Enviar para o GPS',
	'makeMap' : 'Criar mapa',	
	'makeMapWait' : 'A testar disponibilidade deste mapa',
	'printview' : 'Modo de impress&#227;o',
	'downloadGpx' : 'Transferir GPX',
	'sendMessage' : "Encontrou um erro? Deseja sugerir algo para o GCTour? Desejamos ouvir a sua opini&#227;o.<br />Envie uma <b>mensagem</b>:",
	'sendMessageTitle' : "Enviar uma mensagem para o autor.",
	'sendMessageSubmit' : "Submeter a mensagem!",
	'showSettings' : 'Mostrar Configura&#231;&#245;es',	
	'settings_caption' : 'Configura&#231;&#245;es',
	'settingsPrintMinimal' : 'Modo de Impress&#227;o m&#237;nimo',
	'settingsLogCount' : 'N&#250;mero de logs no modo de impress&#227;o',
	'settingsLogCountNone' : 'nenhum<br />',
	'settingsLogCountAll' : 'tudo<br />',
	'settingsLogCountShow' : 'mostrar',
	'settingsEditDescription' : 'Descri&#231;&#227;o edit&#225;vel',
	'settingsRemoveImages' : 'remover imagem no clique',
	'settingsShowSpoiler' : 'Mostrar spoiler',
	'settingsAdditionalWaypoints' : 'Mostrar Waypoints Adicionais',
	'settingsLoggedVisits' : 'Mostrar contador de log',
	'settingsAttributes' : 'mostrar Atributos',
	'settingsDecryptHints' : 'Decifrar dicas',
	'settingsSendToGPS' : 'enviar para o GPS',
	'settingsShowGPX' : 'mostrar o ficheiro GPX',
	'settingsDownladGPX' : 'transferir GPX<br />',
	'settingsGPX' : 'Configura&#231;&#245;es do GPX',
	'settingsGPXHtml' : 'Descri&#231;&#227;o com HTML',
	'settingsUploadTour' : 'Enviar Rota',
	'settingsGPXStripGC' : 'Remover "GC" no GC-Code',
	'settingsGPXWpts' : 'Exportar waypoints adicionais',
	'settingsGPXSchema' : 'Vers&#227;o do GPX',
	'settingsGPXSchemaGS' : 'groundspeak',
	'settingsGPXSchemaAU' : 'geocaching.com.au',	
	'settings_map' : 'Mapa',
	'settings_map_geocacheid' : 'Mostrar id da Geocache',	
	'settings_map_geocacheindex' : 'Mostrar ind&#237;ce da Geocache',
	'settings_map_geocachename' : 'Mostrar nome da Geocache',
	'settings_map_awpts' : 'Mostrar Waypoints Adicionais',
	'settings_map_awpt_name' : 'Mostrar o nome dos Waypoints Adicionais',
	'settings_map_awpt_lookup' : 'Mostrar c&#243;digo dos Waypoints Adicionais',	
	'settings_map_owpts' : 'Mostrar os nossos waypoints',
	'settings_map_owpt_name' : 'Mostrar o nome dos nossos waypoints',
	'settings_map_gcde' : 'Mostrar o mapa de geocaching.de',	
	'loadTour' : 'Carregar Rota:<br />',
	'openTour' : 'Carregar uma Rota',
	'load' : 'Carregar',
	'removeTour' : 'Apagar esta Rota',	
	'deleteCoordinates' : 'Coordenadas para deletar',
	'copyTour' : 'Copiar Rota',
	'copy' : 'Copiar',
	'newTourDialog' : 'Introduza um nome para a nova rota ...',
	'rename' : 'Renomear',
	'upload' : 'Enviar rota',
	'onlineTour' : 'Transferir Rota',
	'webcodeDownloadHelp':'Por favor introduza aqui o c&#65533;digo que recebeu e clique em "Transferir Rota".',	
	'webcodeDownloadButton':'Transferir Rota',	
	'findMe' : 'Encontra-me!',
	'webcodeerror' : 'O C&#243;digo escolhido n&#227;o existe!',
	'tourUploaded1' : 'Rota enviada com sucesso!\nC&#243;digo:\n      ',
	'tourUploaded2' : '\nPode ver a rota em http://gctour.madd.in.\nImportante: Por favor anote o c&#243;digo para retirar a rota!!',	
	'settingsFontSize' : 'Tamanho da letra:',
	'settingsPageBreak' : 'Espa&#231;o na pagina depois da cache:',
	'settingsPageBreakAfterMap' : 'Espa&#231;o na p&#225;gina depois do mapa:',
	'webcodePrompt' : 'Transferir rota\nIntroduza um c&#243;digo v&#225;lido, para carregar a rota:',
	'webcodesuccess' : ' foi carregada!',
	'webcodeOld' : '\n    !!ATEN&#199;&#195;O!!\nEste c&#243;digo est&#225; conectado com uma rota antiga. Para obter todos os benef&#237;cios do GCTour 2.0, tem de enviar a rota novamente.',
	'printviewCache' : 'geocache',
	'printviewFound' : 'encontrada',
	'printviewNote' : 'nota',
	'printviewMarker' : "waypoint pr&#243;prio",
	'printviewAdditionalWaypoint' : "waypoints adicionais",
	'printviewRemoveMap' : "remover mapa",
	'printviewZoomMap' : "Abrir este mapa num novo separador.",
	'settingsFrontPage' : 'Primeira p&#225;gina:',
	'settingsOutlineMap' : 'Mapa com todas as caches:',
	'settingsOutlineMapSinge' : 'Mapa para todas as caches:',	
	'settingsDecryptHintsDesc' : 'As dicas v&#227;o estar decifradas no modo de impress&#227;o.',
	'settingsPrintMinimalDesc' : 'Cont&#233;m apenas a dica e o spoiler da geocache.',
	'settingsEditDescriptionDesc' : 'A descri&#231;&#227;o pode ser editada da forma como quiser.',
	'settingsShowSpoilerDesc' : 'Imagens de spoiler v&#227;o estar no modo de impress&#227;o.',
	'settingsAdditionalWaypointsDesc' : 'O modo de impress&#227;o vai conter uma tabela com todos os "Waypoints Adicionais" de uma geocache.',
	'settingsLoggedVisitsDesc' : 'Vai mostrar um resumo do "Contador de Visitas".',
	'settingsPageBreakDesc' : 'Depois de cada geocache vai existir uma espa&#231;amento. Vis&#237;vel depois da impress&#227;o.',
	'settingsPageBreakAfterMapDesc' : 'Vai existir um espa&#231;amento depois do resumo para separar as geocaches.',
	'settingsFrontPageDesc' : 'Um resumo vai ser gerado incluindo uma lista completa de todas as geocaches com um &#237;ndice e um espa&#231;o para colocar notas. ',
	'settingsOutlineMapDesc' : 'O resumo vai conter um mapa com todas as geocaches.',
	'settingsOutlineMapSingeDesc' : 'Depois de cada geocache est&#225; um mapa contendo a geocache e os seus "Waypoints Adicionais".',
	'settingsGPXSchemaDesc' : "<ul><li><b>Groundspeak:</b> &#233; uma reconstru&#231;&#227;o do ficheiro GPX original da Groundspeak com toda a informa&#231;&#227;o para os GPSr modernos.</li>\
	<li><li><b>Geocaching.com.au:</b> Implementa&#231;&#227;o do formato gratuito de geocaching.com.au. Infelizmente, alguns GPSr/programas tem problemas em usar este formato.</li></ul>\
	<b>Se est&#225; impossibilitado de mostrar alguma informa&#231;&#227;o no seu programa ou no GPSr, tenha a certeza que seleccionou \"Groundspeak\"\ e tente outra vez!</b>",
	'settingsGPXHtmlDesc' : 'Alguns programas/GPSr tem problemas em mostrar as geocaches se a descri&#231;&#227;o estiver no formato HTML. Se a descri&#231;&#227;o estiver confusa, desactive este op&#231;&#227;o.',
	'settingsGPXWptsDesc' : 'Os waypoints-adicionais v&#227;o ser exportados como waypoint extra no GPX. Ir&#225; ver cada lugar de estacionamento na sua unidade.',
	'settingsGPXStripGCDesc' : 'GPSr antigos tem problemas com os waypoints com nome maior que 8 caracteres. Use esta op&#231;&#227;o se tem uma unidade destas.',	
	'settings_map_geocacheidDesc' : 'O c&#243;digo GCCode (eg. GC0815) estar&#225; visivel no mapa.',
	'settings_map_geocacheindexDesc' : 'A posi&#231;&#227;o de cada waypoint estar&#225; vis&#237;vel na rota seleccionada.',
	'settings_map_geocachenameDesc' : 'O nome da geocache estar&#225; visivel.',
	'settings_map_awptsDesc' : 'Se seleccionada, os Waypoints-Adicionais v&#227;o estar vis&#237;veis.',
	'settings_map_awpt_nameDesc' : 'O nome dos Waypoints-Adicionais v&#227;o estar no mapa.',
	'settings_map_awpt_lookupDesc' : 'Os c&#243;digos dos Waypoints-Adicionais v&#227;o estar vis&#237;veis.',
	'settings_map_owptsDesc' : 'Se tem Waypoints seus na rota seleccionada e se esta op&#231;&#227;o estiver marcada, v&#227;o estar vis&#237;veis no mapa.',
	'settings_map_owpt_nameDesc' : 'Mostrar o nome dos seus Waypoints',
	'settings_map_gcdeDesc' : 'Se esta op&#231;&#227;o estiver marcada, ir&#225; ver no mapa do geocaching.de.',	
	'settingsMapType' : 'Tipo de Mapa padr&#227;o',
	'settingsMapSize' : 'Tamanho de Mapa padr&#227;o',
	'addOwnWaypoint' : 'Adicionar o seu Waypoint',
	"markerCoordinate" : "Coordenadas",
	"markerContent" : "Conte&#250;do",
	"markerType" : "Tipo",
	"mnarkerContentHint" : "estar&#225; visivel no modo de impress&#227;o",
	"markerCaption" : "captura",
	"autoTour" : "autoRota",
	"autoTourWait" : "Por favor aguarde - criando a autoRota!",
	"autoTourRadius" : "Raio",
	"autoTourCenter" : "Centro",
	"autoTourHelp" : "Coordenadas ou Endere&#231;o:<i>N51&#186; 12.123 E010&#186; 23.123</i> ou <i>40.597 -75.542</i> ou <i>Paris Eiffel Tower</i>",
	"autoTourRefresh" : "Criar autoRota com estes valores!",
	"autoTourCacheCounts" : "<i>N&#250;mero</i> estimado de caches na regi&#227;o:",
	"autoTourDuration" : "Previs&#227;o do tempo de cria&#231;&#227;o desta autoRota:",
	"kilometer" : "Quilometros",
	"mile" : "Milhas",
	"save" : "Guardar",
	"cancel" : "Cancelar",
	"close" : "Fechar",
	'install' : 'Instalar',
	"edit" : "editar",
	"example" : "ex. ",			
	"exampleCoords" : "<i>N51&#186; 12.123 E010&#186; 23.123</i> ou <i>40.597 -75.542</i>",	
	"dontPrintHint" : "<b>Informa&#231;&#227;o :</b><br />Elementos na caixa <u>n&#227;o</u> v&#227;o ser impressos!",
	'ERROR_DIALOG' : "<img src='http://img.groundspeak.com/forums/emoticons/signal/sad.gif'>&nbsp;&nbsp;Lamento mas ocorreu um erro:<br/>##ERROR##<br/> Por favor tente outra vez!<div align='center' style='border-bottom: 1px solid gray; padding: 5px; margin-bottom: 10px;'></div>Se este erro voltar a aparecer, por favor envie um relat&#243;rio.<br><div align='right'  class='dialogFooter' style='padding: 5px; margin-bottom: 10px;'><form action='"+GCTOUR_HOST+"/error' method='post'><input type='hidden' name='redir' value='##LOCATION##'><input type='hidden' name='user' value='##USERNAME##'><textarea name='report' style='display:none;' >##ERRORREPORT##</textarea><input onclick='return false;' type='button' value='close window' style='background-image:url("+closebuttonImage+")'><input type='submit' value='send error report'  style='background-image:url("+sendMessageImage+")'></form></div>",
    "ERROR_REPORT_SUBMIT" : "enviar relat&#243;rio",
    "SCRIPT_ERROR" : "Aparenta que est&#225; a bloquear algumas fontes de javascript (ex. NoScript). Por favor permita 'aolcdn.com' e 'geocaching.com' permanentemente para usar GCTour!" ,
	'mapTypes' : 
		[{"caption":"Google Map","value":"roadmap"}, 
		 {"caption":"Google Satellite","value":"satellite"}, 
		 {"caption":"Google Hybrid","value":"hybrid"}, 
		 {"caption":"Google Terrain","value":"terrain"}, 
		 {"caption":"Topo Germany","value":"oda"}, 
		 {"caption":"OSM Mapnik","value":"mapnik"}, 
		 {"caption":"OSM Osma","value":"osma"}, 
		 {"caption":"OSM Cycle","value":"osmaC"},
		 {"caption":"OSM Public Transport","value":"osmaP"}],
	'updateDialog' : "<div><img src='http://gctour.madd.in/images/antenna.gif' style='float:right'><p>Existe uma nova vers&#227;o de &nbsp;&nbsp;&nbsp;<a target='_blank' href='http://gctour.madd.in'><b>GCTour</b></a>&nbsp;&nbsp;&nbsp;dispon&#237;vel para instalar.</p><p>Tem a vers&#227;o <b>###VERSION_OLD###</b> instalada. A &#250;ltima versão &#233; <b>###VERSION_NEW###</b></p><p><b>Hist&#243;rico</b></p><div class='dialogHistory'>###VERSION_HISTORY###</div><div class='dialogFooter'></div>"
	};
languages = new Array();
languages[0] = lang_ger;
languages[1] = lang_eng;
languages[2] = lang_fre;
languages[3] = lang_dut;
languages[4] = lang_por;

function handleResize(event) {	
	//~ var win_height = window.innerHeight;
	var win_height = dojo.window.getBox().h;
	
	var container_height = win_height - 60;
	
	// set the max height of the container
	dojo.byId('gctourContainer').style.height = container_height+"px";
	
	// change the height of the tour header
	
	var tourheader_height;
	var list_height;
	if(currentTour.webcode){
		tourheader_height = 55;
		list_height = container_height - 128;
	} else {
		tourheader_height = 35;
		list_height = container_height - 108;		
	}
	
	//now handle the max height of the list and the header	
	dojo.byId('webcode').parentNode.style.height = tourheader_height+"px";
	dojo.byId('cacheList').parentNode.style.height = list_height+"px";
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
    var cacheList, i, table;

	// update the cache count	
	updateCacheCount(currentTour.geocaches.length);
	// update tourName
	dojo.byId("tourName").innerHTML = currentTour.name;
	
	// update webcode
	var webcodeSpan = dojo.byId("webcode");
	
	if(currentTour.webcode){
		webcodeSpan.innerHTML = "<br>Webcode:<b>"+currentTour.webcode+"</b></span>"
		webcodeSpan.style.display = "inline";
	} else {
		webcodeSpan.style.display = "none";
	}
	
	cacheList = document.getElementById('cacheList');	
	cacheList.innerHTML = "";
	// popultate the current list on load
	for (i = 0; i < currentTour.geocaches.length; i++){
		addNewTableCell(currentTour.geocaches[i],false);
	}

	table = dojo.byId('cacheList');	
	if(currentTour.geocaches.length == 0){
		table.innerHTML = lang['emptyList'];
	} 
	
	handleResize();
	
	
	
	var deleteButton = dojo.byId('gctourDeleteButton');
	if(tours.length == 1 && deleteButton){
		deleteButton.style.display = "none";
	} else {
		deleteButton.style.display = "inline"
	}
	
	
	// make the gectour menu sticky if it is set
/*	sticky = GM_getValue('sticky',false);
	if(sticky){
		dojo.byId('gctourContainer').style.left = "0px";
	} else {
		dojo.byId('gctourContainer').style.left = "-210px";
	}
	* 
	* 
	* TODO need more work - maybe in the next version
	*/
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
        var gpxForm, nameInput, contentArea, tourName, currentDate, currentDateString, dummyString;
		if(!userName){
			alert(lang['notLogedIn']);
		} else if( currentTour.geocaches.length == 0) {
			alert(lang['emptyList']);
		} else {	

			
			// add progressbar while loading
			addProgressbar();
			

			gpxForm = document.createElement('form');
			gpxForm.setAttribute('style','display:;');
			gpxForm.action = 'http://gc.madd.in/gm/download2.php';		
			gpxForm.id="gpxForm";

			gpxForm.method = 'post';
			
			nameInput = document.createElement('input');nameInput.type = 'hidden';gpxForm.appendChild(nameInput);
			nameInput.name = 'name';
			
			contentArea = document.createElement('textarea');gpxForm.appendChild(contentArea);
			contentArea.name = 'content';


			tourName = currentTour.name.replace(/\s+/g,"_").replace(/[^A-Za-z0-9_]*/g,"");

			currentDate =  new Date();
			currentDateString =  currentDate.getFullYear()+"-"+(currentDate.getMonth()+1)+"-"+currentDate.getDate()+"_"+currentDate.getHours()+"-"+currentDate.getMinutes()+"-"+currentDate.getSeconds();


			nameInput.value = 'GCTour.'+tourName+'.'+currentDateString+'.gpx';

			try {
				if (GM_getValue('gpxschema',0) == 0){
					dummyString = getGPX();	
				} else {
					dummyString = getGPXNew();
				} 

				//iff the cancel button is pressed the dummyString just contain canceled
				if(dummyString == "canceled"){
					closeOverlay();
					return;
				}

/* dont use this - it cause some serious errors!
				// pretty print the gpx
				// remove <?xml version="1.0" encoding="utf-8"?> to prevent error message from E4X
				dummyString = dummyString.replace(/^<\?xml\s+version\s*=\s*(["'])[^\1]+\1[^?]*\?>/, ""); 
				dummyString =  XML(dummyString).toXMLString();				
				// and add it again - to be sure!
				dummyString = '<?xml version="1.0" encoding="utf-8"?>\n'+dummyString;
				
*/
				

				contentArea.innerHTML = encodeURIComponent(dummyString);

				document.body.appendChild(gpxForm);
				document.getElementById('gpxForm').submit();
				document.body.removeChild(gpxForm);

				// all done - remove the overlay
				closeOverlay(); 


			} catch (e) {
				addErrorDialog({caption:"GPX error", _exception:e}); 
			}
		}
	}
}



function sendToGPS(){
    var dataStringElement, tourName, currentDate, currentDateString;
       
    // add the overlay while loading
	addProgressbar();  	 
	// fix width and height of the header
    dojo.query('div[id="dialogBody"] > h1')[0].style.width = "486px";
    dojo.query('div[id="dialogBody"] > h1')[0].style.height = "14px";
    
    
    // first time send to GPS is clicked: Accept the License
    var accept_input = document.getElementById('chkAccept');
    if(accept_input){
		accept_input.checked = "checked";    
		document.getElementById('btnSubmit').click();
		return;
	}
    
   
    
    
    // change ALWAYS to Garmin
	var garmin_tab = document.getElementById('uxGPSProviderTabsn2');
	if(garmin_tab.getElementsByTagName('table')[0].className != "Selected"){
		unsafeWindow.__doPostBack('uxGPSProviderTabs','2');
		return;
	}

	
	dojo.byId('uxGPSProviderTabs').innerHTML = "<tbody><tr><td>GCTOUR: GARMIN ONLY</td></tr></tbody>";
	dojo.destroy('premiumUpsellMessage');

	try{	
		dataStringElement = document.getElementById('dataString');
		dataStringElement.value = lang['pleaseWait'];
		if (GM_getValue('gpxschema',0) == 0){
			dataStringElement.value = getGPX();	
		} else {
			dataStringElement.value = getGPXNew();
		}

		tourName = currentTour.name.replace(/\s+/g,"_").replace(/[^A-Za-z0-9_]*/g,"");

		currentDate =  new Date();
		currentDateString =  currentDate.getFullYear()+"-"+(currentDate.getMonth()+1)+"-"+currentDate.getDate()+"_"+currentDate.getHours()+"-"+currentDate.getMinutes()+"-"+currentDate.getSeconds();


		dojo.byId('cacheID').value = 'GCTour.'+tourName+'.'+currentDateString+'.gpx';

		// all done - remove the overlay
		closeOverlay();
	}catch (e){
		addErrorDialog({caption:"Send to GPSr error", _exception:e}); 
	}

}

function makeMapFunction(){
	
	
	if(!userName){
			alert(lang['notLogedIn']);
	} else if( currentTour.geocaches.length == 0) {
		alert(lang['emptyList']);
	} else {
			
		// add the overlay while loading
		addProgressbar({caption:lang['makeMapWait']});  
		
		var markerQuery = [];
		
		for (cache_i = 0; cache_i < currentTour.geocaches.length; ++cache_i){
			var marker = currentTour.geocaches[cache_i];
			
			if(marker.id){
				markerQuery.push(marker.id);		
			} else if(marker.wptcode){
				markerQuery.push(marker.wptcode);
			} else{
				markerQuery =  [];
				break;
			}
		}
		alert(API_HOST+'/map/check/'+markerQuery.join(","));
		
		get(API_HOST+'/map/check/'+markerQuery.join(","),
			function(text){
				
				var result = JSON.parse(text);
				if(result.length < 1){ // map is completly available in appengine
					GM_openInTab(getMapUrl(markerQuery.join(","))+"#gui");
					closeOverlay();
				} else { 
					
					try{
						var geocaches = new Array();			
						var costumMarkers = new Array();
						
						for ( var i= 0; i < result.length; i++){
							var id = result[i];
							if(id.indexOf("GC") === 0){
								var mapCache = getMapGeocache(id);
								if(mapCache){
									geocaches.push(mapCache);
								}
							} else {
								costumMarkers.push(getMapMarker(id));
							}
							
							setProgress(i,result.length,document);
							
						}
						
						
						var cacheObject = {};
						cacheObject.geocaches = geocaches;
						cacheObject.costumMarkers = costumMarkers;
					
						uploadMap(cacheObject, makeMapFunction);				
					} catch(e){addErrorDialog({caption:"Make map error", _exception:e});}	
				}	
				
			}
		);
	}
}

function getMapGeocache(gcid){
	
	
	var geocache = getGeocache(gcid);
	if(geocache !== "pm only"){
		var mapCache = new Object();
		mapCache.gcid = geocache.gcid;
		mapCache.guid = geocache.guid;
		mapCache.image = geocache.image;
		mapCache.name = geocache.name;
		mapCache.difficulty = geocache.difficulty;
		mapCache.terrain = geocache.terrain;
		mapCache.latitude = geocache.lat;
		mapCache.longitude = geocache.lon;
		
		// save additional waypoints
		var additional_waypoints = geocache.additional_waypoints;
		for(waypoint_i = 0 ; waypoint_i < additional_waypoints.length; waypoint_i++){
			additional_waypoints[waypoint_i].note = "";
		}				
		
		mapCache.additional_waypoints = additional_waypoints;
		return mapCache;
	}	
	
}

function getMapMarker(markerId){
	var marker = currentTour.geocaches[getPositionsOfId(markerId)];
	marker.index = cache_i;
	
	return marker;
}



function uploadTourFunction(id){
	return function(){ 
	    var i, geocaches, cache_i, costumMarker, geocache, mapCache, waypoint_i, codeString,costumMarkers;
		try{
			if(!userName){
				alert(lang['notLogedIn']);
			} else if( currentTour.geocaches.length == 0) {
				alert(lang['emptyList']);
			} else {	
				
		
				for (i = 0; i < tours.length; i++){
					if(tours[i].id == id){
											
						// add the overlay while loading
						addProgressbar();
						if (GM_getValue('uploadMap',true)){ // TODO - upload Map noch gewünscht?
							//create the overview map
							geocaches = new Array();			
							costumMarkers = new Array();
							
							for (cache_i = 0; cache_i < tours[i].geocaches.length; ++cache_i){
								
								if(GM_getValue("stopTask",false) && cache_i != 0){
									GM_setValue("stopTask",false);
									closeOverlay();
									break;
								} else if (GM_getValue("stopTask",false) && cache_i == 0 ) {
									GM_setValue("stopTask",false);
								}
								costumMarker = (typeof(tours[i].geocaches[cache_i].latitude) != "undefined");
								if(!costumMarker){
								    mapCache = getMapGeocache(tours[i].geocaches[cache_i].id);
								    if(mapCache){
										geocaches.push(mapCache);
									}
								} else {
									var cm = tours[i].geocaches[cache_i];
									cm.index = cache_i;
									costumMarkers.push(cm);
								}
								
								setProgress(cache_i,tours[i].geocaches.length,document);
							}	
						}
						
						
						// create request
						var tourObject = currentTour;
						tourObject.geocaches = geocaches;
						tourObject.costumMarkers = costumMarkers;
						tourObject.password = currentTour.password;
						upload(tourObject);
					
						
						break;
					}
				}
			}
		} catch(e){addErrorDialog({caption:"Upload tour error", _exception:e});}	
	}
}


function uploadMap(markerObj,callback){
	
	var jsonMap = JSON.stringify(markerObj).replace(/&/g," and ");// IMPORTANT! prevents critical errors in webapplication 
	
	
	post(API_HOST+'/map/save', "map="+jsonMap,callback);
}


function upload(tour){
		if( !tour.password){ // vllt doch mit !tour.uuid || ????
			//~ var pw = prompt("passwort");  
			//~ if(!pw){ 
				//~ closeOverlay();
				//~ return;
			//~ }
			//~ tour.password = pw;
			tour.password = "not yet implemented";
			upload(tour);
		} else {
			
			// maybe there are more CHARS than only '&'!
			var jsonTour = JSON.stringify(tour).replace(/&/g," and ");// IMPORTANT! prevents critical errors in webapplication 			
			
			post(API_HOST+'/tour/save', "tour="+jsonTour,
				function(text){
					
					var tourServer = JSON.parse(text);
					// after an error you get this result, eg:
					// {"message":"wrong password","type":"error"}
					
					// only if the result is a message
					if(tourServer.message && tourServer.type == "error"){
							var pw = prompt("falsches Passwort - bitte richtiges eingeben");   // TODO !!! LANGUAGES!!
							
							//if pw is empty or dialog closed
							if(!pw){ 
								closeOverlay();
								return;
							}
							tour.password = pw;		
							upload(tour);
					} else if (tourServer.message && tourServer.type == "info"){
						alert(tourServer.message);
						closeOverlay();						
					} else {	 // result is a tour and could be saved  - all done
					
					
						// remaind to local id!!
						tourServer.id = tour.id;
						
						// and the password
						tourServer.password = tour.password;
						
						
						currentTour = tourServer;
						saveCurrentTour();
						
						checkOnlineConsistent(currentTour);
						
						
						updateTour();
						
						closeOverlay();
						
						
						var codeString = lang['tourUploaded1']+currentTour.webcode+lang['tourUploaded2'];
						alert(codeString);					
					}
						
				
					
				}
		    );
	    

		}
}

function openSend2GpsDialog(){
	if(!userName){
		alert(lang['notLogedIn']);
	} else if( currentTour.geocaches.length == 0) {
		alert(lang['emptyList']);
	} else {	
		var overlay= getOverlay({caption:"Send to GPS"});
		overlay.innerHTML = "<iframe src='http://www.geocaching.com/seek/sendtogps.aspx?guid=9d2b4990-7222-4b1c-8062-8b753af24ac5&tour=1' width='450px' height='350' scrolling='no' marginheight='0' marginwidth='0' frameborder='0'></iframe>";
	}
	
}

function openSettingsDialog(){
	var settings = new Settings();
	settings.show();
}


function sendMessageDialog(){
	 
	 if(!userName){
		alert(lang['notLogedIn']);
		return;
	}

	 
	 
	var overLay = getOverlay({caption:lang['sendMessageTitle'],minimized:true});
	
	
	overLay.innerHTML = '<form style="clear:both" method="POST" action="'+GCTOUR_HOST+'/contact"> \
	'+lang["sendMessage"]+'<br/> \
	<input type="hidden" name="redir" value='+window.location+'> \
	<input type="hidden" name="user" value='+userName+'> \
	<textarea rows="10" style="width:99%" name="message"></textarea> \
	<div class="dialogFooter"><input style="background-image:url('+sendMessageImage+')" type="submit" name="send" value="'+lang['sendMessageSubmit']+'"></input></div>\
	</form>';
	
	//<div class="dialogFooter"><input style="background-image:url('+sendMessageImage+')" "type="submit" name="send" value="'+lang['sendMessageSubmit']+'"></input>\
	
}


function populateTours(){
	var tourList = dojo.byId('dialogListContainer');
	tourList.innerHTML = "";
	
	var tourListUl = createElement('ul');	
	tourListUl.setAttribute("class", "dialogList");
	append(tourListUl,tourList);
	
	
	//construct tour list
	for (var tourIt = 0; tourIt<tours.length; tourIt++){
		var tour = tours[tourIt];
		var tourListLi = createElement('li',{id:"tour"+tour.id});append(tourListLi,tourListUl);
			
		
		
		var tourLink;
		// make the current Tour not clickable nor deletable!
		
		
		tourLink = createElement('a',{style:"cursor:pointer;font-size:10px;color:#003399"});
		tourLink.innerHTML = tour.name+"&nbsp;<small>("+tour.geocaches.length+")</small>";
		
		
		
		if(tour.id == currentTour.id){				
			//~ tourListLi.setAttribute("class", "activeTour");
			tourLink.innerHTML = "<b>"+tourLink.innerHTML+"</b>";
		} else {			
			//~ var deleteButton = document.createElement('img',{title:lang['removeTour'],src:""+deleteImageString,style:"cursor:pointer;margin-right:5px:float:right;"});
			
			
			var deleteButton = document.createElement('img');
			deleteButton.title = lang['removeTour'];
			deleteButton.src = deleteImageString;
			deleteButton.style.cursor = 'pointer';
			deleteButton.style.marginRight = '5px';
			deleteButton.style.cssFloat = 'right';
			
			deleteButton.addEventListener('click',deleteTourFunction(tours[tourIt].id), false);
			append(deleteButton,tourListLi);	
			
		}	
		
		if(tour.webcode){
			var webImage = createElement('img',{src:globeImage,style:"float:left;margin-right:3px;"});
			tourLink.appendChild(webImage);
		}	
		
		tourLink.addEventListener('click', showCacheList(tour),false);		
		append(tourLink,tourListLi);
			

			
			
	}	
}
	

function openTourDialog(){
	var overLay = getOverlay({caption:lang['openTour']});
	
	
	var tourList = createElement('div',{id:"dialogListContainer"});append(tourList,overLay);
	var cacheList = createElement('div',{id:"dialogDetails"});append(cacheList,overLay);
	
	populateTours();
	
	
	
	
	// load,close buttons
	var buttonsDiv = createElement('div',{style:"width:480px;position: absolute; bottom: 10px;"});append(buttonsDiv,overLay);
		buttonsDiv.setAttribute('class','dialogFooter');
	
	
	var closeButton = createElement('input',{type:"button",value:lang["cancel"],style:"background-image:url("+closebuttonImage+")"});append(closeButton,buttonsDiv);
		closeButton.addEventListener('click', closeOverlay, false);
		
		
	var loadButton = createElement('input',{type:"button",value:lang['load'],disabled:"",id:"loadButton",style:"background-image:url("+openTourImageString+")"});append(loadButton,buttonsDiv);
		loadButton.addEventListener('click', function(){
			var id = dojo.byId("dialogDetails").getAttribute("tourid");
			loadTour(id)();
			closeOverlay();
		}, false);
		
		
	
	// load currentTour
	showCacheList(currentTour)();
	
	loadButton.setAttribute("disabled","disabled");

}

function showCacheList(tour){
	return function(){
		var cacheList = document.getElementById('dialogDetails');
		cacheList.scrollTop=0;
		cacheList.setAttribute("tourid", tour.id);

		

		cacheList.innerHTML = "<u><b>"+tour.name+"</b>";
		if(tour.webcode){
			cacheList.innerHTML += "&nbsp;&nbsp;&nbsp;<i>Webcode:"+tour.webcode+"</i>";
		}
		cacheList.innerHTML += "</u><br/>";
		
		
				
		var copyButton = document.createElement('img');
		copyButton.title = lang['copyTour'];
		copyButton.src = copyImage;
		copyButton.style.cursor = 'pointer';
		copyButton.style.marginRight = '5px';
		copyButton.style.cssFloat = 'right';
		copyButton.addEventListener('click',function(){
			
			var newTour = eval(uneval(tour));
			newTour.id = getNewTourId();
			

			
			
			if(newTour.name.endsWith(lang_eng['copy']) || newTour.name.endsWith(lang_ger['copy'])){
			} else {
				newTour.name = newTour.name + " - "+lang['copy'];
			}
			
			
			tours.push(newTour);
			log("Creating copy tour: "+newTour.id +" ; "+ newTour.name);
			
			saveTour(newTour,true);
			
			populateTours();
			
			showCacheList(newTour)();
		},false);
		
				
		var deleteButton = document.createElement('img');
		deleteButton.title = lang['removeTour'];
		deleteButton.src = deleteImageString;
		deleteButton.style.cursor = 'pointer';
		deleteButton.style.marginRight = '5px';
		deleteButton.style.cssFloat = 'right';
		deleteButton.addEventListener('click',deleteTourFunction(tour.id), false);
		
		
		var renameButton = document.createElement('img');
		renameButton.src = editImageString;
		renameButton.title = lang['rename'];
		renameButton.alt = lang['rename'];
		renameButton.style.cursor = 'pointer';
		renameButton.style.marginRight = '5px';
		renameButton.style.cssFloat = 'right';
		renameButton.addEventListener('click', 
		function(){
			var newTourName = prompt(lang['newTourDialog'], tour.name);  
			if(!newTourName) return;
			tour.name = newTourName;
			saveTour(tour,true);
			populateTours();
			
			showCacheList(tour)();   				
			},false);
		
		
		
		
		
						
		if(tour.id != currentTour.id){	
			cacheList.insertBefore(deleteButton,cacheList.firstChild);
		}
	
		cacheList.insertBefore(renameButton,cacheList.firstChild);
		cacheList.insertBefore(copyButton,cacheList.firstChild);
		
		
			

		
		
		var cacheListUl = createElement('ul');
		cacheListUl.setAttribute("class", "dialogList");
		
		for (var cacheIt = 0; cacheIt<tour.geocaches.length; cacheIt++){
			var geocache = tour.geocaches[cacheIt];
			
			var cacheListLi = createElement('li',{style:"b"});append(cacheListLi,cacheListUl);
			cacheListLi.innerHTML = "<img src='"+geocache.image+"' style='margin-left=10px'> "+geocache.name+"&nbsp;<small>("+((geocache.id != undefined)?geocache.id:geocache.wptcode)+")</small>";
			
		
		}
		append(cacheListUl,cacheList);
		
		// make loadButton available
		
		
		var loadButton = document.getElementById('loadButton');
		loadButton.value = "'"+tour.name+"' "+lang['load'];
		loadButton.removeAttribute('disabled');
		
		
		
		// first remove all active tour css classes
		dojo.query("ul[class='dialogList'] > li").removeClass("activeTour");
		//and then set it to the clicked
		document.getElementById('tour'+tour.id).setAttribute("class", "activeTour");
	}
}


function downloadTourDialog(){
	var overlay= getOverlay({caption:lang["webcodeDownloadButton"],minimized:true});
	
	var divEbene = createElement('div');append(divEbene,overlay);

	divEbene.innerHTML = '<b>Webcode:</b>&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" id="webcodeInput"><br/>\
						'+lang['webcodeDownloadHelp'];
	
	
	
	divEbene = createElement('div');append(divEbene,overlay);
	divEbene.setAttribute('class','dialogFooter');
	
	var downloadButton = createElement('input',{type:"button",value:lang["webcodeDownloadButton"],style:"background-image:url("+downloadImageString+")"});append(downloadButton,divEbene);
	downloadButton.addEventListener('click',function(){
		var webcode = trim(dojo.byId('webcodeInput').value);
		if(webcode == "")
			return;
		downloadTourFunction(webcode);	
	},false);
	
}


function downloadTourFunction(webcode){
    var details;

	// add the overlay while loading
	addProgressbar();

	details = new Object();
	details.method = 'GET';
	//~ details.url = 'http://gctour.madd.in/query.php?crc='+trim(webcode);
	details.url = API_HOST+'/tour/'+trim(webcode)+'/json';
	details.onload = function(response) {
		var onlineTour;
		try{
			var responseObject = JSON.parse(response.responseText);
			
			if (responseObject.type == "error" && responseObject.message == "no tour"){
				alert(lang['webcodeerror']);
			
			} else if (responseObject.type == "oldtour"){
				onlineTour = eval(responseObject.message);
				onlineTour.id = getNewTourId();		
				tours.push(onlineTour);
				saveCurrentTour();

				log("Download of an old online tour successfull: "+onlineTour.id +" ; "+ onlineTour.name);
				
				alert("'"+onlineTour.name+"'"+lang['webcodesuccess'] +"\n"+ lang['webcodeOld']+"\n\n");

				loadTour(onlineTour.id)();

			} else {
				onlineTour = responseObject;
				onlineTour.id = getNewTourId();	
				
				tours.push(onlineTour);
				saveCurrentTour();
				
				alert("'"+onlineTour.name+"'\n"+lang['webcodesuccess']);
				
				loadTour(onlineTour.id)()
			}
			
			closeOverlay();
		} catch(e){
			addErrorDialog({caption:"Download tour error", _exception:e});
		}
	};
	GM_xmlhttpRequest(details);	
}


function showInformationDiv(tour){
	return function(){
	    var infomationDiv, i;
	
		infomationDiv = document.createElement('div');
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

		for(i = 0; i < tour.geocaches.length ; i++){
			if(i > 20){
				infomationDiv.innerHTML += "... (" +(tour.geocaches.length - i) +" more) ...";
				break;
			}
			infomationDiv.innerHTML +=  "<div style='border-bottom: 1px dotted  #448e35'> <img src='"+tour.geocaches[i].image+"' style='margin-left=10px'> "+tour.geocaches[i].name + "</div>";
		}
	};
}
/* use of the overlays

var options = {
	caption: "Test Beschriftung",
	color: 'red',
	_document: document,
	minimized: true,
	closeCallback : function(_document){alert('oioio');}		    
}


getOverlay(options);

*/


function getListOverlay(options){
	var overlay = getOverlay(options);
	var list = createElement('div',{id:"dialogListContainer"});append(list,overlay);
	
	var listUl = createElement('ul');	
	listUl.setAttribute("class", "dialogList");
	append(listUl,list);
	
	
	
	var details = createElement('div',{id:"dialogDetails"});append(details,overlay);
	
	var dialogFooter = createElement('div',{style:"width:480px;position: absolute; bottom: 10px;"});append(dialogFooter,overlay);
	dialogFooter.setAttribute('class','dialogFooter');
	
	var close = createElement('input',{type:"button",value:lang["close"],style:"background-image:url("+saveImage+")"});append(close,dialogFooter);
	close.addEventListener('click', closeOverlay, false);


	
	
	return new Array(listUl,details);
}
	

function getOverlay(options){
    var bodyNew, head, verLay, overlayMarker, title, closeDiv, closeButton,caption,theDocument,background_color;
    
    caption = options.caption;
	localDocument = (options._document)?options._document:document;
	background_color = (options.color)?options.color:"#B2D4F3";

	bodyNew = localDocument.getElementsByTagName('body')[0];	
	head = localDocument.getElementsByTagName('head')[0];    


	// first - close all old overlays
	closeOverlayRemote(localDocument)();
	

	overLay = localDocument.createElement('div');
	overLay.align = 'center';
	overLay.className = 'dialogMask';
	overLay.id = "dialogMask";
	

	var dialogBody = localDocument.createElement('div');
	dialogBody.id= "dialogBody";
	dialogBody.className= "dialogBody header";
	if(options.minimized){dialogBody.className += " dialogMin";}
	
	var dialogHead =  localDocument.createElement('h1');append(dialogHead,dialogBody);
	dialogHead.style.backgroundColor = background_color;
	

	var icon = "<img style='float:left;position:relative;top:-3px;' src='"+gctourLogoImage+"'>";
	dialogHead.innerHTML = icon+caption;

	var closeButton = createElement('img', {style:"cursor:pointer;"});append(closeButton, dialogHead);
	closeButton.style.cssFloat = "right";
	closeButton.src = closebuttonImage;
	
	var closeFunction = (options.closeCallback)?options.closeCallback: closeOverlayRemote;
	closeButton.addEventListener('click',closeFunction(localDocument), false);
		//addOpacityEffects(closeButton);
		
	var dialogContent = localDocument.createElement('div');append(dialogContent,dialogBody);
	dialogContent.className= "dialogContent";

	bodyNew.appendChild(overLay);
	bodyNew.appendChild(dialogBody);

	return dialogContent;
}

function closeOverlay(){
	closeOverlayRemote(document)();
}

function closeOverlayRemote(theDocument){	
	return function(){				
		removeNode("dialogMask",theDocument);
		removeNode("dialogBody",theDocument);
		removeNode("progressOverlay",theDocument);
	}
}

function removeNode(id,theDocument){
	try{
		var node = theDocument.getElementById(id);
		 dojo.destroy(node);
		
		//node.parentNode.removeChild(node);	
	} catch(e){} // prevent error if id doesn't exist
}

function addErrorDialog(options){
    var body, localDocument, overLayContent, overLayTitle, errorDiv, errorReport, buttons;

	localDocument = (options._document)?options._document:document;


	closeOverlay();
	options.minimized = true;
	options.color  = "#f00";
	
	
	var overlay = getOverlay(options);
	


	errorReport = "version: "+version+"\n";
	errorReport+= "build: "+build+"\n";
	errorReport+= "exception: "+options._exception+"\n";
	errorReport+= "last GCID: "+GM_getValue("debug_lastgcid","")+"\n";
	errorReport+= "error: "+options.caption+"\n";
	errorReport+= "username: "+userName+"\n";
	errorReport+= "useragent: "+unsafeWindow.navigator.userAgent+"\n";
	errorReport+= "gpxschema: "+GM_getValue('gpxschema',0)+"\n";
	errorReport+= "gpxhtml: "+GM_getValue('gpxhtml',true)+"\n";
	errorReport+= "tour:\n";
	errorReport+= uneval(currentTour)+"\n";
	errorReport+= "--------\n";
	errorReport+= GM_getValue('debug_lastcachesite',"");
	
	
	var error_dialog =lang["ERROR_DIALOG"].replace(/##ERROR##/, '<br><div style="border: 1px dashed red;padding:3px;width: 98%;">'+GM_getValue("debug_lastgcid","")+':<b>'+options._exception+'</b></div>');
	error_dialog = error_dialog.replace(/##LOCATION##/,window.location);
	error_dialog = error_dialog.replace(/##USERNAME##/,userName);	
	error_dialog = error_dialog.replace(/##ERRORREPORT##/,errorReport);
	
	
	errorDiv = document.createElement('div');
	errorDiv.style.padding = '5px';
	errorDiv.style.textAlign = 'left';	
	errorDiv.innerHTML = error_dialog;
	buttons = dojo.query('input',errorDiv);
	

	// if we are on the main page - close only the error dialog
	if(localDocument == document){
		buttons[buttons.length-2].addEventListener('click',closeOverlayRemote(localDocument),false);
	} else { // if we are on the printview - close the whole window
		//buttons[buttons.length-2].addEventListener('click',function(){theDocument.defaultView.close();},false);
		buttons[buttons.length-2].addEventListener('click',function(){localDocument.defaultView.close();},false);
	}

	overlay.appendChild(errorDiv);
	
}


function addProgressbar(options){
	var overlay;
	if(options){		
		var theDocument = (options._document)?options._document:document;
		var theCaption = (options.caption)?options.caption:lang['pleaseWait'];
				
		if(options.closeCallback){
			overlay = getOverlay({caption:theCaption,minimized:true,_document:theDocument,closeCallback:options.closeCallback});
		} else {
			overlay = getOverlay({caption:theCaption,minimized:true,_document:theDocument});
		}
		
		
	} else {
		overlay = getOverlay({caption:lang['pleaseWait'],minimized:true,_document:document});
	}
	
	
	
	
	var progressBarContainer = document.createElement('div');append(progressBarContainer,overlay);
	progressBarContainer.style.marginLeft = "135px";
	
	var progressBar = document.createElement('div');append(progressBar,progressBarContainer);
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

	var progressBarElement = document.createElement('div');append(progressBarElement,progressBarContainer);
	progressBarElement.id = 'progressbar';
	progressBarElement.style.opacity = '0.6';
	progressBarElement.style.width = '0px';
	progressBarElement.style.height = '13px';
	progressBarElement.style.fontSize = '10px';
	progressBarElement.style.backgroundColor = '#E78F08';
	progressBarElement.style.position = 'absolute';	
	progressBarElement.style.margin = '11px';
	progressBarElement.align = 'center';
	progressBarElement.style.setProperty("-moz-border-radius", "4px", "");
	
}

function setProgress(i,count,theDocument){
    var width, progresBar;

	width = ((208 * (i+1))/count);

	progressBar = dojo.query("div[id='progressbar']",theDocument)[0];
	progressBar.style.width = width+'px';
	progressBar.innerHTML = "<b>"+(i+1)+"/"+count+"</b>";
}
function showNewMarkerDialog(marker){
    var overlayMarker, dangerDanger, anTable, tr, td, nameInput, cordsInputLat, cordsInputLon, cordsInput,
        exampleCoords, staticGMap, staticGMapControl, zoomPlusButton, zoomMinusButton, contentTextarea,
        markerTypeTable, typeInput, trElement, i , tdElement, cancel, submit, errors, makerName, markerContent, 
        markerType, markerTypeSym, latitude, longitude,markerPosition, markerPositionDelta, entry, latArray,
        lonArray, latOrigin, lonOrigin;
 
	overlayMarker = getOverlay({caption:lang['printviewMarker'],minimized:true});

	dangerDanger = document.createElement('div');dangerDanger.id = "dangerdanger";
	dangerDanger.style.visibility = "hidden";
	dangerDanger.style.cssFloat = "right";
	dangerDanger.innerHTML = "<img src='"+dangerImageString+"'>";
	overlayMarker.appendChild(dangerDanger);

	anTable = document.createElement('table');overlayMarker.appendChild(anTable);
	anTable.style.width = '100%';
	anTable.style.clear = 'both';
	anTable.align = 'center';

    tr = document.createElement('tr');anTable.appendChild(tr);
	td = document.createElement('td');tr.appendChild(td);
	td.style.width = '20%';
	td.textContent = 'Name';

	td = document.createElement('td');tr.appendChild(td);
	nameInput = document.createElement('input');td.appendChild(nameInput);
	nameInput.type = 'text';
	nameInput.id = 'markerName';


	tr = document.createElement('tr');anTable.appendChild(tr);
	td = document.createElement('td');tr.appendChild(td);
	td.textContent = lang["markerCoordinate"];

	td = document.createElement('td');tr.appendChild(td);

	cordsInputLat = document.createElement('input');td.appendChild(cordsInputLat);
	cordsInputLat.type = "hidden";
	cordsInputLat.id = 'cordsInputLat';
	cordsInputLon = document.createElement('input');td.appendChild(cordsInputLon);
	cordsInputLon.type = "hidden";
	cordsInputLon.id = 'cordsInputLon';

	cordsInput = document.createElement('input');td.appendChild(cordsInput);
	cordsInput.type = 'text';
	cordsInput.id = 'markerCoords';
	cordsInput.style.width = '350px';
	cordsInput.style.marginRight = '5px';
	
	
	var wptcodeInput = document.createElement('input');td.appendChild(wptcodeInput);
	wptcodeInput.type = "hidden";
	wptcodeInput.id = 'wptcodeInput';

	



	exampleCoords = document.createElement('div');
	exampleCoords.innerHTML = 	lang["example"] + ' <i>N51° 12.123 E010° 23.123</i> or <i>51.123 10.123</i>'

	td.appendChild(exampleCoords);



	tr = document.createElement('tr');anTable.appendChild(tr);
	td = document.createElement('td');tr.appendChild(td);
	td = document.createElement('td');tr.appendChild(td);	
	td.align = 'left';



	staticGMap = document.createElement('div');
	
	
	var staticMap = new StaticMap(staticGMap,{});

	
	var checkMarkerCoord = function(input){
		return function(){
			var coords = parseCoordinates(input.value);
			
			if(coords == false){
				cordsInput.style.backgroundColor = "#FF8888";
			} else {
				cordsInput.style.backgroundColor = "#88DC3B";
				cordsInputLat.value = coords.latitude;
				cordsInputLon.value = coords.longitude;
				
				staticMap.setCoordinates(coords.latitude,coords.longitude);
				
			}
		}
	};
	
	
	cordsInput.addEventListener('keyup',checkMarkerCoord(cordsInput),false);
	cordsInput.addEventListener('paste',checkMarkerCoord(cordsInput),false);

	td.appendChild(staticGMap);

	tr = document.createElement('tr');anTable.appendChild(tr);
	td = document.createElement('td');tr.appendChild(td);
	td.innerHTML = lang["markerContent"]+'<br><div style="font-size:xx-small">('+lang["markerContentHint"]+')</div>';

	td = document.createElement('td');tr.appendChild(td);
	contentTextarea = document.createElement('textarea');td.appendChild(contentTextarea);
	contentTextarea.style.width = '350px';
	contentTextarea.id = 'markerContent';
	contentTextarea.rows = '5';



	// type buttons

	tr = document.createElement('tr');anTable.appendChild(tr);
	td = document.createElement('td');tr.appendChild(td);
	td.style.width = '20%';
	td.textContent = lang["markerType"];

	td = document.createElement('td');tr.appendChild(td);
	markerTypeTable = createElement('table',{style:"width:auto;"});td.appendChild(markerTypeTable);
	markerTypeTable.id = 'markerType';

	typeArray = new Array(
			new Array('http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/RedFlag.png','Red Flag'),
			new Array('http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/BlueFlag.png','Blue Flag'),
			new Array('http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/GreenFlag.png','Green Flag'),
			new Array('http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/Geocache.png','Geocache'),
			new Array('http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/GeocacheFound.png','Geocache Found'),
			new Array('http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/Information.png','Information'),
			new Array('http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/Park.png','Park'),
			new Array('http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/ParkingArea.png','Parking'),
			new Array('http://www.madd.in/geocaching/gm/gctourextension/map/icons/neu/SkullAndBones.png','Skull And Crossbones')
			);
	// iff we are editing a marker - so please set the right type
	typeInput = document.createElement('input');
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

	trElement = createElement('tr',{style:"height:27px;"});	markerTypeTable.appendChild(trElement);
	for(i = 0; i< 	typeArray.length ; i++ ){		
		tdElement = createElement('td',{style:"width:25px;"});		
		
		tdElement.style.background ="url("+typeArray[i][0]+") center center no-repeat";
		if(!marker){
			if (i == 0) tdElement.style.backgroundColor = '#B2D4F3';
			staticMap.setIcon(typeArray[0][0]);
		} else {
			if(typeArray[i][0] == marker.image){
				tdElement.style.backgroundColor = '#B2D4F3';
				staticMap.setIcon(marker.image);
			}
		}
		tdElement.style.cursor = 'pointer';
		tdElement.style.padding = '0px';
		tdElement.style.border = '1px solid silver';
		//~ tdElement.innerHTML = "<img src='"+typeArray[i][0]+"'>";
		tdElement.addEventListener('click', changeType(typeArray[i],markerTypeTable,typeArray,staticMap), false);

		trElement.appendChild(tdElement);
	}


	staticMap.hide();



	// in the end please add a save and cancel button	
	tr = document.createElement('tr');anTable.appendChild(tr);
	td = document.createElement('td');tr.appendChild(td);
	td.colSpan = '2';
	td.align = 'right';
	
	
	var buttonsDiv = createElement('div');append(buttonsDiv,overlayMarker);
	buttonsDiv.setAttribute('class','dialogFooter');
	
	
	cancel = createElement('input',{type:"button",value:lang["cancel"],style:"background-image:url("+closebuttonImage+")"});append(cancel,buttonsDiv);
	cancel.addEventListener('click', closeOverlay, false);


	submit = createElement('input',{type:"button",value:lang["save"],style:"background-image:url("+saveImage+")"});append(submit,buttonsDiv);
	

	submit.addEventListener('click', function(){	
			errors = 0;
			markerName = document.getElementById('markerName');
			if (markerName.value != "") {
			markerName.style.backgroundColor = "#FFFFFF";
			} else {
			markerName.style.backgroundColor = "#FF8888";
			errors++;
			}
			markerCoords = document.getElementById('markerCoords');

			if(markerCoords.style.backgroundColor != "rgb(136, 220, 59)"){
			markerCoords.style.backgroundColor = "#FF8888";
			errors++;
			}
			markerContent = document.getElementById('markerContent');

			markerType = document.getElementById('typeInput');
			markerTypeSym = document.getElementById('typeInputSym');
			if(errors != 0){
				document.getElementById('dangerdanger').style.visibility = "visible";
				return;
			} 

			latitude =  document.getElementById('cordsInputLat').value*1;
			longitude =  document.getElementById('cordsInputLon').value*1;
			if(marker){
				markerPosition = getPositionsOfId(marker.id);
				markerPositionDelta = markerPosition -  currentTour.geocaches.length +1;
				deleteElementFunction((marker.id)?marker.id:marker.wptcode)();
			} else {
				markerPositionDelta = 0;
			}
		
			var wptCode =  document.getElementById('wptcodeInput').value;

			entry = addCustomMarker(markerName.value, latitude, longitude, markerContent.value, markerType.value, markerTypeSym.value,wptCode);
			move(entry.id, markerPositionDelta);

			closeOverlay()

	}

	, false);



	// now set all previous values IFF a marker is given

	if(marker){
		nameInput.value = marker.name;
		cordsInputLat.value = marker.latitude;	// 51.123123
		cordsInputLon.value = marker.longitude;	// 123.12333
		wptcodeInput.value = marker.wptcode;	// 123.12333#12312412312


		latArray = Dec2DM(marker.latitude);
		lonArray = Dec2DM(marker.longitude);

		latOrigin = (latArray[0]<0)?"S":"N";
		lonOrigin = (lonArray[0]<0)?"W":"E";

		latArray[0] = (latArray[0]<0)?latArray[0]*(-1):latArray[0];
		lonArray[0] = (lonArray[0]<0)?lonArray[0]*(-1):lonArray[0];

		cordsInput.value = (Dec2DM_String(marker.latitude,marker.longitude));

		//~ cordsInput.value = latOrigin+""+latArray[0]+"° "+latArray[1]+" ";
		//~ cordsInput.value += lonOrigin+""+lonArray[0]+"° "+lonArray[1];
		cordsInput.style.backgroundColor = "#88DC3B";
		//~ updateMarkerOverviewMap(cordsInputLat.value ,cordsInputLon.value,13); // update map

		contentTextarea.innerHTML = marker.content;
		checkMarkerCoord(cordsInput)();
	}

	// set the focus to the maker name input
	nameInput.focus();
}

function zoomInMarkerOverviewMap(){
	return function(){
        var staticGMap, zoom, lat, lon;

		staticGMap = document.getElementById('staticGMap');
	    zoom = staticGMap.style.backgroundImage.split('&zoom=')[1].split('&')[0];
		lat = staticGMap.style.backgroundImage.split('&markers=')[1].split(',')[0];
		lon = staticGMap.style.backgroundImage.split('&markers=')[1].split(',')[1];
		updateMarkerOverviewMap(lat,lon,zoom-(-1));
	}
}

function zoomOutMarkerOverviewMap(){
	return function(){
	    var staticGMap, zoom, lat, lon;

		staticGMap = document.getElementById('staticGMap');
	    zoom = staticGMap.style.backgroundImage.split('&zoom=')[1].split('&')[0];
		lat = staticGMap.style.backgroundImage.split('&markers=')[1].split(',')[0];
		lon = staticGMap.style.backgroundImage.split('&markers=')[1].split(',')[1];
		updateMarkerOverviewMap(lat,lon,zoom-1);
	}
}


function updateMarkerOverviewMap(lat,lon,zoom){
	var minZoom = 0,
	    maxZoom = 19,
        apiKey = "ABQIAAAAKUykc2Tomn0DYkEZVrVaaRSNBTQkd3ybMgPO53QyT8hP9fzjBxSrEmDQGeGO-AZdQ4ogAvc8mRcV-g",
        staticGMap;
	// zoom out of range? please stop doing it ;-)
	if(zoom < minZoom || zoom > maxZoom)
		return;

	debug("Updating map in marker window: " +lat + " " + lon + " Zoom:"+zoom);

    staticGMap = document.getElementById('staticGMap');
    staticGMap.style.display = 'block'
	staticGMap.style.backgroundImage = 'url(http://maps.google.com/staticmap?sensor=false&size=350x200&zoom='+zoom+'&markers='+lat+','+lon+',midred&key='+apiKey+')';
}

function changeType(value,table,typeArray,staticMap){
	return function(){
	    var trElement, i, tdElement;
	
		document.getElementById('typeInput').value = value[0];
		document.getElementById('typeInputSym').value = value[1];
		
		staticMap.setIcon(value[0]);
		
		table.innerHTML = "";

		trElement = createElement('tr',{style:"height:27px"});	table.appendChild(trElement);
		for( i = 0; i< 	typeArray.length ; i++ ){
			tdElement = createElement('td',{style:"width:25px;"});
			tdElement.style.cursor = 'pointer';
			tdElement.style.padding = '0px';
			tdElement.style.border = '1px solid silver';
			tdElement.style.background ="url("+typeArray[i][0]+") center center no-repeat";
			if (typeArray[i][0] == value[0]){tdElement.style.backgroundColor = '#B2D4F3';}
			tdElement.addEventListener('click', changeType(typeArray[i],table,typeArray,staticMap), false);

			trElement.appendChild(tdElement);
		}
	}	
}

function saveMarkerCoord(cordsInput,cordsInputLat,cordsInputLon){
	return function(){
		var regex = new RegExp(/(N|S)(\s*)(\d{0,2})(\s*)°(\s*)(\d{0,2}[\.,]\d+)(\s*)(E|W)(\s*)(\d{0,3})(\s*)°(\s*)(\d{0,2}[\.,]\d+)/);
		var regex2 = new RegExp(/(-{0,1}\d{0,2}[\.,]\d+)(\s*)(-{0,1}\d{0,3}[\.,]\d+)/);
		window.setTimeout(
				function(){
				var result = regex.exec(cordsInput.value);
				var result2 = regex2.exec(cordsInput.value);

				log(result +" " +result2);
				if (!result && !result2) {
				cordsInput.style.backgroundColor = "#FF8888";

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
/* ----- DEBUG OUTPUT FUNCTIONS ------*/
function log(arguments) {
  if (DEBUG_MODE) {
  	GM_log("Log: " + arguments);
  }
}
function debug(arguments) {
  if (DEBUG_MODE) {
    GM_log("DEBUG: " + arguments);
  }
}


function warn(arguments) {
  if (DEBUG_MODE) {
    GM_log("Warning: " + arguments);
  }
}
function error(arguments) {
  if (DEBUG_MODE) {
    GM_log("Error: " + arguments);
  }
}
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


/* wrapper functions for persintence */
function saveValue(name, value){
	return uneval(GM_setValue(name,value));
}

function loadValue(name, defaultValue){
	return eval(GM_getValue(name, defaultValue));
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
		
		return {latitude:lat,longitude:lon};
		
	} else {
		var lat = parseFloat(result2[1]+""+result2[2]);
		var lon = parseFloat(result2[3]+""+result2[4]);
		
		return {latitude:lat,longitude:lon};
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
	
	
	var date_format_update = eval(GM_getValue('date_format_update'));
	
	var current_date = new Date();
	// get date format every 30 minutes
	if (force || !date_format_update || dojo.date.difference(date_format_update, current_date, "minute") > 30){
			//replace updatedate
			GM_setValue('date_format_update',uneval(current_date));

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

function openChangeCoordinates(){
    var overlayMarker, dangerDanger, anTable, tr, td, nameInput, cordsInputLat, cordsInputLon, cordsInput,
        exampleCoords, staticGMap, staticGMapControl, zoomPlusButton, zoomMinusButton, contentTextarea,
        markerTypeTable, typeInput, trElement, i , tdElement, cancel, submit, errors, makerName, markerContent, 
        markerType, markerTypeSym, latitude, longitude,markerPosition, markerPositionDelta, entry, latArray,
        lonArray, latOrigin, lonOrigin;
 
	overlayMarker = getOverlay({caption:lang['moveGeocache'],minimized:true});

	anTable = createElement('table',{style:"clear:both;"});overlayMarker.appendChild(anTable);
	anTable.style.width = '100%';
	anTable.align = 'center';
	
	tr = document.createElement('tr');anTable.appendChild(tr);
	td = document.createElement('td');tr.appendChild(td);
	td.colSpan = 2;
	td.innerHTML = lang.moveGeocacheHelp;
	

    tr = document.createElement('tr');anTable.appendChild(tr);
	td = document.createElement('td');tr.appendChild(td);
	td.style.width = '20%';
	td.textContent = lang['originalCoordinates'];


	var coordinates = dojo.byId('ctl00_ContentBody_LatLon').textContent;
	
	try{
		coordinates = coordinates.split("(")[1].split(")")[0];
	} catch(e){
		coordinates = coordinates;
	}
	
	var  mapTd = document.createElement('td');	
	mapTd.align = 'left';
	var coords = parseCoordinates(coordinates);
	
	var gc_type = dojo.query('a[href="/about/cache_types.aspx"] > img')[0].src.split("/")[5].split(".")[0];
	
	var staticMap = new StaticMap(mapTd,{lat:coords.latitude,lon:coords.longitude,geocache_type:gc_type});

	
	
	var cacheId = trim(document.getElementById('ctl00_ContentBody_uxWaypointName').textContent);
			
	
	td = document.createElement('td');tr.appendChild(td);
	nameInput = document.createElement('input');td.appendChild(nameInput);
	nameInput.type = 'text';
	nameInput.id = 'markerName';	
	nameInput.value = coordinates;
	nameInput.style.width = '350px';
	nameInput.style.marginRight = '5px';
	nameInput.disabled = 'disabled';


	tr = document.createElement('tr');anTable.appendChild(tr);
	td = document.createElement('td');tr.appendChild(td);
	td.textContent = lang['newCoordinates'];

	td = document.createElement('td');tr.appendChild(td);

	cordsInputLat = document.createElement('input');td.appendChild(cordsInputLat);
	cordsInputLat.type = "hidden";
	cordsInputLat.id = 'cordsInputLat';
	cordsInputLon = document.createElement('input');td.appendChild(cordsInputLon);
	cordsInputLon.type = "hidden";
	cordsInputLon.id = 'cordsInputLon';

	cordsInput = document.createElement('input');td.appendChild(cordsInput);
	cordsInput.type = 'text';
	cordsInput.id = 'markerCoords';
	cordsInput.style.width = '350px';
	cordsInput.style.marginRight = '5px';

	
	var checkMarkerCoord = function(input){
		return function(){
			var coords = parseCoordinates(input.value);
			
			if(coords == false){
				cordsInput.style.backgroundColor = "#FF8888";
			} else {
				cordsInput.style.backgroundColor = "#88DC3B";
				cordsInputLat.value = coords.latitude;
				cordsInputLon.value = coords.longitude;
				
				staticMap.setNewCoordinates(coords.latitude,coords.longitude);
				
			}
		}
	};

	
	
	cordsInput.addEventListener('keyup',checkMarkerCoord(cordsInput),false);
	cordsInput.addEventListener('paste',checkMarkerCoord(cordsInput),false);


	exampleCoords = document.createElement('div');
	exampleCoords.innerHTML = 	"<small>"+lang["example"]+" " + lang['exampleCoords'] + "</small>";

	td.appendChild(exampleCoords);
	
	tr = document.createElement('tr');anTable.appendChild(tr);
	td = document.createElement('td');tr.appendChild(td);
	tr.appendChild(mapTd);



	// in the end please add a save and cancel button	
	
	var buttonsDiv = createElement('div');append(buttonsDiv,overlayMarker);
	buttonsDiv.setAttribute('class','dialogFooter');
	
	
	cancel = createElement('input',{type:"button",value:lang["cancel"],style:"background-image:url("+closebuttonImage+")"});append(cancel,buttonsDiv);
	cancel.addEventListener('click', closeOverlay, false);
	
	
	var delete_btn = createElement('input',{type:"button",value:lang["deleteCoordinates"],style:"background-image:url("+closebuttonImage+")"});append(delete_btn,buttonsDiv);
	delete_btn.addEventListener('click', function(){
			GM_deleteValue('coords_'+cacheId);
			
			changeCoordinates();
			updateGUI();
			closeOverlay();


	}, false);


	submit = createElement('input',{type:"button",value:lang["save"],style:"background-image:url("+saveImage+")"});append(submit,buttonsDiv);
	submit.addEventListener('click', function(){	
			GM_setValue('coords_'+cacheId, cordsInputLat.value+'#'+cordsInputLon.value);
			changeCoordinates(Dec2DM_String(cordsInputLat.value,cordsInputLon.value));			
			closeOverlay();

	}

	, false);




	// now set all previous values IFF a marker is given

	if(GM_getValue('coords_'+cacheId,"null") != "null"){
		var coords_cacheId = GM_getValue('coords_'+cacheId);
		marker = [];
		marker.latitude = coords_cacheId.split('#')[0];
		marker.longitude = coords_cacheId.split('#')[1];
		
		
		cordsInputLat.value = marker.latitude;	// 51.123123
		cordsInputLon.value = marker.longitude;	// 123.12333


		latArray = Dec2DM(marker.latitude);
		lonArray = Dec2DM(marker.longitude);

		latOrigin = (latArray[0]<0)?"S":"N";
		lonOrigin = (lonArray[0]<0)?"W":"E";

		latArray[0] = (latArray[0]<0)?latArray[0]*(-1):latArray[0];
		lonArray[0] = (lonArray[0]<0)?lonArray[0]*(-1):lonArray[0];
		
		
		cordsInput.value = Dec2DM_String(marker.latitude,marker.longitude);

		//~ cordsInput.value = latOrigin+""+latArray[0]+"° "+latArray[1]+" ";
		//~ cordsInput.value += lonOrigin+""+lonArray[0]+"° "+lonArray[1];
		cordsInput.style.backgroundColor = "#88DC3B";

		staticMap.setNewCoordinates(cordsInputLat.value ,cordsInputLon.value);
		
		

	} else {
		cordsInput.value = coordinates;
		saveMarkerCoord(cordsInput,cordsInputLat,cordsInputLon)();
	}

}

function changeCoordinates(coordinates){
	
	var coordinates_ele = dojo.byId('ctl00_ContentBody_LatLon');
	try{
		var coordinates_org = coordinates_ele.textContent.split("(")[1].split(")")[0];
	} catch(e){
		var coordinates_org = coordinates_ele.textContent;
	}
	
	
	if(!coordinates){
		coordinates_ele.innerHTML = coordinates_org;
	} else {
		coordinates_ele.innerHTML = "<div style='font-weight:bold;'>"+coordinates+"&nbsp;&nbsp;-&nbsp;&nbsp;changed by GCTour <small><a style='cursor:pointer'>"+lang['makeMap']+"</a></small></div><small>("+coordinates_org+")</small>";
		var showLink = coordinates_ele.getElementsByTagName('a')[0];
		
		showLink.addEventListener('click', function(){
			var overlay = getOverlay({caption:lang['settings_map'],minimized:true});
			
			var originalCoordinates = parseCoordinates(coordinates_org);
			var newCoordinates = parseCoordinates(coordinates);
			
			var gc_type = dojo.query('a[href="/about/cache_types.aspx"] > img')[0].src.split("/")[5].split(".")[0];
			var staticMap = new StaticMap(overlay,{lat:originalCoordinates.latitude,lon:originalCoordinates.longitude,newLat:newCoordinates.latitude,newLon:newCoordinates.longitude,width:475,height:300,geocache_type:gc_type});
			
		}, false);			
	}
	
	
}

// static map object

function StaticMap(container,options){
	this._options = options;
	this._container = container;
	this._zoom = 13;
	this._minZoom = 0;
	this._maxZoom = 19;
	
	this.build();
	
	this.update();
}

StaticMap.prototype.zoomIn = function(thiz){
	return function(){
		thiz._zoom = thiz._zoom+1;
		thiz.update();
	}
}
StaticMap.prototype.zoomOut = function(thiz){
	return function(){
		thiz._zoom = thiz._zoom-1;
		thiz.update();
	}
}

StaticMap.prototype.hide = function(){
	this._staticGMap.style.display = "none";
}

StaticMap.prototype.show = function(){
	this._staticGMap.style.display = "block";
}

StaticMap.prototype.setNewCoordinates = function(lat,lon){
	this._options.newLat = lat;
	this._options.newLon = lon;
	
	this.update();
}

StaticMap.prototype.setCoordinates = function(lat,lon){
	this._options.lat = lat;
	this._options.lon = lon;
	
	this.update();
}

StaticMap.prototype.setIcon = function(icon){
	this._options.icon = icon;	
	this.update();
}

StaticMap.prototype.update = function(){
	if(this._zoom < this._minZoom || this._zoom > this._maxZoom)
		return;
	
	
	if(this._options.radius){
		
		
		var pathString = "";		
		// to draw a circle - add 24 edges und combine them
		for(var i = 1; i<=361;i = i+15){
			var waypoint = CalcPrjWP(this._options.lat,this._options.lon,this._options.radius,i);
			pathString += waypoint[0]+","+waypoint[1];

			if(i != 361)
				pathString += "|";

		}
		
				
		this._staticGMap.style.backgroundImage = 'url(http://maps.google.com/maps/api/staticmap?path=color:0xB2D4F3FF|weight:5|fillcolor:0xB2D4F366|'+pathString+'&size='+((this._options.width)?this._options.width:'350')+'x'+((this._options.height)?this._options.height:'200')+'&sensor=false';
			
		this.show();
		
	} else {
		var markerString = "markers=";		
		
		if(this._options.geocache_type){
			markerString += "icon:http://www.geocaching.com/images/wpttypes/pins/"+this._options.geocache_type+".png";
		} else if (this._options.icon){
			markerString += "icon:"+this._options.icon;
		} else {
			markerString += "color:blue";
		}
		markerString +=  "|"+this._options.lat+","+this._options.lon;
		
		
		if(this._options.newLat && this._options.newLon){
			markerString += "&markers=color:green|"+(this._options.newLat)+","+(this._options.newLon);
			markerString += "&center="+(this._options.newLat)+","+(this._options.newLon);
		}
		
		
		this._staticGMap.style.backgroundImage = 'url(http://maps.google.com/maps/api/staticmap?zoom='+this._zoom+'&size='+((this._options.width)?this._options.width:'350')+'x'+((this._options.height)?this._options.height:'200')+'&maptype=roadmap&'+markerString+'&sensor=false';
			
		this.show();
	}
}


StaticMap.prototype.build = function(){
	
	
	var staticGMap = document.createElement('div');
	staticGMap.style.display = "none";
	//~ staticGMap.id = 'staticGMap2';
	staticGMap.style.border = '2px solid gray';
	staticGMap.style.height = (this._options.height)?this._options.height+'px':'200px';
	staticGMap.style.width = (this._options.width)?this._options.width+'px':'350px';
	staticGMap.style.backgroundRepeat = 'no-repeat';
	this._staticGMap = staticGMap;
	
	if(!this._options.radius){  // just make marker maps zoomable
		var staticGMapControl = document.createElement('div');staticGMap.appendChild(staticGMapControl);
		staticGMapControl.style.padding = '3px 0px 0px 3px';
		staticGMapControl.style.width = '16px';
		staticGMapControl.style.cssFloat = 'left';

		var zoomPlusButton = document.createElement('img');
		zoomPlusButton.style.opacity = '0.75';	
		zoomPlusButton.style.cursor = 'pointer';	
		zoomPlusButton.src = "http://www.geocaching.com/images/zoom_in.png";
		zoomPlusButton.addEventListener('click', this.zoomIn(this), false);		
		staticGMapControl.appendChild(zoomPlusButton);

		var zoomMinusButton = document.createElement('img');
		zoomMinusButton.style.opacity = '0.75';	
		zoomMinusButton.style.cursor = 'pointer';	
		zoomMinusButton.src = "http://www.geocaching.com/images/zoom_out.png";
		zoomMinusButton.addEventListener('click', this.zoomOut(this), false);		
		staticGMapControl.appendChild(zoomMinusButton);
	}

	this._container.appendChild(staticGMap);

}

function gctourMapFunction(){
	// check if completly loaded
	if (unsafeWindow.isLoaded === false)
        return;

	
	unsafeWindow.clearCacheTable();

    //we need to iterate throught the marker collection and determine if the marker is in the current viewport.
    // we can do with this with a gbounds 
    var cnt = 0;
    var gb = unsafeWindow.map.getBounds();
    //var sbList = document.getElementById('sidebar-list');
    for (var i = 0, l = unsafeWindow.mrks.length; i < l; i++) {
        //don't bother if the marker is hidden.
        var cacheInfo = unsafeWindow.getMarker(i);
        if (gb.containsLatLng(cacheInfo.getLatLng())) {
            if (cacheInfo.isHidden() == false) {
                cnt++;
                unsafeWindow.addCacheTableRow(cacheInfo);
                extendCacheTableRow(cacheInfo);
            }
        }
    }
//    unsafeWindow.$('spanCacheCount').update(cnt);
	unsafeWindow.setMapLabelDisplay(dojo.byId('chkShowNumbers').checked);	
	
}

function extendCacheTableRow(info){
	
	var row = dojo.byId('ctRow'+info.mrkrIndex);
	var tds =  dojo.query('td',row);
	var lastTd = tds[2];
	
	
	var addToTourButton = document.createElement('img');
		addToTourButton.src = addToTourImageString;
		addToTourButton.style.cursor = 'pointer';
		addToTourButton.style.cssFloat = 'right';
		addToTourButton.addEventListener('click',addCacheToTourFromMap('http://www.geocaching.com/seek/cache_details.aspx?wp='+info.waypointId),false);											
		addToTourButton.title = lang['addToTour'];
		addHoverEffects(addToTourButton);
	
	lastTd.insertBefore(addToTourButton,lastTd.firstChild);
	
	//append(addToTourButton,lastTd);
}


function gctourBuildCDPage(id) {
    unsafeWindow.dlgStatusBar.status("Requesting Cache Description...");
    var b = { c: 2, m: '', d: '' + id + '' };
    //eo_Callback('cbAjax', Object.toJSON(b));

	unsafeWindow.jQuery.pageMethod("MapAction", JSON.stringify({ dto: { data: b, ut: unsafeWindow.userToken} }), function (r) {
		var r = JSON.parse(r.d);
		
		var jsonData = r; //.evalJSON();

		if (jsonData.cs.pm) { pm = jsonData.cs.pm; }
		if (jsonData.cs.li) { li = jsonData.cs.li; }
	
		unsafeWindow.dlgStatusBar.status("Parsing Cache Description...");
		var cdr_template = '<div id="gmCacheInfo"><div id="box"><div class="title"><img src="../images/WptTypes/sm/#{ci}.gif" align="absmiddle"/>&nbsp;<a href="#{curl}" target="_blank">' + ((jsonData.cs.ia == false) ? '<strike>' : '') + '#{cn}' + ((jsonData.cs.ia == false) ? '</strike>' : '') + '</a></div><div class="code">#{cgc}</div><div id="mapAddButton" style="float:right"></div><div class="createdby"><b>Created by:</b> <a href="#{cburl}" target="_blank">#{cb}</a></div><div class="left"><b>Difficulty:</b> #{d}</div><div class="right"><b>Terrain:</b> #{t}</div><div class="left"><b>Date Hidden:</b> #{dh}</div><div class="right"><b>Cache Size:</b> #{cz}</div></div>';
		
		if (jsonData.cs.tc > 1) {
				cdr_template += '<div style="clear:both;width: 350px;"><b style="float:left">Trackables:</b>'
				var tb_template = '<a style="float:left" href="../track/details.aspx?guid=#{tbg}" class="lnk" target="_blank"><img src="#{tbi}" alt="#{tbn}" title="#{tbn}" border="0" height="16" width="16" /></a>';
				for(var tb_i = 0; tb_i < jsonData.cs.tbs.length; tb_i++){
					cdr_template += evaluateTemplate(jsonData.cs.tbs[tb_i],tb_template);
				}				
				cdr_template +='</div>';
		}
				
		if (li === true) {
			cdr_template += '<div class="links"><a href="../bookmarks/mark.aspx?guid=#{cg}&WptTypeID=#{ci}" target="_blank" class="lnk"><img src="../images/silk/book_add.png" align="absmiddle" border="0"> <span>Bookmark It</span></a> | <a href="javascript:void(0);" onclick="send2gps(\'#{cg}\');return false;" class="lnk"><img src="../images/sendtogps/sendtogps_icon.png" align="absmiddle" border="0"> <span>Send to GPS</span></a> | <a href="../seek/log.aspx?guid=#{cg}" target="_blank" class="lnk"><img src="../images/silk/comment_add.png" align="absmiddle" border="0"> <span>Log Visit</span></a></div>';
		}
		
		var detailsHtml = dojo._toDom(evaluateTemplate(jsonData.cs,cdr_template));
	

	
		var addToTourLink = document.createElement('a');
		addToTourLink.style.cursor = 'pointer';
		addToTourLink.style.cssFloat = 'right';
		
		var addToTourButton = document.createElement('img');
		addToTourButton.src = addToTourImageString;
		addToTourButton.title = lang['addToTour'];
		append(addToTourButton,addToTourLink);
		
		addToTourLink.innerHTML = addToTourLink.innerHTML +"&nbsp;<span style='text-decoration:underline'>"+ lang['addToTour']+"</span>";
		addToTourLink.addEventListener('click', addElementFunction(jsonData.cs.cgc,jsonData.cs.cg,jsonData.cs.cn,jsonData.cs.ci+".gif"), false);
		append(addToTourLink,dojo.query("div[id='mapAddButton']",detailsHtml)[0]);
		
	
		unsafeWindow.mrker.openInfoWindowHtml(detailsHtml);
		unsafeWindow.dlgStatusBar.hide();
	

    });  
    

}

function evaluateTemplate(obj,template){
	for (i in obj) {
		template = template.replace(new RegExp("#{"+i+"}","g"),obj[i]);
	}
	
	return template;
}


// not USED!!!:
// hijack the parse method to mmanipulate the coordinates
function gctourParseCacheJSON(jsonData){
	setTimeout(function() {
		// move the marker on the map which have changed coordinates
		for (var i = 0, l = jsonData.cc.length; i < l; i++) {
			geocache = jsonData.cc[i];
			if(GM_getValue('coords_'+geocache.gc,"null") != "null"){ // only change coordinates from known marker
				var coordinates = GM_getValue('coords_'+geocache.gc,"null");
				geocache.lat = coordinates.split("#")[0];
				geocache.lon = coordinates.split("#")[1];	
				geocache.nn = geocache.nn + "(moved)";	
			}
		}
			
		return unsafeWindow.origParseCacheJSON(jsonData);
	},0);
}

// not USED!!!:
function gctourCreateMarker(geocache){

		/*
		if(GM_getValue('coords_'+geocache.waypointId,"null") != "null"){ // only change coordinates from known marker
					var coordinates = GM_getValue('coords_'+geocache.waypointId,"null");
					geocache.lat = coordinates.split("#")[0];
					geocache.lon = coordinates.split("#")[1];	
				}*/
				
		
		var marker = unsafeWindow.origCreateMarker(geocache);
		if (marker.waypointTitle.indexOf("(moved)") > 0){
			// not working :(
			marker.setImage(unsafeWindow.getIcon(geocache.wptTypeId, geocache.found, true, geocache.isAvailable));

		}
		
		
		//dumpProps(marker);
		
		return marker;
	
}

// init core variables
function initCore(){

	// setting up the language
	lang = languages[GM_getValue('language',1)];
	
	// getting all tours
	tours = loadValue('tours',new Array());
	
	//eval(GM_getValue('tours',new Array()));
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
	
	
	checkOnlineConsistent(currentTour);
}

function initDojo(){
	// just dont start the script on the gc.com print page!
	if(document.URL.search("cdpf\.aspx")<=0) {

		var requiredModules, script;

        // required modules - add dojo stuff here
		requiredModules = [];
		requiredModules.push("dojo.fx");
	    requiredModules.push("dojo.parser");
		requiredModules.push("dojo.dnd.Source");
		requiredModules.push("dojo.date.locale");
		requiredModules.push("dojo.number");
		requiredModules.push("dojo.window");

		 

		unsafeWindow.djConfig = {afterOnLoad: true, require: requiredModules,locale: 'en'};  		
		script = appendScript(dojoPath + "/dojo/dojo.xd.js");
		
		
		// check after 20sec if dojo is loaded - otherwhise asume user is blocking Javascript (possible false positve)
		window.setTimeout(function(){
			if(!dojo){
			   alert(lang["SCRIPT_ERROR"]);
			}
		},20000);
		
		// only way to check if the dojo script is loaded - addOnLoad fails because of unsafeWindow scope
		script.addEventListener('load', function(event){
			dojo = unsafeWindow.dojo;
			
			// if dojo is ready to go ( include all required modules ), init GCTour
			dojo.addOnLoad(function(){ 
			        setTimeout(function() { // hack to prevent "access violation" from Greasemonkey http://wiki.greasespot.net/0.7.20080121.0_compatibility
                        init();
                    },0);
                });		
		}, 'false');
	}
}

function init(){			
	
	
		// adding styles:
	   GM_addStyle(
	    '.dojoDndAvatar {font-size: 75%; color: black;min-width:130px;z-index: 100003 !important;width:180px}'+
	    '.dojoDndAvatar .controls{display:none;}'+
	    '.dojoDndAvatarHeader td	{padding-left: 20px; padding-right: 4px;}'+
	    '.dojoDndAvatarHeader	{background: #ccc;}'+ 
	    '.dojoDndAvatarItem		{background: #eee;}'+
	    '.dojoDndItemBefore		{border-top:3px solid gray !important; }'+
	    '.dojoDndItemAfter		{border-bottom:3px solid gray !important;}'+
	    '.dojoDndItemOver		{background-color:#edf1f8}'+
	    '.dojoDndMove .dojoDndAvatarHeader	{background-image: url(http://ajax.googleapis.com/ajax/libs/dojo/1.2.0/dojo/resources/images/dndNoMove.png); background-repeat: no-repeat;}'+
	    '.dojoDndCopy .dojoDndAvatarHeader	{background-image: url(http://ajax.googleapis.com/ajax/libs/dojo/1.2.0/dojo/resources/images/dndNoCopy.png); background-repeat: no-repeat;}'+
	    '.dojoDndMove .dojoDndAvatarCanDrop .dojoDndAvatarHeader	{background-image: url(http://ajax.googleapis.com/ajax/libs/dojo/1.2.0/dojo/resources/images/dndMove.png); background-repeat: no-repeat;}'+ 
	    '.dojoDndCopy .dojoDndAvatarCanDrop .dojoDndAvatarHeader	{background-image: url(http://ajax.googleapis.com/ajax/libs/dojo/1.2.0/dojo/resources/images/dndCopy.png); background-repeat: no-repeat;}'
	);
	
	
	// dialog styles
	GM_addStyle(
		'.dialogMask {background-image:url('+dialogMaskImage+');height:100%;left:0;opacity:0.7;position:fixed;top:0;width:100%;z-index:9000000;}'+
		'.dialogBody{-moz-border-radius:5px;background:none repeat scroll 0 0 #fff;border:1px solid #333333;color:#333333;cursor:default;font-family:Arial;font-size:12px;left:50%;margin-left:-250px;margin-top:20px;padding:0 0 1em;position:fixed;text-align:left;top:0;width:500px;z-index:9000010;max-height:85%;min-height:370px;overflow:auto;}'+
		'.dialogBody p {font-size:12px;font-weight:normal;margin:1em 0em;}'+
		'.header h1{background-color:#B2D4F3;background-repeat:repeat-x;font-size:110% !important;font-family:Helvetica Neue,Arial,Helvetica,sans-serif;margin-bottom:0.2em;margin-top:0;padding:0.5em;-moz-border-radius:5px 5px 0px 0px;color:#333333;background-image:url("'+tabBgImage+'")}'+
	//	'.dialogBody h1{background-color:#7A7A7A;border-bottom:1px solid #333333;font-size:110%;font-family:Helvetica Neue,Arial,Helvetica,sans-serif;margin-bottom:0.2em;padding:0.5em;-moz-border-radius:5px 5px 0px 0px;color:#fff;}'+
		'.dialogHistory {border:1px inset #999999;margin:0 1em 1em;padding-bottom: 1em;max-height: 200px;overflow-y:auto;width:448px;padding-left:1em;}'+
		'.dialogHistory ul{margin-left:2em;}'+
		'.dialogHistory li{list-style-type:circle;}'+
		'.dialogFooter input{-moz-border-radius:3px;background:none no-repeat scroll 4px center #EEEEEE;border:1px outset #666666;cursor:pointer;float:right;margin-left:0.5em;padding:3px 5px 5px 20px;min-width:100px;font-size: 12px;}'+
		'.dialogFooter input:hover { background-color:#f9f9f9; }'+
		'.dialogContent {padding:0px 10px 0px 10px;}'+
		'.dialogMin {min-height:0px !important}'
	);
	
	
	// opent tour dilaog styles:
	
	GM_addStyle(
		"#dialogDetails {height:294px;padding:3px;overflow:auto;background-color:#eff4f9;border:1px solid #C0CEE3; -moz-border-radius: 0px 5px 5px 0px;width:324px;position: absolute; right: 10px;}\
		 .dialogList li{font-size:10px;padding:3px;clear:both;list-style-type: none;}\
		 .dialogList {margin:0;padding:0}\
		 .activeTour {border: 1px solid #C0CEE3;-moz-border-radius: 5px 0px 0px 5px;background-color:#eff4f9;padding:1px;}\
		 #dialogListContainer {height:300px;overflow:auto;width:150px;position: absolute; left: 10px;} \
		"
	);



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
				'	min-height:44px;'+
				'	-moz-background-clip:border;'+
				'	-moz-background-inline-policy:continuous;'+
				'	-moz-background-origin:padding;'+
				'	border:1pt dashed gray;'+
			//	'	background:#FFFFFF none repeat scroll 0 0;'+
				'	color:#000000;'+
				'}'+
				''+
				'.cachelist {'+
					'	font-size:80%;'+
						//~ '	list-style-type:disc;'+
						'	padding:0;'+
						'}';
	head.appendChild(style); 	

	
	
	
	// first filter blacklist
    // process "add to your GCTour"-link from gctour.madd.in    
	if(document.URL.search("webcode")>=0) {
		document.title = "GcTour";
		document.getElementsByTagName('body')[0].innerHTML = "<div align='center'><a href='http://www.geocaching.com'><img border='0' src='http://madd.in/icon.png'/></a></div>";
		downloadTourFunction(document.URL.split("webcode/")[1]);

		return;
	}
	
		
	
	
	// start sepcial script on send-to-gps page
	if(document.URL.search("http://www.geocaching.com/seek/sendtogps.aspx")>=0) {
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
			sendToGPS();
		} 
		
		return;
	}
	
	





	// update the complete gui if the tab gets focus
	window.addEventListener("focus", updateTour,false);
	
	window.addEventListener("resize", handleResize,false);
	
	
	//~ window.onresize = function(event) {
    //~ ...
//~ }


	
    // process autoTour
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
			
			addProgressbar({caption:lang['autoTourWait']});
			
			
			var tq_caches = eval(GM_getValue('tq_caches', new Array()));
			var tq_typeFilter = eval(GM_getValue('tq_typeFilter'));
			var tq_sizeFilter = eval(GM_getValue('tq_sizeFilter'));
			var tq_dFilter = eval(GM_getValue('tq_dFilter'));
			var tq_tFilter = eval(GM_getValue('tq_tFilter'));
			var tq_specialFilter = eval(GM_getValue('tq_specialFilter'));


					

			var pagesSpan = dojo.query("td[class='PageBuilderWidget']> span")[0];

			if(!pagesSpan){
				alert("no caches here :-( pagesSpan missing");
				GM_deleteValue('tq_url');
				GM_deleteValue('tq_caches');
				document.location.href = GM_getValue('tq_StartUrl',"http://www.geocaching.com");
				return;
			}

			setProgress(parseFloat(pagesSpan.getElementsByTagName('b')[1].innerHTML)-1,parseFloat(pagesSpan.getElementsByTagName('b')[2].innerHTML),document);

            // locate the table
            
            var images_array = dojo.query("img[id *= 'uxDTCacheTypeImage']");
            
            
            // find all dtsize images and extract the temporary code
            var dtImageQuery = "";
            for(var i = 0; i < images_array.length;i++){
				dtImageQuery += images_array[i].getAttribute('src').split("=")[1];;
				dtImageQuery = (i!=images_array.length-1)?dtImageQuery+"-":dtImageQuery;
			}
			
			// use the geocaching OCR in the google cloud to find difficulty,terrain and size										
			GM_xmlhttpRequest({
				method: 'GET',
				url: 'http://geocaching-ocr.appspot.com/geocachingocr?il='+dtImageQuery,
				onload: function(responseDetails) {
						if(typeof JSON === "undefined"){
							var dtsize_details = eval("("+responseDetails.responseText+")");
						} else {
							var dtsize_details = JSON.parse(responseDetails.responseText);
						}
						
						
						var resultTable = dojo.query("table[class = 'SearchResultsTable Table'] > tbody > tr");
						var j = 0;
						for(var i = 0; i < resultTable.length-1;i++){ // iterate over each cache 
						
								var entryTds = resultTable[i+1].getElementsByTagName('td');
								var entry = new Object(); // gather informations line-by-line
							
							
								dojo.query('span',entryTds[5])[1].textContent.search(/\|\s*GC(\S{3,9})\s*\|/)
								entry.id = "GC"+RegExp.$1;
								entry.name = trim(dojo.query('span',entryTds[5])[0].textContent);
								entry.guid = entryTds[4].getElementsByTagName('a')[0].href.split('guid=')[1];
								entry.image = entryTds[4].getElementsByTagName('img')[0].getAttribute('src').replace(/wpttypes\//, "WptTypes/sm/");
								entry.available = entryTds[5].getElementsByTagName('a')[0].getAttribute('class') == 'lnk  ';
								
								
								var type = entry.image.split("/")[6].split(".")[0];
								type = (type == "earthcache")?137:type;
								
								var size = dtsize_details[i].size;
								
								
								var difficulty = dtsize_details[i].difficulty;
								var terrain = dtsize_details[i].terrain;
								var pm_only;
										

								

								// autoTour magic starts here 										
								// check whether the caches match against the given D/T values
								var addBool = tq_typeFilter[type] && tq_sizeFilter[size] && tq_dFilter[difficulty+""] && tq_tFilter[terrain+""];
								debug("##### 1: "+addBool);
								if(tq_specialFilter['is Active']){
									log("Check if "+entry.name+" is active:");
									log("available:"+entry.available);
									addBool = addBool && (entry.available);// only add if active!
								}
								debug("##### 2: "+addBool);
								if(tq_specialFilter['is not a PM cache']){
									pm_only = entryTds[6].innerHTML.indexOf('small_profile.gif') < 0;
									addBool = addBool && pm_only;
								}
									debug("##### 3: "+addBool);
								// autoTour parameter "haven't found" is not checked here because of URL parameter
								
								
								
								// Alle Geocaches die von madd.in gefunden wurden. Damit wir autoTour auch mit meinem Zweitaccount brauchbar ;-)
								var maddinGeocaches =["1T51H", "1QC72", "1KARH", "1RBBE", "1PEBN", "1FAYJ", "1ERQE", "1F093", "1EWH4", "1C068", "1R91D", "1PPZG", "1BXA7", "1PYPN", "1FEJD", "14PB1", "KARW", "1BX9N", "14743", "1NXG0", "1Q0NA", "1PN3W", "1PY8K", "1NWE0", "1D6KQ", "1NQAF", "YN3G", "MFTR", "1QH9J", "VT7D", "XBMV", "14FEY", "ZQ1V", "1Q0NW", "1QHKE", "1PDA5", "1Q59B", "1Q49G", "1JB9B", "1HBFF", "1G8VV", "1P4XG", "13481", "15GZT", "16H37", "1HBPR", "1Q5PP", "1ND1A", "ZVG5", "Y7VH", "MJ4W", "WJQ4", "ZQJX", "16FR7", "N8A1", "VAD4", "1NKEZ", "1NFFK", "1JQYH", "1ABRC", "1HH3Q", "1JZGF", "1KF0E", "1NDBF", "1MEYF", "1H76A", "1MG3M", "1NBF8", "1FNGG", "1JZB6", "156F9", "1HWPZ", "11J9Y", "N9EM", "17QZ6", "1EBQY", "YKV0", "15TH0", "H73R", "1MM0F", "19T6R", "1K40H", "1AXVX", "14TP0", "12AQP", "VEAJ", "VE84", "1K9V0", "1MY7K", "1N4JH", "1HGQJ", "1JNP2", "1GD3Z", "1MZVZ", "1KWJC", "1MY1P", "1M0X6", "VCF4", "1M9B8", "1KFC1", "1MMWC", "1KYY7", "1G24R", "1J3A8", "QVGP", "1JTTV", "1J9CA", "1FBWT", "K2HZ", "T47Y", "TAX8", "1J6EB", "1JBAD", "MG58", "19FVE", "16F7N", "1K5D3", "1EAD8", "1K1DD", "XDFK", "NA43", "1DBT8", "1DHNR", "1HH26", "KCHR", "1JKZY", "1JW04", "1J1NB", "1D1XY", "1D29W", "1H2R5", "18M3W", "175F8", "1HJ75", "192CY", "1G9BB", "12C2Z", "N2EN", "ZH3N", "19PKN", "1HE9P", "1FVM4", "18V3Q", "16YH5", "1H3FF", "14PCD", "YK51", "N5DM", "1E43W", "TYEQ", "1FAAK", "1FAAF", "1E7NC", "NXYZ", "18P9K", "17ZCN", "VD4E", "1G7QA", "15J88", "RBQQ", "QQJ4", "1EVRW", "1FFJC", "GNCW", "16PMP", "10ZXY", "15J2W", "15J2C", "139YE", "WDME", "1GCZK", "15CFG", "18P9D", "HX0H", "TJMM", "VNRV", "VEA0", "TRKC", "1F53F", "1BK3B", "159MQ", "1196K", "RHX3", "T5KW", "TN4A", "WZXA", "RWZW", "12Q9J", "124V4", "1GEMC", "1BGB2", "1BZ0K", "1GAB9", "1CFFQ", "VABH", "131GR", "1FYA3", "1CFG9", "18YF8", "18CJF", "16EB4", "Q139", "17VHA", "1A75J", "N0V3", "YK2K", "QYRJ", "10P4G", "127K5", "11Z8Q", "RCG5", "127GA", "127G6", "127G3", "127G0", "127FZ", "1DG6G", "1DF0X", "127GC", "127FQ", "127FF", "11V8A", "1CGR0", "1CGR4", "PH47", "1FJJ5", "1DZ3J", "WDKY", "174BB", "WDKP", "ZAGR", "WDK6", "N9VG", "10A44", "10A4B", "10CCH", "10A3X", "XDT0", "10A59", "XDRN", "X1JQ", "ZAGE", "XDRK", "X1JN", "XDR8", "X1JM", "X1JC", "XDR0", "1FGVX", "17QR6", "1DFZE", "1D0WW", "17T06", "17QR8", "1EACF", "15YA3", "1DKWQ", "15DEZ", "17PXH", "11YRW", "16F6Z", "WDKH", "12WMX", "QV1Y", "1BKQ4", "1DFE4", "1FFX8", "13A0N", "13F65", "1F9AW", "1CFFK", "12Y3V", "T61B", "1BZ1A", "13DV5", "1DG4E", "1DTV2", "1A7B3", "NDZ7", "V9CN", "1C6G6", "WDMD", "RY5V", "RB1Z", "1F9BF", "114WA", "11H5X", "198WY", "110E9", "10R03", "198WJ", "119AZ", "198XD", "19ERD", "11GKY", "1119C", "115BG", "117N1", "114XB", "10R0V", "10NRF", "138TN", "114JE", "11H45", "10QE3", "1BEA6", "138VM", "129Q4", "1AHPR", "1AHPA", "12ATD", "152KC", "P4XY", "TGWP", "15EAD", "1752N", "1BZAA", "P6D2", "136WW", "GM8H", "19BMX", "19BN3", "1AQ1A", "V3TN", "JA2E", "V5RZ", "1CWT3", "NCQY", "G6HQ", "14MBG", "XKBE", "MBFQ", "NK7D", "1C7FC", "QJ7J", "1A4PW", "1DRY7", "1C9VC", "J41M", "148VH", "14GD2", "1E8NM", "1F0JB", "YJ6M", "H8GZ", "144K5", "GHRQ", "V5PW", "1B0X6", "10V62", "1D5Q8", "168N5", "1A3X8", "YZTQ", "WDMC", "119VP", "QJHK", "1DCK5", "VDPM", "126G2", "T05X", "WDM9", "R9AH", "M80P", "1D6JZ", "1212Y", "QJHK", "1D8KX", "R4DE", "192DY", "10W9R", "1BAZ8", "ZR4C", "ZDPG", "11CQM", "16AVV", "YN3W", "11E5N", "QZFE", "R8ZN", "12Y7J", "YN56", "R9K2", "M44T", "GJY9", "192DV", "XK6Z", "QEA3", "15E9W", "15EA7", "1548J", "19RN7", "1CFG1", "16V5D", "15361", "14F38", "W1KT", "V5RD", "1C28J", "1AYXM", "1BGH9", "1BKM3", "TH0V", "1D5Q7", "1BRJQ", "H0DN", "J698", "18HKA", "1D48Y", "WBWM", "RQBQ", "W4G8", "19680", "ZDQK", "ZG48", "PHW4", "XZF5", "XZF8", "XZFC", "12WDT", "12VTN", "XZVB", "1CGR3", "1CGR1", "1CDV1", "1CDTQ", "150J6", "18AGZ", "19Q5V", "TKJ9", "VCVR", "11RBJ", "18VY2", "1BR9E", "191R9", "R18H", "19ED2", "14HQV", "1BAX9", "11MMP", "P5ZQ", "11RWF", "12B6H", "1598X", "1753H", "NFQ9", "NFQ4", "NGA0", "11YNV", "157VV", "10K61", "188J0", "WH9Y", "164A9", "MCH7", "M6KY", "T02D", "M6KX", "18QR8", "QXC3", "Q2VP", "185RY", "RB1V", "VAHD", "YVN2", "Z38V", "Z36X", "Z0GC", "Z0F7", "W6Y9", "ZRW9", "RXG9", "1BE4G", "R4HF", "NRGM", "13R1A", "1AWNW", "19PFG", "TGTX", "J7JT", "1B3DF", "1823H", "11E4K", "W5A2", "WPHE", "ZYF2", "1AHC2", "YHMJ", "N978", "131XN", "Y3W1", "YN8Y", "14KH4", "1593G", "17VHK", "17VH9", "ZHTP", "17VHE", "14WQJ", "1C01D", "17Q2X", "Y3TG", "Y3VN", "Y3VW", "PXJE", "131X0", "175YQ", "RB1T", "1AACB", "1AJVT", "QMYK", "QMYH", "14GT5", "QPG5", "14GTC", "14BJ5", "14CBR", "NXCA", "VPWF", "W546", "A9B5", "ZDN2", "NXDE", "18NJX", "19EAE", "193B9", "VK0B", "17MXT", "YK33", "16AY3", "14PCG", "13BMK", "15EK7", "175EV", "1A761", "VE2G", "WPNA", "15HF9", "16AW0", "XYHG", "10EBJ", "157XG", "1140G", "ZMWT", "15HEX", "17DP9", "ZMX1", "WHA2", "1264X", "14G1N", "17MXM", "WDMB", "N95X", "190R1", "142C8", "10Q97", "129Q2", "1A20K", "1A20R", "193FE", "12C3N", "12AZ2", "198XZ", "110ER", "11H64", "121GE", "10C4W", "11H4F", "11GMJ", "11XG9", "16D4Z", "121KT", "13C49", "VADH", "16CYR", "NCQZ", "13ZG7", "H28R", "NWHN", "NW4V", "RNDH", "MKV3", "195TN", "R179", "18DMK", "W98A", "X20D", "VWZQ", "NQVT", "1207T", "151M6", "XHJN", "113EJ", "110F7", "18V7G", "W0Q2"];
								
								for(var maddinI = 0; maddinI < maddinGeocaches.length; maddinI++){
									if("GC"+maddinGeocaches[maddinI] == entry.id){
										addBool = false;
										break;
									}
								}
								
								


								// if all parameters match - add the cache
								if(addBool){ 
									tq_caches.push(entry);
								}
								
								
								debug(entry.id+" "+entry.name);
								debug("\tvalue:"+type + " filter:" + tq_typeFilter[type]);
								debug("\tvalue:"+size + " filter:" + tq_sizeFilter[size]);
								debug("\tvalue:"+difficulty + " filter:" + tq_dFilter[difficulty+""]);
								debug("\tvalue:"+terrain + " filter:" + tq_tFilter[terrain+""]);
								debug("\tavailable:"+entry.available);
								debug("\tpm only:"+pm_only);								
								debug("\t ==> Add to tour: "+addBool);
								
								
								
						} // END for each cache
						
						GM_setValue('tq_caches',uneval(tq_caches));

						var gcComLinks = document.getElementsByTagName("a");
						var nextLink;
						for(var i = 0; i<gcComLinks.length;i++){
							if(gcComLinks[i].innerHTML == "<b>&gt;&gt;</b>"){
								nextLink = gcComLinks[i+1];
								break;
							}
						}

						// check if there are some caches on this page (next link is not there)
						if(!nextLink){
							alert("no caches here :-(");
							GM_deleteValue('tq_url');
							GM_deleteValue('tq_caches');
							document.location.href = GM_getValue('tq_StartUrl',"http://www.geocaching.com");
							return;
						}

						var action = nextLink.href.split("'")[1];
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
						
					} // end ONLOAD
			});
			return;
		} else {
			GM_deleteValue('tq_url');
			GM_deleteValue('tq_caches');
		}
	}
  




	// beta maps - map/beta/default.aspx
	if(document.URL.search("\/map\/beta\/default\.aspx")>=0) {
		
		//~ <div style="width:100px;margin-left:auto;margin-right:auto;background-color:#fff;padding:3px;-moz-border-radius:3px;border:2px solid #666"><img src=""></div>
		
		var autoTour_div = createElement('div',{
			style:'width: 100px; \
			margin-left: auto; \
			margin-right: auto; \
			border-radius: 5px; \
			background-color: #FFF; \
			border: 4px solid #999; \
			cursor: pointer;'
		});
		autoTour_div.className = "header";
		
		autoTour_div.innerHTML = "<h1><img src='"+mapToAutoTour+"'>";
		
		dojo.query("h1",autoTour_div).onmouseover(function(e){this.style.backgroundColor = "orange"}).onmouseout(function(e){this.style.backgroundColor = "#B2D4F3"}).onclick(function(e)
		{
			var googleMap = unsafeWindow.map;
			
			var bounds = googleMap.getBounds();
			var center = googleMap.getCenter();
			
			var radius = Math.floor(distanceBetween(center.lat(),center.lng(),bounds.getNorthEast().lat(),bounds.getNorthEast().lng() - (bounds.getNorthEast().lng() - bounds.getSouthWest().lng())/2)) / 1000;
			
			showAutoTourDialog(center,radius);
		});
			
		dojo.byId('maps-hd').appendChild(autoTour_div);

		
		var cacheDetailsTemplate = dojo.byId('cacheDetailsTemplate');
		cacheDetailsTemplate.innerHTML = cacheDetailsTemplate.innerHTML.replace(/<\/div>\s*{{else}}/g,'<br><a  class="lnk" href="javascript:add2tour();"><img src="'+addToTourImageString+'">&nbsp;<span>'+lang['addToTour']+'</span></a></div>{{else}}');	
		
		unsafeWindow.add2tour = function(){
			setTimeout(function() { 
				var gmCacheInfo = dojo.byId('gmCacheInfo');
				var links = dojo.query('a',gmCacheInfo);
				var images = dojo.query('img',gmCacheInfo);
				
				
				var gccode = dojo.query('div[class="code"]',gmCacheInfo)[0].textContent.trim();
				var name = links[0].textContent.trim();
				var cacheTypeImage = images[0].src.split('/')[6];
				var guid = links[links.length-2].href.split("guid=")[1];
				
				debug("beta maps add2tour: gccode:'"+gccode+"' name:'"+name+"' image:'"+cacheTypeImage+"' guid:'"+guid+"'");
				addElementFunction(gccode,guid,name,cacheTypeImage)();
			},0);
		};
		
		
	}

	// old maps
	var cacheListBody = document.getElementById('cacheListBody');
	if(cacheListBody){
		
		
		unsafeWindow.origUpdateSideBarList=unsafeWindow.updateSideBarList;
		unsafeWindow.updateSideBarList=gctourMapFunction;
		unsafeWindow.updateSideBarList();
		
		// also override the "build discription" function
		unsafeWindow.buildCDPage = gctourBuildCDPage;
		
		// and the parseCacheJSON function  - not used at the moment!
		//~ unsafeWindow.origParseCacheJSON = unsafeWindow.parseCacheJSON;
		//~ unsafeWindow.parseCacheJSON = gctourParseCacheJSON;
		//~ unsafeWindow.origCreateMarker = unsafeWindow.createMarker;
		//~ unsafeWindow.createMarker = gctourCreateMarker;
	}
	
	// add buttons to Bookmark site
	if(document.URL.search("\/bookmarks\/view\.aspx")>=0) {
		var bookmarkLines = dojo.query('tr[id*="row"]');
		
		for(var k = 0; k<bookmarkLines.length ; k++){
		    var bookmarkLine = dojo.query("td", bookmarkLines[k]);
            var entry = getEntryFromBookmarkTd(bookmarkLine);
            
			var addToTourButton = document.createElement('img');
			addToTourButton.alt = lang['addToTour'];
			addToTourButton.title = lang['addToTour'];
			addToTourButton.src = addToTourImageString;
			addToTourButton.style.cursor = 'pointer';
			addToTourButton.style.marginRight = '5px';

			addToTourButton.addEventListener('click', addElementFunction(entry.id,entry.guid,entry.name,entry.image), false);
			addHoverEffects(addToTourButton);
			bookmarkLine[4].appendChild(addToTourButton);   
		}
		
		
		
		
		
		// button to add all caches in list to current tour
		dojo.query('div[id="ctl00_ContentBody_ListInfo_uxAbuseReport"]')[0].innerHTML = lang['showCaches']
		
		var addBookmarkButton = createElement('button',{style:"margin:10px"});
		addBookmarkButton.setAttribute('onclick','return false;');
		addBookmarkButton.innerHTML ="<img src='"+addToTourImageString+"'/>&nbsp;"+lang['addShownBookmarks'];
		addBookmarkButton.addEventListener('click', function () {
					
		
					for(var k = 0; k<bookmarkLines.length ; k++){
						var bookmarkLine = dojo.query("td", bookmarkLines[k]);
						var entry = getEntryFromBookmarkTd(bookmarkLine);
			
						if(entry){
							addElementFunction(entry.id,entry.guid,entry.name,entry.image)();
							
						}
					};		
				},false);		
		dojo.query('div[id="ctl00_ContentBody_ListInfo_uxAbuseReport"]')[0].appendChild(addBookmarkButton);
		
		// button to add all caches in list to a new tour
		var newBookmarkButton = createElement('button',{style:"margin:10px"});
		newBookmarkButton.setAttribute('onclick','return false;');
		newBookmarkButton.innerHTML ="<img src='"+newImageString+"'/>&nbsp;+&nbsp;<img src='"+addToTourImageString+"'/>&nbsp;"+lang['addShownBookmarksToNewTour'];
		newBookmarkButton.addEventListener('click', function () {
					var listName = dojo.query('span[id="ctl00_ContentBody_lbHeading"]')[0].textContent;
					if(newTourFunction(listName)()){
						for(var k = 0; k<bookmarkLines.length ; k++){
							var bookmarkLine = dojo.query("td", bookmarkLines[k]);
							var entry = getEntryFromBookmarkTd(bookmarkLine);
				
							if(entry){
								addElementFunction(entry.id,entry.guid,entry.name,entry.image)();								
							}
						}
					}
				},false);		
		dojo.query('div[id="ctl00_ContentBody_ListInfo_uxAbuseReport"]')[0].appendChild(newBookmarkButton);	
		
		
		var newButton = document.createElement("input");
		newButton.name = 'addAll';
		newButton.type = 'submit';
		newButton.value = lang['addMarkedToTour'];
		newButton.id = 'addAll';	
		newButton.setAttribute('onclick','return false;');	
		newButton.style.cssFloat = 'right';

		// on click add checked caches in bookmark table
		newButton.addEventListener('click',  function(){
					for(var k = 0; k<bookmarkLines.length ; k++){
						var bookmarkLine = dojo.query("td", bookmarkLines[k]);
						var entry = getEntryFromBookmarkTd(bookmarkLine);
			
						if(entry){
							if(entry.checked){
							addElementFunction(entry.id,entry.guid,entry.name,entry.image)();
							}
						}
					};		
				}, false)
		//add the button to the website
		dojo.query('input[id="ctl00_ContentBody_ListInfo_btnDownload"]')[0].parentNode.appendChild(newButton);
	}


	// add the buttons to the search table
	//~ var searchResultTable = document.getElementById('ctl00_ContentBody_dlResults');
	//~ if(searchResultTable){		
	if(document.URL.search("\/seek\/nearest\.aspx")>=0) {	

		var entries = getEntriesFromSearchpage();
		
		for(var entry_i = 0; entry_i < entries.length; entry_i++){
			var entry = entries[entry_i];
			var addToTourButton = document.createElement('img');
			addToTourButton.alt = lang['addToTour'];
			addToTourButton.title = lang['addToTour'];
			addToTourButton.src = addToTourImageString;
			addToTourButton.style.cursor = 'pointer';
			addToTourButton.style.marginRight = '5px';


			addToTourButton.addEventListener('click', addElementFunction(entry.id,entry.guid,entry.name,entry.image), false);
		
			entry.position.appendChild(addToTourButton);
		}
		
		
		// add all checked to tour
		
		var newButton = document.createElement("input");
		newButton.type = 'submit';
		newButton.value = lang['addMarkedToTour'];
		newButton.setAttribute('onclick','return false;');	


		// on click add an element	
		newButton.addEventListener('click',  function(){
			var entries = getEntriesFromSearchpage();
		
			for(var entry_i = 0; entry_i < entries.length; entry_i++){
				var entry = entries[entry_i];
				if(entry.checked){
					addElementFunction(entry.id,entry.guid,entry.name,entry.image)();
				}
			}
		},false);
		var add_checked_tr = createElement('tr');
		var add_checked_td = createElement('td',{colspan:10});
		
		append(add_checked_td,add_checked_tr);
		append(newButton,add_checked_td);
		
		append(add_checked_tr,dojo.query('table[class = "SearchResultsTable Table"]')[0]);
		
		//~ 
		//~ var table = dojo.query('table[class = "SearchResultsTable Table"]')[0];
		//~ table.insertBefore(newButton,table.nextSibling);
	}	

	// dont display the list on the sendtogpx page
	if(document.URL.search("sendtogps\.aspx")<=0) {
		initComponents();

		// add the button to the details page
		if(document.URL.search("cache_details\.aspx")>=0) {
			initButton();
		}		

		//var loginLink = dojo.query('a[href="http://www.geocaching.com/my/"]')[0];
		
		//~ var loginLink = dojo.byId("ctl00_LoginUrl").previousSibling.previousSibling;
		//var loginLink = ("ctl00_LoginUrl").parentNode.getElementsByTagName('a')[0];
		
		
	
		var logInOutLink = dojo.byId('ctl00_hlSignOut') || dojo.byId('hlSignIn') || dojo.byId('uxLoginStatus_uxLoginURL') || dojo.byId('ctl00_ContentLogin_uxLoginStatus_uxLoginURL');// TODO - vllt ncoh mehr IDS? || dojo.byId('ctl00_ContentLogin_uxLoginStatus_uxLoginURL');
		var nameLink = logInOutLink.parentNode.getElementsByTagName('a')[0];

		// if logged in, Login_Name_Link will be the link to the username
		// if not logged in, Login_Name_Link will be the same as loginLogoutLink
		if (logInOutLink != nameLink) {
			userName = nameLink.textContent.trim();
		} 
			
	}


	// map to autotour button 
	var cacheListBounding = document.getElementById('cacheListBounding');
	if (cacheListBounding) {
		var autoTourDiv = createElement('div');
		autoTourDiv.align = 'center';
		autoTourDiv.style.padding = '10px';
		autoTourDiv.style.cursor = 'pointer';
		autoTourDiv.addEventListener('click',  function(e){
		
		        // get center of current viewport and pass it to autoTour
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
}
function initButton(){
	
	 // if we are on a cache page the buttonGroup != null - so add the 'to tour'-button

	var cacheControl = dojo.query("div[class='CacheInformationTable']")[0];
	if (cacheControl != null){
		
		
		var div_element = createElement('div',{style:"border-top: 1px solid rgb(192, 206, 227);"});append(div_element,cacheControl);

		
		
		var gcTourFieldset = createElement('fieldset',{style:"background-color: #EFF4F9;border-color: #C0CEE3 !important;margin-top:0;padding: 0.5em;"});append(gcTourFieldset,div_element);
		gcTourFieldset.setAttribute('class','dialogFooter');
		gcTourFieldset.innerHTML = "<legend class='note' style='background:url(\""+gctourLogoSmall+"\") no-repeat scroll 0 0 transparent'>GCTour</legend>";

		var newButton = createElement('input',{type:"button",value:lang["addToTour"],style:"float:left;background-image:url("+addToTourImageString+")"});append(newButton,gcTourFieldset);
		newButton.setAttribute('onclick','return false;');	
				
		//~ var newButton = document.createElement("button");
		//~ newButton.name = 'btnGPXDL';
		//~ newButton.type = 'submit';
		//~ newButton.innerHTML = "<img src='"+addToTourImageString+"'/>&nbsp;"+lang['addToTour'];
		//~ newButton.id = 'btnGPXDL';	
		
		
		// locate the values and save it
		var cacheIdCode = document.getElementById('ctl00_ContentBody_uxWaypointName');
		var cacheId = trim(cacheIdCode.textContent);
		
		// get the guid
		var guidId = dojo.query("a[id='ctl00_ContentBody_lnkPrintFriendly5Logs']")[0].href.split("guid=")[1].split("&")[0];
		
		var cacheName = trim(document.getElementById('ctl00_ContentBody_CacheName').textContent);

		var cacheTypeImage = getElementsByAttribute('title',"About Cache Types")[0].getElementsByTagName('img')[0].src.split("/")[5];
		
		// on click add an element	
		newButton.addEventListener('click', addElementFunction(cacheId,guidId,cacheName,cacheTypeImage), false);
		
		// add it to the group
		//~ append(newButton,add_button)
		//~ append(newButton,gcTourFieldset)

		// make direct print button 
		newButton = createElement('input',{type:"button",value:lang["directPrint"],style:"float:left;background-image:url("+printerImageString+")"});append(newButton,gcTourFieldset);
		newButton.setAttribute('onclick','return false;');	
		
		// on click add an element	
		newButton.addEventListener('click', function(){
				var entry = new Object();
				entry.id = cacheId;		
				entry.name = cacheName;
				entry.guid = guidId;
				entry.image = 'http://www.geocaching.com/images/WptTypes/sm/'+cacheTypeImage;


				temp_tour = new Object();
				temp_tour.name = entry.name;
				temp_tour.geocaches = new Array(entry);
				
				printPageFunction(temp_tour)();
			
		}, false);
		
		
		append(newButton,gcTourFieldset)
		
		
		// change coordinates
		newButton = createElement('input',{type:"button",value:lang['moveGeocache'],style:"float:left;background-image:url(http://www.geocaching.com/images/icons/coord_update.gif)"});append(newButton,gcTourFieldset);
		newButton.setAttribute('onclick','return false;');	
		newButton.addEventListener('click', openChangeCoordinates, false);				
		append(newButton,gcTourFieldset)
		
		
		
		// update the coordinates if it is already changed:
		
		if(GM_getValue('coords_'+cacheId,"null") != "null"){
			var coords_cacheId = GM_getValue('coords_'+cacheId);
			changeCoordinates(Dec2DM_String(coords_cacheId.split('#')[0], coords_cacheId.split('#')[1]));
			
		}		
	
	}	
}


// the tour list under main navigation
function initComponents(){
	//~ var thisDiv = getElementsByAttribute('class','widget-navigation')[0];
	
	var menuButton = createElement('div',{
		style:'height: 29px !important;\
		padding: 0 !important;\
		position: fixed !important;\
		top: 30px !important;\
		width: 35px !important;\
		background-color:#fff;\
		z-index: 100001 !important;\
		border: 1px solid #333333;border-width: 1px 1px 1px 0;border-radius:0 5px 5px 0;\
		-moz-user-select:none;'});
	menuButton.className = "header";
	
	menuButton.innerHTML = "<h1 style='height: 10px;border-radius: 0 5px 0 0;'><img src='"+gctourLogoSmall+"'></h1>";

	dojo.query("h1",menuButton)[0].id = "gctourButton";
	dojo.query("h1",menuButton).onmouseover(function(e){
		dojo.animateProperty(
		{
		node: "gctourContainer",
		duration: 250,
		properties: {
			left:   { start: "-210", end: "0" }
		 }
		}).play();
		
	});
	
	dojo.body().appendChild(menuButton);
	
	
	
	
	var thisDiv = createElement('div',{
		style:'background-color: #fff;\
		overflow: hidden;\
		left:-210px;\
		padding: 0 !important;\
		position: fixed !important;\
		top: 30px !important;\
		width: 200px !important;\
		z-index: 100002 !important;\
		border: 1px solid #333333;border-left:0px;border-radius:0 5px 5px 0;',
		id:"gctourContainer"});
		
	if(sticky){
		thisDiv.style.left = "0px";
	}
		
			//~ border-color: #C1CAA8 #C1CAA8 #C1CAA8 -moz-use-text-color;border-style: outset outset outset none;border-width: 1px 1px 1px medium;'});
	dojo.body().appendChild(thisDiv);


	dojo.query(thisDiv).onmouseenter(function(e){ clearTimeout(timeout);});
	dojo.query(thisDiv).onmouseleave(function(e){
		
		if(!sticky){
			timeout = setTimeout(function(){
				if(dojo.byId("gctourContainer").style.left == "0px"){
					dojo.animateProperty({
						node: "gctourContainer",
						duration: 1000,
						properties: { left:   { start: "0", end: "-210" } }
					}).play();
				}
			}, 1000);
		}
	});	


	var cacheList = document.createElement('ol');
    cacheList.className = 'cachelist container handles';
	cacheList.setAttribute("dojoType","dojo.dnd.Source");	
	cacheList.setAttribute("jsId","draglist");	

	cacheList.id = 'cacheList';
	cacheList.style.width = '100%';
	cacheList.setAttribute("border","0");




	var div = document.createElement('div');
	div.style.overflow = 'auto';	
	div.style.height = '80%';
	div.style.width = '100%'; 
	div.appendChild(cacheList);
	
    // make it drag n drop - only available after dojo.addOnLoad fired - see init.js
    dojo.parser.parse(div);
    
	dojo.subscribe("/dnd/start", function(){
		dojo.body().style.cursor = 'url("'+closedHand+'"), default';
	});

	dojo.subscribe("/dnd/cancel", function(){
		dojo.body().style.cursor = '';
	});		
		
    // persist the new order after some cache is draged
    dojo.subscribe("/dnd/drop", function(source, nodes, copy, target){
		    dojo.body().style.cursor = '';
            var cachelist = dojo.query('ol[id="cacheList"]')[0];
            
            // iterate over current cachelist in DOM
            var idList = [];        
            for(var i = 0; i < cachelist.childNodes.length;i++){
                idList.push(cachelist.childNodes[i].id); // save every id - in right order
                debug("ids: "+cachelist.childNodes[i].id);
            }
            
            var tempCaches = [];
            for(var i = 0; i < idList.length;i++){ // for each id
                var position = getPositionsOfId(idList[i]); // find the position in the currentTour obj
                tempCaches.push(currentTour.geocaches[position]); // after this add the cache in the temporary array
                
                debug("position: "+position);
                debug("gcid: "+currentTour.geocaches[position].id);
                
                
            }        
            
            // ... and make it persistent
            currentTour.geocaches = tempCaches;	
            
            setTimeout(function() { // hack to prevent "access violation" from Greasemonkey
                saveCurrentTour();
            },0);
    
            // highlight the moved cache
	        dojo.fadeOut({
	        node: nodes[0],duration: 300,
		        onEnd: function(){
			        dojo.fadeIn({
					        node: nodes[0],duration: 300
			        }).play()
		        }
	        }).play();
    });





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
	downloadButton.addEventListener('click', downloadTourDialog, false);
	//~ downloadButton.addEventListener('click', 
			//~ function(){
				//~ var webcode = window.prompt(lang['webcodePrompt']);
				//~ if(webcode && trim(webcode) != ""){
					//~ downloadTourFunction(webcode);
				//~ } 
			//~ },false);
	addHoverEffects(downloadButton);  


	var toggleSettingsButton = document.createElement('img');
	toggleSettingsButton.alt = lang['showSettings'];
	toggleSettingsButton.title = lang['showSettings'];
	toggleSettingsButton.src = settingsImageString;
	toggleSettingsButton.style.cursor = 'pointer';
	toggleSettingsButton.style.marginRight = '5px';
	toggleSettingsButton.addEventListener('click', openSettingsDialog, false);
	addHoverEffects(toggleSettingsButton);
	

	var toggleTourListButton = document.createElement('img');
	toggleTourListButton.alt = lang['openTour'];
	toggleTourListButton.title = lang['openTour'];
	toggleTourListButton.src = openTourImageString;
	toggleTourListButton.style.cursor = 'pointer';
	toggleTourListButton.style.marginRight = '5px';
	toggleTourListButton.addEventListener('click', openTourDialog, false);
	addHoverEffects(toggleTourListButton);
	
	var sendMessageButton = document.createElement('img');
	sendMessageButton.alt = lang['sendMessageTitle'];
	sendMessageButton.title = lang['sendMessageTitle'];
	sendMessageButton.src = sendMessageImage;
	sendMessageButton.style.cursor = 'pointer';
	sendMessageButton.style.marginRight = '5px';
	sendMessageButton.addEventListener('click', sendMessageDialog, false);
	addHoverEffects(sendMessageButton);

	var autoTourButton = document.createElement('img');
	autoTourButton.alt = lang["autoTour"];
	autoTourButton.title = lang["autoTour"];
	autoTourButton.src = autoTourImage;
	autoTourButton.style.cursor = 'pointer';
	autoTourButton.style.marginRight = '5px';
	autoTourButton.addEventListener('click', showAutoTourDialog, false);
	addHoverEffects(autoTourButton);

	// if the webcode is visable - the menu must be 20px higher
	var tourHeaderDiv = createElement('div');
	tourHeaderDiv.style.height = ((currentTour.webcode)?55:35)+"px";

	tourHeaderDiv.innerHTML = '<img id="inconsistentTour" src="'+dangerImageString+'" style="float:right;padding:3px;display:none"/><u id="tourName">'+currentTour.name +'</u>&nbsp;<span style="font-size:66%" id="cachecount">('+currentTour.geocaches.length+')';
	tourHeaderDiv.innerHTML+="<span id='webcode'><br>Webcode:<b>"+currentTour.webcode+"</b>&nbsp;</span>"
	// show the webcode if it is available
	if(!currentTour.webcode){
		dojo.query("span[id='webcode']",tourHeaderDiv)[0].style.display = 'none';
	}
	
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

			var deleteButton = document.createElement('img');
			deleteButton.id = "gctourDeleteButton";
			deleteButton.src = deleteImageString;
			deleteButton.alt = lang['removeTour'];
			deleteButton.title = lang['removeTour'];	
			deleteButton.style.cursor = 'pointer';
			deleteButton.style.marginRight = '3px';
			deleteButton.style.display = (tours.length == 1)?'none':'inline';
			
			deleteButton.addEventListener('click', deleteCurrentTour, false);
			addOpacityEffects(deleteButton);
			
			
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
			//sendGPSButton.addEventListener('click', openSend2GpsFunctionLocal(), false);
			sendGPSButton.addEventListener('click', openSend2GpsDialog, false);
			addOpacityEffects(sendGPSButton);
			
			var makeMapButton = document.createElement('img');
			makeMapButton.alt = lang['makeMap'];
			makeMapButton.title = lang['makeMap'];
			makeMapButton.src = mapImageString;
			makeMapButton.style.cursor = 'pointer';
			makeMapButton.style.marginRight = '5px';
			//sendGPSButton.addEventListener('click', openSend2GpsFunctionLocal(), false);
			makeMapButton.addEventListener('click', makeMapFunction, false);
			addOpacityEffects(makeMapButton);

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
			requestPrintButton.addEventListener('click', function(){printPageFunction(currentTour)();}, false);
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
			append(makeMapButton,tourHeaderDiv);
			append(uploadTourButton,tourHeaderDiv);
			append(markerButton,tourHeaderDiv);
			
			append(deleteButton,tourHeaderDiv);
			
	
			var buttonsDiv = createElement('div',{style:"height:20px;-moz-user-select:none;'"});

			buttonsDiv.appendChild(newButton);
			buttonsDiv.appendChild(toggleTourListButton);
			buttonsDiv.appendChild(downloadButton);
			buttonsDiv.appendChild(autoTourButton);
			buttonsDiv.appendChild(toggleSettingsButton);
			buttonsDiv.appendChild(sendMessageButton);


			var header = createElement('div',{style:"height:40px;cursor:pointer;-moz-user-select:none;'"});
			header.className= "header";
			
			header.innerHTML = "<h1><img src='"+gctourLogoImage+"'/><img style='float:right' src='"+pin_image+"'></h1";
			
			if(sticky){
				dojo.query("h1",header)[0].style.backgroundColor = "orange";
				dojo.query("img",header)[1].src = pinned_image;
			}
			
			//~ header.style.backgroundImage = "url("+gctourLogoImage+")";
			//~ header.style.backgroundPosition = "center left";
			//~ header.style.backgroundRepeat = "no-repeat";
			//~ header.style.cursor = "pointer";
			//~ header.style.height = "30px";
						
			dojo.query("h1",header).onmouseover(function(e){this.style.backgroundColor = "orange"}).onmouseout(function(e){this.style.backgroundColor = (sticky)?"orange":"#B2D4F3"}).onclick(function(e){sticky = !sticky;GM_setValue('sticky',sticky);dojo.query("img",header)[1].src = (sticky)?pinned_image:pin_image;});
			
			var footerDiv = createElement('div',{style:"font-size: 70%;height:13px;"});
			footerDiv.innerHTML = "<div style='float:left;margin-left: 5px;'><a href='http://gctour.madd.in'>http://gctour.madd.in</a></div><div style='float:right;margin-right: 5px;'>v"+ version + "." + build + "</div>";
			
			
			


	
			append(header, thisDiv);
			append(buttonsDiv, thisDiv);			
			append(tourHeaderDiv, thisDiv);
			append(div, thisDiv);
			append(footerDiv, thisDiv);
	
	




			// popultate the current list on load
			for (var i = 0; i < currentTour.geocaches.length; i++){
				addNewTableCell(currentTour.geocaches[i],false);
			}

			if(currentTour.geocaches.length == 0){
				var table = document.getElementById('cacheList');		
				table.innerHTML = lang['emptyList'];
			}
			
			
			//finally: set new heights and layout!
			handleResize();
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
		var cacheId = trim(dojo.query('span[id="ctl00_ContentBody_uxWaypointName"]',cacheDetails)[0].textContent);
		var guidId = dojo.query("a[id='ctl00_ContentBody_lnkPrintFriendly']",cacheDetails)[0].href.split("guid=")[1];
	
		var cacheName = trim(dojo.query('span[id="ctl00_ContentBody_CacheName"]',cacheDetails)[0].textContent);
		var cacheTypeImage = dojo.query('a[href="/about/cache_types.aspx"] > img',cacheDetails)[0].src.split("/")[5];

		addElementFunction(cacheId,guidId,cacheName,cacheTypeImage)();

	}
}

function getEntryFromBookmarkTd(bookmarkLine){
    var entry = {};
    entry.id = trim(bookmarkLine[2].textContent);
	
	var nameSpan = dojo.query("span",bookmarkLine[3])[0];
	var name = (nameSpan)?nameSpan.parentNode.innerHTML.replace(/<img.*?>/,""):trim(bookmarkLine[3].textContent);
	
    entry.name = name;
    entry.guid = bookmarkLine[2].getElementsByTagName('a')[0].href.split('guid=')[1];
    entry.image = bookmarkLine[3].getElementsByTagName('img')[0].getAttribute('src').split("/")[6];
    entry.checked = bookmarkLine[0].childNodes[0].checked;
            
    return entry;
}
function getEntryFromSearchTr(cache_row){
	var information_cell = dojo.query("td:nth-child(6)",cache_row)[0];
	var type_cell = dojo.query("td:nth-child(5)",cache_row)[0];
	var spans = dojo.query('span',information_cell);
	
	var entry = {};
	//~ alert(spans[1].textContent.search(/|\s*GC(\S{3,9}\s*|)/g));	

	spans[1].textContent.search(/\|\s*GC(\S{3,9})\s*\|/)
	entry.id = "GC"+RegExp.$1;		
	//~ entry.id = trim(spans[1].textContent.split('|')[1]);
	entry.name = trim(spans[0].textContent);
	entry.guid = information_cell.getElementsByTagName('a')[0].href.split('guid=')[1];
	entry.image = type_cell.getElementsByTagName('img')[0].getAttribute('src').split("/")[5];//.replace(/WptTypes\//, "WptTypes/sm/");
	entry.position = cache_row.getElementsByTagName('td')[10];
	
	
	var check = dojo.query("td",cache_row)[0].childNodes[1]
	if(check){
			entry.checked = check.checked;
	}
			
	return entry;
}


function getEntriesFromSearchpage(){
	var q = dojo.query('table[class = "SearchResultsTable Table"] > tbody > tr');
	var entries = [];
	
	for(var j = 1 ; j < q.length; j++){
		var cache_row = q[j];		

		var entry = getEntryFromSearchTr(cache_row);					
		debug("cache row - id:'"+entry.id+"' Name:'"+entry.name+"' Guid:'"+entry.guid+"' image:'"+entry.image+"' checked:'"+entry.checked+"'");		
		entries.push(entry);
	}
	
	return entries;
}



function getEntryFromSearchTd(theTd){
		var entryTds = theTd.getElementsByTagName('td');
		var entry = new Object();
		
		entry.id = 'GC'+entryTds[4].textContent.split('(GC')[1].split(')')[0];		
		entry.name = entryTds[4].getElementsByTagName('a')[1].innerHTML;
		entry.guid = entryTds[4].getElementsByTagName('a')[0].href.split('guid=')[1];
		entry.image = entryTds[4].getElementsByTagName('img')[0].getAttribute('src').split("/")[6];

		if(entryTds[0].childNodes[1]){
			entry.checked = entryTds[0].childNodes[1].checked;
		}
		return entry;
}
function update() {
	var updateDate = eval(GM_getValue('updateDate'));
	if (!updateDate) {
		updateDate = new Date();
		GM_setValue('updateDate', uneval(updateDate));
	}
	
	var currentDate = new Date();
    // if the last updateDate is more than 86 400 000 msec (1 day) ago - check for updates
	if (currentDate.getTime() - updateDate.getTime() > 86400000) {
	//~ if (true) { // ATTENTION!!
		// set the new updateDate
		GM_setValue('updateDate', uneval(currentDate));
	    var update_request = {'script':scriptId,'version':version,'build':build};

	    post(API_HOST+'/update', 'update='+JSON.stringify(update_request),
		    function(text){
			    //alert(text);
			    var update_obj = JSON.parse(text);
				log("update check: returns "+text);
				if(update_obj.changes[0] == "none" || update_obj.changes[0] == "error"){
					log("update check: version "+version+" build:"+build);
					log("update check: result from GAE:"+update_obj.changes[0]);
					return;
				}
			
			
			    var overlayBody = getOverlay({caption:"new version available",minimized:true});
		

			    var versions_string = ""
			    for(var ver_i =0 ; ver_i<update_obj.changes.length; ver_i++){
				    var version_obj = update_obj.changes[ver_i];
				    versions_string += "<div style='margin-top: 0.75em;'><strong>v"+version_obj.version+"."+version_obj.build+"</strong></div>";
				    versions_string += "<ul>";
				    for(var chg_i =0 ; chg_i<version_obj.changes.length; chg_i++){
					    versions_string += "<li>";
					    versions_string += version_obj.changes[chg_i];
					    versions_string += "</li>";
				    }
				    versions_string += "</ul>";
			    }

			    var updateMapping = new Array(
				    new Array('VERSION_OLD',version+"."+build),
				    new Array('VERSION_NEW',update_obj.version+"."+update_obj.build),
				    new Array('VERSION_HISTORY',versions_string)
			    );	

			    //{"update":"http:\/\/userscripts.org\/scripts\/source\/36273.user.js","build":12345,"script":"gctour","changes":[{"build":12345,"changes":["1.98 test1","1.98 test4","1.98 test6"],"version":1.98},{"build":12343,"changes":["1.97 test1","1.97test2","1.97 test3"],"version":1.97}],"version":1.98}
			
			    var confirmString = lang['updateDialog'];			

			
			    var update_dom = fillTemplate(updateMapping,confirmString);
			    var footer = update_dom.getElementsByTagName('div')[update_dom.getElementsByTagName('div').length-1];
			
			    // if install is pressed set the document.location to the url given by the update object
			    var install_button = document.createElement('input');
			    install_button.type = "button";
			    install_button.value = lang['install'] ;
			    install_button.style.backgroundImage = "url("+userscript_image+")";
			    install_button.addEventListener('click', function() {
				    setTimeout(closeOverlay, 500);
				    document.location = update_obj.update;
			    }, true);
			
			
			    var close_button = document.createElement('input');
			    close_button.type = "button";
			    close_button.value = lang['cancel'] ;
			    close_button.style.backgroundImage = "url("+closebuttonImage+")";
			    close_button.addEventListener('click', closeOverlay, false);
			
			    footer.appendChild(close_button);
			    footer.appendChild(install_button);
				
			
			
			
			
						
			    overlayBody.appendChild(update_dom);			
		
		    }
	    );
	}
}

function parseUpdateXMLResponse(xmlString) {
	var updateNode;
	var xmlDoc = (new DOMParser()).parseFromString(xmlString, "application/xml");
	var string = '';

	var scriptElements = xmlDoc.getElementsByTagName('script');

	for(var i = 0;i< scriptElements.length;i++) {
		if (scriptElements[i].getAttribute('id') == scriptId) {
			var versions = scriptElements[i].getElementsByTagName('version');
			var currentVersion = 0; 
			var currentVersionIndex; 
			for(var j = 0;j< versions.length;j++) {
				if (versions[j].getAttribute('number') > currentVersion) {
					currentVersion = versions[j].getAttribute('number');
					currentVersionIndex = j;
				}
			}

			if (currentVersion > version) {
				updateNode = versions[currentVersionIndex];
			}			
		}		
	}




	if (updateNode) {
		var confirmString = 'There is a new version of GcTour.\n\t'+ version +' -> '+ updateNode.getAttribute('number') +'\nChanges:\n';

		var changes = updateNode.getElementsByTagName('change');
		for(var j = 0;j< changes.length;j++) {
			confirmString += '\t+ '+ changes[j].textContent +'\n';
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
	
	var costumMarker = (typeof(theEntry.latitude) != "undefined");


	// if this is a cosutm marker user other id 
	var theId = (!costumMarker)?theEntry.id:theEntry.wptcode; 
	
	var entryLi = createElement('li', {id: theId, style: "opacity:0;width:88%;list-style-image='url('"+theEntry.image+"');background-color:pink;"});	
	//~ 
	
	// set the background image
	//~ entryLi.style.background = "transparent url(http://stats.madd.in/counter/digit.php?digit="+(getPositionsOfId(theEntry.id || theEntry.wptcode)+1)+") fixed no-repeat bottom right";
	entryLi.style.backgroundImage = "url(http://stats.madd.in/counter/digit.php?digit="+(getPositionsOfId(theEntry.id || theEntry.wptcode)+1)+")";
	entryLi.style.backgroundRepeat = "no-repeat";
	entryLi.style.backgroundPosition = "bottom right";
	
	//set the type
    entryLi.style.listStyleImage="url('"+theEntry.image+"')";
	entryLi.setAttribute("class", "dojoDndItem");

	
	// make the gcid link
	var nameCite = createElement('span',{style:"vertical-align:top"});
	
	
	
			
	//~ var indexDiv = createElement('span',{style:"margin-right: 6px;"});
		//~ indexDiv.innerHTML = "<b>"+(getPositionsOfId(theEntry.id || theEntry.wptcode)+1)+"</b>";
		//~ append(indexDiv,nameCite);
		
	if(!costumMarker){	          
		var coordinates = GM_getValue('coords_'+theId,"null");
		
		if(coordinates != "null"){
			var moveCoords = createElement('img',{src:'http://www.geocaching.com/images/icons/coord_update.gif',height:"12",style:"float:right;margin-right:5px", alt:lang['movedGeocache'], title:lang['movedGeocache']});
			nameCite.appendChild(moveCoords);
		}
		var linkElement = document.createElement('a');
		//linkElement.style.fontSize = '9px'; to small!
		linkElement.style.fontFamily = 'arial,sans-serif';
		linkElement.href = 'http://www.geocaching.com/seek/cache_details.aspx?guid='+theEntry.guid;
		linkElement.textContent = theId;
		nameCite.appendChild(linkElement);
		
		
	} else {
		nameCite.innerHTML += theEntry.name;
		nameCite.style.textDecoration = "underline";
	}
	

	
	
	// the log/edit button and the delete button
	var functionButtonsDiv = document.createElement('div');
	functionButtonsDiv.style.cssFloat = 'right';
	functionButtonsDiv.setAttribute("class", "controls");
	
	if(!costumMarker){
		var logVisitImage = document.createElement('img');
		logVisitImage.alt = lang['logYourVisit'];
		logVisitImage.title = lang['logYourVisit'];
		logVisitImage.style.cursor = 'pointer';    
		logVisitImage.src = "http://www.geocaching.com/images/stockholm/16x16/add_comment.gif";
		logVisitImage.addEventListener('click', function(){window.location.href = 'http://www.geocaching.com/seek/log.aspx?wp='+theId;}, true);	
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
	deleteImage.addEventListener('click', deleteElementFunction(theId), true);	
	addOpacityEffects(deleteImage); 
	functionButtonsDiv.appendChild(deleteImage);	


	// thanks to adam r
	/* unneeded  since the list uses drag and drop 
	var upDownDiv = document.createElement('div');
	upDownDiv.align = "right";
	
	var topButton = document.createElement('img');
    topButton.alt = "top";
    topButton.title = "top";
    topButton.style.cursor = 'pointer';
    topButton.src = topArrowImageString;
    topButton.addEventListener('click', moveTop(theId), true);
    addOpacityEffects(topButton);
	
	var upButton = document.createElement('img');
    upButton.alt = "up";
    upButton.title = "up";
    upButton.style.marginRight = '5px';
    upButton.style.cursor = 'pointer';
    upButton.src = upArrowImageString;
    upButton.addEventListener('click', moveUp(theId), true);
    addOpacityEffects(upButton);
    
	
	var downButton = document.createElement('img');
    downButton.alt = "down";
    downButton.title = "down";
    downButton.style.cursor = 'pointer';    
	downButton.style.marginRight = '5px';
    downButton.src = downArrowImageString;    
    downButton.addEventListener('click', moveDown(theId), true);
    addOpacityEffects(downButton);
	
	var bottomButton = document.createElement('img');
    bottomButton.alt = "bottom";
    bottomButton.title = "bottom";
    bottomButton.style.cursor = 'pointer';
    bottomButton.src = bottomArrowImageString;
    bottomButton.addEventListener('click', moveBottom(theId), true);
    addOpacityEffects(bottomButton);
		
	functionButtonsDiv.appendChild(document.createElement('br'));
	upDownDiv.appendChild(upButton);
	upDownDiv.appendChild(topButton);
	upDownDiv.appendChild(document.createElement('br'));
	upDownDiv.appendChild(downButton);
	upDownDiv.appendChild(bottomButton);
	functionButtonsDiv.appendChild(upDownDiv);*/
	
	
	entryLi.appendChild(functionButtonsDiv);
	entryLi.appendChild(nameCite);
	
	
	var nameDiv = document.createElement('div');
	nameDiv.style.clear = 'left';

	
	if(!costumMarker){
		nameDiv.innerHTML += theEntry.name;
	}else {
		nameDiv.innerHTML += Dec2DM_String(theEntry.latitude,theEntry.longitude) + " " + theEntry.content;
	}	
	entryLi.appendChild(nameDiv);
	
	document.getElementById('cacheList').appendChild(entryLi);
	if(unsafeWindow.draglist){
		unsafeWindow.draglist.sync(); // needed to function properly
	}
	
	if(effects){
		dojo.fadeIn({node: entryLi,duration: 1000}).play()
	} else {
		entryLi.style.opacity = "1";
	
	}
	
}


function getPositionsOfId(theId){
	for (var i = 0; i < currentTour.geocaches.length; i++){
		if(currentTour.geocaches[i].id == theId || currentTour.geocaches[i].wptcode == theId){
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

function addCustomMarker(name, lat, lon, content, typeImage, typeSymbol,wptcode){
	
	if(currentTour.geocaches.length == 0){
		var table = document.getElementById('cacheList');		
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
	
	
	entry.wptcode = (wptcode)?wptcode:(new Date().getTime()-Math.round(lat+lon*1000)).toString(16);	
	entry.name = name;		
	entry.latitude = lat;
	entry.longitude = lon;
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
				var table = document.getElementById('cacheList');		
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


function newTourFunction(preset){
	return function(){
		var newTour = new Object();
		newTour.id = getNewTourId();
		
		var tourName = (preset)?preset:"Tour "+newTour.id
		newTour.name = prompt(lang['newTourDialog'], tourName);
		newTour.geocaches = new Array();
		if(!newTour.name) return false;
		
		
		
		tours.push(newTour);
		log("Creating new tour: "+newTour.id +" ; "+ newTour.name);
		
		saveTour(newTour);	
		
		//~ window.location.reload();		
		updateTour();
		
		return true;
	}
}

function saveCurrentTour(){
	saveTour(currentTour);
}
	
function saveTour(tour, notLoad){	
	var i;
	for (i= 0; i < tours.length; ++i){
		if(tours[i].id == tour.id){
			tours[i] = tour;
		}
	}
		
		
	
	GM_setValue('tours', uneval(tours));
	if(notLoad === undefined){
		GM_setValue('currentTour', tour.id);
		log("updating "+tour.name);
		
		checkOnlineConsistent(tour);
	}
	
}

function updateCacheCount(count){
	dojo.query("span[id='cachecount']")[0].innerHTML = '('+count+')';
	
	dojo.animateProperty(
    {
      node: "cachecount",duration: 1000,
      properties: {
        //~ color:         { start: "black", end: "white" },
        backgroundColor:   { start: "#FFE000", end: "#FFF" }
      }
    }).play();
    
    
    dojo.animateProperty(
    {
      node: "gctourButton",duration: 1000,
      properties: {
        //~ color:         { start: "black", end: "white" },
        backgroundColor:   { start: "#FF0000", end: "#B2D4F3" }
      }
    }).play();
    
    
    
}

function deleteCurrentTour(){
	if (confirm(lang['removeTourDialog'])) {  
		var tableId;
		for (tableId = 0; tableId<tours.length;tableId++){
			if(tours[tableId].id == currentTour.id){
				 break;
			}
		}
		
		var nextTourId = tours[(tableId + 1) % tours.length].id;
		var currentTourId = currentTour.id;
		
		loadTour(nextTourId)();
		deleteTourFunction(currentTourId, true)();
	}
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
					if(currentTour.geocaches[i].id == theId || currentTour.geocaches[i].wptcode == theId){
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
					var table = document.getElementById('cacheList');		
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
		if (document.getElementById("inconsistentTour")){
			document.getElementById("inconsistentTour").style.display="none";
		}

		if(document.URL.search("webcode")>=0){
			window.location = "http://www.geocaching.com";
		} else {
			updateTour();
		}

	}
}

function updateTour(){
	initCore();
	updateGUI();
}



function checkOnlineConsistent(t){
	 // Creates way to much traffic :( 
	 // maybe in the next version
	 
	 /*
	
	if(t.webcode){
		geocaches = new Array();
		waypoints = new Array();				
		costumMarkers = new Array();
			
		var list = {webcode:t.webcode,geocaches:[]};
		for (cache_i = 0; cache_i < t.geocaches.length; ++cache_i){			
			list.geocaches.push((typeof(t.geocaches[cache_i].latitude) != "undefined")?t.geocaches[cache_i].wptcode:t.geocaches[cache_i].id );
		}

		
		
		var jsonTour = JSON.stringify(list);
		post(API_HOST+'/tour/check', "tour="+jsonTour,	
			function(text){
				log("checkOnlineConsistent:"+text)
				
				if(text == "false"){
					if (document.getElementById("inconsistentTour")){
						document.getElementById("inconsistentTour").style.display="inline";
					} else {
						window.setTimeout(function(){document.getElementById("inconsistentTour").style.display="inline"},3000);	
					}
				} else {
					
					if (document.getElementById("inconsistentTour")){
						document.getElementById("inconsistentTour").style.display="none";
					} else {
						window.setTimeout(function(){document.getElementById("inconsistentTour").style.display="none"},3000);	
					}
				}
			}
		);
	} */
}
	

function deleteTourFunction(id, force){
	return function(){
		if (force || confirm(lang['removeTourDialog'])) {  
			
			for (var i = 0; i < tours.length; i++){
				if(tours[i].id == id){
					log("removing '"+tours[i].name +"'");
					// array in js are dumb - where is removeAt ??
					
					var cachelist = document.getElementById('dialogDetails');
					
	
					
					if(cachelist && cachelist.getAttribute("tourid") == tours[i].id){
						
						showCacheList(currentTour)();
						var loadButton = document.getElementById('loadButton');
						loadButton.setAttribute("disabled","disabled");
					}
				
					
					dojo.destroy(dojo.byId("tour"+id));



					tours.splice(i,1);
					saveCurrentTour();					
					
					//updateTour();
					
					break;
				}
			}
		}
	}
}
function printPageFunction(currentTour){
	return function(){
		if(!userName){
			alert(lang['notLogedIn']);
		} else if( currentTour.geocaches.length == 0) {
			alert(lang['emptyList']);
		} else {		
			
			var minimal = GM_getValue('printMinimal',false);
			
			var cacheDetailTemplate = 
				'<div class="cacheDetail" id="###GUID###">'+
				'	<div class="geocache_count ###HIDDENSTYLE###"><span>###CACHECOUNT###</span></div>'+
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
				'		<div class="short ###HIDDENSTYLE###">###SHORT_DESCRIPTION###</div>'+
				'		<div class="long ###HIDDENSTYLE###">###LONG_DESCRIPTION###</div>'+
				'		<div>###GCCOMMENT###</div>'+
				'		<div>###CACHENOTE###</div>'+
				'		<div><b>Hint:</b>###HINT###</div>'+
				'		<div class="waypoints ###HIDDENSTYLE###">###ADDITIONAL_WAYPOINTS###</div>'+
				'		<div class="images">###IMAGES###</div>'+
				'		<div id = "###MAPID###" class="map ###HIDDENSTYLE###">###MAP###</div>'+
				'		<div class="removable ###HIDDENSTYLE###">###LOGCOUNTER###</div>'+
				'		<div class="logs ###HIDDENSTYLE###">###LOGS###</div>'+
				'		<div style="clear:both">&nbsp;</span>'+
				'	</div>'+
				'</div>';
			var ownMarkerTemplate = 
				'<div class="cacheDetail">'+
				'	<div class="geocache_count ###HIDDENSTYLE###" style="padding:5px !important"><span>###CACHECOUNT###</span></div>'+
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
			
				
			var costumMarker = (typeof(currentTour.geocaches[0].latitude) != "undefined");
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
					addProgressbar({_document:newwindow2.document,closeCallback:function(_document){return function(){GM_setValue("stopTask",true);_document.defaultView.close();}}});
					
					
					var head = newwindow2.document.getElementsByTagName('head')[0];    
					var style = document.createElement('style');
					style.type = 'text/css';
					//~ style.innerHTML = 'font {font-size:x-small !important}  td {font-size:x-small !important} span {font-size:x-small !important}'+
									  //~ 'div {font-size:x-small !important} p {font-size:x-small !important}';
					//~ style.innerHTML = 'font,td,th,span,div, p {font-size:'+GM_getValue("printFontSize","x-small")+'!important} ';
					style.innerHTML = '*{ font-size:'+GM_getValue("printFontSize","x-small")+' } .cacheDetail{ border: 1px solid lightgray; width: 100%; text-align: left;} .cacheDetail div{ padding-left:5px; } .wpt_id{ position:relative; padding:5px !important; float:right;  font-size:medium; font-weight:bold; } .geocache_id{ position:relative; padding:20px !important; float:right;  font-size:medium; font-weight:bold; }  .content{ clear:both; border-top:2px dashed lightgray; margin-top:10px; padding-top:10px; }  img{ vertical-align:middle; }  #details span{ margin-left: 10px } .images{clear:both;height:auto}';
					style.innerHTML += '.removable{margin:2px;} .map{clear:both} .logs{clear:both} .logs div{margin:2px} .hidden{display:none} .highlight{background-color:pink}';
					style.innerHTML += '.geocache_count{ position:relative; padding:20px !important; float:right;  font-size:medium; font-weight:bold; } .geocache_count span{padding: 5px; font-weight: bold; font-size: 18px; -moz-border-radius: 5px;border:2px dotted black;}';
					style.innerHTML += 'sup {vertical-align:baseline;font-size:77%;position:relative;top:-5px;}';
					style.innerHTML += '.dialogMask {background-image:url('+dialogMaskImage+');height:100%;left:0;opacity:0.7;position:fixed;top:0;width:100%;z-index:9000000;}'+
										'.dialogBody{-moz-border-radius:5px;background:none repeat scroll 0 0 #fff;border:1px solid #333333;color:#333333;cursor:default;font-family:Arial;font-size:12px;left:50%;margin-left:-250px;margin-top:20px;padding:0 0 1em;position:fixed;text-align:left;top:0;width:500px;z-index:9000010;max-height:85%;min-height:370px;overflow:auto;}'+
										'.dialogBody p {font-size:12px;font-weight:normal;margin:1em 0em;}'+
										'.dialogBody h1{background-color:#B2D4F3;font-size:110%;font-family:Helvetica Neue,Arial,Helvetica,sans-serif;margin-bottom:0.2em;padding:0.5em;-moz-border-radius:5px 5px 0px 0px;color:#333333;background-image:url("'+tabBgImage+'")}'+
									//	'.dialogBody h1{background-color:#7A7A7A;border-bottom:1px solid #333333;font-size:110%;font-family:Helvetica Neue,Arial,Helvetica,sans-serif;margin-bottom:0.2em;padding:0.5em;-moz-border-radius:5px 5px 0px 0px;color:#fff;}'+
										'.dialogHistory {border:1px inset #999999;margin:0 1em 1em;height:200px;overflow-y:auto;width:448px;padding-left:1em;}'+
										'.dialogHistory ul{margin-left:2em;}'+
										'.dialogHistory li{list-style-type:circle;}'+
										'.dialogFooter input{-moz-border-radius:3px;background:none no-repeat scroll 4px center #EEEEEE;border:1px outset #666666;cursor:pointer;float:right;margin-left:0.5em;padding:3px 5px 5px 20px;min-width:100px;}'+
										'.dialogFooter input:hover { background-color:#f9f9f9; }'+
										'.dialogContent {padding:0px 10px 0px 10px;}'+
										'.dialogMin {min-height:0px !important}'+
										'.noprint {padding:2px;border: 1px solid rgb(235, 239, 194); background-color: rgb(251, 255, 207); text-align: left;}';
					
					head.appendChild(style); 

					style = document.createElement('style');
					style.media = 'print';
					style.type = 'text/css';
					//hide the map control in print
					style.innerHTML = '.noprint   { display: none; } body {margin: 0;padding: 0;color: black;background: transparent;width:99%}';
					

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
					if(GM_getValue('printFrontpage',true) && !minimal){
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
						//~ coverTable.style.textAlign = 'left';
						//~ coverTable.style.marginLeft = 'auto';
						//~ coverTable.style.marginRight = 'auto';
						coverTable.style.border = '1px solid lightgray';
						
						coverTable.innerHTML = 
							'<thead><tr>		 			'+
							'	<th colspan="2" style="border-bottom:1px solid lightgray;"><b>'+lang['printviewCache']+'</b></th>		'+
							'	<th style="border-bottom:1px solid lightgray;">&nbsp;</th>		'+
							'	<th style="border-bottom:1px solid lightgray;">&nbsp;</th>		'+
							'	<th style="border-bottom:1px solid lightgray;" align="center"><b>D</b></th>		'+
							'	<th style="border-bottom:1px solid lightgray;" align="center"><b>T</b></th>		'+
							'	<th style="border-bottom:1px solid lightgray;" align="center"><b>S</b></th>		'+
							'	<th style="border-bottom:1px solid lightgray;" align="center"><b>L4L</b>&nbsp;</th>		'+
							'	<th style="border-bottom:1px solid lightgray;"><b>'+lang['markerCoordinate']+'</b></th>		'+
							'	<th style="border-bottom:1px solid lightgray;"><b>'+lang['printviewFound']+'</b></th>		'+
							'	<th style="border-bottom:1px solid lightgray;">&nbsp;&nbsp;<b>'+lang['printviewNote']+'</b></th>		'+
							'</tr><thead>';
							
						var tbody = createElement('tbody');append(tbody,coverTable);
							
						var isCostumMarker = false;	
						for (var i = 0; i < currentTour.geocaches.length; ++i){
							var costumMarker = (typeof(currentTour.geocaches[i].latitude) != "undefined");
						
							if(!costumMarker){
								
								var tr = document.createElement('tr');tbody.appendChild(tr);
								var td = document.createElement('td');tr.appendChild(td);
								td.innerHTML = "<b style='margin:0 6px'>"+(i+1)+"</b>";
								
					
								td = createElement('td',{style:"border-bottom:1px solid lightgray;"});tr.appendChild(td);
								td.innerHTML = "<img src='"+currentTour.geocaches[i].image+"'>";
								
								td = createElement('td',{style:"border-bottom:1px solid lightgray;white-space:nowrap;"});tr.appendChild(td);
								//~ td.style.width = "100%";			
								td.innerHTML = "<a style='color:#000000;text-decoration: none' href='http://www.geocaching.com/seek/cache_details.aspx?guid="+currentTour.geocaches[i].guid+"'>"+currentTour.geocaches[i].name + "</a>";
								
								td = createElement('td',{style:"border-bottom:1px solid lightgray;border-right:1px dashed lightgray;"});tr.appendChild(td);
								td.innerHTML = "<span style='margin:0 2px'>"+currentTour.geocaches[i].id+"</span>";
								
								td = createElement('td',{style:"border-bottom:1px solid lightgray;border-right:1px dashed lightgray;"});tr.appendChild(td);
								td.innerHTML = "<span style='margin:0 2px' id='d_" + currentTour.geocaches[i].id + "'></span>";
								
								td = createElement('td',{style:"border-bottom:1px solid lightgray;border-right:1px dashed lightgray;"});tr.appendChild(td);
								td.innerHTML = "<span style='margin:0 2px' id='t_" + currentTour.geocaches[i].id + "'></span>";
								
								td = createElement('td',{style:"border-bottom:1px solid lightgray;border-right:1px dashed lightgray;"});tr.appendChild(td);
								td.innerHTML = "<span style='margin:0 2px' id='s_" + currentTour.geocaches[i].id + "'></span>";
								
								td = createElement('td',{style:"border-bottom:1px solid lightgray;white-space:nowrap;"});tr.appendChild(td);
								td.innerHTML = "<canvas id='l4l_"+currentTour.geocaches[i].id+"' width='17' height='17' style='margin-left: 2px;position: relative;top: 2px;'/>";
							
								
								td = createElement('td',{style:"border-bottom:1px solid lightgray;white-space:nowrap;"});tr.appendChild(td);
								td.innerHTML = "<span style='margin:0 2px' id='coords_"+currentTour.geocaches[i].id+"'></span>";
								
								
								
								
								td = document.createElement('td');tr.appendChild(td);
								td.style.verticalAlign = "middle";				
								//~ td.style.border = '1px solid lightgray';
								td.innerHTML = "<div style='margin-left:auto;margin-right:auto;width:10px;height:10px;border:1px solid lightgray;'>&nbsp;</div>";
								
								
								td = createElement('td',{style:"border-bottom:1px solid lightgray;"});tr.appendChild(td);
								td.style.verticalAlign = "middle";
								td.style.width = "100%";					
								td.innerHTML = "&nbsp;";
								//~ td.style.borderBottomColor = 'lightgray';
								//~ td.style.borderBottomStyle = 'dashed';
								//~ td.style.borderBottomWidth = '1px';
								
							
								
						/*		td = document.createElement('td');tr.appendChild(td);
								td.style.verticalAlign = "right";
								td.style.width = "20%";	
								td.innerHTML = "<span id='coords_"+currentTour.geocaches[i].id+"'></span>";
								td.style.borderBottomColor = 'lightgray';
								td.style.borderBottomStyle = 'dashed';
								td.style.borderBottomWidth = '1px';
							*/	
							} else {
								isCostumMarker = costumMarker;
							}
						}
						
						if(isCostumMarker){
							tbody.innerHTML += 
							'<tr>		 			'+
							'	<td colspan="10" style="border-bottom:1px solid lightgray;"><b>'+lang['printviewMarker']+'</b></td>		'+
							'</tr>';
							
							for (var i = 0; i < currentTour.geocaches.length; ++i){
								var costumMarker = (typeof(currentTour.geocaches[i].latitude) != "undefined");
							
								if(costumMarker){
									var tr = document.createElement('tr');tbody.appendChild(tr);
									var td = document.createElement('td');tr.appendChild(td);
									
									td.innerHTML = "<b style='margin:0 10px'>"+(i+1)+"</b>";
									
									td = document.createElement('td');tr.appendChild(td);
									td.innerHTML = "<img src='"+currentTour.geocaches[i].image+"'>";
									
									
									td = document.createElement('td');tr.appendChild(td);
									td.style.verticalAlign = "middle";
									td.style.width = "30%";				
									td.colSpan = "8";	
									td.style.borderBottom = '1px solid lightgray';
									td.innerHTML = currentTour.geocaches[i].name;
									td.innerHTML += " - "+Dec2DM_String(currentTour.geocaches[i].latitude,currentTour.geocaches[i].longitude);
																		
								} 
							}
							
						}
							

						title.appendChild(coverTable);		
						
						
						
						var overview_map = createElement('div',{id:"overview_map"});
						title.appendChild(overview_map);
					}
					
					
					
					/* map array */			
					var geocaches = new Array();			
					var costumMarkers = new Array();
	
					for (var i = 0; i < currentTour.geocaches.length; ++i){
						
						if(GM_getValue("stopTask",false) && i != 0){
							GM_setValue("stopTask",false);
							newwindow2.close();
						} else if (GM_getValue("stopTask",false) && i == 0 ) {
							GM_setValue("stopTask",false);
						}
						var costumMarker = (typeof(currentTour.geocaches[i].latitude) != "undefined");
				
						
						if(!costumMarker){
							
							var geocache = getGeocache(currentTour.geocaches[i].id);
							
							if(geocache == "pm only"){
								var pmOnlyDiv = createElement('div');
								pmOnlyDiv.setAttribute('class','cacheDetail');
								pmOnlyDiv.innerHTML = "<b><img src='"+currentTour.geocaches[i].image+"'>"+currentTour.geocaches[i].name+" ("+currentTour.geocaches[i].id+") is PM ONLY!</b>";
								body.appendChild(pmOnlyDiv);
								body.appendChild(document.createElement('br'));
							} else {
												
								//log
								var logs_div = createElement('div');
								
								
								var logs = geocache.logs;															
								var maxPrintLogs = parseInt(GM_getValue('maxPrintLogs',3));
								// if maxprintlogs is <= -1, export all logs to the print overview
								if(maxPrintLogs <= -1)
									maxPrintLogs = logs.length;
								maxPrintLogs = maxPrintLogs;
								for (var log_i = 0; (log_i < logs.length && (log_i < maxPrintLogs)); log_i++){
									var log_div = createElement('div', {style:"width:95%;page-break-inside:avoid;"});
									log_div.setAttribute("class", "removable");
									
									var log_type_img = createElement('img', {src:'http://www.geocaching.com/images/icons/'+logs[log_i].LogTypeImage});
									log_div.appendChild(log_type_img);
									log_div.innerHTML += " " + logs[log_i].Created +" - "+ logs[log_i].UserName +" ("+logs[log_i].GeocacheFindCount+")<br>";
									log_div.innerHTML += logs[log_i].LogText;
									append(log_div, logs_div);
								}
								
														
								var dummy_additional_waypoints = createElement('div');
								if (GM_getValue('printAdditionalWaypoints',true)){								
									var wpts_table = createElement('table', {style:"width:100%;border-collapse:separate;"} );append(wpts_table,dummy_additional_waypoints);
									wpts_table.setAttribute("class", "removable");
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
									//~ attribute.style.opacity = "0.5";
									if(attribute.src != "http://www.geocaching.com/images/attributes/attribute-blank.gif")
										append(attribute, attributes);
								}
									
								
			
								
								var map_element_dummy = createElement('div');
								var map_element = createElement('div');append(map_element, map_element_dummy);
								
								
							// map the geocache to uploadable version
								var mapCache = new Object();
								mapCache.gcid = geocache.gcid;
								mapCache.guid = geocache.guid;
								mapCache.image = geocache.image;
								mapCache.name = geocache.name;
								mapCache.difficulty = geocache.difficulty;
								mapCache.terrain = geocache.terrain;
								mapCache.latitude = geocache.lat;
								mapCache.longitude = geocache.lon;

								// save additional waypoints
								var additional_waypoints = geocache.additional_waypoints;
								for(waypoint_i = 0 ; waypoint_i < additional_waypoints.length; waypoint_i++){
									additional_waypoints[waypoint_i].note = "";
								}
								mapCache.additional_waypoints = additional_waypoints;
								geocaches.push(mapCache);
								// map the geocache to uploadable version - END -
								
							var gcComment = "";
							
							if(geocache.comment){
								gcComment = "<b><u>GCComment:</u></b><br/>";
								if(geocache.comment.lat){
									var parsedCoords = Dec2DM_String(geocache.comment.lat,geocache.comment.lng);
									gcComment += "<b>Final Coordinates:</b> "+parsedCoords+"<br/>";
								}
								gcComment += "<b>Comment:</b> ("+geocache.comment.state+") "+geocache.comment.commentValue;
							}
							
							var cache_note = "";
							if(geocache.cache_note){
								cache_note = "<b><u>Cache Note:</u></b><br/>";
								cache_note += geocache.cache_note;
							}
							
					
							if(GM_getValue('printFrontpage',true) && !minimal){							
								// replace placeholder on titlepage with real coordinates
								var title_coords = dojo.query("span[id='coords_"+geocache.gcid+"']",newwindow2.document)[0];
								title_coords.innerHTML = geocache.coordinates;
								
								
								// setting D, T and size on titlepage
								 dojo.query("span[id='d_"+geocache.gcid+"']",newwindow2.document)[0].innerHTML = geocache.difficulty;
								 dojo.query("span[id='t_"+geocache.gcid+"']",newwindow2.document)[0].innerHTML = geocache.terrain;
								 dojo.query("span[id='s_"+geocache.gcid+"']",newwindow2.document)[0].innerHTML = geocache.size.substring(0,1);
								 
								 // set the last 4 logs icon:
								 getLast4Logs(geocache.logs, dojo.query("canvas[id='l4l_"+geocache.gcid+"']",newwindow2.document)[0]);
								//~ dojo.query("span[id='l4l_"+geocache.gcid+"']",newwindow2.document)[0].innerHTML = getLast4Logs(geocache.logs);
								 
							}
	
							
								
							var geocacheMapping = new Array(
								new Array('GCID',geocache.gcid),
								new Array('CACHECOUNT',i+1),
								new Array('GUID',geocache.guid),
								new Array('TYPE',geocache.type),
								new Array('CACHENAME',(geocache.available)?geocache.name:"<span style='text-decoration: line-through !important;'>"+geocache.name+"</span>"),
								new Array('OWNER',geocache.owner),
								new Array('HIDDEN',formatDate(geocache.hidden)),
								new Array('ATTRIBUTES',attributes.innerHTML),
								new Array('BEARING',geocache.bearing),
								new Array('DISTANCE',geocache.distance),
								new Array('INVENTORY',inventory.innerHTML),
								new Array('COORDINATES',geocache.coordinates),
								new Array('DIFFICULTY',geocache.difficulty.replace(/\./,"_")),
								new Array('TERRAIN',geocache.terrain.replace(/\./,"_")),
								new Array('SIZE',geocache.size.toLowerCase().replace(/ /,"_")),
								new Array('SHORT_DESCRIPTION',(geocache.short_description)?geocache.short_description.innerHTML:""),
								new Array('LONG_DESCRIPTION',(geocache.long_description)?geocache.long_description.innerHTML:""),
								new Array('GCCOMMENT',gcComment),
								new Array('CACHENOTE',cache_note),
								new Array('HINT',(GM_getValue('decryptPrintHints',true))?geocache.hint:convertROTStringWithBrackets(geocache.hint)),
								new Array('ADDITIONAL_WAYPOINTS',dummy_additional_waypoints.innerHTML),
								new Array('IMAGES',dummy_images.innerHTML),
								new Array('MAP', map_element_dummy.innerHTML),
								new Array('MAPID', "MAP_"+geocache.gcid),
								new Array('LOGCOUNTER',(GM_getValue('printLoggedVisits',false))?geocache.find_counts.innerHTML:""),
								new Array('LOGS',logs_div.innerHTML)
							);
								
							if(minimal){
								geocacheMapping.push(new Array('HIDDENSTYLE',"hidden"));
							} else {
								geocacheMapping.push(new Array('HIDDENSTYLE',""));
							}
							
							var cacheDetailTemp = fillTemplate(geocacheMapping,cacheDetailTemplate);
													
							dojo.query("*[class='removable']",cacheDetailTemp).onclick(function(e){e.stopPropagation();dojo.destroy(this); }).onmouseover(function(e){ this.style.opacity="0.5";this.style.cursor = "url('"+deleteImageString+"'),pointer";}).onmouseout(function(e){ this.style.opacity="1";});
							
							// remove images in description
							
							dojo.query("img",dojo.query("div[class*='long']",cacheDetailTemp)[0]).onclick(function(e){e.stopPropagation();dojo.destroy(this); }).onmouseover(function(e){ this.style.opacity="0.5";this.style.cursor = "url('"+deleteImageString+"'),pointer";}).onmouseout(function(e){ this.style.opacity="1";});
							dojo.query("a",dojo.query("div[class*='long']",cacheDetailTemp)[0]).forEach(function(node, index, nodeList){
								node.removeAttribute("href");
							});
							
							
							if(GM_getValue('printEditMode',false)){
								dojo.query("div[class*='long']",cacheDetailTemp)[0].contentEditable = "true";
								dojo.query("div[class*='short']",cacheDetailTemp)[0].contentEditable = "true";
								
							}
							
							if(GM_getValue('printPageBreak',false)){
								if(i < currentTour.geocaches.length-1)
									cacheDetailTemp.style.pageBreakAfter = 'always';
							}
							
							body.appendChild(cacheDetailTemp);
							body.appendChild(document.createElement('br'));
					
							
						}
							
				
							
						} else {
								
							// map costum marker to uploadable version	
							var cm = currentTour.geocaches[i];
							cm.index = i;
							costumMarkers.push(cm);
							// map costum marker to uploadable version - END -	
									
									
							var latArray = Dec2DM(currentTour.geocaches[i].latitude);
							var lonArray = Dec2DM(currentTour.geocaches[i].longitude);
								
										
							var markerMapping = new Array(
								new Array('GCID',lang["printviewMarker"]),
								new Array('CACHECOUNT',(i+1)),
								new Array('TYPE',currentTour.geocaches[i].image),
								new Array('NAME',currentTour.geocaches[i].name),
								new Array('COORDINATES',latArray[0]+ "°&nbsp;"+ latArray[1] + "&nbsp;&nbsp;" + lonArray[0]+ "°&nbsp;"+ lonArray[1]),
								new Array('CONTENT',currentTour.geocaches[i].content.replace(/\n/g, "<br />"))
							);
							if(minimal){
								markerMapping.push(new Array('HIDDENSTYLE',"hidden"));
							} else {
								markerMapping.push(new Array('HIDDENSTYLE',""));
							}								
										
							var cacheDetailTemp = fillTemplate(markerMapping,ownMarkerTemplate);							
							body.appendChild(cacheDetailTemp);
							body.appendChild(document.createElement('br'));
							
								//~ geocaches.push(currentTour.geocaches[i]);
						}
						
						
						// set the progress
						setProgress(i,currentTour.geocaches.length,newwindow2.document);									
					}
					
					
					closeOverlayRemote(newwindow2.document)();// close old ovleray (scraping data)
					addProgressbar({caption:lang['makeMapWait'],_document:newwindow2.document,closeCallback:function(_document){return function(){GM_setValue("stopTask",true);_document.defaultView.close();}}}); // new overlay - getting maps
					var cacheObject = {};
					cacheObject.geocaches = geocaches;
					cacheObject.costumMarkers = costumMarkers;
					uploadMap(cacheObject,
						function(){
							try{
								var overviewMapQuery = "";
								var geocacheCodes = [];
								
							
								for (var i = 0; i < currentTour.geocaches.length; ++i){
									var marker = currentTour.geocaches[i];
									
									if(marker.wptcode){
										overviewMapQuery += marker.wptcode;
									} else {
										overviewMapQuery += (marker.id)?marker.id:marker.gcid;
										geocacheCodes.push((marker.id)?marker.id:marker.gcid);
									}
									
									if(i < currentTour.geocaches.length-1){
										overviewMapQuery += ",";
									}
								}
								// overview map								
								var mapCount = (GM_getValue('printOutlineMap',true) && GM_getValue('printFrontpage',true) && !GM_getValue('printMinimal',false))?1:0;
								mapCount += (GM_getValue('printOutlineMapSingle',true))?geocacheCodes.length:0;
				
								
								if(GM_getValue('printOutlineMap',true) && GM_getValue('printFrontpage',true) && !GM_getValue('printMinimal',false)){
									dojo.query("div[id='overview_map']",newwindow2.document)[0].appendChild(getMapElement(overviewMapQuery));
									setProgress(1,mapCount,newwindow2.document);
								}
								
								
								// map for each geocache
								if(GM_getValue('printOutlineMapSingle',true)){
									for (var i = 0; i < geocacheCodes.length; ++i){
										var geocacheCode = geocacheCodes[i];
										var mapElement = dojo.query("div[id='MAP_"+geocacheCode+"']",newwindow2.document)[0];
										
										if(mapElement){
											mapElement.appendChild(getMapElement(geocacheCode));
										}
										setProgress(i+2,mapCount,newwindow2.document);
									}
								}
								closeOverlayRemote(newwindow2.document)();
							} catch (e) {					
								addErrorDialog({caption:"Print error maps", _document:newwindow2.document, _exception:e,closeCallback:function(_document){return function(){GM_setValue("stopTask",true);_document.defaultView.close();}}}); 
							}
							
						}					
					);	
						
										
				} catch (e) {					
					addErrorDialog({caption:"Print error", _document:newwindow2.document, _exception:e,closeCallback:function(_document){return function(){GM_setValue("stopTask",true);_document.defaultView.close();}}}); 
				}
				
			}
			, false);	
			
			
			
		}


	}


}


// funktion ähnlich http://www.gsak.net/help/hs11980.htm
function getLast4Logs(logs, canvas_element){
	var getColor = function(log){
		switch (log.LogType) {
			  case "Found it":
				return "green";
			  case "Didn't find it":
				return "red";
			case "Needs Maintenance":
				return "blue";
			case "Temporarily Disable Listing":
				return "black";
			case "Needs Archived":
				return "yellow";
			default:
				return "gray";
		}};
	
	var canvas = canvas_element; 
	var ctx = canvas.getContext("2d");  
	var size = 5;
	var border = 2;
	ctx.fillStyle = "black"; 
	//~ ctx.fillRect(0,0,17,17);

	ctx.clearRect(1,1,15,15);

	ctx.fillStyle = getColor(logs[0]);  
	ctx.fillRect (2, 2, 6,6);


	ctx.fillStyle = getColor(logs[1]);  
	ctx.fillRect (9, 2, 6,6); 

	ctx.fillStyle = getColor(logs[2]);  
	ctx.fillRect (2, 9, 6,6); 

	ctx.fillStyle = getColor(logs[3]);  
	ctx.fillRect (9, 9, 6,6); 
}


function getMapElement(mapQuery) {
	
	var map_container = createElement('div',{style:"text-align: center; margin-left: auto; margin-right: auto;"});
	
	
	var map_frame = getMap(mapQuery);
	map_container.appendChild(getMapControl(mapQuery,map_frame));
	map_container.appendChild(map_frame);
	
	return map_container;
	
}


function getMap(mapQuery){
	
	
	var factor = 1;
	var map_size = GM_getValue('defaultMapSize', 'large');
	if(map_size == "large"){
		factor = 1;
	} else if(map_size == "medium"){
		factor = 0.75;
	} else if(map_size == "small"){
		factor = 0.5;
	}
	
	
	
	var mapId = mapQuery.replace(/,/g,"");
	
	var map_frame = createElement('iframe');
	var map_frame = document.createElement('iframe');
	map_frame.className = 'cacheMap';
	map_frame.id = mapId;
	map_frame.style.width = (factor * 20) + "cm"; 
	map_frame.style.height = (factor * 500) + 'px';
	map_frame.style.border = '1px solid lightgray';
	map_frame.src = getMapUrl(mapQuery);
	return map_frame;	
	
}


function getMapUrl(mapQuery){
	return GCTOUR_HOST+"/map.jsp?i="+mapQuery+"&"+getMapSettings()+"&"+getMapType();
}

function getMapSettings(){
	var settings = [];
// settings String:
// 1 - Geocache GCID
// 2 - Geocache Name
// 3 - Waypoint Hide all
// 4 - Waypoint Name
// 5 - Waypoint Lookup
// 6 - Own Waypoint show
// 7 - Own Waypoints name
// 8 - Show gc.de maps overlay
// 9 - Show Geocache Index

	settings.push(GM_getValue('settings_map_geocacheid',true));
	settings.push(GM_getValue('settings_map_geocachename',true));
	settings.push(GM_getValue('settings_map_awpts',true));
	settings.push(GM_getValue('settings_map_awpt_name',true));
	settings.push(GM_getValue('settings_map_awpt_lookup',true));
	settings.push(GM_getValue('settings_map_owpts',true));
	settings.push(GM_getValue('settings_map_owpt_name',true));
	settings.push(GM_getValue('settings_map_gcde',false));	
	settings.push(GM_getValue('settings_map_geocacheindex',true));
	
	return "s="+settings.join("").replace(/true/g,"1").replace(/false/g,"0");
}

function getMapType(){
	return "m="+GM_getValue('printOutlineMapType','roadmap');
}

function getMapControl(mapQuery,map_frame){
	
	
	var mapId = mapQuery.replace(/,/g,"");
	var control_container = createElement('div',{style:"float:right;"});
	control_container.className = 'noprint';
	
	
	
	var factor = 1;
	var inputElement = document.createElement('input');control_container.appendChild(inputElement);
	inputElement.name = 'mapSize'+mapId;
	inputElement.type = 'radio';
	if(GM_getValue('defaultMapSize', 'large') == "large"){
		inputElement.checked = 'checked';
		factor = 1;
	}
	inputElement.addEventListener('click',function(){var factor = 1;map_frame.style.width=(factor * 20) +"cm";map_frame.style.height=(factor*500)+"px";}, false);
	control_container.appendChild(document.createTextNode("large"));
	
	
	inputElement = document.createElement('input');control_container.appendChild(inputElement);
	inputElement.name = 'mapSize'+mapId;
	inputElement.type = 'radio';							
	if(GM_getValue('defaultMapSize', 'large') == "medium"){
		inputElement.checked = 'checked';
		factor = 0.75;
	}
	inputElement.addEventListener('click',function(){var factor = 0.75;map_frame.style.width=(factor * 20) +"cm";map_frame.style.height=(factor*500)+"px";}, false);
	control_container.appendChild(document.createTextNode("medium"));

	
	inputElement = document.createElement('input');control_container.appendChild(inputElement);
	inputElement.name = 'mapSize'+mapId;
	inputElement.type = 'radio';							
	if(GM_getValue('defaultMapSize', 'large') == "small"){
		inputElement.checked = 'checked';
		factor = 0.5;
	}
	inputElement.addEventListener('click',function(){var factor = 0.5;map_frame.style.width=(factor * 20) +"cm";map_frame.style.height=(factor*500)+"px";}, false);
	control_container.appendChild(document.createTextNode("small"));
	
	control_container.appendChild(createElement('br'));
	
	
	
	
	// delete map button
	var divElement = document.createElement('div');control_container.appendChild(divElement);
	divElement.style.border = '1px solid lightgray';
	divElement.style.marginRight = '10px';
	divElement.style.display = "inline";
	divElement.style.cursor = "pointer";
	divElement.addEventListener('click', function(){map_frame.parentNode.style.display= "none"}, true);	
			
	addOpacityEffects(divElement); 
	
	
	var deleteImage = document.createElement('img');
	deleteImage.style.cursor = 'pointer'; 
	deleteImage.src = deleteImageString;
	

	

	divElement.appendChild(deleteImage);
	divElement.appendChild(document.createTextNode(lang['printviewRemoveMap']));
	
	control_container.appendChild(createElement('br'));
	
	var map_link = createElement('a',{style:"font-size:80%"});
	map_link.href = getMapUrl(mapQuery);
	map_link.target = "_blank";
	
//	map_link.addEventListener('click', function(){GM_openInTab(getMapUrl(mapQuery))}, true);		
	map_link.innerHTML = "("+lang['printviewZoomMap']+")";	
	control_container.appendChild(map_link);
	
	
	
	
	return control_container;
	
	
	
	//~ var updateMapSize = function (mapfactor){
		//~ return function(){
			//~ map_frame.style.width = (factor * 20) +"cm";
			//~ map_frame.style.height = (factor * 500) +"px";
		//~ }
	//~ };
	//~ 
		//~ 
	//~ return function(){
		//~ var map = newDocument.getElementById(mapId).getElementsByTagName('iframe')[0];
		//~ map.style.width = (factor * 20) +"cm";
		//~ map.style.height = (factor * 500) +"px";
	//~ }
//~ }
	//~ 
	//~ 
	//~ var size_control_div = createElement('div');
	//~ size_control_div.innerHTML =
		//~ '<input type="radio" name="mapSize'+mapId+'">large</input>\
		//~ <input type="radio" name="mapSize'+mapId+'">medium</input>\
		//~ <input type="radio" name="mapSize'+mapId+'">small</input>';
		//~ 
	//~ var size_control_inputs = dojo.query('input',size_control_div);
	//~ alert(size_control_inputs.length);
	//~ var factor = 1;
	//~ /* large */
	//~ if(GM_getValue('defaultMapSize', 'large') == "large"){size_control_inputs[0] = 'checked';factor = 1;}
	//~ size_control_inputs[0].addEventListener('click',updateMapSize(1), false);
	//~ /* medium */
	//~ if(GM_getValue('defaultMapSize', 'large') == "medium"){size_control_inputs[1] = 'checked';factor = 0.75;}
	//~ size_control_inputs[1].addEventListener('click',updateMapSize(0.75), false);
	//~ 
	//~ /* small */
	//~ if(GM_getValue('defaultMapSize', 'large') == "small"){size_control_inputs[2] = 'checked';factor = 0.5;}
	//~ size_control_inputs[2].addEventListener('click',updateMapSize(0.5), false);
	//~ 
	//~ 
	//~ 
	//~ 
//~ 
	//~ 
	//~ 
	//~ map_container.appendChild(size_control_div);
	//~ map_container.appendChild(map_frame);
	//~ 
//~ 
	//~ 
	//~ 
	//~ 
	//~ 
	//~ return map_container;	
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

// source of all evil asking groundspeak
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


	// first check if really logged in 
	
	//~ var logIOLink = dojo.query('a[id="ctl00_hlSignOut"]',element)[0].previousSibling.previousSibling;
	var logIOLink = dojo.query('a[id="ctl00_hlSignOut"]',element)[0].previousSibling.previousSibling;
	if(!logIOLink){
		throw "No longer logged in.";
	}
	

	var upper_tables = dojo.query('table[id="cacheDetails"] table',element);
	
	if(dojo.query('input[id="ctl00_ContentBody_uxPremiumSubmitBottom"]',element)[0]){
		return "pm only";
	}
	
	
	
	var geocache = new Object();
	geocache.gcid = trim(dojo.query('span[id="ctl00_ContentBody_uxWaypointName"]',element)[0].textContent);
	geocache.cacheid = trim(dojo.query('a[href*="/seek/log.aspx?ID="]',element)[0].href.split("=")[1]);
	geocache.guid = dojo.query("a[id='ctl00_ContentBody_lnkPrintFriendly']",element)[0].href.split("guid=")[1];
	geocache.name = trim(dojo.query('span[id="ctl00_ContentBody_CacheName"]',element)[0].textContent);
	geocache.image = dojo.query('a[href="/about/cache_types.aspx"] > img',element)[0].src;
	geocache.type =	dojo.query('a[href="/about/cache_types.aspx"] > img',element)[0].src.split("/")[5].split(".")[0];
	geocache.owner = trim(dojo.query('a[href*="http://www.geocaching.com/profile/?guid="]',element)[0].textContent);
	
	
	//~ alert(unsafeWindow.getGCComment);
	//~ alert("GCComment für '"+geocache.guid+"' -> '"+unsafeWindow.getGCComment(geocache.guid)+"'");
	//~ 
	
	if(unsafeWindow.getGCComment){
		var comment = unsafeWindow.getGCComment(geocache.guid);
		if(comment){
			geocache.comment = comment;
		}
	}
	var usernote = dojo.query('[id="cache_note"]',element)[0];
	if(usernote){
		geocache.cache_note = usernote.innerHTML;
	}
	
	
	// check availability
	var warning_element = dojo.query('ul[class="OldWarning"]',element)[0]; // contains text like
	//This cache is temporarily unavailable. Read the logs below to read the status for this cache.
	//This cache has been archived, but is available for viewing for archival purposes.
	
	if(warning_element){	
		if(warning_element.textContent.indexOf("archived") != -1){
			geocache.archived = true;
		} else {
			geocache.archived = false;
		}
		geocache.available = false;
	} else {
		geocache.available = true;
		geocache.archived = false;
	}
	

	var ownerDateTable = upper_tables[1];
	var ownerDateSpans = dojo.query('span',ownerDateTable);
	
	
	var cacheDetails = dojo.query('div[id="cacheDetails"]',element)[0];

	//~ geocache.hidden = trim(ownerDateSpans[1].textContent.split(':').pop());
	geocache.hidden = parseDate(trim(dojo.query('span',cacheDetails)[2].textContent.split(':').pop()));

	/* not in the latest version of gc.com
	// unfortnaly event caches has an other format - parse this also -
	// may unessesary after latest update - TODO
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
	}*/
	
	
	


/*	try{ // Old code - doesnt know why this try
		geocache.size = dojo.query('small',element)[2].textContent.split("(")[1].split(")")[0];
	} catch(e){
		geocache.size = dojo.query('small',element)[1].textContent.split("(")[1].split(")")[0];
	}
*/	
	geocache.difficulty = dojo.query('span[id="ctl00_ContentBody_uxLegendScale"] > img',element)[0].alt.split(" out of ")[0];
	geocache.terrain = dojo.query('span[id="ctl00_ContentBody_Localize6"] > img',element)[0].alt.split(" out of ")[0];


	geocache.size = trim(dojo.query('img[src*="/images/icons/container/"]',element)[0].alt.split(": ")[1]);


	geocache.coordinates = dojo.query('span[id="ctl00_ContentBody_LatLon"]',element)[0].innerHTML;
	geocache.lat = dojo.query('a[id="ctl00_ContentBody_lnkConversions"]',element)[0].href.split("lat=")[1].split("&")[0];
	geocache.lon = dojo.query('a[id="ctl00_ContentBody_lnkConversions"]',element)[0].href.split("lon=")[1].split("&")[0];
	

	// if the user changed the coordinates of an geocache
	if(GM_getValue('coords_'+geocache.gcid,"null") != "null"){ // use it
		var coordinates = GM_getValue('coords_'+geocache.gcid,"null");
		geocache.lat = coordinates.split("#")[0];
		geocache.lon = coordinates.split("#")[1];	
		
		geocache.coordinates = Dec2DM_String(geocache.lat, geocache.lon);
		
	}

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
		geocache.distance =  dojo.query('span[id="ctl00_ContentBody_lblDistFromHome"]',element)[0].textContent.replace(" from your home location","");
	} catch(e) {geocache.bearing = "";geocache.distance = "";} // if homecoordinates are not set
	
	geocache.inventory = dojo.query('ul > li > a > img', dojo.query('div[class="WidgetBody"]',element)[2]);
	
	geocache.attributes = dojo.query('div[class="CacheDetailNavigationWidget BottomSpacing"] >div > img',element);
	geocache.attributes_array = new Array();

	for (var attributes_i = 0; attributes_i < geocache.attributes.length; attributes_i++){
		// get current attribute image
		var attribute = geocache.attributes[attributes_i];
		
		//  remove garbage from source address und split it at the "-"
		var attribute_array = attribute.src.replace("http://www.geocaching.com/images/attributes/","").replace(".gif", "").split("-");
		
		// iterate over every attributes defined in the global attributes array
		for (var attributesDef_i = 0; attributesDef_i < attributes_array.length; attributesDef_i++){
			// ... and check whether the image is equal to the definition
			if(attribute_array[0] == attributes_array[attributesDef_i][1]){
				// add this attribute as array with id-0, image-1, name-2 and yes/no-4 
				geocache.attributes_array.push(new Array(attributes_array[attributesDef_i][0],attributes_array[attributesDef_i][1],attributes_array[attributesDef_i][2], ((attribute_array[1]=="yes")?1:0)));
			}
		}
	}
	
	
	geocache.short_description = dojo.query('span[id="ctl00_ContentBody_ShortDescription"]',element)[0];
	geocache.long_description = dojo.query('span[id="ctl00_ContentBody_LongDescription"]',element)[0];
	geocache.images = dojo.query('a[rel="lightbox"]',element);
	
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
		waypoint.prefix = trim(row1_tds[3].textContent);
		waypoint.lookup = trim(row1_tds[4].textContent);
		waypoint.name = row1_tds[5].childNodes[1].textContent;
		waypoint.coordinates = trim(row1_tds[6].textContent);
		waypoint.latitude = coordinates_array[0];
		waypoint.longitude = coordinates_array[1];		
		waypoint.note = trim(row2_tds[2].textContent);



		// Final Location				http://www.geocaching.com/images/wpttypes/sm/flag.jpg
		// Parking Area					http://www.geocaching.com/images/wpttypes/sm/pkg.jpg
		// Question to Answer 			http://www.geocaching.com/images/wpttypes/sm/puzzle.jpg
		// Stages of a Multicache		http://www.geocaching.com/images/wpttypes/sm/stage.jpg
		// Trailhead					http://www.geocaching.com/images/wpttypes/sm/trailhead.jpg
		// Reference Point				http://www.geocaching.com/images/wpttypes/sm/waypoint.jpg
		switch (waypoint.symbol) {
			case "http://www.geocaching.com/images/wpttypes/sm/flag.jpg":
				waypoint.symbol_groundspeak = "Final Location";
				waypoint.type_groundspeak = "Waypoint|Final Location";
				break;
			case "http://www.geocaching.com/images/wpttypes/sm/pkg.jpg":
				waypoint.symbol_groundspeak = "Parking Area";
				waypoint.type_groundspeak = "Waypoint|Parking Area";
				break;
			case "http://www.geocaching.com/images/wpttypes/sm/puzzle.jpg":
				waypoint.symbol_groundspeak = "Question to Answer";
				waypoint.type_groundspeak = "Waypoint|Question to Answer";
				break;
			case "http://www.geocaching.com/images/wpttypes/sm/stage.jpg":
				waypoint.symbol_groundspeak = "Stages of a Multicache";
				waypoint.type_groundspeak = "Waypoint|Stages of a Multicache";
				break;
			case "http://www.geocaching.com/images/wpttypes/sm/trailhead.jpg":
				waypoint.symbol_groundspeak = "Trailhead";
				waypoint.type_groundspeak = "Waypoint|Trailhead";
				break;
			case "http://www.geocaching.com/images/wpttypes/sm/waypoint.jpg":
				waypoint.symbol_groundspeak = "Reference Point";
				waypoint.type_groundspeak = "Waypoint|Reference Point";
				break;
			default:
				waypoint.symbol_groundspeak = "Unknown Type";
				waypoint.type_groundspeak = "Waypoint|Unknown Type";
				break;
			
		}
		
		
		
		geocache.additional_waypoints.push(waypoint);    
	}
	

	
	var hints_element = dojo.query('div[id="div_hint"]',element)[0];
	if(hints_element){
		geocache.hint = convertROTStringWithBrackets(trim(hints_element.textContent));
	} else {
		geocache.hint = "";
	}
	
	geocache.find_counts = dojo.query('span[id="ctl00_ContentBody_lblFindCounts"] > p ',element)[0];
	
	
	// hole den UserToken und benutze ihn um die Logs einzusammeln
	var userToken = element.innerHTML.split("userToken = '")[1].split("'")[0];
	geocache.logs = getAllLogs(userToken);
	
	
	
	
	/* old code - nicht mehr benötigt seit dem man die Logs mittels JSON abholen kann 
	var logs_td = dojo.query('table[class="LogsTable"] > tbody > tr > td',element);
	for(var log_i = 0;log_i < logs_td.length-1;log_i++){
		var log_object = new Object();
		
		
		// log
		//	from: "madd.in"
		//	type: "Found It", "Didn't find it", "Temporarily Disable Listing", "Write note", "Enable Listing",...
		//  text: "Netter Log eintrag."
		//	logdate: "August 18" oder "February 17, 2007"
		//	id: 12345679
		var log = logs_td[log_i];
		log_object.from = dojo.query('p[class="logOwnerProfileName"] > strong > a',log)[0].innerHTML;	
		log_object.typeImg = dojo.query('div[class="HalfLeft LogType"] > strong > img',log)[0];
		log_object.type = log_object.typeImg.alt;
		log_object.text = dojo.query('p[class="LogText"]',log)[0].innerHTML;
		log_object.logdate = parseDate(dojo.query("span[class='minorDetails LogDate']",log)[0].innerHTML);
		var log_uid = dojo.query("a:last-child",log)[0].href.split("=")[1]; // get the log id from the link
		log_object.id = parseInt(log_uid.replace(/-/g,""),16)%10000000; // and create a semi unique id
		
	/ * nicht genutzter Quelltext für die kurze umstellunge des Datums
		// bestimme den ungefähren tag des Logs
			// today
			// about a day ago
			// about 2 days ago
			// about 25 days ago
			// about a month ago
			// about 2 months ago
			// about a year ago
			// about 2 year ago
			var days = 0;
			var today = new Date();
			var p = new RegExp(/about (a|\d+) (day|month|year)/);
			var m = p.exec(dojo.query("span[class='minorDetails LogDate']",logs_td[0])[0].innerHTML);
			if(m != null){
				var quantity = (m[1] == "a")?1:m[1];
		
				switch (m[2]) {
					case "day": 
						days = quantity * 1;
						break;
					case "month": 
						days = quantity * 30;
						break;
					case "year": 
						days = quantity * 365;
						break;
				}

				

			} 
			var millisecs = days * 24 * 60 * 60 * 1000; // wenn regex nicht greift - dann wird das Datum auf den aktuellen Tag datiert - z.B. bei "today"
		log_object.date = new Date(today.getTime()-millisecs);
* /

		

		geocache.logs.push(log_object);
	} */
	
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


// holt bisher nur die ersten 100 Logs ab!
function getAllLogs(userToken){
	
	var totalPages = 1;
	var logs = [];
	
	for(var i = 1;i<= totalPages;i++){
		var req = new XMLHttpRequest();						
		var myUrl = 'http://www.geocaching.com/seek/geocache.logbook?tkn='+userToken+'&idx=1&num=100&decrypt=false';
		req.open("GET", myUrl, false);
		// execute the request synchron
		req.send(null);
		// after execution parse the result
		var log_obj =  JSON.parse(req.responseText);

		// füge alle ankommenden logs an das bestehende Array einfach hinten dran!
		logs = logs.concat(log_obj.data);
		
		
		// ein Log Obj sieht wir folgt aus:
		//~ LogID	189964204
		//~ CacheID	2071649
		//~ LogGuid	"f04c620c-7ec0-4e3d-840d-e887e8257a76"
		//~ Latitude	null
		//~ Longitude	null
		//~ LatLonString	""
		//~ LogType	"Found it"
		//~ LogTypeImage	"icon_smile.gif"
		//~ LogText	"Heute Vormittag konnten... ahhr, die Zwergpiraten"
		//~ Created	"10/02/2011"
		//~ Visited	"10/02/2011"
		//~ UserName	"Zwergpiraten"
		//~ MembershipLevel	1
		//~ AccountID	2455575
		//~ AccountGuid	"d0421737-e9ee-4a10-9c7e-be4ed9399d6d"
		//~ Email	""
		//~ AvatarImage	"c77832e3-6051-4c3b-a37d-113ca51acd14.jpg"
		//~ GeocacheFindCount	572
		//~ GeocacheHideCount	0
		//~ ChallengesCompleted	1
		//~ IsEncoded	false
		//~ creator	Object { GroupTitle="Member", GroupImageUrl="/images/icons/reg_user.gif"}
		//~ GroupTitle	"Member"	
		//~ GroupImageUrl	"/images/icons/reg_user.gif"
		//~ Images	[]
		//~ debug(logs[0].UserName);
		
		totalPages = log_obj.pageInfo.totalPages;
	}
	
	return logs;
}
function getGPXGeoCache(gcid){

	var geocache = new Object();
	var geocache_obj = getGeocache(gcid);
	
	if(geocache_obj === "pm only"){
		return geocache_obj;
	}
	
	
	var isGroundspeak = (GM_getValue("gpxschema",0) == 0);
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
	
	geocache.archived = (geocache_obj.archived)?"True":"False";
	geocache.available = (geocache_obj.available)?"True":"False";
		
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
			case "137": 
				geocache.cacheType = "Earthcache";
				break;
			case "453": 
				geocache.cacheType = "Event";
				break;
			default: 
				geocache.cacheType = "Other";
		  }	
	}

	
	geocache.attributes_array = geocache_obj.attributes_array;
	
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
	geocache.dateHidden = geocache_obj.hidden;
	
	geocache.logs = new Array();
	
	
	for(var i = 0; i<geocache_obj.logs.length;i++){
		var logObj = new Object();
		
		//	from: "madd.in"
		//	type: "Found It", "Didn't find it", "Temporarily Disable Listing", "Write note", "Enable Listing",...
		//  text: "Netter Log eintrag."
		//	logdate: "August 18" oder "February 17, 2007"
		//	id: 12345679
		
		var gc_log =  geocache_obj.logs[i];
		logObj.cacherName = gc_log.UserName;
		
		if(!isGroundspeak){
			switch (gc_log.LogType) {
				case "Found it":
				logObj.type = "Found";
				break;
			case "Didn't find it":
				logObj.type = "Not Found";
				break;
			case "Write note":
				logObj.type = "Note";
				break;
			default:
				logObj.type ="Other";
				break;	
			}
		} else {
			logObj.type = gc_log.LogType;
		}
				/*
		switch (gc_log.LogType) {
			case "Found it":
				logObj.type = (isGroundspeak)?"Found it":"Found";
				break;
			case "Didn't find it":
				logObj.type = (isGroundspeak)?"Didn't find it":"Didn't find it";
				break;
			case "Needs Maintenance":
				logObj.type = (isGroundspeak)?"Needs Maintenance":"Note";
				break;
			case "Needs Archived":
				logObj.type = (isGroundspeak)?"Needs Archived":"Note";
				break;
			case "Owner Maintenance":
				logObj.type = (isGroundspeak)?"Owner Maintenance":"Note";
				break;
			case "Post Reviewer Note":
				logObj.type = (isGroundspeak)?"Post Reviewer Note":"Note";
				break;
			case "Write note":
				logObj.type = (isGroundspeak)?"Write note":"Note";
				break;
			case "Temporarily Disable Listing":
				logObj.type = (isGroundspeak)?"Temporarily Disable Listing":"Note";
				break;
			case "Enable Listing":
				logObj.type = (isGroundspeak)?"Enable Listing":"Note";
				break;
			case "Unarchive":
				logObj.type = (isGroundspeak)?"Unarchive":"Note";
				break;
			case "Archive":
				logObj.type = (isGroundspeak)?"Archive":"Note";
				break;
			case "Publish Listing":
				logObj.type = (isGroundspeak)?"Publish Listing":"Note";
				break;
			case "Enable Listing":
				logObj.type = (isGroundspeak)?"Enable Listing":"Note";
				break;
			case "Update Coordinates":
				logObj.type = (isGroundspeak)?"Update Coordinates":"Note";
				break;
			default:
				logObj.type = (isGroundspeak)?"Write note":"Other";
				break;
			
		}*/
		debug("Logtype: "+gc_log.LogType+ " to GPX Type:"+logObj.type);
		logObj.foundDate = parseDate(gc_log.Created);
		logObj.content = gc_log.LogText;
		logObj.id = gc_log.LogID;
		
		
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
				'  <author>GCTour</author>'+
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
				if(geocache !== "pm only"){
					var logsStringArray = new Array();
					
					var logs =  geocache.logs;			
					// just 11 logs in the gpx
					for (var j = 0; (j < logs.length && j <= 10); j++){
						var geocacheLogMapping = new Array(
							 new Array('LOGID',logs[j].id),
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
							
					var parser = new DOMParser();
					var dom = parser.parseFromString(cacheWaypoint,
						"text/xml");
					var waypoint = dom.getElementsByTagName('wpt')[0];
					gpxElement.appendChild(waypoint);
					
					
					if(GM_getValue('gpxwpts',true)){
						for(var k = 0;k<geocache.additionalWaypoints.length;k++){
							
							if(geocache.additionalWaypoints[k].coordinates != "???"){
								var parser = new DOMParser();
								var dom = parser.parseFromString(getWaypointsGPXFromGeocache(geocache.additionalWaypoints[k],geocache),
									"text/xml");
								var waypoint = dom.getElementsByTagName('wpt')[0];
								gpxElement.appendChild(waypoint);	
							}
						}
					}
				} // pm only check
				
			
			} else { // costum marker check
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

	var gpxHeader = '<?xml version="1.0" encoding="utf-8"?>\n'+
				'<gpx xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" version="1.0" creator="GCTour" xsi:schemaLocation="http://www.topografix.com/GPX/1/0 http://www.topografix.com/GPX/1/0/gpx.xsd http://www.groundspeak.com/cache/1/0/1 http://www.groundspeak.com/cache/1/0/1/cache.xsd" xmlns="http://www.topografix.com/GPX/1/0">\n'+
				'	<name>'+currentTour.name+'</name>\n'+
				'	<desc>This is an individual cache generated from Geocaching.com</desc>\n'+
				'	<author>GCTour v'+version+'.'+build+'</author>\n'+
				'	<email>gctour@madd.in</email>\n'+
				'	<url>http://www.geocaching.com</url>\n'+
				'	<urlname>Geocaching - High Tech Treasure Hunting</urlname>\n'+
 				'	<time>'+ xsdDateTime(new Date()) +'</time>\n'+
 				'	<keywords>cache, geocache</keywords>\n'+
				'	<bounds minlat="##MINLAT##" minlon="##MINLON##" maxlat="##MAXLAT##" maxlon="##MAXLON##" />\n'+
				'##GEOCACHES##\n'+
				'##WAYPOINTS##\n'+
 				'</gpx>';		
		var geocacheTemplate =
				'	<wpt lat="##LAT##" lon="##LON##">\n'+
				'		<time>##TIME##</time>\n'+
				'		<name>##GCID##</name>\n'+
				'		<desc>##CACHENAME##</desc>\n'+
				'		<src>www.geocaching.com</src>\n'+
				'		<url>http://www.geocaching.com/seek/cache_details.aspx?wp=##GCID##</url>\n'+
				'		<urlname>##CACHENAME##</urlname>\n'+
				'		<sym>Geocache</sym>\n'+
				'		<type>Geocache|##TYPE##</type>\n'+
				'		<groundspeak:cache id="##CACHEID##" available="##AVAILABLE##" archived="##ARCHIVED##" xmlns:groundspeak="http://www.groundspeak.com/cache/1/0/1">\n'+
				'			<groundspeak:name>##CACHENAME##</groundspeak:name>\n'+
				'			<groundspeak:placed_by>##OWNER##</groundspeak:placed_by>\n'+
				'			<groundspeak:owner>##OWNER##</groundspeak:owner>\n'+
				'			<groundspeak:type>##TYPE##</groundspeak:type>\n'+
				'			<groundspeak:container>##CONTAINER##</groundspeak:container>\n'+
				'			<groundspeak:attributes>\n##ATTRIBUTES##			</groundspeak:attributes>\n'+
				'			<groundspeak:difficulty>##DIFFICULTY##</groundspeak:difficulty>\n'+
				'			<groundspeak:terrain>##TERRAIN##</groundspeak:terrain>\n'+
				'			<groundspeak:country>##COUNTRY##</groundspeak:country>\n'+
				'			<groundspeak:state>##STATE##</groundspeak:state>\n'+
				'			<groundspeak:short_description html="True">##SUMMARY##</groundspeak:short_description>\n'+
				'			<groundspeak:long_description html="True">##DESCRIPTION##</groundspeak:long_description>\n'+
				'			<groundspeak:encoded_hints>##HINT##</groundspeak:encoded_hints>\n'+					
				'			<groundspeak:logs>\n##LOGS##			</groundspeak:logs>\n'+
				'		</groundspeak:cache>\n'+
				'	</wpt>';
 		var geocacheLogTemplate =		
				'				<groundspeak:log id="##LOGID##">\n'+
				'					<groundspeak:date>##TIME##</groundspeak:date>\n'+
				'					<groundspeak:type>##LOGTYPE##</groundspeak:type>\n'+
				'					<groundspeak:finder>##CACHERNAME##</groundspeak:finder>\n'+
				'					<groundspeak:text>##LOGTEXT##</groundspeak:text>\n'+
				'				</groundspeak:log>\n';
		
		
		var gcStrArray = [];
		var wptStrArray = [];
		var minLat,minLon,maxLat,maxLon;
		
		
		for (var i = 0; i < currentTour.geocaches.length; i++){

			// iff the cancelbutton is presssed 
			if(GM_getValue("stopTask",false)){
				GM_setValue("stopTask",false);
				return "canceled"; // then return!
			}

			var costumMarker = (typeof(currentTour.geocaches[i].latitude) != "undefined");
			
			if(!costumMarker){		
				var geocache = getGPXGeoCache(currentTour.geocaches[i].id);
				if(geocache !== "pm only"){
					var logsStringArray = new Array();
					// create log with attributes!
					if(true){				
						
						for (var j = 0; (j < geocache.attributes_array.length); j++){
							attribute_a = geocache.attributes_array[j];
							GM_log(" id='"+attribute_a[0]+"' inc='"+attribute_a[3]+"' > "+attribute_a[2]);
						
						}
						/*
						var geocacheLogMapping = new Array(
							
							 new Array('LOGID',geocache.id), // Issue3
							 new Array('TIME',xsdDateTime(new Date())),
							 new Array('CACHERNAME',"GCTour"),
							 new Array('LOGTYPE', "Note"),
							 new Array('LOGTEXT',encodeHtml(logs[j].content))
						);
						
						var cacheWaypointLog = waypointLogTemplate;
					
						for(var k = 0 ; k<geocacheLogMapping.length ; k++){
							cacheWaypointLog = cacheWaypointLog.replace(new RegExp("##"+geocacheLogMapping[k][0]+"##","g"),geocacheLogMapping[k][1]);
						}
						
						logsStringArray.push(cacheWaypointLog);*/
					}
					
					debug("GS GPX: geocache.dateHidden:'"+geocache.dateHidden+"' -> xsd:'"+xsdDateTime(geocache.dateHidden)+"'");
					var logs =  geocache.logs;
					// just 11 logs in the gpx
					for (var j = 0; (j < logs.length && j <= 10); j++){
						var geocacheLogMapping = new Array(
												
							 new Array('LOGID',logs[j].id), // Issue3
							 new Array('TIME',xsdDateTime(logs[j].foundDate)),
							 new Array('CACHERNAME',encodeHtml(logs[j].cacherName)),
							 new Array('LOGTYPE',logs[j].type),
							 new Array('LOGTEXT',encodeHtml(logs[j].content))
						);
						
						var cacheWaypointLog = geocacheLogTemplate;
					
						for(var k = 0 ; k<geocacheLogMapping.length ; k++){
							cacheWaypointLog = cacheWaypointLog.replace(new RegExp("##"+geocacheLogMapping[k][0]+"##","g"),geocacheLogMapping[k][1]);
						}
						
						logsStringArray.push(cacheWaypointLog);
					}
					
					
					var attributesString = "";
					for (var j = 0; (j < geocache.attributes_array.length); j++){
						attributesString += getAttributeXML(geocache.attributes_array[j]);
					}
					
					var geocacheMapping = new Array(
						 new Array('LAT',geocache.latitude),
						 new Array('LON',geocache.longitude),
						 new Array('TIME',xsdDateTime(geocache.dateHidden)),
						 new Array('GCID',geocache.gcid),
						 new Array('CACHEID',geocache.cacheid),
						 new Array('AVAILABLE',geocache.available),
						 new Array('ARCHIVED',geocache.archived),
						 new Array('CACHENAME',encodeHtml(geocache.cacheName)),
						 new Array('OWNER',encodeHtml(geocache.cacheOwner)),
						 new Array('STATE',encodeHtml(geocache.state)),
						 new Array('COUNTRY',encodeHtml(geocache.country)),
						 new Array('TYPE', geocache.cacheType),					
						 new Array('CONTAINER',geocache.cacheSize),
						 new Array('ATTRIBUTES',attributesString),
						 new Array('DIFFICULTY',geocache.difficulty),
						 new Array('TERRAIN',geocache.terrain),
						 new Array('SUMMARY',encodeHtml(geocache.shortDescription)),
						 new Array('DESCRIPTION',encodeHtml(geocache.longDescription)),
						 new Array('HINT',encodeHtml(geocache.hint)),
						 new Array('LOGS',logsStringArray.join(""))
					);
					
					if(!maxLat){maxLat=geocache.latitude; minLat=geocache.latitude;maxLon=geocache.longitude; minLon=geocache.longitude;}
					
					maxLat = (maxLat < geocache.latitude)?geocache.latitude:maxLat;
					maxLon = (maxLon < geocache.longitude)?geocache.longitude:maxLon;
					minLon = (minLon > geocache.longitude)?geocache.longitude:minLon;
					minLat = (minLat > geocache.latitude)?geocache.latitude:minLon;
					
					
					var cacheWaypoint = geocacheTemplate;
					for(var j = 0 ; j<geocacheMapping.length ; j++){
						cacheWaypoint = cacheWaypoint.replace(new RegExp("##"+geocacheMapping[j][0]+"##","g"),geocacheMapping[j][1]);
					}	
					
					
					gcStrArray.push(cacheWaypoint);
					
					if(GM_getValue('gpxwpts',true)){
						for(var k = 0;k<geocache.additionalWaypoints.length;k++){
							
							if(geocache.additionalWaypoints[k].coordinates != "???"){
								
								
								wptStrArray.push(getWaypointsGPXFromGeocache(geocache.additionalWaypoints[k],geocache));
								//~ cacheWaypoint
								//~ 
								//~ var parser = new DOMParser();
								//~ var dom = parser.parseFromString(getWaypointsGPXFromGeocache(geocache.additionalWaypoints[k],geocache),
									//~ "text/xml");
								//~ var waypoint = dom.getElementsByTagName('wpt')[0];
								//~ gpxElement.appendChild(waypoint);	
							}
						}
					}
				} // pm only check
			
			} else { // costum marker check
				wptStrArray.push(getGPXfromMarker(currentTour.geocaches[i]));
					
			
				//~ var parser = new DOMParser();
				//~ var dom = parser.parseFromString(getGPXfromMarker(currentTour.geocaches[i]),
					//~ "text/xml");
				//~ var waypoint = dom.getElementsByTagName('wpt')[0];
				//~ gpxElement.appendChild(waypoint);	
			}
		setProgress(i,currentTour.geocaches.length,document);

		} // itertion end 
		//~ var str = new XMLSerializer().serializeToString(gpxDom);
		
		var str = gpxHeader;
			
		
		str = str.replace(new RegExp("##GEOCACHES##","g"),gcStrArray.join("\n"));
		
		str = str.replace(new RegExp("##WAYPOINTS##","g"),wptStrArray.join("\n"));
		str = str.replace(new RegExp("##MINLAT##","g"),minLat);
		str = str.replace(new RegExp("##MINLON##","g"),minLon);
		str = str.replace(new RegExp("##MAXLAT##","g"),maxLat);
		str = str.replace(new RegExp("##MAXLON##","g"),maxLon);
		
		//~ getKäse();
		return str;
}

function getAttributeXML(attribute_a){
	return "				<groundspeak:attribute id='"+attribute_a[0]+"' inc='"+attribute_a[3]+"'>"+attribute_a[2]+"</groundspeak:attribute>\n";
}

function getGPXfromMarker(marker){

	var gpx = 	'<wpt xmlns="http://www.topografix.com/GPX/1/0" lat="'+ marker.latitude +'" lon="'+ marker.longitude +'">\n';
	gpx += 		'	<time>'+ xsdDateTime(new Date()) +'</time>\n';
	gpx += 		'	<name>'+ encodeHtml(marker.name) +'</name>\n';
	gpx += 		'	<cmt>'+ encodeHtml(marker.content) +'</cmt>\n';
	gpx += 		'	<sym>'+ marker.symbol +'</sym>\n';
	gpx += 		'</wpt>\n';


	return gpx;
}

function getWaypointsGPXFromGeocache(waypoint,geocache){
    var waypointName = waypoint.prefix+geocache.gcid.replace(/GC/,'');
	var gpx = 	'<wpt xmlns="http://www.topografix.com/GPX/1/0" lat="'+ waypoint.latitude +'" lon="'+ waypoint.longitude +'">\n';
	gpx += 		'	<time>'+ xsdDateTime(geocache.dateHidden) +'</time>\n';
	gpx += 		'	<name>'+ encodeHtml(waypointName) +'</name>\n';
	gpx += 		'	<cmt>'+ encodeHtml(waypoint.note) +'</cmt>\n';
	gpx += 		'	<desc>'+ encodeHtml(waypoint.name) +'</desc>\n';
	gpx += 		'	<sym>'+ waypoint.symbol_groundspeak +'</sym>\n';
	gpx += 		'	<type>'+ waypoint.type_groundspeak +'</type>\n';
	gpx += 		'</wpt>\n';	

	return gpx;
}
function setLanguage(i){
	return function(){
		GM_setValue('language',i);
		window.location.reload();
	}
}

function setGPXSchema(value){
	return function(){
		GM_setValue('gpxschema',value);
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

function  setPrintMapType(mapType){
	return function(){
		GM_setValue('printOutlineMapType',mapType);
	}
}

function  setPrintMapSize(mapSize){
	return function(){
		GM_setValue('defaultMapSize',mapSize);
	}
}

function Settings(){
	setting_groups = 	new Array(
							new Array('language',this.getLanguage()),
							new Array('printview',this.getPrint()),
							new Array('settings_map',this.getMaps()),
							new Array('settingsGPX',this.getGPX())//,
						//	new Array('settingsSendToGPS',this.getLanguage()),
						//	new Array('settingsDownladGPX',this.getLanguage()),
						//	new Array('settingsUploadTour',this.getLanguage())
						);
}


Settings.prototype.show = function(){
	
	
	
	var overlayArray = getListOverlay({caption:lang['settings_caption']});
	
	
	var listUl = overlayArray[0];
	this.details = overlayArray[1];
	
	
	for(var header_i = 0; header_i < setting_groups.length;header_i++){
		var header = setting_groups[header_i][0];
		var contentFunction = setting_groups[header_i][1];
		
		
		
		var headerLi = createElement('li');append(headerLi,listUl);
			
		
		
		var settingsLink;
		settingsLink = createElement('a',{style:"cursor:pointer;font-size:12px;color:#003399",});
		settingsLink.setAttribute("setting", header_i);
		
		settingsLink.innerHTML = lang[header];
		//settingsLink.addEventListener('click',this.update(content,this.details,settingsLink,this.activeLink),false);
		settingsLink.addEventListener('click',this.update,true);
		
		settingsLink.setAttribute('contentFunction', contentFunction);
		settingsLink.setAttribute('header', header);
	
		append(settingsLink,headerLi);
			
	}
	
	
	this.details.innerHTML = "<h2 align='center'>"+lang['settings_caption']+"</h2>";
	
}


Settings.prototype.getGPX = function(){
	var div = createElement('div');


	// schema array
	var schema_arr = [{value:"0",caption:lang['settingsGPXSchemaGS']},{value:1,caption:lang['settingsGPXSchemaAU']}];	
		

	
	// schemata
	var schema_div = createElement('div',{style:"border-bottom: 1px solid;lightgray;margin-bottom:10px;"});append(schema_div,div);
	var schema_caption = createElement('span');append(schema_caption,schema_div);
	schema_caption.innerHTML = "<b>"+lang['settingsGPXSchema'];+"</b><br>";
	append(this.getSelectbox(schema_arr,'gpxschema',0,setGPXSchema),schema_caption);
	var description = createElement('div',{style:"margin-left:10px;"});
	description.innerHTML = lang['settingsGPXSchemaDesc'];
	
	append(description,schema_caption);

	append(this.getCheckbox('settingsGPXHtml', 'gpxhtml',true),div);
	append(this.getCheckbox('settingsGPXWpts', 'gpxwpts',true),div);
	append(this.getCheckbox('settingsGPXStripGC', 'gpxstripgc',false),div);

	return div;
}


Settings.prototype.getLanguage = function(){
	var div = createElement('div');


	var language_arr = [];
	for (var langi = 0; langi < languages.length; langi++){				

		var language_obj = {};
		language_obj.value = langi;
		language_obj.caption = languages[langi]['name'];
		
		language_arr.push(language_obj);
	}


	
	//languages
	var lang_div = createElement('div',{style:"border-bottom: 1px solid;lightgray;margin-bottom:10px;"});append(lang_div,div);
	var lang_caption = createElement('span');append(lang_caption,lang_div);
	lang_caption.innerHTML = "<b>"+lang['language'];+"</b><br>";
	append(this.getSelectbox(language_arr,'language',1,setLanguage),lang_caption);


	return div;
}

Settings.prototype.getMaps = function(){
	var div = createElement('div');
	
	// maptype
	var mapt_div = createElement('div',{style:"border-bottom: 1px solid;lightgray;margin-bottom:10px;"});append(mapt_div,div);
	var mapt_caption = createElement('span');append(mapt_caption,mapt_div);
	mapt_caption.innerHTML = "<b>"+lang['settingsMapType'];+"</b><br>";

	var typeArray = lang['mapTypes'];
	append(this.getSelectbox(typeArray,'printOutlineMapType','roadmap',setPrintMapType),mapt_caption);



	//map size
	var mapsi_div = createElement('div',{style:"border-bottom: 1px solid;lightgray;margin-bottom:10px;"});append(mapsi_div,div);
	var mapsi_caption = createElement('span');append(mapsi_caption,mapsi_div);
	mapsi_caption.innerHTML = "<b>"+lang['settingsMapSize'];+"</b><br>";

	var sizeArray = new Array('large','medium','small');
	append(this.getSelectbox(sizeArray,'defaultMapSize','large',setPrintMapSize),mapsi_caption);


	append(this.getCheckbox('settings_map_geocacheid', 'settings_map_geocacheid',true),div);
	append(this.getCheckbox('settings_map_geocachename', 'settings_map_geocachename',true),div);
	append(this.getCheckbox('settings_map_geocacheindex', 'settings_map_geocacheindex',true),div);
	append(this.getCheckbox('settings_map_awpts', 'settings_map_awpts',true),div);
	append(this.getCheckbox('settings_map_awpt_name', 'settings_map_awpt_name',true),div);
	append(this.getCheckbox('settings_map_awpt_lookup', 'settings_map_awpt_lookup',true),div);
	append(this.getCheckbox('settings_map_owpts', 'settings_map_owpts',true),div);
	append(this.getCheckbox('settings_map_owpt_name', 'settings_map_owpt_name',true),div);
	append(this.getCheckbox('settings_map_gcde', 'settings_map_gcde',false),div);
		
	
	return div;
}

Settings.prototype.getPrint = function(){
	var div = createElement('div');
	
	append(this.getCheckbox('settingsPrintMinimal', 'printMinimal',false),div);
	
	// number of logs
	var log_div = createElement('div',{style:"border-bottom: 1px solid;lightgray;margin-bottom:10px;"});
	
	var log_caption = createElement('span');
	append(log_caption,log_div);
	log_caption.innerHTML = "<b>"+lang['settingsLogCount'];+"</b><br>";

	var log_button_div = createElement('div',{style:"margin-left:10px"});

	var exportRadioNone = document.createElement('input');
	var exportRadioNoneText = document.createElement('font');
	exportRadioNone.type = 'radio';
	exportRadioNone.name = 'logcount';
	exportRadioNoneText.innerHTML = lang['settingsLogCountNone'];
	exportRadioNone.addEventListener('click', function(){GM_setValue('maxPrintLogs',0);},false);
	
	
	var exportRadioAll = document.createElement('input');
	var exportRadioAllText = document.createElement('font');
	exportRadioAll.type = 'radio';
	exportRadioAll.name = 'logcount';
	exportRadioAllText.innerHTML = lang['settingsLogCountAll'];
	exportRadioAll.addEventListener('click', function(){GM_setValue('maxPrintLogs',-1);},false);
	
	
	var exportRadioCount = document.createElement('input');	
	var exportRadioCountText = document.createElement('font');
	exportRadioCount.type = 'radio';
	exportRadioCount.name = 'logcount';
	exportRadioCountText.innerHTML = lang['settingsLogCountShow'];	
	
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
			if(!check) // highlight if something is wrong
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

	if(GM_getValue('maxPrintLogs',3) == 0){
		exportRadioNone.checked = 'checked';
	}else if ( GM_getValue('maxPrintLogs',3) <= -1){
		exportRadioAll.checked = 'checked';
	}else{
		exportText.value = GM_getValue('maxPrintLogs',3);
		exportRadioCount.checked = 'checked';

	}

	log_button_div.appendChild(exportRadioNone);
	log_button_div.appendChild(exportRadioNoneText);
	log_button_div.appendChild(exportRadioAll);
	log_button_div.appendChild(exportRadioAllText);
	log_button_div.appendChild(exportRadioCount);
	log_button_div.appendChild(exportText);
	log_button_div.appendChild(exportRadioCountText);
	append(log_button_div,log_caption);
	append(log_div,div);

	//fontsize
	var  font_div = createElement('div',{style:"border-bottom: 1px solid;lightgray;margin-bottom:10px;"});
	
	var font_caption = createElement('span');
	append(font_caption,font_div);
	font_caption.innerHTML = "<b>"+lang['settingsFontSize'];+"</b><br>";
	
	var sizeArray = new Array("xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large");
	append(this.getSelectbox(sizeArray,'printFontSize','x-small',setPrintFontSize),font_caption);
	
	append(font_div,div);
	

	
	
	append(this.getCheckbox('settingsDecryptHints', 'decryptPrintHints',true),div);
	append(this.getCheckbox('settingsEditDescription', 'printEditMode',false),div);
	append(this.getCheckbox('settingsShowSpoiler', 'printSpoilerImages',true),div);
	append(this.getCheckbox('settingsAdditionalWaypoints', 'printAdditionalWaypoints',true),div);
	append(this.getCheckbox('settingsLoggedVisits', 'printLoggedVisits',false),div);
	append(this.getCheckbox('settingsPageBreak', 'printPageBreak',false),div);
	append(this.getCheckbox('settingsPageBreakAfterMap', 'printPageBreakAfterMap',true),div);
	append(this.getCheckbox('settingsFrontPage', 'printFrontpage',true),div);
	append(this.getCheckbox('settingsOutlineMap', 'printOutlineMap',true),div);
	append(this.getCheckbox('settingsOutlineMapSinge', 'printOutlineMapSingle',true),div);
	
	// default map

	return div;
}

Settings.prototype.getHeader = function(header){
	var div = createElement('div');
	div.innerHTML = "<h2 align='center'>"+header+"</h2>";
	return div;
}



Settings.prototype.getCheckbox = function(caption_lang, gmValue, dValue, isShort){
	var cb_span = createElement('div',{style:"border-bottom: 1px solid;lightgray;margin-bottom:10px;padding-bottom:3px;"});

	var cb = createElement('input',{type:'checkbox',style:'float:right'});append(cb,cb_span);
	cb.checked = GM_getValue(gmValue,dValue);
	cb.addEventListener('click',toggleBoolValue(gmValue,dValue), false);

	
	
	
	var cb_caption = createElement('span');
	append(cb_caption,cb_span);
	cb_caption.innerHTML = "<b>"+lang[caption_lang]+"</b>";
	if (!isShort) cb_caption.innerHTML += "<br/><div style='margin-left:10px'>"+lang[caption_lang+'Desc']+"</div>";
	
	
	return cb_span;
}


Settings.prototype.getSelectbox = function(value_array, gmValue, dValue, click_function){
	var select = document.createElement("select");
	select.style.width = "90%";
	select.style.margin = "0 5%";
	select.style.marginBottom = "5px";


	for(var array_i = 0; array_i<value_array.length; array_i++){
		var option = document.createElement("option");select.appendChild(option);
		
		var value = (typeof value_array[array_i] == "object")?value_array[array_i].value:value_array[array_i];
		var caption = (typeof value_array[array_i] == "object")?value_array[array_i].caption:value_array[array_i];

		option.value = value;
		option.innerHTML = caption;

		if (GM_getValue(gmValue,dValue) == value)
			option.selected = 'selected';

		option.addEventListener('click', click_function(value), false);	

	}
	
	return select;
}




Settings.prototype.update = function(e) {
	var linkElement = e.target;

	// remove last active menu entry
	if(Settings.prototype.activelink){try{dojo.removeClass(Settings.prototype.activelink.parentNode, "activeTour");}catch(e){} }

	
	// set the current entry to active
	dojo.addClass(linkElement.parentNode, "activeTour");

	Settings.prototype.activelink = linkElement;

	
	var details = document.getElementById('dialogDetails');

	details.innerHTML = "";
	
	// search for the right group
	for(var i = 0; i<setting_groups.length;i++){
		if(setting_groups[i][0]  == linkElement.getAttribute('header')){
			details.appendChild(setting_groups[i][1]); // and call the function for it
			details.scrollTop=0;
		}
	}
	
}


// autoTour gui

function showAutoTourDialog(center,radius){
    var overLay, queryFilterDiv;

	if(!userName){
		alert(lang['notLogedIn']);
		return;
	}


	overLay = getOverlay({caption:lang['autoTour'],minimized:true});
	overLay.appendChild(getCoordinatesTab());
	
	var autoTourContainer = createElement('div',{id:'autoTourContainer',style:'clear:both;border-top:2px dashed #B2D4F3;margin-top:30px;'});
	autoTourContainer.style.display = 'none';
	
	autoTourContainer.appendChild(getMapPreviewTab());	
	queryFilterDiv = document.createElement('div');append(queryFilterDiv,autoTourContainer);
	queryFilterDiv.appendChild(getTypeFilter());
	queryFilterDiv.appendChild(getSizeFilter());
	queryFilterDiv.appendChild(getDtFiler('Difficulty'));
	queryFilterDiv.appendChild(getDtFiler('Terrain'));
	queryFilterDiv.appendChild(getSpecialFilter());
	autoTourContainer.appendChild(getAutoTourSubmit());
	
	
	overLay.appendChild(autoTourContainer);

	if(center && radius){

		dojo.query("input[id='markerCoords']")[0].value = center.lat() +' '+center.lng();
		dojo.query("input[id='markerRadius']")[0].value = radius;
		getMarkerCoord()();
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



function getSpecialFilter(){
	var specialDiv = document.createElement('div');
	specialDiv.style.cssFloat = "left";	
	specialDiv.style.paddingRight = "10px";
	specialDiv.style.textAlign = "left";
	specialDiv.innerHTML = "<b>That</b><br/>";


	var specials = ['I haven\'t found ','is Active', 'is not a PM cache'];

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
	var sizes = ['micro','small','regular','large','other'];

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
	var coordsDiv = createElement('div',{style:"clear:both"});
	coordsDiv.id = 'coordsDiv';
	coordsDiv.align = "left";
	
	var findMeButton = getLocateMeButton();
	findMeButton.style.cssFloat = 'right';
	append(findMeButton,coordsDiv);
	

	var divEbene = createElement('div', {className: 'ebene'});

	divEbene.innerHTML = '<b>'+lang["autoTourCenter"]+'</b>&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" id="markerCoords"><br/>\
						<small>'+lang['autoTourHelp']+'</small>';
						
	append(divEbene, coordsDiv);

	divEbene = createElement('div', {className: 'ebene'});
	divEbene.innerHTML = '<b>'+lang["autoTourRadius"]+'</b>&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" id="markerRadius" maxlength="4" style="width:50px;margin-right:5px"><select id="markerRadiusUnit"><option selected="selected" value="km">'+lang["kilometer"]+'</option><option value="sm">'+lang["mile"]+'</option></select>';
	append(divEbene, coordsDiv);
	
	divEbene = createElement('div');
	divEbene.setAttribute('class','dialogFooter');
	
	
	var useButton = createElement('input',{type:"button",value:lang["autoTourRefresh"],style:"background-image:url("+autoTourImage+")"});append(useButton,divEbene);
	useButton.addEventListener('click',getMarkerCoord() ,false);
	
	append(divEbene, coordsDiv);

	return coordsDiv;
}

function getMapPreviewTab(){
	var coordsDiv = createElement('div');
	coordsDiv.align = "left";
	coordsDiv.style.clear = "both";

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

	//~ staticGMap.style.border = '2px solid gray';
	//~ staticGMap.style.backgroundImage = "url("+previewImage+")";
	//~ staticGMap.style.backgroundPosition = "center";
	//~ staticGMap.style.backgroundRepeat = "no-repeat";
//~ 
	//~ staticGMap.style.height = '200px';
	//~ staticGMap.style.width = '400px';
	//~ staticGMap.style.backgroundRepeat = 'no-repeat';

	coordsDiv.appendChild(staticGMap);

	var cacheCountLabel = createElement('div');append(cacheCountLabel, coordsDiv);
	cacheCountLabel.innerHTML = lang["autoTourCacheCounts"]+"<b id='markerCountPreview'>???</b>"
		var tourDurationLabel = createElement('div');append(tourDurationLabel, coordsDiv);
	tourDurationLabel.innerHTML = lang['autoTourDuration']+"<b id='markerDurationMin'>???</b>min<b id='markerDurationSec'>???</b>sec"

		return coordsDiv;
}

function getLocateMeButton(){
	var button = createElement('button',{style:"margin-left:10px;font-size:12px"});
	button.innerHTML = "<img id='locateImage' src='"+locateMeImage+"'><span style='vertical-align:top;margin-left:3px;font-weight:bold'>"+lang['findMe']+"</span>";

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

// waypoint projecting
function CalcPrjWP(lat,lon, dist, angle)
{  
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

	//make the container visible
	dojo.byId('autoTourContainer').style.display = 'block';

	var radiusOrg = dojo.query("input[id='markerRadius']")[0].value;
	if(isNaN(radiusOrg) || radiusOrg == "")// please break if radius is no number
		return;


	var meterMiles = dojo.query("select[id='markerRadiusUnit']")[0].selectedIndex;
	// meter: meterMiles == 0		miles: meterMiles == 1
	var radiusMiles = (meterMiles==1)?parseFloat(radiusOrg):parseFloat(radiusOrg)*0.621371;

	if(radiusMiles == "")
		return;

	var staticGMap = dojo.query('div[id="staticGMap"]')[0];
	staticGMap.innerHTML = "";
	var staticMapppppp = new StaticMap(staticGMap,{'lat':lat,'lon':lon,radius:radiusMiles,width:470});
	

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
	backgroundColor:   { start: "#FFE000", end: "#FFFFFF" }
	}
	}).play();
	dojo.animateProperty(
			{
	node: "markerRadiusPreview",duration: 1000,
	properties: {
	//~ color:         { start: "black", end: "white" },
	backgroundColor:   { start: "#FFE000", end: "#FFFFFF" }
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

			var pagesSpan = dojo.query("td[class='PageBuilderWidget']",dummyDiv)[0];
			
			if(pagesSpan){
				dojo.query("b[id='markerCountPreview']")[0].innerHTML = pagesSpan.getElementsByTagName('b')[0].innerHTML;

				dojo.animateProperty({
					node: "markerCountPreview",duration: 1000,
					properties: {backgroundColor:   { start: "#FFE000", end: "#FFFFFF" }}
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
					properties: {backgroundColor:{ start: "#FF0005", end: "#FFFFFF" }}
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
// usefull snippet to escape HTML
/*  String.prototype.escapeHTML = function() {
    return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }*/

// setting hashcode to all strings
String.prototype.hashCode = function(){
	var hash = 0;
	if (this.length == 0) return code;
	for (i = 0; i < this.length; i++) {
		character = this.charCodeAt(i);
		hash = 31*hash+character;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}

String.prototype.endsWith = function(str)
{return (this.match(str+"$")==str)}

// init the whole script - started with dojo
initDojo();

// init the core components (first tour, current tour)
initCore();	

// check for updates
update();

// test for firefox >= 3.5
if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){ //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
 var ffversion=new Number(RegExp.$1) // capture x.x portion and store as a number
 if (ffversion < 3.5){
    alert("Sorry, but you are running 'Firefox "+ffversion+"' which is not supported anymore.\nPlease update to 'Firefox 3.5' or above to use GCTour!");
 }
}
