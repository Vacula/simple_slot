import * as PIXI from "pixi.js";
import {TweenLite} from "gsap/TweenMax";
import {TimelineMax} from "gsap/TimelineMax";
import Symbol from "./Symbol";
import "./polyfills.js";

class Reel extends PIXI.Container {
    constructor(reels, column){
        super();
        this.column = column;
        this.reels = reels;
        this._queue = [];
        this.state = Reel.STATE_STOPPED;
        this._symbolWidth = 126;
        this._symbolHeight = 125;
        this.position.set(reels.x + (this.column - 1) * this._symbolWidth, 0)
    }

    init(){
        this.speed = 1;
        this.number = 3;
        this._oneSymbolDuration = 0.1;
        this._symbolWidth = 126;
        this._symbolHeight = 125;
        this._mountSymbols();
        this.default();
        this._stepTimeline = this._createStepTimeLine();
        this._chargeTimeline = this._createChargeTimeLine();
        this._bounceTimeline = this._createBounceTimeLine();
        this._putMask();
        this.position.set((this.column - 1) * (this._symbolWidth + 18), this.reels.y);
    }

    default(){
        [Math.randomInt(1,8), Math.randomInt(1,8), Math.randomInt(1,8)].forEach((id, index) => {
            const symbol = this[index + 1];
            symbol && symbol.replace(id);
        });
    }

    start() {
        if (this.state === Reel.STATE_STOPPED){

            this._chargeTimeline.kill();
            this._chargeTimeline = this._createChargeTimeLine();

            this._bounceTimeline.kill();
            this._bounceTimeline = this._createBounceTimeLine();

            this._charge();
        }
    }

    stop(){
        this.state = Reel.STATE_SPINNING;
        this.state = Reel.STATE_STOPPING;
        this._pushResponse([Math.randomInt(1,8), Math.randomInt(1,8), Math.randomInt(1,8)]);
    }

    blur() {
        this.each(symbol => {
            symbol.blur();
        })
    }

    normal() {
        this.each(symbol => {
            symbol.normal();
        })
    }

    each(callback){
        Number(this.number + 2).times(i => {
            callback(this[i], i);
        });
    }

    eachReverse(callback){
        for (let i = this.number + 1; i >= 0; i--){
            callback(this[i], i);
        }
    }

    _pushResponse(arr){
        this._queue = [...arr];
        this._queue.unshift(this._getNextSymbolId());
    }

    _mountSymbols(){
        Number(this.number + 2).times(index => {
            const symbol = this._mountSymbol(index);

            if (index === 0 || index === this.number + 1){
                symbol.replace(this._getNextSymbolId());
            }
        });
    }

    _getNextSymbolId(fromQueue){
        if (fromQueue){
            return this._queue.pop();
        } else {
            return Math.randomInt(1,8);
        }
    }

    _mountSymbol(position){
        const symbol = this[position] = new Symbol(this);
        symbol.y = (position - 1) * this._symbolHeight;
        symbol.saveOriginalPosition();
        this.addChild(symbol);
        return symbol;
    }

    _putMask(){
        this.mask = new PIXI.Graphics();
        this.mask.beginFill(0);
        this.mask.drawRect(0,0,126,374);
        this.mask.endFill();
        this.addChild(this.mask);
    }

    _charge(){
        this.state = Reel.STATE_CHARGING;
        this._chargeTimeline.play(0)
    }

    _createChargeTimeLine(){
        const timeline = this._createExtraTimeline(1);
        timeline.addCallback(() => {
            this._step();
        }, 1);
        return timeline;
    };

    _createBounceTimeLine(){
        const timeline = this._createExtraTimeline(1);

        timeline.addCallback(() => {
            this.state = Reel.STATE_STOPPED;
        }, 1 + 0.00001);
        return timeline;
    }

    _createExtraTimeline(duration){
        const timeline = new TimelineMax();
        this.each(symbol => {
            timeline.fromTo(symbol, duration, {y: symbol.originalPosition.y}, {y: symbol.originalPosition.y + this._symbolHeight}, 0)
        });
        timeline.stop();
        timeline.timeScale(this.speed || 1);
        return timeline;
    }

    _createStepTimeLine(){
        const timeline = new TimelineMax({repeat:-1});
        const duration = this._oneSymbolDuration;

        this.each(symbol => {
            timeline.add(TweenLite.fromTo(symbol, duration,
                {y: symbol.originalPosition.y},
                {y: symbol.originalPosition.y + this._symbolHeight}), 0)
        });
        timeline.addCallback(this.blur.bind(this), 0);

        timeline.addCallback(() => {
            this._handleEndOfStep();
            if (this.state === Reel.STATE_STOPPING && !this._queue.length) {
                timeline.stop();
                this._bounce();
            }}, duration + 0.00001);
        timeline.stop();
        timeline.timeScale(this.speed || 1);
        return timeline;
    };

    _bounce(){
        this.state = Reel.STATE_BOUNCING;
        this.normal();
        this._bounceTimeline.play(0);
    }

    _handleEndOfStep(){
        this.eachReverse((symbol, i) => {
            if (i === 0){
                const fromQueue = this.state === Reel.STATE_STOPPING && this._queue.length > 0;
                const newId = this._getNextSymbolId(fromQueue);
                symbol.replace(newId);
            } else {
                symbol.replace(this[i-1].id);
            }
        });
    }

    _step(){
        if ([Reel.STATE_CHARGING, Reel.STATE_SPINNING].includes(this.state)){
            this.state = Reel.STATE_SPINNING;
            this._stepTimeline.play(0);
        } else {
            this.state = Reel.STATE_STOPPED;
        }
    }
}

Reel.STATE_CHARGING = "charging";
Reel.STATE_SPINNING = "spinning";
Reel.STATE_STOPPING = "stopping";
Reel.STATE_BOUNCING = "bouncing";
Reel.STATE_STOPPED = "stopped";

export default Reel;