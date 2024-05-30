import React, { PureComponent, Fragment } from 'react';
import PropTypes                          from 'prop-types';
import ButtonComponent, { BUTTON_TYPE }   from '../../../components/ButtonComponent';
import ReviewDetailsContainer             from '../../../components/ReviewDetailsContainer';
import styles                             from './styles.scss';

class ReviewButtonContainer extends PureComponent {
    state = {
        showModal: false,
    };
    /**
     * Will open modal to send email
     */
    handleOpenModal = () => {
        this.setState({ showModal: true });
    };

    /**
     * Will close modal to send email
     */
    handleCloseModal = () => {
        this.setState({ showModal: false });
    };

    render() {
        const { reviewId, isCandidate } = this.props;
        const { handleOpenModal, handleCloseModal } = this;
        const { showModal } = this.state;
        return (
            <Fragment>
                <ButtonComponent
                    className={ styles.reviewButton }
                    onClick={ handleOpenModal }
                    btnType={ BUTTON_TYPE.LINK_ACCENT }
                >
                    { isCandidate ? 'Candidate review' : 'Employer review' }
                </ButtonComponent>
                { showModal && <ReviewDetailsContainer
                    handleCloseModal={ handleCloseModal }
                    reviewId={ reviewId }
                    isInnerApp
                /> }
            </Fragment>
        );
    }
}

ReviewButtonContainer.propTypes = {
    reviewId: PropTypes.string.isRequired,
    isCandidate: PropTypes.bool,
};

export default ReviewButtonContainer;
