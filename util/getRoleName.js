const getRoleName = (role) => {
    if (!role) {
        return 'UNKNOWN';
    }
    return `ROLE_${role.toUpperCase()}`;
};

export default getRoleName;
