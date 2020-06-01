"use strict";
cc._RF.push(module, 'e61a7P+reZGva6VQd1Edm9m', '0-0');
// Script/0-0.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {},
    start: function start() {
        cc.director.preloadScene("Scene/1-0");
        this.tryone = true;
    },
    Start: function Start() {
        if (this.tryone) {
            this.tryone = false;
            //音效
            cc.find('Canvas/click3bgm').getComponent(cc.AudioSource).play();
            this.scheduleOnce(function () {
                cc.director.loadScene("Scene/1-0");
            }, 0.5);
        }
    },
    GameOff: function GameOff() {
        //音效
        cc.find('Canvas/click3bgm').getComponent(cc.AudioSource).play();
        cc.game.end();
    }
    // update (dt) {},

});

cc._RF.pop();