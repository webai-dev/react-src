import { graphql }        from 'react-relay';
import { commitMutation } from '../api';

const mutation = graphql`
    mutation SubmitCandidateMutation($input: SubmitCandidateInput!) {
        mutator {
            submitCandidate(input: $input) {
                application {
                    id
                    status
                    job {
                        id
                        myApplication {
                            id
                            status
                            applications {
                                id
                                status
                                files {
                                    id
                                    name
                                    url
                                }
                                candidate {
                                    id
                                    firstName
                                    lastName
                                    email
                                    workRights
                                    noticePeriod
                                    linkedinUrl
                                    salaryExpectations
                                    additionalInformation
                                }
                            }
                        }
                    }
                    recruiter {
                        id
                        agency {
                            name
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

const commit = (environment, job, candidate, files = []) => {
    const { id } = job;
    const variables = {
        input: { ...candidate, jobId: id }
    };

    return commitMutation(environment, {
        mutation,
        variables,
        uploadables: { files: (files || []).map(it => it.file) },
        errorPath: 'mutator.submitCandidate.errors'
    });
};

export default { commit };
