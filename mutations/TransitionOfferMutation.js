import { graphql }        from 'react-relay';
import { commitMutation } from '../api';
const mutation = graphql`
    mutation TransitionOfferMutation($input: TransitionOfferInput!) {
        mutator {
            transitionOffer(input: $input) {
                offer {
                    id
                    status
                    jobApplication {
                        id
                        status
                        job {
                            id
                            status
                        }
                        offers {
                            status
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

const commit = (environment, application, transition) => {
    const { id } = application;
    const variables = {
        input: { transition, offerId: id }
    };

    return commitMutation(environment, {
        mutation,
        variables,
        errorPath: 'mutator.transitionOffer.errors'
    });
};

export default { commit };
