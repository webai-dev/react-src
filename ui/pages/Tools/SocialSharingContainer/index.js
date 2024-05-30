import React, { PureComponent }   from 'react';
import { toast }                  from 'react-toastify';
import getErrorMessage            from '../../../../util/getErrorMessage';
import getBase64                  from '../../../../util/getBase64';
import ErrorComponent             from '../../../components/ErrorComponent';
import LoaderComponent            from '../../../components/LoaderComponent';
import SocialSharingComponent     from './SocialSharingComponent';
import { graphql, QueryRenderer } from 'react-relay';
import {
    commitMutation,
    environment,
}                                 from '../../../../api';

const EMAILS_QUERY = graphql`
    query SocialSharingContainerQuery {
        viewer {
            user {
                ...on Recruiter {
                    firstName
                    lastName
                    rating {
                        overallRating
                        reviewsCount
                    }
                    backgroundColor
                    backgroundImage {
                        url
                    }
                }
            }
            reviewTemplates {
                id
                backgroundImage {
                    url
                }
                backgroundColor
                textColor
                textAlign
            }
        }
    }
`;

const mutationSave = graphql`
    mutation SocialSharingContainerSaveMutation($input: ReviewTemplateInput!) {
        mutator {
            saveReviewTemplate(input: $input) {
                viewer {
                    reviewTemplates {
                        id
                        backgroundImage {
                            url
                        }
                        backgroundColor
                        textColor
                        textAlign
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

class SocialSharingContainer extends PureComponent {
    state = {
        isLoading: false,
        errors: null,
        form: {},
    };

    /**
     * Commit saveCapabilityStmt mutation
     *
     * @param {Object} input - represents GQL CapabilityStmtInput
     */
    commitStatementSave = input => {
        const { backgroundImage, ...restInput } = input;
        const uploadables = {};
        if (backgroundImage instanceof File) {
            uploadables.uploadedBackgroundImage = backgroundImage;
        }
        return commitMutation(
            environment,
            {
                mutation: mutationSave,
                uploadables,
                variables: { input: restInput },
            },
        );
    };

    /**
     * Handle social share settings save and corresponding app logic
     *
     * @param {Object} input - object
     */
    handleSave = input => {
        this.setState({
            isLoading: true,
            errors: null,
        });

        this.commitStatementSave(input)
            .then(() => {
                this.setState({ isLoading: false });

                toast.success('Your social share template has been updated');
            })
            .catch((error) => {
                const errorParsed = getErrorMessage(error);
                toast.error(errorParsed.title);
                this.setState({
                    isLoading: false,
                    errors: errorParsed.message,
                });
            });
    };

    /**
     * Save form so it can be used to show custom review image
     *
     * @param {Object} form
     */
    handleSaveForm = (form) => {
        if (form.backgroundImage instanceof File) {
            getBase64(form.backgroundImage)
                .then(result => {
                    this.setState({ form: { ...form, backgroundImage: result } });
                });
        } else {
            this.setState({ form });
        }
    };

    render() {
        const {
            handleSave,
            handleSaveForm,
        } = this;
        const {
            isLoading,
            errors,
            form,
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
                    const reviewTemplate = (data.viewer.reviewTemplates && data.viewer.reviewTemplates[ 0 ]) || {};
                    const recruiter = data.viewer.user;

                    return (
                        <SocialSharingComponent
                            handleReset={ () => {} }
                            handleSave={ handleSave }
                            isLoading={ isLoading }
                            errors={ errors }
                            handleSaveForm={ handleSaveForm }
                            form={ form }
                            reviewTemplate={ reviewTemplate }
                            recruiter={ recruiter }
                        />
                    );
                } }
            />
        );
    }
}

export default SocialSharingContainer;
