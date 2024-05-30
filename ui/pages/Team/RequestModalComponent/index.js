import React                                         from 'react';
import PropTypes                                     from 'prop-types';
import Cross2Icon                                    from '../../../../assets/icons/Cross2Icon';
import ButtonComponent, { BUTTON_SIZE, BUTTON_TYPE } from '../../../components/ButtonComponent';
import FormsyComponent                               from '../../../components/formsy/FormsyComponent';
import FormsyHiddenInputComponent                    from '../../../components/formsy/FormsyHiddenInputComponent';
import FormsyInputComponent                          from '../../../components/formsy/FormsyInputComponent';
import FormsySubmitComponent                         from '../../../components/formsy/FormsySubmitComponent';
import ModalComponent                                from '../../../components/ModalComponent';
import styles                                        from './styles.scss';

const RequestModalComponent = (props) => {
    const { handleCloseModal, handleSendVerification, member } = props;
    const formId = 'request-for-recruiter';
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
                onValidSubmit={ ({ email, id }) => {
                    handleSendVerification(id, email);
                    handleCloseModal();
                } }
                className={ styles.form }
                formId={ formId }
            >
                <h2 className={ styles.title }>
                    Please specify recruiter email
                </h2>
                <div className={ styles.box }>
                    <FormsyInputComponent
                        name="email"
                        label="Recruiter Email"
                        required
                    />
                    <FormsyHiddenInputComponent
                        name="id"
                        value={ member.id }
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
    );
};

RequestModalComponent.propTypes = {
    handleCloseModal: PropTypes.func.isRequired,
    handleSendVerification: PropTypes.func.isRequired,
    member: PropTypes.object.isRequired,
};

export default RequestModalComponent;
