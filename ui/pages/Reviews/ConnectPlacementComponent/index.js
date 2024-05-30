import React, { Fragment }          from 'react';
import PropTypes                    from 'prop-types';
import { generatePath }             from 'react-router-dom';
import ButtonComponent, {
    BUTTON_TYPE,
}                                   from '../../../components/ButtonComponent';
import FormsyComponent              from '../../../components/formsy/FormsyComponent';
import FormsySubmitComponent        from '../../../components/formsy/FormsySubmitComponent';
import ButtonActionComponent        from '../../../components/RowItemComponent/ButtonActionComponent';
import Cross2Icon                   from '../../../../assets/icons/Cross2Icon';
import ModalComponent               from '../../../components/ModalComponent';
import { ROUTES, PARAM_REVIEW_ID }  from '../../../../constants';
import PlacementsForReviewContainer from './PlacementsForReviewContainer';
import styles                       from './styles.scss';

const SendReminderComponent = (props) => {
    const {
        handleOpenModal,
        handleCloseModal,
        showModal,
        isCandidate,
        handleSubmit,
        isLoading,
        errors,
        reviewId
    } = props;
    const formId = 'connectReviewForm';

    return (
        <Fragment>
            <ButtonActionComponent
                onClick={ handleOpenModal }
                text="Verify"
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
                            Attach to Placement
                        </h2>
                        <div className={ styles.box }>
                            <PlacementsForReviewContainer
                                isCandidate={ isCandidate }
                                className={ styles.dropDown }
                                selectClassName={ styles.dropDownHeight }
                            />
                        </div>
                        <div className={ styles.buttonBox }>
                            <FormsySubmitComponent
                                formId={ formId }
                                disabled={ isLoading }
                            >
                                Connect placement
                            </FormsySubmitComponent>
                            <ButtonComponent
                                btnType={ BUTTON_TYPE.ACCENT }
                                className={ styles.button }
                                disabled={ isLoading }
                                to={ generatePath(ROUTES.PLACEMENTS_FOR_REVIEW, { [ PARAM_REVIEW_ID ]: reviewId }) }
                            >
                                Add new
                            </ButtonComponent>
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
    reviewId: PropTypes.string.isRequired,
    errors: PropTypes.string,
    isCandidate: PropTypes.bool,
    showModal: PropTypes.bool,
    isLoading: PropTypes.bool,
};

export default SendReminderComponent;
