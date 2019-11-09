import * as PIXI from "pixi.js";
import {resolve} from "./library";
import "./polyfills.js";
import Reel from "./Reel";
import Reelset from "./Reelset";
import {TimelineMax} from "gsap/TimelineMax";
import {dispatcher} from "./Dispatcher";
import {game, Game} from "./Game";

class Reels extends PIXI.Container {
    constructor(){
        super();
        this.number = resolve(dispatcher, ".config.reelGroups.default.numberOfSymbols", []).length;
    }

    init(){
        Number(this.number).times(index => {
            const column = index + 1;
            const reel = new Reel(this, column);
            const config = this._createConfig(column);
            reel.init(config);
            this[column] = reel;
            this.addChild(reel);
        });
        this._spinStartTimeline = this._createSpinStartTimeline();
    }

    spinStart(){
        this._spinStartTimeline.restart();
        game.sendRequest();
    }


    get reelStartDelays(){
        return this._getReelStartDelays();
    }

    _getReelStartDelays(){
        return resolve(dispatcher, `.config.reelGroups.default.spinTimes.reelStartDelays`, [0,0.2,0.4])
    }

    _createSpinStartTimeline(){
        const timeline = new TimelineMax({paused: true});
        const delays = this.reelStartDelays;
        delays.forEach((delay, index) => {
            timeline.addCallback(()=>{this[index + 1].start()}, delay)
        });
        return timeline;
    }

    _createConfig(column){
        let reelset = resolve(dispatcher, ".config.fakeReels");
        reelset = new Reelset(...reelset[column - 1]);
        return {
            speed: resolve(dispatcher, ".config.reelGroups.default.speed", 1),
            number: resolve(dispatcher, `.config.reelGroups.default.numberOfSymbols[${column - 1}]`, 3),
            symbolWidth: resolve(dispatcher, ".config.reelGroups.default.symbol.width", 235),
            symbolHeight: resolve(dispatcher, ".config.reelGroups.default.symbol.height", 155),
            symbolNumber: resolve(dispatcher, ".config.reelGroups.default.symbol.number", 6),
            reelLayout: resolve(dispatcher, `.config.reelGroups.default.reelLayout[${column}]`),
            numberOfSymbols: resolve(dispatcher, `.config.reelGroups.default.reelLayout[${column}]`),
            reelset: reelset,
            defaultCombination: resolve(dispatcher, ".config.defaultCombination")
        }
    };
}

export default Reels;