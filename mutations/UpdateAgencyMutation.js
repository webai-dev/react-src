import { graphql }        from 'react-relay';
import { commitMutation } from '../api';

const mutation = graphql`
    mutation UpdateAgencyMutation($input: UpdateAgencyInput!) {
        mutator {
            updateAgency(input: $input) {
                viewer {
                    companyComplete
                    verified
                    approved
                    agencyComplete
                }
                errors {
                    key
                    value
                }
            }
        }
    }
`;

const commit = (environment, agency) => {
    const variables = {
        input: agency
    };

    return commitMutation(environment, {
        mutation,
        variables,
        errorPath: 'mutator.updateAgency.errors',
        uploadables: { photo: agency.photo }
    });
};

export default { commit };
