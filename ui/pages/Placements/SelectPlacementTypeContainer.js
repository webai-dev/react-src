import React                    from 'react';
import PropTypes                from 'prop-types';
import SelectComponent          from '../../components/SelectComponent';
import { withRouter }           from 'react-router-dom';
import getQueryParams           from '../../../util/getQueryParams';
import getQueryString           from '../../../util/getQueryString';
import { PLACEMENT_QUERY_TYPE } from '../../../constants';

const SelectPlacementTypeContainer = (props) => {
    const { className, location, history } = props;

    const queryParams = getQueryParams(location.search);
    const type = queryParams[PLACEMENT_QUERY_TYPE._NAME];

    return (
        <SelectComponent
            isWhite
            setValue={ (value) => {
                const newQueryParams = { ...queryParams };
                newQueryParams[PLACEMENT_QUERY_TYPE._NAME] = value;
                history.push(`${location.pathname}${getQueryString(newQueryParams)}`);
            } }
            className={ className }
            value={ type || PLACEMENT_QUERY_TYPE.ALL }
            values={ [
                {
                    key: PLACEMENT_QUERY_TYPE.ALL,
                    label: 'All',
                },
                {
                    key: PLACEMENT_QUERY_TYPE.REVIEWED,
                    label: 'Reviewed',
                },
                {
                    key: PLACEMENT_QUERY_TYPE.UNREVIEWED,
                    label: 'Unreviewed',
                },
            ] }
        />
    );
};

SelectPlacementTypeContainer.propTypes = {
    className: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
};

export default withRouter(SelectPlacementTypeContainer);
