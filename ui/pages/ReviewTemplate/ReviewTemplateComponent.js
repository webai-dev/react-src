import React                     from 'react';
import PropTypes                 from 'prop-types';
import ShareReviewImageComponent from '../../components/ShareReviewImageComponent';
import styles                    from './styles.scss';

const ReviewTemplateComponent = (props) => {
    const { recruiter, review, template } = props;
    let postedBy = review.firstName ? `${ review.firstName }, ` : '';
    if (!review.isEmployer) {
        postedBy = postedBy + 'Candidate';
    } else {
        postedBy = postedBy + review.placement?.companyName;
    }
    return (
        <div className={ styles.box }>
            <div className={ styles.zoom }>
                <ShareReviewImageComponent
                    rating={ review.overallRating }
                    review={ review.review }
                    overAllRating={ recruiter.rating.overallRating }
                    reviewsCount={ recruiter.rating.reviewsCount }
                    postedBy={ postedBy }
                    backgroundColor={ template.backgroundColor || recruiter.backgroundColor }
                    color={ template.textColor }
                    backgroundImage={ template.backgroundImage?.url }
                    textAlign={ template.textAlign }
                />
            </div>
        </div>
    );
};

ReviewTemplateComponent.propTypes = {
    recruiter: PropTypes.object.isRequired,
    review: PropTypes.object.isRequired,
    template: PropTypes.object,
};

export default ReviewTemplateComponent;
