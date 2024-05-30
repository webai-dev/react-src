import React, { Component }            from 'react';
import PropTypes                       from 'prop-types';
import { graphql }                     from 'react-relay';
import { toast }                       from 'react-toastify';
import { commitMutation, environment } from '../../../../../api';
import getErrorMessage                 from '../../../../../util/getErrorMessage';
import RejectCandidateModalComponent   from './RejectCandidateModalComponent';

const mutation = graphql`
    mutation RejectCandidateModalContainerMutation($input: JobApplicationTransitionInput) {
        mutator {
            transitionJobApplication(input: $input) {
                jobApplication {
                    status
                }
                errors {
                    key
                    value
                }
            }
        }
    }
`;

class RejectCandidateModalContainer extends Component {
    state = {
        isLoading: false,
        errors: null,
    };

    /**
     * Commit send transitionJobApplication mutation
     *
     * @param {Object} input - object from formsy
     */
    commitRejectCandidate = input => {
        const variables = {
            input: {
                transition: 'reject',
                id: input.id,
                reason: input.reason
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
     * Handle send reminder and loading and error state
     *
     * @param {Object} input - object from formsy
     */
    handleSubmit = input => {
        this.setState({
            isLoading: true,
            errors: null,
        });
        this.commitRejectCandidate(input)
            .then(() => {
                this.setState({ isLoading: false });
                this.props.handleCloseModal();
                toast.success('Your reject candidate successfully');
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
        const { handleCloseModal, applicationId } = this.props;
        const { handleSubmit } = this;
        const { isLoading, errors } = this.state;

        return <RejectCandidateModalComponent
            applicationId={ applicationId }
            handleSubmit={ handleSubmit }
            handleCloseModal={ handleCloseModal }
            isLoading={ isLoading }
            errors={ errors }
        />;
    }
}

RejectCandidateModalContainer.propTypes = {
    handleCloseModal: PropTypes.func.isRequired,
    applicationId: PropTypes.string.isRequired,
};

export default RejectCandidateModalContainer;
