import React, { Fragment }        from 'react';
import PropTypes                  from 'prop-types';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                                 from '../../ButtonComponent';
import ButtonActionComponent      from '../../RowItemComponent/ButtonActionComponent';
import Cross2Icon                 from '../../../../assets/icons/Cross2Icon';
import ModalComponent             from '../../ModalComponent';
import FormsyComponent            from '../../formsy/FormsyComponent';
import FormsySubmitComponent      from '../../formsy/FormsySubmitComponent';
import FormsyFixedInputComponent  from '../../formsy/FormsyFixedInputComponent';
import FormsyInputComponent       from '../../formsy/FormsyInputComponent';
import FormsyHiddenInputComponent from '../../formsy/FormsyHiddenInputComponent';
import styles                     from './styles.scss';

const SendReminderComponent = (props) => {
    const { handleOpenModal, handleCloseModal, showModal, email, name, id, handleSubmit, errors } = props;
    const formId = 'EditReview';

    return (
        <Fragment>

            <ButtonActionComponent
                onClick={ handleOpenModal }
                text="Send Reminder"
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
                            Send Reminder
                        </h2>
                        <div className={ styles.box }>
                            <FormsyHiddenInputComponent
                                name="id"
                                value={ id }
                            />
                            <FormsyFixedInputComponent
                                value={ name }
                                name="reviewerName"
                                label="Reviewer Name"
                            />
                            <FormsyInputComponent
                                value={ email }
                                name="reviewerEmail"
                                label="Reviewer Email"
                                required
                            />
                        </div>
                        <div className={ styles.submitBox }>
                            <FormsySubmitComponent
                                formId={ formId }
                                btnType={ BUTTON_TYPE.ACCENT }
                                size={ BUTTON_SIZE.BIG }
                            >
                                Send
                            </FormsySubmitComponent>
                        </div>
                    </FormsyComponent>
                </ModalComponent>
            }
        </Fragment>
    );
};

SendReminderComponent.propTypes = {
    handleOpenModal: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    errors: PropTypes.string,
    showModal: PropTypes.bool,
};

export default SendReminderComponent;
