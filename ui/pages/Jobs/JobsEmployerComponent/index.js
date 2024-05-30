import React, { Component, Fragment }                from 'react';
import PropTypes                                     from 'prop-types';
import { generatePath }                              from 'react-router-dom';
import { graphql, createFragmentContainer }          from 'react-relay';
import { Row }                                       from 'reactstrap';
import SelectJobStatusComponent                      from '../SelectJobStatusComponent';
import JobFilterComponent                            from '../JobFilterComponent';
import { environment }                               from '../../../../api';
import DownIcon                                      from '../../../../assets/icons/DownIcon';
import DeleteJobMutation                             from '../../../../mutations/DeleteJobMutation';
import TEST_IDS                                      from '../../../../tests/testIds';
import getQueryString                                from '../../../../util/getQueryString';
import RowItemComponent, { STATUS }                  from '../../../components/RowItemComponent';
import RequiresPermission                            from '../../../components/User/RequiresPermission';
import { Confirm }                                   from '../../../components/Modal';
import DropDownComponent                             from '../../../components/DropDownComponent';
import {
    JobFilters,
    JOBS_QUERY_TYPE,
    ROUTES,
    CLONE_JOB_ID,
}                                                    from '../../../../constants';
import ButtonComponent, { BUTTON_SIZE, BUTTON_TYPE } from '../../../components/ButtonComponent';
import classNames                                    from 'classnames';
import styles                                        from './styles.scss';

const JobTablePart = (props) => {
    const {
        data,
        filter,
        onJobSelected,
        onJobDelete,
        onJobClone,
        onJobEdit,
    } = props;
    const filteredJobs = data.jobs.filter(filter);
    return (
        <div>
            { filteredJobs.map(job =>
                <RowItemComponent
                    key={ job.id }
                    header={
                        <ButtonComponent
                            btnType={ BUTTON_TYPE.LINK_ACCENT }
                            size={ BUTTON_SIZE.SMALL }
                            onClick={ () => onJobSelected(job) }
                            dataTest={ TEST_IDS.JOB_TITLE }
                        >
                            { job.title ? job.title : 'No title has been set' }
                        </ButtonComponent>
                    }
                    infoText={
                        <Fragment>
                            <div className={ styles.location }>{ job.suburb }{ ' ' }{ job.state }</div>
                            { job.company && <span>{ ' ' }{ job.company }</span> }
                        </Fragment>
                    }
                    jobType
                    classNameStart={ styles.start }
                    classNameMiddle={ styles.middle }
                    classNameEnd={ styles.end }
                    linksBox={
                        <Fragment>
                            <ButtonComponent
                                className={ job.candidateCount > 0 ? styles.robButtonActive : styles.robButton }
                                btnType={ job.candidateCount > 0 ? BUTTON_TYPE.ACCENT : BUTTON_TYPE.WHITE }
                                size={ BUTTON_SIZE.SMALL }
                                onClick={ () => onJobSelected(job, 'candidates') }
                            >
                                { job.candidateCount } { ' ' }Candidates
                            </ButtonComponent>
                            <ButtonComponent
                                className={ job.candidateCount > 0 ? styles.robButtonActive : styles.robButton }
                                btnType={ job.candidateCount > 0 ? BUTTON_TYPE.ACCENT : BUTTON_TYPE.WHITE }
                                size={ BUTTON_SIZE.SMALL }
                                onClick={ () => onJobSelected(job, 'recruiters') }
                            >
                                { job.recruiterCount } { ' ' }Recruiters
                            </ButtonComponent>
                        </Fragment>
                    }
                    status={ { engaged: STATUS.HIGHLIGHT, open: STATUS.WARNING, filled: STATUS.SUCCESS }[ job.status ] }
                    statusText={ job.status }
                    actions={
                        <DropDownComponent
                            dataTest={ TEST_IDS.JOB_ACTIONS }
                            labelClassName={ styles.dropDownLabel }
                            label={
                                <Fragment>Actions{ ' ' }<DownIcon /></Fragment>
                            }
                            selectClassName={ styles.dropDownSelect }
                            select={
                                <Fragment>
                                    <RequiresPermission roles={ [ 'job_delete' ] }>
                                        <button
                                            type="button"
                                            className={ classNames(styles.item) }
                                            onClick={ () => onJobDelete(job) }
                                        >
                                            Delete
                                        </button>
                                    </RequiresPermission>
                                    <button
                                        data-test={ TEST_IDS.JOB_ACTION_EDIT }
                                        type="button"
                                        className={ classNames(styles.item) }
                                        onClick={ () => {onJobEdit(job.id);} }
                                    >
                                        Edit job
                                    </button>
                                    <button
                                        type="button"
                                        className={ classNames(styles.item) }
                                        onClick={ () => {onJobClone(job.id);} }
                                    >
                                        Copy job
                                    </button>
                                </Fragment>
                            }
                        />
                    }
                />
            ) }
            { filteredJobs.length === 0 && (
                <div>
                    No jobs matched the criteria
                </div>
            ) }
        </div>
    );
};

JobTablePart.propTypes = {
    data: PropTypes.object.isRequired,
    filter: PropTypes.func.isRequired,
    onJobSelected: PropTypes.func.isRequired,
    onJobDelete: PropTypes.func.isRequired,
    onJobClone: PropTypes.func.isRequired,
    onJobEdit: PropTypes.func.isRequired,
    type: PropTypes.string,
};

const JobTable = createFragmentContainer(
    JobTablePart,
    {
        data: graphql`
            fragment JobsEmployerComponent_data on Viewer
            @argumentDefinitions(jobStatus: { type: JobStatusFilter, defaultValue: All }) {
                jobs(status: $jobStatus) {
                    id
                    title
                    suburb
                    state
                    status
                    recruiterCount
                    candidateCount
                }
            }
        `,
    },
);

class JobsEmployerComponent extends Component {
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
        if (filter === JobFilters.all) {
            this.props.history.push('/jobs');
        } else {
            this.props.history.push(`/jobs/${ filter }`);
        }
    };
    onChangeFilterText = filterText => {
        this.setState({ filterText });
    };

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

    onJobDelete = job => {

        Confirm(
            <div className="confirmations-title">
                <p>Are you sure you wish to delete this job?</p>
            </div>,
            {
                proceed: 'Delete',
                cancel: 'Cancel',
                title: 'Delete job',
            },
        )
            .then(
                () => {
                    DeleteJobMutation.commit(
                        environment,
                        job,
                    )
                        .then(this.props.reload);
                },
                () => {},
            );
    };

    render() {
        const { handleSelectJobStatus, filterJob } = this;
        const { jobStatus } = this.state;
        const { data, history, tab } = this.props;

        return (
            <Fragment>
                <Row className="sub-nav no-gutters">
                    <JobFilterComponent
                        activeFilter={ tab || JobFilters.all }
                        data={ data }
                        visible={ [
                            'all',
                            'draft',
                            'active',
                            'closed',
                        ] }
                        onChangeFilter={ this.onChangeFilter }
                        filterText={ this.state.filterText }
                        onChangeFilterText={ this.onChangeFilterText }
                    />
                </Row>
                <Row className="no-gutters mb-3 d-flex justify-content-end align-items-center">
                    <SelectJobStatusComponent
                        className={ styles.dropDown }
                        onSetValue={ handleSelectJobStatus }
                        jobStatus={ jobStatus }
                        isUser
                    />
                    <div
                        className={ classNames(
                            styles.row,
                            styles.rowRight,
                        ) }
                    >
                        <RequiresPermission roles={ [ 'job_create' ] }>
                            <ButtonComponent
                                dataTest={ TEST_IDS.CREATE_JOB_ROUTE }
                                btnType={ BUTTON_TYPE.ACCENT }
                                size={ BUTTON_SIZE.BIG }
                                to={ generatePath(ROUTES.JOB_NEW) }
                            >
                                CREATE JOB
                            </ButtonComponent>
                        </RequiresPermission>
                    </div>
                </Row>
                <div>
                    <JobTable
                        data={ data }
                        filter={ filterJob }
                        onJobEdit={ jobId => {
                            history.push(`/jobs/${ jobId }/edit/job-description`);
                        } }
                        onJobSelected={ (job, newTab) => {
                            history.push(`/jobs/${ job.id }${ newTab ? `/${ newTab }` : '' }`);
                        } }
                        onJobDelete={ this.onJobDelete }
                        onJobClone={ (jobId) => {
                            history.push(
                                generatePath(ROUTES.JOB_NEW) + getQueryString({ [ CLONE_JOB_ID ]: jobId }),
                            );
                        } }
                    />
                </div>
            </Fragment>
        );
    }
}

JobsEmployerComponent.propTypes = {
    reload: PropTypes.func,
    data: PropTypes.object,
    history: PropTypes.object.isRequired,
    tab: PropTypes.string,
};

export default JobsEmployerComponent;
