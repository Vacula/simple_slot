import * as PIXI from "pixi.js";
import Reels from "./Reels";
import Button from "./Button";
import InfoField from "./InfoField";
import SkipArea from "./SkipArea";

class Main extends PIXI.Container {
    constructor(){
        super();
        this._inited = false;
    }

    init(){
        if(this._inited){
            return
        }
        this.background = this.addChild(PIXI.Sprite.from('assets/BG.png'));

        this.reels = this.addChild(this._createReels());
        this.reels.position.set(70,50);

        this.spinButton = this.addChild(this._createSpinButton());
        this.spinButton.position.set(this.background.width - this.spinButton.width - 38, (this.background.height - this.spinButton.height) / 2);

        this.infoField = this.addChild(this._createInfoField());
        this.infoField.position.set(this.background.width - this.infoField.width-5, this.spinButton.y + this.spinButton.height + 30);

        this.animations = this.addChild(new PIXI.Container());

        this.skipArea = this.addChild(new SkipArea(this.background.width, this.background.height));

        this._inited = true;
    }

    _createReels(){
        const reels = new Reels();
        reels.init();
        return reels;
    };

    _createInfoField(){
        const infoField = new InfoField();
        infoField.init();
        return infoField;
    };

    _createSpinButton(){
        const button = Button.createButton({
            images: {
                "up":"assets/BTN_Spin.png",
                "down":"assets/BTN_Spin.png",
                "disabled":"assets/BTN_Spin_d.png"
            }
        });

        button.enabled = true;
        button.pointertap = () => {
            button.enabled = false;
            this.reels.spinStart();
        };

        return button;
    }
}

export default Main;