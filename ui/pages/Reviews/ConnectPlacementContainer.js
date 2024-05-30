import React, { PureComponent }  from 'react';
import PropTypes                 from 'prop-types';
import getErrorMessage           from '../../../util/getErrorMessage';
import ConnectPlacementComponent from './ConnectPlacementComponent';
import { toast }                 from 'react-toastify';
import {
    graphql,
}                                from 'react-relay';
import {
    commitMutation,
    environment,
}                                from '../../../api';

const mutation = graphql`
    mutation ConnectPlacementContainerMutation($input: UpdatePlacementInput!) {
        mutator {
            updatePlacement(input: $input) {
                placement {
                    id
                }
            }
        }
    }
`;

class ConnectPlacementContainer extends PureComponent {
    state = {
        isLoading: false,
        errors: null,
        showModal: false,
    };

    /**
     * Commit connect review to placement
     *
     * @param {Object} input - object from formsy
     */
    commitConnectReview = input => {
        const variables = {
            input: {
                id: input.placementId,
                placement: {
                    review: this.props.reviewId
                },
            }
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
     * Handle connect review to placement
     */
    handleSubmit = input => {
        this.setState({
            isLoading: true,
            errors: null,
        });
        this.commitConnectReview(input)
            .then(() => {
                this.setState({ isLoading: false });
                this.handleCloseModal();
                toast.success('You successfully connected review to placement');
                this.props.retry();
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
        const { reviewId, isCandidate } = this.props;
        const { handleOpenModal, handleCloseModal, handleSubmit } = this;
        const { showModal, isLoading, errors } = this.state;
        return (
            <ConnectPlacementComponent
                showModal={ showModal }
                handleSubmit={ handleSubmit }
                handleCloseModal={ handleCloseModal }
                handleOpenModal={ handleOpenModal }
                isCandidate={ isCandidate }
                reviewId={ reviewId }
                isLoading={ isLoading }
                errors={ errors }
            />
        );
    }
}

ConnectPlacementContainer.propTypes = {
    isCandidate: PropTypes.bool,
    reviewId: PropTypes.string.isRequired,
    retry: PropTypes.func.isRequired,
};

export default ConnectPlacementContainer;
