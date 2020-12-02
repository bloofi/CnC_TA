// ==UserScript==
// @version	    2020.12.02
// @name        CnCTA TargetWatcher Enhancer
// @downloadURL https://github.com/bloofi/CnC_TA/raw/master/CnCTA-TargetWatcher-Enhancer.user.js
// @updateURL   https://github.com/bloofi/CnC_TA/raw/master/CnCTA-TargetWatcher-Enhancer.user.js
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include     http*://cncapp*.alliances.commandandconquer.com/*/index.aspx*
// @autohor     bloofi (https://github.com/bloofi)
// ==/UserScript==

(function() {
    type Marker = {
        marker: any;
        x: number;
        y: number;
        names: string[];
    };
    const script = () => {
        const scriptName = 'CnCTA TargetWatcher Enhancer';
        const colors = {
            0: '#cccccc',
            1: 'gold',
            2: '#cccccc',
            3: '#cccccc',
        };
        const init = () => {
            /*
            qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.OVL_PLAYAREA).getChildren()[10]
             */
            const me = ClientLib.Data.MainData.GetInstance().get_Player();

            const updateLabel = () => {
                const divParent = qx.core.Init.getApplication()
                    .getUIItem(ClientLib.Data.Missions.PATH.OVL_PLAYAREA)
                    .getChildren()[10];
                if (divParent) {
                    const divParentEl = divParent.getContentElement();
                    if (divParentEl) {
                        divParentEl.realSetStyles = divParentEl.setStyles;
                        divParentEl.setStyles = styles => {
                            divParentEl.realSetStyles({
                                right: '30px',
                                left: 'unset',
                                width: '35%',
                                height: '60px',
                                overflow: 'visible',
                            });
                        };
                    }
                    const divLabel = divParent.getChildren()[0];
                    if (divLabel) {
                        const divLabelEl = divLabel.getContentElement();
                        if (divLabelEl) {
                            divLabelEl.realSetStyles = divLabelEl.setStyles;
                            divLabelEl.setStyles = styles => {
                                divLabelEl.realSetStyles({
                                    height: '100%',
                                    width: '100%',
                                });
                            };
                        }

                        divLabel.realSetValue = divLabel.setValue;
                        divLabel.setValue = value => {
                            const myId = ClientLib.Data.MainData.GetInstance()
                                .get_Player()
                                .get_Id();
                            const bid = ClientLib.Data.MainData.GetInstance()
                                .get_AllianceTargetWatcher()
                                .get_BaseId();
                            const members = ClientLib.Data.MainData.GetInstance()
                                .get_Alliance()
                                .get_MemberDataAsArray();
                            const watchers: any = Object.values(ClientLib.Data.MainData.GetInstance().get_AllianceWatchListWatcher()).reduce(
                                (p, c) => (typeof c === 'object' ? Object.values(c) : p),
                                [],
                            );
                            if (watchers && watchers.length) {
                                const res = watchers.filter(w => w.b === bid && w.p !== myId).map(w => {
                                    const m = members.find(m => m.Id === w.p);
                                    return { ...w, n: m.Name, s: m.OnlineState };
                                });
                                const label = `${res.sort((a, b) => a.s === 1 ? 1 : 0).map(w => `<span style="color:${colors[w.s]};">${w.n}</span>`).join(', ')} ${res.length > 1 ? 'are' : 'is'} watching !`;
                                divLabel.realSetValue(label);
                            }
                        };
                    }
                }
            };
            updateLabel();

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // Markers
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            let gridWidth = null;
            let gridHeight = null;
            let baseMarkerWidth = null;
            let baseMarkerHeight = null;
            let regionZoomFactor = null;
            const markers: { [id: string]: Marker } = {};
            const citiesCache: {
                [id: string]: { x: number; y: number };
            } = {};
            let checkTimeout = null;

            const removeMarkers = () => {
                Object.entries(markers)
                    .filter(m => !!m[1])
                    .forEach(m => {
                        removeMarker(m[1].x, m[1].y);
                    });
            };

            const removeMarker = (x: number, y: number) => {
                if (markers[`${x}:${y}`] && markers[`${x}:${y}`].marker) {
                    qx.core.Init.getApplication()
                        .getDesktop()
                        .remove(markers[`${x}:${y}`].marker);
                    markers[`${x}:${y}`].marker.dispose();
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
                // Object.values(markers)
                //     .filter(b => b.marker)
                //     .forEach(b => {
                //         b.marker.setWidth(baseMarkerWidth);
                //         b.marker.setHeight(baseMarkerHeight);
                //     });
            };

            const addMarker = (x: number, y: number, names: string[]) => {
                const marker = new qx.ui.container.Composite(new qx.ui.layout.Dock()).set({
                    decorator: new qx.ui.decoration.Decorator().set({
                        color: 'rgba(200, 21, 21, 0.5)',
                        style: 'solid',
                        width: 2,
                        radius: 5,
                    }),
                });
                const label = new qx.ui.basic.Label('').set({
                    decorator: new qx.ui.decoration.Decorator().set({
                        color: 'rgba(200, 21, 21, 0.5)',
                        style: 'solid',
                        width: 1,
                        radius: 5,
                    }),
                    value: names.length ? `${names[0]}${names.length > 1 ? ', ...' : ''}` : '',
                    toolTipText: names.length > 1 ? `Other watchers : ${names.slice(1).join(', ')}` : '',
                    textColor: '#ffffff',
                    textAlign: 'center',
                    backgroundColor: 'rgba(200, 21, 21, 0.8)',
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
                    names,
                    marker,
                };
            };

            phe.cnc.Util.attachNetEvent(
                ClientLib.Vis.VisMain.GetInstance().get_Region(),
                'ZoomFactorChange',
                ClientLib.Vis.ZoomFactorChange,
                this,
                resizeMarkers,
            );
            phe.cnc.Util.attachNetEvent(
                ClientLib.Vis.VisMain.GetInstance().get_Region(),
                'PositionChange',
                ClientLib.Vis.PositionChange,
                this,
                repositionMarkers,
            );
            updateMarkerSize();

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // Map watchers
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            const propCampGetId = /return this\..*\.(.*);/.exec(new ClientLib.Vis.Region.RegionNPCCamp().__proto__.get_Id.toString())[1];
            const propBaseGetId = /return this\..*\.(.*);/.exec(new ClientLib.Vis.Region.RegionNPCBase().__proto__.get_Id.toString())[1];

            const checkWatchers = () => {
                removeMarkers();
                if (
                    qx.core.Init.getApplication()
                        .getPlayArea()
                        .getViewMode() === 0
                ) {
                    const members = ClientLib.Data.MainData.GetInstance()
                        .get_Alliance()
                        .get_MemberDataAsArray();
                    const watchers: any = Object.values(ClientLib.Data.MainData.GetInstance().get_AllianceWatchListWatcher()).reduce(
                        (p, c) => (typeof c === 'object' ? Object.values(c) : p),
                        [],
                    );
                    const allItems = Object.values(
                        ClientLib.Vis.VisMain.GetInstance()
                            .get_Region()
                            .GetNPCCamps().d,
                    )
                        .map((c: any) => ({ id: c[propCampGetId], x: c.posX, y: c.posY }))
                        .concat(
                            Object.values(
                                ClientLib.Vis.VisMain.GetInstance()
                                    .get_Region()
                                    .GetNPCBases().d,
                            ).map((c: any) => ({ id: c[propBaseGetId], x: c.posX, y: c.posY })),
                        );

                    const markers = watchers.filter(c => c.p !== me.get_Id()).reduce((p, c) => {
                        if (!p[`${c.b}`]) {
                            let city = citiesCache[`${c.b}`];
                            if (!city) {
                                city = allItems.find(i => i.id === c.b);
                                if (city) {
                                    citiesCache[`${c.b}`] = { x: city.x, y: city.y };
                                }
                            }
                            p[`${c.b}`] = {
                                b: c.b,
                                isLoaded: !!city,
                                x: city ? city.x : null,
                                y: city ? city.y : null,
                                names: [],
                            };
                        }
                        p[`${c.b}`].names.push(members.find(m => m.Id === c.p).Name);

                        return p;
                    }, {});

                    Object.entries(markers)
                        .filter(([b, m]: [string, any]) => m.isLoaded)
                        .forEach(([_b, m]: [string, any]) => {
                            addMarker(m.x, m.y, m.names);
                        });
                }
                checkTimeout = setTimeout(checkWatchers, 3000);
            };
            checkWatchers();
        };

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Game load state Checking
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function checkForInit() {
            try {
                if (
                    typeof qx !== 'undefined' &&
                    qx &&
                    qx.core &&
                    qx.core.Init &&
                    qx.core.Init.getApplication &&
                    qx.core.Init.getApplication() &&
                    qx.core.Init.getApplication().initDone
                ) {
                    init();
                } else {
                    window.setTimeout(checkForInit, 1000);
                }
            } catch (e) {
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
        } catch (e) {
            console.log('Failed to inject script', e);
        }
    }
})();
