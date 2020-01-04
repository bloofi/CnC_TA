"use strict";
// ==UserScript==
// @version	    2020.01.03
// @name        CnCTA Chat Translate
// @downloadURL https://github.com/bloofi/CnC_TA/raw/master/CnCTA-Chat-Translate.user.js
// @updateURL   https://github.com/bloofi/CnC_TA/raw/master/CnCTA-Chat-Translate.user.js
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include     http*://cncapp*.alliances.commandandconquer.com/*/index.aspx*
// @autohor     bloofi (https://github.com/bloofi)
// ==/UserScript==
(function () {
    const script = () => {
        const scriptName = 'CnCTA Chat Translate';
        const config = {
            target: 'en',
            excludes: [],
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
            }
            catch (e) { }
            const chatInput = qx.core.Init.getApplication()
                .getChat()
                .getChatWidget()
                .getEditable()
                .getContentElement()
                .getDomElement();
            chatInput.addEventListener('keydown', a => {
                if (a.key === 'Enter') {
                    const regCmd = /^\/(tl|il|el) ([a-z]{2})$/;
                    if (regCmd.test(chatInput.value)) {
                        const r = regCmd.exec(chatInput.value);
                        switch (r[1]) {
                            case 'tl':
                                config.target = r[2] || 'en';
                                localStorage.setItem('CnCTA-Chat-Translate', JSON.stringify(config));
                                showMessage(channels.all, 'Translate', 'Target language changed to : ' + config.target);
                                break;
                            case 'el':
                                config.excludes.push(r[2]);
                                config.excludes = config.excludes.reduce((p, c) => (p.includes(c) ? p : p.concat(c)), []);
                                localStorage.setItem('CnCTA-Chat-Translate', JSON.stringify(config));
                                showMessage(channels.all, 'Translate', 'Languages not translated : ' + config.excludes.join(', '));
                                break;
                            case 'il':
                                config.excludes = config.excludes.filter(l => l !== r[2]);
                                localStorage.setItem('CnCTA-Chat-Translate', JSON.stringify(config));
                                showMessage(channels.all, 'Translate', 'Languages not translated : ' + config.excludes.join(', '));
                                break;
                            default:
                                break;
                        }
                        chatInput.value = "";
                        chatInput.focus();
                        return false;
                    }
                }
            });
            phe.cnc.Util.attachNetEvent(ClientLib.Data.MainData.GetInstance().get_Chat(), 'NewMessage', ClientLib.Data.ChatMessage, this, (m) => {
                // console.log(scriptName, 'Message', m);
                if (m.c === '@A' && !m.c.startsWith('http')) {
                    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${config.target}&dt=t&q=${encodeURI(m.m)}`;
                    fetch(url, { method: 'POST' })
                        .then(function (response) {
                        return response.json();
                    })
                        .then(function (res) {
                        console.log(scriptName, 'REPONSE', res);
                        if (res && res.length > 3 && config.target !== res[2] && !config.excludes.includes(res[2])) {
                            showMessage(channels[m.c], m.s, res[0][0][0]);
                        }
                    })
                        .catch(err => {
                        console.log('ERROR', err);
                        showMessage(channels[m.c], 'Translate', 'Unable to translate message from ' + m.s, 'cyan', 'red');
                    });
                }
            });
            console.log(scriptName, ' > Chat listener attached');
        };
        function showMessage(channel, player, msg, pColor = 'cyan', mColor = 'white') {
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
