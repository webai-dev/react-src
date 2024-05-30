import React, { Component }             from 'react';
import PropTypes                        from 'prop-types';
import { LoginManager }                 from './api';
import RequiresPermission               from './ui/components/User/RequiresPermission';
import { PARAM_PLACEMENT_TYPE, ROUTES } from './constants';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
    withRouter,
    generatePath,
}                                       from 'react-router-dom';
import {
    SubscriptionView,
    SubscriptionSuccessView,
    BlogView,
    BlogCreateView,
    DashboardView,
    SignInView,
    SignUpView,
    SignRestoreView,
    RecruitersView,
    ReviewsView,
    JobCreateEditView,
    JobView, // TODO refactor
    JobsView, // TODO refactor
    JobsMarketplaceView,
    TeamView,
    UserCompanyProfileEditView,
    RecruiterAgencyProfileEditView,
    SearchView,
    RecruiterAgencyProfileView,
    PlacementsView,
    PlacementCreateView,
    WidgetView,
    ReviewFormCreate,
    ReviewFormSuccess,
    IntegrationJobAdderView,
    NotFoundView,
    ToolsView,
    SignUpInfoView,
    StatementView,
    ReviewTemplateView,
    AdminPanelView,
    CampaignsView,
    CampaignCreateView,
    CampaignResponseCreateView,
    CampaignResponseSuccessView,
}                                       from './ui/pages/Loadable';
import {
    AppLayout,
    LoginLayout,
    AllUsersLayout,
    NoLayout,
}                                       from './ui/layout/LoadableLayout.js';

// Display page accordingly to Layout and roles
class RouteCustom extends Component {
    componentDidMount() {
        if (window.analytics) {
            setTimeout(
                () => {
                    window.analytics.page(); //connects https://segment.com/docs/partners/analyticsjs-for-platforms/
                },
                500,
            );
        }
    }

    render() {
        const {
            layout: LayoutComponent,
            page: PageComponent,
            roles = [],
            children,
            params,
            ...rest
        } = this.props;
        return (
            <Route
                { ...rest }
                render={ matchProps => (
                    <LayoutComponent { ...matchProps } { ...params }>
                        <RequiresPermission
                            roles={ typeof roles === 'function' ? roles(matchProps) : roles }
                            disallowedComponent={
                                <div>You don&apos;t have permission to view this page</div>
                            }
                        >
                            <PageComponent { ...matchProps }>{ children }</PageComponent>
                        </RequiresPermission>
                    </LayoutComponent>
                ) }
            />
        );
    }
}

RouteCustom.propTypes = {
    layout: PropTypes.func.isRequired,
    page: PropTypes.func.isRequired,
    roles: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.func,
    ]),
    children: PropTypes.node,
    params: PropTypes.object,
};

// Just a hacky component to reset user and push to dash on logout
class LogoutComponent extends React.Component {
    UNSAFE_componentWillMount() {
        LoginManager.logout();
        this.props.history.replace(ROUTES.ROOT + this.props.location.search);
    }

    render() {
        return <div />;
    }
}

LogoutComponent.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
};

class ScrollToTop extends Component {
    componentDidUpdate(prevProps) {
        if (window.navigator.userAgent.includes('Edge')) {
            return;
        }
        if (this.props.location.pathname !== prevProps.location.pathname) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return this.props.children;
    }
}

ScrollToTop.propTypes = {
    location: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
};

const ScrollToTopRouter = withRouter(ScrollToTop);

const Routing = () => { // TODO update react router use [String] instead of multiple routes
    return (
        <Router>
            <ScrollToTopRouter>
                <Switch>
                    <Route
                        path={ ROUTES.LOGOUT }
                        exact
                        component={ LogoutComponent }
                    />
                    <RouteCustom
                        exact
                        layout={ LoginLayout }
                        path={ ROUTES.ROOT }
                        page={ SignInView }
                        params={ {
                            title: 'Sign In | Sourcr',
                            description: 'Sign in to your Sourcr account here. Sourcr Pty Ltd'
                        } }
                    />
                    <RouteCustom
                        exact
                        layout={ LoginLayout }
                        path={ ROUTES.RESTORE_PASSWORD }
                        page={ SignRestoreView }
                        params={ {
                            title: 'Reset password | Sourcr',
                            description: 'Reset password to your Sourcr account here. Sourcr Pty Ltd'
                        } }
                    />
                    <RouteCustom
                        exact
                        layout={ LoginLayout }
                        path={ ROUTES.SIGNUP_INFO }
                        params={ {
                            title: 'Sign Up as employer | Sourcr',
                            description: 'Sign up as employer to your Sourcr account here. Sourcr Pty Ltd'
                        } }
                        page={ SignUpInfoView }
                    />
                    <RouteCustom
                        exact
                        layout={ LoginLayout }
                        path={ ROUTES.SIGNUP }
                        params={ {
                            title: 'Sign Up | Sourcr',
                            description: 'Sign up to your Sourcr account here. Sourcr Pty Ltd'
                        } }
                        page={ SignUpView }
                    />
                    <RouteCustom
                        layout={ NoLayout }
                        exact
                        params={ {
                            title: 'Capability statement',
                        } }
                        path={ ROUTES.STATEMENT }
                        page={ StatementView }
                    />
                    <RouteCustom
                        layout={ NoLayout }
                        exact
                        params={ {
                            title: 'Capability statement',
                        } }
                        path={ ROUTES.STATEMENT_PREVIEW }
                        page={ StatementView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path={ ROUTES.ADMIN_PANEL }
                        exact
                        roles={ [ 'super_admin' ] }
                        params={ { title: 'Admin panel' } }
                        page={ AdminPanelView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path={ ROUTES.JOBADDER }
                        exact
                        params={ { title: 'Edit Profile' } }
                        page={ IntegrationJobAdderView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path={ ROUTES.GOOGLE }
                        exact
                        params={ { title: 'Edit Profile' } }
                        page={ IntegrationJobAdderView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path={ ROUTES.SUBSCRIPTION }
                        exact
                        roles={ [
                            { include: [ 'recruiter' ], exclude: [ 'recruiter_admin', 'team_subscription' ] },
                            { include: [ 'recruiter_admin' ] }
                        ] }
                        params={ { title: 'Subscription' } }
                        page={ SubscriptionView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path={ ROUTES.SUBSCRIPTION_SUCCESS }
                        exact
                        roles={ [ 'recruiter' ] }
                        params={ { title: 'Subscription' } }
                        page={ SubscriptionSuccessView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path={ ROUTES.RECRUITER_PROFILE_EDIT }
                        exact
                        roles={ [ 'recruiter_profile_edit' ] }
                        params={ { title: 'Edit Profile' } }
                        page={ RecruiterAgencyProfileEditView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path={ ROUTES.USER_PROFILE_EDIT }
                        exact
                        roles={ [ 'user_profile_edit' ] }
                        params={ { title: 'Edit Profile' } }
                        page={ UserCompanyProfileEditView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path={ ROUTES.COMPANY_PROFILE_EDIT }
                        exact
                        roles={ [ 'company_edit' ] }
                        params={ { title: 'Edit Company' } }
                        page={ UserCompanyProfileEditView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path={ ROUTES.AGENCY_PROFILE_EDIT }
                        exact
                        roles={ [ 'agency_edit' ] }
                        params={ { title: 'Edit Agency' } }
                        page={ RecruiterAgencyProfileEditView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path={ ROUTES.AGENCY_RECRUITERS }
                        exact
                        roles={ [
                            'recruiter_view',
                            'recruiter_user_invite',
                            'recruiter_user_list',
                        ] }
                        params={ { title: 'Recruiter' } }
                        page={ TeamView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path={ ROUTES.COMPANY_USERS }
                        exact
                        roles={ [
                            'user_view',
                            'user_invite',
                            'user_list',
                        ] }
                        params={ { title: 'User' } }
                        page={ TeamView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path={ ROUTES.RECRUITERS }
                        exact
                        roles={ [ 'recruiter_list' ] }
                        params={ { title: 'Recruiters' } }
                        page={ RecruitersView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path={ ROUTES.REVIEWS }
                        exact
                        roles={ [ 'review_list' ] }
                        params={ { title: 'Reviews' } }
                        page={ ReviewsView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path={ ROUTES.JOB_NEW }
                        exact
                        roles={ [ 'job_create' ] }
                        params={ { title: 'New job' } }
                        page={ JobCreateEditView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path={ ROUTES.JOB_EDIT }
                        exact
                        roles={ [ 'job_edit' ] }
                        params={ { title: 'Edit job' } }
                        page={ JobCreateEditView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path="/my-jobs/:tab(draft|active|closed|pending)?"
                        exact
                        roles={ [ 'job_list_mine', 'marketplace_admin' ] }
                        params={ { title: 'Jobs' } }
                        page={ JobsView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path="/my-jobs/job/:briefingId/brief"
                        exact
                        roles={ [ 'job_list_mine', 'marketplace_admin' ] }
                        params={ {
                            title: 'Jobs',
                            tab: 'active',
                        } }
                        page={ JobsView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path="/jobs/:tab(draft|active|closed|pending)?"
                        exact
                        roles={ [ 'job_list' ] }
                        params={ { title: 'My jobs' } }
                        page={ JobsView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path="/jobs/:jobId/recruiter/:recruiterId/:action(brief|messages)?"
                        exact
                        roles={ [
                            'job_list',
                            'recruiter_list',
                        ] }
                        page={ JobView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path="/jobs/:jobId/:tab(job-description|candidates|recruiters)?"
                        exact
                        roles={ [ 'job_list' ] }
                        page={ JobView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path={ '/jobs/:jobId/candidate/:applicationId/' +
                        ':tab(messages|schedule-interview|offer|reject|interview)?/:extraId?' }
                        exact
                        roles={ [ 'job_list' ] }
                        page={ JobView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path={
                            '/:viewType(marketplace|my-jobs)/job/:jobId/:tab(candidates|job-description)?'
                        }
                        exact
                        roles={ [ 'marketplace_job_view', 'marketplace_admin' ] }
                        page={ JobView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path={
                            '/:viewType(marketplace|my-jobs)/job/:jobId/:modal(messages|apply|withdraw|submit-candidate)?'
                        }
                        exact
                        roles={ [ 'marketplace_job_view', 'marketplace_admin' ] }
                        page={ JobView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path={ '/:viewType(marketplace|my-jobs)/job/' +
                        ':jobId/candidate/' +
                        ':applicationId/:modal(messages|withdraw-candidate|interview|offer)?/:extraId?' }
                        exact
                        roles={ [ 'marketplace_job_view', 'marketplace_admin' ] }
                        page={ JobView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path={ ROUTES.MARKETPLACE }
                        exact
                        roles={ [ 'marketplace_job_list', 'marketplace_admin' ] }
                        params={ { title: 'Marketplace' } }
                        page={ JobsMarketplaceView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path={ ROUTES.PLACEMENTS }
                        params={ { title: 'Placements' } }
                        exact
                        roles={ [ 'recruiter_placements' ] }
                        page={ PlacementsView }
                    />
                    <Route // TODO delete it after 01.01.2020
                        exact
                        path="/placements"// Using magical string intentionally because such route doesn't exist
                        render={ () => (
                            <Redirect
                                to={ generatePath(
                                    ROUTES.PLACEMENTS,
                                    { [ PARAM_PLACEMENT_TYPE._NAME ]: PARAM_PLACEMENT_TYPE.VISIBLE }
                                ) }
                            />
                        ) }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path={ ROUTES.PLACEMENTS_NEW }
                        exact
                        roles={ [ 'recruiter_placements' ] }
                        params={ { title: 'New placement' } }
                        page={ PlacementCreateView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path={ ROUTES.PLACEMENTS_FOR_REVIEW }
                        exact
                        params={ { title: 'Placements' } }
                        roles={ [ 'recruiter_placements' ] }
                        page={ PlacementCreateView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path={ ROUTES.PLACEMENTS_EDIT }
                        exact
                        params={ { title: 'Edit placement' } }
                        roles={ [ 'recruiter_placements' ] }
                        page={ PlacementCreateView }
                    />

                    <RouteCustom
                        layout={ AppLayout }
                        roles={ [
                            { include: [ 'recruiter_admin', 'individual_subscription' ] },
                            { include: [ 'recruiter_freelancer', 'individual_subscription' ] }
                        ] }
                        path={ ROUTES.CAMPAIGNS }
                        exact
                        params={ { title: 'Campaigns' } }
                        page={ CampaignsView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        roles={ [
                            { include: [ 'recruiter_admin', 'individual_subscription' ] },
                            { include: [ 'recruiter_freelancer', 'individual_subscription' ] }
                        ] }
                        path={ ROUTES.CAMPAIGNS_RESPONSES }
                        exact
                        params={ { title: 'Campaigns' } }
                        page={ CampaignsView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        roles={ [
                            { include: [ 'recruiter_admin', 'individual_subscription' ] },
                            { include: [ 'recruiter_freelancer', 'individual_subscription' ] }
                        ] }
                        path={ ROUTES.CAMPAIGNS_NEW }
                        exact
                        params={ { title: 'New campaign' } }
                        page={ CampaignCreateView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        roles={ [
                            { include: [ 'recruiter_admin', 'individual_subscription' ] },
                            { include: [ 'recruiter_freelancer', 'individual_subscription' ] }
                        ] }
                        path={ ROUTES.CAMPAIGNS_EDIT }
                        exact
                        params={ { title: 'Edit campaign' } }
                        page={ CampaignCreateView }
                    />
                    <RouteCustom
                        layout={ AllUsersLayout }
                        path={ ROUTES.CAMPAIGNS_RESPONSE_SUCCESS }
                        exact
                        params={ { title: 'Nps campaign' } }
                        page={ CampaignResponseSuccessView }
                    />
                    <RouteCustom
                        layout={ AllUsersLayout }
                        path={ ROUTES.CAMPAIGNS_RESPONSE }
                        exact
                        params={ { title: 'Nps campaign' } }
                        page={ CampaignResponseCreateView }
                    />

                    <RouteCustom
                        layout={ AppLayout }
                        path={ ROUTES.BLOG }
                        exact
                        page={ BlogView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        path={ ROUTES.BLOG_NEW }
                        exact
                        page={ BlogCreateView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        roles={ [ { include: [ 'marketplace_admin' ] }, { include: [ 'user' ] } ] }
                        path={ ROUTES.DASHBOARD }
                        exact
                        params={ { title: 'Dashboard' } }
                        page={ DashboardView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        roles={ [ 'dashboard' ] }
                        path={ ROUTES.DASHBOARD_REVIEWS }
                        exact
                        params={ { title: 'Dashboard' } }
                        page={ DashboardView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        roles={ [ 'individual_subscription' ] }
                        path={ ROUTES.DASHBOARD_NPS }
                        exact
                        params={ { title: 'Dashboard' } }
                        page={ DashboardView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        roles={ [ 'recruiter', 'team_subscription' ] }
                        path={ ROUTES.DASHBOARD_LEADER_BOARD }
                        exact
                        params={ { title: 'Dashboard' } }
                        page={ DashboardView }
                    />
                    <RouteCustom
                        layout={ AllUsersLayout }
                        path={ ROUTES.REVIEW_PENDING }
                        exact
                        params={ { title: 'review' } }
                        page={ ReviewFormCreate }
                    />
                    <RouteCustom
                        layout={ AllUsersLayout }
                        path={ ROUTES.CANDIDATE_REVIEW }
                        exact
                        params={ { title: 'review' } }
                        page={ ReviewFormCreate }
                    />
                    <RouteCustom
                        layout={ AllUsersLayout }
                        path={ ROUTES.EMPLOYER_REVIEW }
                        exact
                        params={ { title: 'review' } }
                        page={ ReviewFormCreate }
                    />
                    <RouteCustom
                        layout={ AllUsersLayout }
                        path={ ROUTES.REVIEW_SUCCESS }
                        exact
                        params={ { title: 'review' } }
                        page={ ReviewFormSuccess }
                    />
                    <RouteCustom
                        layout={ AllUsersLayout }
                        path={ ROUTES.RECRUITER_PROFILE_PREVIEW }
                        exact
                        roles={ [ 'recruiter_profile_edit' ] }
                        params={ { title: 'Preview profile' } }
                        page={ RecruiterAgencyProfileView }
                    />
                    <RouteCustom
                        layout={ AllUsersLayout }
                        path={ ROUTES.AGENCY_PROFILE_PREVIEW }
                        exact
                        roles={ [ 'agency_edit' ] }
                        params={ { title: 'Preview profile' } }
                        page={ RecruiterAgencyProfileView }
                    />
                    <RouteCustom
                        exact
                        layout={ AllUsersLayout }
                        path={ ROUTES.RECRUITER_PROFILE }
                        page={ RecruiterAgencyProfileView }
                    />
                    <RouteCustom
                        exact
                        layout={ AllUsersLayout }
                        path={ ROUTES.AGENCY_PROFILE }
                        page={ RecruiterAgencyProfileView }
                    />
                    <RouteCustom
                        layout={ AllUsersLayout }
                        exact
                        params={ {
                            title: 'Find Recruitment Agency and Recruiter Reviews and Recommendations | Sourcr',
                            description: 'Find top recruitment agencies and recruiters in their market based on client ' +
                                'and candidate reviews. Search recruiters, read reviews and get better results.'
                        } }
                        path={ ROUTES.SEARCH }
                        page={ SearchView }
                    />
                    <RouteCustom
                        layout={ NoLayout }
                        exact
                        params={ {
                            title: 'Review image',
                        } }
                        path={ ROUTES.REVIEW_IMAGE }
                        page={ ReviewTemplateView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        roles={ [ 'widget_view' ] }
                        path={ ROUTES.WIDGETS }
                        exact
                        page={ ToolsView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        roles={ [ 'recruiter', 'individual_subscription' ] }
                        path={ ROUTES.SOCIAL_CUSTOM }
                        exact
                        page={ ToolsView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        roles={ [ 'recruiter', 'individual_subscription' ] }
                        path={ ROUTES.CAPABILITY_STATEMENT }
                        exact
                        page={ ToolsView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        roles={ [ 'recruiter', 'individual_subscription' ] }
                        path={ ROUTES.INVITE_SETTINGS }
                        exact
                        page={ ToolsView }
                    />
                    <RouteCustom
                        layout={ AppLayout }
                        roles={ [
                            { include: [ 'recruiter_admin', 'individual_subscription' ] },
                            { include: [ 'recruiter_freelancer', 'individual_subscription' ] }
                        ] }
                        path={ ROUTES.CAMPAIGN_SETTINGS }
                        exact
                        page={ ToolsView }
                    />
                    <RouteCustom
                        layout={ NoLayout }
                        exact
                        path={ ROUTES.WIDGET }
                        page={ WidgetView }
                    />
                    <Route // TODO remove that route after some point (when email templates doesn't have it)
                        exact
                        path="/login" // Using magical string intentionally because such route doesn't exist
                        render={ () => (
                            <Redirect to={ ROUTES.ROOT } />
                        ) }
                    />
                    <RouteCustom
                        layout={ AllUsersLayout }
                        exact
                        params={ { title: 'Not found' } }
                        page={ NotFoundView }
                    />
                </Switch>
            </ScrollToTopRouter>
        </Router>
    );
};

export default Routing;
