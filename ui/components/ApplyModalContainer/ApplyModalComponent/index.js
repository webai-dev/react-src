import React, { PureComponent }   from 'react';
import PropTypes                  from 'prop-types';
import TEST_IDS                   from '../../../../tests/testIds';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                                 from '../../../components/ButtonComponent';
import Cross2Icon                 from '../../../../assets/icons/Cross2Icon';
import ModalComponent             from '../../../components/ModalComponent';
import FormsyComponent            from '../../../components/formsy/FormsyComponent';
import FormsyTextAreaComponent    from '../../../components/formsy/FormsyTextAreaComponent';
import FormsyHiddenInputComponent from '../../../components/formsy/FormsyHiddenInputComponent';
import FormsyCheckboxComponent    from '../../../components/formsy/FormsyCheckboxComponent';
import FormsySubmitComponent      from '../../../components/formsy/FormsySubmitComponent';
import HelpComponent              from '../../../components/HelpComponent';
import styles                     from './styles.scss';

class RecruiterApplicationForm extends PureComponent {
    render() {
        const { job, handleSubmit, isLoading, handleCloseModal, error, applicationMessage, isPageLoading } = this.props;
        const formId = 'applyToTheJobId';

        const defaultMessage = 'EXAMPLE MESSAGE\n\nHi there,\n\n' +
            'I\'m a specialist technology sales recruiter and have been working in the Sydney market for ' +
            'the last 6 years. I built out the sales team for Slack when they first landed in Australia and have placed BDM\'s in ' +
            'companies such as Microsoft, Prospa and SafetyCulture.\n\n' +
            'l\'m currently working three BDM roles for VC funded software ' +
            'companies, giving me an active pool of candidates. I have a couple of people in mind that I think would be suitable ' +
            'for the role. If you\'re happy to engage me I\'d love to learn more about your business and discuss some of the candidate ' +
            'profiles with you.';

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
                    <FormsyComponent
                        onValidSubmit={ handleSubmit }
                        formId={ formId }
                        errorMessage={ error }
                    >
                        <h2 className={ styles.title }>
                            Apply for this job
                        </h2>
                        <p className={ styles.p }> You are applying for the job titled &quot;{ job.title }&quot;</p>
                        <div className={ styles.box }>
                            <FormsyHiddenInputComponent name="id" value={ job.id }/>
                            <FormsyTextAreaComponent
                                className={ styles.textInput }
                                name="message"
                                label="Why should this employer work with you?"
                                value={ isPageLoading ? '' : applicationMessage || defaultMessage }
                                validations={ {
                                    editDefaultMessage: (values, value) => {
                                        return value.replace(/\s/g, '') !== defaultMessage.replace(/\s/g, '');
                                    }
                                } }
                                validationErrors={ {
                                    editDefaultMessage: 'Please customize your message'
                                } }
                                required
                            />
                            <div className={ styles.saveBox }>
                                <FormsyCheckboxComponent
                                    name="save"
                                    label="save message as template"
                                    isInnerApp
                                />
                                <HelpComponent text="Saving this message will save it for future job applications"/>
                            </div>
                            <FormsyCheckboxComponent
                                dataTest={ TEST_IDS.AGREE_TO_THE_TERMS }
                                name="terms"
                                label="I agree to the terms & conditions and privacy policy"
                                isInnerApp
                                required
                            />
                        </div>
                    </FormsyComponent>
                    <div className={ styles.submitBox }>
                        <FormsySubmitComponent
                            dataTest={ TEST_IDS.APPLY_FOR_A_JOB_SUBMIT }
                            formId={ formId }
                            btnType={ BUTTON_TYPE.ACCENT }
                            size={ BUTTON_SIZE.BIG }
                            disabled={ isLoading }
                        >
                            Apply
                        </FormsySubmitComponent>
                    </div>
                </div>

            </ModalComponent>

        );
    }
}

RecruiterApplicationForm.propTypes = {
    job: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    isPageLoading: PropTypes.bool,
    error: PropTypes.string,
    applicationMessage: PropTypes.string,
};

export default RecruiterApplicationForm;
