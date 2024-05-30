import React, { PureComponent }        from 'react';
import PropTypes                       from 'prop-types';
import { toast }                       from 'react-toastify';
import { commitMutation, environment } from '../../../../../api';
import getErrorMessage                 from '../../../../../util/getErrorMessage';
import { graphql }                     from 'react-relay';
import QuickInviteComponent            from './QuickInviteComponent';

const mutation = graphql`
    mutation QuickInviteContainerMutation($input: InviteUserInput!) {
        mutator {
            inviteUser(input: $input) {
                viewer {
                    users {
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


class QuickInviteContainer extends PureComponent {
    state = {
        invited: false,
        isLoading: false,
        errors: null,
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
            .then(() => {
                this.setState({ isLoading: false, invited: true });
                toast.success('You have successfully invited team member');
            })
            .catch(error => {
                const errorParsed = getErrorMessage(error);
                toast.error(errorParsed.title);
                this.setState({
                    isLoading: false,
                    errors: errorParsed.message,
                });
            });
    };

    render() {
        const { errors, isLoading, invited } = this.state;
        const { handleSubmit } = this;
        const { id, teamMember } = this.props;

        return (
            <QuickInviteComponent
                invited={ invited }
                handleSubmit={ handleSubmit }
                errors={ errors }
                isLoading={ isLoading }
                id={ id }
                teamMember={ teamMember }
            />
        );
    }
}

QuickInviteContainer.propTypes = {
    id: PropTypes.string.isRequired,
    teamMember: PropTypes.object.isRequired
};

export default QuickInviteContainer;
