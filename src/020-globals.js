// globals
var 
	VERSION    = "@version@", // will be checked once the day
	BUILD      = "@build@",      // will be checked once the day
	SCRIPTID   = 'gctour',
	DEBUG_MODE = true,
	API_HOST = 'http://localhost/gctour',
	GCTOUR_HOST = 'http://localhost',
	//~ API_HOST = 'http://gctour-spot.appspot.com/api',
	//~ GCTOUR_HOST = 'http://gctour-spot.appspot.com',

	// setze $ mit jQuery local (Greasemonkey)
	$ = window.jQuery,

	// is jQuery und UI geladen
	isjQuery = (
		(typeof $ !== "undefined") && (typeof $ === "function") &&
		(typeof $.fn === "object") && (typeof $.ui === "object")
	),

	isJSON = (
		(typeof JSON === "object") &&
		(typeof JSON.parse === "function") &&
		(typeof JSON.stringify === "function")
	),

	// const isFF = (((isjQuery === true) && $.browser.mozilla) || (typeof ???? !== "undefined")),
	isOpera = (((isjQuery === true) && $.browser.opera) || (typeof opera !== "undefined")),

	tours,
	currentTour,
	userName,
	dojoPath = "http://o.aolcdn.com/dojo/1.6",
	head = document.getElementsByTagName('head')[0],
	dojo,
	rot13array,
	timeout,
	sticky = GM_getValue('sticky', false),

	wptArray = [
		{wptTypeId: "2",    hash: "32bc9333-5e52-4957-b0f6-5a2c8fc7b257", name: "Traditional Cache"},
		{wptTypeId: "3",    hash: "a5f6d0ad-d2f2-4011-8c14-940a9ebf3c74", name: "Multi-cache"},
		{wptTypeId: "8",    hash: "40861821-1835-4e11-b666-8d41064d03fe", name: "Unknown Cache"},
		{wptTypeId: "5",    hash: "4bdd8fb2-d7bc-453f-a9c5-968563b15d24", name: "Letterbox Hybrid"},
		{wptTypeId: "11",   hash: "31d2ae3c-c358-4b5f-8dcd-2185bf472d3d", name: "Webcam Cache"},
		{wptTypeId: "4",    hash: "294d4360-ac86-4c83-84dd-8113ef678d7e", name: "Virtual  Cache"},
		{wptTypeId: "1858", hash: "0544fa55-772d-4e5c-96a9-36a51ebcf5c9", name: "Wherigo Cache"},
		{wptTypeId: "137",  hash: "c66f5cf3-9523-4549-b8dd-759cd2f18db8", name: "Earthcache"},
		{wptTypeId: "6",    hash: "69eb8534-b718-4b35-ae3c-a856a55b0874", name: "Event Cache"},
		{wptTypeId: "13",   hash: "57150806-bc1a-42d6-9cf0-538d171a2d22", name: "Cache In Trash Out Event"},
		{wptTypeId: "3653", hash: "3ea6533d-bb52-42fe-b2d2-79a3424d4728", name: "Lost and Found Event Cache"},
		{wptTypeId: "453",  hash: "69eb8535-b718-4b35-ae3c-a856a55b0874", name: "Mega-Event Cache"}
	],

	attributes_array = [
		// Attribute array ID, image, name
		['1','dogs','Dogs'],
		['2','fee','Access or parking fee'],
		['3','rappelling','Climbing gear'],
		['4','boat','Boat'],
		['5','scuba','Scuba gear'],
		['6','kids','Recommended for kids'],
		['7','onehour','Takes less than an hour'],
		['8','scenic','Scenic view'],
		['9','hiking','Significant hike'],
		['10','climbing','Difficult climbing'],
		['11','wading','May require wading'],
		['12','swimming','May require swimming'],
		['13','available','Available at all times'],
		['14','night','Recommended at night'],
		['15','winter','Available during winter'],
		['17','poisonoak','Poison plants'],
		['18','snakes','Snakes'],
		['19','ticks','Ticks'],
		['20','mine','Abandoned mines'],
		['21','cliff','Cliff / falling rocks'],
		['22','hunting','Hunting'],
		['23','danger','Dangerous area'],
		['24','wheelchair','Wheelchair accessible'],
		['25','parking','Parking available'],
		['26','public','Public transportation'],
		['27','water','Drinking water nearby'],
		['28','restrooms','Public restrooms nearby'],
		['29','phone','Telephone nearby'],
		['30','picnic','Picnic tables nearby'],
		['31','camping','Camping available'],
		['32','bicycles','Bicycles'],
		['33','motorcycles','Motorcycles'],
		['34','quads','Quads'],
		['35','jeeps','Off-road vehicles'],
		['36','snowmobiles','Snowmobiles'],
		['37','horses','Horses'],
		['38','campfires','Campfires'],
		['39','thorn','Thorns'],
		['40','stealth','Stealth required'],
		['41','stroller','Stroller accessible'],
		['42','firstaid','Needs maintenance'],
		['43','cow','Watch for livestock'],
		['44','flashlight','Flashlight required'],
		['45','landf','Lost and Found Tour'],
		['47','field_puzzle','Field Puzzle'],
		['48','UV','UV Light required'],
		['49','snowshoes','Snowshoes'],
		['50','skiis','Cross Country Skis'],
		['51','tools','Special Tool required'],
		['52','nightcache','Night Cache'],
		['53','parkngrab','Park and grab'],
		['54','abandonedbuilding','Abandoned structure'],
		['55','hike_short','Short hike'],
		['56','hike_med','Medium Hike'],
		['57','hike_long','Long Hike'],
		['58','fuel','Fuel nearby'],
		['59','food','Food nearby']
	];

/*
**************************
*     TEST Anfang
*/
/*
			// TEST wir als 3. ausgeführt
			jQuery(function($){
				alert("3. jQuery(function($){: " + $.fn.jquery);
			});

			// TEST wir als 2. ausgeführt
			unsafeWindow.jQuery(function($){
				alert("2. unsafeWindow.jQuery(function($){: " + $.fn.jquery);
			});

			// TEST wir als 1. ausgeführt
			alert("0 $: " + $.fn.jquery);

*/
/*
**************************
*     TEST ENDE
*/
