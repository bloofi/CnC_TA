"use strict";
// ==UserScript==
// @version     2020.05.02
// @name        CnCTA BaseNavigationBar MR
// @downloadURL https://github.com/bloofi/CnC_TA/raw/master/CnCTA-BaseNavBar-MR.user.js
// @updateURL   https://github.com/bloofi/CnC_TA/raw/master/CnCTA-BaseNavBar-MR.user.js
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include     http*://cncapp*.alliances.commandandconquer.com/*/index.aspx*
// @author      bloofi (https://github.com/bloofi)
// ==/UserScript==
(function () {
    const script = () => {
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Game load state Checking
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const labels = {};
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
                    ClientLib) {
                    const basePanels = qx.core.Init.getApplication()
                        .getBaseNavigationBar()
                        .getChildren()[0]
                        .getChildren()[0]
                        .getChildren();
                    const checkForBases = () => {
                        const basePanels = qx.core.Init.getApplication()
                            .getBaseNavigationBar()
                            .getChildren()[0]
                            .getChildren()[0]
                            .getChildren();
                        if (basePanels.length > 1) {
                            basePanels.forEach(p => {
                                if (p.getBaseId && p.getBaseId()) {
                                    const label = new qx.ui.basic.Label('').set({
                                        textColor: '#cc0000',
                                    });
                                    labels[`base-${p.getBaseId()}`] = label;
                                    p.add(label, { bottom: 2, right: 0 });
                                }
                            });
                            setInterval(() => {
                                Object.values(ClientLib.Data.MainData.GetInstance()
                                    .get_Cities()
                                    .get_AllCities().d).forEach(c => {
                                    const time = c.get_MoveCooldownEndStep() -
                                        ClientLib.Data.MainData.GetInstance()
                                            .get_Time()
                                            .GetServerStep();
                                    if (c && time > 0) {
                                        const s = ClientLib.Data.MainData.GetInstance()
                                            .get_Time()
                                            .GetTimespanString(time, 0);
                                        labels[`base-${c.get_Id()}`].setValue(s);
                                    }
                                    else {
                                        labels[`base-${c.get_Id()}`].setValue('');
                                    }
                                });
                            }, 1000);
                        }
                        else {
                            setTimeout(checkForBases, 1000);
                        }
                    };
                    checkForBases();
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
