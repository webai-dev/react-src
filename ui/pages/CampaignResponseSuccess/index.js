import React, { PureComponent }              from 'react';
import ErrorComponent                        from '../../components/ErrorComponent';
import LoaderComponent                       from '../../components/LoaderComponent';
import PropTypes                             from 'prop-types';
import { graphql, QueryRenderer }            from 'react-relay';
import { environment }                       from '../../../api';
import { withRouter }                        from 'react-router-dom';
import CampaignResponseSuccessComponent      from './CampaignResponseSuccessComponent';
import { RECIPIENT_ID, PARAM_GOOGLE_REVIEW } from '../../../constants';
import getNpsType                            from '../../../util/getNpsType';

const CAMPAIGN_QUERY = graphql`
    query CampaignResponseSuccessContainerQuery($id: ID!) {
        node(id: $id) {
            ... on NpsCampaignRecipient {
                id
                npsScore {
                    score
                }
                npsCampaign {
                    id
                    agency {
                        name
                        googleLocations {
                            locationKey {
                                placeId
                            }
                        }
                    }
                    npsCampaignSettings {
                        promoterMessage
                        passiveMessage
                        detractorMessage
                    }
                }
            }

        }
    }
`;

class CampaignResponseSuccessContainer extends PureComponent {
    render() {
        const { match: { params } } = this.props;
        const recipientId = params[ RECIPIENT_ID ];
        const isGoogleReview = params[ PARAM_GOOGLE_REVIEW ] === 'true';

        return (
            <QueryRenderer
                environment={ environment }
                query={ CAMPAIGN_QUERY }
                variables={ { id: recipientId } }
                render={ ({ error, props: data }) => {
                    const isPageLoading = !error && !data;
                    if (error) {
                        return <ErrorComponent error={ error } />;
                    }
                    if (isPageLoading) {
                        return <LoaderComponent row />;
                    }

                    if (!data.node) {
                        return (
                            <span>
                                Such campaign doesn&apos;t exist
                            </span>
                        );
                    }

                    const googleLocations = data.node.npsCampaign?.agency?.googleLocations;
                    const agencyName = data.node.npsCampaign?.agency?.name;
                    const googlePlaceId = (googleLocations || [])[ 0 ]?.locationKey.placeId;
                    const linkToGoogleReview = (isGoogleReview && googlePlaceId) ?
                        `https://search.google.com/local/writereview?placeid=${ googlePlaceId }` :
                        null;

                    const message =
                        getNpsType(
                            data.node.npsScore.score,
                            data.node.npsCampaign?.npsCampaignSettings?.promoterMessage,
                            data.node.npsCampaign?.npsCampaignSettings?.passiveMessage,
                            data.node.npsCampaign?.npsCampaignSettings?.detractorMessage,
                        );

                    return (
                        <CampaignResponseSuccessComponent
                            linkToGoogleReview={ linkToGoogleReview }
                            agencyName={ agencyName }
                            message={ message }
                        />
                    );
                } }
            />
        );
    }
}

CampaignResponseSuccessContainer.propTypes = {
    location: PropTypes.object,
    match: PropTypes.object,
};

export default withRouter(CampaignResponseSuccessContainer);
