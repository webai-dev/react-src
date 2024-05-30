import React, { PureComponent }   from 'react';
import { toast }                  from 'react-toastify';
import getErrorMessage            from '../../../../util/getErrorMessage';
import ErrorComponent             from '../../../components/ErrorComponent';
import LoaderComponent            from '../../../components/LoaderComponent';
import EmailSettingsComponent     from './EmailSettingsComponent';
import { graphql, QueryRenderer } from 'react-relay';
import {
    commitMutation,
    environment,
}                                 from '../../../../api';

const EMAILS_QUERY = graphql`
    query EmailSettingsContainerQuery {
        viewer {
            employerTemplate: customNotificationTemplate(name: "placement-request-employer-review")
            candidateTemplate: customNotificationTemplate(name: "placement-request-candidate-review")
            defaultEmployerTemplate: customNotificationTemplate(name: "placement-request-employer-review", default: true)
            defaultCandidateTemplate: customNotificationTemplate(name: "placement-request-candidate-review", default: true)
            user {
                ...on Recruiter {
                    email
                }
            }
        }
    }
`;

const mutationSave = graphql`
    mutation EmailSettingsContainerSaveMutation($name: String!, $source: String, $reset: Boolean) {
        mutator {
            saveCustomTemplate(name: $name, source: $source, reset: $reset) {
                viewer {
                    customNotificationTemplate(name: $name)
                }
                errors {
                    key
                    value
                }
            }
        }
    }
`;

const mutationTest = graphql`
    mutation EmailSettingsContainerTestMutation($name: String!, $source: String!) {
        mutator {
            sendCustomTemplateTest(name: $name, source: $source) {
                viewer {
                    customNotificationTemplate(name: $name)
                }
                errors {
                    key
                    value
                }
            }
        }
    }
`;

class EmailSettingsContainer extends PureComponent {
    state = {
        isLoadingCandidate: false,
        errorsCandidate: null,
        isLoadingEmployer: false,
        errorsEmployer: null,
    };

    /**
     * Commit saveCapabilityStmt mutation
     *
     * @param {Object} input - represents GQL CapabilityStmtInput
     */
    commitStatementSave = input => {
        return commitMutation(
            environment,
            {
                mutation: mutationSave,
                variables: input,
            },
        );
    };

    /**
     * Commit testCapabilityStmt mutation
     *
     * @param {Object} input - represents GQL CapabilityStmtInput
     */
    commitStatementTest = input => {
        return commitMutation(
            environment,
            {
                mutation: mutationTest,
                variables: input,
            },
        );
    };

    /**
     * Handle template save logic
     *
     * @param {Object} input - object
     */
    handleSaveEmail = input => {
        const loadingKey = input.name === 'placement-request-employer-review' ? 'isLoadingEmployer' : 'isLoadingCandidate';
        this.setState({
            [ loadingKey ]: true,
            errorsEmployer: null,
        });

        this.commitStatementSave(input)
            .then(() => {
                this.setState({ [ loadingKey ]: false });

                toast.success('Your email settings has successfully been updated');
            })
            .catch((error) => {
                const errorParsed = getErrorMessage(error);
                toast.error(errorParsed.title);
                this.setState({
                    [ loadingKey ]: false,
                    errorsEmployer: errorParsed.message,
                });
            });
    };

    /**
     * Handle template test logic - will send email to creator using specified template
     *
     * @param {Object} input - object
     * @param {string} email
     */
    handleTestEmail = (input, email) => {
        const loadingKey = input.name === 'placement-request-employer-review' ? 'isLoadingEmployer' : 'isLoadingCandidate';
        this.setState({
            [ loadingKey ]: true,
            errorsEmployer: null,
        });
        this.commitStatementTest(input)
            .then(() => {
                this.setState({ [ loadingKey ]: false });

                toast.success(`Test email sent to ${email}`);
            })
            .catch((error) => {
                const errorParsed = getErrorMessage(error);
                toast.error(errorParsed.title);
                this.setState({
                    [ loadingKey ]: false,
                    errorsEmployer: errorParsed.message,
                });
            });
    };

    render() {
        const {
            handleSaveEmail,
            handleTestEmail,
        } = this;
        const {
            isLoadingCandidate,
            errorsCandidate,
            isLoadingEmployer,
            errorsEmployer,
        } = this.state;

        return (
            <QueryRenderer
                environment={ environment }
                query={ EMAILS_QUERY }
                render={ ({ error, props: data }) => {
                    const loading = !error && !data;

                    if (error) {
                        return <ErrorComponent error={ error } />;
                    }
                    if (loading) {
                        return <LoaderComponent row />;
                    }
                    const employerTemplate = data.viewer.employerTemplate;
                    const candidateTemplate = data.viewer.candidateTemplate;
                    const defaultCandidateTemplate = data.viewer.defaultCandidateTemplate;
                    const defaultEmployerTemplate = data.viewer.defaultEmployerTemplate;

                    return (
                        <EmailSettingsComponent
                            handleTestEmail={ handleTestEmail }
                            handleSaveEmail={ handleSaveEmail }
                            isLoadingCandidate={ isLoadingCandidate }
                            errorsCandidate={ errorsCandidate }
                            isLoadingEmployer={ isLoadingEmployer }
                            errorsEmployer={ errorsEmployer }
                            candidateTemplate={ candidateTemplate }
                            employerTemplate={ employerTemplate }
                            defaultEmployerTemplate={ defaultEmployerTemplate }
                            defaultCandidateTemplate={ defaultCandidateTemplate }
                            email={ data.viewer.user?.email }
                        />
                    );
                } }
            />
        );
    }
}

export default EmailSettingsContainer;
