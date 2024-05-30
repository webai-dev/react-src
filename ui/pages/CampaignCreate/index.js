import React, { PureComponent }     from 'react';
import PropTypes                    from 'prop-types';
import { generatePath, withRouter } from 'react-router-dom';
import { toast }                    from 'react-toastify';
import { CAMPAIGN_ID, ROUTES }      from '../../../constants';
import getErrorMessage              from '../../../util/getErrorMessage';
import CampaignCreateComponent      from './CampaignCreateComponent';
import {
    graphql,
    QueryRenderer,
}                                   from 'react-relay';
import {
    commitMutation,
    environment,
}                                   from '../../../api';
import ErrorComponent               from '../../components/ErrorComponent';
import LoaderComponent              from '../../components/LoaderComponent';
import Papa                         from 'papaparse';

const CAMPAIGN_CREATE_QUERY = graphql`
    query CampaignCreateViewQuery($id: ID!) {
        node(id: $id) {
            ...on NpsCampaign {
                id
                title
                type
                recipientType
                recipientStatus
                sendReminder
                slug
            }
        }
    }
`;

const mutation = graphql`
    mutation CampaignCreateMutation($input: NpsCampaignInput!) {
        mutator {
            response: saveNpsCampaign(input: $input) {
                newRecipients
                recipientsInvalidRecruiter
                recipientsDuplicated
                errors {
                    key,
                    value
                }
            }
        }
    }
`;

class CampaignCreateView extends PureComponent {
    state = {
        isLoading: false,
        errors: null,
        campaignType: null,
        recipientType: null,
        isReadingCsvFields: false,
        readingCsvFieldsError: null,
        csvColumns: null,
        file: null,
        csvWarnings: null,
    };

    /**
     * Will change campaignType and display different input options for different campaignType
     *
     * @param {string} campaignType
     */
    handleChangeCampaignType = (campaignType) => {
        setTimeout(() => {this.setState({ campaignType });}, 0);
    };
    /**
     * Will change recipientType and display different input options for different recipientType
     *
     * @param {string} recipientType
     */
    handleChangeRecipientType = (recipientType) => {
        this.setState({ recipientType });
    };

    /**
     * Will read csv file in order to get fields
     *
     * @param {File} file
     */
    handleReadCsvFile = (file) => {
        if (!file) {
            this.setState({ file, csvColumns: null });
            return;
        }
        this.setState({ isReadingCsvFields: true, csvColumns: null, readingCsvFieldsError: null });
        Papa.parse(file, {
            step: (row, parser) => {
                if (!row.data.every(label => !label)) {
                    const csvColumns = row.data.map((csvColumn, index) => ({ key: index, label: csvColumn }))
                        .filter(csvColumn => csvColumn.label);

                    this.setState({
                        csvColumns: csvColumns.length >= 4 ? csvColumns : null,
                        file,
                    });
                    parser.abort();
                }
            },
            complete: () => {
                const error = this.state.csvColumns ? null : 'We were unable to upload your file. Please try again' +
                    ' and ensure it’s in csv. format. Please check that your file contains at least 5 non empty columns.';
                this.setState({ isReadingCsvFields: false, readingCsvFieldsError: error });
            }
        });
    };

    /**
     * Commit send saveNpsCampaign mutation
     *
     * @param {Object} input - object from formsy
     */
    commitCreateCampaign = input => {
        return commitMutation(
            environment,
            {
                mutation,
                variables: { input },
            },
        );
    };

    /**
     * Will gather info from csv file using matchValues and use that info to send mutation create nps campaign
     *
     * @param input
     */
    handleSubmitCampaign = (input) => {
        const { matchValues } = input;
        const { file } = this.state;
        const items = [];
        let skippedHeader = false;

        this.setState({
            isLoading: true,
            errors: null
        });

        Papa.parse(file, {
            worker: true,
            step: (row) => {
                if (!row.data.every(label => !label) && skippedHeader) {
                    const item = {};
                    for (let key in matchValues) {
                        const columnIndex = matchValues[ key ];
                        item[ key ] = row.data[ columnIndex ];
                    }
                    items.push(item);
                } else if (!row.data.every(label => !label)) {
                    skippedHeader = true;
                }
            },
            error: (error) => {
                this.setState({
                    isLoading: false,
                    errors: error
                });
            },
            complete: () => {
                this.commitCreateCampaign({
                    title: input.title,
                    type: input.type,
                    recipientType: input.recipientType,
                    recipientStatus: input.recipientStatus,
                    sendReminder: input.sendReminder,
                    startDate: input.startDate,
                    endDate: input.endDate,
                    recipients: items,
                })
                    .then((response) => {
                        this.setState({ isLoading: false });
                        toast.success('Campaign was created successfully');
                        const csvWarnings = {
                            recipientsInvalidRecruiter: response?.mutator?.response?.recipientsInvalidRecruiter,
                            recipientsDuplicated: response?.mutator?.response?.recipientsDuplicated,
                            newRecipients: response?.mutator?.response?.newRecipients,
                        };
                        if (csvWarnings.recipientsInvalidRecruiter || csvWarnings.recipientsDuplicated) {
                            this.setState({ csvWarnings });
                        } else {
                            this.props.history.push(generatePath(ROUTES.CAMPAIGNS));
                        }
                    })
                    .catch((error) => {
                        const errorParsed = getErrorMessage(error);
                        toast.error(errorParsed.title);
                        this.setState({
                            isLoading: false,
                            errors: errorParsed.message,
                        });
                    });
            }
        });
    };

    /**
     * Will use generated link for link campaign to send mutation create nps campaign
     *
     * @param input
     */
    handleSubmitLink = (input) => {
        const { match: { params } } = this.props;
        const campaignId = params[ CAMPAIGN_ID ];

        this.commitCreateCampaign(input)
            .then(() => {
                this.setState({ isLoading: false });
                toast.success(campaignId ? 'Campaign was edited successfully' : 'Campaign was created successfully');
                this.props.history.push(generatePath(ROUTES.CAMPAIGNS));
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
            errors,
            isLoading,
            campaignType,
            recipientType,
            csvColumns,
            file,
            readingCsvFieldsError,
            csvWarnings,
        } = this.state;
        const {
            handleSubmitCampaign,
            handleSubmitLink,
            handleChangeCampaignType,
            handleReadCsvFile,
            handleChangeRecipientType,
        } = this;
        const { match: { params } } = this.props;
        const campaignId = params[ CAMPAIGN_ID ];
        return campaignId ? (
                <QueryRenderer
                    environment={ environment }
                    query={ CAMPAIGN_CREATE_QUERY }
                    variables={ { id: campaignId } }
                    render={ ({ error, props: data }) => {
                        const loading = !error && !data;

                        if (error) {
                            return <ErrorComponent error={ error } />;
                        }
                        if (loading) {
                            return <LoaderComponent row />;
                        }
                        const campaign = data.node;

                        return (
                            <CampaignCreateComponent
                                file={ file }
                                csvColumns={ csvColumns }
                                campaign={ campaign }
                                isLoading={ isLoading }
                                handleSubmitCampaign={ handleSubmitCampaign }
                                handleSubmitLink={ handleSubmitLink }
                                errors={ errors }
                                handleChangeCampaignType={ handleChangeCampaignType }
                                handleChangeRecipientType={ handleChangeRecipientType }
                                campaignType={ campaign.type }
                                recipientType={ recipientType || campaign.recipientType }
                                handleReadCsvFile={ handleReadCsvFile }
                                readingCsvFieldsError={ readingCsvFieldsError }
                                csvWarnings={ csvWarnings }
                            />
                        );
                    } }
                />
            ) :
            <CampaignCreateComponent
                file={ file }
                csvColumns={ csvColumns }
                isLoading={ isLoading }
                handleSubmitCampaign={ handleSubmitCampaign }
                handleSubmitLink={ handleSubmitLink }
                errors={ errors }
                handleChangeCampaignType={ handleChangeCampaignType }
                handleChangeRecipientType={ handleChangeRecipientType }
                campaignType={ campaignType }
                recipientType={ recipientType }
                handleReadCsvFile={ handleReadCsvFile }
                readingCsvFieldsError={ readingCsvFieldsError }
                csvWarnings={ csvWarnings }
            />;
    }
}

CampaignCreateView.propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(CampaignCreateView);
