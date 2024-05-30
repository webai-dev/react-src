import React               from 'react';
import PropTypes           from 'prop-types';
import SelectComponent     from '../../components/SelectComponent';
import { JOBS_QUERY_TYPE } from '../../../constants';

const SelectJobStatusComponent = (props) => {
    const { onSetValue, className, jobStatus, isUser } = props;

    return (
        <SelectComponent
            setValue={ onSetValue }
            className={ className }
            value={ jobStatus || JOBS_QUERY_TYPE.ALL }
            values={ isUser ? [
                {
                    key: JOBS_QUERY_TYPE.ALL,
                    label: 'All',
                },
                {
                    key: JOBS_QUERY_TYPE.DRAFT,
                    label: 'Draft',
                },
                {
                    key: JOBS_QUERY_TYPE.ENGAGED,
                    label: 'Engaged',
                },
                {
                    key: JOBS_QUERY_TYPE.FILED,
                    label: 'Filed',
                },
                {
                    key: JOBS_QUERY_TYPE.OPEN,
                    label: 'Open',
                },
                {
                    key: JOBS_QUERY_TYPE.PENDING_OPEN,
                    label: 'Pending',
                },
            ] : [
                {
                    key: JOBS_QUERY_TYPE.ALL,
                    label: 'All',
                },
                {
                    key: JOBS_QUERY_TYPE.ENGAGED,
                    label: 'Engaged',
                },
                {
                    key: JOBS_QUERY_TYPE.WITHDRAWN,
                    label: 'Withdrawn',
                },
                {
                    key: JOBS_QUERY_TYPE.PENDING,
                    label: 'Pending',
                },
            ] }
        />
    );
};

SelectJobStatusComponent.propTypes = {
    isUser: PropTypes.bool,
    className: PropTypes.string,
    jobStatus: PropTypes.string,
    onSetValue: PropTypes.func.isRequired,
};

export default SelectJobStatusComponent;
