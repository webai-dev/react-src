import React, {
    PureComponent,
} from 'react';
import PropTypes                  from 'prop-types';
import debounce                   from 'lodash/debounce';
import {
    THROTTLE_TIME,
} from '../../../constants';
import {
    graphql,
    QueryRenderer,
} from 'react-relay';
import {
    environment,
} from '../../../api';
import SelectInputComponent from '../Form/SelectInputComponent';

const LOCATIONS_QUERY = graphql `
    query LocationCustomInputComponentQuery($query: String!) {
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

// it is a clone of LocationFormsyInputComponent be sure you change them both
class LocationCustomInputComponent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            query: (this.props.value && this.props.value.key),
        };
    }

    /**
     * Will initiate query re render and will fetch new suggestions for select
     *
     * @param {string} query - string from input
     */
    handleChangeQuery = debounce((query) => {
        this.setState({ query });
    }, THROTTLE_TIME);

    render() {
        const { handleChangeQuery } = this;
        const { value,label, name, className, required, limit, isFormSubmitted, setValue } = this.props;
        const { query } = this.state;

        return (
            <QueryRenderer
                environment={ environment }
                query={ LOCATIONS_QUERY }
                variables={ { query: query || '' } }
                render={
                    ({ error, props: data }) => {
                        const isLoading = !data && !error;

                        const items = data && data.viewer && data.viewer.locations &&
                            data.viewer.locations.map(location => ({
                                key: location.code,
                                label: `${location.suburb}, ${location.code}`
                            }));

                        return (
                            <SelectInputComponent
                                isLoading={ isLoading }
                                touched={ isFormSubmitted }
                                onInputChange={ handleChangeQuery }
                                values={ items ? limit ? [{ items: items.slice(0, limit) }] : [{ items }] : [] }
                                value={ value && value.key }
                                realValue={ value }
                                className={ className }
                                placeholder="Enter Postcode"
                                setValue={ setValue }
                                name={ name }
                                label={ label }
                                required={ required }
                            />
                        );
                    }
                }
            />

        );
    }
}

// it is a clone of LocationFormsyInputComponent be sure you change them both
LocationCustomInputComponent.propTypes = {
    value: PropTypes.object,
    label: PropTypes.string,
    className: PropTypes.string,
    required: PropTypes.bool,
    name: PropTypes.string.isRequired,
    limit: PropTypes.number,
    isFormSubmitted: PropTypes.bool,
    setValue: PropTypes.func.isRequired,
};

export default LocationCustomInputComponent;
