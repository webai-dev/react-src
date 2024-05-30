import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import {
    withRouter,
}                               from 'react-router-dom';
import getQueryParams           from '../../util/getQueryParams';
import getQueryString           from '../../util/getQueryString';
import {
    graphql,
    createFragmentContainer,
}                               from 'react-relay';

class ReviewsContainer extends PureComponent {
    static TAB_KEY = 'review';
    static TABS = {
        ALL: 'all',
        EMPLOYERS: 'employers',
        CANDIDATES: 'candidates',
    };

    /**
     * Handle location change based on query - will filter reviews all/employer/candidate
     *
     * @param {string} query
     */
    handleGoToQuery = (query) => {
        const queryParams = getQueryParams(this.props.location.search);
        queryParams[ ReviewsContainer.TAB_KEY ] = query;
        this.props.history.replace({
            pathname: this.props.location.pathname,
            search: getQueryString(queryParams),
        });
    };

    render() {
        const { location: { search }, slug, Component, isAgency, profileInfo } = this.props;
        const { handleGoToQuery } = this;
        const { TAB_KEY, TABS } = ReviewsContainer;
        const currentTab = getQueryParams(this.props.location.search)[ TAB_KEY ] || TABS.ALL;

        const reviews = (profileInfo.rating && profileInfo.rating.ratings) || [];

        let verifiedReviews = reviews.map(rating => ({
            id: rating.placement.id,
            reviewId: rating.id,
            name: `${ rating.recruiter.firstName } ${ rating.recruiter.lastName }`,
            companyName: rating.placement.companyName,
            location: rating.placement.location,
            jobTitle: rating.placement.jobTitle,
            salary: rating.placement.salary,
            industry: rating.placement.industry,
            jobType: rating.placement.jobType,
            placementDate: rating.placement.placementDate,
            requestEmployerCompanyNameVisible: rating.placement.requestEmployerCompanyNameVisible,
            isCandidate: !rating.isEmployer,
            firstName: rating.firstName ? rating.firstName :
                rating.isEmployer ? rating.placement.employerFirstName : rating.placement.candidateFirstName,
            lastName: rating.lastName ? rating.lastName :
                rating.isEmployer ? rating.placement.employerLastName : rating.placement.candidateLastName,
            email: rating.isEmployer ? rating.placement.employerEmail : rating.placement.candidateEmail,
            createdAt: rating.createdAt,
            rating: rating.overallRating,
            responsiveness: rating.responsiveness,
            communication: rating.communication,
            candidateQuality: rating.candidateQuality,
            industryKnowledge: rating.industryKnowledge,
            title: rating.title,
            candidate: `${ rating.placement.candidateFirstName } ${ rating.placement.candidateLastName }`,
        }));
        if (currentTab !== TABS.ALL) {
            verifiedReviews = verifiedReviews.filter(review => currentTab === TABS.EMPLOYERS ? !review.isCandidate : review.isCandidate);
        }

        return <Component
            handleGoToQuery={ handleGoToQuery }
            tabs={ TABS }
            tab={ currentTab }
            reviews={ verifiedReviews }
            slug={ slug }
            search={ search }
            isAgency={ isAgency }
        />;
    }
}

ReviewsContainer.propTypes = {
    slug: PropTypes.string.isRequired,
    Component: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
    ]).isRequired,
    isAgency: PropTypes.bool,
    profileInfo: PropTypes.object.isRequired,
    location: PropTypes.object,
    history: PropTypes.object,
    match: PropTypes.object,
};

export const ReviewsRecruiterContainer = withRouter(createFragmentContainer(
    ReviewsContainer,
    graphql`
        fragment ReviewsContainerRecruiter_profileInfo on Recruiter {
            rating {
                ratings {
                    id
                    title
                    firstName
                    lastName
                    isEmployer: responsiveness
                    createdAt
                    recruiter {
                        slug
                        firstName
                        lastName
                    }
                    placement {
                        id
                        jobTitle
                        jobType
                        location
                        salary
                        industry {
                            id
                            name
                        }
                        placementDate
                        employerEmail
                        employerFirstName
                        employerLastName
                        candidateEmail
                        candidateFirstName
                        candidateLastName
                        companyName(public: true)
                        requestEmployerCompanyNameVisible
                    }
                    overallRating
                    responsiveness
                    communication
                    candidateQuality
                    industryKnowledge
                }
            }
        }
    `,
));

export const ReviewsAgencyContainer = withRouter(createFragmentContainer(
    ReviewsContainer,
    graphql`
        fragment ReviewsContainerAgency_profileInfo on Agency {
            id
            name
            rating {
                ratings {
                    id
                    title
                    firstName
                    lastName
                    isEmployer: responsiveness
                    createdAt
                    recruiter {
                        slug
                        firstName
                        lastName
                    }
                    placement {
                        id
                        jobTitle
                        jobType
                        location
                        salary
                        industry {
                            id
                            name
                        }
                        placementDate
                        employerEmail
                        employerFirstName
                        employerLastName
                        candidateEmail
                        candidateFirstName
                        candidateLastName
                        companyName(public: true)
                        requestEmployerCompanyNameVisible
                    }
                    overallRating
                    responsiveness
                    communication
                    candidateQuality
                    industryKnowledge
                }
            }
        }
    `,
));
