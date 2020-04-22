declare type WindowFixed = Window & { _addEventListener: typeof Window.prototype.addEventListener };

type MChildrenHandling = {
    add : (child: any) => void;
    addAfter : (child: any, after: any) => void;
    addAt : (child: any, index: number) => void;
    addBefore : (child: any, index: number) => void;
    getChildren : () => any[];
    hasChildren : () => boolean;
    indexOf : (child: any) => void;
    remove: (child: any) => void;
    removeAll: () => void;
    removeAt : (index: number) => void;
}
declare var qx;
type qx = {
    $$environment: any;
    $$g: any;
    $$libraries: any;
    $$loader: any;
    $$locales: any;
    $$packageData: any;
    $$resources: any;
    $$start: any;
    $$translations: any;
    Bootstrap: any;
    Class: {
        define: any;
    };
    Interface: any;
    Mixin: any;
    Part: any;
    Theme: any;
    application: any;
    bom: any;
    core: {
        Aspect: any;
        Assert: any;
        AssertionError: any;
        BaseInit: any;
        Environment: any;
        GlobalError: any;
        Init: {
            $$classtype: any;
            $$type: any;
            __dd: any;
            __de: any;
            __df: any;
            basename: any;
            classname: any;
            getApplication: () => {
                getChat: () => {
                    getChatWidget: () => {
                        focusInput: () => void;
                        getEditable: () => any;
                        getHasAllianceForum: () => boolean;
                        getIsOfficer: () => boolean;
                        ignoreUnignorePlayer: () => void;
                        initHasAllianceForum: () => void;
                        initIsOfficer: () => void;
                        isPlayerIgnored: () => boolean;
                        name: string;
                        resetHasAllianceForum: () => void;
                        resetIsOfficer: () => void;
                        resetRuntimeHasAllianceForum: () => void;
                        resetRuntimeIsOfficer: () => void;
                        scrollToEnd: () => void;
                        send: () => void;
                        setContentMinWidth: () => void;
                        setCursorEnd: () => void;
                        setHasAllianceForum: () => void;
                        setIsOfficer: () => void;
                        setRuntimeHasAllianceForum: () => void;
                        setRuntimeIsOfficer: () => void;
                        setTab: () => void;
                        showMessage: () => void;
                        syncMaxHeight: () => void;
                    };
                };
                getDesktop: () => any;
                getBackgroundArea: () => MChildrenHandling;
            };
            name: any;
            ready: any;
            toString: any;
        };
        MEvent: any;
        MLogging: any;
        MProperty: any;
        Object: any;
        ObjectRegistry: any;
        Property: any;
        ValidationError: any;
        WindowError: any;
    };
    data: any;
    dev: any;
    dom: any;
    event: any;
    html: any;
    io: any;
    lang: any;
    locale: any;
    log: any;
    module: any;
    phe: any;
    theme: any;
    type: any;
    ui: any;
    util: any;
    xml: any;
};

declare var phe;
type phe = {
    cnc: {
        Util: {
            createEventDelegate: (a: any, b: any, cb: any) => any;
        };
    };
    desktop: any;
};

declare var webfrontend;
type webfrontend = {
    Application: {
        $$events: any;
        $$properties: any;
        $$type: any;
        __ni: any;
        base: any;
        basename: any;
        classname: any;
        constructor: any;
        displayName: any;
        legacySocHeight: any;
        legacySocWidth: any;
        legacySocWidthDefense: any;
        preloadImageSource: any;
        preloadImageSources: any;
        preloadImageUri: any;
    };
    DebugCommands: any;
    data: {
        AllianceEvents: any;
        ChallengeEvents: any;
        InfoTracker: any;
        ItemEvents: any;
        NotificationCategoryDataModel: any;
        ReportHeaderDataModel: any;
        SimpleColFormattingDataModel: any;
        missions: any;
    };
    gui: {
        BackgroundArea: any;
        BackgroundCustomWindow: any;
        BadBrowserWindow: any;
        BottomOverlay: any;
        CurrencyChangeInfoPopup: any;
        CustomWindow: any;
        EndSubstitutionWidget: any;
        GroupBoxLarge: any;
        MAnimateable: any;
        MainOverlay: any;
        MaintenanceWindow: any;
        MarkerManager: any;
        MenuOverlayWidget: any;
        MessageBox: any;
        MessageDialogBox: any;
        NewPlayerWidget: any;
        OverlayWidget: any;
        OverlayWindow: any;
        PlayArea: any;
        PlayerRelocateWidget: any;
        PreloadObserverGui: any;
        ReportAbuseWindow: any;
        ResourcePopup: any;
        ResourcesProduction: any;
        RewardsWidget: any;
        ScrollBoxBarWidget: any;
        ShortkeyMapper: any;
        SocialNetworkHelper: any;
        SystemMessageWidget: any;
        TooltipOverlay: any;
        UseGiftOverlay: any;
        Util: any;
        UtilTech: any;
        UtilToolTips: any;
        UtilView: any;
        WorldToolTip: any;
        alliance: any;
        arsenal: any;
        bars: any;
        challenge: any;
        chat: {
            ChatButtonWidget: any;
            ChatWidget: {
                $$events: any;
                $$properties: any;
                $$type: any;
                base: any;
                basename: any;
                channel: {
                    all: 1;
                    allflags: 31;
                    alliance: 2;
                    global: 16;
                    officers: 4;
                    whisper: 8;
                };
                classname: any;
                constructor: any;
                context: any;
                displayName: any;
                recvbufsize: any;
                recvbufsizeGlobal: any;
                self: any;
                sender: any;
                sentbufsize: any;
                superclass: any;
                ticks_blink: any;
                toString: any;
                ui: any;
            };
            ChatWindow: any;
        };
        details: any;
        experimental: any;
        forum: any;
        info: any;
        layout: any;
        mail: any;
        missions: any;
        monetization: any;
        notifications: any;
        options: any;
        preArmySetup: any;
        production: any;
        ranking: any;
        region: {
            RegionCityMenu: any;
            RegionNPCCampStatusInfo: any;
        };
        repair: any;
        reports: any;
        research: any;
        system: any;
        trade: any;
        util: any;
        widgets: any;
    };
    res: {};
    theme: {};
    ui: {};
};

declare var GAMEDATA;
type GAMEDATA = {
    Tech: { [id: number]: { n: string } };
};

declare var PerforceChangelist;
type PerforceChangelist = number;

declare var ClientLib;
type ClientLib = {
    /** * * * * * * * * * * * * * * * * * * Typing ClientLib.Base * * * * * * * * * * * * * * * * * * * * * */
    Base: {
        Util: {
            CalculateDistance: (x1: number, y1: number, x2: number, y2: number) => string;
        };
        Tech: {
            GetTechIdFromTechNameAndFaction: (rechType: any, faction: number) => any;
            GetTechNameFromTechId: (id: number, faction: number) => string;
        };
        Resource: {
            GetResourceGrowPerHour: (prod: number, a: boolean) => number;
            GetResourceBonusGrowPerHour: (prod: number, a: boolean) => number;
        };
        ETechName: {
            Accumulator: 16;
            Airport: 7;
            Barracks: 5;
            Command_Center: 3;
            Construction_Yard: 0;
            Defense_Facility: 8;
            Defense_HQ: 4;
            Factory: 6;
            Harvester: 11;
            Harvester_Crystal: 10;
            Invalid: -1;
            PowerPlant: 2;
            Refinery: 1;
            Research_BaseFound: 9;
            Silo: 15;
            Support_Air: 12;
            Support_Art: 14;
            Support_Ion: 13;
        };
        EResourceType: {
            None: 0;
            Tiberium: 1;
            Crystal: 2;
            Gold: 3;
            PlayerLevel: 4;
            Power: 5;
            ResearchPoints: 6;
            RepairChargeBase: 7;
            RepairChargeAir: 8;
            RepairChargeInf: 9;
            RepairChargeVeh: 10;
            RepairChargeOffense_RewardsOnly: 11;
            CommandPoints: 15;
            SupplyPoints: 16;
            PackageProduction: 17;
            VeteranPoints: 18;
        };
    };
    /** * * * * * * * * * * * * * * * * * * Typing ClientLib.Data * * * * * * * * * * * * * * * * * * * * * */
    Data: {
        EUnitGroup: {
            Aircraft: 3;
            Defense: 0;
            Infantry: 1;
            None: -1;
            Vehicle: 2;
        };
        Arsenal: {
            ArsenalHandler: {
                EArsenalCategory: {
                    All: 1;
                    AllDefense: 3;
                    AllOffense: 2;
                    BaseBuilding: 10;
                    DefenseBuilding: 9;
                    DefenseInfantry: 7;
                    DefenseVehicle: 8;
                    None: 0;
                    OffenseAir: 6;
                    OffenseInfantry: 4;
                    OffenseVehicle: 5;
                };
            };
            EArsenalType: {
                None: 0;
                Unit: 1;
                Building: 2;
                MCV: 3;
                SupportBuilding: 4;
            };
        };
        MainData: {
            GetInstance: () => {
                get_ArsenalHandler: () => {
                    GetArsenalUnits: (faction: number, unit: any) => {};
                    GetArsenalEntity: (v: any) => any;
                };
                get_Cities: () => {
                    get_AllCities: () => {
                        c: number;
                        d: { [id: number]: City };
                        l: any;
                    };
                    GetCity: (id: number) => City;
                    get_CurrentCity: () => any;
                    get_CurrentCityId: () => number;
                    get_CurrentOwnCity: () => {
                        get_PlayerId: () => number;
                        get_PlayerName: () => string;
                    };
                    get_CurrentOwnCityId: () => number;
                    set_CurrentCityId: (id: number) => void;
                };
                get_Player: () => {
                    id: number;
                    name: string;
                    get_Title: () => string;
                    get_TitleIcon: () => string;
                    get_Faction: () => number;
                    get_ScorePoints: () => number;
                    GetCommandPointCount: () => number;
                    get_Credits: () => {
                        Base: number;
                        Delta: number;
                        ExtraBonusDelta: number;
                    };
                    GetCreditsCount: () => number;
                    get_ResearchPoints: () => number;
                    get_OverallRank: () => number;
                    get_PackageCount: () => number;
                    get_PlayerResearch: () => {
                        GetResearchItemFomMdbId: (
                            faction: number,
                        ) => {
                            get_NextLevelInfo_Obj: () => {
                                rr: any;
                            };
                        };
                        GetResearchItemListByType: (type: any) => any;
                    };
                };
                get_PlayerSubstitution: () => {
                    getOutgoing: () => {
                        p1: any;
                        n: any;
                    };
                };
                get_Alliance: () => {
                    get_Id: () => number;
                    get_Name: () => string;
                    get_Description: () => string;
                    get_POITiberiumBonus: () => number;
                    get_POIPowerBonus: () => number;
                    get_POICrystalBonus: () => number;
                    get_POIDefenseBonus: () => number;
                    get_POIAirBonus: () => number;
                    get_POIInfantryBonus: () => number;
                    get_POIVehicleBonus: () => number;
                    get_Rank: () => number;
                    get_AverageScore: () => number;
                    get_TotalScore: () => number;
                    get_Relationships: () => {
                        OtherAllianceId: number;
                        OtherAllianceName: string;
                        Relationship: string;
                        IsConfirmed: boolean;
                    }[];
                    get_MemberData: () => {
                        c: number;
                        d: {
                            [id: number]: {
                                ActiveState: number;
                                Bases: number;
                                Faction: number;
                                HasControlHubCode: boolean;
                                Id: number;
                                JoinStep: number;
                                LastSeen: number;
                                Level: number;
                                Name: string;
                                OnlineState: number;
                                Points: number;
                                Rank: number;
                                Role: number;
                                RoleName: string;
                                VeteranPointContribution: number;
                            };
                        };
                    };
                    get_FirstLeaders: () => {};
                };
                get_Inventory: () => {
                    get_PlayerFunds: () => number;
                };
                get_Server: () => {
                    get_WorldId: () => number;
                    get_Name: () => string;
                };
                get_Time: () => {
                    get_StepsPerHour: () => number;
                };
                get_Chat: () => any;
            };
        };
        PlayerResearchItem: {
            EResearchErrors: {
                EFullyUpgraded: 4;
                EMissingRequirements: 2;
                ENoUpgradeAvailable: 5;
                ENone: 0;
                ENotResearched: 1;
                EPlayerLvlToLow: 3;
            };
        };
    };
    /** * * * * * * * * * * * * * * * * * * Typing ClientLib.Vis * * * * * * * * * * * * * * * * * * * * * */
    Vis: {
        Region: {
            RegionCity: {
                ERegionCityType: {
                    Own: number;
                    Alliance: number;
                    Enemy: number;
                };
            };
        };
        VisMain: {
            GetInstance: () => {
                get_Region: () => {
                    GetObjectFromPosition: (x: number, y: number) => any;
                    get_GridWidth: () => number;
                    get_GridHeight: () => number;
                    get_ZoomFactor: () => number;
                };
                CenterGridPosition: (x: number, y: number) => void;
                Update: () => void;
                ViewUpdate: () => void;
                get_SelectedObject: () => any;
                ScreenPosFromWorldPosX: (x: number) => number;
                ScreenPosFromWorldPosY: (y: number) => number;
            };
            FormatTimespan: (seconds: number) => Array<any>;
        };
        VisObject: {
            get_Id: () => number;
            get_RawX: () => number;
            get_RawY: () => number;
            get_VisObjectType: () => any;
            EObjectType: {
                UnknownType: 0;
                CityBuildingType: 1;
                CityResourceFieldType: 2;
                CityWallType: 3;
                RegionCityType: 4;
                RegionSuperWeaponType: 5;
                RegionTerrainType: 6;
                BattlegroundUnit: 7;
                ArmyUnitType: 8;
                ArmyDismissArea: 9;
                DefenseUnitType: 10;
                DefenseTerrainFieldType: 11;
                RegionMoveTarget: 12;
                RegionFreeSlotType: 13;
                RegionNPCBase: 14;
                RegionNPCCamp: 15;
                RegionPointOfInterest: 16;
                RegionRuin: 17;
                RegionGhostCity: 18;
                RegionNewPlayerSpot: 19;
                DefenseTerrainFieldAdditionalSlosType: 20;
                DefenseOffScreenUnit: 21;
                WorldObject: 24;
                WorldMapMarker: 25;
                WorldSatelliteCrashMarker: 26;
                WorldHubCenterMarker: 27;
                WorldHubControlMarker: 28;
                RegionHubServer: 29;
                RegionHubControl: 30;
                RegionHubCenter: 31;
                RegionAllianceMarker: 32;
                WorldCityOwn: 33;
                WorldAllianceMarker: 34;
                WorldPOI: 35;
                WorldCityNotOwn: 36;
            };
        };
    };
    /** * * * * * * * * * * * * * * * * * * Typing ClientLib.Net * * * * * * * * * * * * * * * * * * * * * */
    Net: {
        CommunicationManager: {
            GetInstance: () => {
                UserAction: () => void;
                SendSimpleCommand: (name: string, data: any, a: any, b: any) => void;
            };
        };
        CommandResult: any;
    };
};

type City = {
    get_Id: () => number;
    get_Name: () => string;
    get_OwnerId: () => number;
    get_PosX: () => number;
    get_PosY: () => number;
    GetResourceType: (x: number, y: number) => any;
    get_CityBuildingsData: () => {
        GetUniqueBuildingByTechName: (
            tech: any,
        ) => {
            get_CurrentLevel: () => number;
        };
    };
    get_UnitGameData_Obj: () => any;
    get_SupportData: () => {
        get_Type: () => number;
        get_Level: () => number;
    };
    GetResourceMaxStorage: (type: any) => number;
    get_CommandCenterLevel: () => number;
    get_ConstructionYardLevel: () => number;
    get_LvlBase: () => number;
    get_LvlDefense: () => number;
    get_LvlOffense: () => number;
    get_CityCreditsProduction: () => number;
    GetResourceGrowPerHour: (type: any, a: boolean, b: boolean) => number;
    GetResourceBonusGrowPerHour: (type: any, a: boolean, b: boolean) => number;
    GetResourceCount: (type: any) => number;
    get_CityUnitsData: () => {
        GetRepairTimeFromEUnitGroup: (type: any, a: boolean) => number;
    };
};

type ChatChannel = '@A' | 'global' | '@O' | 'privatein' | 'privateout';
type ChatMessage = {
    c: ChatChannel;
    im: boolean;
    m: string;
    s: string;
};

type RankingInfo = {
    a: {
        a: number;
        an: string;
    }[];
}
type AllianceInfo = {
    i: number;  // Alliance ID
    a: string;  // Alliance abbreviation
    n: string;  // Alliance name
    m: PlayerInfo[]; // Alliance members
    nb: number; // Alliance base count
}
type PlayerInfo = {
    i: number; // Player ID
    an: string; // Alliance Name
    n: string; // Player Name
    p: number;
    c: CityInfo[];
}
type CityInfo = {
    a: number; // Alliance ID
    an: string; // Alliance name
    f: number; // Faction (1=gdi  2=nod)
    g: boolean; // Ghost status
    i: number; // City ID
    n: string; // City name
    p: number; // Player ID
    pn: string; // Player name
    po: number; // City score
    w: boolean;
    x: number;
    y: number;
}



type AllianceItem = {
    id: number;
    name: string;
};
type PlayerItem = PlayerInfo & {
    isFetched: boolean;
};
type BaseItem = CityInfo & {
    isFetched: boolean;
    isMain: boolean;
    marker: any;
};
type ClassMembers = {
    favorites: AllianceItem[];
    listAlliances: AllianceItem[];
    selectedAlliance: AllianceInfo;
    players: { [id: string]: BaseItem };
    bases: { [id: string]: BaseItem };
};
