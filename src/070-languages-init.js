(function () {

/*
  $.each( $.gctour.i18n, function( l, o ) {
    alert( ((o.name) || "unbekannt") );
    //$.each( o, function( key, trans ) {
    //  alert( key  + " : "  + trans );
    //});
  });
*/

  /*
    return translate from [language][str]
    is language or str undefined = return ""
  */
  $.gctour.lang = function(str){

    var i18n  = $.gctour.i18n,
        cur   = $.gctour.currentLang,
        def   = $.gctour.defaultLang,
        trans = (i18n[cur] && i18n[cur][str]) ||  // current
                (i18n[def] && i18n[def][str]) ||  // default
                ((DEBUG_MODE === true) ? "NO LANGUAGE" : "");

    // debug info current language
    if (!i18n[cur]) {
      debug("ERROR: language '" + cur + "' is undefined");
    } else if (!i18n[cur][str]) {
      debug("ERROR: active language (" + cur + "), search '" + str + "' is undefined");
    }

    // debug info current language
    if (!i18n[def]) {
      debug("ERROR: language '" + def + "' is undefined");
    } else if (!i18n[def][str]) {
      debug("ERROR: default language (" + cur + "), search '" + str + "' is undefined");
    }

    return trans;
  };

})();
