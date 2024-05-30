export const isDevelopment = process.env.NODE_ENV === 'development';
export const THROTTLE_TIME = 400;
export const QUERY_LINKEDIN_ERROR = 'linkedInError';
export const QUERY_REDIRECT_SUBSCRIPTION = {
    _NAME: 'redirect',
    SUBSCRIPTION: 'subscription',
};
export const REVIEW_QUERY_TYPE = {
    _NAME: 'type',
    ALL: 'all',
    EMPLOYER: 'employer',
    CANDIDATE: 'candidate',
};
export const JOBS_QUERY_TYPE = {
    _NAME: 'type',
    ALL: 'all',
    CLOSED: 'closed',
    DRAFT: 'draft',
    ENGAGED: 'engaged',
    FILED: 'filed',
    OPEN: 'open',
    PENDING: 'pending',
    PENDING_OPEN: 'pending_open',
    WITHDRAWN: 'withdrawn',
};
export const PLACEMENT_QUERY_TYPE = {
    _NAME: 'type',
    ALL: 'all',
    REVIEWED: 'reviewed',
    UNREVIEWED: 'unreviewed',
};
export const CAMPAIGN_QUERY_TYPE = {
    _NAME: 'type',
    ALL: 'all',
    ACTIVE: 'active',
    IN_ACTIVE: 'inActive',
};
export const CAMPAIGN_RESPONSE_TYPE = {
    _NAME: 'type',
    ALL: 'all',
    EMPLOYER: 'employer',
    CANDIDATE: 'candidate',
};
export const CAMPAIGN_SCORES_TYPE = {
    _NAME: 'score',
    ALL: 'all',
    PASSIVE: 'passive',
    PROMOTER: 'promoter',
    DETRACTOR: 'detractor',
};
export const PROFILE_MODAL = {
    _NAME: 'modal',
    SUCCESS: 'claimed',
    FAILURE: 'failed-claim',
    REVIEW: 'review',
    CONTACT: 'contact',
    CLAIM: 'claim',
};
export const PARAM_SUBSCRIPTION_SUCCESS = {
    _NAME: 'subscription-success',
    TRUE: '1',
};
export const PARAM_TEMPLATE = {
    _NAME: 'tab',
    TRUE: 'template',
};
export const TEAM_TAB = {
    _NAME: 'tab',
    ACTIVE: 'active',
    REQUEST: 'request',
};
export const REVIEWS_TAB = {
    _NAME: 'tab',
    VERIFIED: 'verified',
    REQUESTED: 'requested',
    PENDING: 'pending',
};
export const JOB_TAB = {
    _NAME: 'tab',
    JOB_DESCRIPTION: 'job-description',
    SEARCH_TYPE: 'search-type',
    RECRUITERS: 'recruiters',
    PUBLISH: 'publish',
};
export const PARAM_RECRUITERS_TAB = {
    _NAME: 'tab',
    RECENT: 'recent',
    FAVOURITE: 'favourite',
    PSA: 'psa',
};
export const TEAM_TAB_INVITE = 'invite';
export const PARAM_PLACEMENT_ID = 'placementId';
export const PARAM_REVIEW_ID = 'reviewId';
export const PARAM_REVIEW_TEMPLATE_ID = 'reviewTemplateId';
export const JOB_ID = 'jobId';
export const PARAM_STATEMENT_ID = 'statementId';
export const CLONE_JOB_ID = 'cloneJobId';
export const CAMPAIGN_ID = 'campaignId';
export const RECIPIENT_ID = 'recipientId';
export const PARAM_GOOGLE_REVIEW = 'isGoogleReview';
export const PARAM_HASH = 'hash';
export const PARAM_SLUG = 'slug';
export const PARAM_LINKEDIN_SLUG = 'linkedinSlug';
export const PARAM_PLACEMENT_TYPE = {
    _NAME: 'placementType',
    VISIBLE: 'visible',
    INCOMPLETE: 'incomplete',
    INVITE_NEEDED: 'invite_needed',
};

export const ROUTES = {
    EXTERNAL: 'https://sourcr.com/',
    EXTERNAL_RECRUITERS: 'https://sourcr.com/for-recruiters/',
    EXTERNAL_TERMS_AND_CONDITIONS: 'https://sourcr.com/terms-and-conditions/',

    ROOT: '/',
    ADMIN_PANEL: '/panel-admin',
    SUBSCRIPTION: '/subscription',
    SUBSCRIPTION_SUCCESS: '/subscription/success',
    LOGOUT: '/logout',
    RESTORE_PASSWORD: '/restore-password',
    SIGNUP: '/signup',
    SIGNUP_INFO: '/signup-info',
    SEARCH: '/search',
    DASHBOARD: '/dashboard/jobs',
    DASHBOARD_REVIEWS: '/dashboard',
    DASHBOARD_LEADER_BOARD: '/dashboard/leader-board',
    DASHBOARD_NPS: '/dashboard/nps',
    MARKETPLACE: '/marketplace',
    JOB_NEW: `/jobs/new/:${ JOB_TAB._NAME }(${
        JOB_TAB.JOB_DESCRIPTION }|${
        JOB_TAB.SEARCH_TYPE }|${
        JOB_TAB.RECRUITERS }|${
        JOB_TAB.PUBLISH })?`,
    JOB_EDIT: `/jobs/:${ JOB_ID }/edit/:${
        JOB_TAB._NAME }(${
        JOB_TAB.JOB_DESCRIPTION }|${
        JOB_TAB.SEARCH_TYPE }|${
        JOB_TAB.RECRUITERS }|${
        JOB_TAB.PUBLISH })?`,
    JOBS: '/jobs',
    MY_JOBS: '/my-jobs',
    BLOG: '/blog',
    BLOG_NEW: '/blog/new',
    WIDGETS: '/tools/widgets',
    SOCIAL_CUSTOM: '/tools/socialCustom',
    CAPABILITY_STATEMENT: '/tools/capabilityStatement',
    INVITE_SETTINGS: '/tools/inviteSettings',
    CAMPAIGN_SETTINGS: '/tools/campaignSettings',
    WIDGET: '/widget',
    REVIEWS: `/reviews/:${
        REVIEWS_TAB._NAME }(${ REVIEWS_TAB.VERIFIED }|${ REVIEWS_TAB.REQUESTED }|${ REVIEWS_TAB.PENDING
        })`,
    PLACEMENTS: `/placements/:${ PARAM_PLACEMENT_TYPE._NAME }(${
        PARAM_PLACEMENT_TYPE.VISIBLE }|${
        PARAM_PLACEMENT_TYPE.INVITE_NEEDED }|${
        PARAM_PLACEMENT_TYPE.INCOMPLETE })`,
    PLACEMENTS_NEW: '/placement/new',
    PLACEMENTS_EDIT: '/placement/:id/edit',
    PLACEMENTS_FOR_REVIEW: `/placement/review/:${ PARAM_REVIEW_ID }`,

    CAMPAIGNS: '/campaigns',
    CAMPAIGNS_RESPONSES: '/campaigns/responses',
    CAMPAIGNS_NEW: '/campaign/new',
    CAMPAIGNS_EDIT: `/campaign/:${ CAMPAIGN_ID }/edit`,
    CAMPAIGNS_RESPONSE: `/survey/:${ CAMPAIGN_ID }/:${RECIPIENT_ID}?`,
    CAMPAIGNS_RESPONSE_SUCCESS: `/survey/:${ RECIPIENT_ID }/success/:${PARAM_GOOGLE_REVIEW}?`,

    REVIEW_PENDING: `/recruiter/:${ PARAM_SLUG }/review`,
    REVIEW_SUCCESS: `/recruiter/:${ PARAM_SLUG }/review/completed/:${PARAM_GOOGLE_REVIEW}?`,
    CANDIDATE_REVIEW: `/candidate-review/:${ PARAM_PLACEMENT_ID }/:${ PARAM_HASH }`,
    EMPLOYER_REVIEW: `/employer-review/:${ PARAM_PLACEMENT_ID }/:${ PARAM_HASH }`,

    COMPANY_PROFILE_EDIT: '/company-profile/edit',
    COMPANY_USERS: `/company/users/:${ TEAM_TAB._NAME }(${ TEAM_TAB.ACTIVE }|${ TEAM_TAB.REQUEST })/:id?`,

    USER_PROFILE_EDIT: '/user-profile/edit',
    STATEMENT_PDF_URL: `/capabilityStatement/:${ PARAM_STATEMENT_ID }`,

    RECRUITER_PROFILE: `/recruiter/:${ PARAM_SLUG }/:${
        PROFILE_MODAL._NAME }(${
        PROFILE_MODAL.SUCCESS }|${
        PROFILE_MODAL.FAILURE }|${
        PROFILE_MODAL.CLAIM }|${
        PROFILE_MODAL.CONTACT }|${
        PROFILE_MODAL.REVIEW })?/:${
        PARAM_REVIEW_ID }?/:${ PARAM_TEMPLATE._NAME }(${ PARAM_TEMPLATE.TRUE })?/:${ PARAM_REVIEW_TEMPLATE_ID }?`,
    // used to redirect on claiming process but route is processed by backend
    REVIEW_IMAGE: `/${ PROFILE_MODAL.REVIEW }/:${ PARAM_REVIEW_ID
        }/:${ PARAM_TEMPLATE._NAME }(${ PARAM_TEMPLATE.TRUE })?/:${ PARAM_REVIEW_TEMPLATE_ID }?`,
    RECRUITER_PROFILE_CLAIM: `/recruiter/:${ PARAM_SLUG }/claim/:${ PARAM_LINKEDIN_SLUG }`,
    STATEMENT: `/recruiter/:${ PARAM_SLUG }/statement/:${ PARAM_STATEMENT_ID }`,
    STATEMENT_PREVIEW: '/statement/preview',
    RECRUITER_PROFILE_EDIT: '/recruiter/edit',
    RECRUITER_PROFILE_PREVIEW: '/recruiter/preview',
    RECRUITERS: `/recruiters/:${ PARAM_RECRUITERS_TAB._NAME }(${
        PARAM_RECRUITERS_TAB.RECENT }|${ PARAM_RECRUITERS_TAB.FAVOURITE }|${ PARAM_RECRUITERS_TAB.PSA })?`,
    RECRUITERS_FAVOURITE: '/recruiters/favourite',

    AGENCY_PROFILE: `/agency/:${ PARAM_SLUG }/:${
        PROFILE_MODAL._NAME }(${
        PROFILE_MODAL.SUCCESS }|${
        PROFILE_MODAL.FAILURE }|${
        PROFILE_MODAL.CLAIM }|${
        PROFILE_MODAL.CONTACT }|${
        PROFILE_MODAL.REVIEW })?/:${
        PARAM_REVIEW_ID }?/:${ PARAM_TEMPLATE._NAME }(${ PARAM_TEMPLATE.TRUE })?/:${ PARAM_REVIEW_TEMPLATE_ID }?`,
    AGENCY_PROFILE_CLAIM: `/agency/:${ PARAM_SLUG }/claim`, // used to redirect on claiming process but route is
                                                            // processed by backend
    AGENCY_PROFILE_EDIT: '/agency/edit',
    AGENCY_PROFILE_PREVIEW: '/agency/preview',
    AGENCY_RECRUITERS: `/agency/recruiters/:${ TEAM_TAB._NAME }(${ TEAM_TAB.ACTIVE }|${ TEAM_TAB.REQUEST })/:id?`,

    JOBADDER: '/jobadder/connect',
    GOOGLE: '/google/connect',
    JOBADDER_LOGIN: '/login/connect/jobadder',
    GOOGLE_LOGIN: '/login/connect/google',
};
export const JOB_TYPES = {
    PERMANENT: 'permanent',
    TEMPORARY: 'temp',
    FIXED_TERM: 'fixed-term',
};

export const LOCAL_STORAGE_KEYS = {
    SEND_NPS_CAMPAIGN_RESPONSE: 'campaignResponse',
    RECRUITER_PROFILE_PREVIEW: '/recruiter-profile/preview',
    STATEMENT_PREVIEW: '/recruiter-profile/preview',
    AGENCY_PROFILE_PREVIEW: '/agency/preview',
    HIDE_PENDING_REVIEWS_WARNING: 'isHidePendingReviewsWarning',
    HIDE_TOOLS_SETTING_INFO: 'isHideToolsSettingInfo',
};

export const IDS = {
    BACKGROUND_IMAGE: 'idForBackgroundImage',
};

export const KEYS = {
    ESC: 'Escape',
    ENTER: 'Enter',
    SPACE: ' ',
};

export const JobFilters = {
    all: 'all',
    draft: 'draft',
    active: 'active',
    closed: 'closed',
    pending: 'pending',
};
JobFilters.allFilters = [
    JobFilters.draft,
    JobFilters.active,
    JobFilters.closed,
    JobFilters.pending,
];

export const RecruiterFilters = {
    recent: 'recent',
    psa: 'psa',
    favourite: 'favourite',
};
RecruiterFilters.allFilters = [
    RecruiterFilters.recent,
    RecruiterFilters.psa,
    RecruiterFilters.favourite,
];

export const RatingFilters = {
    mandatory: 'mandatory',
    optional: 'optional',
};
RatingFilters.allFilters = [
    RatingFilters.mandatory,
    RatingFilters.optional,
];

// if production   https://app.sourcr.com
// if stage        http://sourcr-staging-740740721.ap-southeast-2.elb.amazonaws.com
// if dev          http://sourcr-dev-256597455.ap-southeast-2.elb.amazonaws.com
// if local        dev or stage

export const STAGE_URL = 'http://sourcr-dev-256597455.ap-southeast-2.elb.amazonaws.com';
// export const STAGE_URL = 'http://sourcr-staging-740740721.ap-southeast-2.elb.amazonaws.com';
let BaseAPiPath = process.env.SOURCR_API_PATH || STAGE_URL;
export const isLocalBuild = process.env.LOCAL_BUILD;
export { BaseAPiPath };
export const BaseApiHost = BaseAPiPath;

export const isProduction = BaseAPiPath.includes('app.sourcr.com');

export const ApiPaths = {
    graphql: `${ BaseAPiPath }/graphql/`,
    login: `${ BaseAPiPath }/login/login_check`,
    jobCategories: `${ BaseAPiPath }/job-categories`,
    companyNames: `${ BaseAPiPath }/company-names`,
    refreshToken: `${ BaseAPiPath }/token/refresh`,
    register: `${ BaseAPiPath }/register`,
    tokenLogin: `${ BaseAPiPath }/login/token`,
    resetPassword: `${ BaseAPiPath }/login/reset_password`,
};
export const StorageKeys = {
    user: 'user',
    activeJob: 'active_job',
    devFeatures: 'developer.features_enabled',
    switchUser: 'super_admin.switch_user',
};

export const SearchTypes = {
    EXCLUSIVE: 'exclusive',
    NETWORK: 'network',
};
export const INTEGRATIONS = {
    JOBADDER: 'jobadder',
    GOOGLE: 'google'
};

export const WIDGET_THEME = {
    DARK: 'dark',
    LIGHT: 'light',
};

export const WIDGET_TYPE = {
    SINGLE: 'single',
    DOUBLE: 'double',
    ASIDE: 'aside',
    FOOTER: 'footer'
};

export const widgetAppId = isLocalBuild ? 'app' : 'sourcrWidgetApp';// TODO CHANGE THAT!!!
export const widgetModalId = isLocalBuild ? 'modal' : 'sourcrWidgetModal'; // TODO CHANGE THAT!!!
export const WIDGET_VARS = 'WIDGET_VARS'; // TODO CHANGE THAT!!!

export const CandidateStatusColorMap = {
    all: 'green',
    submitted: 'yellow',
    interviewing: 'orange',
    offered: 'green',
    withdrawn: 'red',
    rejected: 'red',
};
export const MaxUploadSize = 20 * 1000000;

export const SEARCH_CATEGORY_TYPES = {
    name: 'type',
    values: [ // BE CAREFUL CHANGING ORDER!!! ORDER IS IMPORTANT IN A FEW COMPONENTS
        'recruiter',
        'agency',
        'all',
    ],
};
export const PLACEMENTS_MODALS = {
    _NAME: 'modal',
    JOBADDER: 'jobadder',
};
export const SEARCH_ROLE_TYPES = {
    label: 'Role types',
    name: 'roleTypes',
    values: [
        'Permanent',
        'Contract',
    ],
};

export const SEARCH_LOCATION_TYPES = {
    label: 'Location',
    name: 'postcode',
    values: [
        { value: '2000', label: 'New South Wales' },
        { value: '3000', label: 'Victoria' },
        { value: '4000', label: 'Queensland' },
        { value: '5000', label: 'South Australia' },
        { value: '6000', label: 'Western Australia' },
        { value: '7000', label: 'Tasmania' },
        { value: '2600', label: 'ACT' },
    ],
};

export const SEARCH_SPECIALIZATIONS_TYPES = {
    label: 'Specialisations',
    name: 'specialisations',
    values: [
        'Construction',
        'Customer Service',
        'Digital',
        'Finance',
        'Financial Services',
        'Healthcare',
        'Hospitality',
        'Human Resources',
        'Legal',
        'Manufacturing',
        'Marketing',
        'Engineering',
        'Office Support & Administration',
        'Other',
        'Procurement',
        'Property',
        'Retail',
        'Sales',
        'Strategic Consultancy',
        'Supply Chain',
        'Technology',
        'Transactional Finance',
    ],
};

export const MONTH_LABELS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];
