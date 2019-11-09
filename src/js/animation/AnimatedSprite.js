import * as PIXI from "pixi.js";
import {dispatcher} from "../Dispatcher";

class AnimatedSprite extends PIXI.AnimatedSprite{
    constructor(){
        super(...arguments);
    }

    bindTextures(){
        this._textures.forEach(texture => {
            dispatcher.app.renderer.bindTexture(texture);
        });
    }

    get frame (){
        return this.currentFrame;
    }

    set frame (value){
        this.gotoAndStop(value);
    }

    get frames(){
        return this._textures.length;
    }

    static fromImages(images) {
        const textures = [];
        for (let i = 0; i < images.length; ++i) {
            textures.push(PIXI.Texture.from(images[i]));
        }
        return new AnimatedSprite(textures);
    };
}

export default AnimatedSprite;