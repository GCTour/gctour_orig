/*
* CSS Container, run before init
*/
function initStyle(){

  // +jquery ui css + images
  var jqUI_CSS = GM_getResourceText ("jqUI_CSS"),
    reg,
    resources = {
      'animated-overlay.gif':                       GM_getResourceURL('jqui_img01'),
      'ui-bg_diagonals-thick_18_b81900_40x40.png':  GM_getResourceURL('jqui_img02'),
      'ui-bg_diagonals-thick_20_666666_40x40.png':  GM_getResourceURL('jqui_img03'),
      'ui-bg_flat_10_000000_40x100.png':            GM_getResourceURL('jqui_img04'),
      'ui-bg_glass_65_ffffff_1x400.png':            GM_getResourceURL('jqui_img05'),
      'ui-bg_glass_100_f6f6f6_1x400.png':           GM_getResourceURL('jqui_img06'),
      'ui-bg_glass_100_fdf5ce_1x400.png':           GM_getResourceURL('jqui_img07'),
      'ui-bg_gloss-wave_35_f6a828_500x100.png':     GM_getResourceURL('jqui_img08'),
      'ui-bg_highlight-soft_75_ffe45c_1x100.png':   GM_getResourceURL('jqui_img09'),
      'ui-bg_highlight-soft_100_eeeeee_1x100.png':  GM_getResourceURL('jqui_img10'),
      'ui-icons_228ef1_256x240.png':                GM_getResourceURL('jqui_img11'),
      'ui-icons_222222_256x240.png':                GM_getResourceURL('jqui_img12'),
      'ui-icons_ef8c08_256x240.png':                GM_getResourceURL('jqui_img13'),
      'ui-icons_ffd27a_256x240.png':                GM_getResourceURL('jqui_img14'),
      'ui-icons_ffffff_256x240.png':                GM_getResourceURL('jqui_img15')
    };

  //jqUI_CSS = jqUI_CSS.replace (/images\//g, "");
  $.each(resources, function(resName, resUrl) {
    //console.log(resourceName + ': ' + resourceUrl);
    reg = new RegExp('images/' + resName, "g"); // replaceAll
    jqUI_CSS = jqUI_CSS.replace( reg, resUrl);
  });

  // adding styles:
  GM_addStyle((""+
    jqUI_CSS+""+
    "##includeallcssfiles##"+
    "")
    .replace("##gctourLogo##", $.gctour.img.gctourLogo)
    .replace("##dialogMaskImage##", $.gctour.img.dialogMask)
    .replace("##tabBgImage##", $.gctour.img.tabBg)
  );

}
