import React, { PureComponent } from 'react';
import {
    graphql,
    QueryRenderer,
}                               from 'react-relay';
import { environment }          from '../../../api';
import debounce                 from 'lodash/debounce';
import {
    BaseAPiPath, ROUTES,
    SEARCH_CATEGORY_TYPES,
    SEARCH_LOCATION_TYPES,
    SEARCH_ROLE_TYPES,
    SEARCH_SPECIALIZATIONS_TYPES,
    THROTTLE_TIME
}                               from '../../../constants';
import getQueryParams           from '../../../util/getQueryParams';
import getQueryString           from '../../../util/getQueryString';
import QuickSearchComponent     from './QuickSearchComponent';

const SEARCH_QUERY = graphql`
    query QuickSearchContainerContainerQuery($input: SearchRequestInput!) {
        viewer {
            quicksearch(input: $input) {
                agencies {
                    results {
                        result {
                            __typename
                            ... on Agency {
                                id
                                slug
                                name
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
                        }
                    }
                    totalHits
                }
                recruiters {
                    results {
                        result {
                            __typename
                            ... on Recruiter {
                                id
                                slug
                                city
                                state
                                firstName
                                lastName
                                agency {
                                    id
                                    slug
                                    name
                                }
                                profilePhoto {
                                    url
                                }
                            }
                        }
                    }
                    totalHits
                }
            }
        }
    }
`;


class QuickSearchContainer extends PureComponent {
    state = {
        filtersSearch: '',
        valueToShow: '', // will be shown immediately
        valueToSearch: '', // will be throttled
    };

    /**
     * Handle input onChange
     *
     * @param {ReactEvent} event
     */
    handleChangeValue = (event) => {
        const value = event.target.value;
        this.setState({ valueToShow: value });
        this.handleSetValue(value);
    };
    /**
     * Handle input onChange
     *
     * @param {string} value
     */
    handleSetValue = debounce((value) => {
        this.setState({ valueToSearch: value });
    }, THROTTLE_TIME);


    handleChangeFilters = (filtersSearch) => {
        this.setState({ filtersSearch });
    };

    render() {
        const { handleChangeFilters, handleChangeValue } = this;
        const { filtersSearch, valueToSearch, valueToShow } = this.state;
        const queryParams = getQueryParams(filtersSearch);
        const pathToSearch = `${ BaseAPiPath }${ ROUTES.SEARCH }${
            getQueryString(valueToSearch ? { search: valueToSearch, ...queryParams } : queryParams)
            }`;
        return (
            <QueryRenderer
                environment={ environment }
                query={ SEARCH_QUERY }
                variables={ {
                    input: {
                        query: valueToSearch,
                        filters: [ // NOTE same filters are used here assets/app/ui/pages/Search/SearchResultContainer.js
                            {
                                name: SEARCH_CATEGORY_TYPES.name,
                                values: queryParams[ SEARCH_CATEGORY_TYPES.name ] || SEARCH_CATEGORY_TYPES.values[ 2 ]
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
                    },
                } }
                render={ ({ error, props: data }) => {
                    const loading = !error && !data;
                    const quicksearch = data && data.viewer && data.viewer.quicksearch;
                    let recruiters = [];
                    let recruitersCount = 0;
                    let agencies = [];
                    let agenciesCount = 0;
                    if (valueToSearch && valueToSearch.length >= 3) {
                        recruiters = quicksearch && quicksearch.recruiters && quicksearch.recruiters.results.map(({ result }) => result);
                        recruitersCount = quicksearch && quicksearch.recruiters && +quicksearch.recruiters.totalHits;
                        agencies = quicksearch && quicksearch.agencies && quicksearch.agencies.results.map(({ result }) => result);
                        agenciesCount = quicksearch && quicksearch.agencies && +quicksearch.agencies.totalHits;
                    }
                    return (
                        <QuickSearchComponent
                            valueToSearch={ valueToSearch }
                            valueToShow={ valueToShow }
                            pathToSearch={ pathToSearch }
                            handleChangeValue={ handleChangeValue }
                            handleChangeFilters={ handleChangeFilters }
                            filtersSearch={ filtersSearch }
                            recruiters={ recruiters }
                            agencies={ agencies }
                            recruitersCount={ recruitersCount }
                            agenciesCount={ agenciesCount }
                            error={ error }
                            loading={ loading }
                        />
                    );
                } }
            />
        );
    }
}

export default QuickSearchContainer;
