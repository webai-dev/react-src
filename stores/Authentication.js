import { observable, computed, autorun, action } from 'mobx';
import Storage                                   from '../api/Storage';
import jwtDecode                                 from 'jwt-decode';
import { StorageKeys }                           from '../constants';
import getRoleName                               from '../util/getRoleName';
import getAllRoles                               from '../util/getAllRoles';
import * as Sentry                               from '@sentry/browser';

class DecodedToken {
    constructor(id, username, roles, issuedAt, expiresAt) {
        this.id = id;
        this.username = username;
        this.roles = roles;
        this.issuedAt = issuedAt;
        this.expiresAt = expiresAt;
    }

    get expiryDate() {
        return new Date(this.expiresAt);
    }

    get isValid() {
        return this.expiryDate > new Date();
    }

    static fromString(token) {
        let decoded;
        try {
            decoded = jwtDecode(token);
        } catch (e) {
            decoded = null;
        }

        if (decoded) {
            const { id, username, roles, iat: issuedAt, exp: expiresAt } = decoded;
            return new DecodedToken(id, username, roles, issuedAt * 1000, expiresAt * 1000);
        }
    }
}

const intersect = function (arr, ...a) {
    return [ arr, ...a ].reduce((p, c) => p.filter(e => c.includes(e)));
};

class User {
    @observable token = undefined;
    @observable refreshToken = undefined;
    @observable roles = [];
    @observable decodedToken = undefined;
    @observable synced = undefined;
    @observable
    attributes = {
        profileComplete: false,
        agencyComplete: false,
        companyComplete: false,
        verified: false,
        approved: true,
        type: false,
        email: '',
    };

    constructor(store, token, refreshToken, attributes) {
        this.store = store;
        this.token = token;
        this.attributes = attributes;
        this.refreshToken = refreshToken;
        this.decodedToken = DecodedToken.fromString(token);
        this.roles = this.decodedToken.roles;
        autorun(() => {
            if (store.auth) {
                store.auth._saveStorage();
            }
        });
    }

    @action
    setProfileCompleted(status = true) {
        this.attributes.profileComplete = status;
    }

    @action
    setCompanyCompleted(status = true) {
        this.attributes.companyComplete = status;
    }

    @action
    setverified(verified = true) {
        this.attributes.verified = verified;
    }

    @action
    setapproved(approved = true) {
        this.attributes.approved = approved;
    }

    @action
    setAgencyCompleted(status = true) {
        this.attributes.agencyComplete = status;
    }

    @computed
    get allRoles() {
        let allRoles = [];

        if (this.store.dev.isFeatureEnabled('ignore-permissions')) {
            allRoles = [ getRoleName('super_admin') ];
        } else {
            allRoles = getAllRoles(
                this.decodedToken.roles instanceof Object ?
                    Object.values(this.decodedToken.roles) :
                    this.decodedToken.roles)
                .concat(getRoleName('anyone')
                );
        }

        return allRoles;
    }

    @computed
    get isSuperAdmin() {
        return this.allRoles.indexOf('ROLE_SUPER_ADMIN') >= 0;
    }

    @computed
    get id() {
        return this.decodedToken.id;
    }

    /**
     * Check is user has corresponding roles -
     * if roles = Array.<string> all = true : user has to have all roles from array => true
     * if roles = Array.<string> all = false : user has to have at least one role from array => true
     * if roles = Array.<Object> : user should have all roles from Object.include and none from Object.exclude
     * and if at least one object met criteria => true
     *
     * @param {Array.<Object>|Array.<string>} roles
     * @param {boolean} all
     * @returns {boolean}
     */
    hasRoles = (roles, all = true) => {
        if (this.isSuperAdmin || roles.length === 0) {
            return true;
        }

        if (!(roles instanceof Object)) {
            roles = [ roles ];
        }
        let includeRoles = [];
        let excludeRoles = [];

        if (!(roles[ 0 ] instanceof Object)) {
            includeRoles = roles.map(it => getRoleName(it));
            const includeIntersection = intersect(this.allRoles, includeRoles);
            return all ? includeIntersection.length >= includeRoles.length : includeIntersection.length > 0;
        }

        if (roles[ 0 ] instanceof Object) {
            let pass = false;
            roles.forEach(role => {
                includeRoles = (role.include || []).map(it => getRoleName(it));
                excludeRoles = (role.exclude || []).map(it => getRoleName(it));

                const includeIntersection = intersect(this.allRoles, includeRoles);
                const excludeIntersection = intersect(this.allRoles, excludeRoles);

                pass = pass ? pass : (
                    !excludeIntersection.length && includeIntersection.length >= includeRoles.length
                );
            });

            return pass;
        }
    };

    static fromJSON(store, { token, refresh_token: refreshToken, attributes }) {
        return new User(store, token, refreshToken, attributes);
    }

    static fromStore(store, { token, refreshToken, attributes }) {
        return new User(store, token, refreshToken, attributes);
    }
}

export class AuthenticationStore {
    @observable requiresTokenReissue = false;
    _actualUser = observable.box(undefined);

    constructor(store) {
        this.store = store;
        const storageUser = Storage.get(StorageKeys.user);
        if (storageUser) {
            try {
                this.user = User.fromStore(this.store, storageUser);
            } catch (e) {
                this.user = undefined;
            }
        }
        autorun(() => {
            this._saveStorage();
        });
    }

    isRecruiter = () => this.user?.attributes.type === 'recruiter';

    isUser = () => this.user?.attributes.type === 'user';

    @action
    logout() {
        this.user = undefined;

        if (window.analytics) {
            window.analytics.reset();
        }
    }

    @action
    setRequiresTokenReissue(requires) {
        requires = requires !== false;
        this.requiresTokenReissue = requires;
    }

    @action
    setUserFromServer(user) {
        this.user = User.fromJSON(this.store, user);
        this.user.synced = new Date();

        if (window.analytics) {
            window.analytics.identify(this.user.id);
        }
    }

    @computed
    get isLoggedIn() {
        return this.user !== undefined && this.user.refreshToken && this.user.decodedToken && this.user.decodedToken.isValid;
    }

    // We have to wrap te actual user in a box
    // so we can save it to local storage
    // and it's best to use a box from our testing
    // to enable mobx to properly compute changes
    @computed
    get user() {
        return this._actualUser.get();
    }

    set user(value) {
        if (value) {
            this._actualUser.set(value);
        } else {
            this._actualUser.set(undefined);
        }
    }

    _saveStorage() {
        if (this.user) {
            Storage.set(StorageKeys.user, { ...this.user, store: undefined });
            Sentry.configureScope(scope => {
                scope.setUser(this.user?.attributes);
            });
        } else {
            Sentry.configureScope(scope => {
                scope.setUser({});
            });
            Storage.remove(StorageKeys.user);
        }
    }
}
