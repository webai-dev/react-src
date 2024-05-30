import React, { PureComponent }        from 'react';
import PropTypes                       from 'prop-types';
import { graphql, QueryRenderer }      from 'react-relay';
import { withRouter }                  from 'react-router-dom';
import { toast }                       from 'react-toastify';
import { commitMutation, environment } from '../../../api';
import { ROUTES }                      from '../../../constants';
import getErrorMessage                 from '../../../util/getErrorMessage';
import TutorialRecruiterComponent      from './TutorialRecruiterComponent';

const TEAM_MEMBERS_QUERY = graphql`
    query TutorialRecruiterContainerQuery {
        viewer {
            showModalSeries
            user {
                ... on Recruiter {
                    firstName
                }
            }
            users(claimed: false) {
                ... on Recruiter {
                    id
                    firstName
                    lastName
                    email
                }
            }
        }
    }
`;


const mutation = graphql`
    mutation TutorialRecruiterContainerMutation($input: UpdateRecruiterProfileInput!) {
        mutator {
            updateRecruiterProfile(input: $input) {
                viewer {
                    showModalSeries
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
        step: 1,
        isLoading: false,
        errors: null,
    };


    /**
     * Commit send complete tutorial using updateRecruiterProfile mutation
     */
    commitCompleteTutorial = () => {
        const variables = {
            input: {
                showModalSeries: false
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
     * Handle complete tutorial and corresponding app logic
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

    handleChangeStep = (step) => {
        this.setState({ step });
    };

    handleClose = () => {
        this.handleSubmit();
    };

    handleSendReview = () => {
        this.handleClose();
        this.props.history.push(ROUTES.PLACEMENTS_NEW);
    };

    render() {
        const { step } = this.state;
        const { handleChangeStep, handleClose, handleSendReview } = this;

        return (
            <QueryRenderer
                environment={ environment }
                query={ TEAM_MEMBERS_QUERY }
                render={
                    ({ error, props: data }) => {
                        if (!data || error || !data.viewer.showModalSeries) {
                            return null;
                        }

                        return (
                            <TutorialRecruiterComponent
                                user={ data.viewer.user }
                                users={ data.viewer.users }
                                step={ step }
                                handleSendReview={ handleSendReview }
                                handleChangeStep={ handleChangeStep }
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
