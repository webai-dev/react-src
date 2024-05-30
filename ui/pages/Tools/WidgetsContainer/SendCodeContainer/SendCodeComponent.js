import React, { Fragment }        from 'react';
import PropTypes                  from 'prop-types';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                                 from '../../../../components/ButtonComponent';
import Cross2Icon                 from '../../../../../assets/icons/Cross2Icon';
import ModalComponent             from '../../../../components/ModalComponent';
import FormsyComponent            from '../../../../components/formsy/FormsyComponent';
import FormsySubmitComponent      from '../../../../components/formsy/FormsySubmitComponent';
import FormsyInputComponent       from '../../../../components/formsy/FormsyInputComponent';
import FormsyHiddenInputComponent from '../../../../components/formsy/FormsyHiddenInputComponent';
import styles                     from './styles.scss';

const SendCodeComponent = (props) => {
    const { handleOpenModal, handleCloseModal, handleSubmit, showModal, className, iframeUrl } = props;
    const formId = 'SendCodeToEmail';

    return (
        <Fragment>

            <ButtonComponent
                className={ className }
                btnType={ BUTTON_TYPE.BORDER }
                size={ BUTTON_SIZE.BIG }
                onClick={ handleOpenModal }
                main
            >
                Email code
            </ButtonComponent>

            { // MODAL
                showModal &&
                <ModalComponent handleClose={ handleCloseModal }>
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
                    >
                        <h2 className={ styles.title }>
                            Email
                        </h2>
                        <FormsyInputComponent
                            required
                            placeholder="Email"
                            modifyValueOnChange={ value => value ? value.trim() : value }
                            name="email"
                        />
                        <FormsyHiddenInputComponent
                            required
                            value={ iframeUrl }
                            name="url"
                        />
                        <FormsySubmitComponent
                            formId={ formId }
                            btnType={ BUTTON_TYPE.ACCENT }
                            size={ BUTTON_SIZE.BIG }
                        >
                            Send Code
                        </FormsySubmitComponent>
                    </FormsyComponent>
                </ModalComponent>
            }
        </Fragment>
    );
};

SendCodeComponent.propTypes = {
    handleOpenModal: PropTypes.func.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    showModal: PropTypes.bool,
    className: PropTypes.string,
    iframeUrl: PropTypes.string.isRequired,
};

export default SendCodeComponent;
