import { graphql }        from 'react-relay';
import { commitMutation } from '../api';

const mutation = graphql`
    mutation RecruiterApplicationTransitionMutation($input: RecruiterTransitionApplicationInput!) {
        mutator {
            transitionRecruiterApplication(input: $input) {
                application {
                    id
                    status
                }
                job {
                    id
                    myApplication {
                        id
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

const commit = (environment, recruiterApplication, transition, reason = '') => {
    const { id } = recruiterApplication;
    const variables = {
        input: { id, transition, reason }
    };

    return commitMutation(environment, {
        mutation,
        variables,
        errorPath: 'mutator.transitionRecruiterApplication.errors'
    });
};

export default { commit };
