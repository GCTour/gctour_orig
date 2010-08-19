// globals
const version="1.96" // will be checked once the day
const scriptId = 'gctour'; 
const DEBUG = true;


var tours,
    currentTour,
    userName,
    lang,lang_ger,lang_eng,languages, // the language file
    dojoPath = "http://o.aolcdn.com/dojo/1.5",
    head = document.getElementsByTagName('head')[0],
    dojo,
    wptArray, attributes,
    rot13array;


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


attributes  = new Array(
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
	new Array('48','uv','UV Light required'),
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