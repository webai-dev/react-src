import React          from 'react';
import PropTypes      from 'prop-types';
import ButtonComponent, {
    BUTTON_SIZE,
    BUTTON_TYPE,
}                     from '../ButtonComponent';
import Cross2Icon     from '../../../assets/icons/Cross2Icon';
import ModalComponent from '../ModalComponent';
import styles         from './styles.scss';

const NotMPOModal = (props) => {
    const { handleCloseModal } = props;

    return (
        <ModalComponent
            handleClose={ handleCloseModal }
            classNameInner={ styles.modal }
        >
            <ButtonComponent
                ariaLabel="close modal"
                btnType={ BUTTON_TYPE.LINK }
                className={ styles.close }
                onClick={ handleCloseModal }
            >
                <Cross2Icon />
            </ButtonComponent>
            <h2 className={ styles.title }>
                10 Reviews are required to be able to apply for the marketplace
            </h2>
            <div>
                If you have 10 reviews please contact us at{ ' ' }
                <ButtonComponent
                    to="mailto:support@sourcr.com?subject=RE: Access to marketplace"
                    size={ BUTTON_SIZE.SMALL }
                    btnType={ BUTTON_TYPE.LINK_ACCENT }
                >
                    support@sourcr.com
                </ButtonComponent>{ ' ' }to discuss an application.
            </div>

        </ModalComponent>
    );
};

NotMPOModal.propTypes = {
    handleCloseModal: PropTypes.func.isRequired,
};

export default NotMPOModal;
