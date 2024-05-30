import React, { PureComponent }        from 'react';
import PropTypes                       from 'prop-types';
import { graphql }                     from 'react-relay';
import { withRouter }                  from 'react-router-dom';
import { toast }                       from 'react-toastify';
import { commitMutation, environment } from '../../../../api';
import getErrorMessage                 from '../../../../util/getErrorMessage';
import CampaignsComponent              from './CampaignsComponent';
import { CAMPAIGN_QUERY_TYPE }         from '../../../../constants';
import getQueryParams                  from '../../../../util/getQueryParams';
import getQueryString                  from '../../../../util/getQueryString';

const mutationDelete = graphql`
    mutation CampaignsContainerDeleteMutation($ids: [ID!]!) {
        mutator {
            response: deleteNpsCampaigns(ids: $ids) {
                viewer {
                    npsCampaigns {
                        id
                    }
                },
                errors {
                    key,
                    value
                }
            }
        }
    }
`;

const mutationPauseResume = graphql`
    mutation CampaignsContainerPauseResumeMutation($input: NpsCampaignInput!) {
        mutator {
            response: saveNpsCampaign(input: $input) {
                viewer {
                    npsCampaigns {
                        id
                        active
                    }
                }
                errors {
                    key,
                    value
                }
            }
        }
    }
`;


class CampaignsContainer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            errors: null,
            selectedCampaigns: [],
            action: null,
        };
    }

    /**
     *
     * @param {string} action - key value from <SelectComponent>
     */
    handleSelectGroupAction = (action) => {
        this.setState({ action });
    };

    handleGroupAction = (action, campaignIds) => {
        if (action === CampaignsComponent.DELETE_ACTION.key) {
            this.handleDelete(campaignIds);
        }
        this.setState({ selectedCampaigns: [] });
    };

    /**
     * Add or remove campaignId from selected campaigns.
     *
     * @param {string} campaignId
     */
    handleSelectCampaigns = (campaignId) => {
        const selectedCampaigns = this.state.selectedCampaigns || [];
        if (!campaignId) {
            this.setState({
                selectedCampaigns: null,
            });
        } else if (selectedCampaigns.includes(campaignId)) {
            this.setState({
                selectedCampaigns: selectedCampaigns.filter(id => id !== campaignId),
            });
        } else {
            this.setState({
                selectedCampaigns: [ ...selectedCampaigns, campaignId ],
            });
        }
    };

    /**
     * Select active / inActive / all campaigns
     *
     * @param value
     */
    handleSelectCampaignType = (value) => {
        this.props.history.push(`${
            this.props.location.pathname }${
            getQueryString({ [ CAMPAIGN_QUERY_TYPE._NAME ]: value })
            }`);
    };


    /**
     * Commit deleteNpsCampaigns mutation
     *
     * @param {Array} ids - array of campaign ids
     */
    commitDeleteCampaign = ids => {
        return commitMutation(
            environment,
            {
                mutation: mutationDelete,
                variables: { ids },
            },
        );
    };

    /**
     * Handle send deleteNpsCampaigns and loading and error state
     *
     * @param {Array} ids - array of campaign ids
     */
    handleDelete = ids => {
        this.setState({
            isLoading: true,
            errors: null,
        });
        this.commitDeleteCampaign(ids)
            .then(() => {
                this.setState({ isLoading: false });
                toast.success('Campaign was deleted successfully');
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
     *  Commit saveNpsCampaign in order to change active flag
     *
     * @param {Object} input - Object for saveNpsCampaign mutation
     */

    commitPauseStartCampaign = input => {
        return commitMutation(
            environment,
            {
                mutation: mutationPauseResume,
                variables: { input },
            },
        );
    };

    /**
     * Handle send deleteNpsCampaigns and loading and error state
     *
     * @param {string} id
     * @param {boolean} active
     */
    handlePauseStart = (id, active) => {
        this.setState({
            isLoading: true,
            errors: null,
        });
        this.commitPauseStartCampaign({ id, active })
            .then(() => {
                this.setState({ isLoading: false });
                toast.success(`Campaign was ${ active ? 'resumed' : 'paused' } successfully`);
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
            handleSelectCampaignType,
            handleDelete,
            handleSelectCampaigns,
            handlePauseStart,
            handleSelectGroupAction,
            handleGroupAction,
        } = this;
        const { isLoading, selectedCampaigns, action } = this.state;
        const { campaigns, location, history } = this.props;

        const queryParams = getQueryParams(location.search);
        const campaignType = queryParams[ CAMPAIGN_QUERY_TYPE._NAME ];

        return (
            <CampaignsComponent
                selectedCampaigns={ selectedCampaigns }
                handleSelectCampaigns={ handleSelectCampaigns }
                handleDelete={ handleDelete }
                handleSelectCampaignType={ handleSelectCampaignType }
                handlePauseStart={ handlePauseStart }
                campaignType={ campaignType }
                campaigns={
                    (campaignType === CAMPAIGN_QUERY_TYPE.ALL || !campaignType) ?
                        campaigns :
                        campaigns.filter(
                            campaign => campaignType === CAMPAIGN_QUERY_TYPE.ACTIVE ?
                                campaign.active :
                                campaignType === CAMPAIGN_QUERY_TYPE.IN_ACTIVE ?
                                    !campaign.active : null
                        )
                }
                isNoCampaigns={ (!campaigns || !campaigns.length) }
                isLoading={ isLoading }
                handleGroupAction={ handleGroupAction }
                handleSelectGroupAction={ handleSelectGroupAction }
                action={ action }
                handleEdit={ history.push }
            />
        );
    }
}

CampaignsContainer.propTypes = {
    campaigns: PropTypes.arrayOf(PropTypes.object),
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(CampaignsContainer);
