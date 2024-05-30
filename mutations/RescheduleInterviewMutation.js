import { graphql }        from 'react-relay';
import { commitMutation } from '../api';

const mutation = graphql`
    mutation RescheduleInterviewMutation($input: RescheduleInterviewInput!) {
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

const commit = (environment, application, input) => {
    const { id } = application;
    const variables = {
        input: { ...input, interviewId: id }
    };

    return commitMutation(environment, {
        mutation,
        variables,
        errorPath: 'mutator.rescheduleInterview.errors'
    });
};

export default { commit };
