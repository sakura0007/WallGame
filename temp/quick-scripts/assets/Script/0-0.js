(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/0-0.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e61a7P+reZGva6VQd1Edm9m', '0-0', __filename);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=0-0.js.map
        