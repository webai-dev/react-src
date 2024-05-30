import React, { Component, Fragment }         from 'react';
import PropTypes                              from 'prop-types';
import { withRouter }                         from 'react-router-dom';
import { graphql, createFragmentContainer }   from 'react-relay';
import { Row, Col }                           from 'reactstrap';
import BriefingModalComponent                 from './BriefingModalComponent';
import JobFilterComponent                     from '../JobFilterComponent';
import SelectJobStatusComponent               from '../SelectJobStatusComponent';
import { environment }                        from '../../../../api';
import DownIcon                               from '../../../../assets/icons/DownIcon';
import TEST_IDS                               from '../../../../tests/testIds';
import DropDownComponent                      from '../../../components/DropDownComponent';
import RowItemComponent, { STATUS }           from '../../../components/RowItemComponent';
import AcceptInviteComponent                  from '../../../components/AcceptInviteComponent';
import {
    JobFilters,
    JOBS_QUERY_TYPE,
}                                             from '../../../../constants';
import ThreadModal                            from '../../../components/Thread';
import RecruiterApplicationTransitionMutation from '../../../../mutations/RecruiterApplicationTransitionMutation';
import ScheduleBriefingMutation               from '../../../../mutations/ScheduleBriefingMutation';
import TransitionBriefingRequestMutation      from '../../../../mutations/TransitionBriefingRequestMutation';
import ButtonComponent, {
    BUTTON_SIZE,
    BUTTON_TYPE
}                                             from '../../../components/ButtonComponent';
import classNames                             from 'classnames';
import styles                                 from './styles.scss';

class RealRecruiterApplicationTable extends Component {
    state = {
        messageModalId: undefined,
        briefingId: undefined,
        candidateModalId: undefined,
        reschedule: false
    };
    onMessagesShowRequested = (messageModalId) => {
        this.setState({ messageModalId });
    };

    onViewBriefing = (briefingId) => {
        this.setState({ briefingId });
    };

    render() {
        const {
            data,
            filter = () => {
                return true;
            },
            briefingId,
            history,
            onInviteAccepted,
            onInviteRejected,
            onJobSelected,
        } = this.props;
        const recruiterApplications = data.recruiterApplications;

        const filteredApplications = recruiterApplications.filter(filter);
        const briefingIdLocal = this.props.briefingId || this.state.briefingId;

        return (
            <Fragment>
                { this.state.messageModalId && (
                    <ThreadModal
                        toggle={ () => this.setState({ messageModalId: undefined }) }
                        threadId={ this.state.messageModalId }
                    />
                ) }
                { briefingIdLocal && (
                    <BriefingModalComponent
                        onTransitionRequested={ ({ id }, transition) => {
                            TransitionBriefingRequestMutation.commit(
                                environment,
                                { id },
                                transition
                            );
                        } }
                        onBriefingRequested={ (recruiterApplication, briefing) => {
                            ScheduleBriefingMutation.commit(
                                environment,
                                recruiterApplication,
                                briefing
                            )
                                .catch(({ errors }) => {
                                    this.setState({ errors });
                                })
                                .then(result => {
                                    if (result) {
                                        this.setState({
                                            briefingId: undefined,
                                            reschedule: undefined
                                        });
                                    }
                                });
                        } }
                        onRescheduleRequested={ () => {
                            if (briefingId) {
                                history.push('/my-jobs');
                            } else {
                                this.setState({ reschedule: true });
                            }
                        } }
                        onRescheduleCancelled={ () => {
                            if (briefingId) {
                                history.push('/my-jobs');
                            } else {
                                this.setState({ reschedule: false });
                            }
                        } }
                        user={
                            filteredApplications.filter(it => it.id === briefingIdLocal)[ 0 ].job.postedBy
                        }
                        reschedule={ this.state.reschedule }
                        toggle={ () =>
                            briefingId
                                ? history.push('/my-jobs')
                                : this.setState({ briefingId: undefined, reschedule: false })
                        }
                        recruiterApplicationId={ briefingIdLocal }
                    />
                ) }
                <div>
                    { filteredApplications.map(recruiterApplication => {

                        const isPsa = recruiterApplication.job.company.agencyRelationship &&
                            recruiterApplication.job.company.agencyRelationship.isPsa;
                        const status = recruiterApplication && recruiterApplication.status ? recruiterApplication.status : 'unapplied';
                        const statusText = status === 'pending_open' ? 'open' : status === 'invite_pending' ? 'invited' : status;
                        return (
                            <RowItemComponent
                                key={ recruiterApplication.id }
                                header={
                                    <ButtonComponent
                                        btnType={ BUTTON_TYPE.LINK_ACCENT }
                                        size={ BUTTON_SIZE.SMALL }
                                        onClick={ () => onJobSelected(recruiterApplication.job) }
                                        dataTest={ TEST_IDS.JOB_TITLE }
                                    >
                                        { recruiterApplication.job.title }
                                    </ButtonComponent>
                                }
                                infoText={
                                    <Fragment>
                                        <div className={ styles.location }>
                                            { recruiterApplication.job.suburb }{ ' ' }
                                            { recruiterApplication.job.state }
                                        </div>
                                        <div className={ styles.jobInfo }>
                                            { (recruiterApplication.status === 'engaged' ||
                                                recruiterApplication.status === 'invited') && (
                                                <div>
                                                    { recruiterApplication.job.company.name }{ ' ' }
                                                    { isPsa && (
                                                        <Fragment>
                                                            { ' ' }-<strong>(PSA){ ' ' }</strong>
                                                        </Fragment>
                                                    ) }
                                                </div>
                                            ) }
                                            <div>
                                                { recruiterApplication.job.type.toLowerCase() === 'permanent'
                                                    ? 'Permanent'
                                                    : recruiterApplication.job.type.toLowerCase() === 'fixed-term'
                                                        ? `Fixed Term (${ recruiterApplication.job.term } weeks)`
                                                        : 'temp' }{ ' ' }
                                                { recruiterApplication.job.searchType === 'exclusive' && (
                                                    <Fragment>
                                                        { ' ' }-{ ' ' }<strong>Exclusive</strong>
                                                    </Fragment>
                                                ) }
                                            </div>
                                        </div>
                                    </Fragment>
                                }
                                jobType
                                classNameMiddle={ styles.middle }
                                classNameEnd={ styles.end }
                                linksBox={
                                    <Fragment>
                                        { (recruiterApplication.briefingRequests || []).length > 0 && (
                                            <div className={ styles.brief }>
                                                <ButtonComponent
                                                    btnType={ BUTTON_TYPE.LINK_ACCENT }
                                                    size={ BUTTON_SIZE.SMALL }
                                                    onClick={ () => this.onViewBriefing(recruiterApplication.id) }
                                                >
                                                    Brief requested
                                                </ButtonComponent>
                                                <br />
                                                <label>{ recruiterApplication.briefingRequests[ 0 ].status }</label>
                                            </div>
                                        ) }
                                        <ButtonComponent
                                            className={
                                                recruiterApplication.job.recruiterCount > 0 ? styles.robButtonActive : styles.robButton
                                            }
                                            btnType={ recruiterApplication.job.recruiterCount > 0 ? BUTTON_TYPE.ACCENT : BUTTON_TYPE.WHITE }
                                            size={ BUTTON_SIZE.SMALL }
                                            onClick={ () => {} }
                                        >
                                            { recruiterApplication.job.recruiterCount }{ ' ' }Recruiters
                                        </ButtonComponent>
                                    </Fragment>
                                }
                                status={ {
                                    engaged: STATUS.SUCCESS,
                                    withdrawn: STATUS.HIGHLIGHT,
                                    unapplied: STATUS.NOT_ACTIVE,
                                    pending_open: STATUS.WARNING,
                                    invite_pending: STATUS.NOT_ACTIVE,
                                }[ status ] }
                                statusText={ statusText }
                                actions={
                                    <DropDownComponent
                                        dataTest={ TEST_IDS.JOBS_RECRUITER_ACTIONS }
                                        labelClassName={ styles.dropDownLabel }
                                        label={
                                            <Fragment>
                                                Actions
                                                { ' ' }
                                                <DownIcon />
                                            </Fragment>
                                        }
                                        selectClassName={ styles.dropDownSelect }
                                        select={
                                            <Fragment>
                                                { recruiterApplication.status === 'invited' && <Fragment>
                                                    <button
                                                        type="button"
                                                        className={ classNames(styles.item) }
                                                        onClick={ () => {
                                                            onInviteAccepted({ id: recruiterApplication.id });
                                                        } }
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={ classNames(styles.item) }
                                                        onClick={ () => {
                                                            onInviteRejected({ id: recruiterApplication.id });
                                                        } }
                                                    >
                                                        Reject
                                                    </button>
                                                </Fragment> }
                                                {
                                                    recruiterApplication.job.status !== 'filled' &&
                                                    recruiterApplication.status === 'engaged' &&
                                                    <button
                                                        type="button"
                                                        data-test={ TEST_IDS.JOBS_RECRUITER_ACTION_CANDIDATE }
                                                        className={ classNames(styles.item) }
                                                        onClick={ () => {
                                                            history.push(`/my-jobs/job/${ recruiterApplication.job.id }/submit-candidate`);
                                                        } }
                                                    >
                                                        Submit Candidate
                                                    </button>

                                                }
                                                {
                                                    recruiterApplication.status === 'engaged' &&
                                                    <button
                                                        type="button"
                                                        className={ classNames(styles.item) }
                                                        onClick={ () => {
                                                            history.push(`/my-jobs/job/${ recruiterApplication.job.id }/withdraw`);
                                                        } }
                                                    >
                                                        Withdraw
                                                    </button>

                                                }
                                                <button
                                                    type="button"
                                                    className={ classNames(styles.item) }
                                                    onClick={ () => onJobSelected(recruiterApplication.job) }
                                                >
                                                    View
                                                </button>
                                                <button
                                                    type="button"
                                                    className={ classNames(styles.item) }
                                                    onClick={ () => {this.onMessagesShowRequested(recruiterApplication.id);} }
                                                >
                                                    Messages
                                                </button>
                                            </Fragment>
                                        }
                                    />
                                }
                            />
                        );
                    }) }
                    { filteredApplications.length === 0 && (
                        <div>
                            No jobs matched the criteria
                        </div>
                    ) }
                </div>
            </Fragment>
        );
    }
}

RealRecruiterApplicationTable.propTypes = {
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    filter: PropTypes.func.isRequired,
    briefingId: PropTypes.string,
    onInviteAccepted: PropTypes.func.isRequired,
    onInviteRejected: PropTypes.func.isRequired,
    onJobSelected: PropTypes.func.isRequired,
};

const RecruiterApplicationTableFragment = createFragmentContainer(
    withRouter(RealRecruiterApplicationTable),
    {
        data: graphql`
            fragment JobsRecruiterComponent_data on Viewer
            @argumentDefinitions(jobStatus: { type: JobStatusFilter, defaultValue: All }) {
                recruiterApplications(status: $jobStatus) {
                    id
                    job {
                        id
                        title
                        suburb
                        state
                        postedBy {
                            id
                            firstName
                            lastName
                        }
                        type
                        term
                        searchType
                        recruiterCount
                        status
                        company {
                            id
                            name
                            agencyRelationship {
                                id
                                isPsa
                                psaDocument {
                                    id
                                    name
                                    url
                                }
                                lastWorkedWith
                            }
                        }
                    }
                    status
                    recruiter {
                        firstName
                        lastName
                        contactNumber
                        agency {
                            id
                            contactNumber
                        }
                    }
                    briefingRequests {
                        id
                        dateTime
                        endDate
                        status
                        whoWillCall
                        numberToCall
                        status
                    }
                }
            }
        `
    }
);

class JobsRecruiterComponent extends Component {
    state = {
        filterText: '',
        jobStatus: null,
    };

    /**
     * Filter jobs by their status
     *
     * @param {string} jobStatus
     */
    handleSelectJobStatus = (jobStatus) => {
        this.setState({ jobStatus });
    };

    onChangeFilter = filter => {
        if (filter === this.props.tab) {
            return;
        }
        if (filter === JobFilters.all) {
            this.props.history.push('/my-jobs');
        } else {
            this.props.history.push(`/my-jobs/${ filter }`);
        }
    };
    onChangeFilterText = filterText => {
        this.setState({ filterText });
    };

    onTransitionRequested = (application, transition) =>
        RecruiterApplicationTransitionMutation.commit(
            environment,
            application,
            transition,
        );

    filterJob = job => {
        const status = this.state.jobStatus;
        if (status && status !== JOBS_QUERY_TYPE.ALL && this.state.filterText.length > 0) {
            return (
                (job.title || '').toLowerCase()
                    .indexOf(this.state.filterText.toLowerCase()) >= 0 && job.status === status
            );
        }
        if (status && status !== JOBS_QUERY_TYPE.ALL) {
            return job.status === status;
        }
        if (this.state.filterText.length > 0) {
            return (
                (job.title || '').toLowerCase()
                    .indexOf(this.state.filterText.toLowerCase()) >= 0
            );
        }
        return true;
    };

    render() {
        const { handleSelectJobStatus, filterJob } = this;
        const { jobStatus } = this.state;
        const { data, history, tab, briefingId } = this.props;
        return <Fragment>
            <Row
                key="filter-row"
                className="sub-nav no-gutters"
            >
                <JobFilterComponent
                    visible={ [
                        'all',
                        'pending',
                        'active',
                        'closed',
                    ] }
                    activeFilter={ tab || JobFilters.all }
                    data={ data }
                    onChangeFilter={ this.onChangeFilter }
                    filterText={ this.state.filterText }
                    onChangeFilterText={ this.onChangeFilterText }
                />
            </Row>
            <Row className="no-gutters mb-3 d-flex justify-content-end">
                <SelectJobStatusComponent
                    className={ styles.dropDown }
                    onSetValue={ handleSelectJobStatus }
                    jobStatus={ jobStatus }
                />
            </Row>
            <Row
                key="jobs-table-row"
                className="mb-3"
            >
                { this.state.acceptInviteModal && (
                    <AcceptInviteComponent
                        close={ () => this.setState({ acceptInviteModal: false }) }
                        onApplyRequested={ () =>
                            this.onTransitionRequested(
                                this.state.acceptInviteModal,
                                'accept',
                            )
                                .then(
                                    () => this.setState({ acceptInviteModal: false }),
                                )
                        }
                    />
                ) }
                <Col>
                    <RecruiterApplicationTableFragment
                        data={ data }
                        briefingId={ briefingId }
                        filter={ filterJob }
                        onInviteRejected={ application =>
                            this.onTransitionRequested(
                                application,
                                'reject_invite',
                            )
                        }
                        onInviteAccepted={ application =>
                            this.setState({ acceptInviteModal: application })
                        }
                        onJobSelected={ job => {
                            history.push(`/my-jobs/job/${ job.id }`);
                        } }
                    />
                </Col>
            </Row>
        </Fragment>;
    }
}

JobsRecruiterComponent.propTypes = {
    data: PropTypes.object,
    history: PropTypes.object,
    tab: PropTypes.string,
    briefingId: PropTypes.string,
};

export default JobsRecruiterComponent;
