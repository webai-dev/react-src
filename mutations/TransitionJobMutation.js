import { graphql }        from 'react-relay';
import { commitMutation } from '../api';

const mutation = graphql`
    mutation TransitionJobMutation($id: String!, $transition: String!) {
        mutator {
            transitionJob(id: $id, transition: $transition) {
                job {
                    status
                    recruiterCount
                }
                errors {
                    key
                    value
                }
            }
        }
    }
`;

const commit = (environment, job, transition) => {
    const variables = {
        transition,
        id: job.id
    };

    return commitMutation(environment, {
        mutation,
        variables,
        errorPath: 'mutator.transitionJob.errors'
    });
};

export default { commit };
