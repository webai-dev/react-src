import getRoleName from '../util/getRoleName';

export const roleNames = (...names) => names.map(name => getRoleName(name));

const roleFactory = roleMap => {
    return Object.keys(roleMap).reduce(
        (roles, type) => {
            let mapper = role => getRoleName(`${type}_${role}`);

            if (type === '_raw') {
                mapper = role => getRoleName(`${role}`);
            }
            return roles.concat(roleMap[ type ].map(mapper));
        },
        [],
    );
};

export const roleHierarchy = {
    [getRoleName('super_admin')]: roleNames(
        'recruiter',
        'user',
        'admin',
    ),
    [getRoleName('admin')]: roleNames(
        'recruiter',
        'user',
    ),
    [getRoleName('recruiter_admin')]: roleFactory({
        agency: [ 'edit' ],
        recruiter: [ 'invite' ],
        recruiter_user: [
            'invite',
            'list',
        ],
        widget: [
            'view'
        ],
    }),
    [getRoleName('recruiter_freelancer')]: roleFactory({
        widget: [
            'view'
        ],
    }),
    [getRoleName('team_subscription')]: roleNames('individual_subscription'),
    [getRoleName('recruiter')]: roleFactory({
        marketplace: [
            'job_view',
            'job_list',
        ],
        job: [
            'view',
            'apply',
            'withdraw',
            'list_mine',
            'accept_invite',
            'reject_invite',
        ],
        job_application: [
            'withdraw',
            'create',
        ],
        job_interview: [
            'accept',
            'accept_reschedule',
            'reschedule',
            'details',
        ],
        job_offer: [
            'accept',
            'reject',
        ],
        recruiter: [
            'view',
            'placements',
        ],
        review: [
            'list',
        ],
        recruiter_profile: [ 'edit' ],
        profile: [
            'edit',
            'view',
        ],
        _raw: [ 'dashboard', 'logged' ],
    }),
    [getRoleName('user_admin')]: roleFactory({
        job: [ 'delete' ],
        company: [ 'edit' ],
        user: [
            'list',
            'view',
            'invite',
        ],
    }),
    [getRoleName('user')]: roleFactory({
        job: [
            'view',
            'create',
            'list',
            'edit',
            'publish',
        ],
        job_application: [
            'schedule_interview',
            'offer',
            'reject',
        ],
        job_interview: [
            'accept_reschedule',
            'reschedule',
            'details',
            'completed',
            'cancel',
        ],
        job_offer: [
            'create',
            'withdraw',
        ],
        candidate: [
            'list',
            'view',
        ],
        recruiter: [
            'list',
            'view',
            'favourite',
        ],
        profile: [
            'edit',
            'view',
        ],
        user_profile: [ 'edit' ],
        _raw: [ 'dashboard', 'logged' ],
    }),
};

/**
 * Get user roles and return all roles available for those roles corresponding to roleHierarchy
 *
 * @param {Array} roles - not sure it is Array (maybe some immutable structure with "reduce" method)
 * @return {Array}
 */
const getAllRoles = (roles = []) => {
    return roles.reduce(
        (allRolesRaw, role) => {
            return [
                role,
                // new Set will prevent duplications of array items
                ...new Set(allRolesRaw.concat(roleHierarchy[ role ]))
            ];
        },
        [],
    );
};

export default getAllRoles;
