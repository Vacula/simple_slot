import {dispatcher} from "./Dispatcher";
import {game} from "./Game";
import winAnimation from "./animation/winAnimation";

dispatcher.init(() => {
    window.simpleSlot = {};
    window.simpleSlot.game = game;
    window.simpleSlot.winAnimation = winAnimation;
});

