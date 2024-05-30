import { roleHierachy } from '../constants';

export const getAllRoles = (roles, seen = []) => {
    const theRoles = roles || [];
    const reducedRoles = theRoles.reduce((roleList, role) => {
        if (seen.indexOf(role) >= 0) {
            return roleList;
        }

        seen.push(role);
        roleList = roleList.concat([role]);

        if (typeof roleHierachy[role] !== 'undefined') {
            roleList = roleList.concat(roleHierachy[role]);
            const childRolesFinal = roleHierachy[role].reduce((childRoles, childRole) => {
                return childRoles.concat(getAllRoles([childRole]));
            }, []);
            roleList = roleList.concat(childRolesFinal);
        }
        return roleList;
    }, []);
    return Array.from(new Set(reducedRoles));
};
