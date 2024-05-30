import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import EditEmailComponent       from './EditEmailComponent';
import { graphql }              from 'react-relay';
import {
    commitMutation,
    environment,
} from '../../../api';
import { toast }       from 'react-toastify';
import getErrorMessage from '../../../util/getErrorMessage';

const EDIT_EMAIL = graphql`
    mutation EditEmailContainerMutation($email: String!) {
        mutator {
            requestUpdateEmail(email: $email) {
                success
                errors {
                    key
                    value
                }
            }
        }
    }
`;

class EditEmailContainer extends PureComponent {
    state = {
        isLoading: false,
        error: null,
        showModal: false,
    };

    /**
     * Commit edit email mutation
     *
     * @param {Object} input
     */
    commitEditEmail = (input) => {
        return commitMutation(
            environment,
            {
                mutation: EDIT_EMAIL,
                variables: input,
                errorPath: 'mutator.updateEmail.errors',
            },
        );
    };

    /**
     * Handle recruiter/agency profile edition and corresponding app logic
     *
     * @param input - represents GQL UpdateRecruiterProfileInput
     */
    handleSubmit = input => {
        this.setState({
            isLoading: true,
            error: null,
        });
        this.commitEditEmail(input)
            .then(() => {
                this.setState({ isLoading: false });
                this.handleCloseModal();
                toast.success('A verification email has been sent to your new email address. Please check it to change email');
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

    render() {
        const { email } = this.props;
        const { handleOpenModal, handleCloseModal, handleSubmit } = this;
        const { showModal, isLoading, error } = this.state;
        return (
            <EditEmailComponent
                email={ email }
                handleSubmit={ handleSubmit }
                showModal={ showModal }
                handleOpenModal={ handleOpenModal }
                handleCloseModal={ handleCloseModal }
                isLoading={ isLoading }
                error={ error }
            />
        );
    }
}

EditEmailContainer.propTypes = {
    email: PropTypes.string.isRequired,
};

export default EditEmailContainer;
