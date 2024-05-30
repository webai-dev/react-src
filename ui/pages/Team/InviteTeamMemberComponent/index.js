import React                 from 'react';
import PropTypes             from 'prop-types';
import ModalComponent        from '../../../components/ModalComponent';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                            from '../../../components/ButtonComponent';
import Cross2Icon            from '../../../../assets/icons/Cross2Icon';
import FormsyComponent       from '../../../components/formsy/FormsyComponent';
import FormsySubmitComponent from '../../../components/formsy/FormsySubmitComponent';
import FormsyInputComponent  from '../../../components/formsy/FormsyInputComponent';
import styles                from './styles.scss';

const InviteTeamMemberComponent = (props) => {
    const {
        handleCloseModal,
        isLoading,
        handleSubmit,
        isCompany,
        error,
        subscriptionEstimate,
        isConfirmed,
        handleConfirm,
    } = props;
    const formId = 'InviteMember';

    if (subscriptionEstimate && !isConfirmed) {
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
                <div
                    className={ styles.form }
                >
                    <h2 className={ styles.title }>
                        Adding a recruiter will update your subscription based on your current plan
                    </h2>
                    <div className={ styles.submitBox }>
                        <ButtonComponent
                            btnType={ BUTTON_TYPE.ACCENT }
                            size={ BUTTON_SIZE.BIG }
                            onClick={ handleConfirm }
                        >
                            Add agency user
                        </ButtonComponent>
                    </div>
                </div>
            </ModalComponent>
        );
    }

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
            <FormsyComponent
                onValidSubmit={ handleSubmit }
                className={ styles.form }
                formId={ formId }
                errorMessage={ error }
            >
                <h2 className={ styles.title }>
                    { isCompany ? 'Add User' : 'Add Recruiter' }
                </h2>
                <div className={ styles.row }>
                    <FormsyInputComponent
                        className={ styles.inviteInput }
                        name="firstName"
                        label="First Name"
                        required
                    />
                    <FormsyInputComponent
                        className={ styles.inviteInput }
                        name="lastName"
                        label="Last Name"
                        required
                    />
                </div>
                <div className={ styles.row }>
                    <FormsyInputComponent
                        className={ styles.inviteInput }
                        name="email"
                        label="Email"
                        required
                        validations="isEmail"
                        validationError="This is not a valid email"
                        modifyValueOnChange={ value => value ? value.trim() : value }
                    />
                    <FormsyInputComponent
                        className={ styles.inviteInput }
                        name="contactNumber"
                        label="Contact number"
                    />
                </div>
                <div className={ styles.row }>
                    <FormsyInputComponent
                        className={ styles.inviteInput }
                        name="jobTitle"
                        label="Job title"
                    />
                </div>
                <div className={ styles.submitBox }>
                    <FormsySubmitComponent
                        formId={ formId }
                        btnType={ BUTTON_TYPE.ACCENT }
                        size={ BUTTON_SIZE.BIG }
                        disabled={ isLoading }
                    >
                        Submit
                    </FormsySubmitComponent>
                </div>
            </FormsyComponent>
        </ModalComponent>
    );
};

InviteTeamMemberComponent.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    isCompany: PropTypes.bool,
    error: PropTypes.string,
    subscriptionEstimate: PropTypes.number,
    isConfirmed: PropTypes.bool,
    handleConfirm: PropTypes.func.isRequired,
};

export default InviteTeamMemberComponent;
