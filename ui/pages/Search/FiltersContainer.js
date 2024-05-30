import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import FiltersComponent         from './FiltersComponent';
import { withRouter }           from 'react-router-dom';
import getQueryParams           from '../../../util/getQueryParams';
import getQueryString           from '../../../util/getQueryString';

class FiltersContainer extends PureComponent {
    state = {
        mobileFilters: []
    };

    /**
     * Handle display filters as dropdown on mobile and handle actual dropdown
     *
     * @param {string} filter - filter name
     */
    handleOpenFiltersMobile = (filter) => {
        this.setState({
            mobileFilters: this.state.mobileFilters.includes(filter) ?
                this.state.mobileFilters.filter(value => value !== filter) :
                [ ...this.state.mobileFilters, filter ]
        });
    };

    /**
     * Handle location change based on query
     *
     * @param {string} name - query name
     * @param {string} value - query value
     */
    handleGoToQuery = ({ name, value }) => {
        const queryParams = getQueryParams(this.props.location.search);
        if (!queryParams[ name ]) {
            queryParams[ name ] = [ value ];
        } else if (!queryParams[ name ].includes(value)) {
            queryParams[ name ].push(value);
        } else {
            queryParams[ name ] = queryParams[ name ].filter((valueToFilter) => valueToFilter !== value);
        }
        queryParams.page = 1;
        this.props.history.replace({
            pathname: this.props.location.pathname,
            search: getQueryString(queryParams),
        });
    };

    render() {
        const { handleGoToQuery, handleOpenFiltersMobile } = this;
        const { mobileFilters } = this.state;
        const { location } = this.props;
        const queryParams = getQueryParams(location.search);

        return (
            <FiltersComponent
                mobileFilters={ mobileFilters }
                handleOpenFiltersMobile={ handleOpenFiltersMobile }
                handleGoToQuery={ handleGoToQuery }
                queryParams={ queryParams }
            />
        );
    }
}

FiltersContainer.propTypes = {
    location: PropTypes.object,
    history: PropTypes.object,
};

export default withRouter(FiltersContainer);
