import { graphql }        from 'react-relay';
import { commitMutation } from '../api';

const mutation = graphql`
    mutation MarkNotificationSeenMutation($notificationId: String!) {
        mutator {
            markNotificationSeen(notificationId: $notificationId) {
                id
                seen
            }
        }
    }
`;

const commit = (environment, notificationId) => {
    const variables = {
        notificationId: notificationId
    };

    return commitMutation(environment, {
        mutation,
        variables,
        errorPath: 'mutator.markNotificationSeen.errors'
    });
};

export default { commit };
