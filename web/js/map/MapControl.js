MapControl.prototype.createMenu= function(text,items){
	var controlHead = document.createElement('div');	

	var controlText = document.createElement('div');
	controlText.className = 'controlText';
	controlText.innerHTML = text+"<small>▼</small>";
	controlHead.appendChild(controlText);
	
	
	var controlBody = document.createElement('div');
	controlBody.className = 'controlBody';
	controlHead.appendChild(controlBody);
	
	
	if(items){
		for(var i = 0; i < items.length;i++){
			var item = items[i];
			
			if(item.slider == true){
				
				var item_div = document.createElement('DIV');
				item_div.style.textAlign = "center";
			
				var controlSlider = document.createElement('div');
				item_div.appendChild(controlSlider);				
				$(controlSlider).slider({ min:50,value: 100, slide: item.func});
				
				var opacityElement = document.createElement('b');
				opacityElement.id="opacity";
				opacityElement.innerHTML = "100%";
				item_div.appendChild(opacityElement);
			

			

				controlBody.appendChild(item_div);
			}else {
				
				var item_div = document.createElement('div');
	
				item_div.innerHTML = item.name;
				if(item.id){
					item_div.id = item.id;
				}
				
				if(item.enabled != true){
					addClass(item_div, "disabled");
				}
				controlBody.appendChild(item_div);
				
				
				// and add the function to the click event
				google.maps.event.addDomListener(item_div, 'click', item.func);
			}					
		}
	}
	
	this.controlBody_ = controlBody;
	
	
	$(controlText).mouseover(function () {
		$('.controlBody').each(function(){$(this).hide();});
		
		 $(controlBody).show();
	 });
	
	var timeOut;
	$(controlHead).hover(
        function() { //when mouse hovers in
        	
              clearTimeout(timeOut);
              
              //maybe some code here to hide other tooltips if not needed
        },
        function() { //when mouse hovers out
              timeOut = setTimeout(function(){$(controlBody).hide();}, 1000);
        }
  );
	this.controlDiv_.appendChild(controlHead);
}



MapControl.prototype.createButton= function(text,func,enabled){
	var controlButton = document.createElement('DIV');
	controlButton.className = "controlButton";
	
	var controlText = document.createElement('div');
	controlText.innerHTML = text;
	controlButton.appendChild(controlText);
	
	google.maps.event.addDomListener(controlButton, 'click', func);	  
	
	if(!enabled){
		addClass(controlButton, "disabled");
	}
	
	this.controlDiv_.appendChild(controlButton);
}

MapControl.prototype.controlDiv_ = null;

function MapControl(map) {

  // Set CSS styles for the DIV containing the control
  // Setting padding to 5 px will offset the control
  // from the edge of the map
	var controlDiv = document.createElement('DIV');
	controlDiv.index = 1;
	controlDiv.className = "gmnoprint controls";
	this.controlDiv_ = controlDiv;
	
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.controlDiv_);
	
}
  
