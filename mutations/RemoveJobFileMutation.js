import { graphql }        from 'react-relay';
import { commitMutation } from '../api';

const mutation = graphql`
    mutation RemoveJobFileMutation($input: RemoveJobFileInput!) {
        mutator {
            removeJobFile(input: $input) {
                job {
                    id
                    files {
                        id
                        name
                        path
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

const commit = (environment, jobId, fileId) => {
    const variables = {
        input: { jobId, fileId }
    };

    return commitMutation(environment, {
        mutation,
        variables,
        errorPath: 'mutator.removeJobFile.errors'
    });
};

export default { commit };
