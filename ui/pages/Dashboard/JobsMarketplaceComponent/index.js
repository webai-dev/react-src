import React                                         from 'react';
import PropTypes                                     from 'prop-types';
import { JobFee, JobType, TempJobSalary }            from '../../../../util/getSalary';
import ButtonComponent, { BUTTON_SIZE, BUTTON_TYPE } from '../../../components/ButtonComponent';
import { Money }                                     from '../../../components/Misc';
import RowItemComponent, { STATUS }                  from '../../../components/RowItemComponent';
import CountersComponent                             from '../../../components/CountersComponent';
import ButtonActionComponent                         from '../../../components/RowItemComponent/ButtonActionComponent';
import styles                                        from './styles.scss';

const JobsMarketplaceComponent = (props) => {
    const {
        activeCount,
        closedCount,
        draftCount,
        pendingCount,
        isEmployer,
        jobs,
        candidates,
    } = props;
    return (
        <div className={ styles.row }>
            <div className={ styles.cardBox }>
                <div className={ styles.card }>
                    <h2>My Jobs</h2>
                    <CountersComponent
                        counters={ [ !isEmployer ?
                            { value: pendingCount, label: 'Pending' } : { value: draftCount, label: 'Draft' },
                            { value: activeCount, label: 'Active' },
                            { value: closedCount , label: 'Closed' }
                        ] }
                    />
                    <h4 className={ styles.pendingTitle }>Current jobs</h4>
                    <div>
                        { jobs && jobs.length ? jobs.slice(0, 3)
                            .map(item => {
                                const job = isEmployer ? item : item.job;
                                return (
                                    <RowItemComponent
                                        key={ job.id }
                                        header={
                                            <ButtonComponent
                                                size={ BUTTON_SIZE.SMALL }
                                                btnType={ BUTTON_TYPE.LINK_ACCENT }
                                                to={ isEmployer ? `/jobs/${ job.id }` : `/my-jobs/job/${ job.id }` }
                                            >
                                                { job.title }
                                            </ButtonComponent>
                                        }
                                        infoText={ <JobType job={ job } /> }
                                        isNoAvatar
                                        isSmall
                                        statusText={
                                            <div className={ styles.jobType }>
                                                <span>
                                                    { job.type === 'temp' && <TempJobSalary job={ job } /> }
                                                    { job.type !== 'temp' && <Money>{ JobFee({ job }) }</Money> }
                                                </span>
                                                <span className={ styles.jobLabel }>
                                                    { job.type === 'temp' ? 'Rate' : 'Fee' }
                                                </span>
                                            </div>
                                        }
                                        actions={
                                            <ButtonActionComponent
                                                to={ isEmployer ? `/jobs/${ job.id }` : `/my-jobs/job/${ job.id }` }
                                                text="View"
                                            />
                                        }
                                    />
                                );
                            }) : <span>No jobs have been published yet</span> }
                    </div>
                    <div className={ styles.buttonsBox }>
                        { isEmployer && (
                            <ButtonComponent
                                className={ styles.button }
                                to="/jobs/new"
                                btnType={ BUTTON_TYPE.ACCENT }
                            >
                                Add new job
                            </ButtonComponent>
                        ) }
                        <ButtonComponent
                            className={ styles.button }
                            to={ isEmployer ? '/jobs' : '/my-jobs' }
                            btnType={ BUTTON_TYPE.ACCENT }
                        >
                            View all jobs
                        </ButtonComponent>
                    </div>

                </div>
            </div>
            <div className={ styles.cardBox }>
                <div className={ styles.card }>
                    <h2>My Candidates</h2>
                    <div>
                        { candidates && candidates.length ? candidates.slice(0, 3)
                            .map(candidate => (
                                <RowItemComponent
                                    key={ candidate.id }
                                    header={ `${ candidate.firstName } ${ candidate.lastName }` }
                                    infoText={ candidate.job.title }
                                    isNoAvatar
                                    isSmall
                                    status={
                                        (candidate.status === 'engaged' && STATUS.SUCCESS) ||
                                        (candidate.status === 'submitted' && STATUS.SUCCESS) ||
                                        (candidate.status === 'placed' && STATUS.SUCCESS) ||
                                        (candidate.status === 'offered' && STATUS.SUCCESS) ||
                                        (candidate.status === 'interviewing' && STATUS.WARNING) ||
                                        (candidate.status === 'open' && STATUS.WARNING) ||
                                        (candidate.status === 'pending' && STATUS.WARNING) ||
                                        (candidate.status === 'withdrawn' && STATUS.HIGHLIGHT) ||
                                        (candidate.status === 'rejected' && STATUS.DANGER)
                                    }
                                    statusText={ candidate.status }
                                    actions={
                                        <ButtonActionComponent
                                            to={ isEmployer ? `/jobs/${
                                                candidate.job ? candidate.job.id : candidate.id
                                                }/candidate/${ candidate.application.id }` : `/my-jobs/job/${
                                                candidate.job ? candidate.job.id : candidate.id
                                                }/candidate/${ candidate.application.id }` }
                                            text="View"
                                        />
                                    }
                                />
                            )) : <span>No candidates have been submitted yet</span> }
                    </div>
                </div>
            </div>
        </div>
    );
};

JobsMarketplaceComponent.propTypes = {
    activeCount: PropTypes.number,
    closedCount: PropTypes.number,
    draftCount: PropTypes.number,
    pendingCount: PropTypes.number,
    isEmployer: PropTypes.bool,
    jobs: PropTypes.array,
    candidates: PropTypes.array,
};

export default JobsMarketplaceComponent;
