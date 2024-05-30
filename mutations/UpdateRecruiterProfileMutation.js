import { graphql }        from 'react-relay';
import { commitMutation } from '../api';

const mutation = graphql`
    mutation UpdateRecruiterProfileMutation($input: UpdateRecruiterProfileInput!) {
        mutator {
            updateRecruiterProfile(input: $input) {
                viewer {
                    profileComplete
                    companyComplete
                    agencyComplete
                    verified
                    approved
                    user {
                        ... on Recruiter {
                            profilePhoto {
                                url
                            }
                            backgroundImage { 
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
    const { profilePhoto, backgroundImage, ...userInput } = user;
    const variables = {
        input: userInput
    };
    let uploadables = {};
    if (profilePhoto instanceof File) {
        uploadables.profilePhoto = profilePhoto;
    }
    if (backgroundImage instanceof File) {
        uploadables.backgroundImage = backgroundImage;
    }

    return commitMutation(environment, {
        mutation,
        variables,
        errorPath: 'mutator.updateRecruiterProfile.errors',
        uploadables
    });
};

export default { commit };

