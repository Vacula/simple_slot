import * as PIXI from "pixi.js";
import "./polyfills.js";
import Reel from "./Reel";
import {TimelineMax} from "gsap/TimelineMax";

class Reels extends PIXI.Container {
    constructor(){
        super();
        this._number = 5;
    }

    init(){
        this.position.set(50, 47);
        Number(this._number).times(index => {
            const column = index + 1;
            const reel = new Reel(this, column);
            const config = {};//this._createConfig(column);
            reel.init(config);
            this[column] = reel;
            this.addChild(reel);
        });
        this._spinStartTimeline = this._createSpinStartTimeline();
        this._spinStartTimeline.pause();
    }

    spinStart(){
        this._spinStartTimeline.restart()
    }

    spinStop(){
        Number(this._number).times(index => {
            this[index + 1].stop()
        });
    }

    _createSpinStartTimeline(){
        const timeline = new TimelineMax();
        const delays = [0, 0.2, 0.4, 0.6, 0.8];
        delays.forEach((delay, index) => {
            timeline.addCallback(()=>this[index + 1].start(), delay)
        });
        return timeline;
    }
}

export default Reels;