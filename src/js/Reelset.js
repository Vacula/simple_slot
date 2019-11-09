class Reelset{
    constructor(){
        this._array = [...arguments];
        this._currentIndex = 0;
    }

    next(){
        this._currentIndex += 1;
        if (this._currentIndex >= this._array.length) {
            this._currentIndex = 0;
        }
        return this._array[this._currentIndex];
    }
}

export default Reelset;