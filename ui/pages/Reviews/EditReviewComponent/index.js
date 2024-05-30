import React, { Fragment }        from 'react';
import PropTypes                  from 'prop-types';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                                 from '../../../components/ButtonComponent';
import ButtonActionComponent      from '../../../components/RowItemComponent/ButtonActionComponent';
import Cross2Icon                 from '../../../../assets/icons/Cross2Icon';
import ModalComponent             from '../../../components/ModalComponent';
import FormsyComponent            from '../../../components/formsy/FormsyComponent';
import FormsyHiddenInputComponent from '../../../components/formsy/FormsyHiddenInputComponent';
import FormsySubmitComponent      from '../../../components/formsy/FormsySubmitComponent';
import FixedInputComponent        from '../../../components/Form/FixedInputComponent';
import FormsyInputComponent       from '../../../components/formsy/FormsyInputComponent';
import styles                     from './styles.scss';

const EditReviewComponent = (props) => {
    const { handleOpenModal, handleCloseModal, showModal, handleSubmit, review, isCandidate, errors } = props;
    const formId = 'EditReview';

    return (
        <Fragment>

            <ButtonActionComponent
                onClick={ handleOpenModal }
                text="Edit"
            />

            { // MODAL
                showModal &&
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
                        errorMessage={ errors }
                    >
                        <h2 className={ styles.title }>
                            Edit Review Request
                        </h2>
                        <div className={ styles.box }>
                            <FormsyHiddenInputComponent
                                required
                                value={ isCandidate ? 'candidate' : 'employer' }
                                name="sendReminder"
                            />
                            <div className={ styles.col }>
                                <FormsyInputComponent
                                    value={ review.firstName }
                                    name={ isCandidate ? 'candidateFirstName' : 'employerFirstName' }
                                    label={ `${ isCandidate ? 'Candidate' : 'Employer' } First Name` }
                                    required
                                />
                                <FormsyInputComponent
                                    value={ review.lastName }
                                    name={ isCandidate ? 'candidateLastName' : 'employerLastName' }
                                    label={ `${ isCandidate ? 'Candidate' : 'Employer' } Last Name` }
                                    required
                                />
                                <FormsyInputComponent
                                    value={ review.email }
                                    name={ isCandidate ? 'candidateEmail' : 'employerEmail' }
                                    label={ `${ isCandidate ? 'Candidate' : 'Employer' } Email` }
                                    required
                                />
                            </div>
                            <div className={ styles.col }>
                                <FixedInputComponent
                                    value={ review.jobTitle }
                                    name="jobTitle"
                                    label="Job title"
                                />
                                <FixedInputComponent
                                    value={ review.companyName }
                                    name="companyName"
                                    label="Company name"
                                />
                                <FixedInputComponent
                                    value={ isCandidate ? review.employer : review.candidate }
                                    label={ isCandidate ? 'Employer' : 'Candidate' }
                                />
                            </div>
                        </div>
                        <div className={ styles.submitBox }>
                            <FormsySubmitComponent
                                formId={ formId }
                                btnType={ BUTTON_TYPE.ACCENT }
                                size={ BUTTON_SIZE.BIG }
                            >
                                Resend
                            </FormsySubmitComponent>
                        </div>
                    </FormsyComponent>
                </ModalComponent>
            }
        </Fragment>
    );
};

EditReviewComponent.propTypes = {
    handleSubmit: PropTypes.func,
    handleOpenModal: PropTypes.func.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
    showModal: PropTypes.bool,
    review: PropTypes.object.isRequired,
    isCandidate: PropTypes.bool,
    errors: PropTypes.string,
};

export default EditReviewComponent;
