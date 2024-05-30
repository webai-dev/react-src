import React, { PureComponent }                         from 'react';
import ErrorComponent                                   from '../../components/ErrorComponent';
import LoaderComponent                                  from '../../components/LoaderComponent';
import PropTypes                                        from 'prop-types';
import { graphql, QueryRenderer }                       from 'react-relay';
import {
    environment,
}                                                       from '../../../api';
import { withRouter }                                   from 'react-router-dom';
import ReviewFormSuccessComponent                       from './ReviewFormSuccessComponent';
import { PARAM_GOOGLE_REVIEW, PARAM_SLUG } from '../../../constants';
import getQueryParams                                   from '../../../util/getQueryParams';

const REVIEW_SUCCESS_QUERY = graphql`
    query ReviewFormSuccessQuery($slug: String!) {
        sluggable(slug: $slug, type: "recruiter") {
            ... on Recruiter {
                firstName
                lastName
                slug
                agency {
                    name
                    googleLocations {
                        locationKey {
                            placeId
                        }
                    }
                }
            }
        }
    }
`;

class ReviewFormSuccess extends PureComponent {
    render() {
        const { match: { params }, location: { search } } = this.props;
        const slug = params[ PARAM_SLUG ];
        const isGoogleReview = params[ PARAM_GOOGLE_REVIEW ] === 'true';

        const { redirected } = getQueryParams(search);

        return (
            <QueryRenderer
                environment={ environment }
                query={ REVIEW_SUCCESS_QUERY }
                variables={ { slug: slug } }
                render={ ({ error, props: data }) => {
                    const isPageLoading = !error && !data;
                    if (error) {
                        return <ErrorComponent error={ error } />;
                    }
                    if (isPageLoading) {
                        return <LoaderComponent row />;
                    }

                    const recruiter = data && data.sluggable;


                    const googleLocations = (data.node || data.sluggable).agency?.googleLocations;
                    const googlePlaceId = (googleLocations || [])[ 0 ]?.locationKey.placeId;
                    const linkToGoogleReview = (isGoogleReview && googlePlaceId) ?
                        `https://search.google.com/local/writereview?placeid=${ googlePlaceId }` :
                        null;

                    return (
                        <ReviewFormSuccessComponent
                            linkToGoogleReview={ linkToGoogleReview }
                            redirected={ redirected }
                            recruiter={ recruiter }
                        />
                    );
                } }
            />
        );
    }
}

ReviewFormSuccess.propTypes = {
    location: PropTypes.object,
    match: PropTypes.object,
};

export default withRouter(ReviewFormSuccess);
