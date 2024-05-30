import React, { Component }                                from 'react';
import PropTypes                                           from 'prop-types';
import {
    graphql,
    QueryRenderer,
}                                                          from 'react-relay';
import { Redirect }                                        from 'react-router-dom';
import { withRouter }                                      from 'react-router-dom';
import { toast }                                           from 'react-toastify';
import { environment, Storage }                            from '../../../api';
import {
    inject,
    observer,
}                                                          from 'mobx-react';
import { PARAM_SUBSCRIPTION_SUCCESS, ROUTES, StorageKeys } from '../../../constants';
import getPermissions                                      from '../../../util/getPermissions';
import getQueryParams                                      from '../../../util/getQueryParams';
import ErrorComponent                                      from '../../components/ErrorComponent';
import LoaderComponent                                     from '../../components/LoaderComponent';
import DashboardComponent                                  from './DashboardComponent';

const DASHBOARD_QUERY = graphql`
    query DashboardPageQuery(
        $isEmployer: Boolean!,
        $isRecruiter: Boolean!,
        $isAgencyAdmin: Boolean!,
        $selectedRecruiterId: ID!,
        $isRecruiterSelected: Boolean!,
    ) {
        selectedRecruiter: node(id: $selectedRecruiterId) @include(if: $isRecruiterSelected) {
            ... on Recruiter {
                id
                slug
                rating {
                    overallRating
                    reviewsCount
                    statistics {
                        responsiveness
                        communication
                        candidateQuality
                        industryKnowledge
                        candidateRating
                    }
                    ratings {
                        id
                        title
                        isEmployer: responsiveness
                        createdAt
                        recruiter {
                            id
                            slug
                            firstName
                            lastName
                        }
                        placement {
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
                placements {
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
                npsScore
                npsDetractors
                npsPassives
                npsPromoters
                npsAverages {
                    labels
                    series {
                        overall
                        candidate
                        employer
                        overallCount
                        candidateCount
                        employerCount
                    }
                }
                jobCategoryReviewsOverall: jobCategoryReviews(type: null) {
                    rows {
                        rating {
                            overallRating
                            reviewsCount
                        }
                        jobCategory {
                            name
                        }
                    }
                }
                jobCategoryReviewsEmployer: jobCategoryReviews(type: "employer") {
                    rows {
                        rating {
                            overallRating
                            reviewsEmployerCount
                        }
                        jobCategory {
                            name
                        }
                    }
                }
                jobCategoryReviewsCandidate: jobCategoryReviews(type: "candidate") {
                    rows {
                        rating {
                            overallRating
                            reviewsCandidateCount
                        }
                        jobCategory {
                            name
                        }
                    }
                }
                npsResponses(limit: 3) {
                    id
                    score
                    comment
                    createdAt
                    npsCampaignRecipient {
                        firstName
                        lastName
                    }
                    review {
                        firstName
                        lastName
                    }
                }
            }
        }
        viewer {
            reviewTemplates {
                id
            }
            mpoApproved
            integrationsInfo: user {
                ...on Recruiter {
                    integrations
                    googleReviews {
                        averageRating
                        totalReviewCount
                        reviews {
                            reviewer {
                                displayName
                            }
                            starRating
                            comment
                            createTime
                            updateTime
                        }
                    }
                    agency {
                        integrations
                        googleReviews {
                            averageRating
                            totalReviewCount
                            reviews {
                                reviewer {
                                    displayName
                                }
                                starRating
                                comment
                                createTime
                                updateTime
                            }
                        }
                    }
                }
            }
            recruiter: user @include(if: $isRecruiter) {
                ...on Recruiter {
                    id
                    slug
                    agency @include(if: $isAgencyAdmin) {
                        id
                        slug
                        recruiters {
                            id
                            firstName
                            lastName
                            claimed
                        }

                        rating {
                            overallRating
                            reviewsCount
                            statistics {
                                responsiveness
                                communication
                                candidateQuality
                                industryKnowledge
                                candidateRating
                            }
                            ratings {
                                id
                                title
                                isEmployer: responsiveness
                                createdAt
                                recruiter {
                                    id
                                    slug
                                    firstName
                                    lastName
                                }
                                placement {
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
                        placements {
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
                        npsScore
                        npsDetractors
                        npsPassives
                        npsPromoters
                        npsAverages {
                            labels
                            series {
                                overall
                                candidate
                                employer
                                overallCount
                                candidateCount
                                employerCount
                            }
                        }
                        jobCategoryReviewsOverall: jobCategoryReviews(type: null) {
                            rows {
                                rating {
                                    overallRating
                                    reviewsCount
                                }
                                jobCategory {
                                    name
                                }
                            }
                        }
                        jobCategoryReviewsEmployer: jobCategoryReviews(type: "employer") {
                            rows {
                                rating {
                                    overallRating
                                    reviewsEmployerCount
                                }
                                jobCategory {
                                    name
                                }
                            }
                        }
                        jobCategoryReviewsCandidate: jobCategoryReviews(type: "candidate") {
                            rows {
                                rating {
                                    overallRating
                                    reviewsCandidateCount
                                }
                                jobCategory {
                                    name
                                }
                            }
                        }
                        npsResponses(limit: 3) {
                            id
                            score
                            comment
                            createdAt
                            npsCampaignRecipient {
                                firstName
                                lastName
                            }
                            review {
                                firstName
                                lastName
                            }
                        }
                    }
                    rating {
                        overallRating
                        reviewsCount
                        statistics {
                            responsiveness
                            communication
                            candidateQuality
                            industryKnowledge
                            candidateRating
                        }
                        ratings {
                            id
                            title
                            isEmployer: responsiveness
                            createdAt
                            recruiter {
                                id
                                slug
                                firstName
                                lastName
                            }
                            placement {
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
                    placements {
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
                    npsScore @skip(if: $isAgencyAdmin)
                    npsDetractors @skip(if: $isAgencyAdmin)
                    npsPassives @skip(if: $isAgencyAdmin)
                    npsPromoters @skip(if: $isAgencyAdmin)
                    npsAverages @skip(if: $isAgencyAdmin) {
                        labels
                        series {
                            overall
                            candidate
                            employer
                            overallCount
                            candidateCount
                            employerCount
                        }
                    }
                    jobCategoryReviewsOverall: jobCategoryReviews(type: null) @skip(if: $isAgencyAdmin) {
                        rows {
                            rating {
                                overallRating
                                reviewsCount
                            }
                            jobCategory {
                                name
                            }
                        }
                    }
                    jobCategoryReviewsEmployer: jobCategoryReviews(type: "employer") @skip(if: $isAgencyAdmin) {
                        rows {
                            rating {
                                overallRating
                                reviewsEmployerCount
                            }
                            jobCategory {
                                name
                            }
                        }
                    }
                    jobCategoryReviewsCandidate: jobCategoryReviews(type: "candidate") @skip(if: $isAgencyAdmin) {
                        rows {
                            rating {
                                overallRating
                                reviewsCandidateCount
                            }
                            jobCategory {
                                name
                            }
                        }
                    }
                    npsResponses(limit: 3) {
                        id
                        score
                        comment
                        createdAt
                        npsCampaignRecipient {
                            firstName
                            lastName
                        }
                        review {
                            firstName
                            lastName
                        }
                    }
                }
            }
            activeCount: jobCount(status: Active)
            closedCount: jobCount(status: Closed)
            draftCount: jobCount(status: Draft)
            pendingCount: jobCount(status: Pending)
            userJobs: jobs(status: Active) @include(if: $isEmployer) {
                id
                title
                feePercentage
                salary
                status
                term
                type
                maxRate
                minRate
                rateType
                appliedRecruiters {
                    applications {
                        id
                        status
                        candidate {
                            id
                            firstName
                            lastName
                            email
                        }
                        job {
                            id
                            title
                        }
                    }
                }
            }
            recruiterJobs: recruiterApplications(status: Active) @include(if: $isRecruiter) {
                id
                job {
                    id
                    title
                    feePercentage
                    salary
                    status
                    type
                    term
                    maxRate
                    minRate
                    rateType
                }
                applications {
                    id
                    status
                    job {
                        id
                        title
                        term
                    }
                    candidate {
                        id
                        firstName
                        lastName
                        email
                    }
                }
            }
        }
    }
`;

class DashboardView extends Component {
    state = {
        selectedRecruiterId: null,
    };

    /**
     * If user is recruiter and agency admin there will be dropdown to change recruiter (in order to see recruiter
     * review statistic)
     *
     * @param {string} id - recruiter id from agency
     */
    handleSelectRecruiter = (id) => {
        this.setState({ selectedRecruiterId: id });
    };
    componentDidMount() {
        const queryParams = getQueryParams(this.props.location.search);
        if (queryParams[ PARAM_SUBSCRIPTION_SUCCESS._NAME ] === PARAM_SUBSCRIPTION_SUCCESS.TRUE) {
            toast.success('You’ve successfully subscribed to Sourcr Pro. Your journey to a better online brand begins here!');
        }
    }

    render() {
        const { selectedRecruiterId } = this.state;
        const { handleSelectRecruiter } = this;
        const { store, location: { pathname } } = this.props;
        const isEmployer = store.auth.isUser();
        const isAgencyAdmin = getPermissions(store, [ 'recruiter_admin' ]);
        const isSuperAdmin = getPermissions(store, [ 'super_admin' ]);

        if (isSuperAdmin && !Storage.get(StorageKeys.switchUser)) {
            return <Redirect to={ ROUTES.ADMIN_PANEL } />;
        }
        return (
            <QueryRenderer
                environment={ environment }
                variables={ {
                    isEmployer,
                    isRecruiter: !isEmployer,
                    isAgencyAdmin,
                    selectedRecruiterId: selectedRecruiterId || 'null',
                    isRecruiterSelected: !!selectedRecruiterId,
                } }
                query={ DASHBOARD_QUERY }
                render={ ({ props: data, error }) => {
                    if (error) {
                        return <ErrorComponent error={ error } />;
                    }
                    if (!data && !error) {
                        return <LoaderComponent row />;
                    }

                    let placements = isEmployer ? [] :
                        selectedRecruiterId ?
                            (data && data.selectedRecruiter && data.selectedRecruiter.placements) :
                            isAgencyAdmin ?
                                (data && data.viewer && data.viewer.recruiter && data.viewer.recruiter.agency.placements) :
                                (data && data.viewer && data.viewer.recruiter && data.viewer.recruiter.placements);
                    let ratings = isEmployer ? [] :
                        selectedRecruiterId ?
                            (data && data.selectedRecruiter && data.selectedRecruiter.rating && data.selectedRecruiter.rating.ratings) :
                            isAgencyAdmin ?
                                (data && data.viewer.recruiter.rating && data.viewer.recruiter.agency.rating.ratings) :
                                (data && data.viewer.recruiter.rating && data.viewer.recruiter.rating.ratings);
                    placements = placements || [];
                    let requestedReviews = [];
                    let verifiedReviews = [];
                    (ratings || []).forEach(rating => {
                        if (rating.placement) {
                            verifiedReviews.push({
                                reviewId: rating.id,
                                createdAt: rating.createdAt,
                                jobType: rating.placement.jobType,
                                jobTitle: rating.placement.jobTitle,
                                isCandidate: !rating.isEmployer,
                                firstName: !rating.isEmployer ? rating.placement.candidateFirstName : rating.placement.employerFirstName,
                                lastName: !rating.isEmployer ? rating.placement.candidateLastName : rating.placement.employerLastName,
                                email: !rating.isEmployer ? rating.placement.candidateEmail : rating.placement.employerEmail,
                                title: rating.title,
                                id: rating.placement.id,
                                companyName: rating.placement.companyName,
                                placementDate: rating.placement.placementDate,
                                rating: rating.overallRating,
                                candidate: `${ rating.placement.candidateFirstName } ${ rating.placement.candidateLastName }`,
                                recruiter: rating.recruiter,
                                recruiterId: rating.recruiter.id,
                            });
                        }
                    });
                    placements.forEach(placement => {
                        if (placement.employerEmail && !placement.employerRating) {
                            const employerReview = {
                                reviewId: placement.employerRating && placement.employerRating.ratings[ 0 ].id,
                                createdAt: placement.employerRating && placement.employerRating.ratings[ 0 ].createdAt,
                                jobType: placement.jobType,
                                jobTitle: placement.jobTitle,
                                isCandidate: false,
                                firstName: placement.employerFirstName ||
                                    placement.employerRating && placement.employerRating.ratings[ 0 ].firstName,
                                lastName: placement.employerLastName ||
                                    placement.employerRating && placement.employerRating.ratings[ 0 ].lastName,
                                email: placement.employerEmail,

                                title: placement.employerRating && placement.employerRating.title,

                                id: placement.id,
                                companyName: placement.companyName,
                                placementDate: placement.placementDate,
                                rating: placement.employerRating && placement.employerRating.overallRating,
                                candidate: `${ placement.candidateFirstName } ${ placement.candidateLastName }`,
                                recruiter: placement.recruiter,
                                recruiterId: placement.recruiter.id,
                            };
                            requestedReviews.push(employerReview);
                        }
                        if (placement.candidateEmail && !placement.candidateRating) {
                            const candidateReview = {
                                isCandidate: true,
                                id: placement.id,
                                jobType: placement.jobType,
                                reviewId: placement.candidateRating && placement.candidateRating.ratings[ 0 ].id,
                                createdAt: placement.candidateRating && placement.candidateRating.ratings[ 0 ].createdAt,
                                companyName: placement.companyName,
                                firstName: placement.candidateFirstName ||
                                    placement.candidateRating && placement.candidateRating.ratings[ 0 ].firstName,
                                lastName: placement.candidateLastName ||
                                    placement.candidateRating && placement.candidateRating.ratings[ 0 ].lastName,
                                email: placement.candidateEmail,
                                jobTitle: placement.jobTitle,
                                placementDate: placement.placementDate,
                                rating: placement.candidateRating && placement.candidateRating.overallRating,
                                title: placement.candidateRating && placement.candidateRating.title,
                                employer: `${ placement.employerFirstName } ${ placement.employerLastName }`,
                                recruiter: placement.recruiter,
                                recruiterId: placement.recruiter.id,
                            };
                            requestedReviews.push(candidateReview);
                        }
                    });
                    const reviewTemplateId = data.viewer.reviewTemplates && data.viewer.reviewTemplates[ 0 ]?.id;
                    return (
                        <DashboardComponent
                            reviewTemplateId={ reviewTemplateId }
                            selectedRecruiterId={ selectedRecruiterId }
                            handleSelectRecruiter={ handleSelectRecruiter }
                            verifiedReviews={ verifiedReviews }
                            requestedReviews={ requestedReviews }
                            isEmployer={ isEmployer }
                            isAgencyAdmin={ isAgencyAdmin }
                            viewer={ data.viewer }
                            selectedRecruiter={ data.selectedRecruiter }
                            pathname={ pathname }
                        />
                    );
                } }
            />
        );
    }
}

DashboardView.propTypes = {
    store: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
};

export default withRouter(inject('store')(
    observer(DashboardView),
));
