import React           from 'react';
import PropTypes       from 'prop-types';
import LogoImage       from '../../../images/logo-negative.svg';
import QuoteIcon       from '../../../assets/icons/QuoteIcon';
import { BaseAPiPath } from '../../../constants';
import RatingComponent from '../Form/RatingComponent';
import styles          from './styles.scss';

const ShareReviewImageComponent = (props) => {
    const {
        rating,
        review,
        reviewsCount,
        overAllRating,
        postedBy,
        backgroundColor,
        color,
        backgroundImage,
        textAlign,
    } = props;

    const fullUrl = backgroundImage && (backgroundImage.includes('data:') ?
        backgroundImage :
        `${ BaseAPiPath }${ backgroundImage }`);

    return (
        <div className={ styles.shareBox }>
            <div
                className={ styles.image }
                style={ {
                    backgroundImage: fullUrl && `url(${ fullUrl })`,
                    backgroundColor: backgroundColor,
                    textAlign: textAlign,
                } }
            >
                <div
                    className={ styles.review }
                    style={ {
                        color: color
                    } }
                >
                    <span className={ styles.quoteContainer }><QuoteIcon /></span>
                    { review }
                </div>
                <div
                    className={ styles.posted }
                    style={ {
                        color: color
                    } }
                >
                    { postedBy }
                </div>

                <div
                    className={ styles.ratingBox }
                    style={ {
                        justifyContent: {
                            left: 'flex-start',
                            center: 'center',
                            right: 'flex-end'
                        }[ textAlign ]
                    } }
                >
                    <RatingComponent
                        className={ styles.rating }
                        rating={ rating }
                        fixed
                    />
                </div>
            </div>
            <div className={ styles.shareFooter }>
                { overAllRating.toFixed(1) } rating rating based
                on { reviewsCount } { reviewsCount === 1 ? 'review' : 'reviews' }
                <img
                    className={ styles.logo }
                    src={ LogoImage }
                    alt="Sourcr logo"
                />
            </div>
        </div>
    );
};

ShareReviewImageComponent.propTypes = {
    rating: PropTypes.number.isRequired,
    overAllRating: PropTypes.number.isRequired,
    review: PropTypes.string.isRequired,
    reviewsCount: PropTypes.number.isRequired,
    postedBy: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
    backgroundImage: PropTypes.string,
    textAlign: PropTypes.string,
};

export default ShareReviewImageComponent;
