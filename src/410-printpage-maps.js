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
  var map_size_px,
      mapId = mapQuery.replace(/,/g,""),
      map_frame = document.createElement('iframe');

  switch (GM_getValue('defaultMapSize', 'large')) {
    case "medium":
      map_size_px = 375;
      break;
    case "small":
      map_size_px = 250;
      break;
    default:
      map_size_px = 500;
      break;
  }

  map_frame.className = 'cacheMap';
  map_frame.id = mapId;
  map_frame.style.width = "20cm";
  map_frame.style.height = map_size_px + 'px';
  map_frame.style.border = '1px solid lightgray';
  map_frame.src = getMapUrl(mapQuery);
  return map_frame;
}

function getMapControl(mapQuery,map_frame,newDocument){



  var mapId = mapQuery.replace(/,/g,""),
      control_container = createElement('div',{style:"float:right;"}),
      map_size_px;

  control_container.className = 'noprint';

  switch (GM_getValue('defaultMapSize', 'large')) {
    case "medium":
      map_size_px = 375;
      break;
    case "small":
      map_size_px = 250;
      break;
    default:
      map_size_px = 500;
      break;
  }

  // todo - default noch selektieren! und alten code löschen
  $(control_container).append(
    $('<ul/>').append(
      $('<li/>').text($.gctour.lang('settingsMapSize')).append(
        $("<div/>").gct_slider({
          min:100,
          max:700,
          value:map_size_px,
          document: newDocument,
          slide:function(values){map_frame.style.height=values.value+"px";}
          })
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

  // var refresh_link = document.getElementById(FrameID).contentDocument.location.reload(true);

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
  //~ var size_control_inputs = $('input',size_control_div);
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
              'max' : '100',
              'document': document,
              'value' : 0
            }, options),
            scroller_element = $("<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>")
              .appendTo( this ),
            dragged = false,
            slider_width = 0,
            slider_offset = 0,
            percentage = 0,
            self = this;

        // set start value
        percentage = (100 * settings.value)/settings.max;

        scroller_element
          .css("left", (percentage)+"%")
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

        		slider_width = parseInt(self.css("width"), 10);
        		slider_offset = parseInt(self.offset().left, 10);

        		scroller_element.addClass( "ui-state-active" );
        		methods["trigger"].apply( self, ["start", methods["calculate"].apply( self, [percentage])]);
        	});

        this.addClass('ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all')
          .append(scroller_element);

       $('*',settings.document).mousemove(function(e){
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


        $('*',settings.document).mouseup(function(){
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

function getMapElement(mapQuery,newDocument) {

  var map_container = createElement('div',{style:"text-align: center; margin-left: auto; margin-right: auto;"});

  var map_frame = getMap(mapQuery);
  map_container.appendChild(getMapControl(mapQuery,map_frame,newDocument));
  map_container.appendChild(map_frame);

  return map_container;
}
