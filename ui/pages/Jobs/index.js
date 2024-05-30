import React                  from 'react';
import PropTypes              from 'prop-types';
import { withRouter }         from 'react-router-dom';
import {
    graphql,
    QueryRenderer,
}                             from 'react-relay';
import { environment }        from '../../../api';
import getQueryParams         from '../../../util/getQueryParams';
import ErrorComponent         from '../../components/ErrorComponent';
import LoaderComponent        from '../../components/LoaderComponent';
import {
    JOBS_QUERY_TYPE,
}                             from '../../../constants';
import NotMPOModal            from '../../components/NotMPOModal';
import { ROUTES }             from '../../../constants';
import JobsEmployerComponent  from './JobsEmployerComponent';
import JobsRecruiterComponent from './JobsRecruiterComponent';

const RECRUITER_JOBS_QUERY = graphql`
    query JobsRecruiterPageQuery($jobStatus: JobStatusFilter) {
        viewer {
            mpoApproved
            ...JobsRecruiterComponent_data @arguments(jobStatus: $jobStatus)
            ...JobFilterComponent_data
        }
    }
`;
const EMPLOYER_JOBS_QUERY = graphql`
    query JobsEmployerPageQuery($jobStatus: JobStatusFilter) {
        viewer {
            mpoApproved
            ...JobsEmployerComponent_data @arguments(jobStatus: $jobStatus)
            ...JobFilterComponent_data
        }
    }
`;

const jobStatusTypes = {
    draft: 'Draft',
    active: 'Active',
    closed: 'Closed',
    pending: 'Pending',
    all: 'All',
};
const asJobStatusType = (val, queryVal) => {
    let possibleItem = jobStatusTypes[ (val || 'all').toLowerCase() ];
    if (typeof possibleItem === 'undefined') {
        possibleItem = 'all';
    }
    return (possibleItem === 'All' && queryVal) ? queryVal : possibleItem;
};

export const JobsRecruiterView = (props) => {
    const { match, ...rootProps } = props;
    const jobTypeFromQuery = getQueryParams(rootProps.location.search)[ JOBS_QUERY_TYPE._NAME ];
    return (
        <QueryRenderer
            environment={ environment }
            query={ match.path.includes('my-jobs') ? RECRUITER_JOBS_QUERY : EMPLOYER_JOBS_QUERY }
            variables={ {
                jobStatus: asJobStatusType(
                    match.params.tab,
                    jobTypeFromQuery,
                ),
            } }
            render={ ({ error, props: data, retry }) => {
                if (error) {
                    return <ErrorComponent error={ error } />;
                }
                if (!data && !error) {
                    return <LoaderComponent row />;
                }

                if (!data.viewer.mpoApproved) {
                    return <NotMPOModal handleCloseModal={ () => { props.history.push(ROUTES.DASHBOARD_REVIEWS);} } />;
                }
                return match.path.includes('my-jobs') ? (
                    <JobsRecruiterComponent
                        data={ data.viewer }
                        match={ match }
                        reload={ retry }
                        { ...rootProps }
                        { ...match.params }
                    />
                ) : (
                    <JobsEmployerComponent
                        data={ data.viewer }
                        match={ match }
                        reload={ retry }
                        { ...rootProps }
                        { ...match.params }
                    />
                );
            } }
        />
    );
};

JobsRecruiterView.propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(JobsRecruiterView);
