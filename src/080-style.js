/*
* CSS Container, run before init
*/
function initStyle(){

  // adding styles:
  GM_addStyle((""+
    "##includeallcssfiles##"+
    "")
    .replace("##dialogMaskImage##", dialogMaskImage)
    .replace("##tabBgImage##", tabBgImage)
  );

}
