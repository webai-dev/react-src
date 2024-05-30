import { graphql }        from 'react-relay';
import { commitMutation } from '../api';

const mutation = graphql`
    mutation UpdateUserProfileMutation($input: UpdateUserProfileInput!) {
        mutator {
            updateUserProfile(input: $input) {
                viewer {
                    profileComplete
                    companyComplete
                    approved
                    verified
                    agencyComplete
                    user {
                        ... on User {
                            profilePhoto {
                                url
                            }
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

const commit = (environment, user) => {
    const { profilePhoto, ...userInput } = user;
    const variables = {
        input: userInput
    };
    let uploadables = {};
    if (profilePhoto instanceof File) {
        uploadables.profilePhoto = profilePhoto;
    }

    return commitMutation(environment, {
        mutation,
        variables,
        errorPath: 'mutator.updateUserProfile.errors',
        uploadables
    });
};

export default { commit };
