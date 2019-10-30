import * as PIXI from "pixi.js";
import Reels from "./Reels";
import Button from "./Button";

class Main extends PIXI.Container {
    constructor(){
        super();
        this._inited = false;
    }

    init(){
        this.background = this.addChild(PIXI.Sprite.from('assets/background.png'));
        this.reels = this.addChild(this._createReels());
        this.spinButton = this.addChild(this._createSpinButton());
        this.spinButton.position.set(this.width - this.spinButton.width -10, this.height - this.spinButton.height - 10);
        this.stopButton = this.addChild(this._createStopButton());
        this.stopButton.position.set(10, this.height - this.stopButton.height - 10);
        this._inited = true;
    }

    _createReels(){
        const reels = new Reels();
        reels.init();
        return reels;
    };

    _createSpinButton(){
        const button = Button.createButton({
            data: {x:0, y:0, width: 250, height:60},
            buttonText: 'Spin'
        });

        button.interactive = true;
        button.pointertap = () => {
            this.stopButton.interactive = true;
            this.reels.spinStart();
            button.interactive = false;
        };
        return button;
    }

    _createStopButton(){
        const button = Button.createButton({
            data: {x:0, y:0, width: 250, height:60},
            buttonText: 'Stop'
        });

        button.interactive = false;
        button.pointertap = () => {
            this.spinButton.interactive = true;
            this.reels.spinStop();
            button.interactive = false;
        };
        return button;
    }
}

export default Main;