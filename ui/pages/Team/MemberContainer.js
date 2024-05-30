import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import MemberComponent          from './MemberComponent';

import {
    graphql,
} from 'react-relay';
import {
    commitMutation,
    environment,
} from '../../../api';

const mutationToggleAdmin = graphql`
    mutation MemberContainerToggleAdminMutation($id: ID!) {
        mutator {
            toggleAdmin(user: $id) {
                user {
                    ...on Recruiter {
                        id
                        roles
                    }
                    ...on User {
                        id
                        roles
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

const mutationVerification = graphql`
    mutation MemberContainerVerificationMutation($input: ResendVerificationInput!) {
        mutator {
            resendVerificationCode(input: $input) {
                viewer {
                    verified
                    approved
                    users {
                        ... on User {
                            id
                            email
                        }
                        ... on Recruiter {
                            id
                            email
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

const mutationToggle = graphql`
    mutation MemberContainerToggleMutation($input: ToggleUserApprovalInput!) {
        mutator {
            toggleUserApproval(input: $input) {
                updateSubscriptionUrl
                user {
                    ... on User {
                        approved
                        id
                    }
                    ... on Recruiter {
                        approved
                        id
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

const mutationRemove = graphql`
    mutation MemberContainerRemoveMutation($id: ID!) {
        mutator {
            removeUser(user: $id) {
                viewer {
                    subscriptionEstimate
                    users {
                        ... on User {
                            id
                        }
                        ... on Recruiter {
                            id
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


class MemberContainer extends PureComponent {
    state = {
        isLoadingVerification: false,
        errorsVerification: null,
        isLoadingToggle: false,
        errorsToggle: null,
        isLoadingRemove: false,
        errorsRemove: null,
        isLoadingToggleAdmin: false,
        errorsSetAdmin: null,
    };
    /**
     * Commit send verification mutation
     *
     * @param {string} userId
     * @param {string} email
     */
    commitSendReminder = (userId, email) => {
        const variables = {
            input: {
                userId,
                email
            }
        };

        return commitMutation(
            environment,
            {
                mutation: mutationVerification,
                variables,
            },
        );
    };

    /**
     * Handle send verification and corresponding app logic
     *
     * @param {string} userId
     * @param {string} email
     */
    handleSendVerification = (userId, email) => {
        this.setState({
            isLoadingVerification: true,
            errorsVerification: null,
        });
        this.commitSendReminder(userId, email)
            .then(() => {
                this.setState({ isLoadingVerification: false });
            });
    };

    /**
     * Commit set admin mutation
     *
     * @param {string} userId
     */
    commitSetAdmin = (userId) => {
        const variables = {
            id: userId
        };

        return commitMutation(
            environment,
            {
                mutation: mutationToggleAdmin,
                variables,
            },
        );
    };

    /**
     * Handle send set admin request and corresponding app logic
     *
     * @param {string} userId
     */
    handleToggleAdmin = (userId) => {
        this.setState({
            isLoadingToggleAdmin: true,
            errorsSetAdmin: null,
        });
        this.commitSetAdmin(userId)
            .then(() => {
                this.setState({ isLoadingToggleAdmin: false });
            });
    };

    /**
     * Commit disable or enable user for you company/agency
     *
     * @param {string} userId
     */
    commitToggle = (userId) => {
        const variables = {
            input: {
                userId
            }
        };

        return commitMutation(
            environment,
            {
                mutation: mutationToggle,
                variables
            },
        );
    };

    /**
     * Handle disable or enable user for you company/agency and corresponding app logic
     *
     * @param {string} userId
     */
    handleToggle = (userId) => {
        this.setState({
            isLoadingToggle: true,
            errorsToggle: null,
        });
        this.commitToggle(userId)
            .then(response => {
                if (response.mutator.toggleUserApproval.updateSubscriptionUrl) {
                    window.location.replace(response.mutator.toggleUserApproval.updateSubscriptionUrl);
                }
            });
    };

    /**
     * Commit remove user from your company/agency
     *
     * @param {string} userId
     */
    commitRemove = (userId) => {
        const variables = {
            id: userId
        };

        return commitMutation(
            environment,
            {
                mutation: mutationRemove,
                variables
            },
        );
    };

    /**
     * Handle remove user from you company/agency and corresponding app logic
     *
     * @param {string} userId
     */
    handleRemove = (userId) => {
        this.setState({
            isLoadingRemove: true,
            errorsRemove: null,
        });
        this.commitRemove(userId)
            .then(() => {
                this.setState({ isLoadingRemove: false });
            });
    };

    render() {
        const { handleSendVerification, handleToggle, handleToggleAdmin, handleRemove } = this;
        const { isLoadingVerification, isLoadingToggle, isLoadingToggleAdmin, isLoadingRemove } = this.state;
        const { member, isCompany, currentTab, myId, subscriptionEstimate } = this.props;
        return (
            <MemberComponent
                member={ member }
                isCompany={ isCompany }
                currentTab={ currentTab }
                myId={ myId }
                handleToggleAdmin={ handleToggleAdmin }
                handleSendVerification={ handleSendVerification }
                handleToggle={ handleToggle }
                handleRemove={ handleRemove }
                isLoadingVerification={ isLoadingVerification }
                isLoadingToggle={ isLoadingToggle }
                isLoadingToggleAdmin={ isLoadingToggleAdmin }
                isLoadingRemove={ isLoadingRemove }
                subscriptionEstimate={ subscriptionEstimate }
            />
        );
    }
}

MemberContainer.propTypes = {
    member: PropTypes.object.isRequired,
    isCompany: PropTypes.bool,
    currentTab: PropTypes.string.isRequired,
    myId: PropTypes.string.isRequired,
    subscriptionEstimate: PropTypes.number,
};

export default MemberContainer;
