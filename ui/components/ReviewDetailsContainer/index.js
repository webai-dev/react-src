import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import ReviewDetailsComponent   from './ReviewDetailsComponent';
import {
    graphql,
    QueryRenderer,
}                               from 'react-relay';
import {
    environment,
}                               from '../../../api';

const REVIEW_QUERY = graphql`
    query ReviewDetailsContainerEmployerQuery($id: ID!, $public: Boolean) {
        node(id: $id) {
            ... on Rating {
                createdAt
                id
                firstName
                lastName
                responsiveness
                communication
                candidateQuality
                industryKnowledge
                review
                title
                overallRating
                recruiter {
                    slug
                    firstName
                    lastName
                }
                placement {
                    id
                    jobTitle
                    employerFirstName
                    employerLastName
                    candidateFirstName
                    candidateLastName
                    companyName(public: $public)
                    city
                    state
                    salaryRange
                    industry {
                        name
                    }
                    jobType
                    recruiter {
                        firstName
                        lastName
                    }
                }
            }
        }
    }
`;

class ReviewDetailsContainer extends PureComponent {
    render() {
        const { handleCloseModal, isInnerApp, reviewId, recruiterRoute } = this.props;

        return (
            <QueryRenderer
                environment={ environment }
                query={ REVIEW_QUERY }
                variables={ { id: reviewId, public: !isInnerApp } }
                render={
                    ({ error, props: data }) => {
                        const isLoading = !data && !error;
                        let review = data && data.node;
                        const isCandidate = data && !review.responsiveness;

                        const reviewToShow = review && {
                            isCandidate: isCandidate,
                            id: review.id,
                            createdAt: review.createdAt,
                            recruiterSlug: review.recruiter.slug,
                            name: `${
                            review.recruiter && review.recruiter.firstName } ${
                            review.recruiter && review.recruiter.lastName }`,

                            placement: review.placement && {
                                companyName: review.placement.companyName,
                                city: review.placement.city,
                                state: review.placement.state,
                                jobTitle: review.placement.jobTitle,
                                salaryRange: review.placement.salaryRange,
                                industry: review.placement.industry,
                                jobType: review.placement.jobType,
                            },

                            text: review.review,
                            rating: review.overallRating,
                            responsiveness: review.responsiveness,
                            communication: review.communication,
                            candidateQuality: review.candidateQuality,
                            industryKnowledge: review.industryKnowledge,
                            title: review.title,

                            firstName: review.firstName || (isCandidate ?
                                review.placement.candidateFirstName : review.placement.employerFirstName),
                            lastName: review.lastName || (review.placement && (isCandidate ?
                                review.placement.candidateLastName : review.placement.employerLastName)),
                        };
                        return (
                            <ReviewDetailsComponent
                                isInnerApp={ isInnerApp }
                                handleClose={ handleCloseModal }
                                recruiterRoute={ recruiterRoute }
                                review={ reviewToShow }
                                isLoading={ isLoading }
                            />
                        );
                    }
                }
            />
        );
    }
}

ReviewDetailsContainer.propTypes = {
    isInnerApp: PropTypes.bool,
    reviewId: PropTypes.string.isRequired,
    handleCloseModal: PropTypes.func, //handleCloseModal or recruiterRoute required
    recruiterRoute: PropTypes.string, //handleCloseModal or recruiterRoute required
};

export default ReviewDetailsContainer;
