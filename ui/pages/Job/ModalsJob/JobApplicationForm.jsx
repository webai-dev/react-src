import React, { Component }                 from 'react';
import { toast }                            from 'react-toastify';
import { environment }                      from '../../../../api';
import SubmitCandidateMutation              from '../../../../mutations/SubmitCandidateMutation';
import TEST_IDS                             from '../../../../tests/testIds';
import gtmPush, { GTM_EVENTS, GTM_ACTIONS } from '../../../../util/gtmPush';
import {
    Form,
    Select,
    Field,
    FormFeedback,
}                                           from '../../../components/Form';
import Table                                from '../../../components/Table/Table';
import TableRow                             from '../../../components/Table/TableRow';
import TableCell                            from '../../../components/Table/TableCell';
import { Money }                            from '../../../components/Misc';
import { MaxUploadSize }                    from '../../../../constants';
import { Button }                           from '../../../components/Button';
import {
    Row,
    Col,
    Alert,
    Collapse,
}                                           from 'reactstrap';
import Dropzone                             from 'react-dropzone';
import * as Yup                             from 'yup';
import classNames                           from 'classnames';
import { Formik }                           from 'formik';

const DocumentsTable = (props) => {
    const {
        documents = [],
        uploadedDocuments = [],
        isOpen = null,
        requestRemoveUploadedDocuments = () => {},
        invalidDocuments = [],
    } = props;
    return (
        <Collapse
            isOpen={ isOpen === null ? documents.length > 0 || uploadedDocuments.length > 0 : isOpen }
        >
            <h2>
                Documents
                { invalidDocuments.length > 0 && (
                    <Button
                        className="float-right"
                        color="danger"
                        onClick={ () => requestRemoveUploadedDocuments(invalidDocuments) }
                    >
                        Remove all invalid
                    </Button>
                ) }
            </h2>
            <Table type="file-list">
                { uploadedDocuments.length > 0 &&
                uploadedDocuments.map(({ ...args }) => {
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
                                    onClick={ () => requestRemoveUploadedDocuments(id) }
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
                                    onClick={ () => requestRemoveUploadedDocuments(file) }
                                >
                                    Remove
                                </Button>
                            </TableCell>
                        </TableRow>
                    );
                }) }
            </Table>
        </Collapse>
    );
};

class BaseJobApplicationForm extends Component {
    handleChangeFees = e => {
        let candidateRate;
        let grossRate;
        const roundVal = amount => Math.round(amount * 100) / 100;
        if (e) {
            this.props.setFieldValue(
                e.target.name,
                e.target.value,
                false,
            );
        }
        if (e && e.target.name === 'rate') {
            candidateRate = e.target.value.includes('.') ?
                e.target.value.split('.')[ 1 ].length === 1 ?
                    (+e.target.value).toFixed(1) :
                    (+e.target.value).toFixed(2) :
                +e.target.value;
            this.props.setFieldValue(
                'rate',
                candidateRate,
                false,
            );
        } else {
            candidateRate = Number(this.props.values.rate || 0);
        }
        if (e && e.target.name === 'grossRate') {
            grossRate = e.target.value.includes('.') ?
                e.target.value.split('.')[ 1 ].length === 1 ?
                    (+e.target.value).toFixed(1) :
                    (+e.target.value).toFixed(2) :
                +e.target.value;
            this.props.setFieldValue(
                'grossRate',
                grossRate,
                false,
            );
        } else {
            grossRate = Number(this.props.values.grossRate || 0);
        }

        const payrollFee = candidateRate / 100 * 5;
        const payrollTax = candidateRate / 100 * 5.5;

        const leftoverRate = grossRate - candidateRate - payrollFee - payrollTax;

        this.setState({
            payrollFee: roundVal(payrollFee),
            payrollTax: roundVal(payrollTax),
            recruiterMargin: roundVal(leftoverRate / 100 * 80),
            sourcrMargin: roundVal(leftoverRate / 100 * 20),
        });
    };

    componentDidMount() {
        this.handleChangeFees();
    }

    state = {
        invalidDocuments: [],
        documents: [],
        payrollFee: 0,
        payrollTax: 0,
        recruiterMargin: 0,
        sourcrMargin: 0,
    };

    onDropDocuments = (acceptedDocuments, rejectedDocuments) => {
        let docCount =
            (this.state.documents || []).length + (this.state.invalidDocuments || []).length;
        const documents = acceptedDocuments.map(it => {
            return {
                file: it instanceof File ? it : new File([ it ], it.fileName || 'noName'),
                id: `accepted-${ ++docCount }`,
                valid: true,
            };
        });

        const rejectedDocs = rejectedDocuments.map(it => {
            return {
                file: it,
                id: `rejected-${ docCount }`,
                valid: false,
            };
        });

        this.setState((prevState) => {
            const newFiles = [
                ...documents,
                ...this.props.values.files
            ];
            this.props.setFieldValue(
                'files',
                newFiles,
                false,
            );
            return {
                invalidDocuments: rejectedDocs.map(it => it.id),
                documents: [
                    ...documents,
                    ...prevState.documents
                ],
            };
        });
    };

    onRequestRemoveDocuments = documentIds => {
        const docIdArray = Array.isArray(documentIds) ? documentIds : [ documentIds ];
        if (docIdArray.length > 0) {
            this.setState((prevState) => {
                const invalidDocuments = [];
                const documents = [];
                for (let doc of prevState.documents) {
                    if (docIdArray.indexOf(doc.id) >= 0) {
                        continue;
                    }

                    if (!doc.valid) {
                        invalidDocuments.push(doc.id);
                    }

                    documents.push(doc);
                }

                this.props.setFieldValue(
                    'files',
                    documents,
                    false,
                );
                return {
                    invalidDocuments,
                    documents,
                };
            });
        }
    };


    render() {
        const { job, errors, touched, isSubmitting } = this.props;
        const {
            payrollFee,
            payrollTax,
            recruiterMargin,
            sourcrMargin,
        } = this.state;
        return (
            <Form onSubmit={ this.props.handleSubmit }>
                <Row className="mb-4">
                    <Col
                        xs={ 12 }
                        md={ 6 }
                    >
                        <Field
                            label="Candidate First Name"
                            type="text"
                            name="firstName"
                        />
                    </Col>
                    <Col
                        xs={ 12 }
                        md={ 6 }
                    >
                        <Field
                            label="Candidate Last Name"
                            type="text"
                            name="lastName"
                        />
                    </Col>
                    <Col
                        xs={ 12 }
                        md={ 6 }
                    >
                        <Field
                            label="Email"
                            type="email"
                            name="email"
                        />
                    </Col>
                    <Col
                        xs={ 12 }
                        md={ 6 }
                    >
                        <Field
                            innerComponent={ Select }
                            label="Work Rights"
                            name="workRights"
                        >
                            <option value="unrestricted">Unrestricted</option>
                            <option value="restricted">Restricted</option>
                        </Field>
                    </Col>
                    <Col
                        xs={ 12 }
                        md={ 6 }
                    >
                        <Field
                            label="Notice Period (weeks)"
                            validate={ (value) => {
                                return !/^\d+$/.test(value) ? 'Input a number only' : null;
                            } }
                            name="noticePeriod"
                        />
                    </Col>
                    <Col
                        xs={ 12 }
                        md={ 6 }
                    >
                        <Field
                            label="Linkedin URL"
                            name="linkedinUrl"
                        />
                    </Col>
                </Row>
                { job.type === 'temp' && (
                    <React.Fragment>
                        <Row>
                            <Col>
                                <Field
                                    innerComponent={ Select }
                                    label="Rate Type"
                                    name="rateType"
                                >
                                    <option value="hourly">Hourly</option>
                                    <option value="daily">Daily</option>
                                </Field>
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                xs={ 6 }
                                className="mt-2"
                            >
                                <Field
                                    label="Gross Rate"
                                    onChange={ this.handleChangeFees }
                                    type="number"
                                    name="grossRate"
                                />
                            </Col>
                            <Col
                                xs={ 12 }
                                className="mt-2"
                            >
                                <strong>Payroll/Admin/Insurance:{ ' ' }</strong>
                                <span><Money>{ payrollFee }</Money>{ ' ' }</span>
                            </Col>
                            <Col
                                xs={ 12 }
                                className="mt-2"
                            >
                                <strong>Payroll tax:{ ' ' }</strong>
                                <span><Money>{ payrollTax }</Money>{ ' ' }</span>
                                <span>(Note this is assumed at NSW PRT rate of 5.5%, any differences in this will be split between You and Sourcr 80/20)</span>
                            </Col>
                            <Col
                                xs={ 12 }
                                className="mt-2"
                            >
                                <strong>Sourcr margin:{ ' ' }</strong>
                                <span><Money>{ sourcrMargin }</Money></span>
                            </Col>
                            <Col
                                xs={ 12 }
                                className="mt-2"
                            >
                                <strong>Your margin:{ ' ' }</strong>
                                <span><Money>{ recruiterMargin }</Money></span>
                            </Col>
                            <Col
                                xs={ 6 }
                                className="mt-2"
                            >
                                <Field
                                    label="Candidate Rate"
                                    type="number"
                                    onChange={ this.handleChangeFees }
                                    name="rate"
                                />
                            </Col>
                        </Row>
                    </React.Fragment>
                ) }
                <Row className="mb-4">
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
                                    Drop files you wish to upload here, alternatively, click this
                                    box to browse your computer for files to upload
                                </p>
                            </div>
                            <div className="show-on-reject">
                                <p>
                                    That file is not valid, only PDF, Doc and image files are
                                    supported
                                </p>
                            </div>
                        </Dropzone>

                        { touched[ 'files' ] &&
                        errors[ 'files' ] && (
                            <FormFeedback style={ { display: 'block' } }>
                                { errors[ 'files' ] }
                            </FormFeedback>
                        ) }
                    </Col>
                    <Col>
                        <Alert
                            className="file-upload-alert"
                            color="info"
                        >
                            <span>
                                CV AND OTHER DOCUMENTS (YOU CAN UPLOAD MAXIMUM OF 7 DOCUMENTS,
                                ALLOWED FILE TYPES : .PDF, .DOC, .DOCX)
                            </span>
                        </Alert>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <DocumentsTable
                            invalidDocuments={ this.state.invalidDocuments }
                            uploadedDocuments={ this.props.values.files }
                            requestRemoveUploadedDocuments={ this.onRequestRemoveDocuments }
                        />
                    </Col>
                </Row>
                { job.type !== 'temp' && (
                    <Row className="mb-4">
                        <Col>
                            <h4>Salary Expectation</h4>
                            <Field
                                type="textarea"
                                placeholeder="(Maximum 100 characters)"
                                name="salaryExpectations"
                            />
                        </Col>
                    </Row>
                ) }
                <Row className="mb-4">
                    <Col>
                        <h4>Additional Information</h4>
                        <Field
                            type="textarea"
                            placeholeder="Communicate with the employer any other relevant candidate information (Maximum 1500 characters)"
                            name="additionalInformation"
                        />
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col align="center">
                        <Button
                            data-test={ TEST_IDS.CANDIDATE_SUBMIT }
                            color="pink"
                            size="lg"
                            type="submit"
                            disabled={ isSubmitting }
                        >
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

const JobApplicationForm = ({ job, history, viewType }) => (
    <Formik
        onSubmit={ (values, { setSubmitting, setErrors }) => {
            const { files, ...candidate } = values;
            setSubmitting(true);
            SubmitCandidateMutation
                .commit(
                    environment,
                    job,
                    candidate,
                    files,
                )
                .then(() => {
                    setSubmitting(false);
                    gtmPush({
                        event: GTM_EVENTS.SUBMIT_CANDIDATE,
                        action: GTM_ACTIONS.JOB,
                        label: job.id,
                    });
                    history.push(`/${ viewType }/job/${ job.id }`);
                    toast.success('You have successfully submitted a candidate');
                })
                .catch(err => {
                    setSubmitting(false);
                    const { errors } = err;
                    if (errors) {
                        setErrors(
                            errors.reduce(
                                (list, { key, value }) => {
                                    list[ key ] = value;
                                    return list;
                                },
                                {},
                            ),
                        );
                    }
                });
        } }
        initialValues={ {
            workRights: 'unrestricted',
            firstName: '',
            email: '',
            lastName: '',
            noticePeriod: '',
            linkedinUrl: '',
            salaryExpectations: '',
            additionalInformation: '',
            files: [],
            rate: job.minRate || 0,
            grossRate: (job.minRate || 0) + (job.minRate || 0) / 100 * 15,
            rateType: job.rateType || 'daily',
        } }
        validationSchema={ Yup.object()
            .shape({
                firstName: Yup.string()
                    .required('Required'),
                lastName: Yup.string()
                    .required('Required'),
                email: Yup.string()
                    .email('Invalid email address')
                    .required('Required'),
                workRights: Yup.string()
                    .required('Required'),
                linkedinUrl: Yup.string()
                    .matches(
                        /^((https|http):\/\/)?(www.)?linkedin.com\/(.+)/,
                        {
                            message: 'The URL must be a valid linkedin profile',
                        },
                    ),
                noticePeriod: Yup.string()
                    .required('Required'),
                salaryExpectations: job.type === 'temp' ? Yup.string() : Yup.string()
                    .required('Required'),
                rate: job.type === 'temp' ? Yup.string()
                    .required('Required') : Yup.string(),
                grossRate: job.type === 'temp' ? Yup.string()
                    .required('Required') : Yup.string(),
                rateType: Yup.string(),
                additionalInformation: Yup.string(),
                files:
                    Yup.array()
                        .of(
                            Yup.object()
                                .test({
                                    name: 'is-file-undersize',
                                    message: '${path} must not exceed ${maxSize}mb',
                                    test: file => {
                                        return !file || !file.file || file.file.size <= MaxUploadSize;
                                    },
                                    params: {
                                        maxSize: MaxUploadSize / 1000000,
                                    },
                                }),
                        )
                        .min(
                            1,
                            'You must upload at least 1 file',
                        ),
            }) }
        render={ ({ ...props }) => {
            return <BaseJobApplicationForm job={ job } { ...props } />;
        } }
    />
);

export default JobApplicationForm;
