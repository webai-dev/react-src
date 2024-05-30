import React, { PureComponent }             from 'react';
import { toast }                            from 'react-toastify';
import getErrorMessage                      from '../../../util/getErrorMessage';
import ErrorComponent                       from '../../components/ErrorComponent';
import LoaderComponent                      from '../../components/LoaderComponent';
import PropTypes                            from 'prop-types';
import { graphql, QueryRenderer }           from 'react-relay';
import gtmPush, { GTM_EVENTS, GTM_ACTIONS } from '../../../util/gtmPush';
import {
    commitMutation,
    environment,
}                                           from '../../../api';
import { withRouter, generatePath }         from 'react-router-dom';
import ReviewFormCreateComponent            from './ReviewFormCreateComponent';
import {
    ROUTES,
    PARAM_PLACEMENT_ID,
    PARAM_HASH,
    PARAM_SLUG, PARAM_GOOGLE_REVIEW
}                                           from '../../../constants';

const REVIEW_EMPLOYER_QUERY = graphql`
    query ReviewFormCreateEmployerQuery($id: ID!) {
        node(id: $id) {
            ... on Placement {
                id
                jobTitle
                employerFirstName
                employerLastName
                candidateFirstName
                candidateLastName
                city
                state
                salary
                category {
                    name
                }
                industry {
                    name
                }
                jobType
                recruiter {
                    firstName
                    lastName
                    slug
                }
                employerRating {
                    title
                }
            }
        }
    }
`;
const REVIEW_CANDIDATE_QUERY = graphql`
    query ReviewFormCreateCandidateQuery($id: ID!) {
        node(id: $id) {
            ... on Placement {
                id
                jobTitle
                employerFirstName
                employerLastName
                candidateFirstName
                candidateLastName
                city
                state
                salary
                category {
                    name
                }
                industry {
                    name
                }
                jobType
                recruiter {
                    firstName
                    lastName
                    slug
                }
                candidateRating {
                    title
                }
            }
        }
    }
`;
const REVIEW_PENDING_QUERY = graphql`
    query ReviewFormCreatePreQuery($slug: String!) {
        sluggable(slug: $slug, type: "recruiter") {
            ... on Recruiter {
                slug
                firstName
                lastName
            }
        }
    }
`;

const RATE_RECRUITER = graphql`
    mutation ReviewFormCreateMutation(
        $input: RecruiterRatingInput!,
        $placementId: String,
        $hash: String,
        $reviewType: String!,
        $recruiter: String
    ) {
        mutator {
            rateRecruiter(input: $input, placementId: $placementId, hash: $hash, reviewType: $reviewType, recruiter: $recruiter) {
                success
                errors {
                    key
                    value
                }
            }
        }
    }
`;

class ReviewFormCreateView extends PureComponent {
    state = {
        isLoading: false,
        errorMessage: null,
    };

    /**
     * Commit rate recruiter mutation
     *
     * @param {string} [hash]
     * @param {string} [placementId]
     * @param {string} reviewType - 'Candidate' or 'Employer'
     * @param {string} [recruiter] - recruiter slug
     * @param {Object} input
     */
    commitReviewRecruiter = ({ hash, placementId, reviewType, recruiter, ...input }) => {
        return commitMutation(
            environment,
            {
                mutation: RATE_RECRUITER,
                variables: {
                    hash,
                    placementId,
                    reviewType,
                    recruiter,
                    input,
                },
            },
        );
    };

    /**
     * Handle recruiter/agency profile rate and corresponding app logic
     *
     * @param {Object} input
     * @param {string} slug
     */
    handleSubmit = ({ slug, ...input }) => {
        this.setState({
            isLoading: true,
            errorMessage: null,
        });
        const recruiter = this.props.match.params[ PARAM_SLUG ];
        this.commitReviewRecruiter(recruiter ? { recruiter, ...input } : input)
            .then(() => {
                this.setState({ isLoading: false });

                const { match: { params } } = this.props;
                const placementId = params[ PARAM_PLACEMENT_ID ];

                gtmPush({
                    event: GTM_EVENTS.POST_REVIEW,
                    action: !input.responsiveness ? GTM_ACTIONS.POST_REVIEW_CANDIDATE : GTM_ACTIONS.POST_REVIEW_EMPLOYER,
                    label: recruiter ? '' : placementId,
                });

                const rating = input.candidateRating ? input.candidateRating : (
                    input.candidateRating + input.communication + input.industryKnowledge + input.responsiveness) / 4;

                if (rating >= 4) {
                    const reviewText = document.getElementById(ReviewFormCreateComponent.IDS.REVIEW);
                    reviewText.focus();
                    reviewText.select();
                    document.execCommand('copy');
                    reviewText.blur();
                    toast.success('Your review was copied to clipboard');
                }

                this.props.history.push(
                    generatePath(
                        ROUTES.REVIEW_SUCCESS,
                        {
                            [ PARAM_SLUG ]: slug,
                            [ PARAM_GOOGLE_REVIEW ]: !!(rating >= 4)
                        },
                    )
                );
            })
            .catch((error) => {
                const errorParsed = getErrorMessage(error);
                toast.error(errorParsed.title);
                this.setState({
                    isLoading: false,
                    errorMessage: errorParsed.message,
                });
            });
    };

    render() {
        const { handleSubmit } = this;
        const { isLoading, errorMessage } = this.state;
        const { match: { path, params } } = this.props;
        const placementId = params[ PARAM_PLACEMENT_ID ];
        const hash = params[ PARAM_HASH ];
        const slug = params[ PARAM_SLUG ];

        const isCandidate = path === ROUTES.CANDIDATE_REVIEW;
        const reviewType = path === ROUTES.CANDIDATE_REVIEW ?
            ReviewFormCreateComponent.REVIEW_TYPE.CANDIDATE : path === ROUTES.EMPLOYER_REVIEW ?
                ReviewFormCreateComponent.REVIEW_TYPE.EMPLOYER : null;

        return (
            <QueryRenderer
                environment={ environment }
                query={
                    slug ? REVIEW_PENDING_QUERY : isCandidate ? REVIEW_CANDIDATE_QUERY : REVIEW_EMPLOYER_QUERY
                }
                variables={ slug ? { slug } : { id: placementId } }
                render={ ({ error, props: data }) => {
                    const isPageLoading = !error && !data;
                    if (error) {
                        return <ErrorComponent error={ error } />;
                    }
                    if (isPageLoading) {
                        return <LoaderComponent row />;
                    }
                    let placement = data && data.node;
                    let recruiter = data && data.sluggable;

                    let reviewToShow = recruiter ? {
                        name: `${
                        recruiter && recruiter.firstName } ${
                        recruiter && recruiter.lastName }`
                    } : placement && {
                        id: placement.id,
                        name: `${
                        placement.recruiter && placement.recruiter.firstName } ${
                        placement.recruiter && placement.recruiter.lastName }`,
                        city: placement.city,
                        state: placement.state,
                        jobTitle: placement.jobTitle,
                        salary: placement.salary,
                        industry: placement.industry && placement.industry.name,
                        jobType: placement.jobType,
                        placementDate: placement.placementDate,
                        category: placement.category && placement.category.name,
                    };
                    if (!slug && isCandidate && placement) {
                        reviewToShow = {
                            ...reviewToShow,
                            firstName: placement.candidateFirstName,
                            lastName: placement.candidateLastName,
                            employer: `${ placement.employerFirstName } ${ placement.employerLastName }`,
                            isAlreadyPosted: !!placement.candidateRating,
                        };
                    }
                    if (!slug && !isCandidate && placement) {
                        reviewToShow = {
                            ...reviewToShow,
                            firstName: placement.employerFirstName,
                            lastName: placement.employerLastName,
                            candidate: `${ placement.candidateFirstName } ${ placement.candidateLastName }`,
                            isAlreadyPosted: !!placement.employerRating,
                        };
                    }

                    return (
                        <ReviewFormCreateComponent
                            isPending={ !!recruiter }
                            reviewType={ reviewType }
                            isCandidate={ isCandidate }
                            reviewToShow={ reviewToShow }
                            handleSubmit={ handleSubmit }
                            isLoading={ isLoading }
                            hash={ hash }
                            slug={ slug || (placement && placement.recruiter.slug) }
                            errorMessage={ errorMessage }
                        />
                    );
                } }
            />
        );
    }
}

ReviewFormCreateView.propTypes = {
    location: PropTypes.object,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(ReviewFormCreateView);
