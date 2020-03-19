"use strict";
// ==UserScript==
// @version	    2020.03.19
// @name        CnCTA Main Finder
// @downloadURL https://github.com/bloofi/CnC_TA/raw/master/CnCTA-Main-Finder.user.js
// @updateURL   https://github.com/bloofi/CnC_TA/raw/master/CnCTA-Main-Finder.user.js
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include     http*://cncapp*.alliances.commandandconquer.com/*/index.aspx*
// @autohor     bloofi (https://github.com/bloofi)
// ==/UserScript==
(function () {
    const script = () => {
        const scriptName = 'CnCTA Main Finder';
        const alliances = [
            { id: 1876, name: 'TwojStrary' },
            { id: 359, name: 'Inadmissible (alts)' },
            { id: 1808, name: 'Venerating Coin Coin (alts)' },
            { id: 1864, name: 'Venerating Quackers (alts)' },
            { id: 149, name: 'digitalYakuza' },
            { id: 126, name: 'WarYakuza' },
            { id: 595, name: 'analogYakuza' },
            { id: 1827, name: 'Iron Wolves' },
            { id: 112, name: 'Madness' },
            { id: 751, name: 'Hakuna Matata' },
        ];
        const init = () => {
            const Main = qx.Class.define('Main', {
                type: 'singleton',
                extend: qx.core.Object,
                members: {
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // Globals
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    mainWindow: null,
                    mainLabelAuth: null,
                    mainTextfield: null,
                    mainSelect: null,
                    mainBases: {},
                    gridWidth: null,
                    gridHeight: null,
                    baseMarkerWidth: null,
                    baseMarkerHeight: null,
                    regionZoomFactor: null,
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // Init
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    initialize: function () {
                        const ScriptsButton = qx.core.Init.getApplication()
                            .getMenuBar()
                            .getScriptsButton();
                        ScriptsButton.Add('Main bases');
                        const children = ScriptsButton.getMenu().getChildren();
                        const lastChild = children[children.length - 1];
                        lastChild.addListener('execute', this.onOpenMainWindow, this);
                    },
                    onOpenMainWindow: function () {
                        if (!this.mainWindow) {
                            this.createMainWindow();
                        }
                        this.mainWindow.open();
                        this.refreshWindow();
                    },
                    createMainWindow: function () {
                        this.mainWindow = new qx.ui.window.Window('Main bases').set({
                            contentPaddingTop: 5,
                            contentPaddingBottom: 5,
                            contentPaddingRight: 2,
                            contentPaddingLeft: 2,
                            width: 200,
                            height: 200,
                            showMaximize: false,
                            showMinimize: false,
                            allowMaximize: false,
                            allowMinimize: false,
                            allowClose: true,
                            resizable: false,
                        });
                        this.mainWindow.setLayout(new qx.ui.layout.VBox(5, 'top'));
                        this.mainWindow.center();
                        this.mainLabelAuth = new qx.ui.basic.Label().set({
                            rich: true,
                            value: '',
                            wrap: true,
                            maxWidth: 200,
                            textColor: 'white',
                            textAlign: 'left',
                        });
                        this.mainWindow.add(this.mainLabelAuth);
                        // this.mainTextfield = new qx.ui.form.TextField();
                        // this.mainTextfield.setWidth(200);
                        // this.mainWindow.add(this.mainTextfield);
                        this.mainSelect = new qx.ui.form.SelectBox();
                        alliances.forEach(a => {
                            this.mainSelect.add(new qx.ui.form.ListItem(a.name, null, a));
                        });
                        this.mainWindow.add(this.mainSelect);
                        const buttonShow = new qx.ui.form.Button('Show');
                        buttonShow.addListener('execute', this.onShow, this);
                        this.mainWindow.add(buttonShow);
                        const buttonHide = new qx.ui.form.Button('Hide');
                        buttonHide.addListener('execute', this.onHide, this);
                        this.mainWindow.add(buttonHide);
                    },
                    refreshWindow: function () {
                        const totalBases = Object.keys(this.mainBases).length;
                        const totalFetched = Object.values(this.mainBases).filter(m => m.fetched).length;
                        this.mainLabelAuth.set({ value: `${totalFetched} / ${totalBases}`, textColor: 'white' });
                    },
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // Main Base finder
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    onShow: function () {
                        phe.cnc.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance().get_Region(), 'ZoomFactorChange', ClientLib.Vis.ZoomFactorChange, this, this.resizeMarkers);
                        phe.cnc.Util.attachNetEvent(ClientLib.Vis.VisMain.GetInstance().get_Region(), 'PositionChange', ClientLib.Vis.PositionChange, this, this.repositionMarkers);
                        this.removeMarkers();
                        this.updateMarkerSize();
                        this.mainLabelAuth.set({ value: 'Fetching...', textColor: 'white' });
                        ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand('GetPublicAllianceInfo', {
                            // id: this.mainTextfield.getValue(),
                            id: this.mainSelect.getModelSelection().getItem(0).id,
                        }, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, this.onAllianceInfoReceived), null);
                    },
                    onHide: function () {
                        phe.cnc.Util.detachNetEvent(ClientLib.Vis.VisMain.GetInstance().get_Region(), 'ZoomFactorChange', ClientLib.Vis.ZoomFactorChange, this, this.resizeMarkers);
                        phe.cnc.Util.detachNetEvent(ClientLib.Vis.VisMain.GetInstance().get_Region(), 'PositionChange', ClientLib.Vis.PositionChange, this, this.repositionMarkers);
                        this.removeMarkers();
                        this.mainLabelAuth.set({ value: 'Nothing to show', textColor: 'red' });
                    },
                    onPlayerInfoReceived: function (context, data) {
                        let main = null;
                        if (data && data.c) {
                            data.c.forEach(b => {
                                if (!main || b.p > main.p) {
                                    main = b;
                                }
                            });
                            this.mainBases[`pid-${data.i}`] = Object.assign(Object.assign({}, this.mainBases[`pid-${data.i}`]), { n: main.n, p: main.p, x: main.x, y: main.y, pname: data.n, fetched: true });
                            console.log(main.x, main.y, data.n, main.n);
                            this.refreshWindow();
                            this.addMarker(data.i, main.x, main.y, `${data.n}<br>${main.n}`);
                        }
                    },
                    onAllianceInfoReceived: function (context, data) {
                        data.m.forEach(m => {
                            this.mainBases[`pid-${m.i}`] = { n: '', i: null, p: null, x: null, y: null, pid: m.i, marker: null, fetched: false };
                            ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand('GetPublicPlayerInfo', {
                                id: m.i,
                            }, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, this.onPlayerInfoReceived), null);
                        });
                    },
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // Markers
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    addMarker: function (pid, bx, by, text) {
                        const marker = new qx.ui.container.Composite(new qx.ui.layout.Basic()).set({
                            decorator: new qx.ui.decoration.Decorator().set({
                                color: 'rgba(255, 0, 0, 1)',
                                style: 'solid',
                                width: 3,
                                radius: Math.floor(this.baseMarkerWidth / 5),
                            }),
                            backgroundColor: 'rgba(255, 0, 0, 0.6)',
                            opacity: 0.5,
                            width: this.baseMarkerWidth,
                            height: this.baseMarkerHeight * 0.8,
                        });
                        marker.add(new qx.ui.basic.Label('' + text).set({
                            textColor: '#ffffff',
                            opacity: 1,
                            font: new qx.bom.Font(12, ['Arial']),
                            rich: true,
                            wrap: false,
                        }));
                        qx.core.Init.getApplication()
                            .getDesktop()
                            .addAfter(marker, qx.core.Init.getApplication().getBackgroundArea(), {
                            left: ClientLib.Vis.VisMain.GetInstance().ScreenPosFromWorldPosX(bx * this.gridWidth),
                            top: ClientLib.Vis.VisMain.GetInstance().ScreenPosFromWorldPosY(by * this.gridHeight),
                        });
                        this.mainBases[`pid-${pid}`].marker = marker;
                    },
                    removeMarkers: function () {
                        Object.values(this.mainBases).forEach(b => {
                            qx.core.Init.getApplication()
                                .getDesktop()
                                .remove(b.marker);
                        });
                        this.mainBases = {};
                    },
                    updateMarkerSize: function () {
                        this.gridWidth = ClientLib.Vis.VisMain.GetInstance()
                            .get_Region()
                            .get_GridWidth();
                        this.gridHeight = ClientLib.Vis.VisMain.GetInstance()
                            .get_Region()
                            .get_GridHeight();
                        this.regionZoomFactor = ClientLib.Vis.VisMain.GetInstance()
                            .get_Region()
                            .get_ZoomFactor();
                        this.baseMarkerWidth = this.regionZoomFactor * this.gridWidth;
                        this.baseMarkerHeight = this.regionZoomFactor * this.gridHeight;
                    },
                    repositionMarkers: function () {
                        this.updateMarkerSize();
                        Object.values(this.mainBases).forEach(b => {
                            b.marker.setDomLeft(ClientLib.Vis.VisMain.GetInstance().ScreenPosFromWorldPosX(b.x * this.gridWidth));
                            b.marker.setDomTop(ClientLib.Vis.VisMain.GetInstance().ScreenPosFromWorldPosY(b.y * this.gridHeight));
                        });
                    },
                    resizeMarkers: function () {
                        this.updateMarkerSize();
                        Object.values(this.mainBases).forEach(b => {
                            b.marker.setWidth(this.baseMarkerWidth);
                            b.marker.setHeight(this.baseMarkerHeight);
                        });
                    },
                },
            });
            Main.getInstance().initialize();
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
