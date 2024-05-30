/* eslint-disable */
import { ClientFunction, Selector, Role } from 'testcafe';
import TEST_IDS                           from './testIds';
import { REVIEWS_TAB, ROUTES }            from '../constants';
import { generatePath, matchPath }        from 'react-router-dom';
import {
    adminPassword,
    adminEmail,
    testEmail,
    emailSourcr,
    emailSourcrPassword,
}                                         from './credentials';

fixture`Getting Started`;

/**
 *
 * @param {string} pathName - e.g. from document.location.pathname
 * @param {string} route - value from ROUTES constant object
 * @returns {boolean}
 */
const validateRoute = (pathName, route) => !!matchPath(pathName, {
    path: route,
    exact: true,
    strict: false
});

const selectDataTest = (dataTest, index) => index === undefined ? `[data-test="${ dataTest }"]` : `[data-test="${ dataTest }-${ index }"]`;

const getPathName = ClientFunction(() => document.location.pathname);

const testSlug = Math.ceil(Math.random() * 1000);

const urlToTest = 'http://localhost:8080';
const recruiterEmail = `R${ testSlug }C@shakespeare.com`;
const recruiterPassword = 'password';
const employerEmail = `J${ testSlug }M@shakespeare.com`;
const employerPassword = 'password';
const JOB_TITLE = 'E2E JOB TITLE' + testSlug;
const PLACEMENT_TITLE = 'E2E TEST PLACEMENT TITLE' + testSlug;
const REVIEW_TITLE = 'E2E TEST REVIEW TITLE' + testSlug;
const EMPLOYER_REVIEW_TITLE = 'E2E TEST EMPLOYER REVIEW' + testSlug;

console.log('\x1b[35m',recruiterEmail);
console.log('\x1b[35m',recruiterPassword);
console.log('\x1b[35m',employerEmail);
console.log('\x1b[35m',employerPassword);
console.log('\x1b[35m',JOB_TITLE);

const adminPanelUser = Role('http://sourcr-dev-256597455.ap-southeast-2.elb.amazonaws.com/admin', async t => {
    await t
        .typeText('#username', adminEmail, { paste: true })
        .typeText('#password', adminPassword, { paste: true })
        .click('[type=submit]');
}, { preserveUrl: true });

const recruiterUser = Role(urlToTest, async t => {
    await t
        .typeText('#email', recruiterEmail, { paste: true })
        .typeText('#password', recruiterPassword, { paste: true })
        .click(selectDataTest(TEST_IDS.SIGN_IN));
}, { preserveUrl: true });

const employerUser = Role(urlToTest, async t => {
    await t
        .typeText('#email', employerEmail, { paste: true })
        .typeText('#password', employerPassword, { paste: true })
        .click(selectDataTest(TEST_IDS.SIGN_IN));
}, { preserveUrl: true });

const emailSourcrUser = Role('https://accounts.google.com/signin', async t => {
    await t
        .typeText('#identifierId', emailSourcr, { paste: true })
        .click('#identifierNext')
        .typeText('[name="password"]', emailSourcrPassword, { paste: true })
        .click('#passwordNext');
}, { preserveUrl: true });

test('Create recruiter via admin', async t => {
    await t
        .useRole(adminPanelUser)
        .click(Selector('a')
            .withText('Recruiter'))
        .click(Selector('a')
            .withText('Add Recruiter'))
        .typeText('#recruiter_firstName', 'Romeo', { paste: true })
        .typeText('#recruiter_lastName', 'Cappelletti', { paste: true })
        .typeText('#recruiter_username', recruiterEmail, { paste: true })
        .typeText('#recruiter_plainPassword', recruiterPassword, { paste: true, replace: true })
        .typeText('#recruiter_email', recruiterEmail, { paste: true })
        .click('#recruiter_postcode')
        .click('#recruiter_mpoApproved')
        .click('#recruiter_claimed')
        .click('#recruiter_verified')
        .click('[type=submit]')
        .expect(Selector(`[title="${ recruiterEmail }"]`).exists)
        .ok(`check: ${ recruiterEmail }. Recruiter may already exist`);
});

test('Sign up as employer and Edit employer password', async t => {
    await t
        .navigateTo(urlToTest)
        .click(selectDataTest(TEST_IDS.SIGN_UP_INFO_ROUTE))
        .click(selectDataTest(TEST_IDS.SIGN_UP_ROUTE))
        .typeText('#firstName', 'Juliet', { paste: true })
        .typeText('#lastName', 'Montague', { paste: true })
        .typeText('#email', employerEmail, { paste: true })
        .typeText('#companyName', 'House of Montague', { paste: true })
        .typeText('#contactNumber', '7778343', { paste: true })
        .click(selectDataTest(TEST_IDS.SIGN_UP))
        .click(selectDataTest(TEST_IDS.EMPLOYER_EDIT_ROUTE), { offsetX: 1 })
        .typeText('#jobTitle', 'universalLoooooveeeee', { paste: true })
        .click('#password')
        .pressKey('ctrl+a ' + employerPassword.split('').join(' ')) // That fixes safari password suggestion
        .click('#passwordConfirm')
        .pressKey('ctrl+a ' + employerPassword.split('').join(' ')) // That fixes safari password suggestion
        .click(selectDataTest(TEST_IDS.EDIT_EMPLOYER))
        .expect(Selector(`.${ TEST_IDS.EDIT_EMPLOYER_SUCCESS }`).exists)
        .ok(`check: ${ employerEmail }. Employer may already exist`);
});

test('Log in as recruiter', async t => {
    await t
        .useRole(recruiterUser);

    const pathName = await getPathName();

    await t
        .expect(validateRoute(pathName, ROUTES.RECRUITER_PROFILE_EDIT))
        .ok('Either failed to login or redirect route was changed');
});

test('Log in as employer', async t => {
    await t
        .useRole(employerUser);

    const pathName = await getPathName();

    await t
        .expect(validateRoute(pathName, ROUTES.DASHBOARD))
        .ok('Either failed to login or redirect route was changed');
});
test('Edit recruiter', async t => {
    await t
        .useRole(recruiterUser)
        .click(selectDataTest(TEST_IDS.TUTORIAL_1))
        .click(selectDataTest(TEST_IDS.TUTORIAL_2))
        .click(selectDataTest(TEST_IDS.TUTORIAL_3))
        .setFilesToUpload('[type="file"]', [
            '/Users/arseniyigorevich/Documents/avatar-placeholder.png',
        ])
        .click(selectDataTest(TEST_IDS.SAVE_IMAGE))
        .click(selectDataTest(TEST_IDS.SPECIALISATIONS_SELECT, 'Other'))
        .typeText('#postcode', 'sydney', { paste: true, replace: true })
        .click(selectDataTest('2020'))
        .typeText('#jobTitle', 'RJob title', { paste: true, replace: true })
        .typeText('#contactNumber', '123456789', { paste: true, replace: true })
        .typeText('#linkedinUrl', 'https://www.linkedin.com/in/RCshakespeare', { paste: true, replace: true })
        .typeText('#aboutMe', 'I am a recruiter!', { paste: true, replace: true })
        .click(selectDataTest(TEST_IDS.RECRUITER_PROFILE))
        .expect(Selector(`.${ TEST_IDS.EDIT_RECRUITER_PROFILE_SUCCESS }`).exists)
        .ok('Recruiter profile wasn\'t edited');
});

test('Verify employer by admin', async t => {
    await t
        .useRole(adminPanelUser)
        .click(Selector('a')
            .withExactText('User'))
        .typeText('[name="query"]', employerEmail, { paste: true })
        .click('[type="submit"]')
        .click('[data-label="Verified"]');
});


test('Create placement', async t => {
    await t
        .useRole(recruiterUser)
        .click(selectDataTest(TEST_IDS.PLACEMENT_ROUTE), { offsetX: 1 })
        .click(selectDataTest(TEST_IDS.PLACEMENT_NEW_ROUTE))
        .typeText('#jobTitle', PLACEMENT_TITLE, { paste: true })
        .typeText('#companyName', 'Sage the world', { paste: true })
        .typeText('#locationPostcode', 'sydney', { paste: true })
        .click(selectDataTest('2020'))
        .click(selectDataTest(TEST_IDS.CATEGORY_SELECT))
        .click(selectDataTest('Construction'))
        .click(selectDataTest(TEST_IDS.INDUSTRY_SELECT))
        .click(selectDataTest('Accounting'))
        .click(selectDataTest(TEST_IDS.JOB_TYPE_SELECT))
        .click(selectDataTest('Permanent'))
        .click(selectDataTest(TEST_IDS.MONTH_SELECT))
        .click(selectDataTest(TEST_IDS.MONTH_SELECT, 1))
        .typeText('#fee', '12', { paste: true })
        .typeText('#salary', '70000', { paste: true })
        .typeText('#employerFirstName', 'Abraham', { paste: true })
        .typeText('#employerLastName', 'Lincoln', { paste: true })
        .typeText('#employerEmail', testEmail, { paste: true })
        .typeText('#candidateFirstName', 'Christopher', { paste: true })
        .typeText('#candidateLastName', 'Columbus', { paste: true })
        .typeText('#candidateEmail', testEmail, { paste: true })
        .click(selectDataTest(TEST_IDS.PLACEMENT))
        .expect(Selector(`.${ TEST_IDS.CREATE_PLACEMENT_SUCCESS }`).exists)
        .ok();
});

test('Update placement to fixed-term', async t => {
    await t
        .useRole(recruiterUser)
        .click(selectDataTest(TEST_IDS.PLACEMENT_ROUTE), { offsetX: 1 })
        .click(selectDataTest(TEST_IDS.PLACEMENT_EDIT_ROUTE, 0))
        .click(selectDataTest(TEST_IDS.JOB_TYPE_SELECT))
        .click(selectDataTest('Fixed-term'))
        .click(selectDataTest(TEST_IDS.PLACEMENT))
        .expect(Selector(`.${ TEST_IDS.UPDATE_PLACEMENT_SUCCESS }`).exists)
        .ok();
});

test('Update placement to temporary', async t => {
    await t
        .useRole(recruiterUser)
        .click(selectDataTest(TEST_IDS.PLACEMENT_ROUTE), { offsetX: 1 })
        .click(selectDataTest(TEST_IDS.PLACEMENT_EDIT_ROUTE, 0))
        .click(selectDataTest(TEST_IDS.JOB_TYPE_SELECT))
        .click(selectDataTest('Temporary'))
        .click(selectDataTest(TEST_IDS.JOB_RATE_SELECT))
        .click(selectDataTest('Hourly'))
        .typeText('#rate', '120', { paste: true })

        .click(selectDataTest(TEST_IDS.PLACEMENT))
        .expect(Selector(`.${ TEST_IDS.UPDATE_PLACEMENT_SUCCESS }`).exists)
        .ok();
});


test('Open and post review', async t => {
    await t
        .useRole(emailSourcrUser)
        .navigateTo('https://mail.google.com/mail/u/0/#all')
        .navigateTo('https://mail.google.com/mail/u/0/#all')
        .click('[role="main"] tr')
        .setNativeDialogHandler(() => true)
        .click(Selector('a')
            .withText('click here'))
        .click('#app', { offsetX: 1, offsetY: 1 }); // waiting for page load

    const pathName = await getPathName();

    const isEmployer = validateRoute(pathName, ROUTES.EMPLOYER_REVIEW);

    await t
        .navigateTo(urlToTest + pathName)
        .click(selectDataTest(TEST_IDS.NPS_SCORE_NUMBER, Math.floor(Math.random() * 10)));

    if (isEmployer) {
        await t
            .click(selectDataTest(TEST_IDS.RATING_CANDIDATE_QUALITY_NUMBER, Math.floor(Math.random() * 4) + 1))
            .click(selectDataTest(TEST_IDS.RATING_INDUSTRY_NUMBER, Math.floor(Math.random() * 4) + 1))
            .click(selectDataTest(TEST_IDS.RATING_COMMUNICATION_NUMBER, Math.floor(Math.random() * 4) + 1))
            .click(selectDataTest(TEST_IDS.RATING_RESPONSIVENESS_NUMBER, Math.floor(Math.random() * 4) + 1));
    } else {
        await t
            .click(selectDataTest(TEST_IDS.RATING_CANDIDATE_NUMBER, Math.floor(Math.random() * 4) + 1));
    }
    await t
        .typeText('#title', REVIEW_TITLE, { paste: true })
        .typeText('#review', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi architecto at?', { paste: true })
        .click(selectDataTest(TEST_IDS.REVIEW));

    const successPathName = await getPathName();

    await t
        .expect(validateRoute(successPathName, ROUTES.REVIEW_SUCCESS))
        .ok('Either failed to post review or redirect route was changed');
});

test('Check that posted review is displayed', async t => {
    await t
        .useRole(recruiterUser)
        .click(selectDataTest(TEST_IDS.SEE_NEW_REVIEW))
        .click(selectDataTest(TEST_IDS.REVIEWS_ROUTE), { offsetX: 1 })
        .expect(Selector(selectDataTest(TEST_IDS.REVIEW_TITLE))
            .withText(REVIEW_TITLE).exists)
        .ok('Posted review wasn\'t displayed');
});

const CANDIDATE_REVIEW_TITLE = 'E2E TEST CANDIDATE REVIEW' + testSlug;

test('Create candidate review from url and check it is exist', async t => {
    await t
        .useRole(recruiterUser)
        .click(selectDataTest(TEST_IDS.REVIEWS_ROUTE), { offsetX: 1 })
        .click(selectDataTest(TEST_IDS.REVIEW_URL))
        .click('#app', { offsetX: 1, offsetY: 1 }); // waiting for page load

    const reviewPathName = await getPathName();
    await t
        .navigateTo(urlToTest + reviewPathName)
        .click(selectDataTest(TEST_IDS.REVIEW_TYPE_SELECT))
        .click(selectDataTest('Candidate'))
        .typeText('#firstName', 'Christopher', { paste: true })
        .typeText('#lastName', 'Columbus', { paste: true })
        .click(selectDataTest(TEST_IDS.NPS_SCORE_NUMBER, Math.floor(Math.random() * 10)))
        .click(selectDataTest(TEST_IDS.RATING_CANDIDATE_NUMBER, Math.floor(Math.random() * 4) + 1))
        .typeText('#email', 'Columbus@Christopher.com', { paste: true })
        .typeText('#title', CANDIDATE_REVIEW_TITLE, { paste: true })
        .typeText('#review', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi architecto at?', { paste: true })
        .click(selectDataTest(TEST_IDS.REVIEW));

    const successPathName = await getPathName();

    await t
        .expect(validateRoute(successPathName, ROUTES.REVIEW_SUCCESS))
        .ok('Either failed to post review or redirect route was changed')
        .navigateTo(generatePath(ROUTES.REVIEWS, { [ REVIEWS_TAB._NAME ]: REVIEWS_TAB.PENDING }))
        .expect(Selector(selectDataTest(TEST_IDS.REVIEW_TITLE))
            .withText(CANDIDATE_REVIEW_TITLE).exists)
        .ok('Pending candidate review wasn\'t displayed');
});

test('Create employer review from url and check it is exist', async t => {
    await t
        .useRole(recruiterUser)
        .click(selectDataTest(TEST_IDS.REVIEWS_ROUTE), { offsetX: 1 })
        .click(selectDataTest(TEST_IDS.REVIEW_URL))
        .click('#app', { offsetX: 1, offsetY: 1 }); // waiting for page load

    const reviewPathName = await getPathName();
    await t
        .navigateTo(urlToTest + reviewPathName)
        .click(selectDataTest(TEST_IDS.REVIEW_TYPE_SELECT))
        .click(selectDataTest('Employer'))
        .typeText('#firstName', 'Abraham', { paste: true })
        .typeText('#lastName', 'Lincoln', { paste: true })
        .click(selectDataTest(TEST_IDS.NPS_SCORE_NUMBER, Math.floor(Math.random() * 10)))
        .click(selectDataTest(TEST_IDS.RATING_CANDIDATE_QUALITY_NUMBER, Math.floor(Math.random() * 4) + 1))
        .click(selectDataTest(TEST_IDS.RATING_INDUSTRY_NUMBER, Math.floor(Math.random() * 4) + 1))
        .click(selectDataTest(TEST_IDS.RATING_COMMUNICATION_NUMBER, Math.floor(Math.random() * 4) + 1))
        .click(selectDataTest(TEST_IDS.RATING_RESPONSIVENESS_NUMBER, Math.floor(Math.random() * 4) + 1))
        .typeText('#email', 'Abraham@Lincoln.com', { paste: true })
        .typeText('#title', EMPLOYER_REVIEW_TITLE, { paste: true })
        .typeText('#review', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi architecto at?', { paste: true })
        .click(selectDataTest(TEST_IDS.REVIEW));

    const successPathName = await getPathName();

    await t
        .expect(validateRoute(successPathName, ROUTES.REVIEW_SUCCESS))
        .ok('Either failed to post review or redirect route was changed')
        .navigateTo(generatePath(ROUTES.REVIEWS, { [ REVIEWS_TAB._NAME ]: REVIEWS_TAB.PENDING }))
        .expect(Selector(selectDataTest(TEST_IDS.REVIEW_TITLE))
            .withText(EMPLOYER_REVIEW_TITLE).exists)
        .ok('Pending candidate review wasn\'t displayed');
});

test('Create job and check it exist', async t => {
    await t
        .useRole(employerUser)
        .click(selectDataTest(TEST_IDS.MY_JOBS_EMPLOYER_ROUTE), { offsetX: 1 })
        .click(selectDataTest(TEST_IDS.CREATE_JOB_ROUTE))
        .typeText('#title', JOB_TITLE, { paste: true })
        .typeText('#postcode', 'sydney', { paste: true })
        .click(selectDataTest('2020'))
        .click('#category')
        .click(selectDataTest('Other'))
        .click('#job-type')
        .click(selectDataTest('Permanent'))
        .typeText('#vacancies', '3')
        .click('#vacancyReason')
        .click(selectDataTest('Replacement'))
        .typeText('#salary', '45000', { replace: true })
        .click('#feePercentage')
        .click(selectDataTest('17'))
        .click('#companyOverview')
        .pressKey('1 I p s u m')
        .click('#description')
        .pressKey('2 I p s u m')
        .click('#whoLookingFor')
        .pressKey('3 I p s u m')
        .click('#compensationAndBenefits')
        .pressKey('4 I p s u m')
        .click(selectDataTest(TEST_IDS.CREATE_JOB_SEARCH_TYPE_ROUTE))
        .click(selectDataTest(TEST_IDS.JOB_NETWORK_TYPE))
        .click(selectDataTest(TEST_IDS.PUBLISH_JOB_SUBMIT))
        .click(selectDataTest(TEST_IDS.CONFIRM_SUBMIT))
        .click(selectDataTest(TEST_IDS.MY_JOBS_EMPLOYER_ROUTE), { offsetX: 1 })
        .expect(Selector(selectDataTest(TEST_IDS.JOB_TITLE))
            .withText(JOB_TITLE).exists)
        .ok('Job wasn\'t created properly');
});

test('Edit job', async t => {
    await t
        .useRole(employerUser)
        .click(selectDataTest(TEST_IDS.MY_JOBS_EMPLOYER_ROUTE), { offsetX: 1 })
        .click(selectDataTest(TEST_IDS.JOB_ACTIONS))
        .click(selectDataTest(TEST_IDS.JOB_ACTION_EDIT))
        .click('#job-type')
        .click(selectDataTest('Fixed-term'))
        .typeText('#term', '9', { paste: true, replace: true })
        .click(selectDataTest(TEST_IDS.SAVE_JOB_SUBMIT))
        .expect(Selector(`.${ TEST_IDS.EDIT_JOB_SUCCESS }`).exists)
        .ok('Job was\'t edited with "Fixed-term" job type');

    await t
        .click('#job-type')
        .click(selectDataTest('Temporary'))
        .typeText('#temp-type-contract-length', '15', { replace: true })
        .typeText('#minRate', '140', { paste: true })
        .typeText('#maxRate', '170', { paste: true })
        .click(selectDataTest(TEST_IDS.SAVE_JOB_SUBMIT))
        .expect(Selector(`.${ TEST_IDS.EDIT_JOB_SUCCESS }`).exists)
        .ok('Job was\'t edited with "Temporary" job type');
});

test.skip('Approve created job by admin', async t => {
    await t
        .useRole(adminPanelUser)
        .click(Selector('a')
            .withExactText('Job'))
        .typeText('[name="query"]', JOB_TITLE)
        .click('[type="submit"]')
        .setNativeDialogHandler(() => true)
        .click(Selector('a')
            .withText('mpo_publish'));
});

test('Apply for a job', async t => {
    await t
        .useRole(recruiterUser)
        .click(selectDataTest(TEST_IDS.MARKETPLACE_ROUTE), { offsetX: 1 })
        .click(selectDataTest(TEST_IDS.APPLY_FOR_A_JOB))
        .typeText('#message', 'Apply message for a job', { replace: true })
        .click(selectDataTest(TEST_IDS.AGREE_TO_THE_TERMS))
        .click(selectDataTest(TEST_IDS.APPLY_FOR_A_JOB_SUBMIT))
        .expect(Selector(`.${ TEST_IDS.APPLY_FOR_A_JOB_SUCCESS }`).exists)
        .ok('Successful notification for job apply wasn\'t displayed');
});
test('Accept recruiter', async t => {
    await t
        .useRole(employerUser)
        .click(selectDataTest(TEST_IDS.MY_JOBS_EMPLOYER_ROUTE), { offsetX: 1 })
        .click(selectDataTest(TEST_IDS.JOB_TITLE)) // TODO select by proper title
        .click(selectDataTest(TEST_IDS.JOB_RECRUITERS_ROUTE))
        .click(selectDataTest(TEST_IDS.JOB_RECRUITER_ACTIONS))
        .click(selectDataTest(TEST_IDS.JOB_RECRUITER_ACTION_ENGAGE))
        .click(selectDataTest(TEST_IDS.CONFIRM_SUBMIT));
});
test('Submit candidate', async t => {
    await t
        .useRole(recruiterUser)
        .click(selectDataTest(TEST_IDS.MY_JOBS_RECRUITER_ROUTE), { offsetX: 1 })
        .click(selectDataTest(TEST_IDS.JOBS_RECRUITER_ACTIONS))
        .click(selectDataTest(TEST_IDS.JOBS_RECRUITER_ACTION_CANDIDATE))
        .typeText('#firstName', 'SAbraham', { paste: true })
        .typeText('#lastName', 'SLincoln', { paste: true })
        .typeText('#email', 'AL@Lincoln.com', { paste: true })
        .typeText('#noticePeriod', '4')
        .typeText('#linkedinUrl', 'https://www.linkedin.com/in/ALincoln', { paste: true })
        .setFilesToUpload('[type="file"]', [
            '/Users/arseniyigorevich/Documents/Lorem-ipsum.pdf',
        ])
        .typeText('#additionalInformation', 'additionalInformation', { paste: true })
        .click(selectDataTest(TEST_IDS.CANDIDATE_SUBMIT));
});
test('Send offer to candidate', async t => {
    await t
        .useRole(employerUser)
        .click(selectDataTest(TEST_IDS.MY_JOBS_EMPLOYER_ROUTE), { offsetX: 1 })
        .click(selectDataTest(TEST_IDS.JOB_TITLE)) // TODO select by proper title
        .click(selectDataTest(TEST_IDS.JOB_CANDIDATES_ROUTE))
        .click(selectDataTest(TEST_IDS.JOBS_CANDIDATE_ACTIONS))
        .click(selectDataTest(TEST_IDS.JOBS_CANDIDATE_ACTION_OFFER))
        .click('#startDate')
        .click(Selector('abbr')
            .withText('10'))
        .click('#rateType')
        .click(selectDataTest('Hourly'))
        .click(selectDataTest(TEST_IDS.CANDIDATE_OFFER_SUBMIT))
        .expect(Selector(`.${ TEST_IDS.CANDIDATE_OFFER_SUCCESS }`).exists)
        .ok('Successful notification for job apply wasn\'t displayed');
});
test('Accept offer', async t => {
    await t
        .useRole(recruiterUser)
        .click(selectDataTest(TEST_IDS.MY_JOBS_RECRUITER_ROUTE), { offsetX: 1 })
        .click(selectDataTest(TEST_IDS.JOB_TITLE)) // TODO select by proper title
        .click(selectDataTest(TEST_IDS.JOB_CANDIDATES_ROUTE))
        .click(selectDataTest(TEST_IDS.JOBS_CANDIDATE_ACTIONS))
        .click(selectDataTest(TEST_IDS.JOBS_CANDIDATE_ACTION_RECRUITER_OFFER))
        .click(selectDataTest(TEST_IDS.JOBS_CANDIDATE_ACCEPT))
        .click(selectDataTest(TEST_IDS.CONFIRM_SUBMIT));
});
/* eslint-enable */
