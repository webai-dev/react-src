import { graphql }        from 'react-relay';
import { commitMutation } from '../api';

const mutation = graphql`
    mutation ToggleRecruiterFavouriteMutation($recruiterId: String!) {
        mutator {
            toggleFavourite(recruiterId: $recruiterId) {
                isFavourite
                id
                recruiter {
                    id
                    recruiterRelationship {
                        isFavourite
                    }
                }
            }
        }
    }
`;

const commit = (environment, recruiterId) => {
    const variables = {
        recruiterId
    };

    return commitMutation(environment, {
        mutation,
        variables,
        errorPath: 'mutator.toggleFavourite.errors'
    });
};

export default { commit };
