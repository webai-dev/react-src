import React                 from 'react';
import PropTypes             from 'prop-types';
import SelectComponent       from '../../components/SelectComponent';
import { withRouter }        from 'react-router-dom';
import getQueryParams        from '../../../util/getQueryParams';
import getQueryString        from '../../../util/getQueryString';
import { REVIEW_QUERY_TYPE } from '../../../constants';

const SelectReviewTypeContainer = (props) => {
    const { className, location, history } = props;

    const queryParams = getQueryParams(location.search);
    const type = queryParams[REVIEW_QUERY_TYPE._NAME];

    return (
        <SelectComponent
            setValue={ (value) => {
                const newQueryParams = { ...queryParams };
                newQueryParams[REVIEW_QUERY_TYPE._NAME] = value;
                history.push(`${location.pathname}${getQueryString(newQueryParams)}`);
            } }
            className={ className }
            value={ type || REVIEW_QUERY_TYPE.ALL }
            isWhite
            values={ [
                {
                    key: REVIEW_QUERY_TYPE.ALL,
                    label: 'All',
                },
                {
                    key: REVIEW_QUERY_TYPE.EMPLOYER,
                    label: 'Employers',
                },
                {
                    key: REVIEW_QUERY_TYPE.CANDIDATE,
                    label: 'Candidate',
                },
            ] }
        />
    );
};

SelectReviewTypeContainer.propTypes = {
    className: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
};

export default withRouter(SelectReviewTypeContainer);
