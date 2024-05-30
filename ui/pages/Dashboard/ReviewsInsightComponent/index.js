import React, { PureComponent, Fragment }    from 'react';
import PropTypes                             from 'prop-types';
import { generatePath }                      from 'react-router-dom';
import { FormattedRelativeTime }             from 'react-intl';
import getDateObjectFromString               from '../../../../util/getDateObjectFromString';
import getMonthYearDateFromDateString        from '../../../../util/getMonthYearDateFromDateString';
import getRelativeTimeUnit                   from '../../../../util/getRelativeTimeUnit';
import { ROUTES, REVIEWS_TAB, INTEGRATIONS } from '../../../../constants';
import GoogleIcon                            from '../../../../assets/icons/GoogleIcon';
import RatingComponent                       from '../../../components/Form/RatingComponent';
import RowItemComponent                      from '../../../components/RowItemComponent';
import ShareActionComponent                  from '../../../components/RowItemComponent/ShareActionComponent';
import SelectComponent                       from '../../../components/SelectComponent';
import SendReminderContainer                 from '../../../components/SendReminderContainer';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE
}                                            from '../../../components/ButtonComponent';
import ProgressBarHorComponent               from '../../../components/ProgressBarHorComponent';
import RequiresPermission                    from '../../../components/User/RequiresPermission';
import RequiresBillingContainer              from '../../../components/RequiresBillingContainer';
import LockMarkerComponent
                                             from '../../../components/RequiresBillingContainer/LockMarkerComponent';
import StarsDistributionComponent            from '../StarsDistributionComponent';
import classNames                            from 'classnames';
import styles                                from './styles.scss';

class ReviewsInsightComponent extends PureComponent {
    state = {
        ratingSelect: ReviewsInsightComponent.RATINGS.ALL,
        specialisationSelect: ReviewsInsightComponent.SPECIALISATIONS.OVERALL,
        employerReviewsCount: this.props.recruiterToDisplay.rating.statistics.industryKnowledge
            .reduce((sum, value) => sum + value, 0),
        candidateReviewsCount: this.props.recruiterToDisplay.rating.statistics.candidateRating
            .reduce((sum, value) => sum + value, 0),
    };

    /**
     * Change rating sorted by specialisation progress statistic for specialisations
     *
     * @param {string} specialisationSelect
     */
    handleChangeSpecialisationSelect = (specialisationSelect) => {
        this.setState({ specialisationSelect });
    };

    /**
     * Change rating type in order to display different progress statistic
     *
     * @param {string} ratingSelect
     */
    handleChangeRatingSelect = (ratingSelect) => {
        this.setState({ ratingSelect });
    };

    render() {
        const { handleChangeRatingSelect, handleChangeSpecialisationSelect } = this;
        const {
            ratingSelect,
            employerReviewsCount,
            candidateReviewsCount,
            specialisationSelect,
        } = this.state;
        const {
            verifiedReviews,
            requestedReviews,
            recruiterToDisplay,
            recruiterId,
            integrations = [],
            googleReviews,
            isShowIntegrations,
            reviewTemplateId,
            isAgency,
        } = this.props;
        const allRatingStatistic = recruiterToDisplay.rating.statistics.candidateQuality.map(
            (candidateQualityItem, index) => (
                recruiterToDisplay.rating.statistics.candidateQuality[ index ] +
                recruiterToDisplay.rating.statistics.industryKnowledge[ index ] +
                recruiterToDisplay.rating.statistics.communication[ index ] +
                recruiterToDisplay.rating.statistics.responsiveness[ index ]
            )
        );
        const selectedStatistic = ratingSelect === ReviewsInsightComponent.RATINGS.ALL ?
            allRatingStatistic :
            recruiterToDisplay.rating.statistics[ ratingSelect ];
        const selectedRating = (
            selectedStatistic.reduce((sum, value, index) => sum + value * (index + 1), 0) /
            (ratingSelect === ReviewsInsightComponent.RATINGS.ALL ? employerReviewsCount * 4 : employerReviewsCount)
        )
            .toFixed(1);
        const candidateRating = (
            recruiterToDisplay.rating.statistics.candidateRating.reduce((sum, value, index) => sum + value * (index + 1), 0) /
            candidateReviewsCount
        )
            .toFixed(1);

        const jobCategoryReviewsOverall = (this.props.recruiterToDisplay.jobCategoryReviewsOverall?.rows || []).map(jobCategory => ({
            name: jobCategory.jobCategory.name,
            rating: jobCategory.rating.overallRating.toFixed(1),
            reviewsCount: jobCategory.rating.reviewsCount
        }));
        const jobCategoryReviewsEmployer = (this.props.recruiterToDisplay.jobCategoryReviewsEmployer?.rows || []).map(jobCategory => ({
            name: jobCategory.jobCategory.name,
            rating: jobCategory.rating.overallRating.toFixed(1),
            reviewsCount: jobCategory.rating.reviewsEmployerCount
        }));
        const jobCategoryReviewsCandidate = (this.props.recruiterToDisplay.jobCategoryReviewsCandidate?.rows || []).map(jobCategory => ({
            name: jobCategory.jobCategory.name,
            rating: jobCategory.rating.overallRating.toFixed(1),
            reviewsCount: jobCategory.rating.reviewsCandidateCount
        }));

        const googleIntegration = integrations && integrations.includes(INTEGRATIONS.GOOGLE);

        return (
            <Fragment>
                <div className={ styles.row }>
                    <div className={ styles.cardBox }>
                        <div className={ styles.card }>
                            <h2>My Reviews</h2>
                            <div className={ styles.countersBox }>
                                <div className={ styles.counter }>
                                    <span className={ styles.counterValue }>{ requestedReviews.length }</span>
                                    <span className={ styles.counterLabel }>Requested</span>
                                </div>
                                <div className={ styles.counter }>
                                    <span className={ styles.counterValue }>{ verifiedReviews.length }</span>
                                    <span className={ styles.counterLabel }>Verified</span>
                                </div>
                            </div>
                            <h4 className={ classNames(styles.pendingTitle, styles.titleSpaced) }>
                                Requested Reviews
                                <ButtonComponent
                                    btnType={ BUTTON_TYPE.LINK_ACCENT }
                                    to={ generatePath(ROUTES.REVIEWS, { [ REVIEWS_TAB._NAME ]: REVIEWS_TAB.REQUESTED }) }
                                    size={ BUTTON_SIZE.SMALL }
                                >
                                    See all
                                </ButtonComponent>
                            </h4>
                            <div>
                                { requestedReviews.length ? requestedReviews.slice(0, 3)
                                    .map(review => (
                                        <RowItemComponent
                                            key={ review.isCandidate ? `Candidate ${ review.id }` : `Employer ${ review.id }` }
                                            header={ review.jobTitle }
                                            infoText={ <div>
                                                <div>
                                                    { review.jobType }
                                                </div>
                                                <div>
                                                    { review.recruiter.firstName }{ ' ' }
                                                    { review.recruiter.lastName }
                                                    { recruiterId === review.recruiterId && ' (Me)' }
                                                </div>
                                            </div> }
                                            isNoAvatar
                                            isSmall
                                            statusText={
                                                <div className={ styles.jobType }>
                                            <span className={ styles.info }>
                                                { review.firstName }{ ' ' }{ review.lastName }
                                            </span>
                                                    { ' ' }
                                                    <span className={ styles.jobLabel }>
                                                { review.isCandidate ? 'Candidate' : 'Employer' }
                                            </span>
                                                </div>
                                            }
                                            actions={
                                                <SendReminderContainer
                                                    id={ review.id }
                                                    name={ [ review.firstName, review.lastName ].filter(Boolean)
                                                        .join(' ') }
                                                    email={ review.email }
                                                    isCandidate={ review.isCandidate }
                                                />
                                            }
                                        />
                                    )) : <span>No requested reviews</span> }
                            </div>
                            <h4 className={ classNames(styles.pendingTitle, styles.titleSpaced) }>
                                Verified Reviews
                                <ButtonComponent
                                    btnType={ BUTTON_TYPE.LINK_ACCENT }
                                    to={ generatePath(ROUTES.REVIEWS, { [ REVIEWS_TAB._NAME ]: REVIEWS_TAB.VERIFIED }) }
                                    size={ BUTTON_SIZE.SMALL }
                                >
                                    See all
                                </ButtonComponent>
                            </h4>
                            <div>
                                { verifiedReviews.length ? verifiedReviews.slice(0, 3)
                                    .map(review => (
                                        <RowItemComponent
                                            key={ review.isCandidate ? `Candidate ${ review.id }` : `Employer ${ review.id }` }
                                            header={ review.title }
                                            infoText={ <div>
                                                <div>
                                                    { review.jobTitle }
                                                </div>
                                                <div>
                                                    { review.recruiter.firstName }{ ' ' }{ review.recruiter.lastName }{ ' ' }
                                                    { getMonthYearDateFromDateString(review.createdAt) }
                                                </div>
                                            </div> }
                                            rating={ review.rating }
                                            isNoAvatar
                                            isSmall
                                            statusText={
                                                <div className={ styles.jobType }>
                                                    <span className={ styles.info }>
                                                        { review.firstName }{ ' ' }{ review.lastName }
                                                    </span>
                                                    { ' ' }
                                                    <span className={ styles.jobLabel }>
                                                        { review.isCandidate ? 'Candidate' : 'Employer' }
                                                    </span>
                                                </div>
                                            }
                                            actions={
                                                <ShareActionComponent
                                                    isAgency={ isAgency }
                                                    templateId={ reviewTemplateId }
                                                    reviewId={ review.reviewId }
                                                    slug={ recruiterToDisplay.slug }
                                                />
                                            }
                                        />
                                    )) : <span>No verified reviews</span> }
                            </div>
                            { isShowIntegrations && <Fragment>
                                <h4 className={ classNames(styles.pendingTitle, styles.googleTitle) }>
                                    <GoogleIcon />oogle reviews
                                    { googleIntegration && googleReviews && <div className={ styles.mainRating }>
                                        <RatingComponent
                                            rating={ googleReviews.averageRating }
                                            fixed
                                        />
                                        <span className={ styles.mainRatingInfo }>
                                    ({ googleReviews.averageRating.toFixed(1) }{ ' ' }
                                            rating based on{ ' ' }
                                            { googleReviews.totalReviewCount }{ ' ' }
                                            { googleReviews.totalReviewCount === 1 ? 'review' : 'reviews' })
                                </span>
                                    </div> }
                                </h4>
                                { googleIntegration && googleReviews && googleReviews.reviews &&
                                googleReviews.reviews.slice(0, 3)
                                    .map((review, index) => {
                                        const rating = {
                                            'ONE': 1,
                                            'TWO': 2,
                                            'THREE': 3,
                                            'FOUR': 4,
                                            'FIVE': 5
                                        }[ review.starRating ];
                                        const relativeDateParams = getRelativeTimeUnit(getDateObjectFromString(
                                            review.updateTime || review.createTime
                                        ));
                                        return (
                                            <div
                                                key={ index }
                                                className={ styles.review }
                                            >
                                                { review.comment }
                                                <div className={ styles.reviewInfo }>
                                                    { review.reviewer.displayName ? review.reviewer.displayName : 'Incognito' }
                                                    <span className={ styles.postedDate }>
                                                        (<FormattedRelativeTime
                                                        numeric="auto"
                                                        value={ relativeDateParams.value }
                                                        unit={ relativeDateParams.unit }
                                                    />)
                                                    </span>
                                                </div>
                                                { rating && <RatingComponent
                                                    rating={ rating }
                                                    fixed
                                                    small
                                                /> }
                                            </div>
                                        );
                                    }) }
                                {
                                    googleIntegration && (!googleReviews || !googleReviews.reviews ||
                                        googleReviews.reviews.length === 0) &&
                                    <div>You currently have no reviews from Google</div>
                                }

                                {
                                    !googleIntegration &&
                                    <Fragment>
                                        <div className={ styles.googleConnect }>
                                            Connect your Google My Business account to display a feed of your reviews...
                                        </div>
                                        <RequiresBillingContainer>
                                            <ButtonComponent
                                                className={ styles.inlineButton }
                                                btnType={ BUTTON_TYPE.ACCENT }
                                                to={ ROUTES.GOOGLE_LOGIN }
                                                forceHref
                                            >
                                                <LockMarkerComponent /> Connect to Google local
                                            </ButtonComponent>
                                        </RequiresBillingContainer>
                                    </Fragment>
                                }
                            </Fragment> }
                        </div>
                    </div>
                    <div className={ styles.cardBox }>
                        <div className={ styles.card }>
                            <h2>
                                Overall ratings


                                { !!(employerReviewsCount || candidateReviewsCount) &&
                                <div className={ styles.mainRating }>
                                    <RatingComponent
                                        rating={ recruiterToDisplay.rating.overallRating }
                                        fixed
                                    />
                                    <span className={ styles.mainRatingInfo }>
                                        ({ recruiterToDisplay.rating.overallRating.toFixed(1) }{ ' ' }
                                        rating based on{ ' ' }
                                        { recruiterToDisplay.rating.reviewsCount }{ ' ' }
                                        { recruiterToDisplay.rating.reviewsCount === 1 ? 'review' : 'reviews' })
                                    </span>
                                </div> }
                            </h2>

                            <h4 className={ styles.pendingTitle }>Employer Ratings</h4>
                            { employerReviewsCount ?
                                <Fragment>
                                    <div className={ styles.mainRating }>
                                        <RatingComponent
                                            small
                                            rating={ +selectedRating }
                                            fixed
                                        />
                                        <span className={ styles.mainRatingInfo }>
                                            ({ selectedRating }{ ' ' }
                                            rating based on{ ' ' }
                                            { employerReviewsCount }{ ' ' }
                                            { employerReviewsCount === 1 ? 'review' : 'reviews' })
                                        </span>
                                    </div>
                                    <SelectComponent
                                        className={ styles.select }
                                        value={ ratingSelect }
                                        setValue={ handleChangeRatingSelect }
                                        values={
                                            [
                                                {
                                                    key: ReviewsInsightComponent.RATINGS.ALL,
                                                    label: 'All categories',
                                                },
                                                {
                                                    key: ReviewsInsightComponent.RATINGS.CANDIDATE_QUALITY,
                                                    label: 'Candidate quality',
                                                },
                                                {
                                                    key: ReviewsInsightComponent.RATINGS.INDUSTRY_KNOWLEDGE,
                                                    label: 'Industry knowledge',
                                                },
                                                {
                                                    key: ReviewsInsightComponent.RATINGS.COMMUNICATION,
                                                    label: 'Communication',
                                                },
                                                {
                                                    key: ReviewsInsightComponent.RATINGS.RESPONSIVENESS,
                                                    label: 'Responsiveness',
                                                },
                                            ]
                                        }
                                    />
                                    <StarsDistributionComponent
                                        ratings={ selectedStatistic }
                                    />
                                </Fragment> :
                                <div>
                                    You currently have no employer reviews
                                </div>
                            }


                            <h4 className={ styles.pendingTitle }>Candidate Ratings</h4>
                            { candidateReviewsCount ?
                                <Fragment>
                                    <div className={ styles.mainRating }>
                                        <RatingComponent
                                            small
                                            rating={ +candidateRating }
                                            fixed
                                        />
                                        <span className={ styles.mainRatingInfo }>
                                        ({ candidateRating }{ ' ' }
                                            rating based on{ ' ' }
                                            { candidateReviewsCount }{ ' ' }
                                            { candidateReviewsCount === 1 ? 'review' : 'reviews' })
                                    </span>
                                    </div>
                                    <StarsDistributionComponent ratings={ recruiterToDisplay.rating.statistics.candidateRating } />
                                </Fragment> :
                                <div>
                                    You currently have no candidate reviews
                                </div>
                            }
                            <RequiresBillingContainer>
                                <h4 className={ styles.pendingTitle }>
                                    <LockMarkerComponent />{ ' Specialisation Ratings' }
                                </h4>
                            </RequiresBillingContainer>
                            <RequiresPermission roles={ [ 'individual_subscription' ] }>
                                <Fragment>
                                    <SelectComponent
                                        className={ styles.select }
                                        value={ specialisationSelect }
                                        setValue={ handleChangeSpecialisationSelect }
                                        values={
                                            [
                                                {
                                                    key: ReviewsInsightComponent.SPECIALISATIONS.OVERALL,
                                                    label: 'Overall Ratings',
                                                },
                                                {
                                                    key: ReviewsInsightComponent.SPECIALISATIONS.CANDIDATE,
                                                    label: 'Candidate Ratings',
                                                },
                                                {
                                                    key: ReviewsInsightComponent.SPECIALISATIONS.EMPLOYER,
                                                    label: 'Employer Ratings',
                                                },
                                            ]
                                        }
                                    />
                                    { (
                                        specialisationSelect === ReviewsInsightComponent.SPECIALISATIONS.OVERALL ?
                                            jobCategoryReviewsOverall :
                                            specialisationSelect === ReviewsInsightComponent.SPECIALISATIONS.CANDIDATE ?
                                                jobCategoryReviewsCandidate :
                                                jobCategoryReviewsEmployer
                                    ).map(jobCategory => (
                                        !!jobCategory.reviewsCount && <ProgressBarHorComponent
                                            key={ jobCategory.name }
                                            label={ jobCategory.name }
                                            progressText={ `${ jobCategory.rating } Stars (${ jobCategory.reviewsCount })` }
                                            progress={ jobCategory.rating / 5 }
                                        />
                                    )) }
                                </Fragment>
                            </RequiresPermission>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

ReviewsInsightComponent.RATINGS = {
    ALL: 'all',
    CANDIDATE_QUALITY: 'candidateQuality',
    INDUSTRY_KNOWLEDGE: 'industryKnowledge',
    COMMUNICATION: 'communication',
    RESPONSIVENESS: 'responsiveness',
};

ReviewsInsightComponent.SPECIALISATIONS = {
    OVERALL: 'overall',
    CANDIDATE: 'candidate',
    EMPLOYER: 'employer',
};

ReviewsInsightComponent.propTypes = {
    verifiedReviews: PropTypes.array,
    requestedReviews: PropTypes.array,
    recruiterToDisplay: PropTypes.object.isRequired,
    recruiterId: PropTypes.string.isRequired,
    integrations: PropTypes.array,
    googleReviews: PropTypes.object,
    isShowIntegrations: PropTypes.bool,
    isAgency: PropTypes.bool,
    reviewTemplateId: PropTypes.string,
};

export default ReviewsInsightComponent;
