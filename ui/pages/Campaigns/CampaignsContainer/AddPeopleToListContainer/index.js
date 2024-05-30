import Papa                     from 'papaparse';
import PropTypes                from 'prop-types';
import React, { PureComponent } from 'react';
import { toast }                from 'react-toastify';
import getErrorMessage          from '../../../../../util/getErrorMessage';
import AddPeopleToListComponent from './AddPeopleToListComponent';
import {
    graphql,
}                               from 'react-relay';
import {
    commitMutation,
    environment,
}                               from '../../../../../api';

const mutation = graphql`
    mutation AddPeopleToListContainerMutation($input: NpsCampaignInput!) {
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

class AddPeopleToListContainer extends PureComponent {
    state = {
        showModal: false,
        isLoading: true,
        errors: null,
        isReadingCsvFields: false,
        readingCsvFieldsError: null,
        csvColumns: null,
        file: null,
        csvWarnings: null,
    };
    /**
     * Will open modal to send email
     */
    handleOpenModal = () => {
        this.setState({ showModal: true });
    };
    /**
     * Will close modal to send email
     */
    handleCloseModal = () => {
        this.setState({ showModal: false });
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
                        csvColumns: csvColumns.length >= 5 ? csvColumns : null,
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
     * Commit send saveNpsCampaign mutation in order to add recipients to campaign
     *
     * @param {Object} input - object from formsy
     */
    commitAddToCampaign = input => {
        return commitMutation(
            environment,
            {
                mutation,
                variables: { input },
            },
        );
    };

    /**
     * Will gather info from csv file using matchValues and use that info to send mutation add people to nps campaign
     *
     * @param input
     */
    handleSubmit = input => {
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

                this.commitAddToCampaign({
                    id: input.id,
                    sendReminder: input.sendReminder,
                    startDate: input.startDate,
                    endDate: input.endDate,
                    recipients: items,
                })
                    .then(response => {
                        this.setState({ isLoading: false });
                        toast.success('Recipients were added successfully');
                        const csvWarnings = {
                            recipientsInvalidRecruiter: response?.mutator?.response?.recipientsInvalidRecruiter,
                            recipientsDuplicated: response?.mutator?.response?.recipientsDuplicated,
                            newRecipients: response?.mutator?.response?.newRecipients,
                        };
                        if (csvWarnings.recipientsInvalidRecruiter || csvWarnings.recipientsDuplicated) {
                            this.setState({ csvWarnings });
                        } else {
                            this.handleCloseModal();
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

    render() {
        const { handleOpenModal, handleCloseModal, handleSubmit, handleReadCsvFile } = this;
        const { showModal, csvColumns, file, readingCsvFieldsError, csvWarnings } = this.state;
        const { isLoading, campaignId } = this.props;
        return (
            <AddPeopleToListComponent
                isLoading={ isLoading }
                showModal={ showModal }
                handleCloseModal={ handleCloseModal }
                handleOpenModal={ handleOpenModal }
                handleSubmit={ handleSubmit }
                file={ file }
                csvColumns={ csvColumns }
                handleReadCsvFile={ handleReadCsvFile }
                readingCsvFieldsError={ readingCsvFieldsError }
                campaignId={ campaignId }
                csvWarnings={ csvWarnings }
            />
        );
    }
}

AddPeopleToListContainer.propTypes = {
    isLoading: PropTypes.bool,
    campaignId: PropTypes.string.isRequired,
};

export default AddPeopleToListContainer;
