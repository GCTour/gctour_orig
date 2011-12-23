	function showSmilie() {
		$('#smilie')[0].style.visibility = ''; 
	}
	function hideSmilie() {
		$('#smilie')[0].style.visibility = 'hidden';
	}

	var currentBanner = -1;

	function hideBanner(){
		var banner = $('#banner')[0];
		 $(banner).fadeOut(1500);
		//banner.fade({ duration: 1.5 });
		setTimeout("showNextBanner()",1800);	
	}

	function showNextBanner(){
		var banner = $('#banner')[0];
		if((currentBanner + 1) == comments.length){
			currentBanner = 0;
		} else {
			currentBanner = currentBanner + 1;
		}		
		banner.innerHTML =  "<CITE>"+comments[currentBanner].comment+"</CITE><div>"+comments[currentBanner].name+"</div>";
		$(banner).fadeIn(1500);
		
		
		setTimeout("hideBanner()",15000);
	}

	$(document).ready(function(){
		showNextBanner();
	});

