import * as PIXI from "pixi.js";
import AnimatedSprite from "./animation/AnimatedSprite";

class Symbol extends PIXI.Container {
    constructor(reel){
        super();
        this.reel = reel;
        this._width = this.reel._symbolWidth;
        this._height = this.reel._symbolHeight;
        this.content = new PIXI.Container();
        this.addChild(this.content);
        this.content.addChild(new PIXI.RectangleExtra({
            x: 0,
            y: 0,
            width: this._width,
            height: this._height,
            color: 0x000000,
            alpha: 0
        }));
        this.state = Symbol.STATE_NORMAL;
    }

    blur(){
        if (this.state === Symbol.STATE_BLUR){
            return;
        }
        this.state = Symbol.STATE_BLUR;
        this._handleState();
    }

    normal(){
        if (this.state === Symbol.STATE_NORMAL){
            return;
        }
        this.state = Symbol.STATE_NORMAL;
        this._handleState();
    }

    replace(id){
        this.id = id;
        this._setSprite(this.createSprite());
    }

    saveOriginalPosition(){
        this._originalPosition = new PIXI.Point(this.x, this.y);
    }

    createSprite(id){
        if (id === undefined){
            id = this.id;
        }
        const sprite = Symbol.createSymbolSprite(id);
        sprite.anchor.set(0.5);
        return sprite;
    }

    _setSprite(sprite){
        this.content.removeChild(this.content.sprite);
        this.content.sprite = sprite;
        this.content.sprite.position.set(this._width / 2, this._height / 2);
        this.content.addChild(sprite);
        this._handleState();
    }

    _handleState(){
        switch (this.state){
            case Symbol.STATE_NORMAL:
                this._normal();
                break;
            case Symbol.STATE_BLUR:
                this._blur();
                break;
        }
    }

    _blur(){
        this.content.sprite.frame = 1;
    }

    _normal(){
        this.content.sprite.frame = 0;
    }

    static createSymbolSprite(id){
        const sprite = AnimatedSprite.fromImages([`SYM${String(id)}.png`, `SYM${String(id)}_BLUR.png`]);
        sprite.frame = 0;
        return sprite;
    }

    get row (){
        let result;
        this.reel.each((symbol, index) => {
            if (this === symbol) {
                result = index;
            }
        });
        return result;
    }

    get column (){
        return this.reel.column;
    }

    get point (){
        return this.getGlobalPosition();
    }

    get pointCenter (){
        const point = this.point;
        return new PIXI.Point(point.x + this._width / 2, point.y + this._height / 2)
    }

    get originalPosition(){
        return this._originalPosition;
    }
}

Symbol.STATE_BLUR = "blur";
Symbol.STATE_NORMAL = "normal";

export default Symbol;