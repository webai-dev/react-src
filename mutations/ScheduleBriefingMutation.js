import { graphql }        from 'react-relay';
import { commitMutation } from '../api';

const mutation = graphql`
    mutation ScheduleBriefingMutation($input: ScheduleBriefingInput!) {
        mutator {
            scheduleBriefing(input: $input) {
                briefing {
                    id
                    recruiterApplication {
                        id
                        recruiter {
                            id
                        }
                        briefingRequests {
                            id
                            dateTime
                            endDate
                            whoWillCall
                            numberToCall
                            notes
                            status
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
        input: { ...input, recruiterApplicationId: id }
    };

    return commitMutation(environment, {
        mutation,
        variables,
        errorPath: 'mutator.scheduleBriefing.errors'
    });
};

export default { commit };
