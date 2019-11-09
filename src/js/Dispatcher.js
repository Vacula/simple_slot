import {getFileExtension} from "./library";
import {loader} from "./Loader";
import {Game, game} from "./Game";
import * as PIXI from "pixi.js";

class Dispatcher {
    constructor(){
        this.app = null;
        this.resources = {};
        this.filelist = {};
        this.config = {};
    }

    async init(onComplete) {
        const next = () => {
            if (next.error) {
                throw next.error;
            }

            window.onerror && window.onerror.addData({
                game_id: this.params.game,
                params: this.params,
            })
        };

        const script = async () => {
            await (this._getFilelistData()).catch(e => {
                next.error = e
            }); next();
            await (this._createConfig()).catch(e => {
                next.error = e
            });
            next();
            this._createApp();
            next();
            await (this._createFilelist()).catch(e => {
                next.error = e
            });
            next();
            this._createGameStage();
            await (this._loadResources()).catch(e => {
                next.error = e
            });
            next();
            this._showGame();
            onComplete();
        };

        await (script()).catch(error => {
            setTimeout(() => {
                throw(error)
            });
        });
    }

    async _createConfig(){
        const url = "./src/json/config.json";
        this.config = await (await fetch(url)).json();
    }

    _createApp(){
        this.app = window.app = new PIXI.Application({ backgroundColor: 0x000000, width: this.config.gameWidth, height: this.config.gameHeight});
        document.getElementById("game").appendChild(this.app.view);
        this.app.view.style.visibility = "hidden";
    }

    _createGameStage(){
        this.app.stage.game = game;
        this.app.stage.addChild(game);
        window.game = game;
    }

    _createLoader(){
        loader.init();
    }

    async _getFilelistData(){
        const url = "./src/json/filelist.json";
        this.resources  = await (await fetch(url)).json();
    }

    async _createFilelist(){
        const keys = Object.keys(this.resources);
        this.filelist = {};
        for (let i = 0; i < keys.length; i++){
            let key = keys[i];
            let list = this.resources[key];
            this.filelist[key] = {};
            for (let j = 0; j < list.length; j++){
                let res = list[j];
                if (typeof res === "string"){
                    this.filelist[key][res] = {
                        url: this._createUrl(res)
                    };
                }
            }
        }
    }

    _createUrl(res){
        let result;
        const ext = getFileExtension(res);
        if (["json", "jpg", "gif", "png"].includes(ext)) {
            result = `assets/${res}`;
        }
        return result;
    }

    _showGame(){
        this.app.view.style.visibility = "visible";
        const loadingText = document.getElementById("loading_text");
        loadingText.style.visibility = "hidden";
        game.init();
    }

    async _loadResources(){
        return new Promise((resolve, reject) => {
            const id = "resources";
            const handlers = {
                onComplete: () => {
                    resolve();
                },
                onError: reject
            };
            loader.loadFiles(this.filelist, id, handlers);
        });
    }
}

const dispatcher = new Dispatcher();

export {Dispatcher, dispatcher};