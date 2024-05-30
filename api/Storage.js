class Storage {
    prefix = '';
    constructor(prefix) {
        this.prefix = prefix;
    }
    getStorageKey = key => `${this.prefix}:${key}`;
    get = (key, defaultVal = undefined) => {
        let existing = defaultVal;
        let possible = window.localStorage.getItem(this.getStorageKey(key));
        if (possible) {
            try {
                existing = JSON.parse(possible);
            } catch (e) {
                existing = defaultVal;
            }
        }
        return existing;
    };
    set = (key, value) => {
        return window.localStorage.setItem(this.getStorageKey(key), JSON.stringify(value));
    };
    remove = key => {
        return window.localStorage.removeItem(this.getStorageKey(key));
    };
}
const storage = new Storage('sourcr');
export default storage;
