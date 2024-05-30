import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { toast }                from 'react-toastify';
import getErrorMessage          from '../../../util/getErrorMessage';
import EditReviewComponent      from './EditReviewComponent';
import {
    graphql,
}                               from 'react-relay';
import {
    commitMutation,
    environment,
}                               from '../../../api';

const mutationUpdateReview = graphql`
    mutation EditReviewContainerMutation($placement: UpdatePlacementInput!) {
        mutator {
            updatePlacement(input: $placement) {
                placement {
                    id
                    jobTitle
                    jobType
                    placementDate
                    employerFirstName
                    employerLastName
                    employerEmail
                    candidateFirstName
                    candidateLastName
                    candidateEmail
                    companyName
                }
                errors {
                    key
                    value
                }
            }
        }
    }
`;


class EditReviewContainer extends PureComponent {
    state = {
        isLoading: false,
        errors: null,
        showModal: false,
    };
    /**
     * Commit send update review (actually placement) mutation
     *
     * @param {Object} input - object from formsy
     */
    commitSendReminder = input => {
        const { sendReminder, ...placement } = input;
        const variables = {
            placement: {
                id: this.props.review.id,
                placement,
                sendReminder: sendReminder
            }
        };

        return commitMutation(
            environment,
            {
                mutation: mutationUpdateReview,
                variables,
            },
        );
    };

    /**
     * Handle placement update and corresponding app logic
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
                toast.success('You\'ve successfully edited the review request');
                this.handleCloseModal();
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
        const { review, isCandidate } = this.props;
        const { handleOpenModal, handleCloseModal, handleSubmit } = this;
        const { showModal, errors } = this.state;
        return (
            <EditReviewComponent
                handleSubmit={ handleSubmit }
                showModal={ showModal }
                handleCloseModal={ handleCloseModal }
                handleOpenModal={ handleOpenModal }
                review={ review }
                isCandidate={ isCandidate }
                errors={ errors }
            />
        );
    }
}

EditReviewContainer.propTypes = {
    review: PropTypes.object.isRequired,
    isCandidate: PropTypes.bool,
};

export default EditReviewContainer;
