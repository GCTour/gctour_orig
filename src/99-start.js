// init the whole script - started with dojo
initDojo();

// check for updates
update();

// test for firefox >= 3.5
if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){ //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
 var ffversion=new Number(RegExp.$1) // capture x.x portion and store as a number
 if (ffversion < 3.5){
    alert("Sorry, but you are running 'Firefox "+ffversion+"' which is not supported anymore.\nPlease update to 'Firefox 3.5' or above to use GCTour!");
 }
}
