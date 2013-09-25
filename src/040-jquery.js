/*
* set jquery and ui
*/

(function () {

  var str = "";
  str += "jQuery und UI geladen = " + isjQuery;
  if (isjQuery) {
    str += "\n\tjQuery Version    = " + $.fn.jquery;
    str += "\n\tjQueryUI Version  = " + $.ui.version;
  }

//  str += "\n\tisunsafeWindow.jQuery = " + isjQueryWindow;
//  str += "\n\tunsafeWindow.jQuery Version = " + ((isjQueryWindow) ? unsafeWindow.jQuery.fn.jquery : "");

  str += "\n\tBrowser Opera ?   = " + isOpera;
//  str += "\n\tBrowser Mozilla ? = " + $.browser.mozilla;

  debug(str);
//  alert(str);

// init gctour object
$.gctour      = $.gctour || {};

// init language object
$.gctour.i18n = $.gctour.i18n || {};

// set default Language
$.gctour.defaultLang = 'en';

// init current language = default language
$.gctour.currentLang = $.gctour.defaultLang;


// +jquery ui dialog (default setting)
$.gctour.dialog         = $.gctour.dialog || {};

// default dialogs (http://api.jqueryui.com/dialog/)
$.extend($.gctour.dialog, {

  buttons: {

    'OK': {
      //text: $.gctour.lang('btn.OK') || 'OK',
      text: 'OK',
      disabled: false,
      click: function() {
        // $(this).dialog("close");
        $(this).dialog("destroy");
      }
    },

    'Schliessen': {
      //text: $.gctour.lang('btn.Schliessen') || 'Schliessen',
      text: 'Schliessen',
      disabled: false,
      icons: {
        primary: 'ui-icon-closethick'
      },
      click: function() {
        // $(this).dialog("close");
        $(this).dialog("destroy");
      }
    },

    'Abbrechen': {
      //text: $.gctour.lang('btn.Abbrechen') || 'Abbrechen',
      text: 'Abbrechen',
      disabled: false,
      click: function() {
        // $(this).dialog("close");
        $(this).dialog("destroy");
      }
    }
  },

  /*
  *  Standard Optionen für ein Dialog
  */
  basis: function() {
    return ({
      autoOpen: false,
      resizable: true,
      closeOnEscape: true,
      modal: true,
      closeText: $.gctour.lang('btn.Schliessen') || 'Schliessen',
      show: 'drop', // blind, drop, scale
      buttons: {
        'Schliessen': this.buttons.Schliessen
      },
      width: 700, height: 500,
      minWidth: 300, minHeight: 200,
      maxWidth: 1000, maxHeight: 700,
      title: 'GCTour',
      closeText: 'Schliessen',
      show: 'drop', // blind, drop, scale
      dialogClass: 'gct gct_dialog',
      open: function(event, ui) {
        //$(".ui-dialog-titlebar-close").hide();
        // $(this).dialog( "widget" ).find(".ui-dialog-titlebar-close").hide(); // x oben rechts ausblenden
        //$(".ui-widget-overlay").wrap('<div class="gct"></div>'); // wrap für bessere Trennung zu gc.com
      },
      beforeClose: function( event, ui ) {
        //if ( $(".ui-widget-overlay").parent().hasClass( "gct" ) ) {
        //  $(".ui-widget-overlay").unwrap();
        //}
      },
      close: function(event, ui) {
        $(this).dialog("destroy"); // diesen Dialog killen, weil immer ein neuer erstellt wird
      }
    });
  }

});


$.fn.addShadowEffect = function() {
  return this.each(function() {
    $(this).bind({
      mouseenter: function() {
        $(this).addClass( "imgShadow");
      },
      mouseleave: function() {
        $(this).removeClass( "imgShadow");
      }
    });
  });
};

$.fn.addOpacityEffect = function() {
  return this.each(function() {
    var $this = $(this);
    $this
      .css({opacity: "0.5"})
      .bind({
        mouseenter: function() {
          $this.stop().animate({opacity:'1'}, 300);
        },
        mouseleave: function() {
          $this.stop().animate({opacity:'0.5'}, 300);
        }
    });
  });
};

})();
