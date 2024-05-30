import { graphql }        from 'react-relay';
import { commitMutation } from '../api';

const mutation = graphql`
    mutation ScheduleInterviewMutation($input: ScheduleInterviewInput!) {
        mutator {
            scheduleInterview(input: $input) {
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

const commit = (environment, application, input) => {
    const { id } = application;
    const variables = {
        input: { ...input, applicationId: id }
    };

    return commitMutation(environment, {
        mutation,
        variables,
        errorPath: 'mutator.scheduleInterview.errors'
    });
};

export default { commit };
