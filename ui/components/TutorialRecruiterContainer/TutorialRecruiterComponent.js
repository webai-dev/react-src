import React          from 'react';
import PropTypes      from 'prop-types';
import ModalComponent from '../ModalComponent';
import Step1Component from './Step1Component';
import Step2Component from './Step2Component';
import Step3Component from './Step3Component';
import Step4Component from './Step4Component';
import styles         from './styles.scss';

const TutorialRecruiterComponent = (props) => {
    const { step, handleChangeStep, handleClose, handleSendReview, user, users } = props;

    return (
        <ModalComponent
            handleClose={ step === 4 ? handleClose : () => {} }
            classNameOuter={ styles.modal }
        >
            { step === 1 && <Step1Component
                user={ user }
                handleNext={ () => {handleChangeStep(step + 1);} }
            /> }
            { step === 2 && <Step2Component
                handleNext={ () => {handleChangeStep(step + 1);} }
                handlePrev={ () => {handleChangeStep(step - 1);} }
                handleClose={ handleClose }
            /> }
            { step === 3 && <Step3Component
                handleInviteTeam={ () => {handleChangeStep(step + 1);} }
                handleSendReview={ handleSendReview }
                handlePrev={ () => {handleChangeStep(step - 1);} }
                handleClose={ handleClose }
            /> }
            { step === 4 && <Step4Component
                users={ users }
                handleClose={ handleClose }
            /> }
        </ModalComponent>
    );
};

TutorialRecruiterComponent.propTypes = {
    step: PropTypes.number.isRequired,
    user: PropTypes.object.isRequired,
    handleChangeStep: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleSendReview: PropTypes.func.isRequired,
    users: PropTypes.array,
};

export default TutorialRecruiterComponent;
