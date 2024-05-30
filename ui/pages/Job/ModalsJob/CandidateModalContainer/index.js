import React, { PureComponent }        from 'react';
import PropTypes                       from 'prop-types';
import { withRouter }                  from 'react-router-dom';
import {
    graphql,
    QueryRenderer,
}                                      from 'react-relay';
import { commitMutation, environment } from '../../../../../api';
import CandidateModalComponent         from './CandidateModalComponent';


const transitionInterviewMutation = graphql`
    mutation CandidateModalContainerTranslateMutation($input: TransitionInterviewInput!) {
        mutator {
            transitionInterview(input: $input) {
                schedule {
                    id
                    status
                }
                errors {
                    key
                    value
                }
            }
        }
    }
`;


const rescheduleInterviewMutation = graphql`
    mutation CandidateModalContainerRescheduleMutation($input: RescheduleInterviewInput!) {
        mutator {
            rescheduleInterview(input: $input) {
                schedule {
                    id
                    date
                    status
                    timezone
                    interviewDuration
                    application {
                        id
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
                errors {
                    key
                    value
                }
            }
        }
    }
`;

const JOB_APPLICATION_QUERY = graphql`
    query CandidateModalContainerQuery($applicationId: ID!) {
        application: node(id: $applicationId) {
            ... on JobApplication {
                id
                status
                job {
                    id
                    title
                    status
                    feePercentage
                    rateType
                    minRate
                    maxRate
                    salary
                    type
                    company {
                        id
                        name
                    }
                }
                recruiter {
                    id
                    aboutMe
                    placementHistory
                    profilePhoto {
                        url
                        id
                        name
                        path
                    }
                    firstName
                    lastName
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
                    rate
                    grossRate
                    award
                    rateType
                }
                interviewRequests {
                    id
                    date
                    status
                    additionalAvailability
                    specialInstructions
                    location
                    interviewDuration
                    attendees {
                        email
                        name
                        jobTitle
                    }
                }
                offers {
                    id
                    jobTitle
                    startDate
                    salary
                    status
                    term
                    rateType
                    award
                    jobApplication {
                        id
                    }
                }
                files {
                    name
                    id
                    url
                }
            }
        }
    }
`;

class JobApplicationContainer extends PureComponent {
    state = {
        reschedule: null,
        errors: [],
        cancelReason: '',
        cancelInterviewModal: null,
    };

    /**
     * Will open modal to Cancel interview
     *
     * @param {string} cancelInterviewModal
     */
    handleOpenCancelModal = (cancelInterviewModal) => {
        this.setState({ cancelInterviewModal });
    };
    /**
     * Will close modal to Cancel interview
     */
    handleCloseCancelModal = () => {
        this.setState({ cancelInterviewModal: null });
    };

    handleCloseModal = () => {
        this.props.history.push(this.props.isEmployer ?
            `/jobs/${ this.props.jobId }/candidates` :
            `/${ this.props.viewType }/job/${ this.props.jobId }/candidates`);
    };

    handleViewInterview = interview => {
        this.props.history.push(this.props.isEmployer ?
            `/jobs/${ this.props.jobId }/candidate/${ this.props.applicationId }/interview/${ interview.id }` :
            `/my-jobs/job/${ this.props.jobId }/candidate/${ this.props.applicationId }/interview/${ interview.id }`,
        );
    };

    handleRequestBack = () => {
        this.props.history.push(this.props.isEmployer ?
            `/jobs/${ this.props.jobId }/candidates` :
            `/my-jobs/job/${ this.props.jobId }/candidates`);
    };

    handleReschedule = (interview) => {
        this.setState({ reschedule: interview });
    };

    handleCancelReason = cancelReason => {
        this.setState({ cancelReason });
    };

    handleTransitionInterview = (interview, transition) => {
        this.setState({ reschedule: null });

        const { id } = interview;
        const variables = {
            input: { transition, interviewId: id }
        };

        commitMutation(environment, {
            mutation: transitionInterviewMutation,
            variables,
        })
            .then(
                () => {
                    this.setState({ reschedule: null });
                    this.handleRequestBack();
                },
            )
            .catch(
                ({ errors }) => {
                    if (errors) {
                        this.setState({ errors });
                    }
                },
            );
    };

    handleRescheduleSubmit = (interview, schedule) => {
        const { id } = interview;
        const variables = {
            input: { ...schedule, interviewId: id }
        };

        commitMutation(environment, {
            mutation: rescheduleInterviewMutation,
            variables,
        })
            .then(
                () => this.setState({ reschedule: null }),
            )
            .catch(
                ({ errors }) => {
                    if (errors) {
                        this.setState({ errors });
                    }
                },
            );
    };


    render() {
        const { applicationId, isEmployer } = this.props;
        const {
            handleCloseModal,
            handleViewInterview,
            handleRequestBack,
            handleReschedule,
            handleCancelReason,
            handleTransitionInterview,
            handleRescheduleSubmit,
            handleOpenCancelModal,
            handleCloseCancelModal,
        } = this;
        const {
            reschedule,
            errors,
            cancelReason,
            cancelInterviewModal,
        } = this.state;


        return (
            <QueryRenderer
                environment={ environment }
                query={ JOB_APPLICATION_QUERY }
                variables={ { applicationId } }
                render={ ({ error, props: data }) => {
                    const isLoading = !error && !data;
                    return (
                        <CandidateModalComponent
                            cancelInterviewModal={ cancelInterviewModal }
                            handleCloseCancelModal={ handleCloseCancelModal }
                            handleOpenCancelModal={ handleOpenCancelModal }
                            isEmployer={ isEmployer }
                            handleCloseModal={ handleCloseModal }
                            isLoading={ isLoading }
                            error={ error }
                            application={ data && data.application }
                            handleViewInterview={ handleViewInterview }
                            handleRequestBack={ handleRequestBack }

                            handleReschedule={ handleReschedule }
                            handleCancelReason={ handleCancelReason }
                            handleTransitionInterview={ handleTransitionInterview }
                            handleRescheduleSubmit={ handleRescheduleSubmit }
                            reschedule={ reschedule }
                            errors={ errors }
                            cancelReason={ cancelReason }
                        />
                    );
                } }
            />);
    }
}

JobApplicationContainer.propTypes = {
    jobId: PropTypes.string.isRequired,
    isEmployer: PropTypes.bool,
    applicationId: PropTypes.string.isRequired,
    viewType: PropTypes.string,
    // router
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(JobApplicationContainer);
