/**
 * GTM event
 *
 * @typedef {Object} GTMEvent
 * @property {string} event
 * @property {string} [action]
 * @property {string} [label]
 * @property {*} [value]
 */

/**
 * Push GTM dataLayer events if dataLayer presented
 *
 * @param {GTMEvent} gtmEvent
 */
const gtmPush = (gtmEvent) => {
    if(typeof dataLayer !== 'undefined'){
        window.dataLayer.push(gtmEvent);
    }
};

export const GTM_EVENTS = {

    SEARCH: 'search',
    SEARCH_RESULTS: 'searchResults',
    VIEW_SEARCH_RESULT: 'viewSearchResult',
    REVEAL_PHONE: 'revealPhone',

    CLAIM_PROFILE: 'claimProfile',
    SIGN_UP_EMPLOYER: 'signUpEmployer',

    CREATE_PLACEMENT: 'createPlacement',

    POST_REVIEW: 'postReview',
    SHARE_REVIEW: 'shareReview',

    CREATE_JOB: 'createJob',
    APPLY_JOB: 'applyJob',
    ENGAGE_WITH_RECRUITER: 'engageWithRecruiter',
    SUBMIT_CANDIDATE: 'submitCandidate',
    SUBMIT_OFFER: 'submitOffer',
    ACCEPT_OFFER: 'acceptOffer',
};

export const GTM_ACTIONS = {
    OFFER_BY_EMPLOYER: 'send offer by employer',
    OFFER_BY_RECRUITER: 'send offer by recruiter',
    CLAIM_RECRUITER: 'claim recruiter',
    REVIEW: 'review',
    SEARCH: 'search',
    POST_REVIEW_CANDIDATE: 'post review candidate',
    POST_REVIEW_EMPLOYER: 'post review employer',
    PLACEMENT: 'placement',
    JOB: 'job',
};

export default gtmPush;
