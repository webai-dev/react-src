import React, { Component, Fragment }         from 'react';
import PropTypes                              from 'prop-types';
import { Link, withRouter }                   from 'react-router-dom';
import { environment }                        from '../../../../api';
import TEST_IDS                               from '../../../../tests/testIds';
import ActionsRowComponent                    from '../../../components/ActionsRowComponent';
import ButtonBackComponent                    from '../../../components/ButtonBackComponent';
import HeaderRowButtonComponent               from '../../../components/HeaderRowButtonComponent';
import HeaderRowComponent                     from '../../../components/HeaderRowComponent';
import ThreadModal                            from '../../../components/Thread';
import { Confirm }                            from '../../../components/Modal';
import { Alert }                              from 'reactstrap';
import { Button }                             from '../../../components/Button';
import AcceptInviteComponent                  from '../../../components/AcceptInviteComponent';
import CandidateModalContainer                from '../ModalsJob/CandidateModalContainer';
import {
    WithdrawModal,
    SubmitCandidateModal,
    JobOfferModal,
    InterviewModal,
}                                             from '../ModalsJob/Modals';
import OfferJobMutation                       from '../../../../mutations/OfferJobMutation';
import ScheduleInterviewMutation              from '../../../../mutations/ScheduleInterviewMutation';
import TransitionJobApplicationMutation       from '../../../../mutations/TransitionJobApplicationMutation';
import RecruiterApplicationTransitionMutation from '../../../../mutations/RecruiterApplicationTransitionMutation';
import JobTabDescriptionComponent             from '../JobTabDescriptionComponent';
import JobTabCandidatesComponent              from '../JobTabCandidatesComponent';
import {
    Select,
}                                             from '../../../components/Form';
import { ROUTES }                             from '../../../../constants';
import WithdrawCandidateComponent             from './WithdrawCandidateComponent';
import ApplyModalContainer                    from '../../../components/ApplyModalContainer';
import {
    inject,
    observer,
}                                             from 'mobx-react';
import './styles.scss';

class JobEmployerComponent extends Component {
    state = {
        loading: false,
        statusFilter: 'all',
    };
    onRecruiterApplicationWithdraw = (application, reason) => {
        this.setState({ loading: true });
        const onComplete = () => this.props.history.push('/my-jobs');
        if (!application) {
            return onComplete(this.props.job);
        }
        RecruiterApplicationTransitionMutation.commit(
            environment,
            application,
            'withdraw',
            reason,
        )
            .then(result => {
                const { job } = result.mutator.transitionRecruiterApplication;
                onComplete(job);
            });
    };

    onJobApplicationWithdraw = (application, reason) => {
        this.setState({ loading: true });
        const onComplete = () =>
            this.props.history.push(`/my-jobs/job/${ this.props.job.id }/candidates`);

        if (!application) {
            return onComplete(this.props.job);
        }

        TransitionJobApplicationMutation.commit(
            environment,
            application,
            'withdraw',
            reason,
        )
            .then(result => {
                const { job } = result.mutator.transitionJobApplication;
                onComplete(job);
            });
    };

    onInterviewRequested = (application, interviewRequest) => {
        ScheduleInterviewMutation.commit(
            environment,
            application,
            interviewRequest,
        )
            .catch(({ errors }) => {
                this.setState({ errors });
            })
            .then(result => {
                if (result) {
                    this.props.history.push(`/my-jobs/job/${ this.props.job.id }/candidates`);
                }
            });
    };

    onOfferRequested = (application, offer) => {
        OfferJobMutation.commit(
            environment,
            application,
            offer,
        )
            .then(result => {
                if (result) {
                    this.props.history.push(`/my-jobs/job/${ this.props.job.id }/candidates`);
                }
            })
            .catch(({ errors }) => {
                this.setState({ errors });
            });
    };

    onOfferUpdated = () => {
        this.props.history.push(`/my-jobs/job/${ this.props.job.id }/candidates`);
    };

    render() {
        const {
            store,
            job,
            history,
            match: { params: { viewType, tab, modal, extraId, applicationId } }
        } = this.props;
        const isEmployer = false;

        const candidateView = applicationId !== undefined;
        let activeTab = tab;
        if (!activeTab) {
            if (candidateView) {
                activeTab = 'candidates';
            } else {
                activeTab = 'job-description';
            }
        }
        const applyModalOpen = modal === 'apply';
        const withdrawModalOpen = modal === 'withdraw';
        const withdrawCandidateModalOpen = modal === 'withdraw-candidate';
        const submitCandidateModalOpen = modal === 'submit-candidate';
        const messageModalOpen = modal === 'messages' && !applicationId;
        const messageCandidateModalOpen = modal === 'messages' && applicationId;
        if (submitCandidateModalOpen) {
            activeTab = 'candidates';
        }

        let selectedInterview = {};
        if (modal === 'interview') {
            const possible = job.myApplication.applications.filter(it => it.id === applicationId);
            if (possible.length > 0) {
                let possibleInterview = possible[ 0 ].interviewRequests.filter(
                    it => it.id === extraId,
                );
                if (possibleInterview.length > 0) {
                    selectedInterview = possibleInterview[ 0 ];
                }
            }
        }
        const interviewModalOpen = modal === 'interview' && selectedInterview;
        let selectedOffer = null;
        if (modal === 'offer') {
            const possible = job.myApplication.applications.filter(it => it.id === applicationId);
            if (possible.length > 0) {
                let possibleOffer = possible[ 0 ].offers.filter(it => it.id === extraId);
                if (possibleOffer.length > 0) {
                    selectedOffer = possibleOffer[ 0 ];
                }
            }
        }
        const offerModalOpen = modal === 'offer' && selectedOffer;

        return (
            <Fragment>

                { /*HEADER PART*/ }
                <HeaderRowComponent
                    tabs={
                        <Fragment>
                            <HeaderRowButtonComponent
                                url={ `/${ viewType }/job/${ job.id }/job-description` }
                                label="Job Description"
                                isActive={ tab === 'job-description' || !tab }
                            />
                            { job.myApplication && job.myApplication.status === 'engaged' &&
                            <HeaderRowButtonComponent
                                dataTest={ TEST_IDS.JOB_CANDIDATES_ROUTE }
                                url={ `/${ viewType }/job/${ job.id }/candidates` }
                                label="Candidate Tracker"
                                badgeText={ job.myApplication.applications.length }
                                isActive={ tab === 'candidates' }
                            /> }
                        </Fragment>
                    }
                />
                <ActionsRowComponent
                    itemActions={
                        <ButtonBackComponent url={ `/${ viewType }` } />
                    }
                    pageActions={
                        <Fragment>
                            { (job.myApplication && job.myApplication.status !== 'rejected' && activeTab === 'candidates') &&
                            <div className="status-filter">
                                <Select
                                    value={ this.state.statusFilter }
                                    onChange={ e => this.setState({ statusFilter: e.target.value }) }
                                >
                                    <option value="all">
                                        VIEW ALL ({ job.myApplication.applications.length })
                                    </option>
                                    { Object.entries(
                                        job.myApplication.applications.reduce(
                                            (statuses, item) => {
                                                const status = item.status.toLowerCase();
                                                if (typeof statuses[ status ] === 'undefined') {
                                                    statuses[ status ] = 0;
                                                }
                                                statuses[ status ]++;

                                                return statuses;
                                            },
                                            {},
                                        ),
                                    )
                                        .map(([ item, count ]) => (
                                            <option
                                                value={ item }
                                                key={ item }
                                            >
                                                { item.toUpperCase() } ({ count })
                                            </option>
                                        )) }
                                </Select>
                                { job.status !== 'filled' &&
                                job.myApplication.status === 'engaged' && (
                                    <Button
                                        roles={ [ 'job_application_create' ] }
                                        key="submit-candidate-btn"
                                        color="blue"
                                        className="soft mr-4"
                                        size="lg"
                                        tag={ Link }
                                        to={ `/${ viewType }/job/${ job.id }/submit-candidate` }
                                    >
                                        Submit Candidate
                                    </Button>
                                ) }
                            </div>
                            }
                            { (job.myApplication && job.myApplication.status !== 'rejected' && activeTab !== 'candidates') &&
                            <Fragment>
                                { job.status !== 'filled' &&
                                job.myApplication.status === 'engaged' && (
                                    <Button
                                        roles={ [ 'job_application_create' ] }
                                        key="submit-candidate-btn"
                                        color="blue"
                                        className="soft mr-4"
                                        size="lg"
                                        tag={ Link }
                                        to={ `/${ viewType }/job/${ job.id }/submit-candidate` }
                                    >
                                        Submit Candidate
                                    </Button>
                                ) }

                                { job.status !== 'filled' &&
                                job.myApplication.status === 'engaged' && (
                                    <Button
                                        roles={ [ 'job_withdraw' ] }
                                        key="withdraw-job-btn"
                                        color="blue"
                                        className="soft"
                                        size="lg"
                                        tag={ Link }
                                        to={ `/${ viewType }/job/${ job.id }/withdraw` }
                                    >
                                        Withdraw
                                    </Button>
                                ) }

                                { job.myApplication.status === 'invited' && (
                                    <Fragment>
                                        <Button
                                            roles={ [ 'job_accept_invite' ] }
                                            key="accept-job-btn"
                                            color="blue"
                                            className="soft"
                                            size="lg"
                                            onClick={ () => {this.setState({ acceptInviteModal: true });} }
                                        >
                                            Accept
                                        </Button>

                                        <Button
                                            roles={ [ 'job_reject_invite' ] }
                                            key="reject-job-btn"
                                            color="blue"
                                            className="soft"
                                            size="lg"
                                            onClick={ () => {
                                                RecruiterApplicationTransitionMutation.commit(
                                                    environment,
                                                    job.myApplication,
                                                    'reject_invite',
                                                );
                                            } }
                                        >
                                            Reject
                                        </Button>
                                    </Fragment>
                                ) }
                            </Fragment>
                            }
                            { (!job.myApplication && (!job.myApplication || job.myApplication.status === 'invited')) &&
                            <Button
                                roles={ [ 'job_apply' ] }
                                key="apply-job-btn"
                                color="blue"
                                className="soft"
                                size="lg"
                                tag={ store.auth.user?.attributes.profileComplete ? Link : 'a' }
                                onClick={ () => {
                                    if (store.auth.user?.attributes.profileComplete) {
                                        return true;
                                    }

                                    Confirm(
                                        <div className="confirmations-title">
                                            <p>You must complete your profile before you can apply for a job</p>
                                        </div>,
                                        {
                                            proceed: false,
                                            cancel: 'OK',
                                            title: 'Your profile is not complete',
                                        },
                                    )
                                        .then(
                                            () => {},
                                            () => {
                                                history.push(ROUTES.RECRUITER_PROFILE_EDIT);
                                            },
                                        );
                                    return false;
                                } }
                                to={ `/${ viewType }/job/${ job.id }/apply` }
                            >
                                Apply
                            </Button>
                            }
                        </Fragment>
                    }
                />
                { job.myApplication &&
                job.myApplication.status === 'rejected' && (
                    <Alert color="danger">Your application for this job was rejected</Alert>
                ) }

                { /*MAIN PART*/ }
                {
                    activeTab === 'job-description' &&
                    <JobTabDescriptionComponent
                        job={ job }
                        isEmployer={ isEmployer }
                    />
                }
                {
                    activeTab === 'candidates' &&
                    <JobTabCandidatesComponent
                        isEmployer={ isEmployer }
                        statusFilter={ this.state.statusFilter }
                        history={ history }
                        job={ job }
                        viewType={ viewType }
                    />
                }

                { /*MODALS*/ }
                { this.state.acceptInviteModal && (
                    <AcceptInviteComponent
                        close={ () => this.setState({ acceptInviteModal: false }) }
                        onApplyRequested={ () =>
                            RecruiterApplicationTransitionMutation.commit(
                                environment,
                                job.myApplication,
                                'accept',
                            )
                                .then(() => this.setState({ acceptInviteModal: false })) }
                    />
                ) }
                { applyModalOpen && (
                    <ApplyModalContainer
                        job={ job }
                        handleClose={ () => {
                            history.push(`/${ viewType }/job/${ job.id }`);
                        } }
                    />
                ) }
                { withdrawModalOpen && (
                    <WithdrawModal
                        viewType={ viewType }
                        onRecruiterApplicationWithdraw={ this.onRecruiterApplicationWithdraw }
                        history={ history }
                        job={ job }
                    />
                ) }
                { withdrawCandidateModalOpen && (
                    <WithdrawCandidateComponent
                        handleCloseModal={
                            () => {history.push(`/${ viewType }/job/${ job.id }/candidates`);} }
                        handleSubmit={
                            ({ id, reason }) => this.onJobApplicationWithdraw(
                                { id },
                                reason,
                            ) }
                        applicationId={ applicationId }
                        key="withdraw-modal"
                    />
                ) }
                { submitCandidateModalOpen && (
                    <SubmitCandidateModal
                        viewType={ viewType }
                        onCandidateSubmitted={ this.onCandidateSubmitted }
                        history={ history }
                        job={ job }
                    />
                ) }
                { offerModalOpen && (
                    <JobOfferModal
                        applicationId={ applicationId }
                        viewType={ viewType }
                        onOfferRequested={ this.onOfferRequested }
                        onOfferUpdated={ this.onOfferUpdated }
                        history={ history }
                        offer={ selectedOffer }
                        job={ job }
                    />
                ) }
                { interviewModalOpen && (
                    <InterviewModal
                        applicationId={ applicationId }
                        viewType={ viewType }
                        history={ history }
                        interview={ selectedInterview }
                        job={ job }
                    />
                ) }
                { messageModalOpen && (
                    <ThreadModal
                        toggle={ () => {history.push(`/my-jobs/job/${ job.id }`);} }
                        threadId={ job && job.myApplication && job.myApplication.id }
                    />
                ) }
                { messageCandidateModalOpen && (
                    <ThreadModal
                        toggle={ () => {history.push(`/my-jobs/job/${ job.id }/candidate/${ applicationId }`);} }
                        threadId={ applicationId }
                    />
                ) }
                { candidateView &&
                !withdrawCandidateModalOpen &&
                !offerModalOpen &&
                !interviewModalOpen &&
                !messageModalOpen &&
                !messageCandidateModalOpen && (

                    <CandidateModalContainer
                        isEmployer={ isEmployer }
                        jobId={ job.id }
                        applicationId={ applicationId }
                        viewType={ viewType }
                    />
                ) }
            </Fragment>
        );
    }
}

JobEmployerComponent.propTypes = {
    history: PropTypes.object,
    match: PropTypes.object,
    store: PropTypes.object,
    job: PropTypes.object.isRequired,
};

export default withRouter(inject('store')(observer(JobEmployerComponent)));
