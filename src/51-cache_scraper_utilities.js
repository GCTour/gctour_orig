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
