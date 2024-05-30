import React, { Fragment }            from 'react';
import PropTypes                      from 'prop-types';
import { generatePath }               from 'react-router-dom';
import TEST_IDS                       from '../../../../tests/testIds';
import getDateObjectFromString        from '../../../../util/getDateObjectFromString';
import getRelativeTimeUnit            from '../../../../util/getRelativeTimeUnit';
import AlertReviewComponent           from '../../../components/AlertReviewComponent';
import HeaderRowComponent             from '../../../components/HeaderRowComponent';
import HelpComponent                  from '../../../components/HelpComponent';
import HeaderRowButtonComponent       from '../../../components/HeaderRowButtonComponent';
import ActionsRowComponent            from '../../../components/ActionsRowComponent';
import SearchContainer                from '../../../components/Form/SearchContainer';
import ToggleComponent                from '../../../components/Form/ToggleComponent';
import RowItemComponent               from '../../../components/RowItemComponent';
import ShareActionComponent           from '../../../components/RowItemComponent/ShareActionComponent';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                                     from '../../../components/ButtonComponent';
import SelectRecruiterFromAgencyId    from '../../../components/SelectRecruiterFromAgencyId';
import EditReviewContainer            from '../EditReviewContainer';
import SendReminderContainer          from '../../../components/SendReminderContainer';
import ConnectPlacementContainer      from '../ConnectPlacementContainer';
import SelectReviewTypeContainer      from '../SelectReviewTypeContainer';
import ViewComponent                  from '../ViewComponent';
import { FormattedRelativeTime }      from 'react-intl';
import getMonthYearDateFromDateString from '../../../../util/getMonthYearDateFromDateString';
import {
    ROUTES,
    REVIEWS_TAB,
    REVIEW_QUERY_TYPE, PARAM_PLACEMENT_TYPE,
}                                     from '../../../../constants';
import styles                         from './styles.scss';

const ReviewsComponent = (props) => {
    const {
        verifiedReviewsLength,
        pendingReviewsLength,
        requestedReviewsLength,
        reviews,
        isNoReviews,
        handleToggleReviews,
        tab,
        pathToVerified,
        pathToRequested,
        pathToPending,
        slug,
        retry,
        recruiterId,
        autoSendReviewRequests,
        isLoading,
        reviewTemplateId,
        handleSelectRecruiter,
        selectedRecruiterId,
        agencyRecruiters,
    } = props;

    return (
        <Fragment>
            <AlertReviewComponent slug={ slug } />
            <HeaderRowComponent
                tabs={
                    <Fragment>
                        <HeaderRowButtonComponent
                            url={ pathToVerified }
                            label="Verified"
                            badgeText={ verifiedReviewsLength ? `${ verifiedReviewsLength }` : null }
                            isActive={ tab === REVIEWS_TAB.VERIFIED }
                        />
                        <HeaderRowButtonComponent
                            url={ pathToRequested }
                            label="Requested"
                            badgeText={ requestedReviewsLength ? `${ requestedReviewsLength }` : null }
                            isActive={ tab === REVIEWS_TAB.REQUESTED }
                        />
                        <HeaderRowButtonComponent
                            url={ pathToPending }
                            label="Pending"
                            helpText={ 'Pending reviews are received via your link and need to be verified before they are ' +
                            'displayed on your profile. Connect pending reviews to a placement to verify!' }
                            badgeText={ pendingReviewsLength ? `${ pendingReviewsLength }` : null }
                            isActive={ tab === REVIEWS_TAB.PENDING }
                        />
                    </Fragment>
                }
                search={
                    <SearchContainer
                        label="Find a Review..."
                        name="search"
                        innerSearchStyle
                    />
                }
            />

            <ActionsRowComponent
                className={ styles.actionRow }
                itemActions={
                    <Fragment>
                        <ToggleComponent
                            disabled={ isLoading }
                            name="reminder"
                            onChange={ handleToggleReviews }
                            value={ autoSendReviewRequests }
                            big
                            label={ `Review reminders ${ autoSendReviewRequests ? 'on' : 'off' }` }
                        />
                        <HelpComponent
                            text="Review reminders are sent every 7 days (4 in total) to clients and candidates who haven’t
                            responded to review requests"
                        />
                    </Fragment>
                }
                pageActions={
                    <Fragment>
                        { agencyRecruiters && <SelectRecruiterFromAgencyId
                            agencyRecruiters={ agencyRecruiters }
                            className={ styles.dropDown }
                            selectedRecruiterId={ selectedRecruiterId }
                            handleSelectRecruiter={ handleSelectRecruiter }
                            recruiterId={ recruiterId }
                        /> }
                        <SelectReviewTypeContainer className={ styles.dropDown } />
                        <ButtonComponent
                            to={ ROUTES.PLACEMENTS_NEW }
                            btnType={ BUTTON_TYPE.ACCENT }
                            size={ BUTTON_SIZE.BIG }
                        >
                            Get Reviews
                        </ButtonComponent>
                    </Fragment>
                }
            />

            { isNoReviews &&
            <div className={ styles.card }>
                You currently have no reviews. To get started{ ' ' }
                <ButtonComponent
                    size={ BUTTON_SIZE.SMALL }
                    btnType={ BUTTON_TYPE.LINK_ACCENT }
                    to={ ROUTES.PLACEMENTS_NEW }
                >click here</ButtonComponent>.
            </div> }

            { reviews.map(
                review => {
                    const name = [ review.firstName, review.lastName ].filter(Boolean)
                        .join(' ');
                    const header =
                        `${ name } ${ review.type === ReviewsComponent.REVIEW_TYPE.CANDIDATE ? '(Candidate)' : '(Employer)'
                            }`;
                    const infoText = review.createdAt ?
                        `${ review.name }${ review.recruiterId === recruiterId ? ' (Me) ' : '' } ${
                            getMonthYearDateFromDateString(review.createdAt) }` :
                        `${ review.name }${ review.recruiterId === recruiterId ? ' (Me) ' : '' }`;
                    const id = `${ review.type }_${ review.id }`;
                    const reviewProps = {
                        id: id,
                        header,
                        infoText,
                    };
                    if (tab === REVIEWS_TAB.REQUESTED) {
                        reviewProps.actions = (
                            <Fragment>
                                <EditReviewContainer
                                    review={ review }
                                    isCandidate={ review.type === ReviewsComponent.REVIEW_TYPE.CANDIDATE }
                                />
                                <SendReminderContainer
                                    id={ review.id }
                                    name={ name }
                                    email={ review.email }
                                    isCandidate={ review.type === ReviewsComponent.REVIEW_TYPE.CANDIDATE }
                                />
                            </Fragment>
                        );
                        // TODO use proper method to count value and unit
                        //  https://github.com/formatjs/react-intl/issues/1364
                        // https://github.com/formatjs/react-intl/blob/master/docs/Upgrade-Guide.md#formattedrelativetime

                        const relativeDateParams = review.lastReviewRequest && getRelativeTimeUnit(getDateObjectFromString(
                            review.lastReviewRequest
                        ));

                        reviewProps.statusText =
                            <span>
                                { review.lastReviewRequest ? 'Last sent ' : '' }
                                { review.lastReviewRequest ? (
                                    <FormattedRelativeTime
                                        numeric="auto"
                                        value={ relativeDateParams.value }
                                        unit={ relativeDateParams.unit }
                                    />
                                ) : null }
                                { ' ' }{ review.reviewRequestCount ? ' - ' + review.reviewRequestCount : 'NO' } REMINDERS SENT
                            </span>;
                    } else if (tab === REVIEWS_TAB.PENDING) {
                        reviewProps.header = <ViewComponent
                            review={ review }
                            name={ header }
                        />;
                        reviewProps.rating = review.rating;
                        reviewProps.statusText = review.title;
                        reviewProps.statusTextDataTest = TEST_IDS.REVIEW_TITLE;
                        reviewProps.actions = (
                            <Fragment>
                                <ViewComponent review={ review } />
                                <ConnectPlacementContainer
                                    retry={ retry }
                                    reviewId={ review.reviewId }
                                    isCandidate={ review.type === ReviewsComponent.REVIEW_TYPE.CANDIDATE }
                                />
                            </Fragment>
                        );
                    } else {
                        reviewProps.header = <ViewComponent
                            review={ review }
                            name={ header }
                        />;
                        reviewProps.rating = review.rating;
                        reviewProps.statusText = review.title;
                        reviewProps.statusTextDataTest = TEST_IDS.REVIEW_TITLE;
                        reviewProps.accentText = (
                            <ButtonComponent
                                size={ BUTTON_SIZE.SMALL }
                                btnType={ BUTTON_TYPE.LINK_ACCENT }
                                to={ generatePath(
                                    ROUTES.PLACEMENTS, { [ PARAM_PLACEMENT_TYPE._NAME ]: PARAM_PLACEMENT_TYPE.VISIBLE }
                                ) + `#${ review.id }` }
                            >{ review.jobTitle }</ButtonComponent>
                        );
                        reviewProps.actions = (
                            <Fragment>
                                <ViewComponent review={ review } />
                                <ShareActionComponent
                                    templateId={ reviewTemplateId }
                                    reviewId={ review.reviewId }
                                    slug={ review.recruiter.slug }
                                />
                            </Fragment>
                        );
                    }
                    return (
                        <RowItemComponent
                            smallActions
                            key={ review.id + review.type }
                            { ...reviewProps }
                        />
                    );
                }) }
        </Fragment>
    );
};

ReviewsComponent.REVIEW_TYPE = {
    CANDIDATE: REVIEW_QUERY_TYPE.CANDIDATE,
    EMPLOYER: REVIEW_QUERY_TYPE.EMPLOYER,
};
ReviewsComponent.ACTION_TYPE = {
    SEND_REMINDER: 'sendReminder',
};

ReviewsComponent.propTypes = {
    verifiedReviewsLength: PropTypes.number,
    requestedReviewsLength: PropTypes.number,
    pendingReviewsLength: PropTypes.number,
    pathToVerified: PropTypes.string.isRequired,
    pathToRequested: PropTypes.string.isRequired,
    pathToPending: PropTypes.string.isRequired,
    reviews: PropTypes.array.isRequired,
    isNoReviews: PropTypes.bool,
    handleToggleReviews: PropTypes.func.isRequired,
    // handleSelectReviewsAction: PropTypes.func.isRequired,
    // action: PropTypes.string.isRequired,
    tab: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    // handleSubmit: PropTypes.func.isRequired,
    retry: PropTypes.func.isRequired,
    recruiterId: PropTypes.string.isRequired,
    isLoading: PropTypes.bool,
    autoSendReviewRequests: PropTypes.bool,
    reviewTemplateId: PropTypes.string,
    handleSelectRecruiter: PropTypes.func.isRequired,
    selectedRecruiterId: PropTypes.string,
    agencyRecruiters: PropTypes.array,
};

export default ReviewsComponent;
