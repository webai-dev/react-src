import React, { Component }   from 'react';
import PropTypes              from 'prop-types';
import {
    graphql,
    QueryRenderer,
}                             from 'react-relay';
import ErrorComponent         from '../../components/ErrorComponent';
import LoaderComponent        from '../../components/LoaderComponent';
import CreateEditJobComponent from './CreateEditJobComponent';
import { environment }        from '../../../api';
import getQueryParams         from '../../../util/getQueryParams';
import { CLONE_JOB_ID }       from '../../../constants';

const CREATE_JOB_QUERY = graphql`
    query JobCreateEditCreateQuery {
        viewer {
            hasJobs
            verified
            user {
                ... on User {
                    email
                    company {
                        name
                        state
                        city
                        overview
                    }
                }
                ... on Recruiter {
                    email
                }
            }
            recruiters {
                id
                profilePhoto {
                    url
                    id
                    name
                    path
                }
                firstName
                lastName
                specialisations {
                    id
                    name
                }
                recruiterRelationship {
                    id
                    isFavourite
                }
                agency {
                    id
                    name
                    logo
                    agencyRelationship {
                        id
                        isPsa
                        psaDocument {
                            id
                            name
                            url
                        }
                    }
                }
            }
            jobCategories {
                id
                name
            }
        }
    }
`;

const EDIT_JOB_QUERY = graphql`
    query JobCreateEditEditQuery($jobId: ID!) {
        viewer {
            hasJobs
            verified
            user {
                ... on User {
                    email
                    company {
                        name
                        state
                        city
                        overview
                    }
                }
                ... on Recruiter {
                    email
                }
            }
            recruiters {
                id
                profilePhoto {
                    url
                    id
                    name
                    path
                }
                firstName
                lastName
                specialisations {
                    id
                    name
                }
                recruiterRelationship {
                    id
                    isFavourite
                }
                agency {
                    id
                    name
                    logo
                    agencyRelationship {
                        id
                        isPsa
                        psaDocument {
                            id
                            name
                            url
                        }
                    }
                }
            }
            jobCategories {
                id
                name
            }
        }
        job: node(id: $jobId) {
            ... on Job {
                id
                category {
                    id
                    name
                }
                title
                files {
                    id
                    name
                    path
                }
                suburb
                postcode
                appliedRecruiters {
                    id
                    recruiter {
                        id
                        aboutMe
                        placementHistory
                        recruiterRelationship {
                            id
                            isFavourite
                        }
                        agency {
                            id
                            agencyRelationship {
                                id
                                isPsa
                                psaDocument {
                                    id
                                    name
                                    url
                                }
                            }
                        }
                    }
                }
                type
                searchType
                status
                vacancies
                vacancyReason
                feePercentage
                salary
                term
                description
                whoLookingFor
                companyOverview
                compensationAndBenefits
            }
        }
    }
`;

class JobCreateEditView extends Component {
    render() {
        const { match, history, location } = this.props;
        const jobId = match.params.jobId;
        const tab = match.params.tab;
        const cloneJobId = getQueryParams(location.search)[ CLONE_JOB_ID ];

        return (
            <QueryRenderer
                environment={ environment }
                query={ jobId || cloneJobId ? EDIT_JOB_QUERY : CREATE_JOB_QUERY }
                variables={ { jobId: jobId || cloneJobId } }
                render={ ({ error, props: data, retry }) => {
                    if (error) {
                        return <ErrorComponent error={ error } />;
                    }
                    if (!data && !error) {
                        return <LoaderComponent row />;
                    }

                    if (jobId && !data.job) {
                        return <span>Job was not found</span>;
                    }

                    return (
                        <CreateEditJobComponent
                            viewer={ data.viewer }
                            job={ jobId && data.job }
                            cloneJob={ cloneJobId && { ...data.job, id: null } }
                            history={ history }
                            tab={ tab }
                            reload={ retry }
                            isEdit={ !!jobId }
                            onJobSave={ () => {
                                if (jobId) {
                                    retry();
                                } else {
                                    history.push('/jobs');
                                }
                            } }
                        />
                    );
                } }
            />
        );
    }
}

JobCreateEditView.propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
};

export default JobCreateEditView;
