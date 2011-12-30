function updateMap(newDocument, mapId){
  return function(){

    var mapCrc = mapId.split('#')[0];

    var map = newDocument.getElementById(mapId).getElementsByTagName('iframe')[0];
    var nameInput = newDocument.getElementById('mapName'+mapId);
    var gcIdInput = newDocument.getElementById('mapGcId'+mapId);
    var markerInput = newDocument.getElementById('mapMarker'+mapId);
    var markerNameInput = newDocument.getElementById('mapMarkerName'+mapId);
    var mapURL = "http://gctour.madd.in/map/show2.php?crc="+mapCrc+"&name="+nameInput.checked+"&gcid="+gcIdInput.checked+"&marker="+markerInput.checked+"&markername="+markerNameInput.checked+"&maptype="+GM_getValue('printOutlineMapType',"Karte");
    map.src = mapURL;

  };
}

function updateMapSize(newDocument, mapId,factor){
  return function(){
    var map = newDocument.getElementById(mapId).getElementsByTagName('iframe')[0];
    map.style.width = (factor * 20) +"cm";
    map.style.height = (1 * 500) +"px";
  };
}

function getMapType(){
  return GM_getValue('printOutlineMapType','roadmap');
}

function getMapSettings(){
  var settings = [];
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

  settings.push(GM_getValue('settings_map_geocacheid',true));
  settings.push(GM_getValue('settings_map_geocachename',true));
  settings.push(GM_getValue('settings_map_awpts',true));
  settings.push(GM_getValue('settings_map_awpt_name',true));
  settings.push(GM_getValue('settings_map_awpt_lookup',true));
  settings.push(GM_getValue('settings_map_owpts',true));
  settings.push(GM_getValue('settings_map_owpt_name',true));
  settings.push(GM_getValue('settings_map_gcde',false));
  settings.push(GM_getValue('settings_map_geocacheindex',true));

  return settings.join("").replace(/true/g,"1").replace(/false/g,"0");
}

function getMapUrl(mapQuery){
  
  var hash_value = postSync(GCTOUR_HOST+"/map/make", "ids="+mapQuery);
  debug("Hash '"+hash_value+"' for this query '"+mapQuery+"'");  
  return GCTOUR_HOST+"/map/show/h/"+hash_value+"/"+getMapSettings()+"/"+getMapType();
}

function getMap(mapQuery){
  var factor = 1;
  var map_size = GM_getValue('defaultMapSize', 'large');
  if(map_size == "large"){
    factor = 1;
  } else if(map_size == "medium"){
    factor = 0.75;
  } else if(map_size == "small"){
    factor = 0.5;
  }

  var mapId = mapQuery.replace(/,/g,"");

  var map_frame = document.createElement('iframe');
  map_frame.className = 'cacheMap';
  map_frame.id = mapId;
  map_frame.style.width = (1 * 20) + "cm";
  map_frame.style.height = (factor * 500) + 'px';
  map_frame.style.border = '1px solid lightgray';
  map_frame.src = getMapUrl(mapQuery);
  return map_frame;
}

function getMapControl(mapQuery,map_frame){
  
  

  var mapId = mapQuery.replace(/,/g,"");
  var control_container = createElement('div',{style:"float:right;"});
  control_container.className = 'noprint';
  
  
  var resizeFunction = function(){
    map_frame.style.height=(this.value*500)+"px";
  }
  
  // todo - default noch selektieren! und alten code löschen
  $(control_container).append(
    $('<ul/>').append(
      $('<li>'+$.gctour.lang('settingsMapSize')+'</li>').append(
        $('<br/>'),
        $('<input type="radio" name="mapsize" value="1">large</input>')
          .click(resizeFunction),
        $('<br/>'),
        $('<input type="radio" name="mapsize" value="0.75">medium</input>')
          .click(resizeFunction),
        $('<br/>'),
        $('<input type="radio" name="mapsize" value="0.5">small</input>')   
          .click(resizeFunction)  
      ),
      $('<li>'+$.gctour.lang('printviewRemoveMap')+'</li>')   
        .css('background','url("'+deleteImageString+'") top left no-repeat')  
        .css('padding-left','18px')
        .click(function(){map_frame.parentNode.style.display = "none";}),
      $('<li>Karte neu laden!</li>')   
        .css('background','url("'+deleteImageString+'") top left no-repeat')  
        .css('padding-left','18px')
        .click(function(){map_frame.src = map_frame.src;})  
    )
  ).find("li").addShadowEffect().addOpacityEffect();
/*
  var factor = 1;
  var inputElement = document.createElement('input');control_container.appendChild(inputElement);
  inputElement.name = 'mapSize'+mapId;
  inputElement.type = 'radio';
  if(GM_getValue('defaultMapSize', 'large') === "large"){
    inputElement.checked = 'checked';
    factor = 1;
  }
  inputElement.addEventListener('click',function(){var factor = 1;map_frame.style.width=(1 * 20) +"cm";map_frame.style.height=(factor*500)+"px";}, false);
  control_container.appendChild(document.createTextNode("large"));

  inputElement = document.createElement('input');control_container.appendChild(inputElement);
  inputElement.name = 'mapSize'+mapId;
  inputElement.type = 'radio';
  if(GM_getValue('defaultMapSize', 'large') === "medium"){
    inputElement.checked = 'checked';
    factor = 0.75;
  }
  inputElement.addEventListener('click',function(){var factor = 0.75;map_frame.style.width=(1 * 20) +"cm";map_frame.style.height=(factor*500)+"px";}, false);
  control_container.appendChild(document.createTextNode("medium"));

  inputElement = document.createElement('input');control_container.appendChild(inputElement);
  inputElement.name = 'mapSize'+mapId;
  inputElement.type = 'radio';
  if(GM_getValue('defaultMapSize', 'large') === "small"){
    inputElement.checked = 'checked';
    factor = 0.5;
  }
  inputElement.addEventListener('click',function(){var factor = 0.5;map_frame.style.width=(1 * 20) +"cm";map_frame.style.height=(factor*500)+"px";}, false);
  control_container.appendChild(document.createTextNode("small"));

  control_container.appendChild(createElement('br'));

  // delete map button
  var divElement = document.createElement('div');control_container.appendChild(divElement);
  divElement.style.border = '1px solid lightgray';
  divElement.style.marginRight = '10px';
  divElement.style.display = "inline";
  divElement.style.cursor = "pointer";
  divElement.addEventListener('click', function(){map_frame.parentNode.style.display = "none";}, true);

  addOpacityEffects(divElement);

  var deleteImage = document.createElement('img');
  deleteImage.style.cursor = 'pointer';
  deleteImage.src = deleteImageString;

  divElement.appendChild(deleteImage);
  divElement.appendChild(document.createTextNode($.gctour.lang('printviewRemoveMap')));
  
   /* var refresh_link = 
  
  document.getElementById(FrameID).contentDocument.location.reload(true);

  
  
* /
  control_container.appendChild(createElement('br'));

  var map_link = createElement('a',{style:"font-size:80%"});
  map_link.href = getMapUrl(mapQuery);
  map_link.target = "_blank";

//  map_link.addEventListener('click', function(){GM_openInTab(getMapUrl(mapQuery))}, true);
  map_link.innerHTML = "("+$.gctour.lang('printviewZoomMap')+")";
  control_container.appendChild(map_link);
  

*/
  return control_container;

  //~ var updateMapSize = function (mapfactor){
    //~ return function(){
      //~ map_frame.style.width = (factor * 20) +"cm";
      //~ map_frame.style.height = (factor * 500) +"px";
    //~ }
  //~ };
  //~
  //~ return function(){
    //~ var map = newDocument.getElementById(mapId).getElementsByTagName('iframe')[0];
    //~ map.style.width = (factor * 20) +"cm";
    //~ map.style.height = (factor * 500) +"px";
  //~ }
//~ }
  //~
  //~ var size_control_div = createElement('div');
  //~ size_control_div.innerHTML =
    //~ '<input type="radio" name="mapSize'+mapId+'">large</input>\
    //~ <input type="radio" name="mapSize'+mapId+'">medium</input>\
    //~ <input type="radio" name="mapSize'+mapId+'">small</input>';
    //~
  //~ var size_control_inputs = dojo.query('input',size_control_div);
  //~ alert(size_control_inputs.length);
  //~ var factor = 1;
  //~ /* large */
  //~ if(GM_getValue('defaultMapSize', 'large') == "large"){size_control_inputs[0] = 'checked';factor = 1;}
  //~ size_control_inputs[0].addEventListener('click',updateMapSize(1), false);
  //~ /* medium */
  //~ if(GM_getValue('defaultMapSize', 'large') == "medium"){size_control_inputs[1] = 'checked';factor = 0.75;}
  //~ size_control_inputs[1].addEventListener('click',updateMapSize(0.75), false);
  //~
  //~ /* small */
  //~ if(GM_getValue('defaultMapSize', 'large') == "small"){size_control_inputs[2] = 'checked';factor = 0.5;}
  //~ size_control_inputs[2].addEventListener('click',updateMapSize(0.5), false);
  //~
  //~ map_container.appendChild(size_control_div);
  //~ map_container.appendChild(map_frame);
  //~
  //~ return map_container;
}

(function( $ ){

    var methods = { 
      init : function( options ) {
        var settings = $.extend( {
              'min'         : '0',
              'max' : '100'
            }, options),
            scroller_element = $("<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>")
              .appendTo( this ),
            dragged = false,
            slider_width = 0,
            slider_offset = 0,
            percentage = 0,
            self = this;
                  
        scroller_element
          .click(function( event ) {  
            event.preventDefault();
          })
          .hover(
            function() { $( this ).addClass( "ui-state-hover" );},
            function() { $( this ).removeClass( "ui-state-hover" );})
          .focus(function() {
            $( ".ui-slider .ui-state-focus" ).removeClass( "ui-state-focus" );
            $( this ).addClass( "ui-state-focus" );
          })
          .blur(function() {
            $( this ).removeClass( "ui-state-focus" );
          })
          .mousedown(function(e){	
            e.preventDefault();
            dragged = true;
            
        		slider_width = parseInt(self.css("width"));        
        		slider_offset = parseInt(self.offset().left);
              
        		scroller_element.addClass( "ui-state-active" );
        		methods["trigger"].apply( self, ["start", methods["calculate"].apply( self, [percentage])]);       		
        	});   
        
        this.addClass('ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all')
          .append(scroller_element);
       
       	$('*').mousemove(function(e){	
      	  if(dragged){
      	    e.preventDefault();
      	    percentage = (100*(e.pageX-slider_offset))/(slider_width);
            percentage = (percentage<0)?0:percentage;
            percentage = (percentage>100)?100:percentage;
                    
//            debug("MousePos:"+e.pageX+"\tSliderWidth:"+slider_width+"\tSliderOffset:"+slider_offset+"\tMove to:"+percentage);
            
           
            scroller_element.css("left", (percentage)+"%");
            
            methods["trigger"].apply( self, ["slide", methods["calculate"].apply( self, [percentage])]);  
      	  }
      	});
      	
      	
        $('*').mouseup(function(){
          if(dragged){
    			  dragged = false;
    			  scroller_element.removeClass( "ui-state-active" );
    			  methods["trigger"].apply( self, ["stop", methods["calculate"].apply( self, [percentage])]);    
//    			  methods["trigger"].apply( self, {value:percentage});
    			}
    		}); 
      	
      	     
        this.data('gct_slider', {
          target : $(this),
          settings : settings
        });  
        
     
        return this;    
      },
      calculate : function(percentage) {
       var $data = $(this).data('gct_slider'),
           max = $data.settings.max,
           min = $data.settings.min,
           relative_value = (percentage*(max-min))/100,
           value = min + relative_value;
//       log("relative_value"+ relative_value+ "\tvalue:"+value);
       return {percentage:percentage,value:value};
      },
      trigger : function(type,data){
        var $data = $(this).data('gct_slider');
            callback = $data.settings[type],
            data = data || {};
          
            
         return !($.isFunction( callback ) &&
                    callback.apply(this, [ data ]) === false)
     }   
   }
   
   $.fn.gct_slider = function( method ) {
     if ( methods[method] ) {
       return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
     } else if ( typeof method === 'object' || ! method ) {
       return methods.init.apply( this, arguments );
     } else {
       $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
     }  
   };
 
})( $ );


function getMapElement(mapQuery) {

  var map_container = createElement('div',{style:"text-align: center; margin-left: auto; margin-right: auto;"});

  var map_frame = getMap(mapQuery);
  map_container.appendChild(getMapControl(mapQuery,map_frame));
  map_container.appendChild(map_frame);

  return map_container;
}

function getOverviewMap(geocaches, newwindow2, theElement){
    log('POST: http://gctour.madd.in/map/save.php - caches='+JSON.stringify(geocaches));
    //~ post('http://gctour.madd.in/map/save.php', 'caches='+uneval(geocaches).replace(/&/g,"\\u0026") ,
    //~ post('http://localhost/martin/map/save.php', 'tour='+JSON.stringify(geocaches).replace(/&/g," und "),
    post('http://gctour.madd.in/map/save.php', 'tour='+JSON.stringify(geocaches).replace(/&/g," und "),
      function(text){
        var mapId = text+ "#" + (new Date()).getTime();

        var cacheMapControl = document.createElement('div');
        cacheMapControl.className = 'noprint';
        //~ cacheMapControl.style.width = "20cm";
        cacheMapControl.style.border = '1px solid #EBEFC2';
        cacheMapControl.style.backgroundColor = '#FBFFCF';

        cacheMapControl.style.marginLeft = "auto" ;
        cacheMapControl.style.marginRight = "auto" ;

        cacheMapControl.style.marginBottom = "5px" ;
        cacheMapControl.style.paddingBottom = "5px" ;
        cacheMapControl.style.textAlign = "center" ;

        var divElement = document.createElement('div');cacheMapControl.appendChild(divElement);
        divElement.style.marginRight = '10px';
        divElement.style.display = "inline";
        divElement.appendChild(document.createTextNode(  $.gctour.lang('printviewAdditionalWaypoint') ));

        divElement = document.createElement('div');cacheMapControl.appendChild(divElement);
        divElement.style.border = '1px solid lightgray';
        divElement.style.marginRight = '10px';
        divElement.style.display = "inline";

        var inputElement = document.createElement('input');
        inputElement.id = 'mapMarker'+mapId;
        inputElement.checked = 'checked';
        inputElement.type = 'checkbox';
        inputElement.addEventListener('click',updateMap(newwindow2.document,mapId), false);
        divElement.appendChild(inputElement);
        divElement.appendChild(document.createTextNode($.gctour.lang('settingsLogCountShow')));

        inputElement = document.createElement('input');
        inputElement.id = 'mapMarkerName'+mapId;
        inputElement.checked = 'checked';
        inputElement.type = 'checkbox';
        inputElement.addEventListener('click',updateMap(newwindow2.document,mapId), false);
        divElement.appendChild(inputElement);
        divElement.appendChild(document.createTextNode(  $.gctour.lang('markerCaption')));

        divElement = document.createElement('div');cacheMapControl.appendChild(divElement);
        divElement.style.marginRight = '10px';
        divElement.style.display = "inline";
        divElement.appendChild(document.createTextNode('Geocache:'));

         divElement = document.createElement('div');cacheMapControl.appendChild(divElement);
        divElement.style.border = '1px solid lightgray';
        divElement.style.marginRight = '10px';
        divElement.style.display = "inline";

        inputElement = document.createElement('input');
        inputElement.id = 'mapName'+mapId;
        inputElement.type = 'checkbox';
        inputElement.addEventListener('click',updateMap(newwindow2.document,mapId), false);

        divElement.appendChild(inputElement);
        divElement.appendChild(document.createTextNode($.gctour.lang('markerCaption')));

        inputElement = document.createElement('input');
        inputElement.id = 'mapGcId'+mapId;
        inputElement.type = 'checkbox';
        inputElement.checked = 'checked';
        inputElement.addEventListener('click',updateMap(newwindow2.document,mapId), false);

        divElement.appendChild(inputElement);
        divElement.appendChild(document.createTextNode('GC-Code'));

        // map size buttons
        divElement = document.createElement('div');cacheMapControl.appendChild(divElement);
        divElement.style.marginRight = '10px';
        divElement.style.display = "inline";
        divElement.appendChild(document.createTextNode('Size:'));

        divElement = document.createElement('div');cacheMapControl.appendChild(divElement);
        divElement.style.border = '1px solid lightgray';
        divElement.style.marginRight = '10px';
        divElement.style.display = "inline";

        var factor = 1;
        inputElement = document.createElement('input');divElement.appendChild(inputElement);
        inputElement.name = 'mapSize'+mapId;
        inputElement.type = 'radio';
        if(GM_getValue('defaultMapSize', 'large') == "large"){
          inputElement.checked = 'checked';
          factor = 1;
        }
        inputElement.addEventListener('click',updateMapSize(newwindow2.document,mapId,1), false);
        divElement.appendChild(document.createTextNode("large"));

        inputElement = document.createElement('input');divElement.appendChild(inputElement);
        inputElement.name = 'mapSize'+mapId;
        inputElement.type = 'radio';
        if(GM_getValue('defaultMapSize', 'large') == "medium"){
          inputElement.checked = 'checked';
          factor = 0.75;
        }
        inputElement.addEventListener('click',updateMapSize(newwindow2.document,mapId,0.75), false);
        divElement.appendChild(document.createTextNode("medium"));

        inputElement = document.createElement('input');divElement.appendChild(inputElement);
        inputElement.name = 'mapSize'+mapId;
        inputElement.type = 'radio';
        if(GM_getValue('defaultMapSize', 'large') == "small"){
          inputElement.checked = 'checked';
          factor = 0.5;
        }
        inputElement.addEventListener('click',updateMapSize(newwindow2.document,mapId,0.5), false);
        divElement.appendChild(document.createTextNode("small"));


        inputElement = document.createElement('input');divElement.appendChild(inputElement);
        inputElement.name = 'mapSize'+mapId;
        if(GM_getValue('defaultMapSize', 'large') ==  'very small'){
          inputElement.checked = 'checked';
          factor = 0.3;
        }
        inputElement.type = 'radio';
        inputElement.addEventListener('click',updateMapSize(newwindow2.document,mapId,0.3), false);
        divElement.appendChild(document.createTextNode("very small"));

        // delete map button
        divElement = document.createElement('div');cacheMapControl.appendChild(divElement);
        divElement.style.border = '1px solid lightgray';
        divElement.style.marginRight = '10px';
        divElement.style.display = "inline";
        divElement.style.cursor = "pointer";
        divElement.addEventListener('click', function(){newwindow2.document.getElementById(mapId).style.display = "none"; }, true);

        addOpacityEffects(divElement);

        var deleteImage = document.createElement('img');
        deleteImage.style.cursor = 'pointer';
        deleteImage.src = deleteImageString;

        divElement.appendChild(deleteImage);
        divElement.appendChild(document.createTextNode($.gctour.lang('printviewRemoveMap')));

        var cacheMap = document.createElement('iframe');
        cacheMap.className = 'cacheMap';
        //~ cacheMap.id = text;

        cacheMap.style.width = (factor * 20) + "cm";
        cacheMap.style.height = (factor * 500) + 'px';
        cacheMap.style.border = '1px solid lightgray';
        //~ cacheMap.src = "http://localhost/martin/map/show2.php?crc="+text+"&maptype="+GM_getValue('printOutlineMapType',"Karte");
        cacheMap.src = "http://gctour.madd.in/map/show2.php?crc="+text+"&maptype="+GM_getValue('printOutlineMapType',"Karte");

        var map = document.createElement('div');
        //~ map.id = 'mapDiv';
        map.id = mapId ;
        map.style.textAlign = 'center';
        map.style.marginLeft = 'auto';
        map.style.marginRight = 'auto';

        map.appendChild(cacheMapControl);
        map.appendChild(cacheMap);

        dojo.query("div[id='"+theElement+"']",newwindow2.document)[0].appendChild(map);
      });
}

