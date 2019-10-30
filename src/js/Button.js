import * as PIXI from 'pixi.js';

class Button extends PIXI.Container {
    constructor () {
        super();
        this.enabled = true;
        this.buttonMode = true;
    }

    static createButton(config){
        let {data, buttonText} = config;
        const button = new Button();

        const g = new PIXI.RectangleExtra({
            x: data.x,
            y: data.y,
            width: data.width,
            height: data.height
        });
        button.addChild(g);

        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            align: 'left',
            fill: '#ff0000'
        });
        const text = new PIXI.Text(buttonText, style);
        text.x = (g.width - text.width) / 2;
        text.y = 10;
        button.addChild(text);

        return button;
    }
}

export default Button;