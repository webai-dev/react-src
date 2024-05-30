export default class Timer {
    constructor(callback, delay, startImmediately = false) {
        this.id = undefined;
        this.started = false;
        this.callback = callback;
        this.delay = delay;
        this.remaining = delay;
        this.running = false;
        if (startImmediately) {
            this.start();
        }
    }

    createTimer = (callback, time) => {
        return setTimeout(callback, time);
    };

    cancelTimer = id => {
        clearTimeout(id);
    };

    start = () => {
        if (!this.running) {
            this.running = true;
            this.started = new Date();
            this.id = this.createTimer(() => {
                this.stop();
                this.callback();
            }, this.remaining);
        }
        return true;
    };

    stop = () => {
        this.pause();
        this.started = false;
        this.remaining = this.delay;
    };

    pause = () => {
        if (this.running) {
            this.running = false;
            this.cancelTimer(this.id);
            this.remaining -= new Date() - this.started;
            this.id = undefined;
        }
        return true;
    };

    getTimeLeft = () => {
        if (this.running) {
            this.pause();
            this.start();
        }

        return this.remaining;
    };

    getStateRunning = () => {
        return this.running;
    };
}

window.TimerObj = Timer;
