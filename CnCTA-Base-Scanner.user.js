"use strict";
// ==UserScript==
// @version	    2020.04.12
// @name        CnCTA Base Scanner
// @downloadURL https://github.com/bloofi/CnC_TA/raw/master/CnCTA-Base-Scanner.user.js
// @updateURL   https://github.com/bloofi/CnC_TA/raw/master/CnCTA-Base-Scanner.user.js
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include     http*://cncapp*.alliances.commandandconquer.com/*/index.aspx*
// @author      bloofi (https://github.com/bloofi)
// ==/UserScript==
(function () {
    const script = () => {
        const scriptName = 'CnCTA Base Scanner';
        const storageKey = 'cncta-base-scanner';
        const scanMaxRetries = 7;
        const biCncLVUrl = 'https://spy-cnc.fr/CNC/bi/cnclv/layout/';
        const icons = {
            cnclv: 'https://spy-cnc.fr/CNC/bi/favicon-cnclv.ico',
            scan: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAd5JREFUSIntlLFr20AYxd87yVWXdMmQoUNK6L9QCIU2mbx091oKDV1sH4IQD6WFhi4djCWLQiEYMrQUNAXSrRDyLwQPmVriTXsH2Vj+vg6RwcSJLDdDl7zxvrv3u+/u3QF3+t/ioglRFK2qalVVN0iOAfRV9cRaO7oVIAxDD8A+SQvAm62JSEJy11r7bRHAFJgfk9wTke8kn6jq/TRNH4jIC2PMb5Jfu93uu3/qIAzDTyT3ALxqNpuHV+txHDtJkvQAvCRZbTQaP0t3EEXRKkkrIofXmQNArVabqOobAL9Udb+ogzmAqlYBeI7jfC5aaK0dqeoBgM0gCNaWAWwAgIj0iwC5zgDAGPO4NCCPIobD4b0SgGm6xqUBAPoA4Hnes0XuJJ8DyNI0PS8NUNUTEUmMMW/jOHZuWthutx8C2AFw1Gq1/pQGWGtHJHcBPE2SpJe/iTnzSqXyA8CKiHy5yRwofsnvSX7AZRQPcHmhXn4sOwBWAEBEBqq67fv+xVKAHFLNIZszwxmAo3znPWPMehFk4WcHAEEQrOVRHKdpej49806n84jkaRGkFKBIVyGu627V6/XBtH7tZ7eMfN+/UNVtERkYY9azLHs9W781YApxXXdLRD5OJpPCVN1pTn8BTmff2pUBWMIAAAAASUVORK5CYII='
        };
        const defaultStorage = {
            window: {},
            cache: {},
        };
        const init = () => {
            const Main = qx.Class.define('Main', {
                type: 'singleton',
                extend: qx.core.Object,
                members: {
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // Globals
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    scanStatus: 'READY',
                    scanResults: [],
                    storage: {},
                    //////////////////////// DATA
                    bases: {},
                    scanIds: [],
                    currentScanID: null,
                    currentWid: 0,
                    //////////////////////// UI
                    mainWindow: null,
                    mainLabel: null,
                    filterFromSelect: null,
                    filterCampCheckbox: null,
                    filterOutpostCheckbox: null,
                    filterBaseCheckbox: null,
                    filterPlayerCheckbox: null,
                    buttonScan: null,
                    buttonClear: null,
                    scanResultComponent: null,
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // Init
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    initialize: function () {
                        const mainDataInstance = ClientLib.Data.MainData.GetInstance();
                        const server = mainDataInstance.get_Server();
                        this.currentWid = server.get_WorldId();
                        const ScriptsButton = qx.core.Init.getApplication()
                            .getMenuBar()
                            .getScriptsButton();
                        ScriptsButton.Add('Base Scanner');
                        const children = ScriptsButton.getMenu().getChildren();
                        const lastChild = children[children.length - 1];
                        lastChild.addListener('execute', this.onOpenMainWindow, this);
                    },
                    onOpenMainWindow: function () {
                        if (!this.mainWindow) {
                            this.loadStorage();
                            this.createMainWindow();
                        }
                        this.mainWindow.open();
                        this.scanStatus = 'READY';
                        this.refreshFilters();
                        this.refreshLabel();
                    },
                    createMainWindow: function () {
                        this.mainWindow = new qx.ui.window.Window('Base Scanner').set({
                            contentPaddingTop: 0,
                            contentPaddingBottom: 0,
                            contentPaddingRight: 0,
                            contentPaddingLeft: 0,
                            width: 1000,
                            height: 700,
                            showMaximize: false,
                            showMinimize: false,
                            allowMaximize: false,
                            allowMinimize: false,
                            allowClose: true,
                            resizable: true,
                        });
                        this.mainWindow.setLayout(new qx.ui.layout.Dock());
                        if (this.storage && this.storage.mainWindow && this.storage.mainWindow.x && this.storage.mainWindow.y) {
                            this.mainWindow.moveTo(this.storage.mainWindow.x, this.storage.mainWindow.y);
                        }
                        else {
                            this.mainWindow.center();
                        }
                        const container = new qx.ui.container.Composite(new qx.ui.layout.Dock());
                        const toolbar = new qx.ui.toolbar.ToolBar().set({
                            height: 70,
                        });
                        container.add(toolbar, { edge: 'north' });
                        const vboxButton = new qx.ui.container.Composite(new qx.ui.layout.VBox(5)).set({
                            padding: 5,
                        });
                        this.buttonScan = new qx.ui.form.Button('Scan', icons.scan);
                        this.buttonScan.addListener('execute', this.onButtonScan, this);
                        vboxButton.add(this.buttonScan);
                        this.buttonClear = new qx.ui.form.Button('Clear cache');
                        this.buttonClear.addListener('execute', this.onButtonClear, this);
                        vboxButton.add(this.buttonClear);
                        toolbar.add(vboxButton);
                        toolbar.add(new qx.ui.toolbar.Separator(10));
                        const scanFilterWhat = new qx.ui.groupbox.GroupBox('Scan what');
                        scanFilterWhat.setLayout(new qx.ui.layout.Grid(10, 5));
                        container.add(scanFilterWhat);
                        this.filterCampCheckbox = new qx.ui.form.CheckBox('Camps');
                        this.filterCampCheckbox.setValue(true);
                        scanFilterWhat.add(this.filterCampCheckbox, { row: 0, column: 0 });
                        this.filterOutpostCheckbox = new qx.ui.form.CheckBox('Outposts');
                        this.filterOutpostCheckbox.setValue(true);
                        scanFilterWhat.add(this.filterOutpostCheckbox, { row: 0, column: 1 });
                        this.filterBaseCheckbox = new qx.ui.form.CheckBox('Bases');
                        this.filterBaseCheckbox.setValue(true);
                        scanFilterWhat.add(this.filterBaseCheckbox, { row: 1, column: 0 });
                        this.filterPlayerCheckbox = new qx.ui.form.CheckBox('Players');
                        this.filterPlayerCheckbox.set({ enabled: false });
                        scanFilterWhat.add(this.filterPlayerCheckbox, { row: 1, column: 1 });
                        toolbar.add(scanFilterWhat);
                        toolbar.add(new qx.ui.toolbar.Separator(10));
                        const scanFilterFrom = new qx.ui.groupbox.GroupBox('Scan from');
                        scanFilterFrom.setLayout(new qx.ui.layout.VBox());
                        this.filterFromSelect = new qx.ui.form.SelectBox();
                        scanFilterFrom.add(this.filterFromSelect);
                        toolbar.add(scanFilterFrom);
                        toolbar.add(new qx.ui.toolbar.Separator(10));
                        this.mainLabel = new qx.ui.basic.Label().set({
                            value: '',
                            rich: true,
                            textColor: 'black',
                        });
                        toolbar.add(this.mainLabel);
                        toolbar.addSpacer();
                        this.scanResultComponent = new qx.ui.container.Composite(new qx.ui.layout.Flow(5, 5));
                        this.scanResultComponent.set({
                            paddingTop: 5,
                            paddingRight: 5,
                            paddingBottom: 5,
                            paddingLeft: 5,
                        });
                        const scanResultScroll = new qx.ui.container.Scroll();
                        scanResultScroll.add(this.scanResultComponent);
                        container.add(scanResultScroll, { edge: 'center' });
                        this.mainWindow.add(container, { edge: 'center' });
                        this.mainWindow.addListener('move', this.onWindowMove, this);
                    },
                    refreshFilters: function () {
                        if (!this.mainWindow) {
                            return;
                        }
                        this.filterFromSelect.removeAll();
                        this.filterFromSelect.add(new qx.ui.form.ListItem('All bases', null, 'all'));
                        Object.values(ClientLib.Data.MainData.GetInstance()
                            .get_Cities()
                            .get_AllCities().d).forEach((c) => {
                            this.filterFromSelect.add(new qx.ui.form.ListItem(c.get_Name(), null, c));
                        });
                    },
                    refreshLabel: function () {
                        const detail = [`Status : <b>${this.scanStatus}</b>`];
                        switch (this.scanStatus) {
                            case 'READY':
                                detail.push('Ready to scan', `<b>${Object.keys(this.storage.cache).length}</b> layouts in cache.`);
                                break;
                            case 'SCANNING':
                                detail.push('Retrieving all reachable items...');
                                break;
                            case 'FETCHING':
                                if (this.currentScanID) {
                                    const b = this.bases[this.currentScanID];
                                    const nbScanned = Object.values(this.bases).filter(r => ['FETCHED'].includes(r.status)).length;
                                    const nbTotal = Object.values(this.bases).filter(r => r.status !== 'CANCELED').length;
                                    detail.push(`Items : <b>${nbScanned}</b> / <b>${nbTotal}</b>`);
                                    detail.push(`Currently scanning : <b>${b.type} ${b.x}:${b.y}</b> from <b>${b.from.get_Name()}</b> (${b.retry})`);
                                }
                                break;
                            case 'END':
                                const nbTotal = Object.values(this.bases).filter(r => r.status !== 'CANCELED').length;
                                detail.push(`<b>${nbTotal}</b> item(s) scanned.`);
                                break;
                            default:
                                detail.push('Unknown scan status');
                                break;
                        }
                        this.mainLabel.set({
                            value: detail.join('<br>'),
                            rich: true,
                            textColor: 'black',
                        });
                    },
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // Buttons events
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    onWindowMove: function (e) {
                        this.saveToStorage({
                            window: {
                                x: e.getData().left,
                                y: e.getData().top,
                            },
                        });
                    },
                    onButtonScan: function () {
                        if (this.scanStatus === 'READY' || this.scanStatus === 'END') {
                            this.startScan();
                        }
                        else {
                            this.stopScan();
                        }
                    },
                    onButtonClear: function () {
                        this.storage.cache = {};
                        this.flushStorage();
                        this.mainLabel.set({
                            value: ['Cache has been cleared.'].join('<br>'),
                            rich: true,
                            textColor: 'black',
                        });
                        this.buttonClear.set({ enabled: false });
                    },
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // Callbacks
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    onGetPublicAllianceInfoByNameOrAbbreviation: function (context, data) {
                        if (data && data.i) {
                            this.updateAllianceInfo(data);
                        }
                        else {
                            this.fetchLabel.set({ value: 'Invalid alliance name', textColor: 'red' });
                        }
                    },
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // Scan
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    clearScan: function () {
                        this.scanResultComponent.removeAll();
                        this.bases = {};
                        this.scanIds = [];
                        this.currentScanID = null;
                    },
                    stopScan: function () {
                        this.scanStatus = 'END';
                        this.filterCampCheckbox.set({ enabled: true });
                        this.filterOutpostCheckbox.set({ enabled: true });
                        this.filterBaseCheckbox.set({ enabled: true });
                        this.filterPlayerCheckbox.set({ enabled: false });
                        this.filterFromSelect.set({ enabled: true });
                        this.buttonScan.set({
                            label: 'Scan',
                            enabled: true,
                        });
                        this.buttonClear.set({ enabled: true });
                        this.refreshLabel();
                    },
                    startScan: function () {
                        this.clearScan();
                        this.filterCampCheckbox.set({ enabled: false });
                        this.filterOutpostCheckbox.set({ enabled: false });
                        this.filterBaseCheckbox.set({ enabled: false });
                        this.filterPlayerCheckbox.set({ enabled: false });
                        this.filterFromSelect.set({ enabled: false });
                        this.buttonScan.set({
                            label: 'Stop',
                            enabled: false
                        });
                        this.buttonClear.set({ enabled: false });
                        this.scanStatus = 'SCANNING';
                        this.refreshLabel();
                        const filters = {
                            scanCamps: this.filterCampCheckbox.getValue(),
                            scanOutposts: this.filterOutpostCheckbox.getValue(),
                            scanBases: this.filterBaseCheckbox.getValue(),
                            scanPlayers: this.filterPlayerCheckbox.getValue(),
                        };
                        const from = this.filterFromSelect.getModelSelection().getItem(0);
                        const bases = from === 'all' ? this.getOwnCitiesAsArray() : [from];
                        bases.forEach(b => {
                            ClientLib.Vis.VisMain.GetInstance().CenterGridPosition(b.get_PosX(), b.get_PosY());
                            ClientLib.Vis.VisMain.GetInstance().Update();
                            ClientLib.Vis.VisMain.GetInstance().ViewUpdate();
                            const region = ClientLib.Vis.VisMain.GetInstance().get_Region();
                            for (let x = b.get_PosX() - 11; x < b.get_PosX() + 11; x++) {
                                for (let y = b.get_PosY() - 11; y < b.get_PosY() + 11; y++) {
                                    const obj = region.GetObjectFromPosition(x * region.get_GridWidth(), y * region.get_GridHeight());
                                    if (obj && obj.get_Id) {
                                        const distance = ClientLib.Base.Util.CalculateDistance(b.get_PosX(), b.get_PosY(), obj.get_RawX(), obj.get_RawY());
                                        if (parseInt(distance) < 11) {
                                            switch (obj.get_VisObjectType()) {
                                                case ClientLib.Vis.VisObject.EObjectType.RegionNPCBase:
                                                    if (filters.scanBases && !this.scanIds.includes(obj.get_Id())) {
                                                        this.addPanel({
                                                            scanID: `${obj.get_Id()}`,
                                                            from: b,
                                                            type: 'BASE',
                                                            faction: 'F',
                                                            city: obj,
                                                            x: obj.get_RawX(),
                                                            y: obj.get_RawY(),
                                                            retry: 0,
                                                            status: 'WAITING',
                                                            isCached: false,
                                                        });
                                                        this.scanIds.push(obj.get_Id());
                                                    }
                                                    break;
                                                case ClientLib.Vis.VisObject.EObjectType.RegionNPCCamp:
                                                    if ((filters.scanOutposts || filters.scanCamps) && !this.scanIds.includes(obj.get_Id())) {
                                                        this.addPanel({
                                                            scanID: `${obj.get_Id()}`,
                                                            from: b,
                                                            type: 'CAMP',
                                                            faction: 'F',
                                                            city: obj,
                                                            x: obj.get_RawX(),
                                                            y: obj.get_RawY(),
                                                            retry: 0,
                                                            status: 'WAITING',
                                                            isCached: false,
                                                        });
                                                        this.scanIds.push(obj.get_Id());
                                                    }
                                                    break;
                                                case ClientLib.Vis.VisObject.EObjectType.RegionCityType:
                                                    if (filters.scanPlayers && !this.scanIds.includes(obj.get_Id())) {
                                                        this.addPanel({
                                                            scanID: `${obj.get_Id()}`,
                                                            from: b,
                                                            type: 'PLAYER',
                                                            faction: obj.get_Faction ? obj.get_Faction() : '?',
                                                            city: obj,
                                                            x: obj.get_RawX(),
                                                            y: obj.get_RawY(),
                                                            retry: 0,
                                                            status: 'WAITING',
                                                            isCached: false,
                                                        });
                                                        this.scanIds.push(obj.get_Id());
                                                    }
                                                    break;
                                                default:
                                                    break;
                                            }
                                        }
                                    }
                                }
                            }
                        });
                        this.scanStatus = 'FETCHING';
                        this.checkAndFetch();
                    },
                    addPanel: function (sr) {
                        if (!this.bases[sr.scanID]) {
                            const panel = new qx.ui.container.Composite(new qx.ui.layout.Dock());
                            panel.add(this.getGridLayout(sr), { edge: 'center' });
                            this.scanResultComponent.add(panel);
                            this.bases[sr.scanID] = Object.assign(Object.assign({}, sr), { panel });
                        }
                    },
                    getGridLayout: function (sr) {
                        const res = new qx.ui.container.Composite(new qx.ui.layout.Dock());
                        res.set({
                            backgroundColor: sr.isCached ? 'transparent' : 'silver',
                            decorator: new qx.ui.decoration.Decorator().set({
                                color: sr.isCached ? 'black' : 'white',
                                style: 'solid',
                                width: 1,
                            }),
                        });
                        const grid = new qx.ui.container.Composite(new qx.ui.layout.Grid(1, 1));
                        grid.set({
                            width: 90,
                            height: 80,
                            backgroundColor: '#555555',
                        });
                        switch (sr.status) {
                            case 'FETCHED':
                                for (let y = 0; y < 8; y++) {
                                    for (let x = 0; x < 9; x++) {
                                        const cell = new qx.ui.core.Widget();
                                        cell.set({
                                            width: 10,
                                            height: 10,
                                        });
                                        switch (sr.layout[y][x]) {
                                            case 't':
                                                cell.set({ backgroundColor: 'green' });
                                                break;
                                            case 'c':
                                                cell.set({ backgroundColor: 'blue' });
                                                break;
                                            default:
                                                cell.set({ backgroundColor: '#ffdea3' });
                                                break;
                                        }
                                        grid.add(cell, { row: y, column: x });
                                    }
                                }
                                break;
                            case 'WAITING':
                            case 'FETCHING':
                            case 'CANCELED':
                            default:
                                const borderColor = sr.status === 'CANCELED' ? 'red' : 'gray';
                                for (let y = 0; y < 8; y++) {
                                    grid.add(new qx.ui.core.Widget().set({ width: 10, height: 10, backgroundColor: borderColor }), { row: y, column: 0 });
                                    grid.add(new qx.ui.core.Widget().set({ width: 10, height: 10, backgroundColor: borderColor }), { row: y, column: 8 });
                                }
                                for (let x = 1; x < 8; x++) {
                                    grid.add(new qx.ui.core.Widget().set({ width: 10, height: 10, backgroundColor: borderColor }), { row: 0, column: x });
                                    grid.add(new qx.ui.core.Widget().set({ width: 10, height: 10, backgroundColor: borderColor }), { row: 7, column: x });
                                }
                                grid.add(new qx.ui.basic.Label().set({
                                    value: [`${sr.status}`, `${sr.type}`].join('<br>'),
                                    rich: true,
                                    textColor: sr.status === 'CANCELED' ? 'red' : 'black',
                                    textAlign: 'center',
                                }), { row: 1, column: 1, rowSpan: 6, colSpan: 7 });
                                break;
                        }
                        res.add(grid, { edge: 'center' });
                        const actions = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
                        const coords = new qx.ui.basic.Label().set({
                            value: `${sr.x}:${sr.y}`,
                            rich: true,
                            textColor: 'blue',
                        });
                        coords.addListener('execute', this.centerTo(sr.x, sr.y), this);
                        actions.add(coords);
                        if (sr.status === 'FETCHED') {
                            const bCnclv = new qx.ui.form.Button('', icons.cnclv).set({
                                decorator: null,
                                backgroundColor: 'transparent',
                                margin: 0,
                                padding: 0,
                                maxWidth: 16,
                                maxHeight: 16,
                            });
                            bCnclv.addListener('execute', this.openCncLV(sr), this);
                            actions.add(bCnclv);
                        }
                        res.add(actions, { edge: 'south' });
                        return res;
                    },
                    checkAndFetch: function () {
                        if (this.scanStatus === 'FETCHING') {
                            if (this.currentScanID) {
                                this.refreshLabel();
                                const currentScan = this.bases[this.currentScanID];
                                switch (currentScan.status) {
                                    case 'WAITING':
                                        this.bases[this.currentScanID] = currentScan;
                                        if (this.storage.cache[`${this.currentWid}-${currentScan.x}:${currentScan.y}`]) {
                                            currentScan.layout = this.cncoptToLayout(this.storage.cache[`${this.currentWid}-${currentScan.x}:${currentScan.y}`]);
                                            currentScan.isCached = true;
                                            currentScan.status = 'FETCHED';
                                        }
                                        else {
                                            ClientLib.Data.MainData.GetInstance()
                                                .get_Cities()
                                                .set_CurrentCityId(currentScan.city.get_Id());
                                            ClientLib.Net.CommunicationManager.GetInstance().UserAction();
                                            currentScan.status = 'FETCHING';
                                        }
                                        this.checkAndFetch();
                                        break;
                                    case 'FETCHING':
                                        const data = ClientLib.Data.MainData.GetInstance()
                                            .get_Cities()
                                            .GetCity(currentScan.city.get_Id());
                                        if (data && data.get_OwnerId()) {
                                            currentScan.layout = this.getCityLayout(data);
                                            currentScan.status = 'FETCHED';
                                            this.checkAndFetch();
                                        }
                                        else {
                                            if (currentScan.retry > scanMaxRetries) {
                                                currentScan.status = 'CANCELED';
                                                currentScan.panel.removeAll();
                                                currentScan.panel.add(this.getGridLayout(currentScan), { edge: 'center' });
                                                this.bases[this.currentScanID] = currentScan;
                                                this.findNext();
                                            }
                                            else {
                                                currentScan.retry++;
                                                this.bases[this.currentScanID] = currentScan;
                                                setTimeout(() => {
                                                    this.checkAndFetch();
                                                }, 200);
                                            }
                                        }
                                        break;
                                    case 'FETCHED':
                                        currentScan.panel.removeAll();
                                        currentScan.panel.add(this.getGridLayout(currentScan), { edge: 'center' });
                                        this.bases[this.currentScanID] = currentScan;
                                        this.storage.cache[`${this.currentWid}-${currentScan.x}:${currentScan.y}`] = this.layoutToCncopt(currentScan.layout);
                                        this.flushStorage();
                                        this.findNext();
                                        break;
                                    case 'CANCELED':
                                        this.findNext();
                                        break;
                                    default:
                                        break;
                                }
                            }
                            else {
                                this.findNext();
                            }
                        }
                    },
                    findNext: function () {
                        const nextBase = Object.values(this.bases).find(b => b.status === 'WAITING');
                        if (nextBase) {
                            this.currentScanID = nextBase.scanID;
                            this.checkAndFetch();
                        }
                        else {
                            // Stop scan
                            this.stopScan();
                        }
                    },
                    getOwnCitiesAsArray: function () {
                        return Object.values(ClientLib.Data.MainData.GetInstance()
                            .get_Cities()
                            .get_AllCities().d);
                    },
                    getCityLayout: function (city) {
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
                                    default:
                                        res[y][x] = '.';
                                        break;
                                }
                            }
                        }
                        return res;
                    },
                    layoutToCncopt: function (layout) {
                        return layout.reduce((p, c) => `${p}${c.reduce((p2, c2) => `${p2}${c2}`, '')}`, '').substring(0, 9 * 8);
                    },
                    layoutToFullCncopt: function (baseFaction, offFaction, name, layout) {
                        const res = ['3', baseFaction, offFaction, name, layout.reduce((p, c) => `${p}${c.reduce((p2, c2) => `${p2}${c2}`, '')}`, '')];
                        return res.join('|');
                    },
                    cncoptToLayout: function (layout) {
                        console.log('cncoptToLayout', layout);
                        return layout.split('').reduce((p, c, i) => {
                            if (i < 9 * 8) {
                                p[Math.floor(i / 9)][i % 9] = c;
                            }
                            return p;
                        }, [[], [], [], [], [], [], [], []]);
                    },
                    centerTo: function (x, y) {
                        return function () {
                            ClientLib.Vis.VisMain.GetInstance().CenterGridPosition(x, y);
                            ClientLib.Vis.VisMain.GetInstance().Update();
                            ClientLib.Vis.VisMain.GetInstance().ViewUpdate();
                        };
                    },
                    openCncLV: function (sr) {
                        return function () {
                            const cncopt = this.layoutToFullCncopt('F', 'N', `${sr.type} - ${sr.x}:${sr.y}`, sr.layout);
                            window.open(`${biCncLVUrl}${cncopt}`, `${sr.type} - ${sr.x}:${sr.y}`);
                        };
                    },
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // Storage
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    loadStorage: function () {
                        this.storage = Object.assign(Object.assign({}, defaultStorage), (JSON.parse(localStorage.getItem(storageKey) || '{}') || {}));
                    },
                    saveToStorage: function (data) {
                        this.storage = Object.assign(Object.assign({}, this.storage), (data || {}));
                        this.flushStorage();
                    },
                    flushStorage: function () {
                        localStorage.setItem(storageKey, JSON.stringify(this.storage || {}));
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
