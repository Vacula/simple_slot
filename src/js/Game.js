import * as PIXI from "pixi.js";
import Main from "./Main";

class Game extends PIXI.Container {
    constructor() {
        super();
        this.inited = false;
    }

    init(){
        if (this.inited){
            return;
        }

        this.initialValues = this._setInitialValues();

        this.state = Game.IDLE;
        this.nextState = Game.SPIN_START;

        this.main = new Main();
        this.main.init();
        this.addChild(this.main);

        this.response = {};

        this.inited = true;
    }

    setState(state){
        if(this.state === state){
            return
        }
        switch(state){
            case 'idle':
                this.state = Game.IDLE;
                this.response = {};
                break;
            case 'spin_start':
                this.state = Game.SPIN_START;
                break;
            case 'spin_stop':
                this.state = Game.SPIN_STOP;
                break;
            case 'win':
                this.state = Game.WIN;
                break;
        }
    }

    _setInitialValues(){
        return {
            "balance": 1000,
            "bet": 5
        }
    }

    async sendRequest(){
        this.response = {};
        this.setState(Game.SPIN_START);

        this.main.infoField.update(this.initialValues.bet, 0);

        const url = "./src/json/server.json";
        const serverResponse =  await (await fetch(url)).json();
        this.response = this._getCombination(serverResponse);
        this.setState(Game.SPIN_STOP);
        this.nextState = this._nextState(this.response);
    }

    _getCombination(res){
        const results = Object.entries(res).filter((p) => p[0] === "results")[0][1];
        return results[Math.randomInt(1, 3)]
    }

    _nextState(result){
        if(result.hasOwnProperty("win")){
            if(result["win"] > 0){
                return Game.WIN
            } else {
                return Game.IDLE
            }
        }
    }
}

Game.IDLE = 'idle';
Game.SPIN_START = 'spin_start';
Game.SPIN_STOP = 'spin_stop';
Game.WIN = 'win';

const game = new Game();

export {Game, game};