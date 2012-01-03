function Settings(){
  setting_groups = [
    ['language',this.getLanguage()],
    ['printview',this.getPrint()],
    ['settings_map',this.getMaps()],
    ['settingsGPX',this.getGPX()]
    //['settingsSendToGPS',this.getLanguage()],
    //['settingsDownladGPX',this.getLanguage(),
    //['settingsUploadTour',this.getLanguage()]
  ];
}

Settings.prototype.show = function(){
  var overlayArray = getListOverlay({caption:$.gctour.lang('settings_caption')});

  var listUl = overlayArray[0];
  this.details = overlayArray[1];

  for(var header_i = 0; header_i < setting_groups.length;header_i++){
    var header = setting_groups[header_i][0];
    var contentFunction = setting_groups[header_i][1];

    var headerLi = createElement('li');append(headerLi,listUl);

    var settingsLink;
    settingsLink = createElement('a',{style:"cursor:pointer;font-size:12px;color:#003399"});
    settingsLink.setAttribute("setting", header_i);

    settingsLink.innerHTML = $.gctour.lang(header);
    //settingsLink.addEventListener('click',this.update(content,this.details,settingsLink,this.activeLink),false);
    settingsLink.addEventListener('click',this.update,true);

    settingsLink.setAttribute('contentFunction', contentFunction);
    settingsLink.setAttribute('header', header);

    append(settingsLink,headerLi);
  }

  this.details.innerHTML = "<h2 align='center'>"+$.gctour.lang('settings_caption')+"</h2>";
};

Settings.prototype.getGPX = function(){
  var div = createElement('div');

  append(this.getCheckbox('settingsGPXHtml', 'gpxhtml',true),div);
  append(this.getCheckbox('settingsGPXWpts', 'gpxwpts',true),div);
  append(this.getCheckbox('settingsGPXStripGC', 'gpxstripgc',false),div);

  return div;
};

Settings.prototype.getLanguage = function(){
  var div = createElement('div'),
      language_arr = [],
      language_obj = {};

  $.each( $.gctour.i18n, function( l, o ) {
    language_obj = {};
    language_obj.value = l;
    language_obj.caption = ((o.name) || "language");
    language_arr.push(language_obj);
  });

  // alphabetic order
  // Quelle: http://www.onemoretake.com/2009/02/25/sorting-elements-with-jquery/
  language_arr.sort(function(a, b) {
    var compA = a.caption.toUpperCase();
    var compB = b.caption.toUpperCase();
    return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
  });

  //languages
  var lang_div = createElement('div',{style:"border-bottom: 1px solid;lightgray;margin-bottom:10px;"});append(lang_div,div);
  var lang_caption = createElement('span');append(lang_caption,lang_div);
  lang_caption.innerHTML = "<b>"+$.gctour.lang('language')+"</b><br/>";
  append(this.getSelectbox(language_arr,'language',$.gctour.defaultLang,setLanguage),lang_caption);

  return div;
};

Settings.prototype.getMaps = function(){
  var div = createElement('div');

  // maptype
  var mapt_div = createElement('div',{style:"border-bottom: 1px solid;lightgray;margin-bottom:10px;"});append(mapt_div,div);
  var mapt_caption = createElement('span');append(mapt_caption,mapt_div);
  mapt_caption.innerHTML = "<b>"+$.gctour.lang('settingsMapType')+"</b><br/>";

  var typeArray = $.gctour.lang('mapTypes');
  append(this.getSelectbox(typeArray,'printOutlineMapType','roadmap',setPrintMapType),mapt_caption);

  //map size
  var mapsi_div = createElement('div',{style:"border-bottom: 1px solid;lightgray;margin-bottom:10px;"});append(mapsi_div,div);
  var mapsi_caption = createElement('span');append(mapsi_caption,mapsi_div);
  mapsi_caption.innerHTML = "<b>"+$.gctour.lang('settingsMapSize')+"</b><br/>";

  var sizeArray = ['large', 'medium', 'small'];
  append(this.getSelectbox(sizeArray,'defaultMapSize','large',setPrintMapSize),mapsi_caption);

  append(this.getCheckbox('settings_map_geocacheid', 'settings_map_geocacheid',true),div);
  append(this.getCheckbox('settings_map_geocachename', 'settings_map_geocachename',true),div);
  append(this.getCheckbox('settings_map_geocacheindex', 'settings_map_geocacheindex',true),div);
  append(this.getCheckbox('settings_map_awpts', 'settings_map_awpts',true),div);
  append(this.getCheckbox('settings_map_awpt_name', 'settings_map_awpt_name',true),div);
  append(this.getCheckbox('settings_map_awpt_lookup', 'settings_map_awpt_lookup',true),div);
  append(this.getCheckbox('settings_map_owpts', 'settings_map_owpts',true),div);
  append(this.getCheckbox('settings_map_owpt_name', 'settings_map_owpt_name',true),div);
  append(this.getCheckbox('settings_map_gcde', 'settings_map_gcde',false),div);

  return div;
};

Settings.prototype.getPrint = function(){
  var div = createElement('div');

  append(this.getCheckbox('settingsPrintMinimal', 'printMinimal',false),div);

  // number of logs
  var log_div = createElement('div',{style:"border-bottom: 1px solid;lightgray;margin-bottom:10px;"});

  var log_caption = createElement('span');
  append(log_caption,log_div);
  log_caption.innerHTML = "<b>"+$.gctour.lang('settingsLogCount')+"</b><br/>";

  var log_button_div = createElement('div',{style:"margin-left:10px"});

  var exportRadioNone = document.createElement('input');
  var exportRadioNoneText = document.createElement('font');
  exportRadioNone.type = 'radio';
  exportRadioNone.name = 'logcount';
  exportRadioNoneText.innerHTML = $.gctour.lang('settingsLogCountNone');
  exportRadioNone.addEventListener('click', function(){GM_setValue('maxPrintLogs',0);},false);

  var exportRadioAll = document.createElement('input');
  var exportRadioAllText = document.createElement('font');
  exportRadioAll.type = 'radio';
  exportRadioAll.name = 'logcount';
  exportRadioAllText.innerHTML = $.gctour.lang('settingsLogCountAll');
  exportRadioAll.addEventListener('click', function(){GM_setValue('maxPrintLogs',-1);},false);

  var exportRadioCount = document.createElement('input');
  var exportRadioCountText = document.createElement('font');
  exportRadioCount.type = 'radio';
  exportRadioCount.name = 'logcount';
  exportRadioCountText.innerHTML = $.gctour.lang('settingsLogCountShow');

  var exportText = document.createElement('input');
  exportText.type = 'text';
  exportText.size = 1;
  exportText.style.verticalAlign = 'center';
  exportText.addEventListener('click', function(){exportRadioCount.checked = 'checked';GM_setValue('maxPrintLogs',exportText.value);},false);
  exportText.addEventListener('keyup',
    function(){
      var check = true;
      var value = exportText.value; //get characters
      for(var i=0;i < value.length; ++i) {
        var new_key = value.charAt(i); //cycle through characters
        if ( ((new_key < "0") || (new_key > "9")) && (new_key != "")) {
        //if(i!= 0 && new_key == "-"){
        check = false;
        break;
        //}
        }
      }
      if(!check) { // highlight if something is wrong
        exportText.style.backgroundColor = '#ff7f7f';
      } else {
        exportText.style.backgroundColor = '#ffffff';
        GM_setValue('maxPrintLogs',exportText.value);
      }
    }, false);

  if(GM_getValue('maxPrintLogs', 3) === 0) {
    exportRadioNone.checked = 'checked';
  } else if ( GM_getValue('maxPrintLogs', 3) <= -1) {
    exportRadioAll.checked = 'checked';
  } else {
    exportText.value = GM_getValue('maxPrintLogs', 3);
    exportRadioCount.checked = 'checked';

  }

  log_button_div.appendChild(exportRadioNone);
  log_button_div.appendChild(exportRadioNoneText);
  log_button_div.appendChild(exportRadioAll);
  log_button_div.appendChild(exportRadioAllText);
  log_button_div.appendChild(exportRadioCount);
  log_button_div.appendChild(exportText);
  log_button_div.appendChild(exportRadioCountText);
  append(log_button_div,log_caption);
  append(log_div,div);

  //fontsize
  var  font_div = createElement('div',{style:"border-bottom: 1px solid;lightgray;margin-bottom:10px;"});

  var font_caption = createElement('span');
  append(font_caption,font_div);
  font_caption.innerHTML = "<b>"+$.gctour.lang('settingsFontSize')+"</b><br/>";

  var sizeArray = ["xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large"];
  append(this.getSelectbox(sizeArray,'printFontSize','x-small',setPrintFontSize),font_caption);

  append(font_div,div);

  append(this.getCheckbox('settingsDecryptHints', 'decryptPrintHints',true),div);
  append(this.getCheckbox('settingsEditDescription', 'printEditMode',false),div);
  append(this.getCheckbox('settingsShowSpoiler', 'printSpoilerImages',true),div);
  append(this.getCheckbox('settingsAdditionalWaypoints', 'printAdditionalWaypoints',true),div);
  append(this.getCheckbox('settingsLoggedVisits', 'printLoggedVisits',false),div);
  append(this.getCheckbox('settingsPageBreak', 'printPageBreak',false),div);
  append(this.getCheckbox('settingsPageBreakAfterMap', 'printPageBreakAfterMap',true),div);
  append(this.getCheckbox('settingsFrontPage', 'printFrontpage',true),div);
  append(this.getCheckbox('settingsOutlineMap', 'printOutlineMap',true),div);
  append(this.getCheckbox('settingsOutlineMapSinge', 'printOutlineMapSingle',true),div);

  // default map

  return div;
};

Settings.prototype.getHeader = function(header){
  var div = createElement('div');
  div.innerHTML = "<h2 align='center'>"+header+"</h2>";
  return div;
};

Settings.prototype.getCheckbox = function(caption_lang, gmValue, dValue, isShort){
  var cb_span = createElement('div',{style:"border-bottom: 1px solid;lightgray;margin-bottom:10px;padding-bottom:3px;"});

  var cb = createElement('input',{type:'checkbox',style:'float:right'});append(cb,cb_span);
  cb.checked = GM_getValue(gmValue,dValue);
  cb.addEventListener('click',toggleBoolValue(gmValue,dValue), false);

  var cb_caption = createElement('span');
  append(cb_caption,cb_span);
  cb_caption.innerHTML = "<b>"+$.gctour.lang(caption_lang)+"</b>";
  if (!isShort) {
    cb_caption.innerHTML += "<br/><div style='margin-left:10px'>"+$.gctour.lang(caption_lang+'Desc')+"</div>";
  }

  return cb_span;
};

Settings.prototype.getSelectbox = function(value_array, gmValue, dValue, click_function){
  var select = document.createElement("select");
  select.style.width = "90%";
  select.style.margin = "0 5%";
  select.style.marginBottom = "5px";

  for(var array_i = 0; array_i<value_array.length; array_i++){
    var option = document.createElement("option");select.appendChild(option);

    var value = (typeof value_array[array_i] == "object")?value_array[array_i].value:value_array[array_i];
    var caption = (typeof value_array[array_i] == "object")?value_array[array_i].caption:value_array[array_i];

    option.value = value;
    option.innerHTML = caption;

    if (GM_getValue(gmValue,dValue) == value) {
      option.selected = 'selected';
    }

    option.addEventListener('click', click_function(value), false);
  }

  return select;
};

Settings.prototype.update = function(e) {
  var linkElement = e.target;

  // remove last active menu entry
  if(Settings.prototype.activelink){try{dojo.removeClass(Settings.prototype.activelink.parentNode, "activeTour");}catch(e){} }

  // set the current entry to active
  dojo.addClass(linkElement.parentNode, "activeTour");

  Settings.prototype.activelink = linkElement;

  var details = document.getElementById('dialogDetails');

  details.innerHTML = "";

  // search for the right group
  for(var i = 0; i<setting_groups.length;i++){
    if(setting_groups[i][0]  == linkElement.getAttribute('header')){
      details.appendChild(setting_groups[i][1]); // and call the function for it
      details.scrollTop=0;
    }
  }
};

