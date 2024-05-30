import * as Sentry               from '@sentry/browser';
import Storage                   from './Storage';
import { ApiPaths, StorageKeys } from '../constants';
import { store }                 from '../stores';

const httpRequest = (url, { ...config }) =>
    fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        ...config
    });

class LoginManager {
    graphCache = undefined;

    /**
     * Get user from store or if token expired upload new token and get user from it or if no user returns undefined
     * If you need to update user (for example user roles) use `refreshUserToken` instead
     *
     * @returns {Promise}
     */
    getUser = () => new Promise((resolve) => {
        const user = store.auth.user;
        if (user && user.decodedToken.isValid) {
            return resolve(user);
        }
        if (user && !user.decodedToken.isValid) { // refresh token if it was expired
            return this.refresh(user.refreshToken)
                .catch(() => {
                    this.graphCache.clear();
                    store.auth.logout();
                    // reject(e)
                })
                .then(it => resolve(it));
        }

        return resolve(undefined);
    });

    /**
     * Refresh current user. Will throw error if there is no user!
     * NOTE allows to update roles
     *
     * @returns {Promise<any | never>}
     */
    refreshUserToken = () => {
        const token = store.auth.user && store.auth.user.refreshToken;
        if (!token) {
            throw new Error('You are trying to refresh token with no user');
        }
        return this.refresh(token);
    };

    logout = () => {
        if (Storage.get(StorageKeys.switchUser)) {
            Storage.remove(StorageKeys.switchUser);
        }
        this.graphCache.clear();
        store.auth.logout();
    };

    resetPassword = username => {
        const formData = new URLSearchParams();
        const headers = {};
        if (Storage.get(StorageKeys.switchUser)) {
            headers[ 'X-Switch-User' ] = Storage.get(StorageKeys.switchUser);
        }
        formData.append('_username', username);
        return httpRequest(ApiPaths.resetPassword, {
            body: formData,
            headers
        });
    };

    /**
     * Lunch request to refresh token
     *
     * @param {string} token
     * @returns {Promise<any | never>}
     */
    refresh = token => new Promise((resolve, reject) => {
        const formData = new URLSearchParams();
        formData.append('refresh_token', token);
        const headers = {};
        if (Storage.get(StorageKeys.switchUser)) {
            headers[ 'X-Switch-User' ] = Storage.get(StorageKeys.switchUser);
        }
        return this._handleAuthRequest(
            resolve,
            reject,
            httpRequest(
                ApiPaths.refreshToken,
                {
                    body: formData,
                    headers
                }),
            'Error refreshing login token'
        );
    }).catch(e => {
        store.auth.setRequiresTokenReissue();
        throw new Error(e.json.message);
    });

    login = (username, password) => {
        this.graphCache.clear();

        return new Promise((resolve, reject) => {
            const formData = new URLSearchParams();
            formData.append(
                '_username',
                username
            );
            formData.append(
                '_password',
                password
            );
            const headers = {};
            if (Storage.get(StorageKeys.switchUser)) {
                headers[ 'X-Switch-User' ] = Storage.get(StorageKeys.switchUser);
            }
            return this._handleAuthRequest(
                resolve,
                reject,
                httpRequest(
                    ApiPaths.login,
                    {
                        body: formData,
                        headers
                    }
                ),
                'Error logging in'
            );
        });
    };

    register = fields => new Promise((resolve, reject) => {
        const formData = new FormData();

        const addData = (data, prefix = 'register') => {
            Object.entries(data)
                .map(([ key, value ]) => {
                    if (value instanceof File) {
                        formData.append(`${ prefix }[${ key }]`, value);
                    } else if (typeof value === 'object') {
                        addData(value, `${ prefix }[${ key }]`);
                    } else {
                        formData.append(`${ prefix }[${ key }]`, value);
                    }
                });
        };
        addData(fields);

        return this._handleAuthRequest(
            resolve,
            reject,
            httpRequest(ApiPaths.register, {
                body: formData
            }),
            'Error registering a user'
        );
    });

    _handleAuthRequest = (resolve, reject, promise, errMessage = 'Error logging in') =>
        promise
            .catch((error) => {
                Sentry.captureException(error);
                return reject(errMessage);
            })
            .then(data => data.json()
                .then(json => ({
                    json,
                    data
                }))
            )
            .then(({ json, data }) => {
                if ((json.code && json.code > 400) || (!json.token && !json.success)) {
                    return reject({ json, data });
                }
                store.auth.setRequiresTokenReissue(false);
                if (json.token) {
                    store.auth.setUserFromServer(json);
                } else {
                    return resolve(json);
                }

                return resolve(store.auth.user);
            });

}

const loginManager = new LoginManager();

export default loginManager;
