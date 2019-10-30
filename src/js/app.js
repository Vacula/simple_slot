import * as PIXI from "pixi.js";
import Main from "./Main";

const mainDiv = document.createElement("div");
mainDiv.setAttribute("id", "canvas_container");

document.body.appendChild(mainDiv);

const app = window.app = new PIXI.Application({ backgroundColor: 0x1099bb, width: 800, height: 600});
mainDiv.appendChild(app.view);

const loader = PIXI.Loader.shared;
const sprites = {};

loader.add('background', 'assets/background.png')
    .add('img1', 'assets/img1.jpg')
    .add('img2', 'assets/img2.jpg')
    .add('img3', 'assets/img3.jpg')
    .add('img4', 'assets/img4.jpg')
    .add('img5', 'assets/img5.jpg')
    .add('img6', 'assets/img6.jpg')
    .add('img7', 'assets/img7.jpg')
    .add('img8', 'assets/img8.jpg')
    .load((loader, resources) => {
        const main = app.stage.main = new Main();
        main.init();
        app.stage.addChild(main);
});

export {app};