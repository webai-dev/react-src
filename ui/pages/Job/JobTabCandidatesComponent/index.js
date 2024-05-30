import React, { Component, Fragment } from 'react';
import PropTypes                      from 'prop-types';
import DownIcon                       from '../../../../assets/icons/DownIcon';
import TEST_IDS                       from '../../../../tests/testIds';
import DropDownComponent              from '../../../components/DropDownComponent';
import TabPanel                       from '../../../components/Tabs/TabPanel';
import Table                          from '../../../components/Table/Table';
import TableRow                       from '../../../components/Table/TableRow';
import TableCell                      from '../../../components/Table/TableCell';
import ProfileSnippet                 from '../../../components/User/ProfileSnippet';
import ThreadModal                    from '../../../components/Thread';
import JobApplicationStatusComponent  from '../../../components/JobApplicationStatusComponent';
import RecruiterModalComponent        from '../../../components/RecruiterModalComponent';
import RequiresPermission             from '../../../components/User/RequiresPermission';
import getFullDateFromDateString      from '../../../../util/getFullDateFromDateString';
import classNames                     from 'classnames';
import styles                         from './styles.scss';

const JobApplicationFiles = (props) => {
    const { files } = props;
    return (
        <div>
            { files.map(file => (
                <div key={ file.url }>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={ file.url }
                    >
                        { file.name }
                    </a>
                </div>
            )) }
        </div>
    );
};

JobApplicationFiles.propTypes = {
    files: PropTypes.array.isRequired
};

const JobApplicationInterviews = (props) => {
    const { interviewRequests, showInterviewDetail } = props;
    return (
        interviewRequests.length > 0
            ? [ interviewRequests[ 0 ] ].map(it => (
                <div
                    className="interview-request cursor-pointer"
                    onClick={ () => {
                        showInterviewDetail(it.id);
                    } }
                    key={ it.id }
                    data-status={ it.status || 'unknown' }
                >
                    { it.status === 'rejected' && (<strike><span>{ getFullDateFromDateString(it.date) }</span></strike>) }
                    { it.status !== 'rejected' && <span>{ getFullDateFromDateString(it.date) }</span> }
                    { it.status !== 'completed' && (
                        <small style={ { display: 'block' } }>
                            { it.status
                                .split('_')
                                .map(function (item) {
                                    return item.charAt(0)
                                        .toUpperCase() + item.substring(1);
                                })
                                .join(' ') }
                        </small>
                    ) }
                </div>
            ))
            : 'No scheduled interview');
};
JobApplicationInterviews.propTypes = {
    interviewRequests: PropTypes.array.isRequired,
    showInterviewDetail: PropTypes.func.isRequired,
};

const JobApplicationOffers = (props) => {
    const { offers, showOfferDetail } = props;
    return (
        offers.length > 0
            ? [ offers[ 0 ] ].map(it => (
                <div
                    className="job-offer cursor-pointer"
                    onClick={ () => {
                        showOfferDetail(it.id);
                    } }
                    key={ it.id }
                    data-status={ it.status || 'unknown' }
                >

                    { it.status === 'rejected' && (<strike><span>{ getFullDateFromDateString(it.startDate) }</span></strike>) }
                    { it.status !== 'rejected' && <span>{ getFullDateFromDateString(it.startDate) }</span> }
                    <small style={ { display: 'block' } }>
                        { it.status
                            .split('_')
                            .map(function (item) {
                                return item.charAt(0)
                                    .toUpperCase() + item.substring(1);
                            })
                            .join(' ') }
                    </small>
                </div>
            ))
            : 'No offers');
};
JobApplicationOffers.propTypes = {
    offers: PropTypes.array.isRequired,
    showOfferDetail: PropTypes.func,
};

const JobApplicationTableRow = (props) => {
    const {
        jobApplication = {},
        onApplicationSelected = () => {},
        onRecruiterSelected = () => {},
        onMessagesShowRequested = () => {},
        onShowInterviewDetail = () => {},
        onShowOfferDetail = () => {},
        showRecruiter = false,
        showFiles = true,
        history,
        ...otherProps
    } = props;
    return (
        <TableRow { ...otherProps }>
            <TableCell
                name="candidate"
                valign="center"
            >
                <ProfileSnippet
                    onClick={ () => onApplicationSelected(jobApplication) }
                    type="candidate"
                    profile={ jobApplication.candidate }
                />
            </TableCell>

            { showRecruiter && (
                <TableCell
                    name="recruiter"
                    valign="center"
                >
                    <ProfileSnippet
                        withAvatar={ false }
                        onClick={ () => onRecruiterSelected(jobApplication.recruiter) }
                        type="recruiter"
                        profile={ jobApplication.recruiter }
                    />
                </TableCell>
            ) }
            { showFiles && (
                <TableCell
                    name="recruiter"
                    valign="center"
                >
                    <JobApplicationFiles files={ jobApplication.files || [] } />
                </TableCell>
            ) }

            <TableCell
                name="status"
                valign="center"
            >
                <JobApplicationStatusComponent jobApplication={ jobApplication } />
            </TableCell>
            { jobApplication.status === 'interviewing' && (
                <TableCell
                    name="interviews"
                    valign="center"
                >
                    <JobApplicationInterviews
                        showInterviewDetail={ interviewId =>
                            onShowInterviewDetail(jobApplication.id, interviewId) }
                        interviewRequests={ jobApplication.interviewRequests || [] }
                    />
                    <h4>Interview</h4>
                </TableCell>
            ) }
            { jobApplication.status === 'offered' && (
                <TableCell
                    name="offers"
                    valign="center"
                >
                    <JobApplicationOffers
                        showOfferDetail={ offer => onShowOfferDetail(jobApplication.id, offer) }
                        offers={ jobApplication.offers || [] }
                    />
                    <h4>Offer</h4>
                </TableCell>
            ) }
            { jobApplication.status !== 'offered' &&
            jobApplication.status !== 'interviewing' && <TableCell
                name="filler"
                valign="center"
            /> }
            <TableCell
                name="actions"
                align="right"
            >
                <DropDownComponent
                    dataTest={ TEST_IDS.JOBS_CANDIDATE_ACTIONS }
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
                            <button
                                type="button"
                                className={ classNames(styles.item) }
                                onClick={ onMessagesShowRequested }
                            >
                                Messages
                            </button>
                            {
                                jobApplication.status !== 'withdrawn' && jobApplication.status !== 'rejected'
                                && jobApplication.status !== 'placed' &&
                                <RequiresPermission roles={ [ 'job_application_withdraw' ] }>
                                    <button
                                        type="button"
                                        className={ classNames(styles.item) }
                                        onClick={ () => {
                                            history.push(`/my-jobs/job/${ jobApplication.job
                                                .id }/candidate/${ jobApplication.id }/withdraw-candidate`);
                                        } }
                                    >
                                        Withdraw
                                    </button>
                                </RequiresPermission>
                            }
                            { (jobApplication.status === 'submitted' ||
                                jobApplication.status === 'interviewing' ||
                                jobApplication.status === 'offered') &&
                            <RequiresPermission roles={ [ 'job_application_reject' ] }>
                                <button
                                    type="button"
                                    className={ classNames(styles.item) }
                                    onClick={ () => {
                                        history.push(`/jobs/${ jobApplication.job
                                            .id }/candidate/${ jobApplication.id }/reject`);
                                    } }
                                >
                                    Reject candidate
                                </button>
                            </RequiresPermission>
                            }
                            {
                                (jobApplication.status === 'submitted' ||
                                    jobApplication.status === 'interviewing' ||
                                    (jobApplication.status === 'offered' &&
                                        jobApplication.offers.length === 0)) &&
                                <RequiresPermission roles={ [ 'job_application_offer' ] }>
                                    <button
                                        data-test={ TEST_IDS.JOBS_CANDIDATE_ACTION_OFFER }
                                        type="button"
                                        className={ classNames(styles.item) }
                                        onClick={ () => {
                                            history.push(`/jobs/${ jobApplication.job
                                                .id }/candidate/${ jobApplication.id }/offer`);
                                        } }
                                    >
                                        Offer
                                    </button>
                                </RequiresPermission>
                            }
                            {
                                jobApplication.status === 'offered' &&
                                jobApplication.offers.length > 0 &&
                                <button
                                    data-test={ TEST_IDS.JOBS_CANDIDATE_ACTION_RECRUITER_OFFER }
                                    type="button"
                                    className={ classNames(styles.item) }
                                    onClick={ () =>
                                        onShowOfferDetail(jobApplication.id, jobApplication.offers[ 0 ].id) }
                                >
                                    View Offer
                                </button>
                            }
                            {
                                (jobApplication.status === 'submitted' ||
                                    jobApplication.status === 'interviewing') &&
                                <RequiresPermission roles={ [ 'job_application_schedule_interview' ] }>
                                    <button
                                        type="button"
                                        className={ classNames(styles.item) }
                                        onClick={ () => {
                                            history.push(`/jobs/${ jobApplication.job
                                                .id }/candidate/${ jobApplication.id }/schedule-interview`);
                                        } }
                                    >
                                        Schedule Interview
                                    </button>
                                </RequiresPermission>
                            }
                            <button
                                type="button"
                                className={ classNames(styles.item) }
                                onClick={ () => onApplicationSelected(jobApplication) }
                            >
                                View candidate
                            </button>
                            <button
                                type="button"
                                className={ classNames(styles.item) }
                                onClick={ onMessagesShowRequested }
                            >
                                Messages
                            </button>
                        </Fragment>
                    }
                />
            </TableCell>
        </TableRow>
    );
};

JobApplicationTableRow.propTypes = {
    jobApplication: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    onApplicationSelected: PropTypes.func.isRequired,
    onRecruiterSelected: PropTypes.func.isRequired,
    onMessagesShowRequested: PropTypes.func.isRequired,
    onShowInterviewDetail: PropTypes.func.isRequired,
    onShowOfferDetail: PropTypes.func.isRequired,
    showRecruiter: PropTypes.bool,
    showFiles: PropTypes.bool,
};

class JobApplicationTable extends Component {
    state = {
        recruiterId: null,
        messageModalId: null,
        applicationId: null,
        interviewId: null
    };

    onMessagesShowRequested = (messageModalId) => {
        this.setState({ messageModalId });
    };

    onRecruiterSelected = recruiterId => {
        this.setState({ recruiterId });
    };

    render() {
        const {
            jobApplications = [],
            job,
            className,
            staticContext,
            onShowInterviewDetail,
            onShowOfferDetail,
            history,
            ...otherProps
        } = this.props;
        return (
            <Fragment>
                { this.state.messageModalId && (
                    <ThreadModal
                        toggle={ () => this.setState({ messageModalId: null }) }
                        threadId={ this.state.messageModalId }
                    />
                ) }
                { this.state.recruiterId && (
                    <RecruiterModalComponent
                        toggle={ () => this.setState({ recruiterId: null }) }
                        recruiterId={ this.state.recruiterId }
                    />
                ) }
                <Table type="job-application job-application-width">
                    { jobApplications.map(jobApplication => (
                        <JobApplicationTableRow
                            history={ history }
                            key={ jobApplication.id }
                            jobApplication={ jobApplication }
                            className={ className }
                            onMessagesShowRequested={ () => {
                                this.onMessagesShowRequested(jobApplication.id);
                            } }
                            onRecruiterSelected={ () => {
                                this.onRecruiterSelected(jobApplication.recruiter.id);
                            } }
                            onShowInterviewDetail={ onShowInterviewDetail }
                            onShowOfferDetail={ onShowOfferDetail }
                            { ...otherProps }
                        />
                    )) }
                    { jobApplications.length === 0 && (
                        <tr className="card no-items-row">
                            <td>
                                <span>You currently have no candidates submitted</span>
                            </td>
                        </tr>
                    ) }
                </Table>
            </Fragment>
        );
    }
}

JobApplicationTable.propTypes = {
    jobApplications: PropTypes.array.isRequired,
    job: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    className: PropTypes.string,
    staticContext: PropTypes.string,
    onShowInterviewDetail: PropTypes.func.isRequired,
    onShowOfferDetail: PropTypes.func.isRequired,
};


export const JobTabCandidatesComponent = (props) => {
    const { job, history, activeId, viewType, statusFilter = 'all', isEmployer } = props;
    return (
        <TabPanel
            withBg={ false }
            tabId="candidates"
        >
            <JobApplicationTable
                history={ history }
                job={ job }
                onApplicationSelected={ application => {
                    history.push(
                        isEmployer ?
                            `/jobs/${ application.job.id }/candidate/${ application.id }` :
                            `/${ viewType }/job/${ job.id }/candidate/${ application.id }`
                    );
                } }
                onShowInterviewDetail={ (applicationId, interviewId) => {
                    history.push(
                        isEmployer ?
                            `/jobs/${ job.id }/candidate/${ applicationId }/interview/${ interviewId }` :
                            `/${ viewType }/job/${ job.id }/candidate/${ applicationId }/interview/${ interviewId }`
                    );
                } }
                onShowOfferDetail={ (applicationId, interviewId) => {
                    history.push(
                        isEmployer ?
                            `/jobs/${ job.id }/candidate/${ applicationId }/offer/${ interviewId }` :
                            `/${ viewType }/job/${ job.id }/candidate/${ applicationId }/offer/${ interviewId }`
                    );
                } }
                jobApplications={
                    isEmployer ? job.appliedRecruiters
                        .reduce(
                            (applications, recruiter) => {
                                applications = applications.concat(recruiter.applications);
                                return applications;
                            },
                            [],
                        )
                        .filter(it => {
                            if (statusFilter && statusFilter !== 'all') {
                                return it.status.toLowerCase() === statusFilter.toLowerCase();
                            }
                            return true;
                        }) : job.myApplication ? [ ...job.myApplication.applications ] : []
                        .filter(it => {
                            if (statusFilter && statusFilter !== 'all') {
                                return it.status.toLowerCase() === statusFilter.toLowerCase();
                            }
                            return true;
                        })
                }
                showRecruiter={ isEmployer }
                showFiles={ !isEmployer }
                selected={ isEmployer ? [ activeId ] : null }
            />
        </TabPanel>
    );
};

JobTabCandidatesComponent.propTypes = {
    job: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    activeId: PropTypes.string,
    viewType: PropTypes.string,
    statusFilter: PropTypes.string,
    isEmployer: PropTypes.bool,
};

export default JobTabCandidatesComponent;
