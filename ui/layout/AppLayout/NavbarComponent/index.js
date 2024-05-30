import React                    from 'react';
import PropTypes                from 'prop-types';
import DashboardIcon            from '../../../../assets/icons/DashboardIcon';
import MegaphoneIcon            from '../../../../assets/icons/MegaphoneIcon';
import BriefcaseIcon            from '../../../../assets/icons/BriefcaseIcon';
import PlaneIcon                from '../../../../assets/icons/PlaneIcon';
import SettingsIcon             from '../../../../assets/icons/SettingsIcon';
import PeopleIcon               from '../../../../assets/icons/PeopleIcon';
import QuoteIcon                from '../../../../assets/icons/QuoteIcon';
import CheckIcon                from '../../../../assets/icons/CheckIcon';
import TeamIcon                 from '../../../../assets/icons/TeamIcon';
import ShareIcon                from '../../../../assets/icons/ShareIcon';
import InfoIcon                 from '../../../../assets/icons/InfoIcon';
import CreditCardIcon           from '../../../../assets/icons/CreditCardIcon';
import {
    ROUTES,
    TEAM_TAB,
    REVIEWS_TAB, PARAM_PLACEMENT_TYPE,
}                               from '../../../../constants';
import {
    generatePath,
    withRouter,
}                               from 'react-router-dom';
import TEST_IDS                 from '../../../../tests/testIds';
import RequiresBillingContainer from '../../../components/RequiresBillingContainer';
import LockMarkerComponent      from '../../../components/RequiresBillingContainer/LockMarkerComponent';
import RequiresPermission       from '../../../components/User/RequiresPermission';
import NavButtonComponent       from './NavButtonComponent';
import styles                   from './styles.scss';

const NavbarComponent = (props) => {
    const { match: { path } } = props;
    return (
        <nav className={ styles.navbar }>
            <div
                className={ styles.navbarBox }
            >
                <NavButtonComponent
                    label="Dashboard"
                    url={ ROUTES.DASHBOARD }
                    roles={ [ 'user' ] }
                    icon={ <DashboardIcon /> }
                />
                <NavButtonComponent
                    label="Dashboard"
                    url={ ROUTES.DASHBOARD_REVIEWS }
                    roles={ [ 'recruiter' ] }
                    isActive={ () => {
                        return path === ROUTES.DASHBOARD ||
                            path === ROUTES.DASHBOARD_REVIEWS ||
                            path === ROUTES.DASHBOARD_NPS ||
                            path === ROUTES.DASHBOARD_LEADER_BOARD;
                    } }
                    icon={ <DashboardIcon /> }
                />
                <NavButtonComponent
                    dataTest={ TEST_IDS.REVIEWS_ROUTE }
                    label="Reviews"
                    url={ generatePath(
                        ROUTES.REVIEWS,
                        { [ REVIEWS_TAB._NAME ]: REVIEWS_TAB.VERIFIED },
                    ) }
                    isActive={ () => {return path === ROUTES.REVIEWS;} }
                    roles={ [ 'review_list' ] }
                    icon={ <QuoteIcon /> }
                />
                <NavButtonComponent
                    dataTest={ TEST_IDS.PLACEMENT_ROUTE }
                    label="Placements"
                    url={ generatePath(ROUTES.PLACEMENTS, { [ PARAM_PLACEMENT_TYPE._NAME ]: PARAM_PLACEMENT_TYPE.VISIBLE }) }
                    roles={ [ 'recruiter_placements' ] }
                    isActive={ () => {
                        return path === ROUTES.PLACEMENTS ||
                            path === ROUTES.PLACEMENTS_EDIT ||
                            path === ROUTES.PLACEMENTS_NEW;
                    } }
                    icon={ <CheckIcon /> }
                />
                <NavButtonComponent
                    dataTest={ TEST_IDS.MARKETPLACE_ROUTE }
                    label="Marketplace"
                    url={ ROUTES.MARKETPLACE }
                    roles={ [ 'marketplace_job_list', 'marketplace_admin' ] }
                    icon={ <MegaphoneIcon /> }
                />
                <NavButtonComponent
                    dataTest={ TEST_IDS.MY_JOBS_EMPLOYER_ROUTE }
                    label="My Jobs"
                    url={ ROUTES.JOBS }
                    roles={ [ 'job_list' ] }
                    icon={ <BriefcaseIcon /> }
                />
                <NavButtonComponent
                    dataTest={ TEST_IDS.MY_JOBS_RECRUITER_ROUTE }
                    label="My Jobs"
                    url={ ROUTES.MY_JOBS }
                    roles={ [ 'job_list_mine', 'marketplace_admin' ] }
                    icon={ <BriefcaseIcon /> }
                />
                <NavButtonComponent
                    dataTest={ TEST_IDS.EMPLOYER_EDIT_ROUTE }
                    label="Edit Profile"
                    url={ ROUTES.USER_PROFILE_EDIT }
                    isActive={ () => {
                        return path === ROUTES.USER_PROFILE_EDIT ||
                            path === ROUTES.COMPANY_PROFILE_EDIT;
                    } }
                    roles={ [ 'user_profile_edit' ] }
                    icon={ <SettingsIcon /> }
                />
                <NavButtonComponent
                    dataTest={ TEST_IDS.RECRUITER_PROFILE_EDIT_ROUTE }
                    label="Edit Profile"
                    url={ ROUTES.RECRUITER_PROFILE_EDIT }
                    isActive={ () => {
                        return path === ROUTES.RECRUITER_PROFILE_EDIT ||
                            path === ROUTES.AGENCY_PROFILE_EDIT;
                    } }
                    roles={ [ 'recruiter_profile_edit' ] }
                    icon={ <SettingsIcon /> }
                />
                <NavButtonComponent
                    label="My Recruiters"
                    url={ generatePath(ROUTES.RECRUITERS) }
                    roles={ [ 'recruiter_list' ] }
                    icon={ <TeamIcon /> }
                />
                <NavButtonComponent
                    label="My Team"
                    url={ generatePath(
                        ROUTES.COMPANY_USERS,
                        { [ TEAM_TAB._NAME ]: TEAM_TAB.ACTIVE },
                    ) }
                    isActive={ () => {return path === ROUTES.COMPANY_USERS;} }
                    roles={ [ 'user_list' ] }
                    icon={ <PeopleIcon /> }
                />
                <NavButtonComponent
                    label="My Team"
                    url={ generatePath(
                        ROUTES.AGENCY_RECRUITERS,
                        { [ TEAM_TAB._NAME ]: TEAM_TAB.ACTIVE },
                    ) }
                    isActive={ () => {return path === ROUTES.AGENCY_RECRUITERS;} }
                    roles={ [ 'recruiter_user_list' ] }
                    icon={ <TeamIcon /> }
                />
                { /*<NavButtonComponent*/ }
                { /*label="Blog"*/ }
                { /*url={ ROUTES.BLOG }*/ }
                { /*icon={ <PencilIcon/> }*/ }
                { /*/>*/ }
                <RequiresPermission
                    roles={ [
                        { include: [ 'recruiter_admin' ] },
                        { include: [ 'recruiter_freelancer' ] }
                    ] }
                >
                    <RequiresBillingContainer>
                        <NavButtonComponent
                            label="Nps Campaigns"
                            roles={ [ 'recruiter' ] }
                            url={ ROUTES.CAMPAIGNS }
                            isActive={ () => {
                                return path === ROUTES.CAMPAIGNS ||
                                    path === ROUTES.CAMPAIGNS_RESPONSES ||
                                    path === ROUTES.CAMPAIGNS_EDIT ||
                                    path === ROUTES.CAMPAIGNS_NEW;
                            } }
                            icon={ <LockMarkerComponent><PlaneIcon /></LockMarkerComponent> }
                        />
                    </RequiresBillingContainer>
                </RequiresPermission>
                <RequiresBillingContainer>
                    <NavButtonComponent
                        label="Tools"
                        roles={ [
                            { include: [ 'recruiter' ], exclude: [ 'recruiter_admin' ] },
                            { include: [ 'recruiter_admin', 'individual_subscription' ] }
                        ] }
                        url={ ROUTES.CAPABILITY_STATEMENT }
                        isActive={ () => {
                            return path === ROUTES.WIDGETS ||
                                path === ROUTES.SOCIAL_CUSTOM ||
                                path === ROUTES.CAPABILITY_STATEMENT ||
                                path === ROUTES.CAMPAIGN_SETTINGS ||
                                path === ROUTES.INVITE_SETTINGS;
                        } }
                        icon={ <LockMarkerComponent><ShareIcon /></LockMarkerComponent> }
                    />
                </RequiresBillingContainer>
                <NavButtonComponent
                    label="Tools"
                    roles={ [
                        { include: [ 'recruiter_admin' ], exclude: [ 'individual_subscription' ] }
                    ] }
                    url={ ROUTES.WIDGETS }
                    icon={ <ShareIcon /> }
                />
                <NavButtonComponent
                    label="Subscription"
                    roles={ [
                        // that should be true
                        { include: [ 'recruiter' ], exclude: [ 'recruiter_admin', 'team_subscription' ] },
                        // OR that should be true
                        { include: [ 'recruiter_admin' ] }
                    ] }
                    url={ ROUTES.SUBSCRIPTION }
                    icon={ <CreditCardIcon /> }
                />
                <div className={ styles.filler } />
                <NavButtonComponent
                    label="Help"
                    roles={ [ 'recruiter' ] }
                    url={ 'http://help.sourcr.com/en/' }
                    icon={ <InfoIcon /> }
                />
                <NavButtonComponent
                    label="Help"
                    roles={ [ 'user' ] }
                    url={ 'https://sourcr.freshdesk.com/support/solutions/folders/44000368608' }
                    icon={ <InfoIcon /> }
                />
            </div>
        </nav>
    );
};

NavbarComponent.propTypes = {
    match: PropTypes.object.isRequired,
};

export default withRouter(NavbarComponent);
