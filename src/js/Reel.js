import * as PIXI from "pixi.js";
import {TweenLite} from "gsap/TweenMax";
import {TimelineMax} from "gsap/TimelineMax";
import Symbol from "./Symbol";
import "./polyfills.js";
import {game, Game} from "./Game";
import winAnimation from "./animation/winAnimation";

class Reel extends PIXI.Container {
    constructor(reels, column){
        super();
        this.column = column;
        this.reels = reels;
        this.dispatcher = reels.dispatcher;
        this._speed = 1;
        this._queue = [];
        this.state = Reel.STATE_STOPPED;
    }

    init(config){
        this.config = config;
        this.speed = config.speed;
        this.number = config.number;
        this.symbolNumber = config.symbolNumber;
        this.reelset = config.reelset;
        this._defaultCombination = config.defaultCombination;
        this._reelLayout = config.reelLayout;
        this._oneSymbolDuration = 0.1;
        this._symbolWidth = config.symbolWidth;
        this._symbolHeight = config.symbolHeight;
        this._mountSymbols();
        this.default();
        this._stepTimeline = this._createStepTimeLine();
        this._endTimeline = this._createEndTimeLine();
        this._putMask();
        this.position.set(this._reelLayout.left, this._reelLayout.top);
    }

    default(){
        this._defaultCombination[this.column-1].forEach((id, index) => {
            const symbol = this[index + 1];
            symbol && symbol.replace(id);
        });
    }

    start() {
        if (this.state === Reel.STATE_STOPPED){
            this._endTimeline.kill();
            this._endTimeline = this._createEndTimeLine();

            this._startSpin();
            this.stop();
        }
    }

    stop(){
        if(this.state === Reel.STATE_SPINNING){
            setTimeout(() => {
                if(game.state === Game.SPIN_STOP){
                    this.state = Reel.STATE_STOPPING;
                    this._pushResponse(game.response.symbols[this.column - 1]);
                } else{
                    this.stop()
                }
            }, 3000);}
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
            return this.reelset.next();
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
        this.mask.drawRect(0,0,this._symbolWidth,this._symbolHeight * this.number);
        this.mask.endFill();
        this.addChild(this.mask);
    }

    _startSpin(){
        this.state = Reel.STATE_SPINNING;
        this._step();
    }

    _createEndTimeLine(){
        const timeline = this._createExtraTimeline(1);

        timeline.addCallback(() => {
            this.state = Reel.STATE_STOPPED;
            if(this.column === 3){
                game.setState(game.nextState);
                if(game.nextState === Game.WIN){
                    winAnimation.start(game.response)
                } else {
                    game.main.spinButton.enabled = true;
                }
            }
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
                this._end();
            }}, duration + 0.00001);
        timeline.stop();
        timeline.timeScale(this.speed || 1);
        return timeline;
    };

    _end(){
        this.state = Reel.STATE_ENDING;
        this.normal();
        this._endTimeline.play(0);
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
        if (this.state === Reel.STATE_SPINNING){
            this.state = Reel.STATE_SPINNING;
            this._stepTimeline.play(0);
        } else {
            this.state = Reel.STATE_STOPPED;
        }
    }
}

Reel.STATE_SPINNING = "spinning";
Reel.STATE_STOPPING = "stopping";
Reel.STATE_ENDING = "ending";
Reel.STATE_STOPPED = "stopped";

export default Reel;