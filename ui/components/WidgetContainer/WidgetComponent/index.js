import React, { PureComponent, Fragment }         from 'react';
import PropTypes                                  from 'prop-types';
import { WIDGET_TYPE, BaseAPiPath, isLocalBuild } from '../../../../constants';
import Cross2Icon                                 from '../../../../assets/icons/Cross2Icon';
import logo                                       from '../../../../images/logo.svg';
import logoNegative                               from '../../../../images/logo-negative.svg';
import CarouselComponent                          from '../../../components/CarouselComponent';
import ModalWidgetComponent                       from '../ModalWidgetComponent';
import RatingComponent                            from '../../Form/RatingComponent';
import classNames                                 from 'classnames';
import styles                                     from './styles.scss';

class WidgetComponent extends PureComponent {
    state = {
        showModal: false,
    };

    /**
     * Open modal with reviews
     */
    handleShowModal = () => {
        this.setState({ showModal: true });
    };
    /**
     * Hide modal with reviews
     */
    handleCloseModal = () => {
        this.setState({ showModal: false });
    };
    /**
     * Programmatically redirect user to agency or recruiter profile
     */
    handleChangeLocation = () => {
        window.open(this.props.pathToAllReviews);
    };

    render() {
        const {
            className,
            isDarkTheme,
            pathToAllReviews,
            reviewsCount,
            reviews,
            type,
            isApp,
            overallRating,
        } = this.props;

        const { showModal } = this.state;
        const { handleShowModal, handleCloseModal, handleChangeLocation } = this;

        const items = reviews.map((review, index) => (
            <a
                className={ classNames(styles.item, { [ styles.itemDouble ]: type === WIDGET_TYPE.DOUBLE && reviews.length > 1 }) }
                key={ index }
                href={ pathToAllReviews }
                target="_blank"
                rel="noopener noreferrer"
            >
                <div className={ styles.itemTitle }>
                    { review.title }
                </div>
                <RatingComponent
                    rating={ review.overallRating }
                    fixed
                    small
                />
                <div className={ styles.itemText }>
                    { review.review }
                </div>
                <div className={ styles.itemName }>
                    {
                        [
                            review.firstName,
                            review.isEmployer ? `${ review?.placement?.companyName || 'Employer' }` : 'Candidate'
                        ]
                            .filter(Boolean)
                            .join(', ')
                    }
                </div>
            </a>
        ));

        if (type === WIDGET_TYPE.ASIDE || type === WIDGET_TYPE.FOOTER) {
            const widget = (
                <Fragment>
                    { showModal && <ModalWidgetComponent
                        handleClose={ handleCloseModal }
                        isInPlace={ isApp }
                        classNameOuter={ styles.modal }
                    >
                        <button
                            aria-label="close modal"
                            className={ styles.close }
                            onClick={ handleCloseModal }
                        >
                            <Cross2Icon />
                        </button>
                        <div className={ styles.boxModal }>
                            <div className={ styles.titleBox }>
                                <span className={ styles.title }>
                                    <b className={ styles.titleBold }>Rated{ ' ' }{ overallRating.toFixed(1) }</b>/5{ ' ' }
                                    { reviewsCount && <span className={ styles.fade }>
                                        { `(based on ${ reviewsCount } ${ reviewsCount === 1 ? 'review' : 'reviews' })` }
                                    </span> }
                                </span>
                                <RatingComponent
                                    className={ styles.ratingMain }
                                    rating={ overallRating }
                                    fixed
                                />
                            </div>
                            <div className={ styles.items }>
                                { items }
                            </div>
                            <a
                                href={ pathToAllReviews }
                                className={ styles.logoButton }
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    className={ styles.logo }
                                    src={ (isLocalBuild ? '' : BaseAPiPath) + logo }
                                    alt="Sourcr logo"
                                />
                            </a>
                            <a
                                href={ pathToAllReviews }
                                className={ styles.allReviewsButton }
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                See all { reviewsCount } reviews
                            </a>
                        </div>
                    </ModalWidgetComponent> }
                    <div
                        className={ classNames(styles.small, {
                            [ styles.inApp ]: isApp,
                            [ styles.aside ]: type === WIDGET_TYPE.ASIDE,
                            [ styles.footer ]: type === WIDGET_TYPE.FOOTER,
                            [ styles.carouselBoxDark ]: isDarkTheme,
                        }) }
                        onClick={ type === WIDGET_TYPE.FOOTER ? handleChangeLocation : handleShowModal }
                    >
                        <span>
                            <b>{ overallRating.toFixed(1) }</b>/5
                        </span>
                        <RatingComponent
                            className={ styles.rating }
                            rating={ overallRating }
                            fixed
                            small
                        />
                        <span className={ styles.smallInfo }>
                            Verified Customer Reviews
                        </span>
                        <img
                            className={ styles.logo }
                            src={ (isLocalBuild ? '' : BaseAPiPath) + (isDarkTheme ? logoNegative : logo) }
                            alt="Sourcr logo"
                        />
                    </div>
                </Fragment>);
            return isApp ? (
                <div
                    className={ classNames(
                        className,
                        styles.col,
                        styles.border,
                        styles.carouselBox,
                        styles.biggerBox,
                    ) }
                >
                    { widget }
                </div>
            ) : widget;
        }

        return (
            <div
                className={ classNames(
                    className,
                    styles.col,
                    styles.carouselBox,
                    {
                        [ styles.border ]: isApp,
                        [ styles.carouselBoxDark ]: isDarkTheme,
                        [ styles.colDouble ]: type === WIDGET_TYPE.DOUBLE && reviews.length > 1
                    },
                ) }
            >
                <CarouselComponent
                    className={ classNames(styles.box, { [ styles.boxDouble ]: type === WIDGET_TYPE.DOUBLE && reviews.length > 1 }) }
                    id={ type }
                    items={ items }
                    perPage={ (type === WIDGET_TYPE.DOUBLE && reviews.length > 1) ? 2 : 1 }
                />
                <div className={ styles.filler } />
                <span className={ styles.marginTop }>
                    <b>{ overallRating.toFixed(1) }</b>/5
                </span>
                <RatingComponent
                    className={ styles.rating }
                    rating={ overallRating }
                    fixed
                    small
                />
                <a
                    href={ pathToAllReviews }
                    className={ styles.logoButton }
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        className={ styles.logo }
                        src={ (isLocalBuild ? '' : BaseAPiPath) + (isDarkTheme ? logoNegative : logo) }
                        alt="Sourcr logo"
                    />
                </a>
                <a
                    href={ pathToAllReviews }
                    className={ styles.allReviewsButton }
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    See all { reviewsCount } reviews
                </a>
            </div>
        );
    }
}

WidgetComponent.propTypes = {
    className: PropTypes.string,
    pathToAllReviews: PropTypes.string.isRequired,
    isDarkTheme: PropTypes.bool,
    reviewsCount: PropTypes.number.isRequired,
    reviews: PropTypes.array.isRequired,
    type: PropTypes.string,
    isApp: PropTypes.bool,
    overallRating: PropTypes.number.isRequired,
    slug: PropTypes.string.isRequired,
};

export default WidgetComponent;
