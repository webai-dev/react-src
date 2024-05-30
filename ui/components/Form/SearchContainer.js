import React, { PureComponent }   from 'react';
import SearchComponent            from './SearchComponent';
import PropTypes                  from 'prop-types';
import { withRouter }             from 'react-router-dom';
import getQueryParams             from '../../../util/getQueryParams';
import getQueryString             from '../../../util/getQueryString';
import debounce                   from 'lodash/debounce';
import { THROTTLE_TIME }          from '../../../constants';

class SearchContainer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: getQueryParams(props.location.search)[props.name] || '',
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        // keep input value sync with corresponding location.search if it was changed not by input change
        const oldQuery = getQueryParams(this.props.location.search)[this.props.name];
        const newQuery = getQueryParams(nextProps.location.search)[this.props.name];
        if (oldQuery !== newQuery) {
            this.setState({ searchValue: newQuery });
        }
    }

    /**
     * Handle location change based on input searchValue
     *
     * @param {string} query
     */
    handleSetQuery = debounce((query) => {
        const queryParams = getQueryParams(this.props.location.search);
        queryParams[this.props.name] = query;
        queryParams.page = 1;
        if (this.props.onSearch) {
            this.props.onSearch(query);
        }
        this.props.history.replace({
            pathname: this.props.location.pathname,
            search: getQueryString(queryParams)
        });
    }, THROTTLE_TIME);

    /**
     * Handle input value change
     *
     * @param {ReactEvent} event
     */
    handleChangeValue = (event) => {
        const query = event.target.value;
        this.setState({ searchValue: query });
        this.handleSetQuery(query);
    };

    render() {
        const { name, ...rest } = this.props;
        const { searchValue } = this.state;
        const { handleChangeValue } = this;

        return (
            <SearchComponent
                handleChangeValue={ handleChangeValue }
                name={ name }
                value={ searchValue }
                { ...rest }
            />
        );
    }
}

SearchContainer.propTypes = {
    className: PropTypes.string,
    innerSearchStyle: PropTypes.bool,
    location: PropTypes.object,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onSearch: PropTypes.func,
    history: PropTypes.object.isRequired,
};

export default withRouter(SearchContainer);
