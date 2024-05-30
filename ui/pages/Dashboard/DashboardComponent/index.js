import React, { Component, Fragment } from 'react';
import PropTypes                      from 'prop-types';
import { ROUTES }                     from '../../../../constants';
import RequiresBillingContainer       from '../../../components/RequiresBillingContainer';
import LockMarkerComponent            from '../../../components/RequiresBillingContainer/LockMarkerComponent';
import ActionsRowComponent            from '../../../components/ActionsRowComponent';
import AlertReviewComponent           from '../../../components/AlertReviewComponent';
import ButtonComponent, {
    BUTTON_SIZE,
    BUTTON_TYPE
}                                     from '../../../components/ButtonComponent';
import HeaderRowButtonComponent       from '../../../components/HeaderRowButtonComponent';
import HeaderRowComponent             from '../../../components/HeaderRowComponent';
import ProgressContainer              from '../../../components/ProgressContainer';
import SelectRecruiterFromAgencyId    from '../../../components/SelectRecruiterFromAgencyId';
import ReviewsInsightComponent        from '../ReviewsInsightComponent';
import NPSComponent                   from '../NPSComponent';
import JobsMarketplaceComponent       from '../JobsMarketplaceComponent';
import LeaderBoardContainer           from '../LeaderBoardContainer';
import styles                         from './styles.scss';

export class DashboardComponent extends Component {
    render() {
        const {
            viewer: {
                recruiterJobs,
                recruiter,
                userJobs,
                activeCount,
                closedCount,
                draftCount,
                pendingCount,
                mpoApproved,
                integrationsInfo,
            },
            isAgencyAdmin,
            isEmployer,
            pathname,
            verifiedReviews,
            requestedReviews,
            selectedRecruiterId,
            handleSelectRecruiter,
            selectedRecruiter,
            reviewTemplateId,
        } = this.props;
        let jobs, candidates;
        const recruiterToDisplay = selectedRecruiter || (isAgencyAdmin ? recruiter.agency : recruiter);
        const isFreelancer = !recruiter?.agency;

        if (isEmployer) {
            jobs = userJobs;
            candidates = jobs.reduce(
                (newCandis, job) => {
                    return newCandis.concat(
                        job.appliedRecruiters.reduce(
                            (jobCandidates, recApp) => {
                                return jobCandidates.concat(
                                    recApp.applications.map(it => ({
                                        ...it.candidate,
                                        status: it.status,
                                        application: it,
                                        job: job,
                                    })),
                                );
                            },
                            [],
                        ),
                    );
                },
                [],
            );
        } else {
            jobs = recruiterJobs;
            candidates = jobs.reduce(
                (newCandis, job) =>
                    newCandis.concat(
                        job.applications.map(it => (it && {
                            ...it.candidate,
                            status: it.status,
                            application: it,
                            job: job.job,
                        })),
                    )
                        .filter(candidate => !!candidate),
                [],
            );
        }

        return (
            <Fragment>
                { !isEmployer && <AlertReviewComponent slug={ recruiter.slug } /> }
                { !isEmployer && <ProgressContainer /> }
                <HeaderRowComponent
                    tabs={
                        <Fragment>
                            { !isEmployer && <HeaderRowButtonComponent
                                url={ ROUTES.DASHBOARD_REVIEWS }
                                label="Reviews & insights"
                                isActive={ pathname === ROUTES.DASHBOARD_REVIEWS }
                            /> }
                            { (isEmployer || mpoApproved) && <HeaderRowButtonComponent
                                url={ ROUTES.DASHBOARD }
                                label="Jobs & marketplace"
                                isActive={ pathname === ROUTES.DASHBOARD }
                            /> }
                            { !isEmployer && <RequiresBillingContainer>
                                <HeaderRowButtonComponent
                                    url={ ROUTES.DASHBOARD_NPS }
                                    label={ <span><LockMarkerComponent />{ ' ' }NPS</span> }
                                    isActive={ pathname === ROUTES.DASHBOARD_NPS }
                                />
                            </RequiresBillingContainer> }
                            { !isEmployer &&
                            <RequiresBillingContainer isForTeam>
                                <HeaderRowButtonComponent
                                    url={ ROUTES.DASHBOARD_LEADER_BOARD }
                                    label={ <span><LockMarkerComponent isForTeam />{ ' ' }Leaderboards</span> }
                                    isActive={ pathname === ROUTES.DASHBOARD_LEADER_BOARD }
                                />
                            </RequiresBillingContainer>
                            }
                        </Fragment>
                    }
                />
                { isAgencyAdmin && (pathname === ROUTES.DASHBOARD_REVIEWS || pathname === ROUTES.DASHBOARD_NPS) &&
                <ActionsRowComponent
                    className={ styles.actionsRow }
                    itemActions={
                        <ButtonComponent
                            btnType={ BUTTON_TYPE.ACCENT }
                            size={ BUTTON_SIZE.BIG }
                            to={ ROUTES.PLACEMENTS_NEW }
                        >
                            Get Reviews
                        </ButtonComponent>
                    }
                    pageActions={
                        <SelectRecruiterFromAgencyId
                            agencyRecruiters={ recruiter.agency.recruiters }
                            className={ styles.select }
                            selectedRecruiterId={ selectedRecruiterId }
                            handleSelectRecruiter={ handleSelectRecruiter }
                            recruiterId={ recruiter.id }
                        />
                    }
                /> }
                {
                    pathname === ROUTES.DASHBOARD && (isEmployer || mpoApproved) &&
                    <JobsMarketplaceComponent
                        activeCount={ activeCount }
                        closedCount={ closedCount }
                        draftCount={ draftCount }
                        pendingCount={ pendingCount }
                        isEmployer={ isEmployer }
                        jobs={ jobs }
                        candidates={ candidates }
                    />
                }
                {
                    pathname === ROUTES.DASHBOARD_REVIEWS &&
                    <ReviewsInsightComponent
                        reviewTemplateId={ reviewTemplateId }
                        isShowIntegrations={ isAgencyAdmin || isFreelancer }
                        verifiedReviews={ verifiedReviews }
                        requestedReviews={ requestedReviews }
                        recruiterToDisplay={ recruiterToDisplay }
                        recruiterId={ recruiter.id }
                        integrations={ isFreelancer ? integrationsInfo?.integrations : integrationsInfo?.agency?.integrations }
                        googleReviews={ isFreelancer ? integrationsInfo?.googleReviews : integrationsInfo?.agency?.googleReviews }
                        isAgency={ !isFreelancer && !selectedRecruiter && isAgencyAdmin }
                    />
                }
                {
                    pathname === ROUTES.DASHBOARD_NPS &&
                    <NPSComponent
                        isAgencyAdmin={ isAgencyAdmin }
                        verifiedReviews={ verifiedReviews }
                        requestedReviews={ requestedReviews }
                        recruiterToDisplay={ recruiterToDisplay }
                        recruiterId={ recruiter.id }
                    />
                }
                {
                    pathname === ROUTES.DASHBOARD_LEADER_BOARD &&
                    <LeaderBoardContainer
                        recruiterId={ recruiter.id }
                    />
                }
            </Fragment>
        );
    }
}

DashboardComponent.propTypes = {
    viewer: PropTypes.object.isRequired,
    isEmployer: PropTypes.bool,
    isAgencyAdmin: PropTypes.bool,
    pathname: PropTypes.string.isRequired,
    verifiedReviews: PropTypes.array,
    requestedReviews: PropTypes.array,
    selectedRecruiterId: PropTypes.string,
    handleSelectRecruiter: PropTypes.func.isRequired,
    selectedRecruiter: PropTypes.object,
    reviewTemplateId: PropTypes.string,
};

export default DashboardComponent;
