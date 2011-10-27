/*
* CSS Container, run before init
*/
function initStyle(){

	// adding styles:
	GM_addStyle(
		'.dojoDndAvatar {font-size: 75%; color: black;min-width:130px;z-index: 100003 !important;width:180px}'+
		'.dojoDndAvatar .controls{display:none;}'+
		'.dojoDndAvatarHeader td	{padding-left: 20px; padding-right: 4px;}'+
		'.dojoDndAvatarHeader	{background: #ccc;}'+
		'.dojoDndAvatarItem		{background: #eee;}'+
		'.dojoDndItemBefore		{border-top:3px solid gray !important; }'+
		'.dojoDndItemAfter		{border-bottom:3px solid gray !important;}'+
		'.dojoDndItemOver		{background-color:#edf1f8}'+
		'.dojoDndMove .dojoDndAvatarHeader	{background-image: url(http://ajax.googleapis.com/ajax/libs/dojo/1.2.0/dojo/resources/images/dndNoMove.png); background-repeat: no-repeat;}'+
		'.dojoDndCopy .dojoDndAvatarHeader	{background-image: url(http://ajax.googleapis.com/ajax/libs/dojo/1.2.0/dojo/resources/images/dndNoCopy.png); background-repeat: no-repeat;}'+
		'.dojoDndMove .dojoDndAvatarCanDrop .dojoDndAvatarHeader	{background-image: url(http://ajax.googleapis.com/ajax/libs/dojo/1.2.0/dojo/resources/images/dndMove.png); background-repeat: no-repeat;}'+
		'.dojoDndCopy .dojoDndAvatarCanDrop .dojoDndAvatarHeader	{background-image: url(http://ajax.googleapis.com/ajax/libs/dojo/1.2.0/dojo/resources/images/dndCopy.png); background-repeat: no-repeat;}'
	);


	// dialog styles
	GM_addStyle(
		'.dialogMask {background-image:url('+dialogMaskImage+');height:100%;left:0;opacity:0.7;position:fixed;top:0;width:100%;z-index:9000000;}'+
		'.dialogBody{-moz-border-radius:5px;background:none repeat scroll 0 0 #fff;border:1px solid #333333;color:#333333;cursor:default;font-family:Arial;font-size:12px;left:50%;margin-left:-250px;margin-top:20px;padding:0 0 1em;position:fixed;text-align:left;top:0;width:500px;z-index:9000010;max-height:85%;min-height:370px;overflow:auto;}'+
		'.dialogBody p {font-size:12px;font-weight:normal;margin:1em 0em;}'+
		'.header h1{background-color:#B2D4F3;background-repeat:repeat-x;font-size:110% !important;font-family:Helvetica Neue,Arial,Helvetica,sans-serif;margin-bottom:0.2em;margin-top:0;padding:0.5em;-moz-border-radius:5px 5px 0px 0px;color:#333333;background-image:url("'+tabBgImage+'")}'+
		//'.dialogBody h1{background-color:#7A7A7A;border-bottom:1px solid #333333;font-size:110%;font-family:Helvetica Neue,Arial,Helvetica,sans-serif;margin-bottom:0.2em;padding:0.5em;-moz-border-radius:5px 5px 0px 0px;color:#fff;}'+
		'.dialogHistory {border:1px inset #999999;margin:0 1em 1em;padding-bottom: 1em;max-height: 200px;overflow-y:auto;width:448px;padding-left:1em;}'+
		'.dialogHistory ul{margin-left:2em;}'+
		'.dialogHistory li{list-style-type:circle;}'+
		'.dialogFooter input{-moz-border-radius:3px;background:none no-repeat scroll 4px center #EEEEEE;border:1px outset #666666;cursor:pointer;float:right;margin-left:0.5em;padding:3px 5px 5px 20px;min-width:100px;font-size: 12px;}'+
		'.dialogFooter input:hover { background-color:#f9f9f9; }'+
		'.dialogContent {padding:0px 10px 0px 10px;}'+
		'.dialogMin {min-height:0px !important}'
	);


	// opent tour dialog styles:
	GM_addStyle(
		"#dialogDetails {height:294px;padding:3px;overflow:auto;background-color:#eff4f9;border:1px solid #C0CEE3; -moz-border-radius: 0px 5px 5px 0px;width:324px;position: absolute; right: 10px;}\
		 .dialogList li{font-size:10px;padding:3px;clear:both;list-style-type: none;}\
		 .dialogList {margin:0;padding:0}\
		 .activeTour {border: 1px solid #C0CEE3;-moz-border-radius: 5px 0px 0px 5px;background-color:#eff4f9;padding:1px;}\
		 #dialogListContainer {height:300px;overflow:auto;width:150px;position: absolute; left: 10px;} \
		"
	);

	// cache counter styles:
	GM_addStyle(
		".unselectable {\
			-o-user-select: none;\
			-webkit-user-select: none;\
			-moz-user-select: -none;\
			-khtml-user-select: none;\
			user-select: none;\
		}\
		#cacheList .counter {\
			position:absolute;\
			right:4px;\
			bottom: 0px;\
			z-index:0;\
			overflow:hidden;\
			font: normal 24px arial,sans-serif;\
			color: #d5d5d5;\
			text-align:right;\
			text-shadow: 1px 1px 1px #C0C0C0;\
			vertical-align: text-bottom;\
			background-color: transparent;\
			margin-right:0px;\
			margin-bottom:0px;\
			padding: 0;\
		}"
	);


/*
// ECMAScript for XML (E4X)
// It is not supported by Opera ):
// http://en.wikipedia.org/wiki/ECMAScript_for_XML#Browser_support
// ToDo: Überlegung es mit jQuery zu konvertieren

	// adding Dojo styles:
	// **********************************************
	GM_addStyle( (<><![CDATA[
		.dojoDndAvatar {
			font-size: 75%;
			color: black;
			min-width:130px;
			z-index: 100003 !important;
			width:180px;
		}
		.dojoDndAvatar .controls{ display:none; }
		.dojoDndAvatarHeader td {
			padding-left: 20px;
			padding-right: 4px;
		}
		.dojoDndAvatarHeader { background: #ccc; }
		.dojoDndAvatarItem   { background: #eee; }
		.dojoDndItemBefore   { border-top:3px solid gray !important; }
		.dojoDndItemAfter    { border-bottom:3px solid gray !important; }
		.dojoDndItemOver     { background-color:#edf1f8; }
		.dojoDndMove .dojoDndAvatarHeader {
			background-image: url("@pathdojoimages@dndNoMove.png");
			background-repeat: no-repeat;
		}
		.dojoDndCopy .dojoDndAvatarHeader {
			background-image: url("@pathdojoimages@dndNoCopy.png");
			background-repeat: no-repeat;
		}
		.dojoDndMove .dojoDndAvatarCanDrop .dojoDndAvatarHeader {
			background-image: url("@pathdojoimages@dndMove.png");
			background-repeat: no-repeat;
		}
		.dojoDndCopy .dojoDndAvatarCanDrop .dojoDndAvatarHeader {
			background-image: url("@pathdojoimages@dndCopy.png");
			background-repeat: no-repeat;
		}

	  ]]></>).toString()
			.replace(/@pathdojoimages@/g, "http://ajax.googleapis.com/ajax/libs/dojo/1.2.0/dojo/resources/images/")
	);


	// adding dialog styles:
	// **********************************************
	GM_addStyle( (<><![CDATA[
		.dialogMask {
		  background-image:url("@dialogMaskImage@");
			height:100%;
			width:100%;
			top:0;
			left:0;
			opacity:0.7;
			position:fixed;
			z-index:9000000;
		}
		.dialogBody{
			-moz-border-radius:5px;
			background:none repeat scroll 0 0 #fff;
			border:1px solid #333333;
			color:#333333;
			cursor:default;
			font-family:Arial;
			font-size:12px;
			left:50%;
			margin-left:-250px;
			margin-top:20px;
			padding:0 0 1em;
			position:fixed;
			text-align:left;
			top:0;
			width:500px;
			z-index:9000010;
			max-height:85%;
			min-height:370px;
			overflow:auto;
		}
		.dialogBody p {
			font-size:12px;
			font-weight:normal;
			margin:1em 0em;
		}
		.header h1{
			background-color:#B2D4F3;
			background-repeat:repeat-x;
			font-size:110% !important;
			font-family:Helvetica Neue,Arial,Helvetica,sans-serif;
			margin-bottom:0.2em;
			margin-top:0;
			padding:0.5em;
			-moz-border-radius:5px 5px 0px 0px;
			color:#333333;
			background-image:url("@tabBgImage@")
		}
    // .dialogBody h1{background-color:#7A7A7A;border-bottom:1px solid #333333;font-size:110%;font-family:Helvetica Neue,Arial,Helvetica,sans-serif;margin-bottom:0.2em;padding:0.5em;-moz-border-radius:5px 5px 0px 0px;color:#fff;}
		.dialogHistory {
			border:1px inset #999999;
			margin:0 1em 1em;
			padding-bottom: 1em;
			max-height: 200px;
			overflow-y:auto;
			width:448px;
			padding-left:1em;
		}
		.dialogHistory ul{margin-left:2em;}
		.dialogHistory li{list-style-type:circle;}
		.dialogFooter input{
			-moz-border-radius:3px;
			background:none no-repeat scroll 4px center #EEEEEE;
			border:1px outset #666666;
			cursor:pointer;
			float:right;
			margin-left:0.5em;
			padding:3px 5px 5px 20px;
			min-width:100px;
			font-size: 12px;
		}
		.dialogFooter input:hover {background-color:#f9f9f9;}
		.dialogContent {padding:0px 10px 0px 10px;}
		.dialogMin {min-height:0px !important}
	  ]]></>).toString()
			.replace("@dialogMaskImage@", dialogMaskImage)
			.replace("@tabBgImage@", tabBgImage)
	);

	// opent tour dilaog styles:
	// **********************************************
	GM_addStyle( (<><![CDATA[
		#dialogDetails {
			height:294px;
			padding:3px;
			overflow:auto;
			background-color:#eff4f9;
			border:1px solid #C0CEE3;
			-moz-border-radius: 0px 5px 5px 0px;
			width:324px;
			position: absolute;
			right: 10px;
		}
		.dialogList li{
			font-size:10px;
			padding:3px;
			clear:both;
			list-style-type: none;
		}
		.dialogList {margin:0;padding:0}
		.activeTour {
			border: 1px solid #C0CEE3;
			-moz-border-radius: 5px 0px 0px 5px;
			background-color:#eff4f9;
			padding:1px;
		}
		#dialogListContainer {
			height:300px;
			overflow:auto;
			width:150px;
			position: absolute;
			left: 10px;
		}

		]]></>).toString()
	);
*/

}
