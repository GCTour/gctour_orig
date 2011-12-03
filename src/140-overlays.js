/* use of the overlays

var options = {
  caption: "Test Beschriftung",
  color: 'red',
  _document: document,
  minimized: true,
  closeCallback : function(_document){alert('oioio');}
}

getOverlay(options);

*/

function removeNode(id,theDocument){
  try{
    var node = theDocument.getElementById(id);
     dojo.destroy(node);

    //node.parentNode.removeChild(node);
  } catch(e){} // prevent error if id doesn't exist
}

function closeOverlayRemote(theDocument){
  return function(){
    removeNode("dialogMask",theDocument);
    removeNode("dialogBody",theDocument);
    removeNode("progressOverlay",theDocument);
  };
}

function getOverlay(options){
  var bodyNew, head, verLay, overlayMarker, title, closeDiv, closeButton, caption,theDocument,background_color;

  caption = options.caption;
  localDocument = options._document || document;
  background_color = options.color || "#B2D4F3";

  bodyNew = localDocument.getElementsByTagName('body')[0];
  head = localDocument.getElementsByTagName('head')[0];

  // first - close all old overlays
  closeOverlayRemote(localDocument)();

  overLay = localDocument.createElement('div');
  overLay.align = 'center';
  overLay.className = 'dialogMask';
  overLay.id = "dialogMask";

  var dialogBody = localDocument.createElement('div');
  dialogBody.id= "dialogBody";
  dialogBody.className= "dialogBody header";
  if(options.minimized){dialogBody.className += " dialogMin";}

  var dialogHead =  localDocument.createElement('h1');
  append(dialogHead,dialogBody);
  dialogHead.style.backgroundColor = background_color;

  var icon = "<img style='float:left;position:relative;top:-3px;' src='"+gctourLogoImage+"'>";
  dialogHead.innerHTML = icon+caption;

  closeButton = createElement('img', {style:"cursor:pointer;"});
  append(closeButton, dialogHead);
  closeButton.style.cssFloat = "right";
  closeButton.src = closebuttonImage;

  var closeFunction = options.closeCallback || closeOverlayRemote;
  closeButton.addEventListener('click',closeFunction(localDocument), false);
  //addOpacityEffects(closeButton);

  var dialogContent = localDocument.createElement('div');
  append(dialogContent,dialogBody);
  dialogContent.className= "dialogContent";

  bodyNew.appendChild(overLay);
  bodyNew.appendChild(dialogBody);

  return dialogContent;
}

function closeOverlay(){
  closeOverlayRemote(document)();
}

function getListOverlay(options){
  var overlay = getOverlay(options);
  var list = createElement('div',{id:"dialogListContainer"});
  append(list,overlay);

  var listUl = createElement('ul');
  listUl.setAttribute("class", "dialogList");
  append(listUl,list);

  var details = createElement('div',{id:"dialogDetails"});
  append(details,overlay);

  var dialogFooter = createElement('div',{style:"width:480px;position: absolute; bottom: 10px;"});
  append(dialogFooter,overlay);
  dialogFooter.setAttribute('class','dialogFooter');

  var close = createElement('input',{type:"button",value:$.gctour.lang('close'),style:"background-image:url("+saveImage+")"});
  append(close,dialogFooter);
  close.addEventListener('click', closeOverlay, false);

  return [listUl, details];
}

function addErrorDialog(options){
  var body, localDocument, overLayContent, overLayTitle, errorDiv, errorReport, buttons;

  localDocument = options._document || document;

  closeOverlay();
  options.minimized = true;
  options.color  = "#f00";

  var overlay = getOverlay(options);


    // expects a post with this fields:
    //    - redir: url to redirectory after sending
    //    - version: 2.1.11293
    //    - exception: TypeError: dojo.query("span[id=\"ctl00_ContentBody_LatLon\"]", element)[0] is undefined
    //    - gccode: GC2W6GG
    //    - errorSource: Upload tour error
    //    - username: MOKA28
    //    - userAgent: Mozilla/5.0 (Windows NT 6.1; rv:7.0.1) Gecko/20100101 Firefox/7.0.1
    //    - lastTour:  {"id":43,"name":"Limes","geocaches":[{"id":"GC2W6GG","name":"Limesturm","guid":"61e421f5-c68b-43be-9257-648648c0deac","image":"http://www.geocaching.com/images/WptTypes/sm/3.gif"},{"id":"GC1TN89","name":"Brunnencache - im Strütbachtal","guid":"badf0b94-9986-406e-a809-531d8289421a","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC15YWV","name":"Porta Caracalla","guid":"606441b0-1988-4ca4-8c50-cc202fed92bb","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"},{"id":"GC2QF45","name":"Strütbachreiter I","guid":"ff785a18-7ea3-4dc8-8608-ccb5f143bedd","image":"http://www.geocaching.com/images/WptTypes/sm/3.gif"},{"id":"GC2EPR0","name":"Rainau-Buch - Nähe Grill/Spielplatz","guid":"8c84156d-3969-4663-a878-2b5da0163bd9","image":"http://www.geocaching.com/images/WptTypes/sm/2.gif"}]}


    errorReport =
      '<input type="hidden" name="version" value="'+VERSION+'.'+BUILD+'" >'+
      '<input type="hidden" name="exception" value="'+options._exception+'" >'+
      '<input type="hidden" name="gccode" value="'+GM_getValue("debug_lastgcid","")+'" >'+
      '<input type="hidden" name="errorSource" value="'+options.caption+'" >'+
      '<input type="hidden" name="username" value="'+userName+'" >'+
      '<input type="hidden" name="userAgent" value="'+unsafeWindow.navigator.userAgent+'" >'+
      '<input type="hidden" name="lastTour" value="'+encodeURI(JSON.stringify(currentTour))+'">';

  var error_dialog =$.gctour.lang('ERROR_DIALOG').replace(/##ERROR##/, '<br/><div style="border: 1px dashed red;padding:3px;width: 98%;">'+GM_getValue("debug_lastgcid","")+':<b>'+options._exception+'</b></div>');
  error_dialog = error_dialog.replace(/##LOCATION##/,window.location);
  error_dialog = error_dialog.replace(/##ERRORREPORT##/,errorReport);

  errorDiv = document.createElement('div');
  errorDiv.style.padding = '5px';
  errorDiv.style.textAlign = 'left';
  errorDiv.innerHTML = error_dialog;
  buttons = dojo.query('input',errorDiv);

  // if we are on the main page - close only the error dialog
  if(localDocument == document){
    buttons[buttons.length-2].addEventListener('click',closeOverlayRemote(localDocument),false);
  } else { // if we are on the printview - close the whole window
    //buttons[buttons.length-2].addEventListener('click',function(){theDocument.defaultView.close();},false);
    buttons[buttons.length-2].addEventListener('click',function(){localDocument.defaultView.close();},false);
  }

  overlay.appendChild(errorDiv);

  // bind update check with link
  $("#gctour_update_error_dialog").bind('click', function() {
    update(true);
  });

}

function addProgressbar(options){
  var overlay;
  if(options){
    var theDocument = options._document || document;
    var theCaption = options.caption || $.gctour.lang('pleaseWait');

    if(options.closeCallback){
      overlay = getOverlay({caption:theCaption,minimized:true,_document:theDocument,closeCallback:options.closeCallback});
    } else {
      overlay = getOverlay({caption:theCaption,minimized:true,_document:theDocument});
    }

  } else {
    overlay = getOverlay({caption:$.gctour.lang('pleaseWait'),minimized:true,_document:document});
  }

  var progressBarContainer = document.createElement('div');
  append(progressBarContainer,overlay);
  progressBarContainer.style.marginLeft = "135px";

  var progressBar = document.createElement('div');
  append(progressBar,progressBarContainer);
  progressBar.style.border = '1px solid lightgray';
  progressBar.style.height = '13px';
  progressBar.style.width = '208px';
  progressBar.style.cssFloat = 'left';
  progressBar.style.margin = '10px';
  progressBar.style.align = 'center';
  progressBar.style.lineHeight = '13px';
  progressBar.style.verticalAlign = 'middle';
  progressBar.style.background = "url(http://madd.in/ajax-loader2.gif)";
  progressBar.style.setProperty("-moz-border-radius", "4px", "");
  progressBar.style.setProperty("border-radius", "4px", "");

  var progressBarElement = document.createElement('div');
  append(progressBarElement,progressBarContainer);
  progressBarElement.id = 'progressbar';
  progressBarElement.style.opacity = '0.6';
  progressBarElement.style.width = '0px';
  progressBarElement.style.height = '13px';
  progressBarElement.style.fontSize = '10px';
  progressBarElement.style.backgroundColor = '#E78F08';
  progressBarElement.style.position = 'absolute';
  progressBarElement.style.margin = '11px';
  progressBarElement.align = 'center';
  progressBarElement.style.setProperty("-moz-border-radius", "4px", "");
  progressBarElement.style.setProperty("border-radius", "4px", "");

}

function setProgress(i,count,theDocument){
  var width = ( (208 * (i+1) ) / count);
  $("#progressbar", theDocument)
    .css('width', width)
    .html("<b>" + (i+1) + "/" + count + "</b>");
}
