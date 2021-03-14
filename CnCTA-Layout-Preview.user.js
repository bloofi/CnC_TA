"use strict";
// ==UserScript==
// @version	    2021.03.14
// @name        CnCTA Layout Preview
// @downloadURL https://github.com/bloofi/CnC_TA/raw/master/CnCTA-Layout-Preview.user.js
// @updateURL   https://github.com/bloofi/CnC_TA/raw/master/CnCTA-Layout-Preview.user.js
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include     http*://cncapp*.alliances.commandandconquer.com/*/index.aspx*
// @autohor     bloofi (https://github.com/bloofi)
// ==/UserScript==
(function () {
    const script = () => {
        const scriptName = 'CnCTA Layout Preview';
        const init = () => {
            ['RegionNPCCampStatusInfo', 'RegionNPCBaseStatusInfo', 'RegionCityStatusInfoAlliance', 'RegionCityStatusInfoOwn'].forEach(region => {
                if (!webfrontend.gui.region[region].prototype.__real_onCitiesChange) {
                    webfrontend.gui.region[region].prototype.__real_onCitiesChange = webfrontend.gui.region[region].prototype.onCitiesChange;
                    let checkCount = 0;
                    let checkTimeout = 0;
                    let currentIsLoading = false;
                    const layoutPreviewComponent = new qx.ui.container.Composite(new qx.ui.layout.Atom());
                    webfrontend.gui.region[region].getInstance().add(layoutPreviewComponent);
                    webfrontend.gui.region[region].prototype.onCitiesChange = function () {
                        try {
                            layoutPreviewComponent.removeAll();
                            const label = new qx.ui.basic.Label('').set({
                                rich: true,
                                value: 'Loading preview...',
                                wrap: true,
                                textColor: 'white',
                                textAlign: 'left',
                            });
                            layoutPreviewComponent.addAt(label, { edge: 'west' });
                            function checkCityIsLoaded() {
                                currentIsLoading = true;
                                try {
                                    if (checkTimeout) {
                                        clearTimeout(checkTimeout);
                                    }
                                    const city = ClientLib.Data.MainData.GetInstance()
                                        .get_Cities()
                                        .get_CurrentCity();
                                    if (city && city.get_OwnerId()) {
                                        checkCount = 0;
                                        currentIsLoading = false;
                                        const layout = getCityLayout(city);
                                        const grid = new qx.ui.container.Composite(new qx.ui.layout.Grid(1, 1));
                                        grid.set({
                                            width: 90,
                                            height: 80,
                                            backgroundColor: 'transparent',
                                        });
                                        for (let y = 0; y < 8; y++) {
                                            for (let x = 0; x < 9; x++) {
                                                const cell = new qx.ui.core.Widget();
                                                cell.set({
                                                    width: 9,
                                                    height: 8,
                                                });
                                                switch (layout[y][x]) {
                                                    case 't':
                                                        cell.set({ backgroundColor: 'green' });
                                                        break;
                                                    case 'c':
                                                        cell.set({ backgroundColor: 'blue' });
                                                        break;
                                                    default:
                                                        cell.set({ backgroundColor: 'silver' });
                                                        break;
                                                }
                                                grid.add(cell, { row: y, column: x });
                                            }
                                        }
                                        layoutPreviewComponent.removeAll();
                                        layoutPreviewComponent.add(grid, { edge: 'west' });
                                    }
                                    else {
                                        if (checkCount-- > 0) {
                                            checkTimeout = setTimeout(checkCityIsLoaded, 200);
                                        }
                                        else {
                                            currentIsLoading = false;
                                            checkTimeout = null;
                                            layoutPreviewComponent.removeAll();
                                            const label = new qx.ui.basic.Label('').set({
                                                rich: true,
                                                value: "Can't preview this layout",
                                                wrap: true,
                                                textColor: 'white',
                                                textAlign: 'left',
                                            });
                                            layoutPreviewComponent.add(label, { edge: 'west' });
                                        }
                                    }
                                }
                                catch (e) {
                                    console.log(scriptName, e);
                                }
                            }
                            const visObject = ClientLib.Vis.VisMain.GetInstance().get_SelectedObject();
                            if (visObject != null) {
                                checkCount = 10;
                                switch (visObject.get_VisObjectType()) {
                                    case ClientLib.Vis.VisObject.EObjectType.RegionCityType:
                                        // @ts-ignore
                                        switch (visObject.get_Type()) {
                                            // @ts-ignore
                                            case ClientLib.Vis.Region.RegionCity.ERegionCityType.Own:
                                            // @ts-ignore
                                            case ClientLib.Vis.Region.RegionCity.ERegionCityType.Alliance:
                                            // @ts-ignore
                                            case ClientLib.Vis.Region.RegionCity.ERegionCityType.Enemy:
                                                checkCityIsLoaded();
                                                break;
                                        }
                                        break;
                                    case ClientLib.Vis.VisObject.EObjectType.RegionNPCBase:
                                    case ClientLib.Vis.VisObject.EObjectType.RegionNPCCamp:
                                        checkCityIsLoaded();
                                        break;
                                }
                            }
                        }
                        catch (e) {
                            console.log(scriptName, e);
                        }
                        this.__real_onCitiesChange();
                    };
                    console.log(scriptName, ' > component loaded :', region);
                }
            });
        };
        function getCityLayout(city) {
            const res = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
            for (let y = 0; y < 20; y++) {
                for (let x = 0; x < 9; x++) {
                    switch (y > 16 ? 0 : city.GetResourceType(x, y)) {
                        case 0:
                            res[y][x] = '.';
                            break;
                        case 1: // Crystal
                            res[y][x] = 'c';
                            break;
                        case 2: // Tiberium
                            res[y][x] = 't';
                            break;
                        case 4: // Woods
                            res[y][x] = 'j';
                            break;
                        case 5: // Scrub
                            res[y][x] = 'h';
                            break;
                        case 6: // Oil
                            res[y][x] = 'l';
                            break;
                        case 7: // Swamp
                            res[y][x] = 'k';
                            break;
                        default:
                            res[y][x] = '.';
                            break;
                    }
                }
            }
            return res;
        }
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
                    qx.core.Init.getApplication().initDone) {
                    init();
                }
                else {
                    window.setTimeout(checkForInit, 1000);
                }
            }
            catch (e) {
                console.log(scriptName, e);
            }
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
