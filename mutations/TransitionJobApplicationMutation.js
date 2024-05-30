import { graphql }        from 'react-relay';
import { commitMutation } from '../api';

const mutation = graphql`
    mutation TransitionJobApplicationMutation($input: JobApplicationTransitionInput) {
        mutator {
            transitionJobApplication(input: $input) {
                jobApplication {
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

const commit = (environment, jobApplication, transition, reason = undefined) => {
    const variables = {
        input: {
            transition,
            id: jobApplication.id,
            reason
        }
    };

    return commitMutation(environment, {
        mutation,
        variables,
        errorPath: 'mutator.transitionJobApplication.errors'
    });
};

export default { commit };
