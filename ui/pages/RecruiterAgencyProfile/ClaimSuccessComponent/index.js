import React                                         from 'react';
import PropTypes                                     from 'prop-types';
import ModalComponent                                from '../../../components/ModalComponent';
import ButtonComponent, { BUTTON_TYPE, BUTTON_SIZE } from '../../../components/ButtonComponent';
import CrossIcon                                     from '../../../../assets/icons/CrossIcon';
import { ROUTES }                                    from '../../../../constants';
import styles                                        from './styles.scss';

const ClaimSuccessComponent = (props) => {
    const { handleCloseModal } = props;

    return (
        <ModalComponent
            classNameInner={ styles.modal }
            handleClose={ handleCloseModal }
        >
            <ButtonComponent
                ariaLabel="close modal"
                btnType={ BUTTON_TYPE.LINK }
                className={ styles.close }
                onClick={ handleCloseModal }
            >
                <CrossIcon />
            </ButtonComponent>
            Congratulations you have claimed your profile!
            <div>
                Click{ ' ' }
                <ButtonComponent
                    btnType={ BUTTON_TYPE.LINK_ACCENT }
                    size={ BUTTON_SIZE.SMALL }
                    to={ ROUTES.RECRUITER_PROFILE_EDIT }
                >
                    here
                </ButtonComponent>
                { ' ' }to get started.
            </div>
        </ModalComponent>
    );
};

ClaimSuccessComponent.propTypes = {
    handleCloseModal: PropTypes.func.isRequired,
};

export default ClaimSuccessComponent;
