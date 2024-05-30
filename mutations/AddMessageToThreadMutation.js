import { graphql }        from 'react-relay';
import { commitMutation } from '../api';

const mutation = graphql`
    mutation AddMessageToThreadMutation($threadId: ID!, $content: String!) {
        mutator {
            addMessageToThread(threadId: $threadId, content: $content) {
                id
                participants {
                    ... on User {
                        id
                        firstName
                        lastName
                        company {
                            name
                        }
                    }
                    ... on Recruiter {
                        id
                        firstName
                        lastName
                        agency {
                            id
                            name
                            agencyRelationship {
                                id
                                isPsa
                            }
                        }
                        recruiterRelationship {
                            id
                            isFavourite
                        }
                    }
                }
                messages {
                    id
                    content
                    postedBy {
                        ... on Recruiter {
                            id
                            firstName
                            lastName
                            agency {
                                id
                                agencyRelationship {
                                    id
                                    isPsa
                                }
                            }
                            recruiterRelationship {
                                id
                                isFavourite
                            }
                        }
                        ... on User {
                            id
                            firstName
                            lastName
                        }
                    }
                }
            }
        }
    }
`;

const commit = (environment, threadId, message) => {
    const variables = {
        threadId: threadId,
        ...message
    };

    return commitMutation(environment, {
        mutation,
        variables,
        errorPath: 'mutator.addMessageToThread.errors'
    });
};

export default { commit };
