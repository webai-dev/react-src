import { graphql }        from 'react-relay';
import { commitMutation } from '../api';

const mutation = graphql`
    mutation UpdateCompanyMutation($input: UpdateCompanyInput!) {
        mutator {
            updateCompany(input: $input) {
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

const commit = (environment, company) => {
    const variables = {
        input: company
    };
    return commitMutation(environment, {
        mutation,
        variables,
        errorPath: 'mutator.updateCompany.errors',
        uploadables: { photo: company.photo }
    });
};

export default { commit };
