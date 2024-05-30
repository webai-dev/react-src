import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import getErrorMessage          from '../../../util/getErrorMessage';
import SendReminderComponent    from './SendReminderComponent';
import { toast }                from 'react-toastify';
import {
    graphql,
}                               from 'react-relay';
import {
    commitMutation,
    environment,
}                               from '../../../api';

const mutationSendReminderEmployer = graphql`
    mutation SendReminderContainerEmployerMutation($placement: ID!, $reviewerEmail: String) {
        mutator {
            requestEmployerReview(placement: $placement, reviewerEmail: $reviewerEmail) {
                id
                candidateEmail
                employerEmail
                lastCandidateReviewRequest
                lastEmployerReviewRequest
                candidateReminderCount
                employerReminderCount
            }
        }
    }
`;

const mutationSendReminderCandidate = graphql`
    mutation SendReminderContainerCandidateMutation($placement: ID!, $reviewerEmail: String) {
        mutator {
            requestCandidateReview(placement: $placement, reviewerEmail: $reviewerEmail) {
                id
                candidateEmail
                employerEmail
                lastCandidateReviewRequest
                lastEmployerReviewRequest
                candidateReminderCount
                employerReminderCount
            }
        }
    }
`;

class Index extends PureComponent {
    state = {
        isLoading: false,
        errors: null,
        showModal: false,
    };

    /**
     * Commit send sendReminder mutation
     *
     * @param {Object} input - object from formsy
     */
    commitSendReminder = input => {
        const variables = {
            placement: input.id,
            reviewerEmail: input.reviewerEmail,
        };

        return commitMutation(
            environment,
            {
                mutation: this.props.isCandidate ? mutationSendReminderCandidate : mutationSendReminderEmployer,
                variables,
            },
        );
    };

    /**
     * Handle send reminder and loading and error state
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
                toast.success('Your reminder was sent successfully');
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
        const { email, name, id } = this.props;
        const { handleOpenModal, handleCloseModal, handleSubmit } = this;
        const { showModal, errors } = this.state;
        return (
            <SendReminderComponent
                showModal={ showModal }
                handleSubmit={ handleSubmit }
                handleCloseModal={ handleCloseModal }
                handleOpenModal={ handleOpenModal }
                email={ email }
                name={ name }
                id={ id }
                errors={ errors }
            />
        );
    }
}

Index.propTypes = {
    email: PropTypes.string.isRequired,
    isCandidate: PropTypes.bool,
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
};

export default Index;
