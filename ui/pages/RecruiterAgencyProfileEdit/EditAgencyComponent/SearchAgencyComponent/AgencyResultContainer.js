import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import {
    graphql,
    QueryRenderer,
}                               from 'react-relay';
import {
    environment,
}                               from '../../../../../api';
import ErrorComponent           from '../../../../components/ErrorComponent';
import LoaderComponent          from '../../../../components/LoaderComponent';
import AgencyResultComponent    from './AgencyResultComponent';
import {
    SEARCH_CATEGORY_TYPES,
}                               from '../../../../../constants';

const AGENCY_SEARCH_QUERY = graphql`
    query AgencyResultContainerQuery($input: SearchRequestInput) {
        viewer {
            search(input: $input) {
                results {
                    result {
                        __typename
                        ... on Agency {
                            name
                            id
                        }
                    }
                }
            }
        }
    }
`;

class SearchAgencyContainer extends PureComponent {
    render() {
        const { valueToSearch, agencyId, handleOpenConfirmModal, isLoading } = this.props;
        return (
            <QueryRenderer
                environment={ environment }
                query={ AGENCY_SEARCH_QUERY }
                variables={ {
                    input: {
                        page: 1,
                        query: valueToSearch,
                        filters: [
                            {
                                name: SEARCH_CATEGORY_TYPES.name,
                                values: SEARCH_CATEGORY_TYPES.values[ 1 ] // has to be agency
                            },
                        ],
                    },
                } }
                render={ ({ error, props: data }) => {
                    if (error) {
                        return <ErrorComponent error={ error } />;
                    }
                    if (!error && !data) {
                        return <LoaderComponent
                            row
                            small
                        />;
                    }
                    const viewer = data && data.viewer;
                    const agencies = (viewer && viewer.search && viewer.search.results) || [];

                    return (
                        <AgencyResultComponent
                            agencyId={ agencyId }
                            agencies={ agencies }
                            isLoading={ isLoading }
                            handleOpenConfirmModal={ handleOpenConfirmModal }
                        />
                    );
                } }
            />
        );
    }
}

SearchAgencyContainer.propTypes = {
    agencyId: PropTypes.string,
    valueToSearch: PropTypes.string.isRequired,
    handleOpenConfirmModal: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};

export default SearchAgencyContainer;
