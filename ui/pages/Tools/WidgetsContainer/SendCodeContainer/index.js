import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import getErrorMessage          from '../../../../../util/getErrorMessage';
import SendCodeComponent        from './SendCodeComponent';
import { toast }                from 'react-toastify';
import {
    graphql,
}                               from 'react-relay';
import {
    commitMutation,
    environment,
}                               from '../../../../../api';

const mutation = graphql`
    mutation SendCodeContainerMutation($email: String!, $url: String!) {
        mutator {
            response: sendWidget(email: $email, url: $url) {
                success,
                errors {
                    key,
                    value
                }
            }
        }
    }
`;


class SendCodeContainer extends PureComponent {
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
     * Commit send sendWidgetCode mutation
     *
     * @param {Object} input - object from formsy
     */
    commitSendReminder = input => {
        return commitMutation(
            environment,
            {
                mutation,
                variables: input,
            },
        );
    };

    /**
     * Handle send sendWidgetCode and loading and error state
     *
     * @param {Object} input - object from formsy
     */
    handleSubmit = input => {
        this.setState({
            isLoading: true,
            errors: null,
        });
        this.commitSendReminder(input)
            .then((responseRaw) => {
                this.setState({ isLoading: false });
                const response = responseRaw && responseRaw.mutator && responseRaw.mutator.response;

                if (!response.success) {
                    throw response.errors;
                }
                this.handleCloseModal();
                toast.success('Widget code email sent successfully');
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
        const { className, iframeUrl } = this.props;
        const { handleOpenModal, handleCloseModal, handleSubmit } = this;
        const { showModal } = this.state;
        return (
            <SendCodeComponent
                className={ className }
                showModal={ showModal }
                handleCloseModal={ handleCloseModal }
                handleOpenModal={ handleOpenModal }
                handleSubmit={ handleSubmit }
                iframeUrl={ iframeUrl }
            />
        );
    }
}

SendCodeContainer.propTypes = {
    className: PropTypes.string,
    iframeUrl: PropTypes.string.isRequired,
};

export default SendCodeContainer;
