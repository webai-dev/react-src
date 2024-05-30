import React, { PureComponent }   from 'react';
import { toast }                  from 'react-toastify';
import { INTEGRATIONS }           from '../../../../constants';
import getErrorMessage            from '../../../../util/getErrorMessage';
import getBase64                  from '../../../../util/getBase64';
import ErrorComponent             from '../../../components/ErrorComponent';
import LoaderComponent            from '../../../components/LoaderComponent';
import CampaignSettingsComponent  from './CampaignSettingsComponent';
import { graphql, QueryRenderer } from 'react-relay';
import {
    commitMutation,
    environment,
}                                 from '../../../../api';

const CAMPAIGN_QUERY = graphql`
    query CampaignSettingsContainerQuery {
        viewer {
            recruiter: user {
                ...on Recruiter {
                    integrations
                    agency {
                        integrations
                    }
                }
            }
            npsCampaignSettings {
                buttonColor
                campaignQuestion
                lessScaleLabel
                veryScaleLabel
                promoterGoogleReview
                promoterMessage
                passiveGoogleReview
                passiveMessage
                detractorMessage
                emailFromName
                emailSubject
                emailFooter
                logoImage {
                    url
                }
            }
        }
    }
`;

const mutation = graphql`
    mutation CampaignSettingsContainerMutation($input: NpsCampaignSettingsInput!) {
        mutator {
            saveNpsCampaignSettings(input: $input) {
                viewer {
                    npsCampaignSettings {
                        buttonColor
                        campaignQuestion
                        lessScaleLabel
                        veryScaleLabel
                        promoterGoogleReview
                        promoterMessage
                        passiveGoogleReview
                        passiveMessage
                        detractorMessage
                        emailFromName
                        emailSubject
                        emailFooter
                        logoImage {
                            url
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

class CampaignSettingsContainer extends PureComponent {
    state = {
        isLoading: false,
        errors: null,
        form: null,
    };

    /**
     * Commit saveNpsCampaignSettings mutation
     *
     * @param {Object} input - represents GQL CapabilityStmtInput
     */
    commitCampaignSettingsSave = input => {
        const { logoImage, ...restInput } = input;
        const uploadables = {};
        if (logoImage instanceof File) {
            uploadables.uploadLogoImage = logoImage;
        }
        return commitMutation(
            environment,
            {
                mutation,
                uploadables,
                variables: { input: restInput },
            },
        );
    };

    /**
     * Handle campaign settings save and corresponding app logic
     *
     * @param {Object} input - object
     */
    handleSave = input => {
        this.setState({
            isLoading: true,
            errors: null,
        });

        this.commitCampaignSettingsSave(input)
            .then(() => {
                this.setState({ isLoading: false });

                toast.success('Your campaign settings has been updated');
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
        if (form.logoImage instanceof File) {
            getBase64(form.logoImage)
                .then(result => {
                    this.setState({ form: { ...form, logoImage: { url: result } } });
                });
        } else {
            this.setState({ form: { ...form, logoImage: { url: form.logoImage } } });
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
                query={ CAMPAIGN_QUERY }
                render={ ({ error, props: data }) => {
                    const loading = !error && !data;

                    if (error) {
                        return <ErrorComponent error={ error } />;
                    }
                    if (loading) {
                        return <LoaderComponent row />;
                    }
                    const npsCampaignSettings = data.viewer.npsCampaignSettings;
                    const integrations = (data.viewer.recruiter.agency || data.viewer.recruiter).integrations;

                    return (
                        <CampaignSettingsComponent
                            handleSave={ handleSave }
                            isLoading={ isLoading }
                            errors={ errors }
                            handleSaveForm={ handleSaveForm }
                            form={ form }
                            npsCampaignSettings={ npsCampaignSettings || {} }
                            isGoogleIntegrated={ integrations.includes(INTEGRATIONS.GOOGLE) }
                        />
                    );
                } }
            />
        );
    }
}

export default CampaignSettingsContainer;
