import React, { PureComponent }    from 'react';
import PropTypes                   from 'prop-types';
import QuickSearchFiltersComponent from './QuickSearchFiltersComponent';
import getQueryParams              from '../../../../util/getQueryParams';
import getQueryString              from '../../../../util/getQueryString';

class QuickSearchFiltersContainer extends PureComponent {
    /**
     * Handle location change based on query
     *
     * @param {string} name - query name
     * @param {string} value - query value
     */
    handleGoToQuery = ({ name, value }) => {
        const queryParams = getQueryParams(this.props.filtersSearch);
        if (!queryParams[ name ]) {
            queryParams[ name ] = [ value ];
        } else if (!queryParams[ name ].includes(value)) {
            queryParams[ name ].push(value);
        } else {
            queryParams[ name ] = queryParams[ name ].filter((valueToFilter) => valueToFilter !== value);
        }
        queryParams.page = 1;
        this.props.handleChangeFilters(getQueryString(queryParams));
    };

    render() {
        const { handleGoToQuery } = this;
        const { filtersSearch } = this.props;
        const queryParams = getQueryParams(filtersSearch);

        return (
            <QuickSearchFiltersComponent
                handleGoToQuery={ handleGoToQuery }
                queryParams={ queryParams }
            />
        );
    }
}

QuickSearchFiltersContainer.propTypes = {
    handleChangeFilters: PropTypes.func,
    filtersSearch: PropTypes.string,
};

export default QuickSearchFiltersContainer;
