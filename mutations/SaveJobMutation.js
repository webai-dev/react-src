import { graphql }        from 'react-relay';
import { commitMutation } from '../api';

const mutation = graphql`
    mutation SaveJobMutation($input: CreateJobInput!) {
        mutator {
            saveJob(input: $input) {
                job {
                    id
                    title
                    status
                    files {
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

const commit = (environment, job ) => {
    const { files, ...other } = job;
    const variables = {
        input: { ...other }
    };

    return commitMutation(environment, {
        mutation,
        variables,
        uploadables: { files: files.map(it => it.file) },
        errorPath: 'mutator.saveJob.errors'
    });
};

export default { commit };
