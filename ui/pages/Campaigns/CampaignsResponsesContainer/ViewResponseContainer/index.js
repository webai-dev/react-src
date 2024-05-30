import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import getErrorMessage          from '../../../../../util/getErrorMessage';
import ViewResponseComponent    from './ViewResponseComponent';
import { toast }                from 'react-toastify';
import {
    graphql, QueryRenderer,
}                               from 'react-relay';
import {
    commitMutation,
    environment,
}                               from '../../../../../api';

const RESPONSE_QUERY = graphql`
    query ViewResponseContainerQuery($id: ID!) {
        node(id: $id) {
            ... on NpsScore {
                id
                score
                userType
                comment
                replySubject
                replyMessage
                npsCampaignRecipient {
                    email
                    firstName
                    lastName
                    npsCampaign {
                        id
                        title
                        recipientType
                        recipientStatus
                    }
                    recruiter {
                        firstName
                        lastName
                    }
                    jobCategory {
                        name
                    }
                    npsSurveyActivities {
                        event
                        createdAt
                    }
                }
                review {
                    firstName
                    lastName
                    recruiter {
                        firstName
                        lastName
                    }
                    placement {
                        category {
                            name
                        }
                    }
                }
            }
        }
    }
`;

const mutation = graphql`
    mutation ViewResponseContainerMutation($input: NpsReply!) {
        mutator {
            response: replyNps(input: $input) {
                errors {
                    key,
                    value
                }
            }
        }
    }
`;


class ViewResponseContainer extends PureComponent {
    state = {
        showModal: false,
        isLoading: true,
        errors: null,
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
     * Commit send replyNps mutation
     *
     * @param {Object} input - object from formsy
     */
    commitSendReminder = input => {
        return commitMutation(
            environment,
            {
                mutation,
                variables: { input },
            },
        );
    };

    /**
     * Handle send replyNps and loading and error state
     *
     * @param {Object} input - object from formsy
     */
    handleSubmit = input => {
        this.setState({
            isLoading: true,
            errors: null,
        });
        this.commitSendReminder(input)
            .then(() => {
                this.setState({ isLoading: false });
                this.handleCloseModal();
                toast.success('Reply sent successfully');
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
        const { handleOpenModal, handleCloseModal, handleSubmit } = this;
        const { responseId } = this.props;
        const { showModal } = this.state;

        if (!showModal) {
            return (
                <ViewResponseComponent
                    showModal={ showModal }
                    handleCloseModal={ handleCloseModal }
                    handleOpenModal={ handleOpenModal }
                    handleSubmit={ handleSubmit }
                />
            );
        }
        return (
            <QueryRenderer
                environment={ environment }
                query={ RESPONSE_QUERY }
                variables={ { id: responseId } }
                render={ ({ error, props: data }) => {
                    const isLoading = !error && !data;

                    let responseRaw = data?.node;
                    const response = responseRaw && {
                        firstName: responseRaw.review ? responseRaw.review.firstName : responseRaw.npsCampaignRecipient.firstName,
                        lastName: responseRaw.review ? responseRaw.review.lastName : responseRaw.npsCampaignRecipient.lastName,
                        userType: responseRaw.userType,
                        score: responseRaw.score,
                        campaignName: responseRaw.npsCampaignRecipient?.npsCampaign.title,
                        id: responseRaw.id,
                        campaignId: responseRaw.npsCampaignRecipient?.npsCampaign.id,
                        comment: responseRaw.comment,
                        recruiterFirstName: responseRaw.review ?
                            responseRaw.review.recruiter.firstName :
                            responseRaw.npsCampaignRecipient.recruiter?.firstName,
                        recruiterLastName: responseRaw.review ?
                            responseRaw.review.recruiter.lastName :
                            responseRaw.npsCampaignRecipient.recruiter?.lastName,
                        jobCategory: responseRaw.review ?
                            responseRaw.review.placement?.category?.name :
                            responseRaw.npsCampaignRecipient.jobCategory?.name,
                        reviewStatus: responseRaw.review ?
                            'Placed':
                            responseRaw.npsCampaignRecipient.npsCampaign?.recipientStatus,
                        replySubject: responseRaw.replySubject,
                        replyMessage: responseRaw.replyMessage,
                        email: responseRaw.npsCampaignRecipient?.email,
                        npsSurveyActivities: responseRaw.review ?
                            null :
                            responseRaw.npsCampaignRecipient.npsSurveyActivities,
                    };

                    return (
                        <ViewResponseComponent
                            isLoading={ isLoading }
                            response={ response }
                            showModal={ showModal }
                            handleCloseModal={ handleCloseModal }
                            handleOpenModal={ handleOpenModal }
                            handleSubmit={ handleSubmit }
                        />
                    );
                } }
            />
        );
    }
}

ViewResponseContainer.propTypes = {
    responseId: PropTypes.string.isRequired,
};

export default ViewResponseContainer;


