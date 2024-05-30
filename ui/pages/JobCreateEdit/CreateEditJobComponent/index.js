import React, { Component, Fragment }                from 'react';
import PropTypes                                     from 'prop-types';
import { generatePath }                              from 'react-router-dom';
import storeJob                                      from './storeJob';
import { isDevelopment, JOB_ID, JOB_TAB, ROUTES }    from '../../../../constants';
import TEST_IDS                                      from '../../../../tests/testIds';
import ActionsRowComponent                           from '../../../components/ActionsRowComponent';
import HeaderRowButtonComponent                      from '../../../components/HeaderRowButtonComponent';
import HeaderRowComponent                            from '../../../components/HeaderRowComponent';
import {
    UncontrolledTooltip,
}                                                    from 'reactstrap';
import ButtonComponent, { BUTTON_TYPE, BUTTON_SIZE } from '../../../components/ButtonComponent';
import RecruiterModalComponent                       from '../../../components/RecruiterModalComponent';
import { ErrorList }                                 from '../../../components/Misc';
import {
    Confirm,
}                                                    from '../../../components/Modal';
import {
    observer,
    inject, Provider,
}                                                    from 'mobx-react';
import {
    runInAction,
    action,
    set,
}                                                    from 'mobx';
import { toast }                                     from 'react-toastify';
import RequiresPermission                            from '../../../components/User/RequiresPermission';
import SearchTypeTab                                 from './Tabs/SearchTypeTab';
import JobDescriptionTab                             from './Tabs/JobDescriptionTab';
import RecruiterSelectionTab                         from './Tabs/RecruiterSelectionTab';
import debounce                                      from 'lodash/debounce';
import styles                                        from './styles.scss';

const AUTO_SAVE_TIME = 10000;

class CreateEditJobComponent extends Component {
    static defaultProps = {
        onJobSave: () => {},
        firstJob: false,
        recruiterFilter: 'all',
    };

    state = {
        timeTillSave: AUTO_SAVE_TIME / 1000,
        viewRecruiter: null,
        isFormSubmitted: false,
    };

    constructor(props) {
        super(props);
        this.initStore();
    }

    @action
    initStore() {
        if (this.props.job) {
            this.setJobFromServer(this.props.job);
        } else {
            this.setJobFromServer(
                {
                    region: this.props.viewer.user.company.region,
                    city: this.props.viewer.user.company.city,
                    companyOverview: this.props.viewer.user.company.overview,
                },
                false,
            );
        }
    }

    onChangeSearchType = searchType => {
        runInAction(
            'set-search-field-value',
            () =>
                set(
                    this.props.storeJob.job.activeJob,
                    { searchType: searchType },
                ),
        );
    };

    saveJob = () => {
        if (
            this.props.storeJob.job.activeJob.status &&
            this.props.storeJob.job.activeJob.status !== 'draft'
        ) {
            this.props.storeJob.job.validatePrePublish()
                .then(() => {
                    return this.doSaveJob();
                });
        } else {
            this.doSaveJob(true);
        }
    };
    doSaveJob = (isJobDraft) => {
        this.setState({ isFormSubmitted: true });
        this.props.store.notifications.startSaveNotification();
        this.props.storeJob.job
            .save()
            .then(({ errors }) => {
                if (errors && errors.length > 0) {
                    toast.error('There was an error saving the job, please check the form');
                } else {
                    this.props.store.notifications.stopSaveNotification();

                    this.props.onJobSave();

                    toast.success(
                        isJobDraft ? 'This job has been saved as a draft in your "My Jobs" tab' : 'You successfully edited job',
                        { className: isDevelopment && TEST_IDS.EDIT_JOB_SUCCESS }
                    );
                }
            })
            .catch(() => {
                toast.error('There was an error saving the job, please check the form');
            });
    };

    publishJob = () => {
        this.props.storeJob.job
            .validatePrePublish()
            .then(() => {
                Confirm(
                    <div>
                        <p className="text-center">
                            You agree to the{ ' ' }
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://www.sourcr.com/terms-and-conditions/"
                            >
                                Terms of Use
                            </a>
                            { ' ' }
                            and{ ' ' }
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://www.sourcr.com/privacy-policy/"
                            >
                                Privacy Policy
                            </a>
                            { ' ' }
                            of Sourcr when publishing this Job
                        </p>
                    </div>,
                    {
                        proceed: 'Publish',
                        cancel: 'Save as draft',
                        title: 'Publish job',
                    },
                )
                    .then(
                        () => {
                            this.props.store.notifications.startSaveNotification('Publishing job');
                            return this.props.storeJob.job
                                .publish()
                                .then(() => {
                                    this.props.store.notifications.stopSaveNotification(
                                        undefined,
                                        'Job published',
                                    );
                                    this.props.history.push('/jobs');
                                    toast.success('You successfully published a job');
                                })
                                .catch(() => {
                                    this.props.store.notifications.stopSaveNotification(
                                        undefined,
                                        'Unable to publish job, please check errors',
                                    );
                                });
                        },
                        () => {
                            this.props.store.notifications.startSaveNotification();
                            return this.props.storeJob.job
                                .save()
                                .then(() => {
                                    this.props.store.notifications.stopSaveNotification();
                                    this.props.history.push('/jobs');
                                })
                                .catch(() => {
                                    this.props.store.notifications.stopSaveNotification(
                                        undefined,
                                        'Unable to publish job, please check errors',
                                    );
                                });
                        },
                    );
            })
            .catch(err => {
                const { inner: [ firstError ] } = err;
                const tab = this.tabFor(firstError.path);
                if (this.props.tab !== tab) {
                    const { id } = this.props.storeJob.job.activeJob;
                    this.props.history.push(!id ? `/jobs/new/${ tab }` : `/jobs/${ id }/edit/${ tab }`);
                }
                this.onClickError(firstError.path);
            });
    };

    onClickError = name => {
        let el = document.getElementById(name);
        if (
            [
                'whoLookingFor',
                'compensationAndBenefits',
                'companyOverview',
                'description',
            ].indexOf(
                name,
            ) >= 0
        ) {
            el = el.getElementsByClassName('public-DraftEditor-content')[ 0 ];
        }
        if (el) {
            if (el.focus) {
                setTimeout(
                    () => el.focus(),
                    0,
                );
            }
            if (el.scrollIntoView) {
                setTimeout(
                    () => {
                        el.scrollIntoView({ alignToTop: false });
                    },
                    0,
                );
            }
        }
    };

    tabFor = errorPath => {
        if (errorPath === 'searchType') {
            return 'search-type';
        }
        return 'job-description';
    };

    componentWillMount() {
        if (this.props.isEdit && this.props.job) { // edit job
            this.setJobFromServer(this.props.job);
            return;
        }
        if (!this.props.isEdit && this.props.cloneJob) { // create job from clone
            this.setJobFromServer({ ...this.props.cloneJob, appliedRecruiters: [] });
            return;
        }
        if (!this.props.isEdit && !this.props.cloneJob && this.props.storeJob.job.activeJob.id) {
            this.props.storeJob.job.setActiveJob({});
        }
    }

    @action
    setJobFromServer(job, reset = true) {
        this.props.storeJob.job.setActiveJob(
            job,
            reset,
        );
        if (job.appliedRecruiters) {
            job.appliedRecruiters.map(it => {
                this.props.storeJob.job.toggleRecruiterInvite(it.recruiter);
            });
        }
    }

    @action
    onRecruiterSelected(recruiter) {
        this.props.storeJob.job.toggleRecruiterInvite(recruiter);
    }

    render() {
        const { isFormSubmitted } = this.state;
        const {
            tab,
            viewer: { recruiters, jobCategories, verified, user },
            storeJob: { job: jobStore },
        } = this.props;

        const activeJob = jobStore.activeJob;
        const activeTab = tab || 'job-description';
        const { id, publishToMarketplace } = activeJob;
        const isLoading = this.props.storeJob.job.isSaving || this.props.storeJob.job.isStateTransitioning;

        return (
            <div>
                { this.state.viewRecruiter && (
                    <RecruiterModalComponent
                        toggle={ () => this.setState({ viewRecruiter: undefined }) }
                        recruiterId={ this.state.viewRecruiter }
                    />
                ) }
                <div className="job-filter-container">
                    <HeaderRowComponent
                        tabs={
                            <Fragment>
                                <HeaderRowButtonComponent
                                    url={ !id ?
                                        generatePath(ROUTES.JOB_NEW, { [ JOB_TAB._NAME ]: JOB_TAB.JOB_DESCRIPTION }) :
                                        generatePath(ROUTES.JOB_EDIT, {
                                            [ JOB_TAB._NAME ]: JOB_TAB.JOB_DESCRIPTION,
                                            [ JOB_ID ]: id
                                        })
                                    }
                                    label="Job description"
                                    isActive={ !tab || tab === 'job-description' }
                                />
                                <HeaderRowButtonComponent
                                    dataTest={ TEST_IDS.CREATE_JOB_SEARCH_TYPE_ROUTE }
                                    url={ !id ?
                                        generatePath(ROUTES.JOB_NEW, { [ JOB_TAB._NAME ]: JOB_TAB.SEARCH_TYPE }) :
                                        generatePath(ROUTES.JOB_EDIT, {
                                            [ JOB_TAB._NAME ]: JOB_TAB.SEARCH_TYPE,
                                            [ JOB_ID ]: id
                                        })
                                    }
                                    label="Search type"
                                    isActive={ tab === 'search-type' }
                                />
                                <HeaderRowButtonComponent
                                    url={ !id ?
                                        generatePath(ROUTES.JOB_NEW, { [ JOB_TAB._NAME ]: JOB_TAB.RECRUITERS }) :
                                        generatePath(ROUTES.JOB_EDIT, {
                                            [ JOB_TAB._NAME ]: JOB_TAB.RECRUITERS,
                                            [ JOB_ID ]: id
                                        })
                                    }
                                    label="Add recruiters"
                                    isActive={ tab === 'recruiters' }
                                />
                            </Fragment>
                        }
                    />
                    <ActionsRowComponent
                        itemActions={
                            <ButtonComponent
                                className={ styles.button }
                                to={ this.props.isEdit ? `/jobs/${ this.props.job.id }` : '/jobs' }
                                btnType={ BUTTON_TYPE.WHITE }
                                size={ BUTTON_SIZE.BIG }
                            >
                                { this.props.isEdit ? 'Back' : ' Cancel' }
                            </ButtonComponent>
                        }
                        pageActions={
                            <Fragment>
                                <RequiresPermission roles={ [ this.props.storeJob.job.isDraft ? 'job_create' : 'job_edit' ] }>
                                    <ButtonComponent
                                        className={ styles.button }
                                        size={ BUTTON_SIZE.BIG }
                                        dataTest={ TEST_IDS.SAVE_JOB_SUBMIT }
                                        disabled={ isLoading }
                                        main
                                        btnType={ BUTTON_TYPE.ACCENT }
                                        onClick={ this.saveJob }
                                    >
                                        Save
                                    </ButtonComponent>
                                </RequiresPermission>

                                { this.props.storeJob.job.isDraft && (
                                    <Fragment>
                                        { verified === false && (
                                            <UncontrolledTooltip
                                                placement="right"
                                                target="publishJobButton"
                                            >
                                                Verify your email to submit or alternatively save to draft
                                            </UncontrolledTooltip>
                                        ) }

                                        <RequiresPermission roles={ [ 'job_publish' ] }>
                                            <ButtonComponent
                                                size={ BUTTON_SIZE.BIG }
                                                dataTest={ TEST_IDS.PUBLISH_JOB_SUBMIT }
                                                disabled={ isLoading }
                                                main
                                                btnType={ BUTTON_TYPE.ACCENT }
                                                id="publishJobButton"
                                                onClick={ verified ? this.publishJob : () => false }
                                            >
                                                Publish
                                            </ButtonComponent>
                                        </RequiresPermission>

                                    </Fragment>
                                ) }
                            </Fragment>
                        }
                    />
                </div>
                <ErrorList
                    key="error-list"
                    title="There were errors with the submitted form"
                    errors={ Object.entries(jobStore.errors)
                        .map(([ key, value ]) => {
                            return {
                                key,
                                value: (
                                    <span
                                        style={ { cursor: 'pointer' } }
                                        key={ key }
                                        onClick={ () => this.onClickError(key) }
                                    >{ `${ value }` }</span>
                                ),
                            };
                        }) }
                />
                { activeTab === 'job-description' &&
                <JobDescriptionTab
                    user={ user }
                    relay={ this.props.relay }
                    jobStore={ jobStore }
                    jobCategories={ jobCategories }
                    isFormSubmitted={ isFormSubmitted }
                    isEngaged={ this.props.job && this.props.job.appliedRecruiters.length }
                />
                }
                { activeTab === 'search-type' &&
                <SearchTypeTab
                    errors={ jobStore.errors[ 'searchType' ] }
                    searchType={ activeJob.searchType }
                    onChangeSearchType={ this.onChangeSearchType }
                />
                }
                { activeTab === 'recruiters' &&
                <div>
                    <RecruiterSelectionTab
                        onChangeRecruiterFilter={ recruiterFilter =>
                            this.setState({ recruiterFilter }) }
                        filter={ this.state.recruiterFilter }
                        publishToMarketplace={ publishToMarketplace }
                        onRecruiterSelected={ recruiter => {
                            this.onRecruiterSelected(recruiter);
                        } }
                        onViewClick={ ({ id: viewRecruiterId }) => {
                            this.setState({ viewRecruiter: viewRecruiterId });
                        } }
                        toggleNetworkSelection={ debounce(() =>
                            runInAction(
                                () => (activeJob.publishToMarketplace = !publishToMarketplace),
                            ), 50) }
                        recruiters={ recruiters }
                        invitedRecruiters={ activeJob.invitedRecruiters }
                    />
                </div>
                }
            </div>
        );
    }
}

CreateEditJobComponent.propTypes = {
    job: PropTypes.object,
    storeJob: PropTypes.object,
    relay: PropTypes.object,
    store: PropTypes.object,
    tab: PropTypes.string,
    history: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,
    cloneJob: PropTypes.object,
    onJobSave: PropTypes.func.isRequired,
    isEdit: PropTypes.bool,
};

const CreateEditJobComponentPass = inject('storeJob')(
    observer(CreateEditJobComponent),
);

const CreateEditJobComponentWithStore = (props) => {
    return (
        <Provider storeJob={ storeJob }>
            <CreateEditJobComponentPass { ...props } />
        </Provider>
    );
};

export default inject('store')(
    observer(CreateEditJobComponentWithStore),
);
