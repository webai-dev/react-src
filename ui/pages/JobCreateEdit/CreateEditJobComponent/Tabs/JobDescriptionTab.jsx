import React, { Component, Fragment } from 'react';
import Dropzone                       from 'react-dropzone';
import { observer }                   from 'mobx-react';
import Table                          from '../../../../components/Table/Table';
import TableRow                       from '../../../../components/Table/TableRow';
import TableCell                      from '../../../../components/Table/TableCell';
import { TextArea }                   from '../../../../components/Form';
import LocationCustomInputComponent   from '../../../../components/LocationCustomInputComponent';
import { Button }                     from '../../../../components/Button';
import InputComponent                 from '../../../../components/Form/InputComponent';
import FixedInputComponent            from '../../../../components/Form/FixedInputComponent';
import SelectComponent                from '../../../../components/SelectComponent';
import RemoveJobFileMutation          from '../../../../../mutations/RemoveJobFileMutation';
import { JobFee }                     from '../../../../../util/getSalary';
import getNumberFromString            from '../../../../../util/getNumberFromString';
import {
    runInAction,
    set,
    values,
    toJS,
}                                     from 'mobx';
import {
    Row,
    Col,
    Collapse,
    Alert,
    Form,
    FormFeedback,
}                                     from 'reactstrap';
import classNames                     from 'classnames';
import styles                         from './styles.scss';

@observer
class JobDescriptionTab extends Component {
    jobChangeCallbackCache = {};
    state = { invalidDocuments: [] };

    onDropDocuments = (acceptedDocuments, rejectedDocuments) => {
        const curDocs = this.props.jobStore.activeJob.uploadedFiles;
        let docCounter = curDocs.length || 0;

        const documents = acceptedDocuments.map(it => {
            return {
                file: it,
                id: `accepted-${ ++docCounter }`,
                valid: true,
            };
        });

        const rejectedDocs = rejectedDocuments.map(it => {
            return {
                file: it,
                id: `rejected-${ ++docCounter }`,
                valid: false,
            };
        });

        runInAction(() =>
            set(
                this.props.jobStore.activeJob,
                {
                    uploadedFiles: [
                        ...documents,
                        ...rejectedDocs,
                        ...curDocs
                    ],
                },
            ),
        );

        this.setState({
            invalidDocuments: rejectedDocs.map(it => it.id),
        });
    };

    onRequestRemoveUploadedDocuments = documentIds => {
        const docIdArray = Array.isArray(documentIds) ? documentIds : [ documentIds ];
        if (docIdArray.length > 0) {
            const invalidDocuments = [];
            const documents = [];
            for (let doc of this.props.jobStore.activeJob.uploadedFiles) {
                if (docIdArray.indexOf(doc.id) >= 0) {
                    continue;
                }

                if (!doc.valid) {
                    invalidDocuments.push(doc.id);
                }

                documents.push(doc);
            }
            runInAction(() => set(
                this.props.jobStore.activeJob,
                { uploadedFiles: documents },
            ));
            this.setState({ invalidDocuments });
        }
    };

    onRequestRemoveExistingDocument = file => {
        RemoveJobFileMutation.commit(
            this.props.relay.environment,
            this.props.jobStore.activeJob.id,
            file.id,
        )
            .then(({ mutator }) => {
                this.props.jobStore.setActiveJob(
                    {
                        ...mutator.removeJobFile.job
                    },
                    false,
                );
            });
    };

    componentWillUnmount() {
        this.jobChangeCallbackCache = {};
        values(this.props.jobStore.activeJob.uploadedFiles)
            .forEach(doc => {
                window.URL.revokeObjectURL(doc.file.preview);
            });
    }

    createJobFieldChangeHandler = (name, type) => {
        const getChangeValue = (event, type) => {
            if (type === 'choice') {
                return event.target.value;
            }
            if (type === 'textarea') {
                return event;
            }

            const element = event.target;

            return element.value;
        };

        if (!this.jobChangeCallbackCache[ `${ name }:${ type }` ]) {
            this.jobChangeCallbackCache[ `${ name }:${ type }` ] = event => {
                const parts = name.split('.');
                const value = getChangeValue(
                    event,
                    type,
                );
                let newName = name;
                let obj = this.props.jobStore.activeJob;
                if (parts.length > 1) {
                    newName = parts.splice(
                        -1,
                        1,
                    )[ 0 ];
                    obj = parts.reduce(
                        (o, i) => o[ i ],
                        obj,
                    );
                }
                runInAction(() => {
                    set(
                        obj,
                        newName,
                        value,
                    );
                });
            };
        }

        return this.jobChangeCallbackCache[ `${ name }:${ type }` ];
    };

    /**
     * Handle location change
     *
     * @param {string} postcode
     * @param {string} suburb
     */
    handleChangeLocation = (postcode, suburb) => {
        runInAction(() => {
            set(
                this.props.jobStore.activeJob,
                {
                    postcode,
                    suburb: (suburb || '').split(',')[ 0 ],
                },
            );
        });
    };

    renderValidation = key => {
        const errors = this.props.jobStore.errors[ key ];
        if (errors && errors.length > 0) {
            return (
                <FormFeedback style={ { display: 'block' } }>
                    { errors.map(it => <span key={ it }>{ it }</span>) }
                </FormFeedback>
            );
        }
        return '';
    };

    componentDidMount() {
        runInAction(() => {
            set(
                this.props.jobStore.activeJob,
                {
                    companyOverview: this.props.user.company.overview,
                },
            );
        });
    }

    render() {
        const { invalidDocuments } = this.state;
        const { jobCategories, jobStore, isFormSubmitted, isEngaged } = this.props;
        const { handleChangeLocation } = this;
        const activeJob = jobStore.activeJob;

        const HIGHER_FEE_FOR_SINGLE_VACANCY = 12;
        const feeStart = +activeJob.vacancies > 1 ? 10 : HIGHER_FEE_FOR_SINGLE_VACANCY;
        const feeEnd = 30;
        let arrayOfFees = Array.from(
            { length: feeEnd - feeStart + 1 },
            (v, k) => ({
                key: k + feeStart,
                label: k + feeStart,
            }),
        );
        arrayOfFees = isEngaged ? arrayOfFees.filter(({ key }) => key >= activeJob.feePercentage) :
            arrayOfFees;

        const documents = activeJob.files || [];

        return (
            <Form className={ styles.form }>
                <Row className={ styles.row }>
                    <Col>
                        <InputComponent
                            className={ styles.inputTitle }
                            name="title"
                            placeholder="Enter a job title"
                            label="Job title"
                            value={ activeJob.title || '' }
                            setValue={
                                (value) => {
                                    this.createJobFieldChangeHandler('title')(
                                        { target: { value } });
                                }
                            }
                        />
                        { this.renderValidation('title') }
                    </Col>
                </Row>
                <Row>
                    <Col xs={ 6 }>
                        <LocationCustomInputComponent
                            className={ styles.oldInput }
                            name="postcode"
                            isFormSubmitted={ isFormSubmitted }
                            setValue={ handleChangeLocation }
                            label="Job location"
                            value={
                                toJS(activeJob).postcode ?
                                    {
                                        key: toJS(activeJob).postcode,
                                        label: `${ toJS(activeJob).suburb }, ${ toJS(activeJob).postcode }`,
                                    } : null
                            }
                        />
                        { this.renderValidation('postcode') }
                    </Col>
                </Row>
                <Row className={ styles.row }>
                    <Col
                        md={ 6 }
                        lg={ 3 }
                    >
                        <SelectComponent
                            name="category"
                            value={ activeJob.category.id || '' }
                            setValue={ (value) => {
                                this.createJobFieldChangeHandler(
                                    'category.id',
                                    'choice',
                                )(
                                    { target: { value } });
                            } }
                            label="Job Category"
                            values={
                                [ ...jobCategories ]
                                    .sort((a, b) => {
                                        return a.name > b.name ? 1 : -1;
                                    })
                                    .map(it => ({
                                        key: it.id,
                                        label: it.name,
                                    }))
                            }
                        />
                        { this.renderValidation('category') }
                    </Col>
                    <Col
                        md={ 6 }
                        lg={ 3 }
                    >
                        <SelectComponent
                            name="job-type"
                            value={ activeJob.type || '' }
                            setValue={ (value) => {
                                this.createJobFieldChangeHandler(
                                    'type',
                                    'choice',
                                )(
                                    { target: { value } });
                            } }
                            label="Type"
                            values={
                                [
                                    {
                                        key: 'fixed-term',
                                        label: 'Fixed-term',
                                    },
                                    {
                                        key: 'permanent',
                                        label: 'Permanent',
                                    },
                                    {
                                        key: 'temp',
                                        label: 'Temporary',
                                    },
                                ]
                            }
                        />
                        { this.renderValidation('type') }
                    </Col>
                    <Col
                        md={ 6 }
                        lg={ 3 }
                    >
                        {
                            activeJob.type && activeJob.type === 'permanent' &&
                            <InputComponent
                                name="jobTerm"
                                placeholder="Not applicable"
                                setValue={ () => {} }
                                label="Length of contract (weeks)"
                            />
                        }
                        {
                            activeJob.type === 'fixed-term' &&
                            <InputComponent
                                name="term"
                                placeholder="No of Weeks"
                                setValue={ (value) => {
                                    this.createJobFieldChangeHandler('term')(
                                        { target: { value } });
                                } }
                                value={ activeJob.term }
                                modifyValueOnChange={ (salary) => getNumberFromString(
                                    salary,
                                    0,
                                ) }
                                label="Length of contract (weeks)"
                            />
                        }
                        {
                            activeJob.type === 'temp' &&
                            <InputComponent
                                name="temp-type-contract-length"
                                placeholder="No of Weeks"
                                setValue={ (value) => {
                                    this.createJobFieldChangeHandler('term')(
                                        { target: { value } });
                                }
                                }
                                value={ activeJob.term }
                                modifyValueOnChange={ (salary) => getNumberFromString(
                                    salary,
                                    0,
                                ) }
                                label="Length of contract (weeks)"
                            />
                        }
                        { this.renderValidation('term') }
                    </Col>
                    <Col
                        md={ 6 }
                        lg={ 3 }
                    >
                        <InputComponent
                            name="vacancies"
                            placeholder="Vacancies"
                            setValue={ (value) => {
                                this.createJobFieldChangeHandler('vacancies')(
                                    { target: { value } });

                                if (+value <= 1 && +activeJob.feePercentage < HIGHER_FEE_FOR_SINGLE_VACANCY) {
                                    this.createJobFieldChangeHandler(
                                        'feePercentage',
                                        'choice',
                                    )(
                                        { target: { value: null } });
                                }
                            }
                            }
                            value={ activeJob.vacancies }
                            modifyValueOnChange={ (salary) => getNumberFromString(
                                salary,
                                0,
                            ) }
                            label="Number of vacancies"
                        />
                    </Col>
                </Row>
                <Row
                    styles={ { alignItems: 'flex-start' } }
                    className={ styles.row }
                >
                    <Col
                        md={ 6 }
                        lg={ 3 }
                    >
                        <SelectComponent
                            name="vacancyReason"
                            value={ activeJob.vacancyReason || '' }
                            setValue={ (value) => {
                                this.createJobFieldChangeHandler(
                                    'vacancyReason',
                                    'choice',
                                )(
                                    { target: { value } });
                            } }
                            label="Vacancy Reason"
                            values={
                                [
                                    {
                                        key: 'Growth/Expansion',
                                        label: 'Growth/Expansion',
                                    },
                                    {
                                        key: 'Replacement',
                                        label: 'Replacement',
                                    },
                                    {
                                        key: 'Internal Restructure',
                                        label: 'Internal Restructure',
                                    },
                                    {
                                        key: 'Parental Leave',
                                        label: 'Parental Leave',
                                    },
                                    {
                                        key: 'Other',
                                        label: 'Other',
                                    },
                                ]
                            }
                        />
                        { this.renderValidation('vacancyReason') }
                    </Col>
                    { activeJob.type === 'temp' && (
                        <Fragment>
                            <Col
                                md={ 6 }
                                lg={ 3 }
                            >
                                <SelectComponent
                                    name="rateType"
                                    value={ activeJob.rateType || '' }
                                    setValue={ (value) => {
                                        this.createJobFieldChangeHandler(
                                            'rateType',
                                            'choice',
                                        )(
                                            { target: { value } });
                                    } }
                                    label="Rate Type"
                                    values={
                                        [
                                            {
                                                key: 'Daily',
                                                label: 'Daily',
                                            },
                                            {
                                                key: 'Hourly',
                                                label: 'Hourly',
                                            },
                                        ]
                                    }
                                />
                                { this.renderValidation('rateType') }
                            </Col>
                            <Col
                                md={ 6 }
                                lg={ 3 }
                            >
                                <InputComponent
                                    name="minRate"
                                    setValue={ (value) => {
                                        this.createJobFieldChangeHandler('minRate')(
                                            { target: { value: +value || 0 } });
                                    } }
                                    value={ +activeJob.minRate || 0 }
                                    modifyValueOnChange={ (salary) => +getNumberFromString(
                                        salary,
                                        0,
                                    ) }
                                    label="Minimum rate - if unknown leave blank"
                                    pre="$"
                                    post=".00"
                                />
                                { this.renderValidation('minRate') }
                            </Col>
                            <Col
                                md={ 6 }
                                lg={ 3 }
                            >
                                <InputComponent
                                    name="maxRate"
                                    setValue={ (value) => {
                                        this.createJobFieldChangeHandler('maxRate')(
                                            { target: { value: +value || 0 } });
                                    }
                                    }
                                    value={ +activeJob.maxRate || 0 }
                                    modifyValueOnChange={ (salary) => +getNumberFromString(
                                        salary,
                                        0,
                                    ) }
                                    label="Maximum rate - if unknown leave blank"
                                    pre="$"
                                    post=".00"
                                />
                                { this.renderValidation('maxRate') }
                            </Col>
                        </Fragment>
                    ) }
                    { activeJob.type !== 'temp' && (
                        <Fragment>
                            <Col
                                md={ 6 }
                                lg={ 3 }
                            >
                                <InputComponent
                                    name="salary"
                                    setValue={ (value) => {
                                        this.createJobFieldChangeHandler('salary')(
                                            { target: { value } });
                                    } }
                                    value={ activeJob.salary }
                                    modifyValueOnChange={ (salary) => getNumberFromString(
                                        salary,
                                        0,
                                    ) }
                                    label="Base, Superannuation + Car/Car allowance (per annum)"
                                    pre="$"
                                    post=".00"
                                />
                                { this.renderValidation('salary') }
                            </Col>
                            <Col
                                md={ 6 }
                                lg={ 3 }
                            >
                                <SelectComponent
                                    name="feePercentage"
                                    value={ activeJob.feePercentage || '' }
                                    setValue={ (value) => {
                                        this.createJobFieldChangeHandler(
                                            'feePercentage',
                                            'choice',
                                        )(
                                            { target: { value } });
                                    } }
                                    label="Fee percentage"
                                    values={ arrayOfFees }
                                />
                                { this.renderValidation('feePercentage') }
                            </Col>
                            <Col
                                md={ 6 }
                                lg={ 3 }
                            >
                                <FixedInputComponent
                                    name="notionalFee"
                                    setValue={ () => {} }
                                    value={ JobFee({ job: activeJob }) || '' }
                                    label={
                                        activeJob.type === 'fixed-term' ?
                                            'notional fee - note: fee calculated using 52 weeks' : 'notional fee'
                                    }
                                    pre="$"
                                    post=".00"
                                />
                            </Col>
                        </Fragment>
                    ) }
                </Row>
                <hr />
                <Row className={ styles.row }>
                    <Col className="dropzone-container">
                        <Dropzone
                            style={ {} }
                            className="dropzone"
                            activeClassName="dropzone__active"
                            acceptClassName="dropzone__accept"
                            rejectClassName="dropzone__reject"
                            disabledClassName="dropzone__disabled"
                            accept={ [
                                '.pdf',
                                '.docx',
                                '.doc',
                                'application/pdf',
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            ] }
                            onDrop={ this.onDropDocuments }
                        >
                            <div className="show-on-accept">
                                <p>
                                    Drop files you wish to upload here, alternatively,
                                    click this box to browse your computer for files to
                                    upload
                                </p>
                            </div>
                            <div className="show-on-reject">
                                <p>
                                    That file is not valid, only PDF, Doc and image
                                    files are supported
                                </p>
                            </div>
                        </Dropzone>
                    </Col>
                    <Col>
                        <Alert
                            className="file-upload-alert"
                            color="info"
                        >
                                        <span>
                                            NOTE: THIS DOCUMENT WILL BE ACCESSIBLE TO ALL RECRUITERS
                                            WHO CAN VIEW THIS LISTING. TO LIST ANONYMOUSLY, ENSURE
                                            THIS FILE (AND ITS METADATA) DOES NOT CONTAIN YOUR
                                            COMPANY INFORMATION.
                                        </span>
                        </Alert>
                    </Col>
                </Row>
                <Collapse
                    isOpen={ documents.length > 0 || activeJob.uploadedFiles.length > 0 }
                >
                    <h5>
                        Documents
                        { invalidDocuments.length > 0 && (
                            <Button
                                className="float-right"
                                color="danger"
                                onClick={ () => this.onRequestRemoveUploadedDocuments(invalidDocuments) }
                            >
                                Remove all invalid
                            </Button>
                        ) }
                    </h5>
                    <Table type="file-list">
                        { activeJob.uploadedFiles.length > 0 &&
                        activeJob.uploadedFiles.map(({ ...args }) => {
                            const { id, valid, file } = args;
                            return (
                                <TableRow
                                    key={ `document-${ id }` }
                                    className={ classNames({
                                        'file-list-table--row__invalid': !valid,
                                        'file-list-table--row__valid': valid,
                                    }) }
                                >
                                    { valid && (
                                        <TableCell name="name">
                                            <a
                                                href={ file.preview }
                                                target="_blank"
                                            >
                                                Filename: { file.name }
                                            </a>
                                        </TableCell>
                                    ) }
                                    { !valid && (
                                        <TableCell name="name">
                                            Filename: { file.name } is not a valid file, it will not be
                                            uploaded
                                        </TableCell>
                                    ) }
                                    <TableCell
                                        name="actions"
                                        align="right"
                                        valign="center"
                                    >
                                        <Button
                                            action="remove"
                                            color="link"
                                            onClick={ () => this.onRequestRemoveUploadedDocuments(id) }
                                        >
                                            Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        }) }
                        { documents.length > 0 &&
                        documents.map(file => {
                            const { name, path } = file;
                            return (
                                <TableRow key={ `document-${ name }` }>
                                    <TableCell name="name">
                                        <a
                                            href={ path }
                                            target="_blank"
                                        >
                                            Filename: { name }
                                        </a>
                                    </TableCell>
                                    <TableCell
                                        name="actions"
                                        align="right"
                                        valign="center"
                                    >
                                        <Button
                                            action="remove"
                                            color="link"
                                            onClick={ () => {
                                                this.onRequestRemoveExistingDocument(file);
                                            } }
                                        >
                                            Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        }) }
                    </Table>
                </Collapse>
                <hr />
                <div className={ styles.textBox }>
                    <h2>Company Overview</h2>
                    <TextArea
                        placeholder="Describe your company"
                        name="company-overview"
                        id="companyOverview"
                        initialValue={
                            activeJob.companyOverview ||
                            this.props.user.company.overview
                        }
                        onChange={ this.createJobFieldChangeHandler(
                            'companyOverview',
                            'textarea',
                        ) }
                    />
                    { this.renderValidation('companyOverview') }
                </div>
                <div className={ styles.textBox }>
                    <h2>Job Description</h2>
                    <TextArea
                        placeholder="Describe the role, including the responsibilities and duties of a successful candidate"
                        name="job-description"
                        id="description"
                        initialValue={ activeJob.description }
                        onChange={ this.createJobFieldChangeHandler(
                            'description',
                            'textarea',
                        ) }
                    />
                    { this.renderValidation('description') }
                </div>

                <div className={ styles.textBox }>
                    <h2>Who are you looking for</h2>
                    <TextArea
                        placeholder="Describe your ideal candidate, or any critical skills or experience required"
                        name="who-are-you-looking-for"
                        id="whoLookingFor"
                        initialValue={ activeJob.whoLookingFor }
                        onChange={ this.createJobFieldChangeHandler(
                            'whoLookingFor',
                            'textarea',
                        ) }
                    />
                    { this.renderValidation('whoLookingFor') }
                </div>
                <div className={ styles.textBox }>
                    <h2>Detail Compensation and Benefits</h2>
                    <TextArea
                        id="compensationAndBenefits"
                        placeholder="Detail the financial, and non-financial benefits provided by your company"
                        name="compensation-and-benefits"
                        initialValue={ activeJob.compensationAndBenefits }
                        onChange={ this.createJobFieldChangeHandler(
                            'compensationAndBenefits',
                            'textarea',
                        ) }
                    />
                    { this.renderValidation('compensationAndBenefits') }
                </div>
            </Form>
        );
    }
}

export default JobDescriptionTab;
