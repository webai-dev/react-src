import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { generatePath }     from 'react-router-dom';
import getErrorMessage      from '../../../util/getErrorMessage';
import ReviewsComponent     from './ReviewsComponent';
import {
    graphql,
    QueryRenderer,
}                           from 'react-relay';
import {
    commitMutation,
    environment,
}                           from '../../../api';
import getQueryParams       from '../../../util/getQueryParams';
import getQueryString       from '../../../util/getQueryString';
import ErrorComponent       from '../../components/ErrorComponent';
import LoaderComponent      from '../../components/LoaderComponent';
import { toast }            from 'react-toastify';
import {
    inject,
    observer,
}                           from 'mobx-react';
import getPermissions       from '../../../util/getPermissions';
import {
    ROUTES,
    REVIEWS_TAB,
    REVIEW_QUERY_TYPE,
}                           from '../../../constants';

const mutationSendReminders = graphql`
    mutation ReviewsRemindersMutation($name: AvailableFlag!) {
        mutator {
            toggleFlag(name: $name) {
                user {
                    ...on Recruiter {
                        autoSendReviewRequests
                    }
                }
                errors {
                    key
                    value
                }
            }
        }
    }
`;

const REVIEWS_QUERY = graphql`
    query ReviewsQuery {
        viewer {
            reviewTemplates {
                id
            }
            pendingReviews {
                title
                responsiveness
                communication
                candidateQuality
                industryKnowledge
                overallRating
                reviews {
                    postedBy
                    review
                }
                reviewsCount
                ratings {
                    createdAt
                    id
                    firstName
                    lastName
                    recruiter {
                        firstName
                        lastName
                    }
                }
            }
            user {
                ...on Recruiter {
                    id
                    slug
                    autoSendReviewRequests
                    agency {
                        name
                    }
                    rating {
                        ratings {
                            id
                            title
                            isEmployer: responsiveness
                            createdAt
                            firstName
                            lastName
                            recruiter {
                                id
                                slug
                                firstName
                                lastName
                            }
                            placement {
                                id
                                lastCandidateReviewRequest
                                lastEmployerReviewRequest
                                candidateReminderCount
                                employerReminderCount
                                jobTitle
                                jobType
                                placementDate
                                employerEmail
                                employerFirstName
                                employerLastName
                                candidateEmail
                                candidateFirstName
                                candidateLastName
                                companyName
                            }
                            overallRating
                        }
                    }
                }
            }
            placements(type: "all") {
                id
                jobTitle
                jobType
                placementDate
                employerFirstName
                employerLastName
                employerEmail
                candidateFirstName
                candidateLastName
                candidateEmail
                companyName
                lastCandidateReviewRequest
                lastEmployerReviewRequest
                candidateReminderCount
                employerReminderCount
                recruiter {
                    id
                    slug
                    firstName
                    lastName
                    agency {
                        name
                    }
                }
                employerRating {
                    ratings {
                        createdAt
                        id
                        firstName
                        lastName
                    }
                    title
                    overallRating
                }
                candidateRating {
                    ratings {
                        createdAt
                        id
                        firstName
                        lastName
                    }
                    title
                    overallRating
                }
            }
        }
    }
`;

const REVIEWS_ADMIN_QUERY = graphql`
    query ReviewsViewAdminQuery {
        viewer {
            reviewTemplates {
                id
            }
            pendingReviews {
                title
                responsiveness
                communication
                candidateQuality
                industryKnowledge
                overallRating
                reviews {
                    postedBy
                    review
                }
                reviewsCount
                ratings {
                    createdAt
                    id
                    firstName
                    lastName
                    recruiter {
                        id
                        firstName
                        lastName
                    }
                }
            }
            user {
                ...on Recruiter {
                    id
                    slug
                    autoSendReviewRequests
                    agency {
                        recruiters {
                            id
                            firstName
                            lastName
                            claimed
                        }
                        integrations
                        rating {
                            ratings {
                                id
                                title
                                isEmployer: responsiveness
                                createdAt
                                firstName
                                lastName
                                recruiter {
                                    id
                                    slug
                                    firstName
                                    lastName
                                }
                                placement {
                                    lastCandidateReviewRequest
                                    lastEmployerReviewRequest
                                    sentEmployerRequest
                                    sentCandidateRequest
                                    candidateReminderCount
                                    employerReminderCount
                                    id
                                    jobTitle
                                    jobType
                                    placementDate
                                    employerEmail
                                    employerFirstName
                                    employerLastName
                                    candidateEmail
                                    candidateFirstName
                                    candidateLastName
                                    companyName
                                }
                                overallRating
                            }
                        }
                    }
                }
            }
            placements(type: "all") {
                id
                jobTitle
                jobType
                placementDate
                employerFirstName
                employerLastName
                employerEmail
                candidateFirstName
                candidateLastName
                candidateEmail
                companyName
                lastCandidateReviewRequest
                lastEmployerReviewRequest
                sentEmployerRequest
                sentCandidateRequest
                candidateReminderCount
                employerReminderCount
                recruiter {
                    id
                    slug
                    firstName
                    lastName
                    agency {
                        name
                    }
                }
                employerRating {
                    ratings {
                        createdAt
                        id
                        firstName
                        lastName
                    }
                    title
                    overallRating
                }
                candidateRating {
                    ratings {
                        createdAt
                        id
                        firstName
                        lastName
                    }
                    title
                    overallRating
                }
            }
        }
    }
`;

class ReviewsContainer extends Component {
    state = {
        action: ReviewsComponent.ACTION_TYPE.SEND_REMINDER,
        isLoading: false,
        errors: null,
        selectedRecruiterId: null
    };

    /**
     * If user is recruiter and agency admin there will be dropdown to change recruiter (in order to see recruiter
     * reviews)
     *
     * @param {string} id - recruiter id from agency
     */
    handleSelectRecruiter = (id) => {
        this.setState({ selectedRecruiterId: id });
    };

    /**
     * Commit toggle reviews reminders mutation
     */
    commitToggleReviewsReminders = () => {
        const variables = {
            name: 'autoSendReviewRequests'
        };

        return commitMutation(
            environment,
            {
                mutation: mutationSendReminders,
                variables,
            },
        );
    };

    /**
     * Handle toggle send reminders for all reviews
     */
    handleToggleReviews = () => {
        this.setState({
            isLoading: true,
            errors: null,
        });
        this.commitToggleReviewsReminders()
            .then((data) => {
                const autoSendReviewRequests = data.mutator.toggleFlag.user.autoSendReviewRequests;
                this.setState({ isLoading: false });
                toast.success(`Automatic review reminders have now been switched ${
                    autoSendReviewRequests ? 'on' : 'off' }`);
            })
            .catch((error) => {
                const errorParsed = getErrorMessage(error);
                toast.error(errorParsed.title);
                this.setState({
                    isLoading: false,
                    errors: errorParsed.message,
                });
            });
    };

    render() {
        const { handleToggleReviews, handleSelectRecruiter } = this;
        const { isLoading, selectedRecruiterId } = this.state;
        const { location, match: { params }, store } = this.props;
        const tab = params[ REVIEWS_TAB._NAME ];

        const queryParams = getQueryParams(location.search);
        const { search } = queryParams;
        const type = queryParams[ REVIEW_QUERY_TYPE._NAME ];
        const isAgencyAdmin = getPermissions(store, [ 'recruiter_admin' ]);
        return (
            <QueryRenderer
                environment={ environment }
                query={ isAgencyAdmin ? REVIEWS_ADMIN_QUERY : REVIEWS_QUERY }
                render={ ({ error, props: data, retry }) => {
                    const loading = !error && !data;

                    if (error) {
                        return <ErrorComponent error={ error } />;
                    }
                    if (loading) {
                        return <LoaderComponent row />;
                    }
                    // TODO we are using type: ReviewsComponent.REVIEW_TYPE.EMPLOYER,
                    // it is better to use isCandidate flag instead
                    let placements = data && data.viewer && data.viewer.placements;
                    const autoSendReviewRequests = data && data.viewer && data.viewer.user && data.viewer.user.autoSendReviewRequests;
                    placements = placements || [];
                    let pendingReviews = data && data.viewer.pendingReviews.map(
                        review => ({
                                id: review.ratings[ 0 ].id,
                                reviewId: review.ratings[ 0 ].id,
                                createdAt: review.ratings[ 0 ].createdAt,
                                firstName: review.ratings[ 0 ].firstName,
                                lastName: review.ratings[ 0 ].lastName,
                                type: review.candidateQuality ?
                                    ReviewsComponent.REVIEW_TYPE.EMPLOYER :
                                    ReviewsComponent.REVIEW_TYPE.CANDIDATE,
                                title: review.title,
                                rating: review.overallRating,
                                isCandidate: !review.candidateQuality,
                                recruiterId: review.ratings[ 0 ].recruiter.id,
                                name: `${ review.ratings[ 0 ].recruiter.firstName } ${ review.ratings[ 0 ].recruiter.lastName }`,
                            }
                        ));

                    let requestedReviews = [];
                    placements.forEach(placement => {
                        if (placement.sentEmployerRequest && !placement.employerRating) {
                            const employerReview = {
                                isCandidate: false,
                                lastReviewRequest: placement.lastEmployerReviewRequest,
                                reviewRequestCount: placement.employerReminderCount,
                                id: placement.id,
                                reviewId: placement.employerRating && placement.employerRating.ratings[ 0 ].id,
                                type: ReviewsComponent.REVIEW_TYPE.EMPLOYER,
                                companyName: placement.companyName,
                                firstName: (placement.employerRating && placement.employerRating.ratings[ 0 ].firstName) ||
                                    placement.employerFirstName,
                                lastName: (placement.employerRating && placement.employerRating.ratings[ 0 ].lastName) ||
                                    placement.employerLastName,
                                email: placement.employerEmail,
                                jobTitle: placement.jobTitle,
                                placementDate: placement.placementDate,
                                rating: placement.employerRating && placement.employerRating.overallRating,
                                title: placement.employerRating && placement.employerRating.title,
                                candidate: `${ placement.candidateFirstName } ${ placement.candidateLastName }`,
                                recruiter: placement.recruiter,
                                recruiterId: placement.recruiter.id,
                                name: `${ placement.recruiter.firstName } ${ placement.recruiter.lastName }`,
                                createdAt: placement.employerRating && placement.employerRating.ratings[ 0 ].createdAt,
                            };
                            requestedReviews.push(employerReview);
                        }
                        if (placement.sentCandidateRequest && !placement.candidateRating) {
                            const candidateReview = {
                                isCandidate: true,
                                lastReviewRequest: placement.lastCandidateReviewRequest,
                                reviewRequestCount: placement.candidateReminderCount,
                                id: placement.id,
                                reviewId: placement.candidateRating && placement.candidateRating.ratings[ 0 ].id,
                                type: ReviewsComponent.REVIEW_TYPE.CANDIDATE,
                                companyName: placement.companyName,
                                firstName: (placement.candidateRating && placement.candidateRating.ratings[ 0 ].firstName) ||
                                    placement.candidateFirstName,
                                lastName: (placement.candidateRating && placement.candidateRating.ratings[ 0 ].lastName) ||
                                    placement.candidateLastName,
                                email: placement.candidateEmail,
                                jobTitle: placement.jobTitle,
                                placementDate: placement.placementDate,
                                rating: placement.candidateRating && placement.candidateRating.overallRating,
                                title: placement.candidateRating && placement.candidateRating.title,
                                employer: `${ placement.employerFirstName } ${ placement.employerLastName }`,
                                recruiter: placement.recruiter,
                                recruiterId: placement.recruiter.id,
                                name: `${ placement.recruiter.firstName } ${ placement.recruiter.lastName }`,
                                createdAt: placement.candidateRating && placement.candidateRating.ratings[ 0 ].createdAt,
                            };
                            requestedReviews.push(candidateReview);
                        }
                    });

                    let verifiedReviews = [];
                    const ratings = isAgencyAdmin ?
                        data?.viewer.user.agency?.rating?.ratings :
                        data?.viewer.user.rating?.ratings;
                    ratings.forEach(rating => {
                        const review = {
                            isCandidate: !rating.isEmployer,
                            id: rating.placement.id,
                            reviewId: rating.id,
                            type: !rating.isEmployer ? ReviewsComponent.REVIEW_TYPE.CANDIDATE : ReviewsComponent.REVIEW_TYPE.EMPLOYER,
                            companyName: rating.placement.companyName,
                            firstName: rating.firstName ? rating.firstName : !rating.isEmployer ?
                                rating.placement.candidateFirstName : rating.placement.employerFirstName,
                            lastName: rating.lastName ? rating.lastName : !rating.isEmployer ?
                                rating.placement.candidateLastName : rating.placement.employerLastName,
                            email: !rating.isEmployer ? rating.placement.candidateEmail : rating.placement.employerEmail,
                            jobTitle: rating.placement.jobTitle,
                            placementDate: rating.placement.placementDate,
                            rating: rating.overallRating,
                            title: rating.title,
                            candidate: `${ rating.placement.candidateFirstName } ${ rating.placement.candidateLastName }`,
                            recruiter: rating.recruiter,
                            recruiterId: rating.recruiter.id,
                            name: `${ rating.recruiter.firstName } ${ rating.recruiter.lastName }`,
                            createdAt: rating.createdAt,
                        };
                        verifiedReviews.push(review);
                    });

                    // filter reviews by search query if query exist
                    if (search) {
                        const filterFunction = review =>
                            `${ review.firstName || '' } ${ review.lastName || '' } ${
                            review.email || '' }  ${ review.jobTitle || '' }`
                                .toUpperCase()
                                .includes(search.toUpperCase());

                        requestedReviews = requestedReviews.filter(filterFunction);
                        verifiedReviews = verifiedReviews.filter(filterFunction);
                        pendingReviews = pendingReviews.filter(filterFunction);
                    }
                    if (type && type !== REVIEW_QUERY_TYPE.ALL) {
                        const filterFunction = review => review.type === type;
                        requestedReviews = requestedReviews.filter(filterFunction);
                        verifiedReviews = verifiedReviews.filter(filterFunction);
                        pendingReviews = pendingReviews.filter(filterFunction);
                    }
                    if (selectedRecruiterId) {
                        const filterFunction = review => review.recruiterId === selectedRecruiterId;
                        requestedReviews = requestedReviews.filter(filterFunction);
                        verifiedReviews = verifiedReviews.filter(filterFunction);
                        pendingReviews = pendingReviews.filter(filterFunction);
                    }

                    const pathToVerified =
                        generatePath(
                            ROUTES.REVIEWS,
                            { [ REVIEWS_TAB._NAME ]: REVIEWS_TAB.VERIFIED },
                        ) +
                        getQueryString(queryParams);
                    const pathToRequested =
                        generatePath(
                            ROUTES.REVIEWS,
                            { [ REVIEWS_TAB._NAME ]: REVIEWS_TAB.REQUESTED },
                        ) +
                        getQueryString(queryParams);
                    const pathToPending =
                        generatePath(
                            ROUTES.REVIEWS,
                            { [ REVIEWS_TAB._NAME ]: REVIEWS_TAB.PENDING },
                        ) +
                        getQueryString(queryParams);
                    const reviewTemplateId = data.viewer.reviewTemplates && data.viewer.reviewTemplates[ 0 ]?.id;

                    return (
                        <ReviewsComponent
                            isNoReviews={ placements.length === 0 && data.viewer.pendingReviews.length === 0 }
                            requestedReviewsLength={ requestedReviews.length }
                            verifiedReviewsLength={ verifiedReviews.length }
                            pendingReviewsLength={ pendingReviews.length }
                            reviews={
                                tab === REVIEWS_TAB.REQUESTED ? requestedReviews :
                                    tab === REVIEWS_TAB.VERIFIED ? verifiedReviews :
                                        pendingReviews
                            }
                            tab={ tab }
                            slug={ data && data.viewer && data.viewer.user && data.viewer.user.slug }
                            recruiterId={ data && data.viewer && data.viewer.user && data.viewer.user.id }
                            pathToVerified={ pathToVerified }
                            pathToRequested={ pathToRequested }
                            pathToPending={ pathToPending }
                            handleToggleReviews={ handleToggleReviews }
                            autoSendReviewRequests={ autoSendReviewRequests }
                            isLoading={ isLoading }
                            retry={ retry }
                            reviewTemplateId={ reviewTemplateId }
                            handleSelectRecruiter={ handleSelectRecruiter }
                            selectedRecruiterId={ selectedRecruiterId }
                            agencyRecruiters={ isAgencyAdmin ? data.viewer.user?.agency?.recruiters : null }
                        />
                    );
                } }
            />
        );
    }
}

ReviewsContainer.propTypes = {
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
};

export default inject('store')(
    observer(ReviewsContainer),
);
