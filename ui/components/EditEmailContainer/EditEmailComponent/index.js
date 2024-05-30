import React, { Fragment } from 'react';
import PropTypes           from 'prop-types';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
} from '../../ButtonComponent';
import ModalComponent        from '../../ModalComponent';
import InputComponent        from '../../Form/InputComponent';
import FormsyComponent       from '../../formsy/FormsyComponent';
import FormsyInputComponent  from '../../formsy/FormsyInputComponent';
import FormsySubmitComponent from '../../formsy/FormsySubmitComponent';
import PencilIcon            from '../../../../assets/icons/PencilIcon';
import Cross2Icon            from '../../../../assets/icons/Cross2Icon';
import styles                from './styles.scss';

const EditEmailComponent = (props) => {
    const {
        isLoading,
        showModal,
        email,
        handleSubmit,
        handleOpenModal,
        handleCloseModal,
        error,
    } = props;
    const formId = 'ChangeEmailId';

    return (
        <Fragment>
            <div onClick={ handleOpenModal } className={ styles.inputBox }>
                <InputComponent
                    setValue={ () => {} }
                    placeholder="Enter email"
                    name="emailModal"
                    post={ <PencilIcon /> }
                    value={ email }
                />
            </div>

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
                    <div className={ styles.form }>
                        <h2 className={ styles.title }>
                            Change Email
                        </h2>
                        <FormsyComponent
                            onValidSubmit={ handleSubmit }
                            formId={ formId }
                            errorMessage={ error }
                        >
                            <FormsyInputComponent
                                value={ email }
                                name="email"
                                placeholder="Enter your new email"
                                label="New Email"
                                validations="isEmail"
                                validationError="This is not a valid email"
                                required
                                modifyValueOnChange={ value => value ? value.trim() : value }
                            />
                        </FormsyComponent>
                        <FormsySubmitComponent
                            className={ styles.button }
                            formId={ formId }
                            btnType={ BUTTON_TYPE.ACCENT }
                            size={ BUTTON_SIZE.BIG }
                            disabled={ isLoading }
                        >
                            Send
                        </FormsySubmitComponent>
                    </div>
                </ModalComponent>
            }
        </Fragment>
    );
};

EditEmailComponent.propTypes = {
    showModal: PropTypes.bool,
    isLoading: PropTypes.bool,
    email: PropTypes.string.isRequired,
    error: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    handleOpenModal: PropTypes.func.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
};

export default EditEmailComponent;
