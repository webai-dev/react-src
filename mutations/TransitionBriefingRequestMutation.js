import { graphql }        from 'react-relay';
import { commitMutation } from '../api';

const mutation = graphql`
    mutation TransitionBriefingRequestMutation($input: TransitionBriefingRequestInput!) {
        mutator {
            transitionBriefing(input: $input) {
                briefingRequest {
                    status
                    id
                }
                errors {
                    key
                    value
                }
            }
        }
    }
`;

const commit = (environment, briefing, transition) => {
    const variables = {
        input: {
            transition,
            id: briefing.id
        }
    };

    return commitMutation(environment, {
        mutation,
        variables,
        errorPath: 'mutator.transitionBriefing.errors'
    });
};

export default { commit };
