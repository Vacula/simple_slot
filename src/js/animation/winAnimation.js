import {TimelineLite} from "gsap/TweenMax";
import {Game, game} from "../Game";
import {winMessage} from "./WinMessage";

class WinAnimation {
    constructor() {
        this._inited = false;
    }

    start(response){
        this._inited = false;
        this._init();
        this._win = response.win;
        this._timeline.restart();
        this._enableSkip();
    }

    _enableSkip(){
        game.main.skipArea.set(() => {
            this._skip();
        });
    }

    _disableSkip(){
        game.main.skipArea.reset();
    }

    _skip(){
        this._timeline.seek("skip", false);
    }

    _init(){
        if (this._inited){
            return;
        }
        this._win = 0;
        this._duration = 2.7;
        this._resumeDuration = 0.3;
        this._timeline = this._createTimeline();
        this._inited = true;
    }

    _createTimeline(){
        return new TimelineLite({paused: true})
            .add("start", 0)
            .add("skip", this._duration)
            .add("end", this._duration + this._resumeDuration)

            .add(() => {
                this._doStart();
            }, "start")
            .add(() => {
                this._doSkip();
            }, "skip")
            .add(() =>{
                this._doExit();
            }, "end");
    }

    _doStart(){
        game.main.animations.removeChildren();
        game.main.animations.addChild(winMessage);
        winMessage.position.set(70,50);
        winMessage.start(this._win);
        game.main.infoField.update(0, this._win)
    }

    _doSkip(){
        winMessage.skip();
        this._disableSkip();
        game.main.infoField.update(-this._win, 0)
    }

    _doExit(){
        game.main.spinButton.enabled = true;
        game.main.animations.removeChildren();
        game.setState(Game.IDLE);
    }
}

export default new WinAnimation();