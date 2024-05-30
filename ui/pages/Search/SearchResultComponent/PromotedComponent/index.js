import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { generatePath }         from 'react-router-dom';
import Siema                    from 'siema';
import { PARAM_SLUG, ROUTES }   from '../../../../../constants';
import LocationIcon             from '../../../../../assets/icons/LocationIcon';
import AvatarComponent          from '../../../../components/AvatarComponent';
import RatingComponent          from '../../../../components/Form/RatingComponent';
import styles                   from './styles.scss';

class PromotedComponent extends PureComponent {
    static CAROUSEL_ID = 'carousel';
    static START_INDEX = 0;
    static INTERVAL = styles.interval;
    state = {
        currentIndex: PromotedComponent.START_INDEX,
    };

    componentDidMount() {
        this.Siema = new Siema({
            selector: `#${ PromotedComponent.CAROUSEL_ID }_${ this.props.id }`,
            duration: styles.duration,
            easing: 'ease-out',
            perPage: 1,
            startIndex: PromotedComponent.START_INDEX,
            draggable: this.props.draggable,
            multipleDrag: true,
            threshold: 20,
            loop: true,
            rtl: false,
            onInit: this.handleAutoScroll,
            onChange: this.handleSetItemIndex,
        });
    }

    handleAutoScroll = () => {
        this.autoScrollIntervalId = setInterval(
            () => {
                if (!document.hidden) {
                    this.Siema.next();
                }
            },
            PromotedComponent.INTERVAL,
        );
    };

    /**
     * Set proper index so react can track it and add active style to proper one
     */
    handleSetItemIndex = () => {
        this.setState({ currentIndex: this.Siema.currentSlide });
        clearInterval(this.autoScrollIntervalId);
        this.handleAutoScroll();
    };

    /**
     * Will change slide to clicked index
     *
     * @param {number} index - index from array from 0 to ...
     */
    handleGoTo = (index) => {
        this.Siema.goTo(index);
    };

    componentWillUnmount() {
        clearInterval(this.autoScrollIntervalId);
        this.Siema.destroy();
    }

    render() {
        const { promotedReviews } = this.props;
        const carouselItems = [];
        promotedReviews.forEach((review, index) => {
            const routeToRecruiter = generatePath(
                ROUTES.RECRUITER_PROFILE,
                {
                    [ PARAM_SLUG ]: review.recruiter.slug
                }
            );
            carouselItems.push(
                <div
                    key={ index }
                    className={ styles.reviewBox }
                >
                    <a href={ routeToRecruiter }>
                        <AvatarComponent
                            className={ styles.avatar }
                            url={ review.recruiter.profilePhoto?.url }
                        />
                    </a>
                    <div className={ styles.container }>
                        <a
                            href={ routeToRecruiter }
                            className={ styles.title }
                        >
                            { [ review.recruiter.firstName, review.recruiter.lastName ].join(' ') }
                        </a>
                        <div className={ styles.locationInfo }>
                            <LocationIcon />{ review.recruiter.jobTitle } { review.recruiter.suburb && `(${ review.recruiter.suburb })` }
                        </div>
                        <div className={ styles.review }>
                            &quot;{ review.title }&quot;
                        </div>
                        <RatingComponent
                            fixed
                            small
                            rating={ review.overallRating }
                        />
                    </div>
                </div>,
            );
        });
        return (
            <div
                className={ styles.promotionBox }
            >
                <div id={ `${ PromotedComponent.CAROUSEL_ID }_${ this.props.id }` }>
                    { carouselItems }
                </div>
            </div>
        );
    }
}

PromotedComponent.propTypes = {
    id: PropTypes.string.isRequired,
    draggable: PropTypes.bool,
    promotedReviews: PropTypes.array.isRequired,
};

export default PromotedComponent;
