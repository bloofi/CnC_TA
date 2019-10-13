// ==UserScript==
// @version	    2019.10.13
// @name        CnCLV Link Button
// @icon        https://spy-cnc.fr/CNC/bi/favicon-cnclv.ico
// @description The same as the classic Cncopt script, but this one adds an additionnal button to CnCLV
// @downloadURL https://raw.githubusercontent.com/bloofi/CnC_TA/master/CnCLV-Link-Button.user.js
// @updateURL   https://raw.githubusercontent.com/bloofi/CnC_TA/master/CnCLV-Link-Button.user.js
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include     http*://cncapp*.alliances.commandandconquer.com/*/index.aspx*
// @include	    http*://cncopt.com/*
// @grant       GM_log
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @grant       GM_updatingEnabled
// @grant       unsafeWindow
// @contributor PythEch (http://userscripts-mirror.org/users/220246)
// @contributor jerbri (http://userscripts-mirror.org/users/507954)
// @contributor leo7044 (https://github.com/leo7044)
// @contributor bloofi (https://github.com/bloofi)
// ==/UserScript==
/*

2019.09.01: bloofi  Added link to make it generate links to CnCLV app
2018-06-05: leo7044 fixed it for new server-links
2016-08-21: leo7044 fixed it for bases level 50+
2016-05-17: leo7044 fixed it for Infected
2013-03-03: Special thanks to jerbri for fixing this up so it worked again!
2012-11-25: Special thanks to PythEch for fixing this up so it worked again!

*/
var scity = null;
var tcity = null;
var tbase = null;
try {
    unsafeWindow.__cncopt_version = '2019.10.13.1';
    (function() {
        var cncopt_main = function() {
            var defense_unit_map = {
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

                /* Forgotten Defense Units 50+ */
                FOR_Fortress_DEF_Sniper: 'n',
                FOR_Fortress_DEF_Inf_VS_Inf: 'o',
                FOR_Fortress_DEF_Veh_VS_Air: 'u',
                FOR_Fortress_DEF_Turret_VS_Inf: 'm',
                FOR_Fortress_DEF_Turret_VS_Veh: 'v',
                FOR_Fortress_DEF_Turret_VS_Air: 'f',
                FOR_Fortress_DEF_Turret_VS_Inf_ranged: 'a',
                FOR_Fortress_DEF_Turret_VS_Veh_ranged: 'd',
                FOR_Fortress_DEF_Turret_VS_Air_ranged: 'e',
                FOR_Fortress_DEF_Mammoth: 'y',

                /* Forgotten Infected Defense Units */
                FOR_GDI_Wall: 'w',
                FOR_GDI_Cannon: 'c',
                'FOR_GDI_Antitank Barrier': 't',
                FOR_GDI_Barbwire: 'b',
                FOR_GDI_Turret: 'm',
                FOR_GDI_Flak: 'f',
                'FOR_GDI_Art Inf': 'r',
                'FOR_GDI_Art Air': 'e',
                'FOR_GDI_Art Tank': 'a',
                'FOR_GDI_Def_APC Guardian': 'g',
                'FOR_GDI_Def_Missile Squad': 'q',
                FOR_GDI_Def_Pitbull: 'p',
                FOR_GDI_Def_Predator: 'd',
                FOR_GDI_Def_Sniper: 's',
                'FOR_GDI_Def_Zone Trooper': 'z',
                'FOR_NOD_Def_Antitank Barrier': 't',
                'FOR_NOD_Def_Art Air': 'e',
                'FOR_NOD_Def_Art Inf': 'r',
                'FOR_NOD_Def_Art Tank': 'a',
                'FOR_NOD_Def_Attack Bike': 'p',
                FOR_NOD_Def_Barbwire: 'b',
                'FOR_NOD_Def_Black Hand': 'z',
                FOR_NOD_Def_Cannon: 'c',
                FOR_NOD_Def_Confessor: 's',
                FOR_NOD_Def_Flak: 'f',
                'FOR_NOD_Def_MG Nest': 'm',
                'FOR_NOD_Def_Militant Rocket Soldiers': 'q',
                FOR_NOD_Def_Reckoner: 'g',
                'FOR_NOD_Def_Scorpion Tank': 'd',
                FOR_NOD_Def_Wall: 'w',
                '': '',
            };

            var offense_unit_map = {
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
            };

            function findTechLayout(city) {
                for (var k in city) {
                    //console.log(typeof(city[k]), "1.city[", k, "]", city[k])
                    if (typeof city[k] == 'object' && city[k] && 0 in city[k] && 8 in city[k]) {
                        if (typeof city[k][0] == 'object' && city[k][0] && city[k][0] && 0 in city[k][0] && 15 in city[k][0]) {
                            if (typeof city[k][0][0] == 'object' && city[k][0][0] && 'BuildingIndex' in city[k][0][0]) {
                                return city[k];
                            }
                        }
                    }
                }
                return null;
            }

            function findBuildings(city) {
                var cityBuildings = city.get_CityBuildingsData();
                for (var k in cityBuildings) {
                    if (PerforceChangelist >= 376877) {
                        if (
                            typeof cityBuildings[k] === 'object' &&
                            cityBuildings[k] &&
                            'd' in cityBuildings[k] &&
                            'c' in cityBuildings[k] &&
                            cityBuildings[k].c > 0
                        ) {
                            return cityBuildings[k].d;
                        }
                    } else {
                        if (typeof cityBuildings[k] === 'object' && cityBuildings[k] && 'l' in cityBuildings[k]) {
                            return cityBuildings[k].l;
                        }
                    }
                }
            }

            function isOffenseUnit(unit) {
                return unit.get_UnitGameData_Obj().n in offense_unit_map;
            }

            function isDefenseUnit(unit) {
                return unit.get_UnitGameData_Obj().n in defense_unit_map;
            }

            function getUnitArrays(city) {
                var ret = [];
                for (var k in city) {
                    if (typeof city[k] == 'object' && city[k]) {
                        for (var k2 in city[k]) {
                            if (PerforceChangelist >= 376877) {
                                if (typeof city[k][k2] == 'object' && city[k][k2] && 'd' in city[k][k2]) {
                                    var lst = city[k][k2].d;
                                    if (typeof lst == 'object' && lst) {
                                        for (var i in lst) {
                                            if (typeof lst[i] == 'object' && lst[i] && 'get_CurrentLevel' in lst[i]) {
                                                ret.push(lst);
                                            }
                                        }
                                    }
                                }
                            } else {
                                if (typeof city[k][k2] == 'object' && city[k][k2] && 'l' in city[k][k2]) {
                                    var lst = city[k][k2].l;
                                    if (typeof lst == 'object' && lst) {
                                        for (var i in lst) {
                                            if (typeof lst[i] == 'object' && lst[i] && 'get_CurrentLevel' in lst[i]) {
                                                ret.push(lst);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return ret;
            }

            function getDefenseUnits(city) {
                var arr = getUnitArrays(city);
                for (var i = 0; i < arr.length; ++i) {
                    for (var j in arr[i]) {
                        if (isDefenseUnit(arr[i][j])) {
                            return arr[i];
                        }
                    }
                }
                return [];
            }

            function getOffenseUnits(city) {
                var arr = getUnitArrays(city);
                for (var i = 0; i < arr.length; ++i) {
                    for (var j in arr[i]) {
                        if (isOffenseUnit(arr[i][j])) {
                            return arr[i];
                        }
                    }
                }
                return [];
            }

            function cncopt_create() {
                console.log('CNCOpt Link Button v' + window.__cncopt_version + ' loaded');
                var cncopt = {
                    selected_base: null,
                    keymap: {
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
                        'FOR_EVENT_Construction Yard': 'y',
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
                        //"NOD_Tech Lab": "",
                        //"NOD_Recruitment Hub": "X",
                        //"NOD_Temple of Nod": "X",

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

                        /* Forgotten Defense Units 50+ */
                        FOR_Fortress_DEF_Sniper: 'n',
                        FOR_Fortress_DEF_Inf_VS_Inf: 'o',
                        FOR_Fortress_DEF_Veh_VS_Air: 'u',
                        FOR_Fortress_DEF_Turret_VS_Inf: 'm',
                        FOR_Fortress_DEF_Turret_VS_Veh: 'v',
                        FOR_Fortress_DEF_Turret_VS_Air: 'f',
                        FOR_Fortress_DEF_Turret_VS_Inf_ranged: 'a',
                        FOR_Fortress_DEF_Turret_VS_Veh_ranged: 'd',
                        FOR_Fortress_DEF_Turret_VS_Air_ranged: 'e',
                        FOR_Fortress_DEF_Mammoth: 'y',

                        /* Forgotten Infected Defense Units */
                        FOR_GDI_Wall: 'w',
                        FOR_GDI_Cannon: 'c',
                        'FOR_GDI_Antitank Barrier': 't',
                        FOR_GDI_Barbwire: 'b',
                        FOR_GDI_Turret: 'm',
                        FOR_GDI_Flak: 'f',
                        'FOR_GDI_Art Inf': 'r',
                        'FOR_GDI_Art Air': 'e',
                        'FOR_GDI_Art Tank': 'a',
                        'FOR_GDI_Def_APC Guardian': 'g',
                        'FOR_GDI_Def_Missile Squad': 'q',
                        FOR_GDI_Def_Pitbull: 'p',
                        FOR_GDI_Def_Predator: 'd',
                        FOR_GDI_Def_Sniper: 's',
                        'FOR_GDI_Def_Zone Trooper': 'z',
                        'FOR_NOD_Def_Antitank Barrier': 't',
                        'FOR_NOD_Def_Art Air': 'e',
                        'FOR_NOD_Def_Art Inf': 'r',
                        'FOR_NOD_Def_Art Tank': 'a',
                        'FOR_NOD_Def_Attack Bike': 'p',
                        FOR_NOD_Def_Barbwire: 'b',
                        'FOR_NOD_Def_Black Hand': 'z',
                        FOR_NOD_Def_Cannon: 'c',
                        FOR_NOD_Def_Confessor: 's',
                        FOR_NOD_Def_Flak: 'f',
                        'FOR_NOD_Def_MG Nest': 'm',
                        'FOR_NOD_Def_Militant Rocket Soldiers': 'q',
                        FOR_NOD_Def_Reckoner: 'g',
                        'FOR_NOD_Def_Scorpion Tank': 'd',
                        FOR_NOD_Def_Wall: 'w',

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

                        '<last>': '.',
                    },
                    make_sharelink: function(baseUrl) {
                        try {
                            var selected_base = cncopt.selected_base;
                            var city_id = selected_base.get_Id();
                            var city = ClientLib.Data.MainData.GetInstance()
                                .get_Cities()
                                .GetCity(city_id);
                            var own_city = ClientLib.Data.MainData.GetInstance()
                                .get_Cities()
                                .get_CurrentOwnCity();
                            var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
                            var server = ClientLib.Data.MainData.GetInstance().get_Server();
                            tbase = selected_base;
                            tcity = city;
                            scity = own_city;
                            //console.log("Target City: ", city);
                            //console.log("Own City: ", own_city);
                            var query = '';
                            query += '3|'; /* link version */
                            switch (city.get_CityFaction()) {
                                case 1:
                                    /* GDI */
                                    query += 'G|';
                                    break;
                                case 2:
                                    /* NOD */
                                    query += 'N|';
                                    break;
                                case 3:
                                /* FOR faction - unseen, but in GAMEDATA */
                                case 4:
                                /* Forgotten Bases */
                                case 5:
                                /* Forgotten Camps */
                                case 6:
                                    /* Forgotten Outposts */
                                    query += 'F|';
                                    break;
                                default:
                                    console.log('cncopt: Unknown faction: ' + city.get_CityFaction());
                                    query += 'E|';
                                    break;
                            }
                            switch (city.get_CityFaction()) {
                                case 1:
                                    /* GDI */
                                    query += 'G|';
                                    break;
                                case 2:
                                    /* NOD */
                                    query += 'N|';
                                    break;
                                case 3:
                                /* FOR faction - unseen, but in GAMEDATA */
                                case 4:
                                /* Forgotten Bases */
                                case 5:
                                /* Forgotten Camps */
                                case 6:
                                    /* Forgotten Outposts */
                                    if (own_city.get_CityFaction() == 1) {
                                        query += 'G|';
                                    } else if (own_city.get_CityFaction() == 2) {
                                        query += 'N|';
                                    }
                                    break;
                                default:
                                    console.log('cncopt: Unknown faction: ' + own_city.get_CityFaction());
                                    query += 'E|';
                                    break;
                            }
                            query += city.get_Name() + '|';
                            defense_units = [];
                            for (var i = 0; i < 20; ++i) {
                                var col = [];
                                for (var j = 0; j < 9; ++j) {
                                    col.push(null);
                                }
                                defense_units.push(col);
                            }
                            var defense_unit_list = getDefenseUnits(city);
                            if (PerforceChangelist >= 376877) {
                                for (var i in defense_unit_list) {
                                    var unit = defense_unit_list[i];
                                    defense_units[unit.get_CoordX()][unit.get_CoordY() + 8] = unit;
                                }
                            } else {
                                for (var i = 0; i < defense_unit_list.length; ++i) {
                                    var unit = defense_unit_list[i];
                                    defense_units[unit.get_CoordX()][unit.get_CoordY() + 8] = unit;
                                }
                            }

                            offense_units = [];
                            for (var i = 0; i < 20; ++i) {
                                var col = [];
                                for (var j = 0; j < 9; ++j) {
                                    col.push(null);
                                }
                                offense_units.push(col);
                            }

                            if (city.get_CityFaction() == 1 || city.get_CityFaction() == 2) {
                                var offense_unit_list = getOffenseUnits(city);
                            } else {
                                var offense_unit_list = getOffenseUnits(own_city);
                            }
                            if (PerforceChangelist >= 376877) {
                                for (var i in offense_unit_list) {
                                    var unit = offense_unit_list[i];
                                    offense_units[unit.get_CoordX()][unit.get_CoordY() + 16] = unit;
                                }
                            } else {
                                for (var i = 0; i < offense_unit_list.length; ++i) {
                                    var unit = offense_unit_list[i];
                                    offense_units[unit.get_CoordX()][unit.get_CoordY() + 16] = unit;
                                }
                            }

                            var techLayout = findTechLayout(city);
                            var buildings = findBuildings(city);
                            for (var i = 0; i < 20; ++i) {
                                row = [];
                                for (var j = 0; j < 9; ++j) {
                                    var spot = i > 16 ? null : techLayout[j][i];
                                    var level = 0;
                                    var building = null;
                                    if (spot && spot.BuildingIndex >= 0) {
                                        building = buildings[spot.BuildingIndex];
                                        level = building.get_CurrentLevel();
                                    }
                                    var defense_unit = defense_units[j][i];
                                    if (defense_unit) {
                                        level = defense_unit.get_CurrentLevel();
                                    }
                                    var offense_unit = offense_units[j][i];
                                    if (offense_unit) {
                                        level = offense_unit.get_CurrentLevel();
                                    }
                                    if (level > 1) {
                                        query += level;
                                    }

                                    switch (i > 16 ? 0 : city.GetResourceType(j, i)) {
                                        case 0:
                                            if (building) {
                                                var techId = building.get_MdbBuildingId();
                                                if (GAMEDATA.Tech[techId].n in cncopt.keymap) {
                                                    query += cncopt.keymap[GAMEDATA.Tech[techId].n];
                                                } else {
                                                    console.log('cncopt [5]: Unhandled building: ' + techId, building);
                                                    query += '.';
                                                }
                                            } else if (defense_unit) {
                                                if (defense_unit.get_UnitGameData_Obj().n in cncopt.keymap) {
                                                    query += cncopt.keymap[defense_unit.get_UnitGameData_Obj().n];
                                                } else {
                                                    console.log('cncopt [5]: Unhandled unit: ' + defense_unit.get_UnitGameData_Obj().n);
                                                    query += '.';
                                                }
                                            } else if (offense_unit) {
                                                if (offense_unit.get_UnitGameData_Obj().n in cncopt.keymap) {
                                                    query += cncopt.keymap[offense_unit.get_UnitGameData_Obj().n];
                                                } else {
                                                    console.log('cncopt [5]: Unhandled unit: ' + offense_unit.get_UnitGameData_Obj().n);
                                                    query += '.';
                                                }
                                            } else {
                                                query += '.';
                                            }
                                            break;
                                        case 1:
                                            /* Crystal */
                                            if (spot.BuildingIndex < 0) query += 'c';
                                            else query += 'n';
                                            break;
                                        case 2:
                                            /* Tiberium */
                                            if (spot.BuildingIndex < 0) query += 't';
                                            else query += 'h';
                                            break;
                                        case 4:
                                            /* Woods */
                                            query += 'j';
                                            break;
                                        case 5:
                                            /* Scrub */
                                            query += 'h';
                                            break;
                                        case 6:
                                            /* Oil */
                                            query += 'l';
                                            break;
                                        case 7:
                                            /* Swamp */
                                            query += 'k';
                                            break;
                                        default:
                                            console.log('cncopt [4]: Unhandled resource type: ' + city.GetResourceType(j, i));
                                            query += '.';
                                            break;
                                    }
                                }
                            }
                            /* Tack on our alliance bonuses */
                            if (alliance && scity.get_AllianceId() == tcity.get_AllianceId()) {
                                query += '|' + alliance.get_POITiberiumBonus();
                                query += '|' + alliance.get_POICrystalBonus();
                                query += '|' + alliance.get_POIPowerBonus();
                                query += '|' + alliance.get_POIInfantryBonus();
                                query += '|' + alliance.get_POIVehicleBonus();
                                query += '|' + alliance.get_POIAirBonus();
                                query += '|' + alliance.get_POIDefenseBonus();
                            }
                            if (server.get_TechLevelUpgradeFactorBonusAmount() != 1.2) {
                                query += '|newEconomy';
                            }
                            window.server = server;
                            console.log('cncopt: get_TechLevelUpgradeFactorBonusAmount = ', server.get_TechLevelUpgradeFactorBonusAmount());

                            //console.log(query);
                            window.open(baseUrl + query, '_blank');
                        } catch (e) {
                            console.log('cncopt [1]: ', e);
                        }
                    },
                };
                if (!webfrontend.gui.region.RegionCityMenu.prototype.__cncopt_real_showMenu) {
                    webfrontend.gui.region.RegionCityMenu.prototype.__cncopt_real_showMenu = webfrontend.gui.region.RegionCityMenu.prototype.showMenu;
                }

                var check_ct = 0;
                var check_timer = null;
                var button_enabled = 123456;
                /* Wrap showMenu so we can inject our Sharelink at the end of menus and
                 * sync Base object to our cncopt.selected_base variable  */
                webfrontend.gui.region.RegionCityMenu.prototype.showMenu = function(selected_base) {
                    try {
                        var self = this;
                        //console.log(selected_base);
                        cncopt.selected_base = selected_base;
                        if (this.__cncopt_initialized != 1) {
                            this.__cncopt_initialized = 1;
                            this.__cncopt_links = [];
                            for (var i in this) {
                                try {
                                    if (this[i] && this[i].basename == 'Composite') {
                                        var link = new qx.ui.form.Button('CNCOpt', 'http://cncopt.com/favicon.ico');
                                        link.addListener('execute', function() {
                                            var bt = qx.core.Init.getApplication();
                                            bt.getBackgroundArea().closeCityInfo();
                                            cncopt.make_sharelink('http://cncopt.com/?map=');
                                        });
                                        this[i].add(link);
                                        this.__cncopt_links.push(link);

                                        var linkBi = new qx.ui.form.Button('CnCLV', 'https://spy-cnc.fr/CNC/bi/favicon-cnclv.ico');
                                        linkBi.addListener('execute', function() {
                                            var bt = qx.core.Init.getApplication();
                                            bt.getBackgroundArea().closeCityInfo();
                                            cncopt.make_sharelink('https://spy-cnc.fr/CNC/bi/cnclv/layout/');
                                        });
                                        this[i].add(linkBi);
                                        this.__cncopt_links.push(linkBi);
                                    }
                                } catch (e) {
                                    console.log('cncopt [2]: ', e);
                                }
                            }
                        }
                        var tf = false;
                        switch (selected_base.get_VisObjectType()) {
                            case ClientLib.Vis.VisObject.EObjectType.RegionCityType:
                                switch (selected_base.get_Type()) {
                                    case ClientLib.Vis.Region.RegionCity.ERegionCityType.Own:
                                        tf = true;
                                        break;
                                    case ClientLib.Vis.Region.RegionCity.ERegionCityType.Alliance:
                                    case ClientLib.Vis.Region.RegionCity.ERegionCityType.Enemy:
                                        tf = true;
                                        break;
                                }
                                break;
                            case ClientLib.Vis.VisObject.EObjectType.RegionGhostCity:
                                tf = false;
                                console.log("cncopt: Ghost City selected.. ignoring because we don't know what to do here");
                                break;
                            case ClientLib.Vis.VisObject.EObjectType.RegionNPCBase:
                                tf = true;
                                break;
                            case ClientLib.Vis.VisObject.EObjectType.RegionNPCCamp:
                                tf = true;
                                break;
                        }

                        var orig_tf = tf;

                        function check_if_button_should_be_enabled() {
                            try {
                                tf = orig_tf;
                                var selected_base = cncopt.selected_base;
                                var still_loading = false;
                                if (check_timer !== null) {
                                    clearTimeout(check_timer);
                                }

                                /* When a city is selected, the data for the city is loaded in the background.. once the
                                 * data arrives, this method is called again with these fields set, but until it does
                                 * we can't actually generate the link.. so this section of the code grays out the button
                                 * until the data is ready, then it'll light up. */
                                if (selected_base && selected_base.get_Id) {
                                    var city_id = selected_base.get_Id();
                                    var city = ClientLib.Data.MainData.GetInstance()
                                        .get_Cities()
                                        .GetCity(city_id);
                                    //if (!city || !city.m_CityUnits || !city.m_CityUnits.m_DefenseUnits) {
                                    //console.log("City", city);
                                    //console.log("get_OwnerId", city.get_OwnerId());
                                    if (!city || city.get_OwnerId() === 0) {
                                        still_loading = true;
                                        tf = false;
                                    }
                                } else {
                                    tf = false;
                                }
                                if (tf != button_enabled) {
                                    button_enabled = tf;
                                    for (var i = 0; i < self.__cncopt_links.length; ++i) {
                                        self.__cncopt_links[i].setEnabled(tf);
                                    }
                                }
                                if (!still_loading) {
                                    check_ct = 0;
                                } else {
                                    if (check_ct > 0) {
                                        check_ct--;
                                        check_timer = setTimeout(check_if_button_should_be_enabled, 100);
                                    } else {
                                        check_timer = null;
                                    }
                                }
                            } catch (e) {
                                console.log('cncopt [3]: ', e);
                                tf = false;
                            }
                        }

                        check_ct = 50;
                        check_if_button_should_be_enabled();
                    } catch (e) {
                        console.log('cncopt [3]: ', e);
                    }
                    this.__cncopt_real_showMenu(selected_base);
                };
            }

            /* Nice load check (ripped from AmpliDude's LoU Tweak script) */
            function cnc_check_if_loaded() {
                try {
                    if (typeof qx != 'undefined') {
                        a = qx.core.Init.getApplication(); // application
                        if (a) {
                            cncopt_create();
                        } else {
                            window.setTimeout(cnc_check_if_loaded, 1000);
                        }
                    } else {
                        window.setTimeout(cnc_check_if_loaded, 1000);
                    }
                } catch (e) {
                    if (typeof console != 'undefined') console.log(e);
                    else if (window.opera) opera.postError(e);
                    else GM_log(e);
                }
            }
            if (/commandandconquer\.com/i.test(document.domain)) window.setTimeout(cnc_check_if_loaded, 1000);
        };

        // injecting because we can't seem to hook into the game interface via unsafeWindow
        //   (Ripped from AmpliDude's LoU Tweak script)
        txt = cncopt_main.toString();
        const script_block = document.createElement('script');
        script_block.innerHTML = '(' + txt + ')();';
        script_block.type = 'text/javascript';
        if (/commandandconquer\.com/i.test(document.domain)) document.getElementsByTagName('head')[0].appendChild(script_block);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Inject a link in cncopt page to redirect to the CnCLV app
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const cncoptRedirect = () => {
            const injectButton = () => {
                const link = document.createElement('a');
                link.setAttribute('style', 'display: block; color: #bbffbb; font-size: 1.3em');
                link.innerHTML = '<img alt="CnCLV" src="https://spy-cnc.fr/CNC/bi/favicon-cnclv.ico"/> View this layout on CnCLV';
                link.href = 'https://spy-cnc.fr/CNC/bi/cnclv/layout/' + flashvars.map;
                const object = document.querySelector('body > div > div > table > tbody > tr > td:first-child > object');
                document.querySelector('body > div > div > table > tbody > tr > td:first-child').insertBefore(link, object);
            };
            const checkLoaded = () => {
                if (typeof window.flashvars !== 'undefined' && !!window.flashvars) {
                    injectButton();
                } else {
                    window.setTimeout(checkLoaded, 1000);
                }
            };
            window.setTimeout(checkLoaded, 1000);
        };
        const scriptBlock2 = document.createElement('script');
        scriptBlock2.innerHTML = '(' + cncoptRedirect.toString() + ')();';
        scriptBlock2.type = 'text/javascript';
        if (/cncopt\.com/i.test(document.domain)) document.getElementsByTagName('head')[0].appendChild(scriptBlock2);
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // End of CnCLV Injection
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    })();
} catch (e) {
    GM_log(e);
}
