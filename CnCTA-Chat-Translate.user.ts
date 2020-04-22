// ==UserScript==
// @version	    2020.01.05
// @name        CnCTA Chat Translate
// @downloadURL https://github.com/bloofi/CnC_TA/raw/master/CnCTA-Chat-Translate.user.js
// @updateURL   https://github.com/bloofi/CnC_TA/raw/master/CnCTA-Chat-Translate.user.js
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include     http*://cncapp*.alliances.commandandconquer.com/*/index.aspx*
// @author      bloofi (https://github.com/bloofi)
// ==/UserScript==

type ApiRequest = {
    key: string;
    lang: string;
    text: string;
};

type ApiResponse = {
    code: number;
    lang: string;
    text: string[];
};

(function() {
    const script = () => {
        const scriptName = 'CnCTA Chat Translate - 2020.01.05';
        const translateUrl = 'https://translate.yandex.net/api/v1.5/tr.json/translate';
        const apiKey = 'trnsl.1.1.20200105T163924Z.af0750979fe26e6b.b3ad0a3ea716774311fc612441d8d8238e565082';
        const config = {
            target: 'en',
            excludes: [],
            active: true,
        };

        const init = () => {
            const channels = {
                '@A': webfrontend.gui.chat.ChatWidget.channel.alliance,
                global: webfrontend.gui.chat.ChatWidget.channel.global,
                '@O': webfrontend.gui.chat.ChatWidget.channel.officers,
                privatein: webfrontend.gui.chat.ChatWidget.channel.whisper,
                privateout: webfrontend.gui.chat.ChatWidget.channel.whisper,
                all: webfrontend.gui.chat.ChatWidget.channel.allflags,
            };

            try {
                const sto = JSON.parse(localStorage.getItem('CnCTA-Chat-Translate') || '{}');
                config.target = sto.target || 'en';
                config.excludes = sto.excludes || [];
                config.active = typeof sto.active !== 'undefined' ? sto.active : true;
            } catch (e) {}

            const chatInput = qx.core.Init.getApplication()
                .getChat()
                .getChatWidget()
                .getEditable()
                .getContentElement()
                .getDomElement();
            chatInput.addEventListener('keydown', a => {
                if (a.key === 'Enter') {
                    const regCmd = /^\/(tl|il|el|tt|translate) ?([a-z]{0,2})$/;
                    if (regCmd.test(chatInput.value)) {
                        const r = regCmd.exec(chatInput.value);
                        switch (r[1]) {
                            case 'translate':
                                const msg = [
                                    scriptName,
                                    'Translating is : ' + (config.active ? '<font color="#adff2f">ACTIVE</font>' : '<font color="red">OFF</font>'),
                                    'Translating to language  : ' + config.target,
                                    'Languages not translated : ' + config.excludes.join(', '),
                                    'Powered by <a target="_blank" href="http://translate.yandex.com"><font color="white">Yandex.Translate</font></a>'
                                ];
                                showMessage(channels.all, 'Translate', msg.join('<br>'));
                                break;
                            case 'tt':
                                config.active = !config.active;
                                localStorage.setItem('CnCTA-Chat-Translate', JSON.stringify(config));
                                showMessage(
                                    channels.all,
                                    'Translate',
                                    'Translating is : ' + (config.active ? '<font color="#adff2f">ACTIVE</font>' : '<font color="red">OFF</font>'),
                                );
                                break;
                            case 'tl':
                                if (r.length > 2) {
                                    config.target = r[2] || 'en';
                                    localStorage.setItem('CnCTA-Chat-Translate', JSON.stringify(config));
                                    showMessage(channels.all, 'Translate', 'Target language changed to : ' + config.target);
                                } else {
                                    showMessage(channels.all, 'Translate', 'You must provide a target language, for example : <u>/tl en</u>', 'cyan', 'red');
                                }
                                break;
                            case 'el':
                                if (r.length > 2) {
                                    config.excludes.push(r[2]);
                                    config.excludes = config.excludes.reduce((p, c) => (p.includes(c) ? p : p.concat(c)), []);
                                    localStorage.setItem('CnCTA-Chat-Translate', JSON.stringify(config));
                                    showMessage(channels.all, 'Translate', 'Languages not translated : ' + config.excludes.join(', '));
                                } else {
                                    showMessage(
                                        channels.all,
                                        'Translate',
                                        'You must provide a language to exclude, for example : <u>/el en</u>',
                                        'cyan',
                                        'red',
                                    );
                                }

                                break;
                            case 'il':
                                if (r.length > 2) {
                                    config.excludes = config.excludes.filter(l => l !== r[2]);
                                    localStorage.setItem('CnCTA-Chat-Translate', JSON.stringify(config));
                                    showMessage(channels.all, 'Translate', 'Languages not translated : ' + config.excludes.join(', '));
                                } else {
                                    showMessage(
                                        channels.all,
                                        'Translate',
                                        'You must provide a language to include, for example : <u>/il en</u>',
                                        'cyan',
                                        'red',
                                    );
                                }
                                break;
                            default:
                                break;
                        }
                        chatInput.value = '';
                        chatInput.focus();
                        return false;
                    }
                }
            });

            phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Chat(), 'NewMessage', ClientLib.Data.ChatMessage, this, (m: ChatMessage) => {
                if (config.active && ['@A', '@O'].includes(m.c) && !m.c.startsWith('http')) {
                    const queryParams: ApiRequest = {
                        key: apiKey,
                        lang: config.target,
                        text: encodeURI(m.m),
                    };
                    const url = `${translateUrl}?${Object.keys(queryParams)
                        .map(k => `${k}=${queryParams[k]}`)
                        .join('&')}`;

                    fetch(url, { method: 'GET' })
                        .then(function(response) {
                            return response.json();
                        })
                        .then(function(res: ApiResponse) {
                            switch (res.code) {
                                case 200:
                                    const langs = res.lang.split('-');
                                    if (langs[0] !== langs[1] && !config.excludes.includes(langs[0])) {
                                        showMessage(channels[m.c], `${m.s} (${langs[0]} -> ${langs[1]})`, res.text.join(''));
                                    }
                                    break;
                                case 401:
                                    showMessage(channels[m.c], 'Translate', 'Error from Yandex : Invalid API Key', 'cyan', 'red');
                                    break;
                                case 402:
                                    showMessage(channels[m.c], 'Translate', 'Error from Yandex : Blocked API Key', 'cyan', 'red');
                                    break;
                                case 404:
                                    showMessage(
                                        channels[m.c],
                                        'Translate',
                                        'Error from Yandex : Exceeded the daily limit on the amount of translated text',
                                        'cyan',
                                        'red',
                                    );
                                    break;
                                case 413:
                                    showMessage(channels[m.c], 'Translate', 'Error from Yandex : Exceeded the maximum text size', 'cyan', 'red');
                                    break;
                                case 422:
                                    showMessage(channels[m.c], 'Translate', 'The text cannot be translated', 'cyan', 'red');
                                    break;
                                case 501:
                                    showMessage(channels[m.c], 'Translate', 'The specified translation direction is not supported', 'cyan', 'red');
                                    break;
                                default:
                                    showMessage(channels[m.c], 'Translate', 'Unkown return code : ' + res.code, 'cyan', 'red');
                                    break;
                            }
                        })
                        .catch(err => {
                            console.log(scriptName, err);
                            showMessage(channels[m.c], 'Translate', 'Unable to translate message from ' + m.s, 'cyan', 'red');
                        });
                }
            });
            console.log(scriptName, ' > Chat listener attached');
        };

        function showMessage(channel: any, player: string, msg: string, pColor: string = 'cyan', mColor: string = 'white') {
            const s = `<font color="${pColor}">${player} : </font><font color="${mColor}"><i>${msg}</i></font>`;
            qx.core.Init.getApplication()
                .getChat()
                .getChatWidget()
                .showMessage(s, webfrontend.gui.chat.ChatWidget.sender.system, channel);
        }

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
