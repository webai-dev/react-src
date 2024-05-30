import React                            from 'react';
import PropTypes                        from 'prop-types';
import Cross2Icon                       from '../../../assets/icons/Cross2Icon';
import ButtonComponent, { BUTTON_TYPE } from '../ButtonComponent';
import ModalComponent                   from '../ModalComponent';
import styles                           from './styles.scss';

const JAInitialComponent = (props) => {
    const { handleClose, handleGoToPlacements } = props;

    return (
        <ModalComponent
            handleClose={ handleClose }
            classNameOuter={ styles.modal }
        >
            <ButtonComponent
                ariaLabel="close modal"
                btnType={ BUTTON_TYPE.LINK }
                className={ styles.close }
                onClick={ handleClose }
            >
                <Cross2Icon />
            </ButtonComponent>
            <div className={ styles.box }>
                <h2 className={ styles.title }>
                    JobAdder has successfully been connected!
                </h2>
                <div className={ styles.text }>
                    Check out your imported placements and start sending review invites!
                </div>
                <div className={ styles.buttonBox }>
                    <ButtonComponent
                        onClick={ handleGoToPlacements }
                        btnType={ BUTTON_TYPE.ACCENT }
                    >
                        Go to Placements
                    </ButtonComponent>
                </div>
            </div>
        </ModalComponent>
    );
};

JAInitialComponent.propTypes = {
    handleClose: PropTypes.func.isRequired,
    handleGoToPlacements: PropTypes.func.isRequired,
};

export default JAInitialComponent;
