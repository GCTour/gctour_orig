	
	

	function CostumLabel(){}
	
	function CostumLabel(options, map){
		if(!options)return;
			this._options = options;
			
			var latLng = this.getLatLng();
			this.point_ = latLng;

			var marker = new google.maps.Marker({
				position: latLng,
				map: map,
				icon: this._options.icon ,
				title: this._options.name,
				zIndex: 10
			});		
 
			this.marker_ = marker;
			
			
			
			// start streetview-on-click
			google.maps.event.addListener(marker, 'click', function() {
				var nearestLatLng = null;
				var nearestPano = null;
		
				
				var client = new google.maps.StreetViewService();
				client.getPanoramaByLocation(latLng, 100, function(data, status) {
				  if (status == google.maps.StreetViewStatus.OK) {
				
					  
					panorama = map.getStreetView();
					// set new center
					panorama.setPosition(data.location.latLng);
					  
					
					
						// calculate the right bearing for the point of view
			          var markerPos = marker.getPosition();
			          var panoPos = data.location.latLng;
			          if (markerPos && panoPos) {
			            var markerPosLat = markerPos.lat() / 180 * Math.PI;
			            var markerPosLng = markerPos.lng() / 180 * Math.PI;
			            var panoPosLat = panoPos.lat() / 180 * Math.PI;
			            var panoPosLng = panoPos.lng() / 180 * Math.PI;

			            var y = Math.sin(markerPosLng - panoPosLng) *Math.cos(markerPosLat);
			            var x = Math.cos(panoPosLat)*Math.sin(markerPosLat) -

			            Math.sin(panoPosLat)*Math.cos(markerPosLat)*Math.cos(markerPosLng - panoPosLng);
			            var brng = Math.atan2(y, x) / Math.PI * 180;
			            
			            
						// set the right pov
			            var pov = panorama.getPov();
			            pov.heading = brng;
			            pov.pitch = 0;
			            panorama.setPov(pov);
			          }					  				
					panorama.setVisible(true);
				  } else {
					  $("#svError").fadeIn('fast').delay(3000).fadeOut("slow");
				  }

				}); 
			});
			
			// end streetview-on-click

			
				
			this.setMap(map);

	}
	
	CostumLabel.prototype = new google.maps.OverlayView();

	
	CostumLabel.prototype.getLatLng = function() {
		
		return new google.maps.LatLng(this._options.latitude,this._options.longitude);
	}
	
	CostumLabel.prototype.toggleName = function(){
		if(this.showName_ == true) {
			this.showName_ = false;
		} else {
			this.showName_ = true;
		}
		this.content_.innerHTML = this.getCaption();
		this.draw();

		return this.showName_;
	}
	
	CostumLabel.prototype.getCaption = function() {
		return "costum label - not specified";
	}
	
	
	CostumLabel.prototype.toggleHide = function(){
		if(this.hidden_ == true){
			this.hidden_ = false;
			this.marker_.setVisible(true);
		} else {
			this.hidden_ = true;
			this.marker_.setVisible(false);
		}

		this.draw();		
		
		return !this.hidden_;
	}
	
	CostumLabel.prototype.setAlpha = function(alpha){
		this.div_.style.opacity = alpha/100;			
	}
	
	CostumLabel.prototype.onAdd = function() {
		// Note: an overlay's receipt of onAdd() indicates that
		// the map's panes are now available for attaching
		// the overlay to the map via the DOM.

		// Create the DIV and set some basic attributes.
		var div = document.createElement('DIV');
		div.style.border = "none";
		div.style.borderWidth = "0px";
		div.style.position = "absolute";


		var content = document.createElement("div");
		content.className = 'label';
		content.innerHTML = this.getCaption();
		div.appendChild(content);
		this.content_ = content;

		// Set the overlay's div_ property to this DIV
		this.div_ = div;

		// We add an overlay to a map via one of the map's panes.
		// We'll add this overlay to the overlayImage pane.
		var panes = this.getPanes();
		panes.overlayLayer.appendChild(div);
	}

	CostumLabel.prototype.draw = function() {


		// Size and position the overlay. We use a southwest and northeast
		// position of the overlay to peg it to the correct position and size.
		// We need to retrieve the projection from this overlay to do this.
		var overlayProjection = this.getProjection();

		// Retrieve the southwest and northeast coordinates of this overlay
		// in latlngs and convert them to pixels coordinates.
		// We'll use these coordinates to resize the DIV.
		var p = overlayProjection.fromLatLngToDivPixel(this.point_);

		var h = parseInt(this.div_.clientHeight);

		this.div_.style.left = p.x  + "px";
		this.div_.style.top = p.y  + "px";

		// hide the label AND the marker!
		if(this.hidden_){ 
			this.div_.style.display = "none";
			this.marker_.setVisible(false);
		} else {
			this.div_.style.display = "block";
			this.marker_.setVisible(true);
		}

		// if the caption is empty - hide just the caption
		if(this.getCaption() == ""){
			this.div_.style.display = "none";
		}
	}



	CostumLabel.prototype.onRemove = function() {
		this.div_.parentNode.removeChild(this.div_);
		this.div_ = null;
	}
		 
		 
		 
	
	function Geocache2Label(options, map){
		
		type = options.icon.split(".gif")[0].split("/")[5];
		options.icon = "http://www.geocaching.com/images/wpttypes/pins/"+type+".png";
		this.base = CostumLabel;
		this.base(options,map);
		
		
		
				
		this.showGCID_ = settings.showGCID();
		this.showName_ = settings.showGCName();
		this.showGCIndex_ = settings.showGCIndex();
	}
	
	Geocache2Label.prototype = new CostumLabel;
	
	Geocache2Label.prototype.toggleGCID = function(){
		if(this.showGCID_ == true) {
			this.showGCID_ = false;
		} else {
			this.showGCID_ = true;
		}
		this.content_.innerHTML = this.getCaption();
		this.draw();
		
		return this.showGCID_;
	}	
	
	
	Geocache2Label.prototype.getCaption = function() {
		var caption = "";
		//~ caption += this.getIndex();
		
		caption += (this.showGCIndex_)?"<b>"+this._options.index+"</b> ":"" ;
		caption += (this.showGCID_)?"("+this._options.gcid+")":"" ;
		caption += (this.showName_)?" "+this._options.name:"";
		return caption;		
	}



	function WaypointLabel(options, map){
		this.base = CostumLabel;
		this.base(options,map);
		
		this.hidden_ = !settings.showOWPTs();
		this.showName_ = settings.showOWPTName();	
	}
	
	WaypointLabel.prototype = new CostumLabel;
	
	
	WaypointLabel.prototype.getCaption = function() {
		var caption = "";
		//~ caption += this.getIndex();
		//~ caption +=  (this._options.prefix && this.showPrefix_)?this._options.prefix+" ","";
		
		
		caption += (this._options.index)?"<b>"+this._options.index+"</b> ":"" ;
		caption += (this.showName_)?this._options.name:"";
		return caption;	
	}
























// OLD CODE		 
      function GeocacheLabel(geocache, map,index) {

			var latLng = new google.maps.LatLng(geocache.latitude,geocache.longitude);

			var marker = new google.maps.Marker({
				position: latLng,
				map: map,
				icon:  geocache.type,
				title: geocache.name,
				zIndex: 10
			});		
 
			this.marker_ = marker;

			google.maps.event.addListener(marker, 'click', function() {
		/*		panorama = map.getStreetView();
				panorama.setPosition(latLng);
				panorama.setVisible(true);
			*/	
				

		
				
		
				var nearestLatLng = null;
				var nearestPano = null;
				
				
				var client = new google.maps.StreetViewService();
				client.getPanoramaByLocation(latLng, 100, function(data, status) {
				  if (status == google.maps.StreetViewStatus.OK) {
				
					  
					panorama = map.getStreetView();
					// set new center
					panorama.setPosition(data.location.latLng);
					  
					
					
						// calculate the right bearing for the point of view
			          var markerPos = marker.getPosition();
			          var panoPos = data.location.latLng;
			          if (markerPos && panoPos) {
			            var markerPosLat = markerPos.lat() / 180 * Math.PI;
			            var markerPosLng = markerPos.lng() / 180 * Math.PI;
			            var panoPosLat = panoPos.lat() / 180 * Math.PI;
			            var panoPosLng = panoPos.lng() / 180 * Math.PI;

			            var y = Math.sin(markerPosLng - panoPosLng) *Math.cos(markerPosLat);
			            var x = Math.cos(panoPosLat)*Math.sin(markerPosLat) -

			            Math.sin(panoPosLat)*Math.cos(markerPosLat)*Math.cos(markerPosLng - panoPosLng);
			            var brng = Math.atan2(y, x) / Math.PI * 180;
			            
			            
						// set the right pov
			            var pov = panorama.getPov();
			            pov.heading = brng;
			            pov.pitch = 0;
			            panorama.setPov(pov);
			          }					  
					  
					  
		
		      
					
					
				
					panorama.setVisible(true);
				  } else {
					  $("#svError").fadeIn('fast').delay(3000).fadeOut("slow");
				  }

				}); 
			});


        // Mandatory parameters
        this.point_ = latLng;


			var labelObj = {};
			labelObj.index = index;
			labelObj.gcid = geocache.gcid;
			labelObj.gcname = geocache.name;
			this.lobj_ = labelObj;
		
			// set default settings
			if(index == 0){ // additional Waypoint
				this.hidden_ = !settings.showWPTs();
				this.showGCID_ = settings.showWPTName();
				this.showGCName_ = settings.showWPTLookup();
			} else if (index == -1) { // own waypoints
				this.hidden_ = !settings.showOWPTs();
				this.showGCID_ = settings.showOWPTName();	
			} else { // geocache
				this.showGCID_ = settings.showGCID();
				this.showGCName_ = settings.showGCName();
				this.showGCIndex_ = settings.showGCIndex();
			}
			


			// Explicitly call setMap() on this overlay
			this.setMap(map);

      } 
		

      
      GeocacheLabel.prototype = new google.maps.OverlayView();

		GeocacheLabel.prototype.getLatLng = function(){
			return this.point_;
		}
 
	/*	GeocacheLabel.prototype.toggleName = function(){
			if(this.toggleName_){
				
			} else {
				
			}
			this.html_ = html;
			this.content_.innerHTML = this.html_;
		} */
		GeocacheLabel.prototype.getIndex = function(){
			if(this.showGCIndex_ == true && this.lobj_.index != 0){ // index ONLY on Geocaches
				return "<b>"+this.lobj_.index+"</b>";
			} else {
				return "";
			}
			
		}
		
		GeocacheLabel.prototype.setAlpha = function(alpha){
			this.div_.style.opacity = alpha/100;			
		}
		
		
		

		GeocacheLabel.prototype.toggleGCIndex = function(){
			if(this.showGCIndex_ == true) {
				this.showGCIndex_ = false;
			} else {
				this.showGCIndex_ = true;
			}
			this.content_.innerHTML = this.getCaption();
			this.draw();
			
			return this.showGCIndex_;
		}

		GeocacheLabel.prototype.toggleGCID = function(){
			if(this.showGCID_ == true) {
				this.showGCID_ = false;
			} else {
				this.showGCID_ = true;
			}
			this.content_.innerHTML = this.getCaption();
			this.draw();
			
			return this.showGCID_;
		}
 
		GeocacheLabel.prototype.getGCID = function(){

			if(this.showGCID_ == true && this.lobj_.gcid != "none") {
				return  "&nbsp;<i>"+this.lobj_.gcid+"</i>&nbsp;";
			} else {
				return  "";
			}
			
		} 

		GeocacheLabel.prototype.toggleGCName= function(){
			if(this.showGCName_ == true) {
				this.showGCName_ = false;
			} else {
				this.showGCName_ = true;
			}
			this.content_.innerHTML = this.getCaption();
			this.draw();
			
			return this.showGCName_;
		}

		GeocacheLabel.prototype.getGCName = function(){
			if(this.showGCName_ == true && this.lobj_.gcname != "none") {
				return "&nbsp;"+this.lobj_.gcname;
			} else {
				return  "";
			}
		} 


		GeocacheLabel.prototype.getCaption = function(){
			var caption = "";
			caption += this.getIndex();
			caption += this.getGCID();
			caption += this.getGCName();
			return caption;
		}

		
		GeocacheLabel.prototype.toggleHide = function(){


			if(this.hidden_ == true){
				this.hidden_ = false;
				this.marker_.setVisible(true);
			} else {
				this.hidden_ = true;
				this.marker_.setVisible(false);
			}

			this.draw();
			
			
			return !this.hidden_;
		}

      GeocacheLabel.prototype.onAdd = function() {
			// Note: an overlay's receipt of onAdd() indicates that
			// the map's panes are now available for attaching
			// the overlay to the map via the DOM.

			// Create the DIV and set some basic attributes.
			var div = document.createElement('DIV');
			div.style.border = "none";
			div.style.borderWidth = "0px";
			div.style.position = "absolute";

	
			var content = document.createElement("div");
			content.className = 'label';
			content.innerHTML = this.getCaption();
			div.appendChild(content);
			this.content_ = content;

			// Set the overlay's div_ property to this DIV
			this.div_ = div;

			// We add an overlay to a map via one of the map's panes.
			// We'll add this overlay to the overlayImage pane.
			var panes = this.getPanes();
			panes.overlayLayer.appendChild(div);
      }

		GeocacheLabel.prototype.draw = function() {


			// Size and position the overlay. We use a southwest and northeast
			// position of the overlay to peg it to the correct position and size.
			// We need to retrieve the projection from this overlay to do this.
			var overlayProjection = this.getProjection();

			// Retrieve the southwest and northeast coordinates of this overlay
			// in latlngs and convert them to pixels coordinates.
			// We'll use these coordinates to resize the DIV.
			var p = overlayProjection.fromLatLngToDivPixel(this.point_);
			
			var h = parseInt(this.div_.clientHeight);

			this.div_.style.left = p.x  + "px";
			this.div_.style.top = p.y  + "px";
			
			// hide the label AND the marker!
			if(this.hidden_){ 
				this.div_.style.display = "none";
				this.marker_.setVisible(false);
			} else {
				this.div_.style.display = "block";
				this.marker_.setVisible(true);
			}
			
			// if the caption is empty - hide just the caption
			if(this.getCaption() == ""){
				this.div_.style.display = "none";
			}
		}
	  

		GeocacheLabel.prototype.onRemove = function() {
			this.div_.parentNode.removeChild(this.div_);
			this.div_ = null;
		}

