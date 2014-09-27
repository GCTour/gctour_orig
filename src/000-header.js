// ==UserScript==
// @name         GC Tour
// @namespace    madd.in
// @version      @version@
// @build        @build@
// @description  Cachetour planing made easy. Pick some Caches, sort the list and print it out. Free for all users of geocaching.com!
// @run-at       document-end
// @include      http*://www.geocaching.com/*
// @include      http://gctour*.madd.in/map/show*#gui
// @exclude      /^https?://www\.geocaching\.com/(login|about|articles)/
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        unsafeWindow
// @copyright    2008 - 2014 Martin Georgi
// @author       madd.in
// @co-developer jens
// @icon         http://www.madd.in/geocaching/gm/gctourextension/icon.png
// @require      @url_require_jquery@
// @require      @url_require_ui@
// @resource     jqUI_CSS      @url_resource_cssui@
// @resource     jqui_img01    http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/ui-lightness/images/animated-overlay.gif
// @resource     jqui_img02    http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/ui-lightness/images/ui-bg_diagonals-thick_18_b81900_40x40.png
// @resource     jqui_img03    http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/ui-lightness/images/ui-bg_diagonals-thick_20_666666_40x40.png
// @resource     jqui_img04    http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/ui-lightness/images/ui-bg_flat_10_000000_40x100.png
// @resource     jqui_img05    http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/ui-lightness/images/ui-bg_glass_65_ffffff_1x400.png
// @resource     jqui_img06    http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/ui-lightness/images/ui-bg_glass_100_f6f6f6_1x400.png
// @resource     jqui_img07    http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/ui-lightness/images/ui-bg_glass_100_fdf5ce_1x400.png
// @resource     jqui_img08    http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/ui-lightness/images/ui-bg_gloss-wave_35_f6a828_500x100.png
// @resource     jqui_img09    http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/ui-lightness/images/ui-bg_highlight-soft_75_ffe45c_1x100.png
// @resource     jqui_img10    http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/ui-lightness/images/ui-bg_highlight-soft_100_eeeeee_1x100.png
// @resource     jqui_img11    http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/ui-lightness/images/ui-icons_228ef1_256x240.png
// @resource     jqui_img12    http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/ui-lightness/images/ui-icons_222222_256x240.png
// @resource     jqui_img13    http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/ui-lightness/images/ui-icons_ef8c08_256x240.png
// @resource     jqui_img14    http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/ui-lightness/images/ui-icons_ffd27a_256x240.png
// @resource     jqui_img15    http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/ui-lightness/images/ui-icons_ffffff_256x240.png
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// ==/UserScript==

/*****************************************************************************
 * Copyright (C) 2008, 2009, 2010, 2011, 2012, 2013 Martin Georgi
 *
 * This is free software; you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 3 of the License, or (at your option) any later
 * version.
 *
 * This is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Public License for more details
 *
 * To obtain a copy of the GNU General Public License, please see
 * <http://www.gnu.org.licenses/>
 *****************************************************************************/
