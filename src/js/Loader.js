import * as PIXI from "pixi.js";

class Loader extends PIXI.Loader{
    constructor(){
        super();

    };

    loadFiles(filelist, id, handler){
        this.onError.add(handler.onError);
        this.__handler = handler;
        for(let [key, value] of Object.entries(filelist[id])){
            this.add(key, value.url)
        }
        this.load(()=>{
            handler.onComplete()
        })
    }
}

const loader = new Loader();

export {Loader, loader};