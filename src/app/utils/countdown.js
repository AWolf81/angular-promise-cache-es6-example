export default class Countdown {
    constructor(cb, intervalTime) {
        this._interval = {};
        this._cb = cb;
        this._active = false;
        this._options = {
            intervalTime
        };
    }

    handler() {
        // console.log('timeout handler');
        if (this._cb() === false) {
            clearInterval(this._interval);
        }
    }
        
    active() {
        return this._active;
    }

    start() {
        this._interval = setInterval(() => this.handler(), this._options.intervalTime);
        this._active = true;
    }
        
    stop() {
        clearInterval(this._interval);
        this._active = false;
    }
}