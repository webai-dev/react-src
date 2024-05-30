import React                            from 'react';
import PropTypes                        from 'prop-types';
import Cross2Icon                       from '../../../assets/icons/Cross2Icon';
import TEST_IDS                         from '../../../tests/testIds';
import ButtonComponent, { BUTTON_TYPE } from '../ButtonComponent';
import ModalComponent                   from '../ModalComponent';
import styles                           from './styles.scss';

const ReceivedReviewComponent = (props) => {
    const { handleClose, handleGoToReviews } = props;

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
                    Congratulations, you got a new review!
                </h2>
                <div className={ styles.text }>
                    Why not share your great work on Linkedin and watch the likes come in!
                </div>
                <div className={ styles.buttonBox }>
                    <ButtonComponent
                        dataTest={ TEST_IDS.SEE_NEW_REVIEW }
                        onClick={ handleGoToReviews }
                        btnType={ BUTTON_TYPE.ACCENT }
                    >
                        See Reviews
                    </ButtonComponent>
                </div>
            </div>
        </ModalComponent>
    );
};

ReceivedReviewComponent.propTypes = {
    handleClose: PropTypes.func.isRequired,
    handleGoToReviews: PropTypes.func.isRequired,
};

export default ReceivedReviewComponent;
