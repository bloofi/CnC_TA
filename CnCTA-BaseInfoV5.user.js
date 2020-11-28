"use strict";
// ==UserScript==
// @version	    2020.11.28
// @name        CnCTA Baseinfo V5
// @downloadURL https://github.com/bloofi/CnC_TA/raw/master/CnCTA-BaseInfoV5.user.js
// @updateURL   https://github.com/bloofi/CnC_TA/raw/master/CnCTA-BaseInfoV5.user.js
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include     http*://cncapp*.alliances.commandandconquer.com/*/index.aspx*
// @author      bloofi (https://github.com/bloofi)
// ==/UserScript==
(function () {
    const script = () => {
        const scriptName = 'CnCTA BaseInfo V5';
        const menuName = 'BaseInfo V5';
        const windowName = 'BaseInfo V5.0.1';
        const storageKey = 'cncta-BaseInfoV5';
        const biCncLVUrl = 'https://spy-cnc.fr/CNC/bi/cnclv/layout/';
        const biBackendUrl = 'https://spy-cnc.fr/CNC/bi/api.php';
        const biUpdateTimeout = 1000 * 60 * 3;
        const logColors = {
            NORMAL_BLACK: 'rgba(10, 10, 10, 1)',
            NORMAL_WHITE: 'rgba(220, 220, 220, 1)',
            SUCCESS: 'rgba(100, 255, 100, 1)',
            ERROR: 'rgba(255, 100, 100, 1)',
            COORDS: '#0002ae',
            LAYOUT_NONE: '#ffdea3',
            LAYOUT_TIB: '#2cc51f',
            LAYOUT_CRY: '#221fff',
        };
        const layoutMapping = {
            buildings: {
                /* GDI Buildings */
                GDI_Accumulator: 'a',
                GDI_Refinery: 'r',
                'GDI_Trade Center': 'u',
                GDI_Silo: 's',
                'GDI_Power Plant': 'p',
                'GDI_Construction Yard': 'y',
                GDI_Airport: 'd',
                GDI_Barracks: 'b',
                GDI_Factory: 'f',
                'GDI_Defense HQ': 'q',
                'GDI_Defense Facility': 'w',
                'GDI_Command Center': 'e',
                GDI_Support_Art: 'z',
                GDI_Support_Air: 'x',
                GDI_Support_Ion: 'i',
                /* Forgotten Buildings */
                FOR_Silo: 's',
                FOR_Refinery: 'r',
                'FOR_Tiberium Booster': 'b',
                'FOR_Crystal Booster': 'v',
                'FOR_Trade Center': 'u',
                'FOR_Defense Facility': 'w',
                'FOR_Construction Yard': 'y',
                FOR_Harvester_Tiberium: 'h',
                'FOR_Defense HQ': 'q',
                FOR_Harvester_Crystal: 'n',
                /* Nod Buildings */
                NOD_Refinery: 'r',
                'NOD_Power Plant': 'p',
                NOD_Harvester: 'h',
                'NOD_Construction Yard': 'y',
                NOD_Airport: 'd',
                'NOD_Trade Center': 'u',
                'NOD_Defense HQ': 'q',
                NOD_Barracks: 'b',
                NOD_Silo: 's',
                NOD_Factory: 'f',
                NOD_Harvester_Crystal: 'n',
                'NOD_Command Post': 'e',
                NOD_Support_Art: 'z',
                NOD_Support_Ion: 'i',
                NOD_Accumulator: 'a',
                NOD_Support_Air: 'x',
                'NOD_Defense Facility': 'w',
            },
            defense: {
                /* GDI Defense Units */
                GDI_Wall: 'w',
                GDI_Cannon: 'c',
                'GDI_Antitank Barrier': 't',
                GDI_Barbwire: 'b',
                GDI_Turret: 'm',
                GDI_Flak: 'f',
                'GDI_Art Inf': 'r',
                'GDI_Art Air': 'e',
                'GDI_Art Tank': 'a',
                'GDI_Def_APC Guardian': 'g',
                'GDI_Def_Missile Squad': 'q',
                GDI_Def_Pitbull: 'p',
                GDI_Def_Predator: 'd',
                GDI_Def_Sniper: 's',
                'GDI_Def_Zone Trooper': 'z',
                /* Nod Defense Units */
                'NOD_Def_Antitank Barrier': 't',
                'NOD_Def_Art Air': 'e',
                'NOD_Def_Art Inf': 'r',
                'NOD_Def_Art Tank': 'a',
                'NOD_Def_Attack Bike': 'p',
                NOD_Def_Barbwire: 'b',
                'NOD_Def_Black Hand': 'z',
                NOD_Def_Cannon: 'c',
                NOD_Def_Confessor: 's',
                NOD_Def_Flak: 'f',
                'NOD_Def_MG Nest': 'm',
                'NOD_Def_Militant Rocket Soldiers': 'q',
                NOD_Def_Reckoner: 'g',
                'NOD_Def_Scorpion Tank': 'd',
                NOD_Def_Wall: 'w',
                /* Forgotten Defense Units */
                FOR_Wall: 'w',
                FOR_Barbwire_VS_Inf: 'b',
                FOR_Barrier_VS_Veh: 't',
                FOR_Inf_VS_Inf: 'g',
                FOR_Inf_VS_Veh: 'r',
                FOR_Inf_VS_Air: 'q',
                FOR_Sniper: 'n',
                FOR_Mammoth: 'y',
                FOR_Veh_VS_Inf: 'o',
                FOR_Veh_VS_Veh: 's',
                FOR_Veh_VS_Air: 'u',
                FOR_Turret_VS_Inf: 'm',
                FOR_Turret_VS_Inf_ranged: 'a',
                FOR_Turret_VS_Veh: 'v',
                FOR_Turret_VS_Veh_ranged: 'd',
                FOR_Turret_VS_Air: 'f',
                FOR_Turret_VS_Air_ranged: 'e',
                '': '',
            },
            offense: {
                /* GDI Offense Units */
                'GDI_APC Guardian': 'g',
                GDI_Commando: 'c',
                GDI_Firehawk: 'f',
                GDI_Juggernaut: 'j',
                GDI_Kodiak: 'k',
                GDI_Mammoth: 'm',
                'GDI_Missile Squad': 'q',
                GDI_Orca: 'o',
                GDI_Paladin: 'a',
                GDI_Pitbull: 'p',
                GDI_Predator: 'd',
                GDI_Riflemen: 'r',
                'GDI_Sniper Team': 's',
                'GDI_Zone Trooper': 'z',
                /* Nod Offense Units */
                'NOD_Attack Bike': 'b',
                NOD_Avatar: 'a',
                'NOD_Black Hand': 'z',
                NOD_Cobra: 'r',
                NOD_Commando: 'c',
                NOD_Confessor: 's',
                'NOD_Militant Rocket Soldiers': 'q',
                NOD_Militants: 'm',
                NOD_Reckoner: 'k',
                NOD_Salamander: 'l',
                'NOD_Scorpion Tank': 'o',
                'NOD_Specter Artilery': 'p',
                NOD_Venom: 'v',
                NOD_Vertigo: 't',
                '': '',
            },
        };
        const unitPropKey = PerforceChangelist >= 376877 ? 'd' : 'l';
        const init = () => {
            const icons = {
                icon16: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGmGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTAzLTE1VDAwOjI3KzAxOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTExLTIyVDE1OjMwOjQ4KzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0xMS0yMlQxNTozMDo0OCswMTowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpiZGU4YjVjZC0zYTM5LTQ4NGItOWM0Zi1kMmFhNTI4YzBkNTkiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpkOTM3OGIxYS04ZTc3LWQyNGYtYWRiNC1iNjc4NjFjZjVjZjkiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5ZTc2YzgyMS04ZTY0LTJhNDItODBmYy1lMTc5ZTE2NmVkMGEiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo5ZTc2YzgyMS04ZTY0LTJhNDItODBmYy1lMTc5ZTE2NmVkMGEiIHN0RXZ0OndoZW49IjIwMTktMDMtMTVUMDA6MjcrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NzhkZjUyZTYtYTgxYi0yNDQ5LWE4ZDgtM2I4ZDhhYTQ1ZjNjIiBzdEV2dDp3aGVuPSIyMDE5LTAzLTE1VDAwOjI3KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmJkZThiNWNkLTNhMzktNDg0Yi05YzRmLWQyYWE1MjhjMGQ1OSIgc3RFdnQ6d2hlbj0iMjAyMC0xMS0yMlQxNTozMDo0OCswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoiF5Z8AAAD6SURBVDgRY/j///8aIM4AYm80HADEyUBcCMRFOPBSBiCRCMQgWh0NS0DF8eFcEOEExG7/sYNHUDlcBhQxQBU4/McNfgKxID4D3IHYHknDEyA2BOLbSGLSQKwHxA1QLITPgKdQye1IYsxAnIXE18JnwEsgTgLi51D+V6jiDCQ1yvgMQAZvgNgFqridWANANl5FCsDDUMU5xBoAijp2ID6HJAYKVD9iDXgDldyFJAaK6kBiDXgIxJxAfB5JzJUUAz4jhQEMmOLzgj008+BLiSxAXIcrHYRDFaRgwb7QRARSp4EkjpKZ1gFxGjRToWNQ4EVAs240kngOLDsDAJbFfh8CgT6cAAAAAElFTkSuQmCC',
                tib: ClientLib.File.FileManager.GetInstance().GetPhysicalPath('ui/common/icn_res_tiberium.png'),
                cry: ClientLib.File.FileManager.GetInstance().GetPhysicalPath('ui/common/icn_res_chrystal.png'),
                pow: ClientLib.File.FileManager.GetInstance().GetPhysicalPath('ui/common/icn_res_power.png'),
            };
            const Main = qx.Class.define('Main', {
                type: 'singleton',
                extend: qx.core.Object,
                members: {
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // Globals
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    status: 'INIT',
                    wid: null,
                    pid: null,
                    token: null,
                    updateTimeout: biUpdateTimeout,
                    //////////////////////// DATA
                    scanList: [],
                    storage: {},
                    //////////////////////// UI
                    components: {
                        mainWindow: null,
                        bottomLabel: null,
                        panelStack: null,
                        panels: {
                            init: null,
                            unRegistered: null,
                            authenticated: null,
                        },
                        spykeyTextField: null,
                        authLabel: null,
                        updateLabel: null,
                        askKeyButton: null,
                        validateKeyButton: null,
                        openAppButton: null,
                        scanButton: null,
                    },
                    intervals: {
                        updateTimeout: null,
                        nextUpdate: null,
                    },
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // Init
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    initialize: function () {
                        this.wid = ClientLib.Data.MainData.GetInstance()
                            .get_Server()
                            .get_WorldId();
                        this.pid = ClientLib.Data.MainData.GetInstance()
                            .get_Cities()
                            .get_CurrentOwnCity()
                            .get_PlayerId();
                        // Load storage
                        this.loadStorage();
                        if (!!this.storage.token) {
                            this.token = this.storage.token;
                            this.collectData();
                        }
                        else {
                            this.status = 'UNREGISTERED';
                        }
                        // Inject Button in Scripts menu
                        const ScriptsButton = qx.core.Init.getApplication()
                            .getMenuBar()
                            .getScriptsButton();
                        ScriptsButton.Add(menuName, icons.icon16);
                        const children = ScriptsButton.getMenu().getChildren();
                        const lastChild = children[children.length - 1];
                        lastChild.addListener('execute', this.onOpenMainWindow, this);
                    },
                    onOpenMainWindow: function () {
                        if (!this.components.mainWindow) {
                            this.createMainWindow();
                        }
                        this.components.mainWindow.open();
                        this.refreshWindow();
                    },
                    createMainWindow: function () {
                        this.components.mainWindow = new qx.ui.window.Window(windowName, icons.icon16).set({
                            contentPaddingTop: 0,
                            contentPaddingBottom: 0,
                            contentPaddingRight: 0,
                            contentPaddingLeft: 0,
                            width: 250,
                            height: 300,
                            showMaximize: false,
                            showMinimize: false,
                            allowMaximize: false,
                            allowMinimize: false,
                            allowClose: true,
                            resizable: false,
                        });
                        this.components.mainWindow.setLayout(new qx.ui.layout.Dock());
                        this.components.mainWindow.center();
                        this.components.panelStack = new qx.ui.container.Stack();
                        this.components.mainWindow.add(this.components.panelStack, { edge: 'center' });
                        // Panel init
                        this.components.panels.init = new qx.ui.container.Composite(new qx.ui.layout.VBox(5));
                        this.components.panels.init.add(new qx.ui.basic.Label().set({
                            value: `Initializing...`,
                            rich: true,
                            textColor: logColors.NORMAL_WHITE,
                        }));
                        this.components.panelStack.add(this.components.panels.init);
                        // Panel non activated
                        this.components.panels.unRegistered = new qx.ui.container.Composite(new qx.ui.layout.VBox(5));
                        this.components.panels.unRegistered.add(new qx.ui.basic.Label().set({
                            value: `Ask an activation key by clicking the button below`,
                            rich: true,
                            textColor: logColors.NORMAL_WHITE,
                        }));
                        this.components.askKeyButton = new qx.ui.form.Button('Ask a key');
                        this.components.askKeyButton.addListener('execute', this.sendKeyRequest, this);
                        this.components.panels.unRegistered.add(this.components.askKeyButton);
                        this.components.panels.unRegistered.add(new qx.ui.basic.Label().set({
                            value: `Wait a few seconds to receive a message containing your activation key.<br/>Copy paste the activation key in the field below and activate your account.`,
                            rich: true,
                            textColor: logColors.NORMAL_WHITE,
                        }));
                        this.components.spykeyTextField = new qx.ui.form.TextField().set({
                            width: 150,
                        });
                        this.components.panels.unRegistered.add(this.components.spykeyTextField);
                        this.components.validateKeyButton = new qx.ui.form.Button('Validate key');
                        this.components.validateKeyButton.addListener('execute', this.sendKeyActivation, this);
                        this.components.panels.unRegistered.add(this.components.validateKeyButton);
                        this.components.panelStack.add(this.components.panels.unRegistered);
                        // Panel activated
                        this.components.panels.authenticated = new qx.ui.container.Composite(new qx.ui.layout.VBox(5));
                        this.components.authLabel = new qx.ui.basic.Label('Authenticated').set({
                            textAlign: 'center',
                            rich: true,
                            textColor: logColors.SUCCESS,
                        });
                        this.components.panels.authenticated.add(this.components.authLabel);
                        this.components.openAppButton = new qx.ui.form.Button('Open App');
                        this.components.openAppButton.addListener('execute', this.onOpenAppButton, this);
                        this.components.panels.authenticated.add(this.components.openAppButton);
                        this.components.updateLabel = new qx.ui.basic.Label('').set({
                            textAlign: 'left',
                            rich: true,
                            textColor: logColors.NORMAL_WHITE,
                        });
                        this.components.panels.authenticated.add(this.components.updateLabel);
                        this.components.panelStack.add(this.components.panels.authenticated);
                        // bottom label
                        this.components.bottomLabel = new qx.ui.basic.Label('').set({
                            textAlign: 'left',
                            rich: true,
                            textColor: logColors.NORMAL_WHITE,
                        });
                        this.components.mainWindow.add(this.components.bottomLabel, { edge: 'south' });
                    },
                    refreshWindow: function () {
                        if (!this.components.mainWindow) {
                            return;
                        }
                        switch (this.status) {
                            case 'INIT':
                                this.components.panelStack.setSelection([this.components.panelStack.getChildren()[0]]);
                                break;
                            case 'UNREGISTERED':
                                this.components.panelStack.setSelection([this.components.panelStack.getChildren()[1]]);
                                break;
                            case 'AUTHENTICATED':
                                this.components.panelStack.setSelection([this.components.panelStack.getChildren()[2]]);
                                this.components.openAppButton.set({
                                    enabled: true,
                                });
                                this.components.authLabel.set({
                                    value: 'Authenticated',
                                    textColor: logColors.SUCCESS,
                                });
                                break;
                        }
                    },
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // UI Methods
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    displayMessage: function (message, color = '#000000') {
                        if (this.components.bottomLabel) {
                            this.components.bottomLabel.set({
                                value: message,
                                textColor: color,
                            });
                        }
                    },
                    displayMessageUpdate: function (message, color = '#000000') {
                        if (this.components.updateLabel) {
                            this.components.updateLabel.set({
                                value: message,
                                textColor: color,
                            });
                        }
                    },
                    createImage: function (icon, w = 16, h = 16) {
                        const image = new qx.ui.basic.Image(icon);
                        image.setScale(true);
                        image.setWidth(w);
                        image.setHeight(h);
                        return image;
                    },
                    generatePanelLayout: function (panel, coordx, coordy) {
                        this.requestAPI('layout', { coordx, coordy }, (data) => {
                            panel.removeAll();
                            const base = this.cncoptToLayout(data.layout);
                            for (let y = 0; y < 8; y++) {
                                for (let x = 0; x < 9; x++) {
                                    const cell = new qx.ui.core.Widget();
                                    cell.set({
                                        width: 4,
                                        height: 4,
                                    });
                                    switch (base[y][x]) {
                                        case 't':
                                            cell.set({ backgroundColor: '#2cc51f' });
                                            break;
                                        case 'c':
                                            cell.set({ backgroundColor: '#221fff' });
                                            break;
                                        default:
                                            cell.set({ backgroundColor: '#ffdea3' });
                                            break;
                                    }
                                    panel.add(cell, { row: y, column: x });
                                }
                            }
                        });
                    },
                    planNextUpdate: function () {
                        clearInterval(this.intervals.updateTimeout);
                        clearInterval(this.intervals.nextUpdate);
                        const goal = new Date().getTime() + this.updateTimeout;
                        this.intervals.nextUpdate = setInterval(() => {
                            this.displayMessageUpdate(`Next update : ${ClientLib.Vis.VisMain.FormatTimespan((goal - new Date().getTime()) / 1000)}`, logColors.NORMAL_WHITE);
                        }, 1000);
                        this.intervals.updateTimeout = setTimeout(this.collectData.bind(this), this.updateTimeout);
                    },
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // UI Events
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    onOverviewSaveButton: function () {
                        this.storage.apiToken = this.tabs.overview.textfieldToken.getValue().trim();
                        this.storage.serverUrl = this.tabs.overview.textfieldServer
                            .getValue()
                            .trim()
                            .replace(/(.*[^\/]+)([\/]+$)/, (_f, a) => a);
                        this.saveStorage();
                        this.refreshPageOverview();
                        this.onOverviewModeAutoCheckButton();
                        this.onManageTableRefreshButton();
                    },
                    onOpenAppButton: function () {
                        window.open(`https://spy-cnc.fr/CNC/bi/bi5/alliance/${this.token}`, 'BaseInfo V5', '');
                    },
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // Game Callbacks
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    onManageGetPublicCityInfoById: function (context, data) {
                        const i = this.toutouList.findIndex(t => t.gamePlayerId === this.selectedToutouId);
                        this.toutouList[i] = Object.assign(Object.assign({}, this.toutouList[i]), { city: {
                                id: data.i,
                                name: data.n,
                                x: data.x,
                                y: data.y,
                                isGhost: data.g,
                            } });
                        this.refreshPageManage();
                    },
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // bi.token.ask.api : Demande de clé
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    sendKeyRequest: function () {
                        this.components.askKeyButton.set({
                            enabled: false,
                        });
                        this.displayMessage('Asking for key...', logColors.NORMAL_WHITE);
                        this.callApi('bi.token.ask.api', {
                            name: ClientLib.Data.MainData.GetInstance()
                                .get_Cities()
                                .get_CurrentOwnCity()
                                .get_PlayerName(),
                            aid: ClientLib.Data.MainData.GetInstance()
                                .get_Alliance()
                                .get_Id(),
                            aname: ClientLib.Data.MainData.GetInstance()
                                .get_Alliance()
                                .get_Name(),
                        }, (res) => {
                            this.displayMessage('Key asked successfully', logColors.SUCCESS);
                            setTimeout(() => {
                                this.components.askKeyButton.set({
                                    enabled: true,
                                });
                            }, 5000);
                        }, (err) => {
                            this.displayMessage('Error during Key request', logColors.ERROR);
                            setTimeout(() => {
                                this.components.askKeyButton.set({
                                    enabled: true,
                                });
                            }, 5000);
                        });
                    },
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // bi.token.req : Activation de clé
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    sendKeyActivation: function () {
                        this.displayMessage('Activating key...', logColors.NORMAL_WHITE);
                        this.callApi('bi.token.req', {
                            yk: this.components.spykeyTextField.getValue().trim(),
                        }, (res) => {
                            this.displayMessage('Key activated successfully', logColors.SUCCESS);
                            this.token = res.token;
                            this.storage.token = res.token;
                            this.status = 'AUTHENTICATED';
                            this.saveStorage();
                            // Premier envoi de données nécessaire afin de valider completement le token
                            this.collectData(res => {
                                if (res) {
                                    this.refreshWindow();
                                }
                            });
                        }, (err) => {
                            this.displayMessage('Error during Key activation', logColors.ERROR);
                        });
                    },
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // bi.update : Envoi de données
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    collectData: function (cb) {
                        this.displayMessage('Updating...', logColors.NORMAL_WHITE);
                        clearTimeout(this.intervals.updateTimeout);
                        // Get instances
                        const server = ClientLib.Data.MainData.GetInstance().get_Server();
                        const alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
                        const player = ClientLib.Data.MainData.GetInstance().get_Player();
                        const cities = ClientLib.Data.MainData.GetInstance().get_Cities();
                        const inventory = ClientLib.Data.MainData.GetInstance().get_Inventory();
                        const arsenal = ClientLib.Data.MainData.GetInstance().get_ArsenalHandler();
                        const sub = ClientLib.Data.MainData.GetInstance()
                            .get_PlayerSubstitution()
                            .getOutgoing();
                        // Init object with safe data
                        const data = {
                            world: {
                                wid: server.get_WorldId(),
                                name: server.get_Name(),
                            },
                            player: {
                                pid: cities.get_CurrentOwnCity().get_PlayerId(),
                                name: cities.get_CurrentOwnCity().get_PlayerName(),
                                grade: player.get_Title(),
                                grade_icon_p: player.get_TitleIcon(),
                                gradeLvl: 0,
                                rank_name: (alliance.get_MemberDataAsArray() || [])
                                    .filter(d => !!d)
                                    .reduce((p, c) => (p || c.Id === cities.get_CurrentOwnCity().get_PlayerId() ? c.RoleName : null), null) || '',
                                faction: player.get_Faction() == 1 ? 'gdi' : player.get_Faction() == 2 ? 'nod' : '',
                                score: player.get_ScorePoints(),
                                pc: player.GetCommandPointCount(),
                                pc_max: 0,
                                repa_max: 0,
                                supply: Math.floor(player.GetSupplyPointCount()),
                                supply_max: player.GetSupplyPointMaxStorage(),
                                credits: player.get_Credits().Base,
                                pr: player.get_ResearchPoints(),
                                funds: inventory.get_PlayerFunds(),
                                classement: player.get_OverallRank(),
                                pack: player.get_PackageCount(),
                                pvp: 0,
                                pve: 0,
                                bases: [],
                                sub: sub === null
                                    ? false
                                    : {
                                        pid: sub['p1'],
                                        name: sub['n'],
                                    },
                                vcm: 'never',
                                research: {},
                            },
                            alliance: {
                                aid: alliance.get_Id(),
                                name: alliance.get_Name(),
                                desc: alliance.get_Description(),
                                poi_tib: alliance.get_POITiberiumBonus(),
                                poi_nrj: alliance.get_POIPowerBonus(),
                                poi_cry: alliance.get_POICrystalBonus(),
                                poi_def: alliance.get_POIDefenseBonus(),
                                poi_avi: alliance.get_POIAirBonus(),
                                poi_inf: alliance.get_POIInfantryBonus(),
                                poi_veh: alliance.get_POIVehicleBonus(),
                                rank: alliance.get_Rank(),
                                score_avg: alliance.get_AverageScore(),
                                score_tot: alliance.get_TotalScore(),
                                members: (alliance.get_MemberDataAsArray() || [])
                                    .filter(d => !!d)
                                    .reduce((p, c) => (Object.assign(Object.assign({}, p), { [`${c.Id}`]: { name: c.Name, role: c.RoleName } })), {}),
                                RelationStatus: (alliance.get_Relationships() || []).map(r => ({
                                    alliance_id: r.OtherAllianceId,
                                    alliance_name: r.OtherAllianceName,
                                    alliance_status: r.Relationship,
                                })),
                            },
                            topAlliances: [],
                        };
                        // Compute next VCM
                        try {
                            const rech_faction = ClientLib.Base.Tech.GetTechIdFromTechNameAndFaction(ClientLib.Base.ETechName.Research_BaseFound, player.get_Faction());
                            const nextLevelInfo = player
                                .get_PlayerResearch()
                                .GetResearchItemFomMdbId(rech_faction)
                                .get_NextLevelInfo_Obj();
                            const creditsNeeded = nextLevelInfo.rr.find(r => r.t === ClientLib.Base.EResourceType.Gold).c;
                            const creditGrowthPerHour = (player.get_Credits().Delta + player.get_Credits().ExtraBonusDelta) *
                                ClientLib.Data.MainData.GetInstance()
                                    .get_Time()
                                    .get_StepsPerHour();
                            const creditTimeLeftInHours = (creditsNeeded - player.GetCreditsCount()) / creditGrowthPerHour;
                            if (creditTimeLeftInHours <= 0) {
                                data.player.vcm = 'ready';
                            }
                            else if (creditGrowthPerHour == 0) {
                                data.player.vcm = 'never';
                            }
                            else {
                                if (creditTimeLeftInHours >= 24 * 100) {
                                    data.player.vcm = '> 99';
                                }
                                else {
                                    data.player.vcm = ClientLib.Vis.VisMain.FormatTimespan(creditTimeLeftInHours * 60 * 60).replace(/:(?=.*:.*:.*)/, 'd');
                                }
                            }
                        }
                        catch (e) {
                            console.log('BIV5', e);
                            this.displayMessage('Error during BaseInfo update : VCM', logColors.ERROR);
                        }
                        // Compute research
                        try {
                            const mapping = {
                                errors: {
                                    [ClientLib.Data.PlayerResearchItem.EResearchErrors.ENone]: 'ENone',
                                    [ClientLib.Data.PlayerResearchItem.EResearchErrors.ENotResearched]: 'ENotResearched',
                                    [ClientLib.Data.PlayerResearchItem.EResearchErrors.EMissingRequirements]: 'EMissingRequirements',
                                    [ClientLib.Data.PlayerResearchItem.EResearchErrors.EPlayerLvlToLow]: 'EPlayerLvlToLow',
                                    [ClientLib.Data.PlayerResearchItem.EResearchErrors.EFullyUpgraded]: 'EFullyUpgraded',
                                    [17]: 'EFullyUpgraded',
                                    [ClientLib.Data.PlayerResearchItem.EResearchErrors.ENoUpgradeAvailable]: 'ENoUpgradeAvailable',
                                },
                                types: {
                                    [ClientLib.Data.Arsenal.EArsenalType.None]: 'None',
                                    [ClientLib.Data.Arsenal.EArsenalType.Unit]: 'Unit',
                                    [ClientLib.Data.Arsenal.EArsenalType.Building]: 'Building',
                                    [ClientLib.Data.Arsenal.EArsenalType.MCV]: 'MCV',
                                    [ClientLib.Data.Arsenal.EArsenalType.SupportBuilding]: 'SupportBuilding',
                                },
                                cat: {
                                    [ClientLib.Data.Arsenal.ArsenalHandler.EArsenalCategory.All]: 'All',
                                    [ClientLib.Data.Arsenal.ArsenalHandler.EArsenalCategory.AllOffense]: 'AllOffense',
                                    [ClientLib.Data.Arsenal.ArsenalHandler.EArsenalCategory.AllDefense]: 'AllDefense',
                                    [ClientLib.Data.Arsenal.ArsenalHandler.EArsenalCategory.OffenseInfantry]: 'OffenseInfantry',
                                    [ClientLib.Data.Arsenal.ArsenalHandler.EArsenalCategory.OffenseVehicle]: 'OffenseVehicle',
                                    [ClientLib.Data.Arsenal.ArsenalHandler.EArsenalCategory.OffenseAir]: 'OffenseAir',
                                    [ClientLib.Data.Arsenal.ArsenalHandler.EArsenalCategory.DefenseInfantry]: 'DefenseInfantry',
                                    [ClientLib.Data.Arsenal.ArsenalHandler.EArsenalCategory.DefenseVehicle]: 'DefenseVehicle',
                                    [ClientLib.Data.Arsenal.ArsenalHandler.EArsenalCategory.DefenseBuilding]: 'DefenseBuilding',
                                    [ClientLib.Data.Arsenal.ArsenalHandler.EArsenalCategory.BaseBuilding]: 'BaseBuilding',
                                },
                            };
                            const listCats = {
                                AllOffense: arsenal.GetArsenalUnits(player.get_Faction(), ClientLib.Data.Arsenal.ArsenalHandler.EArsenalCategory.AllOffense),
                                AllDefense: arsenal.GetArsenalUnits(player.get_Faction(), ClientLib.Data.Arsenal.ArsenalHandler.EArsenalCategory.AllDefense),
                                BaseBuilding: arsenal.GetArsenalUnits(player.get_Faction(), ClientLib.Data.Arsenal.ArsenalHandler.EArsenalCategory.BaseBuilding),
                            };
                            const researchs = {
                                mcv: player.get_PlayerResearch().GetResearchItemListByType(ClientLib.Data.Arsenal.EArsenalType.MCV),
                                unit: player.get_PlayerResearch().GetResearchItemListByType(ClientLib.Data.Arsenal.EArsenalType.Unit),
                                building: player.get_PlayerResearch().GetResearchItemListByType(ClientLib.Data.Arsenal.EArsenalType.Building),
                                supportBuilding: player.get_PlayerResearch().GetResearchItemListByType(ClientLib.Data.Arsenal.EArsenalType.SupportBuilding),
                            };
                            Object.entries(listCats).forEach(([catKey, catValue]) => {
                                Object.entries(catValue).forEach(([unitKey, unitValue]) => {
                                    if (unitKey === 'l') {
                                        Object.values(unitValue).forEach(entityValue => {
                                            const entity = arsenal.GetArsenalEntity(entityValue);
                                            data.player.research[entityValue.MdbId] = {
                                                type: mapping.types[entity.get_ArsenalType()] || entity.get_ArsenalType(),
                                                cat: catKey,
                                                name: entity.get_Name(),
                                                desc: '',
                                                status: null,
                                            };
                                        });
                                    }
                                });
                            });
                            Object.values(researchs)
                                .filter(r => !!r)
                                .forEach(rValue => {
                                if (!!rValue.l) {
                                    Object.values(rValue.l).forEach((itemValue) => {
                                        if (data.player.research[`${itemValue.get_GameDataTech_Obj().c}`]) {
                                            data.player.research[`${itemValue.get_GameDataTech_Obj().c}`].status = {
                                                lvl: itemValue.get_CurrentLevel(),
                                                err: mapping.errors[itemValue.get_ErrorCode()] || itemValue.get_ErrorCode(),
                                                next: !!itemValue.get_NextLevelInfo_Obj()
                                                    ? {
                                                        credits: itemValue.get_NextLevelInfo_Obj().rr[0]['c'],
                                                        pr: itemValue.get_NextLevelInfo_Obj().rr[1]['c'],
                                                    }
                                                    : null,
                                            };
                                        }
                                        else {
                                            data.player.research['?_' + itemValue.get_GameDataTech_Obj().c] = {
                                                name: '?',
                                                desc: '?',
                                                status: {
                                                    lvl: itemValue.get_CurrentLevel(),
                                                    err: mapping.errors[itemValue.get_ErrorCode()] || itemValue.get_ErrorCode(),
                                                    next: !!itemValue.get_NextLevelInfo_Obj()
                                                        ? {
                                                            credits: itemValue.get_NextLevelInfo_Obj().rr[0]['c'],
                                                            pr: itemValue.get_NextLevelInfo_Obj().rr[1]['c'],
                                                        }
                                                        : null,
                                                },
                                            };
                                        }
                                    });
                                }
                            });
                        }
                        catch (e) {
                            console.log('BIV5', e);
                            this.displayMessage('Error during BaseInfo update : Research', logColors.ERROR);
                        }
                        // Compute bases
                        try {
                            this.getOwnCitiesAsArray().forEach((city, bid) => {
                                const unitData = city.get_CityBuildingsData();
                                const df = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Defense_Facility);
                                const hq = unitData.GetUniqueBuildingByTechName(ClientLib.Base.ETechName.Defense_HQ);
                                data.player.pc_max = city.GetResourceMaxStorage(ClientLib.Base.EResourceType.CommandPoints);
                                data.player.repa_max = Math.max(data.player.repa_max, city.GetResourceMaxStorage(ClientLib.Base.EResourceType.RepairChargeInf));
                                data.player.bases.push({
                                    bid,
                                    coord_x: city.get_PosX(),
                                    coord_y: city.get_PosY(),
                                    name: city.get_Name(),
                                    score: 0,
                                    id_base: 0,
                                    cncopt: '',
                                    niv_cc: !!city.get_CommandCenterLevel() ? city.get_CommandCenterLevel() : 0,
                                    niv_yard: city.get_ConstructionYardLevel(),
                                    niv_base: city.get_LvlBase(),
                                    niv_qg: !!hq ? hq.get_CurrentLevel() : 0,
                                    niv_df: !!df ? df.get_CurrentLevel() : 0,
                                    niv_def: city.get_LvlDefense(),
                                    niv_off: city.get_LvlOffense(),
                                    niv_sup: !!city.get_SupportData() ? city.get_SupportData().get_Level() : 0,
                                    type_sup: !!city.get_SupportData() ? city.get_SupportData().get_Type() : 0,
                                    tib_con: city.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Tiberium, false, false),
                                    tib_tot: city.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Tiberium, false, false) +
                                        city.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Tiberium),
                                    cry_con: city.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Crystal, false, false),
                                    cry_tot: city.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Crystal, false, false) +
                                        city.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Crystal),
                                    nrj_con: city.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Power, false, false),
                                    nrj_tot: city.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Power, false, false) +
                                        city.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Power),
                                    cre_con: ClientLib.Base.Resource.GetResourceGrowPerHour(city.get_CityCreditsProduction(), false),
                                    cre_tot: ClientLib.Base.Resource.GetResourceGrowPerHour(city.get_CityCreditsProduction(), false) +
                                        ClientLib.Base.Resource.GetResourceBonusGrowPerHour(city.get_CityCreditsProduction(), false),
                                    repa_left: city.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeInf),
                                    repa_avi: city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false),
                                    repa_veh: city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false),
                                    repa_inf: city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, false),
                                    base_data: [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
                                });
                                const units = this.getUnitArrays(city);
                                units.forEach(u => {
                                    const isBuilding = !!u.get_TechGameData_Obj && u.get_TechGameData_Obj().n in layoutMapping.buildings;
                                    const isDef = !u.get_TechGameData_Obj && !!u.get_UnitGameData_Obj && u.get_UnitGameData_Obj().n in layoutMapping.defense;
                                    const isOff = !u.get_TechGameData_Obj && !!u.get_UnitGameData_Obj && u.get_UnitGameData_Obj().n in layoutMapping.offense;
                                    const mappedName = isBuilding
                                        ? layoutMapping.buildings[u.get_UnitGameData_Obj().n]
                                        : isDef
                                            ? layoutMapping.defense[u.get_UnitGameData_Obj().n]
                                            : isOff
                                                ? layoutMapping.offense[u.get_UnitGameData_Obj().n]
                                                : '.';
                                    data.player.bases[bid].base_data[u.get_CoordY() + (isBuilding ? 0 : isDef ? 8 : isOff ? 16 : 0)][u.get_CoordX()] = `${u.get_CurrentLevel() > 1 ? u.get_CurrentLevel() : ''}${mappedName}`;
                                });
                                const techLayout = this.getTechLayout(city);
                                for (let y = 0; y < 20; y++) {
                                    for (let x = 0; x < 9; x++) {
                                        const field = techLayout[x][y];
                                        switch (y >= 16 ? 0 : city.GetResourceType(x, y)) {
                                            case 0:
                                                data.player.bases[bid].base_data[y][x] = data.player.bases[bid].base_data[y][x] || '.';
                                                break;
                                            case 1: // Crystal
                                                data.player.bases[bid].base_data[y][x] = field.BuildingIndex < 0 ? 'c' : data.player.bases[bid].base_data[y][x];
                                                break;
                                            case 2: // Tiberium
                                                data.player.bases[bid].base_data[y][x] = field.BuildingIndex < 0 ? 't' : data.player.bases[bid].base_data[y][x];
                                                break;
                                            case 4: // Woods
                                                data.player.bases[bid].base_data[y][x] = 'j';
                                                break;
                                            case 5: // Scrub
                                                data.player.bases[bid].base_data[y][x] = 'h';
                                                break;
                                            case 6: // Oil
                                                data.player.bases[bid].base_data[y][x] = 'l';
                                                break;
                                            case 7: // Swamp
                                                data.player.bases[bid].base_data[y][x] = 'k';
                                                break;
                                            default:
                                                data.player.bases[bid].base_data[y][x] = '.';
                                                break;
                                        }
                                    }
                                }
                            });
                        }
                        catch (e) {
                            console.log('BIV5', e);
                            this.displayMessage('Error during BaseInfo update : Bases', logColors.ERROR);
                        }
                        // Compute Info player
                        const callBack = (context, res) => {
                            try {
                                data.player.pve = res.bde;
                                data.player.pvp = res.d;
                                (res.c || []).forEach((b, i) => {
                                    data.player.bases[i].id_base = b.i;
                                    data.player.bases[i].score = b.p;
                                });
                                console.log('BIV5', '>>> sending', data);
                                this.sendData(data, cb ? cb.bind(this) : null);
                            }
                            catch (e) {
                                console.log('BIV5', e);
                                this.displayMessage('Error during BaseInfo update : PlayerInfo', logColors.ERROR);
                            }
                        };
                        ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand('GetPublicPlayerInfoByName', { name: data.player.name }, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, callBack.bind(this)), null);
                    },
                    sendData: function (data, cb) {
                        this.callApi('bi.update', data, (res) => {
                            this.displayMessage('Sync OK', logColors.SUCCESS);
                            this.status = 'AUTHENTICATED';
                            this.refreshWindow();
                            this.planNextUpdate();
                            if (cb) {
                                cb(true);
                            }
                        }, (err) => {
                            this.displayMessage('Sync Error', logColors.ERROR);
                            this.planNextUpdate();
                            if (cb) {
                                cb(false);
                            }
                        });
                    },
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // layout.scan : Envoi de scans
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    sendScans: function () { },
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // API Requests
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    callApi: function (r, data, onSuccess, onError) {
                        const self = this;
                        if (['bi.token.req', 'bi.token.ask.api', 'bi.update', 'layout.scan', 'resa.request'].includes(r)) {
                            const params = { r };
                            switch (r) {
                                case 'bi.update':
                                case 'resa.request':
                                case 'layout.scan':
                                    params.t = this.token;
                                    params.wid = this.wid;
                                    params.pid = this.pid;
                                    break;
                                case 'bi.token.req':
                                case 'bi.token.ask.api':
                                default:
                                    params.wid = this.wid;
                                    params.pid = this.pid;
                                    break;
                            }
                            fetch(biBackendUrl, {
                                method: 'POST',
                                headers: new Headers({
                                    'Content-Type': 'application/json; charset=UTF-8',
                                }),
                                body: JSON.stringify({ params, data }),
                                cache: 'no-cache',
                            })
                                .then(r => r.json())
                                .then(json => {
                                if (onSuccess) {
                                    onSuccess(json);
                                }
                                else {
                                    self.onRequestDone(json);
                                }
                            })
                                .catch(err => {
                                console.log('BIV5', err);
                                if (onError) {
                                    onError(err);
                                }
                                else {
                                    self.onRequestError(err);
                                }
                            });
                        }
                        else {
                            this.displayMessage(`Call not allowed : ${r}`, logColors.ERROR);
                            if (onError) {
                                onError(`Call not allowed : ${r}`);
                            }
                            else {
                                self.onRequestError(`Call not allowed : ${r}`);
                            }
                        }
                    },
                    onRequestDone: function (response) {
                        console.log('BIV5', 'Unimplemented Request Done', response);
                    },
                    onRequestError: function (error) {
                        console.log('BIV5', 'Unimplemented Request Error', error);
                    },
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // Utils
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    getUnitArrays: function (city) {
                        const res = [];
                        Object.values(city).forEach(cityValue => {
                            if (typeof cityValue === 'object' && !!cityValue) {
                                Object.values(cityValue).forEach(itemValue => {
                                    if (typeof itemValue === 'object' &&
                                        !!itemValue &&
                                        typeof itemValue[unitPropKey] === 'object' &&
                                        !!itemValue[unitPropKey]) {
                                        Object.values(itemValue[unitPropKey]).forEach(unitValue => {
                                            if (typeof unitValue === 'object' && !!unitValue && 'get_CurrentLevel' in unitValue) {
                                                res.push(unitValue);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                        return res;
                    },
                    layoutToFullCncopt: function (baseFaction, offFaction, name, layout) {
                        const res = ['3', baseFaction, offFaction, encodeURI(name), this.layoutToCncopt(layout, true)];
                        return res.join('|');
                    },
                    layoutToCncopt: function (layout, includeOff = false) {
                        const emptyOff = [...Array(9 * 4).keys()].map(() => '.').join('');
                        const res = layout.reduce((p, c) => `${p}${c.reduce((p2, c2) => `${p2}${c2}`, '')}`, '').substring(0, 9 * 16);
                        return `${res}${includeOff ? emptyOff : ''}`;
                    },
                    cncoptToLayout: function (layout) {
                        return layout.split('').reduce((p, c, i) => {
                            if (i < 9 * 16) {
                                p[Math.floor(i / 9)][i % 9] = c;
                            }
                            return p;
                        }, [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]);
                    },
                    getOwnCitiesAsArray: function () {
                        return Object.values(ClientLib.Data.MainData.GetInstance()
                            .get_Cities()
                            .get_AllCities().d || []);
                    },
                    getTechLayout: function (city) {
                        let res = null;
                        Object.values(city).forEach(cityValue => {
                            if (typeof cityValue === 'object' && !!cityValue && ![typeof cityValue[0], typeof cityValue[8]].includes('undefined')) {
                                if (typeof cityValue[0] === 'object' && !!cityValue[0] && typeof cityValue[0][15] !== 'undefined') {
                                    if (typeof cityValue[0][0] === 'object' && !!cityValue[0][0] && typeof cityValue[0][0].BuildingIndex !== 'undefined') {
                                        res = cityValue;
                                    }
                                }
                            }
                        });
                        return res;
                    },
                    getBuildings: function (city) {
                        let res = null;
                        const cityBuildings = city.get_CityBuildingsData();
                        Object.entries(cityBuildings).forEach(([buildingKey, buildingValue]) => {
                            if (PerforceChangelist >= 376877) {
                                if (typeof buildingValue === 'object' &&
                                    !!buildingValue &&
                                    ![typeof buildingValue.c, typeof buildingValue.d].includes('undefined') &&
                                    buildingValue.c > 0) {
                                    res = buildingValue.d;
                                }
                            }
                            else {
                                if (typeof buildingValue === 'object' && !!buildingValue && typeof buildingValue.l !== 'undefined') {
                                    res = buildingValue.l;
                                }
                            }
                        });
                        return res;
                    },
                    centerTo: function (x, y) {
                        return () => {
                            ClientLib.Vis.VisMain.GetInstance().CenterGridPosition(x, y);
                            ClientLib.Vis.VisMain.GetInstance().Update();
                            ClientLib.Vis.VisMain.GetInstance().ViewUpdate();
                        };
                    },
                    openCncLV: function (data) {
                        const cncopt = this.layoutToFullCncopt('F', 'N', `ToutouLayout - ${data[3].x}:${data[3].y}`, data[1]);
                        window.open(`${biCncLVUrl}${cncopt}`, `ToutouLayout - ${data[3].x}:${data[3].y}`);
                    },
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // Storage
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    loadStorage: function () {
                        const storage = JSON.parse(localStorage.getItem(storageKey) || '{}') || {};
                        this.storage = storage[`wid-${this.wid}-${this.pid}`] || {};
                    },
                    saveStorage: function () {
                        const storage = JSON.parse(localStorage.getItem(storageKey) || '{}') || {};
                        storage[`wid-${this.wid}-${this.pid}`] = this.storage;
                        localStorage.setItem(storageKey, JSON.stringify(storage || {}));
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
                    qx.core.Init.getApplication().initDone &&
                    ClientLib &&
                    ClientLib.Data.MainData.GetInstance() &&
                    ClientLib.Data.MainData.GetInstance().get_Cities() &&
                    ClientLib.Data.MainData.GetInstance()
                        .get_Cities()
                        .get_CurrentOwnCity()) {
                    init();
                }
                else {
                    window.setTimeout(checkForInit, 1000);
                }
            }
            catch (e) {
                console.log('BIV5', scriptName, e);
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
            console.log('BIV5', 'Failed to inject script', e);
        }
    }
})();
