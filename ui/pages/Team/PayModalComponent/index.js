import React                                         from 'react';
import PropTypes                                     from 'prop-types';
import Cross2Icon                                    from '../../../../assets/icons/Cross2Icon';
import ButtonComponent, { BUTTON_SIZE, BUTTON_TYPE } from '../../../components/ButtonComponent';
import ModalComponent                                from '../../../components/ModalComponent';
import styles                                        from './styles.scss';

const PayModalComponent = (props) => {
    const { handleCloseModal, enableUser } = props;
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
                    Enabling this recruiter will updated your subscription based on your current plan
                </h2>
                <div className={ styles.buttonBox }>
                    <ButtonComponent
                        className={ styles.button }
                        btnType={ BUTTON_TYPE.ACCENT }
                        size={ BUTTON_SIZE.BIG }
                        onClick={ enableUser }
                    >
                        Enable
                    </ButtonComponent>
                </div>
            </div>
        </ModalComponent>
    );
};

PayModalComponent.propTypes = {
    handleCloseModal: PropTypes.func.isRequired,
    enableUser: PropTypes.func.isRequired,
};

export default PayModalComponent;
