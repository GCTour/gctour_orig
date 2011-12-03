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

function Settings(settings){
	this.settingsBin_ = settings;
}

Settings.prototype.get = function(index){
	if(this.settingsBin_.charAt(index-1) == 1){
		return true;
	} else {
		return false;
	}
}


Settings.prototype.showGCID = function(index){
	return this.get(1);
}

Settings.prototype.showGCName = function(index){
	return this.get(2);
}

Settings.prototype.showWPTs = function(index){
	return this.get(3);
}

Settings.prototype.showWPTName = function(index){
	return this.get(4);
}

Settings.prototype.showWPTLookup = function(index){
	return this.get(5);
}

Settings.prototype.showOWPTs = function(index){
	return this.get(6);
}

Settings.prototype.showOWPTName = function(index){
	return this.get(7);
}

Settings.prototype.showOGC = function(index){
	return this.get(8);
}

Settings.prototype.showGCIndex = function(index){
	return this.get(9);
}
