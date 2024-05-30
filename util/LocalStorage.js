class LocalStorage {
    /**
     * Clear all expired keys. This method should be used only once per app! Check sourcr-app/app/assets/app/App.jsx
     */
    init() {
        const expiration = JSON.parse(window.localStorage.getItem(LocalStorage.EXPIRATION_KEY)) || {};
        for (let key in expiration) {
            if (!window.localStorage.getItem(key) || new Date(expiration[key]) < new Date()) {
                window.localStorage.removeItem(key);

                delete expiration[key];
            }
        }
        window.localStorage.setItem(LocalStorage.EXPIRATION_KEY, JSON.stringify(expiration));
    }

    static EXPIRATION_KEY = 'expiration';

    /**
     * Set value to localStorage with expiration date
     *
     * @param {string|boolean|number} value
     * @param {string} key
     * @param {Date|boolean|number} [expirationDate] - if exist will delete value after expirationDate (either Date instance or minutes)
     */
    setItem(key, value, expirationDate) {
        /* eslint-disable no-console */
        if (!expirationDate && expirationDate !== false) {
            /* eslint-disable max-len */
            console.error('Please set expiration Date to prevent memory leaks. If you are absolutely sure that that key has to be stored without expiration date, provide false as third argument. Value WASN\'T saved!');
            /* eslint-enable max-len */
            return;
        }
        if (expirationDate && !(expirationDate instanceof Date || Number.isInteger(expirationDate))) {
            console.error('This parameter should be Date instance or integer (minutes)! Value WASN\'T saved!');
            return;
        }
        /* eslint-enable no-console */
        let realExpirationDate = expirationDate;
        if (realExpirationDate && Number.isInteger(realExpirationDate)) {
            const timeOffset = realExpirationDate * 60000;
            realExpirationDate = new Date((new Date()).getTime() + timeOffset);
        }
        if (realExpirationDate) {
            const expiration = JSON.parse(window.localStorage.getItem(LocalStorage.EXPIRATION_KEY)) || {};
            expiration[key] = realExpirationDate.getTime();

            window.localStorage.setItem(LocalStorage.EXPIRATION_KEY, JSON.stringify(expiration));
        }
        window.localStorage.setItem(key, value);
    }

    /**
     * Get value from localStorage
     *
     * @param {string} key
     * @param {boolean} remove - will remove value and expirationDate from localStorage
     */
    getItem(key, remove = false) {
        const value = window.localStorage.getItem(key);
        if (remove) {
            this.removeItem(key);
        }
        return value;
    }

    /**
     * Remove value and it expiration date from localStorage
     *
     * @param {string} key
     */
    removeItem(key) {
        this.removeExpirationDate(key);
        window.localStorage.removeItem(key);
    }

    /**
     * Parse expiration localStorage key, remove that key and date, write rest expiration keys to localStorage
     *
     * @param {string} key
     */
    removeExpirationDate(key) {
        const expiration = JSON.parse(window.localStorage.getItem(LocalStorage.EXPIRATION_KEY)) || {};

        delete expiration[key];
        window.localStorage.setItem(LocalStorage.EXPIRATION_KEY, JSON.stringify(expiration));
    }

    /**
     * Clear all localStorage
     */
    clear() {
        window.localStorage.clear();
    }
}

const localStorageInstance = new LocalStorage();
export default localStorageInstance;
