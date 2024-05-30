import React, {
    PureComponent,
    Fragment,
}                                     from 'react';
import PropTypes                      from 'prop-types';
import { generatePath }               from 'react-router-dom';
import TEST_IDS                       from '../../../../tests/testIds';
import HeaderRowComponent             from '../../../components/HeaderRowComponent';
import HeaderRowButtonComponent       from '../../../components/HeaderRowButtonComponent';
import ActionsRowComponent            from '../../../components/ActionsRowComponent';
import {
    ROUTES,
    JOB_TYPES, PARAM_PLACEMENT_TYPE,
}                                     from '../../../../constants';
import FormsyComponent                from '../../../components/formsy/FormsyComponent';
import FormsyHiddenInputComponent     from '../../../components/formsy/FormsyHiddenInputComponent';
import FormsyInputComponent           from '../../../components/formsy/FormsyInputComponent';
import FormsyCheckboxComponent        from '../../../components/formsy/FormsyCheckboxComponent';
import FormsySelectComponent          from '../../../components/formsy/FormsySelectComponent';
import FormsyTextAreaComponent        from '../../../components/formsy/FormsyTextAreaComponent';
import FormsySubmitComponent          from '../../../components/formsy/FormsySubmitComponent';
import FormsyMonthInputComponent      from '../../../components/formsy/FormsyMonthInputComponent';
import HelpComponent                  from '../../../components/HelpComponent';
import SpecialInputForSalaryComponent from '../SpecialInputForSalaryComponent';
import SpecialInputForRateComponent   from '../SpecialInputForRateComponent';
import LocationFormsyInputComponent   from '../../../components/LocationFormsyInputComponent';
import ButtonBackComponent            from '../../../components/ButtonBackComponent';
import getNumberFromString            from '../../../../util/getNumberFromString';
import {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                                     from '../../../components/ButtonComponent';
import styles                         from './styles.scss';

class PlacementsCreateComponent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            formJobType: props.placement && props.placement.jobType,
        };
    }

    /**
     * Will change form layout if temp jobType is selected
     *
     * @param {string} jobType - permanent, fixed-term or temp
     */
    handleChangeJobType = (jobType) => {
        this.setState({ formJobType: jobType });
    };

    static JOB_TYPE_VALUES = [
        {
            key: JOB_TYPES.PERMANENT,
            label: 'Permanent',
        },
        {
            key: JOB_TYPES.FIXED_TERM,
            label: 'Fixed-term',
        },
        {
            key: JOB_TYPES.TEMPORARY,
            label: 'Temporary',
        },
    ];

    render() {
        const {
            handleSubmit,
            isLoading,
            errors,
            placement = {},
            jobCategories,
            industries,
            isPlacementEdit,
            review,
            recruiterEmail,
        } = this.props;
        const { handleChangeJobType } = this;
        const { formJobType } = this.state;

        const formId = 'placementFormId';
        const actionsRow = ( // will be used twice
            <ActionsRowComponent
                itemActions={
                    <ButtonBackComponent
                        url={ generatePath(ROUTES.PLACEMENTS, { [ PARAM_PLACEMENT_TYPE._NAME ]: PARAM_PLACEMENT_TYPE.VISIBLE }) }
                    />
                }
                pageActions={
                    <FormsySubmitComponent
                        dataTest={ TEST_IDS.PLACEMENT }
                        formId={ formId }
                        btnType={ BUTTON_TYPE.ACCENT }
                        size={ BUTTON_SIZE.BIG }
                        main
                        disabled={ isLoading }
                    >
                        { isPlacementEdit ? 'Save' : 'Send' }
                    </FormsySubmitComponent>
                }
            />
        );

        return (
            <Fragment>
                <HeaderRowComponent
                    tabs={
                        <Fragment>
                            <HeaderRowButtonComponent
                                url={ ROUTES.PLACEMENTS_NEW }
                                label="Get reviews"
                                isActive
                            />
                        </Fragment>
                    }
                />

                { actionsRow }

                <FormsyComponent
                    onValidSubmit={ handleSubmit }
                    formId={ formId }
                    className={ styles.form }
                    errorMessage={ errors }
                >
                    <h4 className={ styles.title }>
                        Placement details{ ' ' }
                        <HelpComponent
                            className={ styles.help }
                            text={ 'All reviews collected on Sourcr are verified against a placement and' +
                            ' we use this information as part of our fraud detection.\n\nYour placement history (job' +
                            ' title,' +
                            ' location, industry and salary range) is also visible on your public profile to help you ' +
                            'demonstrate your market expertise.' }
                        >-{ ' ' }
                            <span className={ styles.helptarget }>Whats this for?</span>
                        </HelpComponent>
                    </h4>
                    <div>
                        <div className={ styles.row }>
                            <FormsyInputComponent
                                className={ styles.placementInput }
                                value={ placement.jobTitle }
                                name="jobTitle"
                                required
                                placeholder="Enter job title"
                                label="Job title"
                            />
                            <FormsyInputComponent
                                className={ styles.placementInput }
                                value={ placement.companyName }
                                name="companyName"
                                required
                                placeholder="Enter company name"
                                label="Company name"
                            />
                            <LocationFormsyInputComponent
                                className={ styles.placementInput }
                                required
                                value={
                                    placement.locationPostcode &&
                                    {
                                        key: placement.locationPostcode,
                                        label: `${ placement.suburb }, ${ placement.locationPostcode }`,
                                    }
                                }
                                label="Location"
                                name="locationPostcode"
                            />
                        </div>
                        <div className={ styles.row }>
                            <FormsySelectComponent
                                className={ styles.placementInput }
                                dataTest={ TEST_IDS.CATEGORY_SELECT }
                                value={ placement.category && placement.category.key }
                                name="category"
                                values={ jobCategories }
                                label="Job Category"
                                required
                            />
                            <FormsySelectComponent
                                className={ styles.placementInput }
                                dataTest={ TEST_IDS.INDUSTRY_SELECT }
                                value={ placement.industry && placement.industry.id }
                                name="industry"
                                values={ industries }
                                label="Industry"
                                required
                            />
                            <FormsySelectComponent
                                className={ styles.placementInput }
                                dataTest={ TEST_IDS.JOB_TYPE_SELECT }
                                value={ placement.jobType && placement.jobType.toLocaleLowerCase() }
                                name="jobType"
                                values={ PlacementsCreateComponent.JOB_TYPE_VALUES }
                                label="Job type"
                                required
                                onChange={ handleChangeJobType }
                            />
                        </div>
                        <div className={ styles.row }>
                            <FormsyMonthInputComponent
                                className={ styles.placementInput }
                                dataTest={ TEST_IDS.MONTH_SELECT }
                                value={ placement.placementDate && new Date(placement.placementDate) }
                                name="placementDate"
                                placeholder="Enter Date"
                                label="Placement date"
                                required
                            />
                            <FormsyInputComponent
                                className={ styles.placementInput }
                                value={ placement.fee }
                                name="fee"
                                placeholder="Enter fee"
                                label="Fee (optional) - only visible to you"
                                modifyValueOnChange={ (fee) => getNumberFromString(fee, 2) }
                                post="%"
                            />
                            {
                                formJobType !== JOB_TYPES.TEMPORARY &&
                                <SpecialInputForSalaryComponent
                                    className={ styles.placementInput }
                                    value={ placement.salary && +placement.salary }
                                />
                            }
                            {
                                formJobType === JOB_TYPES.TEMPORARY &&
                                <SpecialInputForRateComponent
                                    className={ styles.placementInput }
                                    dataTest={ TEST_IDS.JOB_RATE_SELECT }
                                    rate={ placement.rate }
                                    rateType={ placement.rateType }
                                />
                            }
                        </div>
                    </div>
                    { review && <FormsyHiddenInputComponent
                        required
                        name="review"
                        value={ review.id }
                    /> }
                    { !(review && !!review.responsiveness) && <Fragment>
                        <h4 className={ styles.title }>
                            Get employer review
                        </h4>
                        <FormsyCheckboxComponent
                            value={ isPlacementEdit ? placement.requestEmployerCompanyNameVisible : true }
                            name="requestEmployerCompanyNameVisible"
                            label="Show company name on review"
                            isInnerApp
                        />

                        <div className={ styles.row }>
                            <FormsyInputComponent
                                className={ styles.placementInput }
                                value={ placement.employerFirstName }
                                name="employerFirstName"
                                placeholder="Enter first name"
                                label="First name"
                                required
                            />
                            <FormsyInputComponent
                                className={ styles.placementInput }
                                value={ placement.employerLastName }
                                name="employerLastName"
                                placeholder="Enter last name"
                                label="last name"
                                required
                            />
                            <FormsyInputComponent
                                className={ styles.placementInput }
                                value={ placement.employerEmail }
                                name="employerEmail"
                                placeholder="Enter email address"
                                label="Email address"
                                validations={ {
                                    isEmail: true,
                                    notRecruiterEmail: (values, value) => (
                                        value && value.toLowerCase()) !== (recruiterEmail && recruiterEmail.toLowerCase()
                                    )
                                } }
                                validationErrors={ {
                                    isEmail: 'This is not a valid email',
                                    notRecruiterEmail: 'You cannot use your own email here'
                                } }
                                required
                                modifyValueOnChange={ value => value ? value.trim() : value }
                            />
                        </div>
                        <FormsyTextAreaComponent
                            value={ placement.messageToEmployer }
                            name="messageToEmployer"
                            label="Message to employer (optional)"
                        />
                    </Fragment> }
                    { !(review && !review.responsiveness) && <Fragment>
                        <h4 className={ styles.title }>
                            Get candidate review
                        </h4>

                        <div className={ styles.row }>
                            <FormsyInputComponent
                                className={ styles.placementInput }
                                value={ placement.candidateFirstName }
                                name="candidateFirstName"
                                placeholder="Enter first name"
                                label="First name"
                            />
                            <FormsyInputComponent
                                className={ styles.placementInput }
                                value={ placement.candidateLastName }
                                name="candidateLastName"
                                placeholder="Enter last name"
                                label="last name"
                            />
                            <FormsyInputComponent
                                className={ styles.placementInput }
                                value={ placement.candidateEmail }
                                name="candidateEmail"
                                placeholder="Enter email address"
                                label="Email address"
                                validations={ {
                                    isEmail: true,
                                    notRecruiterEmail: (values, value) => (
                                        value && value.toLowerCase()) !== (recruiterEmail && recruiterEmail.toLowerCase()
                                    )
                                } }
                                validationErrors={ {
                                    isEmail: 'This is not a valid email',
                                    notRecruiterEmail: 'You cannot use your own email here'
                                } }
                                modifyValueOnChange={ value => value ? value.trim() : value }
                            />
                        </div>
                        <FormsyTextAreaComponent
                            value={ placement.messageToCandidate }
                            name="messageToCandidate"
                            label="Message to candidate (optional)"
                        />
                    </Fragment> }
                </FormsyComponent>

                { actionsRow }

            </Fragment>
        );
    }
}

PlacementsCreateComponent.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    jobCategories: PropTypes.arrayOf(PropTypes.object).isRequired,
    isLoading: PropTypes.bool,
    errors: PropTypes.string,
    placement: PropTypes.object, // required for placement edit page,
    industries: PropTypes.arrayOf(PropTypes.object).isRequired,
    isPlacementEdit: PropTypes.bool,
    review: PropTypes.object,
    recruiterEmail: PropTypes.string,
};

export default PlacementsCreateComponent;
