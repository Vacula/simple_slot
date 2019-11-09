import * as PIXI from "pixi.js";
import {TweenLite} from "gsap/TweenLite";

class WinMessage extends PIXI.Container{
    constructor(){
        super();
        this._inited = false;
    }

    start(win){
        if(!this._inited){
            this._init()
        }
        this._winValue.text = win;
        this._winValue.x = (this.width - this._winValue.width) / 2;
        TweenLite.to(this, 0.3, {alpha: 0.8});
    }

    skip(){
        TweenLite.to(this, 0.3, {alpha: 0});
    }

    _init(){
        this.alpha = 0;
        this._textStyle = this._getTextStyle();

        const background = this.addChild(new PIXI.RectangleExtra({x:0, y:0, width:718, height:464, color:0x02474e}));
        background.addChild(this._createTextFields());

        this._inited = true;
    }

    _createTextFields(){
        const container = new PIXI.Container();

        const winText = new PIXI.Text(`YOU WON`, this._textStyle);
        winText.position.set((this.width - winText.width) / 2, (this.height - winText.height) / 2);
        this._winValue = new PIXI.Text("", this._textStyle);
        this._winValue.y = winText.y + winText.height + 10;
        container.addChild(winText);
        container.addChild(this._winValue);

        return container
    }

    _getTextStyle(){
        return {
            fontFamily : 'Arial',
            fontSize: 120,
            fill : 0xffea00,
            align : 'center'
        }
    }
}

const winMessage = new WinMessage();

export {WinMessage, winMessage};