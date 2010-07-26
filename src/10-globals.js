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
    wptArray,
    rot13array;


wptArray = [
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
