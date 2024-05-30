import React                                from 'react';
import ErrorComponent                       from '../../components/ErrorComponent';
import PropTypes                            from 'prop-types';
import { graphql, QueryRenderer }           from 'react-relay';
import { environment }                      from '../../../api';
import { withRouter }                       from 'react-router-dom';
import getQueryParams                       from '../../../util/getQueryParams';
import SearchResultComponent                from './SearchResultComponent';
import gtmPush, { GTM_EVENTS, GTM_ACTIONS } from '../../../util/gtmPush';
import {
    SEARCH_ROLE_TYPES,
    SEARCH_LOCATION_TYPES,
    SEARCH_SPECIALIZATIONS_TYPES,
    SEARCH_CATEGORY_TYPES,
}                                           from '../../../constants';

const SEARCH_QUERY = graphql`
    query SearchResultContainerQuery($input: SearchRequestInput) {
        viewer {
            search(input: $input) {
                totalHits
                filters {
                    name
                    values {
                        value
                        count
                    }
                }
                results {
                    result {
                        __typename
                        ... on Agency {
                            id
                            slug
                            city
                            state
                            name
                            photo {
                                url
                            }
                            rating {
                                overallRating
                                reviewsCount
                            }
                        }
                        ... on Recruiter {
                            id
                            slug
                            city
                            state
                            firstName
                            lastName
                            profilePhoto {
                                url
                            }
                            rating {
                                overallRating
                                reviewsCount
                            }
                            agency {
                                slug
                                name
                            }
                        }
                    }
                }
                promotedReviews {
                    recruiter {
                        slug
                        firstName
                        lastName
                        suburb
                        jobTitle
                        profilePhoto {
                            url
                        }
                    }
                    title
                    overallRating
                    createdAt
                }
            }
        }
    }
`;

const SearchResultContainer = props => {
    const queryParams = getQueryParams(props.location.search);
    const currentPage = queryParams.page || 1;

    return (
        <QueryRenderer
            environment={ environment }
            query={ SEARCH_QUERY }
            variables={ {
                input: {
                    page: currentPage,
                    query: queryParams.search || '',
                    filters: [
                        {
                            name: SEARCH_CATEGORY_TYPES.name,
                            values: queryParams[ SEARCH_CATEGORY_TYPES.name ] || SEARCH_CATEGORY_TYPES.values[ 0 ]
                        },
                        {
                            name: SEARCH_ROLE_TYPES.name,
                            values: (queryParams[ SEARCH_ROLE_TYPES.name ] || [])
                                .map(type => type.replace(/ and /g, ' & '))
                        },
                        {
                            name: SEARCH_LOCATION_TYPES.name,
                            values: (queryParams[ SEARCH_LOCATION_TYPES.name ] || [])
                                .map(location => location.replace(/ and /g, ' & '))
                        },
                        {
                            name: SEARCH_SPECIALIZATIONS_TYPES.name,
                            values: (queryParams[ SEARCH_SPECIALIZATIONS_TYPES.name ] || [])
                                .map(specialization => specialization.replace(/ and /g, ' & '))
                        }
                    ]
                }
            } }
            render={ ({ error, props: data }) => {
                const loading = !error && !data;

                if (error) {
                    return <ErrorComponent error={ error } />;
                }

                const search = (loading ? null : data.viewer.search) || {
                    results: [],
                    totalHits: 0
                };
                const searchResults = loading ? [] : search.results;
                const totalHits = search.totalHits;
                const perPage = 100;
                const totalPages = Math.ceil(totalHits / perPage);
                if (!loading) {
                    gtmPush({
                        event: GTM_EVENTS.SEARCH_RESULTS,
                        action: GTM_ACTIONS.SEARCH,
                        label: totalHits,
                    });
                }

                return (
                    <SearchResultComponent
                        searchResults={ searchResults }
                        loading={ loading }
                        totalHits={ totalHits }
                        totalPages={ totalPages }
                        promotedReviews={ data?.viewer.search?.promotedReviews }
                    />
                );
            } }
        />
    );
};

SearchResultContainer.propTypes = {
    location: PropTypes.object
};

export default withRouter(SearchResultContainer);
