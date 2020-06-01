"use strict";
cc._RF.push(module, 'b511924yAVJk7VfqVCiLxuy', '1-0');
// Script/1-0.js

"use strict";

cc.Class({
    extends: cc.Component,
    properties: {
        Space: {
            default: 0,
            displayName: "空格子数量"
        },
        lattice: {
            default: null,
            type: cc.Node,
            displayName: "地图格子"
        },
        ghost: {
            default: null,
            type: cc.Node,
            displayName: "幽灵"
        },
        Setup_Win: {
            default: null,
            type: cc.Node,
            displayName: "设置窗口"
        },
        AI_Lv: {
            default: 0,
            type: cc.Integer,
            displayName: "AI智能水平",
            tooltip: "上限10，下限0"
        },
        Draw_edges: {
            default: false,
            displayName: "绘制边缘"
        },
        Draw_path: {
            default: false,
            displayName: "绘制路径"
        }
    },
    onLoad: function onLoad() {
        this.Lattice_Arr = [];
        this.Next_Lattice_Arr = [];
        this.BG = cc.find("Canvas/BG");
        this.windowSize = cc.view.getVisibleSize();
        this.Setup_Win.width = this.BG.width * 3 / 5;
        this.Setup_Win.height = this.Setup_Win.width * 0.6;
        this.Setup_Win.y = this.windowSize.height;
        var lattice_width = this.lattice.width;
        var lattice_height = this.lattice.height;
        this.lattice.width = Math.floor(this.BG.width / 9);
        this.lattice.height = Math.floor(lattice_height * (this.BG.width / 9 / lattice_width));
        this.Lattice_Pool = new cc.NodePool();
        var Lattice_Pool_Max = 150; //预制池上限
        for (var t = 0; t < Lattice_Pool_Max; ++t) {
            var i = cc.instantiate(this.lattice);
            this.Lattice_Pool.put(i);
        };
        var Y_distance = this.lattice.height + Math.floor(this.lattice.height / 6);
        var X_distance = Math.floor(Math.cos(2 * Math.PI / 360 * 30) * Y_distance);
        this.X_distance = X_distance;
        this.Y_distance = Y_distance;
        var X_boundary = X_distance * 3 + X_distance / 2;
        var Y_boundary = Y_distance * 5 + Y_distance / 3;
        for (var e = 0, n = 0, c = 0; c < 9; c++) {
            for (var a = 0; a < 7; a++) {
                if (Y_distance * -a + n >= -Y_distance * 6 && Y_distance * a + n <= Y_distance * 6) {
                    var o = this.Lattice_Pool.get();
                    o.parent = cc.find("Canvas/BG/Lattice_BG");
                    o.setPosition(e, Y_distance * a + n);
                    e >= X_boundary || e <= -X_boundary || Y_distance * a + n > Y_boundary || Y_distance * a + n < -Y_boundary ? this.Lattice_Arr.push([e, Y_distance * a + n, 0, 1, o]) : this.Lattice_Arr.push([e, Y_distance * a + n, 0, 0, o]);
                }
                if (a > 0) {
                    var r = this.Lattice_Pool.get();
                    r.parent = cc.find("Canvas/BG/Lattice_BG");
                    r.setPosition(e, Y_distance * -a + n);
                    e >= X_boundary || e <= -X_boundary || Y_distance * -a + n > Y_boundary || Y_distance * -a + n < -Y_boundary ? this.Lattice_Arr.push([e, Y_distance * -a + n, 0, 1, r]) : this.Lattice_Arr.push([e, Y_distance * -a + n, 0, 0, r]);
                }
                if (6 == a) {
                    if (0 == e) {
                        n = 0 == n ? Y_distance / 2 : 0;
                        e += X_distance;
                        break;
                    }
                    if (e > 1) {
                        e = 0 - e;
                        break;
                    }
                    if (e < -1) {
                        n = 0 == n ? Y_distance / 2 : 0;
                        e = 0 - e + X_distance;
                        break;
                    }
                }
            }
        };
        this.Player_Action = false;
        this.grade = cc.find("Canvas/Grade/label").getComponent(cc.Label);
        this.time = cc.find("Canvas/Time").getComponent(cc.Label);
        this.windowSize = cc.view.getVisibleSize();
        this.GamePause = false;
        //cc.find("Canvas/BGM/bgm_main").getComponent(cc.AudioSource).volume = .3;
    },
    start: function start() {
        this.ghost.parent = cc.find("Canvas/BG/Lattice_BG");
        this.ghost.setPosition(0, 0);
        for (var t = 0; t < this.Space; t++) {
            var i = this.Lattice_Arr.length,
                e = Math.floor(Math.random() * i);
            if (e > 0) {
                this.Lattice_Farst_Off(this.Lattice_Arr[e][4]);
            } else {
                t--;
            }
        };
        this.Time_start();
        this.Player_start();
        if (this.Draw_edges) {
            this.scheduleOnce(function () {
                for (var _i = 0; _i < this.Lattice_Arr.length; _i++) {
                    if (this.Lattice_Arr[_i][3] == 1 && this.Lattice_Arr[_i][2] == 0) {
                        //cc.log('改变颜色:' + this.Lattice_Arr[i]);
                        this.Lattice_Arr[_i][4].color = new cc.Color(60, 200, 60);
                    }
                }
            }, 0.5);
        }
    },
    Lattice_Farst_Off: function Lattice_Farst_Off(t) {
        for (var i = 0; i < this.Lattice_Arr.length; i++) {
            t.x == this.Lattice_Arr[i][0] && t.y == this.Lattice_Arr[i][1] && 0 == this.Lattice_Arr[i][2] && (this.Lattice_Arr[i][2] = 1);
        }t.opacity = 255;
        var e = cc.fadeTo(0.5, 0);
        t.runAction(e);
        this.scheduleOnce(function () {
            t.destroy();
        }, 0.5);
    },
    Time_start: function Time_start() {
        var t = this,
            i = 0,
            e = 0;
        t.schedule(function () {
            if (!t.GamePause) {
                if (60 == (i += 1)) {
                    i = 0;
                    e += 1;
                }
                60 == e && (e = 0);
                t.time.string = e < 10 ? i < 10 ? "时间: 0" + e + ":0" + i : "时间: 0" + e + ":" + i : e < 10 ? "时间: " + e + ":0" + i : "时间: " + e + ":" + i;
            }
        }, 1, cc.macro.REPEAT_FOREVER, 0);
    },
    Player_start: function Player_start() {
        this.Player_Action = !0;
    },
    Lattice_Off: function Lattice_Off(t, i) {
        var e = this,
            n = t.target,
            c = n.getComponent(cc.Button);
        cc.find("Canvas/BGM/click2bgm").getComponent(cc.AudioSource).play();
        if (e.Player_Action) if (n.x == e.ghost.x && n.y == e.ghost.y) e.Player_Action = !0;else {
            e.Player_Action = !1;
            var a = parseInt(e.grade.string);
            e.grade.string = a + 1;
            c.destroy();
            for (var o = 0; o < this.Lattice_Arr.length; o++) {
                n.x == this.Lattice_Arr[o][0] && n.y == this.Lattice_Arr[o][1] && 0 == this.Lattice_Arr[o][2] && (this.Lattice_Arr[o][2] = 1);
            }n.opacity = 255;
            var r = cc.fadeTo(0.5, 0);
            n.runAction(r);
            e.scheduleOnce(function () {
                n.destroy();
                e.Ghost_start();
            }, 0.5);
        }
    },
    Ghost_start: function Ghost_start() {
        var _this = this;

        if (this.Next_Lattice_Arr.length > 0) {
            var Next_Lattice_X = this.Next_Lattice_Arr[this.Next_Lattice_Arr.length - 1][0];
            var Next_Lattice_Y = this.Next_Lattice_Arr[this.Next_Lattice_Arr.length - 1][1];

            var _loop = function _loop(i) {
                if (Next_Lattice_X == _this.Lattice_Arr[i][0] && Next_Lattice_Y == _this.Lattice_Arr[i][1]) {
                    if (_this.Lattice_Arr[i][2] == 0) {
                        s = cc.moveTo(0.4, cc.v2(Next_Lattice_X, Next_Lattice_Y));

                        _this.Next_Lattice_Arr.splice(_this.Next_Lattice_Arr.length - 1, 1);
                        _this.ghost.runAction(s);
                        _this.scheduleOnce(function () {
                            this.Player_Action = !0;
                            this.ghost.x = Next_Lattice_X;
                            this.ghost.y = Next_Lattice_Y;
                            if (this.Lattice_Arr[i][3] == 1) {
                                this.Game_Lost();
                            }
                        }, 0.5);
                    } else {
                        _this.Next_Lattice_Arr = [];
                        _this.Ghost_start();
                    }
                }
            };

            for (var i = 0; i < this.Lattice_Arr.length; i++) {
                var s;

                _loop(i);
            }
        } else {
            var Now_X = this.ghost.x;
            var Now_Y = this.ghost.y;
            var rationality = Math.floor(Math.random() * 10) + this.AI_Lv;
            if (rationality >= 10) {
                this.Find_way([[this.ghost.x, this.ghost.y]], [[this.ghost.x, this.ghost.y]]);
            } else {
                var Around_Arr = [[Now_X, Now_Y + this.Y_distance], [Now_X + this.X_distance, Now_Y + this.Y_distance / 2], [Now_X + this.X_distance, Now_Y - this.Y_distance / 2], [Now_X, Now_Y - this.Y_distance], [Now_X - this.X_distance, Now_Y - this.Y_distance / 2], [Now_X - this.X_distance, Now_Y + this.Y_distance / 2]];
                var Allow_Move_Arr = [];
                for (var i = 0; i < Around_Arr.length; i++) {
                    for (var _o = 0; _o < this.Lattice_Arr.length; _o++) {
                        if (Around_Arr[i][0] == this.Lattice_Arr[_o][0] && Around_Arr[i][1] == this.Lattice_Arr[_o][1] && this.Lattice_Arr[_o][2] == 0) {
                            Allow_Move_Arr.push(Around_Arr[i]);
                        }
                    }
                };
                if (Allow_Move_Arr.length > 0) {
                    var o = Allow_Move_Arr.length,
                        r = Math.floor(Math.random() * o),
                        s2 = cc.moveTo(0.4, cc.v2(Allow_Move_Arr[r][0], Allow_Move_Arr[r][1]));
                    this.ghost.runAction(s2);
                    this.scheduleOnce(function () {
                        this.Player_Action = !0;
                        this.ghost.x = Allow_Move_Arr[r][0];
                        this.ghost.y = Allow_Move_Arr[r][1];
                        this.Find_way([[this.ghost.x, this.ghost.y]], [[this.ghost.x, this.ghost.y]]);
                        for (var t = 0; t < this.Lattice_Arr.length; t++) {
                            this.ghost.x == this.Lattice_Arr[t][0] && this.ghost.y == this.Lattice_Arr[t][1] && 1 == this.Lattice_Arr[t][3] && this.Game_Lost();
                        }
                    }, 0.5);
                } else this.Game_Win();
            }
        }
    },
    Game_Win: function Game_Win() {
        this.SetupWin(1);
    },
    Game_Lost: function Game_Lost() {
        this.SetupWin(0);
    },
    SetupWin: function SetupWin(t) {
        cc.find("Canvas/BGM/click3bgm").getComponent(cc.AudioSource).play();
        this.Player_Action = !1;
        this.GamePause = !0;
        1 == t && (this.Setup_Win.getChildByName("top").getComponent(cc.Label).string = "成功抓到了幽灵！");
        0 == t && (this.Setup_Win.getChildByName("top").getComponent(cc.Label).string = "幽灵逃跑了！");
        cc.find("Canvas/Setup_Win/GameEnd/Background/Label").getComponent(cc.Label).string = "退出游戏";
        this.Setup_Win.x = 0;
        this.Setup_Win.y = 0;
    },
    SetupWin_Button: function SetupWin_Button(t, i) {
        cc.find("Canvas/BGM/click3bgm").getComponent(cc.AudioSource).play();
        this.Player_Action = !1;
        this.GamePause = !0;
        this.Setup_Win.getChildByName("top").getComponent(cc.Label).string = "暂停游戏";
        cc.find("Canvas/Setup_Win/GameEnd/Background/Label").getComponent(cc.Label).string = "继续游戏";
        this.Setup_Win.x = 0;
        this.Setup_Win.y = 0;
    },
    Again: function Again() {
        cc.find("Canvas/BGM/click3bgm").getComponent(cc.AudioSource).play();
        this.scheduleOnce(function () {
            cc.director.loadScene("Scene/1-0");
        }, 0.5);
    },
    GameEnd: function GameEnd() {
        cc.find("Canvas/BGM/click3bgm").getComponent(cc.AudioSource).play();
        if ("继续游戏" == cc.find("Canvas/Setup_Win/GameEnd/Background/Label").getComponent(cc.Label).string) {
            this.GamePause = !1;
            this.Player_Action = !0;
            this.Setup_Win.y = this.windowSize.height;
            cc.find("Canvas/Setup_Win/GameEnd/Background/Label").getComponent(cc.Label).string = "退出游戏";
        } else cc.game.end();
    },
    Find_way: function Find_way(Start_Arr, Note_Arr) {
        var Next_Start_Arr = [];
        var Next_Note_Arr = Note_Arr;
        var Find_way_Over = false;
        this.Next_Lattice_Arr = [];
        //cc.log('执行数组：' + JSON.stringify(Start_Arr));
        //cc.log('以排除数组：' + JSON.stringify(Note_Arr));
        if (Start_Arr.length > 0) {
            for (var i = 0; i < Start_Arr.length; i++) {
                var Try_Around_Arr = [[Start_Arr[i][0], Start_Arr[i][1] + this.Y_distance], [Start_Arr[i][0] + this.X_distance, Start_Arr[i][1] + this.Y_distance / 2], [Start_Arr[i][0] + this.X_distance, Start_Arr[i][1] - this.Y_distance / 2], [Start_Arr[i][0], Start_Arr[i][1] - this.Y_distance], [Start_Arr[i][0] - this.X_distance, Start_Arr[i][1] - this.Y_distance / 2], [Start_Arr[i][0] - this.X_distance, Start_Arr[i][1] + this.Y_distance / 2]];
                for (var o = 0; o < Try_Around_Arr.length; o++) {
                    for (var q = 0; q < Note_Arr.length; q++) {
                        if (Try_Around_Arr[o][0] == Note_Arr[q][0] && Try_Around_Arr[o][1] == Note_Arr[q][1]) {
                            Try_Around_Arr.splice(o, 1);
                            o--;
                            break;
                        }
                    }
                };
                Next_Note_Arr = Note_Arr.concat(Try_Around_Arr);
                Note_Arr = Next_Note_Arr;
                for (var _o2 = 0; _o2 < Try_Around_Arr.length; _o2++) {
                    for (var _q = 0; _q < this.Lattice_Arr.length; _q++) {
                        if (Try_Around_Arr[_o2][0] == this.Lattice_Arr[_q][0] && Try_Around_Arr[_o2][1] == this.Lattice_Arr[_q][1] && this.Lattice_Arr[_q][2] == 0 && this.Lattice_Arr[_q][3] == 1) {
                            this.Find_way_End([Try_Around_Arr[_o2][0], Try_Around_Arr[_o2][1], Start_Arr[i]]);
                            return;
                        };
                        if (Try_Around_Arr[_o2][0] == this.Lattice_Arr[_q][0] && Try_Around_Arr[_o2][1] == this.Lattice_Arr[_q][1] && this.Lattice_Arr[_q][2] == 1) {
                            Try_Around_Arr.splice(_o2, 1);
                            _o2--;
                            break;
                        }
                    }
                };
                for (var _o3 = 0; _o3 < Try_Around_Arr.length; _o3++) {
                    Next_Start_Arr.push([Try_Around_Arr[_o3][0], Try_Around_Arr[_o3][1], Start_Arr[i]]);
                };
                if (i == Start_Arr.length - 1) {
                    this.Find_way(Next_Start_Arr, Next_Note_Arr);
                };
            };
        } else {
            this.Game_Win();
        }
    },
    Find_way_End: function Find_way_End(Way_Arr) {
        var regID = /\[(.+?)\,(.+?)\,/g;
        var regID2 = /\[(.+?)\,(.+?)\,/;
        var result = JSON.stringify(Way_Arr).match(regID);
        var list = [];
        for (var i = 0; i < result.length; i++) {
            var item = result[i];
            list.push([Number(item.match(regID2)[1]), Number(item.match(regID2)[2])]);
        };
        this.Next_Lattice_Arr = list;
        //cc.log('寻路结果：' + JSON.stringify(list));
        if (this.Draw_path) {
            for (var _i2 = 0; _i2 < list.length; _i2++) {
                for (var o = 0; o < this.Lattice_Arr.length; o++) {
                    if (list[_i2][0] == this.Lattice_Arr[o][0] && list[_i2][1] == this.Lattice_Arr[o][1] && this.Lattice_Arr[o][2] == 0) {
                        this.Lattice_Arr[o][4].color = new cc.Color(60, 200, 60);
                    }
                }
            };
        }
        if (!this.Player_Action) {
            this.Ghost_start();
        }
    }
    // update (dt) {},

});

cc._RF.pop();