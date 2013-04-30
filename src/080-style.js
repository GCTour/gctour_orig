/*
* CSS Container, run before init
*/
function initStyle(){

  // adding styles:
  GM_addStyle((""+
    "##includeallcssfiles##"+
    "")
    .replace("##dialogMaskImage##", $.gctour.img.dialogMask)
    .replace("##tabBgImage##", $.gctour.img.tabBg)
  );

}
