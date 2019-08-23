// ==UserScript==
// @name           BaseInfo v4 SpyCNC Connect
// @author         Bloofi / Spyingn01
// @icon           https://spy-cnc.fr/CNC/bi/bi4/favicon.png
// @description    Share your bases data and layout scans for a better game experience !
// @version        4.0.0
// @include        http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include        http*://cncapp*.alliances.commandandconquer.com/*/index.aspx*
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_registerMenuCommand
// @grant          unsafeWindow
// @grant          GM_xmlhttpRequest
// ==/UserScript==
(function() {

    try {
        console.log("BaseInfo v4 connect initialisation...");
        var spyCNC = document.createElement('script');
        var d = new Date();
        var n = d.getTime();
        spyCNC.type = 'text/javascript';
        spyCNC.Id = 'SPYCNC';
        spyCNC.async = true;
        spyCNC.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'spy-cnc.fr/CNC/bi/NJC/script_Data_v4.js?f='+n;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(spyCNC, s);
    } catch (e) {
        console.log("BaseInfo v4 connect error : ", e);
    }

})();

