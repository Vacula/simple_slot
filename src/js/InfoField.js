import * as PIXI from "pixi.js";
import {game} from "./Game";

class InfoField extends PIXI.Container {
    constructor(){
        super();

        this._inited = false;
    }

    init(){
        if(this._inited){
            return
        }

        this._textStyle = this._getTextStyle();

        const background = this.addChild(new PIXI.RectangleExtra({x:0, y:0, width:150, height:80, color:0x02474e}));
        background.addChild(this._createTextFields());

        this.update();

        this._inited = true;
    }

    update(balance, win){
        if(typeof balance === 'number'){
            game.initialValues.balance -= balance;
            this._balanceField.text = `BALANCE: ${game.initialValues.balance}`;
        } else {
            this._balanceField.text = `BALANCE: ${game.initialValues.balance}`;
        }
        if(win){
            this._winField.text = `WIN: ${win}`;
        } else {
            this._winField.text = `WIN:`;
        }
    }

    _createTextFields(){
        const container = new PIXI.Container();

        this._balanceField = new PIXI.Text(`BALANCE:`, this._textStyle);
        this._balanceField.position.set(10,10);
        this._winField = new PIXI.Text(`WIN:`, this._textStyle);
        this._winField.position.set(this._balanceField.x, this._balanceField.height + 10);

        container.addChild(this._balanceField, this._winField);

        return container;
    }

    _getTextStyle(){
        return {
            fontFamily : 'Arial',
            fontSize: 18,
            fill : 0xffea00,
            align : 'left'
        }
    }
}

export default InfoField;