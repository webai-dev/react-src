import { graphql }        from 'react-relay';
import { commitMutation } from '../api';

const mutation = graphql`
    mutation DeleteJobMutation($id: ID!) {
        mutator {
            removeJob(id: $id) {
                jobs {
                    id
                    title
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
        errorPath: 'mutator.removeJob.errors'
    });
};

export default { commit };
