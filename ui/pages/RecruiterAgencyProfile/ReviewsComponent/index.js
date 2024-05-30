import React           from 'react';
import PropTypes       from 'prop-types';
import {
    generatePath,
}                      from 'react-router-dom';
import RadioComponent  from '../../../components/RadioComponent';
import ReviewComponent from '../../../components/ReviewComponent';
import {
    ROUTES,
    PARAM_SLUG,
    PROFILE_MODAL,
    PARAM_REVIEW_ID,
} from '../../../../constants';
import styles          from './styles.scss';

const ReviewsComponent = (props) => {
    const {
        handleGoToQuery,
        tabs,
        tab,
        reviews,
        search,
        slug,
        isAgency,
    } = props;

    return (
        <div>
            <div className={ styles.boxRadio }>
                <RadioComponent
                    label="All"
                    name="review"
                    value={ tab === tabs.ALL }
                    onChange={ () => {handleGoToQuery(tabs.ALL);} }
                />
                <RadioComponent
                    label="From employers"
                    name="review"
                    value={ tab === tabs.EMPLOYERS }
                    onChange={ () => {handleGoToQuery(tabs.EMPLOYERS);} }
                />
                <RadioComponent
                    label="From candidates"
                    name="review"
                    value={ tab === tabs.CANDIDATES }
                    onChange={ () => {handleGoToQuery(tabs.CANDIDATES);} }
                />
            </div>
            { !reviews.length && <div>There are currently no reviews available</div> }
            <div className={ styles.reviews }>
                { reviews.map(review => {
                    return (
                        <ReviewComponent
                            reviewRoute={
                                generatePath(
                                    isAgency ? ROUTES.AGENCY_PROFILE : ROUTES.RECRUITER_PROFILE,
                                    {
                                        [ PARAM_SLUG ]: slug,
                                        [ PROFILE_MODAL._NAME ]: PROFILE_MODAL.REVIEW,
                                        [ PARAM_REVIEW_ID ]: review.reviewId,
                                    },
                                ) + search
                            }
                            key={ review.id + (review.isCandidate ? 'candidate' : 'employer') }
                            review={ review }
                        />
                    );
                }) }
            </div>
        </div>
    );
};

ReviewsComponent.propTypes = {
    handleGoToQuery: PropTypes.func.isRequired,
    tabs: PropTypes.object.isRequired,
    tab: PropTypes.string.isRequired,
    reviews: PropTypes.array.isRequired,
    search: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    isAgency: PropTypes.bool,
};

export default ReviewsComponent;
