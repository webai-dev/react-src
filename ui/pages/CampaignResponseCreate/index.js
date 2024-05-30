import React, { PureComponent }                                                       from 'react';
import { toast }                                                                      from 'react-toastify';
import { withRouter, generatePath }                                                   from 'react-router-dom';
import PropTypes                                                                      from 'prop-types';
import { CAMPAIGN_ID, LOCAL_STORAGE_KEYS, PARAM_GOOGLE_REVIEW, RECIPIENT_ID, ROUTES } from '../../../constants';
import getErrorMessage
                                                                                      from '../../../util/getErrorMessage';
import ErrorComponent
                                                                                      from '../../components/ErrorComponent';
import LoaderComponent
                                                                                      from '../../components/LoaderComponent';
import CampaignLinkComponent
                                                                                      from '../../components/CampaignLinkComponent';
import localStorageInstance       from '../../../util/LocalStorage';
import getQueryParams
                                  from '../../../util/getQueryParams';
import { graphql, QueryRenderer } from 'react-relay';
import {
    commitMutation,
    environment,
}                                 from '../../../api';

const CAMPAIGN_QUERY = graphql`
    query CampaignResponseCreateQuery($id: ID!, $slug: String!) {
        node(id: $id) {
            ... on NpsCampaign {
                id
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
        sluggable(slug: $slug, type:  "NpsCampaign") {
            ... on NpsCampaign {
                id
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
    }
`;

const mutation = graphql`
    mutation CampaignResponseCreateMutation($input: NpsCampaignResponse!) {
        mutator {
            saveNpsResponse(input: $input) {
                recipient {
                    id
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
     * @param {Object} input - represents GQL NpsCampaignResponse
     */
    commitSaveResponse = input => {
        return commitMutation(
            environment,
            {
                mutation,
                variables: { input },
            },
        );
    };

    /**
     * Handle send saveNpsResponse and corresponding app logic
     *
     * @param {boolean} promoterGoogleReview
     * @param {boolean} passiveGoogleReview
     * @param {Object} input - object
     */
    handleSaveResponse = ({ promoterGoogleReview, passiveGoogleReview, ...input }) => {
        this.setState({
            isLoading: true,
            errors: null,
        });

        const campaignId = this.props.match.params[ CAMPAIGN_ID ];
        const campaignKey = `${ LOCAL_STORAGE_KEYS.SEND_NPS_CAMPAIGN_RESPONSE }-${ campaignId }`;
        const existedRecipientId = localStorageInstance.getItem(
            campaignKey,
        );
        const isShowGoogleReviewLink =
            (input.score >= 9 && promoterGoogleReview) ||
            (input.score >= 7 && input.score < 9 && passiveGoogleReview);

        this.commitSaveResponse(existedRecipientId ? { ...input, recipientId: existedRecipientId } : input)
            .then((data) => {
                const recipientId = data?.mutator?.saveNpsResponse?.recipient?.id;
                if (!existedRecipientId) {
                    this.setState({ isLoading: false });
                    localStorageInstance.setItem(
                        campaignKey,
                        recipientId,
                        60 * 24 * 30
                    );
                }

                if (isShowGoogleReviewLink) {
                    const reviewText = document.getElementById(CampaignLinkComponent.IDS.COMMENT);
                    reviewText.focus();
                    reviewText.select();
                    document.execCommand('copy');
                    reviewText.blur();
                    toast.success('Your response has been sent and copied to clipboard');
                } else {
                    toast.success('Your response has been sent');
                }
                this.props.history.push(generatePath(ROUTES.CAMPAIGNS_RESPONSE_SUCCESS, {
                    [ RECIPIENT_ID ]: recipientId,
                    [ PARAM_GOOGLE_REVIEW ]: isShowGoogleReviewLink,
                }));
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

    render() {
        const {
            handleSaveResponse
        } = this;
        const {
            isLoading,
            errors,
        } = this.state;

        const { match: { params } } = this.props;
        const campaignSlugOrId = params[ CAMPAIGN_ID ];
        const recipientId = params[ RECIPIENT_ID ];
        const queryParams = getQueryParams(this.props.location.search);
        const score = +queryParams?.score;

        return (
            <QueryRenderer
                environment={ environment }
                query={ CAMPAIGN_QUERY }
                variables={ { id: campaignSlugOrId, slug: campaignSlugOrId } }
                render={ ({ error, props: data }) => {
                    const loading = !error && !data;

                    if (error) {
                        return <ErrorComponent error={ error } />;
                    }
                    if (loading) {
                        return <LoaderComponent row />;
                    }
                    const npsCampaignSettings = data.node?.npsCampaignSettings || data.sluggable?.npsCampaignSettings;
                    const campaignId = data.node?.id || data.sluggable?.id;

                    return (
                        <CampaignLinkComponent
                            errors={ errors }
                            isLoading={ isLoading }
                            pageParams={ npsCampaignSettings || {} }
                            recipientId={ recipientId }
                            campaignId={ campaignId }
                            handleSaveResponse={ handleSaveResponse }
                            score={ score }
                        />
                    );
                } }
            />
        );
    }
}

CampaignSettingsContainer.propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
};

export default withRouter(CampaignSettingsContainer);
