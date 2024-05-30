import { graphql }        from 'react-relay';
import { commitMutation } from '../api';

const mutation = graphql`
    mutation OfferJobMutation($input: OfferJobInput!) {
        mutator {
            offerJob(input: $input) {
                offer {
                    id
                    jobApplication {
                        id
                        candidate {
                            id
                        }
                        job {
                            id
                        }
                        recruiter {
                            id
                        }
                    }
                    term
                    salary
                    startDate
                    status
                }
                errors {
                    key
                    value
                }
            }
        }
    }
`;

const commit = (environment, application, input) => {
    const { id } = application;
    const variables = {
        input: { ...input, applicationId: id }
    };

    return commitMutation(environment, {
        mutation,
        variables,
        errorPath: 'mutator.offerJob.errors'
    });
};

export default { commit };
