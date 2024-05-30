import { graphql }        from 'react-relay';
import { commitMutation } from '../api';

const mutation = graphql`
    mutation ResendVerificationMutation($input: ResendVerificationInput!) {
        mutator {
            resendVerificationCode(input: $input) {
                viewer {
                    verified
                    approved
                    user {
                        ... on User {
                            email
                            id
                        }
                        ... on Recruiter {
                            email
                            id
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

const commit = (environment, email = undefined, userId = undefined) => {
    const variables = {
        input: { email, userId }
    };

    return commitMutation(environment, {
        mutation,
        variables,
        errorPath: 'mutator.resendVerificationCode.errors'
    });
};

export default { commit };
