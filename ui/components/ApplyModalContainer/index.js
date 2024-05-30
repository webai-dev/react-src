import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { withRouter }           from 'react-router-dom';
import TEST_IDS                 from '../../../tests/testIds';
import gtmPush, {
    GTM_EVENTS,
    GTM_ACTIONS,
}                               from '../../../util/gtmPush';
import {
    QueryRenderer,
    graphql,
}                               from 'react-relay';
import { toast }                from 'react-toastify';
import getErrorMessage          from '../../../util/getErrorMessage';
import { isDevelopment }        from '../../../constants';
import {
    commitMutation,
    environment,
}                               from '../../../api';
import ApplyModalComponent      from './ApplyModalComponent';


const mutationApplyJob = graphql`
    mutation ApplyModalContainerMutation($input: RecruiterApplicationInput!) {
        mutator {
            applyToJob(input: $input) {
                application {
                    id
                    job {
                        id
                        myApplication {
                            id
                            status
                        }
                    }
                    recruiter {
                        id
                        agency {
                            name
                            id
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


const APPLY_TO_JOB_QUERY = graphql`
    query ApplyModalContainerQuery {
        viewer {
            user {
                ...on Recruiter {
                    applicationMessage
                }
            }
        }
    }
`;


class ApplyModalContainer extends PureComponent {
    state = {
        isLoading: false,
        error: null,
    };

    /**
     * Commit send applyToJob mutation
     *
     * @param {string} message
     * @param {string} id - job id
     * @param {boolean} save
     */
    commitApplyJob = ({ message, id, save }) => {
        return commitMutation(
            environment,
            {
                mutation: mutationApplyJob,
                variables: { input: { message, id, save } },
            },
        );
    };

    /**
     * Handle applyToJob and loading and error state
     *
     * @param {Object} input - object from formsy
     */
    handleSubmit = input => {
        this.setState({
            isLoading: true,
            errors: null,
        });
        this.commitApplyJob(input)
            .then(() => {
                gtmPush({
                    event: GTM_EVENTS.APPLY_JOB,
                    action: GTM_ACTIONS.JOB,
                    label: input.id, // job id
                });
                this.props.history.push('/my-jobs');
                toast.success(
                    'Job application successfully sent!',
                    { className: isDevelopment && TEST_IDS.APPLY_FOR_A_JOB_SUCCESS }
                );
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

    render() {
        const { handleSubmit } = this;
        const { isLoading } = this.state;
        const { job, handleClose } = this.props;

        return (
            <QueryRenderer
                environment={ environment }
                query={ APPLY_TO_JOB_QUERY }
                render={ ({ error, props: data }) => {
                    const isPageLoading = !error && !data;

                    return (
                        <ApplyModalComponent
                            handleCloseModal={ handleClose }
                            isLoading={ isLoading }
                            isPageLoading={ isPageLoading }
                            job={ job }
                            handleSubmit={ handleSubmit }
                            applicationMessage={ !isPageLoading ? data.viewer.user.applicationMessage : null }
                            error={ error }
                        />
                    );
                } }
            />
        );
    }
}

ApplyModalContainer.propTypes = {
    job: PropTypes.object.isRequired,
    handleClose: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(ApplyModalContainer);
