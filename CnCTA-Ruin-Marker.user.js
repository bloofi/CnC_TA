"use strict";
// ==UserScript==
// @version	    2020.05.07
// @name        CnCTA Ruin Marker
// @author      bloofi (https://github.com/bloofi)
// @downloadURL https://github.com/bloofi/CnC_TA/raw/master/CnCTA-Ruin-Marker.user.js
// @updateURL   https://github.com/bloofi/CnC_TA/raw/master/CnCTA-Ruin-Marker.user.js
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include     http*://cncapp*.alliances.commandandconquer.com/*/index.aspx*
// ==/UserScript==
(function () {
    const script = () => {
        const scriptName = 'CnCTA Ruin Marker';
        const init = () => {
            const icons = {
                skull: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAE82lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA0LTI3VDE0OjU1OjI0KzAyOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNS0wN1QwMjozMjo1OSswMjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNS0wN1QwMjozMjo1OSswMjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ZTYyNTc3ZjYtOTlhNS1hMTRiLWE1YjEtNzhlMWE2MDE2ZjFhIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOmU2MjU3N2Y2LTk5YTUtYTE0Yi1hNWIxLTc4ZTFhNjAxNmYxYSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmU2MjU3N2Y2LTk5YTUtYTE0Yi1hNWIxLTc4ZTFhNjAxNmYxYSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZTYyNTc3ZjYtOTlhNS1hMTRiLWE1YjEtNzhlMWE2MDE2ZjFhIiBzdEV2dDp3aGVuPSIyMDIwLTA0LTI3VDE0OjU1OjI0KzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+iqRGsAAAAWpJREFUOMuN08srhGEUx/FpNmNhxYaEDcmOEREz/BNS5NJkQbkulcaKWLIk467BykYu0SxIuUUuiwmxVyhZKb6nfm+N18xk8annPc95znN9PV+PYY9LMRZwhhOx9jyK3PnuwYN4xzQCyJOAYm/KSVpgAJ+oS7Iqh/V9oN9doErVK9IMdpThBZVOgVKsY+0fgx0byi+xj2EcIajONoSRnzDA2iPqs+8GHGLIPlZwgUyM4Q4HOIcPGWrvq29UuTZm2QrMYBONOEWWZplDnw4soli2rrUJO5i14CS20Kz7LlByFF3oVttihcppwTamLLiEay3XZoxrlljCGcQUiyvHpzGL1tmhPY4nHJAt24tO8SpWr5wJraTdmcGPK9yjR7EafEutYr14wKXew5+nbP/Artq5KlKNHMX2lJPyXwjZvlCOVi05qPv367xC6QrYwBu8YlVXGdFbsdits/RUBZy927Ud4xlPake1nV/5PzzsrjYOnc9FAAAAAElFTkSuQmCC',
            };
            let gridWidth = null;
            let gridHeight = null;
            let baseMarkerWidth = null;
            let baseMarkerHeight = null;
            let regionZoomFactor = null;
            const markers = {};
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // Markers
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            const removeMarkers = () => {
                Object.entries(markers)
                    .filter(m => !!m[1])
                    .forEach(m => {
                    removeMarker(m[1].x, m[1].y);
                });
            };
            const removeMarker = (x, y) => {
                if (markers[`${x}:${y}`] && markers[`${x}:${y}`].marker) {
                    qx.core.Init.getApplication()
                        .getDesktop()
                        .remove(markers[`${x}:${y}`].marker);
                    markers[`${x}:${y}`].marker.dispose();
                    clearInterval(markers[`${x}:${y}`].interval);
                    markers[`${x}:${y}`] = null;
                    delete markers[`${x}:${y}`];
                }
            };
            const updateMarkerSize = () => {
                gridWidth = ClientLib.Vis.VisMain.GetInstance()
                    .get_Region()
                    .get_GridWidth();
                gridHeight = ClientLib.Vis.VisMain.GetInstance()
                    .get_Region()
                    .get_GridHeight();
                regionZoomFactor = ClientLib.Vis.VisMain.GetInstance()
                    .get_Region()
                    .get_ZoomFactor();
                baseMarkerWidth = regionZoomFactor * gridWidth;
                baseMarkerHeight = regionZoomFactor * gridHeight;
            };
            const repositionMarkers = () => {
                updateMarkerSize();
                Object.entries(markers).forEach(m => {
                    m[1].marker.setDomLeft(ClientLib.Vis.VisMain.GetInstance().ScreenPosFromWorldPosX(m[1].x * gridWidth));
                    m[1].marker.setDomTop(ClientLib.Vis.VisMain.GetInstance().ScreenPosFromWorldPosY(m[1].y * gridHeight));
                });
            };
            const resizeMarkers = () => {
                updateMarkerSize();
            };
            const addMarker = (x, y, timeLeft) => {
                const marker = new qx.ui.container.Composite(new qx.ui.layout.Dock());
                const label = new qx.ui.basic.Label('').set({
                    decorator: new qx.ui.decoration.Decorator().set({
                        color: 'rgba(0,0,0,0)',
                        style: 'solid',
                        width: 1,
                        radius: Math.floor(baseMarkerWidth / 10),
                    }),
                    textColor: '#ffffff',
                    textAlign: 'center',
                    backgroundColor: 'rgba(200,21,21,0.8)',
                    font: new qx.bom.Font(10, ['Arial']),
                    rich: true,
                    wrap: false,
                    padding: 3,
                    allowGrowX: true,
                    allowShrinkX: false,
                });
                marker.add(label, { edge: 'north' });
                qx.core.Init.getApplication()
                    .getDesktop()
                    .addAfter(marker, qx.core.Init.getApplication().getBackgroundArea(), {
                    left: ClientLib.Vis.VisMain.GetInstance().ScreenPosFromWorldPosX(x * gridWidth),
                    top: ClientLib.Vis.VisMain.GetInstance().ScreenPosFromWorldPosY(y * gridHeight),
                });
                markers[`${x}:${y}`] = {
                    x,
                    y,
                    timeLeft,
                    marker,
                    interval: null,
                };
                markers[`${x}:${y}`].interval = setInterval(() => {
                    if (markers[`${x}:${y}`]) {
                        markers[`${x}:${y}`].timeLeft = markers[`${x}:${y}`].timeLeft - 1;
                        if (markers[`${x}:${y}`].timeLeft > 0) {
                            markers[`${x}:${y}`].marker.getChildren()[0].setValue(ClientLib.Data.MainData.GetInstance()
                                .get_Time()
                                .GetTimespanString(markers[`${x}:${y}`].timeLeft, 0));
                        }
                        else {
                            clearInterval(markers[`${x}:${y}`].interval);
                            qx.core.Init.getApplication()
                                .getDesktop()
                                .remove(markers[`${x}:${y}`].marker);
                            markers[`${x}:${y}`] = null;
                        }
                    }
                }, 1000);
            };
            phe.cnc.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance().get_Region(), 'ZoomFactorChange', ClientLib.Vis.ZoomFactorChange, this, resizeMarkers);
            phe.cnc.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance().get_Region(), 'PositionChange', ClientLib.Vis.PositionChange, this, repositionMarkers);
            updateMarkerSize();
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // City Menu Integration
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (!webfrontend.gui.region.RegionCityMenu.prototype.__ruinMarker_real_showMenu) {
                webfrontend.gui.region.RegionCityMenu.prototype.__ruinMarker_real_showMenu = webfrontend.gui.region.RegionCityMenu.prototype.showMenu;
            }
            webfrontend.gui.region.RegionCityMenu.prototype.showMenu = function (obj) {
                try {
                    const self = this;
                    self.__ruinMarkerObj = obj;
                    if (this.__ruinMarker_initialized != 1) {
                        this.__ruinMarker_initialized = 1;
                        for (let i in this) {
                            try {
                                if (this[i] && this[i].basename == 'Composite') {
                                    // Button add
                                    this.__ruinMarkerButton = new qx.ui.form.Button('Mark Ruin', icons.skull).set({
                                        enabled: false,
                                    });
                                    this.__ruinMarkerButton.addListener('execute', function () {
                                        qx.core.Init.getApplication()
                                            .getBackgroundArea()
                                            .closeCityInfo();
                                        if (self.__ruinMarkerObj.get_VisObjectType() === ClientLib.Vis.VisObject.EObjectType.RegionRuin) {
                                            if (!markers[`${self.__ruinMarkerObj.get_RawX()}:${self.__ruinMarkerObj.get_RawY()}`]) {
                                                const createStep = self.__ruinMarkerObj.get_CreateStep();
                                                const serverStep = ClientLib.Data.MainData.GetInstance()
                                                    .get_Time()
                                                    .GetServerStep();
                                                addMarker(self.__ruinMarkerObj.get_RawX(), self.__ruinMarkerObj.get_RawY(), 24 * 60 * 60 - (serverStep - createStep));
                                            }
                                        }
                                    });
                                    this[i].add(this.__ruinMarkerButton);
                                    // Button remove
                                    this.__ruinMarkerButtonRemove = new qx.ui.form.Button('Remove Marker', icons.skull).set({
                                        enabled: false,
                                    });
                                    this.__ruinMarkerButtonRemove.addListener('execute', function () {
                                        qx.core.Init.getApplication()
                                            .getBackgroundArea()
                                            .closeCityInfo();
                                        if (self.__ruinMarkerObj.get_VisObjectType() === ClientLib.Vis.VisObject.EObjectType.RegionRuin) {
                                            if (markers[`${self.__ruinMarkerObj.get_RawX()}:${self.__ruinMarkerObj.get_RawY()}`]) {
                                                removeMarker(self.__ruinMarkerObj.get_RawX(), self.__ruinMarkerObj.get_RawY());
                                            }
                                        }
                                    });
                                    this[i].add(this.__ruinMarkerButtonRemove);
                                    // Button clear
                                    this.__ruinMarkerButtonClear = new qx.ui.form.Button('Clear all Markers', icons.skull).set({
                                        enabled: false,
                                    });
                                    this.__ruinMarkerButtonClear.addListener('execute', function () {
                                        qx.core.Init.getApplication()
                                            .getBackgroundArea()
                                            .closeCityInfo();
                                        if (self.__ruinMarkerObj.get_VisObjectType() === ClientLib.Vis.VisObject.EObjectType.RegionRuin) {
                                            removeMarkers();
                                        }
                                    });
                                    this[i].add(this.__ruinMarkerButtonClear);
                                }
                            }
                            catch (e) {
                                console.log(e);
                            }
                        }
                    }
                    const isRuin = obj.get_VisObjectType() === ClientLib.Vis.VisObject.EObjectType.RegionRuin;
                    const isMarkerExists = !!markers[`${obj.get_RawX()}:${obj.get_RawY()}`];
                    const atLeastOneMarker = !!Object.keys(markers).length;
                    this.__ruinMarkerButton.setEnabled(isRuin && !isMarkerExists);
                    this.__ruinMarkerButton.setVisibility(isRuin ? 'visible' : 'excluded');
                    this.__ruinMarkerButtonRemove.setEnabled(isRuin && isMarkerExists);
                    this.__ruinMarkerButtonRemove.setVisibility(isRuin && isMarkerExists ? 'visible' : 'excluded');
                    this.__ruinMarkerButtonClear.setEnabled(isRuin && atLeastOneMarker);
                    this.__ruinMarkerButtonClear.setVisibility(isRuin && atLeastOneMarker ? 'visible' : 'excluded');
                }
                catch (e) { }
                this.__ruinMarker_real_showMenu(obj);
            };
        };
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
