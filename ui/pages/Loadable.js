import React           from 'react';
import Loadable        from 'react-loadable';
import LoaderComponent from '../components/LoaderComponent';

const LoaderRowComponent = () => <LoaderComponent row />;

const getLoadableView = loadedComponent => {
    return Loadable({
        loader: loadedComponent,
        loading: () => <LoaderRowComponent/>,
    });
};

// Each export here is it's own page, this enable us to code split the app up so it's all downloaded only as needed
export const DashboardView = getLoadableView(() => {
    return import('./Dashboard');
});

export const SignInView = getLoadableView(() => {
    return import('./SignIn');
});

export const SignRestoreView = getLoadableView(() => {
    return import('./SignRestore');
});

export const SignUpView = getLoadableView(() => {
    return import('./SignUp');
});

export const SignUpInfoView = getLoadableView(() => {
    return import('./SignUpInfo');
});

export const RecruitersView = getLoadableView(() => {
    return import('./Recruiters');
});

export const RecruiterView = getLoadableView(() => {
    return import('./Recruiter');
});

export const ReviewsView = getLoadableView(() => {
    return import('./Reviews');
});

export const JobsView = getLoadableView(() => {
    return import('./Jobs');
});

export const JobsMarketplaceView = getLoadableView(() => {
    return import('./JobsMarketplace');
});

export const IntegrationJobAdderView = getLoadableView(() => {
    return import('./IntegrationJobAdder');
});

export const JobView = getLoadableView(() => {
    return import('./Job');
});

export const JobCreateEditView = getLoadableView(() => {
    return import('./JobCreateEdit');
});

export const PlacementsView = getLoadableView(() => {
    return import('./Placements');
});

export const PlacementCreateView = getLoadableView(() => {
    return import('./PlacementsCreate');
});

export const CampaignsView = getLoadableView(() => {
    return import('./Campaigns');
});

export const CampaignCreateView = getLoadableView(() => {
    return import('./CampaignCreate');
});

export const CampaignResponseCreateView = getLoadableView(() => {
    return import('./CampaignResponseCreate');
});

export const CampaignResponseSuccessView = getLoadableView(() => {
    return import('./CampaignResponseSuccess');
});

export const BlogView = getLoadableView(() => {
    return import('./Blog');
});

export const BlogCreateView = getLoadableView(() => {
    return import('./BlogCreate');
});

export const TeamView = getLoadableView(() => {
    return import('./Team');
});

export const RecruiterAgencyProfileEditView = getLoadableView(() => {
    return import('./RecruiterAgencyProfileEdit');
});

export const UserCompanyProfileEditView = getLoadableView(() => {
    return import('./UserCompanyProfileEdit');
});

export const SearchView = getLoadableView(() => {
    return import('./Search');
});

export const RecruiterAgencyProfileView = getLoadableView(() => {
    return import('./RecruiterAgencyProfile');
});

export const WidgetView = getLoadableView(() => {
    return import('./Widget');
});

export const ToolsView = getLoadableView(() => {
    return import('./Tools');
});

export const ReviewFormCreate = getLoadableView(() => {
    return import('./ReviewFormCreate');
});

export const ReviewFormSuccess = getLoadableView(() => {
    return import('./ReviewFormSuccess');
});

export const NotFoundView = getLoadableView(() => {
    return import('./NotFound');
});

export const SubscriptionView = getLoadableView(() => {
    return import('./Subscription');
});

export const SubscriptionSuccessView = getLoadableView(() => {
    return import('./SubscriptionSuccess');
});

export const StatementView = getLoadableView(() => {
    return import('./Statement');
});
export const ReviewTemplateView = getLoadableView(() => {
    return import('./ReviewTemplate');
});

export const AdminPanelView = getLoadableView(() => {
    return import('./AdminPanel');
});
