import React, { PureComponent }   from 'react';
import PropTypes                  from 'prop-types';
import SelectCategoryComponent    from './SelectCategoryComponent';
import { withRouter }             from 'react-router-dom';
import { SEARCH_CATEGORY_TYPES }  from '../../../constants';
import getQueryParams             from '../../../util/getQueryParams';
import getQueryString             from '../../../util/getQueryString';

@withRouter
class SelectCategoryContainer extends PureComponent {
    /**
     * Handle location change based on query
     *
     * @param {string} query
     */
    handleGoToQuery = (query) => {
        const queryParams = getQueryParams(this.props.location.search);
        queryParams[SEARCH_CATEGORY_TYPES.name] = query;
        queryParams.page = 1;
        this.props.history.replace({
            pathname: this.props.location.pathname,
            search: getQueryString(queryParams)
        });
    };

    render() {
        const { handleGoToQuery } = this;
        const currentTab = getQueryParams(this.props.location.search)[SEARCH_CATEGORY_TYPES.name] || SEARCH_CATEGORY_TYPES.values[0];

        return (
            <SelectCategoryComponent handleGoToQuery={ handleGoToQuery } tab={ currentTab }/>
        );
    }
}

SelectCategoryContainer.propTypes = {
    location: PropTypes.object,
    history: PropTypes.object,
};

export default SelectCategoryContainer;
