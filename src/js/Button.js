import * as PIXI from 'pixi.js';

class Button extends PIXI.Container {
    constructor () {
        super();
        this.hitArea = PIXI.Rectangle.EMPTY;
        this._states = this._addStates();
        this._pressed = false;
        this.enabled = true;
        this.visible = true;
        this.buttonMode = true;
        this.state = Button.UP;
    }

    get enabled() {
        return this.interactive;
    }

    set enabled(value) {
        if (this.interactive !== value) {
            this.interactive = value;
            if (value) {
                this.state = Button.UP;
            } else {
                this.state = Button.DISABLED;
                this._pressed = false;
            }
        }
    }

    get state(){
        return this._state;
    }

    set state(value) {
        if (this._state === value){
            return;
        }
        this._state = value;
        Button.eachState(stateName => {
            this._states[stateName].visible = value === stateName;
        });

        switch(value){
            case Button.UP:
                break;
            case Button.DOWN:
                break;
            case Button.DISABLED:
                break;
        }
    }

    pointerout() {
        if (Button.globalLeftPressed && !this._pressed) {
            return;
        }
        this.state = Button.UP;
    };

    pointerdown() {
        this._pressed = true;
        this.state = Button.DOWN;
    };

    pointerup() {
        if (this._pressed){
            this._pressed = false;
        }
        this._clickSound && sound.play(this._clickSound);
        this.state = Button.OVER;
    };

    pointerupoutside() {
        this._pressed = false;
    };

    _addStates(){
        const states = {};
        Button.eachState(name => {
            states[name] = new PIXI.Container();
            this.addChild(states[name]);
        });
        return states;
    }

    static eachState(callback) {
        [Button.UP, Button.DOWN, Button.DISABLED].forEach(name => callback(name));
    }

    static createButton(config) {
        let {images, hitArea} = config;
        const button = new Button();

        if (typeof images === 'object'){
            Button.eachState(name => {
                button._states[name].addChild(new PIXI.Sprite.from(images[name]));
            })
        }

        const s = button._states[Button.UP];
        button.hitArea = new PIXI.Circle(s.width / 2, s.height / 2, s.width / 2);

        return button;
    }

    static init(){
        document.addEventListener("mousedown", e => {
                if (e.button === 0) {
                    Button.globalLeftPressed = true;
                }
            }
        );
        document.addEventListener("mouseup", e => {
                if (e.button === 0) {
                    Button.globalLeftPressed = false;
                }
            }
        );
    }

}

Button.UP = "up";
Button.DOWN = "down";
Button.DISABLED = "disabled";

export default Button;