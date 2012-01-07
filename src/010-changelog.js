/*
 * Changelog:
 *
 * version @version@.@build@
 *   - FIXED: printview -> Bug with GCComment version
 *   - FIXED: searchpage in-use with Userscript GCVote
 *
 * version 2.2.12003
 *   - FIXED: GPX -> ALL caches were either not found or found
 *   - FIXED: printview -> Unsupported type for GM_setValue (Your Account Details -> Date Format)
 *
 * version 2.2.12002
 *   - FIXED: Map issues
 *   - FIXED: Upload Tour
 *   - FIXED: exception SyntaxError JSON.parse unexpected character by download tour
 *   - FIXED: exception TypeError progressBar is undefined
 *   - FIXED: function getlogs
 *   - FIXED: GPX found Caches from "<sym>Geocache</sym>" to "<sym>Geocache Found</sym>" (big thanks to Vasek)
 *   - UPDATED: French translation - thanks pascal
 *   - UPDATED: css adjustments
 *   - NEW: Map height is now variable
 *   - REMOVED: geocaching.com.au Type -> Groundspeak is now the only GPX Type
 *
 * version 2.1.11313
 *   - FIXED: GPX Download bug "...ctl00_hlSignOut... is undefined"
 *   - FIXED: Issue 18
 *   - FIXED: Update bug
 *   - NEW: Update added link in the error-Dialog
 *   - NEW: User can write a message in the error-Dialog
 *
 * version 2.1.11293
 *   - FIXED: <=3 Logs in printout -> "Last4Logs" (L4L) in the printout
 *   - FIXED: Logs in GPX (Unicode hexadez.)
 *   - UPDATED: dutch translation
 *   - Add jQuery (1.6.4) and jQuery-ui (1.8.16)
 *
 * version 2.1.11285
 *   - FIXED: autoTour
 *   - FIXED: GCTour on the search page
 *   - FIXED: Logs in printout
 *   - FIXED: Logs in GPX
 *   - UPDATED: french translation
 *   - GPX: New Groundspeak implementation to prevent XML errors
 *   - NEW: Titlepage in the printview now contains coordinates and basic informations
 *   - NEW: printview contains now the PM cache note!
 *   - NEW: delete button for current tour
 *   - NEW: "Last4Logs" (L4L) has been added to the printout - similar to http://www.gsak.net/help/hs11980.htm
 *
 * version 2.0.11280
 *   - FIXED: silent update changes from gc.com
 *
 * version 2.0.11239
 *   - FIXED: GPX bug
 *
 * version 2.0.11206
 *   - FIXED: GPX bug after gc.com update
 *   - FIXED: Printview after gc.com update
 *
 * version 2.0.11158
 *   - FIXED: scrollbar bug Firefox 3.6
 *   - FIXED: "Search For Geocaches" page in Firefox 3.6
 *   - FIXED: Bug with new GCComment version
 *   - FIXED: bug in popup after uploading an tour
 *   - UPDATED: french translation
 *
 * version 2.0.11158
 *   - FIXED: Event-Cache bug
 *   - FIXED: Printout need some work
 *   - FIXED: Update dialog bug
 *   - FIXED: autoTour dialog
 *   - FIXED: Layout modifications from gc.com
 *   - FIXED: autoTour find now earthcaches
 *   - FIXED: own waypoints coordinates were sometimes wrong rounded
 *   - GPX: Logs does now have an unique id
 *   - GPX: Archived/Unavailable geocaches are marked so
 *   - MAP: Tweak code on the map site. The use of the map will now be much faster.
 *   - NEW: Coordinates of geocaches can now be moved.
 *   - NEW: Added a dialog to send me a message.
 *   - NEW: Geocaches can now printed directly from their detailspage
 *   - NEW: Tour upload has been completly redesigned
 *   - NEW: Support for the new beta Maps
 *   - NEW: Dutch translation (thanks to searchjaunt)
 *   - NEW: Portuguese translation (thanks to Ruben)
 *   - NEW: French translation (thanks to flashmoon)
 *   - NEW: Added support for all GC.com date formats
 *   - NEW: GCComment print view implementation
 *   - ... and much more i already forgot
 *
 * version 1.97.11033
 *   - FIXED: gccom layout change.
 *
 * version 1.97.10361
 *   - FIXED: autotour with new OCR program
 *   - FIXED: GPX/Print now contains correct hidden date
 *   - FIXED: geocaches lists now are shown correctly again
 *   - NEW: Google-Appengine program to decode D/T/Size images
 *
 * version 1.97.10356
 *   - FIXED: GCTour is now working after gc.com update #2
 *
 * version 1.97.10313
 *   - FIXED: GCTour is now working after gc.com update
 *
 * version 1.97
 *   - GPX: add <groundspeak:name> to GPX
 *   - GPX: Additional Waypoints now named - Waypoint.Prefix + (GCID without leading GC)
 *   - GPX: changed Groundspeak "Multi-Cache" to "Multi-cache"
 *   - GPX: fixed earthcache type
 *   - GPX: changed log id to a usable value - Issue3
 *   - GPX: added attributes to Groundspeak GPX
 *   - FIXED: caches can remain in watchlist without error
 *   - FIXED: that a tour remains in list after deleting
 *   - FIXED: autoTour is working after update 7/28/10
 *   - FIXED: superscript text is now shown correct in printview
 *   - NEW: Bookmark Lists now have "add to tour" buttons
 *   - NEW: Tour can now sorted via drag n' drop
 *   - NEW: Add check on Firefox >= 3.5
 *   - NEW: Minimal-printview containing cacheheader, hint and spoiler images
 *   - NEW: Recode the complete update routine
 *   - NEW: Add check whether the script is still logged on when scraping data
 *   - CHANGED: Renew the buttons
 *   - MISC: Code Review
 *   - MISC: Create repository at http://code.google.com/p/gctour/
 *   - MISC: Start implementing http://gctour-spot.appspot.com/
 *
 * version 1.96
 *   - gc.com layout update 6/29/10 fixed
 *   - new groundspeak GPX implementation
 *   - close-window-button get a function in printview
 *   - removing annoying debug messages on maps
 *   - add an check after 20sec if gctour is loaded - important for no script users
 *   - caches on printview are now numbered
 *   - own waypoints are now uploaded again
 *   - tour uploads had now a map on gctour.madd.in
 *   - autoTour gets an option to filter PM-Only caches
 *   - update to dojo 1.4
 *
 * version 1.95
 *   - gc.com layout fixes
 *   - repair the "add selected caches"-to-tour button
 *
 * version 1.94
 *   - hints are now in the printout again
 *
 * version 1.93
 *   - fixed major functions after layout update
 *   - new code for the printview
 *   - remove the download-complete-map-button from maps page - please use autotour instead
 *   - some minor bugfixes
 *
 * version 1.92
 *   - add gpx option - old groundspeak schema or new geocaching.com.au schema
 *   - autoTour now part of GcTour
 *   - GUI improvements - now every tab is up-to-date
 *   - strip 'GC'-Option for GPX-Files
 *   - add OSM-Maps to the overview maps
 *   - append OSM and Topo Germany to default Maptype-Option
 *
 * version 1.91
 *   - Fast GPX-File bugfix! Type of caches is now correctly set!
 *
 * version 1.9
 *   - New-GcTour-GPX with geocaching.com.au/opencaching.de schema! Contains now logs and description for _ALL_ users.
 *   - Add dojo to make some DOM operations MUCH faster. Printview e.g. is now MUCH faster.
 *   - GUI improvments
 *   - Attributes are now shown in the printview
 *
 * version 1.85
 *   - fixed bug that own marker have wrong coordinates in printview
 *   - redesign of the cache list
 *   - redesign of "create new marker"-dialog
 *   - adding preview map to "create new marker"-dialog
 *   - adding "move to top/bottom" button to cache list - thanks to adam r
 *   - adding map size control in printview maps
 *
 * version 1.8
 *   - adding overview page to printpage
 *   - creating map with all caches on it
 *   - outline map for every cache + additional waypoints
 *   - adding costum waypoints
 *   - the GPX contains now the current date
 *   - adding information button to show which cache is in tour before loading
 *
 * version 1.7
 *   - adding upload feature
 *   - removed bug, that gctour is not able to handle multiple tabs
 *   - implement sorting
 *   - adding text size option for the printview
 *
 * version 1.6
 *   - fixed downloaded gpxfile - html-/ no-html-mode
 *   - add some fancy sliding effects
 *   - add multiple tour function
 *   - add trackables to printview
 *   - some minor bugfix (e.g. extended table on gc.com map)
 *
 * version 1.5
 *   - add download GPX-button
 *   - add additional waypoints to printview
 *   - add an add all button to the map. thx atornedging
 *   - fixed some mutated vowel bugs in GPX
 *   - tweak update function
 *   - adding changelog to updatedialog
 *
 * version 1.4
 *   - fixing bug, that premiummembers dont have coordinates in the printview
 *   - adding logcounter to printview
 *
 * version 1.3
 *   - adding buttons to the search tables
 *   - progress is now displayed in the print view and GPS Export
 *   - adding language support
 *
 * version 1.2
 *   - optimizing printview
 *   - add the possibility to export the spoiler images to the printview
 *   - add an add-to-tour-button in the GC-Table on the right side of the map view
 *   - fixed minor bug in the settings
 *
 * version 1.1
 *   - extended printview - it is now possible export logs and remove images/logs
 *   - update function is now working ...
 *
 * version 1.0
 *   - initial release
 *
 */
