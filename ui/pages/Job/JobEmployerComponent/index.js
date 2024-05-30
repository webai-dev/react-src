import React, { Component, Fragment } from 'react';
import PropTypes                      from 'prop-types';
import { Link, withRouter }           from 'react-router-dom';
import { environment }                from '../../../../api';
import TEST_IDS                       from '../../../../tests/testIds';
import ActionsRowComponent            from '../../../components/ActionsRowComponent';
import ButtonBackComponent            from '../../../components/ButtonBackComponent';
import HeaderRowButtonComponent       from '../../../components/HeaderRowButtonComponent';
import HeaderRowComponent             from '../../../components/HeaderRowComponent';
import ThreadModal                    from '../../../components/Thread';
import { Button, ButtonGroup }        from '../../../components/Button';
import CandidateModalContainer        from '../ModalsJob/CandidateModalContainer';
import {
    ScheduleInterviewModal,
    InterviewModal,
    JobOfferModal,
    BriefRecruiterModal
}                                     from '../ModalsJob/Modals';
import RejectCandidateModalContainer  from '../ModalsJob/RejectCandidateModalContainer';
import ScheduleBriefingMutation       from '../../../../mutations/ScheduleBriefingMutation';
import OfferJobMutation               from '../../../../mutations/OfferJobMutation';
import ScheduleInterviewMutation      from '../../../../mutations/ScheduleInterviewMutation';
import JobTabDescriptionComponent     from '../JobTabDescriptionComponent';
import JobTabCandidatesComponent      from '../JobTabCandidatesComponent';
import JobTabRecruitersComponent      from '../JobTabRecruitersComponent';
import { CandidateStatusColorMap }    from '../../../../constants';
import { ErrorList }                  from '../../../components/Misc';
import RecruiterModalComponent        from '../../../components/RecruiterModalComponent';
import './styles.scss';

class JobEmployerComponent extends Component {
    state = {
        activeFilter: null,
        errors: [],
        candidateStatusFilter: 'all'
    };
    onChangeFilter = activeFilter => {
        this.setState({ activeFilter });
    };

    onInterviewRequested = (application, interviewRequest) => {
        ScheduleInterviewMutation.commit(environment, application, interviewRequest)
            .catch(({ errors }) => {
                this.setState({ errors });
            })
            .then(() => {
                this.props.history.push(
                    `/jobs/${ this.props.job.id }/candidates`
                );
            });
    };

    onOfferRequested = (application, offer) => {
        OfferJobMutation.commit(environment, application, offer)
            .then(result => {
                if (result) {
                    this.props.history.push(
                        `/jobs/${ this.props.job.id }/candidate/${ result.mutator.offerJob.offer
                            .jobApplication.id }`
                    );
                }
            })
            .catch(({ errors }) => {
                this.setState({ errors });
            });
    };

    onOfferUpdated = () => {
        this.props.history.push(`/jobs/${ this.props.job.id }/candidates`);
    };
    onBriefingRequested = (recruiterApplication, briefing) => {
        ScheduleBriefingMutation.commit(environment, recruiterApplication, briefing)
            .then(result => {
                if (result) {
                    this.props.history.push(`/jobs/${ this.props.job.id }/recruiters`);
                }
            })
            .catch(({ errors }) => {
                this.setState({ errors });
            });
    };

    render() {
        const {
            job,
            contactNumber,
            history,
            match: { params: { applicationId, recruiterId, action, extraId, tab } }
        } = this.props;
        const isEmployer = true;

        const candidateView =
            applicationId !== undefined &&
            tab !== 'schedule-interview' &&
            tab !== 'interview' &&
            tab !== 'offer' &&
            tab !== 'reject';
        let tabToShow = tab;
        if (
            tabToShow === 'schedule-interview' ||
            tabToShow === 'interview' ||
            tabToShow === 'offer' ||
            tabToShow === 'reject' ||
            tabToShow === 'interview'
        ) {
            tabToShow = 'candidates';
        }

        if (!tab) {
            if (candidateView) {
                tabToShow = 'candidates';
            } else if (recruiterId) {
                tabToShow = 'recruiters';
            } else {
                tabToShow = 'job-description';
            }
        }
        let selectedInterview = {};
        if (tab === 'interview') {
            let rec;
            for (rec in job.appliedRecruiters) {
                const possible = job.appliedRecruiters[ rec ].applications.filter(
                    it => it.id === applicationId
                );
                if (possible.length > 0) {
                    const possibleInterview = possible[ 0 ].interviewRequests.filter(
                        it => it.id === extraId
                    );
                    if (possibleInterview.length > 0) {
                        selectedInterview = possibleInterview[ 0 ];
                    }
                }
            }
        }
        let selectedOffer = {};
        if (tab === 'offer') {
            let rec;
            for (rec in job.appliedRecruiters) {
                const possible = job.appliedRecruiters[ rec ].applications.filter(
                    it => it.id === applicationId
                );
                if (possible.length > 0) {
                    const possibleOffer = possible[ 0 ].offers.filter(it => it.id === extraId);
                    if (possibleOffer.length > 0) {
                        selectedOffer = possibleOffer[ 0 ];
                    }
                }
            }
        }

        return <Fragment>
            { /*HEADER PART*/ }
            <ErrorList
                errors={ this.state.errors }
            />
            <HeaderRowComponent
                tabs={
                    <Fragment>
                        <HeaderRowButtonComponent
                            url={ `/jobs/${ job.id }/job-description` }
                            label="Job Description"
                            isActive={ tab === 'job-description' || !tab }
                        />
                        <HeaderRowButtonComponent
                            dataTest={ TEST_IDS.JOB_CANDIDATES_ROUTE }
                            url={ `/jobs/${ job.id }/candidates` }
                            label="Candidate Tracker"
                            badgeText={ job.appliedRecruiters.reduce(
                                (total, recruiterApp) => total + recruiterApp.applications.length, 0
                            ) }
                            isActive={ tab === 'candidates' }
                        />
                        <HeaderRowButtonComponent
                            dataTest={ TEST_IDS.JOB_RECRUITERS_ROUTE }
                            url={ `/jobs/${ job.id }/recruiters` }
                            label="Recruiters"
                            badgeText={ job.appliedRecruiters.length }
                            isActive={ tab === 'recruiters' }
                        />
                    </Fragment>
                }
            />
            <ActionsRowComponent
                itemActions={
                    <ButtonBackComponent url={ '/jobs' } />
                }
                pageActions={
                    tabToShow === 'candidates' ?
                        <ButtonGroup>
                            { Object.entries(
                                job.appliedRecruiters.reduce(
                                    (statuses, recruiter) => {
                                        recruiter.applications.map(it => {
                                            if (typeof statuses[ it.status ] === 'undefined') {
                                                statuses[ it.status ] = 0;
                                            }
                                            statuses[ it.status ]++;
                                        });
                                        statuses[ 'all' ]++;
                                        return statuses;
                                    },
                                    { all: 0 }
                                )
                            )
                                .map(([ it, count ]) => (
                                    <Button
                                        key={ `candidate-${ it }-filter-btn` }
                                        className={ `soft candidate-status-filter-${ it }` }
                                        size="lg"
                                        color={ CandidateStatusColorMap[ it ] || undefined }
                                        active={ it === this.state.candidateStatusFilter }
                                        onClick={ () => {
                                            if (it !== this.state.candidateStatusFilter) {
                                                this.setState({ candidateStatusFilter: it });
                                            } else {
                                                this.setState({ candidateStatusFilter: 'all' });
                                            }
                                        } }
                                    >
                                        { it === 'all' ? null : count } { it.toUpperCase() }
                                    </Button>
                                )) }
                        </ButtonGroup> :
                        <Button
                            roles={ [ 'job_edit' ] }
                            key="edit-job-btn"
                            color="blue"
                            className="soft"
                            size="lg"
                            tag={ Link }
                            to={ `/jobs/${ job.id }/edit/${ tabToShow }` }
                        >
                            Edit
                        </Button>
                }
            />

            { /*MAIN PART*/ }
            {
                tabToShow === 'job-description' &&
                <JobTabDescriptionComponent
                    job={ job }
                    isEmployer={ isEmployer }
                />
            }
            {
                tabToShow === 'candidates' &&
                <JobTabCandidatesComponent
                    isEmployer={ isEmployer }
                    statusFilter={ this.state.candidateStatusFilter }
                    history={ history }
                    job={ job }
                    activeId={ applicationId }
                />
            }
            {
                tabToShow === 'recruiters' &&
                <JobTabRecruitersComponent
                    history={ history }
                    job={ job }
                />
            }

            { /*MODALS*/ }
            { candidateView && tab !== 'messages' && (
                <CandidateModalContainer
                    isEmployer={ isEmployer }
                    jobId={ job.id }
                    applicationId={ applicationId }
                />
            ) }
            { tab === 'schedule-interview' && (
                <ScheduleInterviewModal
                    isEmployer
                    applicationId={ applicationId }
                    onInterviewRequested={ this.onInterviewRequested }
                    history={ history }
                    job={ job }
                />
            ) }
            { tab === 'interview' && (
                <InterviewModal
                    isEmployer
                    history={ history }
                    applicationId={ applicationId }
                    interview={ selectedInterview }
                    job={ job }
                />
            ) }
            { tab === 'offer' && (
                <JobOfferModal
                    history={ history }
                    isEmployer
                    applicationId={ applicationId }
                    onOfferRequested={ this.onOfferRequested }
                    onOfferUpdated={ this.onOfferUpdated }
                    offer={ selectedOffer }
                    job={ job }
                />
            ) }
            {
                tab === 'reject' && (
                    <RejectCandidateModalContainer
                        applicationId={ applicationId }
                        handleCloseModal={ () => {
                            history.push(`/jobs/${ job.id }/candidates`);
                        } }
                    />
                )
            }
            { recruiterId && action !== 'brief' && action !== 'messages' && (
                <RecruiterModalComponent
                    recruiterId={ recruiterId }
                    toggle={ () => {
                        history.push(`/jobs/${ job.id }/recruiters`);
                    } }
                />
            ) }
            { recruiterId && action === 'brief' && (
                <BriefRecruiterModal
                    isEmployer
                    history={ history }
                    contactNumber={ contactNumber }
                    job={ job }
                    onBriefingRequested={ this.onBriefingRequested }
                    application={
                        job.appliedRecruiters.filter(it => it.recruiter.id === recruiterId)[ 0 ]
                    }
                />
            ) }
            { recruiterId && action === 'messages' && (
                <ThreadModal
                    toggle={ () => {history.push(`/jobs/${ job.id }/recruiters`);} }
                    threadId={ recruiterId }
                />
            ) }
            { applicationId && tab === 'messages' && (
                <ThreadModal
                    toggle={ () => {history.push(`/jobs/${ job.id }/candidate/${ applicationId }`);} }
                    threadId={ applicationId }
                />
            ) }
        </Fragment>;
    }
}

JobEmployerComponent.propTypes = {
    job: PropTypes.object.isRequired,
    contactNumber: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
};

export default withRouter(JobEmployerComponent);
