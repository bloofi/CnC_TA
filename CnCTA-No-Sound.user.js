"use strict";
// ==UserScript==
// @version     2020.04.20
// @name        CnCTA Fix Sound
// @downloadURL https://github.com/bloofi/CnC_TA/raw/master/CnCTA-No-Sound.user.js
// @updateURL   https://github.com/bloofi/CnC_TA/raw/master/CnCTA-No-Sound.user.js
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include     http*://cncapp*.alliances.commandandconquer.com/*/index.aspx*
// @author      bloofi (https://github.com/bloofi)
// ==/UserScript==
(function () {
    const script = () => {
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Game load state Checking
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function checkForInit() {
            try {
                if (typeof qx !== 'undefined' &&
                    qx &&
                    qx.core &&
                    qx.core.Init &&
                    qx.core.Init.getApplication &&
                    qx.core.Init.getApplication() &&
                    qx.core.Init.getApplication().initDone &&
                    typeof ClientLib !== 'undefined' &&
                    ClientLib &&
                    ClientLib.Sound &&
                    ClientLib.Sound.SoundMain &&
                    ClientLib.Sound.SoundMain.GetInstance &&
                    ClientLib.Sound.SoundMain.GetInstance() &&
                    ClientLib.Sound.SoundMain.GetInstance().set_AudioOn &&
                    ClientLib.Sound.SoundMain.GetInstance().add_AudioOnChanged) {
                    try {
                        ClientLib.Sound.SoundMain.GetInstance().set_AudioOn(false);
                        console.log('CnCTA Fix Sound > Audio set to false');
                        ClientLib.Sound.SoundMain.GetInstance().add_AudioOnChanged({
                            i: {
                                f: (a) => {
                                    if (a) {
                                        console.log('CnCTA Fix Sound > Sound ON detected');
                                        ClientLib.Sound.SoundMain.GetInstance().set_AudioOn(false);
                                    }
                                },
                            },
                        });
                        console.log('CnCTA Fix Sound > Listener added');
                    }
                    catch (e) {
                        console.log('CnCTA Fix Sound > Error adding listener', e);
                        window.setTimeout(checkForInit, 1000);
                    }
                }
                else {
                    window.setTimeout(checkForInit, 1000);
                }
            }
            catch (e) { }
        }
        checkForInit();
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
        }
        catch (e) {
            console.log('Failed to inject script', e);
        }
    }
})();
