import React                      from 'react';
import PropTypes                  from 'prop-types';
import { graphql, QueryRenderer } from 'react-relay';
import { environment }            from '../../../api';
import ErrorComponent             from '../../components/ErrorComponent';
import LoaderComponent            from '../../components/LoaderComponent';
import JobRecruiterComponent      from './JobRecruiterComponent';
import JobEmployerComponent       from './JobEmployerComponent';

const JOB_QUERY = graphql`
    query JobPageQuery($jobId: ID!) {
        viewer {
            user {
                ... on User {
                    contactNumber
                }
                ... on Recruiter {
                    contactNumber
                }
            }
        }
        job: node(id: $jobId) {
            ... on Job {
                id
                postedBy {
                    firstName
                }
                title
                suburb
                state
                location {
                    state
                    region
                }
                category {
                    id
                    name
                }
                type
                status
                searchType
                vacancies
                vacancyReason
                feePercentage
                salary
                term
                recruiterCount
                candidateCount
                expires
                minRate
                maxRate
                rateType
                description
                whoLookingFor
                companyOverview
                compensationAndBenefits
                files {
                    id
                    url
                    name
                    path
                }
                ...JobStatusComponent_data
                ...JobTabRecruitersComponent_job
                myApplication {
                    ...RecruiterApplicationStatus_data
                    id
                    status
                    recruiter {
                        firstName
                        lastName
                        aboutMe
                        placementHistory
                        agency {
                            name
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
                    applications {
                        id
                        status
                        job {
                            id
                        }
                        files {
                            id
                            name
                            url
                            path
                        }
                        recruiter {
                            id
                            firstName
                            lastName
                            aboutMe
                            placementHistory
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
                        offers {
                            id
                            status
                            salary
                            jobTitle
                            startDate
                            term
                        }
                        interviewRequests {
                            id
                            date
                            interviewDuration
                            status
                            additionalAvailability
                            specialInstructions
                            location
                            attendees {
                                name
                                jobTitle
                                email
                            }
                            application {
                                id
                            }
                        }
                        candidate {
                            id
                            firstName
                            lastName
                            email
                            workRights
                            noticePeriod
                            linkedinUrl
                            salaryExpectations
                            additionalInformation
                        }
                    }
                }
                appliedRecruiters {
                    ...RecruiterApplicationStatus_data
                    id
                    recruiter {
                        id
                        firstName
                        lastName
                        contactNumber
                        aboutMe
                        placementHistory
                        agency {
                            id
                            name
                            contactNumber
                        }
                    }
                    briefingRequests {
                        id
                        dateTime
                        endDate
                        status
                        whoWillCall
                        numberToCall
                        status
                        notes
                    }
                    applications {
                        id
                        status
                        job {
                            id
                        }
                        files {
                            id
                            name
                            path
                            url
                        }
                        interviewRequests {
                            id
                            date
                            interviewDuration
                            status
                            additionalAvailability
                            location
                            specialInstructions
                            attendees {
                                name
                                email
                                jobTitle
                            }
                        }
                        offers {
                            id
                            salary
                            jobTitle
                            status
                            term
                            startDate
                            salary
                            rateType
                            jobApplication {
                                id
                            }
                        }
                        recruiter {
                            id
                            profilePhoto {
                                url
                                id
                                name
                                path
                            }
                            firstName
                            lastName
                            aboutMe
                            placementHistory
                            agency {
                                id
                                name
                                logo
                                contactNumber
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
                            recruiterRelationship {
                                id
                                isFavourite
                            }
                        }
                        candidate {
                            id
                            firstName
                            lastName
                            email
                            workRights
                            noticePeriod
                            linkedinUrl
                            salaryExpectations
                            additionalInformation
                            rateType
                            grossRate
                        }
                    }
                }
                company {
                    id
                    name
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
    }
`;

export const JobView = ({ match }) => (
    <QueryRenderer
        environment={ environment }
        query={ JOB_QUERY }
        variables={ { jobId: match.params.jobId } }
        render={ ({ error, props: data }) => {
            if (error) {
                return <ErrorComponent error={ error } />;
            }
            if (!data && !error) {
                return <LoaderComponent row />;
            }

            if (!data.job) {
                return <span>Job was not found</span>;
            }

            return (match.path.includes('my-jobs') || match.path.includes('marketplace')) ?
                <JobRecruiterComponent
                    job={ data.job }
                /> :
                <JobEmployerComponent
                    job={ data.job }
                    contactNumber={ data.viewer.user.contactNumber }
                />;
        } }
    />
);

JobView.propTypes = {
    match: PropTypes.object.isRequired,
};

export default JobView;
