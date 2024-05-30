import React, { PureComponent }   from 'react';
import PropTypes                  from 'prop-types';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                                 from '../../../../../components/ButtonComponent';
import Cross2Icon                 from '../../../../../../assets/icons/Cross2Icon';
import ModalComponent             from '../../../../../components/ModalComponent';
import FormsyComponent            from '../../../../../components/formsy/FormsyComponent';
import FormsySelectComponent      from '../../../../../components/formsy/FormsySelectComponent';
import FormsyTextAreaComponent    from '../../../../../components/formsy/FormsyTextAreaComponent';
import FormsySubmitComponent      from '../../../../../components/formsy/FormsySubmitComponent';
import FormsyHiddenInputComponent from '../../../../../components/formsy/FormsyHiddenInputComponent';
import styles                     from './styles.scss';

class RejectCandidateModalComponent extends PureComponent {
    state = {
        reason: null,
    };

    /**
     * Change reason - will be used to display text are when "Other" is selected
     * @param {string} reason
     */
    handleChangeReason = (reason) => {
        this.setState({ reason });
    };

    render() {
        const { handleCloseModal, applicationId, handleSubmit, errors, isLoading } = this.props;
        const { handleChangeReason } = this;
        const { reason } = this.state;

        const formId = 'RejectCandidateForm';

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
                <div className={ styles.form }>
                    <FormsyComponent
                        onValidSubmit={ handleSubmit }
                        formId={ formId }
                        errorMessage={ errors }
                    >
                        <h2 className={ styles.title }>
                            Confirm application rejection
                        </h2>
                        <div className={ styles.infoText }>
                            Are you sure you want to reject this candidate?
                        </div>
                        <div className={ styles.box }>
                            <FormsySelectComponent

                                selectClassName={ styles.dropDownHeight }
                                label="Reason for rejection"
                                name={ reason !== RejectCandidateModalComponent.OTHER ? 'reason' : 'reasonOther' }
                                onChange={ handleChangeReason }
                                required={ reason !== RejectCandidateModalComponent.OTHER }
                                values={ [
                                    'There were stronger candidate applications',
                                    'The candidate does not have the relevant experience',
                                    'The candidate does not have enough experience',
                                    'The candidate does not have full work rights',
                                    'The candidate is not in the location of the job',
                                    RejectCandidateModalComponent.OTHER,
                                ].map(item => ({ key: item, label: item })) }
                            />
                            {
                                reason === RejectCandidateModalComponent.OTHER &&
                                <FormsyTextAreaComponent
                                    required
                                    name="reason"
                                    placeholder="Tell the recruiter why you wish to reject this candidate"
                                />
                            }
                            <FormsyHiddenInputComponent
                                name="id"
                                value={ applicationId }
                            />
                        </div>
                    </FormsyComponent>
                    <div className={ styles.submitBox }>
                        <FormsySubmitComponent
                            disabled={ isLoading }
                            formId={ formId }
                            btnType={ BUTTON_TYPE.ACCENT }
                            size={ BUTTON_SIZE.BIG }
                        >
                            Reject
                        </FormsySubmitComponent>
                    </div>
                </div>
            </ModalComponent>
        );
    }
}

RejectCandidateModalComponent.OTHER = 'other';

RejectCandidateModalComponent.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
    applicationId: PropTypes.string.isRequired,
    errors: PropTypes.string,
    isLoading: PropTypes.bool,
};

export default RejectCandidateModalComponent;
