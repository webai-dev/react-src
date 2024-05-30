import React, { PureComponent }  from 'react';
import PropTypes                 from 'prop-types';
import InviteTeamMemberComponent from './InviteTeamMemberComponent';
import { graphql }               from 'react-relay';
import { toast }                 from 'react-toastify';
import getErrorMessage           from '../../../util/getErrorMessage';
import {
    commitMutation,
    environment,
}                                from '../../../api';

const mutation = graphql`
    mutation InviteTeamMemberContainerMutation($input: InviteUserInput!) {
        mutator {
            inviteUser(input: $input) {
                updateSubscriptionUrl
                viewer {
                    users {
                        ... on User {
                            id
                            approved
                            firstName
                            lastName
                            jobTitle
                            roles
                            verified
                            approved
                            company {
                                id
                                name
                            }
                            profilePhoto {
                                url
                            }
                        }
                        ... on Recruiter {
                            id
                            firstName
                            lastName
                            jobTitle
                            roles
                            verified
                            approved
                            agency {
                                id
                                slug
                                name
                            }
                            specialisations {
                                name
                            }
                            profilePhoto {
                                url
                            }
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

class InviteTeamMemberContainer extends PureComponent {
    state = {
        isLoading: false,
        errors: null,
        isConfirmed: false,
    };
    /**
     * Will show confirm add paid recruiter modal
     */
    handleConfirm = () => {
        this.setState({ isConfirmed: true });
    };
    /**
     * Commit send invitation mutation
     *
     * @param {Object} input
     */
    commitInvite = (input) => {
        const variables = {
            input
        };

        return commitMutation(
            environment,
            {
                mutation,
                variables,
            },
        );
    };
    /**
     * Handle send invitation and corresponding app logic
     *
     * @param {Object} input
     */
    handleSubmit = (input) => {
        this.setState({
            isLoading: true,
            errors: null,
        });
        this.commitInvite(input)
            .then((response) => {
                this.setState({ isLoading: false });
                toast.success('You have successfully invited team member');
                this.props.handleCloseModal();
                if (response.mutator.inviteUser.updateSubscriptionUrl) {
                    window.location.replace(response.mutator.inviteUser.updateSubscriptionUrl);
                }
            })
            .catch(error => {
                const errorParsed = getErrorMessage(error);
                toast.error(errorParsed.title);
                this.setState({
                    isLoading: false,
                    error: errorParsed.message,
                });
            });
    };

    render() {
        const { handleCloseModal, isCompany, subscriptionEstimate } = this.props;
        const { handleSubmit, handleConfirm } = this;
        const { isLoading, error, isConfirmed } = this.state;
        return (
            <InviteTeamMemberComponent
                subscriptionEstimate={ subscriptionEstimate }
                handleCloseModal={ handleCloseModal }
                isLoading={ isLoading }
                handleSubmit={ handleSubmit }
                isCompany={ isCompany }
                error={ error }
                isConfirmed={ isConfirmed }
                handleConfirm={ handleConfirm }
            />
        );
    }
}

InviteTeamMemberContainer.propTypes = {
    handleCloseModal: PropTypes.func.isRequired,
    isCompany: PropTypes.bool,
    subscriptionEstimate: PropTypes.number,
};

export default InviteTeamMemberContainer;
