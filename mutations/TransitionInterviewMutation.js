import { graphql }        from 'react-relay';
import { commitMutation } from '../api';

const mutation = graphql`
    mutation TransitionInterviewMutation($input: TransitionInterviewInput!) {
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

const commit = (environment, application, transition) => {
    const { id } = application;
    const variables = {
        input: { transition, interviewId: id }
    };

    return commitMutation(environment, {
        mutation,
        variables,
        errorPath: 'mutator.transitionInterview.errors'
    });
};

export default { commit };
