// ==UserScript==
// @version	    2020.04.19
// @name        CnCTA Fix Unload
// @downloadURL https://github.com/bloofi/CnC_TA/raw/master/CnCTA-Fix-Unload.user.js
// @updateURL   https://github.com/bloofi/CnC_TA/raw/master/CnCTA-Fix-Unload.user.js
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include     http*://cncapp*.alliances.commandandconquer.com/*/index.aspx*
// @author      ShockrNZ (https://github.com/blacha)
//              bloofi (https://github.com/bloofi)
// ==/UserScript==

(function() {
    const script = () => {
        const fixedWindow = (window as any) as WindowFixed;
        fixedWindow._addEventListener = window.addEventListener;
        window.addEventListener = function(a: string, b: any, c?: any) {
            if (a == 'unload') {
                return;
            }
            return fixedWindow._addEventListener(a, b, c);
        };
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Script injection
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if (/commandandconquer\.com/i.test(document.domain)) {
        try {
            const script_block = document.createElement('script');
            script_block.innerHTML = `(${script.toString()})();`;
            script_block.type = 'text/javascript';
            document.getElementsByTagName('head')[0].appendChild(script_block);
        } catch (e) {
            console.log('Failed to inject script', e);
        }
    }
})();
