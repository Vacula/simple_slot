import * as PIXI from "pixi.js";
/**
 * Выполняет callback заданное количество раз
 */
if (!Number.prototype.times) {
    Number.prototype.times = function (callback) {
        for (let i = 0; i < this; i++) {
            callback(i);
        }
    };
}

/**
 * Рисует прямоугольник
 */

if (!PIXI.RectangleExtra){
    PIXI.RectangleExtra = class extends PIXI.Graphics{
        constructor(data){
            super();
            const {x, y, width, height, color = 0xCCCCCC, lineOptions, alpha = 1} = data;
            this.beginFill(color, alpha);
            if (lineOptions) {
                this.lineStyle(lineOptions.thickness || 1, lineOptions.color === undefined ? 0xFF0000 : lineOptions.color, lineOptions.alpha || 1);
            }
            this.drawRect(x, y, width, height);
            this.endFill();
        }
    }
}

/**
 * Случайное целое числов между min и max
 */
if (!Math.randomInt) {
    Math.randomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
}
