/* 
 * Changelog:
 *
 * version 1.97
 *		- GPX: add <groundspeak:name> to GPX
 *      - GPX: Additional Waypoints now named - Waypoint.Prefix + (GCID without leading GC)
 *      - GPX: changed Groundspeak "Multi-Cache" to "Multi-cache"
 *		- FIXED: caches can remain in watchlist without error  
 *		- FIXED: that a tour remains in list after deleting
 *		- FIXED: autoTour is working after update 7/28/10
 *      - NEW: Bookmark Lists now have "add to tour" buttons
 *      - NEW: Tour can now sorted via Drag n' Drop
 * 		- NEW: Add check on Firefox >= 3.5
 *      - MISC: Code Review
 * 		- MISC: Create repository at http://code.google.com/p/gctour/
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
