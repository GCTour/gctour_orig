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
