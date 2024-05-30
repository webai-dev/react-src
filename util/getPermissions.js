/**
 * Check is current user has access or not - return true if access is granted and false if not
 *
 * @param {Object} store - mobx store
 * @param {Array} roles - array of strings
 * @param {bool} [noUser] - pass true if should be visible only by not logged users
 * @returns {boolean}
 */
const getPermissions = (store, roles, noUser) => {
    if (noUser) {
        return !store.auth.user;
    }
    if (!roles || roles.length === 0) {
        return true;
    }

    return store.auth.user && store.auth.user.hasRoles(roles);
};

export default getPermissions;
