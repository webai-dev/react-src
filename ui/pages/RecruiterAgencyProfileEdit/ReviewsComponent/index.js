import React           from 'react';
import PropTypes       from 'prop-types';
import ReviewComponent from '../../../components/ReviewComponent';
import { ROUTES }      from '../../../../constants';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
} from '../../../components/ButtonComponent';
import styles from './styles.scss';

const ReviewsComponent = (props) => {
    const { reviews } = props;

    return (
        <div>
            { (!reviews || !reviews.length) &&
            <div className={ styles.box }>
                <div>
                    You currently have no reviews. To get started{ ' ' }
                    <ButtonComponent
                        size={ BUTTON_SIZE.SMALL }
                        btnType={ BUTTON_TYPE.LINK_ACCENT }
                        to={ ROUTES.PLACEMENTS_NEW }
                    >click here</ButtonComponent>.
                </div>
            </div> }
            { reviews.map(review => (
                <ReviewComponent
                    key={ review.id + (review.isCandidate ? 'candidate' : 'employer') } className={ styles.box }
                    isInnerApp
                    review={ review }
                />
            )) }
        </div>
    );
};

ReviewsComponent.propTypes = {
    reviews: PropTypes.array.isRequired,
};

export default ReviewsComponent;
