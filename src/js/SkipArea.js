import * as PIXI from "pixi.js";

class SkipArea extends PIXI.Container{
    constructor(width, height){
        super();
        this.hitArea       = new PIXI.Rectangle(0, 0, width, height);
        this.interactive   = false;
        this.pointertap    = this._doSkip.bind(this);
        this._action       = null;
    }

    set(action) {
        this._action = action;
        this.interactive = true;
    };

    reset() {
        this._action = null;
        this.interactive = false;
    };

    _doSkip(event) {
        const action = this._action;
        if (action) {
            this.reset();
            action(event);
        }
    };
}

export default SkipArea;