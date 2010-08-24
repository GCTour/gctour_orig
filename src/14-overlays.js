function getOverlay(caption){
    var bodyNew, head, verLay, overlayMarker, title, closeDiv, closeButton;

	bodyNew = document.getElementsByTagName('body')[0];	
	head = document.getElementsByTagName('head')[0];    
	overlayStyle = document.createElement('style');
	overlayStyle.type = 'text/css';
	overlayStyle.id = 'overlayStyle';
	overlayStyle.innerHTML = 'textarea{border:1px solid black;} .overlay_marker{max-height:90%;overflow:hidden;opacity:1;text-align:left; padding:10px;background-color:white;margin-top:40px;border:2px solid #8C9E65; -moz-border-radius-topright:30px;-moz-border-radius-topleft:30px;width:60%;color:black;} .tour_overlay  '+
		'{background:#666666 url('+backgroundStripeImage+') repeat scroll 50% 50%;color: #ffffff;opacity: 0.4;z-index: 9000;position: fixed;top: 0px;left: 0px;display: block;width: 100%;height: 100%;}'+
		'.label {float:left;padding:3px 0 0;width:10em;} .ebene {clear:both;padding-bottom:2px;padding-left:10px;padding-top:2px;} .feldbreite {font-size:1em;overflow:auto;width:30em;} .submit {clear:both;margin:1em 0 5px 11em; padding:2px; border-bottom: 1px solid gray}';
	//head.appendChild(overlayStyle); 


	overLay = document.createElement('div');
	overLay.align = 'center';
	overLay.className = 'dialogMask';
	overLay.id = "dialogMask";
	
	
	var dialogWrapper = document.createElement('div');
	dialogWrapper.className= "dialogBodyWrapper";
	dialogWrapper.id= "dialogBodyWrapper";
	
	var dialogBody = document.createElement('div');append(dialogBody,dialogWrapper);
	dialogBody.className= "dialogBody";
	
	var dialogHead =  document.createElement('h1');append(dialogHead,dialogBody);
	dialogHead.innerHTML = "<img style='float:left;position:relative;top:-3px;' src='"+gctourLogoImage+"'>"+caption;

		var closeButton = createElement('img', {style:"cursor:pointer;"});append(closeButton, dialogHead);
		closeButton.style.cssFloat = "right";
		closeButton.src = closebuttonImage;
		closeButton.addEventListener('click', closeOverlay, false);
		addOpacityEffects(closeButton);
		
	var dialogContent = document.createElement('div');append(dialogContent,dialogBody);
	dialogContent.className= "dialogContent";

	

	
	


	overlayMarker = document.createElement('div');
	overlayMarker.id = "overlayMarker";

	overlayMarker.style.zIndex='9999';
	overlayMarker.style.padding = '5px';
	overlayMarker.style.backgroundColor='#EEEEEE';
	overlayMarker.style.width='500px';
	overlayMarker.style.marginLeft = "-250px";

	overlayMarker.style.top='50px';
	overlayMarker.style.left='50%';
	overlayMarker.style.position='fixed';
	overlayMarker.style.maxHeight='90%';
	overlayMarker.style.overflow='auto';
	overlayMarker.style.overflowX='hidden';


	overlayMarker.style.top='25px';
	overlayMarker.align = 'center';
	overlayMarker.style.setProperty("-moz-border-radius", "6px", "");



	title = document.createElement('h2');
	title.style.background = "#F6A828";
	title.style.border = "1px solid #E78F08";
	title.style.padding = "2px";
	title.style.margin = "2px";
	title.style.setProperty("-moz-border-radius", "4px", "");

	title.textContent = caption;

	closeDiv = createElement('div', {style:"float:right;-moz-border-radius: 6px;border:1px solid #E78F08; background-color:#F6A828;padding:2px"});append(closeDiv,overlayMarker );
	closeButton = createElement('img', {style:"cursor:pointer;"});append(closeButton, closeDiv);
	closeButton.style.cssFloat = "right";
	closeButton.src = closebuttonImage;
	closeButton.addEventListener('click', closeOverlay, false);
	addOpacityEffects(closeButton);


	overlayMarker.appendChild(title);


	bodyNew.appendChild(overLay);
	bodyNew.appendChild(dialogWrapper);
//	bodyNew.appendChild(overlayMarker);

	return dialogContent;
	//~ overlayMarker.appendChild(content);
}

function closeOverlay(){
	dojo.destroy("dialogMask");
	dojo.destroy("dialogBodyWrapper");
}

function addErrorDialog(exception, errorString,theDocument){
    var body, overLayContent, overLayTitle, errorDiv, errorReport, buttons;

	body = theDocument.body;

	dojo.destroy("progressOverlay");


	overLayContent = document.createElement('div');
	overLayContent.id = 'progressOverlay';
	overLayContent.style.zIndex='9999';
	overLayContent.style.backgroundColor='#EEEEEE';
	overLayContent.style.width='40%';
	overLayContent.style.maxHeight = '90%';
	overLayContent.style.overflowX = 'hidden';
	overLayContent.style.overflowY = 'auto';

	
	
	overLayContent.style.marginLeft = "-20%";

	overLayContent.style.top='50px';
	overLayContent.style.left='50%';
	overLayContent.style.position='fixed';
	overLayContent.style.setProperty("-moz-border-radius", "6px", "");
	


	overLayTitle = document.createElement('div');
	overLayTitle.style.background = "#FC231E";
	overLayTitle.style.border = "1px solid #E70D08";
	overLayTitle.style.padding = "2px";
	overLayTitle.style.margin = "2px";
	overLayTitle.style.color = "white";
	overLayTitle.style.fontWeight = "bold";
	overLayTitle.style.setProperty("-moz-border-radius", "4px", "");
	overLayTitle.style.setProperty("-moz-user-select", "none", "");
	overLayTitle.innerHTML = errorString;
	overLayContent.appendChild(overLayTitle);

	errorDiv = document.createElement('div');
	errorDiv.style.padding = '5px';
	errorDiv.style.textAlign = 'left';

	
	errorReport = "last GCID: "+GM_getValue("debug_lastgcid","")+"\n";
	errorReport+= "error: "+errorString+"\n";
	errorReport+= "username: "+userName+"\n";
	errorReport+= "exception: "+exception+"\n";
	errorReport+= "useragent: "+unsafeWindow.navigator.userAgent+"\n";
	errorReport+= "gpxschema: "+GM_getValue('gpxschema',1)+"\n";
	errorReport+= "gpxhtml: "+GM_getValue('gpxhtml',true)+"\n";
	errorReport+= "tour:\n";
	errorReport+= uneval(currentTour)+"\n";
	errorReport+= "--------\n";
	errorReport+= GM_getValue('debug_lastcachesite',"");
	
	
	lang["ERROR_DIALOG"]=lang["ERROR_DIALOG"].replace(/##ERROR##/, '<br><div style="border: 1px dashed red;padding:3px;width: 98%;">'+GM_getValue("debug_lastgcid","")+':<b>'+exception+'</b></div>');
	
	errorDiv.innerHTML = ''+lang["ERROR_DIALOG"]+'<br>'+
		'<div style="border:1px solid gray;-moz-border-radius:4px; padding: 10px;margin:5px 0">'+
		'<div style=" margin: 2px; padding: 2px; background-color:gray;color: white; font-weight: bold;-moz-border-radius: 4px; "> Report </div>'+
		'<form action="http://gctour.madd.in/errorreport.php" method="post">'+
		'	<input type="hidden" name="redir" value="'+window.location+'">'+
		'	<input type="hidden" name="user" value="'+userName+'">'+
		'	'+lang['printviewNote']+':'+
		'	<textarea name="comment" cols="2" rows="2" style="width:100%;"></textarea>'+
		'	Details:'+
		'	<textarea name="report" cols="2" rows="10" style="width:100%;" >'+errorReport+'</textarea>'+
		'	<div align="right" style="margin-top:10px;"><button>'+lang["ERROR_REPORT_SUBMIT"]+'</button></div>'+
		'</form>';
		'</div>';
		
	buttons = dojo.query('input',errorDiv);
	
	// if we are on the main page - close only the error dialog
	if(theDocument == document){
		buttons[0].addEventListener('click',function(){removeOverlay(document);},false);
	} else { // if we are on the printview - close the whole window
		buttons[0].addEventListener('click',function(){theDocument.defaultView.close();},false);
	}


	overLayContent.appendChild(errorDiv);

	body.appendChild(overLayContent);
}


function addOverlay(theDocument, caption){
    var bodyNew, head, overLay, overLayContent, overLayTitle, progressBar, progressBarElement, cancelDiv, cancelButton;

	bodyNew = theDocument.getElementsByTagName('body')[0];	
	head = theDocument.getElementsByTagName('head')[0];    
	overlayStyle = theDocument.createElement('style');
	overlayStyle.type = 'text/css';
	overlayStyle.innerHTML = '.dark_msg_overlay {background:#666666 url('+backgroundStripeImage+') repeat scroll 50% 50%;color: #ffffff;opacity: 0.6;opacity: 0.6;z-index: 9998;position: fixed;top: 0px;left: 0px;display: block;width: 100%;height: 100%;}';
	head.appendChild(overlayStyle); 



	overLay = document.createElement('div');
	overLay.align = 'center';
	overLay.className = 'dark_msg_overlay';


	overLayContent = document.createElement('div');
	overLayContent.id = 'progressOverlay';
	overLayContent.style.zIndex='9999';
	overLayContent.style.backgroundColor='#EEEEEE';
	overLayContent.style.left='40%';
	overLayContent.style.top='50px';
	overLayContent.style.width='350px';
	overLayContent.style.position='fixed';
	overLayContent.align = 'center';
	overLayContent.style.setProperty("-moz-border-radius", "6px", "");


	overLayTitle = document.createElement('div');
	//~ overLayTitle.style.background = "#F6A828 url(http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/themes/ui-lightness/images/ui-bg_gloss-wave_35_f6a828_500x100.png) repeat-x scroll 50% 50%";
	overLayTitle.style.background = "#F6A828";
	overLayTitle.style.border = "1px solid #E78F08";
	overLayTitle.style.padding = "2px";
	overLayTitle.style.margin = "2px";
	overLayTitle.style.setProperty("-moz-border-radius", "4px", "");
	overLayTitle.style.setProperty("-moz-user-select", "none", "");
	overLayTitle.innerHTML = caption;
	overLayContent.appendChild(overLayTitle);

	progressBar = document.createElement('div');
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

	progressBarElement = document.createElement('div');
	progressBarElement.id = 'progressbar';
	progressBarElement.style.opacity = '0.6';
	progressBarElement.style.width = '0px';
	progressBarElement.style.height = '13px';
	progressBarElement.style.fontSize = '10px';
	progressBarElement.style.backgroundColor = '#E78F08';
	progressBarElement.style.position = 'absolute';
	progressBar.appendChild(progressBarElement);
	progressBarElement.style.setProperty("-moz-border-radius", "4px", "");

	overLayContent.appendChild(progressBar);

	cancelDiv = createElement('div', {style: "margin-top:7px"});append(cancelDiv, overLayContent);
	cancelButton = createElement('button');append(cancelButton, cancelDiv);
	cancelButton.innerHTML = lang["cancel"];
	cancelButton.addEventListener('click', function(e){
			this.disabled = true;
			GM_setValue("stopTask",true);
			},false);

	bodyNew.appendChild(overLay);
	bodyNew.appendChild(overLayContent);
}

function setProgress(i,count,theDocument){
    var width, progresBar;

	width = ((208 * (i+1))/count);

	progressBar = dojo.query("div[id='progressbar']",theDocument)[0];
	progressBar.style.width = width+'px';
	progressBar.innerHTML = "<b>"+(i+1)+"/"+count+"</b>";
}

function removeOverlay(theDocument) {
    var overLay, progressElement, body, head;

	overLay = theDocument.getElementsByClassName('dark_msg_overlay')[0];
	progressElement = overLay.nextSibling;

	body = theDocument.getElementsByTagName('body')[0];	
	head = theDocument.getElementsByTagName('head')[0];  

	head.removeChild(overlayStyle);
	body.removeChild(overLay);	
	body.removeChild(progressElement);	



}
