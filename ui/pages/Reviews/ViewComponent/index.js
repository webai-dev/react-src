import React, { PureComponent, Fragment }            from 'react';
import PropTypes                                     from 'prop-types';
import ButtonActionComponent                         from '../../../components/RowItemComponent/ButtonActionComponent';
import ButtonComponent, { BUTTON_TYPE, BUTTON_SIZE } from '../../../components/ButtonComponent';
import ReviewDetailsContainer                        from '../../../components/ReviewDetailsContainer';
import styles                                        from './styles.scss';

class ViewComponent extends PureComponent {
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
        const { review, name } = this.props;
        const { handleOpenModal, handleCloseModal } = this;
        const { showModal } = this.state;
        return (
            <Fragment>
                {
                    name ?
                        <ButtonComponent
                            className={ styles.button }
                            onClick={ handleOpenModal }
                            btnType={ BUTTON_TYPE.LINK_ACCENT }
                            size={ BUTTON_SIZE.SMALL }
                        >
                            { name }
                        </ButtonComponent> :
                        <ButtonActionComponent
                            onClick={ handleOpenModal }
                            text="View"
                        />
                }

                { // MODAL
                    showModal &&
                    <ReviewDetailsContainer
                        handleCloseModal={ handleCloseModal }
                        reviewId={ review.reviewId }
                        isInnerApp
                    />
                }
            </Fragment>
        );
    }
}

ViewComponent.propTypes = {
    review: PropTypes.object.isRequired,
    name: PropTypes.string,
};

export default ViewComponent;
