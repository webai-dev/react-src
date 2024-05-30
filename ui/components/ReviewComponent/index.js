import React, {
    PureComponent,
    Fragment,
}                                     from 'react';
import PropTypes                      from 'prop-types';
import { Link }                       from 'react-router-dom';
import getMonthYearDateFromDateString from '../../../util/getMonthYearDateFromDateString';
import RatingComponent                from '../Form/RatingComponent';
import ReviewDetailsContainer         from '../ReviewDetailsContainer';
import { KEYS }                       from '../../../constants';
import classNames                     from 'classnames';
import styles                         from './styles.scss';

class ReviewComponent extends PureComponent {
    state = {
        showModal: false,
    };

    /**
     * Close modal
     */
    handleCloseModal = () => {
        this.setState({ showModal: false });
    };
    /**
     * Open modal
     */
    handleOpenModal = () => {
        this.setState({ showModal: true });
    };
    /**
     * Open modal on space bar or enter
     *
     * @param {ReactEvent} event
     */
    handleOpenModalOnKeyPress = (event) => {
        event.preventDefault();
        if (event.key === KEYS.ENTER) {
            this.handleOpenModal();
        }
    };

    render() {
        const { noAction, review, className, isInnerApp, reviewRoute } = this.props;
        const { showModal } = this.state;
        const { handleCloseModal, handleOpenModal, handleOpenModalOnKeyPress } = this;

        const reviewProps = !noAction ?
            reviewRoute ? {
                    to: reviewRoute,
                    alt: `${ review.name } review. ${ review.title }`
                } :
                {
                    tabIndex: '0',
                    onClick: handleOpenModal,
                    onKeyPress: handleOpenModalOnKeyPress,
                } : {};

        const Component = reviewRoute ? Link : 'div';

        return (
            <Fragment>
                {
                    !noAction && showModal &&
                    <ReviewDetailsContainer
                        handleCloseModal={ handleCloseModal }
                        reviewId={ review.reviewId }
                        isInnerApp={ isInnerApp }
                    />
                }
                <Component
                    itemProp="review"
                    itemScope
                    itemType="http://schema.org/Review"
                    className={ classNames(
                        className,
                        styles.review,
                        {
                            [ styles.reviewAction ]: !noAction,
                            [ styles.reviewInnerApp ]: isInnerApp,
                        },
                    )
                    }
                    { ...reviewProps }
                >
                    <div className={ styles.header }>
                        { isInnerApp ?
                            <h2
                                itemProp="name"
                                className={ styles.title }
                            >{ review.title }</h2> :
                            <h3
                                itemProp="name"
                                className={ styles.title }
                            >{ review.title }</h3>
                        }
                        <span className={ styles.date }>
                            <span
                                itemProp="datePublished"
                                content={
                                    (new Date(review.createdAt)).getFullYear() + '-' +
                                    ((new Date(review.createdAt)).getMonth() + 1) + '-' +
                                    (new Date(review.createdAt)).getDate()
                                }
                            >
                                { getMonthYearDateFromDateString(review.createdAt) }
                            </span>
                        </span>
                    </div>
                    <div className={ styles.ratingBox }>
                        <RatingComponent
                            rating={ review.rating }
                            small
                            fixed
                        />{ ' ' }
                        <span
                            className={ styles.ratingText }
                            itemProp="reviewRating"
                            itemScope
                            itemType="http://schema.org/Rating"
                        >
                           (<span itemProp="ratingValue">{ review.rating }</span>/<span itemProp="bestRating">5</span>)
                        </span>
                    </div>
                    { review.text && <div
                        className={ styles.text }
                        itemProp="reviewBody"
                    >
                        { review.text }
                    </div> }
                    <div
                        className={ styles.reviewer }
                        itemProp="author"
                    >
                        { review.firstName ? `${ review.firstName }, ` : '' }
                        { review.isCandidate ? 'Candidate' : review.companyName }
                    </div>
                </Component>
            </Fragment>
        );
    }
}

ReviewComponent.propTypes = {
    withOwnModal: PropTypes.bool,
    isInnerApp: PropTypes.bool,
    noAction: PropTypes.bool,
    className: PropTypes.string,
    review: PropTypes.object,
    reviewRoute: PropTypes.string,
};

export default ReviewComponent;
