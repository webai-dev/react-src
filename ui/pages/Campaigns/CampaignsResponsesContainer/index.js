import React, { PureComponent }    from 'react';
import PropTypes                   from 'prop-types';
import { withRouter }              from 'react-router-dom';
import CampaignsResponsesComponent from './CampaignsResponsesComponent';
import {
    CAMPAIGN_RESPONSE_TYPE,
    CAMPAIGN_SCORES_TYPE,
    CAMPAIGN_ID,
}                                  from '../../../../constants';
import getQueryParams              from '../../../../util/getQueryParams';
import getQueryString              from '../../../../util/getQueryString';

class CampaignsResponsesContainer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleSelectFilter = (key, value) => {
        const queryParams = getQueryParams(location.search);

        this.props.history.push(`${
            this.props.location.pathname }${
            getQueryString({ ...queryParams, [ key ]: value }) }`
        );
    };

    render() {
        const { handleSelectFilter } = this;
        const { location, campaigns } = this.props;
        let responses = this.props.responses;

        const queryParams = getQueryParams(location.search);
        const selectedCampaignId = queryParams[ CAMPAIGN_ID ];
        const selectedScores = queryParams[ CAMPAIGN_SCORES_TYPE._NAME ];
        const selectedType = queryParams[ CAMPAIGN_RESPONSE_TYPE._NAME ];
        if (selectedCampaignId) {
            responses = responses.filter(response => response.campaignId === selectedCampaignId);
        }
        if (selectedScores && selectedScores !== CAMPAIGN_SCORES_TYPE.ALL) {
            responses = responses.filter(response => selectedScores === CAMPAIGN_SCORES_TYPE.PROMOTER ? response.score >= 9 :
                selectedScores === CAMPAIGN_SCORES_TYPE.PASSIVE ? (response.score < 9 && response.score >= 7) :
                    selectedScores === CAMPAIGN_SCORES_TYPE.DETRACTOR ? response.score < 7 : true
            );
        }
        if (selectedType && selectedType !== CAMPAIGN_RESPONSE_TYPE.ALL) {
            responses = responses.filter(
                response => selectedType === CAMPAIGN_RESPONSE_TYPE.EMPLOYER ?
                    (response.userType === 'employer') : !(response.userType === 'employer')
            );
        }

        return (
            <CampaignsResponsesComponent
                handleSelectFilter={ handleSelectFilter }
                responses={ responses }
                selectedCampaignId={ selectedCampaignId }
                selectedScores={ selectedScores }
                selectedType={ selectedType }
                campaigns={ campaigns }
            />
        );
    }
}

CampaignsResponsesContainer.propTypes = {
    responses: PropTypes.arrayOf(PropTypes.object),
    campaigns: PropTypes.arrayOf(PropTypes.object),
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(CampaignsResponsesContainer);
