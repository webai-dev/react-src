import React, { PureComponent }   from 'react';
import PropTypes                  from 'prop-types';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                                 from '../../../../components/ButtonComponent';
import Cross2Icon                 from '../../../../../assets/icons/Cross2Icon';
import ModalComponent             from '../../../../components/ModalComponent';
import FormsyComponent            from '../../../../components/formsy/FormsyComponent';
import FormsySubmitComponent      from '../../../../components/formsy/FormsySubmitComponent';
import FormsySelectComponent      from '../../../../components/formsy/FormsySelectComponent';
import FormsyTextAreaComponent    from '../../../../components/formsy/FormsyTextAreaComponent';
import FormsyHiddenInputComponent from '../../../../components/formsy/FormsyHiddenInputComponent';
import styles                     from './styles.scss';

class WithdrawCandidateComponent extends PureComponent {
    static OTHER = 'other';
    state = {
        isReasonCustom: false,
    };

    /**
     * Will display textArea input if user selected "Other" as withdraw reason
     *
     * @param {string} value
     */
    handleSetIsReasonCustom = (value) => {
        if (value === WithdrawCandidateComponent.OTHER) {
            this.setState({ isReasonCustom: true });
        } else {
            this.setState({ isReasonCustom: false });
        }
    };

    handleSubmit = (input) => {
        const { id, reason, reasonCustom } = input;

        this.props.handleSubmit({ id, reason: reason === WithdrawCandidateComponent.OTHER ? reasonCustom : reason });
    };

    render() {
        const { handleSetIsReasonCustom, handleSubmit } = this;
        const { isReasonCustom } = this.state;
        const { handleCloseModal, applicationId } = this.props;
        const formId = 'withdrawCandidate';

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
                <div className={ styles.form } >
                    <FormsyComponent onValidSubmit={ handleSubmit } formId={ formId }>
                        <h2 className={ styles.title }>
                            Confirm candidate withdrawal
                        </h2>
                        <div className={ styles.text }>
                            Are you sure you want to withdraw this candidate?
                        </div>
                        <div className={ styles.box }>
                            <FormsyHiddenInputComponent name="id" value={ applicationId } />
                            <FormsySelectComponent
                                name="reason"
                                onChange={ handleSetIsReasonCustom }
                                values={ [
                                    {
                                        key: 'Candidate has taken another role',
                                        label: 'Candidate has taken another role',
                                    },
                                    {
                                        key: 'Candidate is no longer looking to change roles',
                                        label: 'Candidate is no longer looking to change roles',
                                    },
                                    {
                                        key: 'Candidate does not feel the role is suited to them',
                                        label: 'Candidate does not feel the role is suited to them',
                                    },
                                    {
                                        key: 'Candidate had applied to the employer previously',
                                        label: 'Candidate had applied to the employer previously',
                                    },
                                    {
                                        key: WithdrawCandidateComponent.OTHER,
                                        label: 'Other',
                                    },
                                ] }
                                label="Reason for rejection"
                                required
                            />
                            { isReasonCustom && <FormsyTextAreaComponent
                                name="reasonCustom"
                                placeholder="Tell the employer why you wish to withdraw candidate"
                                required
                            /> }
                        </div>
                    </FormsyComponent>
                    <div className={ styles.submitBox }>
                        <FormsySubmitComponent
                            formId={ formId }
                            btnType={ BUTTON_TYPE.ACCENT }
                            size={ BUTTON_SIZE.BIG }
                        >
                            Withdraw
                        </FormsySubmitComponent>
                    </div>
                </div>
            </ModalComponent>
        );
    }
}

WithdrawCandidateComponent.propTypes = {
    handleCloseModal: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    applicationId: PropTypes.string.isRequired,
};

export default WithdrawCandidateComponent;
