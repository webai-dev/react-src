import { graphql }        from 'react-relay';
import { commitMutation } from '../api';

const mutation = graphql`
    mutation SubmitRatingMutation($input: RecruiterRatingInput!) {
        mutator {
            rateRecruiter(input: $input) {
                success
                errors {
                    key
                    value
                }
            }
        }
    }
`;

const commit = (environment, application, ratings, review) => {
    const variables = {
        input: { applicationId: application.id, ...ratings, review }
    };

    return commitMutation(environment, {
        mutation,
        variables,
        errorPath: 'mutator.rateRecruiter.errors'
    });
};

export default { commit };
