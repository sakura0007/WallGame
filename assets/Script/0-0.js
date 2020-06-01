cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {

    },

    start() {
        cc.director.preloadScene("Scene/1-0");
        this.tryone = true;
    },

    Start() {
        if (this.tryone) {
            this.tryone = false;
            //音效
            cc.find('Canvas/click3bgm').getComponent(cc.AudioSource).play();
            this.scheduleOnce(function () {
                cc.director.loadScene("Scene/1-0");
            }, 0.5);
        }
    },

    GameOff() {
        //音效
        cc.find('Canvas/click3bgm').getComponent(cc.AudioSource).play();
        cc.game.end();
    }
    // update (dt) {},
});