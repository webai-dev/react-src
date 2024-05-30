import React, { PureComponent }         from 'react';
import PropTypes                        from 'prop-types';
import { graphql, QueryRenderer }       from 'react-relay';
import { withRouter, generatePath }     from 'react-router-dom';
import { toast }                        from 'react-toastify';
import { commitMutation, environment }  from '../../../api';
import { PARAM_PLACEMENT_TYPE, ROUTES } from '../../../constants';
import getErrorMessage                  from '../../../util/getErrorMessage';
import JAInitialComponent               from './JAInitialComponent';

const TEAM_MEMBERS_QUERY = graphql`
    query JAInitialContainerQuery {
        viewer {
            showModalJa
        }
    }
`;

const mutation = graphql`
    mutation JAInitialContainerMutation($input: UpdateRecruiterProfileInput!) {
        mutator {
            updateRecruiterProfile(input: $input) {
                viewer {
                    showModalJa
                }
                errors {
                    key
                    value
                }
            }
        }
    }
`;

class TutorialRecruiterContainer extends PureComponent {
    state = {
        isLoading: false,
        errors: null,
    };


    /**
     * Commit send showModalJa: false using updateRecruiterProfile mutation
     */
    commitCompleteTutorial = () => {
        const variables = {
            input: {
                showModalJa: false
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
     * Handle read JA info modal and corresponding app logic
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
    handleGoToPlacements = () => {
        this.handleClose();
        this.props.history.push(generatePath(ROUTES.PLACEMENTS, { [ PARAM_PLACEMENT_TYPE._NAME ]: PARAM_PLACEMENT_TYPE.VISIBLE }));
    };

    render() {
        const { handleClose, handleGoToPlacements } = this;

        return (
            <QueryRenderer
                environment={ environment }
                query={ TEAM_MEMBERS_QUERY }
                render={
                    ({ error, props: data }) => {
                        if (!data || error || !data.viewer.showModalJa) {
                            return null;
                        }

                        return (
                            <JAInitialComponent
                                handleGoToPlacements={ handleGoToPlacements }
                                handleClose={ handleClose }
                            />
                        );
                    }
                }
            />
        );
    }
}

TutorialRecruiterContainer.propTypes = {
    history: PropTypes.object.isRequired,
};

export default withRouter(TutorialRecruiterContainer);
