import React, {
    PureComponent,
}                                 from 'react';
import PropTypes                  from 'prop-types';
import TEST_IDS                   from '../../../../tests/testIds';
import ButtonComponent, {
    BUTTON_TYPE,
}                                 from '../../../components/ButtonComponent';
import { JobFee }                 from '../../../../util/getSalary';
import Cross2Icon                 from '../../../../assets/icons/Cross2Icon';
import getNumberFromString        from '../../../../util/getNumberFromString';
import getDenominationValue       from '../../../../util/getDenominationValue';
import ModalComponent             from '../../../components/ModalComponent';
import LoaderComponent            from '../../../components/LoaderComponent';
import RequiresPermission         from '../../../components/User/RequiresPermission';
import FormsyComponent            from '../../../components/formsy/FormsyComponent';
import FormsySubmitComponent      from '../../../components/formsy/FormsySubmitComponent';
import FormsySelectComponent      from '../../../components/formsy/FormsySelectComponent';
import FormsyDateInputComponent   from '../../../components/formsy/FormsyDateInputComponent';
import FixedInputComponent        from '../../../components/Form/FixedInputComponent';
import FormsyInputComponent       from '../../../components/formsy/FormsyInputComponent';
import FormsyHiddenInputComponent from '../../../components/formsy/FormsyHiddenInputComponent';
import styles                     from './styles.scss';

class OfferModalComponent extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isEdited: false,
            formOffer: props.offer,
        };
    }

    /**
     * Will enable/disable submit button and change notional fee
     *
     * @param {object} formOffer - from object formsy
     */
    handleUpdateOfferForm = (formOffer) => {
        let isEdited = false;

        for (let key in formOffer) {
            if (formOffer[ key ] !== this.props.offer[ key ] && !!formOffer[ key ]) {
                isEdited = true;
            }
        }
        this.setState({
            formOffer,
            isEdited,
        });
    };

    render() {
        const { isEdited, formOffer } = this.state;
        const { handleUpdateOfferForm } = this;
        const {
            handleCloseModal,
            handleSubmit,
            handleWithdraw,
            handleAccept,
            handleReject,
            offer,
            applicationId,
            isUser,
            isLoading,
            isModalLoading,
            handleNegotiate,
        } = this.props;
        const formId = 'SendOfferId';
        return (
            <ModalComponent
                handleClose={ handleCloseModal }
                classNameOuter={ styles.modal }
            >
                <ButtonComponent
                    ariaLabel="close modal"
                    btnType={ BUTTON_TYPE.LINK }
                    className={ styles.close }
                    onClick={ handleCloseModal }
                >
                    <Cross2Icon />
                </ButtonComponent>
                { isModalLoading ?
                    <div
                        className={ styles.form }
                    >
                        <LoaderComponent row />
                    </div>
                    :
                    <FormsyComponent
                        onValidSubmit={ handleSubmit }
                        onChange={ handleUpdateOfferForm }
                        className={ styles.form }
                        formId={ formId }
                    >
                        <h2 className={ styles.title }>
                            {
                                offer.status === 'accepted' ||
                                offer.status === 'rejected' ||
                                offer.status === 'withdrawn'
                                    ? 'View job offer'
                                    : offer.offerId ? 'Update job offer' : 'Create job offer' }
                        </h2>
                        <div className={ styles.row }>

                            <FormsyHiddenInputComponent
                                name="applicationId"
                                value={ applicationId }
                            />
                            <FormsyHiddenInputComponent
                                name="offerId"
                                value={ offer.offerId }
                            />
                            <FormsyInputComponent
                                value={ offer.jobTitle }
                                name="jobTitle"
                                label="Job Title"
                                required
                            />
                        </div>
                        <div className={ styles.row }>
                            <FixedInputComponent
                                className={ styles.input }
                                value={
                                    offer.type === 'fixed-term' ?
                                        `Fixed Term - ${ offer.term } weeks` :
                                        offer.type === 'permanent' ?
                                            'Permanent' :
                                            `Temp - ${ offer.term } weeks`
                                }
                                name="jobType"
                                label="Job type"
                            />
                            {
                                offer.type === 'fixed-term' && <FormsyInputComponent
                                    className={ styles.input }
                                    label="Term"
                                    name="term"
                                    value={ offer.term }
                                />
                            }
                            <FormsyDateInputComponent
                                className={ styles.input }
                                label="Start date"
                                name="startDate"
                                required
                                value={ offer.startDate }
                            />
                        </div>
                        { offer.type === 'temp' && <div className={ styles.row }>
                            <FormsySelectComponent
                                className={ styles.input }
                                value={ offer.rateType }
                                name="rateType"
                                values={ [
                                    {
                                        key: 'Hourly',
                                        label: 'Hourly',
                                    },
                                    {
                                        key: 'Daily',
                                        label: 'Daily',
                                    },
                                ] }
                                label="Rate type"
                                required
                            />
                            <FormsyInputComponent
                                className={ styles.input }
                                label="Rate"
                                name="salary"
                                value={ offer.salary }
                                modifyValueOnChange={ (salary) => getNumberFromString(
                                    salary,
                                    2,
                                ) }
                                pre="$"
                                required
                                modifyValueOnDisplay={ getDenominationValue }
                            />
                        </div> }
                        { offer.type !== 'temp' && <div className={ styles.row }>
                            <FormsyInputComponent
                                className={ styles.input }
                                label="Base salary + super + car allowance"
                                name="salary"
                                pre="$"
                                value={ offer.salary }
                                modifyValueOnChange={ (salary) => getNumberFromString(
                                    salary,
                                    0,
                                ) }
                                modifyValueOnDisplay={ getDenominationValue }
                            />
                            <FixedInputComponent
                                className={ styles.input }
                                label="Fee Percentage"
                                name="feePercentage"
                                value={ offer.feePercentage }
                                post="%"
                            />
                            <FixedInputComponent
                                className={ styles.input }
                                value={
                                    getDenominationValue(JobFee({
                                        job: {
                                            type: offer.type,
                                            salary: +(formOffer.salary || offer.salary) || 0,
                                            term: +(formOffer.term || offer.term) || 0,
                                            feePercentage: +(formOffer.feePercentage || offer.feePercentage) || 0,
                                        }
                                    }))
                                }
                                name="notionalFee"
                                label="Notional Fee"
                            />
                        </div> }

                        <div className={ styles.submitBox }>
                            <RequiresPermission
                                roles={ [ 'job_offer_withdraw' ] }
                            >
                                { (offer.status === 'pending' ||
                                    offer.status === 'recruiter_pending_negotiation' ||
                                    offer.status === 'employer_pending_negotiation') &&
                                <ButtonComponent
                                    className={ styles.button }
                                    btnType={ BUTTON_TYPE.ACCENT }
                                    onClick={ () => {handleWithdraw(offer.offerId);} }
                                >
                                    Withdraw offer
                                </ButtonComponent>
                                }
                            </RequiresPermission>
                            <RequiresPermission
                                roles={ [ 'job_offer_accept' ] }
                            >
                                { ((offer.status === 'recruiter_pending_negotiation' && !isUser) ||
                                    (offer.status === 'employer_pending_negotiation' && isUser) ||
                                    offer.status === 'pending') && (
                                    <ButtonComponent
                                        dataTest={ TEST_IDS.JOBS_CANDIDATE_ACCEPT }
                                        className={ styles.button }
                                        btnType={ BUTTON_TYPE.ACCENT }
                                        onClick={ () => {handleAccept(offer.offerId);} }
                                        disabled={ isEdited }
                                    >
                                        Accept
                                    </ButtonComponent>
                                ) }
                            </RequiresPermission>

                            <RequiresPermission
                                roles={ [ 'job_offer_reject' ] }
                            >
                                { (offer.status === 'pending' ||
                                    offer.status === 'recruiter_pending_negotiation' ||
                                    offer.status === 'employer_pending_negotiation') && (
                                    <ButtonComponent
                                        className={ styles.button }
                                        btnType={ BUTTON_TYPE.ACCENT }
                                        onClick={ () => {handleReject(offer.offerId);} }
                                    >
                                        Reject
                                    </ButtonComponent>
                                ) }
                            </RequiresPermission>
                            <RequiresPermission
                                roles={ [ 'job_offer_accept' ] }
                            >
                                { (offer.status === 'pending' ||
                                    offer.status === 'recruiter_pending_negotiation' ||
                                    offer.status === 'employer_pending_negotiation') && (
                                    <ButtonComponent
                                        className={ styles.button }
                                        btnType={ BUTTON_TYPE.ACCENT }
                                        onClick={ () => {handleNegotiate(offer.jobId, applicationId); } }
                                    >
                                        Negotiate
                                    </ButtonComponent>
                                ) }
                            </RequiresPermission>
                            <RequiresPermission
                                roles={ [ 'job_offer_withdraw' ] }
                            >
                                { ([
                                        'pending',
                                        'employer_pending_negotiation',
                                        'recruiter_pending_negotiation',
                                    ].indexOf(offer.status) >= 0 ||
                                    !offer.status) && (
                                    <FormsySubmitComponent
                                        dataTest={ TEST_IDS.CANDIDATE_OFFER_SUBMIT }
                                        disabled={ isLoading || !isEdited }
                                        className={ styles.button }
                                        formId={ formId }
                                        btnType={ BUTTON_TYPE.ACCENT }
                                    >
                                        { offer.offerId ? 'Update' : 'Send' } offer
                                    </FormsySubmitComponent>
                                ) }
                            </RequiresPermission>
                        </div>

                    </FormsyComponent>
                }
            </ModalComponent>
        );
    }
}

OfferModalComponent.propTypes = {
    handleCloseModal: PropTypes.func.isRequired,
    offer: PropTypes.object.isRequired,
    applicationId: PropTypes.string.isRequired,
    isUser: PropTypes.bool,
    isLoading: PropTypes.bool,
    isEdited: PropTypes.bool,
    isModalLoading: PropTypes.bool,
    handleWithdraw: PropTypes.func.isRequired,
    handleAccept: PropTypes.func.isRequired,
    handleReject: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleNegotiate: PropTypes.func.isRequired,
};

export default OfferModalComponent;
