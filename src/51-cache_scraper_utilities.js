function parse_coordinates(coords_string){
		// coordinates regex 'N 51� 18.795 E 012� 24.437'

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