import React, {
    PureComponent,
}                                 from 'react';
import PropTypes                  from 'prop-types';
import FormsySelectInputComponent from '../formsy/FormsySelectInputComponent';
import debounce                   from 'lodash/debounce';
import {
    THROTTLE_TIME,
}                                 from '../../../constants';
import {
    graphql,
    QueryRenderer,
}                                 from 'react-relay';
import {
    environment,
}                                 from '../../../api';

const LOCATIONS_QUERY = graphql`
    query LocationFormsyInputComponentQuery($query: String!) {
        viewer {
            locations(query: $query) {
                city
                state
                suburb
                region
                code
            }
        }
    }
`;

class LocationFormsyInputComponent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            query: (this.props.value && this.props.value.key) || '',
        };
    }

    /**
     * Will initiate query re render and will fetch new suggestions for select
     *
     * @param {string} [query] - string from input
     */
    handleChangeQuery = debounce((query = '') => {
        this.setState({ query });
    }, THROTTLE_TIME);

    render() {
        const { handleChangeQuery } = this;
        const { value, label, name, className, required, limit } = this.props;
        const { query } = this.state;

        return (
            <QueryRenderer
                environment={ environment }
                query={ LOCATIONS_QUERY }
                variables={ { query } }
                render={
                    ({ error, props: data }) => {
                        const isLoading = !data && !error;

                        const items = data && data.viewer && data.viewer.locations &&
                            data.viewer.locations.map(location => ({
                                key: location.code,
                                label: `${ location.suburb }, ${ location.code }`
                            }));

                        return (
                            <FormsySelectInputComponent
                                className={ className }
                                isLoading={ isLoading }
                                onInputChange={ handleChangeQuery }
                                values={ items ? limit ? [ { items: items.slice(0, limit) } ] : [ { items } ] : [] }
                                value={ value && value.key }
                                realValue={ value }
                                name={ name }
                                required={ required }
                                placeholder="Enter Postcode"
                                label={ label }
                            />
                        );
                    }
                }
            />

        );
    }
}

LocationFormsyInputComponent.propTypes = {
    value: PropTypes.object,
    label: PropTypes.string,
    className: PropTypes.string,
    required: PropTypes.bool,
    name: PropTypes.string.isRequired,
    limit: PropTypes.number,
};

export default LocationFormsyInputComponent;
