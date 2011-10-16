/*
* CSS Container, run before init
*/

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
