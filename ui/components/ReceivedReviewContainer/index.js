import React, { PureComponent }        from 'react';
import PropTypes                       from 'prop-types';
import { graphql, QueryRenderer }      from 'react-relay';
import { withRouter, generatePath }    from 'react-router-dom';
import { toast }                       from 'react-toastify';
import { commitMutation, environment } from '../../../api';
import { REVIEWS_TAB, ROUTES }         from '../../../constants';
import getErrorMessage                 from '../../../util/getErrorMessage';
import ReceivedReviewComponent         from './ReceivedReviewComponent';

const TEAM_MEMBERS_QUERY = graphql`
    query ReceivedReviewContainerQuery {
        viewer {
            showModalReview
        }
    }
`;


const mutation = graphql`
    mutation ReceivedReviewContainerMutation($input: UpdateRecruiterProfileInput!) {
        mutator {
            updateRecruiterProfile(input: $input) {
                viewer {
                    showModalReview
                }
                errors {
                    key
                    value
                }
            }
        }
    }
`;

class ReceivedReviewContainer extends PureComponent {
    state = {
        isLoading: false,
        errors: null,
    };

    /**
     * Commit send showModalReview: false using updateRecruiterProfile mutation
     */
    commitCompleteTutorial = () => {
        const variables = {
            input: {
                showModalReview: false
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
     * Handle close showModalReview modal and corresponding app logic
     */
    handleSubmit = () => {
        this.setState({
            isLoading: true,
            errors: null,
        });
        this.commitCompleteTutorial()
            .then(() => {
                this.setState({
                    isLoading: false,
                });
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
     * Close modal
     */
    handleClose = () => {
        this.handleSubmit();
    };

    /**
     * Close modal and redirect to placements page
     */
    handleGoToReviews = () => {
        this.handleClose();
        this.props.history.push(generatePath(ROUTES.REVIEWS, { [ REVIEWS_TAB._NAME ]: REVIEWS_TAB.VERIFIED }));
    };

    render() {
        const { handleClose, handleGoToReviews } = this;

        return (
            <QueryRenderer
                environment={ environment }
                query={ TEAM_MEMBERS_QUERY }
                render={
                    ({ error, props: data }) => {
                        if (!data || error || !data.viewer.showModalReview) {
                            return null;
                        }

                        return (
                            <ReceivedReviewComponent
                                handleGoToReviews={ handleGoToReviews }
                                handleClose={ handleClose }
                            />
                        );
                    }
                }
            />
        );
    }
}

ReceivedReviewContainer.propTypes = {
    history: PropTypes.object.isRequired,
};

export default withRouter(ReceivedReviewContainer);
