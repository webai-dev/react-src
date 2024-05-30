import {
    observable,
    autorun,
    set,
    computed,
    toJS,
    runInAction,
    action,
    reaction
}                                           from 'mobx';
import SaveJobMutation                      from '../../../../mutations/SaveJobMutation';
import TransitionJobMutation                from '../../../../mutations/TransitionJobMutation';
import { environment }                      from '../../../../api';
import gtmPush, { GTM_EVENTS, GTM_ACTIONS } from '../../../../util/gtmPush';
import * as Yup                             from 'yup';
import Storage                              from '../../../../api/Storage';
import { StorageKeys, JOB_TYPES }           from '../../../../constants';


const createJob = () => {
    return {
        id: null,
        title: '',
        postcode: null,
        suburb: null,
        category: { id: null, name: null },
        type: 'permanent',
        salary: 60000,
        term: null,
        feePercentage: 15,
        status: 'draft',
        vacancies: 1,
        vacancyReason: '',
        files: [],
        uploadedFiles: [],
        description: '',
        compensationAndBenefits: '',
        whoLookingFor: '',
        companyOverview: '',
        publishToMarketplace: true,
        searchType: undefined,
        invitedRecruiters: []
    };
};

class JobStore {
    static publishValidationSchema = Yup.object()
        .shape({
            title: Yup.string()
                .required('Title is required to publish a job'),
            postcode: Yup.string()
                .required('Location is required to publish a job'),
            suburb: Yup.string(),
            category: Yup.string()
                .required('Category is required to publish a job'),
            type: Yup.string()
                .required('Type is required to publish a job'),
            salary: Yup.number()
                .moreThan(0, 'The salary must be at least $1.00')
                .integer()
                .required('Salary is required to publish a job'),
            term: Yup.number()
                .moreThan(1, 'Term must be at least 1 week')
                .integer('You cannot specify partial weeks')
                .when('type', {
                    is: (val) => val !== JOB_TYPES.PERMANENT,
                    then: Yup.number()
                        .required('Length of contract is required to publish a job')
                }),
            feePercentage: Yup.number()
                .moreThan(0, 'Fee must be at least 1%')
                .integer('Fee must be a round number')
                .required('Fee percentage is required to publish a job'),
            minRate: Yup.number()
                .moreThan(-1, 'Minimum rate should be positive number'),
            maxRate: Yup.number()
                .test(
                    'minRate',
                    'Maximum rate should be higher than minimum rate',
                    function (value) { return value ? value >= this.parent.minRate : true;}
                ),
            vacancies: Yup.number()
                .moreThan(0, 'There must be at least one vacancy')
                .integer('You cannot hire half people')
                .required('Vacancies is required to publish a job'),
            vacancyReason: Yup.string()
                .required('You must select a reason for the vacancy'),
            companyOverview: Yup.string()
                .required('Company overview is required to publish a job'),

            description: Yup.string()
                .required('Description is required to publish a job'),
            whoLookingFor: Yup.string()
                .required('Who you\'re looking for is required to publish a job'),
            compensationAndBenefits: Yup.string()
                .required(
                    'Compensation and benefits is required to publish a job'
                ),
            publishToMarketplace: Yup.boolean(),
            searchType: Yup.string()
                .required('Search type is required to publish a job')
        });

    prevReactionDisposer = undefined;
    @observable isSaving = false;
    @observable isStateTransitioning = false;
    errors = observable.array([]);
    @observable hasChanged = false;

    activeJob = observable.object({
        id: null,
        title: '',
        postcode: null,
        suburb: null,
        category: { id: null, name: null },
        type: 'permanent',
        salary: 60000,
        term: null,
        feePercentage: 15,
        status: 'draft',
        vacancies: 1,
        vacancyReason: '',
        files: [],
        uploadedFiles: [],
        description: '',
        compensationAndBenefits: '',
        whoLookingFor: '',
        companyOverview: '',
        publishToMarketplace: true,
        searchType: undefined,
        invitedRecruiters: []
    });

    constructor(store) {
        this.store = store;

        const storageActiveJob = Storage.get(StorageKeys.activeJob);
        if (storageActiveJob) {
            this.setActiveJob(storageActiveJob);
        }

        autorun(() => {
            Storage.set(StorageKeys.activeJob, this.activeJob);
        });
        this.resetUploads();
    }

    @computed
    get isDraft() {
        return this.activeJob.id === null || this.activeJob.status.toLowerCase() === 'draft';
    }

    @action.bound
    setActiveJob(newActiveJob, reset = true) {
        if (this.prevReactionDisposer) {
            this.prevReactionDisposer();
        }

        this.isStateTransitioning = false;
        this.hasChanged = false;
        const newJob = { ...newActiveJob };

        if (newJob.category === null) {
            newJob.category = { id: null, name: null };
        }

        if (reset) {
            set(this.activeJob, { ...createJob(), ...newJob });
            this.setErrors([]);
        } else {
            set(this.activeJob, { ...newJob });
        }

        this.prevReactionDisposer = reaction(
            () => toJS(this.activeJob),
            (job, handleReaction) => {
                runInAction(() => (this.hasChanged = true));
                handleReaction.dispose();
            }
        );
    }

    @action
    save() {
        this.setErrors([]);
        this.isSaving = true;
        const job = this.serializeJob();
        return SaveJobMutation
            .commit(environment, job)
            .catch(({ errors }) => {
                runInAction(() => (this.isSaving = false));
                this.setErrors(
                    errors.reduce((map, error) => {
                        const existing = map[ error.key ] || [];
                        return { ...map, [ error.key ]: [ error.value, ...existing ] };
                    }, {})
                );

                return { errors: errors, job: this.activeJob };
            })
            .then(result => {
                runInAction(() => (this.isSaving = false));
                if (
                    result &&
                    result.mutator &&
                    result.mutator.saveJob &&
                    result.mutator.saveJob.job
                ) {
                    if (!job.id) {
                        gtmPush({
                            event: GTM_EVENTS.CREATE_JOB,
                            action: GTM_ACTIONS.JOB,
                            label: result.mutator.saveJob.job.id,
                        });
                    }
                    this.setActiveJob(result.mutator.saveJob.job, false);
                    this.resetUploads();
                    return { job: this.activeJob, errors: [] };
                }

                return result;
            });
    }

    @action
    setErrors(errors) {
        runInAction(() => (this.isSaving = false));
        this.errors = errors;
    }

    @action
    resetUploads() {
        this.activeJob.uploadedFiles = [];
    }

    validatePrePublish = () => {
        const theJob = this.serializeJob();
        return JobStore.publishValidationSchema
            .validate({ ...theJob }, { abortEarly: false, strict: true, recursive: true })
            .catch(err => {
                const { inner = [] } = err;
                this.setErrors(
                    inner.reduce((map, { path, message }) => {
                        const existing = map[ path ] || [];
                        return { ...map, [ path ]: [ message, ...existing ] };
                    }, {})
                );
                throw err;
            })
            .then((...args) => {
                this.setErrors([]);
                return args;
            });
        // this.transition("publish")
    };

    publish = () => this.transition('publish');
    _isTransitioning = false;

    @action
    transition(transition) {
        if (!this._isTransitioning) {
            this._isTransitioning = true;
            // If no id, save first
            return this.save()
                .then(() => {
                    const ret = this.transition(transition);
                    this._isTransitioning = false;
                    return ret;
                });
        }

        this.isStateTransitioning = true;
        const mutationResult = TransitionJobMutation.commit(environment, this.activeJob, transition);
        return mutationResult
            .then(result => this.setActiveJob(result.mutator.transitionJob.job, false))
            .catch(err => {
                runInAction(() => {
                    this.setErrors(
                        err.errors.reduce((map, error) => {
                            const existing = map[ error.key ] || [];
                            return { ...map, [ error.key ]: [ error.value, ...existing ] };
                        }, {})
                    );
                    this.isStateTransitioning = false;
                    this.lastError = err;
                });
                throw err;
            });
    }

    @action
    toggleRecruiterInvite(recruiter) {
        if (this.activeJob.invitedRecruiters.indexOf(recruiter.id) >= 0) {
            this.activeJob.invitedRecruiters = this.activeJob.invitedRecruiters.filter(
                it => it !== recruiter.id
            );
        } else {
            this.activeJob.invitedRecruiters = [ ...this.activeJob.invitedRecruiters, recruiter.id ];
        }
    }

    serializeJob = () => {
        const retVal = toJS(this.activeJob);
        if (typeof retVal.category === 'object') {
            retVal.category = retVal.category.id;
        }

        return {
            id: retVal.id,
            publishToMarketplace: retVal.publishToMarketplace || undefined,
            searchType: retVal.searchType || undefined,
            title: retVal.title || undefined,
            postcode: retVal.postcode || undefined,
            category: retVal.category || undefined,
            type: retVal.type || undefined,
            term: Number(retVal.term) || undefined,
            salary: Number(retVal.salary),
            feePercentage: Number(retVal.feePercentage) || undefined,
            vacancies: Number(retVal.vacancies),
            vacancyReason: retVal.vacancyReason || undefined,
            files: retVal.uploadedFiles || undefined,
            description: (retVal.description || '').trim() || undefined,
            compensationAndBenefits: (retVal.compensationAndBenefits || '').trim() || undefined,
            whoLookingFor: (retVal.whoLookingFor || '').trim() || undefined,
            companyOverview: (retVal.companyOverview || '').trim() || undefined,
            invitedRecruiters: retVal.invitedRecruiters || undefined,
            minRate: retVal.minRate || 0,
            maxRate: retVal.maxRate || 0,
            rateType: retVal.rateType || undefined,
        };
    };
}

export class StoreJob {
    job = new JobStore(this);
}

const storeJob = new StoreJob();

export default storeJob;
