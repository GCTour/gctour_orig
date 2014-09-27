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
    var i18n = $.gctour.i18n,
        cur  = $.gctour.currentLang,
        def  = $.gctour.defaultLang,
        i, arr, lang, trans, cur_trans, def_trans;

    // Übersetzungssuchstring ggf. splitten für Objekte
    arr = str.split(".");

    cur_trans = i18n[cur] || false;
    def_trans = i18n[def] || false;

    // Versuch die Übersetzung zu holen
    // 'boolean' : false => wird richtig ausgegeben
    for (i = 0; i < arr.length; i++) {
      cur_trans = (cur_trans && (cur_trans[arr[i]] !== undefined)) ? cur_trans[arr[i]] : undefined;
      def_trans = (def_trans && (def_trans[arr[i]] !== undefined)) ? def_trans[arr[i]] : undefined;
    }

    // Check ob Übersetzung erfolgreich geholt werden konnte
    trans = (cur_trans !== undefined) ? cur_trans :
              (def_trans !== undefined) ? def_trans :
                ((DEBUG_MODE === true) ? "NO LANGUAGE" : "");

    // debug info current language
    if (!i18n[cur]) {
      debug("ERROR: language '" + cur + "' is undefined");
    } else if (cur_trans === undefined) {
      debug("ERROR: active language (" + cur + "), search '" + str + "' is undefined");
    }

    // debug info current language
    if (!i18n[def]) {
      debug("ERROR: language '" + def + "' is undefined");
    } else if (def_trans === undefined) {
      debug("ERROR: default language (" + def + "), search '" + str + "' is undefined");
    }

    return trans;
  };

})();
