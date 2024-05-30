import React, { PureComponent }                                  from 'react';
import PropTypes                                                 from 'prop-types';
import { withRouter }                                            from 'react-router-dom';
import getQueryParams                                            from '../../../../util/getQueryParams';
import getQueryString                                            from '../../../../util/getQueryString';
import LoaderComponent                                           from '../../../components/LoaderComponent';
import ErrorComponent                                            from '../../../components/ErrorComponent';
import {
    graphql,
    QueryRenderer,
}                                                                from 'react-relay';
import {
    environment,
}                                                                from '../../../../api';
import LeaderBoardComponent, { RATING_TYPE, REVIEWS_TOTAL_TYPE } from './LeaderBoardComponent';

const LEADER_BOARD_QUERY = graphql`
    query LeaderBoardContainerQuery($after: Date) {
        viewer {
            user {
                ...on Recruiter {
                    id
                    slug
                }
            }
            leaderboard(after: $after) {
                rows {
                    recruiter {
                        id
                        slug
                        firstName
                        lastName
                        state
                        agency {
                            name
                        }
                        profilePhoto {
                            url
                        }
                        pendingReviews {
                            overallRating
                        }
                    }
                    rating {
                        overallRating
                        candidateRating
                        responsiveness
                        communication
                        candidateQuality
                        industryKnowledge
                        reviewsCount
                        reviewsEmployerCount
                        reviewsCandidateCount
                    }
                    lastReview
                }
            }
        }
    }
`;

class LeaderBoardContainer extends PureComponent {
    /**
     * Handle location change based on query
     *
     * @param {string} name - query name
     * @param {string} value - query value
     */
    handleSelect = ({ name, value }) => {
        const queryParams = getQueryParams(this.props.location.search);
        queryParams[ name ] = value;
        queryParams.page = 1;
        this.props.history.replace({
            pathname: this.props.location.pathname,
            search: getQueryString(queryParams),
        });
    };

    render() {
        const { handleSelect } = this;
        const { recruiterId, location } = this.props;
        const queryParams = getQueryParams(location.search);
        const {
            reviewsFrom = null,
            reviewsTotal = REVIEWS_TOTAL_TYPE.ANY,
            ratingType = RATING_TYPE.OVERALL_RATING,
            page = 1,
        } = queryParams;
        const perPage = 10;

        return (
            <QueryRenderer
                environment={ environment }
                query={ LEADER_BOARD_QUERY }
                variables={ { after: reviewsFrom || null } }
                render={
                    ({ error, props: data }) => {
                        if (error) {
                            return <ErrorComponent error={ error } />;
                        }
                        if (!data && !error) {
                            return <LoaderComponent row />;
                        }
                        let recruiters = (data && data.viewer.leaderboard.rows) || [];
                        recruiters = recruiters
                            .map(row => ({
                                ...row.recruiter,
                                rating: {
                                    ...row.rating,
                                    employerRating: (
                                        row.rating.responsiveness +
                                        row.rating.communication +
                                        row.rating.candidateQuality +
                                        row.rating.industryKnowledge
                                    ) / 4
                                },
                                lastReview: row.lastReview,
                                pendingReviewsCount: row.recruiter.pendingReviews.length,
                            }))
                            .sort((a, b) => {
                                const ratingFilterResult = a.rating[ ratingType ] > b.rating[ ratingType ] ? -1 :
                                    a.rating[ ratingType ] !== b.rating[ ratingType ] ? 1 : 0;
                                if (reviewsTotal === REVIEWS_TOTAL_TYPE.ANY) {
                                    return ratingFilterResult;
                                }
                                if (reviewsTotal === REVIEWS_TOTAL_TYPE.LEAST) {
                                    return a.rating.reviewsCount < b.rating.reviewsCount ? -1 :
                                        a.rating.reviewsCount !== b.rating.reviewsCount ? 1 : ratingFilterResult;
                                }
                                if (reviewsTotal === REVIEWS_TOTAL_TYPE.MOST) {
                                    return a.rating.reviewsCount > b.rating.reviewsCount ? -1 :
                                        a.rating.reviewsCount !== b.rating.reviewsCount ? 1 : ratingFilterResult;
                                }
                            });

                        const totalPages = Math.ceil(recruiters.length / perPage);
                        recruiters = recruiters.slice(perPage * (page - 1), perPage * page);

                        return (
                            <LeaderBoardComponent
                                reviewsFrom={ reviewsFrom }
                                reviewsTotal={ reviewsTotal }
                                ratingType={ ratingType }
                                handleSelect={ handleSelect }
                                recruiterId={ recruiterId }
                                recruiters={ recruiters }
                                totalPages={ totalPages }
                                indexShift={ (page - 1) * perPage }
                            />
                        );
                    }
                }
            />
        );
    }
}

LeaderBoardContainer.propTypes = {
    recruiterId: PropTypes.string.isRequired,
    location: PropTypes.object,
    history: PropTypes.object,
};

export default withRouter(LeaderBoardContainer);
